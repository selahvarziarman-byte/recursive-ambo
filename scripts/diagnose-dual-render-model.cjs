#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  }).outputText;

  module._compile(output, filename);
};

const repoRoot = path.resolve(__dirname, '..');
const { createSeedShape } = require(path.join(repoRoot, 'src/data/seeds.ts'));
const {
  applyAmboDissection,
  canApplyAmboDissection,
} = require(path.join(repoRoot, 'src/lib/ambo.ts'));
const {
  applyPyritohedralDiagonalization,
  canApplyPyritohedralDiagonalization,
} = require(path.join(repoRoot, 'src/lib/pyritohedralDiagonalization.ts'));
const { isCellActiveFrontier } = require(path.join(repoRoot, 'src/lib/cellLifecycle.ts'));
const { buildDualUniverseRenderGeometry } = require(path.join(repoRoot, 'src/lib/dualView.ts'));
const { canonicalEdgeKey } = require(path.join(repoRoot, 'src/lib/ids.ts'));

const failures = [];

console.log('Dual Universe render-model diagnostics');
console.log('');

verifyLegacyRender('tetrahedron', { topology: 'tetrahedron', vertices: 4, faces: 4, edges: 6 });
verifyLegacyRender('octahedron', { topology: 'cube', vertices: 8, faces: 6, edges: 12 });
verifyLegacyRender('cube', { topology: 'octahedron', vertices: 6, faces: 8, edges: 12 });

verifySemanticRenderScenario({
  name: 'tetrahedron -> octahedron -> cuboctahedron -> pyritohedral-icosahedron',
  seedKey: 'tetrahedron',
  amboSteps: [
    step('dissect tetrahedron seed', selectSeedCell),
    step('dissect octahedron core', selectActiveCell({ kind: 'core', topology: 'octahedron' })),
  ],
});

verifySemanticRenderScenario({
  name: 'cube -> cuboctahedron -> pyritohedral-icosahedron',
  seedKey: 'cube',
  amboSteps: [step('dissect cube seed', selectSeedCell)],
});

verifyRhombicuboctahedronUnsupported();

if (failures.length) {
  console.error('');
  console.error('Diagnostics failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log('');
  console.log('Diagnostics passed.');
}

function verifyLegacyRender(seedKey, expected) {
  const shape = createSeedShape(seedKey);
  const cell = shape.cells[0];
  const renderGeometry = buildDualUniverseRenderGeometry(shape, cell);

  console.log(`legacy ${seedKey}: ${renderGeometry.kind}`);
  expect(renderGeometry.kind === 'legacy-proxy', `${seedKey}: expected legacy render geometry`);

  if (renderGeometry.kind !== 'legacy-proxy') {
    return;
  }

  expect(renderGeometry.topology === expected.topology, `${seedKey}: wrong render topology`);
  expect(renderGeometry.vertices.length === expected.vertices, `${seedKey}: wrong render vertex count`);
  expect(renderGeometry.faces.length === expected.faces, `${seedKey}: wrong render face count`);
  expect(renderGeometry.edges.length === expected.edges, `${seedKey}: wrong render edge count`);
  expect(
    renderGeometry.edges.every((edge) => Boolean(edge.id) && Boolean(edge.sourceEdgeId)),
    `${seedKey}: legacy render edges must come from the correspondence model`,
  );
  verifyLegacyCorrespondenceModel(
    seedKey,
    shape,
    cell,
    renderGeometry.viewModel.proxy.correspondenceModel,
    expected,
  );
  verifyRenderEdgesBackedByModel(
    seedKey,
    renderGeometry.edges,
    renderGeometry.viewModel.proxy.correspondenceModel,
  );
}

function verifyLegacyCorrespondenceModel(seedKey, shape, cell, model, expected) {
  const sourceFaces = getCellFaces(shape, cell);
  const sourceEdges = getCellEdges(shape, cell);
  const sourceFaceIds = sourceFaces.map((face) => face.id).sort();
  const sourceVertexIds = [...cell.vertexIds].sort();
  const sourceEdgeIds = sourceEdges.map((edge) => edge.id).sort();
  const dualVertexIds = Object.keys(model.dualVertices).sort();
  const dualFaceIds = model.dualFaces.map((face) => face.id).sort();
  const dualEdgeIds = model.dualEdges.map((edge) => edge.id).sort();

  expect(model.sourceCellId === cell.id, `${seedKey}: correspondence model source cell mismatch`);
  expect(model.dualTopologyLabel === expected.topology, `${seedKey}: correspondence model topology mismatch`);
  expectNoDuplicates(`${seedKey}: dual vertex ids`, dualVertexIds);
  expectNoDuplicates(`${seedKey}: dual face ids`, dualFaceIds);
  expectNoDuplicates(`${seedKey}: dual edge ids`, dualEdgeIds);
  verifyModelFaceEdgeCoherence(seedKey, model);
  expectSameSet(seedKey, 'legacy sourceFaceToDualVertex source keys', Object.keys(model.sourceFaceToDualVertex), sourceFaceIds);
  expectSameSet(seedKey, 'legacy sourceVertexToDualFace source keys', Object.keys(model.sourceVertexToDualFace), sourceVertexIds);
  expectSameSet(seedKey, 'legacy sourceEdgeToDualEdge source keys', Object.keys(model.sourceEdgeToDualEdge), sourceEdgeIds);
  verifyInverseMap(
    seedKey,
    'legacy sourceFaceToDualVertex',
    model.sourceFaceToDualVertex,
    model.dualVertexToSourceFace,
    sourceFaceIds,
    dualVertexIds,
  );
  verifyInverseMap(
    seedKey,
    'legacy sourceVertexToDualFace',
    model.sourceVertexToDualFace,
    model.dualFaceToSourceVertex,
    sourceVertexIds,
    dualFaceIds,
  );
  verifyInverseMap(
    seedKey,
    'legacy sourceEdgeToDualEdge',
    model.sourceEdgeToDualEdge,
    model.dualEdgeToSourceEdge,
    sourceEdgeIds,
    dualEdgeIds,
  );
}

function verifyModelFaceEdgeCoherence(label, model) {
  const boundaryEdgeCounts = getBoundaryEdgeCounts(model.dualFaces);
  const boundaryEdgeKeys = Array.from(boundaryEdgeCounts.keys()).sort();
  const modelEdgeKeys = model.dualEdges.map((edge) => canonicalEdgeKey(...edge.vertexIds)).sort();

  expectSameSet(label, 'dual face boundary edge keys', boundaryEdgeKeys, modelEdgeKeys);
  expectNoDuplicates(`${label}: model dual edge vertex-pair keys`, modelEdgeKeys);

  for (const edge of model.dualEdges) {
    const key = canonicalEdgeKey(...edge.vertexIds);

    expect(boundaryEdgeCounts.has(key), `${label}: model dual edge ${edge.id} missing from face boundary set`);
  }

  for (const [key, count] of boundaryEdgeCounts) {
    expect(count === 2, `${label}: dual face boundary edge ${key} occurs ${count} times`);
  }
}

function verifyRenderEdgesBackedByModel(label, renderEdges, model) {
  const modelEdgesByKey = new Map(
    model.dualEdges.map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]),
  );
  const renderEdgeKeys = renderEdges.map((edge) => canonicalEdgeKey(...edge.vertexIds)).sort();

  expectSameSet(label, 'render edge keys', renderEdgeKeys, Array.from(modelEdgesByKey.keys()).sort());
  expectNoDuplicates(`${label}: render edge vertex-pair keys`, renderEdgeKeys);

  for (const renderEdge of renderEdges) {
    const key = canonicalEdgeKey(...renderEdge.vertexIds);
    const modelEdge = modelEdgesByKey.get(key);

    expect(Boolean(modelEdge), `${label}: render edge ${key} is missing from correspondence model`);
    expect(
      !modelEdge || renderEdge.id === modelEdge.id,
      `${label}: render edge ${key} id does not match correspondence model`,
    );
    expect(
      !modelEdge || renderEdge.sourceEdgeId === modelEdge.sourceEdgeId,
      `${label}: render edge ${key} sourceEdgeId does not match correspondence model`,
    );
  }
}

function verifySemanticRenderScenario(scenario) {
  printDivider(scenario.name);

  const result = runPathToPyritohedralIcosahedron(scenario);

  if (!result) {
    return;
  }

  const { shape, sourceCell } = result;
  const before = snapshotShape(shape);
  const renderGeometry = buildDualUniverseRenderGeometry(shape, sourceCell);
  const rerun = buildDualUniverseRenderGeometry(shape, sourceCell);

  expect(shape.id === before.shapeId, `${scenario.name}: input shape id changed`);
  expect(shape.cells.length === before.cellCount, `${scenario.name}: input cell count changed`);
  expect(shape.generations.length === before.generationCount, `${scenario.name}: input generation count changed`);
  expect(JSON.stringify(shape) === before.serialized, `${scenario.name}: render projection mutated input shape`);

  expect(renderGeometry.kind === 'semantic-model', `${scenario.name}: expected semantic render geometry`);

  if (renderGeometry.kind !== 'semantic-model') {
    return;
  }

  const semanticModel = renderGeometry.viewModel.semanticModel;

  expect(renderGeometry.topology === 'dodecahedron', `${scenario.name}: wrong semantic render topology`);
  expect(renderGeometry.vertices.length === 20, `${scenario.name}: expected 20 render vertices`);
  expect(renderGeometry.faces.length === 12, `${scenario.name}: expected 12 render faces`);
  expect(renderGeometry.edges.length === 30, `${scenario.name}: expected 30 render edges`);
  expect(Object.keys(semanticModel.sourceFaceToDualVertex).length === 20, `${scenario.name}: missing face->vertex map`);
  expect(Object.keys(semanticModel.dualVertexToSourceFace).length === 20, `${scenario.name}: missing vertex->face map`);
  expect(Object.keys(semanticModel.sourceVertexToDualFace).length === 12, `${scenario.name}: missing vertex->face map`);
  expect(Object.keys(semanticModel.dualFaceToSourceVertex).length === 12, `${scenario.name}: missing face->vertex map`);
  expect(Object.keys(semanticModel.sourceEdgeToDualEdge).length === 30, `${scenario.name}: missing edge->edge map`);
  expect(Object.keys(semanticModel.dualEdgeToSourceEdge).length === 30, `${scenario.name}: missing inverse edge map`);
  expect(
    renderGeometry.edges.every((edge) => Boolean(edge.id) && Boolean(edge.sourceEdgeId)),
    `${scenario.name}: semantic render edges must come from semantic dual edges`,
  );
  expect(
    rerun.kind === 'semantic-model' && renderSignature(renderGeometry) === renderSignature(rerun),
    `${scenario.name}: repeated render projection produced different IDs or mappings`,
  );

  console.log(
    `semantic render ${describeCell(sourceCell)} -> ${renderGeometry.topology} ` +
      `${renderGeometry.vertices.length}V ${renderGeometry.edges.length}E ${renderGeometry.faces.length}F`,
  );
}

function verifyRhombicuboctahedronUnsupported() {
  printDivider('rhombicuboctahedron unsupported');

  let shape = createSeedShape('cube');
  shape = applyAmbo(shape, selectSeedCell(shape), 'cube seed');
  shape = applyAmbo(shape, selectActiveCell({ kind: 'core', topology: 'cuboctahedron' })(shape), 'cuboctahedron core');

  const rhombicuboctahedron = selectActiveCell({ kind: 'core', topology: 'rhombicuboctahedron' })(shape);

  if (!rhombicuboctahedron) {
    recordFailure('rhombicuboctahedron unsupported: did not reach rhombicuboctahedron');
    return;
  }

  const renderGeometry = buildDualUniverseRenderGeometry(shape, rhombicuboctahedron);

  console.log(`rhombicuboctahedron: ${renderGeometry.kind}`);
  expect(renderGeometry.kind === 'unsupported', 'rhombicuboctahedron: expected unsupported render geometry');
}

function runPathToPyritohedralIcosahedron(scenario) {
  let shape = createSeedShape(scenario.seedKey);

  for (const scenarioStep of scenario.amboSteps) {
    shape = applyAmbo(shape, scenarioStep.select(shape), scenarioStep.label);
  }

  const cuboctahedron = selectActiveCell({ kind: 'core', topology: 'cuboctahedron' })(shape);

  if (!cuboctahedron) {
    recordFailure(`${scenario.name}: did not reach cuboctahedron`);
    return null;
  }

  if (!canApplyPyritohedralDiagonalization(shape, cuboctahedron.id)) {
    recordFailure(`${scenario.name}: cuboctahedron was not pyritohedral-ready`);
    return null;
  }

  shape = applyPyritohedralDiagonalization(shape, cuboctahedron.id);

  const sourceCell = selectActiveCell({ kind: 'core', topology: 'pyritohedral-icosahedron' })(shape);

  if (!sourceCell) {
    recordFailure(`${scenario.name}: did not reach pyritohedral-icosahedron`);
    return null;
  }

  return { shape, sourceCell };
}

function applyAmbo(shape, targetCell, label) {
  if (!targetCell) {
    recordFailure(`Ambo path could not find target for ${label}`);
    return shape;
  }

  if (!isCellActiveFrontier(shape, targetCell.id) || !canApplyAmboDissection(shape, targetCell.id)) {
    recordFailure(`${describeCell(targetCell)} was not an active valid Ambo source for ${label}`);
    return shape;
  }

  return applyAmboDissection(shape, targetCell.id);
}

function renderSignature(renderGeometry) {
  if (renderGeometry.kind === 'unsupported') {
    return `unsupported:${renderGeometry.reason}`;
  }

  return [
    renderGeometry.kind,
    renderGeometry.topology,
    renderGeometry.vertices.map((vertex) => vertex.id).sort().join(','),
    renderGeometry.faces
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((face) => `${face.id}:${face.vertexIds.join('|')}`)
      .join(';'),
    renderGeometry.edges
      .slice()
      .sort((a, b) => canonicalEdgeKey(...a.vertexIds).localeCompare(canonicalEdgeKey(...b.vertexIds)))
      .map((edge) => `${edge.id ?? ''}:${canonicalEdgeKey(...edge.vertexIds)}:${edge.sourceEdgeId ?? ''}`)
      .join(';'),
    renderGeometry.kind === 'semantic-model'
      ? formatEntries(renderGeometry.viewModel.semanticModel.sourceEdgeToDualEdge)
      : '',
  ].join('\n');
}

function step(label, select) {
  return { label, select };
}

function getCellFaces(shape, cell) {
  const facesById = new Map(shape.faces.map((face) => [face.id, face]));

  return cell.faceIds.map((faceId) => facesById.get(faceId)).filter(Boolean);
}

function getCellEdges(shape, cell) {
  const edgesByKey = new Map(shape.edges.map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]));
  const edges = new Map();

  for (const face of getCellFaces(shape, cell)) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = canonicalEdgeKey(a, b);
      const edge = edgesByKey.get(key);

      if (edge) {
        edges.set(key, edge);
      }
    }
  }

  return Array.from(edges.values()).sort((a, b) => a.id.localeCompare(b.id));
}

function selectSeedCell(shape) {
  return selectActiveCell({ kind: 'seed' })(shape);
}

function selectActiveCell({ kind, topology }) {
  return (shape) =>
    sortedCells(shape.cells).find(
      (cell) =>
        isCellActiveFrontier(shape, cell.id) &&
        (!kind || cell.kind === kind) &&
        (!topology || getCellTopologyLabel(cell) === topology),
    ) ?? null;
}

function sortedCells(cells) {
  return [...cells].sort(
    (a, b) =>
      a.generationDepth - b.generationDepth ||
      getCellTopologyLabel(a).localeCompare(getCellTopologyLabel(b)) ||
      a.kind.localeCompare(b.kind) ||
      a.id.localeCompare(b.id),
  );
}

function getCellTopologyLabel(cell) {
  return cell.topology ?? cell.kind ?? 'unknown';
}

function describeCell(cell) {
  return `${cell.kind}/${getCellTopologyLabel(cell)}@g${cell.generationDepth}#${shortenId(cell.id)}`;
}

function snapshotShape(shape) {
  return {
    shapeId: shape.id,
    cellCount: shape.cells.length,
    generationCount: shape.generations.length,
    serialized: JSON.stringify(shape),
  };
}

function formatEntries(record) {
  return Object.entries(record)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join(';');
}

function verifyInverseMap(scenarioName, label, forward, reverse, expectedSources, expectedTargets) {
  expectSameSet(scenarioName, `${label} source keys`, Object.keys(forward), expectedSources);
  expectSameSet(scenarioName, `${label} reverse values`, Object.values(reverse), expectedSources);
  expectSameSet(scenarioName, `${label} target values`, Object.values(forward), expectedTargets);
  expectSameSet(scenarioName, `${label} target keys`, Object.keys(reverse), expectedTargets);

  for (const [sourceId, targetId] of Object.entries(forward)) {
    expect(reverse[targetId] === sourceId, `${scenarioName}: ${label} inverse mismatch at ${sourceId}`);
  }

  for (const [targetId, sourceId] of Object.entries(reverse)) {
    expect(forward[sourceId] === targetId, `${scenarioName}: ${label} forward mismatch at ${targetId}`);
  }
}

function expectSameSet(scenarioName, label, actual, expected) {
  const actualIds = [...actual].sort();
  const expectedIds = [...expected].sort();

  expect(
    actualIds.join(',') === expectedIds.join(','),
    `${scenarioName}: ${label} mismatch expected=${expectedIds.join(',')} actual=${actualIds.join(',')}`,
  );
}

function getBoundaryEdgeCounts(faces) {
  const edgeCounts = new Map();

  for (const face of faces) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = canonicalEdgeKey(a, b);

      edgeCounts.set(key, (edgeCounts.get(key) ?? 0) + 1);
    }
  }

  return edgeCounts;
}

function expectNoDuplicates(label, values) {
  expect(new Set(values).size === values.length, `${label} contains duplicate ids`);
}

function printDivider(label) {
  console.log('');
  console.log(`=== ${label} ===`);
}

function shortenId(id) {
  return id.length > 28 ? `${id.slice(0, 13)}...${id.slice(-8)}` : id;
}

function expect(condition, message) {
  if (!condition) {
    recordFailure(message);
  }
}

function recordFailure(message) {
  failures.push(message);
}

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
const {
  buildDualUniverseRenderGeometry,
  buildDualUniverseViewModel,
} = require(path.join(repoRoot, 'src/lib/dualView.ts'));
const { canonicalEdgeKey } = require(path.join(repoRoot, 'src/lib/ids.ts'));

const failures = [];

console.log('Dual View adapter diagnostics');
console.log('');

verifyLegacySeed('tetrahedron', { topology: 'tetrahedron', vertices: 4, edges: 6, faces: 4 });
verifyLegacySeed('octahedron', { topology: 'cube', vertices: 8, edges: 12, faces: 6 });
verifyLegacySeed('cube', { topology: 'octahedron', vertices: 6, edges: 12, faces: 8 });
verifyCuboctahedronCorrespondencePath({
  name: 'tetrahedron -> octahedron -> cuboctahedron',
  seedKey: 'tetrahedron',
  amboSteps: [
    step('dissect tetrahedron seed', selectSeedCell),
    step('dissect octahedron core', selectActiveCell({ kind: 'core', topology: 'octahedron' })),
  ],
});
verifyCuboctahedronCorrespondencePath({
  name: 'cube -> cuboctahedron',
  seedKey: 'cube',
  amboSteps: [step('dissect cube seed', selectSeedCell)],
});
verifyRhombicuboctahedronCorrespondencePath({
  name: 'tetrahedron -> octahedron -> cuboctahedron -> rhombicuboctahedron',
  seedKey: 'tetrahedron',
  amboSteps: [
    step('dissect tetrahedron seed', selectSeedCell),
    step('dissect octahedron core', selectActiveCell({ kind: 'core', topology: 'octahedron' })),
    step('dissect cuboctahedron core', selectActiveCell({ kind: 'core', topology: 'cuboctahedron' })),
  ],
});
verifyRhombicuboctahedronCorrespondencePath({
  name: 'cube -> cuboctahedron -> rhombicuboctahedron',
  seedKey: 'cube',
  amboSteps: [
    step('dissect cube seed', selectSeedCell),
    step('dissect cuboctahedron core', selectActiveCell({ kind: 'core', topology: 'cuboctahedron' })),
  ],
});

verifySemanticScenario({
  name: 'tetrahedron -> octahedron -> cuboctahedron -> pyritohedral-icosahedron',
  seedKey: 'tetrahedron',
  amboSteps: [
    step('dissect tetrahedron seed', selectSeedCell),
    step('dissect octahedron core', selectActiveCell({ kind: 'core', topology: 'octahedron' })),
  ],
});

verifySemanticScenario({
  name: 'cube -> cuboctahedron -> pyritohedral-icosahedron',
  seedKey: 'cube',
  amboSteps: [step('dissect cube seed', selectSeedCell)],
});

verifyRectifiedCoreCoreUnsupported();

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

function verifyLegacySeed(seedKey, expected) {
  const shape = createSeedShape(seedKey);
  const cell = shape.cells[0];

  verifyCorrespondenceCell(seedKey, shape, cell, expected);
}

function verifyCuboctahedronCorrespondencePath(scenario) {
  printDivider(scenario.name);

  let shape = createSeedShape(scenario.seedKey);

  for (const scenarioStep of scenario.amboSteps) {
    shape = applyAmbo(shape, scenarioStep.select(shape), scenarioStep.label);
  }

  const cell = selectActiveCell({ kind: 'core', topology: 'cuboctahedron' })(shape);

  if (!cell) {
    recordFailure(`${scenario.name}: did not reach cuboctahedron`);
    return;
  }

  verifyCorrespondenceCell(scenario.name, shape, cell, {
    topology: 'rhombic-dodecahedron',
    vertices: 14,
    edges: 24,
    faces: 12,
    faceSizeHistogram: { 4: 12 },
  });
}

function verifyRhombicuboctahedronCorrespondencePath(scenario) {
  printDivider(scenario.name);

  let shape = createSeedShape(scenario.seedKey);

  for (const scenarioStep of scenario.amboSteps) {
    shape = applyAmbo(shape, scenarioStep.select(shape), scenarioStep.label);
  }

  const cell = selectActiveCell({ kind: 'core', topology: 'rhombicuboctahedron' })(shape);

  if (!cell) {
    recordFailure(`${scenario.name}: did not reach rhombicuboctahedron`);
    return;
  }

  verifyCorrespondenceCell(scenario.name, shape, cell, {
    topology: 'deltoidal-icositetrahedron',
    vertices: 26,
    edges: 48,
    faces: 24,
    faceSizeHistogram: { 4: 24 },
  });
}

function verifyCorrespondenceCell(label, shape, cell, expected) {
  const viewModel = buildDualUniverseViewModel(shape, cell);
  const renderGeometry = buildDualUniverseRenderGeometry(shape, cell);

  console.log(`correspondence ${label}: ${viewModel.kind}`);
  expect(viewModel.kind === 'correspondence-proxy', `${label}: expected correspondence-proxy`);
  expect(renderGeometry.kind === 'correspondence-proxy', `${label}: expected correspondence render geometry`);

  if (viewModel.kind !== 'correspondence-proxy') {
    return;
  }

  expect(viewModel.correspondenceProxy.topology === expected.topology, `${label}: wrong correspondence dual topology`);
  expect(viewModel.correspondenceProxy.vertices.length === expected.vertices, `${label}: wrong correspondence vertex count`);
  expect(viewModel.correspondenceProxy.faces.length === expected.faces, `${label}: wrong correspondence face count`);
  expect(viewModel.correspondenceProxy.correspondenceModel.dualEdges.length === expected.edges, `${label}: wrong correspondence edge count`);
  verifyCorrespondenceModel(label, shape, cell, viewModel.correspondenceProxy.correspondenceModel, expected);

  if (renderGeometry.kind === 'correspondence-proxy') {
    expect(renderGeometry.edges.length === expected.edges, `${label}: wrong render edge count`);
    verifyRenderEdgesBackedByModel(label, renderGeometry.edges, viewModel.correspondenceProxy.correspondenceModel);
  }
}

function verifyCorrespondenceModel(seedKey, shape, cell, model, expected) {
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
  expect(model.dualVertices && model.dualFaces && model.dualEdges, `${seedKey}: missing correspondence model geometry`);
  expectNoDuplicates(`${seedKey}: dual vertex ids`, dualVertexIds);
  expectNoDuplicates(`${seedKey}: dual face ids`, dualFaceIds);
  expectNoDuplicates(`${seedKey}: dual edge ids`, dualEdgeIds);
  expect(dualVertexIds.length === sourceFaces.length, `${seedKey}: wrong correspondence dual vertex count`);
  expect(dualFaceIds.length === sourceVertexIds.length, `${seedKey}: wrong correspondence dual face count`);
  expect(dualEdgeIds.length === sourceEdgeIds.length, `${seedKey}: wrong correspondence dual edge count`);
  expect(
    model.dualEdges.every((edge) => Boolean(edge.id) && Boolean(edge.sourceEdgeId)),
    `${seedKey}: each correspondence dual edge must have an id and sourceEdgeId`,
  );
  if (expected.faceSizeHistogram) {
    expectSameHistogram(
      seedKey,
      'dual face sizes',
      histogram(model.dualFaces.map((face) => face.vertexIds.length)),
      expected.faceSizeHistogram,
    );
  }
  verifyModelFaceEdgeCoherence(seedKey, model);
  verifyInverseMap(
    seedKey,
    'correspondence sourceFaceToDualVertex',
    model.sourceFaceToDualVertex,
    model.dualVertexToSourceFace,
    sourceFaceIds,
    dualVertexIds,
  );
  verifyInverseMap(
    seedKey,
    'correspondence sourceVertexToDualFace',
    model.sourceVertexToDualFace,
    model.dualFaceToSourceVertex,
    sourceVertexIds,
    dualFaceIds,
  );
  verifyInverseMap(
    seedKey,
    'correspondence sourceEdgeToDualEdge',
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

function verifySemanticScenario(scenario) {
  printDivider(scenario.name);

  const result = runPathToPyritohedralIcosahedron(scenario);

  if (!result) {
    return;
  }

  const { shape, sourceCell } = result;
  const before = snapshotShape(shape);
  const viewModel = buildDualUniverseViewModel(shape, sourceCell);
  const rerun = buildDualUniverseViewModel(shape, sourceCell);

  expect(shape.id === before.shapeId, `${scenario.name}: input shape id changed`);
  expect(shape.cells.length === before.cellCount, `${scenario.name}: input cell count changed`);
  expect(shape.generations.length === before.generationCount, `${scenario.name}: input generation count changed`);
  expect(JSON.stringify(shape) === before.serialized, `${scenario.name}: adapter mutated input shape`);

  expect(viewModel.kind === 'semantic-model', `${scenario.name}: expected semantic-model`);

  if (viewModel.kind !== 'semantic-model') {
    return;
  }

  const semanticModel = viewModel.semanticModel;
  const sourceFaces = getCellFaces(shape, sourceCell);
  const sourceEdges = getCellEdges(shape, sourceCell);
  const sourceFaceIds = sourceFaces.map((face) => face.id).sort();
  const sourceVertexIds = [...sourceCell.vertexIds].sort();
  const sourceEdgeIds = sourceEdges.map((edge) => edge.id).sort();

  expect(semanticModel.dualCell.topology === 'dodecahedron', `${scenario.name}: wrong semantic topology`);
  expect(Object.keys(semanticModel.dualVertices).length === 20, `${scenario.name}: expected 20 dual vertices`);
  expect(semanticModel.dualEdges.length === 30, `${scenario.name}: expected 30 dual edges`);
  expect(semanticModel.dualFaces.length === 12, `${scenario.name}: expected 12 dual faces`);
  verifyInverseMap(
    scenario.name,
    'sourceFaceToDualVertex',
    semanticModel.sourceFaceToDualVertex,
    semanticModel.dualVertexToSourceFace,
    sourceFaceIds,
    Object.keys(semanticModel.dualVertices).sort(),
  );
  verifyInverseMap(
    scenario.name,
    'sourceVertexToDualFace',
    semanticModel.sourceVertexToDualFace,
    semanticModel.dualFaceToSourceVertex,
    sourceVertexIds,
    semanticModel.dualFaces.map((face) => face.id).sort(),
  );
  verifyInverseMap(
    scenario.name,
    'sourceEdgeToDualEdge',
    semanticModel.sourceEdgeToDualEdge,
    semanticModel.dualEdgeToSourceEdge,
    sourceEdgeIds,
    semanticModel.dualEdges.map((edge) => edge.id).sort(),
  );

  expect(
    rerun.kind === 'semantic-model' &&
      semanticViewSignature(viewModel) === semanticViewSignature(rerun),
    `${scenario.name}: repeated adapter call produced different semantic IDs or mappings`,
  );

  console.log(
    `semantic ${describeCell(sourceCell)} -> ${semanticModel.dualCell.topology} ` +
      `${Object.keys(semanticModel.dualVertices).length}V ${semanticModel.dualEdges.length}E ` +
      `${semanticModel.dualFaces.length}F`,
  );
}

function verifyRectifiedCoreCoreUnsupported() {
  printDivider('rectified-square-pyramid-ambo-core-ambo-core unsupported');

  let shape = createSeedShape('octahedron');
  shape = applyAmbo(shape, selectSeedCell(shape), 'octahedron seed');
  shape = applyAmbo(
    shape,
    selectActiveCell({ kind: 'residue', topology: 'square-pyramid' })(shape),
    'square-pyramid residue',
  );
  shape = applyAmbo(
    shape,
    selectActiveCell({ kind: 'core', topology: 'rectified-square-pyramid' })(shape),
    'rectified-square-pyramid core',
  );
  shape = applyAmbo(
    shape,
    selectActiveCell({ kind: 'core', topology: 'rectified-square-pyramid-ambo-core' })(shape),
    'rectified-square-pyramid-ambo-core core',
  );

  const unsupportedCore = selectActiveCell({
    kind: 'core',
    topology: 'rectified-square-pyramid-ambo-core-ambo-core',
  })(shape);

  if (!unsupportedCore) {
    recordFailure(
      'rectified-square-pyramid-ambo-core-ambo-core unsupported: did not reach unsupported core',
    );
    return;
  }

  verifyUnsupported(shape, unsupportedCore, 'rectified-square-pyramid-ambo-core-ambo-core');
}

function verifyUnsupported(shape, cell, label) {
  let viewModel = null;

  try {
    viewModel = buildDualUniverseViewModel(shape, cell);
  } catch (error) {
    recordFailure(`${label}: unsupported adapter call threw ${error instanceof Error ? error.message : error}`);
    return;
  }

  console.log(`${label}: ${viewModel.kind}`);
  expect(viewModel.kind === 'unsupported', `${label}: expected unsupported`);
  expect(
    viewModel.kind !== 'unsupported' || Boolean(viewModel.reason),
    `${label}: unsupported result missing reason`,
  );
}

function runPathToPyritohedralIcosahedron(scenario) {
  let shape = createSeedShape(scenario.seedKey);

  for (const scenarioStep of scenario.amboSteps) {
    const targetCell = scenarioStep.select(shape);

    shape = applyAmbo(shape, targetCell, scenarioStep.label);
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

function semanticViewSignature(viewModel) {
  if (viewModel.kind !== 'semantic-model') {
    return viewModel.kind;
  }

  const model = viewModel.semanticModel;

  return [
    model.dualModelId,
    model.dualCell.id,
    formatEntries(model.sourceFaceToDualVertex),
    formatEntries(model.sourceVertexToDualFace),
    formatEntries(model.sourceEdgeToDualEdge),
    model.dualFaces
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((face) => `${face.id}:${face.vertexIds.join('|')}:${face.sourceVertexId ?? ''}`)
      .join(';'),
    model.dualEdges
      .slice()
      .sort((a, b) => canonicalEdgeKey(...a.vertexIds).localeCompare(canonicalEdgeKey(...b.vertexIds)))
      .map((edge) => `${edge.id}:${canonicalEdgeKey(...edge.vertexIds)}:${edge.sourceEdgeId ?? ''}`)
      .join(';'),
  ].join('\n');
}

function step(label, select) {
  return { label, select };
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

function expectSameSet(scenarioName, label, actual, expected) {
  const actualIds = [...actual].sort();
  const expectedIds = [...expected].sort();

  expect(
    actualIds.join(',') === expectedIds.join(','),
    `${scenarioName}: ${label} mismatch expected=${expectedIds.join(',')} actual=${actualIds.join(',')}`,
  );
}

function expectSameHistogram(label, histogramLabel, actual, expected) {
  const actualEntries = formatHistogram(actual);
  const expectedEntries = Object.entries(expected)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([size, count]) => `${size}:${count}`)
    .join(',');

  expect(
    actualEntries === expectedEntries,
    `${label}: ${histogramLabel} mismatch expected=${expectedEntries} actual=${actualEntries}`,
  );
}

function histogram(values) {
  const counts = new Map();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return counts;
}

function formatHistogram(counts) {
  return Array.from(counts.entries())
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([size, count]) => `${size}:${count}`)
    .join(',');
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

function formatEntries(record) {
  return Object.entries(record)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join(';');
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

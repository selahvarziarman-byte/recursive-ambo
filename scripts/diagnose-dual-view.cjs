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
const { buildDualUniverseViewModel } = require(path.join(repoRoot, 'src/lib/dualView.ts'));
const { canonicalEdgeKey } = require(path.join(repoRoot, 'src/lib/ids.ts'));

const failures = [];

console.log('Dual View adapter diagnostics');
console.log('');

verifyLegacySeed('tetrahedron', { topology: 'tetrahedron', vertices: 4, faces: 4 });
verifyLegacySeed('octahedron', { topology: 'cube', vertices: 8, faces: 6 });
verifyLegacySeed('cube', { topology: 'octahedron', vertices: 6, faces: 8 });

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

verifyRhombicuboctahedronUnsupported();
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
  const viewModel = buildDualUniverseViewModel(shape, cell);

  console.log(`legacy ${seedKey}: ${viewModel.kind}`);
  expect(viewModel.kind === 'legacy-proxy', `${seedKey}: expected legacy-proxy`);

  if (viewModel.kind !== 'legacy-proxy') {
    return;
  }

  expect(viewModel.proxy.topology === expected.topology, `${seedKey}: wrong legacy dual topology`);
  expect(viewModel.proxy.vertices.length === expected.vertices, `${seedKey}: wrong legacy vertex count`);
  expect(viewModel.proxy.faces.length === expected.faces, `${seedKey}: wrong legacy face count`);
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

function verifyRhombicuboctahedronUnsupported() {
  printDivider('rhombicuboctahedron unsupported');

  let shape = createSeedShape('tetrahedron');
  shape = applyAmbo(shape, selectSeedCell(shape), 'tetrahedron seed');
  shape = applyAmbo(shape, selectActiveCell({ kind: 'core', topology: 'octahedron' })(shape), 'octahedron core');
  shape = applyAmbo(shape, selectActiveCell({ kind: 'core', topology: 'cuboctahedron' })(shape), 'cuboctahedron core');

  const rhombicuboctahedron = selectActiveCell({ kind: 'core', topology: 'rhombicuboctahedron' })(shape);

  if (!rhombicuboctahedron) {
    recordFailure('rhombicuboctahedron unsupported: did not reach rhombicuboctahedron');
    return;
  }

  verifyUnsupported(shape, rhombicuboctahedron, 'rhombicuboctahedron');
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

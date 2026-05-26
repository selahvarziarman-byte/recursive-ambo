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
const { buildSemanticDualModel } = require(path.join(repoRoot, 'src/lib/dualization.ts'));
const { isCellActiveFrontier } = require(path.join(repoRoot, 'src/lib/cellLifecycle.ts'));
const { getCellTopologySignature } = require(path.join(repoRoot, 'src/lib/topologySignature.ts'));
const { canonicalEdgeKey } = require(path.join(repoRoot, 'src/lib/ids.ts'));

const scenarios = [
  {
    name: 'tetrahedron -> octahedron -> cuboctahedron -> pyritohedral-icosahedron semantic dual',
    seedKey: 'tetrahedron',
    amboSteps: [
      step('dissect tetrahedron seed', selectSeedCell),
      step('dissect octahedron core', selectActiveCell({ kind: 'core', topology: 'octahedron' })),
    ],
  },
  {
    name: 'cube -> cuboctahedron -> pyritohedral-icosahedron semantic dual',
    seedKey: 'cube',
    amboSteps: [step('dissect cube seed', selectSeedCell)],
  },
];

const failures = [];

console.log('Semantic Dual Universe diagnostics');
console.log('');

for (const scenario of scenarios) {
  runScenario(scenario);
}

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

function runScenario(scenario) {
  printDivider(scenario.name);

  const pathResult = runPathToPyritohedralIcosahedron(scenario);

  if (!pathResult) {
    return;
  }

  const { shape, sourceCell } = pathResult;
  const before = snapshotShape(shape);
  const sourceFaces = getCellFaces(shape, sourceCell);
  const sourceEdges = getCellEdges(shape, sourceCell);
  const sourceFaceIds = sourceFaces.map((face) => face.id).sort();
  const sourceVertexIds = [...sourceCell.vertexIds].sort();
  const sourceEdgeIds = sourceEdges.map((edge) => edge.id).sort();
  const model = buildSemanticDualModel(shape, sourceCell.id);
  const rerun = buildSemanticDualModel(shape, sourceCell.id);

  verifySemanticDualModel({
    scenarioName: scenario.name,
    shape,
    sourceCell,
    before,
    model,
    sourceFaceIds,
    sourceVertexIds,
    sourceEdgeIds,
  });

  if (semanticModelSignature(model) !== semanticModelSignature(rerun)) {
    recordFailure(`${scenario.name}: repeated semantic dual build produced different IDs or mappings`);
  } else {
    console.log('deterministic rerun: dual IDs, face loops, and mappings match');
  }
}

function runPathToPyritohedralIcosahedron(scenario) {
  let shape = createSeedShape(scenario.seedKey);

  printShapeLine('initial seed', shape);

  for (let index = 0; index < scenario.amboSteps.length; index += 1) {
    const scenarioStep = scenario.amboSteps[index];
    const targetCell = scenarioStep.select(shape);
    const stepNumber = index + 1;

    if (!targetCell) {
      recordFailure(`${scenario.name}: Ambo step ${stepNumber} did not find a target`);
      return null;
    }

    if (!isCellActiveFrontier(shape, targetCell.id) || !canApplyAmboDissection(shape, targetCell.id)) {
      recordFailure(`${scenario.name}: ${describeCell(targetCell)} was not an active valid Ambo source`);
      return null;
    }

    shape = applyAmboDissection(shape, targetCell.id);

    console.log(`Ambo step ${stepNumber}: ${scenarioStep.label}`);
    printShapeLine(`after Ambo step ${stepNumber}`, shape);
  }

  const cuboctahedron = selectActiveCell({ kind: 'core', topology: 'cuboctahedron' })(shape);

  if (!cuboctahedron) {
    recordFailure(`${scenario.name}: did not reach an active cuboctahedron core`);
    return null;
  }

  if (!canApplyPyritohedralDiagonalization(shape, cuboctahedron.id)) {
    recordFailure(`${scenario.name}: cuboctahedron was not pyritohedral-ready`);
    return null;
  }

  shape = applyPyritohedralDiagonalization(shape, cuboctahedron.id);

  console.log(`Pyritohedral step: split ${describeCell(cuboctahedron)}`);
  printShapeLine('after pyritohedral diagonalization', shape);

  const sourceCell = selectActiveCell({ kind: 'core', topology: 'pyritohedral-icosahedron' })(shape);

  if (!sourceCell) {
    recordFailure(`${scenario.name}: did not reach an active pyritohedral-icosahedron core`);
    return null;
  }

  return { shape, sourceCell };
}

function verifySemanticDualModel({
  scenarioName,
  shape,
  sourceCell,
  before,
  model,
  sourceFaceIds,
  sourceVertexIds,
  sourceEdgeIds,
}) {
  expect(shape.id === before.shapeId, `${scenarioName}: input shape id changed`);
  expect(shape.generations.length === before.generationCount, `${scenarioName}: input generation count changed`);
  expect(shape.cells.length === before.cellCount, `${scenarioName}: input cell count changed`);
  expect(
    sortedIds(shape.cells.map((cell) => cell.id)).join(',') === before.cellIds.join(','),
    `${scenarioName}: input cell set changed`,
  );
  expect(JSON.stringify(shape) === before.serialized, `${scenarioName}: input shape object was mutated`);
  expect(shape.cells.some((cell) => cell.id === sourceCell.id), `${scenarioName}: source cell was replaced`);
  expect(isCellActiveFrontier(shape, sourceCell.id), `${scenarioName}: source cell is no longer active`);

  const dualShape = makeDualShapeForSignature(shape, model);
  const signature = getCellTopologySignature(dualShape, model.dualCell);
  const dualFaceIds = model.dualFaces.map((face) => face.id).sort();
  const dualEdgeIds = model.dualEdges.map((edge) => edge.id).sort();
  const dualVertexIds = Object.keys(model.dualVertices).sort();

  expect(model.sourceShapeId === shape.id, `${scenarioName}: wrong sourceShapeId`);
  expect(model.sourceCellId === sourceCell.id, `${scenarioName}: wrong sourceCellId`);
  expect(model.dualModelId.startsWith('shape:dual-universe:'), `${scenarioName}: semantic model id is not namespaced`);
  expect(model.dualCell.topology === 'dodecahedron', `${scenarioName}: dual cell is not dodecahedron`);
  expect(signature.vertexCount === 20, `${scenarioName}: expected 20 semantic dual vertices`);
  expect(signature.edgeCount === 30, `${scenarioName}: expected 30 semantic dual edges`);
  expect(signature.faceCount === 12, `${scenarioName}: expected 12 semantic dual faces`);
  expect(formatHistogram(signature.faceSizeHistogram) === '5:12', `${scenarioName}: expected semantic faces=5:12`);
  expect(formatHistogram(signature.vertexDegreeHistogram) === '3:20', `${scenarioName}: expected semantic degrees=3:20`);

  verifyInverseMap(
    scenarioName,
    'source face to dual vertex',
    model.sourceFaceToDualVertex,
    model.dualVertexToSourceFace,
    sourceFaceIds,
    dualVertexIds,
  );
  verifyInverseMap(
    scenarioName,
    'source vertex to dual face',
    model.sourceVertexToDualFace,
    model.dualFaceToSourceVertex,
    sourceVertexIds,
    dualFaceIds,
  );
  verifyInverseMap(
    scenarioName,
    'source edge to dual edge',
    model.sourceEdgeToDualEdge,
    model.dualEdgeToSourceEdge,
    sourceEdgeIds,
    dualEdgeIds,
  );

  verifyDualVertexLineage(scenarioName, model, sourceCell.id);
  verifyDualFaceLineage(scenarioName, model, sourceCell.id);
  verifyDualEdgeLineage(scenarioName, model, sourceCell.id);

  console.log(
    `semantic dual: ${describeCell(model.dualCell)} ${signature.vertexCount}V ${signature.edgeCount}E ` +
      `${signature.faceCount}F faces=${formatHistogram(signature.faceSizeHistogram)} ` +
      `degrees=${formatHistogram(signature.vertexDegreeHistogram)}`,
  );
}

function verifyDualVertexLineage(scenarioName, model, sourceCellId) {
  for (const [sourceFaceId, dualVertexId] of Object.entries(model.sourceFaceToDualVertex)) {
    const vertex = model.dualVertices[dualVertexId];
    const lineage = vertex?.data?.lineage;
    const sources = lineage?.sources ?? [];

    expect(Boolean(vertex), `${scenarioName}: missing dual vertex ${dualVertexId}`);
    expect(vertex.createdBy.operation === 'dualization', `${scenarioName}: dual vertex operation mismatch`);
    expect(vertex.createdBy.sourceFaceId === sourceFaceId, `${scenarioName}: dual vertex sourceFaceId mismatch`);
    expect(vertex.createdBy.sourceCellId === sourceCellId, `${scenarioName}: dual vertex sourceCellId mismatch`);
    expect(lineage?.inheritanceMode === 'derived-from-face', `${scenarioName}: dual vertex lineage mode mismatch`);
    expect(
      sources.some((source) => source.kind === 'face' && source.id === sourceFaceId),
      `${scenarioName}: dual vertex lineage missing source face`,
    );
    expect(
      sources.some((source) => source.kind === 'cell' && source.id === sourceCellId),
      `${scenarioName}: dual vertex lineage missing source cell`,
    );
  }
}

function verifyDualFaceLineage(scenarioName, model, sourceCellId) {
  const dualFaceById = new Map(model.dualFaces.map((face) => [face.id, face]));

  for (const [sourceVertexId, dualFaceId] of Object.entries(model.sourceVertexToDualFace)) {
    const face = dualFaceById.get(dualFaceId);
    const lineage = face?.lineage;
    const sources = lineage?.sources ?? [];

    expect(Boolean(face), `${scenarioName}: missing dual face ${dualFaceId}`);
    expect(face.role === 'dual-face-from-vertex', `${scenarioName}: dual face role mismatch`);
    expect(face.sourceVertexId === sourceVertexId, `${scenarioName}: dual face sourceVertexId mismatch`);
    expect(face.sourceCellId === sourceCellId, `${scenarioName}: dual face sourceCellId mismatch`);
    expect(lineage?.inheritanceMode === 'derived-from-vertex', `${scenarioName}: dual face lineage mode mismatch`);
    expect(
      sources.some((source) => source.kind === 'vertex' && source.id === sourceVertexId),
      `${scenarioName}: dual face lineage missing source vertex`,
    );
    expect(
      sources.some((source) => source.kind === 'cell' && source.id === sourceCellId),
      `${scenarioName}: dual face lineage missing source cell`,
    );
  }
}

function verifyDualEdgeLineage(scenarioName, model, sourceCellId) {
  const dualEdgeById = new Map(model.dualEdges.map((edge) => [edge.id, edge]));

  for (const [sourceEdgeId, dualEdgeId] of Object.entries(model.sourceEdgeToDualEdge)) {
    const edge = dualEdgeById.get(dualEdgeId);
    const lineage = edge?.lineage;
    const sources = lineage?.sources ?? [];

    expect(Boolean(edge), `${scenarioName}: missing dual edge ${dualEdgeId}`);
    expect(edge.sourceEdgeId === sourceEdgeId, `${scenarioName}: dual edge sourceEdgeId mismatch`);
    expect(edge.sourceCellId === sourceCellId, `${scenarioName}: dual edge sourceCellId mismatch`);
    expect(edge.role !== 'construction-diagonal', `${scenarioName}: dual edge copied construction role`);
    expect(lineage?.inheritanceMode === 'derived-from-edge', `${scenarioName}: dual edge lineage mode mismatch`);
    expect(
      sources.some((source) => source.kind === 'edge' && source.id === sourceEdgeId),
      `${scenarioName}: dual edge lineage missing source edge`,
    );
    expect(
      sources.some((source) => source.kind === 'cell' && source.id === sourceCellId),
      `${scenarioName}: dual edge lineage missing source cell`,
    );
  }
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

function semanticModelSignature(model) {
  return [
    model.dualModelId,
    model.dualCell.id,
    formatEntries(model.sourceFaceToDualVertex),
    formatEntries(model.sourceVertexToDualFace),
    formatEntries(model.sourceEdgeToDualEdge),
    model.dualFaces
      .slice()
      .sort((a, b) => (a.sourceVertexId ?? '').localeCompare(b.sourceVertexId ?? ''))
      .map((face) => `${face.sourceVertexId}:${face.id}:${face.vertexIds.join('|')}`)
      .join(';'),
    model.dualEdges
      .slice()
      .sort((a, b) => canonicalEdgeKey(...a.vertexIds).localeCompare(canonicalEdgeKey(...b.vertexIds)))
      .map((edge) => `${canonicalEdgeKey(...edge.vertexIds)}:${edge.id}:${edge.sourceEdgeId}`)
      .join(';'),
  ].join('\n');
}

function makeDualShapeForSignature(sourceShape, model) {
  return {
    id: model.dualModelId,
    name: `Semantic Dual ${sourceShape.name}`,
    seedKey: sourceShape.seedKey,
    vertices: model.dualVertices,
    edges: model.dualEdges,
    faces: model.dualFaces,
    cells: [model.dualCell],
    generations: [],
    genealogy: {
      parentShapeId: sourceShape.id,
      operation: 'dualization',
      generationDepth: model.dualCell.generationDepth,
      sourceVertexIds: model.dualCell.sourceVertexIds,
      createdVertexIds: model.dualCell.vertexIds,
      createdAt: 'semantic-dual-universe',
    },
  };
}

function snapshotShape(shape) {
  return {
    shapeId: shape.id,
    generationCount: shape.generations.length,
    cellCount: shape.cells.length,
    cellIds: sortedIds(shape.cells.map((cell) => cell.id)),
    serialized: JSON.stringify(shape),
  };
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

function printShapeLine(label, shape) {
  const topologyCounts = countBy(shape.cells, getCellTopologyLabel);

  console.log(`[${label}] shape=${shape.id} cells=${shape.cells.length} topologies=${formatCounts(topologyCounts)}`);
}

function countBy(values, getKey) {
  return values.reduce((counts, value) => {
    const key = getKey(value);

    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function expectSameSet(scenarioName, label, actual, expected) {
  const actualIds = sortedIds(actual);
  const expectedIds = sortedIds(expected);

  expect(
    actualIds.join(',') === expectedIds.join(','),
    `${scenarioName}: ${label} mismatch expected=${expectedIds.join(',')} actual=${actualIds.join(',')}`,
  );
}

function sortedIds(ids) {
  return [...ids].sort();
}

function formatEntries(record) {
  return Object.entries(record)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join(';');
}

function formatCounts(counts) {
  const entries = Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));

  if (!entries.length) {
    return 'none';
  }

  return entries.map(([key, count]) => `${key}:${count}`).join(' ');
}

function formatHistogram(histogram) {
  const entries = Object.entries(histogram).sort(([a], [b]) => Number(a) - Number(b));

  if (!entries.length) {
    return 'none';
  }

  return entries.map(([size, count]) => `${size}:${count}`).join(',');
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

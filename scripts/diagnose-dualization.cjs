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
const {
  applyDualization,
  canApplyDualization,
} = require(path.join(repoRoot, 'src/lib/dualization.ts'));
const {
  getCellLifecycleStatus,
  isCellActiveFrontier,
} = require(path.join(repoRoot, 'src/lib/cellLifecycle.ts'));
const {
  getCellTopologySignature,
} = require(path.join(repoRoot, 'src/lib/topologySignature.ts'));
const { canonicalEdgeKey } = require(path.join(repoRoot, 'src/lib/ids.ts'));

const scenarios = [
  {
    name: 'tetrahedron -> octahedron -> cuboctahedron -> pyritohedral-icosahedron -> dodecahedron',
    seedKey: 'tetrahedron',
    amboSteps: [
      step('dissect tetrahedron seed', selectSeedCell),
      step('dissect octahedron core', selectActiveCell({ kind: 'core', topology: 'octahedron' })),
    ],
  },
  {
    name: 'cube -> cuboctahedron -> pyritohedral-icosahedron -> dodecahedron',
    seedKey: 'cube',
    amboSteps: [step('dissect cube seed', selectSeedCell)],
  },
];

const failures = [];

console.log('Dualization diagnostics');
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

  const result = runPathToDodecahedron(scenario, false);
  const rerun = runPathToDodecahedron(scenario, true);

  if (!result || !rerun) {
    return;
  }

  if (result.determinismSignature !== rerun.determinismSignature) {
    recordFailure(`${scenario.name}: repeated run produced different dualization structure`);
  } else {
    console.log('deterministic rerun: dual vertices, face loops, and edge sources match');
  }
}

function runPathToDodecahedron(scenario, silent) {
  let shape = createSeedShape(scenario.seedKey);

  if (!silent) {
    printShapeLine('initial seed', shape);
  }

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

    if (!silent) {
      console.log(`Ambo step ${stepNumber}: ${scenarioStep.label}`);
      printShapeLine(`after Ambo step ${stepNumber}`, shape);
    }
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

  if (!silent) {
    console.log(`Pyritohedral step: split ${describeCell(cuboctahedron)}`);
    printShapeLine('after pyritohedral diagonalization', shape);
  }

  const sourceCell = selectActiveCell({ kind: 'core', topology: 'pyritohedral-icosahedron' })(shape);

  if (!sourceCell) {
    recordFailure(`${scenario.name}: did not reach an active pyritohedral-icosahedron core`);
    return null;
  }

  const sourceFaces = getCellFaces(shape, sourceCell);
  const sourceEdges = getCellEdges(shape, sourceCell);
  const sourceFaceIds = sourceFaces.map((face) => face.id).sort();
  const sourceVertexIds = [...sourceCell.vertexIds].sort();
  const sourceEdgeIds = sourceEdges.map((edge) => edge.id).sort();

  if (!canApplyDualization(shape, sourceCell.id)) {
    recordFailure(`${scenario.name}: pyritohedral-icosahedron was not dualization-ready`);
    return null;
  }

  const sourceCellId = sourceCell.id;
  shape = applyDualization(shape, sourceCell.id);

  if (!silent) {
    console.log(`Dualization step: dualize ${describeCell(sourceCell)}`);
    printShapeLine('after dualization', shape);
  }

  const resultCell = sortedCells(shape.cells).find((cell) => cell.topology === 'dodecahedron');

  if (!resultCell) {
    recordFailure(`${scenario.name}: result dodecahedron cell was not found`);
    return null;
  }

  const verification = verifyDualizationResult({
    scenarioName: scenario.name,
    shape,
    resultCell,
    sourceCellId,
    sourceFaceIds,
    sourceVertexIds,
    sourceEdgeIds,
  });

  if (!silent) {
    const signature = getCellTopologySignature(shape, resultCell);
    console.log(
      `result: ${describeCell(resultCell)} ${signature.vertexCount}V ${signature.edgeCount}E ` +
        `${signature.faceCount}F faces=${formatHistogram(signature.faceSizeHistogram)} ` +
        `degrees=${formatHistogram(signature.vertexDegreeHistogram)}`,
    );
  }

  return verification;
}

function verifyDualizationResult({
  scenarioName,
  shape,
  resultCell,
  sourceCellId,
  sourceFaceIds,
  sourceVertexIds,
  sourceEdgeIds,
}) {
  const latestGeneration = shape.generations[shape.generations.length - 1];
  const signature = getCellTopologySignature(shape, resultCell);
  const resultFaces = getCellFaces(shape, resultCell);
  const resultEdges = getCellEdges(shape, resultCell);
  const createdVertices = latestGeneration.createdVertexIds
    .map((vertexId) => shape.vertices[vertexId])
    .filter(Boolean);
  const dualFaces = resultFaces.filter((face) => face.role === 'dual-face-from-vertex');
  const sourceStillActive = isCellActiveFrontier(shape, sourceCellId);

  expect(resultCell.topology === 'dodecahedron', `${scenarioName}: wrong result topology`);
  expect(signature.vertexCount === 20, `${scenarioName}: expected 20 dodecahedron vertices`);
  expect(signature.edgeCount === 30, `${scenarioName}: expected 30 dodecahedron edges`);
  expect(signature.faceCount === 12, `${scenarioName}: expected 12 dodecahedron faces`);
  expect(formatHistogram(signature.faceSizeHistogram) === '5:12', `${scenarioName}: expected faces=5:12`);
  expect(formatHistogram(signature.vertexDegreeHistogram) === '3:20', `${scenarioName}: expected degrees=3:20`);
  expect(latestGeneration.sourceOperation === 'dualization', `${scenarioName}: latest operation is not dualization`);
  expect(latestGeneration.createdVertexIds.length === 20, `${scenarioName}: expected 20 created dual vertices`);
  expect(createdVertices.length === 20, `${scenarioName}: expected all created dual vertices to exist`);
  expect(dualFaces.length === 12, `${scenarioName}: expected 12 dual faces`);
  expect(resultEdges.length === 30, `${scenarioName}: expected 30 dual edges`);
  expect(!sourceStillActive, `${scenarioName}: source pyritohedral-icosahedron remains active`);
  expect(!canApplyAmboDissection(shape, resultCell.id), `${scenarioName}: dodecahedron should not be Ambo-operable`);
  expect(
    !canApplyPyritohedralDiagonalization(shape, resultCell.id),
    `${scenarioName}: dodecahedron should not be pyritohedral-operable`,
  );
  expect(!canApplyDualization(shape, resultCell.id), `${scenarioName}: dodecahedron should not be dualization-operable`);

  const createdSourceFaceIds = [];

  for (const vertex of createdVertices) {
    const lineage = vertex.data?.lineage;
    const lineageSources = lineage?.sources ?? [];

    expect(vertex.createdBy.operation === 'dualization', `${scenarioName}: dual vertex operation mismatch`);
    expect(Boolean(vertex.createdBy.sourceFaceId), `${scenarioName}: dual vertex missing sourceFaceId`);
    expect(vertex.createdBy.sourceCellId === sourceCellId, `${scenarioName}: dual vertex missing sourceCellId`);
    expect(lineage?.inheritanceMode === 'derived-from-face', `${scenarioName}: dual vertex lineage mode mismatch`);
    expect(
      lineageSources.some((source) => source.kind === 'face' && source.id === vertex.createdBy.sourceFaceId),
      `${scenarioName}: dual vertex lineage missing source face`,
    );
    expect(
      lineageSources.some((source) => source.kind === 'cell' && source.id === sourceCellId),
      `${scenarioName}: dual vertex lineage missing source cell`,
    );
    createdSourceFaceIds.push(vertex.createdBy.sourceFaceId);
  }

  expectSameCounts(
    scenarioName,
    'source faces used by dual vertices',
    sourceFaceIds,
    createdSourceFaceIds,
  );

  const dualFaceSourceVertexIds = [];

  for (const face of dualFaces) {
    const lineage = face.lineage;
    const lineageSources = lineage?.sources ?? [];

    expect(face.sourceCellId === sourceCellId, `${scenarioName}: dual face missing sourceCellId`);
    expect(Boolean(face.sourceVertexId), `${scenarioName}: dual face missing sourceVertexId`);
    expect(lineage?.inheritanceMode === 'derived-from-vertex', `${scenarioName}: dual face lineage mode mismatch`);
    expect(
      lineageSources.some((source) => source.kind === 'vertex' && source.id === face.sourceVertexId),
      `${scenarioName}: dual face lineage missing source vertex`,
    );
    expect(
      lineageSources.some((source) => source.kind === 'cell' && source.id === sourceCellId),
      `${scenarioName}: dual face lineage missing source cell`,
    );
    dualFaceSourceVertexIds.push(face.sourceVertexId);
  }

  expectSameCounts(
    scenarioName,
    'source vertices used by dual faces',
    sourceVertexIds,
    dualFaceSourceVertexIds,
  );

  const dualEdgeSourceEdgeIds = [];

  for (const edge of resultEdges) {
    const lineage = edge.lineage;
    const lineageSources = lineage?.sources ?? [];

    expect(Boolean(edge.sourceEdgeId), `${scenarioName}: dual edge missing sourceEdgeId`);
    expect(edge.sourceCellId === sourceCellId, `${scenarioName}: dual edge missing sourceCellId`);
    expect(edge.role !== 'construction-diagonal', `${scenarioName}: dual edge copied construction-diagonal role`);
    expect(lineage?.inheritanceMode === 'derived-from-edge', `${scenarioName}: dual edge lineage mode mismatch`);
    expect(
      lineageSources.some((source) => source.kind === 'edge' && source.id === edge.sourceEdgeId),
      `${scenarioName}: dual edge lineage missing source edge`,
    );
    expect(
      lineageSources.some((source) => source.kind === 'cell' && source.id === sourceCellId),
      `${scenarioName}: dual edge lineage missing source cell`,
    );
    dualEdgeSourceEdgeIds.push(edge.sourceEdgeId);
  }

  expectSameCounts(
    scenarioName,
    'source edges used by dual edges',
    sourceEdgeIds,
    dualEdgeSourceEdgeIds,
  );

  return {
    determinismSignature: [
      latestGeneration.createdVertexIds.slice().sort().join(','),
      dualFaces
        .slice()
        .sort((a, b) => (a.sourceVertexId ?? '').localeCompare(b.sourceVertexId ?? ''))
        .map((face) => `${face.sourceVertexId}:${face.vertexIds.join('|')}`)
        .join(';'),
      resultEdges
        .slice()
        .sort((a, b) => canonicalEdgeKey(...a.vertexIds).localeCompare(canonicalEdgeKey(...b.vertexIds)))
        .map((edge) => `${canonicalEdgeKey(...edge.vertexIds)}:${edge.sourceEdgeId}`)
        .join(';'),
    ].join('\n'),
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

function expectSameCounts(scenarioName, label, expected, actual) {
  const expectedCounts = countBy(expected, (value) => value);
  const actualCounts = countBy(actual, (value) => value);
  const expectedSignature = formatCounts(expectedCounts);
  const actualSignature = formatCounts(actualCounts);

  expect(
    expectedSignature === actualSignature,
    `${scenarioName}: ${label} mismatch expected=${expectedSignature} actual=${actualSignature}`,
  );
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

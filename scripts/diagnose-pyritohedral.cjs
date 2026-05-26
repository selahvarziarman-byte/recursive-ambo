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
  getCellLifecycleStatus,
  isCellActiveFrontier,
} = require(path.join(repoRoot, 'src/lib/cellLifecycle.ts'));
const {
  getCellTopologySignature,
} = require(path.join(repoRoot, 'src/lib/topologySignature.ts'));
const { canonicalEdgeKey } = require(path.join(repoRoot, 'src/lib/ids.ts'));

const scenarios = [
  {
    name: 'tetrahedron -> octahedron -> cuboctahedron -> pyritohedral-icosahedron',
    seedKey: 'tetrahedron',
    amboSteps: [
      step('dissect tetrahedron seed', selectSeedCell),
      step('dissect octahedron core', selectActiveCell({ kind: 'core', topology: 'octahedron' })),
    ],
  },
  {
    name: 'cube -> cuboctahedron -> pyritohedral-icosahedron',
    seedKey: 'cube',
    amboSteps: [step('dissect cube seed', selectSeedCell)],
  },
];

const failures = [];

console.log('Pyritohedral diagonalization diagnostics');
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

  const result = runPathToPyritohedral(scenario, false);
  const rerun = runPathToPyritohedral(scenario, true);

  if (!result || !rerun) {
    return;
  }

  if (result.diagonalKeySignature !== rerun.diagonalKeySignature) {
    recordFailure(`${scenario.name}: deterministic rerun selected different diagonal keys`);
  } else {
    console.log(`deterministic diagonal keys: ${result.diagonalKeySignature}`);
  }
}

function runPathToPyritohedral(scenario, silent) {
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

  const sourceCell = selectActiveCell({ kind: 'core', topology: 'cuboctahedron' })(shape);

  if (!sourceCell) {
    recordFailure(`${scenario.name}: did not reach an active cuboctahedron core`);
    return null;
  }

  const sourceFaces = getCellFaces(shape, sourceCell);
  const sourceSquareFaceIds = new Set(
    sourceFaces.filter((face) => face.vertexIds.length === 4).map((face) => face.id),
  );
  const sourceTriangleFaceIds = new Set(
    sourceFaces.filter((face) => face.vertexIds.length === 3).map((face) => face.id),
  );

  if (!canApplyPyritohedralDiagonalization(shape, sourceCell.id)) {
    recordFailure(`${scenario.name}: cuboctahedron was not pyritohedral-ready`);
    return null;
  }

  const sourceCellId = sourceCell.id;
  const sourceVertexIds = [...sourceCell.vertexIds];
  shape = applyPyritohedralDiagonalization(shape, sourceCell.id);

  if (!silent) {
    console.log(`Pyritohedral step: split ${describeCell(sourceCell)}`);
    printShapeLine('after pyritohedral diagonalization', shape);
  }

  const resultCell = sortedCells(shape.cells).find(
    (cell) => cell.topology === 'pyritohedral-icosahedron',
  );

  if (!resultCell) {
    recordFailure(`${scenario.name}: result pyritohedral-icosahedron cell was not found`);
    return null;
  }

  const diagonalEdges = shape.edges.filter((edge) => edge.role === 'construction-diagonal');
  const diagonalKeySignature = diagonalEdges
    .map((edge) => canonicalEdgeKey(...edge.vertexIds))
    .sort()
    .join(',');

  verifyPyritohedralResult({
    scenarioName: scenario.name,
    shape,
    resultCell,
    sourceCellId,
    sourceSquareFaceIds,
    sourceTriangleFaceIds,
    sourceVertexIds,
    diagonalEdges,
  });

  if (!silent) {
    const signature = getCellTopologySignature(shape, resultCell);

    console.log(
      `result: ${describeCell(resultCell)} ${signature.vertexCount}V ${signature.edgeCount}E ` +
        `${signature.faceCount}F faces=${formatHistogram(signature.faceSizeHistogram)} ` +
        `degrees=${formatHistogram(signature.vertexDegreeHistogram)}`,
    );
    console.log(`construction diagonals: ${diagonalKeySignature}`);
  }

  return { diagonalKeySignature, shape };
}

function verifyPyritohedralResult({
  scenarioName,
  shape,
  resultCell,
  sourceCellId,
  sourceSquareFaceIds,
  sourceTriangleFaceIds,
  sourceVertexIds,
  diagonalEdges,
}) {
  const latestGeneration = shape.generations[shape.generations.length - 1];
  const sourceStillActive = shape.cells.some(
    (cell) => cell.id === sourceCellId && isCellActiveFrontier(shape, cell.id),
  );
  const parentCells = latestGeneration.parentCellIds
    .map((cellId) => shape.cells.find((cell) => cell.id === cellId))
    .filter(Boolean);
  const resultFaces = getCellFaces(shape, resultCell);
  const preservedFaces = resultFaces.filter((face) => face.role === 'pyritohedral-preserved-face');
  const splitFaces = resultFaces.filter((face) => face.role === 'pyritohedral-split-face');
  const signature = getCellTopologySignature(shape, resultCell);

  expect(!sourceStillActive, `${scenarioName}: source cuboctahedron remains active`);
  expect(
    parentCells.some((cell) => getCellLifecycleStatus(shape, cell.id) === 'expanded'),
    `${scenarioName}: latest parent shell is not expanded/historical`,
  );
  expect(resultCell.topology === 'pyritohedral-icosahedron', `${scenarioName}: wrong result topology`);
  expect(signature.vertexCount === 12, `${scenarioName}: expected 12 result vertices`);
  expect(signature.edgeCount === 30, `${scenarioName}: expected 30 result edges`);
  expect(signature.faceCount === 20, `${scenarioName}: expected 20 result faces`);
  expect(
    formatHistogram(signature.faceSizeHistogram) === '3:20',
    `${scenarioName}: expected face histogram 3:20`,
  );
  expect(
    formatHistogram(signature.vertexDegreeHistogram) === '5:12',
    `${scenarioName}: expected degree histogram 5:12`,
  );
  expect(
    latestGeneration.sourceOperation === 'pyritohedral-diagonalization',
    `${scenarioName}: latest generation operation mismatch`,
  );
  expect(
    latestGeneration.createdVertexIds.length === 0,
    `${scenarioName}: pyritohedral operation should not create vertices`,
  );
  expect(diagonalEdges.length === 6, `${scenarioName}: expected exactly 6 construction diagonals`);
  expect(preservedFaces.length === 8, `${scenarioName}: expected 8 preserved triangular faces`);
  expect(splitFaces.length === 12, `${scenarioName}: expected 12 split triangular faces`);
  expect(
    !canApplyAmboDissection(shape, resultCell.id),
    `${scenarioName}: pyritohedral-icosahedron should not be Ambo-operable`,
  );
  expect(
    !canApplyPyritohedralDiagonalization(shape, resultCell.id),
    `${scenarioName}: pyritohedral-icosahedron should not be pyritohedral-operable`,
  );

  for (const edge of diagonalEdges) {
    expect(edge.sourceCellId === sourceCellId, `${scenarioName}: diagonal missing source cell`);
    expect(edge.sourceFaceId, `${scenarioName}: diagonal missing source face`);
    expect(
      sourceSquareFaceIds.has(edge.sourceFaceId),
      `${scenarioName}: diagonal source face was not one of the six source squares`,
    );
    expect(
      edge.lineage?.inheritanceMode === 'derived-from-face',
      `${scenarioName}: diagonal lineage is not derived-from-face`,
    );
  }

  for (const face of preservedFaces) {
    expect(face.sourceCellId === sourceCellId, `${scenarioName}: preserved face missing source cell`);
    expect(face.sourceFaceId, `${scenarioName}: preserved face missing source face`);
    expect(
      sourceTriangleFaceIds.has(face.sourceFaceId),
      `${scenarioName}: preserved face did not point to a source triangle`,
    );
  }

  for (const face of splitFaces) {
    expect(face.sourceCellId === sourceCellId, `${scenarioName}: split face missing source cell`);
    expect(face.sourceFaceId, `${scenarioName}: split face missing source face`);
    expect(
      sourceSquareFaceIds.has(face.sourceFaceId),
      `${scenarioName}: split face did not point to a source square`,
    );
  }

  const vertexUseCounts = new Map(sourceVertexIds.map((vertexId) => [vertexId, 0]));

  for (const edge of diagonalEdges) {
    for (const vertexId of edge.vertexIds) {
      vertexUseCounts.set(vertexId, (vertexUseCounts.get(vertexId) ?? 0) + 1);
    }
  }

  for (const vertexId of sourceVertexIds) {
    expect(
      vertexUseCounts.get(vertexId) === 1,
      `${scenarioName}: source vertex ${vertexId} was not used by exactly one construction diagonal`,
    );
  }
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

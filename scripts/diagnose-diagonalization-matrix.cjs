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
  buildDiagonalizationMatrices,
} = require(path.join(repoRoot, 'src/lib/diagonalizationMatrix.ts'));
const {
  applyPyritohedralDiagonalization,
  canApplyPyritohedralDiagonalization,
} = require(path.join(repoRoot, 'src/lib/pyritohedralDiagonalization.ts'));
const { isCellActiveFrontier } = require(path.join(repoRoot, 'src/lib/cellLifecycle.ts'));

const scenarios = [
  {
    name: 'tetrahedron -> Ambo -> octahedron -> Ambo -> cuboctahedron',
    seedKey: 'tetrahedron',
    amboSteps: [
      step('dissect tetrahedron seed', selectSeedCell),
      step('dissect octahedron core', selectActiveCell({ kind: 'core', topology: 'octahedron' })),
    ],
  },
  {
    name: 'cube -> Ambo -> cuboctahedron',
    seedKey: 'cube',
    amboSteps: [step('dissect cube seed', selectSeedCell)],
  },
];

const failures = [];

console.log('Diagonalization matrix reconstruction diagnostics');
console.log('');
console.log('Matrix convention: square [a,b,c,d] => rows [a,b], columns [c,d]');

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

  const source = buildCuboctahedronSource(scenario);

  if (!source) {
    return;
  }

  const { shape: sourceShape, sourceCell } = source;
  const sourceSquareFaceIds = new Set(
    getCellFaces(sourceShape, sourceCell)
      .filter((face) => face.vertexIds.length === 4)
      .map((face) => face.id),
  );

  console.log(`source cell: ${describeCell(sourceCell)}`);
  console.log(`source square faces: ${sourceSquareFaceIds.size}`);

  if (!canApplyPyritohedralDiagonalization(sourceShape, sourceCell.id)) {
    recordFailure(`${scenario.name}: cuboctahedron source was not pyritohedral-ready`);
    return;
  }

  const resultShape = applyPyritohedralDiagonalization(sourceShape, sourceCell.id);
  const resultCell = sortedCells(resultShape.cells).find(
    (cell) => cell.topology === 'pyritohedral-icosahedron',
  );

  if (!resultCell) {
    recordFailure(`${scenario.name}: result pyritohedral-icosahedron cell was not found`);
    return;
  }

  const reports = buildDiagonalizationMatrices(resultShape, resultCell);
  let okCount = 0;

  if (reports.length !== sourceSquareFaceIds.size) {
    recordFailure(
      `${scenario.name}: expected ${sourceSquareFaceIds.size} matrix reports, found ${reports.length}`,
    );
  }

  for (const report of reports) {
    printMatrixReport(resultShape, report);
    verifyMatrixReport(scenario.name, report, sourceSquareFaceIds);

    if (report.status === 'ok') {
      okCount += 1;
    }
  }

  console.log(`diagonalization matrices: ${okCount}/${sourceSquareFaceIds.size} MATRIX_OK`);

  if (okCount !== sourceSquareFaceIds.size) {
    recordFailure(`${scenario.name}: expected every square-face matrix to reconstruct cleanly`);
  }
}

function verifyMatrixReport(scenarioName, report, sourceSquareFaceIds) {
  const chosenEntries = report.diagonalEntries.filter(
    (entry) => entry.isChosenConstructionDiagonal,
  );
  const alternateEntries = report.diagonalEntries.filter((entry) => entry.isAlternateDiagonal);

  expect(
    sourceSquareFaceIds.has(report.sourceSquareFaceId),
    `${scenarioName}: report source face was not one of the source squares`,
  );
  expect(report.orderedVertexIds.length === 4, `${scenarioName}: report did not preserve 4 vertices`);
  expect(
    report.rows[0] === report.orderedVertexIds[0] &&
      report.rows[1] === report.orderedVertexIds[1] &&
      report.columns[0] === report.orderedVertexIds[2] &&
      report.columns[1] === report.orderedVertexIds[3],
    `${scenarioName}: report did not preserve [a,b] x [c,d] convention`,
  );
  expect(chosenEntries.length === 1, `${scenarioName}: expected exactly one chosen diagonal`);
  expect(alternateEntries.length === 1, `${scenarioName}: expected exactly one alternate diagonal`);
  expect(
    chosenEntries[0]?.edgeRole === 'construction-diagonal',
    `${scenarioName}: chosen diagonal missing construction-diagonal role`,
  );
  expect(
    report.diagonalEntries.every((entry) => !entry.isBoundary),
    `${scenarioName}: matrix diagonal entry was a boundary edge`,
  );
  expect(
    report.offDiagonalEntries.every(
      (entry) => entry.isBoundary && !entry.isChosenConstructionDiagonal,
    ),
    `${scenarioName}: off-diagonal entries were not boundary-only entries`,
  );
  expect(
    report.implicitBoundaryEntries.every(
      (entry) => entry.isBoundary && !entry.isChosenConstructionDiagonal,
    ),
    `${scenarioName}: implicit entries were not boundary-only entries`,
  );

  if (report.problems.length) {
    recordFailure(
      `${scenarioName}: ${shortenId(report.sourceSquareFaceId)} MATRIX_FAILED: ${report.problems.join('; ')}`,
    );
  }
}

function printMatrixReport(shape, report) {
  const [a, b, c, d] = report.orderedVertexIds;
  const { ac, ad, bc, bd } = report.entries;
  const columnC = formatVertexRef(shape, c).padEnd(18);
  const columnD = formatVertexRef(shape, d).padEnd(18);

  console.log('');
  console.log(`square face: ${shortenId(report.sourceSquareFaceId)}`);
  console.log(
    `vertices: ${formatVertexRef(shape, a)} ${formatVertexRef(shape, b)} ${formatVertexRef(
      shape,
      c,
    )} ${formatVertexRef(shape, d)}`,
  );
  console.log('matrix:');
  console.log(`       ${columnC} ${columnD}`);
  console.log(`${formatVertexRef(shape, a).padEnd(6)} ${formatMatrixCell(ac).padEnd(18)} ${formatMatrixCell(ad)}`);
  console.log(`${formatVertexRef(shape, b).padEnd(6)} ${formatMatrixCell(bc).padEnd(18)} ${formatMatrixCell(bd)}`);
  console.log(`chosen: ${report.chosenEntry ? report.chosenEntry.label : 'none'}`);
  console.log(`alternate: ${report.alternateEntry ? report.alternateEntry.label : 'none'}`);
  console.log(`off-diagonal boundary: ${report.offDiagonalEntries.map((entry) => entry.label).join(', ')}`);
  console.log(`implicit boundary: ${report.implicitBoundaryEntries.map((entry) => entry.label).join(', ')}`);
  console.log(`status: ${report.status === 'ok' ? 'MATRIX_OK' : `MATRIX_FAILED (${report.problems.join('; ')})`}`);
}

function formatMatrixCell(entry) {
  const marker = entry.isChosenConstructionDiagonal ? '*' : '';

  return `${entry.label}${marker}`;
}

function buildCuboctahedronSource(scenario) {
  let shape = createSeedShape(scenario.seedKey);

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
  }

  const sourceCell = selectActiveCell({ kind: 'core', topology: 'cuboctahedron' })(shape);

  if (!sourceCell) {
    recordFailure(`${scenario.name}: did not reach an active cuboctahedron core`);
    return null;
  }

  return { shape, sourceCell };
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

function formatVertexRef(shape, vertexId) {
  const vertex = shape.vertices[vertexId];
  const label = vertex?.data?.label;

  return label && label.trim() ? label : shortenId(vertexId);
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

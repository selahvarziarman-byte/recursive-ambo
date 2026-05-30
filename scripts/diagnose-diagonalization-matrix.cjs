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
const { canonicalEdgeKey } = require(path.join(repoRoot, 'src/lib/ids.ts'));

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
  const squareFaces = getCellFaces(sourceShape, sourceCell).filter((face) => face.vertexIds.length === 4);

  console.log(`source cell: ${describeCell(sourceCell)}`);
  console.log(`source square faces: ${squareFaces.length}`);

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

  const sourceBoundaryByKey = getCellBoundaryEdgeMap(sourceShape, sourceCell);
  const resultEdgesByKey = new Map(resultShape.edges.map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]));
  const constructionEdges = resultShape.edges.filter((edge) => edge.role === 'construction-diagonal');
  const constructionEdgesBySourceFaceId = new Map();

  for (const edge of constructionEdges) {
    if (!edge.sourceFaceId) {
      recordFailure(`${scenario.name}: construction diagonal ${edge.id} missing sourceFaceId`);
      continue;
    }

    const existing = constructionEdgesBySourceFaceId.get(edge.sourceFaceId) ?? [];
    existing.push(edge);
    constructionEdgesBySourceFaceId.set(edge.sourceFaceId, existing);
  }

  let okCount = 0;

  for (const face of squareFaces) {
    const report = auditSquareMatrix({
      scenarioName: scenario.name,
      sourceShape,
      resultEdgesByKey,
      sourceBoundaryByKey,
      constructionEdgesBySourceFaceId,
      face,
    });

    printMatrixReport(sourceShape, report);

    if (report.ok) {
      okCount += 1;
    } else {
      recordFailure(`${scenario.name}: ${shortenId(face.id)} MATRIX_FAILED: ${report.problems.join('; ')}`);
    }
  }

  console.log(`diagonalization matrices: ${okCount}/${squareFaces.length} MATRIX_OK`);

  if (okCount !== squareFaces.length) {
    recordFailure(`${scenario.name}: expected every square-face matrix to reconstruct cleanly`);
  }
}

function auditSquareMatrix({
  scenarioName,
  sourceShape,
  resultEdgesByKey,
  sourceBoundaryByKey,
  constructionEdgesBySourceFaceId,
  face,
}) {
  const problems = [];

  if (face.vertexIds.length !== 4) {
    problems.push(`expected 4 vertices, found ${face.vertexIds.length}`);
  }

  const [a, b, c, d] = face.vertexIds;
  const vertexIds = [a, b, c, d].filter(Boolean);
  const missingVertexIds = vertexIds.filter((vertexId) => !sourceShape.vertices[vertexId]);

  if (missingVertexIds.length) {
    problems.push(`missing vertices: ${missingVertexIds.map(shortenId).join(', ')}`);
  }

  const entries = {
    ac: makeMatrixEntry('AC', [a, c]),
    ad: makeMatrixEntry('AD', [a, d]),
    bc: makeMatrixEntry('BC', [b, c]),
    bd: makeMatrixEntry('BD', [b, d]),
    ab: makeMatrixEntry('AB', [a, b]),
    cd: makeMatrixEntry('CD', [c, d]),
  };
  const diagonalEntries = [entries.ac, entries.bd];
  const offDiagonalEntries = [entries.ad, entries.bc];
  const implicitEntries = [entries.ab, entries.cd];
  const constructionEdges = constructionEdgesBySourceFaceId.get(face.id) ?? [];
  const constructionKeys = new Set(constructionEdges.map((edge) => canonicalEdgeKey(...edge.vertexIds)));

  for (const entry of Object.values(entries)) {
    entry.sourceEdge = sourceBoundaryByKey.get(entry.key) ?? null;
    entry.resultEdge = resultEdgesByKey.get(entry.key) ?? null;
    entry.isBoundary = Boolean(entry.sourceEdge);
    entry.isConstructionDiagonal = constructionKeys.has(entry.key);
  }

  const chosenDiagonalEntries = diagonalEntries.filter((entry) => entry.isConstructionDiagonal);
  const alternateDiagonalEntries = diagonalEntries.filter((entry) => !entry.isConstructionDiagonal);
  const diagonalBoundaryEntries = diagonalEntries.filter((entry) => entry.isBoundary);
  const offDiagonalNonBoundaryEntries = offDiagonalEntries.filter((entry) => !entry.isBoundary);
  const implicitNonBoundaryEntries = implicitEntries.filter((entry) => !entry.isBoundary);

  if (constructionEdges.length !== 1) {
    problems.push(`expected 1 construction diagonal for source square, found ${constructionEdges.length}`);
  }

  if (chosenDiagonalEntries.length !== 1) {
    problems.push(`expected exactly one matrix diagonal chosen, found ${chosenDiagonalEntries.length}`);
  }

  for (const edge of constructionEdges) {
    const key = canonicalEdgeKey(...edge.vertexIds);

    if (!diagonalEntries.some((entry) => entry.key === key)) {
      problems.push(`construction edge ${formatEntryVertexIds(sourceShape, edge.vertexIds)} is not AC or BD`);
    }

    if (edge.role !== 'construction-diagonal') {
      problems.push(`chosen edge ${edge.id} missing construction-diagonal role`);
    }
  }

  if (diagonalBoundaryEntries.length) {
    problems.push(
      `matrix diagonals were boundary edges: ${diagonalBoundaryEntries.map((entry) => entry.label).join(', ')}`,
    );
  }

  if (offDiagonalNonBoundaryEntries.length) {
    problems.push(
      `off-diagonal entries were not boundary edges: ${offDiagonalNonBoundaryEntries
        .map((entry) => entry.label)
        .join(', ')}`,
    );
  }

  if (implicitNonBoundaryEntries.length) {
    problems.push(
      `implicit entries were not boundary edges: ${implicitNonBoundaryEntries
        .map((entry) => entry.label)
        .join(', ')}`,
    );
  }

  if (alternateDiagonalEntries.length === 1 && alternateDiagonalEntries[0].isConstructionDiagonal) {
    problems.push(`${alternateDiagonalEntries[0].label} was incorrectly marked chosen`);
  }

  for (const entry of offDiagonalEntries) {
    if (entry.resultEdge?.role === 'construction-diagonal') {
      problems.push(`${entry.label} boundary/off-diagonal entry was marked construction-diagonal`);
    }
  }

  for (const entry of implicitEntries) {
    if (entry.resultEdge?.role === 'construction-diagonal') {
      problems.push(`${entry.label} implicit boundary entry was marked construction-diagonal`);
    }
  }

  const chosen = chosenDiagonalEntries[0] ?? null;
  const alternate = chosen ? diagonalEntries.find((entry) => entry.key !== chosen.key) ?? null : null;

  return {
    scenarioName,
    face,
    entries,
    diagonalEntries,
    offDiagonalEntries,
    implicitEntries,
    chosen,
    alternate,
    problems,
    ok: problems.length === 0,
  };
}

function printMatrixReport(shape, report) {
  const [a, b, c, d] = report.face.vertexIds;
  const { ac, ad, bc, bd } = report.entries;
  const columnC = formatVertexRef(shape, c).padEnd(18);
  const columnD = formatVertexRef(shape, d).padEnd(18);

  console.log('');
  console.log(`square face: ${shortenId(report.face.id)}`);
  console.log(`vertices: ${formatVertexRef(shape, a)} ${formatVertexRef(shape, b)} ${formatVertexRef(shape, c)} ${formatVertexRef(shape, d)}`);
  console.log('matrix:');
  console.log(`       ${columnC} ${columnD}`);
  console.log(`${formatVertexRef(shape, a).padEnd(6)} ${formatMatrixCell(ac).padEnd(18)} ${formatMatrixCell(ad)}`);
  console.log(`${formatVertexRef(shape, b).padEnd(6)} ${formatMatrixCell(bc).padEnd(18)} ${formatMatrixCell(bd)}`);
  console.log(`chosen: ${report.chosen ? report.chosen.label : 'none'}`);
  console.log(`alternate: ${report.alternate ? report.alternate.label : 'none'}`);
  console.log(`off-diagonal boundary: ${report.offDiagonalEntries.map((entry) => entry.label).join(', ')}`);
  console.log(`implicit boundary: ${report.implicitEntries.map((entry) => entry.label).join(', ')}`);
  console.log(`status: ${report.ok ? 'MATRIX_OK' : `MATRIX_FAILED (${report.problems.join('; ')})`}`);
}

function makeMatrixEntry(label, vertexIds) {
  return {
    label,
    vertexIds,
    key: canonicalEdgeKey(...vertexIds),
    sourceEdge: null,
    resultEdge: null,
    isBoundary: false,
    isConstructionDiagonal: false,
  };
}

function formatMatrixCell(entry) {
  const marker = entry.isConstructionDiagonal ? '*' : '';

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

function getCellBoundaryEdgeMap(shape, cell) {
  const edgesByKey = new Map(shape.edges.map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]));
  const boundaryEdgesByKey = new Map();

  for (const face of getCellFaces(shape, cell)) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = canonicalEdgeKey(a, b);

      boundaryEdgesByKey.set(key, edgesByKey.get(key) ?? { vertexIds: [a, b] });
    }
  }

  return boundaryEdgesByKey;
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

function formatEntryVertexIds(shape, vertexIds) {
  return vertexIds.map((vertexId) => formatVertexRef(shape, vertexId)).join('-');
}

function printDivider(label) {
  console.log('');
  console.log(`=== ${label} ===`);
}

function shortenId(id) {
  return id.length > 28 ? `${id.slice(0, 13)}...${id.slice(-8)}` : id;
}

function recordFailure(message) {
  failures.push(message);
}

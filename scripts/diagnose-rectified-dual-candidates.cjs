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
const { isCellActiveFrontier } = require(path.join(repoRoot, 'src/lib/cellLifecycle.ts'));
const {
  getCellTopologySignature,
} = require(path.join(repoRoot, 'src/lib/topologySignature.ts'));
const { buildDualCorrespondenceModel } = require(path.join(repoRoot, 'src/lib/dualView.ts'));
const { canonicalEdgeKey } = require(path.join(repoRoot, 'src/lib/ids.ts'));

const auditFailures = [];
const candidateResults = [];

const candidateExpectations = [
  {
    sourceTopology: 'square-pyramid',
    dualTopologyLabel: 'dual-square-pyramid',
    vertexCount: 5,
    edgeCount: 8,
    faceCount: 5,
    faceSizeHistogram: { 3: 4, 4: 1 },
    vertexDegreeHistogram: { 3: 4, 4: 1 },
  },
  {
    sourceTopology: 'rectified-square-pyramid',
    dualTopologyLabel: 'dual-rectified-square-pyramid',
    vertexCount: 8,
    edgeCount: 16,
    faceCount: 10,
    faceSizeHistogram: { 3: 8, 4: 2 },
    vertexDegreeHistogram: { 4: 8 },
  },
  {
    sourceTopology: 'rectified-square-pyramid-ambo-core',
    dualTopologyLabel: 'dual-rectified-square-pyramid-ambo-core',
    vertexCount: 16,
    edgeCount: 32,
    faceCount: 18,
    faceSizeHistogram: { 3: 8, 4: 10 },
    vertexDegreeHistogram: { 4: 16 },
  },
  {
    sourceTopology: 'rectified-square-pyramid-ambo-core-ambo-core',
    dualTopologyLabel: 'dual-rectified-square-pyramid-ambo-core-ambo-core',
    vertexCount: 32,
    edgeCount: 64,
    faceCount: 34,
    faceSizeHistogram: { 3: 8, 4: 26 },
    vertexDegreeHistogram: { 4: 32 },
  },
];

console.log('Rectified-branch dual correspondence candidate diagnostics');
console.log('This audit calls buildDualCorrespondenceModel directly and does not enable runtime policy.');
console.log('');

const branchCandidates = buildRectifiedBranchCandidates();

for (const candidate of branchCandidates) {
  auditCandidate(candidate);
}

printSummary();

if (auditFailures.length) {
  console.error('');
  console.error('Audit fixture failures:');

  for (const failure of auditFailures) {
    console.error(`- ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log('');
  console.log('Audit completed.');
}

function buildRectifiedBranchCandidates() {
  const candidates = [];
  let shape = createSeedShape('octahedron');
  const seedCell = requireActiveCell(shape, { kind: 'seed', topology: 'octahedron' }, 'octahedron seed');

  printDivider('rectified branch fixture');

  if (!seedCell) {
    return candidates;
  }

  console.log(`seed: ${describeCell(seedCell)} ${formatSignature(shape, seedCell)}`);
  shape = applyAmboChecked(shape, seedCell, 'octahedron seed');

  const cuboctahedron = requireActiveCell(shape, {
    kind: 'core',
    topology: 'cuboctahedron',
  }, 'cuboctahedron core after octahedron Ambo');
  const squarePyramid = requireActiveCell(shape, {
    kind: 'residue',
    topology: 'square-pyramid',
  }, 'square-pyramid residue after octahedron Ambo');

  if (cuboctahedron) {
    console.log(`after octahedron Ambo core: ${describeCell(cuboctahedron)} ${formatSignature(shape, cuboctahedron)}`);
  }

  if (squarePyramid) {
    console.log(`selected residue: ${describeCell(squarePyramid)} ${formatSignature(shape, squarePyramid)}`);
    candidates.push(makeCandidate(shape, squarePyramid, 'square-pyramid'));
    shape = applyAmboChecked(shape, squarePyramid, 'square-pyramid residue');
  } else {
    return candidates;
  }

  const rectifiedSquarePyramid = requireActiveCell(shape, {
    kind: 'core',
    topology: 'rectified-square-pyramid',
  }, 'rectified-square-pyramid core after square-pyramid Ambo');

  if (rectifiedSquarePyramid) {
    console.log(
      `after square-pyramid Ambo core: ${describeCell(rectifiedSquarePyramid)} ` +
        formatSignature(shape, rectifiedSquarePyramid),
    );
    candidates.push(makeCandidate(shape, rectifiedSquarePyramid, 'rectified-square-pyramid'));
    shape = applyAmboChecked(shape, rectifiedSquarePyramid, 'rectified-square-pyramid core');
  } else {
    return candidates;
  }

  const rectifiedAmboCore = requireActiveCell(shape, {
    kind: 'core',
    topology: 'rectified-square-pyramid-ambo-core',
  }, 'rectified-square-pyramid-ambo-core after rectified-square-pyramid Ambo');

  if (rectifiedAmboCore) {
    console.log(
      `after rectified-square-pyramid Ambo core: ${describeCell(rectifiedAmboCore)} ` +
        formatSignature(shape, rectifiedAmboCore),
    );
    candidates.push(makeCandidate(shape, rectifiedAmboCore, 'rectified-square-pyramid-ambo-core'));
    shape = applyAmboChecked(shape, rectifiedAmboCore, 'rectified-square-pyramid-ambo-core core');
  } else {
    return candidates;
  }

  const rectifiedAmboCoreAmboCore = requireActiveCell(shape, {
    kind: 'core',
    topology: 'rectified-square-pyramid-ambo-core-ambo-core',
  }, 'rectified-square-pyramid-ambo-core-ambo-core after rectified-square-pyramid-ambo-core Ambo');

  if (rectifiedAmboCoreAmboCore) {
    console.log(
      `after rectified-square-pyramid-ambo-core Ambo core: ${describeCell(rectifiedAmboCoreAmboCore)} ` +
        formatSignature(shape, rectifiedAmboCoreAmboCore),
    );
    candidates.push(
      makeCandidate(shape, rectifiedAmboCoreAmboCore, 'rectified-square-pyramid-ambo-core-ambo-core'),
    );
  }

  return candidates;
}

function makeCandidate(shape, cell, sourceTopology) {
  const expectation = candidateExpectations.find((candidate) => candidate.sourceTopology === sourceTopology);

  if (!expectation) {
    recordAuditFailure(`${sourceTopology}: missing candidate expectation`);
  }

  return {
    shape,
    cell,
    expectation,
  };
}

function auditCandidate({ shape, cell, expectation }) {
  if (!cell || !expectation) {
    return;
  }

  const label = `${expectation.sourceTopology} -> ${expectation.dualTopologyLabel}`;
  const sourceProblems = [];
  const modelProblems = [];
  const beforeJson = JSON.stringify(shape);
  const sourceFaces = getCellFaces(shape, cell);
  const sourceEdges = getCellEdges(shape, cell);
  const incidentFacesByEdgeKey = getIncidentFacesByEdgeKey(sourceFaces);
  const signature = getCellTopologySignature(shape, cell);

  printDivider(label);
  console.log(`source cell: ${describeCell(cell)}`);
  console.log(
    `source topology: ${signature.topology}; counts ${signature.vertexCount}V ` +
      `${signature.edgeCount}E ${signature.faceCount}F`,
  );
  console.log(`source face-size histogram: ${formatRecordHistogram(signature.faceSizeHistogram)}`);
  console.log(`source vertex-degree histogram: ${formatRecordHistogram(signature.vertexDegreeHistogram)}`);

  verifySourceStructure(label, expectation, signature, sourceEdges, incidentFacesByEdgeKey, sourceProblems);

  if (sourceProblems.length) {
    console.log(`source structural issues: ${sourceProblems.join('; ')}`);
  } else {
    console.log(`source edge incidence: all ${sourceEdges.length} source edges have exactly two incident source faces`);
  }

  let model = null;
  let thrownError = null;

  try {
    model = buildDualCorrespondenceModel(shape, cell, expectation.dualTopologyLabel);
  } catch (error) {
    thrownError = error;
  }

  if (JSON.stringify(shape) !== beforeJson) {
    modelProblems.push('direct candidate builder mutated source shape');
  }

  if (thrownError) {
    modelProblems.push(`direct candidate builder threw: ${formatError(thrownError)}`);
  }

  if (thrownError || modelProblems.length) {
    recordCandidateResult('CANDIDATE_MODEL_FAILED', expectation, sourceProblems, modelProblems, null);
    return;
  }

  if (!model) {
    recordCandidateResult(
      'CANDIDATE_MODEL_NULL',
      expectation,
      sourceProblems,
      ['direct candidate builder returned null'],
      null,
    );
    return;
  }

  verifyCandidateModel(
    label,
    expectation,
    shape,
    cell,
    sourceFaces,
    sourceEdges,
    incidentFacesByEdgeKey,
    model,
    modelProblems,
  );

  const status = sourceProblems.length || modelProblems.length ? 'CANDIDATE_MODEL_FAILED' : 'CANDIDATE_MODEL_OK';

  recordCandidateResult(status, expectation, sourceProblems, modelProblems, model);
}

function verifySourceStructure(label, expectation, signature, sourceEdges, incidentFacesByEdgeKey, problems) {
  expectCandidate(
    signature.topology === expectation.sourceTopology,
    `${label}: expected source topology ${expectation.sourceTopology}, got ${signature.topology}`,
    problems,
  );
  expectCandidate(
    signature.vertexCount === expectation.vertexCount,
    `${label}: expected ${expectation.vertexCount} source vertices, got ${signature.vertexCount}`,
    problems,
  );
  expectCandidate(
    signature.edgeCount === expectation.edgeCount,
    `${label}: expected ${expectation.edgeCount} source edges, got ${signature.edgeCount}`,
    problems,
  );
  expectCandidate(
    signature.faceCount === expectation.faceCount,
    `${label}: expected ${expectation.faceCount} source faces, got ${signature.faceCount}`,
    problems,
  );
  expectCandidate(
    sameRecordHistogram(signature.faceSizeHistogram, expectation.faceSizeHistogram),
    `${label}: expected face-size histogram ${formatRecordHistogram(expectation.faceSizeHistogram)}, ` +
      `got ${formatRecordHistogram(signature.faceSizeHistogram)}`,
    problems,
  );
  expectCandidate(
    sameRecordHistogram(signature.vertexDegreeHistogram, expectation.vertexDegreeHistogram),
    `${label}: expected vertex-degree histogram ${formatRecordHistogram(expectation.vertexDegreeHistogram)}, ` +
      `got ${formatRecordHistogram(signature.vertexDegreeHistogram)}`,
    problems,
  );

  for (const edge of sourceEdges) {
    const incidentFaces = incidentFacesByEdgeKey.get(canonicalEdgeKey(...edge.vertexIds)) ?? [];

    expectCandidate(
      incidentFaces.length === 2,
      `${label}: source edge ${edge.id} has ${incidentFaces.length} incident source faces`,
      problems,
    );
  }
}

function verifyCandidateModel(
  label,
  expectation,
  shape,
  cell,
  sourceFaces,
  sourceEdges,
  incidentFacesByEdgeKey,
  model,
  problems,
) {
  const sourceFaceIds = sourceFaces.map((face) => face.id).sort();
  const sourceVertexIds = [...cell.vertexIds].sort();
  const sourceEdgeIds = sourceEdges.map((edge) => edge.id).sort();
  const dualVertexIds = Object.keys(model.dualVertices).sort();
  const dualFaceIds = model.dualFaces.map((face) => face.id).sort();
  const dualEdgeIds = model.dualEdges.map((edge) => edge.id).sort();

  expectCandidate(model.sourceCellId === cell.id, `${label}: model source cell mismatch`, problems);
  expectCandidate(
    model.dualTopologyLabel === expectation.dualTopologyLabel,
    `${label}: model topology label mismatch expected=${expectation.dualTopologyLabel} ` +
      `actual=${model.dualTopologyLabel}`,
    problems,
  );
  expectCandidate(
    dualVertexIds.length === sourceFaces.length,
    `${label}: dual vertex count ${dualVertexIds.length} should equal source face count ${sourceFaces.length}`,
    problems,
  );
  expectCandidate(
    dualFaceIds.length === cell.vertexIds.length,
    `${label}: dual face count ${dualFaceIds.length} should equal source vertex count ${cell.vertexIds.length}`,
    problems,
  );
  expectCandidate(
    dualEdgeIds.length === sourceEdges.length,
    `${label}: dual edge count ${dualEdgeIds.length} should equal source edge count ${sourceEdges.length}`,
    problems,
  );
  expectNoDuplicates(`${label}: candidate dual vertex ids`, dualVertexIds, problems);
  expectNoDuplicates(`${label}: candidate dual face ids`, dualFaceIds, problems);
  expectNoDuplicates(`${label}: candidate dual edge ids`, dualEdgeIds, problems);
  verifyInverseMap(
    label,
    'sourceFaceToDualVertex',
    model.sourceFaceToDualVertex,
    model.dualVertexToSourceFace,
    sourceFaceIds,
    dualVertexIds,
    problems,
  );
  verifyInverseMap(
    label,
    'sourceVertexToDualFace',
    model.sourceVertexToDualFace,
    model.dualFaceToSourceVertex,
    sourceVertexIds,
    dualFaceIds,
    problems,
  );
  verifyInverseMap(
    label,
    'sourceEdgeToDualEdge',
    model.sourceEdgeToDualEdge,
    model.dualEdgeToSourceEdge,
    sourceEdgeIds,
    dualEdgeIds,
    problems,
  );
  expectCandidate(
    Object.values(model.dualVertices).every((vertex) => Array.isArray(vertex.position) && vertex.position.length === 3),
    `${label}: every candidate dual vertex should have a Vec3 position`,
    problems,
  );
  expectCandidate(
    model.dualFaces.every((face) => face.vertexIds.every((vertexId) => Boolean(model.dualVertices[vertexId]))),
    `${label}: every candidate dual face vertex should exist in dualVertices`,
    problems,
  );
  expectCandidate(
    model.dualEdges.every((edge) => edge.vertexIds.every((vertexId) => Boolean(model.dualVertices[vertexId]))),
    `${label}: every candidate dual edge vertex should exist in dualVertices`,
    problems,
  );

  verifyCandidateFaceEdgeCoherence(label, model, problems);
  verifyCandidateSourceEdgeRule(label, model, sourceEdges, incidentFacesByEdgeKey, problems);

  for (const dualVertex of Object.values(model.dualVertices)) {
    expectCandidate(
      dualVertex.position.every((coordinate) => Number.isFinite(coordinate)),
      `${label}: dual vertex ${dualVertex.id} has non-finite coordinates`,
      problems,
    );
  }

  for (const face of model.dualFaces) {
    expectCandidate(face.vertexIds.length >= 3, `${label}: dual face ${face.id} has fewer than 3 vertices`, problems);
  }

  expectCandidate(Boolean(shape.cells.find((candidate) => candidate.id === cell.id)), `${label}: source cell missing`, problems);
}

function verifyCandidateFaceEdgeCoherence(label, model, problems) {
  const boundaryEdgeCounts = getBoundaryEdgeCounts(model.dualFaces);
  const boundaryEdgeKeys = Array.from(boundaryEdgeCounts.keys()).sort();
  const modelEdgeKeys = model.dualEdges.map((edge) => canonicalEdgeKey(...edge.vertexIds)).sort();

  expectSameSet(`${label}: dual face boundary edge keys`, boundaryEdgeKeys, modelEdgeKeys, problems);
  expectNoDuplicates(`${label}: model dual edge vertex-pair keys`, modelEdgeKeys, problems);

  for (const edge of model.dualEdges) {
    const key = canonicalEdgeKey(...edge.vertexIds);

    expectCandidate(boundaryEdgeCounts.has(key), `${label}: model dual edge ${edge.id} missing from face boundary set`, problems);
  }

  for (const [key, count] of boundaryEdgeCounts) {
    expectCandidate(count === 2, `${label}: candidate dual boundary edge ${key} occurs ${count} times`, problems);
  }
}

function verifyCandidateSourceEdgeRule(label, model, sourceEdges, incidentFacesByEdgeKey, problems) {
  const dualEdgesById = new Map(model.dualEdges.map((edge) => [edge.id, edge]));

  for (const sourceEdge of sourceEdges) {
    const sourceEdgeKey = canonicalEdgeKey(...sourceEdge.vertexIds);
    const incidentFaces = incidentFacesByEdgeKey.get(sourceEdgeKey) ?? [];
    const expectedDualVertexIds = incidentFaces
      .map((face) => model.sourceFaceToDualVertex[face.id])
      .filter(Boolean);
    const dualEdgeId = model.sourceEdgeToDualEdge[sourceEdge.id];
    const dualEdge = dualEdgesById.get(dualEdgeId);

    expectCandidate(Boolean(dualEdgeId), `${label}: missing dual edge id for source edge ${sourceEdge.id}`, problems);
    expectCandidate(Boolean(dualEdge), `${label}: missing dual edge ${dualEdgeId} for source edge ${sourceEdge.id}`, problems);
    expectCandidate(
      expectedDualVertexIds.length === 2,
      `${label}: source edge ${sourceEdge.id} should map through two source faces`,
      problems,
    );

    if (dualEdge && expectedDualVertexIds.length === 2) {
      expectCandidate(
        canonicalEdgeKey(...dualEdge.vertexIds) === canonicalEdgeKey(expectedDualVertexIds[0], expectedDualVertexIds[1]),
        `${label}: dual edge ${dualEdge.id} does not connect the two incident source-face dual vertices`,
        problems,
      );
    }
  }
}

function recordCandidateResult(status, expectation, sourceProblems, modelProblems, model) {
  const result = {
    status,
    sourceTopology: expectation.sourceTopology,
    dualTopologyLabel: expectation.dualTopologyLabel,
    sourceProblems,
    modelProblems,
    model,
  };

  candidateResults.push(result);

  const detailProblems = [...sourceProblems, ...modelProblems];

  if (status === 'CANDIDATE_MODEL_OK') {
    const dualFaceSizeHistogram = histogram(model.dualFaces.map((face) => face.vertexIds.length));

    console.log(
      `${status}: ${expectation.sourceTopology} -> ${expectation.dualTopologyLabel}; ` +
        `dual counts ${Object.keys(model.dualVertices).length}V ${model.dualEdges.length}E ${model.dualFaces.length}F`,
    );
    console.log(`dual face-size histogram: ${formatMapHistogram(dualFaceSizeHistogram)}`);
    console.log('correspondence maps: complete inverse maps');
    console.log('face/edge coherence: boundary edge set equals model dual edges');
    console.log('source edge rule: every source edge maps to its two incident source-face dual vertices');
    return;
  }

  console.log(`${status}: ${expectation.sourceTopology} -> ${expectation.dualTopologyLabel}`);

  for (const problem of detailProblems) {
    console.log(`  - ${problem}`);
  }
}

function printSummary() {
  printDivider('candidate summary');

  if (!candidateResults.length) {
    console.log('No candidates were audited.');
    return;
  }

  for (const result of candidateResults) {
    console.log(`${result.status}: ${result.sourceTopology} -> ${result.dualTopologyLabel}`);
  }
}

function applyAmboChecked(shape, targetCell, label) {
  if (!targetCell) {
    recordAuditFailure(`Ambo path could not find target for ${label}`);
    return shape;
  }

  const active = isCellActiveFrontier(shape, targetCell.id);
  const engineValid = canApplyAmboDissection(shape, targetCell.id);

  if (!active || !engineValid) {
    recordAuditFailure(
      `${describeCell(targetCell)} was not an active valid Ambo source for ${label} ` +
        `(active=${active ? 'yes' : 'no'} engine-valid=${engineValid ? 'yes' : 'no'})`,
    );
    return shape;
  }

  return applyAmboDissection(shape, targetCell.id);
}

function requireActiveCell(shape, { kind, topology }, label) {
  const cell = selectActiveCell(shape, { kind, topology });

  if (!cell) {
    recordAuditFailure(`missing active ${kind ?? 'cell'}${topology ? `/${topology}` : ''} for ${label}`);
  }

  return cell;
}

function selectActiveCell(shape, { kind, topology }) {
  return sortedCells(shape.cells).find(
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

function getIncidentFacesByEdgeKey(faces) {
  const incidentFacesByEdgeKey = new Map();

  for (const face of faces) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = canonicalEdgeKey(a, b);

      incidentFacesByEdgeKey.set(key, [...(incidentFacesByEdgeKey.get(key) ?? []), face]);
    }
  }

  return incidentFacesByEdgeKey;
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

function verifyInverseMap(label, mapLabel, forward, reverse, expectedSources, expectedTargets, problems) {
  expectSameSet(`${label}: ${mapLabel} source keys`, Object.keys(forward), expectedSources, problems);
  expectSameSet(`${label}: ${mapLabel} reverse values`, Object.values(reverse), expectedSources, problems);
  expectSameSet(`${label}: ${mapLabel} target values`, Object.values(forward), expectedTargets, problems);
  expectSameSet(`${label}: ${mapLabel} target keys`, Object.keys(reverse), expectedTargets, problems);

  for (const [sourceId, targetId] of Object.entries(forward)) {
    expectCandidate(reverse[targetId] === sourceId, `${label}: ${mapLabel} inverse mismatch at ${sourceId}`, problems);
  }

  for (const [targetId, sourceId] of Object.entries(reverse)) {
    expectCandidate(forward[sourceId] === targetId, `${label}: ${mapLabel} forward mismatch at ${targetId}`, problems);
  }
}

function expectSameSet(label, actual, expected, problems) {
  const actualValues = [...actual].sort();
  const expectedValues = [...expected].sort();

  expectCandidate(
    actualValues.join(',') === expectedValues.join(','),
    `${label} mismatch expected=${expectedValues.join(',')} actual=${actualValues.join(',')}`,
    problems,
  );
}

function expectNoDuplicates(label, values, problems) {
  expectCandidate(new Set(values).size === values.length, `${label} contains duplicate ids`, problems);
}

function expectCandidate(condition, message, problems) {
  if (!condition) {
    problems.push(message);
  }
}

function sameRecordHistogram(actual, expected) {
  return formatRecordHistogram(actual) === formatRecordHistogram(expected);
}

function histogram(values) {
  const counts = new Map();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return counts;
}

function formatSignature(shape, cell) {
  const signature = getCellTopologySignature(shape, cell);

  return `${signature.vertexCount}V ${signature.edgeCount}E ${signature.faceCount}F ` +
    `faces=${formatRecordHistogram(signature.faceSizeHistogram)} ` +
    `degrees=${formatRecordHistogram(signature.vertexDegreeHistogram)}`;
}

function formatRecordHistogram(histogramValue) {
  const entries = Object.entries(histogramValue).sort(([a], [b]) => Number(a) - Number(b));

  if (!entries.length) {
    return 'none';
  }

  return entries.map(([size, count]) => `${size}:${count}`).join(',');
}

function formatMapHistogram(counts) {
  const entries = Array.from(counts.entries()).sort((a, b) => Number(a[0]) - Number(b[0]));

  if (!entries.length) {
    return 'none';
  }

  return entries.map(([size, count]) => `${size}:${count}`).join(',');
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

function shortenId(id) {
  return id.length > 28 ? `${id.slice(0, 13)}...${id.slice(-8)}` : id;
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

function printDivider(label) {
  console.log('');
  console.log(`=== ${label} ===`);
}

function recordAuditFailure(message) {
  auditFailures.push(message);
}

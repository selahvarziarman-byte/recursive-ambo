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

// ═════════════════════════════════════════════════════════════════════════════
// R1 — THE METRIC RELAXATION (B-107; the researcher's seal
// SEAL_R1_THE_METRIC_RELAXATION_t_equals_one_over_phi.md). The battery
// measures the seal's own clauses on the REAL chain: the LAW-24 fail→pass
// flip · ε on the FIXED CARRIED COMBINATORICS (never a distance graph — the
// trap is itself demonstrated) · byte-identical combinatorics · the mark ·
// nothing re-begotten · no stamp across the correction.
// ═════════════════════════════════════════════════════════════════════════════
printDivider('R1 — the metric relaxation (t = 1 → 1/φ)');
runR1Battery();

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

function runR1Battery() {
  const { R1_RELAXATION_MARK } = require(path.join(repoRoot, 'src/lib/pyritohedralDiagonalization.ts'));
  const EPS_RAD = 1e-6;
  const rad2deg = (x) => (x * 180) / Math.PI;
  const angleAt = (pos, a, b, c) => {
    const u = [pos[a][0] - pos[b][0], pos[a][1] - pos[b][1], pos[a][2] - pos[b][2]];
    const v = [pos[c][0] - pos[b][0], pos[c][1] - pos[b][1], pos[c][2] - pos[b][2]];
    const dot = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
    return Math.acos(Math.max(-1, Math.min(1, dot / (Math.hypot(...u) * Math.hypot(...v)))));
  };
  // max |corner − 60°| over the FIXED CARRIED faces (the seal's invariant —
  // the trap honoured: the cycles come from the carried complex, never from
  // distances)
  const maxDevOnCarried = (shape, cell, positionsOverride) => {
    const faceById = new Map(shape.faces.map((f) => [f.id, f]));
    const pos = positionsOverride ?? Object.fromEntries(Object.entries(shape.vertices).map(([id, v]) => [id, v.position]));
    let max = 0;
    for (const fid of cell.faceIds) {
      const cycle = faceById.get(fid).vertexIds;
      for (let k = 0; k < cycle.length; k += 1) {
        const angle = angleAt(pos, cycle[(k - 1 + cycle.length) % cycle.length], cycle[k], cycle[(k + 1) % cycle.length]);
        max = Math.max(max, Math.abs(angle - Math.PI / 3));
      }
    }
    return max;
  };

  const cube = createSeedShape('cube');
  const ambo = applyAmboDissection(cube, cube.cells[0].id);
  const core = ambo.cells.find((c) => c.topology === 'cuboctahedron');
  const dia = applyPyritohedralDiagonalization(ambo, core.id);
  const ico = dia.cells.find((c) => c.topology === 'pyritohedral-icosahedron');

  // [R1-a] ⛔ LAW-24, the fail side: the SAME carried faces at the UNRELAXED
  // (parent ambo) positions fail by 30° — the flip's red half, without which
  // the pass is vacuous
  const unrelaxedPos = Object.fromEntries(Object.entries(ambo.vertices).map(([id, v]) => [id, v.position]));
  const devUnrelaxed = rad2deg(maxDevOnCarried(dia, ico, unrelaxedPos));
  if (Math.abs(devUnrelaxed - 30) > 0.5) {
    recordFailure(`R1-a the LAW-24 control: unrelaxed positions should fail by ≈30° on the carried faces, read ${devUnrelaxed.toFixed(3)}°`);
  } else {
    console.log(`R1-a CONTROL (unrelaxed, the fail side): max |angle−60°| = ${devUnrelaxed.toFixed(3)}° — fails, as it must`);
  }

  // [R1-b] the pass side: the op's OWN output lands within the seal's ε on
  // the fixed carried combinatorics
  const devRelaxed = maxDevOnCarried(dia, ico, null);
  if (devRelaxed > EPS_RAD) {
    recordFailure(`R1-b the relaxation must land within ε=1e-6 rad on the 60 carried corners, read ${devRelaxed} rad`);
  } else {
    console.log(`R1-b RELAXED: max |angle−60°| = ${rad2deg(devRelaxed).toExponential(2)}° ≤ ε — the regular icosahedron`);
  }

  // [R1-c] ⛔ THE TRAP, demonstrated (the seal's vacuousness clause): a
  // min-distance graph at the UNRELAXED positions self-selects the equal
  // edges and reads 60° everywhere — the test that cannot fail, shown lying
  // beside the honest one
  const coreIds = [...ico.vertexIds];
  const dist = (a, b) => Math.hypot(...unrelaxedPos[a].map((x, i) => x - unrelaxedPos[b][i]));
  let minD = Infinity;
  for (let i = 0; i < coreIds.length; i += 1) for (let j = i + 1; j < coreIds.length; j += 1) minD = Math.min(minD, dist(coreIds[i], coreIds[j]));
  const distEdges = [];
  for (let i = 0; i < coreIds.length; i += 1) for (let j = i + 1; j < coreIds.length; j += 1) {
    if (Math.abs(dist(coreIds[i], coreIds[j]) - minD) < 1e-9) distEdges.push([coreIds[i], coreIds[j]]);
  }
  // triangles of the distance graph
  const adj = new Map(coreIds.map((id) => [id, new Set()]));
  for (const [a, b] of distEdges) { adj.get(a).add(b); adj.get(b).add(a); }
  let distMaxDev = 0;
  let distTriangles = 0;
  for (const [a, b] of distEdges) {
    for (const c of adj.get(a)) {
      if (!adj.get(b).has(c)) continue;
      distTriangles += 1;
      distMaxDev = Math.max(distMaxDev, Math.abs(angleAt(unrelaxedPos, a, b, c) - Math.PI / 3));
    }
  }
  if (distEdges.length !== 24 || rad2deg(distMaxDev) > 1e-6) {
    recordFailure(`R1-c the trap demonstration: the distance graph should self-select 24 equal edges reading 60° at t=1 (got ${distEdges.length} edges, max dev ${rad2deg(distMaxDev)}°)`);
  } else {
    console.log(`R1-c THE TRAP shown: the min-distance graph at t=1 self-selects ${distEdges.length} edges / ${distTriangles / 3} triangle-orbits reading 60° exactly — while the carried faces read 30° off. Key on the carried complex.`);
  }

  // [R1-d] combinatorics byte-identical: the relaxation changes NO ids — the
  // control is a perturbed ambo (positions nudged off the family so the
  // recognizer honestly refuses) diagonalized to the SAME face/edge id lists
  const nudged = JSON.parse(JSON.stringify(ambo));
  for (const id of core.vertexIds) {
    nudged.vertices[id].position = nudged.vertices[id].position.map((x, i) => x + (i === 0 ? 1e-3 : 0));
  }
  const diaNudged = applyPyritohedralDiagonalization(nudged, core.id);
  const idsOf = (s) => JSON.stringify({ f: s.faces.map((f) => f.id).sort(), e: s.edges.map((e) => `${e.vertexIds[0]}~${e.vertexIds[1]}`).sort(), v: Object.keys(s.vertices).sort() });
  if (idsOf(dia) !== idsOf(diaNudged)) {
    recordFailure('R1-d the combinatorics moved: the relaxed and refused runs must mint byte-identical face/edge/vertex id lists');
  } else {
    console.log('R1-d combinatorics byte-identical: face ids · edge keys · vertex ids equal between the relaxed run and the refused (nudged) control — positions are the only difference');
  }

  // [R1-e] the MARK: exactly the 12 cell vertices carry the R1 mark, once
  // each; the refused control carries ZERO marks (nothing fabricated)
  const marked = Object.values(dia.vertices).filter((v) => v.data.tags.includes(R1_RELAXATION_MARK));
  const markedTwice = marked.filter((v) => v.data.tags.filter((t) => t === R1_RELAXATION_MARK).length !== 1);
  const markedNudged = Object.values(diaNudged.vertices).filter((v) => v.data.tags.includes(R1_RELAXATION_MARK));
  const cellSet = new Set(ico.vertexIds);
  if (marked.length !== 12 || markedTwice.length !== 0 || !marked.every((v) => cellSet.has(v.id)) || markedNudged.length !== 0) {
    recordFailure(`R1-e the mark: expected exactly the 12 cell vertices marked once (got ${marked.length}, dup ${markedTwice.length}) and zero on the refused control (got ${markedNudged.length})`);
  } else {
    console.log(`R1-e the mark: "${R1_RELAXATION_MARK}" on exactly the 12 moved vertices, once each; the refused control carries none`);
  }

  // [R1-f] re-begets nothing: no created vertices, the same 12 in the cell,
  // the vertex map keyset identical to the parent's
  const genealogyClean = dia.genealogy.createdVertexIds.length === 0 &&
    dia.generations[dia.generations.length - 1].createdVertexIds.length === 0 &&
    ico.vertexIds.length === 12 &&
    JSON.stringify(Object.keys(dia.vertices).sort()) === JSON.stringify(Object.keys(ambo.vertices).sort());
  if (!genealogyClean) {
    recordFailure('R1-f the correction re-begot something: created vertices or a changed vertex keyset');
  } else {
    console.log('R1-f re-begets nothing: createdVertexIds empty · 12 stays 12 · the vertex keyset is the parent\'s');
  }

  // [R1-g] no stamp crosses the correction: every face on the moved vertices
  // owns angles that MATCH an acos re-derivation from the result's own
  // positions — including the parent-cell SQUARES, whose copied 90s would
  // have been the stale stamp (they now truly own the skew-quad angles)
  const posNow = Object.fromEntries(Object.entries(dia.vertices).map(([id, v]) => [id, v.position]));
  let staleStamps = 0;
  let parentSquaresChecked = 0;
  for (const face of dia.faces) {
    if (!face.vertexIds.every((id) => cellSet.has(id))) continue;
    if (!face.cornerAngles) continue;
    for (let k = 0; k < face.vertexIds.length; k += 1) {
      const derived = angleAt(posNow, face.vertexIds[(k - 1 + face.vertexIds.length) % face.vertexIds.length], face.vertexIds[k], face.vertexIds[(k + 1) % face.vertexIds.length]);
      if (Math.abs(derived - face.cornerAngles[k]) > 1e-9) staleStamps += 1;
    }
    if (face.role === 'parent-cell-face' && face.vertexIds.length === 4) {
      parentSquaresChecked += 1;
      // the sharp discriminator: the copied stamp would say 90° — the
      // re-derived skew-quad corner must NOT
      if (Math.abs(rad2deg(face.cornerAngles[0]) - 90) < 1e-6) staleStamps += 1;
    }
  }
  if (staleStamps > 0 || parentSquaresChecked !== 6) {
    recordFailure(`R1-g stale stamps across the correction: ${staleStamps} corner(s) disagree with the re-derivation (parent squares checked: ${parentSquaresChecked})`);
  } else {
    console.log(`R1-g no stamp crossed: every owned atom on the moved vertices re-derives from the relaxed positions (${parentSquaresChecked} parent-cell squares now own their true skew angles, not the copied 90s)`);
  }

  // [R1-h] the tetrahedron chain relaxes too (its cuboctahedron sits on the
  // same family at h = ½): the second scenario's core lands within ε
  const tetra = createSeedShape('tetrahedron');
  const amboT = applyAmboDissection(tetra, tetra.cells[0].id);
  const octa = amboT.cells.find((c) => c.topology === 'octahedron');
  const amboT2 = applyAmboDissection(amboT, octa.id);
  const coreT = amboT2.cells.find((c) => c.topology === 'cuboctahedron');
  const diaT = applyPyritohedralDiagonalization(amboT2, coreT.id);
  const icoT = diaT.cells.find((c) => c.topology === 'pyritohedral-icosahedron');
  const devT = maxDevOnCarried(diaT, icoT, null);
  if (devT > EPS_RAD) {
    recordFailure(`R1-h the tetrahedron chain's icosahedron must relax too (h=½ family), read ${devT} rad`);
  } else {
    console.log(`R1-h the tetrahedron chain relaxes: max |angle−60°| = ${rad2deg(devT).toExponential(2)}° ≤ ε`);
  }
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

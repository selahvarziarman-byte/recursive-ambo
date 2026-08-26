#!/usr/bin/env node

// DIAGNOSTIC — P6, THE IDEAL DUAL (the passage to the Platonic Forms): the
// distance-free dual + the TWO-CLAUSE seal that DETECTS a Form.
//
// THE MEANING: Euler spends the total curvature (4π for χ=2) no matter what;
// the Form is where that fixed total is SPREAD UNIFORMLY (constant deficit at
// every vertex — equidistribution = discrete constant curvature). The
// dodecahedron is the FORBIDDEN-FORM crossing: 5-fold is crystallographically
// forbidden to CONSTRUCTION, yet the distance-free dual of the
// pyritohedral-icosahedron delivers it exactly — the Form's angles are
// combinatorial (a pentagon is 108° because it is a pentagon), so the true
// dual never needs the metric. Bound 8 held.
//
// ★ SEAL: cube → ambo → cuboctahedron → pyritohedral → icosahedron cell
//   → dual+idealize = DODECAHEDRON (12 pentagons ×108°, 20 deg-3 vertices,
//   deficit π/5 UNIFORM ×20, Σ=4π=2πχ) — both clauses GREEN.
// ★ REFUSE: cuboctahedron → dual+idealize = RHOMBIC-DODECAHEDRON (12 side-4
//   faces ×90°, deficits π/2 ×8 + 0 ×6 NON-UNIFORM, Σ=4π) — clause (a)
//   greens, clause (b) REFUSES. A detector that greens BOTH is vacuous.
//
// THE TEETH (run every time): a +0.1-biased stamp copy fires clause (a) RED
// (and note: the biased dodeca stays UNIFORM — clause (b) alone would be
// fooled; the two clauses are provably INDEPENDENT); a stripped face throws
// the un-owned refusal; the frozen dual sources are byte-identical to HEAD.
//
// ⚑→✔ THE METRIC DEBT — COLLECTED (R3b, B-109; the flag stood from the R2
// finding 2026-08-14): the centroid-dual WAS a skew shadow on the irregular
// seed (pentagons summing 536.85° ≠ 540°, Σ = 4.21π — those numbers are now
// §9's CARRIED CONTROL, measured live on the reconstructed pre-R1
// positions). R1 relaxed the seed, so the measured centroid-dual is the
// REGULAR dodecahedron and §9 seals Σ = 4π AS MEASURED (acos over the
// dual's own positions, float floor). The idealize above never depended on
// this: the ascent is count-only by construction.
//
// Anti-mock: the REAL TS modules through the transpile hook.

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        esModuleInterop: true,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
      fileName: filename,
    }).outputText,
    filename,
  );
};
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection, canApplyAmboDissection } = req('src/lib/ambo.ts');
const { applyPyritohedralDiagonalization, canApplyPyritohedralDiagonalization } = req(
  'src/lib/pyritohedralDiagonalization.ts',
);
const { isCellActiveFrontier } = req('src/lib/cellLifecycle.ts');
const { buildDualCorrespondenceModel, describeDualViewTopology } = req('src/lib/dualView.ts');
const { getCellFaces } = req('src/lib/shape.ts');
const { regularCornerAngle, readIdealDualSeal, readVertexCurvatures } = req('src/lib/conformalAtom.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const near = (a, b, eps = 1e-9) => Math.abs(a - b) < eps;
const P = Math.PI;
const deg = (a) => ((a * 180) / P).toFixed(0);

const selectActive = (shape, kind, topology) =>
  shape.cells.find(
    (cell) =>
      isCellActiveFrontier(shape, cell.id) &&
      (!kind || cell.kind === kind) &&
      (!topology || cell.topology === topology),
  ) ?? null;

console.log('P6 — THE IDEAL DUAL: the distance-free ascent to the Forms + the two-clause seal\n');

// ---------------------------------------------------------------------------
// §1 E1 — THE ICOSAHEDRON IS REACHED (the person op-path, no hand-building)
// ---------------------------------------------------------------------------
console.log('----- §1 (E1) the ascent is REAL: cube → ambo → cuboctahedron → pyritohedral → icosahedron -----');
let shapeA = createSeedShape('cube');
const seedCellA = selectActive(shapeA, 'seed');
check('§1 (E1) the cube seed offers an active seed cell and the Ambo accepts it',
  seedCellA !== null && canApplyAmboDissection(shapeA, seedCellA.id));
shapeA = applyAmboDissection(shapeA, seedCellA.id);
const cuboCellA = selectActive(shapeA, 'core', 'cuboctahedron');
const cuboFacesA = cuboCellA ? getCellFaces(shapeA, cuboCellA) : [];
check('§1 (E1) the Ambo lands the active cuboctahedron core (12v · 14f = 8 tri + 6 sq) and the pyritohedral accepts it',
  cuboCellA !== null &&
    cuboCellA.vertexIds.length === 12 &&
    cuboFacesA.length === 14 &&
    cuboFacesA.filter((f) => f.vertexIds.length === 3).length === 8 &&
    cuboFacesA.filter((f) => f.vertexIds.length === 4).length === 6 &&
    canApplyPyritohedralDiagonalization(shapeA, cuboCellA.id));
shapeA = applyPyritohedralDiagonalization(shapeA, cuboCellA.id);
const icosaCell = shapeA.cells.find((cell) => cell.topology === 'pyritohedral-icosahedron') ?? null;
const icosaFaces = icosaCell ? getCellFaces(shapeA, icosaCell) : [];
const icosaDegrees = icosaCell
  ? icosaCell.vertexIds.map((v) => icosaFaces.filter((f) => f.vertexIds.includes(v)).length)
  : [];
note(icosaCell ? `icosahedron cell: ${icosaCell.vertexIds.length}v · ${icosaFaces.length}f · degrees {${[...new Set(icosaDegrees)].join(',')}}` : 'NOT REACHED');
check('§1 (E1) the pyritohedral-icosahedron cell IS the icosahedron combinatorially: 12 vertices · 20 triangular faces · ALL vertices degree-5',
  icosaCell !== null &&
    icosaCell.vertexIds.length === 12 &&
    icosaFaces.length === 20 &&
    icosaFaces.every((f) => f.vertexIds.length === 3) &&
    icosaDegrees.length === 12 &&
    icosaDegrees.every((d) => d === 5));

// the REFUSE operand: an independent second run stopped at the cuboctahedron
let shapeB = createSeedShape('cube');
shapeB = applyAmboDissection(shapeB, selectActive(shapeB, 'seed').id);
const cuboCellB = selectActive(shapeB, 'core', 'cuboctahedron');

// ---------------------------------------------------------------------------
// §2 E2 — ★ THE SWAP (unchanged): the dual complexes
// ---------------------------------------------------------------------------
console.log('\n----- §2 (E2) ★ the swap: buildDualCorrespondenceModel on both -----');
const icosaDual = buildDualCorrespondenceModel(shapeA, icosaCell, 'dodecahedron');
const dualCounts = (m) => ({
  V: Object.keys(m.dualVertices).length,
  E: m.dualEdges.length,
  F: m.dualFaces.length,
});
const chiOf = (m) => {
  const { V, E, F } = dualCounts(m);
  return V - E + F;
};
note(icosaDual ? `icosahedron dual: V${dualCounts(icosaDual).V} E${dualCounts(icosaDual).E} F${dualCounts(icosaDual).F} · χ=${chiOf(icosaDual)}` : 'NULL');
check('§2 (E2) ★ the icosahedron\'s dual IS the dodecahedron: V20 E30 F12 · χ=2 certified (V−E+F of the dual model itself)',
  icosaDual !== null &&
    dualCounts(icosaDual).V === 20 &&
    dualCounts(icosaDual).E === 30 &&
    dualCounts(icosaDual).F === 12 &&
    chiOf(icosaDual) === 2);
const cuboTopology = cuboCellB ? describeDualViewTopology(shapeB, cuboCellB) : { source: 'unknown' };
const cuboDual = cuboCellB ? buildDualCorrespondenceModel(shapeB, cuboCellB, cuboTopology.dual ?? 'unknown') : null;
note(cuboDual ? `cuboctahedron dual ("${cuboTopology.dual}"): V${dualCounts(cuboDual).V} E${dualCounts(cuboDual).E} F${dualCounts(cuboDual).F} · χ=${chiOf(cuboDual)}` : 'NULL');
check('§2 (E2) ★ the cuboctahedron\'s dual is the committed map\'s own "rhombic-dodecahedron": V14 E24 F12 · χ=2',
  cuboDual !== null &&
    cuboTopology.dual === 'rhombic-dodecahedron' &&
    dualCounts(cuboDual).V === 14 &&
    dualCounts(cuboDual).E === 24 &&
    dualCounts(cuboDual).F === 12 &&
    chiOf(cuboDual) === 2);

// ---------------------------------------------------------------------------
// §3 E3 — ★★ IDEALIZE IS DISTANCE-FREE (the stamp + the greps)
// ---------------------------------------------------------------------------
console.log('\n----- §3 (E3) ★★ the idealize: count-only angles on every dual face -----');
const faceAngleSummary = (m) => {
  const bySide = new Map();
  for (const f of m.dualFaces) {
    const key = `side-${f.vertexIds.length}: [${(f.cornerAngles ?? []).map(deg).join(',')}]°`;
    bySide.set(key, (bySide.get(key) ?? 0) + 1);
  }
  return [...bySide.entries()].map(([k, n]) => `${k} ×${n}`).join(' · ');
};
note(`dodecahedron faces: ${faceAngleSummary(icosaDual)}`);
check('§3 (E3) ★★ the dodecahedron: ALL 12 dual faces are pentagons owning [108° ×5] = regularCornerAngle(5) = 3π/5 verbatim',
  icosaDual.dualFaces.length === 12 &&
    icosaDual.dualFaces.every(
      (f) =>
        f.vertexIds.length === 5 &&
        f.cornerAngles?.length === 5 &&
        f.cornerAngles.every((a) => near(a, regularCornerAngle(5)) && near(a, (3 * P) / 5)),
    ));
note(`rhombic-dodecahedron faces: ${faceAngleSummary(cuboDual)}`);
check('§3 (E3) ★★ the rhombic-dodecahedron: ALL 12 dual faces are side-4 owning [90° ×4] = regularCornerAngle(4) = π/2 verbatim',
  cuboDual.dualFaces.length === 12 &&
    cuboDual.dualFaces.every(
      (f) =>
        f.vertexIds.length === 4 &&
        f.cornerAngles?.length === 4 &&
        f.cornerAngles.every((a) => near(a, regularCornerAngle(4)) && near(a, P / 2)),
    ));
// the greps — CODE-only (comments legitimately name the law; strip them first)
const stripComments = (src) => src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
const dualViewSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/dualView.ts'), 'utf8');
const stampMatches = dualViewSrc.match(
  /cornerAngles: Array\(vertexIds\.length\)\.fill\(regularCornerAngle\(vertexIds\.length\)\)/g,
);
const entryFnSrc = dualViewSrc.slice(
  dualViewSrc.indexOf('function createDualFaceEntry'),
  dualViewSrc.indexOf('function orderIncidentFaces'),
);
const entryCode = stripComments(entryFnSrc);
check('§3 (E3) ★★ the stamp is COUNT-ONLY at the seam: the literal `Array(vertexIds.length).fill(regularCornerAngle(vertexIds.length))` appears exactly once, and createDualFaceEntry\'s CODE reads no `.position` and no `faceCentroid` (the metric stays in the untouched sort)',
  stampMatches !== null &&
    stampMatches.length === 1 &&
    entryFnSrc.length > 0 &&
    !entryCode.includes('.position') &&
    !entryCode.includes('faceCentroid'));
const atomSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/conformalAtom.ts'), 'utf8');
const readerSrc = atomSrc.slice(atomSrc.indexOf('export function readIdealDualSeal'));
const readerCode = stripComments(readerSrc);
check('§3 (E3) ★★ the seal reading is DISTANCE-FREE BY CONSTRUCTION: readIdealDualSeal\'s CODE has no `.position`, no centroid, no Vec3 — and the whole conformalAtom.ts still performs ZERO `.position` access (the P0–P5 discipline holds through P6)',
  readerSrc.length > 0 &&
    !readerCode.includes('.position') &&
    !readerCode.toLowerCase().includes('centroid') &&
    !readerCode.includes('Vec3') &&
    !stripComments(atomSrc).includes('.position'));

// ---------------------------------------------------------------------------
// §4 E4 — ★★ CLAUSE (a) THE STAMP-CHECK: Σ = 2πχ, and it BITES
// ---------------------------------------------------------------------------
console.log('\n----- §4 (E4) ★★ clause (a): Σ deficit = 2πχ on both + the planted buggy stamp fires -----');
const sealA = readIdealDualSeal(icosaDual.dualFaces, chiOf(icosaDual));
const sealB = readIdealDualSeal(cuboDual.dualFaces, chiOf(cuboDual));
note(`dodecahedron: Σ = ${(sealA.totalDeficit / P).toFixed(6)}π vs 2πχ = ${2 * sealA.chi}π`);
note(`rhombic-dodecahedron: Σ = ${(sealB.totalDeficit / P).toFixed(6)}π vs 2πχ = ${2 * sealB.chi}π`);
check('§4 (E4) ★★ clause (a) GREENS both correct stamps — THE CONFORMAL ASCENT (R2-corrected framing, engineer 1304): the icosahedral type ascends to the dodecahedral Form and Σδ = 4π BY THE IDEALIZE (a pentagon is 108° because it is a pentagon — count-only, never a metric claim about the model\'s positions); same for the rhombic side-4 ascent (Euler\'s identity — it certifies the STAMP, never the Form)',
  sealA.stampHolds && near(sealA.totalDeficit, 4 * P) && sealB.stampHolds && near(sealB.totalDeficit, 4 * P));
// THE PLANT (runs every time): the buggy idealize — regularCornerAngle(n)+0.1
const buggy = icosaDual.dualFaces.map((f) => ({
  ...f,
  cornerAngles: f.cornerAngles.map((a) => a + 0.1),
}));
const buggySeal = readIdealDualSeal(buggy, 2);
note(`planted buggy stamp (+0.1 every corner): Σ = ${(buggySeal.totalDeficit / P).toFixed(6)}π ≠ 4π → stamp-check ${buggySeal.stampHolds ? 'GREEN (BROKEN!)' : 'RED (bites)'}`);
note(`…and the biased dodeca is STILL uniform (verdict ${buggySeal.verdict}) — clause (b) alone would be fooled; the clauses are INDEPENDENT, both required`);
check('§4 (E4) ★★ THE PLANT BITES: the +0.1-biased stamp breaks Σ = 2πχ (clause (a) RED) while remaining uniform (clause (b) would still SEAL) — the stamp-check is the implementation\'s own falsifier',
  !buggySeal.stampHolds &&
    near(buggySeal.totalDeficit, 4 * P - 0.1 * 12 * 5) &&
    buggySeal.verdict === 'SEAL');

// ---------------------------------------------------------------------------
// §5 E5 — ★★★ CLAUSE (b) THE FORM-DETECTOR: SEAL the Form, REFUSE the non-Form
// ---------------------------------------------------------------------------
console.log('\n----- §5 (E5) ★★★ clause (b): the Form-detector must turn the rhombic-dodecahedron away -----');
const multiset = (seal) => {
  const buckets = new Map();
  for (const d of Object.values(seal.deficits)) {
    const key = `${(d / P).toFixed(6)}π`;
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return [...buckets.entries()]
    .sort((x, y) => y[1] - x[1])
    .map(([k, n]) => `${k} ×${n}`)
    .join(' + ');
};
note(`dodecahedron deficits: {${multiset(sealA)}} → ${sealA.verdict}: ${sealA.reason}`);
note(`rhombic-dodecahedron deficits: {${multiset(sealB)}} → ${sealB.verdict}: ${sealB.reason}`);
const dodecaDeficits = Object.values(sealA.deficits);
const rhombicDeficits = Object.values(sealB.deficits);
check('§5 (E5) ★★★ THE FORM SEALS: the dodecahedron reads deficit π/5 UNIFORM ×20 (vertex-transitive), one-type pentagons (face-transitive), every deficit ≥ 0 (Alexandrov) → verdict SEAL',
  sealA.verdict === 'SEAL' &&
    dodecaDeficits.length === 20 &&
    dodecaDeficits.every((d) => near(d, P / 5)) &&
    sealA.sideCounts.every((n) => n === 5));
check('§5 (E5) ★★★ THE NON-FORM IS TURNED AWAY: the rhombic-dodecahedron reads π/2 ×8 + 0 ×6 NON-UNIFORM → verdict REFUSE (clause (a) held — Euler cannot tell them apart; ONLY the detector can)',
  sealB.verdict === 'REFUSE' &&
    rhombicDeficits.length === 14 &&
    rhombicDeficits.filter((d) => near(d, P / 2)).length === 8 &&
    rhombicDeficits.filter((d) => near(d, 0)).length === 6 &&
    sealB.reason.includes('NOT uniform'));

// ---------------------------------------------------------------------------
// §6 the un-owned refusal + the frozen boundary
// ---------------------------------------------------------------------------
console.log('\n----- §6 the discriminator + the frozen boundary -----');
const stripped = icosaDual.dualFaces.map((f, i) => {
  if (i !== 0) return f;
  const { cornerAngles: _gone, ...rest } = f;
  return rest;
});
check('§6 a stripped dual face throws the un-owned refusal — the reading exists only where the idealize stamped it (nothing fabricated)',
  (() => {
    try {
      readIdealDualSeal(stripped, 2);
      return false;
    } catch (e) {
      return String(e.message).includes('does not own the atom');
    }
  })());
const headEq = (p) => {
  const working = fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r/g, '');
  const head = execFileSync('git', ['show', `HEAD:${p}`], { cwd: repoRoot, encoding: 'utf8' }).replace(/\r/g, '');
  return working === head;
};
check('§6 THE FROZEN BOUNDARY HELD: dualization.ts · surfaceDual.ts · geometry.ts · the manifest all BYTE-IDENTICAL to HEAD (the idealize lives on the NOT_FROZEN seam only — no union owed)',
  ['src/lib/dualization.ts', 'src/lib/surfaceDual.ts', 'src/types/geometry.ts', 'docs/governance/ENGINE_FREEZE_MANIFEST.txt'].every(headEq));

// ---------------------------------------------------------------------------
// §7 THE ASCENT STANCE-STAMP (2026-08-02 seal) — the medial faces OWN their
// angle. The ascent's minted faces were the last un-stamped substrate: on
// exactly these subjects readVertexCurvatures THREW "carries no cornerAngles"
// (the argument's stance-piece unavailable on the Platonic-ascent path).
// E1 owned · E2 Σ = 2πχ on both ascent rungs (the dual's 4π is §4's, same
// run) · E3 the wrong-angle plant · E4 the horizon untouched.
// ---------------------------------------------------------------------------
console.log('\n----- §7 THE STANCE-STAMP: the ascent forms own their angle (was: the read THREW) -----');
const isolateCell = (shape, cell) => {
  const faces = getCellFaces(shape, cell);
  const ids = new Set(faces.flatMap((f) => f.vertexIds));
  const vertices = {};
  for (const id of ids) vertices[id] = shape.vertices[id];
  return { ...shape, faces, vertices };
};
const cuboIso = isolateCell(shapeB, cuboCellB);
const cuboReadings = readVertexCurvatures(cuboIso);
const cuboSum = cuboReadings.reduce((s, r) => s + r.curvature, 0);
note(`cuboctahedron (cell-isolated): ${cuboIso.faces.filter((f) => Array.isArray(f.cornerAngles)).length}/14 owned · ${cuboReadings.length} vertices · Σ = ${deg(cuboSum)}°`);
check('§7 (E1) ★★ THE CUBOCTAHEDRON OWNS ITS STANCE: all 14 medial faces carry cornerAngles — 60° on the 8 triangles, 90° on the 6 squares, no smear, NO THROW (the pre-stamp read threw "carries no cornerAngles" on exactly this subject)',
  cuboIso.faces.every((f) => Array.isArray(f.cornerAngles) && f.cornerAngles.length === f.vertexIds.length) &&
    cuboIso.faces.filter((f) => f.vertexIds.length === 3).every((f) => f.cornerAngles.every((a) => near(a, P / 3))) &&
    cuboIso.faces.filter((f) => f.vertexIds.length === 4).every((f) => f.cornerAngles.every((a) => near(a, P / 2))));
check('§7 (E2) ★★ Σ = 2πχ SEALS ON THE ASCENT: 12 interior vertices, deficit 60° EACH (2 tri·60° + 2 sq·90° = Σθ 300°), Σ = 720° = 4π = 2πχ (χ=2)',
  cuboReadings.length === 12 &&
    cuboReadings.every((r) => r.valence === 'interior' && near(r.curvature, P / 3)) &&
    near(cuboSum, 4 * P));
const icosaIso = isolateCell(shapeA, icosaCell);
const icosaReadings = readVertexCurvatures(icosaIso);
const icosaSum = icosaReadings.reduce((s, r) => s + r.curvature, 0);
note(`icosahedron (cell-isolated): ${icosaIso.faces.filter((f) => Array.isArray(f.cornerAngles)).length}/20 owned (8 preserved CARRIED + 12 split MINTED) · ${icosaReadings.length} vertices · Σ = ${deg(icosaSum)}°`);
// R2 (2026-08-14, the five-site cure): the splits now own their TRUE parts —
// 45·45·90 per half-square (never the stamped 60·60·60); the 8 preserved
// triangles still ride 60°×3. THE VERTEX-DEFICIT SEAL IS UNTOUCHED: each
// vertex still sums 300° (45+45+60+60+90), deficit 60° each, Σ = 4π.
const icosaSplits = icosaIso.faces.filter((f) => f.role === 'pyritohedral-split-face');
const icosaPreserved = icosaIso.faces.filter((f) => f.role === 'pyritohedral-preserved-face');
const sortedDeg = (f) => (f.cornerAngles ?? []).map((a) => Math.round((a * 180) / P)).sort((x, y) => x - y).join(',');
// R1 RECUT (B-107 — THE METRIC RELAXATION): the splits' 45·45·90 was the
// TRUE reading of a WRONG metric (icosahedron combinatorics on carried
// cuboctahedron positions). R1 relaxes the 12 vertices to t = 1/φ IN the
// diagonalization, so the splits now MEASURE 60·60·60 — not the old
// fabricated stamp (that disease stamped 60s OVER 45·45·90 positions; the
// discriminator below re-derives a split's corners from the shape's own
// positions and they AGREE). The vertex seal is UNCHANGED by a truer route:
// each vertex now sums 5 × 60° = 300° (was 45+45+60+60+90), deficit 60°
// each, Σ = 4π — the DUAL row's seal survives the relaxation.
check('§7 (E2) ★★ …AND ON THE NEXT RUNG (R1 relaxed): the pyritohedral-icosahedron owns all 20 triangles at a MEASURED 60°×3 (the splits\' angles agree with an independent acos from the shape\'s own relaxed positions — owned by measurement, never the fabricated stamp) → the vertex seal UNCHANGED: 12 interior vertices, each Σθ = 300° (now 5 × 60°), deficit 60° each, Σ = 4π; §4 already sealed its dual dodecahedron at 4π on this same run',
  icosaIso.faces.every((f) => Array.isArray(f.cornerAngles)) &&
    icosaPreserved.length === 8 &&
    icosaPreserved.every((f) => f.cornerAngles.every((a) => near(a, P / 3))) &&
    icosaSplits.length === 12 &&
    icosaSplits.every((f) => sortedDeg(f) === '60,60,60') &&
    icosaSplits.every((f) =>
      f.vertexIds.every((vid, k) => {
        const v = shapeA.vertices[vid].position;
        const prev = shapeA.vertices[f.vertexIds[(k - 1 + f.vertexIds.length) % f.vertexIds.length]].position;
        const next = shapeA.vertices[f.vertexIds[(k + 1) % f.vertexIds.length]].position;
        const e1 = [prev[0] - v[0], prev[1] - v[1], prev[2] - v[2]];
        const e2 = [next[0] - v[0], next[1] - v[1], next[2] - v[2]];
        const cos = (e1[0] * e2[0] + e1[1] * e2[1] + e1[2] * e2[2]) / (Math.hypot(...e1) * Math.hypot(...e2));
        return near(f.cornerAngles[k], Math.acos(Math.max(-1, Math.min(1, cos))));
      }),
    ) &&
    icosaReadings.length === 12 &&
    icosaReadings.every((r) => near(r.curvature, P / 3)) &&
    near(icosaSum, 4 * P));
// E3 — THE PLANT (runs every time): one face's stamp biased +0.1 per corner
const plantedIso = {
  ...cuboIso,
  faces: cuboIso.faces.map((f, i) => (i === 0 ? { ...f, cornerAngles: f.cornerAngles.map((a) => a + 0.1) } : f)),
};
const plantedSum = readVertexCurvatures(plantedIso).reduce((s, r) => s + r.curvature, 0);
check('§7 (E3) ★★ THE STAMP BITES: ONE medial face planted +0.1 per corner → Σ ≠ 2πχ, off by exactly the planted bias — the stamp must be the real combinatorial angle, never a constant',
  !near(plantedSum, 4 * P) && near(plantedSum, 4 * P - 0.1 * cuboIso.faces[0].vertexIds.length));
// E4 — the horizon untouched: stamps confined to the face constructors
const amboSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/ambo.ts'), 'utf8');
const pyritoSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/pyritohedralDiagonalization.ts'), 'utf8');
check('§7 (E4) THE HORIZON UNTOUCHED: the stamps live ONLY at the face constructors (7 `cornerAngles` occurrences in ambo — the parent-cell RIDE [3: guard + key + value] + 2 core mints + 2 residue mints; 6 in pyritohedral — R1 centralized the copies into ownedAngleAtom [type 1 + re-derive 1 + ride guard/key/value 3] + the split mint [1]) and the horizon reader module (trisonizedMidwifeReadingV0 — the apex-trace median, recorded-never-drawn) is BYTE-IDENTICAL to HEAD, stamping nothing',
  (amboSrc.match(/cornerAngles/g) ?? []).length === 7 &&
    (pyritoSrc.match(/cornerAngles/g) ?? []).length === 6 &&
    pyritoSrc.includes('function ownedAngleAtom(') &&
    headEq('src/lib/trisonizedMidwifeReadingV0.ts') &&
    !fs.readFileSync(path.join(repoRoot, 'src/lib/trisonizedMidwifeReadingV0.ts'), 'utf8').includes('cornerAngles'));

// ═══════════════════════════════════════════════════════════════════════════
// §8 — R3a (B-109 §1): THE FAN ORDER IS CARRIED, NOT POSITIONAL. B-108
// measured the old atan2 sort re-shaping with the positions (6/12 dual face
// ids drifted across R1's relaxation; ±1e-9 jitter flipped a linear order)
// while the cycles stayed correct. The port (the frozen dualization's own
// edge-adjacency idiom, id-keyed start, ONE metric chirality bit) is
// behavior-neutral at the cycle level BY THAT MEASUREMENT — so these legs
// are its falsifiers: fan correctness stays true, and the ids stop moving.
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n----- §8 (R3a) the fan order is carried: ids stable across the relaxation and under jitter -----');
const icosaVertexIds = new Set(icosaCell.vertexIds);
const dualOf = (shapeX) => buildDualCorrespondenceModel(shapeX, shapeX.cells.find((c) => c.topology === 'pyritohedral-icosahedron'), 'dodecahedron');
const modelNow = buildDualCorrespondenceModel(shapeA, icosaCell, 'dodecahedron');
// the t=1 world: positions swapped back to the parent ambo's (the pre-R1
// output — byte-identical combinatorics by the R1 witness's own clause)
const shapeT1 = JSON.parse(JSON.stringify(shapeA));
{
  const parentAmboVertices = (() => {
    let s = createSeedShape('cube');
    s = applyAmboDissection(s, selectActive(s, 'seed').id);
    return s.vertices;
  })();
  for (const vId of icosaCell.vertexIds) shapeT1.vertices[vId].position = [...parentAmboVertices[vId].position];
}
const modelT1 = dualOf(shapeT1);
const jitterShape = JSON.parse(JSON.stringify(shapeA));
[...icosaCell.vertexIds].forEach((vId, i) => {
  jitterShape.vertices[vId].position = jitterShape.vertices[vId].position.map((x, k) => x + 1e-9 * Math.sin(i * 7 + k * 3));
});
const modelJitter = dualOf(jitterShape);
const faceIdsOf = (m) => m.dualFaces.map((f) => f.id).sort().join('|');
check('§8 (R3a) ★★ THE IDS STOP MOVING: the dual face ids are IDENTICAL across the metric relaxation (t=1 ↔ t=1/φ; B-108 measured 6/12 drifting before the port) and under a ±1e-9 jitter (1/12 flipped before)',
  faceIdsOf(modelNow) === faceIdsOf(modelT1) && faceIdsOf(modelNow) === faceIdsOf(modelJitter));
check('§8 (R3a) the fan cycles stay TRUE on the carried complex at both metrics: every consecutive pair of source faces in every dual cycle shares exactly one edge through its vertex',
  (() => {
    const faceById = new Map(shapeA.faces.map((f) => [f.id, f]));
    const fanTrue = (m) => {
      for (const df of m.dualFaces) {
        const src = m.dualFaceToSourceVertex[df.id];
        const cyc = df.vertexIds.map((dv) => faceById.get(m.dualVertexToSourceFace[dv]));
        for (let i = 0; i < cyc.length; i += 1) {
          const f1 = cyc[i];
          const f2 = cyc[(i + 1) % cyc.length];
          const at = (f, v) => {
            const n = f.vertexIds.length;
            const k = f.vertexIds.indexOf(v);
            if (k < 0) return [];
            const key = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
            return [key(v, f.vertexIds[(k + 1) % n]), key(v, f.vertexIds[(k - 1 + n) % n])];
          };
          if (at(f1, src).filter((k) => at(f2, src).includes(k)).length !== 1) return false;
        }
      }
      return true;
    };
    return fanTrue(modelNow) && fanTrue(modelT1);
  })());
check('§8 (R3a) the chirality bit held: every dual cycle advances POSITIVELY in the outward tangent frame (the old convention\'s winding, preserved through the port)',
  (() => {
    const centroidOfCell = (() => {
      const c = [0, 0, 0];
      for (const vId of icosaCell.vertexIds) {
        const p = shapeA.vertices[vId].position;
        c[0] += p[0] / 12; c[1] += p[1] / 12; c[2] += p[2] / 12;
      }
      return c;
    })();
    for (const df of modelNow.dualFaces) {
      const srcId = modelNow.dualFaceToSourceVertex[df.id];
      const v = shapeA.vertices[srcId].position;
      const nrm = [v[0] - centroidOfCell[0], v[1] - centroidOfCell[1], v[2] - centroidOfCell[2]];
      const ln = Math.hypot(...nrm);
      const n = nrm.map((x) => x / ln);
      const ref = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
      const u0 = [n[1] * ref[2] - n[2] * ref[1], n[2] * ref[0] - n[0] * ref[2], n[0] * ref[1] - n[1] * ref[0]];
      const lu = Math.hypot(...u0);
      const u = u0.map((x) => x / lu);
      const w = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
      const angles = df.vertexIds.map((dv) => {
        const faceId = modelNow.dualVertexToSourceFace[dv];
        const face = shapeA.faces.find((f) => f.id === faceId);
        const c = [0, 0, 0];
        for (const vv of face.vertexIds) {
          const p = shapeA.vertices[vv].position;
          c[0] += p[0] / face.vertexIds.length; c[1] += p[1] / face.vertexIds.length; c[2] += p[2] / face.vertexIds.length;
        }
        const d = [c[0] - v[0], c[1] - v[1], c[2] - v[2]];
        return Math.atan2(d[0] * w[0] + d[1] * w[1] + d[2] * w[2], d[0] * u[0] + d[1] * u[1] + d[2] * u[2]);
      });
      for (let i = 0; i < angles.length; i += 1) {
        let delta = angles[(i + 1) % angles.length] - angles[i];
        while (delta <= -Math.PI) delta += 2 * Math.PI;
        while (delta > Math.PI) delta -= 2 * Math.PI;
        if (delta <= 0) return false;
      }
    }
    return true;
  })());

// ═══════════════════════════════════════════════════════════════════════════
// §9 — R3b: Σ = 4π SEALED AS MEASURED (the ⚑ METRIC DEBT above, collected).
// The header's flag recorded the pre-R1 truth: the centroid-dual of the
// UNRELAXED seed was a skew shadow (pentagon sums 536.8° ≠ 540°; Σ = 4.21π).
// R1 relaxed the seed, so the centroid-dual of the icosahedron cell is now
// the REGULAR dodecahedron and the MEASURED seal closes — acos over the
// dual vertices' own positions, no idealize anywhere in the leg.
// ═══════════════════════════════════════════════════════════════════════════
console.log('\n----- §9 (R3b) Σ = 4π AS MEASURED: acos over the dual\'s own positions -----');
const measureDual = (m, shapeX) => {
  const posOfDual = new Map(Object.entries(m.dualVertices).map(([dvId, entry]) => [dvId, (entry.vertex ?? entry).position]));
  const cornersAtDualVertex = new Map();
  const faceSums = [];
  for (const df of m.dualFaces) {
    const cyc = df.vertexIds;
    let sum = 0;
    for (let k = 0; k < cyc.length; k += 1) {
      const p = posOfDual.get(cyc[k]);
      const prev = posOfDual.get(cyc[(k - 1 + cyc.length) % cyc.length]);
      const next = posOfDual.get(cyc[(k + 1) % cyc.length]);
      const e1 = [prev[0] - p[0], prev[1] - p[1], prev[2] - p[2]];
      const e2 = [next[0] - p[0], next[1] - p[1], next[2] - p[2]];
      const cosA = (e1[0] * e2[0] + e1[1] * e2[1] + e1[2] * e2[2]) / (Math.hypot(...e1) * Math.hypot(...e2));
      const a = Math.acos(Math.max(-1, Math.min(1, cosA)));
      sum += a;
      cornersAtDualVertex.set(cyc[k], (cornersAtDualVertex.get(cyc[k]) ?? 0) + a);
    }
    faceSums.push(sum);
  }
  let sigma = 0;
  for (const total of cornersAtDualVertex.values()) sigma += 2 * Math.PI - total;
  return { faceSums, sigma, vertexCount: cornersAtDualVertex.size };
};
const measuredNow = measureDual(modelNow, shapeA);
const measuredT1 = measureDual(modelT1, shapeT1);
check('§9 (R3b) ★★ THE SEAL, MEASURED: on the R1-relaxed chain every dual pentagon MEASURES 5 × 108° = 540° (acos over positions, within 1e-9) and Σ deficit = 4π at the float floor — the DUAL row\'s kill, collected',
  measuredNow.vertexCount === 20 &&
  measuredNow.faceSums.length === 12 &&
  measuredNow.faceSums.every((s) => Math.abs((s * 180) / P - 540) < 1e-9) &&
  Math.abs(measuredNow.sigma - 4 * P) < 1e-9);
check('§9 (R3b) ⛔ the carried control (the ⚑ flag\'s own numbers): the PRE-R1 skew shadow measures pentagon sums ≈ 536.8° ≠ 540° and Σ ≈ 4.21π ≠ 4π — the fail side the seal swung from',
  (() => {
    const someSkew = measuredT1.faceSums.some((s) => Math.abs((s * 180) / P - 536.85) < 0.2);
    return someSkew && Math.abs(measuredT1.sigma / P - 4.21) < 0.02 && Math.abs(measuredT1.sigma - 4 * P) > 0.1;
  })());
note(`measured now: Σ = ${(measuredNow.sigma / P).toFixed(6)}π · pre-R1 shadow: Σ = ${(measuredT1.sigma / P).toFixed(3)}π (the flag's 4.21π)`);

console.log(
  `\n--- P6 THE IDEAL DUAL — the ascent to the Forms (the swap untouched, the idealize count-only, clause (a) certifies the stamp, clause (b) detects the Form; §7 the ascent STANCE owned — the medial faces carry their angle and Σ = 2πχ seals on every rung; §8 the fan order carried, ids stable; §9 Σ = 4π SEALED AS MEASURED): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

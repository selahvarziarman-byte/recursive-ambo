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
check('§4 (E4) ★★ clause (a) GREENS both correct stamps: dodecahedron Σ = 4π = 2π·2 AND rhombic-dodecahedron Σ = 4π = 2π·2 (Euler\'s identity — it certifies the STAMP, never the Form)',
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
check('§7 (E2) ★★ …AND ON THE NEXT RUNG: the pyritohedral-icosahedron owns all 20 triangles at 60° (8 carried through the preserved-copy RIDE + 12 minted on the splits — the carry is load-bearing) → 12 interior vertices, deficit 60° each, Σ = 4π; §4 already sealed its dual dodecahedron at 4π on this same run',
  icosaIso.faces.every((f) => Array.isArray(f.cornerAngles) && f.cornerAngles.every((a) => near(a, P / 3))) &&
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
check('§7 (E4) THE HORIZON UNTOUCHED: the stamps live ONLY at the face constructors (7 `cornerAngles` occurrences in ambo — the parent-cell RIDE [3: guard + key + value] + 2 core mints + 2 residue mints; 7 in pyritohedral — the parent RIDE [3] + the preserved RIDE [3] + the split mint [1]) and the horizon reader module (trisonizedMidwifeReadingV0 — the apex-trace median, recorded-never-drawn) is BYTE-IDENTICAL to HEAD, stamping nothing',
  (amboSrc.match(/cornerAngles/g) ?? []).length === 7 &&
    (pyritoSrc.match(/cornerAngles/g) ?? []).length === 7 &&
    headEq('src/lib/trisonizedMidwifeReadingV0.ts') &&
    !fs.readFileSync(path.join(repoRoot, 'src/lib/trisonizedMidwifeReadingV0.ts'), 'utf8').includes('cornerAngles'));

console.log(
  `\n--- P6 THE IDEAL DUAL — the ascent to the Forms (the swap untouched, the idealize count-only, clause (a) certifies the stamp, clause (b) detects the Form; §7 the ascent STANCE owned — the medial faces carry their angle and Σ = 2πχ seals on every rung): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

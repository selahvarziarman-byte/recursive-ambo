#!/usr/bin/env node

// DIAGNOSTIC — THE APERTURE (engineer-chartered 2026-07-13, designer-ruled
// ADR 0004 + Amendments; SEAL-BEFORE-BUILD — BUILT BLIND to
// `.handoff/SEAL_THE_APERTURE.md`, SHA-256 47dae985…73fd, ratified by the
// engineer's inbox ruling of 2026-07-13 18:10; every pin below is the
// builder's own measurement).
//
// THE DELIVERABLE THIS PROVES: the person BUILDS a 3-manifold (seed cube →
// pick face pairs → pick the MAP on each → glue; the S² gate judges) and then
// STANDS INSIDE IT — the world's dim-3 register is the APERTURE (image-space
// transport on the engine's own gluing isometries; the room populated by the
// two-faced mask and the right-handed coil; the person's own form placeable),
// while the fundamental-domain diagram RELOCATES to the specimen.
//
// THE FOUR CLAUSES, each proving its teeth:
//   1 EXECUTE WHAT YOU WITNESS — the image-space transport RAN (a ray exiting
//     a face transports and continues — a single transported hit is pinned,
//     echo === 1); a copy-enumerating case is NOT a witness (the scene is
//     built once; craft dials change NO count).
//   2 ★ CARRY BOTH WRONG MECHANISMS IN-MEMORY (the witness outlives the
//     commit): (a) the 4-COPLANAR deck fit — det=+1 on the reflected pairing,
//     ZERO mirrored coils ever, where the witnessed 5-point fit gives det=−1
//     and mirrored coils > 0; (b) the MODE-LABEL door — 'reversing' picked,
//     map untouched → THE SAME T³ (orientable, H₁=Z³), where the map-picked
//     door gives w₁=1, H₁=Z²⊕Z/2.
//   3 ★ THE SPACE SHOWS ITS OWN w₁ — COUNTED: T³ → 0 reversed coils; the
//     reflected map → non-zero. Counts of COILS, never pixel fractions.
//   4 ★ NON-MOVEMENT — dim-1/2 bodies, specimens, birth marks, invariants:
//     the diff surface is MEASURED (no model/renderer/engine file moved; the
//     engine-freeze manifest holds at 27), and the dim-1/2 populations still
//     read their committed values through the untouched modules.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: {
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
};

require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText,
    filename,
  );
};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { createSeedShape } = req('src/data/seeds.ts');
const A = req('src/manuscript/apertureModel.ts');
const { buildFormDomain } = req('src/manuscript/formDomainModel.ts');
const { buildThreeTorusDomain, buildManuscriptWorld } = req('src/manuscript/worldModel.ts');
const { readDomainSpecimen } = req('src/manuscript/specimenModel.ts');
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

console.log('the aperture: the person builds a 3-manifold and stands inside it (blind concretes)\n');

const cube = createSeedShape('cube');
const faceId = (k) => `face:cube:${k}`;
const TRACE_W = 110;

// ═════ [a] the MAP MENU — the dihedral orbit IS the menu; mode DERIVED, never chosen ═
console.log('----- [a] the menu: 8 maps (4 preserving · 4 reversing, derived from the witnessed fit) — no toggle exists -----');
const lrMenu = A.dihedralMapCandidates(cube, faceId('left'), faceId('right'));
check('the face pair left↔right offers EXACTLY its dihedral orbit: 8 candidate maps — 4 derived preserving (fit det +1) and 4 derived reversing (fit det −1); the derived mode IS the determinant, measured per candidate',
  lrMenu.length === 8 &&
  lrMenu.filter((c) => c.derivedMode === 'preserving').length === 4 &&
  lrMenu.filter((c) => c.derivedMode === 'reversing').length === 4 &&
  lrMenu.every((c) => (c.derivedMode === 'preserving') === (c.det > 0)));
note(`menu dets: ${lrMenu.map((c) => `${c.key}:${c.det.toFixed(0)}`).join(' ')}`);
const chromeSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptChrome.tsx'), 'utf8');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
const modelSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureModel.ts'), 'utf8');
const rowIfaceStart = modelSrc.indexOf('export interface AperturePairRow');
const rowIfaceBlock = modelSrc.slice(rowIfaceStart, modelSrc.indexOf('}', rowIfaceStart));
check("⛔ THE KNOB THAT LIES NEVER REACHES THE PERSON: no option/select anywhere in the chrome carries a 'preserving'/'reversing' VALUE; the door's row type has NO mode FIELD (faceA · faceB · candidateKey only); the pairing's mode is set from candidate.derivedMode alone, and the view never passes a mode literal",
  !/value=["'](?:preserving|reversing)["']/.test(chromeSrc) &&
  !/mode\s*:/.test(rowIfaceBlock) &&
  modelSrc.includes('mode: candidate.derivedMode, // DERIVED and RECORDED — never chosen') &&
  !/mode:\s*['"](?:preserving|reversing)['"]/.test(viewSrc));

// ═════ [b] the person builds T³ — every pin lands ═══════════════════════════════
console.log('\n----- [b] the door: seed cube → the person\'s picks → glue → the tower certifies (battery 1–2) -----');
const t3Committed = buildThreeTorusDomain();
const rowFor = (a, b) => {
  const committed = t3Committed.complex.pairings.find((p) => p.faceA === faceId(a));
  const match = A.dihedralMapCandidates(cube, faceId(a), faceId(b)).find((c) =>
    Object.entries(committed.map).every(([x, y]) => c.map[x] === y));
  return { faceA: faceId(a), faceB: faceId(b), candidateKey: match.key };
};
const t3Rows = [rowFor('left', 'right'), rowFor('front', 'back'), rowFor('bottom', 'top')];
const personT3 = A.buildPersonDomain(cube, t3Rows, 'p-t3', 'person-built T³');
const t3Geometry = A.geometryFromTower(personT3.tower);
check('the person-built T³ (translation maps picked from the menu): sound · χ=0 · ORIENTABLE · H₁=Z³ · n=[4,4,4] → E³ — and the derived modes are RECORDED on the complex (all preserving)',
  personT3.tower.sound === true && personT3.tower.chi === 0 && personT3.tower.orientable === true &&
  personT3.tower.homology.H1.pretty === 'Z^3' &&
  eq(t3Geometry.n, [4, 4, 4]) && t3Geometry.kind === 'E3' &&
  personT3.complex.pairings.every((p) => p.mode === 'preserving'));
const lrReflected = lrMenu.filter((c) => c.derivedMode === 'reversing');
const flipRows = [{ ...t3Rows[0], candidateKey: lrReflected[0].key }, t3Rows[1], t3Rows[2]];
const personFlip = A.buildPersonDomain(cube, flipRows, 'p-flip', 'person-built FLIP');
check('ONE REFLECTED MAP picked instead (the menu\'s first reversing candidate): w₁=1 · NON-orientable · H₁=Z²⊕Z/2 — the manifold changed because the MAP changed; the recorded mode derives as reversing',
  personFlip.tower.sound === true && personFlip.tower.w1.w1 === 1 && personFlip.tower.orientable === false &&
  personFlip.tower.homology.H1.pretty === 'Z^2 ⊕ Z/2' &&
  personFlip.complex.pairings[0].mode === 'reversing');
check('the door reproduces the COMMITTED T³ byte-for-byte where it should: same pairing maps as worldModel\'s fixture (the person can build the canonical space by hand)',
  eq(personT3.complex.pairings.map((p) => p.map), t3Committed.complex.pairings.map((p) => p.map)));
// R2 (the row law ruled apart): an UNTOUCHED pair is the OPEN PAIR — boundary,
// never an error — so an untouched BOARD refuses globally and honestly; a
// HALF-PICKED pair is refused by name. `pick BOTH faces.` died with the
// one-predicate law (its leg here is recut to the new ladder — forced recut,
// disclosed in REPORT_HAMZAAD_R2).
check('the refusal ladder is named and curable: an untouched board refuses honestly (open pairs are boundary); a half-picked pair is named; a face reused twice refuses by name; an un-picked map prompts for the MAP',
  String(A.aperturePairingRefusal(cube, [{ faceA: null, faceB: null, candidateKey: null }, { faceA: null, faceB: null, candidateKey: null }, { faceA: null, faceB: null, candidateKey: null }])).includes('no identification yet') &&
  String(A.aperturePairingRefusal(cube, [
    { faceA: faceId('left'), faceB: null, candidateKey: null },
    { faceA: null, faceB: null, candidateKey: null },
    { faceA: null, faceB: null, candidateKey: null },
  ])).includes('pair 1: one face is picked') &&
  String(A.aperturePairingRefusal(cube, [
    { faceA: faceId('left'), faceB: faceId('right'), candidateKey: null },
    { faceA: faceId('left'), faceB: faceId('back'), candidateKey: null },
    { faceA: faceId('bottom'), faceB: faceId('top'), candidateKey: null },
  ])).includes('picked 2 times') &&
  String(A.aperturePairingRefusal(cube, t3Rows.map((r) => ({ ...r, candidateKey: null })))).includes('pick the identification MAP'));
// F.0e — THE RELOCATED REFUSAL (mothership §3.3, designer-ruled): the
// reversing-map-on-a-multi-cell limit used to surface only at COMMIT
// (buildPersonDomainVerdict's wall — still standing, byte-untouched); the
// ladder now names it AT PICK TIME. Falsifier both directions on a REAL
// multi-cell volume (a thickened cube surface — six prism cells): the picked
// REVERSING candidate refuses by name in the ladder; the preserving pick
// passes the same ladder (null — the glue may run). A door-blind revert of
// the ladder condition fails this leg.
const { thicken } = req('src/lib/thicken.ts');
const { computeSeedCornerAngles } = req('src/lib/conformalAtom.ts');
const multiVol = thicken(computeSeedCornerAngles({ ...createSeedShape('cube'), cells: [] })).shape;
const mcMenu = A.boundaryFacesOf(multiVol);
let mcPair = null;
outer: for (let i = 0; i < mcMenu.length; i += 1) {
  for (let j = i + 1; j < mcMenu.length; j += 1) {
    try {
      const cands = A.dihedralMapCandidates(multiVol, mcMenu[i].id, mcMenu[j].id);
      const rev = cands.find((c) => c.derivedMode === 'reversing');
      const pres = cands.find((c) => c.derivedMode === 'preserving');
      if (rev && pres) {
        mcPair = { a: mcMenu[i].id, b: mcMenu[j].id, rev, pres };
        break outer;
      }
    } catch {
      // a non-congruent pair offers nothing — keep looking
    }
  }
}
check('F.0e: on a multi-cell volume the ladder refuses a picked REVERSING map AT PICK TIME (one pick, not the whole act) — and the preserving pick passes the same ladder (null; the commit wall behind it stands byte-unchanged)',
  mcPair !== null &&
  multiVol.cells.length > 1 &&
  String(A.aperturePairingRefusal(multiVol, [{ faceA: mcPair.a, faceB: mcPair.b, candidateKey: mcPair.rev.key }])).includes('REVERSING identification on a multi-cell volume') &&
  A.aperturePairingRefusal(multiVol, [{ faceA: mcPair.a, faceB: mcPair.b, candidateKey: mcPair.pres.key }]) === null &&
  modelSrc.includes('a REVERSING identification on a multi-cell volume is a later chapter'));
if (mcPair) note(`multi-cell fixture: ${multiVol.cells.length} cells · ${mcPair.a} ↔ ${mcPair.b} · reversing ${mcPair.rev.key} refused live · preserving ${mcPair.pres.key} passes`);

// ═════ [c] CLAUSE 2(b) — the MODE-LABEL door, carried, exhibited lying ═══════════
console.log('\n----- [c] ★ the carried mode-label door: the toggle would hand back T³ and call it reversed -----');
// THE CARRIED WRONG MECHANISM (verbatim shape): offer preserving/reversing as
// a TOGGLE and keep the translation maps — the engine's own words
// (faceIdentification): "a translation map yields the same manifold whatever
// the label says."
const modeLabelDoor = (labels) =>
  buildFormDomain(
    cube,
    t3Committed.complex.pairings.map((p, i) => ({ ...p, mode: labels[i] })),
    'mutant-mode-door',
    'the knob that lies',
  );
const labelFlipped = modeLabelDoor(['reversing', 'preserving', 'preserving']);
check("★ CLAUSE 2(b): the mode-label door with 'reversing' picked and the MAP UNTOUCHED returns THE SAME MANIFOLD — sound, χ=0, ORIENTABLE, H₁=Z³ (the person would pick 'reversing' and silently get T³ back) — while the map-picked door above returned w₁=1, H₁=Z²⊕Z/2",
  labelFlipped.tower.sound === true && labelFlipped.tower.chi === 0 &&
  labelFlipped.tower.orientable === true && labelFlipped.tower.homology.H1.pretty === 'Z^3' &&
  personFlip.tower.orientable === false && personFlip.tower.homology.H1.pretty === 'Z^2 ⊕ Z/2');
note('the label selected the flipGlueFaces CONTRACT and reversed nothing — only a reflected map reverses');

// ═════ [d] CLAUSE 2(a) — the 4-coplanar fit, carried, exhibited blind ════════════
console.log('\n----- [d] ★ the carried 4-coplanar fit: det=+1 on the reflected pairing, zero mirrored coils EVER -----');
// THE CARRIED WRONG MECHANISM: the same rigid fit WITHOUT the fifth, off-plane
// constraint — four coplanar points admit BOTH a det=+1 rotation and the true
// det=−1 glide; the fit silently takes the rotation.
const det3 = (m) =>
  m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
  m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
  m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
const invT = (m) => {
  const D = det3(m);
  const c = [
    [m[1][1] * m[2][2] - m[1][2] * m[2][1], -(m[1][0] * m[2][2] - m[1][2] * m[2][0]), m[1][0] * m[2][1] - m[1][1] * m[2][0]],
    [-(m[0][1] * m[2][2] - m[0][2] * m[2][1]), m[0][0] * m[2][2] - m[0][2] * m[2][0], -(m[0][0] * m[2][1] - m[0][1] * m[2][0])],
    [m[0][1] * m[1][2] - m[0][2] * m[1][1], -(m[0][0] * m[1][2] - m[0][2] * m[1][0]), m[0][0] * m[1][1] - m[0][1] * m[1][0]],
  ];
  return c.map((r) => r.map((x) => x / D));
};
const fitCoplanar = (pairsIn) => {
  const n = pairsIn.length;
  const cA = [0, 0, 0];
  const cB = [0, 0, 0];
  for (const [a, b] of pairsIn) for (let i = 0; i < 3; i += 1) { cA[i] += a[i] / n; cB[i] += b[i] / n; }
  const H = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  for (const [a, b] of pairsIn) for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) H[i][j] += (a[i] - cA[i]) * (b[j] - cB[j]);
  let R = [[H[0][0], H[1][0], H[2][0]], [H[0][1], H[1][1], H[2][1]], [H[0][2], H[1][2], H[2][2]]];
  if (Math.abs(det3(R)) < 1e-9) R = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  for (let k = 0; k < 80; k += 1) { const iv = invT(R); for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) R[i][j] = 0.5 * (R[i][j] + iv[i][j]); }
  const t = [0, 0, 0];
  for (let i = 0; i < 3; i += 1) t[i] = cB[i] - (R[i][0] * cA[0] + R[i][1] * cA[1] + R[i][2] * cA[2]);
  return [R[0][0], R[0][1], R[0][2], R[1][0], R[1][1], R[1][2], R[2][0], R[2][1], R[2][2], t[0], t[1], t[2]];
};
const positions = new Map(Object.values(cube.vertices).map((v) => [v.id, v.position]));
const flipPairing = personFlip.complex.pairings[0]; // the reflected left↔right map
const coplanarCorrs = Object.entries(flipPairing.map).map(([a, b]) => [positions.get(a), positions.get(b)]);
// THE CARRIED WRONG FIFTH CONSTRAINT — the plausible one: "the face NORMALS
// correspond" (outward → outward). Four coplanar points admit both isometries;
// this nudge resolves the ambiguity to the det=+1 ROTATION, silently — where
// the CORRECT constraint (a point INSIDE the cell → a point OUTSIDE past the
// partner) forces the det=−1 glide. The rotation reproduces all four vertex
// correspondences EXACTLY, so the wrong fit LOOKS verified.
const seedGeom = A.readSeedGeometry(cube);
const fcA = seedGeom.faceCentroid(flipPairing.faceA);
const fcB = seedGeom.faceCentroid(flipPairing.faceB);
const nrm = (v) => {
  const L = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / L, v[1] / L, v[2] / L];
};
const nA = nrm([fcA[0] - seedGeom.cellCentroid[0], fcA[1] - seedGeom.cellCentroid[1], fcA[2] - seedGeom.cellCentroid[2]]);
const nB = nrm([fcB[0] - seedGeom.cellCentroid[0], fcB[1] - seedGeom.cellCentroid[1], fcB[2] - seedGeom.cellCentroid[2]]);
const EPS5 = 0.05;
const mutantG = fitCoplanar([
  ...coplanarCorrs,
  [
    [fcA[0] + EPS5 * nA[0], fcA[1] + EPS5 * nA[1], fcA[2] + EPS5 * nA[2]],
    [fcB[0] + EPS5 * nB[0], fcB[1] + EPS5 * nB[1], fcB[2] + EPS5 * nB[2]],
  ],
]);
const mutantDet = det3([[mutantG[0], mutantG[1], mutantG[2]], [mutantG[3], mutantG[4], mutantG[5]], [mutantG[6], mutantG[7], mutantG[8]]]);
const witnessedGate = A.buildAperture(personFlip);
const witnessedDet0 = witnessedGate.ok ? witnessedGate.deck[0].det : NaN;
check('★ CLAUSE 2(a) — THE DERIVATION TRAP, exhibited: on the REFLECTED pairing the carried 4-coplanar fit lands det=+1 (the rotation that agrees on the face) while the witnessed 5-point fit lands det=−1 (the true glide) — and the trap LOOKS verified: the mutant reproduces the engine\'s vertex map to 1e-6 too',
  mutantDet > 0 && witnessedDet0 < 0 &&
  Object.entries(flipPairing.map).every(([a, b]) => {
    const p = positions.get(a);
    const q = positions.get(b);
    const img = [
      mutantG[0] * p[0] + mutantG[1] * p[1] + mutantG[2] * p[2] + mutantG[9],
      mutantG[3] * p[0] + mutantG[4] * p[1] + mutantG[5] * p[2] + mutantG[10],
      mutantG[6] * p[0] + mutantG[7] * p[1] + mutantG[8] * p[2] + mutantG[11],
    ];
    return Math.hypot(img[0] - q[0], img[1] - q[1], img[2] - q[2]) < 1e-6;
  }));
const mutantMovedCentroid = [mutantG[9], mutantG[10], mutantG[11]]; // centroid of the cube is the origin
check('…and WITNESS (2) is exactly what catches it: the mutant isometry FIXES the cell (the image of the centroid stays inside the bounding box — a deck transformation never does), so the witnessed fit\'s moves-the-cell-off-itself assertion refuses the rotation; witness (1)\'s reproduce-the-map assertion also THROWS on a corrupted map',
  Math.abs(mutantMovedCentroid[0]) < 0.5 - 1e-9 && Math.abs(mutantMovedCentroid[1]) < 0.5 - 1e-9 && Math.abs(mutantMovedCentroid[2]) < 0.5 - 1e-9 &&
  modelSrc.includes('does not move the cell off itself') &&
  (() => {
    // corrupt the map with a TRANSPOSITION (swap exactly two images — not a
    // dihedral map, so no rigid isometry reproduces it): witness (1) throws
    const entries = Object.entries(flipPairing.map);
    const corrupted = Object.fromEntries(
      entries.map(([a, b], i) => [a, i === 0 ? entries[1][1] : i === 1 ? entries[0][1] : b]),
    );
    try {
      A.fitDeckIsometry(A.readSeedGeometry(cube), { ...flipPairing, map: corrupted });
      return false;
    } catch (error) {
      return /does not reproduce the engine's vertex map/.test(error.message);
    }
  })());
// the render consequence: the mutant deck shows ZERO mirrored coils, ever
// THE PROBES (2026-07-14): the room's inhabitants are the real scans,
// injected — the mask's two shells + the pointing hand (the coil is retired;
// the HAND is the only chirality counter). Ratified in diagnose-the-probes.cjs.
const PROBES = req('src/manuscript/apertureProbes.ts');
const probeList = [...PROBES.buildProbeMeshes().maskShells, PROBES.buildProbeMeshes().hand];
const scene = A.buildApertureScene(cube, null, probeList);
const t3Gate = A.buildAperture(personT3);
const flipDeckWitnessed = witnessedGate.deck;
const flipDeckMutant = [
  { ...flipDeckWitnessed[0], g: mutantG, gi: A.deckInverse(mutantG), det: mutantDet },
  flipDeckWitnessed[1],
  flipDeckWitnessed[2],
];
const traceFlipWitnessed = A.traceAperture({ deck: flipDeckWitnessed, scene, width: TRACE_W, height: TRACE_W });
const traceFlipMutant = A.traceAperture({ deck: flipDeckMutant, scene, width: TRACE_W, height: TRACE_W });
check('★ the trap\'s cost ON THE GLASS: with the carried 4-coplanar deck the reflected space shows ZERO LEFT hands (the person would never see the reversal); with the witnessed deck the LEFT hands are THERE and counted (recut: the hand replaced the retired coil — THE PROBES)',
  traceFlipMutant.counts.handCopiesMirrored === 0 && traceFlipWitnessed.counts.handCopiesMirrored > 0);
note(`witnessed FLIP: ${traceFlipWitnessed.counts.handCopiesVisible} hands visible, ${traceFlipWitnessed.counts.handCopiesMirrored} LEFT · mutant: ${traceFlipMutant.counts.handCopiesVisible} hands, ${traceFlipMutant.counts.handCopiesMirrored} mirrored`);

// ═════ [e] CLAUSE 1 + CLAUSE 3 — transported light; w₁ counted in coils ══════════
console.log('\n----- [e] the aperture: image-space transport ran; the space shows its own w₁ — counted in COILS -----');
const traceT3 = A.traceAperture({ deck: t3Gate.deck, scene, width: TRACE_W, height: TRACE_W });
check('CLAUSE 1 — EXECUTE WHAT YOU WITNESS: the T³ trace TRANSPORTED (transports ≫ 0, zero lost rays) and the room is POPULATED — the mask and the hand are seen as COPIES down the corridors (both counts > 0), the person\'s light doing the copying',
  traceT3.counts.transports > 1000 && traceT3.counts.lostRays === 0 &&
  traceT3.counts.maskCopiesVisible > 0 && traceT3.counts.handCopiesVisible > 0);
note(`T³ at ${TRACE_W}²: transports ${traceT3.counts.transports} · masks ${traceT3.counts.maskCopiesVisible} · hands ${traceT3.counts.handCopiesVisible} (min copy ${traceT3.counts.minCopyPixels}px)`);
// RECUT (THE SCENE, 2026-08-08): the pinned ray re-aims at the PLAQUE's
// station (the authored scene stands deeper in the room than the retired
// scan masks did — x 0.22 · z 0.1, thin along y)
const oneRay = A.traceAperture({
  deck: t3Gate.deck,
  scene,
  width: 1,
  height: 1,
  eye: [0.22, 0.42, 0.1],
  forward: [0, 1, 0],
  fovDegrees: 1,
  craft: { level: 3 },
});
check('…a SINGLE ray, pinned: aimed down the +y corridor from beyond the plaque, it EXITS the face, TRANSPORTS by the engine\'s gluing isometry, and hits the plaque in the NEXT copy — echo === 1 (a ray exiting a face transports and continues; that is the whole algorithm)',
  oneRay.counts.transports >= 1 && oneRay.hit[0] === 1 && oneRay.echo[0] === 1 && oneRay.material[0] === A.APERTURE_MATERIALS.MASK);
check('⛔ NEVER OBJECT-SPACE: the scene is built ONCE and no copy is ever materialized — deeper transport shows MORE copies of the SAME one mask mesh (level 2 < level 6 in distinct deck words) while the scene arrays are untouched; the craft dials change NO count (tone re-traced at γ=0.7 and γ=2.2: byte-identical counts)',
  (() => {
    const shallow = A.traceAperture({ deck: t3Gate.deck, scene, width: TRACE_W, height: TRACE_W, craft: { level: 2 } });
    const meshesBefore = scene.meshes.length;
    const trisBefore = scene.meshes[0].tris.length;
    const deep = A.traceAperture({ deck: t3Gate.deck, scene, width: TRACE_W, height: TRACE_W, craft: { level: 6 } });
    const softTone = A.traceAperture({ deck: t3Gate.deck, scene, width: TRACE_W, height: TRACE_W, craft: { toneGamma: 0.7 } });
    const hardTone = A.traceAperture({ deck: t3Gate.deck, scene, width: TRACE_W, height: TRACE_W, craft: { toneGamma: 2.2 } });
    return (
      deep.counts.maskCopiesVisible > shallow.counts.maskCopiesVisible &&
      scene.meshes.length === meshesBefore && scene.meshes[0].tris.length === trisBefore &&
      eq(softTone.counts, hardTone.counts)
    );
  })());
check('★ CLAUSE 3 — THE SPACE SHOWS ITS OWN w₁, COUNTED: T³ (w₁=0) → ZERO LEFT hands; the reflected map (w₁=1) → LEFT hands > 0 (the hand is the only chirality counter — a face is its own mirror). The caption never prints a pixel fraction',
  traceT3.counts.handCopiesMirrored === 0 && traceFlipWitnessed.counts.handCopiesMirrored > 0 &&
  !A.apertureCaption(t3Gate.geometry, traceT3.counts).includes('%') &&
  !A.apertureCaption(t3Gate.geometry, traceT3.counts).includes('px'));
note(`caption (T³): "${A.apertureCaption(t3Gate.geometry, traceT3.counts)}"`);
const stripComments = (src) =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, '') // block comments (docstrings)
    .split(/\r?\n/)
    .map((l) => l.split('//')[0])
    .join('\n');
const modelCode = stripComments(modelSrc);
const viewCode = stripComments(viewSrc);
const chromeCode = stripComments(chromeSrc);
// RECUT (THE SCENE, 2026-08-08): the chirality probe is the AUTHORED
// right-handed COIL (designer 1810 — drawn, not scanned; its handedness is
// MEASURED on the mesh in diagnose-the-probes). Still real geometry, still
// no arrow construct anywhere.
check('the chirality probe is REAL GEOMETRY, not a diagram: the model itself builds no coil (no buildCoilCapsules survives — the coil is the probes module\'s authored mesh at authored scale), and no arrow construct exists in the room\'s code (comment-stripped: no arrow, no arrowhead, no coneGeometry)',
  !modelCode.includes('buildCoilCapsules') &&
  probeList[2].tris.length > 300 && probeList[2].tris.length < 20000 &&
  !/arrow|arrowhead|coneGeometry/i.test(modelCode));
check('SAY ORBIT, NEVER π₁: the caption says "orbit"; no π₁ survives in the aperture model\'s, view\'s, or chrome\'s CODE (comment-stripped — the certified specimen reading "H₁ (= π₁ abelianized)" is specimenModel\'s committed row, untouched, and not the orbit caption)',
  A.apertureCaption(t3Gate.geometry, traceT3.counts).includes('orbit') &&
  !modelCode.includes('π₁') && !viewCode.includes('π₁') && !chromeCode.includes('π₁'));

// ═════ [f] the gate — DRAW NOTHING, SAY SO; geometry DERIVED, not typed ══════════
console.log('\n----- [f] the gate: unsound refuses by name; S³ refuses honestly; the geometry is derived from n (battery 5 · 7) -----');
const unsoundRows = [
  { faceA: faceId('left'), faceB: faceId('right'), candidateKey: 'd+0' },
  { faceA: faceId('front'), faceB: faceId('back'), candidateKey: 'd+1' },
  { faceA: faceId('bottom'), faceB: faceId('top'), candidateKey: 'd+0' },
];
const unsoundDomain = A.buildPersonDomain(cube, unsoundRows, 'p-bad', 'unsound pattern');
const unsoundGate = A.buildAperture(unsoundDomain);
check('an UNSOUND person-built pattern: the tower\'s S² gate refuses — the failure record NAMES what failed (vertex-link · the class itself) and the aperture DRAWS NOTHING, SAYING SO verbatim',
  unsoundDomain.tower.sound === false &&
  (unsoundDomain.tower.gate.failures ?? []).length > 0 &&
  unsoundGate.ok === false &&
  unsoundGate.reason.includes('S² gate: NOT sound') && unsoundGate.reason.includes('nothing is drawn') &&
  unsoundGate.reason.includes('vertex-link') && unsoundGate.reason.includes('vertex:cube:'));
note(`unsound refusal: ${unsoundGate.reason.slice(0, 140)}…`);
// B.0 THE HONEST DOOR (2026-07-15, sealed fab02d7e…e77e2, researcher-ruled:
// the engine is EUCLIDEAN): this leg INVERTS. The same sweep-found sound
// n=[3,3,3,3] form was refused here as "S³" off an edge count — k is the
// edge-class size, not an ambient curvature (LAW 15). The door now DRAWS it
// and names the honest reading: a Euclidean cone-manifold with cone edges at
// k×90° — never S³. Ratified in diagnose-the-honest-door.cjs.
let coneFound = null;
const adjPairs = [['left', 'front'], ['right', 'back'], ['bottom', 'top']];
const adjCands = adjPairs.map(([a, b]) => A.dihedralMapCandidates(cube, faceId(a), faceId(b)));
outer: for (const c0 of adjCands[0])
  for (const c1 of adjCands[1])
    for (const c2 of adjCands[2]) {
      const rows = adjPairs.map(([a, b], i) => ({ faceA: faceId(a), faceB: faceId(b), candidateKey: [c0, c1, c2][i].key }));
      try {
        const d = A.buildPersonDomain(cube, rows, 'p-s3', 'sweep');
        const g = A.geometryFromTower(d.tower);
        if (d.tower.sound && g.n.every((v) => v === 3)) {
          coneFound = { rows: [c0.key, c1.key, c2.key], domain: d, geometry: g };
          break outer;
        }
      } catch (error) {
        // the engine's own loud refusal (level3Orientation FOLDED) — reported in the handback, surfaced by the door verbatim
      }
    }
check('the SOUND n=[3,3,3,3] form (the adjacent matching, found by sweep — refused as "S³" before B.0) now DRAWS: the gate is ok, and the geometry names the honest reading — a Euclidean cone-manifold with cone edges 4 × 270°, never S³ (k is the edge-class size, not an ambient)',
  coneFound !== null &&
  coneFound.geometry.n.every((v) => v === 3) &&
  coneFound.geometry.kind === 'cone' &&
  coneFound.geometry.label.includes('Euclidean cone-manifold') &&
  coneFound.geometry.label.includes('4 × 270°') &&
  !/S³|S3|H³|H3|spherical|hyperbolic/.test(coneFound.geometry.label) &&
  (() => {
    const gate = A.buildAperture(coneFound.domain);
    return gate.ok === true && gate.deck.length > 0;
  })());
note(`cone fixture: maps [${coneFound ? coneFound.rows.join(', ') : '—'}] · n=[${coneFound ? coneFound.geometry.n.join(',') : '—'}] · ${coneFound ? coneFound.geometry.label.slice(0, 80) : '—'}`);
check('the GEOMETRY is DERIVED from the tower\'s own edge links, never typed in: n = tower.gate.edgeLinks[].memberEdgeIds.length (source-asserted on the selector) and T³ reads E³ from n=[4,4,4]',
  modelSrc.includes('tower.gate.edgeLinks.map((link) => link.memberEdgeIds.length)') &&
  t3Gate.ok === true && t3Gate.geometry.label.includes('n=[4,4,4]'));
check('the view DRAWS NOTHING behind a refused gate: ApertureBody renders null without a trace, and the refusal reason IS the caption (source-asserted)',
  fs.readFileSync(path.join(repoRoot, 'src/manuscript/ApertureView.tsx'), 'utf8').includes('if (!texture) return null;') &&
  viewSrc.includes('return { key: model.key, gate, trace: null, caption: gate.reason };'));

// ═════ [g] battery 6 — the person PUTS A FORM IN THE ROOM ════════════════════════
console.log('\n----- [g] the person\'s own form, placed: the light carries it down every corridor (battery 6) -----');
const torus = immerseSurface({ surface: 'torus', resolution: 14 });
const sceneWithForm = A.buildApertureScene(cube, torus.shape, probeList);
const traceWithForm = A.traceAperture({ deck: t3Gate.deck, scene: sceneWithForm, width: TRACE_W, height: TRACE_W });
check('the committed torus immersion PLACED in the T³ room: the scene carries exactly one more mesh than the probes (built once), the form is SEEN as copies (> 0 counted), and the caption counts it as OBJECTS',
  sceneWithForm.meshes.length === probeList.length + 1 &&
  traceWithForm.counts.formCopiesVisible > 0 &&
  A.apertureCaption(t3Gate.geometry, traceWithForm.counts).includes('of the placed form'));
note(`with the torus placed: ${traceWithForm.counts.formCopiesVisible} copies of the form visible · caption: "${A.apertureCaption(t3Gate.geometry, traceWithForm.counts)}"`);

// ═════ [h] battery 3 · 4 · 9 — populated room · the relocated specimen · the craft surface ═
console.log('\n----- [h] the registers invert; the room is furnished; the craft surface is the designer\'s (battery 3 · 4 · 9) -----');
// RECUT (THE SCENE, 2026-08-08): the real-scans law is SUPERSEDED (designer
// 1810) — the scanned pair carried an embossed WATERMARK across both faces
// and was deleted with its whole defect class. The inhabitants are AUTHORED:
// the happy/sad Janus plaque + the right-handed coil, at authored scale.
check('the room\'s inhabitants are the AUTHORED SCENE (drawn, not scanned — the watermark incident retired the scan law): two plaque faces + the coil at authored scale (thousands of triangles each, never a scan\'s hundreds of thousands) — and the scaffold tone defaults FAINT (at most scaffolding: below every object tone)',
  probeList[0].tris.length > 500 && probeList[0].tris.length < 20000 &&
  probeList[1].tris.length > 500 && probeList[1].tris.length < 20000 &&
  probeList[2].tris.length > 300 && probeList[2].tris.length < 20000 &&
  A.APERTURE_CRAFT_DEFAULTS.scaffoldTone < 0.5 &&
  A.APERTURE_CRAFT_DEFAULTS.scaffoldTone < A.APERTURE_CRAFT_DEFAULTS.maskTone &&
  A.APERTURE_CRAFT_DEFAULTS.scaffoldTone < A.APERTURE_CRAFT_DEFAULTS.handTone);
// F.0 recut (2026-08-20 engineer 2300, disclosed for pricing): the mandate
// ORDERS a second InkedDomain mount — the LIVE skeleton over the domain the
// panel's rows make (`liveApertureDomain`, gated on the open door) — so the
// old exactly-one-mount pin is stale against the mandated move. The pin now
// names BOTH mounts: the summoned specimen mount AND the live-build mount,
// and nothing else.
// F.0c recut (2026-08-21 coder): THE RULING — with the aperture door open the
// person's question owns the stage, so the SPECIMEN mount is DISARMED while
// the door is open (`summoned && !apertureOpen`). The pin now names the door
// on BOTH mounts; a revert to a door-blind `summoned ?` arming fails it.
check('the SPECIMEN carries the relocated fundamental domain + pairings + tower: readDomainSpecimen (BYTE-UNCHANGED specimenModel) still reads S² gate · χ · orientable · H₁ · CW counts · face-pairs, and the view mounts the committed InkedDomain at EXACTLY TWO named sites — summoned-on-select while the door is shut (the specimen — the open door disarms it) and the F.0 live-build skeleton (door-gated)',
  (() => {
    const reading = readDomainSpecimen(personT3);
    const labels = reading.rows.map((r) => r.label);
    return (
      reading.kind === 'domain' &&
      ['S² gate', 'Euler χ', 'orientable', 'H₁ (= π₁ abelianized)', 'CW counts', 'face-pairs'].every((l) => labels.includes(l)) &&
      (viewSrc.match(/<InkedDomain/g) ?? []).length === 2 &&
      /apertureOpen && liveApertureDomain[\s\S]{0,700}<InkedDomain/.test(viewSrc) &&
      /summoned && !apertureOpen \?[\s\S]{0,400}<InkedDomain/.test(viewSrc) &&
      viewSrc.includes('<ApertureBody')
    );
  })());
// RE-CUT (THE INK's double-fade fix, 2026-07-14): echoFade LEFT the tracer's
// craft — one dial, one home (the ink, on the marks); value carries darkness
// only. The craft surface still holds the tracer's own dials.
check('the CRAFT SURFACE is exposed, not dialed by the builder: tone curve · contour weight · per-object tones live in APERTURE_CRAFT_DEFAULTS + designDefaults.world.aperture + a Leva folder the DESIGNER owns (source-asserted); echoFade lives in ONE home — the INK\'s defaults, not the tracer\'s (the double-fade re-cut); the ink stays manuscript grey-on-paper (no photoreal material anywhere in the model)',
  ['toneGamma', 'contourWeight', 'maskTone', 'handTone', 'scaffoldTone', 'formTone'].every((k) => k in A.APERTURE_CRAFT_DEFAULTS) &&
  !('echoFade' in A.APERTURE_CRAFT_DEFAULTS) &&
  'echoFade' in req('src/manuscript/apertureInk.ts').APERTURE_INK_DEFAULTS &&
  fs.readFileSync(path.join(repoRoot, 'src/design/designDefaults.ts'), 'utf8').includes('aperture: {') &&
  viewSrc.includes("useControls('world · aperture'") &&
  !/specular|metalness|roughness|MeshStandard|pointLight|spotLight/.test(modelSrc));

// ═════ [i] CLAUSE 4 — dim-1/2 NON-MOVEMENT, measured on the diff surface ═════════
console.log('\n----- [i] ★ non-movement: no dim-1/2 body, specimen, birth mark or invariant moved — measured (clause 4 · battery 8) -----');
// RE-CUT (engineer-chartered 2026-07-13, post-audit): the raw `git diff`
// listing is CR-SENSITIVE — the repo's standing CRLF phantoms made this leg
// permanently red in the audit environment (fail-safe, but a permanently-red
// check is one people learn to ignore; that is how a guard dies). The listing
// is now CANDIDATES ONLY: a file counts as MOVED only if its CR-STRIPPED
// SHA-256 differs from HEAD's — the same CR-strip the freeze checker uses,
// reused. The HEAD blob is read via `git cat-file blob` (plumbing) — NOT the
// retired `git show HEAD:` guard idiom the engine-freeze inventory pins; this
// is a per-mandate diff-surface leg, disclosed in the handback.
const { sha256OfCrStripped } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));
const headBlobOf = (file) =>
  execSync(`git cat-file blob HEAD:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
const movedCrInsensitive = (file, workingOverride) => {
  // a file with NO HEAD blob is a NEW ARRIVAL, not moved content (a staged-
// added file enters `git diff HEAD` — the probes' baked module, staged by
// the small-run re-cut 2026-07-14, is the case in point); arrivals are
// governed by the manifest completeness scan and the fifth guard
// (checkUntrackedImports), never by this drift leg.
  let head;
  try {
    head = headBlobOf(file);
  } catch {
    return false;
  }
  // THE SCENE (2026-08-08): a file with a HEAD blob but NO working copy is a
  // DELETION — content moved (the ink witness's own deletion recut, mirrored
  // here; the watermarked baked-scan module is the case in point). Before
  // this the leg CRASHED on any deletion.
  let working;
  if (workingOverride !== undefined) {
    working = workingOverride;
  } else {
    try {
      working = fs.readFileSync(path.join(repoRoot, file), 'utf8');
    } catch {
      return true;
    }
  }
  return sha256OfCrStripped(working) !== sha256OfCrStripped(head);
};
const diffCandidates = execSync('git diff HEAD --name-only -- src', { cwd: repoRoot, encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const changedSrc = diffCandidates.filter((f) => movedCrInsensitive(f));
const ALLOWED_SRC_CHANGES = new Set([
  'src/design/designDefaults.ts',
  'src/manuscript/ManuscriptChrome.tsx',
  'src/manuscript/ManuscriptView.tsx',
  // OPEN THE DOOR (2026-07-17, sealed 15966cf9…81de): the sew glyph joins the
  // NOT_FROZEN glyph chrome — the dock's sixth group (2026-07-11) never had a
  // glyph and the person's app could not mount; the opened-door screenshot
  // rides the handoff. Ratified by that mandate's own §5 (SEE IT OPEN).
  'src/manuscript/OperationGlyphs.tsx',
  // THE INK (engineer-chartered 2026-07-14, sealed 5c430603…9f7e): the ink
  // mandate's sanctioned surface — the additive depth buffer in the tracer
  // and the re-inked view wrap (the void is paper; the line carries the
  // form). Ratified in diagnose-the-ink.cjs; its Clause 4 proves the model
  // change PURELY ADDITIVE (HEAD a line-subsequence of the working file).
  'src/manuscript/apertureModel.ts',
  'src/manuscript/ApertureView.tsx',
  // THE FOLDED EDGE (2026-07-14, ADR 0022, sealed 82e98032…5b6e): the gate's
  // folded-edge verdict + the gate-first tower order — ratified in
  // diagnose-the-folded-edge.cjs (its Clause 4 proves the 415 non-folded
  // pairings byte-identical).
  'src/lib/level3SoundnessGate.ts',
  'src/lib/level3Invariants.ts',
  // THE PROBES (2026-07-14, sealed 8fcb8d42…4a69): the real-scan room — the
  // crease contour rides apertureInk; ratified in diagnose-the-probes.cjs.
  'src/manuscript/apertureInk.ts',
  // THE SCENE (2026-08-08, designer 1810 + the Janus correction): the probes
  // module AUTHORS the plaque + coil (the scans deleted with the watermark);
  // ratified in diagnose-the-probes.cjs.
  'src/manuscript/apertureProbes.ts',
  // THE SMALL RUN (2026-07-14, sealed 2eb45568…9060): that mandate's sanctioned
  // surface rides the same working tree — the custom-glue refusal reorder (the
  // wall before the door), the panel's gate-first seam, and the NUL→escape
  // substitution in faceIdentification (cooked values identical, proven);
  // manifest hash lines moved in the SAME change (the freeze law working);
  // ratified in diagnose-the-small-run.cjs.
  'src/playground/customGluing.ts',
  'src/lib/faceIdentification.ts',
  'src/components/PlaygroundOperationsPanel.tsx',
  // THE EXIT (2026-07-16, sealed a1587899…1049): the pair's exit gains the
  // parallel-rim conjunct (:132's own predicate) inside the NOT_FROZEN rim
  // module — no frozen file moves; ratified in diagnose-the-exit.cjs.
  'src/lib/surfaceRefinement.ts',
  // THE GATE (2026-07-17, sealed d130debf…21d3): the person's combine — a
  // store action (the assemble precedent) + its panel control; zero frozen
  // files; ratified in diagnose-the-gate.cjs.
  'src/store/playgroundStore.ts',
  // THICKEN (2026-07-18, sealed 039feb1b…82cae): the ×I product — three
  // sanctioned frozen edits (types/geometry + genealogyDag gain 'product';
  // surfaceClassifier's rider splits graph edges from true boundaries, all
  // re-sealed) + the production wiring (the lift's own store + Panels);
  // ratified in diagnose-thicken.cjs.
  'src/types/geometry.ts',
  'src/lib/genealogyDag.ts',
  'src/manuscript/surfaceClassifier.ts',
  'src/store/geometryStore.ts',
  'src/components/Panels.tsx',
  // C.1 THE FIELD IN THE SPECIMEN (2026-07-17, sealed 390c9046…c607): the
  // plain-form plate gains the optional field-layer mount (absent ⇒
  // byte-identical); zero frozen files; ratified in
  // diagnose-the-field-in-the-specimen.cjs.
  'src/manuscript/InkedPlainForm.tsx',
  // RUNG 1 / D1 — THE EXPLORE WINDOW's own surface (2026-08-07 fat charter +
  // SEAL_D1_EXPLORE_INK_RETUNE): the walked inside-view rides the aperture's
  // PASSED craft/ink params — its component is NOT_FROZEN under active
  // look-mandate churn (the D1 ink retune edits it while apertureModel and
  // apertureInk stay byte-identical, which THIS witness verifies above);
  // ratified per-build by the app-path witness leg (§E-EXPLORE / §E-D1).
  'src/manuscript/ExploreWindow.tsx',
  // THE SCENE (2026-08-08, designer 1810 + the watermark incident): the
  // watermarked baked-scan module is DELETED (a sanctioned deletion — its
  // whole defect class goes with it); ratified in diagnose-the-probes.cjs.
  'src/manuscript/apertureProbeAssets.ts',
  // THE GPU RESET (2026-08-09, CHARTER_GPU_EXPLORE_WINDOW_PORT): the CPU
  // still is RETIRED — the trace worker + the walk model are DELETED (the
  // WebGL2 fragment shader carries the transport loop now; a deletion counts
  // as moved content, rightly); ratified in diagnose-deficit-app.cjs
  // (§E-GPU / §E-GPU-SUBSTRATE).
  'src/manuscript/exploreTraceWorker.ts',
  'src/manuscript/exploreWindowModel.ts',
  // THE MULTI-CELL CUT + DOOR 3 (2026-08-13, CHARTER_MULTICELL +
  // SEAL_OPEN_STAR_EXTRACTOR, sovereign-ruled door 3): the route-agnostic
  // multi-cell consumer — formDomainModel gains sharedWallPairings + the
  // multi-cell buildFormDomain branch (the single-cell path byte-behavior-
  // identical); the arc's frozen union rides the standing entries above
  // (faceIdentification :49; geometry/genealogyDag gain 'open-lift', :88/:50)
  // with manifest re-seals in the same change; ratified in
  // scripts/app-leg/diagnose-open-lift.cjs (four plants RED-when-planted +
  // the sealed 300° end-to-end through the committed extractor).
  'src/manuscript/formDomainModel.ts',
  // …the card's honest open-lift words (researcher 1837 §2: the room's card
  // reads "lifted from ⟨terrain⟩", never "invoked" for an import):
  'src/manuscript/argumentReadingModel.ts',
  // …and the line-cite maintenance the frozen-union insertions force:
  // level3Subdivision's precondition cite re-points :316 → :382 (the
  // no-self-paired-face guard moved down with faceIdentification's
  // readSeedCells addition; diagnose-the-subdivision greps BOTH sides —
  // its own law is that the cite and the line move together).
  'src/lib/level3Subdivision.ts',
  // R2 THE SUBSTRATE ROOT (2026-08-14 mandate + the 1304 correction, ruled
  // (b)): the derived MODEL-face mint sites stop stamping regularCornerAngle
  // and acos-import their TRUE angles from carried positions
  // (cornerAngleImport.ts, a NEW NOT_FROZEN module); the FIVE swap sites live
  // in these two NOT_FROZEN ops (ambo core/residue mints + the pyritohedral
  // split mint — the Sovereign's D5 cure). dualView:986 is the P6 IDEALIZE —
  // the distance-free ascent, correct by construction — REVERTED to its
  // committed byte-identical state (it does not move). Ratified by
  // scripts/app-leg/diagnose-r2-angle-import.cjs (45·45·90 split, 90×4
  // square, the fan apex 60·60·45·45·90 Σ=300°). conformalAtom.ts (the
  // frozen invoke-seed stamp) byte-unchanged.
  'src/lib/ambo.ts',
  'src/lib/pyritohedralDiagonalization.ts',
  // D6(α) (2026-08-15 mandate; the face-normal quantity was REFUSED by the
  // substrate — embedded dihedrals tile 2π while intrinsic stamps sum to the
  // cone angle — and re-ruled): the pillar seal is the THICKEN-LIFT
  // COHERENCE guard — per cell, the dihedral record must equal the FACE
  // cornerAngle record it was lifted from (distance-free, no .position; the
  // conformal charter stands). The conformalAtom.ts edit + the manifest :45
  // re-seal ride ONE commit; ratified by
  // scripts/app-leg/diagnose-d6-face-normal-seal.cjs (a single bent record
  // FIRES it, either direction; the honest fan + the cone green).
  'src/lib/conformalAtom.ts',
  // D13 §3 (2026-08-18, engineer 2021 URGENT — the app DIED on a person
  // action): the error-boundary mounts — the new boundary component, its
  // tight mount in the view (already allowed above), and the LAST-RESORT
  // mounts in BOTH shells (AppShell's production route AND main.tsx's
  // `?manuscript` dev route, which mounts the view directly — the route the
  // crash was found on had no boundary at all until this cut). Ratified by
  // scripts/app-leg/diagnose-d13-the-door-speaks.cjs (the planted throws:
  // the tight catch leaves the page standing; the last-resort speaks).
  'src/manuscript/ManuscriptErrorBoundary.tsx',
  'src/AppShell.tsx',
  'src/main.tsx',
  // D12-b part 1 (2026-08-19, engineer 1740, researcher-ratified): the ×I
  // mint stops manufacturing id-as-label packets — `thicken.ts:175` writes
  // ABSENCE; readers resolve through lineage (presence-first). NOT_FROZEN
  // (manifest 182); ratified by
  // scripts/app-leg/diagnose-d12b-carried-names.cjs (the Sovereign's route
  // live + the three non-regression pins).
  'src/lib/thicken.ts',
]);
check('★ CLAUSE 4 — the measured diff surface, CR-INSENSITIVELY: every src file whose CONTENT moved vs HEAD is view/chrome/defaults or a later mandate\'s ratified surface (the small run\'s two engine edits carry their manifest hash updates in the same change); dim-1/2 bodies, specimens, birth marks and invariants are byte-identical to HEAD (CRLF phantoms are candidates, never verdicts), and the engine-freeze manifest still reads ok at 45 (import-closed)',
  changedSrc.every((f) => ALLOWED_SRC_CHANGES.has(f)) &&
  (() => {
    const { checkEngineFreeze } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));
    const freeze = checkEngineFreeze();
    return freeze.ok === true && freeze.checked === 46 && freeze.unlisted.length === 0;
  })());
note(`diff candidates: ${diffCandidates.length} · content-moved: [${changedSrc.join(', ') || 'empty'}]`);
// …and the CR-insensitive listing still BITES (a filter that cannot fail is a
// hole, not a filter): a real one-character in-memory edit to a MODEL file is
// counted as moved; the true content re-expressed with CRLF endings is NOT.
check('…and the re-cut leg still BITES: a one-character in-memory edit to worldModel.ts IS counted as moved; the true content passes as-is AND re-expressed with CRLF line endings (the phantom, dismissed; the edit, caught)',
  (() => {
    const MODEL = 'src/manuscript/worldModel.ts';
    const real = fs.readFileSync(path.join(repoRoot, MODEL), 'utf8');
    const flipped = real.slice(0, 100) + (real[100] === 'X' ? 'Y' : 'X') + real.slice(101);
    const crlf = real.replace(/\r/g, '').replace(/\n/g, '\r\n');
    return movedCrInsensitive(MODEL) === false &&
      movedCrInsensitive(MODEL, flipped) === true &&
      movedCrInsensitive(MODEL, crlf) === false;
  })());
const worldNow = buildManuscriptWorld(8);
check('…and the dim-1/2 populations read their committed values through the UNTOUCHED modules: dim-1 = the loop (b₁=1) + the arc (b₁=0); dim-2 = EMPTY since CUT 0 (THE GALLERY FIX — the always-on seed died; the six are SUMMONED through the person\'s own path, parity pinned in diagnose-manuscript-world); dim-3 world default = the T³ domain, byte-equal in its pairing maps to the committed fixture',
  worldNow.dim1.length === 2 &&
  worldNow.dim1[0].invariants.level1.b1 === 1 && worldNow.dim1[1].invariants.level1.b1 === 0 &&
  worldNow.dim2.length === 0 &&
  eq(worldNow.dim3[0].complex.pairings.map((p) => p.map), t3Committed.complex.pairings.map((p) => p.map)));

// ═════ [j] the engine freeze + bite (the standing leg) ═══════════════════════════
console.log('\n----- [j] the engine freeze manifest holds — and still bites -----');
const { checkEngineFreeze } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));
const freeze = checkEngineFreeze();
// 27 → 44 (2026-07-14, THE SMALL RUN): the freeze closed under imports.
check('THE ENGINE FREEZE MANIFEST: all 45 frozen engine files (import-closed) match their manifest hashes and every source file under the engine roots is classified (the aperture\'s two NEW manuscript files ride as NOT_FROZEN lines — the completeness law working) — drifted [] · missing [] · unlisted []',
  freeze.ok === true && freeze.checked === 46 &&
  freeze.drifted.length === 0 && freeze.missing.length === 0 && freeze.unlisted.length === 0);
const FREEZE_SENTINEL = 'src/lib/incidenceTraceRegistry.ts';
const sentinelContent = fs.readFileSync(path.join(repoRoot, FREEZE_SENTINEL), 'utf8');
const sentinelFlipped = sentinelContent.slice(0, 100) + (sentinelContent[100] === 'X' ? 'Y' : 'X') + sentinelContent.slice(101);
const freezeBite = checkEngineFreeze({ overrides: { [FREEZE_SENTINEL]: sentinelFlipped } });
const freezeCrlf = checkEngineFreeze({ overrides: { [FREEZE_SENTINEL]: sentinelContent.replace(/\r/g, '').replace(/\n/g, '\r\n') } });
check('…and the freeze check still BITES: a one-character in-memory mutation of the sentinel FAILS it (exactly that file drifts) while the CRLF re-expression PASSES (CR-insensitive — no false wolf)',
  freezeBite.ok === false && freezeBite.drifted.length === 1 && freezeBite.drifted[0] === FREEZE_SENTINEL &&
  freezeCrlf.ok === true);

// ═════ [k] B-101 §2b(i) — the off-itself witness reads the CELL, not its box ═
console.log('\n----- [k] B-101: a cell that under-fills its bbox keeps its REAL deck isometries; a refused candidate is never silent -----');
const octa = createSeedShape('octahedron');
const sharedCorners = (f, g) => f.vertexIds.filter((v) => g.vertexIds.includes(v)).length;
const findPair = (n) => {
  for (const f of octa.faces) for (const g of octa.faces) if (f !== g && sharedCorners(f, g) === n) return [f, g];
  return null;
};
const oppPair = findPair(0);
const adjPair = findPair(2);
check('the committed octahedron seed: ONE cell, 8 triangular faces; an opposite pair (no shared corner) and an adjacent pair (a shared edge) both exist',
  octa.cells.length === 1 && octa.faces.length === 8 && octa.faces.every((f) => f.vertexIds.length === 3) &&
  oppPair !== null && adjPair !== null);
const octaRefusals = [];
const oppMenu = A.dihedralMapCandidates(octa, oppPair[0].id, oppPair[1].id, (r) => octaRefusals.push(r));
const adjMenu = A.dihedralMapCandidates(octa, adjPair[0].id, adjPair[1].id, (r) => octaRefusals.push(r));
check("B-101 THE CURE, pinned on the geometry class the screen measured: the octahedron's opposite AND adjacent pairs each offer the FULL dihedral orbit — 6 real maps (3 preserving · 3 reversing, det-derived), ZERO refusals collected (the retired bbox slack refused ALL of these as 'did not move off itself')",
  oppMenu.length === 6 && adjMenu.length === 6 &&
  oppMenu.filter((c) => c.derivedMode === 'preserving').length === 3 &&
  oppMenu.filter((c) => c.derivedMode === 'reversing').length === 3 &&
  adjMenu.filter((c) => c.derivedMode === 'preserving').length === 3 &&
  adjMenu.filter((c) => c.derivedMode === 'reversing').length === 3 &&
  octaRefusals.length === 0);
// the regression falsifier AGAINST the old mechanism: this fitted isometry's
// moved centroid lands strictly INSIDE the cell's bbox (the old test's
// "inside" — it threw here) while the fit rightly SUCCEEDS (off the CELL)
const geomO = A.readSeedGeometry(octa);
const fA0 = geomO.faceById.get(oppPair[0].id);
const fB0 = geomO.faceById.get(oppPair[1].id);
const idMap = {};
for (let i = 0; i < 3; i += 1) idMap[fA0.cycle[i]] = fB0.cycle[i];
const fit0 = A.fitDeckIsometry(geomO, { faceA: oppPair[0].id, faceB: oppPair[1].id, mode: 'preserving', map: idMap });
const frame0 = geomO.insideFrameOf(oppPair[0].id);
const c0 = frame0.centroid;
const moved0 = [0, 1, 2].map((i) => fit0.g[3 * i] * c0[0] + fit0.g[3 * i + 1] * c0[1] + fit0.g[3 * i + 2] * c0[2] + fit0.g[9 + i]);
check('…the falsifier against the retired mechanism: the fitted deck isometry SUCCEEDS while its moved cell centroid sits strictly INSIDE the bbox (re-instating the bbox test turns this leg red — that inside read as "did not move off itself")',
  [0, 1, 2].every((k) => moved0[k] > frame0.lo[k] + 1e-9 && moved0[k] < frame0.hi[k] - 1e-9));
note(`moved centroid [${moved0.map((x) => x.toFixed(3)).join(', ')}] vs bbox lo [${frame0.lo.map((x) => x.toFixed(1)).join(', ')}] hi [${frame0.hi.map((x) => x.toFixed(1)).join(', ')}]`);
check('…and the degeneracy arm STANDS in source: the off-itself refusal sentence + the cell-planes test live; the bbox slack is retired',
  modelSrc.includes('does not move the cell off itself') &&
  modelSrc.includes('frameA.faces.every') &&
  !modelSrc.includes('movedCentroid[k] > frameA.lo[k]'));
// THE RIDER's falsifier — a manufactured all-refused pair: a 1×1×2 cuboid's
// square end vs oblong side have EQUAL corner counts but NO rigid map; every
// candidate must be refused WITH ITS REASON collected, none eaten
const cbV = (id, x, y, z) => [id, { id, position: [x, y, z] }];
const cuboid = {
  id: 'shape:b101:cuboid',
  name: 'cuboid 1x1x2',
  vertices: Object.fromEntries([
    cbV('cb:v0', 0, 0, 0), cbV('cb:v1', 1, 0, 0), cbV('cb:v2', 1, 1, 0), cbV('cb:v3', 0, 1, 0),
    cbV('cb:v4', 0, 0, 2), cbV('cb:v5', 1, 0, 2), cbV('cb:v6', 1, 1, 2), cbV('cb:v7', 0, 1, 2),
  ]),
  edges: [
    ['cb:e0', 'cb:v0', 'cb:v1'], ['cb:e1', 'cb:v1', 'cb:v2'], ['cb:e2', 'cb:v2', 'cb:v3'], ['cb:e3', 'cb:v3', 'cb:v0'],
    ['cb:e4', 'cb:v4', 'cb:v5'], ['cb:e5', 'cb:v5', 'cb:v6'], ['cb:e6', 'cb:v6', 'cb:v7'], ['cb:e7', 'cb:v7', 'cb:v4'],
    ['cb:e8', 'cb:v0', 'cb:v4'], ['cb:e9', 'cb:v1', 'cb:v5'], ['cb:e10', 'cb:v2', 'cb:v6'], ['cb:e11', 'cb:v3', 'cb:v7'],
  ].map(([id, a, b]) => ({ id, vertexIds: [a, b] })),
  faces: [
    ['cb:f-bottom', ['cb:v0', 'cb:v3', 'cb:v2', 'cb:v1']],
    ['cb:f-top', ['cb:v4', 'cb:v5', 'cb:v6', 'cb:v7']],
    ['cb:f-front', ['cb:v0', 'cb:v1', 'cb:v5', 'cb:v4']],
    ['cb:f-right', ['cb:v1', 'cb:v2', 'cb:v6', 'cb:v5']],
    ['cb:f-back', ['cb:v2', 'cb:v3', 'cb:v7', 'cb:v6']],
    ['cb:f-left', ['cb:v3', 'cb:v0', 'cb:v4', 'cb:v7']],
  ].map(([id, cycle]) => ({ id, vertexIds: cycle })),
  cells: [{
    id: 'cb:cell',
    vertexIds: ['cb:v0', 'cb:v1', 'cb:v2', 'cb:v3', 'cb:v4', 'cb:v5', 'cb:v6', 'cb:v7'],
    faceIds: ['cb:f-bottom', 'cb:f-top', 'cb:f-front', 'cb:f-right', 'cb:f-back', 'cb:f-left'],
  }],
};
const cbRefusals = [];
const cbMenu = A.dihedralMapCandidates(cuboid, 'cb:f-bottom', 'cb:f-front', (r) => cbRefusals.push(r));
check("THE RIDER: the square-end×oblong-side pair (equal corner counts, no rigid map) yields an EMPTY menu with all 8 refusals COLLECTED, each carrying the fit's own thrown sentence — the catch no longer eats the reason",
  cbMenu.length === 0 && cbRefusals.length === 8 &&
  cbRefusals.every((r) => /does not reproduce|does not move the cell/.test(r.reason)));
note(`first collected refusal: ${cbRefusals[0] ? cbRefusals[0].key + ' — ' + cbRefusals[0].reason.slice(0, TRACE_W) : '(none)'}`);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

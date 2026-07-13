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
check('the refusal ladder is named and curable: empty rows prompt for faces; a face reused twice refuses by name; an un-picked map prompts for the MAP',
  String(A.aperturePairingRefusal(cube, [{ faceA: null, faceB: null, candidateKey: null }, { faceA: null, faceB: null, candidateKey: null }, { faceA: null, faceB: null, candidateKey: null }])).includes('pick BOTH faces') &&
  String(A.aperturePairingRefusal(cube, [
    { faceA: faceId('left'), faceB: faceId('right'), candidateKey: null },
    { faceA: faceId('left'), faceB: faceId('back'), candidateKey: null },
    { faceA: faceId('bottom'), faceB: faceId('top'), candidateKey: null },
  ])).includes('picked 2 times') &&
  String(A.aperturePairingRefusal(cube, t3Rows.map((r) => ({ ...r, candidateKey: null })))).includes('pick the identification MAP'));

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
const scene = A.buildApertureScene(cube, null);
const t3Gate = A.buildAperture(personT3);
const flipDeckWitnessed = witnessedGate.deck;
const flipDeckMutant = [
  { ...flipDeckWitnessed[0], g: mutantG, gi: A.deckInverse(mutantG), det: mutantDet },
  flipDeckWitnessed[1],
  flipDeckWitnessed[2],
];
const traceFlipWitnessed = A.traceAperture({ deck: flipDeckWitnessed, scene, width: TRACE_W, height: TRACE_W });
const traceFlipMutant = A.traceAperture({ deck: flipDeckMutant, scene, width: TRACE_W, height: TRACE_W });
check('★ the trap\'s cost ON THE GLASS: with the carried 4-coplanar deck the reflected space shows ZERO mirrored coils (the person would never see the reversal); with the witnessed deck the mirrored coils are THERE and counted',
  traceFlipMutant.counts.coilCopiesMirrored === 0 && traceFlipWitnessed.counts.coilCopiesMirrored > 0);
note(`witnessed FLIP: ${traceFlipWitnessed.counts.coilCopiesVisible} coils visible, ${traceFlipWitnessed.counts.coilCopiesMirrored} LEFT-handed · mutant: ${traceFlipMutant.counts.coilCopiesVisible} coils, ${traceFlipMutant.counts.coilCopiesMirrored} mirrored`);

// ═════ [e] CLAUSE 1 + CLAUSE 3 — transported light; w₁ counted in coils ══════════
console.log('\n----- [e] the aperture: image-space transport ran; the space shows its own w₁ — counted in COILS -----');
const traceT3 = A.traceAperture({ deck: t3Gate.deck, scene, width: TRACE_W, height: TRACE_W });
check('CLAUSE 1 — EXECUTE WHAT YOU WITNESS: the T³ trace TRANSPORTED (transports ≫ 0, zero lost rays) and the room is POPULATED — the mask and the coil are seen as COPIES down the corridors (both counts > 0), the person\'s light doing the copying',
  traceT3.counts.transports > 1000 && traceT3.counts.lostRays === 0 &&
  traceT3.counts.maskCopiesVisible > 0 && traceT3.counts.coilCopiesVisible > 0);
note(`T³ at ${TRACE_W}²: transports ${traceT3.counts.transports} · masks ${traceT3.counts.maskCopiesVisible} · coils ${traceT3.counts.coilCopiesVisible} (min copy ${traceT3.counts.minCopyPixels}px)`);
const oneRay = A.traceAperture({
  deck: t3Gate.deck,
  scene,
  width: 1,
  height: 1,
  eye: [0, 0.42, 0.28],
  forward: [0, 1, 0],
  fovDegrees: 1,
  craft: { level: 3 },
});
check('…a SINGLE ray, pinned: aimed down the +y corridor from beyond the mask, it EXITS the face, TRANSPORTS by the engine\'s gluing isometry, and hits the mask in the NEXT copy — echo === 1 (a ray exiting a face transports and continues; that is the whole algorithm)',
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
check('★ CLAUSE 3 — THE SPACE SHOWS ITS OWN w₁, COUNTED: T³ (w₁=0) → ZERO reversed coils; the reflected map (w₁=1) → mirrored coils > 0. Counts of COILS — the caption never prints a pixel fraction',
  traceT3.counts.coilCopiesMirrored === 0 && traceFlipWitnessed.counts.coilCopiesMirrored > 0 &&
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
check('the coil IS right-handed geometry, not a diagram: θ rises with z along EVERY capsule of the helix (measured), and no arrow construct exists in the room\'s code (comment-stripped source: no arrow, no cone, no arrowhead)',
  (() => {
    const capsules = A.buildCoilCapsules().filter((c) => c.material === A.APERTURE_MATERIALS.COIL);
    let rises = 0;
    for (const c of capsules) {
      const t0 = Math.atan2(c.a[1], c.a[0]);
      const t1 = Math.atan2(c.b[1], c.b[0]);
      let dTheta = t1 - t0;
      while (dTheta <= -Math.PI) dTheta += 2 * Math.PI;
      while (dTheta > Math.PI) dTheta -= 2 * Math.PI;
      if (dTheta > 0 && c.b[2] > c.a[2]) rises += 1;
    }
    return capsules.length > 50 && rises === capsules.length && !/arrow|arrowhead|coneGeometry/i.test(modelCode);
  })());
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
// find a SOUND non-E³ space through the door (the recession law refuses the ambient honestly)
let s3Found = null;
const adjPairs = [['left', 'front'], ['right', 'back'], ['bottom', 'top']];
const adjCands = adjPairs.map(([a, b]) => A.dihedralMapCandidates(cube, faceId(a), faceId(b)));
outer: for (const c0 of adjCands[0])
  for (const c1 of adjCands[1])
    for (const c2 of adjCands[2]) {
      const rows = adjPairs.map(([a, b], i) => ({ faceA: faceId(a), faceB: faceId(b), candidateKey: [c0, c1, c2][i].key }));
      try {
        const d = A.buildPersonDomain(cube, rows, 'p-s3', 'sweep');
        const g = A.geometryFromTower(d.tower);
        if (d.tower.sound && g.kind === 'S3') {
          s3Found = { rows: [c0.key, c1.key, c2.key], domain: d, geometry: g };
          break outer;
        }
      } catch (error) {
        // the engine's own loud refusal (level3Orientation FOLDED) — reported in the handback, surfaced by the door verbatim
      }
    }
check('a SOUND S³ manifold is door-reachable (the adjacent matching, found by sweep) — the recession law reads n=[3,3,3,3] uniform → θ=2π/3 > the cube\'s 90° dihedral → S³ — and the gate refuses to draw it BY NAME: only the E³ transport is built; nothing is drawn',
  s3Found !== null &&
  s3Found.geometry.n.every((v) => v === 3) &&
  (() => {
    const gate = A.buildAperture(s3Found.domain);
    return gate.ok === false && gate.reason.includes('S³') && gate.reason.includes('only the E³ transport is built') && gate.reason.includes('nothing is drawn');
  })());
note(`S³ fixture: maps [${s3Found ? s3Found.rows.join(', ') : '—'}] · n=[${s3Found ? s3Found.geometry.n.join(',') : '—'}]`);
check('the GEOMETRY is DERIVED from the tower\'s own edge links, never typed in: n = tower.gate.edgeLinks[].memberEdgeIds.length (source-asserted on the selector) and T³ reads E³ from n=[4,4,4]',
  modelSrc.includes('tower.gate.edgeLinks.map((link) => link.memberEdgeIds.length)') &&
  t3Gate.ok === true && t3Gate.geometry.label.includes('n=[4,4,4]'));
check('the view DRAWS NOTHING behind a refused gate: ApertureBody renders null without a trace, and the refusal reason IS the caption (source-asserted)',
  fs.readFileSync(path.join(repoRoot, 'src/manuscript/ApertureView.tsx'), 'utf8').includes('if (!texture) return null;') &&
  viewSrc.includes('return { key: model.key, gate, trace: null, caption: gate.reason };'));

// ═════ [g] battery 6 — the person PUTS A FORM IN THE ROOM ════════════════════════
console.log('\n----- [g] the person\'s own form, placed: the light carries it down every corridor (battery 6) -----');
const torus = immerseSurface({ surface: 'torus', resolution: 14 });
const sceneWithForm = A.buildApertureScene(cube, torus.shape);
const traceWithForm = A.traceAperture({ deck: t3Gate.deck, scene: sceneWithForm, width: TRACE_W, height: TRACE_W });
check('the committed torus immersion PLACED in the T³ room: the scene carries exactly one more mesh (built once), the form is SEEN as copies (> 0 counted), and the caption counts it as OBJECTS',
  sceneWithForm.meshes.length === 2 &&
  traceWithForm.counts.formCopiesVisible > 0 &&
  A.apertureCaption(t3Gate.geometry, traceWithForm.counts).includes('of the placed form'));
note(`with the torus placed: ${traceWithForm.counts.formCopiesVisible} copies of the form visible · caption: "${A.apertureCaption(t3Gate.geometry, traceWithForm.counts)}"`);

// ═════ [h] battery 3 · 4 · 9 — populated room · the relocated specimen · the craft surface ═
console.log('\n----- [h] the registers invert; the room is furnished; the craft surface is the designer\'s (battery 3 · 4 · 9) -----');
const mask = A.buildMaskMesh();
check('the room\'s two default inhabitants are REAL modelled things: the two-faced mask is a triangle MESH (hundreds of triangles, real eye/mouth openings — not primitive blobs), the coil a capsule helix — and the scaffold tone defaults FAINT (at most scaffolding: below every object tone)',
  mask.tris.length > 400 && mask.positions.length > 200 &&
  A.APERTURE_CRAFT_DEFAULTS.scaffoldTone < 0.5 &&
  A.APERTURE_CRAFT_DEFAULTS.scaffoldTone < A.APERTURE_CRAFT_DEFAULTS.maskTone &&
  A.APERTURE_CRAFT_DEFAULTS.scaffoldTone < A.APERTURE_CRAFT_DEFAULTS.coilTone);
check('the SPECIMEN carries the relocated fundamental domain + pairings + tower: readDomainSpecimen (BYTE-UNCHANGED specimenModel) still reads S² gate · χ · orientable · H₁ · CW counts · face-pairs, and the view mounts the committed InkedDomain ONLY summoned-on-select (exactly one mount, inside the summoned branch, beside the aperture)',
  (() => {
    const reading = readDomainSpecimen(personT3);
    const labels = reading.rows.map((r) => r.label);
    return (
      reading.kind === 'domain' &&
      ['S² gate', 'Euler χ', 'orientable', 'H₁ (= π₁ abelianized)', 'CW counts', 'face-pairs'].every((l) => labels.includes(l)) &&
      (viewSrc.match(/<InkedDomain/g) ?? []).length === 1 &&
      /summoned \?[\s\S]{0,400}<InkedDomain/.test(viewSrc) &&
      viewSrc.includes('<ApertureBody')
    );
  })());
check('the CRAFT SURFACE is exposed, not dialed by the builder: tone curve · contour weight · echo fade · per-object tones live in APERTURE_CRAFT_DEFAULTS + designDefaults.world.aperture + a Leva folder the DESIGNER owns (source-asserted); the ink stays manuscript grey-on-paper (no light source colour, no photoreal material anywhere in the model)',
  ['toneGamma', 'contourWeight', 'echoFade', 'maskTone', 'coilTone', 'scaffoldTone', 'formTone'].every((k) => k in A.APERTURE_CRAFT_DEFAULTS) &&
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
  const working = workingOverride ?? fs.readFileSync(path.join(repoRoot, file), 'utf8');
  return sha256OfCrStripped(working) !== sha256OfCrStripped(headBlobOf(file));
};
const diffCandidates = execSync('git diff HEAD --name-only -- src', { cwd: repoRoot, encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const changedSrc = diffCandidates.filter((f) => movedCrInsensitive(f));
const ALLOWED_SRC_CHANGES = new Set([
  'src/design/designDefaults.ts',
  'src/manuscript/ManuscriptChrome.tsx',
  'src/manuscript/ManuscriptView.tsx',
]);
check('★ CLAUSE 4 — the measured diff surface, CR-INSENSITIVELY: every src file whose CONTENT moved vs HEAD is view/chrome/defaults (the aperture model + view are NEW files); NOT ONE model, renderer, certifier or engine file moved — dim-1/2 bodies, specimens, birth marks and invariants are byte-identical to HEAD (CRLF phantoms are candidates, never verdicts), and the engine-freeze manifest still reads ok at 27',
  changedSrc.every((f) => ALLOWED_SRC_CHANGES.has(f)) &&
  (() => {
    const { checkEngineFreeze } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));
    const freeze = checkEngineFreeze();
    return freeze.ok === true && freeze.checked === 27 && freeze.unlisted.length === 0;
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
check('…and the dim-1/2 populations still read their committed values through the UNTOUCHED modules: dim-1 = the loop (b₁=1) + the arc (b₁=0); dim-2 = the six committed immersions; dim-3 world default = the T³ domain, byte-equal in its pairing maps to the committed fixture',
  worldNow.dim1.length === 2 &&
  worldNow.dim1[0].invariants.level1.b1 === 1 && worldNow.dim1[1].invariants.level1.b1 === 0 &&
  worldNow.dim2.length === 6 &&
  eq(worldNow.dim3[0].complex.pairings.map((p) => p.map), t3Committed.complex.pairings.map((p) => p.map)));

// ═════ [j] the engine freeze + bite (the standing leg) ═══════════════════════════
console.log('\n----- [j] the engine freeze manifest holds — and still bites -----');
const { checkEngineFreeze } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));
const freeze = checkEngineFreeze();
check('THE ENGINE FREEZE MANIFEST: all 27 frozen engine files match their manifest hashes and every source file under the engine roots is classified (the aperture\'s two NEW manuscript files ride as NOT_FROZEN lines — the completeness law working) — drifted [] · missing [] · unlisted []',
  freeze.ok === true && freeze.checked === 27 &&
  freeze.drifted.length === 0 && freeze.missing.length === 0 && freeze.unlisted.length === 0);
const FREEZE_SENTINEL = 'src/lib/incidenceTraceRegistry.ts';
const sentinelContent = fs.readFileSync(path.join(repoRoot, FREEZE_SENTINEL), 'utf8');
const sentinelFlipped = sentinelContent.slice(0, 100) + (sentinelContent[100] === 'X' ? 'Y' : 'X') + sentinelContent.slice(101);
const freezeBite = checkEngineFreeze({ overrides: { [FREEZE_SENTINEL]: sentinelFlipped } });
const freezeCrlf = checkEngineFreeze({ overrides: { [FREEZE_SENTINEL]: sentinelContent.replace(/\r/g, '').replace(/\n/g, '\r\n') } });
check('…and the freeze check still BITES: a one-character in-memory mutation of the sentinel FAILS it (exactly that file drifts) while the CRLF re-expression PASSES (CR-insensitive — no false wolf)',
  freezeBite.ok === false && freezeBite.drifted.length === 1 && freezeBite.drifted[0] === FREEZE_SENTINEL &&
  freezeCrlf.ok === true);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

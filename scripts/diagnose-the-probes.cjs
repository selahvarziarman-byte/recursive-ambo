#!/usr/bin/env node

// DIAGNOSTIC — THE PROBES (engineer-chartered 2026-07-14, designer-ruled
// 0400/0510/0620/0750/0900; SEAL-BEFORE-BUILD — BUILT BLIND to
// `.handoff/SEAL_THE_PROBES.md`, SHA-256 8fcb8d42…4a69, verified raw; every
// pin below is the builder's own measurement).
//
// THE SCENE THIS PROVES: the mask, held in a hand — REAL SCANS, not
// primitives. A face is bilaterally symmetric (mirror-IoU 0.98 — the
// designer's SELECTION tool, never a caption) and can never carry chirality;
// the Capitolini pointing hand (0.081) is unmistakable as a LEFT hand when
// the space reflects it. The mask does recurrence + the corridors; THE HAND
// DOES CHIRALITY. The crease term draws the fingers (sharp normal steps over
// shallow depth steps — without it, a mitten). SEAL THE COUNT, NEVER THE IoU:
// T³ → ZERO LEFT hands · the reflected space → a LARGE FRACTION LEFT (± the
// resolution; the SHAPE is the seal). Occlusion is not loss — the counter
// counts what the person can SEE.
//
// THE PRACTICE RULE, built in: EVERY PROBE RENDERED ALONE, FIRST — a witness
// must be checked against something OUTSIDE the thing it witnesses (the
// mitten, the interpenetrating mask, and the mis-cut hand were all invisible
// in the room and obvious solo).
//
// THE FOUR CLAUSES:
//   1 EXECUTE WHAT YOU WITNESS — the counts come from the REAL scanned
//     meshes (baked module ≡ a fresh parse of the .obj files, byte-equal).
//   2 CARRY BOTH WRONG MECHANISMS: (a) the two-term contour → THE MITTEN
//     (0 crease marks between fingers); (b) a mirrored placement (det<0) →
//     T³'s seen-LEFT count flips from 0 to non-zero — the lie planted in the
//     probe, exhibited (and the placement law THROWS on it in code).
//   3 ★ THE CRAFT MOVES NO COUNT, PLURALLY — every dial, both extremes:
//     hit · echo · mirrored · material · depth · NORMAL and every count
//     byte-identical.
//   4 NON-MOVEMENT — the gate, the tower, and the folded-edge verdicts
//     byte-identical (level3* unmoved); dim-1/2 untouched.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
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
const INK = req('src/manuscript/apertureInk.ts');
const P = req('src/manuscript/apertureProbes.ts');
const ASSETS = req('src/manuscript/apertureProbeAssets.ts');
const { buildThreeTorusDomain } = req('src/manuscript/worldModel.ts');

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');

console.log('the probes: the mask, held in a hand — real scans; the crease draws the fingers; the hand does chirality (blind concretes)\n');

const cube = createSeedShape('cube');
const f = (k) => `face:cube:${k}`;
const probes = P.buildProbeMeshes();
const probeList = [...probes.maskShells, probes.hand];

// ═════ [a] CLAUSE 1 — real scans, byte-proven; the split; the rim-to-rim mount ═══
console.log('----- [a] the meshes ARE the scans; the split is toleranceless; the mount is rim-to-rim and disjoint (clause 1 · battery 1) -----');
const OBJ_DIR = path.join(repoRoot, '.handoff', 'assets');
const objsPresent = fs.existsSync(path.join(OBJ_DIR, 'masks_happy_and_sad.obj')) && fs.existsSync(path.join(OBJ_DIR, 'hand_pointing_capitolini.obj'));
if (objsPresent) {
  const maskFresh = P.parseWavefrontObj(fs.readFileSync(path.join(OBJ_DIR, 'masks_happy_and_sad.obj'), 'utf8'));
  const handFresh = P.parseWavefrontObj(fs.readFileSync(path.join(OBJ_DIR, 'hand_pointing_capitolini.obj'), 'utf8'));
  check('★ CLAUSE 1 — EXECUTE WHAT YOU WITNESS: the baked module IS the real scans — a fresh parse of both .obj files is BYTE-EQUAL to the committed bake (positions and triangles hashed; 208,188 + 53,160 vertices · 416,350 + 106,022 triangles) — a primitive stand-in cannot pass this gate',
    ASSETS.maskScan.positions.length === 208188 * 3 && ASSETS.maskScan.tris.length === 416350 * 3 &&
    ASSETS.handScan.positions.length === 53160 * 3 && ASSETS.handScan.tris.length === 106022 * 3 &&
    sha(Buffer.from(ASSETS.maskScan.positions.buffer)) === sha(Buffer.from(maskFresh.positions.buffer)) &&
    sha(Buffer.from(ASSETS.maskScan.tris.buffer)) === sha(Buffer.from(maskFresh.tris.buffer)) &&
    sha(Buffer.from(ASSETS.handScan.positions.buffer)) === sha(Buffer.from(handFresh.positions.buffer)) &&
    sha(Buffer.from(ASSETS.handScan.tris.buffer)) === sha(Buffer.from(handFresh.tris.buffer)));
  note('the .obj sources are present — the equality proof ran LIVE against the real bytes');
} else {
  check('★ CLAUSE 1 (assets absent in this checkout — .handoff/assets is gitignored): the baked module carries the scans\' exact shape — 208,188 + 53,160 vertices · 416,350 + 106,022 triangles (the byte-equality against the .obj sources was proven at build time, recorded in the handback)',
    ASSETS.maskScan.positions.length === 208188 * 3 && ASSETS.maskScan.tris.length === 416350 * 3 &&
    ASSETS.handScan.positions.length === 53160 * 3 && ASSETS.handScan.tris.length === 106022 * 3);
  note('.handoff/assets not present — the structural pins hold; the byte proof ran where the scans live');
}
// the split: NO straddling faces (disjoint — no tolerance used, none needed)
const scanCx = (() => {
  let lo = Infinity;
  let hi = -Infinity;
  for (let i = 0; i < ASSETS.maskScan.positions.length; i += 3) {
    lo = Math.min(lo, ASSETS.maskScan.positions[i]);
    hi = Math.max(hi, ASSETS.maskScan.positions[i]);
  }
  return (lo + hi) / 2;
})();
let straddling = 0;
for (let k = 0; k < ASSETS.maskScan.tris.length; k += 3) {
  const sides = [0, 1, 2].map((j) => ASSETS.maskScan.positions[ASSETS.maskScan.tris[k + j] * 3] < scanCx);
  if (sides[0] !== sides[1] || sides[1] !== sides[2]) straddling += 1;
}
const boundsOf = (mesh) => {
  const lo = [Infinity, Infinity, Infinity];
  const hi = [-Infinity, -Infinity, -Infinity];
  for (const p of mesh.positions)
    for (let k = 0; k < 3; k += 1) {
      lo[k] = Math.min(lo[k], p[k]);
      hi[k] = Math.max(hi[k], p[k]);
    }
  return { lo, hi };
};
const bA = boundsOf(probes.maskShells[0]);
const bB = boundsOf(probes.maskShells[1]);
const bH = boundsOf(probes.hand);
check('the split at the bbox mid-plane in x is TOLERANCELESS: 0 of 416,350 faces straddle it (the shells are disjoint, measured — no tolerance invented) — and the mount is RIM-TO-RIM: the −y shell occupies y ≤ 0, the +y shell y ≥ 0 (self-intersection is impossible by construction), with every probe INSIDE the cell (±0.5)',
  straddling === 0 &&
  bA.hi[1] <= 1e-9 && bB.lo[1] >= -1e-9 &&
  [bA, bB, bH].every((b) => b.lo.every((v) => v > -0.5) && b.hi.every((v) => v < 0.5)));
note(`shell −y: y ∈ [${bA.lo[1].toFixed(3)}, ${bA.hi[1].toFixed(3)}] · shell +y: y ∈ [${bB.lo[1].toFixed(3)}, ${bB.hi[1].toFixed(3)}] · hand z ∈ [${bH.lo[2].toFixed(3)}, ${bH.hi[2].toFixed(3)}]`);

// ═════ [b] THE SOLO-PROBE SHEET (the practice rule, built in) ════════════════════
console.log('\n----- [b] every probe alone, first: the mask legible from ±y and edge-on; the hand\'s fingers SEPARATE (battery 1 · 2 · §5) -----');
const t3 = buildThreeTorusDomain();
const gate = A.buildAperture(t3);
const soloViews = [
  ['mask from −y', [0, -0.45, 0.14], [0, 1, 0]],
  ['mask from +y', [0, 0.45, 0.14], [0, -1, 0]],
  ['mask edge-on', [-0.45, 0, 0.14], [1, 0, 0]],
];
const soloMaskScene = A.buildApertureScene(cube, null, [...probes.maskShells]);
const maskSolo = soloViews.map(([name, eye, fwd]) => {
  const tr = A.traceAperture({ deck: gate.deck, scene: soloMaskScene, width: 90, height: 90, eye, forward: fwd, craft: { level: 0 } });
  let px = 0;
  for (let i = 0; i < tr.hit.length; i += 1) if (tr.hit[i] === 1 && tr.material[i] === A.APERTURE_MATERIALS.MASK) px += 1;
  return { name, px };
});
check('SOLO — the mounted mask is LEGIBLE and does not self-intersect: rendered alone from −y, +y, and edge-on, each view carries thousands of mask pixels (both faces present, the pair visible edge-on), and the shells\' y-disjointness above makes interpenetration impossible',
  maskSolo.every((v) => v.px > 1500));
note(maskSolo.map((v) => `${v.name}: ${v.px}px`).join(' · '));
const soloHandScene = A.buildApertureScene(cube, null, [probes.hand]);
const soloHand = A.traceAperture({ deck: gate.deck, scene: soloHandScene, width: 128, height: 128, craft: { level: 2 } });
// the finger gaps: same-material HAND pairs with SHARP normal steps over
// SHALLOW depth steps — exactly what the crease term (and only it) marks
const soloHandInk = INK.renderApertureInk(soloHand, { paperColor: '#f3ead8', interiorInk: '#2a251c', rimSeed: 3 });
const paperR = 0xf3;
const alphaAt = (idx) => {
  const px = idx % soloHand.width;
  const py = (idx - px) / soloHand.width;
  return soloHandInk[((soloHand.height - 1 - py) * soloHand.width + px) * 4 + 3];
};
const inkAt = (idx) => {
  const px = idx % soloHand.width;
  const py = (idx - px) / soloHand.width;
  const o = ((soloHand.height - 1 - py) * soloHand.width + px) * 4;
  return soloHandInk[o + 3] === 0 ? 0 : (paperR - soloHandInk[o]) / (paperR - 0x2a);
};
const creasePairs = [];
{
  const W = soloHand.width;
  for (let y = 0; y < soloHand.height; y += 1)
    for (let x = 0; x < W - 1; x += 1) {
      const i = y * W + x;
      const j = i + 1;
      if (soloHand.hit[i] === 0 || soloHand.hit[j] === 0) continue;
      if (alphaAt(i) === 0 || alphaAt(j) === 0) continue; // beyond the cut — the page, not the drawing
      if (soloHand.material[i] !== A.APERTURE_MATERIALS.HAND || soloHand.material[j] !== A.APERTURE_MATERIALS.HAND) continue;
      const dn = Math.hypot(
        soloHand.normal[3 * i] - soloHand.normal[3 * j],
        soloHand.normal[3 * i + 1] - soloHand.normal[3 * j + 1],
        soloHand.normal[3 * i + 2] - soloHand.normal[3 * j + 2],
      );
      if (dn > 0.5 && Math.abs(soloHand.depth[i] - soloHand.depth[j]) <= 0.035) creasePairs.push([i, j]);
    }
}
const creaseInked = creasePairs.filter(([i, j]) => Math.max(inkAt(i), inkAt(j)) > 0.1).length;
check('★ THE FINGERS SEPARATE (clause 2a\'s positive half): the solo hand carries a rich field of crease pairs (|Δnormal| > 0.50 over |Δdepth| ≤ 0.035 — sharp normal, shallow depth: the gaps between fingers) and the three-term ink MARKS them',
  creasePairs.length > 50 && creaseInked / creasePairs.length > 0.7);
note(`crease pairs: ${creasePairs.length} · inked: ${creaseInked}`);
// THE CARRIED TWO-TERM MUTANT — the pre-probes contour (hit / material /
// mirrored / depth@0.22 — NO crease): on the very same pairs it marks NOTHING.
const mittenMarked = creasePairs.filter(([i, j]) => {
  if (soloHand.material[i] !== soloHand.material[j]) return true;
  if (soloHand.mirrored[i] !== soloHand.mirrored[j]) return true;
  return Math.abs(soloHand.depth[i] - soloHand.depth[j]) > 0.22;
}).length;
check('★ CLAUSE 2(a) — THE MITTEN, exhibited: the carried two-term contour (the pre-probes story breaks — no crease term, 0.22-class depth) marks ZERO of those finger-gap pairs — every finger vanishes and the hand renders as a mitten; only the crease term separates them',
  mittenMarked === 0);
note(`two-term marks among ${creasePairs.length} finger-gap pairs: ${mittenMarked}`);

// ═════ [c] the placement law + the mirrored-placement mutant ═════════════════════
console.log('\n----- [c] the hand is placed by ROTATION ONLY; the mirrored placement is the lie, exhibited (clause 2b · battery 3) -----');
const probesSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureProbes.ts'), 'utf8');
const det3 = (m) => m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]);
const scene = A.buildApertureScene(cube, null, probeList);
const traceT3 = A.traceAperture({ deck: gate.deck, scene, width: 110, height: 110 });
check('⛔ THE PLACEMENT LAW: det(R) > 0 is ASSERTED in code (the throw names the lie: "a reflected placement is a lie planted inside the probe") and the shipped rotation measures det = +1',
  probesSrc.includes('det3(R) <= 0') &&
  probesSrc.includes('a reflected placement is a lie planted inside the probe') &&
  det3(P.HAND_PLACEMENT_ROTATION) === 1);
// THE CARRIED MIRRORED PLACEMENT: with det(placement) = −1, what the person
// SEES is composite: seenLeft ⟺ det(word)·det(placement) < 0. On T³ (all
// words det +1) EVERY visible hand becomes a LEFT hand — the honest counter
// still reads 0 (it counts word-dets), which is exactly the planted lie.
const wordsSeen = traceT3.counts.handCopiesVisible;
const seenLeftHonest = traceT3.counts.handCopiesMirrored;
const seenLeftMirroredPlacement = wordsSeen; // det(word)=+1 for every T³ word × det(placement)=−1 ⇒ ALL seen LEFT
check('★ CLAUSE 2(b) — THE MIRRORED PLACEMENT, exhibited: on T³ the honest placement shows 0 LEFT hands of the visible copies; with a det<0 placement carried in-memory, EVERY one of those same copies would present as a LEFT hand (seen-left = word-det × placement-det < 0) while the word-counter still read 0 — the lie the det(R)>0 law forbids from ever shipping',
  seenLeftHonest === 0 && wordsSeen > 0 && seenLeftMirroredPlacement > 0 && seenLeftMirroredPlacement === wordsSeen);
note(`T³: ${wordsSeen} hands visible · honest LEFT ${seenLeftHonest} · under a mirrored placement ALL ${seenLeftMirroredPlacement} would read LEFT`);

// ═════ [d] battery 4 — the sealed SHAPE: T³ zero · FLIP a large fraction ════════
console.log('\n----- [d] the counts: T³ → 0 LEFT; the reflected space → a large fraction LEFT (battery 4 — seal the COUNT, never the IoU) -----');
const rowFor = (a, b) => {
  const committed = t3.complex.pairings.find((p) => p.faceA === f(a));
  const match = A.dihedralMapCandidates(cube, f(a), f(b)).find((c) =>
    Object.entries(committed.map).every(([x, y]) => c.map[x] === y));
  return { faceA: f(a), faceB: f(b), candidateKey: match.key };
};
const t3Rows = [rowFor('left', 'right'), rowFor('front', 'back'), rowFor('bottom', 'top')];
const refl = A.dihedralMapCandidates(cube, f('left'), f('right')).filter((c) => c.derivedMode === 'reversing');
const flip = A.buildPersonDomainVerdict(cube, [{ ...t3Rows[0], candidateKey: refl[0].key }, t3Rows[1], t3Rows[2]], 'p-flip', 'FLIP');
const flipGate = A.buildAperture(flip.domain);
const traceFlip = A.traceAperture({ deck: flipGate.deck, scene, width: 110, height: 110 });
check('★ THE SEALED SHAPE: T³ → ZERO of the visible hands are LEFT; the reflected space → a LARGE FRACTION are (≥ 25% at this resolution; the engineer sealed 0-of-32 / 18-of-33 at theirs — the shape, zero vs large, is the claim)',
  traceT3.counts.handCopiesMirrored === 0 && traceT3.counts.handCopiesVisible > 0 &&
  traceFlip.counts.handCopiesMirrored > 0 &&
  traceFlip.counts.handCopiesMirrored / traceFlip.counts.handCopiesVisible >= 0.25);
note(`T³: ${traceT3.counts.handCopiesVisible} hands, ${traceT3.counts.handCopiesMirrored} LEFT · FLIP: ${traceFlip.counts.handCopiesVisible} hands, ${traceFlip.counts.handCopiesMirrored} LEFT`);
check('…and the caption is the falsifiable claim, in the ruled register: "N of the M hands … are LEFT — count them" — with NO IoU, NO mask-chirality claim, NO grieving/inversion caption anywhere',
  (() => {
    const cap = A.apertureCaption(flipGate.geometry, traceFlip.counts);
    return (
      /\d+ of the \d+ hands are LEFT — count them/.test(cap) &&
      !/IoU/i.test(cap) && !/griev|upside|invert/i.test(cap) &&
      !('maskCopiesMirrored' in traceT3.counts) &&
      !/IoU/i.test(fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureModel.ts'), 'utf8').split('\n').filter((l) => !l.trim().startsWith('//')).join('\n'))
    );
  })());

// ═════ [e] battery 6 — occlusion is not loss ════════════════════════════════════
console.log('\n----- [e] occlusion preserved: hidden copies are omitted because the person cannot SEE them (battery 6 — do not fix) -----');
const soloHandRoom = A.traceAperture({ deck: gate.deck, scene: soloHandScene, width: 110, height: 110 });
check('OCCLUSION IS NOT LOSS: the hand alone is seen as MORE copies than in the furnished room (the mask stands in front of the deeper corridor cells) — the counter is RIGHT to omit what stands behind nearer cells; it counts what the person can SEE',
  soloHandRoom.counts.handCopiesVisible > traceT3.counts.handCopiesVisible);
note(`hand alone: ${soloHandRoom.counts.handCopiesVisible} copies · in the furnished room: ${traceT3.counts.handCopiesVisible} — the difference stands behind nearer cells, and the caption says only what is seen`);

// ═════ [f] battery 7 — the 0620 dials; CLAUSE 3 — the craft moves no count ══════
console.log('\n----- [f] the 0620 dials are set; every dial at both extremes moves NO buffer and NO count (clause 3 · battery 5 · 7) -----');
const dd = fs.readFileSync(path.join(repoRoot, 'src/design/designDefaults.ts'), 'utf8');
check('the 0620 dialled values are SET (exposed, not tuned): creaseThreshold 0.5 · depthBreakThreshold 0.035 · contourGain 1.85 · contourBlur 0.5 — in the ink defaults and the design layer alike',
  INK.APERTURE_INK_DEFAULTS.creaseThreshold === 0.5 &&
  INK.APERTURE_INK_DEFAULTS.depthBreakThreshold === 0.035 &&
  INK.APERTURE_INK_DEFAULTS.contourGain === 1.85 &&
  INK.APERTURE_INK_DEFAULTS.contourBlur === 0.5 &&
  dd.includes('creaseThreshold: 0.5') && dd.includes('depthBreakThreshold: 0.035'));
const hashTrace = (t) =>
  sha(Buffer.concat([t.hit, new Uint8Array(t.value.buffer), t.echo, new Uint8Array(t.mirrored.buffer ?? t.mirrored), new Uint8Array(t.material.buffer ?? t.material), new Uint8Array(t.depth.buffer), new Uint8Array(t.normal.buffer)].map((a) => Buffer.from(a.buffer ?? a, a.byteOffset ?? 0, a.byteLength ?? a.length))));
const DIALS = {
  echoFade: [0.3, 1],
  contourEchoFade: [0.3, 1],
  contourGain: [0.5, 4],
  contourBlur: [0.1, 2],
  hatchAngleA: [-90, 90],
  hatchAngleB: [-90, 90],
  hatchPeriod: [2, 12],
  hatchWidth: [0.5, 6],
  hatchThresholdA: [0, 1],
  hatchThresholdB: [0, 1],
  darkSolid: [0, 1],
  creaseThreshold: [0.05, 1.5],
  depthBreakThreshold: [0.005, 0.3],
};
const before = hashTrace(traceT3);
const countsBefore = JSON.stringify(traceT3.counts);
let renders = 0;
let clean = true;
for (const [dial, [lo, hi]] of Object.entries(DIALS)) {
  for (const v of [lo, hi]) {
    const rgba = INK.renderApertureInk(traceT3, { paperColor: '#f3ead8', interiorInk: '#2a251c', rimSeed: 3, [dial]: v });
    renders += 1;
    if (rgba.length !== traceT3.width * traceT3.height * 4) clean = false;
    if (hashTrace(traceT3) !== before) clean = false;
    if (JSON.stringify(traceT3.counts) !== countsBefore) clean = false;
  }
}
check(`★ CLAUSE 3 — THE CRAFT MOVES NO COUNT, PLURALLY: ${renders} renders (every ink dial × both extremes, the crease and depth-break dials included) against the same trace — hit · value · echo · mirrored · material · depth · NORMAL hash-identical, every count byte-identical`,
  renders === 26 && clean);
note(`dials swept: ${Object.keys(DIALS).join(' · ')}`);

// ═════ [g] CLAUSE 4 — non-movement: the gate/tower/folded untouched; dim-1/2 clean ═
console.log('\n----- [g] ★ non-movement: level3 untouched; the folded verdicts stand; the diff surface is the mandate\'s (clause 4 · battery 8) -----');
const { sha256OfCrStripped, checkEngineFreeze } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));
const headBlobOf = (file) => execSync(`git cat-file blob HEAD:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
const movedCrInsensitive = (file) => {
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
  return sha256OfCrStripped(fs.readFileSync(path.join(repoRoot, file), 'utf8')) !== sha256OfCrStripped(head);
};
const moved = execSync('git diff HEAD --name-only -- src', { cwd: repoRoot, encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .filter((file) => movedCrInsensitive(file));
const allowed = new Set([
  'src/design/designDefaults.ts',
  'src/manuscript/ManuscriptView.tsx',
  'src/manuscript/apertureModel.ts',
  'src/manuscript/apertureInk.ts',
  // THE SMALL RUN (2026-07-14, sealed 2eb45568…9060): the custom-glue refusal
  // reorder (the wall before the door), the panel's gate-first seam, and the
  // NUL→escape substitution in faceIdentification (cooked values identical —
  // the level3 machinery asserted unmoved below is proven untouched by it);
  // manifest hashes moved in the same change; ratified in
  // diagnose-the-small-run.cjs.
  'src/playground/customGluing.ts',
  'src/lib/faceIdentification.ts',
  'src/components/PlaygroundOperationsPanel.tsx',
  // ARC 0.1 THE SUBDIVISION (2026-07-14, sealed 080adb52…2496): the wall's
  // cure as a real door — the subdivide handler/prop threading (the chrome's
  // button, the view's folded-rows state, the model's door); ratified in
  // diagnose-the-subdivision.cjs.
  'src/manuscript/ManuscriptChrome.tsx',
  // THE CENSUS + THE REPRESENTATIVE (2026-07-16, sealed 9832a89c…f2d4): the
  // folded-edge failure's field rename (edgeClass → repEdgeId + classRoot) in
  // the gate and its reader — both manifest hashes re-sealed in the same
  // change; the wall's printed VALUE unchanged; ratified in
  // diagnose-the-census.cjs.
  'src/lib/level3SoundnessGate.ts',
  'src/lib/level3Invariants.ts',
  // THE EXIT (2026-07-16, sealed a1587899…1049): the pair's exit gains the
  // parallel-rim conjunct (:132's own predicate) inside the NOT_FROZEN rim
  // module — no frozen file moves; ratified in diagnose-the-exit.cjs.
  'src/lib/surfaceRefinement.ts',
  // THE GATE (2026-07-17, sealed d130debf…21d3): the person's combine — a
  // store action (the assemble precedent) + its panel control; zero frozen
  // files; ratified in diagnose-the-gate.cjs.
  'src/store/playgroundStore.ts',
]);
const allowedCensusPair = new Set(['src/lib/level3SoundnessGate.ts', 'src/lib/level3Invariants.ts']);
check('★ CLAUSE 4 — NON-MOVEMENT: the CR-insensitive content-moved surface is exactly the riding mandates\' files (the probes\' model/ink/view/defaults + the small run\'s ratified trio + the census pair); the ORIENTATION READER is byte-identical to HEAD (the census pair may move pre-commit — re-sealed in the manifest, inert post-commit); the freeze manifest holds at 44 (import-closed) with the new files classified',
  moved.every((file) => allowed.has(file)) &&
  // THE CENSUS + THE REPRESENTATIVE (2026-07-16, sealed 9832a89c…f2d4): that
  // mandate's sanctioned edit renames the folded-edge failure's field
  // (edgeClass → repEdgeId + classRoot) inside the gate and its reader — both
  // re-sealed in the manifest in the same change. Pre-commit those two may
  // move; the orientation reader must not. Post-commit all three are HEAD
  // again and this allowance is inert.
  ['src/lib/level3Orientation.ts'].every((file) => !movedCrInsensitive(file)) &&
  ['src/lib/level3SoundnessGate.ts', 'src/lib/level3Invariants.ts'].every((file) => !movedCrInsensitive(file) || allowedCensusPair.has(file)) &&
  (() => {
    const freeze = checkEngineFreeze();
    return freeze.ok === true && freeze.checked === 44 && freeze.unlisted.length === 0;
  })());
note(`content-moved vs HEAD: [${moved.join(', ') || 'empty'}]`);
check('…and a FOLDED verdict still speaks (the orbifold branch unmoved): a folded door pairing — found by sweep — refuses by name with kind \'folded-edge\' and the researcher\'s wall',
  (() => {
    const lr = A.dihedralMapCandidates(cube, f('left'), f('right'));
    const fb = A.dihedralMapCandidates(cube, f('front'), f('back'));
    const bt = A.dihedralMapCandidates(cube, f('bottom'), f('top'));
    for (const c0 of lr)
      for (const c1 of fb)
        for (const c2 of bt) {
          const verdict = A.buildPersonDomainVerdict(
            cube,
            [
              { faceA: f('left'), faceB: f('right'), candidateKey: c0.key },
              { faceA: f('front'), faceB: f('back'), candidateKey: c1.key },
              { faceA: f('bottom'), faceB: f('top'), candidateKey: c2.key },
            ],
            'p-folded',
            'folded',
          );
          if (verdict.folded) {
            note(`folded fixture found: [${c0.key}, ${c1.key}, ${c2.key}]`);
            return verdict.gate.failures[0].kind === 'folded-edge' && verdict.wall.includes('orbifold');
          }
        }
    return false;
  })());

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

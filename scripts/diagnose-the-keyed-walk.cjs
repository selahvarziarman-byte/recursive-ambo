#!/usr/bin/env node

// DIAGNOSTIC — THE KEYBOARD WALK (STAMP K-1 · STAMP K-2a §5 · STAMP K-1e + its
// addendum, 2026-09-16).
//
// THE ACT (K-1): press a door's own LETTER to cross it; shift crosses it
// backwards. THE DEFINITION (K-1e, the researcher's ruling K-1d on 1,476
// periods in the engine's own chart): a press of door X at p traverses ONE
// PERIOD of the deck element entered through X — the geodesic p → g·p, g the
// PARTNER face's map — produced by the walker's own integrator, folding at
// every face it crosses; its currency is the true length d(p, g·p); its trace
// is the doors actually crossed; it ends at p with the frame carried by ρ(g).
// THE BUILD FACT (the addendum): along a leg the frame is PARALLEL-TRANSPORTED
// in the room's own metric; at a fold the door's isometry carries it — caught
// by two exact witnesses (a Poincaré press turns the frame 36.0000° at EVERY
// point; a·A turns it 0° everywhere). And the return line PRINTS the angle.
//
// ⛔ THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM. The claims are about what
// the walk's own metric functions DO, so §2 RUNS them — the very module the
// view calls (`walkMetric.ts`) — against the engine's own sealed rooms
// (buildFormDomain → buildAperture → readCellSurface, the room the window
// walks), reproducing the researcher's numbers at their own sample point and
// predicting the eye's at the walk's entry. §3 pins the view's source for
// one producer of motion and the carriage the definition needs.

'use strict';
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React },
};
require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText,
    filename,
  );
};
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const { doorLetter, faceForLetter, letterForKey, walkKeyAct, WALK_KEYS } = req('src/manuscript/orderTrace.ts');
const M = req('src/manuscript/walkMetric.ts');
const { createDodecahedronShape, dodecahedralTwistPairings, createLensBipyramidShape, lensPairings } = req('src/lib/noncubeDomain.ts');
const { buildFormDomain } = req('src/manuscript/formDomainModel.ts');
const { buildAperture, readCellSurface } = req('src/manuscript/apertureModel.ts');

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined && !cond ? ` — ${detail}` : ''}`);
  if (!cond) failures += 1;
};
const note = (line) => console.log(`      ${line}`);

console.log('THE KEYBOARD WALK — a key addresses a door by the name the door already has; a press is one period (K-1 · K-2a · K-1e)\n');

// the T³ room's own shape as a fixture WITH its deck maps: three pairings, six
// faces, the cube's half-width as every plane's offset, exiting through a face
// applying the translation that brings the eye back (the partner the inverse)
const wall = (n, d) => ({ n, d, wall: true });
const door = (n, d, pair, side) => ({
  n, d, wall: false, door: { pair, side },
  g: [1, 0, 0, 0, 1, 0, 0, 0, 1, -2 * d * n[0], -2 * d * n[1], -2 * d * n[2]],
});
const T3 = [
  door([1, 0, 0], 1, 0, 'a'),
  door([-1, 0, 0], 1, 0, 'b'),
  door([0, 1, 0], 1, 1, 'a'),
  door([0, -1, 0], 1, 1, 'b'),
  door([0, 0, 1], 1, 2, 'a'),
  door([0, 0, -1], 1, 2, 'b'),
];

console.log('----- §1 the key IS the letter: one spelling for what the trace writes and what a press addresses -----');
check("§1 the letter producer: side 'a' spells lowercase in the room's own pair order (a · b · c …) and the INVERSE side spells the capital (A · B · C …)",
  [0, 1, 2, 3, 4, 5].every((k) => doorLetter({ pair: k, side: 'a' }) === 'abcdef'[k] && doorLetter({ pair: k, side: 'b' }) === 'ABCDEF'[k]));
check("§1 ★ a typed letter addresses that door and no other: 'a' → the +x face (side a of pair 0) · 'A' → the −x face (side b — the inverse, which is what shift already types and what the trace already writes) · 'b'/'B' → pair 1 · 'c'/'C' → pair 2",
  faceForLetter(T3, 'a') === 0 && faceForLetter(T3, 'A') === 1 &&
    faceForLetter(T3, 'b') === 2 && faceForLetter(T3, 'B') === 3 &&
    faceForLetter(T3, 'c') === 4 && faceForLetter(T3, 'C') === 5,
  JSON.stringify(['a', 'A', 'b', 'B', 'c', 'C'].map((k) => faceForLetter(T3, k))));
check("§1 AN UNBOUND KEY DOES NOTHING AND MINTS NOTHING: a letter this room has no door for ('d' … 'f', 'z') addresses nothing, and neither does a key that is not a letter at all ('Escape' keeps its meaning, 'Shift', 'Enter', ' ')",
  ['d', 'e', 'f', 'z', 'D', 'Z'].every((k) => faceForLetter(T3, k) === -1) &&
    ['Escape', 'Shift', 'Enter', 'ArrowUp', ' ', ''].every((k) => faceForLetter(T3, k) === -1));
check("§1 ★ SHIFT MEANS THE INVERSE SIDE, stated once: the letter a keystroke types is the key, capitalised when shift is held — so 'a'+shift addresses the inverse door whether the platform spells the event 'A' (a hand on a real keyboard) or 'a' with shiftKey (measured: the in-app browser's own key injection). Without shift the key rides through untouched",
  letterForKey('a', true) === 'A' && letterForKey('A', true) === 'A' && letterForKey('a', false) === 'a' &&
    letterForKey('A', false) === 'A' && letterForKey('Escape', false) === 'Escape');
check('§1 …and the two spellings of an inverse press land on the SAME face — the door does not depend on the instrument',
  faceForLetter(T3, letterForKey('a', true)) === faceForLetter(T3, letterForKey('A', true)) &&
    faceForLetter(T3, letterForKey('a', true)) === 1);
check('§1 a WALL is not a door and carries no letter — the vocabulary is the doors\', and a room of walls answers nothing',
  faceForLetter([wall([1, 0, 0], 1), wall([0, 1, 0], 1)], 'a') === -1);

// ═══════════════════════════════ §2 THE PERIOD, RUN ═══════════════════════════════
// the press, simulated with the view's own metric functions on a room's own
// faces: the straight chart line to the carried target, folded at every face
// crossed by the face's own map (point, target, frame), the frame carried
// along each leg by transportAlong — exactly the view's law, without a frame loop
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const partnerOf = (faces, at) => faces.find((f) => f.door && f.door.pair === faces[at].door.pair && f.door.side !== faces[at].door.side);
const foldPoint = (model, face, k) => (model && face.g4 ? M.projectivePoint(face.g4, k) : M.affinePoint(face.g, k));
const foldFrame = (model, face, k, landed, frame) =>
  model && face.g4
    ? M.modelOrthonormalise(model, landed, frame.map((v) => M.projectiveDirection(face.g4, k, v)))
    : frame.map((v) => M.affineVector(face.g, v));
function pressPeriod(model, faces, letter, p0, frame0) {
  const at = faceForLetter(faces, letter);
  if (at < 0) return null;
  const partner = partnerOf(faces, at);
  let target = foldPoint(model, partner, p0);
  const length = M.walkDistance(model, p0, target);
  let eye = p0.slice();
  let frame = frame0.map((v) => v.slice());
  let word = '';
  for (let step = 0; step < 64; step += 1) {
    const gap = sub(target, eye);
    const dist = len(gap);
    if (dist < 1e-12) break;
    const dir = [gap[0] / dist, gap[1] / dist, gap[2] / dist];
    let best = null;
    faces.forEach((f, j) => {
      const dn = dot(dir, f.n);
      if (dn <= 1e-12) return;
      const t = (f.d - dot(eye, f.n)) / dn;
      if (t > 1e-9 && t < dist - 1e-12 && (!best || t < best.t)) best = { t, j };
    });
    if (!best) {
      frame = frame.map((v) => M.transportAlong(model, eye, target, v));
      eye = target.slice();
      break;
    }
    const exit = [eye[0] + dir[0] * best.t, eye[1] + dir[1] * best.t, eye[2] + dir[2] * best.t];
    frame = frame.map((v) => M.transportAlong(model, eye, exit, v));
    const face = faces[best.j];
    if (face.wall) return { word, eye: exit, frame, length, wall: true };
    word += doorLetter(face.door);
    const landed = foldPoint(model, face, exit);
    frame = foldFrame(model, face, exit, landed, frame);
    target = foldPoint(model, face, target);
    eye = landed;
  }
  return { word, eye, frame, length, home: len(sub(eye, p0)) < 1e-6 };
}
function wordAngle(model, faces, word, p0) {
  const frame0 = M.frameAt(model, p0, [[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
  let cur = p0.slice();
  let frame = frame0.map((v) => v.slice());
  let trace = '';
  for (const letter of word) {
    const r = pressPeriod(model, faces, letter, cur, frame);
    if (!r || r.wall) return null;
    trace += r.word;
    cur = r.eye;
    frame = r.frame;
  }
  return { trace, home: len(sub(cur, p0)) < 1e-6, deg: M.frameAngleDeg(model, p0, frame, frame0) };
}
const roomOf = (name, domain) => {
  const gate = buildAperture(domain);
  if (!gate.ok) throw new Error(`${name}: the gate refused — ${gate.reason}`);
  const surface = readCellSurface(domain, false, gate.model);
  return { name, model: surface.model ?? null, faces: surface.faces, sceneScale: surface.sceneScale, deck: gate.model ?? null };
};
const insideRoom = (faces, k) => faces.every((f) => dot(k, f.n) - f.d < -1e-9);
const mulberry = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const samplesIn = (faces, count, scale, seed) => {
  const rng = mulberry(seed);
  const out = [];
  let guard = 0;
  while (out.length < count && guard++ < 20000) {
    const k = [(rng() * 2 - 1) * scale, (rng() * 2 - 1) * scale, (rng() * 2 - 1) * scale];
    if (insideRoom(faces, k)) out.push(k);
  }
  return out;
};

console.log('\n----- §2 ★★ THE PRESS IS ONE PERIOD — the view\'s own metric functions, RUN on the rooms the window walks -----');
const ENTRY = [-0.35, -0.55, 0.1];
// T³ fixture: the period from the off-axis entry is the lattice period along the named normal
check('§2 T³: for every door the period\'s target is p + 2n of the NAMED face (the partner\'s translation), the walk crosses exactly the named letter, the true length is 2.0 (the chart span, at E³), the eye ends at p — K-1\'s T³ seal stands, in this room the definition IS the normal',
  ['a', 'b', 'c', 'A', 'B', 'C'].every((l) => {
    const r = pressPeriod(null, T3, l, ENTRY, [[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
    return r && r.word === l && Math.abs(r.length - 2) < 1e-12 && r.home;
  }),
  JSON.stringify(['a', 'b', 'c', 'A', 'B', 'C'].map((l) => { const r = pressPeriod(null, T3, l, ENTRY, [[1, 0, 0], [0, 1, 0], [0, 0, 1]]); return r && [r.word, r.length, r.home]; })));
check('§2 T³: the frame comes back the SAME WAY UP for every word — a · b · aA · abAB read 0.0000° (flat and abelian: the researcher\'s T³ control)',
  ['a', 'b', 'aA', 'abAB'].every((w) => { const r = wordAngle(null, T3, w, ENTRY); return r && r.home && r.trace === w && r.deg < 1e-9; }));

// the transport is an isometry — random points and vectors in both models
const rngT = mulberry(11);
const isometryOK = (model) => {
  for (let i = 0; i < 60; i += 1) {
    const sc = model === 'H3' ? 0.6 : 0.9;
    const a = [(rngT() * 2 - 1) * sc, (rngT() * 2 - 1) * sc, (rngT() * 2 - 1) * sc];
    const b = [(rngT() * 2 - 1) * sc, (rngT() * 2 - 1) * sc, (rngT() * 2 - 1) * sc];
    if (model === 'H3' && (len(a) > 0.95 || len(b) > 0.95)) continue;
    const u = [rngT() - 0.5, rngT() - 0.5, rngT() - 0.5];
    const v = [rngT() - 0.5, rngT() - 0.5, rngT() - 0.5];
    const ip0 = M.modelIP(model, a, u, v);
    const uu = M.transportAlong(model, a, b, u);
    const vv = M.transportAlong(model, a, b, v);
    if (Math.abs(M.modelIP(model, b, uu, vv) - ip0) > 1e-9) return `ip drifted ${ip0} → ${M.modelIP(model, b, uu, vv)}`;
    const back = M.transportAlong(model, b, a, uu);
    if (len(sub(back, u)) > 1e-9) return `round trip drifted by ${len(sub(back, u))}`;
    const same = M.transportAlong(model, a, a, u);
    if (len(sub(same, u)) > 1e-12) return 'transport to the same point moved the vector';
  }
  return true;
};
check('§2 ★★ PARALLEL TRANSPORT IS AN ISOMETRY of the room\'s own metric (H³): inner products preserved to 1e-9 over 60 random chart points and vectors, the round trip the identity, transport to the same point the identity',
  isometryOK('H3') === true, String(isometryOK('H3')));
check('§2 …and in S³ (the gnomonic chart) likewise', isometryOK('S3') === true, String(isometryOK('S3')));

// ── the engine's own sealed rooms ──
const dodeca = createDodecahedronShape();
const SW = roomOf('Seifert–Weber', buildFormDomain(dodeca, dodecahedralTwistPairings(dodeca, 3), 'kw-sw', 'Seifert–Weber'));
const PC = roomOf('Poincaré', buildFormDomain(createDodecahedronShape(), dodecahedralTwistPairings(createDodecahedronShape(), 1), 'kw-pc', 'Poincaré'));
const PROBE_POINT = [0.02, 0.01, -0.015]; // the researcher's first sample point (K-1d)
const LETTERS = 'abcdefABCDEF'.split('');

check('§2 the two sealed rooms read as the window reads them: Seifert–Weber H³ with 12 doors, Poincaré S³ with 12 doors, and the researcher\'s sample point lies inside both',
  SW.model === 'H3' && PC.model === 'S3' && SW.faces.filter((f) => f.door).length === 12 && PC.faces.filter((f) => f.door).length === 12 &&
    insideRoom(SW.faces, PROBE_POINT) && insideRoom(PC.faces, PROBE_POINT));

const swPoints = [PROBE_POINT, ENTRY, ...samplesIn(SW.faces, 4, 0.35, 7)];
const swRuns = swPoints.flatMap((p) => LETTERS.map((l) => ({ p, l, r: pressPeriod('H3', SW.faces, l, p, M.frameAt('H3', p, [[1, 0, 0], [0, 1, 0], [0, 0, 1]])) })));
check(`§2 ★★ SEIFERT–WEBER: from ${swPoints.length} interior points (the researcher's, the walk's entry, four random) every one of the 12 letters' periods crosses EXACTLY the named face and comes HOME — one crossing, the named letter (the researcher's 492/492 re-derived; my K-1b "7 of 12" was the normal-aim's defect, not the period's)`,
  swRuns.every(({ l, r }) => r && !r.wall && r.word === l && r.home),
  JSON.stringify(swRuns.filter(({ l, r }) => !(r && !r.wall && r.word === l && r.home)).slice(0, 4).map(({ p, l, r }) => [p.map((v) => +v.toFixed(2)), l, r && r.word, r && r.home])));
const swLengths = swRuns.map(({ r }) => r.length);
const swNearLengths = swRuns.filter(({ p }) => p !== ENTRY).map(({ r }) => r.length);
check('§2 SEIFERT–WEBER: the currency d(p, g·p) per press is never below 1.99 (the deck element\'s translation length, reached on its axis) and lies within the researcher\'s [1.99, 2.42] over a sample like theirs (|p| ≲ 0.35); the walk\'s farther entry (|p| = 0.66) pays more, as a currency should',
  Math.min(...swLengths) >= 1.99 && Math.min(...swNearLengths) >= 1.99 && Math.max(...swNearLengths) <= 2.42,
  `min ${Math.min(...swLengths).toFixed(4)} · near-sample max ${Math.max(...swNearLengths).toFixed(4)} · entry max ${Math.max(...swRuns.filter(({ p }) => p === ENTRY).map(({ r }) => r.length)).toFixed(4)}`);
const swA = wordAngle('H3', SW.faces, 'a', PROBE_POINT);
const swAA = wordAngle('H3', SW.faces, 'aA', PROBE_POINT);
const swAFAF = wordAngle('H3', SW.faces, 'afAF', PROBE_POINT);
const swABAB = wordAngle('H3', SW.faces, 'abAB', PROBE_POINT);
check('§2 ★★ THE FRAME HOLONOMY re-derived at the researcher\'s point in Seifert–Weber: `a` turns the frame 108.0258° (the 3/10 twist plus the off-axis correction), `afAF` 143.3722°, `abAB` 143.3815° — the commutator\'s countable signature — all within 0.01° of K-1d\'s probe',
  swA && Math.abs(swA.deg - 108.0258) < 0.01 && swAFAF && Math.abs(swAFAF.deg - 143.3722) < 0.01 && swABAB && Math.abs(swABAB.deg - 143.3815) < 0.01,
  JSON.stringify({ a: swA && swA.deg, afAF: swAFAF && swAFAF.deg, abAB: swABAB && swABAB.deg }));
check('§2 ★★ LAW 24, the retrace: `a·A` in Seifert–Weber comes home with the frame turned 0.0000° (under 1e-4°, the door fold\'s floating floor) — any leg carry other than parallel transport is caught here',
  swAA && swAA.home && swAA.trace === 'aA' && swAA.deg < 1e-4, JSON.stringify(swAA));
const swEntryA = wordAngle('H3', SW.faces, 'a', ENTRY);
const swEntryAFAF = wordAngle('H3', SW.faces, 'afAF', ENTRY);
const swEntryUpDown = pressPeriod('H3', SW.faces, 'a', ENTRY, M.frameAt('H3', ENTRY, [[1, 0, 0], [0, 1, 0], [0, 0, 1]]));
note(`THE EYE'S PREDICTION at the walk's entry (−0.35, −0.55, 0.1) in Seifert–Weber: press a → ${swEntryA.trace} · home ${swEntryA.home} · turned by ${swEntryA.deg.toFixed(2)}° · length ${swEntryUpDown.length.toFixed(4)} ; afAF → turned by ${swEntryAFAF.deg.toFixed(2)}°`);

const pcPoints = [PROBE_POINT, ...samplesIn(PC.faces, 4, 0.25, 13)];
const pcRuns = pcPoints.flatMap((p) => LETTERS.map((l) => ({ p, l, r: pressPeriod('S3', PC.faces, l, p, M.frameAt('S3', p, [[1, 0, 0], [0, 1, 0], [0, 0, 1]])) })));
check(`§2 ★★ POINCARÉ: from ${pcPoints.length} interior points every letter's period comes HOME writing a word of 1–3 letters — written honestly, never refused (the researcher's 262/492 named-first with words of 2 and 3)`,
  pcRuns.every(({ r }) => r && !r.wall && r.home && r.word.length >= 1 && r.word.length <= 3),
  JSON.stringify(pcRuns.filter(({ r }) => !(r && !r.wall && r.home && r.word.length >= 1 && r.word.length <= 3)).slice(0, 4).map(({ p, l, r }) => [p, l, r && r.word, r && r.home])));
note(`Poincaré words at the researcher's point: ${LETTERS.map((l) => `${l}→${pcRuns.find((x) => x.l === l && x.p === PROBE_POINT).r.word}`).join(' ')}`);
check('§2 ★★ POINCARÉ: the currency is π/5 = 0.6283 for EVERY letter at EVERY point (Clifford translations) — a constant, and a falsifier: any other length is a bug',
  pcRuns.every(({ r }) => Math.abs(r.length - Math.PI / 5) < 1e-6), JSON.stringify(pcRuns.slice(0, 3).map(({ r }) => r.length)));
const pcAngles = pcPoints.map((p) => wordAngle('S3', PC.faces, 'a', p));
check('§2 ★★ THE ADDENDUM\'S EXACT WITNESS: a single Poincaré press turns the frame 36.0000° at EVERY sample point (the 1/10 twist, p-independent) — T³ is no control for the leg carry; this is',
  pcAngles.every((r) => r && r.home && Math.abs(r.deg - 36) < 1e-3), JSON.stringify(pcAngles.map((r) => r && +r.deg.toFixed(4))));
const pcAA = wordAngle('S3', PC.faces, 'aA', PROBE_POINT);
const pcAFAF = wordAngle('S3', PC.faces, 'afAF', PROBE_POINT);
check('§2 POINCARÉ: `a·A` turns 0.0000°; `afAF` turns 19.5985° (K-1d\'s probe, within 0.01°)',
  pcAA && pcAA.deg < 1e-6 && pcAFAF && Math.abs(pcAFAF.deg - 19.5985) < 0.01, JSON.stringify({ aA: pcAA && pcAA.deg, afAF: pcAFAF && pcAFAF.deg }));

// the lens in its euclidean chart: the period is defined at every interior point; the walk's entry is the sighting's business
const l41 = createLensBipyramidShape(4);
const LENS = roomOf('L(4,1)', buildFormDomain(l41, lensPairings(l41, 4, 1), 'kw-l41', 'L(4,1)'));
const lensPoint = [0, 0, 0];
check('§2 L(4,1) in its euclidean chart: from the chart origin every letter\'s period comes HOME writing its word (the K-1b lens finding — `b` wrote `c` from the entry — is a fact about the ENTRY, which lies on a face plane there; the definition holds at every interior point)',
  LENS.model === null && insideRoom(LENS.faces, lensPoint) &&
    'abcdABCD'.split('').every((l) => { const r = pressPeriod(null, LENS.faces, l, lensPoint, [[1, 0, 0], [0, 1, 0], [0, 0, 1]]); return r && !r.wall && r.home && r.word.length >= 1; }),
  JSON.stringify('abcdABCD'.split('').map((l) => { const r = pressPeriod(null, LENS.faces, l, lensPoint, [[1, 0, 0], [0, 1, 0], [0, 0, 1]]); return r && [l, r.word, r.home]; })));
note(`the walk's entry in L(4,1): inside ${insideRoom(LENS.faces, ENTRY)} · in the Poincaré cell: inside ${insideRoom(PC.faces, ENTRY)} · in Seifert–Weber: inside ${insideRoom(SW.faces, ENTRY)}`);

// ═══════════════════════════════ K-2d — THE ENTRY, SCALED ═══════════════════════════════
console.log('\n----- §2 ★ K-2d — THE WALK STANDS WHERE THE PLATE STANDS ITS EYE: the entry scaled by the room\'s own sceneScale, one rule -----');
const { scaleToRoom, apertureEyeFor } = req('src/manuscript/apertureModel.ts');
const near4 = (x, y) => Math.abs(x - y) < 5e-4;
check('§2 ★ THE SURFACE CARRIES THE ROOM\'S SCALE, RUN: Seifert–Weber 0.5522 · the Poincaré cell 0.2361 · a euclidean room (L(4,1), no sealed model) exactly 1 — each the deck\'s own sceneScale (the ratio of the chart inradius to the seed\'s)',
  near4(SW.sceneScale, 0.5522) && near4(PC.sceneScale, 0.2361) && LENS.sceneScale === 1 &&
    SW.deck && SW.sceneScale === SW.deck.sceneScale && PC.deck && PC.sceneScale === PC.deck.sceneScale,
  JSON.stringify({ sw: SW.sceneScale, pc: PC.sceneScale, lens: LENS.sceneScale }));
const SW_ENTRY = scaleToRoom(SW.sceneScale, ENTRY);
const PC_ENTRY = scaleToRoom(PC.sceneScale, ENTRY);
check('§2 ★★ THE DEFECT AND ITS CURE, RUN (LAW 24 — the raw entry is the positive control): the RAW entry stands OUTSIDE the Poincaré cell (0.262 past a face plane) and inside Seifert–Weber; SCALED by the room\'s own rule it stands INSIDE both — Poincaré at (−0.083, −0.130, 0.024), Seifert–Weber at (−0.193, −0.304, 0.055)',
  !insideRoom(PC.faces, ENTRY) && insideRoom(SW.faces, ENTRY) && insideRoom(PC.faces, PC_ENTRY) && insideRoom(SW.faces, SW_ENTRY) &&
    near4(PC_ENTRY[0], -0.0826) && near4(PC_ENTRY[1], -0.1298) && near4(SW_ENTRY[0], -0.1933) && near4(SW_ENTRY[1], -0.3037),
  JSON.stringify({ pc: PC_ENTRY, sw: SW_ENTRY }));
check('§2 ★ ONE RULE: the walk\'s scaling IS the plate\'s — `apertureEyeFor(deck, p)` and `scaleToRoom(deck.sceneScale, p)` agree bytewise in both sealed rooms, and a euclidean room (no deck, scale 1) returns the very same point',
  JSON.stringify(apertureEyeFor(SW.deck, ENTRY)) === JSON.stringify(SW_ENTRY) && JSON.stringify(apertureEyeFor(PC.deck, ENTRY)) === JSON.stringify(PC_ENTRY) &&
    apertureEyeFor(null, ENTRY) === ENTRY && scaleToRoom(1, ENTRY) === ENTRY);
check('§2 the lens cannot be moved by the scale (it is realized in the euclidean chart, scale 1): its entry stays ON a face plane — the sighting says what it sees and stops (the lens realization is not this rider\'s)',
  LENS.sceneScale === 1 && !insideRoom(LENS.faces, ENTRY) && Math.abs(Math.min(...LENS.faces.map((f) => f.d - dot(ENTRY, f.n)))) < 1e-9);
const swScaledA = pressPeriod('H3', SW.faces, 'a', SW_ENTRY, M.frameAt('H3', SW_ENTRY, [[1, 0, 0], [0, 1, 0], [0, 0, 1]]));
const swScaledAdeg = wordAngle('H3', SW.faces, 'a', SW_ENTRY);
const swScaledAFAF = wordAngle('H3', SW.faces, 'afAF', SW_ENTRY);
const pcScaledA = pressPeriod('S3', PC.faces, 'a', PC_ENTRY, M.frameAt('S3', PC_ENTRY, [[1, 0, 0], [0, 1, 0], [0, 0, 1]]));
const pcScaledAdeg = wordAngle('S3', PC.faces, 'a', PC_ENTRY);
check('§2 ★ FROM THE SCALED ENTRY the press is still one period: Seifert–Weber `a` leaves through the named face and comes home (currency ≥ 1.99); the Poincaré press comes home writing its word with the currency π/5 = 0.6283',
  swScaledA && swScaledA.word === 'a' && swScaledA.home && swScaledA.length >= 1.99 && pcScaledA && pcScaledA.home && Math.abs(pcScaledA.length - Math.PI / 5) < 1e-6 &&
    pcScaledAdeg && Math.abs(pcScaledAdeg.deg - 36) < 1e-6,
  JSON.stringify({ sw: swScaledA && [swScaledA.word, swScaledA.home, swScaledA.length], pc: pcScaledA && [pcScaledA.word, pcScaledA.home, pcScaledA.length, pcScaledAdeg && pcScaledAdeg.deg] }));
note(`THE EYE'S PREDICTION at the walk's SCALED Seifert–Weber entry (${SW_ENTRY.map((x) => x.toFixed(4)).join(', ')}): press a → turned ${swScaledAdeg ? swScaledAdeg.deg.toFixed(2) : '?'}° · walked ${swScaledA ? swScaledA.length.toFixed(4) : '?'} · afAF → turned ${swScaledAFAF ? swScaledAFAF.deg.toFixed(2) : '?'}° (home ${swScaledAFAF && swScaledAFAF.home}) — θ depends on p: the raw entry read 120.35° / 167.21°`);
note(`THE EYE'S PREDICTION at the walk's SCALED Poincaré entry (${PC_ENTRY.map((x) => x.toFixed(4)).join(', ')}): press a → word ${pcScaledA && pcScaledA.word} · walked ${pcScaledA ? pcScaledA.length.toFixed(4) : '?'} · turned ${pcScaledAdeg ? pcScaledAdeg.deg.toFixed(4) : '?'}°`);
{
  const view = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ExploreWindow.tsx'), 'utf8');
  const aperture = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureModel.ts'), 'utf8');
  check('§3 ★ THE VIEW SCALES ITS ENTRY BY THE SURFACE\'S OWN SCALE through the plate\'s rule — the seed literal is named once and never stands alone as the eye; the surface states its scale on every return (1 on the two euclidean returns, the deck\'s on the sealed one)',
    view.includes('const ENTRY_SEED: Vec3 = [-0.35, -0.55, 0.1];') && view.includes('let eye: Vec3 = scaleToRoom(cellSurface.sceneScale, ENTRY_SEED);') &&
      !view.includes('let eye: Vec3 = [-0.35, -0.55, 0.1];') && aperture.includes('sceneScale: model.sceneScale };') &&
      (aperture.match(/sceneScale: 1 };/g) ?? []).length === 2 && aperture.includes('export const scaleToRoom = (sceneScale: number, p: V3): V3 =>') &&
      aperture.includes('  scaleToRoom(model ? model.sceneScale : 1, eye);'));
}

// ═══════════════════════════════ §3 the view, source-pinned ═══════════════════════════════
console.log('\n----- §3 ★★ ONE PRODUCER OF MOTION (LAW 22) — source-pinned in the view -----');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ExploreWindow.tsx'), 'utf8');
const advances = viewSrc.match(/eye = \[eye\[0\] \+ /g) ?? [];
check('§3 ★★ THE EYE IS MOVED IN EXACTLY ONE PLACE outside the transport: `advanceBy` — one integrator, whoever asked. A press hands it a direction and a bound; it does not move the eye itself',
  advances.length === 1 && viewSrc.includes('const advanceBy = (ms: number, dir: Vec3 = camF, maxChart = Infinity): number =>'),
  `motion sites outside the transport: ${advances.length}`);
check('§3 ★★ THE PRESS RIDES THE FRAME\'S OWN TWO CALLS: it advances through `advanceBy` toward its carried target, bounded by the chart distance to it, and is carried by the same `transportWalk(beforeAdvance)` — `transportWalk` keeps exactly two callers (the frame and the shared close)',
  viewSrc.includes('const s = advanceBy(now - press.clock, dir, left);') &&
    (viewSrc.match(/transportWalk\(/g) ?? []).length === 2,
  `transportWalk call sites: ${(viewSrc.match(/transportWalk\(/g) ?? []).length}`);
check('§3 ★★ THE FRAMES ARE PARALLEL-TRANSPORTED ALONG EVERY LEG AT THE ONE MOTION SITE: `advanceBy` carries all six axes from the point it left to the point it reached through `transportAlong` — the pointer\'s hold, a held key and a press alike (the addendum\'s build fact, by construction)',
  ['camF', 'camR', 'camU', 'deckF', 'deckR', 'deckU'].every((ax) => viewSrc.includes(`${ax} = transportAlong(model, from, eye, ${ax});`)) &&
    viewSrc.includes('if (model && s > 0) {'));
check('§3 ★★ THE TARGET IS THE PARTNER\'S MAP APPLIED TO THE EYE (the deck element entered through the named door), the true length is the room\'s own metre, and the target FOLDS with the eye in BOTH door kinds',
  viewSrc.includes("f.door.pair === named.door!.pair && f.door.side !== named.door!.side") &&
    viewSrc.includes('projectivePoint(partner.g4, eye)') && viewSrc.includes('affinePoint(partner.g, eye)') &&
    viewSrc.includes('length: walkDistance(cellSurface.model, eye, target),') &&
    viewSrc.includes('const carried = projectivePoint(g4, press.target);') &&
    viewSrc.includes('if (press) press.target = affinePoint(g, press.target);'));
check('§3 ★ THE CURVED-ROOM REST IS LIFTED: the handler no longer returns on the room\'s geometry mark — the letters work in every room — and the horizon is the only refusal (a target the chart cannot see mints nothing)',
  !/if \(cellSurface\.model\) return;/.test(viewSrc) && viewSrc.includes('if (!target) return; // the horizon, or a face with no map — nothing is minted'));
const keyHandler = viewSrc.slice(viewSrc.indexOf('const onKey = (ev: KeyboardEvent)'), viewSrc.indexOf('const onKeyUp = (ev: KeyboardEvent)'));
check('§3 ★★ THE KEY HANDLER PERFORMS NO MOTION AND NO CROSSING: its body assigns no eye, calls no transport, and writes no trace letter — it records the press (its target, its length) and nothing else',
  keyHandler.length > 0 && !/\beye\s*=/.test(keyHandler) && !keyHandler.includes('transportWalk') &&
    !keyHandler.includes('seam.trace') && !keyHandler.includes('seam.doors') && !keyHandler.includes('refreshOrderSurface'));
check('§3 ★★ NO INSTRUMENT TAG EXISTS TO LEAVE: the seam carries no keyed/instrument field, and the trace is written at exactly the two crossing sites in the transport — a pressed word and a walked word are one record; the press\'s own word is READ from the trace, never written beside it',
  !/seam\.(keyed|instrument|inputSource|bySource|byKeyboard|viaKey)/.test(viewSrc) &&
    (viewSrc.match(/seam\.trace \+= doorLetter\(/g) ?? []).length === 2 &&
    viewSrc.includes('press.word += seam.trace.slice(traceBeforeTransport);'),
  `trace-write sites: ${(viewSrc.match(/seam\.trace \+= doorLetter\(/g) ?? []).length}`);
check('§3 the guards stand: the browser\'s own chords pass through, an auto-repeat is not a second press, a focused text field keeps its keys, and a walk in flight is never queued behind (a press, the pointer\'s hold, a held key)',
  keyHandler.includes('ev.ctrlKey || ev.altKey || ev.metaKey || ev.repeat') &&
    keyHandler.includes('faceForLetter(cellSurface.faces, letterForKey(ev.key, ev.shiftKey))') &&
    keyHandler.includes("el.tagName === 'INPUT'") && keyHandler.includes('if (press || advancing || keyWalk !== 0) return;'));
check('§3 the hand takes the wheel: engaging the pointer\'s hold, or a held walk key, drops a press in flight rather than integrating two asks at once',
  viewSrc.includes("press = null; // K-1: the hand took the wheel") && viewSrc.includes('press = null; // the hand took the wheel — the same law as the pointer\'s hold'));
check('§3 ★ THE FRAMES ARE ORTHONORMAL IN THE ROOM\'S METRIC FROM THE ENTRY, and the deck frame\'s entry value is kept as the reference every return is read against',
  viewSrc.includes('[camF, camR, camU] = frameAt(cellSurface.model, eye, [camF, camR, camU]);') &&
    viewSrc.includes('[deckF, deckR, deckU] = frameAt(cellSurface.model, eye, [deckF, deckR, deckU]);') &&
    viewSrc.includes('const entryDeck: Vec3[] = [[...deckF] as Vec3, [...deckR] as Vec3, [...deckU] as Vec3];'));
check('§3 ★★ THE RETURN LINE PRINTS THE ANGLE (LAW 23): the deck frame is compared with its entry value carried to the return point by the room\'s own transport, and `turned` carries the rounded degrees — `the same way up` and `mirrored` unchanged',
  viewSrc.includes('const ref = entryDeck.map((v) => transportAlong(cellSurface.model, entryEye, eye, v));') &&
    viewSrc.includes('const turnDeg = frameAngleDeg(cellSurface.model, eye, [deckF, deckR, deckU], ref);') &&
    viewSrc.includes('`the room came back turned by ${Math.round(turnDeg)}°`') &&
    viewSrc.includes("'the room came back the same way up'") && viewSrc.includes("'the room came back mirrored'") &&
    !viewSrc.includes("'the room came back turned'"));
check("§3 ★ THE RETURN BALL IS READ IN THE ROOM'S OWN METRIC, AND THE ARMING AT THE FOLD TOO: the distance to the entry that arms and fires a return is `walkDistance` (the chart's hypot at E³, the true distance in a sealed curved room), and the arming is read at the pre-fold position as well as at the frame's end — measured 2026-09-16: a whole Seifert–Weber period stayed inside the CHART arming radius, and under a starved frame the outbound leg folded and landed inside one step, so its home went unannounced twice",
  viewSrc.includes('const dEntry = walkDistance(cellSurface.model, eye, entryEye);') && !/const dEntry = Math\.hypot\(/.test(viewSrc) &&
    viewSrc.includes('if (!awayFromEntry && walkDistance(cellSurface.model, eye, entryEye) > RETURN_ARM) awayFromEntry = true;'));
check('§3 THE PRESS LINE states the act, the letters crossed and the true length as a number (LAW 23), from the seam\'s own record',
  viewSrc.includes('seam.press = { letter: press.letter, word: press.word, length: press.length, walked: press.walked };') &&
    viewSrc.includes("pressed ${press.letter} · crossed ${press.word || 'nothing'} · walked ${press.length.toFixed(2)}") &&
    viewSrc.includes('data-explore-press'));
check('§3 the metric lives in ONE module the view imports and this witness RUNS — no second copy of the inner product, the orthonormalisation, the door push or the affine maps remains in the view',
  /from '\.\/walkMetric';/.test(viewSrc) && !/const modelIP = /.test(viewSrc) && !/const modelOrthonormalise = /.test(viewSrc) &&
    !/const applyM = /.test(viewSrc) && !/const applyRot = /.test(viewSrc) && !/const push = \(v: Vec3\): Vec3 => \{/.test(viewSrc));

// ═══════════════════════════════ §5 STAMP K-2a (kept) ═══════════════════════════════
console.log('\n----- §5 ★★ STAMP K-2a — THE COMPLETE KEYBOARD WALK: everything the pointer does, by keys, on the SAME producers -----');
check('§5 ★ THE BINDING TABLE, RUN: ↑ walks forward · ↓ back · ← turns left · → right · PgUp looks up · PgDn down · End faces the nearest door · Home faces as you entered — eight acts, eight keys, stated once in orderTrace (K-2c added the two snaps)',
  walkKeyAct('ArrowUp') === 'forward' && walkKeyAct('ArrowDown') === 'back' && walkKeyAct('ArrowLeft') === 'left' &&
    walkKeyAct('ArrowRight') === 'right' && walkKeyAct('PageUp') === 'up' && walkKeyAct('PageDown') === 'down' &&
    walkKeyAct('End') === 'faceDoor' && walkKeyAct('Home') === 'entryLook' && WALK_KEYS.length === 8);
const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 -=[];\',./`'.split('');
check('§5 ★★ THE ALPHABET IS THE DOORS\' — BY CONSTRUCTION: every single-character key (all 52 letters, the digits, the symbols) is refused as a walk key before the table is read, so no room of up to 26 pairings can ever have a door and a walk act on one key. W/A/S/D in particular: `a` is door 0 in EVERY room and `d`/`e` are doors in a six-pairing room — measured, and why the mandate\'s second spelling is not bound',
  alphabet.every((k) => walkKeyAct(k) === null) && ['w', 'a', 's', 'd', 'W', 'A', 'S', 'D', 'q', 'e'].every((k) => walkKeyAct(k) === null));
check('§5 …and the doors keep their letters untouched: `a` still addresses face 0 of the T³ fixture and shift still means the inverse (K-1 as landed)',
  faceForLetter(T3, letterForKey('a', false)) === 0 && faceForLetter(T3, letterForKey('a', true)) === 1);
check('§5 LAW 24 — the table can refuse: Escape, Shift, Enter, Space, Tab, Insert, Delete and the unbound function keys walk nothing (esc keeps its meaning)',
  ['Escape', 'Shift', 'Enter', ' ', 'Tab', 'Insert', 'Delete', 'F5', 'Control', 'Alt', 'Meta', ''].every((k) => walkKeyAct(k) === null));
check('§5 ★★ THE HELD KEY IS THE POINTER\'S HOLD: the frame integrates it through the same call on the same clock law — forward hands `camF`, BACK hands the SAME call the negated direction (never a second path) — and the pointer\'s own line is byte-unchanged',
  viewSrc.includes('advanceBy(now - keyWalkClock, keyWalk > 0 ? camF : neg3(camF));') &&
    viewSrc.includes('keyWalkClock = Math.max(keyWalkClock, now);') &&
    /        advanceBy\(now - advClock\);\r?\n        advClock = Math\.max\(advClock, now\);/.test(viewSrc));
check('§5 ★★ ONE CLOSE FOR BOTH INSTRUMENTS: the pointer\'s up and a key\'s up end a walk through the same `closeWalk` (the integral to the release\'s TRUE time, then the transport)',
  viewSrc.includes('closeWalk(advClock, ev.timeStamp);') &&
    viewSrc.includes('if (keyWalk !== 0) closeWalk(keyWalkClock, at, keyWalk > 0 ? camF : neg3(camF));'));
check("§5 ★★ ONE FRAME WRITER (LAW 22): the drag and the held turn key both rotate the carried frame through `rotateFrame`, and it rotates WITHIN the frame's own planes (yaw in F–R, pitch in F–U) — exact in every metric because the frame is orthonormal in the room's own metric; no Rodrigues axis and no chart renormalisation remain in the view (measured 2026-09-16: after a projective door the old axis-rotation turned a π drag 119° and a π key-hold 120°, 11.8° apart)",
  viewSrc.includes('const rotateFrame = (yaw: number, pitch: number): void => {') &&
    viewSrc.includes('const f1: Vec3 = [camF[0] * cy + camR[0] * sy, camF[1] * cy + camR[1] * sy, camF[2] * cy + camR[2] * sy];') &&
    viewSrc.includes('const u2: Vec3 = [camU[0] * cp + camF[0] * sp, camU[1] * cp + camF[1] * sp, camU[2] * cp + camF[2] * sp];') &&
    !/rot3\(/.test(viewSrc) && !/nrm3\(rot3\(/.test(viewSrc) &&
    viewSrc.includes('rotateFrame(-dxPx * s, -dyPx * s);'));
check('§5 ★ THE SIGN IS MEASURED: left and up are the NEGATIVE angles at the writer (a +90° yaw was sighted turning the view RIGHT, a +90° pitch looking DOWN), applied at both spends — the frame\'s sweep and the release\'s close',
  (viewSrc.match(/rotateFrame\(-keyYaw \* KEY_TURN_RATE \* dt, -keyPitch \* KEY_TURN_RATE \* dt\);/g) ?? []).length === 2 &&
    viewSrc.includes('const KEY_TURN_RATE = Math.PI / 2;'));
check('§5 a RELEASE ends the walk as the pointer\'s does: keyup is listened for and removed with keydown; and losing focus RELEASES every held key (a key let go while the window has no focus never sends its keyup) — the pointer\'s hold taking the wheel releases them at the hold\'s true time too',
  viewSrc.includes("window.addEventListener('keyup', onKeyUp);") && viewSrc.includes("window.removeEventListener('keyup', onKeyUp);") &&
    viewSrc.includes("window.addEventListener('blur', onBlur);") && viewSrc.includes("window.removeEventListener('blur', onBlur);") &&
    viewSrc.includes('releaseKeys(downT + ADVANCE_HOLD_MS);'));
check('§5 the key handler still moves nothing itself: a bound key records a held act and hands the two resolvers its time — no eye assignment, no transport, no trace write in the handler; the walk keys are read BEFORE the letters and never as a letter',
  keyHandler.length > 0 && !/\beye\s*=/.test(keyHandler) && !keyHandler.includes('transportWalk') && !keyHandler.includes('seam.trace') &&
    keyHandler.indexOf('const act = walkKeyAct(ev.key);') < keyHandler.indexOf('faceForLetter(cellSurface.faces'));
check('§5 ★ THE LINE IS TRUE AND COMPLETE, ONE line in every room, and it prints the counted register\'s NUMBERS (LAW 23): every bound key named with its act — the step unit and the turn fraction as the live values — the letters offered everywhere, the two snaps, the pointer\'s acts beside them',
  viewSrc.replace(/\s+/g, ' ').includes("{`↑/↓ — walk (tap: one step of ${stepUnit.toFixed(2)} · hold: glide) · ←/→ — turn (tap: 1/${turnFraction} turn · hold: sweep) · PgUp/PgDn — look up and down (the same) · End — face the nearest door · Home — face as you entered · a door's letter — cross it, shift for the other way · drag — look around · press and hold — walk forward · the hatch settles in when you stand still · esc returns to the shell`}") &&
    !viewSrc.includes('the door letters rest in this curved room'));

// ═══════════════════════════════ §6 STAMP K-2c — THE COUNTED REGISTER ═══════════════════════════════
console.log('\n----- §6 ★★ STAMP K-2c — counted steps, fractional turns, two snaps — the same producers, RUN -----');
const rngE = mulberry(23);
const expOK = (model) => {
  for (let i = 0; i < 40; i += 1) {
    const sc = model === 'H3' ? 0.5 : 0.8;
    const k = [(rngE() * 2 - 1) * sc, (rngE() * 2 - 1) * sc, (rngE() * 2 - 1) * sc];
    const dir = [rngE() - 0.5, rngE() - 0.5, rngE() - 0.5];
    const u = 0.05 + rngE() * 0.5;
    const y = M.expMap(model, k, dir, u);
    const d = M.walkDistance(model, k, y);
    if (Math.abs(d - u) > 1e-9) return `distance ${d} for u ${u}`;
    const gap = sub(y, k);
    const cross = [gap[1] * dir[2] - gap[2] * dir[1], gap[2] * dir[0] - gap[0] * dir[2], gap[0] * dir[1] - gap[1] * dir[0]];
    if (len(cross) > 1e-9 * len(gap) * len(dir) + 1e-12) return 'off the chart line';
    if (dot(gap, dir) <= 0) return 'walked backwards';
  }
  return true;
};
check('§6 ★★ THE EXPONENTIAL MAP: the counted step\'s target lies at EXACTLY the true distance u from the eye (1e-9), on the chart line of the direction, ahead of it — 40 random points and directions in H³ and in S³ (a step is one clean unit of the room\'s own metre)',
  expOK('H3') === true && expOK('S3') === true, `${expOK('H3')} · ${expOK('S3')}`);
check('§6 …and at E³ it is the chart\'s own k + û·u',
  (() => { const y = M.expMap(null, [0.1, 0.2, 0.3], [0, 3, 4], 0.5); return Math.abs(y[0] - 0.1) < 1e-12 && Math.abs(y[1] - 0.5) < 1e-12 && Math.abs(y[2] - 0.7) < 1e-12; })());
const perpOK = (model, faces, k) => {
  for (const f of faces) {
    if (f.wall) continue;
    const dir = M.perpendicularToward(model, k, f.n, f.d);
    const dn = dot(dir, f.n);
    if (dn <= 1e-12) return `direction does not approach the plane (${dn})`;
    const tt = (f.d - dot(k, f.n)) / dn;
    const h = [k[0] + dir[0] * tt, k[1] + dir[1] * tt, k[2] + dir[2] * tt];
    // two independent in-plane chart directions at the hit point
    const a = Math.abs(f.n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    const e1 = [a[1] * f.n[2] - a[2] * f.n[1], a[2] * f.n[0] - a[0] * f.n[2], a[0] * f.n[1] - a[1] * f.n[0]];
    const e2 = [f.n[1] * e1[2] - f.n[2] * e1[1], f.n[2] * e1[0] - f.n[0] * e1[2], f.n[0] * e1[1] - f.n[1] * e1[0]];
    const ip = (x, y) => M.walkIP(model, h, x, y);
    const n1 = Math.sqrt(ip(dir, dir) * ip(e1, e1));
    const n2 = Math.sqrt(ip(dir, dir) * ip(e2, e2));
    if (Math.abs(ip(dir, e1)) / n1 > 1e-9 || Math.abs(ip(dir, e2)) / n2 > 1e-9) return `not perpendicular at the plane: ${ip(dir, e1) / n1}, ${ip(dir, e2) / n2}`;
  }
  return true;
};
check('§6 ★★ THE PERPENDICULAR TOWARD A DOOR: from the walk\'s entry, the direction handed to "face the nearest door squarely" meets EVERY door\'s plane at right angles in the room\'s own metric — Seifert–Weber (H³) and the Poincaré cell (S³) from an interior point, and T³ (E³: the plane normal itself)',
  perpOK('H3', SW.faces, ENTRY) === true && perpOK('S3', PC.faces, PROBE_POINT) === true && perpOK(null, T3, ENTRY) === true,
  `${perpOK('H3', SW.faces, ENTRY)} · ${perpOK('S3', PC.faces, PROBE_POINT)} · ${perpOK(null, T3, ENTRY)}`);
check('§6 ★ THE TAP WINDOW is stated once, and a tap is COUNTED at its release whether or not a glide ran: the glide it already spent (exact to the input clock) is topped up to exactly ONE unit by the same bounded walk a letter-press uses — a step is a press with the exponential map\'s point as its target; a tap landing while a step still walks ADDS its unit to that step (the key defers, so N taps are N units however fast the hand), and a key held past the window takes the wheel from the step (the glide) at EXACTLY one window after it went down on the input clock — a timer, the pointer\'s own hold law, never a frame\'s reading of the two clocks',
  viewSrc.includes('const TAP_MS = 200;') && viewSrc.includes('if (since !== undefined && ev.timeStamp - since < TAP_MS) {') &&
    viewSrc.includes('target: expMap(cellSurface.model, eye, dir, remainder),') &&
    viewSrc.includes('letter: arrow,') && viewSrc.includes('const remainder = Math.max(0, unit - spent);') &&
    viewSrc.includes('press.target = expMap(cellSurface.model, press.target, gap, unit);') && viewSrc.includes('press.length += unit;') &&
    viewSrc.includes("if ((act === 'forward' || act === 'back') && press && press.letter === (act === 'forward' ? '↑' : '↓')) {") &&
    viewSrc.includes('deferTimers.set(act, window.setTimeout(() => {') && viewSrc.includes('resolveKeyWalk(since + TAP_MS);') &&
    !viewSrc.includes('now - since >= TAP_MS'));
check('§6 ★ A TURN-TAP is ONE known fraction of a turn: the swept part plus its remainder, written by the one frame writer (yaw for ←/→, pitch for PgUp/PgDn), the fraction the live constant',
  viewSrc.includes('const fraction = (2 * Math.PI) / liveRef.current.turnFraction;') &&
    viewSrc.includes("if (act === 'left' || act === 'right') rotateFrame(-wasYaw * remainder, 0);") &&
    viewSrc.includes('else rotateFrame(0, -wasPitch * remainder);'));
check('§6 ★★ THE TWO SNAPS: "face the nearest door squarely" aims the one frame writer along the perpendicular toward the nearest door\'s plane; "face as you entered" makes the looked frame the DECK frame — the entry frame carried along the walker\'s own path — a recorded landmark, never re-derived; each counts as a look and is recorded on the seam',
  viewSrc.includes("const snapTo = (act: 'faceDoor' | 'entryLook'): void => {") &&
    viewSrc.includes('const toward = perpendicularToward(cellSurface.model, eye, face.n, face.d);') &&
    viewSrc.includes('rotateFrame(Math.atan2(dR, dF), -Math.atan2(dU, Math.hypot(dF, dR)));') &&
    viewSrc.includes('camF = [deckF[0], deckF[1], deckF[2]];') && viewSrc.includes('camU = [deckU[0], deckU[1], deckU[2]];') &&
    viewSrc.includes('seam.snap = { act, letter: face.door ? doorLetter(face.door) : null };') &&
    viewSrc.includes("if (act === 'faceDoor' || act === 'entryLook') {"));
check('§6 the two constants are the person\'s, ONE each: `stepUnit` and `turnFraction` arrive as props, live in the same ref as the pace, and are stated in the line as numbers',
  viewSrc.includes('  stepUnit: number; // K-2c: one counted step (a tap of ↑/↓), true distance') &&
    viewSrc.includes('  turnFraction: number; // K-2c: one counted turn (a tap of ←/→ · PgUp/PgDn) is 1/this of a full turn') &&
    viewSrc.includes('const liveRef = useRef({ level, pace, lookSensitivity, stepUnit, turnFraction,'));
check('§6 ONE PRODUCER, still: the eye is moved in exactly one place outside the transport, `transportWalk` keeps two callers, and no motion or trace write entered the key handlers',
  (viewSrc.match(/eye = \[eye\[0\] \+ /g) ?? []).length === 1 && (viewSrc.match(/transportWalk\(/g) ?? []).length === 2 &&
    !/\beye\s*=/.test(viewSrc.slice(viewSrc.indexOf('const onKeyUp = (ev: KeyboardEvent)'), viewSrc.indexOf('const onBlur = '))));
check('§6 ★ "level the horizon" is NOT here — the snaps are the two ruled lawful; no level snap exists in the table or the view',
  !/level/i.test(viewSrc.slice(viewSrc.indexOf('const snapTo ='), viewSrc.indexOf('const snapTo =') + 2600).replace(/⛔ "level the horizon" is not here[^\n]*/, '')) && walkKeyAct('Insert') === null);


console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-KEYED-WALK: ALL PASS — the key addresses a door by its own name, a press is one period of its deck element in every room, the frames ride the room\'s own transport, a tap is one counted unit, and one producer moves the eye' : `DIAGNOSE-THE-KEYED-WALK: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

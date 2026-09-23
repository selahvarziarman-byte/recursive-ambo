#!/usr/bin/env node
// PRESS-PERIOD PROBE (STAMP K-1d, researcher, 2026-09-16) — grounds the ruling "a letter-press is one period of
// the named door's deck element" against the engine's OWN realizations and door isometries (noncubeDomain.ts),
// with the same .ts require-hook the repo's witnesses use. Reads only; writes nothing into the tree.
//
// For a cell D with doors (faceA ~ faceB, matrix M: M·D = the neighbour across B; crossing A applies M,
// crossing B applies M⁻¹), a LETTER is a door + direction. The PERIOD of letter ℓ at p is the geodesic from p
// to g_ℓ·p, where g_ℓ is the deck element whose cell the walker enters through the named face
// (forward letter: g = M⁻¹ — the neighbour across A; capital: g = M — the neighbour across B).
// Sealed before the run:
//   S1  in the EUCLIDEAN control (the box), the period crosses EXACTLY the named face, once, from every p.
//   S2  in Seifert–Weber and L(4,1), the FIRST face the period crosses is NOT always the named one (p-dependent).
//   S3  in every room, the composite of the doors crossed along the period equals the deck element g_ℓ exactly
//       (matrix agreement to 1e-9 after normalization) and the folded endpoint returns to p — HOME after the word.
//   S4  T³ control for the mothership's constraint: from the off-axis entry (−0.35,−0.55,0.1), the four periods
//       a·b·A·B compose to the identity and the endpoint is p — home, as an abelian deck requires.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  }).outputText;
  module._compile(output, filename);
};
const repoRoot = path.resolve(__dirname, '..', '..', '..');
const N = require(path.join(repoRoot, 'src/lib/noncubeDomain.ts'));

const EPS = 1e-9;
const matApply = N.mat4Apply, matMul = N.mat4Mul, inv = N.matrixInverse4;
const ID = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const normMat = (m) => { const s = m[15] !== 0 ? m[15] : 1; return m.map((x) => x / s); };
const matDiff = (a, b) => Math.max(...normMat(a).map((x, i) => Math.abs(x - normMat(b)[i])));

// a room = { geometry, faces: [{id, u}], doors: [{letter, faceA, faceB, m}] }
function lettersOf(deck) {
  const out = [];
  deck.entries.forEach((e, i) => {
    const l = String.fromCharCode(97 + i);
    out.push({ letter: l, named: e.faceA, m: e.m, g: inv(e.m), entry: e });          // forward: exit through A, fold by M, g = M⁻¹
    out.push({ letter: l.toUpperCase(), named: e.faceB, m: inv(e.m), g: e.m, entry: e }); // capital: exit through B, fold by M⁻¹, g = M
  });
  return out;
}
function planes(geometry, deck, faceIds, covectors) {
  return faceIds.map((id) => ({ id, ...N.chartPlaneOf(geometry, covectors.get(id)) }));
}
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
function inside(planesArr, k) { return planesArr.every((pl) => dot3(k, pl.n) < pl.d + 1e-12); }
function doorOfFace(letters, faceId) {
  // crossing face F applies M if F is a faceA, M⁻¹ if F is a faceB
  const fwd = letters.find((l) => l.letter === l.letter.toLowerCase() && l.named === faceId);
  if (fwd) return { apply: fwd.m, letter: fwd.letter };
  const back = letters.find((l) => l.letter !== l.letter.toLowerCase() && l.named === faceId);
  if (back) return { apply: back.m, letter: back.letter };
  throw new Error(`no door on face ${faceId}`);
}
// walk the period of `letter` from model point P: straight chart segment toward g·P, folding at each face crossed
function period(geometry, planesArr, letters, letter, P) {
  const L = letters.find((l) => l.letter === letter);
  let target = matApply(L.g, P);
  let cur = P;
  let word = '';
  let composite = ID;
  let firstFace = null;
  for (let step = 0; step < 32; step += 1) {
    const k = N.chartOf(cur), tk = N.chartOf(target);
    if (inside(planesArr, tk)) {
      // walk straight to the target inside the cell — the period ends here
      return { word, composite, end: target, firstFace, home: Math.hypot(...[0, 1, 2, 3].map((i) => target[i] - P[i])) < 1e-7 };
    }
    const dir = [tk[0] - k[0], tk[1] - k[1], tk[2] - k[2]];
    let best = null;
    for (const pl of planesArr) {
      const denom = dot3(dir, pl.n);
      if (denom <= 1e-15) continue;                        // moving away from or parallel to this plane
      const s = (pl.d - dot3(k, pl.n)) / denom;
      if (s < -1e-12 || s > 1 + 1e-12) continue;
      if (!best || s < best.s) best = { s, id: pl.id };
    }
    if (!best) throw new Error(`the segment leaves no face but the target is outside — ${letter}`);
    if (firstFace === null) firstFace = best.id;
    const door = doorOfFace(letters, best.id);
    word += door.letter;
    // fold: the exit point, the target and the composite all go through the door
    const kx = [k[0] + best.s * dir[0], k[1] + best.s * dir[1], k[2] + best.s * dir[2]];
    // lift the chart exit point back to a model point (the chart segment is the geodesic; the lift is exact)
    cur = liftChart(geometry, kx);
    cur = matApply(door.apply, cur); target = matApply(door.apply, target); composite = matMul(door.apply, composite);
    // renormalize model vectors to the unit hyperboloid / sphere so chartOf stays well-conditioned
    cur = renorm(geometry, cur); target = renorm(geometry, target);
  }
  throw new Error('period did not close in 32 crossings');
}
function liftChart(geometry, k) {
  const x = [k[0], k[1], k[2], 1];
  if (geometry === 'E3') return x;                       // the euclidean chart IS the model (affine doors keep x₃ = 1)
  const q = N.metricDot(geometry, x, x);
  const s = Math.sqrt(Math.abs(q));
  return [x[0] / s, x[1] / s, x[2] / s, x[3] / s];
}
function renorm(geometry, x) {
  if (geometry === 'E3') return [x[0] / x[3], x[1] / x[3], x[2] / x[3], 1];
  const q = N.metricDot(geometry, x, x); const s = Math.sqrt(Math.abs(q));
  const y = [x[0] / s, x[1] / s, x[2] / s, x[3] / s];
  return y[3] < 0 ? y.map((v) => -v) : y;
}
function randomInside(geometry, planesArr, rng, scale) {
  for (let i = 0; i < 10000; i += 1) {
    const k = [(rng() * 2 - 1) * scale, (rng() * 2 - 1) * scale, (rng() * 2 - 1) * scale];
    if (inside(planesArr, k)) return liftChart(geometry, k);
  }
  throw new Error('no interior point found');
}
function mulberry(seed) { return () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

function report(name, geometry, deck, faceIds, covectors, samplePoints) {
  const letters = lettersOf(deck);
  const pl = planes(geometry, deck, faceIds, covectors);
  console.log(`\n=== ${name} (${geometry}; ${letters.length} letters) ===`);
  let namedFirst = 0, total = 0, compositeOK = 0, homeOK = 0, maxWord = 0;
  const wordHist = {};
  const currency = {};   // the TRUE length of the period, d(p, g·p), per letter: min / mean / max over the sample
  const dist = (P, Q) => {
    if (geometry === 'E3') return Math.hypot(P[0] - Q[0], P[1] - Q[1], P[2] - Q[2]);
    const ip = N.metricDot(geometry, P, Q);
    return geometry === 'H3' ? Math.acosh(Math.max(1, -ip)) : Math.acos(Math.max(-1, Math.min(1, ip)));
  };
  for (const P of samplePoints) {
    for (const L of letters) {
      const r = period(geometry, pl, letters, L.letter, P);
      total += 1;
      if (r.firstFace === L.named) namedFirst += 1;
      // the composite of the FOLDS is g⁻¹ (each fold maps the entered cell back to D); equivalently composite·(g·p) = p
      if (matDiff(r.composite, inv(L.g)) < 1e-9) compositeOK += 1;
      if (r.home) homeOK += 1;
      maxWord = Math.max(maxWord, r.word.length);
      wordHist[r.word.length] = (wordHist[r.word.length] || 0) + 1;
      const c = dist(P, matApply(L.g, P));
      const acc = currency[L.letter] = currency[L.letter] || { min: Infinity, max: 0, sum: 0, n: 0 };
      acc.min = Math.min(acc.min, c); acc.max = Math.max(acc.max, c); acc.sum += c; acc.n += 1;
    }
  }
  console.log(`  periods walked: ${total} (points ${samplePoints.length} × letters ${letters.length})`);
  console.log(`  first face crossed IS the named face: ${namedFirst}/${total}`);
  console.log(`  composite of the doors crossed == g⁻¹ (the fold of the deck element; 1e-9): ${compositeOK}/${total}`);
  console.log(`  folded endpoint == p (HOME after the word): ${homeOK}/${total}`);
  console.log(`  word length histogram (crossings per period): ${JSON.stringify(wordHist)}   max ${maxWord}`);
  console.log(`  the currency d(p, g·p) per letter over the sample (min · mean · max):`);
  for (const L of letters) { const c = currency[L.letter]; console.log(`    ${L.letter}: ${c.min.toFixed(4)} · ${(c.sum / c.n).toFixed(4)} · ${c.max.toFixed(4)}`); }
  // one worked line per letter from the FIRST sample point
  for (const L of letters) {
    const r = period(geometry, pl, letters, L.letter, samplePoints[0]);
    console.log(`    press ${L.letter} (named ${L.named.split(':').pop()}): first face ${r.firstFace.split(':').pop()}, word "${r.word}", composite==g⁻¹ ${matDiff(r.composite, inv(L.g)) < 1e-9}, home ${r.home}`);
  }
  return { letters, pl };
}

// ---------------- FRAME HOLONOMY (K-1d-r) ----------------
// A press carries the walker's frame: parallel transport along each geodesic leg, the door's isometry at each fold.
// Back at p the frame differs from the start frame by a rotation R; θ = its angle. T³: θ ≡ 0. A retrace (a·A) must give 0.
const mdot = (g, a, b) => N.metricDot(g, a, b);
function tangentFrame(geometry, x) {
  // an orthonormal tangent frame at x (Gram–Schmidt of the chart axes projected to T_x), in the model metric
  const xx = mdot(geometry, x, x);
  const proj = (e) => { const c = mdot(geometry, e, x) / xx; return e.map((v, i) => v - c * x[i]); };
  const out = [];
  for (const e of [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0]]) {
    let v = geometry === 'E3' ? e.slice() : proj(e);
    for (const u of out) { const c = mdot(geometry, v, u); v = v.map((t, i) => t - c * u[i]); }
    const n = Math.sqrt(Math.abs(mdot(geometry, v, v))); out.push(v.map((t) => t / n));
  }
  return out;
}
function transportLeg(geometry, x, y, frame) {
  if (geometry === 'E3') return frame;                                  // flat: vectors are constant
  const s = geometry === 'H3' ? -1 : 1;                                 // ⟨x,x⟩ = s
  const xy = mdot(geometry, x, y);
  let u = y.map((v, i) => v - s * xy * x[i]);                            // tangent at x toward y  (H³: y + ⟨x,y⟩x; S³: y − ⟨x,y⟩x)
  let nu = Math.sqrt(Math.abs(mdot(geometry, u, u))); if (nu < 1e-14) return frame;
  u = u.map((v) => v / nu);
  let up = x.map((v, i) => -(v - s * xy * y[i]));                        // tangent at y, pointing AWAY from x
  const nup = Math.sqrt(Math.abs(mdot(geometry, up, up))); up = up.map((v) => v / nup);
  return frame.map((f) => { const c = mdot(geometry, f, u); return f.map((v, i) => v - c * u[i] + c * up[i]); });
}
function periodWithFrame(geometry, planesArr, letters, letter, P, frame) {
  const L = letters.find((l) => l.letter === letter);
  let target = matApply(L.g, P); let cur = P; let fr = frame.map((v) => v.slice()); let word = '';
  for (let step = 0; step < 32; step += 1) {
    const k = N.chartOf(cur), tk = N.chartOf(target);
    if (inside(planesArr, tk)) { fr = transportLeg(geometry, cur, renorm(geometry, target), fr); return { word, end: renorm(geometry, target), frame: fr }; }
    const dir = [tk[0] - k[0], tk[1] - k[1], tk[2] - k[2]];
    let best = null;
    for (const pl of planesArr) { const denom = dot3(dir, pl.n); if (denom <= 1e-15) continue; const s = (pl.d - dot3(k, pl.n)) / denom; if (s < -1e-12 || s > 1 + 1e-12) continue; if (!best || s < best.s) best = { s, id: pl.id }; }
    if (!best) throw new Error('no exit');
    const door = doorOfFace(letters, best.id); word += door.letter;
    const exit = liftChart(geometry, [k[0] + best.s * dir[0], k[1] + best.s * dir[1], k[2] + best.s * dir[2]]);
    fr = transportLeg(geometry, cur, exit, fr);                          // along the leg to the exit point
    fr = fr.map((v) => matApply(door.apply, v));                           // through the door (tangent vectors carry by the same isometry)
    cur = renorm(geometry, matApply(door.apply, exit)); target = renorm(geometry, matApply(door.apply, target));
  }
  throw new Error('period did not close');
}
function frameAngle(geometry, f0, f1) {
  // R_ij = ⟨f1_i, f0_j⟩ (the transported frame in the start frame's coordinates); θ from the trace
  let tr = 0; for (let i = 0; i < 3; i += 1) tr += mdot(geometry, f1[i], f0[i]);
  return Math.acos(Math.max(-1, Math.min(1, (tr - 1) / 2))) * 180 / Math.PI;
}
function frameReport(name, geometry, deck, faceIds, covectors, P, words) {
  const letters = lettersOf(deck); const pl = planes(geometry, deck, faceIds, covectors);
  console.log(`\n=== FRAME HOLONOMY — ${name} at the first sample point ===`);
  for (const w of words) {
    let fr = tangentFrame(geometry, P); let cur = P; let trace = '';
    for (const l of w) { const r = periodWithFrame(geometry, pl, letters, l, cur, fr); fr = r.frame; cur = r.end; trace += r.word; }
    const back = Math.hypot(...[0, 1, 2, 3].map((i) => cur[i] - P[i])) < 1e-7;
    console.log(`    word ${w.padEnd(5)} trace "${trace}" home ${back}  θ = ${frameAngle(geometry, tangentFrame(geometry, P), fr).toFixed(4)}°`);
  }
}

// ---------------- Seifert–Weber ----------------
const dodeca = N.createDodecahedronShape();
const swPairings = N.dodecahedralTwistPairings(dodeca, 3);
const swReal = N.realizeDodecahedralDomain(dodeca, 'seifert-weber');
const swDeck = N.realizePairingIsometries(dodeca, swPairings, swReal);
const swFaces = dodeca.faces.map((f) => f.id);
const rng = mulberry(7);
const swPlanes = planes('H3', swDeck, swFaces, swReal.faceCovectors);
const swPoints = [liftChart('H3', [0.02, 0.01, -0.015]), ...Array.from({ length: 40 }, () => randomInside('H3', swPlanes, rng, 0.35))];
report('Seifert–Weber (3/10 twist)', 'H3', swDeck, swFaces, swReal.faceCovectors, swPoints);
frameReport('Seifert–Weber', 'H3', swDeck, swFaces, swReal.faceCovectors, swPoints[0], ['a', 'f', 'A', 'aA', 'fF', 'af', 'afAF', 'ab', 'abAB']);
frameReport('Seifert–Weber, a second point', 'H3', swDeck, swFaces, swReal.faceCovectors, swPoints[5], ['a', 'aA', 'afAF', 'abAB']);

// ---------------- Poincaré (control: the same shape, 1/10 twist, S³) ----------------
try {
  const pPairings = N.dodecahedralTwistPairings(dodeca, 1);
  const pReal = N.realizeDodecahedralDomain(dodeca, 'poincare');
  const pDeck = N.realizePairingIsometries(dodeca, pPairings, pReal);
  const pPlanes = planes('S3', pDeck, swFaces, pReal.faceCovectors);
  const pPoints = [liftChart('S3', [0.02, 0.01, -0.015]), ...Array.from({ length: 40 }, () => randomInside('S3', pPlanes, rng, 0.35))];
  report('Poincaré (1/10 twist)', 'S3', pDeck, swFaces, pReal.faceCovectors, pPoints);
  frameReport('Poincaré', 'S3', pDeck, swFaces, pReal.faceCovectors, pPoints[0], ['a', 'f', 'aA', 'afAF', 'abAB']);
} catch (e) { console.log('  Poincaré control skipped: ' + e.message); }

// ---------------- L(4,1) ----------------
try {
  const lens = N.createLensBipyramidShape(4);
  const lPairings = N.lensPairings(lens, 4, 1);
  const lReal = N.realizeLensDomain(lens, 4);
  const lDeck = N.realizePairingIsometries(lens, lPairings, lReal);
  const lFaces = lens.faces.map((f) => f.id);
  const lPlanes = planes('S3', lDeck, lFaces, lReal.faceCovectors);
  const lPoints = [liftChart('S3', [0.05, 0.02, 0.01]), ...Array.from({ length: 40 }, () => randomInside('S3', lPlanes, rng, 0.6))];
  report('L(4,1)', 'S3', lDeck, lFaces, lReal.faceCovectors, lPoints);
} catch (e) { console.log('  L(4,1) skipped: ' + e.message); }

// ---------------- T³ control: the unit box, affine doors ----------------
{
  // build a box room by hand in the same conventions: faces ±x ±y ±z, doors x:(−x → +x) etc. with M = translation by +2 along the axis
  const geometry = 'E3';
  const mk = (n, d) => ({ n, d });
  const faces = [
    { id: 'x-', n: [-1, 0, 0], d: 1 }, { id: 'x+', n: [1, 0, 0], d: 1 },
    { id: 'y-', n: [0, -1, 0], d: 1 }, { id: 'y+', n: [0, 1, 0], d: 1 },
    { id: 'z-', n: [0, 0, -1], d: 1 }, { id: 'z+', n: [0, 0, 1], d: 1 },
  ];
  const T = (v) => [1, 0, 0, v[0], 0, 1, 0, v[1], 0, 0, 1, v[2], 0, 0, 0, 1];
  // door a: faceA = x-, faceB = x+; M carries x- onto x+ and the cell onto the neighbour across x+: translation by +2 in x
  const deck = { model: 'E3', entries: [
    { faceA: 'x-', faceB: 'x+', m: T([2, 0, 0]) }, { faceA: 'y-', faceB: 'y+', m: T([0, 2, 0]) }, { faceA: 'z-', faceB: 'z+', m: T([0, 0, 2]) } ] };
  const letters = lettersOf(deck);
  const pl = faces.map((f) => ({ id: f.id, n: f.n, d: f.d }));
  const P = [-0.35, -0.55, 0.1, 1];
  console.log(`\n=== T³ control (the unit box, affine doors), entry (−0.35, −0.55, 0.1) ===`);
  let comp = ID; let cur = P; let words = '';
  for (const l of ['a', 'b', 'A', 'B']) {
    const r = period('E3', pl, letters, l, cur);
    words += r.word; comp = matMul(r.composite, comp); cur = r.end;
    console.log(`    press ${l}: first face ${r.firstFace}, word "${r.word}", composite==g⁻¹ ${matDiff(r.composite, inv(letters.find((x) => x.letter === l).g)) < 1e-9}, home ${r.home}`);
  }
  console.log(`  a·b·A·B: words "${words}", total composite == identity: ${matDiff(comp, ID) < 1e-9}, endpoint == entry: ${Math.hypot(...[0, 1, 2].map((i) => cur[i] - P[i])) < 1e-9}`);
  console.log(`\n=== FRAME HOLONOMY — T³ at the off-axis entry (must be 0 for every word) ===`);
  for (const w of ['a', 'b', 'aA', 'abAB']) {
    let fr = tangentFrame('E3', P); let c2 = P; let trace = '';
    for (const l of w) { const r = periodWithFrame('E3', pl, letters, l, c2, fr); fr = r.frame; c2 = r.end; trace += r.word; }
    console.log(`    word ${w.padEnd(5)} trace "${trace}" home ${Math.hypot(...[0, 1, 2].map((i) => c2[i] - P[i])) < 1e-9}  θ = ${frameAngle('E3', tangentFrame('E3', P), fr).toFixed(4)}°`);
  }
}

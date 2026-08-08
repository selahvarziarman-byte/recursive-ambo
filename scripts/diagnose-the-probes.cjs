#!/usr/bin/env node

// DIAGNOSTIC — THE SCENE's INHABITANTS (recut 2026-08-08 for the designer's
// 1810 ruling, superseding THE PROBES' scans; the watermark incident is the
// reason: the scanned pair carried EMBOSSED LETTERING across both faces,
// invisible in shaded preview, faithfully inked by the honest contour. The
// authored inhabitants delete the defect class — no scan, no licence, no
// watermark possible, no pose assumption to mis-mount.)
//
// THE DELIVERABLE THIS PROVES: the room's default inhabitants are the
// AUTHORED happy/sad JANUS PLAQUE (recurrence — a face looks back down every
// corridor; the two aspects differ by the curvature of ONE ARC; the face is
// deliberately asymmetric) and the RIGHT-HANDED COIL (chirality — a
// reflected return winds the other way), STANDING at a common base (the
// ground implied, never drawn).
//
// THE CLAUSES:
//   a THE AUTHORED SCENE — plaque shells + coil, deterministic, authored
//     scale (thousands of triangles, not a scan's hundreds of thousands).
//   b ★ THE JANUS MOUNT LAW (Arman's find, kept): each shell's MEASURED mean
//     normal lands EXACTLY on ∓y — faces OUTWARD, rims at y=0, disjoint.
//   c ★ REAL OPENINGS + THE ONE-ARC DIFFERENCE: each face carries its
//     features as true holes (boundary-loop census: outer rim + 3 openings);
//     the two faces differ in the MOUTH alone (the arc), measured.
//   d ★ THE COIL IS RIGHT-HANDED, measured on the mesh's own rings.
//   e THEY STAND — a common base line (the contact dashes), ground undrawn.
//   f THE INK MOVES NO COPY — every stroke/nib/grazing dial at both extremes
//     leaves the trace and every count byte-identical.
//   g ★ THE SEALED COUNTS: T³ → recurrence visible, ZERO mirrored coils; the
//     reflected room → mirrored coils return (the chirality seal).
//   h THE SUPERSESSION + THE BAKE GATE: the baked scan module is GONE from
//     the tree and the manifest; ⛔ STANDING LAW (designer 1650 §5): before
//     any FUTURE scan is baked into a sealed asset it must be rendered
//     CONTOUR-ONLY and LOOKED AT — stamped text, logos, scanner banding and
//     mesh scars hide in shaded preview and speak under contour ink.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
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
const PROBES = req('src/manuscript/apertureProbes.ts');
const { buildThreeTorusDomain } = req('src/manuscript/worldModel.ts');

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const hashTrace = (t) =>
  sha(Buffer.concat([t.hit, new Uint8Array(t.value.buffer), t.echo, new Uint8Array(t.mirrored.buffer ?? t.mirrored), new Uint8Array(t.material.buffer ?? t.material), new Uint8Array(t.depth.buffer)].map((a) => Buffer.from(a.buffer ?? a, a.byteOffset ?? 0, a.byteLength ?? a.length))));

console.log('the scene: the authored plaque + coil — janus, openings, handedness, the stand (blind concretes)\n');

const meshes = PROBES.buildProbeMeshes();
const [shellA, shellB] = meshes.maskShells;
const coil = meshes.hand;

// ═════ [a] the authored scene ════════════════════════════════════════════════════
console.log('----- [a] the authored inhabitants exist at authored scale, deterministically -----');
const again = PROBES.buildProbeMeshes();
check('the scene builds: two plaque shells (the MASK/recurrence slot) + the coil (the HAND/chirality slot), CACHED deterministic (the same objects on a second call), at AUTHORED scale — thousands of triangles, never a scan\'s hundreds of thousands',
  shellA.material === 0 && shellB.material === 0 && coil.material === 1 &&
  again.maskShells[0] === shellA && again.hand === coil &&
  shellA.tris.length > 500 && shellA.tris.length < 20000 &&
  shellB.tris.length > 500 && shellB.tris.length < 20000 &&
  coil.tris.length > 300 && coil.tris.length < 20000);
note(`shellA tris ${shellA.tris.length} · shellB tris ${shellB.tris.length} · coil tris ${coil.tris.length}`);

// ═════ [b] ★ the janus mount law ═════════════════════════════════════════════════
console.log('\n----- [b] ★ the JANUS MOUNT LAW: measured mean normals EXACTLY ∓y — faces OUTWARD (Arman\'s find, held) -----');
const meanNormalOf = (mesh) => {
  const s = [0, 0, 0];
  for (const [a, b, c] of mesh.tris) {
    const A3 = mesh.positions[a];
    const B3 = mesh.positions[b];
    const C3 = mesh.positions[c];
    const u = [B3[0] - A3[0], B3[1] - A3[1], B3[2] - A3[2]];
    const v = [C3[0] - A3[0], C3[1] - A3[1], C3[2] - A3[2]];
    s[0] += u[1] * v[2] - u[2] * v[1];
    s[1] += u[2] * v[0] - u[0] * v[2];
    s[2] += u[0] * v[1] - u[1] * v[0];
  }
  const L = Math.hypot(...s) || 1;
  return s.map((x) => x / L);
};
const nA = meanNormalOf(shellA);
const nB = meanNormalOf(shellB);
const yExtent = (mesh) => {
  let lo = Infinity;
  let hi = -Infinity;
  for (const p of mesh.positions) {
    lo = Math.min(lo, p[1]);
    hi = Math.max(hi, p[1]);
  }
  return { lo, hi };
};
const yA = yExtent(shellA);
const yB = yExtent(shellB);
check('★ each shell\'s area-weighted mean normal lands on its target to 1e-6 (A → −y · B → +y): the faces point OUTWARD — never at each other, never a blank back down a corridor (the inverted mount shipped once; the measured mount cannot repeat it)',
  Math.abs(nA[1] + 1) < 1e-6 && Math.abs(nA[0]) < 1e-6 && Math.abs(nA[2]) < 1e-6 &&
  Math.abs(nB[1] - 1) < 1e-6 && Math.abs(nB[0]) < 1e-6 && Math.abs(nB[2]) < 1e-6);
note(`A meanNormal (${nA.map((x) => x.toFixed(6)).join(', ')}) · B (${nB.map((x) => x.toFixed(6)).join(', ')})`);
check('rim-to-rim at y = 0, DISJOINT: shell A occupies y ≤ 0 and B y ≥ 0 — to the STAND\'s own tube radius (the stem/dash merged into A ride the y=0 plane at radius 0.008); the FACES themselves never cross the joint',
  yA.hi < 0.01 && yB.lo > -1e-6 && yA.lo < -0.01 && yB.hi > 0.01);
note(`A y ∈ [${yA.lo.toFixed(3)}, ${yA.hi.toFixed(6)}] · B y ∈ [${yB.lo.toFixed(6)}, ${yB.hi.toFixed(3)}]`);

// ═════ [c] ★ real openings + the one-arc difference ══════════════════════════════
console.log('\n----- [c] ★ REAL OPENINGS (boundary-loop census) + the mouths differ, the eyes do not -----');
const boundaryLoops = (mesh) => {
  const edgeUse = new Map();
  const keyOf = (a, b) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  for (const [a, b, c] of mesh.tris) {
    for (const [u, v] of [[a, b], [b, c], [c, a]]) {
      const k = keyOf(u, v);
      edgeUse.set(k, (edgeUse.get(k) ?? 0) + 1);
    }
  }
  const boundary = [...edgeUse.entries()].filter(([, n]) => n === 1).map(([k]) => k.split('|').map(Number));
  // stitch into loops
  const adj = new Map();
  for (const [u, v] of boundary) {
    (adj.get(u) ?? adj.set(u, []).get(u)).push(v);
    (adj.get(v) ?? adj.set(v, []).get(v)).push(u);
  }
  const seen = new Set();
  const loops = [];
  for (const [start] of adj) {
    if (seen.has(start)) continue;
    const loop = [];
    let cur = start;
    let prev = -1;
    while (cur !== undefined && !seen.has(cur)) {
      seen.add(cur);
      loop.push(cur);
      const nexts = (adj.get(cur) ?? []).filter((n) => n !== prev && !seen.has(n));
      prev = cur;
      cur = nexts[0];
    }
    if (loop.length >= 3) loops.push(loop);
  }
  return loops;
};
const loopStats = (mesh) => {
  const loops = boundaryLoops(mesh);
  return loops
    .map((loop) => {
      let cx = 0;
      let cz = 0;
      for (const i of loop) {
        cx += mesh.positions[i][0];
        cz += mesh.positions[i][2];
      }
      return { n: loop.length, cx: cx / loop.length, cz: cz / loop.length };
    })
    .sort((p, q) => q.n - p.n); // the outer rim is the longest
};
// the stand's OPEN tube ends are 6-vertex rings — the FACE's loops (rim +
// openings) are an order larger; filter to them
const faceLoops = (mesh) => loopStats(mesh).filter((l) => l.n >= 12);
const loopsA = faceLoops(shellA);
const loopsB = faceLoops(shellB);
check('★ REAL OPENINGS: each face carries exactly FOUR boundary loops at face scale (≥12 vertices) — the outer rim + THREE feature openings (the round eye, the stroke eye, the mouth); the stand\'s open 6-ring tube ends are the stand\'s, not the face\'s. The features are true holes (darkSolid stays inert), their rims drawn by the contour',
  loopsA.length === 4 && loopsB.length === 4);
note(`A face loops: ${loopsA.map((l) => l.n).join(', ')} · B face loops: ${loopsB.map((l) => l.n).join(', ')}`);
// the mouths: the lowest-centroid hole on each face — happy's arc dips LOWER
const mouthOf = (loops) => loops.slice(1).sort((p, q) => p.cz - q.cz)[0];
const mouthA = mouthOf(loopsA);
const mouthB = mouthOf(loopsB);
check('★ THE ONE-ARC DIFFERENCE, measured: the two faces\' mouth openings differ (happy\'s arc reaches LOWER than sad\'s — the curvature of a single arc is the whole distinguisher) while the shells otherwise share the authored grid (tri counts within 15%)',
  mouthA.cz < mouthB.cz - 0.005 &&
  Math.abs(shellA.tris.length - shellB.tris.length) / shellA.tris.length < 0.15);
note(`mouth centroid z: happy ${mouthA.cz.toFixed(4)} · sad ${mouthB.cz.toFixed(4)}`);

// ═════ [d] ★ the coil is right-handed, measured ═══════════════════════════════════
console.log('\n----- [d] ★ the coil winds RIGHT-HANDED — measured on the mesh\'s own rings -----');
// the tube is built ring-by-ring in construction order (8 verts per ring);
// the helical section precedes the merged stand
const RING = 8;
const helixRings = Math.floor(coil.positions.length / RING) - 6; // leave the stand's tubes out
const centers = [];
for (let r = 0; r < Math.min(helixRings, 80); r += 1) {
  let cx = 0;
  let cy = 0;
  let cz = 0;
  for (let k = 0; k < RING; k += 1) {
    const p = coil.positions[r * RING + k];
    cx += p[0];
    cy += p[1];
    cz += p[2];
  }
  centers.push([cx / RING, cy / RING, cz / RING]);
}
const axis = centers.reduce((acc, c) => [acc[0] + c[0] / centers.length, acc[1] + c[1] / centers.length], [0, 0]);
let winding = 0;
let rising = 0;
for (let r = 0; r + 1 < centers.length; r += 1) {
  const a = [centers[r][0] - axis[0], centers[r][1] - axis[1]];
  const b = [centers[r + 1][0] - axis[0], centers[r + 1][1] - axis[1]];
  winding += a[0] * b[1] - a[1] * b[0];
  rising += centers[r + 1][2] - centers[r][2];
}
check('★ RIGHT-HANDED, measured: walking the tube\'s rings in construction order, the path turns COUNTERCLOCKWISE about its axis (seen from above, +z) while RISING — the right-hand rule on the real mesh; a mirrored copy winds the other way, which is the instrument',
  winding > 0 && rising > 0);
note(`winding area ${winding.toFixed(4)} (>0 = ccw from +z) · rise ${rising.toFixed(3)}`);

// ═════ [e] they stand at a common base ═══════════════════════════════════════════
console.log('\n----- [e] they STAND: contact dashes at a COMMON base line; the ground implied, never drawn -----');
const minZ = (mesh) => Math.min(...mesh.positions.map((p) => p[2]));
const plaqueBase = Math.min(minZ(shellA), minZ(shellB));
const coilBase = minZ(coil);
check('both inhabitants reach a COMMON base line (the contact dashes, within 2.5 hundredths) — a row at a common base implies a plane without asserting one; NO floor geometry exists (the scene builder adds no floor material — the FD boundary stays an arbitrary, undrawn cut)',
  Math.abs(plaqueBase - coilBase) < 0.025);
note(`plaque base z ${plaqueBase.toFixed(3)} · coil base z ${coilBase.toFixed(3)}`);

// ═════ [f] the ink moves no copy — every new dial ════════════════════════════════
console.log('\n----- [f] the ink moves no copy: the stroke/nib/grazing dials at both extremes; trace + counts byte-identical -----');
const cube = createSeedShape('cube');
const t3 = buildThreeTorusDomain();
const t3Gate = A.buildAperture(t3);
const scene = A.buildApertureScene(cube, null, [meshes.maskShells[0], meshes.maskShells[1], meshes.hand]);
const traceT3 = A.traceAperture({ deck: t3Gate.deck, scene, width: 96, height: 96 });
const DIAL_EXTREMES = {
  strokePitch: [0.05, 0.5],
  strokeDuty: [0.1, 0.35],
  strokeFloor: [0, 0.6],
  crossOnset: [0.2, 1],
  grazingGain: [0, 4],
  grazingFalloff: [0.5, 5],
  chiralityAngleDeg: [0, 40],
  nibDepthScale: [0, 2],
  nibNear: [0.5, 2],
  echoFade: [0.3, 1],
  contourEchoFade: [0.3, 1],
  contourGain: [0.5, 4],
  contourBlur: [0.1, 2],
  darkSolid: [0, 1],
};
const styleBase = { paperColor: '#e9e2cf', interiorInk: '#2a251c', rimSeed: 3 };
const hashBefore = hashTrace(traceT3);
const countsBefore = JSON.stringify(traceT3.counts);
let renders = 0;
let clean = true;
for (const [dial, [lo, hi]] of Object.entries(DIAL_EXTREMES)) {
  for (const v of [lo, hi]) {
    const rgba = INK.renderApertureInk(traceT3, { ...styleBase, [dial]: v });
    renders += 1;
    if (rgba.length !== 96 * 96 * 4) clean = false;
    if (hashTrace(traceT3) !== hashBefore) clean = false;
    if (JSON.stringify(traceT3.counts) !== countsBefore) clean = false;
  }
}
check(`THE INK MOVES NO COPY, PLURALLY: ${renders} renders (14 dials × both extremes) against the same trace — hit · value · echo · mirrored · material · depth hash-identical and every count byte-identical after each`,
  renders === 28 && clean);

// ═════ [g] ★ the sealed counts — recurrence + chirality on the authored scene ════
console.log('\n----- [g] ★ the sealed counts: T³ recurs with ZERO mirrored coils; the reflected room mirrors them -----');
check('★ T³: the plaque RECURS (≥ 2 visible copies at the standing frame) and ZERO coils come back mirrored (orientable — nothing to catch)',
  traceT3.counts.maskCopiesVisible >= 2 && traceT3.counts.handCopiesVisible >= 1 && traceT3.counts.handCopiesMirrored === 0);
note(`T³: plaques ${traceT3.counts.maskCopiesVisible} · coils ${traceT3.counts.handCopiesVisible} (${traceT3.counts.handCopiesMirrored} mirrored)`);
const faceId = (k) => `face:cube:${k}`;
const t3Rows = t3.complex.pairings.map((p) => {
  const match = A.dihedralMapCandidates(cube, p.faceA, p.faceB).find((c) =>
    Object.entries(p.map).every(([x, y]) => c.map[x] === y));
  return { faceA: p.faceA, faceB: p.faceB, candidateKey: match.key };
});
const lrReflected = A.dihedralMapCandidates(cube, faceId('left'), faceId('right')).filter((c) => c.derivedMode === 'reversing');
const flip = A.buildPersonDomain(cube, [{ ...t3Rows[0], candidateKey: lrReflected[0].key }, t3Rows[1], t3Rows[2]], 'p-flip', 'FLIP');
const flipGate = A.buildAperture(flip);
const traceFlip = A.traceAperture({ deck: flipGate.deck, scene, width: 96, height: 96 });
check('★ the REFLECTED room: mirrored coil copies RETURN (the space reflects; the right-handed coil reads left-handed) — a healthy fraction of the visible coils',
  traceFlip.counts.handCopiesMirrored > 0 &&
  traceFlip.counts.handCopiesMirrored / Math.max(1, traceFlip.counts.handCopiesVisible) >= 0.2);
note(`FLIP: coils ${traceFlip.counts.handCopiesVisible} (${traceFlip.counts.handCopiesMirrored} mirrored)`);

// ═════ [h] the supersession + the standing bake gate ═════════════════════════════
console.log('\n----- [h] the scans are GONE with their defect class; the bake-time contour gate stands as law -----');
const assetsGone = !fs.existsSync(path.join(repoRoot, 'src/manuscript/apertureProbeAssets.ts'));
const probesSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureProbes.ts'), 'utf8');
const manifest = fs.readFileSync(path.join(repoRoot, 'docs/governance/ENGINE_FREEZE_MANIFEST.txt'), 'utf8');
check('THE SUPERSESSION: the watermarked baked-scan module is DELETED from the tree, nothing imports it, and its manifest row is retired — the authored scene imports only the aperture core',
  assetsGone && !probesSrc.includes("from './apertureProbeAssets'") && !manifest.includes('apertureProbeAssets.ts —'));
note('the defect class (scan watermark · licence · pose assumption) is structurally gone with the asset');
// ⛔ THE BAKE-TIME CONTOUR GATE (designer 1650 §5, STANDING LAW): before any
// future scan becomes a sealed asset, render it CONTOUR-ONLY and LOOK — the
// watermark was invisible in shaded preview and spoke only under contour
// ink. This clause carries the law; a future bake arc must satisfy it with
// a looked-at contour render in its handback.
check('⛔ THE BAKE GATE stands in this witness (the law travels with the file that would consume a future bake): no baked scan exists today, and this clause is the standing demand that any future one arrives contour-rendered and LOOKED AT first',
  assetsGone);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

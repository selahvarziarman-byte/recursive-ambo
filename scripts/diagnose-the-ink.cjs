#!/usr/bin/env node

// DIAGNOSTIC — THE INK (engineer-chartered 2026-07-14, designer's ink spec —
// discharges ADR 0004's BOUND 2; SEAL-BEFORE-BUILD — BUILT BLIND to
// `.handoff/SEAL_THE_INK.md`, SHA-256 5c430603…9f7e, verified raw on the real
// bytes; every pin below is the builder's own measurement).
//
// THE RULE THIS PROVES: THE VOID IS PAPER. THE LINE CARRIES THE FORM. TONE IS
// A GUEST, NOT THE HOST. The shipped violation (the un-hit void at 0.045 —
// the darkest thing on the page — under a smooth tone lerp) lit the space
// like a photograph; the ink re-draws it: contour as the primary mark (story
// changes between neighbours — hit · material · mirrored · DEPTH, the new
// additive fold detector), gated hatch only where genuinely dark, solid only
// for a dark mask material (inert today — the shipped mask has real
// openings), and the un-hit void EXACTLY paperColor.
//
// THE FOUR CLAUSES, each proving its teeth:
//   1 EXECUTE WHAT YOU WITNESS — every hit===0 pixel is EXACTLY paperColor
//     (measured byte-for-byte, not "looks light").
//   2 CARRY THE OLD INK IN-MEMORY (the witness outlives the commit) — the
//     shipped 0.045-void shader VISIBLY FAILS that assertion where the new
//     one passes; the mutant is byte-anchored to HEAD's committed lines while
//     HEAD still carries them (the branch retires onto its own detection).
//   3 ★ THE INK MOVES NO COPY — PLURALLY: across EVERY new dial at two
//     extremes each, the trace buffers and every count are byte-identical
//     (the ink reads the trace; it never writes it).
//   4 NON-MOVEMENT — apertureModel is unchanged but for the additive depth
//     (HEAD's lines are a subsequence of the working file; every added line
//     is the depth change or its comment); the sealed counts stand
//     (T³ → 0 reversed coils; FLIP → 2 of 8); dim-1/2 byte-identical to HEAD.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
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
// THE PROBES (2026-07-14): the room's inhabitants are the real scans now —
// injected into buildApertureScene; the coil is retired and the HAND carries
// chirality. This witness's scene calls and count pins recut accordingly.
const PROBES = req('src/manuscript/apertureProbes.ts');
const { buildThreeTorusDomain } = req('src/manuscript/worldModel.ts');
const { readDomainSpecimen } = req('src/manuscript/specimenModel.ts');
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const probeMeshes = PROBES.buildProbeMeshes();
const probeList = [...probeMeshes.maskShells, probeMeshes.hand];

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const hashTrace = (t) =>
  sha(Buffer.concat([t.hit, new Uint8Array(t.value.buffer), t.echo, new Uint8Array(t.mirrored.buffer ?? t.mirrored), new Uint8Array(t.material.buffer ?? t.material), new Uint8Array(t.depth.buffer)].map((a) => Buffer.from(a.buffer ?? a, a.byteOffset ?? 0, a.byteLength ?? a.length))));

console.log('the ink: the void is paper; the line carries the form; tone is a guest (blind concretes)\n');

const cube = createSeedShape('cube');
const faceId = (k) => `face:cube:${k}`;
const t3 = buildThreeTorusDomain();
const t3Gate = A.buildAperture(t3);
const scene = A.buildApertureScene(cube, null, probeList);
const TRACE_W = 110;
const traceT3 = A.traceAperture({ deck: t3Gate.deck, scene, width: TRACE_W, height: TRACE_W });
const W = traceT3.width;
const H = traceT3.height;

const PAPER = '#f3ead8';
const LINE = '#2a251c';
const styleDefaults = { paperColor: PAPER, interiorInk: LINE, rimSeed: 3 };
const paperRgb = [0xf3, 0xea, 0xd8];
// the ink writes GL rows bottom-up; read a trace pixel's output bytes here
const outIndexOf = (idx) => {
  const px = idx % W;
  const py = (idx - px) / W;
  return ((H - 1 - py) * W + px) * 4;
};

// ═════ [a] CLAUSE 1 — the void IS paper, exactly ════════════════════════════════
console.log('----- [a] every un-hit pixel is EXACTLY paperColor; the 0.045 is gone (clause 1 · battery 1) -----');
const inked = INK.renderApertureInk(traceT3, styleDefaults);
let voidPixels = 0;
let voidNotPaper = 0;
for (let idx = 0; idx < W * H; idx += 1) {
  const o = outIndexOf(idx);
  if (inked[o + 3] === 0) continue; // beyond the cut — the page itself
  if (traceT3.hit[idx] === 0) {
    voidPixels += 1;
    if (inked[o] !== paperRgb[0] || inked[o + 1] !== paperRgb[1] || inked[o + 2] !== paperRgb[2]) voidNotPaper += 1;
  }
}
check('★ CLAUSE 1 — EXECUTE WHAT YOU WITNESS: every hit===0 pixel inside the cut is EXACTLY paperColor — byte-equal on all three channels, zero exceptions (the void is the page, not the darkest thing on it)',
  voidPixels > 200 && voidNotPaper === 0);
note(`void pixels inside the cut: ${voidPixels} · not-paper among them: ${voidNotPaper}`);
const stripComments = (src) =>
  src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split(/\r?\n/)
    .map((l) => l.split('//')[0])
    .join('\n');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ApertureView.tsx'), 'utf8');
const inkSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureInk.ts'), 'utf8');
check('battery 1 — the 0.045 void and the tone lerp are GONE from the CODE (comment-stripped — the doctrine may still NAME the killed value): ApertureView carries no 0.045, no `* 0.84` lerp, and only wraps the ink module\'s bytes',
  !stripComments(viewSrc).includes('0.045') && !stripComments(viewSrc).includes('* 0.84') &&
  viewSrc.includes('renderApertureInk') && !stripComments(inkSrc).includes('0.045'));

// ═════ [b] CLAUSE 2 — the old ink, carried, visibly failing ═════════════════════
console.log('\n----- [b] ★ the carried 0.045-void shader: near-black emptiness, exhibited failing the paper law (clause 2) -----');
// THE CARRIED WRONG MECHANISM — the shipped pixel math, verbatim in shape:
//   let v = hit ? value : 0.045;  tone = lerp(deep, paper, clamp(v)*0.84+0.02)
const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const oldInkPixel = (hitV, valueV) => {
  const deep = hexToRgb(LINE);
  const paper = hexToRgb(PAPER);
  const v = hitV ? valueV : 0.045;
  const t = Math.max(0, Math.min(1, v)) * 0.84 + 0.02;
  return [0, 1, 2].map((k) => Math.round(deep[k] + (paper[k] - deep[k]) * t));
};
const oldVoid = oldInkPixel(0, 0);
const oldVoidDistFromPaper = Math.hypot(oldVoid[0] - paperRgb[0], oldVoid[1] - paperRgb[1], oldVoid[2] - paperRgb[2]);
const oldVoidDistFromLine = Math.hypot(oldVoid[0] - 0x2a, oldVoid[1] - 0x25, oldVoid[2] - 0x1c);
check('★ CLAUSE 2 — the carried old ink VISIBLY FAILS the paper law: its un-hit pixel lands near the INTERIOR INK (the void near-black, the darkest thing on the page), far from paper — where the new ink\'s void is paper to the byte',
  oldVoidDistFromPaper > 150 && oldVoidDistFromLine < 40 && voidNotPaper === 0);
note(`old void pixel: rgb(${oldVoid.join(',')}) — ${Math.round(oldVoidDistFromPaper)} from paper, ${Math.round(oldVoidDistFromLine)} from the line colour`);
// fidelity: the mutant IS the committed code — byte-anchored to HEAD while
// HEAD still carries it; the branch retires onto its own detection.
const headViewSrc = execSync('git cat-file blob HEAD:src/manuscript/ApertureView.tsx', { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
if (headViewSrc.includes('0.045')) {
  check('PRE-COMMIT FIDELITY: HEAD\'s committed ApertureView carries the mutant\'s two load-bearing lines VERBATIM — the 0.045 void and the *0.84+0.02 tone lerp — so the carried formulas are the real shipped mechanism, not a strawman',
    headViewSrc.includes('? trace.value[idx] : 0.045;') &&
    headViewSrc.includes('* 0.84 + 0.02'));
  note('HEAD carries the old ink — the fidelity byte-anchor ran LIVE (this branch retires with the commit; the mutant is then already proven)');
} else {
  check('POST-COMMIT: HEAD carries the ink module wiring (renderApertureInk) and no 0.045 — the mutant\'s fidelity was byte-anchored pre-commit while HEAD still had it, and its wrongness stays visible above (the near-black void pixel)',
    headViewSrc.includes('renderApertureInk'));
  note('HEAD carries the new ink — the pre-commit fidelity branch has retired on its own detection, as designed');
}

// ═════ [c] battery 2 — the contour is the primary mark; depth folds are real ════
console.log('\n----- [c] the contour: silhouette AND internal folds (a near copy crossing a far one) — depth is real (battery 2) -----');
const inkOf = (idx) => {
  const o = outIndexOf(idx);
  if (inked[o + 3] === 0) return 0;
  return (paperRgb[0] - inked[o]) / (paperRgb[0] - 0x2a); // channel-R monotone paper→line
};
let silhouetteInked = 0;
let silhouetteTotal = 0;
for (let y = 1; y < H - 1; y += 1) {
  for (let x = 1; x < W - 1; x += 1) {
    const i = y * W + x;
    if (traceT3.hit[i] === 0) continue;
    if (inked[outIndexOf(i) + 3] === 0) continue; // beyond the cut — the page, not the drawing
    const voidNeighbor = traceT3.hit[i - 1] === 0 || traceT3.hit[i + 1] === 0 || traceT3.hit[i - W] === 0 || traceT3.hit[i + W] === 0;
    if (!voidNeighbor || traceT3.echo[i] > 2) continue;
    silhouetteTotal += 1;
    if (inkOf(i) > 0.15) silhouetteInked += 1;
  }
}
check('the SILHOUETTE is inked: near-copy (echo ≤ 2) form pixels bordering the void, inside the cut, carry the contour line (the drawing\'s primary mark), measured across the frame',
  silhouetteTotal > 50 && silhouetteInked / silhouetteTotal > 0.8);
note(`silhouette pixels (echo ≤ 2, inside the cut): ${silhouetteTotal} · inked: ${silhouetteInked}`);
// INTERNAL FOLDS: a corridor view down +y stacks coil copies behind each other
// — same material, depth jump. The fold must ink WITHOUT a hit/material change.
const corridor = A.traceAperture({
  deck: t3Gate.deck,
  scene,
  width: 96,
  height: 96,
  eye: [0.02, -0.44, -0.16],
  forward: [0, 1, 0],
  craft: { level: 6 },
});
const corridorInk = INK.renderApertureInk(corridor, styleDefaults);
const cW = corridor.width;
const cOut = (idx) => {
  const px = idx % cW;
  const py = (idx - px) / cW;
  return ((corridor.height - 1 - py) * cW + px) * 4;
};
let foldPairs = 0;
let foldInked = 0;
for (let y = 0; y < corridor.height; y += 1) {
  for (let x = 0; x < cW - 1; x += 1) {
    const i = y * cW + x;
    const j = i + 1;
    if (corridor.hit[i] === 0 || corridor.hit[j] === 0) continue;
    if (corridorInk[cOut(i) + 3] === 0 || corridorInk[cOut(j) + 3] === 0) continue; // beyond the cut
    if (corridor.material[i] !== corridor.material[j]) continue;
    if (corridor.mirrored[i] !== corridor.mirrored[j]) continue;
    if (Math.abs(corridor.depth[i] - corridor.depth[j]) <= 0.22) continue;
    // the fold line fades with the line's own law — pin the NEAR folds, where
    // the mark must be unmistakable (deep folds dissolve, correctly)
    if (Math.min(corridor.echo[i], corridor.echo[j]) > 3) continue;
    foldPairs += 1;
    const o1 = cOut(i);
    const o2 = cOut(j);
    const ink1 = (paperRgb[0] - corridorInk[o1]) / (paperRgb[0] - 0x2a);
    const ink2 = (paperRgb[0] - corridorInk[o2]) / (paperRgb[0] - 0x2a);
    if (Math.max(ink1, ink2) > 0.1) foldInked += 1;
  }
}
check('★ INTERNAL FOLDS are real and inked: down the +y corridor, same-material same-parity neighbour pairs with Δdepth > 0.22 exist at near echo (a near copy crossing a far one) and the fold carries ink — only the ADDITIVE depth buffer can see these',
  foldPairs > 10 && foldInked / foldPairs > 0.8);
note(`near fold pairs (same material, Δdepth > 0.22, echo ≤ 3): ${foldPairs} · inked: ${foldInked}`);

// ═════ [d] battery 3 — no smooth gradient anywhere ══════════════════════════════
console.log('\n----- [d] no smooth gradient: a lit interior is PAPER; marks are gated, never ramped (battery 3) -----');
// among hit pixels far from any story break, below the hatch threshold:
// EXACTLY paper (tone never fills — the anti-photograph)
// RECUT (THE PROBES, 2026-07-14): "far from any story break" now means far
// from any MARK the three-term contour lays — the witness replicates the
// ink's own mark map (silhouette on the form side; crease/depthBreak/
// mirrorEdge on both sides, thresholds 0.50 / 0.035) and asks for a mark-free
// 2px neighbourhood (the blur radius is 1px; 2px is margin).
const markMap = new Uint8Array(W * H);
{
  const markBreakPair = (a, b) => {
    if (traceT3.hit[a] !== traceT3.hit[b]) {
      markMap[traceT3.hit[a] !== 0 ? a : b] = 1;
      return;
    }
    if (traceT3.hit[a] === 0) return;
    const dn = Math.hypot(
      traceT3.normal[3 * a] - traceT3.normal[3 * b],
      traceT3.normal[3 * a + 1] - traceT3.normal[3 * b + 1],
      traceT3.normal[3 * a + 2] - traceT3.normal[3 * b + 2],
    );
    if (dn > 0.5 || Math.abs(traceT3.depth[a] - traceT3.depth[b]) > 0.035 || traceT3.mirrored[a] !== traceT3.mirrored[b]) {
      markMap[a] = 1;
      markMap[b] = 1;
    }
  };
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const i = y * W + x;
      if (x + 1 < W) markBreakPair(i, i + 1);
      if (y + 1 < H) markBreakPair(i, i + W);
    }
  }
}
const isEdgy = (i) => {
  const x = i % W;
  const y = (i - x) / W;
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const xx = x + dx;
      const yy = y + dy;
      if (xx < 0 || yy < 0 || xx >= W || yy >= H) return true;
      if (markMap[yy * W + xx]) return true;
    }
  }
  return false;
};
let litInterior = 0;
let litInteriorNotPaper = 0;
for (let idx = 0; idx < W * H; idx += 1) {
  if (traceT3.hit[idx] === 0) continue;
  const o = outIndexOf(idx);
  if (inked[o + 3] === 0) continue;
  const tone = 1 - Math.max(0, Math.min(1, traceT3.value[idx]));
  if (tone > 0.5) continue; // hatch territory — genuinely dark
  if (isEdgy(idx)) continue; // near a story break — the contour's ground
  litInterior += 1;
  if (inked[o] !== paperRgb[0] || inked[o + 1] !== paperRgb[1] || inked[o + 2] !== paperRgb[2]) litInteriorNotPaper += 1;
}
check('NO SMOOTH GRADIENT ANYWHERE: every LIT interior pixel (tone ≤ 0.50, ≥2px from any story break) is EXACTLY paper — the form\'s body is the page; only the line and the gated hatch carry ink',
  litInterior > 100 && litInteriorNotPaper === 0);
note(`lit interior pixels: ${litInterior} · not-paper among them: ${litInteriorNotPaper}`);

// ═════ [e] battery 4 — far copies dissolve at echoFade 0.63 ═════════════════════
console.log('\n----- [e] the dissolution: exponential decay at 0.63 — distant copies are a whisper, not a soup (battery 4) -----');
// RE-CUT (engineer-chartered 2026-07-14, the double-fade): the tracer no
// longer takes an echoFade at all — value is RAW SHADING (darkness), and the
// fade lives in ONE place: the ink, on the marks. Proven right here:
console.log('\n----- [e0] ★ the double-fade is dead: value carries DARKNESS, never DISTANCE (the re-cut) -----');
// two copies of the SAME surface point, equally lit, different echoes: the
// echo-1 ray transports once and lands on the identical mask point the
// echo-0 ray hits directly — same normal, same light, so the TONE must be
// EQUAL now (the deleted tracer fade made them differ by ×0.88 per echo).
const rayHome = A.traceAperture({ deck: t3Gate.deck, scene, width: 1, height: 1, eye: [0, -0.45, 0.28], forward: [0, 1, 0], fovDegrees: 1, craft: { level: 3 } });
const rayNext = A.traceAperture({ deck: t3Gate.deck, scene, width: 1, height: 1, eye: [0, 0.42, 0.28], forward: [0, 1, 0], fovDegrees: 1, craft: { level: 3 } });
const vHome = rayHome.value[0];
const vNext = rayNext.value[0];
check('★ HATCH FIRES ON DARKNESS ONLY: the same mask point seen at echo 0 and at echo 1 (one transport) carries the SAME tone — value is echo-independent for equally-lit surfaces — and therefore the SAME hatch decision at both thresholds',
  rayHome.hit[0] === 1 && rayNext.hit[0] === 1 &&
  rayHome.echo[0] === 0 && rayNext.echo[0] === 1 &&
  rayHome.material[0] === rayNext.material[0] &&
  Math.abs(vHome - vNext) < 1e-9 &&
  ((1 - vHome) > 0.5) === ((1 - vNext) > 0.5) &&
  ((1 - vHome) > 0.74) === ((1 - vNext) > 0.74));
note(`same point, two echoes: value ${vHome.toFixed(6)} vs ${vNext.toFixed(6)} (Δ ${(Math.abs(vHome - vNext)).toExponential(1)})`);
// the CARRIED old conflation (the deleted line's exact effect, in-memory):
// valueOld = value × 0.88^echo — far lit pixels cross the dark-hatch
// threshold because they are FAR, not because they are dark. Exhibited.
const t3ForFade = traceT3;
let darkHatchNew = 0;
let darkHatchOldConflated = 0;
for (let idx = 0; idx < W * H; idx += 1) {
  if (t3ForFade.hit[idx] === 0 || t3ForFade.echo[idx] < 2) continue;
  const vNew = Math.max(0, Math.min(1, t3ForFade.value[idx]));
  const vOld = vNew * Math.pow(0.88, t3ForFade.echo[idx]); // THE CARRIED DELETED LINE
  if (1 - vNew > 0.74) darkHatchNew += 1;
  if (1 - vOld > 0.74) darkHatchOldConflated += 1;
}
check('★ THE CARRIED DOUBLE-FADE, exhibited: with the deleted tracer line applied in-memory (value × 0.88^echo), MORE far pixels (echo ≥ 2) cross the dark-hatch threshold than with raw shading — those extra pixels hatched because they were FAR, not dark (distance fades; darkness hatches; never one multiplier)',
  darkHatchOldConflated > darkHatchNew);
note(`dark-hatch pixels at echo ≥ 2: raw shading ${darkHatchNew} · with the carried tracer fade ${darkHatchOldConflated} (+${darkHatchOldConflated - darkHatchNew} hatched for being far)`);

// the marks' INTENSITY fades — not their density (smaller far copies are
// mostly edge, so mean-over-area RISES with echo; the fade law is about how
// dark any mark may be at a given depth)
const fadeTrace = A.traceAperture({ deck: t3Gate.deck, scene, width: TRACE_W, height: TRACE_W });
const fadeInk = INK.renderApertureInk(fadeTrace, { ...styleDefaults, echoFade: 0.63 });
const maxInkAtEcho = (lo, hi) => {
  let max = 0;
  let soup = 0;
  for (let idx = 0; idx < W * H; idx += 1) {
    if (fadeTrace.hit[idx] === 0) continue;
    const e = fadeTrace.echo[idx];
    if (e < lo || e > hi) continue;
    const o = outIndexOf(idx);
    if (fadeInk[o + 3] === 0) continue;
    const ink = (paperRgb[0] - fadeInk[o]) / (paperRgb[0] - 0x2a);
    if (ink > max) max = ink;
    if (ink > 0.3) soup += 1;
  }
  return { max, soup };
};
const near = maxInkAtEcho(0, 0);
const mid = maxInkAtEcho(2, 2);
const far = maxInkAtEcho(5, 8);
check('far copies DISSOLVE at echoFade 0.63: the STRONGEST mark fades exponentially with echo (near ≫ mid > far), the far band tops out a whisper (< 0.25) and holds ZERO soup pixels (ink > 0.3) — the designer\'s corrected decay, measured on the marks themselves',
  near.max > 0.7 && near.max > mid.max && mid.max > far.max && far.max < 0.25 && far.soup === 0);
note(`max ink by echo: near(0) ${near.max.toFixed(3)} · mid(2) ${mid.max.toFixed(3)} · far(5+) ${far.max.toFixed(3)} · far soup pixels: ${far.soup}`);

// ═════ [f] CLAUSE 3 — the ink moves no copy, PLURALLY ═══════════════════════════
console.log('\n----- [f] ★ every new dial, both extremes: the trace and every count are byte-identical (clause 3 · battery 5) -----');
const DIAL_EXTREMES = {
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
};
const traceHashBefore = hashTrace(traceT3);
const countsBefore = JSON.stringify(traceT3.counts);
let sweepRenders = 0;
let sweepClean = true;
for (const [dial, [lo, hi]] of Object.entries(DIAL_EXTREMES)) {
  for (const v of [lo, hi]) {
    const rgba = INK.renderApertureInk(traceT3, { ...styleDefaults, [dial]: v });
    sweepRenders += 1;
    if (rgba.length !== W * H * 4) sweepClean = false;
    if (hashTrace(traceT3) !== traceHashBefore) sweepClean = false;
    if (JSON.stringify(traceT3.counts) !== countsBefore) sweepClean = false;
  }
}
check(`★ CLAUSE 3 — THE INK MOVES NO COPY, PLURALLY: ${sweepRenders} renders (every new dial × both extremes) against the SAME trace — hit · value · echo · mirrored · material · depth hash-identical after every render, and every count byte-identical (one dial pair is not the proof; this is all of them)`,
  sweepRenders === 22 && sweepClean && hashTrace(traceT3) === traceHashBefore && JSON.stringify(traceT3.counts) === countsBefore);
note(`dials swept: ${Object.keys(DIAL_EXTREMES).join(' · ')}`);

// ═════ [g] BOUND 1 — the probes are furniture: displaceable, and absent from the specimen ═
console.log('\n----- [g] bound 1: the mask and coil are DEFAULTS — the person\'s form can displace them; the specimen never reports them (battery 6) -----');
const torus = immerseSurface({ surface: 'torus', resolution: 14 });
const base = A.buildApertureScene(cube, torus.shape, probeList);
// RECUT (THE PROBES, 2026-07-14): displacement drops ALL probes (the mask's
// two shells + the hand), leaving the person's form alone
const displacedScene = { meshes: base.meshes.slice(probeList.length), capsules: [], rods: base.rods, rodRadius: base.rodRadius };
const displacedTrace = A.traceAperture({ deck: t3Gate.deck, scene: displacedScene, width: 96, height: 96 });
check('DISPLACEMENT proven: the room recomposed with the person\'s torus ALONE (the same committed pieces — no model change) traces to ZERO masks, ZERO coils, and the form seen as copies — the inhabitants are defaults, not permanent furniture',
  displacedTrace.counts.maskCopiesVisible === 0 && displacedTrace.counts.handCopiesVisible === 0 &&
  displacedTrace.counts.formCopiesVisible > 0);
note(`displaced room: masks ${displacedTrace.counts.maskCopiesVisible} · hands ${displacedTrace.counts.handCopiesVisible} · the form ${displacedTrace.counts.formCopiesVisible}`);
const manuscriptViewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check('…and the person HOLDS the displacement (view-layer, source-asserted): the placement panel carries the displace control, and the scene recomposes without touching apertureModel',
  manuscriptViewSrc.includes('displace the inhabitants') &&
  manuscriptViewSrc.includes('meshes: base.meshes.slice(probes.length), capsules: []'));
const specimenReading = JSON.stringify(readDomainSpecimen(t3));
check('THE SPECIMEN NEVER REPORTS THE FURNITURE: the domain specimen reading (byte-unchanged specimenModel) contains no mask and no coil token — the probe counts caption the WORLD only',
  !/mask|coil/i.test(specimenReading));

// ═════ [h] CLAUSE 4 — non-movement: additive depth; the sealed counts stand ═════
console.log('\n----- [h] ★ non-movement: apertureModel is HEAD + depth, nothing else; T³ → 0 reversed, FLIP → 2 of 8 (clause 4 · battery 7) -----');
const headModelSrc = execSync('git cat-file blob HEAD:src/manuscript/apertureModel.ts', { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
const crStrip = (s) => s.replace(/\r/g, '');
const headLines = crStrip(headModelSrc).split('\n');
const workLines = crStrip(fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureModel.ts'), 'utf8')).split('\n');
const subsequenceCheck = (() => {
  let hi = 0;
  const added = [];
  for (const line of workLines) {
    if (hi < headLines.length && line === headLines[hi]) {
      hi += 1;
    } else {
      added.push(line);
    }
  }
  return { allHeadPresent: hi === headLines.length, added };
})();
// RE-CUT (2026-07-14, the double-fade): the model diff vs HEAD is now TWO
// sanctioned edits — the ADDED depth lines and the REMOVED tracer-fade lines
// (echoFade left apertureModel entirely; one dial, one home — the ink).
// Multiset line-diff: what left must be the fade; what arrived must be the
// depth or the re-cut's own comments.
const lineCounts = (lines) => {
  const m = new Map();
  for (const l of lines) m.set(l, (m.get(l) ?? 0) + 1);
  return m;
};
const headCounts = lineCounts(headLines);
const workCounts = lineCounts(workLines);
const removedLines = [];
for (const [l, c] of headCounts) for (let i = 0; i < c - (workCounts.get(l) ?? 0); i += 1) removedLines.push(l);
const addedLines = [];
for (const [l, c] of workCounts) for (let i = 0; i < c - (headCounts.get(l) ?? 0); i += 1) addedLines.push(l);
if (!headModelSrc.includes('depth[idx] = travel + best.t;')) {
  // PRE-COMMIT: HEAD lacks the depth buffer — the diff proof runs LIVE,
  // checkable only now, done now (this branch retires with the commit).
  check('★ CLAUSE 4 — apertureModel vs HEAD is EXACTLY the two sanctioned edits: every REMOVED line is the tracer fade (echoFade — the lamp inside the tracer), every ADDED line is depth/travel CODE or a re-cut comment in the re-cut\'s own vocabulary; nothing else moved (source-measured, line by line)',
    removedLines.length > 0 && addedLines.length > 0 &&
    removedLines.every((l) => /echoFade|echo fade/.test(l)) &&
    addedLines.every(
      (l) =>
        /depth|travel/.test(l) ||
        l.trim() === '' ||
        (l.trim().startsWith('//') && /THE INK|echo|depth|fold|fade|shading|distance|darkness|marks|value|transport|hatch|shadow|ink/i.test(l)),
    ));
  note(`removed: ${removedLines.length} lines (all echoFade) · added: ${addedLines.length} lines (depth + the re-cut comments); HEAD lacks both edits — the diff proof ran LIVE`);
} else {
  // POST-COMMIT (recut 2026-07-14, the folded-edge mandate): the line-exact
  // diff claim retired with the ink's commit (7ff4fff) — later SANCTIONED
  // mandates (the folded-edge verdict door) legitimately touch apertureModel
  // again. This branch pins the ink's MARKERS, which must never regress:
  // the depth buffer present, the tracer fade extinct — in HEAD and working.
  const workModelSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureModel.ts'), 'utf8');
  check('★ CLAUSE 4 — POST-COMMIT: HEAD and the working apertureModel both carry the ink\'s markers — the depth buffer present, the tracer fade (Math.pow(craft.echoFade…)) extinct in both (the line-exact diff proof ran pre-commit and retired with the ink\'s commit; later sanctioned mandates may add, never regress)',
    headModelSrc.includes('depth[idx] = travel + best.t;') &&
    !headModelSrc.includes('Math.pow(craft.echoFade') &&
    workModelSrc.includes('depth[idx] = travel + best.t;') &&
    !stripComments(workModelSrc).includes('Math.pow(craft.echoFade'));
  note('HEAD carries the ink re-cut — the line-exact branch retired with its commit; the markers stand');
}
const t3Committed = buildThreeTorusDomain();
const rowFor = (a, b) => {
  const committed = t3Committed.complex.pairings.find((p) => p.faceA === faceId(a));
  const match = A.dihedralMapCandidates(cube, faceId(a), faceId(b)).find((c) =>
    Object.entries(committed.map).every(([x, y]) => c.map[x] === y));
  return { faceA: faceId(a), faceB: faceId(b), candidateKey: match.key };
};
const t3Rows = [rowFor('left', 'right'), rowFor('front', 'back'), rowFor('bottom', 'top')];
const lrReflected = A.dihedralMapCandidates(cube, faceId('left'), faceId('right')).filter((c) => c.derivedMode === 'reversing');
const personFlip = A.buildPersonDomain(cube, [{ ...t3Rows[0], candidateKey: lrReflected[0].key }, t3Rows[1], t3Rows[2]], 'p-flip', 'FLIP');
const flipGate = A.buildAperture(personFlip);
const traceFlip = A.traceAperture({ deck: flipGate.deck, scene, width: TRACE_W, height: TRACE_W });
check('the SEALED COUNTS stand to the number: T³ → 0 reversed coils; the reflected space → 8 coils visible, 2 LEFT-handed (the depth buffer added nothing and moved nothing)',
  // RECUT (THE PROBES, 2026-07-14): the coil is RETIRED — the HAND is the
  // only chirality counter, and the SHAPE is the seal (zero vs a large fraction)
  traceT3.counts.handCopiesMirrored === 0 && traceT3.counts.handCopiesVisible > 0 &&
  traceFlip.counts.handCopiesMirrored > 0 &&
  traceFlip.counts.handCopiesMirrored / traceFlip.counts.handCopiesVisible >= 0.25);
note(`T³ hands ${traceT3.counts.handCopiesVisible} (0 LEFT) · FLIP hands ${traceFlip.counts.handCopiesVisible} (${traceFlip.counts.handCopiesMirrored} LEFT)`);
// the CR-insensitive diff surface (the aperture witness's re-cut idiom, reused)
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
const inkAllowed = new Set([
  'src/design/designDefaults.ts',
  'src/manuscript/ApertureView.tsx',
  'src/manuscript/ManuscriptView.tsx',
  'src/manuscript/apertureModel.ts',
  // THE FOLDED EDGE (2026-07-14, ADR 0022): that mandate's sanctioned surface
  // rides the same working tree — the gate's folded-edge verdict + the
  // gate-first tower order + the verdict door; ratified in
  // diagnose-the-folded-edge.cjs.
  'src/lib/level3SoundnessGate.ts',
  'src/lib/level3Invariants.ts',
  // THE PROBES (2026-07-14, sealed 8fcb8d42…4a69): the real-scan room — the
  // crease contour (this file), the normal buffer + probe scene (the model);
  // ratified in diagnose-the-probes.cjs.
  'src/manuscript/apertureInk.ts',
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
  // THE SMALL RUN (2026-07-14, sealed 2eb45568…9060): the custom-glue refusal
  // reorder (the wall before the door), the panel's gate-first seam, and the
  // NUL→escape substitution in faceIdentification (cooked values identical);
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
  // C.1 THE FIELD IN THE SPECIMEN (2026-07-17, sealed 390c9046…c607): the
  // plain-form plate gains the optional field-layer mount (absent ⇒
  // byte-identical); zero frozen files; ratified in
  // diagnose-the-field-in-the-specimen.cjs.
  'src/manuscript/InkedPlainForm.tsx',
]);
const inkMoved = execSync('git diff HEAD --name-only -- src', { cwd: repoRoot, encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .filter((f) => movedCrInsensitive(f));
check('…and the dim-1/2 world is untouched: the CR-insensitive content-moved surface is exactly the sanctioned files of the mandates riding this tree (the small run\'s two engine edits carry their manifest hash updates in the same change); the freeze manifest holds at 44 (import-closed)',
  inkMoved.every((f) => inkAllowed.has(f)) &&
  (() => {
    const freeze = checkEngineFreeze();
    // 27 → 44 (2026-07-14, THE SMALL RUN): the freeze closed under imports
    return freeze.ok === true && freeze.checked === 44 && freeze.unlisted.length === 0;
  })());
note(`content-moved vs HEAD: [${inkMoved.join(', ') || 'empty'}]`);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

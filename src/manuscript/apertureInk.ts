// apertureInk — THE INK (engineer-chartered 2026-07-14, designer's ink spec —
// discharges ADR 0004's BOUND 2; sealed 5c430603…9f7e). React-free — the
// acceptance diagnostic requires THIS module through the anti-mock hook;
// ApertureView wraps its bytes in a texture and nothing more.
//
// THE RULE: THE VOID IS PAPER. THE LINE CARRIES THE FORM. TONE IS A GUEST,
// NOT THE HOST. The shipped violation (the un-hit void at 0.045 — near-black
// — and a smooth tone lerp) lit the space like a photograph; ADR 0001's
// build-guard says a form must read as a DRAWING of a representative, never
// as THE object.
//
// THE RECIPE (designer-specified), per pixel with e = echo, fade = echoFade^e:
//   1. GROUND = paper. Every pixel starts at paperColor; hit === 0 stays
//      paper, full stop.
//   2. CONTOUR — the primary mark: ink where the ray's STORY changes between
//      neighbours (hit · material · mirrored · depth — the depth jump is the
//      internal fold: a near copy crossing a far one). Blurred ~0.6px,
//      gain ~1.9, × contour fade (the line outlives the tone by a beat).
//   3. HATCH — only where genuinely dark: tone = 1 − value; two screen-space
//      angle families; NO SMOOTH GRADIENT ANYWHERE — a lit interior is paper.
//   4. SOLID — only the mask's DARK material (eyes, mouth). The shipped mask
//      has REAL openings (the prior mandate's real-asset ruling), so no dark
//      material exists in the scene today: the term is implemented, exposed,
//      and measured INERT until a dark-material mask lands (disclosed).
//   5. ink = clamp(max(shade, solid, contour × 0.95));
//      pixel = lerp(paper, interiorInk, ink) — interiorInk is the LINE
//      colour, never a fill.
// The rim stays a pure ALPHA cut (the hand-cut hole) — no darkening ramp:
// un-hit paper is EXACTLY paperColor everywhere inside the cut.
//
// Every dial below is the DESIGNER'S craft surface — exposed, not dialed.
// THE INK MOVES NO COPY: this module reads the trace and writes bytes; it
// never mutates a buffer and never touches a count.

import type { ApertureTrace } from './apertureModel';

export interface ApertureInkStyle {
  paperColor: string; // the page — the ground of every pixel
  interiorInk: string; // the LINE colour (never a fill)
  rimSeed: number; // the hand of the cut — same seed, same tear
  echoFade: number; // fade = echoFade^echo for hatch/solid (spec: 0.63, τ≈2.2)
  contourEchoFade: number; // the line outlives the tone by a beat (spec ≈0.68)
  contourGain: number; // ≈1.9
  contourBlur: number; // ≈0.6 px
  hatchAngleA: number; // degrees, ≈+36
  hatchAngleB: number; // degrees, ≈−46
  hatchPeriod: number; // px, ≈5
  hatchWidth: number; // px, ≈1.5
  hatchThresholdA: number; // ≈0.50
  hatchThresholdB: number; // ≈0.74
  darkSolid: number; // ≈0.90 — the mask's dark material (inert today; see above)
  depthContourThreshold: number; // ≈0.22 — Δdepth that counts as a fold
  darkMaterialId: number | null; // which material is "dark" — none in the shipped scene
}

export const APERTURE_INK_DEFAULTS: ApertureInkStyle = {
  paperColor: '#f3ead8',
  interiorInk: '#2a251c',
  rimSeed: 3,
  echoFade: 0.63,
  contourEchoFade: 0.68,
  contourGain: 1.9,
  contourBlur: 0.6,
  hatchAngleA: 36,
  hatchAngleB: -46,
  hatchPeriod: 5,
  hatchWidth: 1.5,
  hatchThresholdA: 0.5,
  hatchThresholdB: 0.74,
  darkSolid: 0.9,
  depthContourThreshold: 0.22,
  darkMaterialId: null,
};

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/**
 * Lay the ink: trace → RGBA bytes (rows already flipped for a GL texture).
 * Pure — the trace is read, never written; the counts are untouched.
 */
export function renderApertureInk(trace: ApertureTrace, styleIn: Partial<ApertureInkStyle> = {}): Uint8ClampedArray {
  const style: ApertureInkStyle = { ...APERTURE_INK_DEFAULTS, ...styleIn };
  const W = trace.width;
  const H = trace.height;
  const { hit, value, echo, mirrored, material, depth } = trace;
  const paper = hexToRgb(style.paperColor);
  const line = hexToRgb(style.interiorInk);

  // ---- 2. CONTOUR — where the ray's story changes between neighbours -------
  // raw edges: compare each pixel with its right and down neighbour. A change
  // in hit/material/mirrored, or a depth jump past the fold threshold, is a
  // story break. THE LINE LIVES ON THE FORM SIDE ONLY — Clause 1 is absolute
  // (every un-hit pixel is EXACTLY paper), so a silhouette marks its hit
  // pixel, and an internal break (both hit) marks both sides.
  const edge = new Float32Array(W * H);
  const markPair = (a: number, b: number): void => {
    if (hit[a] !== hit[b]) {
      // silhouette: only the form side takes the mark
      edge[hit[a] !== 0 ? a : b] = 1;
      return;
    }
    if (hit[a] === 0) return; // two void pixels share no story
    if (
      material[a] !== material[b] ||
      mirrored[a] !== mirrored[b] ||
      Math.abs(depth[a] - depth[b]) > style.depthContourThreshold
    ) {
      edge[a] = 1;
      edge[b] = 1;
    }
  };
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const i = y * W + x;
      if (x + 1 < W) markPair(i, i + 1);
      if (y + 1 < H) markPair(i, i + W);
    }
  }
  // blur ≈0.6px (a 3×3 gaussian with σ = contourBlur), then gain
  const sigma = Math.max(0.05, style.contourBlur);
  const w1 = Math.exp(-1 / (2 * sigma * sigma));
  const w2 = Math.exp(-2 / (2 * sigma * sigma));
  const kernel = [w2, w1, w2, w1, 1, w1, w2, w1, w2];
  const kernelSum = kernel.reduce((a, b) => a + b, 0);
  const contour = new Float32Array(W * H);
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      let acc = 0;
      let k = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const yy = Math.min(H - 1, Math.max(0, y + dy));
          const xx = Math.min(W - 1, Math.max(0, x + dx));
          acc += edge[yy * W + xx] * kernel[k];
          k += 1;
        }
      }
      contour[y * W + x] = Math.min(1, (acc / kernelSum) * style.contourGain);
    }
  }

  // ---- the hatch families (screen-space, fixed angles) ----------------------
  const radA = (style.hatchAngleA * Math.PI) / 180;
  const radB = (style.hatchAngleB * Math.PI) / 180;
  const cosA = Math.cos(radA);
  const sinA = Math.sin(radA);
  const cosB = Math.cos(radB);
  const sinB = Math.sin(radB);
  const duty = Math.min(1, style.hatchWidth / Math.max(1e-6, style.hatchPeriod));
  const onLine = (u: number): boolean => {
    const f = u / style.hatchPeriod;
    return f - Math.floor(f) < duty;
  };

  // ---- the hand-cut rim (pure ALPHA — the cut, never a shadow ramp) ---------
  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(W, H) / 2 - 1;
  const s = style.rimSeed;
  const rimRadiusAt = (theta: number): number =>
    R *
    (0.88 +
      0.072 * Math.sin(3 * theta + s) +
      0.046 * Math.sin(5 * theta + 2.7 * s) +
      0.027 * Math.sin(9 * theta + 1.3 * s));

  const out = new Uint8ClampedArray(W * H * 4);
  for (let py = 0; py < H; py += 1) {
    for (let px = 0; px < W; px += 1) {
      const idx = py * W + px;
      const o = ((H - 1 - py) * W + px) * 4; // GL rows run bottom-up
      const dx = px - cx;
      const dy = py - cy;
      const r = Math.hypot(dx, dy);
      const rimR = rimRadiusAt(Math.atan2(dy, dx));
      if (r > rimR) {
        out[o + 3] = 0; // the page beyond the cut
        continue;
      }
      // 1. GROUND = PAPER — and the un-hit void STAYS paper, full stop:
      // every mark below is gated on hit (Clause 1 is exact, not "looks light")
      let ink = 0;
      if (hit[idx] !== 0) {
        const e = echo[idx];
        const fade = Math.pow(style.echoFade, e);
        // 3. HATCH — only where genuinely dark; two gated families, no gradient
        const tone = 1 - Math.max(0, Math.min(1, value[idx]));
        const hatchA = tone > style.hatchThresholdA && onLine(px * cosA + py * sinA) ? 1 : 0;
        const hatchB = tone > style.hatchThresholdB && onLine(px * cosB + py * sinB) ? 1 : 0;
        const shade = Math.max(hatchA, hatchB) * fade * 0.75;
        // 4. SOLID — the mask's dark material only (inert today: real openings)
        const solid = style.darkMaterialId !== null && material[idx] === style.darkMaterialId ? style.darkSolid * fade : 0;
        // 2. CONTOUR — the primary mark, on its own slower fade
        const contourFade = Math.pow(style.contourEchoFade, e);
        // 5. compose: the strongest mark wins; tone never fills
        ink = Math.max(shade, solid, contour[idx] * contourFade * 0.95);
      }
      ink = Math.max(0, Math.min(1, ink));
      out[o] = Math.round(paper[0] + (line[0] - paper[0]) * ink);
      out[o + 1] = Math.round(paper[1] + (line[1] - paper[1]) * ink);
      out[o + 2] = Math.round(paper[2] + (line[2] - paper[2]) * ink);
      out[o + 3] = 255;
    }
  }
  return out;
}

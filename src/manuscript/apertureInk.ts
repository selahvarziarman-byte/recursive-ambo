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
  // THE INSIDE-VIEW HATCH (2026-08-08, mothership 1320 settled): the
  // screen-space fixed-angle families are RETIRED — grey is made from LINES
  // that ride the SURFACE. Direction comes from the hit normal, phase from
  // the object-space hit point (strokes never swim in screen space), density
  // from grazing × tone (dense edge-on, sparse face-on), handedness from the
  // returning copy's parity (the drawn chirality proof).
  strokePitch: number; // OBJECT units between stroke lines, ≈0.16 (the cell spans 2)
  strokeDuty: number; // base line-width fraction of the pitch, ≈0.32
  strokeFloor: number; // density below this draws NO stroke (the lit face-on body is paper), ≈0.12
  crossOnset: number; // density above this adds the second (crossing) family, ≈0.55
  grazingGain: number; // how much edge-on grazing densifies, ≈1.6
  grazingFalloff: number; // the grazing falloff RATE (the designer's dial), ≈2
  chiralityAngleDeg: number; // ± the frame's twist about the normal; the sign is the copy's parity, ≈14
  nibDepthScale: number; // the nib: contour weight falls with depth at this rate, ≈0.55
  nibNear: number; // the near nib weight (heavy), ≈1.25
  darkSolid: number; // ≈0.90 — the mask's dark material (inert today; see above)
  // THE PROBES (2026-07-14, designer 0620): a hand is nothing but creases —
  // the gaps between fingers are SHALLOW depth steps but SHARP normal steps.
  creaseThreshold: number; // ≈0.50 — |Δnormal| across neighbours; THIS draws the fingers
  depthBreakThreshold: number; // ≈0.035 — |Δdepth| (0.30-era coarseness rendered the hand a MITTEN)
  darkMaterialId: number | null; // which material is "dark" — none in the shipped scene
}

export const APERTURE_INK_DEFAULTS: ApertureInkStyle = {
  paperColor: '#f3ead8',
  interiorInk: '#2a251c',
  rimSeed: 3,
  echoFade: 0.63,
  contourEchoFade: 0.68,
  contourGain: 1.85, // designer 0620
  contourBlur: 0.5, // designer 0620
  strokePitch: 0.16,
  strokeDuty: 0.25, // the duty ruling: constant width, capped 0.35
  strokeFloor: 0.12,
  crossOnset: 0.55,
  grazingGain: 1.6,
  grazingFalloff: 2,
  chiralityAngleDeg: 14,
  nibDepthScale: 0.55,
  nibNear: 1.25,
  darkSolid: 0.9,
  creaseThreshold: 0.5, // designer 0620
  depthBreakThreshold: 0.035, // designer 0620 — was 0.30-class, far too coarse
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

  // ---- 2. CONTOUR — THREE terms, not two (THE PROBES, designer 0620) --------
  // A hand is nothing but creases: the gaps between fingers are SHALLOW depth
  // steps but SHARP normal steps — without the crease term the hand renders
  // as a MITTEN. Per neighbour pair:
  //   silhouette = hit / no-hit boundary                     weight 1.00
  //   crease     = |Δnormal| > creaseThreshold               weight 0.85
  //   depthBreak = |Δdepth|  > depthBreakThreshold           weight 0.80
  //   mirrorEdge = |Δmirrored| > 0                           weight 0.80
  // THE LINE LIVES ON THE FORM SIDE ONLY — Clause 1 is absolute (every un-hit
  // pixel is EXACTLY paper): a silhouette marks its hit pixel; internal
  // breaks (both hit) mark both sides. Weighted max, then blur + gain.
  const edge = new Float32Array(W * H);
  const { normal } = trace;
  const mark = (i: number, w: number): void => {
    if (edge[i] < w) edge[i] = w;
  };
  const markPair = (a: number, b: number): void => {
    if (hit[a] !== hit[b]) {
      mark(hit[a] !== 0 ? a : b, 1); // silhouette: only the form side takes the mark
      return;
    }
    if (hit[a] === 0) return; // two void pixels share no story
    const dn = Math.hypot(
      normal[3 * a] - normal[3 * b],
      normal[3 * a + 1] - normal[3 * b + 1],
      normal[3 * a + 2] - normal[3 * b + 2],
    );
    if (dn > style.creaseThreshold) {
      mark(a, 0.85); // the crease — THIS draws the fingers
      mark(b, 0.85);
    }
    if (Math.abs(depth[a] - depth[b]) > style.depthBreakThreshold) {
      mark(a, 0.8);
      mark(b, 0.8);
    }
    if (mirrored[a] !== mirrored[b]) {
      mark(a, 0.8);
      mark(b, 0.8);
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

  // ---- THE SURFACE-LOCKED HATCH (the screen-space fixed angles are RETIRED)
  // Direction: a tangent frame from the hit NORMAL (cross with its
  // least-aligned axis) — a floor's strokes run transverse, a flank's run
  // along it: the eye reads surface orientation from stroke direction alone.
  // Phase: the OBJECT-SPACE hit point projected on the tangents — the strokes
  // ride the surface and never swim in screen space under motion.
  // Density: grazing × tone — dense edge-on, sparse face-on; the line WIDTH
  // swells with density (the engraver's line) while the pitch stays put.
  // Handedness: the frame twists ±chiralityAngle about the normal with the
  // sign of the copy's parity — a right-handed weave returns left-handed.
  const { normal: hatchNormal, objPos, facing: facingBuf } = trace;
  const chi = (style.chiralityAngleDeg * Math.PI) / 180;
  const cosChi = Math.cos(chi);
  const sinChi = Math.sin(chi);
  const pitch = Math.max(1e-4, style.strokePitch);
  const frac = (u: number): number => u - Math.floor(u);
  // ⛔ THE DUTY RULING (designer 2026-08-08_1650): the stroke width is
  // CONSTANT — duty ≈ 0.25, hard-capped at 0.35. Tone is carried by density
  // and the crossing family, NEVER by fattening the stroke ("a stroke that
  // thickens is a fill growing out of a line — the wash creeping back in").
  const strokeWidth = Math.min(0.35, style.strokeDuty);
  const strokeAt = (u: number): number => (frac(u / pitch) < strokeWidth ? 1 : 0);

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
        // 3. THE SURFACE-LOCKED HATCH — grey from LINES only: density (never
        // a fill value) carries the tone; a stroke pixel is a MARK at the
        // stroke's own darkness, everything between strokes is paper
        const tone = 1 - Math.max(0, Math.min(1, value[idx]));
        const nx = hatchNormal[3 * idx];
        const ny = hatchNormal[3 * idx + 1];
        const nz = hatchNormal[3 * idx + 2];
        // TRI-PLANAR surface lock: the stroke coordinates are FIXED global
        // axes picked by the normal's dominant component (floor → transverse
        // courses, wall → along-corridor lines), so the phase gradient is
        // constant and the stripe width NEVER collapses into fat bands (a
        // per-pixel tangent frame varies with the normal on curved surfaces
        // and its phase gradient cancels — measured as plaid on the mask).
        // The chirality twist rotates the family WITHIN the fixed plane,
        // signed by the copy's parity.
        const axn = Math.abs(nx);
        const ayn = Math.abs(ny);
        const azn = Math.abs(nz);
        const ox = objPos[3 * idx];
        const oy = objPos[3 * idx + 1];
        const oz = objPos[3 * idx + 2];
        let ou: number;
        let ov: number;
        if (axn >= ayn && axn >= azn) {
          ou = oy;
          ov = oz;
        } else if (ayn >= azn) {
          ou = oz;
          ov = ox;
        } else {
          ou = ox;
          ov = oy;
        }
        // handedness: the in-plane twist's SIGN is the parity
        const s = mirrored[idx] < 0 ? -1 : 1;
        const sinS = sinChi * s;
        const u1 = ou * cosChi + ov * sinS;
        const u2 = -ou * sinS + ov * cosChi;
        // density: grazing × tone — dense edge-on, sparse face-on (the dial)
        const graze = 1 - Math.max(0, Math.min(1, facingBuf[idx]));
        const density = Math.max(
          0,
          Math.min(1, tone * (1 + style.grazingGain * Math.pow(graze, style.grazingFalloff))),
        );
        let strokes = 0;
        if (density > style.strokeFloor) {
          strokes = strokeAt(u1);
          if (density > style.crossOnset) {
            strokes = Math.max(strokes, strokeAt(u2));
          }
        }
        const shade = strokes * fade * 0.8;
        // 4. SOLID — the mask's dark material only (inert today: real openings)
        const solid = style.darkMaterialId !== null && material[idx] === style.darkMaterialId ? style.darkSolid * fade : 0;
        // 2. CONTOUR — the primary mark, on its own slower fade, carried by
        // THE NIB: heavy near, fine far — the horizon is the line going too
        // fine to resolve (never fog, never a wall)
        const contourFade = Math.pow(style.contourEchoFade, e);
        const nib = style.nibNear / (1 + style.nibDepthScale * depth[idx]);
        // 5. compose: the strongest mark wins; tone never fills
        ink = Math.max(shade, solid, Math.min(1, contour[idx] * contourFade * 0.95 * nib));
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

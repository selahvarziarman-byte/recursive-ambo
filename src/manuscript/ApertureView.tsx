// ApertureView — THE APERTURE's ink (engineer-chartered 2026-07-13,
// designer-ruled ADR 0004 + Amendments): a HAND-CUT HOLE in the page, showing
// the INTERIOR of the person's 3-manifold. There is no embedding in R³, so
// there is no silhouette — the rim is a CUT, not an outline. The pixels come
// verbatim from the react-free `traceAperture` (image-space transport on the
// engine's own gluing isometries); this component only lays ink on paper:
// value → tone between the interior ink and the paper, the torn rim as an
// alpha cut with a darkened edge. THE GATE: when the model refuses (unsound,
// non-E³ ambient, fit refusal) the view draws NOTHING — the refusal rides the
// caption. No lit, solid, photoreal interior: every dial that shapes the tone
// is the craft surface the DESIGNER owns (tone curve · contour weight · echo
// fade · per-object tone), threaded through untouched.
import { useMemo } from 'react';
import * as THREE from 'three';
import type { ApertureTrace } from './apertureModel';

export interface ApertureInk {
  paperColor: string; // the page the cut sits in (brightest interior tone approaches it, never reaches it)
  interiorInk: string; // the deep tone of the interior void
  rimSeed: number; // the hand of the cut — same seed, same tear
  size: number; // world units of the aperture plane
}

function buildApertureTexture(trace: ApertureTrace, ink: ApertureInk): THREE.DataTexture {
  const W = trace.width;
  const H = trace.height;
  const data = new Uint8Array(W * H * 4);
  const paper = new THREE.Color(ink.paperColor);
  const deep = new THREE.Color(ink.interiorInk);
  const cx = W / 2;
  const cy = H / 2;
  const R = Math.min(W, H) / 2 - 1;
  const s = ink.rimSeed;
  const tone = new THREE.Color();
  for (let py = 0; py < H; py += 1) {
    for (let px = 0; px < W; px += 1) {
      const idx = py * W + px;
      // DataTexture rows run bottom-up; the trace runs top-down — flip here.
      const o = ((H - 1 - py) * W + px) * 4;
      const dx = px - cx;
      const dy = py - cy;
      const r = Math.hypot(dx, dy);
      const theta = Math.atan2(dy, dx);
      // the hand-cut rim — an irregular tear, never a drawn outline
      const rimR =
        R *
        (0.88 +
          0.072 * Math.sin(3 * theta + s) +
          0.046 * Math.sin(5 * theta + 2.7 * s) +
          0.027 * Math.sin(9 * theta + 1.3 * s));
      if (r > rimR) {
        data[o + 3] = 0; // the page, untouched — the cut ends here
        continue;
      }
      let v = trace.hit[idx] ? trace.value[idx] : 0.045; // un-hit = the corridor receding — near-void
      const edge = (rimR - r) / R;
      if (edge < 0.045) v *= 0.45 + 0.55 * (edge / 0.045); // the cut's edge — paper thickness in shadow
      tone.copy(deep).lerp(paper, Math.max(0, Math.min(1, v)) * 0.84 + 0.02);
      data[o] = Math.round(tone.r * 255);
      data[o + 1] = Math.round(tone.g * 255);
      data[o + 2] = Math.round(tone.b * 255);
      data[o + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, W, H, THREE.RGBAFormat);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * The aperture body: the traced interior behind a hand-cut rim. When there is
 * no trace (the gate refused), render NOTHING — the caller says so in words.
 */
export function ApertureBody({ trace, ink }: { trace: ApertureTrace | null; ink: ApertureInk }) {
  const texture = useMemo(() => (trace ? buildApertureTexture(trace, ink) : null), [trace, ink]);
  if (!texture) return null;
  return (
    <mesh>
      <planeGeometry args={[ink.size, ink.size]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  );
}

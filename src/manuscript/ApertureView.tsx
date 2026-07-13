// ApertureView — THE APERTURE's window, re-inked (THE INK, engineer-chartered
// 2026-07-14, designer's ink spec — discharges ADR 0004's BOUND 2): THE VOID
// IS PAPER; THE LINE CARRIES THE FORM; TONE IS A GUEST, NOT THE HOST. The
// pixels are laid by the react-free `renderApertureInk` (contour as the
// primary mark · gated hatch, no smooth gradient · the un-hit void EXACTLY
// paper · the rim a pure alpha cut); this component only wraps those bytes in
// a texture. THE GATE: when the model refuses (unsound, non-E³ ambient, fit
// refusal) the view draws NOTHING — the refusal rides the caption. Every ink
// dial is the DESIGNER'S craft surface, threaded through untouched.
import { useMemo } from 'react';
import * as THREE from 'three';
import type { ApertureTrace } from './apertureModel';
import { renderApertureInk, type ApertureInkStyle } from './apertureInk';

export interface ApertureInk extends Partial<ApertureInkStyle> {
  paperColor: string;
  interiorInk: string;
  rimSeed: number;
  size: number; // world units of the aperture plane
}

function buildApertureTexture(trace: ApertureTrace, ink: ApertureInk): THREE.DataTexture {
  const { size: _size, ...style } = ink;
  const data = renderApertureInk(trace, style);
  const texture = new THREE.DataTexture(new Uint8Array(data), trace.width, trace.height, THREE.RGBAFormat);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * The aperture body: the inked interior behind a hand-cut rim. When there is
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

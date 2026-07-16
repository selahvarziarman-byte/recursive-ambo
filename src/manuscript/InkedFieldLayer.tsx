// InkedFieldLayer — C.1 THE FIELD IN THE SPECIMEN: the form carries its living
// field, in ink. The manuscript's register for what the dev shell shows as
// screen-brightness: |ψ|² becomes STIPPLE (graphite dots on the warm paper),
// Σ becomes its OWN RESERVED INK. A translation, not a port — nothing of the
// dev view's dark-ground register survives here.
//
// THE TWO MARKS (and the one law — every visible mark is a value the engine
// computed):
//   · |ψ|² = STIPPLE DENSITY, LINEAR. Dots per site = ⌊(|ψ|²/max) · D_max⌋ —
//     no gamma, no curve-shaping (a gamma would draw γ(|ψ|²), a function the
//     engine never computed). Never hatching: hatching carries an AXIS and
//     |ψ|² is a SCALAR (the body's tone is already hatching).
//   · Σ = the forced vanishing locus, crisp, FULL CONFIDENCE, in the third
//     ink — worn by Σ and nothing else (generator ink = an H₁ generator ·
//     seam/junction ink = an identification locus · Σ ink = the defect).
//     Ground (inkedFormModel, researcher-ruled): CLASS = CERTIFIED;
//     REPRESENTATIVE = CRAFT — `sigma.sigmaClass` is the certified class,
//     `sigma.sigmaChainEdges` the drawn representative, exactly as a
//     generator loop's vertexPath ships crisp on every plate.
//   · DEGENERATE ⇒ DRAW NOTHING. No badge, bar, caption, tint, dimming — a
//     missing mark is a missing VALUE, not a missing render. This is also
//     the DEGENERATE GATE: a degenerate-band form whose Σ EXISTS is refused
//     whole (never a Σ-only partial plate) until that plate is designed.
//
// THE VOID IS NOT Σ: Σ is EDGES; |ψ|² lives on VERTICES (sites). A nodal void
// carries NO defect claim — the defect-free demo carries 8 machine-zero voids;
// the defect-bearing Klein body has no readable void at any density (its
// deepest-vs-dimmest ratio is 1.016). Σ's ink is the ONLY defect-mark.
//
// THE CALIBRATION — DERIVED, PER-FORM (a global constant FABRICATES voids):
// D_max(form) = ⌈1 / (dimmest NON-NODE |ψ|²/max)⌉ — the dimmest computed
// value still gets ≥ 1 dot; a machine-zero node gets 0. Measured on the drawn
// bodies: demo genus-2 → 15 · born Klein → 135. Where D_max exceeds the
// render budget the plate REFUSES — it NEVER CLIPS (clipping would close a
// computed value into a lie).
//
// THE ONE-COMPLEX LAW (BornFormView's committed clause): the mesh and its
// field share ONE complex — intensities are keyed to the drawn shape's own
// sites (V:vertex · M:edge-class · B:face), and Σ's segments are the
// [edge-midpoint → face-barycentre] spokes (RM:fi:p) of the committed
// barycentric split, read off the field's OWN complex boundary word.
//
// Σ's geometry is the ONE register-neutral transplant from the dev overlay
// (FieldForShapeOverlay's sigmaBySpoke); the segments draw through the SAME
// drei <Line> renderer the generator loops already use — a third colour on an
// existing path renderer.

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Shape, Vec3 } from '../types/geometry';
import type { ShapeField } from '../lib/fieldForShape';

// the layer's own props and constants — deliberately NOT InkedFormCraft (that
// interface lives in the FROZEN InkedForm.tsx and is not extended here)
export const SIGMA_INK = '#5e2a63'; // the reserved third ink — iron-gall violet; worn by Σ and NOTHING else
export const STIPPLE_INK = '#4a4132'; // the stipple graphite — the draftsman's dot tone, a step darker than hatch
export const SIGMA_LINE_WIDTH = 2.6;
export const SIGMA_GHOST_OPACITY = 0.34; // the hidden-line pass (the certified-mark two-pass idiom)
export const STIPPLE_DOT_PX = 2.4; // screen-space dot size
export const STIPPLE_OPACITY = 0.92;
// the render budget: the ceiling on the DERIVED per-form density. Above it the
// plate REFUSES ENTIRE (never clips a computed value down). Generous by
// construction — the measured drawn bodies sit at 15 (demo) / 135 (Klein) and
// the dev-RP² at 222; the ceiling exists so an extreme form refuses loudly
// instead of freezing the draw.
export const FIELD_STIPPLE_BUDGET = 2048;

export type FieldPlateRefusal = 'degenerate-band' | 'density-over-budget';

export interface FieldInkModel {
  plated: boolean; // false ⇒ NOTHING is drawn (no stipple, no Σ, no text, no tint)
  refusal: FieldPlateRefusal | null;
  dMax: number | null; // the derived per-form density (null when not plated for degeneracy)
  dimmestNonNode: number | null; // the derivation's input, kept for the record
  siteDotCounts: number[] | null; // ⌊r_i · D_max⌋ per site — THE LINEAR LAW, verbatim
  dots: Float32Array; // xyz triplets — every stipple dot on the plate
  dotCount: number;
  sigmaSegments: [number, number, number][]; // segment-pair points for the drei Line renderer
}

const mid = (a: Vec3, b: Vec3): Vec3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];

const centroidOf = (points: Vec3[]): Vec3 => {
  const n = points.length || 1;
  const sum = points.reduce<Vec3>((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0]);
  return [sum[0] / n, sum[1] / n, sum[2] / n];
};

// deterministic scatter — the same plate draws the same dots on every mount
// (no Math.random: the marks are a function of the field, nothing else)
const mulberry = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// THE CALIBRATION, derived per form: D_max = ⌈1 / (dimmest NON-NODE r)⌉ where
// r = |ψ|²/max. Nodes (the engine's own classification) are excluded from the
// derivation ONLY — they are still rendered by the same linear law (their
// r · D_max lands below 1 and floors to 0: the void is the computed value).
export function deriveStippleDensity(
  field: ShapeField,
): { dMax: number; dimmestNonNode: number } | null {
  if (field.gate !== 'simple' || field.intensity === null) return null;
  const max = field.intensity.reduce((acc, x) => Math.max(acc, x), 0);
  if (max <= 0) return null;
  const nodeSet = new Set(field.nodes ?? []);
  let dimmest = Infinity;
  field.intensity.forEach((x, i) => {
    if (nodeSet.has(i)) return;
    const r = x / max;
    if (r < dimmest) dimmest = r;
  });
  if (!Number.isFinite(dimmest) || dimmest <= 0) return null;
  return { dMax: Math.max(1, Math.ceil(1 / dimmest)), dimmestNonNode: dimmest };
}

const EMPTY_DOTS = new Float32Array(0);

const refused = (refusal: FieldPlateRefusal): FieldInkModel => ({
  plated: false,
  refusal,
  dMax: null,
  dimmestNonNode: null,
  siteDotCounts: null,
  dots: EMPTY_DOTS,
  dotCount: 0,
  sigmaSegments: [],
});

export function buildFieldInkModel(
  shape: Shape,
  field: ShapeField,
  budget: number = FIELD_STIPPLE_BUDGET,
): FieldInkModel {
  // THE DEGENERATE GATE: no canonical texture ⇒ NOTHING is plated — even when
  // a real Σ exists (a degenerate-band, defect-bearing form never gets a
  // Σ-only partial plate; that plate is undesigned and is refused whole).
  const density = deriveStippleDensity(field);
  if (field.gate !== 'simple' || field.intensity === null || density === null) {
    return refused('degenerate-band');
  }
  // THE BUDGET: refuse, never clip.
  if (density.dMax > budget) {
    return refused('density-over-budget');
  }

  const max = field.intensity.reduce((acc, x) => Math.max(acc, x), 0);
  const relative = field.intensity.map((x) => x / max);
  // THE LINEAR LAW — dots per site, verbatim ⌊r · D_max⌋. No gamma, no curve,
  // no clamp, no node special-case: the falsifier's clause is that the stipple
  // renders the COMPUTED values faithfully, including the nodal set.
  const siteDotCounts = relative.map((r) => Math.floor(r * density.dMax));
  const siteIndex = new Map(field.siteIds.map((id, i) => [id, i]));
  const countOf = (siteId: string): number => {
    const index = siteIndex.get(siteId);
    return index === undefined ? 0 : siteDotCounts[index];
  };

  const dots: number[] = [];
  const sigmaBySpoke = new Map<string, [Vec3, Vec3]>();
  // scatter `count` dots on the (anchor, t1, t2) patch triangle, hugging the anchor
  const scatter = (count: number, anchor: Vec3, t1: Vec3, t2: Vec3, seed: number): void => {
    if (count <= 0) return;
    const rand = mulberry(seed);
    for (let k = 0; k < count; k += 1) {
      const u = 0.05 + 0.5 * rand();
      const v = 0.04 + 0.34 * rand();
      dots.push(
        anchor[0] + u * (t1[0] - anchor[0]) + v * (t2[0] - anchor[0]),
        anchor[1] + u * (t1[1] - anchor[1]) + v * (t2[1] - anchor[1]),
        anchor[2] + u * (t1[2] - anchor[2]) + v * (t2[2] - anchor[2]),
      );
    }
  };

  shape.faces.forEach((face, fi) => {
    const cycle = face.vertexIds;
    const cyclePositions = cycle.map((v) => shape.vertices[v].position);
    const bar = centroidOf(cyclePositions);
    const boundary = field.complex.faces[fi]?.boundary;
    cycle.forEach((from, p) => {
      const pFrom = cyclePositions[p];
      const pTo = cyclePositions[(p + 1) % cycle.length];
      const pMid = mid(pFrom, pTo);
      // V site — this corner's patch (toward the outgoing midpoint and the barycentre)
      scatter(countOf(`V:${from}`), pFrom, pMid, bar, fi * 131071 + p * 257 + 1);
      // M site — the slot's edge CLASS, read off the field's OWN complex
      // boundary word (identified sites stipple identically wherever they appear)
      const edgeClassId = boundary?.[p]?.edge;
      if (edgeClassId) {
        scatter(countOf(`M:${edgeClassId}`), pMid, bar, pFrom, fi * 131071 + p * 257 + 2);
      }
      // Σ's transplanted geometry: the [edge-midpoint → face-barycentre] spoke
      sigmaBySpoke.set(`RM:${fi}:${p}`, [pMid, bar]);
    });
    // B site — the barycentre's dots, distributed around the face's slots
    const nBar = countOf(`B:${fi}`);
    const randB = mulberry(fi * 131071 + 3);
    for (let k = 0; k < nBar; k += 1) {
      const p = k % cycle.length;
      const pFrom = cyclePositions[p];
      const pMid = mid(pFrom, cyclePositions[(p + 1) % cycle.length]);
      const u = 0.05 + 0.45 * randB();
      const v = 0.04 + 0.3 * randB();
      dots.push(
        bar[0] + u * (pMid[0] - bar[0]) + v * (pFrom[0] - bar[0]),
        bar[1] + u * (pMid[1] - bar[1]) + v * (pFrom[1] - bar[1]),
        bar[2] + u * (pMid[2] - bar[2]) + v * (pFrom[2] - bar[2]),
      );
    }
  });

  const sigmaSegments: [number, number, number][] = [];
  if (field.hasDefect) {
    for (const spoke of field.sigma.sigmaChainEdges) {
      const seg = sigmaBySpoke.get(spoke);
      if (seg) sigmaSegments.push([...seg[0]], [...seg[1]]);
    }
  }

  return {
    plated: true,
    refusal: null,
    dMax: density.dMax,
    dimmestNonNode: density.dimmestNonNode,
    siteDotCounts,
    dots: new Float32Array(dots),
    dotCount: dots.length / 3,
    sigmaSegments,
  };
}

export function InkedFieldLayer({ shape, field }: { shape: Shape; field: ShapeField }) {
  const model = useMemo(() => buildFieldInkModel(shape, field), [shape, field]);
  const dotsGeometry = useMemo(() => {
    if (!model.plated || model.dotCount === 0) return null;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(model.dots, 3));
    return geometry;
  }, [model]);

  // NOT plated (degenerate band, or density over budget): NOTHING — no badge,
  // no bar, no caption, no tint, no dimming.
  if (!model.plated) return null;

  return (
    <group>
      {dotsGeometry ? (
        // the stipple sits with the body tone (after the body in mount order),
        // depth-tested against the committed hidden-line prepass so occluded
        // dots do not ink through the form
        <points geometry={dotsGeometry} renderOrder={0}>
          <pointsMaterial
            color={STIPPLE_INK}
            size={STIPPLE_DOT_PX}
            sizeAttenuation={false}
            transparent
            opacity={STIPPLE_OPACITY}
            depthWrite={false}
          />
        </points>
      ) : null}
      {model.sigmaSegments.length ? (
        <>
          <Line
            segments
            points={model.sigmaSegments}
            color={SIGMA_INK}
            lineWidth={SIGMA_LINE_WIDTH}
            transparent
            opacity={SIGMA_GHOST_OPACITY}
            depthTest={false}
            depthWrite={false}
            renderOrder={13}
          />
          <Line
            segments
            points={model.sigmaSegments}
            color={SIGMA_INK}
            lineWidth={SIGMA_LINE_WIDTH}
            renderOrder={14}
          />
        </>
      ) : null}
    </group>
  );
}

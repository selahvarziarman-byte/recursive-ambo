// InkedSkeleton — Manuscript Phase 2a: the dim-1 renderer (bare 1-complexes).
//
// A face-less form IS its ink: every committed edge drawn as a pen stroke at
// real vertex positions (the cut-born loop/arc pass through verbatim — the
// BornFormView 'direct' precedent). NO generator overlay is drawn: on a bare
// skeleton the real edge set and any H₁ representative coincide visually, so a
// coloured duplicate would add a mark the drawing already carries; the H₁
// claim (ℤ^{b₁}, from the committed level1Betti readout) lives in the label.

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import type { Vec3 } from '../types/geometry';
import type { SkeletonModel } from './worldModel';

export function InkedSkeleton({
  model,
  color,
  lineWidth,
  position = [0, 0, 0],
  pickWidth,
}: {
  model: SkeletonModel;
  color: string;
  lineWidth: number;
  position?: Vec3;
  // §8 (B-2026-08-24-B, RULED): the dim-1 HIT REGION — an INVISIBLE stroke
  // ≥24px wide over the same segments widens the raycast target while the
  // INK stays hairline (the look does not change). It follows the drawn
  // stroke only — a loop's hollow is NEVER pickable (a 1-complex is not a
  // disk; a fillable interior would teach a false ontology). The ruled
  // failure mode this kills: a hairline target and a broken door produce
  // the same observation — a person concludes the capability is absent.
  // Undefined/0 renders no pick stroke (the view withholds it while the
  // specimen is SELECTED, so the correspondence pick layer keeps first
  // claim on the corners).
  pickWidth?: number;
}) {
  const segments = useMemo(() => {
    const points: [number, number, number][] = [];
    for (const edge of model.shape.edges) {
      const u = model.shape.vertices[edge.vertexIds[0]]?.position;
      const v = model.shape.vertices[edge.vertexIds[1]]?.position;
      if (u && v) points.push([...u], [...v]);
    }
    return points;
  }, [model.shape]);

  if (!segments.length) return null;
  return (
    <group position={position}>
      <Line segments points={segments} color={color} lineWidth={lineWidth} />
      {pickWidth ? (
        <Line
          segments
          points={segments}
          color={color}
          lineWidth={pickWidth}
          transparent
          opacity={0}
          depthWrite={false}
        />
      ) : null}
    </group>
  );
}

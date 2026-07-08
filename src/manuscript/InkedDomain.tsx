// InkedDomain — Manuscript Phase 2a: the dim-3 renderer (fundamental domains).
//
// A 3-manifold has NO body to draw (CONTEXT: "a form with no body shows its
// fundamental domain"; the ADR-0017 lesson — the proof is never ambient
// furniture). What IS drawn: the committed seed cell's real edges as an ink
// wireframe (the domain), plus the face-identification marks — one small
// pair-coloured stud at each identified face's centroid (centroids derived
// from the seed's real positions; the pairing is the committed `glueFaces`
// pattern the invariant tower certified). Deliberately NOT drawn: any solid
// R³ body, any loop/invariant readout (that is 2b's summoned specimen).

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import type { Vec3 } from '../types/geometry';
import type { DomainModel } from './worldModel';

export function InkedDomain({
  model,
  inkColor,
  lineWidth,
  markColors,
  markRadius,
  position = [0, 0, 0],
}: {
  model: DomainModel;
  inkColor: string;
  lineWidth: number;
  markColors: readonly string[]; // one hue per identified face-pair
  markRadius: number;
  position?: Vec3;
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

  return (
    <group position={position}>
      <Line segments points={segments} color={inkColor} lineWidth={lineWidth} />
      {model.pairs.map((pair, k) =>
        pair.centers.map((center, side) => (
          <mesh key={`${pair.faceIds[side]}`} position={[...center]}>
            <sphereGeometry args={[markRadius, 16, 12]} />
            <meshBasicMaterial color={markColors[k % markColors.length]} />
          </mesh>
        )),
      )}
    </group>
  );
}

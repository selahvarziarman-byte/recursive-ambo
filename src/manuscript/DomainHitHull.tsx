// DomainHitHull — C-12a item 8 (§144, Δ95): THE HIT HULL of a drawn domain.
//
// The domain is drawn by the frozen InkedDomain as an ink wireframe (its real edges) with a stud at each identified face's
// centroid — and a wireframe has no interior to hit. Measured before this cut: with a room selected and its domain drawn
// above the plaque, a double-click inside the drawn body met only the paper behind it, whose double-click DISMISSES; a room
// whose visible body is the domain could be taken only on a rod (the eye leg needed up to 13 tries — through the wrong
// canvas as well, a driver's fault cured in the driver). This mesh draws NOTHING (colorWrite off, opacity 0) and only
// raycasts: mounted beside InkedDomain inside the room's own group, it lets a double-click anywhere inside the drawn body
// reach the room's click handler. InkedDomain itself is frozen and byte-untouched. Each face is fanned from its first
// corner; the positions are the seed's own.

import { useMemo } from 'react';
import { DoubleSide } from 'three';
import type { Shape, Vec3 } from '../types/geometry';

export function DomainHitHull({ shape }: { shape: Shape }) {
  const hull = useMemo(() => {
    const tri: number[] = [];
    for (const face of shape.faces) {
      const ps = face.vertexIds.map((id) => shape.vertices[id]?.position).filter((p): p is Vec3 => Boolean(p));
      for (let i = 1; i + 1 < ps.length; i += 1) tri.push(...ps[0], ...ps[i], ...ps[i + 1]);
    }
    return new Float32Array(tri);
  }, [shape]);
  if (hull.length === 0) return null;
  return (
    <mesh name="hit-hull">
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[hull, 3]} />
      </bufferGeometry>
      <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} side={DoubleSide} />
    </mesh>
  );
}

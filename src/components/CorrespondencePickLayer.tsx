// CorrespondencePickLayer — PHASE D1, THE CORRESPONDENCE ENGINE
// (SEAL_PHASE_D1_CORRESPONDENCE_ENGINE): the BODY-AGNOSTIC pick + projection
// layer for the selected specimen.
//
//   · PICKING: one INVISIBLE sphere per live vertex + one INVISIBLE cylinder
//     per live edge, each carrying `userData = { kind, id }` with the LIVE
//     entity id (the same id-space the card rows carry — Phase C resolved;
//     D1 matches `===`, never re-resolves). Generously sized (the designer
//     flagged hairline clicks). Hover/click return the entity ref UP; left
//     button only (the right button stays the invoke menu's). The layer is
//     deliberately INDEPENDENT of the rendered body's geometry — the
//     sanctioned crafted-FaithfulBody union replaces the plain render
//     between D1 and D2, and this layer works identically on both.
//   · PROJECTION: per frame, each pick mesh's OWN world matrix (the one
//     render-true source — the same transform the drawn body rides) projects
//     through the live camera to screen pixels, keyed by the live entity id,
//     onto the `__manuscriptCorrespondence` dev seam (the established
//     test-seam pattern beside `__manuscriptScene`/`__manuscriptCamera`).
//
// D1 RENDERS NO MARKS: every material is opacity-0 transparent (invisible,
// still raycastable). The key + emphasis are D2, held for the look-gate.

import { useMemo, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { Shape, Vec3 } from '../types/geometry';

export interface CorrespondenceEntityRef {
  kind: 'vertex' | 'edge';
  id: string;
}

export interface CorrespondenceSeam {
  positions?: Record<string, { x: number; y: number; onScreen: boolean }>;
  hovered?: CorrespondenceEntityRef | null;
  picked?: CorrespondenceEntityRef | null;
  rowResultIds?: string[];
}

const seamOf = (): CorrespondenceSeam => {
  const host = window as unknown as { __manuscriptCorrespondence?: CorrespondenceSeam };
  if (!host.__manuscriptCorrespondence) host.__manuscriptCorrespondence = {};
  return host.__manuscriptCorrespondence;
};

const UP = new THREE.Vector3(0, 1, 0);

export function CorrespondencePickLayer({
  shape,
  vertexRadius = 0.11,
  edgeRadius = 0.06,
  onHover,
  onPick,
}: {
  shape: Shape;
  vertexRadius?: number;
  edgeRadius?: number;
  onHover: (ref: CorrespondenceEntityRef | null) => void;
  onPick: (ref: CorrespondenceEntityRef) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targets = useMemo(() => {
    const verts = Object.values(shape.vertices).map((v) => ({ id: v.id, position: v.position }));
    const edges = shape.edges.flatMap((edge) => {
      const a = shape.vertices[edge.vertexIds[0]]?.position;
      const b = shape.vertices[edge.vertexIds[1]]?.position;
      if (!a || !b) return [];
      const mid: Vec3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
      const direction = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      const length = Math.max(1e-6, direction.length());
      const quaternion = new THREE.Quaternion().setFromUnitVectors(UP, direction.normalize());
      return [{ id: edge.id, mid, length, quaternion }];
    });
    return { verts, edges };
  }, [shape]);

  // the projection half — the pick meshes' world matrices ARE the drawn
  // places (they ride the specimen's own transform); screen px per frame
  useFrame(({ camera, size }) => {
    const group = groupRef.current;
    if (!group) return;
    const positions: NonNullable<CorrespondenceSeam['positions']> = {};
    const world = new THREE.Vector3();
    group.traverse((object) => {
      const data = object.userData as { kind?: string; id?: string };
      if (!data?.id || !(object as THREE.Mesh).isMesh) return;
      object.getWorldPosition(world);
      world.project(camera);
      positions[data.id] = {
        x: ((world.x + 1) / 2) * size.width,
        y: ((1 - world.y) / 2) * size.height,
        onScreen: Math.abs(world.x) <= 1 && Math.abs(world.y) <= 1 && world.z >= -1 && world.z <= 1,
      };
    });
    seamOf().positions = positions;
  });

  const hoverHandlers = (ref: CorrespondenceEntityRef) => ({
    onPointerOver: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      onHover(ref);
    },
    onPointerOut: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      onHover(null);
    },
    onPointerDown: (event: ThreeEvent<PointerEvent>) => {
      if (event.button !== 0) return; // the right button stays the invoke menu's
      event.stopPropagation();
      onPick(ref);
    },
    // the CLICK must be HANDLED too: R3F fires the canvas's onPointerMissed
    // for any click no object claims — an unclaimed pick click would DESELECT
    // the specimen and unmount this very layer (the measured leg cascade)
    onClick: (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
    },
  });

  return (
    <group ref={groupRef} name="correspondence-pick">
      {targets.verts.map((v) => (
        <mesh
          key={v.id}
          position={v.position}
          userData={{ kind: 'vertex', id: v.id }}
          {...hoverHandlers({ kind: 'vertex', id: v.id })}
        >
          <sphereGeometry args={[vertexRadius, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
      {targets.edges.map((e) => (
        <mesh
          key={e.id}
          position={e.mid}
          quaternion={e.quaternion}
          userData={{ kind: 'edge', id: e.id }}
          {...hoverHandlers({ kind: 'edge', id: e.id })}
        >
          <cylinderGeometry args={[edgeRadius, edgeRadius, e.length * 0.82, 6]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

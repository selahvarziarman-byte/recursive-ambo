// InkedPlainForm — Manuscript Phase 3a: the plain-ink renderer for WRITTEN
// forms with REAL constructed positions and no immersion route (invoked
// primitives; dual-born shapes). Draws exactly what the committed Shape
// carries: a translucent cream body over its real faces + the real edges in
// graphite (near + hidden-line ghost passes — the InkedForm conventions,
// craft-prop compatible). Deliberately NO loop marks: drawing a certified
// representative basis on arbitrary operated complexes is the researcher's
// standing Option-B item — the specimen card reads the certified values, the
// drawing stays honest. NO silhouette hull either (flat/polyhedral written
// material at starter craft; designer refines).

import { useMemo } from 'react';
import * as THREE from 'three';
import type { Shape, Vec3 } from '../types/geometry';
import type { InkedFormCraft } from './InkedForm';

function buildBodyGeometry(shape: Shape): THREE.BufferGeometry | null {
  const ids = Object.keys(shape.vertices).sort();
  const indexOf = new Map(ids.map((id, k) => [id, k]));
  const positions = new Float32Array(ids.length * 3);
  ids.forEach((id, k) => positions.set(shape.vertices[id].position, k * 3));
  const index: number[] = [];
  for (const face of shape.faces) {
    const cycle = face.vertexIds
      .map((v) => indexOf.get(v))
      .filter((k): k is number => k !== undefined);
    for (let k = 1; k < cycle.length - 1; k += 1) {
      index.push(cycle[0], cycle[k], cycle[k + 1]);
    }
  }
  if (!index.length) return null;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

function buildEdgeGeometry(shape: Shape): THREE.BufferGeometry | null {
  const positions: number[] = [];
  for (const edge of shape.edges) {
    const u = shape.vertices[edge.vertexIds[0]]?.position;
    const v = shape.vertices[edge.vertexIds[1]]?.position;
    if (u && v) positions.push(...u, ...v);
  }
  if (!positions.length) return null;
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

export function InkedPlainForm({
  shape,
  craft,
  position = [0, 0, 0],
}: {
  shape: Shape;
  craft: InkedFormCraft;
  position?: Vec3;
}) {
  const body = useMemo(() => buildBodyGeometry(shape), [shape]);
  const edges = useMemo(() => buildEdgeGeometry(shape), [shape]);

  return (
    <group position={position}>
      {body ? (
        <>
          <mesh geometry={body} renderOrder={-2}>
            <meshBasicMaterial
              colorWrite={false}
              side={THREE.DoubleSide}
              polygonOffset
              polygonOffsetFactor={1}
              polygonOffsetUnits={craft.prepassOffsetUnits}
            />
          </mesh>
          <mesh geometry={body} renderOrder={0}>
            <meshStandardMaterial
              color={craft.bodyColor}
              transparent
              opacity={craft.bodyOpacity}
              roughness={craft.bodyRoughness}
              metalness={0}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </>
      ) : null}
      {edges ? (
        <>
          <lineSegments geometry={edges} renderOrder={1}>
            <lineBasicMaterial
              color={craft.silhouetteColor}
              transparent
              opacity={Math.min(1, craft.constructionOpacity * 2.2)}
            />
          </lineSegments>
          {craft.constructionGhostOpacity > 0 ? (
            <lineSegments geometry={edges} renderOrder={2}>
              <lineBasicMaterial
                color={craft.silhouetteColor}
                transparent
                opacity={craft.constructionGhostOpacity}
                depthTest={false}
                depthWrite={false}
              />
            </lineSegments>
          ) : null}
        </>
      ) : null}
    </group>
  );
}

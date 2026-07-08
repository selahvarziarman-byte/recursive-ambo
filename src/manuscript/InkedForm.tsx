// InkedForm — Manuscript Phase 1: the faithful inked-form renderer (R3F).
//
// Draws the committed immersion as a DRAWING of a chosen representative
// (design ADR 0001 / the build-phase faithfulness guard — never photoreal),
// with a draftsman's pass structure (renderOrder −2 … 10):
//   −2 depth prepass — the body geometry, depth-only (colorWrite off). Gives
//      every later pass ONE honest nearest surface to test against (kills the
//      translucent double-side self-sorting mess, incl. on the cross-cap);
//      carries the polygon offset so lines at true depth win.
//   −1 ink silhouette — an inverted hull (the same committed geometry,
//      displaced along its vertex normals by the silhouette weight, back
//      faces only). Depth-tested against the prepass, it survives ONLY past
//      the body's rim — a drawn outline, not a show-through shell.
//    0 body — translucent cream over the paper (nearest layer only, via the
//      prepass depth). A wash, not a solid.
//    1 construction lines (near) — the real subdivision: EVERY committed
//      shape edge, graphite, depth-tested (visible where the draftsman would
//      ink them).
//    2 construction lines (hidden) — the SAME real edges, fainter, depth-test
//      off: the hidden-line convention — the far grid shows through the body,
//      as a drawing (not a photoreal object) would show it.
//   10 generator loops — the model's derived loops VERBATIM (ordered closed
//      paths through gridVertexTo; the sphere arrives with none).
//
// All craft scalars arrive as props (defaults = designDefaults.manuscriptDefaults,
// Leva-dialed in ManuscriptView). NON-KNOBS: which loops exist and what the grid
// is — inkedFormModel decides; no prop can add or remove a mark. The composite
// a·b torsion generator (RP²) draws in the primary generator ink (colour a).

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Shape, Vec3 } from '../types/geometry';
import type { InkedFormModel } from './inkedFormModel';

export interface InkedFormCraft {
  bodyColor: string;
  bodyOpacity: number;
  bodyRoughness: number;
  constructionColor: string;
  constructionOpacity: number;
  constructionGhostOpacity: number;
  silhouetteColor: string;
  silhouetteWeight: number;
  silhouetteOpacity: number;
  generatorColorA: string;
  generatorColorB: string;
  generatorLineWidth: number;
  generatorDepthTest: boolean;
}

// presentation plumbing over the committed model (the DesignWorkbench precedent),
// indexed so the geometry IS the quotient: one entry per merged vertex class.
function buildBodyGeometry(shape: Shape): THREE.BufferGeometry {
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
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(index);
  geometry.computeVertexNormals();
  return geometry;
}

// the inverted-hull silhouette: the SAME committed geometry, each vertex pushed
// out along its computed normal by the silhouette weight (drawn back-face only,
// depth-tested against the body prepass → visible only past the rim). On the
// non-orientable immersions a globally consistent normal field cannot exist —
// the hull direction flips across a seam; at drawing weights this is invisible,
// and it is craft, not structure (designer-owned polish).
function buildHullGeometry(body: THREE.BufferGeometry, weight: number): THREE.BufferGeometry {
  const position = body.getAttribute('position') as THREE.BufferAttribute;
  const normal = body.getAttribute('normal') as THREE.BufferAttribute;
  const displaced = new Float32Array(position.count * 3);
  for (let k = 0; k < position.count; k += 1) {
    displaced[3 * k] = position.getX(k) + normal.getX(k) * weight;
    displaced[3 * k + 1] = position.getY(k) + normal.getY(k) * weight;
    displaced[3 * k + 2] = position.getZ(k) + normal.getZ(k) * weight;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(displaced, 3));
  geometry.setIndex(body.getIndex());
  return geometry;
}

// the real subdivision, edge by committed edge (never a threshold heuristic)
function buildConstructionGeometry(shape: Shape): THREE.BufferGeometry | null {
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

export function InkedForm({
  model,
  craft,
  position = [0, 0, 0],
}: {
  model: InkedFormModel;
  craft: InkedFormCraft;
  position?: Vec3;
}) {
  const shape = model.immersion.shape;
  const body = useMemo(() => buildBodyGeometry(shape), [shape]);
  const hull = useMemo(
    () => buildHullGeometry(body, craft.silhouetteWeight),
    [body, craft.silhouetteWeight],
  );
  const construction = useMemo(() => buildConstructionGeometry(shape), [shape]);
  const loopPoints = useMemo(
    () =>
      model.loops.map((loop) =>
        loop.vertexPath.map((id) => [...shape.vertices[id].position] as [number, number, number]),
      ),
    [model.loops, shape],
  );

  return (
    <group position={position}>
      <mesh geometry={body} renderOrder={-2}>
        <meshBasicMaterial
          colorWrite={false}
          side={THREE.DoubleSide}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={1}
        />
      </mesh>
      {craft.silhouetteOpacity > 0 && craft.silhouetteWeight > 0 ? (
        <mesh geometry={hull} renderOrder={-1}>
          <meshBasicMaterial
            color={craft.silhouetteColor}
            side={THREE.BackSide}
            transparent
            opacity={craft.silhouetteOpacity}
          />
        </mesh>
      ) : null}
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
      {construction ? (
        <>
          <lineSegments geometry={construction} renderOrder={1}>
            <lineBasicMaterial
              color={craft.constructionColor}
              transparent
              opacity={craft.constructionOpacity}
            />
          </lineSegments>
          {craft.constructionGhostOpacity > 0 ? (
            <lineSegments geometry={construction} renderOrder={2}>
              <lineBasicMaterial
                color={craft.constructionColor}
                transparent
                opacity={craft.constructionGhostOpacity}
                depthTest={false}
                depthWrite={false}
              />
            </lineSegments>
          ) : null}
        </>
      ) : null}
      {model.loops.map((loop, k) => (
        <Line
          key={loop.label}
          points={loopPoints[k]}
          color={loop.letters.length === 1 && loop.letters[0] === 'b' ? craft.generatorColorB : craft.generatorColorA}
          lineWidth={craft.generatorLineWidth}
          // committed L2 overlay precedent: on the cross-cap the identified
          // boundary lands ON the self-intersection and would hide under the
          // surface — kept legible by default, dialable as craft
          depthTest={craft.generatorDepthTest}
          renderOrder={10}
        />
      ))}
    </group>
  );
}

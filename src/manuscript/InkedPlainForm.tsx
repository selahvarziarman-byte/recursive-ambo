// InkedPlainForm — Manuscript Phase 3a/follow-on: the plain-ink renderer for
// WRITTEN forms with REAL constructed positions and no immersion route
// (invoked primitives; dual-born shapes; assemble children). Draws exactly
// what the committed Shape carries: a translucent cream body over its real
// faces + the real edges in graphite (near + hidden-line ghost passes — the
// InkedForm conventions, craft-prop compatible).
//
// OPTION B (the follow-on; researcher ruling Q-M1): when the caller passes
// `generators` — the CERTIFIED basis polylines derived by optionBModel
// (globalW1's own basis cycles, canonically barycentric-placed) — they draw
// in generator ink with the same two-pass treatment as InkedForm's loops.
// This component adds NO mark of its own: it renders exactly the polylines
// given (b₁=0 callers pass none and the drawing stays bare, unchanged).
// P4 THE BODY VALUE (designer plate, 2026-07-28): the silhouette hull is IN
// (the InkedForm inverted-hull craft, mirrored) — strong outline over a fill
// a whisper darker than the page; the old "no hull" starter note is retired.
//
// P-IMMERSE §5 (the honest non-manifold flag): when the caller passes
// `junction` — the CLASSIFIER's own junction edge segments (>2 face wedges)
// — they overdraw in the junction ink, two passes, so the flaw is unmissable.
// Which edges are junctions is the model's reading; the ink is craft.

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Shape, Vec3 } from '../types/geometry';
import type { InkedFormCraft } from './InkedForm';
import type { CertifiedGenerator } from './optionBModel';
import type { ShapeField } from '../lib/fieldForShape';
import { InkedFieldLayer } from './InkedFieldLayer';
// R1 — THE DEFICIT REGISTER: the holonomy wedge per non-zero-deficit vertex
// (verdigris; self-refusing on un-owned atoms and junction links)
import { InkedDeficitLayer } from './InkedDeficitLayer';
// P4 FIX-FORWARD: the double-cover hull builder (non-frozen sibling) — an
// inverted hull on a non-orientable mesh needs the oriented double cover
import { buildCrossingHull } from './laidBodyModel';

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

// P4 — the inverted-hull silhouette (InkedForm's craft, mirrored: the frozen
// module keeps its own private builder): the SAME body geometry, each vertex
// pushed out along its computed normal, drawn back-face only past the rim.
const HULL_PX_CALIBRATION = 0.0117;

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
  generators,
  junction,
  field,
  position = [0, 0, 0],
  worldScale = 1,
  selfCrossing = false,
}: {
  shape: Shape;
  craft: InkedFormCraft;
  generators?: CertifiedGenerator[]; // the certified Option-B basis (optionBModel), verbatim
  junction?: { segments: Vec3[][]; color: string; lineWidth: number }; // the classifier's junction edges, marked
  // C.1 THE FIELD IN THE SPECIMEN: the form's OWN computed field (worker-borne).
  // THE ONE-COMPLEX LAW: this must be the field of THIS `shape` — the caller
  // keys it by the drawn shape's id. Absent ⇒ this component's behaviour is
  // byte-identical (it still adds NO mark of its own; the layer draws).
  field?: ShapeField;
  position?: Vec3;
  // P4 FIX-FORWARD: the group scale this form renders under — the hull weight
  // divides by it so the pen width applies AT SPEC under any band scale.
  worldScale?: number;
  // P4 FIX-FORWARD: a self-crossing body (non-orientable class bodies — the
  // cross-cap chains) takes the ORIENTED DOUBLE-COVER hull: an inverted hull
  // needs consistent winding, which a non-orientable mesh cannot carry — the
  // plain hull read as a black tangle. (Per-copy locus ghosting for the
  // chains is a later refinement; the laid klein/rp2 carry the full
  // locus-split hull in LaidBody.)
  selfCrossing?: boolean;
}) {
  const body = useMemo(() => buildBodyGeometry(shape), [shape]);
  // P4 — the hull's weight follows InkedForm's screen-space convention
  const hull = useMemo(() => {
    if (!body) return null;
    const radius = Math.max(
      1,
      ...Object.values(shape.vertices).map((v) => Math.hypot(v.position[0], v.position[1], v.position[2])),
    );
    const weight = (radius * craft.silhouetteScreenspacePx * HULL_PX_CALIBRATION) / Math.max(0.0001, worldScale);
    if (selfCrossing) {
      const positionAttribute = body.getAttribute('position') as THREE.BufferAttribute;
      const index = body.getIndex();
      if (!index) return buildHullGeometry(body, weight);
      const buckets = buildCrossingHull(
        Array.from(positionAttribute.array as Float32Array),
        Array.from(index.array as unknown as ArrayLike<number>),
        weight,
        [], // no locus register here — the double cover alone (all strong)
      );
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(buckets.positions), 3));
      geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(buckets.strongIndices), 1));
      return geometry;
    }
    return buildHullGeometry(body, weight);
  }, [body, shape, craft.silhouetteScreenspacePx, worldScale, selfCrossing]);
  const edges = useMemo(() => buildEdgeGeometry(shape), [shape]);
  const generatorLines = useMemo(
    () =>
      (generators ?? []).flatMap((generator, k) =>
        generator.polylines.map((polyline, j) => ({
          key: `${generator.label}:${j}`,
          points: polyline.map((p) => [...p] as [number, number, number]),
          ink: k % 2 === 0 ? 'a' : 'b', // alternate the two generator inks by class index (craft)
        })),
      ),
    [generators],
  );

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
          {hull && craft.silhouetteOpacity > 0 ? (
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
      {field ? <InkedFieldLayer shape={shape} field={field} /> : null}
      {/* R1 — the deficit register: the designer's slot (after construction
          lines 1–2, before generators 9), renderOrder 5–8. The layer draws
          ONLY owned readings and refuses whole where the atom is not owned —
          plates without the atom stay byte-identical. */}
      <InkedDeficitLayer shape={shape} />
      {generatorLines.map((line) => (
        <group key={line.key}>
          {craft.generatorGhostOpacity > 0 ? (
            <Line
              points={line.points}
              color={line.ink === 'b' ? craft.generatorColorB : craft.generatorColorA}
              lineWidth={craft.generatorLineWidth}
              transparent
              opacity={craft.generatorGhostOpacity}
              depthTest={false}
              depthWrite={false}
              renderOrder={9}
            />
          ) : null}
          <Line
            points={line.points}
            color={line.ink === 'b' ? craft.generatorColorB : craft.generatorColorA}
            lineWidth={craft.generatorLineWidth}
            transparent
            opacity={craft.generatorNearOpacity}
            renderOrder={10}
          />
        </group>
      ))}
      {(junction?.segments ?? []).map((segment, k) => (
        <group key={`junction:${k}`}>
          <Line
            points={segment.map((p) => [...p] as [number, number, number])}
            color={junction ? junction.color : '#000000'}
            lineWidth={junction ? junction.lineWidth : 1}
            transparent
            opacity={0.4}
            depthTest={false}
            depthWrite={false}
            renderOrder={11}
          />
          <Line
            points={segment.map((p) => [...p] as [number, number, number])}
            color={junction ? junction.color : '#000000'}
            lineWidth={junction ? junction.lineWidth : 1}
            renderOrder={12}
          />
        </group>
      ))}
    </group>
  );
}

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

import { useEffect, useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Shape, Vec3 } from '../types/geometry';
import type { InkedFormCraft, InkedFormLighting } from './InkedForm';
import type { CertifiedGenerator } from './optionBModel';
import type { ShapeField } from '../lib/fieldForShape';
import { InkedFieldLayer } from './InkedFieldLayer';
import { manuscriptDefaults, recedeInk } from '../design/designDefaults';
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

// THE D2 GROUND (SEAL_D2_GROUND_HATCH_PARITY): the key-light hatch, the
// private-mirror move this file already makes for the hull. The block below —
// HATCH_VERTEX · HATCH_FRAGMENT · useHatchMaterial — is a BYTE-FOR-BYTE copy
// of the frozen InkedForm's own (:144–:222); the (b) PARITY WIRE in
// diagnose-the-faithful-body.cjs reads InkedForm's COMMITTED bytes and goes
// RED on any one-byte divergence, either direction. Do not edit this block
// without the parity in view.
const HATCH_VERTEX = /* glsl */ `
  varying vec3 vWorldNormal;
  varying vec3 vObjectPosition;
  void main() {
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vObjectPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const HATCH_FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec3 vWorldNormal;
  varying vec3 vObjectPosition;
  uniform vec3 keyDir;
  uniform float ambient;
  uniform float keyI;
  uniform float spacingPx;
  uniform float weightPx;
  uniform float opacityCap;
  uniform vec3 inkColor;
  uniform float angleRad;
  uniform float shadowStart;
  uniform float crossStart;
  uniform float bandPx;
  // §2 THE DENSITY MANAGEMENT (the S2 union, on the S4 surface lock): the
  // stroke family keeps its SURFACE-TRUE direction; its APPARENT (screen)
  // period is managed — the base object-unit period LOD-snaps in OCTAVES
  // against the per-fragment footprint (fwidth) so the stripes never fall
  // below the legible band when the body shrinks, and the stripe edges are
  // analytically anti-aliased over the same footprint so they never
  // caterpillar when it grows. Discrete banded strokes at presented scales;
  // a flat gray only at the sub-pixel LIMIT — never a smooth tonal volume.
  float stripeAt(float f, float duty, float aa) {
    // one stripe [0, duty): both edges smoothed over the footprint
    return smoothstep(-aa, aa, f) * smoothstep(duty + aa, duty - aa, f);
  }
  float stripeCoverage(float t) {
    float w = fwidth(t); // the per-fragment footprint of the stroke coordinate
    float apparent = spacingPx / max(w, 1e-6); // the screen period, in px
    float lod = max(0.0, ceil(log2(bandPx / max(apparent, 1e-6))));
    float spacing = spacingPx * exp2(lod); // octave snap — banded, never a shimmer
    float duty = clamp(weightPx / max(spacing, 1e-4), 0.0, 1.0);
    float f = fract(t / max(spacing, 1e-4));
    float aa = min(w / max(spacing, 1e-4), 0.49); // the footprint, in period units
    // this period's stripe + the wrap neighbour (the fract seam) — at the
    // sub-pixel limit the smoothed pair averages toward duty: the flat gray
    return clamp(stripeAt(f, duty, aa) + stripeAt(f - 1.0, duty, aa), 0.0, 1.0);
  }
  void main() {
    vec3 n = normalize(vWorldNormal) * (gl_FrontFacing ? 1.0 : -1.0);
    float lambert = clamp(dot(n, normalize(keyDir)), 0.0, 1.0);
    // the body's own shading term, normalized to 1.0 fully lit (the same
    // ambient+key model the standard material sees)
    float shade = (ambient + keyI * lambert) / max(ambient + keyI, 1e-4);
    if (shade >= shadowStart) discard; // lit crown: clean paper-wash, no hatch
    // THE SURFACE LOCK (the S4 union): the strokes ride the BODY, not the
    // screen — a 2D surface coordinate from the OBJECT-space position in a
    // stable normal-derived tangent frame (dFdx/dFdy give the face plane per
    // fragment); spacing and weight are OBJECT units. The hatch is skin that
    // rotates and foreshortens with the surface, never wallpaper.
    vec3 surfaceNormal = normalize(cross(dFdx(vObjectPosition), dFdy(vObjectPosition)));
    vec3 seed = abs(surfaceNormal.z) < 0.9 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
    vec3 tangent = normalize(cross(seed, surfaceNormal));
    vec3 bitangent = cross(surfaceNormal, tangent);
    vec2 surfaceCoord = vec2(dot(vObjectPosition, tangent), dot(vObjectPosition, bitangent));
    vec2 d1 = vec2(cos(angleRad), sin(angleRad));
    float m = stripeCoverage(dot(surfaceCoord, d1));
    if (shade < crossStart) {
      // deepest shadow only: the crossing diagonal joins in
      vec2 d2 = vec2(-d1.y, d1.x);
      m = max(m, stripeCoverage(dot(surfaceCoord, d2)));
    }
    if (m <= 0.004) discard;
    // capped, banded — the AA scales EDGE alpha within the cap; never a
    // smooth tonal volume
    gl_FragColor = vec4(inkColor, opacityCap * m);
  }
`;

function useHatchMaterial(craft: InkedFormCraft, lighting: InkedFormLighting): THREE.ShaderMaterial {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: HATCH_VERTEX,
        fragmentShader: HATCH_FRAGMENT,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          keyDir: { value: new THREE.Vector3(1, 1, 1) },
          ambient: { value: 1 },
          keyI: { value: 0.5 },
          spacingPx: { value: 7.5 },
          weightPx: { value: 1 },
          opacityCap: { value: 0.4 },
          inkColor: { value: new THREE.Color('#61563f') },
          angleRad: { value: Math.PI / 4 },
          shadowStart: { value: 0.8 },
          crossStart: { value: 0.66 },
          bandPx: { value: 9 },
        },
      }),
    [],
  );
  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => {
    material.uniforms.keyDir.value.set(...lighting.keyPosition).normalize();
    material.uniforms.ambient.value = lighting.ambientIntensity;
    material.uniforms.keyI.value = lighting.keyIntensity;
    material.uniforms.spacingPx.value = craft.hatchSpacingPx;
    material.uniforms.bandPx.value = craft.hatchBandPx ?? 9; // §2: the designer's legible-band lever (NOT_FROZEN valuation)
    material.uniforms.weightPx.value = craft.hatchWeightPx;
    material.uniforms.opacityCap.value = Math.min(craft.hatchOpacity, 0.5); // the anti-photoreal cap, enforced
    (material.uniforms.inkColor.value as THREE.Color).set(craft.hatchColor);
    material.uniforms.angleRad.value = (craft.hatchAngleDeg * Math.PI) / 180;
    material.uniforms.shadowStart.value = craft.hatchShadowStart;
    material.uniforms.crossStart.value = craft.hatchCrossStart;
  }, [material, craft, lighting]);
  return material;
}

export function InkedPlainForm({
  shape,
  craft,
  lighting,
  generators,
  junction,
  field,
  position = [0, 0, 0],
  worldScale = 1,
  selfCrossing = false,
  recede,
}: {
  shape: Shape;
  craft: InkedFormCraft;
  // THE D2 GROUND: the key-light the hatch shades by (the same composed
  // lighting InkedForm receives — the view passes its one lighting object)
  lighting: InkedFormLighting;
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
  // M1 (SEAL_THE_MARKED_SPECIMEN) — REGISTER SUBORDINATION: the FIGURE
  // (silhouette + hatch + cells + rim) is the phenomenon and NEVER recedes;
  // the ANNOTATION registers named here wear the binary recessed band —
  // WEIGHT (the finer nib) + hue-preserving pull toward the ink neutral.
  // ⛔ never opacity · never dash. The DEFICIT register is a STATED EXCEPTION
  // (held for the researcher, ruling 1618) and stays FULL below.
  recede?: { generators?: boolean; field?: boolean };
}) {
  const body = useMemo(() => buildBodyGeometry(shape), [shape]);
  // P4 — the hull's weight follows InkedForm's screen-space convention
  const hull = useMemo(() => {
    if (!body) return null;
    // §3 THE HULL-ON-FLAT GUARD (SEAL_S3_BLACK_TRIANGLE_S4_SURFACE_LOCK): a
    // constant-normal (flat) body's inverted hull is a coplanar ZERO-VOLUME
    // shell whose back-face washes the interior — a flat disk's silhouette
    // is its RIM, never a face back-face (the faithfulBodyModel 'flat'
    // branch's doctrine, mirrored). Skip the face-hull; the rim edges carry.
    const normalAttribute = body.getAttribute('normal') as THREE.BufferAttribute;
    let flat = true;
    for (let k = 1; k < normalAttribute.count && flat; k += 1) {
      const dot =
        normalAttribute.getX(0) * normalAttribute.getX(k) +
        normalAttribute.getY(0) * normalAttribute.getY(k) +
        normalAttribute.getZ(0) * normalAttribute.getZ(k);
      if (dot < 0.999) flat = false;
    }
    if (flat) return null;
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
  const hatchMaterial = useHatchMaterial(craft, lighting);
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
          {/* THE D2 GROUND: the ONE hatch pass (InkedForm's own mount,
              mirrored) — grey from lines, never a fill wash */}
          {craft.hatchOpacity > 0 ? (
            <mesh geometry={body} material={hatchMaterial} renderOrder={0.5} />
          ) : null}
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
      {field ? <InkedFieldLayer shape={shape} field={field} recessed={Boolean(recede?.field)} /> : null}
      {/* R1 — the deficit register: the designer's slot (after construction
          lines 1–2, before generators 9), renderOrder 5–8. The layer draws
          ONLY owned readings and refuses whole where the atom is not owned —
          plates without the atom stay byte-identical.
          M1 STATED EXCEPTION: the deficit is HELD FOR THE RESEARCHER (ruling
          1618) — it stays FULL, never receded, until her call lands. */}
      <InkedDeficitLayer shape={shape} />
      {generatorLines.map((line) => {
        // M1 — the generators' recessed band: the SAME loop at a finer nib
        // (width × the line factor) with its ink pulled toward the neutral.
        // Opacity params untouched (recession is presence, not uncertainty).
        const recessedGen = Boolean(recede?.generators);
        const genWidth =
          craft.generatorLineWidth * (recessedGen ? manuscriptDefaults.registers.recessedLineFactor : 1);
        const fullInk = line.ink === 'b' ? craft.generatorColorB : craft.generatorColorA;
        const genInk = recessedGen ? recedeInk(fullInk) : fullInk;
        return (
        <group key={line.key}>
          {craft.generatorGhostOpacity > 0 ? (
            <Line
              points={line.points}
              color={genInk}
              lineWidth={genWidth}
              transparent
              opacity={craft.generatorGhostOpacity}
              depthTest={false}
              depthWrite={false}
              renderOrder={9}
            />
          ) : null}
          <Line
            points={line.points}
            color={genInk}
            lineWidth={genWidth}
            transparent
            opacity={craft.generatorNearOpacity}
            renderOrder={10}
          />
        </group>
        );
      })}
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

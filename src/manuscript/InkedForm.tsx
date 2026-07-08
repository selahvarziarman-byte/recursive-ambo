// InkedForm — Manuscript Phase 1.5: the faithful inked-form renderer (R3F).
//
// Draws the committed immersion as a DRAWING of a chosen representative
// (design ADR 0001 / the build-phase faithfulness guard — never photoreal),
// with a draftsman's pass structure (renderOrder −2 … 10):
//   −2  depth prepass — the body geometry, depth-only (colorWrite off). Gives
//       every later pass ONE honest nearest surface to test against (kills the
//       translucent double-side self-sorting mess, incl. on the cross-cap);
//       carries the polygon offset (units = the designer's z-fight knob) so
//       lines at true depth win.
//   −1  ink silhouette — an inverted hull (the same committed geometry,
//       displaced along its vertex normals, back faces only). Depth-tested
//       against the prepass, it survives ONLY past the body's rim. Weight is
//       CONSTANT SCREEN-SPACE ("one pen", designer item 4): world displacement
//       = bounding radius × screenspacePx × HULL_PX_CALIBRATION.
//    0  body — translucent cream over the paper (nearest layer only).
//  0.5  hatching — screen-space diagonal ink SHADING masked by the key-light
//       term: lit → none, shadow → single hatch, deep shadow → cross-hatch
//       (designer item 1; target outputs/torus_hatched_study.png). TONE, not a
//       mark: derives from no correspondence, adds no line/loop; its one guard
//       is the ANTI-PHOTOREAL CAP (per-stroke opacity capped + banded — never
//       a smooth tonal volume).
//    1  construction lines (near) — the real subdivision: EVERY committed
//       shape edge, graphite, depth-tested.
//    2  construction lines (hidden) — the SAME real edges, fainter, depth-test
//       off: the hidden-line convention.
//    9  generator loops (hidden pass) — the SAME derived loops, faint,
//       depth-test off (designer item 2 — the loops now mirror the
//       construction lines' two-pass treatment; fixes the cross-form
//       overdraw and lifts the RP² front arc).
//   10  generator loops (near pass) — depth-tested, full colour.
//
// All craft scalars arrive as props (defaults = designDefaults.manuscriptDefaults,
// Leva-dialed in ManuscriptView). NON-KNOBS: which loops exist and what the grid
// is — inkedFormModel decides (word loops + globalW1-certified cores); no prop can
// add or remove a mark. The composite a·b generator and the certified cores draw
// in the primary generator ink (colour a).

import { useEffect, useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Shape, Vec3 } from '../types/geometry';
import type { InkedFormModel } from './inkedFormModel';

export interface InkedFormCraft {
  bodyColor: string;
  bodyOpacity: number;
  bodyRoughness: number;
  prepassOffsetUnits: number;
  constructionColor: string;
  constructionOpacity: number;
  constructionGhostOpacity: number;
  silhouetteColor: string;
  silhouetteScreenspacePx: number;
  silhouetteOpacity: number;
  generatorColorA: string;
  generatorColorB: string;
  generatorLineWidth: number;
  generatorGhostOpacity: number;
  hatchSpacingPx: number;
  hatchOpacity: number;
  hatchWeightPx: number;
  hatchColor: string;
  hatchAngleDeg: number;
  hatchShadowStart: number;
  hatchCrossStart: number;
}

export interface InkedFormLighting {
  ambientIntensity: number;
  keyIntensity: number;
  keyPosition: readonly [number, number, number];
}

// world-units of hull displacement per (bounding-radius × screenspacePx),
// calibrated so screenspacePx 1.75 reproduces the Phase-1 sphere look
// (radius 2.2 × 0.045 world) at the default camera [0, 6, 30].
const HULL_PX_CALIBRATION = 0.0117;

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
// out along its computed normal (drawn back-face only, depth-tested against the
// body prepass → visible only past the rim). On the non-orientable immersions a
// globally consistent normal field cannot exist — the hull direction flips
// across a seam; at drawing weights this is invisible, and it is craft, not
// structure (designer-owned polish).
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

// the hatch shader — SHADING, not structure: banded screen-space strokes gated
// by the body's own key-light term. Alpha is a constant per stroke (the cap);
// the shading term selects the BAND (none / single / cross), never a gradient.
const HATCH_VERTEX = /* glsl */ `
  varying vec3 vWorldNormal;
  void main() {
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const HATCH_FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec3 vWorldNormal;
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
  void main() {
    vec3 n = normalize(vWorldNormal) * (gl_FrontFacing ? 1.0 : -1.0);
    float lambert = clamp(dot(n, normalize(keyDir)), 0.0, 1.0);
    // the body's own shading term, normalized to 1.0 fully lit (the same
    // ambient+key model the standard material sees)
    float shade = (ambient + keyI * lambert) / max(ambient + keyI, 1e-4);
    if (shade >= shadowStart) discard; // lit crown: clean paper-wash, no hatch
    vec2 d1 = vec2(cos(angleRad), sin(angleRad));
    float duty = clamp(weightPx / max(spacingPx, 1.0), 0.0, 1.0);
    float m = step(fract(dot(gl_FragCoord.xy, d1) / max(spacingPx, 1.0)), duty);
    if (shade < crossStart) {
      // deepest shadow only: the crossing diagonal joins in
      vec2 d2 = vec2(-d1.y, d1.x);
      m = max(m, step(fract(dot(gl_FragCoord.xy, d2) / max(spacingPx, 1.0)), duty));
    }
    if (m <= 0.0) discard;
    gl_FragColor = vec4(inkColor, opacityCap); // capped, banded — never a smooth volume
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
    material.uniforms.weightPx.value = craft.hatchWeightPx;
    material.uniforms.opacityCap.value = Math.min(craft.hatchOpacity, 0.5); // the anti-photoreal cap, enforced
    (material.uniforms.inkColor.value as THREE.Color).set(craft.hatchColor);
    material.uniforms.angleRad.value = (craft.hatchAngleDeg * Math.PI) / 180;
    material.uniforms.shadowStart.value = craft.hatchShadowStart;
    material.uniforms.crossStart.value = craft.hatchCrossStart;
  }, [material, craft, lighting]);
  return material;
}

export function InkedForm({
  model,
  craft,
  lighting,
  position = [0, 0, 0],
}: {
  model: InkedFormModel;
  craft: InkedFormCraft;
  lighting: InkedFormLighting;
  position?: Vec3;
}) {
  const shape = model.immersion.shape;
  const body = useMemo(() => buildBodyGeometry(shape), [shape]);
  const radius = useMemo(
    () =>
      Math.max(
        1,
        ...Object.values(shape.vertices).map((v) =>
          Math.hypot(v.position[0], v.position[1], v.position[2]),
        ),
      ),
    [shape],
  );
  const hullWeight = radius * craft.silhouetteScreenspacePx * HULL_PX_CALIBRATION;
  const hull = useMemo(() => buildHullGeometry(body, hullWeight), [body, hullWeight]);
  const construction = useMemo(() => buildConstructionGeometry(shape), [shape]);
  const hatchMaterial = useHatchMaterial(craft, lighting);
  const loopPoints = useMemo(
    () =>
      model.loops.map((loop) =>
        loop.vertexPath.map((id) => [...shape.vertices[id].position] as [number, number, number]),
      ),
    [model.loops, shape],
  );
  const loopColor = (k: number): string =>
    model.loops[k].letters.length === 1 && model.loops[k].letters[0] === 'b'
      ? craft.generatorColorB
      : craft.generatorColorA;

  return (
    <group position={position}>
      <mesh geometry={body} renderOrder={-2}>
        <meshBasicMaterial
          colorWrite={false}
          side={THREE.DoubleSide}
          polygonOffset
          polygonOffsetFactor={1}
          polygonOffsetUnits={craft.prepassOffsetUnits}
        />
      </mesh>
      {craft.silhouetteOpacity > 0 && hullWeight > 0 ? (
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
      {craft.hatchOpacity > 0 ? (
        <mesh geometry={body} material={hatchMaterial} renderOrder={0.5} />
      ) : null}
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
        <group key={loop.label}>
          {craft.generatorGhostOpacity > 0 ? (
            <Line
              points={loopPoints[k]}
              color={loopColor(k)}
              lineWidth={craft.generatorLineWidth}
              transparent
              opacity={craft.generatorGhostOpacity}
              depthTest={false}
              depthWrite={false}
              renderOrder={9}
            />
          ) : null}
          <Line
            points={loopPoints[k]}
            color={loopColor(k)}
            lineWidth={craft.generatorLineWidth}
            renderOrder={10}
          />
        </group>
      ))}
    </group>
  );
}

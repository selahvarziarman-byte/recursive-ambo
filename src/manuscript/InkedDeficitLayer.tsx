// InkedDeficitLayer — R1 THE DEFICIT REGISTER (the WORLD register): the
// per-vertex deficit drawn as the HOLONOMY WEDGE, in verdigris — its own
// reserved ink species (a VERTEX quantity; distinct from Σ's iron-gall
// violet, an EDGE locus). The InkedFieldLayer precedent: the testable
// geometry lives in deficitRegisterModel; this layer only inks it.
//
// THE GRAPHEME (designer 1900): the fine circuit round the vertex · the
// plain DEPARTURE line (no taper) · the RETURN as a NIB STROKE (thick tail
// → thin head — a stroke, never an arrow) · the WEDGE fan between them,
// whose angle IS the owned curvature. Sign = SIDE: +δ swings the return one
// way round the normal, −δ the other — two different marks, never one mark
// + a caption. A boundary vertex wears the rim's own turn (an OPEN arc — no
// closed circuit exists there). δ=0 draws NOTHING; a refused model (un-owned
// atom / junction link) draws NOTHING — a missing mark is a missing value.
//
// ⛔ NO NUMERALS IN THE WORLD: the wedge shows the turn; the number lives on
// the SPECIMEN card ("cone point · deficit N°"). This layer prints no text.
//
// Screen-space weights are reasonable defaults — the designer dials them on
// the real ground (plate-vs-app, ≥2 angles) after this first build.

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { Shape, Vec3 } from '../types/geometry';
import type { AssembledComplex } from '../lib/globalW1';
import {
  buildDeficitRegisterModel,
  rotateAboutAxis,
  type DeficitMark,
} from './deficitRegisterModel';

export const DEFICIT_INK = '#2f6b6b'; // verdigris — reserved: the vertex deficit and NOTHING else
export const DEFICIT_CIRCUIT_WIDTH = 1.1; // the fine circuit
export const DEFICIT_DEPARTURE_WIDTH = 1.7; // the plain reference line (uniform — no taper)
export const DEFICIT_GHOST_OPACITY = 0.28; // the hidden-line pass (the certified-mark two-pass idiom)
export const DEFICIT_WEDGE_OPACITY = 0.2; // the fan fill between departure and return
export const DEFICIT_STROKE_TAIL_FRACTION = 0.16; // nib tail half-width as a fraction of radius
// R1-FIX delta #2 (designer's floor): 1.35 → 1.15 — the strokes stay close to
// the corner; the marks must never obscure the cells they annotate.
export const DEFICIT_REACH = 1.15; // departure/return length as a multiple of the circuit radius
const ARC_STEP = Math.PI / 24; // fan sampling

const toTuple = (v: Vec3): [number, number, number] => [v[0], v[1], v[2]];
const at = (center: Vec3, dir: Vec3, r: number): [number, number, number] => [
  center[0] + dir[0] * r,
  center[1] + dir[1] * r,
  center[2] + dir[2] * r,
];

// R1-FIX delta #1 — the circuit lies ON THE SURFACE: the model's per-face
// wedge arcs (points in the incident faces' own planes), drawn as-is. The
// old tangent-plane hoop read as detached beside the corner; a mark that
// claims "carry a direction AROUND the vertex" must lie on the vertex.

// the wedge fan (the mark proper): triangles sweeping departure → return by
// the SIGNED angle — +δ and −δ fans occupy opposite sides of the departure
function wedgeFanPositions(mark: DeficitMark): Float32Array {
  const steps = Math.max(6, Math.ceil(Math.abs(mark.wedgeAngle) / ARC_STEP));
  const r = mark.radius * 0.92;
  const positions: number[] = [];
  for (let k = 0; k < steps; k += 1) {
    const a = rotateAboutAxis(mark.departure, mark.normal, (mark.wedgeAngle * k) / steps);
    const b = rotateAboutAxis(mark.departure, mark.normal, (mark.wedgeAngle * (k + 1)) / steps);
    positions.push(...mark.center, ...at(mark.center, a, r), ...at(mark.center, b, r));
  }
  return new Float32Array(positions);
}

// the RETURN nib stroke: a tapered sliver — thick at the tail (the vertex),
// thin to nothing at the head. A stroke, never an arrow (no head barbs).
function nibStrokePositions(mark: DeficitMark): Float32Array {
  const tip = at(mark.center, mark.returnDir, mark.radius * DEFICIT_REACH);
  const half = mark.radius * DEFICIT_STROKE_TAIL_FRACTION;
  // the tail widens PERPENDICULAR to the stroke, in the tangent plane
  const perp = rotateAboutAxis(mark.returnDir, mark.normal, Math.PI / 2);
  const tailA = at(mark.center, perp, half);
  const tailB = at(mark.center, perp, -half);
  return new Float32Array([...tailA, ...tailB, ...tip]);
}

function TriangleSoup({
  positions,
  opacity,
  renderOrder,
  depthTest = true,
}: {
  positions: Float32Array;
  opacity: number;
  renderOrder: number;
  depthTest?: boolean;
}) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);
  return (
    <mesh geometry={geometry} renderOrder={renderOrder}>
      <meshBasicMaterial
        color={DEFICIT_INK}
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthTest={depthTest}
        depthWrite={false}
      />
    </mesh>
  );
}

export function InkedDeficitLayer({
  shape,
  complex,
}: {
  shape: Shape;
  complex?: AssembledComplex;
}) {
  const model = useMemo(() => buildDeficitRegisterModel(shape, complex), [shape, complex]);

  // refused (un-owned atom / junction) or all-flat: NOTHING — no badge, no
  // caption, no tint (the missing mark is the missing value)
  if (!model.marked || model.marks.length === 0) return null;

  return (
    // name = the app-path witness leg's PRESENCE handle (a test seam; the
    // group exists only when real marks ride — absence stays absence)
    <group name="deficit-register">
      {model.marks.map((mark) => {
        const departureLine = [toTuple(mark.center), at(mark.center, mark.departure, mark.radius * DEFICIT_REACH)];
        return (
          <group key={`deficit:${mark.vertexId}`}>
            <TriangleSoup positions={wedgeFanPositions(mark)} opacity={DEFICIT_WEDGE_OPACITY} renderOrder={5} />
            {mark.circuitArcs.map((arc, k) => (
              <group key={`arc:${k}`}>
                <Line
                  points={arc.map(toTuple)}
                  color={DEFICIT_INK}
                  lineWidth={DEFICIT_CIRCUIT_WIDTH}
                  transparent
                  opacity={DEFICIT_GHOST_OPACITY}
                  depthTest={false}
                  depthWrite={false}
                  renderOrder={6}
                />
                <Line points={arc.map(toTuple)} color={DEFICIT_INK} lineWidth={DEFICIT_CIRCUIT_WIDTH} renderOrder={7} />
              </group>
            ))}
            <Line
              points={departureLine}
              color={DEFICIT_INK}
              lineWidth={DEFICIT_DEPARTURE_WIDTH}
              transparent
              opacity={DEFICIT_GHOST_OPACITY}
              depthTest={false}
              depthWrite={false}
              renderOrder={6}
            />
            <Line points={departureLine} color={DEFICIT_INK} lineWidth={DEFICIT_DEPARTURE_WIDTH} renderOrder={7} />
            <TriangleSoup
              positions={nibStrokePositions(mark)}
              opacity={DEFICIT_GHOST_OPACITY}
              renderOrder={6}
              depthTest={false}
            />
            <TriangleSoup positions={nibStrokePositions(mark)} opacity={0.96} renderOrder={8} />
          </group>
        );
      })}
    </group>
  );
}

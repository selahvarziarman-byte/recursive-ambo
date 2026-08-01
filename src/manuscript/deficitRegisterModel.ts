// deficitRegisterModel — R1 THE DEFICIT REGISTER: the per-vertex deficit as
// the HOLONOMY WEDGE, the mark's testable geometry (the witness asserts on
// THIS model, never pixels — the InkedFieldLayer precedent).
//
// THE MEANING: the deficit is holonomy — carry a direction around a vertex on
// the closed body and it returns rotated by exactly the deficit. A real
// measurable, no fiction. ⛔ It is NOT a slit-cone GAP (the body is CLOSED at
// the apex; a drawn gap would assert a hole the form lacks — that gap belongs
// to the DEVELOPMENT/specimen, never the world).
//
// THE DATUM IS OWNED, NEVER RECOMPUTED: `readVertexCurvatures(shape, complex?)`
// (conformalAtom) supplies the signed curvature — interior 2π−Σθ, boundary
// π−Σθ. This model DRAWS that reading; it derives only mark GEOMETRY
// (positions/directions), never the quantity.
//
// THE MARK (per non-zero-deficit vertex):
//   · a fine circuit round the vertex (closed for interior; the boundary
//     sibling is the RIM'S OWN TURN — an open arc, no closed circuit: the
//     transported frame does not exist there);
//   · the DEPARTURE — a plain line: a deterministic incident-edge reference
//     (smallest edge id; boundary vertices prefer their rim edges — the
//     tangent-before), projected into the vertex tangent plane;
//   · the RETURN — a nib stroke (thick tail → thin head; a stroke, never an
//     arrow): the departure ROTATED in the tangent plane by the SIGNED
//     curvature;
//   · the WEDGE between them — the mark proper; its angle IS the curvature.
//
// ⛔ THE SIGN IS TWO MARKS, not one mark + a caption: a COMMON departure and
// the SIGNED rotation land +δ and −δ on OPPOSITE sides — geometrically
// distinct (the designer's pixel-identical bug is structurally impossible
// here; the witness proves the endpoints part). At |δ| = π exactly the two
// return endpoints coincide (antipodal both ways) — the wedge FAN still
// disambiguates: its sweep passes through opposite half-planes.
//
// THE SILENCES (a missing mark is a missing VALUE — the C.1 law):
//   · δ = 0 → NO mark at all (no circuit, no stroke, no badge, no "0°");
//   · an un-owned atom or a junction/pinch → the reader's own refusal, and
//     the model plates NOTHING (marked: false; a pinched form is bodiless —
//     no body, no mark).

import type { Shape, Vec3 } from '../types/geometry';
import { readVertexCurvatures } from '../lib/conformalAtom';
import type { AssembledComplex } from '../lib/globalW1';

// the flat tolerance: below this the deficit is silence, not a mark
export const DEFICIT_EPS = 1e-9;
// the circuit radius as a fraction of the shortest incident edge (a reasonable
// default — the designer dials the screen-space weights on the real ground)
export const DEFICIT_RADIUS_FRACTION = 0.2;

export interface DeficitMark {
  vertexId: string;
  valence: 'interior' | 'boundary';
  curvature: number; // the OWNED reading, verbatim (signed)
  center: Vec3; // the vertex position
  normal: Vec3; // the vertex tangent-plane normal (unit)
  departure: Vec3; // unit reference direction in the tangent plane — the plain line
  returnDir: Vec3; // departure rotated by the signed curvature about the normal — the nib stroke
  wedgeAngle: number; // == curvature (the mark's angle IS the reading)
  side: 'cone' | 'saddle'; // δ > 0 falls one side, δ < 0 the other — two marks, never a caption
  circuit: 'closed' | 'open'; // interior circles; the boundary sibling is the open rim turn
  radius: number; // world-unit circuit radius (screen-space intent; designer tunes)
}

export interface DeficitRegisterModel {
  marked: boolean; // false ⇒ NOTHING is drawn (refusal — un-owned atom / junction link)
  refusal: string | null; // the reader's own sentence when refused
  marks: DeficitMark[]; // ONLY non-zero-deficit vertices ride (δ=0 is silence)
}

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len = (a: Vec3): number => Math.hypot(a[0], a[1], a[2]);
const scale = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
const unit = (a: Vec3): Vec3 | null => {
  const l = len(a);
  return l < 1e-12 ? null : scale(a, 1 / l);
};

// Rodrigues — rotate v about the unit axis by the SIGNED angle (right-handed)
export function rotateAboutAxis(v: Vec3, axis: Vec3, angle: number): Vec3 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const k = cross(axis, v);
  const d = dot(axis, v) * (1 - c);
  return [
    v[0] * c + k[0] * s + axis[0] * d,
    v[1] * c + k[1] * s + axis[1] * d,
    v[2] * c + k[2] * s + axis[2] * d,
  ];
}

// THE MARK CONSTRUCTOR — pure geometry from (plane, reference, reading).
// The sign law lives HERE: one common departure, the RETURN swung by the
// SIGNED curvature — +δ and −δ part to opposite sides by construction.
export function buildDeficitMarkGeometry(
  normal: Vec3,
  departureRef: Vec3,
  curvature: number,
): { departure: Vec3; returnDir: Vec3; wedgeAngle: number; side: 'cone' | 'saddle' } | null {
  const n = unit(normal);
  if (!n) return null;
  // project the reference into the tangent plane
  const inPlane = sub(departureRef, scale(n, dot(departureRef, n)));
  const departure = unit(inPlane);
  if (!departure) return null;
  return {
    departure,
    returnDir: rotateAboutAxis(departure, n, curvature),
    wedgeAngle: curvature,
    side: curvature > 0 ? 'cone' : 'saddle',
  };
}

// Newell's method — a face's normal from its cycle (robust for any polygon)
function faceNormalOf(shape: Shape, cycle: string[]): Vec3 {
  const normal: Vec3 = [0, 0, 0];
  for (let k = 0; k < cycle.length; k += 1) {
    const p = shape.vertices[cycle[k]]?.position;
    const q = shape.vertices[cycle[(k + 1) % cycle.length]]?.position;
    if (!p || !q) continue;
    normal[0] += (p[1] - q[1]) * (p[2] + q[2]);
    normal[1] += (p[2] - q[2]) * (p[0] + q[0]);
    normal[2] += (p[0] - q[0]) * (p[1] + q[1]);
  }
  return normal;
}

export function buildDeficitRegisterModel(
  shape: Shape,
  complex?: AssembledComplex,
): DeficitRegisterModel {
  // THE DATUM — owned, or the honest refusal (un-owned atom / junction link):
  // the reader's throw IS the register's silence (a pinched form is bodiless).
  let readings;
  try {
    readings = readVertexCurvatures(shape, complex);
  } catch (error) {
    return {
      marked: false,
      refusal: error instanceof Error ? error.message : String(error),
      marks: [],
    };
  }

  // adjacency-count per undirected edge pair (rim = a pair on exactly 1 face)
  const pairCount = new Map<string, number>();
  const pairKey = (a: string, b: string): string => (a < b ? `${a}|${b}` : `${b}|${a}`);
  for (const face of shape.faces) {
    const cycle = face.vertexIds;
    for (let k = 0; k < cycle.length; k += 1) {
      const key = pairKey(cycle[k], cycle[(k + 1) % cycle.length]);
      pairCount.set(key, (pairCount.get(key) ?? 0) + 1);
    }
  }

  const marks: DeficitMark[] = [];
  for (const reading of readings) {
    // THE SILENCE AT ZERO: flat is not a faint mark — it is no mark
    if (Math.abs(reading.curvature) < DEFICIT_EPS) continue;
    const vertex = shape.vertices[reading.vertexId];
    if (!vertex) continue;
    const center = vertex.position;

    // the tangent-plane normal: the summed Newell normals of incident faces
    const summed: Vec3 = [0, 0, 0];
    for (const face of shape.faces) {
      if (!face.vertexIds.includes(reading.vertexId)) continue;
      const fn = faceNormalOf(shape, face.vertexIds);
      summed[0] += fn[0];
      summed[1] += fn[1];
      summed[2] += fn[2];
    }
    const normal = unit(summed) ?? ([0, 0, 1] as Vec3);

    // the deterministic departure reference: incident edges sorted by id —
    // a BOUNDARY vertex prefers its rim edges (the tangent-before of the
    // rim's own turn); an interior vertex takes the smallest incident edge
    const incident = shape.edges
      .filter((edge) => edge.vertexIds.includes(reading.vertexId))
      .sort((a, b) => a.id.localeCompare(b.id));
    const preferred =
      reading.valence === 'boundary'
        ? [
            ...incident.filter((e) => (pairCount.get(pairKey(e.vertexIds[0], e.vertexIds[1])) ?? 0) === 1),
            ...incident.filter((e) => (pairCount.get(pairKey(e.vertexIds[0], e.vertexIds[1])) ?? 0) !== 1),
          ]
        : incident;
    // the shortest incident edge sets the circuit's local scale
    let shortest = Infinity;
    for (const edge of incident) {
      const other = edge.vertexIds[0] === reading.vertexId ? edge.vertexIds[1] : edge.vertexIds[0];
      const p = shape.vertices[other]?.position;
      if (p) shortest = Math.min(shortest, len(sub(p, center)));
    }
    const radius = Number.isFinite(shortest) ? Math.max(1e-6, shortest * DEFICIT_RADIUS_FRACTION) : 0.1;

    // first reference that survives the tangent-plane projection wins
    let geometry: ReturnType<typeof buildDeficitMarkGeometry> = null;
    for (const edge of preferred) {
      const other = edge.vertexIds[0] === reading.vertexId ? edge.vertexIds[1] : edge.vertexIds[0];
      const p = shape.vertices[other]?.position;
      if (!p) continue;
      geometry = buildDeficitMarkGeometry(normal, sub(p, center), reading.curvature);
      if (geometry) break;
    }
    if (!geometry) continue; // no usable reference direction — nothing fabricated

    marks.push({
      vertexId: reading.vertexId,
      valence: reading.valence,
      curvature: reading.curvature,
      center,
      normal,
      departure: geometry.departure,
      returnDir: geometry.returnDir,
      wedgeAngle: geometry.wedgeAngle,
      side: geometry.side,
      circuit: reading.valence === 'interior' ? 'closed' : 'open',
      radius,
    });
  }

  return { marked: true, refusal: null, marks };
}

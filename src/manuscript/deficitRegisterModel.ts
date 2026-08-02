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
// R1-REBUILD (2026-08-02): the faithful mode joins the readers — the fold-born
// cone renders `faithful` and both readers dropped it to a silent null. The
// acquisition is the committed READ (`surfaceClassifier`, frozen, import-only);
// the render union rides as a TYPE only (elided at runtime).
import { acquireFaithfulComplex, type ComplexSource } from './surfaceClassifier';
import type { FaithfulBodyModel } from './faithfulBodyModel';
import type { WrittenRender } from './writtenFormModel';

// the flat tolerance: below this the deficit is silence, not a mark
export const DEFICIT_EPS = 1e-9;
// the circuit radius as a fraction of the shortest incident edge.
// R1-FIX delta #2 (designer's floor, not a nudge): 0.2 → 0.12 — the marks
// must never obscure the cells they annotate (adjacent cube rings overlapped).
export const DEFICIT_RADIUS_FRACTION = 0.12;

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
  // R1-FIX delta #1: the circuit lies ON THE SURFACE — one arc per incident
  // face wedge (points in that face's plane at distance `radius` from the
  // vertex), never a detached tangent-plane hoop. A mark that claims "carry a
  // direction AROUND the vertex" must lie on the vertex's own faces.
  circuitArcs: Vec3[][];
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
    // the shortest incident edge sets the circuit's local scale. A SELF-LOOP
    // edge (the fan's one-edge rim: both ends the same class) spans zero
    // length and carries no scale — skipped, or the mark would collapse to
    // the 1e-6 floor (an invisible mark is a dropped value, not a small one).
    let shortest = Infinity;
    for (const edge of incident) {
      const other = edge.vertexIds[0] === reading.vertexId ? edge.vertexIds[1] : edge.vertexIds[0];
      const p = shape.vertices[other]?.position;
      if (!p) continue;
      const span = len(sub(p, center));
      if (span > 1e-12) shortest = Math.min(shortest, span);
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

    // R1-FIX delta #1 — the circuit ON the surface: per incident face wedge,
    // the in-face arc from the previous-edge direction to the next-edge
    // direction at distance `radius` (rotation about the FACE's own normal
    // keeps every sample in the face plane; consecutive wedges share their
    // edge-direction endpoints, so the arcs chain into the circuit).
    const circuitArcs: Vec3[][] = [];
    for (const face of shape.faces) {
      const cycle = face.vertexIds;
      for (let k = 0; k < cycle.length; k += 1) {
        if (cycle[k] !== reading.vertexId) continue;
        const prevPos = shape.vertices[cycle[(k - 1 + cycle.length) % cycle.length]]?.position;
        const nextPos = shape.vertices[cycle[(k + 1) % cycle.length]]?.position;
        if (!prevPos || !nextPos) continue;
        const dPrev = unit(sub(prevPos, center));
        const dNext = unit(sub(nextPos, center));
        // a quotient fan's face cycle repeats classes, so Newell can
        // degenerate (coincident/collinear placements) — the vertex's own
        // tangent normal is the honest plane then (the fan is planar by
        // construction); non-degenerate faces keep their Newell normal
        // byte-identically (R1-REBUILD)
        const fn = unit(faceNormalOf(shape, cycle)) ?? normal;
        if (!dPrev || !dNext) continue;
        let sweep = Math.atan2(dot(cross(dPrev, dNext), fn), dot(dPrev, dNext));
        // THE FAN-WRAP CORNER (R1-REBUILD): on a faithful fan the one face
        // wraps fully around the pivot, so an INTERIOR corner's two edge
        // slots aim at the SAME vertex class and the chord sweep degenerates
        // to 0 where the depicted wedge is the whole turn. The circuit must
        // CLOSE around the vertex it claims to circle — the full 2π (the fan
        // rim walk's own self-loop normalization). Boundary vertices are
        // never wrapped (a closed ring there would assert a transported
        // frame the rim does not carry); ordinary corners (distinct ends)
        // are untouched.
        if (
          reading.valence === 'interior' &&
          Math.abs(sweep) < 1e-9 &&
          cycle[(k - 1 + cycle.length) % cycle.length] === cycle[(k + 1) % cycle.length]
        ) {
          sweep = 2 * Math.PI;
        }
        // a chord-degenerate wedge (zero sweep with distinct ends) cannot be
        // resolved from straight chords — draw nothing there, fabricate
        // nothing (the wedge fan + departure + return still carry the mark)
        if (Math.abs(sweep) < 1e-9) continue;
        const steps = Math.max(4, Math.ceil(Math.abs(sweep) / (Math.PI / 24)));
        const arc: Vec3[] = [];
        for (let t = 0; t <= steps; t += 1) {
          const dir = rotateAboutAxis(dPrev, fn, (sweep * t) / steps);
          arc.push([
            center[0] + dir[0] * radius,
            center[1] + dir[1] * radius,
            center[2] + dir[2] * radius,
          ]);
        }
        circuitArcs.push(arc);
      }
    }

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
      circuitArcs,
    });
  }

  return { marked: true, refusal: null, marks };
}

// ---------------------------------------------------------------------------
// R1-FIX — THE SILENCE, READABLE (the specimen card rows; designer-found,
// mothership-ratified): REFUSED and FLAT are DIFFERENT FACTS and must not
// share a branch (the exact inverse of the H₁=0 defect).
//   · !marked (REFUSED — un-owned atom / junction link) ⇒ a REFUSAL row
//     carrying the reader's own sentence — NEVER a number, NEVER implying
//     flatness ("not measured" is not "zero");
//   · marked && no marks (MEASURED, genuinely δ=0 everywhere) ⇒ NO row —
//     genuine silence (a real δ=0 is a real value; the world rightly draws
//     nothing);
//   · marks ⇒ the phrasing rows (researcher's): interior "cone point ·
//     deficit N°" / "saddle point · deficit N°"; boundary "rim turn · N°"
//     (the designer's wording — "deficit" dropped on the boundary row only).
// ---------------------------------------------------------------------------
export interface DeficitCardRow {
  label: string;
  value: string;
}

export function deficitCardRows(model: DeficitRegisterModel): DeficitCardRow[] {
  if (!model.marked) {
    return [
      {
        label: 'deficit',
        value: `not measured · ${model.refusal ?? 'the reading refused'}`,
      },
    ];
  }
  if (model.marks.length === 0) return [];
  const buckets = new Map<string, number>();
  for (const mark of model.marks) {
    const degrees = Math.round(((mark.wedgeAngle * 180) / Math.PI) * 10) / 10;
    const phrase =
      mark.valence === 'boundary'
        ? `rim turn · ${degrees}°`
        : mark.wedgeAngle > 0
          ? `cone point · deficit ${degrees}°`
          : `saddle point · deficit ${degrees}°`;
    buckets.set(phrase, (buckets.get(phrase) ?? 0) + 1);
  }
  return [...buckets.entries()].map(([phrase, count]) => ({
    label: 'deficit',
    value: count === 1 ? phrase : `${phrase} ×${count}`,
  }));
}

// ---------------------------------------------------------------------------
// R1-REBUILD — THE FAITHFUL MODE READS (2026-08-02; Arman-caught, corrected
// seal): the fold-born cone renders `faithful` and BOTH readers (world layer ·
// card) dropped it to a silent null. The cure lives HERE, testable (the
// R1-FIX2 lesson — the DISPATCH is the defect site, so the dispatch is model
// code the witness can drive, never a view closure):
//   · the faithful body is `FaithfulBodyModel.shape` (the person's own
//     quotient shape, ids intact), read WITH its acquired complex — the
//     valence (interior cone vs boundary rim) is quotient-correct only
//     through the gate; WITHOUT the complex the rim mis-reads and Σ ≠ 2πχ;
//   · the marks land on the FAN's real placements (`apex` + `rimVertices`)
//     — the depiction's own 3D surface — never the flat pre-fold positions;
//     `readVertexCurvatures` is position-blind, so repositioning moves the
//     mark and cannot move the value;
//   · acquisition runs on the ORIGINAL shape (the recovery replays the birth
//     word and byte-compares — a repositioned shape would refuse honestly
//     for the wrong reason); only the register reads the repositioned one;
//   · a null acquire REFUSES (the R1-fix split) — never a false mark.
// ---------------------------------------------------------------------------

export type FaithfulDeficitDatum =
  | { kind: 'read'; shape: Shape; complex: AssembledComplex; source: ComplexSource }
  | { kind: 'refused'; refusal: string };

// the fan reposition — total-or-refuse: every vertex class lands on its fan
// placement (apex at the pivot, rim on the base circle) or the datum refuses
// whole; nothing is half-drawn. In the fan family this never triggers — the
// family IS apex ∪ rim (faithfulBodyVerdict's own gate).
export function repositionShapeToFan(model: FaithfulBodyModel): Shape | null {
  const placement = new Map<string, Vec3>([
    [model.apex.id, model.apex.position],
    ...model.rimVertices.map((r) => [r.id, r.position] as [string, Vec3]),
  ]);
  const vertices: Shape['vertices'] = {};
  for (const [id, vertex] of Object.entries(model.shape.vertices)) {
    const position = placement.get(id);
    if (!position) return null;
    vertices[id] = { ...vertex, position };
  }
  return { ...model.shape, vertices };
}

export function faithfulDeficitDatum(
  model: FaithfulBodyModel,
  lineage: Shape[],
): FaithfulDeficitDatum {
  const acquired = acquireFaithfulComplex(model.shape, lineage);
  if (!acquired) {
    return {
      kind: 'refused',
      refusal:
        'deficitRegister: the faithful complex did not acquire — without it the valence would be false (no mark is honest; a false mark is not)',
    };
  }
  const fan = repositionShapeToFan(model);
  if (!fan) {
    return {
      kind: 'refused',
      refusal:
        'deficitRegister: a vertex class has no fan placement — the mark cannot land on the drawn body (nothing is half-drawn)',
    };
  }
  return { kind: 'read', shape: fan, complex: acquired.complex, source: acquired.source };
}

// THE MODE DISPATCH — total over WrittenRender (N-A ≠ DROPPED, the scar's
// cure): every render mode resolves to a REASONED reading; no branch may fall
// through to a silent null (a silent null cannot tell "flat/N-A" from
// "dropped" — the exact re-opened R1 defect).
//   · plain / classBody — the drawn body, read exactly as before (no complex:
//     the simplicial population's shape-level link walk stands);
//   · faithful — the fan datum above (complex-borne, fan-placed); a refused
//     datum becomes the register's own refusal (the card SPEAKS it);
//   · bodiless — the enacted ledger shape read honestly: the reader's own
//     refusal (junction / un-owned) speaks — refused is never silent;
//   · immersion — N-A: the drawn body is the smooth representative, not the
//     cell complex; a cell-body deficit is DECLARED dropped on the smooth
//     surface, never faked (measured census, witness-recorded: five
//     reachable gluings are flat; flip-glue/RP² carries two real 180° cone
//     points — the declaration IS the honest reading of that census);
//   · skeleton — N-A: no faces, no corner, no clause.

export type DeficitRenderReading =
  | { kind: 'measured'; model: DeficitRegisterModel }
  | { kind: 'not-applicable'; mode: 'immersion' | 'skeleton'; reason: string };

function unhandledRenderMode(render: never): never {
  throw new Error(
    `deficitRegister: unhandled render mode "${(render as { mode?: string }).mode}" — every mode must choose its clause (a silent fall-through is the R1 scar)`,
  );
}

export function readDeficitForRender(render: WrittenRender, lineage: Shape[]): DeficitRenderReading {
  if (render.mode === 'plain') {
    return { kind: 'measured', model: buildDeficitRegisterModel(render.shape) };
  }
  if (render.mode === 'classBody') {
    const body = render.model.components[0]?.body ?? null;
    if (!body) {
      return {
        kind: 'measured',
        model: {
          marked: false,
          refusal: 'deficitRegister: the class body carries no component body to read',
          marks: [],
        },
      };
    }
    return { kind: 'measured', model: buildDeficitRegisterModel(body) };
  }
  if (render.mode === 'faithful') {
    const datum = faithfulDeficitDatum(render.model, lineage);
    if (datum.kind === 'refused') {
      return { kind: 'measured', model: { marked: false, refusal: datum.refusal, marks: [] } };
    }
    return { kind: 'measured', model: buildDeficitRegisterModel(datum.shape, datum.complex) };
  }
  if (render.mode === 'bodiless') {
    return { kind: 'measured', model: buildDeficitRegisterModel(render.shape) };
  }
  if (render.mode === 'immersion') {
    return {
      kind: 'not-applicable',
      mode: 'immersion',
      reason:
        'the immersion draws a smooth representative, not the cell complex — a deficit of the cell body is DECLARED dropped on the smooth surface, never faked as a mark it does not wear',
    };
  }
  if (render.mode === 'skeleton') {
    return {
      kind: 'not-applicable',
      mode: 'skeleton',
      reason: 'a skeleton has no faces — no corner, no angle, no Gauss–Bonnet clause',
    };
  }
  return unhandledRenderMode(render);
}

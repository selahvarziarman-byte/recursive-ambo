// faithfulBodyModel — CUT 1, THE FAITHFUL BODY (stage 1): the cell-based
// renderer for the EMBEDDABLE CONE FAMILY — the person who folded a triangle
// SEES THE FOLD.
//
// THE DEFINITION (researcher, 2026-07-22, ratified): a render is FAITHFUL iff
// it draws the QUOTIENT COMPLEX'S OWN CELLS — every class exactly once, drawn
// incidence = combinatorial incidence — on a body certified by the tower, with
// boundary in the rim register, and nothing implied that the mathematics does
// not carry. This module realizes stage 1 of her stage-cut:
//   LAW A (cells)  — every vertex/edge/face class drawn once; the layout is
//                    THE FAN: the apex at the tip (the fan's pivot), each rim
//                    vertex on the base circle, each seam a RADIUS, the one
//                    face the disk between. A flat fan asserts no curvature,
//                    no symmetry beyond the depiction's own (LAW E).
//   LAW B (rim)    — the boundary circle is a CLOSED heavy-register curve
//                    (the designer's rim ink); seams wear the thin cell
//                    register. An open edge of the ink would mean an open
//                    edge of the form — so the rim closes, drawn.
//   LAW E (silence)— the body is a DRAWING of the quotient, not a solid: no
//                    geometry verdict, no orientation mark, no density.
//   stage-1 walls  — a form outside the family REFUSES with a true wall that
//                    names the unbuilt register (CUT 1b / CUT 2) and falls
//                    back to the committed class body. Never a blob claimed
//                    as cells; never a fan that hides a cell (a layout that
//                    would overlap two classes on one stroke is refused).
//
// DERIVE-ONLY · ADDITIVE: the certified complex is the committed acquisition
// (`acquireFaithfulComplex` — the replay-verified chain), the boundary reading
// is the committed `readBoundary` (free/graph/junction by FACE-SLOT count —
// parallel edge classes resolved by ID, never by endpoints), the invariants
// are the committed `readFormInvariants`. This module recomputes no invariant;
// it only PLACES the certified cells.

import type { Shape, Vec3 } from '../types/geometry';
import type { AssembledComplex } from '../lib/globalW1';
import { readFormInvariants, type FormInvariantsReadout } from '../playground/formInvariants';
import { acquireFaithfulComplex, readBoundary } from './surfaceClassifier';
import { h1LabelFromCertified } from './inkedFormModel';

// the stage walls — TRUE doors naming the unbuilt register (working text from
// the mandate; the designer's craft-pass refines wording, never the truth)
export const FAITHFUL_WALL_GENERAL =
  'this form needs the general-layout render (CUT 1b); not built yet.';
export const FAITHFUL_WALL_CROSSING =
  'this form cannot embed — it needs the declared-crossing register (CUT 2); not built yet.';

export interface FaithfulBodyModel {
  shape: Shape; // the person's own quotient shape (ids intact)
  counts: { v: number; e: number; f: number }; // OF THE CERTIFIED COMPLEX — the caption's numbers (EYE-CHECK 1)
  boundaryCircles: number; // 1 in this family — printed beside LAW B's trace
  apex: { id: string; position: Vec3 }; // the fan's pivot — the interior vertex-class
  rimVertices: Array<{ id: string; position: Vec3 }>; // base-circle placements, walk order
  seams: Array<{ id: string; from: Vec3; to: Vec3 }>; // thin cell register — one radius per interior edge-class
  rimArcs: Array<{ id: string; points: Vec3[] }>; // heavy rim register — one arc per boundary edge-class; the chain closes
  faceDisk: { radius: number; segments: number }; // the ONE face — the disk between
  invariants: FormInvariantsReadout; // the tower's body certificate (χ, w₁, class)
  h1Label: string | null;
}

export type FaithfulVerdict =
  | { ok: true; model: FaithfulBodyModel }
  | { ok: false; wall: string };

const RADIUS = 1;
const ARC_SEGMENTS = 64;

// the fan placements: rim vertex i of k sits at angle 90° − i·(360°/k) (walk
// order, clockwise from the top); the apex sits at the pivot. Pure geometry of
// the DEPICTION — no engine value is recomputed here.
const rimAngle = (i: number, k: number): number => Math.PI / 2 - (2 * Math.PI * i) / k;
const rimPoint = (angle: number): Vec3 => [
  Number((RADIUS * Math.cos(angle)).toFixed(6)),
  Number((RADIUS * Math.sin(angle)).toFixed(6)),
  0,
];

// The family test + the build, one pass: refuse-or-place. Every refusal names
// the unbuilt register (a door, not a theorem — the researcher's stage ruling).
export function faithfulBodyVerdict(shape: Shape, lineage: Shape[]): FaithfulVerdict {
  const invariants = readFormInvariants(shape, lineage);
  const nonOrientable = invariants.cert ? invariants.cert.nonOrientable : null;
  // the non-embeddable family (closed, non-orientable — RP²/Klein): the honest
  // register is the declared crossing (LAW C), which stage 1 does not build
  if (nonOrientable === true && invariants.boundary === 'closed') {
    return { ok: false, wall: FAITHFUL_WALL_CROSSING };
  }
  const acquired = acquireFaithfulComplex(shape, lineage);
  if (!acquired) return { ok: false, wall: FAITHFUL_WALL_GENERAL };
  const complex: AssembledComplex = acquired.complex;
  if (complex.faces.length !== 1) return { ok: false, wall: FAITHFUL_WALL_GENERAL };
  const boundary = readBoundary(complex);
  // the fan's domain: ONE true boundary circle, disjoint; no graph strands, no
  // junction incidence (LAW D's subjects are CUT 2's zoo); an orientable disk
  // by the certificate (χ=1 open orientable ⇒ THE DISK — the researcher's own
  // uniqueness note; a Möbius-family fold is embeddable but not fan-drawable —
  // the general-layout wall speaks)
  if (
    nonOrientable !== false ||
    invariants.boundary !== 'open' ||
    invariants.chiCertified !== 1 ||
    boundary.circles !== 1 ||
    !boundary.circlesAreDisjoint ||
    boundary.graphEdgeIds.length > 0 ||
    boundary.junctionEdgeIds.length > 0
  ) {
    return { ok: false, wall: FAITHFUL_WALL_GENERAL };
  }
  const freeIds = new Set(boundary.freeEdgeIds);
  const freeEdges = complex.edges.filter((e) => freeIds.has(e.id));
  const interiorEdges = complex.edges.filter((e) => !freeIds.has(e.id));
  if (interiorEdges.length === 0) return { ok: false, wall: FAITHFUL_WALL_GENERAL };
  const rimVertexIds = new Set<string>();
  for (const e of freeEdges) {
    rimVertexIds.add(e.u);
    rimVertexIds.add(e.v);
  }
  const apexIds = complex.vertices.filter((v) => !rimVertexIds.has(v));
  if (apexIds.length !== 1) return { ok: false, wall: FAITHFUL_WALL_GENERAL };
  const apexId = apexIds[0];
  // every seam is a RADIUS: apex↔rim, one per rim vertex at most (two seams to
  // one rim vertex would overlap on a single stroke — the eye would count one
  // where the complex holds two, so the fan refuses; LAW A over convenience)
  const seamRimTargets = new Set<string>();
  for (const e of interiorEdges) {
    const endpoints = [e.u, e.v];
    if (!endpoints.includes(apexId)) return { ok: false, wall: FAITHFUL_WALL_GENERAL };
    const rimEnd = e.u === apexId ? e.v : e.u;
    if (rimEnd === apexId || !rimVertexIds.has(rimEnd)) {
      return { ok: false, wall: FAITHFUL_WALL_GENERAL };
    }
    if (seamRimTargets.has(rimEnd)) return { ok: false, wall: FAITHFUL_WALL_GENERAL };
    seamRimTargets.add(rimEnd);
  }
  // the rim walk: order the boundary's edges into its ONE closed circle
  // (free-degree is exactly 2 per rim vertex — circlesAreDisjoint above).
  // The self-loop rim (the cone) is the one-edge walk.
  const walk: Array<{ edge: (typeof freeEdges)[number]; from: string; to: string }> = [];
  const used = new Set<string>();
  const incident = new Map<string, Array<(typeof freeEdges)[number]>>();
  for (const e of freeEdges) {
    incident.set(e.u, [...(incident.get(e.u) ?? []), e]);
    if (e.v !== e.u) incident.set(e.v, [...(incident.get(e.v) ?? []), e]);
  }
  let cursor = freeEdges[0].u;
  for (let step = 0; step < freeEdges.length; step += 1) {
    const next = (incident.get(cursor) ?? []).find((e) => !used.has(e.id));
    if (!next) return { ok: false, wall: FAITHFUL_WALL_GENERAL };
    used.add(next.id);
    const to = next.u === cursor ? next.v : next.u;
    walk.push({ edge: next, from: cursor, to });
    cursor = to;
  }
  if (cursor !== walk[0].from || used.size !== freeEdges.length) {
    return { ok: false, wall: FAITHFUL_WALL_GENERAL };
  }
  // placements: rim vertices in walk order around the base circle; the apex at
  // the pivot; each rim edge-class the arc between its endpoints' angles
  const orderedRim: string[] = [];
  for (const stepEntry of walk) {
    if (!orderedRim.includes(stepEntry.from)) orderedRim.push(stepEntry.from);
  }
  const k = orderedRim.length;
  const angleOf = new Map(orderedRim.map((v, i) => [v, rimAngle(i, k)]));
  const positionOf = new Map(orderedRim.map((v, i) => [v, rimPoint(rimAngle(i, k))]));
  const apexPosition: Vec3 = [0, 0, 0];
  const rimArcs = walk.map((stepEntry, i) => {
    const a0 = angleOf.get(stepEntry.from) as number;
    // each arc sweeps CLOCKWISE to the next vertex's angle; the self-loop and
    // the final closing edge sweep the remaining full turn back to the start
    const target = (angleOf.get(stepEntry.to) as number);
    let sweep = a0 - target;
    while (sweep <= 0) sweep += 2 * Math.PI;
    if (k === 1) sweep = 2 * Math.PI; // the one-vertex rim: the whole circle
    const segments = Math.max(12, Math.round((ARC_SEGMENTS * sweep) / (2 * Math.PI)));
    const points: Vec3[] = [];
    for (let s = 0; s <= segments; s += 1) {
      points.push(rimPoint(a0 - (sweep * s) / segments));
    }
    return { id: stepEntry.edge.id, points };
  });
  const model: FaithfulBodyModel = {
    shape,
    counts: { v: complex.vertices.length, e: complex.edges.length, f: complex.faces.length },
    boundaryCircles: boundary.circles,
    apex: { id: apexId, position: apexPosition },
    rimVertices: orderedRim.map((id) => ({ id, position: positionOf.get(id) as Vec3 })),
    seams: interiorEdges.map((e) => ({
      id: e.id,
      from: apexPosition,
      to: positionOf.get(e.u === apexId ? e.v : e.u) as Vec3,
    })),
    rimArcs,
    faceDisk: { radius: RADIUS, segments: ARC_SEGMENTS },
    invariants,
    h1Label: h1LabelFromCertified(invariants),
  };
  return { ok: true, model };
}

// the route's thin door: model-or-null (the walls stay measurable through
// faithfulBodyVerdict; a null falls through to the committed class body)
export function tryFaithfulBodyModel(shape: Shape, lineage: Shape[]): FaithfulBodyModel | null {
  const verdict = faithfulBodyVerdict(shape, lineage);
  return verdict.ok ? verdict.model : null;
}

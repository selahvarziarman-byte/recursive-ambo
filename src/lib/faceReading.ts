// ═══ THE FACE'S READING — `STAMP C-5`, 2026-09-23: the composition of the three
// records around one face of the seed, computed on the TYPE. NOT_FROZEN while only
// components and witnesses import it.
//
// THE SECOND IMPLEMENTATION of the researcher's face_residue_reading.py
// (.handoff/instruments/connection_layer_reference, 2026-09-22) — the ADR 0031
// kill-condition pattern: a disagreement between the two implementations reopens
// the DEFINITION, never tunes the code to the number. The seal it must reproduce,
// on the record's own first face (Flow · T · Φ, the 42 hand triples): at base Flow
// 76 Mov pairs and 0 corner-local refusals (Flow declares no negative and every
// mark is `has` — a merge can only ever add `holds`); at base T 39 Mov pairs and 7
// refusals in 6 triples (T declares three negatives); at base Φ 45 Mov pairs and 0
// refusals; `(i)+S1+Q` at T: Mov {r1 ↦ r8}, `sustains(r8, r0) does-not-hold against
// sustains(r1, r0) holds — once r8 ≡ r1`; `(i)+B'+P` at T: Mov {r0 ↦ r2, r2 ↦ r0},
// `sustains(r8, r2) holds against sustains(r8, r0) does-not-hold — once r2 ≡ r0`.
// The structure (A1–A4 of the instrument, 0 failures on 20,000 random triples):
// dom h ⊆ dom of the first step; Fix ⊔ Mov = dom h and Und = R ∖ dom h (a
// partition); a role in no edge's domain is never in Fix ∪ Mov; every Und role
// has EXACTLY ONE first-break edge (the address is well defined). ⚠ Und(h) ≠
// Und(h⁻¹) on some triples (7,204 of 20,000): the reading is ORIENTATION-RELATIVE
// and the surface states the direction it walked.
//
// THE RESIDUE at a base corner X (0031 §1.4's composition order — the first step
// first): walk X → Y → Z → X through the three records, each read IN THE WALK'S
// DIRECTION from the edge's own `vertexIds` AT THE MOMENT OF READING (a record
// reads first corner ↦ second; walked against its edge it is inverted) — never a
// stored direction, because C-7e measured the orientation is not stable across
// dissections. h_X : R_X ⇀ R_X, a partial injection.
//   Fix   h(x) = x — the person's direct map and his own route through the third
//         corner AGREE (proj⁻¹ ∘ J = h, the projection route identity)
//   Mov   h(x) = x' ≠ x — they DIVERGE; the face's world identifies x ∼ x'
//   Und   the circuit BROKE — one kind, WITH AN ADDRESS: the one step at which x's
//         own circuit ran out. ⛔⛔ NEVER printed as "the person has not said": in
//         5,860 of 20,000 triples a role is Und although the person spoke on both
//         the direct map and the route and they differ — its forward circuit broke
//         further along. The word is 0031 §1.5's own: DID NOT RETURN.
// THE DOMAIN (the mothership's 1705 §4.4): dom h_X IS the face's core at X
// (dom h_X ⊆ dom J_XY, a theorem) — the edge's ρ = A ⊖ K one dimension up, differing
// in exactly one way: at the edge the core is GIVEN, at the face it is DERIVED. The
// ambient set stays R_X, never shrunk to the core — Und is measured against it, and
// Und is content. `domain` and `gap` are real parameters (1705 §4.1) with the ruled
// values as defaults; ORIENTATION is load-bearing and NOT a parameter.
// THE EMPTY-CORE GUARD: any of the three edges without a record ⇒ NO composite — a
// true absence in words, never an empty map read as an identity.
// ⛔⛔ THE FACE IS REFUSABLE — THE COLIMIT MUST BE ATTEMPTED, NEVER ASSUMED (the
// researcher's guard, 1705 §4.5): the face's world identifies x ∼ h(x), and a
// corner's OWN record can then say two things about one tuple — then there is no
// such world. Same KIND as the edge's refusal; new SITE, new CAUSE: no single edge
// can see it, three acts jointly produce it. The check here is CORNER-LOCAL (both
// tuples that corner's own, in that corner's own word, so no τ can rescue them) —
// SUFFICIENT for refusal, not necessary: the count is a LOWER BOUND (a cross-corner
// contradiction needs the full three-corner colimit with the τ's, unbuilt). A
// refusal names FOUR things — the two tuples with their values · the corner they
// belong to · the merged pair that collapsed them · the three edges whose
// composition produced the merge — and the person withdraws ONE of the three acts;
// the device must not choose (the two-handed control one dimension up: three
// hands). On a refused face nothing else is read: a `Fix · Mov · Und` of a world
// that does not exist is not printed.

import type { ConceptSpace, Edge, VertexId } from '../types/geometry';
import { valuesAgree } from './jRegister';

export type RoleMap = Map<string, string>;

/** one step of the walk — the edge's record read in the walk's direction, from its `vertexIds` at the moment of reading */
export interface FaceStep {
  from: VertexId;
  to: VertexId;
  edge: Edge;
  reversed: boolean; // the walk runs against the edge's own orientation — the record is inverted for this step
  map: RoleMap; // from's role ↦ to's role
}

export interface FaceWalk {
  corners: [VertexId, VertexId, VertexId]; // the direction walked: corners[0] → corners[1] → corners[2] → corners[0]
  steps: [FaceStep, FaceStep, FaceStep];
}

/** a role whose circuit did not return, with its address — the one step at which it ran out */
export interface UndRole {
  role: string;
  brokeAt: { from: VertexId; to: VertexId };
}

export interface CornerReading {
  corner: VertexId;
  walk: [VertexId, VertexId, VertexId]; // the loop based here, in the face's direction
  h: RoleMap; // the residue
  fix: string[];
  mov: Array<[string, string]>;
  und: UndRole[];
  core: string[]; // dom h — DERIVED (at the edge the core is given)
  ambient: string[]; // the corner's own roles, never shrunk
  excluded: string[]; // roles a `gap` policy excluded from the reading (empty under the ruled default)
}

/** one act the person can withdraw — the pair as it stands on the EDGE'S OWN record (first corner ↦ second) */
export interface FaceHand {
  edge: Edge;
  pair: [string, string];
  from: VertexId; // the edge's first corner
  to: VertexId; // its second
}

export interface FaceTuple {
  type: string;
  terms: string[];
  value: string;
}

export interface FaceRefusal {
  corner: VertexId;
  kind: 'tuple' | 'mark';
  first: FaceTuple; // the tuple met later in the corner's own record
  second: FaceTuple; // the one it collapsed onto
  merged: Array<[string, string]>; // x ≡ y — the collapsing pair(s)
  hands: FaceHand[]; // the acts whose composition merged them — three per merged pair
}

export type FaceResult =
  | { state: 'absent'; missing: Array<{ from: VertexId; to: VertexId }> }
  | { state: 'refused'; walk: FaceWalk; refusals: FaceRefusal[] }
  | { state: 'read'; walk: FaceWalk; readings: [CornerReading, CornerReading, CornerReading] };

export interface FaceOptions {
  /** the set a corner's reading is measured against — ruled `ambient` (the corner's own roles, never shrunk); `core` reads on dom h alone */
  domain?: 'ambient' | 'core';
  /** what a break means — ruled: every break is `Und` with its address; `excluded` drops the role from the reading */
  gap?: (brokeAt: { from: VertexId; to: VertexId }, role: string) => 'Und' | 'excluded';
}

const pairOf = (x: VertexId, y: VertexId): string => [x, y].sort().join('|');

/** the edge between two corners, whichever way it is stored */
export function edgeBetween(edges: Edge[], x: VertexId, y: VertexId): Edge | undefined {
  return edges.find((e) => pairOf(e.vertexIds[0], e.vertexIds[1]) === pairOf(x, y));
}

/** the record read in the walk's direction — from the edge's `vertexIds` at the moment of reading */
export function readStep(edges: Edge[], from: VertexId, to: VertexId): FaceStep | null {
  const edge = edgeBetween(edges, from, to);
  const roles = edge?.identification?.roles ?? [];
  if (!edge || roles.length === 0) return null;
  const reversed = edge.vertexIds[0] !== from;
  const map: RoleMap = new Map();
  for (const [x, y] of roles) {
    if (reversed) map.set(y, x);
    else map.set(x, y);
  }
  return { from, to, edge, reversed, map };
}

/** the walk around the face in the given direction; null (with the missing edges) when any edge carries no record */
export function walkOf(corners: [VertexId, VertexId, VertexId], edges: Edge[]): { walk: FaceWalk | null; missing: Array<{ from: VertexId; to: VertexId }> } {
  const legs: Array<[VertexId, VertexId]> = [[corners[0], corners[1]], [corners[1], corners[2]], [corners[2], corners[0]]];
  const steps = legs.map(([from, to]) => readStep(edges, from, to));
  const missing = legs.filter((_, i) => steps[i] === null).map(([from, to]) => ({ from, to }));
  if (missing.length) return { walk: null, missing };
  return { walk: { corners, steps: steps as [FaceStep, FaceStep, FaceStep] }, missing: [] };
}

/** the loop based at one corner, in the face's direction */
function rotate(walk: FaceWalk, base: VertexId): [FaceStep, FaceStep, FaceStep] {
  const i = walk.corners.indexOf(base);
  if (i < 0) throw new Error(`faceReading: ${base} is not a corner of this face`);
  return [walk.steps[i], walk.steps[(i + 1) % 3], walk.steps[(i + 2) % 3]];
}

/** the first step at which a role's circuit ran out — or null if it returned */
export function firstBreak(steps: [FaceStep, FaceStep, FaceStep], role: string): FaceStep | null {
  const b = steps[0].map.get(role);
  if (b === undefined) return steps[0];
  const c = steps[1].map.get(b);
  if (c === undefined) return steps[1];
  if (!steps[2].map.has(c)) return steps[2];
  return null;
}

/**
 * THE RESIDUE at a base corner: the composition of the three records through the other two corners, read `Fix · Mov · Und`
 * on the corner's own roles (ruled) — `domain` and `gap` are parameters; the direction is the walk's and not one.
 */
export function composeThroughCorner(walk: FaceWalk, base: VertexId, cast: ConceptSpace, options: FaceOptions = {}): CornerReading {
  const steps = rotate(walk, base);
  const domain = options.domain ?? 'ambient';
  const gap = options.gap ?? (() => 'Und' as const);
  const h: RoleMap = new Map();
  const und: UndRole[] = [];
  const excluded: string[] = [];
  const ambient = cast.roles.map((r) => r.id);
  for (const x of ambient) {
    const b = steps[0].map.get(x);
    const c = b === undefined ? undefined : steps[1].map.get(b);
    const back = c === undefined ? undefined : steps[2].map.get(c);
    if (back !== undefined) {
      h.set(x, back);
      continue;
    }
    const broke = firstBreak(steps, x) as FaceStep;
    const at = { from: broke.from, to: broke.to };
    if (gap(at, x) === 'excluded') excluded.push(x);
    else und.push({ role: x, brokeAt: at });
  }
  const fix = [...h.entries()].filter(([x, y]) => x === y).map(([x]) => x);
  const mov = [...h.entries()].filter(([x, y]) => x !== y) as Array<[string, string]>;
  const core = [...h.keys()];
  return {
    corner: base,
    walk: [steps[0].from, steps[1].from, steps[2].from],
    h,
    fix,
    mov,
    und: domain === 'core' ? [] : und,
    core,
    ambient: domain === 'core' ? core : ambient,
    excluded,
  };
}

/** the three acts whose composition carried x around to h(x) — each as it stands on its edge's own record */
function handsOf(steps: [FaceStep, FaceStep, FaceStep], x: string): FaceHand[] {
  const b = steps[0].map.get(x) as string;
  const c = steps[1].map.get(b) as string;
  const back = steps[2].map.get(c) as string;
  const hand = (step: FaceStep, from: string, to: string): FaceHand => ({
    edge: step.edge,
    pair: step.reversed ? [to, from] : [from, to],
    from: step.edge.vertexIds[0],
    to: step.edge.vertexIds[1],
  });
  return [hand(steps[0], x, b), hand(steps[1], b, c), hand(steps[2], c, back)];
}

/**
 * THE GUARD — the corner-local check: merge x ∼ h(x) inside the corner's OWN record; every tuple (and every mark) the merge
 * makes say two things is a refusal, with the pair that collapsed it and the three acts that produced the merge.
 */
export function cornerRefusals(walk: FaceWalk, reading: CornerReading, cast: ConceptSpace): FaceRefusal[] {
  const steps = rotate(walk, reading.corner);
  const parent = new Map<string, string>(cast.roles.map((r) => [r.id, r.id]));
  const find = (x: string): string => {
    let r = parent.get(x) ?? x;
    while (parent.get(r) !== undefined && parent.get(r) !== r) r = parent.get(r) as string;
    return r;
  };
  for (const [x, y] of reading.mov) {
    const rx = find(x);
    const ry = find(y);
    if (rx !== ry) parent.set(rx, ry);
  }
  // the Mov pairs as a graph — the path between two collapsed roles names the acts that merged them
  const adjacent = new Map<string, Array<{ to: string; via: string }>>();
  for (const [x, y] of reading.mov) {
    if (!adjacent.has(x)) adjacent.set(x, []);
    if (!adjacent.has(y)) adjacent.set(y, []);
    (adjacent.get(x) as Array<{ to: string; via: string }>).push({ to: y, via: x });
    (adjacent.get(y) as Array<{ to: string; via: string }>).push({ to: x, via: x });
  }
  const pathHands = (x: string, y: string): FaceHand[] => {
    const prev = new Map<string, { from: string; via: string } | null>([[x, null]]);
    const queue = [x];
    while (queue.length) {
      const u = queue.shift() as string;
      if (u === y) break;
      for (const { to, via } of adjacent.get(u) ?? []) {
        if (prev.has(to)) continue;
        prev.set(to, { from: u, via });
        queue.push(to);
      }
    }
    const hands: FaceHand[] = [];
    let at: string = y;
    while (prev.get(at)) {
      const p = prev.get(at) as { from: string; via: string };
      hands.push(...handsOf(steps, p.via));
      at = p.from;
    }
    return hands;
  };
  const out: FaceRefusal[] = [];
  const seenTuples = new Map<string, FaceTuple>();
  for (const rel of cast.relations) {
    const key = `${rel.type}|${rel.terms.map(find).join(',')}`;
    const seen = seenTuples.get(key);
    const tuple: FaceTuple = { type: rel.type, terms: [...rel.terms], value: rel.polarity };
    if (seen && seen.value !== tuple.value) {
      const merged = tuple.terms.map((t, i) => [t, seen.terms[i]] as [string, string]).filter(([a, b]) => a !== b);
      out.push({ corner: reading.corner, kind: 'tuple', first: tuple, second: seen, merged, hands: merged.flatMap(([a, b]) => pathHands(a, b)) });
    } else if (!seen) seenTuples.set(key, tuple);
  }
  const seenMarks = new Map<string, { role: string; value: string }>();
  for (const role of cast.roles) {
    for (const [k, v] of Object.entries(role.types ?? {})) {
      if (v === 'UNKNOWN') continue;
      const key = `${k}|${find(role.id)}`;
      const seen = seenMarks.get(key);
      if (seen && !valuesAgree(k, k, seen.value, v)) {
        out.push({
          corner: reading.corner,
          kind: 'mark',
          first: { type: k, terms: [role.id], value: v },
          second: { type: k, terms: [seen.role], value: seen.value },
          merged: [[role.id, seen.role]],
          hands: pathHands(role.id, seen.role),
        });
      } else if (!seen) seenMarks.set(key, { role: role.id, value: v });
    }
  }
  return out;
}

/**
 * THE FACE: the three corners in the direction to walk, their casts, the current shape's edges. The empty-core guard first;
 * then the colimit ATTEMPTED at every corner (the guard); only an unrefused face is read.
 */
export function faceOf(corners: [VertexId, VertexId, VertexId], casts: Record<VertexId, ConceptSpace | undefined>, edges: Edge[], options: FaceOptions = {}): FaceResult {
  const { walk, missing } = walkOf(corners, edges);
  if (!walk) return { state: 'absent', missing };
  const readings = corners.map((c) => {
    const cast = casts[c];
    if (!cast) throw new Error(`faceReading: no cast on corner ${c}`);
    return composeThroughCorner(walk, c, cast, options);
  }) as [CornerReading, CornerReading, CornerReading];
  const refusals = readings.flatMap((r) => cornerRefusals(walk, r, casts[r.corner] as ConceptSpace));
  if (refusals.length) return { state: 'refused', walk, refusals };
  return { state: 'read', walk, readings };
}

/** the Und roles grouped by the step they broke at, in the walk's order */
export function undByStep(reading: CornerReading): Array<{ from: VertexId; to: VertexId; roles: string[] }> {
  const legs: Array<[VertexId, VertexId]> = [[reading.walk[0], reading.walk[1]], [reading.walk[1], reading.walk[2]], [reading.walk[2], reading.walk[0]]];
  return legs.map(([from, to]) => ({ from, to, roles: reading.und.filter((u) => u.brokeAt.from === from && u.brokeAt.to === to).map((u) => u.role) }));
}

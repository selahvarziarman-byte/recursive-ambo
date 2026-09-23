// ═══ THE BORN FACE — `STAMP C-9`, 2026-09-23: the face reading at generation ≥ 1,
// through the resolver. NOT_FROZEN (row 220, classified at its landing). It imports
// the resolver (spaceOf) AND the gen-0 face (faceReading) — which import each other's
// neighbour but not each other — so it lives beside both, never inside either.
//
// THE SECOND IMPLEMENTATION of the researcher's born_face_reading.py
// (.handoff/instruments/connection_layer_reference, 2026-09-23; their 1353 §1,
// ratified §123.1 / §125.2 as ADR 0031 §3.8) — the kill-condition pattern: a
// disagreement between the two implementations reopens the DEFINITION, never tunes
// the code to a number. Its seal, on the record's own fixtures (A flow · B t-cell ·
// C phi · D triangle; the 42 hand triples on A–B, B–C, C–A; A–D, B–D, C–D unmapped;
// one dissection): pinned by scripts/diagnose-the-born-face.cjs.
//
// THE THREE EDGES of a born face compose each edge's J BY ITS KIND (0031 §3.5 —
// exactly what the resolver glues over): a CORNER edge the carried coprojection, a
// MEDIAL edge the anchored meet ∪ the person's BORN pairs; a seed edge (a face never
// has one — kept for the type) the record. Each record is read in the WALK's
// direction from the edge's `vertexIds` at the moment of reading, as at gen 0.
//   THE SOLID PART — the reading with every born room EMPTY (the composed identity
//   alone on every edge): DERIVED from gen 0 and never an act — the GROUND. On the
//   interior face `1_D` on the born corner's shared part; on the corner-cell face `1`
//   on all of the seed; on the medial face the seed face's route transported, plus
//   the roles it carries that no reading based at the seed mentions (the researcher's
//   amendment: it is derived, but not the seed face's own `h`).
//   THE EXTENSION — the reading with the born pairs: it EXTENDS the solid one
//   (monotone), and every added route runs through at least one born pair — the
//   NEWS, attributed to the born pair(s) it runs through.
//   A REFUSAL names PAIRS of tuples (the researcher's lesson: naming "the tuple met
//   first" shifts as born acts arrive though nothing un-contradicts); a refusal that
//   stands with the born rooms empty is INHERITED from the seed face and its hands
//   are that face's; one that needs a born pair is attributed to it.
//   `Und` — the address is an EDGE OF THE BORN FACE (the step the circuit ran out
//   at) and its DESCENT to the parent seed edge is derived: a break on the edge
//   leaving a born vertex M_XY descends from the silence of its own parent edge X–Y.
//   THE DOMAIN inside spaceOf(born corner): the core = dom h, derived every read.
// Everything here is derived at every read and stored nowhere.

import type { Edge, Shape, VertexId } from '../types/geometry';
import { composedOn, edgeKind, recordOn, spaceOf, type EdgeKind, type Resolved, type SpaceOfOptions } from './spaceOf';
import { composeThroughCorner, edgeBetween, type CornerReading, type FaceStep, type FaceTuple, type FaceWalk, type RoleMap } from './faceReading';
import { valuesAgree } from './jRegister';

/** one step of a born face's walk — the edge's J by its KIND, read in the walk's direction; the solid map and the full map */
export interface BornStep extends FaceStep {
  kind: EdgeKind;
  solidMap: RoleMap; // the composed identity alone (the born room empty)
  bornPairs: Set<string>; // `x\u0000y` in the walk's direction — the person's born pairs on this edge
  siteId: VertexId | null; // the midpoint minted on this edge — where a born pair is made — when the shape holds it
  descent: { from: VertexId; to: VertexId; edge: Edge | null } | null; // the parent seed edge of `from` when `from` is a born vertex: the silence a break here descends from
}

export interface BornWalk {
  corners: [VertexId, VertexId, VertexId];
  steps: [BornStep, BornStep, BornStep];
  solid: FaceWalk; // the same steps with the solid maps
  full: FaceWalk; // the same steps with the full maps
}

/** a pair of the person's on one step — the act a route or a merge runs through */
export interface BornAct {
  from: VertexId;
  to: VertexId;
  edge: Edge;
  pair: [string, string]; // in the walk's direction
  stored: [string, string]; // as the edge's record holds it (first corner ↦ second) — what a withdrawal names
  siteId: VertexId | null;
}

/** a route that exists only through born pairs — the news, attributed */
export interface BornRoute {
  role: string;
  to: string; // h(role) under the extension
  through: BornAct[]; // the born pairs on the route (at least one, by the monotone law)
}

export interface BornUnd {
  role: string;
  brokeAt: { from: VertexId; to: VertexId };
  descent: BornStep['descent'];
}

export interface BornCornerReading {
  corner: VertexId;
  resolved: Resolved;
  solid: CornerReading; // the ground
  full: CornerReading; // with the born pairs
  news: BornRoute[];
  und: BornUnd[]; // under the extension, each with its address and its descent
}

export interface BornRefusal {
  corner: VertexId;
  kind: 'tuple' | 'mark';
  first: FaceTuple;
  second: FaceTuple;
  merged: Array<[string, string]>;
  inherited: boolean; // stands with the born rooms empty — the seed face's own refusal, its hands that face's
  through: BornAct[]; // the born pairs on the merge path (empty when inherited)
}

export type BornFaceResult =
  | { state: 'absent'; missing: VertexId[] } // a corner without a space, or an edge the shape does not hold
  | { state: 'refused'; walk: BornWalk; refusals: BornRefusal[] }
  | { state: 'read'; walk: BornWalk; readings: [BornCornerReading, BornCornerReading, BornCornerReading] };

const key = (x: string, y: string): string => `${x}\u0000${y}`;

/** the midpoint minted on an edge — the vertex whose two parents are its ends — when the shape holds it */
const siteOn = (shape: Shape, e: Edge): VertexId | null =>
  Object.values(shape.vertices).find((v) => v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(e.vertexIds[0]) && v.createdBy.sourceVertexIds.includes(e.vertexIds[1]))?.id ?? null;

/** one step: the edge between `from` and `to`, its J by its kind, both maps in the walk's direction */
export function bornStepOf(shape: Shape, from: VertexId, to: VertexId, options: SpaceOfOptions = {}, memo: Map<VertexId, Resolved | null> = new Map()): BornStep | null {
  const e = edgeBetween(shape.edges, from, to);
  if (!e) return null;
  const R0 = spaceOf(shape, e.vertexIds[0], options, memo);
  const R1 = spaceOf(shape, e.vertexIds[1], options, memo);
  if (!R0 || !R1) return null;
  const kind = edgeKind(shape, e.vertexIds[0], e.vertexIds[1]);
  const composed = composedOn(shape, R0, R1, [e.vertexIds[0], e.vertexIds[1]], kind, options.meet);
  const record = kind === 'corner' ? { roles: [], types: [] } : recordOn(e, options);
  const reversed = e.vertexIds[0] !== from;
  const solidMap: RoleMap = new Map();
  // a seed edge's record is the ground too (a born face never holds one; the type allows it)
  const ground = kind === 'seed' ? record.roles : composed.roles;
  for (const [x, y] of ground) {
    if (reversed) solidMap.set(y, x);
    else solidMap.set(x, y);
  }
  const map: RoleMap = new Map(solidMap);
  const bornPairs = new Set<string>();
  if (kind === 'medial') {
    for (const [x, y] of record.roles) {
      const [p, q] = reversed ? [y, x] : [x, y];
      map.set(p, q);
      bornPairs.add(key(p, q));
    }
  }
  const fromV = shape.vertices[from];
  const parents = fromV && fromV.createdBy.operation !== 'seed' && fromV.createdBy.sourceVertexIds.length === 2 ? fromV.createdBy.sourceVertexIds : null;
  const descent = parents ? { from: parents[0], to: parents[1], edge: edgeBetween(shape.edges, parents[0], parents[1]) ?? null } : null;
  return { from, to, edge: e, reversed, map, kind, solidMap, bornPairs, siteId: siteOn(shape, e), descent };
}

const rotate = (walk: BornWalk, base: VertexId): [BornStep, BornStep, BornStep] => {
  const i = walk.corners.indexOf(base);
  return [walk.steps[i], walk.steps[(i + 1) % 3], walk.steps[(i + 2) % 3]];
};

const actOf = (step: BornStep, x: string, y: string): BornAct => ({
  from: step.from,
  to: step.to,
  edge: step.edge,
  pair: [x, y],
  stored: step.reversed ? [y, x] : [x, y],
  siteId: step.siteId,
});

/** the born pairs a role's circuit runs through, based at a corner, under the full maps */
function routeThrough(steps: [BornStep, BornStep, BornStep], x: string): BornAct[] {
  const out: BornAct[] = [];
  let at = x;
  for (const step of steps) {
    const next = step.map.get(at);
    if (next === undefined) break;
    if (step.bornPairs.has(key(at, next))) out.push(actOf(step, at, next));
    at = next;
  }
  return out;
}

interface World {
  find: (k: string) => string;
  // the union edges, for the merge paths: `${i}|x` — `${j}|y` through step i's pair (x ↦ y), born or solid
  edges: Map<string, Array<{ to: string; step: number; pair: [string, string] }>>;
}

/** THE WORLD of a born face (the researcher's `world()`): union-find over every role of the three corner spaces, joined by the three step maps */
function worldOf(steps: [BornStep, BornStep, BornStep], useSolid: boolean): World {
  const parent = new Map<string, string>();
  const find = (k: string): string => {
    let r = parent.get(k) ?? k;
    while (parent.get(r) !== undefined && parent.get(r) !== r) r = parent.get(r) as string;
    return r;
  };
  const union = (a: string, b: string): void => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent.set(ra, rb);
  };
  const edges = new Map<string, Array<{ to: string; step: number; pair: [string, string] }>>();
  const link = (a: string, b: string, step: number, pair: [string, string]): void => {
    if (!edges.has(a)) edges.set(a, []);
    if (!edges.has(b)) edges.set(b, []);
    (edges.get(a) as Array<{ to: string; step: number; pair: [string, string] }>).push({ to: b, step, pair });
    (edges.get(b) as Array<{ to: string; step: number; pair: [string, string] }>).push({ to: a, step, pair });
  };
  steps.forEach((s, i) => {
    const j = (i + 1) % 3;
    for (const [x, y] of useSolid ? s.solidMap : s.map) {
      union(`${i}|${x}`, `${j}|${y}`);
      link(`${i}|${x}`, `${j}|${y}`, i, [x, y]);
    }
  });
  return { find, edges };
}

/** the born pairs on a path between two world nodes (BFS over the union edges) */
function pathActs(world: World, steps: [BornStep, BornStep, BornStep], a: string, b: string): BornAct[] {
  const prev = new Map<string, { from: string; step: number; pair: [string, string] } | null>([[a, null]]);
  const queue = [a];
  while (queue.length) {
    const u = queue.shift() as string;
    if (u === b) break;
    for (const e of world.edges.get(u) ?? []) {
      if (prev.has(e.to)) continue;
      prev.set(e.to, { from: u, step: e.step, pair: e.pair });
      queue.push(e.to);
    }
  }
  const acts: BornAct[] = [];
  let at = b;
  while (prev.get(at)) {
    const p = prev.get(at) as { from: string; step: number; pair: [string, string] };
    const step = steps[p.step];
    if (step.bornPairs.has(key(p.pair[0], p.pair[1]))) acts.push(actOf(step, p.pair[0], p.pair[1]));
    at = p.from;
  }
  return acts.reverse();
}

/** the seed corners a role's tags name — a tuple is one seed corner's when every term carries that corner */
const cornersOf = (R: Resolved, role: string): Set<string> => new Set([...(R.roleContent.get(role) ?? [])].map((t) => t.slice(0, t.indexOf('|'))));

/**
 * THE GUARD on a born face — the colimit attempted over the face's WORLD: two tuples of one corner's own record (its
 * space's, derived) with different values whose terms collapse under the world are a refusal, named as a PAIR with the
 * merged pair(s); the same seed tuple pair met at two born corners (a seed's tuple lives in both midpoints of its edges)
 * is one refusal. `inherited` when it stands with the born rooms empty.
 */
function refusalsOf(walk: BornWalk, resolved: [Resolved, Resolved, Resolved], useSolid: boolean): BornRefusal[] {
  const world = worldOf(walk.steps, useSolid);
  const out: BornRefusal[] = [];
  const seenSignatures = new Set<string>();
  const signature = (k: number, kind: string, first: FaceTuple, second: FaceTuple): string => {
    const R = resolved[k];
    const tagsOf = (t: string): string[] => [...(R.roleContent.get(t) ?? [])].sort();
    // the seed corner every term of both tuples shares — the tuple's home; else the full tag sets
    const common = [first, second].flatMap((tp) => tp.terms).map((t) => cornersOf(R, t)).reduce((acc, s) => new Set([...acc].filter((c) => s.has(c))));
    const home = [...common].sort()[0];
    const named = (tp: FaceTuple): string => tp.terms.map((t) => (home ? tagsOf(t).filter((g) => g.startsWith(`${home}|`)).join('+') : tagsOf(t).join('+'))).join(',');
    // the word by its seed tag too — a glued space names a word by its display (`sustains [B]` here, `sustains` there), the tag is one
    const word = (tp: FaceTuple): string => { const tags = [...(R.wordContent.get(tp.type) ?? [])].sort(); const own = home ? tags.filter((g) => g.startsWith(`${home}|`)) : tags; return own.length ? own.join('+') : tp.type; };
    return `${kind}|${word(first)}|${named(first)}|${first.value}|${word(second)}|${named(second)}|${second.value}`;
  };
  walk.corners.forEach((corner, k) => {
    const R = resolved[k];
    const at = (t: string): string => world.find(`${k}|${t}`);
    // EVERY contradicted pair within a collapsed class — never "the tuple met first" (the researcher's b3 lesson: extra merges change which tuple is met first; at the grain of PAIRS nothing un-contradicts)
    const groups = new Map<string, FaceTuple[]>();
    for (const rel of R.space.relations) {
      const wk = `${rel.type}|${rel.terms.map(at).join(',')}`;
      (groups.get(wk) ?? groups.set(wk, []).get(wk)!).push({ type: rel.type, terms: [...rel.terms], value: rel.polarity });
    }
    for (const tuples of groups.values()) {
      for (let a = 0; a < tuples.length; a += 1) {
        for (let b = a + 1; b < tuples.length; b += 1) {
          const earlier = tuples[a];
          const later = tuples[b];
          if (earlier.value === later.value) continue;
          const sig = signature(k, 'tuple', later, earlier);
          const sigBack = signature(k, 'tuple', earlier, later);
          if (seenSignatures.has(sig) || seenSignatures.has(sigBack)) continue;
          seenSignatures.add(sig);
          const merged = later.terms.map((t, i) => [t, earlier.terms[i]] as [string, string]).filter(([x, y]) => x !== y);
          out.push({ corner, kind: 'tuple', first: later, second: earlier, merged, inherited: false, through: merged.flatMap(([x, y]) => pathActs(world, walk.steps, `${k}|${x}`, `${k}|${y}`)) });
        }
      }
    }
    const markGroups = new Map<string, Array<{ role: string; value: string; type: string }>>();
    for (const role of R.space.roles) {
      for (const [mk, v] of Object.entries(role.types ?? {})) {
        if (v === 'UNKNOWN') continue;
        const wk = `${mk}|${at(role.id)}`;
        (markGroups.get(wk) ?? markGroups.set(wk, []).get(wk)!).push({ role: role.id, value: v, type: mk });
      }
    }
    for (const marks of markGroups.values()) {
      for (let a = 0; a < marks.length; a += 1) {
        for (let b = a + 1; b < marks.length; b += 1) {
          const earlier = marks[a];
          const later = marks[b];
          if (valuesAgree(later.type, later.type, earlier.value, later.value)) continue;
          const first: FaceTuple = { type: later.type, terms: [later.role], value: later.value };
          const second: FaceTuple = { type: earlier.type, terms: [earlier.role], value: earlier.value };
          const sig = signature(k, 'mark', first, second);
          const sigBack = signature(k, 'mark', second, first);
          if (seenSignatures.has(sig) || seenSignatures.has(sigBack)) continue;
          seenSignatures.add(sig);
          out.push({ corner, kind: 'mark', first, second, merged: [[later.role, earlier.role]], inherited: false, through: pathActs(world, walk.steps, `${k}|${later.role}`, `${k}|${earlier.role}`) });
        }
      }
    }
  });
  return out;
}

/** a refusal's key at the grain of the PAIR — unordered: the same two tuples however they were met */
const refusalKey = (r: BornRefusal): string => [`${r.first.type}|${r.first.terms.join(',')}|${r.first.value}`, `${r.second.type}|${r.second.terms.join(',')}|${r.second.value}`].sort().join('||') + `|${r.kind}`;

/**
 * THE BORN FACE: the three corners in the direction to walk (a record's own order is its host cell's walk — the reverse is
 * the other cell's, a face of the solid, not a flipped face), the current shape. Each corner's space through the resolver;
 * each edge's J by its kind; the solid reading and the extension at every corner; the guard over the face's world.
 */
export function bornFaceOf(shape: Shape, corners: [VertexId, VertexId, VertexId], options: SpaceOfOptions = {}): BornFaceResult {
  const memo = new Map<VertexId, Resolved | null>();
  const resolved = corners.map((c) => spaceOf(shape, c, options, memo));
  const missing = corners.filter((_, i) => !resolved[i]);
  if (missing.length) return { state: 'absent', missing };
  const legs: Array<[VertexId, VertexId]> = [[corners[0], corners[1]], [corners[1], corners[2]], [corners[2], corners[0]]];
  const steps = legs.map(([from, to]) => bornStepOf(shape, from, to, options, memo));
  const noEdge = legs.filter((_, i) => !steps[i]).map(([from]) => from);
  if (noEdge.length) return { state: 'absent', missing: noEdge };
  const S = steps as [BornStep, BornStep, BornStep];
  const walk: BornWalk = {
    corners,
    steps: S,
    solid: { corners, steps: [{ ...S[0], map: S[0].solidMap }, { ...S[1], map: S[1].solidMap }, { ...S[2], map: S[2].solidMap }] as [FaceStep, FaceStep, FaceStep] },
    full: { corners, steps: S as [FaceStep, FaceStep, FaceStep] },
  };
  const R = resolved as [Resolved, Resolved, Resolved];
  const solidRefusals = refusalsOf(walk, R, true);
  const inherited = new Set(solidRefusals.map(refusalKey));
  const refusals = refusalsOf(walk, R, false).map((r) => ({ ...r, inherited: inherited.has(refusalKey(r)), through: inherited.has(refusalKey(r)) ? [] : r.through }));
  if (refusals.length) return { state: 'refused', walk, refusals };
  const readings = corners.map((corner, k) => {
    const space = R[k].space;
    const solid = composeThroughCorner(walk.solid, corner, space);
    const full = composeThroughCorner(walk.full, corner, space);
    const rot = rotate(walk, corner);
    const news: BornRoute[] = [...full.h.entries()].filter(([x]) => !solid.h.has(x)).map(([x, to]) => ({ role: x, to, through: routeThrough(rot, x) }));
    const und: BornUnd[] = full.und.map((u) => ({ role: u.role, brokeAt: u.brokeAt, descent: rot.find((s) => s.from === u.brokeAt.from && s.to === u.brokeAt.to)?.descent ?? null }));
    return { corner, resolved: R[k], solid, full, news, und };
  }) as [BornCornerReading, BornCornerReading, BornCornerReading];
  return { state: 'read', walk, readings };
}

/** two readings of one face (the two cells' walks of an interior face) read ALIKE when every corner's Fix, Mov and Und agree */
export function readAlike(a: BornFaceResult, b: BornFaceResult): boolean {
  if (a.state !== b.state) return false;
  if (a.state === 'absent' || b.state === 'absent') return true;
  if (a.state === 'refused' || b.state === 'refused') {
    const ka = new Set((a as { refusals: BornRefusal[] }).refusals.map(refusalKey));
    const kb = new Set((b as { refusals: BornRefusal[] }).refusals.map(refusalKey));
    return ka.size === kb.size && [...ka].every((k) => kb.has(k));
  }
  const sig = (r: BornCornerReading): string => JSON.stringify({ c: r.corner, fix: [...r.full.fix].sort(), mov: [...r.full.mov].sort(), und: r.und.map((u) => u.role).sort() });
  const sa = new Map(a.readings.map((r) => [r.corner, sig(r)]));
  return b.readings.every((r) => sa.get(r.corner) === sig(r));
}

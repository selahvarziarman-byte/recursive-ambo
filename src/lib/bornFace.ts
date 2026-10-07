// ═══ THE BORN FACE — `STAMP C-9`, 2026-09-23 · `MARKER THE-THIRD-RESOLUTION · M1`, 2026-10-07: the face reading at
// generation ≥ 1 THROUGH THE ONE MONODROMY. NOT_FROZEN (row 220, classified at its landing). It imports the resolver (spaceOf —
// the edge's kind, and the identity regime's one-step reader kept below for the stone's feet) AND the gen-0 face (faceReading) —
// which import each other's neighbour but not each other — so it lives beside both, never inside either.
//
// M1 (the mothership's 23:55, ruled on this seat's own measurement — the born face's step apart from the transport's on 12 of 12
// rod-directions of the cargo witness's room): THE BORN FACE READS THROUGH D20's ONE STEP READER AND `monodromyOf`, LIKE THE SEED
// FACE AND THE CARGO. The corners' spaces and the steps are THE TRANSPORT'S (D11 · D12 amended — a seed its cast, a born corner its
// CHILD; his IS-instances and the inherited on a seed or medial edge, the coordinate map on a corner edge), HANDED IN by the caller
// as `BornReaders` (purity, as D20 kept it: this module imports no transport; `transport.ts` builds the readers off a record).
//   (a) NO LEFTOVER IS CARRIED: the parents' unpaired roles were never the midpoint's (§9.15) — a child holds his instances and the
//       inherited among them; reading a leftover as a Fix asserted an identity nobody gave and marked the ordinary (MODES-3 took
//       them out of the columns).
//   (b) NO IDENTITY THROUGH A SHARED CORNER WITHOUT HIS PAIRING: where the parents' pairing is absent the step is ABSENT (D15), and
//       the face says `no reading yet: nothing paired on …` — never a minted pairing (Δ80).
//   THE SOLID PART — the ground, derived from gen 0 and never an act — is the step WITHOUT HIS PAIRS on the edge (`ground`): on a
//   medial edge the inherited IS alone (D15 — the fix one generation down), on a corner edge the coordinate map, on a seed edge
//   nothing (a seed face's whole reading is his). THE EXTENSION is the transport's step whole; the NEWS is what the extension adds,
//   attributed to his pairs it runs through (the monotone law is measured by the witness, never assumed — his pair on a role the
//   inherited already carries OVERRIDES it, and the surface says so through the news).
//   THE GUARD is the seed face's own (`cornerRefusals`, D20's one guard): the colimit attempted at each corner over its OWN record —
//   the child's induced tuples and marks, the instance's mode among them — a refusal standing under the solid reading too is
//   INHERITED (the seed face's own, its hands that face's); one that needs his pair is attributed to the pairs on its hands.
//   `Und` keeps its ADDRESS (the step the circuit ran out at) and its DESCENT (the parent seed edge of a born `from`).
// Everything here is derived at every read and stored nowhere. `bornStepOf` — C-9's identity-regime reader of ONE step (the
// resolver's composed identity with the born pairs) — stays for the stone's feet (C-12b, spaceOf) and is no longer the born FACE's step.

import type { ConceptSpace, Edge, Shape, VertexId } from '../types/geometry';
import { composedOn, edgeKind, recordOn, spaceOf, type EdgeKind, type Resolved, type SpaceOfOptions } from './spaceOf';
import { composeThroughCorner, cornerRefusals, edgeBetween, type CornerReading, type FaceHand, type FaceOptions, type FaceStep, type FaceTuple, type FaceWalk, type RoleMap } from './faceReading';

/** M1 — THE READERS the born face is handed (the transport's, built off the record by `transport.ts`): a corner's space, the step across an edge in the walk's direction (the extension), and the GROUND — the same step with his pairs on the edge left out (the solid) */
export interface BornReaders {
  cast: (v: VertexId) => ConceptSpace | null;
  step: (from: VertexId, to: VertexId) => RoleMap | null;
  ground: (from: VertexId, to: VertexId) => RoleMap | null;
}

/** one step of a born face's walk — the transport's step in the walk's direction; the solid map and the full map */
export interface BornStep extends FaceStep {
  kind: EdgeKind;
  solidMap: RoleMap; // the ground: the step with his pairs on the edge left out (the inherited alone on a medial edge; the coordinate map on a corner edge)
  bornPairs: Set<string>; // `x\u0000y` in the walk's direction — the pairs the extension adds over the ground: his, on this edge
  siteId: VertexId | null; // the midpoint minted on this edge — where a born pair is made — when the shape holds it
  descent: { from: VertexId; to: VertexId; edge: Edge | null } | null; // the parent seed edge of `from` when `from` is a born vertex: the silence a break here descends from
}

export interface BornWalk {
  corners: [VertexId, VertexId, VertexId];
  steps: [BornStep, BornStep, BornStep];
  casts: Map<VertexId, ConceptSpace>; // the corners' spaces as handed (the transport's)
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
  through: BornAct[]; // the born pairs on the route (at least one, by the monotone law — measured)
}

export interface BornUnd {
  role: string;
  brokeAt: { from: VertexId; to: VertexId };
  descent: BornStep['descent'];
}

export interface BornCornerReading {
  corner: VertexId;
  space: ConceptSpace; // the corner's space as the transport hands it (a seed's cast; a born corner's child)
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
  hands: FaceHand[]; // the acts whose composition merged them (the one guard's own hands)
  through: BornAct[]; // the born pairs among those hands (empty when inherited)
}

/** an edge the transport reads no step across — for a corner edge, the parent edge whose pairings would fill it */
export interface BornUnpaired {
  from: VertexId;
  to: VertexId;
  kind: EdgeKind;
  descent: { from: VertexId; to: VertexId } | null;
}

export type BornFaceResult =
  | { state: 'absent'; missing: VertexId[]; unpaired: BornUnpaired[] } // a corner without a space, or an edge the shape does not hold / the transport reads nothing across
  | { state: 'refused'; walk: BornWalk; refusals: BornRefusal[] }
  | { state: 'read'; walk: BornWalk; readings: [BornCornerReading, BornCornerReading, BornCornerReading] };

const key = (x: string, y: string): string => `${x}\u0000${y}`;

/** the midpoint minted on an edge — the vertex whose two parents are its ends — when the shape holds it */
const siteOn = (shape: Shape, e: Edge): VertexId | null =>
  Object.values(shape.vertices).find((v) => v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(e.vertexIds[0]) && v.createdBy.sourceVertexIds.includes(e.vertexIds[1]))?.id ?? null;

/** the parent seed edge of a born vertex — the silence a break leaving it descends from */
const descentOf = (shape: Shape, from: VertexId): BornStep['descent'] => {
  const fromV = shape.vertices[from];
  const parents = fromV && fromV.createdBy.operation !== 'seed' && fromV.createdBy.sourceVertexIds.length === 2 ? fromV.createdBy.sourceVertexIds : null;
  return parents ? { from: parents[0], to: parents[1], edge: edgeBetween(shape.edges, parents[0], parents[1]) ?? null } : null;
};

/**
 * C-9's ONE-STEP READER OF THE IDENTITY REGIME — the edge's J by its KIND, read in the walk's direction: a corner edge the carried
 * coprojection, a medial edge the anchored meet ∪ the person's born pairs, a seed edge the record. Since M1 this is NOT the born
 * face's step (the face reads the transport's, handed in); it stays for the stone's feet (C-12b — spaceOf composes two edges' J
 * through it) and for the witnesses that measure the two regimes against each other.
 */
export function bornStepOf(shape: Shape, from: VertexId, to: VertexId, options: SpaceOfOptions = {}, memo: Map<VertexId, Resolved | null> = new Map()): BornStep | null {
  const e = edgeBetween(shape.edges, from, to);
  if (!e) return null;
  const R0 = spaceOf(shape, e.vertexIds[0], options, memo);
  const R1 = spaceOf(shape, e.vertexIds[1], options, memo);
  if (!R0 || !R1) return null;
  const kind = edgeKind(shape, e.vertexIds[0], e.vertexIds[1]);
  const composed = composedOn(shape, R0, R1, [e.vertexIds[0], e.vertexIds[1]], kind, options.meet);
  const record = kind === 'corner' ? { roles: [], types: [] } : recordOn(shape, e, options);
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
  return { from, to, edge: e, reversed, map, kind, solidMap, bornPairs, siteId: siteOn(shape, e), descent: descentOf(shape, from) };
}

/** M1 — one step of the born face: the transport's step (the extension) and its ground, in the walk's direction; null where the shape holds no edge or the transport reads nothing across it */
function stepThrough(shape: Shape, from: VertexId, to: VertexId, readers: BornReaders): BornStep | null {
  const e = edgeBetween(shape.edges, from, to);
  if (!e) return null;
  const map = readers.step(from, to);
  if (!map || map.size === 0) return null;
  const solidMap = readers.ground(from, to) ?? new Map<string, string>();
  const bornPairs = new Set<string>();
  for (const [x, y] of map) if (solidMap.get(x) !== y) bornPairs.add(key(x, y));
  return { from, to, edge: e, reversed: e.vertexIds[0] !== from, map, kind: edgeKind(shape, e.vertexIds[0], e.vertexIds[1]), solidMap, bornPairs, siteId: siteOn(shape, e), descent: descentOf(shape, from) };
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

/** the born pairs among a refusal's hands — each hand as the edge's record holds it, read back into the walk's direction */
function bornAmong(walk: BornWalk, hands: FaceHand[]): BornAct[] {
  const out: BornAct[] = [];
  for (const h of hands) {
    const step = walk.steps.find((s) => s.edge.id === h.edge.id);
    if (!step) continue;
    const [x, y] = step.reversed ? [h.pair[1], h.pair[0]] : h.pair;
    if (step.bornPairs.has(key(x, y)) && !out.some((a) => a.edge.id === step.edge.id && a.pair[0] === x && a.pair[1] === y)) out.push(actOf(step, x, y));
  }
  return out;
}

/** a refusal's key at the grain of the PAIR — unordered: the same two tuples however they were met */
const refusalKey = (r: { kind: string; first: FaceTuple; second: FaceTuple }): string => [`${r.first.type}|${r.first.terms.join(',')}|${r.first.value}`, `${r.second.type}|${r.second.terms.join(',')}|${r.second.value}`].sort().join('||') + `|${r.kind}`;

/**
 * THE BORN FACE: the three corners in the direction to walk (a record's own order is its host cell's walk — the reverse is
 * the other cell's, a face of the solid, not a flipped face), the current shape, THE READERS (the transport's). Each corner's
 * space as handed; each step the transport's with its ground; the solid reading and the extension at every corner through the
 * ONE monodromy; the guard the seed face's own at every corner.
 */
export function bornFaceOf(shape: Shape, corners: [VertexId, VertexId, VertexId], readers: BornReaders, options: FaceOptions = {}): BornFaceResult {
  const casts = new Map<VertexId, ConceptSpace>();
  for (const c of corners) { const s = readers.cast(c); if (s) casts.set(c, s); }
  const missing = corners.filter((c) => !casts.has(c));
  if (missing.length) return { state: 'absent', missing, unpaired: [] };
  const legs: Array<[VertexId, VertexId]> = [[corners[0], corners[1]], [corners[1], corners[2]], [corners[2], corners[0]]];
  const steps = legs.map(([from, to]) => stepThrough(shape, from, to, readers));
  const unpaired: BornUnpaired[] = legs.filter((_, i) => !steps[i]).map(([from, to]) => {
    const e = edgeBetween(shape.edges, from, to);
    const kind: EdgeKind = e ? edgeKind(shape, e.vertexIds[0], e.vertexIds[1]) : 'seed';
    // a corner edge's map comes from the parent edge's pairings — the edge whose silence it is
    const child = kind === 'corner' ? [from, to].find((v) => shape.vertices[v]?.createdBy.sourceVertexIds.length === 2) : undefined;
    const parents = child ? shape.vertices[child].createdBy.sourceVertexIds : null;
    return { from, to, kind, descent: parents ? { from: parents[0], to: parents[1] } : null };
  });
  if (unpaired.length) return { state: 'absent', missing: [], unpaired };
  const S = steps as [BornStep, BornStep, BornStep];
  const walk: BornWalk = {
    corners,
    steps: S,
    casts,
    solid: { corners, steps: [{ ...S[0], map: S[0].solidMap }, { ...S[1], map: S[1].solidMap }, { ...S[2], map: S[2].solidMap }] as [FaceStep, FaceStep, FaceStep] },
    full: { corners, steps: S as [FaceStep, FaceStep, FaceStep] },
  };
  const readings = corners.map((corner) => {
    const space = casts.get(corner) as ConceptSpace;
    const solid = composeThroughCorner(walk.solid, corner, space, options);
    const full = composeThroughCorner(walk.full, corner, space, options);
    const rot = rotate(walk, corner);
    const news: BornRoute[] = [...full.h.entries()].filter(([x, to]) => solid.h.get(x) !== to).map(([x, to]) => ({ role: x, to, through: routeThrough(rot, x) }));
    const und: BornUnd[] = full.und.map((u) => ({ role: u.role, brokeAt: u.brokeAt, descent: rot.find((s) => s.from === u.brokeAt.from && s.to === u.brokeAt.to)?.descent ?? null }));
    return { corner, space, solid, full, news, und };
  }) as [BornCornerReading, BornCornerReading, BornCornerReading];
  // THE GUARD — the seed face's own at every corner, under the extension; a refusal standing under the solid reading too is inherited
  const refusals: BornRefusal[] = [];
  for (const r of readings) {
    const inherited = new Set(cornerRefusals(walk.solid, r.solid, r.space).map(refusalKey));
    for (const f of cornerRefusals(walk.full, r.full, r.space)) {
      const isInherited = inherited.has(refusalKey(f));
      refusals.push({ corner: f.corner, kind: f.kind, first: f.first, second: f.second, merged: f.merged, inherited: isInherited, hands: f.hands, through: isInherited ? [] : bornAmong(walk, f.hands) });
    }
  }
  if (refusals.length) return { state: 'refused', walk, refusals };
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

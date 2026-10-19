// transport — STAMP MODES-4 · row 5 (2026-09-29; the second resolution §3 — D12 AMENDED and D11 AS DEFINED; ADR 0031 §9.8; the
// mothership's ruling of 19:23 §240 (2) on the fibre): THE TRANSPORT'S READING. The lift, the door and the cargo walk ride the
// IDENTIFICATION STRUCTURE and nothing else:
//   · on a SEED or a MEDIAL edge the IS-instances — the person's pairings AND the inherited ones (D15: a FIX one generation
//     down, read here as (IS, i, j), derived at every read, stored nowhere);
//   · on a CORNER edge the COORDINATE MAP — from the child an instance to its coordinate (always one); from the parent a role to
//     the IS-instance holding it, AT MOST ONE by the one-to-one law (B6: the cargo's road is IS; mode instances holding the role
//     are COUNTED, never walked — `fibreCensus`); an empty IS fibre stops the cargo at the rod and the line says so; a fibre of
//     SEVERAL IS-instances is a contradiction in the record — the step STOPS and names the edge and the two instances, never a
//     set that walks;
//   · NEVER a mode relating, never a light, never the solid's over-composition (the anchored meet, C-8b — the identity
//     regime's reading, which stays the stone's feet's, `bornStepOf`; since M1 (THE-THIRD-RESOLUTION, 2026-10-07) the BORN FACE
//     reads this module's step too — `bornReadersOf` below hands it the step, its GROUND and a corner's space).
// D11 as defined: a lifted corner holds the CHILD (D4) — his instances in every mode, the inherited IS among them as record,
// the induced record — so the transport's space of a born vertex is `childSpaceOf`, its roles labelled by his sentences; a
// seed's is its cast through the one resolver with no foot and no respect (`TRANSPORT_OPTIONS`, B6). The identity regime's
// merged space (the pushout with the parents' leftovers) is no longer what the transport reads anywhere; where it still
// speaks (the Ambo's own card, the born face) is measured, not changed here. React-free; DOM-free; writes nothing. Pinned by
// scripts/diagnose-modes1-the-transport.cjs and scripts/diagnose-modes4-the-record-and-the-sorting.cjs.

import type { Shape, VertexId } from '../types/geometry';
import { edgeBetween, type RoleMap } from './faceReading';
import type { BornReaders } from './bornFace';
import { childSidesOf, childSpaceOf, inheritedISOn, instancesFrom, instancesWithInherited, termWordsOf } from './instanceSpace';
import { ALONG, dirOf, IS } from './relatings';
import { edgeKind, isSeedVertex, spaceOf, TRANSPORT_OPTIONS, type Resolved, type SpaceOfOptions } from './spaceOf';

/** a corner's space as the transport hands it (a seed's cast; a born vertex's child) — the resolver's own space type */
export type TransportSpace = Resolved['space'];
export interface TransportCorner {
  space: TransportSpace;
  origin: 'seed' | 'derived';
}
type ChildMemo = Parameters<typeof childSpaceOf>[3];

/**
 * THE CORNER'S SPACE AS THE TRANSPORT READS IT (D11): a seed — its cast through the one resolver, no foot composed, no respect
 * read; a born vertex — its CHILD, every role labelled by his sentence (`F7 ≡ r0` · `r3 carries F2`), the label the door, the
 * cargo and the card print. Null where the record holds no such vertex or the vertex holds no space.
 */
export function transportSpaceOf(record: Shape, v: VertexId, memo: Map<VertexId, Resolved | null> = new Map(), childMemo: ChildMemo = new Map()): TransportCorner | null {
  if (!record.vertices[v]) return null;
  if (isSeedVertex(record, v)) {
    const r = spaceOf(record, v, TRANSPORT_OPTIONS, memo);
    return r ? { space: r.space, origin: 'seed' } : null;
  }
  // slice 2 · F: the lift keeps D4's record (`childSidesOf`, READ) — the Manuscript hop, outside the spec, flagged open (the mothership's 15:06); the
  // next generation reads the child as a parent, never this
  const child = childSidesOf(record, v, {}, childMemo);
  if (!child) return null;
  const label = (id: string): string => termWordsOf(record, v, id, {}, childMemo).replace(/^\((.*)\)$/, '$1');
  return { space: { ...child, roles: child.roles.map((r) => ({ ...r, label: label(r.id) })) }, origin: 'derived' };
}

/** the parent and the child of a corner edge, or null when the edge is not a corner edge */
function cornerOf(record: Shape, a: VertexId, b: VertexId): { P: VertexId; C: VertexId } | null {
  if (record.vertices[b]?.createdBy.sourceVertexIds.includes(a)) return { P: a, C: b };
  if (record.vertices[a]?.createdBy.sourceVertexIds.includes(b)) return { P: b, C: a };
  return null;
}

/** the fibres of the coordinate map on the corner edge P–C: for each role of P the instances of C holding it — the IS-instances (the road) apart from the rest (counted) */
export function fibresOf(record: Shape, P: VertexId, C: VertexId, options: SpaceOfOptions = {}): Map<string, { is: string[]; others: string[] }> {
  const out = new Map<string, { is: string[]; others: string[] }>();
  const Q = record.vertices[C]?.createdBy.sourceVertexIds.find((v) => v !== P);
  if (Q === undefined) return out;
  // each instance with its P-coordinate read off the edge P–Q's own stored order (instancesFrom), never off the sources' listed order
  for (const i of instancesFrom(record, P, Q, options)) {
    const f = out.get(i.p) ?? { is: [], others: [] };
    (i.mode === IS ? f.is : f.others).push(i.key);
    out.set(i.p, f);
  }
  return out;
}

/** THE CENSUS of a corner edge's fibres (the measurement the mothership asked for): the parent's roles by what holds them — no instance · one IS-instance · only mode instances (counted, never walked) · several IS-instances (a contradiction of the record, named) */
export function fibreCensus(record: Shape, P: VertexId, C: VertexId, options: SpaceOfOptions = {}): { none: number; one: number; modeOnly: number; isAndMode: number; severalIS: Array<{ role: string; instances: string[] }> } {
  const parent = transportSpaceOf(record, P); // the parent's roles as the transport reads them (D11): a seed's cast, a born parent's child
  const fibres = fibresOf(record, P, C, options);
  const out = { none: 0, one: 0, modeOnly: 0, isAndMode: 0, severalIS: [] as Array<{ role: string; instances: string[] }> }; // §9.57 (5)(b): `isAndMode` — a role held by an IS-instance AND a mode instance, the family (the coder's measurement of 10-17)
  for (const r of parent ? parent.space.roles : []) {
    const f = fibres.get(r.id);
    if (!f) out.none += 1;
    else if (f.is.length === 1) { out.one += 1; if (f.others.length > 0) out.isAndMode += 1; }
    else if (f.is.length === 0) out.modeOnly += 1;
    else out.severalIS.push({ role: r.id, instances: f.is });
  }
  return out;
}

/**
 * THE STEP ACROSS AN EDGE (D12 amended), oriented from → to: on a seed or a medial edge the IS-instances — his and the inherited —
 * as a map (one-to-one by IS's own law); on a corner edge the coordinate map — from the child an instance to its coordinate,
 * from the parent a role to the ONE IS-instance holding it (none: no entry, the cargo stops at the rod). A role held by two
 * IS-instances is a contradiction of the record: the step STOPS and names the edge and the two instances.
 * Null where the record holds no such edge or the child holds no space.
 */
export function transportStepOf(record: Shape, from: VertexId, to: VertexId, options: SpaceOfOptions = {}): RoleMap | null {
  return stepAcross(record, from, to, options, false);
}

/**
 * M1 — THE GROUND of a step: the same step with HIS pairs on the edge left out — on a medial edge the inherited IS alone (D15: the fix
 * one generation down, derived from the parents' pairings and never an act on this edge), on a corner edge the coordinate map (no pair
 * of his lives there), on a seed edge nothing (a seed face's whole reading is his). The born face's SOLID part reads through it.
 */
export function transportGroundOf(record: Shape, from: VertexId, to: VertexId, options: SpaceOfOptions = {}): RoleMap | null {
  return stepAcross(record, from, to, options, true);
}

// ═══ ADR 0031 §9.57 (the mothership's STAMP of 2026-10-17 16:42; group 2, after release 1) — THE STEP AS A RELATION: every named way a road ═══

/** the leg from a child's instance to its parent's coordinate — structure, not a way (D14): a road with no word, unprinted in a route's words */
export const COORDINATE = 'coordinate';
/** a ROAD: one way holding a role across an edge, in the walk's direction — the far role, the word (IS included; `coordinate` from a child to its parent), and
 *  whether the walk takes the way AGAINST its direction as he said it (§9.53 (a): a way runs both ways by structure; the composite reads each word as he said it) */
export interface Road { to: string; word: string; against: boolean }
export type WaysMap = Map<string, Road[]>;

/**
 * §9.57 (2), (4), (5)(b) — THE STEP AS A RELATION, oriented from → to: on a seed or a medial edge every relating that HOLDS (his, and the inherited IS; a bar is
 * a refused way, never a road), each with its word; from a parent to its child every instance holding the role, with its mode (the family lives where the moved
 * step reads, at a seed edge and at a corner edge from the parent's side); from a child to its parent the coordinate map as it stands (one road per instance, the
 * mode instances too — D-1's many-to-one is the child-to-parent direction). `transportStepOf` stays IS-only for §9.54's readers (the stone, the door, Fix · Mov · Und).
 * Null where the record holds no such edge or the child holds no space.
 */
export function transportWaysOf(record: Shape, from: VertexId, to: VertexId, options: SpaceOfOptions = {}): WaysMap | null {
  const e = edgeBetween(record.edges, from, to);
  if (!e) return null;
  const [a, b] = e.vertexIds as [VertexId, VertexId];
  const out: WaysMap = new Map();
  const add = (x: string, road: Road): void => { const ways = out.get(x) ?? []; if (!ways.some((w) => w.to === road.to && w.word === road.word)) ways.push(road); out.set(x, ways); };
  if (edgeKind(record, a, b) !== 'corner') {
    const reversed = a !== from;
    for (const r of instancesWithInherited(record, e, options)) {
      const [x, y] = reversed ? [r[2], r[1]] : [r[1], r[2]];
      add(x, { to: y, word: r[0], against: r[0] === IS ? false : (dirOf(r) === ALONG) === reversed });
    }
    return out;
  }
  const corner = cornerOf(record, a, b);
  if (!corner) return null;
  const { P, C } = corner;
  const Q = record.vertices[C]?.createdBy.sourceVertexIds.find((v) => v !== P);
  if (Q === undefined) return null;
  const held = instancesFrom(record, P, Q, options);
  if (held.length === 0 && !edgeBetween(record.edges, P, Q)) return null;
  if (from === C) {
    for (const i of held) add(i.key, { to: i.p, word: COORDINATE, against: false });
    return out;
  }
  for (const i of held) {
    // the leg from the parent's role into the instance holding it: along the instance's word where the role is its subject, against it where its object; IS neither
    const subject = dirOf(i.rel) === ALONG ? i.rel[1] : i.rel[2];
    add(i.p, { to: i.key, word: i.mode, against: i.mode === IS ? false : subject !== i.p });
  }
  return out;
}

/** M1 — the born face's readers off a record, the transport's own (D11 · D12 amended): a corner's space, the step, the ground */
export function bornReadersOf(record: Shape, options: SpaceOfOptions = {}): BornReaders {
  const memo = new Map<VertexId, Resolved | null>();
  const childMemo: ChildMemo = new Map();
  return {
    cast: (v) => (record.vertices[v] ? transportSpaceOf(record, v, memo, childMemo)?.space ?? null : null),
    step: (from, to) => (record.vertices[from] && record.vertices[to] ? transportStepOf(record, from, to, options) : null),
    ground: (from, to) => (record.vertices[from] && record.vertices[to] ? transportGroundOf(record, from, to, options) : null),
  };
}

function stepAcross(record: Shape, from: VertexId, to: VertexId, options: SpaceOfOptions, groundOnly: boolean): RoleMap | null {
  const e = edgeBetween(record.edges, from, to);
  if (!e) return null;
  const [a, b] = e.vertexIds as [VertexId, VertexId];
  const map: RoleMap = new Map();
  if (edgeKind(record, a, b) !== 'corner') {
    const reversed = a !== from;
    // the ground (M1): the inherited alone — his pairs withdrawn; the step: his and the inherited, his first
    for (const r of groundOnly ? inheritedISOn(record, e, options) : instancesWithInherited(record, e, options)) if (r[0] === IS) { const [x, y] = reversed ? [r[2], r[1]] : [r[1], r[2]]; if (!map.has(x)) map.set(x, y); }
    return map;
  }
  const corner = cornerOf(record, a, b);
  if (!corner) return null;
  const { P, C } = corner;
  const Q = record.vertices[C]?.createdBy.sourceVertexIds.find((v) => v !== P);
  if (Q === undefined) return null;
  const held = instancesFrom(record, P, Q, options);
  if (held.length === 0 && !edgeBetween(record.edges, P, Q)) return null;
  if (from === C) {
    // D-1 (ADR 0031 §9.46 (3): the identity readers' steps walk IS-instances only, D12 amended): an IS-INSTANCE to its coordinate — never a mode
    // instance. Mapping every instance made this step many-to-one, and on a closed triad the door's walk ran from a mode instance into a cycle forever
    for (const i of held) if (i.mode === IS && !map.has(i.key)) map.set(i.key, i.p);
    return map;
  }
  for (const [p, f] of fibresOf(record, P, C, options)) {
    if (f.is.length > 1) {
      const lp = record.vertices[P]?.data.label || P; const lc = record.vertices[C]?.data.label || C;
      throw new Error(`the coordinate map on ${lp}–${lc} holds ${p} in two pairings — ${f.is[0]} and ${f.is[1]} — a contradiction of the record, not a road`);
    }
    if (f.is.length === 1) map.set(p, f.is[0]);
  }
  return map;
}

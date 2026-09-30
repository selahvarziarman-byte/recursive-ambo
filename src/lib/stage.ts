// stage — STAMP MODES-4 · row 8 (2026-09-30; the second resolution §9 — D17 THE STAGE, sharpening D11; ADR 0031 §9.8 D17; the
// mothership's 10:54 item 8 and its 22:15 order): THE LOG IS INPUT.
//
// The person's acts form a SEQUENCE — relate, bar, pair, word, say, rule, name, converse, opaque, mode, triad and every withdrawal —
// each appended as it LANDS (a refused act appends nothing: a refusal is a reading). A name's state is a STAGE: the position of the
// naming act in that sequence, kept on the vertex as input (`namedAt`); the state the name was given under is RE-DERIVED by sorting
// the record as it stood at that stage, and *since then* is the difference of two derived sortings. Nothing derived is stored (D11's
// snapshot `namedUnder` — a relatings count and the own keys, kept at the christening — is the drift-prone form D17 retires; a
// snapshot taken before D17 stands as the record of that name, marked as given under a snapshot).
//
// The record's sets are not monotone (withdrawals); the log is — so the record at a stage is the record NOW with every later entry
// UNAPPLIED, latest first. An entry carries what its act put into and took out of the record, in the record's own terms (a pair, a
// relating, a verdict, a triad, a rule, a converse, a mode; the τ draft it moved), which makes it invertible exactly; an entry naming
// an edge or a face a shape does not hold passes over that shape (the log is the workspace's; a stage is read at one site).
//
// THE CARRY (MODES-4 · row 9, from the log census the mothership asked at row 8's ratification): a dissection mints every edge of the
// new shape FRESH (`makeEdgeId(shapeId, pair)` — measured: `edge:1h6rpfm` → `edge:1q1u0za`) and carries the record onto the same
// PAIR; an entry that named the edge by id alone found nothing to unapply on the new shape, and a generation-1 name's line at
// generation 2 read the current state as the naming-time state (measured: `(3 relatings, no passage)` where gen 1 read `(1 relating,
// no passage); since then, 0 left what is theirs alone · 2 entered`). So an entry on an edge or a face carries its CORNERS — vertex
// ids, which the carry keeps (AB is the same vertex at every generation) — and unapply resolves the edge or the face by id, else by
// corners. An entry logged before this (none in any customer file; the log is hours old) resolves by id as before.
//
// THE WORKSPACE'S SHAPE (the coder's, under the charter): a log BESIDE the sets — the sets stay what they are and the store keeps
// writing them through its one writers; the log rides the workspace file (`log`) and the stage rides the vertex (`namedAt`).
// React-free; DOM-free; writes nothing. Pinned by scripts/diagnose-modes4-the-record-and-the-sorting.cjs §k and the words witness §e.

import type { EdgeId, EdgeIdentification, Face, Shape, VertexId } from '../types/geometry';
import { withRelating, withoutRelating, dirOf, type LexiconFacts, type Relating } from './relatings';
import { withVerdict, withoutVerdict, type Rule, type VerdictRecord } from './sorting';
import { withTriad, withoutTriad, type RespectKind, type RespectTuple } from './respects';

export type Pair = [string, string];
export type PairDiff = { added: Pair[]; removed: Pair[] };

/** one act as it landed — its number `n` is its position (1-based, the order he made them) */
export type LogEntry =
  | { n: number; act: 'pair'; edge: EdgeId; corners?: VertexId[]; roles: PairDiff; types: PairDiff; draft: { was: Pair[] | null; now: Pair[] | null } }
  | { n: number; act: 'relate'; edge: EdgeId; corners?: VertexId[]; added: Relating[]; removed: Relating[] }
  | { n: number; act: 'say'; face: string; corners?: VertexId[]; added: VerdictRecord[]; removed: VerdictRecord[] }
  | { n: number; act: 'triad'; face: string; corners?: VertexId[]; kind: RespectKind; added: RespectTuple[]; removed: RespectTuple[] }
  | { n: number; act: 'rule'; added: Rule[]; removed: Rule[] }
  | { n: number; act: 'converse'; added: Pair[]; removed: Pair[] }
  | { n: number; act: 'opaque'; word: string; on: boolean }
  | { n: number; act: 'mode'; word: string; on: boolean }
  | { n: number; act: 'name'; vertex: VertexId; label: string; was: string; christened: boolean };

export type LogEntryInput = LogEntry extends infer E ? (E extends { n: number } ? Omit<E, 'n'> : never) : never;

/** the log with one act appended at its position */
export const appendLog = (log: readonly LogEntry[], entry: LogEntryInput): LogEntry[] => [...log, { n: log.length + 1, ...entry } as LogEntry];

export const NAMED_AT_KEY = 'namedAt';

/** the stage a name was given at — the naming act's position in the log — as the vertex's packet holds it (input; null for an un-christened vertex or a name given under a snapshot before D17) */
export function nameStageOf(shape: Shape, siteId: VertexId | null): number | null {
  if (!siteId) return null;
  const raw = shape.vertices[siteId]?.data.custom?.[NAMED_AT_KEY];
  return typeof raw === 'number' && Number.isInteger(raw) && raw >= 0 ? raw : null;
}

const samePair = (a: readonly [string, string], b: readonly [string, string]): boolean => a[0] === b[0] && a[1] === b[1];
const sameRule = (a: Rule, b: Rule): boolean => a.length === b.length && a.every((v, i) => v === b[i]);
const sameRelating = (a: Relating, b: Relating): boolean => a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && dirOf(a) === dirOf(b);
const sameTuple = (a: RespectTuple, b: RespectTuple): boolean => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

/** the difference of two lists, in their own terms (what the later holds that the earlier did not, and the reverse) */
export function diffOf<T>(before: readonly T[], after: readonly T[], same: (a: T, b: T) => boolean): { added: T[]; removed: T[] } {
  return { added: after.filter((a) => !before.some((b) => same(a, b))), removed: before.filter((b) => !after.some((a) => same(a, b))) };
}
export const pairDiff = (before: readonly Pair[], after: readonly Pair[]): PairDiff => diffOf(before, after, samePair);
export const ruleDiff = (before: readonly Rule[], after: readonly Rule[]): { added: Rule[]; removed: Rule[] } => diffOf(before, after, sameRule);
export const relatingDiff = (before: readonly Relating[], after: readonly Relating[]): { added: Relating[]; removed: Relating[] } => diffOf(before, after, sameRelating);
export const tupleDiff = (before: readonly RespectTuple[], after: readonly RespectTuple[]): { added: RespectTuple[]; removed: RespectTuple[] } => diffOf(before, after, sameTuple);
const samePath = (a: Omit<VerdictRecord, 'verdict' | 'w3' | 'exception'>, b: Omit<VerdictRecord, 'verdict' | 'w3' | 'exception'>): boolean =>
  a.base[0] === b.base[0] && a.base[1] === b.base[1] && a.x === b.x && a.w === b.w && a.z === b.z && a.w2 === b.w2 && a.y === b.y;
const sameVerdict = (a: VerdictRecord, b: VerdictRecord): boolean => samePath(a, b) && a.verdict === b.verdict && (a.w3 ?? null) === (b.w3 ?? null);
export const verdictDiff = (before: readonly VerdictRecord[], after: readonly VerdictRecord[]): { added: VerdictRecord[]; removed: VerdictRecord[] } => diffOf(before, after, sameVerdict);

/** the record's parts a stage is read from: the shape (its edges' and faces' packets), the rules, the lexicon's facts and words, the τ drafts */
export interface StageRecord {
  shape: Shape;
  rules: Rule[];
  facts: LexiconFacts;
  lexicon: string[];
  tauDrafts: Record<EdgeId, EdgeIdentification['types']>;
}

/**
 * the identification packet and the τ draft as the store's one writer keeps them (`midpointWrite`): with a role pair standing the
 * roles and τ are the record and no draft stands; with none, τ alone goes to the draft and the packet is absent; nothing at all
 * clears both. Inverting a pair entry re-derives the packet through this same rule from the roles and τ the stage holds.
 */
function packetOf(roles: Pair[], types: Pair[]): { identification: EdgeIdentification | undefined; draft: Pair[] | null } {
  if (roles.length === 0) return { identification: undefined, draft: types.length ? types : null };
  return { identification: { roles, types }, draft: null };
}

/** the edge an entry names on THIS shape: by id, else by its corners (the carry keeps the corners and mints the id) */
const edgeNamed = (shape: Shape, id: EdgeId, corners: VertexId[] | undefined): Shape['edges'][number] | undefined =>
  shape.edges.find((c) => c.id === id) ?? (corners && corners.length === 2 ? shape.edges.find((c) => (c.vertexIds[0] === corners[0] && c.vertexIds[1] === corners[1]) || (c.vertexIds[0] === corners[1] && c.vertexIds[1] === corners[0])) : undefined);
/** the faces an entry names on THIS shape: the one with its id, else every face on the same corners (a face two cells hold is two records) */
const facesNamed = (shape: Shape, id: string, corners: VertexId[] | undefined): Face[] => {
  const byId = shape.faces.find((f) => f.id === id);
  if (byId) return [byId];
  if (!corners) return [];
  return shape.faces.filter((f) => f.vertexIds.length === corners.length && corners.every((v) => f.vertexIds.includes(v)));
};

/** one entry UNAPPLIED: what it added taken out, what it removed put back — the record one act earlier */
export function unapplyEntry(rec: StageRecord, e: LogEntry): StageRecord {
  switch (e.act) {
    case 'pair': {
      const edge = edgeNamed(rec.shape, e.edge, e.corners);
      if (!edge) return rec;
      const heldRoles = edge.identification ? edge.identification.roles : [];
      const heldTypes = edge.identification ? edge.identification.types : rec.tauDrafts[edge.id] ?? [];
      const roles = [...heldRoles.filter((p) => !e.roles.added.some((q) => samePair(p, q))), ...e.roles.removed];
      const types = [...heldTypes.filter((p) => !e.types.added.some((q) => samePair(p, q))), ...e.types.removed];
      const { identification, draft } = packetOf(roles, types);
      const tauDrafts = { ...rec.tauDrafts };
      if (draft) tauDrafts[edge.id] = draft; else delete tauDrafts[edge.id];
      const edges = rec.shape.edges.map((c) => (c.id !== edge.id ? c : identification ? { ...c, identification } : (({ identification: _i, ...rest }) => { void _i; return rest as typeof c; })(c)));
      return { ...rec, shape: { ...rec.shape, edges }, tauDrafts };
    }
    case 'relate': {
      const edge = edgeNamed(rec.shape, e.edge, e.corners);
      if (!edge) return rec;
      let next = edge;
      for (const r of e.added) next = withoutRelating(next, r[0], r[1], r[2], dirOf(r));
      for (const r of e.removed) next = withRelating(next, r);
      return { ...rec, shape: { ...rec.shape, edges: rec.shape.edges.map((c) => (c.id === edge.id ? next : c)) } };
    }
    case 'say': {
      const named = facesNamed(rec.shape, e.face, e.corners);
      if (named.length === 0) return rec;
      const undo = (face: Face): Face => { let next: Face = face; for (const v of e.added) next = withoutVerdict(next, v); for (const v of e.removed) next = withVerdict(next, v); return next; };
      return { ...rec, shape: { ...rec.shape, faces: rec.shape.faces.map((f) => (named.includes(f) ? undo(f) : f)) } };
    }
    case 'triad': {
      const named = facesNamed(rec.shape, e.face, e.corners);
      if (named.length === 0) return rec;
      const undo = (face: Face): Face => { let next: Face = face; for (const t of e.added) next = withoutTriad(next, e.kind, t); for (const t of e.removed) next = withTriad(next, e.kind, t); return next; };
      return { ...rec, shape: { ...rec.shape, faces: rec.shape.faces.map((f) => (named.includes(f) ? undo(f) : f)) } };
    }
    case 'rule':
      return { ...rec, rules: [...rec.rules.filter((r) => !e.added.some((a) => sameRule(r, a))), ...e.removed] };
    case 'converse':
      return { ...rec, facts: { ...rec.facts, converses: [...rec.facts.converses.filter((c) => !e.added.some((a) => samePair(c, a))), ...e.removed] } };
    case 'opaque':
      return { ...rec, facts: { ...rec.facts, opaque: e.on ? rec.facts.opaque.filter((w) => w !== e.word) : rec.facts.opaque.includes(e.word) ? rec.facts.opaque : [...rec.facts.opaque, e.word] } };
    case 'mode':
      return { ...rec, lexicon: e.on ? rec.lexicon.filter((w) => w !== e.word) : rec.lexicon.includes(e.word) ? rec.lexicon : [...rec.lexicon, e.word] };
    case 'name':
      return rec; // a name is not part of the sorting's record; the stage reads the record, not the labels
    default:
      return rec;
  }
}

/** THE RECORD AS IT STOOD AT STAGE n: every entry after n unapplied, latest first (a stage of 0 is the record before any act) */
export function recordAtStage(now: StageRecord, log: readonly LogEntry[], n: number): StageRecord {
  let rec = now;
  for (let i = log.length - 1; i >= 0; i -= 1) {
    const e = log[i];
    if (e.n <= n) break;
    rec = unapplyEntry(rec, e);
  }
  return rec;
}

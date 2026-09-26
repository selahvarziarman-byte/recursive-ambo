// relatings — STAMP MODES-1 · B1 (2026-09-26; the researcher's ruling THE PROJECTION — the edge is relatings with modes, the
// child is the instance space — decided by Arman in the grill of 09-26 15:31–16:38 (Δ117), "start the build now" (Δ118); the
// mothership's step-0 ruling of 17:06: design (A), the packet home, no vertex id in any packet): THE EDGE RECORD IN MODES.
//
// THE MEDIUM (D2). Every edge e = XY is a medium; its extent is every (w, x, y) with w a word of the lexicon L, x a role of X,
// y a role of Y — three-valued, initially unknown. Unknown is ABSENCE, never a value: nothing here stores an unknown entry.
// THE RELATING (D3). The person's act on e sets an entry: (w, x, y, +) is an INSTANCE, (w, x, y, −) a BAR. Directed and binary
// (D1): "x w y" is not "y w x"; the stored triple reads x of the edge's FIRST corner, y of its SECOND — exactly as `roles`
// reads today. Same mode at the same endpoints is the same relating: setting an entry replaces its sign.
// IS (D12). One word of L is reserved for transport: IS. An IS-instance (IS, a, b, +) IS the pairing (a, b) the person gives
// through the J register — its home stays the typed record `identification.roles` (frozen, untouched), so the lift, the door
// and the cargo, which read the pairing through the resolver's one reader, ride IS-instances only WITHOUT A LINE CHANGED.
// THE HOME of every other relating — the other modes, and every bar (IS's included) — is the EDGE's open packet,
// `edge.data.relatings`: `[w, x, y, sign]` items, role ids and words only, NO VERTEX ID INSIDE (the mothership's condition;
// the C-14 precedent: the frozen loader re-roots only the ids it names and leaves a packet verbatim, so the record crosses the
// lift as it is; the dissection carries it mirrored where the derived edge's direction flips, as `ambo.ts` carries `roles`).
// THE MIGRATION (B1's seal) is done BY READING, never by rewriting: `relatingsOn` reads the pairing in force as IS-instances and
// the packet as the rest, so every file, lift and dissection that exists today reads as before, byte for byte (RECORD, NOT
// READING: the inputs are stored, everything else is re-derived at every read).
// THE LEXICON (D1). L is shared across the mesh: IS, then the words the person DECLARED (the store's `lexicon`, in his order,
// persisted with the workspace — a declaration is an act), then every word IN USE on the mesh's edges not already listed. A
// word in use is never lost by withdrawing its declaration: the relatings are the person's record.
// B1 exposes NOTHING to the readers of the core (the glue, the feet, the respects, the face): they read the IS-instances as
// before. The instance space (B2) and the paths, verdicts and sorting (B3) read this record. No copy reaches the screen here.
// Pinned by scripts/diagnose-modes1-the-edge-in-modes.cjs.

import type { Edge, JsonValue, PacketData, Shape, VertexId } from '../types/geometry';
import { unconditionalOn } from './respects';
import { spaceOf, type Resolved, type SpaceOfOptions } from './spaceOf';

/** the word of L reserved for transport (D12) */
export const IS = 'IS';
export const RELATINGS_KEY = 'relatings';

export type Sign = '+' | '-';
/** a relating as the edge stores it: the mode, x of the edge's first corner, y of its second, the sign (+ instance, − bar) */
export type Relating = [string, string, string, Sign];

const isWord = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
export const isRelating = (v: unknown): v is Relating =>
  Array.isArray(v) && v.length === 4 && isWord(v[0]) && isWord(v[1]) && isWord(v[2]) && (v[3] === '+' || v[3] === '-');
/** the same entry of the extent: the mode and both endpoints (the sign is the entry's value) */
export const sameEntry = (s: Relating, t: Relating): boolean => s[0] === t[0] && s[1] === t[1] && s[2] === t[2];
const copy = (r: Relating): Relating => [r[0], r[1], r[2], r[3]];

/** the relatings the edge's packet holds (the modes other than IS, and the bars) — well-formed items only; nothing else is read into a record */
export function relatingsHeld(edge: Edge | undefined): Relating[] {
  const raw = edge?.data?.[RELATINGS_KEY];
  if (!Array.isArray(raw)) return [];
  return (raw as unknown[]).filter(isRelating).map(copy);
}

function writeHeld(edge: Edge, list: Relating[]): Edge {
  const rest: PacketData = { ...(edge.data ?? {}) };
  delete rest[RELATINGS_KEY];
  if (list.length === 0) {
    return Object.keys(rest).length ? { ...edge, data: rest } : (({ data: _d, ...e }) => { void _d; return e; })(edge);
  }
  return { ...edge, data: { ...rest, [RELATINGS_KEY]: list.map(copy) as unknown as JsonValue } };
}

/** the edge with one relating set — an entry already held with the same sign leaves the edge as it is; with the other sign it is replaced (one entry per (w, x, y)) */
export function withRelating(edge: Edge, r: Relating): Edge {
  const held = relatingsHeld(edge);
  const at = held.findIndex((h) => sameEntry(h, r));
  if (at >= 0 && held[at][3] === r[3]) return edge;
  const next = at >= 0 ? held.map((h, i) => (i === at ? copy(r) : h)) : [...held, copy(r)];
  return writeHeld(edge, next);
}

/** the edge with one entry withdrawn (the person's hand back); an empty record leaves no key behind */
export function withoutRelating(edge: Edge, w: string, x: string, y: string): Edge {
  const held = relatingsHeld(edge);
  const next = held.filter((h) => !(h[0] === w && h[1] === x && h[2] === y));
  if (next.length === held.length) return edge;
  return writeHeld(edge, next);
}

/** THE CARRY at a dissection: the packet's relatings as a JSON value for the derived edge of the same pair, mirrored when that edge is walked the other way (x ↔ y — the same act said from the new first corner) */
export function carriedRelatings(data: PacketData | undefined, mirrored: boolean): JsonValue | undefined {
  const held = relatingsHeld({ data } as Edge);
  if (held.length === 0) return undefined;
  return (mirrored ? held.map((r): Relating => [r[0], r[2], r[1], r[3]]) : held) as unknown as JsonValue;
}

/**
 * THE ONE READER of an edge's relatings: the pairing in force (the candidate a read carries for this edge, else what the edge
 * holds — `unconditionalOn`, the resolver's own base read) as IS-instances, in the person's order, then the packet's relatings.
 * A packet entry (IS, a, b, +) that a foreign file might carry is read as the instance it is, once (the writer never puts one there).
 */
export function relatingsOn(e: Edge | undefined, options: SpaceOfOptions = {}): Relating[] {
  if (!e) return [];
  const out: Relating[] = unconditionalOn(e, options).roles.map(([a, b]): Relating => [IS, a, b, '+']);
  for (const r of relatingsHeld(e)) if (!out.some((o) => sameEntry(o, r))) out.push(r);
  return out;
}
export const instancesOn = (e: Edge | undefined, options: SpaceOfOptions = {}): Relating[] => relatingsOn(e, options).filter((r) => r[3] === '+');
export const barsOn = (e: Edge | undefined, options: SpaceOfOptions = {}): Relating[] => relatingsOn(e, options).filter((r) => r[3] === '-');
/** the modes on an edge, distinct, in the record's order */
export function modesOn(e: Edge | undefined, options: SpaceOfOptions = {}): string[] {
  const out: string[] = [];
  for (const r of relatingsOn(e, options)) if (!out.includes(r[0])) out.push(r[0]);
  return out;
}

/** THE LEXICON of a mesh: IS, the person's declared words in his order, then every word in use on the mesh's edges not already listed */
export function lexiconOf(shape: Shape | undefined, declared: readonly string[]): string[] {
  const out: string[] = [IS];
  for (const w of declared) if (isWord(w) && !out.includes(w)) out.push(w);
  for (const e of shape?.edges ?? []) for (const r of relatingsHeld(e)) if (!out.includes(r[0])) out.push(r[0]);
  return out;
}

export interface RelatingRefusal {
  corner: VertexId | null;
  item: string | null;
  why: string;
}
export type RelatingAct = { relating: Relating; refused: null } | { relating: null; refused: RelatingRefusal };
const refuse = (corner: VertexId | null, item: string | null, why: string): RelatingAct => ({ relating: null, refused: { corner, item, why } });

/**
 * THE ACT, checked before it is written (the triad's discipline, C-14): the edge exists; the mode is a word; x is a role the
 * FIRST corner's space holds and y one the SECOND's holds (the corners resolved through the resolver); an IS-instance is not this
 * act's — it is the pairing's (`giveRolePair`), so the record keeps one home for it. Refused whole with the pick named, else the
 * relating as the edge will store it.
 */
export function relatingOf(shape: Shape, edgeId: string, w: string, x: string, y: string, sign: Sign, options: SpaceOfOptions = {}, memo: Map<VertexId, Resolved | null> = new Map()): RelatingAct {
  const label = (id: VertexId): string => shape.vertices[id]?.data.label || id;
  const e = shape.edges.find((c) => c.id === edgeId);
  if (!e) return refuse(null, null, 'no such edge on this solid');
  const mode = w.trim();
  if (!isWord(mode)) return refuse(null, null, 'a relating needs a mode — a word');
  if (mode === IS && sign === '+') return refuse(null, null, 'an IS-instance is the pairing itself — give it as a pairing');
  const [X, Y] = e.vertexIds;
  for (const [corner, item] of [[X, x], [Y, y]] as Array<[VertexId, string]>) {
    if (!isWord(item)) return refuse(corner, item, `nothing pointed at ${label(corner)}`);
    const R = spaceOf(shape, corner, options, memo);
    if (!R) return refuse(corner, item, `${label(corner)} holds no space — nothing to relate there`);
    if (!R.space.roles.some((r) => r.id === item)) return refuse(corner, item, `${item} is not a role of ${label(corner)}`);
  }
  return { relating: [mode, x, y, sign], refused: null };
}

// relatings — STAMP MODES-1 · B1 (2026-09-26; the researcher's ruling THE PROJECTION — the edge is relatings with modes, the
// child is the instance space — decided by Arman in the grill of 09-26 15:31–16:38 (Δ117), "start the build now" (Δ118); the
// mothership's step-0 ruling of 17:06: design (A), the packet home, no vertex id in any packet): THE EDGE RECORD IN MODES.
//
// THE MEDIUM (D2). Every edge e = XY is a medium; its extent is every (w, x, y) with w a word of the lexicon L, x a role of X,
// y a role of Y — three-valued, initially unknown. Unknown is ABSENCE, never a value: nothing here stores an unknown entry.
// THE RELATING (D3, corrected by D13 — STAMP MODES-4, the second resolution §1, ADR 0031 §9.8): a relating is a MODE, a SUBJECT,
// an OBJECT and a SIGN. The subject and the object are roles of the edge's two corners IN EITHER ORDER: the extent is
// L × ((R_X × R_Y) ∪ (R_Y × R_X)) × {+, −, unknown}. The record KEEPS THE COORDINATE ORDER (x of the edge's FIRST corner, y of
// its SECOND — exactly as `roles` reads today) and carries the DIRECTION POSITIONALLY, never by a vertex id: `→` when x is the
// subject ("x w y"), `←` when y is ("y w x"). "x w y" and "y w x" are two entries. IS is symmetric: it carries no direction (the
// pairing). Every relating recorded before D13 is `→` BY READING (the act could store nothing else — measured), so the migration
// is by reading and no record changes. THE CARRY at a dissection mirrors x ↔ y AND flips the direction: the sentence is preserved.
// A reader that walks an edge against its stored order does the same (`relatingsFrom`, sorting.ts) — it never keeps a word on
// swapped coordinates; a leg read against the walk prints as the person said it.
// IS (D12). One word of L is reserved for transport: IS. An IS-instance (IS, a, b, +) IS the pairing (a, b) the person gives
// through the J register — its home stays the typed record `identification.roles` (frozen, untouched), so the lift, the door
// and the cargo, which read the pairing through the resolver's one reader, ride IS-instances only WITHOUT A LINE CHANGED.
// THE HOME of every other relating — the other modes, and every bar (IS's included) — is the EDGE's open packet,
// `edge.data.relatings`: `[w, x, y, sign]` or `[w, x, y, sign, dir]` items, role ids and words only, NO VERTEX ID INSIDE (the
// mothership's condition; the C-14 precedent: the frozen loader re-roots only the ids it names and leaves a packet verbatim, so
// the record crosses the lift as it is; the dissection carries it mirrored where the derived edge's direction flips, as `ambo.ts`
// carries `roles`). THE MIGRATION (B1's seal) is done BY READING, never by rewriting: `relatingsOn` reads the pairing in force
// as IS-instances and the packet as the rest, so every file, lift and dissection that exists today reads as before, byte for byte
// (RECORD, NOT READING: the inputs are stored, everything else is re-derived at every read).
// THE LEXICON (D1). L is shared across the mesh: IS, then the words the person DECLARED (the store's `lexicon`, in his order,
// persisted with the workspace — a declaration is an act), then every word IN USE on the mesh's edges not already listed. A
// word in use is never lost by withdrawing its declaration: the relatings are the person's record. A CONVERSE (D13) is an
// optional EQUATION of the person's in the lexicon, `y w′ x ≡ x w y` — a rule of the converse kind; it is not needed to carry
// direction. A mode is TRANSPARENT by default and may be declared OPAQUE once, where it is declared (§9.13): substitution rides
// through transparent modes only. Both are the store's facts beside the lexicon (`converses`, `opaque`), persisted; the form of
// their gesture is the designer's — nothing here offers one.
// B1 exposes NOTHING to the readers of the core (the glue, the feet, the respects, the face): they read the IS-instances as
// before. The instance space (B2) and the paths, verdicts and sorting (B3) read this record. No copy reaches the screen here.
// Pinned by scripts/diagnose-modes1-the-edge-in-modes.cjs and scripts/diagnose-modes4-the-record-and-the-sorting.cjs.

import type { Edge, JsonValue, PacketData, Shape, VertexId } from '../types/geometry';
import { unconditionalOn } from './respects';
import { spaceOf, type SpaceOfOptions } from './spaceOf';

/** the word of L reserved for transport (D12) */
export const IS = 'IS';
export const RELATINGS_KEY = 'relatings';

export type Sign = '+' | '-';
/** the direction of a relating, positional (D13): `→` x (the first corner's role) is the subject, `←` y is; IS carries none */
export type Dir = '→' | '←';
export const ALONG: Dir = '→';
export const AGAINST: Dir = '←';
/** a relating as the edge stores it: the mode, x of the edge's first corner, y of its second, the sign (+ instance, − bar), and the direction (absent = `→`, by reading) */
export type Relating = [string, string, string, Sign] | [string, string, string, Sign, Dir];

const isWord = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
export const isRelating = (v: unknown): v is Relating =>
  Array.isArray(v) && (v.length === 4 || v.length === 5) && isWord(v[0]) && isWord(v[1]) && isWord(v[2]) && (v[3] === '+' || v[3] === '-') && (v.length === 4 || v[4] === ALONG || v[4] === AGAINST);
/** the direction a relating carries: `→` unless it says `←`; IS is symmetric and reads `→` whatever it says */
export const dirOf = (r: Relating): Dir => (r[0] === IS ? ALONG : r.length === 5 && r[4] === AGAINST ? AGAINST : ALONG);
/** the relating's subject and object, as the person said it */
export const subjectOf = (r: Relating): string => (dirOf(r) === ALONG ? r[1] : r[2]);
export const objectOf = (r: Relating): string => (dirOf(r) === ALONG ? r[2] : r[1]);
/** the same entry of the extent: the mode, both endpoints AND the direction — "x w y" and "y w x" are two entries (the sign is the entry's value) */
export const sameEntry = (s: Relating, t: Relating): boolean => s[0] === t[0] && s[1] === t[1] && s[2] === t[2] && dirOf(s) === dirOf(t);
/** a relating with its direction made explicit only where it is `←` (a `→` relating stores as before — the migration is by reading) */
export const relating = (w: string, x: string, y: string, sign: Sign, dir: Dir = ALONG): Relating => (dir === AGAINST && w !== IS ? [w, x, y, sign, AGAINST] : [w, x, y, sign]);
const copy = (r: Relating): Relating => relating(r[0], r[1], r[2], r[3], dirOf(r));
/** the relating mirrored (x ↔ y) with its direction flipped — the same act said from the other corner (the carry, the walk against the stored order) */
export const mirrored = (r: Relating): Relating => relating(r[0], r[2], r[1], r[3], dirOf(r) === ALONG ? AGAINST : ALONG);

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

/** the edge with one relating set — an entry already held with the same sign leaves the edge as it is; with the other sign it is replaced (one entry per (w, x, y, dir)) */
export function withRelating(edge: Edge, r: Relating): Edge {
  const held = relatingsHeld(edge);
  const at = held.findIndex((h) => sameEntry(h, r));
  if (at >= 0 && held[at][3] === r[3]) return edge;
  const next = at >= 0 ? held.map((h, i) => (i === at ? copy(r) : h)) : [...held, copy(r)];
  return writeHeld(edge, next);
}

/** the edge with one entry withdrawn (the person's hand back); an empty record leaves no key behind */
export function withoutRelating(edge: Edge, w: string, x: string, y: string, dir: Dir = ALONG): Edge {
  const held = relatingsHeld(edge);
  const next = held.filter((h) => !(h[0] === w && h[1] === x && h[2] === y && dirOf(h) === (w === IS ? ALONG : dir)));
  if (next.length === held.length) return edge;
  return writeHeld(edge, next);
}

/** THE CARRY at a dissection: the packet's relatings as a JSON value for the derived edge of the same pair, mirrored when that edge is walked the other way (x ↔ y AND the direction flipped — the same sentence said from the new first corner, D13) */
export function carriedRelatings(data: PacketData | undefined, mirror: boolean): JsonValue | undefined {
  const held = relatingsHeld({ data } as Edge);
  if (held.length === 0) return undefined;
  return (mirror ? held.map(mirrored) : held) as unknown as JsonValue;
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

/** THE LEXICON'S FACTS beside the words (D13, §9.13): the person's converse equations `w′ ≡ conv(w)` and the modes he declared opaque */
export interface LexiconFacts {
  converses: ReadonlyArray<readonly [string, string]>;
  opaque: readonly string[];
}
export const NO_FACTS: LexiconFacts = { converses: [], opaque: [] };
/** the converse of a word under the person's equations, or null — an equation reads both ways */
export function converseOf(facts: LexiconFacts, w: string): string | null {
  for (const [a, b] of facts.converses) { if (a === w) return b; if (b === w) return a; }
  return null;
}
export const isOpaque = (facts: LexiconFacts, w: string): boolean => facts.opaque.includes(w);

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
 * relating as the edge will store it — with its direction (D13: the subject's side is the person's; `→` unless he says `←`).
 */
/** the source of a corner's roles for the act's check: the resolver's space by default; the store hands the modes layer's reader (B4: a born corner's roles are its instances) */
export type RoleSource = (shape: Shape, corner: VertexId, options: SpaceOfOptions) => { roles: Array<{ id: string }> } | null;
const resolverRoles: RoleSource = (shape, corner, options) => { const R = spaceOf(shape, corner, options); return R ? R.space : null; };

export function relatingOf(shape: Shape, edgeId: string, w: string, x: string, y: string, sign: Sign, options: SpaceOfOptions = {}, roleSource: RoleSource = resolverRoles, dir: Dir = ALONG): RelatingAct {
  const label = (id: VertexId): string => shape.vertices[id]?.data.label || id;
  const e = shape.edges.find((c) => c.id === edgeId);
  if (!e) return refuse(null, null, 'no such edge on this solid');
  const mode = w.trim();
  if (!isWord(mode)) return refuse(null, null, 'a relating needs a mode — a word');
  if (mode === IS && sign === '+') return refuse(null, null, 'an IS-instance is the pairing itself — give it as a pairing');
  const [X, Y] = e.vertexIds;
  for (const [corner, item] of [[X, x], [Y, y]] as Array<[VertexId, string]>) {
    if (!isWord(item)) return refuse(corner, item, `nothing pointed at ${label(corner)}`);
    const sp = roleSource(shape, corner, options);
    if (!sp) return refuse(corner, item, `${label(corner)} holds no space — nothing to relate there`);
    if (!sp.roles.some((r) => r.id === item)) return refuse(corner, item, `${item} is not a role of ${label(corner)}`);
  }
  return { relating: relating(mode, x, y, sign, dir), refused: null };
}

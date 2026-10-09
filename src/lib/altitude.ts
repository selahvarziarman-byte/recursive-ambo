// altitude — STAMP THE-ALTITUDE · slice 1 (2026-10-09; ADR 0031 §9.29 D22–D25 with §9.30's second entry kind defined; the ruling
// THE PROJECTION §19; the mothership's 10-08 18:57 (step 0) and 19:43 (M1), its 10-09 09:09 BUILD on Arman's word of 09:06; the
// coder's 08:49 price, option (a)): THE ALTITUDE'S RECORD — the opposite corner's statement of itself at the midpoint.
//
// THE ALTITUDE (D22). For a face XYZ and its edge e = XY, A(Z, e) is a record keyed by (face, opposite corner Z, edge e) — the apex-trace
// the engine keeps as an address with no body (the registry's face-mediation readings; the surface's `site.sources[].apexes`), given a
// body. The body is the person's statement in Z's LIGHT at e: SAYINGS (z, w, e, x, s) — z a role of Z, e THE END'S SLOT in the face's corner order (the mothership's M2, 11:54: a cell is (end, role),
// keyed as the apex is — so a role id both ends carry is told apart by its end, and a saying filed under the wrong end is refused by name), x a role of that end, w a word of the
// lexicon L (D1), s holds (+) or does not hold (−). THE SUBJECT IS ALWAYS z: ONE DIRECTION PER LIGHT (Arman 18:00). A saying whose subject
// is an end's role belongs to the altitude where that end is the light and is REFUSED HERE BY NAME (F2). A cell (z, x) may carry several
// sayings in several words; a cell with none is SILENT — absence, never a value; nothing here stores a silence. The key exists from the
// triangulation, before any act (Δ110); the body is empty until he states it. It is face-local by construction and is never written on
// the edges XZ, YZ. The device offers no entry, composes none, ranks none (Δ80). Two spellings are two words until his word.
// THE SECOND ENTRY KIND (§9.30 R1 — defined here, its acts and its box in slice 2): a saying about a BOND at an end, `at x, S(z, z′) holds /
// does not hold` — the person's override of the configuration the casts induce. Nothing of it is read in slice 1 beyond its shape.
// THE HOME. The FACE's open packet, `face.data.altitudes`, an object keyed by the APEX'S SLOT in `face.vertexIds` ('0' · '1' · '2'),
// each slot an array of entries — role ids and words only, NO VERTEX ID INSIDE (a vertex id in an open field goes stale at the lift's
// namespacing, the scar of 09-25; a slot is structural, as `cornerAngles[k]` is index-aligned); role ids are cast-local and ride as the
// relatings' do (relatings.ts, B1). The snapshot writes the Shape as a deep clone and its loader spreads every face keeping `data`
// (snapshot.ts, measured at the price), so the altitude rides every save, load, lift and dissection with the frozen files untouched:
// no spend of `snapshot.ts` (row 89) or `types/geometry.ts` (row 90). A face a dissection keeps (every cell's faces ride the new shape)
// keeps its altitudes; a face born at a dissection starts empty (D28: untested, no gesture in this build).
// THE MARKS (D23). Every relating r = (w′, x, y, ±) of the child carries at once, as FORM, the altitude's sayings on its two end-cells: at
// x the roles of Z present in x and denied of x, each with its word; at y likewise. Nothing is subtracted, merged, refused or locked by a
// mark: the child's relatings stay his, byte for byte. Z's REACH at e = the end-roles with a present mark; Z's REFUSALS = the denied
// cells; both read off the altitude alone.
// THE PASSAGES (D24). A path through Z at e from the altitude is two PRESENT sayings on one z, (z, w, x, +) and (z, w′, y, +) — a FORK at
// z, the shape the sorting already reads. `altitudeLegs` hands them to the sorting as legs in the walk's form — at x, `z w x` walked
// X → Z is [w, x, z, +, ←]; at y, `z w′ y` walked Z → Y is [w′, z, y, +, →] — so D6's verdicts and rules and D7's sorting read them
// unchanged, under the source 'altitude' (sorting.ts), beside the edges' own legs and never merged with them.
// THE STATE (D25). VACUOUS UNDER Z: the altitude is empty — the corner has not spoken — whatever stands on Z's edges.
// RECORD, NOT READING: the sayings are input; the marks, the reach, the refusals, the legs and the state are re-derived at every read.
// React-free; DOM-free; the store's one writer calls `withSaying` / `withoutSaying`; the act is checked by `altitudeSayingOf` first.
// Pinned by scripts/diagnose-the-altitude.cjs (F1 · F2 · F3 · F6 · F7 on Virgin Land's 18:34 record with ARMAN-2 written in through
// this file, agreeing with the reference instruments `the_altitude_marks.cjs` and `the_lit_grid.cjs`).

import type { Edge, Face, JsonValue, PacketData, Shape, VertexId } from '../types/geometry';
import { childSpaceOf } from './instanceSpace';
import { AGAINST, ALONG, isReservedWord, relating, reservedWordRefusal, type Relating, type Sign } from './relatings';
import type { SpaceOfOptions } from './spaceOf';

export const ALTITUDES_KEY = 'altitudes';

/** THE END'S SLOT in the face's corner order (0 · 1 · 2) — the cell's structural key beside the role (M2: a cell is (end, role); keyed as the apex is, by slot — never a vertex id, never a label) */
export type EndSlot = 0 | 1 | 2;
/** a SAYING in Z's light (D22): the kind, z a role of Z, the word, THE END'S SLOT, x a role of that end, the sign — and, where he gave one, his WHY (the box's optional line; ARMAN-2 carries them) */
export type AltitudeSaying = ['say', string, string, EndSlot, string, Sign] | ['say', string, string, EndSlot, string, Sign, string];
/** a saying about a BOND at an end (§9.30 R1): the kind, THE END'S SLOT, x the end's role, S the relation's word, z and z′ the two roles of Z, the sign */
export type BondSaying = ['bond', EndSlot, string, string, string, string, Sign];
export type AltitudeEntry = AltitudeSaying | BondSaying;

const isWord = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;
const isSign = (v: unknown): v is Sign => v === '+' || v === '-';
const isEndSlot = (v: unknown): v is EndSlot => v === 0 || v === 1 || v === 2;
export const isAltitudeSaying = (v: unknown): v is AltitudeSaying => Array.isArray(v) && (v.length === 6 || (v.length === 7 && typeof v[6] === 'string')) && v[0] === 'say' && isWord(v[1]) && isWord(v[2]) && isEndSlot(v[3]) && isWord(v[4]) && isSign(v[5]);
export const isBondSaying = (v: unknown): v is BondSaying => Array.isArray(v) && v.length === 7 && v[0] === 'bond' && isEndSlot(v[1]) && isWord(v[2]) && isWord(v[3]) && isWord(v[4]) && isWord(v[5]) && isSign(v[6]);
export const isAltitudeEntry = (v: unknown): v is AltitudeEntry => isAltitudeSaying(v) || isBondSaying(v);

export const saying = (z: string, w: string, e: EndSlot, x: string, s: Sign, why?: string | null): AltitudeSaying => (why && why.trim() ? ['say', z, w, e, x, s, why.trim()] : ['say', z, w, e, x, s]);
/** an entry's sign (the sixth place of a saying, with or without a why; the seventh of a bond saying) */
export const signOf = (e: AltitudeEntry): Sign => (e[0] === 'say' ? e[5] : e[6]);
/** his WHY on a saying, or null (a bond saying carries none) */
export const whyOf = (e: AltitudeEntry): string | null => (e[0] === 'say' && e.length === 7 ? e[6] : null);
/** the END an entry is filed under — its slot — and the end's role it names (a cell is (end, role), M2) */
export const endSlotIn = (e: AltitudeEntry): EndSlot => (e[0] === 'say' ? e[3] : e[1]);
export const endRoleIn = (e: AltitudeEntry): string => (e[0] === 'say' ? e[4] : e[2]);
/** one spelling of a cell's key, (end slot, role) — the marks map's and the surface's */
export const cellKey = (e: EndSlot | number, x: string): string => `${e}|${x}`;
const copy = (e: AltitudeEntry): AltitudeEntry => [...e] as AltitudeEntry;
/** the same CELL ENTRY: z, the word, the end and x — the sign is the entry's value (a saying with the other sign replaces it, as a relating's does) */
export const sameSaying = (a: AltitudeSaying, b: AltitudeSaying): boolean => a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4];
export const sameEntry = (a: AltitudeEntry, b: AltitudeEntry): boolean =>
  a[0] === b[0] && (a[0] === 'say' && b[0] === 'say' ? sameSaying(a, b) : a[0] === 'bond' && b[0] === 'bond' ? a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] : false);

/** the apex's SLOT in the face's corner order — the altitude's structural key; −1 when the corner is not the face's */
export const apexSlotOf = (face: Pick<Face, 'vertexIds'>, apex: VertexId): number => face.vertexIds.indexOf(apex);
/** an END's SLOT in the face's corner order — a saying's structural key for its end (M2); −1 when the corner is not the face's */
export const endSlotOf = (face: Pick<Face, 'vertexIds'>, end: VertexId): number => face.vertexIds.indexOf(end);

const slotsHeld = (face: Pick<Face, 'data'> | undefined): Record<string, JsonValue> => {
  const raw = face?.data?.[ALTITUDES_KEY];
  return raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, JsonValue>) : {};
};

/** the entries the face's packet holds for one apex slot — well-formed items only; nothing else is read into a record */
export function altitudeHeld(face: Pick<Face, 'data'> | undefined, slot: number): AltitudeEntry[] {
  const raw = slotsHeld(face)[String(slot)];
  if (!Array.isArray(raw)) return [];
  return (raw as unknown[]).filter(isAltitudeEntry).map(copy);
}
/** the items under a slot that are NOT well-formed — a reader that wants to say so (the witness) can; the record never carries them on */
export function malformedHeld(face: Pick<Face, 'data'> | undefined, slot: number): unknown[] {
  const raw = slotsHeld(face)[String(slot)];
  return Array.isArray(raw) ? (raw as unknown[]).filter((v) => !isAltitudeEntry(v)) : [];
}

function writeHeld(face: Face, slot: number, list: AltitudeEntry[]): Face {
  const slots: Record<string, JsonValue> = { ...slotsHeld(face) };
  if (list.length === 0) delete slots[String(slot)]; else slots[String(slot)] = list.map(copy) as unknown as JsonValue;
  const rest: PacketData = { ...(face.data ?? {}) };
  delete rest[ALTITUDES_KEY];
  const data: PacketData = Object.keys(slots).length ? { ...rest, [ALTITUDES_KEY]: slots } : rest;
  if (Object.keys(data).length === 0) return (({ data: _d, ...f }) => { void _d; return f as Face; })(face);
  return { ...face, data };
}

/** the face with one saying set at the apex's slot — the same cell entry with the same sign leaves the face as it is; with the other sign it is replaced */
export function withSaying(face: Face, slot: number, s: AltitudeSaying): Face {
  const held = altitudeHeld(face, slot);
  const at = held.findIndex((h) => h[0] === 'say' && sameSaying(h, s));
  if (at >= 0 && signOf(held[at]) === signOf(s) && whyOf(held[at]) === whyOf(s)) return face;
  const next = at >= 0 ? held.map((h, i) => (i === at ? copy(s) : h)) : [...held, copy(s)];
  return writeHeld(face, slot, next);
}
/** the face with one saying withdrawn (his hand back); an empty slot leaves no key behind */
export function withoutSaying(face: Face, slot: number, z: string, w: string, e: EndSlot, x: string): Face {
  const held = altitudeHeld(face, slot);
  const next = held.filter((h) => !(h[0] === 'say' && h[1] === z && h[2] === w && h[3] === e && h[4] === x));
  if (next.length === held.length) return face;
  return writeHeld(face, slot, next);
}
/** the face with one bond saying set (slice 2's act; the shape stands now) */
export function withBondSaying(face: Face, slot: number, b: BondSaying): Face {
  const held = altitudeHeld(face, slot);
  const at = held.findIndex((h) => sameEntry(h, b));
  if (at >= 0 && (held[at] as BondSaying)[6] === b[6]) return face;
  const next = at >= 0 ? held.map((h, i) => (i === at ? copy(b) : h)) : [...held, copy(b)];
  return writeHeld(face, slot, next);
}
export function withoutBondSaying(face: Face, slot: number, e: EndSlot, x: string, S: string, z: string, z2: string): Face {
  const held = altitudeHeld(face, slot);
  const next = held.filter((h) => !(h[0] === 'bond' && h[1] === e && h[2] === x && h[3] === S && h[4] === z && h[5] === z2));
  if (next.length === held.length) return face;
  return writeHeld(face, slot, next);
}

export const sayingsOf = (entries: readonly AltitudeEntry[]): AltitudeSaying[] => entries.filter((e): e is AltitudeSaying => e[0] === 'say');
export const bondSayingsOf = (entries: readonly AltitudeEntry[]): BondSaying[] => entries.filter((e): e is BondSaying => e[0] === 'bond');

// ─── THE ACT, checked before it is written (the relating's discipline, B1) ───
export interface AltitudeRefusal {
  corner: VertexId | null; // the corner the refusal names, when one
  item: string | null; // the pick it names, when one
  why: string;
}
export type AltitudeAct =
  | { saying: AltitudeSaying; face: Face; slot: number; refused: null }
  | { saying: null; face: null; slot: -1; refused: AltitudeRefusal };
const refuse = (corner: VertexId | null, item: string | null, why: string): AltitudeAct => ({ saying: null, face: null, slot: -1, refused: { corner, item, why } });

/** the source of a corner's roles for the act's check — the modes layer's reader (B4: a seed's cast, a born corner's own child) */
export type AltitudeRoleSource = (shape: Shape, corner: VertexId, options: SpaceOfOptions) => { roles: Array<{ id: string }> } | null;
const childRoles: AltitudeRoleSource = (shape, corner, options) => childSpaceOf(shape, corner, options);

/**
 * THE SAYING, checked: the face exists and is a triangle holding the apex; THE END is a corner of the face other than the light's (M2 — the
 * box's group hands it in; its slot is the saying's fourth place); the word is a word (IS and ≡ refused by the one predicate — a saying in
 * IS would pair z with x, and the pairing has one home); z is a role of Z — ONE DIRECTION PER LIGHT: a subject that is an end's role is
 * refused by name, its own light named (F2); x is a role of THE END — a role of the other end is refused by name (a relating is filed
 * under its end), so a role id both ends carry is never guessed at. Refused whole with the pick named, else the saying as the face will store it.
 */
export function altitudeSayingOf(shape: Shape, faceId: string, apex: VertexId, end: VertexId, z: string, w: string, x: string, sign: Sign, options: SpaceOfOptions = {}, roleSource: AltitudeRoleSource = childRoles, why: string | null = null): AltitudeAct {
  const label = (id: VertexId): string => shape.vertices[id]?.data.label || id;
  const face = shape.faces.find((f) => f.id === faceId);
  if (!face) return refuse(null, null, "this face isn't on the solid");
  if (face.vertexIds.length !== 3) return refuse(null, null, `the face ${face.vertexIds.map(label).join('·')} has ${face.vertexIds.length} corners; a light speaks at a triangle`);
  const slot = apexSlotOf(face, apex);
  if (slot < 0) return refuse(apex, null, `${label(apex)} isn't a corner of this face`);
  const [X, Y] = face.vertexIds.filter((v) => v !== apex) as [VertexId, VertexId];
  const lz = label(apex);
  // M2 — THE END, by construction: the end corner the box's group hands in, keyed by its slot; the light's own corner is no end
  const e = endSlotOf(face, end);
  if (e < 0) return refuse(end, null, `${label(end)} isn't a corner of this face`);
  if (end === apex) return refuse(apex, null, `${lz} is the light here: a relating runs from its role to a role of ${label(X)} or ${label(Y)}`);
  const other = end === X ? Y : X;
  const word = w.trim();
  if (!isWord(word)) return refuse(null, null, 'a relating needs a word');
  if (isReservedWord(word)) return refuse(null, null, reservedWordRefusal(`a word in ${lz}'s light`));
  if (!isWord(z)) return refuse(apex, z, `nothing picked in ${lz}`);
  if (!isWord(x)) return refuse(end, x, `nothing picked in ${label(end)}`);
  const rolesOf = (corner: VertexId): string[] => (roleSource(shape, corner, options)?.roles ?? []).map((r) => r.id);
  const rz = rolesOf(apex); const re = rolesOf(end);
  if (!rz.includes(z)) {
    // F2 — THE DIRECTION LAW: a subject that is an end's role belongs to the light where that end speaks
    const owner = rolesOf(X).includes(z) ? X : rolesOf(Y).includes(z) ? Y : null;
    if (owner !== null) return refuse(owner, z, `in ${lz}'s light a relating runs from a role of ${lz}; this one belongs in ${label(owner)}'s light`);
    return refuse(apex, z, `${z} isn't a role of ${lz}`);
  }
  if (!re.includes(x)) {
    if (rz.includes(x)) return refuse(apex, x, `${x} is a role of ${lz}: a relating runs from ${lz}'s role to a role of ${label(X)} or ${label(Y)}`);
    if (rolesOf(other).includes(x)) return refuse(other, x, `${x} is a role of ${label(other)}, not of ${label(end)}: a relating is filed under its end`);
    return refuse(end, x, `${x} isn't a role of ${label(end)}`);
  }
  return { saying: saying(z, word, e as EndSlot, x, sign, why), face, slot, refused: null };
}

/**
 * THE BOND SAYING, checked (§9.30 R1 — his override of the induced configuration): the face a triangle holding the apex; x a role of THE END handed
 * in (M2) with z PRESENT at it (a saying stands there); z and z′ roles of Z; S a relation of Z's cast from z to z′ as the cast has it (the
 * override is of what the cast induces, never a relation of his making — composing is D6's); z′ may be absent at x — then the bond he denies
 * is a CUT BOND, cut by his denial (R1's second strength). Refused whole with the pick named.
 */
export function bondSayingOf(shape: Shape, faceId: string, apex: VertexId, end: VertexId, x: string, S: string, z: string, z2: string, sign: Sign, options: SpaceOfOptions = {}, roleSource: AltitudeRoleSource = childRoles, relationsSource: (shape: Shape, corner: VertexId, options: SpaceOfOptions) => Array<{ type: string; terms: string[] }> = (s, c, o) => childSpaceOf(s, c, o)?.relations ?? []): { saying: BondSaying; face: Face; slot: number; refused: null } | { saying: null; face: null; slot: -1; refused: AltitudeRefusal } {
  const label = (id: VertexId): string => shape.vertices[id]?.data.label || id;
  const no = (corner: VertexId | null, item: string | null, why: string) => ({ saying: null, face: null, slot: -1 as const, refused: { corner, item, why } });
  const face = shape.faces.find((f) => f.id === faceId);
  if (!face) return no(null, null, "this face isn't on the solid");
  if (face.vertexIds.length !== 3) return no(null, null, `the face ${face.vertexIds.map(label).join('·')} has ${face.vertexIds.length} corners; a light speaks at a triangle`);
  const slot = apexSlotOf(face, apex);
  if (slot < 0) return no(apex, null, `${label(apex)} isn't a corner of this face`);
  const [X, Y] = face.vertexIds.filter((v) => v !== apex) as [VertexId, VertexId];
  const lz = label(apex);
  const rolesOf = (corner: VertexId): string[] => (roleSource(shape, corner, options)?.roles ?? []).map((r) => r.id);
  // M2 — THE END, by construction: the end corner the box's group hands in, keyed by its slot
  const e = endSlotOf(face, end);
  if (e < 0) return no(end, null, `${label(end)} isn't a corner of this face`);
  if (end === apex) return no(apex, null, `${lz} is the light here: what its relations do is said at a role of ${label(X)} or ${label(Y)}`);
  const other = end === X ? Y : X;
  const rz = rolesOf(apex); const re = rolesOf(end);
  if (!isWord(S)) return no(apex, null, `a relating about a relation of ${lz} needs the relation's word`);
  if (!rz.includes(z)) return no(apex, z, `${z} isn't a role of ${lz}`);
  if (!rz.includes(z2)) return no(apex, z2, `${z2} isn't a role of ${lz}`);
  if (!re.includes(x)) return rolesOf(other).includes(x) ? no(other, x, `${x} is a role of ${label(other)}, not of ${label(end)}: a relating is filed under its end`) : no(end, x, `${x} isn't a role of ${label(end)}`);
  if (!relationsSource(shape, apex, options).some((r) => r.type === S && r.terms.length === 2 && r.terms[0] === z && r.terms[1] === z2)) return no(apex, S, `${lz} has no relation ${S} from ${z} to ${z2}: only a relation the cast has can be said to hold or not here`);
  const held = altitudeHeld(face, slot);
  if (!marksAt(held, e as EndSlot, x).present.some((m) => m.z === z)) return no(end, x, `${z} isn't present at ${x}: say that first, then what its relations do there`);
  return { saying: ['bond', e as EndSlot, x, S, z, z2, sign], face, slot, refused: null };
}

// ─── THE READERS (D23–D25) ───
export interface Mark { z: string; w: string; s: Sign }
/** the marks at a CELL (end slot, role): Z's roles present in it (+) and denied of it (−), each with its word, in the record's order */
export function marksAt(entries: readonly AltitudeEntry[], e: EndSlot, endRole: string): { present: Mark[]; denied: Mark[] } {
  const present: Mark[] = []; const denied: Mark[] = [];
  for (const s of sayingsOf(entries)) if (s[3] === e && s[4] === endRole) (s[5] === '+' ? present : denied).push({ z: s[1], w: s[2], s: s[5] });
  return { present, denied };
}
/** Z's REACH at e: the cells (end slot, role) carrying a present mark, in the record's order, each once */
export function reachOf(entries: readonly AltitudeEntry[]): Array<{ e: EndSlot; x: string }> {
  const out: Array<{ e: EndSlot; x: string }> = [];
  for (const s of sayingsOf(entries)) if (s[5] === '+' && !out.some((c) => c.e === s[3] && c.x === s[4])) out.push({ e: s[3], x: s[4] });
  return out;
}
/** Z's REFUSALS at e: the denied cells, each with its word */
export function refusalsOf(entries: readonly AltitudeEntry[]): Array<{ e: EndSlot; x: string; z: string; w: string }> {
  return sayingsOf(entries).filter((s) => s[5] === '-').map((s) => ({ e: s[3], x: s[4], z: s[1], w: s[2] }));
}
/** VACUOUS UNDER Z (D25): the altitude is empty — the corner has not spoken — whatever stands on Z's edges */
export const vacuousUnder = (entries: readonly AltitudeEntry[]): boolean => entries.length === 0;
/** the roles of Z that have spoken (a present or a denied saying), in the record's order */
export function speakingRoles(entries: readonly AltitudeEntry[]): string[] {
  const out: string[] = [];
  for (const s of sayingsOf(entries)) if (!out.includes(s[1])) out.push(s[1]);
  return out;
}

/** D24 — THE FORKS: two present sayings on one z, one filed under X's slot and one under Y's, as (z, w, x, w′, y) */
export function forksOf(entries: readonly AltitudeEntry[], eX: EndSlot, eY: EndSlot): Array<{ z: string; w: string; x: string; w2: string; y: string }> {
  const present = sayingsOf(entries).filter((s) => s[5] === '+');
  const out: Array<{ z: string; w: string; x: string; w2: string; y: string }> = [];
  for (const a of present) if (a[3] === eX) for (const b of present) if (b[1] === a[1] && b[3] === eY) out.push({ z: a[1], w: a[2], x: a[4], w2: b[2], y: b[4] });
  return out;
}
/**
 * the altitude's present sayings as LEGS in the sorting's walk (X → Z → Y): a saying filed under X's slot, `z w x`, is the leg [w, x, z, +, ←]
 * (z the subject, so the walk X → Z runs against it); one filed under Y's, `z w′ y`, is [w′, z, y, +, →]. Denied sayings are marks, never
 * legs and never bars of the edge (D23). A saying is placed by ITS END'S SLOT — the end is in the record (M2); no role set is consulted.
 */
export function altitudeLegs(entries: readonly AltitudeEntry[], eX: EndSlot, eY: EndSlot): { xz: Relating[]; zy: Relating[] } {
  const xz: Relating[] = []; const zy: Relating[] = [];
  for (const s of sayingsOf(entries)) {
    if (s[5] !== '+') continue;
    if (s[3] === eX) xz.push(relating(s[2], s[4], s[1], '+', AGAINST));
    else if (s[3] === eY) zy.push(relating(s[2], s[1], s[4], '+', ALONG));
  }
  return { xz, zy };
}

/** an entry the reader does NOT READ, by name (M2): MISFILED — under an end whose roles do not hold its role while the other end's do, or under the light's own corner; a STRAY — its role in neither end's space now (MODES-3's kind: kept, listed by the surface, counted by no reader) */
export interface NotReadEntry { entry: AltitudeEntry; kind: 'misfiled' | 'stray'; why: string }
/** THE ALTITUDE at a face for an apex: the face, the slot, the entries READ (filed under an end that holds their role) and the ones not read, each with its why — null where the corner is not the face's */
export function altitudeOf(shape: Shape, faceId: string, apex: VertexId, options: SpaceOfOptions = {}, roleSource: AltitudeRoleSource = childRoles): { face: Face; slot: number; entries: AltitudeEntry[]; notRead: NotReadEntry[] } | null {
  const face = shape.faces.find((f) => f.id === faceId);
  if (!face) return null;
  const slot = apexSlotOf(face, apex);
  if (slot < 0) return null;
  const label = (id: VertexId): string => shape.vertices[id]?.data.label || id;
  const roles = new Map<VertexId, string[]>();
  const rolesOf = (corner: VertexId): string[] => { let r = roles.get(corner); if (!r) { r = (roleSource(shape, corner, options)?.roles ?? []).map((x) => x.id); roles.set(corner, r); } return r; };
  const entries: AltitudeEntry[] = []; const notRead: NotReadEntry[] = [];
  for (const h of altitudeHeld(face, slot)) {
    const e = endSlotIn(h); const x = endRoleIn(h); const end = face.vertexIds[e];
    const words = h[0] === 'say' ? `${h[1]} ${h[2]} ${x}` : `at ${x}, ${h[4]} ${h[3]} ${h[5]}`;
    if (end === undefined || e === slot) { notRead.push({ entry: h, kind: 'misfiled', why: `"${words}" is filed under ${end === undefined ? 'no corner of this face' : `${label(apex)} itself`}: a relating runs to a role of an end` }); continue; }
    if (!rolesOf(end).includes(x)) {
      const other = face.vertexIds.find((v) => v !== apex && v !== end) as VertexId;
      if (rolesOf(other).includes(x)) notRead.push({ entry: h, kind: 'misfiled', why: `"${words}": ${x} is a role of ${label(other)}, not of ${label(end)} — a relating is filed under its end` });
      else notRead.push({ entry: h, kind: 'stray', why: `"${words}": ${x} isn't a role of ${label(end)} now` });
      continue;
    }
    entries.push(h);
  }
  return { face, slot, entries, notRead };
}
/** every altitude at an edge: for each triangular face through it, the opposite corner's record (one per corner — a face two cells hold is one light) */
export function altitudesAt(shape: Shape, edge: Edge | undefined, options: SpaceOfOptions = {}): Array<{ apex: VertexId; faceId: string; slot: number; entries: AltitudeEntry[] }> {
  if (!edge) return [];
  const [X, Y] = edge.vertexIds;
  const out: Array<{ apex: VertexId; faceId: string; slot: number; entries: AltitudeEntry[] }> = [];
  const seen = new Set<VertexId>();
  for (const f of shape.faces) {
    if (f.vertexIds.length !== 3 || !f.vertexIds.includes(X) || !f.vertexIds.includes(Y)) continue;
    const apex = f.vertexIds.find((v) => v !== X && v !== Y) as VertexId;
    if (seen.has(apex)) continue;
    seen.add(apex);
    out.push({ apex, faceId: f.id, slot: apexSlotOf(f, apex), entries: altitudeOf(shape, f.id, apex, options)?.entries ?? [] });
  }
  return out;
}
/** the words the altitudes of a shape use — for the lexicon's reading of words IN USE (D1: a word in use is never lost) */
export function altitudeWordsOf(shape: Shape | undefined): string[] {
  const out: string[] = [];
  for (const f of shape?.faces ?? []) for (const k of Object.keys(slotsHeld(f))) for (const e of altitudeHeld(f, Number(k))) { const w = e[0] === 'say' ? e[2] : e[3]; if (!out.includes(w)) out.push(w); }
  return out;
}

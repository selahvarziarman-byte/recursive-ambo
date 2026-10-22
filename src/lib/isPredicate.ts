// isPredicate — GROUP 4 · slice 2 (2026-10-22; ADR 0031 §9.76 (4), the researcher's 11:27, ratified — claims §512; §9.75 and its ADDENDUM of 13:58, claims
// §507 and §521; the designer's 14:05 sentence): ONE `IS` PREDICATE FOR EDGE AND SEAM. The checks an IS pair of two moments must pass are the same
// wherever the pair is made — at a generation-≥2 medial edge of the Ambo (the pairing tab) and at a seam of an identification on the Manuscript
// (the door) — and they live here, once, read by both acts:
//   · D15 — THE SHARED COORDINATE: two ends holding ONE role of the parents' shared corner are not paired; two IS ends are the pairing that lives on
//     the other parents' edge (LAYOUT-1 §7 / COPY-1 §4.3), a MODE end makes the two the generation-1 PASSAGE through that corner, decided at that
//     edge's site (§9.75; the designer's 09:17). The data (`MidpointSolidRefusal`, moved here from the store) and the three sentences are one producer.
//   · THE MARKS (§9.75 ADDENDUM): a pulled-back mark is a value AT the moment — the parent's quality composed with the coordinate (MOLD v7 §8; D4 pulls
//     back one-place words as it pulls back two-place ones). An IS pair makes two moments one, and one moment cannot carry two values of one word;
//     the words compared are those both ends carry under ONE key — the shared parent's words, read AT THE PARENT'S COORDINATE of each end (one cast,
//     one key, by construction: never the two children's `A:`/`B:`-prefixed copies matched by spelling), and any two words his τ on the edge joins;
//     the other parents' words are foreign until translated; `UNKNOWN` and an omission are no value. Refused in the designer's sentence, naming the
//     word, the two values and the two coordinates with the moments' names; a further conflicting word rides the same sentence (`, and its “…” is …`).
//     The values through the page's own value words (`valueWords`, COPY-1 P2 — moved here from the surface, one producer). The words in the cast's
//     own order (the order its roles declare them).
//   · THE STONE BY COMPOSITION THROUGH SEAMS (§9.76 (4), the torus's two doors included): the pairs standing on EVERY seam of a form, composed with
//     the record's own IS steps on its seed and medial edges, must not make two moments of ONE corner one — `compositionStoneOf` reads the classes
//     with and without the candidate's pairs, and the class the candidate makes is named by its corner and its two moments (the identity regime's
//     stone, C-8c, at the moments' grain: §9.75 (2) stands, an IS pair of two moments makes no coordinate one, so the content stone of the resolver
//     is not what a seam composes — the moments themselves are).
// What is NOT here: the one-to-one law (a role takes one partner) is each record's own shape — the edge record's at the store, the door's lines
// (`form`) at the door; the J check on the two ends' RECORDS (`refusalOf`) stays at both sites as it was. RECORD, NOT READING: derived at every
// act from the shape, stored nowhere. React-free; DOM-free; writes nothing.
import type { Shape, VertexId } from '../types/geometry';
import { edgeBetween } from './faceReading';
import { columnSpaceOf, instancesFrom, termWordsOf, wordWordsOf } from './instanceSpace';
import { valuesAgree } from './jRegister';
import { instancesOn, IS } from './relatings';
import { edgeKind, type SpaceOfOptions } from './spaceOf';
import { transportStepOf } from './transport';

/** LAYOUT-1 §7 — at a generation-2 site, pairing two relatings that hold the same role of the shared corner is refused; the refusal says where
 *  that pairing lives, one generation down, and takes him there: the shared corner and its role both hold, the two relatings' other ends,
 *  the edge between the two other parents (where the pairing of those ends is made), whether he has paired them there, and that edge's midpoint */
export interface MidpointSolidRefusal {
  corner: VertexId; // the corner both relatings hold a role of (the parents' shared corner)
  role: string; // that role, as the corner names it
  others: [string, string]; // the two relatings' other ends, as their own corners name them (the first for the act's first end)
  edge: [VertexId, VertexId] | null; // the edge between the two other parents — where their pairing lives; null where there is no such edge
  paired: boolean; // he has paired those two ends on that edge already
  open: VertexId | null; // that edge's midpoint — the view `open B–C` goes to
  instances: [string, string]; // the two relatings as sentences, for the form used anywhere else
  modes: [string, string]; // §9.75: each end's mode (IS, or a relating's word) — a mode end makes the pair the generation-1 PASSAGE through the shared corner (D15)
  corners: [VertexId, VertexId]; // the two other parents in the act's order — the passage runs from the first end's other corner to the second's
}

/** one word of the shared parent (or two words his τ joins) carrying two values at the two ends */
export interface MarkConflict {
  key: string; // the word's key at the parent (a τ-joined pair as `ku≡kv`)
  word: string; // the word's words, as the page says a word (never its key where the page has words for it)
  joined: boolean; // true for two words his τ on the edge joins; false for the shared parent's own word
  xValue: string; // the value at the first end's coordinate
  yValue: string; // the value at the second end's coordinate
}

/** §9.75 ADDENDUM — the pair refused because its two moments carry two values of one word: the shared parent, the two coordinates (its roles), the two moments, the words */
export interface MarksRefusal {
  parent: VertexId;
  parentWords: string; // the parent's name
  coordinates: [string, string]; // the two ends' coordinates at the parent, as the parent names its roles
  moments: [string, string]; // the two ends, as a person reads them (his names)
  words: MarkConflict[]; // every conflicting word, in the cast's order
}

export type IsPairRefusal =
  | { kind: 'solid'; solid: MidpointSolidRefusal; form: string } // D15 — the sentence the mode decides (the pairing one generation down, or the passage)
  | { kind: 'marks'; marks: MarksRefusal; form: string }; // the marks — the designer's sentence

/** how a site reads the shape for this predicate: the instance reading's options (τ drafts, his records) and the names a person reads */
export interface IsPredicateReaders {
  options?: SpaceOfOptions; // the reading of the instances (the store's τ drafts; the Manuscript's plain reading)
  names?: (corner: VertexId, id: string) => string; // a moment's or a role's words at its corner (the store with his records; the door its labels)
  tau?: Array<[string, string]>; // his τ on the edge between the two ends, in force — two words of the ends joined
}

/** COPY-1 P2: a tuple's value in words (one producer; the surface reads it from here) */
export const valueWords = (v: string): string => (v === 'does-not-hold' ? 'does not hold' : v);

const labelOf = (shape: Shape, v: VertexId): string => shape.vertices[v]?.data.label || 'unnamed';

/** the midpoint minted between two corners, when the shape holds it */
export const midpointBetween = (shape: Shape, a: VertexId, b: VertexId): VertexId | null =>
  Object.values(shape.vertices).find((v) => v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(a) && v.createdBy.sourceVertexIds.includes(b))?.id ?? null;

/** the two ends' parents: the shared corner P and each end's other parent — null where the two are not both children of two corners sharing one */
export function sharedParentOf(shape: Shape, U: VertexId, V: VertexId): { P: VertexId; Qu: VertexId; Qv: VertexId } | null {
  const pu = shape.vertices[U]?.createdBy.sourceVertexIds ?? [];
  const pv = shape.vertices[V]?.createdBy.sourceVertexIds ?? [];
  if (pu.length !== 2 || pv.length !== 2) return null;
  const P = pu.find((p) => pv.includes(p));
  if (P === undefined) return null;
  const Qu = pu.find((p) => p !== P);
  const Qv = pv.find((p) => p !== P);
  if (Qu === undefined || Qv === undefined) return null;
  return { P, Qu, Qv };
}

const readers = (shape: Shape, R: IsPredicateReaders): { options: SpaceOfOptions; names: (corner: VertexId, id: string) => string; tau: Array<[string, string]> } => ({
  options: R.options ?? {},
  names: R.names ?? ((corner, id) => termWordsOf(shape, corner, id, R.options ?? {})),
  tau: R.tau ?? [],
});

/**
 * D15 — THE SHARED COORDINATE: the two ends hold one role of the parents' shared corner. Null where the two are not such ends, or hold two
 * different roles of it. (The store's `solidRefusal`, generalized to any two corners of any shape — the edge's ends at the Ambo, a seam's two
 * corners on the Manuscript's record.)
 */
export function sharedCoordinateOf(shape: Shape, U: VertexId, V: VertexId, x: string, y: string, R: IsPredicateReaders = {}): MidpointSolidRefusal | null {
  const { options, names } = readers(shape, R);
  const S = sharedParentOf(shape, U, V);
  if (!S) return null;
  const { P, Qu, Qv } = S;
  const iu = instancesFrom(shape, P, Qu, options).find((k) => k.key === x);
  const iv = instancesFrom(shape, P, Qv, options).find((k) => k.key === y);
  if (!iu || !iv || iu.p !== iv.p) return null;
  const between = edgeBetween(shape.edges, Qu, Qv) ?? null;
  // the pairs on that edge through the one reader (B1: `instancesOn` — IS-instances are the pairing), in the edge's own order
  const paired = !!between && instancesOn(between).some((r) => r[0] === IS && (between.vertexIds[0] === Qu ? r[1] === iu.q && r[2] === iv.q : r[1] === iv.q && r[2] === iu.q));
  return {
    corner: P,
    role: names(P, iu.p),
    others: [names(Qu, iu.q), names(Qv, iv.q)],
    edge: between ? [between.vertexIds[0], between.vertexIds[1]] : null,
    paired,
    open: between ? midpointBetween(shape, between.vertexIds[0], between.vertexIds[1]) : null,
    instances: [names(U, x), names(V, y)],
    modes: [iu.mode, iv.mode],
    corners: [Qu, Qv],
  };
}

// ONE NAME FOR ONE SITE (measured 10-22: the sentence named the site from the act's corner order and `open` from the edge's stored order — `Finance–Distribution` over
// `open Distribution–Finance`): the passage's site is named as the page names its MIDPOINT — his name where he gave one, else the corners' as the midpoint is labelled — in
// both sentences and on `open` alike (the surface reads the same label); an edge with no midpoint keeps the corners' composition
export const siteWords = (shape: Shape, s: MidpointSolidRefusal): string | null => {
  const mid = s.open ? shape.vertices[s.open]?.data.label : undefined;
  return mid || (s.edge ? `${labelOf(shape, s.edge[0])}–${labelOf(shape, s.edge[1])}` : null);
};

/** two IS ends holding one role of the shared corner: the pairing that makes them one lives on the other parents' edge, one generation down */
export const solidWords = (shape: Shape, s: MidpointSolidRefusal): string => {
  if (s.edge) {
    const e = siteWords(shape, s) as string;
    return s.paired
      ? `these are already one: both hold ${s.role}, and you paired ${s.others[0]} with ${s.others[1]} on ${e}`
      : `both hold ${s.role}, so this means pairing ${s.others[0]} with ${s.others[1]}, which you do on ${e}`;
  }
  return `the solid already makes ${s.instances[0]} and ${s.instances[1]} one, through ${labelOf(shape, s.corner)}; you can't pair or withdraw that`;
};

/** §9.75 · D15 with a MODE end (the designer's 09:17): a mode never inherits and a composite is never IS, so the two ends holding one role of the shared corner are the
 *  generation-1 PASSAGE through it, read at the child's resolution — which comes to what he decides at that passage's site, never to a pair */
export const passageWords = (shape: Shape, s: MidpointSolidRefusal): string => {
  const site = siteWords(shape, s);
  return site
    ? `both hold ${s.role}, so together they are the passage from ${s.others[0]} to ${s.others[1]} through ${labelOf(shape, s.corner)}, which you decide at ${site}`
    : `both hold ${s.role}, so together they are the passage from ${s.others[0]} to ${s.others[1]} through ${labelOf(shape, s.corner)} — which no edge of this solid decides`;
};

/** the D15 sentence the mode decides: a mode end makes the two the passage; two IS ends the pairing one generation down */
export const sharedCoordinateWords = (shape: Shape, s: MidpointSolidRefusal): string => (s.modes.some((m) => m !== IS) ? passageWords(shape, s) : solidWords(shape, s));

/** a value of a word at a moment: the parent's quality at the moment's coordinate — undefined where the word is not declared there, UNKNOWN or omitted (no value) */
const valueAt = (types: Record<string, string> | undefined, key: string): string | undefined => {
  const v = types?.[key];
  return v === undefined || v === 'UNKNOWN' ? undefined : v;
};

/**
 * THE MARKS (§9.75 ADDENDUM) — the two ends' pulled-back marks as the moments' own values, under the shared parent's words (read at the parent's
 * coordinate of each end: one cast, one key) and under any two words his τ on the edge joins (read on the children, by the keys τ names). Two
 * values of one word refuse the pair; `UNKNOWN` and an omission are no value. Null where nothing conflicts, or the two are not ends sharing a parent.
 */
export function marksRefusalOf(shape: Shape, U: VertexId, V: VertexId, x: string, y: string, R: IsPredicateReaders = {}): MarksRefusal | null {
  const { options, names, tau } = readers(shape, R);
  const S = sharedParentOf(shape, U, V);
  if (!S) return null;
  const { P, Qu, Qv } = S;
  const iu = instancesFrom(shape, P, Qu, options).find((k) => k.key === x);
  const iv = instancesFrom(shape, P, Qv, options).find((k) => k.key === y);
  if (!iu || !iv) return null;
  const Pspace = columnSpaceOf(shape, P, options); // the one reader of a corner's space: a seed's cast as held, a born corner's child
  if (!Pspace) return null;
  const typesOf = (id: string): Record<string, string> | undefined => Pspace.roles.find((r) => r.id === id)?.types;
  const tx = typesOf(iu.p);
  const ty = typesOf(iv.p);
  const words: MarkConflict[] = [];
  const seen = new Set<string>();
  // the shared parent's words, in the cast's own order (its roles' declaration order, the first end's coordinate first)
  for (const k of [...Object.keys(tx ?? {}), ...Object.keys(ty ?? {})]) {
    if (k === 'mode' || seen.has(k)) continue; // `mode` is a born moment's construction, never a mark
    seen.add(k);
    const vx = valueAt(tx, k);
    const vy = valueAt(ty, k);
    if (vx === undefined || vy === undefined) continue;
    if (!valuesAgree(k, k, vx, vy)) words.push({ key: k, word: wordWordsOf(shape, P, k), joined: false, xValue: vx, yValue: vy });
  }
  // two words his τ joins on the edge between the ends: read on the children under the keys τ names (the other parents' words, translated)
  if (tau.length) {
    const cu = columnSpaceOf(shape, U, options);
    const cv = columnSpaceOf(shape, V, options);
    const tu = cu?.roles.find((r) => r.id === x)?.types;
    const tv = cv?.roles.find((r) => r.id === y)?.types;
    for (const [ku, kv] of tau) {
      const vx = valueAt(tu, ku);
      const vy = valueAt(tv, kv);
      if (vx === undefined || vy === undefined) continue;
      if (!valuesAgree(ku, kv, vx, vy)) words.push({ key: `${ku}≡${kv}`, word: `${wordWordsOf(shape, U, ku)} ≡ ${wordWordsOf(shape, V, kv)}`, joined: true, xValue: vx, yValue: vy });
    }
  }
  if (words.length === 0) return null;
  const roleName = (id: string): string => Pspace.roles.find((r) => r.id === id)?.label || names(P, id);
  return { parent: P, parentWords: labelOf(shape, P), coordinates: [roleName(iu.p), roleName(iv.p)], moments: [names(U, x), names(V, y)], words };
}

/** the designer's sentence (14:05): the two moments, the parent's word quoted, the two values through the page's value words, the two coordinates with the moments'
 *  ownership said once in the first; each further word `, and its “…” is … at … and … at …`; a τ-joined pair of words as his translation (my words, flagged) */
export function marksWords(m: MarksRefusal): string {
  const [cx, cy] = m.coordinates;
  const [mx, my] = m.moments;
  const [first, ...rest] = m.words;
  const owner = (w: MarkConflict): string => (w.joined ? `your translation “${w.word}”` : `${m.parentWords}'s “${w.word}”`);
  const head = `${mx} and ${my} can't be one moment: ${owner(first)} is ${valueWords(first.xValue)} at ${cx} (${mx}'s) and ${valueWords(first.yValue)} at ${cy} (${my}'s)`;
  return head + rest.map((w) => `, and ${w.joined ? owner(w) : `its “${w.word}”`} is ${valueWords(w.xValue)} at ${cx} and ${valueWords(w.yValue)} at ${cy}`).join('');
}

/**
 * THE ONE PREDICATE on a pointed IS pair x ↦ y between the moments of two corners U and V: D15 first (the researcher's 13:58 — `(IS, the wage fund,
 * the keep)` stays refused by D15 first), then the marks; null where the pair passes both. The sentence rides with the data.
 */
export function isPairRefusalAt(shape: Shape, U: VertexId, V: VertexId, x: string, y: string, R: IsPredicateReaders = {}): IsPairRefusal | null {
  const solid = sharedCoordinateOf(shape, U, V, x, y, R);
  if (solid) return { kind: 'solid', solid, form: sharedCoordinateWords(shape, solid) };
  const marks = marksRefusalOf(shape, U, V, x, y, R);
  if (marks) return { kind: 'marks', marks, form: marksWords(marks) };
  return null;
}

// ─── THE STONE BY COMPOSITION THROUGH SEAMS ───

/** a pairing of two corners' moments as a seam records it (the door model's `DoorTransport`, by structure) */
export interface CornerPairs {
  corners: [VertexId, VertexId];
  roles: Array<[string, string]>;
}

export interface CompositionStone {
  corner: VertexId; // the corner two of whose moments the composition makes one
  roles: [string, string]; // the two moments, as the record keys them
  words: [string, string]; // as a person reads them
}

const at = (c: VertexId, r: string): string => `${c}|${r}`;

/** the classes of (corner, moment) the record's IS steps on its seed and medial edges and the given pairs make — union-find */
function classesOf(record: Shape, pairs: CornerPairs[], options: SpaceOfOptions): Map<string, string> {
  const parent = new Map<string, string>();
  const find = (k: string): string => {
    let r = k;
    while (parent.has(r) && parent.get(r) !== r) r = parent.get(r) as string;
    let c = k;
    while (parent.has(c) && parent.get(c) !== r) { const n = parent.get(c) as string; parent.set(c, r); c = n; }
    return r;
  };
  const union = (a: string, b: string): void => {
    const ra = find(a);
    const rb = find(b);
    if (!parent.has(ra)) parent.set(ra, ra);
    if (!parent.has(rb)) parent.set(rb, rb);
    if (ra !== rb) parent.set(ra, rb);
  };
  // the record's own IS steps — the pairings in force on every seed or medial edge (D12 amended); a corner edge's coordinate map is structure, not identity (D14)
  for (const e of record.edges) {
    const [a, b] = e.vertexIds;
    if (edgeKind(record, a, b) === 'corner') continue;
    const step = transportStepOf(record, a, b, options);
    if (!step) continue;
    for (const [x, y] of step) union(at(a, x), at(b, y));
  }
  for (const p of pairs) for (const [x, y] of p.roles) union(at(p.corners[0], x), at(p.corners[1], y));
  const out = new Map<string, string>();
  for (const k of parent.keys()) out.set(k, find(k));
  return out;
}

/** two moments of one corner in one class — the first found, by the corners' order in the record */
function stoneIn(classes: Map<string, string>): { corner: VertexId; roles: [string, string] } | null {
  const seenAt = new Map<string, string>(); // `corner|class` ↦ the first moment seen there
  for (const [k, cls] of classes) {
    const bar = k.indexOf('|');
    const corner = k.slice(0, bar);
    const role = k.slice(bar + 1);
    const key = `${corner}|${cls}`;
    const first = seenAt.get(key);
    if (first !== undefined && first !== role) return { corner, roles: [first, role] };
    if (first === undefined) seenAt.set(key, role);
  }
  return null;
}

/**
 * THE STONE BY COMPOSITION (§9.76 (4)): the pairs standing on every seam of the form AFTER this act (`after`: every other seam's as they stand, this door's as
 * the act leaves them), composed with the record's own IS steps, make two moments of ONE corner one — and did not BEFORE it (`before`: every seam's as they
 * stood). Null where the composition closes lawfully, or where the record already held such a class before the act (the record's own matter, not this act's).
 */
export function compositionStoneOf(record: Shape, before: CornerPairs[], after: CornerPairs[], R: IsPredicateReaders = {}): CompositionStone | null {
  const { options, names } = readers(record, R);
  const b = stoneIn(classesOf(record, before, options));
  const a = stoneIn(classesOf(record, after, options));
  if (!a) return null;
  if (b && b.corner === a.corner && b.roles.join('|') === a.roles.join('|')) return null;
  return { corner: a.corner, roles: a.roles, words: [names(a.corner, a.roles[0]), names(a.corner, a.roles[1])] };
}

/** the stone's clause in the one refusal grammar (C-7h item 7, COPY-1 §4.3): `this pair would make F2 and F4 one, and they are two moments of A` */
export const compositionStoneWords = (shape: Shape, st: CompositionStone): string =>
  `this pair would make ${st.words[0]} and ${st.words[1]} one, and they are two moments of ${labelOf(shape, st.corner)}`;

// ═══ THE RESOLVER — `STAMP C-8`, 2026-09-23: `spaceOf(vertex)`, ONE resolver for the
// concept-space a vertex holds, RE-DERIVED at every read and stored nowhere.
// NOT_FROZEN while only components, the store and witnesses import it.
//
// Δ85 (Arman: "yes (a) is right" — he acts at every generation) · Δ86 ("no cast
// loading is only for the seed"). ADR 0028's ratified split of 09-01, restored
// over 0031 §3.5 (§120): a CORNER edge CARRIES, a MEDIAL edge COMPOSES, and
// BEYOND the shared corner a medial edge is BORN — the person's to give.
//
//   a seed vertex     → its cast — the ONLY place a cast is loaded (Δ86)
//   a midpoint M_e    → glue(spaceOf(u), spaceOf(v), J(e)) over its two parents u, v,
//                       recursively (gen 2's parents are gen 1's gluings), where J(e)
//                       is the one the EDGE's KIND fixes (1110 §1, the MARKER —
//                       measured by the researcher's space_of_resolver.py and
//                       g3_meet_vs_parent.py, run at the mothership's hand):
//     SEED edge         the person's record, possibly empty — an unmapped midpoint is
//                       then the disjoint union by the same construction, no branch;
//     CORNER edge       (a born vertex to its own parent) the CARRIED injection of the
//                       parent into its born vertex — C-8b item 1a (§122), BY
//                       CONSTRUCTION: the born end's OWN coprojection of that parent,
//                       read from its own gluing (`coprojectionOf`), never from content;
//                       no record is read, because none can exist — the coprojection is
//                       total on the parent and onto its image by what the glue IS, so
//                       the station is the born vertex's own space at every generation
//                       (measured: content parted from it at a station over a doubled
//                       vertex in 2,918 of 3,000 faces; the coprojection never);
//     MEDIAL edge       C-8b item 1b (§123.2, the researcher's gen4_compounding.py,
//                       cited): ONE PRINCIPLE, TWO SITES — the coprojections witness
//                       identity first, content decides only what they leave open. The
//                       ends' ONE shared parent's classes are ANCHORED through each end's
//                       own coprojection where CONSISTENT (neither image holds a seed the
//                       other side keeps elsewhere; one-to-one both ways), then the
//                       content MEET on what remains — each class paired with the ONE
//                       class of the other that holds what it holds of the seeds; a class
//                       spread over two, two onto one, or holding a seed the other side
//                       keeps only in an anchored class, is a CONFLICT: left out, and the
//                       pushout houses it twice — ∪ the person's BORN pairs (the record
//                       on the medial edge; extension only). No one shared parent: the
//                       content meet alone, said as `by: 'content'`.
//   THE TYPE            every role and word of every space CARRIES the seed roles and
//                       seed words it holds (`${seedVertexId}|${id}`), composed down
//                       through the injections at every level; the meet reads that
//                       CONTENT and never a name or a side prefix — the glue's keys are
//                       LOCAL (on the edge C–A the prefix `A:` marks C's roles), and a
//                       glued A-role is labelled `a≡b` in AB and `a≡c` in AC.
// ⛔ RECORD, NOT READING: a composed space stored on a vertex is a stamp that drifts
// from the acts that made it — nothing here is written anywhere. A born vertex
// holding a LOADED cast (a workspace saved before the loader's whitelist, C-8 item
// 2) is NOT read: its space is its parents' (Δ86), and the surface says so.
// THE SEAL (the researcher's named runs, quoted; the witness pins the SHAPE on its
// own generator — scripts/diagnose-the-born-room.cjs): the station on the corner
// edge A–M_AB is M_AB's own space (|M_AB| roles, 0 duplicated); ABAC on the medial
// edge with no born pair holds |M_AB| + |M_CA| − |A| roles, 0 duplicated (the record
// alone: |M_AB| + |M_CA|, A twice; matching names duplicates an A-role); the meet
// POOLS two roles of one corner at a vertex in 0 faces where the parent's identity
// alone pools in 960 of 3,000 (0031 §6 invariant 3, the stone); at gen 2 the meet is
// the shared corner's identity; the gen-3 doubling is exactly the meet's conflicting
// classes, and with every born room empty it is the ratified 09-16 set.

import type { ConceptSpace, Edge, EdgeIdentification, Face, Shape, VertexId } from '../types/geometry';
import { isMoldType } from './castLoader';
import { edgeBetween } from './faceReading';
import { glue, gluedSpace, type GluedNaming, type GluedSpace, type Midpoint } from './midpointGlue';
import { refusalOf, type Conflict } from './jRegister';
import { footTypeName } from './feet';
// C-12b — THE FEET: each foot composes the J of two edges BY THEIR KIND through C-9's ONE reader (bornFace's bornStepOf
// — a seed edge the record, a corner edge the carried coprojection, a medial edge the anchored meet ∪ the born pairs).
// bornFace imports this module; the cycle resolves at call time, never at load (nothing here is used at module scope).
import { bornStepOf } from './bornFace';

export type EdgeKind = 'seed' | 'corner' | 'medial';
/** a seed tag — `${seedVertexId}|${roleId}` or `${seedVertexId}|${word}`: what a role or word carries from the seed down through every injection */
export type SeedTag = string;

/** the identity the SOLID fixes on an edge (nothing on a seed edge): pairs in the endpoint spaces' own ids, the classes left out, and the seed corners each pair shares */
export interface Composed {
  roles: Array<[string, string]>;
  words: Array<[string, string]>;
  conflicts: string[]; // classes of the first endpoint spread over two of the other, or two onto one, or holding a seed the other side keeps only in an anchored class — left out; the pushout houses them twice
  corners: Map<string, VertexId[]>; // by `0|role` (the first endpoint's) and `1|role` (the second's): the seed corners the pair shares
  /** C-8b — HOW the identity was fixed: `carried` (a corner edge — the born end's own coprojection of its parent), `anchored` (a medial edge — the shared parent's coprojections where consistent, then the content meet on what remains), `content` (a medial edge with no one shared parent — the content meet alone, said), `none` (a seed edge) */
  by: 'carried' | 'anchored' | 'content' | 'none';
  sharedParent: VertexId | null; // a medial edge's ONE shared parent, by what made the ends — never by name
  anchoredPairs: number; // the role pairs the coprojections fixed before content decided anything
}

export interface ResolvedEdge {
  id: Edge['id'] | null; // the edge between the parents in the CURRENT shape — null when the shape holds none (then no record can be read)
  kind: EdgeKind;
  parents: [VertexId, VertexId]; // in the edge's own orientation — the record reads first ↦ second
  composed: Composed;
  born: { roles: EdgeIdentification['roles']; types: EdgeIdentification['types'] }; // the record read: a seed edge's whole record, a medial edge's born pairs; nothing on a corner edge
  refused: Conflict[] | null; // the glue's refusal of composed ∪ born — then the space is the disjoint union, said by the surface
  midpoint: Midpoint; // the amalgam the space IS (the disjoint union's when refused): its `a`/`b` are the coprojections a child keeps of its parents
  wordName: Map<string, string>; // a glued word's key → the display word it became
  glued: GluedSpace; // C-7h — the amalgam as the surface draws it (the origins beside the names), named by the resolver's rule: ONE derivation, the surface never re-glues
}

/** C-7h item 1 — a NAME is a chain of segments, one per seed role (or word) the class holds, in the order the person's acts joined them */
export interface NameSeg {
  tag: SeedTag;
  text: string; // the seed's own label for it
}

/**
 * C-12b — THE FOOT of an opposite corner X on the edge A–B (ADR 0031 §3.10; the researcher's §25 and §27; the mothership's
 * §147 MARKER): `foot_X = J_XB ∘ J_AX : A ⇀ B`, derived from the person's own pairings on the two other edges of a
 * triangular face holding A–B, each edge's J by its kind through C-9's one reader. On M_AB's points it is the relation
 * `≡_X`, IN M⁺'s signature, holds-only and three-valued in the record: FIX (a loop — [a] = [foot(a)]), MOV split into
 * DISAGREEMENT (J_AB(a) defined and ≠ foot(a)) and PROPOSAL (J_AB(a) undefined), UND (silence — no tuple). One foot per
 * triangular face holding the edge (a face of more corners names no single opposite corner); composed at every read,
 * stored nowhere, never a record entry of the edge. ⛔ A proposal is RECORD, never an offer (Δ80; §8(c)).
 */
export interface Foot {
  corner: VertexId; // the warrant X
  faceId: string;
  type: string; // the relation-type's name in M⁺'s signature — `≡_<X's label>`
  edges: [Edge | null, Edge | null]; // A–X and X–B in the shape (null when the shape holds none)
  given: [boolean, boolean]; // whether each of the two edges carries any pair — the silent line names the empty ones
  map: Map<string, string>; // foot_X on A's role ids (the parents' orientation: the first parent's roles ↦ the second's)
  fix: Array<[string, string]>; // a ↦ foot(a) agreeing with the pairing in force on A–B (a loop in M⁺)
  disagreement: Array<[string, string, string]>; // a, foot(a), the b the person paired a with (a link)
  proposal: Array<[string, string]>; // a, foot(a) — a not paired on A–B (a link)
  links: Array<[string, string]>; // the tuples on M's points: a loop [c, c] for FIX, [c_a, c_foot] for MOV — in the record's order
}

export interface Resolved {
  space: ConceptSpace;
  roleContent: Map<string, Set<SeedTag>>; // by the space's role id
  wordContent: Map<string, Set<SeedTag>>; // by the space's signature type (the display word)
  roleSegs: Map<string, NameSeg[]>; // C-7h item 1 — by role id: the segments its name is made of
  wordSegs: Map<string, NameSeg[]>; // by display word
  origin: 'seed' | 'derived';
  edge: ResolvedEdge | null; // for a derived space: its parents' edge
  feet: Foot[]; // C-12b — the born vertex's feet, in the shape's face order (none on a seed)
  loadedIgnored: boolean; // a born vertex holding a loaded cast — not read (Δ86)
}

export interface SpaceOfOptions {
  /** the store's τ drafts by edge id — a τ before the first role pair, read where the edge holds no record */
  tauDrafts?: Record<string, EdgeIdentification['types']>;
  /** C-8 item 4 — a CANDIDATE record on one edge, read in place of what the edge holds: the shape as an act would leave it, without writing it anywhere (RECORD, NOT READING — the candidate is an option to the read, never a fabricated shape) */
  candidate?: { edgeId: Edge['id']; roles: EdgeIdentification['roles']; types: EdgeIdentification['types'] };
  /** ⛔ A WITNESS'S CONTROL ONLY — `false`: the feet NOT composed (C-12b) — the space exactly as built before the stone, so a witness can show every moved number is the feet's alone */
  feet?: boolean;
  /** ⛔ A WITNESS'S CONTROL ONLY — `content`: the content meet on every born edge, the mechanism C-8b replaced (it houses a doubled class twice at a gen-4 station and splits a shared class held identically at gen 4); the app never sets it. Default `structural`: the carried coprojection on a corner edge, the anchored meet on a medial one. */
  meet?: 'structural' | 'content';
}

/** the record in force on an edge for a read: the candidate when the read carries one for this edge, else what the edge holds (τ alone from the drafts) */
export function recordOn(e: Edge | undefined, options: SpaceOfOptions): { roles: EdgeIdentification['roles']; types: EdgeIdentification['types'] } {
  if (!e) return { roles: [], types: [] };
  if (options.candidate && options.candidate.edgeId === e.id) return { roles: options.candidate.roles, types: options.candidate.types };
  const record = e.identification;
  return { roles: record ? record.roles : [], types: record ? record.types : (options.tauDrafts?.[e.id] ?? []) };
}

export const isSeedVertex = (shape: Shape, id: VertexId): boolean => shape.vertices[id]?.createdBy.operation === 'seed';

/** C-8 item 2 (Δ86) — a BORN vertex holding a LOADED cast (a workspace saved before the loader's whitelist, or the old route): the one place this fact is read, so the surface can SAY it; the resolver never reads such a cast as the vertex's space */
export const holdsLoadedCast = (shape: Shape, id: VertexId): boolean => {
  const v = shape.vertices[id];
  return Boolean(v && v.createdBy.operation !== 'seed' && v.data.cast !== undefined);
};

/** the KIND of the edge between two vertices — by what they are (seed corners; a born vertex and its own parent; two born vertices), never by name */
export function edgeKind(shape: Shape, a: VertexId, b: VertexId): EdgeKind {
  const va = shape.vertices[a];
  const vb = shape.vertices[b];
  if (!va || !vb) return 'medial';
  if (va.createdBy.operation === 'seed' && vb.createdBy.operation === 'seed') return 'seed';
  if (vb.createdBy.sourceVertexIds.includes(a) || va.createdBy.sourceVertexIds.includes(b)) return 'corner';
  return 'medial';
}

/** the generation of a vertex: 0 for a seed corner, one more than its parents' greatest otherwise — derived from what made it */
export function generationOf(shape: Shape, id: VertexId, memo: Map<VertexId, number> = new Map()): number {
  const known = memo.get(id);
  if (known !== undefined) return known;
  memo.set(id, 0);
  const v = shape.vertices[id];
  const g = !v || v.createdBy.operation === 'seed' || v.createdBy.sourceVertexIds.length === 0 ? 0 : 1 + Math.max(...v.createdBy.sourceVertexIds.map((p) => generationOf(shape, p, memo)));
  memo.set(id, g);
  return g;
}

const tagOf = (vertexId: VertexId, id: string): SeedTag => `${vertexId}|${id}`;
/** the seed corner a tag names */
export const cornerOfTag = (t: SeedTag): VertexId => t.slice(0, t.indexOf('|'));
/** the seed's own role or word a tag names — its label at the corner (a seed cast's id IS its address) */
export const seedOfTag = (t: SeedTag): string => t.slice(t.indexOf('|') + 1);

function seedResolved(vertexId: VertexId, cast: ConceptSpace): Resolved {
  return {
    space: cast,
    roleContent: new Map(cast.roles.map((r) => [r.id, new Set([tagOf(vertexId, r.id)])])),
    wordContent: new Map(cast.signature.map((s) => [s.type, new Set([tagOf(vertexId, s.type)])])),
    roleSegs: new Map(cast.roles.map((r) => [r.id, [{ tag: tagOf(vertexId, r.id), text: r.label && r.label.length ? r.label : r.id }]])),
    wordSegs: new Map(cast.signature.map((s) => [s.type, [{ tag: tagOf(vertexId, s.type), text: s.type }]])),
    origin: 'seed',
    edge: null,
    feet: [],
    loadedIgnored: false,
  };
}

// ─── C-12b — THE FEET ───────────────────────────────────────────────────────────────────────────────────────────────────
/** the triangular faces of the shape holding both parents — one foot each, ONE PER DISTINCT TRIANGLE BY VERTEX SET (a triangle
 * held by two cells — a residue's face and the dissected cell's own marker of it — counts once, ADR 0031 §3.10); the opposite
 * corner is the third */
function facesHolding(shape: Shape, p: VertexId, q: VertexId): Face[] {
  const seen = new Set<string>();
  const out: Face[] = [];
  for (const f of shape.faces) {
    if (f.vertexIds.length !== 3 || !f.vertexIds.includes(p) || !f.vertexIds.includes(q)) continue;
    const key = [...f.vertexIds].sort().join('\u0000');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(f);
  }
  return out;
}

/** the feet of the born vertex on the edge (p, q), read on M (the amalgam as built): each foot's map through C-9's reader, its
 * three states against the pairing in force (the class holding both an A-role and a B-role), and its links on M's points */
function feetOf(shape: Shape, parents: [VertexId, VertexId], M: Midpoint, options: SpaceOfOptions, memo: Map<VertexId, Resolved | null>): Foot[] {
  const [p, q] = parents;
  const classOfA = new Map<string, string>();
  const classOfB = new Map<string, string>();
  const pairedB = new Map<string, string>(); // the pairing in force on A–B: a ↦ the b in its class
  for (const r of M.roles) {
    if (r.a !== null) classOfA.set(r.a, r.key);
    if (r.b !== null) classOfB.set(r.b, r.key);
    if (r.a !== null && r.b !== null) pairedB.set(r.a, r.b);
  }
  const feet: Foot[] = [];
  for (const face of facesHolding(shape, p, q)) {
    const X = face.vertexIds.find((v) => v !== p && v !== q) as VertexId;
    const s1 = bornStepOf(shape, p, X, options, memo);
    const s2 = bornStepOf(shape, X, q, options, memo);
    const map = new Map<string, string>();
    if (s1 && s2) for (const [a, x] of s1.map) { const b = s2.map.get(x); if (b !== undefined) map.set(a, b); }
    const fix: Array<[string, string]> = [];
    const disagreement: Array<[string, string, string]> = [];
    const proposal: Array<[string, string]> = [];
    const links: Array<[string, string]> = [];
    for (const [a, b] of map) {
      const ca = classOfA.get(a);
      const cb = classOfB.get(b);
      if (ca === undefined || cb === undefined) continue; // a role the amalgam does not house — nothing to mark
      const paired = pairedB.get(a);
      if (paired === undefined) { proposal.push([a, b]); links.push([ca, cb]); }
      else if (ca === cb) { fix.push([a, b]); links.push([ca, ca]); }
      else { disagreement.push([a, b, paired]); links.push([ca, cb]); }
    }
    feet.push({
      corner: X,
      faceId: face.id,
      type: footTypeName(shape.vertices[X]?.data.label || X),
      edges: [edgeBetween(shape.edges, p, X) ?? null, edgeBetween(shape.edges, X, q) ?? null],
      given: [Boolean(s1 && s1.map.size > 0), Boolean(s2 && s2.map.size > 0)],
      map,
      fix,
      disagreement,
      proposal,
      links,
    });
  }
  return feet;
}

/** M⁺ = M plus one relation-type per foot and its links, holds-only; the points untouched, J_AB untouched */
function withFeet(space: ConceptSpace, feet: Foot[]): ConceptSpace {
  if (feet.length === 0) return space;
  return {
    ...space,
    signature: [...space.signature, ...feet.map((f) => ({ type: f.type, arity: 2 }))],
    relations: [...space.relations, ...feet.flatMap((f) => f.links.map(([u, v]) => ({ type: f.type, terms: [u, v], polarity: 'holds' as const })))],
  };
}

/**
 * §149 (C-12c) — ONE COUNT EVERYWHERE, THE SPACE'S: the three sizes every card, head and line prints of a concept-space.
 * A born space is M⁺ — the amalgam plus its feet (ruling (a): the feet ARE in the signature) — so the count is taken on the
 * resolved space itself, never on the glue's amalgam; the surface says beside it what the feet contribute (`feetShareOf`).
 */
export interface SpaceCounts { roles: number; words: number; tuples: number }
export const spaceCounts = (space: ConceptSpace): SpaceCounts => ({ roles: space.roles.length, words: space.signature.length, tuples: space.relations.length });

/** the feet's share of those counts — one word (its relation-type) per foot, one tuple per point a foot reads; exactly what `withFeet` added */
export const feetShareOf = (feet: Foot[]): { words: number; tuples: number } => ({ words: feet.length, tuples: feet.reduce((n, f) => n + f.links.length, 0) });

/**
 * THE MEET — pairs by SHARED SEED CONTENT: a class of U with the ONE class of V holding what U's class holds of V's
 * seeds; a class of U spread over two of V, or two of U onto one of V, is a CONFLICT and is left out (the pushout then
 * houses it twice — the lawful gen-3 doubling, never below).
 */
function meetOf(U: Map<string, Set<SeedTag>>, V: Map<string, Set<SeedTag>>): { pairs: Array<[string, string]>; conflicts: string[] } {
  const where = new Map<SeedTag, Set<string>>();
  for (const [id, tags] of V) for (const t of tags) (where.get(t) ?? where.set(t, new Set()).get(t)!).add(id);
  const image = new Map<string, string>();
  const conflicts = new Set<string>();
  for (const [id, tags] of U) {
    const targets = new Set<string>();
    for (const t of tags) for (const w of where.get(t) ?? []) targets.add(w);
    if (targets.size === 1) image.set(id, [...targets][0]);
    else if (targets.size > 1) conflicts.add(id);
  }
  const back = new Map<string, string[]>();
  for (const [a, b] of image) (back.get(b) ?? back.set(b, []).get(b)!).push(a);
  for (const sources of back.values()) if (sources.length > 1) for (const s of sources) conflicts.add(s);
  return { pairs: [...image].filter(([a]) => !conflicts.has(a)), conflicts: [...conflicts] };
}

/** the seed corners each pair shares — what `composed · corner A` names on the point */
function cornersOf(U: Resolved, V: Resolved, pairs: Array<[string, string]>): Map<string, VertexId[]> {
  const corners = new Map<string, VertexId[]>();
  for (const [a, b] of pairs) {
    const shared = [...(U.roleContent.get(a) ?? [])].filter((t) => V.roleContent.get(b)?.has(t)).map(cornerOfTag);
    const list = [...new Set(shared)];
    corners.set(`0|${a}`, list);
    corners.set(`1|${b}`, list);
  }
  return corners;
}

const nonMold = (m: Map<string, Set<SeedTag>>): Map<string, Set<SeedTag>> => new Map([...m].filter(([k]) => !isMoldType(k)));

/**
 * THE CONTENT MEET alone — on roles and on the casters' words (the mold's own types are one by definition already, ruled
 * by the register). C-8b: the mechanism a corner edge and a medial edge used before the coprojections; kept as the
 * witnesses' CONTROL (`options.meet = 'content'`) and as what a medial edge falls back to when it has no one shared parent.
 */
export function contentMeet(U: Resolved, V: Resolved): Composed {
  const r = meetOf(U.roleContent, V.roleContent);
  const w = meetOf(nonMold(U.wordContent), nonMold(V.wordContent));
  return { roles: r.pairs, words: w.pairs, conflicts: r.conflicts, corners: cornersOf(U, V, r.pairs), by: 'content', sharedParent: null, anchoredPairs: 0 };
}

/**
 * C-8b item 1a — a born end's OWN COPROJECTION of one parent: which role and word of the parent became which of the born
 * end, taken from the born vertex's own gluing (the glue's `a`/`b` beside each key) — STRUCTURAL, never content. Null
 * when the vertex is not that parent's child.
 */
export function coprojectionOf(child: Resolved, parentId: VertexId): { roles: Array<[string, string]>; words: Array<[string, string]> } | null {
  const e = child.edge;
  if (!e) return null;
  const side: 'a' | 'b' | null = e.parents[0] === parentId ? 'a' : e.parents[1] === parentId ? 'b' : null;
  if (side === null) return null;
  const roles = e.midpoint.roles.filter((r) => r[side] !== null).map((r) => [r[side] as string, r.key] as [string, string]);
  const words = e.midpoint.words.filter((w) => w[side] !== null).map((w) => [w[side] as string, e.wordName.get(w.key) ?? w.key] as [string, string]);
  return { roles, words };
}

/**
 * C-8b item 1a — THE CARRY BY CONSTRUCTION: on a CORNER edge (a born vertex to its own parent) the J IS the born end's own
 * coprojection of that parent, in the edge's own orientation (a corner edge may be walked either way); no content is read
 * — content cannot tell a doubled seed's two homes apart (measured: a gen-4 station over a doubled vertex housed the
 * parent's doubled class again in 2,918 of 3,000 faces under the content meet; over the coprojection, never).
 */
function carriedOn(U: Resolved, V: Resolved, parents: [VertexId, VertexId]): Composed {
  const vChild = V.edge !== null && V.edge.parents.includes(parents[0]);
  const uChild = !vChild && U.edge !== null && U.edge.parents.includes(parents[1]);
  let roles: Array<[string, string]> = [];
  let words: Array<[string, string]> = [];
  if (vChild) {
    const c = coprojectionOf(V, parents[0]);
    if (c) { roles = c.roles; words = c.words; }
  } else if (uChild) {
    const c = coprojectionOf(U, parents[1]);
    if (c) { roles = c.roles.map(([p, k]) => [k, p] as [string, string]); words = c.words.map(([p, k]) => [k, p] as [string, string]); }
  }
  return { roles, words, conflicts: [], corners: cornersOf(U, V, roles), by: 'carried', sharedParent: vChild ? parents[0] : uChild ? parents[1] : null, anchoredPairs: roles.length };
}

/** the content meet on the classes not already anchored (the researcher's `remaining_content_meet`, gen4_compounding.py:24–37): a class holding a seed the other side keeps ONLY in an anchored class is a conflict, housed twice */
function remainingMeet(Uc: Map<string, Set<SeedTag>>, Vc: Map<string, Set<SeedTag>>, skipU: Set<string>, skipV: Set<string>): { pairs: Array<[string, string]>; conflicts: string[] } {
  const where = new Map<SeedTag, Set<string>>();
  for (const [id, tags] of Vc) { if (skipV.has(id)) continue; for (const t of tags) (where.get(t) ?? where.set(t, new Set()).get(t)!).add(id); }
  const Vall = new Set<SeedTag>();
  for (const tags of Vc.values()) for (const t of tags) Vall.add(t);
  const image = new Map<string, string>();
  const conflicts = new Set<string>();
  for (const [id, tags] of Uc) {
    if (skipU.has(id)) continue;
    const targets = new Set<string>();
    for (const t of tags) for (const w of where.get(t) ?? []) targets.add(w);
    const heldElsewhere = [...tags].some((s) => Vall.has(s) && !where.has(s));
    if (targets.size === 1 && !heldElsewhere) image.set(id, [...targets][0]);
    else if (targets.size > 0 || heldElsewhere) conflicts.add(id);
  }
  const back = new Map<string, string[]>();
  for (const [a, b] of image) (back.get(b) ?? back.set(b, []).get(b)!).push(a);
  for (const sources of back.values()) if (sources.length > 1) for (const s of sources) conflicts.add(s);
  return { pairs: [...image].filter(([a]) => !conflicts.has(a)), conflicts: [...conflicts] };
}

/** the anchor (the researcher's `anchored_meet`, gen4_compounding.py:39–51): the shared parent's two images paired where CONSISTENT — neither holds a seed the other side keeps elsewhere — and one-to-one both ways; then the content meet on what remains */
function anchoredPairs(Uc: Map<string, Set<SeedTag>>, Vc: Map<string, Set<SeedTag>>, intoU: Array<[string, string]>, intoV: Array<[string, string]>): { pairs: Array<[string, string]>; conflicts: string[]; anchored: number } {
  const toV = new Map(intoV);
  const anchor = new Map<string, Set<string>>();
  for (const [w, u] of intoU) { const v = toV.get(w); if (v === undefined) continue; (anchor.get(u) ?? anchor.set(u, new Set()).get(u)!).add(v); }
  const all = (m: Map<string, Set<SeedTag>>): Set<SeedTag> => { const s = new Set<SeedTag>(); for (const tags of m.values()) for (const t of tags) s.add(t); return s; };
  const Uall = all(Uc); const Vall = all(Vc);
  const back = new Map<string, string[]>();
  for (const [u, vs] of anchor) {
    if (vs.size !== 1) continue;
    const v = [...vs][0];
    const cu = Uc.get(u) ?? new Set<SeedTag>(); const cv = Vc.get(v) ?? new Set<SeedTag>();
    const consistent = [...cu].every((s) => !Vall.has(s) || cv.has(s)) && [...cv].every((s) => !Uall.has(s) || cu.has(s));
    if (consistent) (back.get(v) ?? back.set(v, []).get(v)!).push(u);
  }
  const pairs: Array<[string, string]> = [];
  for (const [v, us] of back) if (us.length === 1) pairs.push([us[0], v]);
  const rest = remainingMeet(Uc, Vc, new Set(pairs.map(([u]) => u)), new Set(pairs.map(([, v]) => v)));
  return { pairs: [...pairs, ...rest.pairs], conflicts: rest.conflicts, anchored: pairs.length };
}

/**
 * C-8b item 1b — THE ANCHORED MEET on a MEDIAL edge (§123.2, the researcher's gen4_compounding.py, cited not re-derived):
 * ONE PRINCIPLE, TWO SITES — the coprojections witness identity first; content decides only what they leave open. W = the
 * ends' one shared parent (by what made them); for each class of W its two images through each end's own coprojection
 * are anchored where consistent; then the content meet on what remains. Roles and words by the one principle. No one
 * shared parent (none, or two) → the content meet alone, said as `by: 'content'`.
 */
function anchoredOn(shape: Shape, U: Resolved, V: Resolved, parents: [VertexId, VertexId]): Composed {
  const pu = shape.vertices[parents[0]]?.createdBy.sourceVertexIds ?? [];
  const pv = shape.vertices[parents[1]]?.createdBy.sourceVertexIds ?? [];
  const shared = pu.filter((p) => pv.includes(p));
  if (shared.length !== 1) return contentMeet(U, V);
  const W = shared[0];
  const cu = coprojectionOf(U, W);
  const cv = coprojectionOf(V, W);
  if (!cu || !cv) return contentMeet(U, V);
  const r = anchoredPairs(U.roleContent, V.roleContent, cu.roles, cv.roles);
  const w = anchoredPairs(nonMold(U.wordContent), nonMold(V.wordContent), cu.words, cv.words);
  return { roles: r.pairs, words: w.pairs, conflicts: r.conflicts, corners: cornersOf(U, V, r.pairs), by: 'anchored', sharedParent: W, anchoredPairs: r.anchored };
}

/** the identity the SOLID fixes on an edge, by its KIND: nothing on a seed edge; the carry on a corner edge; the anchored meet on a medial edge (`meet: 'content'` — the witnesses' control — the content meet on either) */
export function composedOn(shape: Shape, U: Resolved, V: Resolved, parents: [VertexId, VertexId], kind: EdgeKind, meet: 'structural' | 'content' = 'structural'): Composed {
  if (kind === 'seed') return emptyComposed();
  if (meet === 'content') return contentMeet(U, V);
  return kind === 'corner' ? carriedOn(U, V, parents) : anchoredOn(shape, U, V, parents);
}

const emptyComposed = (): Composed => ({ roles: [], words: [], conflicts: [], corners: new Map(), by: 'none', sharedParent: null, anchoredPairs: 0 });

/**
 * C-7h item 1 (the designer's live drive, ratified §125.1) — `≡` IS THE PERSON'S ACT AND ONLY THAT, one rule for roles, words
 * and chains. A name is a chain of SEGMENTS (one per seed role or word the class holds, in the order the person's acts joined
 * them), displayed joined by `≡`. (1) A pair the SOLID composed shares a seed: its two chains MERGE on that seed — printed
 * once, never `F1 ≡ F1`, never `≡` across a composed word. (2) A pair the PERSON made joins two chains; two segments of one
 * spelling under different seeds carry their CORNERS in brackets (`sustains [C] ≡ sustains [A] ≡ descends-from [B]` — the
 * chain wears its corners when a spelling repeats within it; a lone name wears one when another LONE name in the space is
 * spelled alike under another seed, `disjoins [A]` — the glue's alike rule, the corner in place of the side). A doubled seed (two classes holding it —
 * the lawful gen-3 doubling) is told apart by the parent it came through. The rule is a predicate on the RECORD (which pairs
 * were the person's — `Composed` against `born`), never on spelling. The mold's own types are one by definition: plain.
 */
function namingOf(shape: Shape, U: Resolved, V: Resolved, parents: [VertexId, VertexId], M: Midpoint, composed: Composed): { naming: GluedNaming; roleSegs: Map<string, NameSeg[]>; wordSegs: Map<string, NameSeg[]> } {
  const merge = (sa: NameSeg[], sb: NameSeg[]): NameSeg[] => [...sa, ...sb.filter((s) => !sa.some((t) => t.tag === s.tag))];
  const cr = new Set(composed.roles.map(([a, b]) => `${a}\u0000${b}`));
  const cw = new Set(composed.words.map(([a, b]) => `${a}\u0000${b}`));
  const segsOf = (a: string | null, b: string | null, SA: Map<string, NameSeg[]>, SB: Map<string, NameSeg[]>, cset: Set<string>): NameSeg[] => {
    const sa = a !== null ? SA.get(a) ?? [] : [];
    const sb = b !== null ? SB.get(b) ?? [] : [];
    return a !== null && b !== null ? (cset.has(`${a}\u0000${b}`) ? merge(sa, sb) : [...sa, ...sb]) : a !== null ? sa : sb;
  };
  const roleSegs = new Map(M.roles.map((r) => [r.key, segsOf(r.a, r.b, U.roleSegs, V.roleSegs, cr)] as [string, NameSeg[]]));
  const wordSegs = new Map(M.words.map((w) => [w.key, segsOf(w.a, w.b, U.wordSegs, V.wordSegs, cw)] as [string, NameSeg[]]));
  const cornerLabel = (tag: SeedTag): string => { const id = cornerOfTag(tag); return shape.vertices[id]?.data.label || id; };
  const parentLabel = (side: 0 | 1): string => shape.vertices[parents[side]]?.data.label || parents[side];
  const displays = (segsByKey: Map<string, NameSeg[]>, sideOf: (key: string) => 0 | 1, isWord: boolean): Map<string, string> => {
    // a LONE name wears its corner when ANY other name in the space — lone, or a segment of a chain — is spelled alike
    // under another seed (the glue's alike rule, the corner in place of the side; C-12a item 6: `presupposes [B]` beside
    // `presupposes ≡ specifies`, which holds A's presupposes — the ≡ rule's bracket, §125.1; a lone-against-lone rule left
    // the two untold apart); a CHAIN wears its corners when a spelling repeats WITHIN it (her rule 2)
    const spelled = new Map<string, Set<SeedTag>>();
    for (const segs of segsByKey.values()) for (const s of segs) (spelled.get(s.text) ?? spelled.set(s.text, new Set()).get(s.text)!).add(s.tag);
    const bracketed = (segs: NameSeg[]): boolean => (segs.length > 1 ? new Set(segs.map((s) => s.text)).size < segs.length : (spelled.get(segs[0].text)?.size ?? 0) > 1);
    const out = new Map<string, string>();
    for (const [key, segs] of segsByKey) {
      if (segs.length === 0) continue; // nothing to name: the glue's own default stands
      if (isWord && segs.every((s) => isMoldType(s.text))) { out.set(key, segs[0].text); continue; }
      const bracket = bracketed(segs);
      out.set(key, segs.map((s) => (bracket ? `${s.text} [${cornerLabel(s.tag)}]` : s.text)).join(' ≡ '));
    }
    // the doubling: one display for two classes — each names the parent it came through, then its key as the last resort
    const byDisplay = new Map<string, string[]>();
    for (const [key, d] of out) (byDisplay.get(d) ?? byDisplay.set(d, []).get(d)!).push(key);
    for (const keys of byDisplay.values()) if (keys.length > 1) for (const key of keys) out.set(key, `${out.get(key)} (through ${parentLabel(sideOf(key))})`);
    const again = new Map<string, number>();
    for (const d of out.values()) again.set(d, (again.get(d) ?? 0) + 1);
    for (const [key, d] of out) if ((again.get(d) ?? 0) > 1) out.set(key, `${d} · ${key}`);
    return out;
  };
  const roleSide = new Map(M.roles.map((r) => [r.key, r.a !== null ? 0 : 1] as [string, 0 | 1]));
  const wordSide = new Map(M.words.map((w) => [w.key, w.a !== null ? 0 : 1] as [string, 0 | 1]));
  const roleDisplay = displays(roleSegs, (k) => roleSide.get(k) ?? 0, false);
  const wordDisplay = displays(wordSegs, (k) => wordSide.get(k) ?? 0, true);
  return { naming: { role: (r) => roleDisplay.get(r.key), word: (w) => wordDisplay.get(w.key) }, roleSegs, wordSegs };
}

/**
 * THE RESOLVER. A seed vertex holds its cast; a midpoint holds the gluing of its parents' spaces over the J its edge's
 * kind fixes ∪ the record that edge lawfully carries. `memo` is one read's own cache — nothing survives the call.
 */
export function spaceOf(shape: Shape, vertexId: VertexId, options: SpaceOfOptions = {}, memo: Map<VertexId, Resolved | null> = new Map()): Resolved | null {
  if (memo.has(vertexId)) return memo.get(vertexId) ?? null;
  memo.set(vertexId, null); // a vertex under resolution resolves to nothing — no cycle can feed itself
  const v = shape.vertices[vertexId];
  if (!v) return null;
  let out: Resolved | null = null;
  if (v.createdBy.operation === 'seed') {
    out = v.data.cast ? seedResolved(vertexId, v.data.cast) : null;
  } else if (v.createdBy.sourceVertexIds.length === 2) {
    const [p, q] = v.createdBy.sourceVertexIds;
    const e = edgeBetween(shape.edges, p, q);
    const parents: [VertexId, VertexId] = e ? [e.vertexIds[0], e.vertexIds[1]] : [p, q];
    const U = spaceOf(shape, parents[0], options, memo);
    const V = spaceOf(shape, parents[1], options, memo);
    if (U && V) {
      const kind = edgeKind(shape, parents[0], parents[1]);
      const composed = composedOn(shape, U, V, parents, kind, options.meet);
      const born = kind === 'corner' ? { roles: [], types: [] } : recordOn(e, options);
      let result = glue(U.space, V.space, [...composed.roles, ...born.roles], [...composed.words, ...born.types]);
      let refused: Conflict[] | null = null;
      if (result.refused) {
        refused = result.conflicts;
        result = glue(U.space, V.space, [], []); // the disjoint union never refuses: nothing shared, nothing to contradict
      }
      if (!result.refused) {
        // C-7h item 1 — the names by the resolver's rule (the record decides which `≡` is the person's), given to the glue
        const named = namingOf(shape, U, V, parents, result.midpoint, composed);
        const g = gluedSpace(U.space, V.space, result.midpoint, named.naming);
        const wordSegs = new Map<string, NameSeg[]>();
        for (const w of result.midpoint.words) wordSegs.set(g.wordName.get(w.key) ?? w.key, named.wordSegs.get(w.key) ?? []);
        const roleContent = new Map<string, Set<SeedTag>>();
        for (const r of result.midpoint.roles) roleContent.set(r.key, new Set([...(r.a !== null ? U.roleContent.get(r.a) ?? [] : []), ...(r.b !== null ? V.roleContent.get(r.b) ?? [] : [])]));
        const wordContent = new Map<string, Set<SeedTag>>();
        for (const w of result.midpoint.words) wordContent.set(g.wordName.get(w.key) ?? w.key, new Set([...(w.a !== null ? U.wordContent.get(w.a) ?? [] : []), ...(w.b !== null ? V.wordContent.get(w.b) ?? [] : [])]));
        // C-12b — THE FEET composed into the born vertex's space: M⁺ = M plus `≡_X` per opposite corner (holds-only). The
        // amalgam the surface DRAWS (`glued`) stays M — the foot is WORDS under the own column, never a glyph; the SPACE the
        // lift, the door and the next pushout read is M⁺. A foot's word content and name segments are its own (a foreign word
        // at the next generation, never shared by spelling — Δ80).
        const feet = options.feet === false ? [] : feetOf(shape, parents, result.midpoint, options, memo);
        for (const f of feet) {
          wordContent.set(f.type, new Set([tagOf(vertexId, f.type)]));
          wordSegs.set(f.type, [{ tag: tagOf(vertexId, f.type), text: f.type }]);
        }
        out = {
          space: withFeet(g.space, feet),
          roleContent,
          wordContent,
          roleSegs: named.roleSegs,
          wordSegs,
          origin: 'derived',
          edge: { id: e ? e.id : null, kind, parents, composed, born, refused, midpoint: result.midpoint, wordName: g.wordName, glued: g },
          feet,
          loadedIgnored: v.data.cast !== undefined,
        };
      }
    }
  }
  memo.set(vertexId, out);
  return out;
}

/** a seed role or word appearing in two or more roles / words of a space — lawful only as the gen-3 doubling, never below */
export function duplicatedSeeds(R: Resolved): { roles: number; words: number } {
  const count = (m: Map<string, Set<SeedTag>>): number => {
    const seen = new Map<SeedTag, number>();
    for (const tags of m.values()) for (const t of tags) seen.set(t, (seen.get(t) ?? 0) + 1);
    return [...seen.values()].filter((n) => n > 1).length;
  };
  return { roles: count(R.roleContent), words: count(R.wordContent) };
}

/** a role holding two seed roles of ONE corner — a corner coarsened at a vertex (0031 §6 invariant 3): the count of such roles */
export function pooledRoles(R: Resolved): number {
  let n = 0;
  for (const tags of R.roleContent.values()) {
    const perCorner = new Map<VertexId, number>();
    for (const t of tags) perCorner.set(cornerOfTag(t), (perCorner.get(cornerOfTag(t)) ?? 0) + 1);
    if ([...perCorner.values()].some((k) => k > 1)) n += 1;
  }
  return n;
}

/**
 * C-8c — THE STONE AT THE ACT (0031 §6 invariant 3, ratified §123.3: "every vertex-to-edge map injective — a vertex whose
 * space pools two roles of one corner has become the op-set"): the two seed roles (or words) of ONE corner a pair would
 * make one. The class the site would hold for the pair is EXACTLY x's content ∪ y's content (every identification on the
 * edge is one-to-one by the checks made before this one), so the stone is read on the two ends — and it holds where the
 * site is not yet minted (a seam acted on before its dissection). Null when the pair pools NOTHING: a pair of disjoint
 * content joins two corners' own roles, and a pair sharing a seed that holds no two seeds of one corner between its two
 * classes dissolves a doubling (lawful). A pair that shares a seed AND holds two other seeds of one corner is refused like
 * any other — the test is every cross pair of DIFFERENT seeds of one corner; the shared seed is the null case only (the
 * researcher's read, 1615 §2; C-7h item 12).
 */
export interface Stone {
  corner: VertexId;
  kind: 'role' | 'word';
  seeds: [string, string]; // the two seed roles (or words) by their own labels at the corner
}
export function stoneOn(U: Resolved, V: Resolved, x: string, y: string, kind: 'role' | 'word'): Stone | null {
  const cu = (kind === 'role' ? U.roleContent : U.wordContent).get(x) ?? new Set<SeedTag>();
  const cv = (kind === 'role' ? V.roleContent : V.wordContent).get(y) ?? new Set<SeedTag>();
  for (const t of cu) for (const s of cv) if (t !== s && cornerOfTag(t) === cornerOfTag(s)) return { corner: cornerOfTag(t), kind, seeds: [seedOfTag(t), seedOfTag(s)] };
  return null;
}
/** C-7h item 7 (the designer, §125.1) — the stone's CLAUSE, `c1 and c3 one: two roles of corner C, which the corner keeps apart`: the act's sentence puts the pair before it (`Φ2 ↦ r1 would make …`), the dependency reading says `would then make …` */
export const stoneClause = (shape: Shape, st: Stone): string => `${st.seeds[0]} and ${st.seeds[1]} one: two ${st.kind === 'role' ? 'roles' : 'words'} of corner ${shape.vertices[st.corner]?.data.label || st.corner}, which the corner keeps apart`;
/** the stone at the act, in the one refusal grammar (the head `not taken —` is the box's): `Φ2 ↦ r1 would make c1 and c3 one: …` */
export const stoneWords = (shape: Shape, st: Stone, pairText: string): string => `${pairText} would make ${stoneClause(shape, st)}`;

/** a born act that a candidate shape BREAKS — read again under the shape as it would be (C-8 item 4, the dependency refusal) */
export interface BrokenBornAct {
  edgeId: Edge['id']; // the medial edge holding the born act
  siteId: VertexId | null; // the midpoint minted on that edge, when the shape holds it
  kind: 'role' | 'word';
  pair: [string, string]; // as the record holds it — the endpoint spaces' own ids
  names: [string, string]; // as a person reads it — the spaces' labels (a glued space's id is a local key, never shown)
  why: string; // C-7h item 8 (the designer): the COLLISION as a clause after `your pair at <site>, <generation>,` — `needs Φ3 as its own role` · `needs c2 as its own — under this act it would be the solid's, composed` (item 9: never a thing one with itself) · `would then make c1 and c3 one: …` · `would then contradict itself: …`
}

/** a role's name as a person reads it — the space's label for it, else the id (a seed cast's id IS its address) */
export const nameIn = (space: ConceptSpace, id: string): string => space.roles.find((r) => r.id === id)?.label || id;
/** the name even when the space no longer holds the role (a born act named it before a later act re-glued it): its raw name, the glue's local side prefix stripped */
const shownName = (space: ConceptSpace, id: string): string => space.roles.find((r) => r.id === id)?.label || id.replace(/^[AB]:/, '');

/**
 * C-8 item 4 — every born act read again under `shape` (the shape as a candidate act would leave it): a born pair whose
 * role or word no longer exists in its endpoint's space, or that now collides with the composed identity, or that would
 * now POOL two seed roles of one corner (C-8c — the stone, the third reason), or that contradicts under it, is BROKEN —
 * the later act that made the shape so is refused, naming the born act it would break.
 */
export function brokenBornActs(shape: Shape, options: SpaceOfOptions = {}, except: Edge['id'] | null = null): BrokenBornAct[] {
  const memo = new Map<VertexId, Resolved | null>();
  const out: BrokenBornAct[] = [];
  for (const e of shape.edges) {
    if (e.id === except) continue;
    const born = recordOn(e, options);
    if (born.roles.length === 0 && born.types.length === 0) continue;
    if (edgeKind(shape, e.vertexIds[0], e.vertexIds[1]) !== 'medial') continue;
    const siteId = Object.values(shape.vertices).find((v) => v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(e.vertexIds[0]) && v.createdBy.sourceVertexIds.includes(e.vertexIds[1]))?.id ?? null;
    const U = spaceOf(shape, e.vertexIds[0], options, memo);
    const V = spaceOf(shape, e.vertexIds[1], options, memo);
    const name = (pair: [string, string], kind: 'role' | 'word', why: string): void => {
      const names: [string, string] = kind === 'role' && U && V ? [shownName(U.space, pair[0]), shownName(V.space, pair[1])] : [pair[0], pair[1]];
      out.push({ edgeId: e.id, siteId, kind, pair, names, why });
    };
    if (!U || !V) {
      for (const pair of born.roles) name(pair, 'role', 'needs a space at both of its ends — this act leaves none');
      for (const pair of born.types) name(pair, 'word', 'needs a space at both of its ends — this act leaves none');
      continue;
    }
    const composed = composedOn(shape, U, V, e.vertexIds, 'medial', options.meet);
    // C-7h item 9 (the designer): a role reached by two parents is ONE role — never "one with itself"; say it would become the solid's
    const oneWith = (p: string, q: string, kind: 'role' | 'word'): string =>
      p === q ? `needs ${p} as its own ${kind} — under this act it would be the solid's, composed` : `needs ${p} apart from ${q} — under this act the solid would make them one, composed`;
    const dom = new Map(composed.roles);
    const im = new Map(composed.roles.map(([a, b]) => [b, a] as [string, string]));
    for (const [x, y] of born.roles) {
      if (!U.space.roles.some((r) => r.id === x)) name([x, y], 'role', `needs ${shownName(U.space, x)} as its own role`);
      else if (!V.space.roles.some((r) => r.id === y)) name([x, y], 'role', `needs ${shownName(V.space, y)} as its own role`);
      else if (dom.has(x)) name([x, y], 'role', oneWith(nameIn(U.space, x), nameIn(V.space, dom.get(x) as string), 'role'));
      else if (im.has(y)) name([x, y], 'role', oneWith(nameIn(V.space, y), nameIn(U.space, im.get(y) as string), 'role'));
      else {
        const st = stoneOn(U, V, x, y, 'role');
        if (st) name([x, y], 'role', `would then make ${stoneClause(shape, st)}`);
      }
    }
    const wdom = new Map(composed.words);
    const wim = new Map(composed.words.map(([a, b]) => [b, a] as [string, string]));
    for (const [s, t] of born.types) {
      if (!U.space.signature.some((w) => w.type === s)) name([s, t], 'word', `needs ${s} as its own word`);
      else if (!V.space.signature.some((w) => w.type === t)) name([s, t], 'word', `needs ${t} as its own word`);
      else if (wdom.has(s)) name([s, t], 'word', oneWith(s, wdom.get(s) as string, 'word'));
      else if (wim.has(t)) name([s, t], 'word', oneWith(t, wim.get(t) as string, 'word'));
      else {
        const st = stoneOn(U, V, s, t, 'word');
        if (st) name([s, t], 'word', `would then make ${stoneClause(shape, st)}`);
      }
    }
    if (!out.some((b) => b.edgeId === e.id)) {
      const conflicts = refusalOf(U.space, V.space, [...composed.roles, ...born.roles], [...composed.words, ...born.types]);
      if (conflicts.length && born.roles.length) name(born.roles[0], 'role', `would then contradict itself: ${conflicts[0].type}(${conflicts[0].xTerms.join(', ')}) ${conflicts[0].xValue} against ${conflicts[0].yType}(${conflicts[0].yTerms.join(', ')}) ${conflicts[0].yValue}`);
    }
  }
  return out;
}

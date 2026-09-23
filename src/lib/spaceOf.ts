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
//                       parent into its born vertex — derived; no record is read,
//                       because none can exist (a corner edge has no free slot: the
//                       injection is total on the parent and onto its image);
//     MEDIAL edge       the MEET of the identities on EVERYTHING both endpoints hold —
//                       each class of one endpoint paired with the ONE class of the
//                       other that holds what it holds of the seeds; a class spread
//                       over two, or two onto one, is a CONFLICT: left out, and the
//                       pushout houses it twice — ∪ the person's BORN pairs (the
//                       record on the medial edge; extension only).
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

import type { ConceptSpace, Edge, EdgeIdentification, Shape, VertexId } from '../types/geometry';
import { isMoldType } from './castLoader';
import { edgeBetween } from './faceReading';
import { glue, gluedSpace, type Midpoint } from './midpointGlue';
import { refusalOf, type Conflict } from './jRegister';

export type EdgeKind = 'seed' | 'corner' | 'medial';
/** a seed tag — `${seedVertexId}|${roleId}` or `${seedVertexId}|${word}`: what a role or word carries from the seed down through every injection */
export type SeedTag = string;

/** the identity the SOLID fixes on an edge (nothing on a seed edge): pairs in the endpoint spaces' own ids, the classes left out, and the seed corners each pair shares */
export interface Composed {
  roles: Array<[string, string]>;
  words: Array<[string, string]>;
  conflicts: string[]; // classes of the first endpoint spread over two of the other, or two onto one — left out; the pushout houses them twice
  corners: Map<string, VertexId[]>; // by `0|role` (the first endpoint's) and `1|role` (the second's): the seed corners the pair shares
}

export interface ResolvedEdge {
  id: Edge['id'] | null; // the edge between the parents in the CURRENT shape — null when the shape holds none (then no record can be read)
  kind: EdgeKind;
  parents: [VertexId, VertexId]; // in the edge's own orientation — the record reads first ↦ second
  composed: Composed;
  born: { roles: EdgeIdentification['roles']; types: EdgeIdentification['types'] }; // the record read: a seed edge's whole record, a medial edge's born pairs; nothing on a corner edge
  refused: Conflict[] | null; // the glue's refusal of composed ∪ born — then the space is the disjoint union, said by the surface
  midpoint: Midpoint | null; // the amalgam, when not refused
}

export interface Resolved {
  space: ConceptSpace;
  roleContent: Map<string, Set<SeedTag>>; // by the space's role id
  wordContent: Map<string, Set<SeedTag>>; // by the space's signature type (the display word)
  origin: 'seed' | 'derived';
  edge: ResolvedEdge | null; // for a derived space: its parents' edge
  loadedIgnored: boolean; // a born vertex holding a loaded cast — not read (Δ86)
}

export interface SpaceOfOptions {
  /** the store's τ drafts by edge id — a τ before the first role pair, read where the edge holds no record */
  tauDrafts?: Record<string, EdgeIdentification['types']>;
  /** C-8 item 4 — a CANDIDATE record on one edge, read in place of what the edge holds: the shape as an act would leave it, without writing it anywhere (RECORD, NOT READING — the candidate is an option to the read, never a fabricated shape) */
  candidate?: { edgeId: Edge['id']; roles: EdgeIdentification['roles']; types: EdgeIdentification['types'] };
}

/** the record in force on an edge for a read: the candidate when the read carries one for this edge, else what the edge holds (τ alone from the drafts) */
function recordOn(e: Edge | undefined, options: SpaceOfOptions): { roles: EdgeIdentification['roles']; types: EdgeIdentification['types'] } {
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

function seedResolved(vertexId: VertexId, cast: ConceptSpace): Resolved {
  return {
    space: cast,
    roleContent: new Map(cast.roles.map((r) => [r.id, new Set([tagOf(vertexId, r.id)])])),
    wordContent: new Map(cast.signature.map((s) => [s.type, new Set([tagOf(vertexId, s.type)])])),
    origin: 'seed',
    edge: null,
    loadedIgnored: false,
  };
}

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

/** the identity the solid fixes between two resolved spaces — the meet on roles and on the casters' words (the mold's own types are one by definition already, ruled by the register) */
export function composedOn(U: Resolved, V: Resolved): Composed {
  const r = meetOf(U.roleContent, V.roleContent);
  const w = meetOf(new Map([...U.wordContent].filter(([k]) => !isMoldType(k))), new Map([...V.wordContent].filter(([k]) => !isMoldType(k))));
  const corners = new Map<string, VertexId[]>();
  for (const [a, b] of r.pairs) {
    const shared = [...(U.roleContent.get(a) ?? [])].filter((t) => V.roleContent.get(b)?.has(t)).map(cornerOfTag);
    const list = [...new Set(shared)];
    corners.set(`0|${a}`, list);
    corners.set(`1|${b}`, list);
  }
  return { roles: r.pairs, words: w.pairs, conflicts: r.conflicts, corners };
}

const emptyComposed = (): Composed => ({ roles: [], words: [], conflicts: [], corners: new Map() });

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
      const composed = kind === 'seed' ? emptyComposed() : composedOn(U, V);
      const born = kind === 'corner' ? { roles: [], types: [] } : recordOn(e, options);
      let result = glue(U.space, V.space, [...composed.roles, ...born.roles], [...composed.words, ...born.types]);
      let refused: Conflict[] | null = null;
      if (result.refused) {
        refused = result.conflicts;
        result = glue(U.space, V.space, [], []); // the disjoint union never refuses: nothing shared, nothing to contradict
      }
      if (!result.refused) {
        const g = gluedSpace(U.space, V.space, result.midpoint);
        const roleContent = new Map<string, Set<SeedTag>>();
        for (const r of result.midpoint.roles) roleContent.set(r.key, new Set([...(r.a !== null ? U.roleContent.get(r.a) ?? [] : []), ...(r.b !== null ? V.roleContent.get(r.b) ?? [] : [])]));
        const wordContent = new Map<string, Set<SeedTag>>();
        for (const w of result.midpoint.words) wordContent.set(g.wordName.get(w.key) ?? w.key, new Set([...(w.a !== null ? U.wordContent.get(w.a) ?? [] : []), ...(w.b !== null ? V.wordContent.get(w.b) ?? [] : [])]));
        out = {
          space: g.space,
          roleContent,
          wordContent,
          origin: 'derived',
          edge: { id: e ? e.id : null, kind, parents, composed, born, refused, midpoint: refused ? null : result.midpoint },
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

/** a born act that a candidate shape BREAKS — read again under the shape as it would be (C-8 item 4, the dependency refusal) */
export interface BrokenBornAct {
  edgeId: Edge['id']; // the medial edge holding the born act
  siteId: VertexId | null; // the midpoint minted on that edge, when the shape holds it
  kind: 'role' | 'word';
  pair: [string, string]; // as the record holds it — the endpoint spaces' own ids
  names: [string, string]; // as a person reads it — the spaces' labels (a glued space's id is a local key, never shown)
  why: string;
}

/** a role's name as a person reads it — the space's label for it, else the id (a seed cast's id IS its address) */
export const nameIn = (space: ConceptSpace, id: string): string => space.roles.find((r) => r.id === id)?.label || id;
/** the name even when the space no longer holds the role (a born act named it before a later act re-glued it): its raw name, the glue's local side prefix stripped */
const shownName = (space: ConceptSpace, id: string): string => space.roles.find((r) => r.id === id)?.label || id.replace(/^[AB]:/, '');

/**
 * C-8 item 4 — every born act read again under `shape` (the shape as a candidate act would leave it): a born pair whose
 * role or word no longer exists in its endpoint's space, or that now collides with the composed identity, or that
 * contradicts under it, is BROKEN — the later act that made the shape so is refused, naming the born act it would break.
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
      for (const pair of born.roles) name(pair, 'role', 'its endpoints no longer hold a space');
      for (const pair of born.types) name(pair, 'word', 'its endpoints no longer hold a space');
      continue;
    }
    const composed = composedOn(U, V);
    const dom = new Map(composed.roles);
    const im = new Map(composed.roles.map(([a, b]) => [b, a] as [string, string]));
    for (const [x, y] of born.roles) {
      if (!U.space.roles.some((r) => r.id === x)) name([x, y], 'role', `${shownName(U.space, x)} is no longer a role there — this act re-glues it`);
      else if (!V.space.roles.some((r) => r.id === y)) name([x, y], 'role', `${shownName(V.space, y)} is no longer a role there — this act re-glues it`);
      else if (dom.has(x)) name([x, y], 'role', `${nameIn(U.space, x)} would be one with ${nameIn(V.space, dom.get(x) as string)} by the solid`);
      else if (im.has(y)) name([x, y], 'role', `${nameIn(V.space, y)} would be one with ${nameIn(U.space, im.get(y) as string)} by the solid`);
    }
    const wdom = new Map(composed.words);
    const wim = new Map(composed.words.map(([a, b]) => [b, a] as [string, string]));
    for (const [s, t] of born.types) {
      if (!U.space.signature.some((w) => w.type === s)) name([s, t], 'word', `${s} is no longer a word there`);
      else if (!V.space.signature.some((w) => w.type === t)) name([s, t], 'word', `${t} is no longer a word there`);
      else if (wdom.has(s)) name([s, t], 'word', `${s} would be one with ${wdom.get(s) as string} by the solid`);
      else if (wim.has(t)) name([s, t], 'word', `${t} would be one with ${wim.get(t) as string} by the solid`);
    }
    if (!out.some((b) => b.edgeId === e.id)) {
      const conflicts = refusalOf(U.space, V.space, [...composed.roles, ...born.roles], [...composed.words, ...born.types]);
      if (conflicts.length && born.roles.length) name(born.roles[0], 'role', `under the solid's identity its record would contradict: ${conflicts[0].type}(${conflicts[0].xTerms.join(', ')}) ${conflicts[0].xValue} against ${conflicts[0].yType}(${conflicts[0].yTerms.join(', ')}) ${conflicts[0].yValue}`);
    }
  }
  return out;
}

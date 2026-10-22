// THE TOWER — ⟨G3⟩ of ADR 0031 §9.73 (2) (Arman's Δ243, 2026-10-22, carried by the mothership: "add §9.73 (2)'s ⟨G3⟩ to group 4 — what a concept rests on, read down the
// tower at generation 2 and beyond"; the designer's 16:48: each `through` line names its concept, the depth as the chain of lines, never a count). THE RULE: at generation n
// a moment's foundation reaches the seeds THROUGH ITS COORDINATES — a born moment `i = (x, y)` (D4) rests on its two coordinates (D14's wordless legs) and, by §9.73 (1), on
// what those rest on in their casts, and so down to the seeds; a seed role rests on what its cast's held dependence tuples reach. ONE READER OF FOUNDATION (foundation.ts)
// reads the tower exactly as it reads a cast: the tower's tuples are the cast's own at every seed corner reached and the coordinate legs at every born corner reached, EVERY
// NODE KEYED THROUGH ITS CORNER (`corner|id`), so two casts' like-spelled roles never meet (identity across a hop is a record, never a string). CROSSED at a site (⟨G3⟩: *reached by
// some moment of that site*) is read along the coordinate legs alone — a moment of the site holds the foundation as a coordinate, at any depth — never along a dependence word
// (at generation 1 this is the built reading, *a positive relating holds it*: a child moment's coordinates are its two ends). A LINE on demand, never a state, never a
// refusal, never an act; nothing stored (Δ80). React-free; store-free.
import type { Shape, VertexId } from '../types/geometry';
import { dependenceTuplesOf, type DependenceTuple } from './castInside';
import { columnSpaceOf, instancesFrom, termWordsOf } from './instanceSpace';
import type { Relating } from './relatings';
import { isSeedVertex, nameIn, spaceOf, type SpaceOfOptions } from './spaceOf';

/** a node of the tower: a moment of a born corner, or a role of a seed corner — keyed through its corner */
export interface TowerNode { corner: VertexId; id: string }
export const towerKey = (corner: VertexId, id: string): string => `${corner}|${id}`;
export const towerNodeOf = (key: string): TowerNode => { const bar = key.indexOf('|'); return { corner: key.slice(0, bar), id: key.slice(bar + 1) }; };

/** the two coordinates of a born corner's moment — its parents' moments or roles, D14's wordless legs; [] for a seed role, an unknown moment or a corner of another birth */
export function coordinatesOf(shape: Shape, corner: VertexId, id: string, options: SpaceOfOptions = {}): TowerNode[] {
  const v = shape.vertices[corner];
  if (!v || v.createdBy.operation === 'seed' || v.createdBy.sourceVertexIds.length !== 2) return [];
  const [P, Q] = v.createdBy.sourceVertexIds;
  const i = instancesFrom(shape, P, Q, options).find((k) => k.key === id);
  return i ? [{ corner: P, id: i.p }, { corner: Q, id: i.q }] : [];
}

/** the moments a corner holds for the tower: a seed's roles as its cast holds them; a born corner's instances as the one reader of a born corner (`columnSpaceOf`) hands them */
function momentsOf(shape: Shape, corner: VertexId, options: SpaceOfOptions): string[] {
  if (isSeedVertex(shape, corner)) { const r = spaceOf(shape, corner, options); return r ? r.space.roles.map((x) => x.id) : []; }
  const c = columnSpaceOf(shape, corner, options);
  return c ? c.roles.map((x) => x.id) : [];
}

/**
 * THE TOWER'S TUPLES under a corner: at every born corner reached (the corner itself and its parents, recursively), each moment's two coordinate legs (`word: ''` — a leg has no
 * word); at every seed corner reached, its cast's own dependence tuples, held and denied, in the caster's order (the one reader of the second part, `dependenceTuplesOf`); every
 * node keyed through its corner. Memoized per corner across one reading.
 */
export function towerTuplesOf(shape: Shape, corner: VertexId, options: SpaceOfOptions = {}, memo: Map<VertexId, DependenceTuple[]> = new Map()): DependenceTuple[] {
  const known = memo.get(corner);
  if (known) return known;
  memo.set(corner, []);
  const out: DependenceTuple[] = [];
  const v = shape.vertices[corner];
  if (!v) return out;
  if (isSeedVertex(shape, corner)) {
    const r = spaceOf(shape, corner, options);
    for (const t of dependenceTuplesOf(r ? r.space : null)) out.push({ from: towerKey(corner, t.from), to: towerKey(corner, t.to), word: t.word, holds: t.holds });
  } else if (v.createdBy.sourceVertexIds.length === 2) {
    for (const m of momentsOf(shape, corner, options)) for (const c of coordinatesOf(shape, corner, m, options)) out.push({ from: towerKey(corner, m), to: towerKey(c.corner, c.id), word: '', holds: true });
    for (const p of v.createdBy.sourceVertexIds) out.push(...towerTuplesOf(shape, p, options, memo));
  }
  memo.set(corner, out);
  return out;
}

/** the name a card prints for a tower node, the concept named beside it (the designer's 16:48): `the capacity (Production)` · `(the advance is spent as the capacity) (Accumulation)` */
export function towerNameOf(shape: Shape, options: SpaceOfOptions = {}): (key: string) => string {
  return (key) => {
    const { corner, id } = towerNodeOf(key);
    const label = shape.vertices[corner]?.data.label?.trim() || 'unnamed';
    if (isSeedVertex(shape, corner)) { const r = spaceOf(shape, corner, options); return `${r ? nameIn(r.space, id) : id} (${label})`; }
    return `${termWordsOf(shape, corner, id, options)} (${label})`;
  };
}

/** the coordinate closure of a moment — the nodes reached along the wordless legs alone, at every depth (itself excluded) */
export function legClosureOf(shape: Shape, corner: VertexId, id: string, options: SpaceOfOptions = {}): Set<string> {
  const out = new Set<string>();
  const queue: TowerNode[] = [{ corner, id }];
  while (queue.length) {
    const n = queue.shift() as TowerNode;
    for (const c of coordinatesOf(shape, n.corner, n.id, options)) { const k = towerKey(c.corner, c.id); if (!out.has(k)) { out.add(k); queue.push(c); } }
  }
  return out;
}

/**
 * CROSSED AT A SITE (⟨G3⟩): the moments of a site — the instances across its edge, as the one reader of a born corner hands them — that reach the foundation `key` along their
 * coordinate legs; each returned as the moment's own key at the site's corner (the card says its words). At generation 1 a child moment reaches its two ends and nothing more:
 * the built reading, *a positive relating holds it*.
 */
export function reachedBy(shape: Shape, site: VertexId, key: string, options: SpaceOfOptions = {}): string[] {
  return momentsOf(shape, site, options).filter((m) => legClosureOf(shape, site, m, options).has(key));
}

/** ⟨G3⟩ — A BORN PARENT'S END (or a born column's moment) as a card reads it: the tower's tuples under its corner; its own key; the namer (the end bare — the card names its
 *  concept itself — every foundation with its concept, the designer's 16:48); the site's moments that reach a foundation along their legs (`crossed as …`); the bars at the
 *  edge whose end at this corner reaches it (`barred: …`). One producer for the child's card and the surface's */
export interface TowerEnd {
  tuples: DependenceTuple[];
  id: string;
  nameOf: (key: string) => string;
  /** the designer's 19:36: a moment as a `through` line headed by `via` names it — its concept said only where it changes (an item in the head's concept bare) */
  nameFrom: (via: string, key: string) => string;
  reached: (foundation: string) => string[];
  barsReaching: (foundation: string, bars: readonly Relating[], endAt: (r: Relating) => string) => Relating[];
}
export function towerEndOf(shape: Shape, corner: VertexId, id: string, site: VertexId, options: SpaceOfOptions = {}, memo: Map<VertexId, DependenceTuple[]> = new Map()): TowerEnd {
  const own = towerKey(corner, id);
  const named = towerNameOf(shape, options);
  const bare = isSeedVertex(shape, corner) ? (() => { const r = spaceOf(shape, corner, options); return r ? nameIn(r.space, id) : id; })() : termWordsOf(shape, corner, id, options);
  const bareOf = (key: string): string => { const n = towerNodeOf(key); if (isSeedVertex(shape, n.corner)) { const r = spaceOf(shape, n.corner, options); return r ? nameIn(r.space, n.id) : n.id; } return termWordsOf(shape, n.corner, n.id, options); };
  return {
    tuples: towerTuplesOf(shape, corner, options, memo),
    id: own,
    nameOf: (key) => (key === own ? bare : named(key)),
    // the designer's 19:36 — NAME A MOMENT'S CONCEPT ONLY WHERE IT CHANGES: within a line headed by a moment of one concept, a moment of the same concept is said bare; one of
    // another concept keeps its name (`through money accumulation (Property): the return (Finance) · the holding (Distribution)`); the coordinates line reads `nameOf`
    nameFrom: (via, key) => (key === own ? bare : towerNodeOf(via).corner === towerNodeOf(key).corner ? bareOf(key) : named(key)),
    reached: (f) => reachedBy(shape, site, f, options),
    barsReaching: (f, bars, endAt) => bars.filter((r) => legClosureOf(shape, corner, endAt(r), options).has(f)),
  };
}

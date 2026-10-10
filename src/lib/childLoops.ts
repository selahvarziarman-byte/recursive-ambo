/**
 * STAMP THE-FINDINGS-BATCH · SLICE 2 · B — THE CHILD'S LOOPS (ADR 0031 §9.40–§9.44, ratified at claims §350, §356, §358; the mothership's 10:21 and 11:06
 * letters; the designer's 10:56, 11:17 and 11:24 forms). Between two roles i < j of a midpoint's child (in its order — the edge's), the loop runs the
 * first corner's say between their first-corner ends (or their SAMENESS), line j, the second corner's say between their second-corner ends (or their
 * sameness), line i. It is OPEN when either parent is silent between them — nothing, never shown — and CLOSED when both speak: one loop per pair of says
 * (a side holding two words makes two loops). A loop with a side that does not hold is FORM (§9.41 (2)): counted apart, never offered. A loop whose two
 * sides are both sameness — two relatings at one pair — is its own kind, `two words at one pair` (§9.44 (3)): never asked, never a hole, never filled,
 * never settled. Loops run on TWO-PLACE says only; a parent relation of three or more places makes no loop and is counted apart.
 * Each asked loop has its DIAGONALS (§9.42): from i's first-corner end to j's second-corner end, and from j's to i's; a three-sided loop's diagonals
 * each have one way that is the relating itself; each way round walks one parent's say and one relating, every leg printed as it was said.
 * React-free; DOM-free; reads the shape through the child's own reader (`childSpaceOf`) and writes nothing. The records of his answers and the loop's state
 * are D's; this reader is the loops' structure alone.
 */
import type { Shape, VertexId } from '../types/geometry';
import { childSpaceOf, instancesFrom } from './instanceSpace';
import { edgeBetween } from './faceReading';
import { ALONG, type Dir } from './relatings';

/** a parent's say between two ends: their SAMENESS, or one of its recorded two-place relations between them, read from i's end (`fwd`: its first term is i's end) */
export type Say = { same: true } | { same: false; w: string; fwd: boolean; holds: boolean; from: string; to: string };
/** a role of the child: the relating it is, with its two ends (`x` at the edge's first corner, `y` at its second), its mode and its direction */
export interface LoopRole { key: string; x: string; y: string; w: string; dir: Dir }
export type LoopKind = 'four' | 'three' | 'two';
export interface ChildLoop {
  id: number; // its place in the reader's list (the pairs in the child's order, then the says in their records' order)
  i: number; // the two roles, as indices into `roles` (i < j)
  j: number;
  kind: LoopKind; // four sides; three (one end shared — `shared` says whose); two (both ends shared: two words at one pair)
  shared: 'X' | 'Y' | null;
  X: Say; // the first corner's say between x_i and x_j
  Y: Say; // the second corner's say between y_i and y_j
  form: boolean; // across a refusal: a side does not hold (§9.41 (2))
}
export interface ChildLoops {
  X: VertexId; // the edge's first corner and its second
  Y: VertexId;
  roles: LoopRole[];
  loops: ChildLoop[]; // every CLOSED loop, form and two words at one pair included; an open loop is never listed
  pairs: {
    total: number; // n (n − 1) / 2
    fillable: number; // a closed loop that can be asked (four- or three-sided, not form)
    refusalOnly: number; // closed, every loop across a refusal
    twoWords: number; // two words at one pair
    open: number; // one parent RELATES its two ends, the other is silent between two different roles (the researcher's OPEN)
    sameAndSilent: number; // one parent's ends are the same role, the other is silent between two different roles
    nothing: number; // both parents silent
  };
  many: Array<{ side: 'X' | 'Y'; w: string; terms: string[] }>; // the parents' relations of three or more places among the child's ends: no loop, counted apart
}

/** THE LOOPS of the child at a midpoint (null when the site has no child with roles) */
export function childLoopsOf(shape: Shape, siteId: VertexId): ChildLoops | null {
  const v = shape.vertices[siteId];
  if (!v || v.createdBy.operation === 'seed' || v.createdBy.sourceVertexIds.length !== 2) return null;
  const e = edgeBetween(shape.edges, v.createdBy.sourceVertexIds[0], v.createdBy.sourceVertexIds[1]);
  if (!e) return null;
  const [X, Y] = e.vertexIds as [VertexId, VertexId];
  const child = childSpaceOf(shape, siteId);
  const SX = childSpaceOf(shape, X);
  const SY = childSpaceOf(shape, Y);
  if (!child || child.roles.length === 0 || !SX || !SY) return null;
  // the child's roles, in its order, each with its two ends read off the coordinate map (D14), never parsed from the key
  const coord = new Map(instancesFrom(shape, X, Y).map((c) => [c.key, c]));
  const roles: LoopRole[] = child.roles.map((r) => { const c = coord.get(r.id); return { key: r.id, x: c ? c.p : '', y: c ? c.q : '', w: c ? c.mode : String(r.types?.mode ?? ''), dir: c ? (c.rel[4] === '←' ? '←' : ALONG) as Dir : ALONG }; });
  const labelOf = (S: typeof SX, id: string): string => S.roles.find((r) => r.id === id)?.label ?? id;
  // a parent's says between p (i's end) and q (j's end): sameness where p = q, else its recorded TWO-PLACE relations between them — the first record of a
  // (word, ordered ends, sign) as the register reads it; none = silent
  const saysOf = (S: typeof SX, p: string, q: string): Say[] => {
    if (p === q) return [{ same: true }];
    const out: Say[] = [];
    for (const r of S.relations) {
      if (r.terms.length !== 2) continue;
      const fwd = r.terms[0] === p && r.terms[1] === q;
      if (!fwd && !(r.terms[0] === q && r.terms[1] === p)) continue;
      const holds = r.polarity !== 'does-not-hold';
      if (out.some((s) => !s.same && s.w === r.type && s.fwd === fwd && s.holds === holds)) continue;
      out.push({ same: false, w: r.type, fwd, holds, from: labelOf(S, r.terms[0]), to: labelOf(S, r.terms[1]) });
    }
    return out;
  };
  const relates = (s: Say[]): boolean => s.some((x) => !x.same);
  const loops: ChildLoop[] = [];
  const pairs = { total: (roles.length * (roles.length - 1)) / 2, fillable: 0, refusalOnly: 0, twoWords: 0, open: 0, sameAndSilent: 0, nothing: 0 };
  for (let i = 0; i < roles.length; i += 1) for (let j = i + 1; j < roles.length; j += 1) {
    const xs = saysOf(SX, roles[i].x, roles[j].x);
    const ys = saysOf(SY, roles[i].y, roles[j].y);
    if (xs.length === 0 && ys.length === 0) { pairs.nothing += 1; continue; }
    if (xs.length === 0 || ys.length === 0) { if (relates(xs) || relates(ys)) pairs.open += 1; else pairs.sameAndSilent += 1; continue; }
    const shared = xs[0].same && ys[0].same ? null : xs[0].same ? 'X' : ys[0].same ? 'Y' : null;
    const kind: LoopKind = xs[0].same && ys[0].same ? 'two' : shared ? 'three' : 'four';
    let askable = false;
    for (const sx of xs) for (const sy of ys) {
      const form = (!sx.same && !sx.holds) || (!sy.same && !sy.holds);
      if (!form && kind !== 'two') askable = true;
      loops.push({ id: loops.length, i, j, kind, shared, X: sx, Y: sy, form });
    }
    if (kind === 'two') pairs.twoWords += 1;
    else if (askable) pairs.fillable += 1;
    else pairs.refusalOnly += 1;
  }
  // the relations of three or more places among the child's ends: READ, no loop (§9.44 scope)
  const ends = { X: new Set(roles.map((r) => r.x)), Y: new Set(roles.map((r) => r.y)) };
  const many: ChildLoops['many'] = [];
  for (const [side, S] of [['X', SX], ['Y', SY]] as const) for (const r of S.relations) if (r.terms.length > 2 && r.terms.every((t) => ends[side].has(t))) many.push({ side, w: r.type, terms: [...r.terms] });
  return { X, Y, roles, loops, pairs, many };
}

/** a way round a diagonal: its legs in walking order — a parent's say (walked from one end to the other, printed as said) or a relating (one of the two
 *  child roles, printed as said) — and whether the way IS the relating itself (a three-sided loop's) */
export type Leg = { kind: 'say'; side: 'X' | 'Y'; say: Say & { same: false } } | { kind: 'relating'; role: number };
export interface Way { legs: Leg[]; itself: boolean }
/** a diagonal: from one role's first-corner end (`start`, at X) to the other's second-corner end (`end`, at Y); way `a` by the first corner's side, way `b`
 *  by the second's */
export interface Diagonal { from: 'i' | 'j'; start: string; end: string; a: Way; b: Way }

/** THE DIAGONALS of an asked loop (§9.42): both, i's first; none for two words at one pair (never asked) */
export function diagonalsOf(L: ChildLoops, loop: ChildLoop): Diagonal[] {
  if (loop.kind === 'two') return [];
  const ri = L.roles[loop.i];
  const rj = L.roles[loop.j];
  const side = (s: 'X' | 'Y'): Leg[] => { const say = s === 'X' ? loop.X : loop.Y; return say.same ? [] : [{ kind: 'say', side: s, say }]; };
  // from x_i to y_j: by X's side — x_i … x_j, then relating j; by Y's side — relating i, then y_i … y_j
  const d1: Diagonal = { from: 'i', start: ri.x, end: rj.y, a: { legs: [...side('X'), { kind: 'relating', role: loop.j }], itself: loop.X.same }, b: { legs: [{ kind: 'relating', role: loop.i }, ...side('Y')], itself: loop.Y.same } };
  // from x_j to y_i: by X's side — x_j … x_i, then relating i; by Y's side — relating j, then y_j … y_i
  const d2: Diagonal = { from: 'j', start: rj.x, end: ri.y, a: { legs: [...side('X'), { kind: 'relating', role: loop.i }], itself: loop.X.same }, b: { legs: [{ kind: 'relating', role: loop.j }, ...side('Y')], itself: loop.Y.same } };
  return [d1, d2];
}



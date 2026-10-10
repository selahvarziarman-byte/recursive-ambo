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
import { AGAINST, ALONG, IS, relatingsHeld, type Dir, type LexiconFacts } from './relatings';
import { barredOn } from './sorting';

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
  pair: boolean; // one of its two relatings is a PAIR (IS): its diagonals run through the pair — form, counted apart, never asked (ADR 0031 §9.45)
}
export interface ChildLoops {
  X: VertexId; // the edge's first corner and its second
  Y: VertexId;
  // the record's own order of the two corners — by their vertex ids, never the edge's walk (a dissection may carry the edge walked the other way, ambo.ts):
  // `flipped` when the edge's first corner is the second in that order. Every identity and key a record holds is written in that order
  flipped: boolean;
  roles: LoopRole[];
  loops: ChildLoop[]; // every CLOSED loop, form and two words at one pair included; an open loop is never listed
  pairs: {
    total: number; // n (n − 1) / 2
    fillable: number; // a closed loop that can be asked (four- or three-sided, not form)
    refusalOnly: number; // closed, every loop across a refusal
    twoWords: number; // two words at one pair
    throughPair: number; // closed, its asked loops all through a pair (§9.45 (2)): never asked, counted apart
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
  const pairs = { total: (roles.length * (roles.length - 1)) / 2, fillable: 0, refusalOnly: 0, twoWords: 0, throughPair: 0, open: 0, sameAndSilent: 0, nothing: 0 };
  for (let i = 0; i < roles.length; i += 1) for (let j = i + 1; j < roles.length; j += 1) {
    const xs = saysOf(SX, roles[i].x, roles[j].x);
    const ys = saysOf(SY, roles[i].y, roles[j].y);
    if (xs.length === 0 && ys.length === 0) { pairs.nothing += 1; continue; }
    if (xs.length === 0 || ys.length === 0) { if (relates(xs) || relates(ys)) pairs.open += 1; else pairs.sameAndSilent += 1; continue; }
    const shared = xs[0].same && ys[0].same ? null : xs[0].same ? 'X' : ys[0].same ? 'Y' : null;
    const kind: LoopKind = xs[0].same && ys[0].same ? 'two' : shared ? 'three' : 'four';
    let askable = false;
    let paired = false;
    // §9.45 (2): a loop whose relatings include a PAIR runs every diagonal through it — form, counted apart, never asked
    const pair = roles[i].w === IS || roles[j].w === IS;
    for (const sx of xs) for (const sy of ys) {
      const form = (!sx.same && !sx.holds) || (!sy.same && !sy.holds);
      if (!form && kind !== 'two') { if (pair) paired = true; else askable = true; }
      loops.push({ id: loops.length, i, j, kind, shared, X: sx, Y: sy, form, pair });
    }
    if (kind === 'two') pairs.twoWords += 1;
    else if (askable) pairs.fillable += 1;
    else if (paired) pairs.throughPair += 1;
    else pairs.refusalOnly += 1;
  }
  // the relations of three or more places among the child's ends: READ, no loop (§9.44 scope)
  const ends = { X: new Set(roles.map((r) => r.x)), Y: new Set(roles.map((r) => r.y)) };
  const many: ChildLoops['many'] = [];
  for (const [side, S] of [['X', SX], ['Y', SY]] as const) for (const r of S.relations) if (r.terms.length > 2 && r.terms.every((t) => ends[side].has(t))) many.push({ side, w: r.type, terms: [...r.terms] });
  return { X, Y, flipped: Y < X, roles, loops, pairs, many };
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


// ═══ D — WHAT A WAY, A DIAGONAL AND A LOOP COME TO (ADR 0031 §9.42–§9.44; the mothership's rulings on D, 13:41, with the researcher's three precisions, its
// ruling §19.28): his answer on a way (a word, or `0` — comes to nothing), the loop's own first, else a rule's for the loop's SHAPE; a diagonal AGREES when
// both ways come to one word, DIFFERS on two words or a word and nothing, is EMPTY when both come to nothing; on a three-sided diagonal the asked way coming
// to nothing is a REFUSED ROUTE (form, counted empty, §9.43); both ways on a word BARRED at the diagonal's cross cell is a TENSION (shown, counted empty,
// §9.44 (2)); the loop: any diagonal differing, a HOLE; else anything unsaid, WAITING; else any agreeing, FILLED; else SETTLED, no relation ═══

/** his answer on a way: his word, or `0` — it comes to nothing */
export type Answer = string | 0;

/** a say as read from one of the loop's two roles: its sign, its word with its CAST — the corner holding it, the key's own and never shown (cast words are
 *  foreign across casts: `presupposes` at Value is not `presupposes` at Fact) — and its direction from that role's end; sameness `=` */
const sayRead = (say: Say, cast: VertexId, flip: boolean): string => (say.same ? '=' : `${say.holds ? '+' : '-'}${cast}|${say.w}|${say.fwd !== flip ? '>' : '<'}`);
/** a role's own identity in the record's order of the corners: a mode's sentence is already the same whichever way the edge is walked (D13); an IS pair
 *  `x≡y` is written from the first corner in the record's order */
export const roleIdOf = (L: ChildLoops, k: number): string => { const r = L.roles[k]; return r.w === IS ? (L.flipped ? `${r.y}≡${r.x}` : `${r.x}≡${r.y}`) : r.key; };
/** a relating's word with its direction in the record's order of the corners (a mirrored edge turns the stored direction, never the saying) */
const modeRead = (L: ChildLoops, k: number): string => { const r = L.roles[k]; const d = L.flipped ? (r.dir === '←' ? '→' : '←') : r.dir; return `${r.w}${r.w === IS ? '' : d}`; };

/** a loop READ FROM one of its roles: both parents' says with their directions from that role's end, and — with the modes — the two relatings' words in
 *  that order (read from the other role, the directions turn, the modes exchange places and so do the two diagonals) */
export function loopReadingOf(L: ChildLoops, loop: ChildLoop, from: 'i' | 'j', modes: boolean): string {
  const flip = from === 'j';
  const says = [sayRead(loop.X, L.X, flip), sayRead(loop.Y, L.Y, flip)];
  const parts = L.flipped ? [says[1], says[0]] : says; // the corners in the record's order
  if (modes) { const [p, q] = flip ? [loop.j, loop.i] : [loop.i, loop.j]; parts.push(modeRead(L, p), modeRead(L, q)); }
  return JSON.stringify(parts);
}
export interface LoopShape { key: string; from: 'i' | 'j'; symmetric: boolean }
/** a loop's SHAPE: the smaller of its two readings — the key's normal form only, never shown and never the column's order (§9.42: a record that changed with
 *  the layout would be a stamp) — with the end it reads from; where the two readings coincide, its two diagonals are one kind and one say serves both */
export function loopShapeOf(L: ChildLoops, loop: ChildLoop, modes: boolean): LoopShape {
  const a = loopReadingOf(L, loop, 'i', modes);
  const b = loopReadingOf(L, loop, 'j', modes);
  return a <= b ? { key: a, from: 'i', symmetric: a === b } : { key: b, from: 'j', symmetric: false };
}
/** a loop's own identity, whatever the column's order: its two roles' keys in their own order, and the says read from the first */
export function loopIdOf(L: ChildLoops, loop: ChildLoop): string {
  const ki = roleIdOf(L, loop.i);
  const kj = roleIdOf(L, loop.j);
  const flip = kj < ki;
  const says = [sayRead(loop.X, L.X, flip), sayRead(loop.Y, L.Y, flip)];
  return JSON.stringify([flip ? kj : ki, flip ? ki : kj, ...(L.flipped ? [says[1], says[0]] : says)]);
}
/** a diagonal's place in its shape's normal form: 1 for the diagonal starting at the role the normal form reads from, 2 for the other; 1 for both where the
 *  two readings coincide */
export const diagonalPlaceOf = (shape: LoopShape, from: 'i' | 'j'): 1 | 2 => (shape.symmetric || shape.from === from ? 1 : 2);

export type WaySide = 'a' | 'b'; // a way by the first corner's side (`a`) or by the second's (`b`)
export interface WayValue { value: Answer | undefined; by: 'itself' | 'loop' | 'rule' | 'pair' | null; own?: Answer; rule?: Answer }
export type DiagonalReading = 'waits' | 'agree' | 'differ' | 'empty' | 'refused' | 'tension' | 'pair';
export interface DiagonalState { diagonal: Diagonal; start: string; a: WayValue; b: WayValue; reading: DiagonalReading; word?: string; tension: { a: boolean; b: boolean } }
export type LoopState = 'waits' | 'filled' | 'hole' | 'settled' | 'form' | 'two' | 'pair';
export interface LoopReading { state: LoopState; diagonals: DiagonalState[] }
/** the records a reading reads: his answer on a way of this loop (by the loop's identity and the diagonal's starting role), a rule's for a shape (its normal
 *  form, with the modes or without, the diagonal's place, the way), and whether a word is barred at a cell (x at the first corner, y at the second) */
export interface LoopRecords {
  own: (loopId: string, start: string, way: WaySide) => Answer | undefined;
  rule: (key: string, modes: boolean, place: 1 | 2, way: WaySide) => Answer | undefined;
  barred: (x: string, y: string, w: string) => boolean;
  /** the way a word reads on this edge (D13): from the second corner's role where every relating in it reads so, else from the first's (as typed) */
  readsFromY: (w: string) => boolean;
}

/** WHAT THE LOOP COMES TO, diagonal by diagonal (§9.42's order of states) */
export function loopReadingFor(L: ChildLoops, loop: ChildLoop, R: LoopRecords): LoopReading {
  if (loop.kind === 'two') return { state: 'two', diagonals: [] };
  if (loop.form) return { state: 'form', diagonals: [] };
  if (loop.pair) {
    // §9.45: THROUGH A PAIR — each diagonal is form, never asked; a way made of the pair and a parent's say reads by SUBSTITUTION, that say carried
    // across the pair (its word, its sign), with no answer; the way that is the relating itself stays itself; the other way is not asked
    const diagonals = diagonalsOf(L, loop).map((d): DiagonalState => {
      const start = roleIdOf(L, d.from === 'i' ? loop.i : loop.j);
      const across = (w: typeof d.a): WayValue => {
        if (w.itself) { const leg = w.legs[0]; return { value: leg.kind === 'relating' ? L.roles[leg.role].w : undefined, by: 'itself' }; }
        const viaPair = w.legs.some((g) => g.kind === 'relating' && L.roles[g.role].w === IS);
        const say = w.legs.find((g) => g.kind === 'say');
        return viaPair && say && say.kind === 'say' && say.say.holds ? { value: say.say.w, by: 'pair' } : { value: undefined, by: null };
      };
      return { diagonal: d, start, a: across(d.a), b: across(d.b), reading: 'pair', tension: { a: false, b: false } };
    });
    return { state: 'pair', diagonals };
  }
  const id = loopIdOf(L, loop);
  const plain = loopShapeOf(L, loop, false);
  const withModes = loopShapeOf(L, loop, true);
  const diagonals = diagonalsOf(L, loop).map((d): DiagonalState => {
    const start = roleIdOf(L, d.from === 'i' ? loop.i : loop.j);
    const valueOf = (way: WaySide): WayValue => {
      const w = way === 'a' ? d.a : d.b;
      if (w.itself) { const leg = w.legs[0]; return { value: leg.kind === 'relating' ? L.roles[leg.role].w : undefined, by: 'itself' }; }
      const own = R.own(id, start, way);
      // the modes' rule first, being the narrower
      const rule = R.rule(withModes.key, true, diagonalPlaceOf(withModes, d.from), way) ?? R.rule(plain.key, false, diagonalPlaceOf(plain, d.from), way);
      return { value: own ?? rule, by: own !== undefined ? 'loop' : rule !== undefined ? 'rule' : null, ...(own !== undefined ? { own } : {}), ...(rule !== undefined ? { rule } : {}) };
    };
    const a = valueOf('a');
    const b = valueOf('b');
    const barred = (v: Answer | undefined): boolean => typeof v === 'string' && R.barred(d.start, d.end, v);
    const tension = { a: a.by !== 'itself' && barred(a.value), b: b.by !== 'itself' && barred(b.value) };
    let reading: DiagonalReading;
    if (a.value === undefined || b.value === undefined) reading = 'waits';
    else if (a.by === 'itself' || b.by === 'itself') {
      const asked = a.by === 'itself' ? b.value : a.value;
      const itself = a.by === 'itself' ? a.value : b.value;
      // the asked way agrees only on the relating's own word read the relating's own way (a word running both ways on one edge is two sentences, D13)
      const rel = (a.by === 'itself' ? d.a : d.b).legs[0];
      const relDir = rel.kind === 'relating' ? L.roles[rel.role].dir : ALONG;
      const sameWay = typeof asked === 'string' && (R.readsFromY(asked) ? AGAINST : ALONG) === relDir;
      reading = asked === 0 ? 'refused' : asked === itself && sameWay ? (barred(asked) ? 'tension' : 'agree') : 'differ';
    } else if (a.value === 0 && b.value === 0) reading = 'empty';
    else if (a.value === b.value) reading = barred(a.value) ? 'tension' : 'agree';
    else reading = 'differ';
    return { diagonal: d, start, a, b, reading, ...(reading === 'agree' && typeof a.value === 'string' ? { word: a.value } : {}), tension };
  });
  const any = (r: DiagonalReading): boolean => diagonals.some((x) => x.reading === r);
  return { state: any('differ') ? 'hole' : any('waits') ? 'waits' : any('agree') ? 'filled' : 'settled', diagonals };
}

// ═══ D — THE RECORDS' ROWS (the store holds them; this reader reads them) ═══
/** his answer on a way: the shape (session record) it was given in, the site, the loop's identity, the diagonal's starting role, the way, his answer — kept
 *  per shape, as the relatings it rests on are */
export type LoopAnswerRow = [string, VertexId, string, string, WaySide, Answer];
/** his rule for a loop's shape, across the solid: the shape's normal form, with the modes (1) or not (0), the diagonal's place in it, the way, the answer */
export type LoopRuleRow = [string, 0 | 1, 1 | 2, WaySide, Answer];
/** his name for a filled loop's relation: the shape, the site, the loop's identity, the name, the role it reads from (`''` not chosen yet) */
export type RelationNameRow = [string, VertexId, string, string, string];

/** the records a reading reads, at one site of one shape: his answers there, his rules (across the solid), and the edge's bars */
export function loopRecordsFor(shape: Shape, siteId: VertexId, L: ChildLoops, answers: ReadonlyArray<LoopAnswerRow>, rules: ReadonlyArray<LoopRuleRow>, facts: LexiconFacts): LoopRecords {
  const edge = edgeBetween(shape.edges, L.X, L.Y);
  const held = edge ? relatingsHeld(edge) : [];
  const bars = held.filter((r) => r[3] === '-');
  const instances = held.filter((r) => r[3] !== '-');
  const readsFromY = (w: string): boolean => { const rs = held.filter((r) => r[0] === w); return rs.length > 0 && rs.every((r) => r[4] === '←'); };
  return {
    readsFromY,
    own: (loopId, start, way) => answers.find(([s, v, l, st, w]) => s === shape.id && v === siteId && l === loopId && st === start && w === way)?.[5],
    rule: (key, modes, place, way) => rules.find(([k, m, p, w]) => k === key && m === (modes ? 1 : 0) && p === place && w === way)?.[4],
    // a word barred at the cell, read by the house's bar reader (any spelling, a declared converse's included) in the word's own direction on this edge
    barred: (x, y, w) => barredOn(bars, instances, facts, w, x, y, readsFromY(w) ? AGAINST : ALONG),
  };
}

/** the loops of a shape across the solid — every midpoint's child — whose normal form (with the modes or without) is `key`: where a rule binds */
export function loopsOfShapeAcross(shape: Shape, key: string, modes: boolean): Array<{ siteId: VertexId; L: ChildLoops; loop: ChildLoop }> {
  const out: Array<{ siteId: VertexId; L: ChildLoops; loop: ChildLoop }> = [];
  for (const v of Object.values(shape.vertices)) {
    if (v.createdBy.operation === 'seed' || v.createdBy.sourceVertexIds.length !== 2) continue;
    const L = childLoopsCached(shape, v.id);
    if (!L) continue;
    for (const loop of L.loops) if (!loop.form && loop.kind !== 'two' && !loop.pair && loopShapeOf(L, loop, modes).key === key) out.push({ siteId: v.id, L, loop });
  }
  return out;
}
const loopsMemo = new WeakMap<Shape, Map<VertexId, ChildLoops | null>>();
/** `childLoopsOf`, read once per state of the shape (a shape is never changed in place: every act makes a new one) */
export function childLoopsCached(shape: Shape, siteId: VertexId): ChildLoops | null {
  let m = loopsMemo.get(shape);
  if (!m) { m = new Map(); loopsMemo.set(shape, m); }
  if (!m.has(siteId)) m.set(siteId, childLoopsOf(shape, siteId));
  return m.get(siteId) ?? null;
}

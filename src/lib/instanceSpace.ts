// instanceSpace — STAMP MODES-1 · B2 (2026-09-26; the projection ruling D4, ADR 0031 §9.1 D4 and §9.2; Arman's Δ117 Q1, Q4,
// Q5, Q6): THE CHILD AS THE INSTANCE SPACE.
//
// Ch(e), for an edge e = XY, is a cast (D0):
//   ROLES     = the POSITIVE INSTANCES of e — the relatings (w, x, y, +) in force, read through B1's one reader (the pairing as
//               IS-instances, then the packet's modes). Each role is typed PRIMARILY by its mode (`types.mode`), with the marks
//               of x and y secondary (pulled back, below). THE CHILD IS THE INSTANCES ALONE, never the parents' leftovers (Q1):
//               under IS-only this is the core K = dom J of the built glue, not the pushout's 14 + 9 − 3.
//   SIGNATURE = Σ_X ∪ Σ_Y pulled back through the two coordinate maps (instance ↦ x, instance ↦ y); a τ-paired word is ONE word
//               with two witnesses — the same translation the glue uses (`sharedSignature`, the register's), so `s≡t` keys the
//               pair and `A:s` / `B:t` the one-sided words. `≡` is IS and nothing else (the designer's rule 3, M1): an IS
//               instance's key is `x≡y`; any other mode's key prints its word, `x w y`.
//   RECORD    = INDUCED: for u in Σ_X, u(i, j) holds via X iff u(x_i, x_j) holds in T_X; via Y likewise; where a τ-shared word
//               gives the same value on both sides it is ONE value with two witnesses; where the two sides DISAGREE the entry is
//               a DISCORDANCE, both values kept as content (Q4) — never a refusal, never a join: the child is built and says so.
//   MARKS     = the arity-1 types of x and of y on the instance (the mold's keys as themselves, the register's unary pairs as
//               `k≡k'`, the rest side-prefixed — the glue's keys); a value on both sides that agrees is one mark with two
//               witnesses; one that disagrees is a mark discordance, both kept.
//   BARS      are FORM, not roles (Q6): listed beside the child for the sorting (B3) to read; they enter no role and no tuple.
//   STRAYS    an instance naming a role its corner's cast does not hold is CARRIED as a stray and marked, never a role and never
//               dropped (carry what the substrate holds, mark what it does not).
// THE CORE of the child is its two-witness part — the roles, the tuples and the marks both sides confirm. F4 (ADR 0031 §9.2):
// under IS-only relatings the core must reproduce the built glue's core K on the flow ⊔ phi fixture EXACTLY (3 roles · 4 tuples
// · 3 marks under (J₃, τ₃)) — pinned by the witness against `glue()` itself, tuple for tuple and mark for mark.
// UNDETECTED (D8): an edge with no relating has a child with no role — carried, not looked at; `state` says so.
// B2 EXPOSES THIS TO NO READER of the core yet (the glue, the feet, the respects, the face read as before); the sorting (B3) reads
// it, and the screen (B5) prints it in the designer's words. React-free; DOM-free. Pinned by scripts/diagnose-modes1-the-instance-space.cjs.

import type { ConceptRelationType, ConceptRole, ConceptSpace, Edge, Shape, VertexId } from '../types/geometry';
import { isMoldType } from './castLoader';
import { edgeBetween } from './faceReading';
import { recordOf, sharedSignature } from './jRegister';
import type { Polarity, Side } from './midpointGlue';
import { ALONG, barsOn, dirOf, instancesOn, IS, relating, type Dir, type Relating } from './relatings';
import type { Edge as EdgeT } from '../types/geometry';
import { unconditionalOn } from './respects';
import { nameIn, spaceOf, type BrokenBornAct, type SpaceOfOptions } from './spaceOf';

export interface Instance {
  key: string; // HIS SENTENCE: `x≡y` for IS (≡ is IS only), `x w y` for a mode said from the first corner, `y w x` for one said from the second (D13 — never a word on swapped coordinates)
  mode: string;
  x: string; // the role of the edge's first corner
  y: string; // the role of its second
  dir: Dir; // the direction, positional (D13): `→` x is the subject, `←` y is; IS carries `→` (symmetric)
  inherited?: true; // D15 — an IS-instance read from a FIX one generation down (his pairing at the child's resolution), derived at every read, stored nowhere
}
export interface InducedEntry {
  word: string; // the child's word key: `s≡t`, `A:s` or `B:t`
  terms: string[]; // instance keys, in the tuple's own order
  value: Polarity;
  witnesses: Side[]; // via X (`A`), via Y (`B`), or both — sorted
}
export interface Discordance {
  word: string;
  terms: string[];
  viaA: Polarity;
  viaB: Polarity;
}
export interface InducedMark {
  type: string; // the mark's key: a mold's name as itself, `k≡k'` for a unary τ pair, `A:k` / `B:k` otherwise
  role: string; // an instance key
  value: string;
  witnesses: Side[];
}
export interface MarkDiscordance {
  type: string;
  role: string;
  viaA: string;
  viaB: string;
}
export interface InstanceSpace {
  state: 'undetected' | 'detected';
  instances: Instance[];
  bars: Relating[];
  strays: Relating[]; // instances naming a role a corner's cast does not hold — carried, marked, not roles
  words: Array<{ key: string; a: string | null; b: string | null }>; // the pulled-back signature, in Σ_X's order then Σ_Y's unpaired
  record: InducedEntry[];
  discordances: Discordance[];
  marks: InducedMark[];
  markDiscordances: MarkDiscordance[];
  core: { roles: number; tuples: number; marks: number }; // the two-witness part
  counts: { roles: number; words: number; tuples: number; marks: number; discordances: number; bars: number; strays: number };
  space: ConceptSpace; // the child as ONE cast (D0): the instances, the words, the agreed and one-sided entries; discordances beside it
}

/** an instance's key — the sentence as he said it: `x≡y` for IS; `x w y` said from the first corner; `y w x` said from the second (D13) */
export const instanceKey = (mode: string, x: string, y: string, dir: Dir = ALONG): string => (mode === IS ? `${x}≡${y}` : dir === ALONG ? `${x} ${mode} ${y}` : `${y} ${mode} ${x}`);

/** THE CHILD from two casts and the relatings across them (the pure core; `instanceSpaceOf` reads them off a shape) */
export function instanceSpaceFromCasts(A: ConceptSpace, B: ConceptSpace, relatings: Relating[], tau: Array<[string, string]>, inherited: ReadonlySet<string> = new Set()): InstanceSpace {
  const X = recordOf(A);
  const Y = recordOf(B);
  const shared = sharedSignature(X, Y, tau, { propose: false });
  const tauRel = new Map<string, string>();
  for (const [x, v] of shared.types) tauRel.set(x, v.yName);
  const tauRelInv = new Map<string, string>();
  for (const [x, y] of tauRel) tauRelInv.set(y, x);
  const tauKey = new Map<string, string>();
  for (const [x, y] of shared.unary) if (!shared.ruled.includes(x)) tauKey.set(x, y);
  const tauKeyInv = new Map<string, string>();
  for (const [x, y] of tauKey) tauKeyInv.set(y, x);
  const wordKey = (side: Side, t: string): string =>
    side === 'A' ? (tauRel.has(t) ? `${t}≡${tauRel.get(t) as string}` : `A:${t}`) : tauRelInv.has(t) ? `${tauRelInv.get(t) as string}≡${t}` : `B:${t}`;
  const markType = (side: Side, k: string): string => {
    if (shared.ruled.includes(k) || isMoldType(k)) return k;
    if (side === 'A') return tauKey.has(k) ? `${k}≡${tauKey.get(k) as string}` : `A:${k}`;
    return tauKeyInv.has(k) ? `${tauKeyInv.get(k) as string}≡${k}` : `B:${k}`;
  };

  // the roles: the positive instances, one per entry (the reader already holds one per (w, x, y)); strays carried aside
  const instances: Instance[] = [];
  const strays: Relating[] = [];
  const bars: Relating[] = [];
  for (const r of relatings) {
    if (r[3] === '-') {
      bars.push(r);
      continue;
    }
    if (!X.roles.includes(r[1]) || !Y.roles.includes(r[2])) {
      strays.push(r);
      continue;
    }
    const key = instanceKey(r[0], r[1], r[2], dirOf(r));
    if (!instances.some((i) => i.key === key)) instances.push({ key, mode: r[0], x: r[1], y: r[2], dir: dirOf(r), ...(inherited.has(key) ? { inherited: true as const } : {}) });
  }
  const byX = new Map<string, Instance[]>();
  const byY = new Map<string, Instance[]>();
  for (const i of instances) {
    byX.set(i.x, [...(byX.get(i.x) ?? []), i]);
    byY.set(i.y, [...(byY.get(i.y) ?? []), i]);
  }

  // the words: Σ_X ∪ Σ_Y pulled back, a τ pair one word
  const words: InstanceSpace['words'] = [];
  for (const s of A.signature) if (!words.some((w) => w.a === s.type)) words.push({ key: wordKey('A', s.type), a: s.type, b: tauRel.get(s.type) ?? null });
  for (const s of B.signature) if (!tauRelInv.has(s.type) && !words.some((w) => w.b === s.type)) words.push({ key: wordKey('B', s.type), a: null, b: s.type });

  // the induced record: every instance tuple whose coordinates form a recorded tuple of a parent
  const entries = new Map<string, { word: string; terms: string[]; values: Partial<Record<Side, Polarity>> }>();
  const induce = (side: Side, space: ConceptSpace, by: Map<string, Instance[]>): void => {
    const seen = new Set<string>();
    for (const r of space.relations) {
      const own = `${r.type}|${JSON.stringify(r.terms)}`;
      if (seen.has(own)) continue; // a cast's first record of a tuple is its value (the register's rule)
      seen.add(own);
      const word = wordKey(side, r.type);
      // every choice of one instance per coordinate
      let choices: Instance[][] = [[]];
      for (const t of r.terms) {
        const here = by.get(t) ?? [];
        if (here.length === 0) {
          choices = [];
          break;
        }
        choices = choices.flatMap((c) => here.map((i) => [...c, i]));
      }
      for (const c of choices) {
        const terms = c.map((i) => i.key);
        const k = `${word}|${JSON.stringify(terms)}`;
        const e = entries.get(k) ?? { word, terms, values: {} };
        if (e.values[side] === undefined) e.values[side] = r.polarity;
        entries.set(k, e);
      }
    }
  };
  induce('A', A, byX);
  induce('B', B, byY);
  const record: InducedEntry[] = [];
  const discordances: Discordance[] = [];
  for (const e of entries.values()) {
    const a = e.values.A;
    const b = e.values.B;
    if (a !== undefined && b !== undefined && a !== b) discordances.push({ word: e.word, terms: e.terms, viaA: a, viaB: b });
    else record.push({ word: e.word, terms: e.terms, value: (a ?? b) as Polarity, witnesses: [a !== undefined ? 'A' : null, b !== undefined ? 'B' : null].filter((s): s is Side => s !== null) });
  }

  // the marks: the arity-1 types of x and y, pulled back onto the instance
  const markMap = new Map<string, { type: string; role: string; values: Partial<Record<Side, string>> }>();
  for (const [side, space, coord] of [['A', A, (i: Instance) => i.x], ['B', B, (i: Instance) => i.y]] as Array<[Side, ConceptSpace, (i: Instance) => string]>) {
    for (const role of space.roles) {
      const here = instances.filter((i) => coord(i) === role.id);
      if (here.length === 0) continue;
      for (const [k, v] of Object.entries(role.types ?? {})) {
        if (v === 'UNKNOWN') continue; // absence, never a value
        const type = markType(side, k);
        for (const i of here) {
          const key = `${type}|${i.key}`;
          const m = markMap.get(key) ?? { type, role: i.key, values: {} };
          if (m.values[side] === undefined) m.values[side] = v;
          markMap.set(key, m);
        }
      }
    }
  }
  const marks: InducedMark[] = [];
  const markDiscordances: MarkDiscordance[] = [];
  for (const m of markMap.values()) {
    const a = m.values.A;
    const b = m.values.B;
    if (a !== undefined && b !== undefined && a !== b) markDiscordances.push({ type: m.type, role: m.role, viaA: a, viaB: b });
    else marks.push({ type: m.type, role: m.role, value: (a ?? b) as string, witnesses: [a !== undefined ? 'A' : null, b !== undefined ? 'B' : null].filter((s): s is Side => s !== null) });
  }

  // the child as one cast
  const roles: ConceptRole[] = instances.map((i) => {
    const types: Record<string, string> = { mode: i.mode };
    for (const m of marks) if (m.role === i.key) types[m.type] = m.value;
    return { id: i.key, types };
  });
  const signature: ConceptRelationType[] = words.map((w) => ({ type: w.key, arity: (w.a !== null ? X.arityOf.get(w.a) : Y.arityOf.get(w.b as string)) ?? 2 }));
  const space: ConceptSpace = { roles, signature, relations: record.map((e) => ({ type: e.word, terms: [...e.terms], polarity: e.value })), axioms: [] };

  return {
    state: instances.length === 0 && bars.length === 0 && strays.length === 0 ? 'undetected' : 'detected',
    instances,
    bars,
    strays,
    words,
    record,
    discordances,
    marks,
    markDiscordances,
    core: { roles: instances.length, tuples: record.filter((e) => e.witnesses.length === 2).length, marks: marks.filter((m) => m.witnesses.length === 2).length },
    counts: { roles: instances.length, words: words.length, tuples: record.length, marks: marks.length, discordances: discordances.length + markDiscordances.length, bars: bars.length, strays: strays.length },
    space,
  };
}

/**
 * B4 (D10) — THE MODES LAYER'S SPACE OF A VERTEX: a seed corner's cast as held (the resolver's one reader of it); a born vertex
 * with two parents — its CHILD, the instance space of the edge between them, read recursively (children are casts at every
 * generation, D4); any other vertex — none. Stored nowhere; memoized per read; a cycle reads as none.
 */
export function childSpaceOf(shape: Shape, v: VertexId, options: SpaceOfOptions = {}, memo: Map<VertexId, ConceptSpace | null> = new Map()): ConceptSpace | null {
  const known = memo.get(v);
  if (known !== undefined) return known;
  memo.set(v, null);
  const vertex = shape.vertices[v];
  if (!vertex) return null;
  let out: ConceptSpace | null = null;
  if (vertex.createdBy.operation === 'seed') {
    const R = spaceOf(shape, v, options);
    out = R ? R.space : null;
  } else if (vertex.createdBy.sourceVertexIds.length === 2) {
    const [p, q] = vertex.createdBy.sourceVertexIds;
    const child = instanceSpaceOf(shape, edgeBetween(shape.edges, p, q), options, memo);
    out = child ? child.space : null;
  }
  memo.set(v, out);
  return out;
}

/** THE COORDINATE MAP READ OFF THE CHILD (D4, D14): the instances of the born vertex ⟨P, Q⟩ oriented from P to Q — each with its
 *  P-coordinate `p`, its Q-coordinate `q`, its mode, and the relating it IS as the edge P–Q stores it (`rel`, with its direction) */
export function instancesFrom(shape: Shape, P: VertexId, Q: VertexId, options: SpaceOfOptions = {}): Array<{ key: string; p: string; q: string; mode: string; rel: Relating }> {
  const e = edgeBetween(shape.edges, P, Q);
  if (!e) return [];
  const child = instanceSpaceOf(shape, e, options);
  if (!child) return [];
  const flipped = e.vertexIds[0] !== P;
  return child.instances.map((i: Instance) => ({ key: i.key, p: flipped ? i.y : i.x, q: flipped ? i.x : i.y, mode: i.mode, rel: relating(i.mode, i.x, i.y, '+', i.dir) }));
}

/**
 * D15 — THE INHERITED IS-INSTANCES of a medial edge XY (X = ⟨P, Q⟩, Y = ⟨P, R⟩): `(IS, i, j)` holds by inheritance iff i and j share a
 * coordinate p at the parent P and the passage they restate one generation down is the stone's FIX — his pairing q ≡ r on Q–R
 * (read through this reader too, so a FIX two generations down inherits twice). Derived at every read, stored nowhere; the
 * face's (P's), never own. Nothing on a seed or a corner edge (the coordinate map is structure, not an instance — D14).
 */
export function inheritedISOn(shape: Shape, edge: EdgeT | undefined, options: SpaceOfOptions = {}, seen: Set<string> = new Set()): Relating[] {
  if (!edge || seen.has(edge.id)) return [];
  seen.add(edge.id);
  const [X, Y] = edge.vertexIds as [VertexId, VertexId];
  const parentsOf = (v: VertexId): VertexId[] => { const w = shape.vertices[v]; return !w || w.createdBy.operation === 'seed' ? [] : [...w.createdBy.sourceVertexIds]; };
  const px = parentsOf(X); const py = parentsOf(Y);
  if (px.length !== 2 || py.length !== 2) return [];
  const P = px.find((v) => py.includes(v));
  if (P === undefined) return [];
  const Q = px.find((v) => v !== P) as VertexId; const R = py.find((v) => v !== P) as VertexId;
  const eQR = edgeBetween(shape.edges, Q, R);
  if (!eQR) return [];
  // his pairings on Q–R and the ones inherited there, oriented Q → R
  const qr = new Set<string>();
  for (const r of instancesWithInherited(shape, eQR, options, seen)) if (r[0] === IS) qr.add(eQR.vertexIds[0] === Q ? `${r[1]}|${r[2]}` : `${r[2]}|${r[1]}`);
  const xs = instancesFrom(shape, P, Q, options).filter((i) => i.mode === IS);
  const ys = instancesFrom(shape, P, R, options).filter((j) => j.mode === IS);
  const out: Relating[] = [];
  for (const i of xs) for (const j of ys) if (i.p === j.p && qr.has(`${i.q}|${j.q}`)) out.push([IS, i.key, j.key, '+']);
  return out;
}

/** THE IS-INSTANCES AND THE REST of an edge as the medium holds them (D15 (b)): B1's one reader — the pairing in force and the packet — and the inherited IS beside it */
export function instancesWithInherited(shape: Shape, edge: EdgeT | undefined, options: SpaceOfOptions = {}, seen: Set<string> = new Set()): Relating[] {
  if (!edge) return [];
  // STAMP MODES-3 (the mothership's ruling 1, 16:18): a STRAY — a held relating naming a role a parent's child does not hold (an old record's
  // pair between the parents' leftover seed roles) — is kept in the record and listed by the surface, but counted by no reader of the child
  const [p, q] = edge.vertexIds as [VertexId, VertexId];
  const memo = new Map<VertexId, ConceptSpace | null>();
  const U = childSpaceOf(shape, p, options, memo);
  const V = childSpaceOf(shape, q, options, memo);
  const placed = (r: Relating): boolean => !U || !V || (U.roles.some((x) => x.id === r[1]) && V.roles.some((y) => y.id === r[2]));
  const held = instancesOn(edge, options).filter(placed);
  const inherited = inheritedISOn(shape, edge, options, seen).filter((r) => !held.some((h) => h[0] === IS && h[1] === r[1] && h[2] === r[2]));
  return [...held, ...inherited];
}

/** THE CHILD of an edge on a shape: the corners' spaces through the modes layer's reader (a seed's cast; a born corner's own child — B4), the relatings through B1's one reader with the inherited IS beside them (D15, D11), τ from the pairing in force (the drafts where none stands) */
export function instanceSpaceOf(shape: Shape, edge: Edge | undefined, options: SpaceOfOptions = {}, memo: Map<VertexId, ConceptSpace | null> = new Map()): InstanceSpace | null {
  if (!edge) return null;
  const [p, q] = edge.vertexIds as [VertexId, VertexId];
  const U = childSpaceOf(shape, p, options, memo);
  const V = childSpaceOf(shape, q, options, memo);
  if (!U || !V) return null;
  const inherited = inheritedISOn(shape, edge, options);
  const relatings = [...instancesOn(edge, options), ...inherited.filter((r) => !instancesOn(edge, options).some((h) => h[0] === IS && h[1] === r[1] && h[2] === r[2])), ...barsOn(edge, options)];
  return instanceSpaceFromCasts(U, V, relatings, unconditionalOn(edge, options).types, new Set(inherited.map((r) => instanceKey(IS, r[1], r[2]))));
}

/**
 * A TERM'S WORDS at a corner (the designer's §1, 2026-09-29, ratified as meaning §215; S11's amendment): a role by its name; a role
 * that is itself a relating — a born corner's instance, a SENTENCE — in parentheses, its mode's word between its two terms (IS as
 * `≡`), each term read the same way at its own corner: `(r3 carries F2)` · `(r8 ≡ F7)` · `((r8 ≡ F7) ≡ (F7 ≡ Φ1))` at generation 3.
 * A point's own label stands alone and takes none. Read, never stored.
 */
export function termWordsOf(shape: Shape, corner: VertexId, id: string, options: SpaceOfOptions = {}, memo: Map<VertexId, ConceptSpace | null> = new Map()): string {
  const v = shape.vertices[corner];
  if (v && v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2) {
    const [p0, q0] = v.createdBy.sourceVertexIds;
    const e = edgeBetween(shape.edges, p0, q0);
    const child = instanceSpaceOf(shape, e, options, memo);
    const inst = child ? child.instances.find((i) => i.key === id) : undefined;
    // an instance's x is the role of the edge's FIRST STORED corner and its y of the second (never the parents' listed order,
    // which may run the other way — at generation ≥ 2 the two orders differ and a seed's label no longer masks it)
    const [p, q] = e ? (e.vertexIds as [VertexId, VertexId]) : [p0, q0];
    // the sentence as he said it (D13): from the first corner `x w y`, from the second `y w x`; IS symmetric
    if (inst) return inst.dir === ALONG ? `(${termWordsOf(shape, p, inst.x, options, memo)} ${inst.mode === IS ? '≡' : inst.mode} ${termWordsOf(shape, q, inst.y, options, memo)})` : `(${termWordsOf(shape, q, inst.y, options, memo)} ${inst.mode} ${termWordsOf(shape, p, inst.x, options, memo)})`;
  }
  const space = childSpaceOf(shape, corner, options, memo);
  return space ? nameIn(space, id) : id;
}

// ─── STAMP MODES-3 — ONE READER FOR THE COLUMNS, THE ACT AND THE LIFTED DRAWING ─────────────────────────────────────────────
// The generation-2 gesture by construction (the designer's 10:23 §1, ratified §215; the mothership's one ruling 16:18, §285): at
// every generation a column of the midpoint view is what the corner HOLDS as a cast — a seed corner its cast, a born corner its
// CHILD (its relatings as points, each labelled by its sentence; `childSpaceOf`, B4) — and the act is two picks in those columns.
// The identity regime's merged space (the resolver's pushout: the shared corner composed on both sides, the parents' leftovers
// beside it — C-8's born room) is no column's source: a point the drawing offers is a role the act takes, and no second reader
// draws the columns. The lifted card's drawing reads the same (the ruling's 4). A born corner whose child has no role HOLDS NO
// SPACE here (M10's rule, extended by the designer's 16:26 1b: `AB holds no relating yet`).

/** the one word a child's word KEY reads as (COPY-1 §4.5; the cut's 4c): a one-sided `A:s` as `<corner>'s s` by the corner's NAME (the
 * edge's first stored corner for `A:`, the second for `B:`), a τ pair `s≡t` as `s ≡ t`; a seed's word is itself. The key is never printed. */
export function wordWordsOf(shape: Shape, corner: VertexId, key: string): string {
  const v = shape.vertices[corner];
  if (!v || v.createdBy.operation === 'seed' || v.createdBy.sourceVertexIds.length !== 2) return key;
  const e = edgeBetween(shape.edges, v.createdBy.sourceVertexIds[0], v.createdBy.sourceVertexIds[1]);
  const [e0, e1] = e ? (e.vertexIds as [VertexId, VertexId]) : (v.createdBy.sourceVertexIds as [VertexId, VertexId]);
  const nameOf = (c: VertexId): string => shape.vertices[c]?.data.label?.trim() || 'unnamed';
  // the designer's gate (12:32 §3): at generation ≥ 2 a one-sided key wraps a KEY of the corner's own child (`A:A:sustains` at ABAC — AB's
  // `A:sustains`); it reads as that key reads at its corner, `through` the corner: `A's sustains through AB`, never `AB's A:sustains`
  const isKey = (s: string): boolean => /^[AB]:/.test(s) || s.includes('≡');
  const oneSided = (c: VertexId, rest: string): string => (isKey(rest) ? `${wordWordsOf(shape, c, rest)} through ${nameOf(c)}` : `${nameOf(c)}'s ${rest}`);
  const pair = /^([AB]:[^≡]+)≡([AB]:[^≡]+)$/.exec(key);
  if (pair) return `${wordWordsOf(shape, corner, pair[1])} ≡ ${wordWordsOf(shape, corner, pair[2])}`;
  if (key.startsWith('A:')) return oneSided(e0, key.slice(2));
  if (key.startsWith('B:')) return oneSided(e1, key.slice(2));
  return key.includes('≡') ? key.split('≡').join(' ≡ ') : key;
}

/**
 * THE COLUMN SPACE of a corner — what it holds as a cast for the act at a midpoint: a seed corner's cast as held; a born corner's
 * child with each role LABELLED by its sentence (`termWordsOf`: `(F5 ≡ Φ7)`) and the `mode` type left off its types (the sentence
 * already says it — M12); the signature and the record keep their KEYS (the act stores keys; `wordWordsOf` reads them). A born
 * corner whose child has no role holds no space here (null). Read at every call; stored nowhere.
 */
export function columnSpaceOf(shape: Shape, corner: VertexId, options: SpaceOfOptions = {}, memo: Map<VertexId, ConceptSpace | null> = new Map()): ConceptSpace | null {
  const space = childSpaceOf(shape, corner, options, memo);
  if (!space) return null;
  const v = shape.vertices[corner];
  if (!v || v.createdBy.operation === 'seed') return space;
  if (space.roles.length === 0) return null;
  return {
    ...space,
    roles: space.roles.map((r) => {
      const types = { ...(r.types ?? {}) };
      delete types.mode;
      return { ...r, label: termWordsOf(shape, corner, r.id, options, memo), ...(Object.keys(types).length ? { types } : { types: undefined }) };
    }),
  };
}

/** the column space with its word KEYS read as words — for a DRAWING of it (the arcs print their type); the act never reads this one */
export function columnDisplayOf(shape: Shape, corner: VertexId, space: ConceptSpace): ConceptSpace {
  return {
    ...space,
    signature: space.signature.map((t) => ({ ...t, type: wordWordsOf(shape, corner, t.type) })),
    relations: space.relations.map((rel) => ({ ...rel, type: wordWordsOf(shape, corner, rel.type) })),
  };
}

/**
 * STAMP MODES-3 (the mothership's ruling 2, 16:18; C-8 item 4 in the child's terms): THE RELATINGS A CANDIDATE RECORD WOULD ORPHAN.
 * An IS pair on an edge between two born corners is a relating at generation ≥ 2 whose two ends are instances of the parents'
 * children; under the candidate (the shape as an act would leave it — read, never written) a parent's child may no longer hold one of
 * them, and then the relating is orphaned: the store turns the act away by name, the relating and its ends read through the one reader of a
 * term's words, in the one grammar (`BrokenBornAct`, as the dependency reading already carries it). Read at every call.
 */
export function orphanedRelatings(shape: Shape, options: SpaceOfOptions = {}, except: Edge['id'] | null = null): BrokenBornAct[] {
  const now = new Map<VertexId, ConceptSpace | null>();
  const then = new Map<VertexId, ConceptSpace | null>();
  return orphansAmong(shape, except, (p, q) => [childSpaceOf(shape, p, {}, now), childSpaceOf(shape, q, {}, now)], (p, q) => [childSpaceOf(shape, p, options, then), childSpaceOf(shape, q, options, then)]);
}

/** the relatings at generation ≥ 2 that withdrawing the relatings with these instance KEYS (at generation 1, on their own edges) would orphan */
export function orphanedByKeys(shape: Shape, keys: ReadonlySet<string>, except: Edge['id'] | null = null): BrokenBornAct[] {
  const now = new Map<VertexId, ConceptSpace | null>();
  const without = (space: ConceptSpace | null): ConceptSpace | null => (space ? { ...space, roles: space.roles.filter((r) => !keys.has(r.id)) } : null);
  return orphansAmong(shape, except, (p, q) => [childSpaceOf(shape, p, {}, now), childSpaceOf(shape, q, {}, now)], (p, q) => [without(childSpaceOf(shape, p, {}, now)), without(childSpaceOf(shape, q, {}, now))]);
}

/** every relating he holds on an edge between two born corners whose end a parent's child holds now and would not hold then */
function orphansAmong(shape: Shape, except: Edge['id'] | null, nowOf: (p: VertexId, q: VertexId) => [ConceptSpace | null, ConceptSpace | null], thenOf: (p: VertexId, q: VertexId) => [ConceptSpace | null, ConceptSpace | null]): BrokenBornAct[] {
  const out: BrokenBornAct[] = [];
  const holds = (space: ConceptSpace | null, id: string): boolean => !!space && space.roles.some((r) => r.id === id);
  for (const e of shape.edges) {
    if (e.id === except) continue;
    const [p, q] = e.vertexIds as [VertexId, VertexId];
    const vp = shape.vertices[p];
    const vq = shape.vertices[q];
    if (!vp || !vq || vp.createdBy.operation === 'seed' || vq.createdBy.operation === 'seed') continue; // both ends born: generation ≥ 2
    const held = instancesOn(e); // B1's one reader: every relating he holds here — the pairing's IS-instances and the packet's modes
    if (held.length === 0) continue;
    const [Up, Vq] = nowOf(p, q);
    const [Up2, Vq2] = thenOf(p, q);
    const siteId = Object.values(shape.vertices).find((v) => v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(p) && v.createdBy.sourceVertexIds.includes(q))?.id ?? null;
    for (const r of held) {
      const [w, x, y] = r;
      const heldNow = holds(Up, x) && holds(Vq, y);
      const heldThen = holds(Up2, x) && holds(Vq2, y);
      if (!heldNow || heldThen) continue;
      const names: [string, string] = [termWordsOf(shape, p, x), termWordsOf(shape, q, y)];
      const lost = holds(Up2, x) ? names[1] : names[0];
      out.push({ edgeId: e.id, siteId, kind: 'role', pair: [x, y], names, why: `${lost} is one of its ends`, ...(w === IS ? {} : { mode: w, reversed: dirOf(r) !== ALONG }) });
    }
  }
  return out;
}

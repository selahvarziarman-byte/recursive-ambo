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
import { barsOn, instancesOn, IS, type Relating } from './relatings';
import { unconditionalOn } from './respects';
import { spaceOf, type SpaceOfOptions } from './spaceOf';

export interface Instance {
  key: string; // `x≡y` for IS (≡ is IS only), `x w y` for any other mode
  mode: string;
  x: string; // the role of the edge's first corner
  y: string; // the role of its second
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

export const instanceKey = (mode: string, x: string, y: string): string => (mode === IS ? `${x}≡${y}` : `${x} ${mode} ${y}`);

/** THE CHILD from two casts and the relatings across them (the pure core; `instanceSpaceOf` reads them off a shape) */
export function instanceSpaceFromCasts(A: ConceptSpace, B: ConceptSpace, relatings: Relating[], tau: Array<[string, string]>): InstanceSpace {
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
    const key = instanceKey(r[0], r[1], r[2]);
    if (!instances.some((i) => i.key === key)) instances.push({ key, mode: r[0], x: r[1], y: r[2] });
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

/** THE CHILD of an edge on a shape: the corners' spaces through the modes layer's reader (a seed's cast; a born corner's own child — B4), the relatings through B1's one reader, τ from the pairing in force (the drafts where none stands) */
export function instanceSpaceOf(shape: Shape, edge: Edge | undefined, options: SpaceOfOptions = {}, memo: Map<VertexId, ConceptSpace | null> = new Map()): InstanceSpace | null {
  if (!edge) return null;
  const [p, q] = edge.vertexIds as [VertexId, VertexId];
  const U = childSpaceOf(shape, p, options, memo);
  const V = childSpaceOf(shape, q, options, memo);
  if (!U || !V) return null;
  const relatings = [...instancesOn(edge, options), ...barsOn(edge, options)];
  return instanceSpaceFromCasts(U, V, relatings, unconditionalOn(edge, options).types);
}

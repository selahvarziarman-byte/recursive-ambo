// ═══ THE MIDPOINT — `STAMP C-7b`, 2026-09-22 (Δ81, Arman's word: BOTH opposite
// vertices; the designer's form, ratified §110.2; the researcher's definitions,
// ratified §108): the midpoint's concept-space is the AMALGAM of its two parents'
// casts over the person's role-map J and word-map τ — the PUSHOUT, computed on
// the TYPE — and the TRACE of the person's act. NOT_FROZEN while only components
// and witnesses import it.
//
// THE SECOND IMPLEMENTATION of the researcher's `glue(A, B, J, tau)` and `trace(M)`
// (.handoff/instruments/connection_layer_reference/inside_midpoint_trace.py) — the
// ADR 0031 kill-condition pattern: a disagreement between the two reopens the
// DEFINITION, never tunes the code. The seal it must reproduce: flow ⊔_∅ phi =
// 23 roles · 25 words · 56 tuples · 23 marks; under (J₃, τ₃) 20 · 22 · 52 (4 both) ·
// 20 marks, the core K = 3 roles · 4 tuples · 3 marks, 14 + 9 − 3 = 20;
// [F5≡Φ7] 7: both 1 · flow 4 · phi 2 · [F7≡Φ1] 24: 3 · 7 · 14 · [F8≡Φ2] 7: 2 · 3 · 2;
// flow alone 11 roles · 27 tuples on them · 3 untranslated on mapped · 0 exposed;
// phi alone 6 · 11 · 7 · 0.
//
// THE DEFINITIONS:
//   the pushout        |R_M| = |R_A| + |R_B| − |dom J|; the glued record is the UNION
//                      pushed along the two injections — a tuple known on both
//                      sides with ONE value is ONE tuple with TWO witnesses
//                      (`both`); a role, a word, a tuple from one side alone keeps
//                      its side as its origin.
//   the words          outside τ FOREIGN even when spelled alike (Δ80 — the
//                      same-name proposal is gone); a τ pair with the FORM (both
//                      declared, one arity) makes ONE word of two; the mold's own
//                      type is ONE type on both sides BY DEFINITION when both casts
//                      declare it (`has ⊔ unrecorded = has` — C-7pre; UNKNOWN is
//                      absence, never a value); a caster's unary key is a word like
//                      any other — one type only under τ.
//   the refusal        a contradiction REFUSES the act — the register's check at
//                      the act (`refusalOf`, ONE place), every offending tuple
//                      named with both values; nothing is glued.
//   J = τ = ∅          the DISJOINT UNION: the parents side by side, unglued.
//   the trace          the ORIGIN PARTITION of the ONE glued record, as description:
//                      per glued role — the tuples now about it both · from A ·
//                      from B, and the mold's value with its witnesses; per parent —
//                      what it brought that the other did not confirm (A ⊖ K, never
//                      A ⊖ M): roles that met no partner, tuples on them, tuples on
//                      mapped roles in untranslated words, tuples in translated
//                      words the other side has UNRECORDED (the exposure — an
//                      absence shown, never a tuple fabricated into the other
//                      side). A partition — never an order on acts.
// ⛔ NEVER: a trace of a map not made; two traces side by side; a candidate; a
// weight; a ranking; a proposal. A trace is a function of ONE act.
//
// `STAMP C-7d` item 1 (Δ82, Arman's word: "a midpoint after mapping should have
// its own diagram, not just the mapping"): THE GLUED SPACE AS A CONCEPT-SPACE —
// `gluedSpace` turns the amalgam into the same `ConceptSpace` shape a corner
// holds, so ONE presentation (`insideOf` → the inside column) serves the corner
// and the midpoint: the researcher's §1 — a midpoint's inside is the same
// presentation plus an ORIGIN colouring; a corner is the one-colour case. The
// midpoint MINTS geometrically and INHERITS semantically (CONTEXT.md's law in
// its own register). Derived at every read, never stored (RECORD, NOT READING).

import type { ConceptSpace, EdgeIdentification } from '../types/geometry';
import { isMoldType, moldJoin } from './castLoader';
import { recordOf, refusalOf, sharedSignature, type Conflict } from './jRegister';

export type Side = 'A' | 'B';
export type Origin = 'both' | Side;
export type Polarity = 'holds' | 'does-not-hold';

export interface GluedRole {
  key: string; // `x≡y` for a glued pair, `A:x` / `B:y` otherwise
  a: string | null;
  b: string | null;
  origin: Origin;
}

export interface GluedWord {
  key: string; // `s≡t` for a translated pair, `A:s` / `B:t` otherwise
  a: string | null;
  b: string | null;
  origin: Origin;
}

export interface GluedTuple {
  word: string; // a GluedWord key
  terms: string[]; // GluedRole keys, in the tuple's own order
  value: Polarity;
  origin: Origin;
}

export interface GluedMark {
  type: string; // the mold's name (one type by definition), a τ-paired key `k≡k'`, or `A:k` / `B:k`
  role: string; // a GluedRole key
  value: string;
  witnesses: Side[];
}

export interface MidpointCounts {
  roles: number;
  words: number;
  tuples: number;
  both: number;
  marks: number;
}

export interface Midpoint {
  roles: GluedRole[]; // A's in the caster's order, then B's unglued ones in theirs
  words: GluedWord[];
  tuples: GluedTuple[];
  marks: GluedMark[];
  pairs: Array<[string, string]>; // J in force — pairs whose roles both exist, one-to-one
  tau: Array<[string, string]>; // τ in force — the given pairs with the form
  counts: MidpointCounts;
  core: { roles: number; tuples: number; marks: number }; // K = A ×_M B: what both sides confirm
  originOf: { A: Map<string, Origin>; B: Map<string, Origin> }; // by a parent's OWN tuple `type|terms` — the drawing's colouring
}

export type GlueResult = { refused: true; conflicts: Conflict[] } | { refused: false; midpoint: Midpoint };

const tupleKey = (type: string, terms: string[]): string => `${type}|${JSON.stringify(terms)}`;

/** THE GLUE — the pushout of two casts over the person's (J, τ), or the refusal by name. */
export function glue(A: ConceptSpace, B: ConceptSpace, roles: EdgeIdentification['roles'], types: EdgeIdentification['types']): GlueResult {
  const conflicts = refusalOf(A, B, roles, types);
  if (conflicts.length > 0) return { refused: true, conflicts };
  const X = recordOf(A);
  const Y = recordOf(B);
  const shared = sharedSignature(X, Y, types, { propose: false });
  // J in force: one-to-one, over roles that exist (a pair naming a role a cast does not hold is named by the surface, never glued)
  const J = new Map<string, string>();
  const inv = new Map<string, string>();
  for (const [x, y] of roles) {
    if (X.roles.includes(x) && Y.roles.includes(y) && !J.has(x) && !inv.has(y)) {
      J.set(x, y);
      inv.set(y, x);
    }
  }
  const roleKey = (side: Side, r: string): string =>
    side === 'A' ? (J.has(r) ? `${r}≡${J.get(r) as string}` : `A:${r}`) : inv.has(r) ? `${inv.get(r) as string}≡${r}` : `B:${r}`;
  // τ in force — relational pairs and caster-key pairs; the mold's keys ruled
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
    if (shared.ruled.includes(k)) return k;
    if (side === 'A') return tauKey.has(k) ? `${k}≡${tauKey.get(k) as string}` : `A:${k}`;
    return tauKeyInv.has(k) ? `${tauKeyInv.get(k) as string}≡${k}` : `B:${k}`;
  };
  // the glued record — the union pushed along the injections
  const tuples = new Map<string, { word: string; terms: string[]; value: Polarity; origin: Set<Side> }>();
  const originOf = { A: new Map<string, Origin>(), B: new Map<string, Origin>() };
  const putSide = (side: Side, space: ConceptSpace): void => {
    const seen = new Set<string>();
    for (const r of space.relations) {
      const own = tupleKey(r.type, r.terms);
      if (seen.has(own)) continue;
      seen.add(own);
      const word = wordKey(side, r.type);
      const terms = r.terms.map((x) => roleKey(side, x));
      const k = `${word}|${JSON.stringify(terms)}`;
      const e = tuples.get(k);
      if (e) e.origin.add(side);
      else tuples.set(k, { word, terms, value: r.polarity, origin: new Set([side]) });
    }
  };
  putSide('A', A);
  putSide('B', B);
  for (const [side, space] of [['A', A], ['B', B]] as Array<[Side, ConceptSpace]>) {
    for (const r of space.relations) {
      const k = `${wordKey(side, r.type)}|${JSON.stringify(r.terms.map((x) => roleKey(side, x)))}`;
      const e = tuples.get(k);
      if (e) originOf[side].set(tupleKey(r.type, r.terms), e.origin.size === 2 ? 'both' : side);
    }
  }
  const marks = new Map<string, { type: string; role: string; value: string; witnesses: Set<Side> }>();
  for (const [side, space] of [['A', A], ['B', B]] as Array<[Side, ConceptSpace]>) {
    for (const role of space.roles) {
      for (const [k, v] of Object.entries(role.types ?? {})) {
        if (v === 'UNKNOWN') continue; // absence, never a value
        const type = markType(side, k);
        const rk = roleKey(side, role.id);
        const key = `${type}|${rk}`;
        const e = marks.get(key);
        if (e) {
          // the check refused every contradiction; two values left are one role-fact — the union record's value
          e.value = isMoldType(type) ? (moldJoin(type, e.value, v) ?? e.value) : e.value;
          e.witnesses.add(side);
        } else marks.set(key, { type, role: rk, value: v, witnesses: new Set([side]) });
      }
    }
  }
  const glued: GluedRole[] = [];
  for (const r of A.roles) if (!glued.some((g) => g.a === r.id)) glued.push({ key: roleKey('A', r.id), a: r.id, b: J.get(r.id) ?? null, origin: J.has(r.id) ? 'both' : 'A' });
  for (const r of B.roles) if (!inv.has(r.id) && !glued.some((g) => g.b === r.id)) glued.push({ key: roleKey('B', r.id), a: null, b: r.id, origin: 'B' });
  const words: GluedWord[] = [];
  for (const s of A.signature) if (!words.some((w) => w.a === s.type)) words.push({ key: wordKey('A', s.type), a: s.type, b: tauRel.get(s.type) ?? null, origin: tauRel.has(s.type) ? 'both' : 'A' });
  for (const s of B.signature) if (!tauRelInv.has(s.type) && !words.some((w) => w.b === s.type)) words.push({ key: wordKey('B', s.type), a: null, b: s.type, origin: 'B' });
  const tupleList: GluedTuple[] = [...tuples.values()].map((t) => ({ word: t.word, terms: t.terms, value: t.value, origin: t.origin.size === 2 ? 'both' : ([...t.origin][0] as Side) }));
  const markList: GluedMark[] = [...marks.values()].map((m) => ({ type: m.type, role: m.role, value: m.value, witnesses: [...m.witnesses].sort() as Side[] }));
  const both = tupleList.filter((t) => t.origin === 'both').length;
  return {
    refused: false,
    midpoint: {
      roles: glued,
      words,
      tuples: tupleList,
      marks: markList,
      pairs: [...J.entries()],
      tau: shared.given.map(([x, y]) => [x, y] as [string, string]),
      counts: { roles: glued.length, words: words.length, tuples: tupleList.length, both, marks: markList.length },
      core: { roles: J.size, tuples: both, marks: markList.filter((m) => m.witnesses.length === 2).length },
      originOf,
    },
  };
}

/** the glued space drawn as ONE cast, with the origin of every role, word and tuple beside it (the colouring's key) */
export interface GluedSpace {
  space: ConceptSpace;
  roleOrigin: Map<string, Origin>; // by the space's role id (the glued key)
  wordOrigin: Map<string, Origin>; // by the space's signature type (the display word)
  tupleOrigin: Map<string, Origin>; // by `type|terms` of the space's relations
  wordName: Map<string, string>; // C-8: by a glued word's key, the display word it became — the resolver composes seed content down through it
}

/**
 * THE MAPPED MIDPOINT'S OWN SPACE — the amalgam as a ConceptSpace: roles in the order `glue` emits (A's in the caster's
 * order, then B's unglued ones), each labelled by the casters' words (`F5 ≡ Φ7` for a glued pair — the `≡` is the
 * person's act), the marks as `types`; the words as the signature — a translated pair ONE word `s ≡ t`, a foreign word
 * plain, and a foreign word spelled alike on both sides kept apart as `w [A]` / `w [B]` (two words, never merged by
 * spelling); the tuples as relations. The origin of everything rides beside it for the colouring.
 */
export function gluedSpace(A: ConceptSpace, B: ConceptSpace, M: Midpoint): GluedSpace {
  const labelIn = (space: ConceptSpace, id: string): string => {
    const r = space.roles.find((x) => x.id === id);
    return r && r.label && r.label.length ? r.label : id;
  };
  const arityIn = (space: ConceptSpace, name: string): number | undefined => space.signature.find((s) => s.type === name)?.arity;
  const roleOrigin = new Map<string, Origin>();
  const roles = M.roles.map((r) => {
    roleOrigin.set(r.key, r.origin);
    const label = r.origin === 'both' ? `${labelIn(A, r.a as string)} ≡ ${labelIn(B, r.b as string)}` : r.a !== null ? labelIn(A, r.a) : labelIn(B, r.b as string);
    const types: Record<string, string> = {};
    for (const m of M.marks) if (m.role === r.key) types[m.type.startsWith('A:') || m.type.startsWith('B:') ? m.type.slice(2) : m.type] = m.value;
    return Object.keys(types).length ? { id: r.key, label, types } : { id: r.key, label };
  });
  // the display word for each glued word key
  const alike = new Set<string>();
  const seenA = new Set(M.words.filter((w) => w.origin === 'A').map((w) => w.a as string));
  for (const w of M.words) if (w.origin === 'B' && seenA.has(w.b as string)) alike.add(w.b as string);
  const display = new Map<string, string>();
  const wordOrigin = new Map<string, Origin>();
  const signature: ConceptSpace['signature'] = [];
  for (const w of M.words) {
    const name = w.origin === 'both' ? `${w.a as string} ≡ ${w.b as string}` : w.origin === 'A' ? (alike.has(w.a as string) ? `${w.a as string} [A]` : (w.a as string)) : alike.has(w.b as string) ? `${w.b as string} [B]` : (w.b as string);
    display.set(w.key, name);
    wordOrigin.set(name, w.origin);
    const arity = w.a !== null ? arityIn(A, w.a) : arityIn(B, w.b as string);
    signature.push({ type: name, arity: arity ?? 2 });
  }
  const tupleOrigin = new Map<string, Origin>();
  const relations: ConceptSpace['relations'] = M.tuples.map((t) => {
    const type = display.get(t.word) ?? t.word;
    tupleOrigin.set(`${type}|${JSON.stringify(t.terms)}`, t.origin);
    return { type, terms: [...t.terms], polarity: t.value };
  });
  return { space: { roles, signature, relations, axioms: [] }, roleOrigin, wordOrigin, tupleOrigin, wordName: display };
}

export interface RoleTrace {
  key: string;
  a: string;
  b: string;
  about: number; // relation tuples about the glued role
  both: number;
  fromA: number;
  fromB: number;
  mark: { type: string; value: string; witnesses: Side[] } | null; // the mold's value on the glued role, with its witnesses
}

export interface ParentTrace {
  side: Side;
  roles: number; // the parent's roles
  unmatched: number; // roles that met no partner
  onUnmatched: number; // tuples with a term that met no partner
  untranslatedOnMapped: number; // tuples on mapped roles in words τ does not translate
  exposed: number; // tuples in translated words on mapped roles the other side has UNRECORDED
}

export interface Trace {
  glued: RoleTrace[];
  parents: [ParentTrace, ParentTrace];
}

/** THE TRACE — the origin partition of the one glued record: what now sits on one role; what each parent still holds alone. */
export function traceOf(A: ConceptSpace, B: ConceptSpace, M: Midpoint): Trace {
  const glued: RoleTrace[] = M.roles
    .filter((r) => r.origin === 'both')
    .map((r) => {
      const about = M.tuples.filter((t) => t.terms.includes(r.key));
      const mark = M.marks.find((m) => m.role === r.key && isMoldType(m.type)) ?? null;
      return {
        key: r.key,
        a: r.a as string,
        b: r.b as string,
        about: about.length,
        both: about.filter((t) => t.origin === 'both').length,
        fromA: about.filter((t) => t.origin === 'A').length,
        fromB: about.filter((t) => t.origin === 'B').length,
        mark: mark ? { type: mark.type, value: mark.value, witnesses: mark.witnesses } : null,
      };
    });
  const J = new Map(M.pairs);
  const inv = new Map(M.pairs.map(([x, y]) => [y, x] as [string, string]));
  const tauRel = new Map<string, string>();
  const tauRelInv = new Map<string, string>();
  const arityA = new Map(A.signature.map((s) => [s.type, s.arity] as const));
  for (const [s, t] of M.tau) {
    if ((arityA.get(s) ?? 1) >= 2) {
      tauRel.set(s, t);
      tauRelInv.set(t, s);
    }
  }
  const known = (space: ConceptSpace): Map<string, Polarity> => {
    const m = new Map<string, Polarity>();
    for (const r of space.relations) if (!m.has(tupleKey(r.type, r.terms))) m.set(tupleKey(r.type, r.terms), r.polarity);
    return m;
  };
  const knownA = known(A);
  const knownB = known(B);
  const parent = (side: Side): ParentTrace => {
    const space = side === 'A' ? A : B;
    const map = side === 'A' ? J : inv;
    const words = side === 'A' ? tauRel : tauRelInv;
    const other = side === 'A' ? knownB : knownA;
    let onUnmatched = 0;
    let untranslatedOnMapped = 0;
    let exposed = 0;
    const seen = new Set<string>();
    for (const r of space.relations) {
      const own = tupleKey(r.type, r.terms);
      if (seen.has(own)) continue;
      seen.add(own);
      if (r.terms.some((x) => !map.has(x))) {
        onUnmatched += 1;
        continue;
      }
      const t = words.get(r.type);
      if (t === undefined) {
        untranslatedOnMapped += 1;
        continue;
      }
      if (!other.has(tupleKey(t, r.terms.map((x) => map.get(x) as string)))) exposed += 1;
    }
    const roles = new Set(space.roles.map((r) => r.id));
    return { side, roles: roles.size, unmatched: [...roles].filter((x) => !map.has(x)).length, onUnmatched, untranslatedOnMapped, exposed };
  };
  return { glued, parents: [parent('A'), parent('B')] };
}

// ═══ THE J REGISTER'S QUANTITIES — `STAMP C-6d (α)`, 2026-09-19: computed on
// the TYPE, no surface, no store action, no written J. NOT_FROZEN while only
// witnesses and (later) components import it.
//
// THE SECOND IMPLEMENTATION. The researcher's instrument
// (.handoff/instruments/connection_layer_reference/j_register_quantities.py)
// defines these quantities and sealed their numbers on the landed fixtures; this
// module re-implements them INDEPENDENTLY on `ConceptSpace` / `EdgeIdentification`
// — the ADR 0031 kill-condition pattern: a disagreement between the two
// implementations reopens the DEFINITION, never tunes the code to the number.
//
// THE DEFINITIONS (the ruling `.handoff/RULING_THE-J-REGISTERS-QUANTITIES-ON-THE-TYPE_…`
// and the mothership's 1621 + 1641):
//   the record of a cast   the KNOWN tuples of both homes as one map — (σ, terms) ↦
//                          polarity from `relations`, and each role's categorical
//                          unary keys (K, [x]) ↦ value from `roles[].types`; UNKNOWN
//                          and absence are unrecorded.
//   shared signature       by NAME with the same arity, plus unary keys on roles of
//                          both; a name with two arities across the casts is NOT
//                          shared — named, never refused; names translated by the
//                          person's τ (`EdgeIdentification.types`, arity-preserving)
//                          count as shared under τ.
//   candidate              a partial injection j of X's roles into Y's with NO KNOWN
//                          CONFLICT (a tuple over dom j known on both sides has the
//                          same value) and weight > 0. J = ∅ is not a candidate.
//   agreement · weight     a tuple over dom j in a shared type known on BOTH sides
//                          with the SAME value — does-not-hold = does-not-hold IS an
//                          agreement; a shared unary VALUE is an agreement. Weight =
//                          agreements. Support of a pair = agreements whose X-tuple
//                          contains it.
//   exposure · unrecorded  known on exactly one side · Σ|dom j|^arity − agreements −
//                          exposure over the shared signature. The opposite value is
//                          a CONFLICT, which a candidate does not have by definition.
//   OFFER (clause 2 as AMENDED, the researcher's 1632): a maximal conflict-free
//                          candidate whose EVERY pair is SUPPORTED — takes part in at
//                          least one agreement — extended until no further supported
//                          pair can be added without a conflict. SIZE FOLLOWS FROM
//                          SUPPORT, never from |X| or |Y|. An unsupported conflict-free
//                          pair is NEVER in an offer (it is the person's extension).
//                          Offers are ordered by WEIGHT.
//   Aut(X)                 permutations of X's roles preserving the WHOLE record
//                          exactly, on the full signature. Two offers are ONE READING
//                          iff j' = β∘j∘α⁻¹ (α ∈ Aut X, β ∈ Aut Y) — a gauge orbit;
//                          the count the register prints is ORBITS.
//   the empty core         (a) no type shared by name; (b) shared types and every
//                          conflict-free injection of weight 0.
// RECORD, NOT READING: `EdgeIdentification.roles` and `.types` are the inputs;
// `support` and `fiat` are DERIVED — re-derived at every read, never read back.
// THE BUDGET is a node count, and a pair beyond it returns that in words — a
// limit found at pick-time costs one pick (never after the person has waited).

import type { ConceptSpace, EdgeIdentification } from '../types/geometry';

export interface CastRecord {
  roles: string[];
  arityOf: Map<string, number>; // the signature's types
  unary: Set<string>; // the categorical keys declared on roles (the second home)
  known: Map<string, string>; // key(type, terms) ↦ the value
  knownList: Array<{ type: string; terms: string[]; value: string }>;
}

const key = (type: string, terms: string[]): string => `${type}|${JSON.stringify(terms)}`;

/** the KNOWN tuples of both homes, as one record */
export function recordOf(space: ConceptSpace): CastRecord {
  const roles: string[] = [];
  const seen = new Set<string>();
  for (const r of space.roles) if (!seen.has(r.id)) { seen.add(r.id); roles.push(r.id); }
  const arityOf = new Map<string, number>();
  for (const s of space.signature) if (!arityOf.has(s.type)) arityOf.set(s.type, s.arity);
  const known = new Map<string, string>();
  const knownList: CastRecord['knownList'] = [];
  for (const r of space.relations) {
    const k = key(r.type, r.terms);
    if (!known.has(k)) { known.set(k, r.polarity); knownList.push({ type: r.type, terms: [...r.terms], value: r.polarity }); }
  }
  const unary = new Set<string>();
  for (const role of space.roles) {
    for (const [k, v] of Object.entries(role.types ?? {})) {
      unary.add(k);
      if (v === 'UNKNOWN') continue;
      const kk = key(k, [role.id]);
      if (!known.has(kk)) { known.set(kk, v); knownList.push({ type: k, terms: [role.id], value: v }); }
    }
  }
  return { roles, arityOf, unary, known, knownList };
}

export interface SharedSignature {
  /** X's type-name ↦ Y's type-name, with the arity, for every shared type (identity by name, or the person's τ) */
  types: Map<string, { yName: string; arity: number }>;
  unary: string[]; // the categorical keys on roles of both
  notSame: string[]; // names present in both with DIFFERENT arities — named, never shared
}

/** the shared signature: by name with the same arity, plus the person's τ (arity-preserving), plus unary keys on both */
export function sharedSignature(X: CastRecord, Y: CastRecord, tau?: EdgeIdentification['types']): SharedSignature {
  const types = new Map<string, { yName: string; arity: number }>();
  const notSame: string[] = [];
  for (const [name, arity] of X.arityOf) {
    const yArity = Y.arityOf.get(name);
    if (yArity === undefined) continue;
    if (yArity === arity) types.set(name, { yName: name, arity });
    else notSame.push(name);
  }
  for (const [xName, yName] of tau ?? []) {
    const a = X.arityOf.get(xName);
    const b = Y.arityOf.get(yName);
    if (a !== undefined && b !== undefined && a === b) types.set(xName, { yName, arity: a });
    else if (a !== undefined && b !== undefined) notSame.push(`${xName}↦${yName}`);
  }
  const unary = [...X.unary].filter((k) => Y.unary.has(k));
  return { types, unary, notSame };
}

export interface Evaluation {
  agreements: number;
  exposure: number;
  unrecorded: number;
  support: Record<string, number>; // per X-role in dom j
}

const yTypeOf = (shared: SharedSignature, xType: string): { yName: string; arity: number } | null => {
  const t = shared.types.get(xType);
  if (t) return t;
  if (shared.unary.includes(xType)) return { yName: xType, arity: 1 };
  return null;
};

/** agreements · exposure · unrecorded · support over dom j — null on a KNOWN CONFLICT (then j is no candidate) */
export function evaluate(X: CastRecord, Y: CastRecord, j: Map<string, string>, shared: SharedSignature): Evaluation | null {
  const dom = new Set(j.keys());
  const img = new Set(j.values());
  const jInv = new Map<string, string>();
  for (const [x, y] of j) jInv.set(y, x);
  let agreements = 0;
  let exposure = 0;
  const support: Record<string, number> = {};
  for (const x of dom) support[x] = 0;
  for (const t of X.knownList) {
    const yt = yTypeOf(shared, t.type);
    if (!yt || !t.terms.every((r) => dom.has(r))) continue;
    const vy = Y.known.get(key(yt.yName, t.terms.map((r) => j.get(r) as string)));
    if (vy === undefined) exposure += 1;
    else if (vy !== t.value) return null;
    else {
      agreements += 1;
      for (const r of new Set(t.terms)) support[r] += 1;
    }
  }
  // Y-known tuples over im j whose X-preimage is unrecorded
  const xNameOf = new Map<string, string>();
  for (const [xName, t] of shared.types) xNameOf.set(t.yName, xName);
  for (const k of shared.unary) xNameOf.set(k, k);
  for (const t of Y.knownList) {
    const xName = xNameOf.get(t.type);
    if (xName === undefined || !t.terms.every((r) => img.has(r))) continue;
    if (!X.known.has(key(xName, t.terms.map((r) => jInv.get(r) as string)))) exposure += 1;
  }
  let total = 0;
  for (const t of shared.types.values()) total += dom.size ** t.arity;
  total += shared.unary.length * dom.size;
  return { agreements, exposure, unrecorded: total - agreements - exposure, support };
}

/** Aut(X): every permutation of X's roles preserving the WHOLE record exactly (backtracking, pruned on the first broken tuple) */
export function automorphisms(X: CastRecord, nodeBudget = 5_000_000): { list: Array<Map<string, string>>; nodes: number; complete: boolean } {
  const roles = X.roles;
  const list: Array<Map<string, string>> = [];
  const used = new Set<string>();
  const s = new Map<string, string>();
  let nodes = 0;
  let complete = true;
  const consistentSoFar = (): boolean => {
    for (const t of X.knownList) {
      if (!t.terms.every((r) => s.has(r))) continue;
      if (X.known.get(key(t.type, t.terms.map((r) => s.get(r) as string))) !== t.value) return false;
    }
    return true;
  };
  const rec = (i: number): void => {
    if (!complete) return;
    if (i === roles.length) { list.push(new Map(s)); return; }
    for (const y of roles) {
      if (used.has(y)) continue;
      nodes += 1;
      if (nodes > nodeBudget) { complete = false; return; }
      s.set(roles[i], y);
      used.add(y);
      if (consistentSoFar()) rec(i + 1);
      used.delete(y);
      s.delete(roles[i]);
    }
  };
  rec(0);
  return { list, nodes, complete };
}

export interface Offer {
  pairs: Array<[string, string]>;
  weight: number;
  exposure: number;
  unrecorded: number;
  support: Record<string, number>;
}

export type RegisterReading =
  | { state: 'empty core (a)'; sentence: string; notSame: string[] }
  | { state: 'empty core (b)'; sentence: string; shared: string[]; notSame: string[]; consistentFull: number | null; nodes: number }
  | { state: 'beyond the budget'; sentence: string; nodes: number; budget: number }
  | {
      state: 'offers';
      shared: string[];
      sharedUnary: string[];
      notSame: string[];
      offers: Offer[]; // ordered by weight, descending
      topWeight: number;
      tied: number; // offers at the top weight
      orbits: number; // gauge orbits among the tied (Aut X × Aut Y)
      aut: [number, number];
      autComplete: boolean;
      consistentFull: number | null; // conflict-free injections of size min(|X|,|Y|) — null when beyond the budget
      nodes: number;
      millis: number;
    };

/** gauge orbits among offers: two are ONE READING iff j' = β ∘ j ∘ α⁻¹ (α ∈ Aut X, β ∈ Aut Y) */
export function gaugeOrbits(offers: Offer[], autX: Array<Map<string, string>>, autY: Array<Map<string, string>>): number {
  const seen = new Set<string>();
  let orbits = 0;
  for (const o of offers) {
    const k = JSON.stringify(o.pairs);
    if (seen.has(k)) continue;
    orbits += 1;
    for (const alpha of autX) {
      for (const beta of autY) {
        const moved = o.pairs.map(([x, y]) => [alpha.get(x) as string, beta.get(y) as string] as [string, string]).sort((a, b) => (a[0] < b[0] ? -1 : 1));
        seen.add(JSON.stringify(moved));
      }
    }
  }
  return orbits;
}

/**
 * THE OFFERS on X × Y (clause 2 as amended): maximal conflict-free candidates whose every pair is supported,
 * found by a branch-and-bound over partial injections (each X-role mapped or left out), the bound being the
 * agreements so far plus the X-known shared tuples that could still agree; every leaf is reduced to its supported
 * core, checked for maximality, and kept if its weight reaches the best seen. `consistentFull` counts the
 * conflict-free injections of size min(|X|, |Y|) separately (the researcher's enumeration, for the seal).
 */
export interface RegisterOptions {
  /** keep every maximal supported core at every weight (the printed distribution) instead of the top weight alone */
  keepAll?: boolean;
}

export function registerReading(spaceX: ConceptSpace, spaceY: ConceptSpace, tau?: EdgeIdentification['types'], nodeBudget = 5_000_000, options: RegisterOptions = {}): RegisterReading {
  const keepAll = options.keepAll === true;
  const started = Date.now();
  const X = recordOf(spaceX);
  const Y = recordOf(spaceY);
  const shared = sharedSignature(X, Y, tau);
  if (shared.types.size === 0 && shared.unary.length === 0) {
    return { state: 'empty core (a)', sentence: 'no relation-type in common — a translation is yours to give', notSame: shared.notSame };
  }
  // THE SEARCH is TUPLE-DRIVEN: an offer's pairs all come from agreements, so the
  // candidates are built by mapping X's known shared tuples to Y's known tuples
  // of the same type and value (or leaving a tuple out), never by pairing roles
  // blindly — the branching is the handful of Y tuples per type, and a tuple that
  // can no longer match prunes at once. Every pair is supported BY CONSTRUCTION;
  // the leaf is re-evaluated whole (tuples left out may agree anyway) and checked
  // for maximality; the bound is the agreements so far plus the tuples not yet
  // decided.
  const xTuples = X.knownList.filter((tt) => yTypeOf(shared, tt.type));
  const yByTypeValue = new Map<string, Array<string[]>>();
  for (const u of Y.knownList) {
    const k = `${u.type}|${u.value}`;
    const arr = yByTypeValue.get(k);
    if (arr) arr.push(u.terms);
    else yByTypeValue.set(k, [u.terms]);
  }
  const j = new Map<string, string>();
  const usedY = new Set<string>();
  let nodes = 0;
  let overBudget = false;
  let best = 0;
  const cores = new Map<string, Offer>(); // by the pairs' canonical key
  const conflictOn = (pairsJustAdded: string[]): boolean => {
    // a KNOWN CONFLICT among the X tuples completed by these pairs: the Y image known with a different value
    for (const tt of xTuples) {
      if (!tt.terms.some((r) => pairsJustAdded.includes(r))) continue;
      if (!tt.terms.every((r) => j.has(r))) continue;
      const yt = yTypeOf(shared, tt.type) as { yName: string; arity: number };
      const vy = Y.known.get(key(yt.yName, tt.terms.map((r) => j.get(r) as string)));
      if (vy !== undefined && vy !== tt.value) return true;
    }
    return false;
  };
  const leaf = (): void => {
    if (j.size === 0) return;
    const ev = evaluate(X, Y, j, shared);
    if (!ev || ev.agreements === 0) return;
    // the supported core (every pair here came from an agreement; the evaluation confirms it)
    const core = new Map<string, string>();
    for (const [x, y] of j) if ((ev.support[x] ?? 0) > 0) core.set(x, y);
    if (core.size === 0) return;
    const coreEv = core.size === j.size ? ev : evaluate(X, Y, core, shared);
    if (!coreEv || (!keepAll && coreEv.agreements < best)) return;
    // maximality: no supported pair can be added without a conflict
    const coreImg = new Set(core.values());
    for (const x of X.roles) {
      if (core.has(x)) continue;
      for (const y of Y.roles) {
        if (coreImg.has(y)) continue;
        core.set(x, y);
        const ext = evaluate(X, Y, core, shared);
        core.delete(x);
        if (ext && ext.agreements > coreEv.agreements && (ext.support[x] ?? 0) > 0) return; // extendable — not maximal
      }
    }
    const pairs = [...core.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)) as Array<[string, string]>;
    const k = JSON.stringify(pairs);
    if (cores.has(k)) return;
    if (coreEv.agreements > best) {
      best = coreEv.agreements;
      if (!keepAll) for (const [kk, o] of cores) if (o.weight < best) cores.delete(kk);
    }
    cores.set(k, { pairs, weight: coreEv.agreements, exposure: coreEv.exposure, unrecorded: coreEv.unrecorded, support: coreEv.support });
  };
  const rec = (i: number, agreements: number): void => {
    if (overBudget) return;
    nodes += 1;
    if (nodes > nodeBudget) { overBudget = true; return; }
    if (!keepAll && agreements + (xTuples.length - i) < best) return; // the bound: every remaining tuple could add one
    if (i === xTuples.length) { leaf(); return; }
    const tt = xTuples[i];
    const yt = yTypeOf(shared, tt.type) as { yName: string; arity: number };
    // option A: map this tuple onto a Y tuple of the same type and value
    for (const u of yByTypeValue.get(`${yt.yName}|${tt.value}`) ?? []) {
      const added: string[] = [];
      let ok = true;
      const local = new Map<string, string>();
      for (let p = 0; p < tt.terms.length && ok; p += 1) {
        const x = tt.terms[p];
        const y = u[p];
        const have = j.get(x) ?? local.get(x);
        if (have !== undefined) { if (have !== y) ok = false; continue; }
        if (usedY.has(y) || [...local.values()].includes(y)) { ok = false; continue; }
        local.set(x, y);
      }
      if (!ok) continue;
      for (const [x, y] of local) { j.set(x, y); usedY.add(y); added.push(x); }
      if (!conflictOn(added)) rec(i + 1, agreements + 1);
      for (const x of added) { usedY.delete(j.get(x) as string); j.delete(x); }
      if (overBudget) return;
    }
    // option B: leave this tuple out (it becomes exposure or unrecorded, or agrees by other pairs anyway)
    rec(i + 1, agreements);
  };
  rec(0, 0);
  if (overBudget) {
    return { state: 'beyond the budget', sentence: `this pair is beyond the register's budget (${nodeBudget} nodes) — nothing offered; the count is not known`, nodes, budget: nodeBudget };
  }
  // the conflict-free injections of full size — the researcher's enumeration, counted separately for the seal
  let consistentFull: number | null = 0;
  {
    const k = Math.min(X.roles.length, Y.roles.length);
    const jj = new Map<string, string>();
    const used = new Set<string>();
    let n = 0;
    let over = false;
    const okSoFar = (): boolean => {
      for (const t of xTuples) {
        if (!t.terms.every((r) => jj.has(r))) continue;
        const yt = yTypeOf(shared, t.type) as { yName: string; arity: number };
        const vy = Y.known.get(key(yt.yName, t.terms.map((r) => jj.get(r) as string)));
        if (vy !== undefined && vy !== t.value) return false;
      }
      return true;
    };
    const chooseX = (start: number, picked: number, ds: string[]): void => {
      if (over) return;
      if (picked === k) { fill(ds, 0); return; }
      for (let i = start; i <= X.roles.length - (k - picked); i += 1) chooseX(i + 1, picked + 1, [...ds, X.roles[i]]);
    };
    const fullBudget = nodeBudget * 4;
    const fill = (ds: string[], i: number): void => {
      if (over) return;
      n += 1;
      if (n > fullBudget) { over = true; return; }
      if (i === ds.length) { consistentFull = (consistentFull as number) + 1; return; }
      for (const y of Y.roles) {
        if (used.has(y)) continue;
        jj.set(ds[i], y);
        used.add(y);
        if (okSoFar()) fill(ds, i + 1);
        used.delete(y);
        jj.delete(ds[i]);
      }
    };
    chooseX(0, 0, []);
    nodes += n;
    if (over) consistentFull = null;
  }
  if (best === 0) {
    return { state: 'empty core (b)', sentence: 'no relation to agree on', shared: [...shared.types.keys()], notSame: shared.notSame, consistentFull, nodes };
  }
  const offers = [...cores.values()].sort((a, b) => b.weight - a.weight);
  const autX = automorphisms(X, nodeBudget);
  const autY = automorphisms(Y, nodeBudget);
  const top = offers.filter((o) => o.weight === best);
  const orbits = gaugeOrbits(top, autX.list, autY.list);
  return {
    state: 'offers',
    shared: [...shared.types.keys()],
    sharedUnary: shared.unary,
    notSame: shared.notSame,
    offers,
    topWeight: best,
    tied: top.length,
    orbits,
    aut: [autX.list.length, autY.list.length],
    autComplete: autX.complete && autY.complete,
    consistentFull,
    nodes,
    millis: Date.now() - started,
  };
}

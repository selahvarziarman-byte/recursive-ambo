// ═══ THE J REGISTER'S QUANTITIES — `STAMP C-6d (α)`, 2026-09-19, with the two
// MARKERs on it (the mothership's 1835 and 2030, the researcher's own corrections)
// and the ratio fix (2310 §0): computed on the TYPE. NOT_FROZEN while only
// witnesses and components import it.
//
// THE SECOND IMPLEMENTATION. The researcher's instruments
// (.handoff/instruments/connection_layer_reference/j_register_quantities.py ·
// offers_count.py · flow_phi_offers_under_tau.py) define these quantities and
// sealed their numbers on the landed fixtures; this module re-implements them
// INDEPENDENTLY on `ConceptSpace` / `EdgeIdentification` — the ADR 0031
// kill-condition pattern: a disagreement between the two implementations reopens
// the DEFINITION, never tunes the code to the number. (It bit once, on the third
// pair: the unary home supported every pair and 3,104,904 offers followed —
// the definition was corrected, this code followed it.)
//
// THE DEFINITIONS (the ruling `.handoff/RULING_THE-J-REGISTERS-QUANTITIES-ON-THE-TYPE_…`,
// the mothership's 1621 + 1641, and the MARKERs 1835 (support) + 2030 (weight)):
//   the record of a cast   the KNOWN tuples of both homes as one map — (σ, terms) ↦
//                          polarity from `relations`, and each role's categorical
//                          unary keys (K, [x]) ↦ value from `roles[].types`; UNKNOWN
//                          and absence are unrecorded.
//   shared signature       RELATIONAL types (arity ≥ 2) by NAME with the same arity,
//                          plus the person's τ (`EdgeIdentification.types`,
//                          arity-preserving — a unary key is a type of arity 1 in
//                          the roles' home, so τ may translate one to one); the
//                          unary keys on roles of both, by name or by τ. A name with
//                          two arities across the casts is NOT shared — named,
//                          never refused.
//   candidate              a partial injection j of X's roles into Y's with NO KNOWN
//                          CONFLICT — relational OR unary (a tuple over dom j known on
//                          both sides has the same value) — and weight > 0.
//   WEIGHT                 = the RELATIONAL agreements (arity ≥ 2) — a tuple over dom j
//                          in a shared relational type known on BOTH sides with the
//                          SAME value; does-not-hold = does-not-hold IS one.
//   SUPPORT of a pair      = the relational agreements whose X-tuple contains the
//                          pair's role — structure BETWEEN identified roles.
//   THE UNARY HOME         REFUSES on conflict (the first face's member-status
//                          refusal) and is PRINTED as its own two counts —
//                          `types: a agree · u unknown` (three-valued: agree ·
//                          refuse · unknown; a refusing type kills the pair, so on
//                          an offer only agree/unknown are reachable) — never summed
//                          into the weight, never supporting a pair. (A value every
//                          role shares backs every pair equally, i.e. backs none.)
//   exposure · unrecorded  known on exactly one side · the arithmetic remainder of
//                          Σ|dom j|^arity over the shared signature INCLUDING the
//                          unary types, minus every agreement and every exposure.
//   OFFER (clause 2 as AMENDED, the researcher's 1632): a maximal conflict-free
//                          candidate whose EVERY pair is SUPPORTED — takes part in at
//                          least one relational agreement — extended until no further
//                          supported pair can be added without a conflict. SIZE
//                          FOLLOWS FROM SUPPORT, never from |X| or |Y|. Offers are
//                          ordered by WEIGHT.
//   Aut(X)                 permutations of X's roles preserving the WHOLE record
//                          exactly, on the full signature (both homes). Two offers are
//                          ONE READING iff j' = β∘j∘α⁻¹ (α ∈ Aut X, β ∈ Aut Y) — a
//                          gauge orbit; the count the register prints is ORBITS, and
//                          the surface groups the offers by orbit within weight.
//   the empty core         (a) no RELATIONAL type shared — by name or by τ (unary keys
//                          alone cannot make a core: they support nothing); (b) shared
//                          relational types and every conflict-free injection of
//                          weight 0.
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

/** the arity a cast declares for a name: the signature's, or 1 for a categorical key on its roles */
export function arityIn(record: CastRecord, name: string): number | undefined {
  const a = record.arityOf.get(name);
  if (a !== undefined) return a;
  return record.unary.has(name) ? 1 : undefined;
}

export interface SharedSignature {
  /** X's relational type-name ↦ Y's type-name, with the arity (≥ 2), for every shared relational type — by name, or by the person's τ */
  types: Map<string, { yName: string; arity: number }>;
  byName: string[]; // relational types shared by name (same arity)
  underTau: Array<[string, string]>; // relational types shared by the person's τ
  unary: Map<string, string>; // X's categorical key ↦ Y's — by name, or by τ at arity 1
  notSame: string[]; // names present in both with DIFFERENT arities (or a τ pair across arities) — named, never shared
  unknownNames: Array<[string, string]>; // τ pairs naming a type one cast does not declare — named, never shared
}

/** the shared signature: relational types by name with the same arity, plus the person's τ (arity-preserving, unary keys included at arity 1), plus unary keys on both */
export function sharedSignature(X: CastRecord, Y: CastRecord, tau?: EdgeIdentification['types']): SharedSignature {
  const types = new Map<string, { yName: string; arity: number }>();
  const byName: string[] = [];
  const underTau: Array<[string, string]> = [];
  const unary = new Map<string, string>();
  const notSame: string[] = [];
  const unknownNames: Array<[string, string]> = [];
  for (const [name, arity] of X.arityOf) {
    const yArity = Y.arityOf.get(name);
    if (yArity === undefined) continue;
    if (yArity === arity && arity >= 2) { types.set(name, { yName: name, arity }); byName.push(name); }
    else if (yArity !== arity) notSame.push(name);
  }
  for (const [xName, yName] of tau ?? []) {
    const a = arityIn(X, xName);
    const b = arityIn(Y, yName);
    if (a === undefined || b === undefined) { unknownNames.push([xName, yName]); continue; }
    if (a !== b) { notSame.push(`${xName}↦${yName}`); continue; }
    if (a >= 2) { types.set(xName, { yName, arity: a }); underTau.push([xName, yName]); }
    else unary.set(xName, yName);
  }
  for (const k of X.unary) if (Y.unary.has(k) && !unary.has(k)) unary.set(k, k);
  return { types, byName, underTau, unary, notSame, unknownNames };
}

/** a KNOWN CONFLICT, by name: the same tuple known on both sides with different values */
export interface Conflict {
  arity: number;
  type: string; // X's name
  yType: string; // Y's name (the same, or τ's)
  xTerms: string[];
  xValue: string;
  yTerms: string[];
  yValue: string;
}

/** the conflict in words — arity ≥ 2: `r(x, y) holds here · s(a, b) does-not-hold there`; arity 1: `K: x has · K': y none-by-nature` */
export function describeConflict(c: Conflict): string {
  if (c.arity === 1) {
    const yKey = c.yType === c.type ? '' : `${c.yType}: `;
    return `${c.type}: ${c.xTerms[0]} ${c.xValue} · ${yKey}${c.yTerms[0]} ${c.yValue}`;
  }
  return `${c.type}(${c.xTerms.join(', ')}) ${c.xValue} here · ${c.yType}(${c.yTerms.join(', ')}) ${c.yValue} there`;
}

export interface Assessment {
  relational: number; // the WEIGHT — relational agreements (arity ≥ 2)
  typesAgree: number; // unary agreements over dom j
  typesUnknown: number; // unary cells over dom j that agree on nothing and refuse on nothing (one or both sides unknown)
  exposure: number; // known on exactly one side, over the shared signature including the unary types
  unrecorded: number; // the arithmetic remainder
  support: Record<string, number>; // per X-role in dom j — relational agreements only
  conflicts: Conflict[]; // every known conflict, relational and unary, by name — empty on a candidate
}

export type Evaluation = Assessment;

/** every count over dom j, and every conflict by name — never null; the person's own pairs are assessed with this */
export function assess(X: CastRecord, Y: CastRecord, j: Map<string, string>, shared: SharedSignature): Assessment {
  const dom = new Set(j.keys());
  const img = new Set(j.values());
  const jInv = new Map<string, string>();
  for (const [x, y] of j) jInv.set(y, x);
  let relational = 0;
  let typesAgree = 0;
  let exposure = 0;
  const support: Record<string, number> = {};
  for (const x of dom) support[x] = 0;
  const conflicts: Conflict[] = [];
  for (const t of X.knownList) {
    if (!t.terms.every((r) => dom.has(r))) continue;
    const rel = shared.types.get(t.type);
    const un = rel ? undefined : shared.unary.get(t.type);
    if (!rel && un === undefined) continue;
    const yName = rel ? rel.yName : (un as string);
    const yTerms = t.terms.map((r) => j.get(r) as string);
    const vy = Y.known.get(key(yName, yTerms));
    if (vy === undefined) exposure += 1;
    else if (vy !== t.value) conflicts.push({ arity: rel ? rel.arity : 1, type: t.type, yType: yName, xTerms: [...t.terms], xValue: t.value, yTerms, yValue: vy });
    else if (rel) {
      relational += 1;
      for (const r of new Set(t.terms)) support[r] += 1;
    } else typesAgree += 1;
  }
  // Y-known tuples over im j whose X-preimage is unrecorded
  const xNameOf = new Map<string, string>();
  for (const [xName, t] of shared.types) xNameOf.set(t.yName, xName);
  for (const [xKey, yKey] of shared.unary) xNameOf.set(yKey, xKey);
  for (const t of Y.knownList) {
    const xName = xNameOf.get(t.type);
    if (xName === undefined || !t.terms.every((r) => img.has(r))) continue;
    if (!X.known.has(key(xName, t.terms.map((r) => jInv.get(r) as string)))) exposure += 1;
  }
  let total = 0;
  for (const t of shared.types.values()) total += dom.size ** t.arity;
  const unaryCells = shared.unary.size * dom.size;
  total += unaryCells;
  const unaryConflicts = conflicts.filter((c) => c.arity === 1).length;
  return {
    relational,
    typesAgree,
    typesUnknown: unaryCells - typesAgree - unaryConflicts,
    exposure,
    unrecorded: total - relational - typesAgree - exposure - conflicts.length,
    support,
    conflicts,
  };
}

/** the assessment of a CANDIDATE — null on any KNOWN CONFLICT (then j is no candidate) */
export function evaluate(X: CastRecord, Y: CastRecord, j: Map<string, string>, shared: SharedSignature): Evaluation | null {
  const a = assess(X, Y, j, shared);
  return a.conflicts.length ? null : a;
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
  weight: number; // relational agreements
  typesAgree: number;
  typesUnknown: number;
  exposure: number;
  unrecorded: number;
  support: Record<string, number>;
}

/** the offers of one weight, partitioned into READINGS (gauge orbits) */
export interface WeightReadings {
  weight: number;
  groups: Offer[][]; // one group per orbit; within a group the offers differ only by symmetry
}

export type RegisterReading =
  | { state: 'empty core (a)'; sentence: string; notSame: string[]; unknownNames: Array<[string, string]>; sharedUnary: string[] }
  | { state: 'empty core (b)'; sentence: string; shared: string[]; notSame: string[]; unknownNames: Array<[string, string]>; consistentFull: number | null; unaryRefusals: number; nodes: number }
  | { state: 'beyond the budget'; sentence: string; nodes: number; budget: number }
  | {
      state: 'offers';
      shared: string[]; // X's relational type names shared (by name or τ)
      sharedByName: string[];
      sharedUnderTau: Array<[string, string]>;
      sharedUnary: string[];
      notSame: string[];
      unknownNames: Array<[string, string]>;
      offers: Offer[]; // ordered by weight, descending
      readings: WeightReadings[]; // weight-ordered; each weight's offers grouped by orbit
      topWeight: number;
      tied: number; // offers at the top weight
      orbits: number; // gauge orbits among the tied (Aut X × Aut Y)
      aut: [number, number];
      autComplete: boolean;
      consistentFull: number | null; // conflict-free injections of size min(|X|,|Y|) — null when beyond the budget or not counted
      unaryRefusals: number; // search nodes refused by the unary home alone (relations fine)
      nodes: number;
      millis: number;
    };

const pairsKey = (pairs: Array<[string, string]>): string => JSON.stringify(pairs);

/** gauge orbits among offers as GROUPS: two are ONE READING iff j' = β ∘ j ∘ α⁻¹ (α ∈ Aut X, β ∈ Aut Y) */
export function gaugeOrbitGroups(offers: Offer[], autX: Array<Map<string, string>>, autY: Array<Map<string, string>>): Offer[][] {
  const byKey = new Map<string, Offer>();
  for (const o of offers) byKey.set(pairsKey(o.pairs), o);
  const assigned = new Set<string>();
  const groups: Offer[][] = [];
  for (const o of offers) {
    const k = pairsKey(o.pairs);
    if (assigned.has(k)) continue;
    assigned.add(k);
    const group = [o];
    for (const alpha of autX) {
      for (const beta of autY) {
        const moved = o.pairs.map(([x, y]) => [alpha.get(x) as string, beta.get(y) as string] as [string, string]).sort((a, b) => (a[0] < b[0] ? -1 : 1));
        const mk = pairsKey(moved);
        const image = byKey.get(mk);
        if (image && !assigned.has(mk)) { assigned.add(mk); group.push(image); }
      }
    }
    groups.push(group);
  }
  return groups;
}

/** the count of readings among offers (the number the register prints) */
export function gaugeOrbits(offers: Offer[], autX: Array<Map<string, string>>, autY: Array<Map<string, string>>): number {
  return gaugeOrbitGroups(offers, autX, autY).length;
}

export interface RegisterOptions {
  /** keep every maximal supported core at every weight (the whole offering) instead of the top weight alone */
  keepAll?: boolean;
  /** count the conflict-free full injections (the researcher's enumeration, for the seal) — off at a look, where only the offers are wanted */
  countFull?: boolean;
}

/**
 * THE OFFERS on X × Y (clause 2 as amended): maximal conflict-free candidates whose every pair is supported,
 * found by a branch-and-bound over partial injections, the bound being the relational agreements so far plus
 * the X-known shared relational tuples that could still agree; every leaf is reduced to its supported core,
 * checked for maximality, and kept if its weight reaches the best seen (or at every weight under `keepAll`).
 * `consistentFull` counts the conflict-free injections of size min(|X|, |Y|) separately (for the seal).
 */
export function registerReading(spaceX: ConceptSpace, spaceY: ConceptSpace, tau?: EdgeIdentification['types'], nodeBudget = 5_000_000, options: RegisterOptions = {}): RegisterReading {
  const keepAll = options.keepAll === true;
  const countFull = options.countFull !== false;
  const started = Date.now();
  const X = recordOf(spaceX);
  const Y = recordOf(spaceY);
  const shared = sharedSignature(X, Y, tau);
  if (shared.types.size === 0) {
    return { state: 'empty core (a)', sentence: 'no relation-type in common — a translation is yours to give', notSame: shared.notSame, unknownNames: shared.unknownNames, sharedUnary: [...shared.unary.keys()] };
  }
  // THE SEARCH is TUPLE-DRIVEN: an offer's pairs all come from relational
  // agreements, so the candidates are built by mapping X's known shared
  // relational tuples to Y's known tuples of the same type and value (or leaving
  // a tuple out), never by pairing roles blindly — the branching is the handful
  // of Y tuples per type, and a tuple that can no longer match prunes at once.
  // The unary home never drives a pair; it only REFUSES one. Every pair is
  // supported BY CONSTRUCTION; the leaf is re-evaluated whole (tuples left out
  // may agree anyway) and checked for maximality; the bound is the agreements so
  // far plus the tuples not yet decided.
  const xTuples = X.knownList.filter((tt) => shared.types.has(tt.type));
  const yByTypeValue = new Map<string, Array<string[]>>();
  for (const u of Y.knownList) {
    const k = `${u.type}|${u.value}`;
    const arr = yByTypeValue.get(k);
    if (arr) arr.push(u.terms);
    else yByTypeValue.set(k, [u.terms]);
  }
  const unaryConflict = (x: string, y: string): boolean => {
    for (const [kx, ky] of shared.unary) {
      const vx = X.known.get(key(kx, [x]));
      const vy = Y.known.get(key(ky, [y]));
      if (vx !== undefined && vy !== undefined && vx !== vy) return true;
    }
    return false;
  };
  const j = new Map<string, string>();
  const usedY = new Set<string>();
  let nodes = 0;
  let overBudget = false;
  let best = 0;
  let unaryRefusals = 0;
  const cores = new Map<string, Offer>(); // by the pairs' canonical key
  const conflictOn = (pairsJustAdded: string[]): boolean => {
    // a KNOWN CONFLICT among the X tuples completed by these pairs: the Y image known with a different value
    for (const tt of xTuples) {
      if (!tt.terms.some((r) => pairsJustAdded.includes(r))) continue;
      if (!tt.terms.every((r) => j.has(r))) continue;
      const yt = shared.types.get(tt.type) as { yName: string; arity: number };
      const vy = Y.known.get(key(yt.yName, tt.terms.map((r) => j.get(r) as string)));
      if (vy !== undefined && vy !== tt.value) return true;
    }
    // the relations are fine — the unary home may still refuse
    for (const x of pairsJustAdded) {
      if (unaryConflict(x, j.get(x) as string)) { unaryRefusals += 1; return true; }
    }
    return false;
  };
  const leaf = (): void => {
    if (j.size === 0) return;
    const ev = evaluate(X, Y, j, shared);
    if (!ev || ev.relational === 0) return;
    // the supported core (every pair here came from an agreement; the evaluation confirms it)
    const core = new Map<string, string>();
    for (const [x, y] of j) if ((ev.support[x] ?? 0) > 0) core.set(x, y);
    if (core.size === 0) return;
    const coreEv = core.size === j.size ? ev : evaluate(X, Y, core, shared);
    if (!coreEv || (!keepAll && coreEv.relational < best)) return;
    // maximality: no supported pair can be added without a conflict
    const coreImg = new Set(core.values());
    for (const x of X.roles) {
      if (core.has(x)) continue;
      for (const y of Y.roles) {
        if (coreImg.has(y)) continue;
        core.set(x, y);
        const ext = evaluate(X, Y, core, shared);
        core.delete(x);
        if (ext && ext.relational > coreEv.relational && (ext.support[x] ?? 0) > 0) return; // extendable — not maximal
      }
    }
    const pairs = [...core.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)) as Array<[string, string]>;
    const k = pairsKey(pairs);
    if (cores.has(k)) return;
    if (coreEv.relational > best) {
      best = coreEv.relational;
      if (!keepAll) for (const [kk, o] of cores) if (o.weight < best) cores.delete(kk);
    }
    cores.set(k, { pairs, weight: coreEv.relational, typesAgree: coreEv.typesAgree, typesUnknown: coreEv.typesUnknown, exposure: coreEv.exposure, unrecorded: coreEv.unrecorded, support: coreEv.support });
  };
  const rec = (i: number, agreements: number): void => {
    if (overBudget) return;
    nodes += 1;
    if (nodes > nodeBudget) { overBudget = true; return; }
    if (!keepAll && agreements + (xTuples.length - i) < best) return; // the bound: every remaining tuple could add one
    if (i === xTuples.length) { leaf(); return; }
    const tt = xTuples[i];
    const yt = shared.types.get(tt.type) as { yName: string; arity: number };
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
  let consistentFull: number | null = countFull ? 0 : null;
  if (countFull) {
    const k = Math.min(X.roles.length, Y.roles.length);
    const jj = new Map<string, string>();
    const used = new Set<string>();
    let n = 0;
    let over = false;
    const okSoFar = (): boolean => {
      for (const t of xTuples) {
        if (!t.terms.every((r) => jj.has(r))) continue;
        const yt = shared.types.get(t.type) as { yName: string; arity: number };
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
        if (!unaryConflict(ds[i], y) && okSoFar()) fill(ds, i + 1);
        used.delete(y);
        jj.delete(ds[i]);
      }
    };
    chooseX(0, 0, []);
    nodes += n;
    if (over) consistentFull = null;
  }
  if (best === 0) {
    return { state: 'empty core (b)', sentence: 'no relation to agree on', shared: [...shared.types.keys()], notSame: shared.notSame, unknownNames: shared.unknownNames, consistentFull, unaryRefusals, nodes };
  }
  // MAXIMALITY IS INCLUSION among the supported cores (the researcher's offers_count.py: the inclusion-maximal
  // induced maps): a core another core strictly contains is not an offer — the leaf's one-pair-at-a-time check
  // above cannot see an extension by a whole tuple matching (two new pairs at once), this filter can. A superset
  // core carries at least its subset's agreements, so at the top weight the superset is found beside it.
  const found = [...cores.values()];
  const contains = (big: Offer, small: Offer): boolean => big.pairs.length > small.pairs.length && small.pairs.every(([x, y]) => big.pairs.some(([px, py]) => px === x && py === y));
  const offers = found.filter((o) => !found.some((p) => contains(p, o))).sort((a, b) => b.weight - a.weight || b.pairs.length - a.pairs.length);
  const autX = automorphisms(X, nodeBudget);
  const autY = automorphisms(Y, nodeBudget);
  const weights = [...new Set(offers.map((o) => o.weight))].sort((a, b) => b - a);
  const readings: WeightReadings[] = weights.map((w) => ({ weight: w, groups: gaugeOrbitGroups(offers.filter((o) => o.weight === w), autX.list, autY.list) }));
  const top = offers.filter((o) => o.weight === best);
  return {
    state: 'offers',
    shared: [...shared.types.keys()],
    sharedByName: shared.byName,
    sharedUnderTau: shared.underTau,
    sharedUnary: [...shared.unary.keys()],
    notSame: shared.notSame,
    unknownNames: shared.unknownNames,
    offers,
    readings,
    topWeight: best,
    tied: top.length,
    orbits: readings[0].groups.length,
    aut: [autX.list.length, autY.list.length],
    autComplete: autX.complete && autY.complete,
    consistentFull,
    unaryRefusals,
    nodes,
    millis: Date.now() - started,
  };
}

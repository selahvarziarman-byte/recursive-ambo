#!/usr/bin/env node

// SWEEP-CEILING: 900s — I-1 clause 3 (C-6c (vii)): this leg's honest standalone
// runtime was 242 s at the (vii) tree, 44 s at the (α) re-pin and 81 s with the
// surface's clauses (73 s inside the sweep) — measured at each change, the number
// in that commit's report. Left standing: the leg grows with every stamp on the
// register, and the field leg was killed in this neighbourhood under co-load; a
// hang still dies at 900 s and prints TIMEOUT by name.

// DIAGNOSTIC — THE J REGISTER'S QUANTITIES (STAMP C-6d (α), 2026-09-19, with
// the MARKERs 1835 + 2030, the ratio fix 2310 §0, and STAMP C-6d (γ), 2026-09-20:
// τ REPLACES; the mold's types by definition; the copy): the second
// implementation, RUN on the fixture pairs, pinned to the researcher's seal
// (their instruments j_register_quantities.py · offers_count.py ·
// flow_phi_offers_under_tau.py, every one RUN by the coder, and the
// mothership's own runs). A disagreement reopens the DEFINITION, never tunes
// the code: it is reported, not fitted — it reopened it twice (§3's negative;
// the maximality), and found the (γ) line (§7).
//
// THE CORRECTED CLAUSE: WEIGHT and SUPPORT are the RELATIONAL agreements
// (arity ≥ 2); the unary home REFUSES on conflict and is PRINTED as its own
// two counts (`types: a agree · u unknown` — two counts, never a ratio).
// THE (γ) LINE: τ is ONE function and the PERSON's — a given τ REPLACES the
// device's by-name sharing wholesale; with no τ given, the by-name pairs stand
// as the device's PROPOSAL; the MOLD's own types (`member_status`) are shared
// BY DEFINITION, the canonical spelling the mold's.
// Clause 2 as AMENDED (the researcher's 1632): an OFFER is an inclusion-maximal
// conflict-free candidate whose EVERY pair is SUPPORTED; size follows from
// support. The manufactured falsifier for it (LAW 24, no fixture in the wild
// exercises it): X = the triangle, Y = the triangle plus one isolated role w.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
};
require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText,
    filename,
  );
};
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const { readCastFile } = req('src/lib/castLoader.ts');
const { registerReading, recordOf, automorphisms, sharedSignature, assess, evaluate, describeConflict } = req('src/lib/jRegister.ts');
const readLf = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').split('\r\n').join('\n');
const cast = (name) => {
  const r = readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8'));
  if (!r.taken) throw new Error(`${name}: ${r.refusal}`);
  return r.cast;
};

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined && !cond ? ` — ${detail}` : ''}`);
  if (!cond) failures += 1;
};
const note = (line) => console.log(`      ${line}`);

console.log("THE J REGISTER'S QUANTITIES — the second implementation against the researcher's seal (C-6d (α) corrected · (γ))\n");

const tri = cast('triangle.cast.json');
const sym = cast('triangle-symmetric.cast.json');
const tcell = cast('t-cell.cast.json');
const supportLine = (o) => Object.entries(o.support).sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([x, n]) => `${x} ${n}`).join(' · ');
const pairsOf = (o) => o.pairs.map(([x, y]) => `${x}↦${y}`).join(' · ');
// 2310 §0 — the seal's line: THREE counts of three different things, never a ratio (types are three-valued;
// a refusing type kills the pair, so on an offer only agree/unknown are reachable)
const sealLine = (o) => `relational weight ${o.weight} · ${o.unrecorded} unrecorded · types: ${o.typesAgree} agree · ${o.typesUnknown} unknown`;
const distributionOf = (r) => r.readings.map((w) => `${w.weight}×${w.groups.flat().length}`).join(' · ');
const groupsOf = (r) => r.readings.map((w) => w.groups.length);
const J = (x) => JSON.stringify(x);

// ═══ §1 triangle × triangle-symmetric ═══
const a = registerReading(tri, sym);
check("§1 ★★ triangle × triangle-symmetric: |Aut| 3 / 6 · top weight 3 · 6 tied · 1 orbit · the top offer's exposure 3 · unrecorded 3 · consistent full injections 6 (every number the seal's; no unary home, so `types: 0 agree · 0 unknown`); the reading's premise is the device's PROPOSAL r ↦ r (no τ given)",
  a.state === 'offers' && a.aut[0] === 3 && a.aut[1] === 6 && a.topWeight === 3 && a.tied === 6 && a.orbits === 1 &&
    a.offers[0].exposure === 3 && a.offers[0].unrecorded === 3 && a.consistentFull === 6 && a.offers[0].typesAgree === 0 && a.offers[0].typesUnknown === 0 &&
    a.proposalInForce === true && J(a.proposed) === '[["r","r"]]' && J(a.ruled) === '[]',
  JSON.stringify(a).slice(0, 400));
check('§1 …the vacuity check, named: |Aut| 6 and 6 tied are FORCED by full symmetry — a control, not evidence; exposure 3 is 6 − 3, and it is all THERE (the symmetric cast knows the reverses the directed one does not)',
  a.state === 'offers' && a.offers.every((o) => o.pairs.length === 3 && o.exposure === 3 && o.exposureHere === 0 && o.exposureThere === 3));

// ═══ §2 triangle × triangle ═══
const b = registerReading(tri, tri);
check('§2 ★★ triangle × triangle: |Aut| 3 / 3 · top weight 3 · 3 tied · 1 orbit · exposure 0 · unrecorded 6 · consistent full injections 6',
  b.state === 'offers' && b.aut[0] === 3 && b.aut[1] === 3 && b.topWeight === 3 && b.tied === 3 && b.orbits === 1 &&
    b.offers[0].exposure === 0 && b.offers[0].unrecorded === 6 && b.consistentFull === 6, JSON.stringify(b).slice(0, 400));
check('§2 ★ the falsifier held (LAW 24): `3 tied` fails on a second relation-type — the articulated triangle (p · q · s, one instance each) against itself has |Aut| 1 and ONE offer',
  (() => {
    const art = readCastFile(JSON.stringify({ roles: [{ id: 'x' }, { id: 'y' }, { id: 'z' }], signature: [{ type: 'p', arity: 2 }, { type: 'q', arity: 2 }, { type: 's', arity: 2 }],
      relations: [{ type: 'p', terms: ['x', 'y'], polarity: 'holds' }, { type: 'q', terms: ['y', 'z'], polarity: 'holds' }, { type: 's', terms: ['z', 'x'], polarity: 'holds' }] }));
    const r = registerReading(art.cast, art.cast);
    return r.state === 'offers' && r.aut[0] === 1 && r.tied === 1 && r.topWeight === 3 && r.orbits === 1;
  })());

// ═══ §3 t-cell × t-cell — THE SEAL RENUMBERED (MARKER 2030: weight follows support; the ratio fixed 2310 §0) ═══
console.log('\n----- §3 t-cell × t-cell — the seal renumbered: relational weight, the unary home printed as two counts -----');
const c = registerReading(tcell, tcell);
check('§3 ★★ t-cell × t-cell: |Aut| 1 / 1 · RELATIONAL weight 11 (the 11 tuples; the 10 unary agreements no longer in it) · 1 tied · 1 orbit · exposure 0 · unrecorded 1489 (1510 − 11 − 10 — the remainder runs over the shared signature INCLUDING the unary type: 5 binary types × 100 + removes 1000 + member_status 10) · consistent full injections 3,104,904; the premise the device\'s proposal of its six signature types by name; `member_status` shared BY THE MOLD',
  c.state === 'offers' && c.aut[0] === 1 && c.aut[1] === 1 && c.topWeight === 11 && c.tied === 1 && c.orbits === 1 &&
    c.offers[0].exposure === 0 && c.offers[0].unrecorded === 1489 && c.consistentFull === 3104904 && c.proposalInForce && c.proposed.length === 6 && J(c.ruled) === '["member_status"]' && J(c.sharedUnary) === '["member_status"]',
  JSON.stringify({ ...c, offers: c.offers && c.offers.slice(0, 1), readings: undefined }).slice(0, 500));
check("§3 ★★ THE SEAL'S LINE, in the ratified words (2310 §0 — two counts, never a ratio): `relational weight 11 · 1489 unrecorded · types: 10 agree · 0 unknown`",
  c.state === 'offers' && sealLine(c.offers[0]) === 'relational weight 11 · 1489 unrecorded · types: 10 agree · 0 unknown', c.state === 'offers' && sealLine(c.offers[0]));
check('§3 ★ the top offer is the identity with the per-pair support of the RELATIONAL agreements alone: r0 5 · r1 5 · r2 3 · r3 1 · r4 1 · r5 1 · r6 2 · r7 1 · r8 3 · r9 1 (the sealed line of (α) minus the one unary count each role carried — 23 endpoint incidences: 10 binary × 2 + removes × 3)',
  c.state === 'offers' && c.offers[0].pairs.every(([x, y]) => x === y) && c.offers[0].pairs.length === 10 &&
    supportLine(c.offers[0]) === 'r0 5 · r1 5 · r2 3 · r3 1 · r4 1 · r5 1 · r6 2 · r7 1 · r8 3 · r9 1', c.state === 'offers' && supportLine(c.offers[0]));
if (c.state === 'offers') note(`t-cell × t-cell took ${c.millis} ms · ${c.nodes} nodes in all (the offers search's budget 5,000,000 nodes; the full-injection count's 20,000,000) — the researcher's Python enumeration took 96 s`);
const k = registerReading(tcell, tcell, undefined, 5_000_000, { keepAll: true, countFull: false });
check("§3 ★★ THE TEN OFFERS (the researcher's offers_count.py, RUN by me: 9 s; renumbered by 2030): 10 distinct offers by relational weight 11 (size 10) · 8 (9) · 4 (7) · 3 ×4 (size 5, 4 readings) · 2 ×3 (size 4, 3 readings) — the same order as the (α) seal's 21 · 17 · 11 · 8 · 6, each minus its size",
  k.state === 'offers' && k.offers.length === 10 && distributionOf(k) === '11×1 · 8×1 · 4×1 · 3×4 · 2×3' && J(groupsOf(k)) === '[1,1,1,4,3]' &&
    J(k.readings.map((w) => w.groups.flat().map((o) => o.pairs.length))) === '[[10],[9],[7],[5,5,5,5],[4,4,4]]',
  k.state === 'offers' ? `${k.offers.length} offers · ${distributionOf(k)} · groups ${J(groupsOf(k))}` : k.state);
if (k.state === 'offers') note(`the whole offering (keep-all, no full count) took ${k.millis} ms · ${k.nodes} nodes`);
check("§3 ★ LAW 24 — THE DEFINITION DECIDES, NOT THE ARITHMETIC: under the UNCORRECTED clause (a shared unary value supports a pair) every conflict-free full injection of this fixture is a maximal supported core — the constant `member_status: has` on all ten roles backs every pair equally, i.e. backs none — so the offer count would be the register's own consistent-full count, 3,104,904 (RUN here; the researcher's offers_count.py names the same number); the same fixture under the corrected clause reads TEN",
  c.state === 'offers' && c.consistentFull === 3104904 && k.state === 'offers' && k.offers.length === 10);
check('§3 ★ the falsifier held (LAW 24): `1 tied` fails on a second automorphism — the T cell with its member_status keys removed and two roles made twins (r3 and r5 both `sustains`-free leaves) is a different cast; here every role is pinned by its own tuples, so Aut is the identity alone',
  (() => { const rec = recordOf(tcell); const au = automorphisms(rec); return au.complete && au.list.length === 1 && [...au.list[0].entries()].every(([x, y]) => x === y); })());
check('§3 THE BUDGET is a limit found at pick-time, in words: under a budget of 10 nodes the offers search itself is `beyond the budget` with nothing offered; under 1000 the offers are found (the tuple-driven search over the 11 relational tuples is small) and only the full-injection COUNT is beyond its budget — reported as `consistentFull: null`, never a number',
  (() => {
    const tiny = registerReading(tcell, tcell, undefined, 10);
    const small = registerReading(tcell, tcell, undefined, 1000);
    return tiny.state === 'beyond the budget' && tiny.sentence.includes("beyond the register's budget") && tiny.nodes > 10 &&
      small.state === 'offers' && small.topWeight === 11 && small.tied === 1 && small.consistentFull === null;
  })());

// ═══ §4 the empty core, both ways; the shared signature's RULED and GIVEN parts ═══
const d = registerReading(tri, tcell);
check('§4 ★★ triangle × t-cell: EMPTY CORE (a) — `no relation-type in common — a translation is yours to give`; nothing proposed (no caster type shares a name), nothing ruled (the triangle has no member_status)',
  d.state === 'empty core (a)' && d.sentence === 'no relation-type in common — a translation is yours to give' && J(d.proposed) === '[]' && J(d.ruled) === '[]', JSON.stringify(d));
check('§4 ★ EMPTY CORE (b): shared types and every conflict-free injection of weight 0 — a cast with no relations against itself: `no relation to agree on`',
  (() => {
    const bare = readCastFile(JSON.stringify({ roles: [{ id: 'x' }, { id: 'y' }], signature: [{ type: 'r', arity: 2 }], relations: [] }));
    const r = registerReading(bare.cast, bare.cast);
    return r.state === 'empty core (b)' && r.sentence === 'no relation to agree on' && r.consistentFull === 2;
  })());
check("§4 a name with two arities across the casts is NOT shared — named, never refused; the person's τ makes differently-named types shared when the arity agrees",
  (() => {
    const p = readCastFile(JSON.stringify({ roles: [{ id: 'x' }, { id: 'y' }], signature: [{ type: 'r', arity: 2 }], relations: [{ type: 'r', terms: ['x', 'y'], polarity: 'holds' }] }));
    const q = readCastFile(JSON.stringify({ roles: [{ id: 'a' }, { id: 'b' }], signature: [{ type: 'r', arity: 3 }, { type: 's', arity: 2 }], relations: [{ type: 's', terms: ['a', 'b'], polarity: 'holds' }] }));
    const noTau = registerReading(p.cast, q.cast);
    const withTau = registerReading(p.cast, q.cast, [['r', 's']]);
    const sh = sharedSignature(recordOf(p.cast), recordOf(q.cast));
    return noTau.state === 'empty core (a)' && noTau.notSame.includes('r') && sh.notSame.includes('r') &&
      withTau.state === 'offers' && withTau.topWeight === 1 && withTau.offers[0].pairs.length === 2 && J(withTau.given) === '[["r","s"]]' && withTau.proposalInForce === false;
  })());
check("§4 ★★ THE RULED PART AND THE GIVEN PART ((γ) §1.2): a caster-invented key (`k`) on the roles of both is NOT shared by name — two casts sharing only it read EMPTY CORE (a) with no unary in force; τ on their relation-types AND on the key ([['p','q'],['k','k']]) offers with `types: 2 agree · 0 unknown`; the MOLD's key `member_status` on both is shared BY DEFINITION without τ — the same pair with the key renamed to the mold's reads (a) with `member_status` ruled, and under τ on the relation-types alone its agreements count",
  (() => {
    const mk = (id1, id2, type, keyName) => readCastFile(JSON.stringify({ roles: [{ id: id1, types: { [keyName]: 'has' } }, { id: id2, types: { [keyName]: 'has' } }], signature: [{ type, arity: 2 }], relations: [{ type, terms: [id1, id2], polarity: 'holds' }] })).cast;
    const p = mk('x', 'y', 'p', 'k'); const q = mk('a', 'b', 'q', 'k');
    const none = registerReading(p, q);
    const withKey = registerReading(p, q, [['p', 'q'], ['k', 'k']]);
    const withoutKey = registerReading(p, q, [['p', 'q']]);
    const pm = mk('x', 'y', 'p', 'member_status'); const qm = mk('a', 'b', 'q', 'member_status');
    const noneM = registerReading(pm, qm);
    const tauM = registerReading(pm, qm, [['p', 'q']]);
    return none.state === 'empty core (a)' && J(none.sharedUnary) === '[]' && J(none.ruled) === '[]' &&
      withKey.state === 'offers' && withKey.topWeight === 1 && withKey.offers[0].typesAgree === 2 && withKey.offers[0].typesUnknown === 0 && J(withKey.sharedUnary) === '["k"]' &&
      withoutKey.state === 'offers' && J(withoutKey.sharedUnary) === '[]' && withoutKey.offers[0].typesAgree === 0 &&
      noneM.state === 'empty core (a)' && J(noneM.ruled) === '["member_status"]' && J(noneM.sharedUnary) === '["member_status"]' &&
      tauM.state === 'offers' && J(tauM.sharedUnary) === '["member_status"]' && tauM.offers[0].typesAgree === 2;
  })());

// ═══ §5 THE MANUFACTURED FALSIFIER for the amended clause 2 — size follows from support ═══
const triPlusW = readCastFile(JSON.stringify({ roles: [{ id: 'x' }, { id: 'y' }, { id: 'z' }, { id: 'w' }], signature: [{ type: 'r', arity: 2 }],
  relations: [{ type: 'r', terms: ['x', 'y'], polarity: 'holds' }, { type: 'r', terms: ['y', 'z'], polarity: 'holds' }, { type: 'r', terms: ['z', 'x'], polarity: 'holds' }] })).cast;
const e = registerReading(tri, triPlusW);
check('§5 ★★ triangle × (triangle + an isolated w): EVERY offer has size 3 and `w` is in none of them — an unsupported pair is never in an offer; the identity is an offer; the offers are 3 tied (w does not multiply them)',
  e.state === 'offers' && e.offers.every((o) => o.pairs.length === 3 && !o.pairs.some(([, y]) => y === 'w')) &&
    e.offers.some((o) => o.pairs.every(([x, y]) => x === y)) && e.tied === 3 && e.topWeight === 3, JSON.stringify(e).slice(0, 400));
check('§5 ★ LAW 24 — X × X unchanged beside it: 3 tied, one orbit', b.state === 'offers' && b.tied === 3 && b.orbits === 1);
check('§5 |X| ≠ |Y| changes nothing: (triangle + w) × triangle offers are the same three cores, none touching w',
  (() => { const r = registerReading(triPlusW, tri); return r.state === 'offers' && r.tied === 3 && r.offers.every((o) => o.pairs.length === 3 && !o.pairs.some(([x]) => x === 'w')); })());

// ═══ §7 THE WILD SEAL — Flow × Φ under the researcher's EXACT instrument (flow_phi_offers_under_tau.py, RUN by me: identical to their RESULTS file) with ITS τ maps — τ REPLACES ((γ) §1.1) ═══
console.log("\n----- §7 ★★ the wild seal — Flow × Φ (hinge_data.py) under the instrument's exact τ maps; τ REPLACES the device's by-name sharing; the mold's key by definition -----");
const flow = cast('flow.cast.json');
const phi = cast('phi.cast.json');
const TAU3 = [['sustains', 'descends-from'], ['presupposes', 'specifies'], ['exceeds-in-size', 'lodges-in']];
const TAU4 = [['generates', 'specifies'], ['sustains', 'descends-from'], ['exceeds-in-speed', 'transmits'], ['precedes', 'component-of']];
const TAU3_VII = [['sustains', 'descends-from'], ['presupposes', 'lodges-in'], ['exceeds-in-size', 'specifies']];
const WILD_BUDGET = 1_000_000;
const w3 = registerReading(flow, phi, TAU3, WILD_BUDGET, { keepAll: true, countFull: false });
const w4 = registerReading(flow, phi, TAU4, WILD_BUDGET, { keepAll: true, countFull: false });
const wName = registerReading(flow, phi, undefined, WILD_BUDGET, { keepAll: true, countFull: false });
check('§7 ★★ THE FIXTURES CARRY THE MOLD\'S KEY under its canonical spelling ((γ) §1.3): every role of Flow and Φ declares `member_status` (Flow all `has`; Φ1–Φ8 `has`, Φ9 `none-by-nature`), no role declares `member-status`, and the register shares it BY THE MOLD under every τ',
  [...flow.roles, ...phi.roles].every((r) => r.types && typeof r.types.member_status === 'string' && !('member-status' in r.types)) && phi.roles.find((r) => r.id === 'Φ9').types.member_status === 'none-by-nature' &&
    [w3, w4, wName].every((r) => r.state === 'offers' && J(r.ruled) === '["member_status"]' && J(r.sharedUnary) === '["member_status"]'));
check('§7 ★★ |Aut(Flow)| = 2 (the F10/F11 twins) · |Aut(Φ)| = 1 — read on the whole record, both homes',
  w3.state === 'offers' && w3.aut[0] === 2 && w3.aut[1] === 1 && w3.autComplete, J(w3.state === 'offers' ? w3.aut : w3));
check("§7 ★★ THE SEAL under τ₃ {sustains↦descends-from · presupposes↦specifies · exceeds-in-size↦lodges-in} — τ REPLACES, so `disjoins` (shared by name) is NOT in force: 16 offers · TOP relational weight 4: ONE, size 3 {F5↦Φ7, F7↦Φ1, F8↦Φ2}, support F5 1 · F7 3 · F8 2, types: 3 agree · 0 unknown · 1 reading; weight 2: 15 offers (sizes 3 ×14, 2 ×1) · 13 readings (the twins collapse two pairs) — every number the seal's; `disjoins ↦ disjoins` is PROPOSABLE, not applied",
  w3.state === 'offers' && w3.offers.length === 16 && w3.topWeight === 4 && w3.tied === 1 && w3.orbits === 1 && pairsOf(w3.offers[0]) === 'F5↦Φ7 · F7↦Φ1 · F8↦Φ2' &&
    supportLine(w3.offers[0]) === 'F5 1 · F7 3 · F8 2' && w3.offers[0].typesAgree === 3 && w3.offers[0].typesUnknown === 0 &&
    w3.readings[1].weight === 2 && w3.readings[1].groups.flat().length === 15 && w3.readings[1].groups.length === 13 &&
    J(w3.readings[1].groups.flat().map((o) => o.pairs.length).sort()) === J([2, ...Array(14).fill(3)]) &&
    !w3.shared.includes('disjoins') && J(w3.proposable) === '[["disjoins","disjoins"]]' && w3.proposalInForce === false && J(w3.given) === J(TAU3),
  w3.state === 'offers' ? `${w3.offers.length} offers · ${distributionOf(w3)} · groups ${J(groupsOf(w3))} · top ${pairsOf(w3.offers[0])} · ${supportLine(w3.offers[0])} · ${sealLine(w3.offers[0])} · proposable ${J(w3.proposable)}` : w3.state);
check("§7 ★★ THE SEAL under τ₄ {generates↦specifies · sustains↦descends-from · exceeds-in-speed↦transmits · precedes↦component-of}: 37 offers · TOP weight 5: ONE, size 5 {F1↦Φ3, F2↦Φ2, F3↦Φ4, F5↦Φ1, F7↦Φ7}, support F1 1 · F2 2 · F3 1 · F5 3 · F7 1, types: 5 agree · 1 reading; weight 4: 5 (5 readings) · weight 3: 24 (24) · weight 2: 7 (7); `disjoins` and `presupposes` proposable",
  w4.state === 'offers' && w4.offers.length === 37 && w4.topWeight === 5 && w4.tied === 1 && w4.orbits === 1 && pairsOf(w4.offers[0]) === 'F1↦Φ3 · F2↦Φ2 · F3↦Φ4 · F5↦Φ1 · F7↦Φ7' &&
    supportLine(w4.offers[0]) === 'F1 1 · F2 2 · F3 1 · F5 3 · F7 1' && w4.offers[0].typesAgree === 5 &&
    distributionOf(w4) === '5×1 · 4×5 · 3×24 · 2×7' && J(groupsOf(w4)) === '[1,5,24,7]' && J(w4.proposable) === '[["disjoins","disjoins"],["presupposes","presupposes"]]',
  w4.state === 'offers' ? `${w4.offers.length} offers · ${distributionOf(w4)} · groups ${J(groupsOf(w4))} · top ${pairsOf(w4.offers[0])} · ${supportLine(w4.offers[0])}` : w4.state);
check('§7 ★★ THE 09-08 RECORD CORRECTED (LAW 24): the 09-08 "size-4 rival" {F1↦Φ3, F2↦Φ2, F3↦Φ4, F5↦Φ1} is NO offer under its own τ₄ — it is the SUB-CORE of the size-5 top offer, extended by F7↦Φ7 (sustains(F7,F7) ↦ descends-from(Φ7,Φ7)); the 09-08 |J| = 5 search was SAMPLED, and the tie at weight 4 between sizes 3 and 4 holds only ACROSS τs',
  w4.state === 'offers' && !w4.offers.some((o) => pairsOf(o) === 'F1↦Φ3 · F2↦Φ2 · F3↦Φ4 · F5↦Φ1') &&
    [['F1', 'Φ3'], ['F2', 'Φ2'], ['F3', 'Φ4'], ['F5', 'Φ1']].every(([x, y]) => w4.offers[0].pairs.some(([px, py]) => px === x && py === y)) &&
    w4.offers[0].pairs.some(([x, y]) => x === 'F7' && y === 'Φ7'));
check("§7 ★★ NO τ GIVEN — THE DEVICE'S PROPOSAL (the instrument's τ_name, MARKED AS PROPOSED): `disjoins ↦ disjoins · presupposes ↦ presupposes` in force as the premise; 9 offers · top weight 2: ONE, size 2 {F2↦Φ7, F4↦Φ1} · weight 1: 8 offers (7 readings); the mold's key shared by definition beside it",
  wName.state === 'offers' && wName.proposalInForce === true && J(wName.proposed) === '[["disjoins","disjoins"],["presupposes","presupposes"]]' && J(wName.proposable) === '[]' && J(wName.given) === '[]' &&
    wName.offers.length === 9 && wName.topWeight === 2 && wName.tied === 1 && pairsOf(wName.offers[0]) === 'F2↦Φ7 · F4↦Φ1' &&
    J([...wName.shared].sort()) === '["disjoins","presupposes"]' && J(wName.sharedUnary) === '["member_status"]' &&
    wName.readings[1].weight === 1 && wName.readings[1].groups.flat().length === 8 && wName.readings[1].groups.length === 7,
  wName.state === 'offers' ? `${wName.offers.length} offers · ${distributionOf(wName)} · groups ${J(groupsOf(wName))} · top ${pairsOf(wName.offers[0])} · proposed ${J(wName.proposed)}` : wName.state);
check("§7 ★ THE RETIRED READING IS REACHABLE ONLY BY THE PERSON'S ACT (LAW 24 for (γ) §1.1): τ₃ WITH the proposable `disjoins ↦ disjoins` added by the person reads 18 offers (4×1 · 2×17 — the number the device once read on its own under \"adds\"); the device never applies it silently",
  (() => { const r = registerReading(flow, phi, [...TAU3, ['disjoins', 'disjoins']], WILD_BUDGET, { keepAll: true, countFull: false }); return r.state === 'offers' && r.offers.length === 18 && distributionOf(r) === '4×1 · 2×17' && pairsOf(r.offers[0]) === 'F5↦Φ7 · F7↦Φ1 · F8↦Φ2' && J(r.proposable) === '[]'; })());
check("§7 ★ NO offer touches Φ9 under any premise, and NONE was refused by member_status — no translated type reaches Φ9 (`decays`, `fills` lie outside all three); the zero is MEASURED with the mold's key shared by definition, beside §9's measured one",
  [w3, w4, wName].every((r) => r.state === 'offers' && !r.offers.some((o) => o.pairs.some(([, y]) => y === 'Φ9')) && r.unaryRefusals === 0),
  J([w3, w4, wName].map((r) => (r.state === 'offers' ? { refusals: r.unaryRefusals, phi9: r.offers.some((o) => o.pairs.some(([, y]) => y === 'Φ9')) } : r.state))));
check("§7 ★ THE PREMISE DISCLOSED, MEASURED — and the inference falsified (the mothership's own, corrected against itself, 0033 §1): the size-3 core's four agreements do NOT ride sustains↦descends-from alone — they are sustains(F5,F5)↦descends-from(Φ7,Φ7) · sustains(F7,F7)↦descends-from(Φ1,Φ1) · presupposes(F8,F7)↦specifies(Φ2,Φ1) · exceeds-in-size(F8,F7)↦lodges-in(Φ2,Φ1); the (vii) transcription (the two targets swapped) is an EQUALLY VALID translation for the core ((γ) §1.5: a tie between τs, real and the person's) — under it the same top offer at weight 4; under sustains↦descends-from alone the top is weight 2, 2 tied (8 under the retired reading, when the by-name pairs rode along), and the core is not reached",
  (() => {
    const X = recordOf(flow); const Y = recordOf(phi);
    const core = new Map([['F5', 'Φ7'], ['F7', 'Φ1'], ['F8', 'Φ2']]);
    const agreementsUnder = (tau) => {
      const sh = sharedSignature(X, Y, tau); const dom = new Set(core.keys()); const out = [];
      for (const t of X.knownList) {
        if (!t.terms.every((r) => dom.has(r))) continue;
        const rel = sh.types.get(t.type); if (!rel) continue;
        if (Y.known.get(`${rel.yName}|${JSON.stringify(t.terms.map((r) => core.get(r)))}`) === t.value) out.push(`${t.type}(${t.terms.join(',')})↦${rel.yName}`);
      }
      return out.sort();
    };
    const vii = registerReading(flow, phi, TAU3_VII, WILD_BUDGET, { countFull: false });
    const alone = registerReading(flow, phi, [['sustains', 'descends-from']], WILD_BUDGET, { countFull: false });
    return J(agreementsUnder(TAU3)) === J(['exceeds-in-size(F8,F7)↦lodges-in', 'presupposes(F8,F7)↦specifies', 'sustains(F5,F5)↦descends-from', 'sustains(F7,F7)↦descends-from']) &&
      J(agreementsUnder(TAU3_VII)) === J(['exceeds-in-size(F8,F7)↦specifies', 'presupposes(F8,F7)↦lodges-in', 'sustains(F5,F5)↦descends-from', 'sustains(F7,F7)↦descends-from']) &&
      vii.state === 'offers' && vii.topWeight === 4 && vii.tied === 1 && pairsOf(vii.offers[0]) === 'F5↦Φ7 · F7↦Φ1 · F8↦Φ2' &&
      alone.state === 'offers' && alone.topWeight === 2 && alone.tied === 2 && !alone.offers.some((o) => pairsOf(o) === 'F5↦Φ7 · F7↦Φ1 · F8↦Φ2');
  })());
check('§7 ★ EXPOSURE IS COUNTED BY SIDE ((γ) §2.3): the sum is the exposure; under τ₃ the top offer exposes NOTHING (its 23 unrecorded = 27 relational cells + 3 unary − 7 agreements; the (β) `1 known on one side only` was a `disjoins` tuple riding the retired reading) and the proposal\'s top exposes ONE tuple THERE (Φ knows a tuple over its image that Flow does not); the T cell\'s identity exposes nothing',
  [w3, w4, wName].every((r) => r.state === 'offers' && r.offers.every((o) => o.exposureHere + o.exposureThere === o.exposure)) &&
    w3.state === 'offers' && w3.offers[0].exposure === 0 && w3.offers[0].unrecorded === 23 && wName.state === 'offers' && wName.offers[0].exposureHere === 0 && wName.offers[0].exposureThere === 1 && wName.offers[0].unrecorded === 5 &&
    c.state === 'offers' && c.offers[0].exposure === 0);
if (w3.state === 'offers' && wName.state === 'offers') note(`exposure by side — τ₃ top offer: here ${w3.offers[0].exposureHere} · there ${w3.offers[0].exposureThere}; the proposal's top offer: here ${wName.offers[0].exposureHere} · there ${wName.offers[0].exposureThere}; the T cell's identity: here ${c.state === 'offers' ? c.offers[0].exposureHere : '?'} · there ${c.state === 'offers' ? c.offers[0].exposureThere : '?'}`);
const wFull = registerReading(flow, phi, TAU3, WILD_BUDGET);
check('§7 ★ THE BUDGET AT THE REAL PAIR, measured: the offers are found inside a 1,000,000-node budget (the tuple-driven search — the nodes in the note), and the full-injection COUNT (P(14,9) = 726,485,760 injections) is beyond its 4,000,000-node budget and says so as `null`, never a number',
  wFull.state === 'offers' && wFull.consistentFull === null && wFull.topWeight === 4, J(wFull.state === 'offers' ? { full: wFull.consistentFull, nodes: wFull.nodes } : wFull));
if (w3.state === 'offers' && w4.state === 'offers' && wName.state === 'offers') note(`Flow × Φ whole offerings (keep-all, no full count): τ₃ ${w3.millis} ms · ${w3.nodes} nodes; τ₄ ${w4.millis} ms · ${w4.nodes} nodes; the proposal ${wName.millis} ms · ${wName.nodes} nodes; with the full count under τ₃ ${wFull.state === 'offers' ? `${wFull.millis} ms · ${wFull.nodes} nodes` : wFull.state}`);

// ═══ §8 THE OFFER COUNT, printed not pinned — the second implementation of a number the researcher was asked for ═══
console.log('\n----- §8 the offer count — DISTINCT offers, the weight distribution (top down), the readings at every weight — PRINTED, not asserted -----');
const distribution = (label, X, Y, tau) => {
  const r = registerReading(X, Y, tau, WILD_BUDGET, { keepAll: true, countFull: false });
  if (r.state !== 'offers') { note(`${label}: ${r.state}`); return; }
  note(`${label}: ${r.offers.length} distinct offers · distribution ${distributionOf(r)} · readings ${r.readings.map((w) => `weight ${w.weight}: ${w.groups.flat().length} offers · ${w.groups.length} reading(s)`).join(' · ')}`);
};
distribution('triangle × triangle-symmetric', tri, sym);
distribution('triangle × triangle', tri, tri);
distribution('t-cell × t-cell', tcell, tcell);
distribution('triangle × t-cell', tri, tcell);
distribution('Flow × Φ (τ₃)', flow, phi, TAU3);
distribution('Flow × Φ (τ₄)', flow, phi, TAU4);
distribution("Flow × Φ (the device's proposal — no τ)", flow, phi);
note('(a distribution that reads `beyond the budget` is the keep-all search past 1,000,000 nodes — the count is not known, and is not guessed)');

// ═══ §9 THE UNARY REFUSAL'S POSITIVE CONTROL (LAW 24, MARKER 2030 §2, (γ) §1.3): T × Φ under answers-to↦decays ═══
console.log("\n----- §9 the unary refusal's positive control — T × Φ under answers-to↦decays, the mold's key shared by name -----");
const T = recordOf(tcell);
const P = recordOf(phi);
const TAU_A = [['answers-to', 'decays']];
const matching = new Map([['r1', 'Φ2'], ['r7', 'Φ9']]); // answers-to(r1, r7) holds ↦ decays(Φ2, Φ9) holds — the relation agrees; Φ9 is none-by-nature
check('§9 ★★ THE MEASURED ONE, BY NAME: under {answers-to↦decays} alone the mold\'s key `member_status` is shared by definition, so the matching r1↦Φ2 · r7↦Φ9 is REFUSED — `assess` names exactly one conflict, unary, in the ratified words `member_status: r7 has · Φ9 none-by-nature`; the register reads EMPTY CORE (b) (the device LOOKED: the one relational match is refused) with 1 unary refusal counted — the first face\'s refusal, no τ on the key needed',
  (() => {
    const sh = sharedSignature(T, P, TAU_A);
    const asm = assess(T, P, matching, sh);
    const r = registerReading(tcell, phi, TAU_A);
    return J(sh.ruled) === '["member_status"]' && asm.conflicts.length === 1 && asm.conflicts[0].arity === 1 && asm.relational === 1 &&
      describeConflict(asm.conflicts[0]) === 'member_status: r7 has · Φ9 none-by-nature' && evaluate(T, P, matching, sh) === null &&
      r.state === 'empty core (b)' && r.unaryRefusals === 1;
  })());
check('§9 ★★ THE MEASURED ZERO, with its reason (LAW 24): the same Φ with its key spelled as a CASTER key (`member-status` — the (vii) slip) shares no unary type by name, so the matching is an OFFER of weight 1 touching Φ9 with 0 refusals; τ on the caster key ({member_status↦member-status}) refuses it again, the conflict named `member_status: r7 has · member-status: Φ9 none-by-nature` — the τ-on-a-caster-unary mechanism kept for caster-invented keys',
  (() => {
    const phiSlip = { ...phi, roles: phi.roles.map((r) => ({ ...r, types: { 'member-status': r.types.member_status } })) };
    const Ps = recordOf(phiSlip);
    const zero = registerReading(tcell, phiSlip, TAU_A);
    const shB = sharedSignature(T, Ps, [...TAU_A, ['member_status', 'member-status']]);
    const asmB = assess(T, Ps, matching, shB);
    const one = registerReading(tcell, phiSlip, [...TAU_A, ['member_status', 'member-status']]);
    return J(sharedSignature(T, Ps, TAU_A).ruled) === '[]' && zero.state === 'offers' && zero.topWeight === 1 && zero.unaryRefusals === 0 && zero.offers.some((o) => pairsOf(o) === 'r1↦Φ2 · r7↦Φ9') &&
      asmB.conflicts.length === 1 && describeConflict(asmB.conflicts[0]) === 'member_status: r7 has · member-status: Φ9 none-by-nature' && one.state === 'empty core (b)' && one.unaryRefusals === 1;
  })());
check('§9 ★ a RELATIONAL conflict is named in the same words, the other way round: the articulated pair p(x, y) holds against p(a, b) does-not-hold reads `p(x, y) holds here · p(a, b) does-not-hold there`',
  (() => {
    const p = readCastFile(JSON.stringify({ roles: [{ id: 'x' }, { id: 'y' }], signature: [{ type: 'p', arity: 2 }], relations: [{ type: 'p', terms: ['x', 'y'], polarity: 'holds' }] })).cast;
    const q = readCastFile(JSON.stringify({ roles: [{ id: 'a' }, { id: 'b' }], signature: [{ type: 'p', arity: 2 }], relations: [{ type: 'p', terms: ['a', 'b'], polarity: 'does-not-hold' }] })).cast;
    const sh = sharedSignature(recordOf(p), recordOf(q));
    const asm = assess(recordOf(p), recordOf(q), new Map([['x', 'a'], ['y', 'b']]), sh);
    return asm.conflicts.length === 1 && describeConflict(asm.conflicts[0]) === 'p(x, y) holds here · p(a, b) does-not-hold there' && asm.relational === 0;
  })());

// ═══ §10 C-6d (β) + (γ) — THE SURFACE: the J register on the selected cell's seams, pinned by BEHAVIOUR (rendered to a string under node, the store driven) and by SOURCE ═══
console.log("\n----- §10 ★★ C-6d (β) + (γ) — the J register's surface: the five states, the proposal above the offers, the group lines, exposure by side, the take, the fiat pair, none -----");
const React = require('react');
const { renderToString } = require('react-dom/server');
const { JRegisterPanel, SURFACE_BUDGET, groupLine, countsLine, exposureText } = req('src/components/JRegisterPanel.tsx');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const seedState = useGeometryStore.getState();
const seed = seedState.shapes[seedState.currentShapeId];
const seam = seed.edges[0];
const [cornerA, cornerB] = seam.vertexIds;
const withCasts = (A, B, identification) => ({
  ...seed,
  vertices: {
    ...seed.vertices,
    [cornerA]: { ...seed.vertices[cornerA], data: { ...seed.vertices[cornerA].data, cast: A } },
    [cornerB]: { ...seed.vertices[cornerB], data: { ...seed.vertices[cornerB].data, cast: B } },
  },
  edges: seed.edges.map((ed) => (ed.id === seam.id && identification ? { ...ed, identification } : ed)),
});
const rowsOf = (shape) => shape.edges.map((ed) => ({ edgeId: ed.id, vertexIds: ed.vertexIds, displayLabel: ed.vertexIds.join(' - ') }));
// React separates adjacent text expressions with `<!-- -->`; stripped here so a text capture reads a whole sentence
const render = (shape, tauDrafts = {}, budget = SURFACE_BUDGET) => renderToString(React.createElement(JRegisterPanel, { shape, edges: rowsOf(shape), tauDrafts, budget })).replace(/<!-- -->/g, '');
const unescapeHtml = (s) => (s ?? '').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
const attr = (html, name) => { const m = html.match(new RegExp(`${name}="([^"]*)"`)); return m ? unescapeHtml(m[1]) : null; };
const textOf = (html, name) => { const m = html.match(new RegExp(`${name}="[^"]*"[^>]*>([^<]*)<`)); return m ? unescapeHtml(m[1]) : null; };
const textsOf = (html, name) => [...html.matchAll(new RegExp(`${name}="[^"]*"[^>]*>([^<]*)<`, 'g'))].map((m) => unescapeHtml(m[1]));
const countOf = (html, name) => (html.match(new RegExp(`${name}="`, 'g')) || []).length;
const pairAttr = (html, pair, name) => { const m = html.match(new RegExp(`data-j-pair="${pair}" data-j-support="(\\d+)"( data-j-unbacked="true")?`)); return m ? (name === 'support' ? Number(m[1]) : Boolean(m[2])) : null; };
const ROLES3 = [['F5', 'Φ7'], ['F7', 'Φ1'], ['F8', 'Φ2']];
const noneAtAll = render(seed);
check("§10 ★★ A SEAM WHOSE CORNERS DO NOT BOTH HOLD A CAST HAS NO REGISTER — a true absence, no state attribute: the seed's six seams render six rows and no state; with casts on the two corners of one seam, exactly ONE row carries a state",
  countOf(noneAtAll, 'data-j-row') === 6 && countOf(noneAtAll, 'data-j-state') === 0 && countOf(render(withCasts(tri, tcell)), 'data-j-state') === 1);
const stateA = render(withCasts(tri, tcell));
check('§10 ★★ STATE 1 — EMPTY CORE (a) RENDERS ITS SENTENCE WITH THE τ INPUT BESIDE IT (the sentence IS the affordance): triangle × t-cell reads `no relation-type in common — a translation is yours to give`, the two type selects present, no offer, `no translation given — none proposed …` under τ (nothing shares a name)',
  attr(stateA, 'data-j-state') === 'empty core (a)' && textOf(stateA, 'data-j-sentence') === 'no relation-type in common — a translation is yours to give' &&
    countOf(stateA, 'data-j-tau-x') === 1 && countOf(stateA, 'data-j-tau-y') === 1 && countOf(stateA, 'data-j-offer') === 0 && countOf(stateA, 'data-j-tau-none') === 1 && countOf(stateA, 'data-j-proposed') === 0,
  J({ state: attr(stateA, 'data-j-state'), sentence: textOf(stateA, 'data-j-sentence') }));
check('§10 ★★ STATE 2 — EMPTY CORE (b): the device LOOKED — a cast with no relations against itself reads `no relation to agree on`',
  (() => {
    const bare = readCastFile(JSON.stringify({ roles: [{ id: 'x' }, { id: 'y' }], signature: [{ type: 'r', arity: 2 }], relations: [] })).cast;
    const h = render(withCasts(bare, bare));
    return attr(h, 'data-j-state') === 'empty core (b)' && textOf(h, 'data-j-sentence') === 'no relation to agree on';
  })());
const drafts3 = { [seam.id]: TAU3 };
const tiny = render(withCasts(flow, phi), drafts3, 10);
check("§10 ★★ STATE 3 — NOT COMPUTED (the device DID NOT LOOK) renders in the designer's words plus the budget in mine, exactly where the offers would have been (LAW 24 — the state RENDERS, not only returns): at a budget of 10 nodes Flow × Φ reads `not computed — this pair is beyond the budget (the register spends at most 10 nodes at a look; this pair needs more)`",
  attr(tiny, 'data-j-state') === 'not computed' && textOf(tiny, 'data-j-sentence') === 'not computed — this pair is beyond the budget' && tiny.includes('spends at most 10 nodes at a look; this pair needs more') && countOf(tiny, 'data-j-offer') === 0);
const proposalH = render(withCasts(flow, phi));
const proposalR = registerReading(flow, phi, undefined, SURFACE_BUDGET, { keepAll: true, countFull: false });
check("§10 ★★ STATE 4 — OFFERED UNDER THE DEVICE'S PROPOSAL ((γ) §1.1 · §2.5): with no τ given, the premise reads `proposed` — the header `τ — proposed by the device (same name, same arity)` with `disjoins ↦ disjoins · presupposes ↦ presupposes`, marked the device's, with `confirm as yours`; the mold's line `shared by the mold: member_status`; 9 offers; the group lines `relational weight 2 · 1 offer` and `relational weight 1 · 8 offers · 7 readings — within a reading they differ only by symmetry (this cast has 2, that one 1)`; NO tie header anywhere; the top offer's counts in the ratified words",
  attr(proposalH, 'data-j-state') === 'offered' && attr(proposalH, 'data-j-premise') === 'proposed' && attr(proposalH, 'data-j-proposed') === J([['disjoins', 'disjoins'], ['presupposes', 'presupposes']]) &&
    proposalH.includes('τ — proposed by the device (same name, same arity)') && proposalH.includes('disjoins ↦ disjoins · presupposes ↦ presupposes') && countOf(proposalH, 'data-j-confirm') === 1 &&
    textOf(proposalH, 'data-j-mold') === 'shared by the mold: member_status' && countOf(proposalH, 'data-j-offer') === 9 && countOf(proposalH, 'data-j-tie') === 0 &&
    J(textsOf(proposalH, 'data-j-group')) === J(['relational weight 2 · 1 offer', 'relational weight 1 · 8 offers · 7 readings — within a reading they differ only by symmetry (this cast has 2, that one 1)']) &&
    proposalR.state === 'offers' && textOf(proposalH, 'data-j-offer-counts') === 'relational weight 2 · 5 unrecorded · 1 known there only · types: 2 agree · 0 unknown' && !proposalH.includes('shared by name'),
  J({ state: attr(proposalH, 'data-j-state'), premise: attr(proposalH, 'data-j-premise'), proposed: attr(proposalH, 'data-j-proposed'), groups: textsOf(proposalH, 'data-j-group'), counts: textOf(proposalH, 'data-j-offer-counts'), mold: textOf(proposalH, 'data-j-mold') }));
const offered = render(withCasts(flow, phi), drafts3);
const readingAtSurface = registerReading(flow, phi, TAU3, SURFACE_BUDGET, { keepAll: true, countFull: false });
check("§10 ★★ STATE 4 — OFFERED UNDER A GIVEN τ: the proposal REPLACED (`given`), 16 offers (THE reading) in 14 readings (1 + 13), weight-ordered; the group lines `relational weight 4 · 1 offer` and `relational weight 2 · 15 offers · 13 readings — …`; the remaining by-name pair `disjoins ↦ disjoins` shown as PROPOSABLE with `add to yours`, not applied; the top offer's counts `relational weight 4 · 23 unrecorded · types: 3 agree · 0 unknown` (nothing exposed under τ₃ alone, so no exposure clause); `take none` offered; no given-mark; the reading sub-heading absent on the one-offer group",
  attr(offered, 'data-j-state') === 'offered' && attr(offered, 'data-j-premise') === 'given' && readingAtSurface.state === 'offers' && countOf(offered, 'data-j-offer') === 16 && countOf(offered, 'data-j-reading') === 14 &&
    J(textsOf(offered, 'data-j-group')) === J(['relational weight 4 · 1 offer', 'relational weight 2 · 15 offers · 13 readings — within a reading they differ only by symmetry (this cast has 2, that one 1)']) &&
    attr(offered, 'data-j-proposable') === J([['disjoins', 'disjoins']]) && countOf(offered, 'data-j-proposable-add') === 1 && countOf(offered, 'data-j-proposed') === 0 &&
    textOf(offered, 'data-j-offer-counts') === 'relational weight 4 · 23 unrecorded · types: 3 agree · 0 unknown' &&
    countOf(offered, 'data-j-take-none') === 1 && countOf(offered, 'data-j-given') === 0 && offered.indexOf('data-j-weight="4"') < offered.indexOf('data-j-weight="2"') && !offered.includes('reading 1 · 1 member'),
  J({ state: attr(offered, 'data-j-state'), premise: attr(offered, 'data-j-premise'), offers: countOf(offered, 'data-j-offer'), readings: countOf(offered, 'data-j-reading'), groups: textsOf(offered, 'data-j-group'), counts: textOf(offered, 'data-j-offer-counts'), proposable: attr(offered, 'data-j-proposable') }));
check("§10 ★★ τ IS PRINTED ABOVE THE OFFERS AS THE STATED PREMISE, its pairs marked as the person's (`yours`), each withdrawable; the mold's line beneath; nothing printed twice (no `shared under τ` line — the pairs are the τ block)",
  offered.indexOf('data-j-tau=') < offered.indexOf('data-j-offering=') && attr(offered, 'data-j-tau') === J(TAU3) &&
    countOf(offered, 'data-j-tau-pair') === 3 && countOf(offered, 'data-j-tau-withdraw') === 3 && (offered.match(/>yours</g) || []).length === 3 &&
    textOf(offered, 'data-j-mold') === 'shared by the mold: member_status' && !offered.includes('shared under τ') && !offered.includes('shared by name'));
check('§10 ★ THE TWO-ARITIES FACT IS A POSITIVE MARK on the shared line: `"r" is arity 2 here and arity 3 there — not a shared name`',
  (() => {
    const p = readCastFile(JSON.stringify({ roles: [{ id: 'x' }, { id: 'y' }], signature: [{ type: 'r', arity: 2 }], relations: [{ type: 'r', terms: ['x', 'y'], polarity: 'holds' }] })).cast;
    const q = readCastFile(JSON.stringify({ roles: [{ id: 'a' }, { id: 'b' }], signature: [{ type: 'r', arity: 3 }, { type: 's', arity: 2 }], relations: [{ type: 's', terms: ['a', 'b'], polarity: 'holds' }] })).cast;
    const h = unescapeHtml(render(withCasts(p, q)));
    return h.includes('"r" is arity 2 here and arity 3 there — not a shared name') && attr(h, 'data-j-state') === 'empty core (a)';
  })());
check("§10 ★★ THE COUNTS' WORDS ((γ) §2.2–2.3): exposure by side reads `2 known here only` · `1 known there only` · `known 1 here · 1 there`, nothing when none; the unary counts are ABSENT when no unary type is in force — triangle × triangle-symmetric renders `relational weight 3 · 3 unrecorded · 3 known there only` with no `types:`",
  exposureText(2, 0) === '2 known here only' && exposureText(0, 1) === '1 known there only' && exposureText(1, 1) === 'known 1 here · 1 there' && exposureText(0, 0) === null &&
    countsLine({ relational: 3, unrecorded: 3, exposureHere: 0, exposureThere: 3, typesAgree: 0, typesUnknown: 0 }, false) === 'relational weight 3 · 3 unrecorded · 3 known there only' &&
    (() => { const h = render(withCasts(tri, sym)); return textOf(h, 'data-j-offer-counts') === 'relational weight 3 · 3 unrecorded · 3 known there only' && !h.includes('types:'); })());
const given = render(withCasts(flow, phi, { roles: ROLES3, types: TAU3 }));
check("§10 ★★ STATE 5 — J GIVEN: the record on the edge renders the given-mark, each pair marked by its DERIVED support (F5↦Φ7 1 · F7↦Φ1 3 · F8↦Φ2 2), the counts of the given J in the ratified words, `withdraw` offered, `take none` gone; the offer whose pairs are the record's wears `given — this one`",
  attr(given, 'data-j-state') === 'given' && attr(given, 'data-j-given') === 'pairs' && pairAttr(given, 'F5↦Φ7', 'support') === 1 && pairAttr(given, 'F7↦Φ1', 'support') === 3 && pairAttr(given, 'F8↦Φ2', 'support') === 2 &&
    textOf(given, 'data-j-given-counts') === 'relational weight 4 · 23 unrecorded · types: 3 agree · 0 unknown' &&
    countOf(given, 'data-j-withdraw') === 1 && countOf(given, 'data-j-take-none') === 0 && countOf(given, 'data-j-offer-given') === 1 && given.includes('given — this one') && countOf(given, 'data-j-unbacked') === 0,
  J({ state: attr(given, 'data-j-state'), given: attr(given, 'data-j-given'), counts: textOf(given, 'data-j-given-counts') }));
const fiat = unescapeHtml(render(withCasts(flow, phi, { roles: [...ROLES3, ['F1', 'Φ9']], types: TAU3 })));
check("§10 ★★ A FIAT PAIR IS VISIBLY DISTINCT and its conflict is printed BY NAME beside it: F1↦Φ9 added to the taken J reads `support 0 — yours, backed by no offer under this τ` with `in conflict: member_status: F1 has · Φ9 none-by-nature` under it (the mold's key, by name); the three offered pairs keep their supports; the third value lives only there (no count of conflicts anywhere)",
  attr(fiat, 'data-j-state') === 'given' && pairAttr(fiat, 'F1↦Φ9', 'support') === 0 && pairAttr(fiat, 'F1↦Φ9', 'unbacked') === true && fiat.includes('support 0 — yours, backed by no offer under this τ') &&
    countOf(fiat, 'data-j-conflict') === 1 && fiat.includes('in conflict: member_status: F1 has · Φ9 none-by-nature') && pairAttr(fiat, 'F7↦Φ1', 'support') === 3 && !/conflicts?:\s*\d/.test(fiat));
const tauChanged = unescapeHtml(render(withCasts(flow, phi, { roles: ROLES3, types: [['sustains', 'descends-from']] })));
check("§10 ★ A TAKEN J SURVIVES A τ CHANGE as the person's record and its marks RE-DERIVE: with τ cut to sustains↦descends-from alone the same three pairs read F5 1 · F7 1 · F8 0 — the third now `yours, backed by no offer under this τ` (the same mark as a fiat pair, because it is the same fact), never erased by the device",
  attr(tauChanged, 'data-j-state') === 'given' && pairAttr(tauChanged, 'F5↦Φ7', 'support') === 1 && pairAttr(tauChanged, 'F7↦Φ1', 'support') === 1 && pairAttr(tauChanged, 'F8↦Φ2', 'support') === 0 && pairAttr(tauChanged, 'F8↦Φ2', 'unbacked') === true && countOf(tauChanged, 'data-j-pair') === 3);
const none = render(withCasts(flow, phi, { roles: [], types: TAU3 }));
check('§10 ★★ `none` IS A TAKE TOO: the record with no pairs renders `nothing identified` WITH the given-mark — never an empty field — and is withdrawable',
  attr(none, 'data-j-state') === 'given' && attr(none, 'data-j-given') === 'none' && countOf(none, 'data-j-nothing-identified') === 1 && countOf(none, 'data-j-withdraw') === 1 && countOf(none, 'data-j-pair') === 0);
check("§10 ★★ THE GROUP LINE ((γ) §2.1, the designer's ruling — the tie sentence ON the group, only when it holds more than one offer): triangle × triangle-symmetric renders `relational weight 3 · 6 offers · 1 reading — within a reading they differ only by symmetry (this cast has 3, that one 6)`; t-cell × t-cell renders its ten offers under `relational weight 11 · 1 offer` … `relational weight 3 · 4 offers · 4 readings — …` with the seal's counts on the identity and NO exposure clause (none)",
  (() => {
    const symH = render(withCasts(tri, sym));
    const tH = render(withCasts(tcell, tcell));
    return J(textsOf(symH, 'data-j-group')) === J(['relational weight 3 · 6 offers · 1 reading — within a reading they differ only by symmetry (this cast has 3, that one 6)']) && countOf(symH, 'data-j-offer') === 6 && countOf(symH, 'data-j-reading') === 1 &&
      groupLine(1, 8, 7, [2, 1], true) === 'relational weight 1 · 8 offers · 7 readings — within a reading they differ only by symmetry (this cast has 2, that one 1)' && groupLine(2, 1, 1, [2, 1], true) === 'relational weight 2 · 1 offer' &&
      J(textsOf(tH, 'data-j-group')) === J(['relational weight 11 · 1 offer', 'relational weight 8 · 1 offer', 'relational weight 4 · 1 offer', 'relational weight 3 · 4 offers · 4 readings — within a reading they differ only by symmetry (this cast has 1, that one 1)', 'relational weight 2 · 3 offers · 3 readings — within a reading they differ only by symmetry (this cast has 1, that one 1)']) &&
      countOf(tH, 'data-j-offer') === 10 && textOf(tH, 'data-j-offer-counts') === 'relational weight 11 · 1489 unrecorded · types: 10 agree · 0 unknown' && countOf(tH, 'data-j-tie') === 0;
  })());
check("§10 ★★ T × Φ AT THE SURFACE under {answers-to ↦ decays}: EMPTY CORE (b) — `no relation to agree on · 1 matching refused by a type on the roles` — the measured one, by the mold's name",
  (() => { const h = render(withCasts(tcell, phi), { [seam.id]: TAU_A }); return attr(h, 'data-j-state') === 'empty core (b)' && attr(h, 'data-j-premise') === 'given' && textOf(h, 'data-j-sentence') === 'no relation to agree on' && h.includes('1 matching refused by a type on the roles') && textOf(h, 'data-j-mold') === 'shared by the mold: member_status'; })());
// the store, by behaviour: the record's one writer, `roles` and `types` only; τ before a take in the draft; no history entry
check('§10 ★★ THE STORE, BY BEHAVIOUR: τ given before a take lands in the draft (the record untouched); the take writes the record `{ roles, types }` — those two keys and no other — and clears the draft; a τ change on a taken J changes `types` and keeps `roles`; a fiat take extends `roles`; `none` is `roles: []`; withdrawing hands τ back to the draft and removes the record; no history entry is pushed by any of it',
  (() => {
    const before = useGeometryStore.getState();
    const shape = withCasts(flow, phi);
    useGeometryStore.setState({ shapes: { ...before.shapes, [shape.id]: shape }, edgeTauDrafts: {} });
    const s = () => useGeometryStore.getState();
    const edge = () => s().shapes[s().currentShapeId].edges.find((ed) => ed.id === seam.id);
    const history = s().operationHistory.length;
    s().setEdgeTau(seam.id, TAU3);
    const draftHeld = J(s().edgeTauDrafts[seam.id]) === J(TAU3) && edge().identification === undefined;
    s().takeEdgeIdentification(seam.id, ROLES3);
    const taken = J(edge().identification) === J({ roles: ROLES3, types: TAU3 }) && J(Object.keys(edge().identification).sort()) === '["roles","types"]' && s().edgeTauDrafts[seam.id] === undefined;
    s().setEdgeTau(seam.id, [['sustains', 'descends-from']]);
    const tauChangedRec = J(edge().identification.roles) === J(ROLES3) && J(edge().identification.types) === J([['sustains', 'descends-from']]);
    s().takeEdgeIdentification(seam.id, [...ROLES3, ['F1', 'Φ9']]);
    const fiatRec = edge().identification.roles.length === 4 && J(edge().identification.types) === J([['sustains', 'descends-from']]);
    s().withdrawEdgeIdentification(seam.id);
    const withdrawn = edge().identification === undefined && J(s().edgeTauDrafts[seam.id]) === J([['sustains', 'descends-from']]);
    s().takeEdgeIdentification(seam.id, []);
    const noneRec = J(edge().identification) === J({ roles: [], types: [['sustains', 'descends-from']] });
    const noHistory = s().operationHistory.length === history && s().undoStack.length === before.undoStack.length;
    useGeometryStore.setState({ shapes: before.shapes, edgeTauDrafts: {} });
    return draftHeld && taken && tauChangedRec && fiatRec && withdrawn && noneRec && noHistory;
  })());
// source pins
const panelSrc = readLf('src/components/JRegisterPanel.tsx');
const panelsSrc = readLf('src/components/Panels.tsx');
const storeSrc = readLf('src/store/geometryStore.ts');
check("§10 ★ SOURCE: the register is MOUNTED in the selection panel once, before the Layer 3 Witness and before the composition, under the selected cell; the panel imports the register's arithmetic, the store and the types — nothing from the manuscript, the explore window, three or the camera",
  (panelsSrc.match(/<JRegisterPanel /g) || []).length === 1 && panelsSrc.indexOf('id="selection-j-register"') < panelsSrc.indexOf('id="selection-layer3-witness"') && panelsSrc.indexOf('id="selection-j-register"') < panelsSrc.indexOf('id="selection-composition"') &&
    panelsSrc.includes("import { JRegisterPanel } from './JRegisterPanel';") &&
    (panelSrc.match(/from '[^']+';/g) || []).every((clause) => /^from '(react|\.\.\/lib\/jRegister|\.\.\/store\/geometryStore|\.\.\/types\/geometry)';$/.test(clause)) && (panelSrc.match(/from '[^']+';/g) || []).length === 4 &&
    !/\bcamera\b|ExploreWindow|manuscript/i.test(panelSrc.replace(/^\s*\/\/.*$/gm, '')));
check("§10 ★ SOURCE — RECORD, NOT READING: the panel never writes the store (no `setState`, no `set(`) — it calls exactly the three actions; it never reads `identification.support` or `.fiat` (both derived by `assess` at every render); the store's one writer writes `roles` and `types` and no other key",
  !/setState\(|\bset\(/.test(panelSrc) && ['setEdgeTau', 'takeEdgeIdentification', 'withdrawEdgeIdentification'].every((act) => panelSrc.includes(`state.${act}`)) &&
    !/identification\.(support|fiat)|\.support\?\.|\.fiat\b/.test(panelSrc) && panelSrc.includes('assess(X, Y, new Map(identification.roles), shared)') &&
    /identification: \{\s*roles: next\.roles\.map[^}]*types: next\.types\.map[^}]*\}/s.test(storeSrc) && !/identification: \{[^}]*(support|fiat)/s.test(storeSrc));
check("§10 ★ SOURCE: the five states are five sentences, each its own words; ALL offers rendered (no slice, no threshold, no \"top N\"); the tie header is GONE ((γ) §2.1) — no `data-j-tie`, no `tied ·` in the panel; the proposal is marked the device's and needs a confirm act; `known on one side only` is gone",
  panelSrc.includes("'no relation-type in common — a translation is yours to give'") && panelSrc.includes("'not computed — this pair is beyond the budget'") && panelSrc.includes('reading.sentence') &&
    !/\.slice\(0,\s*\d|threshold|topN|top \d/i.test(panelSrc) && panelSrc.includes('reading.readings.map((w) =>') &&
    !panelSrc.includes('data-j-tie') && !panelSrc.includes('tied ·') && panelSrc.includes('data-j-confirm') && panelSrc.includes('proposed by the device') && !panelSrc.includes('known on one side only'));

// ═══ §6 boundaries, source-pinned ═══
const src = readLf('src/lib/jRegister.ts');
check("§6 ⛔ NO STORE, NO WRITTEN J: the module is pure over two ConceptSpaces and an optional τ — it imports only the types and the mold's ONE constant from the loader, and nothing under the store imports it",
  /import type \{ ConceptSpace, EdgeIdentification \} from '\.\.\/types\/geometry';/.test(src) && src.includes("import { MOLD_TYPES } from './castLoader';") && (src.match(/^import /gm) || []).length === 2 &&
    !/from '\.\.\/store|from '\.\.\/components|useGeometryStore|updateSelected/.test(src) &&
    !fs.readFileSync(path.join(repoRoot, 'src/store/geometryStore.ts'), 'utf8').includes('jRegister'));
check('§6 RECORD, NOT READING: `support` is DERIVED at every read (the assessment computes it; nothing reads `identification.support` or `.fiat` back)',
  src.includes('support: Record<string, number>') && !/\.support\b(?!\[)/.test(src.replace(/support: Record<string, number>/g, '').replace(/ev\.support|coreEv\.support|ext\.support|\.support\[/g, '')) && !src.includes('.fiat'));

console.log(`\n${failures === 0 ? "DIAGNOSE-THE-J-REGISTER: ALL PASS — the second implementation reads the seal's numbers under τ as the person's, the mold's types by definition, the offers follow relational support, the unary home refuses and is counted apart, and the surface renders the proposal, the group lines, the counts by side, the take and the fiat pair by name" : `DIAGNOSE-THE-J-REGISTER: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

#!/usr/bin/env node

// SWEEP-CEILING: 900s — I-1 clause 3 (C-6c (vii)): this leg's honest standalone
// runtime was 242 s at the (vii) tree and 44 s at the (α) re-pin, 73 s beside a
// concurrent run (the corrected
// clause drives the search by the relational tuples alone) — measured at each
// change, the number in that commit's report. Left standing: the leg grows with
// every stamp on the register, and the field leg was killed in this neighbourhood. Declared so a red here means a red, never a load; a hang
// still dies at 900 s and prints TIMEOUT by name.

// DIAGNOSTIC — THE J REGISTER'S QUANTITIES (STAMP C-6d (α), 2026-09-19, with
// the MARKERs 1835 + 2030 and the ratio fix 2310 §0): the second implementation,
// RUN on the fixture pairs, pinned to the researcher's seal (their instruments
// j_register_quantities.py · offers_count.py · flow_phi_offers_under_tau.py,
// every one RUN by the coder at this tree, and the mothership's own runs). A
// disagreement reopens the DEFINITION, never tunes the code: it is reported,
// not fitted — and it did reopen it once, on the third pair (§3's negative).
//
// THE CORRECTED CLAUSE: WEIGHT and SUPPORT are the RELATIONAL agreements
// (arity ≥ 2); the unary home REFUSES on conflict and is PRINTED as its own
// two counts (`types: a agree · u unknown` — two counts, never a ratio).
// Clause 2 as AMENDED (the researcher's 1632): an OFFER is a maximal
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
const { registerReading, recordOf, automorphisms, sharedSignature, gaugeOrbits, assess, evaluate, describeConflict } = req('src/lib/jRegister.ts');
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

console.log("THE J REGISTER'S QUANTITIES — the second implementation against the researcher's seal (C-6d (α), corrected)\n");

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

// ═══ §1 triangle × triangle-symmetric ═══
const a = registerReading(tri, sym);
check("§1 ★★ triangle × triangle-symmetric: |Aut| 3 / 6 · top weight 3 · 6 tied · 1 orbit · the top offer's exposure 3 · unrecorded 3 · consistent full injections 6 (every number the seal's; no unary home, so `types: 0 agree · 0 unknown`)",
  a.state === 'offers' && a.aut[0] === 3 && a.aut[1] === 6 && a.topWeight === 3 && a.tied === 6 && a.orbits === 1 &&
    a.offers[0].exposure === 3 && a.offers[0].unrecorded === 3 && a.consistentFull === 6 && a.offers[0].typesAgree === 0 && a.offers[0].typesUnknown === 0,
  JSON.stringify(a).slice(0, 400));
check('§1 …the vacuity check, named: |Aut| 6 and 6 tied are FORCED by full symmetry — a control, not evidence; exposure 3 is 6 − 3',
  a.state === 'offers' && a.offers.every((o) => o.pairs.length === 3 && o.exposure === 3));

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
check('§3 ★★ t-cell × t-cell: |Aut| 1 / 1 · RELATIONAL weight 11 (the 11 tuples; the 10 unary agreements no longer in it) · 1 tied · 1 orbit · exposure 0 · unrecorded 1489 (1510 − 11 − 10 — the remainder runs over the shared signature INCLUDING the unary type: 5 binary types × 100 + removes 1000 + member_status 10) · consistent full injections 3,104,904',
  c.state === 'offers' && c.aut[0] === 1 && c.aut[1] === 1 && c.topWeight === 11 && c.tied === 1 && c.orbits === 1 &&
    c.offers[0].exposure === 0 && c.offers[0].unrecorded === 1489 && c.consistentFull === 3104904, JSON.stringify({ ...c, offers: c.offers && c.offers.slice(0, 1), readings: undefined }).slice(0, 500));
check("§3 ★★ THE SEAL'S LINE, in the ratified words (2310 §0 — two counts, never a ratio): `relational weight 11 · 1489 unrecorded · types: 10 agree · 0 unknown`",
  c.state === 'offers' && sealLine(c.offers[0]) === 'relational weight 11 · 1489 unrecorded · types: 10 agree · 0 unknown', c.state === 'offers' && sealLine(c.offers[0]));
check('§3 ★ the top offer is the identity with the per-pair support of the RELATIONAL agreements alone: r0 5 · r1 5 · r2 3 · r3 1 · r4 1 · r5 1 · r6 2 · r7 1 · r8 3 · r9 1 (the sealed line of (α) minus the one unary count each role carried — 23 endpoint incidences: 10 binary × 2 + removes × 3)',
  c.state === 'offers' && c.offers[0].pairs.every(([x, y]) => x === y) && c.offers[0].pairs.length === 10 &&
    supportLine(c.offers[0]) === 'r0 5 · r1 5 · r2 3 · r3 1 · r4 1 · r5 1 · r6 2 · r7 1 · r8 3 · r9 1', c.state === 'offers' && supportLine(c.offers[0]));
if (c.state === 'offers') note(`t-cell × t-cell took ${c.millis} ms · ${c.nodes} nodes in all (the offers search's budget 5,000,000 nodes; the full-injection count's 20,000,000) — the researcher's Python enumeration took 96 s`);
const k = registerReading(tcell, tcell, undefined, 5_000_000, { keepAll: true, countFull: false });
check('§3 ★★ THE TEN OFFERS (the researcher\'s offers_count.py, RUN by me: 9 s; renumbered by 2030): 10 distinct offers by relational weight 11 (size 10) · 8 (9) · 4 (7) · 3 ×4 (size 5, 4 orbits) · 2 ×3 (size 4, 3 orbits) — the same order as the (α) seal\'s 21 · 17 · 11 · 8 · 6, each minus its size',
  k.state === 'offers' && k.offers.length === 10 && distributionOf(k) === '11×1 · 8×1 · 4×1 · 3×4 · 2×3' && JSON.stringify(groupsOf(k)) === '[1,1,1,4,3]' &&
    JSON.stringify(k.readings.map((w) => w.groups.flat().map((o) => o.pairs.length))) === '[[10],[9],[7],[5,5,5,5],[4,4,4]]',
  k.state === 'offers' ? `${k.offers.length} offers · ${distributionOf(k)} · groups ${JSON.stringify(groupsOf(k))} · sizes ${JSON.stringify(k.readings.map((w) => w.groups.flat().map((o) => o.pairs.length)))}` : k.state);
if (k.state === 'offers') note(`the whole offering (keep-all, no full count) took ${k.millis} ms · ${k.nodes} nodes`);
check('§3 ★ LAW 24 — THE DEFINITION DECIDES, NOT THE ARITHMETIC: under the UNCORRECTED clause (a shared unary value supports a pair) every conflict-free full injection of this fixture is a maximal supported core — the constant `member_status: has` on all ten roles backs every pair equally, i.e. backs none — so the offer count would be the register\'s own consistent-full count, 3,104,904 (RUN here; the researcher\'s offers_count.py names the same number); the same fixture under the corrected clause reads TEN',
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

// ═══ §4 the empty core, both ways ═══
const d = registerReading(tri, tcell);
check('§4 ★★ triangle × t-cell: EMPTY CORE (a) — `no relation-type in common — a translation is yours to give`',
  d.state === 'empty core (a)' && d.sentence === 'no relation-type in common — a translation is yours to give', JSON.stringify(d));
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
      withTau.state === 'offers' && withTau.topWeight === 1 && withTau.offers[0].pairs.length === 2 && JSON.stringify(withTau.sharedUnderTau) === '[["r","s"]]';
  })());
check('§4 ★ THE UNARY HOME ALONE MAKES NO CORE (the corrected clause): two casts sharing only a categorical key read EMPTY CORE (a) with the key named as shared; a τ on their relation-types then offers, the unary agreements printed beside the weight, never in it',
  (() => {
    const p = readCastFile(JSON.stringify({ roles: [{ id: 'x', types: { k: 'has' } }, { id: 'y', types: { k: 'has' } }], signature: [{ type: 'p', arity: 2 }], relations: [{ type: 'p', terms: ['x', 'y'], polarity: 'holds' }] }));
    const q = readCastFile(JSON.stringify({ roles: [{ id: 'a', types: { k: 'has' } }, { id: 'b', types: { k: 'has' } }], signature: [{ type: 'q', arity: 2 }], relations: [{ type: 'q', terms: ['a', 'b'], polarity: 'holds' }] }));
    const none = registerReading(p.cast, q.cast);
    const withTau = registerReading(p.cast, q.cast, [['p', 'q']]);
    return none.state === 'empty core (a)' && JSON.stringify(none.sharedUnary) === '["k"]' &&
      withTau.state === 'offers' && withTau.topWeight === 1 && withTau.offers[0].typesAgree === 2 && withTau.offers[0].typesUnknown === 0 && pairsOf(withTau.offers[0]) === 'x↦a · y↦b';
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

// ═══ §7 THE WILD SEAL — Flow × Φ under the researcher's EXACT instrument (flow_phi_offers_under_tau.py, RUN by me: identical to their RESULTS file) with ITS τ maps, BOTH homes ═══
console.log("\n----- §7 ★★ the wild seal — Flow × Φ (hinge_data.py) under the instrument's exact τ maps, both homes, the corrected clause -----");
const flow = cast('flow.cast.json');
const phi = cast('phi.cast.json');
// THE PREMISE, DISCLOSED: the (vii) witness pinned τ maps read off the 09-08 instrument's OWN τ-search output at the
// coder's run (edge_candidates_partial_isomorphism.py searches τ; several τs reach the same core, and it printed
// `presupposes↦lodges-in · exceeds-in-size↦specifies`); the seal names ONE τ per line — the 09-19 reference file's
// literals below (its lines 126–130) — and those are pinned verbatim. The size-3 core's four agreements ride
// sustains↦descends-from alone (pinned in this section), which is why the two transcriptions agreed on the core.
const TAU3 = [['sustains', 'descends-from'], ['presupposes', 'specifies'], ['exceeds-in-size', 'lodges-in']];
const TAU4 = [['generates', 'specifies'], ['sustains', 'descends-from'], ['exceeds-in-speed', 'transmits'], ['precedes', 'component-of']];
const WILD_BUDGET = 1_000_000;
const w3 = registerReading(flow, phi, TAU3, WILD_BUDGET, { keepAll: true, countFull: false });
const w4 = registerReading(flow, phi, TAU4, WILD_BUDGET, { keepAll: true, countFull: false });
const wName = registerReading(flow, phi, undefined, WILD_BUDGET, { keepAll: true, countFull: false });
check('§7 ★★ |Aut(Flow)| = 2 (the F10/F11 twins) · |Aut(Φ)| = 1 — read on the whole record, both homes',
  w3.state === 'offers' && w3.aut[0] === 2 && w3.aut[1] === 1 && w3.autComplete, JSON.stringify(w3.state === 'offers' ? w3.aut : w3));
// THE DIVERGENCE FOUND, NOT MANUFACTURED (§1: find the mechanism): the instrument's `evaluate` reads `if t not in
// tau: continue` — under a τ it shares τ's types ONLY — while the ruling's words (1621: by NAME with the same arity …
// and the person's τ makes differently-named types shared) make τ ADD to the types shared by name. Flow and Φ share
// `disjoins` and `presupposes` by name; τ₃ names `presupposes` (so `disjoins` is the difference), τ₄ names neither.
// The register reads the seal TO THE DIGIT under the instrument's reading (the by-name types renamed away in a copy of
// Flow, so only τ shares) and reads MORE under the ruling's words — the same top offers, more beneath. Which reading
// is the definition is the mothership's line; both are pinned here, and the pin on the ruling's reading changes with it.
const renamedAway = (c, names) => ({
  ...c,
  signature: c.signature.map((s) => (names.includes(s.type) ? { ...s, type: `${s.type}·not-shared` } : s)),
  relations: c.relations.map((r) => (names.includes(r.type) ? { ...r, type: `${r.type}·not-shared` } : r)),
});
const flowTauOnly3 = renamedAway(flow, ['disjoins']);
const flowTauOnly4 = renamedAway(flow, ['disjoins', 'presupposes']);
const s3 = registerReading(flowTauOnly3, phi, TAU3, WILD_BUDGET, { keepAll: true, countFull: false });
const s4 = registerReading(flowTauOnly4, phi, TAU4, WILD_BUDGET, { keepAll: true, countFull: false });
check("§7 ★★ THE SEAL under τ₃ {sustains↦descends-from · presupposes↦specifies · exceeds-in-size↦lodges-in}, the instrument's reading (τ's types only — `disjoins`, shared by name, renamed away): 16 offers · TOP relational weight 4: ONE, size 3 {F5↦Φ7, F7↦Φ1, F8↦Φ2}, support F5 1 · F7 3 · F8 2, types: 3 agree · 0 unknown · 1 reading; weight 2: 15 offers (sizes 3 ×14, 2 ×1) · 13 readings (the twins collapse two pairs) — every number the seal's",
  s3.state === 'offers' && s3.offers.length === 16 && s3.topWeight === 4 && s3.tied === 1 && s3.orbits === 1 && pairsOf(s3.offers[0]) === 'F5↦Φ7 · F7↦Φ1 · F8↦Φ2' &&
    supportLine(s3.offers[0]) === 'F5 1 · F7 3 · F8 2' && s3.offers[0].typesAgree === 3 && s3.offers[0].typesUnknown === 0 &&
    s3.readings[1].weight === 2 && s3.readings[1].groups.flat().length === 15 && s3.readings[1].groups.length === 13 &&
    JSON.stringify(s3.readings[1].groups.flat().map((o) => o.pairs.length).sort()) === JSON.stringify([2, ...Array(14).fill(3)]),
  s3.state === 'offers' ? `${s3.offers.length} offers · ${distributionOf(s3)} · groups ${JSON.stringify(groupsOf(s3))} · top ${pairsOf(s3.offers[0])} · ${supportLine(s3.offers[0])} · ${sealLine(s3.offers[0])}` : s3.state);
check("§7 ★★ THE SEAL under τ₄ {generates↦specifies · sustains↦descends-from · exceeds-in-speed↦transmits · precedes↦component-of}, the instrument's reading (`disjoins` and `presupposes` renamed away): 37 offers · TOP weight 5: ONE, size 5 {F1↦Φ3, F2↦Φ2, F3↦Φ4, F5↦Φ1, F7↦Φ7}, support F1 1 · F2 2 · F3 1 · F5 3 · F7 1, types: 5 agree · 1 reading; weight 4: 5 (5 readings) · weight 3: 24 (24) · weight 2: 7 (7)",
  s4.state === 'offers' && s4.offers.length === 37 && s4.topWeight === 5 && s4.tied === 1 && s4.orbits === 1 && pairsOf(s4.offers[0]) === 'F1↦Φ3 · F2↦Φ2 · F3↦Φ4 · F5↦Φ1 · F7↦Φ7' &&
    supportLine(s4.offers[0]) === 'F1 1 · F2 2 · F3 1 · F5 3 · F7 1' && s4.offers[0].typesAgree === 5 &&
    distributionOf(s4) === '5×1 · 4×5 · 3×24 · 2×7' && JSON.stringify(groupsOf(s4)) === '[1,5,24,7]',
  s4.state === 'offers' ? `${s4.offers.length} offers · ${distributionOf(s4)} · groups ${JSON.stringify(groupsOf(s4))} · top ${pairsOf(s4.offers[0])} · ${supportLine(s4.offers[0])}` : s4.state);
check("§7 ★★ THE DIVERGENCE, MEASURED AND NAMED (reported, not tuned): under the RULING's words τ ADDS to the by-name sharing — `disjoins` stays shared under τ₃, `disjoins` and `presupposes` under τ₄ — and the register reads the SAME top offers with MORE offers beneath: τ₃ 18 offers (4×1 · 2×17; 15 readings at weight 2), τ₄ 62 (5×1 · 4×14 · 3×30 · 2×17); the instrument shares τ's types only (`if t not in tau: continue`); which reading is the definition is the mothership's line — this pin follows the ruling as written and changes with it",
  w3.state === 'offers' && w3.offers.length === 18 && distributionOf(w3) === '4×1 · 2×17' && JSON.stringify(groupsOf(w3)) === '[1,15]' && pairsOf(w3.offers[0]) === 'F5↦Φ7 · F7↦Φ1 · F8↦Φ2' && w3.shared.includes('disjoins') &&
    w4.state === 'offers' && w4.offers.length === 62 && distributionOf(w4) === '5×1 · 4×14 · 3×30 · 2×17' && JSON.stringify(groupsOf(w4)) === '[1,14,30,13]' && pairsOf(w4.offers[0]) === 'F1↦Φ3 · F2↦Φ2 · F3↦Φ4 · F5↦Φ1 · F7↦Φ7' && w4.shared.includes('presupposes'),
  JSON.stringify([w3, w4].map((r) => (r.state === 'offers' ? `${r.offers.length} · ${distributionOf(r)} · ${JSON.stringify(groupsOf(r))} · ${pairsOf(r.offers[0])}` : r.state))));
check('§7 ★★ THE 09-08 RECORD CORRECTED (LAW 24): the 09-08 "size-4 rival" {F1↦Φ3, F2↦Φ2, F3↦Φ4, F5↦Φ1} is NO offer under its own τ₄ — it is the SUB-CORE of the size-5 top offer, extended by F7↦Φ7 (sustains(F7,F7) ↦ descends-from(Φ7,Φ7)); the 09-08 |J| = 5 search was SAMPLED, and the tie at weight 4 between sizes 3 and 4 holds only ACROSS τs',
  w4.state === 'offers' && !w4.offers.some((o) => pairsOf(o) === 'F1↦Φ3 · F2↦Φ2 · F3↦Φ4 · F5↦Φ1') &&
    [['F1', 'Φ3'], ['F2', 'Φ2'], ['F3', 'Φ4'], ['F5', 'Φ1']].every(([x, y]) => w4.offers[0].pairs.some(([px, py]) => px === x && py === y)) &&
    w4.offers[0].pairs.some(([x, y]) => x === 'F7' && y === 'Φ7'));
check('§7 ★ under τ_name (no τ — disjoins and presupposes shared by name, plus member-status): 9 offers · top weight 2: ONE, size 2 {F2↦Φ7, F4↦Φ1} · weight 1: 8 offers (7 readings)',
  wName.state === 'offers' && wName.offers.length === 9 && wName.topWeight === 2 && wName.tied === 1 && pairsOf(wName.offers[0]) === 'F2↦Φ7 · F4↦Φ1' &&
    JSON.stringify([...wName.sharedByName].sort()) === '["disjoins","presupposes"]' && JSON.stringify(wName.sharedUnary) === '["member-status"]' &&
    wName.readings[1].weight === 1 && wName.readings[1].groups.flat().length === 8 && wName.readings[1].groups.length === 7,
  wName.state === 'offers' ? `${wName.offers.length} offers · ${distributionOf(wName)} · groups ${JSON.stringify(groupsOf(wName))} · top ${pairsOf(wName.offers[0])} · shared ${JSON.stringify(wName.sharedByName)}` : wName.state);
check('§7 ★ NO offer touches Φ9 under any τ, and NONE was refused by member-status — no translated type reaches Φ9 (`decays`, `fills` lie outside all three); the zero is MEASURED with the key shared by name on both casts (`member-status`), beside §9\'s measured one',
  [w3, w4, wName].every((r) => r.state === 'offers' && !r.offers.some((o) => o.pairs.some(([, y]) => y === 'Φ9')) && r.unaryRefusals === 0 && r.sharedUnary.includes('member-status')),
  JSON.stringify([w3, w4, wName].map((r) => (r.state === 'offers' ? { refusals: r.unaryRefusals, phi9: r.offers.some((o) => o.pairs.some(([, y]) => y === 'Φ9')) } : r.state))));
check("§7 ★ THE PREMISE DISCLOSED, MEASURED — and the mothership's inference falsified: the size-3 core's four agreements do NOT ride sustains↦descends-from alone — they are sustains(F5,F5)↦descends-from(Φ7,Φ7) · sustains(F7,F7)↦descends-from(Φ1,Φ1) · presupposes(F8,F7)↦specifies(Φ2,Φ1) · exceeds-in-size(F8,F7)↦lodges-in(Φ2,Φ1); the two seats' transcriptions of τ₃ agreed on the core because the Flow pair (F8,F7) holds BOTH presupposes and exceeds-in-size and the Φ pair (Φ2,Φ1) holds BOTH specifies and lodges-in — swapping the two τ targets swaps which tuple matches which, and the count stays 4; under sustains↦descends-from alone the top is weight 2, 8 tied, and the core is not reached",
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
    const TAU3_VII = [['sustains', 'descends-from'], ['presupposes', 'lodges-in'], ['exceeds-in-size', 'specifies']];
    const alone = registerReading(flow, phi, [['sustains', 'descends-from']], WILD_BUDGET, { countFull: false });
    return JSON.stringify(agreementsUnder(TAU3)) === JSON.stringify(['exceeds-in-size(F8,F7)↦lodges-in', 'presupposes(F8,F7)↦specifies', 'sustains(F5,F5)↦descends-from', 'sustains(F7,F7)↦descends-from']) &&
      JSON.stringify(agreementsUnder(TAU3_VII)) === JSON.stringify(['exceeds-in-size(F8,F7)↦specifies', 'presupposes(F8,F7)↦lodges-in', 'sustains(F5,F5)↦descends-from', 'sustains(F7,F7)↦descends-from']) &&
      alone.state === 'offers' && alone.topWeight === 2 && alone.tied === 8 && !alone.offers.some((o) => pairsOf(o) === 'F5↦Φ7 · F7↦Φ1 · F8↦Φ2');
  })());
const wFull = registerReading(flow, phi, TAU3, WILD_BUDGET);
check('§7 ★ THE BUDGET AT THE REAL PAIR, measured: the offers are found inside a 1,000,000-node budget (the tuple-driven search — the nodes in the note), and the full-injection COUNT (P(14,9) = 726,485,760 injections) is beyond its 4,000,000-node budget and says so as `null`, never a number',
  wFull.state === 'offers' && wFull.consistentFull === null && wFull.topWeight === 4, JSON.stringify(wFull.state === 'offers' ? { full: wFull.consistentFull, nodes: wFull.nodes } : wFull));
if (w3.state === 'offers' && w4.state === 'offers' && wName.state === 'offers') note(`Flow × Φ whole offerings (keep-all, no full count): τ₃ ${w3.millis} ms · ${w3.nodes} nodes; τ₄ ${w4.millis} ms · ${w4.nodes} nodes; by name ${wName.millis} ms · ${wName.nodes} nodes; with the full count under τ₃ ${wFull.state === 'offers' ? `${wFull.millis} ms · ${wFull.nodes} nodes` : wFull.state}`);

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
distribution('Flow × Φ (by name)', flow, phi);
distribution("Flow × Φ (τ₃, the instrument's reading: τ's types only)", flowTauOnly3, phi, TAU3);
distribution("Flow × Φ (τ₄, the instrument's reading: τ's types only)", flowTauOnly4, phi, TAU4);
note('(a distribution that reads `beyond the budget` is the keep-all search past 1,000,000 nodes — the count is not known, and is not guessed)');

// ═══ §9 THE UNARY REFUSAL'S POSITIVE CONTROL (LAW 24, MARKER 2030 §2): T × Φ under answers-to↦decays ═══
console.log("\n----- §9 the unary refusal's positive control — T × Φ under answers-to↦decays -----");
// THE FACT, measured: the T cell's key is `member_status` (first_face_and_tower.py) and Φ's is `member-status`
// (hinge_data.py) — by name they are NOT one key. The refusal fires only when the person's τ translates the
// unary key too (arity 1 ↦ 1, arity-preserving — a categorical key is a type of arity 1 in the roles' home).
const T = recordOf(tcell);
const P = recordOf(phi);
const TAU_A = [['answers-to', 'decays']];
const TAU_B = [['answers-to', 'decays'], ['member_status', 'member-status']];
const matching = new Map([['r1', 'Φ2'], ['r7', 'Φ9']]); // answers-to(r1, r7) holds ↦ decays(Φ2, Φ9) holds — the relation agrees; Φ9 is none-by-nature
check('§9 ★★ THE MEASURED ZERO, with the reason: under {answers-to↦decays} alone the two casts share NO unary key by name (`member_status` ≠ `member-status`), so the matching r1↦Φ2 · r7↦Φ9 is an OFFER of weight 1 touching Φ9 with 0 refusals — the spelling decides, and it is the fixtures\' own',
  (() => {
    const sh = sharedSignature(T, P, TAU_A);
    const r = registerReading(tcell, phi, TAU_A);
    return sh.unary.size === 0 && r.state === 'offers' && r.topWeight === 1 && r.unaryRefusals === 0 && r.offers.some((o) => pairsOf(o) === 'r1↦Φ2 · r7↦Φ9');
  })());
check('§9 ★★ THE MEASURED ONE: with τ also translating the key ({member_status↦member-status}), the same matching is REFUSED — `assess` names exactly one conflict, unary, in the ratified words `member_status: r7 has · member-status: Φ9 none-by-nature`; the register reads EMPTY CORE (b) (the device LOOKED: the one relational match is refused) with 1 unary refusal counted',
  (() => {
    const sh = sharedSignature(T, P, TAU_B);
    const asm = assess(T, P, matching, sh);
    const r = registerReading(tcell, phi, TAU_B);
    return sh.unary.get('member_status') === 'member-status' && asm.conflicts.length === 1 && asm.conflicts[0].arity === 1 && asm.relational === 1 &&
      describeConflict(asm.conflicts[0]) === 'member_status: r7 has · member-status: Φ9 none-by-nature' && evaluate(T, P, matching, sh) === null &&
      r.state === 'empty core (b)' && r.unaryRefusals === 1;
  })());
check('§9 ★ a RELATIONAL conflict is named in the same words, the other way round: the articulated pair p(x, y) holds against p(a, b) does-not-hold reads `p(x, y) holds here · p(a, b) does-not-hold there`',
  (() => {
    const p = readCastFile(JSON.stringify({ roles: [{ id: 'x' }, { id: 'y' }], signature: [{ type: 'p', arity: 2 }], relations: [{ type: 'p', terms: ['x', 'y'], polarity: 'holds' }] })).cast;
    const q = readCastFile(JSON.stringify({ roles: [{ id: 'a' }, { id: 'b' }], signature: [{ type: 'p', arity: 2 }], relations: [{ type: 'p', terms: ['a', 'b'], polarity: 'does-not-hold' }] })).cast;
    const sh = sharedSignature(recordOf(p), recordOf(q));
    const asm = assess(recordOf(p), recordOf(q), new Map([['x', 'a'], ['y', 'b']]), sh);
    return asm.conflicts.length === 1 && describeConflict(asm.conflicts[0]) === 'p(x, y) holds here · p(a, b) does-not-hold there' && asm.relational === 0;
  })());

// ═══ §10 C-6d (β) — THE SURFACE: the J register on the selected cell's seams, pinned by BEHAVIOUR (rendered to a string under node, the store driven) and by SOURCE ═══
console.log("\n----- §10 ★★ C-6d (β) — the J register's surface: the five states, τ above the offers, all offers by reading, the take, the fiat pair, none -----");
const React = require('react');
const { renderToString } = require('react-dom/server');
const { JRegisterPanel, SURFACE_BUDGET, tieSentence } = req('src/components/JRegisterPanel.tsx');
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
  edges: seed.edges.map((e) => (e.id === seam.id && identification ? { ...e, identification } : e)),
});
const rowsOf = (shape) => shape.edges.map((e) => ({ edgeId: e.id, vertexIds: e.vertexIds, displayLabel: e.vertexIds.join(' - ') }));
// React separates adjacent text expressions with `<!-- -->`; stripped here so a text capture reads a whole sentence
const render = (shape, tauDrafts = {}, budget = SURFACE_BUDGET) => renderToString(React.createElement(JRegisterPanel, { shape, edges: rowsOf(shape), tauDrafts, budget })).replace(/<!-- -->/g, '');
const unescapeHtml = (s) => (s ?? '').replace(/<!-- -->/g, '').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&');
const attr = (html, name) => { const m = html.match(new RegExp(`${name}="([^"]*)"`)); return m ? unescapeHtml(m[1]) : null; };
const textOf = (html, name) => { const m = html.match(new RegExp(`${name}="[^"]*"[^>]*>([^<]*)<`)); return m ? unescapeHtml(m[1]) : null; };
const countOf = (html, name) => (html.match(new RegExp(`${name}="`, 'g')) || []).length;
const pairAttr = (html, pair, name) => { const m = html.match(new RegExp(`data-j-pair="${pair}" data-j-support="(\\d+)"( data-j-unbacked="true")?`)); return m ? (name === 'support' ? Number(m[1]) : Boolean(m[2])) : null; };
const ROLES3 = [['F5', 'Φ7'], ['F7', 'Φ1'], ['F8', 'Φ2']];
const noneAtAll = render(seed);
check('§10 ★★ A SEAM WHOSE CORNERS DO NOT BOTH HOLD A CAST HAS NO REGISTER — a true absence, no state attribute: the seed\'s six seams render six rows and no state; with casts on the two corners of one seam, exactly ONE row carries a state',
  countOf(noneAtAll, 'data-j-row') === 6 && countOf(noneAtAll, 'data-j-state') === 0 && countOf(render(withCasts(tri, tcell)), 'data-j-state') === 1);
const stateA = render(withCasts(tri, tcell));
check('§10 ★★ STATE 1 — EMPTY CORE (a) RENDERS ITS SENTENCE WITH THE τ INPUT BESIDE IT (the sentence IS the affordance): triangle × t-cell reads `no relation-type in common — a translation is yours to give`, the two type selects present, no offer, `no translation given` under τ',
  attr(stateA, 'data-j-state') === 'empty core (a)' && textOf(stateA, 'data-j-sentence') === 'no relation-type in common — a translation is yours to give' &&
    countOf(stateA, 'data-j-tau-x') === 1 && countOf(stateA, 'data-j-tau-y') === 1 && countOf(stateA, 'data-j-offer') === 0 && countOf(stateA, 'data-j-tau-none') === 1,
  JSON.stringify({ state: attr(stateA, 'data-j-state'), sentence: textOf(stateA, 'data-j-sentence') }));
check('§10 ★★ STATE 2 — EMPTY CORE (b): the device LOOKED — a cast with no relations against itself reads `no relation to agree on`',
  (() => {
    const bare = readCastFile(JSON.stringify({ roles: [{ id: 'x' }, { id: 'y' }], signature: [{ type: 'r', arity: 2 }], relations: [] })).cast;
    const h = render(withCasts(bare, bare));
    return attr(h, 'data-j-state') === 'empty core (b)' && textOf(h, 'data-j-sentence') === 'no relation to agree on';
  })());
const drafts3 = { [seam.id]: TAU3 };
const tiny = render(withCasts(flow, phi), drafts3, 10);
check('§10 ★★ STATE 3 — NOT COMPUTED (the device DID NOT LOOK) renders in the designer\'s words plus the budget in mine, exactly where the offers would have been (LAW 24 — the state RENDERS, not only returns): at a budget of 10 nodes Flow × Φ reads `not computed — this pair is beyond the budget (the register spends at most 10 nodes at a look; this pair needs more)`',
  attr(tiny, 'data-j-state') === 'not computed' && textOf(tiny, 'data-j-sentence') === 'not computed — this pair is beyond the budget' && tiny.includes('spends at most 10 nodes at a look; this pair needs more') && countOf(tiny, 'data-j-offer') === 0);
const offered = render(withCasts(flow, phi), drafts3);
const readingAtSurface = registerReading(flow, phi, TAU3, SURFACE_BUDGET, { keepAll: true, countFull: false });
check('§10 ★★ STATE 4 — OFFERED, NOT YET ACTED: Flow × Φ under τ₃ renders EVERY offer the register reads at the surface\'s budget (18 — the ruling\'s reading), grouped by READING within weight (16 groups), weight-ordered; the tie sentence leads with the reading — `1 tied · 1 reading — one offer at the top weight (this cast has 2, that one 1)`; the top offer\'s three counts of three different things, never a ratio; `take none` offered; no given-mark',
  attr(offered, 'data-j-state') === 'offered' && readingAtSurface.state === 'offers' && countOf(offered, 'data-j-offer') === readingAtSurface.offers.length && readingAtSurface.offers.length === 18 &&
    countOf(offered, 'data-j-reading') === readingAtSurface.readings.reduce((n, w) => n + w.groups.length, 0) && countOf(offered, 'data-j-reading') === 16 &&
    textOf(offered, 'data-j-tie') === '1 tied · 1 reading — one offer at the top weight (this cast has 2, that one 1)' &&
    textOf(offered, 'data-j-offer-counts') === 'relational weight 4 · 31 unrecorded · 1 known on one side only · types: 3 agree · 0 unknown' &&
    countOf(offered, 'data-j-take-none') === 1 && countOf(offered, 'data-j-given') === 0 && offered.indexOf('data-j-weight="4"') < offered.indexOf('data-j-weight="2"'),
  JSON.stringify({ state: attr(offered, 'data-j-state'), offers: countOf(offered, 'data-j-offer'), readings: countOf(offered, 'data-j-reading'), tie: textOf(offered, 'data-j-tie'), counts: textOf(offered, 'data-j-offer-counts') }));
check('§10 ★★ τ IS PRINTED ABOVE THE OFFERS AS THE STATED PREMISE, its pairs marked as the person\'s (`yours`), each withdrawable; the shared-signature line beneath it names the types shared by name, the types shared under τ, and the roles\' key shared',
  offered.indexOf('data-j-tau=') < offered.indexOf('data-j-offering=') && attr(offered, 'data-j-tau') === JSON.stringify(TAU3) &&
    countOf(offered, 'data-j-tau-pair') === 3 && countOf(offered, 'data-j-tau-withdraw') === 3 && (offered.match(/>yours</g) || []).length === 3 &&
    unescapeHtml(offered).includes('shared by name: disjoins') && unescapeHtml(offered).includes('shared under τ: sustains ↦ descends-from · presupposes ↦ specifies · exceeds-in-size ↦ lodges-in') &&
    unescapeHtml(offered).includes('types on the roles shared: member-status'));
check('§10 ★ THE TWO-ARITIES FACT IS A POSITIVE MARK on the shared line: `"r" is arity 2 here and arity 3 there — not a shared name`',
  (() => {
    const p = readCastFile(JSON.stringify({ roles: [{ id: 'x' }, { id: 'y' }], signature: [{ type: 'r', arity: 2 }], relations: [{ type: 'r', terms: ['x', 'y'], polarity: 'holds' }] })).cast;
    const q = readCastFile(JSON.stringify({ roles: [{ id: 'a' }, { id: 'b' }], signature: [{ type: 'r', arity: 3 }, { type: 's', arity: 2 }], relations: [{ type: 's', terms: ['a', 'b'], polarity: 'holds' }] })).cast;
    const h = unescapeHtml(render(withCasts(p, q)));
    return h.includes('"r" is arity 2 here and arity 3 there — not a shared name') && attr(h, 'data-j-state') === 'empty core (a)';
  })());
const given = render(withCasts(flow, phi, { roles: ROLES3, types: TAU3 }));
check('§10 ★★ STATE 5 — J GIVEN: the record on the edge renders the given-mark, each pair marked by its DERIVED support (F5↦Φ7 1 · F7↦Φ1 3 · F8↦Φ2 2), the counts of the given J, `withdraw` offered, `take none` gone; the offer whose pairs are the record\'s wears `given — this one`',
  attr(given, 'data-j-state') === 'given' && attr(given, 'data-j-given') === 'pairs' && pairAttr(given, 'F5↦Φ7', 'support') === 1 && pairAttr(given, 'F7↦Φ1', 'support') === 3 && pairAttr(given, 'F8↦Φ2', 'support') === 2 &&
    textOf(given, 'data-j-given-counts') === 'relational weight 4 · 31 unrecorded · 1 known on one side only · types: 3 agree · 0 unknown' &&
    countOf(given, 'data-j-withdraw') === 1 && countOf(given, 'data-j-take-none') === 0 && countOf(given, 'data-j-offer-given') === 1 && given.includes('given — this one') && countOf(given, 'data-j-unbacked') === 0,
  JSON.stringify({ state: attr(given, 'data-j-state'), given: attr(given, 'data-j-given'), counts: textOf(given, 'data-j-given-counts') }));
const fiat = unescapeHtml(render(withCasts(flow, phi, { roles: [...ROLES3, ['F1', 'Φ9']], types: TAU3 })));
check('§10 ★★ A FIAT PAIR IS VISIBLY DISTINCT and its conflict is printed BY NAME beside it: F1↦Φ9 added to the taken J reads `support 0 — yours, backed by no offer under this τ` with `in conflict: member-status: F1 has · Φ9 none-by-nature` under it; the three offered pairs keep their supports; the third value lives only there (no count of conflicts anywhere)',
  attr(fiat, 'data-j-state') === 'given' && pairAttr(fiat, 'F1↦Φ9', 'support') === 0 && pairAttr(fiat, 'F1↦Φ9', 'unbacked') === true && fiat.includes('support 0 — yours, backed by no offer under this τ') &&
    countOf(fiat, 'data-j-conflict') === 1 && fiat.includes('in conflict: member-status: F1 has · Φ9 none-by-nature') && pairAttr(fiat, 'F7↦Φ1', 'support') === 3 && !/conflicts?:\s*\d/.test(fiat));
const tauChanged = unescapeHtml(render(withCasts(flow, phi, { roles: ROLES3, types: [['sustains', 'descends-from']] })));
check('§10 ★ A TAKEN J SURVIVES A τ CHANGE as the person\'s record and its marks RE-DERIVE: with τ cut to sustains↦descends-from alone the same three pairs read F5 1 · F7 1 · F8 0 — the third now `yours, backed by no offer under this τ` (the same mark as a fiat pair, because it is the same fact), never erased by the device',
  attr(tauChanged, 'data-j-state') === 'given' && pairAttr(tauChanged, 'F5↦Φ7', 'support') === 1 && pairAttr(tauChanged, 'F7↦Φ1', 'support') === 1 && pairAttr(tauChanged, 'F8↦Φ2', 'support') === 0 && pairAttr(tauChanged, 'F8↦Φ2', 'unbacked') === true && countOf(tauChanged, 'data-j-pair') === 3);
const none = render(withCasts(flow, phi, { roles: [], types: TAU3 }));
check('§10 ★★ `none` IS A TAKE TOO: the record with no pairs renders `nothing identified` WITH the given-mark — never an empty field — and is withdrawable',
  attr(none, 'data-j-state') === 'given' && attr(none, 'data-j-given') === 'none' && countOf(none, 'data-j-nothing-identified') === 1 && countOf(none, 'data-j-withdraw') === 1 && countOf(none, 'data-j-pair') === 0);
check('§10 ★★ THE TIE SENTENCE LEADS WITH THE READING (the designer\'s rider 3, in its truthful form): triangle × triangle-symmetric renders `6 tied · 1 reading — they differ only by symmetry, so pick any (this cast has 3, that one 6)`; several readings read `15 tied · 13 readings — genuinely different choices; within a reading they differ only by symmetry (this cast has 2, that one 1)`; t-cell × t-cell renders its ten offers under `1 tied · 1 reading — one offer at the top weight (this cast has 1, that one 1)` with the seal\'s counts on the top offer',
  (() => {
    const symH = render(withCasts(tri, sym));
    const tH = render(withCasts(tcell, tcell));
    return textOf(symH, 'data-j-tie') === '6 tied · 1 reading — they differ only by symmetry, so pick any (this cast has 3, that one 6)' && countOf(symH, 'data-j-offer') === 6 && countOf(symH, 'data-j-reading') === 1 &&
      tieSentence(15, 13, [2, 1], true) === '15 tied · 13 readings — genuinely different choices; within a reading they differ only by symmetry (this cast has 2, that one 1)' &&
      textOf(tH, 'data-j-tie') === '1 tied · 1 reading — one offer at the top weight (this cast has 1, that one 1)' && countOf(tH, 'data-j-offer') === 10 &&
      textOf(tH, 'data-j-offer-counts') === 'relational weight 11 · 1489 unrecorded · 0 known on one side only · types: 10 agree · 0 unknown';
  })());
// the store, by behaviour: the record's one writer, `roles` and `types` only; τ before a take in the draft; no history entry
check('§10 ★★ THE STORE, BY BEHAVIOUR: τ given before a take lands in the draft (the record untouched); the take writes the record `{ roles, types }` — those two keys and no other — and clears the draft; a τ change on a taken J changes `types` and keeps `roles`; a fiat take extends `roles`; `none` is `roles: []`; withdrawing hands τ back to the draft and removes the record; no history entry is pushed by any of it',
  (() => {
    const before = useGeometryStore.getState();
    const shape = withCasts(flow, phi);
    useGeometryStore.setState({ shapes: { ...before.shapes, [shape.id]: shape }, edgeTauDrafts: {} });
    const s = () => useGeometryStore.getState();
    const edge = () => s().shapes[s().currentShapeId].edges.find((e) => e.id === seam.id);
    const history = s().operationHistory.length;
    s().setEdgeTau(seam.id, TAU3);
    const draftHeld = JSON.stringify(s().edgeTauDrafts[seam.id]) === JSON.stringify(TAU3) && edge().identification === undefined;
    s().takeEdgeIdentification(seam.id, ROLES3);
    const taken = JSON.stringify(edge().identification) === JSON.stringify({ roles: ROLES3, types: TAU3 }) && JSON.stringify(Object.keys(edge().identification).sort()) === '["roles","types"]' && s().edgeTauDrafts[seam.id] === undefined;
    s().setEdgeTau(seam.id, [['sustains', 'descends-from']]);
    const tauChangedRec = JSON.stringify(edge().identification.roles) === JSON.stringify(ROLES3) && JSON.stringify(edge().identification.types) === JSON.stringify([['sustains', 'descends-from']]);
    s().takeEdgeIdentification(seam.id, [...ROLES3, ['F1', 'Φ9']]);
    const fiatRec = edge().identification.roles.length === 4 && JSON.stringify(edge().identification.types) === JSON.stringify([['sustains', 'descends-from']]);
    s().withdrawEdgeIdentification(seam.id);
    const withdrawn = edge().identification === undefined && JSON.stringify(s().edgeTauDrafts[seam.id]) === JSON.stringify([['sustains', 'descends-from']]);
    s().takeEdgeIdentification(seam.id, []);
    const noneRec = JSON.stringify(edge().identification) === JSON.stringify({ roles: [], types: [['sustains', 'descends-from']] });
    const noHistory = s().operationHistory.length === history && s().undoStack.length === before.undoStack.length;
    useGeometryStore.setState({ shapes: before.shapes, edgeTauDrafts: {} });
    return draftHeld && taken && tauChangedRec && fiatRec && withdrawn && noneRec && noHistory;
  })());
// source pins
const panelSrc = readLf('src/components/JRegisterPanel.tsx');
const panelsSrc = readLf('src/components/Panels.tsx');
const storeSrc = readLf('src/store/geometryStore.ts');
check('§10 ★ SOURCE: the register is MOUNTED in the selection panel once, before the Layer 3 Witness and before the composition, under the selected cell; the panel imports the register\'s arithmetic and the store, nothing from the manuscript, the explore window, three or the camera',
  (panelsSrc.match(/<JRegisterPanel /g) || []).length === 1 && panelsSrc.indexOf('id="selection-j-register"') < panelsSrc.indexOf('id="selection-layer3-witness"') && panelsSrc.indexOf('id="selection-j-register"') < panelsSrc.indexOf('id="selection-composition"') &&
    panelsSrc.includes("import { JRegisterPanel } from './JRegisterPanel';") && /from '\.\.\/lib\/jRegister'/.test(panelSrc) && /from '\.\.\/store\/geometryStore'/.test(panelSrc) &&
    (panelSrc.match(/from '[^']+';/g) || []).every((clause) => /^from '(react|\.\.\/lib\/jRegister|\.\.\/store\/geometryStore|\.\.\/types\/geometry)';$/.test(clause)) && (panelSrc.match(/from '[^']+';/g) || []).length === 4 &&
    !/\bcamera\b|ExploreWindow|manuscript/i.test(panelSrc.replace(/^\s*\/\/.*$/gm, '')));
check('§10 ★ SOURCE — RECORD, NOT READING: the panel never writes the store (no `setState`, no `set(`) — it calls exactly the three actions; it never reads `identification.support` or `.fiat` (both derived by `assess` at every render); the store\'s one writer writes `roles` and `types` and no other key',
  !/setState\(|\bset\(/.test(panelSrc) && ['setEdgeTau', 'takeEdgeIdentification', 'withdrawEdgeIdentification'].every((a) => panelSrc.includes(`state.${a}`)) &&
    !/identification\.(support|fiat)|\.support\?\.|\.fiat\b/.test(panelSrc) && panelSrc.includes('assess(X, Y, new Map(identification.roles), shared)') &&
    /identification: \{\s*roles: next\.roles\.map[^}]*types: next\.types\.map[^}]*\}/s.test(storeSrc) && !/identification: \{[^}]*(support|fiat)/s.test(storeSrc));
check('§10 ★ SOURCE: the five states are five sentences, each its own words — the two empty-core sentences from the register, `not computed — this pair is beyond the budget` from the designer, `offered` and `given` as the row\'s state; ALL offers rendered (no slice, no threshold, no "top N")',
  panelSrc.includes("'no relation-type in common — a translation is yours to give'") && panelSrc.includes("'not computed — this pair is beyond the budget'") && panelSrc.includes("reading.sentence") &&
    !/\.slice\(0,\s*\d|threshold|topN|top \d/i.test(panelSrc) && panelSrc.includes('reading.readings.map((w) =>'));

// ═══ §6 boundaries, source-pinned ═══
const src = readLf('src/lib/jRegister.ts');
check('§6 ⛔ NO STORE, NO WRITTEN J: the module is pure over two ConceptSpaces and an optional τ — it imports only the types, and nothing under the store imports it',
  /import type \{ ConceptSpace, EdgeIdentification \} from '\.\.\/types\/geometry';/.test(src) && !/from '\.\.\/store|from '\.\.\/components|useGeometryStore|updateSelected/.test(src) &&
    !fs.readFileSync(path.join(repoRoot, 'src/store/geometryStore.ts'), 'utf8').includes('jRegister'));
check('§6 RECORD, NOT READING: `support` is DERIVED at every read (the assessment computes it; nothing reads `identification.support` or `.fiat` back)',
  src.includes('support: Record<string, number>') && !/\.support\b(?!\[)/.test(src.replace(/support: Record<string, number>/g, '').replace(/ev\.support|coreEv\.support|ext\.support|\.support\[/g, '')) && !src.includes('.fiat'));

console.log(`\n${failures === 0 ? "DIAGNOSE-THE-J-REGISTER: ALL PASS — the second implementation reads the corrected seal's numbers, the offers follow relational support, the unary home refuses and is counted apart, the empty core is named both ways, and the surface renders the five states, the take and the fiat pair by name" : `DIAGNOSE-THE-J-REGISTER: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

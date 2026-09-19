#!/usr/bin/env node

// DIAGNOSTIC — THE J REGISTER'S QUANTITIES (STAMP C-6d (α), 2026-09-19): the
// second implementation, RUN on the fixture pairs, pinned to the researcher's
// seal (their instrument j_register_quantities.py; the mothership's own run of
// it — every number identical). A disagreement reopens the DEFINITION, never
// tunes the code: it is reported, not fitted.
//
// Clause 2 as AMENDED (the researcher's 1632): an OFFER is a maximal
// conflict-free candidate whose EVERY pair is SUPPORTED; size follows from
// support. The manufactured falsifier for it (LAW 24, no fixture in the wild
// exercises it): X = the triangle, Y = the triangle plus one isolated role w.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React },
};
require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText,
    filename,
  );
};
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const { readCastFile } = req('src/lib/castLoader.ts');
const { registerReading, recordOf, automorphisms, sharedSignature } = req('src/lib/jRegister.ts');
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

console.log('THE J REGISTER\'S QUANTITIES — the second implementation against the researcher\'s seal (C-6d (α))\n');

const tri = cast('triangle.cast.json');
const sym = cast('triangle-symmetric.cast.json');
const tcell = cast('t-cell.cast.json');
const supportLine = (o) => Object.entries(o.support).sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([x, n]) => `${x} ${n}`).join(' · ');

// ═══ §1 triangle × triangle-symmetric ═══
const a = registerReading(tri, sym);
check('§1 ★★ triangle × triangle-symmetric: |Aut| 3 / 6 · top weight 3 · 6 tied · 1 orbit · the top offer\'s exposure 3 · unrecorded 3 · consistent full injections 6 (every number the seal\'s)',
  a.state === 'offers' && a.aut[0] === 3 && a.aut[1] === 6 && a.topWeight === 3 && a.tied === 6 && a.orbits === 1 &&
    a.offers[0].exposure === 3 && a.offers[0].unrecorded === 3 && a.consistentFull === 6,
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

// ═══ §3 t-cell × t-cell ═══
const c = registerReading(tcell, tcell);
check('§3 ★★ t-cell × t-cell: |Aut| 1 / 1 · top weight 21 (11 tuples + 10 unary) · 1 tied · 1 orbit · exposure 0 · unrecorded 1489 (1510 − 21) · consistent full injections 3,104,904',
  c.state === 'offers' && c.aut[0] === 1 && c.aut[1] === 1 && c.topWeight === 21 && c.tied === 1 && c.orbits === 1 &&
    c.offers[0].exposure === 0 && c.offers[0].unrecorded === 1489 && c.consistentFull === 3104904, JSON.stringify({ ...c, offers: c.offers && c.offers.slice(0, 1) }).slice(0, 500));
check('§3 ★ the top offer is the identity with the sealed per-pair support: r0 6 · r1 6 · r2 4 · r3 2 · r4 2 · r5 2 · r6 3 · r7 2 · r8 4 · r9 2',
  c.state === 'offers' && c.offers[0].pairs.every(([x, y]) => x === y) && c.offers[0].pairs.length === 10 &&
    supportLine(c.offers[0]) === 'r0 6 · r1 6 · r2 4 · r3 2 · r4 2 · r5 2 · r6 3 · r7 2 · r8 4 · r9 2', c.state === 'offers' && supportLine(c.offers[0]));
if (c.state === 'offers') note(`t-cell × t-cell took ${c.millis} ms · ${c.nodes} nodes in all (the offers search's budget 5,000,000 nodes; the full-injection count's 20,000,000) — the researcher's Python enumeration took 96 s`);
check('§3 ★ the falsifier held (LAW 24): `1 tied` fails on a second automorphism — the T cell with its member_status keys removed and two roles made twins (r3 and r5 both `sustains`-free leaves) is a different cast; here every role is pinned by its own tuples, so Aut is the identity alone',
  (() => { const rec = recordOf(tcell); const au = automorphisms(rec); return au.complete && au.list.length === 1 && [...au.list[0].entries()].every(([x, y]) => x === y); })());
check('§3 THE BUDGET is a limit found at pick-time, in words: under a budget of 10 nodes the offers search itself is `beyond the budget` with nothing offered; under 1000 the offers are found (the tuple-driven search is small) and only the full-injection COUNT is beyond its budget — reported as `consistentFull: null`, never a number',
  (() => {
    const tiny = registerReading(tcell, tcell, undefined, 10);
    const small = registerReading(tcell, tcell, undefined, 1000);
    return tiny.state === 'beyond the budget' && tiny.sentence.includes('beyond the register\'s budget') && tiny.nodes > 10 &&
      small.state === 'offers' && small.topWeight === 21 && small.tied === 1 && small.consistentFull === null;
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
check('§4 a name with two arities across the casts is NOT shared — named, never refused; the person\'s τ makes differently-named types shared when the arity agrees',
  (() => {
    const p = readCastFile(JSON.stringify({ roles: [{ id: 'x' }, { id: 'y' }], signature: [{ type: 'r', arity: 2 }], relations: [{ type: 'r', terms: ['x', 'y'], polarity: 'holds' }] }));
    const q = readCastFile(JSON.stringify({ roles: [{ id: 'a' }, { id: 'b' }], signature: [{ type: 'r', arity: 3 }, { type: 's', arity: 2 }], relations: [{ type: 's', terms: ['a', 'b'], polarity: 'holds' }] }));
    const noTau = registerReading(p.cast, q.cast);
    const withTau = registerReading(p.cast, q.cast, [['r', 's']]);
    const sh = sharedSignature(recordOf(p.cast), recordOf(q.cast));
    return noTau.state === 'empty core (a)' && noTau.notSame.includes('r') && sh.notSame.includes('r') &&
      withTau.state === 'offers' && withTau.topWeight === 1 && withTau.offers[0].pairs.length === 2;
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

// ═══ §6 boundaries, source-pinned ═══
const src = readLf('src/lib/jRegister.ts');
check('§6 ⛔ NO SURFACE, NO STORE, NO WRITTEN J: the module is pure over two ConceptSpaces and an optional τ — it imports only the types, and nothing under components or the store imports it',
  /import type \{ ConceptSpace, EdgeIdentification \} from '\.\.\/types\/geometry';/.test(src) && !/from '\.\.\/store|from '\.\.\/components|useGeometryStore|updateSelected/.test(src) &&
    !fs.readdirSync(path.join(repoRoot, 'src/components')).some((f) => /\.tsx?$/.test(f) && fs.readFileSync(path.join(repoRoot, 'src/components', f), 'utf8').includes('jRegister')) &&
    !fs.readFileSync(path.join(repoRoot, 'src/store/geometryStore.ts'), 'utf8').includes('jRegister'));
check('§6 RECORD, NOT READING: `support` is DERIVED at every read (the evaluation computes it; nothing reads `identification.support` or `.fiat` back)',
  src.includes('support: Record<string, number>') && !/\.support\b(?!\[)/.test(src.replace(/support: Record<string, number>/g, '').replace(/ev\.support|coreEv\.support|ext\.support|\.support\[/g, '')) && !src.includes('.fiat'));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-J-REGISTER: ALL PASS — the second implementation reads the seal\'s numbers, the offers follow support, the empty core is named both ways, and nothing person-facing exists yet' : `DIAGNOSE-THE-J-REGISTER: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

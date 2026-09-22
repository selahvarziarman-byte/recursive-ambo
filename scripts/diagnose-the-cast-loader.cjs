#!/usr/bin/env node

// DIAGNOSTIC — THE CAST LOADER (STAMP C-6c (ii)–(v), 2026-09-19): a `.cast.json`
// file becomes the cast a CORNER holds, and the card reads it.
//
// ⛔ THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM: the loader is RUN on the
// fixtures FROM THE RECORD (scripts/fixtures/casts — the T cell transcribed
// from first_face_and_tower.py:29–35; Arman's triangle from
// thin_cast_readings.py; a contradictory record; a non-cast; a closure-broken
// file; a cast of nothing), so every clause can fail. LAW 24 on each refusal
// and each mark: the positive control is the file that DOES load.
//
// THE FIVE PROMISES (MOLD v4 §7) are pinned by BEHAVIOUR — what the loader
// returns and what the editor writes — never by a tick: never fill `label`
// from the file · never write `identification` · read `relations` and nothing
// else · unlisted tuples UNRECORDED · load state PER CORNER.

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
const { readCastFile, castMarks, castCounts, orderingLine, castSummaryLine, notTakenAddresses, notTakenLine, NOT_A_CAST } = req('src/lib/castLoader.ts');
const readLf = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').split('\r\n').join('\n');
const fixture = (name) => fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8');

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined && !cond ? ` — ${detail}` : ''}`);
  if (!cond) failures += 1;
};
const note = (line) => console.log(`      ${line}`);

console.log('THE CAST LOADER — a corner takes a cast; the device checks a STRUCTURE and never grades (C-6c)\n');

// ═══ §1 the thin cast — Arman's triangle ═══
const tri = readCastFile(fixture('triangle.cast.json'));
check('§1 ★★ ARMAN\'S TRIANGLE IS TAKEN: three roles (bare ids — the thin cast is first-class), one binary type, three tuples, no axioms, no warrant, no marks',
  tri.taken && tri.cast.roles.length === 3 && tri.cast.signature.length === 1 && tri.cast.relations.length === 3 && tri.cast.axioms.length === 0 &&
    tri.cast.warrant === undefined && tri.marks.length === 0 && tri.cast.roles.every((r) => r.label === undefined),
  JSON.stringify(tri));
const triCounts = tri.taken ? castCounts(tri.cast) : null;
check('§1 ★★ THE ORDERINGS LINE reads `r · 3 tuples · none reversed — read as directed` (term order is content: the directed triangle; the device DISCLOSES its reading beside the evidence — C-6d (γ) §3.1, the designer\'s ruling)',
  triCounts && triCounts.orderings.length === 1 && orderingLine(triCounts.orderings[0]) === 'r · 3 tuples · none reversed — read as directed' && triCounts.orderings[0].reading === 'directed', JSON.stringify(triCounts));
check('§1 ★ THE CARD\'S LINE for the triangle: `taken — 3 roles · 1 relation-type · 3 relations` — and NO `axioms carried` clause and NO `warrant carried` clause, because there are none (C-6d rider 1, the designer\'s own correction: `0 axioms carried` marked the ordinary and claimed a carry that did not happen; a positive fact needs a positive mark)',
  tri.taken && castSummaryLine(tri.cast) === 'taken — 3 roles · 1 relation-type · 3 relations · read as directed', tri.taken && castSummaryLine(tri.cast));
check('§1 ★ LAW 24 for the axioms clause: the same triangle carrying ONE axiom (one-axiom.cast.json) reads `taken — 3 roles · 1 relation-type · 3 relations · 1 axiom carried, never evaluated`',
  (() => { const r = readCastFile(fixture('one-axiom.cast.json')); return r.taken && r.cast.axioms.length === 1 && castSummaryLine(r.cast) === 'taken — 3 roles · 1 relation-type · 3 relations · read as directed · 1 axiom carried, never evaluated'; })());
const sym = readCastFile(fixture('triangle-symmetric.cast.json'));
const symCounts = sym.taken ? castCounts(sym.cast) : null;
check('§1 ★ LAW 24 for the orderings count AND the reading: the SAME triangle cast symmetric reads `r · 6 tuples · every one reversed — read as symmetric`, and its line `taken — 3 roles · 1 relation-type · 6 relations · read as symmetric` (C-6d (γ) §3.2: the act\'s line carries the reading; the card keeps the evidence)',
  symCounts && orderingLine(symCounts.orderings[0]) === 'r · 6 tuples · every one reversed — read as symmetric' && sym.taken && castSummaryLine(sym.cast) === 'taken — 3 roles · 1 relation-type · 6 relations · read as symmetric', JSON.stringify(symCounts));
check('§1 ★ ARITY ≥ 3 (C-6d (γ) §3.1 ⚠): `read as symmetric` ONLY when every permutation of every tuple is listed — a ternary type listing all six orders of one triple reads symmetric; five of the six reads `every one reversed` under the reversal count yet `read as directed`; a cast with ternary and binary types of MIXED readings says `read as directed` on its line and the rows say which',
  (() => {
    const orders = [['a', 'b', 'c'], ['a', 'c', 'b'], ['b', 'a', 'c'], ['b', 'c', 'a'], ['c', 'a', 'b'], ['c', 'b', 'a']];
    const mk = (perms, extra) => readCastFile(JSON.stringify({ roles: [{ id: 'a' }, { id: 'b' }, { id: 'c' }], signature: [{ type: 't', arity: 3 }, ...(extra ? [{ type: 'r', arity: 2 }] : [])],
      relations: [...perms.map((terms) => ({ type: 't', terms, polarity: 'holds' })), ...(extra ? [{ type: 'r', terms: ['a', 'b'], polarity: 'holds' }] : [])] }));
    const full = mk(orders, false); const five = mk(orders.slice(0, 5), false); const mixed = mk(orders, true);
    const fullO = castCounts(full.cast).orderings[0]; const fiveO = castCounts(five.cast).orderings[0]; const mixedO = castCounts(mixed.cast).orderings;
    return full.taken && orderingLine(fullO) === 't · 6 tuples · every one reversed — read as symmetric' && castSummaryLine(full.cast) === 'taken — 3 roles · 1 relation-type · 6 relations · read as symmetric' &&
      five.taken && orderingLine(fiveO) === 't · 5 tuples · every one reversed — read as directed' && castSummaryLine(five.cast) === 'taken — 3 roles · 1 relation-type · 5 relations · read as directed' &&
      mixed.taken && castSummaryLine(mixed.cast) === 'taken — 3 roles · 2 relation-types · 7 relations · read as directed' && mixedO.find((o) => o.type === 't').reading === 'symmetric' && mixedO.find((o) => o.type === 'r').reading === 'directed';
  })());
check('§1 a relation-type with NOTHING listed has no reading to state (`none listed`, no clause), and a cast whose arity ≥ 2 types list nothing has no reading clause on its line — absent, never `read as directed` by default',
  (() => { const r = readCastFile(JSON.stringify({ roles: [{ id: 'x' }], signature: [{ type: 'r', arity: 2 }], relations: [] })); const o = castCounts(r.cast).orderings[0]; return r.taken && orderingLine(o) === 'r · 0 tuples · none listed' && o.reading === null && castSummaryLine(r.cast) === 'taken — 1 role · 1 relation-type · 0 relations'; })());

// ═══ §2 the T cell — the mold-shaped profile ═══
const tcell = readCastFile(fixture('t-cell.cast.json'));
check('§2 ★★ THE T CELL IS TAKEN from the mold profile: 10 roles · 6 signature types (one of arity 3: removes) · 11 tuples (3 does-not-hold) · 0 axioms; the file\'s concept/premises/derived_check/open_forks/did_not_fit CARRIED UNREAD on the warrant (its subject_matter has a typed home since C-6c (i) — §2b)',
  tcell.taken && tcell.cast.roles.length === 10 && tcell.cast.signature.length === 6 && tcell.cast.signature.find((s) => s.type === 'removes').arity === 3 &&
    tcell.cast.relations.length === 11 && tcell.cast.relations.filter((r) => r.polarity === 'does-not-hold').length === 3 && tcell.cast.axioms.length === 0 &&
    tcell.cast.warrant && tcell.cast.warrant.file && tcell.cast.warrant.file.concept === 'T' && Array.isArray(tcell.cast.warrant.file.premises) &&
    tcell.cast.warrant.file.derived_check !== undefined && tcell.marks.length === 0,
  JSON.stringify(tcell).slice(0, 400));
check('§2 ★ THE ROLE\'S EXTRAS ride on its marks, never read: gloss · source · properties · warrant carried per role; an EMPTY label is an absence (no label), never a name',
  tcell.taken && tcell.cast.roles.every((r) => r.label === undefined && r.marks && r.marks.source === 'first_face_and_tower.py' && r.marks.warrant !== undefined));
const tCounts = tcell.taken ? castCounts(tcell.cast) : null;
check('§2 ★★ ONE NUMBER, BOTH HOMES: relation-types 7 (6 in the signature + member_status declared on the roles) · relations 21 (11 tuples + 10 role-type entries) — relations.length alone would undercount; `t-cell.cast.json` IS the fixture of the both-homes COUNT (C-6d rider 2: the refusal\'s fixture is `one-name-two-homes.cast.json`, named for its defect)',
  tCounts && tCounts.relationTypes === 7 && tCounts.relations === 21 && tCounts.roles === 10 && tCounts.unknownTypes === 0, JSON.stringify(tCounts));
check('§2 the T cell\'s orderings: sustains · 5 tuples · none reversed (r1→r0 holds and r8→r0 does-not-hold are different tuples, not reversals); removes · 1 tuple · none reversed (arity 3 generalises)',
  tCounts && orderingLine(tCounts.orderings.find((o) => o.type === 'sustains')) === 'sustains · 5 tuples · none reversed — read as directed' &&
    orderingLine(tCounts.orderings.find((o) => o.type === 'removes')) === 'removes · 1 tuple · none reversed — read as directed', JSON.stringify(tCounts && tCounts.orderings));
check('§2 THE CARD\'S LINE for the T cell names the warrant it carries and NO axioms clause (it carries none — measured: the rider\'s "line unchanged" premise was false, said): `taken — 10 roles · 7 relation-types · 21 relations · warrant carried, never read`',
  tcell.taken && castSummaryLine(tcell.cast) === 'taken — 10 roles · 7 relation-types · 21 relations · read as directed · warrant carried, never read', tcell.taken && castSummaryLine(tcell.cast));

// ═══ §2b C-6c (i)'s rider — the subject matter, typed ═══
check('§2b ★ THE SUBJECT MATTER HAS ITS HOME (C-6c (i), sanctioned): the T cell\'s `subject_matter` lands on `cast.subject` as the string the caster wrote, and LEAVES the warrant (no `subject_matter` under warrant.file any more); it enters no check and no refusal',
  tcell.taken && typeof tcell.cast.subject === 'string' && tcell.cast.subject.startsWith('the T cell of the first face') &&
    !(tcell.cast.warrant && tcell.cast.warrant.file && 'subject_matter' in tcell.cast.warrant.file) && tcell.marks.length === 0);
check('§2b LAW 24 — absent = absent: the triangle has no subject and gets none (no field, never filled); a bare `subject` string on a thin cast is taken; a non-string subject is carried unread on the warrant, not typed',
  tri.taken && tri.cast.subject === undefined &&
    (() => { const r = readCastFile(JSON.stringify({ subject: 'three things in a ring', roles: [{ id: 'x' }], signature: [], relations: [] })); return r.taken && r.cast.subject === 'three things in a ring' && r.cast.warrant === undefined; })() &&
    (() => { const r = readCastFile(JSON.stringify({ subject_matter: 7, roles: [{ id: 'x' }], signature: [], relations: [] })); return r.taken && r.cast.subject === undefined && r.cast.warrant && r.cast.warrant.file && r.cast.warrant.file.subject_matter === 7; })());
check('§2b ★ THE CARD prints the subject beside the person\'s label in the caster\'s register ONLY when held — the row renders under `cast.subject ?`, never a placeholder',
  (() => { const card = readLf('src/components/Panels.tsx'); return card.includes('{cast.subject ? (') && card.includes('data-cast-card-row="subject"') && card.includes('the subject matter, by the caster:'); })());

// ═══ §3 the two refusals, by name ═══
const contra = readCastFile(fixture('contradictory.cast.json'));
check('§3 ★★ REFUSAL 2 — a contradictory record is refused AT THE CAST, pointing at the line: `not taken — the record states two things about one tuple · r(A, B) is listed both holds and does-not-hold`',
  !contra.taken && contra.refusal === 'not taken — the record states two things about one tuple · r(A, B) is listed both holds and does-not-hold', JSON.stringify(contra));
check('§3 …its siblings: a role id declared twice; a type declared with two arities',
  (() => {
    const r1 = readCastFile(JSON.stringify({ roles: [{ id: 'A' }, { id: 'A', label: 'a' }], signature: [], relations: [] }));
    const r2 = readCastFile(JSON.stringify({ roles: [{ id: 'A' }], signature: [{ type: 'r', arity: 2 }, { type: 'r', arity: 3 }], relations: [] }));
    return !r1.taken && r1.refusal === 'not taken — the record states two things about one role · role id "A" is declared twice' &&
      !r2.taken && r2.refusal === 'not taken — the record states two things about one type · type "r" is declared with arity 2 and arity 3';
  })());
const notCast = readCastFile(fixture('not-a-cast.json'));
const broken = readCastFile(fixture('broken.cast.json'));
check('§3 ★★ REFUSAL 1 — `this file is not a cast`: a JSON object with none of roles/signature/relations, and an unparseable file, both by that name and no other',
  !notCast.taken && notCast.refusal === NOT_A_CAST && !broken.taken && broken.refusal === NOT_A_CAST && NOT_A_CAST === 'this file is not a cast');
check('§3 LAW 24 — the refusals are not the loader\'s reflex: the triangle, the T cell and the cast of nothing are all TAKEN',
  tri.taken && tcell.taken && readCastFile(fixture('nothing.cast.json')).taken);

// ═══ §3b C-6c (vi) — the researcher's line: effect at the cast, address at the tuple; redundancy read once; one name, one home; the malformed carried ═══
const three = readCastFile(fixture('three-contradictions.cast.json'));
check('§3b ★★ δ1 — THREE contradictions (two tuples, one type) are refused ONCE, the one refusal naming all three: `not taken — the record states two things about 2 tuples and 1 type · r(A, B) … · r(B, C) … · type "r" is declared with arity 2 and arity 3`',
  !three.taken && three.refusal === 'not taken — the record states two things about 2 tuples and 1 type · r(A, B) is listed both holds and does-not-hold · r(B, C) is listed both holds and does-not-hold · type "r" is declared with arity 2 and arity 3',
  JSON.stringify(three));
check('§3b δ1 — the count of names in the refusal equals the count planted (3), and LAW 24: the one-contradiction fixture still names exactly one (`one tuple`)',
  !three.taken && three.refusal.split(' · ').length - 1 === 3 && !contra.taken && contra.refusal.startsWith('not taken — the record states two things about one tuple · ') && contra.refusal.split(' · ').length - 1 === 1);
const twiceSame = readCastFile(fixture('role-twice-identical.cast.json'));
const twiceDiff = readCastFile(fixture('role-twice-different.cast.json'));
check('§3b ★★ δ2 — a role id listed twice with IDENTICAL content is REDUNDANCY: taken as 3 roles, no mark, no refusal; the same file with the second `x` carrying a different label is refused naming `x`',
  twiceSame.taken && twiceSame.cast.roles.length === 3 && twiceSame.marks.length === 0 &&
    !twiceDiff.taken && twiceDiff.refusal === 'not taken — the record states two things about one role · role id "x" is declared twice',
  JSON.stringify({ twiceSame, twiceDiff }).slice(0, 300));
const bothHomes = readCastFile(fixture('one-name-two-homes.cast.json'));
check('§3b ★★ δ3 (amended) — ONE NAME, ONE HOME: `member_status` declared in the signature AND on a role\'s types is the contradiction, refused at the cast and named — no negative invented (the roles\' home is categorical); the fixture is `one-name-two-homes.cast.json`, named for the DEFECT it exercises like its siblings (it was `both-homes`, which read as the count\'s fixture — C-6d rider 2)',
  !bothHomes.taken && bothHomes.refusal === 'not taken — the record states two things about one name · "member_status" is declared in the signature and on the roles', JSON.stringify(bothHomes));
check('§3b δ3 LAW 24 — the T cell as landed (unary only on the roles) loads unchanged: 10 roles · 7 relation-types · 21 relations, not double-counted',
  tcell.taken && tCounts && tCounts.relationTypes === 7 && tCounts.relations === 21);
const redundant = readCastFile(fixture('redundant.cast.json'));
check('§3b ★ REDUNDANCY IS READ ONCE, nothing erased, no mark: a tuple listed twice with the same polarity and a signature entry twice with the same arity load as 3 relations · 1 relation-type (a relation is a set; a signature is a set)',
  redundant.taken && redundant.cast.relations.length === 3 && redundant.cast.signature.length === 1 && redundant.marks.length === 0 &&
    castCounts(redundant.cast).relations === 3 && castCounts(redundant.cast).relationTypes === 1, JSON.stringify(redundant).slice(0, 300));
const malformedRel = readCastFile(fixture('malformed-relation.cast.json'));
check('§3b ★★ RIDER (b) — a malformed item is CARRIED beside its mark: one relation without terms loads with the mark `relation 3: has no type or no terms — not taken` AND the raw item on the warrant at `relations.3`; the three good tuples present',
  malformedRel.taken && malformedRel.cast.relations.length === 3 && malformedRel.marks.includes('relation 3: has no type or no terms — not taken') &&
    malformedRel.cast.warrant && malformedRel.cast.warrant.malformed && malformedRel.cast.warrant.malformed['relations.3'] &&
    malformedRel.cast.warrant.malformed['relations.3'].reason === 'the terms were lost in transcription', JSON.stringify(malformedRel).slice(0, 400));
check('§3b RIDER (b) LAW 24 — a clean fixture carries nothing under `malformed` (the triangle, the T cell); and the other three homes carry too: a role without an id at `roles.i`, a signature entry without an arity at `signature.i`, an axiom without a sentence at `axioms.i`',
  tri.taken && !(tri.cast.warrant && tri.cast.warrant.malformed) && tcell.taken && !(tcell.cast.warrant && tcell.cast.warrant.malformed) &&
    (() => {
      const r = readCastFile(JSON.stringify({ roles: [{ id: 'x' }, { label: 'no id' }], signature: [{ type: 'r', arity: 2 }, { type: 'q' }], relations: [], axioms: ['all x. r(x, x)', { hypothesis: [] }] }));
      return r.taken && r.cast.warrant && r.cast.warrant.malformed && r.cast.warrant.malformed['roles.1'] && r.cast.warrant.malformed['signature.1'] && r.cast.warrant.malformed['axioms.1'] &&
        r.marks.length === 3 && r.cast.roles.length === 1 && r.cast.signature.length === 1 && r.cast.axioms.length === 1;
    })());

// ═══ §3c C-6e — the items not taken, the device's own record, on the card by KEY only ═══
check('§3c ★★ THE NOT-TAKEN CLAUSE reads the ADDRESSES under warrant.malformed and nothing under them: the malformed-relation file → `1 item not taken: relation 3`; three homes → `3 items not taken: role 1 · signature entry 1 · axiom 1` in the file\'s order',
  malformedRel.taken && notTakenLine(notTakenAddresses(malformedRel.cast)) === '1 item not taken: relation 3' &&
    (() => {
      const r = readCastFile(JSON.stringify({ roles: [{ id: 'x' }, { label: 'no id' }], signature: [{ type: 'r', arity: 2 }, { type: 'q' }], relations: [], axioms: ['all x. r(x, x)', { hypothesis: [] }] }));
      return r.taken && notTakenLine(notTakenAddresses(r.cast)) === '3 items not taken: role 1 · signature entry 1 · axiom 1';
    })());
check('§3c LAW 24 — a clean cast has no clause (null, so the card prints no row): the triangle, the T cell; and THE TWO KINDS NEVER MERGE: the closure-broken file has its two marks and NO not-taken clause',
  tri.taken && notTakenLine(notTakenAddresses(tri.cast)) === null && tcell.taken && notTakenLine(notTakenAddresses(tcell.cast)) === null &&
    (() => { const cbLocal = readCastFile(fixture('closure-broken.cast.json')); return cbLocal.taken && castMarks(cbLocal.cast).length === 2 && notTakenLine(notTakenAddresses(cbLocal.cast)) === null; })());
check('§3c ★ THE CARD prints the clause as its own line in the Marks row (`data-cast-not-taken`), the row rendered when EITHER kind is present, and reads no value under the keys (the source reads `Object.keys(malformed)` only)',
  (() => { const card = readLf('src/components/Panels.tsx'); const loader = readLf('src/lib/castLoader.ts');
    return card.includes('{marks.length || notTaken ? (') && card.includes('data-cast-not-taken="true"') && card.includes('const notTaken = notTakenLine(notTakenAddresses(cast));') &&
      /export function notTakenAddresses[\s\S]*?Object\.keys\(malformed\)/.test(loader) && !/malformed\[[^\]]+\]/.test(loader.slice(loader.indexOf('export function notTakenAddresses'), loader.indexOf('export function notTakenLine'))); })());

// ═══ §4 closure and arity — taken and MARKED, never refused ═══
const cb = readCastFile(fixture('closure-broken.cast.json'));
check('§4 ★★ A CLOSURE BREAK IS LOCAL: the file is TAKEN with its other tuples present (4 listed, none erased), and the mark is a NAME — `relation 1: "throughput" is not among your roles`',
  cb.taken && cb.cast.relations.length === 4 && cb.marks.includes('relation 1: "throughput" is not among your roles'), JSON.stringify(cb));
check('§4 ★ AN ARITY BREAK IS A COUNT: `1 tuple with the wrong arity` — and the marks re-derive from the held cast (RECORD, NOT READING)',
  cb.taken && cb.marks.includes('1 tuple with the wrong arity') && JSON.stringify(castMarks(cb.cast)) === JSON.stringify(cb.marks), JSON.stringify(cb.marks));
check('§4 arity presupposes closure: a tuple whose TYPE is not in the signature is marked by name and not counted against an arity it does not have',
  (() => {
    const r = readCastFile(JSON.stringify({ roles: [{ id: 'x' }, { id: 'y' }], signature: [{ type: 'r', arity: 2 }], relations: [{ type: 'flows', terms: ['x'], polarity: 'holds' }] }));
    return r.taken && r.marks.length === 1 && r.marks[0] === 'relation 0: type "flows" is not in your signature';
  })());
check('§4 LAW 24 — the marks are not the loader\'s reflex: the triangle and the T cell carry NO mark', tri.taken && tri.marks.length === 0 && tcell.taken && tcell.marks.length === 0);

// ═══ §4b C-6d (γ) §1.2 — the mold's own types, ONE constant; C-7pre — their ROLE-FACTS on it ═══
check('§4b ★ C-7pre (the researcher\'s finding §108.1.2): the mold\'s values carry the ROLE-FACT they assert ON the constant — `has` and `unrecorded` one fact (members exist), `none-by-nature` its own — and `moldJoin` reads the union record\'s value: has ⊔ unrecorded = has · unrecorded ⊔ unrecorded = unrecorded · has ⊔ none-by-nature = null (a contradiction) · a caster\'s key joins nothing',
  (() => {
    const { MOLD_TYPES, moldJoin } = req('src/lib/castLoader.ts');
    const m = MOLD_TYPES[0];
    return m.roleFact.has === m.roleFact.unrecorded && m.roleFact['none-by-nature'] !== m.roleFact.has && Object.keys(m.roleFact).length === 3 && m.values.every((v) => m.roleFact[v] !== undefined) &&
      moldJoin('member_status', 'has', 'unrecorded') === 'has' && moldJoin('member_status', 'unrecorded', 'has') === 'has' && moldJoin('member_status', 'unrecorded', 'unrecorded') === 'unrecorded' &&
      moldJoin('member_status', 'has', 'none-by-nature') === null && moldJoin('member_status', 'unrecorded', 'none-by-nature') === null && moldJoin('member-status', 'has', 'unrecorded') === null && moldJoin('member-status', 'has', 'has') === 'has';
  })());
check('§4b ★ THE MOLD\'S TYPES ARE ONE CONSTANT (C-6d (γ) §1.2): `MOLD_TYPES` in the loader names `member_status` (arity 1; has · unrecorded · none-by-nature) and the register imports it — no second list anywhere under src',
  (() => {
    const { MOLD_TYPES, isMoldType } = req('src/lib/castLoader.ts');
    const reg = readLf('src/lib/jRegister.ts');
    const others = fs.readdirSync(path.join(repoRoot, 'src/lib')).filter((f) => /\.tsx?$/.test(f) && f !== 'castLoader.ts').filter((f) => /MOLD_TYPES\s*[:=]/.test(fs.readFileSync(path.join(repoRoot, 'src/lib', f), 'utf8')));
    return MOLD_TYPES.length === 1 && MOLD_TYPES[0].name === 'member_status' && MOLD_TYPES[0].arity === 1 && JSON.stringify(MOLD_TYPES[0].values) === '["has","unrecorded","none-by-nature"]' &&
      isMoldType('member_status') && !isMoldType('member-status') && reg.includes("import { MOLD_TYPES, isMoldType, moldJoin } from './castLoader';") && others.length === 0;
  })());

// ═══ §5 the three states and UNKNOWN ═══
const nothing = readCastFile(fixture('nothing.cast.json'));
check('§5 ★ A CAST OF NOTHING reads `a cast of nothing — no roles`', nothing.taken && castSummaryLine(nothing.cast) === 'a cast of nothing — no roles');
check('§5 ★ UNKNOWN is counted where it was written (`3 types marked unknown`) and OMISSION IS SILENT (a role with no types adds nothing)',
  (() => {
    const r = readCastFile(JSON.stringify({ roles: [{ id: 'a', types: { member_status: 'UNKNOWN', colour: 'UNKNOWN' } }, { id: 'b', types: { member_status: 'UNKNOWN' } }, { id: 'c' }], signature: [], relations: [] }));
    const c = r.taken ? castCounts(r.cast) : null;
    return c && c.unknownTypes === 3 && c.relationTypes === 2 && c.relations === 3;
  })());

// ═══ §6 THE FIVE PROMISES, by behaviour ═══
const editor = readLf('src/components/VertexPacketEditor.tsx');
const loader = readLf('src/lib/castLoader.ts');
check('§6 ★★ PROMISE 1 — the loader NEVER fills `label` from the file: the corner\'s name-slot is not in its output (the roles\' labels are the caster\'s, on the cast), and the editor writes the cast and nothing else',
  !/\blabel\s*:/.test(loader.replace(/role\.label|raw\.label|r\.label/g, '')) && editor.includes('updateSelectedVertexData({ cast: load.cast });') &&
    !/updateSelectedVertexData\(\{[^}]*label[^}]*cast/.test(editor));
const code = (src) => src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, ''); // the pins read code, not the comments that name the law
check('§6 ★★ PROMISE 2 — `identification` is never written: the word does not occur in the loader\'s code, and the editor\'s load handler touches no edge',
  !code(loader).includes('identification') && !code(editor).includes('identification'));
check('§6 ★★ PROMISE 3 — the structural checks read `relations` (with the roles and the signature they resolve against) and nothing else: axioms and warrant are never inspected by a check',
  loader.includes('export function castMarks(cast: ConceptSpace): string[] {') &&
    !/castMarks[\s\S]*?\n}\n/.exec(loader)[0].includes('axioms') && !/castMarks[\s\S]*?\n}\n/.exec(loader)[0].includes('warrant'));
check('§6 ★★ PROMISE 4 — unlisted tuples are UNRECORDED: the loader\'s output relations are exactly the file\'s listed ones (never a minted does-not-hold) — the triangle lists 3 and holds 3; the T cell lists 11 and holds 11',
  tri.taken && tri.cast.relations.length === 3 && tcell.taken && tcell.cast.relations.length === 11 &&
    !loader.includes("polarity: 'does-not-hold' }") && !/relations\.push\(\{[^}]*'does-not-hold'/.test(loader));
check('§6 ★★ PROMISE 5 — load state PER CORNER: the editor writes through `updateSelectedVertexData` (the SELECTED corner\'s packet) and the loader holds no state of its own (no module-level `let`)',
  editor.includes('updateSelectedVertexData({ cast: load.cast });') && !/^let /m.test(loader) && !/^const [a-zA-Z]+ = new Map/m.test(loader));
check('§6 ⛔ THE DEVICE NEVER GRADES: no `valid`, no `ok`, no tick, no green in the loader\'s WORDS (its string literals) or the editor\'s load line',
  !/['"`][^'"`\n]*\b(valid|ok|passed|correct)\b[^'"`\n]*['"`]/i.test(code(loader)) && !loader.includes('✓') && !loader.includes('✔') &&
    !editor.includes('cast is valid') && !/text-(green|emerald)[^"]*cast/.test(editor) && !/\bcastLoadLine\b[\s\S]{0,400}text-(green|emerald)/.test(editor));

// ═══ §7 the surfaces, source-pinned ═══
const panels = readLf('src/components/Panels.tsx');
const workspace = readLf('src/components/Workspace3D.tsx');
check('§7 ★ SURFACE 1 — `load cast… (.cast.json)` sits in the packet editor beside `Save packet`, opens a FILE (an input of type file, a single one — the shelf\'s multiple-file door untouched), and its result line is the loader\'s own words',
  editor.includes('load cast… (.cast.json)') && editor.includes('type="file"') && !/type="file"[^>]*multiple/.test(editor) && editor.includes('Save packet') &&
    editor.includes('data-cast-load-result') && editor.includes('readCastFile('));
check('§7 ★ THE AMBO\'S LINE gains her clause VERBATIM: `a corner takes a concept-space from the packets tab` (C-7d appends the midpoint\'s two-halves clause after it — hers stands verbatim, no longer the line\'s tail)',
  workspace.includes(' · a corner takes a concept-space from the packets tab · '));
check('§7 ★★ SURFACE 2 — the card: NO ROW without a cast (the rows render only under `vertex.data.cast`), the summary line, the orderings per type, the two registers, UNKNOWN\'s count, the marks re-derived',
  panels.includes('{vertex.data.cast ? (') && panels.includes('<CastCardRows cast={vertex.data.cast} personLabel={vertex.data.label} />') &&
    panels.includes('{castSummaryLine(cast)}') && panels.includes('orderingLine(') && panels.includes('data-cast-card-row="summary"') &&
    panels.includes('const marks = castMarks(cast);') && panels.includes('an address, not a name') && panels.includes("marked unknown"));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-CAST-LOADER: ALL PASS — a corner takes a cast, the checks read a structure, the refusals are two by name, the marks are counts and names, and the card reads what is held' : `DIAGNOSE-THE-CAST-LOADER: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

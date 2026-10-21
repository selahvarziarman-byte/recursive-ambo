#!/usr/bin/env node
'use strict';
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// A LEXICON ACT NEVER DROPS HIS NAMES OR ANSWERS IN SILENCE — A17 (the author response; the coder's measurement of 2026-10-20 15:05; the mothership's 15:07 STAMP,
// ruling 1: §9.53 (b)'s dependency form, Δ85). Declaring or withdrawing a converse, or setting a word's stand-in bit, that would drop or merge any of his names
// or answers — at ANY generation, the act's own included — is REFUSED BY NAME, the refusal carrying what it would drop; he withdraws those first if he means it.
// THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM: the store's acts are RUN on Virgin Land's 19:54 record (13 converses, 189 answers, 36 names, one generation of
// loops), where the measurement found two converse withdrawals each dropping a relation name in silence. LAW 24: every refusal beside an act that is taken.
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } };
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const { useGeometryStore } = req('src/store/geometryStore.ts');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n');

console.log("A LEXICON ACT NEVER DROPS HIS NAMES OR ANSWERS IN SILENCE — refused by name at any generation, the act's own included (A17; the mothership's 15:07)\n");

const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const save = JSON.parse(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-19_1954_Finance-Consumption_15-relatings-2-bars_109-decided_32-bonds-blocked.workspace.json'), 'utf8'));
S().importWorkspace(save);
const records = () => ({ answers: S().loopAnswers.length, names: S().relationNames.length, converses: S().converses.length });
const before = records();
check('§0 THE RECORD AS IMPORTED: Virgin Land\'s 19:54 — 13 converses, 189 answers, 36 names (the measurement\'s record)', before.converses === 13 && before.answers === 189 && before.names === 36, before);

// ═══ §1 THE MEASUREMENT'S TWO CASES, REFUSED BY NAME ═══
const r1 = S().withdrawConverse('is drawn from');
check('§1 ★★ WITHDRAWING `is drawn from ≡ is divided as` IS REFUSED BY NAME (it dropped the name `is left over as` at Production–Distribution in silence at d6a2e8a): the refusal whole — its sentence in the guard\'s grammar, and the one name it would drop, with its site; nothing dropped',
  r1 !== null && typeof r1 === 'object' && r1.why === 'withdrawing this other way round would take away 1 name at the midpoint of Production and Distribution. Withdraw it there first:' && r1.items.length === 1 && r1.items[0].kind === 'name' && r1.items[0].name === 'is left over as' && J(records()) === J(before),
  { refusal: r1, records: records() });
const r2 = S().withdrawConverse('is paid as');
check('§1 ★★ WITHDRAWING `is paid as ≡ is paid for as` IS REFUSED BY NAME: the name `is paid as` at Production–Distribution; nothing dropped',
  r2 !== null && typeof r2 === 'object' && /^withdrawing this other way round would take away 1 name at the midpoint of Production and Distribution\. Withdraw it there first:$/.test(r2.why) && r2.items.length === 1 && r2.items[0].kind === 'name' && r2.items[0].name === 'is paid as' && J(records()) === J(before),
  { refusal: r2, records: records() });

// ═══ §2 LAW 24 — acts that drop nothing are taken ═══
const taken = [];
for (const [a, b] of S().converses.slice()) {
  if (a === 'is drawn from' || a === 'is paid as') continue;
  const r = S().withdrawConverse(a);
  taken.push([a, r === null]);
  if (r === null) S().declareConverse(a, b);
}
check('§2 ★★ THE OTHER ELEVEN CONVERSES, withdrawn and declared again: each taken (nothing of his rests on them), the record as it was',
  taken.length === 11 && taken.every(([, ok]) => ok) && J(records()) === J(before), { taken, records: records() });
const r3 = S().declareConverse('is secured on', 'is kept as');
check('§2 ★ A NEW CONVERSE between two words running opposite ways on Finance–Consumption, resting on nothing: taken, nothing dropped (LAW 24), then withdrawn',
  r3 === null && records().answers === before.answers && records().names === before.names && S().converses.length === 14 && S().withdrawConverse('is secured on') === null, { r3, records: records() });

// ═══ §3 THE STAND-IN BIT, the same guard ═══
const r4 = S().setOpaque('is drawn from', true);
check('§3 ★ THE OPAQUE BIT on `is drawn from`: refused or taken by the same guard at every generation — returned whole where refused; the record never moves in silence',
  (r4 === null && J(records()) === J(before)) || (typeof r4 === 'object' && r4 !== null && Array.isArray(r4.items) && J(records()) === J(before)), { r4: typeof r4 === 'object' && r4 !== null ? { why: r4.why, items: r4.items.length } : r4, records: records() });
if (r4 === null) S().setOpaque('is drawn from', false);

// ═══ §4 BY CONSTRUCTION — the guard's generation, the acts returned whole, the modes tab showing them ═══
const store = src('src/store/geometryStore.ts'); const medium = src('src/components/MediumBlock.tsx');
check('§4 ★★ THE STORE: the three lexicon acts read losses at `LEXICON_ACT_GENERATION` (0 — every loop on the mesh, the first included) and return the refusal whole (`string | LaterRefusal | null`), never `.why` alone',
  store.includes('const LEXICON_ACT_GENERATION = 0;') && (store.match(/settled[CO], LEXICON_ACT_GENERATION\)/g) || []).length === 3 && !/settled[CO], 1\)/.test(store) && (store.match(/if \(refused[CO]\) return refused[CO];/g) || []).length === 3 && !/return refused[CO]\.why;/.test(store)
    && /declareConverse: \(w: string, w2: string\) => string \| LaterRefusal \| null;/.test(store) && /withdrawConverse: \(w: string\) => string \| LaterRefusal \| null;/.test(store) && /setOpaque: \(w: string, opaque: boolean\) => string \| LaterRefusal \| null;/.test(store));
check('§4 ★★ THE MODES TAB SHOWS THE REFUSAL WHERE THE ACT WAS MADE: the four acts (name a converse, withdraw it, the two stand-in buttons) go through `lexiconAct`, which keeps the refusal under the word pressed; the line `data-medium-lexicon-refusal` with `not taken — …` and the guard\'s items (`LaterLosses`, each with its hand); a taken act clears it',
  (medium.match(/lexiconAct\(/g) || []).length === 4 && medium.includes("const lexiconAct = (word: string, r: string | { why: string; items: LaterLoss[] } | null): boolean => {") && medium.includes("const nameConverse = (x: string): void => { if (!converseWord.trim()) return; if (!lexiconAct(x, declareConverse(x, converseWord))) return;") && medium.includes('onClick={() => lexiconAct(pressed, withdrawConverse(pressed))}') && medium.includes('onClick={() => lexiconAct(pressed, setOpaque(pressed, false))}') && medium.includes('onClick={() => lexiconAct(pressed, setOpaque(pressed, true))}')
    && /<span data-medium-lexicon-refusal=\{pressed\} className="text-rose-200">\{`not taken — \$\{lexiconRefusal\.why\}`\}<\/span>/.test(medium) && medium.includes('<LaterLosses shape={props.shape} items={lexiconRefusal.items} records={childRecordsOf(useGeometryStore.getState())} />') && medium.includes("if (r === null) { setLexiconRefusal(null); return true; }"));

console.log(`\n${failures === 0 ? 'DIAGNOSE-A-LEXICON-ACT-NEVER-DROPS-HIS-NAMES: ALL PASS — a converse or a stand-in that would drop his names or answers is refused by name at any generation, shown where the act was made' : `DIAGNOSE-A-LEXICON-ACT-NEVER-DROPS-HIS-NAMES: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

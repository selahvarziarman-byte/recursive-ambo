#!/usr/bin/env node
'use strict';
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// A DECLARED CONVERSE IS HIS WORD (rider 1 after release 2.1 — the designer's look of 10-20 10:50; the mothership's STAMP of 11:09)
//
// Her finding at d363aa0: typing `is the consuming of`, his own declared converse of `is consumed as`, showed the norm's line (`a word here names a
// way the first is turned into the second, by its channel`, in the designer's words of 10-20 13:02; at d363aa0 it read the two are one, never one that keeps them apart), and typing `is the ` offered `is the meeting of` but not `is the consuming of`. A word he
// declared in his lexicon is not new. The cut: `lexiconOf` — the one reader of HIS WORDS — takes the lexicon's facts as a REQUIRED argument and lists
// the words of his declared converses with his declared words (D13: an equation he declared makes both its words his), so the fields offer them and
// the norm's line (`isNewWord`) shows only for a word in neither; the loop card's list derives from the same reader. THE INSTRUMENT SHARES THE
// CLAIM'S TYPE SYSTEM: the reader and the field's predicates are RUN, on their own cases and on Virgin Land's 19:54 export as found.
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
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
const { lexiconOf, IS, NO_FACTS } = req('src/lib/relatings.ts');
const { wordsOffered, isNewWord } = req('src/components/WordField.tsx');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8');

console.log("A DECLARED CONVERSE IS HIS WORD — the one reader of his words lists his converses' words (rider 1 after 2.1)\n");

// ═══ §1 THE READER ON ITS OWN CASES ═══
const facts = { converses: [['is consumed as', 'is the consuming of'], ['owes', 'is owed by']], opaque: [] };
const lex0 = lexiconOf(undefined, ['carries', 'is consumed as'], facts);
check('§1 ★★ THE ORDER: IS, his declared words in his order, then the words of his declared converses not already listed (each once), then the words in use — with no shape, `is the consuming of`, `owes` and `is owed by` follow `carries` and `is consumed as`; a converse word already declared is not listed twice',
  J(lex0) === J([IS, 'carries', 'is consumed as', 'is the consuming of', 'owes', 'is owed by']) && lex0.filter((w) => w === 'is consumed as').length === 1,
  lex0);
check('§1 ★★ THE CONTROL: with no equations the reader lists what it listed before — IS and his declared words',
  J(lexiconOf(undefined, ['carries', 'is consumed as'], NO_FACTS)) === J([IS, 'carries', 'is consumed as']));
check('§1 ★★ A RESERVED WORD NEVER ENTERS BY AN EQUATION (the store refuses such an equation; the reader does not rely on it)',
  J(lexiconOf(undefined, [], { converses: [['≡', 'w'], ['IS', 'v']], opaque: [] })) === J([IS, 'w', 'v']));

// ═══ §2 HER CASE — Virgin Land's 19:54 export (Finance–Consumption), as found ═══
const S = () => useGeometryStore.getState();
const FIX = path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-19_1954_Finance-Consumption_15-relatings-2-bars_109-decided_32-bonds-blocked.workspace.json');
S().importWorkspace(JSON.parse(fs.readFileSync(FIX, 'utf8')));
const shape = () => S().shapes[S().currentShapeId];
const his = () => lexiconOf(shape(), S().lexicon, { converses: S().converses, opaque: S().opaque });
const without = () => lexiconOf(shape(), S().lexicon, NO_FACTS);
const offered = wordsOffered(his(), 'is the ');
check('§2 ★★ HER SIGHTING, THEN THE CUT: at d363aa0 `is the ` offered `is the meeting of` and not `is the consuming of` (the converse is in no edge\'s record and not declared alone — the reader without the equations has no such word); with his equations the reader lists it, and the field offers both, alphabetical',
  !without().includes('is the consuming of') && his().includes('is the consuming of') && S().converses.some(([a, b]) => (a === 'is consumed as' && b === 'is the consuming of') || (b === 'is consumed as' && a === 'is the consuming of'))
    && offered.includes('is the consuming of') && offered.includes('is the meeting of') && J(offered) === J([...offered].sort((a, b) => a.localeCompare(b))),
  { offered, declared: S().lexicon.length, converses: S().converses.length });
check('§2 ★★ THE NORM\'S LINE ONLY FOR A WORD IN NEITHER: `is the consuming of` is not new (no line); `is consumed as` is not new; `is bought on`, in neither his lexicon nor his equations, is new (the line shows); and every word of every equation he declared is his',
  isNewWord('is the consuming of', his()) === false && isNewWord('is consumed as', his()) === false && isNewWord('is bought on', his()) === true && S().converses.every(([a, b]) => his().includes(a) && his().includes(b)),
  { newConverse: isNewWord('is the consuming of', his()), newBought: isNewWord('is bought on', his()), equations: S().converses.length });

// ═══ §3 BY CONSTRUCTION — one reader, the facts required, every place reads it ═══
const rl = src('src/lib/relatings.ts'); const mb = src('src/components/MediumBlock.tsx'); const ms = src('src/components/MidpointSurface.tsx'); const lc = src('src/components/ChildLoopCard.tsx');
check('§3 ★★ ONE READER, THE FACTS REQUIRED: `lexiconOf(shape, declared, facts: LexiconFacts)` lists the equations\' words; the modes tab\'s fields (`m.words`), the pairing tab and the light\'s box (`hisWords` on the surface) and the loop card\'s list read it with his equations — the compiler holds every caller to the third argument',
  /export function lexiconOf\(shape: Shape \| undefined, declared: readonly string\[\], facts: LexiconFacts\): string\[\] \{/.test(rl) && /for \(const \[a, b\] of facts\.converses\) for \(const w of \[a, b\]\) if \(isWord\(w\) && !isReservedWord\(w\) && !out\.includes\(w\)\) out\.push\(w\);/.test(rl)
    && /const words = lexiconOf\(shape, lexicon, facts\);/.test(mb) && /lexiconOf\(shape, lexiconNow, \{ converses: conversesNow, opaque: opaqueNow \}\)/.test(ms) && /lexiconOf\(shape, st\.lexicon, \{ converses: st\.converses, opaque: st\.opaque \}\)/.test(lc)
    && !/lexiconOf\([^)]*\)\s*;/.test(rl.replace(/export function lexiconOf[^{]*\{/, '')) );
check('§3 ★★ THE NORM\'S PREDICATE UNCHANGED: the fields decide `new` by `isNewWord(typed, <the words the field offers>)` as before — the modes tab on `m.words`, the pairing tab and the loop card on `hisWords` (the norm witness pins the mounts); what changed is the list, not the test',
  /isNewWord\(typed, m\.words\)/.test(mb) && /isNewWord\(w, hisWords\)/.test(src('src/components/PairingTab.tsx')) && /isNewWord\(t, hisWords\)/.test(lc));

console.log(`\n${failures === 0 ? 'DIAGNOSE-A-DECLARED-CONVERSE-IS-HIS-WORD: ALL PASS — his converses are offered with his words and marked new nowhere' : `DIAGNOSE-A-DECLARED-CONVERSE-IS-HIS-WORD: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

#!/usr/bin/env node
// DIAGNOSE THE NORM'S LINE — STAMP SLICE 3 · A (the mothership's order of 2026-10-18 21:13 on the coder's price of 21:01; the designer's letter of 10-17 14:11;
// Arman's word Δ183 "it keeps them apart" and Δ188; ADR 0031 §9.50–§9.53). Wherever a word NEW to him is being chosen as a WAY — the modes tab's four fields,
// a light's box, the pairing tab's line, the loop card's answer — one line of its own stands under the field's line while the word is being chosen:
// `a word here names a way the two are one, never one that keeps them apart` — the same whatever was typed, in the drawers' muted ink, nothing pressable on
// it, never a refusal; gone once the word is his or the act is done; never for an existing word, never for IS, never where a word is a NAME. Under node: the
// sentence, the predicate, the rendered line; and BY SOURCE the census that no field can forget it — the fields counted against the mounts, file by file.
// What a person SEES (the line appearing as he types, going as he records) is the concept-layer eye's (§33).
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const TRANSPILE_OPTIONS = { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } };
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};
const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const React = require('react');
const { renderToString } = require('react-dom/server');
const { NORM_LINE, isNewWord, NewWordNorm } = req('src/components/WordField.tsx');
const { IS, IS_GLYPH } = req('src/lib/relatings.ts');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8');
const count = (s, needle) => s.split(needle).length - 1;

console.log("THE NORM'S LINE — one sentence wherever a new word is chosen as a way; never for his word, IS, a name, or after the act (SLICE 3 · A)\n");

// ═══ §0 THE SENTENCE ═══
check('§0 ★★ THE SENTENCE IS HERS TO THE CHARACTER (the designer\'s 14:11; its second half Arman\'s own, Δ183): `a word here names a way the two are one, never one that keeps them apart`',
  NORM_LINE === 'a word here names a way the two are one, never one that keeps them apart', NORM_LINE);

// ═══ §1 THE PREDICATE ═══
const cases = [
  ['', ['holds'], false, 'an empty field'],
  ['   ', ['holds'], false, 'blanks'],
  [IS, [], false, 'IS'],
  [IS_GLYPH, [], false, 'the glyph'],
  [` ${IS} `, [], false, 'IS with blanks'],
  ['holds', ['holds', 'carries'], false, 'his own word'],
  [' holds ', ['holds'], false, 'his own word with blanks (the field trims)'],
  ['Holds', ['holds'], true, 'another spelling — two spellings are two words (D22), so it is new'],
  ['carries', [], true, 'a word new to him'],
  ['passes into', ['holds'], true, 'a new word of two words'],
];
check('§1 ★★ THE PREDICATE — new is NOT EMPTY, NOT IS OR ≡, NOT AMONG THE WORDS THE FIELD OFFERS (14:11: "the same predicate that prints `· a new word`"; nothing else: never the warning colour\'s predicate, never a count)',
  cases.every(([typed, words, want]) => isNewWord(typed, words) === want),
  cases.map(([typed, words, want, why]) => [why, isNewWord(typed, words), want]));

// ═══ §2 THE LINE RENDERED ═══
const shown = renderToString(React.createElement(NewWordNorm, { when: true, at: 'x|y|0' }));
const hidden = renderToString(React.createElement(NewWordNorm, { when: false, at: 'x|y|0' }));
check('§2 ★★ THE LINE: one element carrying the sentence and its place (`data-new-word-norm`), a ROW OF ITS OWN (`basis-full` — a full row in a wrapping line, a row of a grid), in the drawers\' muted ink (stone-400); nothing pressable in it (no button, no link, nothing underlined), never the warning colour; nothing at all when the predicate does not hold',
  /^<span data-new-word-norm="x\|y\|0" class="[^"]*"[^>]*>a word here names a way the two are one, never one that keeps them apart<\/span>$/.test(shown)
    && /class="[^"]*\bbasis-full\b[^"]*"/.test(shown) && /class="[^"]*\btext-stone-400\b[^"]*"/.test(shown) && !/amber|rose|underline|<button|<a /.test(shown) && hidden === '',
  { shown, hidden });

// ═══ §3 THE CENSUS BY SOURCE — no field can forget it ═══
const files = {
  'src/components/MediumBlock.tsx': 4, // the passage's decide, the bond's saying, the rule field, the bond's rule (14:11; the `+ a mode` field is retired with click-to-pair, SLICE 2b)
  'src/components/MidpointSurface.tsx': 1, // a light's box
  'src/components/PairingTab.tsx': 1, // the pairing tab's line
  'src/components/ChildLoopCard.tsx': 1, // the loop card's answer field (no WordField; its own input with his words offered)
};
const census = Object.entries(files).map(([p, want]) => {
  const s = src(p);
  const fields = count(s, '<WordField ') + count(s, 'data-child-loop-field=');
  const mounts = count(s, '<NewWordNorm ');
  const whens = (s.match(/<NewWordNorm when=\{([^}]*)\}/g) || []).map((m) => m.replace(/^<NewWordNorm when=\{|\}$/g, ''));
  const fromOnePredicate = whens.every((w) => w === 'newWord' || /^isNewWord\(/.test(w));
  const definesIt = !whens.includes('newWord') || /const newWord = isNewWord\(/.test(s);
  return { file: p, want, fields, mounts, whens, fromOnePredicate, definesIt };
});
check('§3 ★★ EVERY FIELD WHERE A WAY\'S WORD IS CHOSEN MOUNTS THE LINE — the fields (`<WordField`, the loop card\'s own input) counted against the mounts, FILE BY FILE (14:11: "in WordField itself, so that no field can forget it" — the field sits mid-sentence, so the line stands under the field\'s line and this census holds the rule): 4 · 1 · 1 · 1, seven in all',
  census.every((c) => c.fields === c.want && c.mounts === c.want) && census.reduce((n, c) => n + c.mounts, 0) === 7, census.map((c) => [c.file.replace('src/components/', ''), c.fields, c.mounts]));
check('§3 ★★ ONE PREDICATE PER FIELD: every mount\'s `when` is the field\'s own `newWord` (the same one that prints `· a new word`) or `isNewWord(…)` on the words the field offers — never a literal, never another test',
  census.every((c) => c.fromOnePredicate && c.definesIt), census.map((c) => [c.file.replace('src/components/', ''), c.whens, c.definesIt]));
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const mentions = walk(path.join(repoRoot, 'src')).filter((f) => /\.tsx?$/.test(f) && /NewWordNorm/.test(fs.readFileSync(f, 'utf8'))).map((f) => path.relative(repoRoot, f).replace(/\\/g, '/')).sort();
check('§3 ★★ NOWHERE ELSE — never where a word is a NAME (14:11: a child\'s role or relation named, the concept\'s name, `rename`; the casts drawer): the line lives in WordField.tsx and is mounted in the four files above, and in no other file of src/',
  J(mentions) === J(['src/components/ChildLoopCard.tsx', 'src/components/MediumBlock.tsx', 'src/components/MidpointSurface.tsx', 'src/components/PairingTab.tsx', 'src/components/WordField.tsx']), mentions);
check('§3 ★ THE MARK AND THE LINE SHARE THEIR PREDICATE where a field prints `· a new word` (14:11): the light\'s box and the pairing tab print the mark by `newWord`, the loop card by `isNewWord(t, hisWords)`',
  /\{newWord \? ' · a new word' : ''\}/.test(src('src/components/MidpointSurface.tsx')) && /\{newWord \? ' · a new word' : ''\}/.test(src('src/components/PairingTab.tsx')) && /\{isNewWord\(t, hisWords\) \? <span data-child-loop-new-word="true"/.test(src('src/components/ChildLoopCard.tsx')));

console.log('');
if (failures === 0) console.log('DIAGNOSE-THE-NORMS-LINE: ALL PASS — her sentence to the character; new is not empty, not IS, not his; one muted row with nothing pressable; every way\'s field mounts it from its own new-word predicate, seven in all, and no name field does');
else { console.log(`DIAGNOSE-THE-NORMS-LINE: ${failures} FAIL`); process.exitCode = 1; }

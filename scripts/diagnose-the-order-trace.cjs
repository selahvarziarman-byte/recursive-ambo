#!/usr/bin/env node

// DIAGNOSTIC — THE ORDER TRACE'S WINDOW (STAMP B-3, mothership-chartered
// 2026-09-04 from the designer's own drive at b67e728).
//
// THE DEFECT THIS PINS AGAINST: the trace line showed 39 letters behind a bare
// `…` while the tally counted every crossing of the whole trace — two marks
// ruled to be read together, describing different spans, the amount hidden
// uncheckable (LAW 23). THE CURE, one producer (orderTrace): the line is a
// WINDOW of the newest TRACE_WINDOW letters and the elision STATES ITS COUNT —
// hidden + shown === the trace's length, always. The mark is rendered by the
// view as a mark ON the line (its own span, letterSpacing 0) before the
// letter run, never as a character IN the run (the run already uses case for
// direction; a third character-shaped meaning breaks one-glyph-one-meaning).
// And the DOING/HAPPENED boundary (trace+tally vs sentence+return) is a
// CONSTANT margin on the sentence slot, not the sentence's empty height —
// the reserved blanks stay (an empty slot is a true absence), only their
// accidental second job is cut.

'use strict';
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
};
require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText,
    filename,
  );
};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const { windowTrace, elisionMark, TRACE_WINDOW } = req('src/manuscript/orderTrace.ts');

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined && !cond ? ` — ${detail}` : ''}`);
  if (!cond) failures += 1;
};

console.log('THE ORDER TRACE — the window states what it hides (STAMP B-3)\n');

const letters = (n) => Array.from({ length: n }, (_, i) => (i % 2 === 0 ? 'B' : 'a')).join('');

console.log('----- §1 the window: nothing hidden up to the limit, the newest letters kept past it -----');
check('§1 TRACE_WINDOW is 40 — the line the designer measured at 39 letters plus a bare mark now shows a full 40', TRACE_WINDOW === 40);
check('§1 at 0 · 1 · 39 · 40 letters NOTHING is hidden and the whole trace is shown (the mark is a true absence, not a zero)',
  [0, 1, 39, 40].every((n) => {
    const w = windowTrace(letters(n));
    return w.hidden === 0 && w.shown === letters(n) && elisionMark(w.hidden) === '';
  }));
const w41 = windowTrace(letters(41));
check('§1 at 41 letters exactly ONE is hidden and the shown run is the newest 40 — the elision is from the LEFT',
  w41.hidden === 1 && w41.shown.length === 40 && w41.shown === letters(41).slice(1), JSON.stringify(w41));
const w100 = windowTrace(letters(100));
check('§1 at 100 letters 60 are hidden and the 40 shown are the trace\'s own suffix', w100.hidden === 60 && w100.shown === letters(100).slice(60));

console.log('\n----- §2 ★ LAW 23 — the mark claims exactly what the line does not show -----');
check('§2 ★ hidden + shown.length === trace.length at every length 0…120 (the count is checkable against the run beside it)',
  Array.from({ length: 121 }, (_, n) => n).every((n) => {
    const w = windowTrace(letters(n));
    return w.hidden + w.shown.length === n && letters(n).endsWith(w.shown);
  }));
check("§2 the mark's text carries the count and the panel's own separator: 1 → '1 hidden · ', 27 → '27 hidden · ', 0 → ''",
  elisionMark(1) === '1 hidden · ' && elisionMark(27) === '27 hidden · ' && elisionMark(0) === '');
check('§2 LAW 24 for the clause: a narrower window (3) hides length − 3 — the count follows the limit, it is not a constant',
  windowTrace(letters(10), 3).hidden === 7 && windowTrace(letters(10), 3).shown === letters(10).slice(7));

console.log('\n----- §3 the view, source-pinned: one producer · the mark ON the line · the boundary constant · the blanks kept -----');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ExploreWindow.tsx'), 'utf8');
check('§3 the producer reads the window from orderTrace (windowTrace(trace, TRACE_WINDOW)) and the bare `…` is gone from it',
  viewSrc.includes("from './orderTrace'") &&
    viewSrc.includes('const { hidden, shown } = windowTrace(trace, TRACE_WINDOW);') &&
    !viewSrc.includes('`…${trace.slice('));
const elisionAt = viewSrc.indexOf('data-explore-elision');
const headAt = viewSrc.indexOf('ref={traceHeadRef}');
check('§3 THE MARK IS ON THE LINE, NOT IN THE RUN: the elision span (data-explore-elision, letterSpacing 0, its own register) precedes the trace-head span inside the trace line',
  elisionAt > 0 && headAt > elisionAt && /data-explore-elision[\s\S]{0,200}letterSpacing: 0/.test(viewSrc) && viewSrc.includes('elisionRef.current.textContent = elisionMark(hidden)'));
check('§3 the seam carries the count for drivers (seam.traceHidden), reset at open',
  viewSrc.includes('traceHidden: number;') && viewSrc.includes('seam.traceHidden = hidden;') && viewSrc.includes('seam.traceHidden = 0;'));
const sentenceStyle = /data-explore-sentence\s*style=\{\{([^}]*)\}\}/.exec(viewSrc);
const returnStyle = /data-explore-return\s*style=\{\{([^}]*)\}\}/.exec(viewSrc);
const tallyStyle = /data-explore-tally\s*style=\{\{([^}]*)\}\}/.exec(viewSrc);
check('§3 THE DOING/HAPPENED BOUNDARY IS A CONSTANT: the sentence slot carries marginTop 9 (positive, larger than the intra-group 1px) whether empty or fired; the tally keeps marginTop 1 inside DOING',
  Boolean(sentenceStyle) && /marginTop: 9\b/.test(sentenceStyle[1]) && Boolean(tallyStyle) && /marginTop: 1\b/.test(tallyStyle[1]));
check('§3 THE RESERVED BLANKS STAY: the sentence and return slots keep their minHeight (an empty slot is a true absence, not a placeholder)',
  Boolean(sentenceStyle) && /minHeight: 15\b/.test(sentenceStyle[1]) && Boolean(returnStyle) && /minHeight: 15\b/.test(returnStyle[1]));

console.log('\n----- §4 the sentence: minted by the producer, and the slot sized by its longest output -----');
const { cancelSentence, LONGEST_CANCEL_SENTENCE } = req('src/manuscript/orderTrace.ts');
check("§4 the two sentences are the producer's, byte-identical to the strings the view minted before (copy is behaviour): home → '…and here you are, home' · not home → '…and you are not home'",
  cancelSentence(true) === 'every door you opened, you closed — and here you are, home' &&
    cancelSentence(false) === 'every door you opened, you closed — and you are not home');
check('§4 LONGEST_CANCEL_SENTENCE is the longer of the two (the home variant) — what the reserved blank is sized to',
  LONGEST_CANCEL_SENTENCE === cancelSentence(true) && LONGEST_CANCEL_SENTENCE.length > cancelSentence(false).length);
check('§4 the view mints the sentence through the producer and licenses only its second clause (seam.sentence = cancelled ? cancelSentence(home) : null); the old inline template is gone',
  viewSrc.includes('seam.sentence = cancelled ? cancelSentence(home) : null;') &&
    !viewSrc.includes("`every door you opened, you closed — and ${home ? 'here you are, home' : 'you are not home'}`"));
const ghostAt = viewSrc.indexOf('data-explore-sentence-ghost');
const liveAt = viewSrc.indexOf('data-explore-sentence-text');
check('§4 ★ THE SLOT IS SIZED BY THE PRODUCER\'S OWN LONGEST SENTENCE: an invisible ghost span ({LONGEST_CANCEL_SENTENCE}, visibility hidden, aria-hidden) holds the slot and the live span lies over it (position absolute) inside a relative slot — the return line below cannot move when the sentence fires, at any width',
  ghostAt > 0 && liveAt > ghostAt &&
    /data-explore-sentence-ghost style=\{\{ visibility: 'hidden' \}\}>\s*\{LONGEST_CANCEL_SENTENCE\}/.test(viewSrc) &&
    /aria-hidden data-explore-sentence-ghost/.test(viewSrc) &&
    /data-explore-sentence-text style=\{\{ position: 'absolute', left: 0, top: 0, right: 0 \}\}/.test(viewSrc) &&
    Boolean(sentenceStyle) && /position: 'relative'/.test(sentenceStyle[1]));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-ORDER-TRACE: ALL PASS — the window states what it hides' : `DIAGNOSE-THE-ORDER-TRACE: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

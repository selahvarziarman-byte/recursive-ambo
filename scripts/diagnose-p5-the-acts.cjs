#!/usr/bin/env node

// DIAGNOSTIC — P5 + UNDO (B-116 §2): the three acts, the memorial, the undo.
// Built to the FOUR SOURCE LETTERS, not to the mandate's checklist:
//   · designer 1744 — THE FORM (§1 acts · §2 placement · §3 M.1–M.6 · §4 U.1–U.4 · §5 restore)
//   · researcher 1437 — THE MEANING (traced death · traced revert · the record
//     ratchets, the live page does not · NO FORCED CASCADE)
//   · researcher 1833 — §5's answer (the page never shows a `removed` ghost
//     beneath a present form) + M.6 (the page may ELIDE, never ERASE)
//   · designer 1258 — THE CASE (every reachable route ADDS; `collapse` is a
//     false friend)
//
// ⛔ WHAT THIS LEG CAN AND CANNOT SAY. The STORE is plain TS and is measured
// here at full strength. The PLACEMENT and the MEMORIAL are R3F/DOM and are
// pinned STRUCTURALLY here (the source says where they are and where they are
// NOT) — the eye's half is the drive family's, and the acceptance the designer
// wrote is a person's: *after a removal, can he say WHAT LEFT — from the page
// alone, without opening the record?*
//
// Anti-mock: the REAL modules through the transpile hook.

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
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { useManuscriptPageStore } = req('src/manuscript/pageStore.ts');
const { invokePrimitive } = req('src/manuscript/writtenFormModel.ts');

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

const store = () => useManuscriptPageStore.getState();
const reset = () => useManuscriptPageStore.setState({ written: [], shelf: [], acts: [], removals: [] });
// a page entry through the COMMITTED invoke door — the same WrittenForm the
// app's own gesture makes, not a fixture shaped like one
const entryFor = (label, seed, home) => ({ form: invokePrimitive(label, seed), home });

console.log('P5 + UNDO — the three acts, the memorial at the site, the traced revert\n');

// ═════ §1 THE LEDGER RATCHETS — the clause everything else rests on ══════════
console.log('----- §1 the record ratchets; the live page does not -----');
reset();
{
  const a = entryFor('square', 101, [1, 0, 0]);
  const b = entryFor('triangle', 102, [2, 0, 0]);
  useManuscriptPageStore.setState({ written: [a, b] });
  store().removeForm(a.form.id);
  const afterRemove = store();
  check('§1 ★★ REMOVAL IS A TRACED DEATH: the LIVE form leaves the page and the RECORD gains — both in ONE act, because a page that had lost the form without gaining the trace would be, for that instant, exactly the erasure this forbids',
    afterRemove.written.length === 1 &&
    afterRemove.written[0].form.id === b.form.id &&
    afterRemove.acts.length === 1 && afterRemove.acts[0].kind === 'remove' &&
    afterRemove.removals.length === 1 && afterRemove.removals[0].restored === false);
  note(`written ${afterRemove.written.length} · acts ${afterRemove.acts.length} · removals ${afterRemove.removals.length}`);

  store().undoLastAct();
  const afterUndo = store();
  check('§1 ★★★ UNDO APPENDS, IT NEVER POPS — the ledger is a RATCHET: after the revert the ledger holds BOTH acts (the remove AND its undo, the undo NAMING what it reverted by id), and the removal mark still stands, having GAINED its return rather than lost its death',
    afterUndo.acts.length === 2 &&
    afterUndo.acts[1].kind === 'undo' &&
    afterUndo.acts[1].ofActId === afterUndo.acts[0].id &&
    afterUndo.removals.length === 1 &&
    afterUndo.removals[0].restored === true);
  note(`acts: ${afterUndo.acts.map((x) => x.kind).join(' → ')} · the undo names ${afterUndo.acts[1].ofActId}`);

  check('§1 ⛔ AND THE FORM RETURNS TO ITS SITE (the designer’s §5 mechanism clause): the restored entry carries its own home, so the place comes back with the form and the memorial it stands beside is the same site',
    afterUndo.written.length === 2 &&
    JSON.stringify(afterUndo.written.find((w) => w.form.id === a.form.id).home) === JSON.stringify([1, 0, 0]));

  check('§1 ⛔ THE LEDGER IS APPEND-ONLY IN THE SOURCE, not merely in this run: pageStore’s act paths spread the existing array and never pop/splice/shift it — a stack pop would make undo a HISTORY-REWRITE, which this module’s own git doctrine forbids one register up',
    (() => {
      // ⚠ over the WHOLE module, not a slice: my first version sliced between
      // two anchors whose order I assumed instead of checking, and the slice
      // came out EMPTY — a source pin that reads nothing passes nothing and
      // fails for a reason that has nothing to do with the claim.
      const src = fs.readFileSync(path.join(repoRoot, 'src/manuscript/pageStore.ts'), 'utf8');
      const appends = (src.match(/acts: \[\.\.\.s\.acts,/g) ?? []).length;
      note(`append sites in pageStore: ${appends} (remove · set-aside · undo) · destructive act calls: ${/acts\.pop\(|acts\.splice\(|acts\.shift\(/.test(src) ? 'PRESENT' : 'none'}`);
      return appends === 3 && !/acts\.pop\(|acts\.splice\(|acts\.shift\(/.test(src);
    })());
}

// ═════ §2 NO FORCED CASCADE, and the RECORD keeps its subject ════════════════
console.log('\n----- §2 no forced cascade: the child stands, and the record goes on naming the parent -----');
reset();
{
  const parent = entryFor('square', 201, [0, 0, 0]);
  useManuscriptPageStore.setState({ written: [parent] });
  store().removeForm(parent.form.id);
  const s = store();
  check('§2 ★★ THE RECORD KEEPS THE PARENT’S NAME, carried on the mark: the removal records the removed form’s SHAPE id beside its name, which is what lets a begotten child go on naming a parent that has left the page — a name with a death-mark under it, never a DANGLING NAME (the M3 seal’s own degenerate)',
    s.removals[0].shapeId === parent.form.shape.id && s.removals[0].name === parent.form.title);
  note(`the mark carries: name "${s.removals[0].name}" · shape ${s.removals[0].shapeId.slice(0, 28)}…`);

  check('§2 ⛔ THE CHILD’S RECORD SURVIVES BY THE COMMITTED MECHANISM, source-pinned rather than hoped for: genesisStoryShapes collects each entry’s OWN carried `parentShape`, so a removed parent stays in the DAG population and its record line keeps standing — removal never cascades into the record',
    (() => {
      const src = fs.readFileSync(path.join(repoRoot, 'src/manuscript/genesisModel.ts'), 'utf8');
      const body = src.slice(src.indexOf('export function genesisStoryShapes'), src.indexOf('export function genesisStoryShapes') + 900);
      return body.includes('entry.form.parentShape');
    })());

  check('§2 ⛔⛔ MARKER A1 — REMOVAL AND UNDO ARE NOT GENEALOGY (Arman, verbatim: "no remove and undo does not need be recorded as geneology"): the genealogy line carries NO removal word. ★ His ruling is the designer’s own §2 argument one layer further — *removal consumes nothing and makes nothing; it acts on the PAGE* — and THE GENEALOGY IS THE RECORD OF WHAT OPERATIONS MADE. ⛔ AND THE BOUNDARY, WHICH POINTS THE OTHER WAY: the birth line must still STAND and still be NAMED — a removed form goes on naming itself PLAINLY, so the line reads `Square —glue→ Torus (T²) — born` and never degrades to a raw shape id',
    (() => {
      const src = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
      const body = src.slice(src.indexOf('const nameOfShapeId'), src.indexOf('const recordEntries'));
      // ⚠ comment-stripped: the doctrine may still NAME the retired marker —
      // and should, so the next reader learns why it is not there — while the
      // EMITTED code must carry no removal word. (The same idiom the ink's
      // leg uses to let a killed value stay named in its own comment.)
      const code = body.replace(/\/\*[\s\S]*?\*\//g, '').split(/\r?\n/).map((l) => l.split('//')[0]).join('\n');
      return code.includes('removals.forEach((m) => names.set(m.shapeId, m.name))') &&
        !/removed|restored/.test(code) &&
        body.indexOf('removals.forEach') < body.indexOf('written.forEach');
    })());

  check('§2 ⛔ AND THE TRACE STILL HAS A HOME — IT IS JUST NOT THIS ONE: the RecordStrip takes the genealogy and the acts as TWO SEPARATE PROPS from TWO SEPARATE PRODUCERS (`entries` composed by footRecord over the DAG; `acts` composed from the append-only ledger), rendered as two lines. Removal leaving the genealogy did not leave the trace homeless',
    (() => {
      const chrome = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptChrome.tsx'), 'utf8');
      const view = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
      const strip = chrome.slice(chrome.indexOf('export function RecordStrip'), chrome.indexOf('// 3b — the SOURCES SHELF'));
      return strip.includes('entries.map((entry, k) =>') &&
        strip.includes('data-record-acts') &&
        view.includes('entries={recordEntries}') &&
        view.includes('acts={(() => {');
    })());
}

// ═════ §3 SET ASIDE — nothing dies, and it WAITS somewhere ═══════════════════
console.log('\n----- §3 set aside: the page loses it, nothing dies, and it waits -----');
reset();
{
  const kept = entryFor('pentagon', 301, [3, 0, 0]);
  useManuscriptPageStore.setState({
    written: [kept],
    shelf: [{ entry: { loaded: { shape: kept.form.shape } }, placed: true }],
  });
  store().setAsideForm(kept.form.id);
  const s = store();
  check('§3 ★★ SET ASIDE LEAVES THE PAGE WHOLE AND WAITS, AND NOTHING DIES: the form leaves `written`, its shelf entry returns to `placed: false` (the state it was in before he dragged it out — the shelf’s OWN surface, not a redesign of it), the act is recorded — and NO memorial is posted, because the memorial’s justification is the M3 seal and M3 is about a thing that DIED',
    s.written.length === 0 &&
    s.shelf[0].placed === false &&
    s.acts.length === 1 && s.acts[0].kind === 'set-aside' &&
    s.removals.length === 0);
  note(`written ${s.written.length} · shelf placed ${s.shelf[0].placed} · acts ${s.acts[0].kind} · removals ${s.removals.length}`);

  store().undoLastAct();
  const back = store();
  check('§3 ⛔ AND ITS UNDO PUTS IT BACK ON BOTH SIDES: the form returns to the page at its site AND its shelf entry returns to `placed: true` — a revert that healed only one of the two would leave the shelf lying about where the form is',
    back.written.length === 1 && back.shelf[0].placed === true && back.acts.length === 2);
}

// ═════ §4 U.1/U.4 — one step, named, absent when empty ═══════════════════════
console.log('\n----- §4 undo: one step, named from the act, absent when there is nothing -----');
reset();
{
  check('§4 ⛔ NOTHING TO UNDO IS NOT AN ACT: undoLastAct on a page with no acts changes nothing — no empty trace is written, and the control that reads this ledger is ABSENT rather than present-and-inert',
    (() => {
      store().undoLastAct();
      return store().acts.length === 0 && store().written.length === 0;
    })());

  const one = entryFor('square', 401, [0, 1, 0]);
  const two = entryFor('triangle', 402, [0, 2, 0]);
  useManuscriptPageStore.setState({ written: [one, two] });
  store().removeForm(one.form.id);
  store().removeForm(two.form.id);
  store().undoLastAct();
  const s = store();
  check('§4 ★ U.1 — ONE STEP, THE LAST ACT: with two removals recorded, one undo reverts the SECOND and leaves the first standing (not a history browser; one step, named)',
    s.written.length === 1 && s.written[0].form.id === two.form.id &&
    s.removals.find((m) => m.formId === two.form.id).restored === true &&
    s.removals.find((m) => m.formId === one.form.id).restored === false);

  store().undoLastAct();
  const s2 = store();
  check('§4 ⛔ AND THE NEXT UNDO WALKS BACK TO THE LAST UN-REVERTED ACT, never to the undo itself: the second undo reverts the FIRST removal (4 acts on the ledger: remove, remove, undo, undo) — which is why an undo NAMES the act it reverted by id instead of counting backwards into a history that moves',
    s2.written.length === 2 && s2.acts.length === 4 &&
    s2.acts.filter((a) => a.kind === 'undo').length === 2 &&
    s2.removals.every((m) => m.restored === true));
  note(`acts: ${s2.acts.map((x) => x.kind).join(' → ')}`);

  check('§4 ⛔ U.4 — THE LABEL IS COMPUTED FROM THE ACT, and the control is ABSENT when there is nothing to undo: the view composes `undo — <word> <name>` from the ledger’s own target and returns `undefined` (not a disabled button) when every act is reverted',
    (() => {
      const src = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
      const body = src.slice(src.indexOf('undo={(() => {'), src.indexOf('undo={(() => {') + 700);
      return body.includes('if (!target) return undefined;') && body.includes('`undo — ${word} ${target.name}`');
    })());
}

// ═════ §5 PLACE — where the acts are, and where they are NOT ═════════════════
console.log('\n----- §5 place: the false friend has no site, and undo is not on a form’s card -----');
{
  const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
  const chromeSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptChrome.tsx'), 'utf8');
  const affordanceSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/affordanceLine.ts'), 'utf8');

  check('§5 ★★ THE `collapse` FALSE FRIEND IS CURED BY CONSTRUCTION, not by wording: neither `remove` nor `set aside` appears in the affordance line’s composer — so the one word that SOUNDS like removal and the act that IS removal are never in the same list, and the misfire has no site',
    !/\bremove\b|\bset aside\b/.test(affordanceSrc));

  check('§5 ⛔ THE TWO FORM-ACTS ARE THEIR OWN ROW, below the record rows and behind their own rule, in a register that is not the operations’ — PLACE SEPARATES KINDS, and that is what place is for',
    viewSrc.includes('data-form-acts') &&
    viewSrc.indexOf('data-form-acts') > viewSrc.indexOf('{surfacedRows.map') &&
    viewSrc.indexOf('data-form-acts') > viewSrc.indexOf('{deckRecord?.map'));

  check('§5 ⛔ NO CONFIRM DIALOG ANYWHERE IN THE ACTS — refused, and refusing it is part of the build: `remove` and `set aside` are separated BY PLACE, because a confirm is a REFUSAL PLACED AFTER THE ACT and a misfire is not cured with a speed bump',
    (() => {
      const acts = viewSrc.slice(viewSrc.indexOf('data-form-acts'), viewSrc.indexOf('data-form-acts') + 2600);
      return !/confirm\(|window\.confirm|are you sure/i.test(acts);
    })());

  check('§5 ⛔ `undo` IS NOT ON A FORM’S CARD AT ALL — it acts on an ACT, not a form: the control lives in the RecordStrip (the page’s own account of itself) and the SpecimenCard’s props carry no undo at all',
    chromeSrc.includes('data-undo-act') &&
    !viewSrc.slice(viewSrc.indexOf('function SpecimenCard'), viewSrc.indexOf('data-form-acts')).includes('onUndo'));

  check('§5 ⛔ NO TRASH/BIN METAPHOR and NO MULTI-SELECT REMOVAL — both refused: a bin is a place things go to be FORGOTTEN and nothing here is forgotten, and one removal must be accepted at his hand before many are offered',
    !/trash|bin\b|wastebasket|discard/i.test(viewSrc.slice(viewSrc.indexOf('data-form-acts'), viewSrc.indexOf('data-form-acts') + 2600)) &&
    !/removeForms\(|removeSelected\(|removeMany\(/.test(viewSrc));
}

// ═════ §6 THE MEMORIAL — M.1..M.6, structurally ══════════════════════════════
console.log('\n----- §6 the memorial: at the site, named, recessed, collapsing, NOT dismissible -----');
{
  const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
  const memorial = viewSrc.slice(viewSrc.indexOf('function SiteMemorial'), viewSrc.indexOf('// CUT 1 — THE FAITHFUL BODY'));

  check('§6 ★★ M.1 — THE MARK IS AT THE FORM’S OWN SITE: the memorials mount in a group positioned at the removed entry’s own `home`, grouped BY that home — which is what makes M.5’s collapse a fact about a PLACE and not a list with a count on it',
    viewSrc.includes('data-site-memorial') &&
    viewSrc.includes('<group key={`memorial:${key}`} position={at.home}>'));

  check('§6 ⛔ M.2 + M.3 — THE NAME AND THE WORD, and the word is `removed`, NEVER `died`: same mechanism, two words, and the difference is AGENCY — `died` is what happens to a concept inside an op, `removed` is what happens when HE does it',
    /\$\{gone\[0\]\.name\} — removed/.test(memorial) && !/\bdied\b/.test(memorial.replace(/\/\/[^\n]*/g, '')));

  check('§6 ⛔ M.4 — RECESSED, A GHOST AND NOT A FORM: the SAME ink the page titles use, set back, in the page’s own serif — NO NEW SPECIES (no new colour, no new family, no badge)',
    memorial.includes('opacity: 0.42') && memorial.includes("fontFamily: 'Georgia") && memorial.includes('ink'));

  check('§6 ★ M.5 — MANY COLLAPSE TO A COUNT, and the count form is POSITIVE (`N removed here`), never a blank; the entry-grammar is refused (no route, no list, no expander). ⚠ RULED legal as ELISION and not erasure BECAUSE the record still holds each death by name — `acts` is append-only and every removal is in it',
    memorial.includes('${gone.length} removed here'));

  check('§6 ⛔ M.6 — NOT DISMISSIBLE BY A GESTURE: the memorial mounts with pointerEvents none and carries NO click handler and NO close control, because DISMISSING A TRACE IS ERASING ONE',
    memorial.includes("pointerEvents: 'none'") &&
    !/onClick|onMouseDown|onPointerDown|dismiss|close/i.test(memorial));

  check('§6 ★★★ §5 — THE PAGE NEVER SHOWS A `removed` GHOST BENEATH A PRESENT FORM (the researcher’s strengthening, which would say gone-and-here at once): the site splits its marks on `restored`, drawing the absence for the ones still gone and the RETURN’S OWN POSITIVE MARK for the ones that came back — U.3, so he can tell *I undid it* from *the view moved*',
    memorial.includes('const gone = marks.filter((m) => !m.restored)') &&
    memorial.includes('const back = marks.filter((m) => m.restored)') &&
    /\$\{back\[0\]\.name\} — restored/.test(memorial) &&
    memorial.includes('${back.length} restored here'));
}

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`} — P5 + UNDO`);
process.exit(failures === 0 ? 0 : 1);

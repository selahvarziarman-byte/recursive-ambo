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

// ═════ §1b THE RECORD MAY NOT BE MUTABLE THROUGH THE LIVE PAGE (B-119 §3) ════
console.log('\n----- §1b the record does not alias live state -----');
reset();
{
  const home = [1, 2, 0];
  const e = { form: invokePrimitive('square', 150), home };
  useManuscriptPageStore.setState({ written: [e] });
  store().removeForm(e.form.id);
  const act = store().acts[0];
  const mark = store().removals[0];

  check('§1b ★★★ THE ACT AND THE MEMORIAL HOLD A FACT AS OF THE REMOVAL, NOT A VIEW OF A LIVE ARRAY: neither the recorded entry’s `home` nor the mark’s `home` is the SAME ARRAY the live page carries — identity, not equality. ⛔ A RECORD THAT HOLDS A REFERENCE INTO LIVE STATE IS A RECORD THAT CAN BE REWRITTEN WITHOUT BEING WRITTEN TO, and every append-only pin in this file stays true while the content changes underneath it',
    act.entry.home !== home && mark.home !== home &&
    JSON.stringify(act.entry.home) === JSON.stringify(home) &&
    JSON.stringify(mark.home) === JSON.stringify(home));
  note(`act.entry.home === the live array: ${act.entry.home === home} · mark.home === the live array: ${mark.home === home} (both must be false, with equal VALUES)`);

  // ⛔ THE FALSIFIER, manufactured as ordered: mutate the live array in place —
  // the drag idiom that would alias — and assert the RECORD does not move.
  // ⚠ THIS TEST COULD NOT HAVE PASSED BEFORE THE CURE: the arrays were the
  // same object, so writing one wrote both. It is the whole claim in one line.
  home[0] = 99;
  check('§1b ⛔ THE FALSIFIER: mutating the live `home` IN PLACE (`home[0] = 99` — exactly what an in-place drag would do) leaves the recorded act and the memorial reading their original site. The record is a fact about WHERE THE FORM WAS, and no later arrangement can rewrite it',
    act.entry.home[0] === 1 && mark.home[0] === 1);
  note(`after home[0] = 99 → act.entry.home[0] = ${act.entry.home[0]} · mark.home[0] = ${mark.home[0]} (the live array now reads ${home[0]})`);

  check('§1b ⛔ AND THE MEMORIAL CANNOT BE DRAGGED — the designer’s ruling is why the copy is the RIGHT cure and not merely the safe one: *A MEMORIAL’S CONTENT IS ITS POSITION. It says a form was HERE. A memorial that can be moved is a lie about where the form was.* ⇒ the mark mounts with pointerEvents none, so it cannot be picked up at all — the limit is AT THE GRAB, not after the gesture',
    (() => {
      const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
      const memorial = viewSrc.slice(viewSrc.indexOf('function SiteMemorial'), viewSrc.indexOf('// CUT 1 — THE FAITHFUL BODY'));
      return memorial.includes("pointerEvents: 'none'") && !/onPointerDown|draggable/i.test(memorial);
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

  check('§4 ⛔ U.4 + B-131 §4.2 — THE WORD IS COMPUTED FROM THE ACT AND THE CONTROL DOES NOT NAME THE FORM: the control sits ON the acts line, which already names which form (*where position carries meaning, repetition is harmless; where position carries nothing, repetition is a lie* — and here position carries it), so the view composes `undo — <word>` alone and returns `undefined` (not a disabled button) when every act is reverted',
    (() => {
      const src = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
      const body = src.slice(src.indexOf('undo={(() => {'), src.indexOf('undo={(() => {') + 1400);
      return body.includes('if (!target) return undefined;') &&
        body.includes('`undo — ${word}`') &&
        !body.includes('${target.name}');
    })());

  check('§4 ⛔ B-131 §4 (Δ23’s one-line arm, her grammar) — THE ACT WORD NEVER JOINS THE TITLE’S DASH: the acts line is STRUCTURED (name + phrase) and the strip renders the title roman and whole with the act in its own face after the register’s own `·`; the dash-joined `${a.name} — ${word}` composition is gone from the composer',
    (() => {
      const src = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
      const chrome = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptChrome.tsx'), 'utf8');
      const composer = src.slice(src.indexOf('acts={(() => {'), src.indexOf('acts={(() => {') + 1600);
      return composer.includes('{ name: a.name, phrase:') &&
        !/\$\{a\.name\} — \$\{word\}/.test(composer) &&
        chrome.includes('acts?: { name: string; phrase: string }[]') &&
        chrome.includes("<span style={{ fontStyle: 'italic', opacity: 0.85 }}> · {a.phrase}</span>");
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

  check('§6 ⛔ M.2 + M.3 + Δ23 (B-129 §3) — THE NAME AND THE WORD, the word is `removed` (NEVER `died`), AND THE WORD DOES NOT RIDE THE NAME’S DASH: the ledger’s copied name is the machine TITLE, which already ends in its birth word in the same dash grammar — so the act’s word stands on its OWN line, and the dash-joined `${name} — removed` composition is gone',
    memorial.includes('<div>{gone[0].name}</div>') &&
    memorial.includes('<div>removed</div>') &&
    !/\$\{gone\[0\]\.name\} — removed/.test(memorial) &&
    !/\bdied\b/.test(memorial.replace(/\/\/[^\n]*/g, '')));

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
    memorial.includes('<div>{back[0].name}</div>') &&
    memorial.includes('<div>restored</div>') &&
    !/\$\{back\[0\]\.name\} — restored/.test(memorial) &&
    memorial.includes('${back.length} restored here'));
}

// ═════ §7 THE DRAG (D1) — D.1–D.7, structurally ══════════════════════════════
// ⛔ WHAT THIS LEG CAN SAY: the drag is R3F pointer handling, so the GESTURE is
// the drive family's and the eye's. What is measurable here is every clause
// that is a fact about the SOURCE — which idiom writes `home`, what the ledger
// does NOT gain, whether the memorial can be grabbed, and where the bound
// comes from.
console.log('\n----- §7 the drag: the person’s hand on `home` -----');
{
  const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
  const snapSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/pageSnapshot.ts'), 'utf8');
  const down = viewSrc.slice(viewSrc.indexOf('onPointerDown={(event) => {'), viewSrc.indexOf('onClick={(event) => {', viewSrc.indexOf('onPointerDown={(event) => {')));

  check('§7 ★★ D.1 — THE GESTURE IS A DRAG ON THE FORM, and no new vocabulary: pointerdown grabs, pointermove writes `home`, pointerup releases, with the pointer CAPTURED so the form does not fall out of the hand at the edge of its own body. ⚠ Only a WRITTEN form grabs — the handler resolves `written` first and returns if the id is not one, so the world’s rows and the built rooms never pick up',
    down.includes('const entry = written.find((w) => `w:${w.form.id}` === id);') &&
    down.includes('if (!entry) return;') &&
    down.includes('setPointerCapture') &&
    viewSrc.includes('releasePointerCapture'));

  check('§7 ⛔ D.2 + D.7 — MOVING IS NOT GENEALOGY AND NOT AN ACT: the whole drag block touches neither the DAG nor the ledger — no `acts`, no `removeForm`, no `recordBuilt`. ★ Her risk, foreclosed by the researcher’s Q5: *an undo chain crowded with arrangement cannot reach the acts that matter*',
    (() => {
      const block = viewSrc.slice(viewSrc.indexOf('onPointerDown={(event) => {'), viewSrc.indexOf('onContextMenu={(event) => {'));
      return !/acts|removeForm|setAsideForm|undoLastAct|recordBuilt|genesis/.test(block);
    })());

  check('§7 ⛔⛔ THE IDIOM IS THE IMMUTABLE REPLACE, AND IT IS A MEANING DECISION: the move maps to `{ ...w, home: [...] }` and NEVER writes into the existing array. ★ *A MEMORIAL’S CONTENT IS ITS POSITION — a memorial that can be moved is a lie about where the form was* ⇒ the memorial must NOT follow, so the divergence I first read as the hazard is the REQUIREMENT',
    /\{ \.\.\.w, home, placedByPerson: true as const \}/.test(viewSrc) &&
    !/w\.home\[0\] =|entry\.home\[0\] =|home\[0\] =/.test(viewSrc));

  check('§7 ⛔ D.3 — THE PAGE MAY NEVER RE-PLACE WHAT HE PLACED: `placedByPerson` is NEW STATE on WrittenPageEntry (nothing distinguished his placements before — `zooMember` means *the zoo put this here*), it is set on the drag AND on the two placements he already chooses (the invoke at his pointer, the shelf drop), and NOTHING RENDERS FROM IT — state, not a visible mark, because a mark on the ordinary stops meaning anything',
    snapSrc.includes('placedByPerson?: true;') &&
    (viewSrc.match(/placedByPerson: true/g) ?? []).length === 3 &&
    !/placedByPerson \?|placedByPerson &&|\.placedByPerson\b/.test(viewSrc));

  check('§7 ★ D.5 — HE MUST NOT BE ABLE TO PUT A FORM WHERE HE CANNOT FIND IT, and the bound is not an invented rectangle: it is WHAT THE CAMERA CAN SEE at the page’s own plane, unprojected from the camera itself, so the clause’s own words are the mechanism. ⚠ A degenerate view yields no rect and the drop stands — the pointer is on screen by construction',
    viewSrc.includes('const visibleAtPage = (camera: THREE.Camera)') &&
    viewSrc.includes('Math.min(bounds.maxX, Math.max(bounds.minX, raw[0]))') &&
    viewSrc.includes('if (!Number.isFinite(minX) || !Number.isFinite(minY)) return null;'));

  check('§7 ✔ D.6 — THE STEMMA FOLLOWS THE HOMES, and it is FREE: `stemmaLines` reads `homeOfShapeId`, which is built over the live `written` — so moving a form moves its edges with it. ★★★ Which is why this is not a convenience feature: ARRANGING THE PAGE IS ARRANGING THE ARGUMENT',
    viewSrc.includes('const from = homeOfShapeId.get(edge.parent);') &&
    viewSrc.includes('const to = homeOfShapeId.get(edge.child);'));

  check('§7 ✔ D.4 — SAVE NEEDS NOTHING: `home` already rides `written` into the page file, and `placedByPerson` rides the same entry — so his arrangement AND its provenance survive a save/load for free (the rare case where the persistence half was done before the gesture existed)',
    snapSrc.includes('written: WrittenPageEntry[];') &&
    fs.readFileSync(path.join(repoRoot, 'src/manuscript/pageStore.ts'), 'utf8').includes('written: records.written,'));

  check('§7 ⛔ AND THE WORLD HOLDS STILL WHILE A FORM IS IN HAND: the orbit is disabled for the duration of the drag, so a left-drag on a FORM moves the form while the same left-drag on empty paper still orbits — the discriminator is what is under the pointer, not a mode the person has to hold',
    viewSrc.includes('enabled: !dragging'));
}

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`} — P5 + UNDO`);
process.exit(failures === 0 ? 0 : 1);

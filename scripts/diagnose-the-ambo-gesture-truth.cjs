#!/usr/bin/env node

// DIAGNOSTIC — THE AMBO TELLS THE TRUTH ABOUT ITS GESTURES (STAMP C-6a part 1,
// 2026-09-17; the designer's §92 measurement: fourteen gestures, one stated).
//
// THE RULING, in two rows of the inspector (src/components/Panels.tsx — the
// designer cited Workspace3D, the rows live in Panels; Workspace3D carries
// only formatHoverStatus):
//   · THE EDGE ROW: a plain click SELECTS a liftable edge (or refuses an
//     identified pair in the seam notice), and its tooltip said only the
//     shift. It takes the vertex row's grammar: `click: select · shift-click:
//     toggle in the lift region`.
//   · THE FACE ROW: `cursor: pointer` over a plain click that does NOTHING
//     (the onClick acts only under shift). RULED (composition, §92.3): TAKE
//     THE CURSOR — `cursor-default` — and invent no select-face act: the
//     Ambo's faces are READINGS; the face's plain-click act is C-5's to give,
//     with a meaning. `selectFace` exists only in the Playground store.
//   · THE VERTEX ROW is untouched — it already spoke: `click: inspect ·
//     shift-click: toggle in the lift region`.
// Boundaries: no new act, no new store action, formatHoverStatus untouched.
//
// ⛔ THE INSTRUMENT: copy IS behaviour, so the pins are on the SOURCE the
// person's tooltip and cursor are computed from; the eye-run (the computed
// cursor of a face row, the edge row's title) is the drive's business and is
// reported with its sighting.

const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
// the two files are CRLF in the working copy — the pins read them as the compiler does, one newline
const readLf = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').split('\r\n').join('\n');
const panels = readLf('src/components/Panels.tsx');
const workspace = readLf('src/components/Workspace3D.tsx');

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined && !cond ? ` — ${detail}` : ''}`);
  if (!cond) failures += 1;
};

console.log('THE AMBO TELLS THE TRUTH ABOUT ITS GESTURES — the inspector rows say what a click does (C-6a part 1)\n');

// ── the vertex row: the grammar the other rows take, unchanged ──
const vertexTitle = 'title="click: select · shift-click: toggle in the lift region"';
check('§1 THE VERTEX ROW says what its click does in the module\'s own verb (C-6b: the consumers are named on SELECTION): `click: select · shift-click: toggle in the lift region`, once, on a button whose plain click selects and whose shift-click toggles the lift set',
  (panels.match(new RegExp(vertexTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) ?? []).length === 1 &&
    panels.includes("                  selectVertex(row.vertex.id);\n") &&
    panels.includes("                    toggleLiftSelection({ kind: 'vertex', id: row.vertex.id });\n"));

// ── the edge row: the tooltip tells the truth about its plain click ──
const edgeSlice = panels.slice(panels.indexOf('<SelectionSubsection title="Cell Edges"'), panels.indexOf('</SelectionSubsection>', panels.indexOf('<SelectionSubsection title="Cell Edges"')));
check('§1 ★ THE EDGE ROW\'s tooltip takes the vertex row\'s grammar: `click: select · shift-click: toggle in the lift region` on a liftable edge — the same row whose plain click calls selectEdge (GAP2A parity) and whose shift-click toggles the lift set',
  edgeSlice.includes("`${edge.vertexIds.join(' - ')} · click: select · shift-click: toggle in the lift region`") &&
    edgeSlice.includes('selectEdge(edge.edgeId);') && edgeSlice.includes("toggleLiftSelection({ kind: 'edge', id: edge.edgeId });") &&
    !edgeSlice.includes("`${edge.vertexIds.join(' - ')} · shift-click: toggle in the lift region`"));
check('§1 …and the identified pair, whose plain click and shift-click both REFUSE in the seam notice, keeps its refusal as its tooltip',
  edgeSlice.includes("`${edge.vertexIds.join(' - ')} · an identified pair — cannot be lifted`") &&
    (edgeSlice.match(/setEdgeNotice\('an identified pair — cannot be lifted'\);/g) ?? []).length === 2);
check('§1 the edge row is still a control (it acts on a plain click): `cursor-pointer` stays', edgeSlice.includes('className={`cursor-pointer rounded border px-2 py-1 text-xs text-stone-400 ${'));

// ── the face row: a control that cannot act must not appear as one ──
const faceSlice = panels.slice(panels.indexOf('<SelectionSubsection title="Cell Faces"'), panels.indexOf('</SelectionSubsection>', panels.indexOf('<SelectionSubsection title="Cell Faces"')));
check('§1 ★ THE FACE ROW takes `cursor-default` — its onClick acts ONLY under shift (a plain click does nothing, measured LAW 24), so the pointer cursor is taken, not a select-face act invented',
  faceSlice.includes('className={`cursor-default rounded border px-3 py-2 text-sm ${') && !faceSlice.includes('cursor-pointer') &&
    faceSlice.includes("                if (event.shiftKey) toggleLiftSelection({ kind: 'face', id: row.face.id });\n") &&
    faceSlice.includes('title="shift-click: toggle in the lift region"'));
check('§1 ⛔ NO select-face act was invented: `selectFace` does not appear in the Ambo (Panels · Workspace3D) — it exists only in the Playground store',
  !panels.includes('selectFace') && !workspace.includes('selectFace'));

// ── boundaries ──
check('§1 formatHoverStatus\'s CONTENT branches say what is under the pointer — the identification, clean (C-6b: no branch begins with `Hovering `; the ordinary is not marked)',
  ['`cell ${label} | ${cellSummary} | id: ${cell.id}`', '`vertex ${label} | id: ${target.vertexId}`',
   '`edge ${endpoints} | ${relation} | id: ${edge.id}`', '`face ${label} | ${relation} | id: ${face.id}`'].every((s) => workspace.includes(s)) &&
    !/return\s+`Hovering |return\s+'Hovering /.test(workspace) && !workspace.includes('Hovering '));
check('§1 ★ THE BARE CELL BRANCH (priced, then cut — C-6b item 3): a cell id the shape does not hold is a STALE target across a shape change, so it is the true absence (null), never a word; the face branch of the same class likewise; the identified-pair edge keeps its sentence (a real state)',
  workspace.includes('    if (!cell) {\n      return null;\n    }\n') && workspace.includes('  if (!face) {\n    return null;\n  }\n') &&
    workspace.includes('    if (!edge) {\n      return `edge ${endpoints}`;\n    }\n'));
check('§1 no new store action rode in: the inspector\'s row handlers call only selectVertex · selectEdge · toggleLiftSelection · setEdgeNotice · setHoverTarget',
  ['selectVertex(', 'selectEdge(', 'toggleLiftSelection(', 'setEdgeNotice(', 'setHoverTarget('].every((s) => panels.includes(s)) &&
    !/\bselectFace\(|\bselectCellFace\(|\binspectFace\(/.test(panels));

// ═══════════════ §2 — C-6a PART 2: the designer's line, in its own row, with the two rulings that ride ═══════════════
console.log('\n----- §2 ★★ C-6a part 2 — the Ambo states every act it offers, in its OWN row -----');
const explore = readLf('src/manuscript/ExploreWindow.tsx');
// C-6c (iii): the line gains her clause verbatim — `a corner takes a concept-space from the packets tab`
const THE_LINE = 'click — select what you point at, on the solid or in the inspector · shift-click — toggle it in the lift region (on the solid: the face you hit) · shift+alt-click the solid — the whole cell instead · edges lift from the inspector\'s rows only · hover — preview what corresponds · drag — orbit · right-drag — pan · wheel or middle-drag — zoom · a corner takes a concept-space from the packets tab';
const lineAt = workspace.indexOf('{`' + THE_LINE + '`}');
const canvasCloseAt = workspace.indexOf('</Canvas>');
const readoutAt = workspace.indexOf('data-ambo-hover-readout="true"');
const gestureAt = workspace.indexOf('data-ambo-gesture-line="true"');
check('§2 ★★ THE LINE IS PRESENT VERBATIM, ONCE, in its OWN element (`data-ambo-gesture-line`) — a row after the canvas, not the hover readout\'s field',
  lineAt > 0 && workspace.indexOf('{`' + THE_LINE + '`}', lineAt + 1) < 0 && gestureAt > canvasCloseAt && lineAt > gestureAt && lineAt - gestureAt < 400 &&
    !(lineAt > readoutAt && lineAt < readoutAt + 700),
  JSON.stringify({ lineAt, gestureAt, canvasCloseAt, readoutAt }));
check('§2 ★ the canvas and the line share a COLUMN: the wrapper is a flex column, the canvas grows, the line is its own row under it',
  workspace.includes('<div className="relative flex h-full min-h-0 w-full flex-col bg-neutral-950">') &&
    workspace.includes('className="min-h-0 w-full flex-1"') && workspace.includes('className="shrink-0 border-t border-stone-800 bg-stone-950 px-3 py-2 text-xs leading-relaxed text-stone-400"'));
check('§2 ★★ THE READOUT\'S EMPTY STATE IS A TRUE ABSENCE: `formatHoverStatus` returns null for no target (the sentence that named a gesture is GONE from the module), and the slot holds its height with a hidden, aria-hidden ghost — no words shown, no glyph, no em-dash',
  workspace.includes('function formatHoverStatus(shape: Shape, target: InspectionHoverTarget | null): string | null {') &&
    workspace.includes('  if (!target) {\n    return null;\n  }\n') &&
    !workspace.includes('Hover a cell or inspector row to preview correspondence') &&
    workspace.includes('{formatHoverStatus(shape, hoverTarget) ?? (') &&
    workspace.includes('<span aria-hidden="true" data-ambo-hover-ghost="true" style={{ visibility: \'hidden\' }}>') &&
    !/data-ambo-hover-ghost[^<]*>\s*—/.test(workspace));
check('§2 ★ CELL COMPOSITION OPENS BY DEFAULT — the only route to lifting an edge (the canvas has no edge handler: its two mesh clicks select a cell or toggle a face/cell)',
  /id="selection-composition"\n\s+title="Cell Composition"\n[\s\S]{0,400}?\n\s+defaultOpen\n/.test(panels) &&
    !/id="selection-composition"[\s\S]{0,500}?defaultOpen=\{false\}/.test(panels) &&
    (workspace.match(/onClick=/g) ?? []).length === 5 && !workspace.includes("toggleLiftSelection({ kind: 'edge'") && !workspace.includes('selectEdge('));
check('§2 THE WALK\'S LINE IS UNTOUCHED (the idiom was transplanted, not the text)',
  explore.includes("{`↑/↓ — walk (tap: one step of ${stepUnit.toFixed(2)} · hold: glide) · ←/→ — turn (tap: 1/${turnFraction} turn · hold: sweep) · PgUp/PgDn — look up and down (the same) · End — face the nearest door · Home — face as you entered · a door's letter — cross it, shift for the other way · drag — look around · press and hold — walk forward · the hatch settles in when you stand still · esc returns to the shell`}"));
check('§2 the verb rider is CUT (C-6b: `select`) and the buttons rider is not: the three camera buttons are not in the line',
  !panels.includes('click: inspect') && !THE_LINE.includes('fit') && !THE_LINE.includes('reset'));

// ═══════════════ §3 — C-6e: the Layer-3 witness panel prints each site's seam fact ONCE, labelled, in words ═══════════════
console.log('\n----- §3 ★ C-6e — one printing, under its label; the value in words; a dash is a separator, never a value -----');
const layer3 = readLf('src/components/Layer3WitnessPanel.tsx');
const siteBlock = layer3.slice(layer3.indexOf('Six X_K sites in loop order'), layer3.indexOf('</ul>', layer3.indexOf('Six X_K sites in loop order')));
check('§3 ★ THE SEAM FACT IS PRINTED ONCE, under `on seam?` — the unlabelled second printing beside the site key is gone',
  (siteBlock.match(/\{seamLabel\}/g) ?? []).length === 1 && siteBlock.includes('<dt className="text-stone-500">on seam?</dt>') &&
    !siteBlock.includes('<span className="text-stone-500">{seamLabel}</span>'));
check('§3 ★ THE VALUE IS IN WORDS: `on seam (bd–cd)` / `not on seam` — no dash stands as a value in the block (the separators stay separators)',
  layer3.includes("seamLabel: incidentSeams.length ? `on seam (${incidentSeams.join(', ')})` : 'not on seam',") && !layer3.includes(": '—'"));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-AMBO-GESTURE-TRUTH: ALL PASS — the rows say what a click does, the line states every act in its own row, the readout\'s empty state is a true absence, the composition opens by default, and the Layer-3 panel prints its seam fact once in words' : `DIAGNOSE-THE-AMBO-GESTURE-TRUTH: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

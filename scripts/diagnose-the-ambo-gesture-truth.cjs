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
const vertexTitle = 'title="click: inspect · shift-click: toggle in the lift region"';
check('§1 THE VERTEX ROW is untouched: `click: inspect · shift-click: toggle in the lift region`, once, on a button whose plain click inspects and whose shift-click toggles the lift set',
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
check('§1 formatHoverStatus is untouched — its `if (!target)` branch still returns the one sentence the designer measured, and no gesture line was put in its slot',
  workspace.includes("  if (!target) {\n    return 'Hover a cell or inspector row to preview correspondence';\n  }\n"));
check('§1 no new store action rode in: the inspector\'s row handlers call only selectVertex · selectEdge · toggleLiftSelection · setEdgeNotice · setHoverTarget',
  ['selectVertex(', 'selectEdge(', 'toggleLiftSelection(', 'setEdgeNotice(', 'setHoverTarget('].every((s) => panels.includes(s)) &&
    !/\bselectFace\(|\bselectCellFace\(|\binspectFace\(/.test(panels));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-AMBO-GESTURE-TRUTH: ALL PASS — the edge row says click: select, the face row is no longer dressed as a control, the vertex row is as it was' : `DIAGNOSE-THE-AMBO-GESTURE-TRUTH: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

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
const ts = require('typescript');

// the words reader is RUN, not only read (a function's return is measured by calling it)
const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
};
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
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
const edgeSlice = panels.slice(panels.indexOf('<SelectionSubsection title="edges"'), panels.indexOf('</SelectionSubsection>', panels.indexOf('<SelectionSubsection title="edges"')));
check('§1 ★ THE EDGE ROW\'s tooltip takes the vertex row\'s grammar: `click: select · shift-click: toggle in the lift region` on a liftable edge — the same row whose plain click calls selectEdge (GAP2A parity) and whose shift-click toggles the lift set; the edge named by its corners (COPY-1 P1/P3: `AB–AC`, never the ids the title once joined)',
  edgeSlice.includes("`${edge.displayLabel} · click: select · shift-click: toggle in the lift region`") &&
    edgeSlice.includes('selectEdge(edge.edgeId);') && edgeSlice.includes("toggleLiftSelection({ kind: 'edge', id: edge.edgeId });") &&
    !edgeSlice.includes("edge.vertexIds.join(' - ')"));
check('§1 …and the identified pair, whose plain click and shift-click both REFUSE in the seam notice, keeps its refusal as its tooltip — in COPY-1 §5.4\'s words: `its ends are identified, so there is no edge to lift`',
  edgeSlice.includes("`${edge.displayLabel} · its ends are identified, so there is no edge to lift`") &&
    (edgeSlice.match(/setEdgeNotice\('its ends are identified, so there is no edge to lift'\);/g) ?? []).length === 2 && !edgeSlice.includes('an identified pair'));
check('§1 the edge row is still a control (it acts on a plain click): `cursor-pointer` stays', edgeSlice.includes('className={`cursor-pointer rounded border px-2 py-1 text-xs text-stone-400 ${'));

// ── the face row: a control now — its act has a meaning (C-10b, §131 item 2: the face's reading mounts at its home) ──
const faceSlice = panels.slice(panels.indexOf('<SelectionSubsection title="faces"'), panels.indexOf('</SelectionSubsection>', panels.indexOf('<SelectionSubsection title="faces"')));
check('§1 ★ THE FACE ROW IS A CONTROL NOW (C-10b superseding C-6a\'s "no select-face act": the act has its meaning — the face\'s reading mounts at its home): `cursor-pointer`, a plain click calls `selectFace(row.face.id)`, shift-click toggles the lift set, and the tooltip says both — `click: read the face · shift-click: toggle in the lift region`',
  faceSlice.includes('className={`cursor-pointer rounded border px-3 py-2 text-sm ${') && !faceSlice.includes('cursor-default') &&
    faceSlice.includes("                selectFace(row.face.id);\n") && faceSlice.includes("                  toggleLiftSelection({ kind: 'face', id: row.face.id });\n") &&
    faceSlice.includes('title="click: read the face · shift-click: toggle in the lift region"'));
const store = readLf('src/store/geometryStore.ts');
check('§1 ★ THE ONE select-face act is NAMED, with its meaning and its home: the store\'s `selectFace` (keeps the cell, clears vertex and edge — the edge\'s own rule), called from the face row (Panels) and from the solid\'s plain click on the face you hit (Workspace3D); the selection panel mounts `SelectedFaceReading` at `selection-face-home` when a face is selected',
  store.includes('  selectFace: (faceId) => {') && panels.includes('selectFace(row.face.id);') && workspace.includes('if (hitFace) selectFace(hitFace.id);') &&
    panels.includes('<SidebarSection id="selection-face-home" title="face" defaultOpen resetKey={selectedFace.id}>') && panels.includes('<SelectedFaceReading shape={shape} faceId={selectedFace.id} />'));

// ── boundaries ──
check('§1 ★ formatHoverStatus\'s CONTENT branches say what is under the pointer in COPY-1 §5.2\'s words (STAMP LAYOUT-1, stage 4a) — `corner A` · `midpoint AB` · `unnamed midpoint of A–B` · `edge A–B · boundary` · `face A·B·C` (`the ground · face A·B·C`) · a cell by kind, shape and generation (P4, through the one words reader) — NO `id:` part (P1), the face by D14 through the one composer with `unnamed` in an unlabelled corner\'s place (P3), no branch begins with `Hovering ` (C-6b: the ordinary is not marked)',
  ['`corner ${label}`', "'unnamed corner'", '`midpoint ${label}`', '`unnamed midpoint of ${sceneName(shape, parents[0])}–${sceneName(shape, parents[1])}`', '`edge ${ends}`', '`face ${name}`', '`${label} · face ${name}`', '`${label} · ${words}`', 'cellWords(cell.kind,'].every((s) => workspace.includes(s)) &&
    workspace.includes("return faceDisplayName(shape, face, () => 'unnamed');") && workspace.includes('const ends = sceneEdgeName(shape, target.vertexIds);') && !/id: \$\{/.test(workspace) && !workspace.includes('sceneIdTail') && !/\| id:/.test(workspace) &&
    !/return\s+`Hovering |return\s+'Hovering /.test(workspace) && !workspace.includes('Hovering '));
check('§1 ★ THE BARE BRANCHES (priced, then cut — C-6b item 3): a cell, a vertex or a face id the shape does not hold is a STALE target across a shape change, so it is the true absence (null), never a word; the identified-pair edge keeps its sentence (a real state)',
  workspace.includes('    if (!cell) {\n      return null;\n    }\n') && workspace.includes('    if (!vertex) {\n      return null;\n    }\n') && workspace.includes('  if (!face) {\n    return null;\n  }\n') &&
    workspace.includes('    if (!edge) {\n      return `edge ${ends}`;\n    }\n'));
check('§1 the inspector\'s row handlers call selectVertex · selectEdge · selectFace (C-10b, the one named addition) · toggleLiftSelection · setEdgeNotice · setHoverTarget — and no other face act (`selectCellFace` · `inspectFace` nowhere)',
  ['selectVertex(', 'selectEdge(', 'selectFace(', 'toggleLiftSelection(', 'setEdgeNotice(', 'setHoverTarget('].every((s) => panels.includes(s)) &&
    !/\bselectCellFace\(|\binspectFace\(/.test(panels));

// ═══════════════ §2 — LAYOUT-1 §3/§6 (STAMP LAYOUT-1, the cut's stage 4a) supersedes C-6a part 2: NO INSTRUCTION STANDS ON THE PAGE ═══════════════
// The designer's gesture line (C-6a part 2; grown by C-6c (iii) and C-7d) taught every act in its own row under the canvas. Δ121
// (LAYOUT-1 §1 rule 3): how to do something shows in a ? and in a hint, nowhere else — so the line is GONE, the solid's ? holds its
// gestures VERBATIM (§6), and the row the line held carries the counts in one small line (§3; COPY-1 §5.2).
console.log('\n----- §2 ★★ LAYOUT-1 — the gesture line is gone; the solid\'s ? states the gestures; the counts line holds the foot -----');
const explore = readLf('src/manuscript/ExploreWindow.tsx');
const SOLID_HELP = [
  'click: select, on the solid or in a drawer',
  'shift-click: toggle in the lift region (on the solid, the face under the pointer)',
  'shift+alt-click on the solid: the whole cell',
  'an edge: shift-click its row in a drawer',
  'click a midpoint: open it (once it holds a space)', // MARKER LAYOUT-1 · M11 (the designer's 10:41, §276)
  'drag: rotate · right-drag: pan · scroll or middle-drag: zoom',
];
const canvasCloseAt = workspace.indexOf('</Canvas>');
const countsAt = workspace.indexOf('data-ambo-counts="true"');
const readoutAt = workspace.indexOf('data-ambo-hover-readout="true"');
check('§2 ★★ THE GESTURE LINE IS GONE — no `data-ambo-gesture-line`, none of its sentence left in the module (`select what you point at`, `two halves`, `preview what corresponds`)',
  !workspace.includes('data-ambo-gesture-line') && !workspace.includes('select what you point at') && !workspace.includes('two halves') && !workspace.includes('preview what corresponds'));
check('§2 ★★ THE SOLID\'S ? holds LAYOUT-1 §6\'s six lines VERBATIM, one gesture per line, mounted ONCE at the solid\'s top left beside the readout — through HelpNote, the one component a ? comes from',
  SOLID_HELP.every((line) => workspace.includes(`  '${line}',`)) && (workspace.match(/<HelpNote /g) ?? []).length === 1 && workspace.includes('<HelpNote area="solid" lines={SOLID_HELP} />') &&
    workspace.includes("import { HelpNote } from './HelpNote';") && readoutAt > workspace.indexOf('<HelpNote area="solid"') && readoutAt - workspace.indexOf('<HelpNote area="solid"') < 400,
  JSON.stringify({ readoutAt, help: workspace.indexOf('<HelpNote area="solid"') }));
check('§2 ★ the canvas and the foot row share a COLUMN: the wrapper is a flex column, the canvas grows, and THE COUNTS LINE is its own row under it (`data-ambo-counts`, after the canvas, through the one counts reader)',
  workspace.includes('<div className="relative flex h-full min-h-0 w-full flex-col bg-neutral-950">') && workspace.includes('className="min-h-0 w-full flex-1"') &&
    countsAt > canvasCloseAt && workspace.includes('{solidCountsWords(shape)}') && /import \{ [^}]*solidCountsWords[^}]* \} from '\.\/copyWords';/.test(workspace) &&
    workspace.includes('className="shrink-0 border-t border-stone-800 bg-stone-950 px-3 py-1.5 text-xs leading-relaxed text-stone-400"'),
  JSON.stringify({ countsAt, canvasCloseAt }));
{
  // RUN: the counts line's words on a shape of the fixture's kinds (COPY-1 §5.2; rule 10 plural right; the kinds present with their counts)
  const { solidCountsWords, historyWords, cellWords, countNoun } = req('src/components/copyWords.ts');
  const cell = (kind) => ({ kind });
  const six = { genealogy: { generationDepth: 1 }, cells: [cell('parent'), cell('core'), cell('residue'), cell('residue'), cell('residue'), cell('residue')], faces: new Array(8).fill({}), vertices: Object.fromEntries(['A', 'B', 'C', 'D', 'E', 'F'].map((k) => [k, {}])) };
  const one = { genealogy: { generationDepth: 0 }, cells: [cell('seed')], faces: new Array(4).fill({}), vertices: Object.fromEntries(['A', 'B', 'C', 'D'].map((k) => [k, {}])) };
  check('§2 ★★ RUN — the counts line reads `generation 1 · 6 cells (1 parent, 1 core, 4 residue) · 8 faces · 6 vertices` on a dissected tetrahedron\'s kinds (the seed\'s copy is kind `parent`, src/lib/ambo.ts — and the counts line KEEPS `1 parent`: there it counts the relation, and it doesn\'t double; MARKER LAYOUT-1 · M14), and `generation 0 · 1 cell (1 seed) · 4 faces · 4 vertices` on the seed (a number and its noun, plural right — never `g1`, never `cell(s)`)',
    solidCountsWords(six) === 'generation 1 · 6 cells (1 parent, 1 core, 4 residue) · 8 faces · 6 vertices' && solidCountsWords(one) === 'generation 0 · 1 cell (1 seed) · 4 faces · 4 vertices',
    JSON.stringify([solidCountsWords(six), solidCountsWords(one)]));
  check('§2 ★ RUN — the words reader: a cell by kind, shape and generation (P4: `seed tetrahedron, generation 0`; a parent-kind cell by what happened to it — `seed tetrahedron, generation 0` at generation 0, `dissected octahedron, generation 1` above it, M14; no recorded shape → `core, generation 1`, never `unknown`), a count with its noun (`1 vertex` · `2 vertices`), the history\'s legacy labels read as the same acts (`Seed: Tetrahedron` → `the seed: Tetrahedron`; `Reset Workspace: Cube` → `reset: Cube`; `Ambo Dissection` as it is)',
    cellWords('seed', 'tetrahedron', 0) === 'seed tetrahedron, generation 0' && cellWords('parent', 'tetrahedron', 0) === 'seed tetrahedron, generation 0' && cellWords('parent', 'octahedron', 1) === 'dissected octahedron, generation 1' && cellWords('core', null, 1) === 'core, generation 1' && cellWords('core', 'unknown', 1) === 'core, generation 1' && cellWords('core', 'rectified-square-pyramid-ambo-core', 2) === 'core rectified square pyramid (Ambo core), generation 2' &&
      countNoun(1, 'vertex', 'vertices') === '1 vertex' && countNoun(2, 'vertex', 'vertices') === '2 vertices' && historyWords('Seed: Tetrahedron') === 'the seed: Tetrahedron' && historyWords('Reset Workspace: Cube') === 'reset: Cube' && historyWords('Ambo Dissection') === 'Ambo Dissection' && historyWords('the seed: Tetrahedron') === 'the seed: Tetrahedron');
  // MARKER LAYOUT-1 · M14 (the designer's 11:27, ratified §280): a cell's parent is named by HIS name where it has one, else by its kind and
  // shape — the dissected seed's copy (kind `parent`) is `the seed tetrahedron` at generation 0 and `the dissected octahedron` above it.
  check('§2 ★★ RUN — M14: `cellNameOrWords` (src/components/Panels.tsx, the ONE reader the cells row, the cell card\'s parent line, the lineage\'s parent line and the buttons read): `the knower` where the cell has his name · `the seed tetrahedron` · `the dissected octahedron` · `the core octahedron`; the two parent lines print `parent: ${cellNameOrWords(…)}`',
    (() => {
      const { cellNameOrWords } = req('src/components/Panels.tsx');
      const mk = (kind, topology, generationDepth, data = {}) => ({ id: 'c', kind, topology, generationDepth, parentCellId: null, sourceOperation: 'seed', vertexIds: [], faceIds: [], sourceVertexIds: [], sourceEdgeIds: [], data });
      return cellNameOrWords(mk('parent', 'tetrahedron', 0, { label: 'the knower' })) === 'the knower' && cellNameOrWords(mk('parent', 'tetrahedron', 0)) === 'the seed tetrahedron' &&
        cellNameOrWords(mk('parent', 'octahedron', 1)) === 'the dissected octahedron' && cellNameOrWords(mk('core', 'octahedron', 1)) === 'the core octahedron' &&
        panels.includes("return parent ? `parent: ${cellNameOrWords(parent.cell)}` : 'parent: not in this shape';") && panels.includes('? `parent: ${cellNameOrWords(parentRow.cell)}`');
    })());
  check('§2 ★★ M14 — thicken\'s FOUR hints, each matching its gate (nothing selected · a face alone · a cell alone, the dimension said before the click · a region holding a cell), and the store\'s own refusal with nothing selected; no list for thicken names a cell as something to select — it takes a vertex or an edge, or a region with no cell in it',
    panels.includes("'select a vertex or an edge first, or shift-click a region'") && panels.includes("\"thicken doesn't take a face: select a vertex or an edge, or shift-click a region\"") &&
      panels.includes("\"thicken doesn't take a cell (it would be 4-dimensional): select a vertex or an edge, or shift-click a region\"") && panels.includes("\"thicken doesn't take a cell (it would be 4-dimensional): take the cells out of the region\"") &&
      !panels.includes('select a cell, a vertex or an edge') && readLf('src/store/geometryStore.ts').includes("'select a vertex or an edge first, or shift-click a region'") && !readLf('src/store/geometryStore.ts').includes('select a cell, a vertex or an edge'));
}
check('§2 ★★ THE READOUT\'S EMPTY STATE IS A TRUE ABSENCE: `formatHoverStatus` returns null for no target (the sentence that named a gesture is GONE from the module), and the slot holds its height with a hidden, aria-hidden ghost — no words shown, no glyph, no em-dash',
  workspace.includes('function formatHoverStatus(shape: Shape, target: InspectionHoverTarget | null): string | null {') &&
    workspace.includes('  if (!target) {\n    return null;\n  }\n') &&
    !workspace.includes('Hover a cell or inspector row to preview correspondence') &&
    workspace.includes('const readout = formatHoverStatus(shape, hoverTarget);') && workspace.includes('{readout ?? (') &&
    // M12 (10): the frame (border, ground, shadow) comes with the content — the empty readout holds its height without one
    workspace.includes("${readout ? 'rounded border border-stone-800 bg-stone-950/85 shadow-lg' : ''}") &&
    workspace.includes('<span aria-hidden="true" data-ambo-hover-ghost="true" style={{ visibility: \'hidden\' }}>') &&
    !/data-ambo-hover-ghost[^<]*>\s*—/.test(workspace));
check('§2 ★ CELL COMPOSITION OPENS BY DEFAULT — the only route to lifting an edge (the canvas has no edge handler: its two mesh clicks select a cell or toggle a face/cell)',
  /id="selection-composition"\n\s+title="parts"\n[\s\S]{0,400}?\n\s+defaultOpen\n/.test(panels) &&
    !/id="selection-composition"[\s\S]{0,500}?defaultOpen=\{false\}/.test(panels) &&
    (workspace.match(/onClick=/g) ?? []).length === 5 && !workspace.includes("toggleLiftSelection({ kind: 'edge'") && !workspace.includes('selectEdge('));
check('§2 THE WALK\'S LINE IS UNTOUCHED (the idiom was transplanted, not the text; the Manuscript is outside LAYOUT-1)',
  explore.includes("{`↑/↓ — walk (tap: one step of ${stepUnit.toFixed(2)} · hold: glide) · ←/→ — turn (tap: 1/${turnFraction} turn · hold: sweep) · PgUp/PgDn — look up and down (the same) · End — face the nearest door · Home — face as you entered · a door's letter — cross it, shift for the other way · drag — look around · press and hold — walk forward · the hatch settles in when you stand still · esc returns to the shell`}"));
check('§2 ★ the three camera buttons read `fit view` · `fit selected` · `reset camera` (COPY-1 P6, lowercase), carry no tooltip (LAYOUT-1 §6: a button\'s name says what it does), and `click: inspect` is nowhere (C-6b: the verb is `select`)',
  ['>\n          fit view\n', '>\n          fit selected\n', '>\n          reset camera\n'].every((s) => workspace.includes(s)) && !/Fit View|Fit Selected|Reset Camera/.test(workspace) &&
    !/<button[^>]*title=/.test(workspace.slice(workspace.indexOf('data-ambo-camera="fit-view"') - 200, workspace.indexOf('data-ambo-counts'))) && !panels.includes('click: inspect'));

// ═══════════════ §3 — C-6e: the Layer-3 witness panel prints each site's seam fact ONCE, labelled, in words ═══════════════
console.log('\n----- §3 ★ C-6e — one printing, under its label; the value in words; a dash is a separator, never a value -----');
const layer3 = readLf('src/components/Layer3WitnessPanel.tsx');
const siteBlock = layer3.slice(layer3.indexOf('the six midpoints, in loop order'), layer3.indexOf('</ul>', layer3.indexOf('the six midpoints, in loop order')));
check('§3 ★ THE SEAM FACT IS PRINTED ONCE, in the site\'s own line (COPY-1 §5.4: `ab · director axis +x · orientation +1 · on the seam (cd–bc)`) — the unlabelled second printing beside the site key is gone',
  (siteBlock.match(/\{seamLabel\}/g) ?? []).length === 1 && siteBlock.includes('<span>{seamLabel}</span>') &&
    !siteBlock.includes('<span className="text-stone-500">{seamLabel}</span>') && !siteBlock.includes('on seam?'));
check('§3 ★ THE VALUE IS IN WORDS: `on the seam (bd–cd)` / `not on the seam` — no dash stands as a value in the block (the separators stay separators), and `vacuous` reads `none`',
  layer3.includes("seamLabel: incidentSeams.length ? `on the seam (${incidentSeams.join(', ')})` : 'not on the seam',") && !layer3.includes(": '—'") && !layer3.includes("'vacuous'") && !layer3.includes('X_K') && !layer3.includes("'perCycleW1'"));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-AMBO-GESTURE-TRUTH: ALL PASS — the rows say what a click does, the solid\'s ? states every gesture (the foot line is gone), the counts line holds the foot in words, the readout\'s empty state is a true absence, the composition opens by default, and the Layer-3 panel prints its seam fact once in words' : `DIAGNOSE-THE-AMBO-GESTURE-TRUTH: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

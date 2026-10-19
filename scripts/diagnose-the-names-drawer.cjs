#!/usr/bin/env node

// DIAGNOSE THE NAMES DRAWER BEFORE A MIDPOINT — the designer's look of 2026-10-19 10:19 (rider 2), landed with STAMP ZOOM (the mothership's letter of
// 10:23): on a seed with no midpoint the casts & names drawer leaves out `previous unnamed · next unnamed` and `save, then the next unnamed midpoint`,
// prints no midpoint line, and opens its filter on `all`; they come back when the first midpoint is born. And the mothership's rider of 10:39 (Δ58
// answered (a)): the names list shows a midpoint's label as stored, like the head.
//
// THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM. Under node a zustand hook reads the store's INITIAL snapshot (the seed, nothing selected), so the drawer is
// RENDERED once, on that seed — the case the rider is about — and the dissected shape is read through the drawer's own readers (`getPacketWorkbenchRows`,
// `filterPacketRows`, `isUnresolvedGeneratedPacketRow`), the functions the panel renders from. The step's return and the editor's button are pinned by
// source here and SEEN at the concept-layer eye (§41), which drives the page with a corner selected before and after the dissection.
// Run: node scripts/diagnose-the-names-drawer.cjs

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
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { PacketsPanel, getPacketWorkbenchRows, filterPacketRows, isUnresolvedGeneratedPacketRow } = req('src/components/Panels.tsx');
const { isGeneratedMidpoint } = req('src/lib/christening.ts');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};

console.log('THE NAMES DRAWER BEFORE A MIDPOINT — no step through the unnamed until one exists; the filter opens on `all`; the list shows the label as stored\n');

const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const render = () => renderToString(React.createElement(PacketsPanel)).replace(/<!-- -->/g, '');
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const options = (html) => (html.match(/<option[^>]*>[^<]*<\/option>/g) || []);
const selectedOption = (html) => (options(html).find((o) => /selected=""/.test(o)) || '').replace(/<[^>]+>/g, '');
const firstLines = (html) => [...html.matchAll(/<span class="block min-w-0 truncate[^"]*">([^<]*)<\/span>/g)].map((m) => m[1]);

// ═══ §1 the seed, no midpoint — the store's initial snapshot, which is what a hook reads under node ═══
const seed = cur();
const h0 = render(); const t0 = text(h0);
check('§1 ★★ ON A SEED WITH NO MIDPOINT the drawer offers neither `previous unnamed` nor `next unnamed`; no midpoint line heads it; the filter opens on `all` and the count reads `4 of 4`; the list is the four corners by their labels, none `unnamed` (the editor under it reads `nothing selected`: node\'s snapshot selects nothing, so its `save, then …` is pinned by source below and seen at the eye)',
  Object.values(seed.vertices).every((v) => !isGeneratedMidpoint(v)) && !/previous unnamed|next unnamed/.test(t0) && !/not named yet|every midpoint is named/.test(t0) &&
    selectedOption(h0) === 'all' && /\b4 of 4\b/.test(t0) && J(firstLines(h0).slice().sort()) === J(['A', 'B', 'C', 'D']) && /nothing selected/.test(t0),
  { selected: selectedOption(h0), count: (t0.match(/\d+ of \d+/) || [])[0], firstLines: firstLines(h0), options: options(h0).map((o) => o.replace(/<[^>]+>/g, '')) });

// ═══ §2 the first midpoint born — read through the drawer's own readers ═══
S().applyAmboDissectionToCurrent();
const rows = getPacketWorkbenchRows(cur());
const mids = rows.filter((r) => isGeneratedMidpoint(r.vertex));
const unresolved = rows.filter(isUnresolvedGeneratedPacketRow);
check('§2 ★★ WITH THE FIRST MIDPOINT the predicate the drawer gates on turns (`rows.some(isGeneratedMidpoint)`): the rows hold the six midpoints, every one not named yet, and the unnamed filter lists exactly them — so the steps return and the filter, unchosen, opens on `unnamed midpoints` (the default follows the shape; his choice, once made, is his — pinned by source in §4, seen at the eye §41)',
  mids.length === 6 && rows.some((r) => isGeneratedMidpoint(r.vertex)) && unresolved.length === 6 && filterPacketRows(rows, 'unresolved-generated').length === 6 && filterPacketRows(rows, 'all').length === rows.length && rows.length === 10,
  { rows: rows.length, mids: mids.length, unresolved: unresolved.length });

// ═══ §3 Δ58 (a) — the mothership's rider of 10:39: the names list shows the label as stored, like the head ═══
check('§3 ★★ THE NAMES LIST SHOWS THE LABEL AS STORED, LIKE THE HEAD (Arman\'s Δ58 answered (a), Δ200; the mothership\'s 10:39): each midpoint row\'s first line (`displayLabel`) is its stored label — the letters the christening gives (`AB`) — never `unnamed`; it was so already (nothing built here: measured)',
  mids.length > 0 && mids.every((r) => r.vertex.data.label.trim().length > 0 && r.displayLabel === r.vertex.data.label) && !rows.some((r) => r.displayLabel === 'unnamed'),
  { firstLines: rows.map((r) => r.displayLabel) });

// ═══ §4 by construction: one predicate for the drawer's gates, the editor's own for its step ═══
const panels = fs.readFileSync(path.join(repoRoot, 'src/components/Panels.tsx'), 'utf8');
const editor = fs.readFileSync(path.join(repoRoot, 'src/components/VertexPacketEditor.tsx'), 'utf8');
check('§4 ★★ ONE PREDICATE: `hasMidpoint` (a generated midpoint among the rows) gates the head\'s midpoint line and the two steps in the drawer; the editor reads the same fact off the shape for its step (`save, then the next unnamed midpoint`); the filter\'s default is derived from it, his choice kept apart (`chosenFilter`); the row prints `displayLabel`, the vertex\'s label by the one reader',
  panels.includes("const hasMidpoint = useMemo(() => rows.some((row) => isGeneratedMidpoint(row.vertex)), [rows]);") && (panels.match(/\{hasMidpoint \? \(/g) || []).length === 2 && panels.includes("const filter: PacketWorkbenchFilter = chosenFilter ?? (hasMidpoint ? 'unresolved-generated' : 'all');") && panels.includes('onChange={(event) => setChosenFilter(event.target.value as PacketWorkbenchFilter)}') &&
    editor.includes('const hasMidpoint = Object.values(shape.vertices).some((v) => isGeneratedMidpoint(v));') && /\{hasMidpoint \? \(\s*<button\s+type="button"\s+onClick=\{saveAndNextUnresolved\}/.test(editor) && panels.includes('>{row.displayLabel}</span>'),
  'source pins');

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-NAMES-DRAWER: ALL PASS — before a midpoint exists the drawer offers no step through the unnamed and opens on `all`; the steps return with the first midpoint; the list shows the label as stored' : `DIAGNOSE-THE-NAMES-DRAWER: ${failures} FAIL`}`);
process.exit(failures === 0 ? 0 : 1);

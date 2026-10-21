#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════
// AN EDGE WHOSE CHILD HOLDS NO RELATING YET SAYS SO — group 3's part 1 (the coder's price of 10-21 13:31, its first acceptance measured; the mothership's 13:35 STAMP, landing B; the
// designer's 13:42 words). Before: a medial edge with one empty child did not open at all (measured 10-21 on the 19:54 record dissected again: only the column gate kept it shut).
// Now: the view opens on the one column, nothing drawn on the empty side, and its head line says `holds no space yet: Finance–Distribution holds no relating yet · open Finance–Distribution`.
// ═══════════════════════════════════════════════════════════════════════════════
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
const { columnSpaceOf } = req('src/lib/instanceSpace.ts');
const { spaceOf } = req('src/lib/spaceOf.ts');
const { MidpointSurface, midpointViewOf } = req('src/components/MidpointSurface.tsx');
const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => { console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`); if (!cond) failures += 1; };
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n');
const unesc = (t) => t.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const text = (html) => unesc(html.replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
console.log('AN EDGE WHOSE CHILD HOLDS NO RELATING YET SAYS SO — the view opens on the one column, its head line in M10\'s words with `open` (group 3 · part 1)\n');
const S = () => useGeometryStore.getState();
const save = JSON.parse(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-19_1954_Finance-Consumption_15-relatings-2-bars_109-decided_32-bonds-blocked.workspace.json'), 'utf8'));
S().importWorkspace(save);
const sh0 = S().shapes[S().currentShapeId];
S().selectCell(sh0.cells.find((c) => /core/.test(c.id)).id);
S().applyAmboDissectionToCurrent();
const sh = S().shapes[S().currentShapeId];
const lab = (v) => sh.vertices[v].data.label;
const byLabel = (l) => Object.values(sh.vertices).find((v) => v.data.label === l);
const FD = byLabel('Finance–Distribution'); const Acc = byLabel('Accumulation');
const mid = Object.values(sh.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(FD.id) && v.createdBy.sourceVertexIds.includes(Acc.id));
check('§0 THE RECORD: the 19:54 record dissected again (the core); Finance–Distribution holds no relating (no column space); its medial edge with Accumulation (a child he named) exists',
  !!FD && !!Acc && !!mid && columnSpaceOf(sh, FD.id) === null && columnSpaceOf(sh, Acc.id) !== null, { mid: mid && lab(mid.id) });
const view = midpointViewOf(sh, mid.id);
check('§1 ★★ THE VIEW OPENS (before: null, the column gate): the three resolved spaces are the gate, as for every edge', !!view && view.site.siteId === mid.id, { opened: !!view });
const html = view ? unesc(renderToString(React.createElement(MidpointSurface, { shape: sh, site: view.site, parents: view.parents, resolved: view.resolved, refusal: null, remade: null })).replace(/<!-- -->/g, '')) : '';
const line = (html.match(/<span data-midpoint-no-space="[^"]*"[^>]*>[\s\S]*?<\/span>(?=\s*<\/div>)/) || [''])[0];
const colAt = [...html.matchAll(/data-inside-column="true"/g)].map((m) => m.index);
const columns = colAt.map((i, k) => (html.slice(i, colAt[k + 1] ?? html.length).match(/data-inside-point=/g) || []).length); // the points drawn in each column's group
check('§1 ★★ HER HEAD LINE, M10\'s words: `holds no space yet: Finance–Distribution holds no relating yet · open Finance–Distribution`, the `open` a button to that edge\'s view; the one column drawn (Accumulation\'s points), nothing on the empty side (0 points)',
  text(line) === 'holds no space yet: Finance–Distribution holds no relating yet · open Finance–Distribution' && new RegExp(`data-midpoint-open-empty="${FD.id}"[^>]*>open Finance–Distribution<`).test(html)
    && columns.length === 2 && columns.includes(0) && columns.some((n) => n > 0),
  { line: text(line), columns });
const ms = src('src/components/MidpointSurface.tsx');
check('§2 ★ BY CONSTRUCTION: `midpointViewOf` gates on the three resolved spaces alone; the head line reads `columnSpaceOf === null` on the two corners through M10\'s one reader of the words (`holdNoSpaceWords`), `open` only for a born child (a seed corner holding no cast is loaded on the packets tab, not opened)',
  ms.includes('return a && b && self ? { site, parents: [a, b], resolved: self } : null;') && ms.includes("const bare = [site.a, site.b].filter((c) => columnSpaceOf(shape, c, { records: childRecords }) === null);") && ms.includes("const opens = bare.filter((c) => shape.vertices[c]?.createdBy.operation !== 'seed');") && ms.includes("import { holdNoSpaceWords } from './copyWords';"));
console.log(`\n${failures === 0 ? 'DIAGNOSE-AN-EDGE-WHOSE-CHILD-HOLDS-NO-RELATING: ALL PASS — the view opens on the one column and says, in M10\'s words, which child holds no relating yet, with `open` to it' : `DIAGNOSE-AN-EDGE-WHOSE-CHILD-HOLDS-NO-RELATING: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);

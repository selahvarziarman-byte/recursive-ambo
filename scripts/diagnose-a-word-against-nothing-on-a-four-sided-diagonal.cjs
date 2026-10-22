#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════
// A WORD AGAINST NOTHING ON A FOUR-SIDED DIAGONAL IS A REFUSED ROUTE, NOT A HOLE — ADR 0031 §9.74 (the researcher's 20:26, ratified, claims §499; Virgin Land's 20:13 q3; the
// designer's 09:03 line). The falsifiers: Virgin Land's 20:10 Metabolism export (the page read 6 filled · 16 holes · 7 settled; under §9.74, 8 · 9 · 12 — seven loops change)
// and her 21:14 Reproduction export (8 · 87 · 85 → 8 · 24 · 148), both read through the built reader; the researcher's falsifier on the two loops that fill one way; the card's line.
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
const { useGeometryStore, childRecordsOf } = req('src/store/geometryStore.ts');
const CL = req('src/lib/childLoops.ts');
const { MidpointSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
const { spaceOf } = req('src/lib/spaceOf.ts');
const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => { console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`); if (!cond) failures += 1; };
const note = (s) => console.log(`      ${s}`);
const unesc = (s) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const esc = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const S = () => useGeometryStore.getState();
const shape = () => S().shapes[S().currentShapeId];
console.log('A WORD AGAINST NOTHING ON A FOUR-SIDED DIAGONAL IS A REFUSED ROUTE — §9.74 on Virgin Land\'s two exports, the researcher\'s falsifier, the designer\'s line\n');
const siteOf = (A, B) => { const sh = shape(); const byLabel = (l) => Object.keys(sh.vertices).find((v) => sh.vertices[v].data.label === l); const a = byLabel(A), b = byLabel(B); return Object.values(sh.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(a) && v.createdBy.sourceVertexIds.includes(b)).id; };
const readSite = (site) => {
  const sh = shape();
  const L = CL.childLoopsCached(sh, site, childRecordsOf(S()));
  const R = CL.loopRecordsFor(sh, site, L, S().loopAnswers, S().loopRules, { converses: S().converses, opaque: S().opaque });
  const counts = { filled: 0, hole: 0, settled: 0, waits: 0, other: 0 }; const byName = {};
  for (const loop of L.loops) {
    const r = CL.loopReadingFor(L, loop, R);
    const name = `${loop.kind}-sided (${L.roles[loop.i].key} | ${L.roles[loop.j].key})`;
    if (!r.diagonals.length) { counts.other += 1; continue; }
    counts[r.state] = (counts[r.state] || 0) + 1; byName[CL.loopIdOf(L, loop)] = { name, state: r.state, id: CL.loopIdOf(L, loop), loop, readings: r.diagonals.map((d) => d.reading) };
  }
  // by the loop's id (two loops can share a name — the same two roles, two shapes); `named` finds the entries of a name
  const named = (n) => Object.values(byName).filter((x) => x.name === n);
  return { L, R, counts, byName, named };
};
const load = (file) => { S().importWorkspace(JSON.parse(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/altitude', file), 'utf8'))); };

// ═══ §1 METABOLISM (her 20:10 export, Consumption–Production) ═══
load('virgin-land_2026-10-21_2010_Metabolism_P-C_11-moments-2-relations-named.workspace.json');
const siteM = siteOf('Consumption', 'Production');
const M = readSite(siteM);
note(`Metabolism: ${J(M.counts)}`);
const toFilled = ['four-sided (product is sold as spending | use is consumed as capacity)', 'four-sided (surplus is sold as spending | use is consumed as capacity)'];
const toSettled = ['four-sided (spending is put to work as material | product is put to use as use)', 'four-sided (spending is put to work as instrument | use is consumed as capacity)', 'four-sided (surplus is put to use as use | usingup is put to work as material)', 'four-sided (product is put to use as use | material is exhausted as usingup)', 'four-sided (product is put to use as use | usingup is put to work as material)'];
check('§1 ★★ METABOLISM UNDER §9.74 — 8 filled · 9 holes · 12 settled where the page read 6 · 16 · 7 (the researcher\'s diagnostic, reproduced at the coder\'s hand 10-21): the seven that change by name — two to FILLED one way (the spending to the capacity along Consumption\'s *is put to use as* and Production\'s *is consumed as*), five to SETTLED, their marked routes standing',
  M.counts.filled === 8 && M.counts.hole === 9 && M.counts.settled === 12 && M.counts.waits === 0 && toFilled.every((n) => M.named(n).some((x) => x.state === 'filled')) && toSettled.every((n) => M.named(n).some((x) => x.state === 'settled')),
  { counts: M.counts, filled: toFilled.map((n) => M.named(n).map((x) => x.state)), settled: toSettled.map((n) => M.named(n).map((x) => x.state)) });
check('§1 ★ THE NINE HOLES THAT REMAIN each hold two different words on a diagonal (never a word against nothing)',
  Object.values(M.byName).filter((x) => x.state === 'hole').length === 9 && Object.values(M.byName).filter((x) => x.state === 'hole').every((x) => x.readings.includes('differ')),
  Object.values(M.byName).filter((x) => x.state === 'hole').map((x) => x.readings));
// ═══ §2 THE RESEARCHER'S FALSIFIER on the first loop that fills one way ═══
{
  const name = toFilled[0]; const entry = M.named(name).find((x) => x.state === 'filled');
  const r0 = CL.loopReadingFor(M.L, entry.loop, M.R);
  const refused = r0.diagonals.find((d) => d.reading === 'refused'); const marked = r0.diagonals.find((d) => d.reading === 'agree');
  const emptyWay = refused && (refused.a.value === 0 ? 'a' : 'b');
  const readNow = () => { const Rn = CL.loopRecordsFor(shape(), siteM, M.L, S().loopAnswers, S().loopRules, { converses: S().converses, opaque: S().opaque }); return CL.loopReadingFor(M.L, entry.loop, Rn); };
  const w1 = refused && S().sayLoop(siteM, entry.id, refused.start, emptyWay, 'is sold into use as'); const r1 = readNow();
  const w2 = refused && S().sayLoop(siteM, entry.id, refused.start, emptyWay, 'is worked into use as'); const r2 = readNow();
  const w3 = refused && S().withdrawLoopSay(siteM, entry.id, refused.start, emptyWay);
  const w4 = marked && S().withdrawLoopSay(siteM, entry.id, marked.start, 'a'); const w5 = marked && S().withdrawLoopSay(siteM, entry.id, marked.start, 'b'); const r3 = readNow();
  check('§2 ★★ THE FALSIFIER (the researcher\'s 20:26): on `' + name + '` — filled one way, its second diagonal a word against nothing — the empty route answered `is sold into use as` makes both diagonals agree (filled, both ways); answered with another word (`is worked into use as`) the diagonal differs and the loop is a HOLE; the first diagonal\'s answers withdrawn, the loop WAITS, never a hole',
    !!refused && !!marked && w1 === null && r1.state === 'filled' && r1.diagonals.every((d) => d.reading === 'agree') && w2 === null && r2.state === 'hole' && w3 === null && w4 === null && w5 === null && r3.state === 'waits',
    { refused: !!refused, marked: !!marked, says: [w1, w2, w3, w4, w5], states: [r0.state, r1.state, r2.state, r3.state], r1: r1.diagonals.map((d) => d.reading), r2: r2.diagonals.map((d) => d.reading) });
}
// ═══ §3 THE CARD'S LINE (the designer's 09:03), on the second loop that fills one way, as the page draws it ═══
{
  load('virgin-land_2026-10-21_2010_Metabolism_P-C_11-moments-2-relations-named.workspace.json');
  const M2 = readSite(siteM); const entry = M2.named(toFilled[1]).find((x) => x.state === 'filled');
  const render = () => { const sh = shape(); const packet = buildGeneralSitePacketPresenterReport(sh).packets.find((p) => p.trace.siteId === siteM); const site = midpointSiteOf(sh, siteM, packet ? packet.trace : null); return renderToString(React.createElement(MidpointSurface, { shape: sh, site, resolved: spaceOf(sh, siteM), refusal: null, remade: null })).replace(/<!-- -->/g, ''); };
  const rk = M2.L.roles[entry.loop.i].key; S().setChildView({ siteId: siteM, key: rk });
  let html = '';
  for (let at = 0; at < 40; at += 1) { S().setLoopView({ siteId: siteM, key: rk, at, scope: 'loop', modes: false, shown: [] }); const h = render(); if (h.includes(`data-child-loop="${esc(entry.id)}"`)) { html = h; break; } }
  const card = html ? unesc(html.slice(html.indexOf(`data-child-loop="${esc(entry.id)}"`))) : '';
  // the state line's text through its nested spans: from the marked span to its own closing tag, the tags stripped
  const stateText = (() => { const m = /data-child-loop-state="filled"[^>]*>([\s\S]*?)<\/(?:span|div)>/.exec(card); return m ? m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : ''; })();
  check('§3 ★★ THE CARD\'S LINE (the designer\'s 09:03): on `' + toFilled[1] + '` the refused diagonal reads `· one comes to nothing: a refused route, so it fills nothing` under its two way lines (never `· they differ`), and the state line reads `filled: … a refused route. A relation of the child between …` unchanged in form',
    html !== '' && card.includes('· one comes to nothing: a refused route, so it fills nothing') && !card.includes('· they differ') && /^filled: .+a refused route\. A relation of the child between /.test(stateText),
    { found: html !== '', state: stateText.slice(0, 220) });
}
// ═══ §4 REPRODUCTION (her 21:14 export, Production–Distribution) ═══
load('virgin-land_2026-10-21_2114_Reproduction_P-D_19-moments-3-relations-named.workspace.json');
const siteR = siteOf('Production', 'Distribution');
const Rp = readSite(siteR);
note(`Reproduction: ${J(Rp.counts)}`);
check('§4 ★★ REPRODUCTION UNDER §9.74 — 8 filled · 24 holes · 148 settled where the page read 8 · 87 · 85 (Virgin Land\'s own reckoning, the mothership\'s 21:2x; measured at the coder\'s hand 10-21: 63 holes become settled, none filled)',
  Rp.counts.filled === 8 && Rp.counts.hole === 24 && Rp.counts.settled === 148 && Rp.counts.waits === 0, Rp.counts);
// ═══ §4b REVENUE (her 09:44 export of 10-22, Distribution–Consumption — the mothership's third falsifier, rung 10-22 ~10:00) ═══
load('virgin-land_2026-10-22_0944_Revenue_D-C_9-moments-2-relation-words-named.workspace.json');
const siteV = siteOf('Distribution', 'Consumption');
const Rv = readSite(siteV);
note(`Revenue: ${J(Rv.counts)}`);
check('§4b ★★ REVENUE UNDER §9.74 — 4 filled · 13 holes · 15 settled where the page reads 4 · 26 · 2 today (Virgin Land\'s own reckoning under §9.74, carried by the mothership; measured at the coder\'s hand 10-22: 13 holes become settled, none filled); every loop that settles holds a refused route on a diagonal and no two different words',
  Rv.counts.filled === 4 && Rv.counts.hole === 13 && Rv.counts.settled === 15 && Rv.counts.waits === 0 && Object.values(Rv.byName).filter((x) => x.state === 'settled').every((x) => !x.readings.includes('differ')) && Object.values(Rv.byName).filter((x) => x.state === 'settled' && x.readings.includes('refused')).length >= 13,
  { counts: Rv.counts, settledReadings: Object.values(Rv.byName).filter((x) => x.state === 'settled').map((x) => x.readings) });
// ═══ §5 BY CONSTRUCTION ═══
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8');
check('§5 ★ BY CONSTRUCTION: `loopReadingFor`\'s four-sided branch reads a word against `0` as `refused` before `differ`; the state order unchanged (`differ` → hole, `waits`, `agree` → filled, else settled); the card\'s four-sided line in her words, the three-sided card\'s Δ213 line kept',
  src('src/lib/childLoops.ts').includes("else if ((typeof a.value === 'string' && b.value === 0) || (a.value === 0 && typeof b.value === 'string')) reading = 'refused';") && src('src/lib/childLoops.ts').includes("return { state: any('differ') ? 'hole' : any('waits') ? 'waits' : any('agree') ? 'filled' : 'settled', diagonals };")
    && src('src/components/ChildLoopCard.tsx').includes("if (d.reading === 'refused' && !d.diagonal.a.itself && !d.diagonal.b.itself) return '· one comes to nothing: a refused route, so it fills nothing';") && src('src/components/ChildLoopCard.tsx').includes("return `· the other way comes to nothing, so it refuses ("));
console.log(`\n${failures === 0 ? 'DIAGNOSE-A-WORD-AGAINST-NOTHING-ON-A-FOUR-SIDED-DIAGONAL: ALL PASS — a refused route beside a marked path, counted empty, never a hole; 8/9/12, 8/24/148 and 4/13/15 on her three exports' : `DIAGNOSE-A-WORD-AGAINST-NOTHING-ON-A-FOUR-SIDED-DIAGONAL: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);

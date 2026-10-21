#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// A WORD'S WAY ON THIS EDGE — ONE READER (VL 42; the designer's 15:05 form, items 1–4; the mothership's 15:17)
//
// `sayingsOn` and `wayOfWord` in src/lib/wordWay.ts: a word in use on an edge reads its own way at once — the one way all his sayings in
// it read there (his relatings and bars, the decisions he made in it on the edge's faces with their direction, the ways he chose for it
// on the edge's child's loops) — and a word with no way yet makes the place he types it ask `which way it reads`. The pairing tab, the
// decide prompt, the bond's saying, the rule field and the loop card read this and nothing else. The witness runs the reader on its own
// cases, pins the five places by construction, then on Virgin Land's 14:56 export (Production–Distribution, passages undecided) decides
// the passage `the surplus · the revenue` in `is drawn from`, a word in use there, and reads the card: `comes to the revenue is drawn
// from the surplus, also related directly`; and gives a loop a new word with the way he chose, carried on its row, read back and kept
// across export and import. THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM: the readers the page prints from are RUN; her file as found.
// ═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
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
const { sayingsOn, wayOfWord } = req('src/lib/wordWay.ts');
const { ALONG, AGAINST, IS, NO_FACTS, relatingsHeld } = req('src/lib/relatings.ts');
const { sortingOf } = req('src/lib/sorting.ts');
const CL = req('src/lib/childLoops.ts');
const { MidpointSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
const { spaceOf, nameIn } = req('src/lib/spaceOf.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const unesc = (s) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8');

console.log("A WORD'S WAY ON THIS EDGE — one reader for the pairing tab, the decide prompt, the bond's saying, the rule field and the loop card (VL 42)\n");

// ═══ §1 THE READER ON ITS OWN CASES ═══
const S = () => useGeometryStore.getState();
const FIX = path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-19_1456_Production-Distribution_9-relatings-2-bars_passages-undecided.workspace.json');
S().importWorkspace(JSON.parse(fs.readFileSync(FIX, 'utf8')));
const shape = () => S().shapes[S().currentShapeId];
const byLabel = (l) => Object.keys(shape().vertices).find((v) => shape().vertices[v].data.label === l);
const P = byLabel('Production'); const D = byLabel('Distribution');
const e = () => edgeBetween(shape().edges, P, D);
const site = Object.values(shape().vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(P) && v.createdBy.sourceVertexIds.includes(D)).id;
const name = (corner, id) => { const sp = spaceOf(shape(), corner); return sp ? nameIn(sp.space, id) : id; };
const facts = () => ({ converses: S().converses, opaque: S().opaque });
check('§1 ★★ THE SAYINGS: his relatings and bars in a word on the edge, never IS — on Production–Distribution `is drawn from` has three sayings, all read from Distribution\'s side (`←`), so its way here is `←`; `is put to work as` reads `←` too; a word he never used here has none',
  wayOfWord('is drawn from', sayingsOn(shape(), e(), S().loopAnswers), facts()) === AGAINST && sayingsOn(shape(), e(), S().loopAnswers).filter((s) => s[0] === 'is drawn from').length === 3 && wayOfWord('is put to work as', sayingsOn(shape(), e(), S().loopAnswers), facts()) === AGAINST && wayOfWord('tilts', sayingsOn(shape(), e(), S().loopAnswers), facts()) === null && sayingsOn(shape(), e(), S().loopAnswers).every((s) => s[0] !== IS),
  { drawnFrom: sayingsOn(shape(), e(), S().loopAnswers).filter((s) => s[0] === 'is drawn from'), relatings: relatingsHeld(e()).filter((r) => r[0] !== IS).length });
check('§1 ★★ TWO WAYS MAKE NONE: a word his sayings read both ways on the edge has no way here (the place asks), one way read twice stands',
  wayOfWord('w', [['w', ALONG], ['w', AGAINST]], NO_FACTS) === null && wayOfWord('w', [['w', ALONG], ['w', ALONG]], NO_FACTS) === ALONG && wayOfWord('w', [], NO_FACTS) === null);
// a decision carrying its direction is a saying: on a face of the edge, with the record's x at the edge's first corner the direction stands, at its second it turns
const facePD = shape().faces.find((f) => f.vertexIds.includes(P) && f.vertexIds.includes(D));
const sortingPD = sortingOf(shape(), e(), {}, S().rules, facts());
const viewPD = sortingPD.views.find((v) => v.faceId === facePD.id) || sortingPD.views[0];
const facePD2 = shape().faces.find((f) => f.id === viewPD.faceId);
const pathAt = (x, y) => viewPD.paths.find((p) => /surplus/.test(name(e().vertexIds[0], p.path.x)) && /revenue/.test(name(e().vertexIds[1], p.path.y)) && p.path.readable);
const pSR = pathAt();
const base = [facePD2.vertexIds.indexOf(e().vertexIds[0]), facePD2.vertexIds.indexOf(e().vertexIds[1])];
const recOf = (w3, w3dir) => ({ base, x: pSR.path.x, w: pSR.path.w, z: pSR.path.z, w2: pSR.path.w2, y: pSR.path.y, ...(pSR.path.dirs[0] === ALONG && pSR.path.dirs[1] === ALONG ? {} : { dirs: pSR.path.dirs }), w3, ...(w3dir ? { w3dir } : {}), verdict: 'composed' });
check('§1 ★★ THE PASSAGE AT THE PAIR: `the surplus · the revenue` on Production–Distribution is a readable passage not yet decided, a fork read from the third corner',
  !!pSR && pSR.reading === 'UNRULED' && pSR.composite === null && pSR.path.shape === 'fork', pSR && { shape: pSR.path.shape, from: pSR.path.from, reading: pSR.reading });

// ═══ §2 BY CONSTRUCTION — the five places read the one reader; the record carries the way ═══
const ww = src('src/lib/wordWay.ts'); const ms = src('src/components/MidpointSurface.tsx'); const mb = src('src/components/MediumBlock.tsx'); const lc = src('src/components/ChildLoopCard.tsx'); const pt = src('src/components/PairingTab.tsx'); const so = src('src/lib/sorting.ts'); const cl = src('src/lib/childLoops.ts'); const wp = src('src/lib/workspacePersistence.ts'); const gs = src('src/store/geometryStore.ts');
check('§2 ★★ ONE READER, FIVE PLACES: the pairing tab\'s `wordWay` is `recordDir` = `wayOfWord(w, sayingsOn(…))`; the decide prompt, the bond\'s saying and the rule field read `wayHere` = the same; the loop card\'s words and its decide form read `wayOfWord` over `sayingsOn`; the loop records\' `readsFromY` reads it — and `wordWay.ts` is React-free',
  /const recordDir = \(w: string\): Dir \| null => \{ const st = useGeometryStore\.getState\(\); return wayOfWord\(w, sayingsOn\(shape, sourceEdge, st\.loopAnswers\), \{ converses: st\.converses, opaque: st\.opaque \}\); \};/.test(ms) && /const wayHere = \(word: string\): Dir \| null => wayOfWord\(word, sayingsOn\(props\.shape, props\.edge, useGeometryStore\.getState\(\)\.loopAnswers\), m\.facts\)/.test(mb) && /const wayTyped = typed \? wayHere\(typed\) : null;/.test(mb) && /const bondWay = typed \? wayHere\(typed\) : null;/.test(mb) && /const ruleWay = typed \? wayHere\(typed\) : null;/.test(mb) && /const fromY = \(w: string\): boolean => wayHere\(w\) === AGAINST;/.test(lc) && /const wayOnEdge = \(w: string\): Dir \| null => \(edgeOfLoops \? wayOfWord\(w, sayingsOn\(shape, edgeOfLoops, st\.loopAnswers\), \{ converses: st\.converses, opaque: st\.opaque \}\) : null\);/.test(lc) && /const wayHere = \(w: string\): Dir \| null => wayOfWord\(w, sayings, \{ converses: lex\.converses, opaque: lex\.opaque \}\);/.test(lc) && /const readsFromY = \(w: string\): boolean => wayOfWord\(w, sayings, facts\) === AGAINST;/.test(cl) && !/from 'react'/.test(ww) && !/geometryStore/.test(ww));
check('§2 ★★ THE ACT WAITS AND THE RECORD CARRIES THE WAY: the decide prompt shows `decide` only with a direction (`typed && dirHere !== null`) and records it (`const w3dir = dirHere`); the bond\'s `rec` takes `w3dir`; a new word asks with two sentences (`data-medium-say-reads`, `data-medium-bond-say-reads`, `data-medium-rule-reads`, `data-child-loop-reads`); the sorting\'s `verdictDir` reads `w3dir` for every shape; a loop answer\'s row carries the way (`sayLoop(…, dir)`, a five-field row the persistence accepts); the pairing tab asks once per batch (`batchWay`)',
  /\{typed && dirHere !== null && dependence === null \? <>\{' · '\}<button type="button" data-medium-say="composed"/.test(mb) && /if \(dirHere === null\) return; const w3dir = dirHere;/.test(mb) && /const rec = \(verdict: 'composed' \| 'not', w3\?: string, w3dir\?: Dir\)/.test(mb) && /data-medium-say-reads=\{pk\}/.test(mb) && /data-medium-bond-say-reads=\{key\}/.test(mb) && /data-medium-rule-reads=\{id\}/.test(mb) && /data-child-loop-reads=\{`\$\{k\}\|\$\{way\}`\}/.test(lc) && /const verdictDir = \(p: Path, r: Omit<VerdictRecord, 'base'>\): Dir => \(r\.w3dir \? r\.w3dir : p\.from === 'y' \? AGAINST : ALONG\);/.test(so) && /sayLoop: \(siteId, loopId, start, way, answer, dir\) =>/.test(gs) && /r\.length === 5 && r\.slice\(0, 3\)\.every\(isWordField\) && isAnswer\(r\[3\]\) && \(r\[4\] === '→' \|\| r\[4\] === '←'\)/.test(wp) && /const batchWay = \(w: string\): Dir \| null =>/.test(pt) && /wordWay\(wordOf\(d\)\) \?\? d\.way \?\? batchWay\(wordOf\(d\)\)/.test(pt));

// ═══ §3 HER CASE: `is drawn from` typed at `the surplus · the revenue` reads its way at once and decides so ═══
const refused = S().giveVerdict(viewPD.faceId, recOf('is drawn from', wayOfWord('is drawn from', sayingsOn(shape(), e(), S().loopAnswers), facts())));
const sorting2 = sortingOf(shape(), e(), {}, S().rules, facts());
const p2 = sorting2.views.find((v) => v.faceId === viewPD.faceId).paths.find((p) => p.path.x === pSR.path.x && p.path.y === pSR.path.y && p.path.z === pSR.path.z && p.path.w === pSR.path.w && p.path.w2 === pSR.path.w2);
const renderCard = () => {
  useGeometryStore.setState({ modesView: { siteId: site, cell: `${pSR.path.x}|${pSR.path.y}`, all: true, at: 0 } });
  const sh = shape();
  const packet = buildGeneralSitePacketPresenterReport(sh).packets.find((pk) => pk.trace.siteId === site);
  const st = midpointSiteOf(sh, site, packet ? packet.trace : null);
  const html = renderToString(React.createElement(MidpointSurface, { shape: sh, site: st, parents: [spaceOf(sh, st.a), spaceOf(sh, st.b)], resolved: spaceOf(sh, site), refusal: null, remade: null })).replace(/<!-- -->/g, '');
  return [...html.matchAll(/data-medium-passage-reading-line="true"[^>]*>([\s\S]*?)<\/span><\/span>/g)].map((m) => unesc(m[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim());
};
const lines = renderCard();
check('§3 ★★ HER ITEM 1 (the decided line): the decision recorded with the word\'s way reads `comes to the revenue is drawn from the surplus, also related directly` — the sentence as his relating has it, composed onto the relating directly on the pair (Virgin Land\'s 42: at 04f1c05 it composed backwards and stood only in a light)',
  refused === null && p2.composite === 'is drawn from' && p2.compositeDir === AGAINST && p2.reading === 'COMPOSED' && p2.by === 'verdict' && p2.exception === false && lines.some((l) => /^comes to the revenue is drawn from the surplus, also related directly/.test(l)),
  { refused, composite: p2.composite, compositeDir: p2.compositeDir, reading: p2.reading, lines: lines.filter((l) => /drawn from/.test(l)).slice(0, 2) });
check('§3 ★★ THE DECISION IS A SAYING IN THE WORD TOO: with it recorded, `is drawn from` has four sayings on the edge, still one way (`←`)',
  sayingsOn(shape(), e(), S().loopAnswers).filter((s) => s[0] === 'is drawn from').length === 4 && wayOfWord('is drawn from', sayingsOn(shape(), e(), S().loopAnswers), facts()) === AGAINST);

// ═══ §4 THE LOOP CARD: a new word's answer carries the way he chose; read back; kept across export and import ═══
const L = CL.childLoopsCached(shape(), site, childRecordsOf(S()));
const R0 = CL.loopRecordsFor(shape(), site, L, S().loopAnswers, S().loopRules, facts());
const asked = L.loops.map((l) => ({ l, r: CL.loopReadingFor(L, l, R0) })).find(({ l, r }) => r.state === 'waits' && r.diagonals.some((d) => d.a.value === undefined && !d.diagonal.a.itself));
const dAsk = asked ? asked.r.diagonals.find((d) => d.a.value === undefined && !d.diagonal.a.itself) : null;
const startAsk = asked ? CL.roleIdOf(L, dAsk.diagonal.from === 'i' ? asked.l.i : asked.l.j) : null;
const saidTilts = asked ? S().sayLoop(site, CL.loopIdOf(L, asked.l), startAsk, 'a', 'tilts', AGAINST) : 'no asked way found';
const rowTilts = S().loopAnswers.find((r) => r[3] === 'tilts');
const R1 = CL.loopRecordsFor(shape(), site, L, S().loopAnswers, S().loopRules, facts());
check('§4 ★★ HER ITEM 2 ON THE LOOP CARD: a new word answered with the way he chose rides its row (five fields, `←`), and the records read the word from the second corner\'s role (`readsFromY`) — the one reader, with a loop\'s chosen way among the sayings',
  saidTilts === null && !!rowTilts && rowTilts.length === 5 && rowTilts[4] === AGAINST && R1.readsFromY('tilts') === true && R0.readsFromY('tilts') === false && wayOfWord('tilts', sayingsOn(shape(), e(), S().loopAnswers), facts()) === AGAINST,
  { saidTilts, row: rowTilts, readsFromY: R1.readsFromY('tilts') });
const snap = S().exportWorkspace();
S().importWorkspace(JSON.parse(JSON.stringify(snap)));
const rowBack = S().loopAnswers.find((r) => r[3] === 'tilts');
check('§4 ★★ KEPT ACROSS EXPORT AND IMPORT: the five-field row comes back as written (the persistence accepts it; a four-field row of an older file reads as before)',
  !!rowBack && rowBack.length === 5 && rowBack[4] === AGAINST && S().loopAnswers.filter((r) => r.length === 4).length === snap.loopAnswers.filter((r) => r.length === 4).length,
  { back: rowBack, fourField: S().loopAnswers.filter((r) => r.length === 4).length });

console.log(`\n${failures === 0 ? "DIAGNOSE-A-WORDS-WAY-ON-THIS-EDGE: ALL PASS — one reader for a word's way on an edge, read by the five places a word is typed for a statement at a pair; a word in use reads its way at once, a new word asks and the act waits; the way rides the decision and the loop's answer" : `DIAGNOSE-A-WORDS-WAY-ON-THIS-EDGE: ${failures} FAIL`}`);
if (failures) process.exitCode = 1;

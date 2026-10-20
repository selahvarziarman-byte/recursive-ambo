#!/usr/bin/env node
'use strict';
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// A DECISION CARRIES HIS WORD'S WAY ON EVERY SHAPE — A BOND'S TOO (Virgin Land's finding 47; the mothership's MARKER of 10-19 20:03: 42 supersedes M6 (5)
// for decisions)
//
// At c22f883 (release 2) the store refused any decision carrying a direction on a chain (M6 (5), "reachable by script alone"), and it read a BOND's record —
// a passage across the third corner's relation, whose record carries no legs' senses — as a chain. Once 42 recorded the way with every decision, every
// bond decision was refused at the act: on Virgin Land's 19:54 export (Finance–Consumption, lights Production and Distribution) the 32 passages she could
// not decide are exactly the 32 undecided bonds (17 across Production's relation, 15 across Distribution's); no path there is a chain. The cut: the store
// takes a decision's way on every shape; the sorting reads it on every shape; a decided bond's line reads in the way recorded; and the one reader for a
// word's way counts a saying in his declared converse as a saying in the word read the other way round (D13), so `is the consuming of`, the converse of
// `is consumed as`, reads its way at once and decides to the same relation. THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM: the store's act, the sorting
// and the reader are RUN on her file as found; the card the page prints is rendered.
// ═════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
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
const { sayingsOn, wayOfWord } = req('src/lib/wordWay.ts');
const { ALONG, AGAINST, IS, converseOf, sameStatement, relatingsHeld, dirOf } = req('src/lib/relatings.ts');
const { sortingOf, verdictsOn } = req('src/lib/sorting.ts');
const { termWordsOf } = req('src/lib/instanceSpace.ts');
const { MidpointSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
const { spaceOf } = req('src/lib/spaceOf.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const unesc = (s) => s.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8');

console.log("A DECISION CARRIES HIS WORD'S WAY ON EVERY SHAPE — A BOND'S TOO (Virgin Land's 47; 42 supersedes M6 (5) for decisions)\n");

// ═══ §1 THE MEASUREMENT — her 19:54 export, as found ═══
const S = () => useGeometryStore.getState();
const FIX = path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-19_1954_Finance-Consumption_15-relatings-2-bars_109-decided_32-bonds-blocked.workspace.json');
const fresh = () => S().importWorkspace(JSON.parse(fs.readFileSync(FIX, 'utf8')));
fresh();
const shape = () => S().shapes[S().currentShapeId];
const byLabel = (l) => Object.keys(shape().vertices).find((v) => shape().vertices[v].data.label === l);
const F = byLabel('Finance'); const C = byLabel('Consumption');
const edge = () => edgeBetween(shape().edges, F, C);
const [X, Y] = edge().vertexIds;
const site = Object.values(shape().vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(F) && v.createdBy.sourceVertexIds.includes(C)).id;
const facts = () => ({ converses: S().converses, opaque: S().opaque });
const name = (corner, id) => termWordsOf(shape(), corner, id, {});
const sorting = () => sortingOf(shape(), edge(), {}, S().rules, facts(), S().bondRules || []);
const sayings = () => sayingsOn(shape(), edge(), S().loopAnswers);
const label = (v) => shape().vertices[v].data.label;
const legsOf = (v, b) => {
  const leg = (s, a, z) => `${name(a, s[0])} ${s[1]} ${name(z, s[2])}`;
  return `across ${label(v.view)}'s relation: ${leg(b.said[0], v.view, X)} · ${leg(b.said[1], v.view, v.view)} · ${leg(b.said[2], v.view, Y)}`;
};
const bondsOf = () => sorting().views.flatMap((v) => v.altitude.bonds.map((rb) => ({ v, rb, legs: legsOf(v, rb.bond) })));
const undecided = () => bondsOf().filter((o) => o.rb.reading === 'UNRULED');
const chainPaths = sorting().views.flatMap((v) => v.paths.filter((p) => p.path.shape === 'chain'));
const und0 = undecided();
const byView = (l) => und0.filter((o) => label(o.v.view) === l).length;
const findBond = (re) => bondsOf().find((o) => re.every((r) => r.test(o.legs)));
const R63 = [/the product is the spending of the promise/, /the product is consumed as the reproduction/, /the reproduction is at once the use/];
const b63 = findBond(R63);
check('§1 ★★ THE 32 ARE BONDS: on her 19:54 export Finance–Consumption holds no path that is a chain (forks and joins only), and the passages not yet decided are 32 bonds across the third corners\' relations — 17 across Production\'s, 15 across Distribution\'s, her count; route 63 is one of them, `the promise · the use`, undecided',
  chainPaths.length === 0 && und0.length === 32 && byView('Production') === 17 && byView('Distribution') === 15 && !!b63 && b63.rb.reading === 'UNRULED' && name(X, b63.rb.bond.x) === 'the promise' && name(Y, b63.rb.bond.y) === 'the use',
  { chains: chainPaths.length, undecided: und0.length, production: byView('Production'), distribution: byView('Distribution'), r63: b63 && { legs: b63.legs, x: name(X, b63.rb.bond.x), y: name(Y, b63.rb.bond.y) } });

// the page's own decision for a bond: the record the bond row's `rec` writes, the way as the row reads it (the word's, else his choice)
const faceOf = (o) => shape().faces.find((f) => f.id === o.v.faceId);
const recOf = (o, w3, w3dir) => { const f = faceOf(o); const b = o.rb.bond; return { base: [f.vertexIds.indexOf(X), f.vertexIds.indexOf(Y)], x: b.x, w: b.w, z: b.z, w2: b.w2, y: b.y, S: b.S, z2: b.z2, w3, ...(w3dir ? { w3dir } : {}), verdict: 'composed' }; };
const again = (re) => findBond(re).rb;
const renderBonds = (o) => {
  useGeometryStore.setState({ modesView: { siteId: site, cell: `${o.rb.bond.x}|${o.rb.bond.y}`, all: true, at: 0 } });
  const sh = shape();
  const packet = buildGeneralSitePacketPresenterReport(sh).packets.find((pk) => pk.trace.siteId === site);
  const st = midpointSiteOf(sh, site, packet ? packet.trace : null);
  const html = renderToString(React.createElement(MidpointSurface, { shape: sh, site: st, parents: [spaceOf(sh, st.a), spaceOf(sh, st.b)], resolved: spaceOf(sh, site), refusal: null, remade: null })).replace(/<!-- -->/g, '');
  const parts = html.split(/data-medium-bond="[^"]*"/).slice(1);
  return parts.map((pt) => unesc(pt.slice(pt.indexOf('>') + 1).split(/data-medium-route=/)[0].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()); // the row's text, its own attributes left off
};

// ═══ §2 ROUTE 63 IN A WORD IN USE — `is consumed as`, its way at once ═══
const wC = 'is consumed as'; const wCC = converseOf(facts(), wC);
const way63 = wayOfWord(wC, sayings(), facts());
const said63 = S().giveVerdict(b63.v.faceId, recOf(b63, wC, way63));
const r63a = again(R63);
const lines63a = renderBonds(b63);
check('§2 ★★ HER ITEM 1: `is consumed as`, in use on the edge and read from the promise (`→`, 14 sayings), decided on route 63 with that way is TAKEN — the bond reads COMPOSED by his decision, `the promise is consumed as the use`, onto his relating at the pair — and the card prints `comes to the promise is consumed as the use, also related directly` (at c22f883: `not taken — this passage is a chain, so its decision keeps the chain\'s own order`)',
  way63 === ALONG && sayings().filter((s) => s[0] === wC).length >= 14 && said63 === null && r63a.reading === 'COMPOSED' && r63a.by === 'verdict' && r63a.composite === wC && r63a.compositeDir === ALONG && lines63a.some((l) => /comes to the promise is consumed as the use, also related directly/.test(l)),
  { way: way63, said: said63, reading: r63a.reading, composite: r63a.composite, dir: r63a.compositeDir, direct: r63a.direct, line: lines63a.find((l) => /is consumed as the use/.test(l)) });

// ═══ §3 ITS DECLARED CONVERSE — `is the consuming of`, the same relation read the other way round ═══
fresh();
const wayC = wayOfWord(wCC, sayings(), facts());
const ownC = sayings().filter((s) => s[0] === wCC).length;
const saidC = S().giveVerdict(b63.v.faceId, recOf(b63, wCC, wayC));
const r63c = again(R63);
const lines63c = renderBonds(b63);
check('§3 ★★ HER ITEM 2: `is the consuming of`, declared the converse of `is consumed as`, has no saying of its own on the edge and reads its way at ONCE by his equation (`←`: from the use) — no question asked; decided on route 63 it is TAKEN and composes onto the converse spelling of the same relating, `the use is the consuming of the promise` ≡ `the promise is consumed as the use` (D13, `sameStatement`); the card prints `comes to the use is the consuming of the promise, also related directly`',
  wCC === 'is the consuming of' && ownC === 0 && wayC === AGAINST && saidC === null && r63c.reading === 'COMPOSED' && r63c.by === 'verdict' && r63c.composite === wCC && r63c.compositeDir === AGAINST
    && r63c.direct === `${wCC}|${b63.rb.bond.x}|${b63.rb.bond.y}|←` && r63a.direct === `${wC}|${b63.rb.bond.x}|${b63.rb.bond.y}` && sameStatement(facts(), wC, ALONG, wCC, AGAINST) === true
    && lines63c.some((l) => /comes to the use is the consuming of the promise, also related directly/.test(l)),
  { converse: wCC, own: ownC, way: wayC, said: saidC, reading: r63c.reading, dir: r63c.compositeDir, direct: r63c.direct, line: lines63c.find((l) => /consuming of/.test(l)) });

// ═══ §4 A NEW WORD ASKS — and decides the way he chooses ═══
fresh();
const wN = 'is bought on';
const wayN = wayOfWord(wN, sayings(), facts());
const saidN = S().giveVerdict(b63.v.faceId, recOf(b63, wN, AGAINST)); // he chose `the use is bought on the promise`
const r63n = again(R63);
const lines63n = renderBonds(b63);
check('§4 ★★ HER ITEM 3: `is bought on`, a word with no saying on the edge and no declared converse, has NO way here — the bond row asks `which way it reads` (`bondAsks`, below) — and decided in the way he chooses, `the use is bought on the promise`, it is TAKEN and reads that way: `comes to the use is bought on the promise, not related directly: Production\'s light`',
  wayN === null && converseOf(facts(), wN) === null && saidN === null && r63n.reading === 'LIGHT' && r63n.compositeDir === AGAINST && lines63n.some((l) => /comes to the use is bought on the promise, not related directly: Production's light/.test(l)),
  { way: wayN, said: saidN, reading: r63n.reading, dir: r63n.compositeDir, line: lines63n.find((l) => /bought on/.test(l)) });

// ═══ §5 HER OTHER ROUTES — every bond at a pair where his relating stands, decided in the relating's word with its way, composes onto it ═══
fresh();
const R45 = [/the title is owed as the promise/, /the title is honoured as the share/, /the share is spent as the spending/];
const b45 = findBond(R45);
const way45 = wayOfWord('is spent as', sayings(), facts());
const said45 = b45 ? S().giveVerdict(b45.v.faceId, recOf(b45, 'is spent as', way45)) : 'no such bond';
const r45 = b45 ? again(R45) : null;
fresh();
const held = relatingsHeld(edge()).filter((r) => r[0] !== IS && r[3] !== '-');
const atPair = und0.map((o) => ({ o, r: held.find((r) => r[1] === o.rb.bond.x && r[2] === o.rb.bond.y) })).filter((t) => t.r);
const results = atPair.map(({ o, r }) => {
  fresh();
  const way = wayOfWord(r[0], sayings(), facts()) ?? dirOf(r);
  const said = S().giveVerdict(o.v.faceId, recOf(o, r[0], way));
  const after = bondsOf().find((q) => q.v.faceId === o.v.faceId && q.legs === o.legs);
  return { legs: o.legs, word: r[0], way, said, reading: after ? after.rb.reading : null };
});
check('§5 ★★ HER ROUTES 45 AND 46 (`is spent as`, the relating at the pair) AND EVERY BOND WHERE HIS RELATING STANDS: `the share is spent as the spending` across Distribution\'s relation, decided in `is spent as` with its way, is TAKEN and composes onto his relating; and each undecided bond whose pair holds a relating of his, decided in that relating\'s word with its way, is taken and reads COMPOSED (`is laid out as` among them)',
  !!b45 && way45 === ALONG && said45 === null && r45 && r45.reading === 'COMPOSED' && r45.compositeDir === ALONG && results.length > 0 && results.every((t) => t.said === null && t.reading === 'COMPOSED') && results.some((t) => t.word === 'is laid out as'),
  { r45: b45 && { said: said45, reading: r45 && r45.reading, dir: r45 && r45.compositeDir }, atPair: results.length, words: [...new Set(results.map((t) => t.word))], notTaken: results.filter((t) => t.said !== null || t.reading !== 'COMPOSED').slice(0, 4) });

// ═══ §6 THE 32 BECOME DECIDABLE — none refused by its shape ═══
fresh();
const answers = und0.map((o, k) => S().giveVerdict(o.v.faceId, recOf(o, 'is tested as', k % 2 === 0 ? ALONG : AGAINST)));
const left = undecided().length;
check('§6 ★★ THE 32 BECOME DECIDABLE: each of the 32 undecided bonds takes a decision in a new word with the way chosen, either way — no refusal by shape, none left undecided after',
  answers.length === 32 && answers.every((a) => a === null) && left === 0,
  { taken: answers.filter((a) => a === null).length, refused: [...new Set(answers.filter((a) => a !== null))], left });

// ═══ §7 KEPT ACROSS EXPORT AND IMPORT — the way rides the bond's record and is read back ═══
fresh();
S().giveVerdict(b63.v.faceId, recOf(b63, wCC, AGAINST));
const snap = S().exportWorkspace();
S().importWorkspace(JSON.parse(JSON.stringify(snap)));
const r63k = again(R63);
const rec63 = verdictsOn(faceOf(findBond(R63))).find((r) => r.S === b63.rb.bond.S && r.z2 === b63.rb.bond.z2 && r.x === b63.rb.bond.x && r.y === b63.rb.bond.y && r.w3 === wCC);
check('§7 ★★ KEPT ACROSS EXPORT AND IMPORT: route 63 decided in the converse, exported and imported again, reads as decided — COMPOSED, `is the consuming of`, `←` — its record read by `verdictsOn` with its way (at c22f883 a bond\'s record carrying a way was dropped by the reader, its bytes left)',
  r63k.reading === 'COMPOSED' && r63k.composite === wCC && r63k.compositeDir === AGAINST && !!rec63 && rec63.w3dir === AGAINST,
  { reading: r63k.reading, composite: r63k.composite, dir: r63k.compositeDir, record: rec63 && { w3: rec63.w3, w3dir: rec63.w3dir } });

// ═══ §8 BY CONSTRUCTION ═══
const gs = src('src/store/geometryStore.ts'); const so = src('src/lib/sorting.ts'); const mb = src('src/components/MediumBlock.tsx'); const ww = src('src/lib/wordWay.ts');
check('§8 ★★ BY CONSTRUCTION: the store holds no refusal of a decision\'s way by its shape (the sentence `this passage is a chain` is gone from the store and the sorting); `verdictsOn` reads a decision\'s way on every shape and drops only an ill-formed value; a decided bond\'s line reads its ends by the way recorded (`bondSaid`); the bond row asks for a word with no way (`bondAsks`); the one reader folds his declared converse and takes the lexicon as a REQUIRED argument, so the compiler holds every caller to it',
  !/this passage is a chain/.test(gs) && !/this passage is a chain/.test(so) && /if \(o\.w3dir !== undefined && !isDir\(o\.w3dir\)\) return false;/.test(so) && !/legs !== 'chain'/.test(so)
    && /const bondSaid = rb\.compositeDir === AGAINST \? `\$\{nameB\(b\.y\)\} \$\{rb\.composite\} \$\{nameA\(b\.x\)\}` : `\$\{nameA\(b\.x\)\} \$\{rb\.composite\} \$\{nameB\(b\.y\)\}`;/.test(mb) && (mb.match(/comes to \$\{bondSaid\}/g) || []).length === 3 && !/comes to \$\{nameA\(b\.x\)\} \$\{rb\.composite\}/.test(mb)
    && /const bondAsks = typed\.length > 0 && bondDir === null;/.test(mb)
    && /export function wayOfWord\(w: string, sayings: ReadonlyArray<Saying>, facts: LexiconFacts\): Dir \| null \{/.test(ww) && /const c = converseOf\(facts, w\);/.test(ww) && /s\[1\] === ALONG \? AGAINST : ALONG/.test(ww));

console.log(`\n${failures === 0 ? "DIAGNOSE-A-BONDS-DECISION-CARRIES-ITS-WAY: ALL PASS — the 32 bonds at Finance–Consumption decide; a word in use reads its way, its declared converse decides to the same relation, a new word asks; the way is kept" : `DIAGNOSE-A-BONDS-DECISION-CARRIES-ITS-WAY: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

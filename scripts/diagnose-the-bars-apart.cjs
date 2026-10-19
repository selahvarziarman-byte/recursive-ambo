#!/usr/bin/env node

// DIAGNOSE THE BARS APART — ADR 0031 §9.59 (ratified 2026-10-19 12:26; the mothership's MARKER of 12:40; the designer's words of 12:28): a bar on a corner's own
// edge that touches a role of an end is a source for that corner's light — counted APART from the relatings in the line asked first (`on Value's own edges, 18
// relatings reach them and 8 bars refuse them`), a DENIED mark with its edge as provenance under the box (`on Value–Fact: the validity is the case as the
// obtaining · does not hold`; through a declared converse `…, so the validity measures the obtaining · does not hold`), and among the cells the name stood against.
//
// THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM: the readers the page prints from (`ownEdgesClause`, `edgeMarksOn`, `edgeMarkWords`) are RUN on Virgin Land's Culture
// (the 19:34 export) through the store, as the app imports it; the RESEARCHER'S FALSIFIER (§9.59, its last paragraph) is run clause by clause: 18 reaching and 8
// refusing; 8 denied marks with provenance Value–Fact; one bar withdrawn → 7; a converse declared → that bar's mark in Fact's light too. The named-against place is
// rendered under node (the point tab's blocks open through the store's view). The lines under the box are the eye's (§43: a light is the page's own state).
// Run: node scripts/diagnose-the-bars-apart.cjs

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
const { ownEdgesClause, edgeMarksOn, edgeMarkWords } = req('src/lib/altitude.ts');
const { barsOn, instancesOn, IS } = req('src/lib/relatings.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { spaceOf, nameIn } = req('src/lib/spaceOf.ts');
const MS = req('src/components/MidpointSurface.tsx');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8');

console.log("THE BARS APART — a bar on a corner's own edge is a source for its light: counted apart, a denied mark with its edge as provenance, named against (§9.59)\n");

const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const FIX = path.join(repoRoot, 'scripts/fixtures/altitude');
S().importWorkspace(JSON.parse(fs.readFileSync(path.join(FIX, 'virgin-land_2026-10-09_1934_Value-Fact_all-passages-decided.workspace.json'), 'utf8')));
const byLabel = (l) => Object.keys(cur().vertices).find((v) => cur().vertices[v].data.label === l);
const Value = byLabel('Value'); const Fact = byLabel('Fact'); const Meaning = byLabel('Meaning'); const Action = byLabel('Action');
const facts = () => ({ converses: S().converses, opaque: S().opaque });
const words = (corner, id) => { const sp = spaceOf(cur(), corner); return sp ? nameIn(sp.space, id) : id; };
const eVF = edgeBetween(cur().edges, Value, Fact);
const label = (v) => cur().vertices[v].data.label;

// ═══ §1 THE CLAUSE, COUNTED APART ═══
check('§1 ★★ THE FALSIFIER\'S FIRST CLAUSE: on Culture, with Value the third corner of Fact–Meaning, the line\'s clause reads `; on Value\'s own edges, 18 relatings reach them and 8 bars refuse them` — the relatings that hold and the bars, counted apart, IS among neither',
  ownEdgesClause(cur(), Value, Fact, Meaning, 'Value') === "; on Value's own edges, 18 relatings reach them and 8 bars refuse them" && instancesOn(eVF).filter((r) => r[0] !== IS).length === 18 && barsOn(eVF).length === 8,
  { clause: ownEdgesClause(cur(), Value, Fact, Meaning, 'Value'), relatings: instancesOn(eVF).filter((r) => r[0] !== IS).length, bars: barsOn(eVF).length });
check('§1 ★★ NOTHING MOVES ON VIRGIN LAND\'S SITTINGS (§9.59, its Culture paragraph): for Meaning and Action over Value–Fact the clause is empty — their own edges carry neither relating nor bar; Fact over Value–Meaning reads the same 18 and 8 (the edge is Fact\'s too)',
  ownEdgesClause(cur(), Meaning, Value, Fact, 'Meaning') === '' && ownEdgesClause(cur(), Action, Value, Fact, 'Action') === '' && ownEdgesClause(cur(), Fact, Value, Meaning, 'Fact') === "; on Fact's own edges, 18 relatings reach them and 8 bars refuse them",
  { meaning: ownEdgesClause(cur(), Meaning, Value, Fact, 'Meaning'), fact: ownEdgesClause(cur(), Fact, Value, Meaning, 'Fact') });

// ═══ §2 THE DENIED MARKS WITH THEIR PROVENANCE ═══
const marksVF = edgeMarksOn(cur(), Value, Fact, facts());
const barMarks = marksVF.filter((mk) => mk.kind === 'bar');
const line = (mk) => `on ${label(mk.edge[0])}–${label(mk.edge[1])}: ${edgeMarkWords(mk, words(Value, mk.z), words(Fact, mk.x))}`;
const lines = barMarks.map(line);
check('§2 ★★ THE FALSIFIER\'S SECOND CLAUSE: A(Value, Fact–Meaning) carries 8 denied marks with provenance Value–Fact — 6 read with Value\'s role as subject, 2 (`answers to`, said from Fact\'s side) through the converse he declared (`measures`); the 18 relatings\' marks stand beside them, first',
  barMarks.length === 8 && barMarks.every((mk) => mk.edge[0] === Value && mk.edge[1] === Fact) && barMarks.filter((mk) => mk.subjectIsZ).length === 6 && barMarks.filter((mk) => !mk.subjectIsZ && mk.converse === 'measures').length === 2 && marksVF.filter((mk) => mk.kind === 'relating').length === 18 && marksVF.findIndex((mk) => mk.kind === 'bar') === 18,
  { bars: barMarks.length, direct: barMarks.filter((mk) => mk.subjectIsZ).length, viaConverse: barMarks.filter((mk) => mk.converse).map((mk) => mk.converse), relatings: marksVF.filter((mk) => mk.kind === 'relating').length });
check('§2 ★★ THE BAR\'S OWN LINE, IN HER WORDS: `on Value–Fact: the validity is the case as the obtaining · does not hold`; through the converse `on Value–Fact: the obtaining answers to the validity, so the validity measures the obtaining · does not hold` — the ending said once, at the end; a relating\'s line carries none',
  lines.includes('on Value–Fact: the validity is the case as the obtaining · does not hold') && lines.includes('on Value–Fact: the obtaining answers to the validity, so the validity measures the obtaining · does not hold') && lines.every((l) => /^on Value–Fact: .+ · does not hold$/.test(l) && (l.match(/· does not hold/g) || []).length === 1) &&
    marksVF.filter((mk) => mk.kind === 'relating').every((mk) => !/does not hold/.test(line(mk))),
  lines);
check('§2 ★ NO MARK ON THE OTHER EDGE: Value–Meaning carries nothing, so Value\'s light has no line there',
  edgeMarksOn(cur(), Value, Meaning, facts()).length === 0);

// ═══ §3 THE FALSIFIER'S THIRD CLAUSE — ONE BAR WITHDRAWN ═══
S().withdrawRelating(eVF.id, 'rests on', 'validity', 'totality');
check('§3 ★★ WITHDRAW ONE BAR AND THE COUNT READS 7: the clause `… 18 relatings reach them and 7 bars refuse them`; 7 marks',
  ownEdgesClause(cur(), Value, Fact, Meaning, 'Value') === "; on Value's own edges, 18 relatings reach them and 7 bars refuse them" && edgeMarksOn(cur(), Value, Fact, facts()).filter((mk) => mk.kind === 'bar').length === 7,
  ownEdgesClause(cur(), Value, Fact, Meaning, 'Value'));
// the singulars and the zero part, on the same record: withdraw down to one, then none
for (const r of barsOn(edgeBetween(cur().edges, Value, Fact)).slice(1)) S().withdrawRelating(eVF.id, r[0], r[1], r[2], r.length === 5 ? r[4] : undefined);
check('§3 ★ THE SINGULAR: with one bar left the clause reads `… 18 relatings reach them and 1 bar refuses them`', ownEdgesClause(cur(), Value, Fact, Meaning, 'Value') === "; on Value's own edges, 18 relatings reach them and 1 bar refuses them", ownEdgesClause(cur(), Value, Fact, Meaning, 'Value'));
for (const r of barsOn(edgeBetween(cur().edges, Value, Fact))) S().withdrawRelating(eVF.id, r[0], r[1], r[2], r.length === 5 ? r[4] : undefined);
check('§3 ★ A ZERO PART DOES NOT PRINT: with no bar the clause reads as before §9.59, `; on Value\'s own edges, 18 relatings reach them`', ownEdgesClause(cur(), Value, Fact, Meaning, 'Value') === "; on Value's own edges, 18 relatings reach them", ownEdgesClause(cur(), Value, Fact, Meaning, 'Value'));

// ═══ §4 THE FALSIFIER'S FOURTH CLAUSE — A CONVERSE DECLARED ═══
S().giveRelating(eVF.id, 'probes', 'validity', 'obtaining', '-'); // a bar in a word with no converse, said from Value's side
const inValue = () => edgeMarksOn(cur(), Value, Fact, facts()).filter((mk) => mk.kind === 'bar' && mk.relating[0] === 'probes');
const inFact = () => edgeMarksOn(cur(), Fact, Value, facts()).filter((mk) => mk.kind === 'bar' && mk.relating[0] === 'probes');
const before = { value: inValue().length, fact: inFact().length };
const refused = S().declareConverse('probes', 'is probed by');
const after = { value: inValue().length, fact: inFact().length };
check('§4 ★★ A CONVERSE DECLARED PUTS THE BAR\'S MARK IN FACT\'S LIGHT TOO: a bar said from Value\'s side in a word with no converse (`validity probes obtaining · does not hold`) marks Value\'s light alone — in Fact\'s light over Value–Meaning it is absent (it reads with the end\'s role as subject, no converse); `is probed by` declared, Fact\'s light carries it through the converse, `on Value–Fact: the validity probes the obtaining, so the obtaining is probed by the validity · does not hold`, and Value\'s light keeps it — the converse reading is the same relating (D13), so the mark stands in both lights; marked as the coder\'s reading of "moves"',
  refused === null && before.value === 1 && before.fact === 0 && after.value === 1 && after.fact === 1 && inFact()[0].converse === 'is probed by' &&
    `on ${label(inFact()[0].edge[0])}–${label(inFact()[0].edge[1])}: ${edgeMarkWords(inFact()[0], words(Fact, inFact()[0].z), words(Value, inFact()[0].x))}` === 'on Value–Fact: the validity probes the obtaining, so the obtaining is probed by the validity · does not hold',
  { refused, before, after, factLine: inFact()[0] ? `on ${label(inFact()[0].edge[0])}–${label(inFact()[0].edge[1])}: ${edgeMarkWords(inFact()[0], words(Fact, inFact()[0].z), words(Value, inFact()[0].x))}` : null });

// ═══ §5 THE ONE SMALL PLACE — `what it was named against` ═══
// the case built on the record: Fact–Meaning gets a relating at Fact's `obtaining` (an instance's end), Value speaks in its light there, the midpoint is named; the
// bars on Value–Fact that touch `obtaining` and read with Value's role as subject stand among `these don't hold:` with their edge first
S().importWorkspace(JSON.parse(fs.readFileSync(path.join(FIX, 'virgin-land_2026-10-09_1934_Value-Fact_all-passages-decided.workspace.json'), 'utf8')));
const eFM = edgeBetween(cur().edges, Fact, Meaning);
const factFirst = eFM.vertexIds[0] === Fact;
const meaningRole = spaceOf(cur(), Meaning).space.roles[0].id;
const r5 = factFirst ? S().giveRelating(eFM.id, 'relates', 'obtaining', meaningRole, '+') : S().giveRelating(eFM.id, 'relates', meaningRole, 'obtaining', '+');
const faceVFM = cur().faces.find((f) => [Value, Fact, Meaning].every((v) => f.vertexIds.includes(v)));
const r5b = S().giveAltitudeSaying(faceVFM.id, Value, Fact, 'validity', 'relates', 'obtaining', '+');
const midFM = Object.values(cur().vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(Fact) && v.createdBy.sourceVertexIds.includes(Meaning));
S().selectVertex(midFM.id);
const r5c = S().updateSelectedVertexData({ label: 'Probe' });
S().setPointView({ siteId: midFM.id, againstShown: true });
const vw = MS.midpointViewOf(cur(), midFM.id, { tauDrafts: S().edgeTauDrafts });
const html = renderToString(React.createElement(MS.MidpointSurface, { shape: cur(), site: vw.site, parents: vw.parents, resolved: vw.resolved, refusal: null, remade: null })).replace(/<!-- -->/g, '');
const blockV = (html.split('data-medium-against-block="Value"')[1] || '').split('data-medium-against-block=')[0];
const deniedText = ((blockV.match(/<span data-medium-against-denied="(\d+)">([^<]*)<\/span>/) || [])[2] || '').replace(/&#x27;/g, "'");
const deniedItems = deniedText.replace(/^these don't hold: /, '').replace(/ \(\d+\)$/, '').split(' · ');
check('§5 ★★ THE ONE SMALL PLACE: the midpoint Fact–Meaning named `Probe` with Value speaking in its light and a relating at Fact\'s `obtaining` — under `what it was named against`, Value\'s block lists among `these don\'t hold:` the bars on Value–Fact that touch `obtaining` and read with Value\'s role as subject, each with its edge first and no ending (the heading says it): `on Value–Fact: the validity is the case as the obtaining`, `on Value–Fact: the obtaining answers to the validity, so the validity measures the obtaining`, `on Value–Fact: the wanting is directed at the obtaining` — 3, counted in the heading; no bar of the other edge, none touching a role no instance reaches',
  r5 === null && r5b === null && r5c === null && blockV.length > 0 && deniedItems.length === 3 && (deniedText.match(/\((\d+)\)$/) || [])[1] === '3' &&
    deniedItems.includes('on Value–Fact: the validity is the case as the obtaining') && deniedItems.includes('on Value–Fact: the obtaining answers to the validity, so the validity measures the obtaining') && deniedItems.includes('on Value–Fact: the wanting is directed at the obtaining') && !/does not hold/.test(deniedText),
  { r5, r5b, r5c, denied: deniedText.slice(0, 400), block: blockV.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 300) });

// ═══ §6 BY CONSTRUCTION — one reader each, both sites, the box's lines, the mold tracked ═══
const mb = src('src/components/MediumBlock.tsx'); const ms = src('src/components/MidpointSurface.tsx'); const gi = src('.gitignore');
check('§6 ★★ ONE READER FOR THE CLAUSE at both its sites (the point tab\'s `edgesPart`, the pairing column\'s head) and NOWHERE ELSE; one reader for the marks under the box (`edgeMarksOn` · `edgeMarkWords`), the bars\' lines marked `data-altitude-edge-bar`, in the relatings\' ink (stone-300); the named-against place reads the same reader at the name\'s stage with the stage\'s facts',
  mb.includes("const edgesPart = (v: ViewSorting, lz: string): string => ownEdgesClause(m.shape, v.view, m.X, m.Y, lz, m.options);") && ms.includes("${ownEdgesClause(shape, apex, site.a, site.b, lx)}") && !/relatings reach/.test(mb) && !/relatings reach/.test(ms) &&
    ms.includes("const marks = edgeMarksOn(shape, light, end, { converses: conversesNow, opaque: [] }, {}, { z: zRole.id, x: xId });") && ms.includes("data-altitude-edge-bar={mk.kind === 'bar' ? 'true' : undefined} className=\"text-stone-300\"") &&
    mb.includes("edgeMarksOn(recThen.shape, v.view, end, recThen.facts, optionsThen).filter((mk) => mk.kind === 'bar' && atInstanceEnd(e, mk.x))") && mb.includes("const denied = [...deniedSaid, ...barsAgainst];"),
  'source pins');
check('§6 ★ MOLD v6 IS TRACKED (the mothership\'s 12:40; Δ202): `.gitignore` lets the casting guide through, and the file exists',
  gi.includes('\n!.handoff/MOLD_v6_how-to-pour-a-cast-under-the-norm_the-uniform-rule_2026-10-19.md\n') && fs.existsSync(path.join(repoRoot, '.handoff/MOLD_v6_how-to-pour-a-cast-under-the-norm_the-uniform-rule_2026-10-19.md')));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-BARS-APART: ALL PASS — on Culture the bars on a corner\'s own edges are counted apart, marked denied with their edge, named against; one bar withdrawn counts 7; a converse declared puts the mark in the other light too' : `DIAGNOSE-THE-BARS-APART: ${failures} FAIL`}`);
process.exit(failures === 0 ? 0 : 1);

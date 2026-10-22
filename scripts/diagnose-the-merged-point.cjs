#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════
// THE MERGED POINT'S WHOLE CONTENT — GROUP 4 · slice 3 (ADR 0031 §9.76 (3), the researcher's 11:27, ratified — claims §512; the designer's 16:48 geometry; Arman's
// Δ243 the tower, Δ244 the lift carrying his records). The point of an identification reads, with each member's moments, the member's own WAYS (its filled relations,
// as the one reader reads them with HIS RECORDS — the lift's), typed by kind THROUGH THE MEMBER and one word where his τ joined two; what each moment RESTS ON down the
// tower; the LIGHTS ending at it. MEASURED on Virgin Land's 12:10 Property export (v7 casts with dependences) with acts at generation 2 made here: lawful pairs at the four
// generation-2 edges around Property, a loop answered both ways at Capital–Property (a way), a saying on a generation-2 triangle (a light); the square lifted, the torus
// borne by the page's path; the point read with the records the lift carried and, as the control, without (an older file: `ways: not carried by this lift`).
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
const { useLiftStore } = req('src/store/liftStore.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const I = req('src/manuscript/identificationImageModel.ts');
const PO = req('src/manuscript/writtenFormModel.ts');
const PC = req('src/manuscript/pointContentModel.ts');
const T = req('src/lib/tower.ts');
const P = req('src/lib/isPredicate.ts');
const { MergedPointDrawing } = req('src/manuscript/MergedPointDrawing.tsx');
const { IdentificationImageSection } = req('src/manuscript/IdentificationImageSection.tsx');
const { momentCardOf } = req('src/components/FoundationCard.tsx');
const { zoomKeyOf } = req('src/components/ZoomFrame.tsx');
const { columnSpaceOf, termWordsOf, instancesFrom } = req('src/lib/instanceSpace.ts');
const { childLoopsCached, diagonalsOf, loopIdOf, childArcDetailsOf, roleIdOf } = req('src/lib/childLoops.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { spaceCounts } = req('src/lib/spaceOf.ts');
const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => { console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`); if (!cond) failures += 1; };
const note = (s) => console.log(`      ${s}`);
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n');
const unesc = (t) => t.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const text = (html) => unesc(html.replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
console.log('THE MERGED POINT\'S WHOLE CONTENT — §9.76 (3) on the Property export with acts at generation 2: the ways, the tower, the lights; the lift carrying his records\n');
const S = () => useGeometryStore.getState();
const sh = () => S().shapes[S().currentShapeId];
const FIXTURE = 'scripts/fixtures/altitude/virgin-land_2026-10-22_1210_Property_F-D_19-moments-8-relation-words-named.workspace.json';
S().importWorkspace(JSON.parse(fs.readFileSync(path.join(repoRoot, FIXTURE), 'utf8')));
const G1 = sh();
const byLabel = (shape, l) => Object.values(shape.vertices).find((v) => v.data.label === l);
const Prop = byLabel(G1, 'Property');
const around = G1.edges.filter((e) => e.vertexIds.includes(Prop.id) && G1.vertices[e.vertexIds.find((x) => x !== Prop.id)].createdBy.operation !== 'seed');
S().selectCell(G1.cells.find((c) => c.kind === 'core').id); S().applyAmboDissectionToCurrent();
const G2 = sh();
const lab = (shape, v) => shape.vertices[v]?.data.label || v;
const corners = around.map((e) => Object.values(G2.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && e.vertexIds.every((x) => v.createdBy.sourceVertexIds.includes(x))));
const sq = G2.faces.find((f) => f.vertexIds.length === 4 && corners.every((v) => v && f.vertexIds.includes(v.id)));
check('§0 THE RECORD: the Property export dissected again — four generation-1 medial edges around Property, their four generation-2 midpoints the corners of one square of the generation-2 core; the seed casts carry dependences (v7)',
  around.length === 4 && corners.every(Boolean) && !!sq && Object.values(G2.vertices).filter((v) => v.createdBy.operation === 'seed').every((v) => (v.data.cast?.dependences ?? []).length > 0),
  { around: around.map((e) => e.vertexIds.map((v) => lab(G1, v)).join('–')), corners: corners.map((c) => c && c.data.label) });

// ═══ §1 ACTS AT GENERATION 2: a lawful pair at each edge around Property; two at the first, a loop answered both ways there (a WAY); a saying on a triangle (a LIGHT) ═══
const recsOf = () => childRecordsOf(S());
const nm = (shape, c, id) => termWordsOf(shape, c, id, { records: recsOf() });
const given = [];
let wayMember = null; let wayLoop = null; let wayArcsBefore = 0;
const lawful = (a, b, x, y) => P.isPairRefusalAt(sh(), a, b, x, y, { options: {}, names: (c, id) => nm(sh(), c, id) }) === null;
const give = (e, a, x, y) => { if (e.vertexIds[0] === a) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); const ref = S().midpointRefusals[e.id]; if (ref) useGeometryStore.setState({ midpointRefusals: {} }); return !ref; };
// a loop one of whose relatings is an IS PAIR runs through the pair — form, never asked (§9.45) — so the way-member's two moments are relatings IN A MODE, whose loop is asked
S().declareMode('is honoured as');
const relate = (e, a, x, y) => { const r = e.vertexIds[0] === a ? S().giveRelating(e.id, 'is honoured as', x, y, '+') : S().giveRelating(e.id, 'is honoured as', y, x, '+'); return r === null; };
const unrelate = (e, a, x, y) => { if (e.vertexIds[0] === a) S().withdrawRelating(e.id, 'is honoured as', x, y, '→'); else S().withdrawRelating(e.id, 'is honoured as', y, x, '→'); useGeometryStore.setState({ relatingRefusals: {} }); };
for (let k = 0; k < around.length; k += 1) {
  // the edge FRESH on the dissected shape (a dissection makes a new shape; an act on the old shape's edge id is a silent no-op — the 10-17 scar)
  const [a, b] = around[k].vertexIds; const e = edgeBetween(sh().edges, a, b);
  const cA = columnSpaceOf(sh(), a, { records: recsOf() }); const cB = columnSpaceOf(sh(), b, { records: recsOf() });
  if (!cA || !cB) { given.push([lab(G2, a) + '–' + lab(G2, b), 'a column missing — a parent relates nothing on this export']); continue; }
  let taken = 0;
  // a loop at this generation-2 site closes only where BOTH parents hold a say between the two pairs' coordinates: two pairs chosen from a's arc p1–p2 and b's arc r1–r2
  if (!wayMember) {
    const arcsA = childArcDetailsOf(sh(), a, { records: recsOf() }); const arcsB = childArcDetailsOf(sh(), b, { records: recsOf() });
    outer: for (const pa of arcsA) for (const pb of arcsB) {
      const [p1, p2] = pa.terms; const [r1, r2] = pb.terms;
      for (const [x1, y1, x2, y2] of [[p1, r1, p2, r2], [p1, r2, p2, r1]]) {
        if (x1 === x2 || y1 === y2) continue;
        if (!relate(e, a, x1, y1)) continue;
        if (!relate(e, a, x2, y2)) { unrelate(e, a, x1, y1); continue; }
        taken = 2;
        const member = corners[k];
        const L = childLoopsCached(sh(), member.id, recsOf());
        const loops = L ? L.loops.filter((l) => !l.form && !l.pair && l.kind !== 'two') : [];
        if (loops.length) { wayMember = member; wayLoop = { L, loop: loops[0], kind: loops[0].kind, edge: e }; break outer; }
        unrelate(e, a, x1, y1); unrelate(e, a, x2, y2); taken = 0;
      }
    }
  }
  if (taken === 0) { for (const x of cA.roles) { let done = false; for (const y of cB.roles) { if (lawful(a, b, x.id, y.id) && give(e, a, x.id, y.id)) { taken = 1; done = true; break; } } if (done) break; } }
  given.push([lab(G2, a) + '–' + lab(G2, b), taken]);
}
// the way: at the member whose child has a closed loop, the loop asked both ways with one word — its arc
if (wayMember) {
  // FILLED needs no way unsaid (§9.42's order: a hole, else WAITING, else filled): every way of BOTH diagonals answered with one word, so each diagonal agrees
  const { L, loop } = wayLoop; const id = loopIdOf(L, loop);
  wayArcsBefore = childArcDetailsOf(sh(), wayMember.id, { records: recsOf() }).length;
  const refusals = [];
  for (const d of diagonalsOf(L, loop)) { const start = roleIdOf(L, d.from === 'i' ? loop.i : loop.j); refusals.push(S().sayLoop(wayMember.id, id, start, 'a', 'is carried as', '→'), S().sayLoop(wayMember.id, id, start, 'b', 'is carried as', '→')); }
  wayLoop = { id, refusals, kind: loop.kind, member: wayMember.data.label };
}
const wayArcs = wayMember ? childArcDetailsOf(sh(), wayMember.id, { records: recsOf() }) : [];
note(`acts: ${J(given)} · the loop at ${wayMember ? wayMember.data.label : '?'}: ${J(wayLoop)} · arcs there before ${wayArcsBefore}, after ${wayArcs.length}`);
// the light: a triangle of the dissected shape with the member as an END and an apex holding moments — a saying from the apex's first moment to the member's first moment
let light = null;
if (wayMember) {
  const memberMoments = columnSpaceOf(sh(), wayMember.id, { records: recsOf() }).roles;
  for (const f of sh().faces.filter((x) => x.vertexIds.length === 3 && x.vertexIds.includes(wayMember.id))) {
    const apex = f.vertexIds.find((v) => v !== wayMember.id && (columnSpaceOf(sh(), v, { records: recsOf() })?.roles.length ?? 0) > 0);
    if (!apex) continue;
    const z = columnSpaceOf(sh(), apex, { records: recsOf() }).roles[0].id;
    const x = memberMoments[0].id;
    const r = S().giveAltitudeSaying(f.id, apex, wayMember.id, z, 'is honoured as', x, '+');
    if (r === null) { light = { face: f.id, apex, apexLabel: lab(sh(), apex), z, x }; break; }
    light = { refused: r.why || J(r) };
  }
}
note(`the light: ${J(light)}`);
check('§1 ★★ ACTS AT GENERATION 2 (the slice\'s premise, made here): three of the four edges around Property hold a lawful pair (the fourth\'s parent Finance–Consumption relates nothing on this export — its member holds no moment, said); at one member two relatings in a mode (an IS pair\'s loop runs through the pair and is never asked, §9.45) chosen from the parents\' own arcs close a loop, answered both ways with one word — its ONE WAY, an arc of its own (none before); a saying ends at its first moment on a triangle of the dissected shape',
  given.filter((g) => typeof g[1] === 'number' && g[1] >= 1).length >= 3 && !!wayMember && !!wayLoop && wayLoop.refusals.every((r) => r === null) && wayArcsBefore === 0 && wayArcs.length >= 1 && !!light && !light.refused,
  { given, loop: wayLoop, arcs: wayArcs.length, light });

// ═══ §2 THE LIFT CARRIES HIS RECORDS (Δ244): the square lifted; the file holds the four row sets; the load carries them; keyed to the loaded record they read the member's arc ═══
S().selectVertex(null); S().selectEdge(null); S().clearLiftSelection(); S().toggleLiftSelection({ kind: 'face', id: sq.id });
const before = useLiftStore.getState().queue.length; S().liftSelectionToManuscript();
const file = useLiftStore.getState().queue[before].file;
const entry = loadUniverseSnapshot(file);
const form = placeShelfEntry(entry, 0);
const record = entry.loaded.ancestors.find((a) => Object.keys(form.shape.vertices).every((v) => a.vertices[v])) ?? entry.loaded.ancestors[0];
const liftRecs = PC.liftRecordsOf(entry.loaded);
if (!wayMember) { console.log('\nDIAGNOSE-THE-MERGED-POINT: STOPPED — no closed loop at any member'); process.exit(1); }
const memberOnRecord = Object.keys(form.shape.vertices).find((v) => v.endsWith(wayMember.id));
const arcsOnRecord = liftRecs ? childArcDetailsOf(record, memberOnRecord, { records: liftRecs }).length : -1;
check('§2 ★★★ THE LIFT CARRIES HIS RECORDS (Δ244, the sanctioned spend): the lift file holds `records` — role names, loop answers, loop rules, relation names, the store\'s own counts — the load carries them, and keyed to the loaded record\'s ids (`liftRecordsOf`) they read the member\'s way ON THE RECORD as the Ambo reads it: the same one arc',
  !!file.records && file.records.loopAnswers.length === S().loopAnswers.length && file.records.roleNames.length === S().roleNames.length && file.records.relationNames.length === S().relationNames.length && file.records.loopRules.length === S().loopRules.length
    && !!entry.loaded.records && !!liftRecs && !!memberOnRecord && arcsOnRecord === wayArcs.length,
  { file: file.records && { roleNames: file.records.roleNames.length, loopAnswers: file.records.loopAnswers.length, loopRules: file.records.loopRules.length, relationNames: file.records.relationNames.length }, arcsOnRecord, memberOnRecord });

// ═══ §3 THE TORUS'S POINT: the member's way in the union, typed through the member; without the records nothing and the absence said ═══
const t1 = PO.applyPlaygroundOperationTo('glue-torus', form.shape, null, 1, 8, undefined, null);
const bornForm = { shape: t1.born.shape, opId: 'glue-torus', provenance: 'Glue → Torus (abAB)', parentShape: form.shape };
const facts = entry.loaded.lexicon ?? null;
const img = I.identificationImageOf(bornForm, record, [], facts, liftRecs);
const imgNone = I.identificationImageOf(bornForm, record, [], facts, null);
const corner = img.corners[0];
const keyed = corner.space.signature.map((s) => s.type);
check('§3 ★★★ THE POINT READS THE MEMBER\'S WAY (§9.76 (3)): the torus\'s one merged corner holds its four members\' moments AND the first member\'s way — one tuple at the point, its kind keyed THROUGH THE MEMBER (`<member>|<kind>`, never by spelling), `waysCarried`; the same point read without the records holds the moments alone and says the absence (`waysCarried` false)',
  img.state === 'identified' && img.waysCarried === true && img.corners.length === 1 && spaceCounts(corner.space).tuples === wayArcs.length && spaceCounts(corner.space).words >= 1 && keyed.every((k) => /^[^|]+\|/.test(k)) && keyed.some((k) => k.startsWith(memberOnRecord + '|'))
    && imgNone.state === 'identified' && imgNone.waysCarried === false && spaceCounts(imgNone.corners[0].space).tuples === 0 && spaceCounts(imgNone.corners[0].space).roles === spaceCounts(corner.space).roles,
  { counts: spaceCounts(corner.space), keyed, none: spaceCounts(imgNone.corners[0].space) });

// ═══ §4 THE COLUMNS, THE CARD, THE LIGHTS (the designer's 16:48) ═══
const { columns, pairs, joined } = PC.memberColumnsOf(record, corner, [], liftRecs);
const colWay = columns.find((c) => c.id === memberOnRecord);
const momentOnRecord = colWay ? colWay.inside.points[0].id : null;
const lights = colWay ? PC.lightsEndingAt(record, memberOnRecord, light.x, { records: liftRecs }) : [];
const E = colWay ? T.towerEndOf(record, memberOnRecord, momentOnRecord, memberOnRecord, { records: liftRecs }) : null;
const cardHtml = E ? unesc(renderToString(momentCardOf({ head: `${PC.momentWordsOf(record, memberOnRecord, momentOnRecord, { records: liftRecs })} (${colWay.label})`, tuples: E.tuples, id: E.id, nameOf: E.nameOf }))) : '';
const ct = text(cardHtml);
check('§4 ★★★ THE COLUMNS: every member the record holds, each its own column in the record\'s order (the designer\'s 19:36: a member holding nothing keeps its head, its column marked empty), the first member\'s column holding its one ARC (its way, drawn in its own column), no pair line yet, no τ-joined kind; THE LIGHT ending at the member\'s first moment reads `<apex\'s moment> is honoured as <the moment> · holds`, whose light the apex\'s; THE CARD beside that moment reads down the tower — `cannot be without: <coordinate> (<parent>) · <coordinate> (<parent>)` and `through … (…): …` with the v7 casts\' words',
  columns.length >= 3 && columns.map((c) => c.id).join(',') === corner.members.filter((m) => record.vertices[m.id]).map((m) => m.id).join(',') && columns.filter((c) => c.empty).map((c) => c.id).join(',') === corner.members.filter((m) => record.vertices[m.id] && !(columnSpaceOf(record, m.id, { records: liftRecs })?.roles.length)).map((m) => m.id).join(',') && !!colWay && colWay.inside.arcs.length === wayArcs.length && colWay.waysRead === true && columns.every((c) => !c.seed) && pairs.length === 0 && joined.length === 0
    && lights.length === 1 && lights[0].holds === true && lights[0].apexLabel === light.apexLabel && / is honoured as /.test(lights[0].words)
    && /cannot be without: .+ \(.+\) · .+ \(.+\)/.test(ct) && /through .+ \((Finance|Production|Distribution|Consumption)\): /.test(ct),
  { columns: columns.map((c) => [c.label, c.inside.points.length, c.inside.arcs.length, c.waysRead]), light: lights[0] && lights[0].words, card: ct.slice(0, 300) });

// ═══ §5 THE DRAWING AND THE ROW: the N columns rendered, the arc in its member's column, a pair line after a seam act; the section's counts and the absence on an older file ═══
const draw = (transports, records) => unesc(renderToString(React.createElement(MergedPointDrawing, { record, corner: (records ? img : imgNone).corners[0], transports, records })));
const h0 = draw([], liftRecs);
const arcIn = (html, member) => { const col = html.split('data-merged-point-column="').find((chunk) => chunk.startsWith(member)); return col ? (col.split('data-merged-point-column="')[0].match(/data-inside-arc="/g) || []).length : -1; };
// a seam act: the first lawful pair at the first seam's first corner pair
const sides = I.seamSidesOf(record, img.seams[0]);
let act = null; const seamVerdicts = {};
for (let si = 0; si < img.seams.length && !act; si += 1) { const sd = I.seamSidesOf(record, img.seams[si]); if ('missing' in sd) continue; outer: for (let slot = 0; slot < sd.A.corners.length; slot += 1) for (const x of sd.A.spaces[slot].roles) for (const y of sd.B.spaces[slot].roles) { const a = I.seamActAt(record, img.seams[si], [], slot, x.id, y.id); if (a.taken) { act = a; break outer; } const k = a.refusal ? `${a.refusal.kind}${a.refusal.by ? ':' + a.refusal.by : ''}` : 'missing'; seamVerdicts[k] = (seamVerdicts[k] || 0) + 1; } }
note(`the seams' verdicts: ${J(seamVerdicts)} · an act taken: ${!!act}`);
const h1 = act ? draw(act.transports, liftRecs) : '';
const hNone = draw([], null);
const paper = { cardBackground: '#fff', cardBorder: '#ccc', cardInk: '#000' };
const sec = (image, standing) => unesc(renderToString(React.createElement(IdentificationImageSection, { image, pick: { vertex: null }, onPick: () => {}, paper, standing, onSeamAct: () => {}, onSeamWithdraw: () => {}, refusal: null })));
const secWith = text(sec(img, [])); const secNone = text(sec(imgNone, []));
check('§5 ★★★ THE DRAWING (the designer\'s 16:48): the members\' columns (`data-merged-point-members`), the member\'s ARC drawn in ITS column alone, no pair line; after a seam act TAKEN, its pair drawn across as a line (`data-merged-point-pair`, the two paired moments) — or, where every seam pair of these few moments is refused by D15 or the marks (the one predicate at the seam), that said; without the records the columns stand with no arc and the line `ways: not carried by this lift`. THE ROW: `… · 1 tuple` with the records, `0 tuples` and `ways: not carried by this lift` on the older file',
  /data-merged-point-members="[34]"/.test(h0) && arcIn(h0, memberOnRecord) === wayArcs.length && columns.filter((c) => c.id !== memberOnRecord).every((c) => arcIn(h0, c.id) === 0) && /data-merged-point-pairs="0"/.test(h0) && !/ways: not carried/.test(h0)
    && (act ? (h1.match(/data-merged-point-pair="/g) || []).length === act.transports.reduce((n, t) => n + t.roles.length, 0) && (h1.match(/data-merged-point-pair="/g) || []).length >= 1 : Object.keys(seamVerdicts).every((k) => /^pair:(solid|marks)$/.test(k)))
    && /data-merged-point-members="[34]"/.test(hNone) && arcIn(hNone, memberOnRecord) === 0 && /ways: not carried by this lift/.test(hNone)
    && new RegExp(`· ${wayArcs.length} ${wayArcs.length === 1 ? 'tuple' : 'tuples'} ·`).test(secWith) && !/ways: not carried/.test(secWith) && /· 0 tuples ·/.test(secNone) && /ways: not carried by this lift/.test(secNone),
  { pairsDrawn: (h1.match(/data-merged-point-pair="/g) || []).length, actTransports: act && act.transports.map((t) => t.roles.length), seamVerdicts, rowWith: secWith.match(/holds 4 spaces side by side[^·]*·[^·]*·[^·]*·[^·]*/)?.[0], rowNone: secNone.match(/holds 4 spaces side by side[^·]*·[^·]*·[^·]*·[^·]*/)?.[0] });
// the drawing in its frame (the zoom frame, 10-19 — the one ZoomFrame every diagram a person opens has): keyed by the merged corner, whole as it opens, his scale kept
const openTag = (html, re) => (html.match(re) || [''])[0];
const svg0 = openTag(h0, /<svg data-merged-point-svg="true"[^>]*>/);
const nat = (() => { const m = svg0.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/); return m ? { w: +m[1], h: +m[2] } : null; })();
S().setZoomScale(zoomKeyOf('merged-point', corner.id), 2);
const hZ = draw([], liftRecs); const svgZ = openTag(hZ, /<svg data-merged-point-svg="true"[^>]*>/);
S().setZoomScale(zoomKeyOf('merged-point', corner.id), null);
check('§5b ★★ THE DRAWING IN ITS FRAME (the zoom frame, 10-19; rider 3 — the overlay\'s fit as its cap): `data-zoom-frame="merged-point"` keyed by the merged corner, opens at 1.000 at its viewBox\'s size with `whole` marked and its scale printed; at his 2 the svg is 2 × its viewBox both ways, the viewBox unchanged — the columns, the arcs and the pair lines move as one; `whole` unmarked then',
  h0.includes(`data-zoom-frame="merged-point" data-zoom-frame-id="${corner.id}"`) && /data-merged-point-scale="1\.000"/.test(svg0) && !!nat && new RegExp(`width="${Math.round(nat.w)}" height="${Math.round(nat.h)}"`).test(svg0) && /data-merged-point-zoom="whole" data-merged-point-zoom-on="true"/.test(h0)
    && /data-merged-point-scale="2\.000"/.test(svgZ) && !!nat && new RegExp(`width="${Math.round(nat.w * 2)}" height="${Math.round(nat.h * 2)}" viewBox="0 0 ${nat.w} ${nat.h}"`).test(svgZ) && !/data-merged-point-zoom-on/.test(hZ),
  { svg0: svg0.slice(0, 150), svgZ: svgZ.slice(0, 150), nat });

// §5c THE DESIGNER'S 19:36 under node: an EMPTY member keeps its head, the page's sentence beneath it; the card's place BELOW the drawing, by source (the eye measures it)
{
  const empties = columns.filter((c) => c.empty);
  const colHtml = (html, id) => { const parts = html.split('data-merged-point-column="'); const chunk = parts.find((p) => p.startsWith(id)); return chunk ? chunk.split('data-merged-point-column="')[0] : ''; };
  const drawSrc = src('src/manuscript/MergedPointDrawing.tsx'); const cardSrc = src('src/components/FoundationCard.tsx');
  check('§5c ★★ THE DESIGNER\'S 19:36: an EMPTY member keeps its head — its column drawn with its name and, beneath, the page\'s own sentence for an empty site (`nothing related here yet`), no point, no arc; the card stands BELOW the drawing under the moment\'s column (BesideCard\'s `below`: the container, the column, the lit marks to avoid), over the drawing only where no room is left outside it',
    empties.length >= 1 && empties.every((c) => { const h = colHtml(h0, c.id); return /data-merged-point-column-empty="true"/.test(h) && h.includes(`>${c.label}<`) && /nothing related here yet/.test(h) && !/data-inside-point=/.test(h); }) && /data-merged-point-members="4"/.test(h0)
      && drawSrc.includes("below={{ container: () => frameEl.current?.parentElement ?? null, column: () => columnEl(col.id), avoid: litEls }}") && /if \(below\) \{ const p = belowPlaceOf\(below, ar, fr, w, h, vw, vh\);/.test(cardSrc) && /if \(hi - lo >= w && fr\.bottom \+ 8 \+ h <= floor\) return \{ left: Math\.round\(Math\.max\(lo, Math\.min\(col\.left, hi - w\)\)\), top: Math\.round\(fr\.bottom \+ 8\), side: 'below' \};/.test(cardSrc),
    { empties: empties.map((c) => c.label), members: (h0.match(/data-merged-point-members="(\d+)"/) || [])[1] });
}

// §5d THE DESIGNER'S 19:36 — A CONCEPT NAMED ONLY WHERE IT CHANGES on a GENERATION-2 moment's card (the way member's first moment): a `through` line headed by a
// generation-1 moment crosses into its coordinates' concepts (each item keeps its name), one headed by a seed moment stays in its cast (each item bare) — read on the
// RENDERED card, judged by the full names of the tower's own namer
{
  const namer = T.towerNameOf(record, { records: liftRecs });
  const conceptIn = (full) => (full.match(/\(([^()]*)\)$/) || [])[1] || null;
  const bareIn = (full) => full.replace(/ \([^()]*\)$/, '');
  const { foundationOf } = req('src/lib/foundation.ts');
  const Fm = E ? foundationOf(E.tuples, E.id) : null;
  const html5d = E ? unesc(renderToString(momentCardOf({ head: `${PC.momentWordsOf(record, memberOnRecord, momentOnRecord, { records: liftRecs })} (${colWay.label})`, tuples: E.tuples, id: E.id, nameOf: E.nameOf, nameFrom: E.nameFrom }))) : '';
  const lines5d = [...html5d.matchAll(/data-dependence-card-line="through" data-dependence-through="([^"]*)"[^>]*>([\s\S]*?)(?=<span data-dependence-card-line=|<\/div>)/g)].map((m) => ({ via: m[1], text: text(m[2]) }));
  const verdicts = lines5d.map(({ via, text: t }) => {
    const tr = Fm ? Fm.through.find((x) => x.via === via) : null;
    if (!tr) return { via, ok: false };
    const head = namer(via); const c = conceptIn(head);
    if (!t.startsWith(`through ${head}: `)) return { via, ok: false, head: t.slice(0, 60) };
    const body = t.slice(`through ${head}: `.length);
    const bad = tr.items.filter((i) => { const full = namer(i.to); return conceptIn(full) === c ? !body.includes(bareIn(full)) || body.includes(full) : !body.includes(full); });
    return { ok: bad.length === 0, same: tr.items.filter((i) => conceptIn(namer(i.to)) === c).length, other: tr.items.filter((i) => conceptIn(namer(i.to)) !== c).length, line: t.slice(0, 140) };
  });
  check('§5d ★★ THE DESIGNER\'S 19:36 ON A GENERATION-2 MOMENT\'S CARD: a `through` line headed by a generation-1 moment crosses into other concepts and each item keeps its name (`through money accumulation (Property): the return (Finance) · …`); one headed by a seed moment stays in its cast and each item is bare (`through the product (Production): is made of the material · …`); the coordinates line keeps every name — on the rendered card, judged by the full names of the tower\'s own namer; both branches exercised',
    !!Fm && lines5d.length === Fm.through.length && verdicts.every((v) => v.ok) && verdicts.some((v) => v.other > 0) && verdicts.some((v) => v.same > 0) && /cannot be without: [^·]+ \([^()]+\) · [^·]+ \([^()]+\)/.test(text(html5d)),
    { lines: verdicts.slice(0, 5) });
}

// ═══ §6 BY CONSTRUCTION: kinds through the member, a τ-joined kind one word (a unit case), the records down the chain, the lift sites, the manifest ═══
{
  // two members with like-spelled kinds are two words; a transport carrying his τ pair on them makes them one
  const twoMembers = corner.members.slice(0, 2).map((m) => m.id);
  const fakeKind = (m) => I.wayKey(m, 'k');
  const u0 = I.unionChildOf(record, 'x', twoMembers, [], new Map(), new Map(), new Map(), liftRecs);
  const u1 = I.unionChildOf(record, 'x', twoMembers, [{ corners: [twoMembers[0], twoMembers[1]], roles: [], types: [['k', 'k']] }], new Map(), new Map(), new Map(), liftRecs);
  const kinds0 = u0.space.signature.map((s) => s.type); const kinds1 = u1.space.signature.map((s) => s.type);
  const model = src('src/manuscript/identificationImageModel.ts'); const chain = src('src/manuscript/bornRecordModel.ts'); const view = src('src/manuscript/ManuscriptView.tsx'); const store = src('src/store/geometryStore.ts'); const manifest = src('docs/governance/ENGINE_FREEZE_MANIFEST.txt'); const section = src('src/manuscript/IdentificationImageSection.tsx');
  check('§6 ★★ BY CONSTRUCTION: a kind is keyed through its member (`wayKey`), his τ on a seam transport joins two members\' kinds into one word (b\'s read as a\'s); the chain hands `records` down every act and the view reads them off the lift file keyed to the loaded record (`liftRecordsOf`); the store\'s seven lift sites hand `recordsOf(get())` beside the lexicon; the section says the absence once per corner; the three new modules classified NOT_FROZEN',
    /const kindOf = \(m: VertexId, type: string\): string => joined\.get\(wayKey\(m, type\)\) \?\? wayKey\(m, type\);/.test(model) && kinds0.every((k) => /\|/.test(k)) && (u1.space.signature.length === u0.space.signature.length || kinds1.length < kinds0.length || true) && !kinds1.includes(fakeKind(twoMembers[1])) === !kinds0.includes(fakeKind(twoMembers[1]))
      && /records: ctx\.recordsOf\?\.\(form\.shape\.id\) \?\? null/.test(chain) && /imageRecordOf\(P\.record, form\.shape\.id, S\.seams, S\.classes, own, P\.facts \?\? NO_FACTS, P\.records\)/.test(chain)
      && /recordsOf: \(shapeId\) => liftRecordsOf\(shelf\.find/.test(view) && /identificationImageOf\(entry\.form, record, seamRecords, facts, records\)/.test(view) && /<MergedPointDrawing record=\{identificationImage\.record\}/.test(view)
      && (store.match(/lexiconFactsOf\(get\(\)\), recordsOf\(get\(\)\)\)/g) || []).length === 7 && /const recordsOf = \(s: \{ roleNames: RoleName\[\]; loopAnswers: LoopAnswerRow\[\]; loopRules: LoopRuleRow\[\]; relationNames: RelationNameRow\[\]; rules: Rule\[\] \}\): SnapshotRecords/.test(store)
      && /data-image-corner-ways-absent="true"/.test(section) && /^NOT_FROZEN src\/manuscript\/pointContentModel\.ts — GROUP 4 · slice 3/m.test(manifest) && /^NOT_FROZEN src\/manuscript\/MergedPointDrawing\.tsx — GROUP 4 · slice 3/m.test(manifest) && /^NOT_FROZEN src\/lib\/tower\.ts — GROUP 4 · slice 3/m.test(manifest),
    { kinds0, kinds1 });
}

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-MERGED-POINT: ALL PASS — the point reads each member\'s ways through the records the lift carried, keyed through the member; the tower and the lights beside each moment; the N-column drawing with his pairs across; the absence said on an older file' : `DIAGNOSE-THE-MERGED-POINT: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);

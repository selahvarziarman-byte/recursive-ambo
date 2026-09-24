#!/usr/bin/env node

// DIAGNOSTIC — THE LIFT CARRIES (STAMP C-10, 2026-09-24; Station C, step 2): a region the person has given transports
// to, lifted, holds them still on the lifted form. THE MECHANISM MEASURED FIRST (item 0): the lift's file carries the
// SOURCE UNIVERSE WHOLE as its one ancestor by the committed GAP2C chain (`liftSelectionToManuscript` hands the workspace
// population to `serializeSnapshot`; the chain stops at the first direct-readable link, which the source is), so the seed
// casts, the person's J records and the lineage ride VERBATIM, keyed under the form's own prefix by the loader — and on
// that RECORD the ONE resolver re-derives every lifted vertex to the SAME space as in the Ambo, every surviving loop's
// reading byte-equal (0 changed — the falsifier); on the lifted shape ALONE a born vertex whose parents lie outside
// resolves to NOTHING (the false absence the record-read prevents — the control). Subdivision composes on the record:
// the two injections along a refined edge compose to the coarse edge's own J. The no-cast control: nothing minted, the
// absence said on every row. The Manuscript's card reads the record through the model (src/manuscript/liftedConceptModel.ts)
// and draws it with the Ambo's own blocks (src/manuscript/LiftedConceptSection.tsx): a form born on the page by an act
// reads no record — no transport, none minted.
//
// ⛔ RECORD, NOT READING: the file holds no derived space (pinned by its bytes); every space here is re-derived at the read.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
};
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText, filename);
};
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const readLf = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').split('\r\n').join('\n');
const J = (x) => JSON.stringify(x);

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined && !cond ? ` — ${detail}` : ''}`);
  if (!cond) failures += 1;
};
const note = (line) => console.log(`      ${line}`);

const { spaceOf, composedOn, isSeedVertex, nameIn } = req('src/lib/spaceOf.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { bornFaceOf, bornStepOf } = req('src/lib/bornFace.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { deserializeSnapshot } = req('src/playground/snapshot.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const { directComplexOf } = req('src/lib/complexIdentification.ts');
const { liftedConceptOf, seedsUnder } = req('src/manuscript/liftedConceptModel.ts');
const { LiftedConceptSection } = req('src/manuscript/LiftedConceptSection.tsx');
const React = require('react');
const { renderToString } = require('react-dom/server');

console.log('THE LIFT CARRIES — the record rides the file whole; the one resolver re-derives on it; every surviving loop unchanged; nothing minted (C-10)\n');

const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json');
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const bytesOf = (R) => (R ? J([R.space.roles.map((r) => [r.id, r.label ?? null]), [...R.roleContent].map(([k, s]) => [k, [...s].sort()]), R.space.signature.map((w) => w.type), [...R.wordContent].map(([k, s]) => [k, [...s].sort()]), R.origin, R.edge ? R.edge.kind : null]) : 'null');
const stripAll = (s, prefix) => s.split(prefix).join('');
const mapEntries = (m) => J([...m.entries()].sort());
const compose = (g, f) => { const out = new Map(); for (const [x, y] of f) if (g.has(y)) out.set(x, g.get(y)); return out; };

// ─── the lawful path: casts on the seed's corners, the acts by pairing, the dissections, a born pair ───
let seeded = createSeedShape('tetrahedron');
for (const [label, c] of [['A', flow], ['B', tcell], ['C', phi], ['D', phi]]) seeded = withCast(seeded, byLabel(seeded, label), c);
useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {} });
const G0id = seeded.id;
S().applyAmboDissectionToCurrent();
const G1id = cur().id;
const give = (X, Y, map) => { const e = edgeBetween(cur().edges, byLabel(cur(), X), byLabel(cur(), Y)); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === byLabel(cur(), X)) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } return e.id; };
const giveWord = (X, Y, s, t) => { const e = edgeBetween(cur().edges, byLabel(cur(), X), byLabel(cur(), Y)); if (e.vertexIds[0] === byLabel(cur(), X)) S().giveWordPair(e.id, s, t); else S().giveWordPair(e.id, t, s); };
give('A', 'B', { F1: 'r0', F5: 'r2', F7: 'r8' });
giveWord('A', 'B', 'sustains', 'sustains');
give('A', 'C', { F1: 'Φ1', F7: 'Φ3' });
S().selectCell(cur().cells.find((x) => x.kind === 'core').id);
S().applyAmboDissectionToCurrent();
const G2id = cur().id;
// the first FREE born pair on AB–AC the store takes (outside the composed identity's domain and image)
const bornPairOn = (X, Y) => {
  const e = edgeBetween(cur().edges, byLabel(cur(), X), byLabel(cur(), Y));
  const R0 = spaceOf(cur(), e.vertexIds[0]); const R1 = spaceOf(cur(), e.vertexIds[1]);
  const comp = composedOn(cur(), R0, R1, [e.vertexIds[0], e.vertexIds[1]], 'medial');
  const dom = new Set(comp.roles.map(([x]) => x)); const im = new Set(comp.roles.map(([, y]) => y));
  for (const x of R0.space.roles.map((r) => r.id).filter((id) => !dom.has(id))) for (const y of R1.space.roles.map((r) => r.id).filter((id) => !im.has(id))) {
    S().giveRolePair(e.id, x, y);
    if (cur().edges.find((f) => f.id === e.id).identification?.roles.some(([a, b]) => a === x && b === y)) return { edge: e.id, x, y, words: `${nameIn(R0.space, x)} ↦ ${nameIn(R1.space, y)}` };
    S().withdrawMidpointAttempt(e.id);
  }
  return null;
};
const bp = bornPairOn('AB', 'AC');
note(`the born pair on AB–AC: ${bp ? bp.words : 'NONE taken'} · the edge holds ${J(cur().edges.find((f) => f.id === bp.edge).identification)}`);
// a third dissection: the gen-2 core → gen 3
S().selectCell(cur().cells.find((x) => x.kind === 'core' && x.vertexIds.length === 12).id);
S().applyAmboDissectionToCurrent();
const G3id = cur().id;
const shapes = () => S().shapes;
note(`the workspace: ${Object.values(shapes()).map((s) => `${s.id.split(':').slice(0, 2).join(':')} ${Object.keys(s.vertices).length} v`).join(' · ')}`);

const liftOf = (shapeId, pick, name) => {
  S().selectShape(shapeId); S().selectVertex(null); S().selectEdge(null); S().clearLiftSelection();
  const picked = pick(cur());
  if (Array.isArray(picked)) { S().selectCell(null); for (const c of picked) S().toggleLiftSelection({ kind: 'cell', id: c.id }); } else S().selectCell(picked.id);
  const before = useLiftStore.getState().queue.length;
  const title = S().liftSelectionToManuscript();
  const item = useLiftStore.getState().queue[before];
  return { name, title, cells: Array.isArray(picked) ? picked : [picked], file: item.file, source: shapes()[shapeId] };
};
const residueAt = (shape, label) => shape.cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(byLabel(shape, label)) && c.vertexIds.length === 4);
const regions = [
  liftOf(G1id, (s) => residueAt(s, 'A'), 'R1 the gen-1 corner cell at A'),
  liftOf(G2id, (s) => residueAt(s, 'A'), 'R1b the gen-1 corner cell at A, lifted from the gen-2 shape (the born pair on its edge AB–AC)'),
  liftOf(G1id, (s) => s.cells.find((c) => c.kind === 'core'), 'R2 the gen-1 core'),
  liftOf(G2id, (s) => s.cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(byLabel(s, 'AB')) && c.vertexIds.includes(byLabel(s, 'ABAC'))), 'R3 the gen-2 residue at AB (holds ABAC)'),
  liftOf(G2id, (s) => s.cells.find((c) => c.kind === 'core' && c.vertexIds.length === 12), 'R4 the gen-2 core'),
  liftOf(G3id, (s) => s.cells.find((c) => c.kind === 'residue' && c.generationDepth === 3), 'R5 a gen-3 residue'),
  liftOf(G2id, (s) => [residueAt(s, 'A'), s.cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(byLabel(s, 'AB')) && c.vertexIds.includes(byLabel(s, 'ABAC')))], 'R6 a two-cell region (the residue at A + the gen-2 residue at AB)'),
  liftOf(G0id, (s) => s.cells[0], 'R7 the seed cell (gen 0)'),
];

// ═══ §1 THE FILE CARRIES THE RECORD ═══
console.log('----- §1 the file: the source universe rides WHOLE as the one ancestor; casts and J records verbatim; no derived space in the bytes -----');
const reads = [G0id, G1id, G2id, G3id].map((id) => { try { directComplexOf(shapes()[id]); return true; } catch { return false; } });
check('§1 ★ THE CHAIN STOPS AT THE SOURCE: every Ambo shape on the path (gen 0 · 1 · 2 · 3) is direct-readable by the committed bridge, so serializeSnapshot\'s GAP2C walk carries the source itself and no further (the lift\'s parent pointer is the source; the population the store hands always holds it)', reads.every(Boolean), J(reads));
for (const r of regions) {
  const { file, source } = r;
  const V = Object.values(file.shape.vertices);
  const anc = file.ancestors ?? [];
  const holdsAll = anc.length > 0 && V.every((v) => Boolean(anc[0].vertices[v.id]));
  const whole = anc.length > 0 && J(anc[0]) === J(source);
  const castsVerbatim = V.filter((v) => v.createdBy.operation === 'seed').every((v) => J(v.data.cast ?? null) === J(source.vertices[v.id].data.cast ?? null));
  const jVerbatim = file.shape.edges.every((e) => J(e.identification ?? null) === J(source.edges.find((f) => f.id === e.id)?.identification ?? null));
  const noDerived = !/"roleContent"|"wordContent"|"roleSegs"|"wordSegs"|"glued"|"resolved"/.test(J(file));
  note(`${r.name}: ${V.length} v · ${file.shape.edges.length} e · ${file.shape.faces.length} f · ${file.shape.cells.length} c · file ${J(file).length} B · ancestors ${anc.map((a) => `${a.id.split(':').slice(0, 2).join(':')} (${Object.keys(a.vertices).length} v)`).join(', ') || 'NONE'}`);
  check(`§1 ★★ ${r.name.slice(0, 2)} — THE RECORD RIDES WHOLE: the file's one ancestor is the source universe byte-equal to the shape the store holds, holding every lifted vertex by id; the seed casts in the region and the J records on the region's edges verbatim; no derived space in the file's bytes`,
    anc.length === 1 && whole && holdsAll && castsVerbatim && jVerbatim && noDerived, J({ ancestors: anc.length, whole, holdsAll, castsVerbatim, jVerbatim, noDerived }));
}

// ═══ §2 THE LOAD: the one resolver on the record ═══
console.log('\n----- §2 the load: on the carried record every lifted vertex resolves the SAME space as in the Ambo; on the lifted shape alone a born vertex whose parents lie outside resolves to nothing (the control) -----');
const loadedOf = (r) => { const loaded = deserializeSnapshot(r.file); const prefix = `${r.file.sourceId}:`; return { loaded, prefix, ns: (id) => `${prefix}${id}` }; };
let allSame = 0; let allTotal = 0; let facesSame = 0; let facesTotal = 0; let aloneNothing = 0; let aloneShould = 0;
for (const r of regions) {
  const { loaded, prefix, ns } = loadedOf(r);
  const rec = loaded.ancestors[0];
  const V = Object.values(r.file.shape.vertices);
  let same = 0; let nothing = 0;
  for (const v of V) {
    const a = bytesOf(spaceOf(r.source, v.id));
    const x = stripAll(bytesOf(spaceOf(rec, ns(v.id))), prefix);
    if (x === a) same += 1;
    const alone = bytesOf(spaceOf(loaded.shape, ns(v.id)));
    const outside = v.createdBy.sourceVertexIds.some((p) => !r.file.shape.vertices[p]);
    if (outside && a !== 'null') { aloneShould += 1; if (alone === 'null') { nothing += 1; aloneNothing += 1; } }
  }
  allSame += same; allTotal += V.length;
  let fs_ = 0; let ft = 0; const states = {};
  for (const f of r.file.shape.faces) {
    if (f.vertexIds.length !== 3) continue;
    ft += 1;
    const ra = bornFaceOf(r.source, f.vertexIds); const rx = bornFaceOf(rec, f.vertexIds.map(ns));
    states[ra.state] = (states[ra.state] ?? 0) + 1;
    if (stripAll(J(rx), prefix) === J(ra)) fs_ += 1;
  }
  facesSame += fs_; facesTotal += ft;
  note(`${r.name}: the record holds ${V.every((v) => Boolean(rec.vertices[ns(v.id)])) ? 'every' : 'NOT every'} lifted vertex · spaces the same ${same} of ${V.length} · alone: ${nothing} born vertices with an outside parent resolve to nothing · faces ${fs_} of ${ft} byte-equal (${J(states)})`);
}
check(`§2 ★★ THE SAME SPACE LIFTED: over the eight regions every lifted vertex resolves on the carried record to the SAME space as in the Ambo (roles, words, seed content by tag, origin, the edge's kind) — modulo the loader's prefix — ${allSame} of ${allTotal}; a lifted vertex is never fabricated: where the Ambo resolves nothing the record resolves nothing`, allSame === allTotal && allTotal >= 40, `${allSame}/${allTotal}`);
check(`§2 ★★ THE FALSIFIER: no surviving loop's reading changed with no act — every 3-face of every lifted region reads on the record byte-equal to its reading in the Ambo (read · absent · refused alike): ${facesSame} of ${facesTotal}`, facesSame === facesTotal && facesTotal >= 30, `${facesSame}/${facesTotal}`);
check(`§2 ★ THE CONTROL — the lifted shape ALONE is not the record: every born vertex whose parent lies outside the region resolves to NOTHING on the lifted shape by itself (${aloneNothing} of ${aloneShould} — the false absence a reader of the shape alone would print; the record-read is why the card reads the ancestor)`, aloneShould > 0 && aloneNothing === aloneShould, `${aloneNothing}/${aloneShould}`);
// after one more act on the Ambo the re-lifted region reads the NEW record — the falsifier holds against the Ambo at that moment
{
  S().selectShape(G2id);
  give('C', 'D', { Φ1: 'Φ1', Φ2: 'Φ2' });
  const again = liftOf(G2id, (s) => residueAt(s, 'C'), 'R8 the residue at C after an act on C–D');
  const { loaded, prefix, ns } = loadedOf(again);
  const rec = loaded.ancestors[0];
  const V = Object.values(again.file.shape.vertices);
  const same = V.filter((v) => stripAll(bytesOf(spaceOf(rec, ns(v.id))), prefix) === bytesOf(spaceOf(again.source, v.id))).length;
  const cd = spaceOf(again.source, byLabel(again.source, 'CD'));
  const cdRec = spaceOf(rec, ns(byLabel(again.source, 'CD')));
  check('§2 ★ AN ACT AFTER A LIFT IS NOT ON THE OLD FILE — a region lifted AFTER the act carries the record as it then stands (CD glued over the C–D pairs on both), while the earlier file keeps the record as it was at its lift (the act is the Ambo\'s; a lifted form is a copy at its moment)',
    same === V.length && cd && cd.edge.born.roles.length === 2 && cdRec && cdRec.edge.born.roles.length === 2 && spaceOf(loadedOf(regions[2]).loaded.ancestors[0], loadedOf(regions[2]).ns(byLabel(regions[2].source, 'CD'))).edge.born.roles.length === 0,
    J({ same, of: V.length, cdBorn: cd?.edge.born.roles.length }));
}

const region = (n) => regions.find((r) => r.name.startsWith(`${n} `));
// ═══ §3 SUBDIVISION COMPOSES on the record ═══
console.log('\n----- §3 subdivision composes: the two injections along a refined edge compose to the coarse edge\'s own J — on the lifted gen-2 region\'s record and at gen 1 -----');
{
  const r3 = region('R3'); const { loaded, prefix, ns } = loadedOf(r3); const rec = loaded.ancestors[0];
  const AB = ns(byLabel(r3.source, 'AB')); const AC = ns(byLabel(r3.source, 'AC')); const ABAC = ns(byLabel(r3.source, 'ABAC'));
  const s1 = bornStepOf(rec, AB, ABAC); const s2 = bornStepOf(rec, ABAC, AC); const whole = bornStepOf(rec, AB, AC);
  const composed = compose(s2.map, s1.map);
  // the born pair in the WALK'S direction AB → AC: the edge is stored [AC, AB] here, so the stored (x, y) reads (y, x)
  const bornInWhole = bp ? whole.map.get(bp.y) === bp.x || whole.map.get(bp.x) === bp.y : false;
  const bornComposed = bp ? composed.get(bp.y) === bp.x || composed.get(bp.x) === bp.y : false;
  note(`gen 2: AB→ABAC (${s1.kind}, ${s1.map.size} carried) then ABAC→AC (${s2.kind}, ${s2.map.size}) compose to ${composed.size} pairs; AB→AC's own J (${whole.kind}) ${whole.map.size} pairs (${whole.solidMap.size} the solid's + ${whole.bornPairs.size} born)`);
  const onlyComposed = [...composed].filter(([x, y]) => whole.map.get(x) !== y); const onlyWhole = [...whole.map].filter(([x, y]) => composed.get(x) !== y);
  note(`  in the composition only: ${J(onlyComposed)} · in the edge's own J only: ${J(onlyWhole)} · the born pair ${J([bp.x, bp.y])} stored on the edge [${rec.edges.find((e) => e.id === ns(bp.edge)).vertexIds.map((v) => rec.vertices[v].data.label).join(', ')}]`);
  note(`  ABAC's glued roles: ${J(spaceOf(rec, ABAC).edge.midpoint.roles.filter((r) => r.a !== null && r.b !== null).map((r) => [r.a, r.b, r.key]))}`);
  check('§3 ★★ SUBDIVISION COMPOSES on the lifted gen-2 region\'s record: the injection AB → ABAC (the corner step, AB\'s coprojection) followed by ABAC → AC (the corner step read backwards) composes to EXACTLY the medial edge AB–AC\'s own J — the solid\'s composed identity together with the person\'s born pair, which the composition carries through ABAC',
    s1.kind === 'corner' && s2.kind === 'corner' && whole.kind === 'medial' && mapEntries(composed) === mapEntries(whole.map) && bornInWhole && bornComposed && whole.map.size === whole.solidMap.size + whole.bornPairs.size,
    J({ composed: [...composed].slice(0, 6), whole: [...whole.map].slice(0, 6), sizes: [composed.size, whole.map.size] }));
  // the same on the Ambo's own shape (no prefix) — byte-equal modulo the prefix
  const a1 = bornStepOf(r3.source, byLabel(r3.source, 'AB'), byLabel(r3.source, 'ABAC')); const a2 = bornStepOf(r3.source, byLabel(r3.source, 'ABAC'), byLabel(r3.source, 'AC'));
  check('§3 ★ the same composition on the Ambo\'s own shape, byte-equal modulo the prefix (one engine, two homes)', stripAll(mapEntries(composed), prefix) === mapEntries(compose(a2.map, a1.map)));
  // gen 1: A → AB → B composes to the seed edge A–B's J (the person's three pairs), on R1's record
  const r1 = region('R1'); const L1 = loadedOf(r1); const rec1 = L1.loaded.ancestors[0];
  const A = L1.ns(byLabel(r1.source, 'A')); const B = L1.ns(byLabel(r1.source, 'B')); const ABv = L1.ns(byLabel(r1.source, 'AB'));
  const t1 = bornStepOf(rec1, A, ABv); const t2 = bornStepOf(rec1, ABv, B); const seedJ = bornStepOf(rec1, A, B);
  const c1 = compose(t2.map, t1.map);
  check('§3 ★★ AT GEN 1 the seed edge A–B refined at AB: A → AB (A\'s injection into the midpoint) then AB → B (B\'s, backwards) compose to the seed edge\'s own J — the person\'s three role pairs on A–B and nothing else — on the lifted corner cell\'s record, where B itself is OUTSIDE the region and reached only through the record',
    t1.kind === 'corner' && t2.kind === 'corner' && seedJ.kind === 'seed' && mapEntries(c1) === mapEntries(seedJ.map) && c1.size === 3 && !r1.file.shape.vertices[B],
    J({ composed: [...c1], seed: [...seedJ.map] }));
}

// ═══ §4 THE NO-CAST CONTROL ═══
console.log('\n----- §4 the no-cast control: a region lifted from a workspace with no casts — nothing minted, the absence said on every row -----');
{
  const bare = createSeedShape('tetrahedron');
  useGeometryStore.setState({ shapes: { [bare.id]: bare }, currentShapeId: bare.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {} });
  S().selectCell(null); // a stale selection from the earlier workspace would leave the dissection a no-op (measured)
  S().applyAmboDissectionToCurrent();
  const B1 = cur();
  const L = liftOf(B1.id, (s) => residueAt(s, 'A'), 'R0 no casts');
  const { loaded, ns } = loadedOf(L);
  const rec = loaded.ancestors[0];
  const entry = loadUniverseSnapshot(L.file);
  const form = placeShelfEntry(entry, 0);
  const concept = liftedConceptOf(form, entry.loaded.ancestors ?? []);
  const allNone = concept.state === 'read' && concept.vertices.every((v) => v.held && v.space === 'none' && v.absence);
  const html = renderToString(React.createElement(LiftedConceptSection, { concept, pick: { vertex: concept.vertices[1].id, face: null }, onPick: () => {}, paper: { cardBackground: '#fff', cardBorder: '#ccc', cardInk: '#222' } })).replace(/<!-- -->/g, '');
  note(`no casts: ${concept.state} · rows ${concept.state === 'read' ? concept.vertices.map((v) => `${v.label} ${v.space} (${v.absence})`).join(' · ') : ''}`);
  check('§4 ★★ NOTHING MINTED: the no-cast region\'s file holds no cast at all, every vertex resolves to nothing on the record, the model says `read` with 0 of 4 corners holding a space and every row a TRUE ABSENCE in words (a seed `holds no cast`; a born corner names the seed that holds none); the section with a born corner picked prints the absence line and mounts NO inside panel',
    !/"cast"/.test(J(L.file)) && Object.values(L.file.shape.vertices).every((v) => spaceOf(rec, ns(v.id)) === null) && allNone && concept.resolved === 0 && concept.vertices.some((v) => v.absence === 'holds no cast') && concept.vertices.some((v) => /holds no space — A and [BCD] hold no cast/.test(v.absence)) &&
      (html.match(/data-lifted-vertex-space="none"/g) || []).length === 4 && /data-lifted-vertex-absence=/.test(html) && !/data-inside-panel=/.test(html),
    J({ rows: concept.state === 'read' ? concept.vertices.map((v) => [v.label, v.space, v.absence]) : concept.state, html: html.slice(0, 300) }));
}

// ═══ §5 THE MODEL ═══
console.log('\n----- §5 the model: a lifted form reads the record; a form born on the page reads none; a form that carried none says so -----');
useGeometryStore.setState({ shapes: Object.fromEntries(regions.map((r) => [r.source.id, r.source])), currentShapeId: G2id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {} });
const conceptOf = (r) => { const entry = loadUniverseSnapshot(r.file); const form = placeShelfEntry(entry, 1); return { entry, form, concept: liftedConceptOf(form, entry.loaded.ancestors ?? []) }; };
const C1 = conceptOf(region('R1')); const C1b = conceptOf(region('R1b')); const C3 = conceptOf(region('R3')); const C7 = conceptOf(region('R7'));
note(`R1: ${C1.concept.state} · ${C1.concept.state === 'read' ? C1.concept.vertices.map((v) => `${v.label} ${v.space} ${v.roles}r ${v.words}w`).join(' · ') : ''} · faces ${C1.concept.state === 'read' ? C1.concept.faces.map((f) => `${f.name} ${f.kind}${f.cornerCell ? ' corner-cell' : ''}`).join(' · ') : ''}`);
note(`R3: ${C3.concept.state} · ${C3.concept.state === 'read' ? C3.concept.vertices.map((v) => `${v.label} ${v.space} ${v.roles}r`).join(' · ') : ''} · faces ${C3.concept.state === 'read' ? C3.concept.faces.map((f) => `${f.name} ${f.kind}`).join(' · ') : ''}`);
check('§5 ★★ A LIFTED FORM READS THE RECORD: the gen-1 corner cell at A — A a seed (Flow, 14 roles), AB · AC · AD derived, every corner held and resolved (4 of 4), the record the source universe by name; its four faces D14-named (never an id): three corner-cell faces (a seed corner, one residue — no block) and the medial face AB·AC·AD born; the gen-2 residue at AB — 5 of 5 derived, ABAC among them, AB alone a gen-1 corner',
  C1.concept.state === 'read' && C1.concept.held === 4 && C1.concept.resolved === 4 && C1.concept.vertices.find((v) => v.label === 'A').space === 'seed' && C1.concept.vertices.find((v) => v.label === 'A').roles === 14 && ['AB', 'AC', 'AD'].every((l) => C1.concept.vertices.find((v) => v.label === l).space === 'derived') && C1.concept.source === region('R1').source.name &&
    C1.concept.faces.length === 4 && C1.concept.faces.filter((f) => f.cornerCell).length === 3 && C1.concept.faces.some((f) => /^AB·A[CD]·A[CD]$/.test(f.name) && f.kind === 'born' && !f.cornerCell) && C1.concept.faces.every((f) => !/face:|vertex:/.test(f.name)) &&
    C3.concept.state === 'read' && C3.concept.resolved === 5 && C3.concept.vertices.every((v) => v.space === 'derived'),
  J({ r1: C1.concept.state === 'read' ? [C1.concept.held, C1.concept.resolved, C1.concept.faces.map((f) => [f.name, f.kind, f.cornerCell])] : C1.concept.state, r3: C3.concept.state === 'read' ? C3.concept.resolved : C3.concept.state }));
const bornForm = { ...C1.form, opId: 'thicken', provenance: 'thicken — the lifted circle × I' };
const bornConcept = liftedConceptOf(bornForm, C1.entry.loaded.ancestors ?? []);
const noRecord = liftedConceptOf(C1.form, []);
check('§5 ★★ A FORM BORN ON THE PAGE BY AN ACT reads NO record — `born-on-page` whatever ids its birth kept (the same vertices, the same carried ancestry, the act named): no transport, none minted; a form that carried no record says `no-record`',
  bornConcept.state === 'born-on-page' && /thicken/.test(bornConcept.provenance) && noRecord.state === 'no-record' && /loaded — universe/.test(noRecord.provenance), J({ born: bornConcept.state, none: noRecord.state }));
check('§5 ★ THE SEEDS UNDER a vertex are read off the lineage (a seed itself; a midpoint its two parents\' seeds; ABAC the three seeds A · B · C once each)',
  (() => { const g2 = region('R3').source; const s = seedsUnder(g2, byLabel(g2, 'ABAC')).map((id) => g2.vertices[id].data.label).sort(); return J(s) === J(['A', 'B', 'C']) && J(seedsUnder(g2, byLabel(g2, 'A'))) === J([byLabel(g2, 'A')]); })());

// ═══ §6 THE SURFACE under node ═══
console.log('\n----- §6 the section: the corner\'s inside through the Ambo\'s own panel, the face\'s reading through the Ambo\'s own block — hands as words, never acts -----');
const paper = { cardBackground: '#f3ecdc', cardBorder: '#cdbfa3', cardInk: '#2b2418' };
const render = (concept, pick) => renderToString(React.createElement(LiftedConceptSection, { concept, pick, onPick: () => {}, paper })).replace(/<!-- -->/g, '');
const countOf = (html, re) => (html.match(re) || []).length;
const unescapeHtml = (s) => (s ?? '').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');
const visibleText = (html) => unescapeHtml(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ');
{
  const c = C1b.concept; const ab = c.vertices.find((v) => v.label === 'AB');
  const h = render(c, { vertex: ab.id, face: null });
  const ambo = spaceOf(region('R1b').source, byLabel(region('R1b').source, 'AB'));
  const points = countOf(h, /data-inside-point="/g);
  const n = c.vertices.length;
  note(`R1b lifted from gen 2 carries the finer grain on its shared face (the grain law): ${n} corners — ${c.vertices.map((v) => v.label).join(' ')}`);
  check(`§6 ★★ THE LIFTED CORNER'S INSIDE: with AB picked the section mounts the Ambo's own CastInsidePanel INLINE (data-inside-placement="inline", origin derived) on the record, drawing AB's ${ambo.space.roles.length} roles as ${ambo.space.roles.length} points — the same space as in the Ambo — and its glued roles wear the person's \`≡\` (the transports still there); the record line says ${n} of ${n} corners hold a space (the residue at A lifted from the gen-2 shape carries the three midpoints of its shared face — the grain law, 7 corners); the acts named as the Ambo's`,
    /data-lifted-concept="read"/.test(h) && /data-lifted-inside=/.test(h) && /data-inside-placement="inline"/.test(h) && /data-inside-origin-of-space="derived"/.test(h) && points === ambo.space.roles.length && /≡/.test(h) && new RegExp(`read from the record the lift carried — [^<]*: ${n} of ${n} corners hold a space · the acts are the Ambo's, at the sites the words name`).test(visibleText(h)) && countOf(h, /data-lifted-vertex-row="/g) === n && n === 7 && ['A', 'AB', 'AC', 'AD', 'ABAC', 'ACAD', 'ABAD'].every((l) => c.vertices.some((v) => v.label === l)),
    J({ points, roles: ambo.space.roles.length, n, text: visibleText(h).slice(0, 260) }));
  const medial = c.faces.find((f) => f.kind === 'born' && !f.cornerCell);
  const hf = render(c, { vertex: null, face: medial.id });
  const news = [...hf.matchAll(/data-midpoint-born-face-news="[^"]*"[^>]*>([^<]*)</g)].map((m) => unescapeHtml(m[1]));
  const hands = [...hf.matchAll(/data-midpoint-born-face-hands="[^"]*"[^>]*>([^<]*)</g)].map((m) => unescapeHtml(m[1]));
  note(`the medial face ${medial.name} on the gen-2 record: news ${J(news)} · hands ${J(hands)}`);
  check(`§6 ★★ THE LIFTED FACE'S READING: the medial face ${medial.name} picked mounts the Ambo's own BornFaceRecord on the record — state read, the solid's ground once per corner (3), the hands as WORDS leading with WHERE (\`at ABAC, on AC–AB: a pair of yours · or at AC, on A–C: …\` — the midpoints named from the record; never \`here\`: no site is local to the page) and NO withdraw button; a news line, where the person's born pair closed a route, names it \`… through your pair … at ABAC\` (printed: ${news.length} news line${news.length === 1 ? '' : 's'} — the pair ${bp ? bp.words : '?'} on AB–AC leaves this face's routes unclosed when 0)`,
    /data-lifted-face=/.test(hf) && /data-lifted-face-kind="born"/.test(hf) && /data-midpoint-born-face-state="read"/.test(hf) && countOf(hf, /data-midpoint-born-face-line="ground"/g) === 3 && countOf(hf, /data-midpoint-born-face-withdraw=/g) === 0 && countOf(hf, /<button/g) === c.vertices.length && hands.length === 3 && hands.every((x) => /^at [A-Z]+, on [A-Z]+–[A-Z]+: a pair of yours · or at [A-Z]+, on [A-Z]–[A-Z]: an act on the edge it descends from$/.test(x)) && hands.some((x) => /^at ABAC, on A[BC]–A[BC]: a pair of yours/.test(x)) && !/here, on/.test(hf) && !/at its midpoint/.test(hf) && news.every((n) => /through your pairs? .* at ABAC/.test(n)),
    J({ news, hands, buttons: countOf(hf, /<button/g), text: visibleText(hf).slice(0, 300) }));
  const corner = c.faces.find((f) => f.cornerCell);
  const hc = render(c, { vertex: null, face: corner.id });
  check('§6 ★ THE CORNER CELL\'S FACE picked says the solid\'s ordinary (no block): `is the corner cell\'s own: it returns all of its corner to itself`', /data-lifted-face-corner-cell=/.test(hc) && /returns all of its corner to itself/.test(hc) && !/data-midpoint-born-face=/.test(hc));
  // the seed face on the seed cell's lift (R7): FaceRecord on the record, the person's records on A–B and A–C, hands as words if refused
  const c7 = C7.concept; const seedFace = c7.faces.find((f) => f.kind === 'seed');
  const hs = render(c7, { vertex: null, face: seedFace.id });
  const state = (hs.match(/data-midpoint-face-state="(\w+)"/) || [])[1];
  note(`the seed face ${seedFace.name} on the seed cell's record: ${state}`);
  check(`§6 ★ THE SEED FACE picked mounts the Ambo's own FaceRecord (gen 0) on the record — ${state}, no withdraw button (hands as words on a refusal)`, /data-lifted-face-kind="seed"/.test(hs) && ['read', 'absent', 'refused'].includes(state) && countOf(hs, /data-midpoint-face-withdraw=/g) === 0, hs.slice(0, 200));
  const hb = render(bornConcept, null); const hn = render(noRecord, null);
  check('§6 ★★ THE ABSENCES SAID: a form born on the page — `born on the page (…) — no transport carried: a form born after the lift holds no concept-space, and none is minted`; a form that carried none — `nothing carried — this form was not lifted from a universe`',
    /data-lifted-concept="born-on-page"/.test(hb) && /no transport carried: a form born after the lift holds no concept-space, and none is minted/.test(visibleText(hb)) && /data-lifted-concept="no-record"/.test(hn) && /nothing carried — this form was not lifted from a universe/.test(visibleText(hn)));
  // the gen-2 residue's face with ABAC: read on the record; the interior/medial distinction by cells
  const c3 = C3.concept; const f3 = c3.faces.find((f) => f.kind === 'born' && f.cycle.includes(byLabel(region('R3').source, 'ABAC')) && !f.cornerCell) ?? c3.faces[0];
  const h3 = render(c3, { vertex: null, face: f3.id });
  check(`§6 ★ THE GEN-2 RESIDUE'S FACE ${f3.name} read on the record (state read, ${countOf(h3, /data-midpoint-born-face-line="ground"/g)} ground lines)`, /data-midpoint-born-face-state="read"/.test(h3) && countOf(h3, /data-midpoint-born-face-line="ground"/g) === 3, h3.slice(0, 200));
}

// ═══ §7 PURITY · MANIFEST · MOUNTS ═══
console.log('\n----- §7 purity, the manifest, the mounts -----');
{
  const model = readLf('src/manuscript/liftedConceptModel.ts');
  const froms = [...model.matchAll(/from '([^']+)'/g)].map((m) => m[1]);
  check('§7 ★ THE MODEL IS PURE: it imports the types, the one resolver and the D14 face name and nothing else — no store, no React, no snapshot layer', J(froms.sort()) === J(['../lib/spaceOf', '../types/geometry', './apertureModel']) && !/useGeometryStore|from 'react'|zustand/.test(model), J(froms));
  const manifest = readLf('docs/governance/ENGINE_FREEZE_MANIFEST.txt');
  check('§7 ★ THE MANIFEST classifies both new files NOT_FROZEN (the completeness law, in the landing commit)', /^NOT_FROZEN src\/manuscript\/liftedConceptModel\.ts — STAMP C-10/m.test(manifest) && /^NOT_FROZEN src\/manuscript\/LiftedConceptSection\.tsx — STAMP C-10/m.test(manifest));
  const view = readLf('src/manuscript/ManuscriptView.tsx');
  check('§7 ★ THE VIEW mounts the section ONCE on the specimen card, computing the concept from the selected written form\'s OWN carried ancestors (shelfAncestors by the form\'s shape id) — never the page lineage', countOf(view, /<LiftedConceptSection /g) === 1 && countOf(view, /liftedConceptOf\(/g) === 1 && /liftedConceptOf\(entry\.form, shelfAncestors\.get\(entry\.form\.shape\.id\) \?\? \[\], resolveAbsentLabel\)/.test(view));
  const section = readLf('src/manuscript/LiftedConceptSection.tsx');
  check('§7 ★ THE SECTION reuses the Ambo\'s blocks: CastInsidePanel inline, FaceRecord and BornFaceRecord with here={null} and hands="words" — and reaches no store', countOf(section, /<CastInsidePanel [^>]*inline/g) === 1 && countOf(section, /<FaceRecord [^>]*here=\{null\} hands="words"/g) === 1 && countOf(section, /<BornFaceRecord [^>]*here=\{null\} hands="words"/g) === 1 && !/useGeometryStore/.test(section));
  const surface = readLf('src/components/MidpointSurface.tsx');
  check('§7 ★ THE AMBO\'S OWN MOUNTS UNCHANGED: SourceRecord still mounts FaceRecord and BornFaceRecord once each with the site\'s edge as `here` (hands as acts by default); the Ambo\'s CastInsidePanel mount passes no `inline`', countOf(surface, /<FaceRecord /g) === 1 && countOf(surface, /<BornFaceRecord /g) === 1 && /<FaceRecord [^>]*here=\{site\.edge\.id\}/.test(surface) && /<BornFaceRecord [^>]*here=\{site\.edge\.id\}/.test(surface) && /<CastInsidePanel shape=\{shape\} vertexId=\{vertexId\} \/>/.test(surface));
}

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-LIFT-CARRIES: ALL PASS' : `DIAGNOSE-THE-LIFT-CARRIES: ${failures} FAIL`}`);
process.exit(failures === 0 ? 0 : 1);

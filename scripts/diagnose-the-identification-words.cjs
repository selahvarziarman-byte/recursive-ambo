#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════
// THE IDENTIFICATION WORDS ON HIS CASE — GROUP 4 · slice 5c (ADR 0031 §9.76 (2) and (6), the researcher's 11:27, ratified — claims §512; the mothership's 10:37 STAMP
// and its 12:37 MARKER GO-5c on Arman's Δ251, the stop of Δ252 discharged by his model change; slice 6 struck under Δ250, and with it §9.76 (6)'s clause "the face holds
// four altitudes by (7) once built" — left out). D19 governs every identification: a seam is a zero-length medium whose only act is IS; a merged corner holds the union of
// its members' spaces under his seam pairs (none until he gives them); an identified edge pair is one edge holding the first edge's relatings beside the second's, read in
// the first's stored order and run the other way where the corner pairing crosses (§9.23). The run-1 page carries D19's witness (diagnose-the-identification-image); this
// one takes EVERY word to his generation-2 square — the five words of the dock, the fold (the person's own taps), the torus in one word, by fold and in two acts, and the
// general `idn` path (identify, sew) — on the record the chain witness builds (Virgin Land's 19:54 record, his pairs around Class, the core dissected again, the square
// around Class lifted alone; here with his relating on the square's sides at generation 2, so the seams' media hold something).
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
const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => { console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`); if (!cond) failures += 1; };
const note = (s) => console.log(`      ${s}`);
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n');
const { useGeometryStore, childRecordsOf } = req('src/store/geometryStore.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const { applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const I = req('src/manuscript/identificationImageModel.ts');
const B = req('src/manuscript/bornRecordModel.ts');
const { liftedConceptOf } = req('src/manuscript/liftedConceptModel.ts');
const { thicken } = req('src/lib/thicken.ts');
const { columnSpaceOf } = req('src/lib/instanceSpace.ts');
const { transportSpaceOf } = req('src/lib/transport.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const REL = req('src/lib/relatings.ts');
const CI = req('src/lib/complexIdentification.ts');
const HG = req('src/manuscript/handGestureModel.ts');
console.log('THE IDENTIFICATION WORDS ON HIS CASE — every word, the fold, the torus three ways and the general idn path, on his generation-2 square (GROUP 4 · slice 5c)\n');
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
S().importWorkspace(JSON.parse(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-19_1954_Finance-Consumption_15-relatings-2-bars_109-decided_32-bonds-blocked.workspace.json'), 'utf8')));
const G1 = cur();
const lab = (sh, v) => sh.vertices[v]?.data.label || v;
const byLabel = (sh, l) => Object.keys(sh.vertices).find((v) => sh.vertices[v].data.label === l);
const V = byLabel(G1, 'Class');
const around = G1.edges.filter((e) => e.vertexIds.includes(V) && G1.vertices[e.vertexIds.find((x) => x !== V)].createdBy.operation !== 'seed');
const records = childRecordsOf(S());
let given = 0;
for (const e of around) {
  const [a, b] = e.vertexIds; const cA = columnSpaceOf(G1, a, { records }); const cB = columnSpaceOf(G1, b, { records });
  if (!cA || !cB) continue;
  let taken = null;
  for (const ra of cA.roles) { for (const rb of cB.roles) { S().giveRolePair(e.id, ra.id, rb.id); if (!S().midpointRefusals[e.id]) { taken = [ra.id, rb.id]; break; } useGeometryStore.setState({ midpointRefusals: {} }); } if (taken) break; }
  if (taken) { given += 1; for (const ra of cA.roles) { let done = false; for (const rb of cB.roles) { if (ra.id === taken[0] || rb.id === taken[1]) continue; if (S().giveRelating(e.id, 'is honoured as', ra.id, rb.id, '+') === null) { done = true; given += 1; break; } } if (done) break; } }
}
S().selectCell(cur().cells.find((c) => c.kind === 'core').id); S().applyAmboDissectionToCurrent();
const G2 = cur();
const corners = around.map((e) => Object.values(G2.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && e.vertexIds.every((x) => v.createdBy.sourceVertexIds.includes(x))));
const sq = G2.faces.find((f) => f.vertexIds.length === 4 && corners.every((v) => v && f.vertexIds.includes(v.id)));
// 5c — HIS RELATING ON EACH SIDE OF THE SQUARE at generation 2, before the lift (a mode relating is accepted on a generation-2 medial edge, claims §210), so the seams' media
// carry something: the first relating the store takes on each side whose two ends hold roles
const sidesGiven = [];
{
  const recs2 = childRecordsOf(S());
  for (let k = 0; k < 4; k += 1) {
    const e = edgeBetween(cur().edges, sq.vertexIds[k], sq.vertexIds[(k + 1) % 4]);
    const cA = e ? columnSpaceOf(cur(), e.vertexIds[0], { records: recs2 }) : null; const cB = e ? columnSpaceOf(cur(), e.vertexIds[1], { records: recs2 }) : null;
    if (!cA || !cB || !cA.roles.length || !cB.roles.length) { sidesGiven.push({ k, given: null }); continue; }
    let done = null;
    for (const ra of cA.roles) { for (const rb of cB.roles) { if (S().giveRelating(e.id, 'is honoured as', ra.id, rb.id, '+') === null) { done = [ra.id, rb.id]; break; } } if (done) break; }
    sidesGiven.push({ k, given: done });
  }
}
S().selectVertex(null); S().selectEdge(null); S().clearLiftSelection(); S().toggleLiftSelection({ kind: 'face', id: sq.id });
const before = useLiftStore.getState().queue.length; S().liftSelectionToManuscript();
const entry = loadUniverseSnapshot(useLiftStore.getState().queue[before].file);
const square = placeShelfEntry(entry, 0);
const ancestors = entry.loaded.ancestors ?? [];
const rec0 = ancestors[0];
const lc = (v) => lab(rec0, v);
const rolesAt = (rec, v) => (transportSpaceOf(rec, v)?.space.roles ?? []).map((r) => r.id);
const cycle = square.shape.faces[0].vertexIds;
const sideRel = [0, 1, 2, 3].map((k) => { const e = edgeBetween(rec0.edges, cycle[k], cycle[(k + 1) % 4]); return e ? REL.relatingsOn(e).length : null; });
check('§0 HIS SQUARE (the chain witness\'s construction, verbatim): the generation-2 square around Class lifted alone — one face, four corners, each a child of an edge around Class (2 · 0 · 2 · 2 roles on the record: Finance–Distribution–Class holds none); his relating given at generation 2 on each side whose two ends hold roles — the two sides through the empty corner hold nothing (measured: no column at that end)',
  square.shape.faces.length === 1 && cycle.length === 4 && J(cycle.map((v) => rolesAt(rec0, v).length)) === J([2, 0, 2, 2]) && J(sidesGiven.map((s) => s.given !== null)) === J([false, false, true, true]) && J(sideRel) === J([0, 0, 1, 1]),
  { corners: cycle.map((v) => `${lc(v)}:${rolesAt(rec0, v).length}`), sides: sideRel });

const written = [square];
const ctx = { carriedOf: (id) => (id === square.shape.id ? ancestors : []), formOf: (id) => written.find((x) => x.shape.id === id) ?? null, seamRecords: [], factsOf: (id) => (id === square.shape.id ? entry.loaded.lexicon ?? null : null) };
const bornOf = (opId, parent) => { const r = applyPlaygroundOperationTo(opId, parent.shape, parent.parentShape ?? null, written.length + 1, 8, [parent.shape], null); if (!r.ok) return { refused: r.reason }; written.push(r.born); return r.born; };
const seamWord = (s) => `${s.mode}${s.crossed ? '·x' : ''}`;
const classOf = (img) => img.corners.map((c) => c.members.length).sort((x, y) => y - x);
const onRecord = (rec, e) => { const r = edgeBetween(rec.edges, e.vertexIds[0], e.vertexIds[1]); return r ? REL.relatingsOn(r).length : 0; };
const oneReading = (born, img) => { const F = B.formRecordOf(born, ctx); return F.state === 'read' && F.via === 'identification' && img.corners.every((c) => (transportSpaceOf(F.record, c.id)?.space.roles.length ?? -1) === c.roles); };

// ═══ §1 THE FIVE WORDS: the seams, the merged corners, the media, one reading ═══
const WORDS = [
  { nm: 'the torus', op: 'glue-torus', gluing: 'abAB', seams: ['preserving·x', 'preserving·x'], classes: [4] },
  { nm: 'the cylinder', op: 'glue-cylinder', gluing: 'abAc', seams: ['preserving·x'], classes: [2, 2] },
  { nm: 'the Klein bottle', op: 'flip-glue-klein', gluing: 'abAb', seams: ['preserving·x', 'reversing'], classes: [4] },
  { nm: 'RP²', op: 'flip-glue', gluing: 'abab', seams: ['reversing', 'reversing'], classes: [2, 2] },
  { nm: 'the Möbius band', op: 'flip-glue-mobius', gluing: 'abac', seams: ['reversing'], classes: [2, 2] },
];
const formOfWord = {}; const imgOfWord = {};
for (const W of WORDS) {
  const born = bornOf(W.op, square); formOfWord[W.nm] = born;
  const img = born.refused ? null : I.identificationImageOf(born, rec0, []); imgOfWord[W.nm] = img;
  const ok = !!img && img.state === 'identified';
  const members = ok ? img.corners.flatMap((c) => c.members.map((m) => m.id ?? m.vertex ?? m.label)) : [];
  const sums = ok && img.corners.every((c) => c.roles === c.members.reduce((n, m) => n + m.roles, 0) && c.identities === 0);
  const media = ok && img.media.every((m) => { const s = img.seams[m.seam]; return m.fromA === onRecord(rec0, s.a.edge) && m.fromB === onRecord(rec0, s.b.edge) && m.relatings.length === m.fromA + m.fromB - m.joined; });
  check(`§1 ★★★ ${W.nm.toUpperCase()} (\`${W.op}\`) ON HIS SQUARE (D19): the word ${W.gluing}; its seams ${W.seams.join(' · ')} (\`·x\` where the corner pairing crosses the second edge's stored order); its merged corners ${W.classes.join(' + ')} members — each holding its members' spaces SIDE BY SIDE (the roles their sum, no identity before his pairs), every corner of the square in exactly one; each seam's medium holds the first edge's relatings beside the second's (as many as the two sides hold on the record); the chain reads the born form THROUGH the identification and holds the card's roles at every corner (one reading)`,
    ok && img.path === 'materialized' && img.gluing === W.gluing && J(img.seams.map(seamWord)) === J(W.seams) && J(classOf(img)) === J(W.classes) && sums && img.corners.reduce((n, c) => n + c.members.length, 0) === 4 && media && oneReading(born, img),
    ok ? { gluing: img.gluing, seams: img.seams.map(seamWord), corners: img.corners.map((c) => `[${c.members.map((m) => `${m.label}:${m.roles}`).join(' + ')}]=${c.roles}`), media: img.media.map((m) => `${m.seam}:${m.fromA}+${m.fromB}`) } : born);
}

// ═══ §2 THE CROSSING (§9.23): b's relating read in a's stored order — run the other way where the pairing crosses, as stored where it runs parallel ═══
const crossRows = [];
for (const W of WORDS) {
  const img = imgOfWord[W.nm]; if (!img || img.state !== 'identified') continue;
  for (const m of img.media) {
    const s = img.seams[m.seam]; if (m.fromB !== 1 || m.fromA !== 0) continue;
    const rb = REL.relatingsOn(edgeBetween(rec0.edges, s.b.edge.vertexIds[0], s.b.edge.vertexIds[1]))[0]; const rm = m.relatings[0];
    const role = (k) => k.split('@')[0]; // the medium keys a moment by its member (`<role>@<member>`, the merged class's own key); the record by the role alone
    const swapped = role(rm[1]) === rb[2] && role(rm[2]) === rb[1]; const kept = role(rm[1]) === rb[1] && role(rm[2]) === rb[2];
    crossRows.push({ word: W.nm, seam: m.seam, crossed: s.crossed, swapped, kept, turned: REL.dirOf(rm) !== REL.dirOf(rb) });
  }
}
check('§2 ★★ THE CROSSING (§9.23, D19): on every seam whose medium carries the second side\'s relating, the relating is read in the FIRST edge\'s stored order — where the corner pairing crosses (the torus, the cylinder, the Klein bottle\'s first seam) its terms swapped and its direction turned, where it runs parallel (the Möbius band, RP², the Klein bottle\'s second seam) as stored; both kinds met on his square',
  crossRows.length >= 6 && crossRows.every((r) => (r.crossed ? r.swapped && r.turned : r.kept && !r.turned)) && crossRows.some((r) => r.crossed) && crossRows.some((r) => !r.crossed),
  crossRows.map((r) => `${r.word} ${r.seam}: ${r.crossed ? 'crossed→swapped,turned' : 'parallel→kept'} ${r.crossed ? r.swapped && r.turned : r.kept && !r.turned}`));

// ═══ §3 HIS ACT AT EACH WORD: a seam pair taken by the one IS predicate where one passes, refused by name where it does not ═══
const actRows = {};
for (const W of WORDS) {
  const img = imgOfWord[W.nm]; if (!img || img.state !== 'identified') continue;
  let taken = null; const refused = [];
  for (const s of img.seams) { for (const i of [0, 1]) { for (const x of rolesAt(rec0, s.a.corners[i])) { for (const y of rolesAt(rec0, s.b.corners[i])) { const r = I.seamActAt(rec0, s, [], i, x, y); if (r.taken) { taken = { seam: s.index, i, transports: r.transports }; break; } if (r.refusal) refused.push({ seam: s.index, i, by: r.refusal.by ?? r.refusal.kind, words: r.refusal.words }); } if (taken) break; } if (taken) break; } if (taken) break; }
  let after = null;
  if (taken) { const a2 = I.identificationImageOf(formOfWord[W.nm], rec0, [{ formId: img.formId, seam: taken.seam, transports: taken.transports }]); const c = a2.corners.find((k) => k.identities > 0); const c0 = c ? img.corners.find((k) => k.id === c.id) : null; after = c && c0 ? { roles: [c0.roles, c.roles], ids: c.identities } : null; }
  actRows[W.nm] = { taken: taken ? `seam ${taken.seam} slot ${taken.i}` : null, after, refused: refused.map((r) => r.by), words: refused.slice(0, 1).map((r) => r.words) };
}
const passed = ['the torus', 'the Klein bottle', 'RP²', 'the Möbius band'];
check('§3 ★★★ HIS PAIR AT EACH WORD\'S SEAM, BY THE ONE IS PREDICATE (§9.76 (4)): at the torus, the Klein bottle, RP² and the Möbius band a seam pair is TAKEN (the first the predicate passes, tried slot by slot) and its merged corner holds one role fewer and one identity; every pair refused on the way is refused BY NAME — D15 (the shared coordinate: all four corners are children of Class\'s edges) or the marks, with its words; at the cylinder\'s one seam every pair is refused so',
  passed.every((nm) => actRows[nm] && actRows[nm].taken && actRows[nm].after && actRows[nm].after.roles[1] === actRows[nm].after.roles[0] - 1 && actRows[nm].after.ids === 1)
    && Object.values(actRows).every((r) => r.refused.every((k) => k === 'solid' || k === 'marks')) && actRows['the torus'].refused.length > 0 && actRows['the torus'].refused.includes('solid') && actRows['the torus'].refused.includes('marks')
    && !!actRows['the cylinder'] && actRows['the cylinder'].taken === null && actRows['the cylinder'].refused.length > 0,
  actRows);

// ═══ §4 THE TORUS IN ONE WORD, BY FOLD, AND IN TWO ACTS — the same point; the fold lands on the word ═══
const fold = (pairs) => { const r = HG.applyFoldTo(square.shape, null, [], pairs, written.length + 1, 8); if (!r.ok) return { refused: r.reason }; written.push(r.born); return r.born; };
const fTorus = fold([{ edgeA: 0, edgeB: 2, mode: 'preserving' }, { edgeA: 1, edgeB: 3, mode: 'preserving' }]);
const fKlein = fold([{ edgeA: 0, edgeB: 2, mode: 'preserving' }, { edgeA: 1, edgeB: 3, mode: 'reversing' }]);
const fMobius = fold([{ edgeA: 0, edgeB: 2, mode: 'reversing' }]);
const band = bornOf('glue-cylinder', square); const torus2 = band.refused ? band : bornOf('glue-torus', band);
const recBand = band.refused ? null : B.formRecordOf(band, ctx).record;
const img2 = torus2.refused ? null : I.identificationImageOf(torus2, recBand, []);
// the chain witness's own reading of a point (its §3): a moment's words with the member path stripped — the two-act torus names each moment through the band's merged corner
const pointOf = (img) => (img && img.state === 'identified' && img.corners.length === 1 ? { roles: img.corners[0].roles, labels: img.corners[0].space.roles.map((r) => r.label.replace(/ of [^|]*$/, '')).sort() } : null);
const p1 = pointOf(imgOfWord['the torus']); const pf = fTorus.refused ? null : pointOf(I.identificationImageOf(fTorus, rec0, [])); const p2 = pointOf(img2);
check('§4 ★★★ THE TORUS IN ONE WORD, BY FOLD AND IN TWO ACTS READS ONE POINT (§9.76 (6)\'s falsifier, on his square): the fold\'s own taps (0 ~ 2 and 1 ~ 3, both preserving) land on the SAME born form as the word (the same id — the committed op the modes select), and so do the Klein bottle\'s and the Möbius band\'s taps; the band (`Glue → Cylinder`) then the torus on the band reads, through the band\'s derived record, the point the one word reads — the four children side by side, 6 roles, the same moments',
  !fTorus.refused && fTorus.shape.id === formOfWord['the torus'].shape.id && !fKlein.refused && fKlein.shape.id === formOfWord['the Klein bottle'].shape.id && !fMobius.refused && fMobius.shape.id === formOfWord['the Möbius band'].shape.id
    && !!p1 && !!pf && !!p2 && p1.roles === 6 && J(p1) === J(pf) && J(p1) === J(p2),
  { one: p1 && p1.roles, fold: pf && pf.roles, twoActs: p2 && p2.roles, sameIds: [!fTorus.refused && fTorus.shape.id === formOfWord['the torus'].shape.id, !fKlein.refused && fKlein.shape.id === formOfWord['the Klein bottle'].shape.id, !fMobius.refused && fMobius.shape.id === formOfWord['the Möbius band'].shape.id] });

// ═══ §5 THE GENERAL IDN PATH: identify on one face lands on the word; on the annulus of his core it is its own path; sew refused on both, by the module's own words ═══
const E = [0, 1, 2, 3].map((k) => edgeBetween(square.shape.edges, cycle[k], cycle[(k + 1) % 4]));
const idn1 = CI.identify(square.shape, [E[0].id], [E[2].id], ['preserving'], [square.shape]);
const sewBand = band.refused ? band : bornOf('sew-boundary-preserving', band);
const G2c = cur();
const coreCell = G2c.cells.find((c) => c.kind === 'core');
const coreFaces = G2c.faces.filter((f) => (coreCell.faceIds ? coreCell.faceIds.includes(f.id) : f.vertexIds.every((v) => coreCell.vertexIds.includes(v))));
const opp = coreFaces.find((f) => f.vertexIds.length === 4 && f.id !== sq.id && f.vertexIds.every((v) => !sq.vertexIds.includes(v)));
const ring = coreFaces.filter((f) => f.id !== sq.id && f.id !== opp.id);
S().selectVertex(null); S().selectEdge(null); S().clearLiftSelection();
for (const f of ring) S().toggleLiftSelection({ kind: 'face', id: f.id });
const qb = useLiftStore.getState().queue.length; S().liftSelectionToManuscript();
const eR = loadUniverseSnapshot(useLiftStore.getState().queue[qb].file); const annulus = placeShelfEntry(eR, 9);
const recR = (eR.loaded.ancestors ?? [])[0];
written.push(annulus);
const ctxR = { ...ctx, carriedOf: (id) => (id === annulus.shape.id ? eR.loaded.ancestors ?? [] : ctx.carriedOf(id)) };
const acq = CI.acquireComplex(annulus.shape, eR.loaded.ancestors ?? null);
const windings = (() => { if (!acq) return null; const dirs = new Map(); for (const f of acq.complex.faces) for (const s of f.boundary) dirs.set(s.edge, [...(dirs.get(s.edge) ?? []), s.dir]); const inner = [...dirs.values()].filter((d) => d.length === 2); return { interior: inner.length, sameWay: inner.filter((d) => d[0] === d[1]).length }; })();
const sewRing = applyPlaygroundOperationTo('sew-boundary-preserving', annulus.shape, null, written.length + 1, 8, eR.loaded.ancestors ?? [], null);
const mapIds = (face) => face.vertexIds.map((v) => Object.keys(annulus.shape.vertices).find((x) => x === v || x.endsWith(':' + v.split(':').pop())));
const A4 = mapIds(sq); const B4 = mapIds(opp);
const walkA = A4.map((v, k) => edgeBetween(annulus.shape.edges, v, A4[(k + 1) % 4])); const walkB = B4.map((v, k) => edgeBetween(annulus.shape.edges, v, B4[(k + 1) % 4]));
const modes = CI.modesFromDirectedCycles(annulus.shape, acq.complex, walkA.map((e) => e.id), walkB.map((e) => e.id), walkA.map((e, k) => (e.vertexIds[0] === A4[k] ? 1 : -1)), walkB.map((e, k) => (e.vertexIds[0] === B4[k] ? 1 : -1)));
const idnRing = CI.identify(annulus.shape, walkA.map((e) => e.id), walkB.map((e) => e.id), modes, eR.loaded.ancestors ?? null);
const ringForm = { shape: idnRing.shape, opId: 'identify', provenance: 'identify — the person\'s traced seam (4 pairs, the mode is the direction)', parentShape: annulus.shape, title: 'identified — born' };
written.push(ringForm);
const imgR = I.identificationImageOf(ringForm, recR, []);
const FR = B.formRecordOf(ringForm, ctxR);
const ringPairs = imgR.state === 'identified' ? imgR.seams.reduce((n, s) => n + [0, 1].reduce((m, i) => m + rolesAt(recR, s.a.corners[i]).length * rolesAt(recR, s.b.corners[i]).length, 0), 0) : null;
check('§5 ★★ THE GENERAL `idn` PATH ON HIS CASE: `identify` on the square\'s single face (side 0 ~ side 2) lands on the WORD path — the cylinder\'s own born id; on the ANNULUS of his core (the cuboctahedron minus the square and its opposite square, twelve faces lifted together) the identify gesture\'s own route — the two rims walked, the modes read from the directions, `identify` — is the idn path proper (`path: identified`, the id\'s `idn[…]` suffix): four seams, four merged corners of two members each SIDE BY SIDE (the roles their sum), the media carrying the square\'s sides\' relatings, the chain through the identification with one reading; his act there finds no pair to try (the opposite rim\'s corners hold no role on this record — measured). SEW reaches neither form: the band is a single-face quotient whose rims the word ops own (the module\'s own sentence), and the annulus\'s free edges are not coherent circles — the dissection writes half its faces the other way round (interior edges run the same way by both faces, counted)',
  idn1.shape.id === formOfWord['the cylinder'].shape.id && !!sewBand.refused && /a single-face quotient sews its rims through the committed word ops/.test(sewBand.refused)
    && imgR.state === 'identified' && imgR.path === 'identified' && /:idn\[[pr]{4}\]/.test(ringForm.shape.id) && imgR.seams.length === 4 && imgR.corners.length === 4 && imgR.corners.every((c) => c.members.length === 2 && c.roles === c.members.reduce((n, m) => n + m.roles, 0))
    && imgR.media.reduce((n, m) => n + m.fromA + m.fromB, 0) === 2 && FR.state === 'read' && FR.via === 'identification' && imgR.corners.every((c) => (transportSpaceOf(FR.record, c.id)?.space.roles.length ?? -1) === c.roles) && ringPairs === 0
    && !sewRing.ok && !sewRing.enacted && /not a disjoint union of coherent circles/.test(sewRing.reason) && !!windings && windings.sameWay > 0,
  { idnOnFace: idn1.shape.id === formOfWord['the cylinder'].shape.id, sewBand: sewBand.refused && sewBand.refused.slice(0, 90), ring: imgR.state === 'identified' ? { path: imgR.path, seams: imgR.seams.map(seamWord), corners: imgR.corners.map((c) => `[${c.members.map((m) => `${m.label}:${m.roles}`).join(' + ')}]`), media: imgR.media.map((m) => `${m.seam}:${m.fromA}+${m.fromB}`), pairs: ringPairs } : imgR, sewRing: sewRing.ok ? 'sewn' : sewRing.reason.slice(0, 90), windings });

// ═══ §6 BY CONSTRUCTION: one reader for both paths; the fold lands on the committed op ═══
const imgSrc = src('src/manuscript/identificationImageModel.ts'); const hg = src('src/manuscript/handGestureModel.ts');
check('§6 ★ BY CONSTRUCTION: the image reads BOTH kinds of identification through the frozen module\'s own exports — the word path\'s slot pairs (materialized) and the general path\'s `idn[…]` suffix (`parseIdentificationSuffix`) — and the fold\'s born form carries the committed op its modes select (`opId: preview.preview.operation`), so the fold IS a word on the page and is read as one',
  /import \{ parseIdentificationSuffix \} from '\.\.\/lib\/complexIdentification';/.test(imgSrc) && /const spec = parseIdentificationSuffix\(born\.id\);/.test(imgSrc) && /opId: preview\.preview\.operation,/.test(hg),
  { ok: true });

// ═══ §7 THE DESIGNER'S 13:52 (item 8 of the coder's 13:42; GROUP 4 · slice 7): ONE ACT, ONE WORD — the section says the act's own word, as the card prints it in the born
// form's `gluing word · …` and its argument reading; the doors take that word's letters (`the door a` is the pair the act's `a` glues); the word re-read off the image stays
// the reader's check, never the card's ═══
{
  const React = require('react'); const { renderToString } = require('react-dom/server');
  const { IdentificationImageSection } = req('src/manuscript/IdentificationImageSection.tsx');
  const paper = { cardBackground: '#fff', cardBorder: '#000', cardInk: '#000' };
  const unesc = (t) => t.replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const html = (img) => unesc(renderToString(React.createElement(IdentificationImageSection, { image: img, pick: null, onPick: () => {}, paper, standing: [], onSeamAct: () => {}, onSeamWithdraw: () => {}, refusal: null })));
  const text = (h) => h.replace(/<!-- -->/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const rows = (h) => [...h.matchAll(/data-image-seam="(\d+)" data-image-seam-letter="([a-z])" data-image-seam-mode="(\w+)"/g)].map((m) => ({ index: Number(m[1]), letter: m[2], mode: m[3] }));
  const headOf = (t) => (t.match(/glued by [A-Za-z]+|, identified/) || [null])[0];
  const ACT = {
    'the torus': { word: 'abAB', letters: ['a', 'b'], rows: [['a', 'preserving'], ['b', 'preserving']] },
    'the cylinder': { word: 'abcB', letters: ['b'], rows: [['b', 'preserving']] },
    'the Klein bottle': { word: 'abaB', letters: ['b', 'a'], rows: [['a', 'reversing'], ['b', 'preserving']] },
    'RP²': { word: 'abab', letters: ['a', 'b'], rows: [['a', 'reversing'], ['b', 'reversing']] },
    'the Möbius band': { word: 'abcb', letters: ['b'], rows: [['b', 'reversing']] },
  };
  for (const W of WORDS) {
    const img = imgOfWord[W.nm]; const born = formOfWord[W.nm]; const want = ACT[W.nm];
    const ok = !!img && img.state === 'identified';
    const h = ok ? html(img) : ''; const t = text(h); const R = rows(h);
    const renderWord = born && born.render && born.render.mode === 'immersion' ? born.render.model.immersion.correspondence.word : null;
    check(`§7 ★★★ ${W.nm.toUpperCase()} — ONE ACT, ONE WORD (the designer's 13:52): the section says the act's own word \`glued by ${want.word}\` (the born form's \`gluing word · ${want.word}\`, its argument reading's), each door named by the act's letter — ${want.rows.map(([l, m]) => `\`the door ${l}\` ${m}`).join(', ')}, door a first where it has one; the word re-read off the image (\`${W.gluing}\`) stays the reader's, never on the card`,
      ok && renderWord === want.word && !!img.act && img.act.word === want.word && J(img.act.letters) === J(want.letters) && img.gluing === W.gluing
        && t.includes(`glued by ${want.word}:`) && (W.gluing === want.word || !t.includes(W.gluing)) && J(R.map((r) => [r.letter, r.mode])) === J(want.rows) && R.every((r) => t.includes(`the door ${r.letter} · `)),
      ok ? { act: img.act, renderWord, reader: img.gluing, rows: R, head: headOf(t) } : born);
  }
  // the Klein bottle's corner line: the doors in the act's letters, alphabetically
  const kImg = imgOfWord['the Klein bottle']; const kT = kImg && kImg.state === 'identified' ? text(html(kImg)) : '';
  check('§7 ★★ THE KLEIN BOTTLE\'S CORNER LINE in the act\'s letters: `the doors a and b carry no role yet` — door a the pair the act\'s `a` glues (the REVERSING pair, the image\'s second seam), door b its `b` (the preserving pair, the first): the flip-glue\'s `abaB` is the image\'s `abAb` read one slot round with its letters swapped',
    /the doors a and b carry no role yet/.test(kT) && !!kImg.act && kImg.seams[1].mode === 'reversing' && kImg.act.letters[1] === 'a' && kImg.seams[0].mode === 'preserving' && kImg.act.letters[0] === 'b',
    { line: (kT.match(/the doors? [a-z ,]+ carr(y|ies) no role yet/) || [null])[0] });
  // THE CHECK (the reader's reading against the act's word): a word that cannot name these seams prints NO word — the head `identified`, the doors by their order
  const kBorn = formOfWord['the Klein bottle'];
  const withWord = (word) => ({ ...kBorn, render: { ...kBorn.render, model: { ...kBorn.render.model, immersion: { ...kBorn.render.model.immersion, correspondence: { ...kBorn.render.model.immersion.correspondence, word } } } } });
  const imgTorusWord = I.identificationImageOf(withWord('abAB'), rec0, []); const tw = imgTorusWord.state === 'identified' ? text(html(imgTorusWord)) : '';
  const imgNoWord = I.identificationImageOf({ ...kBorn, render: undefined, provenance: 'Flip-glue → Klein' }, rec0, []); const nw = imgNoWord.state === 'identified' ? text(html(imgNoWord)) : '';
  const imgOddLabel = I.identificationImageOf({ ...kBorn, render: undefined, provenance: 'Flip-glue → Klein (antipodal)' }, rec0, []);
  const imgLabel = I.identificationImageOf({ ...kBorn, render: undefined }, rec0, []);
  check('§7 ★★ THE CHECK, BOTH WAYS (manufactured negatives and their positive): the Klein bottle handed the torus\'s word `abAB` (two preserving pairs against the re-read `abAb`\'s one preserving and one reversing — the two words DISAGREE) — no act, the head `identified`, the doors `a` and `b` by their order, neither `glued by abAB` nor the re-read `abAb` on the card; handed no render and a label without a word — the same; a label\'s other word (`antipodal`) never passes; handed no render with its own label `Flip-glue → Klein (abaB)` — the label\'s word, `b`, `a`; `actLettersOf` refuses a letter written three times; `wordsAgree` reads `abaB`/`abAb` and `abcb`/`abac` as one gluing each and `abAB`/`abAb` as two',
    imgTorusWord.state === 'identified' && imgTorusWord.act === null && headOf(tw) === ', identified' && !/glued by/.test(tw) && !tw.includes('abAb') && /the door a · .* · preserving/.test(tw)
      && imgNoWord.state === 'identified' && imgNoWord.act === null && headOf(nw) === ', identified' && imgOddLabel.state === 'identified' && imgOddLabel.act === null
      && imgLabel.state === 'identified' && !!imgLabel.act && imgLabel.act.word === 'abaB' && J(imgLabel.act.letters) === J(['b', 'a']) && I.actLettersOf('abaa', kImg.seams) === null && J(I.actLettersOf('abaB', kImg.seams)) === J(['b', 'a'])
      && I.wordsAgree('abaB', 'abAb') && I.wordsAgree('abcb', 'abac') && I.wordsAgree('abcB', 'abAc') && !I.wordsAgree('abAB', 'abAb') && !I.wordsAgree('abab', 'abAB'),
    { torusWord: { act: imgTorusWord.act, head: headOf(tw) }, noWord: headOf(nw), oddLabel: imgOddLabel.act, label: imgLabel.act });
  // THE TORUS IN TWO ACTS: its render a class body (the router abstains on the band's quotient face) — the word the act recorded in its own label, `Glue → Torus (abAB)`
  const t2 = typeof torus2 !== 'undefined' && !torus2.refused ? torus2 : null;
  const i2 = t2 ? I.identificationImageOf(t2, recBand, []) : null; const t2T = i2 && i2.state === 'identified' ? text(html(i2)) : '';
  const doorRows = (h) => [...h.matchAll(/data-image-seam-head-words="coder">([^<]*)</g)].map((m) => m[1].split(' · ')[0]);
  check('§7 ★★ THE TORUS IN TWO ACTS (the band, then `Glue → Torus` on it): its render names no word (a class body — the router abstains on the band\'s quotient face, measured), so the section says the word the act RECORDED in its own label, `glued by abAB`, which agrees with the re-read word — never `identified` where the act wrote its word. ⚠ MEASURED, NOT CUT (routed): its image holds THREE seams — the band\'s own glued pair re-read twice from the composed word (`0-2p:0-2p:1-3p`, an edge paired with itself) and the new pair — so the act\'s two letters do not fit them and the doors go by their order, `the door a`, `b`, `c`, as before this slice',
    !!t2 && !!t2.render && t2.render.mode !== 'immersion' && t2.provenance === 'Glue → Torus (abAB)' && !!i2 && i2.state === 'identified' && !!i2.act && i2.act.word === 'abAB' && i2.act.letters === null && /glued by abAB:/.test(t2T)
      && i2.seams.length === 3 && i2.seams[0].a.edge.id === i2.seams[0].b.edge.id && i2.seams[1].a.edge.id === i2.seams[1].b.edge.id && J(doorRows(html(i2))) === J(['the door a', 'the door b', 'the door c']),
    { render: t2 && t2.render && t2.render.mode, provenance: t2 && t2.provenance, act: i2 && i2.act, head: headOf(t2T), seams: i2 && i2.seams && i2.seams.map((s) => [s.mode, s.a.edge.id === s.b.edge.id ? 'self' : 'pair']), doors: i2 && doorRows(html(i2)) });
  const sec = src('src/manuscript/IdentificationImageSection.tsx'); const model = src('src/manuscript/identificationImageModel.ts');
  check('§7 ★ BY CONSTRUCTION: the section prints the act\'s word (`image.act.word`) and letters every door through the act (`letterAt`); the re-read word (`image.gluing`) appears nowhere in it; the model reads the act\'s word from the form itself (`actWordOf(form)` — the render\'s verified word, the argument reading\'s own source, else the act\'s own label), one producer of the letters (`actLettersOf`); a label\'s other words never pass (`isGluingWord`)',
    /glued by \$\{image\.act\.word\}/.test(sec) && !/image\.gluing/.test(sec) && /const letterAt = \(i: number\): string => \(image\.act && image\.act\.letters \? image\.act\.letters\[i\] : letterOf\(i\)\);/.test(sec) && /const word = summands \? null : actWordOf\(form\);/.test(model) && /const act = word && gluing && wordsAgree\(word, gluing\) \? \{ word, letters: actLettersOf\(word, S\.seams\) \} : null;/.test(model) && /export function actLettersOf\(word: string, seams: readonly Seam\[\]\): string\[\] \| null/.test(model) && /const isGluingWord = \(w: string\): boolean =>/.test(model));
}

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-IDENTIFICATION-WORDS: ALL PASS — every word of the dock, the fold and the general idn path read by D19 on his generation-2 square: the seams, the merged corners side by side, the media in the first edge\'s order, his pair taken or refused by name; the torus one point three ways; sew unreachable on his case, said' : `DIAGNOSE-THE-IDENTIFICATION-WORDS: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);

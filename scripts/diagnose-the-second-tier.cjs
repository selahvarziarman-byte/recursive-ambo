#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════
// THE SECOND TIER, MEASURED ON HIS CASE — GROUP 4 · slice 7 (ADR 0031 §9.76 (6), its last clause: "the walk in a generation-2 room, the family under the walk, the born face
// over a walk carrying words, the generation-3 room, each named unmeasured in §9.54 and the coder's price, and all four reachable on his torus once its corners hold moments";
// the mothership's 10:37 STAMP: "measurements by the existing instruments; a cut only where one shows"). His case is the chain witness's construction, verbatim (Virgin Land's
// 19:54 record, his pairs and relatings around Class at generation 1, the core dissected again, his relating on the sides of the square around Class at generation 2), with ONE
// addition: a family at generation 1 — on Accumulation–Class the IS pair's Accumulation end also holds a relating in a mode. The rooms are built as the page builds them
// (lift a cell, one door, `cargoRoomOf`), and the cargo is walked by the page's own acts (`pickCargo`, `stepRod` with his hand). NOTHING CUT: no defect showed; one reading
// is flagged for the researcher (§3, a way from a role to itself).
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
console.log('THE SECOND TIER ON HIS CASE — the walk in a generation-2 room, the family under the walk, the born face over a walk carrying words, the generation-3 room (GROUP 4 · slice 7)\n');
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
// THE FAMILY, given at generation 1 before the dissection: on Accumulation–Class, the IS pair's Accumulation end ALSO holds a relating in a mode (a role held by both, §9.54)
const fam1 = (() => {
  const A1 = byLabel(G1, 'Accumulation'); const e = G1.edges.find((z) => z.vertexIds.includes(A1) && z.vertexIds.includes(V));
  if (!e) return { ok: false, why: 'no edge Accumulation–Class at generation 1' };
  const idn = cur().edges.find((z) => z.id === e.id).identification; const pr = idn && idn.roles && idn.roles[0];
  if (!pr) return { ok: false, why: 'no IS pair on Accumulation–Class' };
  const accFirst = e.vertexIds[0] === A1; const x = accFirst ? pr[0] : pr[1]; const yIs = accFirst ? pr[1] : pr[0];
  const cV = columnSpaceOf(cur(), V, { records: childRecordsOf(S()) });
  for (const r of cV.roles) { if (r.id === yIs) continue; const ref = accFirst ? S().giveRelating(e.id, 'is honoured as', x, r.id, '+') : S().giveRelating(e.id, 'is honoured as', r.id, x, '+'); if (ref === null) return { ok: true, x, pairedTo: yIs, relatedTo: r.id }; }
  return { ok: false, why: "no relating taken on the pair's end" };
})();
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
// ═══ THE SECOND TIER, MEASURED ON HIS CASE ═══
const C = req('src/manuscript/cargoModel.ts');
const AP = req('src/manuscript/apertureModel.ts');
const labOf = (sh) => (v) => sh.vertices[v]?.data.label || v;
const liftCell = (pick) => { S().selectVertex(null); S().selectEdge(null); S().clearLiftSelection(); S().selectCell(pick(cur()).id); const b = useLiftStore.getState().queue.length; S().liftSelectionToManuscript(); const en = loadUniverseSnapshot(useLiftStore.getState().queue[b].file); return { entry: en, form: placeShelfEntry(en, 0) }; };
// a room needs one door (`no identification yet — pick at least one pair of faces`, measured): a hinge door between two side faces at the apex, the apex to itself, carrying nothing
const roomOf = (L, apexLabel) => {
  const shape = L.form.shape; const lab = labOf(shape);
  const apex = Object.keys(shape.vertices).find((v) => lab(v) === apexLabel);
  const sides = AP.boundaryFacesOf(shape).filter((m) => { const f = shape.faces.find((x) => x.id === m.id || m.id.endsWith(x.id)); return f && f.vertexIds.includes(apex); });
  let rows = null;
  for (let i = 0; i < sides.length && !rows; i += 1) for (let j = i + 1; j < sides.length && !rows; j += 1) {
    const hinge = AP.dihedralMapCandidates(shape, sides[i].id, sides[j].id).find((c) => c.correspondence.some(([a, b]) => a.endsWith(apex) && b.endsWith(apex)));
    if (hinge) rows = [{ faceA: sides[i].id, faceB: sides[j].id, candidateKey: hinge.key, transports: [] }, { faceA: null, faceB: null, candidateKey: null }];
  }
  const verdict = AP.buildPersonDomainVerdict(shape, rows, 'built-t2', 'built 3-manifold t2');
  const room = C.cargoRoomOf(shape, L.entry.loaded.ancestors ?? [], rows, AP.readCellSurface(verdict.domain, false), undefined, [], L.entry.loaded.lexicon ?? undefined);
  const at = (label) => Object.keys(shape.vertices).find((v) => lab(v) === label);
  return { shape, room, apex, at, lab };
};
const KEYLIKE = /[^ (]≡[^ )]|\b[A-Z][a-z]+:[a-z]/; // a key printed where words belong (the generation-2 corner witness's guard)
const roleNamed = (R, corner, name) => R.room.rolesAt(corner).find((r) => r.name === name);
const stepWords = (R, from, role, to, via) => C.cargoReading(R.room, C.stepRod(R.room, C.pickCargo(R.room, from, role.id), to, via)).words;
const roadsOf = (R, from, role, to) => (R.room.ways(from, to) || new Map()).get(role.id) || [];

// ═══ §1 THE WALK IN A GENERATION-2 ROOM: the square pyramid at Class, his square its base ═══
const pyramidAt = (sh, label) => sh.cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(byLabel(sh, label)) && c.vertexIds.length === 5);
const R2 = roomOf(liftCell((sh) => pyramidAt(sh, 'Class')), 'Class');
const cls = R2.apex; const AC = R2.at('Accumulation–Class'); const CB = R2.at('Class–Budget'); const CL = R2.at('Class–Livelihood'); const FDC = R2.at('Finance–Distribution–Class');
const cap = roleNamed(R2, cls, 'the holding is put to work as the capacity');
const w2 = { budget: cap && stepWords(R2, cls, cap, CB), liveli: cap && stepWords(R2, cls, cap, CL), empty: cap && stepWords(R2, cls, cap, FDC) };
check('§1 ★★★ THE WALK IN A GENERATION-2 ROOM, ON HIS CASE (slice 7\'s second tier): the generation-2 pyramid at Class — his square its base — lifted and built as a room (one hinge door at the apex: a room is refused without one, measured); its corners hold Class\'s 12 moments and his square\'s 3 · 0 · 2 · 2; `the holding is put to work as the capacity` walked from Class comes down the corner edge to Class–Budget as the IS instance it is a coordinate of (`came along CLASS – CLASS–BUDGET as ((the share is consumed as the use) ≡ (…))`), to Class–Livelihood as the relating in a mode it is a coordinate of (`as ((…) is honoured as (the want is solicited by the purpose)), by CLASS – CLASS–LIVELIHOOD`), and breaks by name at the corner that holds nothing; no key prints',
  !!R2.room && J([cls, AC, FDC, CB, CL].map((v) => R2.room.rolesAt(v).length)) === J([12, 3, 0, 2, 2]) && !!cap
    && w2.budget === 'carrying (the holding is put to work as the capacity) — at the corner CLASS–BUDGET, came along CLASS – CLASS–BUDGET as ((the share is consumed as the use) ≡ (the holding is put to work as the capacity))'
    && w2.liveli === 'carrying (the holding is put to work as the capacity) — at the corner CLASS–LIVELIHOOD as ((the holding is put to work as the capacity) is honoured as (the want is solicited by the purpose)), by CLASS – CLASS–LIVELIHOOD'
    && w2.empty === 'carrying nothing — (the holding is put to work as the capacity) broke at the rod CLASS – FINANCE–DISTRIBUTION–CLASS, which does not carry it' && !Object.values(w2).some((s) => KEYLIKE.test(s || '')),
  { roles: [cls, AC, FDC, CB, CL].map((v) => `${R2.lab(v)}:${R2.room.rolesAt(v).length}`), w2 });

// ═══ §2 THE FAMILY UNDER THE WALK (§9.54, §9.57): the family given at generation 1 — the IS pair's Accumulation end also holds a relating in a mode on Accumulation–Class — is a
//     BRANCHING at generation 2: from the role down its corner edge, one road to each of the child's moments it is a coordinate of; his hand chooses; without one nothing happens ═══
const RA = roomOf(liftCell((sh) => pyramidAt(sh, 'Accumulation')), 'Accumulation');
const acc = RA.apex; const ACa = RA.at('Accumulation–Class');
const hoard = roleNamed(RA, acc, 'the hoard is retained from the surplus');
const famRoads = hoard ? roadsOf(RA, acc, hoard, ACa) : [];
const stillA = hoard ? C.cargoReading(RA.room, C.stepRod(RA.room, C.pickCargo(RA.room, acc, hoard.id), ACa)).words : null;
const byHand = famRoads.map((rd) => [rd.word, stepWords(RA, acc, hoard, ACa, rd.to)]);
const capRoads = cap ? roadsOf(R2, cls, cap, AC) : [];
check('§2 ★★★ THE FAMILY UNDER THE WALK, AT GENERATION 2 (given at generation 1: on Accumulation–Class the IS pair `(the hoard …) ≡ (the market …)` and his relating `(the hoard …) is honoured as (the holding … capacity)` share the hoard): walked from the hoard at Accumulation down the corner edge, TWO roads — `≡` landing on the IS instance (`came along ACCUMULATION – ACCUMULATION–CLASS as ((the hoard …) ≡ (the market …))`) and `is honoured as` landing on the relating (`as ((the hoard …) is honoured as (the holding …)), by ACCUMULATION – ACCUMULATION–CLASS`); with no hand chosen the cargo stays where it was (nothing is chosen for him, §9.57 (4)); at Class the capacity branches the same way down to Accumulation–Class (two relatings share it)',
  fam1 && fam1.ok && famRoads.length === 2 && J(byHand.map(([w]) => w).sort()) === J(['IS', 'is honoured as'].sort())
    && byHand.some(([w, s]) => w === 'IS' && s === 'carrying (the hoard is retained from the surplus) — at the corner ACCUMULATION–CLASS, came along ACCUMULATION – ACCUMULATION–CLASS as ((the hoard is retained from the surplus) ≡ (the market is put to work as the cooperation))')
    && byHand.some(([w, s]) => w === 'is honoured as' && s === 'carrying (the hoard is retained from the surplus) — at the corner ACCUMULATION–CLASS as ((the hoard is retained from the surplus) is honoured as (the holding is put to work as the capacity)), by ACCUMULATION – ACCUMULATION–CLASS')
    && stillA === 'carrying (the hoard is retained from the surplus) — at the corner ACCUMULATION' && capRoads.length === 2,
  { fam1, roads: byHand, still: stillA, capRoads: capRoads.length });

// ═══ §3 THE BORN FACE OVER A WALK CARRYING WORDS: every route round each side triangle of the generation-2 pyramid at Class (apex → X → Y → apex, every hand taken) ═══
const rounds = [];
{
  const tris = R2.shape.faces.filter((f) => f.vertexIds.length === 3 && f.vertexIds.includes(cls));
  for (const f of tris) {
    const i = f.vertexIds.indexOf(cls);
    for (const [X, Y] of [[f.vertexIds[(i + 1) % 3], f.vertexIds[(i + 2) % 3]], [f.vertexIds[(i + 2) % 3], f.vertexIds[(i + 1) % 3]]]) {
      for (const r of R2.room.rolesAt(cls)) {
        const go = (st, legs, hands) => {
          if (!legs.length) { const rd = C.cargoReading(R2.room, st); rounds.push({ role: r.name, path: [cls, X, Y, cls].map(R2.lab).join('→'), hands, state: rd.state, words: rd.words }); return; }
          const to = legs[0]; const roads = st.at ? ((R2.room.ways(st.at.corner, to) || new Map()).get(st.at.role) || []) : [];
          if (roads.length > 1) { for (const rd of roads) go(C.stepRod(R2.room, st, to, rd.to), legs.slice(1), [...hands, rd.word]); return; }
          const nx = C.stepRod(R2.room, st, to); if (nx.at) go(nx, legs.slice(1), hands);
        };
        go(C.pickCargo(R2.room, cls, r.id), [X, Y, cls], []);
      }
    }
  }
}
for (const x of rounds) note(`round ${x.path} from ${x.role}${x.hands.length ? ` (hands ${x.hands.join(', ')})` : ''}: ${x.state} — ${x.words.slice(0, 220)}`);
const reflexive = rounds.filter((x) => { const m = /back at CLASS by a way: \((.*)\) is honoured as \((.*)\), by /.exec(x.words); return m && m[1] === m[2]; });
check('§3 ★★ THE BORN FACE OVER A WALK CARRYING WORDS (§9.57 at generation 2): every route that comes round a side triangle of the pyramid at Class is MIXED — a corner edge, a side of his square by his relating, a corner edge — and reads a LIGHT at Class (`home-way`: `back at CLASS by a way: (…) is honoured as (…), by ≡ then is honoured as`), never `returned` (Fix · Mov · Und stay the IS routes\'). ⚠ MEASURED, FOR THE RESEARCHER: two of them come back to the SAME role and print a way from a role to itself — `(the market is put to work as the cooperation) is honoured as (the market is put to work as the cooperation)` — §9.57 rules the mixed route back to ANOTHER role; this one it does not name',
  rounds.length === 4 && rounds.every((x) => x.state === 'home-way' && /, by ≡ then is honoured as$/.test(x.words)) && reflexive.length === 2 && reflexive.every((x) => x.role === 'the market is put to work as the cooperation'),
  { rounds: rounds.length, states: rounds.map((x) => x.state), reflexive: reflexive.map((x) => x.path) });

// ═══ §4 THE GENERATION-3 ROOM: the generation-2 core dissected again; the pyramid whose apex is his square's corner Accumulation–Class (one of its generation-2 edges carries his relating) ═══
S().selectShape(G2.id);
S().selectCell(cur().cells.find((c) => c.kind === 'core').id); S().applyAmboDissectionToCurrent();
const R3 = roomOf(liftCell((sh) => { const ac = byLabel(sh, 'Accumulation–Class'); return sh.cells.find((c) => c.kind === 'residue' && c.vertexIds.includes(ac) && c.vertexIds.length === 5 && c.vertexIds.filter((v) => v !== ac).every((v) => sh.vertices[v].createdBy.sourceVertexIds.includes(ac))); }), 'Accumulation–Class');
const ac3 = R3.apex; const g3 = R3.at('Accumulation–Class–Class–Livelihood');
const base3 = R3.room.corners.filter((v) => v !== ac3);
const isAC = roleNamed(R3, ac3, '(the hoard is retained from the surplus) ≡ (the market is put to work as the cooperation)');
const g3role = g3 ? R3.room.rolesAt(g3)[0] : null;
const out3 = isAC && g3 ? stepWords(R3, ac3, isAC, g3) : null; const back3 = g3role ? stepWords(R3, g3, g3role, ac3) : null;
check('§4 ★★ THE GENERATION-3 ROOM, ON HIS CASE: the generation-2 core dissected again, the pyramid whose apex is his square\'s corner Accumulation–Class lifted and built; of its four generation-3 corners ONE holds a moment — Accumulation–Class–Class–Livelihood, the child of the side his relating stands on, holding that relating\'s instance `((the hoard …) ≡ (the market …)) is honoured as ((the market …) ≡ (the need …))` — the other three nothing (no relating on their edges); the IS moment at the apex comes down its corner edge onto it (`as (…), by ACCUMULATION–CLASS – ACCUMULATION–CLASS–CLASS–LIVELIHOOD`) and the instance comes back as its coordinate (`came along … as ((the hoard …) ≡ (the market …))`); no key prints. Its side triangles can be walked round by nothing on this record (one base corner holds a moment) — the face reading at generation 3 is vacuous here, said',
  !!R3.room && base3.length === 4 && base3.filter((v) => R3.room.rolesAt(v).length > 0).length === 1 && !!g3role && g3role.name === '((the hoard is retained from the surplus) ≡ (the market is put to work as the cooperation)) is honoured as ((the market is put to work as the cooperation) ≡ (the need is taken up as the purpose))'
    && out3 === 'carrying ((the hoard is retained from the surplus) ≡ (the market is put to work as the cooperation)) — at the corner ACCUMULATION–CLASS–CLASS–LIVELIHOOD as (((the hoard is retained from the surplus) ≡ (the market is put to work as the cooperation)) is honoured as ((the market is put to work as the cooperation) ≡ (the need is taken up as the purpose))), by ACCUMULATION–CLASS – ACCUMULATION–CLASS–CLASS–LIVELIHOOD'
    && back3 === 'carrying (((the hoard is retained from the surplus) ≡ (the market is put to work as the cooperation)) is honoured as ((the market is put to work as the cooperation) ≡ (the need is taken up as the purpose))) — at the corner ACCUMULATION–CLASS, came along ACCUMULATION–CLASS–CLASS–LIVELIHOOD – ACCUMULATION–CLASS as ((the hoard is retained from the surplus) ≡ (the market is put to work as the cooperation))'
    && !KEYLIKE.test(out3 || '') && !KEYLIKE.test(back3 || ''),
  { base: base3.map((v) => `${R3.lab(v)}:${R3.room.rolesAt(v).length}`), out3, back3 });

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-SECOND-TIER: ALL PASS — on his case, the walk in a generation-2 room reads the term reader\'s words; a family branches into his hands; every route round a born face carrying words reads a light (two come back to the same role, flagged); the generation-3 room carries his generation-2 relating as its child' : `DIAGNOSE-THE-SECOND-TIER: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);

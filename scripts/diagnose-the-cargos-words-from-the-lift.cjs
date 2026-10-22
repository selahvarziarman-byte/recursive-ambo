#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════
// THE CARGO'S WORDS FROM THE LIFT — GROUP 4 · slice 4 (ADR 0031 §9.61; Arman's Δ245, the third snapshot spend). A walk in a room reads the words AS THEY WERE LIFTED:
// his composition rules (§9.57, D6) and his converses (§9.65 (3)) come off the lift file the room's form reads through the chain, never the live Ambo's as they stand
// when the room is read (the 11:20 charter's survey: "the cargo takes rules and converses from the live Ambo, not the lift"). MEASURED here: the store with his rules and
// a converse; a face lifted — the file carries the rules as the FIFTH row set beside Δ244's four; the load carries them, cloned; the chain hands them to a lifted form
// (and, by source, down every act); the Ambo's rules then CHANGED — the room built on the chain's record composes by the lift's rule, the store's by the store's (the
// falsifier); a file saved between the two spends holds records without rules, and the chain says the absence the room's line prints; the view by source.
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
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { useLiftStore } = req('src/store/liftStore.ts');
const { loadUniverseSnapshot, placeShelfEntry } = req('src/manuscript/genesisModel.ts');
const { formRecordOf } = req('src/manuscript/bornRecordModel.ts');
const C = req('src/manuscript/cargoModel.ts');
const { compositeOfSteps } = req('src/lib/walkRoutes.ts');
const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => { console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`); if (!cond) failures += 1; };
const note = (s) => console.log(`      ${s}`);
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n');
console.log('THE CARGO\'S WORDS FROM THE LIFT — §9.61 on Δ245: his rules and converses off the lift file, through the chain; the Ambo moved on, the room reads the lift\n');
const S = () => useGeometryStore.getState();
const sh = () => S().shapes[S().currentShapeId];
S().importWorkspace(JSON.parse(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/altitude/virgin-land_2026-10-09_1934_Value-Fact_all-passages-decided.workspace.json'), 'utf8')));

// ═══ §0 THE STORE WITH HIS WORDS, A FACE LIFTED: the file carries his rules as the fifth row set beside the four, and his converse in the lexicon ═══
const R1 = [['p', 'q', 'pq'], ['q', 'p', 'qp'], ['p', 'q', 'pq-join', 'join'], ['q', 'r', 'qr-fork', 'fork', 'second']];
const C1 = [['p', 'p*']];
useGeometryStore.setState({ rules: R1.map((r) => [...r]), converses: C1.map((c) => [...c]), opaque: ['p*'] });
const face = sh().faces.find((f) => f.vertexIds.length >= 3);
S().selectVertex(null); S().selectEdge(null); S().clearLiftSelection(); S().toggleLiftSelection({ kind: 'face', id: face.id });
const before = useLiftStore.getState().queue.length; S().liftSelectionToManuscript();
const file = useLiftStore.getState().queue[before].file;
check('§0 ★★ THE FILE CARRIES HIS RULES (Δ245): the lift file\'s records hold the four row sets AND `rules` — the store\'s rows word for word (a chain, a join, a fork with its subject end), beside the lexicon\'s converse and opaque word (M2)',
  !!file.records && Array.isArray(file.records.rules) && J(file.records.rules) === J(R1) && ['roleNames', 'loopAnswers', 'loopRules', 'relationNames'].every((k) => Array.isArray(file.records[k])) && J(file.lexicon) === J({ converses: C1, opaque: ['p*'] }),
  { rules: file.records && file.records.rules, lexicon: file.lexicon });

// ═══ §1 THE LOAD CARRIES THEM, CLONED ═══
const entry = loadUniverseSnapshot(file);
const form = placeShelfEntry(entry, 0);
check('§1 ★★ THE LOAD: the loaded form holds the rules as the file holds them, cloned (never the store\'s own array), and the lexicon beside',
  !!entry.loaded.records && J(entry.loaded.records.rules) === J(R1) && entry.loaded.records.rules !== S().rules && entry.loaded.records.rules !== file.records.rules && J(entry.loaded.lexicon) === J({ converses: C1, opaque: ['p*'] }),
  { rules: entry.loaded.records && entry.loaded.records.rules });

// ═══ §2 THE CHAIN hands a lifted form the file's rules beside its facts; by source every act carries them down ═══
const ctxOf = (loaded) => ({ carriedOf: () => loaded.ancestors ?? [], formOf: () => null, seamRecords: [], factsOf: () => loaded.lexicon ?? null, recordsOf: () => null, rulesOf: () => loaded.records?.rules ?? null });
const chainForm = { shape: form.shape, opId: null, provenance: 'lifted', parentShape: null };
const rec = formRecordOf(chainForm, ctxOf(entry.loaded));
const chainSrc = src('src/manuscript/bornRecordModel.ts');
check('§2 ★★ THE CHAIN: the lifted form\'s record carries `rules` (the file\'s, through `rulesOf`) beside `facts`; an identification and a provenance act carry the parent\'s `rules` down (`rules: P.rules`, twice by source); the reader is optional — an older context hands none',
  rec.state === 'read' && J(rec.rules) === J(R1) && J(rec.facts) === J({ converses: C1, opaque: ['p*'] }) && (chainSrc.match(/records: P\.records, rules: P\.rules \}/g) || []).length === 2 && /rules: ctx\.rulesOf\?\.\(form\.shape\.id\) \?\? null \}/.test(chainSrc) && /rulesOf\?: \(shapeId: string\) => readonly Rule\[\] \| null;/.test(chainSrc) && formRecordOf(chainForm, { ...ctxOf(entry.loaded), rulesOf: undefined }).rules === null,
  { state: rec.state, rules: rec.state === 'read' ? rec.rules : null });

// ═══ §3 THE FALSIFIER: the Ambo's rules CHANGED after the lift — the room built on the chain's record composes by the LIFT's rule; the store's by the store's ═══
useGeometryStore.setState({ rules: [['p', 'q', 'XX']], converses: [], opaque: [] });
const roomOf = (rules, facts) => C.cargoRoomFrom({ corners: ['A', 'B', 'C'], roles: { A: [{ id: 'x' }], B: [{ id: 'y' }], C: [{ id: 'z' }] }, J: () => null, rules, facts, rods: [{ a: 'A', b: 'B' }, { a: 'B', b: 'C' }], faces: [], doors: [] });
const roomLift = roomOf(rec.rules ?? [], rec.facts ?? undefined);
const roomLive = roomOf(S().rules, { converses: S().converses, opaque: S().opaque });
const chain = (room) => compositeOfSteps([{ word: 'p', against: false }, { word: 'q', against: false }], room.rules, room.facts);
const viaConverse = (room) => compositeOfSteps([{ word: 'q', against: false }, { word: 'p*', against: true }], room.rules, room.facts);
check('§3 ★★★ THE WALK READS THE WORDS AS THEY WERE LIFTED: with the Ambo\'s rule now `(p, q) ↦ XX` and his converse withdrawn, the room on the chain\'s record composes p then q to `pq` (the lift\'s rule) and q then p* walked against its way to `qp` (by the lift\'s converse p ≡ p* and its chain rule) — the room on the live store composes `XX` and reads the second route UNRULED',
  J(chain(roomLift)) === J({ kind: 'word', word: 'pq', by: 'rule' }) && J(viaConverse(roomLift)) === J({ kind: 'word', word: 'qp', by: 'rule' }) && J(chain(roomLive)) === J({ kind: 'word', word: 'XX', by: 'rule' }) && J(viaConverse(roomLive)) === J({ kind: 'unruled' }),
  { lift: [chain(roomLift), viaConverse(roomLift)], live: [chain(roomLive), viaConverse(roomLive)] });

// ═══ §4 THE VIEW BY SOURCE: the explore read takes the room form's chain record — rules and converses off the lift — and the live store's nowhere; the room's line says an absence ═══
const view = src('src/manuscript/ManuscriptView.tsx');
check('§4 ★★ THE VIEW: the explore read takes `liftedRoom?.rules` and `liftedRoom?.facts` from `formRecordOf(formEntry.form, chainCtx)` (the room\'s form); `getState().rules` and `getState().converses` are read nowhere in the view; the chain context hands `rulesOf` off the shelf\'s lift files; the memo depends on the chain context; the room\'s line says `rules: not carried by this lift` · `converses: not carried by this lift` on an older file and the chain\'s reason on a form it cannot read — on a room the cargo walks only (`read.cargoRoom === null ? null`: a room whose form was never lifted has no cargo and says nothing of words) — on its own line in the room, `lift again` at its end where the room offers it (the designer\'s 20:51)',
  /const roomRecord = formEntry \? formRecordOf\(formEntry\.form, chainCtx\) : null;/.test(view) && /const rules = liftedRoom\?\.rules \?\? \[\];/.test(view) && /const facts = liftedRoom\?\.facts \?\? NO_FACTS;/.test(view) && !/getState\(\)\.rules/.test(view) && !/getState\(\)\.converses/.test(view) && !/getState\(\)\.opaque/.test(view) && /const wordsNote = read\.cargoRoom === null \? null : /.test(view)
    && /rulesOf: \(shapeId\) => shelf\.find\(\(item\) => item\.entry\.loaded\.shape\.id === shapeId\)\?\.entry\.loaded\.records\?\.rules \?\? null,/.test(view) && /resolveAbsentLabel, chainCtx\]\);/.test(view)
    && view.includes("roomRecord.rules === null ? 'rules: not carried by this lift' : null") && view.includes("roomRecord.facts === null ? 'converses: not carried by this lift' : null") && view.includes('`rules and converses: ${roomRecord.reason}`') && /wordsAbsent: wordsNote,/.test(view) && view.includes('wordsAbsent={exploreRoom.wordsAbsent ?? null}') && src('src/manuscript/ExploreWindow.tsx').includes('<span data-explore-words-absent-line>{wordsAbsent}</span>') && src('src/manuscript/ExploreWindow.tsx').includes('data-explore-words-lift-again onClick={() => { onClose(); onLiftAgain(); }}'),
  'source pins');

// ═══ §5 THE ABSENCE: a file saved between the two spends (records, no rules), before Δ244 (no records), before M2 (no lexicon) ═══
const clone = (x) => JSON.parse(JSON.stringify(x));
const between = clone(file); delete between.records.rules;
const beforeRecords = clone(file); delete beforeRecords.records;
const beforeLexicon = clone(file); delete beforeLexicon.lexicon;
const recOf = (f) => { const e = loadUniverseSnapshot(f); const pf = placeShelfEntry(e, 0); return formRecordOf({ shape: pf.shape, opId: null, provenance: 'lifted', parentShape: null }, ctxOf(e.loaded)); };
const rB = recOf(between); const rR = recOf(beforeRecords); const rL = recOf(beforeLexicon);
check('§5 ★★ THE ABSENCE SAID, NEVER FILLED: a file with records and no rules loads with the four sets and `rules` absent — the chain hands `rules: null` (the room\'s line: `rules: not carried by this lift`); a file with no records the same; a file with no lexicon hands `facts: null` (`converses: not carried by this lift`); the rules never fabricated from the live store',
  rB.state === 'read' && rB.rules === null && J(rB.facts) === J({ converses: C1, opaque: ['p*'] }) && !!loadUniverseSnapshot(between).loaded.records && loadUniverseSnapshot(between).loaded.records.rules === undefined
    && rR.state === 'read' && rR.rules === null && loadUniverseSnapshot(beforeRecords).loaded.records === undefined
    && rL.state === 'read' && rL.facts === null && J(rL.rules) === J(R1),
  { between: rB.state === 'read' && rB.rules, beforeRecords: rR.state === 'read' && rR.rules, beforeLexicon: rL.state === 'read' && rL.facts });

// ═══ §6 BY CONSTRUCTION: the file carries rules of the rule's own shape only; the store's lift sites hand them; the manifest classifies this witness's subjects ═══
const bad = clone(file); bad.records.rules = [['p', 'q', 'pq', 'fork', 'third']];
const bad2 = clone(file); bad2.records.rules = [['p', 'q']];
const bad3 = clone(file); bad3.records.rules = 'pq';
const store = src('src/store/geometryStore.ts');
check('§6 ★★ BY CONSTRUCTION: a rules row of another shape (a subject end that is neither `first` nor `second`; two words; not a list) is not his records — the load carries no records then, says the absence, never a guess; the store\'s one `recordsOf` hands `rules: s.rules` to every lift site; the snapshot\'s reader names the three shapes and the two ends',
  loadUniverseSnapshot(bad).loaded.records === undefined && loadUniverseSnapshot(bad2).loaded.records === undefined && loadUniverseSnapshot(bad3).loaded.records === undefined
    && /relationNames: s\.relationNames, rules: s\.rules \}\);/.test(store) && (store.match(/recordsOf\(get\(\)\)/g) || []).length >= 7
    && /const shape3 = \(v: unknown\): v is 'chain' \| 'fork' \| 'join' => v === 'chain' \|\| v === 'fork' \|\| v === 'join';/.test(src('src/playground/snapshot.ts')) && /const subject = \(v: unknown\): v is 'first' \| 'second' => v === 'first' \|\| v === 'second';/.test(src('src/playground/snapshot.ts')),
  { liftSites: (store.match(/recordsOf\(get\(\)\)/g) || []).length });

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-CARGOS-WORDS-FROM-THE-LIFT: ALL PASS — the lift file carries his composition rules beside the four sets and the lexicon; the chain hands them down every act; the room reads the words as they were lifted while the Ambo has moved on; an older file says the absence' : `DIAGNOSE-THE-CARGOS-WORDS-FROM-THE-LIFT: ${failures} FAIL`}`);
process.exit(failures === 0 ? 0 : 1);

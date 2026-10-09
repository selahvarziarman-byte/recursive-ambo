#!/usr/bin/env node

// DIAGNOSTIC — STAMP THE-ALTITUDE · slice 1 (2026-10-09; ADR 0031 §9.29 D22–D25; the ruling THE PROJECTION §19; the mothership's
// 09:09 BUILD on Arman's word): THE ALTITUDE'S RECORD AND ITS READERS, on Virgin Land's record of 10-07 18:34 with Arman's own share
// (ARMAN-2) written in through the lib — agreeing with the reference instruments `the_altitude_marks.cjs` (39 taken · 0 refused · the
// marks at the ends) and `the_lit_grid.cjs` (27 of 56 cells lit by one role) and with the designer's data-checked lines (08:45, 08:51).
// §0 purity · §1 F1 the midpoint reads under T at once with non-empty marks and the relatings byte-identical before and after; an empty
// altitude reads VACUOUS under T · §2 F2 the direction law refuses an end's role as subject BY NAME; IS and ≡ refused · §3 F3 the marks land
// on the right ends and nowhere else (the instrument's S3–S5 control) · §4 F6 the kill-condition: two altitudes on one record, two readings,
// the relatings unchanged · §5 F7 a lone segment has no altitude · §6 the lit grid: 33 forks on 27 cells; the three relatings placed (2 ·
// 2 · 0) · §7 the record rides the frozen lift untouched (slot keys, no vertex id) · §8 the sorting's other readers unchanged by an altitude
// · §9 the store's acts and the log (slice 1 (b)): given, refused by name and kept, replaced, withdrawn; the word declared into L; the stage unapplies; the export carries it; the import purge names IS.
// Run: node scripts/diagnose-the-altitude.cjs

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } };
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const A = req('src/lib/altitude.ts');
const SO = req('src/lib/sorting.ts');
const SN = req('src/playground/snapshot.ts');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const note = (line) => console.log(`      ${line}`);

// ─── the fixtures: Virgin Land's 18:34 record and ARMAN-2, copies of the originals (scripts/fixtures/altitude/README.md) ───
const FIX = path.join(repoRoot, 'scripts/fixtures/altitude');
const save = JSON.parse(fs.readFileSync(path.join(FIX, 'virgin-land_2026-10-07_1834_F-Phi_3-relatings-1-bar.workspace.json'), 'utf8'));
const hand = JSON.parse(fs.readFileSync(path.join(FIX, 'ARMAN-2.json'), 'utf8'));
const shape0 = save.shapes[save.currentShapeId];
const facts = { converses: save.converses || [], opaque: save.opaque || [] };
const rules = save.rules || [];
const cornerOf = (shape, lab) => Object.values(shape.vertices).find((v) => v.data?.label === lab && v.data?.cast)?.id;
const edgeBetween = (shape, a, b) => shape.edges.find((e) => (e.vertexIds[0] === a && e.vertexIds[1] === b) || (e.vertexIds[0] === b && e.vertexIds[1] === a));
const faceOf = (shape, ids) => shape.faces.find((f) => f.vertexIds.length === ids.length && ids.every((v) => f.vertexIds.includes(v)));
const F = cornerOf(shape0, 'F'); const PHI = cornerOf(shape0, 'Φ'); const T = cornerOf(shape0, 'T');
const eFP = edgeBetween(shape0, F, PHI);
const faceFPT = faceOf(shape0, [F, PHI, T]);
const labelIn = (shape, corner, id) => (shape.vertices[corner]?.data?.cast?.roles || []).find((r) => r.id === id)?.label || id;
const roleRef = (s) => { const m = /^(.+?):(.+)$/.exec(String(s)); return { side: m ? m[1] : null, id: m ? m[2] : String(s) }; };

/** write a hand's entries through the lib's checked act; returns the shape, the takings and the refusals */
const writeHand = (shape, entries, apex, faceId) => {
  let next = shape; const taken = []; const refused = [];
  for (const it of entries) {
    const z = roleRef(it.from).id; const x = roleRef(it.to).id; const w = String(it.word || '').trim(); const sign = it.holds === false ? '-' : '+';
    const act = A.altitudeSayingOf(next, faceId, apex, z, w, x, sign);
    if (act.refused) { refused.push({ it, why: act.refused.why }); continue; }
    const faces = next.faces.map((f) => (f.id === faceId ? A.withSaying(f, act.slot, act.saying) : f));
    next = { ...next, faces }; taken.push(act.saying);
  }
  return { shape: next, taken, refused };
};
const viewT = (sorting) => sorting.views.find((v) => v.view === T);
const relatingsOn = (shape) => J(edgeBetween(shape, F, PHI).data?.relatings || []);
const named = (shape, corner, marks) => marks.map((m) => `${labelIn(shape, corner, m.z)} ${m.w}${m.s === '-' ? ' (doesn\'t hold)' : ''}`);

// §0 — purity: the lib is React-free and DOM-free; a written packet carries no vertex id
const src = fs.readFileSync(path.join(repoRoot, 'src/lib/altitude.ts'), 'utf8');
check('§0 the altitude lib imports no React and touches no DOM', !/from 'react'|document\.|window\./.test(src));
check('§0 the altitude lib defines the record kinds, the home key, the checked act and the readers it declares', ['ALTITUDES_KEY', 'altitudeSayingOf', 'withSaying', 'withoutSaying', 'altitudeHeld', 'marksAt', 'reachOf', 'refusalsOf', 'vacuousUnder', 'forksOf', 'altitudeLegs', 'altitudeOf', 'altitudesAt', 'isBondSaying'].every((k) => typeof A[k] === 'function' || typeof A[k] === 'string'));

// §1 — F1: before, VACUOUS under T; after ARMAN-2, read under T at once; the relatings byte-identical
check('§1 the fixture is Virgin Land\'s record: F, Φ, T cast on the seed, the face F·Φ·T, three relatings and one bar on F–Φ in `passes as`', !!F && !!PHI && !!T && !!eFP && !!faceFPT && (eFP.data?.relatings || []).length === 4 && (eFP.data?.relatings || []).filter((r) => r[3] === '+').length === 3, { relatings: eFP.data?.relatings });
const s0 = SO.sortingOf(shape0, eFP, {}, rules, facts);
const v0 = viewT(s0);
check('§1 ★★ F1 (the empty altitude): before any saying the view T reads VACUOUS UNDER T — 0 entries, no mark on any relating, no fork — and the site\'s state is what it was (D7 beside, untouched: VACUOUS, the three instances own)', !!v0 && v0.altitude.vacuousUnder === true && v0.altitude.entries === 0 && v0.altitude.forks === 0 && [...v0.altitude.marks.values()].every((m) => m.atX.present.length + m.atX.denied.length + m.atY.present.length + m.atY.denied.length === 0) && s0.state === 'VACUOUS' && s0.own.length === 3, { state: s0.state, own: s0.own, vacuousUnder: v0?.altitude.vacuousUnder });
const written = writeHand(shape0, hand.relatings, T, faceFPT.id);
const s1 = SO.sortingOf(written.shape, eFP, {}, rules, facts);
const v1 = viewT(s1);
check('§1 ★★ F1: ARMAN-2\'s 39 sayings go in through the checked act — 39 taken, 0 refused (the instrument: 39 entries taken · 0 refused) — and the altitude holds 39 entries at T\'s slot of the face F·Φ·T', written.taken.length === 39 && written.refused.length === 0 && A.altitudeOf(written.shape, faceFPT.id, T).entries.length === 39, { taken: written.taken.length, refused: written.refused });
check('§1 ★★ F1: the midpoint reads UNDER T at once — not vacuous, 39 entries — and the relatings on F–Φ are BYTE-IDENTICAL before and after (nothing subtracted, merged, refused or locked by a mark); the instances, the bars and the own part are what they were', !!v1 && v1.altitude.vacuousUnder === false && v1.altitude.entries === 39 && relatingsOn(written.shape) === relatingsOn(shape0) && J(s1.instances) === J(s0.instances) && J(s1.bars) === J(s0.bars) && J(s1.own) === J(s0.own), { relatingsSame: relatingsOn(written.shape) === relatingsOn(shape0), own: s1.own, state: s1.state });
// the marks at the relating `the form passes as the signal` — x = signal (F, the edge's first corner), y = form (Φ) — as the designer read them off the data (08:45 §5, 08:51)
const keySignalForm = SO.relKey(['passes as', 'signal', 'form', '+', '←']);
const mSF = v1 ? v1.altitude.marks.get(keySignalForm) : null;
const atSignal = mSF ? [...named(written.shape, T, mSF.atX.present), ...named(written.shape, T, mSF.atX.denied)] : [];
const atForm = mSF ? [...named(written.shape, T, mSF.atY.present), ...named(written.shape, T, mSF.atY.denied)] : [];
note(`the form passes as the signal — at the signal: ${atSignal.join(' · ')} — at the form: ${atForm.join(' · ')}`);
check('§1 ★★ D23 THE MARKS at `the form passes as the signal`, as the designer read them off ARMAN-2: at the signal `the hold interprets · the marking refrain might.pass.as · the assuming translates` present and `the marking refrain requires · the other emits` denied; at the form `the hold is.a.mode.of · the living refrain might.act.as · the assuming supervenes.on · the other push.against`, all four present (her 08:51)',
  !!mSF && J(mSF.atX.present.map((m) => `${m.z} ${m.w}`)) === J(['hold interprets', 'atonic might.pass.as', 'assuming translates']) && J(mSF.atX.denied.map((m) => `${m.z} ${m.w}`)) === J(['atonic requires', 'other emits']) && J(mSF.atY.present.map((m) => `${m.z} ${m.w}`)) === J(['hold is.a.mode.of', 'refrain might.act.as', 'assuming supervenes.on', 'other push.against']) && mSF.atY.denied.length === 0,
  { atX: mSF && { present: mSF.atX.present.map((m) => `${m.z} ${m.w}`), denied: mSF.atX.denied.map((m) => `${m.z} ${m.w}`) }, atY: mSF && { present: mSF.atY.present.map((m) => `${m.z} ${m.w}`), denied: mSF.atY.denied.map((m) => `${m.z} ${m.w}`) } });
check('§1 ★★ D23 THE REACH AND THE REFUSALS, read from the altitude alone: 14 end-roles reached (all 8 of F\'s, 6 of Φ\'s 7 — the waiting design silent), 6 denied cells (his six denials)', !!v1 && v1.altitude.reach.length === 14 && v1.altitude.refusals.length === 6 && !v1.altitude.reach.includes('dormant'), { reach: v1?.altitude.reach, refusals: v1?.altitude.refusals.map((r) => `${r.z} ${r.w} ${r.x}`) });

// §2 — F2: the direction law, by name
const wrong = A.altitudeSayingOf(shape0, faceFPT.id, T, 'signal', 'passes as', 'refrain', '+');
const right = A.altitudeSayingOf(shape0, faceFPT.id, T, 'refrain', 'passes as', 'signal', '+');
const inIS = A.altitudeSayingOf(shape0, faceFPT.id, T, 'hold', 'IS', 'signal', '+');
const inGlyph = A.altitudeSayingOf(shape0, faceFPT.id, T, 'hold', '≡', 'signal', '-');
const stranger = A.altitudeSayingOf(shape0, faceFPT.id, T, 'nobody', 'passes as', 'signal', '+');
const toZ = A.altitudeSayingOf(shape0, faceFPT.id, T, 'hold', 'keeps', 'refrain', '+');
check('§2 ★★ F2 THE DIRECTION LAW: a saying whose subject is a role of F is REFUSED BY NAME, its own light named (`in T\'s light a relating runs from a role of T; this one belongs in F\'s light`); the same two roles with T\'s as subject are taken', !!wrong.refused && /^in T's light a relating runs from a role of T; this one belongs in F's light$/.test(wrong.refused.why) && wrong.refused.corner === F && !right.refused && right.saying[1] === 'refrain' && right.saying[3] === 'signal', { wrong: wrong.refused, right: right.saying });
check('§2 ★★ IS and ≡ are refused in a light by the one predicate (a saying in IS would pair; the pairing has one home); a stranger to T is refused as not T\'s role; a role of T as the OBJECT is refused (a saying runs from T\'s role to an end\'s)', !!inIS.refused && /can't be ≡ or IS/.test(inIS.refused.why) && !!inGlyph.refused && /can't be ≡ or IS/.test(inGlyph.refused.why) && !!stranger.refused && /nobody isn't a role of T/.test(stranger.refused.why) && !!toZ.refused && /refrain is a role of T/.test(toZ.refused.why), { inIS: inIS.refused?.why, stranger: stranger.refused?.why, toZ: toZ.refused?.why });

// §3 — F3 (the instrument's S3–S5 control): the synthetic altitude — hold ✗ `is not in` at the signal, the living refrain `passes as` at the signal, the pace `times` at the working
const synth = writeHand(shape0, [{ from: 'T:hold', word: 'is not in', to: 'F:signal', holds: false }, { from: 'T:refrain', word: 'passes as', to: 'F:signal', holds: true }, { from: 'T:pace', word: 'times', to: 'Φ:working', holds: true }], T, faceFPT.id);
const s3 = SO.sortingOf(synth.shape, eFP, {}, rules, facts); const v3 = viewT(s3);
const m3 = (key) => v3 ? v3.altitude.marks.get(SO.relKey(key)) : null;
const mSig = m3(['passes as', 'signal', 'form', '+', '←']); const mSp = m3(['passes as', 'spending', 'working', '+', '←']); const mSt = m3(['passes as', 'store', 'dormant', '+', '←']);
check('§3 ★★ F3 THE MARKS LAND ON THE RIGHT ENDS AND NOWHERE ELSE (S3): the signal carries hold ✗ `is not in` and the living refrain `passes as`; the working carries the pace `times`; the store relating\'s two ends are silent; the form and the spending are silent', synth.taken.length === 3 && !!mSig && J(mSig.atX.denied.map((m) => `${m.z} ${m.w}`)) === J(['hold is not in']) && J(mSig.atX.present.map((m) => `${m.z} ${m.w}`)) === J(['refrain passes as']) && mSig.atY.present.length + mSig.atY.denied.length === 0 && !!mSp && mSp.atX.present.length + mSp.atX.denied.length === 0 && J(mSp.atY.present.map((m) => `${m.z} ${m.w}`)) === J(['pace times']) && !!mSt && mSt.atX.present.length + mSt.atX.denied.length + mSt.atY.present.length + mSt.atY.denied.length === 0, { signal: mSig, working: mSp && mSp.atY, store: mSt });
check('§3 ★★ S5 THE REACH AND THE REFUSALS from the altitude alone: reach [signal, working] (in the record\'s order), refusal [the hold `is not in` the signal]', !!v3 && J(v3.altitude.reach) === J(['signal', 'working']) && J(v3.altitude.refusals) === J([{ x: 'signal', z: 'hold', w: 'is not in' }]), { reach: v3?.altitude.reach, refusals: v3?.altitude.refusals });
check('§3 S4 nothing is subtracted under the synthetic altitude either: the relatings byte-identical, the own part the same three, D7\'s state VACUOUS still (no fork: the refrain speaks at the signal alone, the pace at the working alone)', relatingsOn(synth.shape) === relatingsOn(shape0) && J(s3.own) === J(s0.own) && s3.state === 'VACUOUS' && v3.altitude.forks === 0, { state: s3.state, forks: v3?.altitude.forks });

// §4 — F6 the kill-condition (Δ88): change what T says and M's reading changes while the relatings do not
check('§4 ★★ F6 THE KILL-CONDITION HELD: two altitudes (ARMAN-2, the synthetic) on ONE record give TWO readings of the midpoint — different marks, reach, refusals, forks and site state — while the relatings on F–Φ are the same bytes in both', relatingsOn(written.shape) === relatingsOn(synth.shape) && J(v1.altitude.reach) !== J(v3.altitude.reach) && v1.altitude.forks !== v3.altitude.forks && s1.state !== s3.state && J([...v1.altitude.marks.get(keySignalForm).atX.present]) !== J([...v3.altitude.marks.get(keySignalForm).atX.present]), { arman2: { reach: v1.altitude.reach.length, forks: v1.altitude.forks, state: s1.state }, synthetic: { reach: v3.altitude.reach.length, forks: v3.altitude.forks, state: s3.state } });

// §5 — F7: a lone segment has no altitude (an edge with no triangular face through it: no view, no key)
const lone = { ...written.shape, faces: [] };
const s5 = SO.sortingOf(lone, eFP, {}, rules, facts);
check('§5 ★★ F7 A LONE SEGMENT: the same edge with no face through it has no view and no altitude — a midpoint of a triangulation and a lone segment with the same relatings differ by the altitudes alone', !!s5 && s5.views.length === 0 && A.altitudesAt(lone, eFP).length === 0 && A.altitudesAt(written.shape, eFP).length === 2 && J(s5.instances) === J(s1.instances), { views: s5?.views.length, altitudesAtTriangulation: A.altitudesAt(written.shape, eFP).map((a) => [written.shape.vertices[a.apex].data.label, a.entries.length]) });

// §6 — THE LIT GRID agreement (D24): the forks of ARMAN-2 — 33 passages by one role on 27 cells; the three relatings placed
const forkPaths = v1 ? v1.paths.filter((p) => p.path.source === 'altitude') : [];
const cells = new Set(forkPaths.map((p) => `${p.path.x}|${p.path.y}`));
const onCell = (x, y) => forkPaths.filter((p) => p.path.x === x && p.path.y === y);
check('§6 ★★ D24 THE FORKS FROM THE ALTITUDE: 33 passages by one role of T (the designer\'s corrected count, 08:45) on 27 of the 56 cells of F×Φ (the lit grid\'s RESULTS: 27 of 56 lit); each a FORK at its z with two mode legs, readable, under the source `altitude`, UNRULED until he says', forkPaths.length === 33 && cells.size === 27 && v1.altitude.forks === 33 && forkPaths.every((p) => p.path.shape === 'fork' && p.path.readable && p.path.from === 'z' && p.reading === 'UNRULED'), { forks: forkPaths.length, cells: cells.size, readings: [...new Set(forkPaths.map((p) => p.reading))] });
check('§6 ★★ THE THREE RELATINGS PLACED (§19.8): `the form passes as the signal` on a cell lit by the hold and the assuming (2 forks awaiting his verdict); `the working passes as the spending` by the hold and the marking refrain (2); `the waiting design passes as the store` DARK — the pair\'s own (0)', J(onCell('signal', 'form').map((p) => p.path.z).sort()) === J(['assuming', 'hold']) && J(onCell('spending', 'working').map((p) => p.path.z).sort()) === J(['atonic', 'hold']) && onCell('store', 'dormant').length === 0, { signalForm: onCell('signal', 'form').map((p) => `${p.path.z}: ${p.path.said[0].join(' ')} · ${p.path.said[1].join(' ')}`), spendingWorking: onCell('spending', 'working').map((p) => p.path.z), storeDormant: onCell('store', 'dormant').length });
check('§6 the site under ARMAN-2 leaves VACUOUS for UNRULED (D25: passages stand, nobody has said what they come to) and the edges\' own legs stay their own source — no path of source `legs` appears (nothing is related on F–T or T–Φ in this record)', s1.state === 'UNRULED' && v1.paths.every((p) => p.path.source === 'altitude') && v1.vacuous === true && v1.legs[0] === false && v1.legs[1] === false, { state: s1.state, sources: [...new Set(v1.paths.map((p) => p.path.source))], edgeLegsVacuous: v1.vacuous });

// §7 — the record rides the frozen lift untouched: a deep clone, then the snapshot's own loader (its namespacing of ids leaves the slot key and the role ids as they are)
const file = SN.serializeSnapshot(written.shape, 'altitude-witness', [], 'the record under ARMAN-2');
const loaded = SN.deserializeSnapshot(file, 'altitude-witness');
const loadedShape = loaded.shape;
const loadedFace = loadedShape.faces.find((f) => f.id.endsWith(faceFPT.id) || f.id.includes(faceFPT.id.split(':').pop()));
const slotT = A.apexSlotOf(faceFPT, T);
check('§7 ★★ THE RECORD RIDES THE LIFT: the snapshot (frozen) deep-clones the shape and its loader keeps the face\'s packet — the lifted face holds the same 39 entries at the same slot, byte for byte, with no vertex id anywhere in the packet', !!loadedFace && J(A.altitudeHeld(loadedFace, slotT)) === J(A.altitudeHeld(faceFPT, slotT)) && A.altitudeHeld(loadedFace, slotT).length === 0 ? false : (!!loadedFace && J(A.altitudeHeld(loadedFace, slotT)) === J(A.altitudeHeld(written.shape.faces.find((f) => f.id === faceFPT.id), slotT)) && Object.keys(written.shape.vertices).every((vid) => !J(written.shape.faces.find((f) => f.id === faceFPT.id).data).includes(vid))), { loadedEntries: loadedFace ? A.altitudeHeld(loadedFace, slotT).length : null, slot: slotT });
check('§7 a withdrawal takes one saying out and leaves the rest; an empty slot leaves no key behind; a saying with the other sign replaces (one entry per cell and word)', (() => {
  const f0 = written.shape.faces.find((f) => f.id === faceFPT.id);
  const f1 = A.withoutSaying(f0, slotT, 'hold', 'interprets', 'signal');
  const f2 = A.withSaying(f0, slotT, A.saying('hold', 'interprets', 'signal', '-'));
  let fe = f0; for (const s of A.altitudeHeld(f0, slotT)) fe = A.withoutSaying(fe, slotT, s[1], s[2], s[3]);
  return A.altitudeHeld(f1, slotT).length === 38 && A.altitudeHeld(f2, slotT).length === 39 && A.altitudeHeld(f2, slotT).find((s) => s[1] === 'hold' && s[2] === 'interprets' && s[3] === 'signal')[4] === '-' && A.altitudeHeld(fe, slotT).length === 0 && !(fe.data && fe.data[A.ALTITUDES_KEY]);
})());

// §8 — the sorting's other readers are unchanged by an altitude: the modes-1 sorting witness's own fixtures are untouched here (they hold no altitude), and on this record the inherited, the refused routes and the values read as before
check('§8 the sorting\'s other readings on this record are unchanged by the altitude: inherited none before and after; refused routes 0; the values of the three instances empty (all own) — the forks are UNRULED and compose onto nothing until he says', J(s1.inherited) === J(s0.inherited) && s1.refusedRoutes === 0 && [...s1.values.values()].every((v) => v.length === 0) && s1.own.length === 3, { inherited: s1.inherited.length, refusedRoutes: s1.refusedRoutes, own: s1.own.length });


// §9 — THE STORE'S ACTS AND THE LOG (slice 1 (b)): the saying given through the store, refused by name, replaced, withdrawn; the word declared
// into L on record; the log carries each act (D17) and a stage unapplies it exactly; the workspace export carries the record; the import
// purge names a saying in IS
console.log('\n----- §9 the store\'s acts and the log -----');
const { useGeometryStore, altitudeRefusalKey } = req('src/store/geometryStore.ts');
const ST = req('src/lib/stage.ts');
const S = () => useGeometryStore.getState();
S().importWorkspace(JSON.parse(J(save)));
const cur = () => S().shapes[S().currentShapeId];
const faceNow = () => cur().faces.find((f) => f.id === faceFPT.id);
const n0 = S().log.length; const lex0 = [...S().lexicon];
const r1 = S().giveAltitudeSaying(faceFPT.id, T, 'hold', 'interprets', 'signal', '+');
const held1 = A.altitudeHeld(faceNow(), slotT);
check("§9 ★★ THE ACT through the store: `the hold interprets the signal` in T's light is taken — the face holds it at T's slot; the word `interprets` is DECLARED into the lexicon on record (D1, D22) with its own `mode` log line, then the `altitude` line with the entry added (D17)",
  r1 === null && held1.length === 1 && J(held1[0]) === J(['say', 'hold', 'interprets', 'signal', '+']) && S().lexicon.includes('interprets') && !lex0.includes('interprets') && S().log.length === n0 + 2 && S().log[n0].act === 'mode' && S().log[n0].word === 'interprets' && S().log[n0 + 1].act === 'altitude' && S().log[n0 + 1].added.length === 1 && S().log[n0 + 1].apex === T && S().log[n0 + 1].slot === slotT,
  { r1, held: held1, logTail: S().log.slice(n0).map((e) => e.act) });
const r2 = S().giveAltitudeSaying(faceFPT.id, T, 'signal', 'passes as', 'refrain', '+');
const kept = S().altitudeRefusals[altitudeRefusalKey(faceFPT.id, T)];
S().withdrawAltitudeAttempt(faceFPT.id, T);
check("§9 ★★ THE REFUSAL through the store is returned AND kept by name under (face, light) — `in T's light a relating runs from a role of T; this one belongs in F's light` — with nothing written and nothing logged; `clear` takes it away",
  !!r2 && /belongs in F's light$/.test(r2.why) && !!kept && kept.why === r2.why && J(kept.saying) === J(['signal', 'passes as', 'refrain', '+']) && A.altitudeHeld(faceNow(), slotT).length === 1 && S().log.length === n0 + 2 && !S().altitudeRefusals[altitudeRefusalKey(faceFPT.id, T)],
  { r2, kept });
const r3 = S().giveAltitudeSaying(faceFPT.id, T, 'hold', 'interprets', 'signal', '+');
const sameAgain = S().log.length === n0 + 2;
S().giveAltitudeSaying(faceFPT.id, T, 'hold', 'interprets', 'signal', '-');
check('§9 the same saying again changes nothing and logs nothing; the same cell and word with the OTHER sign replaces it (one out, one in, one log line) and `interprets` is not declared twice',
  r3 === null && sameAgain && A.altitudeHeld(faceNow(), slotT).length === 1 && A.altitudeHeld(faceNow(), slotT)[0][4] === '-' && S().log.length === n0 + 3 && S().log[n0 + 2].added.length === 1 && S().log[n0 + 2].removed.length === 1 && S().lexicon.filter((w) => w === 'interprets').length === 1,
  { held: A.altitudeHeld(faceNow(), slotT), logLen: S().log.length - n0 });
S().withdrawAltitudeSaying(faceFPT.id, T, 'hold', 'interprets', 'signal');
check('§9 THE WITHDRAWAL takes the saying out and logs the hand back; the slot leaves no key; the word stays in the lexicon (declared — never lost by a withdrawal)',
  A.altitudeHeld(faceNow(), slotT).length === 0 && !(faceNow().data && faceNow().data[A.ALTITUDES_KEY]) && S().log.length === n0 + 4 && S().log[n0 + 3].act === 'altitude' && S().log[n0 + 3].removed.length === 1 && S().log[n0 + 3].added.length === 0 && S().lexicon.includes('interprets'),
  { data: faceNow().data, logLen: S().log.length - n0 });
const now = { shape: cur(), rules: S().rules, facts: { converses: S().converses, opaque: S().opaque }, lexicon: S().lexicon, tauDrafts: S().edgeTauDrafts };
const at3 = ST.recordAtStage(now, S().log, n0 + 3); const at0 = ST.recordAtStage(now, S().log, n0);
check('§9 ★★ THE STAGE (D17): the record at stage n0+3 holds the saying as it then stood (denied); the record at stage n0 holds none and its lexicon has no `interprets` — every altitude act unapplied exactly, latest first',
  J(A.altitudeHeld(at3.shape.faces.find((f) => f.id === faceFPT.id), slotT)) === J([['say', 'hold', 'interprets', 'signal', '-']]) && A.altitudeHeld(at0.shape.faces.find((f) => f.id === faceFPT.id), slotT).length === 0 && !at0.lexicon.includes('interprets') && at3.lexicon.includes('interprets'),
  { at3: A.altitudeHeld(at3.shape.faces.find((f) => f.id === faceFPT.id), slotT), at0: A.altitudeHeld(at0.shape.faces.find((f) => f.id === faceFPT.id), slotT) });
S().giveAltitudeSaying(faceFPT.id, T, 'hold', 'interprets', 'signal', '+');
const exported = S().exportWorkspace();
const fx = exported.shapes[exported.currentShapeId].faces.find((f) => f.id === faceFPT.id);
S().importWorkspace(JSON.parse(J(exported)));
check("§9 ★★ THE EXPORT carries the altitude inside `shapes` (the face's packet) and the log beside it; a fresh import reads the same saying",
  !!fx && J(A.altitudeHeld(fx, slotT)) === J([['say', 'hold', 'interprets', 'signal', '+']]) && exported.log.some((e) => e.act === 'altitude') && J(A.altitudeHeld(faceNow(), slotT)) === J([['say', 'hold', 'interprets', 'signal', '+']]),
  { exportedEntries: fx ? A.altitudeHeld(fx, slotT) : null });
const tainted = JSON.parse(J(exported)); const tf = tainted.shapes[tainted.currentShapeId].faces.find((f) => f.id === faceFPT.id); tf.data.altitudes[String(slotT)].push(['say', 'hold', 'IS', 'signal', '+']);
const notTaken = S().importWorkspace(tainted);
check("§9 THE IMPORT PURGE (M4): a foreign file's saying in IS is not taken, named in its own words — `the saying \"hold IS signal\" in a light on F·Φ·T` — and the well-formed saying beside it is taken",
  notTaken.some((s) => /^the saying "hold IS signal" in a light on /.test(s)) && J(A.altitudeHeld(faceNow(), slotT)) === J([['say', 'hold', 'interprets', 'signal', '+']]),
  { notTaken });

console.log(`\nDIAGNOSE-THE-ALTITUDE: ${failures === 0 ? 'ALL PASS — the opposite corner speaks at the midpoint as marks on what is related there, never subtracting; its forks are passages the person decides; an empty altitude is VACUOUS; the record rides the lift' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

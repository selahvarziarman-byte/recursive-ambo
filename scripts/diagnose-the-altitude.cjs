#!/usr/bin/env node

// DIAGNOSTIC — STAMP THE-ALTITUDE · slice 1 (2026-10-09; ADR 0031 §9.29 D22–D25; the ruling THE PROJECTION §19; the mothership's
// 09:09 BUILD on Arman's word): THE ALTITUDE'S RECORD AND ITS READERS, on Virgin Land's record of 10-07 18:34 with Arman's own share
// (ARMAN-2) written in through the lib — agreeing with the reference instruments `the_altitude_marks.cjs` (39 taken · 0 refused · the
// marks at the ends) and `the_lit_grid.cjs` (27 of 56 cells lit by one role) and with the designer's data-checked lines (08:45, 08:51); every saying carries its END by the end corner's SLOT (the mothership's M2, 11:54),
// and the reader refuses by name one filed under the wrong end.
// §0 purity · §1 F1 the midpoint reads under T at once with non-empty marks and the relatings byte-identical before and after; an empty
// altitude reads VACUOUS under T · §2 F2 the direction law refuses an end's role as subject BY NAME; IS and ≡ refused · §3 F3 the marks land
// on the right ends and nowhere else (the instrument's S3–S5 control) · §4 F6 the kill-condition: two altitudes on one record, two readings,
// the relatings unchanged · §5 F7 a lone segment has no altitude · §6 the lit grid: 33 forks on 27 cells; the three relatings placed (2 ·
// 2 · 0) · §7 the record rides the frozen lift untouched (slot keys, no vertex id) · §8 the sorting's other readers unchanged by an altitude
// · §9 the store's acts and the log (slice 1 (b)): given, refused by name and kept, replaced, withdrawn; the word declared into L; the stage unapplies; the export carries it; the import purge names IS
// · §10 the surface under node (slice 1 (c)): the line asked first, the point tab's per-view line, the modes tab's head by one role beside the legs' head, `under T · show`, F5 without a light
// · §11 slice 3: D26 the meet (`meetOf`, never merged); D27 · R4 the name against the light, as it stood at the name's stage (the designer's 08:45 §7 line); the coarser resolution; the designer's §8 the face's three, each with `open`
// · §12 the designer's 13:40 (7) with her 13:41 clause: the light's words placed on his sitting — none over another word, a role's name or a point.
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
    const end = cornerOf(next, roleRef(it.to).side); const act = A.altitudeSayingOf(next, faceId, apex, end, z, w, x, sign); // M2 — the end corner from the hand's `to` side
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
check('§1 ★★ F1 (the empty altitude): before any saying the view T reads VACUOUS UNDER T — 0 entries, no mark on any relating, no fork — and the site\'s state is what it was (D7 beside, untouched: VACUOUS, the three instances own)', !!v0 && v0.altitude.vacuousUnder === true && v0.altitude.entries === 0 && v0.altitude.forks === 0 && v0.altitude.marks.size === 0 && s0.state === 'VACUOUS' && s0.own.length === 3, { state: s0.state, own: s0.own, vacuousUnder: v0?.altitude.vacuousUnder });
const eF = A.endSlotOf(faceFPT, F); const eP = A.endSlotOf(faceFPT, PHI); // M2 — the ends' slots in the face F·Φ·T
const written = writeHand(shape0, hand.relatings, T, faceFPT.id);
// M2 — THE READER REFUSES BY NAME a saying filed under the wrong end: `hold keeps signal` written straight into the packet under Φ's slot (no act files it so)
{
  const slotT0 = A.apexSlotOf(faceFPT, T);
  const misFace = A.withSaying(written.shape.faces.find((f) => f.id === faceFPT.id), slotT0, ['say', 'hold', 'keeps', eP, 'signal', '+']);
  const misShape = { ...written.shape, faces: written.shape.faces.map((f) => (f.id === faceFPT.id ? misFace : f)) };
  const misRead = A.altitudeOf(misShape, faceFPT.id, T);
  const misView = viewT(SO.sortingOf(misShape, eFP, {}, rules, facts));
  check('§1 ★★ M2 THE READER REFUSES BY NAME a relating filed under the wrong end: `hold keeps signal` under Φ\'s slot is held (40 entries) but NOT READ — `"hold keeps signal": signal is a role of F, not of Φ — a relating is filed under its end` — and counted by no reader (39 read; the sorting sees 39)',
    A.altitudeHeld(misFace, slotT0).length === 40 && !!misRead && misRead.entries.length === 39 && misRead.notRead.length === 1 && misRead.notRead[0].kind === 'misfiled' && /^"hold keeps signal": signal is a role of F, not of Φ — a relating is filed under its end$/.test(misRead.notRead[0].why) && !!misView && misView.altitude.entries === 39,
    { notRead: misRead && misRead.notRead, read: misRead && misRead.entries.length, sorted: misView && misView.altitude.entries });
}
const s1 = SO.sortingOf(written.shape, eFP, {}, rules, facts);
const v1 = viewT(s1);
check('§1 ★★ F1: ARMAN-2\'s 39 sayings go in through the checked act — 39 taken, 0 refused (the instrument: 39 entries taken · 0 refused) — and the altitude holds 39 entries at T\'s slot of the face F·Φ·T', written.taken.length === 39 && written.refused.length === 0 && A.altitudeOf(written.shape, faceFPT.id, T).entries.length === 39, { taken: written.taken.length, refused: written.refused });
check('§1 ★★ F1: the midpoint reads UNDER T at once — not vacuous, 39 entries — and the relatings on F–Φ are BYTE-IDENTICAL before and after (nothing subtracted, merged, refused or locked by a mark); the instances, the bars and the own part are what they were', !!v1 && v1.altitude.vacuousUnder === false && v1.altitude.entries === 39 && relatingsOn(written.shape) === relatingsOn(shape0) && J(s1.instances) === J(s0.instances) && J(s1.bars) === J(s0.bars) && J(s1.own) === J(s0.own), { relatingsSame: relatingsOn(written.shape) === relatingsOn(shape0), own: s1.own, state: s1.state });
// the marks at the relating `the form passes as the signal`, read at its two END CELLS by role — x = signal (F, the edge's first corner), y = form (Φ) — as the designer read them off the data (08:45 §5, 08:51)
const at = (v, e, role) => (v && v.altitude.marks.get(A.cellKey(e, role))) || { present: [], denied: [] }; // M2 — a cell is (end slot, role)
const mSF = v1 ? { atX: at(v1, eF, 'signal'), atY: at(v1, eP, 'form') } : null;
const atSignal = mSF ? [...named(written.shape, T, mSF.atX.present), ...named(written.shape, T, mSF.atX.denied)] : [];
const atForm = mSF ? [...named(written.shape, T, mSF.atY.present), ...named(written.shape, T, mSF.atY.denied)] : [];
note(`the form passes as the signal — at the signal: ${atSignal.join(' · ')} — at the form: ${atForm.join(' · ')}`);
check('§1 ★★ D23 THE MARKS at `the form passes as the signal`, as the designer read them off ARMAN-2: at the signal `the hold interprets · the marking refrain might.pass.as · the assuming translates` present and `the marking refrain requires · the other emits` denied; at the form `the hold is.a.mode.of · the living refrain might.act.as · the assuming supervenes.on · the other push.against`, all four present (her 08:51)',
  !!mSF && J(mSF.atX.present.map((m) => `${m.z} ${m.w}`)) === J(['hold interprets', 'atonic might.pass.as', 'assuming translates']) && J(mSF.atX.denied.map((m) => `${m.z} ${m.w}`)) === J(['atonic requires', 'other emits']) && J(mSF.atY.present.map((m) => `${m.z} ${m.w}`)) === J(['hold is.a.mode.of', 'refrain might.act.as', 'assuming supervenes.on', 'other push.against']) && mSF.atY.denied.length === 0,
  { atX: mSF && { present: mSF.atX.present.map((m) => `${m.z} ${m.w}`), denied: mSF.atX.denied.map((m) => `${m.z} ${m.w}`) }, atY: mSF && { present: mSF.atY.present.map((m) => `${m.z} ${m.w}`), denied: mSF.atY.denied.map((m) => `${m.z} ${m.w}`) } });
check('§1 ★★ D23 THE REACH AND THE REFUSALS, read from the altitude alone: 14 end-roles reached (all 8 of F\'s, 6 of Φ\'s 7 — the waiting design silent), 6 denied cells (his six denials)', !!v1 && v1.altitude.reach.length === 14 && v1.altitude.refusals.length === 6 && !v1.altitude.reach.some((c) => c.x === 'dormant'), { reach: v1?.altitude.reach, refusals: v1?.altitude.refusals.map((r) => `${r.z} ${r.w} ${r.x}`) });

// §2 — F2: the direction law, by name
const wrong = A.altitudeSayingOf(shape0, faceFPT.id, T, F, 'signal', 'passes as', 'refrain', '+');
const right = A.altitudeSayingOf(shape0, faceFPT.id, T, F, 'refrain', 'passes as', 'signal', '+');
const inIS = A.altitudeSayingOf(shape0, faceFPT.id, T, F, 'hold', 'IS', 'signal', '+');
const inGlyph = A.altitudeSayingOf(shape0, faceFPT.id, T, F, 'hold', '≡', 'signal', '-');
const stranger = A.altitudeSayingOf(shape0, faceFPT.id, T, F, 'nobody', 'passes as', 'signal', '+');
const toZ = A.altitudeSayingOf(shape0, faceFPT.id, T, F, 'hold', 'keeps', 'refrain', '+');
const misfiled = A.altitudeSayingOf(shape0, faceFPT.id, T, PHI, 'hold', 'keeps', 'signal', '+'); // M2 — F's role handed in under Φ
check('§2 ★★ F2 THE DIRECTION LAW: a saying whose subject is a role of F is REFUSED BY NAME, its own light named (`in T\'s light a relating runs from a role of T; this one belongs in F\'s light`); the same two roles with T\'s as subject are taken', !!wrong.refused && /^in T's light a relating runs from a role of T; this one belongs in F's light$/.test(wrong.refused.why) && wrong.refused.corner === F && !right.refused && right.saying[1] === 'refrain' && right.saying[3] === eF && right.saying[4] === 'signal', { wrong: wrong.refused, right: right.saying });
check('§2 ★★ M2 THE END IS IN THE RECORD: a relating handed in under Φ whose role is F\'s is refused BY NAME (`signal is a role of F, not of Φ: a relating is filed under its end`), the other end named; the one taken carries F\'s slot as its fourth place', !!misfiled.refused && /^signal is a role of F, not of Φ: a relating is filed under its end$/.test(misfiled.refused.why) && misfiled.refused.corner === F && right.saying[3] === eF, { misfiled: misfiled.refused, right: right.saying });
check('§2 ★★ IS and ≡ are refused in a light by the one predicate (a saying in IS would pair; the pairing has one home); a stranger to T is refused as not T\'s role; a role of T as the OBJECT is refused (a saying runs from T\'s role to an end\'s)', !!inIS.refused && /can't be ≡ or IS/.test(inIS.refused.why) && !!inGlyph.refused && /can't be ≡ or IS/.test(inGlyph.refused.why) && !!stranger.refused && /nobody isn't a role of T/.test(stranger.refused.why) && !!toZ.refused && /refrain is a role of T/.test(toZ.refused.why), { inIS: inIS.refused?.why, stranger: stranger.refused?.why, toZ: toZ.refused?.why });

// §3 — F3 (the instrument's S3–S5 control): the synthetic altitude — hold ✗ `is not in` at the signal, the living refrain `passes as` at the signal, the pace `times` at the working
const synth = writeHand(shape0, [{ from: 'T:hold', word: 'is not in', to: 'F:signal', holds: false }, { from: 'T:refrain', word: 'passes as', to: 'F:signal', holds: true }, { from: 'T:pace', word: 'times', to: 'Φ:working', holds: true }], T, faceFPT.id);
const s3 = SO.sortingOf(synth.shape, eFP, {}, rules, facts); const v3 = viewT(s3);
const mSig = v3 ? { atX: at(v3, eF, 'signal'), atY: at(v3, eP, 'form') } : null; const mSp = v3 ? { atX: at(v3, eF, 'spending'), atY: at(v3, eP, 'working') } : null; const mSt = v3 ? { atX: at(v3, eF, 'store'), atY: at(v3, eP, 'dormant') } : null;
check('§3 ★★ F3 THE MARKS LAND ON THE RIGHT ENDS AND NOWHERE ELSE (S3): the signal carries hold ✗ `is not in` and the living refrain `passes as`; the working carries the pace `times`; the store relating\'s two ends are silent; the form and the spending are silent — the map names exactly two cells, the signal and the working, and nowhere else', synth.taken.length === 3 && !!v3 && J([...v3.altitude.marks.keys()]) === J([A.cellKey(eF, 'signal'), A.cellKey(eP, 'working')]) && !!mSig && J(mSig.atX.denied.map((m) => `${m.z} ${m.w}`)) === J(['hold is not in']) && J(mSig.atX.present.map((m) => `${m.z} ${m.w}`)) === J(['refrain passes as']) && mSig.atY.present.length + mSig.atY.denied.length === 0 && !!mSp && mSp.atX.present.length + mSp.atX.denied.length === 0 && J(mSp.atY.present.map((m) => `${m.z} ${m.w}`)) === J(['pace times']) && !!mSt && mSt.atX.present.length + mSt.atX.denied.length + mSt.atY.present.length + mSt.atY.denied.length === 0, { signal: mSig, working: mSp && mSp.atY, store: mSt });
check('§3 ★★ S5 THE REACH AND THE REFUSALS from the altitude alone: reach [signal, working] (in the record\'s order), refusal [the hold `is not in` the signal]', !!v3 && J(v3.altitude.reach) === J([{ e: eF, x: 'signal' }, { e: eP, x: 'working' }]) && J(v3.altitude.refusals) === J([{ e: eF, x: 'signal', z: 'hold', w: 'is not in' }]), { reach: v3?.altitude.reach, refusals: v3?.altitude.refusals });
check('§3 S4 nothing is subtracted under the synthetic altitude either: the relatings byte-identical, the own part the same three, D7\'s state VACUOUS still (no fork: the refrain speaks at the signal alone, the pace at the working alone)', relatingsOn(synth.shape) === relatingsOn(shape0) && J(s3.own) === J(s0.own) && s3.state === 'VACUOUS' && v3.altitude.forks === 0, { state: s3.state, forks: v3?.altitude.forks });

// §4 — F6 the kill-condition (Δ88): change what T says and M's reading changes while the relatings do not
check('§4 ★★ F6 THE KILL-CONDITION HELD: two altitudes (ARMAN-2, the synthetic) on ONE record give TWO readings of the midpoint — different marks, reach, refusals, forks and site state — while the relatings on F–Φ are the same bytes in both', relatingsOn(written.shape) === relatingsOn(synth.shape) && J(v1.altitude.reach) !== J(v3.altitude.reach) && v1.altitude.forks !== v3.altitude.forks && s1.state !== s3.state && J(mSF.atX.present) !== J(mSig.atX.present), { arman2: { reach: v1.altitude.reach.length, forks: v1.altitude.forks, state: s1.state }, synthetic: { reach: v3.altitude.reach.length, forks: v3.altitude.forks, state: s3.state } });

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
  const f1 = A.withoutSaying(f0, slotT, 'hold', 'interprets', eF, 'signal');
  const f2 = A.withSaying(f0, slotT, A.saying('hold', 'interprets', eF, 'signal', '-'));
  let fe = f0; for (const s of A.altitudeHeld(f0, slotT)) fe = A.withoutSaying(fe, slotT, s[1], s[2], s[3], s[4]);
  return A.altitudeHeld(f1, slotT).length === 38 && A.altitudeHeld(f2, slotT).length === 39 && A.altitudeHeld(f2, slotT).find((s) => s[1] === 'hold' && s[2] === 'interprets' && s[4] === 'signal')[5] === '-' && A.altitudeHeld(fe, slotT).length === 0 && !(fe.data && fe.data[A.ALTITUDES_KEY]);
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
const r1 = S().giveAltitudeSaying(faceFPT.id, T, F, 'hold', 'interprets', 'signal', '+');
const held1 = A.altitudeHeld(faceNow(), slotT);
check("§9 ★★ THE ACT through the store: `the hold interprets the signal` in T's light is taken — the face holds it at T's slot; the word `interprets` is DECLARED into the lexicon on record (D1, D22) with its own `mode` log line, then the `altitude` line with the entry added (D17)",
  r1 === null && held1.length === 1 && J(held1[0]) === J(['say', 'hold', 'interprets', eF, 'signal', '+']) && S().lexicon.includes('interprets') && !lex0.includes('interprets') && S().log.length === n0 + 2 && S().log[n0].act === 'mode' && S().log[n0].word === 'interprets' && S().log[n0 + 1].act === 'altitude' && S().log[n0 + 1].added.length === 1 && S().log[n0 + 1].apex === T && S().log[n0 + 1].slot === slotT,
  { r1, held: held1, logTail: S().log.slice(n0).map((e) => e.act) });
const r2 = S().giveAltitudeSaying(faceFPT.id, T, F, 'signal', 'passes as', 'refrain', '+');
const kept = S().altitudeRefusals[altitudeRefusalKey(faceFPT.id, T)];
S().withdrawAltitudeAttempt(faceFPT.id, T);
check("§9 ★★ THE REFUSAL through the store is returned AND kept by name under (face, light) — `in T's light a relating runs from a role of T; this one belongs in F's light` — with nothing written and nothing logged; `clear` takes it away",
  !!r2 && /belongs in F's light$/.test(r2.why) && !!kept && kept.why === r2.why && J(kept.saying) === J(['signal', 'passes as', 'refrain', '+']) && A.altitudeHeld(faceNow(), slotT).length === 1 && S().log.length === n0 + 2 && !S().altitudeRefusals[altitudeRefusalKey(faceFPT.id, T)],
  { r2, kept });
const r3 = S().giveAltitudeSaying(faceFPT.id, T, F, 'hold', 'interprets', 'signal', '+');
const sameAgain = S().log.length === n0 + 2;
S().giveAltitudeSaying(faceFPT.id, T, F, 'hold', 'interprets', 'signal', '-');
check('§9 the same saying again changes nothing and logs nothing; the same cell and word with the OTHER sign replaces it (one out, one in, one log line) and `interprets` is not declared twice',
  r3 === null && sameAgain && A.altitudeHeld(faceNow(), slotT).length === 1 && A.altitudeHeld(faceNow(), slotT)[0][5] === '-' && S().log.length === n0 + 3 && S().log[n0 + 2].added.length === 1 && S().log[n0 + 2].removed.length === 1 && S().lexicon.filter((w) => w === 'interprets').length === 1,
  { held: A.altitudeHeld(faceNow(), slotT), logLen: S().log.length - n0 });
S().withdrawAltitudeSaying(faceFPT.id, T, F, 'hold', 'interprets', 'signal');
check('§9 THE WITHDRAWAL takes the saying out and logs the hand back; the slot leaves no key; the word stays in the lexicon (declared — never lost by a withdrawal)',
  A.altitudeHeld(faceNow(), slotT).length === 0 && !(faceNow().data && faceNow().data[A.ALTITUDES_KEY]) && S().log.length === n0 + 4 && S().log[n0 + 3].act === 'altitude' && S().log[n0 + 3].removed.length === 1 && S().log[n0 + 3].added.length === 0 && S().lexicon.includes('interprets'),
  { data: faceNow().data, logLen: S().log.length - n0 });
const now = { shape: cur(), rules: S().rules, facts: { converses: S().converses, opaque: S().opaque }, lexicon: S().lexicon, tauDrafts: S().edgeTauDrafts };
const at3 = ST.recordAtStage(now, S().log, n0 + 3); const at0 = ST.recordAtStage(now, S().log, n0);
check('§9 ★★ THE STAGE (D17): the record at stage n0+3 holds the saying as it then stood (denied); the record at stage n0 holds none and its lexicon has no `interprets` — every altitude act unapplied exactly, latest first',
  J(A.altitudeHeld(at3.shape.faces.find((f) => f.id === faceFPT.id), slotT)) === J([['say', 'hold', 'interprets', eF, 'signal', '-']]) && A.altitudeHeld(at0.shape.faces.find((f) => f.id === faceFPT.id), slotT).length === 0 && !at0.lexicon.includes('interprets') && at3.lexicon.includes('interprets'),
  { at3: A.altitudeHeld(at3.shape.faces.find((f) => f.id === faceFPT.id), slotT), at0: A.altitudeHeld(at0.shape.faces.find((f) => f.id === faceFPT.id), slotT) });
S().giveAltitudeSaying(faceFPT.id, T, F, 'hold', 'interprets', 'signal', '+');
const exported = S().exportWorkspace();
const fx = exported.shapes[exported.currentShapeId].faces.find((f) => f.id === faceFPT.id);
S().importWorkspace(JSON.parse(J(exported)));
check("§9 ★★ THE EXPORT carries the altitude inside `shapes` (the face's packet) and the log beside it; a fresh import reads the same saying",
  !!fx && J(A.altitudeHeld(fx, slotT)) === J([['say', 'hold', 'interprets', eF, 'signal', '+']]) && exported.log.some((e) => e.act === 'altitude') && J(A.altitudeHeld(faceNow(), slotT)) === J([['say', 'hold', 'interprets', eF, 'signal', '+']]),
  { exportedEntries: fx ? A.altitudeHeld(fx, slotT) : null });
const tainted = JSON.parse(J(exported)); const tf = tainted.shapes[tainted.currentShapeId].faces.find((f) => f.id === faceFPT.id); tf.data.altitudes[String(slotT)].push(['say', 'hold', 'IS', eF, 'signal', '+']);
const notTaken = S().importWorkspace(tainted);
check("§9 THE IMPORT PURGE (M4): a foreign file's saying in IS is not taken, named in its own words — `the saying \"hold IS signal\" in a light on F·Φ·T` — and the well-formed saying beside it is taken",
  notTaken.some((s) => /^the relating "hold IS signal" in a light on /.test(s)) && J(A.altitudeHeld(faceNow(), slotT)) === J([['say', 'hold', 'interprets', eF, 'signal', '+']]),
  { notTaken });


// §10 — THE SURFACE UNDER NODE (slice 1 (c); the designer's §1, §5, §6 — the lines a light needs no click for): the midpoint F–Φ rendered on the
// record with ARMAN-2 written in — the line asked first per opposite corner, the point tab's per-view line, the modes tab's head by one role
// beside the legs' head unchanged, the acts' `under T · show`, and F5 where it can be read without a light open
console.log('\n----- §10 the surface under node -----');
{
  const React = require('react');
  const { renderToString } = require('react-dom/server');
  const { MidpointSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
  const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
  const { spaceOf } = req('src/lib/spaceOf.ts');
  const render = (shape) => {
    useGeometryStore.setState({ shapes: { [shape.id]: shape }, shapeOrder: [shape.id], currentShapeId: shape.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, altitudeRefusals: {}, lexicon: save.lexicon || [], rules: save.rules || [], converses: save.converses || [], opaque: save.opaque || [] });
    const mid = Object.values(shape.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(F) && v.createdBy.sourceVertexIds.includes(PHI));
    const packet = buildGeneralSitePacketPresenterReport(shape).packets.find((p) => p.trace.siteId === mid.id);
    const site = midpointSiteOf(shape, mid.id, packet ? packet.trace : null);
    const resolved = spaceOf(shape, mid.id);
    const parents = [spaceOf(shape, site.a), spaceOf(shape, site.b)];
    return renderToString(React.createElement(MidpointSurface, { shape, site, parents, resolved, refusal: null, remade: null })).replace(/<!-- -->/g, '');
  };
  const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' '); // the renderer escapes the apostrophe as &#x27;
  const h0 = render(shape0); const h1 = render(written.shape);
  const lines = (html) => [...html.matchAll(/data-altitude-line="([^"]+)" data-altitude-count="(\d+)"/g)].map((m) => [shape0.vertices[m[1]]?.data?.label || m[1], Number(m[2])]);
  check('§10 ★★ THE LINE ASKED FIRST (§1): at the top of the pairing, one line per opposite corner — before any saying `T\'s roles: none related to F or Φ here yet · open T\'s light` and the same for U; with ARMAN-2 in, `T\'s roles: 39 relatings to F and Φ here · open T\'s light` while U\'s line stands unchanged', J(lines(h0).sort()) === J([['T', 0], ['U', 0]]) && J(lines(h1).sort()) === J([['T', 39], ['U', 0]]) && /T's roles: none related to F or Φ here yet · open T's light/.test(text(h0)) && /T's roles: 39 relatings to F and Φ here · open T's light/.test(text(h1)) && /U's roles: none related to F or Φ here yet · open U's light/.test(text(h1)), { before: lines(h0), after: lines(h1) });
  check('§10 ★★ THE POINT TAB\'S PER-VIEW LINE (§5; D25): before, `T\'s roles: none related to F or Φ here yet` (VACUOUS under T); after, `under T: 39 relatings from T\'s roles · reaching 14 roles of F and Φ · 6 don\'t hold` — his words as the designer wrote them (08:45); U\'s line unchanged', /data-medium-under="T" data-medium-under-count="0"/.test(h0) && /data-medium-under="T" data-medium-under-count="39"/.test(h1) && /under T: 39 relatings from T's roles · reaching 14 roles of F and Φ · 6 don't hold/.test(text(h1)) && /data-medium-under="U" data-medium-under-count="0"/.test(h1), { under: [...h1.matchAll(/data-medium-under="([^"]+)" data-medium-under-count="(\d+)"/g)].map((m) => [m[1], m[2]]) });
  check('§10 ★★ THE MODES TAB, T\'S CORNER LINE (STAMP THE-MODES-TAB §1.3; §6\'s count by one role): `T — nothing on its edges · 33 by one role · …` — its edges and its light side by side, never merged; no route rendered until a cell is chosen (each sits on its cell\'s card); before any saying `T — nothing on its edges · nothing in its light yet · open T\'s light`', /T — nothing on its edges · 33 by one role/.test(text(h1)) && /data-medium-corner="T" data-medium-corner-edges="0" data-medium-corner-forks="33"/.test(h1) && (h1.match(/data-medium-passage="/g) || []).length === 0 && /T — nothing on its edges · nothing in its light yet · open T's light/.test(text(h0)), { corners: [text(h0).match(/T — [^·]*(·[^·]*){0,4}/), text(h1).match(/T — [^·]*(·[^·]*){0,4}/)].map((m) => m && m[0]) });
  check('§10 ★★ `under T · show` (§5) on each of the three relatings of F–Φ, none on the bar, none before T spoke; nothing on the relatings themselves changes (D23): the three listings print as before', (h1.match(/data-altitude-under-show="/g) || []).length === 3 && !/data-altitude-under-show/.test(h0) && (h1.match(/data-medium-relating="/g) || []).length === (h0.match(/data-medium-relating="/g) || []).length && /under T · show/.test(text(h1)), { underShow: (h1.match(/data-altitude-under-show="[^"]+"/g) || []) });
  check('§10 F5 where it reads without a light: no `list=` on any input, no sign pre-chosen, no altitude passage lit by default; and no light\'s tab or box renders while no light is open (the box is the light\'s and the eye\'s)', !/ list="/.test(h1) && !/data-altitude-sign-chosen/.test(h1) && !/data-midpoint-panel="light"/.test(h1) && !/data-midpoint-tab="light"/.test(h1), {});
}


// §11 — slice 3: D26 THE MEET (the lib's reader), D27 · R4 THE NAME AGAINST THE LIGHT (the christening line under node, as it stood at the name's stage), the designer's §8 THE FACE'S THREE
console.log('\n----- §11 slice 3: the meet · the name against the light · the face\'s three -----');
{
  const eFT = edgeBetween(shape0, F, T);
  const sHold = ['say', 'hold', 'interprets', eF, 'signal', '+'];
  const withFT = (rel) => ({ ...written.shape, edges: written.shape.edges.map((e) => (e.id === eFT.id ? { ...e, data: { ...(e.data || {}), relatings: [...((e.data && e.data.relatings) || []), rel] } } : e)) });
  const fOrder = eFT.vertexIds[0] === F;
  const meets = A.meetOf(withFT(fOrder ? ['interprets', 'signal', 'hold', '+'] : ['interprets', 'hold', 'signal', '+']), faceFPT, T, sHold);
  const other = A.meetOf(withFT(fOrder ? ['keeps', 'signal', 'hold', '+'] : ['keeps', 'hold', 'signal', '+']), faceFPT, T, sHold);
  const denied = A.meetOf(withFT(fOrder ? ['interprets', 'signal', 'hold', '-'] : ['interprets', 'hold', 'signal', '-']), faceFPT, T, sHold);
  check('§11 ★★ D26 THE MEET, read never merged: `the hold interprets the signal` in T\'s light at F–Φ ALSO stands on F–T once F–T holds `interprets` between the signal and the hold with the same sign — `meetOf` names that edge; a different word, or the other sign, meets nothing; on Virgin Land\'s record as it stands, nothing meets (F–T holds no relating)',
    !!meets && meets.id === eFT.id && other === null && denied === null && A.meetOf(written.shape, faceFPT, T, sHold) === null,
    { meets: meets && meets.id, other, denied });
  // the face's three and the christening line under node — the store set up as §10, T's light spoken, the midpoint named AFTER (the stage holds the sayings)
  const React = require('react');
  const { renderToString } = require('react-dom/server');
  const { useGeometryStore } = req('src/store/geometryStore.ts');
  const { MidpointSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
  const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
  const { spaceOf } = req('src/lib/spaceOf.ts');
  const shapeA = { ...shape0, faces: shape0.faces.map((f) => (f.id === faceFPT.id ? written.shape.faces.find((g) => g.id === faceFPT.id) : f)) };
  const mid = Object.values(shapeA.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(F) && v.createdBy.sourceVertexIds.includes(PHI));
  const renderAt = (shapeX) => {
    const packet = buildGeneralSitePacketPresenterReport(shapeX).packets.find((p) => p.trace.siteId === mid.id);
    const site = midpointSiteOf(shapeX, mid.id, packet ? packet.trace : null);
    const html = renderToString(React.createElement(MidpointSurface, { shape: shapeX, site, parents: [spaceOf(shapeX, site.a), spaceOf(shapeX, site.b)], resolved: spaceOf(shapeX, mid.id), refusal: null, remade: null })).replace(/<!-- -->/g, '');
    return { html, text: html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ') };
  };
  // the three: T spoke (39), F and Φ have not — each with `open` (the seed is dissected: every edge has its midpoint)
  useGeometryStore.setState({ shapes: { [shapeA.id]: shapeA }, shapeOrder: [shapeA.id], currentShapeId: shapeA.id, selectedVertexId: mid.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, altitudeRefusals: {}, lightRequest: null, lexicon: save.lexicon || [], rules: save.rules || [], bondRules: [], converses: save.converses || [], opaque: save.opaque || [], log: [] });
  const r0 = renderAt(shapeA);
  const threes = [...r0.html.matchAll(/data-midpoint-face-light="([^"]+)" data-midpoint-face-light-count="(\d+)"/g)].map((m) => [m[1], Number(m[2])]);
  check('§11 ★★ THE FACE\'S THREE (the designer\'s §8): where the face F·Φ·T is read, its three — `T\'s roles in F and Φ: 39 relatings`, `F\'s roles in Φ and T: none yet`, `Φ\'s roles in T and F: none yet` — each with `open`; the corners tab lists the other face through F–Φ too, F·U·Φ, with its three (U silent), six lines in all, each with `open` (the seed is dissected: every edge has its midpoint)',
    threes.length === 6 && threes.filter((x) => x[0] === 'T' && x[1] === 39).length === 1 && threes.filter((x) => x[1] === 0).length === 5 && /T's roles in F and Φ: 39 relatings/.test(r0.text) && /F's roles in Φ and T: none yet/.test(r0.text) && /Φ's roles in T and F: none yet/.test(r0.text) && /U's roles in /.test(r0.text) && (r0.html.match(/data-midpoint-face-open="/g) || []).length === 6,
    { threes, opens: (r0.html.match(/data-midpoint-face-open="/g) || []).length });
  // the name, given AFTER T spoke: the sayings written through the store so the LOG holds them before the naming act
  useGeometryStore.setState({ shapes: { [shape0.id]: shape0 }, shapeOrder: [shape0.id], currentShapeId: shape0.id, selectedVertexId: mid.id, log: [], lexicon: save.lexicon || [] });
  for (const it of hand.relatings) useGeometryStore.getState().giveAltitudeSaying(faceFPT.id, T, cornerOf(shape0, roleRef(it.to).side), roleRef(it.from).id, String(it.word || '').trim(), roleRef(it.to).id, it.holds === false ? '-' : '+');
  useGeometryStore.getState().updateSelectedVertexData({ label: 'Honesty' });
  const rN = renderAt(useGeometryStore.getState().shapes[shape0.id]);
  const named = (rN.text.match(/named Honesty[^;]*/) || [''])[0];
  note(`the christening line: ${named.slice(0, 600)}`);
  // ADR §9.33 (ratified, the mothership's 14:42): only the child's instances' ends — F's signal, spending, store; Φ's form, working, waiting design
  const herDenied = ['the hold collapses.under the spending', 'the hold is the store', 'the marking refrain requires the signal', 'the other emits the signal'];
  const herCuts = ['at the signal, the hold makes other the other'];
  const outOfScope = ['the living refrain passes.as the current', 'the broken hold acts.as the leap', 'at the leap, the living refrain keeps the broken hold'];
  check('§11 ★★ D27 · R4 THE NAME AGAINST THE LIGHT, IN §9.33\'s SCOPE (the designer\'s 08:45 §7; ADR §9.33, ratified 14:42): `named Honesty … against T, where these don\'t hold: ` the four of his six denials at the ends of the child\'s instances, in the log\'s order, then `cut by them: at the signal, the hold makes other the other` — the current\'s and the leap\'s denials and the leap\'s cut stay with the altitude, never on the line; as they stood at the name\'s stage, re-derived from the log, nothing stored',
    named.includes("against T, where these don't hold: " + herDenied.join(' · ') + ' · cut by them: ' + herCuts.join(' · ')) && outOfScope.every((o) => !named.includes(o)),
    { named: named.slice(0, 700) });
  // the name given BEFORE T spoke: a coarser resolution, the light named
  useGeometryStore.setState({ shapes: { [shape0.id]: shape0 }, shapeOrder: [shape0.id], currentShapeId: shape0.id, selectedVertexId: mid.id, log: [], lexicon: save.lexicon || [] });
  useGeometryStore.getState().updateSelectedVertexData({ label: 'Honesty' });
  useGeometryStore.getState().giveAltitudeSaying(faceFPT.id, T, F, 'hold', 'interprets', 'signal', '+');
  const rB = renderAt(useGeometryStore.getState().shapes[shape0.id]);
  const namedB = (rB.text.match(/named Honesty[^;]*/) || [''])[0];
  check('§11 ★★ D27 THE COARSER RESOLUTION: named while T had not spoken, the line says which light — `named Honesty …, before T\'s roles were related here` — though T speaks now',
    /before T's roles were related here/.test(namedB) && !/against T/.test(namedB),
    { named: namedB.slice(0, 300) });
  // RIDER R1×R2 (c), R1 with R4: his override at the signal (an instance's end) is part of what the name stands against — ARMAN-2 plus the one override, named after
  const nameWith = (relatings, label, override = true) => {
    useGeometryStore.setState({ shapes: { [shape0.id]: shape0 }, shapeOrder: [shape0.id], currentShapeId: shape0.id, selectedVertexId: mid.id, log: [], lexicon: save.lexicon || [] });
    for (const it of relatings) useGeometryStore.getState().giveAltitudeSaying(faceFPT.id, T, cornerOf(shape0, roleRef(it.to).side), roleRef(it.from).id, String(it.word || '').trim(), roleRef(it.to).id, it.holds === false ? '-' : '+');
    const refused = override ? useGeometryStore.getState().giveBondSaying(faceFPT.id, T, F, 'signal', 'keeps', 'atonic', 'hold', '-') : null;
    useGeometryStore.getState().updateSelectedVertexData({ label });
    const r = renderAt(useGeometryStore.getState().shapes[shape0.id]);
    const el = r.html.match(/data-medium-named-under="true"[^>]*>([\s\S]*?)<\/span><\/div>/); // the whole line — a light's held part is a span and a button (D27 rider)
    // the page's own counts, from the same render: every not-decided line's number (the designer's 16:33 (1)) and the head's passages by one role (the forks)
    const undecided = (r.html.match(/data-medium-unruled="\d+"/g) || []).map((s) => Number(s.match(/\d+/)[0]));
    const forks = (r.html.match(/data-medium-corner="T"[^>]*data-medium-corner-forks="(\d+)"/) || [null, null])[1]; // T's corner line (STAMP THE-MODES-TAB §1.3)
    return { html: r.html, refused, line: el ? el[1].replace(/<[^>]+>/g, '').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim() : '', undecided, forks: forks === null ? null : Number(forks) };
  };
  const withO = nameWith(hand.relatings, 'Candour');
  const onlyO = nameWith(hand.relatings.filter((it) => it.holds !== false), 'Candour');
  note(`the name with his override: ${withO.line.slice(withO.line.indexOf('against T'))}`);
  check('§11 ★★ THE RIDER R1×R2 (c), R1 with R4 (the mothership\'s 14:39; the designer\'s 14:43 words; §9.33\'s scope): on ARMAN-2 plus his one override, named after, the line reads `against T, where these don\'t hold: ` the four, `· cut by them: at the signal, the hold makes other the other · cut by a denial: at the signal, the marking refrain keeps the hold` — its own part after `cut by them:`, the routes head\'s phrase; with the override and NO denied relating, `against T, cut by a denial: at the signal, the marking refrain keeps the hold`, no `where these don\'t hold:`, never `where nothing was denied`',
    withO.refused === null && withO.line.includes("against T, where these don't hold: " + herDenied.join(' · ') + ' · cut by them: ' + herCuts.join(' · ') + ' · cut by a denial: at the signal, the marking refrain keeps the hold') && outOfScope.every((o) => !withO.line.includes(o)) &&
      onlyO.refused === null && /, against T, cut by a denial: at the signal, the marking refrain keeps the hold · beside them, \d+ that hold · show$/.test(onlyO.line) && !/where these don't hold|where nothing was denied/.test(onlyO.line),
    { withOverride: withO.line.slice(withO.line.indexOf('against T')), overrideOnly: onlyO.line });
  // the designer's 16:33 (1), the mothership's 16:34: the name's stage counts what the not-decided line counts — open passages, the forks AND the open
  // bonds, from the log at the name's stage — by construction, one predicate (`undecidedIn`) read by the state, the not-decided line and the name's stage
  const medSrc = fs.readFileSync(path.join(repoRoot, 'src/components/MediumBlock.tsx'), 'utf8');
  const sortSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/sorting.ts'), 'utf8');
  const stageK = (withO.line.match(/and (\d+) passages? not decided yet/) || [null, null])[1];
  const pageK = withO.undecided.reduce((t, n) => t + n, 0);
  note(`the name's stage and its page: ${withO.line.slice(0, withO.line.indexOf(', against T'))} · the page's not-decided ${J(withO.undecided)} · the head's forks ${withO.forks}`);
  check('§11 ★★ THE NAME\'S STAGE COUNTS WHAT ITS PAGE COUNTS (the designer\'s 16:33 (1); the mothership\'s 16:34: the same predicate, open passages — forks and open bonds — computed from the log at the name\'s stage; a number that disagrees with its own page misleads): on ARMAN-2 plus his one override, named after, the line reads `… and N passages not decided yet` with N the page\'s own not-decided count, the routes across T\'s relations among them — never the forks alone; one predicate in the source, read by the state, the not-decided line and the name\'s stage',
    stageK !== null && Number(stageK) === pageK && withO.forks !== null && pageK > withO.forks &&
      /export function undecidedIn\(v: ViewSorting\): number/.test(sortSrc) && /const unruled = out\.some\(\(v\) => undecidedIn\(v\) > 0\)/.test(sortSrc) &&
      /then\.views\.reduce\(\(t, v\) => t \+ undecidedIn\(v\), 0\)/.test(medSrc) && /const undecided = undecidedIn\(v\)/.test(medSrc) && !/v\.unruled\.length \+/.test(medSrc),
    { stage: stageK, page: withO.undecided, forks: withO.forks, line: withO.line.slice(0, 200) });
  // the mothership's 19:06 rider (D27: "the denied cells by word, WITH THE PRESENT CELLS BESIDE", §9.33's scope) in the designer's 19:08 words — the count
  // from his RAW sayings (ARMAN-2's file): those that hold at the end-roles of the child's instances at the name's stage (the record's relatings on F–Φ)
  const instEnds = new Set(SO.sortingOf(shape0, edgeBetween(shape0, F, PHI), {}, save.rules || [], { converses: save.converses || [], opaque: save.opaque || [] }).instances.flatMap((r) => [`${shape0.vertices[edgeBetween(shape0, F, PHI).vertexIds[0]].data.label}|${r[1]}`, `${shape0.vertices[edgeBetween(shape0, F, PHI).vertexIds[1]].data.label}|${r[2]}`]));
  const heldRaw = hand.relatings.filter((it) => it.holds !== false && instEnds.has(`${roleRef(it.to).side}|${roleRef(it.to).id}`)).length;
  const holdsOnly = nameWith(hand.relatings.filter((it) => it.holds !== false), 'Candour', false);
  note(`D27's present cells: ${heldRaw} of his sayings hold at the instances' ends · with the override ${withO.line.slice(withO.line.indexOf('beside them'))} · holding only ${holdsOnly.line.slice(holdsOnly.line.indexOf(', with T'))}`);
  check('§11 ★★ D27 OWES THE PRESENT CELLS BESIDE THE DENIED (the mothership\'s 19:06 rider; §9.33\'s scope; the designer\'s 19:08 words): on ARMAN-2 plus his override, named after, T\'s part ends `· beside them, N that hold · show` — N his sayings that HOLD at the end-roles of the child\'s instances at the name\'s stage, counted from his own file; a light that held there and denied and cut nothing reads `, with T, N that hold · show` (no `against T`); the list on `show` in the source (`these hold: … · hide`), its marks as typed, never a proposal',
    heldRaw > 0 && withO.line.endsWith(` · beside them, ${heldRaw} that hold · show`) && holdsOnly.refused === null && holdsOnly.line.endsWith(`, with T, ${heldRaw} that hold · show`) && !/against T/.test(holdsOnly.line)
      && /const heldList = \(p: HeldPart\): string => `\$\{p\.words\.length === 1 \? 'this holds' : 'these hold'\}: \$\{p\.words\.join\(' · '\)\}`;/.test(fs.readFileSync(path.join(repoRoot, 'src/components/MediumBlock.tsx'), 'utf8'))
      && /data-medium-named-held-show=\{p\.id\}[\s\S]{0,260}?>\{heldShown\[p\.id\] \? 'hide' : 'show'\}<\/button>/.test(fs.readFileSync(path.join(repoRoot, 'src/components/MediumBlock.tsx'), 'utf8')),
    { heldRaw, withOverride: withO.line.slice(withO.line.indexOf('against T')), holdingOnly: holdsOnly.line });
  // Virgin Land's 26 (the mothership's 19:37; the designer's 19:39): a named concept's line reads `· rename · withdraw`; a concept never named `· name it`
  const surfSrc = fs.readFileSync(path.join(repoRoot, 'src/components/MidpointSurface.tsx'), 'utf8');
  check('§11 ★★ A NAME CAN BE WITHDRAWN (Virgin Land\'s 26; the designer\'s 19:39): named `Candour`, the concept\'s line reads `· rename · withdraw` — `rename` opens the field with the name selected whole, `withdraw` takes the name back by the logged naming act (`updateSelectedVertexData({ label: \'\' })`, as every clearing is); never named, `· name it` and no withdraw',
    /data-midpoint-name-it="true"[^>]*>rename<\/button>/.test(withO.html) && /data-midpoint-name-withdraw="true"[^>]*>withdraw<\/button>/.test(withO.html) && /data-midpoint-name-withdraw="true"[^\n]*onClick=\{\(\) => updateSelectedVertexData\(\{ label: '' \}\)\}/.test(surfSrc)
      && (() => { const r0 = renderAt(shape0); return />name it<\/button>/.test(r0.html) && !/data-midpoint-name-withdraw/.test(r0.html); })(),
    {});
  // slice 4 — Virgin Land's finding 10: a relating in a word on F–T is read by the corners tab (T's acts line) and named on the face's absent line
  const r10 = renderAt(withFT(fOrder ? ['interprets', 'signal', 'hold', '+'] : ['interprets', 'hold', 'signal', '+']));
  check('§11 ★★ FINDING 10 (Virgin Land 10-07, item 10; the mothership\'s 18:57 item 3): with `interprets` between the signal and the hold on F–T, the corners tab\'s line for T reads the relating in a word — `on F–T: the signal interprets the hold` (as he made it) beside `nothing paired or related on Φ–T yet` — and the face F·Φ·T, which reads pairs, says `no reading yet: nothing paired on …; related in a word on F–Φ and F–T`; before, with nothing on F–T, the line read `nothing paired or related on … yet`',
    /on (F–T|T–F): the (signal interprets the hold|hold interprets the signal)/.test(r10.text) && /nothing paired or related on (Φ–T|T–Φ) yet/.test(r10.text) && /no reading yet: nothing paired on [^;]+; related in a word on (F–Φ and (F–T|T–F)|(F–T|T–F) and F–Φ)/.test(r10.text) && /nothing paired or related on [^·]+ or [^·]+ yet/.test(r0.text) && !/nothing paired on [^;]+ yet/.test(r0.text),
    { acts: (r10.text.match(/on (F–T|T–F): [^·]+/g) || []).slice(0, 2), face: (r10.text.match(/no reading yet: [^·]+/g) || []).slice(0, 1), before: (r0.text.match(/nothing paired or related on [^·]+ yet/g) || []).slice(0, 1) });
}


// §12 — the designer's 13:40 (7) with her 13:41 clause: the light's words placed so none is drawn over another word, a role's name or a point —
// RUN on Virgin Land's real columns laid out at the pane's width, with ARMAN-2's 39 lines and the edge's own relatings drawn beside them
console.log('\n----- §12 the light\'s words placed (the designer\'s 13:40 (7), 13:41) -----');
{
  const MS = req('src/components/MidpointSurface.tsx');
  const { insideOf } = req('src/lib/castInside.ts');
  const IN = req('src/lib/instanceSpace.ts');
  const { columnObstacles } = req('src/components/CastInsideDiagram.tsx');
  const { spaceOf } = req('src/lib/spaceOf.ts');
  const RL = req('src/lib/relatings.ts');
  const sh = written.shape;
  const [cA, cB] = eFP.vertexIds; // the surface's columns: A the edge's first corner, B its second
  const inA = insideOf(IN.columnDisplayOf(sh, cA, IN.columnSpaceOf(sh, cA)));
  const inB = insideOf(IN.columnDisplayOf(sh, cB, IN.columnSpaceOf(sh, cB)));
  const inL = insideOf(spaceOf(sh, T).space);
  const lay = MS.fitInsideLayout(inA, inB, inL, 1209); // the pairing pane at 1689 × 897 in a light (her measure: 1211 wide)
  const idx = (inside, id) => inside.points.findIndex((p) => p.id === id);
  const fT = sh.faces.find((f) => f.id === faceFPT.id);
  const eA = A.endSlotOf(fT, cA);
  const edgeItems = RL.relatingsHeld(edgeBetween(sh, F, PHI)).map((r, i) => ({ key: `rel|${i}`, x1: lay.gA.px, y1: lay.gA.yOf(idx(inA, r[1])), x2: lay.gB.px, y2: lay.gB.yOf(idx(inB, r[2])), word: r[0] }));
  const sayItems = A.sayingsOf(A.altitudeOf(sh, faceFPT.id, T).entries).map((s) => { const toA = s[3] === eA; const g = toA ? lay.gA : lay.gB; const inside = toA ? inA : inB; return { key: `alt|${s[1]}|${s[2]}|${s[3]}|${s[4]}`, x1: lay.gL.px, y1: lay.gL.yOf(idx(inL, s[1])), x2: g.px, y2: g.yOf(idx(inside, s[4])), word: s[2] }; });
  const items = [...edgeItems, ...sayItems].filter((it) => [it.y1, it.y2].every(Number.isFinite));
  const obstacles = [...columnObstacles(inA, lay.gA), ...columnObstacles(inB, lay.gB), ...columnObstacles(inL, lay.gL)];
  const middles = items.map((it) => ({ x: (it.x1 + it.x2) / 2, y: (it.y1 + it.y2) / 2 - 4, word: it.word }));
  const before = MS.wordMeetings(middles, obstacles);
  const placed = MS.placeLineWords(items, obstacles);
  const after = MS.wordMeetings(items.map((it) => ({ ...placed.get(it.key), word: it.word })), obstacles);
  const offLine = items.filter((it) => { const p = placed.get(it.key); const px = p.x; const py = p.y + 4; const len = Math.hypot(it.x2 - it.x1, it.y2 - it.y1); return Math.abs((it.x2 - it.x1) * (py - it.y1) - (it.y2 - it.y1) * (px - it.x1)) / len > 0.5; });
  const moved = items.filter((it) => { const p = placed.get(it.key); return Math.abs(p.x - (it.x1 + it.x2) / 2) > 0.01; }).length;
  const again = MS.placeLineWords(items, obstacles);
  note(`the light at 1209: ${items.length} words (${sayItems.length} of T's, ${edgeItems.length} of the edge's) · at their middles ${before.wordWord} word-word meetings, ${before.wordObstacle} words on a name or point · placed: ${after.wordWord} and ${after.wordObstacle} · ${moved} moved along their lines`);
  check('§12 ★★ NO WORD OVER ANOTHER, A ROLE\'S NAME OR A POINT (the designer\'s 13:40 (7) with her 13:41 clause), RUN on his sitting: at their middles the words meet (the defect she measured at 403ea47); placed, no word meets another, no word sits on a role\'s name or a point, every word stays ON ITS OWN LINE, a word with a free middle keeps it, and the placement is deterministic',
    sayItems.length === 39 && before.wordWord > 0 && after.wordWord === 0 && after.wordObstacle === 0 && offLine.length === 0 && moved < items.length && J([...placed]) === J([...again]),
    { before, after, offLine: offLine.map((it) => it.key), moved });
}


// §13 — TAGS FROM HIS OWN WORDS (Arman's word, 14:36–14:39; the designer's 14:40 form; the mothership's 14:42): the words offered as he types, RUN on
// ARMAN-2's lexicon as the store holds it after his 39 sayings — his own words beginning with what he typed, exactly as spelled, alphabetical
console.log('\n----- §13 tags from his own words -----');
{
  const { wordsOffered } = req('src/components/WordField.tsx');
  const { spaceOf } = req('src/lib/spaceOf.ts');
  const RL = req('src/lib/relatings.ts');
  const { useGeometryStore } = req('src/store/geometryStore.ts');
  useGeometryStore.setState({ shapes: { [shape0.id]: shape0 }, shapeOrder: [shape0.id], currentShapeId: shape0.id, log: [], lexicon: save.lexicon || [] });
  for (const it of hand.relatings) useGeometryStore.getState().giveAltitudeSaying(faceFPT.id, T, cornerOf(shape0, roleRef(it.to).side), roleRef(it.from).id, String(it.word || '').trim(), roleRef(it.to).id, it.holds === false ? '-' : '+');
  const lex = RL.lexiconOf(useGeometryStore.getState().shapes[shape0.id], useGeometryStore.getState().lexicon);
  const his = [...new Set(hand.relatings.map((it) => String(it.word || '').trim()))];
  const might = wordsOffered(lex, 'might.');
  const castOnly = (spaceOf(shape0, T).space.relations || []).map((r) => r.type).filter((w) => !lex.includes(w));
  note(`his words offered for \`might.\`: ${J(might)} · for \`is\`: ${J(wordsOffered(lex, 'is'))} · cast words of T not his: ${castOnly.length}`);
  check('§13 ★★ TAGS FROM HIS OWN WORDS (the designer\'s 14:40 form, within Δ80): for what he has typed, the offer holds HIS OWN words beginning with it, exactly as spelled, in alphabetical order, each once — `might.` gives his `might.…` words and nothing else; the typed word itself is not offered; nothing on an empty field; never IS or ≡ (though his lexicon holds IS); never a word of T\'s cast he has not used',
    might.length >= 2 && might.every((w) => w.startsWith('might.') && his.includes(w)) && J(might) === J([...might].sort((a, b) => a.localeCompare(b))) && new Set(might).size === might.length &&
      !wordsOffered(lex, might[0]).includes(might[0]) && wordsOffered(lex, '').length === 0 && lex.includes(RL.IS) && wordsOffered(lex, 'I').every((w) => w !== RL.IS) && wordsOffered(lex, '≡').length === 0 &&
      castOnly.length > 0 && castOnly.every((w) => wordsOffered(lex, w.slice(0, 2)).every((o) => o !== w)),
    { might, empty: wordsOffered(lex, ''), castOnly: castOnly.slice(0, 4) });
}

// §14 — the mothership's word of 22:06 (item 6 of the coder's 22:00), the designer's 22:07: a leg's IS relating drawn in a corner's light reads `≡` on
// its line and no number — the numbers are this midpoint's pairs — never `undefined` (printed since 95dc82da). RUN on the label's one reader; the source
// holds that the pair's text is that reader's and that only a numbered pair carries `data-midpoint-line-index`
console.log('\n----- §14 a leg\'s IS pairing in a light reads ≡ (the mothership\'s 22:06; the designer\'s 22:07) -----');
{
  const MS = req('src/components/MidpointSurface.tsx');
  const src = fs.readFileSync(path.join(repoRoot, 'src/components/MidpointSurface.tsx'), 'utf8');
  check('§14 ★★ A LEG\'S ≡ IN A CORNER\'S LIGHT (the mothership\'s 22:06; the designer\'s 22:07): a pair line\'s label has ONE reader — this midpoint\'s pair reads its number, a leg\'s IS pairing (which carries none) reads `≡`, never `undefined` (printed on every leg\'s ≡ while a light was open, since 95dc82da); only a numbered pair carries `data-midpoint-line-index`',
    MS.pairLabelOf(3) === '3' && MS.pairLabelOf(1) === '1' && MS.pairLabelOf(undefined) === '≡'
      && /data-midpoint-line-index=\{l\.index === undefined \? undefined : String\(l\.index\)\} data-midpoint-line-equiv=\{l\.index === undefined \? 'true' : undefined\}[^>]*>\{pairLabelOf\(l\.index\)\}<\/text>/.test(src)
      && !/\{String\(l\.index\)\}<\/text>/.test(src),
    { labels: [MS.pairLabelOf(3), MS.pairLabelOf(undefined)] });
}

console.log(`\nDIAGNOSE-THE-ALTITUDE: ${failures === 0 ? 'ALL PASS — the opposite corner speaks at the midpoint as marks on what is related there, never subtracting; its forks are passages the person decides; an empty altitude is VACUOUS; the record rides the lift' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

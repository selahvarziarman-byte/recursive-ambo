#!/usr/bin/env node

// DIAGNOSTIC — STAMP THE-ALTITUDE · slice 2 (2026-10-09; ADR 0031 §9.30 R1–R3; the ruling THE PROJECTION §19.10–§19.11; MARKER
// THE-ALTITUDE · M1): THE CONFIGURATION — the third's own structure restricted to the roles the person placed and transported along his
// marks, computed on Arman's own altitude (ARMAN-2 on Virgin Land's 18:34 record) and agreeing with the reference instrument
// `the_configuration.cjs` and its RESULTS: §1 the configuration at each end (34 induced relation-instances · 58 cut bonds, few by denial) ·
// §2 the grid lit by bonds (41 cells by bonds · 27 by forks · 41 by either · 134 bond-instances) and the pair's relatings placed (7 · 7 · 0 bonds)
// · §3 parallels (23 on F · 27 on Φ) and the discordances among them · §4 the two sealed controls (CTRL-1 one entry; CTRL-2 one bond, one
// denial) · §5 the no-hold run (Arman's caution, §19.11: 3 · 32 · 10 · 18 · 11 · 3 · 1) · §6 his override — a bond saying read as the
// configuration's word, cut by denial when he denies the bond itself · §7 the sorting reads the bonds as passages (UNRULED, a rule over
// three words, a verdict on one bond, a refused route) and the store's
// acts (the bond saying checked against T's cast, the override read, the rule logged and riding the file) · §8 the surface under node (the modes
// head counting the bonds beside the forks, the parallels head, both on demand; the box's lines are the eye's) · the RIDER R1×R2 (§9.32) in §6 and §8:
// his override at an end refuses the routes touching it, 134 = 130 open · 4 refused, the head `… 4 cut by a denial` · §0 purity.
// Run: node scripts/diagnose-the-configuration.cjs

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
const C = req('src/lib/configuration.ts');
const { spaceOf } = req('src/lib/spaceOf.ts');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const note = (line) => console.log(`      ${line}`);

const FIX = path.join(repoRoot, 'scripts/fixtures/altitude');
const save = JSON.parse(fs.readFileSync(path.join(FIX, 'virgin-land_2026-10-07_1834_F-Phi_3-relatings-1-bar.workspace.json'), 'utf8'));
const hand = JSON.parse(fs.readFileSync(path.join(FIX, 'ARMAN-2.json'), 'utf8'));
const shape0 = save.shapes[save.currentShapeId];
const cornerOf = (shape, lab) => Object.values(shape.vertices).find((v) => v.data?.label === lab && v.data?.cast)?.id;
const faceOf = (shape, ids) => shape.faces.find((f) => f.vertexIds.length === ids.length && ids.every((v) => f.vertexIds.includes(v)));
const F = cornerOf(shape0, 'F'); const PHI = cornerOf(shape0, 'Φ'); const T = cornerOf(shape0, 'T');
const faceFPT = faceOf(shape0, [F, PHI, T]);
const slotT = A.apexSlotOf(faceFPT, T);
const spaceAt = (corner) => spaceOf(shape0, corner).space;
const ZT = spaceAt(T); const SF = spaceAt(F); const SP = spaceAt(PHI);
const rolesF = SF.roles.map((r) => r.id); const rolesP = SP.roles.map((r) => r.id);
const eF = A.endSlotOf(faceFPT, F); const eP = A.endSlotOf(faceFPT, PHI); // M2 — the ends' slots in the face F·Φ·T
const endOfRole = (x) => (rolesF.includes(x) ? F : PHI); // the end corner a role of F or Φ belongs to (the box's group hands it in)
const labelT = (id) => (ZT.roles.find((r) => r.id === id) || {}).label || id;
const roleRef = (s) => { const m = /^(.+?):(.+)$/.exec(String(s)); return { side: m ? m[1] : null, id: m ? m[2] : String(s) }; };
/** the hand's entries written through the lib's checked act onto the face */
const altitudeFrom = (entries) => {
  let face = faceFPT; let taken = 0;
  for (const it of entries) {
    const act = A.altitudeSayingOf(shape0, faceFPT.id, T, cornerOf(shape0, roleRef(it.to).side), roleRef(it.from).id, String(it.word || '').trim(), roleRef(it.to).id, it.holds === false ? '-' : '+');
    if (act.refused) continue;
    face = A.withSaying(face, act.slot, act.saying); taken += 1;
  }
  return { entries: A.altitudeHeld(face, slotT), taken, face };
};
const fmt = (r) => `${r.w}(${r.terms.map(labelT).join(', ')})${r.holds ? '' : ' ✗'}`;

// §0 — purity
const src = fs.readFileSync(path.join(repoRoot, 'src/lib/configuration.ts'), 'utf8');
check('§0 the configuration lib is React-free, DOM-free and store-free; it reads the casts and the altitude alone (relatings.ts, the sorting, the store never imported)', !/from 'react'|document\.|window\.|from '\.\.\/store|from '\.\/sorting'|from '\.\/relatings'/.test(src));
check('§0 T\'s cast as the record carries it: 9 roles, 14 relations of which 4 refused; F 8 roles, 11 relations; Φ 7 roles, 12 relations (the instrument\'s head)', ZT.roles.length === 9 && C.relationsOf(ZT).length === 14 && C.relationsOf(ZT).filter((r) => !r.holds).length === 4 && SF.roles.length === 8 && C.relationsOf(SF).length === 11 && SP.roles.length === 7 && C.relationsOf(SP).length === 12, { T: [ZT.roles.length, C.relationsOf(ZT).length], F: [SF.roles.length, C.relationsOf(SF).length], P: [SP.roles.length, C.relationsOf(SP).length] });

// §1 — the configuration at each end, ARMAN-2
const arman = altitudeFrom(hand.relatings);
const ends = [...rolesF.map((x) => ({ e: eF, x })), ...rolesP.map((x) => ({ e: eP, x }))]; // M2 — the cells (end slot, role)
const tot = C.configurationTotals(ZT, arman.entries, ends);
const atSignal = tot.ends.find((e) => e.x === 'signal');
note(`at the signal: present [${atSignal.present.map(labelT).join(' · ')}] · denied [${atSignal.denied.map(labelT).join(' · ')}] · induced ${atSignal.induced.map(fmt).join(' · ')} · cut ${atSignal.cut.length} (${atSignal.cut.filter(C.cutByDenial).length} by denial)`);
check('§1 ★★ R1 AT EVERY END (the instrument\'s totals): 34 induced relation-instances across the fifteen end-roles and 58 cut bonds — ARMAN-2\'s 39 sayings taken', arman.taken === 39 && tot.induced === 34 && tot.cut === 58, { taken: arman.taken, induced: tot.induced, cut: tot.cut });
check('§1 ★★ AT THE SIGNAL as the instrument and the designer read it: present the hold · the marking refrain · the assuming; denied the marking refrain · the other; induced keeps(the marking refrain, the hold) · gives access to(the assuming, the hold) · gives access to(the marking refrain, the hold) ✗ · interpenetrates(the hold, the hold) — the cast\'s refusal among them (R1)',
  J(atSignal.present.map(labelT)) === J(['the hold', 'the marking refrain', 'the assuming']) && J(atSignal.denied.map(labelT)) === J(['the marking refrain', 'the other']) && J(atSignal.induced.map(fmt)) === J(['keeps(the marking refrain, the hold)', 'gives access to(the assuming, the hold)', 'gives access to(the marking refrain, the hold) ✗', 'interpenetrates(the hold, the hold)']),
  { present: atSignal.present.map(labelT), denied: atSignal.denied.map(labelT), induced: atSignal.induced.map(fmt) });
const cutsByDenial = tot.ends.flatMap((e) => e.cut.filter(C.cutByDenial).map((c) => `${e.x}: ${fmt(c.relation)} — ${c.missing.filter((m) => m.byDenial).map((m) => labelT(m.role)).join(', ')} denied`));
check('§1 ★★ THE CUTS BY DENIAL are few and his (the ruling §19.10): the other at the signal cuts `makes other(the hold, the other)`; the broken hold at the leap cuts `keeps(the living refrain, the broken hold)`; every other cut dangles by silence — computed, shown nowhere', cutsByDenial.some((s) => /^signal: makes other\(the hold, the other\) — the other denied$/.test(s)) && cutsByDenial.some((s) => /^leap: keeps\(the living refrain, the broken hold\) — the broken hold denied$/.test(s)) && tot.cutByDenial < 10 && tot.cut - tot.cutByDenial > 40, { byDenial: cutsByDenial, total: tot.cut });

// §2 — the grid lit by bonds; the pair's relatings placed
const counts = C.bondCounts(ZT, arman.entries, eF, rolesF, eP, rolesP);
check('§2 ★★ R2 THE GRID LIT BY BONDS (the instrument): 41 cells by bonds · 27 by forks · 41 by either, of 56; 134 bond-instances (a reflexive relation counted once each way); refused relations of T span as refused routes beside them', counts.cellsByBonds === 41 && counts.cellsByForks === 27 && counts.cellsByEither === 41 && counts.bondInstances === 134 && counts.refusedRoutes > 0, counts);
const bonds = C.bondsAcross(ZT, arman.entries, eF, rolesF, eP, rolesP).filter((b) => b.holds);
const bondWords = (b) => (b.zAt === 'x' ? `${labelT(b.z)}@F ${b.S} ${labelT(b.z2)}@Φ` : `${labelT(b.z)}@Φ ${b.S} ${labelT(b.z2)}@F`);
const onCell = (x, y) => bonds.filter((b) => b.x === x && b.y === y).map(bondWords);
check('§2 ★★ THE PAIR\'S RELATINGS PLACED (the instrument\'s §3): `the form passes as the signal` carries SEVEN bonds — the living refrain@Φ keeps the hold@F · the marking refrain@F keeps the hold@Φ · the assuming@F gives access to the hold@Φ · the assuming@Φ gives access to the hold@F · the hold@F makes other the other@Φ · the hold@F interpenetrates the hold@Φ · the hold@Φ interpenetrates the hold@F; `the working passes as the spending` seven; `the waiting design passes as the store` none',
  J(onCell('signal', 'form').sort()) === J(['the living refrain@Φ keeps the hold@F', 'the marking refrain@F keeps the hold@Φ', 'the assuming@F gives access to the hold@Φ', 'the assuming@Φ gives access to the hold@F', 'the hold@F makes other the other@Φ', 'the hold@F interpenetrates the hold@Φ', 'the hold@Φ interpenetrates the hold@F'].sort()) && onCell('spending', 'working').length === 7 && onCell('store', 'dormant').length === 0,
  { signalForm: onCell('signal', 'form'), spendingWorking: onCell('spending', 'working').length, storeDormant: onCell('store', 'dormant').length });

// §3 — parallels and discordances
const pF = C.parallelsOn(SF, ZT, arman.entries, eF); const pP = C.parallelsOn(SP, ZT, arman.entries, eP);
const pWords = (p) => `${p.R.w}(${p.x}, ${p.x2})${p.R.holds ? '' : ' ✗'}  ∥  ${fmt(p.S)}  along ${labelT(p.z)}@${p.x}, ${labelT(p.z2)}@${p.x2}`;
note(`parallels on F: ${pF.length} (${pF.filter((p) => p.discordance).length} across a refusal) · on Φ: ${pP.length} (${pP.filter((p) => p.discordance).length}) · e.g. ${pWords(pF[0])}`);
check('§3 ★★ R3 PARALLELS (the instrument): 23 on F\'s own structure and 27 on Φ\'s; among them F\'s `rides on(the signal, the current)` beside T\'s `gives(the hold, the pace)` along the hold@the signal and the pace@the current (the ruling\'s own instance); a parallel across a refusal is a DISCORDANCE, shown, never resolved — F refuses `counts(the signal, the ambient)` while T\'s `keeps` spans it',
  pF.length === 23 && pP.length === 27 && pF.some((p) => p.R.w === 'rides on' && p.x === 'signal' && p.x2 === 'current' && p.S.w === 'gives' && labelT(p.z) === 'the hold' && labelT(p.z2) === 'the pace' && !p.discordance) && pF.some((p) => p.R.w === 'counts' && p.x === 'signal' && p.x2 === 'ambient' && !p.R.holds && p.S.w === 'keeps' && p.discordance) && pF.filter((p) => p.discordance).length > 0 && pP.filter((p) => p.discordance).length > 0,
  { F: pF.length, P: pP.length, discordF: pF.filter((p) => p.discordance).length, discordP: pP.filter((p) => p.discordance).length });

// §4 — the two sealed controls (the instrument's CTRL-1 and CTRL-2)
const c1 = altitudeFrom([{ from: 'T:hold', word: 'interprets', to: 'F:signal', holds: true }]);
const t1 = C.configurationTotals(ZT, c1.entries, ends); const k1 = C.bondCounts(ZT, c1.entries, eF, rolesF, eP, rolesP);
check('§4 ★★ CTRL-1 (one entry, the hold at the signal): induced exactly `interpenetrates(the hold, the hold)`; the hold\'s SEVEN positive relations to other roles cut, none by denial; nothing lit, no bond, no parallel', t1.induced === 1 && fmt(t1.ends.find((e) => e.x === 'signal').induced[0]) === 'interpenetrates(the hold, the hold)' && t1.cut === 7 && t1.cutByDenial === 0 && k1.cellsByEither === 0 && k1.bondInstances === 0 && C.parallelsOn(SF, ZT, c1.entries, eF).length === 0 && C.parallelsOn(SP, ZT, c1.entries, eP).length === 0, { induced: t1.induced, cut: t1.cut, lit: k1 });
const c2 = altitudeFrom([{ from: 'T:hold', word: 'interprets', to: 'F:signal', holds: true }, { from: 'T:refrain', word: 'might.act.as', to: 'Φ:form', holds: true }, { from: 'T:other', word: 'emits', to: 'F:signal', holds: false }]);
const t2 = C.configurationTotals(ZT, c2.entries, ends); const k2 = C.bondCounts(ZT, c2.entries, eF, rolesF, eP, rolesP);
const b2 = C.bondsAcross(ZT, c2.entries, eF, rolesF, eP, rolesP).filter((b) => b.holds).map(bondWords);
const cutOther = t2.ends.find((e) => e.x === 'signal').cut.find((c) => c.relation.w === 'makes other');
check('§4 ★★ CTRL-2 (the hold at the signal, the living refrain at the form, the other DENIED at the signal): the cell (signal, form) lit by ONE bond — the living refrain@Φ keeps the hold@F — and no fork; at the signal the cut bond `makes other(the hold, the other)` is CUT BY DENIAL (the other denied there); 10 cut bonds in all, one induced', k2.cellsByBonds === 1 && k2.cellsByForks === 0 && k2.bondInstances === 1 && J(b2) === J(['the living refrain@Φ keeps the hold@F']) && !!cutOther && C.cutByDenial(cutOther) && cutOther.missing.some((m) => labelT(m.role) === 'the other' && m.byDenial) && t2.cut === 10 && t2.induced === 1, { bonds: b2, cut: t2.cut, induced: t2.induced, cutOther: cutOther && cutOther.missing });

// §5 — the no-hold run (the ruling §19.11): the hold's ten entries removed
const noHold = altitudeFrom(hand.relatings.filter((it) => roleRef(it.from).id !== 'hold'));
const t5 = C.configurationTotals(ZT, noHold.entries, ends); const k5 = C.bondCounts(ZT, noHold.entries, eF, rolesF, eP, rolesP);
check('§5 ★★ THE NO-HOLD RUN (Arman\'s caution, §19.11 — the hold\'s ten entries were his first batch): 29 sayings; forks light 18 cells, bonds 10, either 20; 11 bond-instances; 3 induced, 32 cut; parallels 3 on F and 1 on Φ — the structure of the readings unchanged at either breadth', noHold.taken === 29 && k5.cellsByForks === 18 && k5.cellsByBonds === 10 && k5.cellsByEither === 20 && k5.bondInstances === 11 && t5.induced === 3 && t5.cut === 32 && C.parallelsOn(SF, ZT, noHold.entries, eF).length === 3 && C.parallelsOn(SP, ZT, noHold.entries, eP).length === 1, { taken: noHold.taken, forks: k5.cellsByForks, bonds: k5.cellsByBonds, either: k5.cellsByEither, instances: k5.bondInstances, induced: t5.induced, cut: t5.cut, pF: C.parallelsOn(SF, ZT, noHold.entries, eF).length, pP: C.parallelsOn(SP, ZT, noHold.entries, eP).length });

// §6 — his override: a bond saying at an end
const withOverride = A.withBondSaying(arman.face, slotT, ['bond', eF, 'signal', 'keeps', 'atonic', 'hold', '-']);
const cfg6 = C.configurationAt(ZT, A.altitudeHeld(withOverride, slotT), eF, 'signal');
const keepsAtonicHold = cfg6.induced.find((r) => r.w === 'keeps' && r.terms[0] === 'atonic' && r.terms[1] === 'hold');
const withBondDenied = A.withBondSaying(arman.face, slotT, ['bond', eF, 'signal', 'takes as own', 'hold', 'own', '-']);
const cfg6b = C.configurationAt(ZT, A.altitudeHeld(withBondDenied, slotT), eF, 'signal');
const takesAsOwn = cfg6b.cut.find((c) => c.relation.w === 'takes as own');
check('§6 ★★ HIS OVERRIDE (R1; the designer\'s §4): a bond saying `at the signal, the marking refrain keeps the hold · does not hold` is read as the configuration\'s word there — the induced relation reads as he said it, overridden; left alone it reads as the cast has it; a bond he denies at the signal whose other role is merely absent is CUT BY DENIAL by his saying itself', !!keepsAtonicHold && C.inducedHolds(cfg6, keepsAtonicHold).holds === false && C.inducedHolds(cfg6, keepsAtonicHold).overridden === true && C.inducedHolds(C.configurationAt(ZT, arman.entries, 'signal'), keepsAtonicHold).holds === true && !!takesAsOwn && C.cutByDenial(takesAsOwn) && takesAsOwn.deniedHere && !takesAsOwn.missing.some((m) => m.byDenial), { overridden: keepsAtonicHold && C.inducedHolds(cfg6, keepsAtonicHold), takesAsOwn: takesAsOwn && { deniedHere: takesAsOwn.deniedHere, missing: takesAsOwn.missing } });

// RIDER R1×R2 (ADR §9.32, ratified §319; the mothership's 14:27): his override at the signal refuses the bond-routes across keeps(the marking refrain, the hold)
// that touch the signal — the falsifier `the_configuration.cjs` on ARMAN-2 plus that one override: 134 = 130 open · 4 refused (3 leaving, 1 entering); without it 134 · 0
{
  const SO = req('src/lib/sorting.ts');
  const entO = A.altitudeHeld(withOverride, slotT);
  const kO = C.bondCounts(ZT, entO, eF, rolesF, eP, rolesP);
  const bO = C.bondsAcross(ZT, entO, eF, rolesF, eP, rolesP).filter((b) => b.holds && b.deniedAt);
  const eFP6 = shape0.edges.find((e) => e.vertexIds.includes(F) && e.vertexIds.includes(PHI));
  const rules6 = save.rules || []; const facts6 = { converses: save.converses || [], opaque: save.opaque || [] };
  const viewOf = (face) => SO.sortingOf({ ...shape0, faces: shape0.faces.map((f) => (f.id === faceFPT.id ? face : f)) }, eFP6, {}, rules6, facts6).views.find((v) => v.view === T);
  const vO = viewOf(withOverride); const v0 = viewOf(arman.face);
  const deniedRows = vO.altitude.bonds.filter((b) => b.reading === 'REFUSED' && b.refusal === 'denial');
  note(`the rider: with the override ${kO.bondInstances} = ${kO.open} open · ${kO.refusedByDenial} refused by his denial (${bO.filter((b) => b.zAt === 'x').length} leaving the signal, ${bO.filter((b) => b.zAt === 'y').length} entering it) · without it ${counts.bondInstances} = ${counts.open} · ${counts.refusedByDenial}`);
  check('§6 ★★ THE RIDER R1×R2 (ADR §9.32; the falsifier `the_configuration.cjs`, re-run by the mothership at HEAD): with his override `at the signal, keeps(the marking refrain, the hold) does not hold`, the 134 bond-instances split 130 OPEN and 4 REFUSED BY HIS DENIAL — three leaving the signal (the marking refrain there keeps the hold at a role of Φ) and one entering it (the marking refrain at a role of Φ keeps the hold at the signal); without the override 134 · 0; the cast\'s own refusals stay its own',
    kO.bondInstances === 134 && kO.open === 130 && kO.refusedByDenial === 4 && bO.length === 4 && bO.filter((b) => b.zAt === 'x').length === 3 && bO.filter((b) => b.zAt === 'y').length === 1 && bO.every((b) => b.S === 'keeps' && b.z === 'atonic' && b.z2 === 'hold' && b.x === 'signal' && b.deniedAt.e === eF && b.deniedAt.x === 'signal') && counts.bondInstances === 134 && counts.open === 134 && counts.refusedByDenial === 0 && kO.refusedRoutes === counts.refusedRoutes,
    { withOverride: kO, without: counts, routes: bO.map((b) => `${b.zAt === 'x' ? 'leaving' : 'entering'} ${b.x}→${b.y}`) });
  check('§6 ★★ THE RIDER IN THE SORTING: the four routes are REFUSED rows, each naming its reason (`denial`, at the signal, the end it touches), listed with the cast\'s refused rows and never deleted — 130 open rows beside them, no verdict or rule reading a refused one; withdrawn (the record without the override), all 134 open again and none refused by a denial',
    deniedRows.length === 4 && deniedRows.every((b) => b.deniedAt && b.deniedAt.end === 'x' && b.deniedAt.role === 'signal' && b.by === null && b.composite === null) && vO.altitude.bonds.filter((b) => b.reading !== 'REFUSED').length === 130 && vO.altitude.bonds.filter((b) => b.reading === 'REFUSED' && b.refusal === 'cast').length === v0.altitude.bonds.filter((b) => b.reading === 'REFUSED').length && v0.altitude.bonds.filter((b) => b.reading !== 'REFUSED').length === 134 && v0.altitude.bonds.every((b) => b.refusal !== 'denial'),
    { denied: deniedRows.length, open: vO.altitude.bonds.filter((b) => b.reading !== 'REFUSED').length, openWithout: v0.altitude.bonds.filter((b) => b.reading !== 'REFUSED').length });
}


// §7 — THE SORTING READS THE BONDS AS PASSAGES (R2; D6 applies to a bond as to a fork) and THE STORE'S ACTS: the bonds on ARMAN-2's view of F–Φ,
// 134 holding instances expanded by his words at the two ends; UNRULED until he says; a bond rule over three words composes them; a verdict on one
// bond decides it; a refused relation of T spans as a refused route with no hands; the bond saying's act checked against T's cast; the log carries both
console.log('\n----- §7 the sorting, the rules, the verdicts, the store -----');
{
  const SO = req('src/lib/sorting.ts');
  const { useGeometryStore } = req('src/store/geometryStore.ts');
  const ST = req('src/lib/stage.ts');
  const facts = { converses: save.converses || [], opaque: save.opaque || [] };
  const edge = shape0.edges.find((e) => (e.vertexIds[0] === F && e.vertexIds[1] === PHI) || (e.vertexIds[0] === PHI && e.vertexIds[1] === F));
  const shapeA = { ...shape0, faces: shape0.faces.map((f) => (f.id === faceFPT.id ? arman.face : f)) };
  const s1 = SO.sortingOf(shapeA, edge, {}, save.rules || [], facts);
  const vT = s1.views.find((v) => v.view === T);
  const holding = vT.altitude.bonds.filter((b) => b.reading !== 'REFUSED');
  const onCellB = (x, y) => holding.filter((b) => b.bond.x === x && b.bond.y === y);
  check('§7 ★★ THE VIEW CARRIES THE CONFIGURATION (R1–R3 as form): 134 bond-instances, 41 cells by bonds and 27 by forks, 34 induced, 58 cut; parallels 50 (23 + 27); the bonds as passages UNRULED until he says, each with three legs as he and the cast said them; the refused relations of T as refused routes with no composite',
    vT.altitude.bondInstances === 134 && vT.altitude.cellsByBonds === 41 && vT.altitude.cellsByForks === 27 && vT.altitude.induced === 34 && vT.altitude.cut === 58 && vT.altitude.parallels.length === 50 && holding.length > 0 && holding.every((b) => b.reading === 'UNRULED' && b.bond.said.length === 3) && vT.altitude.bonds.some((b) => b.reading === 'REFUSED' && b.composite === null),
    { instances: vT.altitude.bondInstances, cells: [vT.altitude.cellsByBonds, vT.altitude.cellsByForks], induced: vT.altitude.induced, cut: vT.altitude.cut, parallels: vT.altitude.parallels.length, passages: holding.length, refused: vT.altitude.bonds.filter((b) => b.reading === 'REFUSED').length });
  const sf = onCellB('signal', 'form');
  const keepsAcross = sf.find((b) => b.bond.S === 'keeps' && b.bond.z === 'refrain' && b.bond.z2 === 'hold');
  check('§7 ★★ `the form passes as the signal` carries its bonds as passages: the living refrain@Φ keeps the hold@F reads `refrain might.act.as form` at the form, `refrain keeps hold`, `hold interprets signal` at the signal — the legs in the walk\'s order from the signal; the site stays UNRULED (passages stand, nobody has said)',
    sf.length >= 7 && !!keepsAcross && keepsAcross.bond.zAt === 'y' && J(keepsAcross.bond.said) === J([['hold', 'interprets', 'signal'], ['refrain', 'keeps', 'hold'], ['refrain', 'might.act.as', 'form']]) && s1.state === 'UNRULED',
    { onCell: sf.length, said: keepsAcross && keepsAcross.bond.said, state: s1.state });
  // a bond rule over three words composes the bond; the composite reads against the direct relatings (COMPOSED where he related it, else LIGHT)
  const s2 = SO.sortingOf(shapeA, edge, {}, save.rules || [], facts, [['interprets', 'keeps', 'might.act.as', 'passes as']]);
  const vT2 = s2.views.find((v) => v.view === T);
  const ruled = vT2.altitude.bonds.find((b) => b.bond.x === 'signal' && b.bond.y === 'form' && b.bond.S === 'keeps' && b.bond.z === 'refrain' && b.bond.w === 'interprets' && b.bond.w2 === 'might.act.as');
  check('§7 ★★ A BOND RULE over three words (`one word for interprets, keeps and might.act.as across T\'s relation: passes as`) composes the bond to `the signal passes as the form`; the direct on F–Φ is `the form passes as the signal` (←), so the composite in the walk\'s order (→) is NOT that relating — it reads LIGHT: T\'s light, record never an offer; with the rule the site is no longer UNRULED on that bond alone',
    !!ruled && ruled.by === 'rule' && ruled.composite === 'passes as' && ruled.reading === 'LIGHT' && ruled.direct === null && vT2.altitude.bonds.filter((b) => b.reading === 'UNRULED').length === holding.length - vT2.altitude.bonds.filter((b) => b.by === 'rule').length,
    { ruled: ruled && { by: ruled.by, composite: ruled.composite, reading: ruled.reading } });
  // a verdict on one bond, through the face's verdicts with the relation's word and second role beside the five
  const rec = { base: [faceFPT.vertexIds.indexOf(F), faceFPT.vertexIds.indexOf(PHI)], x: 'signal', w: 'interprets', z: 'refrain', w2: 'might.act.as', y: 'form', S: 'keeps', z2: 'hold', verdict: 'not' };
  const faceV = SO.withVerdict(arman.face, rec);
  const shapeV = { ...shape0, faces: shape0.faces.map((f) => (f.id === faceFPT.id ? faceV : f)) };
  const s3 = SO.sortingOf(shapeV, edge, {}, save.rules || [], facts);
  const vT3 = s3.views.find((v) => v.view === T);
  const decided = vT3.altitude.bonds.find((b) => b.bond.x === 'signal' && b.bond.y === 'form' && b.bond.S === 'keeps' && b.bond.z === 'refrain' && b.bond.w === 'interprets' && b.bond.w2 === 'might.act.as');
  check('§7 ★★ A VERDICT ON ONE BOND (`comes to nothing`) rides the face\'s verdicts with the relation\'s word and second role beside the five, decides that bond alone (NOT), names no path (the forks stand), and comes out again by `withoutVerdict`',
    !!decided && decided.reading === 'NOT' && decided.by === 'verdict' && vT3.paths.every((p) => p.reading === 'UNRULED') && SO.verdictsOn(faceV).length === 1 && SO.verdictsOn(SO.withoutVerdict(faceV, rec)).length === 0 && vT3.altitude.bonds.filter((b) => b.reading === 'NOT').length === 1,
    { decided: decided && { reading: decided.reading, by: decided.by }, forksUnruled: vT3.paths.every((p) => p.reading === 'UNRULED') });
  // the store: the bond saying checked against T's cast; the override read; the rule logged and riding the file
  const S = () => useGeometryStore.getState();
  S().importWorkspace(JSON.parse(J(save)));
  for (const it of hand.relatings) S().giveAltitudeSaying(faceFPT.id, T, cornerOf(shape0, roleRef(it.to).side), roleRef(it.from).id, String(it.word || '').trim(), roleRef(it.to).id, it.holds === false ? '-' : '+', it.why);
  const cur = () => S().shapes[S().currentShapeId];
  const faceNow = () => cur().faces.find((f) => f.id === faceFPT.id);
  const n0 = S().log.length;
  const r1 = S().giveBondSaying(faceFPT.id, T, endOfRole('signal'), 'signal', 'keeps', 'atonic', 'hold', '-');
  const r2 = S().giveBondSaying(faceFPT.id, T, endOfRole('signal'), 'signal', 'keeps', 'hold', 'atonic', '-');
  const r3 = S().giveBondSaying(faceFPT.id, T, endOfRole('current'), 'current', 'keeps', 'atonic', 'hold', '-');
  const held = A.bondSayingsOf(A.altitudeHeld(faceNow(), slotT));
  check('§7 ★★ THE BOND SAYING\'s ACT through the store: `at the signal, the marking refrain keeps the hold · does not hold` is taken and logged; a relation T has not (`keeps` from the hold to the marking refrain) is refused by name — `T has no relation keeps from hold to atonic`; a saying at an end where the role is not present is refused — `atonic isn\'t present at current: say that first`',
    r1 === null && held.length === 1 && J(held[0]) === J(['bond', eF, 'signal', 'keeps', 'atonic', 'hold', '-']) && S().log.length === n0 + 1 && S().log[n0].act === 'altitude' && !!r2 && /^T has no relation keeps from hold to atonic/.test(r2.why) && !!r3 && /isn't present at current: say that first/.test(r3.why),
    { r1, held, r2: r2 && r2.why, r3: r3 && r3.why });
  const cfgNow = C.configurationAt(ZT, A.altitudeHeld(faceNow(), slotT), eF, 'signal');
  const keepsAtonicHold = cfgNow.induced.find((r) => r.w === 'keeps' && r.terms[0] === 'atonic' && r.terms[1] === 'hold');
  const over = keepsAtonicHold && C.inducedHolds(cfgNow, keepsAtonicHold);
  S().withdrawBondSaying(faceFPT.id, T, endOfRole('signal'), 'signal', 'keeps', 'atonic', 'hold');
  const afterWithdraw = A.bondSayingsOf(A.altitudeHeld(faceNow(), slotT)).length;
  const rr = S().nameBondRule('interprets', 'keeps', 'might.act.as', 'passes as');
  const rrIS = S().nameBondRule('interprets', 'keeps', 'might.act.as', '≡');
  const exported = S().exportWorkspace();
  S().importWorkspace(JSON.parse(J(exported)));
  const now = { shape: cur(), rules: S().rules, bondRules: S().bondRules, facts: { converses: S().converses, opaque: S().opaque }, lexicon: S().lexicon, tauDrafts: S().edgeTauDrafts };
  const atBefore = ST.recordAtStage(now, S().log, n0);
  check('§7 ★★ THE OVERRIDE READ, THE HAND BACK, THE RULE: the induced `keeps(the marking refrain, the hold)` reads `does not hold`, overridden, while his saying stands; withdrawn, it reads as the cast has it; `nameBondRule` names the rule and refuses ≡ as its result by the one predicate; the rule rides the workspace file and comes back on import; the stage before the acts holds no bond rule and no bond saying',
    !!over && over.holds === false && over.overridden === true && afterWithdraw === 0 && rr === null && S().bondRules.length === 1 && J(S().bondRules[0]) === J(['interprets', 'keeps', 'might.act.as', 'passes as']) && typeof rrIS === 'string' && /can't be ≡ or IS/.test(rrIS) && J(exported.bondRules) === J([['interprets', 'keeps', 'might.act.as', 'passes as']]) && (atBefore.bondRules || []).length === 0 && A.bondSayingsOf(A.altitudeHeld(atBefore.shape.faces.find((f) => f.id === faceFPT.id), slotT)).length === 0,
    { over, afterWithdraw, rr, rrIS, bondRules: S().bondRules, exported: exported.bondRules, stageBefore: (atBefore.bondRules || []).length });
  // M4 at the bond rules (the witness's first run caught the file carrying none): a file holding a bond rule whose result is ≡ gives it up by name and keeps his
  const tainted = JSON.parse(J(exported)); tainted.bondRules = [...(tainted.bondRules || []), ['interprets', 'keeps', 'might.act.as', '≡']];
  const notTaken7 = S().importWorkspace(tainted);
  check('§7 M4 AT THE BOND RULES: a file holding a bond rule whose result is ≡ gives it up BY NAME — `the rule interprets, keeps and might.act.as across a relation = ≡` — and his rule comes back; the file\'s shape is checked (four words)',
    notTaken7.includes('the rule interprets, keeps and might.act.as across a relation = ≡') && J(S().bondRules) === J([['interprets', 'keeps', 'might.act.as', 'passes as']]),
    { notTaken: notTaken7, bondRules: S().bondRules });
}


// §8 — THE SURFACE UNDER NODE (slice 2 (b); the rest of the designer's §6): the midpoint F–Φ rendered on the record with ARMAN-2 written in — the
// modes head counts the bonds beside the forks, the parallels head counts both ends, both lists on demand (nothing rendered until shown), and no
// datalist anywhere; the box's lines (§4) open with a light, by a click, and are the eye's
console.log('\n----- §8 the surface under node -----');
{
  const React = require('react');
  const { renderToString } = require('react-dom/server');
  const { useGeometryStore } = req('src/store/geometryStore.ts');
  const { MidpointSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
  const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
  const shapeA = { ...shape0, faces: shape0.faces.map((f) => (f.id === faceFPT.id ? arman.face : f)) };
  useGeometryStore.setState({ shapes: { [shapeA.id]: shapeA }, shapeOrder: [shapeA.id], currentShapeId: shapeA.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, altitudeRefusals: {}, lexicon: save.lexicon || [], rules: save.rules || [], bondRules: [], converses: save.converses || [], opaque: save.opaque || [] });
  const mid = Object.values(shapeA.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(F) && v.createdBy.sourceVertexIds.includes(PHI));
  const packet = buildGeneralSitePacketPresenterReport(shapeA).packets.find((p) => p.trace.siteId === mid.id);
  const site = midpointSiteOf(shapeA, mid.id, packet ? packet.trace : null);
  const html = renderToString(React.createElement(MidpointSurface, { shape: shapeA, site, parents: [spaceOf(shapeA, site.a), spaceOf(shapeA, site.b)], resolved: spaceOf(shapeA, mid.id), refusal: null, remade: null })).replace(/<!-- -->/g, '');
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
  check('§8 ★★ T\'S CORNER LINE COUNTS WHAT ITS CELLS HOLD (STAMP THE-MODES-TAB §1.3; the counts of §6): `T — nothing on its edges · 33 by one role · 134 across its relations · 50 that T refuses` — its edges and its light side by side, never merged; no route rendered until a cell is chosen (each sits on its cell\'s card)', /data-medium-corner="T" data-medium-corner-edges="0" data-medium-corner-forks="33" data-medium-corner-bonds="134" data-medium-corner-refused="50" data-medium-corner-denied="0"/.test(html) && /T — nothing on its edges · 33 by one role · 134 across its relations · 50 that T refuses/.test(text) && (html.match(/data-medium-bond="/g) || []).length === 0 && (html.match(/data-medium-passage="/g) || []).length === 0, { corner: (text.match(/T — [^·]*(·[^·]*){0,4}/) || [null])[0] });
  check('§8 ★★ THE PARALLELS BY COUNT (R3), NAMING THEIR CORNER (the designer\'s 22:48 (3)): `T\'s parallels: 23 with F\'s relations · 27 with Φ\'s · show`, none listed until shown', /data-medium-parallels-head="T" data-medium-parallels="23\|27"/.test(html) && /T's parallels: 23 with F's relations · 27 with Φ's · show/.test(text) && (html.match(/data-medium-parallel="/g) || []).length === 0, { heads: text.match(/parallels: [^·]*·[^·]*/g) });
  check('§8 ★★ THE DESIGNER\'S 13:40 (2) and (4), in the corner line (STAMP THE-MODES-TAB §1.3): `134 across its relations · 50 that T refuses` (the routes across a relation T refuses, counted apart) — and the not-decided line counts every passage not decided, the routes across T\'s relations among them: `167 passages through T not decided yet` (33 by one role and 134 across its relations)',
    /data-medium-corner-bonds="134" data-medium-corner-refused="50"/.test(html) && /134 across its relations · 50 that T refuses/.test(text) && /data-medium-unruled="167"/.test(html) && /167 passages through T not decided yet/.test(text),
    { corner: (text.match(/T — [^·]*(·[^·]*){0,4}/) || [null])[0], unruled: (html.match(/data-medium-unruled="(\d+)"/g) || []) });
  {
    const surf = fs.readFileSync(path.join(repoRoot, 'src/components/MidpointSurface.tsx'), 'utf8'); const med = fs.readFileSync(path.join(repoRoot, 'src/components/MediumBlock.tsx'), 'utf8');
    check('§8 THE DESIGNER\'S 13:40 (1), (3), (5), (6) in the source (their branches open with a light, by clicks — the eye\'s and her look\'s): a cut by his own denial reads `cut here: it does not hold at …`, never `said`; a bond not decided reads `not decided yet`, the one wording; `holds · does not hold` stand in one unbreakable span; a box whose lines were all recorded keeps one empty row',
      !/you said/.test(surf) && /c\.deniedHere \? `it does not hold at /.test(surf) && /rb\.reading === 'NOT' \? 'decided: comes to nothing' : 'not decided yet'/.test(med) && !/isn't decided yet";/.test(med) && /data-altitude-sign-pair="true" className="inline-flex items-center gap-x-2 whitespace-nowrap"/.test(surf) && /delete nextExtra\[/.test(surf) && /setExtraLines\(nextExtra\)/.test(surf),
      {});
  }
  // RIDER R1×R2 under node: the head with the override, in the designer's 14:30 words; the not-decided line counting the open passages only
  {
    const shapeR = { ...shape0, faces: shape0.faces.map((f) => (f.id === faceFPT.id ? withOverride : f)) };
    useGeometryStore.setState({ shapes: { [shapeR.id]: shapeR }, shapeOrder: [shapeR.id], currentShapeId: shapeR.id });
    const htmlR = renderToString(React.createElement(MidpointSurface, { shape: shapeR, site: midpointSiteOf(shapeR, mid.id, packet ? packet.trace : null), parents: [spaceOf(shapeR, site.a), spaceOf(shapeR, site.b)], resolved: spaceOf(shapeR, mid.id), refusal: null, remade: null })).replace(/<!-- -->/g, '');
    const textR = htmlR.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
    check('§8 ★★ THE RIDER IN T\'S CORNER LINE (the designer\'s 14:30 (a), in STAMP THE-MODES-TAB §1.3\'s line): with his override at the signal the line reads `T — nothing on its edges · 33 by one role · 130 across its relations · 50 that T refuses · 4 cut by a denial` — T\'s refusals where they stood, his denial after them — and the not-decided line counts the open passages only, `163 passages through T not decided yet`',
      /data-medium-corner-bonds="130" data-medium-corner-refused="50" data-medium-corner-denied="4"/.test(htmlR) && /T — nothing on its edges · 33 by one role · 130 across its relations · 50 that T refuses · 4 cut by a denial/.test(textR) && /data-medium-unruled="163"/.test(htmlR) && /163 passages through T not decided yet/.test(textR),
      { corner: (textR.match(/T — [^·]*(·[^·]*){0,5}/) || [null])[0], unruled: (htmlR.match(/data-medium-unruled="(\d+)"/g) || []) });
    useGeometryStore.setState({ shapes: { [shapeA.id]: shapeA }, shapeOrder: [shapeA.id], currentShapeId: shapeA.id });
  }
  check('§8 F5 under node: no `list=` on any input; the box (and its relations lines) renders only with a light open — none here; U\'s corner line says it has not spoken (`U — nothing on its edges · nothing in its light yet · open U\'s light`)', !/ list="/.test(html) && !/data-midpoint-panel="light"/.test(html) && !/data-altitude-relations/.test(html) && /U — nothing on its edges · nothing in its light yet · open U's light/.test(text), {});
}

// ═══ §9 — STAMP THE-MODES-TAB · slice 1 (the designer's spec §1.2–§1.5, §1.7; Arman's 18:46: the matrix, its routes one at a time) — on her §5
// fixtures: ARMAN-2's 39 with his one override on Virgin Land's 18:34 record, and Virgin Land's own sitting of 17:59. Every count from the page's
// own readers (the sorting, the spaces), never from a letter; the agreement from his raw sayings, never from the page's marks.
console.log('\n----- §9 THE MODES TAB: the head, the corner lines, the grid, the card -----');
{
  const React = require('react');
  const { renderToString } = require('react-dom/server');
  const { useGeometryStore } = req('src/store/geometryStore.ts');
  const { MidpointSurface, midpointSiteOf } = req('src/components/MidpointSurface.tsx');
  const { buildGeneralSitePacketPresenterReport } = req('src/lib/generalSitePacketPresenterV0.ts');
  const { childSpaceOf, termWordsOf } = req('src/lib/instanceSpace.ts');
  const SO = req('src/lib/sorting.ts');
  const unesc = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const open = (shape, ws, la = 'F', lb = 'Φ') => {
    useGeometryStore.setState({ shapes: { [shape.id]: shape }, shapeOrder: [shape.id], currentShapeId: shape.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, altitudeRefusals: {}, lexicon: ws.lexicon || [], rules: ws.rules || [], bondRules: ws.bondRules || [], converses: ws.converses || [], opaque: ws.opaque || [], log: ws.log || [], modesView: null });
    const Fv = cornerOf(shape, la); const Pv = cornerOf(shape, lb);
    const midV = Object.values(shape.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(Fv) && v.createdBy.sourceVertexIds.includes(Pv));
    const packetV = buildGeneralSitePacketPresenterReport(shape).packets.find((p) => p.trace.siteId === midV.id);
    const siteV = midpointSiteOf(shape, midV.id, packetV ? packetV.trace : null);
    const edgeV = shape.edges.find((e) => e.vertexIds.includes(Fv) && e.vertexIds.includes(Pv));
    const render = (cell, at = 0, all = true) => {
      useGeometryStore.setState({ modesView: cell ? { siteId: midV.id, cell, all, at } : null });
      const h = renderToString(React.createElement(MidpointSurface, { shape, site: siteV, parents: [spaceOf(shape, siteV.a), spaceOf(shape, siteV.b)], resolved: spaceOf(shape, midV.id), refusal: null, remade: null })).replace(/<!-- -->/g, '');
      useGeometryStore.setState({ modesView: null });
      return { html: h, text: unesc(h) };
    };
    const sorting = SO.sortingOf(shape, edgeV, {}, ws.rules || [], { converses: ws.converses || [], opaque: ws.opaque || [] }, ws.bondRules || []);
    const [X, Y] = edgeV.vertexIds;
    const rows = (childSpaceOf(shape, X) || { roles: [] }).roles; const cols = (childSpaceOf(shape, Y) || { roles: [] }).roles;
    return { shape, edgeV, sorting, X, Y, rows, cols, render, label: (v) => shape.vertices[v].data.label, siteId: midV.id, ws };
  };
  // the counts the page should print, from the sorting alone
  const expectOf = (o) => {
    const { sorting, rows, cols, label, X, Y } = o;
    const plural = (n, a, b) => `${n} ${n === 1 ? a : b}`;
    const cells = new Set([...sorting.instances, ...sorting.bars].map((r) => `${r[1]}|${r[2]}`)).size;
    const head = sorting.instances.length + sorting.bars.length === 0 ? `${label(X)}–${label(Y)}: nothing related yet · ${rows.length * cols.length} pairs of roles`
      : `${label(X)}–${label(Y)}: ${plural(sorting.instances.length, 'relating', 'relatings')}${sorting.bars.length ? ' · ' + plural(sorting.bars.length, 'bar', 'bars') : ''}, on ${cells} of the ${rows.length * cols.length} pairs of roles`;
    const corners = sorting.views.map((v) => {
      const lz = label(v.view);
      const edges = v.paths.filter((p) => p.path.source !== 'altitude').length;
      const forks = v.paths.filter((p) => p.path.source === 'altitude').length;
      const live = v.altitude.bonds.filter((b) => b.reading !== 'REFUSED').length;
      const denied = v.altitude.bonds.filter((b) => b.reading === 'REFUSED' && b.refusal === 'denial').length;
      const refused = v.altitude.bonds.length - live - denied;
      const spoke = v.altitude.sayings > 0 || forks > 0 || v.altitude.bonds.length > 0;
      const light = spoke ? ([forks ? `${forks} by one role` : null, live ? `${live} across its relations` : null].filter(Boolean).join(' · ') || 'no passage in its light yet') : 'nothing in its light yet';
      return `${lz} — ${edges ? `${edges} by its edges` : 'nothing on its edges'} · ${light}${refused ? ` · ${refused} that ${lz} refuses` : ''}${denied ? ` · ${denied} cut by a denial` : ''}${spoke ? '' : ` · open ${lz}'s light`}`;
    });
    // the marks per cell, by state: waiting by the edges ▲, waiting in the light ●, decided ✓, refused or cut ✕
    const marks = new Map();
    const speaking = sorting.views.filter((v) => v.paths.length + v.altitude.bonds.length > 0);
    for (const v of sorting.views) {
      const per = new Map();
      const add = (cell, k) => { const m = per.get(cell) || { e: 0, l: 0, d: 0, x: 0 }; m[k] += 1; per.set(cell, m); };
      for (const p of v.paths) add(`${p.path.x}|${p.path.y}`, p.reading === 'UNRULED' ? (p.path.source === 'altitude' ? 'l' : 'e') : 'd');
      for (const b of v.altitude.bonds) add(`${b.bond.x}|${b.bond.y}`, b.reading === 'UNRULED' ? 'l' : b.reading === 'REFUSED' ? 'x' : 'd');
      const pre = speaking.length > 1 ? label(v.view) : '';
      for (const [cell, m] of per) marks.set(cell, [...(marks.get(cell) || []), ...[m.e ? `${pre}▲${m.e}` : null, m.l ? `${pre}●${m.l}` : null, m.d ? `${pre}✓${m.d}` : null, m.x ? `${pre}✕${m.x}` : null].filter(Boolean)]);
    }
    return { head, corners, marks };
  };
  const pageMarks = (html) => new Map([...html.matchAll(/data-medium-cell="([^"]+)"[^>]*?(?:data-medium-cell-routes="\d+")[^>]*>((?:(?!<\/button>).)*)<\/button>/g)].map((m) => [m[1], ((m[2].match(/data-medium-cell-marks="([^"]*)"/) || [])[1] || '')]));
  const cellAttrs = (html) => [...html.matchAll(/data-medium-cell="([^"]+)"/g)].map((m) => m[1]);
  const cornerTexts = (html) => [...html.matchAll(/data-medium-corner="[^"]*"[^>]*>([\s\S]*?)<\/span>(?=\s*<span data-medium-corner=|\s*<\/div>)/g)].map((m) => unesc(m[1]));

  // ARMAN-2 plus his one override on the 18:34 record
  const shapeM = { ...shape0, faces: shape0.faces.map((f) => (f.id === faceFPT.id ? withOverride : f)) };
  const oM = open(shapeM, save);
  const eM = expectOf(oM);
  const pM = oM.render(null);
  const headM = unesc((pM.html.match(/data-medium-head="true"[^>]*>([^<]*)</) || [])[1] || '');
  check('§9 ★★ THE HEAD (§1.2; Virgin Land\'s 8: `possible` goes): his relatings and bars on how many of the grid\'s pairs of roles — read from the sorting and the two spaces', headM === eM.head, { page: headM, sorting: eM.head });
  // Arman's 19:27 (the designer's 19:30): the pairing column's list of acts has a head counting what it holds, as the state line counts them (its bounded
  // height is the browser's — the eye's §27 measures it on Virgin Land's `Culture`)
  const actsHeadM = (pM.html.match(/data-midpoint-acts-head="([^"]*)"/) || [])[1] || null;
  const actsExpect = `${oM.sorting.instances.length} ${oM.sorting.instances.length === 1 ? 'relating' : 'relatings'}${oM.sorting.bars.length ? ` · ${oM.sorting.bars.length} ${oM.sorting.bars.length === 1 ? 'bar' : 'bars'}` : ''}`;
  check('§9 ★★ THE PAIRING COLUMN\'S LIST HAS A HEAD (Arman\'s 19:27; the designer\'s 19:30): it counts what the list holds as the state line counts them — his relatings and his bars — over the list that scrolls inside itself, the drawing first above it', actsHeadM === actsExpect && /data-midpoint-pairing-body="true"[\s\S]*data-midpoint-drawing-region="true"[\s\S]*data-midpoint-acts-head=[\s\S]*data-midpoint-acts-scroll="true"/.test(pM.html), { head: actsHeadM, expect: actsExpect });
  const cornersM = cornerTexts(pM.html);
  check('§9 ★★ ONE LINE PER CORNER (§1.3), in the strip\'s order: T\'s edges and T\'s light side by side, `refuses` T\'s, `cut` his, each only when not zero; U, silent, `nothing on its edges · nothing in its light yet · open U\'s light`', J(cornersM) === J(eM.corners), { page: cornersM, sorting: eM.corners });
  const cellsM = cellAttrs(pM.html);
  const marksM = pageMarks(pM.html);
  const wrong = [...new Set([...cellsM, ...eM.marks.keys()])].filter((c) => (marksM.get(c) || '') !== (eM.marks.get(c) || []).join(' '));
  check(`§9 ★★ THE GRID (§1.4): ${oM.rows.length} of F's roles down × ${oM.cols.length} of Φ's across, one cell per pair (${oM.rows.length * oM.cols.length}); every cell's marks are its routes counted by state — ▲ waiting by T's edges, ● waiting in T's light, ✓ decided, ✕ refused or cut — and an empty cell is empty (no mark, no zero)`, cellsM.length === oM.rows.length * oM.cols.length && wrong.length === 0 && [...marksM.values()].every((s) => !/[▲●✓✕]0/.test(s)), { cells: cellsM.length, wrong: wrong.slice(0, 5).map((c) => [c, marksM.get(c), eM.marks.get(c)]) });
  check('§9 the legend, one line under the grid: `a word with ↑ or ↓: a relating, read from the column\'s role or the row\'s · struck: a bar · waiting: ▲ by T\'s edges, ● in T\'s light · ✓ decided · ✕ refused or cut`; with no cell chosen, `choose a pair of roles: its routes open below, each drawn`, and no route rendered',
    pM.text.includes("a word with ↑ or ↓: a relating, read from the column's role or the row's · struck: a bar · waiting: ▲ by T's edges, ● in T's light · ✓ decided · ✕ refused or cut") && pM.text.includes('choose a pair of roles: its routes open below, each drawn') && !/data-medium-route=/.test(pM.html), {});
  // the card of the cell with the most routes: one at a time, then all; the order inside it; the rule once per shape
  const busiest = [...eM.marks.keys()].map((c) => [c, oM.sorting.views.reduce((n, v) => n + v.paths.filter((p) => `${p.path.x}|${p.path.y}` === c).length + v.altitude.bonds.filter((b) => `${b.bond.x}|${b.bond.y}` === c).length, 0)]).sort((a, b) => b[1] - a[1])[0];
  const [cellB, nB] = busiest;
  const waitingB = oM.sorting.views.reduce((n, v) => n + v.paths.filter((p) => `${p.path.x}|${p.path.y}` === cellB && p.reading === 'UNRULED').length + v.altitude.bonds.filter((b) => `${b.bond.x}|${b.bond.y}` === cellB && b.reading === 'UNRULED').length, 0);
  const one = oM.render(cellB, 0, false); const second = oM.render(cellB, 1, false); const allB = oM.render(cellB, 0, true);
  const walkOf = (r) => unesc((r.html.match(/data-medium-card-walk="[^"]*"[^>]*>([\s\S]*?)<\/span>(?=<div|<\/div>)/) || [])[1] || '');
  const routesOf = (r) => [...r.html.matchAll(/data-medium-route="[^"]+" data-medium-route-corner="([^"]+)" data-medium-route-kind="([^"]+)" data-medium-route-state="([^"]+)"/g)].map((m) => [m[1], m[2], m[3]]);
  const kindRank = { edges: 0, role: 1, relation: 2 }; const stateRank = { waiting: 0, decided: 1, refused: 2, cut: 3 };
  const ordered = (rs) => rs.every((r, i) => i === 0 || kindRank[rs[i - 1][1]] < kindRank[r[1]] || (kindRank[rs[i - 1][1]] === kindRank[r[1]] && stateRank[rs[i - 1][2]] <= stateRank[r[2]]));
  const gestures = [...allB.html.matchAll(/data-medium-(?:bond-)?rule-gesture="([^"]+)"/g)].map((m) => m[1]);
  const records = [...allB.html.matchAll(/data-medium-rule-record="([^"]+)"[^>]*>([^<]*)</g)].map((m) => [m[1], unesc(m[2])]); // Virgin Land's 27: the record under each field
  check(`§9 ★★ THE CARD, ONE ROUTE AT A TIME (§1.5 (3); his choice): the busiest pair (${nB} routes, ${waitingB} waiting) reads \`${nB} routes through T here · ${waitingB} not decided yet · 1 of ${nB} · previous · next · all ${nB} · show\` with ONE route rendered; \`next\` walks to \`2 of ${nB}\`; \`all · show\` renders all ${nB} with \`one at a time\` to fold them back`,
    walkOf(one) === `${nB} routes through T here${waitingB ? ` · ${waitingB} not decided yet` : ''} · 1 of ${nB} · previous · next · all ${nB} · show` && routesOf(one).length === 1 && /data-medium-card-previous="true" disabled=""/.test(one.html) && walkOf(second).includes(`· 2 of ${nB} ·`) && routesOf(second).length === 1 && routesOf(allB).length === nB && walkOf(allB) === `${nB} routes through T here${waitingB ? ` · ${waitingB} not decided yet` : ''} · one at a time`,
    { one: walkOf(one), second: walkOf(second), all: walkOf(allB), shown: [routesOf(one).length, routesOf(second).length, routesOf(allB).length] });
  check('§9 ★★ THE ORDER INSIDE A CELL (§1.5 (6)): by T\'s edges, then by one role, then across T\'s relations; within each kind waiting, decided, refused, cut — never ranked; THE RULE ONCE PER SHAPE (§1.5 (5)): no shape\'s gesture twice on the card, each with its record under it (Virgin Land\'s 27)', ordered(routesOf(allB)) && gestures.length === new Set(gestures).size && records.length === gestures.length && records.every(([, s]) => /^\d+ passages? of this shape across the solid, \d+ of them here · /.test(s)), { kinds: routesOf(allB).map((r) => `${r[1]}/${r[2]}`).slice(0, 12), gestures, records });
  // Virgin Land's 27 (the mothership's 19:37; the designer's 19:39): each field's record — N passages of its shape ACROSS THE SOLID (every edge's sorting,
  // read here edge by edge), H of them in this cell, and his decisions so far (none yet on ARMAN-2)
  const solidM = oM.shape.edges.map((e) => SO.sortingOf(oM.shape, e, {}, save.rules || [], { converses: save.converses || [], opaque: save.opaque || [] }, save.bondRules || [])).filter(Boolean);
  const keyIdOf = (k) => (k.shape === 'chain' ? `${k.w}|${k.w2}` : `${[k.w, k.w2].sort().join('|')}|${k.shape}`);
  const acrossOf = (id) => (id.startsWith('f|')
    ? solidM.reduce((n, s) => n + s.views.reduce((m2, v) => m2 + v.paths.filter((p) => p.path.keys.some((k) => `f|${keyIdOf(k)}` === id)).length, 0), 0)
    : solidM.reduce((n, s) => n + s.views.reduce((m2, v) => m2 + v.altitude.bonds.filter((b) => b.reading !== 'REFUSED' && `b|${b.bond.w}|${b.bond.S}|${b.bond.w2}` === id).length, 0), 0));
  const hereOf = (id) => oM.sorting.views.reduce((n, v) => n + (id.startsWith('f|') ? v.paths.filter((p) => `${p.path.x}|${p.path.y}` === cellB && p.path.keys.some((k) => `f|${keyIdOf(k)}` === id)).length : v.altitude.bonds.filter((b) => b.reading !== 'REFUSED' && `${b.bond.x}|${b.bond.y}` === cellB && `b|${b.bond.w}|${b.bond.S}|${b.bond.w2}` === id).length), 0);
  const recordWrong = records.filter(([id, s]) => s !== `${acrossOf(id)} ${acrossOf(id) === 1 ? 'passage' : 'passages'} of this shape across the solid, ${hereOf(id)} of them here · not decided yet`);
  check(`§9 ★★ THE RULE FIELD SHOWS HIS RECORD BEFORE HE NAMES (Virgin Land's 27; the designer's 19:39): on the busiest card each field reads \`N passages of this shape across the solid, H of them here · not decided yet\` — N counted at every edge of the solid (a rule holds across it), H on this card; his record listed alphabetically, then \`comes to nothing\`, then the undecided, never by count (the source), each count with its noun (the designer\'s 22:58, RUN: \`is directed at: 2 passages · is the case as: 3 passages · rests on: 1 passage · comes to nothing: 1 passage · not decided yet: 2 passages\`)`,
    records.length > 0 && recordWrong.length === 0 && /\[\.\.\.words\.entries\(\)\]\.sort\(\(a, b\) => a\[0\]\.localeCompare\(b\[0\]\)\)/.test(fs.readFileSync(path.join(repoRoot, 'src/components/MediumBlock.tsx'), 'utf8')) && req('src/components/MediumBlock.tsx').recordListOf([['is directed at', 2], ['is the case as', 3], ['rests on', 1]], 1, 2) === 'is directed at: 2 passages · is the case as: 3 passages · rests on: 1 passage · comes to nothing: 1 passage · not decided yet: 2 passages',
    { records: records.slice(0, 3), wrong: recordWrong.slice(0, 3).map(([id, s]) => [id, s, acrossOf(id), hereOf(id)]) });
  // Virgin Land's 28 (the mothership's 19:37; the designer's 19:39): a bond's verdict is keyed by the cell and its words (D6) — the mirror route shares it
  const tView = oM.sorting.views.find((v) => v.view === T);
  const groups = new Map();
  for (const rb of tView.altitude.bonds) { if (rb.reading === 'REFUSED') continue; const k = [rb.bond.x, rb.bond.w, rb.bond.z, rb.bond.S, rb.bond.z2, rb.bond.w2, rb.bond.y].join('|'); groups.set(k, [...(groups.get(k) || []), rb]); }
  const sharedG = [...groups.values()].find((g) => g.length > 1 && g.every((rb) => rb.reading === 'UNRULED'));
  if (sharedG) {
    const b0 = sharedG[0].bond; const cellS = `${b0.x}|${b0.y}`;
    const before = oM.render(cellS, 0, true);
    const waitBefore = Number((before.html.match(/data-medium-card-waiting="(\d+)"/) || [])[1]);
    const sharedLines = [...before.html.matchAll(/data-medium-bond-shared="(\d+)"[^>]*>([\s\S]*?)<\/span>/g)].map((m) => [Number(m[1]), unesc(m[2])]);
    const face = oM.shape.faces.find((f) => f.id === tView.faceId);
    const base = [face.vertexIds.indexOf(oM.X), face.vertexIds.indexOf(oM.Y)];
    const rec = { base, x: b0.x, w: b0.w, z: b0.z, w2: b0.w2, y: b0.y, S: b0.S, z2: b0.z2 };
    const took = useGeometryStore.getState().giveVerdict(face.id, { ...rec, w3: 'grounds', verdict: 'composed' });
    const oD = open(useGeometryStore.getState().shapes[oM.shape.id], save);
    const after = oD.render(cellS, 0, true);
    const waitAfter = Number((after.html.match(/data-medium-card-waiting="(\d+)"/) || [])[1]);
    const decidedLines = [...after.html.matchAll(/data-medium-bond-shared="(\d+)"[^>]*>([\s\S]*?)<\/span>/g)].map((m) => [Number(m[1]), unesc(m[2])]);
    useGeometryStore.getState().withdrawVerdict(face.id, rec);
    check(`§9 ★★ ONE DECISION THAT DECIDES SEVERAL SAYS SO (Virgin Land's 28; the designer's 19:39): on ARMAN-2 the ${sharedG.length} routes across T's ${b0.S} sharing one verdict's key (the cell and its words, D6 — the mirror route) each read \`one decision here decides ${sharedG.length} passages · show\` above their acts; decided once (\`grounds\`), each reads \`decided: … grounds … · for ${sharedG.length} passages · show\` and the card's not-decided count falls by ${sharedG.length}`,
      took === null && sharedLines.filter(([n, s]) => n === sharedG.length && s === `one decision here decides ${sharedG.length} passages · show`).length === sharedG.length && decidedLines.filter(([n, s]) => n === sharedG.length && new RegExp(`^decided: .+ grounds .+ · for ${sharedG.length} passages · show$`).test(s)).length === sharedG.length && waitBefore - waitAfter === sharedG.length,
      { took, cell: cellS, sharedLines, decidedLines, waiting: [waitBefore, waitAfter] });
  } else note('ARMAN-2 holds no pair of routes sharing one verdict — 28 is pinned in the source only here');
  // slice 2 (§1.6; Arman's 18:46): each route DRAWN above its sentence — every drawing on the busiest card against its own route's names (the route's key)
  const routeBlocks = [...allB.html.matchAll(/<div data-medium-route="([^"]+)" data-medium-route-corner="[^"]*" data-medium-route-kind="([^"]+)" data-medium-route-state="([^"]+)"[^>]*>([\s\S]*?)<\/svg>/g)].map((m) => ({ key: m[1], kind: m[2], state: m[3], svg: m[4] }));
  const svgTexts = (svg) => Object.fromEntries([...svg.matchAll(/<text data-route-([a-z]+)="([a-z0-9]+)"[^>]*>([^<]*)<\/text>/g)].map((m) => [`${m[1]}:${m[2]}`, unesc(m[3])]));
  const word = (w) => (w === 'IS' ? '≡' : w);
  const nX = (id) => termWordsOf(oM.shape, oM.X, id, {}); const nY = (id) => termWordsOf(oM.shape, oM.Y, id, {});
  const drawWrong = routeBlocks.filter((rb) => {
    const k = rb.key.split('|'); const tx = svgTexts(rb.svg); const nTv = (id) => termWordsOf(oM.shape, k[0], id, {});
    if (rb.kind === 'relation') { const [, x, w1, z, Srel, z2, w2, y, zAt] = k; const zx = zAt === 'x' ? z : z2; const zy = zAt === 'x' ? z2 : z; return !(/data-medium-route-drawing="relation"/.test(rb.svg) && tx['end:row'] === nX(x) && tx['end:column'] === nY(y) && tx['top:0'] === nTv(zx) && tx['top:1'] === nTv(zy) && tx['word:row'] === word(w1) && tx['word:column'] === word(w2) && tx['word:relation'] === word(Srel) && /data-route-line="relation"[^>]*stroke-dasharray="3 3"/.test(rb.svg) === (rb.state === 'refused' || rb.state === 'cut')); }
    const [, x, w1, z, w2, y] = k; return !(/data-medium-route-drawing="one"/.test(rb.svg) && tx['end:row'] === nX(x) && tx['end:column'] === nY(y) && tx['top:0'] === nTv(z) && tx['word:row'] === word(w1) && tx['word:column'] === word(w2) && !('top:1' in tx));
  });
  // a card holding a refused route: its relation's line dashed, as a denial is dashed in the light
  const refusedCell = [...eM.marks.entries()].find(([, ms]) => ms.some((s) => s.includes('✕')));
  const refusedCard = refusedCell ? oM.render(refusedCell[0], 0, true) : null;
  const refusedBlocks = refusedCard ? [...refusedCard.html.matchAll(/<div data-medium-route="[^"]+" data-medium-route-corner="[^"]*" data-medium-route-kind="relation" data-medium-route-state="(refused|cut)"[^>]*>([\s\S]*?)<\/svg>/g)] : [];
  check(`§9 ★★ EACH ROUTE DRAWN (STAMP THE-MODES-TAB slice 2, §1.6; Arman's 18:46: the diagram of the second box): on the busiest card every one of its ${routeBlocks.length} routes is drawn above its sentence — the row's role low left, the corner's role high (across a relation its two roles, joined by the relation's word), the column's role low right, each leg's word as typed — every name the route's own; a refused or cut relation's line dashed`,
    routeBlocks.length === nB && drawWrong.length === 0 && refusedBlocks.length > 0 && refusedBlocks.every((m) => /data-route-line="relation"[^>]*stroke-dasharray="3 3"/.test(m[2])),
    { routes: routeBlocks.length, wrong: drawWrong.slice(0, 2).map((rb) => [rb.key, svgTexts(rb.svg)]), refused: refusedBlocks.length });
  // his relating's card: the standing, and T's agreement at its two ends — from his RAW sayings (ARMAN-2's file), never from the page's marks
  const present = new Map();
  for (const it of hand.relatings) { if (it.holds === false) continue; const to = roleRef(it.to); const z = roleRef(it.from).id; const k = `${to.side}|${to.id}`; present.set(k, new Set([...(present.get(k) || []), z])); }
  const nameT = (z) => termWordsOf(oM.shape, T, z, {});
  const agreementOf = (x, y) => {
    const zx = [...(present.get(`${oM.label(oM.X)}|${x}`) || [])]; const zy = [...(present.get(`${oM.label(oM.Y)}|${y}`) || [])];
    const both = zx.filter((z) => zy.includes(z));
    if (both.length) return `${both.map(nameT).reduce((acc, s, i, a) => (i === 0 ? s : i === a.length - 1 ? `${acc} and ${s}` : `${acc}, ${s}`), '')} at both ends`;
    if (zx.length && zy.length) return 'T at both ends, by different roles';
    return zx.length || zy.length ? 'T at one end' : 'T at neither end';
  };
  const relCells = [...new Set(oM.sorting.instances.map((r) => `${r[1]}|${r[2]}`))];
  const cardLines = relCells.map((c) => { const r = oM.render(c, 0, false); return [c, [...r.html.matchAll(/data-medium-card-relating="[^"]+">([^<]*)</g)].map((m) => unesc(m[1]))]; });
  const agreeWrong = cardLines.filter(([c, ls]) => { const [x, y] = c.split('|'); return !ls.every((l) => l.endsWith(` · ${agreementOf(x, y)}`)); });
  check(`§9 ★★ HIS RELATING ON ITS CARD (§1.5 (2); Virgin Land's 16): each of his ${oM.sorting.instances.length} relatings reads its standing and T's agreement at its two ends — the agreement from his own sayings at the ends' roles (\`… at both ends\` · \`T at both ends, by different roles\` · \`T at one end\` · \`T at neither end\`)`, cardLines.length === relCells.length && cardLines.every(([, ls]) => ls.length >= 1) && agreeWrong.length === 0, { lines: cardLines.slice(0, 3), wrong: agreeWrong.slice(0, 3) });
  // the parallels in three forms (§1.7): the both-refuse form in the source (its rows open on `show`, a click the eye makes)
  const medSrc = fs.readFileSync(path.join(repoRoot, 'src/components/MediumBlock.tsx'), 'utf8');
  check('§9 THE PARALLELS IN THREE FORMS (§1.7; the mothership\'s ruling): both refuse reads `F refuses "…", and beside it T refuses "…"` — two refusals, kept, no rule gesture; one refuses, the discordance; both hold, the parallel (the source: the rows open on `show`)', /!p\.R\.holds && !p\.S\.holds \? `\$\{lab\} refuses "\$\{sentence\(end, p\)\}", and beside it \$\{lz\} refuses "\$\{zSentence\(p\)\}"`/.test(medSrc) && /data-medium-parallel-refused=\{!p\.R\.holds && !p\.S\.holds \? 'both' : undefined\}/.test(medSrc), {});

  // Virgin Land's own sitting of 17:59 (her §5's first fixture): the head and the corner lines from its own sorting
  const vl17 = JSON.parse(fs.readFileSync(path.join(FIX, 'virgin-land_2026-10-09_1759_F-Phi_T-spoke_6-relatings-1-bar.workspace.json'), 'utf8'));
  const shapeV17 = vl17.shapes[vl17.currentShapeId];
  const oV = open(shapeV17, vl17);
  const eV = expectOf(oV);
  const pV = oV.render(null);
  const headV = unesc((pV.html.match(/data-medium-head="true"[^>]*>([^<]*)</) || [])[1] || '');
  const marksV = pageMarks(pV.html);
  const wrongV = [...new Set([...cellAttrs(pV.html), ...eV.marks.keys()])].filter((c) => (marksV.get(c) || '') !== (eV.marks.get(c) || []).join(' '));
  note(`Virgin Land 17:59: ${headV} ‖ ${J(cornerTexts(pV.html))}`);
  check('§9 ★★ ON VIRGIN LAND\'S SITTING OF 17:59 (her §5): the head, the corner lines and every cell\'s marks read as its own sorting counts them', headV === eV.head && J(cornerTexts(pV.html)) === J(eV.corners) && wrongV.length === 0, { head: [headV, eV.head], corners: [cornerTexts(pV.html), eV.corners], wrong: wrongV.slice(0, 4) });
  // ═══ STAMP THE-MODES-TAB · slice 3 (§1.1): THE WORDS STRIP first in the tab, a pressed word's facts under it, the act's chooser keeping only the act ═══
  const RL = req('src/lib/relatings.ts');
  const balanced = (html, marker, tag) => { const i = html.indexOf(marker); if (i < 0) return ''; const start = html.lastIndexOf('<' + tag, i); const re = tag === 'div' ? /<(\/?)div\b[^>]*>/g : /<(\/?)span\b[^>]*>/g; re.lastIndex = start; let depth = 0; let mm; while ((mm = re.exec(html))) { depth += mm[1] ? -1 : 1; if (depth === 0) return html.slice(start, re.lastIndex); } return ''; };
  const stripOf = (o, word, all) => {
    useGeometryStore.setState({ modesStrip: word === undefined ? null : { siteId: o.siteId, word, all: !!all } });
    const r = o.render(null);
    useGeometryStore.setState({ modesStrip: null });
    const tab = r.html.indexOf('data-medium-modes-tab="true"');
    const s = balanced(r.html, 'data-medium-strip="true"', 'div');
    const f = balanced(r.html, 'data-medium-word-facts=', 'div');
    const iS = r.html.indexOf('data-medium-strip="true"');
    return { html: r.html, line: unesc(s), words: [...s.matchAll(/data-medium-strip-word="([^"]+)"/g)].map((mm) => unesc(mm[1])), pressed: unesc((s.match(/data-medium-strip-word="([^"]+)" data-medium-strip-word-pressed="true"/) || ['', ''])[1]) || null,
      facts: f ? { converse: unesc(balanced(f, 'data-medium-converse=', 'span')), opaque: unesc(balanced(f, 'data-medium-opaque-line=', 'span')), chosen: (f.match(/data-medium-opaque="([a-z]+)" data-medium-opaque-chosen="true"/) || [])[1] || null } : null,
      chooser: unesc(balanced(r.html, 'data-medium-modes="true"', 'span')), first: tab >= 0 && iS > tab && iS < r.html.indexOf('data-medium-head="true"', tab), isPressable: /data-medium-strip-word="IS"/.test(s) };
  };
  // what the page should print, from the fixture's lexicon and its edge's own sorting (the head's relatings and bars)
  const stripExpect = (o, pressed, all) => {
    const words = RL.lexiconOf(o.shape, o.ws.lexicon || []).filter((x) => x !== 'IS');
    const used = new Set([...o.sorting.instances, ...o.sorting.bars].map((r) => r[0]));
    const here = words.filter((x) => used.has(x));
    const shown = all ? words : words.filter((x) => here.includes(x) || x === pressed);
    const more = words.length - shown.length;
    const moreText = all ? "only this edge's words" : more ? `${more === 1 ? '1 more word' : `${more} more words`} · show` : '';
    const facts = { converses: o.ws.converses || [], opaque: o.ws.opaque || [] };
    const conv = pressed ? RL.converseOf(facts, pressed) : null;
    return { words, here, shown, more, line: 'modes IS ≡' + (shown.length ? ' ' + shown.join(' · ') : '') + (moreText ? (shown.length ? ' · ' : ' ') + moreText : ''),
      chooser: 'modes: IS ≡ ' + (here.length ? here.join(' · ') + ' · ' : '') + '+ a mode' + (words.length > here.length ? ` · ${words.length - here.length} more · show` : ''),
      facts: pressed ? { converse: conv !== null ? `${pressed} the other way round: ${conv} · withdraw` : '+ the other way round', opaque: `in ${pressed}, paired roles stand in for each other · they don't`, chosen: RL.isOpaque(facts, pressed) ? 'stops' : 'through' } : null };
  };
  // each fixture opened afresh: the page reads the lexicon and the word facts from the STORE, which holds the last fixture opened
  const stripCases = [['Virgin Land 17:59', () => open(shapeV17, vl17)], ["ARMAN-2's 39", () => open(shapeM, save)]].map(([name, mk]) => {
    const o = mk();
    const e0 = stripExpect(o, null, false); const f0 = stripOf(o, undefined);
    const eA = stripExpect(o, null, true); const fA = stripOf(o, null, true);
    const pw = e0.here[0] || null; const eP = stripExpect(o, pw, false); const fP = pw ? stripOf(o, pw, false) : null;
    const rw = e0.words.find((x) => !e0.here.includes(x)) || null; const eR = stripExpect(o, rw, false); const fR = rw ? stripOf(o, rw, false) : null;
    return { name, e0, f0, eA, fA, pw, eP, fP, rw, eR, fR };
  });
  stripCases.forEach((c) => note(`${c.name}: the strip \`${c.f0.line}\` · the chooser \`${c.f0.chooser}\` · pressed ${c.pw}: ${J(c.fP && c.fP.facts)}`));
  check('§9 ★★ THE WORDS STRIP (STAMP THE-MODES-TAB slice 3, §1.1; the mothership\'s point 1): first in the tab, above its head — `modes`, IS ≡ apart (never pressable: it has no facts to open), then the words in use at this edge (its relatings\' and bars\' words, the head\'s own) in the order they were made, then `N more words · show`; nothing open under it until a word is pressed — on both her §5 fixtures, every word and count from the fixture\'s lexicon and its edge\'s own sorting',
    stripCases.every((c) => c.f0.first && !c.f0.isPressable && c.f0.line === c.e0.line && J(c.f0.words) === J(c.e0.here) && c.f0.facts === null && c.e0.here.length > 0),
    stripCases.map((c) => ({ fixture: c.name, page: c.f0.line, expected: c.e0.line })));
  check('§9 ★★ THE STRIP\'S REST ONE CLICK AWAY: `show` opens the rest of the lexicon on the same line, every word in the order made, then `only this edge\'s words` to fold it back',
    stripCases.every((c) => c.fA.line === c.eA.line && J(c.fA.words) === J(c.eA.words) && c.eA.more === 0),
    stripCases.map((c) => ({ fixture: c.name, page: c.fA.line, expected: c.eA.line })));
  check('§9 ★★ A PRESSED WORD\'S FACTS OPEN UNDER THE STRIP (§1.1; her ruling: they are the word\'s own and hold across the solid — the converse and stand-in acts moved from the pairing column): `<word> the other way round: <its> · withdraw`, or `+ the other way round` when it has none, and `in <word>, paired roles stand in for each other · they don\'t` with its choice; a word pressed from the rest stays on the line while pressed, the `N more` one fewer',
    stripCases.every((c) => !!c.fP && c.fP.pressed === c.pw && J(c.fP.facts) === J(c.eP.facts) && c.fP.line === c.eP.line && (!c.rw || (!!c.fR && c.fR.pressed === c.rw && c.fR.line === c.eR.line && J(c.fR.words) === J(c.eR.shown) && J(c.fR.facts) === J(c.eR.facts)))),
    stripCases.map((c) => ({ fixture: c.name, pressed: [c.pw, c.fP && c.fP.facts, c.eP.facts], rest: [c.rw, c.fR && c.fR.line, c.eR.line] })));
  check('§9 ★★ THE ACT KEEPS ITS CHOOSER ONLY (§1.1): the pairing column\'s modes line is `modes: IS ≡ <this edge\'s words> · + a mode · N more · show` — the rest one click away — and no other-way-round or stand-in line stands at the act',
    stripCases.every((c) => c.f0.chooser === c.e0.chooser && !/data-medium-converse=|data-medium-opaque-line=/.test(c.f0.html.slice(0, c.f0.html.indexOf('data-medium-modes-tab="true"')))),
    stripCases.map((c) => ({ fixture: c.name, page: c.f0.chooser, expected: c.e0.chooser })));
  // ═══ THE DESIGNER'S LOOK AT 4553417 (her 22:48 five; item 4 on the mothership's ruling of 22:55 in her words of 22:57; the nouns, 22:58), on the
  // fixture she looked at — Virgin Land's 19:34 export (Value–Fact, two lights, every passage decided). Every form from the fixture's own sortings ═══
  const vlL = JSON.parse(fs.readFileSync(path.join(FIX, 'virgin-land_2026-10-09_1934_Value-Fact_all-passages-decided.workspace.json'), 'utf8'));
  const oL = open(vlL.shapes[vlL.currentShapeId], vlL, 'Value', 'Fact');
  const nmL = (z, id) => termWordsOf(oL.shape, z, id, {});
  const keyIdL = (k) => (k.shape === 'chain' ? `${k.w}|${k.w2}` : `${[k.w, k.w2].sort().join('|')}|${k.shape}`);
  const routeKeysL = (r) => [...r.html.matchAll(/data-medium-route="([^"]+)" data-medium-route-corner="[^"]*" data-medium-route-kind="([^"]+)" data-medium-route-state="([^"]+)"/g)].map((m) => ({ key: m[1], kind: m[2], state: m[3] }));
  const gesturesL = (html) => [...html.matchAll(/data-medium-(?:bond-)?rule-gesture="([^"]+)"/g)].map((m) => m[1]);
  // a route offers a rule when it is a passage read with a shape (readable, its keys) or a bond neither refused nor cut — the page's own readers' facts
  const offersL = (rt) => { const k = rt.key.split('|'); const v = oL.sorting.views.find((vv) => vv.view === k[0]); if (!v) return false;
    if (rt.kind === 'relation') return rt.state !== 'refused' && rt.state !== 'cut';
    const p = v.paths.find((pp) => pp.path.x === k[1] && pp.path.w === k[2] && pp.path.z === k[3] && pp.path.w2 === k[4] && pp.path.y === k[5]);
    return !!p && p.path.readable && p.path.keys.length > 0; };
  const nAt = (c) => oL.sorting.views.reduce((a, v) => a + v.paths.filter((p) => `${p.path.x}|${p.path.y}` === c).length + v.altitude.bonds.filter((b) => `${b.bond.x}|${b.bond.y}` === c).length, 0);
  const passageCells = [...new Set(oL.sorting.views.flatMap((v) => v.paths.map((p) => `${p.path.x}|${p.path.y}`)))];
  const oneByOne = [];
  for (const c of passageCells) for (let at = 0; at < nAt(c); at++) {
    const r = oL.render(c, at, false); const rt = routeKeysL(r)[0]; if (!rt) continue;
    const rec = (r.html.match(/data-medium-rule-record="[^"]+"[^>]*>([\s\S]*?)<\/span>/) || [])[1];
    oneByOne.push({ c, at, ...rt, offers: offersL(rt), gestures: gesturesL(r.html).length, record: rec ? unesc(rec) : null });
  }
  const ruleWrongL = oneByOne.filter((x) => (x.offers ? x.gestures !== 1 : x.gestures !== 0));
  const decidedRecorded = oneByOne.filter((x) => x.state === 'decided' && x.offers && x.gestures === 1 && !!x.record && /· decided so far/.test(x.record));
  const allL = decidedRecorded.length ? oL.render(decidedRecorded[0].c, 0, true) : null;
  const gAll = allL ? gesturesL(allL.html) : [];
  check('§9 ★★ THE RULE FIELD ON EVERY ROUTE THAT CAN TAKE ONE (the designer\'s 22:48 (1), her spec\'s error corrected): one route at a time, every route\'s card whose route is not refused or cut carries the rule\'s field, waiting or decided — on Virgin Land\'s 19:34 export, where every passage is decided, the field stands on decided routes with his record beside it (`… · decided so far …`, her 27, which existed for exactly this moment and was unreachable); refused and cut carry none; under `all · show` once per shape',
    oneByOne.length > 0 && ruleWrongL.length === 0 && decidedRecorded.length > 0 && gAll.length > 0 && new Set(gAll).size === gAll.length,
    { routes: oneByOne.length, wrong: ruleWrongL.slice(0, 3), decided: decidedRecorded.slice(0, 2).map((x) => [x.c, x.record]), all: gAll });
  // (2) across a relation the reading says `comes to …`, the same family as by one role
  const bondCellsL = [...new Set(oL.sorting.views.flatMap((v) => v.altitude.bonds.filter((b) => b.reading === 'COMPOSED' || b.reading === 'LIGHT' || b.reading === 'TENSION').map((b) => `${b.bond.x}|${b.bond.y}`)))].slice(0, 4);
  const bondCards = bondCellsL.map((c) => oL.render(c, 0, true));
  const readsL = bondCards.flatMap((r) => [...r.html.matchAll(/data-medium-bond-reading="(?:COMPOSED|LIGHT|TENSION)"[\s\S]*?<span>((?:it )?comes to [^<]*)<\/span>/g)].map((m) => unesc(m[1])));
  check('§9 ★★ ONE READING, ONE FORM (the designer\'s 22:48 (2)): across a relation the reading line says `comes to …` (`comes to the good is the case as the done, also related directly`), as by one role — never `it comes to`',
    readsL.length > 0 && readsL.every((s) => s.startsWith('comes to ')) && bondCards.every((r) => !/data-medium-bond-reading[\s\S]*?it comes to/.test(r.html)),
    { reads: readsL.slice(0, 3) });
  // (3) the parallels name their corner, with two lights each its own
  const pL = oL.render(null);
  const parHeads = [...pL.html.matchAll(/data-medium-parallels-head="([^"]+)" data-medium-parallels="(\d+)\|(\d+)"[^>]*>([^<]*)</g)].map((m) => ({ z: unesc(m[1]), a: m[2], b: m[3], text: unesc(m[4]) }));
  check('§9 ★★ THE PARALLELS NAME THEIR CORNER (the designer\'s 22:48 (3)): with two lights, two heads, each `Meaning\'s parallels: N with Value\'s relations · M with Fact\'s · show` for its own corner',
    parHeads.length === 2 && new Set(parHeads.map((h) => h.z)).size === 2 && parHeads.every((h) => h.text === `${h.z}'s parallels: ${h.a} with Value's relations · ${h.b} with Fact's ·`),
    parHeads);
  // (4) `decisions differ`, per SHAPE across the solid (the mothership's ruling of 22:55; the designer's words of 22:57): expected from the solid's sortings,
  // by the record's own predicate (open · comes to nothing · a word), each word on its pairs, this edge's in the grid's order
  const solidL = oL.shape.edges.map((e) => ({ e, s: SO.sortingOf(oL.shape, e, {}, vlL.rules || [], { converses: vlL.converses || [], opaque: vlL.opaque || [] }, vlL.bondRules || []) })).filter((x) => x.s);
  const decL = (p) => (p.reading === 'UNRULED' ? null : p.reading === 'NOT' || p.reading === 'HELD' ? 0 : p.composite);
  const shapesL = new Map(); for (const v of oL.sorting.views) for (const p of v.paths) if (p.path.readable && p.path.keys.length > 0) shapesL.set(keyIdL(p.path.keys[0]), p.path.keys[0]);
  const rowIxL = new Map(oL.rows.map((r, i) => [r.id, i])); const colIxL = new Map(oL.cols.map((c, i) => [c.id, i]));
  const shapeWordsL = (k) => (k.shape === 'chain' ? `${k.w} then ${k.w2}` : `${k.w} and ${k.w2} ${k.shape === 'fork' ? 'from' : 'into'} one point`);
  const expDiffer = [...shapesL].map(([id, k]) => {
    const at = new Map();
    for (const { e, s } of solidL) for (const v of s.views) for (const p of v.paths) {
      if (!p.path.keys.some((kk) => keyIdL(kk) === id)) continue; const d = decL(p); if (d === null) continue;
      const here = e.vertexIds[0] === oL.X && e.vertexIds[1] === oL.Y; const o = d === 0 ? '' : d;
      const lab = here ? `${nmL(oL.X, p.path.x)} · ${nmL(oL.Y, p.path.y)}` : `${oL.label(e.vertexIds[0])}–${oL.label(e.vertexIds[1])}: ${nmL(e.vertexIds[0], p.path.x)} · ${nmL(e.vertexIds[1], p.path.y)}`;
      const ord = here ? rowIxL.get(p.path.x) * 100000 + colIxL.get(p.path.y) : 1e12;
      const m = at.get(o) || new Map(); if (!m.has(lab)) m.set(lab, ord); at.set(o, m);
    }
    const words = [...at.keys()].filter((o) => o !== '').sort((a, b) => a.localeCompare(b)); const outs = at.has('') ? [...words, ''] : words;
    const pairs = (o) => [...at.get(o)].sort((a, b) => a[1] - b[1]).map(([l]) => l); const ow = (o) => (o === '' ? 'comes to nothing' : o);
    return { id, outs, line: `${shapeWordsL(k)}: ${outs.map((o) => `${ow(o)} on ${pairs(o).length} ${pairs(o).length === 1 ? 'pair' : 'pairs'}`).join(' · ')} · show`, pairsLine: outs.map((o) => `${ow(o)}: ${pairs(o).join(', ')}`).join(' · ') };
  }).filter((x) => x.outs.length >= 2);
  const differAt = (o, view) => { useGeometryStore.setState({ modesDiffer: view ? { siteId: o.siteId, ...view } : null }); const r = o.render(null); useGeometryStore.setState({ modesDiffer: null }); return r; };
  const lineOfAttr = (html, attr) => { const i = html.indexOf(attr); if (i < 0) return null; const st = html.lastIndexOf('<span', i); const re = /<(\/?)span\b[^>]*>/g; re.lastIndex = st; let dpt = 0; let mm; while ((mm = re.exec(html))) { dpt += mm[1] ? -1 : 1; if (dpt === 0) return unesc(html.slice(st, re.lastIndex)); } return null; };
  const dFold = differAt(oL, null); const dOpen = differAt(oL, { open: true, shapes: [] }); const dPairs = expDiffer.length ? differAt(oL, { open: true, shapes: [expDiffer[0].id] }) : dOpen;
  const pageHead = lineOfAttr(dFold.html, 'data-medium-differ-shapes=');
  const pageShape = lineOfAttr(dOpen.html, 'data-medium-differ-shape=');
  const pagePairs = lineOfAttr(dPairs.html, 'data-medium-differ-pairs=');
  const quietV = differAt(open(shapeV17, vl17), null); const quietM = differAt(open(shapeM, save), null);
  note(`decisions differ on Virgin Land's 19:34: ${pageHead} ‖ ${pageShape} ‖ ${pagePairs}`);
  check('§9 ★★ DECISIONS DIFFER NAMES ITS SHAPES (the designer\'s 22:48 (4) withdrawn to per shape at 22:55 on the coder\'s measurement; the mothership\'s ruling of 22:55: the rule\'s question, per SHAPE across the solid; her words of 22:57): under the grid `decisions differ in 1 shape · show`; opened, the shape in the rule field\'s words, its words alphabetically then `comes to nothing`, each `on N pairs`; its own `show` names the pairs at each word, this edge\'s by the card\'s head in the grid\'s order — every word, count and pair from the solid\'s sortings by the record\'s predicate; no line where nothing differs (Virgin Land\'s 17:59, ARMAN-2), nothing new on a card',
    expDiffer.length === 1 && pageHead === `decisions differ in 1 shape · show` && pageShape === expDiffer[0].line && pagePairs === expDiffer[0].pairsLine
      && !/data-medium-differ-shapes=/.test(quietV.html) && !/data-medium-differ-shapes=/.test(quietM.html) && !/decisions differ here/.test(dPairs.html),
    { page: [pageHead, pageShape, pagePairs], expected: expDiffer.map((x) => [x.line, x.pairsLine]) });
  // (5) the card's agreement names its corner when two lights speak — every one of her relatings' cards, and the line the designer read at the bench
  const oL2 = open(vlL.shapes[vlL.currentShapeId], vlL, 'Value', 'Fact');
  const relCellsL = [...new Set(oL2.sorting.instances.map((r) => `${r[1]}|${r[2]}`))];
  const cardLinesL = relCellsL.flatMap((c) => [...oL2.render(c, 0, false).html.matchAll(/data-medium-card-relating="[^"]*"[^>]*>([\s\S]*?)<\/span>/g)].map((m) => unesc(m[1])));
  const speakingL = oL2.sorting.views.filter((v) => v.altitude.sayings > 0).map((v) => oL2.label(v.view));
  const agreeWrongL = cardLinesL.filter((t) => { const parts = t.split(' · ').slice(2); return parts.length !== speakingL.length || !parts.every((p2, i) => new RegExp(`^${speakingL[i]}: (at one end|at neither end|at both ends, by different roles|.+ at both ends)$`).test(p2)); });
  const herLine = cardLinesL.find((t) => t.startsWith('the good is the case as the done'));
  check('§9 ★★ THE AGREEMENT NAMES ITS CORNER WHEN TWO SPEAK (the designer\'s 22:48 (5)): on every card of Virgin Land\'s relatings at Value–Fact, with Meaning and Action both speaking, each light\'s agreement leads with its corner — the line she read at the bench reads `the good is the case as the done · also through Action · Meaning: at one end · Action: the deed and the character at both ends`; with one light unchanged (ARMAN-2 above)',
    speakingL.length === 2 && cardLinesL.length > 0 && agreeWrongL.length === 0 && herLine === 'the good is the case as the done · also through Action · Meaning: at one end · Action: the deed and the character at both ends',
    { speaking: speakingL, lines: cardLinesL.length, wrong: agreeWrongL.slice(0, 3), her: herLine });
  // ═══ the point tab on Virgin Land's evening sitting (Value–Fact, two lights) ═══
  const pointOf = (o) => { const r = o.render(null); const lineM = r.html.match(/data-medium-named-under="true"[^>]*>([\s\S]*?)<\/span><\/div>/); return { html: r.html, name: lineM ? unesc(lineM[1]) : '', child: unesc((r.html.match(/data-medium-child="true"[^>]*>([^<]*)</) || [])[1] || ''), lights: unesc((r.html.match(/data-medium-beside-lights="\d+"[^>]*>([^<]*)</) || [])[1] || '') }; };
  // the D27 rider per light on `Culture` (19:04): each light's sayings that HOLD at the instances' ends, from the altitude at its face (the page's reader)
  const vlC = JSON.parse(fs.readFileSync(path.join(FIX, 'virgin-land_2026-10-09_1904_Value-Fact_named-Culture.workspace.json'), 'utf8'));
  const oC = open(vlC.shapes[vlC.currentShapeId], vlC, 'Value', 'Fact');
  const pC = pointOf(oC);
  const heldBy = oC.sorting.views.map((v) => {
    const alt = A.altitudeOf(oC.shape, v.faceId, v.view, {});
    if (!alt) return [oC.label(v.view), 0];
    const eX = alt.face.vertexIds.indexOf(oC.X); const eY = alt.face.vertexIds.indexOf(oC.Y);
    const ends = new Set(oC.sorting.instances.flatMap((r) => [`${eX}|${r[1]}`, `${eY}|${r[2]}`]));
    return [oC.label(v.view), A.sayingsOf(alt.entries).filter((s) => s[5] === '+' && ends.has(`${s[3]}|${s[4]}`)).length];
  }).filter(([, n]) => n > 0);
  const holdWord = (n) => (n === 1 ? 'holds' : 'hold');
  note(`Culture's name line: ${pC.name} ‖ held per light ${J(heldBy)}`);
  check('§9 ★★ D27 PER LIGHT ON VIRGIN LAND\'S `Culture` (the mothership\'s 19:06 rider: "on Culture, per light"; the designer\'s 19:08): each light that held at the instances\' ends shows its count on the name line — `· beside them, N that hold · show` after its denials, or `, with X, N that hold · show` — N from the altitude at its face; the name given at the present stage (no since-then part)',
    heldBy.length > 0 && !/; since then/.test(pC.name) && heldBy.every(([lz, n]) => new RegExp(`(against ${lz}, [^;]*? · beside them, ${n} that ${holdWord(n)} · show|, with ${lz}, ${n} that ${holdWord(n)} · show)`).test(pC.name)),
    { name: pC.name, heldBy });
  // ADR §9.35 on the 19:34 export (all 32 passages decided): the passages decided in the lights beside the concept, by view; the researcher's falsifier
  const vl34 = JSON.parse(fs.readFileSync(path.join(FIX, 'virgin-land_2026-10-09_1934_Value-Fact_all-passages-decided.workspace.json'), 'utf8'));
  const o34 = open(vl34.shapes[vl34.currentShapeId], vl34, 'Value', 'Fact');
  const lightsBy = (o) => o.sorting.views.map((v) => [o.label(v.view), v.paths.filter((p) => p.reading === 'LIGHT' && p.path.source !== 'coordinate').length + v.altitude.bonds.filter((b) => b.reading === 'LIGHT').length]).filter(([, n]) => n > 0);
  const lineOf = (lb) => { const sum = lb.reduce((s, [, n]) => s + n, 0); if (!lb.length) return ''; const pl = sum === 1 ? 'passage' : 'passages'; return lb.length === 1 ? `beside it, ${sum} ${pl} decided in ${lb[0][0]}'s light` : `beside it, ${sum} ${pl} decided in the lights: ${lb.map(([l, n]) => `${n} in ${l}'s`).join(', ')}`; };
  const p34 = pointOf(o34); const lb34 = lightsBy(o34);
  const eVF = o34.edgeV; const valueFirst = o34.label(eVF.vertexIds[0]) === 'Value';
  const cellOT = valueFirst ? 'ought|totality' : 'totality|ought';
  useGeometryStore.getState().declareMode('is the case as');
  if (valueFirst) useGeometryStore.getState().giveRelating(eVF.id, 'is the case as', 'ought', 'totality', '+', '→'); else useGeometryStore.getState().giveRelating(eVF.id, 'is the case as', 'totality', 'ought', '+', '←');
  const o34b = open(useGeometryStore.getState().shapes[o34.shape.id], vl34, 'Value', 'Fact');
  const p34b = pointOf(o34b); const lb34b = lightsBy(o34b);
  const composedThere = o34b.sorting.views.some((v) => v.paths.some((p) => `${p.path.x}|${p.path.y}` === cellOT && p.reading === 'COMPOSED' && p.composite === 'is the case as') || v.altitude.bonds.some((b) => `${b.bond.x}|${b.bond.y}` === cellOT && b.reading === 'COMPOSED' && b.composite === 'is the case as'));
  note(`19:34: ${p34.child} ‖ ${p34.lights} → ${p34b.child} ‖ ${p34b.lights}`);
  check('§9 ★★ ADR §9.35 — THE LIGHTS BESIDE THE CONCEPT (ratified; the mothership\'s 19:51; the designer\'s 19:53 words): on Virgin Land\'s 19:34 Value–Fact the point tab reads `…, made of 18 relatings` and, under it, `beside it, 7 passages decided in the lights: 2 in Meaning\'s, 5 in Action\'s` — the line equal to the sorting\'s own count of passages decided to a word with no direct relating at their pair, by view; relating `the ought is the case as the totality` directly (the researcher\'s falsifier) makes them 19 and 6, that passage COMPOSED',
    /made of 18 relatings$/.test(p34.child) && p34.lights === lineOf(lb34) && J(lb34.slice().sort()) === J([['Action', 5], ['Meaning', 2]]) && /made of 19 relatings$/.test(p34b.child) && p34b.lights === lineOf(lb34b) && lb34b.reduce((s, [, n]) => s + n, 0) === 6 && composedThere,
    { before: [p34.child, p34.lights, lb34], after: [p34b.child, p34b.lights, lb34b], composedThere });
  useGeometryStore.setState({ modesView: null });
}

console.log(`\nDIAGNOSE-THE-CONFIGURATION: ${failures === 0 ? 'ALL PASS — the third is present at an end as a structure, not a set of roles: its relations induced among the roles the person placed, its bonds cut by his denial or dangling by silence, its relations spanning the midpoint as routes, running parallel to the ends\' own and discordant across a refusal; computed, never composed' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

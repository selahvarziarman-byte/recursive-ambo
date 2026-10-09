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
// head counting the bonds beside the forks, the parallels head, both on demand; the box's lines are the eye's) · §0 purity.
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
  check('§8 ★★ THE MODES HEAD COUNTS WHAT ITS LIST LISTS (§6): `through T, from T\'s roles: 33 passages by one role · 134 by T\'s relations` with `show`; no bond and no fork rendered until shown (listed on demand — bonds multiply)', /data-medium-altitude-head="T" data-medium-altitude-forks="33" data-medium-altitude-bonds="134"/.test(html) && /through T, from T's roles: 33 passages by one role · 134 by T's relations/.test(text) && (html.match(/data-medium-bond="/g) || []).length === 0 && (html.match(/data-medium-passage="/g) || []).length === 0, { head: text.match(/through T, from T's roles[^·]*·[^·]*·?/g) });
  check('§8 ★★ THE PARALLELS BY COUNT (R3): `parallels: 23 with F\'s relations · 27 with Φ\'s · show`, none listed until shown', /data-medium-parallels-head="T" data-medium-parallels="23\|27"/.test(html) && /parallels: 23 with F's relations · 27 with Φ's/.test(text) && (html.match(/data-medium-parallel="/g) || []).length === 0, { heads: text.match(/parallels: [^·]*·[^·]*/g) });
  check('§8 F5 under node: no `list=` on any input; the box (and its relations lines) renders only with a light open — none here; U\'s head prints no altitude head (it has not spoken)', !/ list="/.test(html) && !/data-midpoint-panel="light"/.test(html) && !/data-altitude-relations/.test(html) && !/data-medium-altitude-head="U"/.test(html), {});
}

console.log(`\nDIAGNOSE-THE-CONFIGURATION: ${failures === 0 ? 'ALL PASS — the third is present at an end as a structure, not a set of roles: its relations induced among the roles the person placed, its bonds cut by his denial or dangling by silence, its relations spanning the midpoint as routes, running parallel to the ends\' own and discordant across a refusal; computed, never composed' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

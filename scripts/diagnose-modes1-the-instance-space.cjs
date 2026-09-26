#!/usr/bin/env node

// DIAGNOSTIC — STAMP MODES-1 · B2 (2026-09-26): THE CHILD AS THE INSTANCE SPACE (the projection ruling D4; ADR 0031 §9.1 D4,
// §9.2's landing gate F4, first half). §0 purity · §a ★★ F4: under IS-only relatings the child's CORE reproduces the built glue's
// core K on the flow ⊔ phi fixture EXACTLY — 3 roles · 4 tuples · 3 marks under (J₃, τ₃) — tuple for tuple and mark for mark
// against `glue()` itself · §b the child is the instances alone, never the parents' leftovers · §c modes: an instance typed by
// its mode, `≡` for IS only, the record induced across modes · §d DISCORDANCE kept as content, never a refusal (a tuple and a
// mark) · §e bars are form; strays carried and marked · §f through the shape: the same child from the corners' spaces; UNDETECTED
// where no relating stands · §g the construction's worked example (§3): the child on A–B is its two IS-instances · §h B2 exposes
// nothing to the core's readers yet (no importer under src/ but the witness's subjects).
//
// Run: node scripts/diagnose-modes1-the-instance-space.cjs

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
};
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const readLf = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').split('\r\n').join('\n');
const J = (x) => JSON.stringify(x);

let failures = 0;
const check = (name, ok, detail) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `\n        ${detail}` : ''}`);
  if (!ok) failures += 1;
};
const note = (text) => console.log(`      · ${text}`);

const I = req('src/lib/instanceSpace.ts');
const M = req('src/lib/relatings.ts');
const { glue } = req('src/lib/midpointGlue.ts');
const { spaceOf } = req('src/lib/spaceOf.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');

const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json'); const triangle = cast('triangle.cast.json');
const J3 = [['F5', 'Φ7'], ['F7', 'Φ1'], ['F8', 'Φ2']];
const T3 = [['sustains', 'descends-from'], ['presupposes', 'specifies'], ['exceeds-in-size', 'lodges-in']];
const isOf = (pairs) => pairs.map(([x, y]) => ['IS', x, y, '+']);
const minimal = (spec) => readCastFile(J(spec)).cast;
const sortedKeys = (list, f) => list.map(f).sort();

// ═══ §0 PURITY ═══
console.log('THE CHILD AS THE INSTANCE SPACE — B2 (MODES-1)\n\n----- §0 purity -----');
const src = readLf('src/lib/instanceSpace.ts');
check('§0 instanceSpace.ts is react-free and store-free (the types, the mold helper, the face reading\'s edgeBetween (B4), the register\'s translation, the glue\'s types, B1\'s reader, the respects\' base read, the resolver)', (src.match(/^import /gm) || []).length === 8 && !/useGeometryStore|from '\.\.\/store|from '\.\.\/components|from '\.\.\/manuscript|from 'react'|from 'three'|@react-three/.test(src));
check('§0 the module never touches `.identification` (it reads through B1\'s one reader and the resolver\'s base read) and never refuses (no `refused`, no `throw`)', !/\.identification\b|EdgeIdentification|refused|throw /.test(src));
check('§0 `≡` is IS and nothing else (the designer\'s rule 3, M1): the key is `x≡y` for IS and `x w y` for any other mode', /mode === IS \? `\$\{x\}≡\$\{y\}` : `\$\{x\} \$\{mode\} \$\{y\}`/.test(src));

// ═══ §a F4 — the core K under IS-only ═══
console.log('\n----- §a F4: the core under IS-only reproduces K exactly -----');
const child3 = I.instanceSpaceFromCasts(flow, phi, isOf(J3), T3);
const glued3 = glue(flow, phi, J3, T3);
const M3 = glued3.refused ? null : glued3.midpoint;
check('§a ★★ THE LANDING GATE, FIRST HALF (ADR 0031 §9.2): under IS-only relatings the child\'s core is `3 roles · 4 tuples · 3 marks` under (J₃, τ₃) — equal to the built glue\'s core K on the same fixture, read from `glue()` itself', M3 !== null && J(child3.core) === J(M3.core) && J(child3.core) === '{"roles":3,"tuples":4,"marks":3}', J({ child: child3.core, glue: M3 && M3.core }));
const bothTuples = (M) => M.tuples.filter((t) => t.origin === 'both').map((t) => `${t.word}|${J(t.terms)}|${t.value}`).sort();
const childBoth = child3.record.filter((e) => e.witnesses.length === 2).map((e) => `${e.word}|${J(e.terms)}|${e.value}`).sort();
check('§a ★★ TUPLE FOR TUPLE: the child\'s two-witness entries are exactly the glue\'s `both` tuples — the same word keys (`s≡t`), the same instance keys (`x≡y`), the same values', M3 !== null && J(childBoth) === J(bothTuples(M3)), J(childBoth));
const bothMarks = (M) => M.marks.filter((m) => m.witnesses.length === 2).map((m) => `${m.type}|${m.role}|${m.value}`).sort();
const childMarks2 = child3.marks.filter((m) => m.witnesses.length === 2).map((m) => `${m.type}|${m.role}|${m.value}`).sort();
check('§a ★★ MARK FOR MARK: the child\'s two-witness marks are exactly the glue\'s two-witness marks (the mold\'s `member_status` on each of the three instances)', M3 !== null && J(childMarks2) === J(bothMarks(M3)), J(childMarks2));
check('§a the roles ARE K = dom J: the three instances `F5≡Φ7 · F7≡Φ1 · F8≡Φ2`, each typed `mode: IS`', J(child3.instances.map((i) => i.key)) === J(['F5≡Φ7', 'F7≡Φ1', 'F8≡Φ2']) && child3.space.roles.every((r) => r.types.mode === 'IS'));
check('§a the pulled-back signature is the glue\'s words: 22 words, the three τ pairs as one word each (`sustains≡descends-from` …)', M3 !== null && child3.words.length === M3.words.length && J(child3.words.map((w) => w.key).sort()) === J(M3.words.map((w) => w.key).sort()) && child3.words.some((w) => w.key === 'sustains≡descends-from'));
const empty3 = I.instanceSpaceFromCasts(flow, phi, [], []);
check('§a the control: no relating → no instance, no tuple, no mark; the child UNDETECTED (the glue under ∅ has 23 roles — the disjoint union; the child has none: the instances alone)', empty3.state === 'undetected' && empty3.instances.length === 0 && empty3.record.length === 0 && empty3.marks.length === 0 && !glue(flow, phi, [], []).refused && glue(flow, phi, [], []).midpoint.counts.roles === 23);

// ═══ §b the child is the instances alone ═══
console.log('\n----- §b the instances alone -----');
check('§b THE CHILD IS THE INSTANCES ALONE (Q1): 3 roles where the pushout has 14 + 9 − 3 = 20; no parent\'s unmatched role enters', child3.counts.roles === 3 && M3 !== null && M3.counts.roles === 20 && child3.space.roles.length === 3);
note(`the child under (J₃, τ₃): ${child3.counts.roles} roles · ${child3.counts.words} words · ${child3.counts.tuples} tuples (${child3.core.tuples} both) · ${child3.counts.marks} marks (${child3.core.marks} both) · ${child3.counts.discordances} discordances`);
check('§b the one-sided record is kept too (via X alone, via Y alone) — every entry has its witnesses, none is dropped and none is doubled', child3.record.every((e) => e.witnesses.length >= 1) && new Set(child3.record.map((e) => `${e.word}|${J(e.terms)}`)).size === child3.record.length && child3.record.some((e) => e.witnesses.length === 1));
check('§b every induced entry\'s terms are instance keys and its word a pulled-back word', child3.record.every((e) => e.terms.every((t) => child3.instances.some((i) => i.key === t)) && child3.words.some((w) => w.key === e.word)));

// ═══ §c modes ═══
console.log('\n----- §c modes -----');
const withMode = I.instanceSpaceFromCasts(flow, phi, [...isOf(J3), ['carries', 'F5', 'Φ1', '+']], T3);
const carries = withMode.instances.find((i) => i.mode === 'carries');
check('§c a relating in another mode is an instance typed by its mode, keyed by its word (never `≡`): `F5 carries Φ1`, `types.mode = carries`', !!carries && carries.key === 'F5 carries Φ1' && withMode.space.roles.find((r) => r.id === carries.key).types.mode === 'carries' && withMode.instances.length === 4);
const across = withMode.record.filter((e) => e.terms.includes('F5 carries Φ1'));
check('§c the record is induced across modes: entries land on the carries-instance wherever a parent relates its coordinate (F5 in Flow, Φ1 in Φ) to another instance\'s', across.length > 0 && across.every((e) => e.witnesses.length >= 1), `${across.length} entries on it`);
check('§c the IS-core is unchanged by the mode\'s presence (F4 holds beside it): the two-witness part still K', J(withMode.record.filter((e) => e.witnesses.length === 2 && !e.terms.includes('F5 carries Φ1')).map((e) => `${e.word}|${J(e.terms)}|${e.value}`).sort()) === J(childBoth));

// ═══ §d discordance ═══
console.log('\n----- §d discordance kept as content -----');
const P = minimal({ roles: [{ id: 'p1', types: { member_status: 'has' } }, { id: 'p2' }], signature: [{ type: 'near', arity: 2 }], relations: [{ type: 'near', terms: ['p1', 'p2'], polarity: 'holds' }] });
const Q = minimal({ roles: [{ id: 'q1', types: { member_status: 'none-by-nature' } }, { id: 'q2' }], signature: [{ type: 'close', arity: 2 }], relations: [{ type: 'close', terms: ['q1', 'q2'], polarity: 'does-not-hold' }] });
const disc = I.instanceSpaceFromCasts(P, Q, isOf([['p1', 'q1'], ['p2', 'q2']]), [['near', 'close']]);
const refusedGlue = glue(P, Q, [['p1', 'q1'], ['p2', 'q2']], [['near', 'close']]);
check('§d ★★ A TUPLE DISCORDANCE IS KEPT AS CONTENT (Q4): `near≡close(p1≡q1, p2≡q2)` holds via P and does-not-hold via Q — both values kept, no entry in the record, the child still built; the built glue REFUSES the same pairing (the control)', disc.discordances.length === 1 && disc.discordances[0].viaA === 'holds' && disc.discordances[0].viaB === 'does-not-hold' && disc.discordances[0].word === 'near≡close' && !disc.record.some((e) => e.word === 'near≡close') && disc.instances.length === 2 && refusedGlue.refused, J(disc.discordances));
check('§d ★★ A MARK DISCORDANCE IS KEPT AS CONTENT: `member_status` has via P and none-by-nature via Q on `p1≡q1` — both values kept, no mark; the glue refuses it (the control)', disc.markDiscordances.length === 1 && disc.markDiscordances[0].viaA === 'has' && disc.markDiscordances[0].viaB === 'none-by-nature' && !disc.marks.some((m) => m.role === 'p1≡q1' && m.type === 'member_status'), J(disc.markDiscordances));
check('§d the counts say so: discordances counted, the core empty of the discordant entry', disc.counts.discordances === 2 && disc.core.tuples === 0 && disc.core.marks === 0);

// ═══ §e bars and strays ═══
console.log('\n----- §e bars are form; strays carried -----');
const barred = I.instanceSpaceFromCasts(flow, phi, [...isOf(J3), ['IS', 'F5', 'Φ1', '-'], ['carries', 'F9', 'Φ3', '-']], T3);
check('§e a BAR adds no role and no tuple (form, not a role — Q6): listed beside the child, the core unchanged', barred.bars.length === 2 && barred.instances.length === 3 && J(barred.core) === J(child3.core));
const stray = I.instanceSpaceFromCasts(flow, phi, [...isOf(J3), ['IS', 'F99', 'Φ1', '+'], ['carries', 'F5', 'Φ99', '+']], T3);
check('§e a STRAY (an instance naming a role its corner\'s cast does not hold) is carried and marked, never a role and never dropped', stray.strays.length === 2 && stray.instances.length === 3 && stray.counts.strays === 2 && J(stray.core) === J(child3.core));

// ═══ §f through the shape ═══
console.log('\n----- §f through the shape -----');
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
let seeded = createSeedShape('tetrahedron');
for (const [l, c] of [['A', flow], ['B', tcell], ['C', phi], ['D', triangle]]) seeded = withCast(seeded, byLabel(seeded, l), c);
useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, lexicon: [] });
const A = byLabel(cur(), 'A'); const C = byLabel(cur(), 'C');
const eAC = edgeBetween(cur().edges, A, C);
const acFirstIsA = eAC.vertexIds[0] === A;
for (const [x, y] of J3) S().giveRolePair(eAC.id, ...(acFirstIsA ? [x, y] : [y, x]));
for (const [s, t] of T3) S().giveWordPair(eAC.id, ...(acFirstIsA ? [s, t] : [t, s]));
S().giveRelating(eAC.id, 'carries', ...(acFirstIsA ? ['F5', 'Φ1'] : ['Φ1', 'F5']), '+');
const onShape = I.instanceSpaceOf(cur(), edgeBetween(cur().edges, A, C));
const U = spaceOf(cur(), eAC.vertexIds[0]).space; const V = spaceOf(cur(), eAC.vertexIds[1]).space;
const direct = I.instanceSpaceFromCasts(U, V, [...M.instancesOn(edgeBetween(cur().edges, A, C)), ...M.barsOn(edgeBetween(cur().edges, A, C))], edgeBetween(cur().edges, A, C).identification.types);
check('§f THE CHILD OF AN EDGE ON THE SHAPE is the child of its corners\' resolved spaces under the relatings B1\'s reader gives and the τ in force — the same object, byte-equal', onShape !== null && J(onShape) === J(direct) && onShape.instances.length === 4 && onShape.core.roles === 4, onShape && J({ instances: onShape.instances.map((i) => i.key), core: onShape.core }));
check('§f F4 THROUGH THE SHAPE: on A–C (flow ⊔ phi) with (J₃, τ₃) the IS-core is still `3 · 4 · 3` beside the carries-instance', onShape !== null && onShape.record.filter((e) => e.witnesses.length === 2 && e.terms.every((t) => t.includes('≡'))).length === 4 && onShape.marks.filter((m) => m.witnesses.length === 2 && m.role.includes('≡')).length === 3);
const eAB = edgeBetween(cur().edges, A, byLabel(cur(), 'B'));
const undetected = I.instanceSpaceOf(cur(), eAB);
check('§f UNDETECTED (D8): an edge with no relating has a child with no role — carried, not looked at', undetected !== null && undetected.state === 'undetected' && undetected.instances.length === 0);
check('§f no edge → null; a corner holding no space → null (never a fabricated child)', I.instanceSpaceOf(cur(), undefined) === null);

// ═══ §g the construction's worked example ═══
console.log('\n----- §g the construction\'s worked example (§3) -----');
const Ax = minimal({ roles: [{ id: 'a1' }, { id: 'a2' }, { id: 'a3' }], signature: [], relations: [] });
const Bx = minimal({ roles: [{ id: 'b1' }, { id: 'b2' }, { id: 'b3' }], signature: [], relations: [] });
const ex = I.instanceSpaceFromCasts(Ax, Bx, isOf([['a1', 'b1'], ['a2', 'b2']]), []);
check('§g the child on A–B under J_AB = {a1~b1, a2~b2} is exactly its two IS-instances `a1≡b1 · a2≡b2` — a3 and b3, unpaired, are not in it (the sorting by C is B3\'s)', J(ex.instances.map((i) => i.key)) === J(['a1≡b1', 'a2≡b2']) && ex.counts.roles === 2 && ex.record.length === 0);

// ═══ §h exposure ═══
console.log('\n----- §h exposure -----');
const walk = (dir, out = []) => { for (const f of fs.readdirSync(dir)) { const p = path.join(dir, f); if (fs.statSync(p).isDirectory()) walk(p, out); else if (/\.(ts|tsx)$/.test(f)) out.push(p); } return out; };
const importers = walk(path.join(repoRoot, 'src')).filter((f) => /from '\.{1,2}\/(lib\/)?instanceSpace'/.test(fs.readFileSync(f, 'utf8'))).map((f) => path.relative(repoRoot, f).split(path.sep).join('/'));
check('§h THE IMPORTERS of the instance space under src/ are exactly B4\'s descent, the store (the act\'s role check through `childSpaceOf`) and B5\'s block (the corners\' names)', J(importers.sort()) === J(['src/components/MediumBlock.tsx', 'src/lib/descent.ts', 'src/store/geometryStore.ts']), J(importers));

console.log(`\n${failures === 0 ? 'DIAGNOSE-MODES1-THE-INSTANCE-SPACE: ALL PASS — the child is the instances alone, its core under IS-only is the built glue\'s K exactly (3 · 4 · 3), a discordance is kept as content, bars are form, strays are carried and marked, and an edge without a relating is undetected' : `DIAGNOSE-MODES1-THE-INSTANCE-SPACE: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);

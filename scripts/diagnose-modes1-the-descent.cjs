#!/usr/bin/env node

// DIAGNOSTIC — STAMP MODES-1 · B4 (2026-09-26): DESCENT (the projection ruling D10; ADR 0031 §9.1 D10). §0 purity (the module
// writes nothing, glues nothing) · §a ★★ THE CONTROL: an inner edge with only derivable links reads UNDETECTED with its light
// shown — the medial edge AB–AC after one dissection, F7 ↦ r0 on A–B and F7 ↦ Φ1 on A–C: no relating, ONE shared-coordinate
// light `F7≡r0` ~ `Φ1≡F7` through A, and beside it the built resolver's composed class (the before, M1's measurement) · §b the
// opposite midpoint: r0 ↦ Φ1 on B–C adds a light through BC; withdrawn, gone · §c the person's act on the medium is the same act as
// at gen 0: an IS-instance between the child's roles is the pairing, `held` beside the light, OWN; a mode relating is the
// packet's; a parent's leftover (`A:F1`) or a parent's own role (`F7`) is refused — not a role of the child · §d the half-edge
// A–AB is a medium: coordinate lights, a relating held · §e children are casts: `childSpaceOf` reads a born corner's own child,
// recursively at gen 2 · §f the device has no reader · §g the seal — the built resolver reads byte-equal beside a mode relating on
// a medial edge (B4 exposes nothing to it) · §h the store hands the modes layer's reader to the act's check.
//
// Run: node scripts/diagnose-modes1-the-descent.cjs

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

const D = req('src/lib/descent.ts');
const I = req('src/lib/instanceSpace.ts');
const M = req('src/lib/relatings.ts');
const { spaceOf, composedOn, edgeKind } = req('src/lib/spaceOf.ts');
const { edgeBetween } = req('src/lib/faceReading.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { readCastFile } = req('src/lib/castLoader.ts');
const { useGeometryStore } = req('src/store/geometryStore.ts');

const cast = (name) => readCastFile(fs.readFileSync(path.join(repoRoot, 'scripts/fixtures/casts', name), 'utf8')).cast;
const flow = cast('flow.cast.json'); const tcell = cast('t-cell.cast.json'); const phi = cast('phi.cast.json'); const triangle = cast('triangle.cast.json');
const byLabel = (shape, label) => Object.values(shape.vertices).find((v) => v.data.label === label).id;
const labelOf = (shape, id) => shape.vertices[id]?.data.label || id;
const withCast = (shape, id, c) => ({ ...shape, vertices: { ...shape.vertices, [id]: { ...shape.vertices[id], data: { ...shape.vertices[id].data, cast: c } } } });
const S = () => useGeometryStore.getState();
const cur = () => S().shapes[S().currentShapeId];
const seeded4 = () => { let s = createSeedShape('tetrahedron'); for (const [l, c] of [['A', flow], ['B', tcell], ['C', phi], ['D', triangle]]) s = withCast(s, byLabel(s, l), c); return s; };
const reset = (seeded) => useGeometryStore.setState({ shapes: { [seeded.id]: seeded }, shapeOrder: [seeded.id], currentShapeId: seeded.id, edgeTauDrafts: {}, midpointRefusals: {}, midpointRemade: {}, triadRefusals: {}, relatingRefusals: {}, lexicon: [], rules: [], liftSelection: [], selectedCellId: null, selectedVertexId: null, selectedEdgeId: null, selectedFaceId: null });
const E = (shape, X, Y) => edgeBetween(shape.edges, byLabel(shape, X), byLabel(shape, Y));
const give = (X, Y, map) => { const e = E(cur(), X, Y); for (const [x, y] of Object.entries(map)) { if (e.vertexIds[0] === byLabel(cur(), X)) S().giveRolePair(e.id, x, y); else S().giveRolePair(e.id, y, x); } };
const midOf = (shape, u, v) => Object.values(shape.vertices).find((w) => w.createdBy.operation !== 'seed' && w.createdBy.sourceVertexIds.length === 2 && w.createdBy.sourceVertexIds.includes(u) && w.createdBy.sourceVertexIds.includes(v));
const oriented = (e, X, x, y) => (e.vertexIds[0] === X ? [x, y] : [y, x]);
const lightWords = (shape, l) => `${l.kind}:${l.x}~${l.y} through ${labelOf(shape, l.through)}${l.via ? ` via ${l.via}` : ''}${l.held ? ' (held)' : ''}`;

// ═══ §0 PURITY ═══
console.log('DESCENT — B4 (MODES-1)\n\n----- §0 purity -----');
const src = readLf('src/lib/descent.ts');
check('§0 descent.ts is react-free and store-free: the types, the face reading\'s edgeBetween, the instance space, B1\'s reader, the sorting and the resolver\'s edgeKind', (src.match(/^import /gm) || []).length === 6 && !/useGeometryStore|from '\.\.\/store|from '\.\.\/components|from '\.\.\/manuscript|from 'react'|from 'three'|@react-three/.test(src));
check('§0 THE DEVICE HAS NO READER, by construction: the module glues nothing and writes nothing — no glue, no composedOn, no withRelating, no `data:`, no `.identification`', !/\bglue\(|composedOn|withRelating|withoutRelating|data:|\.identification\b|EdgeIdentification/.test(src.replace(/\/\/.*$/gm, '')));

// ═══ §a THE CONTROL ═══
console.log('\n----- §a the control: an inner edge with only derivable links -----');
reset(seeded4());
give('A', 'B', { F7: 'r0' });
give('A', 'C', { F7: 'Φ1' });
S().applyAmboDissectionToCurrent();
const G1 = cur();
const A = byLabel(G1, 'A'); const B = byLabel(G1, 'B'); const C = byLabel(G1, 'C');
const AB = midOf(G1, A, B); const AC = midOf(G1, A, C); const BC = midOf(G1, B, C);
const eABAC = edgeBetween(G1.edges, AB.id, AC.id);
const m0 = D.mediumOf(G1, eABAC, {}, []);
note(`the medial edge ${labelOf(G1, AB.id)}–${labelOf(G1, AC.id)}: kind ${m0.kind} · shared parent ${labelOf(G1, m0.shared)} · lights ${J(m0.lights.map((l) => lightWords(G1, l)))}`);
const abFirst = eABAC.vertexIds[0] === AB.id;
const [kAB, kAC] = ['F7≡r0', 'Φ1≡F7'];
const [lx, ly] = abFirst ? [kAB, kAC] : [kAC, kAB];
note(`the medial edge is stored ${abFirst ? 'AB → AC' : 'AC → AB'}; the light reads x of its first corner`);
check('§a ★★ THE CONTROL (D10): the medial edge AB–AC, with no relating of the person\'s, reads UNDETECTED with its light shown — exactly ONE derivable link, `F7≡r0` ~ `Φ1≡F7` sharing F7 (in the edge\'s own orientation), the passage through A, held by no instance; the sorting has no instance, no path', m0.state === 'UNDETECTED' && m0.kind === 'medial' && m0.shared === A && m0.lights.length === 1 && m0.lights[0].kind === 'shared-coordinate' && m0.lights[0].x === lx && m0.lights[0].y === ly && m0.lights[0].through === A && m0.lights[0].held === false && m0.sorting.instances.length === 0 && m0.child.instances.length === 0, J(m0.lights));
const rAB = spaceOf(G1, AB.id); const rAC = spaceOf(G1, AC.id);
const built = composedOn(G1, rAB, rAC, [AB.id, AC.id], edgeKind(G1, AB.id, AC.id));
check('§a THE BEFORE, beside it (M1\'s measurement): the built resolver COMPOSES the same link into a class — `composedOn(AB, AC)` glues `F7≡r0` with `Φ1≡F7` and every role of A to itself; D10 reads the first as a light and the rest as nothing (a role the child does not hold is not a link)', built.roles.some(([x, y]) => (x === 'F7≡r0' && y === 'Φ1≡F7') || (x === 'Φ1≡F7' && y === 'F7≡r0')) && built.roles.length > 1 && m0.lights.length === 1, J({ builtClasses: built.roles.length, lights: m0.lights.length }));

// ═══ §b the opposite midpoint ═══
console.log('\n----- §b through the opposite midpoint -----');
give('B', 'C', { r0: 'Φ1' });
const m1 = D.mediumOf(cur(), edgeBetween(cur().edges, AB.id, AC.id), {}, []);
const opp = m1.lights.find((l) => l.kind === 'opposite-midpoint');
check('§b r0 ↦ Φ1 given on B–C: a SECOND light on AB–AC — `F7≡r0` ~ `Φ1≡F7` linked through the opposite midpoint BC by its instance (`r0≡Φ1`, read in B–C\'s own orientation); the edge still UNDETECTED', !!opp && opp.x === lx && opp.y === ly && (opp.via === 'r0≡Φ1' || opp.via === 'Φ1≡r0') && opp.through === BC.id && m1.lights.length === 2 && m1.state === 'UNDETECTED', J(m1.lights.map((l) => lightWords(cur(), l))));
const eBC = E(cur(), 'B', 'C');
S().withdrawRolePair(eBC.id, ...oriented(eBC, B, 'r0', 'Φ1'));
const m2 = D.mediumOf(cur(), edgeBetween(cur().edges, AB.id, AC.id), {}, []);
check('§b withdrawn on B–C, the light through BC is gone; the shared-coordinate light stays', m2.lights.length === 1 && m2.lights[0].kind === 'shared-coordinate');

// ═══ §c the person's act on the medium ═══
console.log('\n----- §c the person\'s act on the medium: the same act as at gen 0 -----');
const e3 = edgeBetween(cur().edges, AB.id, AC.id);
const r1 = S().giveRelating(e3.id, 'IS', ...oriented(e3, AB.id, 'F7≡r0', 'Φ1≡F7'), '+');
const m3 = D.mediumOf(cur(), edgeBetween(cur().edges, AB.id, AC.id), {}, []);
check('§c MEASURED, NOT RULED: an IS-relating at the endpoints the built solid COMPOSES is REFUSED by the pairing\'s own act (C-8b — `composed · corner A; not yours to pair or withdraw`), returned by name, nothing written; the light stays unheld and the edge UNDETECTED — D10 says the link is light and the act is the person\'s; which word stands for IS on a medium is the mothership\'s (asked in the report)', r1 !== null && /composed/.test(r1.why) && /not yours to pair/.test(r1.why) && m3.lights[0].held === false && m3.sorting.instances.length === 0 && m3.state === 'UNDETECTED', J({ why: r1 && r1.why, held: m3.lights[0].held, state: m3.state, views: m3.sorting.views.map((v) => [labelOf(cur(), v.view), v.paths.length]) }));
S().withdrawMidpointAttempt(e3.id);
const r2 = S().giveRelating(e3.id, 'carries', ...oriented(e3, AB.id, 'F7≡r0', 'Φ1≡F7'), '+');
check('§c a relating in another mode between the same roles is the packet\'s — beside the instance, a second instance of the child typed `carries`', r2 === null && M.relatingsHeld(edgeBetween(cur().edges, AB.id, AC.id)).length === 1 && D.mediumOf(cur(), edgeBetween(cur().edges, AB.id, AC.id), {}, []).child.instances.some((i) => i.mode === 'carries'));
const bad1 = S().giveRelating(e3.id, 'carries', ...oriented(e3, AB.id, 'A:F1', 'Φ1≡F7'), '+');
const bad2 = S().giveRelating(e3.id, 'carries', ...oriented(e3, AB.id, 'F7', 'Φ1≡F7'), '+');
check('§c REFUSED, the pick named: a parent\'s leftover (`A:F1`, the built pushout\'s role) and a parent\'s own role (`F7`) are not roles of the child AB — the modes layer\'s reader knows the instances alone', bad1 !== null && /is not a role of AB/.test(bad1.why) && bad2 !== null && /is not a role of AB/.test(bad2.why), J([bad1 && bad1.why, bad2 && bad2.why]));
S().withdrawRelatingAttempt(e3.id);
S().withdrawRelating(e3.id, 'carries', ...oriented(e3, AB.id, 'F7≡r0', 'Φ1≡F7'));
check('§c withdrawn, the medium reads as in §a again', J(D.mediumOf(cur(), edgeBetween(cur().edges, AB.id, AC.id), {}, []).lights) === J(m0.lights) && D.mediumOf(cur(), edgeBetween(cur().edges, AB.id, AC.id), {}, []).state === 'UNDETECTED');

// ═══ §d the half-edge ═══
console.log('\n----- §d the half-edge A–AB is a medium -----');
const eAAB = edgeBetween(cur().edges, A, AB.id);
const h0 = D.mediumOf(cur(), eAAB, {}, []);
check('§d the corner edge A–AB: kind corner, the parent A shared; its derivable link is the coordinate map — `F7` ~ `F7≡r0` through A — a light, the edge UNDETECTED', !!h0 && h0.kind === 'corner' && h0.shared === A && h0.lights.length === 1 && h0.lights[0].kind === 'coordinate' && ((h0.lights[0].x === 'F7' && h0.lights[0].y === 'F7≡r0') || (h0.lights[0].x === 'F7≡r0' && h0.lights[0].y === 'F7')) && h0.state === 'UNDETECTED', h0 && J(h0.lights.map((l) => lightWords(cur(), l))));
const r4 = S().giveRelating(eAAB.id, 'carries', ...oriented(eAAB, A, 'F7', 'F7≡r0'), '+');
const h1 = D.mediumOf(cur(), edgeBetween(cur().edges, A, AB.id), {}, []);
check('§d a relating on the half-edge, between A\'s role and AB\'s instance, is an instance of that medium (its child has one role typed `carries`)', r4 === null && h1.child.instances.length === 1 && h1.child.instances[0].mode === 'carries', J(h1.child.instances));
S().withdrawRelating(eAAB.id, 'carries', ...oriented(eAAB, A, 'F7', 'F7≡r0'));

// ═══ §e children are casts ═══
console.log('\n----- §e children are casts, at every generation -----');
const cAB = I.childSpaceOf(cur(), AB.id);
check('§e `childSpaceOf(AB)` is AB\'s CHILD — one role `F7≡r0` typed IS, where the built resolver\'s space at AB has 14 + 10 − 1 = 23 roles (the pushout)', !!cAB && J(cAB.roles.map((r) => r.id)) === J(['F7≡r0']) && cAB.roles[0].types.mode === 'IS' && rAB.space.roles.length === 23, J({ child: cAB && cAB.roles.map((r) => r.id), built: rAB.space.roles.length }));
S().giveRelating(e3.id, 'carries', ...oriented(e3, AB.id, 'F7≡r0', 'Φ1≡F7'), '+');
S().selectCell(cur().cells.find((c) => c.kind === 'core').id);
S().applyAmboDissectionToCurrent();
const G2 = cur();
const ABAC = midOf(G2, AB.id, AC.id);
const cABAC = I.childSpaceOf(G2, ABAC.id);
check('§e at gen 2 the midpoint ABAC\'s child is the instance space of AB–AC: the one relating the person gave there, `F7≡r0 carries Φ1≡F7` (or the reverse, in the edge\'s orientation), typed carries — read recursively through AB\'s and AC\'s children, which are themselves instance spaces', !!ABAC && !!cABAC && cABAC.roles.length === 1 && cABAC.roles[0].types.mode === 'carries' && /≡.* carries .*≡/.test(cABAC.roles[0].id), J({ ABAC: ABAC && labelOf(G2, ABAC.id), child: cABAC && cABAC.roles.map((r) => r.id) }));
const cNone = I.childSpaceOf(G2, midOf(G2, AB.id, BC.id) ? midOf(G2, AB.id, BC.id).id : ABAC.id);
check('§e a midpoint whose parents\' edge holds no relating has an EMPTY child (no role), never the parents\' leftovers', !!cNone && (cNone.roles.length === 0 || cNone === cABAC));

// ═══ §f the device has no reader ═══
console.log('\n----- §f side by side -----');
check('§f `mediumOf` lays the child, the sorting and the lights SIDE BY SIDE — three fields, none derived from another (the lights are computed from the parents\' children, never from the sorting; the sorting never from the lights)', /child,\n\s*sorting,\n\s*lights,/.test(src) && !/sorting\.(own|centroid|views)/.test(src.slice(src.indexOf('export function derivedLightsOf'), src.indexOf('export function mediumOf'))));

// ═══ §g the seal ═══
console.log('\n----- §g the seal: the built resolver reads beside B4 unchanged -----');
reset(seeded4());
give('A', 'B', { F7: 'r0' }); give('A', 'C', { F7: 'Φ1' });
S().applyAmboDissectionToCurrent();
const H = cur(); const hAB = midOf(H, byLabel(H, 'A'), byLabel(H, 'B')); const hAC = midOf(H, byLabel(H, 'A'), byLabel(H, 'C'));
const readBuilt = (shape) => { const r = spaceOf(shape, hAB.id); const q = spaceOf(shape, hAC.id); return J({ ab: r.space, ac: q.space, feet: r.feet.map((f) => [f.corner, [...f.map]]) }); };
const before = readBuilt(H);
const eH = edgeBetween(H.edges, hAB.id, hAC.id);
S().giveRelating(eH.id, 'carries', ...oriented(eH, hAB.id, 'F7≡r0', 'Φ1≡F7'), '+');
check('§g ★★ B4 EXPOSES NOTHING TO THE BUILT RESOLVER: with a mode relating on the medial edge AB–AC, the spaces at AB and AC and their feet read BYTE-EQUAL to before (the identity regime stands as built until B5 and B6)', readBuilt(cur()) === before);

// ═══ §h the store hands the modes layer's reader ═══
console.log('\n----- §h the act\'s check -----');
const storeSrc = readLf('src/store/geometryStore.ts');
check('§h giveRelating checks the picks against `childSpaceOf` (a seed\'s cast; a born corner\'s own child), handed to relatingOf', /relatingOf\(shape, edgeId, w, x, y, sign, \{ tauDrafts: state\.edgeTauDrafts \}, \(s, c, o\) => childSpaceOf\(s, c, o\)\)/.test(storeSrc));
const relSrc = readLf('src/lib/relatings.ts');
check('§h relatingOf takes the role source as a parameter (the resolver\'s space by default) — three imports still', /roleSource: RoleSource = resolverRoles/.test(relSrc) && (relSrc.match(/^import /gm) || []).length === 3);

console.log(`\n${failures === 0 ? 'DIAGNOSE-MODES1-THE-DESCENT: ALL PASS — children are casts at every generation, every new edge is a medium taking the person\'s act, the derivable links are lights never relatings, an inner edge with only derivable links reads undetected with its light shown, and the device has no reader' : `DIAGNOSE-MODES1-THE-DESCENT: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);

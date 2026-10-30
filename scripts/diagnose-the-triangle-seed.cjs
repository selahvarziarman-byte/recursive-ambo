#!/usr/bin/env node
// THE TRIANGLE SEED — T1 (ADR 0031 §9.77 THE TRIANGLE SEED, RATIFIED claims §553; the mothership's 2026-10-30 08:53 STAMP TRIANGLE-SEED,
// claims §555; Arman's Δ255 ✔ VERBATIM "Sanction both, build all three (Recommended)"): the seed, its cut and the record's census; ONE
// EDGE, ONE CHILD (the one-midpoint cure, ruled for the solid too); the lights; the carry across the cut; the saved records.
//
// THE ACCEPTANCE AS SEALED AND AMENDED (the mothership's 08:53): generation 1 6 · 9 · 4 with the parent apart, Euler 1 · generation 2 by
// the core alone the RECORD's 9 · 18 · 7 with the parents apart (a kept residue face holds its medial edge whole beside the core's halves,
// C-7e) · all four generation-1 faces with one midpoint per shared edge 15 · 30 · 16 with the parents apart, Euler 1 (without the cure
// the vertices read 18 — measured at 3b96c3a on the solid: three doubled midpoints after a residue cut beside the core) · on the solid a
// generation-1 residue cut after the core: each shared edge holds ONE midpoint · one light per seed edge from its opposite corner; two at
// a medial midpoint of the triangle (the third child and the parent by D28); three on the solid, the control.
//
// THE RECORD'S CENSUS: `shape.faces` holds every cell's faces (a dissected cell's copies as parent-cell-faces beside its children's), and
// `shape.edges` every pair any face walks — a kept face's whole edge beside the halves a cut wrote. "With the parents apart" drops the
// parent-cell-faces and counts what the other faces hold (vertices, pairs, faces); the record's own line (`solidCountsWords`) counts the
// record. A count the record cannot reach is a measurement, not a failure (the mothership's 08:53, line 3).

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  }).outputText;
  module._compile(output, filename);
};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const { createSeedShape, seedRegistry } = req('src/data/seeds.ts');
const { applyAmboDissection, canApplyAmboDissection } = req('src/lib/ambo.ts');
const { getCellTopologySignature, readinessWords } = req('src/lib/topologySignature.ts');
const { altitudesAt } = req('src/lib/altitude.ts');
const { facesThrough } = req('src/lib/respects.ts');
const { withRelating, relating, relatingsHeld } = req('src/lib/relatings.ts');
const { midpointLetters } = req('src/lib/christening.ts');
const { solidCountsWords } = req('src/components/copyWords.ts');
const { deriveEdges } = req('src/lib/shape.ts');
const { canonicalEdgeKey } = req('src/lib/ids.ts');
const { amboDissectionOperation } = req('src/operations/amboDissectionOperation.ts');

let failures = 0;
const J = (v) => JSON.stringify(v);
const check = (title, ok, detail) => { console.log(`${ok ? 'PASS' : 'FAIL'} - ${title}${ok ? '' : ` :: ${detail}`}`); if (!ok) failures += 1; };
const note = (s) => console.log(`note - ${s}`);

const label = (sh, id) => sh.vertices[id]?.data.label ?? id;
const V = (sh) => Object.keys(sh.vertices).length;
const record = (sh) => ({ V: V(sh), E: sh.edges.length, F: sh.faces.length, cells: sh.cells.length });
/** the record with the parents apart: the faces that are not parent-cell-faces, the pairs they walk, the vertices they hold */
const apart = (sh) => {
  const faces = sh.faces.filter((f) => f.role !== 'parent-cell-face');
  const vs = new Set(faces.flatMap((f) => f.vertexIds));
  const E = deriveEdges(faces, sh.id).length;
  return { V: vs.size, E, F: faces.length, chi: vs.size - E + faces.length };
};
const edgeOf = (sh, a, b) => sh.edges.find((e) => canonicalEdgeKey(...e.vertexIds) === canonicalEdgeKey(a, b));
const apexes = (sh, e) => altitudesAt(sh, e).map((x) => label(sh, x.apex)).sort();
const doubled = (sh) => { const by = new Map(); for (const v of Object.values(sh.vertices)) { const k = v.position.map((x) => x.toFixed(6)).join(','); by.set(k, [...(by.get(k) ?? []), v.id]); } return [...by.values()].filter((ids) => ids.length > 1); };
const midpoints = (sh) => Object.values(sh.vertices).filter((v) => v.createdBy.operation === 'ambo-dissection');
const lastGen = (sh) => sh.generations[sh.generations.length - 1];
const cellOfFace = (sh, f) => sh.cells.find((c) => c.id === f.sourceCellId);
/** the distinct parents of the cells whose faces hold a vertex — a shared child reads in both cells' children */
const parentsHolding = (sh, vid) => new Set(sh.faces.filter((f) => f.vertexIds.includes(vid)).map((f) => cellOfFace(sh, f)?.parentCellId ?? null).filter(Boolean));

// ─── §1 THE SEED ───
console.log('§1 THE SEED — one face of the tetrahedron, taken alone');
const seed = createSeedShape('triangle');
const [A, B, C] = seed.cells[0].vertexIds;
check('§1 the registry holds `triangle` (label Triangle), and createSeedShape builds it: 3 vertices · 3 edges · 1 face · 1 cell of kind `seed`, topology `triangle`',
  seedRegistry.triangle && seedRegistry.triangle.label === 'Triangle' && J(record(seed)) === J({ V: 3, E: 3, F: 1, cells: 1 }) && seed.cells[0].kind === 'seed' && seed.cells[0].topology === 'triangle' && seed.faces[0].role === 'seed-face',
  J({ record: record(seed), cell: seed.cells[0].kind, topology: seed.cells[0].topology }));
check("§1 the solid's foot line reads the record: `generation 0 · 1 cell (1 seed) · 1 face · 3 vertices`",
  solidCountsWords(seed) === 'generation 0 · 1 cell (1 seed) · 1 face · 3 vertices', solidCountsWords(seed));
const pos = seed.cells[0].vertexIds.map((id) => seed.vertices[id].position);
const d = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
const sides = [d(pos[0], pos[1]), d(pos[1], pos[2]), d(pos[2], pos[0])];
const cam = [3.2, 2.4, 3.8];
const sub = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
const cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
const nrm = cross(sub(pos[1], pos[0]), sub(pos[2], pos[0]));
const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
const fromNormal = (Math.acos(Math.abs(dot(cam, nrm)) / (Math.hypot(...cam) * Math.hypot(...nrm))) * 180) / Math.PI;
check("§1 the seed is REGULAR (three equal sides, the tetrahedron's) and lies in the plane x + y + z = −1, which the default camera [3.2, 2.4, 3.8] sees nearly face-on (under 15° from its normal; the face ABC of the seed tetrahedron would lie 72° from it)",
  sides.every((s) => Math.abs(s - sides[0]) < 1e-9) && pos.every((p) => Math.abs(p[0] + p[1] + p[2] + 1) < 1e-9) && fromNormal < 15,
  J({ sides, sums: pos.map((p) => p[0] + p[1] + p[2]), fromNormal: fromNormal.toFixed(1) }));
const sig0 = getCellTopologySignature(seed, seed.cells[0]);
check("§1 the readiness reads a 2-cell: `ready` (status `enabled`, no problem; at 3b96c3a it read `blocked: the shape is malformed · vertex rings incomplete`), and the preview says what Ambo would make — 3 midpoints, 3 residue cells (`degree 2, a corner triangle`), 1 core face (1 from the face, 0 from corners), `core: triangle`",
  sig0.readinessStatus === 'enabled' && readinessWords(sig0.readinessStatus) === 'ready' && sig0.readinessProblems.length === 0 && sig0.preview && sig0.preview.midpointVertexCount === 3 && sig0.preview.residueCellCount === 3 && sig0.preview.totalCoreFaceCount === 1 && sig0.preview.coreSourceVertexFaceCount === 0 && J(sig0.preview.residueTypes) === J(['degree 2, a corner triangle']) && sig0.preview.coreClassification === 'core: triangle',
  J({ status: sig0.readinessStatus, problems: sig0.readinessProblems, preview: sig0.preview }));
check("§1 the dissection takes the seed (`canApplyAmboDissection` true), and the operation registry names the three targets `triangle` (seed, core, residue)",
  canApplyAmboDissection(seed) === true && ['seed', 'core', 'residue'].every((k) => amboDissectionOperation.supportedTargets.some((t) => t.cellKind === k && t.topology === 'triangle')),
  J({ canApply: canApplyAmboDissection(seed), targets: amboDissectionOperation.supportedTargets.filter((t) => t.topology === 'triangle') }));
for (const e of seed.edges) {
  const ap = apexes(seed, e);
  const third = seed.cells[0].vertexIds.filter((v) => !e.vertexIds.includes(v)).map((v) => label(seed, v));
  check(`§1 the seed edge ${e.vertexIds.map((v) => label(seed, v)).join('–')} reads ONE light, its opposite corner ${third[0]} (altitudesAt; facesThrough 1)`,
    J(ap) === J(third) && facesThrough(seed, e).length === 1, J({ apexes: ap, faces: facesThrough(seed, e).length }));
}

// ─── §2 THE CUT — generation 1 ───
console.log("§2 THE CUT — generation 1: the record's census, the parent apart, the children, the lights, the carry");
// the carry's seed: a relating and an identification given on the seed edge A–B before the cut (C-7e · B1 — copied onto the same pair)
const seedAB = edgeOf(seed, A, B);
const given = relating('is drawn on', 'promise', 'purpose', '+');
const seedR = { ...seed, edges: seed.edges.map((e) => (e.id === seedAB.id ? { ...withRelating(e, given), identification: { roles: [['promise', 'purpose']], types: [] } } : e)) };
const g1 = applyAmboDissection(seedR);
check('§2 the record after the cut: 6 vertices · 12 edges · 5 faces · 5 cells (1 parent, 1 core, 3 residues) — the parent-cell-face keeps the seed face whole (its three whole edges beside the six halves and the three medial edges)',
  J(record(g1)) === J({ V: 6, E: 12, F: 5, cells: 5 }) && g1.cells.filter((c) => c.kind === 'parent').length === 1 && g1.cells.filter((c) => c.kind === 'core').length === 1 && g1.cells.filter((c) => c.kind === 'residue').length === 3 && g1.faces.filter((f) => f.role === 'parent-cell-face').length === 1,
  J({ record: record(g1), kinds: g1.cells.map((c) => c.kind) }));
check("§2 the solid's foot line: `generation 1 · 5 cells (1 parent, 1 core, 3 residues) · 5 faces · 6 vertices`",
  solidCountsWords(g1) === 'generation 1 · 5 cells (1 parent, 1 core, 3 residues) · 5 faces · 6 vertices', solidCountsWords(g1));
check('§2 THE ACCEPTANCE, generation 1 — with the parent apart: 6 · 9 · 4, Euler 1', J(apart(g1)) === J({ V: 6, E: 9, F: 4, chi: 1 }), J(apart(g1)));
check("§2 every generated cell is a `triangle` of ONE face (the core the medial triangle, each residue its corner triangle), and the parent cell keeps `triangle`",
  g1.cells.filter((c) => c.kind !== 'parent').every((c) => c.topology === 'triangle' && c.faceIds.length === 1 && c.vertexIds.length === 3) && g1.cells.find((c) => c.kind === 'parent').topology === 'triangle',
  J(g1.cells.map((c) => [c.kind, c.topology, c.faceIds.length, c.vertexIds.length])));
const core1 = g1.cells.find((c) => c.kind === 'core');
const coreFace = g1.faces.find((f) => f.id === core1.faceIds[0]);
const seedFace = seed.faces[0];
const mids = midpoints(g1);
check("§2 the three children are the edges' midpoints, each christened by its corners' letters (`midpointLetters`: AB · AC · BC), minted by THIS cut (the generation's createdVertexIds = 3)",
  mids.length === 3 && mids.every((m) => m.data.label === midpointLetters(label(g1, m.createdBy.sourceVertexIds[0]), label(g1, m.createdBy.sourceVertexIds[1]))) && lastGen(g1).createdVertexIds.length === 3 && J(mids.map((m) => m.data.label).sort()) === J(['AB', 'AC', 'BC']),
  J({ labels: mids.map((m) => m.data.label), created: lastGen(g1).createdVertexIds.length }));
const midOf = (sh, a, b) => midpoints(sh).find((m) => canonicalEdgeKey(...m.createdBy.sourceVertexIds) === canonicalEdgeKey(a, b));
const expectedMedial = seedFace.vertexIds.map((v, i) => midOf(g1, v, seedFace.vertexIds[(i + 1) % 3]).id);
check("§2 the core's medial face runs the midpoints in the seed face's own order (coherently wound with it), and each residue's corner triangle reads [m_previous, corner, m_next] in that winding",
  J(coreFace.vertexIds) === J(expectedMedial) && g1.cells.filter((c) => c.kind === 'residue').every((c) => { const f = g1.faces.find((x) => x.id === c.faceIds[0]); const k = seedFace.vertexIds.indexOf(c.preservedVertexId); const prev = seedFace.vertexIds[(k + 2) % 3]; const next = seedFace.vertexIds[(k + 1) % 3]; return J(f.vertexIds) === J([midOf(g1, c.preservedVertexId, prev).id, c.preservedVertexId, midOf(g1, c.preservedVertexId, next).id]) && f.sourceFaceId === seedFace.id; }),
  J({ core: coreFace.vertexIds.map((v) => label(g1, v)), expected: expectedMedial.map((v) => label(g1, v)) }));
// the lights at generation 1
for (const [a, b] of [[A, B], [B, C], [C, A]]) {
  const e = edgeOf(g1, a, b); const third = label(g1, seed.cells[0].vertexIds.find((v) => v !== a && v !== b));
  check(`§2 the seed edge ${label(g1, a)}–${label(g1, b)} (whole, held by the parent-cell-face) still reads ONE light, ${third}`, e && J(apexes(g1, e)) === J([third]), J({ edge: Boolean(e), apexes: e ? apexes(g1, e) : null }));
}
for (const [a, b] of [[A, B], [B, C], [C, A]]) {
  const m1 = midOf(g1, a, b); const corner = [A, B, C].find((v) => v !== a && v !== b);
  for (const other of [a, b]) {
    const m2 = midOf(g1, other, corner); const e = edgeOf(g1, m1.id, m2.id);
    const thirdChild = mids.find((m) => m.id !== m1.id && m.id !== m2.id);
    check(`§2 the medial edge ${m1.data.label}–${m2.data.label} reads TWO lights: the third child ${thirdChild.data.label} (the core's face) and the parent corner ${label(g1, other)} (the residue's corner triangle) — D28`,
      e && J(apexes(g1, e)) === J([thirdChild.data.label, label(g1, other)].sort()), J({ apexes: e ? apexes(g1, e) : null }));
  }
}
const half = edgeOf(g1, A, midOf(g1, A, B).id);
check('§2 an outer half-edge (A–AB) reads ONE light, the residue\'s other midpoint (AC)', half && J(apexes(g1, half)) === J(['AC']), J({ apexes: half ? apexes(g1, half) : null }));
// the carry across the cut (C-7e · B1)
const g1AB = edgeOf(g1, A, B);
const held = relatingsHeld(g1AB);
check('§2 THE CARRY (C-7e · B1): the relating given on the seed edge A–B rides onto the same pair after the cut, and so does the identification — copied, never re-derived; the halves and the medial edges carry none',
  held.length === 1 && held[0][0] === 'is drawn on' && new Set([held[0][1], held[0][2]]).size === 2 && g1AB.identification && g1AB.identification.roles.length === 1 && g1.edges.filter((e) => e.id !== g1AB.id).every((e) => relatingsHeld(e).length === 0 && !e.identification),
  J({ held, identification: g1AB.identification }));

// ─── §3 GENERATION 2 BY THE CORE ALONE ───
console.log('§3 GENERATION 2 BY THE CORE ALONE — the record\'s 9 · 18 · 7 with the parents apart');
check('§3 the core (a `triangle` of one face) takes the dissection', canApplyAmboDissection(g1, core1.id) === true, J(getCellTopologySignature(g1, core1)));
const g2 = applyAmboDissection(g1, core1.id);
check("§3 the record: 9 vertices · 21 edges · 9 faces (two parent-cell-faces: the seed's and the core's) · 9 cells; three children minted (the medial edges' midpoints), none reused (the pairs are new)",
  J(record(g2)) === J({ V: 9, E: 21, F: 9, cells: 9 }) && lastGen(g2).createdVertexIds.length === 3 && doubled(g2).length === 0, J({ record: record(g2), created: lastGen(g2).createdVertexIds.length, doubled: doubled(g2).length }));
check("§3 THE ACCEPTANCE, generation 2 by the core alone — the RECORD's count with the parents apart: 9 · 18 · 7 (each kept residue face holds its medial edge whole beside the halves the core's children wrote; 9 · 15 · 7 stays arithmetic in the ledger)",
  J(apart(g2)) === J({ V: 9, E: 18, F: 7, chi: -2 }), J(apart(g2)));
const mAB = midOf(g1, A, B); const mBC = midOf(g1, B, C); const mCA = midOf(g1, C, A);
const medialAB_BC = edgeOf(g2, mAB.id, mBC.id);
check("§3 a medial midpoint's edge (AB–BC) reads TWO lights at generation 2 — the third child AC (the core's kept face) and the parent corner B (the residue's) — by D28; the solid's medial edge reads three (the control, measured at 3b96c3a)",
  medialAB_BC && J(apexes(g2, medialAB_BC)) === J(['AC', 'B']), J({ apexes: medialAB_BC ? apexes(g2, medialAB_BC) : null }));

// ─── §4 ALL FOUR FACES, ONE MIDPOINT PER SHARED EDGE ───
console.log('§4 ALL FOUR GENERATION-1 FACES — one midpoint per shared edge: 15 · 30 · 16 with the parents apart');
let g3 = g2; const mintedPerResidue = [];
for (const r of g1.cells.filter((c) => c.kind === 'residue')) {
  const live = g3.cells.find((c) => c.id === r.id);
  if (!canApplyAmboDissection(g3, live.id)) { check(`§4 the residue at ${label(g3, r.preservedVertexId)} takes the dissection`, false, J(getCellTopologySignature(g3, live).readinessProblems)); continue; }
  g3 = applyAmboDissection(g3, live.id);
  mintedPerResidue.push(lastGen(g3).createdVertexIds.length);
}
check("§4 each residue's cut mints TWO children (its outer half-edges') and REUSES the one the core's cut made on their shared medial edge — 15 vertices, no two at one position (without the cure 18: three doubled, the falsifier)",
  J(mintedPerResidue) === J([2, 2, 2]) && V(g3) === 15 && doubled(g3).length === 0, J({ minted: mintedPerResidue, V: V(g3), doubled: doubled(g3) }));
check('§4 THE ACCEPTANCE, all four faces with the parents apart: 15 · 30 · 16, Euler 1 (every generation-1 edge now split by both its faces, so no whole edge survives beside its halves); the record itself holds the five parent-cell-faces beside them',
  J(apart(g3)) === J({ V: 15, E: 30, F: 16, chi: 1 }) && g3.faces.filter((f) => f.role === 'parent-cell-face').length === 5 && record(g3).F === 21,
  J({ apart: apart(g3), record: record(g3) }));
const shared = midpoints(g3).filter((m) => midpoints(g1).some((x) => x.id === m.createdBy.sourceVertexIds[0]) && midpoints(g1).some((x) => x.id === m.createdBy.sourceVertexIds[1]));
check("§4 a shared child reads every face through its edge IN BOTH CELLS' children (the mothership's first condition): each of the three medial midpoints is held by faces of two different parents (the core's cut and the residue's)",
  shared.length === 3 && shared.every((m) => parentsHolding(g3, m.id).size === 2), J(shared.map((m) => [m.data.label, parentsHolding(g3, m.id).size])));

// ─── §5 THE SOLID TAKES THE CURE ───
console.log('§5 THE SOLID TAKES THE CURE — one edge, one child (D4), whichever cell is cut first');
const t0 = createSeedShape('tetrahedron');
const t1 = applyAmboDissection(t0);
check('§5 a first cut is unchanged by the cure: the tetrahedron\'s generation 1 reads 10 · 30 · 28, six children minted; a seed edge reads two lights and a medial edge three (the control for the triangle\'s one and two)',
  J(record(t1)) === J({ V: 10, E: 30, F: 28, cells: 6 }) && lastGen(t1).createdVertexIds.length === 6 && altitudesAt(t0, t0.edges[0]).length === 2 && altitudesAt(t1, t1.edges.find((e) => e.vertexIds.every((v) => v.startsWith('vertex:mid:')))).length === 3,
  J({ record: record(t1), created: lastGen(t1).createdVertexIds.length }));
const tcore = t1.cells.find((c) => c.kind === 'core');
const t2 = applyAmboDissection(t1, tcore.id);
const tres = t2.cells.find((c) => c.kind === 'residue' && c.generationDepth === 1);
const t3 = applyAmboDissection(t2, tres.id);
check("§5 the core cut again (12 children, 22 vertices), then a generation-1 residue beside it: the residue's cut mints THREE (its corner's edges) and reuses the three its base shares with the core's face — 25 vertices, none doubled (28 and three doubled at 3b96c3a, measured)",
  V(t2) === 22 && lastGen(t2).createdVertexIds.length === 12 && lastGen(t3).createdVertexIds.length === 3 && V(t3) === 25 && doubled(t3).length === 0,
  J({ V2: V(t2), created2: lastGen(t2).createdVertexIds.length, created3: lastGen(t3).createdVertexIds.length, V3: V(t3), doubled: doubled(t3) }));
const tshared = midpoints(t3).filter((m) => m.createdBy.sourceVertexIds.every((v) => v.startsWith('vertex:mid:')) && parentsHolding(t3, m.id).size >= 2);
check("§5 each of the solid's three shared children is held by faces of both parents' children (the core's and the residue's)", tshared.length >= 3, J(tshared.map((m) => [m.data.label, parentsHolding(t3, m.id).size])));

// ─── §6 THE SAVED RECORDS ───
console.log("§6 THE SAVED RECORDS — Virgin Land's exports in scripts/fixtures: every record was cut once per cell (no two midpoints at one position), so the cure moves nothing saved");
const fixDir = path.join(repoRoot, 'scripts', 'fixtures', 'altitude');
const files = fs.readdirSync(fixDir).filter((f) => f.endsWith('.workspace.json'));
const perFile = files.map((f) => {
  const ws = JSON.parse(fs.readFileSync(path.join(fixDir, f), 'utf8'));
  const shapes = Object.values(ws.shapes || {});
  return { file: f.slice(0, 48), shapes: shapes.length, cuts: shapes.reduce((n, sh) => n + (sh.cells || []).filter((c) => c.kind === 'parent').length, 0), doubled: shapes.reduce((n, sh) => n + doubled(sh).length, 0) };
});
check(`§6 ${files.length} saved workspaces (the fixtures are Virgin Land's exports and the coder's Property export): no shape holds two midpoints at one position`, files.length >= 10 && perFile.every((r) => r.doubled === 0), J(perFile));
note(`the saved records: ${perFile.map((r) => `${r.file} · ${r.shapes} shapes · ${r.cuts} cuts`).join(' | ')}`);

// ─── §7 BY CONSTRUCTION ───
console.log('§7 BY CONSTRUCTION — the source holds the rule where the act is made');
const ambo = fs.readFileSync(path.join(repoRoot, 'src/lib/ambo.ts'), 'utf8');
const topo = fs.readFileSync(path.join(repoRoot, 'src/lib/topologySignature.ts'), 'utf8');
check('§7 ambo.ts: the midpoint loop asks `midpointAlreadyMade(parent, a, b)` before minting; `isTwoCell` guards the vertex figures and the residue faces; the polygon builder and the open ring stand',
  /const made = midpointAlreadyMade\(parent, a, b\);/.test(ambo) && /\(isTwoCell\(topology\) \? \[\] : topology\.vertexIds\)\.map/.test(ambo) && /if \(isTwoCell\(topology\)\) \{\s*\/\/ THE TRIANGLE SEED: a 2-cell's residue is the CORNER TRIANGLE/.test(ambo) && /function buildPolygonSourceTopology\(/.test(ambo) && /const createdVertexIds = minted;/.test(ambo),
  'see the source');
check('§7 topologySignature.ts: a cell of one face is read as a 2-cell (`twoCell`), its corners of degree 2; `triangle` is an enabled topology', /const twoCell = faces\.length === 1/.test(topo) && /'triangle', \/\/ THE TRIANGLE SEED/.test(topo), 'see the source');

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-TRIANGLE-SEED: ALL PASS — the seed, its cut (6 · 9 · 4 with the parent apart), the record\'s 9 · 18 · 7 by the core alone, 15 · 30 · 16 by all four faces with one midpoint per shared edge, the lights (one · two · the solid\'s three), the carry, the solid\'s cure, the saved records' : `DIAGNOSE-THE-TRIANGLE-SEED: ${failures} FAIL`}`);
process.exit(failures === 0 ? 0 : 1);

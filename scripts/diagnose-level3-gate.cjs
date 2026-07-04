#!/usr/bin/env node

// DIAGNOSTIC — level-3 Build 1: the 3-cell identification op + the S² soundness gate.
//
// THE SEAL (§2 of the mandate, researcher-corrected PINCH-B):
//   ① 3-torus — committed cube + glueFaces{(x0,x1),(y0,y1),(z0,z1)} translation/
//     preserving → V=1 E=3 F=3 C=1, χ=0; S²-gate PASS (every edge-link
//     'interior'; the single vertex-link CONNECTED with χ=2 — the octahedron).
//     Orientability at PATTERN level (all modes preserving); measured w₁/b₁ are
//     Build-2 tower territory (the committed 2-complex certifier is out of
//     domain on a 3-complex — noted, not faked).
//   ② PINCH-A — two cubes sharing exactly ONE edge, no face glued → the shared
//     edge-link is two disjoint arcs: decomposeLink valence 'junction'
//     (pinch=true, strata 2) ≠ 'interior' ⇒ FAIL(a). Concrete counts pinned
//     below (the config-dependent seal).
//   ③ PINCH-B — two cubes sharing exactly ONE vertex → the shared vertex-link
//     is TWO DISJOINT DISKS: components=2, χ(link)=2 (corrected seal — NOT 4)
//     ⇒ FAIL(b2)-by-CONNECTIVITY.
//   ④ (deferred) the connected-non-sphere χ branch — not in the re-issue; the
//     b2-χ clause is exercised only via the pinch fixtures' raw boundary disks.
//   ⑤ level-2 byte-unchanged (suite-level; diff-verified in the report).
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        esModuleInterop: true,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
      fileName: filename,
    }).outputText,
    filename,
  );
};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { createSeedShape } = req('src/data/seeds.ts');
const {
  readSeedCell,
  glueFaces,
  flipGlueFaces,
  joinSeedsAtVertex,
  joinSeedsAtEdge,
} = req('src/lib/faceIdentification.ts');
const { classifyLevel3Soundness } = req('src/lib/level3SoundnessGate.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

console.log('level-3 Build 1: the 3-cell op + the S² soundness gate (the manifold bar)\n');

// ---- ground on the COMMITTED cube seed ----
const cubeShape = createSeedShape('cube');
const cube = readSeedCell(cubeShape);
check('§0 the committed cube Cell grounds the op (8 vertices, 12 edges, 6 faces, 1 cell)', cube.vertexIds.length === 8 && cube.edges.length === 12 && cube.faces.length === 6);

// the translation maps, derived from the SEED'S OWN positions (+2 along the axis)
const positionOf = new Map(Object.values(cubeShape.vertices).map((v) => [v.id, v.position]));
const translationMap = (faceA, faceB, axis) => {
  const map = {};
  const targets = faceB.cycle.map((id) => ({ id, p: positionOf.get(id) }));
  for (const u of faceA.cycle) {
    const p = positionOf.get(u);
    const want = [0, 1, 2].map((i) => (i === axis ? p[i] + 2 : p[i]));
    const hit = targets.find((t) => t.p[0] === want[0] && t.p[1] === want[1] && t.p[2] === want[2]);
    if (!hit) throw new Error(`no translation image for ${u}`);
    map[u] = hit.id;
  }
  return map;
};
const faceByKey = (key) => cube.faces.find((f) => f.id === `face:cube:${key}`);
const LEFT = faceByKey('left');
const RIGHT = faceByKey('right');
const FRONT = faceByKey('front');
const BACK = faceByKey('back');
const BOTTOM = faceByKey('bottom');
const TOP = faceByKey('top');

const T3_PATTERN = [
  { faceA: LEFT.id, faceB: RIGHT.id, mode: 'preserving', map: translationMap(LEFT, RIGHT, 0) },
  { faceA: FRONT.id, faceB: BACK.id, mode: 'preserving', map: translationMap(FRONT, BACK, 1) },
  { faceA: BOTTOM.id, faceB: TOP.id, mode: 'preserving', map: translationMap(BOTTOM, TOP, 2) },
];

// ===== ① the 3-torus =====
console.log('----- [①] 3-TORUS (cube + translation gluings, all preserving) -----');
const t3 = glueFaces(cube, T3_PATTERN);
check('① counts READ off the union-find: V=1 E=3 F=3 C=1', eq(t3.counts, { v: 1, e: 3, f: 3, c: 1 }));
check('① Tier-1 χ = V−E+F−C = 0', t3.chi === 0);
check('① orientation at PATTERN level: all three gluings preserving (recorded; Tier-2 w₁ = Build 2)', t3.pairings.every((p) => p.mode === 'preserving'));
const t3Report = classifyLevel3Soundness(t3);
check('① S²-gate PASS (sound, zero failures)', t3Report.sound === true && t3Report.failures.length === 0);
check("① every edge-link reads 'interior' under the COMMITTED decomposeLink (3 classes)", t3Report.edgeLinks.length === 3 && t3Report.edgeLinks.every((l) => l.decomposition.valence === 'interior'));
check('① each edge-link is a 4-cycle (4 flag-classes, 4 cell-wedges, all degree 2)', t3Report.edgeLinks.every((l) => l.linkVertexCount === 4 && l.linkEdgeCount === 4 && [...l.adjacency.values()].every((nbrs) => nbrs.length === 2)));
const t3Vertex = t3Report.vertexLinks[0];
check('① ONE vertex-link — the octahedron: V=6 E=12 F=8, connected, χ=2', t3Report.vertexLinks.length === 1 && eq(t3Vertex.counts, { v: 6, e: 12, f: 8 }) && t3Vertex.components === 1 && t3Vertex.chi === 2);
note(`T³: counts=${JSON.stringify(t3.counts)} χ=${t3.chi}; vertex-link ${JSON.stringify(t3Vertex.counts)} components=${t3Vertex.components} χ=${t3Vertex.chi}`);
note('b₁=3 NOT asserted: the committed w₁/H₁ certifier reads 2-complexes — out of domain on a 3-complex (Build 2 tower territory; not faked)');

// ===== ② PINCH-A (edge-join) =====
console.log('\n----- [②] PINCH-A (two cubes sharing exactly ONE edge; no face glued) -----');
const c1 = readSeedCell(cubeShape, 'c1');
const c2 = readSeedCell(cubeShape, 'c2');
const sharedEdgeC1 = c1.edges.find((e) => (e.a === 'c1:vertex:cube:a' && e.b === 'c1:vertex:cube:b') || (e.a === 'c1:vertex:cube:b' && e.b === 'c1:vertex:cube:a'));
const sharedEdgeC2 = c2.edges.find((e) => (e.a === 'c2:vertex:cube:a' && e.b === 'c2:vertex:cube:b') || (e.a === 'c2:vertex:cube:b' && e.b === 'c2:vertex:cube:a'));
const pinchA = joinSeedsAtEdge(c1, c2, sharedEdgeC1.id, sharedEdgeC2.id, [
  ['c1:vertex:cube:a', 'c2:vertex:cube:a'],
  ['c1:vertex:cube:b', 'c2:vertex:cube:b'],
]);
check('② counts: V=14 E=23 F=12 C=2 (two cubes, one edge + its endpoints shared)', eq(pinchA.counts, { v: 14, e: 23, f: 12, c: 2 }));
check('② Tier-1 χ = 1 (ball χ=1, twice, minus the shared edge-complex χ=1)', pinchA.chi === 1);
const pinchAReport = classifyLevel3Soundness(pinchA);
check('② S²-gate FAILS (not sound)', pinchAReport.sound === false);
const sharedEdgeClass = pinchA.edgeClassOf(sharedEdgeC1.id);
const sharedEdgeFailure = pinchAReport.failures.find((f) => f.kind === 'edge-link' && f.edgeClass === sharedEdgeClass);
check("② FAIL(a) on the SHARED edge: decomposeLink valence 'junction' (pinch — two disjoint arcs), ≠ 'interior'", Boolean(sharedEdgeFailure) && sharedEdgeFailure.clause === 'a' && sharedEdgeFailure.valence === 'junction' && sharedEdgeFailure.pinch === true && sharedEdgeFailure.strata === 2);
const sharedEdgeLink = pinchAReport.edgeLinks.find((l) => l.edgeClass === sharedEdgeClass);
check('② the shared edge-link: 4 flag-classes (2 per cube), 2 cell-wedges — two arcs, nothing fused', sharedEdgeLink.linkVertexCount === 4 && sharedEdgeLink.linkEdgeCount === 2);
note(`② EMITTED SEAL — shared edge-link: valence='${sharedEdgeFailure.valence}' pinch=${sharedEdgeFailure.pinch} strata=${sharedEdgeFailure.strata}; linkV=${sharedEdgeLink.linkVertexCount} linkE=${sharedEdgeLink.linkEdgeCount}`);
const pinchAOtherFailures = pinchAReport.failures.filter((f) => f !== sharedEdgeFailure);
note(`② raw-boundary noise (the fixture is an OPEN complex — expected): ${pinchAOtherFailures.length} further failures (unglued boundary edges read 'boundary'; raw corners read disk χ=1)`);

// ===== ③ PINCH-B (vertex-join) — the CORRECTED seal =====
console.log('\n----- [③] PINCH-B (two cubes sharing exactly ONE vertex) — corrected seal -----');
const d1 = readSeedCell(cubeShape, 'd1');
const d2 = readSeedCell(cubeShape, 'd2');
const pinchB = joinSeedsAtVertex(d1, d2, 'd1:vertex:cube:g', 'd2:vertex:cube:a');
check('③ counts: V=15 E=24 F=12 C=2', eq(pinchB.counts, { v: 15, e: 24, f: 12, c: 2 }));
check('③ Tier-1 χ = 1', pinchB.chi === 1);
const pinchBReport = classifyLevel3Soundness(pinchB);
check('③ S²-gate FAILS (not sound)', pinchBReport.sound === false);
const sharedVertexClass = pinchB.vertexClassOf('d1:vertex:cube:g');
const sharedVertexFailure = pinchBReport.failures.find((f) => f.kind === 'vertex-link' && f.vertexClass === sharedVertexClass);
check('③ FAIL(b2)-by-CONNECTIVITY on the shared vertex: components = 2', Boolean(sharedVertexFailure) && sharedVertexFailure.clause === 'b2-connectivity' && sharedVertexFailure.components === 2);
check('③ the CORRECTED χ: the shared vertex-link is TWO DISJOINT DISKS — χ(link) = 2 (1 + 1), NOT 4', sharedVertexFailure.chi === 2);
const sharedVertexLink = pinchBReport.vertexLinks.find((l) => l.vertexClass === sharedVertexClass);
check('③ the shared vertex-link counts: V=6 E=6 F=2 (3 ends + 3 corner-arcs + 1 cell-corner per cube; nothing fused)', eq(sharedVertexLink.counts, { v: 6, e: 6, f: 2 }));
note(`③ EMITTED SEAL — shared vertex-link: components=${sharedVertexFailure.components} χ=${sharedVertexFailure.chi} counts=${JSON.stringify(sharedVertexLink.counts)}`);
note(`③ raw-boundary noise: ${pinchBReport.failures.length - 1} further failures (open-complex boundary — every raw corner is a disk χ=1, every boundary edge an arc)`);

// ===== ④ deferred =====
console.log('\n----- [④] (deferred) connected non-sphere vertex-link (FAIL(b2)-by-χ) -----');
note('④ NOT in the researcher re-issue — a DEFERRED VALIDATION GAP, to be co-derived with the researcher once the extractor exists (this build). The b2-χ clause is exercised only by the pinch fixtures\' raw boundary disks (χ=1), not by a connected CLOSED non-sphere link.');

// ===== teeth: well-formedness + op contracts =====
console.log('\n----- [teeth] WELL-FORMEDNESS + CONTRACTS -----');
const throws = (fn, needle) => {
  try {
    fn();
    return false;
  } catch (error) {
    return String(error.message).includes(needle);
  }
};
check('tooth: an IMPERFECT matching refuses (two pairs leave faces unmatched)', throws(() => glueFaces(cube, T3_PATTERN.slice(0, 2)), 'perfect matching'));
check('tooth: a missing mode refuses', throws(() => glueFaces(cube, [{ ...T3_PATTERN[0], mode: undefined }, T3_PATTERN[1], T3_PATTERN[2]]), 'mode'));
const brokenMap = { ...T3_PATTERN[2], map: (() => {
  const m = { ...T3_PATTERN[2].map };
  const [k1, k2] = [BOTTOM.cycle[1], BOTTOM.cycle[2]];
  const tmp = m[k1];
  m[k1] = m[k2];
  m[k2] = tmp; // swap two images — breaks cycle adjacency
  return m;
})() };
check('tooth: a map that BREAKS the boundary cycle refuses (not a combinatorial isomorphism)', throws(() => glueFaces(cube, [T3_PATTERN[0], T3_PATTERN[1], brokenMap]), 'cycle'));
check('tooth: glueFaces refuses a reversing pairing (the level-2 contract, mirrored)', throws(() => glueFaces(cube, [T3_PATTERN[0], T3_PATTERN[1], { ...T3_PATTERN[2], mode: 'reversing' }]), 'preserving'));
check('tooth: flipGlueFaces refuses an all-preserving pattern', throws(() => flipGlueFaces(cube, T3_PATTERN), 'reversing'));
check('tooth: a face pairing with ITSELF refuses', throws(() => glueFaces(cube, [{ faceA: LEFT.id, faceB: LEFT.id, mode: 'preserving', map: {} }, T3_PATTERN[1], T3_PATTERN[2]]), 'itself'));

console.log(
  `\n--- level-3 Build 1 (3-torus PASS · PINCH-A FAIL(a) 'junction' · PINCH-B FAIL(b2)-connectivity χ=2 · teeth): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

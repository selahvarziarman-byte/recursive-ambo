#!/usr/bin/env node
// diagnose-subdivide-face — H1: THE AIMED CHORD (subdivideFace), witnessed.
//
// The committed chord discipline (surfaceRefinement's refineToDisk), opened to
// the person's hands: ANY face of a MULTI-face shape, the chord aimed at two
// named corners. This witness carries the mandate's three proof batteries:
//   [1] THE INVARIANCE TRAP (LAW 16), per accepted cut: χ ==, w₁ ==, H₁ ==
//       (operationalized through the committed certificate: cert.b1 ·
//       cert.w1Class · cert.nonOrientable · classification), V+0/E+1/F+1,
//       every untargeted face BYTE-CARRIED (same object references), the
//       carrier surjective new→old. Subjects: the square (v0–v2 → two
//       triangles) · the pentagon (the 2/3 split) · a CUBE face (the other
//       five faces byte-identical).
//   [2] REFUSALS, total on person-reachable input: a triangle refuses ALL
//       pairs ("a triangle has no chord") · a born torus face refuses as
//       folded/quotient · an adjacent pair refuses · a corner off the face
//       refuses by name · an alien face is an integrity throw · the
//       endpoint-keyed duplicate refuses (exercised on a legitimate
//       diagonal-sharing complex — person-unreachable on today's factories,
//       engine-total regardless). Zero crashes: every wall is a named throw.
//   [3] THE CHAIN — refuse → subdivide → succeed: square-pyramid base (4) vs
//       penta-pyramid base (5) → connectedSum refuses with the R5 door →
//       subdivideFace splits the pentagon 2/3 → the sum on the new 4-rim
//       face SUCCEEDS, certified (χ = 2, orientable, closed — sphere # sphere).
'use strict';
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  const src = fs.readFileSync(filename, 'utf8');
  const out = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
  });
  module._compile(out.outputText, filename);
};
require.extensions['.tsx'] = require.extensions['.ts'];
const req = (p) => require(path.join(repoRoot, p));

const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { executeCustomGlue } = req('src/playground/customGluing.ts');
const { subdivideFace } = req('src/lib/surfaceRefinement.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');
const { connectedSum } = req('src/lib/connectedSum.ts');
const { createSeedShape } = req('src/data/seeds.ts');

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('subdivideFace — the aimed chord: the committed discipline at the person\'s hands (H1)\n');

// ═════ helpers ═══════════════════════════════════════════════════════════════
const invariantKey = (r) =>
  JSON.stringify({
    chi: r.chi,
    b1: r.cert ? r.cert.b1 : null,
    w1: r.cert ? r.cert.w1Class : null,
    nonOr: r.cert ? r.cert.nonOrientable : null,
    boundary: r.boundary,
    classification: r.classification,
  });
const refuses = (fn, fragment) => {
  try {
    fn();
    return { refused: false, message: '(no throw)' };
  } catch (error) {
    const message = String(error && error.message);
    return { refused: message.includes(fragment), message };
  }
};

// ═════ [1] THE INVARIANCE TRAP — three subjects ══════════════════════════════
console.log('----- [1] the invariance trap (LAW 16): chi/w1/H1 ==, V+0 E+1 F+1, byte-carry, surjective carrier -----');

const trap = (label, shape, face, a, b, parent = null) => {
  const before = readFormInvariants(shape, parent);
  const cut = subdivideFace(shape, face, a, b);
  const after = readFormInvariants(cut.shape, parent);
  const counts =
    Object.keys(cut.shape.vertices).length === Object.keys(shape.vertices).length &&
    cut.shape.edges.length === shape.edges.length + 1 &&
    cut.shape.faces.length === shape.faces.length + 1;
  check(`${label}: V+0 · E+1 · F+1`, counts);
  check(`${label}: chi/w1/H1 (certified key) INVARIANT`, invariantKey(before) === invariantKey(after));
  note(`before ${invariantKey(before)}`);
  note(`after  ${invariantKey(after)}`);
  const untargeted = shape.faces.filter((f) => f.id !== face.id);
  const byteCarried =
    untargeted.every((f) => cut.shape.faces.includes(f)) &&
    shape.edges.every((e) => cut.shape.edges.includes(e)) &&
    cut.shape.vertices === shape.vertices;
  check(`${label}: every untargeted cell BYTE-CARRIED (same object references; vertices by reference)`, byteCarried);
  const oldIds = new Set([...Object.keys(shape.vertices), ...shape.edges.map((e) => e.id), ...shape.faces.map((f) => f.id)]);
  const image = new Set(Object.values(cut.refinement.carrier));
  const surjective = [...oldIds].every((id) => image.has(id));
  const chordMapped = cut.refinement.carrier[cut.refinement.chordEdgeId] === face.id;
  const diskMapped = cut.refinement.carrier[`${face.id}:disk`] === face.id && cut.refinement.carrier[`${face.id}:rest`] === face.id;
  check(`${label}: carrier surjective new→old · {disk, rest, chord} → the face · identity elsewhere`, surjective && chordMapped && diskMapped);
  return cut;
};

const sq = loadForm(nGon(4), 'h1sq');
const sqC = sq.faces[0].vertexIds;
const sqCut = trap('SQUARE v0–v2 (two triangles)', sq, sq.faces[0], sqC[0], sqC[2]);
check('SQUARE: both halves are triangles', sqCut.shape.faces.every((f) => f.vertexIds.length === 3));

const pent = loadForm(nGon(5), 'h1pent');
const pentC = pent.faces[0].vertexIds;
const pentCut = trap('PENTAGON v0–v2 (the 2/3 split)', pent, pent.faces[0], pentC[0], pentC[2]);
check('PENTAGON: the halves read 3-gon + 4-gon', pentCut.shape.faces.map((f) => f.vertexIds.length).sort().join(',') === '3,4');

const cube = createSeedShape('cube');
const cubeFace = cube.faces[0];
const cubeC = cubeFace.vertexIds;
trap(`CUBE ${cubeFace.id} (the other five byte-identical)`, cube, cubeFace, cubeC[0], cubeC[2]);

// ═════ [2] REFUSALS — total, named, zero crashes ═════════════════════════════
console.log('\n----- [2] refusals: every wall a named throw; a triangle has no chord -----');

const tri = loadForm(nGon(3), 'h1tri');
const triC = tri.faces[0].vertexIds;
let triAllRefuse = true;
for (let i = 0; i < 3 && triAllRefuse; i += 1) {
  for (let j = 0; j < 3 && triAllRefuse; j += 1) {
    const r = refuses(() => subdivideFace(tri, tri.faces[0], triC[i], triC[j]), 'chord');
    triAllRefuse = r.refused;
  }
}
check('TRIANGLE: all 9 corner pairs REFUSE in the adjacency family ("a triangle has no chord") — correct, not a bug', triAllRefuse);

const torusPoly = loadForm(nGon(4), 'h1torus');
const TORUS_WORD = [
  { edgeA: 0, edgeB: 2, mode: 'preserving' },
  { edgeA: 1, edgeB: 3, mode: 'preserving' },
];
const bornTorus = executeCustomGlue(torusPoly, torusPoly.faces[0], TORUS_WORD, null);
const bornFace = bornTorus.faces[0];
const rTorus = refuses(
  () => subdivideFace(bornTorus, bornFace, bornFace.vertexIds[0], bornFace.vertexIds[2]),
  'folded/quotient',
);
check('BORN TORUS face: refuses as folded/quotient (repeated corner classes — not a disk)', rTorus.refused);
note(rTorus.message);

const rAdj = refuses(() => subdivideFace(sq, sq.faces[0], sqC[0], sqC[1]), 'adjacent');
check('SQUARE adjacent pair (v0,v1): refuses — they already share a rim edge', rAdj.refused);
note(rAdj.message);

const rOff = refuses(() => subdivideFace(cube, cube.faces[0], 'vertex:cube:not-a-corner', cubeC[2]), 'is not on face');
check('CUBE: a corner off the face refuses BY NAME', rOff.refused);
note(rOff.message);

const rAlien = refuses(() => subdivideFace(sq, pent.faces[0], pentC[0], pentC[2]), 'integrity');
check('ALIEN face (the pentagon\'s face handed to the square): integrity throw (dev)', rAlien.refused);
note(rAlien.message);

// the endpoint-keyed duplicate — a legitimate diagonal-sharing complex (two
// faces meeting along (a,c)): the chord a–c on the 4-gon face is non-adjacent
// on ITS rim but the pair already carries an edge instance → the discipline
// refuses. (Person-unreachable through today's factories — engine-total anyway.)
const fan = loadForm(
  () => ({
    name: 'diag-fan',
    vertices: [
      { id: 'a', position: [0, 0, 0] },
      { id: 'b', position: [1, 0, 0] },
      { id: 'c', position: [1, 1, 0] },
      { id: 'd', position: [0, 1, 0] },
      { id: 'x', position: [0.5, 0.5, 1] },
    ],
    faces: [{ vertexIds: ['a', 'b', 'c', 'd'] }, { vertexIds: ['a', 'c', 'x'] }],
  }),
  'h1fan',
);
const fanFace = fan.faces[0];
const rDup = refuses(
  () => subdivideFace(fan, fanFace, fanFace.vertexIds[0], fanFace.vertexIds[2]),
  'endpoint-keyed',
);
check('DUPLICATE PAIR: a chord onto an existing diagonal\'s endpoint pair refuses in the endpoint-keyed family', rDup.refused);
note(rDup.message);

// ═════ [3] THE CHAIN — refuse → subdivide → succeed ══════════════════════════
console.log('\n----- [3] the chain: the R5 door refuses 4-vs-5 → the aimed chord makes a 4-rim → the sum lands -----');

const pentaPyramid = () => ({
  name: 'penta-pyramid',
  vertices: [
    { id: 'b0', position: [1, 0, 0] },
    { id: 'b1', position: [0.309, 0.951, 0] },
    { id: 'b2', position: [-0.809, 0.588, 0] },
    { id: 'b3', position: [-0.809, -0.588, 0] },
    { id: 'b4', position: [0.309, -0.951, 0] },
    { id: 'apex', position: [0, 0, 1.2] },
  ],
  faces: [
    { vertexIds: ['b0', 'b1', 'b2', 'b3', 'b4'] },
    { vertexIds: ['b1', 'b0', 'apex'] },
    { vertexIds: ['b2', 'b1', 'apex'] },
    { vertexIds: ['b3', 'b2', 'apex'] },
    { vertexIds: ['b4', 'b3', 'apex'] },
    { vertexIds: ['b0', 'b4', 'apex'] },
  ],
});
const squarePyramid = () => ({
  name: 'square-pyramid',
  vertices: [
    { id: 'q0', position: [1, 0, 0] },
    { id: 'q1', position: [0, 1, 0] },
    { id: 'q2', position: [-1, 0, 0] },
    { id: 'q3', position: [0, -1, 0] },
    { id: 'apex', position: [0, 0, 1.2] },
  ],
  faces: [
    { vertexIds: ['q0', 'q1', 'q2', 'q3'] },
    { vertexIds: ['q1', 'q0', 'apex'] },
    { vertexIds: ['q2', 'q1', 'apex'] },
    { vertexIds: ['q3', 'q2', 'apex'] },
    { vertexIds: ['q0', 'q3', 'apex'] },
  ],
});
const P = loadForm(pentaPyramid, 'h1P'); // the 5-gon base is P.faces[0]
const Q = loadForm(squarePyramid, 'h1Q'); // the 4-gon base is Q.faces[0]
check('the subjects stand: penta-pyramid V6 E10 F6 (chi 2) · square-pyramid V5 E8 F5 (chi 2)',
  Object.keys(P.vertices).length === 6 && P.edges.length === 10 && P.faces.length === 6 &&
  Object.keys(Q.vertices).length === 5 && Q.edges.length === 8 && Q.faces.length === 5);

const rMismatch = refuses(
  () => connectedSum(Q, P, { faceA: Q.faces[0], faceB: P.faces[0] }),
  'rims of different lengths — 4 edges and 5.',
);
check('STEP 1 — REFUSE: connectedSum(4-gon base, 5-gon base) speaks the R5 door verbatim', rMismatch.refused);
note(`the door: ${rMismatch.message}`);

const pBase = P.faces[0];
const pCut = subdivideFace(P, pBase, pBase.vertexIds[0], pBase.vertexIds[2]);
const newFourRim = pCut.shape.faces.find((f) => f.id === `${pBase.id}:rest`);
check('STEP 2 — SUBDIVIDE: the aimed chord splits the pentagon 2/3; the :rest face is the new 4-rim',
  newFourRim !== undefined && newFourRim.vertexIds.length === 4);

const sum = connectedSum(Q, pCut.shape, { faceA: Q.faces[0], faceB: newFourRim });
const sumInv = readFormInvariants(sum.shape, [Q, pCut.shape]);
check('STEP 3 — SUCCEED: the sum lands · chi = 2 · orientable · closed (sphere # sphere = sphere)',
  sumInv.chi === 2 && sumInv.cert !== null && sumInv.cert.nonOrientable === false && sumInv.boundary === 'closed');
note(`the certificate: chi ${sumInv.chi} · chiCertified ${sumInv.chiCertified} · classification "${sumInv.classification}" · boundary ${sumInv.boundary}`);

console.log(`\n${failures === 0 ? 'ALL CHECKS PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

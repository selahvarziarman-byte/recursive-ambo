#!/usr/bin/env node

// DIAGNOSTIC — P-IMMERSE: the generic classify→immersion pipeline (the ABSTAIN
// falls; the free zoo renders). Additive / derive-only — the ENGINE and the
// certifiers are byte-unchanged (asserted in §i); every pin below is a
// MEASURED value off the committed instruments.
//
//   §a ★ FLAGSHIP (the P2 payoff) — the committed `connectedSum(T², T²)`
//      enacted genus-2 routes to a CLASS BODY: classifier {orientable, g=2,
//      b=0, χ=−2, b₁=4} off the committed certificates; the standard body
//      (two torus summands sewn by the COMMITTED connectedSum) SELF-CERTIFIES
//      to the same class; the committed `deriveOptionBGenerators(body)` draws
//      4 generators (count === certified b₁); the card reads the FORM's own
//      certified invariants + the honest-representative frame.
//   §b UNNAMED combinations — word-born forms OUTSIDE the v0 map (3-pair
//      hexagon words; `classifyGluingWord` returns null — the old abstain):
//      the aabbcc-style hexagon → N₃ (3 cross-caps, H₁ = ℤ⊕ℤ⊕ℤ/2, 3
//      generators); the antipodal-preserving hexagon → an unnamed genus-1.
//   §c genus-3 — `connectedSum(genus-2, T²)` → a 3-torus-chain body, 6
//      certified generators.
//   §d BOUNDED + THE NEW COUNTER — boundary-circle counting is the missing
//      discriminator: (χ=−1, orientable, b₁=2) admits BOTH {g0,b3} and
//      {g1,b1} by arithmetic; the counter measures b=1 (punctured torus).
//      Committed cylinder/möbius immersions count 2 / 1; the with-b-holes
//      bodies carry the counted circles.
//   §e 3-MANIFOLDS — the generic form→DomainModel builder reproduces the
//      committed T³ (same counts/χ/H₁/soundness) and builds a REFLECTED-map
//      cube domain that the committed tower reads NON-orientable
//      (H₁ = Z²⊕Z/2, sound) — no R³ body, the fundamental-domain route.
//   §f HONEST FLAGS — non-manifold edge (3-page book): refused, junction
//      edge NAMED, the plain render carries it (marked construction);
//      non-manifold vertex (tori wedge, incl. the even-χ chain that χ·w₁·b
//      arithmetic ALONE would misread as genus 2): refused by the committed
//      link gate; DISCONNECTED: per-component classes and bodies;
//      un-certified (no parent to replay): refused, no class claimed.
//   §g THE GUARD IS REAL — a genus-2 body handed a genus-3 (or N₂) claim
//      REFUSES; `buildClassBody` structurally ends in the guard.
//   §h THE VIEW PATH (the Q-M2 chain payoff) — through the REAL registry:
//      square → glue-cylinder (immersion) → CHAINED glue-torus on the born
//      quotient face → the composed word abstains from the v0 map → the form
//      now renders as a classBody genus-1 (it used to THROW).
//   §i BYTE-GUARDS — the committed immersions, Option B, globalW1, the link
//      gate, the renderers (InkedForm/InkedDomain), worldModel, and the engine
//      are unchanged vs HEAD. (Two sanctioned departures, 2026-07-11:
//      `formInvariants` / `bornFormRouting` left the guard for the flag sweep
//      — the connectivity-honest classification; the v0 map narrowed to its
//      PROVABLE domain (two-pair claims 4-gon-only; the ratified single-pair
//      open path kept) — ratified in diagnose-p-immerse-sweep.cjs;
//      `playgroundOperations` / `customGluing` for the word-op single-face
//      gate — ratified in diagnose-word-op-single-face-gate.cjs.)
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
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

const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { serializeSnapshot, deserializeSnapshot } = req('src/playground/snapshot.ts');
const { connectedSum } = req('src/lib/connectedSum.ts');
const { assemble, loadForm } = req('src/lib/multiform.ts');
const { cutCell } = req('src/lib/cutOperation.ts');
const { materializeCutResult } = req('src/lib/materializeOperation.ts');
const { executeCustomGlue } = req('src/playground/customGluing.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { classifyGluingWord, routeBornForm } = req('src/playground/bornFormRouting.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');
const {
  acquireFaithfulComplex,
  classifyForm,
  classLabel,
  readBoundary,
  splitComplexComponents,
  vertexLinkVerdicts,
} = req('src/manuscript/surfaceClassifier.ts');
const { assertBodyCertifiesToClass, buildClassBody } = req('src/manuscript/standardBodies.ts');
const { buildClassBodyModel, readClassBodySpecimen, CLASS_BODY_FRAME } = req('src/manuscript/classBodyModel.ts');
const {
  applyPlaygroundOperationTo,
  invokePrimitive,
  routeWrittenRender,
} = req('src/manuscript/writtenFormModel.ts');
const { buildFormDomain } = req('src/manuscript/formDomainModel.ts');
const { buildThreeTorusDomain } = req('src/manuscript/worldModel.ts');
const { readDomainSpecimen } = req('src/manuscript/specimenModel.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { readSeedCell } = req('src/lib/faceIdentification.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const copyOf = (shape, prefix) => deserializeSnapshot(serializeSnapshot(shape, prefix)).shape;
const torusRep = (prefix) => copyOf(immerseSurface({ surface: 'torus', resolution: 4 }).shape, prefix);

// independent shape-level measure (the P2 diagnostic idiom — no classifier code)
const ekey = (u, v) => (u < v ? `${u} ${v}` : `${v} ${u}`);
function measure(shape) {
  const V = Object.keys(shape.vertices).length;
  const E = shape.edges.length;
  const F = shape.faces.length;
  const parent = new Map();
  const find = (x) => {
    if (!parent.has(x)) parent.set(x, x);
    let r = x;
    while (parent.get(r) !== r) r = parent.get(r);
    return r;
  };
  for (const v of Object.keys(shape.vertices)) find(v);
  for (const e of shape.edges) parent.set(find(e.vertexIds[0]), find(e.vertexIds[1]));
  const b0 = new Set(Object.keys(shape.vertices).map((v) => find(v))).size;
  const sides = new Map();
  for (const f of shape.faces) {
    const c = f.vertexIds;
    for (let k = 0; k < c.length; k += 1) {
      const kk = ekey(c[k], c[(k + 1) % c.length]);
      sides.set(kk, (sides.get(kk) ?? 0) + 1);
    }
  }
  let free = 0;
  let junction = 0;
  for (const e of shape.edges) {
    const s = sides.get(ekey(e.vertexIds[0], e.vertexIds[1])) ?? 0;
    if (s < 2) free += 1;
    if (s > 2) junction += 1;
  }
  return { V, E, F, chi: V - E + F, b0, free, junction };
}

console.log('P-IMMERSE: classify → class body → certified generators (the abstain falls)\n');

// ===== [a] ★ FLAGSHIP — connectedSum(T², T²) → the genus-2 class body ==========
console.log('----- [a] the flagship: the P2 enacted genus-2 gets its body -----');
const sum = connectedSum(torusRep('csA'), torusRep('csB')).shape;
check('the flagship form IS the committed P2 genus-2 (χ=−2, connected, closed)',
  eq(measure(sum), { V: 28, E: 60, F: 30, chi: -2, b0: 1, free: 0, junction: 0 }));
check('the OLD route abstains: an assemble child is routeBornForm "raw" (bookkeeping positions)',
  routeBornForm(sum, null).kind === 'raw');
const clsSum = classifyForm(sum, null);
check('classifyForm: ok · direct complex · ONE component', clsSum.ok && clsSum.complexSource === 'direct' && clsSum.components.length === 1);
check('the class is {orientable, g=2, b=0, χ=−2, b₁=4} — derived from the committed certificates',
  clsSum.ok && eq(clsSum.components[0].class, { kind: 'orientable', g: 2, b: 0, chi: -2, b1: 4 }));
note(`class label: "${clsSum.ok ? classLabel(clsSum.components[0].class) : '—'}"`);
const flagship = buildClassBodyModel(sum, null);
const fc = flagship.components[0];
check('the model carries ONE component labelled "genus 2"', flagship.components.length === 1 && fc.label === 'genus 2');
const bodyM = measure(fc.body);
check('the BODY (two torus summands sewn by the COMMITTED connectedSum): {V:124, E:252, F:126}, χ=−2, connected, closed',
  eq(bodyM, { V: 124, E: 252, F: 126, chi: -2, b0: 1, free: 0, junction: 0 }));
const bodyInv = readFormInvariants(fc.body);
check('the body SELF-CERTIFIES: committed certifier reads b₁=4, orientable, "genus 2 (closed, orientable)"',
  bodyInv.cert && bodyInv.cert.b1 === 4 && !bodyInv.cert.nonOrientable &&
  bodyInv.chiCertified === -2 && bodyInv.classification === 'genus 2 (closed, orientable)');
const bodyGate = vertexLinkVerdicts(acquireFaithfulComplex(fc.body, null).complex);
check('the committed link gate reads EVERY body vertex interior',
  [...bodyGate.values()].every((v) => v === 'interior'));
check('the drawn generators are the committed Option-B basis ON the body: 4 === certified b₁ === the form\'s b₁',
  fc.optionB.b1 === 4 && fc.optionB.generators.length === 4 &&
  clsSum.ok && fc.optionB.b1 === clsSum.components[0].cert.b1);
check('every generator polyline is CLOSED (first === last)',
  fc.optionB.generators.every((g) => g.polylines.every((p) => eq(p[0], p[p.length - 1]))));
note(`generator loops per class: ${fc.optionB.generators.map((g) => g.polylines.length).join(', ')}`);
const routeSum = routeWrittenRender(sum, null, 8);
check('routeWrittenRender: the abstain FELL — mode is "classBody" (it used to THROW here)', routeSum.mode === 'classBody');
const card = readClassBodySpecimen('genus 2 — born', 'connectedSum', flagship);
const row = (label) => card.rows.find((r) => r.label === label)?.value;
check('the card reads the FORM\'s OWN certified invariants, χ CUT IN TWO (B-132): number "−2" a measure row, "certified" its own check row, class "genus 2", H₁ = ℤ⁴',
  row('Euler χ') === '-2' && row('χ') === 'certified' && row('class') === 'genus 2' && row('H₁') === 'ℤ ⊕ ℤ ⊕ ℤ ⊕ ℤ');
check('the card carries the NEW boundary-circles row (0) and the honest-representative body NOTE (B-132: the frame sentence is none of the four kinds — it rides the §5(a) notes register, naming its subject)',
  row('boundary circles') === '0' && (card.notes ?? []).some((n) => n.includes('chosen representative')));
check('the honest frame is stated on the model', flagship.frame === CLASS_BODY_FRAME);
check('the card legend names the 4 drawn generators', eq(card.legend.map((l) => l.key), ['g1', 'g2', 'g3', 'g4']));

// ===== [b] unnamed combinations (outside the v0 word map) ======================
console.log('\n----- [b] unnamed word-born forms: the free zoo renders -----');
const hexN3 = loadForm(nGon(6), 'hexN3');
const n3Pairings = [
  { edgeA: 0, edgeB: 1, mode: 'reversing' },
  { edgeA: 2, edgeB: 3, mode: 'reversing' },
  { edgeA: 4, edgeB: 5, mode: 'reversing' },
];
check('the v0 map ABSTAINS on the 3-pair hexagon word (classifyGluingWord → null)',
  classifyGluingWord(n3Pairings, 6) === null);
const bornN3 = executeCustomGlue(hexN3, hexN3.faces[0], n3Pairings);
const routeN3 = routeWrittenRender(bornN3, hexN3, 8);
check('the aabbcc-style hexagon (committed custom glue, replay-verified) → classBody', routeN3.mode === 'classBody');
const n3c = routeN3.model.components[0];
check('its class is N₃: {non-orientable, k=3, b=0, χ=−1, b₁=3} · recovered complex',
  eq(n3c.class, { kind: 'non-orientable', k: 3, b: 0, chi: -1, b1: 3 }) && routeN3.model.complexSource === 'recovered');
check('the N₃ body: 3 cross-cap summands sewn by the committed macro — closed, self-certified, 3 generators drawn',
  measure(n3c.body).free === 0 && n3c.optionB.generators.length === 3 && n3c.label === '3 cross-caps');
check('H₁ reads the honest N₃ torsion: ℤ ⊕ ℤ ⊕ ℤ/2', routeN3.model.h1Label === 'ℤ ⊕ ℤ ⊕ ℤ/2');
const hexT = loadForm(nGon(6), 'hexT');
const tPairings = [
  { edgeA: 0, edgeB: 3, mode: 'preserving' },
  { edgeA: 1, edgeB: 4, mode: 'preserving' },
  { edgeA: 2, edgeB: 5, mode: 'preserving' },
];
check('the antipodal-preserving hexagon also abstains from the v0 map', classifyGluingWord(tPairings, 6) === null);
const routeT = routeWrittenRender(executeCustomGlue(hexT, hexT.faces[0], tPairings), hexT, 8);
check('…and renders as an unnamed genus-1 class body (2 generators)',
  routeT.mode === 'classBody' && routeT.model.components[0].label === 'genus 1' &&
  routeT.model.components[0].optionB.generators.length === 2);

// ===== [c] genus-3 =============================================================
console.log('\n----- [c] genus-3: the chain grows -----');
const sum3 = connectedSum(sum, torusRep('csC')).shape;
const m3 = buildClassBodyModel(sum3, null);
check('connectedSum(genus-2, T²) classifies genus 3 (χ=−4, b₁=6)',
  eq(m3.components[0].class, { kind: 'orientable', g: 3, b: 0, chi: -4, b1: 6 }));
check('the genus-3 body (three summands, two committed seams) self-certifies with 6 drawn generators',
  m3.components[0].optionB.generators.length === 6 && measure(m3.components[0].body).chi === -4 &&
  measure(m3.components[0].body).free === 0);

// ===== [d] bounded + THE NEW COUNTER ===========================================
console.log('\n----- [d] bounded surfaces: the boundary-circle counter discriminates -----');
const cylShape = immerseSurface({ surface: 'cylinder', resolution: 6 }).shape;
const mobShape = immerseSurface({ surface: 'mobius', resolution: 6 }).shape;
const clsCyl = classifyForm(cylShape, null);
const clsMob = classifyForm(mobShape, null);
check('the committed cylinder immersion counts b=2 (genus 0 · 2 boundary circles)',
  clsCyl.ok && eq(clsCyl.components[0].class, { kind: 'orientable', g: 0, b: 2, chi: 0, b1: 1 }));
check('the committed möbius immersion counts b=1 (1 cross-cap · 1 boundary circle)',
  clsMob.ok && eq(clsMob.components[0].class, { kind: 'non-orientable', k: 1, b: 1, chi: 0, b1: 1 }));
const tCut = torusRep('cutT');
const cut = materializeCutResult(tCut, cutCell(tCut, tCut.faces[5]));
const clsCut = classifyForm(cut, null);
check('the punctured torus (committed cut) classifies {g=1, b=1, χ=−1, b₁=2}',
  clsCut.ok && eq(clsCut.components[0].class, { kind: 'orientable', g: 1, b: 1, chi: -1, b1: 2 }));
// the discriminator: (χ=−1, orientable) admits BOTH g0·b3 and g1·b1 by arithmetic
const chi = -1;
check('χ·orientability ALONE is ambiguous here: 2−b−χ is a valid even genus-doubling for BOTH b=1 and b=3',
  (2 - 1 - chi) % 2 === 0 && (2 - 1 - chi) >= 0 && (2 - 3 - chi) % 2 === 0 && (2 - 3 - chi) >= 0);
note('…so ONLY the measured circle count decides — the mandate\'s missing discriminator, built');
const hexB = loadForm(nGon(6), 'hexBnd');
const bornB = executeCustomGlue(hexB, hexB.faces[0], [
  { edgeA: 0, edgeB: 3, mode: 'preserving' },
  { edgeA: 1, edgeB: 4, mode: 'preserving' },
]);
const mB = buildClassBodyModel(bornB, hexB);
check('a RECOVERED bounded word-born form (2-pair hexagon) counts b=1 on the recovered complex → genus 1 · 1 boundary circle',
  eq(mB.components[0].class, { kind: 'orientable', g: 1, b: 1, chi: -1, b1: 2 }) && mB.complexSource === 'recovered');
const bBody = mB.components[0].body;
const bBoundary = readBoundary(acquireFaithfulComplex(bBody, null).complex);
check('its with-b-holes body carries EXACTLY the counted circles: 1 free circle, committed-cut rim, 2 generators',
  bBoundary.circles === 1 && bBoundary.circlesAreDisjoint && mB.components[0].optionB.generators.length === 2 &&
  readFormInvariants(bBody).boundary === 'open');

// ===== [e] 3-manifolds: the generic domain route ================================
console.log('\n----- [e] 3-manifolds: form → DomainModel, generalized -----');
const committedT3 = buildThreeTorusDomain();
const cubeShape = createSeedShape('cube');
const cube = readSeedCell(cubeShape);
const at = (id) => cubeShape.vertices[id].position;
const cubeFace = (key) => cube.faces.find((f) => f.id === `face:cube:${key}`);
const near = (x, y) => Math.abs(x - y) < 1e-9;
const mapBy = (fA, fB, ok) => {
  const map = {};
  for (const a of fA.cycle) map[a] = fB.cycle.find((b) => ok(at(a), at(b)));
  return map;
};
const t3Pattern = [
  { faceA: cubeFace('left').id, faceB: cubeFace('right').id, mode: 'preserving', map: mapBy(cubeFace('left'), cubeFace('right'), (pa, pb) => near(pa[1], pb[1]) && near(pa[2], pb[2])) },
  { faceA: cubeFace('front').id, faceB: cubeFace('back').id, mode: 'preserving', map: mapBy(cubeFace('front'), cubeFace('back'), (pa, pb) => near(pa[0], pb[0]) && near(pa[2], pb[2])) },
  { faceA: cubeFace('bottom').id, faceB: cubeFace('top').id, mode: 'preserving', map: mapBy(cubeFace('bottom'), cubeFace('top'), (pa, pb) => near(pa[0], pb[0]) && near(pa[1], pb[1])) },
];
const genericT3 = buildFormDomain(cubeShape, t3Pattern, 't3-generic', 'T³ — generic builder');
check('the GENERIC builder on (cube, T³ pattern) reproduces the committed domain: counts {1,3,3,1}, χ=0, H₁=Z³, sound, orientable',
  eq(genericT3.complex.counts, committedT3.complex.counts) &&
  genericT3.complex.chi === 0 && genericT3.tower.sound && genericT3.tower.orientable &&
  genericT3.tower.homology.H1.pretty === committedT3.tower.homology.H1.pretty &&
  genericT3.pairs.length === committedT3.pairs.length);
const flipPattern = [
  { faceA: cubeFace('left').id, faceB: cubeFace('right').id, mode: 'reversing', map: mapBy(cubeFace('left'), cubeFace('right'), (pa, pb) => near(pa[1], pb[1]) && near(pa[2], -pb[2])) },
  t3Pattern[1],
  t3Pattern[2],
];
const flipDomain = buildFormDomain(cubeShape, flipPattern, 'flip-cube', 'reflected cube');
check('a REFLECTED-map cube (flipGlueFaces route) is a genuinely different 3-manifold: sound, NON-orientable, H₁ = Z² ⊕ Z/2',
  flipDomain.tower.sound && !flipDomain.tower.orientable && flipDomain.tower.homology.H1.pretty === 'Z^2 ⊕ Z/2');
const flipReading = readDomainSpecimen(flipDomain);
check('the committed domain specimen reads the generic DomainModel (no R³ body — the fundamental-domain route)',
  flipReading.kind === 'domain' && flipReading.rows.some((r) => r.label === 'S² gate' && r.value === 'sound') &&
  flipReading.twist !== null);

// ===== [f] honest flags =========================================================
console.log('\n----- [f] honest flags: junction marked · per-component · un-certified -----');
const book = loadForm(() => ({
  name: 'book3',
  vertices: [
    { id: 'A', position: [0, -1, 0] },
    { id: 'B', position: [0, 1, 0] },
    { id: 'p1', position: [1.4, 0, 0] },
    { id: 'p2', position: [-0.7, 0, 1.2] },
    { id: 'p3', position: [-0.7, 0, -1.2] },
  ],
  faces: [
    { vertexIds: ['A', 'B', 'p1'] },
    { vertexIds: ['A', 'B', 'p2'] },
    { vertexIds: ['A', 'B', 'p3'] },
  ],
}), 'bk');
const clsBook = classifyForm(book, null);
check('the 3-page book REFUSES a body: non-manifold edge incidence, the junction edge NAMED',
  !clsBook.ok && clsBook.reason.includes('non-manifold edge incidence') && (clsBook.junctionEdgeIds ?? []).length === 1);
let bookModelThrew = false;
try {
  buildClassBodyModel(book, null);
} catch {
  bookModelThrew = true;
}
check('buildClassBodyModel throws the refusal verbatim — never a fake body', bookModelThrew);
const routeBook = routeWrittenRender(book, null, 8);
check('the book still renders its OWN construction (plain, real positions) WITH the junction carried for marking',
  routeBook.mode === 'plain' && eq(routeBook.junctionEdgeIds, clsBook.junctionEdgeIds));
// vertex pinches — the case χ·w₁·b arithmetic cannot see
const wA = torusRep('wA2');
const wB = torusRep('wB2');
const wedge = assemble([wA, wB], {
  merges: [{ resultId: 'pinch:w', sources: [Object.keys(wA.vertices)[0], Object.keys(wB.vertices)[0]] }],
}).shape;
const clsWedge = classifyForm(wedge, null);
check('two tori pinched at a vertex REFUSE: the committed link gate names the pinch vertex',
  !clsWedge.ok && (clsWedge.junctionVertexIds ?? []).includes('pinch:w'));
const cA = torusRep('c3A');
const cB = torusRep('c3B');
const cC = torusRep('c3C');
const chain3 = assemble([cA, cB, cC], {
  merges: [
    { resultId: 'pinch:1', sources: [Object.keys(cA.vertices)[0], Object.keys(cB.vertices)[0]] },
    { resultId: 'pinch:2', sources: [Object.keys(cB.vertices)[5], Object.keys(cC.vertices)[0]] },
  ],
}).shape;
check('the EVEN-χ wedge chain (three tori, χ=−2 — arithmetic alone would fabricate "genus 2") REFUSES via the gate',
  measure(chain3).chi === -2 && !classifyForm(chain3, null).ok);
// disconnected — per-component bodies
const union = assemble([torusRep('uA'), torusRep('uB')], { merges: [] }).shape;
const mU = buildClassBodyModel(union, null);
check('a DISCONNECTED form classifies PER COMPONENT: two genus-1 components, two bodies, offset apart',
  mU.components.length === 2 && mU.components.every((c) => c.label === 'genus 1') &&
  mU.components[0].offset[0] !== mU.components[1].offset[0]);
check('each component body carries its OWN committed generators (2 + 2) and H₁ reads the direct sum ℤ⁴',
  mU.components.every((c) => c.optionB.generators.length === 2) && mU.h1Label === 'ℤ ⊕ ℤ ⊕ ℤ ⊕ ℤ');
const bodiesDisjoint = Object.keys(mU.components[0].body.vertices).every(
  (id) => !(id in mU.components[1].body.vertices),
);
check('the two bodies are fully id-disjoint (per-component namespaces)', bodiesDisjoint);
// un-certified: a word-born quotient with NO parent to replay
const orphan = classifyForm(bornN3, null);
check('an ORPHANED quotient (no parent to replay) refuses honestly: no faithful complex, no class claimed',
  !orphan.ok && orphan.reason.includes('no faithful complex'));

// ===== [g] the guard is real ====================================================
console.log('\n----- [g] the self-certification guard fires -----');
const g2body = buildClassBody({ kind: 'orientable', g: 2, b: 0, chi: -2, b1: 4 }, 'diag-guard');
let wrongGenus = false;
try {
  assertBodyCertifiesToClass(g2body, { kind: 'orientable', g: 3, b: 0, chi: -4, b1: 6 });
} catch (e) {
  wrongGenus = e.message.includes('does not self-certify');
}
check('a genus-2 body handed a genus-3 claim REFUSES ("a body that does not self-certify to its class is a lie")', wrongGenus);
let wrongKind = false;
try {
  assertBodyCertifiesToClass(g2body, { kind: 'non-orientable', k: 2, b: 0, chi: 0, b1: 2 });
} catch {
  wrongKind = true;
}
check('…and handed an N₂ claim REFUSES', wrongKind);
const bodiesSource = fs.readFileSync(path.join(repoRoot, 'src/manuscript/standardBodies.ts'), 'utf8');
const dispatch = bodiesSource.slice(bodiesSource.indexOf('export function buildClassBody'));
check('structurally: EVERY buildClassBody dispatch ends in assertBodyCertifiesToClass (the guard is wired, not decorative)',
  dispatch.includes('assertBodyCertifiesToClass(body, cls)'));

// ===== [h] the view path — the Q-M2 chain payoff ================================
console.log('\n----- [h] the manuscript path: the chained birth renders (it used to throw) -----');
const invoked = invokePrimitive('square', 90);
const first = applyPlaygroundOperationTo('glue-cylinder', invoked.shape, null, 91, 8);
check('square → glue-cylinder: the committed registry births the v0 cylinder (immersion render)',
  first.ok && first.born.render.mode === 'immersion');
const chained = applyPlaygroundOperationTo('glue-torus', first.born.shape, invoked.shape, 92, 8);
check('CHAINED glue-torus on the born quotient face (the Q-M2 composed word) now renders a classBody',
  chained.ok && chained.born.render.mode === 'classBody');
if (chained.ok && chained.born.render.mode === 'classBody') {
  const cm = chained.born.render.model;
  check('the chained form is the composed-word genus-1: recovered · 2 committed generators · H₁ = ℤ ⊕ ℤ',
    cm.complexSource === 'recovered' && cm.components[0].label === 'genus 1' &&
    cm.components[0].optionB.generators.length === 2 && cm.h1Label === 'ℤ ⊕ ℤ');
  check('the born title carries the honest class ("genus 1 — born")', chained.born.title === 'genus 1 — born');
} else {
  check('the chained form is the composed-word genus-1', false);
  check('the born title carries the honest class', false);
}

// ===== [i] byte-guards ==========================================================
console.log('\n----- [i] no-regression: the committed instruments are byte-unchanged -----');
// THE ENGINE FREEZE MANIFEST (engineer-chartered 2026-07-12): the old
// per-diagnostic HEAD-differential guard REQUIRED A HOLE IN ITSELF to permit
// any sanctioned change (a carve-out — silent, and permanent unless a human
// remembered; `playgroundOperations.ts` ended up guarded by NOBODY, and this
// guard alone had accumulated FOUR carve-out disclosures). The engine is now
// frozen by ONE on-repo manifest of content hashes
// (docs/governance/ENGINE_FREEZE_MANIFEST.txt): a sanctioned change is a
// one-line hash update in the SAME commit, and coverage never lapses. The
// shared checker READS the manifest and can never write it.
const { checkEngineFreeze } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));
const freeze = checkEngineFreeze();
// 27 → 44 (2026-07-14, THE SMALL RUN): the freeze closed under imports — a
// frozen file is only as frozen as its dependencies; src/types joined the scan.
check('THE ENGINE FREEZE MANIFEST: all 45 frozen engine files (import-closed) match their manifest hashes and every source file under the engine roots is classified — drifted [] · missing [] · unlisted []',
  freeze.ok === true && freeze.checked === 46 &&
  freeze.drifted.length === 0 && freeze.missing.length === 0 && freeze.unlisted.length === 0);
if (!freeze.ok) note(`drifted: [${freeze.drifted}] · missing: [${freeze.missing}] · unlisted: [${freeze.unlisted}]`);
// THE FREEZE CHECK STILL BITES (stub-proof — a checker that cannot fail is dead):
const FREEZE_SENTINEL = 'src/lib/incidenceTraceRegistry.ts'; // the very file that once cried wolf
const sentinelContent = fs.readFileSync(path.join(repoRoot, FREEZE_SENTINEL), 'utf8');
const sentinelFlipped = sentinelContent.slice(0, 100) + (sentinelContent[100] === 'X' ? 'Y' : 'X') + sentinelContent.slice(101);
const freezeBite = checkEngineFreeze({ overrides: { [FREEZE_SENTINEL]: sentinelFlipped } });
const freezeCrlf = checkEngineFreeze({ overrides: { [FREEZE_SENTINEL]: sentinelContent.replace(/\r/g, '').replace(/\n/g, '\r\n') } });
check('…and the freeze check still BITES: a one-character in-memory mutation of the sentinel FAILS it (exactly that file drifts) while the CRLF re-expression PASSES (CR-insensitive — no false wolf)',
  freezeBite.ok === false && freezeBite.drifted.length === 1 && freezeBite.drifted[0] === FREEZE_SENTINEL &&
  freezeCrlf.ok === true);
check('the splitter sees ONE component on every closed body above (sanity of the component machinery)',
  splitComplexComponents(acquireFaithfulComplex(fc.body, null).complex).length === 1 &&
  splitComplexComponents(acquireFaithfulComplex(n3c.body, null).complex).length === 1);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

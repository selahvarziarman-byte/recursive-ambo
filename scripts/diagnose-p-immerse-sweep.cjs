#!/usr/bin/env node

// DIAGNOSTIC — P-IMMERSE FLAG SWEEP: two faithfulness leaks killed + one doc
// trap defused (engineer-chartered on the P-IMMERSE report's own §6 flags;
// sanctioned edits to two previously byte-guarded committed modules — the
// diagnose-p-immerse §i guard list is updated accordingly).
//
//   §a THE IMMERSION LIE IS DEAD — `classifyGluingWord` now claims ONLY its
//      PROVABLE domain. The TWO-PAIR claim is 4-gon-only: the
//      2-preserving-pair HEXAGON (a BOUNDED genus-1, b=1, by the
//      boundary-circle counter) used to map to the CLOSED torus immersion;
//      it now ABSTAINS (null) and falls through to the generic classifier,
//      which reads the TRUE class — and so do the klein/rp2-shaped hexagon
//      2-pair words. The SINGLE-PAIR claim is KEPT for any even n: one
//      identified pair of disjoint boundary arcs on a disk IS an
//      annulus/möbius whatever the polygon — the C1/C2-RATIFIED generalized
//      open-surface path (diagnose-op-set-completion verifies it per birth
//      on a 6-gon), a truth the narrowing must not delete. The six committed
//      4-gon routes behave byte-identically (all five worded registry births
//      + the collapse still take their committed immersions).
//   §b THE FALSE CARD IS DEAD — `readFormInvariants.classification` is
//      connectivity-aware: a DISCONNECTED complex (two disjoint tori, χ=0,
//      which used to read "genus 1 (closed, orientable)") now reads the
//      honest "n-a (disconnected — N components; classify per component)".
//      A battery of CONNECTED forms classifies byte-identically to before;
//      every other readout field (χ, cert, boundary) is untouched even on
//      disconnected forms.
//   §c THE MODE DOC TRAP — `FacePairing.mode` now documents what the §e
//      probe measured: the `map` drives the topology; the label does not by
//      itself reverse anything (translation map + 'reversing' label = the
//      SAME manifold; a genuinely reversing pairing needs a REFLECTED map).
//      Asserted from the source AND re-measured through the committed tower.
//   §d THE SWEEP IS REAL — the three seams CARRY their edits
//      (content-asserted, so the check holds before AND after the commit —
//      a working-tree `git diff` check would invert the moment Arman
//      commits); the P-IMMERSE §i guard list no longer pins the sanctioned
//      files (asserted from the diagnostic's own source).
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
const { applyPlaygroundOperationTo, invokePrimitive, routeWrittenRender } = req('src/manuscript/writtenFormModel.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { readSeedCell, flipGlueFaces, glueFaces } = req('src/lib/faceIdentification.ts');
const { level3InvariantTower } = req('src/lib/level3Invariants.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const P = (a, b, m) => ({ edgeA: a, edgeB: b, mode: m });
const copyOf = (shape, prefix) => deserializeSnapshot(serializeSnapshot(shape, prefix)).shape;
const torusRep = (prefix) => copyOf(immerseSurface({ surface: 'torus', resolution: 4 }).shape, prefix);

console.log('P-IMMERSE flag sweep: two lies become refusals; one label stops posing as math\n');

// ===== [a] the v0 map claims only its provable 4-gon domain =====================
console.log('----- [a] classifyGluingWord: narrowed to its provable domain (the immersion lie is dead) -----');
check('the 2-preserving-pair HEXAGON word now ABSTAINS (it used to return "torus" — a closed immersion for a bounded form)',
  classifyGluingWord([P(0, 3, 'preserving'), P(1, 4, 'preserving')], 6) === null);
check('every 2-pair hexagon mode combo abstains (klein- and rp2-shaped hexagon words were the same lie)',
  classifyGluingWord([P(0, 3, 'preserving'), P(1, 4, 'reversing')], 6) === null &&
  classifyGluingWord([P(0, 3, 'reversing'), P(1, 4, 'reversing')], 6) === null &&
  classifyGluingWord([P(0, 4, 'preserving'), P(1, 5, 'preserving')], 8) === null);
check('the RATIFIED single-pair open path is KEPT (one identified pair on any even n-gon IS an annulus/möbius — the C1/C2 generalized route, verified per birth in diagnose-op-set-completion)',
  classifyGluingWord([P(0, 3, 'preserving')], 6) === 'cylinder' &&
  classifyGluingWord([P(0, 3, 'reversing')], 6) === 'mobius' &&
  classifyGluingWord([P(0, 4, 'preserving')], 8) === 'cylinder');
const hexB = loadForm(nGon(6), 'swpHex');
const bornB = executeCustomGlue(hexB, hexB.faces[0], [P(0, 3, 'preserving'), P(1, 4, 'preserving')]);
const routeKind = routeBornForm(bornB, hexB).kind;
check('the born 2-pair hexagon does NOT route to an immersion (the replay verifies, the map abstains → patch fallback)',
  routeKind !== 'immersion' && routeKind === 'patch');
const renderB = routeWrittenRender(bornB, hexB, 8);
check('…and falls through to the generic classifier: a CLASS BODY reading the TRUE class — bounded genus-1, b=1 (the counter decides)',
  renderB.mode === 'classBody' &&
  eq(renderB.model.components[0].class, { kind: 'orientable', g: 1, b: 1, chi: -1, b1: 2 }));
note(`the hexagon's honest reading: "${renderB.mode === 'classBody' ? renderB.model.components[0].label : '—'}" (was: the torus immersion)`);
// the committed 4-gon domain is byte-identical in behavior
check('the 4-gon word map is UNCHANGED: cylinder · möbius · torus · klein · rp2',
  classifyGluingWord([P(0, 2, 'preserving')], 4) === 'cylinder' &&
  classifyGluingWord([P(0, 2, 'reversing')], 4) === 'mobius' &&
  classifyGluingWord([P(0, 2, 'preserving'), P(1, 3, 'preserving')], 4) === 'torus' &&
  classifyGluingWord([P(0, 2, 'preserving'), P(1, 3, 'reversing')], 4) === 'klein' &&
  classifyGluingWord([P(0, 2, 'reversing'), P(1, 3, 'reversing')], 4) === 'rp2');
const V0_OPS = [
  ['glue-cylinder', 'cylinder'],
  ['glue-torus', 'torus'],
  ['flip-glue-klein', 'klein'],
  ['flip-glue', 'rp2'],
  ['flip-glue-mobius', 'mobius'],
  ['collapse-sphere', 'sphere'],
];
let seq = 300;
const v0Routes = V0_OPS.map(([opId, expected]) => {
  const square = invokePrimitive('square', (seq += 1));
  const born = applyPlaygroundOperationTo(opId, square.shape, null, (seq += 1), 8);
  return {
    opId,
    expected,
    ok: born.ok && born.born.render.mode === 'immersion' && born.born.render.model.surface === expected,
  };
});
check('all six committed v0 births still take their committed immersions (registry end-to-end, byte-identical behavior)',
  v0Routes.every((r) => r.ok));
note(v0Routes.map((r) => `${r.opId}→${r.expected}${r.ok ? '' : ' (FAILED)'}`).join(' · '));

// ===== [b] the classification string is connectivity-aware ======================
console.log('\n----- [b] readFormInvariants.classification: disconnected forms stop lying -----');
const union2 = assemble([torusRep('swU1'), torusRep('swU2')], { merges: [] }).shape;
const u2 = readFormInvariants(union2);
check('two disjoint tori (χ=0) no longer read "genus 1": the honest disconnected refusal, component count named',
  u2.classification === 'n-a (disconnected — 2 components; classify per component)' &&
  !u2.classification.includes('genus'));
check('…and every OTHER field of the readout is untouched by the fix (χ=0 certified, b₁=4, boundary closed, direct)',
  u2.chi === 0 && u2.chiCertified === 0 && u2.cert.b1 === 4 && u2.boundary === 'closed' && u2.complexSource === 'direct');
const union3 = assemble([torusRep('swV1'), torusRep('swV2'), torusRep('swV3')], { merges: [] }).shape;
check('the component count is MEASURED, not hardcoded: three disjoint tori name 3 components',
  readFormInvariants(union3).classification === 'n-a (disconnected — 3 components; classify per component)');
// the connected battery — byte-identical committed strings
const sqK = loadForm(nGon(4), 'swK');
const hexN3 = loadForm(nGon(6), 'swN3');
const bornN3 = executeCustomGlue(hexN3, hexN3.faces[0], [P(0, 1, 'reversing'), P(2, 3, 'reversing'), P(4, 5, 'reversing')]);
const tCut = torusRep('swCut');
const cut = materializeCutResult(tCut, cutCell(tCut, tCut.faces[5]));
const skeleton = materializeCutResult(loadForm(nGon(12), 'swSk'), cutCell(loadForm(nGon(12), 'swSk'), loadForm(nGon(12), 'swSk').faces[0]));
const book = loadForm(() => ({
  name: 'book3',
  vertices: [
    { id: 'A', position: [0, -1, 0] }, { id: 'B', position: [0, 1, 0] },
    { id: 'p1', position: [1.4, 0, 0] }, { id: 'p2', position: [-0.7, 0, 1.2] }, { id: 'p3', position: [-0.7, 0, -1.2] },
  ],
  faces: [{ vertexIds: ['A', 'B', 'p1'] }, { vertexIds: ['A', 'B', 'p2'] }, { vertexIds: ['A', 'B', 'p3'] }],
}), 'swBk');
const battery = [
  ['torus rep', readFormInvariants(torusRep('swT')), 'genus 1 (closed, orientable)'],
  ['connectedSum(T²,T²)', readFormInvariants(connectedSum(torusRep('swA'), torusRep('swB')).shape), 'genus 2 (closed, orientable)'],
  ['sphere immersion', readFormInvariants(immerseSurface({ surface: 'sphere', resolution: 6 }).shape), 'genus 0 (closed, orientable)'],
  ['klein immersion', readFormInvariants(immerseSurface({ surface: 'klein', resolution: 6 }).shape), 'cross-caps 2 (closed, non-orientable)'],
  ['rp2 immersion', readFormInvariants(immerseSurface({ surface: 'rp2', resolution: 6 }).shape), 'cross-caps 1 (closed, non-orientable)'],
  ['recovered N₃ hexagon', readFormInvariants(bornN3, hexN3), 'cross-caps 3 (closed, non-orientable)'],
  ['cylinder immersion', readFormInvariants(immerseSurface({ surface: 'cylinder', resolution: 6 }).shape), 'open / n-a'],
  ['möbius immersion', readFormInvariants(immerseSurface({ surface: 'mobius', resolution: 6 }).shape), 'open / n-a'],
  ['punctured torus', readFormInvariants(cut), 'open / n-a'],
  ['3-page book', readFormInvariants(book), 'n-a (non-manifold edge incidence)'],
  ['cut-born skeleton', readFormInvariants(skeleton), 'n-a (no 2-cells — not a surface complex)'],
  ['orphaned quotient', readFormInvariants(executeCustomGlue(sqK, sqK.faces[0], [P(0, 2, 'preserving'), P(1, 3, 'preserving')])), 'n-a (no faithful complex — w₁/b₁ un-certified)'],
];
const batteryBad = battery.filter(([, readout, expected]) => readout.classification !== expected);
check('the CONNECTED battery classifies byte-identically (closed genus/k · open · non-manifold · skeleton · un-certified — 12 pins)',
  batteryBad.length === 0);
if (batteryBad.length) note(`moved: ${batteryBad.map(([name, r, e]) => `${name}: "${r.classification}" ≠ "${e}"`).join(' | ')}`);

// ===== [c] the FacePairing.mode doc line ========================================
console.log('\n----- [c] the mode label documents what the map does -----');
const fiSource = fs.readFileSync(path.join(repoRoot, 'src/lib/faceIdentification.ts'), 'utf8');
const modeDocRegion = fiSource.slice(fiSource.indexOf('export interface FacePairing'), fiSource.indexOf("mode: 'preserving' | 'reversing'"));
check('FacePairing.mode carries the doc line at its type definition: the map drives the topology; the label reverses nothing by itself; a reversing pairing needs a REFLECTED map',
  modeDocRegion.includes('the TOPOLOGY is determined by') &&
  modeDocRegion.includes('does') && modeDocRegion.includes('NOT by itself reverse') &&
  modeDocRegion.includes('REFLECTED `map`'));
// the measured basis, re-asserted through the committed tower: same cube, same
// translation maps — 'reversing' label alone changes NOTHING; a reflected map does
const cubeShape = createSeedShape('cube');
const cube = readSeedCell(cubeShape);
const at = (id) => cubeShape.vertices[id].position;
const face = (key) => cube.faces.find((f) => f.id === `face:cube:${key}`);
const near = (x, y) => Math.abs(x - y) < 1e-9;
const mapBy = (fA, fB, ok) => {
  const map = {};
  for (const a of fA.cycle) map[a] = fB.cycle.find((b) => ok(at(a), at(b)));
  return map;
};
const translation = (axis) => (pa, pb) => [0, 1, 2].every((ax) => ax === axis || near(pa[ax], pb[ax]));
const basePairs = [
  { faceA: face('left').id, faceB: face('right').id, map: mapBy(face('left'), face('right'), translation(0)) },
  { faceA: face('front').id, faceB: face('back').id, map: mapBy(face('front'), face('back'), translation(1)) },
  { faceA: face('bottom').id, faceB: face('top').id, map: mapBy(face('bottom'), face('top'), translation(2)) },
];
const allPreserving = glueFaces(cube, basePairs.map((p) => ({ ...p, mode: 'preserving' })));
const labelOnly = flipGlueFaces(cube, basePairs.map((p, k) => ({ ...p, mode: k === 0 ? 'reversing' : 'preserving' })));
const reflected = flipGlueFaces(cube, [
  { faceA: face('left').id, faceB: face('right').id, mode: 'reversing', map: mapBy(face('left'), face('right'), (pa, pb) => near(pa[1], pb[1]) && near(pa[2], -pb[2])) },
  { ...basePairs[1], mode: 'preserving' },
  { ...basePairs[2], mode: 'preserving' },
]);
const tPres = level3InvariantTower(allPreserving);
const tLabel = level3InvariantTower(labelOnly);
const tRefl = level3InvariantTower(reflected);
check('measured: a "reversing" LABEL over the SAME translation map yields the SAME manifold as all-preserving (orientable, H₁=Z³ — the label reversed nothing)',
  tPres.orientable && tLabel.orientable &&
  tPres.homology.H1.pretty === 'Z^3' && tLabel.homology.H1.pretty === 'Z^3' &&
  eq(labelOnly.counts, allPreserving.counts));
check('measured: the REFLECTED map is what actually reverses (non-orientable, H₁ = Z² ⊕ Z/2, sound)',
  tRefl.sound && !tRefl.orientable && tRefl.homology.H1.pretty === 'Z^2 ⊕ Z/2');

// ===== [d] the sweep is real (guard bookkeeping) ================================
console.log('\n----- [d] the sanctioned edits are real; the guard list reflects them -----');
// content-asserted (NOT a working-tree git check, which would invert the moment
// the set is committed): each seam carries its sweep edit verbatim.
const fiSrc = fs.readFileSync(path.join(repoRoot, 'src/playground/formInvariants.ts'), 'utf8');
const bfrSrc = fs.readFileSync(path.join(repoRoot, 'src/playground/bornFormRouting.ts'), 'utf8');
check('the three seams CARRY their edits: the disconnected refusal branch (formInvariants), the 4-gon-only two-pair guard (bornFormRouting), the mode doc line (§c asserted it on faceIdentification)',
  fiSrc.includes('disconnected — ${components} components; classify per component') &&
  bfrSrc.includes('pairings.length === 2 && n === 4') &&
  modeDocRegion.includes('the TOPOLOGY is determined by'));
const immerseDiag = fs.readFileSync(path.join(repoRoot, 'scripts/diagnose-p-immerse.cjs'), 'utf8');
check('the diagnose-p-immerse §i byte-guard no longer pins the two sanctioned files (and says why)',
  !immerseDiag.includes("'src/playground/formInvariants.ts',") &&
  !immerseDiag.includes("'src/playground/bornFormRouting.ts',") &&
  immerseDiag.includes('LEFT this guard'));

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

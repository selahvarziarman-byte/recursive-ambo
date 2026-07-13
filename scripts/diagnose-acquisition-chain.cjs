#!/usr/bin/env node

// DIAGNOSTIC — the ACQUISITION CHAIN (mothership-required; SEAL-BEFORE-BUILD).
// BUILT BLIND to `.handoff/SEAL_ACQUISITION_CHAIN.md` — every pin below is the
// builder's own measured concrete; the engineer unseals and audits.
//
// THE FIXTURE IS DELIBERATELY TRAP-SENSITIVE (the mandate's condition): the
// sewn torus below is built with a ROTATED seam correspondence that co-merges
// the two rim vertices adjacent to the same middle-ring vertex — so both of
// that vertex's vertical edges join ONE merged vertex: PARALLEL edge classes.
// The committed direct bridge REFUSES parallel classes (correctly — a Face is
// a vertex cycle and cannot express them), so this form and every child of it
// is UNREADABLE without the chain. An unwired chain cannot pass this test.
//
//   §a THE SEWN CHILD IS NOT DIRECT-ACQUIRABLE — the committed bridge refuses
//      it, naming the parallel class; with no ancestry the certifier reads
//      the honest "no faithful complex" (the direct route did NOT loosen —
//      the bridge's refusals stand, byte-unchanged).
//   §b THE CHAIN ACQUIRES IT ANYWAY — source 'identified' (the identify
//      replay recovery); it certifies through the committed certifiers:
//      {V:8, E:16, F:8}, χ=0, w₁=0, b₁=2, orientable, gate manifold — the
//      certifier's own classification: "genus 1 (closed, orientable)".
//   §c IT CAN BE OPERATED ON — `cut` it: the child resolves 'cut-derived'
//      THROUGH the parent's identify recovery (the chain across generations);
//      readout: χ=−1, b₁=2, open.
//   §d ★ THE PROMISE — a second (vertex-disjoint) cut exposes two boundary
//      circles; the sewn form's grandchild is RE-SEWN. The op RUNS at
//      generation depth 4 (tube → sewn → cut → cut → re-sewn), the committed
//      gate judges (manifold PASS, 0 free), and the certifier reports:
//      preserving → χ=−2, w₁=0, b₁=4 ("genus 2"); reversing → χ=−2, w₁=1,
//      b₁=4 ("4 cross-caps"). The ledger's pull-back descends through every
//      generation to the original tube's 12 vertex sites.
//   §e no-regression — the committed bridge, certifiers, gate, ledger, word
//      ops: byte-unchanged (CR-insensitively); the one-hop registry limit
//      reads honestly.
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

const {
  identify,
  sewBoundaryCircles,
  walkBoundaryCircles,
  acquireComplex,
} = req('src/lib/complexIdentification.ts');
const { toAssembledComplex } = req('src/manuscript/inkedFormModel.ts');
const { analyzeGlobalW1 } = req('src/lib/globalW1.ts');
const { loadForm } = req('src/lib/multiform.ts');
const { cutCell } = req('src/lib/cutOperation.ts');
const { materializeCutResult } = req('src/lib/materializeOperation.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');
const { classifyComplexComponent, classLabel, acquireFaithfulComplex } = req('src/manuscript/surfaceClassifier.ts');
const { getPlaygroundOperation } = req('src/playground/playgroundOperations.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const bridgeRefusal = (shape) => {
  try {
    toAssembledComplex(shape);
    return null;
  } catch (error) {
    return error.message;
  }
};

console.log('acquisition chain: a sewn form is sew-able — the thread runs all the way down (blind concretes)\n');

// ===== the fixture ==============================================================
const tube = loadForm(() => {
  const ring = (name, y) => [0, 1, 2, 3].map((i) => ({
    id: `${name}${i}`,
    position: [Math.cos((i * Math.PI) / 2), y, Math.sin((i * Math.PI) / 2)],
  }));
  return {
    name: 'tube4x2',
    vertices: [...ring('a', 0), ...ring('b', 1), ...ring('c', 2)],
    faces: [
      ...[0, 1, 2, 3].map((i) => ({ vertexIds: [`a${i}`, `a${(i + 1) % 4}`, `b${(i + 1) % 4}`, `b${i}`] })),
      ...[0, 1, 2, 3].map((i) => ({ vertexIds: [`b${i}`, `b${(i + 1) % 4}`, `c${(i + 1) % 4}`, `c${i}`] })),
    ],
  };
}, 'tb42');
check('fixture: the 4×2 tube {V:12, E:20, F:8}, χ=0, an annulus (b₁=1), two 4-edge boundary circles',
  Object.keys(tube.vertices).length === 12 && tube.edges.length === 20 && tube.faces.length === 8 &&
  readFormInvariants(tube).classification === 'open / n-a' && readFormInvariants(tube).cert.b1 === 1 &&
  (() => {
    const circles = walkBoundaryCircles(toAssembledComplex(tube));
    return circles !== null && circles.length === 2 && circles.every((c) => c.edgeIds.length === 4);
  })());
// the TRAP-SENSITIVE sew: rotate the reversed rim walk so the seam co-merges
// the two rim vertices over each middle-ring vertex → PARALLEL vertical classes
const circles = walkBoundaryCircles(toAssembledComplex(tube));
const rotate = (arr, k) => arr.map((_x, i) => arr[(i + k) % arr.length]);
const S1r = identify(tube, circles[0].edgeIds, rotate([...circles[1].edgeIds].reverse(), 3), 'preserving');
const S1 = S1r.shape;

// ===== [a] the sewn child is NOT direct-acquirable ==============================
console.log('----- [a] the committed bridge refuses the sewn child (and is RIGHT to) -----');
const refusal = bridgeRefusal(S1);
check('the committed bridge EXPLICITLY refuses the sewn torus, naming the parallel class (a Face is a vertex cycle — it cannot express two classes on one endpoint pair)',
  typeof refusal === 'string' && refusal.includes('parallel edge class'));
note(`bridge: "${refusal}"`);
check('the sew itself was SOUND (gate manifold PASS — the refusal is representational, not topological)',
  S1r.gate.manifold === true && S1r.gate.freeEdgeIds.length === 0);
const noAncestry = readFormInvariants(S1);
check('with NO ancestry the certifier stays honest: complexSource null, "n-a (no faithful complex — w₁/b₁ un-certified)" — the direct route did NOT loosen',
  noAncestry.complexSource === null && noAncestry.classification === 'n-a (no faithful complex — w₁/b₁ un-certified)');
check('acquireComplex without ancestry also refuses (null) — the chain never invents a parent', acquireComplex(S1) === null);

// ===== [b] the chain acquires it anyway =========================================
console.log('\n----- [b] the chain acquires and the committed certifiers certify -----');
const acq1 = acquireComplex(S1, tube);
check("acquireComplex(S1, tube) resolves via the IDENTIFY replay recovery (source 'identified')",
  acq1 !== null && acq1.source === 'identified');
const cert1 = analyzeGlobalW1(acq1.complex);
const cls1 = classifyComplexComponent(acq1.complex);
check('the chained complex certifies: {V:8, E:16, F:8}, χ=0, w₁=0, b₁=2, orientable — "genus 1" (THE TORUS)',
  Object.keys(S1.vertices).length === 8 && acq1.complex.edges.length === 16 && acq1.complex.faces.length === 8 &&
  cert1.debug.euler === 0 && !cert1.cert.nonOrientable && cert1.cert.b1 === 2 &&
  cls1.ok && classLabel(cls1.class) === 'genus 1');
const inv1 = readFormInvariants(S1, tube);
check('readFormInvariants(S1, tube): the chain feeds the committed readout — source \'recovered\', "genus 1 (closed, orientable)"',
  inv1.complexSource === 'recovered' && inv1.classification === 'genus 1 (closed, orientable)' && inv1.chiCertified === 0);
check('the classifier acquisition agrees (acquireFaithfulComplex → recovered)',
  (() => {
    const a = acquireFaithfulComplex(S1, tube);
    return a !== null && a.source === 'recovered' && eq(a.complex, acq1.complex);
  })());

// ===== [c] it can be OPERATED on — cut, resolved through the parent's recovery ==
console.log('\n----- [c] cut the sewn form: the child resolves through the parent\'s recovery -----');
const missing1 = S1.faces[0];
const C1 = materializeCutResult(S1, cutCell(S1, missing1));
check('the cut child is STILL bridge-refused (the parallel classes ride along) — only the chain can read it',
  typeof bridgeRefusal(C1) === 'string' && bridgeRefusal(C1).includes('parallel edge class'));
const acqC1 = acquireComplex(C1, [S1, tube]);
check("acquireComplex(C1, [S1, tube]) resolves 'cut-derived' — the parent's complex recovered by identify-replay, the removed face dropped at its index (the chain ACROSS generations)",
  acqC1 !== null && acqC1.source === 'cut-derived' && acqC1.complex.faces.length === 7);
const invC1 = readFormInvariants(C1, [S1, tube]);
check('the child\'s readout: χ=−1, b₁=2, boundary open — the punctured torus, certified through the chain',
  invC1.complexSource === 'recovered' && invC1.chiCertified === -1 && invC1.cert.b1 === 2 &&
  invC1.boundary === 'open' && invC1.classification === 'open / n-a' && C1.genealogy.generationDepth === 2);

// ===== [d] ★ THE PROMISE: a form born of identify is RE-identified ==============
console.log('\n----- [d] ★ the re-sew: forms beget forms with no last generation -----');
const disjoint = C1.faces.find((f) => f.vertexIds.every((v) => !missing1.vertexIds.includes(v)));
const C2 = materializeCutResult(C1, cutCell(C1, disjoint));
check('the second cut (a vertex-disjoint face) exposes TWO boundary circles at generation 3, chain-resolved',
  Boolean(disjoint) && C2.genealogy.generationDepth === 3 &&
  (() => {
    const a = acquireComplex(C2, [C1, S1, tube]);
    if (!a || a.source !== 'cut-derived') return false;
    const walked = walkBoundaryCircles(a.complex);
    return walked !== null && walked.length === 2;
  })());
const invC2 = readFormInvariants(C2, [C1, S1, tube]);
check('…and reads honestly through the chain: χ=−2, b₁=3, open',
  invC2.complexSource === 'recovered' && invC2.chiCertified === -2 && invC2.cert.b1 === 3);
const resewn = {};
for (const mode of ['preserving', 'reversing']) {
  let result = null;
  let threw = null;
  try {
    result = sewBoundaryCircles(C2, mode, 0, 1, [C1, S1, tube]);
  } catch (error) {
    threw = error.message;
  }
  resewn[mode] = result;
  check(`RE-SEW (${mode}): the op RUNS — no refusal for want of a complex at any generation`,
    threw === null && result !== null);
  if (threw) note(`threw: ${threw}`);
}
const g2 = resewn.preserving;
const certG2 = analyzeGlobalW1(g2.complex);
const clsG2 = classifyComplexComponent(g2.complex);
check('the committed gate judges the preserving re-sew: manifold PASS, 0 free — and the certifier reports χ=−2, w₁=0, b₁=4: "genus 2"',
  g2.gate.manifold === true && g2.gate.freeEdgeIds.length === 0 &&
  certG2.debug.euler === -2 && !certG2.cert.nonOrientable && certG2.cert.b1 === 4 &&
  clsG2.ok && classLabel(clsG2.class) === 'genus 2');
const k4 = resewn.reversing;
const certK4 = analyzeGlobalW1(k4.complex);
const clsK4 = classifyComplexComponent(k4.complex);
check('…and the reversing re-sew: manifold PASS — χ=−2, w₁=1, b₁=4: "4 cross-caps" (the non-separating seam still bites at generation 4)',
  k4.gate.manifold === true && certK4.debug.euler === -2 && certK4.cert.nonOrientable && certK4.cert.b1 === 4 &&
  clsK4.ok && classLabel(clsK4.class) === '4 cross-caps');
check('the generation depth is what the chain implies: tube(0) → sewn(1) → cut(2) → cut(3) → RE-SEWN(4)',
  g2.shape.genealogy.generationDepth === 4 && k4.shape.genealogy.generationDepth === 4);
// the ledger descends through every generation to the original fixture's sites
const walkToRoots = (shape, id, ancestors) => {
  const vertex = shape.vertices[id];
  if (!vertex || vertex.createdBy.sourceVertexIds.length === 0) return [id];
  return vertex.createdBy.sourceVertexIds.flatMap((src) => {
    for (const ancestor of ancestors) {
      if (ancestor.vertices[src]) return walkToRoots(ancestor, src, ancestors);
    }
    return [src];
  });
};
const roots = new Set(
  Object.keys(g2.shape.vertices).flatMap((id) => walkToRoots(g2.shape, id, [C2, C1, S1, tube])),
);
check('the ledger\'s pull-back DESCENDS through every generation: all 12 of the original tube\'s vertex sites are reached, and the seam merges carry ≥2 sources',
  roots.size === 12 && [...roots].every((r) => r.startsWith('tb42:')) &&
  Object.values(g2.ledger.pullBack).filter((sources) => sources.length >= 2).length === 4);

// ===== [e] no-regression + the honest one-hop limit ============================
console.log('\n----- [e] no-regression: the bridge stands; the guarded set is unchanged -----');
const sewOp = getPlaygroundOperation('sew-boundary-preserving');
check('the registry\'s one-hop context refuses HONESTLY at depth 3 (only the direct parent rides the context — the deeper ancestry is the model callers\' to pass)',
  sewOp.canApply({ form: C2, selectedFaceId: null, selectedFace: null, parentShape: C1 }) === false &&
  String(sewOp.getDisabledReason({ form: C2, selectedFaceId: null, selectedFace: null, parentShape: C1 })).includes('ancestry'));
// THE ENGINE FREEZE MANIFEST (engineer-chartered 2026-07-12): the old
// per-diagnostic HEAD-differential guard REQUIRED A HOLE IN ITSELF to permit
// any sanctioned change (a carve-out — silent, and permanent unless a human
// remembered; `playgroundOperations.ts` ended up guarded by NOBODY). The
// engine is now frozen by ONE on-repo manifest of content hashes
// (docs/governance/ENGINE_FREEZE_MANIFEST.txt): a sanctioned change is a
// one-line hash update in the SAME commit, and coverage never lapses. The
// shared checker READS the manifest and can never write it.
const { checkEngineFreeze } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));
const freeze = checkEngineFreeze();
check('THE ENGINE FREEZE MANIFEST: all 27 frozen engine files match their manifest hashes and every source file under the engine roots is classified — drifted [] · missing [] · unlisted []',
  freeze.ok === true && freeze.checked === 27 &&
  freeze.drifted.length === 0 && freeze.missing.length === 0 && freeze.unlisted.length === 0);
if (!freeze.ok) note(`drifted: [${freeze.drifted}] · missing: [${freeze.missing}] · unlisted: [${freeze.unlisted}]`);
// THE FREEZE CHECK STILL BITES (stub-proof — a checker that cannot fail is dead):
const FREEZE_SENTINEL = 'src/lib/incidenceTraceRegistry.ts';
const sentinelContent = fs.readFileSync(path.join(repoRoot, FREEZE_SENTINEL), 'utf8');
const sentinelFlipped = sentinelContent.slice(0, 100) + (sentinelContent[100] === 'X' ? 'Y' : 'X') + sentinelContent.slice(101);
const freezeBite = checkEngineFreeze({ overrides: { [FREEZE_SENTINEL]: sentinelFlipped } });
const freezeCrlf = checkEngineFreeze({ overrides: { [FREEZE_SENTINEL]: sentinelContent.replace(/\r/g, '').replace(/\n/g, '\r\n') } });
check('…and the freeze check still BITES: a one-character in-memory mutation of the sentinel FAILS it (exactly that file drifts) while the CRLF re-expression PASSES (CR-insensitive — no false wolf)',
  freezeBite.ok === false && freezeBite.drifted.length === 1 && freezeBite.drifted[0] === FREEZE_SENTINEL &&
  freezeCrlf.ok === true);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

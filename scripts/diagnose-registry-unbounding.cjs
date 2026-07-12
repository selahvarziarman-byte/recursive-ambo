#!/usr/bin/env node

// DIAGNOSTIC — the REGISTRY UNBOUNDING (mothership-REQUIRED-NEXT;
// SEAL-BEFORE-BUILD). BUILT BLIND to `.handoff/SEAL_REGISTRY_UNBOUNDING.md` —
// every pin is the builder's own measured concrete.
//
// THE FIXTURE (trap-sensitive, per the mandate): the 8×1 tube invoked under
// source 'ub7', whose CANONICAL registry sew (deterministic anchors — the
// content-hashed edge ids fix the seam offset forever) lands the n/2
// correspondence: every pair of antipodal vertical edges merges onto the SAME
// endpoint pair — PARALLEL edge classes. The committed bridge refuses the
// sewn torus and every descendant of it, so NOTHING in this lineage is
// readable without the acquisition chain — and the chain is only reachable
// if the REGISTRY provisions the ancestry. One hop visibly fails at
// generation 2 (§a — the mandatory control).
//
//   §a ★ THE TRAP CONTROL — the generation-2 form (a CUT of the SEWN,
//      bridge-refused torus) acquired with ONLY the immediate parent:
//      REFUSES (complexSource null, "no faithful complex"). The full lineage
//      chain resolves it. Both emitted.
//   §b THE PERSON WALKS DEPTH 4 — through the REGISTRY surfaces (the store's
//      applyOperationToSelection and the manuscript's
//      applyPlaygroundOperationTo): sew → cut → cut → re-sew. Every
//      generation: the op applies (no refusal for want of a complex), the
//      child is bridge-refused AND certifies through the chain (emitted
//      readouts), and it renders (classBody / certified plain cards).
//      gen 1 "genus 1 (closed, orientable)" → gen 2 χ=−1 open → gen 3 χ=−2
//      open → gen 4 "genus 2 (closed, orientable)".
//   §c THE ANCESTRY IS REAL LINEAGE — exactly the ancestors, in order;
//      a decoy form in the lookup never appears; non-ancestors are never
//      handed to the acquisition.
//   §d TERMINATES — a crafted CYCLIC lineage resolves finitely and the
//      acquisition refuses honestly (no spin).
//   §e NO-REGRESSION — the engine (complexIdentification incl. acquireComplex,
//      the bridge, formInvariants, surfaceClassifier, certifiers, gate,
//      ledger, word ops) byte-unchanged, CR-insensitively; gen-1 contexts
//      behave identically with and without the ancestry field.
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

const { usePlaygroundStore } = req('src/store/playgroundStore.ts');
const { getPlaygroundOperation, resolveLineage } = req('src/playground/playgroundOperations.ts');
const { applyPlaygroundOperationTo, routeWrittenRender } = req('src/manuscript/writtenFormModel.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');
const { toAssembledComplex } = req('src/manuscript/inkedFormModel.ts');
const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const bridgeRefused = (shape) => {
  try {
    toAssembledComplex(shape);
    return false;
  } catch {
    return true;
  }
};

console.log('registry unbounding: the person walks as deep as the engine can (blind concretes)\n');

// ===== the fixture: the person's tube, invoked through the store ================
const tube81 = () => {
  const ring = (name, y) => [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({
    id: `${name}${i}`,
    position: [Math.cos((i * Math.PI) / 4), y, Math.sin((i * Math.PI) / 4)],
  }));
  return {
    name: 'tube8x1',
    vertices: [...ring('a', 0), ...ring('b', 1)],
    faces: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ vertexIds: [`a${i}`, `a${(i + 1) % 8}`, `b${(i + 1) % 8}`, `b${i}`] })),
  };
};
const st = () => usePlaygroundStore.getState();
st().resetPlayground();
const tube = st().invokeForm(tube81, 'ub7');
check('fixture: the 8×1 tube {V:16, E:24, F:8} — an annulus (b₁=1) with two 8-edge rims',
  Object.keys(tube.vertices).length === 16 && tube.edges.length === 24 && tube.faces.length === 8 &&
  readFormInvariants(tube).cert.b1 === 1);

// gen 1 — the person SEWS (the store surface; the canonical registry op)
st().selectForm(tube.id);
const S1 = st().applyOperationToSelection('sew-boundary-preserving');
check('gen 1: the store sew APPLIES and births the sewn torus — and its shape is BRIDGE-REFUSED (the deterministic ub7 anchors land the n/2 seam: parallel vertical classes)',
  S1.genealogy.generationDepth === 1 && S1.faces.length === 8 && bridgeRefused(S1));
const invS1 = readFormInvariants(S1, tube);
check('gen 1 certifies through the chain: {v:8, e:16, f:8}, χ=0, b₁=2 — "genus 1 (closed, orientable)", source \'recovered\'',
  invS1.cells.v === 8 && invS1.cells.e === 16 && invS1.cells.f === 8 &&
  invS1.complexSource === 'recovered' && invS1.chiCertified === 0 && invS1.cert.b1 === 2 &&
  invS1.classification === 'genus 1 (closed, orientable)');

// gen 2 — the person CUTS what they just sewed
st().selectForm(S1.id);
st().selectFace(S1.faces[0].id);
const C1 = st().applyOperationToSelection('cut');
check('gen 2: the store cut APPLIES (no refusal for want of a complex) — the child is still bridge-refused',
  C1.genealogy.generationDepth === 2 && C1.faces.length === 7 && bridgeRefused(C1));

// ===== [a] ★ THE TRAP CONTROL ===================================================
console.log('\n----- [a] ★ the one-hop control: it VISIBLY FAILS at generation 2 -----');
const oneHop = readFormInvariants(C1, S1);
check('ONE HOP (the old registry provisioning — only the immediate parent): the acquisition REFUSES — complexSource null, "no faithful complex" (cut-derivation needs the parent\'s complex, whose identify-replay needs the GRANDPARENT tube)',
  oneHop.complexSource === null && oneHop.classification === 'n-a (no faithful complex — w₁/b₁ un-certified)');
note(`one hop: src=${oneHop.complexSource} · "${oneHop.classification}"`);
const fullChain = readFormInvariants(C1, [S1, tube]);
check('THE FULL LINEAGE CHAIN resolves it: source \'recovered\', χ=−1, b₁=2, open — the punctured torus',
  fullChain.complexSource === 'recovered' && fullChain.chiCertified === -1 && fullChain.cert.b1 === 2 &&
  fullChain.boundary === 'open');
note(`full chain: src=${fullChain.complexSource} · χ=${fullChain.chiCertified}, b₁=${fullChain.cert.b1}, "${fullChain.classification}"`);
check('…and the STORE now provisions exactly that (the birth above succeeded because the store walked the real chain — the wrong mechanism could not have)',
  bridgeRefused(C1) && fullChain.complexSource === 'recovered');

// ===== [b] the person walks to depth 4 ==========================================
console.log('\n----- [b] the walk continues: cut again, then RE-SEW at depth 4 -----');
const firstRim = S1.faces[0];
st().selectForm(C1.id);
const disjointFace = C1.faces.find((f) => f.vertexIds.every((v) => !firstRim.vertexIds.includes(v)));
check('a vertex-disjoint second face exists (the ub7 seam leaves clean 4-corner faces)', Boolean(disjointFace));
st().selectFace(disjointFace.id);
const C2 = st().applyOperationToSelection('cut');
const invC2 = readFormInvariants(C2, [C1, S1, tube]);
check('gen 3: the second cut APPLIES — bridge-refused, chain-certified: χ=−2, b₁=3, open (two boundary circles exposed)',
  C2.genealogy.generationDepth === 3 && bridgeRefused(C2) &&
  invC2.complexSource === 'recovered' && invC2.chiCertified === -2 && invC2.cert.b1 === 3);
st().selectForm(C2.id);
const sewOp = getPlaygroundOperation('sew-boundary-preserving');
const storeContextForC2 = {
  form: C2,
  selectedFaceId: null,
  selectedFace: null,
  parentShape: C1,
  ancestry: resolveLineage(C2, (id) => st().forms[id]?.shape),
};
check('gen 4 PRE-CHECK: the sew op reads canApply TRUE on the registry-provisioned context (the person is offered the op, not a refusal)',
  sewOp.canApply(storeContextForC2) === true);
const S3 = st().applyOperationToSelection('sew-boundary-preserving');
const invS3 = readFormInvariants(S3, [C2, C1, S1, tube]);
check('gen 4: the RE-SEW births — depth 4 (tube→sewn→cut→cut→re-sewn), bridge-refused, and the chain certifies: χ=−2, w₁=0, b₁=4 — "genus 2 (closed, orientable)"',
  S3.genealogy.generationDepth === 4 && bridgeRefused(S3) &&
  invS3.complexSource === 'recovered' && invS3.chiCertified === -2 &&
  invS3.cert.nonOrientable === false && invS3.cert.b1 === 4 &&
  invS3.classification === 'genus 2 (closed, orientable)');
note(`gen 4: {v:${invS3.cells.v}, e:${invS3.cells.e}, f:${invS3.cells.f}} χ=${invS3.chiCertified} b₁=${invS3.cert.b1} — "${invS3.classification}"`);
check('NO "no faithful complex" anywhere on the walk (every generation certified above)',
  [invS1, fullChain, invC2, invS3].every((r) => r.complexSource === 'recovered'));

// the MANUSCRIPT surface — the same walk through applyPlaygroundOperationTo
console.log('\n----- [b′] the manuscript surface: the same depth through writtenFormModel -----');
const pageShapes = new Map([[tube.id, tube], [S1.id, S1], [C1.id, C1], [C2.id, C2]]);
const pageLookup = (id) => pageShapes.get(id);
const mResult = applyPlaygroundOperationTo(
  'sew-boundary-preserving', C2, C1, 90, 8, resolveLineage(C2, pageLookup),
);
check('the manuscript apply path re-sews the generation-3 form: ok, titled by its honest class — "genus 2 — born", rendered as a CLASS BODY',
  mResult.ok && mResult.born.title === 'genus 2 — born' &&
  mResult.born.render.mode === 'classBody' &&
  mResult.born.render.model.components[0].label === 'genus 2');
check('every generation RENDERS: the sewn torus a classBody (genus 1); the cut children plain with chain-certified cards; the re-sewn a classBody (genus 2)',
  (() => {
    const r1 = routeWrittenRender(S1, [tube], 8);
    const r2 = routeWrittenRender(C1, [S1, tube], 8);
    const r3 = routeWrittenRender(C2, [C1, S1, tube], 8);
    return (
      r1.mode === 'classBody' && r1.model.components[0].label === 'genus 1' &&
      r2.mode === 'plain' && r2.invariants.complexSource === 'recovered' && r2.invariants.chiCertified === -1 &&
      r3.mode === 'plain' && r3.invariants.complexSource === 'recovered' && r3.invariants.chiCertified === -2
    );
  })());

// ===== [c] the ancestry is REAL lineage =========================================
console.log('\n----- [c] real lineage only — never the population, never a non-ancestor -----');
const decoy = loadForm(nGon(6), 'decoy');
const richLookup = (id) => (id === decoy.id ? decoy : pageShapes.get(id));
const lineageOfC2 = resolveLineage(C2, richLookup);
check('resolveLineage(C2) is EXACTLY its ancestors, immediate-first: [C1, S1, tube] — and the decoy in the lookup never appears',
  JSON.stringify(lineageOfC2.map((s) => s.id)) === JSON.stringify([C1.id, S1.id, tube.id]) &&
  !lineageOfC2.some((s) => s.id === decoy.id));
check('the store walk agrees (resolved over state.forms — the store population includes non-ancestors, none of which are handed over)',
  (() => {
    const viaStore = resolveLineage(C2, (id) => st().forms[id]?.shape);
    const storePopulation = Object.keys(st().forms).length;
    return (
      JSON.stringify(viaStore.map((s) => s.id)) === JSON.stringify([C1.id, S1.id, tube.id]) &&
      storePopulation > viaStore.length + 1 // the store holds more forms than the lineage (the seed squares, siblings)
    );
  })());
check('a ROOT form resolves an EMPTY ancestry (nothing fabricated)', resolveLineage(tube, pageLookup).length === 0);

// ===== [d] termination on broken/cyclic lineage =================================
console.log('\n----- [d] a crafted cyclic lineage terminates and refuses honestly -----');
const cyclicA = { ...S1, id: 'cyclic:A', genealogy: { ...S1.genealogy, parentShapeId: 'cyclic:B' } };
const cyclicB = { ...S1, id: 'cyclic:B', genealogy: { ...S1.genealogy, parentShapeId: 'cyclic:A' } };
const cyclicLookup = (id) => (id === 'cyclic:A' ? cyclicA : id === 'cyclic:B' ? cyclicB : undefined);
const cyclicLineage = resolveLineage(cyclicA, cyclicLookup);
check('resolveLineage terminates on the cycle (finite: [B], the seen-guard stops the loop)',
  cyclicLineage.length === 1 && cyclicLineage[0].id === 'cyclic:B');
const cyclicReadout = readFormInvariants(cyclicA, cyclicLineage);
check('…and the acquisition refuses the cyclic form honestly (no spin, no invented complex)',
  cyclicReadout.complexSource === null && String(cyclicReadout.classification).includes('n-a'));

// ===== [e] no-regression ========================================================
console.log('\n----- [e] the engine is byte-frozen; gen-1 contexts unchanged -----');
const square = loadForm(nGon(4), 'g1sq');
const ctxNoAncestry = { form: square, selectedFaceId: square.faces[0].id, selectedFace: square.faces[0], parentShape: null };
const ctxEmptyAncestry = { ...ctxNoAncestry, ancestry: [] };
check('gen-1 byte-identity: every registry op reads the SAME canApply/getDisabledReason with and without the ancestry field on a first-generation form',
  ['glue-torus', 'glue-cylinder', 'flip-glue-klein', 'flip-glue', 'flip-glue-mobius', 'collapse-sphere', 'cut', 'dual', 'sew-boundary-preserving', 'sew-boundary-reversing'].every((id) => {
    const op = getPlaygroundOperation(id);
    return (
      op.canApply(ctxNoAncestry) === op.canApply(ctxEmptyAncestry) &&
      op.getDisabledReason(ctxNoAncestry) === op.getDisabledReason(ctxEmptyAncestry)
    );
  }));
const guarded = [
  'src/lib/complexIdentification.ts',
  'src/lib/surfaceOperations.ts',
  'src/lib/materializeOperation.ts',
  'src/lib/transformationLedger.ts',
  'src/lib/incidenceTraceRegistry.ts',
  'src/lib/globalW1.ts',
  'src/lib/multiform.ts',
  'src/lib/connectedSum.ts',
  'src/lib/cutOperation.ts',
  'src/lib/surfaceImmersion.ts',
  'src/playground/customGluing.ts',
  'src/playground/bornFormRouting.ts',
  'src/playground/formInvariants.ts',
  'src/playground/snapshot.ts',
  'src/manuscript/surfaceClassifier.ts',
  'src/manuscript/inkedFormModel.ts',
  'src/manuscript/optionBModel.ts',
];
const crStrip = (s) => s.replace(/\r/g, '');
const headContentOf = (file) =>
  execSync(`git show HEAD:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
let dirty = [];
try {
  for (const file of guarded) {
    if (crStrip(headContentOf(file)) !== crStrip(fs.readFileSync(path.join(repoRoot, file), 'utf8'))) dirty.push(file);
  }
} catch (e) {
  dirty = [`guard failed to read: ${e.message}`];
}
check('THE ENGINE IS BYTE-UNCHANGED (the hard line): complexIdentification · the bridge · formInvariants · surfaceClassifier · certifiers · gate · ledger · word ops — all frozen, CR-insensitively (the registry layer alone carries this build)',
  dirty.length === 0);
if (dirty.length) note(`dirty: ${dirty.join(', ')}`);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

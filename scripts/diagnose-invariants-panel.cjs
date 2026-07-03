#!/usr/bin/env node

// DIAGNOSTIC — E2: the per-form invariants panel (a READOUT, never a recomputation).
//
// The panel's pure selector (`readFormInvariants`) must return, over known forms,
// exactly what the COMMITTED certifiers say — asserted NON-CIRCULARLY: this
// diagnostic builds each form's complex with its OWN endpoint-keyed builder (the
// R0 pattern) and calls `analyzeGlobalW1` DIRECTLY, then compares the selector's
// readout field-by-field. Closed classifications (genus / cross-caps) are pure
// arithmetic on (χ, orientability); open / un-certified forms read "open / n-a" —
// the panel never fakes a closed classification. Quotient born forms certify via
// the replay-verified recovery (parent required — without it, honestly "n-a").
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

const { readFormInvariants } = req('src/playground/formInvariants.ts');
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { analyzeGlobalW1 } = req('src/lib/globalW1.ts');
const { canonicalEdgeKey } = req('src/lib/ids.ts');
const { usePlaygroundStore } = req('src/store/playgroundStore.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// The diagnostic's OWN complex builder (the R0 pattern) — independent of the
// selector's internal translation, so the comparison is non-circular.
function ownComplex(shape) {
  const edgeByKey = new Map(shape.edges.map((e) => [canonicalEdgeKey(e.vertexIds[0], e.vertexIds[1]), e]));
  const faces = shape.faces.map((face) => ({
    boundary: face.vertexIds.map((x, k) => {
      const y = face.vertexIds[(k + 1) % face.vertexIds.length];
      const edge = edgeByKey.get(canonicalEdgeKey(x, y));
      if (!edge) throw new Error(`no edge for slot ${x}->${y}`);
      return { edge: edge.id, dir: edge.vertexIds[0] === x ? 1 : -1 };
    }),
  }));
  return {
    vertices: Object.keys(shape.vertices),
    edges: shape.edges.map((e) => ({ id: e.id, u: e.vertexIds[0], v: e.vertexIds[1] })),
    faces,
  };
}

console.log('E2 invariants panel: readout === committed certifiers (never a recomputation)\n');

// ===== [1] the known closed/open forms (R0 immersions; values vs the certifier DIRECTLY) =====
console.log('----- [1] KNOWN FORMS (readout === analyzeGlobalW1 over an independently-built complex) -----');
const TABLE = [
  { surface: 'torus', chi: 0, nonOrientable: false, b1: 2, boundary: 'closed', classification: 'genus 1 (closed, orientable)' },
  { surface: 'klein', chi: 0, nonOrientable: true, b1: 2, boundary: 'closed', classification: 'cross-caps 2 (closed, non-orientable)' },
  { surface: 'rp2', chi: 1, nonOrientable: true, b1: 1, boundary: 'closed', classification: 'cross-caps 1 (closed, non-orientable)' },
  { surface: 'sphere', chi: 2, nonOrientable: false, b1: 0, boundary: 'closed', classification: 'genus 0 (closed, orientable)' },
  { surface: 'cylinder', chi: 0, nonOrientable: false, b1: 1, boundary: 'open', classification: 'open / n-a' },
  { surface: 'mobius', chi: 0, nonOrientable: true, b1: 1, boundary: 'open', classification: 'open / n-a' },
];
for (const row of TABLE) {
  const { shape } = immerseSurface({ surface: row.surface, resolution: 8 });
  const snapshot = JSON.stringify(shape);
  const r = readFormInvariants(shape);
  const direct = analyzeGlobalW1(ownComplex(shape));
  check(`${row.surface}: χ === ${row.chi} (explicit cells) and === the certifier's own euler`, r.chi === row.chi && r.chiCertified === row.chi && r.chiCertified === direct.debug.euler);
  check(`${row.surface}: w₁/orientability === the committed cert (nonOrientable ${row.nonOrientable})`, Boolean(r.cert) && r.cert.nonOrientable === row.nonOrientable && eq(r.cert.w1Class, direct.cert.w1Class) && r.cert.nonOrientable === direct.cert.nonOrientable);
  check(`${row.surface}: b₁ === ${row.b1} === the committed cert`, r.cert.b1 === row.b1 && r.cert.b1 === direct.cert.b1);
  check(`${row.surface}: boundary reads '${row.boundary}' and class reads "${row.classification}"`, r.boundary === row.boundary && r.classification === row.classification);
  check(`${row.surface}: complex obtained DIRECT (bridge-translated) — no recovery needed`, r.complexSource === 'direct');
  check(`${row.surface}: derive-only (the Shape is byte-identical after the read)`, JSON.stringify(shape) === snapshot);
  note(`${row.surface}: χ=${r.chi} b₁=${r.cert.b1} w1Class=${JSON.stringify(r.cert.w1Class)} → ${r.classification}`);
}

// ===== [2] playground forms through the REAL store (invoked / born / cut / assembled) =====
console.log('\n----- [2] PLAYGROUND FORMS (invoked disk; born quotient via RECOVERY; cut; assembly) -----');
usePlaygroundStore.getState().resetPlayground();
const A = usePlaygroundStore.getState().invokeForm(nGon(4), 'ua');
usePlaygroundStore.getState().selectForm(A.id);
usePlaygroundStore.getState().selectFace(A.faces[0].id);

const disk = readFormInvariants(A);
check('invoked 4-gon: χ=1 (disk), certified direct, b₁=0, open / n-a (no fake genus)', disk.chi === 1 && disk.complexSource === 'direct' && disk.cert.b1 === 0 && disk.boundary === 'open' && disk.classification === 'open / n-a');

const torusBorn = usePlaygroundStore.getState().applyCustomGlueToSelection([
  { edgeA: 0, edgeB: 2, mode: 'preserving' },
  { edgeA: 1, edgeB: 3, mode: 'preserving' },
]);
const withParent = readFormInvariants(torusBorn, A);
check('born torus (quotient): RECOVERED complex, χ=0 certified, b₁=2, genus 1 (closed, orientable)', withParent.complexSource === 'recovered' && withParent.chi === 0 && withParent.chiCertified === 0 && withParent.cert.b1 === 2 && withParent.classification === 'genus 1 (closed, orientable)');
const withoutParent = readFormInvariants(torusBorn, null);
check('born torus WITHOUT its parent: honestly UN-certified (χ from explicit cells only, class n-a)', withoutParent.complexSource === null && withoutParent.chi === 0 && withoutParent.cert === null && String(withoutParent.classification).includes('n-a'));

usePlaygroundStore.getState().selectForm(A.id);
usePlaygroundStore.getState().selectFace(A.faces[0].id);
const cutBorn = usePlaygroundStore.getState().applyOperationToSelection('cut');
const cutReadout = readFormInvariants(cutBorn, A);
// MEASURED-AND-GATED: the committed w₁/H₁ certifier reads b₁=0 on a face-less
// 1-skeleton (out of its surface-complex domain) — the panel therefore refuses
// to certify skeletons rather than display an out-of-domain value.
check('cut-born (rim skeleton): χ=0 from explicit cells; NO 2-cells → honestly un-certified (domain gate)', cutReadout.chi === 0 && cutReadout.complexSource === 'direct' && cutReadout.cert === null && cutReadout.classification === 'n-a (no 2-cells — not a surface complex)');

const B = usePlaygroundStore.getState().invokeForm(nGon(4), 'ub');
usePlaygroundStore.getState().selectForm(A.id);
const assembly = usePlaygroundStore.getState().applyAssembleToSelection(B.id);
const asmReadout = readFormInvariants(assembly);
check('assembled child (identification ledger-recorded, faces un-rewritten): χ=4 as-represented, open / n-a — honest', asmReadout.chi === 4 && asmReadout.boundary === 'open' && asmReadout.classification === 'open / n-a');
note(`assembly readout: χ=${asmReadout.chi} (V ${asmReadout.cells.v} − E ${asmReadout.cells.e} + F ${asmReadout.cells.f}) — the pre-identification union + minted seam vertices`);

// ===== [3] the readout is a PASSTHROUGH (field-by-field equality with the cert object) =====
console.log('\n----- [3] PASSTHROUGH (no massage between certifier and readout) -----');
const sphereShape = immerseSurface({ surface: 'sphere', resolution: 8 }).shape;
const sphereReadout = readFormInvariants(sphereShape);
const sphereDirect = analyzeGlobalW1(ownComplex(sphereShape));
check('§3 the readout cert IS the committed certificate (b1, w1Class, nonOrientable, nonDegenerate all equal)', eq(sphereReadout.cert, sphereDirect.cert));
check('§3 genus arithmetic: sphere (χ=2, orientable, closed) → genus 0', sphereReadout.classification === 'genus 0 (closed, orientable)');

console.log(
  `\n--- E2 invariants panel (readout === certifiers over closed/open/quotient/skeletal forms; honest n-a): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

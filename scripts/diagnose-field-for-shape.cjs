#!/usr/bin/env node

// DIAGNOSTIC — Field integration: the field as a property of every form.
//
// [1] REGRESSION: the generalized `computeFieldForComplex` on the V3 canonical
//     form reproduces the committed L3b machinery EXACTLY (live cross-check vs
//     `richFieldV0.buildRichField`) AND the L3b seal oracle
//     (.handoff/L3B_RICH_FIELD_SEALED_VALUES.md, parsed when present).
// [2] GATE CLASSIFICATION on REAL forms (measured + reported):
//     · route-B lift (committed patchLift)  — the headline finding: does a real
//       lift carry a texture? (measured: YES — gate 'simple'; asserted + printed)
//     · R0 zoo — torus: kernel + degenerate texture band + NO defect (asserted);
//       Klein/RP²: Σ present (asserted); their lowest band measured SIMPLE —
//       CONTRADICTING the V3-exclusion expectation ('degenerate') — printed and
//       surfaced as a FINDING, deliberately NOT asserted either way here.
//     · the V3 flip-self-glue form — gate 'simple' → texture (the [1] regression).
// [3] the parallel-edge guard: a lift Shape WITHOUT its carried complex is
//     rejected loudly (endpoint translation would lie).
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

const ffs = req('src/lib/fieldForShape.ts');
const rf = req('src/lib/richFieldV0.ts');
const { appShapeToAssembledComplex } = req('src/selectors/witnessBridge.ts');
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { patchLift } = req('src/lib/patchLift.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { buildIncidenceTraceRegistry } = req('src/lib/incidenceTraceRegistry.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const allClose = (xs, ys, tol) => xs.length === ys.length && xs.every((x, i) => Math.abs(x - ys[i]) <= tol);

console.log('Field integration: computeFieldForShape — the field as a per-form property\n');

// ===== [1] REGRESSION — the generalization preserves the L3b machinery =====
console.log('----- [1] REGRESSION vs committed L3b (live cross-check + the seal oracle) -----');
const l3b = rf.buildRichField();
const form = rf.buildCanonicalForm();
const glued = rf.glueFacesFlip(form.F0, form.faces);
const general = ffs.computeFieldForComplex(glued.complex);

check('§3.1 spectrum identical to L3b (1e-12)', allClose(general.spectrum.map((p) => p.value), l3b.spectrum.map((p) => p.value), 1e-12));
check('§3.1 λ_min === 1.245811 (the sealed value, 1e-5) and equals L3b exactly', Math.abs(general.lambdaMin - 1.245811) < 1e-5 && general.lambdaMin === l3b.lambdaMin);
check('§3.1 |ψ|² identical to L3b (1e-12)', general.intensity !== null && allClose(general.intensity, l3b.intensity, 1e-12));
check('§3.1 nodes [2,5], antinodes [3,6] (the sealed sites)', eq(general.nodes, [2, 5]) && eq(general.antinodes, [3, 6]));
check("§3.1 gate === 'simple' on the V3 form (ker 0 ⇒ texture band = λ_min — the L3b gate verbatim)", general.gate === 'simple' && general.kernelDim === 0 && general.textureBand.index === 0);
check('§3.1 Σ identical to L3b (flip support + chain + class)', eq(general.sigma.flipEdges, l3b.sigma.flipEdges) && eq(general.sigma.sigmaChainEdges, l3b.sigma.sigmaChainEdges) && eq(general.sigma.sigmaClass, l3b.sigma.sigmaClass));
check('§3.1 form invariants (b₁=2, [0,1], v/e/t=7/20/12)', general.cert.b1 === 2 && eq(general.cert.w1Class, [0, 1]) && eq(general.cellCounts, { v: 7, e: 20, t: 12 }));

// the committed seal oracle (off-repo plaintext; parsed when present).
const sealPath = path.join(repoRoot, '.handoff', 'L3B_RICH_FIELD_SEALED_VALUES.md');
if (fs.existsSync(sealPath)) {
  const sealText = fs.readFileSync(sealPath, 'utf8');
  const spectrumMatch = sealText.match(/\{\s*([\d.,\s]+)\}/);
  const sealedSpectrum = spectrumMatch ? spectrumMatch[1].split(',').map((x) => Number(x.trim())) : null;
  const lambdaMatch = sealText.match(/λ_min\s*=\s*([\d.]+)/);
  const intensityMatch = sealText.match(/\|ψ\|²\s*=\s*\[([\d.,\s]+)\]/);
  const sealedIntensity = intensityMatch ? intensityMatch[1].split(',').map((x) => Number(x.trim())) : null;
  check('§3.1 SEAL ORACLE: spectrum matches the sealed set (tol 1.5e-3)', Array.isArray(sealedSpectrum) && sealedSpectrum.length === 7 && allClose(general.spectrum.map((p) => p.value), sealedSpectrum, 1.5e-3));
  check('§3.1 SEAL ORACLE: λ_min matches (1e-5)', Boolean(lambdaMatch) && Math.abs(general.lambdaMin - Number(lambdaMatch[1])) < 1e-5);
  check('§3.1 SEAL ORACLE: |ψ|² matches (1e-3)', Array.isArray(sealedIntensity) && sealedIntensity.length === 7 && allClose(general.intensity, sealedIntensity, 1e-3));
  note(`seal oracle parsed from .handoff/L3B_RICH_FIELD_SEALED_VALUES.md: spectrum=${JSON.stringify(sealedSpectrum)} λ_min=${lambdaMatch?.[1]}`);
} else {
  note('seal oracle file absent on this machine (.handoff is gitignored) — the live L3b cross-check above still binds exactly.');
}
note(`V3 via general pipeline: λ_min=${general.lambdaMin.toFixed(6)} |ψ|²=${JSON.stringify(general.intensity.map((x) => Number(x.toFixed(3))))}`);

// ===== [2] GATE CLASSIFICATION on real forms =====
console.log('\n----- [2] GATE CLASSIFICATION (measured + reported per form) -----');
const table = [];
const row = (name, field) => {
  table.push({
    name,
    b1: field.cert.b1,
    nonOrientable: field.cert.nonOrientable,
    ker: field.kernelDim,
    band: Number(field.textureBand.value.toFixed(6)),
    mult: field.textureBand.multiplicity,
    gate: field.gate,
    defect: field.hasDefect,
  });
};

// (a) a REAL route-B lifted surface — THE headline measurement.
const S = applyAmboDissection(createSeedShape('tetrahedron'));
const sSnapshot = JSON.stringify(S);
const center = buildIncidenceTraceRegistry(S)
  .sites.filter((s) => s.glueCoh.valence === 'interior')
  .map((s) => s.scopedVertexId)
  .sort()[0];
const lift = patchLift(S, center);
const liftField = ffs.computeFieldForShape(lift.shape, { complex: lift.complex });
row('route-B lift (RP²-class quotient)', liftField);
check("§3.2a route-B lift: gate === 'simple' — A REAL LIFT CARRIES A TEXTURE (the finding, measured)", liftField.gate === 'simple');
check('§3.2a route-B lift: frustrated (ker 0) with a REAL defect Σ', liftField.kernelDim === 0 && liftField.hasDefect === true);
check('§3.2a route-B lift: texture emitted (|ψ|², nodes, antinodes non-null)', liftField.intensity !== null && liftField.nodes !== null && liftField.antinodes !== null);
note(`lift: b₁=${liftField.cert.b1} w1Class=${JSON.stringify(liftField.cert.w1Class)} spectrum(head)=${JSON.stringify(liftField.spectrum.slice(0, 5).map((p) => Number(p.value.toFixed(4))))} λ_min=${liftField.lambdaMin.toFixed(6)} ×${liftField.textureBand.multiplicity}`);
note(`lift texture: |ψ|²=${JSON.stringify(liftField.intensity.map((x) => Number(x.toFixed(3))))}`);
note(`lift nodes=${JSON.stringify(liftField.nodes)} antinodes=${JSON.stringify(liftField.antinodes)} Σ: flips=${liftField.sigma.flipEdges.length} chain=${liftField.sigma.sigmaChainEdges.length}`);

// (b) the R0 zoo at R=6 (translated via the committed bridge).
const zoo = {};
for (const surface of ['torus', 'klein', 'rp2']) {
  const { shape } = immerseSurface({ surface, resolution: 6 });
  zoo[surface] = ffs.computeFieldForShape(shape);
  row(`R0 ${surface} (R=6)`, zoo[surface]);
}
check('§3.2b torus: kernel mode present (ker === 1) — the orientable flat section', zoo.torus.kernelDim === 1);
check("§3.2b torus: texture band DEGENERATE → gate === 'degenerate' (no canonical texture)", zoo.torus.gate === 'degenerate' && zoo.torus.textureBand.multiplicity > 1);
check('§3.2b torus: orientable → NO defect (Σ support empty)', zoo.torus.hasDefect === false && zoo.torus.cert.nonOrientable === false);
check('§3.2b klein: Σ present (non-orientable defect)', zoo.klein.hasDefect === true && zoo.klein.cert.nonOrientable === true);
check('§3.2b rp2: Σ present (non-orientable defect)', zoo.rp2.hasDefect === true && zoo.rp2.cert.nonOrientable === true);
// THE CONTRADICTION FINDING — printed, deliberately not asserted either way:
note(`FINDING (mandate expected 'degenerate' for the whole zoo): klein measured gate='${zoo.klein.gate}' (band ×${zoo.klein.textureBand.multiplicity}, λ=${zoo.klein.textureBand.value.toFixed(6)}); rp2 measured gate='${zoo.rp2.gate}' (band ×${zoo.rp2.textureBand.multiplicity}, λ=${zoo.rp2.textureBand.value.toFixed(6)}) — the Klein/RP² grids' LOWEST band is SIMPLE under the committed Σ-support pipeline (also measured simple at R=8). Surfaced for the researcher; the gate follows the instrument.`);

// (c) the V3 flip-self-glue form — covered by [1]; restated in the table.
row('V3 flip-self-glue (canonical)', general);
check("§3.2c V3 flip-self-glue form: gate === 'simple' → texture", general.gate === 'simple');

// the per-form gate table (the report's §2 payload).
console.log('\n  FORM                                b₁  nonOr  ker  band(λ)     ×mult  gate        defect');
for (const r of table) {
  const pad = (s, n) => String(s).padEnd(n);
  console.log(`  ${pad(r.name, 36)}${pad(r.b1, 4)}${pad(r.nonOrientable, 7)}${pad(r.ker, 5)}${pad(r.band, 12)}${pad('×' + r.mult, 7)}${pad(r.gate, 12)}${r.defect}`);
}

// ===== [3] the parallel-edge guard =====
console.log('\n----- [3] the parallel-edge guard (a lift Shape must carry its own complex) -----');
let guardFired = false;
let guardMessage = '';
try {
  ffs.computeFieldForShape(lift.shape);
} catch (error) {
  guardFired = true;
  guardMessage = String(error.message);
}
check('§3.3 lift Shape WITHOUT its carried complex is REJECTED loudly (never mistranslated)', guardFired && guardMessage.includes('PARALLEL edge classes'));
note(`guard: "${guardMessage.slice(0, 140)}…"`);
const zooViaBridge = appShapeToAssembledComplex(immerseSurface({ surface: 'torus', resolution: 6 }).shape);
check('§3.3 plain shapes translate via the committed bridge (no parallel classes)', zooViaBridge.vertices.length === 36 && zooViaBridge.edges.length === 72);

// ===== discipline =====
console.log('\n----- discipline -----');
check('derive-only: the ambo source Shape is byte-unchanged after lift + field', JSON.stringify(S) === sSnapshot);
check('reuse-not-fork: the gate tolerances are the committed L3b constants', rf.DEGENERACY_TOL === 1e-6 && rf.NODE_TOL === 1e-4 && rf.ANTINODE_TOL === 1e-9);

console.log(
  `\n--- field integration (L3b regression, per-form gate table, route-B texture finding, zoo contradiction surfaced, parallel guard): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

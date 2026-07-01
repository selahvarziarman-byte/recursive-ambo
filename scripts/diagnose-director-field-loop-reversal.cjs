#!/usr/bin/env node

// DIAGNOSTIC — the loop-reversal, HEADLESS (relocated off-screen from the M1b render, ADR 0017
// M1b-v2: "verification stays headless; the render carries none of it"). The committed w₁ made
// falsifiable: transport the RATIFIED director `n = R(α)·n₀` around a seam-LINKING loop and assert
// it returns REVERSED on the flip field (`Hol = −1`) and ALIGNED on the control (`w₁=0 ⇒ H=0`).
// This is the phenomenological proof the render now shows only as a FELT twist in the flow.
//
// Through the REAL committed modules (anti-mock = the .ts transpile hook): the ratified sampler
// src/selectors/directorFieldV0.ts + the committed bridge. Recomputes nothing.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
      fileName: filename,
    }).outputText,
    filename,
  );
};
const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const field = req('src/selectors/directorFieldV0.ts');
const bridge = req('src/selectors/witnessBridge.ts');

let failures = 0;
const check = (label, ok) => { console.log(`${ok ? 'PASS' : 'FAIL'} - ${label}`); if (!ok) failures += 1; };
const note = (m) => console.log(`  ↳ ${m}`);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];

// transport the director around a z=0 loop (⟂ the z-axis core ⇒ links it once), tracking the
// vector continuously; return the sign it comes back with (n_end · n_start).
function transport(f, radius, N) {
  let prev = null;
  let first = null;
  let minGap = Infinity;
  for (let k = 0; k <= N; k += 1) {
    const th = (2 * Math.PI * k) / N;
    const p = [radius * Math.cos(th), radius * Math.sin(th), 0];
    const s = f.sampleDirector(p);
    minGap = Math.min(minGap, s.topGap);
    let d = s.director;
    if (prev && dot(d, prev) < 0) d = mul(d, -1);
    if (first === null) first = d;
    prev = d;
  }
  return { ret: dot(prev, first), minGap };
}

console.log('director-field loop-reversal (headless): the committed w₁ felt as a seam-linking loop returning reversed\n');

const rs = bridge.buildKnownSeamRenderState();
const flip = field.connectionFieldFromRenderState(rs);
const sites = field.directorSitesFromRenderState(rs);
const control = field.buildConnectionField(sites, {
  holonomy: 0,
  coreAxis: flip.coreAxis,
  corePoint: flip.corePoint,
  cutPhase: flip.cutPhase,
});

check('substrate: flip field is the committed w₁ (holonomy 1, coreAxis = dir(bd)×dir(cd), windingSign −1)',
  flip.holonomy === 1 && rs.windingSign === -1 && JSON.stringify(flip.coreAxis.map((x) => +x.toFixed(6))) === JSON.stringify([0, 0, -1]));
check('substrate: control field is w₁=0 (holonomy 0 ⇒ n ≡ n₀)', control.holonomy === 0);
note(`coreAxis=${JSON.stringify(flip.coreAxis)} corePoint=${JSON.stringify(flip.corePoint)} sigmaClass=${JSON.stringify(rs.sigmaClass)}`);

// the reversal on several seam-linking radii (the invariant is the loop, not the locus).
const radii = [0.8, 1.1, 1.28, 1.6];
let allFlipReversed = true;
let allCtrlAligned = true;
for (const r of radii) {
  const F = transport(flip, r, 2000);
  const C = transport(control, r, 2000);
  if (!(F.ret < -0.999)) allFlipReversed = false;
  if (!(C.ret > 0.999)) allCtrlAligned = false;
  note(`r=${r.toFixed(2)}: flip n_end·n_start=${F.ret.toFixed(4)} (${F.ret < -0.999 ? 'REVERSED ✓' : '—'})  control=${C.ret.toFixed(4)} (${C.ret > 0.999 ? 'ALIGNED ✓' : '—'})`);
}
check('FLIP: the director returns REVERSED (Hol = −1) around every seam-linking loop — the committed w₁', allFlipReversed);
check('CONTROL (w₁=0): the director returns ALIGNED (Hol = +1) — the discriminator (the reversal is the connection)', allCtrlAligned);

console.log(`\n--- director-field loop-reversal (committed w₁ = the loop returns reversed; control aligned): ${failures === 0 ? 'no failures' : `${failures} FAILURE(S)`} ---`);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

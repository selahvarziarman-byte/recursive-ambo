#!/usr/bin/env node

// DIAGNOSTIC — THE FIELD IN THE SPECIMEN (C.1; engineer-chartered 2026-07-17,
// SEAL-BEFORE-BUILD — BUILT BLIND to `.handoff/SEAL_THE_FIELD_IN_THE_SPECIMEN.md`,
// SHA-256 390c9046…c607, natively measured; every pin below is the builder's
// own measurement at 16341e2).
//
// THE CLAIM: the selected specimen carries its LIVING FIELD, in ink — |ψ|² as
// LINEAR stipple density (no gamma: every visible mark is a value the engine
// computed), Σ as its own reserved ink (the ONLY defect-mark), DEGENERATE ⇒
// nothing at all. The calibration is DERIVED PER FORM:
// D_max = ⌈1/(dimmest NON-NODE |ψ|²/max)⌉ — a global constant would fabricate
// voids (at the demo's 15, RP²'s dimmest non-node would render as a void the
// engine never computed). Over the render budget the plate REFUSES — never clips.
//
// THE WORKER IS THE CLAIM (mothership-ruled): the pipeline is ~n³ on the drawn
// body's sites, measured synchronous-hostile, and there is no resolution
// rescue (drawn bodies are fixed per class) — so computeFieldForShape runs in
// the repo's FIRST worker. Off-thread is proven BY THE CALL GRAPH (no
// component module imports the function; the worker enters only through
// `new Worker(new URL(…))`) — NEVER by a timing assertion (L9: an instrument
// must not carry the property it measures; a timing test measures the test
// machine). This witness contains NO timing assertion.
//
// THE VOID IS NOT Σ: Σ is EDGES, |ψ|² lives on VERTICES. The defect-FREE demo
// carries 8 machine-zero voids and NO Σ-ink; the defect-BEARING Klein carries
// Σ-ink and NO readable void at any density (its node band's top sits 1.6%
// under the lit band's bottom). If a reader can read "defect" off a void, the
// mark has failed — that is the falsifier, printed below.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

'use strict';
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: {
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
    jsx: ts.JsxEmit.ReactJSX, // the field LAYER is a .tsx module — required directly
  },
};

const hook = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText,
    filename,
  );
};
require.extensions['.ts'] = hook;
require.extensions['.tsx'] = hook;

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { serializeSnapshot, deserializeSnapshot } = req('src/playground/snapshot.ts');
const { assemble } = req('src/lib/multiform.ts');
const { birthChild } = req('src/manuscript/genesisModel.ts');
const { invokePrimitive, applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const { refineToDisk } = req('src/lib/surfaceRefinement.ts');
const { computeFieldForShape } = req('src/lib/fieldForShape.ts');
const { buildFieldInkModel, deriveStippleDensity, FIELD_STIPPLE_BUDGET } = req('src/manuscript/InkedFieldLayer.tsx');

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('the field in the specimen: the form carries its living field, in ink (blind concretes)\n');

// the calibration, RE-DERIVED here (never trusted from the build): relative
// intensities, the node set excluded from the derivation only
const relativeOf = (field) => {
  const max = field.intensity.reduce((a, x) => Math.max(a, x), 0);
  return field.intensity.map((x) => x / max);
};
const deriveDMax = (field) => {
  const r = relativeOf(field);
  const nodeSet = new Set(field.nodes ?? []);
  let dimmest = Infinity;
  r.forEach((x, i) => {
    if (!nodeSet.has(i) && x < dimmest) dimmest = x;
  });
  return { dMax: Math.ceil(1 / dimmest), dimmest };
};
// THE LINEAR LAW, re-derived: dots(site) = ⌊r · D_max⌋ for EVERY site — no
// gamma, no clamp, no node special-case (nodes fall out at 0 on their own)
const linearLawHolds = (field, model) => {
  const r = relativeOf(field);
  return (
    model.siteDotCounts.length === r.length &&
    r.every((x, i) => model.siteDotCounts[i] === Math.floor(x * model.dMax))
  );
};

// ═════ [1] THE DEMO — the born genus-2 DRAWN body ════════════════════════════
console.log('----- [1] the demo: birthChild on two namespaced immersed tori (R=8, ports faces[5]/faces[11]) -----');
const torSeed = immerseSurface({ surface: 'torus', resolution: 8 }).shape;
const torA = deserializeSnapshot(serializeSnapshot(torSeed, 'demoseed'), 'gA').shape;
const torB = deserializeSnapshot(serializeSnapshot(torSeed, 'demoseed'), 'gB').shape;
const demoBirth = birthChild(torA, torB, 500, torA.faces[5], torB.faces[11], 8);
check('the demo IS BORN: ok:true · render.mode === "classBody"', demoBirth.ok === true && demoBirth.born.render.mode === 'classBody');
const demoBody = demoBirth.ok ? demoBirth.born.render.model.components[0].body : null;
const demoField = demoBody ? computeFieldForShape(demoBody) : null;
if (demoField) {
  check('gate === "simple" · kernelDim === 1 · textureBand.multiplicity === 1',
    demoField.gate === 'simple' && demoField.kernelDim === 1 && demoField.textureBand.multiplicity === 1);
  check('502 sites · sigma.sigmaChainEdges.length === 0 · hasDefect === false',
    demoField.siteIds.length === 502 && demoField.sigma.sigmaChainEdges.length === 0 && demoField.hasDefect === false);
  check('nodes.length === 8 (the eight voids of the w₁=0 demo)', demoField.nodes.length === 8);
  const demoD = deriveDMax(demoField);
  check('D_max === 15 (derived: ⌈1/dimmest-non-node-r⌉) · and the layer\'s own derivation agrees',
    demoD.dMax === 15 && deriveStippleDensity(demoField).dMax === 15);
  const rDemo = relativeOf(demoField);
  const demoNodeTop = Math.max(...demoField.nodes.map((i) => rDemo[i]));
  note(`dimmest NON-NODE r = ${demoD.dimmest.toExponential(4)} → D_max 15 · node band top r = ${demoNodeTop.toExponential(3)} (MACHINE-ZERO voids)`);
  const demoModel = buildFieldInkModel(demoBody, demoField);
  check('the plate: plated · dMax 15 · Σ segments 0 (no defect ⇒ NO Σ-ink) · every node site stipples 0 dots · every non-node site ≥ 1',
    demoModel.plated === true && demoModel.dMax === 15 && demoModel.sigmaSegments.length === 0 &&
    demoField.nodes.every((i) => demoModel.siteDotCounts[i] === 0) &&
    demoModel.siteDotCounts.filter((c, i) => !demoField.nodes.includes(i)).every((c) => c >= 1));
  check('★ THE LINEAR LAW on the demo: dots(site) === ⌊r · 15⌋ for EVERY site (no gamma, no curve, no clamp)',
    linearLawHolds(demoField, demoModel));
  note(`stipple dots on the plate: ${demoModel.dotCount}`);
}

// ═════ [2] THE PLATE — the born Klein DRAWN body (the person's own path) ═════
console.log('\n----- [2] the plate: two invoked squares → flip-glue → refineToDisk each → birthChild on the :disk ports -----');
const sq1 = invokePrimitive('square', 601);
const sq2 = invokePrimitive('square', 602);
const fg1 = applyPlaygroundOperationTo('flip-glue', sq1.shape, null, 603, 8);
const fg2 = applyPlaygroundOperationTo('flip-glue', sq2.shape, null, 604, 8);
check('flip-glue lands twice (the person\'s own RP² pair, 1 face each)',
  fg1.ok === true && fg2.ok === true && fg1.born.shape.faces.length === 1 && fg2.born.shape.faces.length === 1);
let kleinField = null;
let kleinBody = null;
if (fg1.ok && fg2.ok) {
  const refA = refineToDisk(fg1.born.shape, sq1.shape);
  const refB = refineToDisk(fg2.born.shape, sq2.shape);
  const diskA = refA.shape.faces.find((f) => f.id.endsWith(':disk'));
  const diskB = refB.shape.faces.find((f) => f.id.endsWith(':disk'));
  const kleinBirth = birthChild(refA.shape, refB.shape, 605, diskA, diskB, 8);
  check('the Klein IS BORN on the subdivide path: ok:true · classBody', kleinBirth.ok === true && kleinBirth.born.render.mode === 'classBody');
  kleinBody = kleinBirth.ok ? kleinBirth.born.render.model.components[0].body : null;
  kleinField = kleinBody ? computeFieldForShape(kleinBody) : null;
}
if (kleinField) {
  check('gate === "simple" · kernelDim === 0 (frustrated: the defect is real)',
    kleinField.gate === 'simple' && kleinField.kernelDim === 0);
  check('504 sites · sigma.sigmaChainEdges.length === 56 · hasDefect === true',
    kleinField.siteIds.length === 504 && kleinField.sigma.sigmaChainEdges.length === 56 && kleinField.hasDefect === true);
  check('nodes.length === 90', kleinField.nodes.length === 90);
  const kleinD = deriveDMax(kleinField);
  check('D_max === 135 · and the layer\'s own derivation agrees',
    kleinD.dMax === 135 && deriveStippleDensity(kleinField).dMax === 135);
  // ★ THE KILL, RE-DERIVED: the node band's TOP against the lit band's BOTTOM.
  // (The charter calls the 7.326e-3 figure the "deepest node" — measured, it is
  // the node band's BRIGHTEST member, the node nearest visibility; the deepest
  // sits at ~1e-11. The kill is the same either way: even the node CLOSEST to
  // the lit band is within 1.6% of it ⇒ NO READABLE VOID AT ANY DENSITY.)
  const rKlein = relativeOf(kleinField);
  const nodeBandTop = Math.max(...kleinField.nodes.map((i) => rKlein[i]));
  const ratio = kleinD.dimmest / nodeBandTop;
  check('★ THE KILL: dimmest-non-node / node-band-top < 1.1 — the two populations MEET; a void cannot be read',
    ratio < 1.1);
  note(`node band top r = ${nodeBandTop.toExponential(4)} · dimmest non-node r = ${kleinD.dimmest.toExponential(4)} · ratio = ${ratio.toFixed(4)}`);
  const kleinModel = buildFieldInkModel(kleinBody, kleinField);
  check('the plate: plated · dMax 135 · Σ IN INK — all 56 chain spokes resolve to [edge-midpoint → face-barycentre] segments',
    kleinModel.plated === true && kleinModel.dMax === 135 && kleinModel.sigmaSegments.length === 2 * 56);
  check('★ THE LINEAR LAW on the Klein: dots(site) === ⌊r · 135⌋ for EVERY site — including the 90 nodes (no special case)',
    linearLawHolds(kleinField, kleinModel));
  note(`stipple dots on the plate: ${kleinModel.dotCount} · budget in force: ${FIELD_STIPPLE_BUDGET}`);
  // THE BUDGET: refuse, never clip — the REAL field against an explicit
  // smaller budget refuses the WHOLE plate (zero marks; nothing clipped down)
  const overBudget = buildFieldInkModel(kleinBody, kleinField, 100);
  check('over the render budget the plate REFUSES ENTIRE (budget 100 < D_max 135): not plated · reason "density-over-budget" · ZERO dots · ZERO Σ — it never clips',
    overBudget.plated === false && overBudget.refusal === 'density-over-budget' &&
    overBudget.dotCount === 0 && overBudget.sigmaSegments.length === 0);
}

// ═════ [3] THE DEGENERATE CASE — the invoked square draws NOTHING ════════════
console.log('\n----- [3] the degenerate case: the invoked square — a missing mark is a missing VALUE -----');
const sq3 = invokePrimitive('square', 606);
check('the invoked square is a "plain"-mode specimen', sq3.render.mode === 'plain');
const sqField = computeFieldForShape(sq3.render.shape);
check('gate === "degenerate" · intensity === null (a degenerate band has no canonical eigenvector)',
  sqField.gate === 'degenerate' && sqField.intensity === null);
const sqModel = buildFieldInkModel(sq3.render.shape, sqField);
check('the layer emits NOTHING: not plated · "degenerate-band" · 0 dots · 0 Σ segments · null counts (no stipple, no Σ — and the model carries no text/tint channel at all)',
  sqModel.plated === false && sqModel.refusal === 'degenerate-band' &&
  sqModel.dotCount === 0 && sqModel.sigmaSegments.length === 0 && sqModel.siteDotCounts === null);

// ═════ [4] THE ENGINE'S OWN WALL — the committed bridge refuses ══════════════
console.log('\n----- [4] the wall: a word-born form is REFUSED by the committed bridge -----');
let bridgeRefusal = null;
try {
  computeFieldForShape(fg1.born.shape);
} catch (err) {
  bridgeRefusal = err.message;
}
check('the word-born RP² (parallel quotient edge classes) is refused — reason contains "PARALLEL edge classes" (asserted, not routed around)',
  bridgeRefusal !== null && bridgeRefusal.includes('PARALLEL edge classes'));
if (bridgeRefusal) note(`the refusal, verbatim: ${bridgeRefusal.slice(0, 170)}…`);

// ═════ [5] 8′ — THE FALSIFIER (the designer's clause, its number corrected) ══
console.log('\n----- [5] 8′ — the falsifier -----');
console.log(`
The stipple renders |psi|^2's COMPUTED values faithfully, INCLUDING its nodal set.
A nodal void carries NO defect claim. Sigma's reserved ink is the ONLY defect-mark,
and its ABSENCE is the "no defect" statement (a missing mark is a missing value).
  the w1=0 demo  (born genus-2 body, Sigma = EMPTY)  -> its EIGHT nodal voids AND no Sigma-ink
  the w1=1 Klein (born Klein body,  Sigma = 56 EDGES) -> Sigma-ink AND no comparable void
★ IF A READER CAN READ "defect" OFF A VOID, THE MARK HAS FAILED.
`);
check('the falsifier is BOUND to the measurements above: demo (8 voids · Σ absent from the plate) · Klein (Σ 56 in ink · ratio < 1.1 ⇒ no comparable void)',
  demoField !== null && kleinField !== null &&
  demoField.nodes.length === 8 && demoField.sigma.sigmaChainEdges.length === 0 &&
  kleinField.sigma.sigmaChainEdges.length === 56);

// ═════ [6] CLAUSE 7 — the DEGENERATE gate on a DEFECT-BEARING form ═══════════
console.log('\n----- [6] clause 7: a degenerate-band, defect-bearing form is refused — never silently plated -----');
// the union of two namespaced Möbius immersions: λ_min doubles across the two
// components ⇒ the texture band is DEGENERATE, while each component carries
// w₁ ≠ 0 ⇒ Σ EXISTS. Born of the committed assemble — a real form, no mock.
const mSeed = immerseSurface({ surface: 'mobius', resolution: 4 }).shape;
const mA = deserializeSnapshot(serializeSnapshot(mSeed, 'mseed'), 'mA').shape;
const mB = deserializeSnapshot(serializeSnapshot(mSeed, 'mseed'), 'mB').shape;
const unionShape = assemble([mA, mB], { merges: [] }).shape;
const unionField = computeFieldForShape(unionShape);
check('the exhibit exists: gate === "degenerate" AND hasDefect === true AND Σ is NON-EMPTY',
  unionField.gate === 'degenerate' && unionField.hasDefect === true && unionField.sigma.sigmaChainEdges.length > 0);
note(`two-Möbius union: multiplicity ${unionField.textureBand.multiplicity} · sigmaChainEdges ${unionField.sigma.sigmaChainEdges.length} · w₁ = [${unionField.cert.w1Class.join(',')}]`);
const unionModel = buildFieldInkModel(unionShape, unionField);
check('THE GATE HOLDS: the plate refuses WHOLE — no stipple AND no Σ-only partial plate (Σ exists and is withheld until that plate is designed; it is never silently plated)',
  unionModel.plated === false && unionModel.refusal === 'degenerate-band' &&
  unionModel.dotCount === 0 && unionModel.sigmaSegments.length === 0);

// ═════ [7] the worker is off-thread BY THE CALL GRAPH ════════════════════════
console.log('\n----- [7] the call graph: no component module imports computeFieldForShape -----');
const stripComments = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
const readSrc = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8');
const manuscriptFiles = fs
  .readdirSync(path.join(repoRoot, 'src', 'manuscript'))
  .filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'));
const manuscriptOffenders = manuscriptFiles.filter(
  (f) => f !== 'fieldWorker.ts' && stripComments(readSrc(`src/manuscript/${f}`)).includes('computeFieldForShape'),
);
check('NO manuscript module names computeFieldForShape — except the worker (the one module whose JOB it is)',
  manuscriptOffenders.length === 0);
const workerSrc = stripComments(readSrc('src/manuscript/fieldWorker.ts'));
check('the worker file imports the pure committed function and calls it',
  /import \{ computeFieldForShape[^}]*\} from '\.\.\/lib\/fieldForShape'/.test(workerSrc) &&
  workerSrc.includes('computeFieldForShape(shape)'));
const viewSrc = stripComments(readSrc('src/manuscript/ManuscriptView.tsx'));
check('ManuscriptView reaches it ONLY through the worker boundary: `new Worker(new URL(\'./fieldWorker.ts\', import.meta.url), { type: \'module\' })` present · no value import of fieldForShape (type-only)',
  viewSrc.includes("new Worker(new URL('./fieldWorker.ts', import.meta.url), { type: 'module' })") &&
  /import type \{ ShapeField \} from '\.\.\/lib\/fieldForShape'/.test(viewSrc) &&
  !/import \{[^}]*computeFieldForShape[^}]*\}/.test(viewSrc));
// the whole-src census: the FUNCTION's value-importers are exactly the worker
// + the two committed DEV components (the dev shell computes on-thread — its
// own register, not the person's manuscript; measured and pinned, not hidden)
const walk = (dir) => {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(p);
  }
  return out;
};
const valueImporters = walk(path.join(repoRoot, 'src'))
  .filter((p) => {
    const src = stripComments(fs.readFileSync(p, 'utf8'));
    return /import \{[^}]*computeFieldForShape[^}]*\} from/.test(src);
  })
  .map((p) => path.relative(repoRoot, p).replace(/\\/g, '/'))
  .sort();
check('the whole-src census: computeFieldForShape\'s VALUE importers are EXACTLY {fieldWorker.ts, BornFormView.tsx, FieldForShapeOverlay.tsx} — the worker + the two committed dev views; no manuscript component',
  JSON.stringify(valueImporters) === JSON.stringify([
    'src/components/BornFormView.tsx',
    'src/components/FieldForShapeOverlay.tsx',
    'src/manuscript/fieldWorker.ts',
  ]));
note(`value importers, measured: [${valueImporters.join(', ')}]`);
const plainSrc = stripComments(readSrc('src/manuscript/InkedPlainForm.tsx'));
check('InkedPlainForm mounts the layer exactly when the field is given (absent ⇒ byte-identical: no mark of its own)',
  plainSrc.includes('{field ? <InkedFieldLayer shape={shape} field={field} /> : null}'));
const layerSrc = stripComments(readSrc('src/manuscript/InkedFieldLayer.tsx'));
check('the layer draws NOTHING when not plated (the source carries the gate verbatim) and extends no frozen craft (InkedFormCraft is not named)',
  layerSrc.includes('if (!model.plated) return null;') && !layerSrc.includes('InkedFormCraft'));

// ═════ verdict ════════════════════════════════════════════════════════════════
console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`} — the field in the specimen`);
process.exit(failures === 0 ? 0 : 1);

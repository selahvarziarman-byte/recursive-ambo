#!/usr/bin/env node

// DIAGNOSTIC — Manuscript Phase 3a: the operating chrome fires the REAL
// committed engine (anti-mock: transpile-hook require of the real .ts sources).
//
//   · INVOKE === the committed primitive: invokePrimitive loads the
//     PRIMITIVE_CATALOGUE entry through the committed loadForm, byte-identical.
//   · OP === the committed PlaygroundOperation: applyPlaygroundOperationTo's
//     born Shape is BYTE-IDENTICAL to calling the committed registry entry's
//     execute() directly on the same context — the op-application is the
//     committed contract, not a reimplementation.
//   · BORN forms render FAITHFULLY: the committed routeBornForm replay routes
//     glue/flip-glue/collapse borns to their immersion models (full certified
//     generator sets — torus 2 · klein 2 · rp2 1 · cylinder core · sphere 0),
//     cut borns to the level-1-certified skeleton, dual borns to plain ink
//     over REAL positions with certifier-verbatim card values.
//   · GATING is the committed reason, verbatim: ineligible words, dual on
//     bounded forms, cut on face-less skeletons — all refused with
//     getDisabledReason's text, never thrown at the UI. Chaining onto a born
//     quotient face is RULED (Q-M2 unfreeze): the ENGINE runs the composed
//     word (ratified in diagnose-chaining-composition), and the manuscript
//     draws the honest CLASS BODY for the patch-routed born (P-IMMERSE
//     2026-07-11 — the disclosed render gap CLOSED; bookkeeping positions
//     are still never drawn: the body is a self-certifying representative).
//   · Sources are never mutated (derive-only): the target square is
//     byte-unchanged after every operation.

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

const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { getPlaygroundOperation } = req('src/playground/playgroundOperations.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');
const {
  applyPlaygroundOperationTo,
  invokePrimitive,
  operationAvailabilityFor,
  operationContextFor,
  readPlainSpecimen,
} = req('src/manuscript/writtenFormModel.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const R = 8;

// ----- invoke === the committed primitive ------------------------------------
{
  console.log('----- [invoke] the committed primitive, verbatim -----');
  const written = invokePrimitive('square', 1);
  const direct = loadForm(nGon(4), 'w1');
  check('invoked square === loadForm(nGon(4)) byte-for-byte',
    JSON.stringify(written.shape) === JSON.stringify(direct));
  check('render: plain ink over real positions; certifier card values honest',
    written.render.mode === 'plain' && written.render.invariants.chi === 1 && written.opId === null);
  note(`title: ${written.title} | χ ${written.render.invariants.chi} | H₁ ${written.render.h1Label}`);
}

// ----- op === the committed PlaygroundOperation (byte-identical born) --------
const square = invokePrimitive('square', 2);
{
  console.log('----- [op===committed] the SAME born Shape as the registry entry -----');
  const mine = applyPlaygroundOperationTo('glue-cylinder', square.shape, null, 3, R);
  const direct = getPlaygroundOperation('glue-cylinder').execute(operationContextFor(square.shape, null));
  check('glue-cylinder: applyPlaygroundOperationTo born === execute() born, BYTE-IDENTICAL',
    mine.ok && JSON.stringify(mine.born.shape) === JSON.stringify(direct));
  check('the born routes to the CYLINDER immersion with its ONE certified core',
    mine.ok && mine.born.render.mode === 'immersion' &&
    mine.born.render.model.surface === 'cylinder' &&
    mine.born.render.model.loops.length === 1 &&
    mine.born.render.model.loops[0].label === 'core' &&
    Array.isArray(mine.born.render.model.loops[0].basisEdgeIds));
  note(mine.ok ? `born id: ${mine.born.shape.id}` : `UNEXPECTED: ${mine.reason}`);
}
{
  console.log('----- [the word ops] born → faithful immersion renders -----');
  const cases = [
    { op: 'glue-torus', surface: 'torus', loops: 2 },
    { op: 'flip-glue-klein', surface: 'klein', loops: 2 },
    { op: 'flip-glue', surface: 'rp2', loops: 1 },
    { op: 'flip-glue-mobius', surface: 'mobius', loops: 1 },
    { op: 'collapse-sphere', surface: 'sphere', loops: 0 },
  ];
  let seq = 10;
  for (const c of cases) {
    const result = applyPlaygroundOperationTo(c.op, square.shape, null, (seq += 1), R);
    check(`${c.op}: born → immersion '${c.surface}' drawing ${c.loops} certified loop(s)`,
      result.ok && result.born.render.mode === 'immersion' &&
      result.born.render.model.surface === c.surface &&
      result.born.render.model.loops.length === c.loops &&
      result.born.render.model.invariants.cert &&
      result.born.render.model.loops.length === result.born.render.model.invariants.cert.b1);
  }
}
{
  console.log('----- [cut] born → the level-1-certified skeleton -----');
  const result = applyPlaygroundOperationTo('cut', square.shape, null, 20, R);
  check('cut: born is FACE-LESS with real pass-through positions, b₁=1, H₁=ℤ',
    result.ok && result.born.render.mode === 'skeleton' &&
    result.born.shape.faces.length === 0 &&
    result.born.render.model.invariants.level1 &&
    result.born.render.model.invariants.level1.b1 === 1 &&
    result.born.render.model.h1Label === 'ℤ' &&
    Object.values(result.born.shape.vertices).every((v) => {
      const s = square.shape.vertices[v.id];
      return s && s.position.every((c, i) => c === v.position[i]);
    }));
  // chaining onto the skeleton: no face → the committed reason, not a throw
  const chained = applyPlaygroundOperationTo('cut', result.ok ? result.born.shape : square.shape, null, 21, R);
  check("cut on the cut-born skeleton: refused with the committed 'Select a face' reason",
    !chained.ok && chained.reason === 'Select a face to operate on.');
}
{
  console.log('----- [dual] on a born torus (parent replay) → plain ink, certified card -----');
  const torusBorn = applyPlaygroundOperationTo('glue-torus', square.shape, null, 30, R);
  const dual = applyPlaygroundOperationTo('dual', torusBorn.born.shape, square.shape, 31, R);
  check('dual applies via parent replay recovery and yields a REAL-positioned plain render',
    dual.ok && dual.born.render.mode === 'plain' &&
    Object.values(dual.born.shape.vertices).every((v) => v.position.every((c) => Number.isFinite(c))));
  check('dual-of-BORN-torus card: χ=0 measured; cert honestly n-a (the 1-vertex CW dual has self-loop edges — the endpoint-keyed bridge refuses by design, nothing is faked)',
    dual.ok && dual.born.render.invariants.chi === 0 &&
    dual.born.render.invariants.cert === null && dual.born.render.h1Label === null);
  const reading = dual.ok
    ? readPlainSpecimen(dual.born.title, dual.born.provenance, dual.born.render.invariants, dual.born.render.h1Label)
    : null;
  const fresh = dual.ok ? readFormInvariants(dual.born.shape) : null;
  check('plain specimen rows === an independent certifier pass',
    Boolean(reading && fresh &&
      reading.rows.find((r) => r.label === 'Euler χ').value.startsWith(`${fresh.chi}`) &&
      reading.rows.find((r) => r.label === 'class').value === fresh.classification &&
      reading.rows.find((r) => r.label === 'w₁ class').value === (fresh.cert ? `[${fresh.cert.w1Class.join(', ')}]` : 'n-a')));
}
{
  console.log('----- [dual · rich] on the WORLD torus immersion → fully certified card -----');
  const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
  const immersion = immerseSurface({ surface: 'torus', resolution: R });
  const dual = applyPlaygroundOperationTo('dual', immersion.shape, null, 50, R);
  check("dual of the R=8 torus immersion: plain render, cert CERTIFIED — χ 0, H₁ 'ℤ ⊕ ℤ' (M** territory)",
    dual.ok && dual.born.render.mode === 'plain' &&
    dual.born.render.invariants.chi === 0 &&
    Boolean(dual.born.render.invariants.cert) &&
    dual.born.render.invariants.cert.b1 === 2 &&
    dual.born.render.h1Label === 'ℤ ⊕ ℤ');
  note(dual.ok ? `dual classification: ${dual.born.render.invariants.classification}` : `UNEXPECTED: ${dual.reason}`);
}

// ----- gating: the committed reasons, verbatim --------------------------------
{
  console.log('----- [gating] committed getDisabledReason, verbatim; never a throw -----');
  const pentagon = invokePrimitive('pentagon', 40);
  const torusOnPentagon = applyPlaygroundOperationTo('glue-torus', pentagon.shape, null, 41, R);
  const committedReason = getPlaygroundOperation('glue-torus').getDisabledReason(operationContextFor(pentagon.shape, null));
  check('glue-torus on a pentagon: refused with the committed reason string',
    !torusOnPentagon.ok && torusOnPentagon.reason === committedReason && /exactly 4/.test(torusOnPentagon.reason));
  const cylinderBorn = applyPlaygroundOperationTo('glue-cylinder', square.shape, null, 42, R);
  const chain = applyPlaygroundOperationTo('glue-cylinder', cylinderBorn.born.shape, square.shape, 43, R);
  // Q-M2 unfreeze: the ENGINE allows and runs the chain (composition of
  // identifications — ratified in diagnose-chaining-composition). P-IMMERSE
  // (2026-07-11, disclosed): the render gap is CLOSED — the patch-routed born
  // now draws the honest CLASS BODY (the certified class + the committed
  // Option-B generators on a self-certifying representative); bookkeeping
  // positions are still never drawn.
  check('chaining onto a born quotient face: the engine ALLOWS (Q-M2) and the manuscript draws the CLASS BODY (P-IMMERSE — it used to refuse the drawing)',
    getPlaygroundOperation('glue-cylinder').canApply(
      operationContextFor(cylinderBorn.born.shape, square.shape)) === true &&
    chain.ok && chain.born.render.mode === 'classBody' &&
    chain.born.render.model.components[0].label === 'genus 0 · 2 boundary circles');
  const dualOnDisk = applyPlaygroundOperationTo('dual', square.shape, null, 44, R);
  const dualReason = getPlaygroundOperation('dual').getDisabledReason(operationContextFor(square.shape, null));
  check('dual on a bounded disk: refused with the committed preview reason',
    !dualOnDisk.ok && dualOnDisk.reason === dualReason && dualOnDisk.reason.length > 0);
  const noTarget = operationAvailabilityFor(null, null);
  check("no selection: every dock op disabled with 'Select a form first.'",
    noTarget.length === 8 && noTarget.every((op) => !op.enabled && op.reason === 'Select a form first.'));
  const onSquare = operationAvailabilityFor(square.shape, null);
  check('on an invoked square: the word/collapse/cut ops enabled, dual honestly disabled',
    onSquare.filter((op) => op.enabled).map((op) => op.id).sort().join(',') ===
      'collapse-sphere,cut,flip-glue,flip-glue-klein,flip-glue-mobius,glue-cylinder,glue-torus');
  note(`dual reason: ${dualOnDisk.ok ? '—' : dualOnDisk.reason}`);
}

// ----- derive-only: the source is never mutated -------------------------------
{
  console.log('----- [derive-only] the operated-on square is byte-unchanged -----');
  check('after seven operations, the target square === a fresh committed load',
    JSON.stringify(square.shape) === JSON.stringify(loadForm(nGon(4), 'w2')));
}

console.log(
  failures === 0
    ? '\n--- manuscript operate (3a: invoke===primitive · op===committed · faithful borns · verbatim gating): no failures ---\n\nALL PASS'
    : `\n--- manuscript operate: ${failures} FAILURE(S) ---`,
);
process.exitCode = failures === 0 ? 0 : 1;

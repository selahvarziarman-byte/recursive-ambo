#!/usr/bin/env node

// DIAGNOSTIC — STAMP B-1: THE COMMUTATOR BIT AT THE MODEL GRAIN (Station B1
// of the order arc; Arman's Δ59 — "this part needs a non human" — makes this
// measurement the coder's, not the person's).
//
// THE QUESTION, one bit per room: compose four transports IN WALK ORDER —
// cross door a, cross door b, cross a backwards, cross b backwards — and ask
// whether the composite is the IDENTITY. The walk accumulates left
// (`acc = g·acc`, the GPU transport loop's own convention), so the composite
// is  C = m_b⁻¹ · m_a⁻¹ · m_b · m_a.
//
// THE SUBSTRATE IS THE RUNTIME OBJECT, never a parallel derivation: the maps
// come from sealDomainRealization(...).seal.deck.entries — the SAME witnessed
// isometries the live walk applies at every crossing — built by the zoo's own
// recipes (buildFormDomain over dodecahedralTwistPairings(seed, 3) for
// Seifert–Weber; buildThreeTorusDomain for the control).
//
// THE CLAUSES:
//   SW ★★  two DIFFERENT (a,b) door-pair choices each give C ≠ I (the deck
//          group is non-abelian; two choices so one accidentally-commuting
//          pair cannot fake the bit). Distance = max |C − I| entry — the
//          deckAbelianModel's own metric, its 1e-6 tolerance (float-noise
//          and O(1) sit on far shores, per its measured-gulf note).
//   T³ ★★  THE CONTROL: two distinct axis pairs each give C = I EXACTLY
//          (within the same 1e-6). ⛔ If T³'s commutator is NOT identity the
//          INSTRUMENT is wrong — nothing about SW means anything — and this
//          leg fails loud with the verbatim numbers (the charter's STOP).
//   SW ⚠   the optional line: the door-count at which the commutator WORD's
//          own path first returns in SW — the smallest n with Cⁿ = I (≤ a
//          cap), reported as 4·n doors; "no return ≤ cap" is a lawful answer.

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
require.extensions['.tsx'] = require.extensions['.ts'];
const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { createDodecahedronShape, dodecahedralTwistPairings, sealDomainRealization, mat4Mul, matrixInverse4 } =
  req('src/lib/noncubeDomain.ts');
const { buildFormDomain } = req('src/manuscript/formDomainModel.ts');
const { buildThreeTorusDomain } = req('src/manuscript/worldModel.ts');
const { DECK_ABELIAN_EPSILON } = req('src/manuscript/deckAbelianModel.ts');

let failures = 0;
const check = (label, pass, detail = '') => {
  console.log(`${pass ? 'PASS' : 'FAIL'} - ${label}${detail ? `\n  ↳ ${detail}` : ''}`);
  if (!pass) failures += 1;
};

const IDENT = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const distFromIdentity = (m) => {
  let d = 0;
  for (let k = 0; k < 16; k += 1) d = Math.max(d, Math.abs(m[k] - IDENT[k]));
  return d;
};
// walk order a, b, a⁻¹, b⁻¹ under left accumulation ⇒ C = b⁻¹·a⁻¹·b·a
const walkCommutator = (ma, mb) =>
  mat4Mul(matrixInverse4(mb), mat4Mul(matrixInverse4(ma), mat4Mul(mb, ma)));
const doorName = (e) => `${e.faceA}⇄${e.faceB}`;

console.log('THE COMMUTATOR BIT — four transports in walk order, one bit per room\n');

// ── Seifert–Weber, the zoo's own recipe ─────────────────────────────────────
const swSeed = createDodecahedronShape();
const sw = buildFormDomain(swSeed, dodecahedralTwistPairings(swSeed, 3), 'seifert-weber', 'Seifert–Weber — dodecahedron, 3/10 twist');
const swSealed = sealDomainRealization(sw);
check('SW seals (the runtime deck exists to ask)', swSealed.sealed === true,
  swSealed.sealed ? `model ${swSealed.seal.deck.model} · ${swSealed.seal.deck.entries.length} door pairs` : String(swSealed.refusal ?? 'refused'));

if (swSealed.sealed) {
  const E = swSealed.seal.deck.entries;
  const choices = [
    [E[0], E[1]],
    [E[2], E[4]],
  ];
  for (const [a, b] of choices) {
    const d = distFromIdentity(walkCommutator(a.m, b.m));
    check(
      `SW ★★ [${doorName(a)}, ${doorName(b)}] — the walk-order commutator is NOT the identity (the bit: NO)`,
      d > DECK_ABELIAN_EPSILON,
      `max |C − I| entry = ${d.toExponential(3)} (tolerance ${DECK_ABELIAN_EPSILON})`,
    );
  }
  // ⚠ the optional line — the commutator word's own first return
  const C = walkCommutator(E[0].m, E[1].m);
  let power = C;
  let returnedAt = null;
  const CAP = 200;
  for (let n = 1; n <= CAP; n += 1) {
    if (distFromIdentity(power) <= DECK_ABELIAN_EPSILON) { returnedAt = n; break; }
    power = mat4Mul(C, power);
  }
  console.log(
    returnedAt === null
      ? `  ⚠ optional — the [${doorName(E[0])}, ${doorName(E[1])}] commutator word does NOT return within ${CAP} repetitions (≤ ${4 * CAP} doors)`
      : `  ⚠ optional — the [${doorName(E[0])}, ${doorName(E[1])}] commutator word first returns after ${returnedAt} repetitions = ${4 * returnedAt} doors`,
  );
}

// ── T³, the control ─────────────────────────────────────────────────────────
const t3Sealed = sealDomainRealization(buildThreeTorusDomain());
check('T³ seals (the control deck exists)', t3Sealed.sealed === true,
  t3Sealed.sealed ? `model ${t3Sealed.seal.deck.model} · ${t3Sealed.seal.deck.entries.length} door pairs` : String(t3Sealed.refusal ?? 'refused'));

if (t3Sealed.sealed) {
  const E = t3Sealed.seal.deck.entries;
  const axisChoices = [
    [E[0], E[1]],
    [E[1], E[2]],
  ];
  for (const [a, b] of axisChoices) {
    const d = distFromIdentity(walkCommutator(a.m, b.m));
    check(
      `T³ ★★ THE CONTROL [${doorName(a)}, ${doorName(b)}] — the commutator IS the identity (abelian; ⛔ a red here means the INSTRUMENT is wrong and SW's bit means nothing)`,
      d <= DECK_ABELIAN_EPSILON,
      `max |C − I| entry = ${d.toExponential(3)} (tolerance ${DECK_ABELIAN_EPSILON})`,
    );
  }
}

console.log(`\n${failures === 0 ? 'ALL CLAUSES PASS — the bit is answered: SW non-abelian at the walk\'s own transports, T³ the clean control' : `${failures} CLAUSE(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);

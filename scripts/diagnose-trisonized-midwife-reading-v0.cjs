#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  }).outputText;

  module._compile(output, filename);
};

const repoRoot = path.resolve(__dirname, '..');
const moduleSourcePath = path.join(
  repoRoot,
  'src/lib/trisonizedMidwifeReadingV0.ts',
);
const {
  TRISONIZED_MIDWIFE_METHOD_ID,
  buildTrisonizedMidwifeReadingFrameV0,
  validateTrisonAnswerStructureV0,
  renderFrameLines,
} = require(moduleSourcePath);

const EXPECTED_STEP_IDS = [
  'radix-completion-A',
  'radix-completion-B',
  'completion-duality',
  'loop-horizon',
  'child',
  'residuals',
  'verdict',
];
const EXPECTED_ANSWER_FIELDS = [
  'omegaA',
  'omegaB',
  'duality',
  'loopHorizon',
  'child',
  'residualA',
  'residualB',
  'verdict',
];

let failures = 0;

function check(label, condition) {
  if (condition) {
    console.log(`PASS - ${label}`);
  } else {
    console.log(`FAIL - ${label}`);
    failures += 1;
  }
}

// §11.1 sample triad: Beauty — Unity | Truth.
const sampleInput = {
  triadId: 'sample-truth-beauty-unity',
  sublatedVertex: 'Truth',
  parentA: 'Beauty',
  parentB: 'Unity',
};

const frame = buildTrisonizedMidwifeReadingFrameV0(sampleInput);

console.log('TrisonizedMidwifeReadingV0 diagnostics');
console.log('');
console.log('--- rendered blank frame ---');
for (const line of renderFrameLines(frame)) {
  console.log(line);
}
console.log('--- end blank frame ---');
console.log('');

// Assert 1 — exactly 7 slots, order 1..7 in the fixed stepId sequence.
check('1. exactly 7 slots', frame.slots.length === 7);
check(
  '1. slot order is 1..7',
  frame.slots.every((slot, index) => slot.order === index + 1),
);
check(
  '1. stepId sequence is fixed',
  frame.slots.every((slot, index) => slot.stepId === EXPECTED_STEP_IDS[index]),
);

// Assert 2 — every slot.answer === null (blank, human-fill only).
check(
  '2. every slot.answer === null',
  frame.slots.every((slot) => slot.answer === null),
);

// Assert 3 — prompts/formulas carry the interpolated Truth/Beauty/Unity and the
// right glyph tokens; no unreplaced placeholders remain.
const slotsById = Object.fromEntries(
  frame.slots.map((slot) => [slot.stepId, slot]),
);
check(
  '3. Ω_A formula interpolated',
  slotsById['radix-completion-A'].formula === 'Ω_A = Truth ⊕ Beauty',
);
check(
  '3. Ω_B formula interpolated',
  slotsById['radix-completion-B'].formula === 'Ω_B = Truth ⊕ Unity',
);
check(
  '3. child formula interpolated',
  slotsById['child'].formula === 'X = Λ ⊖ Truth',
);
check(
  '3. residual formula interpolated',
  slotsById['residuals'].formula ===
    'ρ_A = Beauty ⊖ X = Ω_A ⊖ Λ ; ρ_B = Unity ⊖ X = Ω_B ⊖ Λ',
);
check(
  '3. radix-A prompt names Truth and Beauty',
  slotsById['radix-completion-A'].prompt.includes('Truth') &&
    slotsById['radix-completion-A'].prompt.includes('Beauty'),
);
check(
  '3. radix-B prompt names Truth and Unity',
  slotsById['radix-completion-B'].prompt.includes('Truth') &&
    slotsById['radix-completion-B'].prompt.includes('Unity'),
);
check(
  '3. residual prompt names Beauty and Unity',
  slotsById['residuals'].prompt.includes('Beauty') &&
    slotsById['residuals'].prompt.includes('Unity'),
);
check(
  '3. no unreplaced {J}/{A}/{B} placeholders remain',
  frame.slots.every(
    (slot) =>
      !/\{[JAB]\}/.test(slot.prompt) && !/\{[JAB]\}/.test(slot.formula),
  ),
);

// Assert 4 — status / authority fields exact.
check(
  '4. methodId exact',
  frame.methodId === TRISONIZED_MIDWIFE_METHOD_ID &&
    frame.methodId === 'trisonized-midwife-semantic-clueing-v0',
);
check('4. reasoningSource === human', frame.reasoningSource === 'human');
check(
  '4. agentComputation === frame-and-questions-only',
  frame.agentComputation === 'frame-and-questions-only',
);
check(
  '4. semanticStatus === candidate-naming-pressure-not-final-name',
  frame.semanticStatus === 'candidate-naming-pressure-not-final-name',
);
check(
  '4. packetWriteStatus === not-packet-writing',
  frame.packetWriteStatus === 'not-packet-writing',
);
check(
  '4. shapeMutationStatus === not-shape-mutation',
  frame.shapeMutationStatus === 'not-shape-mutation',
);
check('4. namingAuthority === human-names', frame.namingAuthority === 'human-names');

// Assert 5 — rubric and acceptance-criteria cardinality.
check('5. acceptanceCriteria.length === 10', frame.acceptanceCriteria.length === 10);
check('5. rubric.length === 6', frame.rubric.length === 6);

// Assert 6 — empty answer is structurally incomplete; all 8 fields missing.
const emptyReport = validateTrisonAnswerStructureV0({ triadId: 'x' });
check('6. empty answer complete === false', emptyReport.complete === false);
check('6. empty answer missing.length === 8', emptyReport.missing.length === 8);
check(
  '6. empty answer missing lists all 8 fields',
  [...emptyReport.missing].sort().join(',') ===
    [...EXPECTED_ANSWER_FIELDS].sort().join(','),
);

// Assert 7 — a mock human-authored fixture (opaque placeholders; NOT agent
// reasoning) is structurally complete.
// fixture: human-authored, NOT agent reasoning. Opaque placeholders only —
// no real completion is derived here (we do NOT compute X = Form or any Ω/Λ/ρ).
const humanFixture = {
  triadId: 'sample-truth-beauty-unity',
  omegaA: '<human>',
  omegaB: '<human>',
  duality: '<human>',
  loopHorizon: '<human>',
  child: '<human>',
  residualA: '<human>',
  residualB: '<human>',
  verdict: 'unsupported',
};
const filledReport = validateTrisonAnswerStructureV0(humanFixture);
check('7. filled fixture complete === true', filledReport.complete === true);
check('7. filled fixture missing.length === 0', filledReport.missing.length === 0);

console.log('');
if (failures === 0) {
  console.log('TrisonizedMidwifeReadingV0 diagnostics passed.');
  process.exit(0);
} else {
  console.error(`TrisonizedMidwifeReadingV0 diagnostics failed: ${failures} assert(s).`);
  process.exit(1);
}

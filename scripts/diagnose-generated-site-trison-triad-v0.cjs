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
// Requiring the real module is itself the mock-solution guard (assert 7):
// delete generatedSiteTrisonTriadV0.ts and this require throws.
const {
  GENERATED_SITE_TRISON_TRIAD_METHOD_ID,
  buildGeneratedSiteTrisonTriadV0Report,
  toTrisonFrameInput,
} = require(path.join(repoRoot, 'src/lib/generatedSiteTrisonTriadV0.ts'));
const { buildTrisonizedMidwifeReadingFrameV0 } = require(
  path.join(repoRoot, 'src/lib/trisonizedMidwifeReadingV0.ts'),
);
const { buildGeneratedSiteReadingV0Report } = require(
  path.join(repoRoot, 'src/lib/generatedSiteReadingV0.ts'),
);

const ALL_PRIMAL_LABELS = ['A', 'B', 'C', 'D'];

let failures = 0;

function check(label, condition) {
  if (condition) {
    console.log(`PASS - ${label}`);
  } else {
    console.log(`FAIL - ${label}`);
    failures += 1;
  }
}

function sortedJoin(values) {
  return [...values].sort().join(',');
}

const report = buildGeneratedSiteTrisonTriadV0Report();

console.log('GeneratedSiteTrisonTriadV0 diagnostics');
console.log('');
console.log('--- derived triads ---');
for (const triad of report.triads) {
  console.log(
    `${triad.siteId}: A=${triad.parentA.label} B=${triad.parentB.label} | J=${triad.sublatedJ.label} (opp ${triad.sublatedJ.oppositeMidpointId}) [${triad.labelStatus}]`,
  );
}
console.log(`issues: ${report.issues.length}`);
for (const issue of report.issues) {
  console.log(`  ! ${issue}`);
}
console.log('--- end derived triads ---');
console.log('');

// Assert 0 — the module's own honesty cross-check produced no issues.
check('0. report.issues is empty', report.issues.length === 0);

// Assert 1 — exactly 6 triads; siteIds === the REAL generated-site set,
// cross-checked against the actual site source (generatedSiteReadingV0), not a
// literal typed here.
const realSiteIds = buildGeneratedSiteReadingV0Report().readings
  .map((reading) => reading.siteId)
  .sort();
const derivedSiteIds = report.triads.map((triad) => triad.siteId).sort();
check('1. exactly 6 triads', report.triads.length === 6);
check(
  '1. derived siteIds === real generated-site set',
  JSON.stringify(derivedSiteIds) === JSON.stringify(realSiteIds),
);

// Assert 2 — CAL-1 mapping for all six, J computed independently in the test as
// the complement of the child's edge (parents parsed from siteId letters).
for (const triad of report.triads) {
  const letters = triad.siteId.slice(2).split(''); // strip 'M_'
  const expectedJ = ALL_PRIMAL_LABELS.filter((label) => !letters.includes(label));
  const actualParents = [triad.parentA.label, triad.parentB.label];
  const actualJ = triad.sublatedJ.components.map((component) => component.label);

  check(
    `2. ${triad.siteId} parents = edge endpoints`,
    sortedJoin(actualParents) === sortedJoin(letters),
  );
  check(
    `2. ${triad.siteId} J = complement of edge`,
    sortedJoin(actualJ) === sortedJoin(expectedJ),
  );
  check(
    `2. ${triad.siteId} oppositeMidpointId = M_${[...expectedJ].sort().join('')}`,
    triad.sublatedJ.oppositeMidpointId === `M_${[...expectedJ].sort().join('')}`,
  );
  check(
    `2. ${triad.siteId} oppositeEdgeId = ${[...expectedJ].sort().join('')}`,
    triad.sublatedJ.oppositeEdgeId === [...expectedJ].sort().join(''),
  );
}

// Assert 3 — J.components has 2 entries and neither equals a parent (J is
// sublated, not a parent), checked by both id and label.
for (const triad of report.triads) {
  const components = triad.sublatedJ.components;
  const overlapsParent = components.some(
    (component) =>
      component.id === triad.parentA.id ||
      component.id === triad.parentB.id ||
      component.label === triad.parentA.label ||
      component.label === triad.parentB.label,
  );
  check(`3. ${triad.siteId} J has 2 components`, components.length === 2);
  check(`3. ${triad.siteId} J disjoint from parents`, overlapsParent === false);
}

// Assert 4 — labelStatus all-primal-labeled; every label non-empty.
for (const triad of report.triads) {
  const labels = [
    triad.parentA.label,
    triad.parentB.label,
    triad.sublatedJ.label,
    ...triad.sublatedJ.components.map((component) => component.label),
  ];
  check(
    `4. ${triad.siteId} labelStatus === all-primal-labeled`,
    triad.labelStatus === 'all-primal-labeled',
  );
  check(
    `4. ${triad.siteId} all labels non-empty`,
    labels.every((label) => typeof label === 'string' && label.length > 0),
  );
}

// Assert 5 — methodId / scope exact; provenance operation/generation/seed.
check(
  '5. methodId exact',
  report.methodId === GENERATED_SITE_TRISON_TRIAD_METHOD_ID &&
    report.methodId === 'generated-site-trison-triad-v0',
);
check('5. scope exact', report.scope === 'one-ambo-tetrahedron-only');
check(
  '5. provenance operation/generation/seed for all six',
  report.triads.every(
    (triad) =>
      triad.provenance.operation === 'ambo' &&
      triad.provenance.generation === 1 &&
      triad.provenance.seed === 'tetrahedron',
  ),
);

// Assert 6 — integration (the point): live inputs flow into the Pkt-3 frame.
const triadAB = report.triads.find((triad) => triad.siteId === 'M_AB');
check('6. M_AB triad exists', Boolean(triadAB));

if (triadAB) {
  const frameInput = toTrisonFrameInput(triadAB);
  check('6. frameInput.triadId === M_AB', frameInput.triadId === 'M_AB');
  check(
    '6. frameInput parents are real labels A/B',
    frameInput.parentA === 'A' && frameInput.parentB === 'B',
  );
  check(
    '6. frameInput.sublatedVertex === C∧D (combined opposite edge)',
    frameInput.sublatedVertex === 'C∧D',
  );
  check(
    '6. frameInput.context carries provenance',
    typeof frameInput.context === 'string' &&
      frameInput.context.includes('M_AB') &&
      frameInput.context.includes('M_CD'),
  );

  const frame = buildTrisonizedMidwifeReadingFrameV0(frameInput);
  check(
    '6. frame.input carries the live triad',
    frame.input.parentA === 'A' &&
      frame.input.parentB === 'B' &&
      frame.input.sublatedVertex === 'C∧D' &&
      frame.input.triadId === 'M_AB',
  );

  const radixA = frame.slots.find(
    (slot) => slot.stepId === 'radix-completion-A',
  );
  check('6. radix-completion-A slot exists', Boolean(radixA));

  if (radixA) {
    check(
      '6. radix-A prompt has the real parent label (not {A})',
      radixA.prompt.includes('A') && !radixA.prompt.includes('{A}'),
    );
    check(
      '6. radix-A prompt has the real J label C∧D',
      radixA.prompt.includes('C∧D'),
    );
    check(
      '6. radix-A formula interpolated with live inputs',
      radixA.formula === 'Ω_A = C∧D ⊕ A',
    );
  }
}

console.log('');
if (failures === 0) {
  console.log('GeneratedSiteTrisonTriadV0 diagnostics passed.');
  process.exit(0);
} else {
  console.error(
    `GeneratedSiteTrisonTriadV0 diagnostics failed: ${failures} assert(s).`,
  );
  process.exit(1);
}

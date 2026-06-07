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
const {
  buildGeneratedSiteReadingV0Report,
} = require(path.join(repoRoot, 'src/lib/generatedSiteReadingV0.ts'));
const { registeredOperations } = require(path.join(
  repoRoot,
  'src/operations/registry.ts',
));

const EXPECTED_SITE_IDS = ['M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];
const METHOD = 'generated-site-reading-v0-diagnostic';
const DIAGNOSTIC_SCOPE =
  'generated-site-reading-v0-one-ambo-tetrahedron-only';
const READING_POLICY_ID = 'generated-site-reading-v0-one-ambo-tetrahedron';
const FORBIDDEN_MATURE_CLAIMS = [
  'confirmed gate',
  'confirmed route',
  'confirmed region',
  'confirmed loop',
  'confirmed vortex',
  'gate blocks',
  'route carries',
  'region governs',
  'vortex organizes',
  'phase corridor',
  'topology import',
];
const failures = [];

console.log('GeneratedSiteReadingV0 diagnostics');

const report = buildGeneratedSiteReadingV0Report();

runReportBoundaryDiagnostic(report);
runReadingCoverageDiagnostic(report);
runWitnessDiagnostic(report);
runNamingAndBoundaryDiagnostic(report);
runMutationAndRegistryDiagnostic(report);
runMatureClaimDiagnostic(report);
runCoherenceDiagnostic(report);
printCompactSummary(report);

if (failures.length) {
  console.error('');
  console.error('Diagnostics failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log('');
  console.log('Diagnostics passed.');
}

function runReportBoundaryDiagnostic(report) {
  expectEqual(report.method, METHOD, 'report method');
  expectEqual(report.diagnosticScope, DIAGNOSTIC_SCOPE, 'report scope');
  expectEqual(report.readingPolicyId, READING_POLICY_ID, 'reading policy');
  expectEqual(
    report.eventScopeStatus,
    'one-ambo-tetrahedron-proving-event',
    'event scope',
  );
  expectEqual(
    report.fieldLayerStatus,
    'event-bound-profile-aware-prototype',
    'field layer status',
  );
  expectEqual(
    report.generalityStatus,
    'not-general-reading-layer',
    'generality status',
  );
  expectEqual(report.portabilityStatus, 'untested', 'portability status');
  expectEqual(
    report.semanticStatus,
    'not-semantic-naming',
    'semantic status',
  );
  expectEqual(
    report.topologyStatus,
    'not-topology-workspace',
    'topology status',
  );
  expectEqual(
    report.packetWriteStatus,
    'not-packet-writing',
    'packet write status',
  );
  expectEqual(
    report.shapeMutationStatus,
    'not-shape-mutation',
    'shape mutation status',
  );
  expectEqual(
    report.namingStateStatus,
    'not-implemented',
    'naming state status',
  );
  expectEqual(
    report.humanNamingAuthorityStatus,
    'human-names',
    'human naming authority',
  );
  expectEqual(report.provingEventOperation, 'ambo-dissection', 'event operation');
  expectEqual(report.provingEventGenerationDepth, 1, 'event generation depth');

  console.log('report boundary: PASS');
}

function runReadingCoverageDiagnostic(report) {
  expectEqual(report.readingCount, 6, 'reading count');
  expectEqual(report.readings.length, 6, 'reading array count');

  const siteIds = report.readings.map((reading) => reading.siteId).sort();
  expectArrayEqual(siteIds, [...EXPECTED_SITE_IDS].sort(), 'reading site ids');

  console.log('reading coverage: PASS');
}

function runWitnessDiagnostic(report) {
  for (const reading of report.readings) {
    expectTruthy(
      reading.geometryWitness,
      `${reading.siteId} geometry witness exists`,
    );
    expectIncludes(
      ['available', 'unsupported', 'incomplete'],
      reading.geometryWitness.geometryWitnessStatus,
      `${reading.siteId} geometry witness status`,
    );
    expectTruthy(
      reading.fieldWitness,
      `${reading.siteId} field witness exists`,
    );
    expectTruthy(
      reading.fieldWitness.fieldCueId ||
        reading.fieldWitness.fieldCueStatus === 'unavailable',
      `${reading.siteId} field witness cue reference or unavailable status`,
    );
    expectTruthy(
      reading.atomicWitness,
      `${reading.siteId} birth-law witness exists`,
    );
    expectIncludes(
      [
        'event-bound-birth-law-available',
        'not-atomic-workspace',
        'unsupported',
      ],
      reading.atomicWitness.atomicWitnessStatus,
      `${reading.siteId} birth-law witness status`,
    );
  }

  console.log('witness sections: PASS');
}

function runNamingAndBoundaryDiagnostic(report) {
  for (const reading of report.readings) {
    expectEqual(
      reading.semanticStatus,
      'not-semantic-naming',
      `${reading.siteId} semantic status`,
    );
    expectEqual(
      reading.topologyStatus,
      'not-topology-workspace',
      `${reading.siteId} topology status`,
    );
    expectEqual(
      reading.packetWriteStatus,
      'not-packet-writing',
      `${reading.siteId} packet write status`,
    );
    expectEqual(
      reading.shapeMutationStatus,
      'not-shape-mutation',
      `${reading.siteId} shape mutation status`,
    );
    expectEqual(
      reading.namingStateStatus,
      'not-implemented',
      `${reading.siteId} naming state status`,
    );
    expectEqual(
      reading.humanNamingAuthorityStatus,
      'human-names',
      `${reading.siteId} human naming authority`,
    );
    expectEqual(
      reading.humanNamingPrompt.namingPromptStatus,
      'question-only',
      `${reading.siteId} naming prompt status`,
    );
    expectAtLeast(
      countNamingQuestions(reading),
      1,
      `${reading.siteId} naming question count`,
    );
    expectNoForbiddenNameFields(reading, `${reading.siteId} reading`);
  }

  console.log('naming and boundary statuses: PASS');
}

function runMutationAndRegistryDiagnostic(report) {
  expectEqual(report.shapeMutationDetected, false, 'shape mutation detected');
  expectEqual(report.packetWriteDetected, false, 'packet write detected');
  expectEqual(
    report.operationRegistryStatus,
    'not-operation-registry-work',
    'operation registry status',
  );
  expectEqual(
    registeredOperations.some((operation) =>
      /generated[-_ ]?site[-_ ]?reading|reading[-_ ]?v0/i.test(operation.id),
    ),
    false,
    'operation registry has no generated-site reading operation',
  );

  console.log('mutation/write/registry boundary: PASS');
}

function runMatureClaimDiagnostic(report) {
  const reportText = JSON.stringify(report).toLowerCase();

  for (const phrase of FORBIDDEN_MATURE_CLAIMS) {
    expectEqual(
      reportText.includes(phrase),
      false,
      `forbidden mature claim "${phrase}"`,
    );
  }

  console.log('mature claim boundary: PASS');
}

function runCoherenceDiagnostic(report) {
  expectEqual(report.issueCount, report.issues.length, 'issue count coherence');
  expectEqual(report.summary.issueCount, report.issueCount, 'summary issue count');
  expectEqual(report.summary.ok, report.ok, 'summary ok');
  expectEqual(report.summary.readingCount, report.readingCount, 'summary reading count');
  expectEqual(report.ok, report.issueCount === 0, 'ok coherence');

  const usefulnessCounts = countBy(
    report.readings,
    (reading) => reading.readingUsefulness.readingUsefulnessStatus,
  );
  const ambiguityCounts = countBy(
    report.readings,
    (reading) => reading.ambiguityWitness.ambiguityStatus,
  );

  for (const [status, count] of Object.entries(usefulnessCounts)) {
    expectEqual(
      report.summary.readingsByUsefulnessStatus[status],
      count,
      `summary usefulness ${status}`,
    );
  }

  for (const [status, count] of Object.entries(ambiguityCounts)) {
    expectEqual(
      report.summary.readingsByAmbiguityStatus[status],
      count,
      `summary ambiguity ${status}`,
    );
  }

  console.log('report coherence: PASS');
}

function printCompactSummary(report) {
  console.log('');
  console.log('GeneratedSiteReadingV0 compact summary');
  console.log(`reading count: ${report.readingCount}`);
  console.log(
    `usefulness status counts: ${formatCounts(
      report.summary.readingsByUsefulnessStatus,
    )}`,
  );
  console.log(
    `ambiguity status counts: ${formatCounts(
      report.summary.readingsByAmbiguityStatus,
    )}`,
  );
  console.log(`field cue available count: ${report.summary.fieldCueAvailableCount}`);
  console.log(
    `weak/degenerate/unsupported: ${report.summary.weakFieldPressureReadingCount}/${report.summary.degenerateReadingCount}/${report.summary.unsupportedReadingCount}`,
  );
  console.log(`ok / issue count: ${report.ok} / ${report.issueCount}`);
}

function countNamingQuestions(reading) {
  return [
    reading.humanNamingPrompt.primaryNamingQuestion,
    ...reading.humanNamingPrompt.secondaryNamingQuestions,
  ].filter(Boolean).length;
}

function expectNoForbiddenNameFields(value, label) {
  for (const key of ['finalName', 'conceptName', 'semanticName']) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      failures.push(`${label}: forbidden name field ${key}`);
    }
  }
}

function countBy(values, getKey) {
  return values.reduce((counts, value) => {
    const key = getKey(value);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    failures.push(`${label}: expected ${formatValue(expected)}, got ${formatValue(actual)}`);
  }
}

function expectTruthy(value, label) {
  if (!value) {
    failures.push(`${label}: expected truthy value, got ${formatValue(value)}`);
  }
}

function expectAtLeast(actual, expectedMinimum, label) {
  if (actual < expectedMinimum) {
    failures.push(
      `${label}: expected at least ${expectedMinimum}, got ${formatValue(actual)}`,
    );
  }
}

function expectIncludes(values, expected, label) {
  if (!values.includes(expected)) {
    failures.push(`${label}: expected ${formatValue(expected)} in ${formatValue(values)}`);
  }
}

function expectArrayEqual(actual, expected, label) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);

  if (actualJson !== expectedJson) {
    failures.push(`${label}: expected ${expectedJson}, got ${actualJson}`);
  }
}

function formatCounts(counts) {
  return Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => `${key}=${count}`)
    .join(', ') || 'none';
}

function formatValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

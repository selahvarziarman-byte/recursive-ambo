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
const diagnosticSourcePath = path.join(
  repoRoot,
  'src/lib/structuredSourceStateCandidateReductionLawComparisonV0.ts',
);
const registryPath = path.join(repoRoot, 'src/operations/registry.ts');
const {
  buildStructuredSourceStateCandidateReductionLawComparisonV0Report,
} = require(diagnosticSourcePath);

const failures = [];
const report = buildStructuredSourceStateCandidateReductionLawComparisonV0Report();
const diagnosticSource = fs.readFileSync(diagnosticSourcePath, 'utf8');
const registrySource = fs.readFileSync(registryPath, 'utf8');

runAssertions(report, {
  diagnosticSource,
  registrySource,
});
printCompactReport(report);

if (failures.length) {
  console.error('');
  console.error('Diagnostics failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log('');
  console.log('Diagnostic assertions passed.');
}

function runAssertions(report, sources) {
  expectEqual(report.ok, true, 'report ok means diagnostic integrity only');
  expectEqual(
    report.diagnosticIntegrityStatus,
    'pass',
    'diagnostic integrity status',
  );
  expectEqual(
    report.method,
    'structured-source-state-candidate-reduction-law-comparison-v0',
    'method',
  );
  expectEqual(
    report.diagnosticScope,
    'candidate-reduction-law-comparison-only',
    'diagnostic scope',
  );
  expectEqual(report.parentGate, 'Gate C.4L-D1', 'parent gate');
  expectEqual(report.upstreamDecisionGate, 'Gate C.4L', 'upstream decision gate');
  expectEqual(report.upstreamFailureGate, 'Gate C.4', 'upstream failure gate');
  expectEqual(report.upstreamResidualGate, 'Gate C.4D', 'upstream residual gate');
  expectEqual(
    report.sourceStateRegimeId,
    'structured-source-state-antipodal-covariant-v0',
    'source-state regime',
  );
  expectEqual(report.semanticStatus, 'not-semantic-naming', 'semantic status');
  expectEqual(report.topologyStatus, 'not-topology-workspace', 'topology status');
  expectEqual(report.packetWriteStatus, 'not-packet-writing', 'packet write status');
  expectEqual(report.shapeMutationStatus, 'not-shape-mutation', 'shape mutation status');
  expectEqual(
    report.operationRegistryStatus,
    'not-operation-registry-work',
    'operation registry status',
  );
  expectEqual(report.uiExposureStatus, 'not-ui-work', 'UI exposure status');

  const requiredCandidateLawIds = [
    'uniform-circle-fixture-bad-control',
    'pythagorean-tetrachord-scalar-baseline',
    'r0-metadata-only-structured-control',
    'r4-s1-harmonic-wave-number-star-sign-phase-v0',
    'c4l-o1-axis-common-carrier-structural-phase-v0',
    'c4l-s1-structural-propagation-split-v0',
  ];

  expectEqual(
    report.candidateReports.length >= requiredCandidateLawIds.length,
    true,
    'candidate reports exist',
  );

  for (const candidateLawId of requiredCandidateLawIds) {
    expectTruthy(
      report.comparedCandidateLawIds.includes(candidateLawId),
      `candidate law report exists: ${candidateLawId}`,
    );
  }

  for (const candidateReport of report.candidateReports) {
    expectEqual(
      candidateReport.detectorInputAnonymizationStatus,
      'anonymized',
      `${candidateReport.candidateLawId} detector input anonymization`,
    );
    expectEqual(
      candidateReport.detectorInputCleanlinessStatus,
      'clean',
      `${candidateReport.candidateLawId} detector input cleanliness`,
    );
    expectEqual(
      candidateReport.detectorInput.anonymousSourceIds.every((sourceId) =>
        /^S\d+$/.test(sourceId),
      ),
      true,
      `${candidateReport.candidateLawId} anonymous source ids`,
    );
    expectEqual(
      candidateReport.detectorInput.probes.every((probe) =>
        /^P\d+$/.test(probe.anonymousProbeId),
      ),
      true,
      `${candidateReport.candidateLawId} anonymous probe ids`,
    );
    expectEqual(
      exposesSourcePosition(candidateReport.detectorInput),
      false,
      `${candidateReport.candidateLawId} detector input has no source positions`,
    );
    expectEqual(
      exposesProbePosition(candidateReport.detectorInput),
      false,
      `${candidateReport.candidateLawId} detector input has no probe positions`,
    );
    expectEqual(
      exposesEmittedTuple(candidateReport.detectorInput),
      false,
      `${candidateReport.candidateLawId} detector input has no emitted tuple`,
    );
    expectEqual(
      exposesLabel(candidateReport.detectorInput),
      false,
      `${candidateReport.candidateLawId} detector input has no labels`,
    );
    expectEqual(
      exposesHiddenTruth(candidateReport.detectorInput),
      false,
      `${candidateReport.candidateLawId} detector input has no hidden truth`,
    );
    expectEqual(
      exposesAxisPair(candidateReport.detectorInput),
      false,
      `${candidateReport.candidateLawId} detector input has no axis pair`,
    );
    expectEqual(
      candidateReport.inferredPairs.length,
      3,
      `${candidateReport.candidateLawId} inferred pair count`,
    );
    expectEqual(
      candidateReport.pairScores.length,
      3,
      `${candidateReport.candidateLawId} pair score count`,
    );
    expectEqual(
      candidateReport.pairScores.every((score) =>
        Number.isFinite(score.pairScore),
      ),
      true,
      `${candidateReport.candidateLawId} finite pair scores`,
    );
    expectTruthy(
      ['pass', 'fail', 'ambiguous'].includes(candidateReport.recoveryStatus),
      `${candidateReport.candidateLawId} recovery status`,
    );
    expectTruthy(
      [
        'candidate-supported-under-declared-basis',
        'candidate-failed-under-declared-basis',
        'candidate-ambiguous-under-declared-basis',
        'baseline-retained-as-emitted-success-only',
      ].includes(candidateReport.candidateStatus),
      `${candidateReport.candidateLawId} candidate status`,
    );
  }

  expectTruthy(
    [
      'structural-propagation-split-supported-for-next-design',
      'orbit-common-carrier-supported-for-review',
      'no-revised-candidate-supported',
      'ambiguous-candidate-comparison',
    ].includes(report.candidateComparisonStatus),
    'candidate comparison status',
  );
  expectTruthy(
    ['Gate C.4L-D2', 'Gate C.5-review', 'Gate C.4L-review', 'Gate C.4L-revise'].includes(
      report.recommendedNextGate,
    ),
    'recommended next gate',
  );
  expectEqual(
    report.boundaryStatus.fieldCueV0Status,
    'blocked',
    'FieldCueV0 remains blocked',
  );
  expectEqual(
    report.boundaryStatus.generatedSiteReadingV0Status,
    'blocked',
    'GeneratedSiteReadingV0 remains blocked',
  );
  expectTruthy(
    [
      'not-authorized-by-this-diagnostic',
      'raw-field-behavior-candidate-supports-gate-c5-review',
    ].includes(report.boundaryStatus.gateC5Status),
    'Gate C.5 boundary status',
  );
  expectEqual(
    report.boundaryStatus.reductionLawAdoptionStatus,
    'not-adopted',
    'reduction law adoption status',
  );
  expectEqual(
    report.boundaryStatus.fieldAtlasMutationStatus,
    'not-mutated',
    'field atlas mutation status',
  );
  expectEqual(
    report.boundaryStatus.fieldAtlasSourcePolicyMutationStatus,
    'not-mutated',
    'field atlas source policy mutation status',
  );
  expectEqual(
    report.boundaryStatus.operationRegistryStatus,
    'not-operation-registry-work',
    'boundary operation registry status',
  );
  expectEqual(report.integrityIssueCount, 0, 'integrity issue count');

  expectEqual(
    /from\s+['"].*fieldCueV0|require\([^)]*fieldCueV0/i.test(
      sources.diagnosticSource,
    ),
    false,
    'diagnostic source does not import FieldCueV0',
  );
  expectEqual(
    /from\s+['"].*generatedSiteReadingV0|require\([^)]*generatedSiteReadingV0/i.test(
      sources.diagnosticSource,
    ),
    false,
    'diagnostic source does not import GeneratedSiteReadingV0',
  );
  expectEqual(
    Object.keys(require.cache).some((modulePath) =>
      /fieldCueV0|generatedSiteReadingV0/i.test(modulePath),
    ),
    false,
    'diagnostic runtime did not load FieldCueV0 or GeneratedSiteReadingV0',
  );
  expectEqual(
    /candidate[-_ ]?reduction[-_ ]?law[-_ ]?comparison|c4l[-_ ]?d1|structuredSourceStateCandidateReductionLawComparison/i.test(
      sources.registrySource,
    ),
    false,
    'operation registry has no candidate reduction-law comparison operation',
  );
}

function printCompactReport(report) {
  console.log('StructuredSourceStateCandidateReductionLawComparisonV0 diagnostics');
  console.log(`parent gate: ${report.parentGate}`);
  console.log(`upstream decision gate: ${report.upstreamDecisionGate}`);
  console.log(`upstream failure gate: ${report.upstreamFailureGate}`);
  console.log(`upstream residual gate: ${report.upstreamResidualGate}`);
  console.log(`source-state regime: ${report.sourceStateRegimeId}`);
  console.log(`diagnosticIntegrityStatus: ${report.diagnosticIntegrityStatus}`);
  console.log('');

  console.log('candidate reports');
  for (const candidateReport of report.candidateReports) {
    console.log(
      `${candidateReport.candidateLawId} | basis ${candidateReport.recoveryBasis} | status ${candidateReport.recoveryStatus} | recovered ${candidateReport.recoveredTruthPairCount}/3 | false positives ${candidateReport.falsePositiveCount} | ambiguity ${candidateReport.ambiguityCount} | confidence ${formatNumber(
        candidateReport.confidence,
      )} | candidateStatus ${candidateReport.candidateStatus}`,
    );
  }

  console.log('');
  console.log(`candidateComparisonStatus: ${report.candidateComparisonStatus}`);
  console.log(`strongestCandidateLawId: ${report.strongestCandidateLawId ?? 'none'}`);
  console.log(`strongestCandidateBasis: ${report.strongestCandidateBasis ?? 'none'}`);
  console.log(`recommendedNextGate: ${report.recommendedNextGate}`);
  console.log('');

  console.log('boundary status');
  console.log(`FieldCueV0 status: ${report.boundaryStatus.fieldCueV0Status}`);
  console.log(
    `GeneratedSiteReadingV0 status: ${report.boundaryStatus.generatedSiteReadingV0Status}`,
  );
  console.log(`Gate C.5 status: ${report.boundaryStatus.gateC5Status}`);
  console.log(
    `reduction law adoption status: ${report.boundaryStatus.reductionLawAdoptionStatus}`,
  );
  console.log(
    `field atlas mutation status: ${report.boundaryStatus.fieldAtlasMutationStatus}`,
  );
  console.log(
    `field atlas source policy mutation status: ${report.boundaryStatus.fieldAtlasSourcePolicyMutationStatus}`,
  );
  console.log(`operation registry status: ${report.boundaryStatus.operationRegistryStatus}`);
  console.log(`integrity issue count: ${report.integrityIssueCount}`);
}

function exposesSourcePosition(input) {
  return objectHasKeyMatching(input, /sourcePosition|position/i);
}

function exposesProbePosition(input) {
  return objectHasKeyMatching(input, /probePosition|samplePosition/i);
}

function exposesEmittedTuple(input) {
  return objectHasKeyMatching(input, /emittedTuple|waveNumber|attenuation|amplitude/i);
}

function exposesLabel(input) {
  return objectHasKeyMatching(input, /label|edgeStateId|childSiteId/i);
}

function exposesHiddenTruth(input) {
  return objectHasKeyMatching(input, /hidden|truth|antipodal/i);
}

function exposesAxisPair(input) {
  return objectHasKeyMatching(input, /axisPair|axisId|axis:/i);
}

function objectHasKeyMatching(value, pattern) {
  if (!value || typeof value !== 'object') {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some((child) => objectHasKeyMatching(child, pattern));
  }

  return Object.entries(value).some(
    ([key, child]) => pattern.test(key) || objectHasKeyMatching(child, pattern),
  );
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    failures.push(
      `${label}: expected ${formatValue(expected)}, got ${formatValue(actual)}`,
    );
  }
}

function expectTruthy(value, label) {
  if (!value) {
    failures.push(`${label}: expected truthy value`);
  }
}

function formatNumber(value) {
  return Number.isFinite(value) ? value.toFixed(6) : String(value);
}

function formatValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

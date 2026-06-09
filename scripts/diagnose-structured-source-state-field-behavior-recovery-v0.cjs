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
  'src/lib/structuredSourceStateFieldBehaviorRecoveryV0.ts',
);
const registryPath = path.join(repoRoot, 'src/operations/registry.ts');
const {
  buildStructuredSourceStateFieldBehaviorRecoveryV0Report,
} = require(diagnosticSourcePath);

const failures = [];
const report = buildStructuredSourceStateFieldBehaviorRecoveryV0Report();
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
  expectEqual(report.ok, true, 'report ok');
  expectEqual(
    report.diagnosticIntegrityStatus,
    'pass',
    'diagnostic integrity status',
  );
  expectEqual(
    report.method,
    'structured-source-state-field-behavior-recovery-v0',
    'method',
  );
  expectEqual(
    report.diagnosticScope,
    'blind-field-behavior-recovery-only',
    'diagnostic scope',
  );
  expectEqual(report.parentGate, 'Gate C.4', 'parent gate');
  expectEqual(
    report.candidateReductionLawId,
    'r4-s1-harmonic-wave-number-star-sign-phase-v0',
    'candidate reduction law',
  );
  expectEqual(
    report.upstreamEmittedRecoveryMethod,
    'structured-source-state-emitted-recovery-v0',
    'upstream emitted recovery method',
  );
  expectEqual(report.comparedRegimes.length, 4, 'compared regime count');
  expectEqual(report.probeSet.probeCount >= 9, true, 'probe count');

  const uniform = findRegime(report, 'uniform-circle-fixture-bad-control');
  const pythagorean = findRegime(
    report,
    'pythagorean-tetrachord-scalar-baseline',
  );
  const r0 = findRegime(report, 'r0-metadata-only-structured-control');
  const r4s1 = findRegime(
    report,
    'r4-s1-harmonic-wave-number-star-sign-phase-v0',
  );

  expectTruthy(uniform, 'uniform control exists');
  expectTruthy(pythagorean, 'Pythagorean baseline exists');
  expectTruthy(r0, 'R0 control exists');
  expectTruthy(r4s1, 'R4-S1 candidate exists');

  for (const regime of report.comparedRegimes) {
    expectEqual(
      regime.fieldBehaviorDetectorInputAnonymizationStatus,
      'anonymized',
      `${regime.regimeId} field-behavior detector input anonymization`,
    );
    expectEqual(
      regime.fieldBehaviorDetectorInputCleanlinessStatus,
      'clean',
      `${regime.regimeId} field-behavior detector input cleanliness`,
    );
    expectEqual(
      regime.samplerStatus,
      'sampled',
      `${regime.regimeId} sampler status`,
    );
    expectEqual(
      regime.fieldSampleFiniteStatus,
      'finite',
      `${regime.regimeId} field sample finite status`,
    );
    expectEqual(
      regime.sampleCount >= report.probeSet.probeCount,
      true,
      `${regime.regimeId} sample count`,
    );
    expectEqual(
      regime.sampleContributionCount > 0,
      true,
      `${regime.regimeId} sample contributions`,
    );

    const input = regime.fieldBehaviorDetectorInput;
    expectEqual(
      input.anonymousSourceIds.every((sourceId) => /^S\d+$/.test(sourceId)),
      true,
      `${regime.regimeId} anonymous source ids`,
    );
    expectEqual(
      input.probes.every((probe) => /^P\d+$/.test(probe.anonymousProbeId)),
      true,
      `${regime.regimeId} anonymous probe ids`,
    );
    expectEqual(
      exposesSourcePosition(input),
      false,
      `${regime.regimeId} detector input has no source positions`,
    );
    expectEqual(
      exposesProbePosition(input),
      false,
      `${regime.regimeId} detector input has no probe positions`,
    );
    expectEqual(
      exposesEmittedTuple(input),
      false,
      `${regime.regimeId} detector input has no emitted tuple`,
    );
    expectEqual(
      exposesLabel(input),
      false,
      `${regime.regimeId} detector input has no labels`,
    );
    expectEqual(
      exposesHiddenTruth(input),
      false,
      `${regime.regimeId} detector input has no hidden truth`,
    );
    expectEqual(
      exposesAxisPair(input),
      false,
      `${regime.regimeId} detector input has no axis pair`,
    );
    expectEqual(
      regime.fieldBehaviorOnlyRecovery.matchingCount,
      15,
      `${regime.regimeId} perfect matching count`,
    );
  }

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
    /field[-_ ]?behavior[-_ ]?recovery|structured[-_ ]?source[-_ ]?state[-_ ]?field/i.test(
      sources.registrySource,
    ),
    false,
    'operation registry has no field-behavior recovery operation',
  );
}

function printCompactReport(report) {
  console.log('StructuredSourceStateFieldBehaviorRecoveryV0 diagnostics');
  console.log(`parent gate: ${report.parentGate}`);
  console.log(`regime id: ${report.sourceStateRegimeId}`);
  console.log(`candidate law: ${report.candidateReductionLawId}`);
  console.log(`probe count: ${report.probeSet.probeCount}`);
  console.log(`diagnosticIntegrityStatus: ${report.diagnosticIntegrityStatus}`);
  console.log('');

  console.log('compared regimes');
  for (const regime of report.comparedRegimes) {
    console.log(
      `${regime.role}: ${regime.regimeId} | sources ${regime.emittedSourceCount} | samples ${regime.sampleCount} | contributions ${regime.sampleContributionCount} | detector ${regime.fieldBehaviorDetectorInputCleanlinessStatus}`,
    );
  }

  console.log('');
  console.log('geometry-only recovery');
  for (const regime of report.comparedRegimes) {
    const recovery = regime.geometryOnlyRecovery;
    console.log(
      `${regime.role}: ${recovery.recoveryStatus} | recovered ${recovery.recoveredTruthPairCount}/3 | confidence ${formatNumber(
        recovery.confidence,
      )} | false positives ${recovery.falsePositiveCount} | ambiguity ${recovery.ambiguityCount}`,
    );
  }

  console.log('');
  console.log('emission-only recovery');
  for (const regime of report.comparedRegimes) {
    const recovery = regime.emissionOnlyRecovery;
    console.log(
      `${regime.role}: ${recovery.recoveryStatus} | recovered ${recovery.recoveredTruthPairCount}/3 | confidence ${formatNumber(
        recovery.confidence,
      )} | false positives ${recovery.falsePositiveCount} | ambiguity ${recovery.ambiguityCount}`,
    );
  }

  console.log('');
  console.log('field-behavior-only recovery');
  for (const regime of report.comparedRegimes) {
    const recovery = regime.fieldBehaviorOnlyRecovery;
    console.log(
      `${regime.role}: ${recovery.recoveryStatus} | recovered ${recovery.recoveredTruthPairCount}/3 | confidence ${formatNumber(
        recovery.confidence,
      )} | false positives ${recovery.falsePositiveCount} | ambiguity ${recovery.ambiguityCount} | total ${formatNumber(
        recovery.totalScore,
      )}`,
    );
  }

  const pythagorean = findRegime(
    report,
    'pythagorean-tetrachord-scalar-baseline',
  );
  const r0 = findRegime(report, 'r0-metadata-only-structured-control');
  const r4s1 = findRegime(
    report,
    'r4-s1-harmonic-wave-number-star-sign-phase-v0',
  );

  console.log('');
  console.log(
    `R4-S1 field-behavior confidence vs Pythagorean: ${formatNumber(
      r4s1.fieldBehaviorOnlyRecovery.confidence,
    )} ${compareConfidence(
      r4s1.fieldBehaviorOnlyRecovery.confidence,
      pythagorean.fieldBehaviorOnlyRecovery.confidence,
    )} ${formatNumber(pythagorean.fieldBehaviorOnlyRecovery.confidence)}`,
  );
  console.log(
    `R4-S1 field-behavior confidence vs R0: ${formatNumber(
      r4s1.fieldBehaviorOnlyRecovery.confidence,
    )} ${compareConfidence(
      r4s1.fieldBehaviorOnlyRecovery.confidence,
      r0.fieldBehaviorOnlyRecovery.confidence,
    )} ${formatNumber(r0.fieldBehaviorOnlyRecovery.confidence)}`,
  );
  console.log(
    `r4s1FieldBehaviorRecoveryStatus: ${report.r4s1FieldBehaviorRecoveryStatus}`,
  );
  console.log(`gateC4CandidateStatus: ${report.gateC4CandidateStatus}`);
  console.log('');

  console.log('boundary status');
  console.log(`FieldCueV0 status: ${report.boundaryStatus.fieldCueV0Status}`);
  console.log(
    `GeneratedSiteReadingV0 status: ${report.boundaryStatus.generatedSiteReadingV0Status}`,
  );
  console.log(
    `Gate C.5 status: ${report.boundaryStatus.gateC5ControlComparisonStatus}`,
  );
  console.log(
    `full R4 architecture status: ${report.boundaryStatus.fullR4ArchitectureStatus}`,
  );
  console.log(
    `field atlas mutation status: ${report.boundaryStatus.fieldAtlasMutationStatus}`,
  );
  console.log(
    `field atlas source policy mutation status: ${report.boundaryStatus.fieldAtlasSourcePolicyMutationStatus}`,
  );
  console.log(`integrity issue count: ${report.integrityIssueCount}`);
  console.log(
    `candidate outcome notes: ${
      report.candidateOutcomeNotes.length
        ? report.candidateOutcomeNotes.join(', ')
        : 'none'
    }`,
  );
}

function findRegime(report, regimeId) {
  return report.comparedRegimes.find((regime) => regime.regimeId === regimeId);
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

function compareConfidence(left, right) {
  if (left > right) {
    return '>';
  }

  if (left < right) {
    return '<';
  }

  return '=';
}

function formatValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

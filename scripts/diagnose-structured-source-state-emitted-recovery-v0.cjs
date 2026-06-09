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
  'src/lib/structuredSourceStateEmittedRecoveryV0.ts',
);
const registryPath = path.join(repoRoot, 'src/operations/registry.ts');
const {
  buildStructuredSourceStateEmittedRecoveryV0Report,
} = require(diagnosticSourcePath);

const failures = [];
const report = buildStructuredSourceStateEmittedRecoveryV0Report();
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
    report.method,
    'structured-source-state-emitted-recovery-v0',
    'method',
  );
  expectEqual(
    report.diagnosticScope,
    'blind-emitted-source-recovery-only',
    'diagnostic scope',
  );
  expectEqual(report.parentGate, 'Gate C.3', 'parent gate');
  expectEqual(
    report.candidateReductionLawId,
    'r4-s1-harmonic-wave-number-star-sign-phase-v0',
    'candidate reduction law',
  );
  expectEqual(report.comparedRegimes.length, 4, 'compared regime count');

  const uniform = findRegime(report, 'bad-control');
  const pythagorean = findRegime(report, 'harmonic-scalar-baseline');
  const r0 = findRegime(report, 'metadata-only-structured-control');
  const r4s1 = findRegime(report, 'structured-source-state-candidate');

  expectTruthy(uniform, 'uniform control exists');
  expectTruthy(pythagorean, 'Pythagorean baseline exists');
  expectTruthy(r0, 'R0 control exists');
  expectTruthy(r4s1, 'R4-S1 candidate exists');

  expectEqual(
    r4s1.emissionOnlyRecovery.recoveredTruthPairCount,
    3,
    'R4-S1 emission-only recovered truth pairs',
  );
  expectEqual(
    r4s1.emissionOnlyRecovery.falsePositiveCount,
    0,
    'R4-S1 emission-only false positives',
  );
  expectEqual(
    r4s1.emissionOnlyRecovery.recoveryStatus,
    'pass',
    'R4-S1 emission-only recovery status',
  );
  expectEqual(
    r4s1.emissionOnlyRecovery.confidence >
      pythagorean.emissionOnlyRecovery.confidence,
    true,
    'R4-S1 confidence exceeds Pythagorean baseline',
  );
  expectEqual(
    r4s1.emissionOnlyRecovery.confidence > r0.emissionOnlyRecovery.confidence,
    true,
    'R4-S1 confidence exceeds R0',
  );
  expectNotEqual(
    pythagorean.emissionOnlyRecovery.recoveryStatus,
    'pass',
    'Pythagorean control does not recover 3/3 by emission-only detector',
  );
  expectNotEqual(
    r0.emissionOnlyRecovery.recoveryStatus,
    'pass',
    'R0 control does not recover 3/3 by emission-only detector',
  );
  expectEqual(
    report.comparisonSummary.r4s1OutperformsControls,
    true,
    'R4-S1 outperforms controls',
  );
  expectEqual(
    report.comparisonSummary.sourceRegimeRecoveryStatus,
    'pass',
    'source regime recovery status',
  );
  expectTruthy(
    report.comparisonSummary.geometryLeakStatus,
    'geometry-only recovery separated',
  );

  for (const regime of report.comparedRegimes) {
    expectEqual(
      regime.anonymizationStatus,
      'anonymized',
      `${regime.regimeId} anonymization status`,
    );

    for (const input of regime.detectorInputs) {
      expectEqual(
        /^S\d+$/.test(input.anonymousSourceId),
        true,
        `${regime.regimeId} anonymous source id`,
      );
      expectEqual(
        /[A-D]{2}|M_[A-D]{2}|axis:/i.test(input.anonymousSourceId),
        false,
        `${regime.regimeId} anonymous source id does not expose edge label`,
      );
      expectEqual(
        exposesForbiddenDetectorField(input),
        false,
        `${regime.regimeId} detector input has no hidden labels`,
      );
    }
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
    /structured[-_ ]?source[-_ ]?state[-_ ]?emitted[-_ ]?recovery|emitted[-_ ]?recovery|source[-_ ]?state[-_ ]?recovery/i.test(
      sources.registrySource,
    ),
    false,
    'operation registry has no emitted recovery operation',
  );
}

function printCompactReport(report) {
  console.log('StructuredSourceStateEmittedRecoveryV0 diagnostics');
  console.log(`parent gate: ${report.parentGate}`);
  console.log(`regime id: ${report.sourceStateRegimeId}`);
  console.log(`candidate law: ${report.candidateReductionLawId}`);
  console.log('');

  console.log('compared regimes');
  for (const regime of report.comparedRegimes) {
    console.log(
      `${regime.role}: ${regime.regimeId} | sources ${regime.emittedSourceCount} | field-ready ${regime.fieldReadyCount} | anonymization ${regime.anonymizationStatus}`,
    );
  }

  console.log('');
  console.log(
    `geometry-only recovery status: ${report.comparisonSummary.geometryLeakStatus}`,
  );
  console.log('emission-only recovery');
  for (const regime of report.comparedRegimes) {
    const recovery = regime.emissionOnlyRecovery;
    console.log(
      `${regime.role}: ${recovery.recoveryStatus} | recovered ${recovery.recoveredTruthPairCount}/3 | confidence ${formatNumber(
        recovery.confidence,
      )} | false positives ${recovery.falsePositiveCount} | ambiguity ${recovery.ambiguityCount}`,
    );
  }

  const pythagorean = findRegime(report, 'harmonic-scalar-baseline');
  const r0 = findRegime(report, 'metadata-only-structured-control');
  const r4s1 = findRegime(report, 'structured-source-state-candidate');

  console.log('');
  console.log(
    `R4-S1 confidence vs Pythagorean: ${formatNumber(
      r4s1.emissionOnlyRecovery.confidence,
    )} > ${formatNumber(pythagorean.emissionOnlyRecovery.confidence)}`,
  );
  console.log(
    `R4-S1 confidence vs R0: ${formatNumber(
      r4s1.emissionOnlyRecovery.confidence,
    )} > ${formatNumber(r0.emissionOnlyRecovery.confidence)}`,
  );
  console.log(
    `sourceRegimeRecoveryStatus: ${report.comparisonSummary.sourceRegimeRecoveryStatus}`,
  );
  console.log(
    `Gate C.4 field-behavior recovery: ${report.boundaryStatus.gateC4FieldBehaviorRecoveryStatus}`,
  );
  console.log(`FieldCueV0 status: ${report.boundaryStatus.fieldCueV0Status}`);
  console.log(`issue count: ${report.issueCount}`);
}

function findRegime(report, role) {
  return report.comparedRegimes.find((regime) => regime.role === role);
}

function exposesForbiddenDetectorField(input) {
  const forbiddenKeys = [
    'edgeStateId',
    'childSiteId',
    'complementEdgeStateId',
    'antipodalChildSiteId',
    'axisPairId',
    'hiddenEdgeStateId',
    'hiddenAntipodalEdgeStateId',
    'hiddenTruthAxisId',
  ];

  return forbiddenKeys.some((key) => key in input);
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    failures.push(`${label}: expected ${formatValue(expected)}, got ${formatValue(actual)}`);
  }
}

function expectNotEqual(actual, unexpected, label) {
  if (actual === unexpected) {
    failures.push(`${label}: expected not ${formatValue(unexpected)}`);
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

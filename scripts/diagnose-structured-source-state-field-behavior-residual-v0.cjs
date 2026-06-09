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
  'src/lib/structuredSourceStateFieldBehaviorResidualV0.ts',
);
const registryPath = path.join(repoRoot, 'src/operations/registry.ts');
const {
  buildStructuredSourceStateFieldBehaviorResidualV0Report,
} = require(diagnosticSourcePath);

const failures = [];
const report = buildStructuredSourceStateFieldBehaviorResidualV0Report();
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
    'structured-source-state-field-behavior-residual-v0',
    'method',
  );
  expectEqual(
    report.diagnosticScope,
    'residual-differential-field-behavior-only',
    'diagnostic scope',
  );
  expectEqual(report.parentGate, 'Gate C.4D', 'parent gate');
  expectEqual(report.upstreamGate, 'Gate C.4', 'upstream gate');
  expectEqual(
    report.upstreamMethod,
    'structured-source-state-field-behavior-recovery-v0',
    'upstream method',
  );
  expectEqual(
    report.sourceStateRegimeId,
    'structured-source-state-antipodal-covariant-v0',
    'source state regime',
  );
  expectEqual(
    report.candidateReductionLawId,
    'r4-s1-harmonic-wave-number-star-sign-phase-v0',
    'candidate reduction law',
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
  expectEqual(report.uiExposureStatus, 'not-ui-work', 'ui exposure status');
  expectEqual(
    report.upstreamDiagnosticIntegrityStatus,
    'pass',
    'upstream diagnostic integrity status',
  );
  expectTruthy(
    [
      'candidate-fails-field-behavior-recovery',
      'candidate-ambiguous-field-behavior-recovery',
    ].includes(report.upstreamGateC4CandidateStatus),
    'upstream C.4 candidate status remains failed or ambiguous',
  );

  const expectedRegimeIds = [
    'uniform-circle-fixture-bad-control',
    'pythagorean-tetrachord-scalar-baseline',
    'r0-metadata-only-structured-control',
    'r4-s1-harmonic-wave-number-star-sign-phase-v0',
  ];

  for (const regimeId of expectedRegimeIds) {
    expectTruthy(
      report.comparedRegimeIds.includes(regimeId),
      `compared regime ${regimeId}`,
    );
  }

  expectEqual(report.pairResidualRows.length, 15, 'pair residual row count');
  expectEqual(
    report.pairResidualRows.every(pairResidualRowIsFinite),
    true,
    'pair residual rows are finite',
  );
  expectEqual(
    report.detectorInputAudits.length,
    4,
    'detector input audit count',
  );

  for (const audit of report.detectorInputAudits) {
    expectEqual(
      audit.anonymizationStatus,
      'anonymized',
      `${audit.regimeId} residual detector input anonymization`,
    );
    expectEqual(
      audit.cleanlinessStatus,
      'clean',
      `${audit.regimeId} residual detector input cleanliness`,
    );
    expectEqual(
      audit.leakIssueCodes.length,
      0,
      `${audit.regimeId} residual detector input leak count`,
    );
  }

  assertRecovery(report.structuredControlResidualRecovery, 'structured-control');
  assertRecovery(report.strictAllControlResidualRecovery, 'strict all-control');
  expectTruthy(
    [
      'recoverable-residual',
      'partial-residual',
      'no-residual',
      'control-dominant',
      'ambiguous-residual',
    ].includes(report.residualCandidateStatus),
    'residual candidate status',
  );
  expectTruthy(
    ['Gate C.5', 'Gate C.4L', 'Gate C.4D-review'].includes(
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
  expectEqual(
    report.boundaryStatus.reductionLawRevisionStatus,
    'not-authorized-by-this-diagnostic',
    'reduction law revision status',
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
    /field[-_ ]?behavior[-_ ]?residual|structured[-_ ]?source[-_ ]?state[-_ ]?field[-_ ]?behavior[-_ ]?residual/i.test(
      sources.registrySource,
    ),
    false,
    'operation registry has no residual diagnostic operation',
  );
}

function assertRecovery(recovery, label) {
  expectEqual(
    recovery.detectorKind,
    'residual-field-behavior-only',
    `${label} detector kind`,
  );
  expectEqual(recovery.matchingCount, 15, `${label} matching count`);
  expectEqual(recovery.inferredPairs.length, 3, `${label} inferred pair count`);
  expectEqual(recovery.pairScores.length, 3, `${label} pair score count`);
  expectTruthy(
    ['pass', 'fail', 'ambiguous'].includes(recovery.recoveryStatus),
    `${label} recovery status`,
  );
  expectEqual(
    recovery.pairScores.every((score) => Number.isFinite(score.pairScore)),
    true,
    `${label} pair scores finite`,
  );
}

function printCompactReport(report) {
  console.log('StructuredSourceStateFieldBehaviorResidualV0 diagnostics');
  console.log(`parent gate: ${report.parentGate}`);
  console.log(`upstream gate: ${report.upstreamGate}`);
  console.log(`regime id: ${report.sourceStateRegimeId}`);
  console.log(`candidate law: ${report.candidateReductionLawId}`);
  console.log(
    `diagnosticIntegrityStatus: ${report.diagnosticIntegrityStatus}`,
  );
  console.log('');

  console.log('upstream C.4 status');
  console.log(
    `diagnostic integrity: ${report.upstreamDiagnosticIntegrityStatus}`,
  );
  console.log(`candidate status: ${report.upstreamGateC4CandidateStatus}`);
  console.log(
    `R4-S1 field-behavior recovery: ${report.upstreamR4S1FieldBehaviorRecoveryStatus}`,
  );
  console.log('');

  printRecovery(
    'structured-control residual recovery',
    report.structuredControlResidualRecovery,
  );
  printRecovery(
    'strict all-control residual recovery',
    report.strictAllControlResidualRecovery,
  );

  console.log('');
  console.log(`residualCandidateStatus: ${report.residualCandidateStatus}`);
  console.log(`recommendedNextGate: ${report.recommendedNextGate}`);
  console.log('');

  console.log('boundary status');
  console.log(`FieldCueV0 status: ${report.boundaryStatus.fieldCueV0Status}`);
  console.log(
    `GeneratedSiteReadingV0 status: ${report.boundaryStatus.generatedSiteReadingV0Status}`,
  );
  console.log(`Gate C.5 status: ${report.boundaryStatus.gateC5Status}`);
  console.log(
    `reduction law revision status: ${report.boundaryStatus.reductionLawRevisionStatus}`,
  );
  console.log(
    `field atlas mutation status: ${report.boundaryStatus.fieldAtlasMutationStatus}`,
  );
  console.log(
    `field atlas source policy mutation status: ${report.boundaryStatus.fieldAtlasSourcePolicyMutationStatus}`,
  );
  console.log(`integrity issue count: ${report.integrityIssueCount}`);
  console.log('');

  console.log('interpretation notes');
  for (const note of report.residualInterpretationNotes) {
    console.log(`- ${note}`);
  }
}

function printRecovery(label, recovery) {
  console.log(label);
  console.log(
    `status: ${recovery.recoveryStatus} | recovered ${recovery.recoveredTruthPairCount}/3 | meaningful negative truth pairs ${recovery.meaningfulNegativeTruthPairCount}/3 | false positives ${recovery.falsePositiveCount} | ambiguity ${recovery.ambiguityCount} | confidence ${formatNumber(
      recovery.confidence,
    )} | total ${formatNumber(recovery.totalScore)}`,
  );

  for (const pairScore of recovery.pairScores) {
    console.log(
      `  ${pairScore.leftAnonymousSourceId}<->${pairScore.rightAnonymousSourceId}: residual ${formatNumber(
        pairScore.pairScore,
      )} | truth ${pairScore.recoveredTruthPair} | meaningful ${pairScore.meaningfullyNegative}`,
    );
  }

  console.log('');
}

function pairResidualRowIsFinite(row) {
  return [
    row.r4s1RawScore,
    row.uniformControlRawScore,
    row.pythagoreanControlRawScore,
    row.r0ControlRawScore,
    row.averageStructuredControlRawScore,
    row.bestControlRawScore,
    row.residualVsPythagorean,
    row.residualVsR0,
    row.residualVsStructuredControls,
    row.residualVsBestControl,
  ].every(Number.isFinite);
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

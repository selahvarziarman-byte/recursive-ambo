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
  buildProfileAwareFieldStackSummaryReport,
} = require(path.join(repoRoot, 'src/lib/fieldSourceProfileAwareStackSummary.ts'));

const PROFILE_AWARE_SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const failures = [];

console.log('Field source profile-aware stack summary diagnostics');

runHappyStackSummaryDiagnostic();
runBoundaryFlagDiagnostic();
runAdapterDefaultDiagnostic();
runNoOldPolicyComparisonDiagnostic();
runNoInvarianceClaimDiagnostic();
runCandidateOnlyBoundaryDiagnostic();
runCountCoherenceDiagnostic();
runEvidenceStabilitySensitivityDiagnostic();

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

function runHappyStackSummaryDiagnostic() {
  const report = buildProfileAwareFieldStackSummaryReport();

  expectEqual(report.ok, true, 'happy stack summary ok');
  expectEqual(
    report.method,
    'profile-aware-field-stack-summary-diagnostic-v0',
    'happy stack summary method',
  );
  expectEqual(
    report.diagnosticScope,
    'profile-aware-field-stack-summary-only',
    'happy stack summary scope',
  );
  expectEqual(
    report.sourcePolicyId,
    PROFILE_AWARE_SOURCE_POLICY_ID,
    'happy stack summary source policy id',
  );
  expectEqual(report.allLayersOk, true, 'happy all layers ok');

  for (const layerStatusKey of [
    'profileAwarePolicyOk',
    'atlasAdapterOk',
    'atlasExecutionOk',
    'shapePositionResolverOk',
    'surfaceAtlasOk',
    'featureReportOk',
    'featureStabilityOk',
    'routeGateOk',
    'supportRegionOk',
    'evidenceStabilityOk',
  ]) {
    expectEqual(report[layerStatusKey], true, `happy ${layerStatusKey}`);
  }

  expectAtLeast(report.primalSourceCount, 4, 'happy primal source count');
  expectAtLeast(report.childSourceCount, 6, 'happy child source count');
  expectAtLeast(report.fieldReadySourceCount, 1, 'happy field-ready source count');
  expectAtLeast(report.executableSourceCount, 1, 'happy executable source count');
  expectAtLeast(report.chartCount, 1, 'happy chart count');
  expectAtLeast(report.sampleCount, 1, 'happy sample count');
  expectAtLeast(report.variantCount, 4, 'happy evidence variant count');

  printStackSummaryReport('happy stack summary', report);
}

function runBoundaryFlagDiagnostic() {
  const report = buildProfileAwareFieldStackSummaryReport();

  expectEqual(report.policyRelativityStatus, 'policy-relative', 'relativity status');
  expectEqual(
    report.contrastPolicyNote,
    'old-policy-not-assumed-invariant',
    'contrast policy note',
  );
  expectEqual(report.semanticStatus, 'not-semantic-naming', 'semantic status');
  expectEqual(report.topologyStatus, 'not-topology-workspace', 'topology status');
  expectEqual(
    report.phaseContinuityStatus,
    'not-global-phase-continuity',
    'phase continuity status',
  );
  expectEqual(
    report.shapeMutationStatus,
    'not-shape-mutation',
    'shape mutation status',
  );
  expectEqual(
    report.packetWriteStatus,
    'not-packet-writing',
    'packet write status',
  );
  expectEqual(
    report.fieldAtlasSourcePolicyMutationStatus,
    'not-mutated',
    'field atlas source policy mutation status',
  );
  expectEqual(
    report.fieldAtlasMutationStatus,
    'not-mutated',
    'field atlas mutation status',
  );
  expectEqual(report.integrationStatus, 'diagnostic-only', 'integration status');
  expectEqual(
    report.runtimeIntegrationStatus,
    'not-runtime-integrated',
    'runtime integration status',
  );
  expectEqual(
    report.uiExposureStatus,
    'not-ui-exposed',
    'ui exposure status',
  );

  console.log('boundary flags: PASS');
}

function runAdapterDefaultDiagnostic() {
  const report = buildProfileAwareFieldStackSummaryReport();

  expectEqual(
    report.adapterDefaultExecutionStatus,
    'input-built-not-executed',
    'adapter default execution status',
  );
  expectEqual(
    report.explicitAtlasExecutionStatus,
    'profile-aware-atlas-executed',
    'explicit atlas execution status',
  );

  console.log('adapter default input-only status: PASS');
}

function runNoOldPolicyComparisonDiagnostic() {
  const report = buildProfileAwareFieldStackSummaryReport();

  expectNoOwnProperty(report, 'sourcePoliciesCompared', 'no sourcePoliciesCompared');
  expectNoOwnProperty(report, 'defaultPolicyComparison', 'no defaultPolicyComparison');
  expectNoOwnProperty(
    report,
    'parentInheritancePolicyComparison',
    'no parentInheritancePolicyComparison',
  );
  expectNoOwnProperty(report, 'oldDeterministicCounts', 'no oldDeterministicCounts');
  expectNoOwnProperty(report, 'defaultPolicyCounts', 'no defaultPolicyCounts');

  console.log('no old/default policy comparison: PASS');
}

function runNoInvarianceClaimDiagnostic() {
  const report = buildProfileAwareFieldStackSummaryReport();

  expectNoOwnProperty(report, 'invariant', 'no invariant property');
  expectNoOwnProperty(
    report,
    'invariantWithDefaultPolicy',
    'no invariantWithDefaultPolicy property',
  );
  expectNoOwnProperty(
    report,
    'preservesOldEvidence',
    'no preservesOldEvidence property',
  );
  expectNoOwnProperty(
    report,
    'oldEvidenceStillHold',
    'no oldEvidenceStillHold property',
  );
  expectNoOwnProperty(
    report,
    'matchesDefaultEvidence',
    'no matchesDefaultEvidence property',
  );
  expectNoOwnProperty(
    report,
    'defaultPolicyInvariant',
    'no defaultPolicyInvariant property',
  );

  console.log('no old-policy invariance claim: PASS');
}

function runCandidateOnlyBoundaryDiagnostic() {
  const report = buildProfileAwareFieldStackSummaryReport();

  expectEqual(
    report.featureObservationStatus,
    'report-candidate',
    'feature observation status',
  );
  expectEqual(
    report.routeGateCandidateStatus,
    'candidate-only',
    'route/gate candidate status',
  );
  expectEqual(
    report.supportRegionCandidateStatus,
    'candidate-only',
    'support/region candidate status',
  );

  console.log('candidate/report-only boundaries: PASS');
}

function runCountCoherenceDiagnostic() {
  const report = buildProfileAwareFieldStackSummaryReport();

  expectEqual(
    report.totalObservationCount,
    report.cancellationLikeObservationCount +
      report.highIntensityAnchorObservationCount +
      report.ambiguousObservationCount,
    'feature observation total',
  );
  expectEqual(
    report.totalRouteGateCandidateCount,
    report.gateCandidateCount +
      report.routeCandidateCount +
      report.blockedRouteCandidateCount,
    'route/gate candidate total',
  );
  expectEqual(
    report.totalSupportRegionCandidateCount,
    report.supportClassCandidateCount +
      report.regionCandidateCount +
      report.constraintSiteCandidateCount +
      report.routeFailureRegionCandidateCount,
    'support/region candidate total',
  );

  console.log('count coherence: PASS');
}

function runEvidenceStabilitySensitivityDiagnostic() {
  const report = buildProfileAwareFieldStackSummaryReport();

  expectEqual(report.evidenceStabilityOk, true, 'evidence stability ok');
  expectEqual(
    report.evidenceStabilitySensitivityStatus,
    'reported-as-sensitivity-not-failure',
    'evidence sensitivity status',
  );
  expectEqual(report.samplingSensitive, true, 'sampling sensitivity');

  if (report.changedCountKeys.length === 0) {
    recordFailure('evidence sensitivity: expected changed count keys to be reported');
  }

  if (!report.changedCountKeys.includes('sampleCount')) {
    recordFailure('evidence sensitivity: expected sampleCount in changed count keys');
  }

  expectEqual(report.issueCount, 0, 'evidence sensitivity did not create issues');

  console.log('changed counts reported as sensitivity: PASS');
}

function printStackSummaryReport(label, report) {
  console.log(`${label}: ${report.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  layers ok: ${report.allLayersOk}`);
  console.log(
    `  sources: primal=${report.primalSourceCount} child=${report.childSourceCount} fieldReady=${report.fieldReadySourceCount} executable=${report.executableSourceCount}`,
  );
  console.log(
    `  source caveats: fallback=${report.fallbackChildSourceCount} unresolved=${report.unresolvedChildSourceCount} degeneracyStatuses=${report.degeneracyStatusCount}`,
  );
  console.log(
    `  surface: shape=${report.shapeId} domain=${report.domainId ?? 'none'} charts=${report.chartCount} samples=${report.sampleCount}`,
  );
  console.log(
    `  features: total=${report.totalObservationCount} cancellation=${report.cancellationLikeObservationCount} high=${report.highIntensityAnchorObservationCount} ambiguous=${report.ambiguousObservationCount}`,
  );
  console.log(
    `  route/gate: total=${report.totalRouteGateCandidateCount} gate=${report.gateCandidateCount} route=${report.routeCandidateCount} blocked=${report.blockedRouteCandidateCount}`,
  );
  console.log(
    `  support/region: total=${report.totalSupportRegionCandidateCount} support=${report.supportClassCandidateCount} region=${report.regionCandidateCount} constraint=${report.constraintSiteCandidateCount} routeFailure=${report.routeFailureRegionCandidateCount}`,
  );
  console.log(
    `  evidence sensitivity: variants=${report.variantCount} sampling=${report.samplingSensitive} profileSetup=${report.profileSetupSensitive} changed=${report.changedCountKeys.join(', ') || 'none'}`,
  );
  console.log(
    `  max bucket saturated: ${report.maxBucketSaturation.anyMaxBucketSaturated}`,
  );
  console.log(`  issues: ${report.issueCount}${formatIssueCounts(report)}`);
}

function formatIssueCounts(report) {
  const counts = new Map();

  for (const issue of report.issues) {
    counts.set(issue.code, (counts.get(issue.code) ?? 0) + 1);
  }

  if (counts.size === 0) {
    return '';
  }

  return ` (${Array.from(counts)
    .map(([code, count]) => `${code}=${count}`)
    .join(', ')})`;
}

function expectNoOwnProperty(value, property, label) {
  if (Object.prototype.hasOwnProperty.call(value, property)) {
    recordFailure(`${label}: did not expect property ${property}`);
  }
}

function expectAtLeast(actual, expectedMinimum, label) {
  if (actual < expectedMinimum) {
    recordFailure(`${label}: expected at least ${expectedMinimum}, got ${actual}`);
  }
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    recordFailure(`${label}: expected ${expected}, got ${actual}`);
  }
}

function recordFailure(message) {
  failures.push(message);
}

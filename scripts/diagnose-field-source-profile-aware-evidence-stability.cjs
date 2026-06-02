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
  buildProfileAwareEvidenceStabilityReport,
} = require(path.join(repoRoot, 'src/lib/fieldSourceProfileAwareEvidenceStability.ts'));

const PROFILE_AWARE_SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const failures = [];

console.log('Field source profile-aware evidence stability diagnostics');

runHappyEvidenceStabilityDiagnostic();
runSensitivityNotFailureDiagnostic();
runNoOldPolicyComparisonDiagnostic();
runNoInvarianceClaimDiagnostic();
runAdapterDefaultDiagnostic();

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

function runHappyEvidenceStabilityDiagnostic() {
  const report = buildProfileAwareEvidenceStabilityReport();

  expectEqual(report.ok, true, 'happy evidence stability ok');
  expectEqual(
    report.method,
    'profile-aware-evidence-stability-diagnostic-v0',
    'happy evidence stability method',
  );
  expectEqual(
    report.diagnosticScope,
    'profile-aware-full-candidate-stack-stability-only',
    'happy evidence stability scope',
  );
  expectEqual(
    report.sourcePolicyId,
    PROFILE_AWARE_SOURCE_POLICY_ID,
    'happy evidence stability source policy id',
  );
  expectEqual(report.policyRelativityStatus, 'policy-relative', 'happy relativity');
  expectEqual(
    report.contrastPolicyNote,
    'old-policy-not-assumed-invariant',
    'happy contrast note',
  );
  expectEqual(report.semanticStatus, 'not-semantic-naming', 'happy semantic status');
  expectEqual(report.topologyStatus, 'not-topology-workspace', 'happy topology status');
  expectEqual(
    report.phaseContinuityStatus,
    'not-global-phase-continuity',
    'happy phase continuity status',
  );
  expectEqual(
    report.shapeMutationStatus,
    'not-shape-mutation',
    'happy shape mutation status',
  );
  expectEqual(
    report.packetWriteStatus,
    'not-packet-writing',
    'happy packet write status',
  );
  expectEqual(
    report.fieldAtlasSourcePolicyMutationStatus,
    'not-mutated',
    'happy source policy mutation status',
  );
  expectEqual(
    report.fieldAtlasMutationStatus,
    'not-mutated',
    'happy field atlas mutation status',
  );
  expectAtLeast(report.variantCount, 4, 'happy variant count');
  expectAtLeast(report.samplingVariantCount, 2, 'happy sampling variant count');
  expectAtLeast(
    report.profileSetupVariantCount,
    2,
    'happy profile setup variant count',
  );
  expectEqual(report.variants.length, report.variantCount, 'happy variant array count');

  for (const variant of report.variants) {
    expectEqual(variant.ok, true, `${variant.variantId} ok`);
    expectEqual(
      variant.sourcePolicyId,
      PROFILE_AWARE_SOURCE_POLICY_ID,
      `${variant.variantId} source policy`,
    );
    expectEqual(
      variant.semanticStatus,
      'not-semantic-naming',
      `${variant.variantId} semantic status`,
    );
    expectEqual(
      variant.topologyStatus,
      'not-topology-workspace',
      `${variant.variantId} topology status`,
    );
    expectEqual(
      variant.phaseContinuityStatus,
      'not-global-phase-continuity',
      `${variant.variantId} phase continuity status`,
    );
    expectEqual(
      variant.featureObservationStatus,
      'report-candidate',
      `${variant.variantId} feature observation status`,
    );
    expectEqual(
      variant.routeGateCandidateStatus,
      'candidate-only',
      `${variant.variantId} route/gate candidate status`,
    );
    expectEqual(
      variant.supportRegionCandidateStatus,
      'candidate-only',
      `${variant.variantId} support/region candidate status`,
    );
    expectAtLeast(variant.chartCount, 1, `${variant.variantId} chart count`);
    expectAtLeast(variant.sampleCount, 1, `${variant.variantId} sample count`);
    expectAtLeast(
      variant.executableSourceCount,
      1,
      `${variant.variantId} executable source count`,
    );
    expectEqual(
      variant.totalObservationCount,
      variant.cancellationLikeObservationCount +
        variant.highIntensityAnchorObservationCount +
        variant.ambiguousObservationCount,
      `${variant.variantId} feature observation total`,
    );
    expectEqual(
      variant.totalRouteGateCandidateCount,
      variant.gateCandidateCount +
        variant.routeCandidateCount +
        variant.blockedRouteCandidateCount,
      `${variant.variantId} route/gate candidate total`,
    );
    expectEqual(
      variant.totalSupportRegionCandidateCount,
      variant.supportClassCandidateCount +
        variant.regionCandidateCount +
        variant.constraintSiteCandidateCount +
        variant.routeFailureRegionCandidateCount,
      `${variant.variantId} support/region candidate total`,
    );
    expectEqual(
      variant.featureNonCandidateObservationCount,
      0,
      `${variant.variantId} feature non-candidate observations`,
    );
    expectEqual(
      variant.routeGateNonCandidateStatusCount,
      0,
      `${variant.variantId} route/gate non-candidate statuses`,
    );
    expectEqual(
      variant.supportRegionNonCandidateStatusCount,
      0,
      `${variant.variantId} support/region non-candidate statuses`,
    );
  }

  printEvidenceStabilityReport('happy evidence stability', report);
}

function runSensitivityNotFailureDiagnostic() {
  const report = buildProfileAwareEvidenceStabilityReport();

  expectEqual(report.ok, true, 'sensitivity report ok');
  expectEqual(
    report.sensitivitySummary.samplingSensitive,
    true,
    'sampling sensitivity is reported',
  );

  if (!report.sensitivitySummary.changedCountKeys.includes('sampleCount')) {
    recordFailure('sensitivity: expected sampleCount sensitivity to be reported');
  }

  if (report.sensitivitySummary.changedCountKeys.length === 0) {
    recordFailure('sensitivity: expected at least one changed count key');
  }

  if (report.issues.some((issue) => issue.code === 'variant-report-not-ok')) {
    recordFailure('sensitivity: changed counts should not create variant failure');
  }

  console.log('changed counts reported as sensitivity: PASS');
}

function runNoOldPolicyComparisonDiagnostic() {
  const report = buildProfileAwareEvidenceStabilityReport();

  expectNoOwnProperty(report, 'sourcePoliciesCompared', 'no sourcePoliciesCompared property');
  expectNoOwnProperty(report, 'defaultPolicyComparison', 'no defaultPolicyComparison property');
  expectNoOwnProperty(
    report,
    'parentInheritancePolicyComparison',
    'no parentInheritancePolicyComparison property',
  );
  expectNoOwnProperty(report, 'oldDeterministicCounts', 'no oldDeterministicCounts property');
  expectNoOwnProperty(report, 'defaultPolicyCounts', 'no defaultPolicyCounts property');

  console.log('no old/default policy comparison: PASS');
}

function runNoInvarianceClaimDiagnostic() {
  const report = buildProfileAwareEvidenceStabilityReport();

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

function runAdapterDefaultDiagnostic() {
  const report = buildProfileAwareEvidenceStabilityReport();

  if (
    report.issues.some((issue) => issue.code === 'adapter-default-execution-mutated')
  ) {
    recordFailure('adapter default execution status changed unexpectedly');
  }

  console.log('adapter default input-only status: PASS');
}

function printEvidenceStabilityReport(label, report) {
  console.log(`${label}: ${report.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  variants: ${report.variantCount}`);
  console.log(`  sampling variants: ${report.samplingVariantCount}`);
  console.log(`  profile setup variants: ${report.profileSetupVariantCount}`);
  console.log(
    `  sensitivity: sampling=${report.sensitivitySummary.samplingSensitive} profileSetup=${report.sensitivitySummary.profileSetupSensitive}`,
  );
  console.log(
    `  changed count keys: ${report.sensitivitySummary.changedCountKeys.join(', ') || 'none'}`,
  );
  console.log(
    `  feature changes: ${report.sensitivitySummary.featureChangedCountKeys.join(', ') || 'none'}`,
  );
  console.log(
    `  route/gate changes: ${report.sensitivitySummary.routeGateChangedCountKeys.join(', ') || 'none'}`,
  );
  console.log(
    `  support/region changes: ${report.sensitivitySummary.supportRegionChangedCountKeys.join(', ') || 'none'}`,
  );
  console.log(
    `  sample range: ${report.sensitivitySummary.countRanges.sampleCount.min}-${report.sensitivitySummary.countRanges.sampleCount.max}`,
  );
  console.log(
    `  max bucket saturated: ${report.sensitivitySummary.maxBucketSaturation.anyMaxBucketSaturated}`,
  );
  console.log(`  issues: ${report.issueCount}${formatIssueCounts(report)}`);

  for (const variant of report.variants) {
    console.log(
      `  - ${variant.variantId}: samples=${variant.sampleCount} observations=${variant.totalObservationCount} routeGate=${variant.totalRouteGateCandidateCount} supportRegion=${variant.totalSupportRegionCandidateCount}`,
    );
  }
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

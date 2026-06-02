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
  buildProfileAwareFeatureStabilityReport,
} = require(path.join(repoRoot, 'src/lib/fieldSourceProfileAwareFeatureStability.ts'));

const PROFILE_AWARE_SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const failures = [];

console.log('Field source profile-aware feature stability diagnostics');

runHappyFeatureStabilityDiagnostic();
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

function runHappyFeatureStabilityDiagnostic() {
  const report = buildProfileAwareFeatureStabilityReport();

  expectEqual(report.ok, true, 'happy stability ok');
  expectEqual(
    report.method,
    'profile-aware-feature-stability-diagnostic-v0',
    'happy stability method',
  );
  expectEqual(
    report.diagnosticScope,
    'profile-aware-feature-report-stability-only',
    'happy stability scope',
  );
  expectEqual(
    report.sourcePolicyId,
    PROFILE_AWARE_SOURCE_POLICY_ID,
    'happy stability source policy id',
  );
  expectEqual(report.policyRelativityStatus, 'policy-relative', 'happy relativity');
  expectEqual(
    report.contrastPolicyNote,
    'old-policy-not-assumed-invariant',
    'happy contrast note',
  );
  expectEqual(report.semanticStatus, 'not-semantic-naming', 'happy semantic status');
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
  expectEqual(
    report.sensitivitySummary.samplingSensitive,
    true,
    'happy sampling sensitivity',
  );

  if (!report.sensitivitySummary.changedCountKeys.includes('sampleCount')) {
    recordFailure('happy stability: expected sampleCount sensitivity to be reported');
  }

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
      variant.observationStatus,
      'report-candidate',
      `${variant.variantId} observation status`,
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
      `${variant.variantId} observation count total`,
    );
  }

  printStabilityReport('happy stability', report);
}

function runNoInvarianceClaimDiagnostic() {
  const report = buildProfileAwareFeatureStabilityReport();

  expectNoOwnProperty(report, 'invariant', 'no invariant property');
  expectNoOwnProperty(
    report,
    'invariantWithDefaultPolicy',
    'no invariantWithDefaultPolicy property',
  );
  expectNoOwnProperty(
    report,
    'preservesOldFeatures',
    'no preservesOldFeatures property',
  );
  expectNoOwnProperty(
    report,
    'oldFeaturesStillHold',
    'no oldFeaturesStillHold property',
  );

  console.log('no old-policy invariance claim: PASS');
}

function runAdapterDefaultDiagnostic() {
  const report = buildProfileAwareFeatureStabilityReport();

  if (
    report.issues.some((issue) => issue.code === 'adapter-default-execution-mutated')
  ) {
    recordFailure('adapter default execution status changed unexpectedly');
  }

  console.log('adapter default input-only status: PASS');
}

function printStabilityReport(label, report) {
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
    `  total observation range: ${report.sensitivitySummary.observationCountRanges.totalObservationCount.min}-${report.sensitivitySummary.observationCountRanges.totalObservationCount.max}`,
  );
  console.log(`  issues: ${report.issueCount}${formatIssueCounts(report)}`);

  for (const variant of report.variants) {
    console.log(
      `  - ${variant.variantId}: samples=${variant.sampleCount} observations=${variant.totalObservationCount} cancellation=${variant.cancellationLikeObservationCount} high=${variant.highIntensityAnchorObservationCount} ambiguous=${variant.ambiguousObservationCount}`,
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

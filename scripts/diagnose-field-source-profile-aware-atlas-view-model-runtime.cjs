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
const { createSeedShape } = require(path.join(repoRoot, 'src/data/seeds.ts'));
const { applyAmboDissection } = require(path.join(repoRoot, 'src/lib/ambo.ts'));
const {
  buildProfileAwareFieldAtlasViewModelReport,
  buildProfileAwareFieldAtlasViewModelRuntimeReport,
} = require(path.join(
  repoRoot,
  'src/lib/fieldSourceProfileAwareAtlasViewModel.ts',
));

const PROFILE_AWARE_SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const RUNTIME_METHOD = 'profile-aware-field-atlas-view-model-runtime-boundary-v0';
const RUNTIME_SCOPE = 'profile-aware-current-shape-field-mode-boundary-only';
const failures = [];

console.log('Field source profile-aware atlas view-model runtime diagnostics');

runSupportedOneAmboTetrahedronDiagnostic();
runUnsupportedSeedTetrahedronDiagnostic();
runUnsupportedNonTetrahedronDiagnostic();
runCanonicalFixtureDiagnostic();
runNoOldPolicyComparisonDiagnostic();
runNoInvarianceClaimDiagnostic();

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

function runSupportedOneAmboTetrahedronDiagnostic() {
  const shape = applyAmboDissection(createSeedShape('tetrahedron'));
  const beforeShapeJson = JSON.stringify(shape);
  const report = buildProfileAwareFieldAtlasViewModelRuntimeReport(shape);

  expectEqual(
    JSON.stringify(shape),
    beforeShapeJson,
    'supported runtime does not mutate input shape',
  );
  expectRuntimeBoundaryFlags(report, 'supported runtime');
  expectEqual(
    report.runtimeBoundaryStatus,
    'supported',
    'supported runtime boundary status',
  );
  expectEqual(report.ok, true, 'supported runtime ok');
  expectTruthy(report.viewModel, 'supported runtime view model exists');

  if (report.viewModel) {
    expectEqual(
      report.viewModel.shapeId,
      shape.id,
      'supported runtime view model input shape id',
    );
    expectAtLeast(
      report.viewModel.sourceMarkers.length,
      1,
      'supported runtime source markers',
    );
    expectAtLeast(
      report.viewModel.surfaceSampleMarkers.length,
      1,
      'supported runtime surface sample markers',
    );

    if (report.viewModel.featureOverlaySummary.totalObservationCount > 0) {
      expectAtLeast(
        report.viewModel.featureOverlaySummary.featureMarkers.length,
        1,
        'supported runtime feature markers',
      );
      expectEqual(
        report.viewModel.probeIndex.featureProbeCount,
        report.viewModel.featureOverlaySummary.featureMarkers.length,
        'supported runtime feature probe count',
      );
    }
  }

  printRuntimeReport('supported one-Ambo tetrahedron runtime', report);
}

function runUnsupportedSeedTetrahedronDiagnostic() {
  const shape = createSeedShape('tetrahedron');
  const beforeShapeJson = JSON.stringify(shape);
  const report = buildProfileAwareFieldAtlasViewModelRuntimeReport(shape);

  expectEqual(
    JSON.stringify(shape),
    beforeShapeJson,
    'unsupported seed tetrahedron does not mutate input shape',
  );
  expectRuntimeBoundaryFlags(report, 'unsupported seed tetrahedron');
  expectEqual(
    report.runtimeBoundaryStatus,
    'unsupported',
    'unsupported seed tetrahedron boundary status',
  );
  expectEqual(report.ok, false, 'unsupported seed tetrahedron ok');
  expectEqual(report.viewModel, null, 'unsupported seed tetrahedron view model');
  expectEqual(
    report.unsupportedIssueCode,
    'unsupported-shape-context',
    'unsupported seed tetrahedron issue code',
  );
  expectIncludes(
    report.unsupportedReason,
    'currently supports only',
    'unsupported seed tetrahedron reason',
  );

  printRuntimeReport('unsupported seed tetrahedron runtime', report);
}

function runUnsupportedNonTetrahedronDiagnostic() {
  const shape = createSeedShape('cube');
  const beforeShapeJson = JSON.stringify(shape);
  const report = buildProfileAwareFieldAtlasViewModelRuntimeReport(shape);

  expectEqual(
    JSON.stringify(shape),
    beforeShapeJson,
    'unsupported cube does not mutate input shape',
  );
  expectRuntimeBoundaryFlags(report, 'unsupported cube');
  expectEqual(
    report.runtimeBoundaryStatus,
    'unsupported',
    'unsupported cube boundary status',
  );
  expectEqual(report.ok, false, 'unsupported cube ok');
  expectEqual(report.viewModel, null, 'unsupported cube view model');
  expectEqual(
    report.unsupportedIssueCode,
    'unsupported-shape-context',
    'unsupported cube issue code',
  );
  expectIncludes(
    report.unsupportedReason,
    'currently supports only',
    'unsupported cube reason',
  );

  printRuntimeReport('unsupported cube runtime', report);
}

function runCanonicalFixtureDiagnostic() {
  const canonicalReport = buildProfileAwareFieldAtlasViewModelReport();
  const unsupportedShape = createSeedShape('tetrahedron');
  const runtimeReport =
    buildProfileAwareFieldAtlasViewModelRuntimeReport(unsupportedShape);

  expectEqual(canonicalReport.ok, true, 'canonical fixture still ok');
  expectEqual(
    runtimeReport.runtimeBoundaryStatus,
    'unsupported',
    'runtime unsupported did not use canonical fixture',
  );
  expectEqual(
    runtimeReport.viewModel,
    null,
    'runtime unsupported canonical fixture absent',
  );

  console.log('canonical fixture boundary separation: PASS');
}

function runNoOldPolicyComparisonDiagnostic() {
  const supportedShape = applyAmboDissection(createSeedShape('tetrahedron'));
  const supportedReport =
    buildProfileAwareFieldAtlasViewModelRuntimeReport(supportedShape);
  const unsupportedReport = buildProfileAwareFieldAtlasViewModelRuntimeReport(
    createSeedShape('cube'),
  );

  for (const report of [supportedReport, unsupportedReport]) {
    expectNoOwnProperty(report, 'sourcePoliciesCompared', 'no sourcePoliciesCompared');
    expectNoOwnProperty(report, 'defaultPolicyComparison', 'no defaultPolicyComparison');
    expectNoOwnProperty(
      report,
      'parentInheritancePolicyComparison',
      'no parentInheritancePolicyComparison',
    );
    expectNoOwnProperty(report, 'oldDeterministicCounts', 'no oldDeterministicCounts');
    expectNoOwnProperty(report, 'defaultPolicyCounts', 'no defaultPolicyCounts');

    if (report.viewModel) {
      expectNoOwnProperty(
        report.viewModel,
        'sourcePoliciesCompared',
        'view model no sourcePoliciesCompared',
      );
      expectNoOwnProperty(
        report.viewModel,
        'defaultPolicyComparison',
        'view model no defaultPolicyComparison',
      );
    }
  }

  console.log('no old/default policy comparison: PASS');
}

function runNoInvarianceClaimDiagnostic() {
  const supportedShape = applyAmboDissection(createSeedShape('tetrahedron'));
  const supportedReport =
    buildProfileAwareFieldAtlasViewModelRuntimeReport(supportedShape);
  const unsupportedReport = buildProfileAwareFieldAtlasViewModelRuntimeReport(
    createSeedShape('cube'),
  );

  for (const report of [supportedReport, unsupportedReport]) {
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

    if (report.viewModel) {
      expectNoOwnProperty(report.viewModel, 'invariant', 'view model no invariant');
      expectNoOwnProperty(
        report.viewModel,
        'defaultPolicyInvariant',
        'view model no defaultPolicyInvariant',
      );
    }
  }

  console.log('no old-policy invariance claim: PASS');
}

function expectRuntimeBoundaryFlags(report, label) {
  expectEqual(report.method, RUNTIME_METHOD, `${label} method`);
  expectEqual(report.diagnosticScope, RUNTIME_SCOPE, `${label} scope`);
  expectEqual(
    report.sourcePolicyId,
    PROFILE_AWARE_SOURCE_POLICY_ID,
    `${label} source policy`,
  );
  expectEqual(report.policyRelativityStatus, 'policy-relative', `${label} relativity`);
  expectEqual(
    report.contrastPolicyNote,
    'old-policy-not-assumed-invariant',
    `${label} contrast note`,
  );
  expectEqual(report.semanticStatus, 'not-semantic-naming', `${label} semantic`);
  expectEqual(report.topologyStatus, 'not-topology-workspace', `${label} topology`);
  expectEqual(
    report.phaseContinuityStatus,
    'not-global-phase-continuity',
    `${label} phase continuity`,
  );
  expectEqual(
    report.shapeMutationStatus,
    'not-shape-mutation',
    `${label} shape mutation`,
  );
  expectEqual(report.packetWriteStatus, 'not-packet-writing', `${label} packet write`);
  expectEqual(
    report.fieldAtlasSourcePolicyMutationStatus,
    'not-mutated',
    `${label} source policy mutation`,
  );
  expectEqual(
    report.fieldAtlasMutationStatus,
    'not-mutated',
    `${label} field atlas mutation`,
  );
  expectEqual(report.uiExposureStatus, 'not-ui-exposed', `${label} UI exposure`);
  expectEqual(
    report.runtimeIntegrationStatus,
    'not-runtime-integrated',
    `${label} runtime integration`,
  );
}

function printRuntimeReport(label, report) {
  const displayStatus =
    report.runtimeBoundaryStatus === 'unsupported' || report.ok ? 'PASS' : 'FAIL';

  console.log(`${label}: ${displayStatus}`);
  console.log(`  boundary: ${report.runtimeBoundaryStatus}`);
  console.log(`  input shape: ${report.inputShapeId}`);

  if (report.viewModel) {
    console.log(`  view model shape: ${report.viewModel.shapeId}`);
    console.log(
      `  markers: source=${report.viewModel.sourceMarkers.length} sample=${report.viewModel.surfaceSampleMarkers.length} feature=${report.viewModel.featureOverlaySummary.featureMarkers.length}`,
    );
  } else {
    console.log(`  unsupported: ${report.unsupportedIssueCode}`);
  }

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

function expectIncludes(value, expectedSubstring, label) {
  if (typeof value !== 'string' || !value.includes(expectedSubstring)) {
    recordFailure(`${label}: expected "${value}" to include "${expectedSubstring}"`);
  }
}

function expectNoOwnProperty(value, property, label) {
  if (Object.prototype.hasOwnProperty.call(value, property)) {
    recordFailure(`${label}: did not expect property ${property}`);
  }
}

function expectTruthy(value, label) {
  if (!value) {
    recordFailure(`${label}: expected truthy value`);
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

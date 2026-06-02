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
  buildProfileAwareFieldAtlasViewModelRuntimeReport,
} = require(path.join(
  repoRoot,
  'src/lib/fieldSourceProfileAwareAtlasViewModel.ts',
));

const PROFILE_AWARE_SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const failures = [];

console.log('Field source profile-aware Field Mode UI diagnostics');

runSupportedOneAmboTetrahedronContractDiagnostic();
runUnsupportedSeedTetrahedronDiagnostic();
runUnsupportedCubeDiagnostic();
runConservativeBoundaryClaimDiagnostic();
runRouteSupportSummaryOnlyDiagnostic();
runNoOldPolicyComparisonOrInvarianceDiagnostic();

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

function runSupportedOneAmboTetrahedronContractDiagnostic() {
  const shape = applyAmboDissection(createSeedShape('tetrahedron'));
  const beforeShapeJson = JSON.stringify(shape);
  const report = buildProfileAwareFieldAtlasViewModelRuntimeReport(shape);

  expectEqual(
    JSON.stringify(shape),
    beforeShapeJson,
    'supported UI contract does not mutate input shape',
  );
  expectEqual(report.runtimeBoundaryStatus, 'supported', 'supported boundary');
  expectEqual(report.ok, true, 'supported boundary ok');
  expectTruthy(report.viewModel, 'supported view model exists');

  if (report.viewModel) {
    const viewModel = report.viewModel;

    expectEqual(viewModel.ok, true, 'supported view model ok');
    expectEqual(
      viewModel.sourcePolicyId,
      PROFILE_AWARE_SOURCE_POLICY_ID,
      'supported view model source policy',
    );
    expectAtLeast(viewModel.sourceMarkers.length, 1, 'source marker count');
    expectAtLeast(viewModel.surfaceSampleMarkers.length, 1, 'sample marker count');
    expectAtLeast(
      viewModel.featureOverlaySummary.featureMarkers.length,
      1,
      'feature marker count',
    );
    expectEqual(
      viewModel.sourceMarkers.every((marker) => marker.renderKind === 'source-marker'),
      true,
      'source marker render kind',
    );
    expectEqual(
      viewModel.surfaceSampleMarkers.every(
        (marker) => marker.renderKind === 'surface-sample-marker',
      ),
      true,
      'surface sample marker render kind',
    );
    expectEqual(
      viewModel.featureOverlaySummary.featureMarkers.every(
        (marker) => marker.renderKind === 'feature-observation-marker',
      ),
      true,
      'feature marker render kind',
    );
    expectMarkerProbeContracts(viewModel);

    printSupportedReport('supported one-Ambo tetrahedron Field Mode UI', report);
  }
}

function runUnsupportedSeedTetrahedronDiagnostic() {
  runUnsupportedShapeDiagnostic(
    'unsupported seed tetrahedron Field Mode UI',
    createSeedShape('tetrahedron'),
  );
}

function runUnsupportedCubeDiagnostic() {
  runUnsupportedShapeDiagnostic(
    'unsupported cube Field Mode UI',
    createSeedShape('cube'),
  );
}

function runUnsupportedShapeDiagnostic(label, shape) {
  const beforeShapeJson = JSON.stringify(shape);
  const report = buildProfileAwareFieldAtlasViewModelRuntimeReport(shape);

  expectEqual(JSON.stringify(shape), beforeShapeJson, `${label} does not mutate shape`);
  expectEqual(report.runtimeBoundaryStatus, 'unsupported', `${label} boundary`);
  expectEqual(report.ok, false, `${label} ok`);
  expectEqual(report.viewModel, null, `${label} view model`);
  expectEqual(
    report.unsupportedIssueCode,
    'unsupported-shape-context',
    `${label} issue code`,
  );

  printUnsupportedReport(label, report);
}

function runConservativeBoundaryClaimDiagnostic() {
  const reports = [
    buildProfileAwareFieldAtlasViewModelRuntimeReport(
      applyAmboDissection(createSeedShape('tetrahedron')),
    ),
    buildProfileAwareFieldAtlasViewModelRuntimeReport(createSeedShape('tetrahedron')),
    buildProfileAwareFieldAtlasViewModelRuntimeReport(createSeedShape('cube')),
  ];

  for (const report of reports) {
    expectConservativeRuntimeFlags(report, `${report.runtimeBoundaryStatus} report`);

    if (report.viewModel) {
      expectConservativeViewModelFlags(report.viewModel, 'supported view model');
    }
  }

  console.log('conservative Field Mode UI claims: PASS');
}

function runRouteSupportSummaryOnlyDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelRuntimeReport(
    applyAmboDissection(createSeedShape('tetrahedron')),
  );

  if (!report.viewModel) {
    recordFailure('route/support summary-only: supported view model missing');
    return;
  }

  const viewModel = report.viewModel;

  expectEqual(
    viewModel.candidateOverlayStatus,
    'feature-markers-route-support-summary-only',
    'candidate overlay status',
  );
  expectEqual(
    viewModel.routeGateOverlaySummary.overlayStatus,
    'summary-only',
    'route/gate overlay status',
  );
  expectEqual(
    viewModel.supportRegionOverlaySummary.overlayStatus,
    'summary-only',
    'support/region overlay status',
  );
  expectEqual(
    viewModel.routeGateOverlaySummary.candidateRefs.length,
    0,
    'route/gate candidate refs',
  );
  expectEqual(
    viewModel.supportRegionOverlaySummary.candidateRefs.length,
    0,
    'support/region candidate refs',
  );
  expectEqual(viewModel.probeIndex.routeGateProbeCount, 1, 'route/gate summary probe');
  expectEqual(
    viewModel.probeIndex.supportRegionProbeCount,
    1,
    'support/region summary probe',
  );

  console.log('route/gate and support/region summary-only: PASS');
}

function runNoOldPolicyComparisonOrInvarianceDiagnostic() {
  const reports = [
    buildProfileAwareFieldAtlasViewModelRuntimeReport(
      applyAmboDissection(createSeedShape('tetrahedron')),
    ),
    buildProfileAwareFieldAtlasViewModelRuntimeReport(createSeedShape('cube')),
  ];
  const forbiddenProperties = [
    'sourcePoliciesCompared',
    'defaultPolicyComparison',
    'parentInheritancePolicyComparison',
    'oldDeterministicCounts',
    'defaultPolicyCounts',
    'invariant',
    'invariantWithDefaultPolicy',
    'preservesOldEvidence',
    'oldEvidenceStillHold',
    'matchesDefaultEvidence',
    'defaultPolicyInvariant',
    'persistenceStatus',
    'workspacePersistenceStatus',
    'packetWritingStatus',
    'semanticNamingStatus',
    'topologyBehaviorStatus',
  ];

  for (const report of reports) {
    for (const property of forbiddenProperties) {
      expectNoOwnProperty(report, property, `runtime no ${property}`);
    }

    if (report.viewModel) {
      for (const property of forbiddenProperties) {
        expectNoOwnProperty(report.viewModel, property, `view model no ${property}`);
      }
    }
  }

  console.log('no old-policy comparison or invariance claim: PASS');
}

function expectMarkerProbeContracts(viewModel) {
  const sampleIds = new Set(
    viewModel.surfaceSampleMarkers.map((marker) => marker.sampleId),
  );

  for (const marker of viewModel.sourceMarkers) {
    const probe = viewModel.probeIndex.probes[marker.probeRef];

    expectTruthy(probe, `source marker ${marker.sourceId} probe`);
    expectEqual(
      probe && probe.probeKind,
      'source',
      `source marker ${marker.sourceId} probe kind`,
    );
    expectEqual(
      probe && probe.sourceId,
      marker.sourceId,
      `source marker ${marker.sourceId} probe source id`,
    );
  }

  for (const marker of viewModel.surfaceSampleMarkers) {
    const probe = viewModel.probeIndex.probes[marker.probeRef];

    expectTruthy(probe, `sample marker ${marker.sampleId} probe`);
    expectEqual(
      probe && probe.probeKind,
      'surface-sample',
      `sample marker ${marker.sampleId} probe kind`,
    );
    expectEqual(
      probe && probe.sampleId,
      marker.sampleId,
      `sample marker ${marker.sampleId} probe sample id`,
    );
  }

  for (const marker of viewModel.featureOverlaySummary.featureMarkers) {
    expectEqual(
      sampleIds.has(marker.sampleId),
      true,
      `feature marker ${marker.featureId} sample link`,
    );

    const probe = viewModel.probeIndex.probes[marker.probeRef];

    expectTruthy(probe, `feature marker ${marker.featureId} probe`);
    expectEqual(
      probe && probe.probeKind,
      'feature-observation',
      `feature marker ${marker.featureId} probe kind`,
    );
    expectEqual(
      probe && probe.linkedSampleProbeRef,
      `sample:${marker.sampleId}`,
      `feature marker ${marker.featureId} linked sample probe`,
    );
    if (probe && probe.linkedSampleProbeRef) {
      expectTruthy(
        viewModel.probeIndex.probes[probe.linkedSampleProbeRef],
        `feature marker ${marker.featureId} linked sample probe exists`,
      );
    }
  }

  console.log('marker hover probe refs resolve: PASS');
}

function expectConservativeRuntimeFlags(report, label) {
  expectEqual(report.sourcePolicyId, PROFILE_AWARE_SOURCE_POLICY_ID, `${label} policy`);
  expectEqual(report.policyRelativityStatus, 'policy-relative', `${label} relativity`);
  expectEqual(report.semanticStatus, 'not-semantic-naming', `${label} semantic`);
  expectEqual(report.topologyStatus, 'not-topology-workspace', `${label} topology`);
  expectEqual(report.shapeMutationStatus, 'not-shape-mutation', `${label} mutation`);
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
}

function expectConservativeViewModelFlags(viewModel, label) {
  expectEqual(viewModel.sourcePolicyId, PROFILE_AWARE_SOURCE_POLICY_ID, `${label} policy`);
  expectEqual(
    viewModel.policyRelativityStatus,
    'policy-relative',
    `${label} relativity`,
  );
  expectEqual(viewModel.semanticStatus, 'not-semantic-naming', `${label} semantic`);
  expectEqual(viewModel.topologyStatus, 'not-topology-workspace', `${label} topology`);
  expectEqual(viewModel.shapeMutationStatus, 'not-shape-mutation', `${label} mutation`);
  expectEqual(
    viewModel.packetWriteStatus,
    'not-packet-writing',
    `${label} packet write`,
  );
  expectEqual(
    viewModel.fieldAtlasSourcePolicyMutationStatus,
    'not-mutated',
    `${label} source policy mutation`,
  );
  expectEqual(
    viewModel.fieldAtlasMutationStatus,
    'not-mutated',
    `${label} field atlas mutation`,
  );
}

function printSupportedReport(label, report) {
  console.log(`${label}: PASS`);
  console.log(`  boundary: ${report.runtimeBoundaryStatus}`);
  console.log(`  input shape: ${report.inputShapeId}`);
  console.log(`  source policy: ${report.sourcePolicyId}`);
  console.log(
    `  markers: source=${report.viewModel.sourceMarkers.length} sample=${report.viewModel.surfaceSampleMarkers.length} feature=${report.viewModel.featureOverlaySummary.featureMarkers.length}`,
  );
  console.log(
    `  candidate summaries: route/gate=${report.viewModel.routeGateOverlaySummary.totalRouteGateCandidateCount} support/region=${report.viewModel.supportRegionOverlaySummary.totalSupportRegionCandidateCount}`,
  );
}

function printUnsupportedReport(label, report) {
  console.log(`${label}: PASS`);
  console.log(`  boundary: ${report.runtimeBoundaryStatus}`);
  console.log(`  input shape: ${report.inputShapeId}`);
  console.log(`  unsupported: ${report.unsupportedIssueCode}`);
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

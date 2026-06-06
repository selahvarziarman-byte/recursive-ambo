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
  buildProfileAwareFieldAtlasViewModelReport,
} = require(path.join(
  repoRoot,
  'src/lib/fieldSourceProfileAwareAtlasViewModel.ts',
));

const PROFILE_AWARE_SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const RATIO_SUM_TOLERANCE = 1e-9;
const failures = [];

console.log('Field source profile-aware atlas view-model diagnostics');

runHappyViewModelDiagnostic();
runBoundaryFlagDiagnostic();
runViewModelStatusDiagnostic();
runSourceMarkerDiagnostic();
runSurfaceSampleMarkerDiagnostic();
runFeatureMarkerDiagnostic();
runRenderScaleDiagnostic();
runProbeIndexDiagnostic();
runChildSourceProbeDerivationDiagnostic();
runCandidateSummaryCoherenceDiagnostic();
runRouteGateAndSupportRegionCandidateOverlayDiagnostic();
runNoOldPolicyComparisonDiagnostic();
runNoInvarianceClaimDiagnostic();
runNoForbiddenClaimsDiagnostic();

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

function runHappyViewModelDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelReport();

  expectEqual(report.ok, true, 'happy view model ok');
  expectEqual(
    report.method,
    'profile-aware-field-atlas-view-model-diagnostic-v0',
    'happy view model method',
  );
  expectEqual(
    report.diagnosticScope,
    'profile-aware-field-atlas-view-model-only',
    'happy view model scope',
  );
  expectEqual(
    report.sourcePolicyId,
    PROFILE_AWARE_SOURCE_POLICY_ID,
    'happy view model source policy id',
  );
  expectAtLeast(report.chartCount, 1, 'happy chart count');
  expectAtLeast(report.sampleCount, 1, 'happy sample count');
  expectAtLeast(report.sourceCount, 1, 'happy source count');
  expectEqual(report.issueCount, 0, 'happy issue count');

  printViewModelReport('happy view model', report);
}

function runBoundaryFlagDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelReport();

  expectEqual(
    report.sourcePolicyId,
    PROFILE_AWARE_SOURCE_POLICY_ID,
    'boundary source policy',
  );
  expectEqual(report.policyRelativityStatus, 'policy-relative', 'boundary relativity');
  expectEqual(
    report.contrastPolicyNote,
    'old-policy-not-assumed-invariant',
    'boundary contrast note',
  );
  expectEqual(report.semanticStatus, 'not-semantic-naming', 'boundary semantic');
  expectEqual(report.topologyStatus, 'not-topology-workspace', 'boundary topology');
  expectEqual(
    report.phaseContinuityStatus,
    'not-global-phase-continuity',
    'boundary phase continuity',
  );
  expectEqual(
    report.shapeMutationStatus,
    'not-shape-mutation',
    'boundary shape mutation',
  );
  expectEqual(
    report.packetWriteStatus,
    'not-packet-writing',
    'boundary packet write',
  );
  expectEqual(
    report.fieldAtlasSourcePolicyMutationStatus,
    'not-mutated',
    'boundary source policy mutation',
  );
  expectEqual(
    report.fieldAtlasMutationStatus,
    'not-mutated',
    'boundary field atlas mutation',
  );

  console.log('boundary flags: PASS');
}

function runViewModelStatusDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelReport();

  expectEqual(
    report.productRole,
    'field-mode-render-and-probe-contract',
    'product role',
  );
  expectEqual(
    report.integrationStatus,
    'diagnostic-view-model-only',
    'integration status',
  );
  expectEqual(
    report.runtimeIntegrationStatus,
    'not-runtime-integrated',
    'runtime integration status',
  );
  expectEqual(report.uiExposureStatus, 'not-ui-exposed', 'ui exposure status');
  expectEqual(
    report.renderModelStatus,
    'renderable-diagnostic-model',
    'render model status',
  );
  expectEqual(
    report.probeModelStatus,
    'probe-ready-diagnostic-model',
    'probe model status',
  );
  expectEqual(
    report.candidateOverlayStatus,
    'feature-route-gate-and-support-region-candidate-markers',
    'candidate overlay status',
  );

  console.log('view-model statuses: PASS');
}

function runSourceMarkerDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelReport();
  const primalMarkers = report.sourceMarkers.filter((marker) => marker.isPrimalSource);
  const renderableChildMarkers = report.sourceMarkers.filter(
    (marker) => marker.isGeneratedChildSource,
  );
  const generatedChildContractEntryCount =
    renderableChildMarkers.length + report.sourceCaveatMarkers.length;

  expectAtLeast(report.sourceMarkers.length, 1, 'source markers exist');
  expectAtLeast(primalMarkers.length, 4, 'primal source markers');
  expectAtLeast(
    generatedChildContractEntryCount,
    6,
    'one-Ambo generated child source entries',
  );
  expectEqual(
    report.sourceCaveatMarkers.length,
    report.fallbackChildSourceCount + report.unresolvedChildSourceCount,
    'source caveat marker count',
  );

  for (const marker of report.sourceMarkers) {
    expectFiniteVec3(marker.position, `${marker.sourceId} position`);
    expectFinite(marker.amplitude, `${marker.sourceId} amplitude`);
    expectFinite(marker.waveNumber, `${marker.sourceId} waveNumber`);
    expectFinite(marker.phase, `${marker.sourceId} phase`);
    expectFinite(marker.attenuation, `${marker.sourceId} attenuation`);

    if (marker.isGeneratedChildSource) {
      expectTruthy(marker.sourceEdgeId, `${marker.sourceId} sourceEdgeId`);
      expectTruthy(marker.complementEdgeId, `${marker.sourceId} complementEdgeId`);
      expectTruthy(
        marker.antipodalChildVertexId,
        `${marker.sourceId} antipodalChildVertexId`,
      );
    }
  }

  for (const marker of report.sourceCaveatMarkers) {
    if (marker.position) {
      expectFiniteVec3(marker.position, `${marker.sourceId} caveat position`);
    }

    expectEqual(marker.renderable, false, `${marker.sourceId} caveat renderable`);
    expectTruthy(marker.sourceEdgeId, `${marker.sourceId} caveat sourceEdgeId`);
    expectTruthy(
      marker.complementEdgeId,
      `${marker.sourceId} caveat complementEdgeId`,
    );
    expectTruthy(
      marker.antipodalChildVertexId,
      `${marker.sourceId} caveat antipodalChildVertexId`,
    );
  }

  console.log('source markers and caveats: PASS');
}

function runSurfaceSampleMarkerDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelReport();

  expectAtLeast(report.surfaceSampleMarkers.length, 1, 'sample markers exist');

  for (const marker of report.surfaceSampleMarkers) {
    expectFiniteVec3(marker.position, `${marker.sampleId} position`);
    expectFinite(marker.intensity, `${marker.sampleId} intensity`);
    expectFinite(marker.phase, `${marker.sampleId} phase`);
    expectAtLeast(marker.intensity, 0, `${marker.sampleId} nonnegative intensity`);

    if (marker.contributionRatios.length > 0) {
      for (const ratio of marker.contributionRatios) {
        expectFinite(ratio.value, `${marker.sampleId} ratio ${ratio.sourceId}`);
        expectAtLeast(
          ratio.value,
          0,
          `${marker.sampleId} nonnegative ratio ${ratio.sourceId}`,
        );
      }

      expectApprox(
        marker.contributionRatioSum,
        1,
        RATIO_SUM_TOLERANCE,
        `${marker.sampleId} contribution ratio sum`,
      );
    }
  }

  console.log('surface sample markers: PASS');
}

function runFeatureMarkerDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelReport();
  const feature = report.featureOverlaySummary;
  const sampleIds = new Set(report.surfaceSampleMarkers.map((marker) => marker.sampleId));

  if (feature.totalObservationCount > 0) {
    expectAtLeast(feature.featureMarkers.length, 1, 'feature markers exist');
    expectEqual(
      feature.overlayStatus,
      'feature-markers-available',
      'feature marker overlay status',
    );
  }

  expectEqual(
    feature.featureMarkers.length,
    feature.totalObservationCount,
    'feature marker observation count',
  );
  expectEqual(
    countFeatureKind(feature.featureMarkers, 'cancellation-like-site-candidate'),
    feature.cancellationLikeObservationCount,
    'cancellation-like feature marker count',
  );
  expectEqual(
    countFeatureKind(feature.featureMarkers, 'high-intensity-anchor-candidate'),
    feature.highIntensityAnchorObservationCount,
    'high-intensity anchor feature marker count',
  );
  expectEqual(
    countFeatureKind(feature.featureMarkers, 'ambiguous-field-site'),
    feature.ambiguousObservationCount,
    'ambiguous feature marker count',
  );

  for (const marker of feature.featureMarkers) {
    expectFiniteVec3(marker.position, `${marker.featureId} position`);
    expectFiniteVec2(
      marker.localChartPosition,
      `${marker.featureId} local chart position`,
    );
    expectFinite(marker.intensity, `${marker.featureId} intensity`);
    expectFinite(marker.phase, `${marker.featureId} phase`);
    expectFinite(marker.relativeIntensity, `${marker.featureId} relative intensity`);
    expectFinite(
      marker.topContributionRatio,
      `${marker.featureId} top contribution ratio`,
    );
    expectEqual(marker.status, 'report-candidate', `${marker.featureId} status`);
    expectEqual(
      marker.semanticStatus,
      'not-semantic-naming',
      `${marker.featureId} semantic status`,
    );
    expectProfileAwareSourcePolicyNames(
      marker.sourcePolicyNames,
      `${marker.featureId} source policy names`,
    );
    expectTruthy(marker.probeRef, `${marker.featureId} probe ref`);

    if (!sampleIds.has(marker.sampleId)) {
      recordFailure(`${marker.featureId}: expected linked sample ${marker.sampleId}`);
    }
  }

  console.log('feature markers: PASS');
}

function runRenderScaleDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelReport();
  const scale = report.renderScale;

  expectAtMost(scale.intensityMin, scale.intensityMax, 'intensity range');
  expectAtMost(scale.phaseMin, scale.phaseMax, 'phase range');
  expectAtMost(
    scale.dominantContributionRatioMin,
    scale.dominantContributionRatioMax,
    'dominant contribution range',
  );
  expectEqual(
    scale.sampleCount,
    report.surfaceSampleMarkers.length,
    'scale sample count',
  );
  expectEqual(scale.sourceCount, report.sourceMarkers.length, 'scale source count');

  console.log('render scales: PASS');
}

function runProbeIndexDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelReport();

  expectEqual(
    report.probeIndex.sourceProbeCount,
    report.sourceMarkers.length,
    'source probe count',
  );
  expectEqual(
    report.probeIndex.sampleProbeCount,
    report.surfaceSampleMarkers.length,
    'sample probe count',
  );
  expectEqual(
    report.probeIndex.featureProbeCount,
    report.featureOverlaySummary.featureMarkers.length,
    'feature probe count',
  );
  expectAtLeast(report.probeIndex.probeCount, 3, 'probe count');

  for (const marker of report.sourceMarkers) {
    const probe = report.probeIndex.probes[marker.probeRef];

    expectTruthy(probe, `${marker.sourceId} source probe resolves`);
    expectEqual(probe && probe.probeKind, 'source', `${marker.sourceId} probe kind`);
    expectEqual(
      probe && probe.sourceId,
      marker.sourceId,
      `${marker.sourceId} probe source id`,
    );
  }

  for (const marker of report.surfaceSampleMarkers) {
    const probe = report.probeIndex.probes[marker.probeRef];

    expectTruthy(probe, `${marker.sampleId} sample probe resolves`);
    expectEqual(
      probe && probe.probeKind,
      'surface-sample',
      `${marker.sampleId} probe kind`,
    );
    expectEqual(
      probe && probe.sampleId,
      marker.sampleId,
      `${marker.sampleId} probe sample id`,
    );
  }

  for (const marker of report.featureOverlaySummary.featureMarkers) {
    const probe = report.probeIndex.probes[marker.probeRef];

    if (!probe) {
      recordFailure(`${marker.featureId}: expected feature probe to resolve`);
      continue;
    }

    expectEqual(probe.probeKind, 'feature-observation', `${marker.featureId} probe kind`);
    expectEqual(
      probe.linkedSampleProbeRef,
      `sample:${marker.sampleId}`,
      `${marker.featureId} linked sample probe ref`,
    );
    expectEqual(probe.status, 'report-candidate', `${marker.featureId} probe status`);
    expectEqual(
      probe.semanticStatus,
      'not-semantic-naming',
      `${marker.featureId} probe semantic status`,
    );
  }

  expectTruthy(
    report.probeIndex.probes['routeGate:summary'],
    'route/gate summary probe',
  );
  expectEqual(
    report.probeIndex.routeGateCandidateProbeCount,
    report.routeGateOverlaySummary.candidateMarkers.length,
    'route/gate candidate probe count',
  );
  expectEqual(
    report.probeIndex.routeGateSummaryProbeCount,
    1,
    'route/gate summary probe count',
  );
  expectEqual(
    report.probeIndex.routeGateProbeCount,
    report.routeGateOverlaySummary.candidateMarkers.length + 1,
    'route/gate total probe count',
  );
  expectTruthy(
    report.probeIndex.probes['supportRegion:summary'],
    'support/region summary probe',
  );
  expectEqual(
    report.probeIndex.supportRegionCandidateProbeCount,
    report.supportRegionOverlaySummary.candidateMarkers.length,
    'support/region candidate probe count',
  );
  expectEqual(
    report.probeIndex.supportRegionSummaryProbeCount,
    1,
    'support/region summary probe count',
  );
  expectEqual(
    report.probeIndex.supportRegionProbeCount,
    report.supportRegionOverlaySummary.candidateMarkers.length + 1,
    'support/region total probe count',
  );

  console.log('probe index: PASS');
}

function runChildSourceProbeDerivationDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelReport();
  const sourceProbes = report.sourceMarkers
    .map((marker) => report.probeIndex.probes[marker.probeRef])
    .filter((probe) => probe && probe.probeKind === 'source');
  const generatedChildSourceProbes = sourceProbes.filter(
    (probe) => probe.sourceKind === 'generated-child-derived',
  );
  const primalSourceProbes = sourceProbes.filter(
    (probe) => probe.sourceKind === 'primal-assigned',
  );

  expectAtLeast(
    generatedChildSourceProbes.length,
    1,
    'generated child source probes',
  );

  for (const probe of generatedChildSourceProbes) {
    expectTruthy(probe.childDerivation, `${probe.sourceId} child derivation`);

    if (probe.childDerivation) {
      expectChildDerivationProbe(probe.childDerivation, probe.sourceId);
    }
  }

  for (const probe of primalSourceProbes) {
    expectNoOwnProperty(
      probe,
      'childDerivation',
      `${probe.sourceId} primal childDerivation`,
    );
  }

  console.log('child source derivation probes: PASS');
}

function expectChildDerivationProbe(derivation, label) {
  expectEqual(derivation.childRole, 'shared-90-pole', `${label} child role`);
  expectTruthy(derivation.sourceEdgeId, `${label} sourceEdgeId`);
  expectEqual(
    Array.isArray(derivation.sourceEdgeVertexIds) &&
      derivation.sourceEdgeVertexIds.length,
    2,
    `${label} source edge vertex ids`,
  );
  expectTruthy(derivation.complementEdgeId, `${label} complementEdgeId`);
  expectEqual(
    Array.isArray(derivation.complementEdgeVertexIds) &&
      derivation.complementEdgeVertexIds.length,
    2,
    `${label} complement edge vertex ids`,
  );
  expectTruthy(
    derivation.antipodalChildVertexId,
    `${label} antipodal child vertex id`,
  );
  expectEqual(
    Array.isArray(derivation.projectionVertexIds) &&
      derivation.projectionVertexIds.length,
    2,
    `${label} projection vertex ids`,
  );
  expectEqual(
    typeof derivation.grammarId === 'string' &&
      (derivation.grammarId.includes('tetrahedral') ||
        derivation.grammarId.includes('profile-aware')),
    true,
    `${label} grammar id`,
  );
  expectEqual(derivation.mergeKind, 'four-channel-merge', `${label} merge kind`);
  expectEqual(derivation.quarkChannels.length, 4, `${label} quark channel count`);
  expectEqual(
    Array.isArray(derivation.degeneracyStatuses),
    true,
    `${label} degeneracy statuses`,
  );

  for (const [key, value] of Object.entries(derivation.ratio)) {
    expectFinite(value, `${label} ratio ${key}`);
  }

  for (const channel of derivation.quarkChannels) {
    expectTruthy(channel.channelId, `${label} channel id`);
    expectTruthy(channel.child90, `${label} channel child90`);
    expectTruthy(channel.parent60, `${label} channel parent60`);
    expectTruthy(channel.projection30, `${label} channel projection30`);
    expectTruthy(channel.parentProfileId, `${label} channel parent profile`);
    expectTruthy(
      channel.projectionProfileId,
      `${label} channel projection profile`,
    );
    expectFinite(channel.parentWeight, `${label} channel parent weight`);
    expectFinite(channel.projectionWeight, `${label} channel projection weight`);
    expectFiniteChannelParameters(
      channel.channelParameters,
      `${label} channel ${channel.channelId}`,
    );
  }

  if (derivation.derivedParameters) {
    expectFiniteChannelParameters(
      derivation.derivedParameters,
      `${label} derived parameters`,
    );
  }
}

function runCandidateSummaryCoherenceDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelReport();
  const feature = report.featureOverlaySummary;
  const routeGate = report.routeGateOverlaySummary;
  const supportRegion = report.supportRegionOverlaySummary;

  expectEqual(
    feature.totalObservationCount,
    feature.cancellationLikeObservationCount +
      feature.highIntensityAnchorObservationCount +
      feature.ambiguousObservationCount,
    'feature observation total',
  );
  expectEqual(
    routeGate.totalRouteGateCandidateCount,
    routeGate.gateCandidateCount +
      routeGate.routeCandidateCount +
      routeGate.blockedRouteCandidateCount,
    'route/gate candidate total',
  );
  expectEqual(
    supportRegion.totalSupportRegionCandidateCount,
    supportRegion.supportClassCandidateCount +
      supportRegion.regionCandidateCount +
      supportRegion.constraintSiteCandidateCount +
      supportRegion.routeFailureRegionCandidateCount,
    'support/region candidate total',
  );

  console.log('candidate summaries: PASS');
}

function runRouteGateAndSupportRegionCandidateOverlayDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelReport();
  const routeGate = report.routeGateOverlaySummary;
  const supportRegion = report.supportRegionOverlaySummary;

  expectEqual(
    routeGate.overlayStatus,
    'route-gate-candidate-anchors-available',
    'route/gate overlay status',
  );
  expectAtLeast(
    routeGate.candidateMarkers.length,
    1,
    'route/gate candidate marker count',
  );
  expectEqual(
    routeGate.candidateMarkers.length,
    routeGate.totalRouteGateCandidateCount,
    'route/gate candidate marker total',
  );
  expectEqual(
    routeGate.candidateRefs.length,
    routeGate.candidateMarkers.length,
    'route/gate candidate refs',
  );

  for (const marker of routeGate.candidateMarkers) {
    const probe = report.probeIndex.probes[marker.probeRef];

    expectEqual(
      marker.renderKind,
      'route-gate-candidate-anchor-marker',
      `${marker.candidateId} render kind`,
    );
    expectEqual(marker.status, 'candidate-only', `${marker.candidateId} status`);
    expectEqual(
      marker.semanticStatus,
      'not-semantic-naming',
      `${marker.candidateId} semantic status`,
    );
    expectEqual(
      marker.topologyStatus,
      'not-topology-workspace',
      `${marker.candidateId} topology status`,
    );
    expectEqual(
      marker.phaseContinuityStatus,
      'not-global-phase-continuity',
      `${marker.candidateId} phase continuity status`,
    );
    expectProfileAwareSourcePolicyNames(
      marker.sourcePolicyNames,
      `${marker.candidateId} source policy names`,
    );
    expectTruthy(marker.probeRef, `${marker.candidateId} probe ref`);
    expectTruthy(probe, `${marker.candidateId} route/gate probe resolves`);
    expectEqual(
      probe && probe.probeKind,
      'route-gate-candidate',
      `${marker.candidateId} probe kind`,
    );

    if (marker.position) {
      expectFiniteVec3(marker.position, `${marker.candidateId} anchor position`);
    }
  }

  expectEqual(
    supportRegion.overlayStatus,
    'support-region-candidate-anchors-available',
    'support/region overlay status',
  );
  expectAtLeast(
    supportRegion.candidateMarkers.length,
    1,
    'support/region candidate marker count',
  );
  expectEqual(
    supportRegion.candidateMarkers.length,
    supportRegion.totalSupportRegionCandidateCount,
    'support/region candidate marker total',
  );
  expectEqual(
    supportRegion.candidateRefs.length,
    supportRegion.candidateMarkers.length,
    'support/region candidate refs',
  );

  for (const marker of supportRegion.candidateMarkers) {
    const probe = report.probeIndex.probes[marker.probeRef];

    expectEqual(
      marker.renderKind,
      'support-region-candidate-anchor-marker',
      `${marker.candidateId} render kind`,
    );
    expectEqual(marker.status, 'candidate-only', `${marker.candidateId} status`);
    expectEqual(
      marker.semanticStatus,
      'not-semantic-naming',
      `${marker.candidateId} semantic status`,
    );
    expectEqual(
      marker.topologyStatus,
      'not-topology-workspace',
      `${marker.candidateId} topology status`,
    );
    expectEqual(
      marker.phaseContinuityStatus,
      'not-global-phase-continuity',
      `${marker.candidateId} phase continuity status`,
    );
    expectProfileAwareSourcePolicyNames(
      marker.sourcePolicyNames,
      `${marker.candidateId} source policy names`,
    );
    expectTruthy(marker.probeRef, `${marker.candidateId} probe ref`);
    expectTruthy(probe, `${marker.candidateId} support/region probe resolves`);
    expectEqual(
      probe && probe.probeKind,
      'support-region-candidate',
      `${marker.candidateId} probe kind`,
    );

    if (marker.position) {
      expectFiniteVec3(marker.position, `${marker.candidateId} anchor position`);
    }
  }

  console.log('route/gate and support/region candidate anchors: PASS');
}

function runNoOldPolicyComparisonDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelReport();

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
  const report = buildProfileAwareFieldAtlasViewModelReport();

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

function runNoForbiddenClaimsDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelReport();
  const forbiddenProperties = [
    'supportRegionGeometryStatus',
    'filledRegionGeometryStatus',
    'meshRegionStatus',
    'topologyBehaviorStatus',
    'routePathGeometryStatus',
  ];

  expectEqual(report.uiExposureStatus, 'not-ui-exposed', 'no UI exposure');
  expectEqual(report.semanticStatus, 'not-semantic-naming', 'no semantic naming');
  expectEqual(report.topologyStatus, 'not-topology-workspace', 'no topology');
  expectEqual(report.packetWriteStatus, 'not-packet-writing', 'no packet writing');
  expectEqual(report.shapeMutationStatus, 'not-shape-mutation', 'no shape mutation');

  for (const property of forbiddenProperties) {
    expectNoOwnProperty(report, property, `view model no ${property}`);
  }

  console.log('no forbidden claims: PASS');
}

function printViewModelReport(label, report) {
  console.log(`${label}: ${report.ok ? 'PASS' : 'FAIL'}`);
  console.log(
    `  shape/domain: ${report.shapeId} / ${report.domainId ?? 'none'} (${report.domainKind ?? 'none'})`,
  );
  console.log(
    `  sources: renderable=${report.sourceCount} primal=${report.primalSourceCount} child=${report.childSourceCount} renderableChild=${report.renderableChildSourceCount} caveatChild=${report.nonRenderableChildSourceCount}`,
  );
  console.log(
    `  samples/charts: samples=${report.sampleCount} charts=${report.chartCount}`,
  );
  console.log(
    `  overlays: featureMarkers=${report.featureOverlaySummary.featureMarkers.length} routeGate=${report.routeGateOverlaySummary.totalRouteGateCandidateCount} supportRegion=${report.supportRegionOverlaySummary.totalSupportRegionCandidateCount} status=${report.candidateOverlayStatus}`,
  );
  console.log(
    `  probes: source=${report.probeIndex.sourceProbeCount} sample=${report.probeIndex.sampleProbeCount} feature=${report.probeIndex.featureProbeCount} routeGate=${report.probeIndex.routeGateProbeCount} supportRegion=${report.probeIndex.supportRegionProbeCount} total=${report.probeIndex.probeCount}`,
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

function expectTruthy(value, label) {
  if (!value) {
    recordFailure(`${label}: expected truthy value`);
  }
}

function expectFiniteVec3(position, label) {
  if (!Array.isArray(position) || position.length !== 3) {
    recordFailure(`${label}: expected Vec3`);
    return;
  }

  for (let index = 0; index < 3; index += 1) {
    expectFinite(position[index], `${label}[${index}]`);
  }
}

function expectFiniteVec2(position, label) {
  if (!Array.isArray(position) || position.length !== 2) {
    recordFailure(`${label}: expected Vec2`);
    return;
  }

  for (let index = 0; index < 2; index += 1) {
    expectFinite(position[index], `${label}[${index}]`);
  }
}

function expectFiniteChannelParameters(parameters, label) {
  expectFinite(parameters && parameters.amplitude, `${label} amplitude`);
  expectFinite(parameters && parameters.waveNumber, `${label} waveNumber`);
  expectFinite(parameters && parameters.phase, `${label} phase`);
  expectFinite(parameters && parameters.attenuation, `${label} attenuation`);
}

function expectProfileAwareSourcePolicyNames(sourcePolicyNames, label) {
  if (
    !Array.isArray(sourcePolicyNames) ||
    sourcePolicyNames.length !== 1 ||
    sourcePolicyNames[0] !== PROFILE_AWARE_SOURCE_POLICY_ID
  ) {
    recordFailure(
      `${label}: expected exactly ${PROFILE_AWARE_SOURCE_POLICY_ID}, got ${
        Array.isArray(sourcePolicyNames) ? sourcePolicyNames.join(',') : sourcePolicyNames
      }`,
    );
  }
}

function countFeatureKind(markers, observationKind) {
  return markers.filter((marker) => marker.observationKind === observationKind).length;
}

function expectFinite(value, label) {
  if (!Number.isFinite(value)) {
    recordFailure(`${label}: expected finite number, got ${value}`);
  }
}

function expectAtLeast(actual, expectedMinimum, label) {
  if (actual < expectedMinimum) {
    recordFailure(`${label}: expected at least ${expectedMinimum}, got ${actual}`);
  }
}

function expectAtMost(actual, expectedMaximum, label) {
  if (actual > expectedMaximum) {
    recordFailure(`${label}: expected at most ${expectedMaximum}, got ${actual}`);
  }
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    recordFailure(`${label}: expected ${expected}, got ${actual}`);
  }
}

function expectApprox(actual, expected, tolerance, label) {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) {
    recordFailure(`${label}: expected ${expected} +/- ${tolerance}, got ${actual}`);
  }
}

function recordFailure(message) {
  failures.push(message);
}

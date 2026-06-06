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
const SAMPLE_RENDER_MODES = ['family', 'intensity', 'phase', 'dominance'];
const failures = [];

console.log('Field source profile-aware Field Mode UI diagnostics');

runSupportedOneAmboTetrahedronContractDiagnostic();
runLayerVisibilityContractDiagnostic();
runSampleRenderModeContractDiagnostic();
runChartLinkingContractDiagnostic();
runUnsupportedSeedTetrahedronDiagnostic();
runUnsupportedCubeDiagnostic();
runConservativeBoundaryClaimDiagnostic();
runRouteGateAndSupportRegionCandidateOverlayDiagnostic();
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
    expectTruthy(viewModel.chartOverlaySummary, 'chart overlay summary exists');
    expectEqual(
      viewModel.chartOverlaySummary.chartAnchorMarkers.length,
      viewModel.chartSummaries.length,
      'chart overlay marker count',
    );
    expectEqual(
      viewModel.chartOverlaySummary.directChartCount +
        viewModel.chartOverlaySummary.computationalChartCount,
      viewModel.chartOverlaySummary.chartAnchorMarkers.length,
      'chart overlay direct/computational count',
    );
    expectAtLeast(viewModel.sourceMarkers.length, 1, 'source marker count');
    expectAtLeast(viewModel.surfaceSampleMarkers.length, 1, 'sample marker count');
    expectAtLeast(
      viewModel.chartOverlaySummary.chartAnchorMarkers.length,
      1,
      'chart anchor marker count',
    );
    expectAtLeast(
      viewModel.featureOverlaySummary.featureMarkers.length,
      1,
      'feature marker count',
    );
    expectAtLeast(
      viewModel.routeGateOverlaySummary.candidateMarkers.length,
      1,
      'route/gate candidate anchor count',
    );
    expectAtLeast(
      viewModel.supportRegionOverlaySummary.candidateMarkers.length,
      1,
      'support/region candidate anchor count',
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
      viewModel.chartOverlaySummary.chartAnchorMarkers.every(
        (marker) => marker.renderKind === 'chart-summary-anchor-marker',
      ),
      true,
      'chart anchor marker render kind',
    );
    expectEqual(
      viewModel.featureOverlaySummary.featureMarkers.every(
        (marker) => marker.renderKind === 'feature-observation-marker',
      ),
      true,
      'feature marker render kind',
    );
    expectEqual(
      viewModel.routeGateOverlaySummary.candidateMarkers.every(
        (marker) => marker.renderKind === 'route-gate-candidate-anchor-marker',
      ),
      true,
      'route/gate candidate marker render kind',
    );
    expectEqual(
      viewModel.supportRegionOverlaySummary.candidateMarkers.every(
        (marker) => marker.renderKind === 'support-region-candidate-anchor-marker',
      ),
      true,
      'support/region candidate marker render kind',
    );
    expectMarkerProbeContracts(viewModel);
    expectSimulatedPinnedProbeRefsResolve(viewModel);

    printSupportedReport('supported one-Ambo tetrahedron Field Mode UI', report);
  }
}

function runUnsupportedSeedTetrahedronDiagnostic() {
  runUnsupportedShapeDiagnostic(
    'unsupported seed tetrahedron Field Mode UI',
    createSeedShape('tetrahedron'),
  );
}

function runLayerVisibilityContractDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelRuntimeReport(
    applyAmboDissection(createSeedShape('tetrahedron')),
  );

  if (!report.viewModel) {
    recordFailure('layer visibility contract: supported view model missing');
    return;
  }

  const viewModel = report.viewModel;
  const familyCounts = getLayerFamilyCounts(viewModel);
  const allVisible = simulateLayerVisibilityFilter(viewModel, {
    sources: true,
    samples: true,
    charts: true,
    features: true,
    routeGateCandidates: true,
    supportRegionCandidates: true,
  });
  const onlySources = simulateLayerVisibilityFilter(viewModel, {
    sources: true,
    samples: false,
    charts: false,
    features: false,
    routeGateCandidates: false,
    supportRegionCandidates: false,
  });
  const onlySamples = simulateLayerVisibilityFilter(viewModel, {
    sources: false,
    samples: true,
    charts: false,
    features: false,
    routeGateCandidates: false,
    supportRegionCandidates: false,
  });
  const onlyCharts = simulateLayerVisibilityFilter(viewModel, {
    sources: false,
    samples: false,
    charts: true,
    features: false,
    routeGateCandidates: false,
    supportRegionCandidates: false,
  });
  const allHidden = simulateLayerVisibilityFilter(viewModel, {
    sources: false,
    samples: false,
    charts: false,
    features: false,
    routeGateCandidates: false,
    supportRegionCandidates: false,
  });

  expectEqual(
    allVisible.total,
    familyCounts.total,
    'layer visibility all-visible marker count',
  );
  expectEqual(
    onlySources.total,
    familyCounts.sources,
    'layer visibility only-source marker count',
  );
  expectEqual(
    onlySamples.total,
    familyCounts.samples,
    'layer visibility only-sample marker count',
  );
  expectEqual(
    onlyCharts.total,
    familyCounts.charts,
    'layer visibility only-chart marker count',
  );
  expectEqual(allHidden.total, 0, 'layer visibility all-hidden marker count');
  expectEqual(
    allHidden.routeGateCandidates,
    0,
    'layer visibility route/gate hidden marker count',
  );
  expectEqual(
    allHidden.supportRegionCandidates,
    0,
    'layer visibility support/region hidden marker count',
  );

  expectEqual(
    viewModel.probeIndex.sourceProbeCount,
    familyCounts.sources,
    'layer visibility source probes remain',
  );
  expectEqual(
    viewModel.probeIndex.sampleProbeCount,
    familyCounts.samples,
    'layer visibility sample probes remain',
  );
  expectEqual(
    viewModel.probeIndex.chartProbeCount,
    familyCounts.charts,
    'layer visibility chart probes remain',
  );
  expectEqual(
    viewModel.probeIndex.featureProbeCount,
    familyCounts.features,
    'layer visibility feature probes remain',
  );
  expectEqual(
    viewModel.probeIndex.routeGateCandidateProbeCount,
    familyCounts.routeGateCandidates,
    'layer visibility route/gate probes remain',
  );
  expectEqual(
    viewModel.probeIndex.supportRegionCandidateProbeCount,
    familyCounts.supportRegionCandidates,
    'layer visibility support/region probes remain',
  );
  expectEqual(
    viewModel.routeGateOverlaySummary.candidateMarkers.every(
      (marker) =>
        marker.status === 'candidate-only' &&
        marker.semanticStatus === 'not-semantic-naming' &&
        marker.topologyStatus === 'not-topology-workspace',
    ),
    true,
    'layer visibility route/gate candidate caveats remain',
  );
  expectEqual(
    viewModel.supportRegionOverlaySummary.candidateMarkers.every(
      (marker) =>
        marker.status === 'candidate-only' &&
        marker.semanticStatus === 'not-semantic-naming' &&
        marker.topologyStatus === 'not-topology-workspace',
    ),
    true,
    'layer visibility support/region candidate caveats remain',
  );
  expectNoOwnProperty(
    viewModel,
    'fieldAtlasLayerVisibilityPersistenceStatus',
    'view model no layer visibility persistence claim',
  );

  console.log('layer visibility filtering contract: PASS');
}

function runSampleRenderModeContractDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelRuntimeReport(
    applyAmboDissection(createSeedShape('tetrahedron')),
  );

  if (!report.viewModel) {
    recordFailure('sample render mode contract: supported view model missing');
    return;
  }

  const viewModel = report.viewModel;
  const renderScale = viewModel.renderScale;

  expectEqual(
    report.runtimeBoundaryStatus,
    'supported',
    'sample render mode supported boundary',
  );
  expectEqual(report.ok, true, 'sample render mode runtime ok');
  expectFinite(renderScale.intensityMin, 'render scale intensity min');
  expectFinite(renderScale.intensityMax, 'render scale intensity max');
  expectFinite(renderScale.phaseMin, 'render scale phase min');
  expectFinite(renderScale.phaseMax, 'render scale phase max');
  expectFinite(
    renderScale.dominantContributionRatioMin,
    'render scale dominance min',
  );
  expectFinite(
    renderScale.dominantContributionRatioMax,
    'render scale dominance max',
  );
  expectLessThanOrEqual(
    renderScale.intensityMin,
    renderScale.intensityMax,
    'render scale intensity order',
  );
  expectLessThanOrEqual(
    renderScale.phaseMin,
    renderScale.phaseMax,
    'render scale phase order',
  );
  expectLessThanOrEqual(
    renderScale.dominantContributionRatioMin,
    renderScale.dominantContributionRatioMax,
    'render scale dominance order',
  );
  expectEqual(
    SAMPLE_RENDER_MODES.join('|'),
    'family|intensity|phase|dominance',
    'sample render mode availability',
  );

  for (const marker of viewModel.surfaceSampleMarkers) {
    expectFinite(marker.intensity, `sample marker ${marker.sampleId} intensity`);
    expectFinite(marker.phase, `sample marker ${marker.sampleId} phase`);
    expectEqual(
      Array.isArray(marker.contributionRatios) &&
        marker.contributionRatios.length > 0,
      true,
      `sample marker ${marker.sampleId} contribution ratios present`,
    );

    for (const ratio of marker.contributionRatios) {
      expectFinite(
        ratio.value,
        `sample marker ${marker.sampleId} contribution ratio value`,
      );
    }

    if (typeof marker.dominantContributionRatio === 'number') {
      expectFinite(
        marker.dominantContributionRatio,
        `sample marker ${marker.sampleId} dominant contribution ratio`,
      );
      expectAtLeast(
        marker.dominantContributionRatio,
        0,
        `sample marker ${marker.sampleId} dominant contribution ratio non-negative`,
      );
    }
  }

  expectEqual(
    viewModel.probeIndex.sampleProbeCount,
    viewModel.surfaceSampleMarkers.length,
    'sample render mode sample probes remain',
  );
  expectEqual(
    viewModel.probeIndex.chartProbeCount,
    viewModel.chartOverlaySummary.chartAnchorMarkers.length,
    'sample render mode chart probes remain',
  );
  expectAtLeast(
    viewModel.probeIndex.sourceProbeCount,
    1,
    'sample render mode source probes remain',
  );
  expectAtLeast(
    viewModel.probeIndex.featureProbeCount,
    1,
    'sample render mode feature probes remain',
  );
  expectAtLeast(
    viewModel.probeIndex.routeGateCandidateProbeCount,
    1,
    'sample render mode route/gate probes remain',
  );
  expectAtLeast(
    viewModel.probeIndex.supportRegionCandidateProbeCount,
    1,
    'sample render mode support/region probes remain',
  );

  const forbiddenProperties = [
    'fieldAtlasSampleRenderModePersistenceStatus',
    'sampleRenderModePersistenceStatus',
    'sampleRenderModeSemanticStatus',
    'sampleRenderModeTopologyStatus',
    'sampleRenderModePacketWriteStatus',
    'sampleRenderModeShapeMutationStatus',
    'chartHeatmapStatus',
    'faceHeatmapStatus',
    'chartMeshStatus',
    'shaderStatus',
  ];

  for (const property of forbiddenProperties) {
    expectNoOwnProperty(report, property, `sample render mode runtime no ${property}`);
    expectNoOwnProperty(
      viewModel,
      property,
      `sample render mode view model no ${property}`,
    );
  }

  console.log('sample render mode data contract: PASS');
}

function runChartLinkingContractDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelRuntimeReport(
    applyAmboDissection(createSeedShape('tetrahedron')),
  );

  if (!report.viewModel) {
    recordFailure('chart linking contract: supported view model missing');
    return;
  }

  const viewModel = report.viewModel;
  const chartAnchorMarker = viewModel.chartOverlaySummary.chartAnchorMarkers[0];

  expectEqual(report.runtimeBoundaryStatus, 'supported', 'chart linking boundary');
  expectTruthy(chartAnchorMarker, 'chart linking anchor exists');

  if (!chartAnchorMarker) {
    return;
  }

  const chartProbe = viewModel.probeIndex.probes[chartAnchorMarker.probeRef];
  const activeChartId = parseChartProbeRef(chartAnchorMarker.probeRef);
  const probeCountsBefore = {
    sampleProbeCount: viewModel.probeIndex.sampleProbeCount,
    chartProbeCount: viewModel.probeIndex.chartProbeCount,
    featureProbeCount: viewModel.probeIndex.featureProbeCount,
    routeGateCandidateProbeCount:
      viewModel.probeIndex.routeGateCandidateProbeCount,
    supportRegionCandidateProbeCount:
      viewModel.probeIndex.supportRegionCandidateProbeCount,
  };
  const samplesInChart = viewModel.surfaceSampleMarkers.filter(
    (marker) => marker.chartId === activeChartId,
  );
  const featuresInChart = viewModel.featureOverlaySummary.featureMarkers.filter(
    (marker) => marker.chartId === activeChartId,
  );
  const routeGateCandidatesInChart =
    viewModel.routeGateOverlaySummary.candidateMarkers.filter((marker) =>
      marker.chartIds.includes(activeChartId),
    );
  const supportRegionCandidatesInChart =
    viewModel.supportRegionOverlaySummary.candidateMarkers.filter((marker) =>
      marker.chartIds.includes(activeChartId),
    );

  expectEqual(
    chartProbe && chartProbe.probeKind,
    'chart-summary',
    'chart linking anchor probe kind',
  );
  expectEqual(
    activeChartId,
    chartAnchorMarker.chartId,
    'chart linking active chart id',
  );
  expectAtLeast(samplesInChart.length, 1, 'chart linking samples in chart');
  expectEqual(
    chartProbe && chartProbe.sampleCount,
    samplesInChart.length,
    'chart linking probe sample count',
  );

  if (chartProbe && chartProbe.probeKind === 'chart-summary') {
    expectFinite(chartProbe.minIntensity, 'chart linking intensity min');
    expectFinite(chartProbe.maxIntensity, 'chart linking intensity max');
    expectFinite(chartProbe.minPhase, 'chart linking phase min');
    expectFinite(chartProbe.maxPhase, 'chart linking phase max');
  }

  expectAtLeast(featuresInChart.length, 0, 'chart linking feature count computed');
  expectAtLeast(
    routeGateCandidatesInChart.length,
    0,
    'chart linking route/gate count computed',
  );
  expectAtLeast(
    supportRegionCandidatesInChart.length,
    0,
    'chart linking support/region count computed',
  );
  expectEqual(
    viewModel.probeIndex.sampleProbeCount,
    probeCountsBefore.sampleProbeCount,
    'chart linking sample probes unchanged',
  );
  expectEqual(
    viewModel.probeIndex.chartProbeCount,
    probeCountsBefore.chartProbeCount,
    'chart linking chart probes unchanged',
  );
  expectEqual(
    viewModel.probeIndex.featureProbeCount,
    probeCountsBefore.featureProbeCount,
    'chart linking feature probes unchanged',
  );
  expectEqual(
    viewModel.probeIndex.routeGateCandidateProbeCount,
    probeCountsBefore.routeGateCandidateProbeCount,
    'chart linking route/gate probes unchanged',
  );
  expectEqual(
    viewModel.probeIndex.supportRegionCandidateProbeCount,
    probeCountsBefore.supportRegionCandidateProbeCount,
    'chart linking support/region probes unchanged',
  );
  expectEqual(
    report.shapeMutationStatus,
    'not-shape-mutation',
    'chart linking runtime shape mutation status',
  );
  expectEqual(
    viewModel.shapeMutationStatus,
    'not-shape-mutation',
    'chart linking view model shape mutation status',
  );

  const forbiddenProperties = [
    'chartSelectionPersistenceStatus',
    'chartFocusPersistenceStatus',
    'chartTopologyStatus',
    'chartSemanticNamingStatus',
    'chartHeatmapStatus',
    'faceHeatmapStatus',
    'chartMeshStatus',
    'shaderStatus',
    'topologyBehaviorStatus',
    'semanticNamingStatus',
    'packetWritingStatus',
  ];

  for (const property of forbiddenProperties) {
    expectNoOwnProperty(report, property, `chart linking runtime no ${property}`);
    expectNoOwnProperty(viewModel, property, `chart linking view model no ${property}`);
  }

  console.log('chart linking contract: PASS');
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

function runRouteGateAndSupportRegionCandidateOverlayDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelRuntimeReport(
    applyAmboDissection(createSeedShape('tetrahedron')),
  );

  if (!report.viewModel) {
    recordFailure('route/support candidate anchors: supported view model missing');
    return;
  }

  const viewModel = report.viewModel;

  expectEqual(
    viewModel.candidateOverlayStatus,
    'feature-route-gate-and-support-region-candidate-markers',
    'candidate overlay status',
  );
  expectEqual(
    viewModel.routeGateOverlaySummary.overlayStatus,
    'route-gate-candidate-anchors-available',
    'route/gate overlay status',
  );
  expectAtLeast(
    viewModel.routeGateOverlaySummary.candidateMarkers.length,
    1,
    'route/gate candidate markers',
  );
  expectEqual(
    viewModel.routeGateOverlaySummary.candidateRefs.length,
    viewModel.routeGateOverlaySummary.candidateMarkers.length,
    'route/gate candidate refs',
  );
  expectEqual(
    viewModel.supportRegionOverlaySummary.overlayStatus,
    'support-region-candidate-anchors-available',
    'support/region overlay status',
  );
  expectAtLeast(
    viewModel.supportRegionOverlaySummary.candidateMarkers.length,
    1,
    'support/region candidate markers',
  );
  expectEqual(
    viewModel.supportRegionOverlaySummary.candidateRefs.length,
    viewModel.supportRegionOverlaySummary.candidateMarkers.length,
    'support/region candidate refs',
  );
  expectEqual(
    viewModel.probeIndex.routeGateCandidateProbeCount,
    viewModel.routeGateOverlaySummary.candidateMarkers.length,
    'route/gate candidate probes',
  );
  expectEqual(
    viewModel.probeIndex.routeGateSummaryProbeCount,
    1,
    'route/gate summary probe',
  );
  expectEqual(
    viewModel.probeIndex.routeGateProbeCount,
    viewModel.routeGateOverlaySummary.candidateMarkers.length + 1,
    'route/gate total probes',
  );
  expectEqual(
    viewModel.probeIndex.supportRegionProbeCount,
    viewModel.supportRegionOverlaySummary.candidateMarkers.length + 1,
    'support/region total probes',
  );
  expectEqual(
    viewModel.probeIndex.supportRegionCandidateProbeCount,
    viewModel.supportRegionOverlaySummary.candidateMarkers.length,
    'support/region candidate probes',
  );
  expectEqual(
    viewModel.probeIndex.supportRegionSummaryProbeCount,
    1,
    'support/region summary probes',
  );

  console.log('route/gate and support/region candidate anchors: PASS');
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
    'fieldAtlasLayerVisibilityPersistenceStatus',
    'layerVisibilityPersistenceStatus',
    'fieldAtlasSampleRenderModePersistenceStatus',
    'sampleRenderModePersistenceStatus',
    'chartSelectionPersistenceStatus',
    'chartFocusPersistenceStatus',
    'packetWritingStatus',
    'semanticNamingStatus',
    'topologyBehaviorStatus',
    'chartTopologyStatus',
    'chartSemanticNamingStatus',
    'chartHeatmapStatus',
    'faceHeatmapStatus',
    'chartMeshStatus',
    'shaderStatus',
    'supportRegionGeometryStatus',
    'filledRegionGeometryStatus',
    'meshRegionStatus',
    'graphEdgeDrawingStatus',
    'routePathGeometryStatus',
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

    if (probe && probe.sourceKind === 'generated-child-derived') {
      expectTruthy(
        probe.childDerivation,
        `source marker ${marker.sourceId} child derivation`,
      );

      if (probe.childDerivation) {
        expectChildDerivationProbe(probe.childDerivation, marker.sourceId);
      }
    }

    if (probe && probe.sourceKind === 'primal-assigned') {
      expectNoOwnProperty(
        probe,
        'childDerivation',
        `source marker ${marker.sourceId} primal childDerivation`,
      );
    }
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

  for (const marker of viewModel.chartOverlaySummary.chartAnchorMarkers) {
    const probe = viewModel.probeIndex.probes[marker.probeRef];

    expectTruthy(marker.chartId, 'chart marker chart id');
    expectEqual(
      marker.renderKind,
      'chart-summary-anchor-marker',
      `chart marker ${marker.chartId} render kind`,
    );
    expectTruthy(
      marker.sourceFaceId,
      `chart marker ${marker.chartId} source face id`,
    );
    expectTruthy(
      marker.chartSemanticRole,
      `chart marker ${marker.chartId} semantic role`,
    );
    expectAtLeast(marker.sampleCount, 1, `chart marker ${marker.chartId} samples`);
    expectFinite(marker.minIntensity, `chart marker ${marker.chartId} min intensity`);
    expectFinite(marker.maxIntensity, `chart marker ${marker.chartId} max intensity`);
    expectFinite(marker.minPhase, `chart marker ${marker.chartId} min phase`);
    expectFinite(marker.maxPhase, `chart marker ${marker.chartId} max phase`);
    expectEqual(
      marker.semanticStatus,
      'not-semantic-naming',
      `chart marker ${marker.chartId} semantic`,
    );
    expectEqual(
      marker.topologyStatus,
      'not-topology-workspace',
      `chart marker ${marker.chartId} topology`,
    );
    expectEqual(
      marker.phaseContinuityStatus,
      'not-global-phase-continuity',
      `chart marker ${marker.chartId} phase`,
    );
    expectTruthy(probe, `chart marker ${marker.chartId} probe`);
    expectEqual(
      probe && probe.probeKind,
      'chart-summary',
      `chart marker ${marker.chartId} probe kind`,
    );

    if (marker.position) {
      expectFiniteVec3(marker.position, `chart marker ${marker.chartId} position`);
    }
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

  for (const marker of viewModel.routeGateOverlaySummary.candidateMarkers) {
    const probe = viewModel.probeIndex.probes[marker.probeRef];

    expectTruthy(probe, `route/gate marker ${marker.candidateId} probe`);
    expectEqual(
      probe && probe.probeKind,
      'route-gate-candidate',
      `route/gate marker ${marker.candidateId} probe kind`,
    );
    expectEqual(
      marker.status,
      'candidate-only',
      `route/gate marker ${marker.candidateId} status`,
    );
    expectEqual(
      marker.semanticStatus,
      'not-semantic-naming',
      `route/gate marker ${marker.candidateId} semantic`,
    );
    expectEqual(
      marker.topologyStatus,
      'not-topology-workspace',
      `route/gate marker ${marker.candidateId} topology`,
    );
    expectEqual(
      marker.phaseContinuityStatus,
      'not-global-phase-continuity',
      `route/gate marker ${marker.candidateId} phase`,
    );
    expectProfileAwareSourcePolicyNames(
      marker.sourcePolicyNames,
      `route/gate marker ${marker.candidateId} source policy names`,
    );

    if (marker.position) {
      expectFiniteVec3(
        marker.position,
        `route/gate marker ${marker.candidateId} anchor position`,
      );
    }
  }

  for (const marker of viewModel.supportRegionOverlaySummary.candidateMarkers) {
    const probe = viewModel.probeIndex.probes[marker.probeRef];

    expectTruthy(probe, `support/region marker ${marker.candidateId} probe`);
    expectEqual(
      probe && probe.probeKind,
      'support-region-candidate',
      `support/region marker ${marker.candidateId} probe kind`,
    );
    expectEqual(
      marker.status,
      'candidate-only',
      `support/region marker ${marker.candidateId} status`,
    );
    expectEqual(
      marker.semanticStatus,
      'not-semantic-naming',
      `support/region marker ${marker.candidateId} semantic`,
    );
    expectEqual(
      marker.topologyStatus,
      'not-topology-workspace',
      `support/region marker ${marker.candidateId} topology`,
    );
    expectEqual(
      marker.phaseContinuityStatus,
      'not-global-phase-continuity',
      `support/region marker ${marker.candidateId} phase`,
    );
    expectProfileAwareSourcePolicyNames(
      marker.sourcePolicyNames,
      `support/region marker ${marker.candidateId} source policy names`,
    );

    if (marker.position) {
      expectFiniteVec3(
        marker.position,
        `support/region marker ${marker.candidateId} anchor position`,
      );
    }
  }

  console.log('marker hover probe refs resolve: PASS');
}

function expectSimulatedPinnedProbeRefsResolve(viewModel) {
  const sourceMarker = viewModel.sourceMarkers[0];
  const sampleMarker = viewModel.surfaceSampleMarkers[0];
  const chartMarker = viewModel.chartOverlaySummary.chartAnchorMarkers[0];
  const featureMarker = viewModel.featureOverlaySummary.featureMarkers[0];
  const routeGateMarker = viewModel.routeGateOverlaySummary.candidateMarkers[0];
  const supportRegionMarker =
    viewModel.supportRegionOverlaySummary.candidateMarkers[0];

  expectPinnedProbeRef(
    viewModel,
    sourceMarker && sourceMarker.probeRef,
    'source',
    'simulated source pinned ref',
  );
  expectPinnedProbeRef(
    viewModel,
    sampleMarker && sampleMarker.probeRef,
    'surface-sample',
    'simulated sample pinned ref',
  );
  expectPinnedProbeRef(
    viewModel,
    chartMarker && chartMarker.probeRef,
    'chart-summary',
    'simulated chart pinned ref',
  );
  expectPinnedProbeRef(
    viewModel,
    featureMarker && featureMarker.probeRef,
    'feature-observation',
    'simulated feature pinned ref',
  );
  expectPinnedProbeRef(
    viewModel,
    routeGateMarker && routeGateMarker.probeRef,
    'route-gate-candidate',
    'simulated route/gate pinned ref',
  );
  expectPinnedProbeRef(
    viewModel,
    supportRegionMarker && supportRegionMarker.probeRef,
    'support-region-candidate',
    'simulated support/region pinned ref',
  );

  console.log('simulated pinned probe refs resolve: PASS');
}

function expectPinnedProbeRef(viewModel, probeRef, expectedProbeKind, label) {
  expectTruthy(probeRef, `${label} exists`);

  const probe = probeRef ? viewModel.probeIndex.probes[probeRef] : undefined;

  expectTruthy(probe, `${label} resolves`);
  expectEqual(probe && probe.probeKind, expectedProbeKind, `${label} kind`);
}

function parseChartProbeRef(probeRef) {
  const prefix = 'chart:';

  if (typeof probeRef !== 'string' || !probeRef.startsWith(prefix)) {
    return null;
  }

  return probeRef.slice(prefix.length);
}

function getLayerFamilyCounts(viewModel) {
  const counts = {
    sources: viewModel.sourceMarkers.length,
    samples: viewModel.surfaceSampleMarkers.length,
    charts: viewModel.chartOverlaySummary.chartAnchorMarkers.length,
    features: viewModel.featureOverlaySummary.featureMarkers.length,
    routeGateCandidates:
      viewModel.routeGateOverlaySummary.candidateMarkers.length,
    supportRegionCandidates:
      viewModel.supportRegionOverlaySummary.candidateMarkers.length,
  };

  return {
    ...counts,
    total:
      counts.sources +
      counts.samples +
      counts.charts +
      counts.features +
      counts.routeGateCandidates +
      counts.supportRegionCandidates,
  };
}

function simulateLayerVisibilityFilter(viewModel, visibility) {
  const counts = getLayerFamilyCounts(viewModel);
  const filteredCounts = {
    sources: visibility.sources ? counts.sources : 0,
    samples: visibility.samples ? counts.samples : 0,
    charts: visibility.charts ? counts.charts : 0,
    features: visibility.features ? counts.features : 0,
    routeGateCandidates: visibility.routeGateCandidates
      ? counts.routeGateCandidates
      : 0,
    supportRegionCandidates: visibility.supportRegionCandidates
      ? counts.supportRegionCandidates
      : 0,
  };

  return {
    ...filteredCounts,
    total:
      filteredCounts.sources +
      filteredCounts.samples +
      filteredCounts.charts +
      filteredCounts.features +
      filteredCounts.routeGateCandidates +
      filteredCounts.supportRegionCandidates,
  };
}

function expectChildDerivationProbe(derivation, label) {
  expectEqual(derivation.childRole, 'shared-90-pole', `${label} child role`);
  expectTruthy(derivation.sourceEdgeId, `${label} source edge`);
  expectEqual(
    Array.isArray(derivation.sourceEdgeVertexIds) &&
      derivation.sourceEdgeVertexIds.length,
    2,
    `${label} source edge vertex ids`,
  );
  expectTruthy(derivation.complementEdgeId, `${label} complement edge`);
  expectEqual(
    Array.isArray(derivation.complementEdgeVertexIds) &&
      derivation.complementEdgeVertexIds.length,
    2,
    `${label} complement edge vertex ids`,
  );
  expectTruthy(derivation.antipodalChildVertexId, `${label} antipodal child`);
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
  expectEqual(derivation.quarkChannels.length, 4, `${label} quark channels`);
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
    `  markers: source=${report.viewModel.sourceMarkers.length} sample=${report.viewModel.surfaceSampleMarkers.length} chart=${report.viewModel.chartOverlaySummary.chartAnchorMarkers.length} feature=${report.viewModel.featureOverlaySummary.featureMarkers.length} routeGate=${report.viewModel.routeGateOverlaySummary.candidateMarkers.length} supportRegion=${report.viewModel.supportRegionOverlaySummary.candidateMarkers.length}`,
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

function expectFiniteChannelParameters(parameters, label) {
  expectFinite(parameters && parameters.amplitude, `${label} amplitude`);
  expectFinite(parameters && parameters.waveNumber, `${label} waveNumber`);
  expectFinite(parameters && parameters.phase, `${label} phase`);
  expectFinite(parameters && parameters.attenuation, `${label} attenuation`);
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

function expectProfileAwareSourcePolicyNames(sourcePolicyNames, label) {
  expectEqual(
    Array.isArray(sourcePolicyNames),
    true,
    `${label} is an array`,
  );
  expectEqual(sourcePolicyNames.length, 1, `${label} length`);
  expectEqual(
    sourcePolicyNames[0],
    PROFILE_AWARE_SOURCE_POLICY_ID,
    `${label} value`,
  );
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

function expectLessThanOrEqual(actual, expectedMaximum, label) {
  if (actual > expectedMaximum) {
    recordFailure(`${label}: expected at most ${expectedMaximum}, got ${actual}`);
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

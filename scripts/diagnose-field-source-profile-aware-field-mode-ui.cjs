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
const {
  buildProfileAwareEvidenceStabilityReport,
} = require(path.join(
  repoRoot,
  'src/lib/fieldSourceProfileAwareEvidenceStability.ts',
));

const PROFILE_AWARE_SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const SAMPLE_RENDER_MODES = ['family', 'intensity', 'phase', 'dominance'];
const failures = [];

console.log('Field source profile-aware Field Mode UI diagnostics');

runSupportedOneAmboTetrahedronContractDiagnostic();
runLayerVisibilityContractDiagnostic();
runSampleRenderModeContractDiagnostic();
runChartLinkingContractDiagnostic();
runSourceLinkingContractDiagnostic();
runEvidenceStabilityUiContractDiagnostic();
runSemanticHandoffReadinessUiContractDiagnostic();
runSemanticHandoffTransitionUiContractDiagnostic();
runSemanticHandoffPressurePreviewUiContractDiagnostic();
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
  const sampleMarker = viewModel.surfaceSampleMarkers[0];
  const featureMarker = viewModel.featureOverlaySummary.featureMarkers[0];
  const routeGateMarker = viewModel.routeGateOverlaySummary.candidateMarkers[0];
  const supportRegionMarker =
    viewModel.supportRegionOverlaySummary.candidateMarkers[0];
  const probeCountsBefore = {
    sourceProbeCount: viewModel.probeIndex.sourceProbeCount,
    sampleProbeCount: viewModel.probeIndex.sampleProbeCount,
    chartProbeCount: viewModel.probeIndex.chartProbeCount,
    featureProbeCount: viewModel.probeIndex.featureProbeCount,
    routeGateCandidateProbeCount:
      viewModel.probeIndex.routeGateCandidateProbeCount,
    supportRegionCandidateProbeCount:
      viewModel.probeIndex.supportRegionCandidateProbeCount,
  };

  expectEqual(report.runtimeBoundaryStatus, 'supported', 'chart linking boundary');
  expectTruthy(chartAnchorMarker, 'chart linking anchor exists');

  if (!chartAnchorMarker) {
    return;
  }

  const chartProbe = viewModel.probeIndex.probes[chartAnchorMarker.probeRef];
  const chartAnchorChartIds = getChartIdsFromProfileAwareProbe(chartProbe);
  const chartContext = computeChartContextCounts(viewModel, chartAnchorChartIds);

  expectEqual(
    chartProbe && chartProbe.probeKind,
    'chart-summary',
    'chart linking anchor probe kind',
  );
  expectEqual(
    chartAnchorChartIds.length,
    1,
    'chart linking chart anchor active chart id count',
  );
  expectEqual(
    chartAnchorChartIds[0],
    chartAnchorMarker.chartId,
    'chart linking active chart id',
  );
  expectAtLeast(chartContext.sampleMarkerCount, 1, 'chart linking samples in chart');
  expectEqual(
    chartProbe && chartProbe.sampleCount,
    chartContext.sampleMarkerCount,
    'chart linking probe sample count',
  );

  if (chartProbe && chartProbe.probeKind === 'chart-summary') {
    expectFinite(chartProbe.minIntensity, 'chart linking intensity min');
    expectFinite(chartProbe.maxIntensity, 'chart linking intensity max');
    expectFinite(chartProbe.minPhase, 'chart linking phase min');
    expectFinite(chartProbe.maxPhase, 'chart linking phase max');
  }

  expectChartContextFromSampleMarker(viewModel, sampleMarker);
  expectChartContextFromFeatureMarker(viewModel, featureMarker);
  expectChartContextFromRouteGateMarker(viewModel, routeGateMarker);
  expectChartContextFromSupportRegionMarker(viewModel, supportRegionMarker);
  expectEqual(
    viewModel.probeIndex.sourceProbeCount,
    probeCountsBefore.sourceProbeCount,
    'chart linking source probes unchanged',
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

function runSourceLinkingContractDiagnostic() {
  const report = buildProfileAwareFieldAtlasViewModelRuntimeReport(
    applyAmboDissection(createSeedShape('tetrahedron')),
  );

  if (!report.viewModel) {
    recordFailure('source linking contract: supported view model missing');
    return;
  }

  const viewModel = report.viewModel;
  const probeCountsBefore = {
    sourceProbeCount: viewModel.probeIndex.sourceProbeCount,
    sampleProbeCount: viewModel.probeIndex.sampleProbeCount,
    chartProbeCount: viewModel.probeIndex.chartProbeCount,
    featureProbeCount: viewModel.probeIndex.featureProbeCount,
    routeGateCandidateProbeCount:
      viewModel.probeIndex.routeGateCandidateProbeCount,
    supportRegionCandidateProbeCount:
      viewModel.probeIndex.supportRegionCandidateProbeCount,
  };
  const firstSourceMarker = viewModel.sourceMarkers[0];
  const firstSourceProbe = firstSourceMarker
    ? viewModel.probeIndex.probes[firstSourceMarker.probeRef]
    : undefined;
  const sourceMarkerWithContribution = findSourceMarkerWithSampleContribution(
    viewModel,
  );

  expectEqual(report.runtimeBoundaryStatus, 'supported', 'source linking boundary');
  expectTruthy(firstSourceMarker, 'source linking first source marker');
  expectEqual(
    firstSourceProbe && firstSourceProbe.probeKind,
    'source',
    'source linking first source probe kind',
  );
  expectTruthy(
    sourceMarkerWithContribution,
    'source linking source with sample contribution',
  );

  if (!sourceMarkerWithContribution) {
    return;
  }

  const sourceProbe =
    viewModel.probeIndex.probes[sourceMarkerWithContribution.probeRef];
  const sourceContext = computeSourceContextCounts(
    viewModel,
    sourceMarkerWithContribution.sourceId,
  );
  const dominantSampleMarker = viewModel.surfaceSampleMarkers.find((marker) =>
    getDominantSourceIdFromSampleMarker(marker),
  );
  const dominantFeatureContext =
    findFeatureMarkerWithLinkedDominantSource(viewModel);

  expectEqual(
    sourceProbe && sourceProbe.probeKind,
    'source',
    'source linking source probe kind',
  );
  expectEqual(
    sourceProbe && sourceProbe.sourceId,
    sourceMarkerWithContribution.sourceId,
    'source linking source probe id',
  );
  expectAtLeast(
    sourceContext.sampleMarkerCount,
    1,
    'source linking sample count',
  );
  expectAtLeast(
    sourceContext.featureMarkerCount,
    0,
    'source linking feature count computable',
  );

  expectSourceContextTopSamples(sourceContext, 'source linking source marker');

  expectTruthy(
    dominantSampleMarker,
    'source linking dominant-source sample marker',
  );

  if (dominantSampleMarker) {
    const sampleProbe = viewModel.probeIndex.probes[dominantSampleMarker.probeRef];
    const sampleDominantSourceId =
      getDominantSourceIdFromSampleMarker(dominantSampleMarker);
    const derivedSourceId = getDominantSourceIdFromProbe(sampleProbe, viewModel);
    const sampleSourceContext = computeSourceContextCounts(
      viewModel,
      derivedSourceId,
    );

    expectEqual(
      sampleProbe && sampleProbe.probeKind,
      'surface-sample',
      'source linking dominant sample probe kind',
    );
    expectEqual(
      derivedSourceId,
      sampleDominantSourceId,
      'source linking dominant sample derived source id',
    );
    expectAtLeast(
      sampleSourceContext.sampleMarkerCount,
      1,
      'source linking dominant sample context count',
    );
    expectSourceContextTopSamples(
      sampleSourceContext,
      'source linking dominant sample',
    );
  }

  if (dominantFeatureContext) {
    const derivedSourceId = getDominantSourceIdFromProbe(
      dominantFeatureContext.featureProbe,
      viewModel,
    );
    const featureSourceContext = computeSourceContextCounts(
      viewModel,
      derivedSourceId,
    );

    expectEqual(
      dominantFeatureContext.featureProbe.probeKind,
      'feature-observation',
      'source linking dominant feature probe kind',
    );
    expectEqual(
      dominantFeatureContext.linkedSampleProbe.probeKind,
      'surface-sample',
      'source linking dominant feature linked sample probe kind',
    );
    expectEqual(
      derivedSourceId,
      dominantFeatureContext.linkedSampleDominantSourceId,
      'source linking dominant feature derived source id',
    );
    expectAtLeast(
      featureSourceContext.sampleMarkerCount,
      1,
      'source linking dominant feature context count',
    );
  } else if (viewModel.featureOverlaySummary.featureMarkers.length > 0) {
    console.log(
      'source linking dominant feature context: PASS (no feature marker with linked dominant source)',
    );
  }

  expectEqual(
    viewModel.probeIndex.sourceProbeCount,
    probeCountsBefore.sourceProbeCount,
    'source linking source probes unchanged',
  );
  expectEqual(
    viewModel.probeIndex.sampleProbeCount,
    probeCountsBefore.sampleProbeCount,
    'source linking sample probes unchanged',
  );
  expectEqual(
    viewModel.probeIndex.chartProbeCount,
    probeCountsBefore.chartProbeCount,
    'source linking chart probes unchanged',
  );
  expectEqual(
    viewModel.probeIndex.featureProbeCount,
    probeCountsBefore.featureProbeCount,
    'source linking feature probes unchanged',
  );
  expectEqual(
    viewModel.probeIndex.routeGateCandidateProbeCount,
    probeCountsBefore.routeGateCandidateProbeCount,
    'source linking route/gate probes unchanged',
  );
  expectEqual(
    viewModel.probeIndex.supportRegionCandidateProbeCount,
    probeCountsBefore.supportRegionCandidateProbeCount,
    'source linking support/region probes unchanged',
  );
  expectEqual(
    report.shapeMutationStatus,
    'not-shape-mutation',
    'source linking runtime shape mutation status',
  );
  expectEqual(
    viewModel.shapeMutationStatus,
    'not-shape-mutation',
    'source linking view model shape mutation status',
  );

  const forbiddenProperties = [
    'sourceSelectionPersistenceStatus',
    'sourceFocusPersistenceStatus',
    'sourceSemanticNamingStatus',
    'sourceCausalAttributionStatus',
    'sourceProfileEditingStatus',
    'sourceSliderStatus',
    'heatmapStatus',
    'shaderStatus',
    'graphEdgeDrawingStatus',
    'routePathGeometryStatus',
    'topologyBehaviorStatus',
    'semanticNamingStatus',
    'packetWritingStatus',
  ];

  for (const property of forbiddenProperties) {
    expectNoOwnProperty(report, property, `source linking runtime no ${property}`);
    expectNoOwnProperty(viewModel, property, `source linking view model no ${property}`);
  }

  console.log('source linking contract: PASS');
}

function runEvidenceStabilityUiContractDiagnostic() {
  const runtimeBefore = buildProfileAwareFieldAtlasViewModelRuntimeReport(
    applyAmboDissection(createSeedShape('tetrahedron')),
  );
  const probeCountsBefore = runtimeBefore.viewModel
    ? getProbeCounts(runtimeBefore.viewModel)
    : undefined;
  const report = buildProfileAwareEvidenceStabilityReport();
  const runtimeAfter = buildProfileAwareFieldAtlasViewModelRuntimeReport(
    applyAmboDissection(createSeedShape('tetrahedron')),
  );
  const probeCountsAfter = runtimeAfter.viewModel
    ? getProbeCounts(runtimeAfter.viewModel)
    : undefined;

  expectEqual(report.ok, true, 'evidence stability UI report ok');
  expectEqual(report.issueCount, 0, 'evidence stability UI issue count');
  expectEqual(
    report.method,
    'profile-aware-evidence-stability-diagnostic-v0',
    'evidence stability UI method',
  );
  expectEqual(
    report.diagnosticScope,
    'profile-aware-full-candidate-stack-stability-only',
    'evidence stability UI diagnostic scope',
  );
  expectEqual(
    report.sourcePolicyId,
    PROFILE_AWARE_SOURCE_POLICY_ID,
    'evidence stability UI source policy',
  );
  expectEqual(
    report.policyRelativityStatus,
    'policy-relative',
    'evidence stability UI policy relativity',
  );
  expectEqual(
    report.contrastPolicyNote,
    'old-policy-not-assumed-invariant',
    'evidence stability UI contrast policy note',
  );
  expectEqual(
    report.semanticStatus,
    'not-semantic-naming',
    'evidence stability UI semantic status',
  );
  expectEqual(
    report.topologyStatus,
    'not-topology-workspace',
    'evidence stability UI topology status',
  );
  expectEqual(
    report.phaseContinuityStatus,
    'not-global-phase-continuity',
    'evidence stability UI phase continuity status',
  );
  expectEqual(
    report.shapeMutationStatus,
    'not-shape-mutation',
    'evidence stability UI shape mutation status',
  );
  expectEqual(
    report.packetWriteStatus,
    'not-packet-writing',
    'evidence stability UI packet write status',
  );
  expectAtLeast(report.variantCount, 1, 'evidence stability UI variant count');
  expectAtLeast(
    report.samplingVariantCount,
    1,
    'evidence stability UI sampling variant count',
  );
  expectAtLeast(
    report.profileSetupVariantCount,
    1,
    'evidence stability UI profile setup variant count',
  );
  expectEqual(
    report.variants.length,
    report.variantCount,
    'evidence stability UI variants length',
  );
  expectTruthy(
    report.sensitivitySummary,
    'evidence stability UI sensitivity summary',
  );

  if (report.sensitivitySummary) {
    const summary = report.sensitivitySummary;
    const expectedRangeKeys = [
      'totalObservationCount',
      'totalRouteGateCandidateCount',
      'totalSupportRegionCandidateCount',
      'cancellationLikeObservationCount',
      'gateCandidateCount',
      'supportClassCandidateCount',
    ];

    expectEqual(
      Array.isArray(summary.changedCountKeys),
      true,
      'evidence stability UI changed count keys array',
    );
    expectEqual(
      Array.isArray(summary.featureChangedCountKeys),
      true,
      'evidence stability UI feature changed keys array',
    );
    expectEqual(
      Array.isArray(summary.routeGateChangedCountKeys),
      true,
      'evidence stability UI route/gate changed keys array',
    );
    expectEqual(
      Array.isArray(summary.supportRegionChangedCountKeys),
      true,
      'evidence stability UI support/region changed keys array',
    );

    for (const key of expectedRangeKeys) {
      if (Object.prototype.hasOwnProperty.call(summary.countRanges, key)) {
        const range = summary.countRanges[key];

        expectFinite(range && range.min, `evidence stability UI ${key} min`);
        expectFinite(range && range.max, `evidence stability UI ${key} max`);
        expectLessThanOrEqual(
          range && range.min,
          range && range.max,
          `evidence stability UI ${key} range order`,
        );
      }
    }

    expectEqual(
      typeof summary.maxBucketSaturation.anyMaxBucketSaturated,
      'boolean',
      'evidence stability UI max bucket saturation boolean',
    );
  }

  expectTruthy(probeCountsBefore, 'evidence stability UI probe counts before');
  expectTruthy(probeCountsAfter, 'evidence stability UI probe counts after');

  if (probeCountsBefore && probeCountsAfter) {
    expectEqual(
      probeCountsAfter.sourceProbeCount,
      probeCountsBefore.sourceProbeCount,
      'evidence stability UI source probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.sampleProbeCount,
      probeCountsBefore.sampleProbeCount,
      'evidence stability UI sample probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.chartProbeCount,
      probeCountsBefore.chartProbeCount,
      'evidence stability UI chart probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.featureProbeCount,
      probeCountsBefore.featureProbeCount,
      'evidence stability UI feature probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.routeGateCandidateProbeCount,
      probeCountsBefore.routeGateCandidateProbeCount,
      'evidence stability UI route/gate probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.supportRegionCandidateProbeCount,
      probeCountsBefore.supportRegionCandidateProbeCount,
      'evidence stability UI support/region probe count unchanged',
    );
  }

  const forbiddenProperties = [
    'evidenceConfirmationStatus',
    'confirmedStableStatus',
    'oldPolicyInvariantStatus',
    'defaultPolicyComparisonStatus',
    'semanticNamingStatus',
    'topologyBehaviorStatus',
    'packetWritingStatus',
    'shapeMutationDetected',
    'persistenceStatus',
    'workspacePersistenceStatus',
    'stabilityPersistenceStatus',
    'globalStabilityStateStatus',
  ];

  for (const property of forbiddenProperties) {
    expectNoOwnProperty(report, property, `evidence stability UI no ${property}`);
    if (report.sensitivitySummary) {
      expectNoOwnProperty(
        report.sensitivitySummary,
        property,
        `evidence stability UI summary no ${property}`,
      );
    }
  }

  console.log('evidence stability UI contract: PASS');
}

function runSemanticHandoffReadinessUiContractDiagnostic() {
  const evidenceStabilityReport = buildProfileAwareEvidenceStabilityReport();
  const unsupportedRuntimeReport =
    buildProfileAwareFieldAtlasViewModelRuntimeReport(createSeedShape('tetrahedron'));
  const supportedRuntimeBefore = buildProfileAwareFieldAtlasViewModelRuntimeReport(
    applyAmboDissection(createSeedShape('tetrahedron')),
  );
  const probeCountsBefore = supportedRuntimeBefore.viewModel
    ? getProbeCounts(supportedRuntimeBefore.viewModel)
    : undefined;
  const unsupportedSummary = buildProfileAwareSemanticHandoffSummary(
    unsupportedRuntimeReport,
    evidenceStabilityReport,
  );
  const supportedSummary = buildProfileAwareSemanticHandoffSummary(
    supportedRuntimeBefore,
    evidenceStabilityReport,
  );
  const supportedRuntimeAfter = buildProfileAwareFieldAtlasViewModelRuntimeReport(
    applyAmboDissection(createSeedShape('tetrahedron')),
  );
  const probeCountsAfter = supportedRuntimeAfter.viewModel
    ? getProbeCounts(supportedRuntimeAfter.viewModel)
    : undefined;
  const supportedCandidateCount =
    supportedSummary.featureCandidateCount +
    supportedSummary.routeGateCandidateCount +
    supportedSummary.supportRegionCandidateCount;
  const stabilitySensitive =
    evidenceStabilityReport.sensitivitySummary.samplingSensitive ||
    evidenceStabilityReport.sensitivitySummary.profileSetupSensitive;

  expectEqual(
    unsupportedSummary.readiness,
    'not-available',
    'semantic handoff unsupported readiness',
  );
  expectEqual(
    unsupportedSummary.fieldModeSupported,
    false,
    'semantic handoff unsupported field mode',
  );
  expectEqual(
    unsupportedSummary.caveats.some(
      (caveat) =>
        caveat === unsupportedRuntimeReport.unsupportedIssueCode ||
        caveat === unsupportedRuntimeReport.unsupportedReason,
    ),
    true,
    'semantic handoff unsupported caveat',
  );
  expectEqual(
    supportedSummary.fieldModeSupported,
    true,
    'semantic handoff supported field mode',
  );
  expectAtLeast(
    supportedSummary.featureCandidateCount,
    0,
    'semantic handoff feature candidate count',
  );
  expectAtLeast(
    supportedSummary.routeGateCandidateCount,
    0,
    'semantic handoff route/gate candidate count',
  );
  expectAtLeast(
    supportedSummary.supportRegionCandidateCount,
    0,
    'semantic handoff support/region candidate count',
  );
  expectEqual(
    supportedSummary.semanticStatus,
    'not-semantic-naming',
    'semantic handoff semantic status',
  );
  expectEqual(
    supportedSummary.topologyStatus,
    'not-topology-workspace',
    'semantic handoff topology status',
  );
  expectEqual(
    supportedSummary.packetWriteStatus,
    'not-packet-writing',
    'semantic handoff packet write status',
  );

  for (const caveat of [
    'not semantic naming',
    'not topology workspace',
    'not packet writing',
    'policy relative',
  ]) {
    expectEqual(
      supportedSummary.caveats.includes(caveat),
      true,
      `semantic handoff caveat ${caveat}`,
    );
  }

  if (supportedCandidateCount > 0 && stabilitySensitive) {
    expectEqual(
      supportedSummary.readiness,
      'candidate-pressure-sensitive',
      'semantic handoff sensitive candidate readiness',
    );
  }

  if (supportedCandidateCount > 0 && !stabilitySensitive) {
    expectEqual(
      supportedSummary.readiness,
      'candidate-pressure-available',
      'semantic handoff available candidate readiness',
    );
  }

  if (supportedCandidateCount === 0) {
    expectEqual(
      supportedSummary.readiness,
      'diagnostic-only',
      'semantic handoff diagnostic-only readiness',
    );
  }

  const forbiddenProperties = [
    'semanticName',
    'semanticNamingStatus',
    'topologyValidityStatus',
    'topologyBehaviorStatus',
    'packetWriteEnabled',
    'handoffPacketWritten',
    'routeGateConfirmedStatus',
    'supportRegionConfirmedStatus',
    'oldPolicyInvariantStatus',
    'defaultPolicyComparisonStatus',
    'transformationComparisonStatus',
    'candidateIdentityPersistenceStatus',
    'handoffPersistenceStatus',
    'globalHandoffStateStatus',
  ];

  for (const property of forbiddenProperties) {
    expectNoOwnProperty(
      unsupportedSummary,
      property,
      `semantic handoff unsupported no ${property}`,
    );
    expectNoOwnProperty(
      supportedSummary,
      property,
      `semantic handoff supported no ${property}`,
    );
  }

  expectTruthy(probeCountsBefore, 'semantic handoff probe counts before');
  expectTruthy(probeCountsAfter, 'semantic handoff probe counts after');

  if (probeCountsBefore && probeCountsAfter) {
    expectEqual(
      probeCountsAfter.sourceProbeCount,
      probeCountsBefore.sourceProbeCount,
      'semantic handoff source probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.sampleProbeCount,
      probeCountsBefore.sampleProbeCount,
      'semantic handoff sample probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.chartProbeCount,
      probeCountsBefore.chartProbeCount,
      'semantic handoff chart probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.featureProbeCount,
      probeCountsBefore.featureProbeCount,
      'semantic handoff feature probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.routeGateCandidateProbeCount,
      probeCountsBefore.routeGateCandidateProbeCount,
      'semantic handoff route/gate probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.supportRegionCandidateProbeCount,
      probeCountsBefore.supportRegionCandidateProbeCount,
      'semantic handoff support/region probe count unchanged',
    );
  }

  console.log('semantic handoff readiness UI contract: PASS');
}

function runSemanticHandoffTransitionUiContractDiagnostic() {
  const evidenceStabilityReport = buildProfileAwareEvidenceStabilityReport();
  const unsupportedRuntimeReport =
    buildProfileAwareFieldAtlasViewModelRuntimeReport(createSeedShape('tetrahedron'));
  const supportedRuntimeBefore = buildProfileAwareFieldAtlasViewModelRuntimeReport(
    applyAmboDissection(createSeedShape('tetrahedron')),
  );
  const probeCountsBefore = supportedRuntimeBefore.viewModel
    ? getProbeCounts(supportedRuntimeBefore.viewModel)
    : undefined;
  const previousSummary = buildProfileAwareSemanticHandoffSummary(
    unsupportedRuntimeReport,
    evidenceStabilityReport,
  );
  const currentSummary = buildProfileAwareSemanticHandoffSummary(
    supportedRuntimeBefore,
    evidenceStabilityReport,
  );
  const transition = buildProfileAwareSemanticHandoffTransition({
    previousSummary,
    currentSummary,
    previousShapeId: unsupportedRuntimeReport.inputShapeId,
    currentShapeId: supportedRuntimeBefore.inputShapeId,
    previousLabel: 'Seed: tetrahedron',
    currentLabel: 'Ambo tetrahedron',
  });
  const noPreviousTransition = buildProfileAwareSemanticHandoffTransition({
    previousSummary: null,
    currentSummary,
    currentShapeId: supportedRuntimeBefore.inputShapeId,
    currentLabel: 'Ambo tetrahedron',
  });
  const supportedRuntimeAfter = buildProfileAwareFieldAtlasViewModelRuntimeReport(
    applyAmboDissection(createSeedShape('tetrahedron')),
  );
  const probeCountsAfter = supportedRuntimeAfter.viewModel
    ? getProbeCounts(supportedRuntimeAfter.viewModel)
    : undefined;
  const expectedTransitionStatus =
    currentSummary.readiness === 'candidate-pressure-sensitive'
      ? 'handoff-became-sensitive'
      : 'handoff-became-available';

  expectEqual(
    transition.status,
    expectedTransitionStatus,
    'semantic handoff transition status',
  );
  expectFinite(
    transition.featureCandidateDelta,
    'semantic handoff transition feature delta',
  );
  expectFinite(
    transition.routeGateCandidateDelta,
    'semantic handoff transition route/gate delta',
  );
  expectFinite(
    transition.supportRegionCandidateDelta,
    'semantic handoff transition support/region delta',
  );
  expectFinite(
    transition.changedCountKeyDelta,
    'semantic handoff transition changed count key delta',
  );

  for (const caveat of [
    'readiness summaries only',
    'no candidate identity',
    'no semantic continuity',
    'no topology continuity',
    'no route persistence',
    'no support/region persistence',
  ]) {
    expectEqual(
      transition.caveats.includes(caveat),
      true,
      `semantic handoff transition caveat ${caveat}`,
    );
  }

  expectEqual(
    noPreviousTransition.status,
    'no-previous-shape',
    'semantic handoff no previous transition',
  );

  const forbiddenProperties = [
    'semanticName',
    'semanticNamingStatus',
    'topologyValidityStatus',
    'topologyBehaviorStatus',
    'packetWriteEnabled',
    'handoffPacketWritten',
    'routeGateConfirmedStatus',
    'supportRegionConfirmedStatus',
    'oldPolicyInvariantStatus',
    'defaultPolicyComparisonStatus',
    'candidateIdentityPersistenceStatus',
    'routePersistenceStatus',
    'supportRegionPersistenceStatus',
    'semanticContinuityStatus',
    'topologyContinuityStatus',
    'fieldOntologyDeltaStatus',
  ];

  for (const property of forbiddenProperties) {
    expectNoOwnProperty(
      transition,
      property,
      `semantic handoff transition no ${property}`,
    );
    expectNoOwnProperty(
      noPreviousTransition,
      property,
      `semantic handoff no previous transition no ${property}`,
    );
  }

  expectTruthy(probeCountsBefore, 'semantic handoff transition probe counts before');
  expectTruthy(probeCountsAfter, 'semantic handoff transition probe counts after');

  if (probeCountsBefore && probeCountsAfter) {
    expectEqual(
      probeCountsAfter.sourceProbeCount,
      probeCountsBefore.sourceProbeCount,
      'semantic handoff transition source probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.sampleProbeCount,
      probeCountsBefore.sampleProbeCount,
      'semantic handoff transition sample probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.chartProbeCount,
      probeCountsBefore.chartProbeCount,
      'semantic handoff transition chart probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.featureProbeCount,
      probeCountsBefore.featureProbeCount,
      'semantic handoff transition feature probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.routeGateCandidateProbeCount,
      probeCountsBefore.routeGateCandidateProbeCount,
      'semantic handoff transition route/gate probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.supportRegionCandidateProbeCount,
      probeCountsBefore.supportRegionCandidateProbeCount,
      'semantic handoff transition support/region probe count unchanged',
    );
  }

  console.log('semantic handoff transition UI contract: PASS');
}

function runSemanticHandoffPressurePreviewUiContractDiagnostic() {
  const unsupportedRuntimeReport =
    buildProfileAwareFieldAtlasViewModelRuntimeReport(createSeedShape('tetrahedron'));
  const supportedRuntimeBefore = buildProfileAwareFieldAtlasViewModelRuntimeReport(
    applyAmboDissection(createSeedShape('tetrahedron')),
  );
  const unsupportedRecords =
    buildProfileAwareSemanticHandoffPressureRecords(unsupportedRuntimeReport);
  const supportedRecords =
    buildProfileAwareSemanticHandoffPressureRecords(supportedRuntimeBefore);
  const viewModel = supportedRuntimeBefore.viewModel;
  const probeCountsBefore = viewModel ? getProbeCounts(viewModel) : undefined;
  const supportedRuntimeAfter = buildProfileAwareFieldAtlasViewModelRuntimeReport(
    applyAmboDissection(createSeedShape('tetrahedron')),
  );
  const probeCountsAfter = supportedRuntimeAfter.viewModel
    ? getProbeCounts(supportedRuntimeAfter.viewModel)
    : undefined;

  expectEqual(
    unsupportedRecords.length,
    0,
    'semantic handoff pressure unsupported records',
  );
  expectTruthy(viewModel, 'semantic handoff pressure supported view model');

  if (!viewModel) {
    return;
  }

  const expectedRecordCount =
    viewModel.featureOverlaySummary.featureMarkers.length +
    viewModel.routeGateOverlaySummary.candidateMarkers.length +
    viewModel.supportRegionOverlaySummary.candidateMarkers.length;

  expectEqual(
    supportedRecords.length,
    expectedRecordCount,
    'semantic handoff pressure record count',
  );

  for (const record of supportedRecords) {
    expectTruthy(record.id, 'semantic handoff pressure record id');
    expectEqual(
      [
        'feature-observation',
        'route-gate-candidate',
        'support-region-candidate',
      ].includes(record.kind),
      true,
      `${record.id} semantic handoff pressure kind`,
    );
    expectTruthy(record.label, `${record.id} semantic handoff pressure label`);
    expectTruthy(record.probeRef, `${record.id} semantic handoff pressure probe ref`);
    expectEqual(
      ['report-candidate', 'candidate-only'].includes(record.candidateStatus),
      true,
      `${record.id} semantic handoff pressure status`,
    );
    expectEqual(
      record.semanticStatus,
      'not-semantic-naming',
      `${record.id} semantic handoff pressure semantic`,
    );
    expectEqual(
      record.topologyStatus,
      'not-topology-workspace',
      `${record.id} semantic handoff pressure topology`,
    );
    expectTruthy(
      record.pressureBasis,
      `${record.id} semantic handoff pressure basis`,
    );
    expectTruthy(record.reason, `${record.id} semantic handoff pressure reason`);
    expectEqual(
      Array.isArray(record.caveats),
      true,
      `${record.id} semantic handoff pressure caveats`,
    );
    expectTruthy(
      viewModel.probeIndex.probes[record.probeRef],
      `${record.id} semantic handoff pressure probe resolves`,
    );
    expectNoForbiddenPressureRecordProperties(record);

    switch (record.kind) {
      case 'feature-observation':
        expectEqual(
          record.candidateStatus,
          'report-candidate',
          `${record.id} feature pressure status`,
        );
        expectEqual(
          record.caveats.includes('report candidate'),
          true,
          `${record.id} feature pressure report caveat`,
        );
        expectEqual(
          record.caveats.includes('not semantic naming'),
          true,
          `${record.id} feature pressure semantic caveat`,
        );
        expectEqual(
          record.caveats.includes('not packet writing'),
          true,
          `${record.id} feature pressure packet caveat`,
        );
        break;
      case 'route-gate-candidate':
        expectEqual(
          record.candidateStatus,
          'candidate-only',
          `${record.id} route/gate pressure status`,
        );
        expectEqual(
          record.caveats.includes('not route confirmation'),
          true,
          `${record.id} route/gate pressure confirmation caveat`,
        );
        expectEqual(
          record.caveats.includes('not route persistence'),
          true,
          `${record.id} route/gate pressure persistence caveat`,
        );
        expectEqual(
          record.caveats.includes('not packet writing'),
          true,
          `${record.id} route/gate pressure packet caveat`,
        );
        break;
      case 'support-region-candidate':
        expectEqual(
          record.candidateStatus,
          'candidate-only',
          `${record.id} support/region pressure status`,
        );
        expectEqual(
          record.caveats.includes('not support/region confirmation'),
          true,
          `${record.id} support/region pressure confirmation caveat`,
        );
        expectEqual(
          record.caveats.includes('not support/region persistence'),
          true,
          `${record.id} support/region pressure persistence caveat`,
        );
        expectEqual(
          record.caveats.includes('not packet writing'),
          true,
          `${record.id} support/region pressure packet caveat`,
        );
        break;
      default:
        recordFailure(`${record.id} semantic handoff pressure unexpected kind`);
        break;
    }
  }

  expectTruthy(probeCountsBefore, 'semantic handoff pressure probe counts before');
  expectTruthy(probeCountsAfter, 'semantic handoff pressure probe counts after');

  if (probeCountsBefore && probeCountsAfter) {
    expectEqual(
      probeCountsAfter.sourceProbeCount,
      probeCountsBefore.sourceProbeCount,
      'semantic handoff pressure source probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.sampleProbeCount,
      probeCountsBefore.sampleProbeCount,
      'semantic handoff pressure sample probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.chartProbeCount,
      probeCountsBefore.chartProbeCount,
      'semantic handoff pressure chart probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.featureProbeCount,
      probeCountsBefore.featureProbeCount,
      'semantic handoff pressure feature probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.routeGateCandidateProbeCount,
      probeCountsBefore.routeGateCandidateProbeCount,
      'semantic handoff pressure route/gate probe count unchanged',
    );
    expectEqual(
      probeCountsAfter.supportRegionCandidateProbeCount,
      probeCountsBefore.supportRegionCandidateProbeCount,
      'semantic handoff pressure support/region probe count unchanged',
    );
  }

  console.log('semantic handoff pressure preview UI contract: PASS');
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

function expectChartContextFromSampleMarker(viewModel, marker) {
  expectTruthy(marker, 'chart linking sample marker exists');

  if (!marker) {
    return;
  }

  const probe = viewModel.probeIndex.probes[marker.probeRef];
  const chartIds = getChartIdsFromProfileAwareProbe(probe);
  const context = computeChartContextCounts(viewModel, chartIds);

  expectEqual(probe && probe.probeKind, 'surface-sample', 'sample chart probe kind');
  expectEqual(
    chartIds.includes(marker.chartId),
    true,
    'sample chart ids include sample chart',
  );
  expectEqual(
    context.sampleMarkerCount,
    viewModel.surfaceSampleMarkers.filter(
      (sampleMarker) => sampleMarker.chartId === marker.chartId,
    ).length,
    'sample chart context sample count',
  );
}

function expectChartContextFromFeatureMarker(viewModel, marker) {
  expectTruthy(marker, 'chart linking feature marker exists');

  if (!marker) {
    return;
  }

  const probe = viewModel.probeIndex.probes[marker.probeRef];
  const chartIds = getChartIdsFromProfileAwareProbe(probe);
  const context = computeChartContextCounts(viewModel, chartIds);

  expectEqual(
    probe && probe.probeKind,
    'feature-observation',
    'feature chart probe kind',
  );
  expectEqual(
    chartIds.includes(marker.chartId),
    true,
    'feature chart ids include feature chart',
  );
  expectAtLeast(
    context.featureMarkerCount,
    1,
    'feature chart context feature count computed',
  );
}

function expectChartContextFromRouteGateMarker(viewModel, marker) {
  expectTruthy(marker, 'chart linking route/gate marker exists');

  if (!marker) {
    return;
  }

  const probe = viewModel.probeIndex.probes[marker.probeRef];
  const chartIds = getChartIdsFromProfileAwareProbe(probe);
  const context = computeChartContextCounts(viewModel, chartIds);

  expectEqual(
    probe && probe.probeKind,
    'route-gate-candidate',
    'route/gate chart probe kind',
  );
  expectEqual(
    marker.chartIds.every((chartId) => chartIds.includes(chartId)),
    true,
    'route/gate active chart ids include candidate chart ids',
  );
  expectAtLeast(
    context.routeGateCandidateCount,
    1,
    'route/gate chart context candidate count computed',
  );
}

function expectChartContextFromSupportRegionMarker(viewModel, marker) {
  expectTruthy(marker, 'chart linking support/region marker exists');

  if (!marker) {
    return;
  }

  const probe = viewModel.probeIndex.probes[marker.probeRef];
  const chartIds = getChartIdsFromProfileAwareProbe(probe);
  const context = computeChartContextCounts(viewModel, chartIds);

  expectEqual(
    probe && probe.probeKind,
    'support-region-candidate',
    'support/region chart probe kind',
  );
  expectEqual(
    marker.chartIds.every((chartId) => chartIds.includes(chartId)),
    true,
    'support/region active chart ids include candidate chart ids',
  );
  expectAtLeast(
    context.supportRegionCandidateCount,
    1,
    'support/region chart context candidate count computed',
  );
}

function getChartIdsFromProfileAwareProbe(probe) {
  if (!probe) {
    return [];
  }

  switch (probe.probeKind) {
    case 'chart-summary':
    case 'surface-sample':
    case 'feature-observation':
      return [probe.chartId];
    case 'route-gate-candidate':
    case 'support-region-candidate':
      return [...probe.chartIds];
    default:
      return [];
  }
}

function computeChartContextCounts(viewModel, chartIds) {
  const activeChartIdSet = new Set(chartIds);

  return {
    sampleMarkerCount: viewModel.surfaceSampleMarkers.filter((marker) =>
      activeChartIdSet.has(marker.chartId),
    ).length,
    featureMarkerCount: viewModel.featureOverlaySummary.featureMarkers.filter(
      (marker) => activeChartIdSet.has(marker.chartId),
    ).length,
    routeGateCandidateCount:
      viewModel.routeGateOverlaySummary.candidateMarkers.filter((marker) =>
        marker.chartIds.some((chartId) => activeChartIdSet.has(chartId)),
      ).length,
    supportRegionCandidateCount:
      viewModel.supportRegionOverlaySummary.candidateMarkers.filter((marker) =>
        marker.chartIds.some((chartId) => activeChartIdSet.has(chartId)),
      ).length,
  };
}

function getProbeCounts(viewModel) {
  return {
    sourceProbeCount: viewModel.probeIndex.sourceProbeCount,
    sampleProbeCount: viewModel.probeIndex.sampleProbeCount,
    chartProbeCount: viewModel.probeIndex.chartProbeCount,
    featureProbeCount: viewModel.probeIndex.featureProbeCount,
    routeGateCandidateProbeCount:
      viewModel.probeIndex.routeGateCandidateProbeCount,
    supportRegionCandidateProbeCount:
      viewModel.probeIndex.supportRegionCandidateProbeCount,
  };
}

function buildProfileAwareSemanticHandoffSummary(
  runtimeReport,
  evidenceStabilityReport,
) {
  const samplingSensitive =
    evidenceStabilityReport.sensitivitySummary.samplingSensitive;
  const profileSetupSensitive =
    evidenceStabilityReport.sensitivitySummary.profileSetupSensitive;
  const sensitivityActive = samplingSensitive || profileSetupSensitive;
  const baseCaveats = [
    'not semantic naming',
    'not topology workspace',
    'not packet writing',
    'policy relative',
    'old policy not assumed invariant',
    'candidates are candidates only',
    'stability is sensitivity, not confirmation',
  ];

  if (runtimeReport.runtimeBoundaryStatus === 'unsupported') {
    return {
      readiness: 'not-available',
      fieldModeSupported: false,
      evidenceOk: evidenceStabilityReport.ok,
      samplingSensitive,
      profileSetupSensitive,
      changedCountKeyCount:
        evidenceStabilityReport.sensitivitySummary.changedCountKeys.length,
      featureCandidateCount: 0,
      routeGateCandidateCount: 0,
      supportRegionCandidateCount: 0,
      stableEnoughForInspection: false,
      semanticStatus: runtimeReport.semanticStatus,
      topologyStatus: runtimeReport.topologyStatus,
      packetWriteStatus: runtimeReport.packetWriteStatus,
      caveats: [
        runtimeReport.unsupportedIssueCode,
        runtimeReport.unsupportedReason,
        ...baseCaveats,
      ],
      handoffHints: [
        'Profile-aware Field Mode is not available for this shape.',
      ],
    };
  }

  const featureCandidateCount =
    runtimeReport.viewModel.featureOverlaySummary.featureMarkers.length;
  const routeGateCandidateCount =
    runtimeReport.viewModel.routeGateOverlaySummary.candidateMarkers.length;
  const supportRegionCandidateCount =
    runtimeReport.viewModel.supportRegionOverlaySummary.candidateMarkers.length;
  const candidateCount =
    featureCandidateCount + routeGateCandidateCount + supportRegionCandidateCount;
  const readiness =
    candidateCount === 0
      ? 'diagnostic-only'
      : sensitivityActive
        ? 'candidate-pressure-sensitive'
        : 'candidate-pressure-available';
  const handoffHints =
    candidateCount === 0
      ? [
          'Field can be inspected, but no candidate pressure families are currently available.',
        ]
      : sensitivityActive
        ? [
            'Candidate pressure is available, but sensitivity flags require cautious handoff.',
            'Review changed evidence counts before semantic or topological follow-up.',
          ]
        : [
            'Candidate pressure families are available for later semantic inspection.',
            'Use candidate counts as handoff pressure, not confirmation.',
          ];

  return {
    readiness,
    fieldModeSupported: true,
    evidenceOk: evidenceStabilityReport.ok,
    samplingSensitive,
    profileSetupSensitive,
    changedCountKeyCount:
      evidenceStabilityReport.sensitivitySummary.changedCountKeys.length,
    featureCandidateCount,
    routeGateCandidateCount,
    supportRegionCandidateCount,
    stableEnoughForInspection: evidenceStabilityReport.ok && !sensitivityActive,
    semanticStatus: runtimeReport.semanticStatus,
    topologyStatus: runtimeReport.topologyStatus,
    packetWriteStatus: runtimeReport.packetWriteStatus,
    caveats: baseCaveats,
    handoffHints,
  };
}

function buildProfileAwareSemanticHandoffTransition({
  previousSummary,
  currentSummary,
  previousShapeId,
  currentShapeId,
  previousLabel,
  currentLabel,
}) {
  const caveats = [
    'readiness summaries only',
    'no candidate identity',
    'no semantic continuity',
    'no topology continuity',
    'no route persistence',
    'no support/region persistence',
  ];

  if (!previousSummary) {
    return {
      status: 'no-previous-shape',
      previousShapeId,
      currentShapeId,
      previousLabel,
      currentLabel,
      currentReadiness: currentSummary.readiness,
      caveats,
      handoffHints: ['No previous shape in workspace sequence.'],
    };
  }

  const featureCandidateDelta =
    currentSummary.featureCandidateCount - previousSummary.featureCandidateCount;
  const routeGateCandidateDelta =
    currentSummary.routeGateCandidateCount -
    previousSummary.routeGateCandidateCount;
  const supportRegionCandidateDelta =
    currentSummary.supportRegionCandidateCount -
    previousSummary.supportRegionCandidateCount;
  const changedCountKeyDelta =
    currentSummary.changedCountKeyCount - previousSummary.changedCountKeyCount;
  const status = getProfileAwareSemanticHandoffTransitionStatus(
    previousSummary.readiness,
    currentSummary.readiness,
  );
  const handoffHints = getProfileAwareSemanticHandoffTransitionHints(
    status,
    previousSummary.readiness,
    currentSummary.readiness,
  );

  return {
    status,
    previousShapeId,
    currentShapeId,
    previousLabel,
    currentLabel,
    previousReadiness: previousSummary.readiness,
    currentReadiness: currentSummary.readiness,
    featureCandidateDelta,
    routeGateCandidateDelta,
    supportRegionCandidateDelta,
    changedCountKeyDelta,
    caveats,
    handoffHints,
  };
}

function getProfileAwareSemanticHandoffTransitionStatus(
  previousReadiness,
  currentReadiness,
) {
  if (
    previousReadiness === 'not-available' &&
    currentReadiness === 'candidate-pressure-available'
  ) {
    return 'handoff-became-available';
  }

  if (
    currentReadiness === 'candidate-pressure-sensitive' &&
    previousReadiness !== 'candidate-pressure-sensitive'
  ) {
    return 'handoff-became-sensitive';
  }

  if (currentReadiness === 'not-available') {
    return previousReadiness === 'not-available'
      ? 'handoff-remained-unavailable'
      : 'handoff-became-unavailable';
  }

  if (currentReadiness === 'diagnostic-only') {
    return 'handoff-became-diagnostic-only';
  }

  if (
    previousReadiness === 'candidate-pressure-sensitive' &&
    currentReadiness === 'candidate-pressure-sensitive'
  ) {
    return 'handoff-remained-sensitive';
  }

  if (currentReadiness === 'candidate-pressure-available') {
    return isProfileAwareCandidatePressureReadiness(previousReadiness)
      ? 'handoff-remained-available'
      : 'handoff-became-available';
  }

  return 'handoff-became-diagnostic-only';
}

function isProfileAwareCandidatePressureReadiness(readiness) {
  return (
    readiness === 'candidate-pressure-available' ||
    readiness === 'candidate-pressure-sensitive'
  );
}

function getProfileAwareSemanticHandoffTransitionHints(
  status,
  previousReadiness,
  currentReadiness,
) {
  if (
    previousReadiness === 'candidate-pressure-sensitive' &&
    currentReadiness === 'candidate-pressure-available'
  ) {
    return [
      'Candidate pressure is still available and sensitivity decreased.',
      'Treat deltas as handoff-pressure count changes only.',
    ];
  }

  switch (status) {
    case 'handoff-became-available':
      return ['Candidate pressure became available for semantic handoff inspection.'];
    case 'handoff-became-sensitive':
      return [
        'Candidate pressure is available, but the current handoff is sensitivity-marked.',
      ];
    case 'handoff-remained-available':
      return ['Candidate pressure remained available across the workspace transition.'];
    case 'handoff-remained-sensitive':
      return ['Candidate pressure remained sensitivity-marked across the transition.'];
    case 'handoff-became-diagnostic-only':
      return ['Current Field Mode remains inspectable, but candidate pressure is absent.'];
    case 'handoff-became-unavailable':
      return ['Profile-aware Field Mode became unavailable for handoff inspection.'];
    case 'handoff-remained-unavailable':
      return ['Profile-aware Field Mode remained unavailable across the transition.'];
    case 'no-previous-shape':
      return ['No previous shape in workspace sequence.'];
    default:
      return [];
  }
}

function buildProfileAwareSemanticHandoffPressureRecords(runtimeReport) {
  if (runtimeReport.runtimeBoundaryStatus !== 'supported') {
    return [];
  }

  const records = [];
  const viewModel = runtimeReport.viewModel;

  for (const marker of viewModel.featureOverlaySummary.featureMarkers) {
    const probe = viewModel.probeIndex.probes[marker.probeRef];

    records.push({
      id: marker.featureId,
      kind: 'feature-observation',
      label: formatObservationKind(marker.observationKind),
      probeRef: marker.probeRef,
      candidateStatus: marker.status,
      semanticStatus: marker.semanticStatus,
      topologyStatus: 'not-topology-workspace',
      pressureBasis: 'feature observation',
      sampleCount: 1,
      chartCount: 1,
      intensity: marker.intensity,
      relativeIntensity: marker.relativeIntensity,
      reason:
        probe && probe.probeKind === 'feature-observation'
          ? probe.reason
          : 'profile-aware feature observation marker',
      caveats: [
        'report candidate',
        'not semantic naming',
        'not topology workspace',
        'not packet writing',
      ],
    });
  }

  for (const marker of viewModel.routeGateOverlaySummary.candidateMarkers) {
    records.push({
      id: marker.candidateId,
      kind: 'route-gate-candidate',
      label: `${formatCompactKind(marker.candidateKind)} / ${formatCompactKind(
        marker.candidateSubtype,
      )}`,
      probeRef: marker.probeRef,
      candidateStatus: marker.status,
      semanticStatus: marker.semanticStatus,
      topologyStatus: marker.topologyStatus,
      pressureBasis: 'route/gate candidate pressure',
      sampleCount: marker.sampleIds.length,
      chartCount: marker.chartIds.length,
      reliability: marker.reliability,
      reason: marker.reason,
      caveats: [
        'candidate only',
        'not route confirmation',
        'not semantic naming',
        'not topology workspace',
        'not route persistence',
        'not packet writing',
      ],
    });
  }

  for (const marker of viewModel.supportRegionOverlaySummary.candidateMarkers) {
    records.push({
      id: marker.candidateId,
      kind: 'support-region-candidate',
      label: `${formatCompactKind(marker.candidateKind)} / ${formatCompactKind(
        marker.supportKind,
      )}`,
      probeRef: marker.probeRef,
      candidateStatus: marker.status,
      semanticStatus: marker.semanticStatus,
      topologyStatus: marker.topologyStatus,
      pressureBasis: 'support/region candidate pressure',
      sampleCount: marker.sampleIds.length,
      chartCount: marker.chartIds.length,
      observationCount: marker.observationIds.length,
      routeGateRefCount: marker.routeGateCandidateIds.length,
      reliability: marker.reliability,
      reason: marker.reason,
      caveats: [
        'candidate only',
        'not support/region confirmation',
        'not semantic naming',
        'not topology workspace',
        'not support/region persistence',
        'not packet writing',
      ],
    });
  }

  return records.sort((first, second) => {
    const kindDelta =
      getProfileAwareSemanticHandoffPressureKindOrder(first.kind) -
      getProfileAwareSemanticHandoffPressureKindOrder(second.kind);

    return kindDelta || first.id.localeCompare(second.id);
  });
}

function getProfileAwareSemanticHandoffPressureKindOrder(kind) {
  switch (kind) {
    case 'feature-observation':
      return 0;
    case 'route-gate-candidate':
      return 1;
    case 'support-region-candidate':
      return 2;
    default:
      return 3;
  }
}

function expectNoForbiddenPressureRecordProperties(record) {
  const forbiddenProperties = [
    'semanticName',
    'topologyValidityStatus',
    'packetWriteEnabled',
    'handoffPacketWritten',
    'routeGateConfirmedStatus',
    'supportRegionConfirmedStatus',
    'oldPolicyInvariantStatus',
    'defaultPolicyComparisonStatus',
    'candidateIdentityPersistenceStatus',
    'routePersistenceStatus',
    'supportRegionPersistenceStatus',
    'semanticContinuityStatus',
    'topologyContinuityStatus',
    'fieldOntologyDeltaStatus',
    'semanticScore',
    'semanticRank',
  ];

  for (const property of forbiddenProperties) {
    expectNoOwnProperty(
      record,
      property,
      `${record.id} semantic handoff pressure no ${property}`,
    );
  }
}

function formatObservationKind(kind) {
  switch (kind) {
    case 'cancellation-like-site-candidate':
      return 'Cancellation-like candidate';
    case 'high-intensity-anchor-candidate':
      return 'High-intensity anchor candidate';
    case 'ambiguous-field-site':
      return 'Ambiguous field-site candidate';
    default:
      return kind;
  }
}

function formatCompactKind(kind) {
  return String(kind).replace(/-/g, ' ');
}

function getDominantSourceIdFromSampleMarker(marker) {
  return marker && marker.dominantContributionSourceId
    ? marker.dominantContributionSourceId
    : undefined;
}

function getDominantSourceIdFromProbe(probe, viewModel) {
  if (!probe) {
    return undefined;
  }

  switch (probe.probeKind) {
    case 'source':
      return probe.sourceId;
    case 'surface-sample':
      return probe.dominantContributionSourceId;
    case 'feature-observation': {
      const linkedProbe = viewModel.probeIndex.probes[probe.linkedSampleProbeRef];

      return linkedProbe && linkedProbe.probeKind === 'surface-sample'
        ? linkedProbe.dominantContributionSourceId
        : undefined;
    }
    default:
      return undefined;
  }
}

function findSourceMarkerWithSampleContribution(viewModel) {
  for (const sourceMarker of viewModel.sourceMarkers) {
    const matchingSamples = viewModel.surfaceSampleMarkers.filter((marker) =>
      marker.contributionRatios.some(
        (ratio) =>
          ratio.sourceId === sourceMarker.sourceId &&
          Number.isFinite(ratio.value) &&
          ratio.value > 0,
      ),
    );

    if (matchingSamples.length > 0) {
      return sourceMarker;
    }
  }

  return undefined;
}

function findFeatureMarkerWithLinkedDominantSource(viewModel) {
  for (const featureMarker of viewModel.featureOverlaySummary.featureMarkers) {
    const featureProbe = viewModel.probeIndex.probes[featureMarker.probeRef];

    if (!featureProbe || featureProbe.probeKind !== 'feature-observation') {
      continue;
    }

    const linkedSampleProbe =
      viewModel.probeIndex.probes[featureProbe.linkedSampleProbeRef];

    if (
      linkedSampleProbe &&
      linkedSampleProbe.probeKind === 'surface-sample' &&
      linkedSampleProbe.dominantContributionSourceId
    ) {
      return {
        featureMarker,
        featureProbe,
        linkedSampleProbe,
        linkedSampleDominantSourceId:
          linkedSampleProbe.dominantContributionSourceId,
      };
    }
  }

  return undefined;
}

function computeSourceContextCounts(viewModel, sourceId) {
  const topSamples = viewModel.surfaceSampleMarkers
    .map((marker) => {
      const contributionRatio = marker.contributionRatios.find(
        (ratio) => ratio.sourceId === sourceId && ratio.value > 0,
      );

      return contributionRatio
        ? {
            sampleId: marker.sampleId,
            chartId: marker.chartId,
            contributionRatio: contributionRatio.value,
            intensity: marker.intensity,
          }
        : null;
    })
    .filter((sample) => Boolean(sample))
    .sort(
      (first, second) =>
        second.contributionRatio - first.contributionRatio ||
        first.sampleId.localeCompare(second.sampleId),
    );
  const sampleIds = new Set(topSamples.map((sample) => sample.sampleId));
  const featureMarkerCount =
    viewModel.featureOverlaySummary.featureMarkers.filter((marker) =>
      sampleIds.has(marker.sampleId),
    ).length;

  return {
    sampleMarkerCount: topSamples.length,
    featureMarkerCount,
    topSamples: topSamples.slice(0, 4),
  };
}

function expectSourceContextTopSamples(context, label) {
  for (const sample of context.topSamples) {
    expectFinite(sample.contributionRatio, `${label} ${sample.sampleId} ratio`);
    expectAtLeast(
      sample.contributionRatio,
      0,
      `${label} ${sample.sampleId} nonnegative ratio`,
    );
    expectFinite(sample.intensity, `${label} ${sample.sampleId} intensity`);
  }
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

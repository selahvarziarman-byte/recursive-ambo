import { createSeedShape } from '../data/seeds';
import type { Vec3 } from '../types/geometry';
import { applyAmboDissection } from './ambo';
import {
  buildTetrahedralAmboChildContexts,
  createTetrahedralVertexFixture,
} from './fieldSourceChildContexts';
import {
  buildTetrahedralChildSourceProfileDerivationReport,
} from './fieldSourceChildDerivations';
import {
  buildTetrahedralChildProfileDegeneracyReport,
} from './fieldSourceChildDegeneracy';
import {
  buildProfileAwareAtlasAdapterReport,
  type ProfileAwareAtlasAdapterReport,
  type ProfileAwareAtlasSourceEntry,
} from './fieldSourceProfileAwareAtlasAdapter';
import {
  buildProfileAwareFeatureReportDiagnosticReport,
  type ProfileAwareFeatureReportDiagnosticReport,
} from './fieldSourceProfileAwareFeatureReport';
import {
  buildProfileAwareFieldSourcePolicyDiagnosticReport,
  type ProfileAwareFieldSourcePolicyDiagnosticReport,
  type ProfileAwareSourceEntry,
} from './fieldSourceProfileAwarePolicy';
import {
  buildProfileAwareRouteGateCandidateDiagnosticReport,
  type ProfileAwareRouteGateCandidateDiagnosticReport,
} from './fieldSourceProfileAwareRouteGateCandidates';
import {
  buildProfileAwareShapePositionResolverReport,
  type ProfileAwareShapePositionResolverReport,
} from './fieldSourceProfileAwareShapePositionResolver';
import {
  buildProfileAwareShapeResolvedSurfaceAtlas,
  type ProfileAwareShapeResolvedSurfaceAtlasResult,
} from './fieldSourceProfileAwareShapeResolvedSurfaceAtlas';
import {
  buildProfileAwareSupportRegionCandidateDiagnosticReport,
  type ProfileAwareSupportRegionCandidateDiagnosticReport,
} from './fieldSourceProfileAwareSupportRegionCandidates';
import {
  buildPrimalProfileAssignmentDiagnosticReport,
  createTetrahedronFieldSourceProfileSetupFixture,
  createTetrahedronPrimalProfileAssignmentFixture,
  createUniformCirclePrimalProfileSystemFixture,
  generateFieldSourceProfiles,
} from './fieldSourceProfiles';
import {
  buildTetrahedralQuarkChannelReport,
} from './fieldSourceQuarkChannels';
import type {
  SampledClosedShapeSurfaceAtlas,
  SurfaceChartAtlasSample,
  SurfaceChartSampleSummary,
} from './fieldAtlasSurfaceSampling';

export type ProfileAwareFieldAtlasViewModelIssueCode =
  | 'layer-report-not-ok'
  | 'sampled-atlas-unavailable'
  | 'source-marker-count-mismatch'
  | 'surface-sample-marker-count-mismatch'
  | 'probe-index-count-mismatch'
  | 'feature-count-mismatch'
  | 'route-gate-count-mismatch'
  | 'support-region-count-mismatch'
  | 'unexpected-shape-mutation';

export interface ProfileAwareFieldAtlasViewModelIssue {
  code: ProfileAwareFieldAtlasViewModelIssueCode;
  message: string;
  layer?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface ProfileAwareFieldAtlasSourceMarker {
  sourceId: string;
  vertexId: string;
  sourceKind: ProfileAwareAtlasSourceEntry['sourceKind'];
  renderKind: 'source-marker';
  renderable: true;
  position: Vec3;
  amplitude: number;
  waveNumber: number;
  phase: number;
  attenuation: number;
  profileId?: string;
  sourceEdgeId?: string;
  complementEdgeId?: string;
  antipodalChildVertexId?: string;
  degeneracyStatuses?: string[];
  isGeneratedChildSource: boolean;
  isPrimalSource: boolean;
  probeRef: string;
}

export interface ProfileAwareFieldAtlasSourceCaveatMarker {
  sourceId: string;
  vertexId: string;
  sourceKind: Extract<
    ProfileAwareSourceEntry['sourceKind'],
    'generated-child-fallback' | 'generated-child-unresolved'
  >;
  renderKind: 'non-renderable-source-caveat';
  renderable: false;
  position?: Vec3;
  fallbackKind?: string;
  fallbackReason?: string;
  sourceEdgeId?: string;
  complementEdgeId?: string;
  antipodalChildVertexId?: string;
  degeneracyStatuses?: string[];
  probeRef: string;
}

export interface ProfileAwareFieldAtlasContributionRatioView {
  sourceId: string;
  vertexId: string;
  value: number;
}

export interface ProfileAwareFieldAtlasTopContributionView
  extends ProfileAwareFieldAtlasContributionRatioView {
  magnitude?: number;
}

export interface ProfileAwareFieldAtlasSurfaceSampleMarker {
  sampleId: string;
  renderKind: 'surface-sample-marker';
  chartId: string;
  sourceFaceId?: string;
  position: Vec3;
  localChartPosition?: [number, number];
  intensity: number;
  phase: number;
  dominantContributionSourceId?: string;
  dominantContributionRatio?: number;
  contributionRatios: ProfileAwareFieldAtlasContributionRatioView[];
  contributionRatioSum: number;
  contributionCount: number;
  probeRef: string;
}

export interface ProfileAwareFieldAtlasChartSummaryView {
  chartId: string;
  sourceFaceId: string;
  chartSemanticRole: SurfaceChartSampleSummary['chartSemanticRole'];
  sampleCount: number;
  minIntensity: number;
  maxIntensity: number;
  minPhase: number;
  maxPhase: number;
  allContributionRatiosValid: boolean;
}

export interface ProfileAwareFieldAtlasRenderScale {
  intensityMin: number;
  intensityMax: number;
  phaseMin: number;
  phaseMax: number;
  dominantContributionRatioMin: number;
  dominantContributionRatioMax: number;
  sampleCount: number;
  sourceCount: number;
}

export interface ProfileAwareFieldAtlasFeatureOverlaySummary {
  overlayStatus: 'summary-only';
  observationStatus: ProfileAwareFeatureReportDiagnosticReport['observationStatus'];
  totalObservationCount: number;
  cancellationLikeObservationCount: number;
  highIntensityAnchorObservationCount: number;
  ambiguousObservationCount: number;
  featureMarkers: [];
  summaryProbeRef: 'feature:summary';
}

export interface ProfileAwareFieldAtlasRouteGateOverlaySummary {
  overlayStatus: 'summary-only';
  candidateStatus: ProfileAwareRouteGateCandidateDiagnosticReport['candidateStatus'];
  totalRouteGateCandidateCount: number;
  gateCandidateCount: number;
  routeCandidateCount: number;
  blockedRouteCandidateCount: number;
  candidateRefs: [];
  summaryProbeRef: 'routeGate:summary';
}

export interface ProfileAwareFieldAtlasSupportRegionOverlaySummary {
  overlayStatus: 'summary-only';
  candidateStatus: ProfileAwareSupportRegionCandidateDiagnosticReport['candidateStatus'];
  totalSupportRegionCandidateCount: number;
  supportClassCandidateCount: number;
  regionCandidateCount: number;
  constraintSiteCandidateCount: number;
  routeFailureRegionCandidateCount: number;
  candidateRefs: [];
  summaryProbeRef: 'supportRegion:summary';
}

export interface ProfileAwareFieldAtlasSourceProbe {
  probeKind: 'source';
  sourceId: string;
  vertexId: string;
  sourceKind: ProfileAwareAtlasSourceEntry['sourceKind'];
  position: Vec3;
  emissionParameters: {
    amplitude: number;
    waveNumber: number;
    phase: number;
    attenuation: number;
  };
  profileId?: string;
  sourceEdgeId?: string;
  complementEdgeId?: string;
  antipodalChildVertexId?: string;
  degeneracyStatuses?: string[];
  candidateCaveats: string[];
  semanticStatus: 'not-semantic-naming';
}

export interface ProfileAwareFieldAtlasSurfaceSampleProbe {
  probeKind: 'surface-sample';
  sampleId: string;
  position: Vec3;
  chartId: string;
  sourceFaceId?: string;
  intensity: number;
  phase: number;
  psi: {
    re: number;
    im: number;
  };
  topContributions: ProfileAwareFieldAtlasTopContributionView[];
  contributionRatioSum: number;
  dominantContributionSourceId?: string;
  dominantContributionRatio?: number;
  semanticStatus: 'not-semantic-naming';
}

export interface ProfileAwareFieldAtlasSummaryProbe {
  probeKind: 'feature-summary' | 'route-gate-summary' | 'support-region-summary';
  semanticStatus: 'not-semantic-naming';
  candidateStatus: 'report-candidate' | 'candidate-only';
  totalCount: number;
}

export type ProfileAwareFieldAtlasProbe =
  | ProfileAwareFieldAtlasSourceProbe
  | ProfileAwareFieldAtlasSurfaceSampleProbe
  | ProfileAwareFieldAtlasSummaryProbe;

export interface ProfileAwareFieldAtlasProbeIndex {
  probeCount: number;
  sourceProbeCount: number;
  sampleProbeCount: number;
  featureProbeCount: number;
  routeGateProbeCount: number;
  supportRegionProbeCount: number;
  probes: Record<string, ProfileAwareFieldAtlasProbe>;
}

export interface ProfileAwareFieldAtlasViewModelReport {
  reportId: string;
  method: 'profile-aware-field-atlas-view-model-diagnostic-v0';
  diagnosticScope: 'profile-aware-field-atlas-view-model-only';
  productRole: 'field-mode-render-and-probe-contract';
  sourcePolicyId: 'profile-aware-quark-child-inheritance-v0';
  policyRelativityStatus: 'policy-relative';
  contrastPolicyNote: 'old-policy-not-assumed-invariant';
  integrationStatus: 'diagnostic-view-model-only';
  runtimeIntegrationStatus: 'not-runtime-integrated';
  uiExposureStatus: 'not-ui-exposed';
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  phaseContinuityStatus: 'not-global-phase-continuity';
  shapeMutationStatus: 'not-shape-mutation';
  packetWriteStatus: 'not-packet-writing';
  fieldAtlasSourcePolicyMutationStatus: 'not-mutated';
  fieldAtlasMutationStatus: 'not-mutated';
  shapeId: string;
  domainId?: string;
  domainKind?: SampledClosedShapeSurfaceAtlas['domain']['kind'];
  chartCount: number;
  sampleCount: number;
  sourceCount: number;
  primalSourceCount: number;
  childSourceCount: number;
  renderableChildSourceCount: number;
  nonRenderableChildSourceCount: number;
  fallbackChildSourceCount: number;
  unresolvedChildSourceCount: number;
  degeneracyStatusCount: number;
  renderModelStatus: 'renderable-diagnostic-model';
  probeModelStatus: 'probe-ready-diagnostic-model';
  candidateOverlayStatus: 'candidate-overlay-summary-only';
  sourceMarkers: ProfileAwareFieldAtlasSourceMarker[];
  sourceCaveatMarkers: ProfileAwareFieldAtlasSourceCaveatMarker[];
  surfaceSampleMarkers: ProfileAwareFieldAtlasSurfaceSampleMarker[];
  chartSummaries: ProfileAwareFieldAtlasChartSummaryView[];
  renderScale: ProfileAwareFieldAtlasRenderScale;
  featureOverlaySummary: ProfileAwareFieldAtlasFeatureOverlaySummary;
  routeGateOverlaySummary: ProfileAwareFieldAtlasRouteGateOverlaySummary;
  supportRegionOverlaySummary: ProfileAwareFieldAtlasSupportRegionOverlaySummary;
  probeIndex: ProfileAwareFieldAtlasProbeIndex;
  ok: boolean;
  issueCount: number;
  issues: ProfileAwareFieldAtlasViewModelIssue[];
}

interface BuiltProfileAwareSourceChain {
  profileAwarePolicyReport: ProfileAwareFieldSourcePolicyDiagnosticReport;
  adapterReport: ProfileAwareAtlasAdapterReport;
}

const METHOD = 'profile-aware-field-atlas-view-model-diagnostic-v0';
const DIAGNOSTIC_SCOPE = 'profile-aware-field-atlas-view-model-only';
const SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const CONTRAST_POLICY_NOTE = 'old-policy-not-assumed-invariant';
const ACTIVE_TETRAHEDRON_PRIMAL_VERTICES = ['A', 'B', 'C', 'D'];

const SURFACE_SAMPLING_OPTIONS = {
  subdivisions: 1,
  maxSamples: 96,
};

const ROUTE_GATE_OPTIONS = {
  maxGateCandidates: 8,
  maxRouteCandidates: 4,
  maxBlockedRouteCandidates: 8,
};

const SUPPORT_REGION_OPTIONS = {
  maxSupportClassCandidates: 8,
  maxRegionCandidates: 6,
  maxConstraintSiteCandidates: 8,
  maxRouteFailureRegionCandidates: 6,
};

export function buildProfileAwareFieldAtlasViewModelReport(): ProfileAwareFieldAtlasViewModelReport {
  const issues: ProfileAwareFieldAtlasViewModelIssue[] = [];
  const shape = applyAmboDissection(createSeedShape('tetrahedron'));
  const beforeShapeJson = JSON.stringify(shape);
  const { profileAwarePolicyReport, adapterReport } =
    buildProfileAwareSourceChain();
  const resolverReport = buildProfileAwareShapePositionResolverReport(shape);
  const sourceCountMetadata = {
    fieldReadySourceCount: adapterReport.fieldReadySourceCount,
    fallbackChildSourceCount: adapterReport.fallbackChildSourceCount,
    unresolvedChildSourceCount: adapterReport.unresolvedChildSourceCount,
    degeneracyStatusCount: adapterReport.degeneracyStatusCount,
  };
  const surfaceAtlasResult = buildProfileAwareShapeResolvedSurfaceAtlas({
    shape,
    atlasSources: adapterReport.atlasSources,
    resolverReport,
    samplingOptions: SURFACE_SAMPLING_OPTIONS,
    sourceCountMetadata,
    reportIdSuffix: 'profile-aware-atlas-view-model',
  });
  const featureReport = buildProfileAwareFeatureReportDiagnosticReport({
    surfaceAtlasResult,
    reportIdSuffix: 'profile-aware-atlas-view-model',
  });
  const routeGateReport = buildProfileAwareRouteGateCandidateDiagnosticReport({
    surfaceAtlasResult,
    routeGateOptions: ROUTE_GATE_OPTIONS,
    reportIdSuffix: 'profile-aware-atlas-view-model',
  });
  const supportRegionReport =
    buildProfileAwareSupportRegionCandidateDiagnosticReport({
      surfaceAtlasResult,
      supportRegionOptions: SUPPORT_REGION_OPTIONS,
      reportIdSuffix: 'profile-aware-atlas-view-model',
    });
  const sampledAtlas = surfaceAtlasResult.sampledAtlas;

  appendLayerIssues(
    [
      ['profileAwarePolicy', profileAwarePolicyReport.ok, profileAwarePolicyReport.issueCount],
      ['atlasAdapter', adapterReport.ok, adapterReport.issueCount],
      ['shapePositionResolver', resolverReport.ok, resolverReport.issueCount],
      ['surfaceAtlas', surfaceAtlasResult.report.ok, surfaceAtlasResult.report.issueCount],
      ['featureReport', featureReport.ok, featureReport.issueCount],
      ['routeGate', routeGateReport.ok, routeGateReport.issueCount],
      ['supportRegion', supportRegionReport.ok, supportRegionReport.issueCount],
    ],
    issues,
  );

  if (!sampledAtlas) {
    issues.push({
      code: 'sampled-atlas-unavailable',
      message:
        'Profile-aware atlas view model cannot build sample markers because no sampled atlas was produced.',
      layer: 'surfaceAtlas',
    });
  }

  const sourceMarkers = buildSourceMarkers({
    adapterReport,
    policyReport: profileAwarePolicyReport,
    resolverReport,
  });
  const sourceCaveatMarkers = buildSourceCaveatMarkers({
    policyReport: profileAwarePolicyReport,
    resolverReport,
  });
  const surfaceSampleMarkers = sampledAtlas
    ? sampledAtlas.samples.map(buildSurfaceSampleMarker)
    : [];
  const chartSummaries = sampledAtlas
    ? sampledAtlas.chartSummaries.map(buildChartSummary)
    : [];
  const featureOverlaySummary = buildFeatureOverlaySummary(featureReport);
  const routeGateOverlaySummary = buildRouteGateOverlaySummary(routeGateReport);
  const supportRegionOverlaySummary =
    buildSupportRegionOverlaySummary(supportRegionReport);
  const probeIndex = buildProbeIndex({
    sourceMarkers,
    surfaceSampleMarkers,
    sampledAtlas,
    featureOverlaySummary,
    routeGateOverlaySummary,
    supportRegionOverlaySummary,
  });
  const shapeWasMutated = JSON.stringify(shape) !== beforeShapeJson;

  appendViewModelIssues(
    {
      adapterReport,
      sourceMarkers,
      surfaceSampleMarkers,
      sampledAtlas,
      probeIndex,
      featureOverlaySummary,
      routeGateOverlaySummary,
      supportRegionOverlaySummary,
      shapeWasMutated,
    },
    issues,
  );

  const issueCount = issues.length;

  return {
    reportId: `${METHOD}:tetrahedron-one-ambo`,
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    productRole: 'field-mode-render-and-probe-contract',
    sourcePolicyId: SOURCE_POLICY_ID,
    policyRelativityStatus: 'policy-relative',
    contrastPolicyNote: CONTRAST_POLICY_NOTE,
    integrationStatus: 'diagnostic-view-model-only',
    runtimeIntegrationStatus: 'not-runtime-integrated',
    uiExposureStatus: 'not-ui-exposed',
    semanticStatus: 'not-semantic-naming',
    topologyStatus: 'not-topology-workspace',
    phaseContinuityStatus: 'not-global-phase-continuity',
    shapeMutationStatus: 'not-shape-mutation',
    packetWriteStatus: 'not-packet-writing',
    fieldAtlasSourcePolicyMutationStatus: 'not-mutated',
    fieldAtlasMutationStatus: 'not-mutated',
    shapeId: surfaceAtlasResult.report.shapeId,
    ...(surfaceAtlasResult.report.domainId
      ? { domainId: surfaceAtlasResult.report.domainId }
      : {}),
    ...(surfaceAtlasResult.report.domainKind
      ? { domainKind: surfaceAtlasResult.report.domainKind }
      : {}),
    chartCount: surfaceAtlasResult.report.chartCount,
    sampleCount: surfaceSampleMarkers.length,
    sourceCount: sourceMarkers.length,
    primalSourceCount: profileAwarePolicyReport.primalSourceCount,
    childSourceCount: profileAwarePolicyReport.childSourceCount,
    renderableChildSourceCount: sourceMarkers.filter(
      (marker) => marker.isGeneratedChildSource,
    ).length,
    nonRenderableChildSourceCount: sourceCaveatMarkers.length,
    fallbackChildSourceCount: profileAwarePolicyReport.fallbackChildSourceCount,
    unresolvedChildSourceCount: profileAwarePolicyReport.unresolvedChildSourceCount,
    degeneracyStatusCount: profileAwarePolicyReport.degeneracyStatusCount,
    renderModelStatus: 'renderable-diagnostic-model',
    probeModelStatus: 'probe-ready-diagnostic-model',
    candidateOverlayStatus: 'candidate-overlay-summary-only',
    sourceMarkers,
    sourceCaveatMarkers,
    surfaceSampleMarkers,
    chartSummaries,
    renderScale: buildRenderScale(sourceMarkers, surfaceSampleMarkers),
    featureOverlaySummary,
    routeGateOverlaySummary,
    supportRegionOverlaySummary,
    probeIndex,
    ok:
      issueCount === 0 &&
      profileAwarePolicyReport.ok &&
      adapterReport.ok &&
      resolverReport.ok &&
      surfaceAtlasResult.report.ok &&
      featureReport.ok &&
      routeGateReport.ok &&
      supportRegionReport.ok,
    issueCount,
    issues,
  };
}

function buildProfileAwareSourceChain(): BuiltProfileAwareSourceChain {
  const vertexIds = createTetrahedralVertexFixture();
  const profileSystem = createUniformCirclePrimalProfileSystemFixture();
  const profiles = generateFieldSourceProfiles(profileSystem);
  const assignments = createTetrahedronPrimalProfileAssignmentFixture(profiles);
  const setup = createTetrahedronFieldSourceProfileSetupFixture(
    profileSystem,
    assignments,
  );
  const profileAssignmentReport = buildPrimalProfileAssignmentDiagnosticReport({
    profileSystem,
    setup,
    activePrimalVertexIds: ACTIVE_TETRAHEDRON_PRIMAL_VERTICES,
  });
  const profileById = new Map(profiles.map((profile) => [profile.profileId, profile]));
  const profileByVertexId = new Map<string, (typeof profiles)[number]>();

  for (const assignment of assignments) {
    const profile = profileById.get(assignment.profileId);

    if (profile) {
      profileByVertexId.set(assignment.vertexId, profile);
    }
  }

  const childContexts = buildTetrahedralAmboChildContexts(vertexIds);
  const childDerivationReports = childContexts.map((childContext) => {
    const quarkChannelReport = buildTetrahedralQuarkChannelReport({
      childContext,
      profileByVertexId,
    });

    return buildTetrahedralChildSourceProfileDerivationReport({
      childContext,
      quarkChannelReport,
    });
  });
  const childDegeneracyReport = buildTetrahedralChildProfileDegeneracyReport({
    childContexts,
    derivationReports: childDerivationReports,
  });
  const profileAwarePolicyReport =
    buildProfileAwareFieldSourcePolicyDiagnosticReport({
      profileAssignmentReport,
      childContexts,
      childDerivationReports,
      childDegeneracyReport,
    });
  const adapterReport = buildProfileAwareAtlasAdapterReport({
    profileAwarePolicyReport,
  });

  return {
    profileAwarePolicyReport,
    adapterReport,
  };
}

function buildSourceMarkers(args: {
  adapterReport: ProfileAwareAtlasAdapterReport;
  policyReport: ProfileAwareFieldSourcePolicyDiagnosticReport;
  resolverReport: ProfileAwareShapePositionResolverReport;
}): ProfileAwareFieldAtlasSourceMarker[] {
  const policySourceById = new Map(
    args.policyReport.sources.map((source) => [source.sourceId, source]),
  );

  return args.adapterReport.atlasSources
    .map((source) => {
      const policySource = policySourceById.get(source.sourceId);
      const position = args.resolverReport.positionByVertexId[source.vertexId];

      if (!position) {
        return null;
      }

      const marker: ProfileAwareFieldAtlasSourceMarker = {
        sourceId: source.sourceId,
        vertexId: source.vertexId,
        sourceKind: source.sourceKind,
        renderKind: 'source-marker',
        renderable: true,
        position: copyVec3(position),
        amplitude: source.amplitude,
        waveNumber: source.waveNumber,
        phase: source.phase,
        attenuation: source.attenuation,
        ...(policySource?.profileId ? { profileId: policySource.profileId } : {}),
        ...(source.sourceEdgeId ? { sourceEdgeId: source.sourceEdgeId } : {}),
        ...(source.complementEdgeId
          ? { complementEdgeId: source.complementEdgeId }
          : {}),
        ...(source.antipodalChildVertexId
          ? { antipodalChildVertexId: source.antipodalChildVertexId }
          : {}),
        ...(policySource?.degeneracyStatuses
          ? { degeneracyStatuses: [...policySource.degeneracyStatuses] }
          : {}),
        isGeneratedChildSource: source.sourceKind === 'generated-child-derived',
        isPrimalSource: source.sourceKind === 'primal-assigned',
        probeRef: `source:${source.sourceId}`,
      };

      return marker;
    })
    .filter(
      (marker): marker is ProfileAwareFieldAtlasSourceMarker => Boolean(marker),
    );
}

function buildSourceCaveatMarkers(args: {
  policyReport: ProfileAwareFieldSourcePolicyDiagnosticReport;
  resolverReport: ProfileAwareShapePositionResolverReport;
}): ProfileAwareFieldAtlasSourceCaveatMarker[] {
  return args.policyReport.sources
    .filter(
      (
        source,
      ): source is ProfileAwareSourceEntry & {
        sourceKind: 'generated-child-fallback' | 'generated-child-unresolved';
      } =>
        source.sourceKind === 'generated-child-fallback' ||
        source.sourceKind === 'generated-child-unresolved',
    )
    .map((source) => {
      const position = args.resolverReport.positionByVertexId[source.vertexId];

      return {
        sourceId: source.sourceId,
        vertexId: source.vertexId,
        sourceKind: source.sourceKind,
        renderKind: 'non-renderable-source-caveat',
        renderable: false,
        ...(position ? { position: copyVec3(position) } : {}),
        ...(source.fallbackKind ? { fallbackKind: source.fallbackKind } : {}),
        ...(source.fallbackReason ? { fallbackReason: source.fallbackReason } : {}),
        ...(source.sourceEdgeId ? { sourceEdgeId: source.sourceEdgeId } : {}),
        ...(source.complementEdgeId
          ? { complementEdgeId: source.complementEdgeId }
          : {}),
        ...(source.antipodalChildVertexId
          ? { antipodalChildVertexId: source.antipodalChildVertexId }
          : {}),
        ...(source.degeneracyStatuses
          ? { degeneracyStatuses: [...source.degeneracyStatuses] }
          : {}),
        probeRef: `source-caveat:${source.sourceId}`,
      };
    });
}

function buildSurfaceSampleMarker(
  sample: SurfaceChartAtlasSample,
): ProfileAwareFieldAtlasSurfaceSampleMarker {
  const dominantContribution = getDominantContribution(sample);
  const contributionRatios = sample.contributionRatios.map((ratio) => ({
    sourceId: ratio.sourceId,
    vertexId: ratio.vertexId,
    value: ratio.value,
  }));
  const contributionRatioSum = contributionRatios.reduce(
    (sum, ratio) => sum + ratio.value,
    0,
  );

  return {
    sampleId: sample.id,
    renderKind: 'surface-sample-marker',
    chartId: sample.chartId,
    sourceFaceId: sample.sourceFaceId,
    position: copyVec3(sample.position),
    localChartPosition: [
      sample.localChartPosition[0],
      sample.localChartPosition[1],
    ],
    intensity: sample.intensity,
    phase: sample.phase,
    ...(dominantContribution
      ? {
          dominantContributionSourceId: dominantContribution.sourceId,
          dominantContributionRatio: dominantContribution.value,
        }
      : {}),
    contributionRatios,
    contributionRatioSum,
    contributionCount: contributionRatios.length,
    probeRef: `sample:${sample.id}`,
  };
}

function buildChartSummary(
  summary: SurfaceChartSampleSummary,
): ProfileAwareFieldAtlasChartSummaryView {
  return {
    chartId: summary.chartId,
    sourceFaceId: summary.sourceFaceId,
    chartSemanticRole: summary.chartSemanticRole,
    sampleCount: summary.sampleCount,
    minIntensity: summary.minIntensity,
    maxIntensity: summary.maxIntensity,
    minPhase: summary.minPhase,
    maxPhase: summary.maxPhase,
    allContributionRatiosValid: summary.allContributionRatiosValid,
  };
}

function buildRenderScale(
  sourceMarkers: ProfileAwareFieldAtlasSourceMarker[],
  sampleMarkers: ProfileAwareFieldAtlasSurfaceSampleMarker[],
): ProfileAwareFieldAtlasRenderScale {
  const dominantRatios = sampleMarkers
    .map((sample) => sample.dominantContributionRatio)
    .filter((value): value is number => typeof value === 'number');

  return {
    intensityMin: getNumberRange(sampleMarkers.map((sample) => sample.intensity)).min,
    intensityMax: getNumberRange(sampleMarkers.map((sample) => sample.intensity)).max,
    phaseMin: getNumberRange(sampleMarkers.map((sample) => sample.phase)).min,
    phaseMax: getNumberRange(sampleMarkers.map((sample) => sample.phase)).max,
    dominantContributionRatioMin: getNumberRange(dominantRatios).min,
    dominantContributionRatioMax: getNumberRange(dominantRatios).max,
    sampleCount: sampleMarkers.length,
    sourceCount: sourceMarkers.length,
  };
}

function buildFeatureOverlaySummary(
  report: ProfileAwareFeatureReportDiagnosticReport,
): ProfileAwareFieldAtlasFeatureOverlaySummary {
  return {
    overlayStatus: 'summary-only',
    observationStatus: report.observationStatus,
    totalObservationCount: report.totalObservationCount,
    cancellationLikeObservationCount: report.cancellationLikeObservationCount,
    highIntensityAnchorObservationCount:
      report.highIntensityAnchorObservationCount,
    ambiguousObservationCount: report.ambiguousObservationCount,
    featureMarkers: [],
    summaryProbeRef: 'feature:summary',
  };
}

function buildRouteGateOverlaySummary(
  report: ProfileAwareRouteGateCandidateDiagnosticReport,
): ProfileAwareFieldAtlasRouteGateOverlaySummary {
  return {
    overlayStatus: 'summary-only',
    candidateStatus: report.candidateStatus,
    totalRouteGateCandidateCount: report.totalCandidateCount,
    gateCandidateCount: report.gateCandidateCount,
    routeCandidateCount: report.routeCandidateCount,
    blockedRouteCandidateCount: report.blockedRouteCandidateCount,
    candidateRefs: [],
    summaryProbeRef: 'routeGate:summary',
  };
}

function buildSupportRegionOverlaySummary(
  report: ProfileAwareSupportRegionCandidateDiagnosticReport,
): ProfileAwareFieldAtlasSupportRegionOverlaySummary {
  return {
    overlayStatus: 'summary-only',
    candidateStatus: report.candidateStatus,
    totalSupportRegionCandidateCount: report.totalCandidateCount,
    supportClassCandidateCount: report.supportClassCandidateCount,
    regionCandidateCount: report.regionCandidateCount,
    constraintSiteCandidateCount: report.constraintSiteCandidateCount,
    routeFailureRegionCandidateCount: report.routeFailureRegionCandidateCount,
    candidateRefs: [],
    summaryProbeRef: 'supportRegion:summary',
  };
}

function buildProbeIndex(args: {
  sourceMarkers: ProfileAwareFieldAtlasSourceMarker[];
  surfaceSampleMarkers: ProfileAwareFieldAtlasSurfaceSampleMarker[];
  sampledAtlas: SampledClosedShapeSurfaceAtlas | undefined;
  featureOverlaySummary: ProfileAwareFieldAtlasFeatureOverlaySummary;
  routeGateOverlaySummary: ProfileAwareFieldAtlasRouteGateOverlaySummary;
  supportRegionOverlaySummary: ProfileAwareFieldAtlasSupportRegionOverlaySummary;
}): ProfileAwareFieldAtlasProbeIndex {
  const probes: Record<string, ProfileAwareFieldAtlasProbe> = {};
  const sampleById = new Map(
    args.sampledAtlas?.samples.map((sample) => [sample.id, sample]) ?? [],
  );

  for (const source of args.sourceMarkers) {
    probes[source.probeRef] = buildSourceProbe(source);
  }

  for (const sampleMarker of args.surfaceSampleMarkers) {
    const sample = sampleById.get(sampleMarker.sampleId);

    probes[sampleMarker.probeRef] = buildSurfaceSampleProbe(sampleMarker, sample);
  }

  probes[args.featureOverlaySummary.summaryProbeRef] = {
    probeKind: 'feature-summary',
    semanticStatus: 'not-semantic-naming',
    candidateStatus: args.featureOverlaySummary.observationStatus,
    totalCount: args.featureOverlaySummary.totalObservationCount,
  };
  probes[args.routeGateOverlaySummary.summaryProbeRef] = {
    probeKind: 'route-gate-summary',
    semanticStatus: 'not-semantic-naming',
    candidateStatus: args.routeGateOverlaySummary.candidateStatus,
    totalCount: args.routeGateOverlaySummary.totalRouteGateCandidateCount,
  };
  probes[args.supportRegionOverlaySummary.summaryProbeRef] = {
    probeKind: 'support-region-summary',
    semanticStatus: 'not-semantic-naming',
    candidateStatus: args.supportRegionOverlaySummary.candidateStatus,
    totalCount: args.supportRegionOverlaySummary.totalSupportRegionCandidateCount,
  };

  return {
    probeCount: Object.keys(probes).length,
    sourceProbeCount: args.sourceMarkers.length,
    sampleProbeCount: args.surfaceSampleMarkers.length,
    featureProbeCount: 1,
    routeGateProbeCount: 1,
    supportRegionProbeCount: 1,
    probes,
  };
}

function buildSourceProbe(
  source: ProfileAwareFieldAtlasSourceMarker,
): ProfileAwareFieldAtlasSourceProbe {
  const candidateCaveats = [
    ...(source.degeneracyStatuses ?? []).map(
      (status) => `degeneracy-status:${status}`,
    ),
  ];

  return {
    probeKind: 'source',
    sourceId: source.sourceId,
    vertexId: source.vertexId,
    sourceKind: source.sourceKind,
    position: copyVec3(source.position),
    emissionParameters: {
      amplitude: source.amplitude,
      waveNumber: source.waveNumber,
      phase: source.phase,
      attenuation: source.attenuation,
    },
    ...(source.profileId ? { profileId: source.profileId } : {}),
    ...(source.sourceEdgeId ? { sourceEdgeId: source.sourceEdgeId } : {}),
    ...(source.complementEdgeId
      ? { complementEdgeId: source.complementEdgeId }
      : {}),
    ...(source.antipodalChildVertexId
      ? { antipodalChildVertexId: source.antipodalChildVertexId }
      : {}),
    ...(source.degeneracyStatuses
      ? { degeneracyStatuses: [...source.degeneracyStatuses] }
      : {}),
    candidateCaveats,
    semanticStatus: 'not-semantic-naming',
  };
}

function buildSurfaceSampleProbe(
  marker: ProfileAwareFieldAtlasSurfaceSampleMarker,
  sample: SurfaceChartAtlasSample | undefined,
): ProfileAwareFieldAtlasSurfaceSampleProbe {
  return {
    probeKind: 'surface-sample',
    sampleId: marker.sampleId,
    position: copyVec3(marker.position),
    chartId: marker.chartId,
    ...(marker.sourceFaceId ? { sourceFaceId: marker.sourceFaceId } : {}),
    intensity: marker.intensity,
    phase: marker.phase,
    psi: sample
      ? {
          re: sample.psi.re,
          im: sample.psi.im,
        }
      : { re: 0, im: 0 },
    topContributions: buildTopContributions(sample),
    contributionRatioSum: marker.contributionRatioSum,
    ...(marker.dominantContributionSourceId
      ? { dominantContributionSourceId: marker.dominantContributionSourceId }
      : {}),
    ...(typeof marker.dominantContributionRatio === 'number'
      ? { dominantContributionRatio: marker.dominantContributionRatio }
      : {}),
    semanticStatus: 'not-semantic-naming',
  };
}

function buildTopContributions(
  sample: SurfaceChartAtlasSample | undefined,
): ProfileAwareFieldAtlasTopContributionView[] {
  if (!sample) {
    return [];
  }

  const magnitudeBySourceId = new Map(
    sample.contributionMagnitudes.map((magnitude) => [
      magnitude.sourceId,
      magnitude.value,
    ]),
  );

  return [...sample.contributionRatios]
    .sort(
      (first, second) =>
        second.value - first.value || first.sourceId.localeCompare(second.sourceId),
    )
    .slice(0, 4)
    .map((ratio) => ({
      sourceId: ratio.sourceId,
      vertexId: ratio.vertexId,
      value: ratio.value,
      ...(magnitudeBySourceId.has(ratio.sourceId)
        ? { magnitude: magnitudeBySourceId.get(ratio.sourceId) }
        : {}),
    }));
}

function appendLayerIssues(
  layers: Array<[layer: string, ok: boolean, issueCount: number]>,
  issues: ProfileAwareFieldAtlasViewModelIssue[],
): void {
  for (const [layer, ok, issueCount] of layers) {
    if (ok) {
      continue;
    }

    issues.push({
      code: 'layer-report-not-ok',
      message: `Profile-aware atlas view model layer ${layer} did not build cleanly.`,
      layer,
      details: {
        layerIssueCount: issueCount,
      },
    });
  }
}

function appendViewModelIssues(
  args: {
    adapterReport: ProfileAwareAtlasAdapterReport;
    sourceMarkers: ProfileAwareFieldAtlasSourceMarker[];
    surfaceSampleMarkers: ProfileAwareFieldAtlasSurfaceSampleMarker[];
    sampledAtlas: SampledClosedShapeSurfaceAtlas | undefined;
    probeIndex: ProfileAwareFieldAtlasProbeIndex;
    featureOverlaySummary: ProfileAwareFieldAtlasFeatureOverlaySummary;
    routeGateOverlaySummary: ProfileAwareFieldAtlasRouteGateOverlaySummary;
    supportRegionOverlaySummary: ProfileAwareFieldAtlasSupportRegionOverlaySummary;
    shapeWasMutated: boolean;
  },
  issues: ProfileAwareFieldAtlasViewModelIssue[],
): void {
  if (args.sourceMarkers.length !== args.adapterReport.atlasSources.length) {
    issues.push({
      code: 'source-marker-count-mismatch',
      message:
        'Profile-aware atlas view model source marker count does not match renderable atlas source count.',
      layer: 'sourceMarkers',
      details: {
        sourceMarkerCount: args.sourceMarkers.length,
        atlasSourceCount: args.adapterReport.atlasSources.length,
      },
    });
  }

  if (
    args.sampledAtlas &&
    args.surfaceSampleMarkers.length !== args.sampledAtlas.samples.length
  ) {
    issues.push({
      code: 'surface-sample-marker-count-mismatch',
      message:
        'Profile-aware atlas view model sample marker count does not match sampled atlas sample count.',
      layer: 'surfaceSampleMarkers',
      details: {
        surfaceSampleMarkerCount: args.surfaceSampleMarkers.length,
        sampledAtlasSampleCount: args.sampledAtlas.samples.length,
      },
    });
  }

  if (
    args.probeIndex.sourceProbeCount !== args.sourceMarkers.length ||
    args.probeIndex.sampleProbeCount !== args.surfaceSampleMarkers.length
  ) {
    issues.push({
      code: 'probe-index-count-mismatch',
      message:
        'Profile-aware atlas view model probe counts do not match marker counts.',
      layer: 'probeIndex',
      details: {
        sourceProbeCount: args.probeIndex.sourceProbeCount,
        sourceMarkerCount: args.sourceMarkers.length,
        sampleProbeCount: args.probeIndex.sampleProbeCount,
        surfaceSampleMarkerCount: args.surfaceSampleMarkers.length,
      },
    });
  }

  const featureTotal =
    args.featureOverlaySummary.cancellationLikeObservationCount +
    args.featureOverlaySummary.highIntensityAnchorObservationCount +
    args.featureOverlaySummary.ambiguousObservationCount;

  if (args.featureOverlaySummary.totalObservationCount !== featureTotal) {
    issues.push({
      code: 'feature-count-mismatch',
      message:
        'Profile-aware atlas view model feature overlay counts are not internally coherent.',
      layer: 'featureOverlaySummary',
      details: {
        totalObservationCount: args.featureOverlaySummary.totalObservationCount,
        derivedObservationCount: featureTotal,
      },
    });
  }

  const routeGateTotal =
    args.routeGateOverlaySummary.gateCandidateCount +
    args.routeGateOverlaySummary.routeCandidateCount +
    args.routeGateOverlaySummary.blockedRouteCandidateCount;

  if (
    args.routeGateOverlaySummary.totalRouteGateCandidateCount !== routeGateTotal
  ) {
    issues.push({
      code: 'route-gate-count-mismatch',
      message:
        'Profile-aware atlas view model route/gate overlay counts are not internally coherent.',
      layer: 'routeGateOverlaySummary',
      details: {
        totalRouteGateCandidateCount:
          args.routeGateOverlaySummary.totalRouteGateCandidateCount,
        derivedRouteGateCandidateCount: routeGateTotal,
      },
    });
  }

  const supportRegionTotal =
    args.supportRegionOverlaySummary.supportClassCandidateCount +
    args.supportRegionOverlaySummary.regionCandidateCount +
    args.supportRegionOverlaySummary.constraintSiteCandidateCount +
    args.supportRegionOverlaySummary.routeFailureRegionCandidateCount;

  if (
    args.supportRegionOverlaySummary.totalSupportRegionCandidateCount !==
    supportRegionTotal
  ) {
    issues.push({
      code: 'support-region-count-mismatch',
      message:
        'Profile-aware atlas view model support/region overlay counts are not internally coherent.',
      layer: 'supportRegionOverlaySummary',
      details: {
        totalSupportRegionCandidateCount:
          args.supportRegionOverlaySummary.totalSupportRegionCandidateCount,
        derivedSupportRegionCandidateCount: supportRegionTotal,
      },
    });
  }

  if (args.shapeWasMutated) {
    issues.push({
      code: 'unexpected-shape-mutation',
      message: 'Profile-aware atlas view model unexpectedly mutated the diagnostic Shape.',
      details: {
        shapeMutationDetected: true,
      },
    });
  }
}

function getDominantContribution(
  sample: SurfaceChartAtlasSample,
): SurfaceChartAtlasSample['contributionRatios'][number] | undefined {
  return sample.contributionRatios.reduce<
    SurfaceChartAtlasSample['contributionRatios'][number] | undefined
  >((dominant, ratio) => {
    if (!dominant || ratio.value > dominant.value) {
      return ratio;
    }

    return dominant;
  }, undefined);
}

function getNumberRange(values: number[]): { min: number; max: number } {
  const finiteValues = values.filter((value) => Number.isFinite(value));

  if (!finiteValues.length) {
    return { min: 0, max: 0 };
  }

  return finiteValues.reduce(
    (range, value) => ({
      min: Math.min(range.min, value),
      max: Math.max(range.max, value),
    }),
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
  );
}

function copyVec3(position: Vec3): Vec3 {
  return [position[0], position[1], position[2]];
}

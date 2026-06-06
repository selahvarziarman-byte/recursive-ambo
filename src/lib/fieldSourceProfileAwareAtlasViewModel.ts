import { createSeedShape } from '../data/seeds';
import type { Shape, Vec3 } from '../types/geometry';
import { applyAmboDissection } from './ambo';
import {
  buildTetrahedralAmboChildContexts,
  createTetrahedralVertexFixture,
} from './fieldSourceChildContexts';
import {
  buildTetrahedralChildSourceProfileDerivationReport,
  type FieldChildSourceProfileDerivation,
  type FieldChildSourceProfileDerivationReport,
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
  type ProfileAwareFeatureObservationView,
} from './fieldSourceProfileAwareFeatureReport';
import {
  buildProfileAwareFieldSourcePolicyDiagnosticReport,
  type ProfileAwareFieldSourcePolicyDiagnosticReport,
  type ProfileAwareSourceEntry,
} from './fieldSourceProfileAwarePolicy';
import {
  buildProfileAwareRouteGateCandidateDiagnosticReport,
  type ProfileAwareRouteGateCandidateView,
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
  type ProfileAwareSupportRegionCandidateView,
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
  | 'feature-marker-count-mismatch'
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

export interface ProfileAwareFieldAtlasChildSourceDerivationProbe {
  childVertexId: string;
  childRole: 'shared-90-pole';
  sourceEdgeId: string;
  sourceEdgeVertexIds: [string, string];
  complementEdgeId?: string;
  complementEdgeVertexIds?: [string, string];
  antipodalChildVertexId?: string;
  projectionVertexIds: string[];
  grammarId: string;
  mergeKind: string;
  ratio: {
    parentWeight: number;
    projectionWeight: number;
    childParent: number;
    childProjection: number;
    parentProjection: number;
  };
  quarkChannels: Array<{
    channelId: string;
    child90: string;
    parent60: string;
    projection30: string;
    parentProfileId: string;
    projectionProfileId: string;
    parentWeight: number;
    projectionWeight: number;
    channelParameters: {
      amplitude: number;
      waveNumber: number;
      phase: number;
      attenuation: number;
    };
  }>;
  derivedParameters?: {
    amplitude: number;
    waveNumber: number;
    phase: number;
    attenuation: number;
  };
  degeneracyStatuses: string[];
  fallbackKind?: string;
  fallbackReason?: string;
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

export interface ProfileAwareFieldAtlasFeatureMarker {
  featureId: string;
  renderKind: 'feature-observation-marker';
  observationKind: ProfileAwareFeatureObservationView['observationKind'];
  sampleId: string;
  chartId: string;
  sourceFaceId: string;
  position: Vec3;
  localChartPosition: [number, number];
  intensity: number;
  phase: number;
  relativeIntensity: number;
  effectiveSourceCount: number;
  topContributionRatio: number;
  status: ProfileAwareFeatureObservationView['status'];
  semanticStatus: ProfileAwareFeatureObservationView['semanticStatus'];
  sourcePolicyNames: string[];
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
  overlayStatus: 'feature-markers-available' | 'summary-only';
  observationStatus: ProfileAwareFeatureReportDiagnosticReport['observationStatus'];
  totalObservationCount: number;
  cancellationLikeObservationCount: number;
  highIntensityAnchorObservationCount: number;
  ambiguousObservationCount: number;
  featureMarkers: ProfileAwareFieldAtlasFeatureMarker[];
}

export interface ProfileAwareFieldAtlasRouteGateCandidateMarker {
  candidateId: string;
  renderKind: 'route-gate-candidate-anchor-marker';
  candidateKind: ProfileAwareRouteGateCandidateView['candidateKind'];
  candidateSubtype: ProfileAwareRouteGateCandidateView['candidateSubtype'];
  status: 'candidate-only';
  claimStatus: ProfileAwareRouteGateCandidateView['claimStatus'];
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  phaseContinuityStatus: 'not-global-phase-continuity';
  reliability: ProfileAwareRouteGateCandidateView['reliability'];
  sampleIds: string[];
  chartIds: string[];
  edgeIds: string[];
  seamEdgesInvolved: boolean;
  pathLength?: number;
  anchorSampleId?: string;
  position?: Vec3;
  intensitySummary: ProfileAwareRouteGateCandidateView['intensitySummary'];
  contributionMixtureSummary: ProfileAwareRouteGateCandidateView['contributionMixtureSummary'];
  evidenceProfile: ProfileAwareRouteGateCandidateView['evidenceProfile'];
  sourcePolicyNames: string[];
  reason: string;
  probeRef: string;
}

export interface ProfileAwareFieldAtlasRouteGateOverlaySummary {
  overlayStatus: 'route-gate-candidate-anchors-available' | 'summary-only';
  candidateStatus: ProfileAwareRouteGateCandidateDiagnosticReport['candidateStatus'];
  totalRouteGateCandidateCount: number;
  gateCandidateCount: number;
  routeCandidateCount: number;
  blockedRouteCandidateCount: number;
  candidateMarkers: ProfileAwareFieldAtlasRouteGateCandidateMarker[];
  candidateRefs: string[];
  summaryProbeRef: 'routeGate:summary';
}

export interface ProfileAwareFieldAtlasSupportRegionOverlaySummary {
  overlayStatus: 'support-region-candidate-anchors-available' | 'summary-only';
  candidateStatus: ProfileAwareSupportRegionCandidateDiagnosticReport['candidateStatus'];
  totalSupportRegionCandidateCount: number;
  supportClassCandidateCount: number;
  regionCandidateCount: number;
  constraintSiteCandidateCount: number;
  routeFailureRegionCandidateCount: number;
  candidateMarkers: ProfileAwareFieldAtlasSupportRegionCandidateMarker[];
  candidateRefs: string[];
  summaryProbeRef: 'supportRegion:summary';
}

export interface ProfileAwareFieldAtlasSupportRegionCandidateMarker {
  candidateId: string;
  renderKind: 'support-region-candidate-anchor-marker';
  candidateKind: ProfileAwareSupportRegionCandidateView['candidateKind'];
  supportKind: ProfileAwareSupportRegionCandidateView['supportKind'];
  status: 'candidate-only';
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  phaseContinuityStatus: 'not-global-phase-continuity';
  reliability: ProfileAwareSupportRegionCandidateView['reliability'];
  sampleIds: string[];
  chartIds: string[];
  edgeIds: string[];
  observationIds: string[];
  routeGateCandidateIds: string[];
  seamEdgesInvolved: boolean;
  computationalOnlyInvolved: boolean;
  anchorSampleId?: string;
  position?: Vec3;
  evidenceSummary: ProfileAwareSupportRegionCandidateView['evidenceSummary'];
  sourcePolicyNames: string[];
  reason: string;
  probeRef: string;
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
  childDerivation?: ProfileAwareFieldAtlasChildSourceDerivationProbe;
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

export interface ProfileAwareFieldAtlasFeatureProbe {
  probeKind: 'feature-observation';
  featureId: string;
  observationKind: ProfileAwareFeatureObservationView['observationKind'];
  sampleId: string;
  chartId: string;
  sourceFaceId: string;
  position: Vec3;
  localChartPosition: [number, number];
  intensity: number;
  phase: number;
  relativeIntensity: number;
  effectiveSourceCount: number;
  topContributionRatio: number;
  status: ProfileAwareFeatureObservationView['status'];
  semanticStatus: 'not-semantic-naming';
  sourcePolicyNames: string[];
  reason: string;
  linkedSampleProbeRef: string;
}

export interface ProfileAwareFieldAtlasRouteGateProbe {
  probeKind: 'route-gate-candidate';
  candidateId: string;
  candidateKind: ProfileAwareFieldAtlasRouteGateCandidateMarker['candidateKind'];
  candidateSubtype: ProfileAwareFieldAtlasRouteGateCandidateMarker['candidateSubtype'];
  status: 'candidate-only';
  claimStatus: ProfileAwareFieldAtlasRouteGateCandidateMarker['claimStatus'];
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  phaseContinuityStatus: 'not-global-phase-continuity';
  reliability: ProfileAwareFieldAtlasRouteGateCandidateMarker['reliability'];
  sampleIds: string[];
  chartIds: string[];
  edgeIds: string[];
  seamEdgesInvolved: boolean;
  pathLength?: number;
  anchorSampleId?: string;
  position?: Vec3;
  intensitySummary: ProfileAwareFieldAtlasRouteGateCandidateMarker['intensitySummary'];
  contributionMixtureSummary: ProfileAwareFieldAtlasRouteGateCandidateMarker['contributionMixtureSummary'];
  evidenceProfile: ProfileAwareFieldAtlasRouteGateCandidateMarker['evidenceProfile'];
  sourcePolicyNames: string[];
  reason: string;
}

export interface ProfileAwareFieldAtlasSupportRegionProbe {
  probeKind: 'support-region-candidate';
  candidateId: string;
  candidateKind: ProfileAwareFieldAtlasSupportRegionCandidateMarker['candidateKind'];
  supportKind: ProfileAwareFieldAtlasSupportRegionCandidateMarker['supportKind'];
  status: 'candidate-only';
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  phaseContinuityStatus: 'not-global-phase-continuity';
  reliability: ProfileAwareFieldAtlasSupportRegionCandidateMarker['reliability'];
  sampleIds: string[];
  chartIds: string[];
  edgeIds: string[];
  observationIds: string[];
  routeGateCandidateIds: string[];
  seamEdgesInvolved: boolean;
  computationalOnlyInvolved: boolean;
  anchorSampleId?: string;
  position?: Vec3;
  evidenceSummary: ProfileAwareFieldAtlasSupportRegionCandidateMarker['evidenceSummary'];
  sourcePolicyNames: string[];
  reason: string;
}

export interface ProfileAwareFieldAtlasSummaryProbe {
  probeKind: 'route-gate-summary' | 'support-region-summary';
  semanticStatus: 'not-semantic-naming';
  candidateStatus: 'candidate-only';
  totalCount: number;
}

export type ProfileAwareFieldAtlasProbe =
  | ProfileAwareFieldAtlasSourceProbe
  | ProfileAwareFieldAtlasSurfaceSampleProbe
  | ProfileAwareFieldAtlasFeatureProbe
  | ProfileAwareFieldAtlasRouteGateProbe
  | ProfileAwareFieldAtlasSupportRegionProbe
  | ProfileAwareFieldAtlasSummaryProbe;

export interface ProfileAwareFieldAtlasProbeIndex {
  probeCount: number;
  sourceProbeCount: number;
  sampleProbeCount: number;
  featureProbeCount: number;
  routeGateProbeCount: number;
  routeGateCandidateProbeCount: number;
  routeGateSummaryProbeCount: number;
  supportRegionProbeCount: number;
  supportRegionCandidateProbeCount: number;
  supportRegionSummaryProbeCount: number;
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
  candidateOverlayStatus:
    | 'feature-markers-route-support-summary-only'
    | 'feature-and-route-gate-markers-support-summary-only'
    | 'feature-route-gate-and-support-region-candidate-markers';
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

export type ProfileAwareFieldAtlasViewModelRuntimeIssueCode =
  | 'unsupported-shape-context'
  | 'runtime-view-model-build-failed'
  | 'unexpected-shape-mutation'
  | 'runtime-view-model-input-shape-mismatch'
  | 'runtime-view-model-policy-mismatch'
  | 'runtime-view-model-boundary-mismatch';

export interface ProfileAwareFieldAtlasViewModelRuntimeIssue {
  code: ProfileAwareFieldAtlasViewModelRuntimeIssueCode;
  message: string;
  details?: Record<string, boolean | number | string | null>;
}

interface ProfileAwareFieldAtlasViewModelRuntimeBaseReport {
  reportId: string;
  method: 'profile-aware-field-atlas-view-model-runtime-boundary-v0';
  diagnosticScope: 'profile-aware-current-shape-field-mode-boundary-only';
  runtimeBoundaryStatus: 'supported' | 'unsupported';
  sourcePolicyId: 'profile-aware-quark-child-inheritance-v0';
  policyRelativityStatus: 'policy-relative';
  contrastPolicyNote: 'old-policy-not-assumed-invariant';
  integrationStatus: 'runtime-boundary-diagnostic-only';
  runtimeIntegrationStatus: 'not-runtime-integrated';
  uiExposureStatus: 'not-ui-exposed';
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  phaseContinuityStatus: 'not-global-phase-continuity';
  shapeMutationStatus: 'not-shape-mutation';
  packetWriteStatus: 'not-packet-writing';
  fieldAtlasSourcePolicyMutationStatus: 'not-mutated';
  fieldAtlasMutationStatus: 'not-mutated';
  inputShapeId: string;
  inputShapeSeedKey?: string;
  inputShapeOperation: string;
  inputShapeGenerationDepth: number;
  issueCount: number;
  ok: boolean;
  issues: ProfileAwareFieldAtlasViewModelRuntimeIssue[];
}

export interface ProfileAwareFieldAtlasViewModelRuntimeSupportedReport
  extends ProfileAwareFieldAtlasViewModelRuntimeBaseReport {
  runtimeBoundaryStatus: 'supported';
  viewModel: ProfileAwareFieldAtlasViewModelReport;
  ok: boolean;
}

export interface ProfileAwareFieldAtlasViewModelRuntimeUnsupportedReport
  extends ProfileAwareFieldAtlasViewModelRuntimeBaseReport {
  runtimeBoundaryStatus: 'unsupported';
  unsupportedReason: string;
  unsupportedIssueCode: ProfileAwareFieldAtlasViewModelRuntimeIssueCode;
  viewModel: null;
  ok: false;
}

export type ProfileAwareFieldAtlasViewModelRuntimeReport =
  | ProfileAwareFieldAtlasViewModelRuntimeSupportedReport
  | ProfileAwareFieldAtlasViewModelRuntimeUnsupportedReport;

interface BuiltProfileAwareSourceChain {
  profileAwarePolicyReport: ProfileAwareFieldSourcePolicyDiagnosticReport;
  adapterReport: ProfileAwareAtlasAdapterReport;
  childDerivationReports: FieldChildSourceProfileDerivationReport[];
}

interface BuildProfileAwareFieldAtlasViewModelReportForShapeArgs {
  shape: Shape;
  reportIdSuffix: string;
  resolverReport?: ProfileAwareShapePositionResolverReport;
}

const METHOD = 'profile-aware-field-atlas-view-model-diagnostic-v0';
const DIAGNOSTIC_SCOPE = 'profile-aware-field-atlas-view-model-only';
const RUNTIME_METHOD = 'profile-aware-field-atlas-view-model-runtime-boundary-v0';
const RUNTIME_DIAGNOSTIC_SCOPE =
  'profile-aware-current-shape-field-mode-boundary-only';
const SOURCE_POLICY_ID = 'profile-aware-quark-child-inheritance-v0';
const CONTRAST_POLICY_NOTE = 'old-policy-not-assumed-invariant';
const ACTIVE_TETRAHEDRON_PRIMAL_VERTICES = ['A', 'B', 'C', 'D'];
const RUNTIME_UNSUPPORTED_REASON =
  'Profile-aware runtime view model currently supports only a tetrahedron seed-derived Shape after at least one Ambo dissection with resolvable A, B, C, D, and M_AB through M_CD positions.';

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
  const shape = applyAmboDissection(createSeedShape('tetrahedron'));

  return buildProfileAwareFieldAtlasViewModelReportForShape({
    shape,
    reportIdSuffix: 'tetrahedron-one-ambo',
  });
}

function buildProfileAwareFieldAtlasViewModelReportForShape(
  args: BuildProfileAwareFieldAtlasViewModelReportForShapeArgs,
): ProfileAwareFieldAtlasViewModelReport {
  const issues: ProfileAwareFieldAtlasViewModelIssue[] = [];
  const shape = args.shape;
  const beforeShapeJson = JSON.stringify(shape);
  const { profileAwarePolicyReport, adapterReport, childDerivationReports } =
    buildProfileAwareSourceChain();
  const resolverReport =
    args.resolverReport ?? buildProfileAwareShapePositionResolverReport(shape);
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
    reportIdSuffix: args.reportIdSuffix,
  });
  const featureReport = buildProfileAwareFeatureReportDiagnosticReport({
    surfaceAtlasResult,
    reportIdSuffix: args.reportIdSuffix,
  });
  const routeGateReport = buildProfileAwareRouteGateCandidateDiagnosticReport({
    surfaceAtlasResult,
    routeGateOptions: ROUTE_GATE_OPTIONS,
    reportIdSuffix: args.reportIdSuffix,
  });
  const supportRegionReport =
    buildProfileAwareSupportRegionCandidateDiagnosticReport({
      surfaceAtlasResult,
      supportRegionOptions: SUPPORT_REGION_OPTIONS,
      reportIdSuffix: args.reportIdSuffix,
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
  const routeGateOverlaySummary = buildRouteGateOverlaySummary({
    report: routeGateReport,
    surfaceSampleMarkers,
  });
  const supportRegionOverlaySummary = buildSupportRegionOverlaySummary({
    report: supportRegionReport,
    surfaceSampleMarkers,
  });
  const childDerivationByChildVertexId = buildChildDerivationProbeByChildVertexId({
    childDerivationReports,
    policyReport: profileAwarePolicyReport,
  });
  const probeIndex = buildProbeIndex({
    sourceMarkers,
    surfaceSampleMarkers,
    sampledAtlas,
    featureOverlaySummary,
    featureObservations: featureReport.observations,
    childDerivationByChildVertexId,
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
    reportId: `${METHOD}:${args.reportIdSuffix}`,
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
    candidateOverlayStatus: buildCandidateOverlayStatus({
      routeGateOverlaySummary,
      supportRegionOverlaySummary,
    }),
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

export function buildProfileAwareFieldAtlasViewModelRuntimeReport(
  shape: Shape,
): ProfileAwareFieldAtlasViewModelRuntimeReport {
  const beforeShapeJson = JSON.stringify(shape);
  const resolverReport = buildProfileAwareShapePositionResolverReport(shape);

  if (!resolverReport.ok || resolverReport.shapeContextStatus !== 'supported') {
    const issues: ProfileAwareFieldAtlasViewModelRuntimeIssue[] = [
      {
        code: 'unsupported-shape-context',
        message: RUNTIME_UNSUPPORTED_REASON,
        details: {
          resolverIssueCount: resolverReport.issueCount,
          resolverShapeContextStatus: resolverReport.shapeContextStatus,
        },
      },
    ];

    appendRuntimeShapeMutationIssue(shape, beforeShapeJson, issues);

    return buildUnsupportedRuntimeReport({
      shape,
      unsupportedIssueCode: 'unsupported-shape-context',
      unsupportedReason: RUNTIME_UNSUPPORTED_REASON,
      issues,
    });
  }

  let viewModel: ProfileAwareFieldAtlasViewModelReport;

  try {
    viewModel = buildProfileAwareFieldAtlasViewModelReportForShape({
      shape,
      resolverReport,
      reportIdSuffix: `runtime:${shape.id}`,
    });
  } catch (error) {
    const issues: ProfileAwareFieldAtlasViewModelRuntimeIssue[] = [
      {
        code: 'runtime-view-model-build-failed',
        message:
          'Profile-aware runtime view model failed to build from the caller-supplied Shape.',
        details: {
          reason: error instanceof Error ? error.message : String(error),
        },
      },
    ];

    appendRuntimeShapeMutationIssue(shape, beforeShapeJson, issues);

    return buildUnsupportedRuntimeReport({
      shape,
      unsupportedIssueCode: 'runtime-view-model-build-failed',
      unsupportedReason:
        'Profile-aware runtime view model build failed for the caller-supplied Shape.',
      issues,
    });
  }

  const issues: ProfileAwareFieldAtlasViewModelRuntimeIssue[] = [];

  appendRuntimeShapeMutationIssue(shape, beforeShapeJson, issues);

  if (viewModel.shapeId !== shape.id) {
    issues.push({
      code: 'runtime-view-model-input-shape-mismatch',
      message:
        'Profile-aware runtime view model did not preserve the caller-supplied Shape id.',
      details: {
        inputShapeId: shape.id,
        viewModelShapeId: viewModel.shapeId,
      },
    });
  }

  if (viewModel.sourcePolicyId !== SOURCE_POLICY_ID) {
    issues.push({
      code: 'runtime-view-model-policy-mismatch',
      message:
        'Profile-aware runtime view model did not preserve the active source policy.',
      details: {
        expectedSourcePolicyId: SOURCE_POLICY_ID,
        actualSourcePolicyId: viewModel.sourcePolicyId,
      },
    });
  }

  appendRuntimeBoundaryIssues(viewModel, issues);

  const issueCount = issues.length;

  return {
    ...buildRuntimeBaseFields(shape),
    reportId: `${RUNTIME_METHOD}:supported:${shape.id}`,
    runtimeBoundaryStatus: 'supported',
    viewModel,
    issueCount,
    ok: viewModel.ok && issueCount === 0,
    issues,
  };
}

function buildUnsupportedRuntimeReport(args: {
  shape: Shape;
  unsupportedIssueCode: ProfileAwareFieldAtlasViewModelRuntimeIssueCode;
  unsupportedReason: string;
  issues: ProfileAwareFieldAtlasViewModelRuntimeIssue[];
}): ProfileAwareFieldAtlasViewModelRuntimeUnsupportedReport {
  return {
    ...buildRuntimeBaseFields(args.shape),
    reportId: `${RUNTIME_METHOD}:unsupported:${args.shape.id}`,
    runtimeBoundaryStatus: 'unsupported',
    unsupportedReason: args.unsupportedReason,
    unsupportedIssueCode: args.unsupportedIssueCode,
    viewModel: null,
    issueCount: args.issues.length,
    ok: false,
    issues: args.issues,
  };
}

function buildRuntimeBaseFields(
  shape: Shape,
): Omit<
  ProfileAwareFieldAtlasViewModelRuntimeBaseReport,
  'reportId' | 'runtimeBoundaryStatus' | 'issueCount' | 'ok' | 'issues'
> {
  return {
    method: RUNTIME_METHOD,
    diagnosticScope: RUNTIME_DIAGNOSTIC_SCOPE,
    sourcePolicyId: SOURCE_POLICY_ID,
    policyRelativityStatus: 'policy-relative',
    contrastPolicyNote: CONTRAST_POLICY_NOTE,
    integrationStatus: 'runtime-boundary-diagnostic-only',
    runtimeIntegrationStatus: 'not-runtime-integrated',
    uiExposureStatus: 'not-ui-exposed',
    semanticStatus: 'not-semantic-naming',
    topologyStatus: 'not-topology-workspace',
    phaseContinuityStatus: 'not-global-phase-continuity',
    shapeMutationStatus: 'not-shape-mutation',
    packetWriteStatus: 'not-packet-writing',
    fieldAtlasSourcePolicyMutationStatus: 'not-mutated',
    fieldAtlasMutationStatus: 'not-mutated',
    inputShapeId: shape.id,
    ...(shape.seedKey ? { inputShapeSeedKey: shape.seedKey } : {}),
    inputShapeOperation: shape.genealogy.operation,
    inputShapeGenerationDepth: shape.genealogy.generationDepth,
  };
}

function appendRuntimeShapeMutationIssue(
  shape: Shape,
  beforeShapeJson: string,
  issues: ProfileAwareFieldAtlasViewModelRuntimeIssue[],
): void {
  if (JSON.stringify(shape) === beforeShapeJson) {
    return;
  }

  issues.push({
    code: 'unexpected-shape-mutation',
    message:
      'Profile-aware runtime view model boundary unexpectedly mutated the caller-supplied Shape.',
    details: {
      shapeMutationDetected: true,
    },
  });
}

function appendRuntimeBoundaryIssues(
  viewModel: ProfileAwareFieldAtlasViewModelReport,
  issues: ProfileAwareFieldAtlasViewModelRuntimeIssue[],
): void {
  const mismatches = [
    viewModel.policyRelativityStatus !== 'policy-relative',
    viewModel.contrastPolicyNote !== CONTRAST_POLICY_NOTE,
    viewModel.runtimeIntegrationStatus !== 'not-runtime-integrated',
    viewModel.uiExposureStatus !== 'not-ui-exposed',
    viewModel.semanticStatus !== 'not-semantic-naming',
    viewModel.topologyStatus !== 'not-topology-workspace',
    viewModel.phaseContinuityStatus !== 'not-global-phase-continuity',
    viewModel.shapeMutationStatus !== 'not-shape-mutation',
    viewModel.packetWriteStatus !== 'not-packet-writing',
    viewModel.fieldAtlasSourcePolicyMutationStatus !== 'not-mutated',
    viewModel.fieldAtlasMutationStatus !== 'not-mutated',
  ];

  if (!mismatches.some(Boolean)) {
    return;
  }

  issues.push({
    code: 'runtime-view-model-boundary-mismatch',
    message:
      'Profile-aware runtime view model did not preserve one or more boundary caveat flags.',
    details: {
      policyRelativityStatus: viewModel.policyRelativityStatus,
      contrastPolicyNote: viewModel.contrastPolicyNote,
      runtimeIntegrationStatus: viewModel.runtimeIntegrationStatus,
      uiExposureStatus: viewModel.uiExposureStatus,
      semanticStatus: viewModel.semanticStatus,
      topologyStatus: viewModel.topologyStatus,
      phaseContinuityStatus: viewModel.phaseContinuityStatus,
      shapeMutationStatus: viewModel.shapeMutationStatus,
      packetWriteStatus: viewModel.packetWriteStatus,
      fieldAtlasSourcePolicyMutationStatus:
        viewModel.fieldAtlasSourcePolicyMutationStatus,
      fieldAtlasMutationStatus: viewModel.fieldAtlasMutationStatus,
    },
  });
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
    childDerivationReports,
  };
}

function buildChildDerivationProbeByChildVertexId(args: {
  childDerivationReports: FieldChildSourceProfileDerivationReport[];
  policyReport: ProfileAwareFieldSourcePolicyDiagnosticReport;
}): Map<string, ProfileAwareFieldAtlasChildSourceDerivationProbe> {
  const policySourceByVertexId = new Map(
    args.policyReport.sources.map((source) => [source.vertexId, source]),
  );
  const childDerivationByChildVertexId =
    new Map<string, ProfileAwareFieldAtlasChildSourceDerivationProbe>();

  for (const report of args.childDerivationReports) {
    if (!report.derivation) {
      continue;
    }

    const policySource = policySourceByVertexId.get(report.childVertexId);

    childDerivationByChildVertexId.set(
      report.childVertexId,
      buildChildDerivationProbe(
        report.derivation,
        policySource?.degeneracyStatuses ?? [],
      ),
    );
  }

  return childDerivationByChildVertexId;
}

function buildChildDerivationProbe(
  derivation: FieldChildSourceProfileDerivation,
  degeneracyStatuses: readonly string[],
): ProfileAwareFieldAtlasChildSourceDerivationProbe {
  return {
    childVertexId: derivation.childVertexId,
    childRole: derivation.childRole,
    sourceEdgeId: derivation.sourceEdgeId,
    sourceEdgeVertexIds: copyPair(derivation.sourceEdgeVertexIds),
    complementEdgeId: derivation.complementEdgeId,
    complementEdgeVertexIds: copyPair(derivation.complementEdgeVertexIds),
    antipodalChildVertexId: derivation.antipodalChildVertexId,
    projectionVertexIds: [...derivation.projectionVertexIds],
    grammarId: derivation.grammarId,
    mergeKind: derivation.mergeKind,
    ratio: {
      parentWeight: derivation.ratio.parentWeight,
      projectionWeight: derivation.ratio.projectionWeight,
      childParent: derivation.ratio.childParent,
      childProjection: derivation.ratio.childProjection,
      parentProjection: derivation.ratio.parentProjection,
    },
    quarkChannels: derivation.quarkChannels.map((channel) => ({
      channelId: channel.channelId,
      child90: channel.child90,
      parent60: channel.parent60,
      projection30: channel.projection30,
      parentProfileId: channel.parentProfileId,
      projectionProfileId: channel.projectionProfileId,
      parentWeight: channel.parentWeight,
      projectionWeight: channel.projectionWeight,
      channelParameters: {
        amplitude: channel.channelParameters.amplitude,
        waveNumber: channel.channelParameters.waveNumber,
        phase: channel.channelParameters.phase,
        attenuation: channel.channelParameters.attenuation,
      },
    })),
    ...(derivation.derivedParameters
      ? {
          derivedParameters: {
            amplitude: derivation.derivedParameters.amplitude,
            waveNumber: derivation.derivedParameters.waveNumber,
            phase: derivation.derivedParameters.phase,
            attenuation: derivation.derivedParameters.attenuation,
          },
        }
      : {}),
    degeneracyStatuses: [...degeneracyStatuses],
    ...(derivation.fallback
      ? {
          fallbackKind: derivation.fallback.fallbackKind,
          fallbackReason: derivation.fallback.reason,
        }
      : {}),
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
  const featureMarkers = report.observations.map(buildFeatureMarker);

  return {
    overlayStatus:
      featureMarkers.length > 0 ? 'feature-markers-available' : 'summary-only',
    observationStatus: report.observationStatus,
    totalObservationCount: report.totalObservationCount,
    cancellationLikeObservationCount: report.cancellationLikeObservationCount,
    highIntensityAnchorObservationCount:
      report.highIntensityAnchorObservationCount,
    ambiguousObservationCount: report.ambiguousObservationCount,
    featureMarkers,
  };
}

function buildFeatureMarker(
  observation: ProfileAwareFeatureObservationView,
): ProfileAwareFieldAtlasFeatureMarker {
  return {
    featureId: observation.observationId,
    renderKind: 'feature-observation-marker',
    observationKind: observation.observationKind,
    sampleId: observation.sampleId,
    chartId: observation.chartId,
    sourceFaceId: observation.sourceFaceId,
    position: copyVec3(observation.position),
    localChartPosition: [
      observation.localChartPosition[0],
      observation.localChartPosition[1],
    ],
    intensity: observation.intensity,
    phase: observation.phase,
    relativeIntensity: observation.relativeIntensity,
    effectiveSourceCount: observation.effectiveSourceCount,
    topContributionRatio: observation.topContributionRatio,
    status: observation.status,
    semanticStatus: observation.semanticStatus,
    sourcePolicyNames: [...observation.sourcePolicyNames],
    probeRef: `feature:${observation.observationId}`,
  };
}

function buildRouteGateOverlaySummary(args: {
  report: ProfileAwareRouteGateCandidateDiagnosticReport,
  surfaceSampleMarkers: ProfileAwareFieldAtlasSurfaceSampleMarker[];
}): ProfileAwareFieldAtlasRouteGateOverlaySummary {
  const sampleMarkerById = new Map(
    args.surfaceSampleMarkers.map((marker) => [marker.sampleId, marker]),
  );
  const candidateMarkers = args.report.candidateViews.map((candidate) =>
    buildRouteGateCandidateMarker(candidate, sampleMarkerById),
  );

  return {
    overlayStatus:
      candidateMarkers.length > 0
        ? 'route-gate-candidate-anchors-available'
        : 'summary-only',
    candidateStatus: args.report.candidateStatus,
    totalRouteGateCandidateCount: args.report.totalCandidateCount,
    gateCandidateCount: args.report.gateCandidateCount,
    routeCandidateCount: args.report.routeCandidateCount,
    blockedRouteCandidateCount: args.report.blockedRouteCandidateCount,
    candidateMarkers,
    candidateRefs: candidateMarkers.map((marker) => marker.probeRef),
    summaryProbeRef: 'routeGate:summary',
  };
}

function buildRouteGateCandidateMarker(
  candidate: ProfileAwareRouteGateCandidateView,
  sampleMarkerById: Map<string, ProfileAwareFieldAtlasSurfaceSampleMarker>,
): ProfileAwareFieldAtlasRouteGateCandidateMarker {
  const resolvedSampleMarkers = candidate.sampleIds
    .map((sampleId) => sampleMarkerById.get(sampleId))
    .filter(
      (
        marker,
      ): marker is ProfileAwareFieldAtlasSurfaceSampleMarker => Boolean(marker),
    );
  const anchorSampleId = resolvedSampleMarkers[0]?.sampleId;
  const position = buildCentroid(
    resolvedSampleMarkers.map((marker) => marker.position),
  );

  return {
    candidateId: candidate.candidateId,
    renderKind: 'route-gate-candidate-anchor-marker',
    candidateKind: candidate.candidateKind,
    candidateSubtype: candidate.candidateSubtype,
    status: 'candidate-only',
    claimStatus: candidate.claimStatus,
    semanticStatus: 'not-semantic-naming',
    topologyStatus: 'not-topology-workspace',
    phaseContinuityStatus: 'not-global-phase-continuity',
    reliability: candidate.reliability,
    sampleIds: [...candidate.sampleIds],
    chartIds: [...candidate.chartIds],
    edgeIds: [...candidate.edgeIds],
    seamEdgesInvolved: candidate.seamEdgesInvolved,
    ...(typeof candidate.pathLength === 'number'
      ? { pathLength: candidate.pathLength }
      : {}),
    ...(anchorSampleId ? { anchorSampleId } : {}),
    ...(position ? { position } : {}),
    intensitySummary: {
      min: candidate.intensitySummary.min,
      max: candidate.intensitySummary.max,
      average: candidate.intensitySummary.average,
    },
    contributionMixtureSummary: {
      averageEffectiveSourceCount:
        candidate.contributionMixtureSummary.averageEffectiveSourceCount,
      maxTopContributionRatio:
        candidate.contributionMixtureSummary.maxTopContributionRatio,
      mixedSampleCount: candidate.contributionMixtureSummary.mixedSampleCount,
    },
    evidenceProfile: copyRouteGateEvidenceProfile(candidate.evidenceProfile),
    sourcePolicyNames: [...candidate.sourcePolicyNames],
    reason: candidate.reason,
    probeRef: `routeGate:candidate:${candidate.candidateId}`,
  };
}

function buildSupportRegionOverlaySummary(args: {
  report: ProfileAwareSupportRegionCandidateDiagnosticReport,
  surfaceSampleMarkers: ProfileAwareFieldAtlasSurfaceSampleMarker[];
}): ProfileAwareFieldAtlasSupportRegionOverlaySummary {
  const sampleMarkerById = new Map(
    args.surfaceSampleMarkers.map((marker) => [marker.sampleId, marker]),
  );
  const candidateMarkers = args.report.candidateViews.map((candidate) =>
    buildSupportRegionCandidateMarker(candidate, sampleMarkerById),
  );

  return {
    overlayStatus:
      candidateMarkers.length > 0
        ? 'support-region-candidate-anchors-available'
        : 'summary-only',
    candidateStatus: args.report.candidateStatus,
    totalSupportRegionCandidateCount: args.report.totalCandidateCount,
    supportClassCandidateCount: args.report.supportClassCandidateCount,
    regionCandidateCount: args.report.regionCandidateCount,
    constraintSiteCandidateCount: args.report.constraintSiteCandidateCount,
    routeFailureRegionCandidateCount:
      args.report.routeFailureRegionCandidateCount,
    candidateMarkers,
    candidateRefs: candidateMarkers.map((marker) => marker.probeRef),
    summaryProbeRef: 'supportRegion:summary',
  };
}

function buildSupportRegionCandidateMarker(
  candidate: ProfileAwareSupportRegionCandidateView,
  sampleMarkerById: Map<string, ProfileAwareFieldAtlasSurfaceSampleMarker>,
): ProfileAwareFieldAtlasSupportRegionCandidateMarker {
  const resolvedSampleMarkers = candidate.sampleIds
    .map((sampleId) => sampleMarkerById.get(sampleId))
    .filter(
      (
        marker,
      ): marker is ProfileAwareFieldAtlasSurfaceSampleMarker => Boolean(marker),
    );
  const anchorSampleId = resolvedSampleMarkers[0]?.sampleId;
  const position = buildCentroid(
    resolvedSampleMarkers.map((marker) => marker.position),
  );

  return {
    candidateId: candidate.candidateId,
    renderKind: 'support-region-candidate-anchor-marker',
    candidateKind: candidate.candidateKind,
    supportKind: candidate.supportKind,
    status: 'candidate-only',
    semanticStatus: 'not-semantic-naming',
    topologyStatus: 'not-topology-workspace',
    phaseContinuityStatus: 'not-global-phase-continuity',
    reliability: candidate.reliability,
    sampleIds: [...candidate.sampleIds],
    chartIds: [...candidate.chartIds],
    edgeIds: [...candidate.edgeIds],
    observationIds: [...candidate.observationIds],
    routeGateCandidateIds: [...candidate.routeGateCandidateIds],
    seamEdgesInvolved: candidate.seamEdgesInvolved,
    computationalOnlyInvolved: candidate.computationalOnlyInvolved,
    ...(anchorSampleId ? { anchorSampleId } : {}),
    ...(position ? { position } : {}),
    evidenceSummary: copySupportRegionEvidenceSummary(candidate.evidenceSummary),
    sourcePolicyNames: [...candidate.sourcePolicyNames],
    reason: candidate.reason,
    probeRef: `supportRegion:candidate:${candidate.candidateId}`,
  };
}

function buildCandidateOverlayStatus(args: {
  routeGateOverlaySummary: ProfileAwareFieldAtlasRouteGateOverlaySummary;
  supportRegionOverlaySummary: ProfileAwareFieldAtlasSupportRegionOverlaySummary;
}): ProfileAwareFieldAtlasViewModelReport['candidateOverlayStatus'] {
  if (args.supportRegionOverlaySummary.candidateMarkers.length > 0) {
    return 'feature-route-gate-and-support-region-candidate-markers';
  }

  if (args.routeGateOverlaySummary.candidateMarkers.length > 0) {
    return 'feature-and-route-gate-markers-support-summary-only';
  }

  return 'feature-markers-route-support-summary-only';
}

function buildProbeIndex(args: {
  sourceMarkers: ProfileAwareFieldAtlasSourceMarker[];
  surfaceSampleMarkers: ProfileAwareFieldAtlasSurfaceSampleMarker[];
  sampledAtlas: SampledClosedShapeSurfaceAtlas | undefined;
  featureOverlaySummary: ProfileAwareFieldAtlasFeatureOverlaySummary;
  featureObservations: ProfileAwareFeatureObservationView[];
  childDerivationByChildVertexId: Map<
    string,
    ProfileAwareFieldAtlasChildSourceDerivationProbe
  >;
  routeGateOverlaySummary: ProfileAwareFieldAtlasRouteGateOverlaySummary;
  supportRegionOverlaySummary: ProfileAwareFieldAtlasSupportRegionOverlaySummary;
}): ProfileAwareFieldAtlasProbeIndex {
  const probes: Record<string, ProfileAwareFieldAtlasProbe> = {};
  const sampleById = new Map(
    args.sampledAtlas?.samples.map((sample) => [sample.id, sample]) ?? [],
  );
  const observationById = new Map(
    args.featureObservations.map((observation) => [
      observation.observationId,
      observation,
    ]),
  );

  for (const source of args.sourceMarkers) {
    probes[source.probeRef] = buildSourceProbe(
      source,
      args.childDerivationByChildVertexId,
    );
  }

  for (const sampleMarker of args.surfaceSampleMarkers) {
    const sample = sampleById.get(sampleMarker.sampleId);

    probes[sampleMarker.probeRef] = buildSurfaceSampleProbe(sampleMarker, sample);
  }

  for (const featureMarker of args.featureOverlaySummary.featureMarkers) {
    const observation = observationById.get(featureMarker.featureId);

    probes[featureMarker.probeRef] = buildFeatureProbe(
      featureMarker,
      observation,
    );
  }

  for (const marker of args.routeGateOverlaySummary.candidateMarkers) {
    probes[marker.probeRef] = buildRouteGateProbe(marker);
  }

  for (const marker of args.supportRegionOverlaySummary.candidateMarkers) {
    probes[marker.probeRef] = buildSupportRegionProbe(marker);
  }

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
    featureProbeCount: args.featureOverlaySummary.featureMarkers.length,
    routeGateProbeCount:
      args.routeGateOverlaySummary.candidateMarkers.length + 1,
    routeGateCandidateProbeCount:
      args.routeGateOverlaySummary.candidateMarkers.length,
    routeGateSummaryProbeCount: 1,
    supportRegionProbeCount:
      args.supportRegionOverlaySummary.candidateMarkers.length + 1,
    supportRegionCandidateProbeCount:
      args.supportRegionOverlaySummary.candidateMarkers.length,
    supportRegionSummaryProbeCount: 1,
    probes,
  };
}

function buildSourceProbe(
  source: ProfileAwareFieldAtlasSourceMarker,
  childDerivationByChildVertexId: Map<
    string,
    ProfileAwareFieldAtlasChildSourceDerivationProbe
  >,
): ProfileAwareFieldAtlasSourceProbe {
  const childDerivation = source.isGeneratedChildSource
    ? childDerivationByChildVertexId.get(source.vertexId)
    : undefined;
  const candidateCaveats = [
    ...(source.degeneracyStatuses ?? []).map(
      (status) => `degeneracy-status:${status}`,
    ),
    ...(source.isGeneratedChildSource && !childDerivation
      ? ['missing-child-derivation-probe']
      : []),
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
    ...(childDerivation ? { childDerivation } : {}),
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

function buildFeatureProbe(
  marker: ProfileAwareFieldAtlasFeatureMarker,
  observation: ProfileAwareFeatureObservationView | undefined,
): ProfileAwareFieldAtlasFeatureProbe {
  return {
    probeKind: 'feature-observation',
    featureId: marker.featureId,
    observationKind: marker.observationKind,
    sampleId: marker.sampleId,
    chartId: marker.chartId,
    sourceFaceId: marker.sourceFaceId,
    position: copyVec3(marker.position),
    localChartPosition: [
      marker.localChartPosition[0],
      marker.localChartPosition[1],
    ],
    intensity: marker.intensity,
    phase: marker.phase,
    relativeIntensity: marker.relativeIntensity,
    effectiveSourceCount: marker.effectiveSourceCount,
    topContributionRatio: marker.topContributionRatio,
    status: marker.status,
    semanticStatus: 'not-semantic-naming',
    sourcePolicyNames: [...marker.sourcePolicyNames],
    reason: observation?.reason ?? '',
    linkedSampleProbeRef: `sample:${marker.sampleId}`,
  };
}

function buildRouteGateProbe(
  marker: ProfileAwareFieldAtlasRouteGateCandidateMarker,
): ProfileAwareFieldAtlasRouteGateProbe {
  return {
    probeKind: 'route-gate-candidate',
    candidateId: marker.candidateId,
    candidateKind: marker.candidateKind,
    candidateSubtype: marker.candidateSubtype,
    status: 'candidate-only',
    claimStatus: marker.claimStatus,
    semanticStatus: 'not-semantic-naming',
    topologyStatus: 'not-topology-workspace',
    phaseContinuityStatus: 'not-global-phase-continuity',
    reliability: marker.reliability,
    sampleIds: [...marker.sampleIds],
    chartIds: [...marker.chartIds],
    edgeIds: [...marker.edgeIds],
    seamEdgesInvolved: marker.seamEdgesInvolved,
    ...(typeof marker.pathLength === 'number'
      ? { pathLength: marker.pathLength }
      : {}),
    ...(marker.anchorSampleId ? { anchorSampleId: marker.anchorSampleId } : {}),
    ...(marker.position ? { position: copyVec3(marker.position) } : {}),
    intensitySummary: {
      min: marker.intensitySummary.min,
      max: marker.intensitySummary.max,
      average: marker.intensitySummary.average,
    },
    contributionMixtureSummary: {
      averageEffectiveSourceCount:
        marker.contributionMixtureSummary.averageEffectiveSourceCount,
      maxTopContributionRatio:
        marker.contributionMixtureSummary.maxTopContributionRatio,
      mixedSampleCount: marker.contributionMixtureSummary.mixedSampleCount,
    },
    evidenceProfile: copyRouteGateEvidenceProfile(marker.evidenceProfile),
    sourcePolicyNames: [...marker.sourcePolicyNames],
    reason: marker.reason,
  };
}

function buildSupportRegionProbe(
  marker: ProfileAwareFieldAtlasSupportRegionCandidateMarker,
): ProfileAwareFieldAtlasSupportRegionProbe {
  return {
    probeKind: 'support-region-candidate',
    candidateId: marker.candidateId,
    candidateKind: marker.candidateKind,
    supportKind: marker.supportKind,
    status: 'candidate-only',
    semanticStatus: 'not-semantic-naming',
    topologyStatus: 'not-topology-workspace',
    phaseContinuityStatus: 'not-global-phase-continuity',
    reliability: marker.reliability,
    sampleIds: [...marker.sampleIds],
    chartIds: [...marker.chartIds],
    edgeIds: [...marker.edgeIds],
    observationIds: [...marker.observationIds],
    routeGateCandidateIds: [...marker.routeGateCandidateIds],
    seamEdgesInvolved: marker.seamEdgesInvolved,
    computationalOnlyInvolved: marker.computationalOnlyInvolved,
    ...(marker.anchorSampleId ? { anchorSampleId: marker.anchorSampleId } : {}),
    ...(marker.position ? { position: copyVec3(marker.position) } : {}),
    evidenceSummary: copySupportRegionEvidenceSummary(marker.evidenceSummary),
    sourcePolicyNames: [...marker.sourcePolicyNames],
    reason: marker.reason,
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
    args.probeIndex.sampleProbeCount !== args.surfaceSampleMarkers.length ||
    args.probeIndex.featureProbeCount !==
      args.featureOverlaySummary.featureMarkers.length ||
    args.probeIndex.routeGateCandidateProbeCount !==
      args.routeGateOverlaySummary.candidateMarkers.length ||
    args.probeIndex.routeGateSummaryProbeCount !== 1 ||
    args.probeIndex.routeGateProbeCount !==
      args.routeGateOverlaySummary.candidateMarkers.length + 1 ||
    args.probeIndex.supportRegionCandidateProbeCount !==
      args.supportRegionOverlaySummary.candidateMarkers.length ||
    args.probeIndex.supportRegionSummaryProbeCount !== 1 ||
    args.probeIndex.supportRegionProbeCount !==
      args.supportRegionOverlaySummary.candidateMarkers.length + 1
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
        featureProbeCount: args.probeIndex.featureProbeCount,
        featureMarkerCount: args.featureOverlaySummary.featureMarkers.length,
        routeGateProbeCount: args.probeIndex.routeGateProbeCount,
        routeGateCandidateProbeCount:
          args.probeIndex.routeGateCandidateProbeCount,
        routeGateSummaryProbeCount: args.probeIndex.routeGateSummaryProbeCount,
        routeGateCandidateMarkerCount:
          args.routeGateOverlaySummary.candidateMarkers.length,
        supportRegionProbeCount: args.probeIndex.supportRegionProbeCount,
        supportRegionCandidateProbeCount:
          args.probeIndex.supportRegionCandidateProbeCount,
        supportRegionSummaryProbeCount:
          args.probeIndex.supportRegionSummaryProbeCount,
        supportRegionCandidateMarkerCount:
          args.supportRegionOverlaySummary.candidateMarkers.length,
      },
    });
  }

  if (
    args.featureOverlaySummary.featureMarkers.length !==
    args.featureOverlaySummary.totalObservationCount
  ) {
    issues.push({
      code: 'feature-marker-count-mismatch',
      message:
        'Profile-aware atlas view model feature marker count does not match feature observation count.',
      layer: 'featureOverlaySummary',
      details: {
        featureMarkerCount: args.featureOverlaySummary.featureMarkers.length,
        totalObservationCount: args.featureOverlaySummary.totalObservationCount,
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

  if (
    args.routeGateOverlaySummary.candidateMarkers.length !==
    args.routeGateOverlaySummary.totalRouteGateCandidateCount
  ) {
    issues.push({
      code: 'route-gate-count-mismatch',
      message:
        'Profile-aware atlas view model route/gate candidate marker count does not match total candidate count.',
      layer: 'routeGateOverlaySummary',
      details: {
        totalRouteGateCandidateCount:
          args.routeGateOverlaySummary.totalRouteGateCandidateCount,
        candidateMarkerCount:
          args.routeGateOverlaySummary.candidateMarkers.length,
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

  if (
    args.supportRegionOverlaySummary.candidateMarkers.length !==
    args.supportRegionOverlaySummary.totalSupportRegionCandidateCount
  ) {
    issues.push({
      code: 'support-region-count-mismatch',
      message:
        'Profile-aware atlas view model support/region candidate marker count does not match total candidate count.',
      layer: 'supportRegionOverlaySummary',
      details: {
        totalSupportRegionCandidateCount:
          args.supportRegionOverlaySummary.totalSupportRegionCandidateCount,
        candidateMarkerCount:
          args.supportRegionOverlaySummary.candidateMarkers.length,
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

function buildCentroid(positions: Vec3[]): Vec3 | undefined {
  if (!positions.length) {
    return undefined;
  }

  const sum = positions.reduce(
    (total, position) =>
      [
        total[0] + position[0],
        total[1] + position[1],
        total[2] + position[2],
      ] as Vec3,
    [0, 0, 0] as Vec3,
  );

  return [
    sum[0] / positions.length,
    sum[1] / positions.length,
    sum[2] / positions.length,
  ];
}

function copyRouteGateEvidenceProfile(
  evidenceProfile: ProfileAwareRouteGateCandidateView['evidenceProfile'],
): ProfileAwareRouteGateCandidateView['evidenceProfile'] {
  return {
    ...evidenceProfile,
    ...(evidenceProfile.endpointRelativeIntensities
      ? {
          endpointRelativeIntensities: [
            ...evidenceProfile.endpointRelativeIntensities,
          ],
        }
      : {}),
  };
}

function copySupportRegionEvidenceSummary(
  evidenceSummary: ProfileAwareSupportRegionCandidateView['evidenceSummary'],
): ProfileAwareSupportRegionCandidateView['evidenceSummary'] {
  return {
    sampleCount: evidenceSummary.sampleCount,
    chartCount: evidenceSummary.chartCount,
    seamEdgeCount: evidenceSummary.seamEdgeCount,
    chartLocalEdgeCount: evidenceSummary.chartLocalEdgeCount,
    averageIntensity: evidenceSummary.averageIntensity,
    minIntensity: evidenceSummary.minIntensity,
    maxIntensity: evidenceSummary.maxIntensity,
    averageEffectiveSourceCount: evidenceSummary.averageEffectiveSourceCount,
    maxTopContributionRatio: evidenceSummary.maxTopContributionRatio,
    fieldFeatureObservationCount: evidenceSummary.fieldFeatureObservationCount,
    routeGateCandidateCount: evidenceSummary.routeGateCandidateCount,
    computationalOnlySampleCount: evidenceSummary.computationalOnlySampleCount,
  };
}

function copyVec3(position: Vec3): Vec3 {
  return [position[0], position[1], position[2]];
}

function copyPair(pair: [string, string]): [string, string] {
  return [pair[0], pair[1]];
}

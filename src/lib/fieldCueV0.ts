import { createSeedShape } from '../data/seeds';
import { applyAmboDissection } from './ambo';
import {
  buildTetrahedralAmboChildContexts,
  createTetrahedralVertexFixture,
  type TetrahedralAmboChildContext,
} from './fieldSourceChildContexts';
import {
  type ChildProfileDegeneracyStatus,
  type FieldSourceChildDegeneracyReport,
} from './fieldSourceChildDegeneracy';
import {
  buildProfileAwareFieldAtlasViewModelRuntimeReport,
  type ProfileAwareFieldAtlasFeatureMarker,
  type ProfileAwareFieldAtlasRouteGateCandidateMarker,
  type ProfileAwareFieldAtlasSurfaceSampleMarker,
  type ProfileAwareFieldAtlasSupportRegionCandidateMarker,
  type ProfileAwareFieldAtlasViewModelReport,
} from './fieldSourceProfileAwareAtlasViewModel';
import {
  buildProfileAwareEvidenceStabilityReport,
  type ProfileAwareEvidenceStabilityReport,
} from './fieldSourceProfileAwareEvidenceStability';
import {
  type ProfileAwareFieldSourcePolicyDiagnosticReport,
  type ProfileAwareSourceEntry,
} from './fieldSourceProfileAwarePolicy';
import {
  buildPythagoreanTetrachordProfileAwareSourcePolicyReport,
  buildPythagoreanTetrachordQuarkRegimeV0Report,
  type PythagoreanTetrachordChildDerivationRecord,
  type PythagoreanTetrachordDifferentiatingAxis,
  type PythagoreanTetrachordNeutralAxis,
  type PythagoreanTetrachordQuarkRegimeV0Report,
  type PythagoreanTetrachordRatioSlot,
} from './fieldSourcePythagoreanTetrachordQuarkRegimeV0';

export type FieldCueV0SiteId =
  | 'M_AB'
  | 'M_AC'
  | 'M_AD'
  | 'M_BC'
  | 'M_BD'
  | 'M_CD';

export type FieldCueV0SiteKind = 'generated-midpoint-child';
export type FieldCueV0Method = 'field-cue-v0-diagnostic';
export type FieldCueV0DiagnosticScope =
  'field-cue-v0-one-ambo-tetrahedron-only';
export type FieldCueV0PolicyId = 'field-cue-v0-one-ambo-tetrahedron';
export type FieldCueV0EventScopeStatus =
  'one-ambo-tetrahedron-proving-event';
export type FieldCueV0FieldLayerStatus =
  'event-bound-profile-aware-prototype';
export type FieldCueV0GeneralityStatus = 'not-general-field-layer';
export type FieldCueV0PortabilityStatus = 'untested';
export type FieldCueV0SourcePolicyStatus = 'policy-relative';
export type FieldCueV0SemanticStatus = 'not-semantic-naming';
export type FieldCueV0TopologyStatus = 'not-topology-workspace';
export type FieldCueV0PacketWriteStatus = 'not-packet-writing';
export type FieldCueV0ShapeMutationStatus = 'not-shape-mutation';
export type FieldCueV0InheritanceStatus =
  | 'complete'
  | 'fallback'
  | 'unresolved'
  | 'degenerate'
  | 'unsupported';
export type FieldCueV0ParticipationStatus =
  | 'available'
  | 'candidate-only'
  | 'weak'
  | 'saturated'
  | 'sensitive'
  | 'degenerate'
  | 'unsupported'
  | 'misleading-risk'
  | 'not-yet-computed'
  | 'not-applicable';
export type FieldCueV0RelationKind =
  | 'candidate-reference'
  | 'candidate-sample-contribution'
  | 'candidate-neighborhood-reference'
  | 'candidate-dominant-source-reference'
  | 'candidate-route-gate-reference'
  | 'candidate-support-region-reference';
export type FieldCueV0RelationMaturity =
  | 'candidate-reference'
  | 'candidate-relation';
export type FieldCueV0TargetKind =
  | 'feature-observation'
  | 'route-gate-candidate'
  | 'support-region-candidate';
export type FieldCueV0CandidateReliability =
  | 'low'
  | 'medium'
  | 'high'
  | 'sensitive'
  | 'unknown';

export interface FieldCueV0EmissionTuple {
  amplitude: number;
  waveNumber: number;
  phase: number;
  attenuation: number;
}

export interface FieldCueV0QuarkChannelSummary {
  channelId: string;
  child90: string;
  parent60: string;
  projection30: string;
  parentProfileId: string;
  projectionProfileId: string;
  parentWeight: number;
  projectionWeight: number;
  channelParameters: FieldCueV0EmissionTuple;
  parentRatioLabel?: string;
  projectionRatioLabel?: string;
  parentLogRatio?: number;
  projectionLogRatio?: number;
  channelLogRatio?: number;
  channelRatio?: number;
  channelWavelength?: number;
  channelDerivationLawId?: string;
}

export interface FieldCueV0SourceSignatureProvenance {
  provingRegimeId: string;
  sourceProfileSystemId: string;
  childInheritanceGrammarId: string;
  sourcePolicyId: string;
  assignedHarmonicSlots: Array<{
    vertexId: string;
    slotId: string;
    ratioLabel: string;
    ratio: number;
    logRatio: number;
  }>;
  baseWaveNumberCalibration: {
    baseWaveNumberCalibrationStatus: string;
    referenceEdgeLengthKind: string;
    referenceEdgeLengthValue: number;
    wavelengthToEdgeRatio: number;
    edgeToWavelengthRatio: number;
    referenceWavelength: number;
    baseWaveNumber: number;
  };
  eventShellProvenance: {
    parentSolid: string;
    generatedCore: string;
    parentShellRatio: number;
    childShellRatio: number;
    circumradiusContraction: number;
    inradiusPreserved: boolean;
    shellScalingApplication: string;
  };
  activeDifferentiatingAxes: PythagoreanTetrachordDifferentiatingAxis[];
  neutralAxes: PythagoreanTetrachordNeutralAxis[];
  pairSumUniquenessStatus: string;
  childLogRatio?: number;
  childRatio?: number;
  childWavelength?: number;
  childWaveNumber?: number;
  childWaveNumberShellScalingApplied?: boolean;
  childAttenuationShellScalingApplied?: boolean;
}

export interface FieldCueV0SiteScope {
  cueId: string;
  siteId: FieldCueV0SiteId;
  siteKind: FieldCueV0SiteKind;
  eventScopeStatus: FieldCueV0EventScopeStatus;
  fieldLayerStatus: FieldCueV0FieldLayerStatus;
  generalityStatus: FieldCueV0GeneralityStatus;
  portabilityStatus: FieldCueV0PortabilityStatus;
  sourcePolicyId: typeof SOURCE_POLICY_ID;
  sourcePolicyStatus: FieldCueV0SourcePolicyStatus;
  fieldCuePolicyId: FieldCueV0PolicyId;
  semanticStatus: FieldCueV0SemanticStatus;
  topologyStatus: FieldCueV0TopologyStatus;
  packetWriteStatus: FieldCueV0PacketWriteStatus;
  shapeMutationStatus: FieldCueV0ShapeMutationStatus;
}

export interface FieldCueV0InheritanceAxis {
  sourceEdgeId?: string;
  parentVertexIds: string[];
  projectionVertexIds: string[];
  complementEdgeId?: string;
  complementEdgeVertexIds: string[];
  antipodalChildSiteId?: string;
  childRole?: 'shared-90-pole';
  inheritanceGrammarId?: string;
  mergeKind?: string;
  provingRegimeId?: string;
  childInheritanceGrammarId?: string;
  childLogRatio?: number;
  childRatio?: number;
  childWavelength?: number;
  baseWaveNumber?: number;
  referenceWavelength?: number;
  wavelengthToEdgeRatio?: number;
  shellScalingApplication?: string;
  activeDifferentiatingAxes?: PythagoreanTetrachordDifferentiatingAxis[];
  neutralAxes?: PythagoreanTetrachordNeutralAxis[];
  quarkChannelSummaries: FieldCueV0QuarkChannelSummary[];
  derivedEmissionTuple?: FieldCueV0EmissionTuple;
  fallbackKind?: string;
  fallbackReason?: string;
  unresolved: boolean;
  degeneracyStatuses: ChildProfileDegeneracyStatus[];
  inheritanceStatus: FieldCueV0InheritanceStatus;
}

export interface FieldCueV0EmittedSourceSignature {
  sourceId?: string;
  sourceKind?: ProfileAwareSourceEntry['sourceKind'];
  sourceProbeRef?: string;
  fieldReady: boolean;
  profileId?: string;
  profileSystemId?: string;
  profileSetupId?: string;
  emissionTuple?: FieldCueV0EmissionTuple;
  tupleSummary: string;
}

export interface FieldCueV0CandidateRelation {
  targetId: string;
  targetKind: FieldCueV0TargetKind;
  relationKind: FieldCueV0RelationKind;
  relationMaturity: FieldCueV0RelationMaturity;
  participationStatus: FieldCueV0ParticipationStatus;
  evidenceBasis: string[];
  sourceContributionRatio?: number;
  sourceContributionRank?: number;
  sourceContributionBaseline?: number;
  meaningfulContributionRule: string;
  probeRef?: string;
  sampleProbeRefs?: string[];
  chartProbeRefs?: string[];
  sampleIds: string[];
  chartIds: string[];
  reliability: FieldCueV0CandidateReliability;
  caveats: string[];
}

export interface FieldCueV0CandidateFieldWorldAxis {
  candidateRelations: FieldCueV0CandidateRelation[];
  candidateRelationCount: number;
  candidateReferenceCount: number;
  featureObservationReferenceCount: number;
  routeGateCandidateReferenceCount: number;
  supportRegionCandidateReferenceCount: number;
  relationMaturityStatuses: FieldCueV0RelationMaturity[];
  unsupportedCaveats: string[];
}

export interface FieldCueV0NamingPressure {
  namingQuestions: string[];
  warnings: string[];
  forbiddenConclusions: string[];
  semanticStatus: FieldCueV0SemanticStatus;
}

export interface FieldCueV0 {
  cueId: string;
  siteId: FieldCueV0SiteId;
  siteKind: FieldCueV0SiteKind;
  eventScopeStatus: FieldCueV0EventScopeStatus;
  fieldLayerStatus: FieldCueV0FieldLayerStatus;
  generalityStatus: FieldCueV0GeneralityStatus;
  portabilityStatus: FieldCueV0PortabilityStatus;
  sourcePolicyId: typeof SOURCE_POLICY_ID;
  sourcePolicyStatus: FieldCueV0SourcePolicyStatus;
  fieldCuePolicyId: FieldCueV0PolicyId;
  semanticStatus: FieldCueV0SemanticStatus;
  topologyStatus: FieldCueV0TopologyStatus;
  packetWriteStatus: FieldCueV0PacketWriteStatus;
  shapeMutationStatus: FieldCueV0ShapeMutationStatus;
  siteScope: FieldCueV0SiteScope;
  inheritanceAxis: FieldCueV0InheritanceAxis;
  emittedSourceSignature: FieldCueV0EmittedSourceSignature;
  sourceSignatureProvenance: FieldCueV0SourceSignatureProvenance;
  candidateFieldWorldAxis: FieldCueV0CandidateFieldWorldAxis;
  participationStatus: FieldCueV0ParticipationStatus;
  warningStatuses: FieldCueV0ParticipationStatus[];
  fieldPressureSummary: string;
  namingPressure: FieldCueV0NamingPressure;
  namingQuestions: string[];
  warnings: string[];
  forbiddenConclusions: string[];
}

export interface FieldCueV0Issue {
  code:
    | 'canonical-shape-mutated'
    | 'runtime-view-model-unavailable'
    | 'runtime-view-model-not-ok'
    | 'profile-aware-policy-not-ok'
    | 'child-degeneracy-report-not-ok'
    | 'evidence-stability-report-not-ok'
    | 'missing-child-context'
    | 'missing-child-source'
    | 'missing-child-derivation'
    | 'invalid-cue-count'
    | 'unexpected-cue-site-id';
  message: string;
  siteId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface FieldCueV0Summary {
  cueCount: number;
  participationStatusCounts: Record<FieldCueV0ParticipationStatus, number>;
  degeneracyCount: number;
  candidateReferenceCountsByKind: Record<FieldCueV0TargetKind, number>;
  sensitiveCueCount: number;
  saturatedCueCount: number;
  misleadingRiskCueCount: number;
}

export interface FieldCueV0Report {
  reportId: string;
  method: FieldCueV0Method;
  diagnosticScope: FieldCueV0DiagnosticScope;
  fieldCuePolicyId: FieldCueV0PolicyId;
  eventScopeStatus: FieldCueV0EventScopeStatus;
  fieldLayerStatus: FieldCueV0FieldLayerStatus;
  generalityStatus: FieldCueV0GeneralityStatus;
  portabilityStatus: FieldCueV0PortabilityStatus;
  sourcePolicyId: typeof SOURCE_POLICY_ID;
  sourceSignatureProvenance: Omit<
    FieldCueV0SourceSignatureProvenance,
    | 'assignedHarmonicSlots'
    | 'childLogRatio'
    | 'childRatio'
    | 'childWavelength'
    | 'childWaveNumber'
    | 'childWaveNumberShellScalingApplied'
    | 'childAttenuationShellScalingApplied'
  >;
  sourcePolicyStatus: FieldCueV0SourcePolicyStatus;
  semanticStatus: FieldCueV0SemanticStatus;
  topologyStatus: FieldCueV0TopologyStatus;
  packetWriteStatus: FieldCueV0PacketWriteStatus;
  shapeMutationStatus: FieldCueV0ShapeMutationStatus;
  operationRegistryStatus: 'not-operation-registry-work';
  shapeId: string;
  provingEventOperation: 'ambo-dissection';
  provingEventGenerationDepth: 1;
  expectedSiteIds: FieldCueV0SiteId[];
  cueCount: number;
  shapeMutationDetected: boolean;
  packetWriteDetected: false;
  cues: FieldCueV0[];
  summary: FieldCueV0Summary;
  issueCount: number;
  ok: boolean;
  issues: FieldCueV0Issue[];
}

interface FieldCueV0SourceChain {
  provingRegimeReport: PythagoreanTetrachordQuarkRegimeV0Report;
  profileSystemId: string;
  profileSetupId: string;
  childContexts: TetrahedralAmboChildContext[];
  childDerivationRecords: PythagoreanTetrachordChildDerivationRecord[];
  childDegeneracyReport: FieldSourceChildDegeneracyReport;
  profileAwarePolicyReport: ProfileAwareFieldSourcePolicyDiagnosticReport;
}

interface CandidateLinkContext {
  viewModel: ProfileAwareFieldAtlasViewModelReport;
  evidenceStabilityReport: ProfileAwareEvidenceStabilityReport;
  childSourceBySiteId: Map<string, ProfileAwareSourceEntry>;
  childDegenerateSiteIds: Set<string>;
}

interface CandidateRelationBuildArgs {
  childSource: ProfileAwareSourceEntry;
  childDegenerate: boolean;
  targetId: string;
  targetKind: FieldCueV0TargetKind;
  relationKind: FieldCueV0RelationKind;
  samples: ProfileAwareFieldAtlasSurfaceSampleMarker[];
  chartIds: string[];
  probeRef?: string;
  chartProbeRefByChartId: Map<string, string>;
  reliability?: string;
  evidenceStabilityReport: ProfileAwareEvidenceStabilityReport;
  extraEvidence?: string[];
  extraCaveats?: string[];
}

interface MeaningfulContributionEvidence {
  sample: ProfileAwareFieldAtlasSurfaceSampleMarker;
  sourceContributionRatio: number;
  contributionCount: number;
  sourceContributionBaseline: number;
  sourceContributionRank: number;
  dominantSourceMatch: boolean;
  aboveBaselineThreshold: boolean;
  topThreeRank: boolean;
  rule: string;
}

const METHOD: FieldCueV0Method = 'field-cue-v0-diagnostic';
const DIAGNOSTIC_SCOPE: FieldCueV0DiagnosticScope =
  'field-cue-v0-one-ambo-tetrahedron-only';
const FIELD_CUE_POLICY_ID: FieldCueV0PolicyId =
  'field-cue-v0-one-ambo-tetrahedron';
const EVENT_SCOPE_STATUS: FieldCueV0EventScopeStatus =
  'one-ambo-tetrahedron-proving-event';
const FIELD_LAYER_STATUS: FieldCueV0FieldLayerStatus =
  'event-bound-profile-aware-prototype';
const GENERALITY_STATUS: FieldCueV0GeneralityStatus =
  'not-general-field-layer';
const PORTABILITY_STATUS: FieldCueV0PortabilityStatus = 'untested';
const SOURCE_POLICY_ID = 'pythagorean-tetrachord-quark-proving-policy-v0' as const;
const SOURCE_POLICY_STATUS: FieldCueV0SourcePolicyStatus = 'policy-relative';
const SEMANTIC_STATUS: FieldCueV0SemanticStatus = 'not-semantic-naming';
const TOPOLOGY_STATUS: FieldCueV0TopologyStatus = 'not-topology-workspace';
const PACKET_WRITE_STATUS: FieldCueV0PacketWriteStatus = 'not-packet-writing';
const SHAPE_MUTATION_STATUS: FieldCueV0ShapeMutationStatus =
  'not-shape-mutation';
const EXPECTED_SITE_IDS: FieldCueV0SiteId[] = [
  'M_AB',
  'M_AC',
  'M_AD',
  'M_BC',
  'M_BD',
  'M_CD',
];

export function buildFieldCueV0Report(): FieldCueV0Report {
  const canonicalShape = applyAmboDissection(createSeedShape('tetrahedron'));
  const beforeShapeJson = JSON.stringify(canonicalShape);
  const sourceChain = buildFieldCueV0SourceChain();
  const runtimeReport =
    buildProfileAwareFieldAtlasViewModelRuntimeReport(canonicalShape);
  const evidenceStabilityReport = buildProfileAwareEvidenceStabilityReport();
  const issues: FieldCueV0Issue[] = [];
  const shapeMutationDetected = JSON.stringify(canonicalShape) !== beforeShapeJson;

  if (shapeMutationDetected) {
    issues.push({
      code: 'canonical-shape-mutated',
      message: 'FieldCueV0 report building mutated the canonical proving Shape.',
    });
  }

  if (runtimeReport.runtimeBoundaryStatus !== 'supported') {
    issues.push({
      code: 'runtime-view-model-unavailable',
      message: 'FieldCueV0 could not build the profile-aware runtime view model.',
      details: {
        runtimeUnsupported: true,
      },
    });
  } else if (!runtimeReport.ok) {
    issues.push({
      code: 'runtime-view-model-not-ok',
      message: 'FieldCueV0 received a non-ok profile-aware runtime view model.',
      details: {
        runtimeIssueCount: runtimeReport.issueCount,
      },
    });
  }

  if (!sourceChain.profileAwarePolicyReport.ok) {
    issues.push({
      code: 'profile-aware-policy-not-ok',
      message: 'FieldCueV0 source policy chain is not ok.',
      details: {
        policyIssueCount: sourceChain.profileAwarePolicyReport.issueCount,
      },
    });
  }

  if (!sourceChain.childDegeneracyReport.ok) {
    issues.push({
      code: 'child-degeneracy-report-not-ok',
      message: 'FieldCueV0 child degeneracy report is not ok.',
      details: {
        degeneracyIssueCount: sourceChain.childDegeneracyReport.issueCount,
      },
    });
  }

  if (!evidenceStabilityReport.ok) {
    issues.push({
      code: 'evidence-stability-report-not-ok',
      message: 'FieldCueV0 evidence stability report is not ok.',
      details: {
        evidenceStabilityIssueCount: evidenceStabilityReport.issueCount,
      },
    });
  }

  const childContextBySiteId = new Map(
    sourceChain.childContexts.map((context) => [context.childVertexId, context]),
  );
  const childDerivationRecordBySiteId = new Map(
    sourceChain.childDerivationRecords.map((record) => [
      record.childId,
      record,
    ]),
  );
  const childSourceBySiteId = new Map(
    sourceChain.profileAwarePolicyReport.sources
      .filter((source) => source.sourceKind.startsWith('generated-child-'))
      .map((source) => [source.vertexId, source]),
  );
  const degeneracyObservationBySiteId = new Map(
    sourceChain.childDegeneracyReport.observations.map((observation) => [
      observation.childVertexId,
      observation,
    ]),
  );
  const viewModel =
    runtimeReport.runtimeBoundaryStatus === 'supported'
      ? runtimeReport.viewModel
      : null;
  const candidateRelationsBySiteId =
    viewModel === null
      ? new Map<string, FieldCueV0CandidateRelation[]>()
      : buildCandidateRelationsBySiteId({
          viewModel,
          evidenceStabilityReport,
          childSourceBySiteId,
          childDegenerateSiteIds: buildDegenerateSiteIdSet(
            sourceChain.childDegeneracyReport,
          ),
        });
  const sourceProbeRefBySourceId =
    viewModel === null
      ? new Map<string, string>()
      : new Map(
          viewModel.sourceMarkers.map((marker) => [
            marker.sourceId,
            marker.probeRef,
          ]),
        );

  const cues = EXPECTED_SITE_IDS.map((siteId) => {
    const childContext = childContextBySiteId.get(siteId);
    const childDerivationRecord = childDerivationRecordBySiteId.get(siteId);
    const childSource = childSourceBySiteId.get(siteId);

    if (!childContext) {
      issues.push({
        code: 'missing-child-context',
        message: `FieldCueV0 is missing child context for ${siteId}.`,
        siteId,
      });
    }

    if (!childSource) {
      issues.push({
        code: 'missing-child-source',
        message: `FieldCueV0 is missing profile-aware child source for ${siteId}.`,
        siteId,
      });
    }

    if (!childDerivationRecord) {
      issues.push({
        code: 'missing-child-derivation',
        message: `FieldCueV0 is missing child source derivation for ${siteId}.`,
        siteId,
      });
    }

    return buildCue({
      siteId,
      childContext,
      childDerivationRecord,
      childSource,
      sourceProbeRef: childSource
        ? sourceProbeRefBySourceId.get(childSource.sourceId)
        : undefined,
      degeneracyStatuses:
        degeneracyObservationBySiteId.get(siteId)?.statuses ?? [],
      candidateRelations: candidateRelationsBySiteId.get(siteId) ?? [],
      evidenceStabilityReport,
      profileSystemId: sourceChain.profileSystemId,
      profileSetupId: sourceChain.profileSetupId,
      provingRegimeReport: sourceChain.provingRegimeReport,
    });
  });

  if (cues.length !== EXPECTED_SITE_IDS.length) {
    issues.push({
      code: 'invalid-cue-count',
      message: 'FieldCueV0 produced an unexpected cue count.',
      details: {
        expectedCueCount: EXPECTED_SITE_IDS.length,
        actualCueCount: cues.length,
      },
    });
  }

  for (const cue of cues) {
    if (!EXPECTED_SITE_IDS.includes(cue.siteId)) {
      issues.push({
        code: 'unexpected-cue-site-id',
        message: `FieldCueV0 produced unexpected cue site ${cue.siteId}.`,
        siteId: cue.siteId,
      });
    }
  }

  const summary = buildSummary(cues);
  const issueCount = issues.length;

  return {
    reportId: `${METHOD}:one-ambo-tetrahedron`,
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    fieldCuePolicyId: FIELD_CUE_POLICY_ID,
    eventScopeStatus: EVENT_SCOPE_STATUS,
    fieldLayerStatus: FIELD_LAYER_STATUS,
    generalityStatus: GENERALITY_STATUS,
    portabilityStatus: PORTABILITY_STATUS,
    sourcePolicyId: SOURCE_POLICY_ID,
    sourceSignatureProvenance: buildReportSourceSignatureProvenance(
      sourceChain.provingRegimeReport,
    ),
    sourcePolicyStatus: SOURCE_POLICY_STATUS,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    shapeMutationStatus: SHAPE_MUTATION_STATUS,
    operationRegistryStatus: 'not-operation-registry-work',
    shapeId: canonicalShape.id,
    provingEventOperation: 'ambo-dissection',
    provingEventGenerationDepth: 1,
    expectedSiteIds: [...EXPECTED_SITE_IDS],
    cueCount: cues.length,
    shapeMutationDetected,
    packetWriteDetected: false,
    cues,
    summary,
    issueCount,
    ok:
      issueCount === 0 &&
      cues.length === EXPECTED_SITE_IDS.length &&
      !shapeMutationDetected &&
      runtimeReport.runtimeBoundaryStatus === 'supported' &&
      runtimeReport.ok &&
      sourceChain.profileAwarePolicyReport.ok &&
      sourceChain.childDegeneracyReport.ok &&
      evidenceStabilityReport.ok,
    issues,
  };
}

function buildFieldCueV0SourceChain(): FieldCueV0SourceChain {
  const provingRegimeReport = buildPythagoreanTetrachordQuarkRegimeV0Report();
  const vertexIds = createTetrahedralVertexFixture();
  const childContexts = buildTetrahedralAmboChildContexts(vertexIds);
  const childDerivationRecords = provingRegimeReport.childDerivationTable;
  const childDegeneracyReport = buildPythagoreanChildDegeneracyReport({
    childContexts,
    childDerivationRecords,
  });
  const profileAwarePolicyReport =
    buildPythagoreanTetrachordProfileAwareSourcePolicyReport(provingRegimeReport);

  return {
    provingRegimeReport,
    profileSystemId: provingRegimeReport.sourceProfileSystemId,
    profileSetupId:
      profileAwarePolicyReport.profileSetupId ??
      `${provingRegimeReport.sourceProfileSystemId}:default-proving-fixture`,
    childContexts,
    childDerivationRecords,
    childDegeneracyReport,
    profileAwarePolicyReport,
  };
}

function buildPythagoreanChildDegeneracyReport(args: {
  childContexts: TetrahedralAmboChildContext[];
  childDerivationRecords: PythagoreanTetrachordChildDerivationRecord[];
}): FieldSourceChildDegeneracyReport {
  const childRecordById = new Map(
    args.childDerivationRecords.map((record) => [record.childId, record]),
  );
  const observations = args.childContexts.map((context) => {
    const childRecord = childRecordById.get(context.childVertexId);
    const hasDerivedParameters = Boolean(childRecord?.derivedTuple);
    const statuses: ChildProfileDegeneracyStatus[] = hasDerivedParameters
      ? ['nondegenerate']
      : childRecord?.localDerivationStatus === 'undefined-circular-mean'
        ? ['undefined-circular-mean', 'phase-cancellation']
        : ['fallback-used'];

    return {
      childVertexId: context.childVertexId,
      sourceEdgeId: context.sourceEdgeId,
      complementEdgeId: context.complementEdgeId,
      antipodalChildVertexId: context.antipodalChildVertexId,
      hasDerivedParameters,
      statuses,
      sameAsAntipodalChildVertexIds: [],
      sameAsOtherChildVertexIds: [],
    };
  });

  return {
    reportId: `tetrahedral-child-profile-degeneracy-diagnostic-v0:pythagorean-tetrachord`,
    method: 'tetrahedral-child-profile-degeneracy-diagnostic-v0',
    diagnosticScope: 'pairwise-child-profile-degeneracy-only',
    childCount: args.childContexts.length,
    expectedChildCount: 6,
    derivedChildCount: observations.filter(
      (observation) => observation.hasDerivedParameters,
    ).length,
    fallbackChildCount: observations.filter((observation) =>
      observation.statuses.includes('fallback-used'),
    ).length,
    undefinedCircularMeanChildCount: observations.filter((observation) =>
      observation.statuses.includes('undefined-circular-mean'),
    ).length,
    phaseCancellationChildCount: observations.filter((observation) =>
      observation.statuses.includes('phase-cancellation'),
    ).length,
    sameAsAntipodalCount: 0,
    sameAsOtherChildCount: 0,
    comparisonCount: 0,
    antipodalPairCount: 3,
    issueCount: 0,
    ok: true,
    observations,
    comparisons: [],
    issues: [],
  };
}

function buildReportSourceSignatureProvenance(
  report: PythagoreanTetrachordQuarkRegimeV0Report,
): FieldCueV0Report['sourceSignatureProvenance'] {
  const calibration = report.baseWaveNumberCalibration;
  const shell = report.eventShellProvenance;

  return {
    provingRegimeId: report.provingRegimeId,
    sourceProfileSystemId: report.sourceProfileSystemId,
    childInheritanceGrammarId: report.childInheritanceGrammarId,
    sourcePolicyId: report.sourcePolicyId,
    baseWaveNumberCalibration: {
      baseWaveNumberCalibrationStatus:
        calibration.baseWaveNumberCalibrationStatus,
      referenceEdgeLengthKind: calibration.referenceEdgeLengthKind,
      referenceEdgeLengthValue: calibration.referenceEdgeLengthValue,
      wavelengthToEdgeRatio: calibration.wavelengthToEdgeRatio,
      edgeToWavelengthRatio: calibration.edgeToWavelengthRatio,
      referenceWavelength: calibration.referenceWavelength,
      baseWaveNumber: calibration.baseWaveNumber,
    },
    eventShellProvenance: {
      parentSolid: shell.parentSolid,
      generatedCore: shell.generatedCore,
      parentShellRatio: shell.parentShellRatio,
      childShellRatio: shell.childShellRatio,
      circumradiusContraction: shell.circumradiusContraction,
      inradiusPreserved: shell.inradiusPreserved,
      shellScalingApplication: shell.shellScalingApplication,
    },
    activeDifferentiatingAxes: [...report.activeDifferentiatingAxes],
    neutralAxes: [...report.neutralAxes],
    pairSumUniquenessStatus:
      report.pairSumUniquenessAudit.pairSumUniquenessStatus,
  };
}

function buildCueSourceSignatureProvenance(args: {
  provingRegimeReport: PythagoreanTetrachordQuarkRegimeV0Report;
  childDerivationRecord: PythagoreanTetrachordChildDerivationRecord | undefined;
  childContext: TetrahedralAmboChildContext | undefined;
}): FieldCueV0SourceSignatureProvenance {
  const reportProvenance = buildReportSourceSignatureProvenance(
    args.provingRegimeReport,
  );
  const assignedHarmonicSlots = buildAssignedHarmonicSlots({
    slots: args.provingRegimeReport.profileSlots,
    vertexIds: args.childContext?.sourceEdgeVertexIds ?? [],
  });
  const child = args.childDerivationRecord;

  return {
    ...reportProvenance,
    assignedHarmonicSlots,
    ...(child?.childLogRatio !== undefined
      ? { childLogRatio: child.childLogRatio }
      : {}),
    ...(child?.childRatio !== undefined ? { childRatio: child.childRatio } : {}),
    ...(child?.childWavelength !== undefined
      ? { childWavelength: child.childWavelength }
      : {}),
    ...(child?.childWaveNumber !== undefined
      ? { childWaveNumber: child.childWaveNumber }
      : {}),
    ...(child
      ? {
          childWaveNumberShellScalingApplied:
            child.childWaveNumberShellScalingApplied,
          childAttenuationShellScalingApplied:
            child.childAttenuationShellScalingApplied,
        }
      : {}),
  };
}

function buildAssignedHarmonicSlots(args: {
  slots: PythagoreanTetrachordRatioSlot[];
  vertexIds: readonly string[];
}): FieldCueV0SourceSignatureProvenance['assignedHarmonicSlots'] {
  const slotByVertexId = new Map(
    args.slots.map((slot) => [slot.assignedVertexId, slot]),
  );

  return args.vertexIds.flatMap((vertexId) => {
    const slot = slotByVertexId.get(vertexId);

    return slot
      ? [
          {
            vertexId,
            slotId: slot.slotId,
            ratioLabel: slot.ratioLabel,
            ratio: slot.ratio,
            logRatio: slot.logRatio,
          },
        ]
      : [];
  });
}

function buildCue(args: {
  siteId: FieldCueV0SiteId;
  childContext: TetrahedralAmboChildContext | undefined;
  childDerivationRecord: PythagoreanTetrachordChildDerivationRecord | undefined;
  childSource: ProfileAwareSourceEntry | undefined;
  sourceProbeRef: string | undefined;
  degeneracyStatuses: ChildProfileDegeneracyStatus[];
  candidateRelations: FieldCueV0CandidateRelation[];
  evidenceStabilityReport: ProfileAwareEvidenceStabilityReport;
  profileSystemId: string;
  profileSetupId: string;
  provingRegimeReport: PythagoreanTetrachordQuarkRegimeV0Report;
}): FieldCueV0 {
  const cueId = `${FIELD_CUE_POLICY_ID}:${args.siteId}`;
  const siteScope = buildSiteScope(cueId, args.siteId);
  const sourceSignatureProvenance = buildCueSourceSignatureProvenance({
    provingRegimeReport: args.provingRegimeReport,
    childDerivationRecord: args.childDerivationRecord,
    childContext: args.childContext,
  });
  const inheritanceAxis = buildInheritanceAxis(args);
  const emittedSourceSignature = buildEmittedSourceSignature({
    childSource: args.childSource,
    sourceProbeRef: args.sourceProbeRef,
    derivedEmissionTuple: inheritanceAxis.derivedEmissionTuple,
    profileSystemId: args.profileSystemId,
    profileSetupId: args.profileSetupId,
  });
  const candidateFieldWorldAxis = buildCandidateFieldWorldAxis(
    args.candidateRelations,
  );
  const warningStatuses = buildWarningStatuses({
    childSource: args.childSource,
    inheritanceAxis,
    candidateRelations: args.candidateRelations,
    evidenceStabilityReport: args.evidenceStabilityReport,
  });
  const participationStatus = pickParticipationStatus({
    childSource: args.childSource,
    inheritanceAxis,
    candidateRelations: args.candidateRelations,
    warningStatuses,
    evidenceStabilityReport: args.evidenceStabilityReport,
  });
  const warnings = buildWarnings({
    participationStatus,
    warningStatuses,
    inheritanceAxis,
    candidateFieldWorldAxis,
  });
  const namingQuestions = buildNamingQuestions({
    participationStatus,
    warningStatuses,
    candidateFieldWorldAxis,
    inheritanceAxis,
  });
  const forbiddenConclusions = buildForbiddenConclusions();
  const fieldPressureSummary = buildFieldPressureSummary({
    participationStatus,
    inheritanceAxis,
    candidateFieldWorldAxis,
  });
  const namingPressure: FieldCueV0NamingPressure = {
    namingQuestions,
    warnings,
    forbiddenConclusions,
    semanticStatus: SEMANTIC_STATUS,
  };

  return {
    ...siteScope,
    siteScope,
    inheritanceAxis,
    emittedSourceSignature,
    sourceSignatureProvenance,
    candidateFieldWorldAxis,
    participationStatus,
    warningStatuses,
    fieldPressureSummary,
    namingPressure,
    namingQuestions,
    warnings,
    forbiddenConclusions,
  };
}

function buildSiteScope(
  cueId: string,
  siteId: FieldCueV0SiteId,
): FieldCueV0SiteScope {
  return {
    cueId,
    siteId,
    siteKind: 'generated-midpoint-child',
    eventScopeStatus: EVENT_SCOPE_STATUS,
    fieldLayerStatus: FIELD_LAYER_STATUS,
    generalityStatus: GENERALITY_STATUS,
    portabilityStatus: PORTABILITY_STATUS,
    sourcePolicyId: SOURCE_POLICY_ID,
    sourcePolicyStatus: SOURCE_POLICY_STATUS,
    fieldCuePolicyId: FIELD_CUE_POLICY_ID,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    shapeMutationStatus: SHAPE_MUTATION_STATUS,
  };
}

function buildInheritanceAxis(args: {
  childContext: TetrahedralAmboChildContext | undefined;
  childDerivationRecord: PythagoreanTetrachordChildDerivationRecord | undefined;
  childSource: ProfileAwareSourceEntry | undefined;
  degeneracyStatuses: ChildProfileDegeneracyStatus[];
  provingRegimeReport: PythagoreanTetrachordQuarkRegimeV0Report;
}): FieldCueV0InheritanceAxis {
  const record = args.childDerivationRecord;
  const derivedEmissionTuple = record?.derivedTuple
    ? copyEmissionTuple(record.derivedTuple)
    : undefined;
  const fallbackKind = record?.fallbackKind ?? args.childSource?.fallbackKind;
  const fallbackReason = record?.fallbackReason ?? args.childSource?.fallbackReason;
  const unresolved = !derivedEmissionTuple && !fallbackKind;
  const degeneracyStatuses = [...args.degeneracyStatuses];
  const calibration = args.provingRegimeReport.baseWaveNumberCalibration;

  return {
    sourceEdgeId: args.childContext?.sourceEdgeId ?? record?.sourceEdgeId,
    parentVertexIds: [
      ...(args.childContext?.sourceEdgeVertexIds ??
        record?.sourceEdgeVertexIds ??
        []),
    ],
    projectionVertexIds: [
      ...(args.childContext?.projectionVertexIds ??
        record?.projectionVertexIds ??
        []),
    ],
    complementEdgeId:
      args.childContext?.complementEdgeId ?? record?.complementEdgeId,
    complementEdgeVertexIds: [
      ...(args.childContext?.complementEdgeVertexIds ??
        record?.complementEdgeVertexIds ??
        []),
    ],
    antipodalChildSiteId:
      args.childContext?.antipodalChildVertexId ??
      record?.antipodalChildId,
    childRole: args.childContext?.childRole ?? 'shared-90-pole',
    inheritanceGrammarId:
      record
        ? args.provingRegimeReport.childInheritanceGrammarId
        : args.childContext?.grammarTargetId,
    provingRegimeId: args.provingRegimeReport.provingRegimeId,
    childInheritanceGrammarId: args.provingRegimeReport.childInheritanceGrammarId,
    ...(record?.childLogRatio !== undefined
      ? { childLogRatio: record.childLogRatio }
      : {}),
    ...(record?.childRatio !== undefined ? { childRatio: record.childRatio } : {}),
    ...(record?.childWavelength !== undefined
      ? { childWavelength: record.childWavelength }
      : {}),
    baseWaveNumber: calibration.baseWaveNumber,
    referenceWavelength: calibration.referenceWavelength,
    wavelengthToEdgeRatio: calibration.wavelengthToEdgeRatio,
    shellScalingApplication: args.provingRegimeReport.shellScalingApplication,
    activeDifferentiatingAxes: [...args.provingRegimeReport.activeDifferentiatingAxes],
    neutralAxes: [...args.provingRegimeReport.neutralAxes],
    mergeKind: args.childContext?.mergeTarget ?? 'four-channel-merge',
    quarkChannelSummaries:
      record?.channels.map((channel) => ({
        channelId: channel.channelId,
        child90: channel.childId,
        parent60: channel.parent60,
        projection30: channel.projection30,
        parentProfileId: channel.parentSlotId,
        projectionProfileId: channel.projectionSlotId,
        parentWeight: channel.parentWeight,
        projectionWeight: channel.projectionWeight,
        channelParameters: copyEmissionTuple(channel.channelEmittedTuple),
        parentRatioLabel: channel.parentRatioLabel,
        projectionRatioLabel: channel.projectionRatioLabel,
        parentLogRatio: channel.parentLogRatio,
        projectionLogRatio: channel.projectionLogRatio,
        channelLogRatio: channel.channelLogRatio,
        channelRatio: channel.channelRatio,
        channelWavelength: channel.channelWavelength,
        channelDerivationLawId: channel.channelDerivationLawId,
      })) ?? [],
    ...(derivedEmissionTuple ? { derivedEmissionTuple } : {}),
    ...(fallbackKind ? { fallbackKind } : {}),
    ...(fallbackReason ? { fallbackReason } : {}),
    unresolved,
    degeneracyStatuses,
    inheritanceStatus: pickInheritanceStatus({
      childContext: args.childContext,
      childSource: args.childSource,
      derivedEmissionTuple,
      fallbackKind,
      unresolved,
      degeneracyStatuses,
    }),
  };
}

function buildEmittedSourceSignature(args: {
  childSource: ProfileAwareSourceEntry | undefined;
  sourceProbeRef: string | undefined;
  derivedEmissionTuple: FieldCueV0EmissionTuple | undefined;
  profileSystemId: string;
  profileSetupId: string;
}): FieldCueV0EmittedSourceSignature {
  const emissionTuple = args.childSource?.emissionParameters
    ? copyEmissionTuple(args.childSource.emissionParameters)
    : args.derivedEmissionTuple;
  const fieldReady = args.childSource?.readiness === 'field-ready';

  return {
    ...(args.childSource?.sourceId ? { sourceId: args.childSource.sourceId } : {}),
    ...(args.childSource?.sourceKind
      ? { sourceKind: args.childSource.sourceKind }
      : {}),
    ...(args.sourceProbeRef ? { sourceProbeRef: args.sourceProbeRef } : {}),
    fieldReady,
    ...(args.childSource?.profileId ? { profileId: args.childSource.profileId } : {}),
    profileSystemId: args.childSource?.profileSystemId ?? args.profileSystemId,
    profileSetupId: args.profileSetupId,
    ...(emissionTuple ? { emissionTuple } : {}),
    tupleSummary: summarizeTuple({
      emissionTuple,
      fallbackKind: args.childSource?.fallbackKind,
      fallbackReason: args.childSource?.fallbackReason,
      fieldReady,
    }),
  };
}

function buildCandidateRelationsBySiteId(
  args: CandidateLinkContext,
): Map<string, FieldCueV0CandidateRelation[]> {
  const relationsBySiteId = new Map<string, FieldCueV0CandidateRelation[]>();
  const sampleById = new Map(
    args.viewModel.surfaceSampleMarkers.map((sample) => [
      sample.sampleId,
      sample,
    ]),
  );
  const chartProbeRefByChartId = new Map(
    args.viewModel.chartOverlaySummary.chartAnchorMarkers.map((marker) => [
      marker.chartId,
      marker.probeRef,
    ]),
  );

  for (const siteId of EXPECTED_SITE_IDS) {
    const childSource = args.childSourceBySiteId.get(siteId);

    if (!childSource) {
      relationsBySiteId.set(siteId, []);
      continue;
    }

    const childDegenerate = args.childDegenerateSiteIds.has(siteId);
    const relations: FieldCueV0CandidateRelation[] = [];

    for (const marker of args.viewModel.featureOverlaySummary.featureMarkers) {
      const relation = buildFeatureRelation({
        marker,
        sampleById,
        childSource,
        childDegenerate,
        chartProbeRefByChartId,
        evidenceStabilityReport: args.evidenceStabilityReport,
      });

      if (relation) {
        relations.push(relation);
      }
    }

    for (const marker of args.viewModel.routeGateOverlaySummary.candidateMarkers) {
      const relation = buildRouteGateRelation({
        marker,
        sampleById,
        childSource,
        childDegenerate,
        chartProbeRefByChartId,
        evidenceStabilityReport: args.evidenceStabilityReport,
      });

      if (relation) {
        relations.push(relation);
      }
    }

    for (const marker of args.viewModel.supportRegionOverlaySummary
      .candidateMarkers) {
      const relation = buildSupportRegionRelation({
        marker,
        sampleById,
        childSource,
        childDegenerate,
        chartProbeRefByChartId,
        evidenceStabilityReport: args.evidenceStabilityReport,
      });

      if (relation) {
        relations.push(relation);
      }
    }

    relationsBySiteId.set(siteId, relations);
  }

  return relationsBySiteId;
}

function buildFeatureRelation(args: {
  marker: ProfileAwareFieldAtlasFeatureMarker;
  sampleById: Map<string, ProfileAwareFieldAtlasSurfaceSampleMarker>;
  childSource: ProfileAwareSourceEntry;
  childDegenerate: boolean;
  chartProbeRefByChartId: Map<string, string>;
  evidenceStabilityReport: ProfileAwareEvidenceStabilityReport;
}): FieldCueV0CandidateRelation | null {
  const sample = args.sampleById.get(args.marker.sampleId);

  return buildCandidateRelationFromSamples({
    childSource: args.childSource,
    childDegenerate: args.childDegenerate,
    targetId: args.marker.featureId,
    targetKind: 'feature-observation',
    relationKind: 'candidate-sample-contribution',
    samples: sample ? [sample] : [],
    chartIds: [args.marker.chartId],
    probeRef: args.marker.probeRef,
    chartProbeRefByChartId: args.chartProbeRefByChartId,
    evidenceStabilityReport: args.evidenceStabilityReport,
    extraEvidence: [
      `feature-observation-kind:${args.marker.observationKind}`,
      `feature-observation-status:${args.marker.status}`,
    ],
    extraCaveats: [
      'feature observation remains report-candidate evidence',
      'not a semantic anchor',
    ],
  });
}

function buildRouteGateRelation(args: {
  marker: ProfileAwareFieldAtlasRouteGateCandidateMarker;
  sampleById: Map<string, ProfileAwareFieldAtlasSurfaceSampleMarker>;
  childSource: ProfileAwareSourceEntry;
  childDegenerate: boolean;
  chartProbeRefByChartId: Map<string, string>;
  evidenceStabilityReport: ProfileAwareEvidenceStabilityReport;
}): FieldCueV0CandidateRelation | null {
  return buildCandidateRelationFromSamples({
    childSource: args.childSource,
    childDegenerate: args.childDegenerate,
    targetId: args.marker.candidateId,
    targetKind: 'route-gate-candidate',
    relationKind: 'candidate-route-gate-reference',
    samples: args.marker.sampleIds
      .map((sampleId) => args.sampleById.get(sampleId))
      .filter(
        (
          sample,
        ): sample is ProfileAwareFieldAtlasSurfaceSampleMarker => Boolean(sample),
      ),
    chartIds: args.marker.chartIds,
    probeRef: args.marker.probeRef,
    chartProbeRefByChartId: args.chartProbeRefByChartId,
    reliability: args.marker.reliability,
    evidenceStabilityReport: args.evidenceStabilityReport,
    extraEvidence: [
      `route-gate-kind:${args.marker.candidateKind}`,
      `route-gate-subtype:${args.marker.candidateSubtype}`,
      `route-gate-claim-status:${args.marker.claimStatus}`,
    ],
    extraCaveats: [
      'route/gate evidence remains candidate-only',
      'not confirmed route or gate',
    ],
  });
}

function buildSupportRegionRelation(args: {
  marker: ProfileAwareFieldAtlasSupportRegionCandidateMarker;
  sampleById: Map<string, ProfileAwareFieldAtlasSurfaceSampleMarker>;
  childSource: ProfileAwareSourceEntry;
  childDegenerate: boolean;
  chartProbeRefByChartId: Map<string, string>;
  evidenceStabilityReport: ProfileAwareEvidenceStabilityReport;
}): FieldCueV0CandidateRelation | null {
  return buildCandidateRelationFromSamples({
    childSource: args.childSource,
    childDegenerate: args.childDegenerate,
    targetId: args.marker.candidateId,
    targetKind: 'support-region-candidate',
    relationKind: 'candidate-support-region-reference',
    samples: args.marker.sampleIds
      .map((sampleId) => args.sampleById.get(sampleId))
      .filter(
        (
          sample,
        ): sample is ProfileAwareFieldAtlasSurfaceSampleMarker => Boolean(sample),
      ),
    chartIds: args.marker.chartIds,
    probeRef: args.marker.probeRef,
    chartProbeRefByChartId: args.chartProbeRefByChartId,
    reliability: args.marker.reliability,
    evidenceStabilityReport: args.evidenceStabilityReport,
    extraEvidence: [
      `support-region-kind:${args.marker.candidateKind}`,
      `support-kind:${args.marker.supportKind}`,
    ],
    extraCaveats: [
      'support/region evidence remains candidate-only',
      'not confirmed region or topological support',
    ],
  });
}

function buildCandidateRelationFromSamples(
  args: CandidateRelationBuildArgs,
): FieldCueV0CandidateRelation | null {
  const meaningfulEvidence = args.samples
    .map((sample) =>
      buildMeaningfulContributionEvidence(sample, args.childSource.sourceId),
    )
    .filter(
      (
        evidence,
      ): evidence is MeaningfulContributionEvidence => Boolean(evidence),
    );

  if (!meaningfulEvidence.length) {
    return null;
  }

  const dominantMatch = meaningfulEvidence.some(
    (evidence) => evidence.dominantSourceMatch,
  );
  const aboveBaselineMatch = meaningfulEvidence.some(
    (evidence) => evidence.aboveBaselineThreshold,
  );
  const sourceContributionRatio = meaningfulEvidence.reduce(
    (maxRatio, evidence) =>
      Math.max(maxRatio, evidence.sourceContributionRatio),
    0,
  );
  const sourceContributionRank = meaningfulEvidence.reduce(
    (bestRank, evidence) =>
      Math.min(bestRank, evidence.sourceContributionRank),
    Number.POSITIVE_INFINITY,
  );
  const bestEvidence =
    meaningfulEvidence.find((evidence) => evidence.dominantSourceMatch) ??
    meaningfulEvidence.find((evidence) => evidence.aboveBaselineThreshold) ??
    meaningfulEvidence.reduce((best, evidence) =>
      evidence.sourceContributionRank < best.sourceContributionRank
        ? evidence
        : best,
    );
  const sourceContributionBaseline = bestEvidence.sourceContributionBaseline;
  const meaningfulContributionRule = dominantMatch
    ? 'dominant-source-contribution'
    : aboveBaselineMatch
      ? 'source-ratio-at-least-baseline-times-1.25'
      : 'source-rank-top-3';
  const sensitivityActive = isEvidenceSensitivityActive(
    args.evidenceStabilityReport,
  );
  const relationKind = dominantMatch
    ? 'candidate-dominant-source-reference'
    : aboveBaselineMatch
      ? args.relationKind
      : 'candidate-reference';
  const relationMaturity: FieldCueV0RelationMaturity =
    dominantMatch || aboveBaselineMatch
      ? 'candidate-relation'
      : 'candidate-reference';
  const sampleIds = meaningfulEvidence.map((evidence) => evidence.sample.sampleId);
  const chartIds = uniqueStrings([
    ...args.chartIds,
    ...meaningfulEvidence.map((evidence) => evidence.sample.chartId),
  ]);
  const sampleProbeRefs = uniqueStrings(
    meaningfulEvidence.map((evidence) => evidence.sample.probeRef),
  );
  const chartProbeRefs = uniqueStrings(
    chartIds
      .map((chartId) => args.chartProbeRefByChartId.get(chartId))
      .filter((probeRef): probeRef is string => Boolean(probeRef)),
  );

  return {
    targetId: args.targetId,
    targetKind: args.targetKind,
    relationKind,
    relationMaturity,
    participationStatus: args.childDegenerate
      ? 'degenerate'
      : sensitivityActive
        ? 'sensitive'
        : 'candidate-only',
    evidenceBasis: [
      `child-source:${args.childSource.sourceId}`,
      `meaningful-sample-count:${meaningfulEvidence.length}`,
      `source-contribution-rank:${sourceContributionRank}`,
      `contribution-baseline:${formatNumber(sourceContributionBaseline)}`,
      `contribution-rule:${meaningfulContributionRule}`,
      ...(dominantMatch ? ['dominant-source-contribution'] : []),
      ...(args.extraEvidence ?? []),
    ],
    sourceContributionRatio,
    sourceContributionRank,
    sourceContributionBaseline,
    meaningfulContributionRule,
    ...(args.probeRef ? { probeRef: args.probeRef } : {}),
    ...(sampleProbeRefs.length ? { sampleProbeRefs } : {}),
    ...(chartProbeRefs.length ? { chartProbeRefs } : {}),
    sampleIds,
    chartIds,
    reliability: sensitivityActive
      ? 'sensitive'
      : normalizeCandidateReliability(args.reliability, dominantMatch),
    caveats: [
      relationMaturity === 'candidate-relation'
        ? 'candidate relation only'
        : 'candidate reference only',
      'not a field-semantic role profile',
      'not mature field participation',
      'not semantic naming',
      'not topology',
      ...(args.childDegenerate ? ['child source is degeneracy-marked'] : []),
      ...(args.extraCaveats ?? []),
    ],
  };
}

function buildMeaningfulContributionEvidence(
  sample: ProfileAwareFieldAtlasSurfaceSampleMarker,
  childSourceId: string,
): MeaningfulContributionEvidence | null {
  const contributionCount =
    sample.contributionCount > 0
      ? sample.contributionCount
      : sample.contributionRatios.length;

  if (contributionCount <= 0) {
    return null;
  }

  const sourceContribution = sample.contributionRatios.find(
    (ratio) => ratio.sourceId === childSourceId,
  );

  if (!sourceContribution || sourceContribution.value <= 0) {
    return null;
  }

  const sortedContributions = [...sample.contributionRatios].sort(
    (left, right) => right.value - left.value,
  );
  const sourceContributionIndex = sortedContributions.findIndex(
    (ratio) => ratio.sourceId === childSourceId,
  );

  if (sourceContributionIndex < 0) {
    return null;
  }

  const sourceContributionRank = sourceContributionIndex + 1;
  const sourceContributionBaseline = 1 / contributionCount;
  const dominantSourceMatch =
    sample.dominantContributionSourceId === childSourceId;
  const aboveBaselineThreshold =
    sourceContribution.value >= sourceContributionBaseline * 1.25;
  const topThreeRank = sourceContributionRank <= 3;

  if (!dominantSourceMatch && !aboveBaselineThreshold && !topThreeRank) {
    return null;
  }

  return {
    sample,
    sourceContributionRatio: sourceContribution.value,
    contributionCount,
    sourceContributionBaseline,
    sourceContributionRank,
    dominantSourceMatch,
    aboveBaselineThreshold,
    topThreeRank,
    rule: dominantSourceMatch
      ? 'dominant-source-contribution'
      : aboveBaselineThreshold
        ? 'source-ratio-at-least-baseline-times-1.25'
        : 'source-rank-top-3',
  };
}

function buildCandidateFieldWorldAxis(
  candidateRelations: FieldCueV0CandidateRelation[],
): FieldCueV0CandidateFieldWorldAxis {
  return {
    candidateRelations,
    candidateRelationCount: candidateRelations.filter(
      (relation) => relation.relationMaturity === 'candidate-relation',
    ).length,
    candidateReferenceCount: candidateRelations.length,
    featureObservationReferenceCount: candidateRelations.filter(
      (relation) => relation.targetKind === 'feature-observation',
    ).length,
    routeGateCandidateReferenceCount: candidateRelations.filter(
      (relation) => relation.targetKind === 'route-gate-candidate',
    ).length,
    supportRegionCandidateReferenceCount: candidateRelations.filter(
      (relation) => relation.targetKind === 'support-region-candidate',
    ).length,
    relationMaturityStatuses: uniqueStrings(
      candidateRelations.map((relation) => relation.relationMaturity),
    ) as FieldCueV0RelationMaturity[],
    unsupportedCaveats: candidateRelations.length
      ? []
      : [
          'No explicit sample-contribution candidate field-world relation was found for this child under FieldCueV0.',
          'Outward field-world participation should be treated as weak or unsupported for naming pressure.',
        ],
  };
}

function pickInheritanceStatus(args: {
  childContext: TetrahedralAmboChildContext | undefined;
  childSource: ProfileAwareSourceEntry | undefined;
  derivedEmissionTuple: FieldCueV0EmissionTuple | undefined;
  fallbackKind: string | undefined;
  unresolved: boolean;
  degeneracyStatuses: ChildProfileDegeneracyStatus[];
}): FieldCueV0InheritanceStatus {
  if (!args.childContext || !args.childSource) {
    return 'unsupported';
  }

  if (args.fallbackKind || args.childSource.sourceKind === 'generated-child-fallback') {
    return 'fallback';
  }

  if (
    args.unresolved ||
    args.childSource.sourceKind === 'generated-child-unresolved' ||
    !args.derivedEmissionTuple
  ) {
    return 'unresolved';
  }

  if (hasMeaningfulDegeneracy(args.degeneracyStatuses)) {
    return 'degenerate';
  }

  return 'complete';
}

function pickParticipationStatus(args: {
  childSource: ProfileAwareSourceEntry | undefined;
  inheritanceAxis: FieldCueV0InheritanceAxis;
  candidateRelations: FieldCueV0CandidateRelation[];
  warningStatuses: FieldCueV0ParticipationStatus[];
  evidenceStabilityReport: ProfileAwareEvidenceStabilityReport;
}): FieldCueV0ParticipationStatus {
  if (!args.childSource || args.inheritanceAxis.inheritanceStatus === 'unsupported') {
    return 'unsupported';
  }

  if (
    args.childSource.sourceKind === 'generated-child-unresolved' ||
    args.inheritanceAxis.inheritanceStatus === 'unresolved'
  ) {
    return 'unsupported';
  }

  if (
    args.childSource.sourceKind === 'generated-child-fallback' ||
    args.inheritanceAxis.inheritanceStatus === 'fallback'
  ) {
    return args.candidateRelations.length ? 'unsupported' : 'not-applicable';
  }

  if (args.warningStatuses.includes('degenerate')) {
    return 'degenerate';
  }

  if (isEvidenceSensitivityActive(args.evidenceStabilityReport)) {
    return 'sensitive';
  }

  if (isEvidenceSaturationActive(args.evidenceStabilityReport)) {
    return 'saturated';
  }

  if (args.candidateRelations.length > 0) {
    return 'candidate-only';
  }

  if (args.childSource.readiness === 'field-ready') {
    return 'weak';
  }

  return 'not-yet-computed';
}

function buildWarningStatuses(args: {
  childSource: ProfileAwareSourceEntry | undefined;
  inheritanceAxis: FieldCueV0InheritanceAxis;
  candidateRelations: FieldCueV0CandidateRelation[];
  evidenceStabilityReport: ProfileAwareEvidenceStabilityReport;
}): FieldCueV0ParticipationStatus[] {
  const statuses: FieldCueV0ParticipationStatus[] = [];

  if (!args.childSource) {
    statuses.push('unsupported');
  }

  if (
    args.inheritanceAxis.inheritanceStatus === 'fallback' ||
    args.inheritanceAxis.inheritanceStatus === 'unresolved'
  ) {
    statuses.push('unsupported');
  }

  if (hasMeaningfulDegeneracy(args.inheritanceAxis.degeneracyStatuses)) {
    statuses.push('degenerate');
  }

  if (isEvidenceSensitivityActive(args.evidenceStabilityReport)) {
    statuses.push('sensitive');
  }

  if (isEvidenceSaturationActive(args.evidenceStabilityReport)) {
    statuses.push('saturated');
  }

  if (
    args.candidateRelations.length > 0 &&
    (statuses.includes('degenerate') ||
      statuses.includes('sensitive') ||
      statuses.includes('saturated'))
  ) {
    statuses.push('misleading-risk');
  }

  if (!args.candidateRelations.length && args.childSource?.readiness === 'field-ready') {
    statuses.push('weak');
  }

  return uniqueStrings(statuses) as FieldCueV0ParticipationStatus[];
}

function buildWarnings(args: {
  participationStatus: FieldCueV0ParticipationStatus;
  warningStatuses: FieldCueV0ParticipationStatus[];
  inheritanceAxis: FieldCueV0InheritanceAxis;
  candidateFieldWorldAxis: FieldCueV0CandidateFieldWorldAxis;
}): string[] {
  const warnings = [
    `Primary field participation status: ${args.participationStatus}.`,
  ];

  if (args.inheritanceAxis.inheritanceStatus === 'fallback') {
    warnings.push('Child source uses fallback inheritance; do not treat emission as fully derived.');
  }

  if (args.inheritanceAxis.inheritanceStatus === 'unresolved') {
    warnings.push('Child source inheritance is unresolved under the active source policy.');
  }

  if (args.warningStatuses.includes('degenerate')) {
    warnings.push('Child source is degeneracy-marked; do not overread antipodal or sibling distinction.');
  }

  if (args.warningStatuses.includes('sensitive')) {
    warnings.push('Candidate evidence is sensitivity-marked across bounded sampling or profile variants.');
  }

  if (args.warningStatuses.includes('saturated')) {
    warnings.push('Candidate buckets reached a configured maximum; absence or count should not be overread.');
  }

  if (args.warningStatuses.includes('misleading-risk')) {
    warnings.push('Candidate pressure exists with warning states; treat it as a prompt, not a conclusion.');
  }

  if (args.candidateFieldWorldAxis.candidateReferenceCount === 0) {
    warnings.push('No explicit child-to-candidate sample-contribution relation was found.');
  }

  return warnings;
}

function buildNamingQuestions(args: {
  participationStatus: FieldCueV0ParticipationStatus;
  warningStatuses: FieldCueV0ParticipationStatus[];
  candidateFieldWorldAxis: FieldCueV0CandidateFieldWorldAxis;
  inheritanceAxis: FieldCueV0InheritanceAxis;
}): string[] {
  const questions = [
    "Does this site's inherited source signature matter more than its outward field-world participation?",
  ];

  if (args.candidateFieldWorldAxis.candidateReferenceCount > 0) {
    questions.push(
      'Does candidate field pressure sharpen the site, or does it warn against overreading?',
    );
    questions.push(
      'Should this site be suspended because field participation is only candidate-level?',
    );
  } else {
    questions.push(
      'Does the absence of explicit candidate participation make the site weak, unsupported, or simply not yet computed?',
    );
  }

  if (
    args.warningStatuses.includes('degenerate') ||
    args.inheritanceAxis.inheritanceStatus === 'degenerate'
  ) {
    questions.push(
      'Does the antipodal echo matter for naming, or is it a degeneracy of the active profile system?',
    );
  }

  if (args.warningStatuses.includes('sensitive')) {
    questions.push(
      'Should naming wait because the candidate evidence is sensitivity-marked?',
    );
  }

  if (args.warningStatuses.includes('saturated')) {
    questions.push(
      'Does candidate saturation hide useful contrast or only warn against count-based interpretation?',
    );
  }

  questions.push(
    `Should the human name, reject, suspend, or revise this site with participation status ${args.participationStatus}?`,
  );

  return uniqueStrings(questions);
}

function buildForbiddenConclusions(): string[] {
  return [
    'This cue does not name the generated site.',
    'Candidate references are not mature field participation.',
    'No confirmed gate, route, loop, vortex, region, or phase-transformation ecology is claimed.',
    'This cue is not topology, packet writing, or Shape mutation.',
    'This one-Ambo cue is not a general field-layer claim.',
  ];
}

function buildFieldPressureSummary(args: {
  participationStatus: FieldCueV0ParticipationStatus;
  inheritanceAxis: FieldCueV0InheritanceAxis;
  candidateFieldWorldAxis: FieldCueV0CandidateFieldWorldAxis;
}): string {
  if (args.participationStatus === 'unsupported') {
    return 'Child source inheritance or runtime support is unavailable; FieldCueV0 cannot supply useful outward field-world participation.';
  }

  if (args.participationStatus === 'not-applicable') {
    return 'Child source inheritance is fallback-bound; outward field-world participation is not applicable under FieldCueV0.';
  }

  if (args.participationStatus === 'degenerate') {
    return "This child's derived source status is degenerate; do not overread antipodal distinction.";
  }

  if (args.participationStatus === 'sensitive') {
    return 'This child has candidate pressure references, but evidence stability is sensitive.';
  }

  if (args.participationStatus === 'saturated') {
    return 'This child has candidate pressure references, but candidate buckets are saturated.';
  }

  if (args.participationStatus === 'candidate-only') {
    return 'Child source inheritance is available; outward field-world participation is candidate-only.';
  }

  if (args.participationStatus === 'weak') {
    return 'Child source inheritance is available, but no useful candidate field-world participation was found for this child under V0.';
  }

  if (args.inheritanceAxis.inheritanceStatus === 'complete') {
    return 'Child source inheritance is available; FieldCueV0 preserves candidate-level pressure without naming the site.';
  }

  return 'FieldCueV0 preserves available inheritance evidence and reports unresolved field-world participation without naming the site.';
}

function buildSummary(cues: FieldCueV0[]): FieldCueV0Summary {
  const participationStatusCounts = createParticipationStatusCounts();
  const candidateReferenceCountsByKind = createCandidateReferenceCountsByKind();

  for (const cue of cues) {
    participationStatusCounts[cue.participationStatus] += 1;

    for (const relation of cue.candidateFieldWorldAxis.candidateRelations) {
      candidateReferenceCountsByKind[relation.targetKind] += 1;
    }
  }

  return {
    cueCount: cues.length,
    participationStatusCounts,
    degeneracyCount: cues.filter((cue) =>
      cue.warningStatuses.includes('degenerate'),
    ).length,
    candidateReferenceCountsByKind,
    sensitiveCueCount: cues.filter((cue) =>
      cue.warningStatuses.includes('sensitive'),
    ).length,
    saturatedCueCount: cues.filter((cue) =>
      cue.warningStatuses.includes('saturated'),
    ).length,
    misleadingRiskCueCount: cues.filter((cue) =>
      cue.warningStatuses.includes('misleading-risk'),
    ).length,
  };
}

function buildDegenerateSiteIdSet(
  report: FieldSourceChildDegeneracyReport,
): Set<string> {
  return new Set(
    report.observations
      .filter((observation) => hasMeaningfulDegeneracy(observation.statuses))
      .map((observation) => observation.childVertexId),
  );
}

function hasMeaningfulDegeneracy(
  statuses: readonly ChildProfileDegeneracyStatus[],
): boolean {
  return statuses.some((status) => status !== 'nondegenerate');
}

function isEvidenceSensitivityActive(
  report: ProfileAwareEvidenceStabilityReport,
): boolean {
  return (
    report.sensitivitySummary.samplingSensitive ||
    report.sensitivitySummary.profileSetupSensitive
  );
}

function isEvidenceSaturationActive(
  report: ProfileAwareEvidenceStabilityReport,
): boolean {
  return report.sensitivitySummary.maxBucketSaturation.anyMaxBucketSaturated;
}

function normalizeCandidateReliability(
  reliability: string | undefined,
  dominantMatch: boolean,
): FieldCueV0CandidateReliability {
  if (dominantMatch) {
    return 'medium';
  }

  if (reliability === 'bounded-diagnostic') {
    return 'medium';
  }

  if (reliability === 'low-confidence') {
    return 'low';
  }

  return 'unknown';
}

function summarizeTuple(args: {
  emissionTuple: FieldCueV0EmissionTuple | undefined;
  fallbackKind: string | undefined;
  fallbackReason: string | undefined;
  fieldReady: boolean;
}): string {
  if (args.emissionTuple) {
    return `field-ready tuple amplitude=${formatNumber(args.emissionTuple.amplitude)}, waveNumber=${formatNumber(args.emissionTuple.waveNumber)}, phase=${formatNumber(args.emissionTuple.phase)}, attenuation=${formatNumber(args.emissionTuple.attenuation)}`;
  }

  if (args.fallbackKind) {
    return `fallback ${args.fallbackKind}: ${args.fallbackReason ?? 'no reason provided'}`;
  }

  return args.fieldReady
    ? 'field-ready source without exposed tuple'
    : 'unresolved or unsupported source; no emitted field-ready tuple';
}

function copyEmissionTuple(tuple: FieldCueV0EmissionTuple): FieldCueV0EmissionTuple {
  return {
    amplitude: tuple.amplitude,
    waveNumber: tuple.waveNumber,
    phase: tuple.phase,
    attenuation: tuple.attenuation,
  };
}

function createParticipationStatusCounts(): Record<
  FieldCueV0ParticipationStatus,
  number
> {
  return {
    available: 0,
    'candidate-only': 0,
    weak: 0,
    saturated: 0,
    sensitive: 0,
    degenerate: 0,
    unsupported: 0,
    'misleading-risk': 0,
    'not-yet-computed': 0,
    'not-applicable': 0,
  };
}

function createCandidateReferenceCountsByKind(): Record<
  FieldCueV0TargetKind,
  number
> {
  return {
    'feature-observation': 0,
    'route-gate-candidate': 0,
    'support-region-candidate': 0,
  };
}

function uniqueStrings<T extends string>(values: readonly T[]): T[] {
  return Array.from(new Set(values));
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return String(value);
  }

  return Number.parseFloat(value.toFixed(6)).toString();
}

import {
  buildStructuredSourceStateDiagnosticV0Report,
  type StructuredSourceStateGeneratedChildState,
} from './structuredSourceStateDiagnosticV0';
import {
  buildStructuredSourceStateEmittedRecoveryV0Report,
  type StructuredSourceStateComparedRegimeReport,
  type StructuredSourceStateDetectorInput,
  type StructuredSourceStateHiddenTruth,
} from './structuredSourceStateEmittedRecoveryV0';
import { buildStructuredSourceStateFieldBehaviorRecoveryV0Report } from './structuredSourceStateFieldBehaviorRecoveryV0';
import { buildStructuredSourceStateCandidateReductionLawComparisonV0Report } from './structuredSourceStateCandidateReductionLawComparisonV0';

export type StructuredSourceStateMultiProjectionStructuralChannelV0Method =
  'structured-source-state-multi-projection-structural-channel-v0';
export type StructuredSourceStateMultiProjectionStructuralChannelV0Scope =
  'multi-projection-structural-channel-diagnostic-only';
export type StructuredSourceStateMultiProjectionStructuralChannelParentGate =
  'Gate C.4L-D3';
export type StructuredSourceStateMultiProjectionStructuralChannelDesignGate =
  'Gate C.4L-D2';
export type StructuredSourceStateMultiProjectionStructuralChannelComparisonGate =
  'Gate C.4L-D1';
export type StructuredSourceStateMultiProjectionStructuralChannelFailureGate =
  'Gate C.4';
export type StructuredSourceStateMultiProjectionStructuralChannelRegimeId =
  'structured-source-state-antipodal-covariant-v0';
export type StructuredSourceStateMultiProjectionModelId =
  'multi-projection-source-state-v0';
export type StructuredSourceStateMultiProjectionCandidateLawId =
  'c4l-s2-structural-carrier-split-v0';
export type StructuredSourceStateMultiProjectionSemanticStatus =
  'not-semantic-naming';
export type StructuredSourceStateMultiProjectionTopologyStatus =
  'not-topology-workspace';
export type StructuredSourceStateMultiProjectionPacketWriteStatus =
  'not-packet-writing';
export type StructuredSourceStateMultiProjectionShapeMutationStatus =
  'not-shape-mutation';
export type StructuredSourceStateMultiProjectionOperationRegistryStatus =
  'not-operation-registry-work';
export type StructuredSourceStateMultiProjectionUiExposureStatus =
  'not-ui-work';
export type StructuredSourceStateMultiProjectionDiagnosticIntegrityStatus =
  | 'pass'
  | 'fail';
export type StructuredSourceStateMultiProjectionRecoveryStatus =
  | 'pass'
  | 'fail'
  | 'ambiguous';
export type StructuredSourceStateMultiProjectionStructuralChannelCandidateStatus =
  | 'structural-channel-witness-supported'
  | 'structural-channel-witness-failed'
  | 'structural-channel-witness-ambiguous';
export type StructuredSourceStateMultiProjectionRecommendedNextGate =
  | 'Gate C.4L-D4'
  | 'Gate C.4L-D3-review'
  | 'Gate C.4L-revise';
export type StructuredSourceStateRelationVisibilityStatus =
  | 'raw-field-visible'
  | 'propagation-transformed'
  | 'depropagation-recoverable'
  | 'structural-channel-visible'
  | 'source-state-only'
  | 'tuple-projection-lost'
  | 'misleading-if-read-as-raw-field'
  | 'unsupported';
export type StructuredSourceStateProjectionAnonymizationStatus =
  | 'anonymized'
  | 'leaked-label';
export type StructuredSourceStateProjectionDetectorCleanlinessStatus =
  | 'clean'
  | 'leaked';

type EmittedTuple = NonNullable<StructuredSourceStateDetectorInput['emittedTuple']>;
type CandidateComparisonReport = ReturnType<
  typeof buildStructuredSourceStateCandidateReductionLawComparisonV0Report
>;
type CandidateComparisonCandidateReport =
  CandidateComparisonReport['candidateReports'][number];

export interface StructuredSourceStatePropagationProjection {
  sourceStateId: string;
  childSiteId: string;
  sourceId: string;
  anonymousSourceId: string;
  amplitude: number;
  carrierWaveNumber: number;
  carrierPhase: number;
  attenuation: number;
  projectionKind: 'propagation-projection';
  rawPropagationStatus: 'field-atlas-ready' | 'missing-or-non-finite';
  rawFieldComputationBasis: 'propagation-projection-only';
}

export interface StructuredSourceStateStructuralProjection {
  sourceStateId: string;
  childSiteId: string;
  anonymousSourceId: string;
  edgeStateId: string;
  complementEdgeStateId: string;
  antipodalChildSiteId: string;
  axisPairId: string;
  structuralPhase: number;
  structuralPolarityPhase: number;
  polarity: 'representative-pole' | 'complement-pole';
  starSign: 1 | -1;
  projectionKind: 'structural-projection';
  structuralProjectionStatus:
    | 'declared-structural-projection-ready'
    | 'missing-structural-relation';
}

export interface StructuredSourceStateGeneratedChildProjection {
  sourceStateId: string;
  childSiteId: string;
  anonymousSourceId: string;
  propagationProjection: StructuredSourceStatePropagationProjection;
  structuralProjection: StructuredSourceStateStructuralProjection;
}

export interface StructuredSourceStateStructuralOperationsCapsule {
  complementOperationId: 'tetrahedral-edge-complement-v0';
  complementPairs: Array<{
    leftEdgeStateId: string;
    rightEdgeStateId: string;
    leftChildSiteId: string;
    rightChildSiteId: string;
  }>;
  sourceStateInvolutionFormula: 'sigma(state_edge) = state_complementEdge';
  structuralComparisonBasis: 'declared-structural-projection-comparison-v0';
  recoveryBasis: 'structural-channel-direct-comparison-v0';
  semanticStatus: 'not-semantic-naming';
  rawFieldBehaviorStatus: 'not-raw-propagated-field-behavior';
}

export interface StructuredSourceStateStructuralChannelContributionInput {
  anonymousSourceId: string;
  re: number;
  im: number;
  magnitude: number;
  ratio: number;
}

export interface StructuredSourceStateStructuralChannelSampleInput {
  anonymousStructuralSampleId: string;
  aggregateStructuralChannel: {
    re: number;
    im: number;
    intensity: number;
    phase: number;
  };
  contributions: StructuredSourceStateStructuralChannelContributionInput[];
}

export interface StructuredSourceStateStructuralChannelDetectorInput {
  candidateLawId: StructuredSourceStateMultiProjectionCandidateLawId;
  recoveryBasis: 'structural-channel-direct-comparison-v0';
  anonymousSourceIds: string[];
  structuralSamples: StructuredSourceStateStructuralChannelSampleInput[];
}

export interface StructuredSourceStateStructuralChannelPairScore {
  leftAnonymousSourceId: string;
  rightAnonymousSourceId: string;
  pairScore: number;
  recoveredTruthPair: boolean;
}

export interface StructuredSourceStateStructuralChannelRecovery {
  detectorKind: 'structural-channel-direct-comparison';
  recoveryBasis: 'structural-channel-direct-comparison-v0';
  inferredPairs: Array<[string, string]>;
  pairScores: StructuredSourceStateStructuralChannelPairScore[];
  totalScore: number;
  confidence: number;
  recoveredTruthPairCount: number;
  falsePositiveCount: number;
  ambiguityCount: number;
  recoveryStatus: StructuredSourceStateMultiProjectionRecoveryStatus;
}

export interface StructuredSourceStateAntipodalRelationVisibilityRow {
  relationId: string;
  leftChildSiteId: string;
  rightChildSiteId: string;
  sourceStateRelation: 'antipodal-opposition';
  rawFieldVisibilityStatus: StructuredSourceStateRelationVisibilityStatus;
  structuralChannelVisibilityStatus: StructuredSourceStateRelationVisibilityStatus;
  depropagationVisibilityStatus: StructuredSourceStateRelationVisibilityStatus;
  relationVisibilityStatuses: StructuredSourceStateRelationVisibilityStatus[];
  visibilitySummary: string;
  caveats: string[];
}

export interface StructuredSourceStateMultiProjectionUpstreamC4LD1Status {
  r4s1RawBehaviorStatus: StructuredSourceStateMultiProjectionRecoveryStatus;
  r4s1RawRecoveredTruthPairCount: number;
  c4lO1Status: StructuredSourceStateMultiProjectionRecoveryStatus;
  c4lO1RecoveredTruthPairCount: number;
  c4lS1StructuralChannelBasisStatus: StructuredSourceStateMultiProjectionRecoveryStatus;
  c4lS1RecoveredTruthPairCount: number;
  c4lS1FalsePositiveCount: number;
  c4lS1AmbiguityCount: number;
  candidateComparisonStatus: string;
  strongestCandidateLawId: string | null;
  strongestCandidateBasis: string | null;
  recommendedNextGate: string;
}

export type StructuredSourceStateMultiProjectionIssueCode =
  | 'missing-structured-source-state-report'
  | 'missing-generated-child-state'
  | 'missing-propagation-projection'
  | 'missing-structural-projection'
  | 'missing-relation-visibility-row'
  | 'detector-input-leaks-source-position'
  | 'detector-input-leaks-probe-position'
  | 'detector-input-leaks-emitted-tuple'
  | 'detector-input-leaks-label'
  | 'detector-input-leaks-hidden-truth'
  | 'detector-input-leaks-axis-pair'
  | 'non-finite-structural-channel-score'
  | 'no-structural-channel-pair-scores'
  | 'fieldcue-import-detected'
  | 'generated-site-reading-import-detected'
  | 'operation-registry-contaminated';

export interface StructuredSourceStateMultiProjectionIssue {
  code: StructuredSourceStateMultiProjectionIssueCode;
  message: string;
  sourceStateId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface StructuredSourceStateMultiProjectionStructuralChannelV0Report {
  method: StructuredSourceStateMultiProjectionStructuralChannelV0Method;
  diagnosticScope: StructuredSourceStateMultiProjectionStructuralChannelV0Scope;
  parentGate: StructuredSourceStateMultiProjectionStructuralChannelParentGate;
  upstreamDesignGate: StructuredSourceStateMultiProjectionStructuralChannelDesignGate;
  upstreamComparisonGate: StructuredSourceStateMultiProjectionStructuralChannelComparisonGate;
  upstreamFailureGate: StructuredSourceStateMultiProjectionStructuralChannelFailureGate;
  sourceStateRegimeId: StructuredSourceStateMultiProjectionStructuralChannelRegimeId;
  projectionModelId: StructuredSourceStateMultiProjectionModelId;
  candidateLawId: StructuredSourceStateMultiProjectionCandidateLawId;
  semanticStatus: StructuredSourceStateMultiProjectionSemanticStatus;
  topologyStatus: StructuredSourceStateMultiProjectionTopologyStatus;
  packetWriteStatus: StructuredSourceStateMultiProjectionPacketWriteStatus;
  shapeMutationStatus: StructuredSourceStateMultiProjectionShapeMutationStatus;
  operationRegistryStatus: StructuredSourceStateMultiProjectionOperationRegistryStatus;
  uiExposureStatus: StructuredSourceStateMultiProjectionUiExposureStatus;
  upstreamC4LD1Status: StructuredSourceStateMultiProjectionUpstreamC4LD1Status;
  generatedChildProjections: StructuredSourceStateGeneratedChildProjection[];
  propagationProjections: StructuredSourceStatePropagationProjection[];
  structuralProjections: StructuredSourceStateStructuralProjection[];
  structuralOperations: StructuredSourceStateStructuralOperationsCapsule;
  structuralChannelDetectorInput: StructuredSourceStateStructuralChannelDetectorInput;
  structuralChannelDetectorInputAnonymizationStatus: StructuredSourceStateProjectionAnonymizationStatus;
  structuralChannelDetectorInputCleanlinessStatus: StructuredSourceStateProjectionDetectorCleanlinessStatus;
  c4lS2StructuralChannelRecovery: StructuredSourceStateStructuralChannelRecovery;
  recoveredTruthPairCount: number;
  falsePositiveCount: number;
  ambiguityCount: number;
  recoveryStatus: StructuredSourceStateMultiProjectionRecoveryStatus;
  structuralChannelCandidateStatus: StructuredSourceStateMultiProjectionStructuralChannelCandidateStatus;
  antipodalRelationVisibilityRows: StructuredSourceStateAntipodalRelationVisibilityRow[];
  recommendedNextGate: StructuredSourceStateMultiProjectionRecommendedNextGate;
  boundaryStatus: {
    fieldCueV0Status: 'blocked';
    generatedSiteReadingV0Status: 'blocked';
    gateC5Status: 'not-authorized-by-this-diagnostic';
    reductionLawAdoptionStatus: 'not-adopted';
    fieldAtlasMutationStatus: 'not-mutated';
    fieldAtlasSourcePolicyMutationStatus: 'not-mutated';
    operationRegistryStatus: StructuredSourceStateMultiProjectionOperationRegistryStatus;
  };
  diagnosticIntegrityStatus: StructuredSourceStateMultiProjectionDiagnosticIntegrityStatus;
  integrityIssueCount: number;
  integrityIssues: StructuredSourceStateMultiProjectionIssue[];
  ok: boolean;
}

const METHOD: StructuredSourceStateMultiProjectionStructuralChannelV0Method =
  'structured-source-state-multi-projection-structural-channel-v0';
const DIAGNOSTIC_SCOPE: StructuredSourceStateMultiProjectionStructuralChannelV0Scope =
  'multi-projection-structural-channel-diagnostic-only';
const PARENT_GATE: StructuredSourceStateMultiProjectionStructuralChannelParentGate =
  'Gate C.4L-D3';
const UPSTREAM_DESIGN_GATE: StructuredSourceStateMultiProjectionStructuralChannelDesignGate =
  'Gate C.4L-D2';
const UPSTREAM_COMPARISON_GATE: StructuredSourceStateMultiProjectionStructuralChannelComparisonGate =
  'Gate C.4L-D1';
const UPSTREAM_FAILURE_GATE: StructuredSourceStateMultiProjectionStructuralChannelFailureGate =
  'Gate C.4';
const SOURCE_STATE_REGIME_ID: StructuredSourceStateMultiProjectionStructuralChannelRegimeId =
  'structured-source-state-antipodal-covariant-v0';
const PROJECTION_MODEL_ID: StructuredSourceStateMultiProjectionModelId =
  'multi-projection-source-state-v0';
const CANDIDATE_LAW_ID: StructuredSourceStateMultiProjectionCandidateLawId =
  'c4l-s2-structural-carrier-split-v0';
const SEMANTIC_STATUS: StructuredSourceStateMultiProjectionSemanticStatus =
  'not-semantic-naming';
const TOPOLOGY_STATUS: StructuredSourceStateMultiProjectionTopologyStatus =
  'not-topology-workspace';
const PACKET_WRITE_STATUS: StructuredSourceStateMultiProjectionPacketWriteStatus =
  'not-packet-writing';
const SHAPE_MUTATION_STATUS: StructuredSourceStateMultiProjectionShapeMutationStatus =
  'not-shape-mutation';
const OPERATION_REGISTRY_STATUS: StructuredSourceStateMultiProjectionOperationRegistryStatus =
  'not-operation-registry-work';
const UI_EXPOSURE_STATUS: StructuredSourceStateMultiProjectionUiExposureStatus =
  'not-ui-work';
const R4S1_CANDIDATE_LAW_ID =
  'r4-s1-harmonic-wave-number-star-sign-phase-v0';
const C4L_O1_CANDIDATE_LAW_ID =
  'c4l-o1-axis-common-carrier-structural-phase-v0';
const C4L_S1_CANDIDATE_LAW_ID =
  'c4l-s1-structural-propagation-split-v0';
const STRUCTURAL_SAMPLE_IDS = ['Q0', 'Q1', 'Q2'] as const;

export function buildStructuredSourceStateMultiProjectionStructuralChannelV0Report(): StructuredSourceStateMultiProjectionStructuralChannelV0Report {
  const structuredSourceStateReport = buildStructuredSourceStateDiagnosticV0Report();
  const emittedRecoveryReport = buildStructuredSourceStateEmittedRecoveryV0Report();
  const fieldBehaviorRecoveryReport =
    buildStructuredSourceStateFieldBehaviorRecoveryV0Report();
  const candidateComparisonReport =
    buildStructuredSourceStateCandidateReductionLawComparisonV0Report();
  const r4s1EmittedRegime = emittedRecoveryReport.comparedRegimes.find(
    (regime) => regime.regimeId === R4S1_CANDIDATE_LAW_ID,
  );
  const projectionContext = buildProjectionContext(r4s1EmittedRegime);
  const generatedChildProjections =
    structuredSourceStateReport.generatedChildStates.map((state) =>
      buildGeneratedChildProjection(state, projectionContext),
    );
  const propagationProjections = generatedChildProjections.map(
    (projection) => projection.propagationProjection,
  );
  const structuralProjections = generatedChildProjections.map(
    (projection) => projection.structuralProjection,
  );
  const structuralOperations = buildStructuralOperations(
    structuredSourceStateReport.complementAxes,
  );
  const structuralChannelDetectorInput = buildStructuralChannelDetectorInput(
    structuralProjections,
  );
  const detectorInputAnonymizationStatus =
    structuralChannelDetectorInputIsAnonymized(structuralChannelDetectorInput)
      ? 'anonymized'
      : 'leaked-label';
  const detectorInputCleanlinessStatus =
    structuralChannelDetectorInputIsClean(structuralChannelDetectorInput)
      ? 'clean'
      : 'leaked';
  const c4lS2StructuralChannelRecovery = detectStructuralChannelPairs(
    structuralChannelDetectorInput,
    projectionContext.hiddenTruth,
  );
  const structuralChannelCandidateStatus = pickStructuralChannelCandidateStatus(
    c4lS2StructuralChannelRecovery,
    detectorInputCleanlinessStatus,
  );
  const upstreamC4LD1Status = buildUpstreamC4LD1Status(candidateComparisonReport);
  const antipodalRelationVisibilityRows = buildAntipodalRelationVisibilityRows({
    axes: structuredSourceStateReport.complementAxes,
    structuralChannelRecovery: c4lS2StructuralChannelRecovery,
    structuralProjections,
    upstreamC4LD1Status,
  });
  const recommendedNextGate = pickRecommendedNextGate(
    structuralChannelCandidateStatus,
  );
  const integrityIssues = buildIntegrityIssues({
    structuredSourceStateReportOk: structuredSourceStateReport.ok,
    generatedChildProjections,
    structuralOperations,
    structuralChannelDetectorInput,
    detectorInputAnonymizationStatus,
    detectorInputCleanlinessStatus,
    c4lS2StructuralChannelRecovery,
    relationVisibilityRows: antipodalRelationVisibilityRows,
  });
  const diagnosticIntegrityStatus: StructuredSourceStateMultiProjectionDiagnosticIntegrityStatus =
    integrityIssues.length === 0 ? 'pass' : 'fail';

  return {
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    parentGate: PARENT_GATE,
    upstreamDesignGate: UPSTREAM_DESIGN_GATE,
    upstreamComparisonGate: UPSTREAM_COMPARISON_GATE,
    upstreamFailureGate: UPSTREAM_FAILURE_GATE,
    sourceStateRegimeId: SOURCE_STATE_REGIME_ID,
    projectionModelId: PROJECTION_MODEL_ID,
    candidateLawId: CANDIDATE_LAW_ID,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    shapeMutationStatus: SHAPE_MUTATION_STATUS,
    operationRegistryStatus: OPERATION_REGISTRY_STATUS,
    uiExposureStatus: UI_EXPOSURE_STATUS,
    upstreamC4LD1Status: {
      ...upstreamC4LD1Status,
      r4s1RawBehaviorStatus:
        fieldBehaviorRecoveryReport.r4s1FieldBehaviorRecoveryStatus,
    },
    generatedChildProjections,
    propagationProjections,
    structuralProjections,
    structuralOperations,
    structuralChannelDetectorInput,
    structuralChannelDetectorInputAnonymizationStatus:
      detectorInputAnonymizationStatus,
    structuralChannelDetectorInputCleanlinessStatus:
      detectorInputCleanlinessStatus,
    c4lS2StructuralChannelRecovery,
    recoveredTruthPairCount:
      c4lS2StructuralChannelRecovery.recoveredTruthPairCount,
    falsePositiveCount: c4lS2StructuralChannelRecovery.falsePositiveCount,
    ambiguityCount: c4lS2StructuralChannelRecovery.ambiguityCount,
    recoveryStatus: c4lS2StructuralChannelRecovery.recoveryStatus,
    structuralChannelCandidateStatus,
    antipodalRelationVisibilityRows,
    recommendedNextGate,
    boundaryStatus: {
      fieldCueV0Status: 'blocked',
      generatedSiteReadingV0Status: 'blocked',
      gateC5Status: 'not-authorized-by-this-diagnostic',
      reductionLawAdoptionStatus: 'not-adopted',
      fieldAtlasMutationStatus: 'not-mutated',
      fieldAtlasSourcePolicyMutationStatus: 'not-mutated',
      operationRegistryStatus: OPERATION_REGISTRY_STATUS,
    },
    diagnosticIntegrityStatus,
    integrityIssueCount: integrityIssues.length,
    integrityIssues,
    ok: diagnosticIntegrityStatus === 'pass',
  };
}

function buildProjectionContext(
  r4s1EmittedRegime: StructuredSourceStateComparedRegimeReport | undefined,
): {
  inputByEdgeStateId: Map<string, StructuredSourceStateDetectorInput>;
  hiddenTruth: StructuredSourceStateHiddenTruth[];
} {
  if (!r4s1EmittedRegime) {
    return {
      inputByEdgeStateId: new Map(),
      hiddenTruth: [],
    };
  }

  const inputByAnonymousId = new Map(
    r4s1EmittedRegime.detectorInputs.map((input) => [
      input.anonymousSourceId,
      input,
    ]),
  );
  const inputByEdgeStateId = new Map<string, StructuredSourceStateDetectorInput>();

  for (const truth of r4s1EmittedRegime.hiddenTruth) {
    const input = inputByAnonymousId.get(truth.anonymousSourceId);

    if (input) {
      inputByEdgeStateId.set(truth.hiddenEdgeStateId, input);
    }
  }

  return {
    inputByEdgeStateId,
    hiddenTruth: r4s1EmittedRegime.hiddenTruth.map((truth) => ({ ...truth })),
  };
}

function buildGeneratedChildProjection(
  state: StructuredSourceStateGeneratedChildState,
  context: {
    inputByEdgeStateId: Map<string, StructuredSourceStateDetectorInput>;
  },
): StructuredSourceStateGeneratedChildProjection {
  const input = context.inputByEdgeStateId.get(state.edgeStateId);
  const tuple = input?.emittedTuple ?? state.tupleReduction.emittedTuple;
  const anonymousSourceId = input?.anonymousSourceId ?? `S:${state.edgeStateId}`;
  const structuralPhase = tuple.phase;
  const representativePole = state.edgeStateId < state.complementEdgeStateId;
  const propagationProjection: StructuredSourceStatePropagationProjection = {
    sourceStateId: state.stateId,
    childSiteId: state.childSiteId,
    sourceId: anonymousSourceId,
    anonymousSourceId,
    amplitude: tuple.amplitude,
    carrierWaveNumber: tuple.waveNumber,
    carrierPhase: 0,
    attenuation: tuple.attenuation,
    projectionKind: 'propagation-projection',
    rawPropagationStatus: tupleIsFinite(tuple)
      ? 'field-atlas-ready'
      : 'missing-or-non-finite',
    rawFieldComputationBasis: 'propagation-projection-only',
  };
  const structuralProjection: StructuredSourceStateStructuralProjection = {
    sourceStateId: state.stateId,
    childSiteId: state.childSiteId,
    anonymousSourceId,
    edgeStateId: state.edgeStateId,
    complementEdgeStateId: state.complementEdgeStateId,
    antipodalChildSiteId: state.antipodalChildSiteId,
    axisPairId: state.axisPairId,
    structuralPhase,
    structuralPolarityPhase: structuralPhase,
    polarity: representativePole ? 'representative-pole' : 'complement-pole',
    starSign: representativePole ? 1 : -1,
    projectionKind: 'structural-projection',
    structuralProjectionStatus:
      state.complementEdgeStateId &&
      state.antipodalChildSiteId &&
      state.axisPairId &&
      Number.isFinite(structuralPhase)
        ? 'declared-structural-projection-ready'
        : 'missing-structural-relation',
  };

  return {
    sourceStateId: state.stateId,
    childSiteId: state.childSiteId,
    anonymousSourceId,
    propagationProjection,
    structuralProjection,
  };
}

function buildStructuralOperations(
  axes: Array<{
    axisPairId: string;
    edgeStateIds: [string, string];
    childSiteIds: [string, string];
  }>,
): StructuredSourceStateStructuralOperationsCapsule {
  return {
    complementOperationId: 'tetrahedral-edge-complement-v0',
    complementPairs: axes.map((axis) => ({
      leftEdgeStateId: axis.edgeStateIds[0],
      rightEdgeStateId: axis.edgeStateIds[1],
      leftChildSiteId: axis.childSiteIds[0],
      rightChildSiteId: axis.childSiteIds[1],
    })),
    sourceStateInvolutionFormula: 'sigma(state_edge) = state_complementEdge',
    structuralComparisonBasis: 'declared-structural-projection-comparison-v0',
    recoveryBasis: 'structural-channel-direct-comparison-v0',
    semanticStatus: 'not-semantic-naming',
    rawFieldBehaviorStatus: 'not-raw-propagated-field-behavior',
  };
}

function buildStructuralChannelDetectorInput(
  structuralProjections: StructuredSourceStateStructuralProjection[],
): StructuredSourceStateStructuralChannelDetectorInput {
  const contributionsBySample = STRUCTURAL_SAMPLE_IDS.map(
    (anonymousStructuralSampleId) => {
      const contributions = structuralProjections.map((projection) => ({
        anonymousSourceId: projection.anonymousSourceId,
        re: Math.cos(projection.structuralPhase),
        im: Math.sin(projection.structuralPhase),
        magnitude: 1,
        ratio: structuralProjections.length > 0
          ? 1 / structuralProjections.length
          : 0,
      }));
      const aggregateStructuralChannel = contributions.reduce(
        (sum, contribution) => ({
          re: sum.re + contribution.re,
          im: sum.im + contribution.im,
        }),
        { re: 0, im: 0 },
      );

      return {
        anonymousStructuralSampleId,
        aggregateStructuralChannel: {
          re: aggregateStructuralChannel.re,
          im: aggregateStructuralChannel.im,
          intensity: squaredMagnitude(aggregateStructuralChannel),
          phase: Math.atan2(
            aggregateStructuralChannel.im,
            aggregateStructuralChannel.re,
          ),
        },
        contributions,
      };
    },
  );

  return {
    candidateLawId: CANDIDATE_LAW_ID,
    recoveryBasis: 'structural-channel-direct-comparison-v0',
    anonymousSourceIds: structuralProjections.map(
      (projection) => projection.anonymousSourceId,
    ),
    structuralSamples: contributionsBySample,
  };
}

function detectStructuralChannelPairs(
  input: StructuredSourceStateStructuralChannelDetectorInput,
  hiddenTruth: StructuredSourceStateHiddenTruth[],
): StructuredSourceStateStructuralChannelRecovery {
  const matchings = buildPerfectMatchings(input.anonymousSourceIds);
  const scoredMatchings = matchings.map((matching) => {
    const pairScores = matching.map(([leftId, rightId]) =>
      scoreStructuralChannelPair(input, leftId, rightId),
    );

    return {
      matching,
      pairScores,
      totalScore: pairScores.reduce((sum, score) => sum + score, 0),
    };
  });

  scoredMatchings.sort((left, right) => left.totalScore - right.totalScore);

  const best = scoredMatchings[0] ?? {
    matching: [],
    pairScores: [],
    totalScore: Number.POSITIVE_INFINITY,
  };
  const secondBest = scoredMatchings[1];
  const ambiguityCount = scoredMatchings.filter(
    (scored) => Math.abs(scored.totalScore - best.totalScore) <= 1e-9,
  ).length;
  const pairScores = best.matching.map(([leftId, rightId], index) => {
    const pairScore = best.pairScores[index] ?? Number.POSITIVE_INFINITY;

    return {
      leftAnonymousSourceId: leftId,
      rightAnonymousSourceId: rightId,
      pairScore,
      recoveredTruthPair: isTruthPair(leftId, rightId, hiddenTruth),
    };
  });
  const recoveredTruthPairCount = pairScores.filter(
    (score) => score.recoveredTruthPair,
  ).length;
  const falsePositiveCount = pairScores.length - recoveredTruthPairCount;
  const confidence = computeConfidence({
    totalScore: best.totalScore,
    secondBestScore: secondBest?.totalScore,
    pairCount: pairScores.length,
    ambiguityCount,
  });
  const recoveryStatus: StructuredSourceStateMultiProjectionRecoveryStatus =
    recoveredTruthPairCount === 3 &&
    falsePositiveCount === 0 &&
    ambiguityCount === 1
      ? 'pass'
      : ambiguityCount > 1
        ? 'ambiguous'
        : 'fail';

  return {
    detectorKind: 'structural-channel-direct-comparison',
    recoveryBasis: 'structural-channel-direct-comparison-v0',
    inferredPairs: best.matching.map(([leftId, rightId]) => [leftId, rightId]),
    pairScores,
    totalScore: best.totalScore,
    confidence,
    recoveredTruthPairCount,
    falsePositiveCount,
    ambiguityCount,
    recoveryStatus,
  };
}

function buildUpstreamC4LD1Status(
  report: CandidateComparisonReport,
): StructuredSourceStateMultiProjectionUpstreamC4LD1Status {
  const r4s1 = findCandidateReport(report, R4S1_CANDIDATE_LAW_ID);
  const c4lO1 = findCandidateReport(report, C4L_O1_CANDIDATE_LAW_ID);
  const c4lS1 = findCandidateReport(report, C4L_S1_CANDIDATE_LAW_ID);

  return {
    r4s1RawBehaviorStatus: r4s1?.recoveryStatus ?? 'fail',
    r4s1RawRecoveredTruthPairCount: r4s1?.recoveredTruthPairCount ?? 0,
    c4lO1Status: c4lO1?.recoveryStatus ?? 'fail',
    c4lO1RecoveredTruthPairCount: c4lO1?.recoveredTruthPairCount ?? 0,
    c4lS1StructuralChannelBasisStatus: c4lS1?.recoveryStatus ?? 'fail',
    c4lS1RecoveredTruthPairCount: c4lS1?.recoveredTruthPairCount ?? 0,
    c4lS1FalsePositiveCount: c4lS1?.falsePositiveCount ?? 0,
    c4lS1AmbiguityCount: c4lS1?.ambiguityCount ?? 0,
    candidateComparisonStatus: report.candidateComparisonStatus,
    strongestCandidateLawId: report.strongestCandidateLawId,
    strongestCandidateBasis: report.strongestCandidateBasis,
    recommendedNextGate: report.recommendedNextGate,
  };
}

function buildAntipodalRelationVisibilityRows(args: {
  axes: Array<{
    axisPairId: string;
    edgeStateIds: [string, string];
    childSiteIds: [string, string];
  }>;
  structuralChannelRecovery: StructuredSourceStateStructuralChannelRecovery;
  structuralProjections: StructuredSourceStateStructuralProjection[];
  upstreamC4LD1Status: StructuredSourceStateMultiProjectionUpstreamC4LD1Status;
}): StructuredSourceStateAntipodalRelationVisibilityRow[] {
  const projectionByChildSiteId = new Map(
    args.structuralProjections.map((projection) => [
      projection.childSiteId,
      projection,
    ]),
  );

  return args.axes.map((axis) => {
    const leftProjection = projectionByChildSiteId.get(axis.childSiteIds[0]);
    const rightProjection = projectionByChildSiteId.get(axis.childSiteIds[1]);
    let structuralPairRecovered = false;

    if (leftProjection && rightProjection) {
      structuralPairRecovered =
        args.structuralChannelRecovery.pairScores.some(
          (pairScore) =>
            pairContains(
              pairScore,
              leftProjection.anonymousSourceId,
              rightProjection.anonymousSourceId,
            ) && pairScore.recoveredTruthPair,
        );
    }

    const structuralChannelVisibilityStatus:
      StructuredSourceStateRelationVisibilityStatus = structuralPairRecovered
        ? 'structural-channel-visible'
        : 'unsupported';
    const depropagationVisibilityStatus:
      StructuredSourceStateRelationVisibilityStatus =
        args.upstreamC4LD1Status.c4lS1StructuralChannelBasisStatus === 'pass'
          ? 'depropagation-recoverable'
          : 'unsupported';
    const relationVisibilityStatuses =
      uniqueStrings<StructuredSourceStateRelationVisibilityStatus>([
        'propagation-transformed',
        depropagationVisibilityStatus,
        structuralChannelVisibilityStatus,
        'misleading-if-read-as-raw-field',
      ]).filter(
        (status) => status !== 'unsupported',
      ) as StructuredSourceStateRelationVisibilityStatus[];

    return {
      relationId: `antipodal:${axis.edgeStateIds[0]}<->${axis.edgeStateIds[1]}`,
      leftChildSiteId: axis.childSiteIds[0],
      rightChildSiteId: axis.childSiteIds[1],
      sourceStateRelation: 'antipodal-opposition',
      rawFieldVisibilityStatus: 'misleading-if-read-as-raw-field',
      structuralChannelVisibilityStatus,
      depropagationVisibilityStatus,
      relationVisibilityStatuses,
      visibilitySummary:
        'Antipodality is not proven raw-field-visible; it is evaluated through declared structural-channel comparison.',
      caveats: [
        'Raw propagated field behavior failed upstream and produced false positives.',
        'Structural-channel visibility does not pass Gate C by itself.',
        'FieldCueV0 remains blocked until generated-site readings can use the split honestly.',
      ],
    };
  });
}

function pickStructuralChannelCandidateStatus(
  recovery: StructuredSourceStateStructuralChannelRecovery,
  detectorInputCleanlinessStatus: StructuredSourceStateProjectionDetectorCleanlinessStatus,
): StructuredSourceStateMultiProjectionStructuralChannelCandidateStatus {
  if (
    recovery.recoveryStatus === 'pass' &&
    recovery.recoveredTruthPairCount === 3 &&
    recovery.falsePositiveCount === 0 &&
    recovery.ambiguityCount === 1 &&
    detectorInputCleanlinessStatus === 'clean'
  ) {
    return 'structural-channel-witness-supported';
  }

  if (
    recovery.recoveredTruthPairCount <= 1 ||
    recovery.falsePositiveCount > recovery.recoveredTruthPairCount
  ) {
    return 'structural-channel-witness-failed';
  }

  return 'structural-channel-witness-ambiguous';
}

function pickRecommendedNextGate(
  status: StructuredSourceStateMultiProjectionStructuralChannelCandidateStatus,
): StructuredSourceStateMultiProjectionRecommendedNextGate {
  if (status === 'structural-channel-witness-supported') {
    return 'Gate C.4L-D4';
  }

  if (status === 'structural-channel-witness-ambiguous') {
    return 'Gate C.4L-D3-review';
  }

  return 'Gate C.4L-revise';
}

function buildIntegrityIssues(args: {
  structuredSourceStateReportOk: boolean;
  generatedChildProjections: StructuredSourceStateGeneratedChildProjection[];
  structuralOperations: StructuredSourceStateStructuralOperationsCapsule;
  structuralChannelDetectorInput: StructuredSourceStateStructuralChannelDetectorInput;
  detectorInputAnonymizationStatus: StructuredSourceStateProjectionAnonymizationStatus;
  detectorInputCleanlinessStatus: StructuredSourceStateProjectionDetectorCleanlinessStatus;
  c4lS2StructuralChannelRecovery: StructuredSourceStateStructuralChannelRecovery;
  relationVisibilityRows: StructuredSourceStateAntipodalRelationVisibilityRow[];
}): StructuredSourceStateMultiProjectionIssue[] {
  const issues: StructuredSourceStateMultiProjectionIssue[] = [];

  if (!args.structuredSourceStateReportOk) {
    issues.push({
      code: 'missing-structured-source-state-report',
      message: 'Structured source-state report did not pass its own integrity status.',
    });
  }

  if (args.generatedChildProjections.length !== 6) {
    issues.push({
      code: 'missing-generated-child-state',
      message: `Expected 6 generated child projections, got ${args.generatedChildProjections.length}.`,
    });
  }

  for (const projection of args.generatedChildProjections) {
    if (
      projection.propagationProjection.rawPropagationStatus !==
      'field-atlas-ready'
    ) {
      issues.push({
        code: 'missing-propagation-projection',
        message: `${projection.sourceStateId} has no field-ready propagation projection.`,
        sourceStateId: projection.sourceStateId,
      });
    }

    if (
      projection.structuralProjection.structuralProjectionStatus !==
      'declared-structural-projection-ready'
    ) {
      issues.push({
        code: 'missing-structural-projection',
        message: `${projection.sourceStateId} has no declared structural projection.`,
        sourceStateId: projection.sourceStateId,
      });
    }
  }

  if (
    args.structuralOperations.complementPairs.length !== 3 ||
    args.relationVisibilityRows.length !== 3
  ) {
    issues.push({
      code: 'missing-relation-visibility-row',
      message: `Expected 3 antipodal relation visibility rows, got ${args.relationVisibilityRows.length}.`,
    });
  }

  if (args.detectorInputAnonymizationStatus !== 'anonymized') {
    issues.push({
      code: 'detector-input-leaks-label',
      message: 'Structural-channel detector input is not anonymized.',
    });
  }

  for (const code of buildDetectorInputLeakIssueCodes(
    args.structuralChannelDetectorInput,
  )) {
    issues.push({
      code,
      message: `Structural-channel detector input leaks ${code}.`,
    });
  }

  if (!args.c4lS2StructuralChannelRecovery.pairScores.length) {
    issues.push({
      code: 'no-structural-channel-pair-scores',
      message: 'Structural-channel detector produced no pair scores.',
    });
  }

  if (
    args.c4lS2StructuralChannelRecovery.pairScores.some(
      (score) => !Number.isFinite(score.pairScore),
    ) ||
    !Number.isFinite(args.c4lS2StructuralChannelRecovery.totalScore) ||
    !Number.isFinite(args.c4lS2StructuralChannelRecovery.confidence)
  ) {
    issues.push({
      code: 'non-finite-structural-channel-score',
      message: 'Structural-channel detector produced a non-finite score.',
    });
  }

  if (args.detectorInputCleanlinessStatus !== 'clean') {
    issues.push({
      code: 'detector-input-leaks-hidden-truth',
      message: 'Structural-channel detector input failed cleanliness status.',
    });
  }

  return uniqueIssues(issues);
}

function buildDetectorInputLeakIssueCodes(
  input: StructuredSourceStateStructuralChannelDetectorInput,
): StructuredSourceStateMultiProjectionIssueCode[] {
  const issueCodes: StructuredSourceStateMultiProjectionIssueCode[] = [];

  if (objectHasKeyMatching(input, /sourcePosition|position/i)) {
    issueCodes.push('detector-input-leaks-source-position');
  }

  if (objectHasKeyMatching(input, /probePosition|samplePosition/i)) {
    issueCodes.push('detector-input-leaks-probe-position');
  }

  if (objectHasKeyMatching(input, /emittedTuple|waveNumber|attenuation|amplitude/i)) {
    issueCodes.push('detector-input-leaks-emitted-tuple');
  }

  if (
    !structuralChannelDetectorInputIsAnonymized(input) ||
    objectHasKeyMatching(
      input,
      /label|edgeStateId|childSiteId|complement/i,
    )
  ) {
    issueCodes.push('detector-input-leaks-label');
  }

  if (objectHasKeyMatching(input, /hidden|truth|antipodal/i)) {
    issueCodes.push('detector-input-leaks-hidden-truth');
  }

  if (objectHasKeyMatching(input, /axisPair|axisId|axis:/i)) {
    issueCodes.push('detector-input-leaks-axis-pair');
  }

  return uniqueStrings(issueCodes);
}

function structuralChannelDetectorInputIsAnonymized(
  input: StructuredSourceStateStructuralChannelDetectorInput,
): boolean {
  const sourceIds = [
    ...input.anonymousSourceIds,
    ...input.structuralSamples.flatMap((sample) =>
      sample.contributions.map((contribution) => contribution.anonymousSourceId),
    ),
  ];

  return (
    sourceIds.every(
      (sourceId) =>
        /^S\d+$/.test(sourceId) && !/[A-D]{2}|M_[A-D]{2}|axis:/i.test(sourceId),
    ) &&
    input.structuralSamples.every((sample) =>
      /^Q\d+$/.test(sample.anonymousStructuralSampleId),
    )
  );
}

function structuralChannelDetectorInputIsClean(
  input: StructuredSourceStateStructuralChannelDetectorInput,
): boolean {
  return buildDetectorInputLeakIssueCodes(input).length === 0;
}

function scoreStructuralChannelPair(
  input: StructuredSourceStateStructuralChannelDetectorInput,
  leftAnonymousSourceId: string,
  rightAnonymousSourceId: string,
): number {
  const sampleScores = input.structuralSamples
    .map((sample) => {
      const left = sample.contributions.find(
        (contribution) =>
          contribution.anonymousSourceId === leftAnonymousSourceId,
      );
      const right = sample.contributions.find(
        (contribution) =>
          contribution.anonymousSourceId === rightAnonymousSourceId,
      );

      if (
        !left ||
        !right ||
        left.magnitude <= 0 ||
        right.magnitude <= 0 ||
        !contributionIsFinite(left) ||
        !contributionIsFinite(right)
      ) {
        return null;
      }

      const leftUnit = {
        re: left.re / left.magnitude,
        im: left.im / left.magnitude,
      };
      const rightUnit = {
        re: right.re / right.magnitude,
        im: right.im / right.magnitude,
      };
      const antiAlignmentError = Math.hypot(
        leftUnit.re + rightUnit.re,
        leftUnit.im + rightUnit.im,
      );

      return Number.isFinite(antiAlignmentError) ? antiAlignmentError : null;
    })
    .filter((score): score is number => score !== null);

  if (!sampleScores.length) {
    return Number.POSITIVE_INFINITY;
  }

  return averageNumbers(sampleScores);
}

function findCandidateReport(
  report: CandidateComparisonReport,
  candidateLawId: string,
): CandidateComparisonCandidateReport | undefined {
  return report.candidateReports.find(
    (candidate) => candidate.candidateLawId === candidateLawId,
  );
}

function isTruthPair(
  leftAnonymousSourceId: string,
  rightAnonymousSourceId: string,
  hiddenTruth: StructuredSourceStateHiddenTruth[],
): boolean {
  const truthByAnonymousId = new Map(
    hiddenTruth.map((truth) => [truth.anonymousSourceId, truth]),
  );
  const left = truthByAnonymousId.get(leftAnonymousSourceId);
  const right = truthByAnonymousId.get(rightAnonymousSourceId);

  if (!left || !right) {
    return false;
  }

  return left.hiddenAntipodalEdgeStateId === right.hiddenEdgeStateId;
}

function pairContains(
  pairScore: StructuredSourceStateStructuralChannelPairScore,
  leftAnonymousSourceId: string,
  rightAnonymousSourceId: string,
): boolean {
  return (
    (pairScore.leftAnonymousSourceId === leftAnonymousSourceId &&
      pairScore.rightAnonymousSourceId === rightAnonymousSourceId) ||
    (pairScore.leftAnonymousSourceId === rightAnonymousSourceId &&
      pairScore.rightAnonymousSourceId === leftAnonymousSourceId)
  );
}

function buildPerfectMatchings(ids: string[]): Array<Array<[string, string]>> {
  if (ids.length === 0) {
    return [[]];
  }

  const [first, ...rest] = ids;
  const matchings: Array<Array<[string, string]>> = [];

  for (let index = 0; index < rest.length; index += 1) {
    const paired = rest[index];
    const remaining = rest.filter(
      (_, remainingIndex) => remainingIndex !== index,
    );

    for (const childMatching of buildPerfectMatchings(remaining)) {
      matchings.push([[first, paired], ...childMatching]);
    }
  }

  return matchings;
}

function computeConfidence(args: {
  totalScore: number;
  secondBestScore: number | undefined;
  pairCount: number;
  ambiguityCount: number;
}): number {
  if (!Number.isFinite(args.totalScore) || args.pairCount === 0) {
    return 0;
  }

  const maxScore = 2 * args.pairCount;
  const rawConfidence = 1 - args.totalScore / maxScore;
  const separationBonus =
    args.secondBestScore !== undefined &&
    Number.isFinite(args.secondBestScore)
      ? Math.max(0, Math.min(1, args.secondBestScore - args.totalScore)) *
        0.01
      : 0;

  return Math.max(
    0,
    Math.min(
      1,
      rawConfidence * (args.ambiguityCount === 1 ? 1 : 0.5) +
        separationBonus,
    ),
  );
}

function tupleIsFinite(tuple: EmittedTuple): boolean {
  return (
    Number.isFinite(tuple.amplitude) &&
    Number.isFinite(tuple.waveNumber) &&
    Number.isFinite(tuple.phase) &&
    Number.isFinite(tuple.attenuation)
  );
}

function contributionIsFinite(
  contribution: StructuredSourceStateStructuralChannelContributionInput,
): boolean {
  return (
    Number.isFinite(contribution.re) &&
    Number.isFinite(contribution.im) &&
    Number.isFinite(contribution.magnitude) &&
    Number.isFinite(contribution.ratio)
  );
}

function squaredMagnitude(value: { re: number; im: number }): number {
  return value.re * value.re + value.im * value.im;
}

function averageNumbers(values: number[]): number {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function objectHasKeyMatching(value: unknown, pattern: RegExp): boolean {
  if (!value || typeof value !== 'object') {
    return false;
  }

  if (Array.isArray(value)) {
    return value.some((child) => objectHasKeyMatching(child, pattern));
  }

  return Object.entries(value).some(
    ([key, child]) => pattern.test(key) || objectHasKeyMatching(child, pattern),
  );
}

function uniqueStrings<T extends string>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function uniqueIssues(
  issues: StructuredSourceStateMultiProjectionIssue[],
): StructuredSourceStateMultiProjectionIssue[] {
  const seen = new Set<string>();

  return issues.filter((issue) => {
    const key = `${issue.code}:${issue.sourceStateId ?? ''}:${issue.message}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

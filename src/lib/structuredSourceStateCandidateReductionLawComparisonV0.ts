import type { Vec3 } from '../types/geometry';
import {
  sampleFieldAtlasAtPoint,
  type FieldAtlasSample,
  type FieldAtlasSource,
} from './fieldAtlas';
import {
  buildStructuredSourceStateEmittedRecoveryV0Report,
  type StructuredSourceStateComparedRegimeReport,
  type StructuredSourceStateDetectorInput,
  type StructuredSourceStateHiddenTruth,
} from './structuredSourceStateEmittedRecoveryV0';
import { buildStructuredSourceStateFieldBehaviorRecoveryV0Report } from './structuredSourceStateFieldBehaviorRecoveryV0';

export type StructuredSourceStateCandidateReductionLawComparisonV0Method =
  'structured-source-state-candidate-reduction-law-comparison-v0';
export type StructuredSourceStateCandidateReductionLawComparisonV0Scope =
  'candidate-reduction-law-comparison-only';
export type StructuredSourceStateCandidateReductionLawComparisonParentGate =
  'Gate C.4L-D1';
export type StructuredSourceStateCandidateReductionLawComparisonDecisionGate =
  'Gate C.4L';
export type StructuredSourceStateCandidateReductionLawComparisonFailureGate =
  'Gate C.4';
export type StructuredSourceStateCandidateReductionLawComparisonResidualGate =
  'Gate C.4D';
export type StructuredSourceStateCandidateReductionLawComparisonRegimeId =
  'structured-source-state-antipodal-covariant-v0';
export type StructuredSourceStateCandidateReductionLawComparisonSemanticStatus =
  'not-semantic-naming';
export type StructuredSourceStateCandidateReductionLawComparisonTopologyStatus =
  'not-topology-workspace';
export type StructuredSourceStateCandidateReductionLawComparisonPacketWriteStatus =
  'not-packet-writing';
export type StructuredSourceStateCandidateReductionLawComparisonShapeMutationStatus =
  'not-shape-mutation';
export type StructuredSourceStateCandidateReductionLawComparisonOperationRegistryStatus =
  'not-operation-registry-work';
export type StructuredSourceStateCandidateReductionLawComparisonUiExposureStatus =
  'not-ui-work';
export type StructuredSourceStateCandidateReductionLawComparisonDiagnosticIntegrityStatus =
  | 'pass'
  | 'fail';
export type StructuredSourceStateCandidateReductionLawComparisonStatus =
  | 'structural-propagation-split-supported-for-next-design'
  | 'orbit-common-carrier-supported-for-review'
  | 'no-revised-candidate-supported'
  | 'ambiguous-candidate-comparison';
export type StructuredSourceStateCandidateReductionLawComparisonRecommendedNextGate =
  | 'Gate C.4L-D2'
  | 'Gate C.5-review'
  | 'Gate C.4L-review'
  | 'Gate C.4L-revise';
export type StructuredSourceStateCandidateReductionLawDetectorCleanlinessStatus =
  | 'clean'
  | 'leaked';
export type StructuredSourceStateCandidateReductionLawAnonymizationStatus =
  | 'anonymized'
  | 'leaked-label';
export type StructuredSourceStateCandidateReductionLawRecoveryStatus =
  | 'pass'
  | 'fail'
  | 'ambiguous';
export type StructuredSourceStateCandidateReductionLawCandidateStatus =
  | 'candidate-supported-under-declared-basis'
  | 'candidate-failed-under-declared-basis'
  | 'candidate-ambiguous-under-declared-basis'
  | 'baseline-retained-as-emitted-success-only';
export type StructuredSourceStateCandidateReductionLawId =
  | 'uniform-circle-fixture-bad-control'
  | 'pythagorean-tetrachord-scalar-baseline'
  | 'r0-metadata-only-structured-control'
  | 'r4-s1-harmonic-wave-number-star-sign-phase-v0'
  | 'c4l-o1-axis-common-carrier-structural-phase-v0'
  | 'c4l-s1-structural-propagation-split-v0';
export type StructuredSourceStateCandidateReductionLawFamily =
  | 'control'
  | 'r4-s1-baseline'
  | 'orbit-common-carrier'
  | 'structural-propagation-split';
export type StructuredSourceStateCandidateReductionLawRecoveryBasis =
  | 'raw-propagated-field-behavior-control'
  | 'raw-propagated-field-behavior-r4-s1-baseline'
  | 'raw-propagated-field-behavior-with-axis-common-carrier'
  | 'known-propagation-dephased-structural-channel';

type EmittedTuple = NonNullable<StructuredSourceStateDetectorInput['emittedTuple']>;
type FieldBehaviorReport = ReturnType<
  typeof buildStructuredSourceStateFieldBehaviorRecoveryV0Report
>;
type FieldBehaviorComparedRegime = FieldBehaviorReport['comparedRegimes'][number];

export interface StructuredSourceStateCandidateReductionLawContributionInput {
  anonymousSourceId: string;
  re: number;
  im: number;
  magnitude: number;
  ratio: number;
}

export interface StructuredSourceStateCandidateReductionLawProbeInput {
  anonymousProbeId: string;
  aggregateField: {
    re: number;
    im: number;
    intensity: number;
    phase: number;
  };
  contributions: StructuredSourceStateCandidateReductionLawContributionInput[];
}

export interface StructuredSourceStateCandidateReductionLawDetectorInput {
  candidateLawId: StructuredSourceStateCandidateReductionLawId;
  anonymousSourceIds: string[];
  probes: StructuredSourceStateCandidateReductionLawProbeInput[];
}

export interface StructuredSourceStateCandidateReductionLawPairScore {
  leftAnonymousSourceId: string;
  rightAnonymousSourceId: string;
  pairScore: number;
  recoveredTruthPair: boolean;
}

export interface StructuredSourceStateCandidateReductionLawReport {
  candidateLawId: StructuredSourceStateCandidateReductionLawId;
  candidateFamily: StructuredSourceStateCandidateReductionLawFamily;
  candidateHypothesis: string;
  recoveryBasis: StructuredSourceStateCandidateReductionLawRecoveryBasis;
  expectedStatus: string;
  detectorInputAnonymizationStatus: StructuredSourceStateCandidateReductionLawAnonymizationStatus;
  detectorInputCleanlinessStatus: StructuredSourceStateCandidateReductionLawDetectorCleanlinessStatus;
  detectorInput: StructuredSourceStateCandidateReductionLawDetectorInput;
  hiddenTruth: StructuredSourceStateHiddenTruth[];
  inferredPairs: Array<[string, string]>;
  pairScores: StructuredSourceStateCandidateReductionLawPairScore[];
  totalScore: number;
  recoveredTruthPairCount: number;
  falsePositiveCount: number;
  ambiguityCount: number;
  confidence: number;
  recoveryStatus: StructuredSourceStateCandidateReductionLawRecoveryStatus;
  candidateStatus: StructuredSourceStateCandidateReductionLawCandidateStatus;
  notes: string[];
}

export type StructuredSourceStateCandidateReductionLawComparisonIssueCode =
  | 'missing-upstream-regime'
  | 'missing-r4s1-emitted-sources'
  | 'detector-input-leaks-source-position'
  | 'detector-input-leaks-probe-position'
  | 'detector-input-leaks-emitted-tuple'
  | 'detector-input-leaks-label'
  | 'detector-input-leaks-hidden-truth'
  | 'detector-input-leaks-axis-pair'
  | 'non-finite-candidate-score'
  | 'no-candidate-reports'
  | 'no-pair-scores'
  | 'fieldcue-import-detected'
  | 'generated-site-reading-import-detected'
  | 'operation-registry-contaminated';

export interface StructuredSourceStateCandidateReductionLawComparisonIssue {
  code: StructuredSourceStateCandidateReductionLawComparisonIssueCode;
  message: string;
  candidateLawId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface StructuredSourceStateCandidateReductionLawComparisonV0Report {
  method: StructuredSourceStateCandidateReductionLawComparisonV0Method;
  diagnosticScope: StructuredSourceStateCandidateReductionLawComparisonV0Scope;
  parentGate: StructuredSourceStateCandidateReductionLawComparisonParentGate;
  upstreamDecisionGate: StructuredSourceStateCandidateReductionLawComparisonDecisionGate;
  upstreamFailureGate: StructuredSourceStateCandidateReductionLawComparisonFailureGate;
  upstreamResidualGate: StructuredSourceStateCandidateReductionLawComparisonResidualGate;
  sourceStateRegimeId: StructuredSourceStateCandidateReductionLawComparisonRegimeId;
  semanticStatus: StructuredSourceStateCandidateReductionLawComparisonSemanticStatus;
  topologyStatus: StructuredSourceStateCandidateReductionLawComparisonTopologyStatus;
  packetWriteStatus: StructuredSourceStateCandidateReductionLawComparisonPacketWriteStatus;
  shapeMutationStatus: StructuredSourceStateCandidateReductionLawComparisonShapeMutationStatus;
  operationRegistryStatus: StructuredSourceStateCandidateReductionLawComparisonOperationRegistryStatus;
  uiExposureStatus: StructuredSourceStateCandidateReductionLawComparisonUiExposureStatus;
  upstreamC3R4S1EmissionRecoveryStatus: string;
  upstreamC4R4S1FieldBehaviorRecoveryStatus: string;
  upstreamC4CandidateStatus: string;
  comparedCandidateLawIds: StructuredSourceStateCandidateReductionLawId[];
  candidateReports: StructuredSourceStateCandidateReductionLawReport[];
  strongestCandidateLawId: StructuredSourceStateCandidateReductionLawId | null;
  strongestCandidateBasis: StructuredSourceStateCandidateReductionLawRecoveryBasis | null;
  candidateComparisonStatus: StructuredSourceStateCandidateReductionLawComparisonStatus;
  recommendedNextGate: StructuredSourceStateCandidateReductionLawComparisonRecommendedNextGate;
  boundaryStatus: {
    fieldCueV0Status: 'blocked';
    generatedSiteReadingV0Status: 'blocked';
    gateC5Status:
      | 'not-authorized-by-this-diagnostic'
      | 'raw-field-behavior-candidate-supports-gate-c5-review';
    reductionLawAdoptionStatus: 'not-adopted';
    fieldAtlasMutationStatus: 'not-mutated';
    fieldAtlasSourcePolicyMutationStatus: 'not-mutated';
    operationRegistryStatus: StructuredSourceStateCandidateReductionLawComparisonOperationRegistryStatus;
  };
  diagnosticIntegrityStatus: StructuredSourceStateCandidateReductionLawComparisonDiagnosticIntegrityStatus;
  integrityIssueCount: number;
  integrityIssues: StructuredSourceStateCandidateReductionLawComparisonIssue[];
  ok: boolean;
}

const METHOD: StructuredSourceStateCandidateReductionLawComparisonV0Method =
  'structured-source-state-candidate-reduction-law-comparison-v0';
const DIAGNOSTIC_SCOPE: StructuredSourceStateCandidateReductionLawComparisonV0Scope =
  'candidate-reduction-law-comparison-only';
const PARENT_GATE: StructuredSourceStateCandidateReductionLawComparisonParentGate =
  'Gate C.4L-D1';
const UPSTREAM_DECISION_GATE: StructuredSourceStateCandidateReductionLawComparisonDecisionGate =
  'Gate C.4L';
const UPSTREAM_FAILURE_GATE: StructuredSourceStateCandidateReductionLawComparisonFailureGate =
  'Gate C.4';
const UPSTREAM_RESIDUAL_GATE: StructuredSourceStateCandidateReductionLawComparisonResidualGate =
  'Gate C.4D';
const SOURCE_STATE_REGIME_ID: StructuredSourceStateCandidateReductionLawComparisonRegimeId =
  'structured-source-state-antipodal-covariant-v0';
const SEMANTIC_STATUS: StructuredSourceStateCandidateReductionLawComparisonSemanticStatus =
  'not-semantic-naming';
const TOPOLOGY_STATUS: StructuredSourceStateCandidateReductionLawComparisonTopologyStatus =
  'not-topology-workspace';
const PACKET_WRITE_STATUS: StructuredSourceStateCandidateReductionLawComparisonPacketWriteStatus =
  'not-packet-writing';
const SHAPE_MUTATION_STATUS: StructuredSourceStateCandidateReductionLawComparisonShapeMutationStatus =
  'not-shape-mutation';
const OPERATION_REGISTRY_STATUS: StructuredSourceStateCandidateReductionLawComparisonOperationRegistryStatus =
  'not-operation-registry-work';
const UI_EXPOSURE_STATUS: StructuredSourceStateCandidateReductionLawComparisonUiExposureStatus =
  'not-ui-work';
const R4S1_CANDIDATE_LAW_ID: StructuredSourceStateCandidateReductionLawId =
  'r4-s1-harmonic-wave-number-star-sign-phase-v0';
const C4L_O1_CANDIDATE_LAW_ID: StructuredSourceStateCandidateReductionLawId =
  'c4l-o1-axis-common-carrier-structural-phase-v0';
const C4L_S1_CANDIDATE_LAW_ID: StructuredSourceStateCandidateReductionLawId =
  'c4l-s1-structural-propagation-split-v0';
const EXPECTED_UPSTREAM_REGIME_IDS: StructuredSourceStateCandidateReductionLawId[] = [
  'uniform-circle-fixture-bad-control',
  'pythagorean-tetrachord-scalar-baseline',
  'r0-metadata-only-structured-control',
  R4S1_CANDIDATE_LAW_ID,
];
const PROBE_SET: Array<{ anonymousProbeId: string; position: Vec3 }> = [
  { anonymousProbeId: 'P0', position: [0, 0, 0] },
  { anonymousProbeId: 'P1', position: [0.25, 0.25, 0.25] },
  { anonymousProbeId: 'P2', position: [0.25, 0.25, -0.25] },
  { anonymousProbeId: 'P3', position: [0.25, -0.25, 0.25] },
  { anonymousProbeId: 'P4', position: [-0.25, 0.25, 0.25] },
  { anonymousProbeId: 'P5', position: [-0.25, -0.25, -0.25] },
  { anonymousProbeId: 'P6', position: [-0.25, -0.25, 0.25] },
  { anonymousProbeId: 'P7', position: [-0.25, 0.25, -0.25] },
  { anonymousProbeId: 'P8', position: [0.25, -0.25, -0.25] },
];

export function buildStructuredSourceStateCandidateReductionLawComparisonV0Report(): StructuredSourceStateCandidateReductionLawComparisonV0Report {
  const emittedRecoveryReport = buildStructuredSourceStateEmittedRecoveryV0Report();
  const fieldBehaviorReport = buildStructuredSourceStateFieldBehaviorRecoveryV0Report();
  const r4s1EmittedRegime = findEmittedRegime(
    emittedRecoveryReport.comparedRegimes,
    R4S1_CANDIDATE_LAW_ID,
  );
  const candidateReports = buildCandidateReports({
    fieldBehaviorReport,
    r4s1EmittedRegime,
  });
  const integrityIssues = buildIntegrityIssues({
    emittedRegimes: emittedRecoveryReport.comparedRegimes,
    fieldBehaviorRegimes: fieldBehaviorReport.comparedRegimes,
    r4s1EmittedRegime,
    candidateReports,
  });
  const diagnosticIntegrityStatus: StructuredSourceStateCandidateReductionLawComparisonDiagnosticIntegrityStatus =
    integrityIssues.length === 0 ? 'pass' : 'fail';
  const strongestCandidate = pickStrongestCandidate(candidateReports);
  const candidateComparisonStatus =
    pickCandidateComparisonStatus(candidateReports);
  const rawFieldBehaviorCandidatePasses = candidateReports.some(
    (report) =>
      report.candidateFamily === 'orbit-common-carrier' &&
      report.recoveryStatus === 'pass' &&
      report.falsePositiveCount === 0 &&
      report.ambiguityCount === 1,
  );
  const recommendedNextGate = pickRecommendedNextGate({
    candidateReports,
    candidateComparisonStatus,
    rawFieldBehaviorCandidatePasses,
  });

  return {
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    parentGate: PARENT_GATE,
    upstreamDecisionGate: UPSTREAM_DECISION_GATE,
    upstreamFailureGate: UPSTREAM_FAILURE_GATE,
    upstreamResidualGate: UPSTREAM_RESIDUAL_GATE,
    sourceStateRegimeId: SOURCE_STATE_REGIME_ID,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    shapeMutationStatus: SHAPE_MUTATION_STATUS,
    operationRegistryStatus: OPERATION_REGISTRY_STATUS,
    uiExposureStatus: UI_EXPOSURE_STATUS,
    upstreamC3R4S1EmissionRecoveryStatus:
      emittedRecoveryReport.comparisonSummary.r4s1RecoveryStatus,
    upstreamC4R4S1FieldBehaviorRecoveryStatus:
      fieldBehaviorReport.r4s1FieldBehaviorRecoveryStatus,
    upstreamC4CandidateStatus: fieldBehaviorReport.gateC4CandidateStatus,
    comparedCandidateLawIds: candidateReports.map(
      (report) => report.candidateLawId,
    ),
    candidateReports,
    strongestCandidateLawId: strongestCandidate?.candidateLawId ?? null,
    strongestCandidateBasis: strongestCandidate?.recoveryBasis ?? null,
    candidateComparisonStatus,
    recommendedNextGate,
    boundaryStatus: {
      fieldCueV0Status: 'blocked',
      generatedSiteReadingV0Status: 'blocked',
      gateC5Status: rawFieldBehaviorCandidatePasses
        ? 'raw-field-behavior-candidate-supports-gate-c5-review'
        : 'not-authorized-by-this-diagnostic',
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

function buildCandidateReports(args: {
  fieldBehaviorReport: FieldBehaviorReport;
  r4s1EmittedRegime: StructuredSourceStateComparedRegimeReport | undefined;
}): StructuredSourceStateCandidateReductionLawReport[] {
  const reports: StructuredSourceStateCandidateReductionLawReport[] = [];

  for (const regimeId of EXPECTED_UPSTREAM_REGIME_IDS) {
    const fieldBehaviorRegime = findFieldBehaviorRegime(
      args.fieldBehaviorReport.comparedRegimes,
      regimeId,
    );

    if (fieldBehaviorRegime) {
      reports.push(buildFieldBehaviorCandidateReport(fieldBehaviorRegime));
    }
  }

  if (r4s1EmittedSourcesAreUsable(args.r4s1EmittedRegime)) {
    reports.push(buildOrbitCommonCarrierCandidateReport(args.r4s1EmittedRegime));
    reports.push(
      buildStructuralPropagationSplitCandidateReport(args.r4s1EmittedRegime),
    );
  }

  return reports;
}

function buildFieldBehaviorCandidateReport(
  regime: FieldBehaviorComparedRegime,
): StructuredSourceStateCandidateReductionLawReport {
  const candidateLawId = regime.regimeId as StructuredSourceStateCandidateReductionLawId;
  const detectorInput: StructuredSourceStateCandidateReductionLawDetectorInput =
    {
      candidateLawId,
      anonymousSourceIds: [...regime.fieldBehaviorDetectorInput.anonymousSourceIds],
      probes: regime.fieldBehaviorDetectorInput.probes.map((probe) => ({
        anonymousProbeId: probe.anonymousProbeId,
        aggregateField: { ...probe.aggregateField },
        contributions: probe.contributions.map((contribution) => ({
          anonymousSourceId: contribution.anonymousSourceId,
          re: contribution.re,
          im: contribution.im,
          magnitude: contribution.magnitude,
          ratio: contribution.ratio,
        })),
      })),
    };
  const recovery = detectAntiAlignmentPairs(detectorInput, regime.hiddenTruth);
  const isR4S1 = candidateLawId === R4S1_CANDIDATE_LAW_ID;

  return {
    candidateLawId,
    candidateFamily: isR4S1 ? 'r4-s1-baseline' : 'control',
    candidateHypothesis: isR4S1
      ? 'R4-S1 baseline keeps harmonic waveNumber and structural phase as raw propagated field behavior.'
      : `${candidateLawId} remains a control for the C.4L-D1 comparison.`,
    recoveryBasis: isR4S1
      ? 'raw-propagated-field-behavior-r4-s1-baseline'
      : 'raw-propagated-field-behavior-control',
    expectedStatus: isR4S1
      ? 'emitted-tuple-success-only / raw-field-behavior-failed'
      : 'control should not authorize candidate promotion',
    detectorInputAnonymizationStatus: detectorInputIsAnonymized(detectorInput)
      ? 'anonymized'
      : 'leaked-label',
    detectorInputCleanlinessStatus: detectorInputIsClean(detectorInput)
      ? 'clean'
      : 'leaked',
    detectorInput,
    hiddenTruth: copyHiddenTruth(regime.hiddenTruth),
    inferredPairs: recovery.inferredPairs,
    pairScores: recovery.pairScores,
    totalScore: recovery.totalScore,
    recoveredTruthPairCount: recovery.recoveredTruthPairCount,
    falsePositiveCount: recovery.falsePositiveCount,
    ambiguityCount: recovery.ambiguityCount,
    confidence: recovery.confidence,
    recoveryStatus: recovery.recoveryStatus,
    candidateStatus: isR4S1
      ? 'baseline-retained-as-emitted-success-only'
      : candidateStatusForRecovery(recovery.recoveryStatus),
    notes: isR4S1
      ? [
          'R4-S1 remains valuable as emitted-tuple recovery evidence.',
          'This report does not treat R4-S1 as a field-behavior law.',
        ]
      : ['Control report included to keep candidate comparison bounded.'],
  };
}

function buildOrbitCommonCarrierCandidateReport(
  r4s1: StructuredSourceStateComparedRegimeReport,
): StructuredSourceStateCandidateReductionLawReport {
  const sources = buildOrbitCommonCarrierSources(r4s1);
  const detectorInput = buildRawPropagatedDetectorInput({
    candidateLawId: C4L_O1_CANDIDATE_LAW_ID,
    sources,
  });
  const recovery = detectAntiAlignmentPairs(detectorInput, r4s1.hiddenTruth);

  return {
    candidateLawId: C4L_O1_CANDIDATE_LAW_ID,
    candidateFamily: 'orbit-common-carrier',
    candidateHypothesis:
      'Axis-common carrier tests whether waveNumber mismatch across antipodal pairs is the main source of deformation.',
    recoveryBasis: 'raw-propagated-field-behavior-with-axis-common-carrier',
    expectedStatus:
      'bounded raw-field candidate; harmonic difference retained as non-propagating diagnostic metadata',
    detectorInputAnonymizationStatus: detectorInputIsAnonymized(detectorInput)
      ? 'anonymized'
      : 'leaked-label',
    detectorInputCleanlinessStatus: detectorInputIsClean(detectorInput)
      ? 'clean'
      : 'leaked',
    detectorInput,
    hiddenTruth: copyHiddenTruth(r4s1.hiddenTruth),
    inferredPairs: recovery.inferredPairs,
    pairScores: recovery.pairScores,
    totalScore: recovery.totalScore,
    recoveredTruthPairCount: recovery.recoveredTruthPairCount,
    falsePositiveCount: recovery.falsePositiveCount,
    ambiguityCount: recovery.ambiguityCount,
    confidence: recovery.confidence,
    recoveryStatus: recovery.recoveryStatus,
    candidateStatus: candidateStatusForRecovery(recovery.recoveryStatus),
    notes: [
      'Candidate uses structured source-state knowledge internally to normalize carriers by complement pair.',
      'Detector input receives only anonymous propagated field contributions.',
    ],
  };
}

function buildStructuralPropagationSplitCandidateReport(
  r4s1: StructuredSourceStateComparedRegimeReport,
): StructuredSourceStateCandidateReductionLawReport {
  const sources = buildFieldAtlasSourcesFromEmittedInputs({
    candidateLawId: C4L_S1_CANDIDATE_LAW_ID,
    inputs: r4s1.detectorInputs,
    tupleForInput: (input) => requireEmittedTuple(input),
  });
  const detectorInput = buildStructuralChannelDetectorInput({
    candidateLawId: C4L_S1_CANDIDATE_LAW_ID,
    sources,
  });
  const recovery = detectAntiAlignmentPairs(detectorInput, r4s1.hiddenTruth);

  return {
    candidateLawId: C4L_S1_CANDIDATE_LAW_ID,
    candidateFamily: 'structural-propagation-split',
    candidateHypothesis:
      'Structural polarity is tested as a de-propagated structural channel rather than ordinary propagated carrier phase.',
    recoveryBasis: 'known-propagation-dephased-structural-channel',
    expectedStatus:
      'declared structural-channel basis only; passing does not pass Gate C by itself',
    detectorInputAnonymizationStatus: detectorInputIsAnonymized(detectorInput)
      ? 'anonymized'
      : 'leaked-label',
    detectorInputCleanlinessStatus: detectorInputIsClean(detectorInput)
      ? 'clean'
      : 'leaked',
    detectorInput,
    hiddenTruth: copyHiddenTruth(r4s1.hiddenTruth),
    inferredPairs: recovery.inferredPairs,
    pairScores: recovery.pairScores,
    totalScore: recovery.totalScore,
    recoveredTruthPairCount: recovery.recoveredTruthPairCount,
    falsePositiveCount: recovery.falsePositiveCount,
    ambiguityCount: recovery.ambiguityCount,
    confidence: recovery.confidence,
    recoveryStatus: recovery.recoveryStatus,
    candidateStatus: candidateStatusForRecovery(recovery.recoveryStatus),
    notes: [
      'Known propagation terms are used only inside the diagnostic to form anonymous structural-channel contributions.',
      'This basis is not raw propagated field behavior and does not authorize FieldCueV0 promotion.',
    ],
  };
}

function buildOrbitCommonCarrierSources(
  r4s1: StructuredSourceStateComparedRegimeReport,
): FieldAtlasSource[] {
  const averageCarrierByAnonymousId = buildAverageCarrierByAnonymousId(r4s1);

  return buildFieldAtlasSourcesFromEmittedInputs({
    candidateLawId: C4L_O1_CANDIDATE_LAW_ID,
    inputs: r4s1.detectorInputs,
    tupleForInput: (input) => ({
      ...requireEmittedTuple(input),
      waveNumber:
        averageCarrierByAnonymousId.get(input.anonymousSourceId) ??
        requireEmittedTuple(input).waveNumber,
    }),
  });
}

function buildAverageCarrierByAnonymousId(
  r4s1: StructuredSourceStateComparedRegimeReport,
): Map<string, number> {
  const inputByAnonymousId = new Map(
    r4s1.detectorInputs.map((input) => [input.anonymousSourceId, input]),
  );
  const truthByEdgeId = new Map(
    r4s1.hiddenTruth.map((truth) => [truth.hiddenEdgeStateId, truth]),
  );
  const carrierByAnonymousId = new Map<string, number>();

  for (const truth of r4s1.hiddenTruth) {
    const complementTruth = truthByEdgeId.get(truth.hiddenAntipodalEdgeStateId);

    if (!complementTruth) {
      continue;
    }

    const leftTuple = inputByAnonymousId.get(truth.anonymousSourceId)?.emittedTuple;
    const rightTuple = inputByAnonymousId.get(
      complementTruth.anonymousSourceId,
    )?.emittedTuple;

    if (
      !leftTuple ||
      !rightTuple ||
      !Number.isFinite(leftTuple.waveNumber) ||
      !Number.isFinite(rightTuple.waveNumber)
    ) {
      continue;
    }

    const averageWaveNumber =
      (leftTuple.waveNumber + rightTuple.waveNumber) / 2;
    carrierByAnonymousId.set(truth.anonymousSourceId, averageWaveNumber);
    carrierByAnonymousId.set(
      complementTruth.anonymousSourceId,
      averageWaveNumber,
    );
  }

  return carrierByAnonymousId;
}

function buildFieldAtlasSourcesFromEmittedInputs(args: {
  candidateLawId: StructuredSourceStateCandidateReductionLawId;
  inputs: StructuredSourceStateDetectorInput[];
  tupleForInput: (input: StructuredSourceStateDetectorInput) => EmittedTuple;
}): FieldAtlasSource[] {
  return args.inputs.map((input, sourceOrder) => {
    if (!input.position) {
      throw new Error(`${input.anonymousSourceId} is missing source position.`);
    }

    const tuple = args.tupleForInput(input);

    return {
      sourceId: input.anonymousSourceId,
      vertexId: input.anonymousSourceId,
      position: copyVec3(input.position),
      amplitude: tuple.amplitude,
      waveNumber: tuple.waveNumber,
      phase: tuple.phase,
      attenuation: tuple.attenuation,
      sourceKind: 'ambo-midpoint-child',
      sourceOrder,
      policyName: args.candidateLawId,
    };
  });
}

function buildRawPropagatedDetectorInput(args: {
  candidateLawId: StructuredSourceStateCandidateReductionLawId;
  sources: FieldAtlasSource[];
}): StructuredSourceStateCandidateReductionLawDetectorInput {
  const samples = PROBE_SET.map((probe) =>
    sampleFieldAtlasAtPoint(args.sources, probe.position, {
      sampleId: probe.anonymousProbeId,
    }),
  );

  return buildDetectorInputFromSamples({
    candidateLawId: args.candidateLawId,
    sources: args.sources,
    samples,
  });
}

function buildStructuralChannelDetectorInput(args: {
  candidateLawId: StructuredSourceStateCandidateReductionLawId;
  sources: FieldAtlasSource[];
}): StructuredSourceStateCandidateReductionLawDetectorInput {
  const probes = PROBE_SET.map((probe) => {
    const rawSample = sampleFieldAtlasAtPoint(args.sources, probe.position, {
      sampleId: probe.anonymousProbeId,
    });
    const contributions = args.sources.map((source) => {
      const rawContribution = rawSample.contributions.find(
        (contribution) => contribution.sourceId === source.sourceId,
      );

      if (!rawContribution) {
        return {
          anonymousSourceId: source.sourceId,
          re: Number.NaN,
          im: Number.NaN,
          magnitude: Number.NaN,
          ratio: Number.NaN,
        };
      }

      const carrierAngle = source.waveNumber * distanceVec3(source.position, probe.position);
      const dephased = multiplyComplexByUnitAngle(
        rawContribution.value,
        -carrierAngle,
      );

      return {
        anonymousSourceId: source.sourceId,
        re: dephased.re,
        im: dephased.im,
        magnitude: rawContribution.magnitude,
        ratio: rawContribution.ratio,
      };
    });
    const aggregateField = contributions.reduce(
      (sum, contribution) => ({
        re: sum.re + contribution.re,
        im: sum.im + contribution.im,
      }),
      { re: 0, im: 0 },
    );

    return {
      anonymousProbeId: probe.anonymousProbeId,
      aggregateField: {
        re: aggregateField.re,
        im: aggregateField.im,
        intensity: squaredMagnitude(aggregateField),
        phase: Math.atan2(aggregateField.im, aggregateField.re),
      },
      contributions,
    };
  });

  return {
    candidateLawId: args.candidateLawId,
    anonymousSourceIds: args.sources.map((source) => source.sourceId),
    probes,
  };
}

function buildDetectorInputFromSamples(args: {
  candidateLawId: StructuredSourceStateCandidateReductionLawId;
  sources: FieldAtlasSource[];
  samples: FieldAtlasSample[];
}): StructuredSourceStateCandidateReductionLawDetectorInput {
  return {
    candidateLawId: args.candidateLawId,
    anonymousSourceIds: args.sources.map((source) => source.sourceId),
    probes: args.samples.map((sample) => ({
      anonymousProbeId: sample.id,
      aggregateField: {
        re: sample.psi.re,
        im: sample.psi.im,
        intensity: sample.intensity,
        phase: sample.phase,
      },
      contributions: sample.contributions.map((contribution) => ({
        anonymousSourceId: contribution.sourceId,
        re: contribution.value.re,
        im: contribution.value.im,
        magnitude: contribution.magnitude,
        ratio: contribution.ratio,
      })),
    })),
  };
}

function detectAntiAlignmentPairs(
  input: StructuredSourceStateCandidateReductionLawDetectorInput,
  hiddenTruth: StructuredSourceStateHiddenTruth[],
): {
  inferredPairs: Array<[string, string]>;
  pairScores: StructuredSourceStateCandidateReductionLawPairScore[];
  totalScore: number;
  recoveredTruthPairCount: number;
  falsePositiveCount: number;
  ambiguityCount: number;
  confidence: number;
  recoveryStatus: StructuredSourceStateCandidateReductionLawRecoveryStatus;
} {
  const matchings = buildPerfectMatchings(input.anonymousSourceIds);
  const scoredMatchings = matchings.map((matching) => {
    const pairScores = matching.map(([leftId, rightId]) =>
      scoreCandidatePair(input, leftId, rightId),
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
  const recoveryStatus: StructuredSourceStateCandidateReductionLawRecoveryStatus =
    recoveredTruthPairCount === 3 &&
    falsePositiveCount === 0 &&
    ambiguityCount === 1
      ? 'pass'
      : ambiguityCount > 1
        ? 'ambiguous'
        : 'fail';

  return {
    inferredPairs: best.matching.map(([leftId, rightId]) => [leftId, rightId]),
    pairScores,
    totalScore: best.totalScore,
    recoveredTruthPairCount,
    falsePositiveCount,
    ambiguityCount,
    confidence,
    recoveryStatus,
  };
}

function scoreCandidatePair(
  input: StructuredSourceStateCandidateReductionLawDetectorInput,
  leftAnonymousSourceId: string,
  rightAnonymousSourceId: string,
): number {
  const probeScores = input.probes
    .map((probe) => {
      const left = probe.contributions.find(
        (contribution) =>
          contribution.anonymousSourceId === leftAnonymousSourceId,
      );
      const right = probe.contributions.find(
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

  if (!probeScores.length) {
    return Number.POSITIVE_INFINITY;
  }

  return averageNumbers(probeScores);
}

function pickCandidateComparisonStatus(
  reports: StructuredSourceStateCandidateReductionLawReport[],
): StructuredSourceStateCandidateReductionLawComparisonStatus {
  const structuralSplit = reports.find(
    (report) => report.candidateLawId === C4L_S1_CANDIDATE_LAW_ID,
  );
  const orbitCommon = reports.find(
    (report) => report.candidateLawId === C4L_O1_CANDIDATE_LAW_ID,
  );

  if (structuralSplit?.recoveryStatus === 'pass') {
    return 'structural-propagation-split-supported-for-next-design';
  }

  if (orbitCommon?.recoveryStatus === 'pass') {
    return 'orbit-common-carrier-supported-for-review';
  }

  if (
    structuralSplit?.recoveryStatus === 'ambiguous' ||
    orbitCommon?.recoveryStatus === 'ambiguous'
  ) {
    return 'ambiguous-candidate-comparison';
  }

  return 'no-revised-candidate-supported';
}

function pickRecommendedNextGate(args: {
  candidateReports: StructuredSourceStateCandidateReductionLawReport[];
  candidateComparisonStatus: StructuredSourceStateCandidateReductionLawComparisonStatus;
  rawFieldBehaviorCandidatePasses: boolean;
}): StructuredSourceStateCandidateReductionLawComparisonRecommendedNextGate {
  if (args.rawFieldBehaviorCandidatePasses) {
    return 'Gate C.5-review';
  }

  if (
    args.candidateReports.some(
      (report) =>
        report.candidateLawId === C4L_S1_CANDIDATE_LAW_ID &&
        report.recoveryStatus === 'pass',
    )
  ) {
    return 'Gate C.4L-D2';
  }

  if (args.candidateComparisonStatus === 'ambiguous-candidate-comparison') {
    return 'Gate C.4L-review';
  }

  return 'Gate C.4L-revise';
}

function pickStrongestCandidate(
  reports: StructuredSourceStateCandidateReductionLawReport[],
): StructuredSourceStateCandidateReductionLawReport | undefined {
  const revisedCandidates = reports.filter(
    (report) =>
      report.candidateFamily === 'orbit-common-carrier' ||
      report.candidateFamily === 'structural-propagation-split',
  );

  return [...revisedCandidates].sort(compareCandidateStrength)[0];
}

function compareCandidateStrength(
  left: StructuredSourceStateCandidateReductionLawReport,
  right: StructuredSourceStateCandidateReductionLawReport,
): number {
  const leftRank = recoveryRank(left.recoveryStatus);
  const rightRank = recoveryRank(right.recoveryStatus);

  if (leftRank !== rightRank) {
    return rightRank - leftRank;
  }

  if (left.recoveredTruthPairCount !== right.recoveredTruthPairCount) {
    return right.recoveredTruthPairCount - left.recoveredTruthPairCount;
  }

  if (left.falsePositiveCount !== right.falsePositiveCount) {
    return left.falsePositiveCount - right.falsePositiveCount;
  }

  if (left.ambiguityCount !== right.ambiguityCount) {
    return left.ambiguityCount - right.ambiguityCount;
  }

  return right.confidence - left.confidence;
}

function recoveryRank(
  status: StructuredSourceStateCandidateReductionLawRecoveryStatus,
): number {
  if (status === 'pass') {
    return 3;
  }

  return status === 'ambiguous' ? 2 : 1;
}

function buildIntegrityIssues(args: {
  emittedRegimes: StructuredSourceStateComparedRegimeReport[];
  fieldBehaviorRegimes: FieldBehaviorComparedRegime[];
  r4s1EmittedRegime: StructuredSourceStateComparedRegimeReport | undefined;
  candidateReports: StructuredSourceStateCandidateReductionLawReport[];
}): StructuredSourceStateCandidateReductionLawComparisonIssue[] {
  const issues: StructuredSourceStateCandidateReductionLawComparisonIssue[] = [];

  for (const regimeId of EXPECTED_UPSTREAM_REGIME_IDS) {
    if (!findEmittedRegime(args.emittedRegimes, regimeId)) {
      issues.push({
        code: 'missing-upstream-regime',
        message: `Missing emitted-recovery upstream regime ${regimeId}.`,
        candidateLawId: regimeId,
      });
    }

    if (!findFieldBehaviorRegime(args.fieldBehaviorRegimes, regimeId)) {
      issues.push({
        code: 'missing-upstream-regime',
        message: `Missing field-behavior upstream regime ${regimeId}.`,
        candidateLawId: regimeId,
      });
    }
  }

  if (!r4s1EmittedSourcesAreUsable(args.r4s1EmittedRegime)) {
    issues.push({
      code: 'missing-r4s1-emitted-sources',
      message:
        'R4-S1 emitted sources must include finite emitted tuples and source positions.',
      candidateLawId: R4S1_CANDIDATE_LAW_ID,
    });
  }

  if (!args.candidateReports.length) {
    issues.push({
      code: 'no-candidate-reports',
      message: 'No candidate reports were produced.',
    });
  }

  for (const report of args.candidateReports) {
    if (report.detectorInputAnonymizationStatus !== 'anonymized') {
      issues.push({
        code: 'detector-input-leaks-label',
        message: `${report.candidateLawId} detector input is not anonymized.`,
        candidateLawId: report.candidateLawId,
      });
    }

    for (const code of buildDetectorInputLeakIssueCodes(report.detectorInput)) {
      issues.push({
        code,
        message: `${report.candidateLawId} detector input leaks ${code}.`,
        candidateLawId: report.candidateLawId,
      });
    }

    if (!report.pairScores.length) {
      issues.push({
        code: 'no-pair-scores',
        message: `${report.candidateLawId} produced no pair scores.`,
        candidateLawId: report.candidateLawId,
      });
    }

    if (
      report.pairScores.some((score) => !Number.isFinite(score.pairScore)) ||
      !Number.isFinite(report.totalScore) ||
      !Number.isFinite(report.confidence)
    ) {
      issues.push({
        code: 'non-finite-candidate-score',
        message: `${report.candidateLawId} produced a non-finite candidate score.`,
        candidateLawId: report.candidateLawId,
      });
    }
  }

  return issues;
}

function buildDetectorInputLeakIssueCodes(
  input: StructuredSourceStateCandidateReductionLawDetectorInput,
): StructuredSourceStateCandidateReductionLawComparisonIssueCode[] {
  const issueCodes: StructuredSourceStateCandidateReductionLawComparisonIssueCode[] = [];

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
    !detectorInputIsAnonymized(input) ||
    objectHasKeyMatching(input, /label|edgeStateId|childSiteId/i)
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

function detectorInputIsAnonymized(
  input: StructuredSourceStateCandidateReductionLawDetectorInput,
): boolean {
  const sourceIds = [
    ...input.anonymousSourceIds,
    ...input.probes.flatMap((probe) =>
      probe.contributions.map((contribution) => contribution.anonymousSourceId),
    ),
  ];

  return (
    sourceIds.every(
      (sourceId) =>
        /^S\d+$/.test(sourceId) && !/[A-D]{2}|M_[A-D]{2}|axis:/i.test(sourceId),
    ) &&
    input.probes.every((probe) => /^P\d+$/.test(probe.anonymousProbeId))
  );
}

function detectorInputIsClean(
  input: StructuredSourceStateCandidateReductionLawDetectorInput,
): boolean {
  return buildDetectorInputLeakIssueCodes(input).length === 0;
}

function r4s1EmittedSourcesAreUsable(
  regime: StructuredSourceStateComparedRegimeReport | undefined,
): regime is StructuredSourceStateComparedRegimeReport {
  return Boolean(
    regime &&
      regime.detectorInputs.length > 0 &&
      regime.detectorInputs.every(
        (input) =>
          input.position &&
          vec3IsFinite(input.position) &&
          input.emittedTuple &&
          tupleIsFinite(input.emittedTuple),
      ),
  );
}

function candidateStatusForRecovery(
  status: StructuredSourceStateCandidateReductionLawRecoveryStatus,
): StructuredSourceStateCandidateReductionLawCandidateStatus {
  if (status === 'pass') {
    return 'candidate-supported-under-declared-basis';
  }

  return status === 'ambiguous'
    ? 'candidate-ambiguous-under-declared-basis'
    : 'candidate-failed-under-declared-basis';
}

function findEmittedRegime(
  regimes: StructuredSourceStateComparedRegimeReport[],
  regimeId: string,
): StructuredSourceStateComparedRegimeReport | undefined {
  return regimes.find((regime) => regime.regimeId === regimeId);
}

function findFieldBehaviorRegime(
  regimes: FieldBehaviorComparedRegime[],
  regimeId: string,
): FieldBehaviorComparedRegime | undefined {
  return regimes.find((regime) => regime.regimeId === regimeId);
}

function requireEmittedTuple(input: StructuredSourceStateDetectorInput): EmittedTuple {
  if (!input.emittedTuple) {
    throw new Error(`${input.anonymousSourceId} is missing emitted tuple.`);
  }

  return {
    amplitude: input.emittedTuple.amplitude,
    waveNumber: input.emittedTuple.waveNumber,
    phase: input.emittedTuple.phase,
    attenuation: input.emittedTuple.attenuation,
  };
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

function contributionIsFinite(
  contribution: StructuredSourceStateCandidateReductionLawContributionInput,
): boolean {
  return (
    Number.isFinite(contribution.re) &&
    Number.isFinite(contribution.im) &&
    Number.isFinite(contribution.magnitude) &&
    Number.isFinite(contribution.ratio)
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

function vec3IsFinite(vector: Vec3): boolean {
  return vector.every((coordinate) => Number.isFinite(coordinate));
}

function distanceVec3(left: Vec3, right: Vec3): number {
  return Math.hypot(left[0] - right[0], left[1] - right[1], left[2] - right[2]);
}

function multiplyComplexByUnitAngle(
  value: { re: number; im: number },
  angle: number,
): { re: number; im: number } {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  return {
    re: value.re * cos - value.im * sin,
    im: value.re * sin + value.im * cos,
  };
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

function copyVec3(vector: Vec3): Vec3 {
  return [vector[0], vector[1], vector[2]];
}

function copyHiddenTruth(
  hiddenTruth: StructuredSourceStateHiddenTruth[],
): StructuredSourceStateHiddenTruth[] {
  return hiddenTruth.map((truth) => ({ ...truth }));
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

import type { Vec3 } from '../types/geometry';
import {
  sampleFieldAtlasAtPoint,
  type FieldAtlasSample,
  type FieldAtlasSource,
} from './fieldAtlas';
import { buildStructuredSourceStateEmittedRecoveryV0Report } from './structuredSourceStateEmittedRecoveryV0';

export type StructuredSourceStateFieldBehaviorRecoveryV0Method =
  'structured-source-state-field-behavior-recovery-v0';
export type StructuredSourceStateFieldBehaviorRecoveryV0Scope =
  'blind-field-behavior-recovery-only';
export type StructuredSourceStateFieldBehaviorRecoveryParentGate = 'Gate C.4';
export type StructuredSourceStateFieldBehaviorRecoveryRegimeId =
  'structured-source-state-antipodal-covariant-v0';
export type StructuredSourceStateFieldBehaviorRecoveryCandidateReductionLawId =
  'r4-s1-harmonic-wave-number-star-sign-phase-v0';
export type StructuredSourceStateFieldBehaviorRecoveryUpstreamMethod =
  'structured-source-state-emitted-recovery-v0';
export type StructuredSourceStateFieldBehaviorRecoverySemanticStatus =
  'not-semantic-naming';
export type StructuredSourceStateFieldBehaviorRecoveryTopologyStatus =
  'not-topology-workspace';
export type StructuredSourceStateFieldBehaviorRecoveryPacketWriteStatus =
  'not-packet-writing';
export type StructuredSourceStateFieldBehaviorRecoveryShapeMutationStatus =
  'not-shape-mutation';
export type StructuredSourceStateFieldBehaviorRecoveryOperationRegistryStatus =
  'not-operation-registry-work';
export type StructuredSourceStateFieldBehaviorRecoveryUiExposureStatus =
  'not-ui-work';
export type StructuredSourceStateFieldBehaviorRecoveryDiagnosticIntegrityStatus =
  | 'pass'
  | 'fail';
export type StructuredSourceStateFieldBehaviorRecoveryStatus =
  | 'pass'
  | 'fail'
  | 'ambiguous';
export type StructuredSourceStateGateC4CandidateStatus =
  | 'candidate-passes-field-behavior-recovery'
  | 'candidate-fails-field-behavior-recovery'
  | 'candidate-ambiguous-field-behavior-recovery';
export type StructuredSourceStateFieldSamplerStatus = 'sampled' | 'failed';
export type StructuredSourceStateFieldSampleFiniteStatus =
  | 'finite'
  | 'non-finite';
export type StructuredSourceStateFieldBehaviorAnonymizationStatus =
  | 'anonymized'
  | 'leaked-label';
export type StructuredSourceStateDetectorInputCleanlinessStatus =
  | 'clean'
  | 'leaked';

type UpstreamReport = ReturnType<typeof buildStructuredSourceStateEmittedRecoveryV0Report>;
type UpstreamComparedRegime = UpstreamReport['comparedRegimes'][number];
type UpstreamDetectorRecovery = UpstreamComparedRegime['geometryOnlyRecovery'];
type UpstreamHiddenTruth = UpstreamComparedRegime['hiddenTruth'][number];

export interface StructuredSourceStateFieldBehaviorContributionInput {
  anonymousSourceId: string;
  re: number;
  im: number;
  magnitude: number;
  ratio: number;
}

export interface StructuredSourceStateFieldBehaviorProbeInput {
  anonymousProbeId: string;
  aggregateField: {
    re: number;
    im: number;
    intensity: number;
    phase: number;
  };
  contributions: StructuredSourceStateFieldBehaviorContributionInput[];
}

export interface StructuredSourceStateFieldBehaviorDetectorInput {
  regimeId: string;
  anonymousSourceIds: string[];
  probes: StructuredSourceStateFieldBehaviorProbeInput[];
}

export interface StructuredSourceStateFieldBehaviorRecoveredPair {
  leftAnonymousSourceId: string;
  rightAnonymousSourceId: string;
  pairScore: number;
  recoveredTruthPair: boolean;
}

export interface StructuredSourceStateFieldBehaviorDetectorRecovery {
  detectorKind: 'field-behavior-only';
  inferredPairs: Array<[string, string]>;
  pairScores: StructuredSourceStateFieldBehaviorRecoveredPair[];
  totalScore: number;
  confidence: number;
  falsePositiveCount: number;
  recoveredTruthPairCount: number;
  recoveryStatus: StructuredSourceStateFieldBehaviorRecoveryStatus;
  ambiguityCount: number;
  recoveryBasis: 'field-behavior';
  matchingCount: number;
  scoringRule: {
    pairScoreDefinition: string;
    weighting: 'unweighted';
  };
}

export interface StructuredSourceStateFieldBehaviorComparedRegimeReport {
  regimeId: string;
  role: UpstreamComparedRegime['role'];
  expectedRecovery: UpstreamComparedRegime['expectedRecovery'];
  emittedSourceCount: number;
  fieldReadyCount: number;
  probeCount: number;
  sampleCount: number;
  sampleContributionCount: number;
  samplerStatus: StructuredSourceStateFieldSamplerStatus;
  fieldSampleFiniteStatus: StructuredSourceStateFieldSampleFiniteStatus;
  fieldBehaviorDetectorInputAnonymizationStatus: StructuredSourceStateFieldBehaviorAnonymizationStatus;
  fieldBehaviorDetectorInputCleanlinessStatus: StructuredSourceStateDetectorInputCleanlinessStatus;
  fieldBehaviorDetectorInput: StructuredSourceStateFieldBehaviorDetectorInput;
  hiddenTruth: UpstreamComparedRegime['hiddenTruth'];
  geometryOnlyRecovery: UpstreamDetectorRecovery;
  emissionOnlyRecovery: UpstreamDetectorRecovery;
  fieldBehaviorOnlyRecovery: StructuredSourceStateFieldBehaviorDetectorRecovery;
  samplerErrors: string[];
  notes: string[];
}

export interface StructuredSourceStateFieldBehaviorComparisonSummary {
  uniformFieldBehaviorRecoveryStatus: StructuredSourceStateFieldBehaviorRecoveryStatus;
  pythagoreanFieldBehaviorRecoveryStatus: StructuredSourceStateFieldBehaviorRecoveryStatus;
  r0FieldBehaviorRecoveryStatus: StructuredSourceStateFieldBehaviorRecoveryStatus;
  r4s1FieldBehaviorRecoveryStatus: StructuredSourceStateFieldBehaviorRecoveryStatus;
  r4s1FieldBehaviorOutperformsControls: boolean;
  fieldBehaviorRecoveryStatus: StructuredSourceStateFieldBehaviorRecoveryStatus;
  r4s1Confidence: number;
  pythagoreanConfidence: number;
  r0Confidence: number;
  uniformConfidence: number;
}

export type StructuredSourceStateFieldBehaviorRecoveryIssueCode =
  | 'missing-compared-regime'
  | 'field-sampler-failed'
  | 'detector-input-leaks-source-position'
  | 'detector-input-leaks-probe-position'
  | 'detector-input-leaks-emitted-tuple'
  | 'detector-input-leaks-label'
  | 'detector-input-leaks-hidden-truth'
  | 'detector-used-axis-pair'
  | 'fieldcue-import-detected'
  | 'generated-site-reading-import-detected'
  | 'operation-registry-contaminated'
  | 'non-finite-field-sample'
  | 'no-field-samples'
  | 'no-field-contributions';

export interface StructuredSourceStateFieldBehaviorRecoveryIssue {
  code: StructuredSourceStateFieldBehaviorRecoveryIssueCode;
  message: string;
  regimeId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export type StructuredSourceStateFieldBehaviorCandidateOutcomeNote =
  | 'r4s1-field-behavior-recovery-failed'
  | 'r4s1-field-behavior-ambiguous'
  | 'control-recovers-as-strongly-as-candidate'
  | 'geometry-only-confused-with-field-behavior'
  | 'emission-only-confused-with-field-behavior';

export interface StructuredSourceStateFieldBehaviorRecoveryV0Report {
  method: StructuredSourceStateFieldBehaviorRecoveryV0Method;
  diagnosticScope: StructuredSourceStateFieldBehaviorRecoveryV0Scope;
  parentGate: StructuredSourceStateFieldBehaviorRecoveryParentGate;
  sourceStateRegimeId: StructuredSourceStateFieldBehaviorRecoveryRegimeId;
  candidateReductionLawId: StructuredSourceStateFieldBehaviorRecoveryCandidateReductionLawId;
  upstreamEmittedRecoveryMethod: StructuredSourceStateFieldBehaviorRecoveryUpstreamMethod;
  semanticStatus: StructuredSourceStateFieldBehaviorRecoverySemanticStatus;
  topologyStatus: StructuredSourceStateFieldBehaviorRecoveryTopologyStatus;
  packetWriteStatus: StructuredSourceStateFieldBehaviorRecoveryPacketWriteStatus;
  shapeMutationStatus: StructuredSourceStateFieldBehaviorRecoveryShapeMutationStatus;
  operationRegistryStatus: StructuredSourceStateFieldBehaviorRecoveryOperationRegistryStatus;
  uiExposureStatus: StructuredSourceStateFieldBehaviorRecoveryUiExposureStatus;
  probeSet: {
    probeCount: number;
    anonymousProbeIds: string[];
    positionExposureStatus: 'not-exposed-to-detector-input';
  };
  comparedRegimes: StructuredSourceStateFieldBehaviorComparedRegimeReport[];
  comparisonSummary: StructuredSourceStateFieldBehaviorComparisonSummary;
  diagnosticIntegrityStatus: StructuredSourceStateFieldBehaviorRecoveryDiagnosticIntegrityStatus;
  r4s1FieldBehaviorRecoveryStatus: StructuredSourceStateFieldBehaviorRecoveryStatus;
  gateC4CandidateStatus: StructuredSourceStateGateC4CandidateStatus;
  boundaryStatus: {
    fieldCueImportStatus: 'not-imported';
    generatedSiteReadingImportStatus: 'not-imported';
    fieldCueV0Status: 'blocked';
    generatedSiteReadingV0Status: 'blocked';
    gateC5ControlComparisonStatus: 'pending-if-candidate-passes-or-needs-refinement';
    fullR4ArchitectureStatus: 'not-proven-by-r4-s1';
    fieldAtlasMutationStatus: 'not-mutated';
    fieldAtlasSourcePolicyMutationStatus: 'not-mutated';
    operationRegistryStatus: StructuredSourceStateFieldBehaviorRecoveryOperationRegistryStatus;
  };
  integrityIssueCount: number;
  integrityIssues: StructuredSourceStateFieldBehaviorRecoveryIssue[];
  candidateOutcomeNotes: StructuredSourceStateFieldBehaviorCandidateOutcomeNote[];
  ok: boolean;
}

const METHOD: StructuredSourceStateFieldBehaviorRecoveryV0Method =
  'structured-source-state-field-behavior-recovery-v0';
const DIAGNOSTIC_SCOPE: StructuredSourceStateFieldBehaviorRecoveryV0Scope =
  'blind-field-behavior-recovery-only';
const PARENT_GATE: StructuredSourceStateFieldBehaviorRecoveryParentGate =
  'Gate C.4';
const SOURCE_STATE_REGIME_ID: StructuredSourceStateFieldBehaviorRecoveryRegimeId =
  'structured-source-state-antipodal-covariant-v0';
const CANDIDATE_REDUCTION_LAW_ID: StructuredSourceStateFieldBehaviorRecoveryCandidateReductionLawId =
  'r4-s1-harmonic-wave-number-star-sign-phase-v0';
const UPSTREAM_EMITTED_RECOVERY_METHOD: StructuredSourceStateFieldBehaviorRecoveryUpstreamMethod =
  'structured-source-state-emitted-recovery-v0';
const SEMANTIC_STATUS: StructuredSourceStateFieldBehaviorRecoverySemanticStatus =
  'not-semantic-naming';
const TOPOLOGY_STATUS: StructuredSourceStateFieldBehaviorRecoveryTopologyStatus =
  'not-topology-workspace';
const PACKET_WRITE_STATUS: StructuredSourceStateFieldBehaviorRecoveryPacketWriteStatus =
  'not-packet-writing';
const SHAPE_MUTATION_STATUS: StructuredSourceStateFieldBehaviorRecoveryShapeMutationStatus =
  'not-shape-mutation';
const OPERATION_REGISTRY_STATUS: StructuredSourceStateFieldBehaviorRecoveryOperationRegistryStatus =
  'not-operation-registry-work';
const UI_EXPOSURE_STATUS: StructuredSourceStateFieldBehaviorRecoveryUiExposureStatus =
  'not-ui-work';
const FIELD_BEHAVIOR_PAIR_SCORE_DEFINITION =
  'mean magnitude(unit(z_i)+unit(z_j)) across fixed anonymous probes with nonzero contributions';
const EXPECTED_REGIME_IDS = [
  'uniform-circle-fixture-bad-control',
  'pythagorean-tetrachord-scalar-baseline',
  'r0-metadata-only-structured-control',
  CANDIDATE_REDUCTION_LAW_ID,
] as const;
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

export function buildStructuredSourceStateFieldBehaviorRecoveryV0Report(): StructuredSourceStateFieldBehaviorRecoveryV0Report {
  const upstreamReport = buildStructuredSourceStateEmittedRecoveryV0Report();
  const comparedRegimes = upstreamReport.comparedRegimes.map(
    buildFieldBehaviorComparedRegimeReport,
  );
  const comparisonSummary = buildComparisonSummary(comparedRegimes);
  const candidateOutcomeNotes = buildCandidateOutcomeNotes(
    comparedRegimes,
    comparisonSummary,
  );
  const integrityIssues = buildIntegrityIssues(comparedRegimes);
  const diagnosticIntegrityStatus: StructuredSourceStateFieldBehaviorRecoveryDiagnosticIntegrityStatus =
    integrityIssues.length === 0 ? 'pass' : 'fail';
  const r4s1 = requireRegime(
    comparedRegimes,
    CANDIDATE_REDUCTION_LAW_ID,
  );
  const gateC4CandidateStatus = pickGateC4CandidateStatus(
    r4s1.fieldBehaviorOnlyRecovery.recoveryStatus,
    comparisonSummary.r4s1FieldBehaviorOutperformsControls,
  );

  return {
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    parentGate: PARENT_GATE,
    sourceStateRegimeId: SOURCE_STATE_REGIME_ID,
    candidateReductionLawId: CANDIDATE_REDUCTION_LAW_ID,
    upstreamEmittedRecoveryMethod: UPSTREAM_EMITTED_RECOVERY_METHOD,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    shapeMutationStatus: SHAPE_MUTATION_STATUS,
    operationRegistryStatus: OPERATION_REGISTRY_STATUS,
    uiExposureStatus: UI_EXPOSURE_STATUS,
    probeSet: {
      probeCount: PROBE_SET.length,
      anonymousProbeIds: PROBE_SET.map((probe) => probe.anonymousProbeId),
      positionExposureStatus: 'not-exposed-to-detector-input',
    },
    comparedRegimes,
    comparisonSummary,
    diagnosticIntegrityStatus,
    r4s1FieldBehaviorRecoveryStatus:
      r4s1.fieldBehaviorOnlyRecovery.recoveryStatus,
    gateC4CandidateStatus,
    boundaryStatus: {
      fieldCueImportStatus: 'not-imported',
      generatedSiteReadingImportStatus: 'not-imported',
      fieldCueV0Status: 'blocked',
      generatedSiteReadingV0Status: 'blocked',
      gateC5ControlComparisonStatus:
        'pending-if-candidate-passes-or-needs-refinement',
      fullR4ArchitectureStatus: 'not-proven-by-r4-s1',
      fieldAtlasMutationStatus: 'not-mutated',
      fieldAtlasSourcePolicyMutationStatus: 'not-mutated',
      operationRegistryStatus: OPERATION_REGISTRY_STATUS,
    },
    integrityIssueCount: integrityIssues.length,
    integrityIssues,
    candidateOutcomeNotes,
    ok: diagnosticIntegrityStatus === 'pass',
  };
}

function buildFieldBehaviorComparedRegimeReport(
  upstreamRegime: UpstreamComparedRegime,
): StructuredSourceStateFieldBehaviorComparedRegimeReport {
  const samplerErrors: string[] = [];
  let fieldAtlasSources: FieldAtlasSource[] = [];
  let samples: FieldAtlasSample[] = [];

  try {
    fieldAtlasSources = buildAnonymousFieldAtlasSources(upstreamRegime);
    samples = PROBE_SET.map((probe) =>
      sampleFieldAtlasAtPoint(fieldAtlasSources, probe.position, {
        sampleId: probe.anonymousProbeId,
      }),
    );
  } catch (error) {
    samplerErrors.push(error instanceof Error ? error.message : String(error));
  }

  const fieldBehaviorDetectorInput = buildFieldBehaviorDetectorInput(
    upstreamRegime.regimeId,
    fieldAtlasSources,
    samples,
  );
  const fieldBehaviorOnlyRecovery = detectFieldBehaviorOnly(
    fieldBehaviorDetectorInput,
    upstreamRegime.hiddenTruth,
  );
  const sampleContributionCount = samples.reduce(
    (sum, sample) => sum + sample.contributions.length,
    0,
  );
  const fieldSampleFiniteStatus: StructuredSourceStateFieldSampleFiniteStatus =
    samples.length > 0 && samples.every(fieldAtlasSampleIsFinite)
      ? 'finite'
      : 'non-finite';
  const samplerStatus: StructuredSourceStateFieldSamplerStatus =
    samplerErrors.length === 0 &&
    samples.length === PROBE_SET.length &&
    sampleContributionCount > 0 &&
    fieldSampleFiniteStatus === 'finite'
      ? 'sampled'
      : 'failed';

  return {
    regimeId: upstreamRegime.regimeId,
    role: upstreamRegime.role,
    expectedRecovery: upstreamRegime.expectedRecovery,
    emittedSourceCount: upstreamRegime.emittedSourceCount,
    fieldReadyCount: upstreamRegime.fieldReadyCount,
    probeCount: PROBE_SET.length,
    sampleCount: samples.length,
    sampleContributionCount,
    samplerStatus,
    fieldSampleFiniteStatus,
    fieldBehaviorDetectorInputAnonymizationStatus:
      fieldBehaviorDetectorInputIsAnonymized(fieldBehaviorDetectorInput)
        ? 'anonymized'
        : 'leaked-label',
    fieldBehaviorDetectorInputCleanlinessStatus:
      fieldBehaviorDetectorInputIsClean(fieldBehaviorDetectorInput)
        ? 'clean'
        : 'leaked',
    fieldBehaviorDetectorInput,
    hiddenTruth: upstreamRegime.hiddenTruth,
    geometryOnlyRecovery: upstreamRegime.geometryOnlyRecovery,
    emissionOnlyRecovery: upstreamRegime.emissionOnlyRecovery,
    fieldBehaviorOnlyRecovery,
    samplerErrors,
    notes: [
      ...upstreamRegime.notes,
      'Gate C.4 samples fixed anonymous probes and runs a field-behavior-only detector over anonymized contributions.',
    ],
  };
}

function buildAnonymousFieldAtlasSources(
  regime: UpstreamComparedRegime,
): FieldAtlasSource[] {
  return regime.detectorInputs.map((input, sourceOrder) => {
    if (!input.position) {
      throw new Error(
        `${regime.regimeId} source ${input.anonymousSourceId} is missing internal sampler position.`,
      );
    }

    if (!input.emittedTuple) {
      throw new Error(
        `${regime.regimeId} source ${input.anonymousSourceId} is missing internal emitted tuple.`,
      );
    }

    if (
      !vec3IsFinite(input.position) ||
      !Number.isFinite(input.emittedTuple.amplitude) ||
      !Number.isFinite(input.emittedTuple.waveNumber) ||
      !Number.isFinite(input.emittedTuple.phase) ||
      !Number.isFinite(input.emittedTuple.attenuation)
    ) {
      throw new Error(
        `${regime.regimeId} source ${input.anonymousSourceId} has non-finite internal sampler parameters.`,
      );
    }

    return {
      sourceId: input.anonymousSourceId,
      vertexId: input.anonymousSourceId,
      position: copyVec3(input.position),
      amplitude: input.emittedTuple.amplitude,
      waveNumber: input.emittedTuple.waveNumber,
      phase: input.emittedTuple.phase,
      attenuation: input.emittedTuple.attenuation,
      sourceKind: 'ambo-midpoint-child',
      sourceOrder,
      policyName:
        'gate-c4-r4-s1-field-behavior-diagnostic-internal-source-population',
    };
  });
}

function buildFieldBehaviorDetectorInput(
  regimeId: string,
  sources: FieldAtlasSource[],
  samples: FieldAtlasSample[],
): StructuredSourceStateFieldBehaviorDetectorInput {
  const sourceIds = sources.map((source) => source.sourceId);

  return {
    regimeId,
    anonymousSourceIds: sourceIds,
    probes: samples.map((sample) => ({
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

function detectFieldBehaviorOnly(
  input: StructuredSourceStateFieldBehaviorDetectorInput,
  hiddenTruth: UpstreamHiddenTruth[],
): StructuredSourceStateFieldBehaviorDetectorRecovery {
  const matchings = buildPerfectMatchings(input.anonymousSourceIds);
  const scoredMatchings = matchings.map((matching) => {
    const pairScores = matching.map(([leftId, rightId]) =>
      scoreFieldBehaviorPair(input, leftId, rightId),
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
  const confidence = computeFieldBehaviorConfidence(
    best.totalScore,
    secondBest?.totalScore,
    pairScores.length,
    ambiguityCount,
  );
  const recoveryStatus: StructuredSourceStateFieldBehaviorRecoveryStatus =
    recoveredTruthPairCount === 3 &&
    falsePositiveCount === 0 &&
    ambiguityCount === 1
      ? 'pass'
      : ambiguityCount > 1
        ? 'ambiguous'
        : 'fail';

  return {
    detectorKind: 'field-behavior-only',
    inferredPairs: best.matching.map(([leftId, rightId]) => [leftId, rightId]),
    pairScores,
    totalScore: best.totalScore,
    confidence,
    falsePositiveCount,
    recoveredTruthPairCount,
    recoveryStatus,
    ambiguityCount,
    recoveryBasis: 'field-behavior',
    matchingCount: matchings.length,
    scoringRule: {
      pairScoreDefinition: FIELD_BEHAVIOR_PAIR_SCORE_DEFINITION,
      weighting: 'unweighted',
    },
  };
}

function scoreFieldBehaviorPair(
  input: StructuredSourceStateFieldBehaviorDetectorInput,
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

function buildComparisonSummary(
  regimes: StructuredSourceStateFieldBehaviorComparedRegimeReport[],
): StructuredSourceStateFieldBehaviorComparisonSummary {
  const uniform = requireRegime(regimes, 'uniform-circle-fixture-bad-control');
  const pythagorean = requireRegime(
    regimes,
    'pythagorean-tetrachord-scalar-baseline',
  );
  const r0 = requireRegime(regimes, 'r0-metadata-only-structured-control');
  const r4s1 = requireRegime(regimes, CANDIDATE_REDUCTION_LAW_ID);
  const r4s1Recovery = r4s1.fieldBehaviorOnlyRecovery;
  const controlRecoveries = [uniform, pythagorean, r0].map(
    (regime) => regime.fieldBehaviorOnlyRecovery,
  );
  const r4s1OutperformsControls =
    r4s1Recovery.recoveryStatus === 'pass' &&
    r4s1Recovery.recoveredTruthPairCount === 3 &&
    r4s1Recovery.falsePositiveCount === 0 &&
    r4s1Recovery.confidence > pythagorean.fieldBehaviorOnlyRecovery.confidence &&
    r4s1Recovery.confidence > r0.fieldBehaviorOnlyRecovery.confidence &&
    controlRecoveries.every(
      (recovery) =>
        recovery.recoveredTruthPairCount !== 3 ||
        recovery.falsePositiveCount !== 0 ||
        recovery.recoveryStatus !== 'pass',
    );

  return {
    uniformFieldBehaviorRecoveryStatus:
      uniform.fieldBehaviorOnlyRecovery.recoveryStatus,
    pythagoreanFieldBehaviorRecoveryStatus:
      pythagorean.fieldBehaviorOnlyRecovery.recoveryStatus,
    r0FieldBehaviorRecoveryStatus: r0.fieldBehaviorOnlyRecovery.recoveryStatus,
    r4s1FieldBehaviorRecoveryStatus: r4s1Recovery.recoveryStatus,
    r4s1FieldBehaviorOutperformsControls: r4s1OutperformsControls,
    fieldBehaviorRecoveryStatus: r4s1OutperformsControls ? 'pass' : 'fail',
    r4s1Confidence: r4s1Recovery.confidence,
    pythagoreanConfidence: pythagorean.fieldBehaviorOnlyRecovery.confidence,
    r0Confidence: r0.fieldBehaviorOnlyRecovery.confidence,
    uniformConfidence: uniform.fieldBehaviorOnlyRecovery.confidence,
  };
}

function buildIntegrityIssues(
  regimes: StructuredSourceStateFieldBehaviorComparedRegimeReport[],
): StructuredSourceStateFieldBehaviorRecoveryIssue[] {
  const issues: StructuredSourceStateFieldBehaviorRecoveryIssue[] = [];

  for (const regimeId of EXPECTED_REGIME_IDS) {
    if (!regimes.some((regime) => regime.regimeId === regimeId)) {
      issues.push({
        code: 'missing-compared-regime',
        message: `Missing compared regime ${regimeId}.`,
        regimeId,
      });
    }
  }

  for (const regime of regimes) {
    if (regime.samplerStatus !== 'sampled') {
      issues.push({
        code: 'field-sampler-failed',
        message: `Field sampler failed for ${regime.regimeId}.`,
        regimeId: regime.regimeId,
        details: {
          sampleCount: regime.sampleCount,
          sampleContributionCount: regime.sampleContributionCount,
        },
      });
    }

    if (regime.sampleCount === 0) {
      issues.push({
        code: 'no-field-samples',
        message: `No field samples were produced for ${regime.regimeId}.`,
        regimeId: regime.regimeId,
      });
    }

    if (regime.sampleContributionCount === 0) {
      issues.push({
        code: 'no-field-contributions',
        message: `No field contributions were produced for ${regime.regimeId}.`,
        regimeId: regime.regimeId,
      });
    }

    if (regime.fieldSampleFiniteStatus !== 'finite') {
      issues.push({
        code: 'non-finite-field-sample',
        message: `One or more field samples for ${regime.regimeId} were non-finite.`,
        regimeId: regime.regimeId,
      });
    }

    if (
      regime.fieldBehaviorDetectorInputAnonymizationStatus !== 'anonymized'
    ) {
      issues.push({
        code: 'detector-input-leaks-label',
        message: `Field-behavior detector input for ${regime.regimeId} exposes a label.`,
        regimeId: regime.regimeId,
      });
    }

    issues.push(
      ...buildDetectorInputLeakIssues(
        regime.regimeId,
        regime.fieldBehaviorDetectorInput,
      ),
    );
  }

  return issues;
}

function buildDetectorInputLeakIssues(
  regimeId: string,
  input: StructuredSourceStateFieldBehaviorDetectorInput,
): StructuredSourceStateFieldBehaviorRecoveryIssue[] {
  const issues: StructuredSourceStateFieldBehaviorRecoveryIssue[] = [];

  if (objectHasKeyMatching(input, /sourcePosition|position/i)) {
    issues.push({
      code: 'detector-input-leaks-source-position',
      message: `Field-behavior detector input for ${regimeId} exposes source position data.`,
      regimeId,
    });
  }

  if (objectHasKeyMatching(input, /probePosition|samplePosition/i)) {
    issues.push({
      code: 'detector-input-leaks-probe-position',
      message: `Field-behavior detector input for ${regimeId} exposes probe position data.`,
      regimeId,
    });
  }

  if (objectHasKeyMatching(input, /emittedTuple|waveNumber|attenuation|amplitude/i)) {
    issues.push({
      code: 'detector-input-leaks-emitted-tuple',
      message: `Field-behavior detector input for ${regimeId} exposes emitted tuple data.`,
      regimeId,
    });
  }

  if (objectHasKeyMatching(input, /label|edgeStateId|childSiteId/i)) {
    issues.push({
      code: 'detector-input-leaks-label',
      message: `Field-behavior detector input for ${regimeId} exposes source labels.`,
      regimeId,
    });
  }

  if (objectHasKeyMatching(input, /hidden|truth|antipodal/i)) {
    issues.push({
      code: 'detector-input-leaks-hidden-truth',
      message: `Field-behavior detector input for ${regimeId} exposes hidden truth.`,
      regimeId,
    });
  }

  if (objectHasKeyMatching(input, /axisPair|axisId|axis:/i)) {
    issues.push({
      code: 'detector-used-axis-pair',
      message: `Field-behavior detector input for ${regimeId} exposes axis-pair data.`,
      regimeId,
    });
  }

  return issues;
}

function buildCandidateOutcomeNotes(
  regimes: StructuredSourceStateFieldBehaviorComparedRegimeReport[],
  summary: StructuredSourceStateFieldBehaviorComparisonSummary,
): StructuredSourceStateFieldBehaviorCandidateOutcomeNote[] {
  const notes: StructuredSourceStateFieldBehaviorCandidateOutcomeNote[] = [];
  const r4s1 = requireRegime(regimes, CANDIDATE_REDUCTION_LAW_ID);
  const controlRecoveries = regimes
    .filter((regime) => regime.regimeId !== CANDIDATE_REDUCTION_LAW_ID)
    .map((regime) => regime.fieldBehaviorOnlyRecovery);

  if (r4s1.fieldBehaviorOnlyRecovery.recoveryStatus === 'fail') {
    notes.push('r4s1-field-behavior-recovery-failed');
  }

  if (r4s1.fieldBehaviorOnlyRecovery.recoveryStatus === 'ambiguous') {
    notes.push('r4s1-field-behavior-ambiguous');
  }

  if (
    controlRecoveries.some(
      (recovery) =>
        recovery.recoveryStatus === 'pass' ||
        recovery.confidence >= r4s1.fieldBehaviorOnlyRecovery.confidence,
    ) ||
    !summary.r4s1FieldBehaviorOutperformsControls
  ) {
    notes.push('control-recovers-as-strongly-as-candidate');
  }

  if (
    r4s1.geometryOnlyRecovery.recoveryStatus === 'pass' &&
    r4s1.fieldBehaviorOnlyRecovery.recoveryStatus !== 'pass'
  ) {
    notes.push('geometry-only-confused-with-field-behavior');
  }

  if (
    r4s1.emissionOnlyRecovery.recoveryStatus === 'pass' &&
    r4s1.fieldBehaviorOnlyRecovery.recoveryStatus !== 'pass'
  ) {
    notes.push('emission-only-confused-with-field-behavior');
  }

  return Array.from(new Set(notes));
}

function pickGateC4CandidateStatus(
  r4s1RecoveryStatus: StructuredSourceStateFieldBehaviorRecoveryStatus,
  outperformsControls: boolean,
): StructuredSourceStateGateC4CandidateStatus {
  if (r4s1RecoveryStatus === 'pass' && outperformsControls) {
    return 'candidate-passes-field-behavior-recovery';
  }

  if (r4s1RecoveryStatus === 'ambiguous') {
    return 'candidate-ambiguous-field-behavior-recovery';
  }

  return 'candidate-fails-field-behavior-recovery';
}

function fieldBehaviorDetectorInputIsAnonymized(
  input: StructuredSourceStateFieldBehaviorDetectorInput,
): boolean {
  const sourceIds = [
    ...input.anonymousSourceIds,
    ...input.probes.flatMap((probe) =>
      probe.contributions.map((contribution) => contribution.anonymousSourceId),
    ),
  ];

  return sourceIds.every(
    (sourceId) =>
      /^S\d+$/.test(sourceId) && !/[A-D]{2}|M_[A-D]{2}|axis:/i.test(sourceId),
  );
}

function fieldBehaviorDetectorInputIsClean(
  input: StructuredSourceStateFieldBehaviorDetectorInput,
): boolean {
  return buildDetectorInputLeakIssues('detector-input-cleanliness-check', input)
    .length === 0;
}

function fieldAtlasSampleIsFinite(sample: FieldAtlasSample): boolean {
  return (
    Number.isFinite(sample.psi.re) &&
    Number.isFinite(sample.psi.im) &&
    Number.isFinite(sample.intensity) &&
    Number.isFinite(sample.phase) &&
    sample.contributions.every((contribution) =>
      contributionIsFinite({
        anonymousSourceId: contribution.sourceId,
        re: contribution.value.re,
        im: contribution.value.im,
        magnitude: contribution.magnitude,
        ratio: contribution.ratio,
      }),
    )
  );
}

function contributionIsFinite(
  contribution: StructuredSourceStateFieldBehaviorContributionInput,
): boolean {
  return (
    Number.isFinite(contribution.re) &&
    Number.isFinite(contribution.im) &&
    Number.isFinite(contribution.magnitude) &&
    Number.isFinite(contribution.ratio)
  );
}

function computeFieldBehaviorConfidence(
  totalScore: number,
  secondBestScore: number | undefined,
  pairCount: number,
  ambiguityCount: number,
): number {
  if (!Number.isFinite(totalScore) || pairCount === 0) {
    return 0;
  }

  const maxScore = 2 * pairCount;
  const rawConfidence = 1 - totalScore / maxScore;
  const separationBonus =
    secondBestScore !== undefined && Number.isFinite(secondBestScore)
      ? Math.max(0, Math.min(1, secondBestScore - totalScore)) * 0.01
      : 0;

  return Math.max(
    0,
    Math.min(
      1,
      rawConfidence * (ambiguityCount === 1 ? 1 : 0.5) + separationBonus,
    ),
  );
}

function isTruthPair(
  leftAnonymousSourceId: string,
  rightAnonymousSourceId: string,
  hiddenTruth: UpstreamHiddenTruth[],
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

function requireRegime(
  regimes: StructuredSourceStateFieldBehaviorComparedRegimeReport[],
  regimeId: string,
): StructuredSourceStateFieldBehaviorComparedRegimeReport {
  const regime = regimes.find((candidate) => candidate.regimeId === regimeId);

  if (!regime) {
    throw new Error(`Missing field-behavior compared regime ${regimeId}.`);
  }

  return regime;
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

function averageNumbers(values: number[]): number {
  if (!values.length) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function vec3IsFinite(vector: Vec3): boolean {
  return vector.every((coordinate) => Number.isFinite(coordinate));
}

function copyVec3(vector: Vec3): Vec3 {
  return [vector[0], vector[1], vector[2]];
}

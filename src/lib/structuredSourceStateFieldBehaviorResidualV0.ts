import {
  buildStructuredSourceStateFieldBehaviorRecoveryV0Report,
  type StructuredSourceStateFieldBehaviorComparedRegimeReport,
  type StructuredSourceStateFieldBehaviorDetectorInput,
  type StructuredSourceStateFieldBehaviorRecoveryStatus,
} from './structuredSourceStateFieldBehaviorRecoveryV0';

export type StructuredSourceStateFieldBehaviorResidualV0Method =
  'structured-source-state-field-behavior-residual-v0';
export type StructuredSourceStateFieldBehaviorResidualV0Scope =
  'residual-differential-field-behavior-only';
export type StructuredSourceStateFieldBehaviorResidualParentGate =
  'Gate C.4D';
export type StructuredSourceStateFieldBehaviorResidualUpstreamGate =
  'Gate C.4';
export type StructuredSourceStateFieldBehaviorResidualRegimeId =
  'structured-source-state-antipodal-covariant-v0';
export type StructuredSourceStateFieldBehaviorResidualCandidateReductionLawId =
  'r4-s1-harmonic-wave-number-star-sign-phase-v0';
export type StructuredSourceStateFieldBehaviorResidualUpstreamMethod =
  'structured-source-state-field-behavior-recovery-v0';
export type StructuredSourceStateFieldBehaviorResidualSemanticStatus =
  'not-semantic-naming';
export type StructuredSourceStateFieldBehaviorResidualTopologyStatus =
  'not-topology-workspace';
export type StructuredSourceStateFieldBehaviorResidualPacketWriteStatus =
  'not-packet-writing';
export type StructuredSourceStateFieldBehaviorResidualShapeMutationStatus =
  'not-shape-mutation';
export type StructuredSourceStateFieldBehaviorResidualOperationRegistryStatus =
  'not-operation-registry-work';
export type StructuredSourceStateFieldBehaviorResidualUiExposureStatus =
  'not-ui-work';
export type StructuredSourceStateFieldBehaviorResidualDiagnosticIntegrityStatus =
  | 'pass'
  | 'fail';
export type StructuredSourceStateFieldBehaviorResidualCandidateStatus =
  | 'recoverable-residual'
  | 'partial-residual'
  | 'no-residual'
  | 'control-dominant'
  | 'ambiguous-residual';
export type StructuredSourceStateFieldBehaviorResidualRecoveryBasis =
  | 'r4s1-minus-structured-controls'
  | 'r4s1-minus-best-control';
export type StructuredSourceStateFieldBehaviorResidualRecommendedNextGate =
  | 'Gate C.5'
  | 'Gate C.4L'
  | 'Gate C.4D-review';
export type StructuredSourceStateFieldBehaviorResidualDetectorInputStatus =
  | 'clean'
  | 'leaked';
export type StructuredSourceStateFieldBehaviorResidualAnonymizationStatus =
  | 'anonymized'
  | 'leaked-label';

type UpstreamReport = ReturnType<
  typeof buildStructuredSourceStateFieldBehaviorRecoveryV0Report
>;
type UpstreamHiddenTruth = UpstreamReport['comparedRegimes'][number]['hiddenTruth'][number];
type UpstreamGateC4CandidateStatus = UpstreamReport['gateC4CandidateStatus'];

export interface StructuredSourceStateFieldBehaviorResidualPairRow {
  leftAnonymousSourceId: string;
  rightAnonymousSourceId: string;
  pairKey: string;
  recoveredTruthPair: boolean;
  r4s1RawScore: number;
  uniformControlRawScore: number;
  pythagoreanControlRawScore: number;
  r0ControlRawScore: number;
  averageStructuredControlRawScore: number;
  bestControlRawScore: number;
  bestControlRegimeId: string;
  residualVsPythagorean: number;
  residualVsR0: number;
  residualVsStructuredControls: number;
  residualVsBestControl: number;
  r4s1ImprovesVsStructuredControls: boolean;
  r4s1ImprovesVsBestControl: boolean;
  controlDominatesOrTiesR4S1: boolean;
}

export interface StructuredSourceStateFieldBehaviorResidualRecoveredPair {
  leftAnonymousSourceId: string;
  rightAnonymousSourceId: string;
  pairScore: number;
  recoveredTruthPair: boolean;
  meaningfullyNegative: boolean;
}

export interface StructuredSourceStateFieldBehaviorResidualRecovery {
  detectorKind: 'residual-field-behavior-only';
  inferredPairs: Array<[string, string]>;
  pairScores: StructuredSourceStateFieldBehaviorResidualRecoveredPair[];
  totalScore: number;
  confidence: number;
  falsePositiveCount: number;
  recoveredTruthPairCount: number;
  meaningfulNegativeTruthPairCount: number;
  recoveryStatus: StructuredSourceStateFieldBehaviorRecoveryStatus;
  ambiguityCount: number;
  matchingCount: number;
  residualBasis: StructuredSourceStateFieldBehaviorResidualRecoveryBasis;
  scoringRule: {
    pairScoreDefinition: string;
    residualImprovementMargin: number;
    tieTolerance: number;
  };
}

export interface StructuredSourceStateFieldBehaviorResidualDetectorInputAudit {
  regimeId: string;
  anonymizationStatus: StructuredSourceStateFieldBehaviorResidualAnonymizationStatus;
  cleanlinessStatus: StructuredSourceStateFieldBehaviorResidualDetectorInputStatus;
  leakIssueCodes: StructuredSourceStateFieldBehaviorResidualIssueCode[];
}

export type StructuredSourceStateFieldBehaviorResidualIssueCode =
  | 'missing-upstream-regime'
  | 'upstream-diagnostic-integrity-failed'
  | 'upstream-c4-candidate-not-failed-or-ambiguous'
  | 'detector-input-leaks-source-position'
  | 'detector-input-leaks-probe-position'
  | 'detector-input-leaks-emitted-tuple'
  | 'detector-input-leaks-label'
  | 'detector-input-leaks-hidden-truth'
  | 'detector-input-leaks-axis-pair'
  | 'non-finite-residual-score'
  | 'no-pair-residual-rows'
  | 'fieldcue-import-detected'
  | 'generated-site-reading-import-detected'
  | 'operation-registry-contaminated';

export interface StructuredSourceStateFieldBehaviorResidualIssue {
  code: StructuredSourceStateFieldBehaviorResidualIssueCode;
  message: string;
  regimeId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface StructuredSourceStateFieldBehaviorResidualV0Report {
  method: StructuredSourceStateFieldBehaviorResidualV0Method;
  diagnosticScope: StructuredSourceStateFieldBehaviorResidualV0Scope;
  parentGate: StructuredSourceStateFieldBehaviorResidualParentGate;
  upstreamGate: StructuredSourceStateFieldBehaviorResidualUpstreamGate;
  sourceStateRegimeId: StructuredSourceStateFieldBehaviorResidualRegimeId;
  candidateReductionLawId: StructuredSourceStateFieldBehaviorResidualCandidateReductionLawId;
  upstreamMethod: StructuredSourceStateFieldBehaviorResidualUpstreamMethod;
  semanticStatus: StructuredSourceStateFieldBehaviorResidualSemanticStatus;
  topologyStatus: StructuredSourceStateFieldBehaviorResidualTopologyStatus;
  packetWriteStatus: StructuredSourceStateFieldBehaviorResidualPacketWriteStatus;
  shapeMutationStatus: StructuredSourceStateFieldBehaviorResidualShapeMutationStatus;
  operationRegistryStatus: StructuredSourceStateFieldBehaviorResidualOperationRegistryStatus;
  uiExposureStatus: StructuredSourceStateFieldBehaviorResidualUiExposureStatus;
  residualQuestion: string;
  residualScoring: {
    rawPairScoreDefinition: string;
    structuredControlAverageDefinition: string;
    strictAllControlDefinition: string;
    negativeResidualMeaning: string;
    positiveResidualMeaning: string;
    residualImprovementMargin: number;
    tieTolerance: number;
  };
  upstreamDiagnosticIntegrityStatus: UpstreamReport['diagnosticIntegrityStatus'];
  upstreamGateC4CandidateStatus: UpstreamGateC4CandidateStatus;
  upstreamR4S1FieldBehaviorRecoveryStatus: StructuredSourceStateFieldBehaviorRecoveryStatus;
  comparedRegimeIds: string[];
  detectorInputAudits: StructuredSourceStateFieldBehaviorResidualDetectorInputAudit[];
  pairResidualRows: StructuredSourceStateFieldBehaviorResidualPairRow[];
  structuredControlResidualRecovery: StructuredSourceStateFieldBehaviorResidualRecovery;
  strictAllControlResidualRecovery: StructuredSourceStateFieldBehaviorResidualRecovery;
  residualCandidateStatus: StructuredSourceStateFieldBehaviorResidualCandidateStatus;
  residualInterpretationNotes: string[];
  recommendedNextGate: StructuredSourceStateFieldBehaviorResidualRecommendedNextGate;
  boundaryStatus: {
    fieldCueV0Status: 'blocked';
    generatedSiteReadingV0Status: 'blocked';
    gateC5Status:
      | 'pending-residual-review'
      | 'recommended-for-gate-c5-review';
    reductionLawRevisionStatus: 'not-authorized-by-this-diagnostic';
    fieldAtlasMutationStatus: 'not-mutated';
    fieldAtlasSourcePolicyMutationStatus: 'not-mutated';
    operationRegistryStatus: StructuredSourceStateFieldBehaviorResidualOperationRegistryStatus;
  };
  diagnosticIntegrityStatus: StructuredSourceStateFieldBehaviorResidualDiagnosticIntegrityStatus;
  integrityIssueCount: number;
  integrityIssues: StructuredSourceStateFieldBehaviorResidualIssue[];
  ok: boolean;
}

const METHOD: StructuredSourceStateFieldBehaviorResidualV0Method =
  'structured-source-state-field-behavior-residual-v0';
const DIAGNOSTIC_SCOPE: StructuredSourceStateFieldBehaviorResidualV0Scope =
  'residual-differential-field-behavior-only';
const PARENT_GATE: StructuredSourceStateFieldBehaviorResidualParentGate =
  'Gate C.4D';
const UPSTREAM_GATE: StructuredSourceStateFieldBehaviorResidualUpstreamGate =
  'Gate C.4';
const SOURCE_STATE_REGIME_ID: StructuredSourceStateFieldBehaviorResidualRegimeId =
  'structured-source-state-antipodal-covariant-v0';
const CANDIDATE_REDUCTION_LAW_ID: StructuredSourceStateFieldBehaviorResidualCandidateReductionLawId =
  'r4-s1-harmonic-wave-number-star-sign-phase-v0';
const UPSTREAM_METHOD: StructuredSourceStateFieldBehaviorResidualUpstreamMethod =
  'structured-source-state-field-behavior-recovery-v0';
const SEMANTIC_STATUS: StructuredSourceStateFieldBehaviorResidualSemanticStatus =
  'not-semantic-naming';
const TOPOLOGY_STATUS: StructuredSourceStateFieldBehaviorResidualTopologyStatus =
  'not-topology-workspace';
const PACKET_WRITE_STATUS: StructuredSourceStateFieldBehaviorResidualPacketWriteStatus =
  'not-packet-writing';
const SHAPE_MUTATION_STATUS: StructuredSourceStateFieldBehaviorResidualShapeMutationStatus =
  'not-shape-mutation';
const OPERATION_REGISTRY_STATUS: StructuredSourceStateFieldBehaviorResidualOperationRegistryStatus =
  'not-operation-registry-work';
const UI_EXPOSURE_STATUS: StructuredSourceStateFieldBehaviorResidualUiExposureStatus =
  'not-ui-work';
const RAW_PAIR_SCORE_DEFINITION =
  'mean magnitude(unit(z_i)+unit(z_j)) across probes with finite nonzero contributions';
const STRUCTURED_CONTROL_AVERAGE_DEFINITION =
  'average of Pythagorean scalar baseline and R0 metadata-only structured control raw pair scores';
const STRICT_ALL_CONTROL_DEFINITION =
  'minimum raw pair score across uniform, Pythagorean, and R0 controls';
const RESIDUAL_IMPROVEMENT_MARGIN = 1e-9;
const TIE_TOLERANCE = 1e-9;
const EXPECTED_REGIME_IDS = [
  'uniform-circle-fixture-bad-control',
  'pythagorean-tetrachord-scalar-baseline',
  'r0-metadata-only-structured-control',
  CANDIDATE_REDUCTION_LAW_ID,
] as const;

export function buildStructuredSourceStateFieldBehaviorResidualV0Report(): StructuredSourceStateFieldBehaviorResidualV0Report {
  const upstreamReport = buildStructuredSourceStateFieldBehaviorRecoveryV0Report();
  const comparedRegimeIds = upstreamReport.comparedRegimes.map(
    (regime) => regime.regimeId,
  );
  const detectorInputAudits = upstreamReport.comparedRegimes.map(
    buildDetectorInputAudit,
  );
  const r4s1 = findRegime(
    upstreamReport.comparedRegimes,
    CANDIDATE_REDUCTION_LAW_ID,
  );
  const pairResidualRows = r4s1
    ? buildPairResidualRows(upstreamReport.comparedRegimes, r4s1.hiddenTruth)
    : [];
  const structuredControlResidualRecovery = buildResidualRecovery({
    rows: pairResidualRows,
    hiddenTruth: r4s1?.hiddenTruth ?? [],
    residualBasis: 'r4s1-minus-structured-controls',
    scoreForRow: (row) => row.residualVsStructuredControls,
  });
  const strictAllControlResidualRecovery = buildResidualRecovery({
    rows: pairResidualRows,
    hiddenTruth: r4s1?.hiddenTruth ?? [],
    residualBasis: 'r4s1-minus-best-control',
    scoreForRow: (row) => row.residualVsBestControl,
  });
  const integrityIssues = buildIntegrityIssues({
    upstreamReport,
    detectorInputAudits,
    pairResidualRows,
  });
  const diagnosticIntegrityStatus: StructuredSourceStateFieldBehaviorResidualDiagnosticIntegrityStatus =
    integrityIssues.length === 0 ? 'pass' : 'fail';
  const residualCandidateStatus = classifyResidualCandidateStatus({
    pairResidualRows,
    structuredControlResidualRecovery,
    strictAllControlResidualRecovery,
  });
  const recommendedNextGate = pickRecommendedNextGate(residualCandidateStatus);

  return {
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    parentGate: PARENT_GATE,
    upstreamGate: UPSTREAM_GATE,
    sourceStateRegimeId: SOURCE_STATE_REGIME_ID,
    candidateReductionLawId: CANDIDATE_REDUCTION_LAW_ID,
    upstreamMethod: UPSTREAM_METHOD,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    shapeMutationStatus: SHAPE_MUTATION_STATUS,
    operationRegistryStatus: OPERATION_REGISTRY_STATUS,
    uiExposureStatus: UI_EXPOSURE_STATUS,
    residualQuestion:
      'Does R4-S1 leave recoverable source-regime residue after subtracting, contrasting, normalizing, or otherwise isolating geometry/common propagation effects?',
    residualScoring: {
      rawPairScoreDefinition: RAW_PAIR_SCORE_DEFINITION,
      structuredControlAverageDefinition: STRUCTURED_CONTROL_AVERAGE_DEFINITION,
      strictAllControlDefinition: STRICT_ALL_CONTROL_DEFINITION,
      negativeResidualMeaning:
        'R4-S1 made the pair more anti-aligned than the compared control.',
      positiveResidualMeaning:
        'A control was as good as or better than R4-S1 for the pair.',
      residualImprovementMargin: RESIDUAL_IMPROVEMENT_MARGIN,
      tieTolerance: TIE_TOLERANCE,
    },
    upstreamDiagnosticIntegrityStatus:
      upstreamReport.diagnosticIntegrityStatus,
    upstreamGateC4CandidateStatus: upstreamReport.gateC4CandidateStatus,
    upstreamR4S1FieldBehaviorRecoveryStatus:
      upstreamReport.r4s1FieldBehaviorRecoveryStatus,
    comparedRegimeIds,
    detectorInputAudits,
    pairResidualRows,
    structuredControlResidualRecovery,
    strictAllControlResidualRecovery,
    residualCandidateStatus,
    residualInterpretationNotes: buildResidualInterpretationNotes({
      residualCandidateStatus,
      structuredControlResidualRecovery,
      strictAllControlResidualRecovery,
      pairResidualRows,
    }),
    recommendedNextGate,
    boundaryStatus: {
      fieldCueV0Status: 'blocked',
      generatedSiteReadingV0Status: 'blocked',
      gateC5Status:
        residualCandidateStatus === 'recoverable-residual'
          ? 'recommended-for-gate-c5-review'
          : 'pending-residual-review',
      reductionLawRevisionStatus: 'not-authorized-by-this-diagnostic',
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

function buildPairResidualRows(
  regimes: StructuredSourceStateFieldBehaviorComparedRegimeReport[],
  hiddenTruth: UpstreamHiddenTruth[],
): StructuredSourceStateFieldBehaviorResidualPairRow[] {
  const uniform = findRegime(regimes, 'uniform-circle-fixture-bad-control');
  const pythagorean = findRegime(
    regimes,
    'pythagorean-tetrachord-scalar-baseline',
  );
  const r0 = findRegime(regimes, 'r0-metadata-only-structured-control');
  const r4s1 = findRegime(regimes, CANDIDATE_REDUCTION_LAW_ID);

  if (!uniform || !pythagorean || !r0 || !r4s1) {
    return [];
  }

  return buildSourcePairs(r4s1.fieldBehaviorDetectorInput.anonymousSourceIds).map(
    ([leftAnonymousSourceId, rightAnonymousSourceId]) => {
      const r4s1RawScore = scoreFieldBehaviorPair(
        r4s1.fieldBehaviorDetectorInput,
        leftAnonymousSourceId,
        rightAnonymousSourceId,
      );
      const uniformControlRawScore = scoreFieldBehaviorPair(
        uniform.fieldBehaviorDetectorInput,
        leftAnonymousSourceId,
        rightAnonymousSourceId,
      );
      const pythagoreanControlRawScore = scoreFieldBehaviorPair(
        pythagorean.fieldBehaviorDetectorInput,
        leftAnonymousSourceId,
        rightAnonymousSourceId,
      );
      const r0ControlRawScore = scoreFieldBehaviorPair(
        r0.fieldBehaviorDetectorInput,
        leftAnonymousSourceId,
        rightAnonymousSourceId,
      );
      const averageStructuredControlRawScore = averageNumbers([
        pythagoreanControlRawScore,
        r0ControlRawScore,
      ]);
      const controlScores = [
        {
          regimeId: uniform.regimeId,
          rawScore: uniformControlRawScore,
        },
        {
          regimeId: pythagorean.regimeId,
          rawScore: pythagoreanControlRawScore,
        },
        {
          regimeId: r0.regimeId,
          rawScore: r0ControlRawScore,
        },
      ];
      const bestControl = controlScores.reduce((best, candidate) =>
        candidate.rawScore < best.rawScore ? candidate : best,
      );
      const residualVsPythagorean =
        r4s1RawScore - pythagoreanControlRawScore;
      const residualVsR0 = r4s1RawScore - r0ControlRawScore;
      const residualVsStructuredControls =
        r4s1RawScore - averageStructuredControlRawScore;
      const residualVsBestControl = r4s1RawScore - bestControl.rawScore;

      return {
        leftAnonymousSourceId,
        rightAnonymousSourceId,
        pairKey: pairKey(leftAnonymousSourceId, rightAnonymousSourceId),
        recoveredTruthPair: isTruthPair(
          leftAnonymousSourceId,
          rightAnonymousSourceId,
          hiddenTruth,
        ),
        r4s1RawScore,
        uniformControlRawScore,
        pythagoreanControlRawScore,
        r0ControlRawScore,
        averageStructuredControlRawScore,
        bestControlRawScore: bestControl.rawScore,
        bestControlRegimeId: bestControl.regimeId,
        residualVsPythagorean,
        residualVsR0,
        residualVsStructuredControls,
        residualVsBestControl,
        r4s1ImprovesVsStructuredControls:
          residualVsStructuredControls < -RESIDUAL_IMPROVEMENT_MARGIN,
        r4s1ImprovesVsBestControl:
          residualVsBestControl < -RESIDUAL_IMPROVEMENT_MARGIN,
        controlDominatesOrTiesR4S1:
          residualVsBestControl >= -RESIDUAL_IMPROVEMENT_MARGIN,
      };
    },
  );
}

function buildResidualRecovery(args: {
  rows: StructuredSourceStateFieldBehaviorResidualPairRow[];
  hiddenTruth: UpstreamHiddenTruth[];
  residualBasis: StructuredSourceStateFieldBehaviorResidualRecoveryBasis;
  scoreForRow: (
    row: StructuredSourceStateFieldBehaviorResidualPairRow,
  ) => number;
}): StructuredSourceStateFieldBehaviorResidualRecovery {
  const sourceIds = uniqueStrings(
    args.rows.flatMap((row) => [
      row.leftAnonymousSourceId,
      row.rightAnonymousSourceId,
    ]),
  );
  const rowByPairKey = new Map(args.rows.map((row) => [row.pairKey, row]));
  const matchings = buildPerfectMatchings(sourceIds);
  const scoredMatchings = matchings.map((matching) => {
    const pairScores = matching.map(([leftId, rightId]) => {
      const row = rowByPairKey.get(pairKey(leftId, rightId));

      return row ? args.scoreForRow(row) : Number.POSITIVE_INFINITY;
    });

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
    (scored) =>
      Math.abs(scored.totalScore - best.totalScore) <= TIE_TOLERANCE,
  ).length;
  const pairScores = best.matching.map(([leftId, rightId], index) => {
    const pairScore = best.pairScores[index] ?? Number.POSITIVE_INFINITY;

    return {
      leftAnonymousSourceId: leftId,
      rightAnonymousSourceId: rightId,
      pairScore,
      recoveredTruthPair: isTruthPair(leftId, rightId, args.hiddenTruth),
      meaningfullyNegative:
        pairScore < -RESIDUAL_IMPROVEMENT_MARGIN &&
        Number.isFinite(pairScore),
    };
  });
  const recoveredTruthPairCount = pairScores.filter(
    (score) => score.recoveredTruthPair,
  ).length;
  const meaningfulNegativeTruthPairCount = pairScores.filter(
    (score) => score.recoveredTruthPair && score.meaningfullyNegative,
  ).length;
  const falsePositiveCount = pairScores.length - recoveredTruthPairCount;
  const recoveryStatus: StructuredSourceStateFieldBehaviorRecoveryStatus =
    recoveredTruthPairCount === 3 &&
    falsePositiveCount === 0 &&
    ambiguityCount === 1 &&
    pairScores.every((score) => score.meaningfullyNegative)
      ? 'pass'
      : ambiguityCount > 1
        ? 'ambiguous'
        : 'fail';

  return {
    detectorKind: 'residual-field-behavior-only',
    inferredPairs: best.matching.map(([leftId, rightId]) => [leftId, rightId]),
    pairScores,
    totalScore: best.totalScore,
    confidence: computeResidualConfidence({
      pairScores,
      secondBestScore: secondBest?.totalScore,
      totalScore: best.totalScore,
      ambiguityCount,
    }),
    falsePositiveCount,
    recoveredTruthPairCount,
    meaningfulNegativeTruthPairCount,
    recoveryStatus,
    ambiguityCount,
    matchingCount: matchings.length,
    residualBasis: args.residualBasis,
    scoringRule: {
      pairScoreDefinition: args.residualBasis,
      residualImprovementMargin: RESIDUAL_IMPROVEMENT_MARGIN,
      tieTolerance: TIE_TOLERANCE,
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

function classifyResidualCandidateStatus(args: {
  pairResidualRows: StructuredSourceStateFieldBehaviorResidualPairRow[];
  structuredControlResidualRecovery: StructuredSourceStateFieldBehaviorResidualRecovery;
  strictAllControlResidualRecovery: StructuredSourceStateFieldBehaviorResidualRecovery;
}): StructuredSourceStateFieldBehaviorResidualCandidateStatus {
  if (args.strictAllControlResidualRecovery.recoveryStatus === 'pass') {
    return 'recoverable-residual';
  }

  if (
    args.strictAllControlResidualRecovery.recoveryStatus === 'ambiguous' ||
    args.structuredControlResidualRecovery.recoveryStatus === 'ambiguous'
  ) {
    return 'ambiguous-residual';
  }

  if (
    args.structuredControlResidualRecovery.recoveryStatus === 'pass' ||
    (args.structuredControlResidualRecovery.recoveredTruthPairCount >= 2 &&
      args.structuredControlResidualRecovery
        .meaningfulNegativeTruthPairCount >= 2)
  ) {
    return 'partial-residual';
  }

  const truthRows = args.pairResidualRows.filter((row) => row.recoveredTruthPair);
  const structuredTruthImprovementCount = truthRows.filter(
    (row) => row.r4s1ImprovesVsStructuredControls,
  ).length;
  const strictTruthImprovementCount = truthRows.filter(
    (row) => row.r4s1ImprovesVsBestControl,
  ).length;
  const controlDominantRowCount = args.pairResidualRows.filter(
    (row) => row.controlDominatesOrTiesR4S1,
  ).length;

  if (
    controlDominantRowCount >= args.pairResidualRows.length / 2 ||
    strictTruthImprovementCount === 0
  ) {
    return 'control-dominant';
  }

  if (
    args.structuredControlResidualRecovery.recoveredTruthPairCount <= 1 &&
    structuredTruthImprovementCount === 0
  ) {
    return 'no-residual';
  }

  return 'ambiguous-residual';
}

function pickRecommendedNextGate(
  status: StructuredSourceStateFieldBehaviorResidualCandidateStatus,
): StructuredSourceStateFieldBehaviorResidualRecommendedNextGate {
  if (status === 'recoverable-residual') {
    return 'Gate C.5';
  }

  if (status === 'ambiguous-residual') {
    return 'Gate C.4D-review';
  }

  return 'Gate C.4L';
}

function buildResidualInterpretationNotes(args: {
  residualCandidateStatus: StructuredSourceStateFieldBehaviorResidualCandidateStatus;
  structuredControlResidualRecovery: StructuredSourceStateFieldBehaviorResidualRecovery;
  strictAllControlResidualRecovery: StructuredSourceStateFieldBehaviorResidualRecovery;
  pairResidualRows: StructuredSourceStateFieldBehaviorResidualPairRow[];
}): string[] {
  const notes = [
    'Diagnostic success is diagnostic integrity, not candidate success.',
    'C.4D does not unblock FieldCueV0 or GeneratedSiteReadingV0.',
    `structured-control residual recovery: ${args.structuredControlResidualRecovery.recoveryStatus}, recovered ${args.structuredControlResidualRecovery.recoveredTruthPairCount}/3.`,
    `strict all-control residual recovery: ${args.strictAllControlResidualRecovery.recoveryStatus}, recovered ${args.strictAllControlResidualRecovery.recoveredTruthPairCount}/3.`,
    `residual candidate status: ${args.residualCandidateStatus}.`,
  ];
  const truthRows = args.pairResidualRows.filter((row) => row.recoveredTruthPair);
  const strictTruthImprovementCount = truthRows.filter(
    (row) => row.r4s1ImprovesVsBestControl,
  ).length;

  if (strictTruthImprovementCount < truthRows.length) {
    notes.push(
      'One or more truth pairs do not show meaningful R4-S1 improvement beyond every control.',
    );
  }

  if (args.residualCandidateStatus === 'recoverable-residual') {
    notes.push(
      'Recoverable residual may justify Gate C.5 review, but C.4D itself is not Gate C.5.',
    );
  }

  if (
    args.residualCandidateStatus === 'control-dominant' ||
    args.residualCandidateStatus === 'no-residual'
  ) {
    notes.push(
      'Residual evidence does not authorize R4-S1 promotion or R4-S2 implementation in this branch.',
    );
  }

  return notes;
}

function buildIntegrityIssues(args: {
  upstreamReport: UpstreamReport;
  detectorInputAudits: StructuredSourceStateFieldBehaviorResidualDetectorInputAudit[];
  pairResidualRows: StructuredSourceStateFieldBehaviorResidualPairRow[];
}): StructuredSourceStateFieldBehaviorResidualIssue[] {
  const issues: StructuredSourceStateFieldBehaviorResidualIssue[] = [];

  for (const regimeId of EXPECTED_REGIME_IDS) {
    if (!args.upstreamReport.comparedRegimes.some((regime) => regime.regimeId === regimeId)) {
      issues.push({
        code: 'missing-upstream-regime',
        message: `Missing upstream C.4 regime ${regimeId}.`,
        regimeId,
      });
    }
  }

  if (args.upstreamReport.diagnosticIntegrityStatus !== 'pass') {
    issues.push({
      code: 'upstream-diagnostic-integrity-failed',
      message: 'Upstream C.4 diagnostic integrity did not pass.',
    });
  }

  if (
    args.upstreamReport.gateC4CandidateStatus !==
      'candidate-fails-field-behavior-recovery' &&
    args.upstreamReport.gateC4CandidateStatus !==
      'candidate-ambiguous-field-behavior-recovery'
  ) {
    issues.push({
      code: 'upstream-c4-candidate-not-failed-or-ambiguous',
      message:
        'C.4D expected the upstream C.4 candidate to be failed or ambiguous.',
    });
  }

  if (!args.pairResidualRows.length) {
    issues.push({
      code: 'no-pair-residual-rows',
      message: 'Residual diagnostic produced no pair residual rows.',
    });
  }

  for (const audit of args.detectorInputAudits) {
    for (const code of audit.leakIssueCodes) {
      issues.push({
        code,
        message: `Residual detector input audit found ${code} for ${audit.regimeId}.`,
        regimeId: audit.regimeId,
      });
    }
  }

  for (const row of args.pairResidualRows) {
    if (!pairResidualRowIsFinite(row)) {
      issues.push({
        code: 'non-finite-residual-score',
        message: `Residual row ${row.pairKey} contains a non-finite score.`,
        details: {
          r4s1RawScore: row.r4s1RawScore,
          residualVsStructuredControls: row.residualVsStructuredControls,
          residualVsBestControl: row.residualVsBestControl,
        },
      });
    }
  }

  return issues;
}

function buildDetectorInputAudit(
  regime: StructuredSourceStateFieldBehaviorComparedRegimeReport,
): StructuredSourceStateFieldBehaviorResidualDetectorInputAudit {
  const leakIssueCodes = buildDetectorInputLeakIssueCodes(
    regime.fieldBehaviorDetectorInput,
  );
  const anonymized = fieldBehaviorDetectorInputIsAnonymized(
    regime.fieldBehaviorDetectorInput,
  );

  return {
    regimeId: regime.regimeId,
    anonymizationStatus: anonymized ? 'anonymized' : 'leaked-label',
    cleanlinessStatus: leakIssueCodes.length === 0 ? 'clean' : 'leaked',
    leakIssueCodes,
  };
}

function buildDetectorInputLeakIssueCodes(
  input: StructuredSourceStateFieldBehaviorDetectorInput,
): StructuredSourceStateFieldBehaviorResidualIssueCode[] {
  const issueCodes: StructuredSourceStateFieldBehaviorResidualIssueCode[] = [];

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
    !fieldBehaviorDetectorInputIsAnonymized(input) ||
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

function buildSourcePairs(sourceIds: string[]): Array<[string, string]> {
  const pairs: Array<[string, string]> = [];

  for (let leftIndex = 0; leftIndex < sourceIds.length; leftIndex += 1) {
    for (
      let rightIndex = leftIndex + 1;
      rightIndex < sourceIds.length;
      rightIndex += 1
    ) {
      pairs.push([sourceIds[leftIndex], sourceIds[rightIndex]]);
    }
  }

  return pairs;
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

function contributionIsFinite(contribution: {
  re: number;
  im: number;
  magnitude: number;
  ratio: number;
}): boolean {
  return (
    Number.isFinite(contribution.re) &&
    Number.isFinite(contribution.im) &&
    Number.isFinite(contribution.magnitude) &&
    Number.isFinite(contribution.ratio)
  );
}

function pairResidualRowIsFinite(
  row: StructuredSourceStateFieldBehaviorResidualPairRow,
): boolean {
  return [
    row.r4s1RawScore,
    row.uniformControlRawScore,
    row.pythagoreanControlRawScore,
    row.r0ControlRawScore,
    row.averageStructuredControlRawScore,
    row.bestControlRawScore,
    row.residualVsPythagorean,
    row.residualVsR0,
    row.residualVsStructuredControls,
    row.residualVsBestControl,
  ].every(Number.isFinite);
}

function computeResidualConfidence(args: {
  pairScores: StructuredSourceStateFieldBehaviorResidualRecoveredPair[];
  totalScore: number;
  secondBestScore: number | undefined;
  ambiguityCount: number;
}): number {
  if (
    !args.pairScores.length ||
    !Number.isFinite(args.totalScore) ||
    args.pairScores.some((score) => !Number.isFinite(score.pairScore))
  ) {
    return 0;
  }

  const averageAdvantage = averageNumbers(
    args.pairScores.map((score) => Math.max(0, -score.pairScore)),
  );
  const normalizedAdvantage = Math.min(1, averageAdvantage / 2);
  const separationBonus =
    args.secondBestScore !== undefined && Number.isFinite(args.secondBestScore)
      ? Math.max(0, Math.min(1, args.secondBestScore - args.totalScore)) *
        0.01
      : 0;
  const ambiguityFactor = args.ambiguityCount === 1 ? 1 : 0.5;

  return Math.max(
    0,
    Math.min(1, normalizedAdvantage * ambiguityFactor + separationBonus),
  );
}

function findRegime(
  regimes: StructuredSourceStateFieldBehaviorComparedRegimeReport[],
  regimeId: string,
): StructuredSourceStateFieldBehaviorComparedRegimeReport | undefined {
  return regimes.find((regime) => regime.regimeId === regimeId);
}

function pairKey(leftAnonymousSourceId: string, rightAnonymousSourceId: string): string {
  return [leftAnonymousSourceId, rightAnonymousSourceId].sort().join('|');
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

function uniqueStrings<T extends string>(values: T[]): T[] {
  return Array.from(new Set(values));
}

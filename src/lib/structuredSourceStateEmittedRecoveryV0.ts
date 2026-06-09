import type { Vec3 } from '../types/geometry';
import type { FieldSourceEmissionParameters } from './fieldSourceProfiles';
import {
  buildPythagoreanTetrachordQuarkRegimeV0Report,
  type PythagoreanTetrachordChildDerivationRecord,
} from './fieldSourcePythagoreanTetrachordQuarkRegimeV0';
import { buildStructuredSourceStateDiagnosticV0Report } from './structuredSourceStateDiagnosticV0';

export type StructuredSourceStateEmittedRecoveryV0Method =
  'structured-source-state-emitted-recovery-v0';
export type StructuredSourceStateEmittedRecoveryV0Scope =
  'blind-emitted-source-recovery-only';
export type StructuredSourceStateEmittedRecoveryParentGate = 'Gate C.3';
export type StructuredSourceStateEmittedRecoveryRegimeId =
  'structured-source-state-antipodal-covariant-v0';
export type StructuredSourceStateEmittedRecoveryCandidateReductionLawId =
  'r4-s1-harmonic-wave-number-star-sign-phase-v0';
export type StructuredSourceStateEmittedRecoverySemanticStatus =
  'not-semantic-naming';
export type StructuredSourceStateEmittedRecoveryTopologyStatus =
  'not-topology-workspace';
export type StructuredSourceStateEmittedRecoveryPacketWriteStatus =
  'not-packet-writing';
export type StructuredSourceStateEmittedRecoveryShapeMutationStatus =
  'not-shape-mutation';
export type StructuredSourceStateEmittedRecoveryOperationRegistryStatus =
  'not-operation-registry-work';
export type StructuredSourceStateEmittedRecoveryUiExposureStatus =
  'not-ui-work';
export type StructuredSourceStateEmittedRecoveryRegimeRole =
  | 'bad-control'
  | 'harmonic-scalar-baseline'
  | 'metadata-only-structured-control'
  | 'structured-source-state-candidate';
export type StructuredSourceStateExpectedRecovery =
  | 'fail-or-ambiguous'
  | 'weaker-than-structured-candidate'
  | 'same-or-near-same-as-pythagorean-baseline'
  | 'recover-3-of-3-antipodal-axes-by-emitted-phase-relation';
export type StructuredSourceStateRecoveryStatus =
  | 'pass'
  | 'fail'
  | 'ambiguous';
export type StructuredSourceStateGeometryLeakStatus =
  | 'geometry-only-recovers'
  | 'geometry-only-ambiguous'
  | 'geometry-only-fails';
export type StructuredSourceStateAnonymizationStatus =
  | 'anonymized'
  | 'leaked-label';
export type StructuredSourceStateRecoveryVsControlsStatus =
  | 'outperforms-controls'
  | 'not-compared'
  | 'does-not-outperform-controls';

export interface StructuredSourceStateDetectorInput {
  anonymousSourceId: string;
  position?: Vec3;
  emittedTuple?: FieldSourceEmissionParameters;
  regimeId: string;
}

export interface StructuredSourceStateHiddenTruth {
  anonymousSourceId: string;
  hiddenEdgeStateId: string;
  hiddenAntipodalEdgeStateId: string;
  hiddenTruthAxisId: string;
}

export interface StructuredSourceStateAnonymizedEmittedSource {
  detectorInput: StructuredSourceStateDetectorInput;
  hiddenTruth: StructuredSourceStateHiddenTruth;
  fieldReady: boolean;
  reductionNotes: string[];
}

export interface StructuredSourceStateRecoveredPair {
  leftAnonymousSourceId: string;
  rightAnonymousSourceId: string;
  pairScore: number;
  recoveredTruthPair: boolean;
}

export interface StructuredSourceStateDetectorRecovery {
  detectorKind: 'geometry-only' | 'emission-only' | 'combined';
  inferredPairs: Array<[string, string]>;
  pairScores: StructuredSourceStateRecoveredPair[];
  totalScore: number;
  confidence: number;
  falsePositiveCount: number;
  recoveredTruthPairCount: number;
  recoveryStatus: StructuredSourceStateRecoveryStatus;
  ambiguityCount: number;
  recoveryBasis: 'geometry' | 'emission' | 'geometry-and-emission';
}

export interface StructuredSourceStateComparedRegimeReport {
  regimeId: string;
  role: StructuredSourceStateEmittedRecoveryRegimeRole;
  expectedRecovery: StructuredSourceStateExpectedRecovery;
  emittedSourceCount: number;
  fieldReadyCount: number;
  anonymizationStatus: StructuredSourceStateAnonymizationStatus;
  detectorInputs: StructuredSourceStateDetectorInput[];
  hiddenTruth: StructuredSourceStateHiddenTruth[];
  geometryOnlyRecovery: StructuredSourceStateDetectorRecovery;
  emissionOnlyRecovery: StructuredSourceStateDetectorRecovery;
  combinedRecovery: StructuredSourceStateDetectorRecovery;
  recoveryVsControlsStatus: StructuredSourceStateRecoveryVsControlsStatus;
  notes: string[];
}

export interface StructuredSourceStateEmittedRecoveryComparisonSummary {
  uniformRecoveryStatus: StructuredSourceStateRecoveryStatus;
  pythagoreanRecoveryStatus: StructuredSourceStateRecoveryStatus;
  r0RecoveryStatus: StructuredSourceStateRecoveryStatus;
  r4s1RecoveryStatus: StructuredSourceStateRecoveryStatus;
  r4s1OutperformsControls: boolean;
  geometryLeakStatus: StructuredSourceStateGeometryLeakStatus;
  sourceRegimeRecoveryStatus: StructuredSourceStateRecoveryStatus;
}

export type StructuredSourceStateEmittedRecoveryIssueCode =
  | 'detector-input-leaks-label'
  | 'detector-input-leaks-antipodal-truth'
  | 'control-recovers-as-strongly-as-candidate'
  | 'r4s1-recovery-failed'
  | 'r4s1-false-positive'
  | 'geometry-only-confused-with-source-regime'
  | 'missing-control-regime'
  | 'fieldcue-import-detected'
  | 'generated-site-reading-import-detected'
  | 'operation-registry-contaminated';

export interface StructuredSourceStateEmittedRecoveryIssue {
  code: StructuredSourceStateEmittedRecoveryIssueCode;
  message: string;
  regimeId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface StructuredSourceStateEmittedRecoveryV0Report {
  method: StructuredSourceStateEmittedRecoveryV0Method;
  diagnosticScope: StructuredSourceStateEmittedRecoveryV0Scope;
  parentGate: StructuredSourceStateEmittedRecoveryParentGate;
  sourceStateRegimeId: StructuredSourceStateEmittedRecoveryRegimeId;
  candidateReductionLawId: StructuredSourceStateEmittedRecoveryCandidateReductionLawId;
  semanticStatus: StructuredSourceStateEmittedRecoverySemanticStatus;
  topologyStatus: StructuredSourceStateEmittedRecoveryTopologyStatus;
  packetWriteStatus: StructuredSourceStateEmittedRecoveryPacketWriteStatus;
  shapeMutationStatus: StructuredSourceStateEmittedRecoveryShapeMutationStatus;
  operationRegistryStatus: StructuredSourceStateEmittedRecoveryOperationRegistryStatus;
  uiExposureStatus: StructuredSourceStateEmittedRecoveryUiExposureStatus;
  comparedRegimes: StructuredSourceStateComparedRegimeReport[];
  comparisonSummary: StructuredSourceStateEmittedRecoveryComparisonSummary;
  boundaryStatus: {
    fieldCueImportStatus: 'not-imported';
    generatedSiteReadingImportStatus: 'not-imported';
    operationRegistryStatus: StructuredSourceStateEmittedRecoveryOperationRegistryStatus;
    gateC4FieldBehaviorRecoveryStatus: 'pending';
    fieldCueV0Status: 'blocked';
    fullR4ArchitectureStatus: 'not-proven-by-r4-s1';
  };
  issueCount: number;
  ok: boolean;
  issues: StructuredSourceStateEmittedRecoveryIssue[];
}

const METHOD: StructuredSourceStateEmittedRecoveryV0Method =
  'structured-source-state-emitted-recovery-v0';
const DIAGNOSTIC_SCOPE: StructuredSourceStateEmittedRecoveryV0Scope =
  'blind-emitted-source-recovery-only';
const PARENT_GATE: StructuredSourceStateEmittedRecoveryParentGate = 'Gate C.3';
const SOURCE_STATE_REGIME_ID: StructuredSourceStateEmittedRecoveryRegimeId =
  'structured-source-state-antipodal-covariant-v0';
const CANDIDATE_REDUCTION_LAW_ID: StructuredSourceStateEmittedRecoveryCandidateReductionLawId =
  'r4-s1-harmonic-wave-number-star-sign-phase-v0';
const SEMANTIC_STATUS: StructuredSourceStateEmittedRecoverySemanticStatus =
  'not-semantic-naming';
const TOPOLOGY_STATUS: StructuredSourceStateEmittedRecoveryTopologyStatus =
  'not-topology-workspace';
const PACKET_WRITE_STATUS: StructuredSourceStateEmittedRecoveryPacketWriteStatus =
  'not-packet-writing';
const SHAPE_MUTATION_STATUS: StructuredSourceStateEmittedRecoveryShapeMutationStatus =
  'not-shape-mutation';
const OPERATION_REGISTRY_STATUS: StructuredSourceStateEmittedRecoveryOperationRegistryStatus =
  'not-operation-registry-work';
const UI_EXPOSURE_STATUS: StructuredSourceStateEmittedRecoveryUiExposureStatus =
  'not-ui-work';
const TWO_PI = 2 * Math.PI;
const PHASE_OPPOSITION_TOLERANCE = 1e-9;
const GEOMETRY_OPPOSITION_TOLERANCE = 1e-9;
const EDGE_ORDER = ['AB', 'AC', 'AD', 'BC', 'BD', 'CD'] as const;
const COMPLEMENT_BY_EDGE: Record<string, string> = {
  AB: 'CD',
  CD: 'AB',
  AC: 'BD',
  BD: 'AC',
  AD: 'BC',
  BC: 'AD',
};
const AXIS_BY_EDGE: Record<string, string> = {
  AB: 'axis:AB-CD',
  CD: 'axis:AB-CD',
  AC: 'axis:AC-BD',
  BD: 'axis:AC-BD',
  AD: 'axis:AD-BC',
  BC: 'axis:AD-BC',
};
const STAR_SIGN_BY_EDGE: Record<string, 1 | -1> = {
  AB: 1,
  CD: 1,
  AC: -1,
  BD: -1,
  AD: 1,
  BC: 1,
};
const R4S1_REPRESENTATIVE_PHASES: Record<string, number> = {
  AB: 0,
  AC: (2 * Math.PI) / 3,
  AD: (4 * Math.PI) / 3,
};
const MIDPOINT_POSITIONS: Record<string, Vec3> = {
  AB: [1, 0, 0],
  AC: [0, 1, 0],
  AD: [0, 0, 1],
  BC: [0, 0, -1],
  BD: [0, -1, 0],
  CD: [-1, 0, 0],
};

export function buildStructuredSourceStateEmittedRecoveryV0Report(): StructuredSourceStateEmittedRecoveryV0Report {
  const pythagoreanReport = buildPythagoreanTetrachordQuarkRegimeV0Report();
  const scaffoldReport = buildStructuredSourceStateDiagnosticV0Report();
  const comparedRegimes = buildComparedRegimes(pythagoreanReport, scaffoldReport);
  const comparisonSummary = buildComparisonSummary(comparedRegimes);
  applyRecoveryVsControlStatuses(comparedRegimes, comparisonSummary);
  const issues = buildIssues(comparedRegimes, comparisonSummary);

  return {
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    parentGate: PARENT_GATE,
    sourceStateRegimeId: SOURCE_STATE_REGIME_ID,
    candidateReductionLawId: CANDIDATE_REDUCTION_LAW_ID,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    shapeMutationStatus: SHAPE_MUTATION_STATUS,
    operationRegistryStatus: OPERATION_REGISTRY_STATUS,
    uiExposureStatus: UI_EXPOSURE_STATUS,
    comparedRegimes,
    comparisonSummary,
    boundaryStatus: {
      fieldCueImportStatus: 'not-imported',
      generatedSiteReadingImportStatus: 'not-imported',
      operationRegistryStatus: OPERATION_REGISTRY_STATUS,
      gateC4FieldBehaviorRecoveryStatus: 'pending',
      fieldCueV0Status: 'blocked',
      fullR4ArchitectureStatus: 'not-proven-by-r4-s1',
    },
    issueCount: issues.length,
    ok: issues.length === 0,
    issues,
  };
}

function buildComparedRegimes(
  pythagoreanReport: ReturnType<typeof buildPythagoreanTetrachordQuarkRegimeV0Report>,
  scaffoldReport: ReturnType<typeof buildStructuredSourceStateDiagnosticV0Report>,
): StructuredSourceStateComparedRegimeReport[] {
  const pythagoreanRecordsByEdge = new Map(
    pythagoreanReport.childDerivationTable.map((record) => [
      record.sourceEdgeId,
      record,
    ]),
  );
  const scaffoldTupleByEdge = new Map(
    scaffoldReport.generatedChildStates.map((state) => [
      state.edgeStateId,
      state.tupleReduction.emittedTuple,
    ]),
  );

  return [
    buildComparedRegime({
      regimeId: 'uniform-circle-fixture-bad-control',
      role: 'bad-control',
      expectedRecovery: 'fail-or-ambiguous',
      sources: buildUniformControlSources(),
      notes: [
        'Deterministic scalar-invariant bad control; emitted child model is not accepted as field-ready source-state truth.',
        'Emission-only phase opposition should fail or remain ambiguous.',
      ],
    }),
    buildComparedRegime({
      regimeId: 'pythagorean-tetrachord-scalar-baseline',
      role: 'harmonic-scalar-baseline',
      expectedRecovery: 'weaker-than-structured-candidate',
      sources: EDGE_ORDER.map((edge) =>
        buildSourceFromTuple({
          edge,
          tuple:
            requireMapValue(pythagoreanRecordsByEdge, edge).derivedTuple ??
            createNonFiniteTuple(),
          fieldReady: Boolean(requireMapValue(pythagoreanRecordsByEdge, edge).derivedTuple),
          reductionNotes: [
            'Pythagorean scalar baseline uses harmonic derived child tuple.',
          ],
        }),
      ),
      notes: [
        'Finite harmonic scalar baseline; should not recover all axes through emission-only phase opposition.',
      ],
    }),
    buildComparedRegime({
      regimeId: 'r0-metadata-only-structured-control',
      role: 'metadata-only-structured-control',
      expectedRecovery: 'same-or-near-same-as-pythagorean-baseline',
      sources: EDGE_ORDER.map((edge) =>
        buildSourceFromTuple({
          edge,
          tuple: requireMapValue(scaffoldTupleByEdge, edge),
          fieldReady: true,
          reductionNotes: [
            'R0 retains source-state structure as metadata only; emitted tuple is Pythagorean-equivalent.',
          ],
        }),
      ),
      notes: [
        'Structured scaffold control with metadata-only antipodal structure and Pythagorean-equivalent emitted tuples.',
      ],
    }),
    buildComparedRegime({
      regimeId: CANDIDATE_REDUCTION_LAW_ID,
      role: 'structured-source-state-candidate',
      expectedRecovery: 'recover-3-of-3-antipodal-axes-by-emitted-phase-relation',
      sources: EDGE_ORDER.map((edge) => {
        const pythagoreanRecord = requireMapValue(pythagoreanRecordsByEdge, edge);

        return buildSourceFromTuple({
          edge,
          tuple: buildR4S1Tuple(edge, pythagoreanRecord),
          fieldReady: Boolean(pythagoreanRecord.derivedTuple),
          reductionNotes: [
            `starSign=${STAR_SIGN_BY_EDGE[edge]}`,
            'R4-S1 uses harmonic waveNumber/wavelength and star/sign structural phase projection.',
            'phase(star(edge)) = phase(edge) + pi mod 2pi by deterministic star-orbit representative rule.',
          ],
        });
      }),
      notes: [
        'R4-S1 candidate: harmonic component controls waveNumber and structural star/sign polarity controls phase.',
        'Gate C.4 field-behavior recovery remains pending; this does not unlock FieldCueV0.',
      ],
    }),
  ];
}

function buildComparedRegime(args: {
  regimeId: string;
  role: StructuredSourceStateEmittedRecoveryRegimeRole;
  expectedRecovery: StructuredSourceStateExpectedRecovery;
  sources: StructuredSourceStateAnonymizedEmittedSource[];
  notes: string[];
}): StructuredSourceStateComparedRegimeReport {
  const detectorInputs = args.sources.map((source) => source.detectorInput);
  const hiddenTruth = args.sources.map((source) => source.hiddenTruth);
  const geometryOnlyRecovery = detectGeometryOnly(detectorInputs, hiddenTruth);
  const emissionOnlyRecovery = detectEmissionOnly(detectorInputs, hiddenTruth);
  const combinedRecovery = detectCombined(detectorInputs, hiddenTruth);

  return {
    regimeId: args.regimeId,
    role: args.role,
    expectedRecovery: args.expectedRecovery,
    emittedSourceCount: args.sources.length,
    fieldReadyCount: args.sources.filter((source) => source.fieldReady).length,
    anonymizationStatus: areDetectorInputsAnonymized(detectorInputs)
      ? 'anonymized'
      : 'leaked-label',
    detectorInputs,
    hiddenTruth,
    geometryOnlyRecovery,
    emissionOnlyRecovery,
    combinedRecovery,
    recoveryVsControlsStatus: 'not-compared',
    notes: args.notes,
  };
}

function buildUniformControlSources(): StructuredSourceStateAnonymizedEmittedSource[] {
  return EDGE_ORDER.map((edge) =>
    buildSourceFromTuple({
      edge,
      tuple: {
        amplitude: 1,
        waveNumber: Math.PI,
        phase: 0,
        attenuation: 0.05,
      },
      fieldReady: false,
      reductionNotes: [
        'Uniform scalar control emission is deterministic and scalar-invariant.',
        'Marked not field-ready for structured source-state acceptance.',
      ],
    }),
  );
}

function buildSourceFromTuple(args: {
  edge: string;
  tuple: FieldSourceEmissionParameters;
  fieldReady: boolean;
  reductionNotes: string[];
}): StructuredSourceStateAnonymizedEmittedSource {
  const anonymousSourceId = anonymousIdForEdge(args.edge);

  return {
    detectorInput: {
      anonymousSourceId,
      position: copyVec3(MIDPOINT_POSITIONS[args.edge]),
      emittedTuple: copyTuple(args.tuple),
      regimeId: 'blind-regime-input',
    },
    hiddenTruth: {
      anonymousSourceId,
      hiddenEdgeStateId: args.edge,
      hiddenAntipodalEdgeStateId: COMPLEMENT_BY_EDGE[args.edge],
      hiddenTruthAxisId: AXIS_BY_EDGE[args.edge],
    },
    fieldReady: args.fieldReady,
    reductionNotes: [...args.reductionNotes],
  };
}

function buildR4S1Tuple(
  edge: string,
  record: PythagoreanTetrachordChildDerivationRecord,
): FieldSourceEmissionParameters {
  const baseTuple = record.derivedTuple ?? createNonFiniteTuple();

  return {
    amplitude: baseTuple.amplitude,
    waveNumber: record.childWaveNumber,
    phase: r4s1Phase(edge),
    attenuation: baseTuple.attenuation,
  };
}

function r4s1Phase(edge: string): number {
  if (edge in R4S1_REPRESENTATIVE_PHASES) {
    return R4S1_REPRESENTATIVE_PHASES[edge];
  }

  const representative = COMPLEMENT_BY_EDGE[edge];
  const representativePhase = R4S1_REPRESENTATIVE_PHASES[representative];

  if (representativePhase === undefined) {
    throw new Error(`No R4-S1 star-orbit representative for ${edge}.`);
  }

  return normalizePhase(representativePhase + Math.PI);
}

function detectEmissionOnly(
  inputs: StructuredSourceStateDetectorInput[],
  hiddenTruth: StructuredSourceStateHiddenTruth[],
): StructuredSourceStateDetectorRecovery {
  const detectorInputs = inputs.map((input) => ({
    anonymousSourceId: input.anonymousSourceId,
    emittedTuple: input.emittedTuple,
    regimeId: input.regimeId,
  }));

  return detectPerfectMatching({
    detectorKind: 'emission-only',
    inputs: detectorInputs,
    hiddenTruth,
    recoveryBasis: 'emission',
    scorePair: (left, right) => {
      const leftPhase = left.emittedTuple?.phase;
      const rightPhase = right.emittedTuple?.phase;

      if (
        typeof leftPhase !== 'number' ||
        typeof rightPhase !== 'number' ||
        !Number.isFinite(leftPhase) ||
        !Number.isFinite(rightPhase)
      ) {
        return Number.POSITIVE_INFINITY;
      }

      return Math.abs(circularDistance(leftPhase, rightPhase) - Math.PI);
    },
    pairPassTolerance: PHASE_OPPOSITION_TOLERANCE,
  });
}

function detectGeometryOnly(
  inputs: StructuredSourceStateDetectorInput[],
  hiddenTruth: StructuredSourceStateHiddenTruth[],
): StructuredSourceStateDetectorRecovery {
  const detectorInputs = inputs.map((input) => ({
    anonymousSourceId: input.anonymousSourceId,
    position: input.position,
    regimeId: input.regimeId,
  }));

  return detectPerfectMatching({
    detectorKind: 'geometry-only',
    inputs: detectorInputs,
    hiddenTruth,
    recoveryBasis: 'geometry',
    scorePair: (left, right) => {
      if (!left.position || !right.position) {
        return Number.POSITIVE_INFINITY;
      }

      return vectorLength(addVec3(left.position, right.position));
    },
    pairPassTolerance: GEOMETRY_OPPOSITION_TOLERANCE,
  });
}

function detectCombined(
  inputs: StructuredSourceStateDetectorInput[],
  hiddenTruth: StructuredSourceStateHiddenTruth[],
): StructuredSourceStateDetectorRecovery {
  return detectPerfectMatching({
    detectorKind: 'combined',
    inputs,
    hiddenTruth,
    recoveryBasis: 'geometry-and-emission',
    scorePair: (left, right) => {
      const geometryScore =
        left.position && right.position
          ? vectorLength(addVec3(left.position, right.position))
          : Number.POSITIVE_INFINITY;
      const leftPhase = left.emittedTuple?.phase;
      const rightPhase = right.emittedTuple?.phase;
      const emissionScore =
        typeof leftPhase === 'number' &&
        typeof rightPhase === 'number' &&
        Number.isFinite(leftPhase) &&
        Number.isFinite(rightPhase)
          ? Math.abs(circularDistance(leftPhase, rightPhase) - Math.PI)
          : Number.POSITIVE_INFINITY;

      return geometryScore + emissionScore;
    },
    pairPassTolerance: PHASE_OPPOSITION_TOLERANCE + GEOMETRY_OPPOSITION_TOLERANCE,
  });
}

function detectPerfectMatching(args: {
  detectorKind: StructuredSourceStateDetectorRecovery['detectorKind'];
  inputs: StructuredSourceStateDetectorInput[];
  hiddenTruth: StructuredSourceStateHiddenTruth[];
  recoveryBasis: StructuredSourceStateDetectorRecovery['recoveryBasis'];
  scorePair: (
    left: StructuredSourceStateDetectorInput,
    right: StructuredSourceStateDetectorInput,
  ) => number;
  pairPassTolerance: number;
}): StructuredSourceStateDetectorRecovery {
  const matchings = buildPerfectMatchings(args.inputs.map((input) => input.anonymousSourceId));
  const inputById = new Map(args.inputs.map((input) => [input.anonymousSourceId, input]));
  const scoredMatchings = matchings.map((matching) => {
    const pairScores = matching.map(([leftId, rightId]) => {
      const left = requireMapValue(inputById, leftId);
      const right = requireMapValue(inputById, rightId);

      return args.scorePair(left, right);
    });

    return {
      matching,
      pairScores,
      totalScore: pairScores.reduce((sum, score) => sum + score, 0),
    };
  });

  scoredMatchings.sort((left, right) => left.totalScore - right.totalScore);

  const best = scoredMatchings[0];
  const secondBest = scoredMatchings[1];
  const ambiguityCount = scoredMatchings.filter(
    (scored) => Math.abs(scored.totalScore - best.totalScore) <= 1e-9,
  ).length;
  const pairScores = best.matching.map(([leftId, rightId], index) => {
    const pairScore = best.pairScores[index];
    const recoveredTruthPair =
      isTruthPair(leftId, rightId, args.hiddenTruth) &&
      pairScore <= args.pairPassTolerance;

    return {
      leftAnonymousSourceId: leftId,
      rightAnonymousSourceId: rightId,
      pairScore,
      recoveredTruthPair,
    };
  });
  const recoveredTruthPairCount = pairScores.filter(
    (score) => score.recoveredTruthPair,
  ).length;
  const falsePositiveCount = pairScores.length - recoveredTruthPairCount;
  const maxPossibleScore =
    args.detectorKind === 'geometry-only' ? 6 : Math.PI * pairScores.length;
  const rawConfidence = Number.isFinite(best.totalScore)
    ? 1 - best.totalScore / maxPossibleScore
    : 0;
  const separationBonus =
    secondBest && Number.isFinite(secondBest.totalScore)
      ? Math.max(0, Math.min(1, secondBest.totalScore - best.totalScore))
      : 0;
  const confidence = Math.max(
    0,
    Math.min(1, rawConfidence * (ambiguityCount === 1 ? 1 : 0.5) + separationBonus * 0.01),
  );
  const recoveryStatus: StructuredSourceStateRecoveryStatus =
    recoveredTruthPairCount === 3 && falsePositiveCount === 0 && ambiguityCount === 1
      ? 'pass'
      : ambiguityCount > 1
        ? 'ambiguous'
        : 'fail';

  return {
    detectorKind: args.detectorKind,
    inferredPairs: best.matching.map(([leftId, rightId]) => [leftId, rightId]),
    pairScores,
    totalScore: best.totalScore,
    confidence,
    falsePositiveCount,
    recoveredTruthPairCount,
    recoveryStatus,
    ambiguityCount,
    recoveryBasis: args.recoveryBasis,
  };
}

function buildPerfectMatchings(ids: string[]): Array<Array<[string, string]>> {
  if (ids.length === 0) {
    return [[]];
  }

  const [first, ...rest] = ids;
  const matchings: Array<Array<[string, string]>> = [];

  for (let index = 0; index < rest.length; index += 1) {
    const paired = rest[index];
    const remaining = rest.filter((_, remainingIndex) => remainingIndex !== index);

    for (const childMatching of buildPerfectMatchings(remaining)) {
      matchings.push([[first, paired], ...childMatching]);
    }
  }

  return matchings;
}

function buildComparisonSummary(
  regimes: StructuredSourceStateComparedRegimeReport[],
): StructuredSourceStateEmittedRecoveryComparisonSummary {
  const uniform = requireRegime(regimes, 'bad-control');
  const pythagorean = requireRegime(regimes, 'harmonic-scalar-baseline');
  const r0 = requireRegime(regimes, 'metadata-only-structured-control');
  const r4s1 = requireRegime(regimes, 'structured-source-state-candidate');
  const geometryStatus = pickGeometryLeakStatus(r4s1.geometryOnlyRecovery);
  const r4s1OutperformsControls =
    r4s1.emissionOnlyRecovery.recoveryStatus === 'pass' &&
    r4s1.emissionOnlyRecovery.falsePositiveCount === 0 &&
    r4s1.emissionOnlyRecovery.confidence >
      pythagorean.emissionOnlyRecovery.confidence &&
    r4s1.emissionOnlyRecovery.confidence > r0.emissionOnlyRecovery.confidence &&
    pythagorean.emissionOnlyRecovery.recoveryStatus !== 'pass' &&
    r0.emissionOnlyRecovery.recoveryStatus !== 'pass';

  return {
    uniformRecoveryStatus: uniform.emissionOnlyRecovery.recoveryStatus,
    pythagoreanRecoveryStatus: pythagorean.emissionOnlyRecovery.recoveryStatus,
    r0RecoveryStatus: r0.emissionOnlyRecovery.recoveryStatus,
    r4s1RecoveryStatus: r4s1.emissionOnlyRecovery.recoveryStatus,
    r4s1OutperformsControls,
    geometryLeakStatus: geometryStatus,
    sourceRegimeRecoveryStatus: r4s1OutperformsControls ? 'pass' : 'fail',
  };
}

function applyRecoveryVsControlStatuses(
  regimes: StructuredSourceStateComparedRegimeReport[],
  summary: StructuredSourceStateEmittedRecoveryComparisonSummary,
): void {
  for (const regime of regimes) {
    if (regime.role === 'structured-source-state-candidate') {
      regime.recoveryVsControlsStatus = summary.r4s1OutperformsControls
        ? 'outperforms-controls'
        : 'does-not-outperform-controls';
    } else {
      regime.recoveryVsControlsStatus = 'not-compared';
    }
  }
}

function buildIssues(
  regimes: StructuredSourceStateComparedRegimeReport[],
  summary: StructuredSourceStateEmittedRecoveryComparisonSummary,
): StructuredSourceStateEmittedRecoveryIssue[] {
  const issues: StructuredSourceStateEmittedRecoveryIssue[] = [];
  const requiredRoles: StructuredSourceStateEmittedRecoveryRegimeRole[] = [
    'bad-control',
    'harmonic-scalar-baseline',
    'metadata-only-structured-control',
    'structured-source-state-candidate',
  ];

  for (const role of requiredRoles) {
    if (!regimes.some((regime) => regime.role === role)) {
      issues.push({
        code: 'missing-control-regime',
        message: `Missing compared regime with role ${role}.`,
      });
    }
  }

  for (const regime of regimes) {
    if (regime.anonymizationStatus !== 'anonymized') {
      issues.push({
        code: 'detector-input-leaks-label',
        message: `Detector input for ${regime.regimeId} is not anonymized.`,
        regimeId: regime.regimeId,
      });
    }

    if (!regime.detectorInputs.every(detectorInputIsBlind)) {
      issues.push({
        code: 'detector-input-leaks-antipodal-truth',
        message: `Detector input for ${regime.regimeId} exposes hidden truth fields.`,
        regimeId: regime.regimeId,
      });
    }
  }

  const pythagorean = requireRegime(regimes, 'harmonic-scalar-baseline');
  const r0 = requireRegime(regimes, 'metadata-only-structured-control');
  const r4s1 = requireRegime(regimes, 'structured-source-state-candidate');

  if (r4s1.emissionOnlyRecovery.recoveryStatus !== 'pass') {
    issues.push({
      code: 'r4s1-recovery-failed',
      message: 'R4-S1 emission-only detector did not recover all three truth axes.',
      regimeId: r4s1.regimeId,
    });
  }

  if (r4s1.emissionOnlyRecovery.falsePositiveCount !== 0) {
    issues.push({
      code: 'r4s1-false-positive',
      message: 'R4-S1 emission-only detector reported false positives.',
      regimeId: r4s1.regimeId,
      details: {
        falsePositiveCount: r4s1.emissionOnlyRecovery.falsePositiveCount,
      },
    });
  }

  if (
    pythagorean.emissionOnlyRecovery.recoveryStatus === 'pass' ||
    r0.emissionOnlyRecovery.recoveryStatus === 'pass' ||
    !summary.r4s1OutperformsControls
  ) {
    issues.push({
      code: 'control-recovers-as-strongly-as-candidate',
      message: 'One or more controls recover as strongly as the R4-S1 candidate.',
      details: {
        pythagoreanConfidence: pythagorean.emissionOnlyRecovery.confidence,
        r0Confidence: r0.emissionOnlyRecovery.confidence,
        r4s1Confidence: r4s1.emissionOnlyRecovery.confidence,
      },
    });
  }

  if (
    summary.geometryLeakStatus === 'geometry-only-recovers' &&
    summary.sourceRegimeRecoveryStatus !== 'pass'
  ) {
    issues.push({
      code: 'geometry-only-confused-with-source-regime',
      message: 'Geometry-only recovery is present but source-regime recovery did not pass.',
    });
  }

  return issues;
}

function detectorInputIsBlind(input: StructuredSourceStateDetectorInput): boolean {
  const forbiddenKeys = [
    'edgeStateId',
    'childSiteId',
    'complementEdgeStateId',
    'antipodalChildSiteId',
    'axisPairId',
    'hiddenEdgeStateId',
    'hiddenAntipodalEdgeStateId',
    'hiddenTruthAxisId',
  ];

  return forbiddenKeys.every((key) => !(key in input));
}

function areDetectorInputsAnonymized(
  inputs: StructuredSourceStateDetectorInput[],
): boolean {
  return inputs.every(
    (input) =>
      /^S\d+$/.test(input.anonymousSourceId) &&
      !/[A-D]{2}|M_[A-D]{2}|axis:/i.test(input.anonymousSourceId) &&
      detectorInputIsBlind(input),
  );
}

function pickGeometryLeakStatus(
  recovery: StructuredSourceStateDetectorRecovery,
): StructuredSourceStateGeometryLeakStatus {
  if (recovery.recoveryStatus === 'pass') {
    return 'geometry-only-recovers';
  }

  return recovery.recoveryStatus === 'ambiguous'
    ? 'geometry-only-ambiguous'
    : 'geometry-only-fails';
}

function requireRegime(
  regimes: StructuredSourceStateComparedRegimeReport[],
  role: StructuredSourceStateEmittedRecoveryRegimeRole,
): StructuredSourceStateComparedRegimeReport {
  const regime = regimes.find((candidate) => candidate.role === role);

  if (!regime) {
    throw new Error(`Missing compared regime ${role}.`);
  }

  return regime;
}

function isTruthPair(
  leftAnonymousSourceId: string,
  rightAnonymousSourceId: string,
  hiddenTruth: StructuredSourceStateHiddenTruth[],
): boolean {
  const truthByAnonymousId = new Map(
    hiddenTruth.map((truth) => [truth.anonymousSourceId, truth]),
  );
  const left = requireMapValue(truthByAnonymousId, leftAnonymousSourceId);
  const right = requireMapValue(truthByAnonymousId, rightAnonymousSourceId);

  return left.hiddenAntipodalEdgeStateId === right.hiddenEdgeStateId;
}

function anonymousIdForEdge(edge: string): string {
  const anonymizedOrder = ['AD', 'BC', 'AB', 'CD', 'AC', 'BD'];
  const index = anonymizedOrder.indexOf(edge);

  if (index === -1) {
    throw new Error(`Cannot anonymize unknown edge ${edge}.`);
  }

  return `S${index}`;
}

function circularDistance(left: number, right: number): number {
  const leftNormalized = normalizePhase(left);
  const rightNormalized = normalizePhase(right);
  const delta = Math.abs(leftNormalized - rightNormalized);

  return Math.min(delta, TWO_PI - delta);
}

function normalizePhase(phase: number): number {
  const normalized = phase % TWO_PI;

  return normalized < 0 ? normalized + TWO_PI : normalized;
}

function addVec3(left: Vec3, right: Vec3): Vec3 {
  return [left[0] + right[0], left[1] + right[1], left[2] + right[2]];
}

function vectorLength(vector: Vec3): number {
  return Math.sqrt(
    vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2],
  );
}

function copyVec3(vector: Vec3): Vec3 {
  return [vector[0], vector[1], vector[2]];
}

function copyTuple(tuple: FieldSourceEmissionParameters): FieldSourceEmissionParameters {
  return {
    amplitude: tuple.amplitude,
    waveNumber: tuple.waveNumber,
    phase: tuple.phase,
    attenuation: tuple.attenuation,
  };
}

function createNonFiniteTuple(): FieldSourceEmissionParameters {
  return {
    amplitude: Number.NaN,
    waveNumber: Number.NaN,
    phase: Number.NaN,
    attenuation: Number.NaN,
  };
}

function requireMapValue<T>(map: Map<string, T>, key: string): T {
  const value = map.get(key);

  if (!value) {
    throw new Error(`Missing emitted recovery fixture value for ${key}.`);
  }

  return value;
}

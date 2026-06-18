import {
  buildPSimplexBoundedPointwiseVectorLGRelaxationLedgerT14Report,
  type PSimplexT14Verdict,
} from './pSimplexBoundedPointwiseVectorLGRelaxationLedgerT14';
import {
  buildPSimplexBoundedRelaxationResponseStatusLedgerT15Report,
  type PSimplexT15Verdict,
} from './pSimplexBoundedRelaxationResponseStatusLedgerT15';
import {
  minimizePSimplexBoundedPointwiseVectorLG,
  type PSimplexPointwiseLocalMinimum,
  type PSimplexPointwiseStopReason,
} from './pSimplexPointwiseRelaxationCore';
import {
  buildPSimplexFiniteResponseDirections,
  compareFiniteResponseDirections,
  PSIMPLEX_A3_AXIS_TO_A3_THRESHOLD,
  PSIMPLEX_BODY_A3_TO_BODY_REFERENCE_THRESHOLD,
  PSIMPLEX_BODY_AXIS_TO_BODY_THRESHOLD,
  type PSimplexRuntimeAnisotropyLabeledResponseDirection,
  type PSimplexRuntimeResponseDirectionClass,
} from './pSimplexResponseCore';
import {
  cleanNumber,
  cleanVec3,
  dotVec3,
  normVec3,
  normalizeVec3OrNull,
  PSIMPLEX_EPSILON,
  subVec3,
  type PSimplexVec3,
} from './pSimplexVectorMath';

export type PSimplexT16DriveFamily = 'D2' | 'D3';
export type PSimplexT16DriveClass = 'A3-root-drive' | 'body-diagonal-drive';
export type PSimplexT16FiniteLedgerRelation =
  | 'finite-ledger-consistent'
  | 'finite-ledger-coarse-compatible'
  | 'finite-ledger-divergent';
export type PSimplexT16FinitePredictionClass =
  | PSimplexRuntimeResponseDirectionClass
  | 'threshold-sensitive';
export type PSimplexT16DominantNearestClass =
  | PSimplexRuntimeResponseDirectionClass
  | 'unclassified-response';
export type PSimplexT16NearBestFiniteClass = PSimplexT16DominantNearestClass;
export type PSimplexT16DegeneracyKind =
  | 'single-minimum'
  | 'same-class-symmetry-degeneracy'
  | 'cross-class-threshold-degeneracy'
  | 'unclassified-degeneracy';
export type PSimplexT16ResponsePathClass =
  | 'axis-locked-regime'
  | 'axis-dominant-tilted-regime'
  | 'A3-near-regime'
  | 'body-near-regime'
  | 'continuous-tilt-regime'
  | 'near-degenerate-threshold-band'
  | 'finite-ledger-coarse-compatible'
  | 'finite-ledger-divergent'
  | 'unclassified-non-axis-response';
export type PSimplexT16Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT16FinalRecommendation =
  | 'advance-to-threshold-theory-and-readout-refinement'
  | 'refine-non-axis-symmetry-readout'
  | 'return-to-non-axis-threshold-sweep';
export type PSimplexT16ParentDivergenceReconciliationStatus =
  | 'preserved-as-strict-divergence'
  | 'resolved-by-finer-sweep'
  | 'reclassified-as-cross-class-threshold-band'
  | 'not-comparable-grid-missing-parent-strength';

export interface PSimplexT16ThresholdReferenceRow {
  thresholdId: string;
  driveFamily: PSimplexT16DriveFamily;
  value: number;
  referenceStatus: 'finite-ledger-reference-only';
}

export interface PSimplexT16DriveRow {
  driveFamily: PSimplexT16DriveFamily;
  driveId: string;
  driveClass: PSimplexT16DriveClass;
  J: PSimplexVec3;
  JHat: PSimplexVec3;
  sourceDirectionClass: PSimplexRuntimeResponseDirectionClass;
  sourceResponseDirectionId: string;
}

export interface PSimplexT16StrengthGridRow {
  driveFamily: PSimplexT16DriveFamily;
  strengthCount: number;
  strengthValues: number[];
  deduplicatedAfterConstruction: boolean;
  constructionNote: string;
}

export interface PSimplexT16SweepRow {
  rowId: string;
  driveFamily: PSimplexT16DriveFamily;
  driveId: string;
  driveClass: PSimplexT16DriveClass;
  J: PSimplexVec3;
  JHat: PSimplexVec3;
  sourceDriveNorm: number;
  s: number;
  eta: number;
  effectiveForcingStrengthS: number;
  phiStar: PSimplexVec3;
  phiNorm: number;
  u: PSimplexVec3 | null;
  bestEnergy: number;
  bestMinimumStopReason: PSimplexPointwiseStopReason;
  bestMinimumConverged: boolean;
  bestMinimumGradientNorm: number;
  bestMinimumIterations: number;
  bestMinimumLastEnergyDelta: number;
  bestMinimumLastStepSize: number;
  boundaryHit: boolean;
  nearestAxisDirectionId: string | null;
  A_axis: number;
  nearestA3DirectionId: string | null;
  A_A3: number;
  nearestBodyDirectionId: string | null;
  A_body: number;
  dominantNearestClass: PSimplexT16DominantNearestClass;
  alignmentMarginTopVsSecond: number;
  alignmentMarginAxisVsA3: number;
  alignmentMarginAxisVsBody: number;
  alignmentMarginA3VsBody: number;
  nearDegeneracyCount: number;
  energyGapToSecondBestMinimum: number | null;
  nearBestMinimumClassIds: PSimplexT16NearBestFiniteClass[];
  nearBestMinimumDirectionIds: Array<string | null>;
  nearBestFiniteClassSet: PSimplexT16NearBestFiniteClass[];
  degeneracyKind: PSimplexT16DegeneracyKind;
  thresholdSensitive: boolean;
  responsePathClass: PSimplexT16ResponsePathClass;
  finiteLedgerPredictedClass: PSimplexT16FinitePredictionClass;
  finiteLedgerWinningDirectionIds: string[];
  finiteLedgerRelationStrict: PSimplexT16FiniteLedgerRelation;
  finiteLedgerRelationContextual: PSimplexT16FiniteLedgerRelation;
  finiteLedgerRelation: PSimplexT16FiniteLedgerRelation;
  notes: string[];
  ok: boolean;
}

export interface PSimplexT16FamilyPathSummaryRow {
  driveFamily: PSimplexT16DriveFamily;
  driveCount: number;
  strengthCount: number;
  sweepRowCount: number;
  pathClassCounts: Record<PSimplexT16ResponsePathClass, number>;
  finiteLedgerConsistentCount: number;
  finiteLedgerCoarseCompatibleCount: number;
  finiteLedgerDivergentCount: number;
  thresholdSensitiveCount: number;
  nearDegenerateCount: number;
  nonConvergedCount: number;
  boundaryHitCount: number;
  summaryJudgment: string;
  ok: boolean;
}

export interface PSimplexT16ThresholdCrossoverEstimateRow {
  driveFamily: PSimplexT16DriveFamily;
  estimateStatus: 'grid-estimate-only';
  firstAxisLockedS: number | null;
  lastAxisLockedS: number | null;
  firstThresholdSensitiveS: number | null;
  firstNonAxisDominantS: number | null;
  firstFiniteLedgerDivergentS: number | null;
  stableStrongDrivePathClass: PSimplexT16ResponsePathClass | null;
  ok: boolean;
}

export interface PSimplexT16EnergyGapSummaryRow {
  driveFamily: PSimplexT16DriveFamily;
  rowCount: number;
  nearDegenerateCount: number;
  finiteEnergyGapCount: number;
  minEnergyGapToSecondBestMinimum: number | null;
  maxEnergyGapToSecondBestMinimum: number | null;
  nullEnergyGapCount: number;
  ok: boolean;
}

export interface PSimplexT16FiniteLedgerConsistencySummaryRow {
  driveFamily: PSimplexT16DriveFamily;
  strictFiniteLedgerConsistentCount: number;
  strictFiniteLedgerCoarseCompatibleCount: number;
  strictFiniteLedgerDivergentCount: number;
  contextualFiniteLedgerConsistentCount: number;
  contextualFiniteLedgerCoarseCompatibleCount: number;
  contextualFiniteLedgerDivergentCount: number;
  finiteLedgerDivergentCount: number;
  finiteLedgerDivergencePresent: boolean;
  strictFiniteLedgerDivergencePresent: boolean;
  contextualFiniteLedgerDivergencePresent: boolean;
  ok: boolean;
}

export interface PSimplexT16ProposedReadoutRefinementRow {
  refinementId: string;
  appliesToFamilies: PSimplexT16DriveFamily[];
  trigger: string;
  recommendation: string;
  status: 'proposed-readout-refinement';
  ok: true;
}

export interface PSimplexT16DegeneracyKindDistributionRow {
  degeneracyKind: PSimplexT16DegeneracyKind;
  count: number;
}

export interface PSimplexT16ParentDivergenceReconciliationRow {
  referenceFamily: 'D2' | 'T';
  parentDivergentReferenceCount: number;
  comparableT16RowCount: number;
  comparableStrengths: number[];
  strictFiniteLedgerDivergentCount: number;
  contextualFiniteLedgerDivergentCount: number;
  crossClassThresholdBandCount: number;
  reconciliationStatus: PSimplexT16ParentDivergenceReconciliationStatus;
  notes: string[];
  ok: boolean;
}

export interface PSimplexT16InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT16Summary {
  totalSweepRows: number;
  d2SweepRows: number;
  d3SweepRows: number;
  d2DriveCount: number;
  d3DriveCount: number;
  d2StrengthCount: number;
  d3StrengthCount: number;
  allRowsConverged: boolean;
  boundaryHitCount: number;
  scalingAuditPassed: boolean;
  thresholdSensitiveCount: number;
  nearDegenerateCount: number;
  singleMinimumCount: number;
  sameClassSymmetryDegeneracyCount: number;
  crossClassThresholdDegeneracyCount: number;
  unclassifiedDegeneracyCount: number;
  finiteLedgerConsistentCount: number;
  finiteLedgerCoarseCompatibleCount: number;
  finiteLedgerDivergentCount: number;
  strictFiniteLedgerConsistentCount: number;
  strictFiniteLedgerCoarseCompatibleCount: number;
  strictFiniteLedgerDivergentCount: number;
  contextualFiniteLedgerConsistentCount: number;
  contextualFiniteLedgerCoarseCompatibleCount: number;
  contextualFiniteLedgerDivergentCount: number;
  parentT15D2DivergentReferenceCount: number;
  parentT15TDivergentReferenceCount: number;
  strictD2DivergentCount: number;
  contextualD2DivergentCount: number;
  axisLockedRegimeCount: number;
  axisDominantTiltedRegimeCount: number;
  a3NearRegimeCount: number;
  bodyNearRegimeCount: number;
  continuousTiltRegimeCount: number;
  nearDegenerateThresholdBandCount: number;
  finiteLedgerCoarseCompatiblePathCount: number;
  finiteLedgerDivergentPathCount: number;
  unclassifiedNonAxisResponseCount: number;
  forbiddenBoundaryPassed: boolean;
}

export interface PSimplexNonAxisThresholdSweepReadoutLedgerT16Report {
  method: 'p-simplex-non-axis-threshold-sweep-readout-ledger-t16';
  candidatePackage: 'p-simplex-non-axis-threshold-sweep-readout-ledger-t16';
  parentT14Ledger: 'p-simplex-bounded-pointwise-vector-lg-relaxation-ledger-t14';
  parentT15Ledger: 'p-simplex-bounded-relaxation-response-status-ledger-t15';
  diagnosticScope: 'non-axis-threshold-sweep-readout-ledger-only';
  solverStatus: 'uses-existing-bounded-pointwise-minimization-core';
  spatialDynamicsStatus: 'not-spatial-lg-dynamics';
  fieldAtlasStatus: 'not-field-atlas';
  renderingStatus: 'not-rendering';
  fieldCueStatus: 'not-field-cue';
  semanticStatus: 'not-semantic-naming';
  routeStatus: 'no-route-walk-holonomy';
  defectStatus: 'no-defect-vortex-claims';
  denseSamplingStatus: 'not-dense-sampling';
  parentT14Ok: boolean;
  parentT14Verdict: PSimplexT14Verdict;
  parentT15Ok: boolean;
  parentT15Verdict: PSimplexT15Verdict;
  thresholdReferenceRows: PSimplexT16ThresholdReferenceRow[];
  driveRows: PSimplexT16DriveRow[];
  strengthGridRows: PSimplexT16StrengthGridRow[];
  sweepRows: PSimplexT16SweepRow[];
  familyPathSummaryRows: PSimplexT16FamilyPathSummaryRow[];
  thresholdCrossoverEstimateRows: PSimplexT16ThresholdCrossoverEstimateRow[];
  energyGapSummaryRows: PSimplexT16EnergyGapSummaryRow[];
  finiteLedgerConsistencySummaryRows: PSimplexT16FiniteLedgerConsistencySummaryRow[];
  proposedReadoutRefinementRows: PSimplexT16ProposedReadoutRefinementRow[];
  degeneracyKindDistributionRows: PSimplexT16DegeneracyKindDistributionRow[];
  parentDivergenceReconciliationRows: PSimplexT16ParentDivergenceReconciliationRow[];
  invalidInterpretationBoundaryRows: PSimplexT16InvalidInterpretationBoundaryRow[];
  summary: PSimplexT16Summary;
  verdict: PSimplexT16Verdict;
  finalRecommendation: PSimplexT16FinalRecommendation;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface ClassifiedAlignment {
  nearestAxisDirectionId: string | null;
  A_axis: number;
  nearestA3DirectionId: string | null;
  A_A3: number;
  nearestBodyDirectionId: string | null;
  A_body: number;
  dominantNearestClass: PSimplexT16DominantNearestClass;
  dominantNearestDirectionId: string | null;
  alignmentMarginTopVsSecond: number;
  alignmentMarginAxisVsA3: number;
  alignmentMarginAxisVsBody: number;
  alignmentMarginA3VsBody: number;
}

interface DistinctLocalMinimumSummary {
  nearDegeneracyCount: number;
  energyGapToSecondBestMinimum: number | null;
  nearBestMinimumClassIds: PSimplexT16NearBestFiniteClass[];
  nearBestMinimumDirectionIds: Array<string | null>;
  nearBestFiniteClassSet: PSimplexT16NearBestFiniteClass[];
  degeneracyKind: PSimplexT16DegeneracyKind;
}

interface FinitePredictionSummary {
  finiteLedgerPredictedClass: PSimplexT16FinitePredictionClass;
  finiteLedgerWinningDirectionIds: string[];
  finiteWinningClasses: PSimplexRuntimeResponseDirectionClass[];
  multiClassFiniteTie: boolean;
}

const DRIVE_FAMILIES: readonly PSimplexT16DriveFamily[] = ['D2', 'D3'];
const RESPONSE_PATH_CLASSES: readonly PSimplexT16ResponsePathClass[] = [
  'axis-locked-regime',
  'axis-dominant-tilted-regime',
  'A3-near-regime',
  'body-near-regime',
  'continuous-tilt-regime',
  'near-degenerate-threshold-band',
  'finite-ledger-coarse-compatible',
  'finite-ledger-divergent',
  'unclassified-non-axis-response',
];
const DEGENERACY_KINDS: readonly PSimplexT16DegeneracyKind[] = [
  'single-minimum',
  'same-class-symmetry-degeneracy',
  'cross-class-threshold-degeneracy',
  'unclassified-degeneracy',
];
const MAX_RADIUS = 3;
const MAX_ITERATIONS = 1600;
const GRID_DELTA = 0.02;
const NEAR_THRESHOLD_ALIGNMENT = 0.985;
const TILTED_ALIGNMENT = 0.9;
const NEAR_DEGENERACY_ENERGY_TOLERANCE = 1e-7;
const PHI_CLUSTER_TOLERANCE = 1e-5;

export function buildPSimplexNonAxisThresholdSweepReadoutLedgerT16Report(): PSimplexNonAxisThresholdSweepReadoutLedgerT16Report {
  const parentT14Report = buildPSimplexBoundedPointwiseVectorLGRelaxationLedgerT14Report();
  const parentT15Report = buildPSimplexBoundedRelaxationResponseStatusLedgerT15Report();
  const finiteDirections = buildPSimplexFiniteResponseDirections();
  const thresholdReferenceRows = buildThresholdReferenceRows();
  const driveRows = buildDriveRows(finiteDirections);
  const strengthGridRows = buildStrengthGridRows();
  const sweepRows = buildSweepRows(driveRows, strengthGridRows, finiteDirections);
  const familyPathSummaryRows = buildFamilyPathSummaryRows(sweepRows, driveRows, strengthGridRows);
  const thresholdCrossoverEstimateRows = buildThresholdCrossoverEstimateRows(sweepRows);
  const energyGapSummaryRows = buildEnergyGapSummaryRows(sweepRows);
  const finiteLedgerConsistencySummaryRows = buildFiniteLedgerConsistencySummaryRows(sweepRows);
  const proposedReadoutRefinementRows = buildProposedReadoutRefinementRows(sweepRows);
  const degeneracyKindDistributionRows = buildDegeneracyKindDistributionRows(sweepRows);
  const parentDivergenceReconciliationRows = buildParentDivergenceReconciliationRows({
    parentT14Rows: parentT14Report.relaxationRows,
    parentT15Rows: parentT15Report.rowExceptionRows,
    sweepRows,
  });
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const summary = buildSummary({
    sweepRows,
    driveRows,
    strengthGridRows,
    invalidInterpretationBoundaryRows,
    parentDivergenceReconciliationRows,
  });
  const integrityIssues = collectIntegrityIssues({
    parentT14Report,
    parentT15Report,
    driveRows,
    strengthGridRows,
    sweepRows,
    familyPathSummaryRows,
    parentDivergenceReconciliationRows,
    summary,
    invalidInterpretationBoundaryRows,
  });
  const verdict = classifyVerdict(integrityIssues, summary, familyPathSummaryRows);

  return {
    method: 'p-simplex-non-axis-threshold-sweep-readout-ledger-t16',
    candidatePackage: 'p-simplex-non-axis-threshold-sweep-readout-ledger-t16',
    parentT14Ledger: 'p-simplex-bounded-pointwise-vector-lg-relaxation-ledger-t14',
    parentT15Ledger: 'p-simplex-bounded-relaxation-response-status-ledger-t15',
    diagnosticScope: 'non-axis-threshold-sweep-readout-ledger-only',
    solverStatus: 'uses-existing-bounded-pointwise-minimization-core',
    spatialDynamicsStatus: 'not-spatial-lg-dynamics',
    fieldAtlasStatus: 'not-field-atlas',
    renderingStatus: 'not-rendering',
    fieldCueStatus: 'not-field-cue',
    semanticStatus: 'not-semantic-naming',
    routeStatus: 'no-route-walk-holonomy',
    defectStatus: 'no-defect-vortex-claims',
    denseSamplingStatus: 'not-dense-sampling',
    parentT14Ok: parentT14Report.ok,
    parentT14Verdict: parentT14Report.verdict,
    parentT15Ok: parentT15Report.ok,
    parentT15Verdict: parentT15Report.verdict,
    thresholdReferenceRows,
    driveRows,
    strengthGridRows,
    sweepRows,
    familyPathSummaryRows,
    thresholdCrossoverEstimateRows,
    energyGapSummaryRows,
    finiteLedgerConsistencySummaryRows,
    proposedReadoutRefinementRows,
    degeneracyKindDistributionRows,
    parentDivergenceReconciliationRows,
    invalidInterpretationBoundaryRows,
    summary,
    verdict,
    finalRecommendation: recommendationForVerdict(verdict),
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: verdict !== 'FAIL' && integrityIssues.length === 0,
  };
}

function buildThresholdReferenceRows(): PSimplexT16ThresholdReferenceRow[] {
  return [
    {
      thresholdId: 'a3-axis-to-a3-finite-reference',
      driveFamily: 'D2',
      value: cleanNumber(PSIMPLEX_A3_AXIS_TO_A3_THRESHOLD),
      referenceStatus: 'finite-ledger-reference-only',
    },
    {
      thresholdId: 'body-a3-to-body-finite-reference',
      driveFamily: 'D3',
      value: cleanNumber(PSIMPLEX_BODY_A3_TO_BODY_REFERENCE_THRESHOLD),
      referenceStatus: 'finite-ledger-reference-only',
    },
    {
      thresholdId: 'body-axis-to-body-finite-reference',
      driveFamily: 'D3',
      value: cleanNumber(PSIMPLEX_BODY_AXIS_TO_BODY_THRESHOLD),
      referenceStatus: 'finite-ledger-reference-only',
    },
  ];
}

function buildDriveRows(finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[]): PSimplexT16DriveRow[] {
  return finiteDirections
    .filter(
      (direction) =>
        direction.responseDirectionClass === 'a3-transition' ||
        direction.responseDirectionClass === 'body-diagonal-high-mixing',
    )
    .map((direction) => {
      const driveFamily: PSimplexT16DriveFamily =
        direction.responseDirectionClass === 'a3-transition' ? 'D2' : 'D3';
      const driveClass: PSimplexT16DriveClass =
        direction.responseDirectionClass === 'a3-transition' ? 'A3-root-drive' : 'body-diagonal-drive';

      return {
        driveFamily,
        driveId: direction.responseDirectionId,
        driveClass,
        J: cleanVec3(direction.n),
        JHat: cleanVec3(direction.n),
        sourceDirectionClass: direction.responseDirectionClass,
        sourceResponseDirectionId: direction.responseDirectionId,
      };
    });
}

function buildStrengthGridRows(): PSimplexT16StrengthGridRow[] {
  const d2Raw = [
    0,
    0.1,
    0.25,
    0.5,
    0.75,
    PSIMPLEX_A3_AXIS_TO_A3_THRESHOLD - GRID_DELTA,
    PSIMPLEX_A3_AXIS_TO_A3_THRESHOLD / 2,
    PSIMPLEX_A3_AXIS_TO_A3_THRESHOLD,
    PSIMPLEX_A3_AXIS_TO_A3_THRESHOLD + GRID_DELTA,
    1,
    1.5,
    2 * PSIMPLEX_A3_AXIS_TO_A3_THRESHOLD,
    2,
    3,
    5,
  ];
  const d3Raw = [
    0,
    0.1,
    0.25,
    PSIMPLEX_BODY_A3_TO_BODY_REFERENCE_THRESHOLD - GRID_DELTA,
    PSIMPLEX_BODY_A3_TO_BODY_REFERENCE_THRESHOLD,
    PSIMPLEX_BODY_A3_TO_BODY_REFERENCE_THRESHOLD + GRID_DELTA,
    0.5,
    0.75,
    PSIMPLEX_BODY_AXIS_TO_BODY_THRESHOLD / 2,
    PSIMPLEX_BODY_AXIS_TO_BODY_THRESHOLD - GRID_DELTA,
    PSIMPLEX_BODY_AXIS_TO_BODY_THRESHOLD,
    PSIMPLEX_BODY_AXIS_TO_BODY_THRESHOLD + GRID_DELTA,
    1,
    1.5,
    2 * PSIMPLEX_BODY_AXIS_TO_BODY_THRESHOLD,
    2,
    3,
    5,
  ];
  const d2Strengths = deduplicateAndSortStrengths(d2Raw);
  const d3Strengths = deduplicateAndSortStrengths(d3Raw);

  return [
    {
      driveFamily: 'D2',
      strengthCount: d2Strengths.length,
      strengthValues: d2Strengths,
      deduplicatedAfterConstruction: d2Strengths.length !== d2Raw.length,
      constructionNote: 'A3 finite grid with s_A3 reference and +/- delta.',
    },
    {
      driveFamily: 'D3',
      strengthCount: d3Strengths.length,
      strengthValues: d3Strengths,
      deduplicatedAfterConstruction: d3Strengths.length !== d3Raw.length,
      constructionNote: 'Body finite grid with a3/body and global body references plus +/- delta.',
    },
  ];
}

function buildSweepRows(
  driveRows: readonly PSimplexT16DriveRow[],
  strengthGridRows: readonly PSimplexT16StrengthGridRow[],
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
): PSimplexT16SweepRow[] {
  return driveRows.flatMap((driveRow) => {
    const strengthGrid = requireStrengthGrid(strengthGridRows, driveRow.driveFamily);

    return strengthGrid.strengthValues.map((s) => buildSweepRow(driveRow, s, finiteDirections));
  });
}

function buildSweepRow(
  driveRow: PSimplexT16DriveRow,
  s: number,
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
): PSimplexT16SweepRow {
  const sourceDriveNorm = normVec3(driveRow.J);
  const eta = sourceDriveNorm > PSIMPLEX_EPSILON ? s / sourceDriveNorm : 0;
  const result = minimizePSimplexBoundedPointwiseVectorLG(driveRow.J, eta, {
    maxRadius: MAX_RADIUS,
    maxIterations: MAX_ITERATIONS,
  });
  const alignment = classifyAlignment(result.phiHat, finiteDirections);
  const localMinimumSummary = summarizeDistinctLocalMinima(result.localMinima, finiteDirections);
  const finitePrediction = buildFinitePrediction(finiteDirections, driveRow.JHat, s);
  const thresholdSensitive =
    localMinimumSummary.degeneracyKind === 'cross-class-threshold-degeneracy' ||
    finitePrediction.multiClassFiniteTie ||
    isExplicitThresholdStrength(driveRow.driveFamily, s);
  const finiteLedgerRelationStrict = classifyFiniteLedgerRelationStrict(alignment, finitePrediction);
  const finiteLedgerRelationContextual = classifyFiniteLedgerRelationContextual({
    finiteLedgerRelationStrict,
    finitePrediction,
    thresholdSensitive,
    degeneracyKind: localMinimumSummary.degeneracyKind,
  });
  const boundaryHit = result.boundaryHitSeedIds.length > 0;
  const responsePathClass = classifyResponsePath({
    bestMinimumConverged: result.bestLocalMinimum.converged,
    boundaryHit,
    degeneracyKind: localMinimumSummary.degeneracyKind,
    finiteLedgerRelationStrict,
    finiteLedgerRelationContextual,
    alignment,
  });
  const scalingOk = scalingAuditRowOk(sourceDriveNorm, s, eta);
  const notes = buildRowNotes({
    responsePathClass,
    thresholdSensitive,
    finitePrediction,
    finiteLedgerRelationStrict,
    finiteLedgerRelationContextual,
    degeneracyKind: localMinimumSummary.degeneracyKind,
    bestMinimumConverged: result.bestLocalMinimum.converged,
    boundaryHit,
  });

  return {
    rowId: `T16-${driveRow.driveFamily}-${driveRow.driveId}-s-${strengthToken(s)}`,
    driveFamily: driveRow.driveFamily,
    driveId: driveRow.driveId,
    driveClass: driveRow.driveClass,
    J: cleanVec3(driveRow.J),
    JHat: cleanVec3(driveRow.JHat),
    sourceDriveNorm: cleanNumber(sourceDriveNorm),
    s: cleanNumber(s),
    eta: cleanNumber(eta),
    effectiveForcingStrengthS: cleanNumber(eta * sourceDriveNorm),
    phiStar: result.phiStar,
    phiNorm: result.phiNorm,
    u: result.phiHat,
    bestEnergy: cleanNumber(result.bestLocalMinimum.energy),
    bestMinimumStopReason: result.bestLocalMinimum.stopReason,
    bestMinimumConverged: result.bestLocalMinimum.converged,
    bestMinimumGradientNorm: result.bestLocalMinimum.gradientNorm,
    bestMinimumIterations: result.bestLocalMinimum.iterations,
    bestMinimumLastEnergyDelta: result.bestLocalMinimum.lastEnergyDelta,
    bestMinimumLastStepSize: result.bestLocalMinimum.lastStepSize,
    boundaryHit,
    nearestAxisDirectionId: alignment.nearestAxisDirectionId,
    A_axis: alignment.A_axis,
    nearestA3DirectionId: alignment.nearestA3DirectionId,
    A_A3: alignment.A_A3,
    nearestBodyDirectionId: alignment.nearestBodyDirectionId,
    A_body: alignment.A_body,
    dominantNearestClass: alignment.dominantNearestClass,
    alignmentMarginTopVsSecond: alignment.alignmentMarginTopVsSecond,
    alignmentMarginAxisVsA3: alignment.alignmentMarginAxisVsA3,
    alignmentMarginAxisVsBody: alignment.alignmentMarginAxisVsBody,
    alignmentMarginA3VsBody: alignment.alignmentMarginA3VsBody,
    nearDegeneracyCount: localMinimumSummary.nearDegeneracyCount,
    energyGapToSecondBestMinimum: localMinimumSummary.energyGapToSecondBestMinimum,
    nearBestMinimumClassIds: [...localMinimumSummary.nearBestMinimumClassIds],
    nearBestMinimumDirectionIds: [...localMinimumSummary.nearBestMinimumDirectionIds],
    nearBestFiniteClassSet: [...localMinimumSummary.nearBestFiniteClassSet],
    degeneracyKind: localMinimumSummary.degeneracyKind,
    thresholdSensitive,
    responsePathClass,
    finiteLedgerPredictedClass: finitePrediction.finiteLedgerPredictedClass,
    finiteLedgerWinningDirectionIds: finitePrediction.finiteLedgerWinningDirectionIds,
    finiteLedgerRelationStrict,
    finiteLedgerRelationContextual,
    finiteLedgerRelation: finiteLedgerRelationStrict,
    notes,
    ok: scalingOk && result.bestLocalMinimum.converged && !boundaryHit,
  };
}

function classifyAlignment(
  u: PSimplexVec3 | null,
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
): ClassifiedAlignment {
  const axisMatch = bestClassAlignment(u, finiteDirections, 'axis-well');
  const a3Match = bestClassAlignment(u, finiteDirections, 'a3-transition');
  const bodyMatch = bestClassAlignment(u, finiteDirections, 'body-diagonal-high-mixing');
  const ranked = [
    { responseClass: 'axis-well' as const, directionId: axisMatch.directionId, alignment: axisMatch.alignment },
    { responseClass: 'a3-transition' as const, directionId: a3Match.directionId, alignment: a3Match.alignment },
    { responseClass: 'body-diagonal-high-mixing' as const, directionId: bodyMatch.directionId, alignment: bodyMatch.alignment },
  ].sort((left, right) => right.alignment - left.alignment);
  const dominant = ranked[0];
  const second = ranked[1];
  const dominantNearestClass: PSimplexT16DominantNearestClass =
    dominant.alignment > PSIMPLEX_EPSILON ? dominant.responseClass : 'unclassified-response';

  return {
    nearestAxisDirectionId: axisMatch.directionId,
    A_axis: axisMatch.alignment,
    nearestA3DirectionId: a3Match.directionId,
    A_A3: a3Match.alignment,
    nearestBodyDirectionId: bodyMatch.directionId,
    A_body: bodyMatch.alignment,
    dominantNearestClass,
    dominantNearestDirectionId: dominantNearestClass === 'unclassified-response' ? null : dominant.directionId,
    alignmentMarginTopVsSecond: cleanNumber(dominant.alignment - second.alignment),
    alignmentMarginAxisVsA3: cleanNumber(axisMatch.alignment - a3Match.alignment),
    alignmentMarginAxisVsBody: cleanNumber(axisMatch.alignment - bodyMatch.alignment),
    alignmentMarginA3VsBody: cleanNumber(a3Match.alignment - bodyMatch.alignment),
  };
}

function bestClassAlignment(
  u: PSimplexVec3 | null,
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
  responseClass: PSimplexRuntimeResponseDirectionClass,
): { directionId: string | null; alignment: number } {
  if (!u) {
    return { directionId: null, alignment: 0 };
  }

  const best = finiteDirections
    .filter((direction) => direction.responseDirectionClass === responseClass)
    .reduce<{ directionId: string; alignment: number } | null>((currentBest, direction) => {
      const alignment = dotVec3(u, direction.n);

      if (!currentBest || alignment > currentBest.alignment) {
        return { directionId: direction.responseDirectionId, alignment };
      }

      return currentBest;
    }, null);

  return {
    directionId: best?.directionId ?? null,
    alignment: cleanNumber(best?.alignment ?? 0),
  };
}

function summarizeDistinctLocalMinima(
  localMinima: readonly PSimplexPointwiseLocalMinimum[],
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
): DistinctLocalMinimumSummary {
  const sorted = [...localMinima].sort((left, right) => left.energy - right.energy);
  const representatives: PSimplexPointwiseLocalMinimum[] = [];

  for (const localMinimum of sorted) {
    const alreadyRepresented = representatives.some(
      (representative) => normVec3(subVec3(representative.phi, localMinimum.phi)) <= PHI_CLUSTER_TOLERANCE,
    );

    if (!alreadyRepresented) {
      representatives.push(localMinimum);
    }
  }

  const bestEnergy = representatives[0]?.energy ?? Number.POSITIVE_INFINITY;
  const nearDegeneracyCount = representatives.filter(
    (localMinimum) => Math.abs(localMinimum.energy - bestEnergy) <= NEAR_DEGENERACY_ENERGY_TOLERANCE,
  ).length;
  const nearBestMinima = representatives.filter(
    (localMinimum) => Math.abs(localMinimum.energy - bestEnergy) <= NEAR_DEGENERACY_ENERGY_TOLERANCE,
  );
  const nearBestMatches = nearBestMinima.map((localMinimum) =>
    classifyNearBestMinimum(localMinimum, finiteDirections),
  );
  const nearBestMinimumClassIds = nearBestMatches.map((match) => match.responseClass);
  const nearBestMinimumDirectionIds = nearBestMatches.map((match) => match.directionId);
  const nearBestFiniteClassSet = uniqueNearBestFiniteClasses(nearBestMinimumClassIds);
  const secondEnergy = representatives[1]?.energy;
  const energyGapToSecondBestMinimum =
    secondEnergy === undefined ? null : cleanSolverNumber(secondEnergy - bestEnergy);

  return {
    nearDegeneracyCount,
    energyGapToSecondBestMinimum,
    nearBestMinimumClassIds,
    nearBestMinimumDirectionIds,
    nearBestFiniteClassSet,
    degeneracyKind: classifyDegeneracyKind(nearDegeneracyCount, nearBestFiniteClassSet),
  };
}

function classifyNearBestMinimum(
  localMinimum: PSimplexPointwiseLocalMinimum,
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
): { responseClass: PSimplexT16NearBestFiniteClass; directionId: string | null } {
  const u = normalizeVec3OrNull(localMinimum.phi);
  const alignment = classifyAlignment(u, finiteDirections);

  if (
    alignment.dominantNearestClass === 'unclassified-response' ||
    alignment.alignmentMarginTopVsSecond < -PSIMPLEX_EPSILON
  ) {
    return { responseClass: 'unclassified-response', directionId: null };
  }

  return {
    responseClass: alignment.dominantNearestClass,
    directionId: alignment.dominantNearestDirectionId,
  };
}

function classifyDegeneracyKind(
  nearDegeneracyCount: number,
  nearBestFiniteClassSet: readonly PSimplexT16NearBestFiniteClass[],
): PSimplexT16DegeneracyKind {
  if (nearDegeneracyCount <= 1) {
    return 'single-minimum';
  }

  if (nearBestFiniteClassSet.includes('unclassified-response')) {
    return 'unclassified-degeneracy';
  }

  return nearBestFiniteClassSet.length === 1
    ? 'same-class-symmetry-degeneracy'
    : 'cross-class-threshold-degeneracy';
}

function uniqueNearBestFiniteClasses(
  values: readonly PSimplexT16NearBestFiniteClass[],
): PSimplexT16NearBestFiniteClass[] {
  return [...new Set(values)];
}

function buildFinitePrediction(
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
  JHat: PSimplexVec3 | null,
  s: number,
): FinitePredictionSummary {
  const comparison = compareFiniteResponseDirections(finiteDirections, JHat, s, PSIMPLEX_EPSILON * 10);
  const finiteWinningClasses = comparison.winningResponseClasses;
  const multiClassFiniteTie = finiteWinningClasses.length > 1;

  return {
    finiteLedgerPredictedClass: multiClassFiniteTie ? 'threshold-sensitive' : finiteWinningClasses[0],
    finiteLedgerWinningDirectionIds: [...comparison.winningResponseDirectionIds],
    finiteWinningClasses: [...finiteWinningClasses],
    multiClassFiniteTie,
  };
}

function classifyFiniteLedgerRelationStrict(
  alignment: ClassifiedAlignment,
  finitePrediction: FinitePredictionSummary,
): PSimplexT16FiniteLedgerRelation {
  if (finitePrediction.finiteLedgerPredictedClass === 'threshold-sensitive') {
    return alignment.dominantNearestDirectionId !== null &&
      finitePrediction.finiteLedgerWinningDirectionIds.includes(alignment.dominantNearestDirectionId)
      ? 'finite-ledger-coarse-compatible'
      : 'finite-ledger-divergent';
  }

  if (
    alignment.dominantNearestClass === finitePrediction.finiteLedgerPredictedClass &&
    alignment.dominantNearestDirectionId !== null &&
    finitePrediction.finiteLedgerWinningDirectionIds.includes(alignment.dominantNearestDirectionId)
  ) {
    return 'finite-ledger-consistent';
  }

  if (structurallyAdjacent(alignment.dominantNearestClass, finitePrediction.finiteLedgerPredictedClass)) {
    return 'finite-ledger-coarse-compatible';
  }

  return 'finite-ledger-divergent';
}

function classifyFiniteLedgerRelationContextual(args: {
  finiteLedgerRelationStrict: PSimplexT16FiniteLedgerRelation;
  finitePrediction: FinitePredictionSummary;
  thresholdSensitive: boolean;
  degeneracyKind: PSimplexT16DegeneracyKind;
}): PSimplexT16FiniteLedgerRelation {
  if (
    args.finiteLedgerRelationStrict === 'finite-ledger-divergent' &&
    (args.thresholdSensitive ||
      args.degeneracyKind === 'cross-class-threshold-degeneracy' ||
      args.finitePrediction.multiClassFiniteTie)
  ) {
    return 'finite-ledger-coarse-compatible';
  }

  return args.finiteLedgerRelationStrict;
}

function classifyResponsePath(args: {
  bestMinimumConverged: boolean;
  boundaryHit: boolean;
  degeneracyKind: PSimplexT16DegeneracyKind;
  finiteLedgerRelationStrict: PSimplexT16FiniteLedgerRelation;
  finiteLedgerRelationContextual: PSimplexT16FiniteLedgerRelation;
  alignment: ClassifiedAlignment;
}): PSimplexT16ResponsePathClass {
  if (!args.bestMinimumConverged || args.boundaryHit) {
    return 'unclassified-non-axis-response';
  }

  if (args.degeneracyKind === 'cross-class-threshold-degeneracy') {
    return 'near-degenerate-threshold-band';
  }

  if (args.finiteLedgerRelationStrict === 'finite-ledger-divergent') {
    return 'finite-ledger-divergent';
  }

  if (args.alignment.dominantNearestClass === 'axis-well' && args.alignment.A_axis >= NEAR_THRESHOLD_ALIGNMENT) {
    return 'axis-locked-regime';
  }

  if (args.alignment.dominantNearestClass === 'axis-well' && args.alignment.A_axis >= TILTED_ALIGNMENT) {
    return 'axis-dominant-tilted-regime';
  }

  if (args.alignment.dominantNearestClass === 'a3-transition' && args.alignment.A_A3 >= NEAR_THRESHOLD_ALIGNMENT) {
    return 'A3-near-regime';
  }

  if (
    args.alignment.dominantNearestClass === 'body-diagonal-high-mixing' &&
    args.alignment.A_body >= NEAR_THRESHOLD_ALIGNMENT
  ) {
    return 'body-near-regime';
  }

  if (args.finiteLedgerRelationContextual === 'finite-ledger-coarse-compatible') {
    return 'finite-ledger-coarse-compatible';
  }

  return args.alignment.dominantNearestClass === 'unclassified-response'
    ? 'unclassified-non-axis-response'
    : 'continuous-tilt-regime';
}

function buildFamilyPathSummaryRows(
  sweepRows: readonly PSimplexT16SweepRow[],
  driveRows: readonly PSimplexT16DriveRow[],
  strengthGridRows: readonly PSimplexT16StrengthGridRow[],
): PSimplexT16FamilyPathSummaryRow[] {
  return DRIVE_FAMILIES.map((driveFamily) => {
    const rows = sweepRowsForFamily(sweepRows, driveFamily);
    const pathClassCounts = pathClassCountsForRows(rows);
    const nonConvergedCount = rows.filter((row) => !row.bestMinimumConverged).length;
    const boundaryHitCount = rows.filter((row) => row.boundaryHit).length;

    return {
      driveFamily,
      driveCount: driveRows.filter((row) => row.driveFamily === driveFamily).length,
      strengthCount: requireStrengthGrid(strengthGridRows, driveFamily).strengthCount,
      sweepRowCount: rows.length,
      pathClassCounts,
      finiteLedgerConsistentCount: countStrictFiniteLedgerRelation(rows, 'finite-ledger-consistent'),
      finiteLedgerCoarseCompatibleCount: countStrictFiniteLedgerRelation(rows, 'finite-ledger-coarse-compatible'),
      finiteLedgerDivergentCount: countStrictFiniteLedgerRelation(rows, 'finite-ledger-divergent'),
      thresholdSensitiveCount: rows.filter((row) => row.thresholdSensitive).length,
      nearDegenerateCount: rows.filter((row) => row.nearDegeneracyCount > 1).length,
      nonConvergedCount,
      boundaryHitCount,
      summaryJudgment: summaryJudgmentForFamily(driveFamily, pathClassCounts),
      ok: rows.length > 0 && nonConvergedCount === 0 && boundaryHitCount === 0,
    };
  });
}

function buildThresholdCrossoverEstimateRows(
  sweepRows: readonly PSimplexT16SweepRow[],
): PSimplexT16ThresholdCrossoverEstimateRow[] {
  return DRIVE_FAMILIES.map((driveFamily) => {
    const rows = sweepRowsForFamily(sweepRows, driveFamily);

    return {
      driveFamily,
      estimateStatus: 'grid-estimate-only',
      firstAxisLockedS: firstS(rows, (row) => row.responsePathClass === 'axis-locked-regime'),
      lastAxisLockedS: lastS(rows, (row) => row.responsePathClass === 'axis-locked-regime'),
      firstThresholdSensitiveS: firstS(rows, (row) => row.thresholdSensitive),
      firstNonAxisDominantS: firstS(rows, (row) => isNonAxisDominant(row.dominantNearestClass)),
      firstFiniteLedgerDivergentS: firstS(rows, (row) => row.finiteLedgerRelationStrict === 'finite-ledger-divergent'),
      stableStrongDrivePathClass: stableStrongDrivePathClass(rows),
      ok: rows.length > 0,
    };
  });
}

function buildEnergyGapSummaryRows(sweepRows: readonly PSimplexT16SweepRow[]): PSimplexT16EnergyGapSummaryRow[] {
  return DRIVE_FAMILIES.map((driveFamily) => {
    const rows = sweepRowsForFamily(sweepRows, driveFamily);
    const finiteGaps = rows
      .map((row) => row.energyGapToSecondBestMinimum)
      .filter((gap): gap is number => gap !== null);

    return {
      driveFamily,
      rowCount: rows.length,
      nearDegenerateCount: rows.filter((row) => row.nearDegeneracyCount > 1).length,
      finiteEnergyGapCount: finiteGaps.length,
      minEnergyGapToSecondBestMinimum: finiteGaps.length > 0 ? cleanSolverNumber(Math.min(...finiteGaps)) : null,
      maxEnergyGapToSecondBestMinimum: finiteGaps.length > 0 ? cleanSolverNumber(Math.max(...finiteGaps)) : null,
      nullEnergyGapCount: rows.length - finiteGaps.length,
      ok: rows.length > 0,
    };
  });
}

function buildFiniteLedgerConsistencySummaryRows(
  sweepRows: readonly PSimplexT16SweepRow[],
): PSimplexT16FiniteLedgerConsistencySummaryRow[] {
  return DRIVE_FAMILIES.map((driveFamily) => {
    const rows = sweepRowsForFamily(sweepRows, driveFamily);
    const strictFiniteLedgerDivergentCount = countStrictFiniteLedgerRelation(rows, 'finite-ledger-divergent');
    const contextualFiniteLedgerDivergentCount = countContextualFiniteLedgerRelation(rows, 'finite-ledger-divergent');

    return {
      driveFamily,
      strictFiniteLedgerConsistentCount: countStrictFiniteLedgerRelation(rows, 'finite-ledger-consistent'),
      strictFiniteLedgerCoarseCompatibleCount: countStrictFiniteLedgerRelation(rows, 'finite-ledger-coarse-compatible'),
      strictFiniteLedgerDivergentCount,
      contextualFiniteLedgerConsistentCount: countContextualFiniteLedgerRelation(rows, 'finite-ledger-consistent'),
      contextualFiniteLedgerCoarseCompatibleCount: countContextualFiniteLedgerRelation(rows, 'finite-ledger-coarse-compatible'),
      contextualFiniteLedgerDivergentCount,
      finiteLedgerDivergentCount: strictFiniteLedgerDivergentCount,
      finiteLedgerDivergencePresent: strictFiniteLedgerDivergentCount > 0 || contextualFiniteLedgerDivergentCount > 0,
      strictFiniteLedgerDivergencePresent: strictFiniteLedgerDivergentCount > 0,
      contextualFiniteLedgerDivergencePresent: contextualFiniteLedgerDivergentCount > 0,
      ok: rows.length > 0,
    };
  });
}

function buildProposedReadoutRefinementRows(
  sweepRows: readonly PSimplexT16SweepRow[],
): PSimplexT16ProposedReadoutRefinementRow[] {
  const rowsByFamily = DRIVE_FAMILIES.map((driveFamily) => ({
    driveFamily,
    rows: sweepRowsForFamily(sweepRows, driveFamily),
  }));
  const thresholdFamilies = rowsByFamily
    .filter((entry) => entry.rows.some((row) => row.thresholdSensitive))
    .map((entry) => entry.driveFamily);
  const continuousTiltFamilies = rowsByFamily
    .filter((entry) =>
      entry.rows.some(
        (row) =>
          row.responsePathClass === 'continuous-tilt-regime' ||
          row.responsePathClass === 'axis-dominant-tilted-regime',
      ),
    )
    .map((entry) => entry.driveFamily);
  const divergentFamilies = rowsByFamily
    .filter((entry) => entry.rows.some((row) => row.finiteLedgerRelationStrict === 'finite-ledger-divergent'))
    .map((entry) => entry.driveFamily);

  return [
    {
      refinementId: 'near-degenerate-threshold-band-readout',
      appliesToFamilies: thresholdFamilies,
      trigger: 'near-degenerate or finite-tied rows appear in the sweep.',
      recommendation: 'Use explicit threshold-band handling before promoting non-axis response classes.',
      status: 'proposed-readout-refinement',
      ok: true,
    },
    {
      refinementId: 'continuous-tilt-alignment-margin-readout',
      appliesToFamilies: continuousTiltFamilies,
      trigger: 'continuous tilt or tilted axis-dominant rows appear away from exact finite ties.',
      recommendation: 'Track class-alignment margins as readout evidence rather than forcing a finite class.',
      status: 'proposed-readout-refinement',
      ok: true,
    },
    {
      refinementId: 'finite-ledger-divergence-review',
      appliesToFamilies: divergentFamilies,
      trigger: 'continuous minimization can disagree with the finite candidate ledger.',
      recommendation: 'Report divergence as readout evidence; do not collapse it into a closed class.',
      status: 'proposed-readout-refinement',
      ok: true,
    },
  ];
}

function buildDegeneracyKindDistributionRows(
  sweepRows: readonly PSimplexT16SweepRow[],
): PSimplexT16DegeneracyKindDistributionRow[] {
  return DEGENERACY_KINDS.map((degeneracyKind) => ({
    degeneracyKind,
    count: countDegeneracyKind(sweepRows, degeneracyKind),
  }));
}

function buildParentDivergenceReconciliationRows(args: {
  parentT14Rows: ReturnType<typeof buildPSimplexBoundedPointwiseVectorLGRelaxationLedgerT14Report>['relaxationRows'];
  parentT15Rows: ReturnType<typeof buildPSimplexBoundedRelaxationResponseStatusLedgerT15Report>['rowExceptionRows'];
  sweepRows: readonly PSimplexT16SweepRow[];
}): PSimplexT16ParentDivergenceReconciliationRow[] {
  const parentD2DivergentRows = args.parentT15Rows.filter(
    (row) => row.driveFamily === 'D2' && row.exceptionReasons.includes('finite-ledger-divergent'),
  );
  const parentTDivergentRows = args.parentT15Rows.filter(
    (row) => row.driveFamily === 'T' && row.exceptionReasons.includes('finite-ledger-divergent'),
  );
  const parentD2DivergentStrengths = uniqueStrengths(
    args.parentT14Rows
      .filter((row) => row.driveFamily === 'D2' && row.finiteLedgerConsistencyStatus === 'finite-ledger-divergent')
      .map((row) => row.s),
  );

  return [
    buildD2ParentDivergenceReconciliationRow(
      parentD2DivergentRows.length,
      parentD2DivergentStrengths,
      args.sweepRows,
    ),
    {
      referenceFamily: 'T',
      parentDivergentReferenceCount: parentTDivergentRows.length,
      comparableT16RowCount: 0,
      comparableStrengths: [],
      strictFiniteLedgerDivergentCount: 0,
      contextualFiniteLedgerDivergentCount: 0,
      crossClassThresholdBandCount: 0,
      reconciliationStatus:
        parentTDivergentRows.length > 0
          ? 'not-comparable-grid-missing-parent-strength'
          : 'resolved-by-finer-sweep',
      notes:
        parentTDivergentRows.length > 0
          ? ['T suppressed transverse controls are outside the D2/D3 non-axis sweep.']
          : ['No T divergent parent references were present.'],
      ok: true,
    },
  ];
}

function buildD2ParentDivergenceReconciliationRow(
  parentDivergentReferenceCount: number,
  parentDivergentStrengths: readonly number[],
  sweepRows: readonly PSimplexT16SweepRow[],
): PSimplexT16ParentDivergenceReconciliationRow {
  const comparableRows = sweepRows.filter(
    (row) =>
      row.driveFamily === 'D2' &&
      parentDivergentStrengths.some((strength) => nearlyEqualForSweep(row.s, strength)),
  );
  const strictFiniteLedgerDivergentCount = countStrictFiniteLedgerRelation(comparableRows, 'finite-ledger-divergent');
  const contextualFiniteLedgerDivergentCount = countContextualFiniteLedgerRelation(comparableRows, 'finite-ledger-divergent');
  const crossClassThresholdBandCount = comparableRows.filter(
    (row) => row.degeneracyKind === 'cross-class-threshold-degeneracy',
  ).length;
  const reconciliationStatus = classifyParentD2ReconciliationStatus({
    parentDivergentReferenceCount,
    comparableT16RowCount: comparableRows.length,
    strictFiniteLedgerDivergentCount,
    crossClassThresholdBandCount,
  });

  return {
    referenceFamily: 'D2',
    parentDivergentReferenceCount,
    comparableT16RowCount: comparableRows.length,
    comparableStrengths: [...parentDivergentStrengths],
    strictFiniteLedgerDivergentCount,
    contextualFiniteLedgerDivergentCount,
    crossClassThresholdBandCount,
    reconciliationStatus,
    notes: notesForD2Reconciliation(reconciliationStatus),
    ok: parentDivergentReferenceCount === 0 || comparableRows.length > 0,
  };
}

function classifyParentD2ReconciliationStatus(args: {
  parentDivergentReferenceCount: number;
  comparableT16RowCount: number;
  strictFiniteLedgerDivergentCount: number;
  crossClassThresholdBandCount: number;
}): PSimplexT16ParentDivergenceReconciliationStatus {
  if (args.parentDivergentReferenceCount > 0 && args.comparableT16RowCount === 0) {
    return 'not-comparable-grid-missing-parent-strength';
  }

  if (args.strictFiniteLedgerDivergentCount > 0) {
    return 'preserved-as-strict-divergence';
  }

  if (args.crossClassThresholdBandCount > 0) {
    return 'reclassified-as-cross-class-threshold-band';
  }

  return 'resolved-by-finer-sweep';
}

function notesForD2Reconciliation(
  reconciliationStatus: PSimplexT16ParentDivergenceReconciliationStatus,
): string[] {
  if (reconciliationStatus === 'preserved-as-strict-divergence') {
    return ['T15 D2 divergence remains visible in strict T16 finite-ledger relation.'];
  }

  if (reconciliationStatus === 'reclassified-as-cross-class-threshold-band') {
    return ['T15 D2 divergence maps to cross-class threshold-band rows at the exact parent strengths.'];
  }

  if (reconciliationStatus === 'not-comparable-grid-missing-parent-strength') {
    return ['Exact T15 D2 parent strengths are absent from the T16 grid.'];
  }

  return ['T15 D2 divergence is resolved by the finer sweep at exact parent strengths.'];
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT16InvalidInterpretationBoundaryRow[] {
  return [
    { boundaryId: 'not-spatial-dynamics', statement: 'spatial dynamics are not solved', enforced: true },
    { boundaryId: 'not-field-cue', statement: 'FieldCue does not exist in this sweep ledger', enforced: true },
    { boundaryId: 'a3-not-route-walk-holonomy', statement: 'A3 response is not route, walk, or holonomy', enforced: true },
    { boundaryId: 'body-not-semantic-truth', statement: 'body response is not semantic truth', enforced: true },
    { boundaryId: 'not-defect-vortex', statement: 'defects and vortices are not active', enforced: true },
    { boundaryId: 'not-rendering', statement: 'rendering is not authorized', enforced: true },
    { boundaryId: 'not-dense-sampling', statement: 'dense sampling is not authorized', enforced: true },
  ];
}

function buildSummary(args: {
  sweepRows: readonly PSimplexT16SweepRow[];
  driveRows: readonly PSimplexT16DriveRow[];
  strengthGridRows: readonly PSimplexT16StrengthGridRow[];
  invalidInterpretationBoundaryRows: readonly PSimplexT16InvalidInterpretationBoundaryRow[];
  parentDivergenceReconciliationRows: readonly PSimplexT16ParentDivergenceReconciliationRow[];
}): PSimplexT16Summary {
  const { sweepRows, driveRows, strengthGridRows, invalidInterpretationBoundaryRows, parentDivergenceReconciliationRows } =
    args;
  const d2Rows = sweepRowsForFamily(sweepRows, 'D2');
  const d3Rows = sweepRowsForFamily(sweepRows, 'D3');
  const d2Reconciliation = parentDivergenceReconciliationRows.find((row) => row.referenceFamily === 'D2');
  const tReconciliation = parentDivergenceReconciliationRows.find((row) => row.referenceFamily === 'T');

  return {
    totalSweepRows: sweepRows.length,
    d2SweepRows: d2Rows.length,
    d3SweepRows: d3Rows.length,
    d2DriveCount: driveRows.filter((row) => row.driveFamily === 'D2').length,
    d3DriveCount: driveRows.filter((row) => row.driveFamily === 'D3').length,
    d2StrengthCount: requireStrengthGrid(strengthGridRows, 'D2').strengthCount,
    d3StrengthCount: requireStrengthGrid(strengthGridRows, 'D3').strengthCount,
    allRowsConverged: sweepRows.every((row) => row.bestMinimumConverged),
    boundaryHitCount: sweepRows.filter((row) => row.boundaryHit).length,
    scalingAuditPassed: sweepRows.every((row) => scalingAuditRowOk(row.sourceDriveNorm, row.s, row.eta)),
    thresholdSensitiveCount: sweepRows.filter((row) => row.thresholdSensitive).length,
    nearDegenerateCount: sweepRows.filter((row) => row.nearDegeneracyCount > 1).length,
    singleMinimumCount: countDegeneracyKind(sweepRows, 'single-minimum'),
    sameClassSymmetryDegeneracyCount: countDegeneracyKind(sweepRows, 'same-class-symmetry-degeneracy'),
    crossClassThresholdDegeneracyCount: countDegeneracyKind(sweepRows, 'cross-class-threshold-degeneracy'),
    unclassifiedDegeneracyCount: countDegeneracyKind(sweepRows, 'unclassified-degeneracy'),
    finiteLedgerConsistentCount: countStrictFiniteLedgerRelation(sweepRows, 'finite-ledger-consistent'),
    finiteLedgerCoarseCompatibleCount: countStrictFiniteLedgerRelation(sweepRows, 'finite-ledger-coarse-compatible'),
    finiteLedgerDivergentCount: countStrictFiniteLedgerRelation(sweepRows, 'finite-ledger-divergent'),
    strictFiniteLedgerConsistentCount: countStrictFiniteLedgerRelation(sweepRows, 'finite-ledger-consistent'),
    strictFiniteLedgerCoarseCompatibleCount: countStrictFiniteLedgerRelation(sweepRows, 'finite-ledger-coarse-compatible'),
    strictFiniteLedgerDivergentCount: countStrictFiniteLedgerRelation(sweepRows, 'finite-ledger-divergent'),
    contextualFiniteLedgerConsistentCount: countContextualFiniteLedgerRelation(sweepRows, 'finite-ledger-consistent'),
    contextualFiniteLedgerCoarseCompatibleCount: countContextualFiniteLedgerRelation(sweepRows, 'finite-ledger-coarse-compatible'),
    contextualFiniteLedgerDivergentCount: countContextualFiniteLedgerRelation(sweepRows, 'finite-ledger-divergent'),
    parentT15D2DivergentReferenceCount: d2Reconciliation?.parentDivergentReferenceCount ?? 0,
    parentT15TDivergentReferenceCount: tReconciliation?.parentDivergentReferenceCount ?? 0,
    strictD2DivergentCount: countStrictFiniteLedgerRelation(d2Rows, 'finite-ledger-divergent'),
    contextualD2DivergentCount: countContextualFiniteLedgerRelation(d2Rows, 'finite-ledger-divergent'),
    axisLockedRegimeCount: countPathClass(sweepRows, 'axis-locked-regime'),
    axisDominantTiltedRegimeCount: countPathClass(sweepRows, 'axis-dominant-tilted-regime'),
    a3NearRegimeCount: countPathClass(sweepRows, 'A3-near-regime'),
    bodyNearRegimeCount: countPathClass(sweepRows, 'body-near-regime'),
    continuousTiltRegimeCount: countPathClass(sweepRows, 'continuous-tilt-regime'),
    nearDegenerateThresholdBandCount: countPathClass(sweepRows, 'near-degenerate-threshold-band'),
    finiteLedgerCoarseCompatiblePathCount: countPathClass(sweepRows, 'finite-ledger-coarse-compatible'),
    finiteLedgerDivergentPathCount: countPathClass(sweepRows, 'finite-ledger-divergent'),
    unclassifiedNonAxisResponseCount: countPathClass(sweepRows, 'unclassified-non-axis-response'),
    forbiddenBoundaryPassed:
      invalidInterpretationBoundaryRows.every((row) => row.enforced) &&
      !forbiddenPositiveClaimAppears(sweepRows, invalidInterpretationBoundaryRows),
  };
}

function collectIntegrityIssues(args: {
  parentT14Report: ReturnType<typeof buildPSimplexBoundedPointwiseVectorLGRelaxationLedgerT14Report>;
  parentT15Report: ReturnType<typeof buildPSimplexBoundedRelaxationResponseStatusLedgerT15Report>;
  driveRows: readonly PSimplexT16DriveRow[];
  strengthGridRows: readonly PSimplexT16StrengthGridRow[];
  sweepRows: readonly PSimplexT16SweepRow[];
  familyPathSummaryRows: readonly PSimplexT16FamilyPathSummaryRow[];
  parentDivergenceReconciliationRows: readonly PSimplexT16ParentDivergenceReconciliationRow[];
  summary: PSimplexT16Summary;
  invalidInterpretationBoundaryRows: readonly PSimplexT16InvalidInterpretationBoundaryRow[];
}): string[] {
  const issues: string[] = [];
  const parentT14Accepted =
    args.parentT14Report.ok &&
    args.parentT14Report.integrityIssueCount === 0 &&
    (args.parentT14Report.verdict === 'PASS' || args.parentT14Report.verdict === 'PARTIAL');
  const parentT15Accepted =
    args.parentT15Report.ok &&
    args.parentT15Report.integrityIssueCount === 0 &&
    args.parentT15Report.verdict === 'PASS';

  if (!parentT14Accepted) {
    issues.push('Parent T14 ledger is not ok with PASS or PARTIAL verdict.');
  }

  if (!parentT15Accepted) {
    issues.push('Parent T15 ledger is not ok with PASS verdict.');
  }

  if (args.summary.d2DriveCount !== 12) {
    issues.push(`Expected 12 D2 A3-root drives, got ${args.summary.d2DriveCount}.`);
  }

  if (args.summary.d3DriveCount !== 8) {
    issues.push(`Expected 8 D3 body-diagonal drives, got ${args.summary.d3DriveCount}.`);
  }

  const expectedSweepRows =
    args.summary.d2DriveCount * args.summary.d2StrengthCount +
    args.summary.d3DriveCount * args.summary.d3StrengthCount;

  if (args.summary.totalSweepRows !== expectedSweepRows) {
    issues.push(`Expected ${expectedSweepRows} sweep rows from deduplicated grids, got ${args.summary.totalSweepRows}.`);
  }

  if (!args.summary.scalingAuditPassed) {
    issues.push('At least one sweep row fails eta/s effective forcing strength scaling.');
  }

  if (!args.summary.allRowsConverged) {
    issues.push('At least one sweep row did not converge.');
  }

  if (args.summary.boundaryHitCount > 0) {
    issues.push('At least one sweep row hit the bounded-search radius.');
  }

  if (args.summary.thresholdSensitiveCount === 0) {
    issues.push('Threshold-sensitive bands were not reported.');
  }

  if (args.summary.sameClassSymmetryDegeneracyCount === 0 && args.summary.crossClassThresholdDegeneracyCount === 0) {
    issues.push('Degeneracy classification did not report any classified degeneracy rows.');
  }

  if (
    args.sweepRows.some(
      (row) =>
        row.degeneracyKind === 'same-class-symmetry-degeneracy' &&
        row.responsePathClass === 'near-degenerate-threshold-band',
    )
  ) {
    issues.push('Same-class symmetry degeneracy was treated as a threshold band.');
  }

  if (args.sweepRows.some((row) => row.finiteLedgerRelation !== row.finiteLedgerRelationStrict)) {
    issues.push('Compatibility finiteLedgerRelation does not equal strict finite-ledger relation.');
  }

  if (args.sweepRows.some((row) => row.finiteLedgerRelationContextual === undefined)) {
    issues.push('Contextual finite-ledger relation is missing from at least one row.');
  }

  if (args.parentDivergenceReconciliationRows.some((row) => !row.ok)) {
    issues.push('Parent T15 divergence reconciliation is incomplete.');
  }

  if (args.familyPathSummaryRows.some((row) => !row.ok)) {
    issues.push('At least one family path summary row is not ok.');
  }

  if (args.sweepRows.some((row) => !row.ok)) {
    issues.push('At least one sweep row is not ok.');
  }

  if (!args.summary.forbiddenBoundaryPassed || !args.invalidInterpretationBoundaryRows.every((row) => row.enforced)) {
    issues.push('Forbidden interpretation language entered the T16 sweep ledger.');
  }

  if (args.driveRows.some((row) => normVec3(row.J) <= PSIMPLEX_EPSILON)) {
    issues.push('A non-axis sweep drive has zero source norm.');
  }

  if (args.strengthGridRows.some((row) => row.strengthCount === 0)) {
    issues.push('At least one strength grid is empty.');
  }

  return [...new Set(issues)];
}

function classifyVerdict(
  integrityIssues: readonly string[],
  summary: PSimplexT16Summary,
  familyPathSummaryRows: readonly PSimplexT16FamilyPathSummaryRow[],
): PSimplexT16Verdict {
  if (
    integrityIssues.some(
      (issue) =>
        issue !== 'At least one sweep row did not converge.' &&
        issue !== 'At least one family path summary row is not ok.' &&
        issue !== 'At least one sweep row is not ok.' &&
        issue !== 'Parent T15 divergence reconciliation is incomplete.',
    )
  ) {
    return 'FAIL';
  }

  if (
    !summary.allRowsConverged ||
    familyPathSummaryRows.some((row) => !row.ok) ||
    summary.unclassifiedNonAxisResponseCount > 0
  ) {
    return 'PARTIAL';
  }

  return 'PASS';
}

function recommendationForVerdict(verdict: PSimplexT16Verdict): PSimplexT16FinalRecommendation {
  if (verdict === 'PASS') {
    return 'advance-to-threshold-theory-and-readout-refinement';
  }

  if (verdict === 'PARTIAL') {
    return 'refine-non-axis-symmetry-readout';
  }

  return 'return-to-non-axis-threshold-sweep';
}

function deduplicateAndSortStrengths(values: readonly number[]): number[] {
  return [...new Set(values.map((value) => cleanNumber(value)))]
    .filter((value) => value >= 0)
    .sort((left, right) => left - right);
}

function uniqueStrengths(values: readonly number[]): number[] {
  return deduplicateAndSortStrengths(values);
}

function nearlyEqualForSweep(left: number, right: number): boolean {
  return Math.abs(left - right) <= PSIMPLEX_EPSILON * 100;
}

function requireStrengthGrid(
  strengthGridRows: readonly PSimplexT16StrengthGridRow[],
  driveFamily: PSimplexT16DriveFamily,
): PSimplexT16StrengthGridRow {
  const row = strengthGridRows.find((candidate) => candidate.driveFamily === driveFamily);

  if (!row) {
    throw new Error(`Missing strength grid for ${driveFamily}.`);
  }

  return row;
}

function isExplicitThresholdStrength(driveFamily: PSimplexT16DriveFamily, s: number): boolean {
  const thresholds =
    driveFamily === 'D2'
      ? [PSIMPLEX_A3_AXIS_TO_A3_THRESHOLD]
      : [PSIMPLEX_BODY_A3_TO_BODY_REFERENCE_THRESHOLD, PSIMPLEX_BODY_AXIS_TO_BODY_THRESHOLD];

  return thresholds.some((threshold) => Math.abs(s - threshold) <= PSIMPLEX_EPSILON * 10);
}

function structurallyAdjacent(
  left: PSimplexT16DominantNearestClass,
  right: PSimplexRuntimeResponseDirectionClass,
): boolean {
  return (
    (left === 'axis-well' && right === 'a3-transition') ||
    (left === 'a3-transition' && right === 'axis-well') ||
    (left === 'a3-transition' && right === 'body-diagonal-high-mixing') ||
    (left === 'body-diagonal-high-mixing' && right === 'a3-transition')
  );
}

function scalingAuditRowOk(sourceDriveNorm: number, s: number, eta: number): boolean {
  if (sourceDriveNorm <= PSIMPLEX_EPSILON) {
    return Math.abs(eta) <= PSIMPLEX_EPSILON && Math.abs(eta * sourceDriveNorm) <= PSIMPLEX_EPSILON;
  }

  return Math.abs(eta * sourceDriveNorm - s) <= PSIMPLEX_EPSILON * 10;
}

function buildRowNotes(args: {
  responsePathClass: PSimplexT16ResponsePathClass;
  thresholdSensitive: boolean;
  finitePrediction: FinitePredictionSummary;
  finiteLedgerRelationStrict: PSimplexT16FiniteLedgerRelation;
  finiteLedgerRelationContextual: PSimplexT16FiniteLedgerRelation;
  degeneracyKind: PSimplexT16DegeneracyKind;
  bestMinimumConverged: boolean;
  boundaryHit: boolean;
}): string[] {
  const notes: string[] = [];

  if (args.thresholdSensitive) {
    notes.push('threshold-sensitive-readout-evidence');
  }

  if (args.finitePrediction.multiClassFiniteTie) {
    notes.push('finite-ledger-multi-class-tie');
  }

  if (args.degeneracyKind === 'same-class-symmetry-degeneracy') {
    notes.push('same-class-symmetry-degeneracy-not-threshold-band');
  }

  if (args.degeneracyKind === 'cross-class-threshold-degeneracy') {
    notes.push('cross-class-threshold-degeneracy-reported');
  }

  if (args.finiteLedgerRelationStrict === 'finite-ledger-divergent') {
    notes.push('strict-finite-ledger-divergence-reported');
  }

  if (
    args.finiteLedgerRelationStrict === 'finite-ledger-divergent' &&
    args.finiteLedgerRelationContextual === 'finite-ledger-coarse-compatible'
  ) {
    notes.push('contextual-coarse-compatibility-preserves-strict-divergence');
  }

  if (!args.bestMinimumConverged) {
    notes.push('non-converged-best-minimum');
  }

  if (args.boundaryHit) {
    notes.push('boundary-sensitive-row');
  }

  if (args.responsePathClass === 'A3-near-regime' || args.responsePathClass === 'body-near-regime') {
    notes.push('non-axis-near-regime-is-not-promoted-closed');
  }

  return notes;
}

function pathClassCountsForRows(
  rows: readonly PSimplexT16SweepRow[],
): Record<PSimplexT16ResponsePathClass, number> {
  return RESPONSE_PATH_CLASSES.reduce<Record<PSimplexT16ResponsePathClass, number>>((counts, pathClass) => {
    counts[pathClass] = rows.filter((row) => row.responsePathClass === pathClass).length;
    return counts;
  }, emptyPathClassCounts());
}

function emptyPathClassCounts(): Record<PSimplexT16ResponsePathClass, number> {
  return {
    'axis-locked-regime': 0,
    'axis-dominant-tilted-regime': 0,
    'A3-near-regime': 0,
    'body-near-regime': 0,
    'continuous-tilt-regime': 0,
    'near-degenerate-threshold-band': 0,
    'finite-ledger-coarse-compatible': 0,
    'finite-ledger-divergent': 0,
    'unclassified-non-axis-response': 0,
  };
}

function summaryJudgmentForFamily(
  driveFamily: PSimplexT16DriveFamily,
  pathClassCounts: Record<PSimplexT16ResponsePathClass, number>,
): string {
  const nonAxisNearCount =
    pathClassCounts['A3-near-regime'] +
    pathClassCounts['body-near-regime'] +
    pathClassCounts['continuous-tilt-regime'];
  const thresholdBandCount = pathClassCounts['near-degenerate-threshold-band'];

  if (driveFamily === 'D2') {
    return nonAxisNearCount > 0 || thresholdBandCount > 0
      ? 'A3-root-threshold-sweep-mapped-not-closed'
      : 'A3-root-sweep-mapped-axis-dominant';
  }

  return nonAxisNearCount > 0 || thresholdBandCount > 0
    ? 'body-diagonal-threshold-sweep-mapped-not-closed'
    : 'body-diagonal-sweep-mapped-axis-dominant';
}

function sweepRowsForFamily(
  rows: readonly PSimplexT16SweepRow[],
  driveFamily: PSimplexT16DriveFamily,
): PSimplexT16SweepRow[] {
  return rows.filter((row) => row.driveFamily === driveFamily);
}

function countStrictFiniteLedgerRelation(
  rows: readonly PSimplexT16SweepRow[],
  finiteLedgerRelation: PSimplexT16FiniteLedgerRelation,
): number {
  return rows.filter((row) => row.finiteLedgerRelationStrict === finiteLedgerRelation).length;
}

function countContextualFiniteLedgerRelation(
  rows: readonly PSimplexT16SweepRow[],
  finiteLedgerRelation: PSimplexT16FiniteLedgerRelation,
): number {
  return rows.filter((row) => row.finiteLedgerRelationContextual === finiteLedgerRelation).length;
}

function countPathClass(
  rows: readonly PSimplexT16SweepRow[],
  responsePathClass: PSimplexT16ResponsePathClass,
): number {
  return rows.filter((row) => row.responsePathClass === responsePathClass).length;
}

function countDegeneracyKind(
  rows: readonly PSimplexT16SweepRow[],
  degeneracyKind: PSimplexT16DegeneracyKind,
): number {
  return rows.filter((row) => row.degeneracyKind === degeneracyKind).length;
}

function firstS(
  rows: readonly PSimplexT16SweepRow[],
  predicate: (row: PSimplexT16SweepRow) => boolean,
): number | null {
  const matches = rows.filter(predicate).map((row) => row.s);
  return matches.length > 0 ? cleanNumber(Math.min(...matches)) : null;
}

function lastS(
  rows: readonly PSimplexT16SweepRow[],
  predicate: (row: PSimplexT16SweepRow) => boolean,
): number | null {
  const matches = rows.filter(predicate).map((row) => row.s);
  return matches.length > 0 ? cleanNumber(Math.max(...matches)) : null;
}

function isNonAxisDominant(dominantNearestClass: PSimplexT16DominantNearestClass): boolean {
  return dominantNearestClass === 'a3-transition' || dominantNearestClass === 'body-diagonal-high-mixing';
}

function stableStrongDrivePathClass(rows: readonly PSimplexT16SweepRow[]): PSimplexT16ResponsePathClass | null {
  const maxS = lastS(rows, () => true);

  if (maxS === null) {
    return null;
  }

  const strongRows = rows.filter((row) => row.s === maxS);
  const counts = pathClassCountsForRows(strongRows);
  const [best] = RESPONSE_PATH_CLASSES
    .map((pathClass) => ({ pathClass, count: counts[pathClass] }))
    .sort((left, right) => right.count - left.count);

  return best.count > 0 ? best.pathClass : null;
}

function strengthToken(s: number): string {
  return cleanNumber(s).toString().replace('-', 'minus-').replace('.', 'p');
}

function cleanSolverNumber(value: number): number {
  if (!Number.isFinite(value)) {
    return value;
  }

  return Number(value.toPrecision(12));
}

function forbiddenPositiveClaimAppears(
  sweepRows: readonly PSimplexT16SweepRow[],
  boundaryRows: readonly PSimplexT16InvalidInterpretationBoundaryRow[],
): boolean {
  const values = [
    ...sweepRows.flatMap((row) => [
      row.rowId,
      row.driveFamily,
      row.driveClass,
      row.responsePathClass,
      row.degeneracyKind,
      row.finiteLedgerRelationStrict,
      row.finiteLedgerRelationContextual,
      row.finiteLedgerRelation,
      row.dominantNearestClass,
      ...row.notes,
    ]),
    ...boundaryRows.flatMap((row) => [row.boundaryId, row.statement]),
  ];

  return values.some((value) => hasForbiddenPositiveClaim(value));
}

function hasForbiddenPositiveClaim(value: string): boolean {
  const normalized = value.toLowerCase();

  if (
    normalized.startsWith('no-') ||
    normalized.startsWith('not-') ||
    normalized.includes(' not ') ||
    normalized.includes(' are not ') ||
    normalized.includes(' is not ') ||
    normalized.includes('does not') ||
    normalized.includes('not authorized')
  ) {
    return false;
  }

  return [
    'spatial dynamics are solved',
    'fieldcue exists',
    'a3 response is route',
    'a3 response is walk',
    'a3 response is holonomy',
    'body response is semantic truth',
    'defects are active',
    'vortices are active',
    'rendering is authorized',
    'dense sampling is authorized',
  ].some((claim) => normalized.includes(claim));
}

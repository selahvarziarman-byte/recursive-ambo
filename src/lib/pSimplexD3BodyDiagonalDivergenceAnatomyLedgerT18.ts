import {
  buildPSimplexNonAxisThresholdSweepReadoutLedgerT16Report,
  type PSimplexT16DegeneracyKind,
  type PSimplexT16DominantNearestClass,
  type PSimplexT16FiniteLedgerRelation,
  type PSimplexT16FinitePredictionClass,
  type PSimplexT16ResponsePathClass,
  type PSimplexT16SweepRow,
  type PSimplexT16Verdict,
} from './pSimplexNonAxisThresholdSweepReadoutLedgerT16';
import {
  buildPSimplexA3ProvisionalReadoutLedgerT17Report,
  type PSimplexT17Verdict,
} from './pSimplexA3ProvisionalReadoutLedgerT17';
import {
  cleanNumber,
  PSIMPLEX_EPSILON,
  type PSimplexVec3,
} from './pSimplexVectorMath';

export type PSimplexT18D3Regime =
  | 'axis-locked-regime'
  | 'axis-dominant-tilted-regime'
  | 'continuous-tilt-regime'
  | 'A3-mediated-body-drive'
  | 'body-near-regime'
  | 'high-mixing-near-body'
  | 'unclassified-body-readout';

export type PSimplexT18DivergenceClass =
  | 'none'
  | 'body-overpredicted-by-finite-ledger'
  | 'A3-mediated-divergence'
  | 'axis-dominant-divergence'
  | 'continuous-tilt-divergence'
  | 'same-class-body-symmetry'
  | 'cross-class-body-threshold'
  | 'unclassified-body-divergence';

export type PSimplexT18FiniteLedgerOverpredictionClass =
  | 'body-overpredicted-by-finite-ledger'
  | 'none';

export type PSimplexT18DivergenceCauseNearestClass =
  | 'axis'
  | 'A3'
  | 'body'
  | 'continuous-tilt'
  | 'unclassified';

export type PSimplexT18ClosureState =
  | 'not-closed'
  | 'diagnostic-only'
  | 'requires-threshold-refinement'
  | 'requires-readout-refinement'
  | 'potential-design-warning';

export type PSimplexT18FiniteLedgerRelationClass = 'consistent' | 'coarse-compatible' | 'divergent';
export type PSimplexT18Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT18FinalRecommendation =
  | 'advance-to-D3-readout-refinement-note'
  | 'quarantine-D3-and-proceed-axis-plus-A3'
  | 'revisit-potential-design'
  | 'refine-D3-divergence-classifier'
  | 'return-to-T16-T17-interpretation';

export interface PSimplexT18D3AnatomyRow {
  rowId: string;
  sourceT16RowId: string;
  driveId: string;
  driveFamily: 'D3';
  s: number;
  J: PSimplexVec3;
  JHat: PSimplexVec3;
  d3Regime: PSimplexT18D3Regime;
  divergenceClass: PSimplexT18DivergenceClass;
  finiteLedgerOverpredictionClass: PSimplexT18FiniteLedgerOverpredictionClass;
  divergenceCauseNearestClass: PSimplexT18DivergenceCauseNearestClass;
  closureState: PSimplexT18ClosureState;
  degeneracyState: PSimplexT16DegeneracyKind;
  strictFiniteLedgerRelationClass: PSimplexT18FiniteLedgerRelationClass;
  contextualFiniteLedgerRelationClass: PSimplexT18FiniteLedgerRelationClass;
  finiteLedgerPredictedClass: PSimplexT16FinitePredictionClass;
  finiteLedgerWinningDirectionIds: string[];
  nearestAxisDirectionId: string | null;
  nearestA3DirectionId: string | null;
  nearestBodyDirectionId: string | null;
  A_axis: number;
  A_A3: number;
  A_body: number;
  dominantNearestClass: PSimplexT16DominantNearestClass;
  alignmentMarginTopVsSecond: number;
  alignmentMarginAxisVsA3: number;
  alignmentMarginAxisVsBody: number;
  alignmentMarginA3VsBody: number;
  nearDegeneracyCount: number;
  energyGapToSecondBestMinimum: number | null;
  nearBestFiniteClassSet: PSimplexT16DominantNearestClass[];
  thresholdSensitive: boolean;
  bestMinimumConverged: boolean;
  boundaryHit: boolean;
  divergenceFlag: boolean;
  lowSFlag: boolean;
  nearThresholdFlag: boolean;
  strongSFlag: boolean;
  bodyNearAtStrongSFlag: boolean;
  exceptionFlag: boolean;
  exceptionReasons: string[];
  notes: string[];
  ok: boolean;
}

export interface PSimplexT18DistributionRow {
  classId: string;
  count: number;
}

export interface PSimplexT18D3RegimeDistributionRow {
  d3Regime: PSimplexT18D3Regime;
  count: number;
}

export interface PSimplexT18DivergenceClassDistributionRow {
  divergenceClass: PSimplexT18DivergenceClass;
  count: number;
}

export interface PSimplexT18ClosureStateDistributionRow {
  closureState: PSimplexT18ClosureState;
  count: number;
}

export interface PSimplexT18DegeneracyStateDistributionRow {
  degeneracyState: PSimplexT16DegeneracyKind;
  count: number;
}

export interface PSimplexT18FiniteLedgerRelationDistributionRow {
  finiteLedgerRelationClass: PSimplexT18FiniteLedgerRelationClass;
  count: number;
}

export interface PSimplexT18DivergentRowTableRow {
  rowId: string;
  sourceT16RowId: string;
  driveId: string;
  s: number;
  d3Regime: PSimplexT18D3Regime;
  divergenceClass: PSimplexT18DivergenceClass;
  finiteLedgerOverpredictionClass: PSimplexT18FiniteLedgerOverpredictionClass;
  divergenceCauseNearestClass: PSimplexT18DivergenceCauseNearestClass;
  finiteLedgerPredictedClass: PSimplexT16FinitePredictionClass;
  dominantNearestClass: PSimplexT16DominantNearestClass;
  closureState: PSimplexT18ClosureState;
  lowSFlag: boolean;
  nearThresholdFlag: boolean;
  strongSFlag: boolean;
  notes: string[];
  ok: boolean;
}

export interface PSimplexT18DivergenceLocalizationRow {
  localizationClass:
    | 'low-s'
    | 'near-threshold'
    | 'strong-s'
    | 'all-s'
    | 'direction-specific'
    | 'symmetry-wide';
  rowCount: number;
  driveCount: number;
  strengthValues: number[];
  summaryJudgment: string;
  ok: boolean;
}

export interface PSimplexT18DivergentAlignmentCauseRow {
  alignmentCause:
    | 'axis-direction'
    | 'A3-root-direction'
    | 'body-diagonal'
    | 'intermediate-mixed-direction'
    | 'unclassified';
  rowCount: number;
  exampleRowIds: string[];
  summaryJudgment: string;
  ok: boolean;
}

export interface PSimplexT18BodyDriveRegimeSequenceRow {
  driveId: string;
  segmentIndex: number;
  sStart: number;
  sEnd: number;
  sValues: number[];
  d3Regime: PSimplexT18D3Regime;
  divergenceClass: PSimplexT18DivergenceClass;
  closureState: PSimplexT18ClosureState;
  dominantNearestClass: PSimplexT16DominantNearestClass;
  nearestAxisDirectionIds: string[];
  nearestA3DirectionIds: string[];
  nearestBodyDirectionIds: string[];
  alignmentMarginRangeTopVsSecond: [number, number];
  alignmentMarginRangeAxisVsA3: [number, number];
  alignmentMarginRangeAxisVsBody: [number, number];
  alignmentMarginRangeA3VsBody: [number, number];
  degeneracyState: PSimplexT16DegeneracyKind;
  strictFiniteLedgerRelationClass: PSimplexT18FiniteLedgerRelationClass;
  contextualFiniteLedgerRelationClass: PSimplexT18FiniteLedgerRelationClass;
  rowCount: number;
  ok: boolean;
}

export interface PSimplexT18BodyDriveSymmetryEquivalenceRow {
  driveId: string;
  matchesCanonicalSequence: boolean;
  firstMismatchIndex: number | null;
  mismatchReason: string | null;
  ok: boolean;
}

export interface PSimplexT18FiniteLedgerOverpredictionRow {
  overpredictionClass: PSimplexT18FiniteLedgerOverpredictionClass;
  rowCount: number;
  fractionOfDivergentRows: number;
  finiteLedgerPredictedClasses: PSimplexT16FinitePredictionClass[];
  actualDominantClasses: PSimplexT16DominantNearestClass[];
  actualD3Regimes: PSimplexT18D3Regime[];
  summaryJudgment: string;
  ok: boolean;
}

export interface PSimplexT18EnergyGapDegeneracySummaryRow {
  degeneracyState: PSimplexT16DegeneracyKind;
  rowCount: number;
  finiteEnergyGapCount: number;
  minEnergyGapToSecondBestMinimum: number | null;
  maxEnergyGapToSecondBestMinimum: number | null;
  zeroEnergyGapCount: number;
  nullEnergyGapCount: number;
  summaryJudgment: string;
  ok: boolean;
}

export interface PSimplexT18PotentialDesignWarningRow {
  bodyNearAppearsAtStrongS: boolean;
  bodyNearDriveCountAtMaxS: number;
  totalBodyDriveCount: number;
  strongSBodyNearRowCount: number;
  strongSNonBodyNearRowCount: number;
  potentialDesignWarning: boolean;
  thresholdRefinementNeeded: boolean;
  summaryJudgment: string;
  ok: boolean;
}

export interface PSimplexT18RowExceptionRow {
  rowId: string;
  sourceT16RowId: string;
  driveId: string;
  s: number;
  d3Regime: PSimplexT18D3Regime;
  divergenceClass: PSimplexT18DivergenceClass;
  closureState: PSimplexT18ClosureState;
  exceptionReasons: string[];
  ok: boolean;
}

export interface PSimplexT18InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT18Summary {
  sourceD3RowCount: number;
  expectedD3RowCount: 144;
  allD3RowsClassified: boolean;
  d3AxisLockedRegimeCount: number;
  d3AxisDominantTiltedRegimeCount: number;
  d3ContinuousTiltRegimeCount: number;
  d3A3MediatedBodyDriveCount: number;
  d3BodyNearRegimeCount: number;
  d3HighMixingNearBodyCount: number;
  d3UnclassifiedBodyReadoutCount: number;
  strictDivergentCount: number;
  contextualDivergentCount: number;
  divergentRowsClassifiedCount: number;
  unclassifiedBodyDivergenceCount: number;
  lowSDivergentCount: number;
  nearThresholdDivergentCount: number;
  strongSDivergentCount: number;
  symmetryWideDivergence: boolean;
  directionSpecificDivergence: boolean;
  axisDominantDivergenceCount: number;
  a3MediatedDivergenceCount: number;
  continuousTiltDivergenceCount: number;
  bodyOverpredictedByFiniteLedgerCount: number;
  singleMinimumCount: number;
  sameClassSymmetryDegeneracyCount: number;
  crossClassThresholdDegeneracyCount: number;
  unclassifiedDegeneracyCount: number;
  allEightBodyDrivesSymmetryEquivalent: boolean;
  regimeSequenceMismatchCount: number;
  bodyNearAppearsAtStrongS: boolean;
  thresholdRefinementNeeded: boolean;
  potentialDesignWarning: boolean;
  rowExceptionCount: number;
  requiresD3ReadoutRefinement: boolean;
  forbiddenBoundaryPassed: boolean;
}

export interface PSimplexD3BodyDiagonalDivergenceAnatomyLedgerT18Report {
  method: 'p-simplex-d3-body-diagonal-divergence-anatomy-ledger-t18';
  candidatePackage: 'p-simplex-d3-body-diagonal-divergence-anatomy-ledger-t18';
  parentT16Ledger: 'p-simplex-non-axis-threshold-sweep-readout-ledger-t16';
  parentT17Ledger: 'p-simplex-a3-provisional-readout-ledger-t17';
  diagnosticScope: 'd3-body-diagonal-divergence-anatomy-over-t16-d3-only';
  solverStatus: 'not-new-solver';
  spatialDynamicsStatus: 'not-spatial-lg-dynamics';
  fieldAtlasStatus: 'not-field-atlas';
  renderingStatus: 'not-rendering';
  fieldCueStatus: 'not-field-cue';
  semanticStatus: 'not-semantic-naming';
  routeStatus: 'no-route-walk-holonomy';
  defectStatus: 'no-defect-vortex-claims';
  denseSamplingStatus: 'not-dense-sampling';
  parentT16Verdict: PSimplexT16Verdict;
  parentT16Ok: boolean;
  parentT16IntegrityIssueCount: number;
  parentT17Verdict: PSimplexT17Verdict;
  parentT17Ok: boolean;
  parentT17IntegrityIssueCount: number;
  sourceD3RowCount: number;
  d3AnatomyRows: PSimplexT18D3AnatomyRow[];
  d3RegimeDistributionRows: PSimplexT18D3RegimeDistributionRow[];
  divergenceClassDistributionRows: PSimplexT18DivergenceClassDistributionRow[];
  closureStateDistributionRows: PSimplexT18ClosureStateDistributionRow[];
  degeneracyStateDistributionRows: PSimplexT18DegeneracyStateDistributionRow[];
  strictFiniteLedgerRelationRows: PSimplexT18FiniteLedgerRelationDistributionRow[];
  contextualFiniteLedgerRelationRows: PSimplexT18FiniteLedgerRelationDistributionRow[];
  divergentRowTable: PSimplexT18DivergentRowTableRow[];
  divergenceLocalizationRows: PSimplexT18DivergenceLocalizationRow[];
  divergentAlignmentCauseRows: PSimplexT18DivergentAlignmentCauseRow[];
  bodyDriveRegimeSequenceRows: PSimplexT18BodyDriveRegimeSequenceRow[];
  canonicalBodyRegimeSequenceRows: PSimplexT18BodyDriveRegimeSequenceRow[];
  bodyDriveSymmetryEquivalenceRows: PSimplexT18BodyDriveSymmetryEquivalenceRow[];
  finiteLedgerOverpredictionRows: PSimplexT18FiniteLedgerOverpredictionRow[];
  energyGapDegeneracySummaryRows: PSimplexT18EnergyGapDegeneracySummaryRow[];
  potentialDesignWarningRow: PSimplexT18PotentialDesignWarningRow;
  rowExceptionRows: PSimplexT18RowExceptionRow[];
  invalidInterpretationBoundaryRows: PSimplexT18InvalidInterpretationBoundaryRow[];
  summary: PSimplexT18Summary;
  verdict: PSimplexT18Verdict;
  finalRecommendation: PSimplexT18FinalRecommendation;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

const EXPECTED_D3_ROW_COUNT = 144;
const EXPECTED_D3_DRIVE_COUNT = 8;
const BODY_NEAR_ALIGNMENT = 0.985;
const SCALAR_TOLERANCE = 1e-6;

const D3_REGIMES: readonly PSimplexT18D3Regime[] = [
  'axis-locked-regime',
  'axis-dominant-tilted-regime',
  'continuous-tilt-regime',
  'A3-mediated-body-drive',
  'body-near-regime',
  'high-mixing-near-body',
  'unclassified-body-readout',
];

const DIVERGENCE_CLASSES: readonly PSimplexT18DivergenceClass[] = [
  'none',
  'body-overpredicted-by-finite-ledger',
  'A3-mediated-divergence',
  'axis-dominant-divergence',
  'continuous-tilt-divergence',
  'same-class-body-symmetry',
  'cross-class-body-threshold',
  'unclassified-body-divergence',
];

const CLOSURE_STATES: readonly PSimplexT18ClosureState[] = [
  'not-closed',
  'diagnostic-only',
  'requires-threshold-refinement',
  'requires-readout-refinement',
  'potential-design-warning',
];

const DEGENERACY_STATES: readonly PSimplexT16DegeneracyKind[] = [
  'single-minimum',
  'same-class-symmetry-degeneracy',
  'cross-class-threshold-degeneracy',
  'unclassified-degeneracy',
];

const FINITE_LEDGER_RELATION_CLASSES: readonly PSimplexT18FiniteLedgerRelationClass[] = [
  'consistent',
  'coarse-compatible',
  'divergent',
];

export function buildPSimplexD3BodyDiagonalDivergenceAnatomyLedgerT18Report(): PSimplexD3BodyDiagonalDivergenceAnatomyLedgerT18Report {
  const parentT16Report = buildPSimplexNonAxisThresholdSweepReadoutLedgerT16Report();
  const parentT17Report = buildPSimplexA3ProvisionalReadoutLedgerT17Report();
  const sourceD3Rows = parentT16Report.sweepRows.filter((row) => row.driveFamily === 'D3');
  const bodyThresholds = parentT16Report.thresholdReferenceRows
    .filter((row) => row.driveFamily === 'D3')
    .map((row) => row.value);
  const strengthValues = uniqueNumbers(sourceD3Rows.map((row) => row.s));
  const localizationDelta = inferGridDelta(bodyThresholds, strengthValues);
  const d3AnatomyRows = sourceD3Rows.map((row) =>
    classifyT16D3Row(row, bodyThresholds, localizationDelta),
  );
  const d3RegimeDistributionRows = buildRegimeDistributionRows(d3AnatomyRows);
  const divergenceClassDistributionRows = buildDivergenceClassDistributionRows(d3AnatomyRows);
  const closureStateDistributionRows = buildClosureStateDistributionRows(d3AnatomyRows);
  const degeneracyStateDistributionRows = buildDegeneracyStateDistributionRows(d3AnatomyRows);
  const strictFiniteLedgerRelationRows = buildFiniteLedgerRelationRows(d3AnatomyRows, 'strict');
  const contextualFiniteLedgerRelationRows = buildFiniteLedgerRelationRows(d3AnatomyRows, 'contextual');
  const divergentRowTable = buildDivergentRowTable(d3AnatomyRows);
  const divergenceLocalizationRows = buildDivergenceLocalizationRows(d3AnatomyRows, strengthValues);
  const divergentAlignmentCauseRows = buildDivergentAlignmentCauseRows(d3AnatomyRows);
  const bodyDriveRegimeSequenceRows = buildBodyDriveRegimeSequenceRows(d3AnatomyRows);
  const canonicalDriveId = firstDriveId(d3AnatomyRows);
  const canonicalBodyRegimeSequenceRows = bodyDriveRegimeSequenceRows.filter((row) => row.driveId === canonicalDriveId);
  const bodyDriveSymmetryEquivalenceRows = buildBodyDriveSymmetryEquivalenceRows(d3AnatomyRows, canonicalDriveId);
  const finiteLedgerOverpredictionRows = buildFiniteLedgerOverpredictionRows(d3AnatomyRows);
  const energyGapDegeneracySummaryRows = buildEnergyGapDegeneracySummaryRows(d3AnatomyRows);
  const potentialDesignWarningRow = buildPotentialDesignWarningRow(d3AnatomyRows);
  const rowExceptionRows = buildRowExceptionRows(d3AnatomyRows);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const summary = buildSummary({
    d3AnatomyRows,
    bodyDriveSymmetryEquivalenceRows,
    potentialDesignWarningRow,
    invalidInterpretationBoundaryRows,
  });
  const integrityIssues = collectIntegrityIssues({
    parentT16Report,
    parentT17Report,
    sourceD3Rows,
    d3AnatomyRows,
    divergentRowTable,
    bodyDriveSymmetryEquivalenceRows,
    potentialDesignWarningRow,
    invalidInterpretationBoundaryRows,
    summary,
  });
  const verdict = classifyVerdict(integrityIssues, summary);

  return {
    method: 'p-simplex-d3-body-diagonal-divergence-anatomy-ledger-t18',
    candidatePackage: 'p-simplex-d3-body-diagonal-divergence-anatomy-ledger-t18',
    parentT16Ledger: 'p-simplex-non-axis-threshold-sweep-readout-ledger-t16',
    parentT17Ledger: 'p-simplex-a3-provisional-readout-ledger-t17',
    diagnosticScope: 'd3-body-diagonal-divergence-anatomy-over-t16-d3-only',
    solverStatus: 'not-new-solver',
    spatialDynamicsStatus: 'not-spatial-lg-dynamics',
    fieldAtlasStatus: 'not-field-atlas',
    renderingStatus: 'not-rendering',
    fieldCueStatus: 'not-field-cue',
    semanticStatus: 'not-semantic-naming',
    routeStatus: 'no-route-walk-holonomy',
    defectStatus: 'no-defect-vortex-claims',
    denseSamplingStatus: 'not-dense-sampling',
    parentT16Verdict: parentT16Report.verdict,
    parentT16Ok: parentT16Report.ok,
    parentT16IntegrityIssueCount: parentT16Report.integrityIssueCount,
    parentT17Verdict: parentT17Report.verdict,
    parentT17Ok: parentT17Report.ok,
    parentT17IntegrityIssueCount: parentT17Report.integrityIssueCount,
    sourceD3RowCount: sourceD3Rows.length,
    d3AnatomyRows,
    d3RegimeDistributionRows,
    divergenceClassDistributionRows,
    closureStateDistributionRows,
    degeneracyStateDistributionRows,
    strictFiniteLedgerRelationRows,
    contextualFiniteLedgerRelationRows,
    divergentRowTable,
    divergenceLocalizationRows,
    divergentAlignmentCauseRows,
    bodyDriveRegimeSequenceRows,
    canonicalBodyRegimeSequenceRows,
    bodyDriveSymmetryEquivalenceRows,
    finiteLedgerOverpredictionRows,
    energyGapDegeneracySummaryRows,
    potentialDesignWarningRow,
    rowExceptionRows,
    invalidInterpretationBoundaryRows,
    summary,
    verdict,
    finalRecommendation: recommendationForVerdict(verdict, summary),
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: verdict !== 'FAIL' && integrityIssues.length === 0,
  };
}

function classifyT16D3Row(
  row: PSimplexT16SweepRow,
  bodyThresholds: readonly number[],
  localizationDelta: number,
): PSimplexT18D3AnatomyRow {
  const strictFiniteLedgerRelationClass = relationClassFromT16(row.finiteLedgerRelationStrict);
  const contextualFiniteLedgerRelationClass = relationClassFromT16(row.finiteLedgerRelationContextual);
  const divergenceFlag = row.finiteLedgerRelationStrict === 'finite-ledger-divergent';
  const d3Regime = d3RegimeFromT16Row(row);
  const finiteLedgerOverpredictionClass = finiteLedgerOverpredictionClassForRow(row);
  const divergenceClass = divergenceClassForRow(row);
  const divergenceCauseNearestClass = divergenceCauseNearestClassForRow(row);
  const closureState = closureStateForRow(row);
  const lowSFlag = lowSFlagForRow(row.s, bodyThresholds, localizationDelta);
  const nearThresholdFlag = nearThresholdFlagForRow(row.s, bodyThresholds, localizationDelta);
  const strongSFlag = strongSFlagForRow(row.s, bodyThresholds);
  const bodyNearAtStrongSFlag = strongSFlag && d3Regime === 'body-near-regime';
  const exceptionReasons = exceptionReasonsForRow(row, d3Regime, divergenceClass);
  const notes = notesForRow(row, d3Regime, divergenceClass, finiteLedgerOverpredictionClass);

  return {
    rowId: `T18-${row.rowId}`,
    sourceT16RowId: row.rowId,
    driveId: row.driveId,
    driveFamily: 'D3',
    s: row.s,
    J: [...row.J],
    JHat: [...row.JHat],
    d3Regime,
    divergenceClass,
    finiteLedgerOverpredictionClass,
    divergenceCauseNearestClass,
    closureState,
    degeneracyState: row.degeneracyKind,
    strictFiniteLedgerRelationClass,
    contextualFiniteLedgerRelationClass,
    finiteLedgerPredictedClass: row.finiteLedgerPredictedClass,
    finiteLedgerWinningDirectionIds: [...row.finiteLedgerWinningDirectionIds],
    nearestAxisDirectionId: row.nearestAxisDirectionId,
    nearestA3DirectionId: row.nearestA3DirectionId,
    nearestBodyDirectionId: row.nearestBodyDirectionId,
    A_axis: row.A_axis,
    A_A3: row.A_A3,
    A_body: row.A_body,
    dominantNearestClass: row.dominantNearestClass,
    alignmentMarginTopVsSecond: row.alignmentMarginTopVsSecond,
    alignmentMarginAxisVsA3: row.alignmentMarginAxisVsA3,
    alignmentMarginAxisVsBody: row.alignmentMarginAxisVsBody,
    alignmentMarginA3VsBody: row.alignmentMarginA3VsBody,
    nearDegeneracyCount: row.nearDegeneracyCount,
    energyGapToSecondBestMinimum: row.energyGapToSecondBestMinimum,
    nearBestFiniteClassSet: [...row.nearBestFiniteClassSet],
    thresholdSensitive: row.thresholdSensitive,
    bestMinimumConverged: row.bestMinimumConverged,
    boundaryHit: row.boundaryHit,
    divergenceFlag,
    lowSFlag,
    nearThresholdFlag,
    strongSFlag,
    bodyNearAtStrongSFlag,
    exceptionFlag: exceptionReasons.length > 0,
    exceptionReasons,
    notes,
    ok: exceptionReasons.length === 0,
  };
}

function d3RegimeFromT16Row(row: PSimplexT16SweepRow): PSimplexT18D3Regime {
  if (
    row.responsePathClass === 'axis-locked-regime' ||
    row.responsePathClass === 'axis-dominant-tilted-regime' ||
    row.responsePathClass === 'continuous-tilt-regime'
  ) {
    return row.responsePathClass;
  }

  if (row.dominantNearestClass === 'a3-transition') {
    return 'A3-mediated-body-drive';
  }

  if (row.responsePathClass === 'body-near-regime' && row.A_body >= BODY_NEAR_ALIGNMENT) {
    return 'body-near-regime';
  }

  if (row.dominantNearestClass === 'body-diagonal-high-mixing') {
    return row.A_body >= BODY_NEAR_ALIGNMENT ? 'body-near-regime' : 'high-mixing-near-body';
  }

  if (row.dominantNearestClass === 'axis-well') {
    return row.A_axis >= BODY_NEAR_ALIGNMENT ? 'axis-locked-regime' : 'axis-dominant-tilted-regime';
  }

  return 'unclassified-body-readout';
}

function finiteLedgerOverpredictionClassForRow(
  row: PSimplexT16SweepRow,
): PSimplexT18FiniteLedgerOverpredictionClass {
  return row.finiteLedgerRelationStrict === 'finite-ledger-divergent' &&
    row.finiteLedgerPredictedClass === 'body-diagonal-high-mixing' &&
    row.dominantNearestClass !== 'body-diagonal-high-mixing'
    ? 'body-overpredicted-by-finite-ledger'
    : 'none';
}

function divergenceClassForRow(row: PSimplexT16SweepRow): PSimplexT18DivergenceClass {
  if (row.finiteLedgerRelationStrict !== 'finite-ledger-divergent') {
    return 'none';
  }

  if (row.responsePathClass === 'continuous-tilt-regime') {
    return 'continuous-tilt-divergence';
  }

  if (row.dominantNearestClass === 'axis-well') {
    return 'axis-dominant-divergence';
  }

  if (row.dominantNearestClass === 'a3-transition') {
    return 'A3-mediated-divergence';
  }

  if (row.degeneracyKind === 'cross-class-threshold-degeneracy') {
    return 'cross-class-body-threshold';
  }

  if (
    row.degeneracyKind === 'same-class-symmetry-degeneracy' &&
    row.nearBestFiniteClassSet.length > 0 &&
    row.nearBestFiniteClassSet.every((classId) => classId === 'body-diagonal-high-mixing')
  ) {
    return 'same-class-body-symmetry';
  }

  if (finiteLedgerOverpredictionClassForRow(row) === 'body-overpredicted-by-finite-ledger') {
    return 'body-overpredicted-by-finite-ledger';
  }

  return 'unclassified-body-divergence';
}

function divergenceCauseNearestClassForRow(row: PSimplexT16SweepRow): PSimplexT18DivergenceCauseNearestClass {
  if (row.finiteLedgerRelationStrict !== 'finite-ledger-divergent') {
    return 'unclassified';
  }

  if (row.responsePathClass === 'continuous-tilt-regime') {
    return 'continuous-tilt';
  }

  if (row.dominantNearestClass === 'axis-well') {
    return 'axis';
  }

  if (row.dominantNearestClass === 'a3-transition') {
    return 'A3';
  }

  if (row.dominantNearestClass === 'body-diagonal-high-mixing') {
    return 'body';
  }

  return 'unclassified';
}

function closureStateForRow(row: PSimplexT16SweepRow): PSimplexT18ClosureState {
  if (!row.bestMinimumConverged || row.boundaryHit) {
    return 'diagnostic-only';
  }

  if (row.finiteLedgerRelationStrict === 'finite-ledger-divergent') {
    return 'requires-readout-refinement';
  }

  if (row.thresholdSensitive || row.degeneracyKind === 'cross-class-threshold-degeneracy') {
    return 'requires-threshold-refinement';
  }

  return 'not-closed';
}

function relationClassFromT16(relation: PSimplexT16FiniteLedgerRelation): PSimplexT18FiniteLedgerRelationClass {
  if (relation === 'finite-ledger-consistent') {
    return 'consistent';
  }

  if (relation === 'finite-ledger-coarse-compatible') {
    return 'coarse-compatible';
  }

  return 'divergent';
}

function exceptionReasonsForRow(
  row: PSimplexT16SweepRow,
  d3Regime: PSimplexT18D3Regime,
  divergenceClass: PSimplexT18DivergenceClass,
): string[] {
  const reasons: string[] = [];

  if (d3Regime === 'unclassified-body-readout') {
    reasons.push(`unclassified-source-response-path-${row.responsePathClass}`);
  }

  if (
    row.finiteLedgerRelationStrict === 'finite-ledger-divergent' &&
    divergenceClass === 'unclassified-body-divergence'
  ) {
    reasons.push('strict-divergent-row-lacks-divergence-anatomy');
  }

  if (!row.bestMinimumConverged) {
    reasons.push('non-converged-best-minimum');
  }

  if (row.boundaryHit) {
    reasons.push('boundary-hit');
  }

  if (!row.ok) {
    reasons.push('source-t16-row-not-ok');
  }

  return [...new Set(reasons)];
}

function notesForRow(
  row: PSimplexT16SweepRow,
  d3Regime: PSimplexT18D3Regime,
  divergenceClass: PSimplexT18DivergenceClass,
  finiteLedgerOverpredictionClass: PSimplexT18FiniteLedgerOverpredictionClass,
): string[] {
  const notes: string[] = ['D3-body-diagonal-readout-is-not-closed'];

  if (
    row.finiteLedgerRelationStrict !== 'finite-ledger-divergent' &&
    row.degeneracyKind === 'same-class-symmetry-degeneracy' &&
    row.nearBestFiniteClassSet.length > 0 &&
    row.nearBestFiniteClassSet.every((classId) => classId === 'body-diagonal-high-mixing')
  ) {
    notes.push('same-class-body-degeneracy-recorded-without-divergence-class');
  }

  if (row.finiteLedgerRelationStrict === 'finite-ledger-divergent') {
    notes.push('strict-finite-ledger-divergence-classified');
  }

  if (finiteLedgerOverpredictionClass === 'body-overpredicted-by-finite-ledger') {
    notes.push('finite-ledger-predicts-body-before-minimizer-readout-is-body-near');
  }

  if (d3Regime === 'axis-dominant-tilted-regime' && row.responsePathClass === 'finite-ledger-divergent') {
    notes.push('strict-divergent-row-classified-from-dominant-axis-alignment');
  }

  if (divergenceClass !== 'none') {
    notes.push(`divergence-class-${divergenceClass}`);
  }

  return [...new Set([...notes, ...row.notes])];
}

function buildRegimeDistributionRows(rows: readonly PSimplexT18D3AnatomyRow[]): PSimplexT18D3RegimeDistributionRow[] {
  return D3_REGIMES.map((d3Regime) => ({
    d3Regime,
    count: rows.filter((row) => row.d3Regime === d3Regime).length,
  }));
}

function buildDivergenceClassDistributionRows(
  rows: readonly PSimplexT18D3AnatomyRow[],
): PSimplexT18DivergenceClassDistributionRow[] {
  return DIVERGENCE_CLASSES.map((divergenceClass) => ({
    divergenceClass,
    count: rows.filter((row) => row.divergenceClass === divergenceClass).length,
  }));
}

function buildClosureStateDistributionRows(
  rows: readonly PSimplexT18D3AnatomyRow[],
): PSimplexT18ClosureStateDistributionRow[] {
  return CLOSURE_STATES.map((closureState) => ({
    closureState,
    count: rows.filter((row) => row.closureState === closureState).length,
  }));
}

function buildDegeneracyStateDistributionRows(
  rows: readonly PSimplexT18D3AnatomyRow[],
): PSimplexT18DegeneracyStateDistributionRow[] {
  return DEGENERACY_STATES.map((degeneracyState) => ({
    degeneracyState,
    count: rows.filter((row) => row.degeneracyState === degeneracyState).length,
  }));
}

function buildFiniteLedgerRelationRows(
  rows: readonly PSimplexT18D3AnatomyRow[],
  layer: 'strict' | 'contextual',
): PSimplexT18FiniteLedgerRelationDistributionRow[] {
  return FINITE_LEDGER_RELATION_CLASSES.map((finiteLedgerRelationClass) => ({
    finiteLedgerRelationClass,
    count: rows.filter((row) =>
      layer === 'strict'
        ? row.strictFiniteLedgerRelationClass === finiteLedgerRelationClass
        : row.contextualFiniteLedgerRelationClass === finiteLedgerRelationClass,
    ).length,
  }));
}

function buildDivergentRowTable(rows: readonly PSimplexT18D3AnatomyRow[]): PSimplexT18DivergentRowTableRow[] {
  return rows
    .filter((row) => row.divergenceFlag)
    .map((row) => ({
      rowId: row.rowId,
      sourceT16RowId: row.sourceT16RowId,
      driveId: row.driveId,
      s: row.s,
      d3Regime: row.d3Regime,
      divergenceClass: row.divergenceClass,
      finiteLedgerOverpredictionClass: row.finiteLedgerOverpredictionClass,
      divergenceCauseNearestClass: row.divergenceCauseNearestClass,
      finiteLedgerPredictedClass: row.finiteLedgerPredictedClass,
      dominantNearestClass: row.dominantNearestClass,
      closureState: row.closureState,
      lowSFlag: row.lowSFlag,
      nearThresholdFlag: row.nearThresholdFlag,
      strongSFlag: row.strongSFlag,
      notes: [...row.notes],
      ok: row.divergenceClass !== 'none' && row.divergenceClass !== 'unclassified-body-divergence',
    }));
}

function buildDivergenceLocalizationRows(
  rows: readonly PSimplexT18D3AnatomyRow[],
  allStrengthValues: readonly number[],
): PSimplexT18DivergenceLocalizationRow[] {
  const divergentRows = rows.filter((row) => row.divergenceFlag);
  const byLow = divergentRows.filter((row) => row.lowSFlag);
  const byThreshold = divergentRows.filter((row) => row.nearThresholdFlag);
  const byStrong = divergentRows.filter((row) => row.strongSFlag);
  const allS =
    divergentRows.length > 0 && uniqueNumbers(divergentRows.map((row) => row.s)).length === allStrengthValues.length
      ? divergentRows
      : [];
  const driveCount = uniqueDriveIds(rows).length;
  const divergentDriveCount = uniqueDriveIds(divergentRows).length;
  const symmetryWide = divergentDriveCount === driveCount ? divergentRows : [];
  const directionSpecific = divergentDriveCount > 0 && divergentDriveCount < driveCount ? divergentRows : [];

  return [
    localizationRow('low-s', byLow, 'Divergence below the finite body references.', byLow.length === 0),
    localizationRow(
      'near-threshold',
      byThreshold,
      'Divergence is checked at finite-reference threshold grid points.',
      true,
    ),
    localizationRow('strong-s', byStrong, 'Divergence persists after the upper body finite reference.', true),
    localizationRow('all-s', allS, 'Divergence across every sampled strength would indicate global mismatch.', allS.length === 0),
    localizationRow(
      'direction-specific',
      directionSpecific,
      'Direction-specific divergence would break body-drive symmetry.',
      directionSpecific.length === 0,
    ),
    localizationRow(
      'symmetry-wide',
      symmetryWide,
      'Divergence appears across the body-drive symmetry orbit.',
      symmetryWide.length === divergentRows.length,
    ),
  ];
}

function localizationRow(
  localizationClass: PSimplexT18DivergenceLocalizationRow['localizationClass'],
  rows: readonly PSimplexT18D3AnatomyRow[],
  summaryJudgment: string,
  ok: boolean,
): PSimplexT18DivergenceLocalizationRow {
  return {
    localizationClass,
    rowCount: rows.length,
    driveCount: uniqueDriveIds(rows).length,
    strengthValues: uniqueNumbers(rows.map((row) => row.s)),
    summaryJudgment,
    ok,
  };
}

function buildDivergentAlignmentCauseRows(
  rows: readonly PSimplexT18D3AnatomyRow[],
): PSimplexT18DivergentAlignmentCauseRow[] {
  const divergentRows = rows.filter((row) => row.divergenceFlag);
  const causes: readonly PSimplexT18DivergentAlignmentCauseRow['alignmentCause'][] = [
    'axis-direction',
    'A3-root-direction',
    'body-diagonal',
    'intermediate-mixed-direction',
    'unclassified',
  ];

  return causes.map((alignmentCause) => {
    const causeRows = divergentRows.filter((row) => alignmentCauseForRow(row) === alignmentCause);

    return {
      alignmentCause,
      rowCount: causeRows.length,
      exampleRowIds: causeRows.slice(0, 4).map((row) => row.rowId),
      summaryJudgment: summaryForAlignmentCause(alignmentCause, causeRows.length),
      ok: alignmentCause !== 'unclassified' || causeRows.length === 0,
    };
  });
}

function alignmentCauseForRow(
  row: PSimplexT18D3AnatomyRow,
): PSimplexT18DivergentAlignmentCauseRow['alignmentCause'] {
  if (row.alignmentMarginTopVsSecond <= SCALAR_TOLERANCE) {
    return 'intermediate-mixed-direction';
  }

  if (row.dominantNearestClass === 'axis-well') {
    return 'axis-direction';
  }

  if (row.dominantNearestClass === 'a3-transition') {
    return 'A3-root-direction';
  }

  if (row.dominantNearestClass === 'body-diagonal-high-mixing') {
    return 'body-diagonal';
  }

  return 'unclassified';
}

function summaryForAlignmentCause(
  alignmentCause: PSimplexT18DivergentAlignmentCauseRow['alignmentCause'],
  rowCount: number,
): string {
  if (rowCount === 0) {
    return 'No divergent rows have this nearest-readout cause.';
  }

  if (alignmentCause === 'axis-direction') {
    return 'The bounded minimizer remains closest to an axis direction while the finite ledger predicts body response.';
  }

  if (alignmentCause === 'A3-root-direction') {
    return 'The bounded minimizer is mediated by an A3 root direction rather than body-near response.';
  }

  if (alignmentCause === 'body-diagonal') {
    return 'Divergence is same-class body structure rather than a closed body response.';
  }

  if (alignmentCause === 'intermediate-mixed-direction') {
    return 'Divergence lies in a mixed alignment band and needs readout refinement.';
  }

  return 'Divergence cause is not classified by the available T16 alignment fields.';
}

function buildBodyDriveRegimeSequenceRows(
  rows: readonly PSimplexT18D3AnatomyRow[],
): PSimplexT18BodyDriveRegimeSequenceRow[] {
  return uniqueDriveIds(rows).flatMap((driveId) => buildSequenceRowsForDrive(driveId, rowsForDrive(rows, driveId)));
}

function buildSequenceRowsForDrive(
  driveId: string,
  rows: readonly PSimplexT18D3AnatomyRow[],
): PSimplexT18BodyDriveRegimeSequenceRow[] {
  const sortedRows = [...rows].sort((left, right) => left.s - right.s);
  const segments: PSimplexT18BodyDriveRegimeSequenceRow[] = [];
  let currentSegmentRows: PSimplexT18D3AnatomyRow[] = [];

  for (const row of sortedRows) {
    const previous = currentSegmentRows[currentSegmentRows.length - 1];

    if (!previous || segmentKey(previous) === segmentKey(row)) {
      currentSegmentRows.push(row);
    } else {
      segments.push(segmentRowFromRows(driveId, segments.length, currentSegmentRows));
      currentSegmentRows = [row];
    }
  }

  if (currentSegmentRows.length > 0) {
    segments.push(segmentRowFromRows(driveId, segments.length, currentSegmentRows));
  }

  return segments;
}

function segmentRowFromRows(
  driveId: string,
  segmentIndex: number,
  rows: readonly PSimplexT18D3AnatomyRow[],
): PSimplexT18BodyDriveRegimeSequenceRow {
  const firstRow = rows[0];
  const sValues = rows.map((row) => row.s);

  return {
    driveId,
    segmentIndex,
    sStart: cleanNumber(Math.min(...sValues)),
    sEnd: cleanNumber(Math.max(...sValues)),
    sValues,
    d3Regime: firstRow.d3Regime,
    divergenceClass: firstRow.divergenceClass,
    closureState: firstRow.closureState,
    dominantNearestClass: firstRow.dominantNearestClass,
    nearestAxisDirectionIds: uniqueNonNull(rows.map((row) => row.nearestAxisDirectionId)),
    nearestA3DirectionIds: uniqueNonNull(rows.map((row) => row.nearestA3DirectionId)),
    nearestBodyDirectionIds: uniqueNonNull(rows.map((row) => row.nearestBodyDirectionId)),
    alignmentMarginRangeTopVsSecond: numericRange(rows.map((row) => row.alignmentMarginTopVsSecond)),
    alignmentMarginRangeAxisVsA3: numericRange(rows.map((row) => row.alignmentMarginAxisVsA3)),
    alignmentMarginRangeAxisVsBody: numericRange(rows.map((row) => row.alignmentMarginAxisVsBody)),
    alignmentMarginRangeA3VsBody: numericRange(rows.map((row) => row.alignmentMarginA3VsBody)),
    degeneracyState: firstRow.degeneracyState,
    strictFiniteLedgerRelationClass: firstRow.strictFiniteLedgerRelationClass,
    contextualFiniteLedgerRelationClass: firstRow.contextualFiniteLedgerRelationClass,
    rowCount: rows.length,
    ok: rows.every((row) => row.ok),
  };
}

function buildBodyDriveSymmetryEquivalenceRows(
  rows: readonly PSimplexT18D3AnatomyRow[],
  canonicalDriveId: string | null,
): PSimplexT18BodyDriveSymmetryEquivalenceRow[] {
  if (!canonicalDriveId) {
    return [];
  }

  const canonicalRows = rowsForDrive(rows, canonicalDriveId).sort((left, right) => left.s - right.s);

  return uniqueDriveIds(rows).map((driveId) => {
    const comparisonRows = rowsForDrive(rows, driveId).sort((left, right) => left.s - right.s);
    const mismatch = firstSequenceMismatch(canonicalRows, comparisonRows);

    return {
      driveId,
      matchesCanonicalSequence: mismatch === null,
      firstMismatchIndex: mismatch?.index ?? null,
      mismatchReason: mismatch?.reason ?? null,
      ok: mismatch === null,
    };
  });
}

function firstSequenceMismatch(
  canonicalRows: readonly PSimplexT18D3AnatomyRow[],
  comparisonRows: readonly PSimplexT18D3AnatomyRow[],
): { index: number; reason: string } | null {
  if (canonicalRows.length !== comparisonRows.length) {
    return { index: Math.min(canonicalRows.length, comparisonRows.length), reason: 'row-count-mismatch' };
  }

  for (let index = 0; index < canonicalRows.length; index += 1) {
    const canonical = canonicalRows[index];
    const comparison = comparisonRows[index];

    if (!near(canonical.s, comparison.s)) {
      return { index, reason: 'strength-grid-mismatch' };
    }

    if (
      canonical.d3Regime !== comparison.d3Regime ||
      canonical.divergenceClass !== comparison.divergenceClass ||
      canonical.closureState !== comparison.closureState ||
      canonical.degeneracyState !== comparison.degeneracyState ||
      canonical.strictFiniteLedgerRelationClass !== comparison.strictFiniteLedgerRelationClass ||
      canonical.contextualFiniteLedgerRelationClass !== comparison.contextualFiniteLedgerRelationClass ||
      canonical.dominantNearestClass !== comparison.dominantNearestClass ||
      canonical.thresholdSensitive !== comparison.thresholdSensitive
    ) {
      return { index, reason: 'class-level-sequence-mismatch' };
    }
  }

  return null;
}

function buildFiniteLedgerOverpredictionRows(
  rows: readonly PSimplexT18D3AnatomyRow[],
): PSimplexT18FiniteLedgerOverpredictionRow[] {
  const divergentRows = rows.filter((row) => row.divergenceFlag);
  const classes: readonly PSimplexT18FiniteLedgerOverpredictionClass[] = [
    'body-overpredicted-by-finite-ledger',
    'none',
  ];

  return classes.map((overpredictionClass) => {
    const classRows = divergentRows.filter((row) => row.finiteLedgerOverpredictionClass === overpredictionClass);

    return {
      overpredictionClass,
      rowCount: classRows.length,
      fractionOfDivergentRows: cleanNumber(divergentRows.length > 0 ? classRows.length / divergentRows.length : 0),
      finiteLedgerPredictedClasses: uniqueValues(classRows.map((row) => row.finiteLedgerPredictedClass)),
      actualDominantClasses: uniqueValues(classRows.map((row) => row.dominantNearestClass)),
      actualD3Regimes: uniqueValues(classRows.map((row) => row.d3Regime)),
      summaryJudgment:
        overpredictionClass === 'body-overpredicted-by-finite-ledger'
          ? 'Finite ledger predicts body-diagonal high-mixing before the bounded minimizer reads body-near.'
          : 'Divergent rows without finite body overprediction would require another cause.',
      ok: overpredictionClass !== 'none' || classRows.length === 0,
    };
  });
}

function buildEnergyGapDegeneracySummaryRows(
  rows: readonly PSimplexT18D3AnatomyRow[],
): PSimplexT18EnergyGapDegeneracySummaryRow[] {
  return DEGENERACY_STATES.map((degeneracyState) => {
    const stateRows = rows.filter((row) => row.degeneracyState === degeneracyState);
    const finiteGaps = stateRows
      .map((row) => row.energyGapToSecondBestMinimum)
      .filter((value): value is number => value !== null);

    return {
      degeneracyState,
      rowCount: stateRows.length,
      finiteEnergyGapCount: finiteGaps.length,
      minEnergyGapToSecondBestMinimum: finiteGaps.length > 0 ? cleanNumber(Math.min(...finiteGaps)) : null,
      maxEnergyGapToSecondBestMinimum: finiteGaps.length > 0 ? cleanNumber(Math.max(...finiteGaps)) : null,
      zeroEnergyGapCount: finiteGaps.filter((value) => Math.abs(value) <= SCALAR_TOLERANCE).length,
      nullEnergyGapCount: stateRows.length - finiteGaps.length,
      summaryJudgment: summaryForDegeneracyState(degeneracyState, stateRows.length, finiteGaps),
      ok: degeneracyState !== 'unclassified-degeneracy' || stateRows.length === 0,
    };
  });
}

function summaryForDegeneracyState(
  degeneracyState: PSimplexT16DegeneracyKind,
  rowCount: number,
  finiteGaps: readonly number[],
): string {
  if (rowCount === 0) {
    return 'No rows carry this degeneracy state.';
  }

  if (degeneracyState === 'same-class-symmetry-degeneracy') {
    return 'Same-class degeneracy is retained as symmetry evidence, not a closed body response.';
  }

  if (degeneracyState === 'single-minimum') {
    return 'Single-minimum strong rows provide body-near readout evidence without closure.';
  }

  if (degeneracyState === 'cross-class-threshold-degeneracy') {
    return 'Cross-class threshold rows would require threshold refinement.';
  }

  return finiteGaps.length > 0
    ? 'Unclassified degeneracy has finite energy gaps and needs readout refinement.'
    : 'Unclassified degeneracy has no finite gap evidence.';
}

function buildPotentialDesignWarningRow(
  rows: readonly PSimplexT18D3AnatomyRow[],
): PSimplexT18PotentialDesignWarningRow {
  const driveIds = uniqueDriveIds(rows);
  const maxS = Math.max(...rows.map((row) => row.s));
  const maxRows = rows.filter((row) => near(row.s, maxS));
  const strongRows = rows.filter((row) => row.strongSFlag);
  const strongBodyNearRows = strongRows.filter((row) => row.d3Regime === 'body-near-regime');
  const bodyNearDriveCountAtMaxS = uniqueDriveIds(maxRows.filter((row) => row.d3Regime === 'body-near-regime')).length;
  const bodyNearAppearsAtStrongS = driveIds.every((driveId) =>
    rowsForDrive(strongBodyNearRows, driveId).length > 0,
  );
  const potentialDesignWarning = !bodyNearAppearsAtStrongS;
  const thresholdRefinementNeeded =
    bodyNearAppearsAtStrongS &&
    rows.some(
      (row) =>
        row.divergenceFlag &&
        row.finiteLedgerOverpredictionClass === 'body-overpredicted-by-finite-ledger',
    );

  return {
    bodyNearAppearsAtStrongS,
    bodyNearDriveCountAtMaxS,
    totalBodyDriveCount: driveIds.length,
    strongSBodyNearRowCount: strongBodyNearRows.length,
    strongSNonBodyNearRowCount: strongRows.length - strongBodyNearRows.length,
    potentialDesignWarning,
    thresholdRefinementNeeded,
    summaryJudgment: potentialDesignWarning
      ? 'Strong forcing does not produce body-near readout across the body-drive family.'
      : thresholdRefinementNeeded
        ? 'Body-near readout appears at strong forcing, but the finite crossover is earlier than the minimizer readout.'
        : 'Body-near readout appears at strong forcing without a family-level potential-design warning.',
    ok: !potentialDesignWarning,
  };
}

function buildRowExceptionRows(rows: readonly PSimplexT18D3AnatomyRow[]): PSimplexT18RowExceptionRow[] {
  return rows
    .filter((row) => row.exceptionFlag)
    .map((row) => ({
      rowId: row.rowId,
      sourceT16RowId: row.sourceT16RowId,
      driveId: row.driveId,
      s: row.s,
      d3Regime: row.d3Regime,
      divergenceClass: row.divergenceClass,
      closureState: row.closureState,
      exceptionReasons: [...row.exceptionReasons],
      ok: row.ok,
    }));
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT18InvalidInterpretationBoundaryRow[] {
  return [
    { boundaryId: 'body-response-not-closed', statement: 'body response is not closed', enforced: true },
    { boundaryId: 'body-response-not-cue', statement: 'body response is not a cue', enforced: true },
    {
      boundaryId: 'body-response-not-route-walk-holonomy',
      statement: 'body diagonal behavior is not route, walk, or holonomy',
      enforced: true,
    },
    {
      boundaryId: 'body-response-not-defect-vortex',
      statement: 'body diagonal behavior is not defect or vortex behavior',
      enforced: true,
    },
    {
      boundaryId: 'body-response-not-semantic-meaning',
      statement: 'body diagonal behavior is not semantic meaning',
      enforced: true,
    },
    { boundaryId: 'not-spatial-dynamics', statement: 'spatial dynamics are not active', enforced: true },
    { boundaryId: 'not-dense-sampling', statement: 'dense sampling is not authorized', enforced: true },
  ];
}

function buildSummary(args: {
  d3AnatomyRows: readonly PSimplexT18D3AnatomyRow[];
  bodyDriveSymmetryEquivalenceRows: readonly PSimplexT18BodyDriveSymmetryEquivalenceRow[];
  potentialDesignWarningRow: PSimplexT18PotentialDesignWarningRow;
  invalidInterpretationBoundaryRows: readonly PSimplexT18InvalidInterpretationBoundaryRow[];
}): PSimplexT18Summary {
  const { d3AnatomyRows } = args;
  const strictDivergentRows = d3AnatomyRows.filter((row) => row.divergenceFlag);
  const divergentRowsClassifiedCount = strictDivergentRows.filter(
    (row) => row.divergenceClass !== 'none' && row.divergenceClass !== 'unclassified-body-divergence',
  ).length;
  const uniqueDivergentDriveCount = uniqueDriveIds(strictDivergentRows).length;
  const totalDriveCount = uniqueDriveIds(d3AnatomyRows).length;
  const regimeSequenceMismatchCount = args.bodyDriveSymmetryEquivalenceRows.filter(
    (row) => !row.matchesCanonicalSequence,
  ).length;
  const rowExceptionCount = d3AnatomyRows.filter((row) => row.exceptionFlag).length;
  const unclassifiedBodyDivergenceCount = countDivergenceClass(d3AnatomyRows, 'unclassified-body-divergence');
  const strictDivergentCount = strictDivergentRows.length;

  return {
    sourceD3RowCount: d3AnatomyRows.length,
    expectedD3RowCount: EXPECTED_D3_ROW_COUNT,
    allD3RowsClassified:
      d3AnatomyRows.every((row) => row.d3Regime !== 'unclassified-body-readout') &&
      divergentRowsClassifiedCount === strictDivergentCount,
    d3AxisLockedRegimeCount: countRegime(d3AnatomyRows, 'axis-locked-regime'),
    d3AxisDominantTiltedRegimeCount: countRegime(d3AnatomyRows, 'axis-dominant-tilted-regime'),
    d3ContinuousTiltRegimeCount: countRegime(d3AnatomyRows, 'continuous-tilt-regime'),
    d3A3MediatedBodyDriveCount: countRegime(d3AnatomyRows, 'A3-mediated-body-drive'),
    d3BodyNearRegimeCount: countRegime(d3AnatomyRows, 'body-near-regime'),
    d3HighMixingNearBodyCount: countRegime(d3AnatomyRows, 'high-mixing-near-body'),
    d3UnclassifiedBodyReadoutCount: countRegime(d3AnatomyRows, 'unclassified-body-readout'),
    strictDivergentCount,
    contextualDivergentCount: countContextualRelation(d3AnatomyRows, 'divergent'),
    divergentRowsClassifiedCount,
    unclassifiedBodyDivergenceCount,
    lowSDivergentCount: strictDivergentRows.filter((row) => row.lowSFlag).length,
    nearThresholdDivergentCount: strictDivergentRows.filter((row) => row.nearThresholdFlag).length,
    strongSDivergentCount: strictDivergentRows.filter((row) => row.strongSFlag).length,
    symmetryWideDivergence: strictDivergentCount > 0 && uniqueDivergentDriveCount === totalDriveCount,
    directionSpecificDivergence: uniqueDivergentDriveCount > 0 && uniqueDivergentDriveCount < totalDriveCount,
    axisDominantDivergenceCount: countDivergenceClass(d3AnatomyRows, 'axis-dominant-divergence'),
    a3MediatedDivergenceCount: countDivergenceClass(d3AnatomyRows, 'A3-mediated-divergence'),
    continuousTiltDivergenceCount: countDivergenceClass(d3AnatomyRows, 'continuous-tilt-divergence'),
    bodyOverpredictedByFiniteLedgerCount: d3AnatomyRows.filter(
      (row) => row.finiteLedgerOverpredictionClass === 'body-overpredicted-by-finite-ledger',
    ).length,
    singleMinimumCount: countDegeneracy(d3AnatomyRows, 'single-minimum'),
    sameClassSymmetryDegeneracyCount: countDegeneracy(d3AnatomyRows, 'same-class-symmetry-degeneracy'),
    crossClassThresholdDegeneracyCount: countDegeneracy(d3AnatomyRows, 'cross-class-threshold-degeneracy'),
    unclassifiedDegeneracyCount: countDegeneracy(d3AnatomyRows, 'unclassified-degeneracy'),
    allEightBodyDrivesSymmetryEquivalent:
      args.bodyDriveSymmetryEquivalenceRows.length === EXPECTED_D3_DRIVE_COUNT &&
      args.bodyDriveSymmetryEquivalenceRows.every((row) => row.matchesCanonicalSequence),
    regimeSequenceMismatchCount,
    bodyNearAppearsAtStrongS: args.potentialDesignWarningRow.bodyNearAppearsAtStrongS,
    thresholdRefinementNeeded: args.potentialDesignWarningRow.thresholdRefinementNeeded,
    potentialDesignWarning: args.potentialDesignWarningRow.potentialDesignWarning,
    rowExceptionCount,
    requiresD3ReadoutRefinement:
      strictDivergentCount > 0 ||
      args.potentialDesignWarningRow.thresholdRefinementNeeded ||
      unclassifiedBodyDivergenceCount > 0,
    forbiddenBoundaryPassed:
      args.invalidInterpretationBoundaryRows.every((row) => row.enforced) &&
      !forbiddenPositiveClaimAppears(d3AnatomyRows, args.invalidInterpretationBoundaryRows),
  };
}

function collectIntegrityIssues(args: {
  parentT16Report: ReturnType<typeof buildPSimplexNonAxisThresholdSweepReadoutLedgerT16Report>;
  parentT17Report: ReturnType<typeof buildPSimplexA3ProvisionalReadoutLedgerT17Report>;
  sourceD3Rows: readonly PSimplexT16SweepRow[];
  d3AnatomyRows: readonly PSimplexT18D3AnatomyRow[];
  divergentRowTable: readonly PSimplexT18DivergentRowTableRow[];
  bodyDriveSymmetryEquivalenceRows: readonly PSimplexT18BodyDriveSymmetryEquivalenceRow[];
  potentialDesignWarningRow: PSimplexT18PotentialDesignWarningRow;
  invalidInterpretationBoundaryRows: readonly PSimplexT18InvalidInterpretationBoundaryRow[];
  summary: PSimplexT18Summary;
}): string[] {
  const issues: string[] = [];
  const parentT16Ok =
    args.parentT16Report.verdict === 'PASS' &&
    args.parentT16Report.ok &&
    args.parentT16Report.integrityIssueCount === 0;
  const parentT17Ok =
    args.parentT17Report.verdict === 'PASS' &&
    args.parentT17Report.ok &&
    args.parentT17Report.integrityIssueCount === 0;

  if (!parentT16Ok) {
    issues.push('Parent T16 ledger is not PASS/ok with zero integrity issues.');
  }

  if (!parentT17Ok) {
    issues.push('Parent T17 ledger is not PASS/ok with zero integrity issues.');
  }

  if (args.sourceD3Rows.some((row) => row.driveFamily !== 'D3')) {
    issues.push('T18 consumed a non-D3 parent row.');
  }

  if (!args.summary.allD3RowsClassified) {
    issues.push('At least one D3 row is not classified or a strict divergent row lacks anatomy.');
  }

  if (args.summary.strictDivergentCount !== args.divergentRowTable.length) {
    issues.push('Strict divergent D3 rows are not fully present in the divergent row table.');
  }

  if (args.summary.strictDivergentCount > 0 && args.summary.divergentRowsClassifiedCount !== args.summary.strictDivergentCount) {
    issues.push('At least one strict divergent D3 row is hidden or unclassified.');
  }

  if (args.d3AnatomyRows.some((row) => row.closureState === 'potential-design-warning')) {
    issues.push('A row-level potential-design-warning was used instead of a family-level warning.');
  }

  if (args.d3AnatomyRows.some((row) => row.closureState === ('closed' as PSimplexT18ClosureState))) {
    issues.push('A D3 row was promoted to a closed response state.');
  }

  if (args.bodyDriveSymmetryEquivalenceRows.length === 0) {
    issues.push('Body-drive symmetry equivalence was not checked.');
  }

  if (!args.summary.forbiddenBoundaryPassed || !args.invalidInterpretationBoundaryRows.every((row) => row.enforced)) {
    issues.push('Forbidden interpretation language entered the T18 ledger.');
  }

  if (args.d3AnatomyRows.some((row) => row.exceptionFlag)) {
    issues.push('At least one T18 D3 anatomy row has an exception flag.');
  }

  if (!args.potentialDesignWarningRow.ok && args.potentialDesignWarningRow.potentialDesignWarning) {
    issues.push('Family-level potential-design warning remains unresolved from T16 fields.');
  }

  return [...new Set(issues)];
}

function classifyVerdict(
  integrityIssues: readonly string[],
  summary: PSimplexT18Summary,
): PSimplexT18Verdict {
  if (
    integrityIssues.some(
      (issue) =>
        issue !== 'Body-drive symmetry equivalence was not checked.' &&
        issue !== 'At least one T18 D3 anatomy row has an exception flag.' &&
        issue !== 'Family-level potential-design warning remains unresolved from T16 fields.',
    )
  ) {
    return 'FAIL';
  }

  if (
    integrityIssues.length > 0 ||
    !summary.allEightBodyDrivesSymmetryEquivalent ||
    summary.regimeSequenceMismatchCount > 0 ||
    summary.unclassifiedBodyDivergenceCount > 0 ||
    summary.potentialDesignWarning
  ) {
    return 'PARTIAL';
  }

  return 'PASS';
}

function recommendationForVerdict(
  verdict: PSimplexT18Verdict,
  summary: PSimplexT18Summary,
): PSimplexT18FinalRecommendation {
  if (verdict === 'FAIL') {
    return 'return-to-T16-T17-interpretation';
  }

  if (summary.potentialDesignWarning) {
    return 'revisit-potential-design';
  }

  if (verdict === 'PARTIAL' || summary.unclassifiedBodyDivergenceCount > 0) {
    return 'refine-D3-divergence-classifier';
  }

  if (summary.strictDivergentCount > 0 && summary.thresholdRefinementNeeded) {
    return 'quarantine-D3-and-proceed-axis-plus-A3';
  }

  return 'advance-to-D3-readout-refinement-note';
}

function inferGridDelta(thresholds: readonly number[], strengthValues: readonly number[]): number {
  const candidateDeltas = thresholds.flatMap((threshold) =>
    strengthValues
      .map((value) => Math.abs(value - threshold))
      .filter((delta) => delta > PSIMPLEX_EPSILON * 100 && delta <= 0.1),
  );

  return candidateDeltas.length > 0 ? cleanNumber(Math.min(...candidateDeltas)) : 0;
}

function lowSFlagForRow(s: number, thresholds: readonly number[], delta: number): boolean {
  return thresholds.length > 0 && s < Math.min(...thresholds) - delta - SCALAR_TOLERANCE;
}

function nearThresholdFlagForRow(s: number, thresholds: readonly number[], delta: number): boolean {
  return thresholds.some((threshold) => Math.abs(s - threshold) <= delta + SCALAR_TOLERANCE);
}

function strongSFlagForRow(s: number, thresholds: readonly number[]): boolean {
  return thresholds.length > 0 && s > Math.max(...thresholds) + SCALAR_TOLERANCE;
}

function firstDriveId(rows: readonly PSimplexT18D3AnatomyRow[]): string | null {
  return uniqueDriveIds(rows)[0] ?? null;
}

function uniqueDriveIds(rows: readonly Pick<PSimplexT18D3AnatomyRow, 'driveId'>[]): string[] {
  return [...new Set(rows.map((row) => row.driveId))];
}

function rowsForDrive(
  rows: readonly PSimplexT18D3AnatomyRow[],
  driveId: string,
): PSimplexT18D3AnatomyRow[] {
  return rows.filter((row) => row.driveId === driveId);
}

function segmentKey(row: PSimplexT18D3AnatomyRow): string {
  return [
    row.d3Regime,
    row.divergenceClass,
    row.closureState,
    row.degeneracyState,
    row.strictFiniteLedgerRelationClass,
    row.contextualFiniteLedgerRelationClass,
    row.dominantNearestClass,
  ].join('|');
}

function numericRange(values: readonly number[]): [number, number] {
  return [cleanNumber(Math.min(...values)), cleanNumber(Math.max(...values))];
}

function uniqueNonNull(values: ReadonlyArray<string | null>): string[] {
  return [...new Set(values.filter((value): value is string => value !== null))];
}

function uniqueNumbers(values: readonly number[]): number[] {
  return [...new Set(values.map((value) => cleanNumber(value)))].sort((left, right) => left - right);
}

function uniqueValues<T extends string>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function countRegime(rows: readonly PSimplexT18D3AnatomyRow[], d3Regime: PSimplexT18D3Regime): number {
  return rows.filter((row) => row.d3Regime === d3Regime).length;
}

function countDivergenceClass(
  rows: readonly PSimplexT18D3AnatomyRow[],
  divergenceClass: PSimplexT18DivergenceClass,
): number {
  return rows.filter((row) => row.divergenceClass === divergenceClass).length;
}

function countDegeneracy(
  rows: readonly PSimplexT18D3AnatomyRow[],
  degeneracyState: PSimplexT16DegeneracyKind,
): number {
  return rows.filter((row) => row.degeneracyState === degeneracyState).length;
}

function countContextualRelation(
  rows: readonly PSimplexT18D3AnatomyRow[],
  finiteLedgerRelationClass: PSimplexT18FiniteLedgerRelationClass,
): number {
  return rows.filter((row) => row.contextualFiniteLedgerRelationClass === finiteLedgerRelationClass).length;
}

function near(left: number, right: number): boolean {
  return Math.abs(left - right) <= SCALAR_TOLERANCE;
}

function forbiddenPositiveClaimAppears(
  rows: readonly PSimplexT18D3AnatomyRow[],
  boundaryRows: readonly PSimplexT18InvalidInterpretationBoundaryRow[],
): boolean {
  const values = [
    ...rows.flatMap((row) => [
      row.rowId,
      row.d3Regime,
      row.divergenceClass,
      row.finiteLedgerOverpredictionClass,
      row.closureState,
      row.degeneracyState,
      row.strictFiniteLedgerRelationClass,
      row.contextualFiniteLedgerRelationClass,
      ...row.notes,
      ...row.exceptionReasons,
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
    'body response is closed',
    'body response is a cue',
    'body diagonal means semantic truth',
    'body diagonal is semantic truth',
    'body diagonal is defect',
    'body diagonal is vortex',
    'body diagonal is route',
    'body diagonal is walk',
    'body diagonal is holonomy',
    'spatial dynamics are active',
    'dense sampling is authorized',
  ].some((claim) => normalized.includes(claim));
}

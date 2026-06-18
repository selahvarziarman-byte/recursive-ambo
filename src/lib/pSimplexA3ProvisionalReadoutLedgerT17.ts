import {
  buildPSimplexNonAxisThresholdSweepReadoutLedgerT16Report,
  type PSimplexT16DegeneracyKind,
  type PSimplexT16DominantNearestClass,
  type PSimplexT16FiniteLedgerRelation,
  type PSimplexT16ParentDivergenceReconciliationRow,
  type PSimplexT16ResponsePathClass,
  type PSimplexT16SweepRow,
  type PSimplexT16Verdict,
} from './pSimplexNonAxisThresholdSweepReadoutLedgerT16';
import {
  cleanNumber,
  type PSimplexVec3,
} from './pSimplexVectorMath';

export type PSimplexT17A3ProvisionalRegime =
  | 'axis-locked-regime'
  | 'axis-dominant-tilted-regime'
  | 'continuous-tilt-regime'
  | 'A3-near-regime'
  | 'unclassified-A3-readout';
export type PSimplexT17ClosureState = 'provisional-readout' | 'not-closed';
export type PSimplexT17FiniteLedgerRelationClass = 'consistent' | 'coarse-compatible' | 'divergent';
export type PSimplexT17Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT17FinalRecommendation =
  | 'advance-to-D3-divergence-anatomy'
  | 'advance-to-provisional-A3-readout-note'
  | 'refine-A3-readout-taxonomy'
  | 'return-to-T16-interpretation';

export interface PSimplexT17A3ProvisionalReadoutRow {
  rowId: string;
  sourceT16RowId: string;
  driveId: string;
  driveFamily: 'D2';
  s: number;
  J: PSimplexVec3;
  JHat: PSimplexVec3;
  a3ProvisionalRegime: PSimplexT17A3ProvisionalRegime;
  closureState: PSimplexT17ClosureState;
  degeneracyState: PSimplexT16DegeneracyKind;
  finiteLedgerRelationClass: PSimplexT17FiniteLedgerRelationClass;
  contextualFiniteLedgerRelationClass: PSimplexT17FiniteLedgerRelationClass;
  nearestAxisDirectionId: string | null;
  nearestA3DirectionId: string | null;
  nearestBodyDirectionId: string | null;
  A_axis: number;
  A_A3: number;
  A_body: number;
  alignmentMarginTopVsSecond: number;
  alignmentMarginAxisVsA3: number;
  alignmentMarginA3VsBody: number;
  nearDegeneracyCount: number;
  energyGapToSecondBestMinimum: number | null;
  thresholdSensitive: boolean;
  bestMinimumConverged: boolean;
  boundaryHit: boolean;
  dominantNearestClass: PSimplexT16DominantNearestClass;
  regimeSequenceKey: string;
  symmetrySignatureKey: string;
  exceptionFlag: boolean;
  exceptionReasons: string[];
  notes: string[];
  ok: boolean;
}

export interface PSimplexT17RegimeDistributionRow {
  a3ProvisionalRegime: PSimplexT17A3ProvisionalRegime;
  count: number;
}

export interface PSimplexT17ClosureStateDistributionRow {
  closureState: PSimplexT17ClosureState;
  count: number;
}

export interface PSimplexT17DegeneracyStateDistributionRow {
  degeneracyState: PSimplexT16DegeneracyKind;
  count: number;
}

export interface PSimplexT17FiniteLedgerRelationDistributionRow {
  finiteLedgerRelationClass: PSimplexT17FiniteLedgerRelationClass;
  count: number;
}

export interface PSimplexT17A3RootRegimeSequenceRow {
  driveId: string;
  segmentIndex: number;
  sStart: number;
  sEnd: number;
  sValues: number[];
  a3ProvisionalRegime: PSimplexT17A3ProvisionalRegime;
  dominantNearestClass: PSimplexT16DominantNearestClass;
  nearestAxisDirectionIds: string[];
  nearestA3DirectionIds: string[];
  alignmentMarginRangeTopVsSecond: [number, number];
  alignmentMarginRangeAxisVsA3: [number, number];
  degeneracyState: PSimplexT16DegeneracyKind;
  finiteLedgerRelationClass: PSimplexT17FiniteLedgerRelationClass;
  rowCount: number;
  ok: boolean;
}

export interface PSimplexT17A3RootSymmetryEquivalenceRow {
  driveId: string;
  matchesCanonicalSequence: boolean;
  firstMismatchIndex: number | null;
  mismatchReason: string | null;
  ok: boolean;
}

export interface PSimplexT17RowExceptionRow {
  rowId: string;
  sourceT16RowId: string;
  driveId: string;
  s: number;
  a3ProvisionalRegime: PSimplexT17A3ProvisionalRegime;
  closureState: PSimplexT17ClosureState;
  degeneracyState: PSimplexT16DegeneracyKind;
  finiteLedgerRelationClass: PSimplexT17FiniteLedgerRelationClass;
  exceptionReasons: string[];
  ok: boolean;
}

export interface PSimplexT17InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT17Summary {
  sourceD2RowCount: number;
  expectedD2RowCount: 180;
  allD2RowsClassified: boolean;
  axisLockedRegimeCount: number;
  axisDominantTiltedRegimeCount: number;
  continuousTiltRegimeCount: number;
  a3NearRegimeCount: number;
  unclassifiedA3ReadoutCount: number;
  provisionalReadoutCount: number;
  notClosedCount: number;
  singleMinimumCount: number;
  sameClassSymmetryDegeneracyCount: number;
  crossClassThresholdDegeneracyCount: number;
  unclassifiedDegeneracyCount: number;
  strictConsistentCount: number;
  strictCoarseCompatibleCount: number;
  strictDivergentCount: number;
  contextualConsistentCount: number;
  contextualCoarseCompatibleCount: number;
  contextualDivergentCount: number;
  parentT16D2StrictDivergenceCount: number;
  parentT16D2ContextualDivergenceCount: number;
  parentT15D2DivergenceResolvedByT16: boolean;
  allTwelveA3RootsSymmetryEquivalent: boolean;
  regimeSequenceMismatchCount: number;
  rowExceptionCount: number;
  requiresA3ReadoutReopening: boolean;
  forbiddenBoundaryPassed: boolean;
}

export interface PSimplexA3ProvisionalReadoutLedgerT17Report {
  method: 'p-simplex-a3-provisional-readout-ledger-t17';
  candidatePackage: 'p-simplex-a3-provisional-readout-ledger-t17';
  parentT16Ledger: 'p-simplex-non-axis-threshold-sweep-readout-ledger-t16';
  diagnosticScope: 'a3-provisional-readout-classifier-over-t16-d2-only';
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
  sourceD2RowCount: number;
  a3ProvisionalReadoutRows: PSimplexT17A3ProvisionalReadoutRow[];
  regimeDistributionRows: PSimplexT17RegimeDistributionRow[];
  closureStateDistributionRows: PSimplexT17ClosureStateDistributionRow[];
  degeneracyStateDistributionRows: PSimplexT17DegeneracyStateDistributionRow[];
  strictFiniteLedgerRelationRows: PSimplexT17FiniteLedgerRelationDistributionRow[];
  contextualFiniteLedgerRelationRows: PSimplexT17FiniteLedgerRelationDistributionRow[];
  a3RootRegimeSequenceRows: PSimplexT17A3RootRegimeSequenceRow[];
  canonicalA3RegimeSequenceRows: PSimplexT17A3RootRegimeSequenceRow[];
  a3RootSymmetryEquivalenceRows: PSimplexT17A3RootSymmetryEquivalenceRow[];
  parentD2DivergenceReconciliationRows: PSimplexT16ParentDivergenceReconciliationRow[];
  rowExceptionRows: PSimplexT17RowExceptionRow[];
  invalidInterpretationBoundaryRows: PSimplexT17InvalidInterpretationBoundaryRow[];
  summary: PSimplexT17Summary;
  verdict: PSimplexT17Verdict;
  finalRecommendation: PSimplexT17FinalRecommendation;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

const EXPECTED_D2_ROW_COUNT = 180;
const SCALAR_TOLERANCE = 1e-6;
const A3_PROVISIONAL_REGIMES: readonly PSimplexT17A3ProvisionalRegime[] = [
  'axis-locked-regime',
  'axis-dominant-tilted-regime',
  'continuous-tilt-regime',
  'A3-near-regime',
  'unclassified-A3-readout',
];
const CLOSURE_STATES: readonly PSimplexT17ClosureState[] = ['provisional-readout', 'not-closed'];
const DEGENERACY_STATES: readonly PSimplexT16DegeneracyKind[] = [
  'single-minimum',
  'same-class-symmetry-degeneracy',
  'cross-class-threshold-degeneracy',
  'unclassified-degeneracy',
];
const FINITE_LEDGER_RELATION_CLASSES: readonly PSimplexT17FiniteLedgerRelationClass[] = [
  'consistent',
  'coarse-compatible',
  'divergent',
];

export function buildPSimplexA3ProvisionalReadoutLedgerT17Report(): PSimplexA3ProvisionalReadoutLedgerT17Report {
  const parentT16Report = buildPSimplexNonAxisThresholdSweepReadoutLedgerT16Report();
  const sourceD2Rows = parentT16Report.sweepRows.filter((row) => row.driveFamily === 'D2');
  const a3ProvisionalReadoutRows = sourceD2Rows.map(classifyT16D2Row);
  const regimeDistributionRows = buildRegimeDistributionRows(a3ProvisionalReadoutRows);
  const closureStateDistributionRows = buildClosureStateDistributionRows(a3ProvisionalReadoutRows);
  const degeneracyStateDistributionRows = buildDegeneracyStateDistributionRows(a3ProvisionalReadoutRows);
  const strictFiniteLedgerRelationRows = buildFiniteLedgerRelationRows(a3ProvisionalReadoutRows, 'strict');
  const contextualFiniteLedgerRelationRows = buildFiniteLedgerRelationRows(a3ProvisionalReadoutRows, 'contextual');
  const a3RootRegimeSequenceRows = buildA3RootRegimeSequenceRows(a3ProvisionalReadoutRows);
  const canonicalDriveId = firstDriveId(a3ProvisionalReadoutRows);
  const canonicalA3RegimeSequenceRows = a3RootRegimeSequenceRows.filter((row) => row.driveId === canonicalDriveId);
  const a3RootSymmetryEquivalenceRows = buildA3RootSymmetryEquivalenceRows(a3ProvisionalReadoutRows, canonicalDriveId);
  const parentD2DivergenceReconciliationRows = parentT16Report.parentDivergenceReconciliationRows.filter(
    (row) => row.referenceFamily === 'D2',
  );
  const rowExceptionRows = buildRowExceptionRows(a3ProvisionalReadoutRows);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const summary = buildSummary({
    parentT16Report,
    a3ProvisionalReadoutRows,
    a3RootSymmetryEquivalenceRows,
    parentD2DivergenceReconciliationRows,
    invalidInterpretationBoundaryRows,
  });
  const integrityIssues = collectIntegrityIssues({
    parentT16Report,
    sourceD2Rows,
    a3ProvisionalReadoutRows,
    a3RootSymmetryEquivalenceRows,
    parentD2DivergenceReconciliationRows,
    summary,
    invalidInterpretationBoundaryRows,
  });
  const verdict = classifyVerdict(integrityIssues, summary);

  return {
    method: 'p-simplex-a3-provisional-readout-ledger-t17',
    candidatePackage: 'p-simplex-a3-provisional-readout-ledger-t17',
    parentT16Ledger: 'p-simplex-non-axis-threshold-sweep-readout-ledger-t16',
    diagnosticScope: 'a3-provisional-readout-classifier-over-t16-d2-only',
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
    sourceD2RowCount: sourceD2Rows.length,
    a3ProvisionalReadoutRows,
    regimeDistributionRows,
    closureStateDistributionRows,
    degeneracyStateDistributionRows,
    strictFiniteLedgerRelationRows,
    contextualFiniteLedgerRelationRows,
    a3RootRegimeSequenceRows,
    canonicalA3RegimeSequenceRows,
    a3RootSymmetryEquivalenceRows,
    parentD2DivergenceReconciliationRows,
    rowExceptionRows,
    invalidInterpretationBoundaryRows,
    summary,
    verdict,
    finalRecommendation: recommendationForVerdict(verdict),
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: verdict !== 'FAIL' && integrityIssues.length === 0,
  };
}

function classifyT16D2Row(row: PSimplexT16SweepRow): PSimplexT17A3ProvisionalReadoutRow {
  const a3ProvisionalRegime = a3RegimeFromT16Path(row.responsePathClass);
  const finiteLedgerRelationClass = relationClassFromT16(row.finiteLedgerRelationStrict);
  const contextualFiniteLedgerRelationClass = relationClassFromT16(row.finiteLedgerRelationContextual);
  const closureState = closureStateForRow(row, a3ProvisionalRegime);
  const exceptionReasons = exceptionReasonsForRow(row, a3ProvisionalRegime, closureState, finiteLedgerRelationClass);
  const notes = notesForRow(row);
  const regimeSequenceKey = buildRegimeSequenceKey({
    s: row.s,
    a3ProvisionalRegime,
    dominantNearestClass: row.dominantNearestClass,
    degeneracyState: row.degeneracyKind,
    finiteLedgerRelationClass,
    thresholdSensitive: row.thresholdSensitive,
  });
  const symmetrySignatureKey = buildSymmetrySignatureKey(row, regimeSequenceKey);

  return {
    rowId: `T17-${row.rowId}`,
    sourceT16RowId: row.rowId,
    driveId: row.driveId,
    driveFamily: 'D2',
    s: row.s,
    J: [...row.J],
    JHat: [...row.JHat],
    a3ProvisionalRegime,
    closureState,
    degeneracyState: row.degeneracyKind,
    finiteLedgerRelationClass,
    contextualFiniteLedgerRelationClass,
    nearestAxisDirectionId: row.nearestAxisDirectionId,
    nearestA3DirectionId: row.nearestA3DirectionId,
    nearestBodyDirectionId: row.nearestBodyDirectionId,
    A_axis: row.A_axis,
    A_A3: row.A_A3,
    A_body: row.A_body,
    alignmentMarginTopVsSecond: row.alignmentMarginTopVsSecond,
    alignmentMarginAxisVsA3: row.alignmentMarginAxisVsA3,
    alignmentMarginA3VsBody: row.alignmentMarginA3VsBody,
    nearDegeneracyCount: row.nearDegeneracyCount,
    energyGapToSecondBestMinimum: row.energyGapToSecondBestMinimum,
    thresholdSensitive: row.thresholdSensitive,
    bestMinimumConverged: row.bestMinimumConverged,
    boundaryHit: row.boundaryHit,
    dominantNearestClass: row.dominantNearestClass,
    regimeSequenceKey,
    symmetrySignatureKey,
    exceptionFlag: exceptionReasons.length > 0,
    exceptionReasons,
    notes,
    ok: exceptionReasons.length === 0,
  };
}

function a3RegimeFromT16Path(responsePathClass: PSimplexT16ResponsePathClass): PSimplexT17A3ProvisionalRegime {
  if (
    responsePathClass === 'axis-locked-regime' ||
    responsePathClass === 'axis-dominant-tilted-regime' ||
    responsePathClass === 'continuous-tilt-regime' ||
    responsePathClass === 'A3-near-regime'
  ) {
    return responsePathClass;
  }

  return 'unclassified-A3-readout';
}

function closureStateForRow(
  row: PSimplexT16SweepRow,
  a3ProvisionalRegime: PSimplexT17A3ProvisionalRegime,
): PSimplexT17ClosureState {
  return row.bestMinimumConverged &&
    !row.boundaryHit &&
    row.finiteLedgerRelationStrict !== 'finite-ledger-divergent' &&
    a3ProvisionalRegime !== 'unclassified-A3-readout'
    ? 'provisional-readout'
    : 'not-closed';
}

function relationClassFromT16(relation: PSimplexT16FiniteLedgerRelation): PSimplexT17FiniteLedgerRelationClass {
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
  a3ProvisionalRegime: PSimplexT17A3ProvisionalRegime,
  closureState: PSimplexT17ClosureState,
  finiteLedgerRelationClass: PSimplexT17FiniteLedgerRelationClass,
): string[] {
  const reasons: string[] = [];

  if (!row.bestMinimumConverged) {
    reasons.push('non-converged-best-minimum');
  }

  if (row.boundaryHit) {
    reasons.push('boundary-hit');
  }

  if (finiteLedgerRelationClass === 'divergent') {
    reasons.push('strict-finite-ledger-divergence');
  }

  if (a3ProvisionalRegime === 'unclassified-A3-readout') {
    reasons.push(`unclassified-source-response-path-${row.responsePathClass}`);
  }

  if (closureState !== 'provisional-readout') {
    reasons.push('row-not-usable-as-provisional-readout');
  }

  if (!row.ok) {
    reasons.push('source-t16-row-not-ok');
  }

  return [...new Set(reasons)];
}

function notesForRow(row: PSimplexT16SweepRow): string[] {
  const notes: string[] = ['A3-provisional-readout-is-not-closed'];

  if (row.degeneracyKind === 'same-class-symmetry-degeneracy') {
    notes.push('same-class-symmetry-degeneracy-preserved');
  }

  if (row.degeneracyKind === 'cross-class-threshold-degeneracy') {
    notes.push('cross-class-threshold-degeneracy-non-promotional');
  }

  return [...notes, ...row.notes];
}

function buildRegimeDistributionRows(rows: readonly PSimplexT17A3ProvisionalReadoutRow[]): PSimplexT17RegimeDistributionRow[] {
  return A3_PROVISIONAL_REGIMES.map((a3ProvisionalRegime) => ({
    a3ProvisionalRegime,
    count: rows.filter((row) => row.a3ProvisionalRegime === a3ProvisionalRegime).length,
  }));
}

function buildClosureStateDistributionRows(
  rows: readonly PSimplexT17A3ProvisionalReadoutRow[],
): PSimplexT17ClosureStateDistributionRow[] {
  return CLOSURE_STATES.map((closureState) => ({
    closureState,
    count: rows.filter((row) => row.closureState === closureState).length,
  }));
}

function buildDegeneracyStateDistributionRows(
  rows: readonly PSimplexT17A3ProvisionalReadoutRow[],
): PSimplexT17DegeneracyStateDistributionRow[] {
  return DEGENERACY_STATES.map((degeneracyState) => ({
    degeneracyState,
    count: rows.filter((row) => row.degeneracyState === degeneracyState).length,
  }));
}

function buildFiniteLedgerRelationRows(
  rows: readonly PSimplexT17A3ProvisionalReadoutRow[],
  layer: 'strict' | 'contextual',
): PSimplexT17FiniteLedgerRelationDistributionRow[] {
  return FINITE_LEDGER_RELATION_CLASSES.map((finiteLedgerRelationClass) => ({
    finiteLedgerRelationClass,
    count: rows.filter((row) =>
      layer === 'strict'
        ? row.finiteLedgerRelationClass === finiteLedgerRelationClass
        : row.contextualFiniteLedgerRelationClass === finiteLedgerRelationClass,
    ).length,
  }));
}

function buildA3RootRegimeSequenceRows(
  rows: readonly PSimplexT17A3ProvisionalReadoutRow[],
): PSimplexT17A3RootRegimeSequenceRow[] {
  return uniqueDriveIds(rows).flatMap((driveId) => buildSequenceRowsForDrive(driveId, rowsForDrive(rows, driveId)));
}

function buildSequenceRowsForDrive(
  driveId: string,
  rows: readonly PSimplexT17A3ProvisionalReadoutRow[],
): PSimplexT17A3RootRegimeSequenceRow[] {
  const sortedRows = [...rows].sort((left, right) => left.s - right.s);
  const segments: PSimplexT17A3RootRegimeSequenceRow[] = [];
  let currentSegmentRows: PSimplexT17A3ProvisionalReadoutRow[] = [];

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
  rows: readonly PSimplexT17A3ProvisionalReadoutRow[],
): PSimplexT17A3RootRegimeSequenceRow {
  const firstRow = rows[0];
  const sValues = rows.map((row) => row.s);

  return {
    driveId,
    segmentIndex,
    sStart: cleanNumber(Math.min(...sValues)),
    sEnd: cleanNumber(Math.max(...sValues)),
    sValues,
    a3ProvisionalRegime: firstRow.a3ProvisionalRegime,
    dominantNearestClass: firstRow.dominantNearestClass,
    nearestAxisDirectionIds: uniqueNonNull(rows.map((row) => row.nearestAxisDirectionId)),
    nearestA3DirectionIds: uniqueNonNull(rows.map((row) => row.nearestA3DirectionId)),
    alignmentMarginRangeTopVsSecond: numericRange(rows.map((row) => row.alignmentMarginTopVsSecond)),
    alignmentMarginRangeAxisVsA3: numericRange(rows.map((row) => row.alignmentMarginAxisVsA3)),
    degeneracyState: firstRow.degeneracyState,
    finiteLedgerRelationClass: firstRow.finiteLedgerRelationClass,
    rowCount: rows.length,
    ok: rows.every((row) => row.ok || row.closureState === 'not-closed'),
  };
}

function buildA3RootSymmetryEquivalenceRows(
  rows: readonly PSimplexT17A3ProvisionalReadoutRow[],
  canonicalDriveId: string | null,
): PSimplexT17A3RootSymmetryEquivalenceRow[] {
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
  canonicalRows: readonly PSimplexT17A3ProvisionalReadoutRow[],
  comparisonRows: readonly PSimplexT17A3ProvisionalReadoutRow[],
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
      canonical.a3ProvisionalRegime !== comparison.a3ProvisionalRegime ||
      canonical.dominantNearestClass !== comparison.dominantNearestClass ||
      canonical.degeneracyState !== comparison.degeneracyState ||
      canonical.finiteLedgerRelationClass !== comparison.finiteLedgerRelationClass ||
      canonical.thresholdSensitive !== comparison.thresholdSensitive
    ) {
      return { index, reason: 'class-level-sequence-mismatch' };
    }

    if (
      !near(canonical.alignmentMarginTopVsSecond, comparison.alignmentMarginTopVsSecond) ||
      !near(canonical.alignmentMarginAxisVsA3, comparison.alignmentMarginAxisVsA3) ||
      !near(canonical.alignmentMarginA3VsBody, comparison.alignmentMarginA3VsBody)
    ) {
      return { index, reason: 'alignment-margin-mismatch' };
    }
  }

  return null;
}

function buildRowExceptionRows(rows: readonly PSimplexT17A3ProvisionalReadoutRow[]): PSimplexT17RowExceptionRow[] {
  return rows
    .filter((row) => row.exceptionFlag)
    .map((row) => ({
      rowId: row.rowId,
      sourceT16RowId: row.sourceT16RowId,
      driveId: row.driveId,
      s: row.s,
      a3ProvisionalRegime: row.a3ProvisionalRegime,
      closureState: row.closureState,
      degeneracyState: row.degeneracyState,
      finiteLedgerRelationClass: row.finiteLedgerRelationClass,
      exceptionReasons: [...row.exceptionReasons],
      ok: row.ok,
    }));
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT17InvalidInterpretationBoundaryRow[] {
  return [
    { boundaryId: 'a3-not-closed', statement: 'A3 response is not closed', enforced: true },
    { boundaryId: 'a3-not-field-cue', statement: 'A3 response is not a FieldCue', enforced: true },
    { boundaryId: 'a3-not-route-walk-holonomy', statement: 'A3 behavior is not route, walk, or holonomy', enforced: true },
    { boundaryId: 'a3-not-defect-vortex', statement: 'A3 behavior is not defect or vortex behavior', enforced: true },
    { boundaryId: 'a3-not-semantic-meaning', statement: 'A3 behavior is not semantic meaning', enforced: true },
    { boundaryId: 'not-spatial-dynamics', statement: 'spatial dynamics are not active', enforced: true },
    { boundaryId: 'not-dense-sampling', statement: 'dense sampling is not authorized', enforced: true },
  ];
}

function buildSummary(args: {
  parentT16Report: ReturnType<typeof buildPSimplexNonAxisThresholdSweepReadoutLedgerT16Report>;
  a3ProvisionalReadoutRows: readonly PSimplexT17A3ProvisionalReadoutRow[];
  a3RootSymmetryEquivalenceRows: readonly PSimplexT17A3RootSymmetryEquivalenceRow[];
  parentD2DivergenceReconciliationRows: readonly PSimplexT16ParentDivergenceReconciliationRow[];
  invalidInterpretationBoundaryRows: readonly PSimplexT17InvalidInterpretationBoundaryRow[];
}): PSimplexT17Summary {
  const parentD2Reconciliation = args.parentD2DivergenceReconciliationRows[0];
  const regimeSequenceMismatchCount = args.a3RootSymmetryEquivalenceRows.filter((row) => !row.matchesCanonicalSequence).length;
  const strictDivergentCount = countStrictRelation(args.a3ProvisionalReadoutRows, 'divergent');
  const contextualDivergentCount = countContextualRelation(args.a3ProvisionalReadoutRows, 'divergent');
  const unclassifiedA3ReadoutCount = countRegime(args.a3ProvisionalReadoutRows, 'unclassified-A3-readout');
  const rowExceptionCount = args.a3ProvisionalReadoutRows.filter((row) => row.exceptionFlag).length;

  return {
    sourceD2RowCount: args.a3ProvisionalReadoutRows.length,
    expectedD2RowCount: EXPECTED_D2_ROW_COUNT,
    allD2RowsClassified: args.a3ProvisionalReadoutRows.every((row) => A3_PROVISIONAL_REGIMES.includes(row.a3ProvisionalRegime)),
    axisLockedRegimeCount: countRegime(args.a3ProvisionalReadoutRows, 'axis-locked-regime'),
    axisDominantTiltedRegimeCount: countRegime(args.a3ProvisionalReadoutRows, 'axis-dominant-tilted-regime'),
    continuousTiltRegimeCount: countRegime(args.a3ProvisionalReadoutRows, 'continuous-tilt-regime'),
    a3NearRegimeCount: countRegime(args.a3ProvisionalReadoutRows, 'A3-near-regime'),
    unclassifiedA3ReadoutCount,
    provisionalReadoutCount: countClosure(args.a3ProvisionalReadoutRows, 'provisional-readout'),
    notClosedCount: countClosure(args.a3ProvisionalReadoutRows, 'not-closed'),
    singleMinimumCount: countDegeneracy(args.a3ProvisionalReadoutRows, 'single-minimum'),
    sameClassSymmetryDegeneracyCount: countDegeneracy(args.a3ProvisionalReadoutRows, 'same-class-symmetry-degeneracy'),
    crossClassThresholdDegeneracyCount: countDegeneracy(args.a3ProvisionalReadoutRows, 'cross-class-threshold-degeneracy'),
    unclassifiedDegeneracyCount: countDegeneracy(args.a3ProvisionalReadoutRows, 'unclassified-degeneracy'),
    strictConsistentCount: countStrictRelation(args.a3ProvisionalReadoutRows, 'consistent'),
    strictCoarseCompatibleCount: countStrictRelation(args.a3ProvisionalReadoutRows, 'coarse-compatible'),
    strictDivergentCount,
    contextualConsistentCount: countContextualRelation(args.a3ProvisionalReadoutRows, 'consistent'),
    contextualCoarseCompatibleCount: countContextualRelation(args.a3ProvisionalReadoutRows, 'coarse-compatible'),
    contextualDivergentCount,
    parentT16D2StrictDivergenceCount: args.parentT16Report.summary.strictD2DivergentCount,
    parentT16D2ContextualDivergenceCount: args.parentT16Report.summary.contextualD2DivergentCount,
    parentT15D2DivergenceResolvedByT16: parentD2Reconciliation?.reconciliationStatus === 'resolved-by-finer-sweep',
    allTwelveA3RootsSymmetryEquivalent:
      args.a3RootSymmetryEquivalenceRows.length === 12 &&
      args.a3RootSymmetryEquivalenceRows.every((row) => row.matchesCanonicalSequence),
    regimeSequenceMismatchCount,
    rowExceptionCount,
    requiresA3ReadoutReopening:
      rowExceptionCount > 0 ||
      strictDivergentCount > 0 ||
      contextualDivergentCount > 0 ||
      regimeSequenceMismatchCount > 0 ||
      unclassifiedA3ReadoutCount > 0,
    forbiddenBoundaryPassed:
      args.invalidInterpretationBoundaryRows.every((row) => row.enforced) &&
      !forbiddenPositiveClaimAppears(args.a3ProvisionalReadoutRows, args.invalidInterpretationBoundaryRows),
  };
}

function collectIntegrityIssues(args: {
  parentT16Report: ReturnType<typeof buildPSimplexNonAxisThresholdSweepReadoutLedgerT16Report>;
  sourceD2Rows: readonly PSimplexT16SweepRow[];
  a3ProvisionalReadoutRows: readonly PSimplexT17A3ProvisionalReadoutRow[];
  a3RootSymmetryEquivalenceRows: readonly PSimplexT17A3RootSymmetryEquivalenceRow[];
  parentD2DivergenceReconciliationRows: readonly PSimplexT16ParentDivergenceReconciliationRow[];
  summary: PSimplexT17Summary;
  invalidInterpretationBoundaryRows: readonly PSimplexT17InvalidInterpretationBoundaryRow[];
}): string[] {
  const issues: string[] = [];
  const parentOk =
    args.parentT16Report.verdict === 'PASS' &&
    args.parentT16Report.ok &&
    args.parentT16Report.integrityIssueCount === 0;

  if (!parentOk) {
    issues.push('Parent T16 ledger is not PASS/ok with zero integrity issues.');
  }

  if (args.sourceD2Rows.length !== EXPECTED_D2_ROW_COUNT || args.summary.sourceD2RowCount !== EXPECTED_D2_ROW_COUNT) {
    issues.push(`Expected ${EXPECTED_D2_ROW_COUNT} D2 rows from T16.`);
  }

  if (args.parentT16Report.summary.d2DriveCount !== 12 || args.parentT16Report.summary.d2StrengthCount !== 15) {
    issues.push('Parent T16 D2 drive/strength count is not the expected 12 x 15 basis.');
  }

  if (!args.summary.allD2RowsClassified) {
    issues.push('At least one D2 row did not receive an A3 provisional readout class.');
  }

  if (args.summary.strictDivergentCount > 0 || args.summary.contextualDivergentCount > 0) {
    issues.push('D2 finite-ledger divergence reappeared in T17.');
  }

  if (args.summary.parentT16D2StrictDivergenceCount > 0 || args.summary.parentT16D2ContextualDivergenceCount > 0) {
    issues.push('Parent T16 reports D2 divergence, so T17 cannot pass.');
  }

  if (args.summary.sameClassSymmetryDegeneracyCount > 0 && args.summary.crossClassThresholdDegeneracyCount > 0) {
    issues.push('D2 contains cross-class threshold degeneracy alongside same-class symmetry degeneracy.');
  }

  if (args.a3ProvisionalReadoutRows.some((row) => row.closureState !== 'provisional-readout')) {
    issues.push('At least one D2 row is not usable as provisional readout evidence.');
  }

  if (!args.summary.parentT15D2DivergenceResolvedByT16) {
    issues.push('Parent T15 D2 divergence was not reconciled as resolved by T16.');
  }

  if (!args.summary.allTwelveA3RootsSymmetryEquivalent) {
    issues.push('The twelve A3 roots are not symmetry-equivalent by class-level sequence.');
  }

  if (args.a3RootSymmetryEquivalenceRows.some((row) => !row.ok)) {
    issues.push('At least one A3 root symmetry equivalence row is not ok.');
  }

  if (args.a3ProvisionalReadoutRows.some((row) => row.a3ProvisionalRegime === 'unclassified-A3-readout')) {
    issues.push('At least one D2 row is unclassified under A3 provisional readout.');
  }

  if (!args.summary.forbiddenBoundaryPassed || !args.invalidInterpretationBoundaryRows.every((row) => row.enforced)) {
    issues.push('Forbidden interpretation language entered the T17 ledger.');
  }

  return [...new Set(issues)];
}

function classifyVerdict(integrityIssues: readonly string[], summary: PSimplexT17Summary): PSimplexT17Verdict {
  if (
    integrityIssues.some(
      (issue) =>
        issue !== 'The twelve A3 roots are not symmetry-equivalent by class-level sequence.' &&
        issue !== 'At least one A3 root symmetry equivalence row is not ok.' &&
        issue !== 'At least one D2 row is unclassified under A3 provisional readout.',
    )
  ) {
    return 'FAIL';
  }

  if (
    !summary.allTwelveA3RootsSymmetryEquivalent ||
    summary.unclassifiedA3ReadoutCount > 0 ||
    summary.regimeSequenceMismatchCount > 0
  ) {
    return 'PARTIAL';
  }

  return integrityIssues.length > 0 ? 'PARTIAL' : 'PASS';
}

function recommendationForVerdict(verdict: PSimplexT17Verdict): PSimplexT17FinalRecommendation {
  if (verdict === 'PASS') {
    return 'advance-to-provisional-A3-readout-note';
  }

  if (verdict === 'PARTIAL') {
    return 'refine-A3-readout-taxonomy';
  }

  return 'return-to-T16-interpretation';
}

function firstDriveId(rows: readonly PSimplexT17A3ProvisionalReadoutRow[]): string | null {
  return uniqueDriveIds(rows)[0] ?? null;
}

function uniqueDriveIds(rows: readonly PSimplexT17A3ProvisionalReadoutRow[]): string[] {
  return [...new Set(rows.map((row) => row.driveId))];
}

function rowsForDrive(
  rows: readonly PSimplexT17A3ProvisionalReadoutRow[],
  driveId: string,
): PSimplexT17A3ProvisionalReadoutRow[] {
  return rows.filter((row) => row.driveId === driveId);
}

function segmentKey(row: PSimplexT17A3ProvisionalReadoutRow): string {
  return [
    row.a3ProvisionalRegime,
    row.dominantNearestClass,
    row.degeneracyState,
    row.finiteLedgerRelationClass,
  ].join('|');
}

function buildRegimeSequenceKey(args: {
  s: number;
  a3ProvisionalRegime: PSimplexT17A3ProvisionalRegime;
  dominantNearestClass: PSimplexT16DominantNearestClass;
  degeneracyState: PSimplexT16DegeneracyKind;
  finiteLedgerRelationClass: PSimplexT17FiniteLedgerRelationClass;
  thresholdSensitive: boolean;
}): string {
  return [
    `s=${cleanNumber(args.s)}`,
    args.a3ProvisionalRegime,
    args.dominantNearestClass,
    args.degeneracyState,
    args.finiteLedgerRelationClass,
    `threshold=${args.thresholdSensitive}`,
  ].join('|');
}

function buildSymmetrySignatureKey(row: PSimplexT16SweepRow, regimeSequenceKey: string): string {
  return [
    regimeSequenceKey,
    `mTop=${cleanNumber(row.alignmentMarginTopVsSecond)}`,
    `mAxisA3=${cleanNumber(row.alignmentMarginAxisVsA3)}`,
    `mA3Body=${cleanNumber(row.alignmentMarginA3VsBody)}`,
  ].join('|');
}

function numericRange(values: readonly number[]): [number, number] {
  return [cleanNumber(Math.min(...values)), cleanNumber(Math.max(...values))];
}

function uniqueNonNull(values: ReadonlyArray<string | null>): string[] {
  return [...new Set(values.filter((value): value is string => value !== null))];
}

function countRegime(
  rows: readonly PSimplexT17A3ProvisionalReadoutRow[],
  a3ProvisionalRegime: PSimplexT17A3ProvisionalRegime,
): number {
  return rows.filter((row) => row.a3ProvisionalRegime === a3ProvisionalRegime).length;
}

function countClosure(
  rows: readonly PSimplexT17A3ProvisionalReadoutRow[],
  closureState: PSimplexT17ClosureState,
): number {
  return rows.filter((row) => row.closureState === closureState).length;
}

function countDegeneracy(
  rows: readonly PSimplexT17A3ProvisionalReadoutRow[],
  degeneracyState: PSimplexT16DegeneracyKind,
): number {
  return rows.filter((row) => row.degeneracyState === degeneracyState).length;
}

function countStrictRelation(
  rows: readonly PSimplexT17A3ProvisionalReadoutRow[],
  finiteLedgerRelationClass: PSimplexT17FiniteLedgerRelationClass,
): number {
  return rows.filter((row) => row.finiteLedgerRelationClass === finiteLedgerRelationClass).length;
}

function countContextualRelation(
  rows: readonly PSimplexT17A3ProvisionalReadoutRow[],
  finiteLedgerRelationClass: PSimplexT17FiniteLedgerRelationClass,
): number {
  return rows.filter((row) => row.contextualFiniteLedgerRelationClass === finiteLedgerRelationClass).length;
}

function near(left: number, right: number): boolean {
  return Math.abs(left - right) <= SCALAR_TOLERANCE;
}

function forbiddenPositiveClaimAppears(
  rows: readonly PSimplexT17A3ProvisionalReadoutRow[],
  boundaryRows: readonly PSimplexT17InvalidInterpretationBoundaryRow[],
): boolean {
  const values = [
    ...rows.flatMap((row) => [
      row.rowId,
      row.a3ProvisionalRegime,
      row.closureState,
      row.degeneracyState,
      row.finiteLedgerRelationClass,
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
    'a3 response is closed',
    'a3 response is a field-cue',
    'a3 response is a fieldcue',
    'a3 behavior is a route',
    'a3 behavior is a walk',
    'a3 behavior is holonomy',
    'a3 behavior is a defect',
    'a3 behavior is a vortex',
    'a3 behavior is semantic meaning',
    'spatial dynamics are active',
    'dense sampling is authorized',
  ].some((claim) => normalized.includes(claim));
}

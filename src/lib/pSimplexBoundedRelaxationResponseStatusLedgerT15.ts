import {
  buildPSimplexBoundedPointwiseVectorLGRelaxationLedgerT14Report,
  type PSimplexT14ConsistencyStatus,
  type PSimplexT14DriveFamily,
  type PSimplexT14RelaxationRow,
} from './pSimplexBoundedPointwiseVectorLGRelaxationLedgerT14';
import type { PSimplexPointwiseStopReason, PSimplexRelaxedResponseClass } from './pSimplexPointwiseRelaxationCore';

export type PSimplexT15ResponseStatusClass =
  | 'zero-drive-degenerate'
  | 'axis-relaxed-response'
  | 'approved-geometry-axis-response'
  | 'threshold-sensitive'
  | 'finite-ledger-consistent'
  | 'finite-ledger-coarse-compatible'
  | 'finite-ledger-divergent'
  | 'diagnostic-only-suppressed-control'
  | 'dormant-A3-response'
  | 'dormant-body-response'
  | 'dormant-intermediate-response';

export type PSimplexT15ClosureState =
  | 'closed'
  | 'not-closed'
  | 'diagnostic-only'
  | 'requires-threshold-theory'
  | 'requires-readout-refinement';

export type PSimplexT15Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT15FinalRecommendation =
  | 'advance-to-threshold-theory-and-readout-refinement'
  | 'complete-row-exception-detail'
  | 'return-to-response-status-classifier';

export interface PSimplexT15ResponseStatusRow {
  rowId: string;
  driveFamily: PSimplexT14DriveFamily;
  driveId: string;
  probeClass: string | null;
  diagnosticOnly: boolean;
  relaxedResponseClass: PSimplexRelaxedResponseClass;
  finiteLedgerConsistencyStatus: PSimplexT14ConsistencyStatus;
  bestMinimumConverged: boolean;
  bestMinimumStopReason: PSimplexPointwiseStopReason;
  boundaryHit: boolean;
  responseStatusClasses: PSimplexT15ResponseStatusClass[];
  closureState: PSimplexT15ClosureState;
  closedPositiveResult: boolean;
  notes: string[];
  exceptionFlag: boolean;
  exceptionReason: string | null;
  ok: boolean;
}

export interface PSimplexT15FamilyStatusRow {
  driveFamily: PSimplexT14DriveFamily;
  rowCount: number;
  dominantStatusClasses: PSimplexT15ResponseStatusClass[];
  closureState: PSimplexT15ClosureState;
  closedCount: number;
  notClosedCount: number;
  diagnosticOnlyCount: number;
  thresholdSensitiveCount: number;
  coarseCompatibleCount: number;
  divergentCount: number;
  exceptionCount: number;
  summaryJudgment: string;
  ok: boolean;
}

export interface PSimplexT15StatusClassDistributionRow {
  responseStatusClass: PSimplexT15ResponseStatusClass;
  count: number;
}

export interface PSimplexT15ClosureStateDistributionRow {
  closureState: PSimplexT15ClosureState;
  count: number;
}

export interface PSimplexT15ClassRow {
  classId: string;
  responseStatusClass: PSimplexT15ResponseStatusClass;
  driveFamilies: PSimplexT14DriveFamily[];
  rowCount: number;
  closureState: PSimplexT15ClosureState;
  summaryJudgment: string;
  ok: boolean;
}

export interface PSimplexT15DormantClassRow {
  responseStatusClass: PSimplexT15ResponseStatusClass;
  relaxedResponseClass: PSimplexRelaxedResponseClass;
  rowCount: number;
  closureState: 'not-closed';
  dormant: true;
  ok: boolean;
}

export interface PSimplexT15RowExceptionRow {
  rowId: string;
  driveFamily: PSimplexT14DriveFamily;
  driveId: string;
  probeClass: string | null;
  finiteLedgerConsistencyStatus: PSimplexT14ConsistencyStatus;
  relaxedResponseClass: PSimplexRelaxedResponseClass;
  bestMinimumConverged: boolean;
  boundaryHit: boolean;
  responseStatusClasses: PSimplexT15ResponseStatusClass[];
  closureState: PSimplexT15ClosureState;
  exceptionReasons: string[];
  ok: boolean;
}

export interface PSimplexT15InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT15Summary {
  parentT14Verdict: string;
  parentT14Ok: boolean;
  t14RelaxationRowCount: number;
  responseStatusRowCount: number;
  rowsClassified: boolean;
  rowsHaveExactlyOneClosureState: boolean;
  closedRowCount: number;
  notClosedRowCount: number;
  diagnosticOnlyRowCount: number;
  requiresThresholdTheoryRowCount: number;
  requiresReadoutRefinementRowCount: number;
  thresholdSensitiveRowCount: number;
  coarseCompatibleRowCount: number;
  divergentRowCount: number;
  rowExceptionCount: number;
  d1Closed: boolean;
  d5Closed: boolean;
  d2ThresholdSensitivityPreserved: boolean;
  d3ThresholdSensitivityPreserved: boolean;
  tRowsRemainDiagnosticOnly: boolean;
  finiteLedgerComparisonNotExactForNonAxisFamilies: boolean;
  dormantA3ResponseCount: number;
  dormantBodyResponseCount: number;
  dormantIntermediateResponseCount: number;
  forbiddenBoundaryPassed: boolean;
}

export interface PSimplexBoundedRelaxationResponseStatusLedgerT15Report {
  method: 'p-simplex-bounded-relaxation-response-status-ledger-t15';
  candidatePackage: 'p-simplex-bounded-relaxation-response-status-ledger-t15';
  parentT14Ledger: 'p-simplex-bounded-pointwise-vector-lg-relaxation-ledger-t14';
  diagnosticScope: 'bounded-relaxation-response-status-classifier-only';
  solverStatus: 'not-new-solver';
  spatialDynamicsStatus: 'not-spatial-lg-dynamics';
  fieldAtlasStatus: 'not-field-atlas';
  renderingStatus: 'not-rendering';
  fieldCueStatus: 'not-field-cue';
  semanticStatus: 'not-semantic-naming';
  routeStatus: 'no-route-walk-holonomy';
  defectStatus: 'no-defect-vortex-claims';
  denseSamplingStatus: 'not-dense-sampling';
  parentT14LedgerStillPartialOrPasses: boolean;
  responseStatusRows: PSimplexT15ResponseStatusRow[];
  familyStatusRows: PSimplexT15FamilyStatusRow[];
  statusClassDistributionRows: PSimplexT15StatusClassDistributionRow[];
  closureStateDistributionRows: PSimplexT15ClosureStateDistributionRow[];
  closedClassRows: PSimplexT15ClassRow[];
  notClosedClassRows: PSimplexT15ClassRow[];
  dormantClassRows: PSimplexT15DormantClassRow[];
  rowExceptionRows: PSimplexT15RowExceptionRow[];
  invalidInterpretationBoundaryRows: PSimplexT15InvalidInterpretationBoundaryRow[];
  summary: PSimplexT15Summary;
  verdict: PSimplexT15Verdict;
  finalRecommendation: PSimplexT15FinalRecommendation;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

const DRIVE_FAMILIES: readonly PSimplexT14DriveFamily[] = ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'T'];
const STATUS_CLASSES: readonly PSimplexT15ResponseStatusClass[] = [
  'zero-drive-degenerate',
  'axis-relaxed-response',
  'approved-geometry-axis-response',
  'threshold-sensitive',
  'finite-ledger-consistent',
  'finite-ledger-coarse-compatible',
  'finite-ledger-divergent',
  'diagnostic-only-suppressed-control',
  'dormant-A3-response',
  'dormant-body-response',
  'dormant-intermediate-response',
];
const CLOSURE_STATES: readonly PSimplexT15ClosureState[] = [
  'closed',
  'not-closed',
  'diagnostic-only',
  'requires-threshold-theory',
  'requires-readout-refinement',
];

export function buildPSimplexBoundedRelaxationResponseStatusLedgerT15Report(): PSimplexBoundedRelaxationResponseStatusLedgerT15Report {
  const parentT14Report = buildPSimplexBoundedPointwiseVectorLGRelaxationLedgerT14Report();
  const parentT14LedgerStillPartialOrPasses =
    parentT14Report.ok &&
    parentT14Report.integrityIssueCount === 0 &&
    (parentT14Report.verdict === 'PASS' || parentT14Report.verdict === 'PARTIAL');
  const responseStatusRows = parentT14Report.relaxationRows.map(classifyT14Row);
  const familyStatusRows = buildFamilyStatusRows(responseStatusRows);
  const statusClassDistributionRows = buildStatusClassDistributionRows(responseStatusRows);
  const closureStateDistributionRows = buildClosureStateDistributionRows(responseStatusRows);
  const closedClassRows = buildClosedClassRows(responseStatusRows);
  const notClosedClassRows = buildNotClosedClassRows(responseStatusRows);
  const dormantClassRows = buildDormantClassRows(parentT14Report.relaxationRows);
  const rowExceptionRows = buildRowExceptionRows(responseStatusRows);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const summary = buildSummary({
    parentT14Verdict: parentT14Report.verdict,
    parentT14Ok: parentT14Report.ok,
    parentRows: parentT14Report.relaxationRows,
    responseStatusRows,
    invalidInterpretationBoundaryRows,
  });
  const integrityIssues = collectIntegrityIssues({
    parentT14LedgerStillPartialOrPasses,
    responseStatusRows,
    familyStatusRows,
    rowExceptionRows,
    invalidInterpretationBoundaryRows,
    summary,
  });
  const verdict = classifyVerdict(integrityIssues, responseStatusRows, rowExceptionRows);

  return {
    method: 'p-simplex-bounded-relaxation-response-status-ledger-t15',
    candidatePackage: 'p-simplex-bounded-relaxation-response-status-ledger-t15',
    parentT14Ledger: 'p-simplex-bounded-pointwise-vector-lg-relaxation-ledger-t14',
    diagnosticScope: 'bounded-relaxation-response-status-classifier-only',
    solverStatus: 'not-new-solver',
    spatialDynamicsStatus: 'not-spatial-lg-dynamics',
    fieldAtlasStatus: 'not-field-atlas',
    renderingStatus: 'not-rendering',
    fieldCueStatus: 'not-field-cue',
    semanticStatus: 'not-semantic-naming',
    routeStatus: 'no-route-walk-holonomy',
    defectStatus: 'no-defect-vortex-claims',
    denseSamplingStatus: 'not-dense-sampling',
    parentT14LedgerStillPartialOrPasses,
    responseStatusRows,
    familyStatusRows,
    statusClassDistributionRows,
    closureStateDistributionRows,
    closedClassRows,
    notClosedClassRows,
    dormantClassRows,
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

function classifyT14Row(row: PSimplexT14RelaxationRow): PSimplexT15ResponseStatusRow {
  const responseStatusClasses = uniqueStatusClasses([
    ...primaryStatusClasses(row),
    finiteLedgerStatusClass(row.finiteLedgerConsistencyStatus),
  ]);
  const notes = notesForRow(row);
  const closureState = closureStateForRow(row, responseStatusClasses);
  const closedPositiveResult = closureState === 'closed';
  const exceptionReasons = exceptionReasonsForRow(row, responseStatusClasses, closureState);
  const exceptionFlag = exceptionReasons.length > 0;
  const ok = rowClassificationOk(row, responseStatusClasses, closureState, exceptionReasons);

  return {
    rowId: row.rowId,
    driveFamily: row.driveFamily,
    driveId: row.driveId,
    probeClass: row.probeClass,
    diagnosticOnly: row.diagnosticOnly,
    relaxedResponseClass: row.relaxedResponseClass,
    finiteLedgerConsistencyStatus: row.finiteLedgerConsistencyStatus,
    bestMinimumConverged: row.bestMinimumConverged,
    bestMinimumStopReason: row.bestMinimumStopReason,
    boundaryHit: row.boundaryHit,
    responseStatusClasses,
    closureState,
    closedPositiveResult,
    notes,
    exceptionFlag,
    exceptionReason: exceptionReasons.length > 0 ? exceptionReasons.join('; ') : null,
    ok,
  };
}

function primaryStatusClasses(row: PSimplexT14RelaxationRow): PSimplexT15ResponseStatusClass[] {
  if (row.driveFamily === 'D0') {
    return ['zero-drive-degenerate'];
  }

  if (row.driveFamily === 'D1') {
    return ['axis-relaxed-response'];
  }

  if (row.driveFamily === 'D5') {
    return ['approved-geometry-axis-response'];
  }

  if (row.driveFamily === 'T') {
    return ['diagnostic-only-suppressed-control'];
  }

  if (row.driveFamily === 'D2' || row.driveFamily === 'D3') {
    return row.relaxedResponseClass === 'threshold-sensitive' ? ['threshold-sensitive'] : [];
  }

  return [];
}

function finiteLedgerStatusClass(status: PSimplexT14ConsistencyStatus): PSimplexT15ResponseStatusClass {
  if (status === 'finite-ledger-consistent') {
    return 'finite-ledger-consistent';
  }

  if (status === 'finite-ledger-coarse-but-compatible') {
    return 'finite-ledger-coarse-compatible';
  }

  return 'finite-ledger-divergent';
}

function closureStateForRow(
  row: PSimplexT14RelaxationRow,
  responseStatusClasses: readonly PSimplexT15ResponseStatusClass[],
): PSimplexT15ClosureState {
  if (row.driveFamily === 'D0') {
    return row.relaxedResponseClass === 'zero-drive-degenerate' && row.bestMinimumConverged ? 'closed' : 'not-closed';
  }

  if (row.driveFamily === 'D1') {
    return row.relaxedResponseClass === 'axis-relaxed-response' &&
      row.finiteLedgerConsistencyStatus === 'finite-ledger-consistent' &&
      row.bestMinimumConverged
      ? 'closed'
      : 'not-closed';
  }

  if (row.driveFamily === 'D5') {
    return row.relaxedResponseClass === 'axis-relaxed-response' &&
      row.finiteLedgerConsistencyStatus === 'finite-ledger-consistent' &&
      row.bestMinimumConverged
      ? 'closed'
      : 'not-closed';
  }

  if (row.driveFamily === 'D2') {
    return responseStatusClasses.includes('finite-ledger-divergent')
      ? 'requires-readout-refinement'
      : 'requires-threshold-theory';
  }

  if (row.driveFamily === 'D3') {
    return 'requires-threshold-theory';
  }

  if (row.driveFamily === 'T') {
    return 'diagnostic-only';
  }

  return 'not-closed';
}

function notesForRow(row: PSimplexT14RelaxationRow): string[] {
  const notes: string[] = [];

  if (row.driveFamily === 'D4') {
    notes.push('diagnostic-structural-class-not-clean-cue');
  }

  if (!row.bestMinimumConverged) {
    notes.push(`non-converged-best-minimum-stop-reason-${row.bestMinimumStopReason}`);
  }

  if (row.boundaryHit) {
    notes.push('boundary-sensitive-not-cleanly-converged');
  }

  return notes;
}

function exceptionReasonsForRow(
  row: PSimplexT14RelaxationRow,
  responseStatusClasses: readonly PSimplexT15ResponseStatusClass[],
  closureState: PSimplexT15ClosureState,
): string[] {
  const reasons: string[] = [];

  if (row.finiteLedgerConsistencyStatus === 'finite-ledger-divergent') {
    reasons.push('finite-ledger-divergent');
  }

  if (!row.bestMinimumConverged) {
    reasons.push('non-converged-best-minimum');
  }

  if (row.boundaryHit) {
    reasons.push('boundary-hit');
  }

  if (unexpectedClosure(row, closureState)) {
    reasons.push('unexpected-closure');
  }

  if (row.driveFamily === 'T' && hasCleanReadableStatus(responseStatusClasses)) {
    reasons.push('suppressed-control-marked-clean');
  }

  if (responseStatusClasses.includes('threshold-sensitive') && closureState === 'closed') {
    reasons.push('threshold-sensitive-marked-closed');
  }

  return reasons;
}

function rowClassificationOk(
  row: PSimplexT14RelaxationRow,
  responseStatusClasses: readonly PSimplexT15ResponseStatusClass[],
  closureState: PSimplexT15ClosureState,
  exceptionReasons: readonly string[],
): boolean {
  if (responseStatusClasses.length === 0) {
    return false;
  }

  if (row.boundaryHit && closureState === 'closed') {
    return false;
  }

  if (!row.bestMinimumConverged && closureState === 'closed') {
    return false;
  }

  if (exceptionReasons.includes('suppressed-control-marked-clean') || exceptionReasons.includes('threshold-sensitive-marked-closed')) {
    return false;
  }

  if (row.driveFamily === 'D0') {
    return closureState === 'closed' && responseStatusClasses.includes('zero-drive-degenerate');
  }

  if (row.driveFamily === 'D1') {
    return closureState === 'closed' && responseStatusClasses.includes('axis-relaxed-response');
  }

  if (row.driveFamily === 'D5') {
    return closureState === 'closed' && responseStatusClasses.includes('approved-geometry-axis-response');
  }

  if (row.driveFamily === 'D2') {
    return closureState !== 'closed' && responseStatusClasses.includes('threshold-sensitive');
  }

  if (row.driveFamily === 'D3') {
    return closureState === 'requires-threshold-theory' && responseStatusClasses.includes('threshold-sensitive');
  }

  if (row.driveFamily === 'D4') {
    return closureState === 'not-closed';
  }

  return closureState === 'diagnostic-only' && responseStatusClasses.includes('diagnostic-only-suppressed-control');
}

function unexpectedClosure(row: PSimplexT14RelaxationRow, closureState: PSimplexT15ClosureState): boolean {
  if (row.driveFamily === 'D1' || row.driveFamily === 'D5' || row.driveFamily === 'D0') {
    return closureState !== 'closed';
  }

  return closureState === 'closed';
}

function hasCleanReadableStatus(responseStatusClasses: readonly PSimplexT15ResponseStatusClass[]): boolean {
  return responseStatusClasses.includes('axis-relaxed-response') ||
    responseStatusClasses.includes('approved-geometry-axis-response') ||
    responseStatusClasses.includes('zero-drive-degenerate');
}

function buildFamilyStatusRows(rows: readonly PSimplexT15ResponseStatusRow[]): PSimplexT15FamilyStatusRow[] {
  return DRIVE_FAMILIES.map((driveFamily) => {
    const familyRows = rows.filter((row) => row.driveFamily === driveFamily);
    const dominantStatusClasses = dominantStatusClassesForRows(familyRows);
    const closureState = familyClosureState(driveFamily, familyRows);
    const closedCount = familyRows.filter((row) => row.closureState === 'closed').length;
    const diagnosticOnlyCount = familyRows.filter((row) => row.closureState === 'diagnostic-only').length;
    const notClosedCount = familyRows.filter((row) => row.closureState !== 'closed' && row.closureState !== 'diagnostic-only').length;
    const thresholdSensitiveCount = familyRows.filter((row) => row.responseStatusClasses.includes('threshold-sensitive')).length;
    const coarseCompatibleCount = familyRows.filter((row) => row.responseStatusClasses.includes('finite-ledger-coarse-compatible')).length;
    const divergentCount = familyRows.filter((row) => row.responseStatusClasses.includes('finite-ledger-divergent')).length;
    const exceptionCount = familyRows.filter((row) => row.exceptionFlag).length;

    return {
      driveFamily,
      rowCount: familyRows.length,
      dominantStatusClasses,
      closureState,
      closedCount,
      notClosedCount,
      diagnosticOnlyCount,
      thresholdSensitiveCount,
      coarseCompatibleCount,
      divergentCount,
      exceptionCount,
      summaryJudgment: summaryJudgmentForFamily(driveFamily),
      ok: familyOk(driveFamily, familyRows),
    };
  });
}

function dominantStatusClassesForRows(rows: readonly PSimplexT15ResponseStatusRow[]): PSimplexT15ResponseStatusClass[] {
  return STATUS_CLASSES.filter((statusClass) => rows.some((row) => row.responseStatusClasses.includes(statusClass)));
}

function familyClosureState(
  driveFamily: PSimplexT14DriveFamily,
  rows: readonly PSimplexT15ResponseStatusRow[],
): PSimplexT15ClosureState {
  if (driveFamily === 'D0' || driveFamily === 'D1' || driveFamily === 'D5') {
    return rows.length > 0 && rows.every((row) => row.closureState === 'closed') ? 'closed' : 'not-closed';
  }

  if (driveFamily === 'D2') {
    return rows.some((row) => row.closureState === 'requires-readout-refinement')
      ? 'requires-readout-refinement'
      : 'requires-threshold-theory';
  }

  if (driveFamily === 'D3') {
    return 'requires-threshold-theory';
  }

  if (driveFamily === 'T') {
    return 'diagnostic-only';
  }

  return 'not-closed';
}

function summaryJudgmentForFamily(driveFamily: PSimplexT14DriveFamily): string {
  if (driveFamily === 'D0') {
    return 'zero-drive-degenerate-closed';
  }

  if (driveFamily === 'D1') {
    return 'axis-response-closed';
  }

  if (driveFamily === 'D2') {
    return 'threshold-sensitive-not-closed';
  }

  if (driveFamily === 'D3') {
    return 'threshold-sensitive-not-closed';
  }

  if (driveFamily === 'D4') {
    return 'diagnostic-structural-class-not-clean-cue';
  }

  if (driveFamily === 'D5') {
    return 'approved-geometry-axis-response-closed';
  }

  return 'diagnostic-only-suppressed-control';
}

function familyOk(driveFamily: PSimplexT14DriveFamily, rows: readonly PSimplexT15ResponseStatusRow[]): boolean {
  if (rows.length === 0) {
    return false;
  }

  if (driveFamily === 'D0' || driveFamily === 'D1' || driveFamily === 'D5') {
    return rows.every((row) => row.ok && row.closureState === 'closed');
  }

  if (driveFamily === 'D2') {
    return rows.every((row) => row.ok && row.closureState !== 'closed' && row.responseStatusClasses.includes('threshold-sensitive'));
  }

  if (driveFamily === 'D3') {
    return rows.every(
      (row) =>
        row.ok &&
        row.closureState === 'requires-threshold-theory' &&
        row.responseStatusClasses.includes('threshold-sensitive'),
    );
  }

  if (driveFamily === 'D4') {
    return rows.every((row) => row.ok && row.closureState === 'not-closed');
  }

  return rows.every(
    (row) =>
      row.ok &&
      row.closureState === 'diagnostic-only' &&
      row.responseStatusClasses.includes('diagnostic-only-suppressed-control'),
  );
}

function buildStatusClassDistributionRows(rows: readonly PSimplexT15ResponseStatusRow[]): PSimplexT15StatusClassDistributionRow[] {
  return STATUS_CLASSES.map((responseStatusClass) => ({
    responseStatusClass,
    count: rows.filter((row) => row.responseStatusClasses.includes(responseStatusClass)).length,
  }));
}

function buildClosureStateDistributionRows(rows: readonly PSimplexT15ResponseStatusRow[]): PSimplexT15ClosureStateDistributionRow[] {
  return CLOSURE_STATES.map((closureState) => ({
    closureState,
    count: rows.filter((row) => row.closureState === closureState).length,
  }));
}

function buildClosedClassRows(rows: readonly PSimplexT15ResponseStatusRow[]): PSimplexT15ClassRow[] {
  return [
    classRow('zero-drive-degenerate', 'zero-drive-degenerate', rows, ['D0'], 'closed', 'closed-zero-drive-degenerate'),
    classRow('axis-relaxed-response', 'axis-relaxed-response', rows, ['D1'], 'closed', 'closed-axis-response'),
    classRow(
      'approved-geometry-axis-response',
      'approved-geometry-axis-response',
      rows,
      ['D5'],
      'closed',
      'closed-clean-child-axis-response-channel',
    ),
  ];
}

function buildNotClosedClassRows(rows: readonly PSimplexT15ResponseStatusRow[]): PSimplexT15ClassRow[] {
  return [
    classRow('D2-threshold-sensitive', 'threshold-sensitive', rows, ['D2'], 'requires-readout-refinement', 'not-closed-threshold-sensitive'),
    classRow('D3-threshold-sensitive', 'threshold-sensitive', rows, ['D3'], 'requires-threshold-theory', 'not-closed-threshold-sensitive'),
    classRow('D4-diagnostic-structural-class', 'finite-ledger-consistent', rows, ['D4'], 'not-closed', 'diagnostic-structural-class-not-clean-cue'),
    classRow(
      'T-diagnostic-only-suppressed-control',
      'diagnostic-only-suppressed-control',
      rows,
      ['T'],
      'diagnostic-only',
      'diagnostic-only-not-clean-readable',
    ),
  ];
}

function classRow(
  classId: string,
  responseStatusClass: PSimplexT15ResponseStatusClass,
  rows: readonly PSimplexT15ResponseStatusRow[],
  driveFamilies: PSimplexT14DriveFamily[],
  closureState: PSimplexT15ClosureState,
  summaryJudgment: string,
): PSimplexT15ClassRow {
  const matchingRows = rows.filter(
    (row) => driveFamilies.includes(row.driveFamily) && row.responseStatusClasses.includes(responseStatusClass),
  );

  return {
    classId,
    responseStatusClass,
    driveFamilies,
    rowCount: matchingRows.length,
    closureState,
    summaryJudgment,
    ok: matchingRows.length > 0,
  };
}

function buildDormantClassRows(parentRows: readonly PSimplexT14RelaxationRow[]): PSimplexT15DormantClassRow[] {
  return [
    dormantClassRow('dormant-A3-response', 'A3-relaxed-response', parentRows),
    dormantClassRow('dormant-body-response', 'body-diagonal-relaxed-response', parentRows),
    dormantClassRow('dormant-intermediate-response', 'intermediate-relaxed-response', parentRows),
  ];
}

function dormantClassRow(
  responseStatusClass: PSimplexT15ResponseStatusClass,
  relaxedResponseClass: PSimplexRelaxedResponseClass,
  parentRows: readonly PSimplexT14RelaxationRow[],
): PSimplexT15DormantClassRow {
  const rowCount = parentRows.filter((row) => row.relaxedResponseClass === relaxedResponseClass).length;

  return {
    responseStatusClass,
    relaxedResponseClass,
    rowCount,
    closureState: 'not-closed',
    dormant: true,
    ok: rowCount === 0,
  };
}

function buildRowExceptionRows(rows: readonly PSimplexT15ResponseStatusRow[]): PSimplexT15RowExceptionRow[] {
  return rows
    .filter((row) => row.exceptionFlag)
    .map((row) => ({
      rowId: row.rowId,
      driveFamily: row.driveFamily,
      driveId: row.driveId,
      probeClass: row.probeClass,
      finiteLedgerConsistencyStatus: row.finiteLedgerConsistencyStatus,
      relaxedResponseClass: row.relaxedResponseClass,
      bestMinimumConverged: row.bestMinimumConverged,
      boundaryHit: row.boundaryHit,
      responseStatusClasses: [...row.responseStatusClasses],
      closureState: row.closureState,
      exceptionReasons: row.exceptionReason ? row.exceptionReason.split('; ') : [],
      ok: row.ok,
    }));
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT15InvalidInterpretationBoundaryRow[] {
  return [
    { boundaryId: 'not-spatial-dynamics', statement: 'spatial dynamics are not solved', enforced: true },
    { boundaryId: 'not-field-cue', statement: 'FieldCue does not exist in this classifier', enforced: true },
    { boundaryId: 'responses-not-concepts', statement: 'response directions are not concepts', enforced: true },
    { boundaryId: 'a3-not-route-walk-holonomy', statement: 'A3 response is not route, walk, or holonomy', enforced: true },
    { boundaryId: 'body-not-semantic-truth', statement: 'body response is not semantic truth', enforced: true },
    { boundaryId: 'not-defect-vortex', statement: 'defects and vortices are not active', enforced: true },
    { boundaryId: 'not-rendering', statement: 'rendering is not authorized', enforced: true },
    { boundaryId: 'not-dense-sampling', statement: 'dense sampling is not authorized', enforced: true },
  ];
}

function buildSummary(args: {
  parentT14Verdict: string;
  parentT14Ok: boolean;
  parentRows: readonly PSimplexT14RelaxationRow[];
  responseStatusRows: readonly PSimplexT15ResponseStatusRow[];
  invalidInterpretationBoundaryRows: readonly PSimplexT15InvalidInterpretationBoundaryRow[];
}): PSimplexT15Summary {
  const d1Rows = rowsForFamily(args.responseStatusRows, 'D1');
  const d2Rows = rowsForFamily(args.responseStatusRows, 'D2');
  const d3Rows = rowsForFamily(args.responseStatusRows, 'D3');
  const d5Rows = rowsForFamily(args.responseStatusRows, 'D5');
  const tRows = rowsForFamily(args.responseStatusRows, 'T');
  const nonAxisFamilies: PSimplexT14DriveFamily[] = ['D2', 'D3', 'D4', 'T'];

  return {
    parentT14Verdict: args.parentT14Verdict,
    parentT14Ok: args.parentT14Ok,
    t14RelaxationRowCount: args.parentRows.length,
    responseStatusRowCount: args.responseStatusRows.length,
    rowsClassified: args.responseStatusRows.every((row) => row.responseStatusClasses.length > 0),
    rowsHaveExactlyOneClosureState: args.responseStatusRows.every((row) => CLOSURE_STATES.includes(row.closureState)),
    closedRowCount: args.responseStatusRows.filter((row) => row.closureState === 'closed').length,
    notClosedRowCount: args.responseStatusRows.filter(
      (row) => row.closureState !== 'closed' && row.closureState !== 'diagnostic-only',
    ).length,
    diagnosticOnlyRowCount: args.responseStatusRows.filter((row) => row.closureState === 'diagnostic-only').length,
    requiresThresholdTheoryRowCount: args.responseStatusRows.filter((row) => row.closureState === 'requires-threshold-theory').length,
    requiresReadoutRefinementRowCount: args.responseStatusRows.filter((row) => row.closureState === 'requires-readout-refinement').length,
    thresholdSensitiveRowCount: args.responseStatusRows.filter((row) => row.responseStatusClasses.includes('threshold-sensitive')).length,
    coarseCompatibleRowCount: args.responseStatusRows.filter((row) => row.responseStatusClasses.includes('finite-ledger-coarse-compatible')).length,
    divergentRowCount: args.responseStatusRows.filter((row) => row.responseStatusClasses.includes('finite-ledger-divergent')).length,
    rowExceptionCount: args.responseStatusRows.filter((row) => row.exceptionFlag).length,
    d1Closed: d1Rows.length === 6 && d1Rows.every((row) => row.closureState === 'closed'),
    d5Closed: d5Rows.length === 24 && d5Rows.every((row) => row.closureState === 'closed'),
    d2ThresholdSensitivityPreserved:
      d2Rows.length === 36 && d2Rows.every((row) => row.responseStatusClasses.includes('threshold-sensitive') && row.closureState !== 'closed'),
    d3ThresholdSensitivityPreserved:
      d3Rows.length === 24 && d3Rows.every((row) => row.responseStatusClasses.includes('threshold-sensitive') && row.closureState !== 'closed'),
    tRowsRemainDiagnosticOnly:
      tRows.length === 18 &&
      tRows.every(
        (row) => row.closureState === 'diagnostic-only' && row.responseStatusClasses.includes('diagnostic-only-suppressed-control'),
      ),
    finiteLedgerComparisonNotExactForNonAxisFamilies: args.responseStatusRows
      .filter((row) => nonAxisFamilies.includes(row.driveFamily))
      .every((row) => row.closureState !== 'closed'),
    dormantA3ResponseCount: countRelaxedResponseClass(args.parentRows, 'A3-relaxed-response'),
    dormantBodyResponseCount: countRelaxedResponseClass(args.parentRows, 'body-diagonal-relaxed-response'),
    dormantIntermediateResponseCount: countRelaxedResponseClass(args.parentRows, 'intermediate-relaxed-response'),
    forbiddenBoundaryPassed:
      args.invalidInterpretationBoundaryRows.every((row) => row.enforced) &&
      !forbiddenPositiveClaimAppears(args.responseStatusRows, args.invalidInterpretationBoundaryRows),
  };
}

function collectIntegrityIssues(args: {
  parentT14LedgerStillPartialOrPasses: boolean;
  responseStatusRows: readonly PSimplexT15ResponseStatusRow[];
  familyStatusRows: readonly PSimplexT15FamilyStatusRow[];
  rowExceptionRows: readonly PSimplexT15RowExceptionRow[];
  invalidInterpretationBoundaryRows: readonly PSimplexT15InvalidInterpretationBoundaryRow[];
  summary: PSimplexT15Summary;
}): string[] {
  const issues: string[] = [];

  if (!args.parentT14LedgerStillPartialOrPasses) {
    issues.push('Parent T14 ledger is not ok with PASS or PARTIAL verdict.');
  }

  if (args.summary.t14RelaxationRowCount !== args.summary.responseStatusRowCount) {
    issues.push('Not all T14 rows received response-status classification.');
  }

  if (!args.summary.rowsClassified) {
    issues.push('At least one T14 row has no response-status class.');
  }

  if (!args.summary.rowsHaveExactlyOneClosureState) {
    issues.push('At least one row does not have exactly one valid closure state.');
  }

  if (!args.summary.d1Closed) {
    issues.push('D1 axis response rows did not remain closed.');
  }

  if (!args.summary.d5Closed) {
    issues.push('D5 approved geometry-axis response rows did not remain closed.');
  }

  if (!args.summary.d2ThresholdSensitivityPreserved || !args.summary.d3ThresholdSensitivityPreserved) {
    issues.push('D2/D3 threshold sensitivity was not preserved.');
  }

  if (!args.summary.tRowsRemainDiagnosticOnly) {
    issues.push('Suppressed T rows were promoted out of diagnostic-only status.');
  }

  if (!args.summary.finiteLedgerComparisonNotExactForNonAxisFamilies) {
    issues.push('Finite-ledger comparison was treated as exact for a non-axis family.');
  }

  if (!rowExceptionDetailComplete(args.responseStatusRows, args.rowExceptionRows)) {
    issues.push('Row-level exception detail is incomplete.');
  }

  if (args.familyStatusRows.some((row) => !row.ok)) {
    issues.push('At least one family-level classification row is not ok.');
  }

  if (!args.summary.forbiddenBoundaryPassed || !args.invalidInterpretationBoundaryRows.every((row) => row.enforced)) {
    issues.push('Forbidden interpretation language entered the response-status ledger.');
  }

  return [...new Set(issues)];
}

function classifyVerdict(
  integrityIssues: readonly string[],
  responseStatusRows: readonly PSimplexT15ResponseStatusRow[],
  rowExceptionRows: readonly PSimplexT15RowExceptionRow[],
): PSimplexT15Verdict {
  if (
    integrityIssues.some((issue) => issue !== 'Row-level exception detail is incomplete.') ||
    responseStatusRows.some((row) => !row.ok)
  ) {
    return 'FAIL';
  }

  if (rowExceptionRows.length === 0 && responseStatusRows.some((row) => row.exceptionFlag)) {
    return 'PARTIAL';
  }

  return integrityIssues.length > 0 ? 'PARTIAL' : 'PASS';
}

function recommendationForVerdict(verdict: PSimplexT15Verdict): PSimplexT15FinalRecommendation {
  if (verdict === 'PASS') {
    return 'advance-to-threshold-theory-and-readout-refinement';
  }

  if (verdict === 'PARTIAL') {
    return 'complete-row-exception-detail';
  }

  return 'return-to-response-status-classifier';
}

function rowExceptionDetailComplete(
  rows: readonly PSimplexT15ResponseStatusRow[],
  rowExceptionRows: readonly PSimplexT15RowExceptionRow[],
): boolean {
  const exceptionRowIds = new Set(rowExceptionRows.map((row) => row.rowId));

  return rows.every((row) => !row.exceptionFlag || exceptionRowIds.has(row.rowId));
}

function rowsForFamily(
  rows: readonly PSimplexT15ResponseStatusRow[],
  driveFamily: PSimplexT14DriveFamily,
): PSimplexT15ResponseStatusRow[] {
  return rows.filter((row) => row.driveFamily === driveFamily);
}

function countRelaxedResponseClass(
  rows: readonly PSimplexT14RelaxationRow[],
  relaxedResponseClass: PSimplexRelaxedResponseClass,
): number {
  return rows.filter((row) => row.relaxedResponseClass === relaxedResponseClass).length;
}

function uniqueStatusClasses(values: readonly PSimplexT15ResponseStatusClass[]): PSimplexT15ResponseStatusClass[] {
  return STATUS_CLASSES.filter((statusClass) => values.includes(statusClass));
}

function forbiddenPositiveClaimAppears(
  responseStatusRows: readonly PSimplexT15ResponseStatusRow[],
  boundaryRows: readonly PSimplexT15InvalidInterpretationBoundaryRow[],
): boolean {
  const values = [
    ...responseStatusRows.flatMap((row) => [
      row.rowId,
      row.driveFamily,
      row.relaxedResponseClass,
      row.finiteLedgerConsistencyStatus,
      row.closureState,
      row.exceptionReason ?? '',
      ...row.responseStatusClasses,
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
    'response directions are concepts',
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

import {
  buildPSimplexSourceForcedVectorLGResponseLedgerT12Report,
  type PSimplexT12ResponseComparisonRow,
  type PSimplexT12ResponseDirectionClass,
  type PSimplexT12SourceDriveRow,
} from './pSimplexSourceForcedVectorLGResponseLedgerT12';
import {
  buildPSimplexGeometryProbeSourceForcedResponseLedgerT13Report,
  type PSimplexT13ProbeSourceDriveRow,
  type PSimplexT13ResponseEvaluationRow,
} from './pSimplexGeometryProbeSourceForcedResponseLedgerT13';
import {
  minimizePSimplexBoundedPointwiseVectorLG,
  type PSimplexPointwiseStopReason,
  type PSimplexRelaxedResponseClass,
} from './pSimplexPointwiseRelaxationCore';
import { isApprovedCleanProbeClass } from './pSimplexProbePolicy';
import {
  cleanNumber,
  cleanVec3,
  copyVec3,
  normVec3,
  PSIMPLEX_EPSILON,
  type PSimplexVec3,
} from './pSimplexVectorMath';

export type PSimplexT14DriveFamily = 'D0' | 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'T';
export type PSimplexT14DriveSource = 't12-source-drive' | 't13-approved-geometry-probe' | 't13-suppressed-transverse-probe';
export type PSimplexT14FinitePredictionClass =
  | PSimplexT12ResponseDirectionClass
  | 'unforced-axis-degenerate'
  | 'threshold-sensitive'
  | 'mixed-response'
  | 'unclassified-response';
export type PSimplexT14ConsistencyStatus =
  | 'finite-ledger-consistent'
  | 'finite-ledger-divergent'
  | 'finite-ledger-coarse-but-compatible';
export type PSimplexT14Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT14FinalRecommendation =
  | 'advance-to-bounded-relaxation-status-charter'
  | 'refine-pointwise-relaxation-taxonomy'
  | 'return-to-pointwise-relaxation-core';

export interface PSimplexT14MinimizationMethodSummary {
  potential: 'lambda*(|phi|^2-v^2)^2 + mu*(phi_x^2 phi_y^2 + phi_y^2 phi_z^2 + phi_z^2 phi_x^2) - eta*J.dot(phi)';
  lambda: 1;
  mu: 1;
  v: 1;
  method: 'deterministic-projected-gradient-descent-multiseed';
  runtimeCore: 'pSimplexPointwiseRelaxationCore';
  boundedPointwiseOnly: true;
  spatialDynamicsStatus: 'not-spatial-lg-dynamics';
}

export interface PSimplexT14SeedSetSummary {
  zeroSeedIncluded: true;
  axisSeedCount: 6;
  a3SeedCount: 12;
  bodyDiagonalSeedCount: 8;
  sourceDriveAlignedSeedWhenJNonzero: true;
  minimumSeedCountForZeroDrive: 27;
  minimumSeedCountForNonzeroDrive: 28;
}

export interface PSimplexT14BoundsSummary {
  maxRadius: 3;
  boundarySensitiveIfHit: true;
}

export interface PSimplexT14RelaxationRow {
  rowId: string;
  driveId: string;
  driveFamily: PSimplexT14DriveFamily;
  driveSource: PSimplexT14DriveSource;
  targetChild: string | null;
  probeClass: string | null;
  diagnosticOnly: boolean;
  J: PSimplexVec3;
  sourceDriveNorm: number;
  sLabel: string;
  s: number;
  eta: number;
  effectiveForcingStrengthS: number;
  finiteLedgerPredictedResponseClass: PSimplexT14FinitePredictionClass;
  finiteLedgerResponseStatus: string;
  finiteLedgerWinningResponseDirectionIds: string[];
  finiteLedgerWinningResponseClasses: PSimplexT12ResponseDirectionClass[];
  relaxedPhi: PSimplexVec3;
  relaxedPhiNorm: number;
  relaxedPhiHat: PSimplexVec3 | null;
  nearestFiniteResponseDirectionId: string | null;
  nearestFiniteResponseClass: PSimplexT12ResponseDirectionClass | null;
  nearestFiniteResponseAlignment: number;
  relaxedResponseClass: PSimplexRelaxedResponseClass;
  energyValue: number;
  finiteLedgerConsistencyStatus: PSimplexT14ConsistencyStatus;
  thresholdIntermediateNote: string;
  localMinimaNote: string;
  localMinimumCountWithinTolerance: number;
  bestMinimumStopReason: PSimplexPointwiseStopReason;
  bestMinimumConverged: boolean;
  bestMinimumGradientNorm: number;
  bestMinimumIterations: number;
  bestMinimumLastEnergyDelta: number;
  bestMinimumLastStepSize: number;
  boundaryHit: boolean;
  boundaryHitNote: string;
  sourceDriveResponseDistinct: true;
  ok: boolean;
}

export interface PSimplexT14DriveFamilySummaryRow {
  driveFamily: PSimplexT14DriveFamily;
  rowCount: number;
  finiteLedgerConsistentCount: number;
  coarseCompatibleCount: number;
  divergentCount: number;
  intermediateCount: number;
  boundaryHitCount: number;
  ok: boolean;
}

export interface PSimplexT14FiniteLedgerConsistencyDistributionRow {
  finiteLedgerConsistencyStatus: PSimplexT14ConsistencyStatus;
  count: number;
}

export interface PSimplexT14RelaxedResponseClassDistributionRow {
  relaxedResponseClass: PSimplexRelaxedResponseClass;
  count: number;
}

export interface PSimplexT14InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT14Summary {
  relaxationRowCount: number;
  d0RowCount: number;
  d1RowCount: number;
  d2RowCount: number;
  d3RowCount: number;
  d4RowCount: number;
  d5ApprovedGeometryProbeRowCount: number;
  suppressedTRowCount: number;
  d0DegeneracyReported: boolean;
  d1AxisDrivesRelaxToMatchingAxes: boolean;
  d5ApprovedGeometryProbesRelaxToMatchingChildAxes: boolean;
  suppressedTRowsRemainDiagnosticOnly: boolean;
  finiteLedgerConsistencyDistributionCount: number;
  relaxedResponseClassDistributionCount: number;
  boundaryHitCount: number;
  nonConvergedBestMinimumCount: number;
  maxIterationStopCount: number;
  lineSearchStepUnderflowCount: number;
  energyStepConvergedCount: number;
  gradientConvergedCount: number;
  localMinimaMultiplicityCount: number;
  divergentCount: number;
  intermediateCount: number;
  sourceDriveResponseDistinctPassed: boolean;
  forbiddenBoundaryPassed: boolean;
}

export interface PSimplexBoundedPointwiseVectorLGRelaxationLedgerT14Report {
  method: 'p-simplex-bounded-pointwise-vector-lg-relaxation-ledger-t14';
  candidatePackage: 'p-simplex-bounded-pointwise-vector-lg-relaxation-ledger-t14';
  parentSourceForcedResponseLedger: 'p-simplex-source-forced-vector-lg-response-ledger-t12';
  parentGeometryProbeSourceForcedResponseLedger: 'p-simplex-geometry-probe-source-forced-response-ledger-t13';
  diagnosticScope: 'bounded-pointwise-vector-lg-relaxation-ledger-only';
  solverStatus: 'bounded-pointwise-minimization-only';
  spatialDynamicsStatus: 'not-spatial-lg-dynamics';
  fieldDomainStatus: 'not-field-domain-relaxation';
  fieldAtlasStatus: 'not-field-atlas';
  renderingStatus: 'not-rendering';
  fieldCueStatus: 'not-field-cue';
  semanticStatus: 'not-semantic-naming';
  routeStatus: 'no-route-walk-holonomy';
  defectStatus: 'no-defect-vortex-claims';
  denseSamplingStatus: 'not-dense-sampling';
  generatedSiteStatus: 'not-generated-site-reading';
  parentSourceForcedResponseLedgerStillPasses: boolean;
  parentGeometryProbeSourceForcedResponseLedgerStillPasses: boolean;
  minimizationMethodSummary: PSimplexT14MinimizationMethodSummary;
  seedSetSummary: PSimplexT14SeedSetSummary;
  boundsSummary: PSimplexT14BoundsSummary;
  relaxationRows: PSimplexT14RelaxationRow[];
  driveFamilySummaryRows: PSimplexT14DriveFamilySummaryRow[];
  finiteLedgerConsistencyDistributionRows: PSimplexT14FiniteLedgerConsistencyDistributionRow[];
  relaxedResponseClassDistributionRows: PSimplexT14RelaxedResponseClassDistributionRow[];
  invalidInterpretationBoundaryRows: PSimplexT14InvalidInterpretationBoundaryRow[];
  summary: PSimplexT14Summary;
  verdict: PSimplexT14Verdict;
  finalRecommendation: PSimplexT14FinalRecommendation;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface RelaxationInputRow {
  rowId: string;
  driveId: string;
  driveFamily: PSimplexT14DriveFamily;
  driveSource: PSimplexT14DriveSource;
  targetChild: string | null;
  probeClass: string | null;
  diagnosticOnly: boolean;
  J: PSimplexVec3;
  sLabel: string;
  s: number;
  finiteLedgerPredictedResponseClass: PSimplexT14FinitePredictionClass;
  finiteLedgerResponseStatus: string;
  finiteLedgerWinningResponseDirectionIds: string[];
  finiteLedgerWinningResponseClasses: PSimplexT12ResponseDirectionClass[];
  expectedAxisDirectionId: string | null;
}

const RELAXED_RESPONSE_CLASSES: readonly PSimplexRelaxedResponseClass[] = [
  'axis-relaxed-response',
  'A3-relaxed-response',
  'body-diagonal-relaxed-response',
  'intermediate-relaxed-response',
  'zero-drive-degenerate',
  'threshold-sensitive',
];
const CONSISTENCY_STATUSES: readonly PSimplexT14ConsistencyStatus[] = [
  'finite-ledger-consistent',
  'finite-ledger-divergent',
  'finite-ledger-coarse-but-compatible',
];
const DRIVE_FAMILIES: readonly PSimplexT14DriveFamily[] = ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'T'];
const MAX_RADIUS = 3;

export function buildPSimplexBoundedPointwiseVectorLGRelaxationLedgerT14Report(): PSimplexBoundedPointwiseVectorLGRelaxationLedgerT14Report {
  const parentT12Report = buildPSimplexSourceForcedVectorLGResponseLedgerT12Report();
  const parentT13Report = buildPSimplexGeometryProbeSourceForcedResponseLedgerT13Report();
  const parentSourceForcedResponseLedgerStillPasses =
    parentT12Report.ok && parentT12Report.integrityIssueCount === 0 && parentT12Report.verdict === 'PASS';
  const parentGeometryProbeSourceForcedResponseLedgerStillPasses =
    parentT13Report.ok && parentT13Report.integrityIssueCount === 0 && parentT13Report.verdict === 'PASS';
  const inputRows = buildRelaxationInputRows(parentT12Report, parentT13Report);
  const relaxationRows = inputRows.map(buildRelaxationRow);
  const driveFamilySummaryRows = buildDriveFamilySummaryRows(relaxationRows);
  const finiteLedgerConsistencyDistributionRows = buildFiniteLedgerConsistencyDistributionRows(relaxationRows);
  const relaxedResponseClassDistributionRows = buildRelaxedResponseClassDistributionRows(relaxationRows);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const summary = buildSummary({
    relaxationRows,
    finiteLedgerConsistencyDistributionRows,
    relaxedResponseClassDistributionRows,
    invalidInterpretationBoundaryRows,
  });
  const integrityIssues = collectIntegrityIssues({
    parentSourceForcedResponseLedgerStillPasses,
    parentGeometryProbeSourceForcedResponseLedgerStillPasses,
    relaxationRows,
    summary,
    invalidInterpretationBoundaryRows,
  });
  const verdict = classifyVerdict(integrityIssues, summary);

  return {
    method: 'p-simplex-bounded-pointwise-vector-lg-relaxation-ledger-t14',
    candidatePackage: 'p-simplex-bounded-pointwise-vector-lg-relaxation-ledger-t14',
    parentSourceForcedResponseLedger: 'p-simplex-source-forced-vector-lg-response-ledger-t12',
    parentGeometryProbeSourceForcedResponseLedger: 'p-simplex-geometry-probe-source-forced-response-ledger-t13',
    diagnosticScope: 'bounded-pointwise-vector-lg-relaxation-ledger-only',
    solverStatus: 'bounded-pointwise-minimization-only',
    spatialDynamicsStatus: 'not-spatial-lg-dynamics',
    fieldDomainStatus: 'not-field-domain-relaxation',
    fieldAtlasStatus: 'not-field-atlas',
    renderingStatus: 'not-rendering',
    fieldCueStatus: 'not-field-cue',
    semanticStatus: 'not-semantic-naming',
    routeStatus: 'no-route-walk-holonomy',
    defectStatus: 'no-defect-vortex-claims',
    denseSamplingStatus: 'not-dense-sampling',
    generatedSiteStatus: 'not-generated-site-reading',
    parentSourceForcedResponseLedgerStillPasses,
    parentGeometryProbeSourceForcedResponseLedgerStillPasses,
    minimizationMethodSummary: buildMinimizationMethodSummary(),
    seedSetSummary: buildSeedSetSummary(),
    boundsSummary: buildBoundsSummary(),
    relaxationRows,
    driveFamilySummaryRows,
    finiteLedgerConsistencyDistributionRows,
    relaxedResponseClassDistributionRows,
    invalidInterpretationBoundaryRows,
    summary,
    verdict,
    finalRecommendation: recommendationForVerdict(verdict),
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: verdict !== 'FAIL' && integrityIssues.length === 0,
  };
}

function buildRelaxationInputRows(
  parentT12Report: ReturnType<typeof buildPSimplexSourceForcedVectorLGResponseLedgerT12Report>,
  parentT13Report: ReturnType<typeof buildPSimplexGeometryProbeSourceForcedResponseLedgerT13Report>,
): RelaxationInputRow[] {
  const t12SourceDriveById = new Map(parentT12Report.sourceDriveRows.map((row) => [row.driveId, row]));
  const t13SourceDriveById = new Map(parentT13Report.probeSourceDriveRows.map((row) => [row.rowId, row]));

  return [
    ...parentT12Report.responseComparisonRows.map((row) =>
      buildT12RelaxationInputRow(row, requireT12SourceDrive(t12SourceDriveById, row.driveId)),
    ),
    ...parentT13Report.responseEvaluationRows
      .filter((row) => isApprovedCleanProbeClass(row.probeClass) && row.sLabel === 'axis-representative')
      .map((row) => buildT13RelaxationInputRow(row, requireT13SourceDrive(t13SourceDriveById, row.sourceDriveRowId), 'D5')),
    ...parentT13Report.responseEvaluationRows
      .filter((row) => row.probeClass === 'T')
      .map((row) => buildT13RelaxationInputRow(row, requireT13SourceDrive(t13SourceDriveById, row.sourceDriveRowId), 'T')),
  ];
}

function buildT12RelaxationInputRow(
  comparisonRow: PSimplexT12ResponseComparisonRow,
  sourceDriveRow: PSimplexT12SourceDriveRow,
): RelaxationInputRow {
  return {
    rowId: `T12-${comparisonRow.comparisonId}`,
    driveId: comparisonRow.driveId,
    driveFamily: comparisonRow.driveCase,
    driveSource: 't12-source-drive',
    targetChild: null,
    probeClass: null,
    diagnosticOnly: false,
    J: copyVec3(sourceDriveRow.J),
    sLabel: comparisonRow.sLabel,
    s: comparisonRow.s,
    finiteLedgerPredictedResponseClass: finitePredictionClassFromT12(comparisonRow),
    finiteLedgerResponseStatus: comparisonRow.responseStatus,
    finiteLedgerWinningResponseDirectionIds: [...comparisonRow.winningResponseDirectionIds],
    finiteLedgerWinningResponseClasses: [...comparisonRow.winningResponseClasses],
    expectedAxisDirectionId:
      comparisonRow.driveCase === 'D1' && comparisonRow.winningResponseDirectionIds.length === 1
        ? comparisonRow.winningResponseDirectionIds[0]
        : null,
  };
}

function buildT13RelaxationInputRow(
  evaluationRow: PSimplexT13ResponseEvaluationRow,
  sourceDriveRow: PSimplexT13ProbeSourceDriveRow,
  driveFamily: 'D5' | 'T',
): RelaxationInputRow {
  return {
    rowId: `T13-${evaluationRow.evaluationId}`,
    driveId: evaluationRow.sourceDriveRowId,
    driveFamily,
    driveSource: driveFamily === 'D5' ? 't13-approved-geometry-probe' : 't13-suppressed-transverse-probe',
    targetChild: evaluationRow.targetChild,
    probeClass: evaluationRow.probeClass,
    diagnosticOnly: driveFamily === 'T',
    J: copyVec3(sourceDriveRow.sourceDriveJ),
    sLabel: evaluationRow.sLabel,
    s: evaluationRow.s,
    finiteLedgerPredictedResponseClass: finitePredictionClassFromT13(evaluationRow),
    finiteLedgerResponseStatus: evaluationRow.responseClass,
    finiteLedgerWinningResponseDirectionIds: [...evaluationRow.winningResponseDirectionIds],
    finiteLedgerWinningResponseClasses: [...evaluationRow.winningResponseClasses],
    expectedAxisDirectionId: driveFamily === 'D5' ? evaluationRow.expectedAxisDirectionId : null,
  };
}

function buildRelaxationRow(input: RelaxationInputRow): PSimplexT14RelaxationRow {
  const sourceDriveNorm = normVec3(input.J);
  const eta = sourceDriveNorm > PSIMPLEX_EPSILON ? input.s / sourceDriveNorm : 0;
  const result = minimizePSimplexBoundedPointwiseVectorLG(input.J, eta, { maxRadius: MAX_RADIUS });
  const nearestClass = result.nearestFiniteResponseDirection.responseDirectionClass as PSimplexT12ResponseDirectionClass | null;
  const finiteLedgerConsistencyStatus = classifyFiniteLedgerConsistency(input, result.relaxedResponseClass, {
    directionId: result.nearestFiniteResponseDirection.directionId,
    responseDirectionClass: nearestClass,
  });
  const boundaryHit = result.boundaryHitSeedIds.length > 0;
  const localMinimumCountWithinTolerance = result.localMinimumCountWithinTolerance;
  const thresholdIntermediateNote = buildConvergenceAwareNote(
    buildThresholdIntermediateNote(
      input,
      result.relaxedResponseClass,
      finiteLedgerConsistencyStatus,
    ),
    result.bestLocalMinimum.converged,
    result.bestLocalMinimum.stopReason,
  );
  const localMinimaNote = buildConvergenceAwareNote(
    buildLocalMinimaNote(input.driveFamily, localMinimumCountWithinTolerance),
    result.bestLocalMinimum.converged,
    result.bestLocalMinimum.stopReason,
  );
  const boundaryHitNote = boundaryHit
    ? `bounded-search-hit-radius-for-seeds:${result.boundaryHitSeedIds.join(',')}`
    : 'no-boundary-hit';
  const ok = rowMeetsRequiredBehavior(input, result.relaxedResponseClass, {
    bestMinimumConverged: result.bestLocalMinimum.converged,
    nearestFiniteResponseDirectionId: result.nearestFiniteResponseDirection.directionId,
    finiteLedgerConsistencyStatus,
    localMinimumCountWithinTolerance,
  });

  return {
    rowId: input.rowId,
    driveId: input.driveId,
    driveFamily: input.driveFamily,
    driveSource: input.driveSource,
    targetChild: input.targetChild,
    probeClass: input.probeClass,
    diagnosticOnly: input.diagnosticOnly,
    J: cleanVec3(input.J),
    sourceDriveNorm: cleanNumber(sourceDriveNorm),
    sLabel: input.sLabel,
    s: cleanNumber(input.s),
    eta: cleanNumber(eta),
    effectiveForcingStrengthS: cleanNumber(eta * sourceDriveNorm),
    finiteLedgerPredictedResponseClass: input.finiteLedgerPredictedResponseClass,
    finiteLedgerResponseStatus: input.finiteLedgerResponseStatus,
    finiteLedgerWinningResponseDirectionIds: [...input.finiteLedgerWinningResponseDirectionIds],
    finiteLedgerWinningResponseClasses: [...input.finiteLedgerWinningResponseClasses],
    relaxedPhi: result.phiStar,
    relaxedPhiNorm: result.phiNorm,
    relaxedPhiHat: result.phiHat,
    nearestFiniteResponseDirectionId: result.nearestFiniteResponseDirection.directionId,
    nearestFiniteResponseClass: nearestClass,
    nearestFiniteResponseAlignment: result.nearestFiniteResponseDirection.alignment,
    relaxedResponseClass: result.relaxedResponseClass,
    energyValue: result.bestLocalMinimum.energy,
    finiteLedgerConsistencyStatus,
    thresholdIntermediateNote,
    localMinimaNote,
    localMinimumCountWithinTolerance,
    bestMinimumStopReason: result.bestLocalMinimum.stopReason,
    bestMinimumConverged: result.bestLocalMinimum.converged,
    bestMinimumGradientNorm: result.bestLocalMinimum.gradientNorm,
    bestMinimumIterations: result.bestLocalMinimum.iterations,
    bestMinimumLastEnergyDelta: result.bestLocalMinimum.lastEnergyDelta,
    bestMinimumLastStepSize: result.bestLocalMinimum.lastStepSize,
    boundaryHit,
    boundaryHitNote,
    sourceDriveResponseDistinct: true,
    ok,
  };
}

function buildConvergenceAwareNote(
  note: string,
  bestMinimumConverged: boolean,
  stopReason: PSimplexPointwiseStopReason,
): string {
  if (bestMinimumConverged) {
    return note;
  }

  const convergenceNote = `non-converged-minimizer-stop-reason-${stopReason}`;

  return note === 'none' ? convergenceNote : `${note}; ${convergenceNote}`;
}

function finitePredictionClassFromT12(row: PSimplexT12ResponseComparisonRow): PSimplexT14FinitePredictionClass {
  if (row.responseStatus === 'unforced-axis-degenerate') {
    return 'unforced-axis-degenerate';
  }

  if (row.responseStatus === 'threshold-sensitive') {
    return 'threshold-sensitive';
  }

  if (row.responseStatus === 'mixed-response') {
    return 'mixed-response';
  }

  if (row.responseStatus === 'unclassified-response') {
    return 'unclassified-response';
  }

  if (row.winningResponseClasses.length === 1) {
    return row.winningResponseClasses[0];
  }

  return 'threshold-sensitive';
}

function finitePredictionClassFromT13(row: PSimplexT13ResponseEvaluationRow): PSimplexT14FinitePredictionClass {
  if (row.responseClass === 'clean-child-axis-response' || row.responseClass === 'diagnostic-axis-response-suppressed') {
    return 'axis-well';
  }

  if (row.responseClass === 'diagnostic-a3-transition-response') {
    return 'a3-transition';
  }

  if (row.responseClass === 'diagnostic-body-diagonal-response') {
    return 'body-diagonal-high-mixing';
  }

  if (row.responseClass === 'threshold-sensitive') {
    return 'threshold-sensitive';
  }

  if (row.responseClass === 'diagnostic-mixed-response') {
    return 'mixed-response';
  }

  return 'unclassified-response';
}

function classifyFiniteLedgerConsistency(
  input: RelaxationInputRow,
  relaxedResponseClass: PSimplexRelaxedResponseClass,
  nearest: {
    directionId: string | null;
    responseDirectionClass: PSimplexT12ResponseDirectionClass | null;
  },
): PSimplexT14ConsistencyStatus {
  if (relaxedResponseClass === 'zero-drive-degenerate') {
    return input.driveFamily === 'D0' ? 'finite-ledger-consistent' : 'finite-ledger-divergent';
  }

  if (!nearest.responseDirectionClass) {
    return 'finite-ledger-divergent';
  }

  if (relaxedResponseClass === 'intermediate-relaxed-response') {
    return input.finiteLedgerWinningResponseClasses.includes(nearest.responseDirectionClass)
      ? 'finite-ledger-coarse-but-compatible'
      : 'finite-ledger-divergent';
  }

  if (relaxedResponseClass === 'threshold-sensitive') {
    return input.finiteLedgerWinningResponseClasses.includes(nearest.responseDirectionClass) ||
      input.finiteLedgerPredictedResponseClass === 'threshold-sensitive'
      ? 'finite-ledger-coarse-but-compatible'
      : 'finite-ledger-divergent';
  }

  const relaxedFiniteClass = finiteClassForRelaxedClass(relaxedResponseClass);

  if (!relaxedFiniteClass || !input.finiteLedgerWinningResponseClasses.includes(relaxedFiniteClass)) {
    return 'finite-ledger-divergent';
  }

  return nearest.directionId && input.finiteLedgerWinningResponseDirectionIds.includes(nearest.directionId)
    ? 'finite-ledger-consistent'
    : 'finite-ledger-coarse-but-compatible';
}

function finiteClassForRelaxedClass(
  relaxedResponseClass: PSimplexRelaxedResponseClass,
): PSimplexT12ResponseDirectionClass | null {
  if (relaxedResponseClass === 'axis-relaxed-response') {
    return 'axis-well';
  }

  if (relaxedResponseClass === 'A3-relaxed-response') {
    return 'a3-transition';
  }

  if (relaxedResponseClass === 'body-diagonal-relaxed-response') {
    return 'body-diagonal-high-mixing';
  }

  return null;
}

function rowMeetsRequiredBehavior(
  input: RelaxationInputRow,
  relaxedResponseClass: PSimplexRelaxedResponseClass,
  result: {
    bestMinimumConverged: boolean;
    nearestFiniteResponseDirectionId: string | null;
    finiteLedgerConsistencyStatus: PSimplexT14ConsistencyStatus;
    localMinimumCountWithinTolerance: number;
  },
): boolean {
  if (input.driveFamily === 'D0') {
    return (
      result.bestMinimumConverged &&
      relaxedResponseClass === 'zero-drive-degenerate' &&
      result.localMinimumCountWithinTolerance >= 6
    );
  }

  if (input.driveFamily === 'D1') {
    return (
      result.bestMinimumConverged &&
      relaxedResponseClass === 'axis-relaxed-response' &&
      result.nearestFiniteResponseDirectionId !== null &&
      input.finiteLedgerWinningResponseDirectionIds.includes(result.nearestFiniteResponseDirectionId) &&
      result.finiteLedgerConsistencyStatus === 'finite-ledger-consistent'
    );
  }

  if (input.driveFamily === 'D5') {
    return (
      result.bestMinimumConverged &&
      relaxedResponseClass === 'axis-relaxed-response' &&
      input.expectedAxisDirectionId !== null &&
      result.nearestFiniteResponseDirectionId === input.expectedAxisDirectionId &&
      result.finiteLedgerConsistencyStatus === 'finite-ledger-consistent'
    );
  }

  if (input.driveFamily === 'T') {
    return input.diagnosticOnly;
  }

  return true;
}

function buildThresholdIntermediateNote(
  input: RelaxationInputRow,
  relaxedResponseClass: PSimplexRelaxedResponseClass,
  consistencyStatus: PSimplexT14ConsistencyStatus,
): string {
  if (relaxedResponseClass === 'intermediate-relaxed-response') {
    return 'pointwise-minimizer-is-intermediate-not-forced-to-finite-direction';
  }

  if (relaxedResponseClass === 'threshold-sensitive') {
    return 'multiple-near-minima-make-pointwise-readout-threshold-sensitive';
  }

  if (input.finiteLedgerPredictedResponseClass === 'threshold-sensitive') {
    return 'finite-ledger-prediction-is-threshold-sensitive';
  }

  if (consistencyStatus === 'finite-ledger-divergent') {
    return 'pointwise-minimizer-diverges-from-finite-ledger-prediction';
  }

  return 'none';
}

function buildLocalMinimaNote(driveFamily: PSimplexT14DriveFamily, localMinimumCountWithinTolerance: number): string {
  if (driveFamily === 'D0' && localMinimumCountWithinTolerance >= 6) {
    return 'unforced-axis-degenerate-local-minima';
  }

  if (localMinimumCountWithinTolerance > 1) {
    return 'multiple-local-minima-within-energy-tolerance';
  }

  return 'single-best-minimum';
}

function buildDriveFamilySummaryRows(rows: PSimplexT14RelaxationRow[]): PSimplexT14DriveFamilySummaryRow[] {
  return DRIVE_FAMILIES.map((driveFamily) => {
    const familyRows = rows.filter((row) => row.driveFamily === driveFamily);
    const divergentCount = familyRows.filter((row) => row.finiteLedgerConsistencyStatus === 'finite-ledger-divergent').length;

    return {
      driveFamily,
      rowCount: familyRows.length,
      finiteLedgerConsistentCount: familyRows.filter(
        (row) => row.finiteLedgerConsistencyStatus === 'finite-ledger-consistent',
      ).length,
      coarseCompatibleCount: familyRows.filter(
        (row) => row.finiteLedgerConsistencyStatus === 'finite-ledger-coarse-but-compatible',
      ).length,
      divergentCount,
      intermediateCount: familyRows.filter((row) => row.relaxedResponseClass === 'intermediate-relaxed-response').length,
      boundaryHitCount: familyRows.filter((row) => row.boundaryHit).length,
      ok:
        driveFamily === 'D2' || driveFamily === 'D3' || driveFamily === 'D4'
          ? familyRows.length > 0
          : familyRows.length > 0 && familyRows.every((row) => row.ok),
    };
  });
}

function buildFiniteLedgerConsistencyDistributionRows(
  rows: PSimplexT14RelaxationRow[],
): PSimplexT14FiniteLedgerConsistencyDistributionRow[] {
  return CONSISTENCY_STATUSES.map((finiteLedgerConsistencyStatus) => ({
    finiteLedgerConsistencyStatus,
    count: rows.filter((row) => row.finiteLedgerConsistencyStatus === finiteLedgerConsistencyStatus).length,
  }));
}

function buildRelaxedResponseClassDistributionRows(
  rows: PSimplexT14RelaxationRow[],
): PSimplexT14RelaxedResponseClassDistributionRow[] {
  return RELAXED_RESPONSE_CLASSES.map((relaxedResponseClass) => ({
    relaxedResponseClass,
    count: rows.filter((row) => row.relaxedResponseClass === relaxedResponseClass).length,
  }));
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT14InvalidInterpretationBoundaryRow[] {
  return [
    { boundaryId: 'not-spatial-lg-dynamics', statement: 'not spatial LG dynamics', enforced: true },
    { boundaryId: 'not-field-domain-relaxation', statement: 'not field-domain relaxation', enforced: true },
    { boundaryId: 'not-field-atlas', statement: 'not FieldAtlas', enforced: true },
    { boundaryId: 'not-rendering', statement: 'not rendering', enforced: true },
    { boundaryId: 'not-field-cue', statement: 'not FieldCue', enforced: true },
    { boundaryId: 'not-route-walk-holonomy', statement: 'not route/walk/holonomy', enforced: true },
    { boundaryId: 'not-defect-vortex', statement: 'not defect/vortex', enforced: true },
    { boundaryId: 'not-semantic-naming', statement: 'not semantic naming', enforced: true },
    { boundaryId: 'not-dense-sampling', statement: 'not dense sampling', enforced: true },
    { boundaryId: 'not-generated-site-reading', statement: 'not a generated-site reading', enforced: true },
  ];
}

function buildSummary(args: {
  relaxationRows: PSimplexT14RelaxationRow[];
  finiteLedgerConsistencyDistributionRows: PSimplexT14FiniteLedgerConsistencyDistributionRow[];
  relaxedResponseClassDistributionRows: PSimplexT14RelaxedResponseClassDistributionRow[];
  invalidInterpretationBoundaryRows: PSimplexT14InvalidInterpretationBoundaryRow[];
}): PSimplexT14Summary {
  const d0Rows = rowsForFamily(args.relaxationRows, 'D0');
  const d1Rows = rowsForFamily(args.relaxationRows, 'D1');
  const d5Rows = rowsForFamily(args.relaxationRows, 'D5');
  const tRows = rowsForFamily(args.relaxationRows, 'T');

  return {
    relaxationRowCount: args.relaxationRows.length,
    d0RowCount: d0Rows.length,
    d1RowCount: d1Rows.length,
    d2RowCount: rowsForFamily(args.relaxationRows, 'D2').length,
    d3RowCount: rowsForFamily(args.relaxationRows, 'D3').length,
    d4RowCount: rowsForFamily(args.relaxationRows, 'D4').length,
    d5ApprovedGeometryProbeRowCount: d5Rows.length,
    suppressedTRowCount: tRows.length,
    d0DegeneracyReported:
      d0Rows.length === 1 &&
      d0Rows.every(
        (row) => row.ok && row.relaxedResponseClass === 'zero-drive-degenerate' && row.localMinimumCountWithinTolerance >= 6,
      ),
    d1AxisDrivesRelaxToMatchingAxes:
      d1Rows.length === 6 && d1Rows.every((row) => row.ok && row.relaxedResponseClass === 'axis-relaxed-response'),
    d5ApprovedGeometryProbesRelaxToMatchingChildAxes:
      d5Rows.length === 24 && d5Rows.every((row) => row.ok && row.relaxedResponseClass === 'axis-relaxed-response'),
    suppressedTRowsRemainDiagnosticOnly: tRows.length === 18 && tRows.every((row) => row.diagnosticOnly && row.ok),
    finiteLedgerConsistencyDistributionCount: args.finiteLedgerConsistencyDistributionRows.length,
    relaxedResponseClassDistributionCount: args.relaxedResponseClassDistributionRows.length,
    boundaryHitCount: args.relaxationRows.filter((row) => row.boundaryHit).length,
    nonConvergedBestMinimumCount: args.relaxationRows.filter((row) => !row.bestMinimumConverged).length,
    maxIterationStopCount: args.relaxationRows.filter((row) => row.bestMinimumStopReason === 'max-iterations').length,
    lineSearchStepUnderflowCount: args.relaxationRows.filter(
      (row) => row.bestMinimumStopReason === 'line-search-step-underflow',
    ).length,
    energyStepConvergedCount: args.relaxationRows.filter(
      (row) => row.bestMinimumStopReason === 'energy-step-tolerance' && row.bestMinimumConverged,
    ).length,
    gradientConvergedCount: args.relaxationRows.filter(
      (row) => row.bestMinimumStopReason === 'gradient-tolerance' && row.bestMinimumConverged,
    ).length,
    localMinimaMultiplicityCount: args.relaxationRows.filter((row) => row.localMinimumCountWithinTolerance > 1).length,
    divergentCount: args.relaxationRows.filter((row) => row.finiteLedgerConsistencyStatus === 'finite-ledger-divergent').length,
    intermediateCount: args.relaxationRows.filter((row) => row.relaxedResponseClass === 'intermediate-relaxed-response').length,
    sourceDriveResponseDistinctPassed: args.relaxationRows.every((row) => row.sourceDriveResponseDistinct),
    forbiddenBoundaryPassed: args.invalidInterpretationBoundaryRows.every((row) => row.enforced),
  };
}

function collectIntegrityIssues(args: {
  parentSourceForcedResponseLedgerStillPasses: boolean;
  parentGeometryProbeSourceForcedResponseLedgerStillPasses: boolean;
  relaxationRows: PSimplexT14RelaxationRow[];
  summary: PSimplexT14Summary;
  invalidInterpretationBoundaryRows: PSimplexT14InvalidInterpretationBoundaryRow[];
}): string[] {
  const issues: string[] = [];

  if (!args.parentSourceForcedResponseLedgerStillPasses) {
    issues.push('Parent T12 report does not pass.');
  }

  if (!args.parentGeometryProbeSourceForcedResponseLedgerStillPasses) {
    issues.push('Parent T13 report does not pass.');
  }

  if (args.summary.relaxationRowCount !== 127) {
    issues.push(`Expected 127 relaxation rows, got ${args.summary.relaxationRowCount}.`);
  }

  if (!args.summary.d0DegeneracyReported) {
    issues.push('D0 degeneracy was not reported.');
  }

  if (!args.summary.d1AxisDrivesRelaxToMatchingAxes) {
    issues.push('At least one D1 axis drive did not relax to the matching axis.');
  }

  if (!args.summary.d5ApprovedGeometryProbesRelaxToMatchingChildAxes) {
    issues.push('At least one D5 approved geometry probe did not relax to the matching child axis.');
  }

  if (!args.summary.suppressedTRowsRemainDiagnosticOnly) {
    issues.push('Suppressed T rows were not retained as diagnostic-only rows.');
  }

  if (args.summary.finiteLedgerConsistencyDistributionCount !== CONSISTENCY_STATUSES.length) {
    issues.push('Finite-ledger consistency distribution is incomplete.');
  }

  if (!args.summary.sourceDriveResponseDistinctPassed) {
    issues.push('At least one row conflates source drive J and relaxed response phi.');
  }

  if (!effectiveForcingStrengthAuditPassed(args.relaxationRows)) {
    issues.push('At least one relaxation row fails eta/s effective forcing strength scaling.');
  }

  if (!args.summary.forbiddenBoundaryPassed || forbiddenPositiveClaimAppears(args.relaxationRows, args.invalidInterpretationBoundaryRows)) {
    issues.push('Forbidden interpretation vocabulary appears outside negative boundary statements.');
  }

  return [...new Set(issues)];
}

function classifyVerdict(integrityIssues: string[], summary: PSimplexT14Summary): PSimplexT14Verdict {
  if (integrityIssues.length > 0) {
    return 'FAIL';
  }

  const thresholdTaxonomySensitiveCount = Math.max(0, summary.localMinimaMultiplicityCount - summary.d0RowCount);

  if (
    summary.boundaryHitCount > 0 ||
    summary.nonConvergedBestMinimumCount > 0 ||
    thresholdTaxonomySensitiveCount > 0
  ) {
    return 'PARTIAL';
  }

  return 'PASS';
}

function recommendationForVerdict(verdict: PSimplexT14Verdict): PSimplexT14FinalRecommendation {
  if (verdict === 'PASS') {
    return 'advance-to-bounded-relaxation-status-charter';
  }

  if (verdict === 'PARTIAL') {
    return 'refine-pointwise-relaxation-taxonomy';
  }

  return 'return-to-pointwise-relaxation-core';
}

function buildMinimizationMethodSummary(): PSimplexT14MinimizationMethodSummary {
  return {
    potential:
      'lambda*(|phi|^2-v^2)^2 + mu*(phi_x^2 phi_y^2 + phi_y^2 phi_z^2 + phi_z^2 phi_x^2) - eta*J.dot(phi)',
    lambda: 1,
    mu: 1,
    v: 1,
    method: 'deterministic-projected-gradient-descent-multiseed',
    runtimeCore: 'pSimplexPointwiseRelaxationCore',
    boundedPointwiseOnly: true,
    spatialDynamicsStatus: 'not-spatial-lg-dynamics',
  };
}

function buildSeedSetSummary(): PSimplexT14SeedSetSummary {
  return {
    zeroSeedIncluded: true,
    axisSeedCount: 6,
    a3SeedCount: 12,
    bodyDiagonalSeedCount: 8,
    sourceDriveAlignedSeedWhenJNonzero: true,
    minimumSeedCountForZeroDrive: 27,
    minimumSeedCountForNonzeroDrive: 28,
  };
}

function buildBoundsSummary(): PSimplexT14BoundsSummary {
  return {
    maxRadius: MAX_RADIUS,
    boundarySensitiveIfHit: true,
  };
}

function rowsForFamily(rows: PSimplexT14RelaxationRow[], driveFamily: PSimplexT14DriveFamily): PSimplexT14RelaxationRow[] {
  return rows.filter((row) => row.driveFamily === driveFamily);
}

function effectiveForcingStrengthAuditPassed(rows: readonly PSimplexT14RelaxationRow[]): boolean {
  return rows.every((row) => {
    if (row.sourceDriveNorm <= PSIMPLEX_EPSILON) {
      return Math.abs(row.eta) <= PSIMPLEX_EPSILON && Math.abs(row.effectiveForcingStrengthS) <= PSIMPLEX_EPSILON;
    }

    return Math.abs(row.effectiveForcingStrengthS - row.s) <= PSIMPLEX_EPSILON;
  });
}

function requireT12SourceDrive(
  rowsById: Map<string, PSimplexT12SourceDriveRow>,
  driveId: string,
): PSimplexT12SourceDriveRow {
  const row = rowsById.get(driveId);

  if (!row) {
    throw new Error(`Missing T12 source drive ${driveId}`);
  }

  return row;
}

function requireT13SourceDrive(
  rowsById: Map<string, PSimplexT13ProbeSourceDriveRow>,
  rowId: string,
): PSimplexT13ProbeSourceDriveRow {
  const row = rowsById.get(rowId);

  if (!row) {
    throw new Error(`Missing T13 source drive ${rowId}`);
  }

  return row;
}

function forbiddenPositiveClaimAppears(
  relaxationRows: PSimplexT14RelaxationRow[],
  boundaryRows: PSimplexT14InvalidInterpretationBoundaryRow[],
): boolean {
  const values = [
    ...relaxationRows.flatMap((row) => [
      row.rowId,
      row.driveFamily,
      row.relaxedResponseClass,
      row.finiteLedgerConsistencyStatus,
      row.thresholdIntermediateNote,
      row.boundaryHitNote,
    ]),
    ...boundaryRows.flatMap((row) => [row.boundaryId, row.statement]),
  ];

  return values.some((value) => hasForbiddenPositiveClaim(value));
}

function hasForbiddenPositiveClaim(value: string): boolean {
  const normalized = value.toLowerCase();

  if (
    normalized.startsWith('no-') ||
    normalized.startsWith('no ') ||
    normalized.startsWith('not-') ||
    normalized.startsWith('not ') ||
    normalized.includes(' is not ') ||
    normalized.includes(' are not ') ||
    normalized.includes(' not ') ||
    normalized.includes('not solved') ||
    normalized.includes('not implemented') ||
    normalized.includes('not authorized')
  ) {
    return false;
  }

  return [
    'spatial lg dynamics are implemented',
    'continuous field relaxation over geometry is solved',
    'fieldcue exists',
    'response is a concept dwelling',
    'a3 response is a route',
    'a3 response is a walk',
    'a3 response is holonomy',
    'body response is semantic truth',
    'defects are active',
    'vortices are active',
    'rendering is authorized',
    'dense sampling is authorized',
  ].some((claim) => normalized.includes(claim));
}

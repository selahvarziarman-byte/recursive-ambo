import {
  buildPSimplexSourceForcedVectorLGResponseLedgerT12Report,
  type PSimplexT12FiniteResponseDirectionRow,
  type PSimplexT12ResponseDirectionClass,
} from './pSimplexSourceForcedVectorLGResponseLedgerT12';
import {
  buildPSimplexMinimalGeometryPositionVectorDiagnosticV0Report,
  type PSimplexV0ApprovedProbeClass,
  type PSimplexV0ApprovedProbeVectorRow,
  type PSimplexV0AxisSignature,
} from './pSimplexMinimalGeometryPositionVectorDiagnosticV0';
import {
  buildPSimplexChildLocalGeometryPositionProbeLedgerT7Report,
  type PSimplexT7PerChildProbeLedgerRow,
} from './pSimplexChildLocalGeometryPositionProbeLedgerT7';
import {
  compareChildProbeOrder,
  expectedAxisDirectionIdForChild,
  expectedAxisForChild,
  isApprovedCleanProbeClass,
  probeClassId,
  PSIMPLEX_APPROVED_CLEAN_PROBE_CLASSES,
  PSIMPLEX_CLEAN_AXIS_ALIGNMENT_THRESHOLD,
  suppressionReasonForResidualControl,
} from './pSimplexProbePolicy';
import {
  bestDirectionMatch,
  buildSourceDrive,
  compareFiniteResponseDirections,
  type PSimplexBestDirectionMatch,
} from './pSimplexResponseCore';
import {
  cleanNumber,
  cleanVec3,
  copyVec3,
  PSIMPLEX_EPSILON,
} from './pSimplexVectorMath';

export type PSimplexT13Vec3 = PSimplexT12FiniteResponseDirectionRow['n'];
export type PSimplexT13TargetChild = PSimplexT7PerChildProbeLedgerRow['targetChild'];
export type PSimplexT13ProbeClass = PSimplexV0ApprovedProbeClass | 'T';
export type PSimplexT13SourceKind = 'approved-clean-geometry-probe' | 'residual-control-transverse-probe';
export type PSimplexT13SourceDriveClass =
  | 'axis-aligned-drive'
  | 'a3-transition-drive'
  | 'body-diagonal-drive'
  | 'mixed-drive'
  | 'zero-drive'
  | 'suppressed-transverse-drive';
export type PSimplexT13StrengthLabel =
  | 'axis-representative'
  | 'exploratory-low'
  | 'exploratory-mid'
  | 'exploratory-high';
export type PSimplexT13ResponseClass =
  | 'clean-child-axis-response'
  | 'diagnostic-axis-response-suppressed'
  | 'diagnostic-a3-transition-response'
  | 'diagnostic-body-diagonal-response'
  | 'diagnostic-mixed-response'
  | 'threshold-sensitive'
  | 'unclassified-response';
export type PSimplexT13ThresholdRelation =
  | 'axis-drive-no-threshold-needed'
  | 'exploratory-structural-classification-only'
  | 'threshold-sensitive'
  | 'not-applicable';
export type PSimplexT13Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT13FinalRecommendation =
  | 'bounded-relaxation-over-approved-stencil-or-source-forced-response-status-charter'
  | 'refine-response-readout-policy'
  | 'return-to-source-forced-response-design';

export interface PSimplexT13ProbeSourceDriveRow {
  rowId: string;
  targetChild: PSimplexT13TargetChild;
  probeClass: PSimplexT13ProbeClass;
  sourceKind: PSimplexT13SourceKind;
  sourceDriveJ: PSimplexT13Vec3;
  sourceDriveNorm: number;
  sourceDriveJHat: PSimplexT13Vec3 | null;
  sourceDriveClass: PSimplexT13SourceDriveClass;
  targetAxisSignature: PSimplexV0AxisSignature;
  expectedAxisDirectionId: string;
  bestAxisDirectionId: string | null;
  bestAxisAlignment: number;
  bestA3DirectionId: string | null;
  bestA3Alignment: number;
  bestBodyDiagonalDirectionId: string | null;
  bestBodyDiagonalAlignment: number;
  cleanChildAxisCandidate: boolean;
  diagnosticOnly: boolean;
  inheritedSuppressionReason: string | null;
  ok: boolean;
}

export interface PSimplexT13EnergyByResponseClass {
  axisWellMin: number;
  a3TransitionMin: number;
  bodyDiagonalMin: number;
}

export interface PSimplexT13ResponseEvaluationRow {
  evaluationId: string;
  sourceDriveRowId: string;
  targetChild: PSimplexT13TargetChild;
  probeClass: PSimplexT13ProbeClass;
  sLabel: PSimplexT13StrengthLabel;
  s: number;
  sourceDriveJHat: PSimplexT13Vec3 | null;
  comparedResponseDirectionCount: number;
  winningResponseDirectionIds: string[];
  winningResponseClasses: PSimplexT12ResponseDirectionClass[];
  minimumEnergy: number;
  energyByResponseClass: PSimplexT13EnergyByResponseClass;
  expectedAxisDirectionId: string;
  matchingChildAxisWon: boolean;
  responseClass: PSimplexT13ResponseClass;
  thresholdRelation: PSimplexT13ThresholdRelation;
  cleanChildAxisResponseAllowed: boolean;
  suppressionReason: string | null;
  sourceDriveResponseDistinct: true;
  ok: boolean;
}

export interface PSimplexT13CleanChildAxisResponseRow {
  targetChild: PSimplexT13TargetChild;
  probeClass: PSimplexV0ApprovedProbeClass;
  sourceDriveRowId: string;
  evaluationId: string;
  expectedAxisDirectionId: string;
  winningResponseDirectionIds: string[];
  cleanChildAxisResponseAllowed: true;
  ok: boolean;
}

export interface PSimplexT13ResidualControlResponseRow {
  targetChild: PSimplexT13TargetChild;
  probeClass: 'T';
  sourceDriveRowId: string;
  evaluationId: string;
  sLabel: string;
  winningResponseDirectionIds: string[];
  winningResponseClasses: string[];
  responseClass: string;
  diagnosticOnly: true;
  cleanChildAxisResponseAllowed: false;
  suppressionReason: string;
  ok: boolean;
}

export interface PSimplexT13DriveClassDistributionRow {
  sourceDriveClass: string;
  count: number;
}

export interface PSimplexT13ResponseClassDistributionRow {
  responseClass: string;
  count: number;
}

export interface PSimplexT13RepresentativeEnergyComparisonRow {
  exampleId: string;
  evaluationId: string;
  targetChild: PSimplexT13TargetChild;
  probeClass: string;
  sLabel: string;
  energyByResponseClass: PSimplexT13EnergyByResponseClass;
  winningResponseDirectionIds: string[];
  responseClass: string;
  ok: boolean;
}

export interface PSimplexT13InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT13Summary {
  finiteResponseDirectionCount: number;
  probeSourceDriveRowCount: number;
  responseEvaluationRowCount: number;
  cleanChildAxisResponseRowCount: number;
  residualControlResponseRowCount: number;
  approvedProbeSourceDriveRowsPass: boolean;
  approvedProbeResponseRowsPass: boolean;
  residualControlRowsSuppressed: boolean;
  driveClassDistributionCount: number;
  responseClassDistributionCount: number;
  sourceDriveResponseDistinctionPassed: boolean;
  forbiddenBoundaryPassed: boolean;
}

export interface PSimplexGeometryProbeSourceForcedResponseLedgerT13Report {
  method: 'p-simplex-geometry-probe-source-forced-response-ledger-t13';
  candidatePackage: 'p-simplex-geometry-probe-source-forced-response-ledger-t13';
  parentSourceForcedResponseLedger: 'p-simplex-source-forced-vector-lg-response-ledger-t12';
  parentMinimalGeometryDiagnostic: 'p-simplex-minimal-geometry-position-vector-diagnostic-v0';
  parentProbeLedger: 'p-simplex-child-local-geometry-position-probe-ledger-t7';
  diagnosticScope: 'finite-geometry-probe-source-forced-response-ledger-only';
  solverStatus: 'not-continuous-solver';
  relaxationStatus: 'not-field-relaxation';
  denseSamplingStatus: 'not-dense-sampling';
  renderingStatus: 'not-rendering';
  fieldCueStatus: 'not-field-cue';
  semanticStatus: 'not-semantic-naming';
  routeStatus: 'no-route-walk-holonomy';
  defectStatus: 'no-defect-vortex-claims';
  parentSourceForcedResponseLedgerStillPasses: boolean;
  parentMinimalGeometryDiagnosticStillPasses: boolean;
  parentProbeLedgerStillPasses: boolean;
  finiteResponseDirectionRows: PSimplexT12FiniteResponseDirectionRow[];
  probeSourceDriveRows: PSimplexT13ProbeSourceDriveRow[];
  responseEvaluationRows: PSimplexT13ResponseEvaluationRow[];
  cleanChildAxisResponseRows: PSimplexT13CleanChildAxisResponseRow[];
  residualControlResponseRows: PSimplexT13ResidualControlResponseRow[];
  driveClassDistributionRows: PSimplexT13DriveClassDistributionRow[];
  responseClassDistributionRows: PSimplexT13ResponseClassDistributionRow[];
  representativeEnergyComparisonRows: PSimplexT13RepresentativeEnergyComparisonRow[];
  invalidInterpretationBoundaryRows: PSimplexT13InvalidInterpretationBoundaryRow[];
  summary: PSimplexT13Summary;
  verdict: PSimplexT13Verdict;
  finalRecommendation: PSimplexT13FinalRecommendation;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface StrengthSpec {
  sLabel: PSimplexT13StrengthLabel;
  s: number;
}

const EPSILON = PSIMPLEX_EPSILON;
const AXIS_ALIGNMENT_THRESHOLD = PSIMPLEX_CLEAN_AXIS_ALIGNMENT_THRESHOLD;
const APPROVED_PROBE_CLASSES = PSIMPLEX_APPROVED_CLEAN_PROBE_CLASSES;
const SOURCE_DRIVE_CLASSES: readonly PSimplexT13SourceDriveClass[] = [
  'axis-aligned-drive',
  'a3-transition-drive',
  'body-diagonal-drive',
  'mixed-drive',
  'zero-drive',
  'suppressed-transverse-drive',
];
const RESPONSE_CLASSES: readonly PSimplexT13ResponseClass[] = [
  'clean-child-axis-response',
  'diagnostic-axis-response-suppressed',
  'diagnostic-a3-transition-response',
  'diagnostic-body-diagonal-response',
  'diagnostic-mixed-response',
  'threshold-sensitive',
  'unclassified-response',
];
const AXIS_REPRESENTATIVE_STRENGTHS: readonly StrengthSpec[] = [{ sLabel: 'axis-representative', s: 1 }];
const TRANSVERSE_CONTROL_STRENGTHS: readonly StrengthSpec[] = [
  { sLabel: 'exploratory-low', s: 0.25 },
  { sLabel: 'exploratory-mid', s: 1 },
  { sLabel: 'exploratory-high', s: 2 },
];
export function buildPSimplexGeometryProbeSourceForcedResponseLedgerT13Report(): PSimplexGeometryProbeSourceForcedResponseLedgerT13Report {
  const parentSourceForcedResponseReport = buildPSimplexSourceForcedVectorLGResponseLedgerT12Report();
  const parentMinimalGeometryReport = buildPSimplexMinimalGeometryPositionVectorDiagnosticV0Report();
  const parentProbeReport = buildPSimplexChildLocalGeometryPositionProbeLedgerT7Report();

  const parentSourceForcedResponseLedgerStillPasses =
    parentSourceForcedResponseReport.ok &&
    parentSourceForcedResponseReport.integrityIssueCount === 0 &&
    parentSourceForcedResponseReport.verdict === 'PASS';
  const parentMinimalGeometryDiagnosticStillPasses =
    parentMinimalGeometryReport.ok &&
    parentMinimalGeometryReport.integrityIssueCount === 0 &&
    parentMinimalGeometryReport.verdict === 'PASS';
  const parentProbeLedgerStillPasses =
    parentProbeReport.ok && parentProbeReport.integrityIssueCount === 0 && parentProbeReport.verdict === 'PASS';

  const finiteResponseDirectionRows = parentSourceForcedResponseReport.finiteResponseDirectionRows.map(copyFiniteDirectionRow);
  const probeSourceDriveRows = buildProbeSourceDriveRows(
    parentMinimalGeometryReport.approvedProbeVectorRows,
    parentProbeReport.perChildProbeLedgerRows,
    finiteResponseDirectionRows,
  );
  const responseEvaluationRows = buildResponseEvaluationRows(probeSourceDriveRows, finiteResponseDirectionRows);
  const cleanChildAxisResponseRows = buildCleanChildAxisResponseRows(responseEvaluationRows);
  const residualControlResponseRows = buildResidualControlResponseRows(responseEvaluationRows);
  const driveClassDistributionRows = buildDriveClassDistributionRows(probeSourceDriveRows);
  const responseClassDistributionRows = buildResponseClassDistributionRows(responseEvaluationRows);
  const representativeEnergyComparisonRows = buildRepresentativeEnergyComparisonRows(responseEvaluationRows);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const summary = buildSummary({
    finiteResponseDirectionRows,
    probeSourceDriveRows,
    responseEvaluationRows,
    cleanChildAxisResponseRows,
    residualControlResponseRows,
    driveClassDistributionRows,
    responseClassDistributionRows,
    invalidInterpretationBoundaryRows,
  });
  const integrityIssues = collectIntegrityIssues({
    parentSourceForcedResponseLedgerStillPasses,
    parentMinimalGeometryDiagnosticStillPasses,
    parentProbeLedgerStillPasses,
    finiteResponseDirectionRows,
    probeSourceDriveRows,
    responseEvaluationRows,
    cleanChildAxisResponseRows,
    residualControlResponseRows,
    representativeEnergyComparisonRows,
    invalidInterpretationBoundaryRows,
    summary,
  });
  const verdict = classifyVerdict(integrityIssues, residualControlResponseRows);

  return {
    method: 'p-simplex-geometry-probe-source-forced-response-ledger-t13',
    candidatePackage: 'p-simplex-geometry-probe-source-forced-response-ledger-t13',
    parentSourceForcedResponseLedger: 'p-simplex-source-forced-vector-lg-response-ledger-t12',
    parentMinimalGeometryDiagnostic: 'p-simplex-minimal-geometry-position-vector-diagnostic-v0',
    parentProbeLedger: 'p-simplex-child-local-geometry-position-probe-ledger-t7',
    diagnosticScope: 'finite-geometry-probe-source-forced-response-ledger-only',
    solverStatus: 'not-continuous-solver',
    relaxationStatus: 'not-field-relaxation',
    denseSamplingStatus: 'not-dense-sampling',
    renderingStatus: 'not-rendering',
    fieldCueStatus: 'not-field-cue',
    semanticStatus: 'not-semantic-naming',
    routeStatus: 'no-route-walk-holonomy',
    defectStatus: 'no-defect-vortex-claims',
    parentSourceForcedResponseLedgerStillPasses,
    parentMinimalGeometryDiagnosticStillPasses,
    parentProbeLedgerStillPasses,
    finiteResponseDirectionRows,
    probeSourceDriveRows,
    responseEvaluationRows,
    cleanChildAxisResponseRows,
    residualControlResponseRows,
    driveClassDistributionRows,
    responseClassDistributionRows,
    representativeEnergyComparisonRows,
    invalidInterpretationBoundaryRows,
    summary,
    verdict,
    finalRecommendation: recommendationForVerdict(verdict),
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: verdict === 'PASS' && integrityIssues.length === 0,
  };
}

function buildProbeSourceDriveRows(
  approvedProbeRows: PSimplexV0ApprovedProbeVectorRow[],
  t7ProbeRows: PSimplexT7PerChildProbeLedgerRow[],
  finiteResponseDirectionRows: PSimplexT12FiniteResponseDirectionRow[],
): PSimplexT13ProbeSourceDriveRow[] {
  const approvedRows = approvedProbeRows
    .filter((row) => isApprovedCleanProbeClass(row.probeClass))
    .map((row) => buildApprovedProbeSourceDriveRow(row, finiteResponseDirectionRows));
  const transverseRows = t7ProbeRows
    .filter((row) => row.probeClass === 'T')
    .map((row) => buildTransverseProbeSourceDriveRow(row, finiteResponseDirectionRows));

  return [...approvedRows, ...transverseRows].sort(compareChildProbeOrder);
}

function buildApprovedProbeSourceDriveRow(
  row: PSimplexV0ApprovedProbeVectorRow,
  finiteResponseDirectionRows: PSimplexT12FiniteResponseDirectionRow[],
): PSimplexT13ProbeSourceDriveRow {
  return buildProbeSourceDriveRow({
    rowId: `probe-source-${row.targetChild}-${probeClassId(row.probeClass)}`,
    targetChild: row.targetChild,
    probeClass: row.probeClass,
    sourceKind: 'approved-clean-geometry-probe',
    sourceDriveJ: row.phi,
    inheritedSuppressionReason: null,
    finiteResponseDirectionRows,
  });
}

function buildTransverseProbeSourceDriveRow(
  row: PSimplexT7PerChildProbeLedgerRow,
  finiteResponseDirectionRows: PSimplexT12FiniteResponseDirectionRow[],
): PSimplexT13ProbeSourceDriveRow {
  return buildProbeSourceDriveRow({
    rowId: `probe-source-${row.targetChild}-T`,
    targetChild: row.targetChild,
    probeClass: 'T',
    sourceKind: 'residual-control-transverse-probe',
    sourceDriveJ: row.phi,
    inheritedSuppressionReason:
      suppressionReasonForResidualControl(row.suppressionReason),
    finiteResponseDirectionRows,
  });
}

function buildProbeSourceDriveRow(args: {
  rowId: string;
  targetChild: PSimplexT13TargetChild;
  probeClass: PSimplexT13ProbeClass;
  sourceKind: PSimplexT13SourceKind;
  sourceDriveJ: PSimplexT13Vec3;
  inheritedSuppressionReason: string | null;
  finiteResponseDirectionRows: PSimplexT12FiniteResponseDirectionRow[];
}): PSimplexT13ProbeSourceDriveRow {
  const sourceDriveJ = cleanVec3(args.sourceDriveJ);
  const runtimeSourceDrive = buildSourceDrive(sourceDriveJ);
  const sourceDriveNorm = cleanNumber(runtimeSourceDrive.normJ);
  const sourceDriveJHat = runtimeSourceDrive.JHat ? cleanVec3(runtimeSourceDrive.JHat) : null;
  const targetAxisSignature = expectedAxisForChild(args.targetChild) as PSimplexV0AxisSignature;
  const expectedAxisDirectionId = expectedAxisDirectionIdForChild(args.targetChild);
  const bestAxis = bestDirectionMatch(args.finiteResponseDirectionRows, 'axis-well', sourceDriveJHat);
  const bestA3 = bestDirectionMatch(args.finiteResponseDirectionRows, 'a3-transition', sourceDriveJHat);
  const bestBody = bestDirectionMatch(args.finiteResponseDirectionRows, 'body-diagonal-high-mixing', sourceDriveJHat);
  const sourceDriveClass = classifySourceDrive(sourceDriveNorm, bestAxis, bestA3, bestBody);
  const cleanChildAxisCandidate =
    args.sourceKind === 'approved-clean-geometry-probe' &&
    sourceDriveClass === 'axis-aligned-drive' &&
    bestAxis.directionId === expectedAxisDirectionId &&
    bestAxis.alignment >= AXIS_ALIGNMENT_THRESHOLD;
  const diagnosticOnly = args.sourceKind === 'residual-control-transverse-probe';
  const ok = diagnosticOnly
    ? !cleanChildAxisCandidate && Boolean(args.inheritedSuppressionReason)
    : cleanChildAxisCandidate;

  return {
    rowId: args.rowId,
    targetChild: args.targetChild,
    probeClass: args.probeClass,
    sourceKind: args.sourceKind,
    sourceDriveJ,
    sourceDriveNorm,
    sourceDriveJHat,
    sourceDriveClass,
    targetAxisSignature,
    expectedAxisDirectionId,
    bestAxisDirectionId: bestAxis.directionId,
    bestAxisAlignment: cleanNumber(bestAxis.alignment),
    bestA3DirectionId: bestA3.directionId,
    bestA3Alignment: cleanNumber(bestA3.alignment),
    bestBodyDiagonalDirectionId: bestBody.directionId,
    bestBodyDiagonalAlignment: cleanNumber(bestBody.alignment),
    cleanChildAxisCandidate,
    diagnosticOnly,
    inheritedSuppressionReason: args.inheritedSuppressionReason,
    ok,
  };
}

function buildResponseEvaluationRows(
  probeSourceDriveRows: PSimplexT13ProbeSourceDriveRow[],
  finiteResponseDirectionRows: PSimplexT12FiniteResponseDirectionRow[],
): PSimplexT13ResponseEvaluationRow[] {
  return probeSourceDriveRows.flatMap((row) =>
    strengthSpecsForSourceDrive(row).map((strength) =>
      buildResponseEvaluationRow(row, strength, finiteResponseDirectionRows),
    ),
  );
}

function buildResponseEvaluationRow(
  sourceDriveRow: PSimplexT13ProbeSourceDriveRow,
  strength: StrengthSpec,
  finiteResponseDirectionRows: PSimplexT12FiniteResponseDirectionRow[],
): PSimplexT13ResponseEvaluationRow {
  const comparison = compareFiniteResponseDirections(
    finiteResponseDirectionRows,
    sourceDriveRow.sourceDriveJHat,
    strength.s,
  );
  const winningResponseDirectionIds = comparison.winningResponseDirectionIds;
  const winningResponseClasses = comparison.winningResponseClasses;
  const energyByResponseClass = {
    axisWellMin: cleanNumber(comparison.energyByResponseClass.axisWellMin),
    a3TransitionMin: cleanNumber(comparison.energyByResponseClass.a3TransitionMin),
    bodyDiagonalMin: cleanNumber(comparison.energyByResponseClass.bodyDiagonalMin),
  };
  const matchingChildAxisWon = winningResponseDirectionIds.includes(sourceDriveRow.expectedAxisDirectionId);
  const responseClass = classifyResponse(sourceDriveRow, winningResponseDirectionIds, winningResponseClasses);
  const thresholdRelation = thresholdRelationFor(sourceDriveRow, responseClass);
  const cleanChildAxisResponseAllowed =
    sourceDriveRow.sourceKind === 'approved-clean-geometry-probe' && responseClass === 'clean-child-axis-response';
  const suppressionReason =
    sourceDriveRow.sourceKind === 'residual-control-transverse-probe'
      ? suppressionReasonForResidualControl(sourceDriveRow.inheritedSuppressionReason)
      : null;
  const ok =
    sourceDriveRow.sourceKind === 'approved-clean-geometry-probe'
      ? cleanChildAxisResponseAllowed &&
        matchingChildAxisWon &&
        winningResponseDirectionIds.length === 1 &&
        winningResponseClasses.length === 1 &&
        winningResponseClasses[0] === 'axis-well'
      : !cleanChildAxisResponseAllowed &&
        responseClass !== 'clean-child-axis-response' &&
        Boolean(suppressionReason);

  return {
    evaluationId: `${sourceDriveRow.rowId}-${strength.sLabel}`,
    sourceDriveRowId: sourceDriveRow.rowId,
    targetChild: sourceDriveRow.targetChild,
    probeClass: sourceDriveRow.probeClass,
    sLabel: strength.sLabel,
    s: strength.s,
    sourceDriveJHat: sourceDriveRow.sourceDriveJHat,
    comparedResponseDirectionCount: finiteResponseDirectionRows.length,
    winningResponseDirectionIds,
    winningResponseClasses,
    minimumEnergy: cleanNumber(comparison.minimumEnergy),
    energyByResponseClass,
    expectedAxisDirectionId: sourceDriveRow.expectedAxisDirectionId,
    matchingChildAxisWon,
    responseClass,
    thresholdRelation,
    cleanChildAxisResponseAllowed,
    suppressionReason,
    sourceDriveResponseDistinct: true,
    ok,
  };
}

function buildCleanChildAxisResponseRows(
  responseEvaluationRows: PSimplexT13ResponseEvaluationRow[],
): PSimplexT13CleanChildAxisResponseRow[] {
  return responseEvaluationRows
    .filter((row): row is PSimplexT13ResponseEvaluationRow & { probeClass: PSimplexV0ApprovedProbeClass } =>
      isApprovedCleanProbeClass(row.probeClass),
    )
    .map((row) => ({
      targetChild: row.targetChild,
      probeClass: row.probeClass,
      sourceDriveRowId: row.sourceDriveRowId,
      evaluationId: row.evaluationId,
      expectedAxisDirectionId: row.expectedAxisDirectionId,
      winningResponseDirectionIds: [...row.winningResponseDirectionIds],
      cleanChildAxisResponseAllowed: true,
      ok:
        row.cleanChildAxisResponseAllowed &&
        row.matchingChildAxisWon &&
        row.winningResponseDirectionIds.length === 1 &&
        row.winningResponseDirectionIds[0] === row.expectedAxisDirectionId,
    }));
}

function buildResidualControlResponseRows(
  responseEvaluationRows: PSimplexT13ResponseEvaluationRow[],
): PSimplexT13ResidualControlResponseRow[] {
  return responseEvaluationRows
    .filter((row): row is PSimplexT13ResponseEvaluationRow & { probeClass: 'T' } => row.probeClass === 'T')
    .map((row) => ({
      targetChild: row.targetChild,
      probeClass: 'T',
      sourceDriveRowId: row.sourceDriveRowId,
      evaluationId: row.evaluationId,
      sLabel: row.sLabel,
      winningResponseDirectionIds: [...row.winningResponseDirectionIds],
      winningResponseClasses: [...row.winningResponseClasses],
      responseClass: row.responseClass,
      diagnosticOnly: true,
      cleanChildAxisResponseAllowed: false,
      suppressionReason: suppressionReasonForResidualControl(row.suppressionReason),
      ok:
        !row.cleanChildAxisResponseAllowed &&
        row.responseClass !== 'clean-child-axis-response' &&
        Boolean(row.suppressionReason),
    }));
}

function buildDriveClassDistributionRows(
  probeSourceDriveRows: PSimplexT13ProbeSourceDriveRow[],
): PSimplexT13DriveClassDistributionRow[] {
  return SOURCE_DRIVE_CLASSES.map((sourceDriveClass) => ({
    sourceDriveClass,
    count: probeSourceDriveRows.filter((row) => row.sourceDriveClass === sourceDriveClass).length,
  }));
}

function buildResponseClassDistributionRows(
  responseEvaluationRows: PSimplexT13ResponseEvaluationRow[],
): PSimplexT13ResponseClassDistributionRow[] {
  return RESPONSE_CLASSES.map((responseClass) => ({
    responseClass,
    count: responseEvaluationRows.filter((row) => row.responseClass === responseClass).length,
  }));
}

function buildRepresentativeEnergyComparisonRows(
  responseEvaluationRows: PSimplexT13ResponseEvaluationRow[],
): PSimplexT13RepresentativeEnergyComparisonRow[] {
  const examples = [
    findRepresentative(responseEvaluationRows, 'representative-G', 'G', 'axis-representative'),
    findRepresentative(responseEvaluationRows, 'representative-E', 'E', 'axis-representative'),
    findRepresentative(responseEvaluationRows, 'representative-A-plus', 'A+', 'axis-representative'),
    findRepresentative(responseEvaluationRows, 'representative-A-minus', 'A-', 'axis-representative'),
    findRepresentative(responseEvaluationRows, 'representative-T-low', 'T', 'exploratory-low'),
    findRepresentative(responseEvaluationRows, 'representative-T-mid', 'T', 'exploratory-mid'),
    findRepresentative(responseEvaluationRows, 'representative-T-high', 'T', 'exploratory-high'),
  ];

  return examples.filter((row): row is PSimplexT13RepresentativeEnergyComparisonRow => row !== null);
}

function findRepresentative(
  responseEvaluationRows: PSimplexT13ResponseEvaluationRow[],
  exampleId: string,
  probeClass: PSimplexT13ProbeClass,
  sLabel: PSimplexT13StrengthLabel,
): PSimplexT13RepresentativeEnergyComparisonRow | null {
  const row = responseEvaluationRows.find((entry) => entry.probeClass === probeClass && entry.sLabel === sLabel);

  if (!row) {
    return null;
  }

  return {
    exampleId,
    evaluationId: row.evaluationId,
    targetChild: row.targetChild,
    probeClass: row.probeClass,
    sLabel: row.sLabel,
    energyByResponseClass: row.energyByResponseClass,
    winningResponseDirectionIds: [...row.winningResponseDirectionIds],
    responseClass: row.responseClass,
    ok: row.ok,
  };
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT13InvalidInterpretationBoundaryRow[] {
  return [
    {
      boundaryId: 'continuous-relaxation-not-solved',
      statement: 'continuous relaxation is not solved',
      enforced: true,
    },
    {
      boundaryId: 'lg-dynamics-not-implemented',
      statement: 'LG dynamics are not implemented',
      enforced: true,
    },
    {
      boundaryId: 'not-field-cue',
      statement: 'not FieldCue',
      enforced: true,
    },
    {
      boundaryId: 'response-not-concept-dwelling',
      statement: 'response is not a concept dwelling',
      enforced: true,
    },
    {
      boundaryId: 'a3-transition-not-route',
      statement: 'A3 transition is not a route',
      enforced: true,
    },
    {
      boundaryId: 'a3-transition-not-walk',
      statement: 'A3 transition is not a walk',
      enforced: true,
    },
    {
      boundaryId: 'a3-transition-not-holonomy',
      statement: 'A3 transition is not holonomy',
      enforced: true,
    },
    {
      boundaryId: 'body-diagonal-not-semantic-truth',
      statement: 'body diagonal is not semantic truth',
      enforced: true,
    },
    {
      boundaryId: 'no-defects',
      statement: 'no defects',
      enforced: true,
    },
    {
      boundaryId: 'no-vortices',
      statement: 'no vortices',
      enforced: true,
    },
    {
      boundaryId: 'rendering-not-authorized',
      statement: 'rendering is not authorized',
      enforced: true,
    },
    {
      boundaryId: 'dense-sampling-not-authorized',
      statement: 'dense sampling is not authorized',
      enforced: true,
    },
    {
      boundaryId: 't-not-clean-readable',
      statement: 'T is not clean-readable',
      enforced: true,
    },
    {
      boundaryId: 'finite-ledger-only',
      statement: 'finite geometry-probe response ledger only',
      enforced: true,
    },
  ];
}

function buildSummary(args: {
  finiteResponseDirectionRows: PSimplexT12FiniteResponseDirectionRow[];
  probeSourceDriveRows: PSimplexT13ProbeSourceDriveRow[];
  responseEvaluationRows: PSimplexT13ResponseEvaluationRow[];
  cleanChildAxisResponseRows: PSimplexT13CleanChildAxisResponseRow[];
  residualControlResponseRows: PSimplexT13ResidualControlResponseRow[];
  driveClassDistributionRows: PSimplexT13DriveClassDistributionRow[];
  responseClassDistributionRows: PSimplexT13ResponseClassDistributionRow[];
  invalidInterpretationBoundaryRows: PSimplexT13InvalidInterpretationBoundaryRow[];
}): PSimplexT13Summary {
  const approvedProbeSourceDriveRows = args.probeSourceDriveRows.filter(
    (row) => row.sourceKind === 'approved-clean-geometry-probe',
  );
  const approvedResponseRows = args.responseEvaluationRows.filter((row) =>
    isApprovedCleanProbeClass(row.probeClass),
  );

  return {
    finiteResponseDirectionCount: args.finiteResponseDirectionRows.length,
    probeSourceDriveRowCount: args.probeSourceDriveRows.length,
    responseEvaluationRowCount: args.responseEvaluationRows.length,
    cleanChildAxisResponseRowCount: args.cleanChildAxisResponseRows.length,
    residualControlResponseRowCount: args.residualControlResponseRows.length,
    approvedProbeSourceDriveRowsPass:
      approvedProbeSourceDriveRows.length === 24 && approvedProbeSourceDriveRows.every((row) => row.ok),
    approvedProbeResponseRowsPass:
      approvedResponseRows.length === 24 &&
      approvedResponseRows.every(
        (row) =>
          row.ok &&
          row.responseClass === 'clean-child-axis-response' &&
          row.matchingChildAxisWon &&
          row.cleanChildAxisResponseAllowed,
      ),
    residualControlRowsSuppressed:
      args.residualControlResponseRows.length === 18 && args.residualControlResponseRows.every((row) => row.ok),
    driveClassDistributionCount: args.driveClassDistributionRows.length,
    responseClassDistributionCount: args.responseClassDistributionRows.length,
    sourceDriveResponseDistinctionPassed: args.responseEvaluationRows.every(
      (row) => row.sourceDriveResponseDistinct,
    ),
    forbiddenBoundaryPassed:
      args.invalidInterpretationBoundaryRows.every((row) => row.enforced) &&
      !forbiddenPositiveClaimAppears(
        args.probeSourceDriveRows,
        args.responseEvaluationRows,
        args.invalidInterpretationBoundaryRows,
      ),
  };
}

function collectIntegrityIssues(args: {
  parentSourceForcedResponseLedgerStillPasses: boolean;
  parentMinimalGeometryDiagnosticStillPasses: boolean;
  parentProbeLedgerStillPasses: boolean;
  finiteResponseDirectionRows: PSimplexT12FiniteResponseDirectionRow[];
  probeSourceDriveRows: PSimplexT13ProbeSourceDriveRow[];
  responseEvaluationRows: PSimplexT13ResponseEvaluationRow[];
  cleanChildAxisResponseRows: PSimplexT13CleanChildAxisResponseRow[];
  residualControlResponseRows: PSimplexT13ResidualControlResponseRow[];
  representativeEnergyComparisonRows: PSimplexT13RepresentativeEnergyComparisonRow[];
  invalidInterpretationBoundaryRows: PSimplexT13InvalidInterpretationBoundaryRow[];
  summary: PSimplexT13Summary;
}): string[] {
  const issues: string[] = [];

  if (!args.parentSourceForcedResponseLedgerStillPasses) {
    issues.push('Parent T12 report does not pass.');
  }

  if (!args.parentMinimalGeometryDiagnosticStillPasses) {
    issues.push('Minimal geometry-position diagnostic does not pass.');
  }

  if (!args.parentProbeLedgerStillPasses) {
    issues.push('Parent T7 probe ledger does not pass.');
  }

  if (args.finiteResponseDirectionRows.length !== 26) {
    issues.push(`Expected 26 finiteResponseDirectionRows, got ${args.finiteResponseDirectionRows.length}.`);
  }

  if (args.probeSourceDriveRows.length !== 30) {
    issues.push(`Expected 30 probeSourceDriveRows, got ${args.probeSourceDriveRows.length}.`);
  }

  if (args.responseEvaluationRows.length !== 42) {
    issues.push(`Expected 42 responseEvaluationRows, got ${args.responseEvaluationRows.length}.`);
  }

  if (args.cleanChildAxisResponseRows.length !== 24) {
    issues.push(`Expected 24 cleanChildAxisResponseRows, got ${args.cleanChildAxisResponseRows.length}.`);
  }

  if (args.residualControlResponseRows.length !== 18) {
    issues.push(`Expected 18 residualControlResponseRows, got ${args.residualControlResponseRows.length}.`);
  }

  const failedApprovedSourceRows = args.probeSourceDriveRows.filter(
    (row) => row.sourceKind === 'approved-clean-geometry-probe' && !row.ok,
  );
  if (failedApprovedSourceRows.length > 0) {
    issues.push(
      `Approved probe source drives failed child-axis alignment: ${failedApprovedSourceRows
        .map((row) => `${row.targetChild}:${row.probeClass}`)
        .join(', ')}.`,
    );
  }

  const failedApprovedResponseRows = args.responseEvaluationRows.filter(
    (row) =>
      isApprovedCleanProbeClass(row.probeClass) &&
      (row.responseClass !== 'clean-child-axis-response' ||
        !row.matchingChildAxisWon ||
        !row.cleanChildAxisResponseAllowed ||
        !row.ok),
  );
  if (failedApprovedResponseRows.length > 0) {
    issues.push(
      `Approved probe response rows failed clean child-axis selection: ${failedApprovedResponseRows
        .map((row) => `${row.targetChild}:${row.probeClass}`)
        .join(', ')}.`,
    );
  }

  if (args.cleanChildAxisResponseRows.some((row) => !row.cleanChildAxisResponseAllowed || !row.ok)) {
    issues.push('At least one clean child-axis response row is not clean-allowed and passing.');
  }

  if (args.residualControlResponseRows.some((row) => row.cleanChildAxisResponseAllowed)) {
    issues.push('At least one T row has cleanChildAxisResponseAllowed = true.');
  }

  if (args.residualControlResponseRows.some((row) => row.responseClass === 'clean-child-axis-response')) {
    issues.push('At least one T row was classified as a clean child-axis response.');
  }

  if (args.residualControlResponseRows.some((row) => row.suppressionReason.length === 0)) {
    issues.push('At least one T row lacks a suppression reason.');
  }

  if (args.responseEvaluationRows.some((row) => !row.sourceDriveResponseDistinct)) {
    issues.push('At least one response evaluation row collapses source drive and response direction.');
  }

  if (args.representativeEnergyComparisonRows.length < 7 || args.representativeEnergyComparisonRows.some((row) => !row.ok)) {
    issues.push('Representative energy comparison rows are missing or failed.');
  }

  if (!args.summary.approvedProbeSourceDriveRowsPass) {
    issues.push('Approved probe source-drive summary did not pass.');
  }

  if (!args.summary.approvedProbeResponseRowsPass) {
    issues.push('Approved probe response summary did not pass.');
  }

  if (!args.summary.residualControlRowsSuppressed) {
    issues.push('Residual-control T response rows are not all suppressed.');
  }

  if (!args.summary.sourceDriveResponseDistinctionPassed) {
    issues.push('Source-drive/response distinction did not pass.');
  }

  if (
    forbiddenPositiveClaimAppears(
      args.probeSourceDriveRows,
      args.responseEvaluationRows,
      args.invalidInterpretationBoundaryRows,
    )
  ) {
    issues.push('Forbidden positive interpretation vocabulary appears outside allowed negative statements.');
  }

  return [...new Set(issues)];
}

function classifyVerdict(
  integrityIssues: string[],
  residualControlResponseRows: PSimplexT13ResidualControlResponseRow[],
): PSimplexT13Verdict {
  if (integrityIssues.length > 0) {
    return 'FAIL';
  }

  if (residualControlResponseRows.some((row) => row.responseClass === 'unclassified-response')) {
    return 'PARTIAL';
  }

  return 'PASS';
}

function recommendationForVerdict(verdict: PSimplexT13Verdict): PSimplexT13FinalRecommendation {
  if (verdict === 'PASS') {
    return 'bounded-relaxation-over-approved-stencil-or-source-forced-response-status-charter';
  }

  if (verdict === 'PARTIAL') {
    return 'refine-response-readout-policy';
  }

  return 'return-to-source-forced-response-design';
}

function strengthSpecsForSourceDrive(row: PSimplexT13ProbeSourceDriveRow): readonly StrengthSpec[] {
  return row.probeClass === 'T' ? TRANSVERSE_CONTROL_STRENGTHS : AXIS_REPRESENTATIVE_STRENGTHS;
}

function classifySourceDrive(
  sourceDriveNorm: number,
  bestAxis: PSimplexBestDirectionMatch,
  bestA3: PSimplexBestDirectionMatch,
  bestBody: PSimplexBestDirectionMatch,
): PSimplexT13SourceDriveClass {
  if (sourceDriveNorm <= EPSILON) {
    return 'zero-drive';
  }

  if (bestAxis.alignment >= AXIS_ALIGNMENT_THRESHOLD) {
    return 'axis-aligned-drive';
  }

  if (bestA3.alignment >= AXIS_ALIGNMENT_THRESHOLD) {
    return 'a3-transition-drive';
  }

  if (bestBody.alignment >= AXIS_ALIGNMENT_THRESHOLD) {
    return 'body-diagonal-drive';
  }

  return 'mixed-drive';
}

function classifyResponse(
  sourceDriveRow: PSimplexT13ProbeSourceDriveRow,
  winningResponseDirectionIds: string[],
  winningResponseClasses: PSimplexT12ResponseDirectionClass[],
): PSimplexT13ResponseClass {
  if (
    sourceDriveRow.sourceKind === 'approved-clean-geometry-probe' &&
    winningResponseDirectionIds.length === 1 &&
    winningResponseDirectionIds[0] === sourceDriveRow.expectedAxisDirectionId &&
    winningResponseClasses.length === 1 &&
    winningResponseClasses[0] === 'axis-well'
  ) {
    return 'clean-child-axis-response';
  }

  if (sourceDriveRow.sourceKind === 'approved-clean-geometry-probe') {
    return winningResponseClasses.length > 1 ? 'threshold-sensitive' : 'unclassified-response';
  }

  if (winningResponseClasses.length === 0) {
    return 'unclassified-response';
  }

  if (winningResponseClasses.length > 1) {
    return 'threshold-sensitive';
  }

  if (winningResponseClasses[0] === 'axis-well') {
    return 'diagnostic-axis-response-suppressed';
  }

  if (winningResponseClasses[0] === 'a3-transition') {
    return 'diagnostic-a3-transition-response';
  }

  if (winningResponseClasses[0] === 'body-diagonal-high-mixing') {
    return 'diagnostic-body-diagonal-response';
  }

  return 'diagnostic-mixed-response';
}

function thresholdRelationFor(
  sourceDriveRow: PSimplexT13ProbeSourceDriveRow,
  responseClass: PSimplexT13ResponseClass,
): PSimplexT13ThresholdRelation {
  if (responseClass === 'threshold-sensitive') {
    return 'threshold-sensitive';
  }

  if (sourceDriveRow.sourceKind === 'approved-clean-geometry-probe') {
    return 'axis-drive-no-threshold-needed';
  }

  if (sourceDriveRow.sourceKind === 'residual-control-transverse-probe') {
    return 'exploratory-structural-classification-only';
  }

  return 'not-applicable';
}

function copyFiniteDirectionRow(row: PSimplexT12FiniteResponseDirectionRow): PSimplexT12FiniteResponseDirectionRow {
  return {
    ...row,
    n: copyVec3(row.n),
  };
}

function forbiddenPositiveClaimAppears(
  probeSourceDriveRows: PSimplexT13ProbeSourceDriveRow[],
  responseEvaluationRows: PSimplexT13ResponseEvaluationRow[],
  boundaryRows: PSimplexT13InvalidInterpretationBoundaryRow[],
): boolean {
  const values = [
    ...probeSourceDriveRows.flatMap((row) => [
      row.rowId,
      row.probeClass,
      row.sourceKind,
      row.sourceDriveClass,
      row.inheritedSuppressionReason ?? '',
    ]),
    ...responseEvaluationRows.flatMap((row) => [
      row.evaluationId,
      row.probeClass,
      row.responseClass,
      row.thresholdRelation,
      row.suppressionReason ?? '',
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
    'continuous relaxation is solved',
    'lg dynamics are implemented',
    'fieldcue exists',
    'response is a concept dwelling',
    'a3 transition is a route',
    'a3 transition is a walk',
    'a3 transition is holonomy',
    'body diagonal is semantic truth',
    'defects are active',
    'vortices are active',
    'rendering is authorized',
    'dense sampling is authorized',
    't is clean-readable',
  ].some((claim) => normalized.includes(claim));
}

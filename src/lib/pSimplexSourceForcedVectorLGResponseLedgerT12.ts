import {
  buildPSimplexA3ResidualDecompositionLedgerT10Report,
  type PSimplexT10ResidualDecompositionRow,
} from './pSimplexA3ResidualDecompositionLedgerT10';
import type { PSimplexT9Vec3 } from './pSimplexA3CuboctaOrientedDifferenceLedgerT9';
import {
  buildPSimplexVectorLGPotentialShapeLedgerT11Report,
  type PSimplexT11DirectionClassRow,
} from './pSimplexVectorLGPotentialShapeLedgerT11';
import {
  buildSourceDrive,
  compareFiniteResponseDirections,
  PSIMPLEX_A3_AXIS_TO_A3_THRESHOLD,
  PSIMPLEX_BODY_A3_TO_BODY_REFERENCE_THRESHOLD,
  PSIMPLEX_BODY_AXIS_TO_BODY_THRESHOLD,
  type PSimplexCandidateEnergy,
} from './pSimplexResponseCore';
import {
  cleanNumber,
  cleanVec3,
  copyVec3,
  dotVec3,
  nearlyEqual,
  PSIMPLEX_EPSILON,
} from './pSimplexVectorMath';
import {
  pSimplexAnisotropyTerm,
  PSIMPLEX_A3_ANISOTROPY,
  PSIMPLEX_AXIS_ANISOTROPY,
  PSIMPLEX_BODY_DIAGONAL_ANISOTROPY,
} from './pSimplexVectorLGCore';

export type PSimplexT12DriveCase = 'D0' | 'D1' | 'D2' | 'D3' | 'D4';
export type PSimplexT12DriveClass =
  | 'zero-drive'
  | 'axis-drive'
  | 'a3-root-drive'
  | 'body-diagonal-drive'
  | 'residual-composite-drive';
export type PSimplexT12DriveSource = 'literal' | 't11-direction-class' | 't10-r5-residual';
export type PSimplexT12ResponseDirectionClass =
  | 'axis-well'
  | 'a3-transition'
  | 'body-diagonal-high-mixing';
export type PSimplexT12ResponseDirectionSource =
  | 't11-axis-direction'
  | 't11-a3-cubocta-direction'
  | 't11-body-diagonal-direction';
export type PSimplexT12StrengthLabel =
  | 'zero'
  | 'weak'
  | 'threshold'
  | 'strong'
  | 'exploratory-low'
  | 'exploratory-mid'
  | 'exploratory-high';
export type PSimplexT12ResponseStatus =
  | 'unforced-axis-degenerate'
  | 'axis-locked-response'
  | 'axis-snap-under-weak-A3-drive'
  | 'A3-transition-selected-under-strong-drive'
  | 'axis-snap-under-weak-body-drive'
  | 'body-diagonal-selected-under-strong-drive'
  | 'mixed-response'
  | 'threshold-sensitive'
  | 'unclassified-response';
export type PSimplexT12Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT12FinalRecommendation =
  | 'define-local-response-statuses-for-approved-geometry-probes-or-bounded-relaxation-diagnostic'
  | 'refine-finite-direction-comparison-before-response-diagnostic'
  | 'return-to-potential-design';

export interface PSimplexT12FiniteResponseDirectionRow {
  responseDirectionId: string;
  responseDirectionClass: PSimplexT12ResponseDirectionClass;
  source: PSimplexT12ResponseDirectionSource;
  n: PSimplexT9Vec3;
  anisotropy: number;
  expectedAnisotropy: number;
  ok: boolean;
}

export interface PSimplexT12DriveCaseRow {
  driveCase: PSimplexT12DriveCase;
  description: string;
  driveCount: number;
  testedStrengthCount: number;
  expectedBehavior: string;
  ok: boolean;
}

export interface PSimplexT12SourceDriveRow {
  driveId: string;
  driveCase: PSimplexT12DriveCase;
  driveClass: PSimplexT12DriveClass;
  source: PSimplexT12DriveSource;
  J: PSimplexT9Vec3;
  JHat: PSimplexT9Vec3 | null;
  normJ: number;
  expectedStatusFamily: string;
  ok: boolean;
}

export interface PSimplexT12ResponseComparisonRow {
  comparisonId: string;
  driveId: string;
  driveCase: PSimplexT12DriveCase;
  driveClass: string;
  sLabel: PSimplexT12StrengthLabel;
  s: number;
  JHat: PSimplexT9Vec3 | null;
  comparedResponseDirectionCount: number;
  winningResponseDirectionIds: string[];
  winningResponseClasses: PSimplexT12ResponseDirectionClass[];
  minimumEnergy: number;
  energyByResponseClass: {
    axisWellMin: number;
    a3TransitionMin: number;
    bodyDiagonalMin: number;
  };
  responseStatus: PSimplexT12ResponseStatus;
  sourceDriveResponseDistinct: true;
  ok: boolean;
}

export interface PSimplexT12ThresholdEstimateRow {
  thresholdId:
    | 'a3-root-drive-axis-to-a3-threshold'
    | 'body-diagonal-drive-axis-to-body-threshold'
    | 'body-diagonal-drive-a3-to-body-reference-threshold';
  driveCase: 'D2' | 'D3';
  formula: string;
  value: number;
  expectedApproximation: number;
  verified: boolean;
  role: 'global-finite-response-threshold' | 'reference-threshold';
}

export interface PSimplexT12SourceDriveResponseDistinctionRow {
  distinctionId: string;
  statement: string;
  enforced: true;
  ok: boolean;
}

export interface PSimplexT12ResponseStatusDistributionRow {
  responseStatus: string;
  count: number;
}

export interface PSimplexT12InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT12Summary {
  finiteResponseDirectionCount: number;
  sourceDriveRowCount: number;
  responseComparisonRowCount: number;
  thresholdEstimateRowCount: number;
  zeroDriveRowsPass: boolean;
  axisDriveRowsPass: boolean;
  a3DriveRowsPass: boolean;
  bodyDriveRowsPass: boolean;
  residualCompositeDriveRowsClassified: boolean;
  sourceDriveResponseDistinctionPassed: boolean;
  forbiddenBoundaryPassed: boolean;
}

export interface PSimplexSourceForcedVectorLGResponseLedgerT12Report {
  method: 'p-simplex-source-forced-vector-lg-response-ledger-t12';
  candidatePackage: 'p-simplex-source-forced-vector-lg-response-ledger-t12';
  parentPotentialShapeLedger: 'p-simplex-vector-lg-potential-shape-ledger-t11';
  parentResidualLedger: 'p-simplex-a3-residual-decomposition-ledger-t10';
  diagnosticScope: 'finite-source-forced-response-shape-ledger-only';
  responseModelStatus: 'finite-candidate-direction-comparison';
  solverStatus: 'not-continuous-solver';
  relaxationStatus: 'not-field-relaxation';
  denseSamplingStatus: 'not-dense-sampling';
  renderingStatus: 'not-rendering';
  fieldCueStatus: 'not-field-cue';
  semanticStatus: 'not-semantic-naming';
  routeStatus: 'no-route-walk-holonomy';
  defectStatus: 'no-defect-vortex-claims';
  parentPotentialShapeLedgerStillPasses: boolean;
  parentResidualLedgerStillPasses: boolean;
  finiteResponseDirectionRows: PSimplexT12FiniteResponseDirectionRow[];
  driveCaseRows: PSimplexT12DriveCaseRow[];
  sourceDriveRows: PSimplexT12SourceDriveRow[];
  responseComparisonRows: PSimplexT12ResponseComparisonRow[];
  thresholdEstimateRows: PSimplexT12ThresholdEstimateRow[];
  sourceDriveResponseDistinctionRows: PSimplexT12SourceDriveResponseDistinctionRow[];
  responseStatusDistributionRows: PSimplexT12ResponseStatusDistributionRow[];
  invalidInterpretationBoundaryRows: PSimplexT12InvalidInterpretationBoundaryRow[];
  summary: PSimplexT12Summary;
  verdict: PSimplexT12Verdict;
  finalRecommendation: PSimplexT12FinalRecommendation;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface StrengthSpec {
  sLabel: PSimplexT12StrengthLabel;
  s: number;
}

type CandidateEnergy = PSimplexCandidateEnergy<PSimplexT12FiniteResponseDirectionRow>;

const EPSILON = PSIMPLEX_EPSILON;
const AXIS_ANISOTROPY = PSIMPLEX_AXIS_ANISOTROPY;
const A3_ANISOTROPY = PSIMPLEX_A3_ANISOTROPY;
const BODY_DIAGONAL_ANISOTROPY = PSIMPLEX_BODY_DIAGONAL_ANISOTROPY;
const S_A3 = PSIMPLEX_A3_AXIS_TO_A3_THRESHOLD;
const S_BODY_GLOBAL = PSIMPLEX_BODY_AXIS_TO_BODY_THRESHOLD;
const S_BODY_VS_A3 = PSIMPLEX_BODY_A3_TO_BODY_REFERENCE_THRESHOLD;
const RESPONSE_STATUSES: readonly PSimplexT12ResponseStatus[] = [
  'unforced-axis-degenerate',
  'axis-locked-response',
  'axis-snap-under-weak-A3-drive',
  'A3-transition-selected-under-strong-drive',
  'axis-snap-under-weak-body-drive',
  'body-diagonal-selected-under-strong-drive',
  'mixed-response',
  'threshold-sensitive',
  'unclassified-response',
];

export function buildPSimplexSourceForcedVectorLGResponseLedgerT12Report(): PSimplexSourceForcedVectorLGResponseLedgerT12Report {
  const parentPotentialReport = buildPSimplexVectorLGPotentialShapeLedgerT11Report();
  const parentResidualReport = buildPSimplexA3ResidualDecompositionLedgerT10Report();
  const parentPotentialShapeLedgerStillPasses =
    parentPotentialReport.ok &&
    parentPotentialReport.integrityIssueCount === 0 &&
    parentPotentialReport.verdict === 'PASS';
  const parentResidualLedgerStillPasses =
    parentResidualReport.ok &&
    parentResidualReport.integrityIssueCount === 0 &&
    parentResidualReport.verdict === 'PASS';
  const finiteResponseDirectionRows = buildFiniteResponseDirectionRows(parentPotentialReport.directionClassRows);
  const sourceDriveRows = buildSourceDriveRows(finiteResponseDirectionRows, parentResidualReport.residualDecompositionRows);
  const thresholdEstimateRows = buildThresholdEstimateRows();
  const responseComparisonRows = buildResponseComparisonRows(sourceDriveRows, finiteResponseDirectionRows);
  const driveCaseRows = buildDriveCaseRows(sourceDriveRows, responseComparisonRows);
  const sourceDriveResponseDistinctionRows = buildSourceDriveResponseDistinctionRows();
  const responseStatusDistributionRows = buildResponseStatusDistributionRows(responseComparisonRows);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const summary = buildSummary({
    finiteResponseDirectionRows,
    sourceDriveRows,
    responseComparisonRows,
    thresholdEstimateRows,
    sourceDriveResponseDistinctionRows,
    invalidInterpretationBoundaryRows,
  });
  const integrityIssues = buildIntegrityIssues({
    parentPotentialShapeLedgerStillPasses,
    parentResidualLedgerStillPasses,
    finiteResponseDirectionRows,
    sourceDriveRows,
    responseComparisonRows,
    thresholdEstimateRows,
    driveCaseRows,
    sourceDriveResponseDistinctionRows,
    invalidInterpretationBoundaryRows,
    summary,
  });
  const verdict = classifyVerdict(integrityIssues, summary);
  const finalRecommendation = recommendationForVerdict(verdict);

  return {
    method: 'p-simplex-source-forced-vector-lg-response-ledger-t12',
    candidatePackage: 'p-simplex-source-forced-vector-lg-response-ledger-t12',
    parentPotentialShapeLedger: 'p-simplex-vector-lg-potential-shape-ledger-t11',
    parentResidualLedger: 'p-simplex-a3-residual-decomposition-ledger-t10',
    diagnosticScope: 'finite-source-forced-response-shape-ledger-only',
    responseModelStatus: 'finite-candidate-direction-comparison',
    solverStatus: 'not-continuous-solver',
    relaxationStatus: 'not-field-relaxation',
    denseSamplingStatus: 'not-dense-sampling',
    renderingStatus: 'not-rendering',
    fieldCueStatus: 'not-field-cue',
    semanticStatus: 'not-semantic-naming',
    routeStatus: 'no-route-walk-holonomy',
    defectStatus: 'no-defect-vortex-claims',
    parentPotentialShapeLedgerStillPasses,
    parentResidualLedgerStillPasses,
    finiteResponseDirectionRows,
    driveCaseRows,
    sourceDriveRows,
    responseComparisonRows,
    thresholdEstimateRows,
    sourceDriveResponseDistinctionRows,
    responseStatusDistributionRows,
    invalidInterpretationBoundaryRows,
    summary,
    verdict,
    finalRecommendation,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: verdict !== 'FAIL' && integrityIssues.length === 0,
  };
}

function buildFiniteResponseDirectionRows(
  t11Rows: PSimplexT11DirectionClassRow[],
): PSimplexT12FiniteResponseDirectionRow[] {
  return t11Rows.map((row) => {
    const responseDirectionClass = responseClassForT11Row(row);
    const source = responseSourceForT11Row(row);
    const expectedAnisotropy = expectedAnisotropyFor(responseDirectionClass);
    const anisotropy = pSimplexAnisotropyTerm(row.normalizedDirection);

    return {
      responseDirectionId: row.directionId,
      responseDirectionClass,
      source,
      n: copyVec3(row.normalizedDirection),
      anisotropy: cleanNumber(anisotropy),
      expectedAnisotropy: cleanNumber(expectedAnisotropy),
      ok: nearlyEqual(anisotropy, expectedAnisotropy),
    };
  });
}

function buildSourceDriveRows(
  responseRows: PSimplexT12FiniteResponseDirectionRow[],
  residualRows: PSimplexT10ResidualDecompositionRow[],
): PSimplexT12SourceDriveRow[] {
  const zeroDrive = buildSourceDriveRow({
    driveId: 'D0-zero-drive',
    driveCase: 'D0',
    driveClass: 'zero-drive',
    source: 'literal',
    J: [0, 0, 0],
    expectedStatusFamily: 'unforced-axis-degenerate',
  });
  const axisDrives = responseRows
    .filter((row) => row.responseDirectionClass === 'axis-well')
    .map((row) =>
      buildSourceDriveRow({
        driveId: `D1-${row.responseDirectionId}`,
        driveCase: 'D1',
        driveClass: 'axis-drive',
        source: 't11-direction-class',
        J: row.n,
        expectedStatusFamily: 'axis-locked-response',
      }),
    );
  const a3Drives = responseRows
    .filter((row) => row.responseDirectionClass === 'a3-transition')
    .map((row) =>
      buildSourceDriveRow({
        driveId: `D2-${row.responseDirectionId}`,
        driveCase: 'D2',
        driveClass: 'a3-root-drive',
        source: 't11-direction-class',
        J: row.n,
        expectedStatusFamily: 'weak-axis-threshold-tie-strong-a3',
      }),
    );
  const bodyDrives = responseRows
    .filter((row) => row.responseDirectionClass === 'body-diagonal-high-mixing')
    .map((row) =>
      buildSourceDriveRow({
        driveId: `D3-${row.responseDirectionId}`,
        driveCase: 'D3',
        driveClass: 'body-diagonal-drive',
        source: 't11-direction-class',
        J: row.n,
        expectedStatusFamily: 'weak-axis-threshold-tie-strong-body',
      }),
    );
  const residualCompositeDrives = residualRows
    .filter(
      (row) =>
        row.probeCase === 'R5' &&
        row.residualStatus === 'A3-root-composite-residual' &&
        row.residualMagnitude > EPSILON,
    )
    .map((row) =>
      buildSourceDriveRow({
        driveId: `D4-${row.rowId}`,
        driveCase: 'D4',
        driveClass: 'residual-composite-drive',
        source: 't10-r5-residual',
        J: row.residualVector,
        expectedStatusFamily: 'finite-composite-response-classification',
      }),
    );

  return [zeroDrive, ...axisDrives, ...a3Drives, ...bodyDrives, ...residualCompositeDrives];
}

function buildSourceDriveRow(args: {
  driveId: string;
  driveCase: PSimplexT12DriveCase;
  driveClass: PSimplexT12DriveClass;
  source: PSimplexT12DriveSource;
  J: PSimplexT9Vec3;
  expectedStatusFamily: string;
}): PSimplexT12SourceDriveRow {
  const sourceDrive = buildSourceDrive(args.J);

  return {
    driveId: args.driveId,
    driveCase: args.driveCase,
    driveClass: args.driveClass,
    source: args.source,
    J: cleanVec3(args.J),
    JHat: sourceDrive.JHat ? cleanVec3(sourceDrive.JHat) : null,
    normJ: cleanNumber(sourceDrive.normJ),
    expectedStatusFamily: args.expectedStatusFamily,
    ok:
      args.driveCase === 'D0'
        ? sourceDrive.normJ <= EPSILON && sourceDrive.JHat === null
        : sourceDrive.normJ > EPSILON && sourceDrive.JHat !== null,
  };
}

function buildThresholdEstimateRows(): PSimplexT12ThresholdEstimateRow[] {
  return [
    {
      thresholdId: 'a3-root-drive-axis-to-a3-threshold',
      driveCase: 'D2',
      formula: '(1/4)/(1-1/sqrt(2))',
      value: cleanNumber(S_A3),
      expectedApproximation: 0.853553390593,
      verified: nearlyEqual(S_A3, 0.853553390593, 1e-12),
      role: 'global-finite-response-threshold',
    },
    {
      thresholdId: 'body-diagonal-drive-axis-to-body-threshold',
      driveCase: 'D3',
      formula: '(1/3)/(1-1/sqrt(3))',
      value: cleanNumber(S_BODY_GLOBAL),
      expectedApproximation: 0.788675134595,
      verified: nearlyEqual(S_BODY_GLOBAL, 0.788675134595, 1e-12),
      role: 'global-finite-response-threshold',
    },
    {
      thresholdId: 'body-diagonal-drive-a3-to-body-reference-threshold',
      driveCase: 'D3',
      formula: '(1/12)/(1-sqrt(2/3))',
      value: cleanNumber(S_BODY_VS_A3),
      expectedApproximation: 0.454124145232,
      verified: nearlyEqual(S_BODY_VS_A3, 0.454124145232, 1e-12),
      role: 'reference-threshold',
    },
  ];
}

function buildResponseComparisonRows(
  driveRows: PSimplexT12SourceDriveRow[],
  responseRows: PSimplexT12FiniteResponseDirectionRow[],
): PSimplexT12ResponseComparisonRow[] {
  return driveRows.flatMap((driveRow) =>
    strengthsForDrive(driveRow.driveCase).map((strength) => buildResponseComparisonRow(driveRow, responseRows, strength)),
  );
}

function buildResponseComparisonRow(
  driveRow: PSimplexT12SourceDriveRow,
  responseRows: PSimplexT12FiniteResponseDirectionRow[],
  strength: StrengthSpec,
): PSimplexT12ResponseComparisonRow {
  const comparison = compareFiniteResponseDirections(responseRows, driveRow.JHat, strength.s, EPSILON * 10);
  const winners = comparison.winningEntries;
  const winningResponseDirectionIds = comparison.winningResponseDirectionIds;
  const winningResponseClasses = comparison.winningResponseClasses;
  const energyByResponseClass = comparison.energyByResponseClass;
  const responseStatus = classifyResponseStatus(driveRow, strength, winners);
  const ok = comparisonMatchesExpected(driveRow, strength, winners, responseStatus);

  return {
    comparisonId: `${driveRow.driveId}-${strength.sLabel}`,
    driveId: driveRow.driveId,
    driveCase: driveRow.driveCase,
    driveClass: driveRow.driveClass,
    sLabel: strength.sLabel,
    s: cleanNumber(strength.s),
    JHat: driveRow.JHat ? copyVec3(driveRow.JHat) : null,
    comparedResponseDirectionCount: responseRows.length,
    winningResponseDirectionIds,
    winningResponseClasses,
    minimumEnergy: cleanNumber(comparison.minimumEnergy),
    energyByResponseClass: {
      axisWellMin: cleanNumber(energyByResponseClass.axisWellMin),
      a3TransitionMin: cleanNumber(energyByResponseClass.a3TransitionMin),
      bodyDiagonalMin: cleanNumber(energyByResponseClass.bodyDiagonalMin),
    },
    responseStatus,
    sourceDriveResponseDistinct: true,
    ok,
  };
}

function strengthsForDrive(driveCase: PSimplexT12DriveCase): StrengthSpec[] {
  if (driveCase === 'D0') {
    return [{ sLabel: 'zero', s: 0 }];
  }

  if (driveCase === 'D1') {
    return [{ sLabel: 'strong', s: 1 }];
  }

  if (driveCase === 'D2') {
    return [
      { sLabel: 'weak', s: 0.5 * S_A3 },
      { sLabel: 'threshold', s: S_A3 },
      { sLabel: 'strong', s: 2 * S_A3 },
    ];
  }

  if (driveCase === 'D3') {
    return [
      { sLabel: 'weak', s: 0.5 * S_BODY_GLOBAL },
      { sLabel: 'threshold', s: S_BODY_GLOBAL },
      { sLabel: 'strong', s: 2 * S_BODY_GLOBAL },
    ];
  }

  return [
    { sLabel: 'exploratory-low', s: 0.25 },
    { sLabel: 'exploratory-mid', s: 1 },
    { sLabel: 'exploratory-high', s: 2 },
  ];
}

function classifyResponseStatus(
  driveRow: PSimplexT12SourceDriveRow,
  strength: StrengthSpec,
  winners: CandidateEnergy[],
): PSimplexT12ResponseStatus {
  const winningClasses = uniqueClasses(winners.map((entry) => entry.direction.responseDirectionClass));

  if (driveRow.driveCase === 'D0') {
    return 'unforced-axis-degenerate';
  }

  if (driveRow.driveCase === 'D1') {
    return 'axis-locked-response';
  }

  if (driveRow.driveCase === 'D2') {
    if (strength.sLabel === 'weak') {
      return 'axis-snap-under-weak-A3-drive';
    }

    if (strength.sLabel === 'threshold') {
      return 'threshold-sensitive';
    }

    return 'A3-transition-selected-under-strong-drive';
  }

  if (driveRow.driveCase === 'D3') {
    if (strength.sLabel === 'weak') {
      return 'axis-snap-under-weak-body-drive';
    }

    if (strength.sLabel === 'threshold') {
      return 'threshold-sensitive';
    }

    return 'body-diagonal-selected-under-strong-drive';
  }

  if (winners.length > 1 || winningClasses.length > 1) {
    return 'threshold-sensitive';
  }

  if (winningClasses[0] === 'axis-well') {
    return 'axis-snap-under-weak-A3-drive';
  }

  if (winningClasses[0] === 'a3-transition') {
    return 'A3-transition-selected-under-strong-drive';
  }

  if (winningClasses[0] === 'body-diagonal-high-mixing') {
    return 'body-diagonal-selected-under-strong-drive';
  }

  return 'unclassified-response';
}

function comparisonMatchesExpected(
  driveRow: PSimplexT12SourceDriveRow,
  strength: StrengthSpec,
  winners: CandidateEnergy[],
  responseStatus: PSimplexT12ResponseStatus,
): boolean {
  const winningClasses = uniqueClasses(winners.map((entry) => entry.direction.responseDirectionClass));

  if (driveRow.driveCase === 'D0') {
    return (
      responseStatus === 'unforced-axis-degenerate' &&
      winners.length === 6 &&
      winningClasses.length === 1 &&
      winningClasses[0] === 'axis-well'
    );
  }

  if (driveRow.driveCase === 'D1') {
    return (
      responseStatus === 'axis-locked-response' &&
      winners.length === 1 &&
      winningClasses[0] === 'axis-well' &&
      winnerMatchesDrive(winners[0].direction, driveRow)
    );
  }

  if (driveRow.driveCase === 'D2') {
    const hasMatchingA3 = winners.some(
      (entry) => entry.direction.responseDirectionClass === 'a3-transition' && winnerMatchesDrive(entry.direction, driveRow),
    );
    const axisWinnerCount = winners.filter((entry) => entry.direction.responseDirectionClass === 'axis-well').length;

    if (strength.sLabel === 'weak') {
      return responseStatus === 'axis-snap-under-weak-A3-drive' && axisWinnerCount === 2 && !hasMatchingA3;
    }

    if (strength.sLabel === 'threshold') {
      return responseStatus === 'threshold-sensitive' && axisWinnerCount === 2 && hasMatchingA3 && winners.length === 3;
    }

    return (
      responseStatus === 'A3-transition-selected-under-strong-drive' &&
      winners.length === 1 &&
      hasMatchingA3
    );
  }

  if (driveRow.driveCase === 'D3') {
    const hasMatchingBody = winners.some(
      (entry) =>
        entry.direction.responseDirectionClass === 'body-diagonal-high-mixing' &&
        winnerMatchesDrive(entry.direction, driveRow),
    );
    const axisWinnerCount = winners.filter((entry) => entry.direction.responseDirectionClass === 'axis-well').length;

    if (strength.sLabel === 'weak') {
      return responseStatus === 'axis-snap-under-weak-body-drive' && axisWinnerCount === 3 && !hasMatchingBody;
    }

    if (strength.sLabel === 'threshold') {
      return responseStatus === 'threshold-sensitive' && axisWinnerCount === 3 && hasMatchingBody && winners.length === 4;
    }

    return (
      responseStatus === 'body-diagonal-selected-under-strong-drive' &&
      winners.length === 1 &&
      hasMatchingBody
    );
  }

  return responseStatus !== 'unclassified-response' && winners.length > 0;
}

function winnerMatchesDrive(direction: PSimplexT12FiniteResponseDirectionRow, driveRow: PSimplexT12SourceDriveRow): boolean {
  return !!driveRow.JHat && Math.abs(dotVec3(direction.n, driveRow.JHat) - 1) <= EPSILON * 10;
}

function buildDriveCaseRows(
  sourceDriveRows: PSimplexT12SourceDriveRow[],
  comparisonRows: PSimplexT12ResponseComparisonRow[],
): PSimplexT12DriveCaseRow[] {
  return [
    buildDriveCaseRow('D0', 'Zero source drive.', 1, 1, 'six axis wells remain degenerate', sourceDriveRows, comparisonRows),
    buildDriveCaseRow('D1', 'Signed child-axis source drives.', 6, 1, 'matching axis well wins', sourceDriveRows, comparisonRows),
    buildDriveCaseRow('D2', 'A3/cubocta root source drives.', 12, 3, 'weak axis snap, threshold tie, strong A3 selection', sourceDriveRows, comparisonRows),
    buildDriveCaseRow('D3', 'Body-diagonal source drives.', 8, 3, 'weak axis snap, threshold tie, strong body selection', sourceDriveRows, comparisonRows),
    buildDriveCaseRow('D4', 'Composite residual source drives from T10 R5.', 6, 3, 'finite composite response classified without overclaim', sourceDriveRows, comparisonRows),
  ];
}

function buildDriveCaseRow(
  driveCase: PSimplexT12DriveCase,
  description: string,
  expectedDriveCount: number,
  expectedStrengthCount: number,
  expectedBehavior: string,
  sourceDriveRows: PSimplexT12SourceDriveRow[],
  comparisonRows: PSimplexT12ResponseComparisonRow[],
): PSimplexT12DriveCaseRow {
  const driveCount = sourceDriveRows.filter((row) => row.driveCase === driveCase).length;
  const caseComparisonRows = comparisonRows.filter((row) => row.driveCase === driveCase);
  const testedStrengthCount = new Set(caseComparisonRows.map((row) => row.sLabel)).size;

  return {
    driveCase,
    description,
    driveCount,
    testedStrengthCount,
    expectedBehavior,
    ok:
      driveCount === expectedDriveCount &&
      testedStrengthCount === expectedStrengthCount &&
      caseComparisonRows.length === expectedDriveCount * expectedStrengthCount &&
      caseComparisonRows.every((row) => row.ok),
  };
}

function buildSourceDriveResponseDistinctionRows(): PSimplexT12SourceDriveResponseDistinctionRow[] {
  return [
    {
      distinctionId: 'source-drive-j',
      statement: 'J is the raw constructed source drive.',
      enforced: true,
      ok: true,
    },
    {
      distinctionId: 'response-variable-phi',
      statement: 'phi is the local response variable.',
      enforced: true,
      ok: true,
    },
    {
      distinctionId: 'finite-response-directions',
      statement: 'This ledger compares finite candidate response directions n, not continuous phi-star.',
      enforced: true,
      ok: true,
    },
    {
      distinctionId: 'no-continuous-relaxation-solver',
      statement: 'No continuous relaxation solver is implemented.',
      enforced: true,
      ok: true,
    },
  ];
}

function buildResponseStatusDistributionRows(
  rows: PSimplexT12ResponseComparisonRow[],
): PSimplexT12ResponseStatusDistributionRow[] {
  return RESPONSE_STATUSES.map((responseStatus) => ({
    responseStatus,
    count: rows.filter((row) => row.responseStatus === responseStatus).length,
  }));
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT12InvalidInterpretationBoundaryRow[] {
  return [
    { boundaryId: 'continuous-relaxation-not-solved', statement: 'continuous relaxation is not solved', enforced: true },
    { boundaryId: 'lg-dynamics-not-implemented', statement: 'LG dynamics are not implemented', enforced: true },
    { boundaryId: 'not-field-cue', statement: 'not FieldCue', enforced: true },
    { boundaryId: 'response-direction-not-concept-dwelling', statement: 'response direction is not a concept dwelling', enforced: true },
    { boundaryId: 'a3-transition-not-route', statement: 'A3 transition is not a route', enforced: true },
    { boundaryId: 'a3-transition-not-walk', statement: 'A3 transition is not a walk', enforced: true },
    { boundaryId: 'a3-transition-not-holonomy', statement: 'A3 transition is not holonomy', enforced: true },
    { boundaryId: 'body-diagonal-not-semantic-truth', statement: 'body diagonal is not semantic truth', enforced: true },
    { boundaryId: 'no-defects', statement: 'no defects', enforced: true },
    { boundaryId: 'no-vortices', statement: 'no vortices', enforced: true },
    { boundaryId: 'rendering-not-authorized', statement: 'rendering is not authorized', enforced: true },
    { boundaryId: 'dense-sampling-not-authorized', statement: 'dense sampling is not authorized', enforced: true },
    {
      boundaryId: 'finite-local-response-shape-ledger-only',
      statement: 'finite local response-shape ledger only',
      enforced: true,
    },
  ];
}

function buildSummary(args: {
  finiteResponseDirectionRows: PSimplexT12FiniteResponseDirectionRow[];
  sourceDriveRows: PSimplexT12SourceDriveRow[];
  responseComparisonRows: PSimplexT12ResponseComparisonRow[];
  thresholdEstimateRows: PSimplexT12ThresholdEstimateRow[];
  sourceDriveResponseDistinctionRows: PSimplexT12SourceDriveResponseDistinctionRow[];
  invalidInterpretationBoundaryRows: PSimplexT12InvalidInterpretationBoundaryRow[];
}): PSimplexT12Summary {
  return {
    finiteResponseDirectionCount: args.finiteResponseDirectionRows.length,
    sourceDriveRowCount: args.sourceDriveRows.length,
    responseComparisonRowCount: args.responseComparisonRows.length,
    thresholdEstimateRowCount: args.thresholdEstimateRows.length,
    zeroDriveRowsPass: comparisonRowsForCase(args.responseComparisonRows, 'D0').every((row) => row.ok),
    axisDriveRowsPass: comparisonRowsForCase(args.responseComparisonRows, 'D1').every((row) => row.ok),
    a3DriveRowsPass: comparisonRowsForCase(args.responseComparisonRows, 'D2').every((row) => row.ok),
    bodyDriveRowsPass: comparisonRowsForCase(args.responseComparisonRows, 'D3').every((row) => row.ok),
    residualCompositeDriveRowsClassified:
      comparisonRowsForCase(args.responseComparisonRows, 'D4').length === 18 &&
      comparisonRowsForCase(args.responseComparisonRows, 'D4').some((row) => row.responseStatus !== 'unclassified-response') &&
      comparisonRowsForCase(args.responseComparisonRows, 'D4').every((row) => row.ok),
    sourceDriveResponseDistinctionPassed:
      args.sourceDriveResponseDistinctionRows.length === 4 &&
      args.sourceDriveResponseDistinctionRows.every((row) => row.enforced && row.ok),
    forbiddenBoundaryPassed: args.invalidInterpretationBoundaryRows.every((row) => row.enforced),
  };
}

function buildIntegrityIssues(args: {
  parentPotentialShapeLedgerStillPasses: boolean;
  parentResidualLedgerStillPasses: boolean;
  finiteResponseDirectionRows: PSimplexT12FiniteResponseDirectionRow[];
  sourceDriveRows: PSimplexT12SourceDriveRow[];
  responseComparisonRows: PSimplexT12ResponseComparisonRow[];
  thresholdEstimateRows: PSimplexT12ThresholdEstimateRow[];
  driveCaseRows: PSimplexT12DriveCaseRow[];
  sourceDriveResponseDistinctionRows: PSimplexT12SourceDriveResponseDistinctionRow[];
  invalidInterpretationBoundaryRows: PSimplexT12InvalidInterpretationBoundaryRow[];
  summary: PSimplexT12Summary;
}): string[] {
  const issues: string[] = [];

  if (!args.parentPotentialShapeLedgerStillPasses) {
    issues.push('Parent T11 report does not pass.');
  }

  if (!args.parentResidualLedgerStillPasses) {
    issues.push('Parent T10 report does not pass.');
  }

  if (args.finiteResponseDirectionRows.length !== 26) {
    issues.push(`Expected 26 finiteResponseDirectionRows, got ${args.finiteResponseDirectionRows.length}.`);
  }

  if (args.finiteResponseDirectionRows.some((row) => !row.ok)) {
    issues.push('At least one finite response direction row failed anisotropy verification.');
  }

  if (args.sourceDriveRows.length !== 33) {
    issues.push(`Expected 33 sourceDriveRows, got ${args.sourceDriveRows.length}.`);
  }

  if (args.sourceDriveRows.some((row) => !row.ok)) {
    issues.push('At least one source drive row failed normalization validation.');
  }

  if (args.responseComparisonRows.length !== 85) {
    issues.push(`Expected 85 responseComparisonRows, got ${args.responseComparisonRows.length}.`);
  }

  if (args.thresholdEstimateRows.length !== 3 || args.thresholdEstimateRows.some((row) => !row.verified)) {
    issues.push('Threshold estimate rows are missing or unverified.');
  }

  if (!args.summary.zeroDriveRowsPass) {
    issues.push('D0 did not produce exactly six axis-well winners.');
  }

  if (!args.summary.axisDriveRowsPass) {
    issues.push('At least one D1 row did not select the matching axis.');
  }

  if (!args.summary.a3DriveRowsPass) {
    issues.push('At least one D2 A3-root drive row failed weak/threshold/strong expectations.');
  }

  if (!args.summary.bodyDriveRowsPass) {
    issues.push('At least one D3 body-diagonal drive row failed weak/threshold/strong expectations.');
  }

  if (!args.summary.residualCompositeDriveRowsClassified) {
    issues.push('D4 residual-composite drive rows were not classified without overclaim.');
  }

  if (args.driveCaseRows.length !== 5 || args.driveCaseRows.some((row) => !row.ok)) {
    issues.push('Drive case rows are missing or failed.');
  }

  if (!args.summary.sourceDriveResponseDistinctionPassed) {
    issues.push('Source-drive/response distinction rows are missing or unenforced.');
  }

  if (args.responseComparisonRows.some((row) => !row.sourceDriveResponseDistinct)) {
    issues.push('At least one response comparison row collapses source drive and response direction.');
  }

  if (
    forbiddenPositiveClaimAppears(
      args.sourceDriveRows,
      args.responseComparisonRows,
      args.sourceDriveResponseDistinctionRows,
      args.invalidInterpretationBoundaryRows,
    )
  ) {
    issues.push('Forbidden positive interpretation vocabulary appears outside allowed negative statements.');
  }

  return [...new Set(issues)];
}

function classifyVerdict(integrityIssues: string[], summary: PSimplexT12Summary): PSimplexT12Verdict {
  if (integrityIssues.length > 0) {
    return 'FAIL';
  }

  if (!summary.bodyDriveRowsPass || !summary.residualCompositeDriveRowsClassified) {
    return 'PARTIAL';
  }

  return 'PASS';
}

function recommendationForVerdict(verdict: PSimplexT12Verdict): PSimplexT12FinalRecommendation {
  if (verdict === 'PASS') {
    return 'define-local-response-statuses-for-approved-geometry-probes-or-bounded-relaxation-diagnostic';
  }

  if (verdict === 'PARTIAL') {
    return 'refine-finite-direction-comparison-before-response-diagnostic';
  }

  return 'return-to-potential-design';
}

function responseClassForT11Row(row: PSimplexT11DirectionClassRow): PSimplexT12ResponseDirectionClass {
  if (row.directionClass === 'axis') {
    return 'axis-well';
  }

  if (row.directionClass === 'a3-cubocta-root') {
    return 'a3-transition';
  }

  return 'body-diagonal-high-mixing';
}

function responseSourceForT11Row(row: PSimplexT11DirectionClassRow): PSimplexT12ResponseDirectionSource {
  if (row.directionClass === 'axis') {
    return 't11-axis-direction';
  }

  if (row.directionClass === 'a3-cubocta-root') {
    return 't11-a3-cubocta-direction';
  }

  return 't11-body-diagonal-direction';
}

function expectedAnisotropyFor(responseClass: PSimplexT12ResponseDirectionClass): number {
  if (responseClass === 'axis-well') {
    return AXIS_ANISOTROPY;
  }

  if (responseClass === 'a3-transition') {
    return A3_ANISOTROPY;
  }

  return BODY_DIAGONAL_ANISOTROPY;
}

function uniqueClasses(values: PSimplexT12ResponseDirectionClass[]): PSimplexT12ResponseDirectionClass[] {
  return [...new Set(values)];
}

function comparisonRowsForCase(
  rows: PSimplexT12ResponseComparisonRow[],
  driveCase: PSimplexT12DriveCase,
): PSimplexT12ResponseComparisonRow[] {
  return rows.filter((row) => row.driveCase === driveCase);
}

function forbiddenPositiveClaimAppears(
  sourceDriveRows: PSimplexT12SourceDriveRow[],
  comparisonRows: PSimplexT12ResponseComparisonRow[],
  distinctionRows: PSimplexT12SourceDriveResponseDistinctionRow[],
  boundaryRows: PSimplexT12InvalidInterpretationBoundaryRow[],
): boolean {
  const values = [
    ...sourceDriveRows.flatMap((row) => [
      row.driveId,
      row.driveCase,
      row.driveClass,
      row.source,
      row.expectedStatusFamily,
    ]),
    ...comparisonRows.flatMap((row) => [
      row.comparisonId,
      row.driveId,
      row.driveClass,
      row.responseStatus,
    ]),
    ...distinctionRows.flatMap((row) => [row.distinctionId, row.statement]),
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
    'response direction is a concept dwelling',
    'a3 transition is a route',
    'a3 transition is a walk',
    'a3 transition is holonomy',
    'body diagonal is semantic truth',
    'defects are active',
    'vortices are active',
    'rendering is authorized',
    'dense sampling is authorized',
  ].some((claim) => normalized.includes(claim));
}

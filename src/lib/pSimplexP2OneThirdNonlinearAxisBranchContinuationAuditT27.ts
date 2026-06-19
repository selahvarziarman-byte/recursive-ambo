import { buildPSimplexP2OneThirdGermSusceptibilityAxisWellResponseAuditT26Report } from './pSimplexP2OneThirdGermSusceptibilityAxisWellResponseAuditT26';
import {
  cleanNumber,
  cleanVec3,
  dotVec3,
  normVec3,
  normalizeVec3,
  PSIMPLEX_EPSILON,
  scaleVec3,
  type PSimplexVec3,
} from './pSimplexVectorMath';

export type PSimplexT27SummaryVerdict =
  | 'P2-one-third-nonlinear-axis-branch-confirmed'
  | 'P2-one-third-nonlinear-branch-confirmed-with-body-shadow-bound'
  | 'P2-one-third-body-shadow-too-early'
  | 'P2-one-third-branch-inconclusive'
  | 'P2-one-third-branch-unstable';
export type PSimplexT27BranchStatus = 'smooth-continuation' | 'branch-switch' | 'solver-failed';
export type PSimplexT27StabilityStatus =
  | 'local-minimum-full-3d'
  | 'local-minimum-plane-only-third-unstable'
  | 'unstable-branch';
export type PSimplexT27BodyShadowStatus =
  | 'axis-dominant-no-body-shadow'
  | 'body-shadow-warning'
  | 'body-near-regime';
export type PSimplexT27Classification =
  | 'axis-dominant-A3-susceptibility-branch'
  | 'linear-regime'
  | 'nonlinear-axis-dominant-regime'
  | 'not-response-closure';
export type PSimplexT27AcceptabilityStatus =
  | 'acceptable-as-nonlinear-axis-branch-germ'
  | 'acceptable-with-body-shadow-bound'
  | 'not-acceptable-body-shadow-too-early'
  | 'inconclusive';
export type PSimplexMatrix2 = [[number, number], [number, number]];

export interface PSimplexT27BoundaryStatuses {
  responseGroundingStatus: 'local-branch-only';
  A3ClosureStatus: 'not-closed-response';
  fieldCueStatus: 'not-fieldcue';
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  runtimeSubstrateStatus: 'not-runtime-substrate';
  bodyStatus: 'not-promoted';
  packetStatus: 'not-packet-interpretation';
  routeHolonomyStatus: 'not-route-walk-holonomy';
  defectVortexStatus: 'not-defect-vortex';
}

export interface PSimplexT27ParentEvidenceRow {
  ledgerId: 'T26' | 'T25-through-T26';
  verdict: string | null;
  summaryVerdict: string | null;
  ok: boolean;
  integrityIssueCount: number | null;
  carriedFact: string;
}

export interface PSimplexT27StationaryEquations {
  potential: 'V(a,b;eta)=(a*a+b*b-1)^2+a*a*b*b+b^4/4-eta*(a+b/3)';
  dVda: '4*a^3 + 6*a*b^2 - 4*a - eta';
  dVdb: '6*a^2*b + 5*b^3 - 4*b - eta/3';
  planeHessian: '[[12*a*a + 6*b*b - 4, 12*a*b], [12*a*b, 6*a*a + 15*b*b - 4]]';
  thirdTransverseEigenvalue: '6*a*a + 3*b*b - 4';
}

export interface PSimplexT27ThresholdConventionGuard {
  normalizedBodyShadowThreshold: number;
  coordinateBodyShadowThreshold: number;
  coordinateThresholdStatus: 'coordinate-convention-only';
  linearizedCrossingThresholdConvention: 'uses-normalized-body-shadow-threshold';
  ok: boolean;
}

export interface PSimplexT27LinearizedPrediction {
  aLin: number;
  bLin: number;
  ratioBALin: number;
}

export interface PSimplexT27PredictionDeviation {
  deltaA: number;
  deltaB: number;
  norm: number;
}

export interface PSimplexT27BranchRow {
  eta: number;
  a: number;
  b: number;
  ratioBA: number;
  phi: PSimplexVec3;
  energy: number;
  gradientNorm: number;
  planeHessian: PSimplexMatrix2;
  planeEigenvalues: [number, number];
  thirdTransverseEigenvalue: number;
  stabilityStatus: PSimplexT27StabilityStatus;
  axisAlignment: number;
  A3Alignment: number;
  bodyAlignment: number;
  normalizedBodyShadowThreshold: number;
  coordinateBodyShadowThreshold: number;
  bodyShadowStatus: PSimplexT27BodyShadowStatus;
  linearizedPrediction: PSimplexT27LinearizedPrediction;
  deviationFromLinearizedPrediction: PSimplexT27PredictionDeviation;
  relativeDeviationFromLinearizedPrediction: number;
  newtonIterations: number;
  newtonConverged: boolean;
  branchStatus: PSimplexT27BranchStatus;
  classifications: PSimplexT27Classification[];
  boundaryStatuses: PSimplexT27BoundaryStatuses;
  ok: boolean;
}

export interface PSimplexT27DenseScanSummary {
  scanStatus: 'completed' | 'failed';
  etaStart: 0;
  etaEnd: 8;
  etaStep: 0.05;
  denseRowCount: number;
  convergedRowCount: number;
  failedRowCount: number;
  maxRatioBA: number;
  maxRatioEta: number;
  minPlaneEigenvalue: number;
  minThirdTransverseEigenvalue: number;
  branchSwitchDetected: boolean;
  bodyShadowCrossingDetected: boolean;
  ok: boolean;
}

export interface PSimplexT27BodyShadowCrossingEstimate {
  normalizedBodyShadowThreshold: number;
  coordinateBodyShadowThreshold: number;
  coordinateThresholdStatus: 'coordinate-convention-only';
  linearizedCrossingEstimate: number;
  nonlinearCrossingEstimate: number | null;
  nonlinearCrossingStatus: 'no-crossing-in-tested-range' | 'crossing-detected';
  asymptoticPositiveBranchRatioBound: number;
  asymptoticRatioEquation: '15*r^3 - 6*r^2 + 18*r - 4 = 0';
  nonlinearPositiveBranchBodyShadowStatus:
    | 'no-finite-crossing-expected-for-positive-axis-branch'
    | 'finite-crossing-possible-for-positive-axis-branch';
  ok: boolean;
}

export interface PSimplexT27LinearVsNonlinearSummary {
  sampledEtaCount: number;
  maxDeviationNorm: number;
  maxDeviationEta: number;
  maxRelativeDeviation: number;
  maxRelativeDeviationEta: number;
  nonlinearBranchStatus: 'smooth-axis-dominant-through-sampled-range' | 'branch-problem-detected';
  ok: boolean;
}

export interface PSimplexT27StabilitySummary {
  sampledRowCount: number;
  full3dStableCount: number;
  planeOnlyStableCount: number;
  unstableCount: number;
  minPlaneEigenvalue: number;
  minThirdTransverseEigenvalue: number;
  status: 'stable-axis-dominant-branch-through-requested-range' | 'branch-stability-problem';
  ok: boolean;
}

export interface PSimplexT27AntipodalCovarianceRow {
  eta: number;
  phiChild: PSimplexVec3;
  phiAntipode: PSimplexVec3;
  vectorSum: PSimplexVec3;
  vectorSumNorm: number;
  covarianceStatus: 'holds' | 'fails';
  boundaryStatuses: PSimplexT27BoundaryStatuses;
  ok: boolean;
}

export interface PSimplexT27AntipodalCovarianceSummary {
  rowCount: number;
  holdsCount: number;
  failedCount: number;
  status: 'holds-by-signed-symmetry' | 'fails';
  ok: boolean;
}

export interface PSimplexT27GuardRow {
  guardId:
    | 'parentT26Preserved'
    | 'stationaryEquationsReported'
    | 'normalizedAndCoordinateThresholdsReported'
    | 'linearizedCrossingUsesNormalizedThreshold'
    | 'requestedEtaSamplesComplete'
    | 'denseScanCompleted'
    | 'newtonContinuationConverged'
    | 'positiveAxisBranchPreserved'
    | 'full3dLocalStabilityPreserved'
    | 'noBodyShadowCrossingThroughEta8'
    | 'asymptoticBoundBelowNormalizedThreshold'
    | 'antipodalCovarianceVerified'
    | 'responseClosureNotClaimed'
    | 'globalResponseGroundingNotClaimed'
    | 'fieldCueSemanticRouteDefectPacketTopologyBoundaryPreserved'
    | 'runtimeSubstrateNotAuthorized';
  status: 'pass' | 'fail';
  evidence: string;
  ok: boolean;
}

export interface PSimplexT27InvalidInterpretationBoundaryRow {
  boundaryId:
    | 'not-closed-A3-response'
    | 'not-global-response-grounding'
    | 'not-fieldcue-semantic-route-defect-packet-topology'
    | 'body-shadow-not-promoted-to-body'
    | 'not-runtime-substrate-extraction-or-adoption';
  statement: string;
  enforced: true;
}

export interface PSimplexT27Report {
  method: 'p-simplex-p2-one-third-nonlinear-axis-branch-continuation-audit-t27';
  candidatePackage: 'p-simplex-p2-one-third-nonlinear-axis-branch-continuation-audit-t27';
  diagnosticScope: 'p2-one-third-nonlinear-axis-branch-continuation-audit-only';
  parentEvidenceRows: PSimplexT27ParentEvidenceRow[];
  representativeChild: 'M_AB';
  branchConvention: {
    nAxis: PSimplexVec3;
    nA3: PSimplexVec3;
    phi: 'a*n_axis + b*n_A3 = (a,b/Math.sqrt(2),b/Math.sqrt(2))';
  };
  thresholdConventionGuard: PSimplexT27ThresholdConventionGuard;
  stationaryEquations: PSimplexT27StationaryEquations;
  branchRows: PSimplexT27BranchRow[];
  denseScanSummary: PSimplexT27DenseScanSummary;
  linearVsNonlinearSummary: PSimplexT27LinearVsNonlinearSummary;
  bodyShadowCrossingEstimate: PSimplexT27BodyShadowCrossingEstimate;
  stabilitySummary: PSimplexT27StabilitySummary;
  antipodalCovarianceRows: PSimplexT27AntipodalCovarianceRow[];
  antipodalCovarianceSummary: PSimplexT27AntipodalCovarianceSummary;
  p2OneThirdAcceptabilityStatus: PSimplexT27AcceptabilityStatus;
  remainingUnresolved: string[];
  guardRows: PSimplexT27GuardRow[];
  invalidInterpretationBoundaryRows: PSimplexT27InvalidInterpretationBoundaryRow[];
  summaryVerdict: PSimplexT27SummaryVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface NewtonSolution {
  eta: number;
  a: number;
  b: number;
  gradientNorm: number;
  iterations: number;
  converged: boolean;
}

interface DenseScanPoint {
  eta: number;
  a: number;
  b: number;
  ratioBA: number;
  gradientNorm: number;
  planeEigenvalues: [number, number];
  thirdTransverseEigenvalue: number;
  converged: boolean;
  branchSwitchDetected: boolean;
}

const N_AXIS: PSimplexVec3 = [1, 0, 0];
const N_A3: PSimplexVec3 = [0, 1 / Math.sqrt(2), 1 / Math.sqrt(2)];
const N_BODY: PSimplexVec3 = normalizeVec3([1, 1, 1]);
const NORMALIZED_BODY_SHADOW_RATIO = (Math.sqrt(3) - 1) / Math.sqrt(2);
const COORDINATE_BODY_SHADOW_RATIO = (Math.sqrt(3) - 1) / 2;
const LINEARIZED_CROSSING_ESTIMATE =
  NORMALIZED_BODY_SHADOW_RATIO / (1 / 6 - NORMALIZED_BODY_SHADOW_RATIO / 8);
const ETA_SAMPLES = [0, 0.25, 0.5, 1, 1.5, 2, 3, 4, 5, 5.076779295364, 6, 8] as const;
const NEWTON_TOLERANCE = 1e-11;
const NEWTON_MAX_ITERATIONS = 40;
const DENSE_SCAN_STEP = 0.05;
const ASYMPTOTIC_RATIO_EPSILON = 1e-12;

export function buildPSimplexP2OneThirdNonlinearAxisBranchContinuationAuditT27Report(): PSimplexT27Report {
  const parentT26Report = buildPSimplexP2OneThirdGermSusceptibilityAxisWellResponseAuditT26Report();
  const stationaryEquations = buildStationaryEquations();
  const thresholdConventionGuard = buildThresholdConventionGuard();
  const branchRows = buildBranchRows();
  const denseScan = runDenseScan();
  const denseScanSummary = buildDenseScanSummary(denseScan);
  const bodyShadowCrossingEstimate = buildBodyShadowCrossingEstimate(denseScan);
  const linearVsNonlinearSummary = buildLinearVsNonlinearSummary(branchRows);
  const stabilitySummary = buildStabilitySummary(branchRows);
  const antipodalCovarianceRows = buildAntipodalCovarianceRows(branchRows);
  const antipodalCovarianceSummary = buildAntipodalCovarianceSummary(antipodalCovarianceRows);
  const parentEvidenceRows = buildParentEvidenceRows(parentT26Report);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const guardRows = buildGuardRows({
    parentT26Report,
    stationaryEquations,
    thresholdConventionGuard,
    branchRows,
    denseScanSummary,
    bodyShadowCrossingEstimate,
    stabilitySummary,
    antipodalCovarianceSummary,
    invalidInterpretationBoundaryRows,
  });
  const integrityIssues = buildIntegrityIssues({
    parentEvidenceRows,
    branchRows,
    denseScanSummary,
    bodyShadowCrossingEstimate,
    linearVsNonlinearSummary,
    stabilitySummary,
    antipodalCovarianceSummary,
    guardRows,
  });
  const summaryVerdict = classifySummaryVerdict({
    integrityIssues,
    branchRows,
    bodyShadowCrossingEstimate,
    stabilitySummary,
  });
  const p2OneThirdAcceptabilityStatus = classifyAcceptabilityStatus(summaryVerdict);

  return {
    method: 'p-simplex-p2-one-third-nonlinear-axis-branch-continuation-audit-t27',
    candidatePackage: 'p-simplex-p2-one-third-nonlinear-axis-branch-continuation-audit-t27',
    diagnosticScope: 'p2-one-third-nonlinear-axis-branch-continuation-audit-only',
    parentEvidenceRows,
    representativeChild: 'M_AB',
    branchConvention: {
      nAxis: N_AXIS,
      nA3: cleanVec3(N_A3),
      phi: 'a*n_axis + b*n_A3 = (a,b/Math.sqrt(2),b/Math.sqrt(2))',
    },
    thresholdConventionGuard,
    stationaryEquations,
    branchRows,
    denseScanSummary,
    linearVsNonlinearSummary,
    bodyShadowCrossingEstimate,
    stabilitySummary,
    antipodalCovarianceRows,
    antipodalCovarianceSummary,
    p2OneThirdAcceptabilityStatus,
    remainingUnresolved: [
      'global response-sector classification',
      'A3 response closure',
      'runtime adoption',
      'semantic / FieldCue interpretation',
      'spatial coupling',
    ],
    guardRows,
    invalidInterpretationBoundaryRows,
    summaryVerdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: integrityIssues.length === 0 && summaryVerdict !== 'P2-one-third-branch-inconclusive' && summaryVerdict !== 'P2-one-third-branch-unstable',
  };
}

function buildBranchRows(): PSimplexT27BranchRow[] {
  const rows: PSimplexT27BranchRow[] = [];
  let previousSolution: NewtonSolution = {
    eta: 0,
    a: 1,
    b: 0,
    gradientNorm: 0,
    iterations: 0,
    converged: true,
  };
  let previousRatio = 0;

  for (const eta of ETA_SAMPLES) {
    const solution = eta === 0 ? previousSolution : solveStationaryPoint(eta, previousSolution);
    const row = buildBranchRow(solution, previousRatio);
    rows.push(row);
    previousSolution = solution;
    previousRatio = row.ratioBA;
  }

  return rows;
}

function buildBranchRow(solution: NewtonSolution, previousRatio: number): PSimplexT27BranchRow {
  const { eta, a, b } = solution;
  const ratioBA = a > PSIMPLEX_EPSILON ? cleanNumber(b / a) : Number.POSITIVE_INFINITY;
  const phi = cleanVec3([a, b / Math.sqrt(2), b / Math.sqrt(2)]);
  const planeHessian = hessianPlane(a, b);
  const planeEigenvalues = eigenvalues2x2(planeHessian);
  const thirdTransverseEigenvalue = cleanNumber(6 * a * a + 3 * b * b - 4);
  const stabilityStatus = classifyStability(planeEigenvalues, thirdTransverseEigenvalue);
  const normalizedPhi = normalizeVec3(phi);
  const axisAlignment = cleanNumber(dotVec3(normalizedPhi, N_AXIS));
  const A3Alignment = cleanNumber(dotVec3(normalizedPhi, N_A3));
  const bodyAlignment = cleanNumber(dotVec3(normalizedPhi, N_BODY));
  const linearizedPrediction = {
    aLin: cleanNumber(1 + eta / 8),
    bLin: cleanNumber(eta / 6),
    ratioBALin: cleanNumber((eta / 6) / (1 + eta / 8)),
  };
  const deviationFromLinearizedPrediction = {
    deltaA: cleanNumber(a - linearizedPrediction.aLin),
    deltaB: cleanNumber(b - linearizedPrediction.bLin),
    norm: cleanNumber(Math.hypot(a - linearizedPrediction.aLin, b - linearizedPrediction.bLin)),
  };
  const predictionNorm = Math.hypot(linearizedPrediction.aLin, linearizedPrediction.bLin);
  const relativeDeviationFromLinearizedPrediction = predictionNorm > PSIMPLEX_EPSILON
    ? cleanNumber(deviationFromLinearizedPrediction.norm / predictionNorm)
    : 0;
  const branchSwitchDetected = Math.abs(ratioBA - previousRatio) > 0.25 && eta > 0;
  const branchStatus = classifyBranchStatus(solution, branchSwitchDetected, a, b, stabilityStatus);
  const bodyShadowStatus = classifyBodyShadowStatus(ratioBA, axisAlignment, bodyAlignment);
  const classifications = buildClassifications(relativeDeviationFromLinearizedPrediction);
  const boundaryStatuses = buildBoundaryStatuses();
  const ok =
    solution.converged &&
    solution.gradientNorm <= NEWTON_TOLERANCE * 10 &&
    a > 0 &&
    b >= 0 &&
    stabilityStatus === 'local-minimum-full-3d' &&
    bodyShadowStatus === 'axis-dominant-no-body-shadow' &&
    branchStatus === 'smooth-continuation' &&
    boundaryStatusesPass(boundaryStatuses);

  return {
    eta: cleanNumber(eta),
    a: cleanNumber(a),
    b: cleanNumber(b),
    ratioBA,
    phi,
    energy: cleanNumber(energy(a, b, eta)),
    gradientNorm: cleanNumber(solution.gradientNorm),
    planeHessian,
    planeEigenvalues,
    thirdTransverseEigenvalue,
    stabilityStatus,
    axisAlignment,
    A3Alignment,
    bodyAlignment,
    normalizedBodyShadowThreshold: cleanNumber(NORMALIZED_BODY_SHADOW_RATIO),
    coordinateBodyShadowThreshold: cleanNumber(COORDINATE_BODY_SHADOW_RATIO),
    bodyShadowStatus,
    linearizedPrediction,
    deviationFromLinearizedPrediction,
    relativeDeviationFromLinearizedPrediction,
    newtonIterations: solution.iterations,
    newtonConverged: solution.converged,
    branchStatus,
    classifications,
    boundaryStatuses,
    ok,
  };
}

function solveStationaryPoint(eta: number, initial: NewtonSolution): NewtonSolution {
  let a = initial.a;
  let b = initial.b;
  let gradientNorm = Number.POSITIVE_INFINITY;

  for (let iteration = 1; iteration <= NEWTON_MAX_ITERATIONS; iteration += 1) {
    const gradient = stationaryGradient(a, b, eta);
    gradientNorm = Math.hypot(gradient[0], gradient[1]);

    if (gradientNorm <= NEWTON_TOLERANCE) {
      return {
        eta,
        a,
        b,
        gradientNorm,
        iterations: iteration - 1,
        converged: true,
      };
    }

    const hessian = hessianPlane(a, b);
    const determinant = hessian[0][0] * hessian[1][1] - hessian[0][1] * hessian[1][0];

    if (Math.abs(determinant) <= PSIMPLEX_EPSILON) {
      return { eta, a, b, gradientNorm, iterations: iteration, converged: false };
    }

    const stepA = (-gradient[0] * hessian[1][1] + hessian[0][1] * gradient[1]) / determinant;
    const stepB = (hessian[1][0] * gradient[0] - hessian[0][0] * gradient[1]) / determinant;
    let damping = 1;
    let nextA = a + damping * stepA;
    let nextB = b + damping * stepB;

    while ((nextA <= 0 || nextB < 0) && damping > 1 / 1024) {
      damping /= 2;
      nextA = a + damping * stepA;
      nextB = b + damping * stepB;
    }

    if (nextA <= 0 || nextB < 0) {
      return { eta, a, b, gradientNorm, iterations: iteration, converged: false };
    }

    a = nextA;
    b = nextB;
  }

  const finalGradient = stationaryGradient(a, b, eta);

  return {
    eta,
    a,
    b,
    gradientNorm: Math.hypot(finalGradient[0], finalGradient[1]),
    iterations: NEWTON_MAX_ITERATIONS,
    converged: false,
  };
}

function runDenseScan(): DenseScanPoint[] {
  const rows: DenseScanPoint[] = [];
  let previousSolution: NewtonSolution = {
    eta: 0,
    a: 1,
    b: 0,
    gradientNorm: 0,
    iterations: 0,
    converged: true,
  };
  let previousRatio = 0;

  for (let index = 0; index <= Math.round(8 / DENSE_SCAN_STEP); index += 1) {
    const eta = cleanNumber(index * DENSE_SCAN_STEP);
    const solution = eta === 0 ? previousSolution : solveStationaryPoint(eta, previousSolution);
    const ratioBA = solution.a > PSIMPLEX_EPSILON ? solution.b / solution.a : Number.POSITIVE_INFINITY;
    const planeEigenvalues = eigenvalues2x2(hessianPlane(solution.a, solution.b));
    const thirdTransverseEigenvalue = cleanNumber(6 * solution.a * solution.a + 3 * solution.b * solution.b - 4);
    const branchSwitchDetected = Math.abs(ratioBA - previousRatio) > 0.05 && eta > 0;

    rows.push({
      eta,
      a: solution.a,
      b: solution.b,
      ratioBA,
      gradientNorm: solution.gradientNorm,
      planeEigenvalues,
      thirdTransverseEigenvalue,
      converged: solution.converged,
      branchSwitchDetected,
    });
    previousSolution = solution;
    previousRatio = ratioBA;
  }

  return rows;
}

function buildDenseScanSummary(rows: readonly DenseScanPoint[]): PSimplexT27DenseScanSummary {
  const failedRows = rows.filter((row) => !row.converged || row.gradientNorm > NEWTON_TOLERANCE * 10);
  const maxRatioRow = rows.reduce((best, row) => (row.ratioBA > best.ratioBA ? row : best), rows[0]);
  const minPlaneEigenvalue = Math.min(...rows.flatMap((row) => row.planeEigenvalues));
  const minThirdTransverseEigenvalue = Math.min(...rows.map((row) => row.thirdTransverseEigenvalue));
  const bodyShadowCrossingDetected = rows.some((row) => row.ratioBA >= NORMALIZED_BODY_SHADOW_RATIO);
  const branchSwitchDetected = rows.some((row) => row.branchSwitchDetected);

  return {
    scanStatus: failedRows.length === 0 ? 'completed' : 'failed',
    etaStart: 0,
    etaEnd: 8,
    etaStep: 0.05,
    denseRowCount: rows.length,
    convergedRowCount: rows.length - failedRows.length,
    failedRowCount: failedRows.length,
    maxRatioBA: cleanNumber(maxRatioRow.ratioBA),
    maxRatioEta: cleanNumber(maxRatioRow.eta),
    minPlaneEigenvalue: cleanNumber(minPlaneEigenvalue),
    minThirdTransverseEigenvalue: cleanNumber(minThirdTransverseEigenvalue),
    branchSwitchDetected,
    bodyShadowCrossingDetected,
    ok: failedRows.length === 0 && !branchSwitchDetected && !bodyShadowCrossingDetected,
  };
}

function buildBodyShadowCrossingEstimate(rows: readonly DenseScanPoint[]): PSimplexT27BodyShadowCrossingEstimate {
  const nonlinearCrossingEstimate = estimateCrossing(rows);
  const asymptoticPositiveBranchRatioBound = positiveRootOfAsymptoticRatioEquation();
  const asymptoticBelowThreshold = asymptoticPositiveBranchRatioBound < NORMALIZED_BODY_SHADOW_RATIO;

  return {
    normalizedBodyShadowThreshold: cleanNumber(NORMALIZED_BODY_SHADOW_RATIO),
    coordinateBodyShadowThreshold: cleanNumber(COORDINATE_BODY_SHADOW_RATIO),
    coordinateThresholdStatus: 'coordinate-convention-only',
    linearizedCrossingEstimate: cleanNumber(LINEARIZED_CROSSING_ESTIMATE),
    nonlinearCrossingEstimate,
    nonlinearCrossingStatus: nonlinearCrossingEstimate === null ? 'no-crossing-in-tested-range' : 'crossing-detected',
    asymptoticPositiveBranchRatioBound: cleanNumber(asymptoticPositiveBranchRatioBound),
    asymptoticRatioEquation: '15*r^3 - 6*r^2 + 18*r - 4 = 0',
    nonlinearPositiveBranchBodyShadowStatus: asymptoticBelowThreshold
      ? 'no-finite-crossing-expected-for-positive-axis-branch'
      : 'finite-crossing-possible-for-positive-axis-branch',
    ok: nonlinearCrossingEstimate === null && asymptoticBelowThreshold,
  };
}

function buildLinearVsNonlinearSummary(rows: readonly PSimplexT27BranchRow[]): PSimplexT27LinearVsNonlinearSummary {
  const maxDeviationRow = rows.reduce((best, row) =>
    row.deviationFromLinearizedPrediction.norm > best.deviationFromLinearizedPrediction.norm ? row : best,
  );
  const maxRelativeDeviationRow = rows.reduce((best, row) =>
    row.relativeDeviationFromLinearizedPrediction > best.relativeDeviationFromLinearizedPrediction ? row : best,
  );
  const ok = rows.every((row) => row.ok);

  return {
    sampledEtaCount: rows.length,
    maxDeviationNorm: maxDeviationRow.deviationFromLinearizedPrediction.norm,
    maxDeviationEta: maxDeviationRow.eta,
    maxRelativeDeviation: maxRelativeDeviationRow.relativeDeviationFromLinearizedPrediction,
    maxRelativeDeviationEta: maxRelativeDeviationRow.eta,
    nonlinearBranchStatus: ok ? 'smooth-axis-dominant-through-sampled-range' : 'branch-problem-detected',
    ok,
  };
}

function buildStabilitySummary(rows: readonly PSimplexT27BranchRow[]): PSimplexT27StabilitySummary {
  const full3dStableCount = rows.filter((row) => row.stabilityStatus === 'local-minimum-full-3d').length;
  const planeOnlyStableCount = rows.filter((row) => row.stabilityStatus === 'local-minimum-plane-only-third-unstable').length;
  const unstableCount = rows.filter((row) => row.stabilityStatus === 'unstable-branch').length;
  const minPlaneEigenvalue = Math.min(...rows.flatMap((row) => row.planeEigenvalues));
  const minThirdTransverseEigenvalue = Math.min(...rows.map((row) => row.thirdTransverseEigenvalue));

  return {
    sampledRowCount: rows.length,
    full3dStableCount,
    planeOnlyStableCount,
    unstableCount,
    minPlaneEigenvalue: cleanNumber(minPlaneEigenvalue),
    minThirdTransverseEigenvalue: cleanNumber(minThirdTransverseEigenvalue),
    status:
      full3dStableCount === rows.length
        ? 'stable-axis-dominant-branch-through-requested-range'
        : 'branch-stability-problem',
    ok: full3dStableCount === rows.length,
  };
}

function buildAntipodalCovarianceRows(rows: readonly PSimplexT27BranchRow[]): PSimplexT27AntipodalCovarianceRow[] {
  return rows.map((row) => {
    const phiAntipode = cleanVec3(scaleVec3(row.phi, -1));
    const vectorSum = cleanVec3([
      row.phi[0] + phiAntipode[0],
      row.phi[1] + phiAntipode[1],
      row.phi[2] + phiAntipode[2],
    ]);
    const vectorSumNorm = cleanNumber(normVec3(vectorSum));
    const ok = vectorSumNorm <= PSIMPLEX_EPSILON;

    return {
      eta: row.eta,
      phiChild: row.phi,
      phiAntipode,
      vectorSum,
      vectorSumNorm,
      covarianceStatus: ok ? 'holds' : 'fails',
      boundaryStatuses: buildBoundaryStatuses(),
      ok,
    };
  });
}

function buildAntipodalCovarianceSummary(
  rows: readonly PSimplexT27AntipodalCovarianceRow[],
): PSimplexT27AntipodalCovarianceSummary {
  const holdsCount = rows.filter((row) => row.ok).length;
  const failedCount = rows.length - holdsCount;

  return {
    rowCount: rows.length,
    holdsCount,
    failedCount,
    status: failedCount === 0 ? 'holds-by-signed-symmetry' : 'fails',
    ok: failedCount === 0,
  };
}

function buildParentEvidenceRows(
  parentT26Report: ReturnType<typeof buildPSimplexP2OneThirdGermSusceptibilityAxisWellResponseAuditT26Report>,
): PSimplexT27ParentEvidenceRow[] {
  const t25Evidence = parentT26Report.parentEvidenceRows.find((row) => row.ledgerId === 'T25');

  return [
    {
      ledgerId: 'T26',
      verdict: parentT26Report.verdict,
      summaryVerdict: parentT26Report.summaryVerdict,
      ok:
        parentT26Report.ok &&
        parentT26Report.integrityIssueCount === 0 &&
        parentT26Report.summaryVerdict === 'P2-one-third-A3-susceptibility-confirmed',
      integrityIssueCount: parentT26Report.integrityIssueCount,
      carriedFact:
        'P2(1/3) local axis-well susceptibility was confirmed while A3 response closure and global response grounding remained unresolved.',
    },
    {
      ledgerId: 'T25-through-T26',
      verdict: t25Evidence?.verdict ?? null,
      summaryVerdict: t25Evidence?.summaryVerdict ?? null,
      ok: t25Evidence?.ok === true,
      integrityIssueCount: t25Evidence?.integrityIssueCount ?? null,
      carriedFact: 'T25 selected rho=1/3 as the safe sampled P2rho ratio and rejected P2sqrt3 for body-shadow use.',
    },
  ];
}

function buildThresholdConventionGuard(): PSimplexT27ThresholdConventionGuard {
  return {
    normalizedBodyShadowThreshold: cleanNumber(NORMALIZED_BODY_SHADOW_RATIO),
    coordinateBodyShadowThreshold: cleanNumber(COORDINATE_BODY_SHADOW_RATIO),
    coordinateThresholdStatus: 'coordinate-convention-only',
    linearizedCrossingThresholdConvention: 'uses-normalized-body-shadow-threshold',
    ok:
      NORMALIZED_BODY_SHADOW_RATIO > COORDINATE_BODY_SHADOW_RATIO &&
      nearlyEqual(LINEARIZED_CROSSING_ESTIMATE, 5.076779295364, 1e-9),
  };
}

function buildStationaryEquations(): PSimplexT27StationaryEquations {
  return {
    potential: 'V(a,b;eta)=(a*a+b*b-1)^2+a*a*b*b+b^4/4-eta*(a+b/3)',
    dVda: '4*a^3 + 6*a*b^2 - 4*a - eta',
    dVdb: '6*a^2*b + 5*b^3 - 4*b - eta/3',
    planeHessian: '[[12*a*a + 6*b*b - 4, 12*a*b], [12*a*b, 6*a*a + 15*b*b - 4]]',
    thirdTransverseEigenvalue: '6*a*a + 3*b*b - 4',
  };
}

function buildGuardRows(args: {
  parentT26Report: ReturnType<typeof buildPSimplexP2OneThirdGermSusceptibilityAxisWellResponseAuditT26Report>;
  stationaryEquations: PSimplexT27StationaryEquations;
  thresholdConventionGuard: PSimplexT27ThresholdConventionGuard;
  branchRows: readonly PSimplexT27BranchRow[];
  denseScanSummary: PSimplexT27DenseScanSummary;
  bodyShadowCrossingEstimate: PSimplexT27BodyShadowCrossingEstimate;
  stabilitySummary: PSimplexT27StabilitySummary;
  antipodalCovarianceSummary: PSimplexT27AntipodalCovarianceSummary;
  invalidInterpretationBoundaryRows: readonly PSimplexT27InvalidInterpretationBoundaryRow[];
}): PSimplexT27GuardRow[] {
  return [
    guardRow(
      'parentT26Preserved',
      args.parentT26Report.ok && args.parentT26Report.integrityIssueCount === 0,
      'T26 remains passing and supplies the P2(1/3) local susceptibility parent evidence.',
    ),
    guardRow(
      'stationaryEquationsReported',
      args.stationaryEquations.dVda.includes('4*a^3') && args.stationaryEquations.dVdb.includes('eta/3'),
      'The potential, stationary equations, plane Hessian, and third transverse eigenvalue are report fields.',
    ),
    guardRow(
      'normalizedAndCoordinateThresholdsReported',
      args.thresholdConventionGuard.ok,
      'Both normalized and coordinate body-shadow thresholds are reported with the coordinate threshold marked convention-only.',
    ),
    guardRow(
      'linearizedCrossingUsesNormalizedThreshold',
      args.thresholdConventionGuard.linearizedCrossingThresholdConvention === 'uses-normalized-body-shadow-threshold',
      'The 5.076779295364 linearized crossing estimate is tied to the normalized threshold.',
    ),
    guardRow(
      'requestedEtaSamplesComplete',
      args.branchRows.length === ETA_SAMPLES.length && ETA_SAMPLES.every((eta) => args.branchRows.some((row) => nearlyEqual(row.eta, eta))),
      'All requested eta samples are present.',
    ),
    guardRow('denseScanCompleted', args.denseScanSummary.ok, 'Dense eta scan from 0 to 8 completed without crossing or branch switch.'),
    guardRow(
      'newtonContinuationConverged',
      args.branchRows.every((row) => row.newtonConverged && row.gradientNorm <= NEWTON_TOLERANCE * 10),
      'All sampled Newton continuation rows converged with small gradients.',
    ),
    guardRow(
      'positiveAxisBranchPreserved',
      args.branchRows.every((row) => row.a > 0 && row.b >= 0 && row.branchStatus === 'smooth-continuation'),
      'The positive axis branch has a>0, b>=0, and smooth-continuation status.',
    ),
    guardRow(
      'full3dLocalStabilityPreserved',
      args.stabilitySummary.ok,
      'All sampled branch rows remain local minima in full 3D.',
    ),
    guardRow(
      'noBodyShadowCrossingThroughEta8',
      args.bodyShadowCrossingEstimate.nonlinearCrossingStatus === 'no-crossing-in-tested-range',
      'No dense-scan crossing of b/a against the normalized body-shadow threshold was found through eta=8.',
    ),
    guardRow(
      'asymptoticBoundBelowNormalizedThreshold',
      args.bodyShadowCrossingEstimate.nonlinearPositiveBranchBodyShadowStatus ===
        'no-finite-crossing-expected-for-positive-axis-branch',
      'The positive asymptotic branch ratio is below the normalized body-shadow threshold.',
    ),
    guardRow('antipodalCovarianceVerified', args.antipodalCovarianceSummary.ok, 'Sampled antipodal covariance holds by signed symmetry.'),
    guardRow(
      'responseClosureNotClaimed',
      args.branchRows.every((row) => row.boundaryStatuses.A3ClosureStatus === 'not-closed-response'),
      'No branch row claims A3 response closure.',
    ),
    guardRow(
      'globalResponseGroundingNotClaimed',
      args.branchRows.every((row) => row.boundaryStatuses.responseGroundingStatus === 'local-branch-only'),
      'Response grounding is limited to local branch analysis.',
    ),
    guardRow(
      'fieldCueSemanticRouteDefectPacketTopologyBoundaryPreserved',
      args.invalidInterpretationBoundaryRows.every((row) => row.enforced) &&
        args.branchRows.every(
          (row) =>
            row.boundaryStatuses.fieldCueStatus === 'not-fieldcue' &&
            row.boundaryStatuses.semanticStatus === 'not-semantic-naming' &&
            row.boundaryStatuses.routeHolonomyStatus === 'not-route-walk-holonomy' &&
            row.boundaryStatuses.defectVortexStatus === 'not-defect-vortex' &&
            row.boundaryStatuses.packetStatus === 'not-packet-interpretation' &&
            row.boundaryStatuses.topologyStatus === 'not-topology-workspace',
        ),
      'FieldCue, semantic, route, defect, packet, and topology boundaries are negative-only.',
    ),
    guardRow(
      'runtimeSubstrateNotAuthorized',
      args.branchRows.every((row) => row.boundaryStatuses.runtimeSubstrateStatus === 'not-runtime-substrate'),
      'T27 does not authorize runtime substrate extraction or adoption.',
    ),
  ];
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT27InvalidInterpretationBoundaryRow[] {
  return [
    {
      boundaryId: 'not-closed-A3-response',
      statement: 'Negative boundary: A3 response is not closed.',
      enforced: true,
    },
    {
      boundaryId: 'not-global-response-grounding',
      statement: 'Negative boundary: T27 does not claim global response grounding.',
      enforced: true,
    },
    {
      boundaryId: 'not-fieldcue-semantic-route-defect-packet-topology',
      statement:
        'Negative boundary: no FieldCue, semantic, route/walk/holonomy, defect/vortex, packet, or topology interpretation is introduced.',
      enforced: true,
    },
    {
      boundaryId: 'body-shadow-not-promoted-to-body',
      statement: 'Negative boundary: body-shadow bookkeeping is not promoted to body response.',
      enforced: true,
    },
    {
      boundaryId: 'not-runtime-substrate-extraction-or-adoption',
      statement: 'Negative boundary: T27 does not authorize runtime substrate extraction or adoption.',
      enforced: true,
    },
  ];
}

function buildIntegrityIssues(args: {
  parentEvidenceRows: readonly PSimplexT27ParentEvidenceRow[];
  branchRows: readonly PSimplexT27BranchRow[];
  denseScanSummary: PSimplexT27DenseScanSummary;
  bodyShadowCrossingEstimate: PSimplexT27BodyShadowCrossingEstimate;
  linearVsNonlinearSummary: PSimplexT27LinearVsNonlinearSummary;
  stabilitySummary: PSimplexT27StabilitySummary;
  antipodalCovarianceSummary: PSimplexT27AntipodalCovarianceSummary;
  guardRows: readonly PSimplexT27GuardRow[];
}): string[] {
  const issues: string[] = [];

  if (args.parentEvidenceRows.some((row) => !row.ok)) {
    issues.push('Parent evidence is unavailable or inconsistent.');
  }

  if (args.branchRows.length !== ETA_SAMPLES.length) {
    issues.push(`Expected ${ETA_SAMPLES.length} branch rows, got ${args.branchRows.length}.`);
  }

  if (args.branchRows.some((row) => !row.ok)) {
    issues.push('At least one sampled branch row failed.');
  }

  if (!args.denseScanSummary.ok) {
    issues.push('Dense scan detected failure, branch switch, or body-shadow crossing.');
  }

  if (!args.bodyShadowCrossingEstimate.ok) {
    issues.push('Body-shadow crossing estimate did not preserve the no-crossing positive-axis branch result.');
  }

  if (!args.linearVsNonlinearSummary.ok) {
    issues.push('Linear/nonlinear summary found a sampled branch problem.');
  }

  if (!args.stabilitySummary.ok) {
    issues.push('Stability summary found a non-full-3D-stable sampled row.');
  }

  if (!args.antipodalCovarianceSummary.ok) {
    issues.push('Antipodal covariance failed.');
  }

  if (args.guardRows.some((row) => !row.ok)) {
    issues.push('At least one required T27 guard failed.');
  }

  return [...new Set(issues)];
}

function stationaryGradient(a: number, b: number, eta: number): [number, number] {
  return [
    4 * a ** 3 + 6 * a * b ** 2 - 4 * a - eta,
    6 * a * a * b + 5 * b ** 3 - 4 * b - eta / 3,
  ];
}

function hessianPlane(a: number, b: number): PSimplexMatrix2 {
  return [
    [cleanNumber(12 * a * a + 6 * b * b - 4), cleanNumber(12 * a * b)],
    [cleanNumber(12 * a * b), cleanNumber(6 * a * a + 15 * b * b - 4)],
  ];
}

function energy(a: number, b: number, eta: number): number {
  return (a * a + b * b - 1) ** 2 + a * a * b * b + b ** 4 / 4 - eta * (a + b / 3);
}

function eigenvalues2x2(matrix: PSimplexMatrix2): [number, number] {
  const trace = matrix[0][0] + matrix[1][1];
  const determinant = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  const discriminant = Math.max(0, trace * trace - 4 * determinant);
  const sqrtDiscriminant = Math.sqrt(discriminant);
  const low = cleanNumber((trace - sqrtDiscriminant) / 2);
  const high = cleanNumber((trace + sqrtDiscriminant) / 2);

  return [low, high];
}

function classifyStability(
  planeEigenvalues: [number, number],
  thirdTransverseEigenvalue: number,
): PSimplexT27StabilityStatus {
  const planeStable = planeEigenvalues.every((value) => value > PSIMPLEX_EPSILON);

  if (planeStable && thirdTransverseEigenvalue > PSIMPLEX_EPSILON) {
    return 'local-minimum-full-3d';
  }

  if (planeStable) {
    return 'local-minimum-plane-only-third-unstable';
  }

  return 'unstable-branch';
}

function classifyBranchStatus(
  solution: NewtonSolution,
  branchSwitchDetected: boolean,
  a: number,
  b: number,
  stabilityStatus: PSimplexT27StabilityStatus,
): PSimplexT27BranchStatus {
  if (!solution.converged || solution.gradientNorm > NEWTON_TOLERANCE * 10 || a <= 0 || b < 0 || stabilityStatus === 'unstable-branch') {
    return 'solver-failed';
  }

  return branchSwitchDetected ? 'branch-switch' : 'smooth-continuation';
}

function classifyBodyShadowStatus(
  ratioBA: number,
  axisAlignment: number,
  bodyAlignment: number,
): PSimplexT27BodyShadowStatus {
  if (ratioBA >= NORMALIZED_BODY_SHADOW_RATIO || bodyAlignment >= axisAlignment) {
    return 'body-near-regime';
  }

  return ratioBA >= NORMALIZED_BODY_SHADOW_RATIO * 0.9
    ? 'body-shadow-warning'
    : 'axis-dominant-no-body-shadow';
}

function buildClassifications(relativeDeviationFromLinearizedPrediction: number): PSimplexT27Classification[] {
  return [
    'axis-dominant-A3-susceptibility-branch',
    relativeDeviationFromLinearizedPrediction <= 0.1 ? 'linear-regime' : 'nonlinear-axis-dominant-regime',
    'not-response-closure',
  ];
}

function estimateCrossing(rows: readonly DenseScanPoint[]): number | null {
  for (let index = 1; index < rows.length; index += 1) {
    const previous = rows[index - 1];
    const current = rows[index];

    if (previous.ratioBA < NORMALIZED_BODY_SHADOW_RATIO && current.ratioBA >= NORMALIZED_BODY_SHADOW_RATIO) {
      const ratioSpan = current.ratioBA - previous.ratioBA;

      if (Math.abs(ratioSpan) <= PSIMPLEX_EPSILON) {
        return cleanNumber(current.eta);
      }

      const fraction = (NORMALIZED_BODY_SHADOW_RATIO - previous.ratioBA) / ratioSpan;

      return cleanNumber(previous.eta + fraction * (current.eta - previous.eta));
    }
  }

  return null;
}

function positiveRootOfAsymptoticRatioEquation(): number {
  let lower = 0;
  let upper = 1;

  for (let iteration = 0; iteration < 200; iteration += 1) {
    const middle = (lower + upper) / 2;
    const value = asymptoticRatioPolynomial(middle);

    if (Math.abs(value) <= ASYMPTOTIC_RATIO_EPSILON) {
      return middle;
    }

    if (value > 0) {
      upper = middle;
    } else {
      lower = middle;
    }
  }

  return (lower + upper) / 2;
}

function asymptoticRatioPolynomial(ratio: number): number {
  return 15 * ratio ** 3 - 6 * ratio ** 2 + 18 * ratio - 4;
}

function classifySummaryVerdict(args: {
  integrityIssues: readonly string[];
  branchRows: readonly PSimplexT27BranchRow[];
  bodyShadowCrossingEstimate: PSimplexT27BodyShadowCrossingEstimate;
  stabilitySummary: PSimplexT27StabilitySummary;
}): PSimplexT27SummaryVerdict {
  const bodyShadowTooEarly = args.branchRows.some(
    (row) =>
      row.newtonConverged &&
      row.stabilityStatus === 'local-minimum-full-3d' &&
      row.bodyShadowStatus !== 'axis-dominant-no-body-shadow',
  );

  if (bodyShadowTooEarly) {
    return 'P2-one-third-body-shadow-too-early';
  }

  if (args.integrityIssues.length > 0) {
    return args.stabilitySummary.ok ? 'P2-one-third-branch-inconclusive' : 'P2-one-third-branch-unstable';
  }

  if (args.bodyShadowCrossingEstimate.nonlinearPositiveBranchBodyShadowStatus === 'no-finite-crossing-expected-for-positive-axis-branch') {
    return 'P2-one-third-nonlinear-axis-branch-confirmed';
  }

  return 'P2-one-third-nonlinear-branch-confirmed-with-body-shadow-bound';
}

function classifyAcceptabilityStatus(summaryVerdict: PSimplexT27SummaryVerdict): PSimplexT27AcceptabilityStatus {
  if (summaryVerdict === 'P2-one-third-nonlinear-axis-branch-confirmed') {
    return 'acceptable-as-nonlinear-axis-branch-germ';
  }

  if (summaryVerdict === 'P2-one-third-nonlinear-branch-confirmed-with-body-shadow-bound') {
    return 'acceptable-with-body-shadow-bound';
  }

  if (summaryVerdict === 'P2-one-third-body-shadow-too-early') {
    return 'not-acceptable-body-shadow-too-early';
  }

  return 'inconclusive';
}

function buildBoundaryStatuses(): PSimplexT27BoundaryStatuses {
  return {
    responseGroundingStatus: 'local-branch-only',
    A3ClosureStatus: 'not-closed-response',
    fieldCueStatus: 'not-fieldcue',
    semanticStatus: 'not-semantic-naming',
    topologyStatus: 'not-topology-workspace',
    runtimeSubstrateStatus: 'not-runtime-substrate',
    bodyStatus: 'not-promoted',
    packetStatus: 'not-packet-interpretation',
    routeHolonomyStatus: 'not-route-walk-holonomy',
    defectVortexStatus: 'not-defect-vortex',
  };
}

function boundaryStatusesPass(statuses: PSimplexT27BoundaryStatuses): boolean {
  return (
    statuses.responseGroundingStatus === 'local-branch-only' &&
    statuses.A3ClosureStatus === 'not-closed-response' &&
    statuses.fieldCueStatus === 'not-fieldcue' &&
    statuses.semanticStatus === 'not-semantic-naming' &&
    statuses.topologyStatus === 'not-topology-workspace' &&
    statuses.runtimeSubstrateStatus === 'not-runtime-substrate' &&
    statuses.bodyStatus === 'not-promoted' &&
    statuses.packetStatus === 'not-packet-interpretation' &&
    statuses.routeHolonomyStatus === 'not-route-walk-holonomy' &&
    statuses.defectVortexStatus === 'not-defect-vortex'
  );
}

function guardRow(guardId: PSimplexT27GuardRow['guardId'], ok: boolean, evidence: string): PSimplexT27GuardRow {
  return {
    guardId,
    status: ok ? 'pass' : 'fail',
    evidence,
    ok,
  };
}

function nearlyEqual(left: number, right: number, tolerance = PSIMPLEX_EPSILON): boolean {
  return Math.abs(left - right) <= tolerance;
}

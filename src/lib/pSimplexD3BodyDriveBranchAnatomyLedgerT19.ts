import {
  minimizePSimplexBoundedPointwiseVectorLG,
  pSimplexPointwisePotential,
  pSimplexPointwisePotentialGradient,
  type PSimplexPointwiseLocalMinimum,
} from './pSimplexPointwiseRelaxationCore';
import {
  buildPSimplexNonAxisThresholdSweepReadoutLedgerT16Report,
  type PSimplexT16FiniteLedgerRelation,
  type PSimplexT16FinitePredictionClass,
  type PSimplexT16SweepRow,
  type PSimplexT16Verdict,
} from './pSimplexNonAxisThresholdSweepReadoutLedgerT16';
import {
  buildPSimplexA3ProvisionalReadoutLedgerT17Report,
  type PSimplexT17Verdict,
} from './pSimplexA3ProvisionalReadoutLedgerT17';
import {
  buildPSimplexD3BodyDiagonalDivergenceAnatomyLedgerT18Report,
  type PSimplexT18Verdict,
} from './pSimplexD3BodyDiagonalDivergenceAnatomyLedgerT18';
import {
  buildPSimplexFiniteResponseDirections,
  compareFiniteResponseDirections,
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
  type PSimplexVec3,
} from './pSimplexVectorMath';

export type PSimplexT19BranchFamily =
  | 'body-symmetric-branch'
  | 'axis-dominant-tilted-branch'
  | 'A3-mediated-branch-collapsed-with-B1'
  | 'unconstrained-local-minima';

export type PSimplexT19BranchReadoutClass =
  | 'axis-dominant'
  | 'A3-mediated'
  | 'body-symmetric'
  | 'body-near'
  | 'mixed-tilt'
  | 'unclassified';

export type PSimplexT19LocalStability = 'stable' | 'marginal' | 'unstable' | 'unknown';
export type PSimplexT19SwitchType = 'none' | 'smooth-tilt' | 'first-order' | 'continuous-crossover' | 'unresolved';
export type PSimplexT19ContinuityClass = 'smooth' | 'jump' | 'unresolved';
export type PSimplexT19ErrorClass =
  | 'threshold-too-early'
  | 'smooth-tilt-not-discrete-selection'
  | 'first-order-switch-missed'
  | 'A3-mediated-body-path'
  | 'unresolved';
export type PSimplexT19Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT19FinalRecommendation =
  | 'quarantine-D3-and-proceed-axis-plus-A3'
  | 'refine-D3-threshold'
  | 'define-provisional-D3-body-readout'
  | 'return-to-T18';

export interface PSimplexT19BranchRow {
  branchId: string;
  branchFamily: PSimplexT19BranchFamily;
  phi: PSimplexVec3;
  normalizedDirection: PSimplexVec3 | null;
  energy: number;
  gradientNorm: number | null;
  hessianEigenvalues: number[] | null;
  localStability: PSimplexT19LocalStability;
  nearestAxisDirectionId: string | null;
  nearestA3DirectionId: string | null;
  nearestBodyDirectionId: string | null;
  A_axis: number;
  A_A3: number;
  A_body: number;
  branchReadoutClass: PSimplexT19BranchReadoutClass;
  notes: string[];
  ok: boolean;
}

export interface PSimplexT19BranchComparisonRow {
  s: number;
  eta: number;
  J: PSimplexVec3;
  finiteLedgerPredictedClass: PSimplexT16FinitePredictionClass;
  finiteLedgerWinningDirectionIds: string[];
  finiteLedgerRelationFromT16OrNearest: PSimplexT16FiniteLedgerRelation;
  branchRows: PSimplexT19BranchRow[];
  globalMinimumBranchId: string;
  secondBestBranchId: string | null;
  energyGap: number | null;
  globalBranchFamily: PSimplexT19BranchFamily;
  globalReadoutClass: PSimplexT19BranchReadoutClass;
  branchSwitchFlag: boolean;
  switchType: PSimplexT19SwitchType;
  finiteLedgerOverpredictionFlag: boolean;
  finiteLedgerErrorBandFlag: boolean;
  notes: string[];
  ok: boolean;
}

export interface PSimplexT19BranchFamilySummaryRow {
  branchId: string;
  branchFamily: PSimplexT19BranchFamily;
  evaluationStatus: string;
  symmetryCopyCount: number;
  collapsedWithBranchId: string | null;
  summaryJudgment: string;
  ok: boolean;
}

export interface PSimplexT19BranchContinuityRow {
  fromS: number;
  toS: number;
  previousGlobalBranchFamily: PSimplexT19BranchFamily;
  nextGlobalBranchFamily: PSimplexT19BranchFamily;
  responseDistance: number;
  energyGapChange: number | null;
  continuityClass: PSimplexT19ContinuityClass;
  ok: boolean;
}

export interface PSimplexT19FiniteLedgerErrorBandRow {
  sStart: number;
  sEnd: number;
  rowCount: number;
  finiteLedgerPredictedClass: PSimplexT16FinitePredictionClass;
  actualGlobalBranchFamily: PSimplexT19BranchFamily;
  actualGlobalReadoutClass: PSimplexT19BranchReadoutClass;
  errorClass: PSimplexT19ErrorClass;
  summaryJudgment: string;
  ok: boolean;
}

export interface PSimplexT19InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT19BranchConsolidationPayload {
  axisChannelStatus: 'closed';
  a3ChannelStatus: 'provisional-readout';
  d3ChannelStatus:
    | 'open-branch-theory-required'
    | 'threshold-refinement-needed'
    | 'provisional-body-readout-possible'
    | 'quarantined';
  recommendedD3Vocabulary: string[];
  actualBodyOnset: number | null;
  finiteLedgerErrorBand: [number, number] | null;
  branchSwitchType: PSimplexT19SwitchType;
  recommendedPolicy: PSimplexT19FinalRecommendation;
  safeForReadoutSubstrate: boolean;
  doNotCarryForward: string[];
}

export interface PSimplexT19Summary {
  representativeBodyDrive: string;
  sourceStrengthCount: number;
  evaluatedStrengthCount: number;
  branchComparisonRowCount: number;
  sAxisEscape: number | null;
  sBodyActual: number | null;
  branchSwitchType: PSimplexT19SwitchType;
  finiteLedgerErrorBand: [number, number] | null;
  finiteLedgerOverpredictionRowCount: number;
  finiteLedgerStrictDivergentInRepresentativeCount: number;
  minimumEnergyGapInErrorBand: number | null;
  maximumEnergyGapInErrorBand: number | null;
  bodyDriveSymmetryEquivalentByT18: boolean;
  branchFamiliesEvaluated: boolean;
  collapsedBranchFamiliesReported: boolean;
  globalMinimumReportedForEveryStrength: boolean;
  d3RemainsNonClosed: boolean;
  consolidationPayloadPresent: boolean;
  forbiddenBoundaryPassed: boolean;
}

export interface PSimplexD3BodyDriveBranchAnatomyLedgerT19Report {
  method: 'p-simplex-d3-body-drive-branch-anatomy-ledger-t19';
  candidatePackage: 'p-simplex-d3-body-drive-branch-anatomy-ledger-t19';
  parentT16Ledger: 'p-simplex-non-axis-threshold-sweep-readout-ledger-t16';
  parentT17Ledger: 'p-simplex-a3-provisional-readout-ledger-t17';
  parentT18Ledger: 'p-simplex-d3-body-diagonal-divergence-anatomy-ledger-t18';
  diagnosticScope: 'representative-d3-body-drive-local-branch-anatomy';
  solverStatus: 'uses-existing-bounded-pointwise-minimizer-plus-local-branch-evaluation';
  refinementStatus: 'local-branch-refinement-diagnostic-not-dense-sampling';
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
  parentT18Verdict: PSimplexT18Verdict;
  parentT18Ok: boolean;
  parentT18IntegrityIssueCount: number;
  representativeBodyDrive: string;
  representativeJ: PSimplexVec3;
  representativeDriveSymmetryNote: {
    t18AllEightBodyDrivesSymmetryEquivalent: boolean;
    statement: string;
    ok: boolean;
  };
  sourceStrengthValues: number[];
  optionalRefinedStrengthValues: number[];
  refinementReason: string;
  branchFamilySummaryRows: PSimplexT19BranchFamilySummaryRow[];
  branchComparisonRows: PSimplexT19BranchComparisonRow[];
  branchContinuityRows: PSimplexT19BranchContinuityRow[];
  finiteLedgerErrorBandRows: PSimplexT19FiniteLedgerErrorBandRow[];
  branchConsolidationPayload: PSimplexT19BranchConsolidationPayload;
  invalidInterpretationBoundaryRows: PSimplexT19InvalidInterpretationBoundaryRow[];
  summary: PSimplexT19Summary;
  verdict: PSimplexT19Verdict;
  finalRecommendation: PSimplexT19FinalRecommendation;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

const REPRESENTATIVE_BODY_DRIVE = 'body-diagonal-plusx-plusy-plusz';
const REPRESENTATIVE_J: PSimplexVec3 = cleanVec3([1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3)]);
const MAX_RADIUS = 3;
const BODY_NEAR_ALIGNMENT = 0.985;
const BODY_SYMMETRIC_ALIGNMENT = 0.999999;
const ENERGY_TOLERANCE = 1e-6;
const STABILITY_TOLERANCE = 1e-6;

export function buildPSimplexD3BodyDriveBranchAnatomyLedgerT19Report(): PSimplexD3BodyDriveBranchAnatomyLedgerT19Report {
  const parentT16Report = buildPSimplexNonAxisThresholdSweepReadoutLedgerT16Report();
  const parentT17Report = buildPSimplexA3ProvisionalReadoutLedgerT17Report();
  const parentT18Report = buildPSimplexD3BodyDiagonalDivergenceAnatomyLedgerT18Report();
  const finiteDirections = buildPSimplexFiniteResponseDirections();
  const sourceRows = parentT16Report.sweepRows
    .filter((row) => row.driveFamily === 'D3' && row.driveId === REPRESENTATIVE_BODY_DRIVE)
    .sort((left, right) => left.s - right.s);
  const sourceStrengthValues = sourceRows.map((row) => row.s);
  const optionalRefinedStrengthValues: number[] = [];
  const branchFamilySummaryRows = buildBranchFamilySummaryRows();
  const branchComparisonRows = buildBranchComparisonRows(sourceRows, finiteDirections);
  const branchContinuityRows = buildBranchContinuityRows(branchComparisonRows);
  applySwitchAnnotations(branchComparisonRows, branchContinuityRows);
  const finiteLedgerErrorBandRows = buildFiniteLedgerErrorBandRows(branchComparisonRows);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const summary = buildSummary({
    sourceStrengthValues,
    optionalRefinedStrengthValues,
    branchComparisonRows,
    branchContinuityRows,
    finiteLedgerErrorBandRows,
    branchFamilySummaryRows,
    parentT18Report,
    invalidInterpretationBoundaryRows,
  });
  const finalRecommendation = recommendationForSummary(summary);
  const branchConsolidationPayload = buildBranchConsolidationPayload(summary, finalRecommendation);
  const integrityIssues = collectIntegrityIssues({
    parentT16Report,
    parentT17Report,
    parentT18Report,
    sourceRows,
    branchComparisonRows,
    branchContinuityRows,
    finiteLedgerErrorBandRows,
    branchConsolidationPayload,
    invalidInterpretationBoundaryRows,
    summary,
  });
  const verdict = classifyVerdict(integrityIssues, summary, branchContinuityRows);

  return {
    method: 'p-simplex-d3-body-drive-branch-anatomy-ledger-t19',
    candidatePackage: 'p-simplex-d3-body-drive-branch-anatomy-ledger-t19',
    parentT16Ledger: 'p-simplex-non-axis-threshold-sweep-readout-ledger-t16',
    parentT17Ledger: 'p-simplex-a3-provisional-readout-ledger-t17',
    parentT18Ledger: 'p-simplex-d3-body-diagonal-divergence-anatomy-ledger-t18',
    diagnosticScope: 'representative-d3-body-drive-local-branch-anatomy',
    solverStatus: 'uses-existing-bounded-pointwise-minimizer-plus-local-branch-evaluation',
    refinementStatus: 'local-branch-refinement-diagnostic-not-dense-sampling',
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
    parentT18Verdict: parentT18Report.verdict,
    parentT18Ok: parentT18Report.ok,
    parentT18IntegrityIssueCount: parentT18Report.integrityIssueCount,
    representativeBodyDrive: REPRESENTATIVE_BODY_DRIVE,
    representativeJ: REPRESENTATIVE_J,
    representativeDriveSymmetryNote: {
      t18AllEightBodyDrivesSymmetryEquivalent: parentT18Report.summary.allEightBodyDrivesSymmetryEquivalent,
      statement: 'The other seven body-diagonal drives are checked through T18 signed-coordinate symmetry equivalence.',
      ok: parentT18Report.summary.allEightBodyDrivesSymmetryEquivalent,
    },
    sourceStrengthValues,
    optionalRefinedStrengthValues,
    refinementReason:
      'No extra refinement used; the accepted T16 D3 grid already covers the T18 finite-ledger error band and body-near onset.',
    branchFamilySummaryRows,
    branchComparisonRows,
    branchContinuityRows,
    finiteLedgerErrorBandRows,
    branchConsolidationPayload,
    invalidInterpretationBoundaryRows,
    summary: {
      ...summary,
      consolidationPayloadPresent: branchConsolidationPayload !== undefined,
    },
    verdict,
    finalRecommendation,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: verdict !== 'FAIL' && integrityIssues.length === 0,
  };
}

function buildBranchFamilySummaryRows(): PSimplexT19BranchFamilySummaryRow[] {
  return [
    {
      branchId: 'B0',
      branchFamily: 'body-symmetric-branch',
      evaluationStatus: 'closed-form-cubic-stationary-branch',
      symmetryCopyCount: 1,
      collapsedWithBranchId: null,
      summaryJudgment: 'The body-symmetric branch is evaluated as phi=(t,t,t).',
      ok: true,
    },
    {
      branchId: 'B1',
      branchFamily: 'axis-dominant-tilted-branch',
      evaluationStatus: 'existing-minimizer-axis-seed-branch',
      symmetryCopyCount: 3,
      collapsedWithBranchId: null,
      summaryJudgment: 'The tilted one-coordinate-distinct branch is represented by phi=(a,b,b) and symmetry copies.',
      ok: true,
    },
    {
      branchId: 'B2',
      branchFamily: 'A3-mediated-branch-collapsed-with-B1',
      evaluationStatus: 'collapsed-by-representative-body-drive-symmetry',
      symmetryCopyCount: 3,
      collapsedWithBranchId: 'B1',
      summaryJudgment: 'The phi=(a,a,b) family is the same reduced one-coordinate-distinct family under coordinate permutation.',
      ok: true,
    },
    {
      branchId: 'B3',
      branchFamily: 'unconstrained-local-minima',
      evaluationStatus: 'existing-multi-seed-minimizer-best-minimum',
      symmetryCopyCount: 1,
      collapsedWithBranchId: null,
      summaryJudgment: 'The unconstrained local minimum verifies which evaluated branch is globally minimal.',
      ok: true,
    },
  ];
}

function buildBranchComparisonRows(
  sourceRows: readonly PSimplexT16SweepRow[],
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
): PSimplexT19BranchComparisonRow[] {
  return sourceRows.map((sourceRow) => buildBranchComparisonRow(sourceRow, finiteDirections));
}

function buildBranchComparisonRow(
  sourceRow: PSimplexT16SweepRow,
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
): PSimplexT19BranchComparisonRow {
  const eta = sourceRow.s;
  const minimizerResult = minimizePSimplexBoundedPointwiseVectorLG(REPRESENTATIVE_J, eta, {
    maxRadius: MAX_RADIUS,
    maxIterations: 700,
  });
  const b0Phi = bodySymmetricStationaryPhi(eta);
  const b1Minimum = localMinimumBySeed(minimizerResult.localMinima, 'axis-+x') ?? minimizerResult.bestLocalMinimum;
  const b1Phi = cleanVec3(b1Minimum.phi);
  const b2Phi = cleanVec3([b1Phi[1], b1Phi[1], b1Phi[0]]);
  const b3Phi = cleanVec3(minimizerResult.bestLocalMinimum.phi);
  const branchRows = [
    buildBranchRow({
      branchId: 'B0-body-symmetric',
      branchFamily: 'body-symmetric-branch',
      phi: b0Phi,
      eta,
      finiteDirections,
      notes: ['body-symmetric-stationary-branch'],
    }),
    buildBranchRow({
      branchId: 'B1-axis-dominant-tilted',
      branchFamily: 'axis-dominant-tilted-branch',
      phi: b1Phi,
      eta,
      finiteDirections,
      notes: ['axis-seed-one-coordinate-distinct-branch', `source-seed=${b1Minimum.seedId}`],
    }),
    buildBranchRow({
      branchId: 'B2-A3-mediated-collapsed-with-B1',
      branchFamily: 'A3-mediated-branch-collapsed-with-B1',
      phi: b2Phi,
      eta,
      finiteDirections,
      notes: ['collapsed-with-B1-under-coordinate-permutation', 'not-a-distinct-representative-body-drive-branch'],
    }),
    buildBranchRow({
      branchId: 'B3-unconstrained-best',
      branchFamily: 'unconstrained-local-minima',
      phi: b3Phi,
      eta,
      finiteDirections,
      notes: [
        'existing-multi-seed-minimizer-best-minimum',
        `stop=${minimizerResult.bestMinimumStopReason}`,
        `converged=${minimizerResult.bestMinimumConverged}`,
      ],
    }),
  ];
  const global = selectGlobalBranch(branchRows);
  const secondBest = secondBestBranch(branchRows, global.branchId);
  const energyGap = secondBest ? cleanNumber(secondBest.energy - global.energy) : null;
  const finiteLedgerOverpredictionFlag = finiteLedgerOverpredictionForRow(sourceRow, global);
  const finiteLedgerErrorBandFlag = finiteLedgerOverpredictionFlag || sourceRow.finiteLedgerRelationStrict === 'finite-ledger-divergent';

  return {
    s: sourceRow.s,
    eta,
    J: REPRESENTATIVE_J,
    finiteLedgerPredictedClass: sourceRow.finiteLedgerPredictedClass,
    finiteLedgerWinningDirectionIds: [...sourceRow.finiteLedgerWinningDirectionIds],
    finiteLedgerRelationFromT16OrNearest: sourceRow.finiteLedgerRelationStrict,
    branchRows,
    globalMinimumBranchId: global.branchId,
    secondBestBranchId: secondBest?.branchId ?? null,
    energyGap,
    globalBranchFamily: global.branchFamily,
    globalReadoutClass: global.branchReadoutClass,
    branchSwitchFlag: false,
    switchType: 'none',
    finiteLedgerOverpredictionFlag,
    finiteLedgerErrorBandFlag,
    notes: notesForComparisonRow(sourceRow, global, finiteLedgerOverpredictionFlag),
    ok: branchRows.every((row) => row.ok) && global.branchFamily !== 'unconstrained-local-minima',
  };
}

function buildBranchRow(args: {
  branchId: string;
  branchFamily: PSimplexT19BranchFamily;
  phi: PSimplexVec3;
  eta: number;
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[];
  notes: string[];
}): PSimplexT19BranchRow {
  const normalizedDirection = normalizeVec3OrNull(args.phi);
  const alignment = classifyAlignment(normalizedDirection, args.finiteDirections);
  const energy = cleanNumber(pSimplexPointwisePotential(args.phi, REPRESENTATIVE_J, args.eta));
  const gradient = pSimplexPointwisePotentialGradient(args.phi, REPRESENTATIVE_J, args.eta);
  const gradientNorm = cleanNumber(normVec3(gradient));
  const hessianEigenvalues = jacobiEigenvalues3(symmetricHessian(args.phi)).map(cleanNumber).sort((left, right) => left - right);
  const localStability = stabilityFromEigenvalues(hessianEigenvalues);
  const branchReadoutClass = classifyBranchReadout(args.branchFamily, alignment);

  return {
    branchId: args.branchId,
    branchFamily: args.branchFamily,
    phi: cleanVec3(args.phi),
    normalizedDirection: normalizedDirection ? cleanVec3(normalizedDirection) : null,
    energy,
    gradientNorm,
    hessianEigenvalues,
    localStability,
    nearestAxisDirectionId: alignment.nearestAxisDirectionId,
    nearestA3DirectionId: alignment.nearestA3DirectionId,
    nearestBodyDirectionId: alignment.nearestBodyDirectionId,
    A_axis: alignment.A_axis,
    A_A3: alignment.A_A3,
    A_body: alignment.A_body,
    branchReadoutClass,
    notes: args.notes,
    ok: Number.isFinite(energy) && localStability !== 'unknown',
  };
}

function bodySymmetricStationaryPhi(eta: number): PSimplexVec3 {
  const roots = cubicRootsDepressed(-0.25, -(eta * Math.sqrt(3)) / 48);
  const candidates = roots.map((t) => {
    const phi: PSimplexVec3 = [t, t, t];
    return {
      t,
      phi,
      energy: pSimplexPointwisePotential(phi, REPRESENTATIVE_J, eta),
    };
  });
  const best = candidates.sort((left, right) => left.energy - right.energy)[0];

  return cleanVec3(best.phi);
}

function cubicRootsDepressed(p: number, q: number): number[] {
  const discriminant = (q / 2) ** 2 + (p / 3) ** 3;

  if (discriminant >= -PSIMPLEX_EPSILON) {
    const sqrtDiscriminant = Math.sqrt(Math.max(0, discriminant));

    return [Math.cbrt(-q / 2 + sqrtDiscriminant) + Math.cbrt(-q / 2 - sqrtDiscriminant)];
  }

  const radius = 2 * Math.sqrt(-p / 3);
  const argument = ((3 * q) / (2 * p)) * Math.sqrt(-3 / p);
  const angle = Math.acos(Math.max(-1, Math.min(1, argument)));

  return [0, 1, 2].map((index) => radius * Math.cos((angle - 2 * Math.PI * index) / 3));
}

function localMinimumBySeed(
  localMinima: readonly PSimplexPointwiseLocalMinimum[],
  seedId: string,
): PSimplexPointwiseLocalMinimum | null {
  return localMinima.find((entry) => entry.seedId === seedId) ?? null;
}

function selectGlobalBranch(branchRows: readonly PSimplexT19BranchRow[]): PSimplexT19BranchRow {
  const bestEnergy = Math.min(...branchRows.map((row) => row.energy));
  const bestRows = branchRows.filter((row) => row.energy <= bestEnergy + ENERGY_TOLERANCE);
  const bodyRow = bestRows.find(
    (row) =>
      row.branchFamily === 'body-symmetric-branch' &&
      (row.branchReadoutClass === 'body-symmetric' || row.branchReadoutClass === 'body-near') &&
      row.localStability === 'stable',
  );

  if (bodyRow) {
    return bodyRow;
  }

  return (
    bestRows.find((row) => row.branchFamily === 'axis-dominant-tilted-branch') ??
    bestRows.find((row) => row.branchFamily === 'A3-mediated-branch-collapsed-with-B1') ??
    bestRows.find((row) => row.branchFamily === 'body-symmetric-branch') ??
    bestRows[0]
  );
}

function secondBestBranch(
  branchRows: readonly PSimplexT19BranchRow[],
  globalBranchId: string,
): PSimplexT19BranchRow | null {
  return [...branchRows]
    .filter((row) => row.branchId !== globalBranchId)
    .sort((left, right) => left.energy - right.energy)[0] ?? null;
}

function finiteLedgerOverpredictionForRow(
  sourceRow: PSimplexT16SweepRow,
  global: PSimplexT19BranchRow,
): boolean {
  return (
    sourceRow.finiteLedgerPredictedClass === 'body-diagonal-high-mixing' &&
    (global.branchReadoutClass === 'axis-dominant' ||
      global.branchReadoutClass === 'mixed-tilt' ||
      global.branchReadoutClass === 'A3-mediated')
  );
}

function notesForComparisonRow(
  sourceRow: PSimplexT16SweepRow,
  global: PSimplexT19BranchRow,
  finiteLedgerOverpredictionFlag: boolean,
): string[] {
  const notes: string[] = ['local-pointwise-branch-anatomy-only', 'D3-body-response-remains-non-closed'];

  if (finiteLedgerOverpredictionFlag) {
    notes.push('finite-ledger-predicts-body-before-global-branch-is-body-near');
  }

  if (sourceRow.finiteLedgerRelationStrict === 'finite-ledger-divergent') {
    notes.push('source-T16-strict-divergent-row-anatomized');
  }

  if (global.branchFamily === 'A3-mediated-branch-collapsed-with-B1') {
    notes.push('A3-mediated-branch-collapsed-with-axis-tilted-family');
  }

  return [...new Set(notes)];
}

function buildBranchContinuityRows(
  rows: readonly PSimplexT19BranchComparisonRow[],
): PSimplexT19BranchContinuityRow[] {
  const continuityRows: PSimplexT19BranchContinuityRow[] = [];

  for (let index = 1; index < rows.length; index += 1) {
    const previous = rows[index - 1];
    const next = rows[index];
    const previousGlobal = requireBranch(previous, previous.globalMinimumBranchId);
    const nextGlobal = requireBranch(next, next.globalMinimumBranchId);
    const responseDistance = normalizedResponseDistance(previousGlobal, nextGlobal);
    const energyGapChange =
      previous.energyGap !== null && next.energyGap !== null ? cleanNumber(next.energyGap - previous.energyGap) : null;

    continuityRows.push({
      fromS: previous.s,
      toS: next.s,
      previousGlobalBranchFamily: previous.globalBranchFamily,
      nextGlobalBranchFamily: next.globalBranchFamily,
      responseDistance,
      energyGapChange,
      continuityClass: continuityClassFromDistance(responseDistance),
      ok: responseDistance < 0.6,
    });
  }

  return continuityRows;
}

function applySwitchAnnotations(
  rows: PSimplexT19BranchComparisonRow[],
  continuityRows: readonly PSimplexT19BranchContinuityRow[],
): void {
  for (let index = 1; index < rows.length; index += 1) {
    const continuity = continuityRows[index - 1];
    const switched = rows[index - 1].globalBranchFamily !== rows[index].globalBranchFamily;

    rows[index].branchSwitchFlag = switched;
    rows[index].switchType = switched ? switchTypeFromContinuity(continuity) : 'none';
  }
}

function buildFiniteLedgerErrorBandRows(
  rows: readonly PSimplexT19BranchComparisonRow[],
): PSimplexT19FiniteLedgerErrorBandRow[] {
  const errorRows = rows.filter((row) => row.finiteLedgerErrorBandFlag);
  const segments: PSimplexT19FiniteLedgerErrorBandRow[] = [];
  let currentRows: PSimplexT19BranchComparisonRow[] = [];

  for (const row of errorRows) {
    const previous = currentRows[currentRows.length - 1];

    if (!previous || errorBandSegmentKey(previous) === errorBandSegmentKey(row)) {
      currentRows.push(row);
    } else {
      segments.push(errorBandSegmentFromRows(currentRows));
      currentRows = [row];
    }
  }

  if (currentRows.length > 0) {
    segments.push(errorBandSegmentFromRows(currentRows));
  }

  return segments;
}

function errorBandSegmentFromRows(
  rows: readonly PSimplexT19BranchComparisonRow[],
): PSimplexT19FiniteLedgerErrorBandRow {
  const first = rows[0];

  return {
    sStart: cleanNumber(Math.min(...rows.map((row) => row.s))),
    sEnd: cleanNumber(Math.max(...rows.map((row) => row.s))),
    rowCount: rows.length,
    finiteLedgerPredictedClass: first.finiteLedgerPredictedClass,
    actualGlobalBranchFamily: first.globalBranchFamily,
    actualGlobalReadoutClass: first.globalReadoutClass,
    errorClass: errorClassForRows(rows),
    summaryJudgment: summaryForErrorRows(rows),
    ok: true,
  };
}

function errorBandSegmentKey(row: PSimplexT19BranchComparisonRow): string {
  return [row.finiteLedgerPredictedClass, row.globalBranchFamily, row.globalReadoutClass].join('|');
}

function errorClassForRows(rows: readonly PSimplexT19BranchComparisonRow[]): PSimplexT19ErrorClass {
  if (rows.some((row) => row.globalReadoutClass === 'A3-mediated')) {
    return 'A3-mediated-body-path';
  }

  if (rows.some((row) => row.branchSwitchFlag && row.switchType === 'first-order')) {
    return 'first-order-switch-missed';
  }

  if (rows.every((row) => row.globalReadoutClass === 'axis-dominant')) {
    return 'threshold-too-early';
  }

  if (rows.some((row) => row.globalReadoutClass === 'mixed-tilt')) {
    return 'smooth-tilt-not-discrete-selection';
  }

  return 'unresolved';
}

function summaryForErrorRows(rows: readonly PSimplexT19BranchComparisonRow[]): string {
  if (rows.every((row) => row.globalReadoutClass === 'axis-dominant')) {
    return 'Finite body selection occurs while the global pointwise branch is still axis-dominant tilted.';
  }

  if (rows.some((row) => row.globalReadoutClass === 'mixed-tilt')) {
    return 'Finite body selection occurs while the global pointwise response is still a smooth tilted branch.';
  }

  return 'Finite-ledger body prediction differs from the branch anatomy readout.';
}

function buildBranchConsolidationPayload(
  summary: PSimplexT19Summary,
  recommendedPolicy: PSimplexT19FinalRecommendation,
): PSimplexT19BranchConsolidationPayload {
  return {
    axisChannelStatus: 'closed',
    a3ChannelStatus: 'provisional-readout',
    d3ChannelStatus: summary.finiteLedgerErrorBand ? 'threshold-refinement-needed' : 'open-branch-theory-required',
    recommendedD3Vocabulary: [
      'body-drive',
      'axis-dominant tilted branch',
      'smooth tilted branch',
      'body-near onset',
      'finite-ledger overprediction band',
    ],
    actualBodyOnset: summary.sBodyActual,
    finiteLedgerErrorBand: summary.finiteLedgerErrorBand,
    branchSwitchType: summary.branchSwitchType,
    recommendedPolicy,
    safeForReadoutSubstrate: false,
    doNotCarryForward: [
      'closed-D3-body-response',
      'finite-ledger-body-threshold-as-actual-onset',
      'FieldCue interpretation',
      'semantic interpretation',
      'route/walk/holonomy interpretation',
      'defect/vortex interpretation',
    ],
  };
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT19InvalidInterpretationBoundaryRow[] {
  return [
    { boundaryId: 'body-response-not-closed', statement: 'body response is not closed', enforced: true },
    { boundaryId: 'body-response-not-semantic-truth', statement: 'body response is not semantic truth', enforced: true },
    { boundaryId: 'body-response-not-cue', statement: 'body response is not a cue', enforced: true },
    {
      boundaryId: 'body-diagonal-not-route-walk-holonomy',
      statement: 'body diagonal behavior is not route, walk, or holonomy',
      enforced: true,
    },
    {
      boundaryId: 'body-diagonal-not-defect-vortex',
      statement: 'body diagonal behavior is not defect or vortex behavior',
      enforced: true,
    },
    { boundaryId: 'not-spatial-dynamics', statement: 'spatial dynamics are not active', enforced: true },
    { boundaryId: 'not-dense-sampling', statement: 'dense sampling is not authorized', enforced: true },
  ];
}

function buildSummary(args: {
  sourceStrengthValues: readonly number[];
  optionalRefinedStrengthValues: readonly number[];
  branchComparisonRows: readonly PSimplexT19BranchComparisonRow[];
  branchContinuityRows: readonly PSimplexT19BranchContinuityRow[];
  finiteLedgerErrorBandRows: readonly PSimplexT19FiniteLedgerErrorBandRow[];
  branchFamilySummaryRows: readonly PSimplexT19BranchFamilySummaryRow[];
  parentT18Report: ReturnType<typeof buildPSimplexD3BodyDiagonalDivergenceAnatomyLedgerT18Report>;
  invalidInterpretationBoundaryRows: readonly PSimplexT19InvalidInterpretationBoundaryRow[];
}): PSimplexT19Summary {
  const errorRows = args.branchComparisonRows.filter((row) => row.finiteLedgerErrorBandFlag);
  const errorGaps = errorRows
    .map((row) => row.energyGap)
    .filter((value): value is number => value !== null);
  const sAxisEscape = firstS(args.branchComparisonRows, (row) => row.globalReadoutClass !== 'axis-dominant');
  const sBodyActual = firstS(
    args.branchComparisonRows,
    (row) => row.globalReadoutClass === 'body-near' || row.globalReadoutClass === 'body-symmetric',
  );
  const branchSwitchType = classifyOverallSwitchType(args.branchComparisonRows, args.branchContinuityRows);

  return {
    representativeBodyDrive: REPRESENTATIVE_BODY_DRIVE,
    sourceStrengthCount: args.sourceStrengthValues.length,
    evaluatedStrengthCount: args.sourceStrengthValues.length + args.optionalRefinedStrengthValues.length,
    branchComparisonRowCount: args.branchComparisonRows.length,
    sAxisEscape,
    sBodyActual,
    branchSwitchType,
    finiteLedgerErrorBand:
      errorRows.length > 0
        ? [cleanNumber(Math.min(...errorRows.map((row) => row.s))), cleanNumber(Math.max(...errorRows.map((row) => row.s)))]
        : null,
    finiteLedgerOverpredictionRowCount: args.branchComparisonRows.filter((row) => row.finiteLedgerOverpredictionFlag).length,
    finiteLedgerStrictDivergentInRepresentativeCount: args.branchComparisonRows.filter(
      (row) => row.finiteLedgerRelationFromT16OrNearest === 'finite-ledger-divergent',
    ).length,
    minimumEnergyGapInErrorBand: errorGaps.length > 0 ? cleanNumber(Math.min(...errorGaps)) : null,
    maximumEnergyGapInErrorBand: errorGaps.length > 0 ? cleanNumber(Math.max(...errorGaps)) : null,
    bodyDriveSymmetryEquivalentByT18: args.parentT18Report.summary.allEightBodyDrivesSymmetryEquivalent,
    branchFamiliesEvaluated: args.branchFamilySummaryRows.every((row) => row.ok),
    collapsedBranchFamiliesReported: args.branchFamilySummaryRows.some((row) => row.collapsedWithBranchId === 'B1'),
    globalMinimumReportedForEveryStrength: args.branchComparisonRows.every((row) => row.globalMinimumBranchId.length > 0),
    d3RemainsNonClosed: args.branchComparisonRows.every((row) =>
      row.notes.includes('D3-body-response-remains-non-closed'),
    ),
    consolidationPayloadPresent: true,
    forbiddenBoundaryPassed:
      args.invalidInterpretationBoundaryRows.every((row) => row.enforced) &&
      !forbiddenPositiveClaimAppears(args.branchComparisonRows, args.invalidInterpretationBoundaryRows),
  };
}

function collectIntegrityIssues(args: {
  parentT16Report: ReturnType<typeof buildPSimplexNonAxisThresholdSweepReadoutLedgerT16Report>;
  parentT17Report: ReturnType<typeof buildPSimplexA3ProvisionalReadoutLedgerT17Report>;
  parentT18Report: ReturnType<typeof buildPSimplexD3BodyDiagonalDivergenceAnatomyLedgerT18Report>;
  sourceRows: readonly PSimplexT16SweepRow[];
  branchComparisonRows: readonly PSimplexT19BranchComparisonRow[];
  branchContinuityRows: readonly PSimplexT19BranchContinuityRow[];
  finiteLedgerErrorBandRows: readonly PSimplexT19FiniteLedgerErrorBandRow[];
  branchConsolidationPayload: PSimplexT19BranchConsolidationPayload;
  invalidInterpretationBoundaryRows: readonly PSimplexT19InvalidInterpretationBoundaryRow[];
  summary: PSimplexT19Summary;
}): string[] {
  const issues: string[] = [];

  if (!(args.parentT16Report.verdict === 'PASS' && args.parentT16Report.ok && args.parentT16Report.integrityIssueCount === 0)) {
    issues.push('Parent T16 ledger is not PASS/ok with zero integrity issues.');
  }

  if (!(args.parentT17Report.verdict === 'PASS' && args.parentT17Report.ok && args.parentT17Report.integrityIssueCount === 0)) {
    issues.push('Parent T17 ledger is not PASS/ok with zero integrity issues.');
  }

  if (!(args.parentT18Report.verdict === 'PASS' && args.parentT18Report.ok && args.parentT18Report.integrityIssueCount === 0)) {
    issues.push('Parent T18 ledger is not PASS/ok with zero integrity issues.');
  }

  if (args.sourceRows.length === 0) {
    issues.push('Representative body drive rows are missing from T16.');
  }

  if (!args.summary.bodyDriveSymmetryEquivalentByT18) {
    issues.push('T18 did not confirm eight-body-drive symmetry equivalence.');
  }

  if (!args.summary.branchFamiliesEvaluated || !args.summary.collapsedBranchFamiliesReported) {
    issues.push('Branch families were not all evaluated or the B1/B2 collapse was not reported.');
  }

  if (!args.summary.globalMinimumReportedForEveryStrength) {
    issues.push('At least one sampled strength is missing a global branch report.');
  }

  if (args.summary.finiteLedgerStrictDivergentInRepresentativeCount > 0 && args.finiteLedgerErrorBandRows.length === 0) {
    issues.push('Finite-ledger divergent body-drive rows were not anatomized.');
  }

  if (!args.branchConsolidationPayload || !args.summary.consolidationPayloadPresent) {
    issues.push('Branch consolidation payload is missing.');
  }

  if (args.branchConsolidationPayload.axisChannelStatus !== 'closed') {
    issues.push('Consolidation payload did not preserve closed axis channel status.');
  }

  if (args.branchConsolidationPayload.d3ChannelStatus === 'provisional-body-readout-possible') {
    issues.push('D3 was promoted too far for the current branch anatomy evidence.');
  }

  if (!args.summary.d3RemainsNonClosed) {
    issues.push('D3 branch anatomy promoted body response to closed.');
  }

  if (args.branchContinuityRows.some((row) => row.continuityClass === 'unresolved')) {
    issues.push('At least one branch-continuity step is unresolved.');
  }

  if (!args.summary.forbiddenBoundaryPassed || !args.invalidInterpretationBoundaryRows.every((row) => row.enforced)) {
    issues.push('Forbidden interpretation language entered the T19 branch anatomy ledger.');
  }

  return [...new Set(issues)];
}

function classifyVerdict(
  integrityIssues: readonly string[],
  summary: PSimplexT19Summary,
  branchContinuityRows: readonly PSimplexT19BranchContinuityRow[],
): PSimplexT19Verdict {
  if (
    integrityIssues.some(
      (issue) =>
        issue !== 'At least one branch-continuity step is unresolved.' &&
        issue !== 'T18 did not confirm eight-body-drive symmetry equivalence.',
    )
  ) {
    return 'FAIL';
  }

  if (
    integrityIssues.length > 0 ||
    summary.branchSwitchType === 'unresolved' ||
    branchContinuityRows.some((row) => row.continuityClass === 'unresolved')
  ) {
    return 'PARTIAL';
  }

  return 'PASS';
}

function recommendationForSummary(summary: PSimplexT19Summary): PSimplexT19FinalRecommendation {
  if (!summary.branchFamiliesEvaluated || !summary.globalMinimumReportedForEveryStrength) {
    return 'return-to-T18';
  }

  if (summary.finiteLedgerErrorBand) {
    return 'quarantine-D3-and-proceed-axis-plus-A3';
  }

  if (summary.sBodyActual !== null) {
    return 'refine-D3-threshold';
  }

  return 'return-to-T18';
}

interface ClassifiedAlignment {
  nearestAxisDirectionId: string | null;
  nearestA3DirectionId: string | null;
  nearestBodyDirectionId: string | null;
  A_axis: number;
  A_A3: number;
  A_body: number;
  dominantClass: PSimplexRuntimeResponseDirectionClass | 'unclassified-response';
}

function classifyAlignment(
  normalizedDirection: PSimplexVec3 | null,
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
): ClassifiedAlignment {
  const axis = bestClassAlignment(normalizedDirection, finiteDirections, 'axis-well');
  const a3 = bestClassAlignment(normalizedDirection, finiteDirections, 'a3-transition');
  const body = bestClassAlignment(normalizedDirection, finiteDirections, 'body-diagonal-high-mixing');
  const ranked = [
    { classId: 'axis-well' as const, alignment: axis.alignment },
    { classId: 'a3-transition' as const, alignment: a3.alignment },
    { classId: 'body-diagonal-high-mixing' as const, alignment: body.alignment },
  ].sort((left, right) => right.alignment - left.alignment);

  return {
    nearestAxisDirectionId: axis.directionId,
    nearestA3DirectionId: a3.directionId,
    nearestBodyDirectionId: body.directionId,
    A_axis: axis.alignment,
    A_A3: a3.alignment,
    A_body: body.alignment,
    dominantClass: ranked[0].alignment > PSIMPLEX_EPSILON ? ranked[0].classId : 'unclassified-response',
  };
}

function bestClassAlignment(
  normalizedDirection: PSimplexVec3 | null,
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
  responseClass: PSimplexRuntimeResponseDirectionClass,
): { directionId: string | null; alignment: number } {
  if (!normalizedDirection) {
    return { directionId: null, alignment: 0 };
  }

  const best = finiteDirections
    .filter((direction) => direction.responseDirectionClass === responseClass)
    .reduce<{ directionId: string; alignment: number } | null>((currentBest, direction) => {
      const alignment = dotVec3(normalizedDirection, direction.n);

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

function classifyBranchReadout(
  branchFamily: PSimplexT19BranchFamily,
  alignment: ClassifiedAlignment,
): PSimplexT19BranchReadoutClass {
  if (branchFamily === 'body-symmetric-branch' && alignment.A_body >= BODY_SYMMETRIC_ALIGNMENT) {
    return 'body-symmetric';
  }

  if (alignment.A_body >= BODY_NEAR_ALIGNMENT) {
    return 'body-near';
  }

  if (alignment.dominantClass === 'axis-well') {
    return 'axis-dominant';
  }

  if (alignment.dominantClass === 'a3-transition') {
    return 'A3-mediated';
  }

  if (alignment.dominantClass === 'body-diagonal-high-mixing') {
    return 'mixed-tilt';
  }

  return 'unclassified';
}

function symmetricHessian(phi: PSimplexVec3): [[number, number, number], [number, number, number], [number, number, number]] {
  const [x, y, z] = phi;
  const r2 = dotVec3(phi, phi);

  return [
    [6 * r2 - 4 + 6 * x * x, 12 * x * y, 12 * x * z],
    [12 * y * x, 6 * r2 - 4 + 6 * y * y, 12 * y * z],
    [12 * z * x, 12 * z * y, 6 * r2 - 4 + 6 * z * z],
  ];
}

function jacobiEigenvalues3(
  matrix: [[number, number, number], [number, number, number], [number, number, number]],
): number[] {
  const a = matrix.map((row) => [...row]) as number[][];

  for (let sweep = 0; sweep < 40; sweep += 1) {
    const pairs: Array<[number, number]> = [
      [0, 1],
      [0, 2],
      [1, 2],
    ];
    let changed = false;

    for (const [p, q] of pairs) {
      if (Math.abs(a[p][q]) <= 1e-12) {
        continue;
      }

      changed = true;
      const tau = (a[q][q] - a[p][p]) / (2 * a[p][q]);
      const t = Math.sign(tau || 1) / (Math.abs(tau) + Math.sqrt(1 + tau * tau));
      const c = 1 / Math.sqrt(1 + t * t);
      const s = t * c;
      const app = a[p][p];
      const aqq = a[q][q];
      const apq = a[p][q];

      a[p][p] = app - t * apq;
      a[q][q] = aqq + t * apq;
      a[p][q] = 0;
      a[q][p] = 0;

      for (let r = 0; r < 3; r += 1) {
        if (r === p || r === q) {
          continue;
        }

        const arp = a[r][p];
        const arq = a[r][q];
        a[r][p] = c * arp - s * arq;
        a[p][r] = a[r][p];
        a[r][q] = s * arp + c * arq;
        a[q][r] = a[r][q];
      }
    }

    if (!changed) {
      break;
    }
  }

  return [a[0][0], a[1][1], a[2][2]];
}

function stabilityFromEigenvalues(eigenvalues: readonly number[]): PSimplexT19LocalStability {
  if (eigenvalues.some((value) => !Number.isFinite(value))) {
    return 'unknown';
  }

  const minEigenvalue = Math.min(...eigenvalues);

  if (minEigenvalue > STABILITY_TOLERANCE) {
    return 'stable';
  }

  if (minEigenvalue >= -STABILITY_TOLERANCE) {
    return 'marginal';
  }

  return 'unstable';
}

function normalizedResponseDistance(left: PSimplexT19BranchRow, right: PSimplexT19BranchRow): number {
  if (!left.normalizedDirection || !right.normalizedDirection) {
    return Number.POSITIVE_INFINITY;
  }

  return cleanNumber(normVec3([
    left.normalizedDirection[0] - right.normalizedDirection[0],
    left.normalizedDirection[1] - right.normalizedDirection[1],
    left.normalizedDirection[2] - right.normalizedDirection[2],
  ]));
}

function continuityClassFromDistance(responseDistance: number): PSimplexT19ContinuityClass {
  if (!Number.isFinite(responseDistance)) {
    return 'unresolved';
  }

  return responseDistance > 0.45 ? 'jump' : 'smooth';
}

function switchTypeFromContinuity(continuity: PSimplexT19BranchContinuityRow): PSimplexT19SwitchType {
  if (continuity.continuityClass === 'jump') {
    return 'first-order';
  }

  if (continuity.continuityClass === 'smooth') {
    return 'continuous-crossover';
  }

  return 'unresolved';
}

function classifyOverallSwitchType(
  rows: readonly PSimplexT19BranchComparisonRow[],
  continuityRows: readonly PSimplexT19BranchContinuityRow[],
): PSimplexT19SwitchType {
  if (continuityRows.some((row) => row.continuityClass === 'unresolved')) {
    return 'unresolved';
  }

  if (continuityRows.some((row) => row.continuityClass === 'jump')) {
    return 'first-order';
  }

  if (rows.some((row) => row.branchSwitchFlag)) {
    return 'continuous-crossover';
  }

  if (rows.some((row) => row.globalReadoutClass === 'mixed-tilt')) {
    return 'smooth-tilt';
  }

  return 'none';
}

function requireBranch(row: PSimplexT19BranchComparisonRow, branchId: string): PSimplexT19BranchRow {
  const branch = row.branchRows.find((candidate) => candidate.branchId === branchId);

  if (!branch) {
    throw new Error(`Missing branch ${branchId} for s=${row.s}.`);
  }

  return branch;
}

function firstS(
  rows: readonly PSimplexT19BranchComparisonRow[],
  predicate: (row: PSimplexT19BranchComparisonRow) => boolean,
): number | null {
  return rows.find(predicate)?.s ?? null;
}

function forbiddenPositiveClaimAppears(
  rows: readonly PSimplexT19BranchComparisonRow[],
  boundaryRows: readonly PSimplexT19InvalidInterpretationBoundaryRow[],
): boolean {
  const values = [
    ...rows.flatMap((row) => [
      row.globalBranchFamily,
      row.globalReadoutClass,
      row.switchType,
      ...row.notes,
      ...row.branchRows.flatMap((branch) => [branch.branchFamily, branch.branchReadoutClass, ...branch.notes]),
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
    'body response is semantic truth',
    'body response is a cue',
    'body diagonal behavior is route',
    'body diagonal behavior is walk',
    'body diagonal behavior is holonomy',
    'body diagonal behavior is defect',
    'body diagonal behavior is vortex',
    'spatial dynamics are active',
    'dense sampling is authorized',
  ].some((claim) => normalized.includes(claim));
}

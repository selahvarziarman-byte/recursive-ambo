import {
  buildPSimplexA3CuboctaOrientedDifferenceLedgerT9Report,
  type PSimplexT9SignedAxis,
  type PSimplexT9Vec3,
} from './pSimplexA3CuboctaOrientedDifferenceLedgerT9';
import { buildPSimplexA3ResidualDecompositionLedgerT10Report } from './pSimplexA3ResidualDecompositionLedgerT10';
import {
  applySignedCoordinatePermutation,
  buildPSimplexBodyDiagonalDirections,
  coordinatePermutations,
  PSIMPLEX_COORDINATE_AXES,
  PSIMPLEX_SIGN_FLIPS,
  signToken,
} from './pSimplexCoreGeometry';
import {
  allNearlyEqual,
  cleanNumber,
  cleanVec3,
  nearlyEqual,
  normalizeVec3,
  PSIMPLEX_EPSILON,
} from './pSimplexVectorMath';
import {
  classifyPotentialDirectionStatus,
  PSIMPLEX_A3_ANISOTROPY,
  PSIMPLEX_AXIS_ANISOTROPY,
  PSIMPLEX_BODY_DIAGONAL_ANISOTROPY,
  PSIMPLEX_LG_LAMBDA,
  PSIMPLEX_LG_MU,
  PSIMPLEX_LG_V,
  pSimplexAnisotropyTerm,
  pSimplexRadialTerm,
} from './pSimplexVectorLGCore';

export type PSimplexT11DirectionClass = 'axis' | 'a3-cubocta-root' | 'body-diagonal';
export type PSimplexT11DirectionSource = 't9-child-axis' | 't9-oriented-root' | 'generated-body-diagonal';
export type PSimplexT11DirectionStatus =
  | 'axis-well-direction'
  | 'a3-transition-direction'
  | 'high-mixing-direction'
  | 'unexpected-direction-level';
export type PSimplexT11Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT11FinalRecommendation =
  | 'add-source-forced-local-response-or-constrain-a3-residual-readings'
  | 'refine-potential-before-source-forcing'
  | 'return-to-potential-design';

export interface PSimplexT11PotentialDefinition {
  expression: 'V(phi)=lambda*(|phi|^2-v^2)^2+mu*(X^2Y^2+Y^2Z^2+Z^2X^2)';
  lambda: 1;
  mu: 1;
  v: 1;
  radialTermDescription: 'lambda*(|phi|^2-v^2)^2';
  anisotropyTermDescription: 'mu*(X^2Y^2+Y^2Z^2+Z^2X^2)';
  constantsAreStructuralNormalization: true;
}

export interface PSimplexT11DirectionClassRow {
  directionId: string;
  directionClass: PSimplexT11DirectionClass;
  source: PSimplexT11DirectionSource;
  normalizedDirection: PSimplexT9Vec3;
  radialTerm: number;
  anisotropyTerm: number;
  potentialValue: number;
  expectedAnisotropy: number;
  expectedStatus: Exclude<PSimplexT11DirectionStatus, 'unexpected-direction-level'>;
  observedStatus: PSimplexT11DirectionStatus;
  ok: boolean;
}

export interface PSimplexT11AxisMinimaCheck {
  axisDirectionCount: number;
  expectedAnisotropy: 0;
  observedAnisotropies: number[];
  allEqual: boolean;
  allLowestAmongTestedDirections: boolean;
  ok: boolean;
}

export interface PSimplexT11AntipodalEnergyEqualityRow {
  pairId: 'x-axis' | 'y-axis' | 'z-axis';
  positiveDirectionId: string;
  negativeDirectionId: string;
  positivePotentialValue: number;
  negativePotentialValue: number;
  equalEnergy: boolean;
  ok: boolean;
}

export interface PSimplexT11A3TransitionCheck {
  a3DirectionCount: number;
  expectedAnisotropy: 0.25;
  observedAnisotropies: number[];
  allEqual: boolean;
  allAtTransitionLevel: boolean;
  allAboveAxisLevel: boolean;
  allBelowBodyDiagonalLevel: boolean;
  ok: boolean;
}

export interface PSimplexT11BodyDiagonalMixingCheck {
  bodyDiagonalDirectionCount: number;
  expectedAnisotropy: number;
  observedAnisotropies: number[];
  allEqual: boolean;
  allAtHighMixingLevel: boolean;
  allAboveA3TransitionLevel: boolean;
  ok: boolean;
}

export interface PSimplexT11EnergyOrderingCheck {
  axisAnisotropy: number;
  a3Anisotropy: number;
  bodyDiagonalAnisotropy: number;
  expectedOrdering: 'axis < a3-cubocta < body-diagonal';
  observedOrdering: boolean;
  ok: boolean;
}

export interface PSimplexT11SymmetryCheckRow {
  symmetryId: string;
  coordinatePermutation: Array<'x' | 'y' | 'z'>;
  signFlips: [1 | -1, 1 | -1, 1 | -1];
  checkedDirectionCount: number;
  maxAnisotropyDeviation: number;
  invariant: boolean;
  ok: boolean;
}

export interface PSimplexT11TwoChannelCompatibilityRow {
  compatibilityId: string;
  statement: string;
  evidence: 'axis-direction-class' | 'a3-transition-direction-class' | 'boundary-only';
  ok: boolean;
}

export interface PSimplexT11InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT11Summary {
  directionClassRowCount: number;
  axisDirectionCount: number;
  a3DirectionCount: number;
  bodyDiagonalDirectionCount: number;
  symmetryCheckCount: number;
  axisMinimaPassed: boolean;
  antipodalEqualityPassed: boolean;
  a3TransitionPassed: boolean;
  bodyDiagonalMixingPassed: boolean;
  energyOrderingPassed: boolean;
  symmetryCheckPassed: boolean;
  twoChannelCompatibilityPassed: boolean;
}

export interface PSimplexVectorLGPotentialShapeLedgerT11Report {
  method: 'p-simplex-vector-lg-potential-shape-ledger-t11';
  candidatePackage: 'p-simplex-vector-lg-potential-shape-ledger-t11';
  parentA3Ledger: 'p-simplex-a3-cubocta-oriented-difference-ledger-t9';
  parentResidualLedger: 'p-simplex-a3-residual-decomposition-ledger-t10';
  diagnosticScope: 'finite-potential-shape-ledger-only';
  potentialFamily: 'quartic-radial-plus-octahedral-anisotropy';
  solverStatus: 'not-a-solver';
  relaxationStatus: 'not-field-relaxation';
  sourceForcingStatus: 'not-source-forced';
  fieldAtlasStatus: 'not-field-atlas';
  renderingStatus: 'not-rendering';
  fieldCueStatus: 'not-field-cue';
  semanticStatus: 'not-semantic-naming';
  routeStatus: 'no-route-walk-holonomy';
  defectStatus: 'no-defect-vortex-claims';
  denseSamplingStatus: 'not-dense-sampling';
  parentA3LedgerStillPasses: boolean;
  parentResidualLedgerStillPasses: boolean;
  potentialDefinition: PSimplexT11PotentialDefinition;
  directionClassRows: PSimplexT11DirectionClassRow[];
  axisMinimaCheck: PSimplexT11AxisMinimaCheck;
  antipodalEnergyEqualityRows: PSimplexT11AntipodalEnergyEqualityRow[];
  a3TransitionCheck: PSimplexT11A3TransitionCheck;
  bodyDiagonalMixingCheck: PSimplexT11BodyDiagonalMixingCheck;
  energyOrderingCheck: PSimplexT11EnergyOrderingCheck;
  symmetryCheckRows: PSimplexT11SymmetryCheckRow[];
  twoChannelCompatibilityRows: PSimplexT11TwoChannelCompatibilityRow[];
  invalidInterpretationBoundaryRows: PSimplexT11InvalidInterpretationBoundaryRow[];
  summary: PSimplexT11Summary;
  verdict: PSimplexT11Verdict;
  finalRecommendation: PSimplexT11FinalRecommendation;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

const EPSILON = PSIMPLEX_EPSILON;
const LAMBDA = PSIMPLEX_LG_LAMBDA;
const MU = PSIMPLEX_LG_MU;
const V = PSIMPLEX_LG_V;
const AXIS_ANISOTROPY = PSIMPLEX_AXIS_ANISOTROPY;
const A3_ANISOTROPY = PSIMPLEX_A3_ANISOTROPY;
const BODY_DIAGONAL_ANISOTROPY = PSIMPLEX_BODY_DIAGONAL_ANISOTROPY;
const AXES = PSIMPLEX_COORDINATE_AXES;
const SIGN_FLIPS = PSIMPLEX_SIGN_FLIPS;

export function buildPSimplexVectorLGPotentialShapeLedgerT11Report(): PSimplexVectorLGPotentialShapeLedgerT11Report {
  const parentA3Report = buildPSimplexA3CuboctaOrientedDifferenceLedgerT9Report();
  const parentResidualReport = buildPSimplexA3ResidualDecompositionLedgerT10Report();
  const parentA3LedgerStillPasses =
    parentA3Report.ok && parentA3Report.integrityIssueCount === 0 && parentA3Report.verdict === 'PASS';
  const parentResidualLedgerStillPasses =
    parentResidualReport.ok &&
    parentResidualReport.integrityIssueCount === 0 &&
    parentResidualReport.verdict === 'PASS';
  const potentialDefinition = buildPotentialDefinition();
  const directionClassRows = buildDirectionClassRows(parentA3Report);
  const axisMinimaCheck = buildAxisMinimaCheck(directionClassRows);
  const antipodalEnergyEqualityRows = buildAntipodalEnergyEqualityRows(directionClassRows);
  const a3TransitionCheck = buildA3TransitionCheck(directionClassRows);
  const bodyDiagonalMixingCheck = buildBodyDiagonalMixingCheck(directionClassRows);
  const energyOrderingCheck = buildEnergyOrderingCheck(axisMinimaCheck, a3TransitionCheck, bodyDiagonalMixingCheck);
  const symmetryCheckRows = buildSymmetryCheckRows(directionClassRows);
  const twoChannelCompatibilityRows = buildTwoChannelCompatibilityRows(directionClassRows, parentResidualReport);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const summary = buildSummary({
    directionClassRows,
    axisMinimaCheck,
    antipodalEnergyEqualityRows,
    a3TransitionCheck,
    bodyDiagonalMixingCheck,
    energyOrderingCheck,
    symmetryCheckRows,
    twoChannelCompatibilityRows,
  });
  const integrityIssues = buildIntegrityIssues({
    parentA3LedgerStillPasses,
    parentResidualLedgerStillPasses,
    directionClassRows,
    axisMinimaCheck,
    antipodalEnergyEqualityRows,
    a3TransitionCheck,
    bodyDiagonalMixingCheck,
    energyOrderingCheck,
    symmetryCheckRows,
    twoChannelCompatibilityRows,
    invalidInterpretationBoundaryRows,
    summary,
  });
  const verdict = classifyVerdict(integrityIssues, summary);
  const finalRecommendation = recommendationForVerdict(verdict);

  return {
    method: 'p-simplex-vector-lg-potential-shape-ledger-t11',
    candidatePackage: 'p-simplex-vector-lg-potential-shape-ledger-t11',
    parentA3Ledger: 'p-simplex-a3-cubocta-oriented-difference-ledger-t9',
    parentResidualLedger: 'p-simplex-a3-residual-decomposition-ledger-t10',
    diagnosticScope: 'finite-potential-shape-ledger-only',
    potentialFamily: 'quartic-radial-plus-octahedral-anisotropy',
    solverStatus: 'not-a-solver',
    relaxationStatus: 'not-field-relaxation',
    sourceForcingStatus: 'not-source-forced',
    fieldAtlasStatus: 'not-field-atlas',
    renderingStatus: 'not-rendering',
    fieldCueStatus: 'not-field-cue',
    semanticStatus: 'not-semantic-naming',
    routeStatus: 'no-route-walk-holonomy',
    defectStatus: 'no-defect-vortex-claims',
    denseSamplingStatus: 'not-dense-sampling',
    parentA3LedgerStillPasses,
    parentResidualLedgerStillPasses,
    potentialDefinition,
    directionClassRows,
    axisMinimaCheck,
    antipodalEnergyEqualityRows,
    a3TransitionCheck,
    bodyDiagonalMixingCheck,
    energyOrderingCheck,
    symmetryCheckRows,
    twoChannelCompatibilityRows,
    invalidInterpretationBoundaryRows,
    summary,
    verdict,
    finalRecommendation,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: verdict !== 'FAIL' && integrityIssues.length === 0,
  };
}

function buildPotentialDefinition(): PSimplexT11PotentialDefinition {
  return {
    expression: 'V(phi)=lambda*(|phi|^2-v^2)^2+mu*(X^2Y^2+Y^2Z^2+Z^2X^2)',
    lambda: LAMBDA,
    mu: MU,
    v: V,
    radialTermDescription: 'lambda*(|phi|^2-v^2)^2',
    anisotropyTermDescription: 'mu*(X^2Y^2+Y^2Z^2+Z^2X^2)',
    constantsAreStructuralNormalization: true,
  };
}

function buildDirectionClassRows(
  parentA3Report: ReturnType<typeof buildPSimplexA3CuboctaOrientedDifferenceLedgerT9Report>,
): PSimplexT11DirectionClassRow[] {
  return [
    ...parentA3Report.childAxisRows.map((row) =>
      buildDirectionClassRow({
        directionId: `axis-${row.signedAxis}`,
        directionClass: 'axis',
        source: 't9-child-axis',
        normalizedDirection: row.normalizedAxis,
        expectedAnisotropy: AXIS_ANISOTROPY,
        expectedStatus: 'axis-well-direction',
      }),
    ),
    ...parentA3Report.orientedDifferenceRows.map((row) =>
      buildDirectionClassRow({
        directionId: row.rootId,
        directionClass: 'a3-cubocta-root',
        source: 't9-oriented-root',
        normalizedDirection: row.normalizedDirection,
        expectedAnisotropy: A3_ANISOTROPY,
        expectedStatus: 'a3-transition-direction',
      }),
    ),
    ...buildPSimplexBodyDiagonalDirections().map((row) =>
      buildDirectionClassRow({
        directionId: row.directionId,
        directionClass: 'body-diagonal',
        source: 'generated-body-diagonal',
        normalizedDirection: row.normalizedDirection,
        expectedAnisotropy: BODY_DIAGONAL_ANISOTROPY,
        expectedStatus: 'high-mixing-direction',
      }),
    ),
  ];
}

function buildDirectionClassRow(args: {
  directionId: string;
  directionClass: PSimplexT11DirectionClass;
  source: PSimplexT11DirectionSource;
  normalizedDirection: PSimplexT9Vec3;
  expectedAnisotropy: number;
  expectedStatus: Exclude<PSimplexT11DirectionStatus, 'unexpected-direction-level'>;
}): PSimplexT11DirectionClassRow {
  const normalizedDirection = normalizeVec3(args.normalizedDirection);
  const radial = pSimplexRadialTerm(normalizedDirection);
  const anisotropy = pSimplexAnisotropyTerm(normalizedDirection);
  const value = radial + anisotropy;
  const observedStatus = classifyPotentialDirectionStatus(anisotropy);

  return {
    directionId: args.directionId,
    directionClass: args.directionClass,
    source: args.source,
    normalizedDirection: cleanVec3(normalizedDirection),
    radialTerm: cleanNumber(radial),
    anisotropyTerm: cleanNumber(anisotropy),
    potentialValue: cleanNumber(value),
    expectedAnisotropy: cleanNumber(args.expectedAnisotropy),
    expectedStatus: args.expectedStatus,
    observedStatus,
    ok:
      nearlyEqual(radial, 0) &&
      nearlyEqual(anisotropy, args.expectedAnisotropy) &&
      observedStatus === args.expectedStatus,
  };
}

function buildAxisMinimaCheck(rows: PSimplexT11DirectionClassRow[]): PSimplexT11AxisMinimaCheck {
  const axisRows = rows.filter((row) => row.directionClass === 'axis');
  const observedAnisotropies = axisRows.map((row) => row.anisotropyTerm);
  const minimumObserved = Math.min(...rows.map((row) => row.anisotropyTerm));
  const allEqual = allNearlyEqual(observedAnisotropies, AXIS_ANISOTROPY);
  const allLowestAmongTestedDirections = observedAnisotropies.every((value) => nearlyEqual(value, minimumObserved));

  return {
    axisDirectionCount: axisRows.length,
    expectedAnisotropy: AXIS_ANISOTROPY,
    observedAnisotropies,
    allEqual,
    allLowestAmongTestedDirections,
    ok: axisRows.length === 6 && allEqual && allLowestAmongTestedDirections,
  };
}

function buildAntipodalEnergyEqualityRows(
  rows: PSimplexT11DirectionClassRow[],
): PSimplexT11AntipodalEnergyEqualityRow[] {
  return [
    buildAntipodalEnergyEqualityRow(rows, 'x-axis', '+x', '-x'),
    buildAntipodalEnergyEqualityRow(rows, 'y-axis', '+y', '-y'),
    buildAntipodalEnergyEqualityRow(rows, 'z-axis', '+z', '-z'),
  ];
}

function buildAntipodalEnergyEqualityRow(
  rows: PSimplexT11DirectionClassRow[],
  pairId: PSimplexT11AntipodalEnergyEqualityRow['pairId'],
  positiveAxis: PSimplexT9SignedAxis,
  negativeAxis: PSimplexT9SignedAxis,
): PSimplexT11AntipodalEnergyEqualityRow {
  const positive = requireDirectionRow(rows, `axis-${positiveAxis}`);
  const negative = requireDirectionRow(rows, `axis-${negativeAxis}`);
  const equalEnergy = nearlyEqual(positive.potentialValue, negative.potentialValue);

  return {
    pairId,
    positiveDirectionId: positive.directionId,
    negativeDirectionId: negative.directionId,
    positivePotentialValue: positive.potentialValue,
    negativePotentialValue: negative.potentialValue,
    equalEnergy,
    ok: equalEnergy,
  };
}

function buildA3TransitionCheck(rows: PSimplexT11DirectionClassRow[]): PSimplexT11A3TransitionCheck {
  const a3Rows = rows.filter((row) => row.directionClass === 'a3-cubocta-root');
  const observedAnisotropies = a3Rows.map((row) => row.anisotropyTerm);
  const allEqual = observedAnisotropies.length > 0 && allNearlyEqual(observedAnisotropies, observedAnisotropies[0]);
  const allAtTransitionLevel = allNearlyEqual(observedAnisotropies, A3_ANISOTROPY);
  const allAboveAxisLevel = observedAnisotropies.every((value) => value > AXIS_ANISOTROPY + EPSILON);
  const allBelowBodyDiagonalLevel = observedAnisotropies.every(
    (value) => value < BODY_DIAGONAL_ANISOTROPY - EPSILON,
  );

  return {
    a3DirectionCount: a3Rows.length,
    expectedAnisotropy: A3_ANISOTROPY,
    observedAnisotropies,
    allEqual,
    allAtTransitionLevel,
    allAboveAxisLevel,
    allBelowBodyDiagonalLevel,
    ok: a3Rows.length === 12 && allEqual && allAtTransitionLevel && allAboveAxisLevel && allBelowBodyDiagonalLevel,
  };
}

function buildBodyDiagonalMixingCheck(rows: PSimplexT11DirectionClassRow[]): PSimplexT11BodyDiagonalMixingCheck {
  const bodyRows = rows.filter((row) => row.directionClass === 'body-diagonal');
  const observedAnisotropies = bodyRows.map((row) => row.anisotropyTerm);
  const allEqual = observedAnisotropies.length > 0 && allNearlyEqual(observedAnisotropies, observedAnisotropies[0]);
  const allAtHighMixingLevel = allNearlyEqual(observedAnisotropies, BODY_DIAGONAL_ANISOTROPY);
  const allAboveA3TransitionLevel = observedAnisotropies.every((value) => value > A3_ANISOTROPY + EPSILON);

  return {
    bodyDiagonalDirectionCount: bodyRows.length,
    expectedAnisotropy: cleanNumber(BODY_DIAGONAL_ANISOTROPY),
    observedAnisotropies,
    allEqual,
    allAtHighMixingLevel,
    allAboveA3TransitionLevel,
    ok: bodyRows.length === 8 && allEqual && allAtHighMixingLevel && allAboveA3TransitionLevel,
  };
}

function buildEnergyOrderingCheck(
  axisMinimaCheck: PSimplexT11AxisMinimaCheck,
  a3TransitionCheck: PSimplexT11A3TransitionCheck,
  bodyDiagonalMixingCheck: PSimplexT11BodyDiagonalMixingCheck,
): PSimplexT11EnergyOrderingCheck {
  const axisAnisotropy = axisMinimaCheck.expectedAnisotropy;
  const a3Anisotropy = a3TransitionCheck.expectedAnisotropy;
  const bodyDiagonalAnisotropy = bodyDiagonalMixingCheck.expectedAnisotropy;
  const observedOrdering = axisAnisotropy < a3Anisotropy && a3Anisotropy < bodyDiagonalAnisotropy;

  return {
    axisAnisotropy,
    a3Anisotropy,
    bodyDiagonalAnisotropy: cleanNumber(bodyDiagonalAnisotropy),
    expectedOrdering: 'axis < a3-cubocta < body-diagonal',
    observedOrdering,
    ok: observedOrdering,
  };
}

function buildSymmetryCheckRows(rows: PSimplexT11DirectionClassRow[]): PSimplexT11SymmetryCheckRow[] {
  return coordinatePermutations([...AXES]).flatMap((coordinatePermutation) =>
    SIGN_FLIPS.map((signFlips) => {
      const deviations = rows.map((row) => {
        const transformed = applySignedCoordinatePermutation(row.normalizedDirection, coordinatePermutation, signFlips);
        const transformedAnisotropy = pSimplexAnisotropyTerm(transformed);

        return Math.abs(transformedAnisotropy - row.anisotropyTerm);
      });
      const maxAnisotropyDeviation = Math.max(...deviations);
      const invariant = maxAnisotropyDeviation <= EPSILON;

      return {
        symmetryId: `${coordinatePermutation.join('')}-${signFlips.map(signToken).join('')}`,
        coordinatePermutation,
        signFlips,
        checkedDirectionCount: rows.length,
        maxAnisotropyDeviation: cleanNumber(maxAnisotropyDeviation),
        invariant,
        ok: rows.length === 26 && invariant,
      };
    }),
  );
}

function buildTwoChannelCompatibilityRows(
  directionRows: PSimplexT11DirectionClassRow[],
  parentResidualReport: ReturnType<typeof buildPSimplexA3ResidualDecompositionLedgerT10Report>,
): PSimplexT11TwoChannelCompatibilityRow[] {
  const axisRowsOk =
    directionRows.filter((row) => row.directionClass === 'axis' && row.observedStatus === 'axis-well-direction')
      .length === 6;
  const a3RowsOk =
    directionRows.filter(
      (row) => row.directionClass === 'a3-cubocta-root' && row.observedStatus === 'a3-transition-direction',
    ).length === 12 &&
    parentResidualReport.summary.rootAlignedResidualCount >= 24 &&
    parentResidualReport.summary.compositeResidualCount >= 0;

  return [
    {
      compatibilityId: 'child-axis-channel-axis-wells',
      statement: 'axis-aligned Phi from child-axis channel sits in axis-well direction class',
      evidence: 'axis-direction-class',
      ok: axisRowsOk,
    },
    {
      compatibilityId: 'a3-residual-channel-transition-directions',
      statement: 'A3-root-aligned residual directions from T10 sit in A3-transition direction class',
      evidence: 'a3-transition-direction-class',
      ok: a3RowsOk,
    },
    {
      compatibilityId: 'source-forced-relaxation-boundary',
      statement: 'source-forced relaxation is not implemented',
      evidence: 'boundary-only',
      ok: true,
    },
  ];
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT11InvalidInterpretationBoundaryRow[] {
  return [
    { boundaryId: 'lg-dynamics-not-implemented', statement: 'LG dynamics are not implemented', enforced: true },
    { boundaryId: 'field-relaxation-not-solved', statement: 'field relaxation is not solved', enforced: true },
    { boundaryId: 'no-defects', statement: 'no defects', enforced: true },
    { boundaryId: 'no-vortices', statement: 'no vortices', enforced: true },
    { boundaryId: 'no-routes', statement: 'no routes', enforced: true },
    { boundaryId: 'no-walks', statement: 'no walks', enforced: true },
    { boundaryId: 'no-holonomy', statement: 'no holonomy', enforced: true },
    {
      boundaryId: 'a3-transition-directions-not-semantic-cues',
      statement: 'A3 transition directions are not semantic cues',
      enforced: true,
    },
    {
      boundaryId: 'axis-wells-not-conceptual-dwellings',
      statement: 'axis wells are not conceptual dwellings',
      enforced: true,
    },
    {
      boundaryId: 'body-diagonals-not-metaphysical-source-truth',
      statement: 'body diagonals are not metaphysical source truth',
      enforced: true,
    },
    { boundaryId: 'not-field-cue', statement: 'not FieldCue', enforced: true },
    { boundaryId: 'rendering-not-authorized', statement: 'rendering is not authorized', enforced: true },
    { boundaryId: 'dense-sampling-not-authorized', statement: 'dense sampling is not authorized', enforced: true },
    { boundaryId: 'not-field-atlas', statement: 'not FieldAtlas', enforced: true },
    { boundaryId: 'not-source-forced-response', statement: 'not source-forced response', enforced: true },
  ];
}

function buildSummary(args: {
  directionClassRows: PSimplexT11DirectionClassRow[];
  axisMinimaCheck: PSimplexT11AxisMinimaCheck;
  antipodalEnergyEqualityRows: PSimplexT11AntipodalEnergyEqualityRow[];
  a3TransitionCheck: PSimplexT11A3TransitionCheck;
  bodyDiagonalMixingCheck: PSimplexT11BodyDiagonalMixingCheck;
  energyOrderingCheck: PSimplexT11EnergyOrderingCheck;
  symmetryCheckRows: PSimplexT11SymmetryCheckRow[];
  twoChannelCompatibilityRows: PSimplexT11TwoChannelCompatibilityRow[];
}): PSimplexT11Summary {
  return {
    directionClassRowCount: args.directionClassRows.length,
    axisDirectionCount: args.directionClassRows.filter((row) => row.directionClass === 'axis').length,
    a3DirectionCount: args.directionClassRows.filter((row) => row.directionClass === 'a3-cubocta-root').length,
    bodyDiagonalDirectionCount: args.directionClassRows.filter((row) => row.directionClass === 'body-diagonal').length,
    symmetryCheckCount: args.symmetryCheckRows.length,
    axisMinimaPassed: args.axisMinimaCheck.ok,
    antipodalEqualityPassed:
      args.antipodalEnergyEqualityRows.length === 3 && args.antipodalEnergyEqualityRows.every((row) => row.ok),
    a3TransitionPassed: args.a3TransitionCheck.ok,
    bodyDiagonalMixingPassed: args.bodyDiagonalMixingCheck.ok,
    energyOrderingPassed: args.energyOrderingCheck.ok,
    symmetryCheckPassed: args.symmetryCheckRows.length === 48 && args.symmetryCheckRows.every((row) => row.ok),
    twoChannelCompatibilityPassed:
      args.twoChannelCompatibilityRows.length === 3 && args.twoChannelCompatibilityRows.every((row) => row.ok),
  };
}

function buildIntegrityIssues(args: {
  parentA3LedgerStillPasses: boolean;
  parentResidualLedgerStillPasses: boolean;
  directionClassRows: PSimplexT11DirectionClassRow[];
  axisMinimaCheck: PSimplexT11AxisMinimaCheck;
  antipodalEnergyEqualityRows: PSimplexT11AntipodalEnergyEqualityRow[];
  a3TransitionCheck: PSimplexT11A3TransitionCheck;
  bodyDiagonalMixingCheck: PSimplexT11BodyDiagonalMixingCheck;
  energyOrderingCheck: PSimplexT11EnergyOrderingCheck;
  symmetryCheckRows: PSimplexT11SymmetryCheckRow[];
  twoChannelCompatibilityRows: PSimplexT11TwoChannelCompatibilityRow[];
  invalidInterpretationBoundaryRows: PSimplexT11InvalidInterpretationBoundaryRow[];
  summary: PSimplexT11Summary;
}): string[] {
  const issues: string[] = [];

  if (!args.parentA3LedgerStillPasses) {
    issues.push('Parent T9 report does not pass.');
  }

  if (!args.parentResidualLedgerStillPasses) {
    issues.push('Parent T10 report does not pass.');
  }

  if (args.directionClassRows.length !== 26) {
    issues.push(`Expected 26 directionClassRows, got ${args.directionClassRows.length}.`);
  }

  if (args.summary.axisDirectionCount !== 6) {
    issues.push(`Expected 6 axis directions, got ${args.summary.axisDirectionCount}.`);
  }

  if (args.summary.a3DirectionCount !== 12) {
    issues.push(`Expected 12 A3/cubocta directions, got ${args.summary.a3DirectionCount}.`);
  }

  if (args.summary.bodyDiagonalDirectionCount !== 8) {
    issues.push(`Expected 8 body diagonal directions, got ${args.summary.bodyDiagonalDirectionCount}.`);
  }

  if (!args.axisMinimaCheck.ok) {
    issues.push('Axis minima check failed.');
  }

  if (!args.a3TransitionCheck.ok) {
    issues.push('A3 transition level check failed.');
  }

  if (!args.bodyDiagonalMixingCheck.ok) {
    issues.push('Body-diagonal mixing level check failed.');
  }

  if (!args.energyOrderingCheck.ok) {
    issues.push('Energy ordering check failed.');
  }

  if (args.antipodalEnergyEqualityRows.length !== 3) {
    issues.push(`Expected 3 antipodalEnergyEqualityRows, got ${args.antipodalEnergyEqualityRows.length}.`);
  }

  if (args.antipodalEnergyEqualityRows.some((row) => !row.ok)) {
    issues.push('At least one antipodal energy equality row failed.');
  }

  if (args.symmetryCheckRows.length !== 48) {
    issues.push(`Expected 48 symmetryCheckRows, got ${args.symmetryCheckRows.length}.`);
  }

  if (args.symmetryCheckRows.some((row) => !row.ok)) {
    issues.push('At least one signed coordinate permutation symmetry row failed.');
  }

  if (args.twoChannelCompatibilityRows.length !== 3 || args.twoChannelCompatibilityRows.some((row) => !row.ok)) {
    issues.push('Two-channel compatibility rows are missing or failed.');
  }

  if (args.invalidInterpretationBoundaryRows.some((row) => !row.enforced)) {
    issues.push('At least one invalid interpretation boundary row is not enforced.');
  }

  if (
    forbiddenPositiveClaimAppears(
      args.directionClassRows,
      args.twoChannelCompatibilityRows,
      args.invalidInterpretationBoundaryRows,
    )
  ) {
    issues.push('Forbidden positive interpretation vocabulary appears outside allowed negative statements.');
  }

  return [...new Set(issues)];
}

function classifyVerdict(integrityIssues: string[], summary: PSimplexT11Summary): PSimplexT11Verdict {
  if (integrityIssues.length > 0) {
    return 'FAIL';
  }

  if (!summary.symmetryCheckPassed || !summary.bodyDiagonalMixingPassed) {
    return 'PARTIAL';
  }

  return 'PASS';
}

function recommendationForVerdict(verdict: PSimplexT11Verdict): PSimplexT11FinalRecommendation {
  if (verdict === 'PASS') {
    return 'add-source-forced-local-response-or-constrain-a3-residual-readings';
  }

  if (verdict === 'PARTIAL') {
    return 'refine-potential-before-source-forcing';
  }

  return 'return-to-potential-design';
}

function requireDirectionRow(rows: PSimplexT11DirectionClassRow[], directionId: string): PSimplexT11DirectionClassRow {
  const row = rows.find((candidate) => candidate.directionId === directionId);

  if (!row) {
    throw new Error(`Missing direction row ${directionId}`);
  }

  return row;
}

function forbiddenPositiveClaimAppears(
  directionRows: PSimplexT11DirectionClassRow[],
  compatibilityRows: PSimplexT11TwoChannelCompatibilityRow[],
  boundaryRows: PSimplexT11InvalidInterpretationBoundaryRow[],
): boolean {
  const values = [
    ...directionRows.flatMap((row) => [
      row.directionId,
      row.directionClass,
      row.source,
      row.expectedStatus,
      row.observedStatus,
    ]),
    ...compatibilityRows.flatMap((row) => [row.compatibilityId, row.statement, row.evidence]),
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
    normalized.includes(' not ') ||
    normalized.includes('not implemented') ||
    normalized.includes('not solved') ||
    normalized.includes('not authorized')
  ) {
    return false;
  }

  return [
    'lg dynamics are implemented',
    'field relaxation has been solved',
    'defects exist',
    'vortices exist',
    'routes exist',
    'walks exist',
    'holonomy exists',
    'a3 transition directions are semantic cues',
    'axis wells are conceptual dwellings',
    'body diagonals are metaphysical source truth',
    'fieldcue exists',
    'rendering is authorized',
    'dense sampling is authorized',
  ].some((claim) => normalized.includes(claim));
}

export type PSimplexT9Vec3 = [number, number, number];
export type PSimplexT9Mat3 = [PSimplexT9Vec3, PSimplexT9Vec3, PSimplexT9Vec3];
export type PSimplexT9PrimalSourceId = 'A' | 'B' | 'C' | 'D';
export type PSimplexT9ChildEdgeId = 'AB' | 'AC' | 'AD' | 'BC' | 'BD' | 'CD';
export type PSimplexT9ChildId = `M_${PSimplexT9ChildEdgeId}`;
export type PSimplexT9RootId =
  | 'r_AB'
  | 'r_BA'
  | 'r_AC'
  | 'r_CA'
  | 'r_AD'
  | 'r_DA'
  | 'r_BC'
  | 'r_CB'
  | 'r_BD'
  | 'r_DB'
  | 'r_CD'
  | 'r_DC';
export type PSimplexT9SignedAxis = '+x' | '-x' | '+y' | '-y' | '+z' | '-z';
export type PSimplexT9CuboctaPattern =
  | '(0,+,+)'
  | '(0,+,-)'
  | '(0,-,+)'
  | '(0,-,-)'
  | '(+,0,+)'
  | '(+,0,-)'
  | '(-,0,+)'
  | '(-,0,-)'
  | '(+,+,0)'
  | '(+,-,0)'
  | '(-,+,0)'
  | '(-,-,0)';
export type PSimplexT9CuboctaPatternFamily =
  | '(0,+/-1,+/-1)/sqrt2'
  | '(+/-1,0,+/-1)/sqrt2'
  | '(+/-1,+/-1,0)/sqrt2';
export type PSimplexT9ProjectionClass = 'orthogonal' | 'positive-maximal' | 'negative-maximal';
export type PSimplexT9Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT9FinalRecommendation =
  | 'define-oriented-difference-root-entry-into-carrier-or-residual-channel'
  | 'refine-projection-incidence-relation-before-moving-forward'
  | 'a3-cubocta-horizon-not-claimable-from-current-p-simplex';

export interface PSimplexT9PrimalSourceRow {
  sourceId: PSimplexT9PrimalSourceId;
  vector: PSimplexT9Vec3;
  magnitude: number;
  simplexRole: 'regular-tetrahedral-primal-source';
}

export interface PSimplexT9ChildAxisRow {
  childId: PSimplexT9ChildId;
  edge: PSimplexT9ChildEdgeId;
  edgeSumVector: PSimplexT9Vec3;
  normalizedAxis: PSimplexT9Vec3;
  signedAxis: PSimplexT9SignedAxis;
  magnitude: number;
  ok: boolean;
}

export interface PSimplexT9OrientedDifferenceRow {
  rootId: PSimplexT9RootId;
  from: PSimplexT9PrimalSourceId;
  to: PSimplexT9PrimalSourceId;
  rawVector: PSimplexT9Vec3;
  rawMagnitude: number;
  normalizedDirection: PSimplexT9Vec3;
  cuboctaPattern: PSimplexT9CuboctaPattern;
  ok: boolean;
}

export interface PSimplexT9OppositePairRow {
  unorderedPair: PSimplexT9ChildEdgeId;
  forwardRootId: PSimplexT9RootId;
  reverseRootId: PSimplexT9RootId;
  forwardVector: PSimplexT9Vec3;
  reverseVector: PSimplexT9Vec3;
  sumVector: PSimplexT9Vec3;
  reverseIsNegative: boolean;
  ok: boolean;
}

export interface PSimplexT9EqualMagnitudeCheck {
  expectedSquaredMagnitude: number;
  expectedMagnitude: number;
  observedMagnitudes: number[];
  commonMagnitude: number;
  allEqualMagnitude: boolean;
  ok: boolean;
}

export interface PSimplexT9CuboctaCoordinateRow {
  rootId: PSimplexT9RootId;
  normalizedDirection: PSimplexT9Vec3;
  zeroCoordinate: 'x' | 'y' | 'z';
  nonzeroCoordinateSigns: string;
  expectedPatternFamily: PSimplexT9CuboctaPatternFamily;
  matchesCuboctaPattern: boolean;
  ok: boolean;
}

export interface PSimplexT9SimpleRootRow {
  rootId: 'alpha1' | 'alpha2' | 'alpha3';
  definition: 'a-b' | 'b-c' | 'c-d';
  vector: PSimplexT9Vec3;
  squaredMagnitude: number;
}

export interface PSimplexT9SimpleRootCartanCheck {
  simpleRoots: [PSimplexT9SimpleRootRow, PSimplexT9SimpleRootRow, PSimplexT9SimpleRootRow];
  dotProducts: {
    alpha1_alpha2: number;
    alpha2_alpha3: number;
    alpha1_alpha3: number;
  };
  expectedSquaredMagnitude: number;
  expectedAdjacentDot: number;
  expectedNonAdjacentDot: number;
  cartanMatrix: number[][];
  expectedCartanMatrix: number[][];
  ok: boolean;
}

export interface PSimplexT9S4CovarianceRow {
  permutationId: string;
  mapping: Record<PSimplexT9PrimalSourceId, PSimplexT9PrimalSourceId>;
  determinant: number;
  orthogonal: boolean;
  rootSetPermuted: boolean;
  checkedRootCount: number;
  ok: boolean;
}

export interface PSimplexT9ChildAxisRootProjectionRow {
  childId: PSimplexT9ChildId;
  signedChildAxis: PSimplexT9SignedAxis;
  rootId: PSimplexT9RootId;
  rootDirection: PSimplexT9Vec3;
  projection: number;
  absoluteProjection: number;
  projectionClass: PSimplexT9ProjectionClass;
  ok: boolean;
}

export interface PSimplexT9ProjectionPatternSummaryRow {
  childId: PSimplexT9ChildId;
  signedChildAxis: PSimplexT9SignedAxis;
  orthogonalCount: number;
  positiveMaximalCount: number;
  negativeMaximalCount: number;
  ok: boolean;
}

export interface PSimplexT9InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT9Summary {
  primalSourceCount: number;
  childAxisCount: number;
  orientedDifferenceCount: number;
  oppositePairCount: number;
  cuboctaDirectionCount: number;
  s4PermutationCount: number;
  projectionRowCount: number;
  projectionSummaryRowCount: number;
  simpleRootCheckPassed: boolean;
  equalMagnitudeCheckPassed: boolean;
  cuboctaCoordinateCheckPassed: boolean;
  oppositePairCheckPassed: boolean;
  s4CovarianceCheckPassed: boolean;
  childAxisProjectionCheckPassed: boolean;
}

export interface PSimplexA3CuboctaOrientedDifferenceLedgerT9Report {
  method: 'p-simplex-a3-cubocta-oriented-difference-ledger-t9';
  candidatePackage: 'p-simplex-a3-cubocta-oriented-difference-structural-ledger-t9';
  diagnosticScope: 'finite-oriented-difference-structural-ledger-only';
  vectorCarrierStatus: 'r3-vector-order-parameter';
  structuralStatus: 'a3-cubocta-oriented-difference-ledger';
  fieldAtlasStatus: 'not-field-atlas';
  renderingStatus: 'not-rendering';
  solverStatus: 'not-lg-solver';
  fieldCueStatus: 'not-field-cue';
  semanticStatus: 'not-semantic-naming';
  routeStatus: 'no-route-walk-holonomy';
  denseSamplingStatus: 'not-dense-sampling';
  primalSourceRows: PSimplexT9PrimalSourceRow[];
  childAxisRows: PSimplexT9ChildAxisRow[];
  orientedDifferenceRows: PSimplexT9OrientedDifferenceRow[];
  oppositePairRows: PSimplexT9OppositePairRow[];
  equalMagnitudeCheck: PSimplexT9EqualMagnitudeCheck;
  cuboctaCoordinateRows: PSimplexT9CuboctaCoordinateRow[];
  simpleRootCartanCheck: PSimplexT9SimpleRootCartanCheck;
  s4CovarianceRows: PSimplexT9S4CovarianceRow[];
  childAxisRootProjectionRows: PSimplexT9ChildAxisRootProjectionRow[];
  projectionPatternSummaryRows: PSimplexT9ProjectionPatternSummaryRow[];
  invalidInterpretationBoundaryRows: PSimplexT9InvalidInterpretationBoundaryRow[];
  summary: PSimplexT9Summary;
  verdict: PSimplexT9Verdict;
  finalRecommendation: PSimplexT9FinalRecommendation;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface ChildDefinition {
  childId: PSimplexT9ChildId;
  edge: PSimplexT9ChildEdgeId;
  endpoints: [PSimplexT9PrimalSourceId, PSimplexT9PrimalSourceId];
  signedAxis: PSimplexT9SignedAxis;
}

interface OrderedDifferenceDefinition {
  rootId: PSimplexT9RootId;
  from: PSimplexT9PrimalSourceId;
  to: PSimplexT9PrimalSourceId;
}

const EPSILON = 1e-9;
const ONE_OVER_SQRT_THREE = 1 / Math.sqrt(3);
const EXPECTED_ROOT_SQUARED_MAGNITUDE = 8 / 3;
const EXPECTED_ROOT_MAGNITUDE = Math.sqrt(EXPECTED_ROOT_SQUARED_MAGNITUDE);
const MAX_PROJECTION = 1 / Math.sqrt(2);
const SOURCE_IDS: readonly PSimplexT9PrimalSourceId[] = ['A', 'B', 'C', 'D'];
const ZERO_VEC3: PSimplexT9Vec3 = [0, 0, 0];
const PRIMAL_VECTOR_BY_ID: Record<PSimplexT9PrimalSourceId, PSimplexT9Vec3> = {
  A: [ONE_OVER_SQRT_THREE, ONE_OVER_SQRT_THREE, ONE_OVER_SQRT_THREE],
  B: [ONE_OVER_SQRT_THREE, -ONE_OVER_SQRT_THREE, -ONE_OVER_SQRT_THREE],
  C: [-ONE_OVER_SQRT_THREE, ONE_OVER_SQRT_THREE, -ONE_OVER_SQRT_THREE],
  D: [-ONE_OVER_SQRT_THREE, -ONE_OVER_SQRT_THREE, ONE_OVER_SQRT_THREE],
};
const CHILD_DEFINITIONS: readonly ChildDefinition[] = [
  { childId: 'M_AB', edge: 'AB', endpoints: ['A', 'B'], signedAxis: '+x' },
  { childId: 'M_AC', edge: 'AC', endpoints: ['A', 'C'], signedAxis: '+y' },
  { childId: 'M_AD', edge: 'AD', endpoints: ['A', 'D'], signedAxis: '+z' },
  { childId: 'M_BC', edge: 'BC', endpoints: ['B', 'C'], signedAxis: '-z' },
  { childId: 'M_BD', edge: 'BD', endpoints: ['B', 'D'], signedAxis: '-y' },
  { childId: 'M_CD', edge: 'CD', endpoints: ['C', 'D'], signedAxis: '-x' },
];
const ORDERED_DIFFERENCE_DEFINITIONS: readonly OrderedDifferenceDefinition[] = [
  { rootId: 'r_AB', from: 'A', to: 'B' },
  { rootId: 'r_BA', from: 'B', to: 'A' },
  { rootId: 'r_AC', from: 'A', to: 'C' },
  { rootId: 'r_CA', from: 'C', to: 'A' },
  { rootId: 'r_AD', from: 'A', to: 'D' },
  { rootId: 'r_DA', from: 'D', to: 'A' },
  { rootId: 'r_BC', from: 'B', to: 'C' },
  { rootId: 'r_CB', from: 'C', to: 'B' },
  { rootId: 'r_BD', from: 'B', to: 'D' },
  { rootId: 'r_DB', from: 'D', to: 'B' },
  { rootId: 'r_CD', from: 'C', to: 'D' },
  { rootId: 'r_DC', from: 'D', to: 'C' },
];

export function buildPSimplexA3CuboctaOrientedDifferenceLedgerT9Report(): PSimplexA3CuboctaOrientedDifferenceLedgerT9Report {
  const primalSourceRows = buildPrimalSourceRows();
  const childAxisRows = buildChildAxisRows();
  const orientedDifferenceRows = buildOrientedDifferenceRows();
  const oppositePairRows = buildOppositePairRows(orientedDifferenceRows);
  const equalMagnitudeCheck = buildEqualMagnitudeCheck(orientedDifferenceRows);
  const cuboctaCoordinateRows = buildCuboctaCoordinateRows(orientedDifferenceRows);
  const simpleRootCartanCheck = buildSimpleRootCartanCheck();
  const s4CovarianceRows = buildS4CovarianceRows(orientedDifferenceRows);
  const childAxisRootProjectionRows = buildChildAxisRootProjectionRows(childAxisRows, orientedDifferenceRows);
  const projectionPatternSummaryRows = buildProjectionPatternSummaryRows(childAxisRootProjectionRows);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const summary = buildSummary({
    primalSourceRows,
    childAxisRows,
    orientedDifferenceRows,
    oppositePairRows,
    cuboctaCoordinateRows,
    simpleRootCartanCheck,
    equalMagnitudeCheck,
    s4CovarianceRows,
    childAxisRootProjectionRows,
    projectionPatternSummaryRows,
  });
  const integrityIssues = buildIntegrityIssues({
    primalSourceRows,
    childAxisRows,
    orientedDifferenceRows,
    oppositePairRows,
    equalMagnitudeCheck,
    cuboctaCoordinateRows,
    simpleRootCartanCheck,
    s4CovarianceRows,
    childAxisRootProjectionRows,
    projectionPatternSummaryRows,
    invalidInterpretationBoundaryRows,
    summary,
  });
  const verdict = classifyVerdict(integrityIssues, summary);
  const finalRecommendation = recommendationForVerdict(verdict);

  return {
    method: 'p-simplex-a3-cubocta-oriented-difference-ledger-t9',
    candidatePackage: 'p-simplex-a3-cubocta-oriented-difference-structural-ledger-t9',
    diagnosticScope: 'finite-oriented-difference-structural-ledger-only',
    vectorCarrierStatus: 'r3-vector-order-parameter',
    structuralStatus: 'a3-cubocta-oriented-difference-ledger',
    fieldAtlasStatus: 'not-field-atlas',
    renderingStatus: 'not-rendering',
    solverStatus: 'not-lg-solver',
    fieldCueStatus: 'not-field-cue',
    semanticStatus: 'not-semantic-naming',
    routeStatus: 'no-route-walk-holonomy',
    denseSamplingStatus: 'not-dense-sampling',
    primalSourceRows,
    childAxisRows,
    orientedDifferenceRows,
    oppositePairRows,
    equalMagnitudeCheck,
    cuboctaCoordinateRows,
    simpleRootCartanCheck,
    s4CovarianceRows,
    childAxisRootProjectionRows,
    projectionPatternSummaryRows,
    invalidInterpretationBoundaryRows,
    summary,
    verdict,
    finalRecommendation,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: verdict !== 'FAIL' && integrityIssues.length === 0,
  };
}

function buildPrimalSourceRows(): PSimplexT9PrimalSourceRow[] {
  return SOURCE_IDS.map((sourceId) => {
    const vector = PRIMAL_VECTOR_BY_ID[sourceId];

    return {
      sourceId,
      vector: cleanVec3(vector),
      magnitude: cleanNumber(normVec3(vector)),
      simplexRole: 'regular-tetrahedral-primal-source',
    };
  });
}

function buildChildAxisRows(): PSimplexT9ChildAxisRow[] {
  return CHILD_DEFINITIONS.map((child) => {
    const edgeSumVector = addVec3(
      PRIMAL_VECTOR_BY_ID[child.endpoints[0]],
      PRIMAL_VECTOR_BY_ID[child.endpoints[1]],
    );
    const normalizedAxis = normalizeVec3(edgeSumVector) ?? ZERO_VEC3;
    const magnitude = normVec3(edgeSumVector);
    const ok =
      nearlyEqual(magnitude, 2 / Math.sqrt(3)) &&
      signedAxisFromVector(normalizedAxis) === child.signedAxis;

    return {
      childId: child.childId,
      edge: child.edge,
      edgeSumVector: cleanVec3(edgeSumVector),
      normalizedAxis: cleanVec3(normalizedAxis),
      signedAxis: child.signedAxis,
      magnitude: cleanNumber(magnitude),
      ok,
    };
  });
}

function buildOrientedDifferenceRows(): PSimplexT9OrientedDifferenceRow[] {
  return ORDERED_DIFFERENCE_DEFINITIONS.map((definition) => {
    const rawVector = subVec3(PRIMAL_VECTOR_BY_ID[definition.from], PRIMAL_VECTOR_BY_ID[definition.to]);
    const rawMagnitude = normVec3(rawVector);
    const normalizedDirection = normalizeVec3(rawVector) ?? ZERO_VEC3;
    const cuboctaPattern = cuboctaPatternFor(normalizedDirection);
    const ok =
      nearlyEqual(rawMagnitude, EXPECTED_ROOT_MAGNITUDE) &&
      matchesCuboctaDirection(normalizedDirection) &&
      cuboctaPattern !== null;

    return {
      rootId: definition.rootId,
      from: definition.from,
      to: definition.to,
      rawVector: cleanVec3(rawVector),
      rawMagnitude: cleanNumber(rawMagnitude),
      normalizedDirection: cleanVec3(normalizedDirection),
      cuboctaPattern: cuboctaPattern ?? '(0,+,+)',
      ok,
    };
  });
}

function buildOppositePairRows(orientedRows: PSimplexT9OrientedDifferenceRow[]): PSimplexT9OppositePairRow[] {
  return CHILD_DEFINITIONS.map((child) => {
    const [from, to] = child.endpoints;
    const forwardRootId = rootIdFor(from, to);
    const reverseRootId = rootIdFor(to, from);
    const forwardRow = requireRootRow(orientedRows, forwardRootId);
    const reverseRow = requireRootRow(orientedRows, reverseRootId);
    const sumVector = addVec3(forwardRow.rawVector, reverseRow.rawVector);
    const reverseIsNegative = isNearZeroVec3(sumVector);

    return {
      unorderedPair: child.edge,
      forwardRootId,
      reverseRootId,
      forwardVector: copyVec3(forwardRow.rawVector),
      reverseVector: copyVec3(reverseRow.rawVector),
      sumVector: cleanVec3(sumVector),
      reverseIsNegative,
      ok: reverseIsNegative,
    };
  });
}

function buildEqualMagnitudeCheck(
  orientedRows: PSimplexT9OrientedDifferenceRow[],
): PSimplexT9EqualMagnitudeCheck {
  const observedMagnitudes = orientedRows.map((row) => row.rawMagnitude);
  const commonMagnitude = observedMagnitudes[0] ?? 0;
  const allEqualMagnitude =
    observedMagnitudes.length === 12 &&
    observedMagnitudes.every(
      (magnitude) => nearlyEqual(magnitude, commonMagnitude) && nearlyEqual(magnitude, EXPECTED_ROOT_MAGNITUDE),
    );

  return {
    expectedSquaredMagnitude: cleanNumber(EXPECTED_ROOT_SQUARED_MAGNITUDE),
    expectedMagnitude: cleanNumber(EXPECTED_ROOT_MAGNITUDE),
    observedMagnitudes: observedMagnitudes.map(cleanNumber),
    commonMagnitude: cleanNumber(commonMagnitude),
    allEqualMagnitude,
    ok: allEqualMagnitude,
  };
}

function buildCuboctaCoordinateRows(
  orientedRows: PSimplexT9OrientedDifferenceRow[],
): PSimplexT9CuboctaCoordinateRow[] {
  return orientedRows.map((row) => {
    const zeroCoordinate = zeroCoordinateFor(row.normalizedDirection);
    const expectedPatternFamily = patternFamilyFor(zeroCoordinate);
    const matchesCuboctaPattern = matchesCuboctaDirection(row.normalizedDirection);

    return {
      rootId: row.rootId,
      normalizedDirection: copyVec3(row.normalizedDirection),
      zeroCoordinate,
      nonzeroCoordinateSigns: nonzeroCoordinateSignsFor(row.normalizedDirection),
      expectedPatternFamily,
      matchesCuboctaPattern,
      ok: matchesCuboctaPattern,
    };
  });
}

function buildSimpleRootCartanCheck(): PSimplexT9SimpleRootCartanCheck {
  const alpha1 = subVec3(PRIMAL_VECTOR_BY_ID.A, PRIMAL_VECTOR_BY_ID.B);
  const alpha2 = subVec3(PRIMAL_VECTOR_BY_ID.B, PRIMAL_VECTOR_BY_ID.C);
  const alpha3 = subVec3(PRIMAL_VECTOR_BY_ID.C, PRIMAL_VECTOR_BY_ID.D);
  const simpleRoots: PSimplexT9SimpleRootCartanCheck['simpleRoots'] = [
    {
      rootId: 'alpha1',
      definition: 'a-b',
      vector: cleanVec3(alpha1),
      squaredMagnitude: cleanNumber(dotVec3(alpha1, alpha1)),
    },
    {
      rootId: 'alpha2',
      definition: 'b-c',
      vector: cleanVec3(alpha2),
      squaredMagnitude: cleanNumber(dotVec3(alpha2, alpha2)),
    },
    {
      rootId: 'alpha3',
      definition: 'c-d',
      vector: cleanVec3(alpha3),
      squaredMagnitude: cleanNumber(dotVec3(alpha3, alpha3)),
    },
  ];
  const roots = [alpha1, alpha2, alpha3];
  const dotProducts = {
    alpha1_alpha2: cleanNumber(dotVec3(alpha1, alpha2)),
    alpha2_alpha3: cleanNumber(dotVec3(alpha2, alpha3)),
    alpha1_alpha3: cleanNumber(dotVec3(alpha1, alpha3)),
  };
  const cartanMatrix = roots.map((left) =>
    roots.map((right) => cleanNumber((2 * dotVec3(left, right)) / dotVec3(right, right))),
  );
  const expectedCartanMatrix = [
    [2, -1, 0],
    [-1, 2, -1],
    [0, -1, 2],
  ];
  const ok =
    simpleRoots.every((row) => nearlyEqual(row.squaredMagnitude, EXPECTED_ROOT_SQUARED_MAGNITUDE)) &&
    nearlyEqual(dotProducts.alpha1_alpha2, -4 / 3) &&
    nearlyEqual(dotProducts.alpha2_alpha3, -4 / 3) &&
    nearlyEqual(dotProducts.alpha1_alpha3, 0) &&
    matricesNearlyEqual(cartanMatrix, expectedCartanMatrix);

  return {
    simpleRoots,
    dotProducts,
    expectedSquaredMagnitude: cleanNumber(EXPECTED_ROOT_SQUARED_MAGNITUDE),
    expectedAdjacentDot: cleanNumber(-4 / 3),
    expectedNonAdjacentDot: 0,
    cartanMatrix,
    expectedCartanMatrix,
    ok,
  };
}

function buildS4CovarianceRows(
  orientedRows: PSimplexT9OrientedDifferenceRow[],
): PSimplexT9S4CovarianceRow[] {
  const rootRowsById = new Map(orientedRows.map((row) => [row.rootId, row]));
  const baseBasis = matrixFromColumns(PRIMAL_VECTOR_BY_ID.A, PRIMAL_VECTOR_BY_ID.B, PRIMAL_VECTOR_BY_ID.C);
  const inverseBaseBasis = inverseMat3(baseBasis);

  return permutations([...SOURCE_IDS]).map((permutation) => {
    const mapping = mappingFromPermutation(permutation);
    const targetBasis = matrixFromColumns(
      PRIMAL_VECTOR_BY_ID[mapping.A],
      PRIMAL_VECTOR_BY_ID[mapping.B],
      PRIMAL_VECTOR_BY_ID[mapping.C],
    );
    const transform = multiplyMat3(targetBasis, inverseBaseBasis);
    const determinant = detMat3(transform);
    const orthogonal = isOrthogonalMat3(transform);
    const checkedResults = orientedRows.map((row) => {
      const mappedRootId = rootIdFor(mapping[row.from], mapping[row.to]);
      const mappedRow = rootRowsById.get(mappedRootId);
      const transformedVector = multiplyMat3Vec3(transform, row.rawVector);

      return mappedRow ? isNearZeroVec3(subVec3(transformedVector, mappedRow.rawVector)) : false;
    });
    const rootSetPermuted = checkedResults.every(Boolean);

    return {
      permutationId: permutationIdFor(mapping),
      mapping,
      determinant: cleanNumber(determinant),
      orthogonal,
      rootSetPermuted,
      checkedRootCount: checkedResults.length,
      ok: orthogonal && rootSetPermuted && checkedResults.length === 12 && nearlyEqual(Math.abs(determinant), 1),
    };
  });
}

function buildChildAxisRootProjectionRows(
  childAxisRows: PSimplexT9ChildAxisRow[],
  orientedRows: PSimplexT9OrientedDifferenceRow[],
): PSimplexT9ChildAxisRootProjectionRow[] {
  return childAxisRows.flatMap((childAxisRow) =>
    orientedRows.map((rootRow) => {
      const projection = dotVec3(childAxisRow.normalizedAxis, rootRow.normalizedDirection);
      const absoluteProjection = Math.abs(projection);
      const projectionClass = projectionClassFor(projection);
      const ok =
        projectionClass === 'orthogonal'
          ? nearlyEqual(projection, 0)
          : nearlyEqual(absoluteProjection, MAX_PROJECTION);

      return {
        childId: childAxisRow.childId,
        signedChildAxis: childAxisRow.signedAxis,
        rootId: rootRow.rootId,
        rootDirection: copyVec3(rootRow.normalizedDirection),
        projection: cleanNumber(projection),
        absoluteProjection: cleanNumber(absoluteProjection),
        projectionClass,
        ok,
      };
    }),
  );
}

function buildProjectionPatternSummaryRows(
  projectionRows: PSimplexT9ChildAxisRootProjectionRow[],
): PSimplexT9ProjectionPatternSummaryRow[] {
  return CHILD_DEFINITIONS.map((child) => {
    const rows = projectionRows.filter((row) => row.childId === child.childId);
    const orthogonalCount = rows.filter((row) => row.projectionClass === 'orthogonal').length;
    const positiveMaximalCount = rows.filter((row) => row.projectionClass === 'positive-maximal').length;
    const negativeMaximalCount = rows.filter((row) => row.projectionClass === 'negative-maximal').length;

    return {
      childId: child.childId,
      signedChildAxis: child.signedAxis,
      orthogonalCount,
      positiveMaximalCount,
      negativeMaximalCount,
      ok:
        rows.length === 12 &&
        orthogonalCount === 4 &&
        positiveMaximalCount === 4 &&
        negativeMaximalCount === 4,
    };
  });
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT9InvalidInterpretationBoundaryRow[] {
  return [
    { boundaryId: 'no-walks', statement: 'no walks', enforced: true },
    { boundaryId: 'no-routes', statement: 'no routes', enforced: true },
    { boundaryId: 'no-holonomy', statement: 'no holonomy', enforced: true },
    { boundaryId: 'no-vortices', statement: 'no vortices', enforced: true },
    { boundaryId: 'no-defects', statement: 'no defects', enforced: true },
    { boundaryId: 'no-a3-cubocta-field-dynamics', statement: 'no A3/cubocta field dynamics', enforced: true },
    { boundaryId: 'not-field-cue', statement: 'not FieldCue', enforced: true },
    { boundaryId: 'not-semantic-naming', statement: 'not semantic naming', enforced: true },
    { boundaryId: 'not-dense-geometry-sampling', statement: 'not dense geometry sampling', enforced: true },
    { boundaryId: 'not-field-atlas', statement: 'not FieldAtlas', enforced: true },
    { boundaryId: 'not-rendering', statement: 'not rendering', enforced: true },
    { boundaryId: 'not-vector-lg-dynamics', statement: 'not vector-LG dynamics', enforced: true },
  ];
}

function buildSummary(args: {
  primalSourceRows: PSimplexT9PrimalSourceRow[];
  childAxisRows: PSimplexT9ChildAxisRow[];
  orientedDifferenceRows: PSimplexT9OrientedDifferenceRow[];
  oppositePairRows: PSimplexT9OppositePairRow[];
  cuboctaCoordinateRows: PSimplexT9CuboctaCoordinateRow[];
  simpleRootCartanCheck: PSimplexT9SimpleRootCartanCheck;
  equalMagnitudeCheck: PSimplexT9EqualMagnitudeCheck;
  s4CovarianceRows: PSimplexT9S4CovarianceRow[];
  childAxisRootProjectionRows: PSimplexT9ChildAxisRootProjectionRow[];
  projectionPatternSummaryRows: PSimplexT9ProjectionPatternSummaryRow[];
}): PSimplexT9Summary {
  return {
    primalSourceCount: args.primalSourceRows.length,
    childAxisCount: args.childAxisRows.length,
    orientedDifferenceCount: args.orientedDifferenceRows.length,
    oppositePairCount: args.oppositePairRows.length,
    cuboctaDirectionCount: uniqueVec3Count(args.orientedDifferenceRows.map((row) => row.normalizedDirection)),
    s4PermutationCount: args.s4CovarianceRows.length,
    projectionRowCount: args.childAxisRootProjectionRows.length,
    projectionSummaryRowCount: args.projectionPatternSummaryRows.length,
    simpleRootCheckPassed: args.simpleRootCartanCheck.ok,
    equalMagnitudeCheckPassed: args.equalMagnitudeCheck.ok,
    cuboctaCoordinateCheckPassed: args.cuboctaCoordinateRows.every((row) => row.ok),
    oppositePairCheckPassed: args.oppositePairRows.every((row) => row.ok),
    s4CovarianceCheckPassed: args.s4CovarianceRows.length === 24 && args.s4CovarianceRows.every((row) => row.ok),
    childAxisProjectionCheckPassed:
      args.childAxisRootProjectionRows.length === 72 &&
      args.childAxisRootProjectionRows.every((row) => row.ok) &&
      args.projectionPatternSummaryRows.length === 6 &&
      args.projectionPatternSummaryRows.every((row) => row.ok),
  };
}

function buildIntegrityIssues(args: {
  primalSourceRows: PSimplexT9PrimalSourceRow[];
  childAxisRows: PSimplexT9ChildAxisRow[];
  orientedDifferenceRows: PSimplexT9OrientedDifferenceRow[];
  oppositePairRows: PSimplexT9OppositePairRow[];
  equalMagnitudeCheck: PSimplexT9EqualMagnitudeCheck;
  cuboctaCoordinateRows: PSimplexT9CuboctaCoordinateRow[];
  simpleRootCartanCheck: PSimplexT9SimpleRootCartanCheck;
  s4CovarianceRows: PSimplexT9S4CovarianceRow[];
  childAxisRootProjectionRows: PSimplexT9ChildAxisRootProjectionRow[];
  projectionPatternSummaryRows: PSimplexT9ProjectionPatternSummaryRow[];
  invalidInterpretationBoundaryRows: PSimplexT9InvalidInterpretationBoundaryRow[];
  summary: PSimplexT9Summary;
}): string[] {
  const issues: string[] = [];

  if (args.primalSourceRows.length !== 4) {
    issues.push(`Expected 4 primalSourceRows, got ${args.primalSourceRows.length}.`);
  }

  if (!primalSourcesAreRegular(args.primalSourceRows)) {
    issues.push('Primal source vectors are not a regular zero-sum tetrahedral fixture.');
  }

  if (args.childAxisRows.length !== 6) {
    issues.push(`Expected 6 childAxisRows, got ${args.childAxisRows.length}.`);
  }

  if (args.childAxisRows.some((row) => !row.ok)) {
    issues.push('At least one child axis row failed its signed octahedral axis check.');
  }

  if (args.orientedDifferenceRows.length !== 12) {
    issues.push(`Expected 12 orientedDifferenceRows, got ${args.orientedDifferenceRows.length}.`);
  }

  if (args.orientedDifferenceRows.some((row) => !row.ok)) {
    issues.push('At least one oriented difference did not match the A3/cubocta direction fixture.');
  }

  if (args.oppositePairRows.length !== 6) {
    issues.push(`Expected 6 oppositePairRows, got ${args.oppositePairRows.length}.`);
  }

  if (args.oppositePairRows.some((row) => !row.ok)) {
    issues.push('At least one opposite root pair failed r_ji = -r_ij.');
  }

  if (!args.equalMagnitudeCheck.ok) {
    issues.push('Equal-magnitude root check failed.');
  }

  if (args.cuboctaCoordinateRows.length !== 12) {
    issues.push(`Expected 12 cuboctaCoordinateRows, got ${args.cuboctaCoordinateRows.length}.`);
  }

  if (args.cuboctaCoordinateRows.some((row) => !row.ok) || args.summary.cuboctaDirectionCount !== 12) {
    issues.push('Cubocta coordinate check failed or did not produce 12 unique directions.');
  }

  if (!args.simpleRootCartanCheck.ok) {
    issues.push('A3 simple-root Cartan check failed.');
  }

  if (args.s4CovarianceRows.length !== 24) {
    issues.push(`Expected 24 s4CovarianceRows, got ${args.s4CovarianceRows.length}.`);
  }

  if (args.s4CovarianceRows.some((row) => !row.ok)) {
    issues.push('At least one S4 covariance row failed.');
  }

  if (args.childAxisRootProjectionRows.length !== 72) {
    issues.push(`Expected 72 childAxisRootProjectionRows, got ${args.childAxisRootProjectionRows.length}.`);
  }

  if (args.childAxisRootProjectionRows.some((row) => !row.ok)) {
    issues.push('At least one child-axis/root projection row failed.');
  }

  if (args.projectionPatternSummaryRows.length !== 6) {
    issues.push(`Expected 6 projectionPatternSummaryRows, got ${args.projectionPatternSummaryRows.length}.`);
  }

  if (args.projectionPatternSummaryRows.some((row) => !row.ok)) {
    issues.push('At least one projection summary row is not 4/4/4.');
  }

  if (args.invalidInterpretationBoundaryRows.some((row) => !row.enforced)) {
    issues.push('At least one invalid interpretation boundary row is not enforced.');
  }

  if (forbiddenPositiveClaimAppears(args.invalidInterpretationBoundaryRows)) {
    issues.push('Forbidden positive interpretation claim appears in boundary rows.');
  }

  return [...new Set(issues)];
}

function classifyVerdict(integrityIssues: string[], summary: PSimplexT9Summary): PSimplexT9Verdict {
  if (integrityIssues.length > 0) {
    return 'FAIL';
  }

  if (!summary.s4CovarianceCheckPassed || !summary.childAxisProjectionCheckPassed) {
    return 'PARTIAL';
  }

  return 'PASS';
}

function recommendationForVerdict(verdict: PSimplexT9Verdict): PSimplexT9FinalRecommendation {
  if (verdict === 'PASS') {
    return 'define-oriented-difference-root-entry-into-carrier-or-residual-channel';
  }

  if (verdict === 'PARTIAL') {
    return 'refine-projection-incidence-relation-before-moving-forward';
  }

  return 'a3-cubocta-horizon-not-claimable-from-current-p-simplex';
}

function primalSourcesAreRegular(rows: PSimplexT9PrimalSourceRow[]): boolean {
  const sourceSum = sumVec3(rows.map((row) => row.vector));

  return rows.every((row) => nearlyEqual(row.magnitude, 1)) && isNearZeroVec3(sourceSum);
}

function cuboctaPatternFor(direction: PSimplexT9Vec3): PSimplexT9CuboctaPattern | null {
  const signTokens = direction.map((value) => {
    if (Math.abs(value) <= EPSILON) {
      return '0';
    }

    return value > 0 ? '+' : '-';
  });
  const pattern = `(${signTokens[0]},${signTokens[1]},${signTokens[2]})`;

  return isCuboctaPattern(pattern) ? pattern : null;
}

function isCuboctaPattern(value: string): value is PSimplexT9CuboctaPattern {
  return [
    '(0,+,+)',
    '(0,+,-)',
    '(0,-,+)',
    '(0,-,-)',
    '(+,0,+)',
    '(+,0,-)',
    '(-,0,+)',
    '(-,0,-)',
    '(+,+,0)',
    '(+,-,0)',
    '(-,+,0)',
    '(-,-,0)',
  ].includes(value);
}

function matchesCuboctaDirection(direction: PSimplexT9Vec3): boolean {
  const absValues = direction.map(Math.abs);
  const zeroCount = absValues.filter((value) => value <= EPSILON).length;
  const nonzeroValues = absValues.filter((value) => value > EPSILON);

  return zeroCount === 1 && nonzeroValues.every((value) => nearlyEqual(value, MAX_PROJECTION));
}

function zeroCoordinateFor(direction: PSimplexT9Vec3): 'x' | 'y' | 'z' {
  if (Math.abs(direction[0]) <= EPSILON) {
    return 'x';
  }

  if (Math.abs(direction[1]) <= EPSILON) {
    return 'y';
  }

  return 'z';
}

function patternFamilyFor(zeroCoordinate: 'x' | 'y' | 'z'): PSimplexT9CuboctaPatternFamily {
  if (zeroCoordinate === 'x') {
    return '(0,+/-1,+/-1)/sqrt2';
  }

  if (zeroCoordinate === 'y') {
    return '(+/-1,0,+/-1)/sqrt2';
  }

  return '(+/-1,+/-1,0)/sqrt2';
}

function nonzeroCoordinateSignsFor(direction: PSimplexT9Vec3): string {
  return direction
    .map((value, index) => ({ axis: ['x', 'y', 'z'][index], value }))
    .filter(({ value }) => Math.abs(value) > EPSILON)
    .map(({ axis, value }) => `${axis}${value > 0 ? '+' : '-'}`)
    .join(',');
}

function signedAxisFromVector(vector: PSimplexT9Vec3): PSimplexT9SignedAxis | null {
  const axis = zeroCleanDominantAxis(vector);

  if (!axis) {
    return null;
  }

  const [coordinate, value] = axis;
  const sign = value > 0 ? '+' : '-';

  return `${sign}${coordinate}` as PSimplexT9SignedAxis;
}

function zeroCleanDominantAxis(vector: PSimplexT9Vec3): ['x' | 'y' | 'z', number] | null {
  const nonzeroEntries = vector
    .map((value, index) => ({ axis: ['x', 'y', 'z'][index] as 'x' | 'y' | 'z', value }))
    .filter(({ value }) => Math.abs(value) > EPSILON);

  return nonzeroEntries.length === 1 ? [nonzeroEntries[0].axis, nonzeroEntries[0].value] : null;
}

function projectionClassFor(projection: number): PSimplexT9ProjectionClass {
  if (Math.abs(projection) <= EPSILON) {
    return 'orthogonal';
  }

  return projection > 0 ? 'positive-maximal' : 'negative-maximal';
}

function rootIdFor(from: PSimplexT9PrimalSourceId, to: PSimplexT9PrimalSourceId): PSimplexT9RootId {
  return `r_${from}${to}` as PSimplexT9RootId;
}

function requireRootRow(
  rows: PSimplexT9OrientedDifferenceRow[],
  rootId: PSimplexT9RootId,
): PSimplexT9OrientedDifferenceRow {
  const row = rows.find((candidate) => candidate.rootId === rootId);

  if (!row) {
    throw new Error(`Missing oriented root ${rootId}`);
  }

  return row;
}

function permutations<T>(values: T[]): T[][] {
  if (values.length <= 1) {
    return [values];
  }

  return values.flatMap((value, index) => {
    const remaining = [...values.slice(0, index), ...values.slice(index + 1)];

    return permutations(remaining).map((permutation) => [value, ...permutation]);
  });
}

function mappingFromPermutation(
  permutation: PSimplexT9PrimalSourceId[],
): Record<PSimplexT9PrimalSourceId, PSimplexT9PrimalSourceId> {
  return {
    A: permutation[0],
    B: permutation[1],
    C: permutation[2],
    D: permutation[3],
  };
}

function permutationIdFor(mapping: Record<PSimplexT9PrimalSourceId, PSimplexT9PrimalSourceId>): string {
  return `A${mapping.A}_B${mapping.B}_C${mapping.C}_D${mapping.D}`;
}

function uniqueVec3Count(values: PSimplexT9Vec3[]): number {
  return new Set(values.map((value) => cleanVec3(value).join(','))).size;
}

function addVec3(left: PSimplexT9Vec3, right: PSimplexT9Vec3): PSimplexT9Vec3 {
  return [left[0] + right[0], left[1] + right[1], left[2] + right[2]];
}

function subVec3(left: PSimplexT9Vec3, right: PSimplexT9Vec3): PSimplexT9Vec3 {
  return [left[0] - right[0], left[1] - right[1], left[2] - right[2]];
}

function scaleVec3(value: PSimplexT9Vec3, scale: number): PSimplexT9Vec3 {
  return [value[0] * scale, value[1] * scale, value[2] * scale];
}

function dotVec3(left: PSimplexT9Vec3, right: PSimplexT9Vec3): number {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

function normVec3(value: PSimplexT9Vec3): number {
  return Math.sqrt(dotVec3(value, value));
}

function normalizeVec3(value: PSimplexT9Vec3): PSimplexT9Vec3 | null {
  const magnitude = normVec3(value);

  return magnitude <= EPSILON ? null : scaleVec3(value, 1 / magnitude);
}

function sumVec3(values: PSimplexT9Vec3[]): PSimplexT9Vec3 {
  return values.reduce<PSimplexT9Vec3>((sum, value) => addVec3(sum, value), [0, 0, 0]);
}

function isNearZeroVec3(value: PSimplexT9Vec3): boolean {
  return normVec3(value) <= EPSILON;
}

function matrixFromColumns(
  first: PSimplexT9Vec3,
  second: PSimplexT9Vec3,
  third: PSimplexT9Vec3,
): PSimplexT9Mat3 {
  return [
    [first[0], second[0], third[0]],
    [first[1], second[1], third[1]],
    [first[2], second[2], third[2]],
  ];
}

function multiplyMat3(left: PSimplexT9Mat3, right: PSimplexT9Mat3): PSimplexT9Mat3 {
  return [
    [
      left[0][0] * right[0][0] + left[0][1] * right[1][0] + left[0][2] * right[2][0],
      left[0][0] * right[0][1] + left[0][1] * right[1][1] + left[0][2] * right[2][1],
      left[0][0] * right[0][2] + left[0][1] * right[1][2] + left[0][2] * right[2][2],
    ],
    [
      left[1][0] * right[0][0] + left[1][1] * right[1][0] + left[1][2] * right[2][0],
      left[1][0] * right[0][1] + left[1][1] * right[1][1] + left[1][2] * right[2][1],
      left[1][0] * right[0][2] + left[1][1] * right[1][2] + left[1][2] * right[2][2],
    ],
    [
      left[2][0] * right[0][0] + left[2][1] * right[1][0] + left[2][2] * right[2][0],
      left[2][0] * right[0][1] + left[2][1] * right[1][1] + left[2][2] * right[2][1],
      left[2][0] * right[0][2] + left[2][1] * right[1][2] + left[2][2] * right[2][2],
    ],
  ];
}

function multiplyMat3Vec3(matrix: PSimplexT9Mat3, vector: PSimplexT9Vec3): PSimplexT9Vec3 {
  return [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2],
    matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2],
  ];
}

function transposeMat3(matrix: PSimplexT9Mat3): PSimplexT9Mat3 {
  return [
    [matrix[0][0], matrix[1][0], matrix[2][0]],
    [matrix[0][1], matrix[1][1], matrix[2][1]],
    [matrix[0][2], matrix[1][2], matrix[2][2]],
  ];
}

function inverseMat3(matrix: PSimplexT9Mat3): PSimplexT9Mat3 {
  const determinant = detMat3(matrix);

  if (Math.abs(determinant) <= EPSILON) {
    throw new Error('Cannot invert singular 3x3 matrix.');
  }

  const [
    [a, b, c],
    [d, e, f],
    [g, h, i],
  ] = matrix;

  return [
    [(e * i - f * h) / determinant, (c * h - b * i) / determinant, (b * f - c * e) / determinant],
    [(f * g - d * i) / determinant, (a * i - c * g) / determinant, (c * d - a * f) / determinant],
    [(d * h - e * g) / determinant, (b * g - a * h) / determinant, (a * e - b * d) / determinant],
  ];
}

function detMat3(matrix: PSimplexT9Mat3): number {
  const [
    [a, b, c],
    [d, e, f],
    [g, h, i],
  ] = matrix;

  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

function isOrthogonalMat3(matrix: PSimplexT9Mat3): boolean {
  const product = multiplyMat3(transposeMat3(matrix), matrix);
  const identity = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];

  return matricesNearlyEqual(product, identity);
}

function matricesNearlyEqual(left: number[][], right: number[][]): boolean {
  return left.every((row, rowIndex) =>
    row.every((value, columnIndex) => nearlyEqual(value, right[rowIndex][columnIndex])),
  );
}

function forbiddenPositiveClaimAppears(rows: PSimplexT9InvalidInterpretationBoundaryRow[]): boolean {
  return rows.some((row) => {
    const value = row.statement.toLowerCase();

    if (value.startsWith('no ') || value.startsWith('not ')) {
      return false;
    }

    return [
      'walks exist',
      'routes exist',
      'holonomy exists',
      'vortices exist',
      'defects exist',
      'a3/cubocta field dynamics are implemented',
      'fieldcue exists',
      'semantic naming is active',
      'dense geometry sampling is authorized',
    ].some((claim) => value.includes(claim));
  });
}

function nearlyEqual(left: number, right: number): boolean {
  return Math.abs(left - right) <= EPSILON;
}

function copyVec3(value: PSimplexT9Vec3): PSimplexT9Vec3 {
  return [value[0], value[1], value[2]];
}

function cleanVec3(value: PSimplexT9Vec3): PSimplexT9Vec3 {
  return [cleanNumber(value[0]), cleanNumber(value[1]), cleanNumber(value[2])];
}

function cleanNumber(value: number): number {
  if (Math.abs(value) <= EPSILON) {
    return 0;
  }

  return Number(value.toFixed(12));
}

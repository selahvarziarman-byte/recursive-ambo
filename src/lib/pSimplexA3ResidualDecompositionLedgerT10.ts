import {
  buildPSimplexA3CuboctaOrientedDifferenceLedgerT9Report,
  type PSimplexT9ChildId,
  type PSimplexT9PrimalSourceId,
  type PSimplexT9RootId,
  type PSimplexT9Vec3,
} from './pSimplexA3CuboctaOrientedDifferenceLedgerT9';
import {
  buildPSimplexMinimalGeometryPositionVectorDiagnosticV0Report,
  type PSimplexV0ApprovedProbeClass,
  type PSimplexV0ApprovedProbeVectorRow,
} from './pSimplexMinimalGeometryPositionVectorDiagnosticV0';

export type PSimplexT10ProbeCase = 'R0' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5';
export type PSimplexT10ResidualStatus =
  | 'no-residual'
  | 'A3-root-aligned-residual'
  | 'A3-root-composite-residual'
  | 'octa-axis-leakage'
  | 'mixed-residual'
  | 'unclassified-residual'
  | 'axis-clean-secondary-residual'
  | 'axis-suppressed-residual';
export type PSimplexT10ProbeCaseExpectedStatus =
  | 'no-residual'
  | 'A3-root-aligned-residual'
  | 'A3-root-composite-residual-or-mixed'
  | 'not-automatically-A3-root';
export type PSimplexT10Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT10FinalRecommendation =
  | 'define-first-vector-lg-potential-or-formalize-a3-residual-channel'
  | 'refine-residual-taxonomy-before-vector-lg'
  | 'return-to-child-axis-only-sampling';

export interface PSimplexT10OrientedRootReferenceRow {
  rootId: string;
  rawVector: PSimplexT9Vec3;
  normalizedDirection: PSimplexT9Vec3;
  cuboctaPattern: string;
}

export interface PSimplexT10ResidualProbeCaseRow {
  probeCase: PSimplexT10ProbeCase;
  description: string;
  expectedStatus: PSimplexT10ProbeCaseExpectedStatus;
  rowCount: number;
  ok: boolean;
}

export interface PSimplexT10ResidualDecompositionRow {
  rowId: string;
  targetChild: PSimplexT9ChildId;
  probeCase: PSimplexT10ProbeCase;
  caseVariant: string;
  construction: string;
  activeSourceWeights: Record<string, number>;
  phi: PSimplexT9Vec3;
  targetAxis: PSimplexT9Vec3;
  p: number;
  residualVector: PSimplexT9Vec3;
  residualMagnitude: number;
  alpha: number;
  bestMatchingRootId: string | null;
  bestMatchingRootDirection: PSimplexT9Vec3 | null;
  rootAlignmentScoreBeta: number;
  rootAlignmentThreshold: 0.9;
  octaAxisLeakageScore?: number;
  residualStatus: PSimplexT10ResidualStatus;
  cleanAxisReadingAllowed: boolean;
  expectedResidualRootId?: string;
  expectedStatusClass: string;
  expectedClassificationMatched: boolean;
  notes: string;
}

export interface PSimplexT10ResidualStatusDistributionRow {
  residualStatus: string;
  count: number;
}

export interface PSimplexT10ResidualExampleRow {
  exampleId: string;
  sourceRowId: string;
  targetChild: string;
  probeCase: string;
  statement: string;
  residualStatus: string;
  bestMatchingRootId: string | null;
  beta: number;
  ok: boolean;
}

export interface PSimplexT10InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT10Summary {
  orientedRootReferenceCount: number;
  residualProbeCaseCount: number;
  residualDecompositionRowCount: number;
  noResidualCount: number;
  rootAlignedResidualCount: number;
  compositeResidualCount: number;
  octaAxisLeakageCount: number;
  mixedResidualCount: number;
  unclassifiedResidualCount: number;
  endpointParentAsymmetryRowsPass: boolean;
  complementParentAsymmetryRowsPass: boolean;
  sameEndpointSiblingPairRowsPass: boolean;
  singleSiblingNotOverclassified: boolean;
  mixedResidualRowsClassified: boolean;
}

export interface PSimplexA3ResidualDecompositionLedgerT10Report {
  method: 'p-simplex-a3-residual-decomposition-ledger-t10';
  candidatePackage: 'p-simplex-a3-residual-decomposition-structural-ledger-t10';
  parentA3Ledger: 'p-simplex-a3-cubocta-oriented-difference-ledger-t9';
  parentMinimalGeometryDiagnostic: 'p-simplex-minimal-geometry-position-vector-diagnostic-v0';
  diagnosticScope: 'finite-a3-residual-decomposition-ledger-only';
  vectorCarrierStatus: 'r3-vector-order-parameter';
  structuralStatus: 'a3-residual-channel-ledger';
  fieldAtlasStatus: 'not-field-atlas';
  renderingStatus: 'not-rendering';
  solverStatus: 'not-lg-solver';
  fieldCueStatus: 'not-field-cue';
  semanticStatus: 'not-semantic-naming';
  routeStatus: 'no-route-walk-holonomy';
  denseSamplingStatus: 'not-dense-sampling';
  parentA3LedgerStillPasses: boolean;
  parentMinimalGeometryDiagnosticStillPasses: boolean;
  orientedRootReferenceRows: PSimplexT10OrientedRootReferenceRow[];
  residualProbeCaseRows: PSimplexT10ResidualProbeCaseRow[];
  residualDecompositionRows: PSimplexT10ResidualDecompositionRow[];
  residualStatusDistributionRows: PSimplexT10ResidualStatusDistributionRow[];
  residualExampleRows: PSimplexT10ResidualExampleRow[];
  invalidInterpretationBoundaryRows: PSimplexT10InvalidInterpretationBoundaryRow[];
  summary: PSimplexT10Summary;
  verdict: PSimplexT10Verdict;
  finalRecommendation: PSimplexT10FinalRecommendation;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface ChildDefinition {
  childId: PSimplexT9ChildId;
  edge: string;
  endpoints: [PSimplexT9PrimalSourceId, PSimplexT9PrimalSourceId];
  complementEdge: string;
  complementEndpoints: [PSimplexT9PrimalSourceId, PSimplexT9PrimalSourceId];
}

interface ResidualBuildContext {
  rootReferenceRows: PSimplexT10OrientedRootReferenceRow[];
  primalVectorsById: Record<PSimplexT9PrimalSourceId, PSimplexT9Vec3>;
  childVectorsById: Record<PSimplexT9ChildId, PSimplexT9Vec3>;
  targetAxesByChildId: Record<PSimplexT9ChildId, PSimplexT9Vec3>;
}

interface ResidualRowInput {
  targetChild: PSimplexT9ChildId;
  probeCase: PSimplexT10ProbeCase;
  caseVariant: string;
  construction: string;
  activeSourceWeights: Record<string, number>;
  phi: PSimplexT9Vec3;
  expectedResidualRootId?: PSimplexT9RootId;
  expectedStatusClass: string;
  cleanAxisReadingAllowed: boolean;
  notes: string;
}

const EPSILON = 1e-9;
const ROOT_ALIGNMENT_THRESHOLD = 0.9;
const COMPOSITE_ROOT_PROJECTION_THRESHOLD = 0.5;
const CHILD_ORDER: readonly PSimplexT9ChildId[] = ['M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];
const SOURCE_IDS: readonly PSimplexT9PrimalSourceId[] = ['A', 'B', 'C', 'D'];
const APPROVED_PROBE_CLASSES: readonly PSimplexV0ApprovedProbeClass[] = ['G', 'E', 'A+', 'A-'];
const ACTIVE_SOURCE_IDS: readonly string[] = ['A', 'B', 'C', 'D', 'M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];
const ALLOWED_RESIDUAL_STATUSES: readonly PSimplexT10ResidualStatus[] = [
  'no-residual',
  'A3-root-aligned-residual',
  'A3-root-composite-residual',
  'octa-axis-leakage',
  'mixed-residual',
  'unclassified-residual',
  'axis-clean-secondary-residual',
  'axis-suppressed-residual',
];
const CHILD_DEFINITIONS: readonly ChildDefinition[] = [
  { childId: 'M_AB', edge: 'AB', endpoints: ['A', 'B'], complementEdge: 'CD', complementEndpoints: ['C', 'D'] },
  { childId: 'M_AC', edge: 'AC', endpoints: ['A', 'C'], complementEdge: 'BD', complementEndpoints: ['B', 'D'] },
  { childId: 'M_AD', edge: 'AD', endpoints: ['A', 'D'], complementEdge: 'BC', complementEndpoints: ['B', 'C'] },
  { childId: 'M_BC', edge: 'BC', endpoints: ['B', 'C'], complementEdge: 'AD', complementEndpoints: ['A', 'D'] },
  { childId: 'M_BD', edge: 'BD', endpoints: ['B', 'D'], complementEdge: 'AC', complementEndpoints: ['A', 'C'] },
  { childId: 'M_CD', edge: 'CD', endpoints: ['C', 'D'], complementEdge: 'AB', complementEndpoints: ['A', 'B'] },
];

export function buildPSimplexA3ResidualDecompositionLedgerT10Report(): PSimplexA3ResidualDecompositionLedgerT10Report {
  const parentA3Report = buildPSimplexA3CuboctaOrientedDifferenceLedgerT9Report();
  const parentMinimalReport = buildPSimplexMinimalGeometryPositionVectorDiagnosticV0Report();
  const parentA3LedgerStillPasses =
    parentA3Report.ok && parentA3Report.integrityIssueCount === 0 && parentA3Report.verdict === 'PASS';
  const parentMinimalGeometryDiagnosticStillPasses =
    parentMinimalReport.ok &&
    parentMinimalReport.integrityIssueCount === 0 &&
    parentMinimalReport.verdict === 'PASS';
  const orientedRootReferenceRows = buildOrientedRootReferenceRows(parentA3Report.orientedDifferenceRows);
  const context = buildResidualContext(parentA3Report, orientedRootReferenceRows);
  const residualDecompositionRows = buildResidualDecompositionRows(
    parentMinimalReport.approvedProbeVectorRows,
    context,
  );
  const residualProbeCaseRows = buildResidualProbeCaseRows(residualDecompositionRows);
  const residualStatusDistributionRows = buildResidualStatusDistributionRows(residualDecompositionRows);
  const residualExampleRows = buildResidualExampleRows(residualDecompositionRows);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const summary = buildSummary(orientedRootReferenceRows, residualProbeCaseRows, residualDecompositionRows);
  const integrityIssues = buildIntegrityIssues({
    parentA3LedgerStillPasses,
    parentMinimalGeometryDiagnosticStillPasses,
    orientedRootReferenceRows,
    residualProbeCaseRows,
    residualDecompositionRows,
    residualExampleRows,
    invalidInterpretationBoundaryRows,
    summary,
  });
  const verdict = classifyVerdict(integrityIssues, summary);
  const finalRecommendation = recommendationForVerdict(verdict);

  return {
    method: 'p-simplex-a3-residual-decomposition-ledger-t10',
    candidatePackage: 'p-simplex-a3-residual-decomposition-structural-ledger-t10',
    parentA3Ledger: 'p-simplex-a3-cubocta-oriented-difference-ledger-t9',
    parentMinimalGeometryDiagnostic: 'p-simplex-minimal-geometry-position-vector-diagnostic-v0',
    diagnosticScope: 'finite-a3-residual-decomposition-ledger-only',
    vectorCarrierStatus: 'r3-vector-order-parameter',
    structuralStatus: 'a3-residual-channel-ledger',
    fieldAtlasStatus: 'not-field-atlas',
    renderingStatus: 'not-rendering',
    solverStatus: 'not-lg-solver',
    fieldCueStatus: 'not-field-cue',
    semanticStatus: 'not-semantic-naming',
    routeStatus: 'no-route-walk-holonomy',
    denseSamplingStatus: 'not-dense-sampling',
    parentA3LedgerStillPasses,
    parentMinimalGeometryDiagnosticStillPasses,
    orientedRootReferenceRows,
    residualProbeCaseRows,
    residualDecompositionRows,
    residualStatusDistributionRows,
    residualExampleRows,
    invalidInterpretationBoundaryRows,
    summary,
    verdict,
    finalRecommendation,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: verdict !== 'FAIL' && integrityIssues.length === 0,
  };
}

function buildOrientedRootReferenceRows(
  t9Rows: ReturnType<typeof buildPSimplexA3CuboctaOrientedDifferenceLedgerT9Report>['orientedDifferenceRows'],
): PSimplexT10OrientedRootReferenceRow[] {
  return t9Rows.map((row) => ({
    rootId: row.rootId,
    rawVector: copyVec3(row.rawVector),
    normalizedDirection: copyVec3(row.normalizedDirection),
    cuboctaPattern: row.cuboctaPattern,
  }));
}

function buildResidualContext(
  parentA3Report: ReturnType<typeof buildPSimplexA3CuboctaOrientedDifferenceLedgerT9Report>,
  rootReferenceRows: PSimplexT10OrientedRootReferenceRow[],
): ResidualBuildContext {
  const primalVectorsById = Object.fromEntries(
    parentA3Report.primalSourceRows.map((row) => [row.sourceId, row.vector]),
  ) as Record<PSimplexT9PrimalSourceId, PSimplexT9Vec3>;
  const childVectorsById = Object.fromEntries(
    parentA3Report.childAxisRows.map((row) => [row.childId, row.edgeSumVector]),
  ) as Record<PSimplexT9ChildId, PSimplexT9Vec3>;
  const targetAxesByChildId = Object.fromEntries(
    parentA3Report.childAxisRows.map((row) => [row.childId, row.normalizedAxis]),
  ) as Record<PSimplexT9ChildId, PSimplexT9Vec3>;

  return {
    rootReferenceRows,
    primalVectorsById,
    childVectorsById,
    targetAxesByChildId,
  };
}

function buildResidualDecompositionRows(
  approvedRows: PSimplexV0ApprovedProbeVectorRow[],
  context: ResidualBuildContext,
): PSimplexT10ResidualDecompositionRow[] {
  return [
    ...buildR0Rows(approvedRows, context),
    ...CHILD_DEFINITIONS.flatMap((child) => [
      buildR1Row(child, context),
      buildR2Row(child, context),
      ...buildR3Rows(child, context),
      buildR4Row(child, context),
      buildR5Row(child, context),
    ]),
  ].sort(compareResidualRows);
}

function buildR0Rows(
  approvedRows: PSimplexV0ApprovedProbeVectorRow[],
  context: ResidualBuildContext,
): PSimplexT10ResidualDecompositionRow[] {
  return approvedRows
    .filter((row) => APPROVED_PROBE_CLASSES.includes(row.probeClass))
    .map((row) =>
      buildResidualRow({
        targetChild: row.targetChild as PSimplexT9ChildId,
        probeCase: 'R0',
        caseVariant: row.probeClass,
        construction: `approved-clean-probe-${row.probeClass}`,
        activeSourceWeights: { ...row.sourceWeights },
        phi: row.phi,
        expectedStatusClass: 'no-residual',
        cleanAxisReadingAllowed: true,
        notes: 'Approved minimal geometry-position probe remains on the child axis; transverse residual is zero.',
      }, context),
    );
}

function buildR1Row(child: ChildDefinition, context: ResidualBuildContext): PSimplexT10ResidualDecompositionRow {
  const [i, j] = child.endpoints;

  return buildResidualRow({
    targetChild: child.childId,
    probeCase: 'R1',
    caseVariant: `${i}-endpoint-parent`,
    construction: `Phi=q_${i}`,
    activeSourceWeights: sourceWeights({ [i]: 1 }),
    phi: context.primalVectorsById[i],
    expectedResidualRootId: rootIdFor(i, j),
    expectedStatusClass: 'A3-root-aligned-residual',
    cleanAxisReadingAllowed: false,
    notes: 'Endpoint-parent asymmetry is tested as a residual stress case, not as a clean child-axis reading.',
  }, context);
}

function buildR2Row(child: ChildDefinition, context: ResidualBuildContext): PSimplexT10ResidualDecompositionRow {
  const [k, l] = child.complementEndpoints;

  return buildResidualRow({
    targetChild: child.childId,
    probeCase: 'R2',
    caseVariant: `${k}-complement-parent`,
    construction: `Phi=q_${k}`,
    activeSourceWeights: sourceWeights({ [k]: 1 }),
    phi: context.primalVectorsById[k],
    expectedResidualRootId: rootIdFor(k, l),
    expectedStatusClass: 'A3-root-aligned-residual',
    cleanAxisReadingAllowed: false,
    notes: 'Complement-parent asymmetry is decomposed against the complement oriented root.',
  }, context);
}

function buildR3Rows(child: ChildDefinition, context: ResidualBuildContext): PSimplexT10ResidualDecompositionRow[] {
  const [i, j] = child.endpoints;
  const [k, l] = child.complementEndpoints;
  const ik = childIdFor(i, k);
  const il = childIdFor(i, l);
  const jk = childIdFor(j, k);
  const jl = childIdFor(j, l);

  return [
    buildResidualRow({
      targetChild: child.childId,
      probeCase: 'R3',
      caseVariant: `${i}-same-endpoint-sibling-pair`,
      construction: `Phi=q_${edgeFor(i, k)}+q_${edgeFor(i, l)}`,
      activeSourceWeights: sourceWeights({ [ik]: 1, [il]: 1 }),
      phi: addVec3(context.childVectorsById[ik], context.childVectorsById[il]),
      expectedResidualRootId: rootIdFor(i, j),
      expectedStatusClass: 'A3-root-aligned-residual',
      cleanAxisReadingAllowed: false,
      notes: 'Same-endpoint sibling pair reduces to the target oriented parent difference.',
    }, context),
    buildResidualRow({
      targetChild: child.childId,
      probeCase: 'R3',
      caseVariant: `${j}-same-endpoint-sibling-pair`,
      construction: `Phi=q_${edgeFor(j, k)}+q_${edgeFor(j, l)}`,
      activeSourceWeights: sourceWeights({ [jk]: 1, [jl]: 1 }),
      phi: addVec3(context.childVectorsById[jk], context.childVectorsById[jl]),
      expectedResidualRootId: rootIdFor(j, i),
      expectedStatusClass: 'A3-root-aligned-residual',
      cleanAxisReadingAllowed: false,
      notes: 'Opposite same-endpoint sibling pair reduces to the reverse oriented parent difference.',
    }, context),
  ];
}

function buildR4Row(child: ChildDefinition, context: ResidualBuildContext): PSimplexT10ResidualDecompositionRow {
  const sibling = deterministicSibling(child);

  return buildResidualRow({
    targetChild: child.childId,
    probeCase: 'R4',
    caseVariant: sibling,
    construction: `Phi=q_${sibling.slice(2)}`,
    activeSourceWeights: sourceWeights({ [sibling]: 1 }),
    phi: context.childVectorsById[sibling],
    expectedStatusClass: 'not-automatically-A3-root',
    cleanAxisReadingAllowed: false,
    notes: 'Single sibling leakage is reported as octa-axis leakage and is not accepted as a clean single A3 root.',
  }, context);
}

function buildR5Row(child: ChildDefinition, context: ResidualBuildContext): PSimplexT10ResidualDecompositionRow {
  const [i] = child.endpoints;
  const sibling = deterministicSibling(child);

  return buildResidualRow({
    targetChild: child.childId,
    probeCase: 'R5',
    caseVariant: `${i}-endpoint-plus-${sibling}`,
    construction: `Phi=q_${i}+q_${sibling.slice(2)}`,
    activeSourceWeights: sourceWeights({ [i]: 1, [sibling]: 1 }),
    phi: addVec3(context.primalVectorsById[i], context.childVectorsById[sibling]),
    expectedStatusClass: 'A3-root-composite-residual-or-mixed',
    cleanAxisReadingAllowed: false,
    notes: 'Mixed endpoint and sibling asymmetry is classified without promoting it to a clean single-root residual.',
  }, context);
}

function buildResidualRow(input: ResidualRowInput, context: ResidualBuildContext): PSimplexT10ResidualDecompositionRow {
  const targetAxis = context.targetAxesByChildId[input.targetChild];
  const p = dotVec3(input.phi, targetAxis);
  const residualVector = subVec3(input.phi, scaleVec3(targetAxis, p));
  const residualMagnitude = normVec3(residualVector);
  const phiMagnitude = normVec3(input.phi);
  const alpha = phiMagnitude <= EPSILON ? 0 : Math.abs(p) / phiMagnitude;
  const rootMatch = bestMatchingRoot(residualVector, residualMagnitude, context.rootReferenceRows);
  const octaAxisLeakageScore = residualMagnitude <= EPSILON ? 0 : octaAxisScore(residualVector);
  const substantialRootProjectionCount = countSubstantialRootProjections(
    residualVector,
    residualMagnitude,
    context.rootReferenceRows,
  );
  const residualStatus = classifyResidualStatus({
    probeCase: input.probeCase,
    residualMagnitude,
    beta: rootMatch.beta,
    octaAxisLeakageScore,
    substantialRootProjectionCount,
  });
  const expectedClassificationMatched = classificationMatchesExpectation(
    input,
    residualStatus,
    rootMatch.bestMatchingRootId,
  );

  return {
    rowId: rowIdFor(input),
    targetChild: input.targetChild,
    probeCase: input.probeCase,
    caseVariant: input.caseVariant,
    construction: input.construction,
    activeSourceWeights: input.activeSourceWeights,
    phi: cleanVec3(input.phi),
    targetAxis: cleanVec3(targetAxis),
    p: cleanNumber(p),
    residualVector: cleanVec3(residualVector),
    residualMagnitude: cleanNumber(residualMagnitude),
    alpha: cleanNumber(alpha),
    bestMatchingRootId: rootMatch.bestMatchingRootId,
    bestMatchingRootDirection: rootMatch.bestMatchingRootDirection,
    rootAlignmentScoreBeta: cleanNumber(rootMatch.beta),
    rootAlignmentThreshold: ROOT_ALIGNMENT_THRESHOLD,
    octaAxisLeakageScore: cleanNumber(octaAxisLeakageScore),
    residualStatus,
    cleanAxisReadingAllowed: input.cleanAxisReadingAllowed,
    expectedResidualRootId: input.expectedResidualRootId,
    expectedStatusClass: input.expectedStatusClass,
    expectedClassificationMatched,
    notes: input.notes,
  };
}

function classifyResidualStatus(args: {
  probeCase: PSimplexT10ProbeCase;
  residualMagnitude: number;
  beta: number;
  octaAxisLeakageScore: number;
  substantialRootProjectionCount: number;
}): PSimplexT10ResidualStatus {
  if (args.residualMagnitude <= EPSILON) {
    return 'no-residual';
  }

  if (['R1', 'R2', 'R3'].includes(args.probeCase) && args.beta >= ROOT_ALIGNMENT_THRESHOLD) {
    return 'A3-root-aligned-residual';
  }

  if (args.probeCase === 'R4') {
    return args.octaAxisLeakageScore > args.beta ? 'octa-axis-leakage' : 'mixed-residual';
  }

  if (args.probeCase === 'R5') {
    if (args.beta < ROOT_ALIGNMENT_THRESHOLD && args.substantialRootProjectionCount >= 2) {
      return 'A3-root-composite-residual';
    }

    return 'mixed-residual';
  }

  return args.beta >= ROOT_ALIGNMENT_THRESHOLD ? 'mixed-residual' : 'unclassified-residual';
}

function classificationMatchesExpectation(
  input: ResidualRowInput,
  residualStatus: PSimplexT10ResidualStatus,
  bestMatchingRootId: string | null,
): boolean {
  if (input.probeCase === 'R0') {
    return residualStatus === 'no-residual';
  }

  if (['R1', 'R2', 'R3'].includes(input.probeCase)) {
    return (
      residualStatus === 'A3-root-aligned-residual' &&
      bestMatchingRootId === input.expectedResidualRootId
    );
  }

  if (input.probeCase === 'R4') {
    return residualStatus !== 'A3-root-aligned-residual';
  }

  if (input.probeCase === 'R5') {
    return residualStatus !== 'A3-root-aligned-residual' && residualStatus !== 'unclassified-residual';
  }

  return false;
}

function buildResidualProbeCaseRows(
  rows: PSimplexT10ResidualDecompositionRow[],
): PSimplexT10ResidualProbeCaseRow[] {
  return [
    {
      probeCase: 'R0',
      description: 'Approved minimal geometry-position clean probes.',
      expectedStatus: 'no-residual',
      rowCount: rows.filter((row) => row.probeCase === 'R0').length,
      ok: rows.filter((row) => row.probeCase === 'R0').length === 24 &&
        rows.filter((row) => row.probeCase === 'R0').every((row) => row.residualStatus === 'no-residual'),
    },
    {
      probeCase: 'R1',
      description: 'Endpoint-parent asymmetry.',
      expectedStatus: 'A3-root-aligned-residual',
      rowCount: rows.filter((row) => row.probeCase === 'R1').length,
      ok: rows.filter((row) => row.probeCase === 'R1').length === 6 &&
        rows.filter((row) => row.probeCase === 'R1').every((row) => row.expectedClassificationMatched),
    },
    {
      probeCase: 'R2',
      description: 'Complement-parent asymmetry.',
      expectedStatus: 'A3-root-aligned-residual',
      rowCount: rows.filter((row) => row.probeCase === 'R2').length,
      ok: rows.filter((row) => row.probeCase === 'R2').length === 6 &&
        rows.filter((row) => row.probeCase === 'R2').every((row) => row.expectedClassificationMatched),
    },
    {
      probeCase: 'R3',
      description: 'Same-endpoint sibling-pair residual.',
      expectedStatus: 'A3-root-aligned-residual',
      rowCount: rows.filter((row) => row.probeCase === 'R3').length,
      ok: rows.filter((row) => row.probeCase === 'R3').length === 12 &&
        rows.filter((row) => row.probeCase === 'R3').every((row) => row.expectedClassificationMatched),
    },
    {
      probeCase: 'R4',
      description: 'Single sibling leakage.',
      expectedStatus: 'not-automatically-A3-root',
      rowCount: rows.filter((row) => row.probeCase === 'R4').length,
      ok: rows.filter((row) => row.probeCase === 'R4').length === 6 &&
        rows.filter((row) => row.probeCase === 'R4').every((row) => row.expectedClassificationMatched),
    },
    {
      probeCase: 'R5',
      description: 'Mixed endpoint and sibling asymmetry.',
      expectedStatus: 'A3-root-composite-residual-or-mixed',
      rowCount: rows.filter((row) => row.probeCase === 'R5').length,
      ok: rows.filter((row) => row.probeCase === 'R5').length === 6 &&
        rows.filter((row) => row.probeCase === 'R5').every((row) => row.expectedClassificationMatched),
    },
  ];
}

function buildResidualStatusDistributionRows(
  rows: PSimplexT10ResidualDecompositionRow[],
): PSimplexT10ResidualStatusDistributionRow[] {
  return ALLOWED_RESIDUAL_STATUSES.map((status) => ({
    residualStatus: status,
    count: rows.filter((row) => row.residualStatus === status).length,
  }));
}

function buildResidualExampleRows(
  rows: PSimplexT10ResidualDecompositionRow[],
): PSimplexT10ResidualExampleRow[] {
  return [
    exampleFromRow('parent-asymmetry-to-root', requireExampleRow(rows, 'R1'), 'parent asymmetry resolves to the expected oriented root'),
    exampleFromRow('complement-asymmetry-to-root', requireExampleRow(rows, 'R2'), 'complement asymmetry resolves to the complement oriented root'),
    exampleFromRow(
      'same-endpoint-sibling-pair-forward',
      requireExampleRow(rows, 'R3', (row) => row.caseVariant.startsWith(row.targetChild.slice(2, 3))),
      'same-endpoint sibling pair resolves to the forward target root',
    ),
    exampleFromRow(
      'same-endpoint-sibling-pair-reverse',
      requireExampleRow(rows, 'R3', (row) => !row.caseVariant.startsWith(row.targetChild.slice(2, 3))),
      'same-endpoint sibling pair resolves to the reverse target root',
    ),
    exampleFromRow('single-sibling-leakage', requireExampleRow(rows, 'R4'), 'single sibling leakage is not automatically accepted as an A3 root residual'),
    exampleFromRow('mixed-asymmetric-residual', requireExampleRow(rows, 'R5'), 'mixed asymmetric residual receives a bounded residual classification'),
  ];
}

function exampleFromRow(
  exampleId: string,
  row: PSimplexT10ResidualDecompositionRow,
  statement: string,
): PSimplexT10ResidualExampleRow {
  return {
    exampleId,
    sourceRowId: row.rowId,
    targetChild: row.targetChild,
    probeCase: row.probeCase,
    statement,
    residualStatus: row.residualStatus,
    bestMatchingRootId: row.bestMatchingRootId,
    beta: row.rootAlignmentScoreBeta,
    ok: row.expectedClassificationMatched,
  };
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT10InvalidInterpretationBoundaryRow[] {
  return [
    { boundaryId: 'no-route', statement: 'no route', enforced: true },
    { boundaryId: 'no-walk', statement: 'no walk', enforced: true },
    { boundaryId: 'no-holonomy', statement: 'no holonomy', enforced: true },
    { boundaryId: 'no-vortex', statement: 'no vortex', enforced: true },
    { boundaryId: 'no-defect', statement: 'no defect', enforced: true },
    { boundaryId: 'not-field-cue', statement: 'not FieldCue', enforced: true },
    { boundaryId: 'no-dwelling', statement: 'no dwelling', enforced: true },
    { boundaryId: 'no-semantic-meaning', statement: 'no semantic meaning', enforced: true },
    { boundaryId: 'no-naming-pressure', statement: 'no naming pressure', enforced: true },
    { boundaryId: 'not-vector-lg-dynamics', statement: 'not vector-LG dynamics', enforced: true },
    { boundaryId: 'not-field-dynamics', statement: 'not field dynamics', enforced: true },
    {
      boundaryId: 'structural-residual-decomposition-only',
      statement: 'structural residual decomposition only',
      enforced: true,
    },
  ];
}

function buildSummary(
  rootRows: PSimplexT10OrientedRootReferenceRow[],
  caseRows: PSimplexT10ResidualProbeCaseRow[],
  decompositionRows: PSimplexT10ResidualDecompositionRow[],
): PSimplexT10Summary {
  return {
    orientedRootReferenceCount: rootRows.length,
    residualProbeCaseCount: caseRows.length,
    residualDecompositionRowCount: decompositionRows.length,
    noResidualCount: decompositionRows.filter((row) => row.residualStatus === 'no-residual').length,
    rootAlignedResidualCount: decompositionRows.filter((row) => row.residualStatus === 'A3-root-aligned-residual').length,
    compositeResidualCount: decompositionRows.filter((row) => row.residualStatus === 'A3-root-composite-residual').length,
    octaAxisLeakageCount: decompositionRows.filter((row) => row.residualStatus === 'octa-axis-leakage').length,
    mixedResidualCount: decompositionRows.filter((row) => row.residualStatus === 'mixed-residual').length,
    unclassifiedResidualCount: decompositionRows.filter((row) => row.residualStatus === 'unclassified-residual').length,
    endpointParentAsymmetryRowsPass: caseRows.find((row) => row.probeCase === 'R1')?.ok === true,
    complementParentAsymmetryRowsPass: caseRows.find((row) => row.probeCase === 'R2')?.ok === true,
    sameEndpointSiblingPairRowsPass: caseRows.find((row) => row.probeCase === 'R3')?.ok === true,
    singleSiblingNotOverclassified: caseRows.find((row) => row.probeCase === 'R4')?.ok === true,
    mixedResidualRowsClassified: caseRows.find((row) => row.probeCase === 'R5')?.ok === true,
  };
}

function buildIntegrityIssues(args: {
  parentA3LedgerStillPasses: boolean;
  parentMinimalGeometryDiagnosticStillPasses: boolean;
  orientedRootReferenceRows: PSimplexT10OrientedRootReferenceRow[];
  residualProbeCaseRows: PSimplexT10ResidualProbeCaseRow[];
  residualDecompositionRows: PSimplexT10ResidualDecompositionRow[];
  residualExampleRows: PSimplexT10ResidualExampleRow[];
  invalidInterpretationBoundaryRows: PSimplexT10InvalidInterpretationBoundaryRow[];
  summary: PSimplexT10Summary;
}): string[] {
  const issues: string[] = [];

  if (!args.parentA3LedgerStillPasses) {
    issues.push('Parent T9 A3 ledger does not pass.');
  }

  if (!args.parentMinimalGeometryDiagnosticStillPasses) {
    issues.push('Parent minimal geometry-position diagnostic does not pass.');
  }

  if (args.orientedRootReferenceRows.length !== 12) {
    issues.push(`Expected 12 orientedRootReferenceRows, got ${args.orientedRootReferenceRows.length}.`);
  }

  if (args.residualProbeCaseRows.length !== 6) {
    issues.push(`Expected 6 residualProbeCaseRows, got ${args.residualProbeCaseRows.length}.`);
  }

  if (args.residualProbeCaseRows.some((row) => !row.ok)) {
    issues.push('At least one residual probe case row failed its expected status/count check.');
  }

  if (args.residualDecompositionRows.length !== 60) {
    issues.push(`Expected 60 residualDecompositionRows, got ${args.residualDecompositionRows.length}.`);
  }

  if (rowsForCase(args.residualDecompositionRows, 'R0').some((row) => row.residualStatus !== 'no-residual')) {
    issues.push('At least one R0 row is not no-residual.');
  }

  if (!rowsForCase(args.residualDecompositionRows, 'R1').every((row) => row.expectedClassificationMatched)) {
    issues.push('At least one R1 endpoint-parent asymmetry row failed expected root alignment.');
  }

  if (!rowsForCase(args.residualDecompositionRows, 'R2').every((row) => row.expectedClassificationMatched)) {
    issues.push('At least one R2 complement-parent asymmetry row failed expected root alignment.');
  }

  if (!rowsForCase(args.residualDecompositionRows, 'R3').every((row) => row.expectedClassificationMatched)) {
    issues.push('At least one R3 sibling-pair row failed expected root alignment.');
  }

  if (rowsForCase(args.residualDecompositionRows, 'R4').some((row) => row.residualStatus === 'A3-root-aligned-residual')) {
    issues.push('At least one R4 single-sibling row was overclassified as A3-root-aligned-residual.');
  }

  if (rowsForCase(args.residualDecompositionRows, 'R5').some((row) => row.residualStatus === 'unclassified-residual')) {
    issues.push('At least one R5 mixed residual row has no classification.');
  }

  if (args.residualDecompositionRows.some((row) => !decompositionObservablesPresent(row))) {
    issues.push('At least one residual decomposition row lacks phi, p, R, |R|, alpha, or beta.');
  }

  if (args.residualDecompositionRows.some((row) => row.probeCase !== 'R0' && row.cleanAxisReadingAllowed)) {
    issues.push('At least one R1-R5 row is marked cleanAxisReadingAllowed.');
  }

  if (args.residualExampleRows.length < 6 || args.residualExampleRows.some((row) => !row.ok)) {
    issues.push('Residual example rows are missing or failed expectation checks.');
  }

  if (args.invalidInterpretationBoundaryRows.some((row) => !row.enforced)) {
    issues.push('At least one invalid interpretation boundary is not enforced.');
  }

  if (forbiddenVocabularyAppears(args.residualDecompositionRows, args.residualProbeCaseRows, args.residualExampleRows, args.invalidInterpretationBoundaryRows)) {
    issues.push('Forbidden vocabulary appears outside allowed negative boundary statements.');
  }

  if (args.summary.noResidualCount !== 24 || args.summary.rootAlignedResidualCount < 24) {
    issues.push('Summary residual counts do not meet expected R0/R1/R2/R3 counts.');
  }

  return [...new Set(issues)];
}

function classifyVerdict(integrityIssues: string[], summary: PSimplexT10Summary): PSimplexT10Verdict {
  if (integrityIssues.length > 0) {
    return 'FAIL';
  }

  if (!summary.mixedResidualRowsClassified) {
    return 'PARTIAL';
  }

  return 'PASS';
}

function recommendationForVerdict(verdict: PSimplexT10Verdict): PSimplexT10FinalRecommendation {
  if (verdict === 'PASS') {
    return 'define-first-vector-lg-potential-or-formalize-a3-residual-channel';
  }

  if (verdict === 'PARTIAL') {
    return 'refine-residual-taxonomy-before-vector-lg';
  }

  return 'return-to-child-axis-only-sampling';
}

function bestMatchingRoot(
  residualVector: PSimplexT9Vec3,
  residualMagnitude: number,
  rootRows: PSimplexT10OrientedRootReferenceRow[],
): {
  bestMatchingRootId: string | null;
  bestMatchingRootDirection: PSimplexT9Vec3 | null;
  beta: number;
} {
  if (residualMagnitude <= EPSILON) {
    return {
      bestMatchingRootId: null,
      bestMatchingRootDirection: null,
      beta: 0,
    };
  }

  return rootRows.reduce(
    (best, rootRow) => {
      const projection = clampUnitInterval(dotVec3(residualVector, rootRow.normalizedDirection) / residualMagnitude);

      if (projection > best.beta) {
        return {
          bestMatchingRootId: rootRow.rootId,
          bestMatchingRootDirection: copyVec3(rootRow.normalizedDirection),
          beta: projection,
        };
      }

      return best;
    },
    {
      bestMatchingRootId: null,
      bestMatchingRootDirection: null,
      beta: -Infinity,
    } as {
      bestMatchingRootId: string | null;
      bestMatchingRootDirection: PSimplexT9Vec3 | null;
      beta: number;
    },
  );
}

function countSubstantialRootProjections(
  residualVector: PSimplexT9Vec3,
  residualMagnitude: number,
  rootRows: PSimplexT10OrientedRootReferenceRow[],
): number {
  if (residualMagnitude <= EPSILON) {
    return 0;
  }

  return rootRows.filter(
    (rootRow) => Math.abs(dotVec3(residualVector, rootRow.normalizedDirection) / residualMagnitude) >= COMPOSITE_ROOT_PROJECTION_THRESHOLD,
  ).length;
}

function octaAxisScore(vector: PSimplexT9Vec3): number {
  const magnitude = normVec3(vector);

  return magnitude <= EPSILON ? 0 : Math.max(...vector.map((component) => Math.abs(component) / magnitude));
}

function sourceWeights(nonzeroWeights: Record<string, number>): Record<string, number> {
  return Object.fromEntries(ACTIVE_SOURCE_IDS.map((sourceId) => [sourceId, nonzeroWeights[sourceId] ?? 0]));
}

function rowIdFor(input: ResidualRowInput): string {
  return `${input.probeCase}-${input.targetChild}-${input.caseVariant}`;
}

function rootIdFor(from: PSimplexT9PrimalSourceId, to: PSimplexT9PrimalSourceId): PSimplexT9RootId {
  return `r_${from}${to}` as PSimplexT9RootId;
}

function childIdFor(left: PSimplexT9PrimalSourceId, right: PSimplexT9PrimalSourceId): PSimplexT9ChildId {
  return `M_${edgeFor(left, right)}` as PSimplexT9ChildId;
}

function edgeFor(left: PSimplexT9PrimalSourceId, right: PSimplexT9PrimalSourceId): string {
  return [left, right].sort().join('');
}

function deterministicSibling(child: ChildDefinition): PSimplexT9ChildId {
  const complementChild = `M_${child.complementEdge}` as PSimplexT9ChildId;

  for (const candidate of CHILD_ORDER) {
    if (candidate === child.childId || candidate === complementChild) {
      continue;
    }

    const candidateEndpoints = candidate.slice(2).split('') as [PSimplexT9PrimalSourceId, PSimplexT9PrimalSourceId];
    const sharedEndpointCount = candidateEndpoints.filter((endpoint) => child.endpoints.includes(endpoint)).length;

    if (sharedEndpointCount === 1) {
      return candidate;
    }
  }

  throw new Error(`No deterministic sibling found for ${child.childId}`);
}

function requireExampleRow(
  rows: PSimplexT10ResidualDecompositionRow[],
  probeCase: PSimplexT10ProbeCase,
  predicate: (row: PSimplexT10ResidualDecompositionRow) => boolean = () => true,
): PSimplexT10ResidualDecompositionRow {
  const row = rows.find((candidate) => candidate.probeCase === probeCase && predicate(candidate));

  if (!row) {
    throw new Error(`Missing example row for ${probeCase}`);
  }

  return row;
}

function rowsForCase(
  rows: PSimplexT10ResidualDecompositionRow[],
  probeCase: PSimplexT10ProbeCase,
): PSimplexT10ResidualDecompositionRow[] {
  return rows.filter((row) => row.probeCase === probeCase);
}

function decompositionObservablesPresent(row: PSimplexT10ResidualDecompositionRow): boolean {
  return (
    isVec3(row.phi) &&
    isVec3(row.targetAxis) &&
    isVec3(row.residualVector) &&
    Number.isFinite(row.p) &&
    Number.isFinite(row.residualMagnitude) &&
    Number.isFinite(row.alpha) &&
    Number.isFinite(row.rootAlignmentScoreBeta)
  );
}

function compareResidualRows(
  left: PSimplexT10ResidualDecompositionRow,
  right: PSimplexT10ResidualDecompositionRow,
): number {
  const caseComparison = caseOrder(left.probeCase) - caseOrder(right.probeCase);

  if (caseComparison !== 0) {
    return caseComparison;
  }

  const childComparison = CHILD_ORDER.indexOf(left.targetChild) - CHILD_ORDER.indexOf(right.targetChild);

  if (childComparison !== 0) {
    return childComparison;
  }

  return left.caseVariant.localeCompare(right.caseVariant);
}

function caseOrder(probeCase: PSimplexT10ProbeCase): number {
  return ['R0', 'R1', 'R2', 'R3', 'R4', 'R5'].indexOf(probeCase);
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

function isVec3(value: PSimplexT9Vec3): boolean {
  return value.length === 3 && value.every(Number.isFinite);
}

function copyVec3(value: PSimplexT9Vec3): PSimplexT9Vec3 {
  return [value[0], value[1], value[2]];
}

function cleanVec3(value: PSimplexT9Vec3): PSimplexT9Vec3 {
  return [cleanNumber(value[0]), cleanNumber(value[1]), cleanNumber(value[2])];
}

function cleanNumber(value: number): number {
  if (!Number.isFinite(value)) {
    return value;
  }

  if (Math.abs(value) <= EPSILON) {
    return 0;
  }

  return Number(value.toFixed(12));
}

function clampUnitInterval(value: number): number {
  if (value > 1 && value <= 1 + EPSILON * 10) {
    return 1;
  }

  if (value < -1 && value >= -1 - EPSILON * 10) {
    return -1;
  }

  return value;
}

function forbiddenVocabularyAppears(
  decompositionRows: PSimplexT10ResidualDecompositionRow[],
  caseRows: PSimplexT10ResidualProbeCaseRow[],
  exampleRows: PSimplexT10ResidualExampleRow[],
  boundaryRows: PSimplexT10InvalidInterpretationBoundaryRow[],
): boolean {
  const values = [
    ...decompositionRows.flatMap((row) => [
      row.rowId,
      row.caseVariant,
      row.construction,
      row.residualStatus,
      row.expectedStatusClass,
      row.notes,
    ]),
    ...caseRows.flatMap((row) => [row.probeCase, row.description, row.expectedStatus]),
    ...exampleRows.flatMap((row) => [row.exampleId, row.statement, row.residualStatus]),
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
    normalized.includes('not automatically')
  ) {
    return false;
  }

  return [
    'route',
    'walk',
    'holonomy',
    'vortex',
    'defect',
    'fieldcue',
    'dwelling',
    'semantic meaning',
    'naming pressure',
  ].some((term) => normalized.includes(term));
}

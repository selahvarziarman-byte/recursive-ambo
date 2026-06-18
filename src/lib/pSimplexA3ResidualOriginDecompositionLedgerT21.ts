import {
  PSIMPLEX_A3_ROOT_DEFINITIONS,
  PSIMPLEX_CHILD_AXIS_DEFINITIONS,
  PSIMPLEX_CHILD_SOURCE_IDS,
  PSIMPLEX_PRIMAL_SOURCE_IDS,
  buildPSimplexA3RootDirections,
  childAxisDefinition,
  primalSourceVector,
  type PSimplexA3RootId,
  type PSimplexChildEdgeId,
  type PSimplexChildSourceId,
  type PSimplexPrimalSourceId,
} from './pSimplexCoreGeometry';
import {
  addVec3,
  cleanNumber,
  cleanVec3,
  dotVec3,
  normVec3,
  normalizeVec3OrNull,
  PSIMPLEX_EPSILON,
  scaleVec3,
  subVec3,
  sumVec3,
  type PSimplexVec3,
} from './pSimplexVectorMath';

export type PSimplexT21Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT21MechanismId = 'M0' | 'M1' | 'M2' | 'M3' | 'M4' | 'M5' | 'M6';
export type PSimplexT21PrimaryClassification =
  | 'zero-A3-residual'
  | 'endpoint-split-A3-root'
  | 'complement-split-A3-root'
  | 'same-endpoint-sibling-pair-A3-root'
  | 'structured-source-state-reduction-polarity'
  | 'A3-composite-residual'
  | 'coordinate-only-A3-leakage'
  | 'octa-axis-leakage'
  | 'mixed-unsupported-leakage'
  | 'unsupported-A3-origin'
  | 'diagnostic-only-control';
export type PSimplexT21CoordinateA3Status = 'coordinate-A3-absent' | 'coordinate-A3-present';
export type PSimplexT21OriginLegitimacyStatus =
  | 'lawful-A3-origin-present'
  | 'lawful-A3-origin-absent'
  | 'partial-lawful-origin'
  | 'unsupported-A3-origin'
  | 'diagnostic-only-control';
export type PSimplexT21OriginLeakageStatus =
  | 'none'
  | 'single-sibling-leakage'
  | 'mixed-unsupported-leakage'
  | 'coordinate-only-A3-leakage'
  | 'unsupported-source-state-leakage';
export type PSimplexT21ResponseGroundingStatus = 'not-response-grounding';
export type PSimplexT21RecommendedResearchConsequence =
  | 'A3-residual-origin-law-established'
  | 'A3-residual-origin-law-established-with-source-state-polarity-unavailable'
  | 'return-to-T21A'
  | 'do-not-proceed';

export interface PSimplexT21TermProvenanceRow {
  termId: string;
  sourceId: string;
  sourceKind:
    | 'parent-endpoint'
    | 'complement-endpoint'
    | 'primary-child'
    | 'complement-child'
    | 'sibling-child'
    | 'source-state-polarity-term'
    | 'abstract-control';
  weight: number;
  vectorContribution: PSimplexVec3;
  relationToTarget:
    | 'target-parent-i'
    | 'target-parent-j'
    | 'complement-k'
    | 'complement-l'
    | 'sibling-ik'
    | 'sibling-il'
    | 'sibling-jk'
    | 'sibling-jl'
    | 'other';
  declaredMechanismId: PSimplexT21MechanismId;
}

export interface PSimplexT21ResidualOriginRow {
  rowId: string;
  targetChild: PSimplexChildSourceId;
  targetEdge: PSimplexChildEdgeId;
  complementEdge: PSimplexChildEdgeId;
  parentVertices: {
    i: PSimplexPrimalSourceId;
    j: PSimplexPrimalSourceId;
    k: PSimplexPrimalSourceId;
    l: PSimplexPrimalSourceId;
  };
  mechanismId: PSimplexT21MechanismId;
  mechanismLabel: string;
  termProvenanceList: PSimplexT21TermProvenanceRow[];
  J: PSimplexVec3;
  C: number;
  alpha: number;
  beta: number;
  LGeom: PSimplexVec3;
  LGeomNorm: number;
  coordinateA3Status: PSimplexT21CoordinateA3Status;
  originLegitimacyStatus: PSimplexT21OriginLegitimacyStatus;
  originLeakageStatus: PSimplexT21OriginLeakageStatus;
  nearestA3Root: string | null;
  a3RootAlignment: number;
  primaryClassification: PSimplexT21PrimaryClassification;
  responseGroundingStatus: PSimplexT21ResponseGroundingStatus;
  notes: string[];
  ok: boolean;
}

export interface PSimplexT21SiblingPairLawAuditRow {
  rowId: string;
  targetChild: PSimplexChildSourceId;
  targetEdge: PSimplexChildEdgeId;
  complementEdge: PSimplexChildEdgeId;
  identity: 'q_ik + q_il = r_ij' | 'q_jk + q_jl = -r_ij' | 'q_ik + q_jk = r_kl' | 'q_il + q_jl = -r_kl';
  actual: PSimplexVec3;
  expected: PSimplexVec3;
  residual: PSimplexVec3;
  residualNorm: number;
  ok: boolean;
}

export interface PSimplexT21SingleSiblingLeakageAuditRow {
  rowId: string;
  targetChild: PSimplexChildSourceId;
  singleSiblingRowId: string;
  coordinateA3Status: PSimplexT21CoordinateA3Status;
  originLegitimacyStatus: PSimplexT21OriginLegitimacyStatus;
  originLeakageStatus: PSimplexT21OriginLeakageStatus;
  primaryClassification: PSimplexT21PrimaryClassification;
  alpha: number;
  beta: number;
  provesCoefficientOriginSeparation: boolean;
  ok: boolean;
}

export interface PSimplexT21StructuredSourceStatePolarityAvailabilityRow {
  targetChild: PSimplexChildSourceId;
  mechanismId: 'M6';
  availabilityStatus: 'source-state-polarity-unavailable';
  sourceDriveActiveTermAvailable: false;
  staleEquivalenceStatus: 'anticipated-by-stale-layer-but-not-current-source-drive-term';
  notes: string[];
  ok: boolean;
}

export interface PSimplexT21StaleFailureGuardRow {
  guardId:
    | 'tupleSovereigntyAvoided'
    | 'metadataOnlyStructureAvoided'
    | 'residualAsCueAvoided'
    | 'singleLeakageConfusionAvoided'
    | 'reductionOpacityAvoided'
    | 'responseGroundingOverclaimAvoided';
  status: 'pass' | 'fail';
  evidence: string;
  ok: boolean;
}

export interface PSimplexT21LawfulOriginsByChildRow {
  targetChild: PSimplexChildSourceId;
  endpointSplitRowCount: number;
  complementSplitRowCount: number;
  siblingPairRowCount: number;
  structuredSourceStatePolarityRowCount: number;
  lawfulOriginPresent: boolean;
  ok: boolean;
}

export interface PSimplexT21BoundaryFactRow {
  source: 'T21-A' | 'T20' | 'C1/C2';
  fact: string;
  carriedForward: true;
}

export interface PSimplexT21InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT21Report {
  method: 'p-simplex-a3-residual-origin-decomposition-ledger-t21';
  candidatePackage: 'p-simplex-a3-residual-origin-decomposition-ledger-t21';
  parentAudit: 'T21-A A3 Residual-Origin / Stale Field Equivalence Audit';
  parentAuditResult: 'A3-law-cleaned-stale-reduction';
  diagnosticScope: 'source-drive-residual-origin-decomposition-only';
  solverStatus: 'not-new-solver';
  fieldAtlasStatus: 'not-field-atlas';
  renderingStatus: 'not-rendering';
  runtimeSubstrateStatus: 'not-runtime-substrate-authorization';
  responseGroundingStatus: 'not-response-grounding';
  boundaryFactRows: PSimplexT21BoundaryFactRow[];
  residualOriginRows: PSimplexT21ResidualOriginRow[];
  singleSiblingLeakageAuditRows: PSimplexT21SingleSiblingLeakageAuditRow[];
  siblingPairLawAuditRows: PSimplexT21SiblingPairLawAuditRow[];
  structuredSourceStatePolarityAvailabilityRows: PSimplexT21StructuredSourceStatePolarityAvailabilityRow[];
  staleFailureGuardRows: PSimplexT21StaleFailureGuardRow[];
  lawfulA3OriginsByChild: PSimplexT21LawfulOriginsByChildRow[];
  invalidInterpretationBoundaryRows: PSimplexT21InvalidInterpretationBoundaryRow[];
  summaryVerdict: PSimplexT21Verdict;
  countsByMechanismFamily: Record<PSimplexT21MechanismId, number>;
  countsByPrimaryClassification: Record<PSimplexT21PrimaryClassification, number>;
  countsByCoordinateA3Status: Record<PSimplexT21CoordinateA3Status, number>;
  countsByOriginLegitimacyStatus: Record<PSimplexT21OriginLegitimacyStatus, number>;
  countsByOriginLeakageStatus: Record<PSimplexT21OriginLeakageStatus, number>;
  a3ResidualOriginLawEstablished: boolean;
  a3ResponseGroundingRemainsUnresolved: true;
  recommendedResearchConsequence: PSimplexT21RecommendedResearchConsequence;
  verdict: PSimplexT21Verdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface TargetContext {
  targetChild: PSimplexChildSourceId;
  targetEdge: PSimplexChildEdgeId;
  complementEdge: PSimplexChildEdgeId;
  i: PSimplexPrimalSourceId;
  j: PSimplexPrimalSourceId;
  k: PSimplexPrimalSourceId;
  l: PSimplexPrimalSourceId;
  qij: PSimplexVec3;
  rij: PSimplexVec3;
  rkl: PSimplexVec3;
}

interface MechanismRowInput {
  mechanismId: PSimplexT21MechanismId;
  mechanismLabel: string;
  rowSuffix: string;
  termProvenanceList: PSimplexT21TermProvenanceRow[];
  primaryClassification: PSimplexT21PrimaryClassification;
  originLegitimacyStatus: PSimplexT21OriginLegitimacyStatus;
  originLeakageStatus: PSimplexT21OriginLeakageStatus;
  notes: string[];
}

interface DecompositionResult {
  J: PSimplexVec3;
  C: number;
  alpha: number;
  beta: number;
  LGeom: PSimplexVec3;
  LGeomNorm: number;
}

const ZERO_VEC3: PSimplexVec3 = [0, 0, 0];
const MECHANISM_IDS: readonly PSimplexT21MechanismId[] = ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6'];
const PRIMARY_CLASSIFICATIONS: readonly PSimplexT21PrimaryClassification[] = [
  'zero-A3-residual',
  'endpoint-split-A3-root',
  'complement-split-A3-root',
  'same-endpoint-sibling-pair-A3-root',
  'structured-source-state-reduction-polarity',
  'A3-composite-residual',
  'coordinate-only-A3-leakage',
  'octa-axis-leakage',
  'mixed-unsupported-leakage',
  'unsupported-A3-origin',
  'diagnostic-only-control',
];
const COORDINATE_A3_STATUSES: readonly PSimplexT21CoordinateA3Status[] = [
  'coordinate-A3-absent',
  'coordinate-A3-present',
];
const ORIGIN_LEGITIMACY_STATUSES: readonly PSimplexT21OriginLegitimacyStatus[] = [
  'lawful-A3-origin-present',
  'lawful-A3-origin-absent',
  'partial-lawful-origin',
  'unsupported-A3-origin',
  'diagnostic-only-control',
];
const ORIGIN_LEAKAGE_STATUSES: readonly PSimplexT21OriginLeakageStatus[] = [
  'none',
  'single-sibling-leakage',
  'mixed-unsupported-leakage',
  'coordinate-only-A3-leakage',
  'unsupported-source-state-leakage',
];

export function buildPSimplexA3ResidualOriginDecompositionLedgerT21Report(): PSimplexT21Report {
  const targetContexts = PSIMPLEX_CHILD_SOURCE_IDS.map(buildTargetContext);
  const residualOriginRows = targetContexts.flatMap(buildRowsForTarget);
  const singleSiblingLeakageAuditRows = buildSingleSiblingLeakageAuditRows(residualOriginRows);
  const siblingPairLawAuditRows = targetContexts.flatMap(buildSiblingPairLawAuditRows);
  const structuredSourceStatePolarityAvailabilityRows = targetContexts.map(buildStructuredSourceStateAvailabilityRow);
  const staleFailureGuardRows = buildStaleFailureGuardRows({
    residualOriginRows,
    singleSiblingLeakageAuditRows,
    siblingPairLawAuditRows,
  });
  const lawfulA3OriginsByChild = buildLawfulA3OriginsByChild(residualOriginRows);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const boundaryFactRows = buildBoundaryFactRows();
  const countsByMechanismFamily = countByValues(residualOriginRows, MECHANISM_IDS, (row) => row.mechanismId);
  const countsByPrimaryClassification = countByValues(
    residualOriginRows,
    PRIMARY_CLASSIFICATIONS,
    (row) => row.primaryClassification,
  );
  const countsByCoordinateA3Status = countByValues(
    residualOriginRows,
    COORDINATE_A3_STATUSES,
    (row) => row.coordinateA3Status,
  );
  const countsByOriginLegitimacyStatus = countByValues(
    residualOriginRows,
    ORIGIN_LEGITIMACY_STATUSES,
    (row) => row.originLegitimacyStatus,
  );
  const countsByOriginLeakageStatus = countByValues(
    residualOriginRows,
    ORIGIN_LEAKAGE_STATUSES,
    (row) => row.originLeakageStatus,
  );
  const a3ResidualOriginLawEstablished = algebraicResidualOriginLawEstablished({
    residualOriginRows,
    singleSiblingLeakageAuditRows,
    siblingPairLawAuditRows,
    staleFailureGuardRows,
    lawfulA3OriginsByChild,
  });
  const structuredSourceStatePolarityUnavailable = structuredSourceStatePolarityAvailabilityRows.some(
    (row) => row.availabilityStatus === 'source-state-polarity-unavailable',
  );
  const integrityIssues = buildIntegrityIssues({
    residualOriginRows,
    singleSiblingLeakageAuditRows,
    siblingPairLawAuditRows,
    staleFailureGuardRows,
    lawfulA3OriginsByChild,
    invalidInterpretationBoundaryRows,
  });
  const verdict = classifyVerdict(integrityIssues, a3ResidualOriginLawEstablished, structuredSourceStatePolarityUnavailable);
  const recommendedResearchConsequence = recommendationForVerdict(verdict, structuredSourceStatePolarityUnavailable);

  return {
    method: 'p-simplex-a3-residual-origin-decomposition-ledger-t21',
    candidatePackage: 'p-simplex-a3-residual-origin-decomposition-ledger-t21',
    parentAudit: 'T21-A A3 Residual-Origin / Stale Field Equivalence Audit',
    parentAuditResult: 'A3-law-cleaned-stale-reduction',
    diagnosticScope: 'source-drive-residual-origin-decomposition-only',
    solverStatus: 'not-new-solver',
    fieldAtlasStatus: 'not-field-atlas',
    renderingStatus: 'not-rendering',
    runtimeSubstrateStatus: 'not-runtime-substrate-authorization',
    responseGroundingStatus: 'not-response-grounding',
    boundaryFactRows,
    residualOriginRows,
    singleSiblingLeakageAuditRows,
    siblingPairLawAuditRows,
    structuredSourceStatePolarityAvailabilityRows,
    staleFailureGuardRows,
    lawfulA3OriginsByChild,
    invalidInterpretationBoundaryRows,
    summaryVerdict: verdict,
    countsByMechanismFamily,
    countsByPrimaryClassification,
    countsByCoordinateA3Status,
    countsByOriginLegitimacyStatus,
    countsByOriginLeakageStatus,
    a3ResidualOriginLawEstablished,
    a3ResponseGroundingRemainsUnresolved: true,
    recommendedResearchConsequence,
    verdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: integrityIssues.length === 0 && verdict !== 'FAIL',
  };
}

function buildTargetContext(targetChild: PSimplexChildSourceId): TargetContext {
  const definition = childAxisDefinition(targetChild);
  const [i, j] = definition.endpoints;
  const complementVertices = PSIMPLEX_PRIMAL_SOURCE_IDS.filter((sourceId) => sourceId !== i && sourceId !== j);
  const [k, l] = complementVertices as [PSimplexPrimalSourceId, PSimplexPrimalSourceId];
  const complementEdge = edgeFromEndpoints(k, l);

  return {
    targetChild,
    targetEdge: definition.edge,
    complementEdge,
    i,
    j,
    k,
    l,
    qij: childVector(i, j),
    rij: rootVector(i, j),
    rkl: rootVector(k, l),
  };
}

function buildRowsForTarget(context: TargetContext): PSimplexT21ResidualOriginRow[] {
  const mechanismInputs: MechanismRowInput[] = [
    buildM0Input(context),
    buildM1Input(context),
    buildM2Input(context),
    ...buildM3Inputs(context),
    buildM4Input(context),
    buildM5Input(context),
    buildM6Input(context),
  ];

  return mechanismInputs.map((input) => buildResidualOriginRow(context, input));
}

function buildResidualOriginRow(context: TargetContext, input: MechanismRowInput): PSimplexT21ResidualOriginRow {
  const decomposition = decomposeTerms(context, input.termProvenanceList);
  const coordinateA3Status =
    Math.abs(decomposition.alpha) > PSIMPLEX_EPSILON || Math.abs(decomposition.beta) > PSIMPLEX_EPSILON
      ? 'coordinate-A3-present'
      : 'coordinate-A3-absent';
  const nearestA3 = bestA3RootMatch(decomposition.J);
  const rowId = `${input.mechanismId}-${context.targetChild}-${input.rowSuffix}`;
  const ok = rowPasses(input, coordinateA3Status, decomposition);

  return {
    rowId,
    targetChild: context.targetChild,
    targetEdge: context.targetEdge,
    complementEdge: context.complementEdge,
    parentVertices: {
      i: context.i,
      j: context.j,
      k: context.k,
      l: context.l,
    },
    mechanismId: input.mechanismId,
    mechanismLabel: input.mechanismLabel,
    termProvenanceList: input.termProvenanceList,
    J: decomposition.J,
    C: decomposition.C,
    alpha: decomposition.alpha,
    beta: decomposition.beta,
    LGeom: decomposition.LGeom,
    LGeomNorm: decomposition.LGeomNorm,
    coordinateA3Status,
    originLegitimacyStatus: input.originLegitimacyStatus,
    originLeakageStatus: input.originLeakageStatus,
    nearestA3Root: nearestA3.rootId,
    a3RootAlignment: nearestA3.alignment,
    primaryClassification: input.primaryClassification,
    responseGroundingStatus: 'not-response-grounding',
    notes: input.notes,
    ok,
  };
}

function buildM0Input(context: TargetContext): MechanismRowInput {
  return {
    mechanismId: 'M0',
    mechanismLabel: 'axis-compatible symmetric endpoint/complement baseline',
    rowSuffix: 'axis-compatible-baseline',
    termProvenanceList: [
      endpointTerm('M0-target-i', context.i, 'parent-endpoint', 1, 'target-parent-i', 'M0'),
      endpointTerm('M0-target-j', context.j, 'parent-endpoint', 1, 'target-parent-j', 'M0'),
      endpointTerm('M0-complement-k', context.k, 'complement-endpoint', 0.5, 'complement-k', 'M0'),
      endpointTerm('M0-complement-l', context.l, 'complement-endpoint', 0.5, 'complement-l', 'M0'),
    ],
    primaryClassification: 'zero-A3-residual',
    originLegitimacyStatus: 'lawful-A3-origin-absent',
    originLeakageStatus: 'none',
    notes: ['Symmetric target and complement endpoint weights produce only child-axis-compatible drive.'],
  };
}

function buildM1Input(context: TargetContext): MechanismRowInput {
  return {
    mechanismId: 'M1',
    mechanismLabel: 'endpoint split',
    rowSuffix: 'endpoint-split',
    termProvenanceList: [
      endpointTerm('M1-target-i-heavy', context.i, 'parent-endpoint', 1.5, 'target-parent-i', 'M1'),
      endpointTerm('M1-target-j-light', context.j, 'parent-endpoint', 0.5, 'target-parent-j', 'M1'),
    ],
    primaryClassification: 'endpoint-split-A3-root',
    originLegitimacyStatus: 'lawful-A3-origin-present',
    originLeakageStatus: 'none',
    notes: ['Unequal target endpoint weights lawfully generate target-edge A3 residual coefficient alpha.'],
  };
}

function buildM2Input(context: TargetContext): MechanismRowInput {
  return {
    mechanismId: 'M2',
    mechanismLabel: 'complement split',
    rowSuffix: 'complement-split',
    termProvenanceList: [
      endpointTerm('M2-complement-k-heavy', context.k, 'complement-endpoint', 1.5, 'complement-k', 'M2'),
      endpointTerm('M2-complement-l-light', context.l, 'complement-endpoint', 0.5, 'complement-l', 'M2'),
    ],
    primaryClassification: 'complement-split-A3-root',
    originLegitimacyStatus: 'lawful-A3-origin-present',
    originLeakageStatus: 'none',
    notes: ['Unequal complement endpoint weights lawfully generate complement-edge A3 residual coefficient beta.'],
  };
}

function buildM3Inputs(context: TargetContext): MechanismRowInput[] {
  return [
    siblingPairInput(context, 'ik+il-target-root', context.i, context.k, context.i, context.l, 'sibling-ik', 'sibling-il'),
    siblingPairInput(context, 'jk+jl-negative-target-root', context.j, context.k, context.j, context.l, 'sibling-jk', 'sibling-jl'),
    siblingPairInput(context, 'ik+jk-complement-root', context.i, context.k, context.j, context.k, 'sibling-ik', 'sibling-jk'),
    siblingPairInput(context, 'il+jl-negative-complement-root', context.i, context.l, context.j, context.l, 'sibling-il', 'sibling-jl'),
  ];
}

function siblingPairInput(
  context: TargetContext,
  rowSuffix: string,
  leftA: PSimplexPrimalSourceId,
  leftB: PSimplexPrimalSourceId,
  rightA: PSimplexPrimalSourceId,
  rightB: PSimplexPrimalSourceId,
  leftRelation: PSimplexT21TermProvenanceRow['relationToTarget'],
  rightRelation: PSimplexT21TermProvenanceRow['relationToTarget'],
): MechanismRowInput {
  return {
    mechanismId: 'M3',
    mechanismLabel: 'same-endpoint sibling-pair activation',
    rowSuffix,
    termProvenanceList: [
      childTerm(`M3-${rowSuffix}-left`, leftA, leftB, 1, leftRelation, 'M3'),
      childTerm(`M3-${rowSuffix}-right`, rightA, rightB, 1, rightRelation, 'M3'),
    ],
    primaryClassification: 'same-endpoint-sibling-pair-A3-root',
    originLegitimacyStatus: 'lawful-A3-origin-present',
    originLeakageStatus: 'none',
    notes: ['Paired sibling activation is a declared lawful generated-child route into A3 residual magnitude.'],
  };
}

function buildM4Input(context: TargetContext): MechanismRowInput {
  return {
    mechanismId: 'M4',
    mechanismLabel: 'single sibling leakage',
    rowSuffix: 'single-sibling-leakage',
    termProvenanceList: [childTerm('M4-single-sibling-ik', context.i, context.k, 1, 'sibling-ik', 'M4')],
    primaryClassification: 'coordinate-only-A3-leakage',
    originLegitimacyStatus: 'unsupported-A3-origin',
    originLeakageStatus: 'single-sibling-leakage',
    notes: [
      'Single sibling contribution may have nonzero alpha or beta in the target basis.',
      'Term provenance marks it as unsupported leakage, not a lawful A3-root origin.',
    ],
  };
}

function buildM5Input(context: TargetContext): MechanismRowInput {
  return {
    mechanismId: 'M5',
    mechanismLabel: 'mixed endpoint split plus single sibling',
    rowSuffix: 'mixed-endpoint-plus-sibling',
    termProvenanceList: [
      endpointTerm('M5-target-i-heavy', context.i, 'parent-endpoint', 1.5, 'target-parent-i', 'M5'),
      endpointTerm('M5-target-j-light', context.j, 'parent-endpoint', 0.5, 'target-parent-j', 'M5'),
      childTerm('M5-single-sibling-ik', context.i, context.k, 1, 'sibling-ik', 'M5'),
    ],
    primaryClassification: 'A3-composite-residual',
    originLegitimacyStatus: 'partial-lawful-origin',
    originLeakageStatus: 'mixed-unsupported-leakage',
    notes: [
      'Endpoint split portion is lawful.',
      'Single sibling portion is unsupported and remains leakage even if the final vector decomposes cleanly.',
    ],
  };
}

function buildM6Input(context: TargetContext): MechanismRowInput {
  return {
    mechanismId: 'M6',
    mechanismLabel: 'structured source-state reduction polarity availability check',
    rowSuffix: 'source-state-polarity-unavailable',
    termProvenanceList: [
      {
        termId: 'M6-source-state-polarity-unavailable',
        sourceId: `source-state-polarity:${context.targetChild}`,
        sourceKind: 'source-state-polarity-term',
        weight: 0,
        vectorContribution: ZERO_VEC3,
        relationToTarget: 'other',
        declaredMechanismId: 'M6',
      },
    ],
    primaryClassification: 'diagnostic-only-control',
    originLegitimacyStatus: 'diagnostic-only-control',
    originLeakageStatus: 'unsupported-source-state-leakage',
    notes: [
      'No current P-simplex source-drive active structured-source-state polarity term is declared for this target.',
      'The stale layer anticipated polarity structurally, but T21 does not import or invent that machinery.',
    ],
  };
}

function endpointTerm(
  termId: string,
  sourceId: PSimplexPrimalSourceId,
  sourceKind: 'parent-endpoint' | 'complement-endpoint',
  weight: number,
  relationToTarget: PSimplexT21TermProvenanceRow['relationToTarget'],
  declaredMechanismId: PSimplexT21MechanismId,
): PSimplexT21TermProvenanceRow {
  return {
    termId,
    sourceId,
    sourceKind,
    weight: cleanNumber(weight),
    vectorContribution: cleanVec3(scaleVec3(primalSourceVector(sourceId), weight)),
    relationToTarget,
    declaredMechanismId,
  };
}

function childTerm(
  termId: string,
  left: PSimplexPrimalSourceId,
  right: PSimplexPrimalSourceId,
  weight: number,
  relationToTarget: PSimplexT21TermProvenanceRow['relationToTarget'],
  declaredMechanismId: PSimplexT21MechanismId,
): PSimplexT21TermProvenanceRow {
  const edge = edgeFromEndpoints(left, right);

  return {
    termId,
    sourceId: `M_${edge}`,
    sourceKind: 'sibling-child',
    weight: cleanNumber(weight),
    vectorContribution: cleanVec3(scaleVec3(childVector(left, right), weight)),
    relationToTarget,
    declaredMechanismId,
  };
}

function decomposeTerms(context: TargetContext, terms: readonly PSimplexT21TermProvenanceRow[]): DecompositionResult {
  const J = cleanVec3(sumVec3(terms.map((term) => term.vectorContribution)));
  const C = projectionCoefficient(J, context.qij);
  const alpha = projectionCoefficient(J, context.rij);
  const beta = projectionCoefficient(J, context.rkl);
  const reconstructed = sumVec3([
    scaleVec3(context.qij, C),
    scaleVec3(context.rij, alpha),
    scaleVec3(context.rkl, beta),
  ]);
  const LGeom = cleanVec3(subVec3(J, reconstructed));

  return {
    J,
    C: cleanNumber(C),
    alpha: cleanNumber(alpha),
    beta: cleanNumber(beta),
    LGeom,
    LGeomNorm: cleanNumber(normVec3(LGeom)),
  };
}

function projectionCoefficient(value: PSimplexVec3, basis: PSimplexVec3): number {
  const denom = dotVec3(basis, basis);

  if (denom <= PSIMPLEX_EPSILON) {
    return 0;
  }

  return dotVec3(value, basis) / denom;
}

function rowPasses(
  input: MechanismRowInput,
  coordinateA3Status: PSimplexT21CoordinateA3Status,
  decomposition: DecompositionResult,
): boolean {
  if (input.termProvenanceList.length === 0) {
    return false;
  }

  if (decomposition.LGeomNorm > PSIMPLEX_EPSILON) {
    return false;
  }

  if (input.mechanismId === 'M0') {
    return coordinateA3Status === 'coordinate-A3-absent';
  }

  if (input.mechanismId === 'M1') {
    return Math.abs(decomposition.alpha) > PSIMPLEX_EPSILON && Math.abs(decomposition.beta) <= PSIMPLEX_EPSILON;
  }

  if (input.mechanismId === 'M2') {
    return Math.abs(decomposition.beta) > PSIMPLEX_EPSILON && Math.abs(decomposition.alpha) <= PSIMPLEX_EPSILON;
  }

  if (input.mechanismId === 'M3' || input.mechanismId === 'M4' || input.mechanismId === 'M5') {
    return coordinateA3Status === 'coordinate-A3-present';
  }

  return input.mechanismId === 'M6' && coordinateA3Status === 'coordinate-A3-absent';
}

function buildSiblingPairLawAuditRows(context: TargetContext): PSimplexT21SiblingPairLawAuditRow[] {
  return [
    siblingPairAuditRow(context, 'q_ik + q_il = r_ij', [childVector(context.i, context.k), childVector(context.i, context.l)], context.rij),
    siblingPairAuditRow(
      context,
      'q_jk + q_jl = -r_ij',
      [childVector(context.j, context.k), childVector(context.j, context.l)],
      scaleVec3(context.rij, -1),
    ),
    siblingPairAuditRow(context, 'q_ik + q_jk = r_kl', [childVector(context.i, context.k), childVector(context.j, context.k)], context.rkl),
    siblingPairAuditRow(
      context,
      'q_il + q_jl = -r_kl',
      [childVector(context.i, context.l), childVector(context.j, context.l)],
      scaleVec3(context.rkl, -1),
    ),
  ];
}

function siblingPairAuditRow(
  context: TargetContext,
  identity: PSimplexT21SiblingPairLawAuditRow['identity'],
  leftTerms: readonly PSimplexVec3[],
  expected: PSimplexVec3,
): PSimplexT21SiblingPairLawAuditRow {
  const actual = cleanVec3(sumVec3(leftTerms));
  const expectedClean = cleanVec3(expected);
  const residual = cleanVec3(subVec3(actual, expectedClean));
  const residualNorm = cleanNumber(normVec3(residual));

  return {
    rowId: `sibling-law-${context.targetChild}-${identity.replace(/[^A-Za-z0-9]+/g, '-')}`,
    targetChild: context.targetChild,
    targetEdge: context.targetEdge,
    complementEdge: context.complementEdge,
    identity,
    actual,
    expected: expectedClean,
    residual,
    residualNorm,
    ok: residualNorm <= PSIMPLEX_EPSILON,
  };
}

function buildSingleSiblingLeakageAuditRows(
  rows: readonly PSimplexT21ResidualOriginRow[],
): PSimplexT21SingleSiblingLeakageAuditRow[] {
  return rows
    .filter((row) => row.mechanismId === 'M4')
    .map((row) => ({
      rowId: `single-sibling-audit-${row.targetChild}`,
      targetChild: row.targetChild,
      singleSiblingRowId: row.rowId,
      coordinateA3Status: row.coordinateA3Status,
      originLegitimacyStatus: row.originLegitimacyStatus,
      originLeakageStatus: row.originLeakageStatus,
      primaryClassification: row.primaryClassification,
      alpha: row.alpha,
      beta: row.beta,
      provesCoefficientOriginSeparation:
        row.coordinateA3Status === 'coordinate-A3-present' &&
        row.originLegitimacyStatus === 'unsupported-A3-origin' &&
        row.primaryClassification === 'coordinate-only-A3-leakage',
      ok:
        row.coordinateA3Status === 'coordinate-A3-present' &&
        row.originLegitimacyStatus === 'unsupported-A3-origin' &&
        row.originLeakageStatus === 'single-sibling-leakage',
    }));
}

function buildStructuredSourceStateAvailabilityRow(
  context: TargetContext,
): PSimplexT21StructuredSourceStatePolarityAvailabilityRow {
  return {
    targetChild: context.targetChild,
    mechanismId: 'M6',
    availabilityStatus: 'source-state-polarity-unavailable',
    sourceDriveActiveTermAvailable: false,
    staleEquivalenceStatus: 'anticipated-by-stale-layer-but-not-current-source-drive-term',
    notes: [
      'Current P-simplex branch has no declared source-drive active structured-source-state polarity term for this child.',
      'T21 reports unavailability instead of importing stale source-state machinery or inventing polarity.',
    ],
    ok: true,
  };
}

function buildStaleFailureGuardRows(args: {
  residualOriginRows: readonly PSimplexT21ResidualOriginRow[];
  singleSiblingLeakageAuditRows: readonly PSimplexT21SingleSiblingLeakageAuditRow[];
  siblingPairLawAuditRows: readonly PSimplexT21SiblingPairLawAuditRow[];
}): PSimplexT21StaleFailureGuardRow[] {
  const everyRowHasTerms = args.residualOriginRows.every((row) => row.termProvenanceList.length > 0);
  const everyRowReportsCoefficients = args.residualOriginRows.every((row) =>
    [row.C, row.alpha, row.beta, row.LGeomNorm].every(Number.isFinite),
  );
  const everyRowDeniesResponseGrounding = args.residualOriginRows.every(
    (row) => row.responseGroundingStatus === 'not-response-grounding',
  );
  const singleLeakageSeparated = args.singleSiblingLeakageAuditRows.length === 6 && args.singleSiblingLeakageAuditRows.every((row) => row.ok);
  const siblingLawVerified = args.siblingPairLawAuditRows.length === 24 && args.siblingPairLawAuditRows.every((row) => row.ok);

  return [
    guardRow(
      'tupleSovereigntyAvoided',
      everyRowHasTerms,
      'Every row is constructed from vector term provenance, not emitted scalar tuple identity.',
    ),
    guardRow(
      'metadataOnlyStructureAvoided',
      everyRowHasTerms,
      'Mechanism legitimacy is attached to source-drive active terms; unavailable source-state polarity is reported as unavailable.',
    ),
    guardRow(
      'residualAsCueAvoided',
      everyRowDeniesResponseGrounding,
      'Every row reports residual-origin evidence only and denies response grounding.',
    ),
    guardRow(
      'singleLeakageConfusionAvoided',
      singleLeakageSeparated,
      'Single sibling leakage rows prove coordinate A3 can be present without lawful A3 origin.',
    ),
    guardRow(
      'reductionOpacityAvoided',
      everyRowReportsCoefficients && siblingLawVerified,
      'Rows report C, alpha, beta, L_geom, term provenance, and sibling-pair law residuals.',
    ),
    guardRow(
      'responseGroundingOverclaimAvoided',
      everyRowDeniesResponseGrounding,
      'The ledger carries T20 separation: residual origin is not response grounding.',
    ),
  ];
}

function guardRow(
  guardId: PSimplexT21StaleFailureGuardRow['guardId'],
  ok: boolean,
  evidence: string,
): PSimplexT21StaleFailureGuardRow {
  return {
    guardId,
    status: ok ? 'pass' : 'fail',
    evidence,
    ok,
  };
}

function buildLawfulA3OriginsByChild(
  rows: readonly PSimplexT21ResidualOriginRow[],
): PSimplexT21LawfulOriginsByChildRow[] {
  return PSIMPLEX_CHILD_SOURCE_IDS.map((targetChild) => {
    const childRows = rows.filter((row) => row.targetChild === targetChild);
    const endpointSplitRowCount = childRows.filter((row) => row.primaryClassification === 'endpoint-split-A3-root').length;
    const complementSplitRowCount = childRows.filter((row) => row.primaryClassification === 'complement-split-A3-root').length;
    const siblingPairRowCount = childRows.filter(
      (row) => row.primaryClassification === 'same-endpoint-sibling-pair-A3-root',
    ).length;
    const structuredSourceStatePolarityRowCount = childRows.filter(
      (row) => row.primaryClassification === 'structured-source-state-reduction-polarity',
    ).length;

    return {
      targetChild,
      endpointSplitRowCount,
      complementSplitRowCount,
      siblingPairRowCount,
      structuredSourceStatePolarityRowCount,
      lawfulOriginPresent: endpointSplitRowCount === 1 && complementSplitRowCount === 1 && siblingPairRowCount === 4,
      ok: endpointSplitRowCount === 1 && complementSplitRowCount === 1 && siblingPairRowCount === 4,
    };
  });
}

function buildBoundaryFactRows(): PSimplexT21BoundaryFactRow[] {
  return [
    { source: 'T21-A', fact: 'A3-law-cleaned-stale-reduction', carriedForward: true },
    { source: 'T21-A', fact: 'revise-T21', carriedForward: true },
    { source: 'T20', fact: 'source-magnitude-evidence-incomplete', carriedForward: true },
    {
      source: 'T20',
      fact: 'A3 residual reachability does not imply A3 response reachability',
      carriedForward: true,
    },
    { source: 'C1/C2', fact: 'closed axis + provisional A3', carriedForward: true },
    { source: 'C1/C2', fact: 'D3 quarantined', carriedForward: true },
    { source: 'C1/C2', fact: 'D4/T diagnostic-only', carriedForward: true },
  ];
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT21InvalidInterpretationBoundaryRow[] {
  return [
    {
      boundaryId: 'not-response-grounding',
      statement: 'Negative boundary: A3 residual origin is not operational A3 response grounding and does not close A3 response.',
      enforced: true,
    },
    {
      boundaryId: 'not-cue-or-semantics',
      statement:
        'Negative boundary: A3 residual origin is not FieldCue, semantic meaning, route/walk/holonomy, defect/vortex behavior, packet interpretation, rendering, or runtime substrate authorization.',
      enforced: true,
    },
    {
      boundaryId: 'not-vector-only-origin',
      statement: 'Negative boundary: nonzero alpha or beta is not sufficient; term provenance is required.',
      enforced: true,
    },
    {
      boundaryId: 'not-single-sibling-promotion',
      statement: 'Negative boundary: single sibling leakage is coordinate A3 only and is not promoted to lawful A3 origin.',
      enforced: true,
    },
  ];
}

function algebraicResidualOriginLawEstablished(args: {
  residualOriginRows: readonly PSimplexT21ResidualOriginRow[];
  singleSiblingLeakageAuditRows: readonly PSimplexT21SingleSiblingLeakageAuditRow[];
  siblingPairLawAuditRows: readonly PSimplexT21SiblingPairLawAuditRow[];
  staleFailureGuardRows: readonly PSimplexT21StaleFailureGuardRow[];
  lawfulA3OriginsByChild: readonly PSimplexT21LawfulOriginsByChildRow[];
}): boolean {
  return (
    new Set(args.residualOriginRows.map((row) => row.targetChild)).size === 6 &&
    args.singleSiblingLeakageAuditRows.every((row) => row.ok) &&
    args.siblingPairLawAuditRows.length === 24 &&
    args.siblingPairLawAuditRows.every((row) => row.ok) &&
    args.staleFailureGuardRows.every((row) => row.ok) &&
    args.lawfulA3OriginsByChild.every((row) => row.ok)
  );
}

function buildIntegrityIssues(args: {
  residualOriginRows: readonly PSimplexT21ResidualOriginRow[];
  singleSiblingLeakageAuditRows: readonly PSimplexT21SingleSiblingLeakageAuditRow[];
  siblingPairLawAuditRows: readonly PSimplexT21SiblingPairLawAuditRow[];
  staleFailureGuardRows: readonly PSimplexT21StaleFailureGuardRow[];
  lawfulA3OriginsByChild: readonly PSimplexT21LawfulOriginsByChildRow[];
  invalidInterpretationBoundaryRows: readonly PSimplexT21InvalidInterpretationBoundaryRow[];
}): string[] {
  const issues: string[] = [];
  const childrenTested = new Set(args.residualOriginRows.map((row) => row.targetChild));

  if (childrenTested.size !== 6) {
    issues.push(`Expected all six children to be tested, got ${childrenTested.size}.`);
  }

  for (const mechanismId of MECHANISM_IDS) {
    const mechanismChildren = new Set(args.residualOriginRows.filter((row) => row.mechanismId === mechanismId).map((row) => row.targetChild));
    if (mechanismChildren.size !== 6) {
      issues.push(`Mechanism ${mechanismId} did not cover all six children.`);
    }
  }

  if (args.residualOriginRows.some((row) => !row.ok)) {
    issues.push('At least one residual origin row failed its local algebraic check.');
  }

  if (args.residualOriginRows.some((row) => row.termProvenanceList.length === 0)) {
    issues.push('At least one residual origin row lacks term provenance.');
  }

  if (args.siblingPairLawAuditRows.length !== 24 || args.siblingPairLawAuditRows.some((row) => !row.ok)) {
    issues.push('Sibling-pair law audit did not pass all 24 deterministic identities.');
  }

  if (args.singleSiblingLeakageAuditRows.length !== 6 || args.singleSiblingLeakageAuditRows.some((row) => !row.ok)) {
    issues.push('Single sibling leakage audit did not prove coefficient/origin separation for all six children.');
  }

  if (!args.lawfulA3OriginsByChild.every((row) => row.ok)) {
    issues.push('At least one child lacks endpoint, complement, or sibling-pair lawful A3 origin coverage.');
  }

  if (args.staleFailureGuardRows.some((row) => !row.ok)) {
    issues.push('At least one stale-failure guard failed.');
  }

  if (args.residualOriginRows.some((row) => row.responseGroundingStatus !== 'not-response-grounding')) {
    issues.push('A residual origin row overclaimed response grounding.');
  }

  if (!args.invalidInterpretationBoundaryRows.every((row) => row.enforced)) {
    issues.push('At least one invalid interpretation boundary is not enforced.');
  }

  return issues;
}

function classifyVerdict(
  integrityIssues: readonly string[],
  a3ResidualOriginLawEstablished: boolean,
  structuredSourceStatePolarityUnavailable: boolean,
): PSimplexT21Verdict {
  if (integrityIssues.length > 0 || !a3ResidualOriginLawEstablished) {
    return 'FAIL';
  }

  return structuredSourceStatePolarityUnavailable ? 'PARTIAL' : 'PASS';
}

function recommendationForVerdict(
  verdict: PSimplexT21Verdict,
  structuredSourceStatePolarityUnavailable: boolean,
): PSimplexT21RecommendedResearchConsequence {
  if (verdict === 'FAIL') {
    return 'do-not-proceed';
  }

  return structuredSourceStatePolarityUnavailable
    ? 'A3-residual-origin-law-established-with-source-state-polarity-unavailable'
    : 'A3-residual-origin-law-established';
}

function bestA3RootMatch(value: PSimplexVec3): { rootId: PSimplexA3RootId | null; alignment: number } {
  const normalizedValue = normalizeVec3OrNull(value);

  if (!normalizedValue) {
    return { rootId: null, alignment: 0 };
  }

  const best = buildPSimplexA3RootDirections().reduce<{ rootId: string; alignment: number } | null>((current, row) => {
    const alignment = dotVec3(normalizedValue, row.normalizedDirection);

    if (!current || alignment > current.alignment) {
      return { rootId: row.directionId, alignment };
    }

    return current;
  }, null);

  return {
    rootId: (best?.rootId ?? null) as PSimplexA3RootId | null,
    alignment: cleanNumber(best?.alignment ?? 0),
  };
}

function countByValues<TValue extends string, TRow>(
  rows: readonly TRow[],
  values: readonly TValue[],
  valueForRow: (row: TRow) => TValue,
): Record<TValue, number> {
  return values.reduce<Record<TValue, number>>(
    (counts, value) => ({
      ...counts,
      [value]: rows.filter((row) => valueForRow(row) === value).length,
    }),
    {} as Record<TValue, number>,
  );
}

function childVector(left: PSimplexPrimalSourceId, right: PSimplexPrimalSourceId): PSimplexVec3 {
  return cleanVec3(addVec3(primalSourceVector(left), primalSourceVector(right)));
}

function rootVector(from: PSimplexPrimalSourceId, to: PSimplexPrimalSourceId): PSimplexVec3 {
  return cleanVec3(subVec3(primalSourceVector(from), primalSourceVector(to)));
}

function edgeFromEndpoints(left: PSimplexPrimalSourceId, right: PSimplexPrimalSourceId): PSimplexChildEdgeId {
  const sorted = [left, right].sort().join('') as PSimplexChildEdgeId;
  const definition = PSIMPLEX_CHILD_AXIS_DEFINITIONS.find((row) => row.edge === sorted);

  if (!definition) {
    throw new Error(`Unknown P-simplex edge ${left}${right}`);
  }

  return definition.edge;
}

export function pSimplexT21RootIdForOrderedPair(
  from: PSimplexPrimalSourceId,
  to: PSimplexPrimalSourceId,
): PSimplexA3RootId {
  const definition = PSIMPLEX_A3_ROOT_DEFINITIONS.find((row) => row.from === from && row.to === to);

  if (!definition) {
    throw new Error(`Unknown P-simplex A3 root ${from}${to}`);
  }

  return definition.rootId;
}

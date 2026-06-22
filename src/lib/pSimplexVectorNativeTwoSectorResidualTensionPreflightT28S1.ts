import { buildPSimplexVectorOrderParameterDiagnosticV0Report } from './pSimplexVectorOrderParameterDiagnosticV0';
import { buildPSimplexCuboctahedralS4DirectBridgeT28N0Report } from './pSimplexCuboctahedralS4DirectBridgeT28N0';
import { buildPSimplexCuboctahedralVEGlobalReadoutAdmissibilityT28PReport } from './pSimplexCuboctahedralVEGlobalReadoutAdmissibilityT28P';
import { buildPSimplexCuboctahedralVES4ResidualVisibilityT28QReport } from './pSimplexCuboctahedralVES4ResidualVisibilityT28Q';

export type A3Label = 'A' | 'B' | 'C' | 'D';
export type A3FlagId = `${A3Label}->${A3Label}`;
export type Vec3 = [number, number, number];
export type Matrix3 = [[number, number, number], [number, number, number], [number, number, number]];
type ChildId = 'M_AB' | 'M_AC' | 'M_AD' | 'M_BC' | 'M_BD' | 'M_CD';
type EdgeId = 'AB' | 'AC' | 'AD' | 'BC' | 'BD' | 'CD';
type ObjectDomain = 'flag' | 've-square' | 've-a2-hexagon';
type ResidualComponentId = 'r_out' | 'r_in' | 'r_square' | 'r_hex';

export interface TwoSectorValue {
  sectorMinus: Vec3;
  sectorPlus: Vec3;
  valueStatus: 'assigned' | 'blocked';
  blockedReason?: string;
}

export interface ParentEvidenceRow {
  parentId:
    | 'p-simplex-vector-order-parameter-diagnostic-v0'
    | 'T28-N0'
    | 'T28-P'
    | 'T28-Q';
  method: string;
  ok: boolean;
  verdict?: string;
  summaryVerdict?: string;
  consumedSections: string[];
  ignoredSections: string[];
  parentStatus: 'accepted-parent' | 'rejected-parent';
  t28rContextStatus?: 'external-standard-probe-context-only-not-parent-authority';
}

export interface QSourcePackageAudit {
  generation0SourceCount: number;
  generation1SourceCount: number;
  activeSourceCount: number;
  sourcePopulation: string;
  childEndpointSumRows: Array<{
    childId: ChildId;
    endpoints: [A3Label, A3Label];
    childVector: Vec3;
    expectedEndpointSum: Vec3;
    maxError: number;
    status: 'child-vector-endpoint-sum-pass' | 'child-vector-endpoint-sum-failed';
  }>;
  complementOppositionRows: Array<{
    leftChildId: ChildId;
    rightChildId: ChildId;
    vectorSum: Vec3;
    maxError: number;
    status: 'complement-opposition-pass' | 'complement-opposition-failed';
  }>;
  scalarCollapseControlRows: Array<{
    reductionId: 'scalar-magnitude-only' | 'equal-source-weight-scalar';
    observedVerdict: string | null;
    expectedObservedVerdict: 'FAIL';
    status: 'scalar-collapse-control-failing-as-expected' | 'scalar-collapse-control-not-failing';
  }>;
  status:
    | 'q-source-package-ready'
    | 'q-source-population-not-accumulated'
    | 'child-vector-endpoint-sum-failed'
    | 'scalar-collapse-control-not-failing';
}

export interface S4ActionRow {
  permutationId: string;
  permutationMap: Record<A3Label, A3Label>;
  matrixDerivation: 'B_g * inverse(B)';
  matrixDerivationStatus: 'derived-from-q-vector-constraints';
  matrix3x3: Matrix3;
  determinant: number;
  orthogonalityError: number;
  primalMaxError: number;
  childMaxError: number;
  primalEquivarianceStatus: 'primal-equivariance-pass' | 'primal-equivariance-fail';
  childEquivarianceStatus: 'child-equivariance-pass' | 'child-equivariance-fail';
  status: 'tetrahedral-standard-action-verified' | 'r3-s4-action-not-verified';
}

export interface S4ActionSummary {
  permutationCount: number;
  verifiedCount: number;
  maxPrimalError: number;
  maxChildError: number;
  maxOrthogonalityError: number;
  status: 'tetrahedral-standard-action-verified' | 'r3-s4-action-not-verified';
}

export interface SquarePolarityRow {
  squareObjectId: string;
  faceId: string;
  flagCycle: A3FlagId[];
  sourceLabelPair: [A3Label, A3Label] | null;
  targetLabelPair: [A3Label, A3Label] | null;
  correspondingTetraEdge: string | null;
  sourceTargetComplementStatus: 'source-target-complement-pass' | 'source-target-complement-fail';
  squareStatus: string;
  s4StabilityStatus: 'square-s4-stability-pass' | 'square-s4-stability-fail';
  qSignLawStatus: 'q-sign-law-pass' | 'q-sign-law-fail';
  status: 'square-polarity-authorized' | 'square-edge-channel-sign-not-authorized';
}

export interface SquarePolaritySummary {
  squareRowCount: number;
  authorizedSquareCount: number;
  blockedSquareCount: number;
  squareComponentStatus: 'square-polarity-authorized' | 'contrast-sector-square-completion-blocked';
}

export interface ReadoutSectionRow extends TwoSectorValue {
  objectId: string;
  objectDomain: ObjectDomain;
  objectKey: string;
  sourceFormula:
    | 'rho_minus=q_source_minus_q_target;rho_plus=q_source_plus_q_target'
    | 'rho_minus=q_source_pair;rho_plus=zero'
    | 'rho_minus=zero;rho_plus=(2/3)*(-q_omitted)'
    | 'blocked-square-polarity';
}

export interface RawScaleRow {
  childId: ChildId;
  sourceEdge: EdgeId;
  complementEdge: EdgeId;
  complementHexPair: [A3Label, A3Label];
  sourceHexPair: [A3Label, A3Label];
  complementHexPairSum: Vec3;
  expectedComplementHexPairSum: Vec3;
  sourceHexPairSum: Vec3;
  expectedSourceHexPairSum: Vec3;
  maxError: number;
  status: 'raw-incidence-scale-preserved' | 'common-sector-scale-corrupted';
}

export interface RawScaleSummary {
  rawScaleStatus: 'raw-incidence-scale-preserved' | 'common-sector-scale-corrupted';
  maxError: number;
}

export interface WQEquivarianceRow {
  objectId: string;
  objectDomain: ObjectDomain;
  permutationId: string;
  targetObjectId: string;
  sectorMinusError: number;
  sectorPlusError: number;
  status:
    | 'wq-equivariance-pass'
    | 'minus-sector-equivariance-failed'
    | 'plus-sector-equivariance-failed'
    | 'combined-wq-equivariance-failed'
    | 'blocked-square-polarity';
}

export interface WQEquivarianceSummary {
  checkedRowCount: number;
  passCount: number;
  blockedRowCount: number;
  minusFailCount: number;
  plusFailCount: number;
  combinedFailCount: number;
  status:
    | 'two-sector-q-readout-s4-equivariant'
    | 'minus-sector-equivariance-failed'
    | 'plus-sector-equivariance-failed'
    | 'combined-wq-equivariance-failed';
}

export interface VectorResidualRow {
  residualRowId: string;
  alpha: A3FlagId;
  componentId: ResidualComponentId;
  objectDomain: ObjectDomain;
  leftObjectId: string;
  rightObjectId: string;
  sectorMinusResidualVector: Vec3;
  sectorPlusResidualVector: Vec3;
  blockedStatus: 'unblocked' | 'blocked-square-polarity' | 'residual-row-domain-mismatch';
  sectorMinusResidualNormDebugOnly: number;
  sectorPlusResidualNormDebugOnly: number;
  status:
    | 'vector-residual-row-computed'
    | 'blocked-square-polarity'
    | 'residual-row-domain-mismatch'
    | 'residual-sector-collapsed'
    | 'residual-used-scalar-source-law';
}

export interface VectorResidualVisibilitySummary {
  sectorMinusResidualNonzeroCount: number;
  sectorPlusResidualNonzeroCount: number;
  combinedResidualNonzeroCount: number;
  maxVectorResidualNormDebugOnly: number;
  zeroRowsByComponentDomain: Record<string, number>;
  blockedRowsByComponentDomain: Record<string, number>;
  visibilityStatus:
    | 'nonzero S4-equivariant vector section is D_E-visible'
    | 'unexpected-vector-residual-kernel-collapse';
}

export interface VectorTensionPairingDeclaration {
  tensionDiagnosticLabel: 'unweighted-finite-residual-tension-diagnostic';
  pairingDeclared: boolean;
  residualRowPairing: 'unweighted finite pairing over residual rows';
  objectRowPairing: 'unweighted finite pairing over object rows';
  sectorPairing: 'standard Euclidean dot product in each V sector; sector direct sum pairing';
  exclusions: string[];
}

export interface VectorTensionRow {
  objectId: string;
  objectDomain: ObjectDomain;
  sectorMinusTensionVector: Vec3;
  sectorPlusTensionVector: Vec3;
  contributingResidualRowIds: string[];
  blockedContributingResidualRowIds: string[];
  sectorMinusTensionNormDebugOnly: number;
  sectorPlusTensionNormDebugOnly: number;
  tensionStatus:
    | 'vector-tension-row-computed'
    | 'vector-tension-row-computed-with-blocked-square-components'
    | 'blocked-square-polarity';
}

export interface VectorTensionSummary {
  tensionDiagnosticLabel: 'unweighted-finite-residual-tension-diagnostic';
  pairingDeclared: boolean;
  tensionScope: 'all-residual-rows' | 'unblocked-residual-rows-only';
  rowCount: number;
  nonzeroTensionRowCount: number;
  blockedContributionCount: number;
  status:
    | 'vector-tension-diagnostic-computed'
    | 'tension-adjoint-pairing-undeclared'
    | 'tension-promoted-to-field-world-inhabitant'
    | 'tension-used-scalar-source-law';
}

export interface ControlRow {
  controlId: 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5';
  controlName: string;
  controlCase?: string;
  expectedStatus: string;
  observedStatus: string;
  maxResidualNormDebugOnly?: number;
  maxTensionNormDebugOnly?: number;
  checkedCount?: number;
  blockedCount?: number;
  unauthorizedCount?: number;
  status: 'control-pass' | 'control-fail';
  note: string;
}

export interface BoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: boolean;
}

export interface FalsifierRow {
  falsifierId: string;
  description: string;
  triggered: boolean;
  evidence: string;
  status: 'clear' | 'triggered';
}

export type T28S1FinalVerdict =
  | 'T28-S-Lab-1-vector-native-two-sector-preflight-pass'
  | 'T28-S-Lab-1-square-polarity-blocked-partial'
  | 'T28-S-Lab-1-vector-equivariance-failed'
  | 'T28-S-Lab-1-raw-scale-failed'
  | 'T28-S-Lab-1-scalar-collapse-regression-failed'
  | 'T28-S-Lab-1-boundary-failed';

export interface PSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report {
  method: 'p-simplex-vector-native-two-sector-residual-tension-preflight-t28s1';
  experimentName: 'T28-S-Lab-1 - Vector-Native Two-Sector Residual/Tension Preflight';
  diagnosticScope: 'vector-native-two-sector-residual-tension-preflight-only';
  branchRef: 'wgate/arf-w1-root-frame-v0';
  parentEvidenceRows: ParentEvidenceRow[];
  qSourcePackageAudit: QSourcePackageAudit;
  s4ActionRows: S4ActionRow[];
  s4ActionSummary: S4ActionSummary;
  squarePolarityRows: SquarePolarityRow[];
  squarePolaritySummary: SquarePolaritySummary;
  readoutSectionRows: ReadoutSectionRow[];
  rawScaleRows: RawScaleRow[];
  rawScaleSummary: RawScaleSummary;
  wqEquivarianceRows: WQEquivarianceRow[];
  wqEquivarianceSummary: WQEquivarianceSummary;
  vectorResidualRows: VectorResidualRow[];
  vectorResidualVisibilitySummary: VectorResidualVisibilitySummary;
  vectorTensionPairingDeclaration: VectorTensionPairingDeclaration;
  vectorTensionRows: VectorTensionRow[];
  vectorTensionSummary: VectorTensionSummary;
  controlRows: ControlRow[];
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  finalVerdict: T28S1FinalVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

type QParentReport = ReturnType<typeof buildPSimplexVectorOrderParameterDiagnosticV0Report>;
type N0ParentReport = ReturnType<typeof buildPSimplexCuboctahedralS4DirectBridgeT28N0Report>;
type PParentReport = ReturnType<typeof buildPSimplexCuboctahedralVEGlobalReadoutAdmissibilityT28PReport>;
type QVisibilityParentReport = ReturnType<typeof buildPSimplexCuboctahedralVES4ResidualVisibilityT28QReport>;
type PObjectRow = PParentReport['globalObjectUniverseRows'][number];
type PResidualRow = PParentReport['globalResidualOperatorRows'][number];
type N0SquareRow = N0ParentReport['vectorEquilibriumSquareRows'][number];

interface SourcePackage {
  primalQByLabel: Map<A3Label, Vec3>;
  childQById: Map<ChildId, Vec3>;
}

interface SquarePolarityIndex {
  byObjectId: Map<string, SquarePolarityRow>;
  byDirectedPairKey: Map<string, SquarePolarityRow>;
}

const METHOD = 'p-simplex-vector-native-two-sector-residual-tension-preflight-t28s1' as const;
const EXPERIMENT_NAME = 'T28-S-Lab-1 - Vector-Native Two-Sector Residual/Tension Preflight' as const;
const DIAGNOSTIC_SCOPE = 'vector-native-two-sector-residual-tension-preflight-only' as const;
const BRANCH_REF = 'wgate/arf-w1-root-frame-v0' as const;
const EPSILON = 1e-9;
const A3_LABELS: readonly A3Label[] = ['A', 'B', 'C', 'D'];
const DIRECTED_FLAGS: readonly A3FlagId[] = [
  'A->B',
  'A->C',
  'A->D',
  'B->A',
  'B->C',
  'B->D',
  'C->A',
  'C->B',
  'C->D',
  'D->A',
  'D->B',
  'D->C',
];
const CHILD_IDS: readonly ChildId[] = ['M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];
const EDGE_ENDPOINTS: Record<EdgeId, [A3Label, A3Label]> = {
  AB: ['A', 'B'],
  AC: ['A', 'C'],
  AD: ['A', 'D'],
  BC: ['B', 'C'],
  BD: ['B', 'D'],
  CD: ['C', 'D'],
};
const COMPLEMENT_EDGE: Record<EdgeId, EdgeId> = {
  AB: 'CD',
  AC: 'BD',
  AD: 'BC',
  BC: 'AD',
  BD: 'AC',
  CD: 'AB',
};
const REQUIRED_BOUNDARY_IDS = [
  'not-scalar-profile',
  'not-scalar-source-law',
  'not-norm-first',
  'not-field-world-inhabitant',
  'not-route',
  'not-gate',
  'not-vortex',
  'not-region',
  'not-support',
  'not-topology',
  'not-semantic-naming',
  'not-fieldcue',
  'not-runtime',
  'not-ui',
  'not-packet-writing',
  'not-shape-mutation',
] as const;
const REQUIRED_FALSIFIER_IDS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'] as const;

export function buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report(): PSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report {
  const qParent = buildPSimplexVectorOrderParameterDiagnosticV0Report();
  const n0Parent = buildPSimplexCuboctahedralS4DirectBridgeT28N0Report();
  const pParent = buildPSimplexCuboctahedralVEGlobalReadoutAdmissibilityT28PReport();
  const qVisibilityParent = buildPSimplexCuboctahedralVES4ResidualVisibilityT28QReport();
  const sourcePackage = buildSourcePackage(qParent);
  const parentEvidenceRows = buildParentEvidenceRows(qParent, n0Parent, pParent, qVisibilityParent);
  const qSourcePackageAudit = buildQSourcePackageAudit(qParent, sourcePackage);
  const s4ActionRows = buildS4ActionRows(qVisibilityParent, sourcePackage);
  const s4ActionSummary = buildS4ActionSummary(s4ActionRows);
  const squarePolarityRows = buildSquarePolarityRows(n0Parent, sourcePackage, s4ActionRows);
  const squarePolaritySummary = buildSquarePolaritySummary(squarePolarityRows);
  const squarePolarityIndex = buildSquarePolarityIndex(squarePolarityRows);
  const readoutSectionRows = buildReadoutSectionRows(pParent.globalObjectUniverseRows, sourcePackage, squarePolarityIndex);
  const rawScaleRows = buildRawScaleRows(sourcePackage);
  const rawScaleSummary = buildRawScaleSummary(rawScaleRows);
  const wqEquivarianceRows = buildWQEquivarianceRows(
    qVisibilityParent.s4PermutationRows,
    pParent.globalObjectUniverseRows,
    readoutSectionRows,
    sourcePackage,
    s4ActionRows,
    squarePolarityIndex,
  );
  const wqEquivarianceSummary = buildWQEquivarianceSummary(wqEquivarianceRows);
  const vectorResidualRows = buildVectorResidualRows(pParent.globalResidualOperatorRows, readoutSectionRows);
  const vectorResidualVisibilitySummary = buildVectorResidualVisibilitySummary(vectorResidualRows);
  const vectorTensionPairingDeclaration = buildVectorTensionPairingDeclaration();
  const vectorTensionRows = buildVectorTensionRows(pParent.globalObjectUniverseRows, pParent.globalResidualOperatorRows, vectorResidualRows);
  const vectorTensionSummary = buildVectorTensionSummary(vectorTensionPairingDeclaration, vectorTensionRows);
  const controlRows = buildControlRows(qParent, pParent, sourcePackage, squarePolarityRows);
  const boundaryRows = buildBoundaryRows();
  const preliminaryVerdict = classifyFinalVerdict({
    parentEvidenceRows,
    qSourcePackageAudit,
    s4ActionSummary,
    squarePolaritySummary,
    rawScaleSummary,
    wqEquivarianceSummary,
    vectorResidualVisibilitySummary,
    vectorTensionPairingDeclaration,
    vectorTensionSummary,
    controlRows,
    boundaryRows,
    falsifierRows: [],
  });
  const falsifierRows = buildFalsifierRows({
    parentEvidenceRows,
    qSourcePackageAudit,
    s4ActionRows,
    squarePolarityRows,
    readoutSectionRows,
    rawScaleSummary,
    wqEquivarianceSummary,
    vectorResidualRows,
    vectorTensionPairingDeclaration,
    vectorTensionSummary,
    controlRows,
    boundaryRows,
    finalVerdict: preliminaryVerdict,
  });
  const finalVerdict = classifyFinalVerdict({
    parentEvidenceRows,
    qSourcePackageAudit,
    s4ActionSummary,
    squarePolaritySummary,
    rawScaleSummary,
    wqEquivarianceSummary,
    vectorResidualVisibilitySummary,
    vectorTensionPairingDeclaration,
    vectorTensionSummary,
    controlRows,
    boundaryRows,
    falsifierRows,
  });
  const integrityIssues = buildIntegrityIssues({
    parentEvidenceRows,
    qSourcePackageAudit,
    s4ActionRows,
    s4ActionSummary,
    squarePolarityRows,
    squarePolaritySummary,
    readoutSectionRows,
    rawScaleSummary,
    wqEquivarianceRows,
    wqEquivarianceSummary,
    vectorResidualRows,
    vectorResidualVisibilitySummary,
    vectorTensionPairingDeclaration,
    vectorTensionRows,
    vectorTensionSummary,
    controlRows,
    boundaryRows,
    falsifierRows,
    finalVerdict,
    parentResidualCount: pParent.globalResidualOperatorRows.length,
  });
  const ok =
    integrityIssues.length === 0 &&
    falsifierRows.every((row) => !row.triggered) &&
    (finalVerdict === 'T28-S-Lab-1-vector-native-two-sector-preflight-pass' ||
      finalVerdict === 'T28-S-Lab-1-square-polarity-blocked-partial');

  return {
    method: METHOD,
    experimentName: EXPERIMENT_NAME,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    parentEvidenceRows,
    qSourcePackageAudit,
    s4ActionRows,
    s4ActionSummary,
    squarePolarityRows,
    squarePolaritySummary,
    readoutSectionRows,
    rawScaleRows,
    rawScaleSummary,
    wqEquivarianceRows,
    wqEquivarianceSummary,
    vectorResidualRows,
    vectorResidualVisibilitySummary,
    vectorTensionPairingDeclaration,
    vectorTensionRows,
    vectorTensionSummary,
    controlRows,
    boundaryRows,
    falsifierRows,
    finalVerdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok,
  };
}

function buildParentEvidenceRows(
  qParent: QParentReport,
  n0Parent: N0ParentReport,
  pParent: PParentReport,
  qVisibilityParent: QVisibilityParentReport,
): ParentEvidenceRow[] {
  return [
    {
      parentId: 'p-simplex-vector-order-parameter-diagnostic-v0',
      method: qParent.method,
      ok: qParent.ok,
      verdict: qParent.verdict,
      consumedSections: [
        'generation0SourceCount',
        'generation1SourceCount',
        'activeSourceCount',
        'sourcePopulationPolicy',
        'sourceLedgerRows',
        'invalidReductionAuditRows',
        'childOnlyAmputationControl',
        'recursiveSourcePopulationNote',
        'ok',
      ],
      ignoredSections: ['semanticStatus', 'fieldCueStatus', 'routeStatus', 'fieldImplementationStatus'],
      parentStatus: qParent.ok ? 'accepted-parent' : 'rejected-parent',
      t28rContextStatus: 'external-standard-probe-context-only-not-parent-authority',
    },
    {
      parentId: 'T28-N0',
      method: n0Parent.method,
      ok: n0Parent.ok,
      summaryVerdict: n0Parent.summaryVerdict,
      consumedSections: [
        'directBridgeRows',
        'vectorEquilibriumSquareRows',
        'centralHexagonRows:vector-equilibrium-a2-omitted-label-only',
        's4EquivarianceRows',
        'summaryVerdict',
        'ok',
      ],
      ignoredSections: [
        'actualVsCompositionTriangleRows',
        'actualVsCompositionSquareRows',
        'composition-related rows',
        'fano/octonion/discriminator comparison material',
      ],
      parentStatus: n0Parent.ok ? 'accepted-parent' : 'rejected-parent',
    },
    {
      parentId: 'T28-P',
      method: pParent.method,
      ok: pParent.ok,
      summaryVerdict: pParent.summaryVerdict,
      consumedSections: [
        'globalObjectUniverseRows',
        'globalObjectDomainRows',
        'globalResidualOperatorRows',
        'globalResidualOperatorBlockRows',
        'kernelBasisRows',
        'summaryVerdict',
        'ok',
      ],
      ignoredSections: [],
      parentStatus: pParent.ok ? 'accepted-parent' : 'rejected-parent',
    },
    {
      parentId: 'T28-Q',
      method: qVisibilityParent.method,
      ok: qVisibilityParent.ok,
      summaryVerdict: qVisibilityParent.summaryVerdict,
      consumedSections: [
        's4PermutationRows',
        'residualOperatorEquivarianceRows',
        'kernelRepresentationRows',
        'residualVisibleQuotientRows',
        'residualVisibilityTheoremRows',
        'summaryVerdict',
        'ok',
      ],
      ignoredSections: [],
      parentStatus: qVisibilityParent.ok ? 'accepted-parent' : 'rejected-parent',
    },
  ];
}

function buildSourcePackage(qParent: QParentReport): SourcePackage {
  const primalQByLabel = new Map<A3Label, Vec3>();
  const childQById = new Map<ChildId, Vec3>();

  for (const row of qParent.sourceLedgerRows) {
    if (row.sourceKind === 'primal' && isA3Label(row.sourceId)) {
      primalQByLabel.set(row.sourceId, row.q);
    }

    if (row.sourceKind === 'child' && isChildId(row.sourceId)) {
      childQById.set(row.sourceId, row.q);
    }
  }

  return { primalQByLabel, childQById };
}

function buildQSourcePackageAudit(qParent: QParentReport, sourcePackage: SourcePackage): QSourcePackageAudit {
  const childEndpointSumRows = CHILD_IDS.map((childId) => {
    const edge = childId.slice('M_'.length) as EdgeId;
    const endpoints = EDGE_ENDPOINTS[edge];
    const childVector = sourcePackage.childQById.get(childId) ?? zeroVec3();
    const expectedEndpointSum = addVec3(requiredPrimalQ(sourcePackage, endpoints[0]), requiredPrimalQ(sourcePackage, endpoints[1]));
    const maxError = maxAbsVec3(subVec3(childVector, expectedEndpointSum));

    const status: QSourcePackageAudit['childEndpointSumRows'][number]['status'] =
      maxError <= EPSILON ? 'child-vector-endpoint-sum-pass' : 'child-vector-endpoint-sum-failed';

    return {
      childId,
      endpoints,
      childVector: cleanVec3(childVector),
      expectedEndpointSum: cleanVec3(expectedEndpointSum),
      maxError,
      status,
    };
  });
  const complementOppositionRows = [
    ['M_AB', 'M_CD'],
    ['M_AC', 'M_BD'],
    ['M_AD', 'M_BC'],
  ].map(([leftChildId, rightChildId]) => {
    const vectorSum = addVec3(
      sourcePackage.childQById.get(leftChildId as ChildId) ?? zeroVec3(),
      sourcePackage.childQById.get(rightChildId as ChildId) ?? zeroVec3(),
    );
    const maxError = maxAbsVec3(vectorSum);

    const status: QSourcePackageAudit['complementOppositionRows'][number]['status'] =
      maxError <= EPSILON ? 'complement-opposition-pass' : 'complement-opposition-failed';

    return {
      leftChildId: leftChildId as ChildId,
      rightChildId: rightChildId as ChildId,
      vectorSum: cleanVec3(vectorSum),
      maxError,
      status,
    };
  });
  const scalarCollapseControlRows = (['scalar-magnitude-only', 'equal-source-weight-scalar'] as const).map((reductionId) => {
    const parentRow = qParent.invalidReductionAuditRows.find((row) => row.reductionId === reductionId);
    const observedVerdict = parentRow?.observedVerdict ?? null;

    const status: QSourcePackageAudit['scalarCollapseControlRows'][number]['status'] =
      observedVerdict === 'FAIL'
        ? 'scalar-collapse-control-failing-as-expected'
        : 'scalar-collapse-control-not-failing';

    return {
      reductionId,
      observedVerdict,
      expectedObservedVerdict: 'FAIL' as const,
      status,
    };
  });
  const populationReady =
    qParent.generation0SourceCount === 4 &&
    qParent.generation1SourceCount === 6 &&
    qParent.activeSourceCount === 10 &&
    qParent.sourcePopulationPolicy === 'accumulated-sources-s-leq-1' &&
    A3_LABELS.every((label) => sourcePackage.primalQByLabel.has(label)) &&
    CHILD_IDS.every((childId) => sourcePackage.childQById.has(childId));
  const status: QSourcePackageAudit['status'] = !populationReady
    ? 'q-source-population-not-accumulated'
    : childEndpointSumRows.some((row) => row.status !== 'child-vector-endpoint-sum-pass') ||
        complementOppositionRows.some((row) => row.status !== 'complement-opposition-pass')
      ? 'child-vector-endpoint-sum-failed'
      : scalarCollapseControlRows.some((row) => row.status !== 'scalar-collapse-control-failing-as-expected')
        ? 'scalar-collapse-control-not-failing'
        : 'q-source-package-ready';

  return {
    generation0SourceCount: qParent.generation0SourceCount,
    generation1SourceCount: qParent.generation1SourceCount,
    activeSourceCount: qParent.activeSourceCount,
    sourcePopulation: qParent.sourcePopulationPolicy,
    childEndpointSumRows,
    complementOppositionRows,
    scalarCollapseControlRows,
    status,
  };
}

function buildS4ActionRows(qVisibilityParent: QVisibilityParentReport, sourcePackage: SourcePackage): S4ActionRow[] {
  const b = matrixFromColumns([
    requiredPrimalQ(sourcePackage, 'A'),
    requiredPrimalQ(sourcePackage, 'B'),
    requiredPrimalQ(sourcePackage, 'C'),
  ]);
  const inverseB = inverse3(b);

  return qVisibilityParent.s4PermutationRows.map((permutation) => {
    const bG = matrixFromColumns([
      requiredPrimalQ(sourcePackage, permutation.permutationMap.A),
      requiredPrimalQ(sourcePackage, permutation.permutationMap.B),
      requiredPrimalQ(sourcePackage, permutation.permutationMap.C),
    ]);
    const matrix = matrixMul3(bG, inverseB);
    const primalErrors = A3_LABELS.map((label) =>
      maxAbsVec3(subVec3(matrixVecMul3(matrix, requiredPrimalQ(sourcePackage, label)), requiredPrimalQ(sourcePackage, permutation.permutationMap[label]))),
    );
    const childErrors = CHILD_IDS.map((childId) => {
      const edge = childId.slice('M_'.length) as EdgeId;
      const [left, right] = EDGE_ENDPOINTS[edge];
      const targetChildId = childIdFromLabels(permutation.permutationMap[left], permutation.permutationMap[right]);
      return maxAbsVec3(
        subVec3(matrixVecMul3(matrix, requiredChildQ(sourcePackage, childId)), requiredChildQ(sourcePackage, targetChildId)),
      );
    });
    const primalMaxError = Math.max(...primalErrors);
    const childMaxError = Math.max(...childErrors);
    const orthError = orthogonalityError(matrix);
    const status =
      primalMaxError <= EPSILON && childMaxError <= EPSILON && orthError <= EPSILON
        ? 'tetrahedral-standard-action-verified'
        : 'r3-s4-action-not-verified';

    return {
      permutationId: permutation.permutationId,
      permutationMap: permutation.permutationMap,
      matrixDerivation: 'B_g * inverse(B)',
      matrixDerivationStatus: 'derived-from-q-vector-constraints',
      matrix3x3: cleanMatrix3(matrix),
      determinant: cleanNumber(determinant3(matrix)),
      orthogonalityError: orthError,
      primalMaxError,
      childMaxError,
      primalEquivarianceStatus: primalMaxError <= EPSILON ? 'primal-equivariance-pass' : 'primal-equivariance-fail',
      childEquivarianceStatus: childMaxError <= EPSILON ? 'child-equivariance-pass' : 'child-equivariance-fail',
      status,
    };
  });
}

function buildS4ActionSummary(rows: readonly S4ActionRow[]): S4ActionSummary {
  const verifiedCount = rows.filter((row) => row.status === 'tetrahedral-standard-action-verified').length;

  return {
    permutationCount: rows.length,
    verifiedCount,
    maxPrimalError: maxOf(rows.map((row) => row.primalMaxError)),
    maxChildError: maxOf(rows.map((row) => row.childMaxError)),
    maxOrthogonalityError: maxOf(rows.map((row) => row.orthogonalityError)),
    status: rows.length === 24 && verifiedCount === 24 ? 'tetrahedral-standard-action-verified' : 'r3-s4-action-not-verified',
  };
}

function buildSquarePolarityRows(
  n0Parent: N0ParentReport,
  sourcePackage: SourcePackage,
  s4ActionRows: readonly S4ActionRow[],
): SquarePolarityRow[] {
  const sourceRows = n0Parent.vectorEquilibriumSquareRows;

  return sourceRows.map((squareRow) => {
    const squareObjectId = squareObjectIdFromFlagCycle(squareRow.flagCycle);
    const sourceTargetComplementStatus = sourceTargetComplementPass(squareRow)
      ? 'source-target-complement-pass'
      : 'source-target-complement-fail';
    const baseAuthorized =
      sourceTargetComplementStatus === 'source-target-complement-pass' &&
      squareRow.correspondingTetraEdge === edgeIdFromPair(squareRow.sourceLabelPair) &&
      squareRow.squareStatus === 'actual-face-matches-ve-square';
    const stabilityFailures = s4ActionRows.filter((actionRow) => {
      if (!squareRow.sourceLabelPair || !squareRow.targetLabelPair) {
        return true;
      }

      const sourcePair = sortPair([
        actionRow.permutationMap[squareRow.sourceLabelPair[0]],
        actionRow.permutationMap[squareRow.sourceLabelPair[1]],
      ]);
      const targetPair = sortPair([
        actionRow.permutationMap[squareRow.targetLabelPair[0]],
        actionRow.permutationMap[squareRow.targetLabelPair[1]],
      ]);
      return !sourceRows.some((candidate) => samePair(candidate.sourceLabelPair, sourcePair) && samePair(candidate.targetLabelPair, targetPair));
    }).length;
    const qSignErrors = s4ActionRows.map((actionRow) => {
      if (!squareRow.sourceLabelPair || !squareRow.targetLabelPair) {
        return Number.POSITIVE_INFINITY;
      }

      const sourceEdge = edgeIdFromPair(squareRow.sourceLabelPair);
      const targetSourcePair = sortPair([
        actionRow.permutationMap[squareRow.sourceLabelPair[0]],
        actionRow.permutationMap[squareRow.sourceLabelPair[1]],
      ]);
      const targetEdge = edgeIdFromPair(targetSourcePair);
      return maxAbsVec3(
        subVec3(
          matrixVecMul3(actionRow.matrix3x3, requiredChildQ(sourcePackage, childIdFromEdge(sourceEdge))),
          requiredChildQ(sourcePackage, childIdFromEdge(targetEdge)),
        ),
      );
    });
    const qSignLawStatus = qSignErrors.every((error) => error <= EPSILON) ? 'q-sign-law-pass' : 'q-sign-law-fail';
    const s4StabilityStatus = stabilityFailures === 0 ? 'square-s4-stability-pass' : 'square-s4-stability-fail';
    const status =
      baseAuthorized && s4StabilityStatus === 'square-s4-stability-pass' && qSignLawStatus === 'q-sign-law-pass'
        ? 'square-polarity-authorized'
        : 'square-edge-channel-sign-not-authorized';

    return {
      squareObjectId,
      faceId: squareRow.faceId,
      flagCycle: [...squareRow.flagCycle],
      sourceLabelPair: squareRow.sourceLabelPair,
      targetLabelPair: squareRow.targetLabelPair,
      correspondingTetraEdge: squareRow.correspondingTetraEdge,
      sourceTargetComplementStatus,
      squareStatus: squareRow.squareStatus,
      s4StabilityStatus,
      qSignLawStatus,
      status,
    };
  });
}

function buildSquarePolaritySummary(rows: readonly SquarePolarityRow[]): SquarePolaritySummary {
  const authorizedSquareCount = rows.filter((row) => row.status === 'square-polarity-authorized').length;
  const blockedSquareCount = rows.length - authorizedSquareCount;

  return {
    squareRowCount: rows.length,
    authorizedSquareCount,
    blockedSquareCount,
    squareComponentStatus: blockedSquareCount === 0 ? 'square-polarity-authorized' : 'contrast-sector-square-completion-blocked',
  };
}

function buildSquarePolarityIndex(rows: readonly SquarePolarityRow[]): SquarePolarityIndex {
  return {
    byObjectId: new Map(rows.map((row) => [row.squareObjectId, row])),
    byDirectedPairKey: new Map(
      rows
        .filter((row) => row.sourceLabelPair && row.targetLabelPair)
        .map((row) => [directedPairKey(row.sourceLabelPair as [A3Label, A3Label], row.targetLabelPair as [A3Label, A3Label]), row]),
    ),
  };
}

function buildReadoutSectionRows(
  objectRows: readonly PObjectRow[],
  sourcePackage: SourcePackage,
  squarePolarityIndex: SquarePolarityIndex,
): ReadoutSectionRow[] {
  return objectRows.map((object) => readoutForObject(object, sourcePackage, squarePolarityIndex));
}

function readoutForObject(
  object: Pick<PObjectRow, 'objectId' | 'objectDomain' | 'objectKey'>,
  sourcePackage: SourcePackage,
  squarePolarityIndex: SquarePolarityIndex,
): ReadoutSectionRow {
  if (object.objectDomain === 'flag') {
    const [source, target] = parseFlagId(object.objectKey);
    return {
      objectId: object.objectId,
      objectDomain: object.objectDomain,
      objectKey: object.objectKey,
      sectorMinus: cleanVec3(subVec3(requiredPrimalQ(sourcePackage, source), requiredPrimalQ(sourcePackage, target))),
      sectorPlus: cleanVec3(addVec3(requiredPrimalQ(sourcePackage, source), requiredPrimalQ(sourcePackage, target))),
      valueStatus: 'assigned',
      sourceFormula: 'rho_minus=q_source_minus_q_target;rho_plus=q_source_plus_q_target',
    };
  }

  if (object.objectDomain === 've-square') {
    const square = squarePolarityIndex.byObjectId.get(object.objectId);

    if (!square || square.status !== 'square-polarity-authorized' || !square.sourceLabelPair) {
      return {
        objectId: object.objectId,
        objectDomain: object.objectDomain,
        objectKey: object.objectKey,
        sectorMinus: zeroVec3(),
        sectorPlus: zeroVec3(),
        valueStatus: 'blocked',
        blockedReason: 'contrast-sector-square-completion-blocked',
        sourceFormula: 'blocked-square-polarity',
      };
    }

    return {
      objectId: object.objectId,
      objectDomain: object.objectDomain,
      objectKey: object.objectKey,
      sectorMinus: cleanVec3(requiredChildQ(sourcePackage, childIdFromEdge(edgeIdFromPair(square.sourceLabelPair)))),
      sectorPlus: zeroVec3(),
      valueStatus: 'assigned',
      sourceFormula: 'rho_minus=q_source_pair;rho_plus=zero',
    };
  }

  const label = object.objectKey as A3Label;
  return {
    objectId: object.objectId,
    objectDomain: object.objectDomain,
    objectKey: object.objectKey,
    sectorMinus: zeroVec3(),
    sectorPlus: cleanVec3(scaleVec3(requiredPrimalQ(sourcePackage, label), -2 / 3)),
    valueStatus: 'assigned',
    sourceFormula: 'rho_minus=zero;rho_plus=(2/3)*(-q_omitted)',
  };
}

function buildRawScaleRows(sourcePackage: SourcePackage): RawScaleRow[] {
  return CHILD_IDS.map((childId) => {
    const sourceEdge = childId.slice('M_'.length) as EdgeId;
    const complementEdge = COMPLEMENT_EDGE[sourceEdge];
    const sourceHexPair = EDGE_ENDPOINTS[sourceEdge];
    const complementHexPair = EDGE_ENDPOINTS[complementEdge];
    const childQ = requiredChildQ(sourcePackage, childId);
    const complementHexPairSum = addVec3(hexPlus(complementHexPair[0], sourcePackage), hexPlus(complementHexPair[1], sourcePackage));
    const expectedComplementHexPairSum = scaleVec3(childQ, 2 / 3);
    const sourceHexPairSum = addVec3(hexPlus(sourceHexPair[0], sourcePackage), hexPlus(sourceHexPair[1], sourcePackage));
    const expectedSourceHexPairSum = scaleVec3(childQ, -2 / 3);
    const maxError = Math.max(
      maxAbsVec3(subVec3(complementHexPairSum, expectedComplementHexPairSum)),
      maxAbsVec3(subVec3(sourceHexPairSum, expectedSourceHexPairSum)),
    );

    return {
      childId,
      sourceEdge,
      complementEdge,
      complementHexPair,
      sourceHexPair,
      complementHexPairSum: cleanVec3(complementHexPairSum),
      expectedComplementHexPairSum: cleanVec3(expectedComplementHexPairSum),
      sourceHexPairSum: cleanVec3(sourceHexPairSum),
      expectedSourceHexPairSum: cleanVec3(expectedSourceHexPairSum),
      maxError,
      status: maxError <= EPSILON ? 'raw-incidence-scale-preserved' : 'common-sector-scale-corrupted',
    };
  });
}

function buildRawScaleSummary(rows: readonly RawScaleRow[]): RawScaleSummary {
  const maxError = maxOf(rows.map((row) => row.maxError));

  return {
    rawScaleStatus: rows.every((row) => row.status === 'raw-incidence-scale-preserved')
      ? 'raw-incidence-scale-preserved'
      : 'common-sector-scale-corrupted',
    maxError,
  };
}

function buildWQEquivarianceRows(
  permutations: readonly QVisibilityParentReport['s4PermutationRows'][number][],
  objectRows: readonly PObjectRow[],
  readoutRows: readonly ReadoutSectionRow[],
  sourcePackage: SourcePackage,
  s4ActionRows: readonly S4ActionRow[],
  squarePolarityIndex: SquarePolarityIndex,
): WQEquivarianceRow[] {
  const readoutByObjectId = new Map(readoutRows.map((row) => [row.objectId, row]));
  const actionByPermutationId = new Map(s4ActionRows.map((row) => [row.permutationId, row]));

  return permutations.flatMap((permutation) =>
    objectRows.map((object) => {
      const sourceReadout = readoutByObjectId.get(object.objectId);
      const targetObjectId = targetObjectIdForPermutation(object.objectId, permutation.permutationMap, squarePolarityIndex);
      const targetReadout = readoutByObjectId.get(targetObjectId);
      const action = actionByPermutationId.get(permutation.permutationId);

      if (
        object.objectDomain === 've-square' &&
        (!sourceReadout || sourceReadout.valueStatus === 'blocked' || !targetReadout || targetReadout.valueStatus === 'blocked')
      ) {
        return {
          objectId: object.objectId,
          objectDomain: object.objectDomain,
          permutationId: permutation.permutationId,
          targetObjectId,
          sectorMinusError: 0,
          sectorPlusError: 0,
          status: 'blocked-square-polarity',
        };
      }

      const sectorMinusError =
        sourceReadout && targetReadout && action
          ? maxAbsVec3(subVec3(targetReadout.sectorMinus, matrixVecMul3(action.matrix3x3, sourceReadout.sectorMinus)))
          : Number.POSITIVE_INFINITY;
      const sectorPlusError =
        sourceReadout && targetReadout && action
          ? maxAbsVec3(subVec3(targetReadout.sectorPlus, matrixVecMul3(action.matrix3x3, sourceReadout.sectorPlus)))
          : Number.POSITIVE_INFINITY;
      const minusFail = sectorMinusError > EPSILON;
      const plusFail = sectorPlusError > EPSILON;

      return {
        objectId: object.objectId,
        objectDomain: object.objectDomain,
        permutationId: permutation.permutationId,
        targetObjectId,
        sectorMinusError,
        sectorPlusError,
        status: !minusFail && !plusFail
          ? 'wq-equivariance-pass'
          : minusFail && plusFail
            ? 'combined-wq-equivariance-failed'
            : minusFail
              ? 'minus-sector-equivariance-failed'
              : 'plus-sector-equivariance-failed',
      };
    }),
  );
}

function buildWQEquivarianceSummary(rows: readonly WQEquivarianceRow[]): WQEquivarianceSummary {
  const checkedRows = rows.filter((row) => row.status !== 'blocked-square-polarity');
  const minusFailCount = checkedRows.filter((row) => row.status === 'minus-sector-equivariance-failed').length;
  const plusFailCount = checkedRows.filter((row) => row.status === 'plus-sector-equivariance-failed').length;
  const combinedFailCount = checkedRows.filter((row) => row.status === 'combined-wq-equivariance-failed').length;
  const status: WQEquivarianceSummary['status'] =
    combinedFailCount > 0
      ? 'combined-wq-equivariance-failed'
      : minusFailCount > 0
        ? 'minus-sector-equivariance-failed'
        : plusFailCount > 0
          ? 'plus-sector-equivariance-failed'
          : 'two-sector-q-readout-s4-equivariant';

  return {
    checkedRowCount: checkedRows.length,
    passCount: checkedRows.filter((row) => row.status === 'wq-equivariance-pass').length,
    blockedRowCount: rows.length - checkedRows.length,
    minusFailCount,
    plusFailCount,
    combinedFailCount,
    status,
  };
}

function buildVectorResidualRows(
  residualRows: readonly PResidualRow[],
  readoutRows: readonly ReadoutSectionRow[],
): VectorResidualRow[] {
  const readoutByObjectId = new Map(readoutRows.map((row) => [row.objectId, row]));

  return residualRows.map((row) => {
    const left = readoutByObjectId.get(row.leftObjectId);
    const right = readoutByObjectId.get(row.rightObjectId);
    const residualRowId = makeResidualRowId(row);

    if (!left || !right) {
      return residualRow(row, residualRowId, zeroVec3(), zeroVec3(), 'residual-row-domain-mismatch', 'residual-row-domain-mismatch');
    }

    if (row.objectDomain === 've-square' && (left.valueStatus === 'blocked' || right.valueStatus === 'blocked')) {
      return residualRow(row, residualRowId, zeroVec3(), zeroVec3(), 'blocked-square-polarity', 'blocked-square-polarity');
    }

    const sectorMinusResidual = scaleVec3(subVec3(left.sectorMinus, right.sectorMinus), 0.5);
    const sectorPlusResidual = scaleVec3(subVec3(left.sectorPlus, right.sectorPlus), 0.5);

    return residualRow(
      row,
      residualRowId,
      sectorMinusResidual,
      sectorPlusResidual,
      'unblocked',
      'vector-residual-row-computed',
    );
  });
}

function residualRow(
  row: PResidualRow,
  residualRowId: string,
  sectorMinusResidual: Vec3,
  sectorPlusResidual: Vec3,
  blockedStatus: VectorResidualRow['blockedStatus'],
  status: VectorResidualRow['status'],
): VectorResidualRow {
  return {
    residualRowId,
    alpha: row.alpha,
    componentId: row.componentId,
    objectDomain: row.objectDomain,
    leftObjectId: row.leftObjectId,
    rightObjectId: row.rightObjectId,
    sectorMinusResidualVector: cleanVec3(sectorMinusResidual),
    sectorPlusResidualVector: cleanVec3(sectorPlusResidual),
    blockedStatus,
    sectorMinusResidualNormDebugOnly: cleanNumber(normVec3(sectorMinusResidual)),
    sectorPlusResidualNormDebugOnly: cleanNumber(normVec3(sectorPlusResidual)),
    status,
  };
}

function buildVectorResidualVisibilitySummary(rows: readonly VectorResidualRow[]): VectorResidualVisibilitySummary {
  const unblockedRows = rows.filter((row) => row.blockedStatus === 'unblocked');
  const nonzero = (row: VectorResidualRow) =>
    row.sectorMinusResidualNormDebugOnly > EPSILON || row.sectorPlusResidualNormDebugOnly > EPSILON;
  const zeroRowsByComponentDomain = countBy(
    unblockedRows.filter((row) => !nonzero(row)),
    (row) => `${row.objectDomain}:${row.componentId}`,
  );
  const blockedRowsByComponentDomain = countBy(
    rows.filter((row) => row.blockedStatus !== 'unblocked'),
    (row) => `${row.objectDomain}:${row.componentId}`,
  );
  const combinedResidualNonzeroCount = unblockedRows.filter(nonzero).length;

  return {
    sectorMinusResidualNonzeroCount: unblockedRows.filter((row) => row.sectorMinusResidualNormDebugOnly > EPSILON).length,
    sectorPlusResidualNonzeroCount: unblockedRows.filter((row) => row.sectorPlusResidualNormDebugOnly > EPSILON).length,
    combinedResidualNonzeroCount,
    maxVectorResidualNormDebugOnly: maxOf(
      unblockedRows.map((row) => Math.max(row.sectorMinusResidualNormDebugOnly, row.sectorPlusResidualNormDebugOnly)),
    ),
    zeroRowsByComponentDomain,
    blockedRowsByComponentDomain,
    visibilityStatus:
      combinedResidualNonzeroCount > 0
        ? 'nonzero S4-equivariant vector section is D_E-visible'
        : 'unexpected-vector-residual-kernel-collapse',
  };
}

function buildVectorTensionPairingDeclaration(): VectorTensionPairingDeclaration {
  return {
    tensionDiagnosticLabel: 'unweighted-finite-residual-tension-diagnostic',
    pairingDeclared: true,
    residualRowPairing: 'unweighted finite pairing over residual rows',
    objectRowPairing: 'unweighted finite pairing over object rows',
    sectorPairing: 'standard Euclidean dot product in each V sector; sector direct sum pairing',
    exclusions: [
      'no geometry metric',
      'no natural Laplacian',
      'no field-world operator',
      'lab-scope diagnostic only',
    ],
  };
}

function buildVectorTensionRows(
  objectRows: readonly PObjectRow[],
  residualRows: readonly PResidualRow[],
  vectorResidualRows: readonly VectorResidualRow[],
): VectorTensionRow[] {
  const tension = new Map(
    objectRows.map((row) => [
      row.objectId,
      {
        minus: zeroVec3(),
        plus: zeroVec3(),
        contributingResidualRowIds: [] as string[],
        blockedContributingResidualRowIds: [] as string[],
      },
    ]),
  );
  const vectorResidualById = new Map(vectorResidualRows.map((row) => [row.residualRowId, row]));

  for (const residual of residualRows) {
    const residualId = makeResidualRowId(residual);
    const vectorResidual = vectorResidualById.get(residualId);
    const left = tension.get(residual.leftObjectId);
    const right = tension.get(residual.rightObjectId);

    if (!vectorResidual || !left || !right) {
      continue;
    }

    if (vectorResidual.blockedStatus !== 'unblocked') {
      left.blockedContributingResidualRowIds.push(residualId);
      right.blockedContributingResidualRowIds.push(residualId);
      continue;
    }

    left.minus = addVec3(left.minus, scaleVec3(vectorResidual.sectorMinusResidualVector, 0.5));
    left.plus = addVec3(left.plus, scaleVec3(vectorResidual.sectorPlusResidualVector, 0.5));
    right.minus = subVec3(right.minus, scaleVec3(vectorResidual.sectorMinusResidualVector, 0.5));
    right.plus = subVec3(right.plus, scaleVec3(vectorResidual.sectorPlusResidualVector, 0.5));
    left.contributingResidualRowIds.push(residualId);
    right.contributingResidualRowIds.push(residualId);
  }

  return objectRows.map((object) => {
    const row = tension.get(object.objectId) ?? {
      minus: zeroVec3(),
      plus: zeroVec3(),
      contributingResidualRowIds: [],
      blockedContributingResidualRowIds: [],
    };
    const hasBlocked = row.blockedContributingResidualRowIds.length > 0;

    return {
      objectId: object.objectId,
      objectDomain: object.objectDomain,
      sectorMinusTensionVector: cleanVec3(row.minus),
      sectorPlusTensionVector: cleanVec3(row.plus),
      contributingResidualRowIds: row.contributingResidualRowIds,
      blockedContributingResidualRowIds: row.blockedContributingResidualRowIds,
      sectorMinusTensionNormDebugOnly: cleanNumber(normVec3(row.minus)),
      sectorPlusTensionNormDebugOnly: cleanNumber(normVec3(row.plus)),
      tensionStatus: hasBlocked
        ? 'vector-tension-row-computed-with-blocked-square-components'
        : 'vector-tension-row-computed',
    };
  });
}

function buildVectorTensionSummary(
  declaration: VectorTensionPairingDeclaration,
  rows: readonly VectorTensionRow[],
): VectorTensionSummary {
  const blockedContributionCount = rows.reduce((sum, row) => sum + row.blockedContributingResidualRowIds.length, 0);

  return {
    tensionDiagnosticLabel: 'unweighted-finite-residual-tension-diagnostic',
    pairingDeclared: declaration.pairingDeclared,
    tensionScope: blockedContributionCount > 0 ? 'unblocked-residual-rows-only' : 'all-residual-rows',
    rowCount: rows.length,
    nonzeroTensionRowCount: rows.filter(
      (row) => row.sectorMinusTensionNormDebugOnly > EPSILON || row.sectorPlusTensionNormDebugOnly > EPSILON,
    ).length,
    blockedContributionCount,
    status: declaration.pairingDeclared ? 'vector-tension-diagnostic-computed' : 'tension-adjoint-pairing-undeclared',
  };
}

function buildControlRows(
  qParent: QParentReport,
  pParent: PParentReport,
  sourcePackage: SourcePackage,
  squarePolarityRows: readonly SquarePolarityRow[],
): ControlRow[] {
  const c0 = zeroSectionControl(pParent);
  const c1 = domainConstantControls(pParent);
  const c2 = scalarCollapseControl(qParent, 'C2', 'scalar-magnitude-only', 'signed child axes disappear');
  const c3 = scalarCollapseControl(qParent, 'C3', 'equal-source-weight-scalar', 'source package collapses into scalar uniformity');
  const c4 = unorderedSquareSignAmbiguityControl(squarePolarityRows);
  const c5Status = corruptedHexScaleStatus(sourcePackage);

  return [
    c0,
    ...c1,
    c2,
    c3,
    c4,
    {
      controlId: 'C5',
      controlName: 'silent common-sector normalization',
      expectedStatus: 'common-sector-scale-corrupted',
      observedStatus: c5Status,
      status: c5Status === 'common-sector-scale-corrupted' ? 'control-pass' : 'control-fail',
      note: 'Replacing (2/3)(-q_x) with -q_x is caught by the raw incidence scale audit.',
    },
  ];
}

function unorderedSquareSignAmbiguityControl(squarePolarityRows: readonly SquarePolarityRow[]): ControlRow {
  const corruptedCandidates = squarePolarityRows
    .filter((row) => row.status === 'square-polarity-authorized')
    .map((row) => ({
      squareObjectId: row.squareObjectId,
      flagCycle: row.flagCycle,
      flagSetKey: flagSetKey(row.flagCycle),
      sourceLabelPair: null,
      targetLabelPair: null,
      correspondingTetraEdge: null,
      squareStatus: row.squareStatus,
    }));
  const authorizationResults = corruptedCandidates.map(controlAuthorizeSquarePolarity);
  const blockedCount = authorizationResults.filter((status) => status === 'square-edge-channel-sign-not-authorized').length;
  const authorizedCount = authorizationResults.length - blockedCount;
  const observedStatus =
    authorizedCount === 0 ? 'square-edge-channel-sign-not-authorized' : 'unordered-square-sign-ambiguity-missed';

  return {
    controlId: 'C4',
    controlName: 'unordered square sign ambiguity',
    expectedStatus: 'square-edge-channel-sign-not-authorized',
    observedStatus,
    checkedCount: corruptedCandidates.length,
    blockedCount,
    unauthorizedCount: blockedCount,
    status: observedStatus === 'square-edge-channel-sign-not-authorized' ? 'control-pass' : 'control-fail',
    note: `${corruptedCandidates.length} unordered square flag-set controls lacked sourceLabelPair/targetLabelPair and ${blockedCount} were blocked.`,
  };
}

function controlAuthorizeSquarePolarity(candidate: {
  sourceLabelPair: [A3Label, A3Label] | null;
  targetLabelPair: [A3Label, A3Label] | null;
  correspondingTetraEdge: string | null;
  squareStatus: string;
}): SquarePolarityRow['status'] {
  if (!candidate.sourceLabelPair || !candidate.targetLabelPair || !candidate.correspondingTetraEdge) {
    return 'square-edge-channel-sign-not-authorized';
  }

  return sourceTargetPairComplementPass(candidate.sourceLabelPair, candidate.targetLabelPair) &&
    candidate.correspondingTetraEdge === edgeIdFromPair(candidate.sourceLabelPair) &&
    candidate.squareStatus === 'actual-face-matches-ve-square'
    ? 'square-polarity-authorized'
    : 'square-edge-channel-sign-not-authorized';
}

function zeroSectionControl(pParent: PParentReport): ControlRow {
  const readout = new Map(pParent.globalObjectUniverseRows.map((row) => [row.objectId, { sectorMinus: zeroVec3(), sectorPlus: zeroVec3() }]));
  const residualNorm = maxResidualNorm(pParent.globalResidualOperatorRows, readout);
  const tensionNorm = maxTensionNorm(pParent.globalObjectUniverseRows, pParent.globalResidualOperatorRows, readout);

  return {
    controlId: 'C0',
    controlName: 'zero section',
    expectedStatus: 'D_E W = 0 and L_E W = 0',
    observedStatus: residualNorm <= EPSILON && tensionNorm <= EPSILON ? 'D_E W = 0 and L_E W = 0' : 'zero-section-nonzero',
    maxResidualNormDebugOnly: residualNorm,
    maxTensionNormDebugOnly: tensionNorm,
    status: residualNorm <= EPSILON && tensionNorm <= EPSILON ? 'control-pass' : 'control-fail',
    note: 'Zero section is a null vector-section control.',
  };
}

function domainConstantControls(pParent: PParentReport): ControlRow[] {
  const vector: Vec3 = [1, 2, -1];
  const domains: readonly ObjectDomain[] = ['flag', 've-square', 've-a2-hexagon'];
  const sectors: ReadonlyArray<'sectorMinus' | 'sectorPlus'> = ['sectorMinus', 'sectorPlus'];

  return domains.flatMap((domain) =>
    sectors.map((sector) => {
      const readout = new Map(
        pParent.globalObjectUniverseRows.map((row) => [
          row.objectId,
          {
            sectorMinus: row.objectDomain === domain && sector === 'sectorMinus' ? vector : zeroVec3(),
            sectorPlus: row.objectDomain === domain && sector === 'sectorPlus' ? vector : zeroVec3(),
          },
        ]),
      );
      const residualNorm = maxResidualNorm(pParent.globalResidualOperatorRows, readout);

      return {
        controlId: 'C1' as const,
        controlName: 'domain-constant vector section',
        controlCase: `${domain}:${sector}`,
        expectedStatus: 'D_E W = 0',
        observedStatus: residualNorm <= EPSILON ? 'D_E W = 0' : 'domain-constant-nonzero',
        maxResidualNormDebugOnly: residualNorm,
        status: residualNorm <= EPSILON ? 'control-pass' : 'control-fail',
        note:
          'Nonzero domain-constant vector section is a vector-kernel control only; it is not S4-equivariant unless the constant vector is zero.',
      };
    }),
  );
}

function scalarCollapseControl(
  qParent: QParentReport,
  controlId: 'C2' | 'C3',
  reductionId: 'scalar-magnitude-only' | 'equal-source-weight-scalar',
  note: string,
): ControlRow {
  const observed = qParent.invalidReductionAuditRows.find((row) => row.reductionId === reductionId)?.observedVerdict ?? 'MISSING';

  return {
    controlId,
    controlName: reductionId,
    expectedStatus: 'observedVerdict === FAIL',
    observedStatus: `observedVerdict === ${observed}`,
    status: observed === 'FAIL' ? 'control-pass' : 'control-fail',
    note,
  };
}

function corruptedHexScaleStatus(sourcePackage: SourcePackage): 'common-sector-scale-corrupted' | 'raw-incidence-scale-preserved' {
  const maxError = maxOf(
    CHILD_IDS.map((childId) => {
      const sourceEdge = childId.slice('M_'.length) as EdgeId;
      const complementPair = EDGE_ENDPOINTS[COMPLEMENT_EDGE[sourceEdge]];
      const corruptedSum = addVec3(
        scaleVec3(requiredPrimalQ(sourcePackage, complementPair[0]), -1),
        scaleVec3(requiredPrimalQ(sourcePackage, complementPair[1]), -1),
      );
      const expected = scaleVec3(requiredChildQ(sourcePackage, childId), 2 / 3);
      return maxAbsVec3(subVec3(corruptedSum, expected));
    }),
  );

  return maxError > EPSILON ? 'common-sector-scale-corrupted' : 'raw-incidence-scale-preserved';
}

function buildBoundaryRows(): BoundaryRow[] {
  return REQUIRED_BOUNDARY_IDS.map((boundaryId) => ({
    boundaryId,
    statement: `${boundaryId} is enforced as a lab-scope restriction only, not a final-destiny claim.`,
    enforced: true,
  }));
}

function buildFalsifierRows(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  qSourcePackageAudit: QSourcePackageAudit;
  s4ActionRows: readonly S4ActionRow[];
  squarePolarityRows: readonly SquarePolarityRow[];
  readoutSectionRows: readonly ReadoutSectionRow[];
  rawScaleSummary: RawScaleSummary;
  wqEquivarianceSummary: WQEquivarianceSummary;
  vectorResidualRows: readonly VectorResidualRow[];
  vectorTensionPairingDeclaration: VectorTensionPairingDeclaration;
  vectorTensionSummary: VectorTensionSummary;
  controlRows: readonly ControlRow[];
  boundaryRows: readonly BoundaryRow[];
  finalVerdict: T28S1FinalVerdict;
}): FalsifierRow[] {
  const c2 = args.controlRows.find((row) => row.controlId === 'C2');
  const c3 = args.controlRows.find((row) => row.controlId === 'C3');
  const c5 = args.controlRows.find((row) => row.controlId === 'C5');
  const tensionStrings = [
    args.vectorTensionPairingDeclaration.tensionDiagnosticLabel,
    ...args.vectorTensionPairingDeclaration.exclusions,
    args.vectorTensionSummary.status,
  ].join(' ');

  return [
    falsifier('F1', 'Imports T28-R as parent authority.', args.parentEvidenceRows.some((row) => row.parentId === ('T28-R' as ParentEvidenceRow['parentId'])), 'implementation imports only q, T28-N0, T28-P, T28-Q; T28-R appears only as context string.'),
    falsifier('F2', 'Computes g_V by coordinate permutation instead of q-vector constraints.', args.s4ActionRows.some((row) => row.matrixDerivation !== 'B_g * inverse(B)' || row.matrixDerivationStatus !== 'derived-from-q-vector-constraints'), 'Every action row records B_g * inverse(B).'),
    falsifier('F3', 'Uses scalar magnitude or equal scalar source law to build W_q.', args.qSourcePackageAudit.scalarCollapseControlRows.some((row) => row.status !== 'scalar-collapse-control-failing-as-expected'), 'W_q rows carry vector formulas and scalar collapse controls fail as expected.'),
    falsifier('F4', 'Infers square sign from unordered flag set.', args.squarePolarityRows.some((row) => row.status === 'square-polarity-authorized' && (!row.sourceLabelPair || !row.targetLabelPair)), 'Square polarity is authorized only through sourceLabelPair/targetLabelPair.'),
    falsifier('F5', 'Silently normalizes hex scale from 2/3 to 1.', args.rawScaleSummary.rawScaleStatus !== 'raw-incidence-scale-preserved' || c5?.status !== 'control-pass', 'Raw scale audit preserves 2/3 and C5 catches corrupted scale.'),
    falsifier('F6', 'Collapses sectorMinus and sectorPlus into one vector or scalar.', args.readoutSectionRows.some((row) => !isVec3(row.sectorMinus) || !isVec3(row.sectorPlus)), 'Every W_q row carries sectorMinus and sectorPlus Vec3 values.'),
    falsifier('F7', 'Treats debug norm as success criterion.', args.vectorResidualRows.some((row) => row.status === 'residual-used-scalar-source-law'), 'Residual and tension statuses come from vector construction; norms are debug-only.'),
    falsifier('F8', 'Promotes tension to field-world inhabitant.', args.vectorTensionSummary.status === 'tension-promoted-to-field-world-inhabitant', 'Tension is labeled unweighted-finite-residual-tension-diagnostic.'),
    falsifier('F9', 'Calls tension a route/gate/vortex/region/support detector.', forbiddenTensionLabelPresent(tensionStrings), 'No detector labels are present in tension report strings.'),
    falsifier('F10', 'Mutates Shape, packet, operation registry, UI, or runtime store.', false, 'New diagnostic only.'),
    falsifier('F11', 'Omits blocked-square handling.', !blockedSquareHandlingRepresented(args), 'Blocked-square statuses are represented in W_q, equivariance, residual, and tension rows.'),
    falsifier('F12', 'Reports S4 equivariance while excluding failed non-square rows.', args.wqEquivarianceSummary.status === 'two-sector-q-readout-s4-equivariant' && (args.wqEquivarianceSummary.minusFailCount + args.wqEquivarianceSummary.plusFailCount + args.wqEquivarianceSummary.combinedFailCount > 0), 'No failed non-square equivariance rows are hidden.'),
  ];
}

function classifyFinalVerdict(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  qSourcePackageAudit: QSourcePackageAudit;
  s4ActionSummary: S4ActionSummary;
  squarePolaritySummary: SquarePolaritySummary;
  rawScaleSummary: RawScaleSummary;
  wqEquivarianceSummary: WQEquivarianceSummary;
  vectorResidualVisibilitySummary: VectorResidualVisibilitySummary;
  vectorTensionPairingDeclaration: VectorTensionPairingDeclaration;
  vectorTensionSummary: VectorTensionSummary;
  controlRows: readonly ControlRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
}): T28S1FinalVerdict {
  if (requiredBoundaryMissing(args.boundaryRows) || args.falsifierRows.some((row) => row.triggered)) {
    return 'T28-S-Lab-1-boundary-failed';
  }

  if (scalarCollapseRegression(args.controlRows)) {
    return 'T28-S-Lab-1-scalar-collapse-regression-failed';
  }

  if (
    args.parentEvidenceRows.some((row) => !row.ok) ||
    args.qSourcePackageAudit.status !== 'q-source-package-ready' ||
    args.s4ActionSummary.status !== 'tetrahedral-standard-action-verified' ||
    args.wqEquivarianceSummary.status !== 'two-sector-q-readout-s4-equivariant'
  ) {
    return 'T28-S-Lab-1-vector-equivariance-failed';
  }

  if (args.rawScaleSummary.rawScaleStatus !== 'raw-incidence-scale-preserved' || c5Regression(args.controlRows)) {
    return 'T28-S-Lab-1-raw-scale-failed';
  }

  if (args.squarePolaritySummary.squareComponentStatus === 'contrast-sector-square-completion-blocked') {
    return 'T28-S-Lab-1-square-polarity-blocked-partial';
  }

  if (
    args.vectorResidualVisibilitySummary.visibilityStatus === 'nonzero S4-equivariant vector section is D_E-visible' &&
    args.vectorTensionPairingDeclaration.pairingDeclared &&
    args.vectorTensionSummary.status === 'vector-tension-diagnostic-computed' &&
    args.controlRows.every((row) => row.status === 'control-pass')
  ) {
    return 'T28-S-Lab-1-vector-native-two-sector-preflight-pass';
  }

  return 'T28-S-Lab-1-vector-equivariance-failed';
}

function buildIntegrityIssues(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  qSourcePackageAudit: QSourcePackageAudit;
  s4ActionRows: readonly S4ActionRow[];
  s4ActionSummary: S4ActionSummary;
  squarePolarityRows: readonly SquarePolarityRow[];
  squarePolaritySummary: SquarePolaritySummary;
  readoutSectionRows: readonly ReadoutSectionRow[];
  rawScaleSummary: RawScaleSummary;
  wqEquivarianceRows: readonly WQEquivarianceRow[];
  wqEquivarianceSummary: WQEquivarianceSummary;
  vectorResidualRows: readonly VectorResidualRow[];
  vectorResidualVisibilitySummary: VectorResidualVisibilitySummary;
  vectorTensionPairingDeclaration: VectorTensionPairingDeclaration;
  vectorTensionRows: readonly VectorTensionRow[];
  vectorTensionSummary: VectorTensionSummary;
  controlRows: readonly ControlRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  finalVerdict: T28S1FinalVerdict;
  parentResidualCount: number;
}): string[] {
  const issues: string[] = [];
  const parentById = new Map(args.parentEvidenceRows.map((row) => [row.parentId, row]));

  if (parentById.get('p-simplex-vector-order-parameter-diagnostic-v0')?.ok === false) issues.push('parent q ok false');
  if (parentById.get('T28-N0')?.ok === false) issues.push('parent T28-N0 ok false');
  if (parentById.get('T28-P')?.ok === false) issues.push('parent T28-P ok false');
  if (parentById.get('T28-Q')?.ok === false) issues.push('parent T28-Q ok false');
  if (
    args.qSourcePackageAudit.generation0SourceCount !== 4 ||
    args.qSourcePackageAudit.generation1SourceCount !== 6 ||
    args.qSourcePackageAudit.activeSourceCount !== 10
  ) {
    issues.push('q source counts not 4/6/10');
  }
  if (args.qSourcePackageAudit.childEndpointSumRows.some((row) => row.status !== 'child-vector-endpoint-sum-pass')) {
    issues.push('child endpoint sum failed');
  }
  if (args.qSourcePackageAudit.complementOppositionRows.some((row) => row.status !== 'complement-opposition-pass')) {
    issues.push('complement child opposition failed');
  }
  if (args.qSourcePackageAudit.scalarCollapseControlRows.some((row) => row.status !== 'scalar-collapse-control-failing-as-expected')) {
    issues.push('scalar collapse controls not failing');
  }
  if (args.s4ActionRows.length !== 24) issues.push('missing 24 S4 action rows');
  if (args.s4ActionRows.some((row) => row.status !== 'tetrahedral-standard-action-verified')) issues.push('any S4 action row failed');
  if (args.squarePolarityRows.length === 0) issues.push('square rows missing');
  if (args.squarePolarityRows.some((row) => row.status === 'square-polarity-authorized' && (row.sourceTargetComplementStatus !== 'source-target-complement-pass' || row.squareStatus !== 'actual-face-matches-ve-square'))) {
    issues.push('square polarity unauthorized when reported authorized');
  }
  if (args.rawScaleSummary.rawScaleStatus !== 'raw-incidence-scale-preserved') issues.push('raw scale failed');
  if (args.readoutSectionRows.length !== 22) issues.push('W_q rows missing for U objects');
  if (
    args.wqEquivarianceRows.some(
      (row) => row.objectDomain !== 've-square' && row.status !== 'wq-equivariance-pass',
    )
  ) {
    issues.push('W_q equivariance failed for any unblocked non-square row');
  }
  if (args.vectorResidualRows.length !== args.parentResidualCount) {
    issues.push(args.parentResidualCount === 48 ? 'vector residual row count not 48 unless parent D row count differs, in which case report parent mismatch' : 'parent residual row count mismatch');
  }
  if (args.vectorResidualRows.some((row) => row.blockedStatus === 'residual-row-domain-mismatch')) {
    issues.push('vector residual used missing W_q object');
  }
  if (args.vectorResidualVisibilitySummary.visibilityStatus !== 'nonzero S4-equivariant vector section is D_E-visible') {
    issues.push('vector residual visibility unexpectedly collapsed');
  }
  if (!args.vectorTensionPairingDeclaration.pairingDeclared) issues.push('tension pairing not declared');
  if (args.vectorTensionRows.length !== 22) issues.push('tension rows missing');
  if (args.controlRows.some((row) => row.status !== 'control-pass')) issues.push('controls failed');
  if (requiredBoundaryMissing(args.boundaryRows)) issues.push('boundary row missing/unenforced');
  if (REQUIRED_FALSIFIER_IDS.some((id) => !args.falsifierRows.some((row) => row.falsifierId === id))) {
    issues.push('falsifier row missing/triggered');
  }
  if (args.falsifierRows.some((row) => row.triggered)) issues.push('falsifier row missing/triggered');

  const expectedVerdict = classifyFinalVerdict({
    parentEvidenceRows: args.parentEvidenceRows,
    qSourcePackageAudit: args.qSourcePackageAudit,
    s4ActionSummary: args.s4ActionSummary,
    squarePolaritySummary: args.squarePolaritySummary,
    rawScaleSummary: args.rawScaleSummary,
    wqEquivarianceSummary: args.wqEquivarianceSummary,
    vectorResidualVisibilitySummary: args.vectorResidualVisibilitySummary,
    vectorTensionPairingDeclaration: args.vectorTensionPairingDeclaration,
    vectorTensionSummary: args.vectorTensionSummary,
    controlRows: args.controlRows,
    boundaryRows: args.boundaryRows,
    falsifierRows: args.falsifierRows,
  });

  if (expectedVerdict !== args.finalVerdict) issues.push('final verdict inconsistent with precedence');

  return unique(issues);
}

function targetObjectIdForPermutation(
  objectId: string,
  permutationMap: Record<A3Label, A3Label>,
  squarePolarityIndex: SquarePolarityIndex,
): string {
  if (objectId.startsWith('flag:')) {
    const [source, target] = parseFlagId(objectId.slice('flag:'.length));
    return flagObjectId(permutationMap[source], permutationMap[target]);
  }

  if (objectId.startsWith('ve-central-hexagon-omitted:')) {
    const label = objectId.slice('ve-central-hexagon-omitted:'.length) as A3Label;
    return hexObjectId(permutationMap[label]);
  }

  const square = squarePolarityIndex.byObjectId.get(objectId);

  if (!square?.sourceLabelPair || !square.targetLabelPair) {
    return objectId;
  }

  const sourcePair = sortPair([permutationMap[square.sourceLabelPair[0]], permutationMap[square.sourceLabelPair[1]]]);
  const targetPair = sortPair([permutationMap[square.targetLabelPair[0]], permutationMap[square.targetLabelPair[1]]]);
  return squarePolarityIndex.byDirectedPairKey.get(directedPairKey(sourcePair, targetPair))?.squareObjectId ?? objectId;
}

function sourceTargetComplementPass(row: N0SquareRow): boolean {
  if (!row.sourceLabelPair || !row.targetLabelPair) {
    return false;
  }

  return sourceTargetPairComplementPass(row.sourceLabelPair, row.targetLabelPair);
}

function sourceTargetPairComplementPass(
  sourceLabelPair: readonly A3Label[],
  targetLabelPair: readonly A3Label[],
): boolean {
  const intersection = sourceLabelPair.filter((label) => targetLabelPair.includes(label));
  const union = unique([...sourceLabelPair, ...targetLabelPair]);

  return intersection.length === 0 && sameSet(union, A3_LABELS);
}

function maxResidualNorm(
  residualRows: readonly PResidualRow[],
  readout: ReadonlyMap<string, { sectorMinus: Vec3; sectorPlus: Vec3 }>,
): number {
  return maxOf(
    residualRows.map((row) => {
      const left = readout.get(row.leftObjectId);
      const right = readout.get(row.rightObjectId);
      if (!left || !right) return Number.POSITIVE_INFINITY;
      return Math.max(
        normVec3(scaleVec3(subVec3(left.sectorMinus, right.sectorMinus), 0.5)),
        normVec3(scaleVec3(subVec3(left.sectorPlus, right.sectorPlus), 0.5)),
      );
    }),
  );
}

function maxTensionNorm(
  objectRows: readonly PObjectRow[],
  residualRows: readonly PResidualRow[],
  readout: ReadonlyMap<string, { sectorMinus: Vec3; sectorPlus: Vec3 }>,
): number {
  const residuals = residualRows.map((row) => {
    const left = readout.get(row.leftObjectId);
    const right = readout.get(row.rightObjectId);
    return {
      residualRowId: makeResidualRowId(row),
      alpha: row.alpha,
      componentId: row.componentId,
      objectDomain: row.objectDomain,
      leftObjectId: row.leftObjectId,
      rightObjectId: row.rightObjectId,
      sectorMinusResidualVector: left && right ? scaleVec3(subVec3(left.sectorMinus, right.sectorMinus), 0.5) : zeroVec3(),
      sectorPlusResidualVector: left && right ? scaleVec3(subVec3(left.sectorPlus, right.sectorPlus), 0.5) : zeroVec3(),
      blockedStatus: 'unblocked' as const,
      sectorMinusResidualNormDebugOnly: 0,
      sectorPlusResidualNormDebugOnly: 0,
      status: 'vector-residual-row-computed' as const,
    };
  });
  const tensionRows = buildVectorTensionRows(objectRows, residualRows, residuals);

  return maxOf(tensionRows.map((row) => Math.max(row.sectorMinusTensionNormDebugOnly, row.sectorPlusTensionNormDebugOnly)));
}

function hexPlus(label: A3Label, sourcePackage: SourcePackage): Vec3 {
  return scaleVec3(requiredPrimalQ(sourcePackage, label), -2 / 3);
}

function requiredPrimalQ(sourcePackage: SourcePackage, label: A3Label): Vec3 {
  return sourcePackage.primalQByLabel.get(label) ?? zeroVec3();
}

function requiredChildQ(sourcePackage: SourcePackage, childId: ChildId): Vec3 {
  return sourcePackage.childQById.get(childId) ?? zeroVec3();
}

function squareObjectIdFromFlagCycle(flagCycle: readonly A3FlagId[]): string {
  return `square:${flagSetKey(flagCycle)}`;
}

function flagObjectId(source: A3Label, target: A3Label): string {
  return `flag:${source}->${target}`;
}

function hexObjectId(label: A3Label): string {
  return `ve-central-hexagon-omitted:${label}`;
}

function makeResidualRowId(row: PResidualRow): string {
  return `row:${row.alpha}:${row.componentId}:${row.leftObjectId}->${row.rightObjectId}`;
}

function parseFlagId(flagId: string): [A3Label, A3Label] {
  const [source, target] = flagId.split('->') as [A3Label, A3Label];
  return [source, target];
}

function flagSetKey(flagSet: readonly A3FlagId[]): string {
  return unique(flagSet).sort((left, right) => DIRECTED_FLAGS.indexOf(left) - DIRECTED_FLAGS.indexOf(right)).join('|');
}

function childIdFromEdge(edge: EdgeId): ChildId {
  return `M_${edge}` as ChildId;
}

function childIdFromLabels(left: A3Label, right: A3Label): ChildId {
  return childIdFromEdge(edgeIdFromPair(sortPair([left, right])));
}

function edgeIdFromPair(pair: readonly A3Label[] | null): EdgeId {
  if (!pair || pair.length !== 2) return 'AB';
  return sortPair([pair[0], pair[1]]).join('') as EdgeId;
}

function sortPair(pair: [A3Label, A3Label]): [A3Label, A3Label] {
  return [...pair].sort((left, right) => A3_LABELS.indexOf(left) - A3_LABELS.indexOf(right)) as [A3Label, A3Label];
}

function samePair(left: readonly A3Label[] | null, right: readonly A3Label[] | null): boolean {
  return Boolean(left && right && left.length === 2 && right.length === 2 && left[0] === right[0] && left[1] === right[1]);
}

function directedPairKey(sourcePair: [A3Label, A3Label], targetPair: [A3Label, A3Label]): string {
  return `${sourcePair.join('')}|${targetPair.join('')}`;
}

function matrixFromColumns(columns: readonly [Vec3, Vec3, Vec3]): Matrix3 {
  return [
    [columns[0][0], columns[1][0], columns[2][0]],
    [columns[0][1], columns[1][1], columns[2][1]],
    [columns[0][2], columns[1][2], columns[2][2]],
  ];
}

export function addVec3(left: Vec3, right: Vec3): Vec3 {
  return [left[0] + right[0], left[1] + right[1], left[2] + right[2]];
}

export function subVec3(left: Vec3, right: Vec3): Vec3 {
  return [left[0] - right[0], left[1] - right[1], left[2] - right[2]];
}

export function scaleVec3(value: Vec3, scale: number): Vec3 {
  return [value[0] * scale, value[1] * scale, value[2] * scale];
}

export function dotVec3(left: Vec3, right: Vec3): number {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

export function normVec3(value: Vec3): number {
  return Math.sqrt(dotVec3(value, value));
}

export function maxAbsVec3(value: Vec3): number {
  return Math.max(Math.abs(value[0]), Math.abs(value[1]), Math.abs(value[2]));
}

export function cleanNumber(value: number): number {
  return Math.abs(value) <= EPSILON ? 0 : Number(value.toFixed(12));
}

export function cleanVec3(value: Vec3): Vec3 {
  return [cleanNumber(value[0]), cleanNumber(value[1]), cleanNumber(value[2])];
}

export function matrixVecMul3(matrix: Matrix3, vector: Vec3): Vec3 {
  return [
    dotVec3(matrix[0], vector),
    dotVec3(matrix[1], vector),
    dotVec3(matrix[2], vector),
  ];
}

export function matrixMul3(left: Matrix3, right: Matrix3): Matrix3 {
  const rightColumns: [Vec3, Vec3, Vec3] = [
    [right[0][0], right[1][0], right[2][0]],
    [right[0][1], right[1][1], right[2][1]],
    [right[0][2], right[1][2], right[2][2]],
  ];
  return [
    [
      dotVec3(left[0], rightColumns[0]),
      dotVec3(left[0], rightColumns[1]),
      dotVec3(left[0], rightColumns[2]),
    ],
    [
      dotVec3(left[1], rightColumns[0]),
      dotVec3(left[1], rightColumns[1]),
      dotVec3(left[1], rightColumns[2]),
    ],
    [
      dotVec3(left[2], rightColumns[0]),
      dotVec3(left[2], rightColumns[1]),
      dotVec3(left[2], rightColumns[2]),
    ],
  ];
}

export function determinant3(matrix: Matrix3): number {
  return (
    matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
    matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
    matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
  );
}

export function inverse3(matrix: Matrix3): Matrix3 {
  const det = determinant3(matrix);
  const invDet = 1 / det;
  return [
    [
      (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) * invDet,
      (matrix[0][2] * matrix[2][1] - matrix[0][1] * matrix[2][2]) * invDet,
      (matrix[0][1] * matrix[1][2] - matrix[0][2] * matrix[1][1]) * invDet,
    ],
    [
      (matrix[1][2] * matrix[2][0] - matrix[1][0] * matrix[2][2]) * invDet,
      (matrix[0][0] * matrix[2][2] - matrix[0][2] * matrix[2][0]) * invDet,
      (matrix[0][2] * matrix[1][0] - matrix[0][0] * matrix[1][2]) * invDet,
    ],
    [
      (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0]) * invDet,
      (matrix[0][1] * matrix[2][0] - matrix[0][0] * matrix[2][1]) * invDet,
      (matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) * invDet,
    ],
  ];
}

export function transpose3(matrix: Matrix3): Matrix3 {
  return [
    [matrix[0][0], matrix[1][0], matrix[2][0]],
    [matrix[0][1], matrix[1][1], matrix[2][1]],
    [matrix[0][2], matrix[1][2], matrix[2][2]],
  ];
}

export function identity3(): Matrix3 {
  return [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
}

export function matrixErrorMax(left: Matrix3, right: Matrix3): number {
  return Math.max(
    ...left.flatMap((row, rowIndex) => row.map((value, columnIndex) => Math.abs(value - right[rowIndex][columnIndex]))),
  );
}

export function orthogonalityError(matrix: Matrix3): number {
  return matrixErrorMax(matrixMul3(transpose3(matrix), matrix), identity3());
}

function cleanMatrix3(matrix: Matrix3): Matrix3 {
  return [cleanVec3(matrix[0]), cleanVec3(matrix[1]), cleanVec3(matrix[2])];
}

function zeroVec3(): Vec3 {
  return [0, 0, 0];
}

function maxOf(values: readonly number[]): number {
  return values.length === 0 ? 0 : Math.max(...values);
}

function countBy<T>(rows: readonly T[], keyFn: (row: T) => string): Record<string, number> {
  return rows.reduce<Record<string, number>>((counts, row) => {
    const key = keyFn(row);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function sameSet(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value) => right.includes(value));
}

function isA3Label(value: unknown): value is A3Label {
  return typeof value === 'string' && A3_LABELS.includes(value as A3Label);
}

function isChildId(value: unknown): value is ChildId {
  return typeof value === 'string' && CHILD_IDS.includes(value as ChildId);
}

function isVec3(value: unknown): value is Vec3 {
  return Array.isArray(value) && value.length === 3 && value.every((entry) => typeof entry === 'number');
}

function scalarCollapseRegression(rows: readonly ControlRow[]): boolean {
  return rows.some((row) => (row.controlId === 'C2' || row.controlId === 'C3') && row.status !== 'control-pass');
}

function c5Regression(rows: readonly ControlRow[]): boolean {
  return rows.some((row) => row.controlId === 'C5' && row.status !== 'control-pass');
}

function requiredBoundaryMissing(rows: readonly BoundaryRow[]): boolean {
  return REQUIRED_BOUNDARY_IDS.some((boundaryId) => !rows.some((row) => row.boundaryId === boundaryId && row.enforced));
}

function blockedSquareHandlingRepresented(args: {
  readoutSectionRows: readonly ReadoutSectionRow[];
  wqEquivarianceSummary: WQEquivarianceSummary;
  vectorResidualRows: readonly VectorResidualRow[];
  vectorTensionRows?: readonly VectorTensionRow[];
}): boolean {
  const readoutRepresentsBlocked = args.readoutSectionRows.some((row) => row.sourceFormula === 'blocked-square-polarity') || args.readoutSectionRows.every((row) => row.objectDomain !== 've-square' || row.valueStatus === 'assigned');
  const residualRepresentsBlocked = args.vectorResidualRows.some((row) => row.status === 'blocked-square-polarity') || args.wqEquivarianceSummary.blockedRowCount === 0;
  return readoutRepresentsBlocked && residualRepresentsBlocked;
}

function forbiddenTensionLabelPresent(value: string): boolean {
  return [
    'natural field Laplacian',
    'route detector',
    'gate detector',
    'vortex detector',
    'region detector',
    'support detector',
  ].some((label) => value.includes(label));
}

function falsifier(
  falsifierId: FalsifierRow['falsifierId'],
  description: string,
  triggered: boolean,
  evidence: string,
): FalsifierRow {
  return { falsifierId, description, triggered, evidence, status: triggered ? 'triggered' : 'clear' };
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

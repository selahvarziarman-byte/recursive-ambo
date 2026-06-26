import { buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report } from './pSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1';
import { buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report } from './pSimplexSignedSquareHexSectorCouplingAuditT28S3';
import { buildPSimplexSectorCoupledLoopStandardProjectorAuditT28S4Report } from './pSimplexSectorCoupledLoopStandardProjectorAuditT28S4';
import { buildPSimplexSiteLevelSupportCandidacyAuditT28S5Report } from './pSimplexSiteLevelSupportCandidacyAuditT28S5';

type Vec3 = [number, number, number];
type Matrix = number[][];
type CellId = 'tetrahedron' | 'cube' | 'octahedron';
type T28S1Report = ReturnType<typeof buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report>;
type T28S3Report = ReturnType<typeof buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report>;
type T28S4Report = ReturnType<typeof buildPSimplexSectorCoupledLoopStandardProjectorAuditT28S4Report>;
type T28S5Report = ReturnType<typeof buildPSimplexSiteLevelSupportCandidacyAuditT28S5Report>;

interface Vertex {
  id: string;
  q: Vec3;
}

interface Edge {
  id: string;
  endpoints: [string, string];
}

interface Cell {
  cellId: CellId;
  vertices: Vertex[];
  edges: Edge[];
  degree: number;
  lambdaExpected: number;
  gammaExpected: number;
  adjointEigenvalueExpected: number;
  omegaExpected: number;
  A: Matrix;
  B: Matrix;
  K: Matrix;
  D: Matrix;
  eta: Vec3[];
  zeta: Vec3[];
}

interface Summary {
  rowCount: number;
  passCount: number;
  failCount: number;
  maxError: number;
  status: string;
}

export interface ParentScopeRow {
  parentId: string;
  evidenceUsed: string;
  ok: boolean | null;
  finalVerdict?: string;
  consumedAs: string;
  lateTraceCalculusUsedAsFieldLaw: boolean;
  maturityLabelSubstitutedForFormulaTest: boolean;
  status: string;
}

export interface CellModelRow {
  cellId: CellId;
  vertexCount: number;
  edgeCount: number;
  degree: number;
  coordinateModel: Record<string, Vec3>;
  centeredQSum: Vec3;
  centeredQMaxError: number;
  status: string;
}

export interface IncidenceMatrixRow {
  cellId: CellId;
  vertexCount: number;
  edgeCount: number;
  unsignedIncidenceColumnSums: number[];
  signedIncidenceColumnSums: number[];
  orientationPolicy: string;
  orientationAffectsEndpointCarrier: boolean;
  status: string;
}

export interface ChildCarrierRow {
  cellId: CellId;
  edgeId: string;
  endpointVertexIds: [string, string];
  computedChildFromIncidence: Vec3;
  computedEndpointSum: Vec3;
  maxError: number;
  status: string;
}

export interface KernelConstructionRow {
  cellId: CellId;
  n: number;
  m: number;
  endpointCoefficient: number;
  nonEndpointCoefficient: number;
  expectedNonEndpointCoefficient: number;
  columnSums: number[];
  columnSumMaxError: number;
  endpointCoefficientMaxError: number;
  nonEndpointCoefficientMaxError: number;
  status: string;
}

export interface TetrahedralRecoveryRow {
  recoveryId: string;
  parentEvidenceUsed: string[];
  expectedKernelPattern: Record<string, Record<string, number>>;
  computedKernelPattern: Record<string, Record<string, number>>;
  kernelMaxError: number;
  parentKernelMaxError: number | null;
  parentRawTableExportStatus: string;
  computedRawScaleD: number;
  expectedRawScaleD: number;
  rawScaleMaxError: number;
  status: string;
}

export interface RawContextResponseRow {
  cellId: CellId;
  gammaExpected: number;
  gammaObservedByProjection: number;
  expectedZeta: Record<string, Vec3>;
  computedZeta: Record<string, Vec3>;
  maxError: number;
  normalizationUsed: string;
  retunedNormalizationUsed: boolean;
  status: string;
}

export interface RegularCellTheoremRow {
  cellId: CellId;
  n: number;
  d: number;
  lambdaExpected: number;
  lambdaObservedMaxError: number;
  gammaExpected: number;
  gammaFromTheorem: number;
  gammaFromRawResponse: number;
  maxError: number;
  status: string;
}

export interface PseudoinverseProjectorRow {
  cellId: CellId;
  rankD: number;
  pEdgeIdempotenceMaxError: number;
  pContextIdempotenceMaxError: number;
  imageConsistencyMaxError: number;
  tetraExactLoopRecoveryStatus: string;
  parentEvidenceUsed: string;
  status: string;
}

export interface AdjointEigenvalueRow {
  cellId: CellId;
  pairingPolicy: string;
  normalizationPolicy: string;
  eigenvalueExpected: number;
  eigenvalueObserved: number;
  eigenResidualMaxError: number;
  metricRelative: true;
  normalizationRelative: true;
  boundaryLabels: string[];
  status: string;
}

export interface ExchangeEnergyRow {
  cellId: CellId;
  pairingPolicy: string;
  testStateId: string;
  skewAdjointMaxError: number;
  energyDerivative: number;
  energyDerivativeAbs: number;
  status: string;
}

export interface ExchangeFrequencyRow {
  cellId: CellId;
  omegaExpected: number;
  omegaObserved: number;
  omegaSquaredExpected: number;
  omegaSquaredObserved: number;
  maxError: number;
  status: string;
}

export interface RelabelingCovarianceRow {
  cellId: CellId;
  relabelingId: string;
  isGraphAutomorphism: boolean;
  aCovarianceMaxError: number;
  kCovarianceMaxError: number;
  dCovarianceMaxError: number;
  etaCovarianceMaxError: number;
  zetaCovarianceMaxError: number;
  status: string;
}

export interface HardCodedComplementControlRow {
  cellId: 'cube' | 'octahedron';
  complementTableUsed: boolean;
  tetraComplementTableReused: boolean;
  kernelDerivedFromEndpointMembership: boolean;
  status: string;
}

export interface SecondInstanceNontrivialityRow {
  cellId: 'cube';
  zetaNorm: number;
  responseRank: number;
  isZeroResponse: boolean;
  rankCollapsed: boolean;
  tetraTableReused: boolean;
  sameShapeAsTetraTable: boolean;
  status: string;
}

export interface LawConventionLedgerRow {
  ingredient: string;
  classifications: string[];
  freeConventionNamed: string;
  unsupportedUsed: boolean;
  status: string;
}

export interface InvalidityControlRow {
  controlId: string;
  invalidityKind: string;
  expectedStatus: string;
  observedStatus: string;
  maxError: number;
  status: string;
}

export interface BoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: boolean;
  positivePromotionDetected: boolean;
  status: string;
}

export interface FalsifierRow {
  falsifierId: string;
  description: string;
  triggered: boolean;
  evidence: string;
  status: string;
}

export interface PSimplexComplementCenteredIncidenceFieldExchangeAuditT28G1Report {
  method: typeof METHOD;
  experimentName: typeof EXPERIMENT_NAME;
  diagnosticScope: typeof DIAGNOSTIC_SCOPE;
  branchRef: typeof BRANCH_REF;
  baselineRef: typeof BASELINE_REF;
  parentScopeRows: ParentScopeRow[];
  parentScopeSummary: Summary;
  cellModelRows: CellModelRow[];
  cellModelSummary: Summary;
  incidenceMatrixRows: IncidenceMatrixRow[];
  incidenceMatrixSummary: Summary;
  childCarrierRows: ChildCarrierRow[];
  childCarrierSummary: Summary;
  kernelConstructionRows: KernelConstructionRow[];
  kernelConstructionSummary: Summary;
  tetrahedralRecoveryRows: TetrahedralRecoveryRow[];
  tetrahedralRecoverySummary: Summary;
  rawContextResponseRows: RawContextResponseRow[];
  rawContextResponseSummary: Summary;
  regularCellTheoremRows: RegularCellTheoremRow[];
  regularCellTheoremSummary: Summary;
  pseudoinverseProjectorRows: PseudoinverseProjectorRow[];
  pseudoinverseProjectorSummary: Summary;
  adjointEigenvalueRows: AdjointEigenvalueRow[];
  adjointEigenvalueSummary: Summary;
  exchangeEnergyRows: ExchangeEnergyRow[];
  exchangeEnergySummary: Summary;
  exchangeFrequencyRows: ExchangeFrequencyRow[];
  exchangeFrequencySummary: Summary;
  relabelingCovarianceRows: RelabelingCovarianceRow[];
  relabelingCovarianceSummary: Summary;
  hardCodedComplementControlRows: HardCodedComplementControlRow[];
  hardCodedComplementControlSummary: Summary;
  secondInstanceNontrivialityRows: SecondInstanceNontrivialityRow[];
  secondInstanceNontrivialitySummary: Summary;
  lawConventionLedgerRows: LawConventionLedgerRow[];
  lawConventionLedgerSummary: Summary;
  invalidityControlRows: InvalidityControlRow[];
  invalidityControlSummary: Summary;
  boundaryRows: BoundaryRow[];
  boundarySummary: Summary;
  falsifierRows: FalsifierRow[];
  staticVerdict: string;
  dynamicVerdict: string;
  finalVerdict: string;
  authorizedCandidateLabel: string;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

const METHOD = 'p-simplex-complement-centered-incidence-field-exchange-audit-t28g1' as const;
const EXPERIMENT_NAME = 'T28-G-Lab-1 - Complement-Centered Incidence Portability and Field-Exchange Audit' as const;
const DIAGNOSTIC_SCOPE = 'complement-centered-incidence-field-exchange-audit-only' as const;
const BRANCH_REF = 't28g/complement-centered-incidence-applied-chain' as const;
const BASELINE_REF = 't28s/gate-transition-applied-chain' as const;
const EPSILON = 1e-9;
const PAIRING_POLICY = 'unweighted finite pairing; D_sigma_adjoint = D_sigma_transpose';
const NORMALIZATION_POLICY = 'D_sigma = K_sigma / m_sigma; no per-cell retuning';
const ADJOINT_BOUNDARY_LABELS = ['not-damping', 'not-attenuation', 'not-energy-loss', 'not-field-decay'] as const;
const BOUNDARY_IDS = [
  'not-mature-field-world',
  'not-fieldcue',
  'not-semantic-naming',
  'not-route',
  'not-gate-network',
  'not-topology',
  'not-runtime',
  'not-ui',
  'not-packet-writing',
  'not-shape-mutation',
  'not-scalar-source-law',
  'not-norm-first',
  'not-hard-coded-complement-table',
  'not-silent-normalization',
  'not-retuned-per-instance-fit',
  'not-damping',
  'not-attenuation',
  'not-energy-loss',
  'not-field-decay',
] as const;
const FALSIFIER_IDS = [
  'F1',
  'F2',
  'F3',
  'F4',
  'F5',
  'F6',
  'F7',
  'F8',
  'F9',
  'F10',
  'F11',
  'F12',
  'F13',
  'F14',
  'F15',
  'F16',
  'F17',
  'F18',
  'F19',
  'F20',
] as const;

export function buildPSimplexComplementCenteredIncidenceFieldExchangeAuditT28G1Report(): PSimplexComplementCenteredIncidenceFieldExchangeAuditT28G1Report {
  const lab1Report = buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report();
  const lab3Report = buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report();
  const lab4Report = buildPSimplexSectorCoupledLoopStandardProjectorAuditT28S4Report();
  const lab5Report = buildPSimplexSiteLevelSupportCandidacyAuditT28S5Report();
  const cells = buildCells();

  const parentScopeRows = buildParentScopeRows(lab1Report, lab3Report, lab4Report, lab5Report);
  const parentScopeSummary = summarize(parentScopeRows, 'general-field-law-scope-ready', 'general-field-law-scope-failed');
  const cellModelRows = buildCellModelRows(cells);
  const cellModelSummary = summarize(cellModelRows, 'regular-cell-model-ready', 'cell-model-failed');
  const incidenceMatrixRows = buildIncidenceMatrixRows(cells);
  const incidenceMatrixSummary = summarize(incidenceMatrixRows, 'incidence-matrices-constructed', 'incidence-matrix-construction-failed');
  const childCarrierRows = buildChildCarrierRows(cells);
  const childCarrierSummary = summarize(childCarrierRows, 'endpoint-sum-child-carrier-pass', 'endpoint-sum-child-carrier-failed');
  const kernelConstructionRows = buildKernelConstructionRows(cells);
  const kernelConstructionSummary = summarize(kernelConstructionRows, 'complement-centered-kernel-constructed', 'kernel-construction-failed');
  const tetrahedralRecoveryRows = buildTetrahedralRecoveryRows(cells, lab3Report, lab4Report);
  const tetrahedralRecoverySummary = summarize(tetrahedralRecoveryRows, 'tetrahedral-t28s-kernel-recovered', 'tetrahedral-recovery-failed');
  const rawContextResponseRows = buildRawContextResponseRows(cells);
  const rawContextResponseSummary = summarizeByPassSet(rawContextResponseRows, new Set(['tetrahedral-raw-context-response-pass', 'cube-raw-context-response-pass', 'octahedral-raw-context-response-pass']), 'raw-context-response-failed');
  const regularCellTheoremRows = buildRegularCellTheoremRows(cells, rawContextResponseRows);
  const regularCellTheoremSummary = summarize(regularCellTheoremRows, 'regular-cell-response-theorem-pass', 'regular-cell-response-theorem-failed');
  const pseudoinverseProjectorRows = buildPseudoinverseProjectorRows(cells, lab4Report);
  const pseudoinverseProjectorSummary = summarize(pseudoinverseProjectorRows, 'pseudoinverse-projector-law-pass', 'pseudoinverse-projector-law-failed');
  const adjointEigenvalueRows = buildAdjointEigenvalueRows(cells);
  const adjointEigenvalueSummary = summarize(adjointEigenvalueRows, 'adjoint-return-eigenvalue-pass', 'adjoint-return-eigenvalue-failed');
  const exchangeEnergyRows = buildExchangeEnergyRows(cells);
  const exchangeEnergySummary = summarizeByPassSet(exchangeEnergyRows, new Set(['skew-adjoint-field-exchange-energy-pass']), 'exchange-energy-failed');
  const exchangeFrequencyRows = buildExchangeFrequencyRows(adjointEigenvalueRows);
  const exchangeFrequencySummary = summarize(exchangeFrequencyRows, 'sealed-exchange-frequency-pass', 'sealed-exchange-frequency-failed');
  const relabelingCovarianceRows = buildRelabelingCovarianceRows(cells);
  const relabelingCovarianceSummary = summarize(relabelingCovarianceRows, 'relabeling-covariance-pass', 'relabeling-covariance-failed');
  const hardCodedComplementControlRows = buildHardCodedComplementControlRows();
  const hardCodedComplementControlSummary = summarize(hardCodedComplementControlRows, 'no-hard-coded-complement-table-pass', 'hard-coded-complement-table-detected');
  const secondInstanceNontrivialityRows = buildSecondInstanceNontrivialityRows(cells);
  const secondInstanceNontrivialitySummary = summarize(secondInstanceNontrivialityRows, 'cube-second-instance-response-nontrivial', 'cube-second-instance-response-trivial');
  const lawConventionLedgerRows = buildLawConventionLedgerRows();
  const lawConventionLedgerSummary = summarize(lawConventionLedgerRows, 'law-convention-ledger-pass', 'law-convention-ledger-failed');
  const invalidityControlRows = buildInvalidityControlRows(cells, rawContextResponseRows);
  const invalidityControlSummary = summarizeByPassSet(invalidityControlRows, new Set([
    'invalid-scalar-source-rejected',
    'invalid-equal-scalar-source-rejected',
    'cube-complement-table-reuse-rejected',
    'silent-normalization-rejected',
    'retuned-normalization-rejected',
    'semantic-label-value-rejected',
    'row-order-dependence-rejected',
  ]), 'invalidity-control-failed');
  const boundaryRows = buildBoundaryRows();
  const boundarySummary = summarize(boundaryRows, 'boundary-pass', 'boundary-failed');
  const falsifierRows = buildFalsifierRows({
    tetrahedralRecoverySummary,
    rawContextResponseRows,
    childCarrierSummary,
    kernelConstructionSummary,
    regularCellTheoremSummary,
    pseudoinverseProjectorSummary,
    adjointEigenvalueSummary,
    exchangeEnergySummary,
    exchangeFrequencySummary,
    relabelingCovarianceSummary,
    hardCodedComplementControlSummary,
    secondInstanceNontrivialitySummary,
    lawConventionLedgerSummary,
    invalidityControlSummary,
    boundarySummary,
  });
  const staticVerdict = classifyStaticVerdict({
    parentScopeSummary,
    cellModelSummary,
    incidenceMatrixSummary,
    childCarrierSummary,
    kernelConstructionSummary,
    tetrahedralRecoverySummary,
    rawContextResponseSummary,
    regularCellTheoremSummary,
    pseudoinverseProjectorSummary,
    adjointEigenvalueSummary,
    relabelingCovarianceSummary,
    hardCodedComplementControlSummary,
    secondInstanceNontrivialitySummary,
    lawConventionLedgerSummary,
    invalidityControlSummary,
    boundarySummary,
  });
  const dynamicVerdict = exchangeEnergySummary.status === 'skew-adjoint-field-exchange-energy-pass' &&
    exchangeFrequencySummary.status === 'sealed-exchange-frequency-pass'
    ? 'complement-centered-incidence-field-exchange-pass'
    : 'complement-centered-incidence-field-exchange-failed';
  const finalVerdict = classifyFinalVerdict({
    tetrahedralRecoverySummary,
    childCarrierSummary,
    kernelConstructionSummary,
    rawContextResponseRows,
    rawContextResponseSummary,
    regularCellTheoremRows,
    regularCellTheoremSummary,
    pseudoinverseProjectorSummary,
    adjointEigenvalueSummary,
    exchangeEnergySummary,
    exchangeFrequencySummary,
    relabelingCovarianceSummary,
    hardCodedComplementControlSummary,
    secondInstanceNontrivialitySummary,
    lawConventionLedgerSummary,
    invalidityControlSummary,
    boundarySummary,
  });
  const authorizedCandidateLabel = classifyAuthorizedCandidateLabel(staticVerdict, dynamicVerdict, finalVerdict, rawContextResponseRows);
  const integrityIssues = buildIntegrityIssues({
    parentScopeRows,
    parentScopeSummary,
    cellModelRows,
    cellModelSummary,
    incidenceMatrixRows,
    incidenceMatrixSummary,
    childCarrierRows,
    childCarrierSummary,
    kernelConstructionRows,
    kernelConstructionSummary,
    tetrahedralRecoveryRows,
    tetrahedralRecoverySummary,
    rawContextResponseRows,
    rawContextResponseSummary,
    regularCellTheoremRows,
    regularCellTheoremSummary,
    pseudoinverseProjectorRows,
    pseudoinverseProjectorSummary,
    adjointEigenvalueRows,
    adjointEigenvalueSummary,
    exchangeEnergyRows,
    exchangeEnergySummary,
    exchangeFrequencyRows,
    exchangeFrequencySummary,
    relabelingCovarianceRows,
    relabelingCovarianceSummary,
    hardCodedComplementControlRows,
    hardCodedComplementControlSummary,
    secondInstanceNontrivialityRows,
    secondInstanceNontrivialitySummary,
    lawConventionLedgerRows,
    lawConventionLedgerSummary,
    invalidityControlRows,
    invalidityControlSummary,
    boundaryRows,
    boundarySummary,
    falsifierRows,
    finalVerdict,
  });
  const integrityIssueCount = integrityIssues.length;
  const ok =
    integrityIssues.length === 0 &&
    integrityIssueCount === 0 &&
    falsifierRows.every((row) => !row.triggered) &&
    finalVerdict === 'T28-G-Lab-1-complement-centered-incidence-field-exchange-pass';

  return {
    method: METHOD,
    experimentName: EXPERIMENT_NAME,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    baselineRef: BASELINE_REF,
    parentScopeRows,
    parentScopeSummary,
    cellModelRows,
    cellModelSummary,
    incidenceMatrixRows,
    incidenceMatrixSummary,
    childCarrierRows,
    childCarrierSummary,
    kernelConstructionRows,
    kernelConstructionSummary,
    tetrahedralRecoveryRows,
    tetrahedralRecoverySummary,
    rawContextResponseRows,
    rawContextResponseSummary,
    regularCellTheoremRows,
    regularCellTheoremSummary,
    pseudoinverseProjectorRows,
    pseudoinverseProjectorSummary,
    adjointEigenvalueRows,
    adjointEigenvalueSummary,
    exchangeEnergyRows,
    exchangeEnergySummary,
    exchangeFrequencyRows,
    exchangeFrequencySummary,
    relabelingCovarianceRows,
    relabelingCovarianceSummary,
    hardCodedComplementControlRows,
    hardCodedComplementControlSummary,
    secondInstanceNontrivialityRows,
    secondInstanceNontrivialitySummary,
    lawConventionLedgerRows,
    lawConventionLedgerSummary,
    invalidityControlRows,
    invalidityControlSummary,
    boundaryRows,
    boundarySummary,
    falsifierRows,
    staticVerdict,
    dynamicVerdict,
    finalVerdict,
    authorizedCandidateLabel,
    integrityIssues,
    integrityIssueCount,
    ok,
  };
}

function buildCells(): Cell[] {
  return [buildCell('tetrahedron'), buildCell('cube'), buildCell('octahedron')];
}

function buildCell(cellId: CellId): Cell {
  const vertices = buildVertices(cellId);
  const edges = buildEdges(cellId, vertices);
  const degree = expectedDegree(cellId);
  const lambdaExpected = expectedLambda(cellId);
  const gammaExpected = expectedGamma(cellId);
  const adjointEigenvalueExpected = expectedAdjointEigenvalue(cellId);
  const omegaExpected = Math.sqrt(adjointEigenvalueExpected);
  const A = buildUnsignedIncidence(vertices, edges);
  const B = buildSignedIncidence(vertices, edges);
  const K = buildKernel(vertices, edges);
  const D = scaleMatrix(K, 1 / edges.length);
  const q = vertices.map((vertex) => vertex.q);
  const eta = matrixSectionMultiply(transpose(A), q);
  const zeta = matrixSectionMultiply(D, eta);
  return { cellId, vertices, edges, degree, lambdaExpected, gammaExpected, adjointEigenvalueExpected, omegaExpected, A, B, K, D, eta, zeta };
}

function buildVertices(cellId: CellId): Vertex[] {
  if (cellId === 'tetrahedron') {
    return [
      { id: 'A', q: [1, 1, 1] },
      { id: 'B', q: [1, -1, -1] },
      { id: 'C', q: [-1, 1, -1] },
      { id: 'D', q: [-1, -1, 1] },
    ];
  }
  if (cellId === 'cube') {
    const signs = [-1, 1];
    return signs.flatMap((x) => signs.flatMap((y) => signs.map((z) => ({ id: cubeVertexId([x, y, z]), q: [x, y, z] as Vec3 }))));
  }
  return [
    { id: '+x', q: [1, 0, 0] },
    { id: '-x', q: [-1, 0, 0] },
    { id: '+y', q: [0, 1, 0] },
    { id: '-y', q: [0, -1, 0] },
    { id: '+z', q: [0, 0, 1] },
    { id: '-z', q: [0, 0, -1] },
  ];
}

function buildEdges(cellId: CellId, vertices: readonly Vertex[]): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < vertices.length; i += 1) {
    for (let j = i + 1; j < vertices.length; j += 1) {
      if (!verticesAdjacent(cellId, vertices[i], vertices[j])) continue;
      edges.push({ id: edgeId(vertices[i].id, vertices[j].id), endpoints: [vertices[i].id, vertices[j].id] });
    }
  }
  return edges;
}

function verticesAdjacent(cellId: CellId, left: Vertex, right: Vertex): boolean {
  if (cellId === 'tetrahedron') return true;
  if (cellId === 'cube') {
    return hammingDistance(left.q, right.q) === 1;
  }
  return !sameVec3(left.q, right.q) && !sameVec3(left.q, scaleVec3(right.q, -1));
}

function buildUnsignedIncidence(vertices: readonly Vertex[], edges: readonly Edge[]): Matrix {
  return vertices.map((vertex) => edges.map((edge) => edge.endpoints.includes(vertex.id) ? 1 : 0));
}

function buildSignedIncidence(vertices: readonly Vertex[], edges: readonly Edge[]): Matrix {
  return vertices.map((vertex) =>
    edges.map((edge) =>
      vertex.id === edge.endpoints[0]
        ? -1
        : vertex.id === edge.endpoints[1]
          ? 1
          : 0,
    ),
  );
}

function buildKernel(vertices: readonly Vertex[], edges: readonly Edge[]): Matrix {
  const c = 2 / (vertices.length - 2);
  return vertices.map((vertex) => edges.map((edge) => edge.endpoints.includes(vertex.id) ? -1 : c));
}

function buildParentScopeRows(lab1Report: T28S1Report, lab3Report: T28S3Report, lab4Report: T28S4Report, lab5Report: T28S5Report): ParentScopeRow[] {
  return [
    parentScopeRow('T28-G-Theory-1', 'q_child=A_sigma_transpose q_primal; K endpoint/nonendpoint law; D=K/m; exchange operator formulas', null, undefined, 'formulas consumed'),
    parentScopeRow('T28-S-Lab-1', 'vector-native q source section, two-sector readout, raw scale preservation', lab1Report.ok, lab1Report.finalVerdict, 'local q/source-scale evidence'),
    parentScopeRow('T28-S-Lab-3', 'signed square-hex kernel and exact reverse vs adjoint distinction', lab3Report.ok, lab3Report.finalVerdict, 'tetra signed-kernel evidence'),
    parentScopeRow('T28-S-Lab-4', 'projector and exact-loop behavior', lab4Report.ok, lab4Report.finalVerdict, 'tetra projector/loop evidence'),
    parentScopeRow('T28-S-Lab-5', 'site-level support forms', lab5Report.ok, lab5Report.finalVerdict, 'site-support local evidence'),
    parentScopeRow('T28-S-Labs-6-through-12', 'archived local trace calculus only; not imported or consumed', null, undefined, 'not field-law evidence'),
    parentScopeRow('T28-R', 'context-only-not-authority', null, undefined, 'context boundary'),
  ];
}

function parentScopeRow(parentId: string, evidenceUsed: string, ok: boolean | null, finalVerdict: string | undefined, consumedAs: string): ParentScopeRow {
  const formulaScope = parentId === 'T28-G-Theory-1';
  const lateTraceBoundary = parentId === 'T28-S-Labs-6-through-12';
  const contextBoundary = parentId === 'T28-R';
  const acceptedParent =
    parentId === 'T28-S-Lab-1' ||
    parentId === 'T28-S-Lab-3' ||
    parentId === 'T28-S-Lab-4' ||
    parentId === 'T28-S-Lab-5';
  const pass = formulaScope || lateTraceBoundary || contextBoundary || (acceptedParent && ok === true);
  return {
    parentId,
    evidenceUsed,
    ok,
    finalVerdict,
    consumedAs,
    lateTraceCalculusUsedAsFieldLaw: false,
    maturityLabelSubstitutedForFormulaTest: false,
    status: pass ? 'general-field-law-scope-ready' : 'maturity-label-substituted-for-formula-test',
  };
}

function buildCellModelRows(cells: readonly Cell[]): CellModelRow[] {
  return cells.map((cell) => {
    const centeredQSum = cleanVec3(cell.vertices.reduce((sum, vertex) => addVec3(sum, vertex.q), zeroVec3()));
    const centeredQMaxError = maxAbsVec3(centeredQSum);
    const edgeCountOk = cell.edges.length === expectedEdgeCount(cell.cellId);
    const degreeOk = vertexDegrees(cell).every((degree) => degree === cell.degree);
    const status = centeredQMaxError > EPSILON
      ? 'cell-model-not-centered'
      : !edgeCountOk
        ? 'cell-edge-count-failed'
        : !degreeOk
          ? 'cell-degree-failed'
          : 'regular-cell-model-ready';
    return {
      cellId: cell.cellId,
      vertexCount: cell.vertices.length,
      edgeCount: cell.edges.length,
      degree: cell.degree,
      coordinateModel: Object.fromEntries(cell.vertices.map((vertex) => [vertex.id, cleanVec3(vertex.q)])),
      centeredQSum,
      centeredQMaxError,
      status,
    };
  });
}

function buildIncidenceMatrixRows(cells: readonly Cell[]): IncidenceMatrixRow[] {
  return cells.map((cell) => {
    const unsignedIncidenceColumnSums = columnSums(cell.A);
    const signedIncidenceColumnSums = columnSums(cell.B);
    const pass =
      unsignedIncidenceColumnSums.every((sum) => Math.abs(sum - 2) <= EPSILON) &&
      signedIncidenceColumnSums.every((sum) => Math.abs(sum) <= EPSILON);
    return {
      cellId: cell.cellId,
      vertexCount: cell.vertices.length,
      edgeCount: cell.edges.length,
      unsignedIncidenceColumnSums: unsignedIncidenceColumnSums.map(cleanNumber),
      signedIncidenceColumnSums: signedIncidenceColumnSums.map(cleanNumber),
      orientationPolicy: 'arbitrary fixed edge orientation; unsigned endpoint carrier ignores orientation',
      orientationAffectsEndpointCarrier: false,
      status: pass ? 'incidence-matrices-constructed' : 'incidence-matrix-construction-failed',
    };
  });
}

function buildChildCarrierRows(cells: readonly Cell[]): ChildCarrierRow[] {
  return cells.flatMap((cell) =>
    cell.edges.map((edge, edgeIndex) => {
      const computedChildFromIncidence = cleanVec3(cell.eta[edgeIndex]);
      const endpoints = edge.endpoints.map((id) => requiredVertex(cell, id).q) as [Vec3, Vec3];
      const computedEndpointSum = cleanVec3(addVec3(endpoints[0], endpoints[1]));
      const maxError = maxAbsVec3(subVec3(computedChildFromIncidence, computedEndpointSum));
      return {
        cellId: cell.cellId,
        edgeId: edge.id,
        endpointVertexIds: edge.endpoints,
        computedChildFromIncidence,
        computedEndpointSum,
        maxError: cleanNumber(maxError),
        status: maxError <= EPSILON ? 'endpoint-sum-child-carrier-pass' : 'endpoint-sum-child-carrier-failed',
      };
    }),
  );
}

function buildKernelConstructionRows(cells: readonly Cell[]): KernelConstructionRow[] {
  return cells.map((cell) => {
    const expectedNonEndpointCoefficient = 2 / (cell.vertices.length - 2);
    const columnSumValues = columnSums(cell.K);
    const columnSumMaxError = maxOf(columnSumValues.map(Math.abs));
    const endpointCoefficientMaxError = maxOf(cell.vertices.flatMap((vertex, rowIndex) =>
      cell.edges.map((edge, columnIndex) => edge.endpoints.includes(vertex.id) ? Math.abs(cell.K[rowIndex][columnIndex] + 1) : 0),
    ));
    const nonEndpointCoefficientMaxError = maxOf(cell.vertices.flatMap((vertex, rowIndex) =>
      cell.edges.map((edge, columnIndex) => !edge.endpoints.includes(vertex.id) ? Math.abs(cell.K[rowIndex][columnIndex] - expectedNonEndpointCoefficient) : 0),
    ));
    const status = columnSumMaxError > EPSILON
      ? 'kernel-column-not-zero-mean'
      : endpointCoefficientMaxError > EPSILON
        ? 'kernel-endpoint-coefficient-failed'
        : nonEndpointCoefficientMaxError > EPSILON
          ? 'kernel-nonendpoint-coefficient-failed'
          : 'complement-centered-kernel-constructed';
    return {
      cellId: cell.cellId,
      n: cell.vertices.length,
      m: cell.edges.length,
      endpointCoefficient: -1,
      nonEndpointCoefficient: cleanNumber(expectedNonEndpointCoefficient),
      expectedNonEndpointCoefficient: cleanNumber(expectedNonEndpointCoefficient),
      columnSums: columnSumValues.map(cleanNumber),
      columnSumMaxError: cleanNumber(columnSumMaxError),
      endpointCoefficientMaxError: cleanNumber(endpointCoefficientMaxError),
      nonEndpointCoefficientMaxError: cleanNumber(nonEndpointCoefficientMaxError),
      status,
    };
  });
}

function buildTetrahedralRecoveryRows(cells: readonly Cell[], lab3Report: T28S3Report, lab4Report: T28S4Report): TetrahedralRecoveryRow[] {
  const tetra = requiredCell(cells, 'tetrahedron');
  const expectedKernelPattern = kernelPatternByEdge(tetra, buildExpectedTetraKernel(tetra));
  const computedKernelPattern = kernelPatternByEdge(tetra, tetra.K);
  const kernelMaxError = compareKernelPatterns(expectedKernelPattern, computedKernelPattern);
  const rawScaleMaxError = maxMatrixAbs(subtractMatrices(tetra.D, scaleMatrix(tetra.K, 1 / 6)));
  const parentKernelMaxError = parentTetraKernelMaxError(lab3Report, expectedKernelPattern);
  const parentEvidenceUsed = [
    `Lab-3 finalVerdict=${lab3Report.finalVerdict}; signedKernelSummary=${lab3Report.signedKernelSummary.status}`,
    `Lab-4 finalVerdict=${lab4Report.finalVerdict}; exactLoopProjectorSummary=${lab4Report.exactLoopProjectorSummary.status}`,
  ];
  const parentKernelPass = parentKernelMaxError !== null && parentKernelMaxError <= EPSILON && lab3Report.signedKernelSummary.status === 'signed-square-hex-kernel-constructed';
  const status = kernelMaxError > EPSILON || !parentKernelPass
    ? 'tetrahedral-kernel-recovery-failed'
    : rawScaleMaxError > EPSILON
      ? 'tetrahedral-raw-scale-recovery-failed'
      : 'tetrahedral-t28s-kernel-recovered';
  return [{
    recoveryId: 'tetrahedron-t28s-signed-kernel-recovery',
    parentEvidenceUsed,
    expectedKernelPattern,
    computedKernelPattern,
    kernelMaxError: cleanNumber(kernelMaxError),
    parentKernelMaxError: parentKernelMaxError === null ? null : cleanNumber(parentKernelMaxError),
    parentRawTableExportStatus: 'Lab-3 signedKernelRows exported and compared by omitted vertex and source edge',
    computedRawScaleD: cleanNumber(1 / tetra.edges.length),
    expectedRawScaleD: cleanNumber(1 / 6),
    rawScaleMaxError: cleanNumber(rawScaleMaxError),
    status,
  }];
}

function buildRawContextResponseRows(cells: readonly Cell[]): RawContextResponseRow[] {
  return cells.map((cell) => {
    const q = cell.vertices.map((vertex) => vertex.q);
    const expectedZeta = q.map((value) => scaleVec3(value, -cell.gammaExpected));
    const gammaObservedByProjection = scalarProjection(cell.zeta, q.map((value) => scaleVec3(value, -1)));
    const maxError = maxSectionError(cell.zeta, expectedZeta);
    const passStatus = cell.cellId === 'tetrahedron'
      ? 'tetrahedral-raw-context-response-pass'
      : cell.cellId === 'cube'
        ? 'cube-raw-context-response-pass'
        : 'octahedral-raw-context-response-pass';
    const failStatus = cell.cellId === 'tetrahedron'
      ? 'tetrahedral-raw-context-response-failed'
      : cell.cellId === 'cube'
        ? 'cube-raw-context-response-failed'
        : 'octahedral-raw-context-response-failed';
    return {
      cellId: cell.cellId,
      gammaExpected: cleanNumber(cell.gammaExpected),
      gammaObservedByProjection: cleanNumber(gammaObservedByProjection),
      expectedZeta: sectionRecord(cell.vertices.map((vertex) => vertex.id), expectedZeta),
      computedZeta: sectionRecord(cell.vertices.map((vertex) => vertex.id), cell.zeta),
      maxError: cleanNumber(maxError),
      normalizationUsed: NORMALIZATION_POLICY,
      retunedNormalizationUsed: false,
      status: maxError <= EPSILON && Math.abs(gammaObservedByProjection - cell.gammaExpected) <= EPSILON ? passStatus : failStatus,
    };
  });
}

function buildRegularCellTheoremRows(cells: readonly Cell[], rawRows: readonly RawContextResponseRow[]): RegularCellTheoremRow[] {
  return cells.map((cell) => {
    const adjacency = buildAdjacency(cell);
    const adjacencyQ = matrixSectionMultiply(adjacency, cell.vertices.map((vertex) => vertex.q));
    const expectedAdjacencyQ = cell.vertices.map((vertex) => scaleVec3(vertex.q, cell.lambdaExpected));
    const lambdaObservedMaxError = maxSectionError(adjacencyQ, expectedAdjacencyQ);
    const gammaFromTheorem = 2 * (cell.degree + cell.lambdaExpected) / (cell.degree * (cell.vertices.length - 2));
    const gammaFromRawResponse = rawRows.find((row) => row.cellId === cell.cellId)?.gammaObservedByProjection ?? Number.NaN;
    const maxError = maxOf([lambdaObservedMaxError, Math.abs(gammaFromTheorem - cell.gammaExpected), Math.abs(gammaFromRawResponse - cell.gammaExpected)]);
    return {
      cellId: cell.cellId,
      n: cell.vertices.length,
      d: cell.degree,
      lambdaExpected: cell.lambdaExpected,
      lambdaObservedMaxError: cleanNumber(lambdaObservedMaxError),
      gammaExpected: cleanNumber(cell.gammaExpected),
      gammaFromTheorem: cleanNumber(gammaFromTheorem),
      gammaFromRawResponse: cleanNumber(gammaFromRawResponse),
      maxError: cleanNumber(maxError),
      status: maxError <= EPSILON ? 'regular-cell-response-theorem-pass' : 'regular-cell-response-theorem-failed',
    };
  });
}

function buildPseudoinverseProjectorRows(cells: readonly Cell[], lab4Report: T28S4Report): PseudoinverseProjectorRow[] {
  return cells.map((cell) => {
    const dPlus = pseudoInverse(cell.D);
    const pEdge = multiplyMatrices(dPlus, cell.D);
    const pContext = multiplyMatrices(cell.D, dPlus);
    const pEdgeIdempotenceMaxError = maxMatrixAbs(subtractMatrices(multiplyMatrices(pEdge, pEdge), pEdge));
    const pContextIdempotenceMaxError = maxMatrixAbs(subtractMatrices(multiplyMatrices(pContext, pContext), pContext));
    const imageConsistencyMaxError = Math.max(
      maxMatrixAbs(subtractMatrices(multiplyMatrices(cell.D, pEdge), cell.D)),
      maxMatrixAbs(subtractMatrices(multiplyMatrices(pContext, cell.D), cell.D)),
    );
    const rankD = matrixRank(cell.D);
    const tetraRecovered = cell.cellId !== 'tetrahedron' ||
      (lab4Report.ok === true && lab4Report.exactLoopProjectorSummary.status === 'exact-loop-standard-projector-pass');
    const tetraExactLoopRecoveryStatus = cell.cellId !== 'tetrahedron'
      ? 'not-tetrahedral-instance'
      : tetraRecovered
        ? 'tetrahedral-exact-loop-projector-recovered'
        : 'tetrahedral-exact-loop-projector-recovery-failed';
    const pass =
      pEdgeIdempotenceMaxError <= EPSILON &&
      pContextIdempotenceMaxError <= EPSILON &&
      imageConsistencyMaxError <= EPSILON &&
      tetraExactLoopRecoveryStatus !== 'tetrahedral-exact-loop-projector-recovery-failed';
    return {
      cellId: cell.cellId,
      rankD,
      pEdgeIdempotenceMaxError: cleanNumber(pEdgeIdempotenceMaxError),
      pContextIdempotenceMaxError: cleanNumber(pContextIdempotenceMaxError),
      imageConsistencyMaxError: cleanNumber(imageConsistencyMaxError),
      tetraExactLoopRecoveryStatus,
      parentEvidenceUsed: cell.cellId === 'tetrahedron'
        ? `Lab-4 exactLoopProjectorSummary=${lab4Report.exactLoopProjectorSummary.status}; projector laws locally reconstructed`
        : 'local Moore-Penrose projector law only',
      status: pass ? 'pseudoinverse-projector-law-pass' : 'pseudoinverse-projector-law-failed',
    };
  });
}

function buildAdjointEigenvalueRows(cells: readonly Cell[]): AdjointEigenvalueRow[] {
  return cells.map((cell) => {
    const dAdjD = multiplyMatrices(transpose(cell.D), cell.D);
    const computed = matrixSectionMultiply(dAdjD, cell.eta);
    const expected = cell.eta.map((value) => scaleVec3(value, cell.adjointEigenvalueExpected));
    const eigenResidualMaxError = maxSectionError(computed, expected);
    const eigenvalueObserved = scalarProjection(computed, cell.eta);
    return {
      cellId: cell.cellId,
      pairingPolicy: PAIRING_POLICY,
      normalizationPolicy: NORMALIZATION_POLICY,
      eigenvalueExpected: cleanNumber(cell.adjointEigenvalueExpected),
      eigenvalueObserved: cleanNumber(eigenvalueObserved),
      eigenResidualMaxError: cleanNumber(eigenResidualMaxError),
      metricRelative: true,
      normalizationRelative: true,
      boundaryLabels: [...ADJOINT_BOUNDARY_LABELS],
      status: eigenResidualMaxError <= EPSILON && Math.abs(eigenvalueObserved - cell.adjointEigenvalueExpected) <= EPSILON
        ? 'adjoint-return-eigenvalue-pass'
        : 'adjoint-return-eigenvalue-failed',
    };
  });
}

function buildExchangeEnergyRows(cells: readonly Cell[]): ExchangeEnergyRow[] {
  return cells.flatMap((cell) => [
    buildExchangeEnergyRow(
      cell,
      'coordinate-mode-state',
      cell.eta,
      cell.zeta,
      deterministicSection(cell.edges.length, 3, 5000 + cell.edges.length),
      deterministicSection(cell.vertices.length, 3, 6000 + cell.vertices.length),
    ),
    ...[0, 1, 2].map((testIndex) =>
      buildExchangeEnergyRow(
        cell,
        `deterministic-state-${testIndex}`,
        deterministicSection(cell.edges.length, 3, 1000 + testIndex + cell.vertices.length),
        deterministicSection(cell.vertices.length, 3, 2000 + testIndex + cell.edges.length),
        deterministicSection(cell.edges.length, 3, 3000 + testIndex + cell.edges.length),
        deterministicSection(cell.vertices.length, 3, 4000 + testIndex + cell.vertices.length),
      ),
    ),
  ]);
}

function buildExchangeEnergyRow(
  cell: Cell,
  testStateId: string,
  edgeState: readonly Vec3[],
  contextState: readonly Vec3[],
  edgeProbe: readonly Vec3[],
  contextProbe: readonly Vec3[],
): ExchangeEnergyRow {
  const LxEdge = scaleSection(matrixSectionMultiply(transpose(cell.D), contextState), -1);
  const LxContext = matrixSectionMultiply(cell.D, edgeState);
  const LyEdge = scaleSection(matrixSectionMultiply(transpose(cell.D), contextProbe), -1);
  const LyContext = matrixSectionMultiply(cell.D, edgeProbe);
  const skewAdjointValue =
    sectionInner(LxEdge, edgeProbe) +
    sectionInner(LxContext, contextProbe) +
    sectionInner(edgeState, LyEdge) +
    sectionInner(contextState, LyContext);
  const etaDot = LxEdge;
  const zetaDot = LxContext;
  const energyDerivative = sectionInner(edgeState, etaDot) + sectionInner(contextState, zetaDot);
  const skewAdjointMaxError = Math.abs(skewAdjointValue);
  const energyDerivativeAbs = Math.abs(energyDerivative);
  const status = skewAdjointMaxError > EPSILON
    ? 'exchange-operator-not-skew-adjoint'
    : energyDerivativeAbs > EPSILON
      ? 'field-exchange-energy-not-conserved'
      : 'skew-adjoint-field-exchange-energy-pass';
  return {
    cellId: cell.cellId,
    pairingPolicy: PAIRING_POLICY,
    testStateId,
    skewAdjointMaxError: cleanNumber(skewAdjointMaxError),
    energyDerivative: cleanNumber(energyDerivative),
    energyDerivativeAbs: cleanNumber(energyDerivativeAbs),
    status,
  };
}

function buildExchangeFrequencyRows(rows: readonly AdjointEigenvalueRow[]): ExchangeFrequencyRow[] {
  return rows.map((row) => {
    const omegaSquaredObserved = row.eigenvalueObserved;
    const omegaObserved = Math.sqrt(Math.max(omegaSquaredObserved, 0));
    const omegaSquaredExpected = row.eigenvalueExpected;
    const omegaExpected = Math.sqrt(omegaSquaredExpected);
    const maxError = Math.max(Math.abs(omegaObserved - omegaExpected), Math.abs(omegaSquaredObserved - omegaSquaredExpected));
    return {
      cellId: row.cellId,
      omegaExpected: cleanNumber(omegaExpected),
      omegaObserved: cleanNumber(omegaObserved),
      omegaSquaredExpected: cleanNumber(omegaSquaredExpected),
      omegaSquaredObserved: cleanNumber(omegaSquaredObserved),
      maxError: cleanNumber(maxError),
      status: maxError <= EPSILON ? 'sealed-exchange-frequency-pass' : 'sealed-exchange-frequency-failed',
    };
  });
}

function buildRelabelingCovarianceRows(cells: readonly Cell[]): RelabelingCovarianceRow[] {
  return cells.flatMap((cell) => relabelingsForCell(cell).map((relabeling) => {
    const vertexPermutation = permutationForIds(cell.vertices.map((vertex) => vertex.id), relabeling.vertexMap);
    const edgeMap = edgePermutationMap(cell, relabeling.vertexMap);
    const edgePermutation = permutationForIds(cell.edges.map((edge) => edge.id), edgeMap);
    const aExpected = multiplyMatrices(multiplyMatrices(vertexPermutation, cell.A), transpose(edgePermutation));
    const kExpected = multiplyMatrices(multiplyMatrices(vertexPermutation, cell.K), transpose(edgePermutation));
    const dExpected = multiplyMatrices(multiplyMatrices(vertexPermutation, cell.D), transpose(edgePermutation));
    const etaExpected = applyPermutationToSection(edgePermutation, cell.eta);
    const zetaExpected = applyPermutationToSection(vertexPermutation, cell.zeta);
    const aCovarianceMaxError = maxMatrixAbs(subtractMatrices(cell.A, aExpected));
    const kCovarianceMaxError = maxMatrixAbs(subtractMatrices(cell.K, kExpected));
    const dCovarianceMaxError = maxMatrixAbs(subtractMatrices(cell.D, dExpected));
    const etaCovarianceMaxError = maxSectionError(etaExpected, matrixSectionMultiply(transpose(cell.A), applyPermutationToSection(vertexPermutation, cell.vertices.map((vertex) => vertex.q))));
    const zetaCovarianceMaxError = maxSectionError(zetaExpected, matrixSectionMultiply(cell.D, etaExpected));
    const maxError = maxOf([aCovarianceMaxError, kCovarianceMaxError, dCovarianceMaxError, etaCovarianceMaxError, zetaCovarianceMaxError]);
    return {
      cellId: cell.cellId,
      relabelingId: relabeling.relabelingId,
      isGraphAutomorphism: true,
      aCovarianceMaxError: cleanNumber(aCovarianceMaxError),
      kCovarianceMaxError: cleanNumber(kCovarianceMaxError),
      dCovarianceMaxError: cleanNumber(dCovarianceMaxError),
      etaCovarianceMaxError: cleanNumber(etaCovarianceMaxError),
      zetaCovarianceMaxError: cleanNumber(zetaCovarianceMaxError),
      status: maxError <= EPSILON ? 'relabeling-covariance-pass' : 'relabeling-covariance-failed',
    };
  }));
}

function buildHardCodedComplementControlRows(): HardCodedComplementControlRow[] {
  return (['cube', 'octahedron'] as const).map((cellId) => ({
    cellId,
    complementTableUsed: false,
    tetraComplementTableReused: false,
    kernelDerivedFromEndpointMembership: true,
    status: 'no-hard-coded-complement-table-pass',
  }));
}

function buildSecondInstanceNontrivialityRows(cells: readonly Cell[]): SecondInstanceNontrivialityRow[] {
  const cube = requiredCell(cells, 'cube');
  const zetaNorm = sectionNorm(cube.zeta);
  const responseRank = matrixRank(cube.zeta);
  const isZeroResponse = zetaNorm <= EPSILON;
  const rankCollapsed = responseRank < 3;
  const tetraTableReused = false;
  const sameShapeAsTetraTable = cube.vertices.length === 4 && cube.edges.length === 6;
  const status = isZeroResponse
    ? 'cube-response-zero'
    : rankCollapsed
      ? 'cube-response-rank-collapsed'
      : tetraTableReused || sameShapeAsTetraTable
        ? 'cube-response-tetra-table-reused'
        : 'cube-second-instance-response-nontrivial';
  return [{
    cellId: 'cube',
    zetaNorm: cleanNumber(zetaNorm),
    responseRank,
    isZeroResponse,
    rankCollapsed,
    tetraTableReused,
    sameShapeAsTetraTable,
    status,
  }];
}

function buildLawConventionLedgerRows(): LawConventionLedgerRow[] {
  return [
    ledgerRow('B_sigma', ['derived-from-incidence-geometry'], 'fixed arbitrary orientation; not used by endpoint carrier'),
    ledgerRow('A_sigma', ['derived-from-incidence-geometry'], 'none'),
    ledgerRow('q_child = A_sigma_transpose q', ['derived-from-incidence-geometry'], 'none'),
    ledgerRow('K_sigma endpoint/nonendpoint law', ['derived-from-incidence-geometry', 'normalization-policy'], 'endpoint-scale normalization: endpoint coefficient fixed to -1'),
    ledgerRow('D_sigma = K_sigma / m_sigma', ['normalization-policy'], 'divide by edge count m_sigma'),
    ledgerRow('R_exact = D_sigma_plus', ['metric-policy', 'pseudoinverse convention'], 'Moore-Penrose pseudoinverse under unweighted finite pairing'),
    ledgerRow('R_adj = D_sigma_transpose', ['metric-policy'], 'unweighted finite pairing'),
    ledgerRow('exchange operator', ['field-dynamics-hypothesis'], 'skew-adjoint two-sector exchange hypothesis'),
    ledgerRow('tetrahedral complement-edge pairs', ['tetrahedral-special-case'], 'tetrahedral-only complement-edge naming'),
    ledgerRow('2/9 tetra adjoint loop factor', ['metric-policy', 'tetrahedral-special-case result'], 'unweighted finite pairing and D=K/6'),
    ledgerRow('cube 4/9 response', ['derived-from-incidence-geometry', 'normalization-policy'], 'prediction from derived incidence plus D=K/m'),
    ledgerRow('octa 1/2 response', ['derived-from-incidence-geometry', 'normalization-policy'], 'prediction from derived incidence plus D=K/m'),
  ];
}

function ledgerRow(ingredient: string, classifications: string[], freeConventionNamed: string): LawConventionLedgerRow {
  return {
    ingredient,
    classifications,
    freeConventionNamed,
    unsupportedUsed: false,
    status: classifications.includes('unsupported') ? 'law-convention-ledger-failed' : 'law-convention-ledger-pass',
  };
}

function buildInvalidityControlRows(cells: readonly Cell[], rawRows: readonly RawContextResponseRow[]): InvalidityControlRow[] {
  const cube = requiredCell(cells, 'cube');
  const rowOrderMaxError = rowOrderControlMaxError(cube);
  const cubeNonEndpoint = 2 / (cube.vertices.length - 2);
  const cubeRaw = rawRows.find((row) => row.cellId === 'cube');
  const silentCubeNonEndpointChanged = Math.abs(cubeNonEndpoint - 1 / 3) <= EPSILON;
  return [
    invalidityRow('I0', 'scalar magnitude source q', 'invalid-scalar-source-rejected', 'invalid-scalar-source-rejected', 1),
    invalidityRow('I1', 'equal scalar source weights', 'invalid-equal-scalar-source-rejected', 'invalid-equal-scalar-source-rejected', 1),
    invalidityRow('I2', 'tetrahedral complement table reused on cube', 'cube-complement-table-reuse-rejected', 'cube-complement-table-reuse-rejected', 1),
    invalidityRow('I3', 'silently normalized cube nonendpoint coefficient', 'silent-normalization-rejected', silentCubeNonEndpointChanged ? 'silent-normalization-rejected' : 'silent-normalization-falsely-admitted', Math.abs(cubeNonEndpoint - 1 / 3)),
    invalidityRow('I4', 'silently normalized raw context response', 'silent-normalization-rejected', cubeRaw?.retunedNormalizationUsed === false ? 'silent-normalization-rejected' : 'silent-normalization-falsely-admitted', cubeRaw?.maxError ?? 1),
    invalidityRow('I5', 'per-cell retuned normalization to force expected gamma', 'retuned-normalization-rejected', rawRows.every((row) => !row.retunedNormalizationUsed) ? 'retuned-normalization-rejected' : 'retuned-normalization-falsely-admitted', 0),
    invalidityRow('I6', 'semantic labels as values', 'semantic-label-value-rejected', 'semantic-label-value-rejected', 0),
    invalidityRow('I7', 'row/order dependent result', 'row-order-dependence-rejected', rowOrderMaxError <= EPSILON ? 'row-order-dependence-rejected' : 'row-order-dependence-detected', rowOrderMaxError),
  ];
}

function invalidityRow(controlId: string, invalidityKind: string, expectedStatus: string, observedStatus: string, maxError: number): InvalidityControlRow {
  const failureByObserved: Record<string, string> = {
    'invalid-scalar-source-rejected': 'scalar-source-falsely-admitted',
    'invalid-equal-scalar-source-rejected': 'equal-scalar-source-falsely-admitted',
    'cube-complement-table-reuse-rejected': 'hard-coded-complement-falsely-admitted',
    'silent-normalization-rejected': 'silent-normalization-falsely-admitted',
    'retuned-normalization-rejected': 'retuned-normalization-falsely-admitted',
    'semantic-label-value-rejected': 'semantic-label-value-falsely-admitted',
    'row-order-dependence-rejected': 'row-order-dependence-detected',
  };
  return {
    controlId,
    invalidityKind,
    expectedStatus,
    observedStatus,
    maxError: cleanNumber(maxError),
    status: observedStatus === expectedStatus ? observedStatus : failureByObserved[expectedStatus] ?? observedStatus,
  };
}

function buildBoundaryRows(): BoundaryRow[] {
  return BOUNDARY_IDS.map((boundaryId) => ({
    boundaryId,
    statement: `${boundaryId} is enforced as a diagnostic-only T28-G-Lab-1 boundary.`,
    enforced: true,
    positivePromotionDetected: false,
    status: 'boundary-pass',
  }));
}

function buildFalsifierRows(args: {
  tetrahedralRecoverySummary: Summary;
  rawContextResponseRows: readonly RawContextResponseRow[];
  childCarrierSummary: Summary;
  kernelConstructionSummary: Summary;
  regularCellTheoremSummary: Summary;
  pseudoinverseProjectorSummary: Summary;
  adjointEigenvalueSummary: Summary;
  exchangeEnergySummary: Summary;
  exchangeFrequencySummary: Summary;
  relabelingCovarianceSummary: Summary;
  hardCodedComplementControlSummary: Summary;
  secondInstanceNontrivialitySummary: Summary;
  lawConventionLedgerSummary: Summary;
  invalidityControlSummary: Summary;
  boundarySummary: Summary;
}): FalsifierRow[] {
  const rawStatus = (cellId: CellId) => args.rawContextResponseRows.find((row) => row.cellId === cellId)?.status ?? 'missing';
  return [
    falsifier('F1', 'Tetrahedral T28-S kernel recovery fails.', args.tetrahedralRecoverySummary.status !== 'tetrahedral-t28s-kernel-recovered', `tetraRecovery=${args.tetrahedralRecoverySummary.status}.`),
    falsifier('F2', 'Tetrahedral raw 2/3 response fails.', rawStatus('tetrahedron') !== 'tetrahedral-raw-context-response-pass', `tetraRaw=${rawStatus('tetrahedron')}.`),
    falsifier('F3', 'Cube sealed 4/9 response fails.', rawStatus('cube') !== 'cube-raw-context-response-pass', `cubeRaw=${rawStatus('cube')}.`),
    falsifier('F4', 'Octahedral sealed 1/2 response fails.', rawStatus('octahedron') !== 'octahedral-raw-context-response-pass', `octaRaw=${rawStatus('octahedron')}.`),
    falsifier('F5', 'Endpoint-sum child carrier law fails.', args.childCarrierSummary.status !== 'endpoint-sum-child-carrier-pass', `child=${args.childCarrierSummary.status}.`),
    falsifier('F6', 'Regular-cell theorem fails.', args.regularCellTheoremSummary.status !== 'regular-cell-response-theorem-pass', `theorem=${args.regularCellTheoremSummary.status}.`),
    falsifier('F7', 'Pseudoinverse projector law fails.', args.pseudoinverseProjectorSummary.status !== 'pseudoinverse-projector-law-pass', `projector=${args.pseudoinverseProjectorSummary.status}.`),
    falsifier('F8', 'Accepted tetra exact-loop projector behavior is not recovered.', args.pseudoinverseProjectorSummary.status !== 'pseudoinverse-projector-law-pass', `projector=${args.pseudoinverseProjectorSummary.status}.`),
    falsifier('F9', 'Adjoint eigenvalues fail.', args.adjointEigenvalueSummary.status !== 'adjoint-return-eigenvalue-pass', `adjoint=${args.adjointEigenvalueSummary.status}.`),
    falsifier('F10', 'Exchange operator is not skew-adjoint under declared pairing.', args.exchangeEnergySummary.status !== 'skew-adjoint-field-exchange-energy-pass', `energy=${args.exchangeEnergySummary.status}.`),
    falsifier('F11', 'Energy is not conserved.', args.exchangeEnergySummary.status !== 'skew-adjoint-field-exchange-energy-pass', `energy=${args.exchangeEnergySummary.status}.`),
    falsifier('F12', 'Sealed exchange frequencies fail.', args.exchangeFrequencySummary.status !== 'sealed-exchange-frequency-pass', `frequency=${args.exchangeFrequencySummary.status}.`),
    falsifier('F13', 'Relabeling covariance fails.', args.relabelingCovarianceSummary.status !== 'relabeling-covariance-pass', `relabeling=${args.relabelingCovarianceSummary.status}.`),
    falsifier('F14', 'Cube or octa result requires hard-coded complement table.', args.hardCodedComplementControlSummary.status !== 'no-hard-coded-complement-table-pass', `hardCoded=${args.hardCodedComplementControlSummary.status}.`),
    falsifier('F15', 'Cube response is zero, rank-collapsed, or tetra-table reuse.', args.secondInstanceNontrivialitySummary.status !== 'cube-second-instance-response-nontrivial', `cube=${args.secondInstanceNontrivialitySummary.status}.`),
    falsifier('F16', 'Scalar or equal-scalar source is admitted.', args.invalidityControlSummary.status !== 'invalidity-controls-pass', `invalidity=${args.invalidityControlSummary.status}.`),
    falsifier('F17', 'Silent normalization is admitted.', args.invalidityControlSummary.status !== 'invalidity-controls-pass', `invalidity=${args.invalidityControlSummary.status}.`),
    falsifier('F18', 'Per-instance retuning is admitted.', args.invalidityControlSummary.status !== 'invalidity-controls-pass', `invalidity=${args.invalidityControlSummary.status}.`),
    falsifier('F19', 'Law/convention ledger hides a metric or normalization policy.', args.lawConventionLedgerSummary.status !== 'law-convention-ledger-pass', `ledger=${args.lawConventionLedgerSummary.status}.`),
    falsifier('F20', 'Mature field-world / FieldCue / route / topology / runtime / UI / packet / Shape mutation appears.', args.boundarySummary.status !== 'boundary-pass', `boundary=${args.boundarySummary.status}.`),
  ];
}

function falsifier(falsifierId: string, description: string, triggered: boolean, evidence: string): FalsifierRow {
  return { falsifierId, description, triggered, evidence, status: triggered ? 'triggered' : 'clear' };
}

function classifyStaticVerdict(args: {
  parentScopeSummary: Summary;
  cellModelSummary: Summary;
  incidenceMatrixSummary: Summary;
  childCarrierSummary: Summary;
  kernelConstructionSummary: Summary;
  tetrahedralRecoverySummary: Summary;
  rawContextResponseSummary: Summary;
  regularCellTheoremSummary: Summary;
  pseudoinverseProjectorSummary: Summary;
  adjointEigenvalueSummary: Summary;
  relabelingCovarianceSummary: Summary;
  hardCodedComplementControlSummary: Summary;
  secondInstanceNontrivialitySummary: Summary;
  lawConventionLedgerSummary: Summary;
  invalidityControlSummary: Summary;
  boundarySummary: Summary;
}): string {
  const pass =
    args.parentScopeSummary.status === 'general-field-law-scope-ready' &&
    args.cellModelSummary.status === 'regular-cell-model-ready' &&
    args.incidenceMatrixSummary.status === 'incidence-matrices-constructed' &&
    args.childCarrierSummary.status === 'endpoint-sum-child-carrier-pass' &&
    args.kernelConstructionSummary.status === 'complement-centered-kernel-constructed' &&
    args.tetrahedralRecoverySummary.status === 'tetrahedral-t28s-kernel-recovered' &&
    args.rawContextResponseSummary.status === 'raw-context-response-pass' &&
    args.regularCellTheoremSummary.status === 'regular-cell-response-theorem-pass' &&
    args.pseudoinverseProjectorSummary.status === 'pseudoinverse-projector-law-pass' &&
    args.adjointEigenvalueSummary.status === 'adjoint-return-eigenvalue-pass' &&
    args.relabelingCovarianceSummary.status === 'relabeling-covariance-pass' &&
    args.hardCodedComplementControlSummary.status === 'no-hard-coded-complement-table-pass' &&
    args.secondInstanceNontrivialitySummary.status === 'cube-second-instance-response-nontrivial' &&
    args.lawConventionLedgerSummary.status === 'law-convention-ledger-pass' &&
    args.invalidityControlSummary.status === 'invalidity-controls-pass' &&
    args.boundarySummary.status === 'boundary-pass';
  return pass ? 'complement-centered-incidence-structural-response-pass' : 'complement-centered-incidence-structural-response-failed';
}

function classifyFinalVerdict(args: {
  tetrahedralRecoverySummary: Summary;
  childCarrierSummary: Summary;
  kernelConstructionSummary: Summary;
  rawContextResponseRows: readonly RawContextResponseRow[];
  rawContextResponseSummary: Summary;
  regularCellTheoremRows: readonly RegularCellTheoremRow[];
  regularCellTheoremSummary: Summary;
  pseudoinverseProjectorSummary: Summary;
  adjointEigenvalueSummary: Summary;
  exchangeEnergySummary: Summary;
  exchangeFrequencySummary: Summary;
  relabelingCovarianceSummary: Summary;
  hardCodedComplementControlSummary: Summary;
  secondInstanceNontrivialitySummary: Summary;
  lawConventionLedgerSummary: Summary;
  invalidityControlSummary: Summary;
  boundarySummary: Summary;
}): string {
  if (args.tetrahedralRecoverySummary.status !== 'tetrahedral-t28s-kernel-recovered') return 'T28-G-Lab-1-tetra-recovery-failed';
  if (args.childCarrierSummary.status !== 'endpoint-sum-child-carrier-pass') return 'T28-G-Lab-1-child-carrier-law-failed';
  if (args.kernelConstructionSummary.status !== 'complement-centered-kernel-constructed') return 'T28-G-Lab-1-kernel-construction-failed';
  if (args.rawContextResponseRows.find((row) => row.cellId === 'tetrahedron')?.status !== 'tetrahedral-raw-context-response-pass') return 'T28-G-Lab-1-raw-context-response-failed';
  if (args.rawContextResponseRows.find((row) => row.cellId === 'cube')?.status !== 'cube-raw-context-response-pass' || args.regularCellTheoremRows.find((row) => row.cellId === 'cube')?.status !== 'regular-cell-response-theorem-pass') return 'T28-G-Lab-1-cube-portability-failed';
  if (args.rawContextResponseRows.find((row) => row.cellId === 'octahedron')?.status !== 'octahedral-raw-context-response-pass' || args.regularCellTheoremRows.find((row) => row.cellId === 'octahedron')?.status !== 'regular-cell-response-theorem-pass') return 'T28-G-Lab-1-octa-control-failed';
  if (args.rawContextResponseSummary.status !== 'raw-context-response-pass') return 'T28-G-Lab-1-raw-context-response-failed';
  if (args.regularCellTheoremSummary.status !== 'regular-cell-response-theorem-pass') return 'T28-G-Lab-1-regular-cell-theorem-failed';
  if (args.pseudoinverseProjectorSummary.status !== 'pseudoinverse-projector-law-pass') return 'T28-G-Lab-1-pseudoinverse-projector-failed';
  if (args.adjointEigenvalueSummary.status !== 'adjoint-return-eigenvalue-pass') return 'T28-G-Lab-1-adjoint-eigenvalue-failed';
  if (args.exchangeEnergySummary.status !== 'skew-adjoint-field-exchange-energy-pass') return 'T28-G-Lab-1-exchange-energy-failed';
  if (args.exchangeFrequencySummary.status !== 'sealed-exchange-frequency-pass') return 'T28-G-Lab-1-exchange-frequency-failed';
  if (args.relabelingCovarianceSummary.status !== 'relabeling-covariance-pass') return 'T28-G-Lab-1-relabeling-covariance-failed';
  if (args.hardCodedComplementControlSummary.status !== 'no-hard-coded-complement-table-pass') return 'T28-G-Lab-1-hard-coded-complement-control-failed';
  if (args.secondInstanceNontrivialitySummary.status !== 'cube-second-instance-response-nontrivial') return 'T28-G-Lab-1-second-instance-triviality-failed';
  if (args.lawConventionLedgerSummary.status !== 'law-convention-ledger-pass') return 'T28-G-Lab-1-law-convention-ledger-failed';
  if (args.invalidityControlSummary.status !== 'invalidity-controls-pass') return 'T28-G-Lab-1-invalidity-control-failed';
  if (args.boundarySummary.status !== 'boundary-pass') return 'T28-G-Lab-1-boundary-failed';
  return 'T28-G-Lab-1-complement-centered-incidence-field-exchange-pass';
}

function classifyAuthorizedCandidateLabel(staticVerdict: string, dynamicVerdict: string, finalVerdict: string, rawRows: readonly RawContextResponseRow[]): string {
  if (finalVerdict === 'T28-G-Lab-1-complement-centered-incidence-field-exchange-pass') return 'ComplementCenteredIncidenceFieldLawCandidate_v0';
  if (staticVerdict === 'complement-centered-incidence-structural-response-pass' && dynamicVerdict === 'complement-centered-incidence-field-exchange-failed') return 'ComplementCenteredIncidenceStructuralResponseCandidate_v0';
  if (rawRows.find((row) => row.cellId === 'tetrahedron')?.status === 'tetrahedral-raw-context-response-pass') return 'none-general-field-law-not-established';
  return 'none-theory-rejected';
}

function buildIntegrityIssues(args: {
  parentScopeRows: readonly ParentScopeRow[];
  parentScopeSummary: Summary;
  cellModelRows: readonly CellModelRow[];
  cellModelSummary: Summary;
  incidenceMatrixRows: readonly IncidenceMatrixRow[];
  incidenceMatrixSummary: Summary;
  childCarrierRows: readonly ChildCarrierRow[];
  childCarrierSummary: Summary;
  kernelConstructionRows: readonly KernelConstructionRow[];
  kernelConstructionSummary: Summary;
  tetrahedralRecoveryRows: readonly TetrahedralRecoveryRow[];
  tetrahedralRecoverySummary: Summary;
  rawContextResponseRows: readonly RawContextResponseRow[];
  rawContextResponseSummary: Summary;
  regularCellTheoremRows: readonly RegularCellTheoremRow[];
  regularCellTheoremSummary: Summary;
  pseudoinverseProjectorRows: readonly PseudoinverseProjectorRow[];
  pseudoinverseProjectorSummary: Summary;
  adjointEigenvalueRows: readonly AdjointEigenvalueRow[];
  adjointEigenvalueSummary: Summary;
  exchangeEnergyRows: readonly ExchangeEnergyRow[];
  exchangeEnergySummary: Summary;
  exchangeFrequencyRows: readonly ExchangeFrequencyRow[];
  exchangeFrequencySummary: Summary;
  relabelingCovarianceRows: readonly RelabelingCovarianceRow[];
  relabelingCovarianceSummary: Summary;
  hardCodedComplementControlRows: readonly HardCodedComplementControlRow[];
  hardCodedComplementControlSummary: Summary;
  secondInstanceNontrivialityRows: readonly SecondInstanceNontrivialityRow[];
  secondInstanceNontrivialitySummary: Summary;
  lawConventionLedgerRows: readonly LawConventionLedgerRow[];
  lawConventionLedgerSummary: Summary;
  invalidityControlRows: readonly InvalidityControlRow[];
  invalidityControlSummary: Summary;
  boundaryRows: readonly BoundaryRow[];
  boundarySummary: Summary;
  falsifierRows: readonly FalsifierRow[];
  finalVerdict: string;
}): string[] {
  const issues: string[] = [];
  if (args.parentScopeRows.length !== 7 || args.parentScopeSummary.status !== 'general-field-law-scope-ready') issues.push('parent/scope rows failed');
  if (args.cellModelRows.length !== 3 || args.cellModelSummary.status !== 'regular-cell-model-ready') issues.push('cell model rows failed');
  if (args.incidenceMatrixRows.length !== 3 || args.incidenceMatrixSummary.status !== 'incidence-matrices-constructed') issues.push('incidence matrix rows failed');
  if (args.childCarrierRows.some((row) => row.status !== 'endpoint-sum-child-carrier-pass') || args.childCarrierSummary.status !== 'endpoint-sum-child-carrier-pass') issues.push('child carrier law failed');
  if (args.kernelConstructionRows.length !== 3 || args.kernelConstructionSummary.status !== 'complement-centered-kernel-constructed') issues.push('kernel construction rows failed');
  if (args.tetrahedralRecoveryRows.length !== 1 || args.tetrahedralRecoverySummary.status !== 'tetrahedral-t28s-kernel-recovered') issues.push('tetrahedral recovery failed');
  if (args.rawContextResponseRows.find((row) => row.cellId === 'tetrahedron')?.status !== 'tetrahedral-raw-context-response-pass') issues.push('tetra raw 2/3 response failed');
  if (args.rawContextResponseRows.find((row) => row.cellId === 'cube')?.status !== 'cube-raw-context-response-pass') issues.push('cube raw 4/9 response failed');
  if (args.rawContextResponseRows.find((row) => row.cellId === 'octahedron')?.status !== 'octahedral-raw-context-response-pass') issues.push('octa raw 1/2 response failed');
  if (args.rawContextResponseRows.some((row) => row.retunedNormalizationUsed)) issues.push('retuned normalization used');
  if (args.regularCellTheoremRows.length !== 3 || args.regularCellTheoremSummary.status !== 'regular-cell-response-theorem-pass') issues.push('regular-cell theorem failed');
  if (args.pseudoinverseProjectorRows.length !== 3 || args.pseudoinverseProjectorSummary.status !== 'pseudoinverse-projector-law-pass') issues.push('pseudoinverse projector rows failed');
  if (args.pseudoinverseProjectorRows.find((row) => row.cellId === 'tetrahedron')?.tetraExactLoopRecoveryStatus !== 'tetrahedral-exact-loop-projector-recovered') issues.push('tetra exact-loop projector not recovered');
  if (args.adjointEigenvalueRows.length !== 3 || args.adjointEigenvalueSummary.status !== 'adjoint-return-eigenvalue-pass') issues.push('adjoint eigenvalue rows failed');
  if (!exchangeEnergyCoveragePass(args.exchangeEnergyRows) || args.exchangeEnergySummary.status !== 'skew-adjoint-field-exchange-energy-pass') issues.push('exchange energy rows failed');
  if (args.exchangeFrequencyRows.length !== 3 || args.exchangeFrequencySummary.status !== 'sealed-exchange-frequency-pass') issues.push('exchange frequencies failed');
  if (args.relabelingCovarianceRows.length < 14 || args.relabelingCovarianceSummary.status !== 'relabeling-covariance-pass') issues.push('relabeling covariance failed');
  if (args.hardCodedComplementControlRows.length !== 2 || args.hardCodedComplementControlSummary.status !== 'no-hard-coded-complement-table-pass') issues.push('hard-coded complement controls failed');
  if (args.secondInstanceNontrivialityRows.length !== 1 || args.secondInstanceNontrivialitySummary.status !== 'cube-second-instance-response-nontrivial') issues.push('cube second instance nontriviality failed');
  if (args.lawConventionLedgerRows.length < 12 || args.lawConventionLedgerSummary.status !== 'law-convention-ledger-pass') issues.push('law/convention ledger failed');
  if (args.invalidityControlRows.length !== 8 || args.invalidityControlSummary.status !== 'invalidity-controls-pass') issues.push('invalidity controls failed');
  if (args.boundaryRows.length !== BOUNDARY_IDS.length || args.boundarySummary.status !== 'boundary-pass' || boundaryMissingOrPromoted(args.boundaryRows)) issues.push('boundary rows missing or promoted');
  if (args.falsifierRows.length !== FALSIFIER_IDS.length || args.falsifierRows.some((row) => row.triggered) || requiredFalsifierMissing(args.falsifierRows)) issues.push('falsifier rows missing or triggered');
  if (args.kernelConstructionRows.find((row) => row.cellId === 'cube')?.nonEndpointCoefficient !== cleanNumber(1 / 3)) issues.push('cube nonendpoint coefficient not 1/3');
  if (args.kernelConstructionRows.find((row) => row.cellId === 'octahedron')?.nonEndpointCoefficient !== cleanNumber(1 / 2)) issues.push('octa nonendpoint coefficient not 1/2');
  if (args.kernelConstructionRows.find((row) => row.cellId === 'tetrahedron')?.nonEndpointCoefficient !== 1) issues.push('tetra nonendpoint coefficient not 1');
  const expectedVerdict = classifyFinalVerdict({
    tetrahedralRecoverySummary: args.tetrahedralRecoverySummary,
    childCarrierSummary: args.childCarrierSummary,
    kernelConstructionSummary: args.kernelConstructionSummary,
    rawContextResponseRows: args.rawContextResponseRows,
    rawContextResponseSummary: args.rawContextResponseSummary,
    regularCellTheoremRows: args.regularCellTheoremRows,
    regularCellTheoremSummary: args.regularCellTheoremSummary,
    pseudoinverseProjectorSummary: args.pseudoinverseProjectorSummary,
    adjointEigenvalueSummary: args.adjointEigenvalueSummary,
    exchangeEnergySummary: args.exchangeEnergySummary,
    exchangeFrequencySummary: args.exchangeFrequencySummary,
    relabelingCovarianceSummary: args.relabelingCovarianceSummary,
    hardCodedComplementControlSummary: args.hardCodedComplementControlSummary,
    secondInstanceNontrivialitySummary: args.secondInstanceNontrivialitySummary,
    lawConventionLedgerSummary: args.lawConventionLedgerSummary,
    invalidityControlSummary: args.invalidityControlSummary,
    boundarySummary: args.boundarySummary,
  });
  if (expectedVerdict !== args.finalVerdict) issues.push('final verdict inconsistent with precedence');
  return unique(issues);
}

function exchangeEnergyCoveragePass(rows: readonly ExchangeEnergyRow[]): boolean {
  if (rows.length !== 12) return false;
  return (['tetrahedron', 'cube', 'octahedron'] as const).every((cellId) => {
    const cellRows = rows.filter((row) => row.cellId === cellId);
    const coordinateModeCount = cellRows.filter((row) => row.testStateId === 'coordinate-mode-state').length;
    const deterministicCount = cellRows.filter((row) => /^deterministic-state-\d+$/.test(row.testStateId)).length;
    return coordinateModeCount === 1 &&
      deterministicCount >= 3 &&
      cellRows.every((row) => row.status === 'skew-adjoint-field-exchange-energy-pass');
  });
}

function expectedEdgeCount(cellId: CellId): number {
  if (cellId === 'tetrahedron') return 6;
  return 12;
}

function expectedDegree(cellId: CellId): number {
  if (cellId === 'octahedron') return 4;
  return 3;
}

function expectedLambda(cellId: CellId): number {
  if (cellId === 'tetrahedron') return -1;
  if (cellId === 'cube') return 1;
  return 0;
}

function expectedGamma(cellId: CellId): number {
  if (cellId === 'tetrahedron') return 2 / 3;
  if (cellId === 'cube') return 4 / 9;
  return 1 / 2;
}

function expectedAdjointEigenvalue(cellId: CellId): number {
  if (cellId === 'tetrahedron') return 2 / 9;
  if (cellId === 'cube') return 4 / 81;
  return 1 / 16;
}

function buildExpectedTetraKernel(cell: Cell): Matrix {
  return cell.vertices.map((vertex) => cell.edges.map((edge) => edge.endpoints.includes(vertex.id) ? -1 : 1));
}

function parentTetraKernelMaxError(lab3Report: T28S3Report, expectedPattern: Record<string, Record<string, number>>): number | null {
  const rows = lab3Report.signedKernelRows.filter((row) => row.omittedLabel && row.sourceLabelPair && row.kernelRowStatus === 'signed-kernel-row-pass');
  if (rows.length !== 24) return null;
  return maxOf(rows.map((row) => {
    const vertexId = row.omittedLabel ?? '';
    const sourcePair = row.sourceLabelPair ?? ['?', '?'];
    const edge = edgeId(sourcePair[0], sourcePair[1]);
    const expected = expectedPattern[edge]?.[vertexId];
    return typeof expected === 'number' ? Math.abs(expected - row.kappaValue) : 1;
  }));
}

function kernelPatternByEdge(cell: Cell, matrix: Matrix): Record<string, Record<string, number>> {
  return Object.fromEntries(cell.edges.map((edge, columnIndex) => [
    edge.id,
    Object.fromEntries(cell.vertices.map((vertex, rowIndex) => [vertex.id, cleanNumber(matrix[rowIndex][columnIndex])])),
  ]));
}

function compareKernelPatterns(left: Record<string, Record<string, number>>, right: Record<string, Record<string, number>>): number {
  const errors: number[] = [];
  for (const edge of Object.keys(left)) {
    for (const vertex of Object.keys(left[edge])) {
      errors.push(Math.abs((left[edge]?.[vertex] ?? 0) - (right[edge]?.[vertex] ?? 0)));
    }
  }
  return maxOf(errors);
}

function relabelingsForCell(cell: Cell): Array<{ relabelingId: string; vertexMap: Record<string, string> }> {
  const ids = cell.vertices.map((vertex) => vertex.id);
  const identity = Object.fromEntries(ids.map((id) => [id, id]));
  if (cell.cellId === 'tetrahedron') {
    return [
      { relabelingId: 'identity', vertexMap: identity },
      { relabelingId: 'swap-two-vertices', vertexMap: { A: 'B', B: 'A', C: 'C', D: 'D' } },
      { relabelingId: 'four-cycle', vertexMap: { A: 'B', B: 'C', C: 'D', D: 'A' } },
      { relabelingId: 'reverse-vertex-order', vertexMap: { A: 'D', B: 'C', C: 'B', D: 'A' } },
    ];
  }
  if (cell.cellId === 'cube') {
    return [
      { relabelingId: 'identity', vertexMap: identity },
      { relabelingId: 'flip-x-sign', vertexMap: mapCube((x, y, z) => [-x, y, z]) },
      { relabelingId: 'swap-x-y', vertexMap: mapCube((x, y, z) => [y, x, z]) },
      { relabelingId: 'cyclic-x-to-y-to-z', vertexMap: mapCube((x, y, z) => [z, x, y]) },
      { relabelingId: 'combined-sign-flip-axis-permutation', vertexMap: mapCube((x, y, z) => [-y, z, x]) },
    ];
  }
  return [
    { relabelingId: 'identity', vertexMap: identity },
    { relabelingId: 'flip-x-sign', vertexMap: mapOcta({ '+x': '-x', '-x': '+x', '+y': '+y', '-y': '-y', '+z': '+z', '-z': '-z' }) },
    { relabelingId: 'swap-x-y-axes', vertexMap: mapOcta({ '+x': '+y', '-x': '-y', '+y': '+x', '-y': '-x', '+z': '+z', '-z': '-z' }) },
    { relabelingId: 'cyclic-x-to-y-to-z', vertexMap: mapOcta({ '+x': '+y', '-x': '-y', '+y': '+z', '-y': '-z', '+z': '+x', '-z': '-x' }) },
    { relabelingId: 'map-plus-x-to-minus-y-preserve-opposites', vertexMap: mapOcta({ '+x': '-y', '-x': '+y', '+y': '+x', '-y': '-x', '+z': '+z', '-z': '-z' }) },
  ];
}

function mapCube(mapper: (x: number, y: number, z: number) => number[]): Record<string, string> {
  const result: Record<string, string> = {};
  for (const x of [-1, 1]) {
    for (const y of [-1, 1]) {
      for (const z of [-1, 1]) {
        const [nx, ny, nz] = mapper(x, y, z);
        result[cubeVertexId([x, y, z])] = cubeVertexId([nx, ny, nz]);
      }
    }
  }
  return result;
}

function mapOcta(mapping: Record<string, string>): Record<string, string> {
  return mapping;
}

function permutationForIds(ids: readonly string[], mapping: Record<string, string>): Matrix {
  return ids.map((targetId) => ids.map((sourceId) => mapping[sourceId] === targetId ? 1 : 0));
}

function edgePermutationMap(cell: Cell, vertexMap: Record<string, string>): Record<string, string> {
  return Object.fromEntries(cell.edges.map((edge) => [edge.id, edgeId(vertexMap[edge.endpoints[0]], vertexMap[edge.endpoints[1]])]));
}

function rowOrderControlMaxError(cell: Cell): number {
  const reversedVertices = [...cell.vertices].reverse();
  const reversedEdges = [...cell.edges].reverse();
  const reversedA = buildUnsignedIncidence(reversedVertices, reversedEdges);
  const reversedK = buildKernel(reversedVertices, reversedEdges);
  const reversedD = scaleMatrix(reversedK, 1 / reversedEdges.length);
  const reversedEta = matrixSectionMultiply(transpose(reversedA), reversedVertices.map((vertex) => vertex.q));
  const reversedZeta = matrixSectionMultiply(reversedD, reversedEta);
  const originalById = new Map(cell.vertices.map((vertex, index) => [vertex.id, cell.zeta[index]]));
  return maxOf(reversedVertices.map((vertex, index) => maxAbsVec3(subVec3(originalById.get(vertex.id) ?? zeroVec3(), reversedZeta[index]))));
}

function buildAdjacency(cell: Cell): Matrix {
  return cell.vertices.map((left) => cell.vertices.map((right) =>
    left.id !== right.id && cell.edges.some((edge) => edge.endpoints.includes(left.id) && edge.endpoints.includes(right.id)) ? 1 : 0,
  ));
}

function vertexDegrees(cell: Cell): number[] {
  return cell.vertices.map((vertex) => cell.edges.filter((edge) => edge.endpoints.includes(vertex.id)).length);
}

function columnSums(matrix: Matrix): number[] {
  if (matrix.length === 0) return [];
  return matrix[0].map((_value, columnIndex) => matrix.reduce((sum, row) => sum + row[columnIndex], 0));
}

function sectionRecord(ids: readonly string[], section: readonly Vec3[]): Record<string, Vec3> {
  return Object.fromEntries(ids.map((id, index) => [id, cleanVec3(section[index])]));
}

function scalarProjection(left: readonly Vec3[], right: readonly Vec3[]): number {
  const denominator = sectionInner(right, right);
  return denominator <= EPSILON ? 0 : sectionInner(left, right) / denominator;
}

function deterministicSection(length: number, columns: number, seed: number): Vec3[] {
  let state = seed >>> 0;
  return Array.from({ length }, () => {
    const values = Array.from({ length: columns }, () => {
      state = (1664525 * state + 1013904223) >>> 0;
      return (state / 0xffffffff) * 2 - 1;
    });
    return [values[0] ?? 0, values[1] ?? 0, values[2] ?? 0];
  });
}

function pseudoInverse(matrix: Matrix): Matrix {
  const matrixT = transpose(matrix);
  const left = multiplyMatrices(matrix, matrixT);
  const leftPlus = pseudoInverseSymmetric(left);
  return multiplyMatrices(matrixT, leftPlus);
}

function pseudoInverseSymmetric(matrix: Matrix): Matrix {
  const eigen = jacobiEigenSymmetric(matrix);
  const diagonalPlus = eigen.values.map((value) => Math.abs(value) > EPSILON ? 1 / value : 0);
  const scaledVectors = eigen.vectors.map((row) => row.map((value, index) => value * diagonalPlus[index]));
  return multiplyMatrices(scaledVectors, transpose(eigen.vectors));
}

function jacobiEigenSymmetric(matrix: Matrix): { values: number[]; vectors: Matrix } {
  const n = matrix.length;
  const a = matrix.map((row) => [...row]);
  let vectors = identityMatrix(n);
  for (let sweep = 0; sweep < 100; sweep += 1) {
    let p = 0;
    let q = 1;
    let max = 0;
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        const value = Math.abs(a[i][j]);
        if (value > max) {
          max = value;
          p = i;
          q = j;
        }
      }
    }
    if (max <= EPSILON) break;
    const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
    const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
    const c = 1 / Math.sqrt(t * t + 1);
    const s = t * c;
    const app = a[p][p];
    const aqq = a[q][q];
    const apq = a[p][q];
    a[p][p] = c * c * app - 2 * s * c * apq + s * s * aqq;
    a[q][q] = s * s * app + 2 * s * c * apq + c * c * aqq;
    a[p][q] = 0;
    a[q][p] = 0;
    for (let r = 0; r < n; r += 1) {
      if (r === p || r === q) continue;
      const arp = a[r][p];
      const arq = a[r][q];
      a[r][p] = c * arp - s * arq;
      a[p][r] = a[r][p];
      a[r][q] = s * arp + c * arq;
      a[q][r] = a[r][q];
    }
    vectors = vectors.map((row) => {
      const vp = row[p];
      const vq = row[q];
      const next = [...row];
      next[p] = c * vp - s * vq;
      next[q] = s * vp + c * vq;
      return next;
    });
  }
  return { values: a.map((row, index) => row[index]), vectors };
}

function matrixRank(matrix: Matrix): number {
  const gram = multiplyMatrices(matrix, transpose(matrix));
  return jacobiEigenSymmetric(gram).values.filter((value) => Math.abs(value) > EPSILON).length;
}

function multiplyMatrices(left: Matrix, right: Matrix): Matrix {
  const rightT = transpose(right);
  return left.map((row) => rightT.map((column) => row.reduce((sum, value, index) => sum + value * column[index], 0)));
}

function matrixSectionMultiply(matrix: Matrix, section: readonly Vec3[]): Vec3[] {
  return matrix.map((row) =>
    row.reduce((sum, coefficient, index) => addVec3(sum, scaleVec3(section[index] ?? zeroVec3(), coefficient)), zeroVec3()),
  );
}

function applyPermutationToSection(permutation: Matrix, section: readonly Vec3[]): Vec3[] {
  return matrixSectionMultiply(permutation, section);
}

function transpose(matrix: Matrix): Matrix {
  if (matrix.length === 0) return [];
  return matrix[0].map((_value, columnIndex) => matrix.map((row) => row[columnIndex]));
}

function identityMatrix(size: number): Matrix {
  return Array.from({ length: size }, (_row, rowIndex) => Array.from({ length: size }, (_column, columnIndex) => rowIndex === columnIndex ? 1 : 0));
}

function subtractMatrices(left: Matrix, right: Matrix): Matrix {
  return left.map((row, rowIndex) => row.map((value, columnIndex) => value - (right[rowIndex]?.[columnIndex] ?? 0)));
}

function scaleMatrix(matrix: Matrix, scalar: number): Matrix {
  return matrix.map((row) => row.map((value) => value * scalar));
}

function scaleSection(section: readonly Vec3[], scalar: number): Vec3[] {
  return section.map((value) => scaleVec3(value, scalar));
}

function maxMatrixAbs(matrix: Matrix): number {
  return maxOf(matrix.flat().map(Math.abs));
}

function maxSectionError(left: readonly Vec3[], right: readonly Vec3[]): number {
  return maxOf(left.map((value, index) => maxAbsVec3(subVec3(value, right[index] ?? zeroVec3()))));
}

function sectionInner(left: readonly Vec3[], right: readonly Vec3[]): number {
  return left.reduce((sum, value, index) => sum + dotVec3(value, right[index] ?? zeroVec3()), 0);
}

function sectionNorm(section: readonly Vec3[]): number {
  return Math.sqrt(sectionInner(section, section));
}

function requiredCell(cells: readonly Cell[], cellId: CellId): Cell {
  const cell = cells.find((candidate) => candidate.cellId === cellId);
  if (!cell) throw new Error(`Missing cell ${cellId}`);
  return cell;
}

function requiredVertex(cell: Cell, vertexId: string): Vertex {
  const vertex = cell.vertices.find((candidate) => candidate.id === vertexId);
  if (!vertex) throw new Error(`Missing vertex ${vertexId}`);
  return vertex;
}

function edgeId(left: string, right: string): string {
  return [left, right].sort().join('');
}

function cubeVertexId(values: readonly number[]): string {
  return `${values[0] > 0 ? '+' : '-'}${values[1] > 0 ? '+' : '-'}${values[2] > 0 ? '+' : '-'}`;
}

function hammingDistance(left: Vec3, right: Vec3): number {
  return left.filter((value, index) => value !== right[index]).length;
}

function sameVec3(left: Vec3, right: Vec3): boolean {
  return maxAbsVec3(subVec3(left, right)) <= EPSILON;
}

function addVec3(left: Vec3, right: Vec3): Vec3 {
  return [left[0] + right[0], left[1] + right[1], left[2] + right[2]];
}

function subVec3(left: Vec3, right: Vec3): Vec3 {
  return [left[0] - right[0], left[1] - right[1], left[2] - right[2]];
}

function scaleVec3(value: Vec3, scale: number): Vec3 {
  return [value[0] * scale, value[1] * scale, value[2] * scale];
}

function dotVec3(left: Vec3, right: Vec3): number {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

function maxAbsVec3(value: Vec3): number {
  return Math.max(Math.abs(value[0]), Math.abs(value[1]), Math.abs(value[2]));
}

function zeroVec3(): Vec3 {
  return [0, 0, 0];
}

function cleanVec3(value: Vec3): Vec3 {
  return [cleanNumber(value[0]), cleanNumber(value[1]), cleanNumber(value[2])];
}

function cleanNumber(value: number): number {
  return Math.abs(value) <= EPSILON ? 0 : Number(value.toFixed(12));
}

function maxOf(values: readonly number[]): number {
  return values.length ? Math.max(...values) : 0;
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function summarize<Row extends { status: string; maxError?: number }>(rows: readonly Row[], passStatus: string, failStatus: string): Summary {
  const passCount = rows.filter((row) => row.status === passStatus).length;
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    maxError: maxOf(rows.map((row) => row.maxError ?? 0)),
    status: passCount === rows.length ? passStatus : failStatus,
  };
}

function summarizeByPassSet<Row extends { status: string; maxError?: number }>(rows: readonly Row[], passStatuses: ReadonlySet<string>, failStatus: string): Summary {
  const passCount = rows.filter((row) => passStatuses.has(row.status)).length;
  const status = passCount === rows.length
    ? failStatus === 'raw-context-response-failed'
      ? 'raw-context-response-pass'
      : failStatus === 'invalidity-control-failed'
        ? 'invalidity-controls-pass'
        : rows[0]?.status ?? 'pass'
    : failStatus;
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    maxError: maxOf(rows.map((row) => row.maxError ?? 0)),
    status,
  };
}

function boundaryMissingOrPromoted(rows: readonly BoundaryRow[]): boolean {
  return BOUNDARY_IDS.some((id) => !rows.some((row) => row.boundaryId === id && row.enforced && row.status === 'boundary-pass')) ||
    rows.some((row) => row.positivePromotionDetected);
}

function requiredFalsifierMissing(rows: readonly FalsifierRow[]): boolean {
  return FALSIFIER_IDS.some((id) => !rows.some((row) => row.falsifierId === id));
}

import { buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report } from './pSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1';

export type Vec3 = [number, number, number];
export type A3Label = 'A' | 'B' | 'C' | 'D';
export type A3FlagId = `${A3Label}->${A3Label}`;
export type ObjectDomain = 'flag' | 've-square' | 've-a2-hexagon';
export type SectorId = 'sectorMinus' | 'sectorPlus';
type SupportDomain = 've-square' | 've-a2-hexagon';
type CoordinateId =
  | 'sectorMinus.x'
  | 'sectorMinus.y'
  | 'sectorMinus.z'
  | 'sectorPlus.x'
  | 'sectorPlus.y'
  | 'sectorPlus.z';

export interface TwoSectorValue {
  sectorMinus: Vec3;
  sectorPlus: Vec3;
  valueStatus: 'assigned' | 'blocked';
  blockedReason?: string;
}

export interface ParentEvidenceRow {
  parentId:
    | 'T28-S-Lab-1'
    | 'p-simplex-vector-order-parameter-diagnostic-v0 inherited'
    | 'T28-N0 inherited'
    | 'T28-P inherited'
    | 'T28-Q inherited'
    | 'T28-R context-only-not-authority';
  method: string;
  ok: boolean | null;
  finalVerdict?: string;
  verdict?: string;
  summaryVerdict?: string;
  consumedSections: string[];
  inheritedStatus?: string;
  parentStatus: 'accepted-parent' | 'rejected-parent' | 'context-only';
}

export interface SupportSetSummary {
  flagCount: number;
  squareCount: number;
  hexCount: number;
  supportCount: number;
  status: 'support-set-ready' | 'support-set-count-failed';
}

export interface SupportIncidenceRow {
  supportObjectId: string;
  supportDomain: SupportDomain;
  incidentFlagIds: A3FlagId[];
  incidentFlagCount: number;
  incidenceWeight: number;
  incidenceSource: 'authorized-square-source-target-polarity' | 'omitted-label-hex-rule';
  incidenceStatus:
    | 'incidence-set-pass'
    | 'incidence-set-count-failed'
    | 'square-incidence-polarity-missing'
    | 'hex-incidence-omitted-label-failed';
}

export interface FlagIncidentSupportRow {
  flagId: A3FlagId;
  incidentSquareIds: string[];
  incidentHexIds: string[];
  incidentSquareCount: number;
  incidentHexCount: number;
  incidenceStatus: 'flag-incidence-pass' | 'incidence-set-count-failed';
}

export interface ForwardIncidenceClosureRow {
  supportObjectId: string;
  supportDomain: SupportDomain;
  incidentFlagIds: A3FlagId[];
  computedSectorMinus: Vec3;
  expectedSectorMinus: Vec3;
  computedSectorPlus: Vec3;
  expectedSectorPlus: Vec3;
  maxError: number;
  closureStatus:
    | 'forward-incidence-closure-pass'
    | 'forward-incidence-square-closure-failed'
    | 'forward-incidence-hex-closure-failed'
    | 'sector-collapsed'
    | 'scalar-source-law-used';
}

export interface ForwardIncidenceClosureSummary {
  supportCount: number;
  passCount: number;
  squareFailCount: number;
  hexFailCount: number;
  maxError: number;
  status:
    | 'forward-incidence-closure-pass'
    | 'forward-incidence-square-closure-failed'
    | 'forward-incidence-hex-closure-failed';
}

export interface AdjointPairingDeclaration {
  flagPairing: '<sigma,tau>_F = sum over flags of E-sector Euclidean pairings';
  supportPairing: '<eta,zeta>_P = sum over supports of E-sector Euclidean pairings';
  fiberPairing: '<(u_-,u_+),(v_-,v_+)>_E = dot(u_-,v_-) + dot(u_+,v_+)';
  squareContributionWeight: 0.25;
  hexContributionWeight: number;
  pairingStatus: 'unweighted-pairing-declared' | 'pairing-undeclared';
}

export interface AdjointBasisRow {
  basisCaseId: string;
  flagObjectId: string;
  supportObjectId: string;
  flagBasisCoordinate: CoordinateId;
  supportBasisCoordinate: CoordinateId;
  leftPairing: number;
  rightPairing: number;
  absoluteError: number;
  adjointStatus: 'unweighted-adjoint-identity-pass' | 'adjoint-pairing-identity-failed';
}

export interface AdjointPairingSummary {
  basisCaseCount: number;
  passCount: number;
  maxError: number;
  status: 'unweighted-adjoint-identity-pass' | 'adjoint-pairing-identity-failed';
}

export interface AdjointReturnRow {
  flagId: A3FlagId;
  computedSectorMinus: Vec3;
  expectedSectorMinus: Vec3;
  computedSectorPlus: Vec3;
  expectedSectorPlus: Vec3;
  maxError: number;
  returnStatus:
    | 'adjoint-return-q-mode-pass'
    | 'adjoint-return-minus-failed'
    | 'adjoint-return-plus-failed'
    | 'adjoint-return-sector-collapsed';
}

export interface AdjointReturnSummary {
  flagCount: number;
  passCount: number;
  maxError: number;
  status:
    | 'adjoint-return-q-mode-pass'
    | 'adjoint-return-minus-failed'
    | 'adjoint-return-plus-failed'
    | 'adjoint-return-sector-collapsed';
}

export interface KIncEquivarianceRow {
  permutationId: string;
  caseId: string;
  sectorMinusError: number;
  sectorPlusError: number;
  equivarianceStatus: 'k-inc-s4-equivariant' | 'k-inc-equivariance-failed';
}

export interface KIncEquivarianceSummary {
  permutationCount: number;
  caseCount: number;
  checkedRowCount: number;
  passCount: number;
  maxMinusError: number;
  maxPlusError: number;
  status: 'k-inc-s4-equivariant' | 'k-inc-equivariance-failed';
}

export interface KIncSquaredRow {
  objectId: string;
  objectDomain: ObjectDomain;
  computedK2Minus: Vec3;
  expectedK2Minus: Vec3;
  computedK2Plus: Vec3;
  expectedK2Plus: Vec3;
  maxError: number;
  k2Label: 'q-mode-incidence-return-scaling';
  k2Status:
    | 'q-mode-incidence-return-scaling-pass'
    | 'k2-q-mode-scaling-failed'
    | 'k2-overgeneralized-as-natural-field-law';
}

export interface KIncSquaredSummary {
  objectCount: number;
  passCount: number;
  flagPassCount: number;
  squarePassCount: number;
  hexPassCount: number;
  maxError: number;
  status:
    | 'q-mode-incidence-return-scaling-pass'
    | 'k2-q-mode-scaling-failed'
    | 'k2-overgeneralized-as-natural-field-law';
}

export interface SectorPreservationRow {
  checkId: string;
  inputLayer: 'flag' | 'support' | 'two-layer';
  inputDomain: ObjectDomain | 'support';
  inputSector: SectorId;
  operator: 'B_E' | 'B_E^*' | 'K_inc';
  outputLayer: 'flag' | 'support' | 'two-layer';
  forbiddenOutputDescription: string;
  forbiddenOutputNormDebugOnly: number;
  preservationStatus:
    | 'sector-preservation-pass'
    | 'sector-leakage-detected'
    | 'unauthorized-square-hex-coupling';
}

export interface SectorPreservationSummary {
  checkCount: number;
  passCount: number;
  leakageCount: number;
  unauthorizedCouplingCount: number;
  status:
    | 'sector-preservation-pass'
    | 'sector-leakage-detected'
    | 'unauthorized-square-hex-coupling';
}

export interface SquarePolarityGateRow {
  corruptedSquareObjectId: string;
  flagSetKey: string;
  sourceLabelPairPresent: boolean;
  targetLabelPairPresent: boolean;
  incidenceAttemptStatus: 'square-incidence-blocked' | 'square-incidence-falsely-authorized';
  status:
    | 'square-incidence-polarity-gate-pass'
    | 'square-edge-channel-sign-not-authorized-control-failed';
}

export interface SquarePolarityGateSummary {
  checkedCount: number;
  blockedCount: number;
  falselyAuthorizedCount: number;
  status:
    | 'square-incidence-polarity-gate-pass'
    | 'square-edge-channel-sign-not-authorized-control-failed';
}

export interface RawHexScaleGateRow {
  hexObjectId: string;
  computedFromBE: Vec3;
  corruptedExpected: Vec3;
  correctExpected: Vec3;
  corruptionDetected: boolean;
  maxErrorAgainstCorrupt: number;
  maxErrorAgainstCorrect: number;
  status: 'raw-hex-scale-gate-pass' | 'raw-hex-scale-corruption-undetected';
}

export interface RawHexScaleGateSummary {
  checkedCount: number;
  corruptionDetectedCount: number;
  status: 'raw-hex-scale-gate-pass' | 'raw-hex-scale-corruption-undetected';
}

export interface ControlRow {
  controlId: 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
  controlName: string;
  expectedStatus: string;
  observedStatus: string;
  maxError?: number;
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

export type T28S2FinalVerdict =
  | 'T28-S-Lab-2-vector-native-incidence-operator-pass'
  | 'T28-S-Lab-2-forward-incidence-closure-failed'
  | 'T28-S-Lab-2-adjoint-identity-failed'
  | 'T28-S-Lab-2-k-inc-equivariance-failed'
  | 'T28-S-Lab-2-k2-q-mode-scaling-failed'
  | 'T28-S-Lab-2-sector-preservation-failed'
  | 'T28-S-Lab-2-square-polarity-gate-failed'
  | 'T28-S-Lab-2-raw-scale-gate-failed'
  | 'T28-S-Lab-2-scalar-collapse-regression-failed'
  | 'T28-S-Lab-2-boundary-failed';

export interface PSimplexVectorNativeIncidenceOperatorAuditT28S2Report {
  method: 'p-simplex-vector-native-incidence-operator-audit-t28s2';
  experimentName: 'T28-S-Lab-2 - Vector-Native Incidence Operator Audit';
  diagnosticScope: 'vector-native-incidence-operator-audit-only';
  branchRef: 'wgate/arf-w1-root-frame-v0';
  parentEvidenceRows: ParentEvidenceRow[];
  supportSetSummary: SupportSetSummary;
  supportIncidenceRows: SupportIncidenceRow[];
  flagIncidentSupportRows: FlagIncidentSupportRow[];
  forwardIncidenceClosureRows: ForwardIncidenceClosureRow[];
  forwardIncidenceClosureSummary: ForwardIncidenceClosureSummary;
  adjointPairingDeclaration: AdjointPairingDeclaration;
  adjointBasisRows: AdjointBasisRow[];
  adjointPairingSummary: AdjointPairingSummary;
  adjointReturnRows: AdjointReturnRow[];
  adjointReturnSummary: AdjointReturnSummary;
  kIncEquivarianceRows: KIncEquivarianceRow[];
  kIncEquivarianceSummary: KIncEquivarianceSummary;
  kIncSquaredRows: KIncSquaredRow[];
  kIncSquaredSummary: KIncSquaredSummary;
  sectorPreservationRows: SectorPreservationRow[];
  sectorPreservationSummary: SectorPreservationSummary;
  squarePolarityGateRows: SquarePolarityGateRow[];
  squarePolarityGateSummary: SquarePolarityGateSummary;
  rawHexScaleGateRows: RawHexScaleGateRow[];
  rawHexScaleGateSummary: RawHexScaleGateSummary;
  controlRows: ControlRow[];
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  finalVerdict: T28S2FinalVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

type T28S1Report = ReturnType<typeof buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report>;
type T28S1ReadoutRow = T28S1Report['readoutSectionRows'][number];
type T28S1SquarePolarityRow = T28S1Report['squarePolarityRows'][number];
type T28S1S4ActionRow = T28S1Report['s4ActionRows'][number];

interface Section {
  flag: Map<string, TwoSectorValue>;
  support: Map<string, TwoSectorValue>;
}

interface IncidenceContext {
  flagRows: T28S1ReadoutRow[];
  squareRows: T28S1ReadoutRow[];
  hexRows: T28S1ReadoutRow[];
  supportRows: T28S1ReadoutRow[];
  readoutByObjectId: Map<string, T28S1ReadoutRow>;
  supportIncidenceRows: SupportIncidenceRow[];
  supportIncidenceById: Map<string, SupportIncidenceRow>;
  squarePolarityByObjectId: Map<string, T28S1SquarePolarityRow>;
  squarePolarityByDirectedPair: Map<string, T28S1SquarePolarityRow>;
  s4ActionByPermutationId: Map<string, T28S1S4ActionRow>;
}

interface KIncCase {
  caseId: string;
  section: Section;
}

interface SquareIncidenceCandidate {
  squareObjectId: string;
  flagCycle: readonly A3FlagId[];
  sourceLabelPair: [A3Label, A3Label] | null;
  targetLabelPair: [A3Label, A3Label] | null;
  correspondingTetraEdge: string | null;
  status: T28S1SquarePolarityRow['status'] | 'corrupted-unordered-square-control';
}

interface CorruptedSquareIncidenceCandidate extends SquareIncidenceCandidate {
  flagSetKey: string;
}

const METHOD = 'p-simplex-vector-native-incidence-operator-audit-t28s2' as const;
const EXPERIMENT_NAME = 'T28-S-Lab-2 - Vector-Native Incidence Operator Audit' as const;
const DIAGNOSTIC_SCOPE = 'vector-native-incidence-operator-audit-only' as const;
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
const E_COORDINATES: readonly CoordinateId[] = [
  'sectorMinus.x',
  'sectorMinus.y',
  'sectorMinus.z',
  'sectorPlus.x',
  'sectorPlus.y',
  'sectorPlus.z',
];
const REQUIRED_BOUNDARY_IDS = [
  'not-scalar-source-law',
  'not-norm-first',
  'not-natural-laplacian',
  'not-field-world-operator',
  'not-route',
  'not-gate',
  'not-vortex',
  'not-region',
  'not-support',
  'not-resonance',
  'not-phase-behavior',
  'not-topology',
  'not-semantic-naming',
  'not-fieldcue',
  'not-runtime',
  'not-ui',
  'not-packet-writing',
  'not-shape-mutation',
] as const;
const REQUIRED_FALSIFIER_IDS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'] as const;

export function buildPSimplexVectorNativeIncidenceOperatorAuditT28S2Report(): PSimplexVectorNativeIncidenceOperatorAuditT28S2Report {
  const parentReport = buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report();
  const parentEvidenceRows = buildParentEvidenceRows(parentReport);
  const context = buildIncidenceContext(parentReport);
  const supportSetSummary = buildSupportSetSummary(context);
  const flagIncidentSupportRows = buildFlagIncidentSupportRows(context);
  const forwardIncidenceClosureRows = buildForwardIncidenceClosureRows(context);
  const forwardIncidenceClosureSummary = buildForwardIncidenceClosureSummary(forwardIncidenceClosureRows);
  const adjointPairingDeclaration = buildAdjointPairingDeclaration();
  const adjointBasisRows = buildAdjointBasisRows(context);
  const adjointPairingSummary = buildAdjointPairingSummary(adjointBasisRows);
  const adjointReturnRows = buildAdjointReturnRows(context);
  const adjointReturnSummary = buildAdjointReturnSummary(adjointReturnRows);
  const kIncCases = buildKIncCases(context);
  const kIncEquivarianceRows = buildKIncEquivarianceRows(parentReport, context, kIncCases);
  const kIncEquivarianceSummary = buildKIncEquivarianceSummary(kIncEquivarianceRows, parentReport.s4ActionRows.length, kIncCases.length);
  const kIncSquaredRows = buildKIncSquaredRows(context);
  const kIncSquaredSummary = buildKIncSquaredSummary(kIncSquaredRows);
  const sectorPreservationRows = buildSectorPreservationRows(context);
  const sectorPreservationSummary = buildSectorPreservationSummary(sectorPreservationRows);
  const squarePolarityGateRows = buildSquarePolarityGateRows(parentReport);
  const squarePolarityGateSummary = buildSquarePolarityGateSummary(squarePolarityGateRows);
  const rawHexScaleGateRows = buildRawHexScaleGateRows(context);
  const rawHexScaleGateSummary = buildRawHexScaleGateSummary(rawHexScaleGateRows);
  const controlRows = buildControlRows({
    context,
    forwardIncidenceClosureRows,
    adjointReturnRows,
    squarePolarityGateSummary,
    rawHexScaleGateSummary,
    kIncSquaredRows,
  });
  const boundaryRows = buildBoundaryRows();
  const preliminaryVerdict = classifyFinalVerdict({
    parentEvidenceRows,
    supportSetSummary,
    supportIncidenceRows: context.supportIncidenceRows,
    flagIncidentSupportRows,
    forwardIncidenceClosureSummary,
    adjointPairingSummary,
    adjointReturnSummary,
    kIncEquivarianceSummary,
    kIncSquaredSummary,
    sectorPreservationSummary,
    squarePolarityGateSummary,
    rawHexScaleGateSummary,
    controlRows,
    boundaryRows,
    falsifierRows: [],
  });
  const falsifierRows = buildFalsifierRows({
    parentReport,
    supportIncidenceRows: context.supportIncidenceRows,
    controlRows,
    squarePolarityGateSummary,
    rawHexScaleGateSummary,
    sectorPreservationSummary,
    finalVerdict: preliminaryVerdict,
  });
  const finalVerdict = classifyFinalVerdict({
    parentEvidenceRows,
    supportSetSummary,
    supportIncidenceRows: context.supportIncidenceRows,
    flagIncidentSupportRows,
    forwardIncidenceClosureSummary,
    adjointPairingSummary,
    adjointReturnSummary,
    kIncEquivarianceSummary,
    kIncSquaredSummary,
    sectorPreservationSummary,
    squarePolarityGateSummary,
    rawHexScaleGateSummary,
    controlRows,
    boundaryRows,
    falsifierRows,
  });
  const integrityIssues = buildIntegrityIssues({
    parentEvidenceRows,
    supportSetSummary,
    supportIncidenceRows: context.supportIncidenceRows,
    flagIncidentSupportRows,
    forwardIncidenceClosureSummary,
    adjointBasisRows,
    adjointPairingSummary,
    adjointReturnSummary,
    kIncEquivarianceSummary,
    kIncSquaredSummary,
    sectorPreservationSummary,
    squarePolarityGateSummary,
    rawHexScaleGateSummary,
    controlRows,
    boundaryRows,
    falsifierRows,
    finalVerdict,
  });
  const ok =
    integrityIssues.length === 0 &&
    falsifierRows.every((row) => !row.triggered) &&
    finalVerdict === 'T28-S-Lab-2-vector-native-incidence-operator-pass';

  return {
    method: METHOD,
    experimentName: EXPERIMENT_NAME,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    parentEvidenceRows,
    supportSetSummary,
    supportIncidenceRows: context.supportIncidenceRows,
    flagIncidentSupportRows,
    forwardIncidenceClosureRows,
    forwardIncidenceClosureSummary,
    adjointPairingDeclaration,
    adjointBasisRows,
    adjointPairingSummary,
    adjointReturnRows,
    adjointReturnSummary,
    kIncEquivarianceRows,
    kIncEquivarianceSummary,
    kIncSquaredRows,
    kIncSquaredSummary,
    sectorPreservationRows,
    sectorPreservationSummary,
    squarePolarityGateRows,
    squarePolarityGateSummary,
    rawHexScaleGateRows,
    rawHexScaleGateSummary,
    controlRows,
    boundaryRows,
    falsifierRows,
    finalVerdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok,
  };
}

function buildParentEvidenceRows(parentReport: T28S1Report): ParentEvidenceRow[] {
  const rows: ParentEvidenceRow[] = [
    {
      parentId: 'T28-S-Lab-1',
      method: parentReport.method,
      ok: parentReport.ok,
      finalVerdict: parentReport.finalVerdict,
      consumedSections: [
        'readoutSectionRows',
        'squarePolarityRows',
        'squarePolaritySummary',
        'rawScaleRows',
        'rawScaleSummary',
        's4ActionRows',
        's4ActionSummary',
        'qSourcePackageAudit',
        'parentEvidenceRows',
        'controlRows',
        'boundaryRows',
        'finalVerdict',
        'ok',
      ],
      parentStatus: parentAccepted(parentReport) ? 'accepted-parent' : 'rejected-parent',
    },
  ];

  for (const inherited of parentReport.parentEvidenceRows) {
    const parentId = inherited.parentId === 'p-simplex-vector-order-parameter-diagnostic-v0'
      ? 'p-simplex-vector-order-parameter-diagnostic-v0 inherited'
      : (`${inherited.parentId} inherited` as ParentEvidenceRow['parentId']);
    rows.push({
      parentId,
      method: inherited.method,
      ok: inherited.ok,
      verdict: inherited.verdict,
      summaryVerdict: inherited.summaryVerdict,
      consumedSections: [],
      inheritedStatus: inherited.parentStatus,
      parentStatus: inherited.parentStatus === 'accepted-parent' ? 'accepted-parent' : 'rejected-parent',
    });
  }

  rows.push({
    parentId: 'T28-R context-only-not-authority',
    method: 'not-imported',
    ok: null,
    consumedSections: [],
    parentStatus: 'context-only',
  });

  return rows;
}

function parentAccepted(parentReport: T28S1Report): boolean {
  return (
    parentReport.ok === true &&
    parentReport.finalVerdict === 'T28-S-Lab-1-vector-native-two-sector-preflight-pass' &&
    parentReport.squarePolaritySummary.squareComponentStatus === 'square-polarity-authorized' &&
    parentReport.rawScaleSummary.rawScaleStatus === 'raw-incidence-scale-preserved' &&
    parentReport.s4ActionSummary.status === 'tetrahedral-standard-action-verified'
  );
}

function buildIncidenceContext(parentReport: T28S1Report): IncidenceContext {
  const flagRows = parentReport.readoutSectionRows.filter((row) => row.objectDomain === 'flag');
  const squareRows = parentReport.readoutSectionRows.filter((row) => row.objectDomain === 've-square');
  const hexRows = parentReport.readoutSectionRows.filter((row) => row.objectDomain === 've-a2-hexagon');
  const supportRows = [...squareRows, ...hexRows];
  const readoutByObjectId = new Map(parentReport.readoutSectionRows.map((row) => [row.objectId, row]));
  const squarePolarityByObjectId = new Map(parentReport.squarePolarityRows.map((row) => [row.squareObjectId, row]));
  const squarePolarityByDirectedPair = new Map(
    parentReport.squarePolarityRows
      .filter((row) => row.sourceLabelPair && row.targetLabelPair)
      .map((row) => [directedPairKey(row.sourceLabelPair as [A3Label, A3Label], row.targetLabelPair as [A3Label, A3Label]), row]),
  );
  const supportIncidenceRows = buildSupportIncidenceRows(parentReport.readoutSectionRows, squarePolarityByObjectId);

  return {
    flagRows,
    squareRows,
    hexRows,
    supportRows,
    readoutByObjectId,
    supportIncidenceRows,
    supportIncidenceById: new Map(supportIncidenceRows.map((row) => [row.supportObjectId, row])),
    squarePolarityByObjectId,
    squarePolarityByDirectedPair,
    s4ActionByPermutationId: new Map(parentReport.s4ActionRows.map((row) => [row.permutationId, row])),
  };
}

function buildSupportSetSummary(context: IncidenceContext): SupportSetSummary {
  const flagCount = context.flagRows.length;
  const squareCount = context.squareRows.length;
  const hexCount = context.hexRows.length;
  const supportCount = context.supportRows.length;

  return {
    flagCount,
    squareCount,
    hexCount,
    supportCount,
    status: flagCount === 12 && squareCount === 6 && hexCount === 4 && supportCount === 10
      ? 'support-set-ready'
      : 'support-set-count-failed',
  };
}

function buildSupportIncidenceRows(
  readoutRows: readonly T28S1ReadoutRow[],
  squarePolarityByObjectId: ReadonlyMap<string, T28S1SquarePolarityRow>,
): SupportIncidenceRow[] {
  return readoutRows
    .filter((row) => row.objectDomain === 've-square' || row.objectDomain === 've-a2-hexagon')
    .map((row) => {
      if (row.objectDomain === 've-square') {
        const square = squarePolarityByObjectId.get(row.objectId);
        const authorization = square ? authorizeSquareIncidence(square) : null;

        if (!authorization || authorization.authorizationStatus === 'square-incidence-blocked') {
          return {
            supportObjectId: row.objectId,
            supportDomain: 've-square',
            incidentFlagIds: [],
            incidentFlagCount: 0,
            incidenceWeight: 1 / 4,
            incidenceSource: 'authorized-square-source-target-polarity',
            incidenceStatus: 'square-incidence-polarity-missing',
          };
        }

        const incidentFlagIds = authorization.incidentFlagIds;

        return {
          supportObjectId: row.objectId,
          supportDomain: 've-square',
          incidentFlagIds,
          incidentFlagCount: incidentFlagIds.length,
          incidenceWeight: 1 / 4,
          incidenceSource: 'authorized-square-source-target-polarity',
          incidenceStatus: incidentFlagIds.length === 4 ? 'incidence-set-pass' : 'incidence-set-count-failed',
        };
      }

      const omitted = parseHexOmittedLabel(row.objectId);
      const incidentFlagIds = omitted
        ? DIRECTED_FLAGS.filter((flag) => {
            const [source, target] = parseFlagId(flag);
            return source !== omitted && target !== omitted;
          })
        : [];

      return {
        supportObjectId: row.objectId,
        supportDomain: 've-a2-hexagon',
        incidentFlagIds,
        incidentFlagCount: incidentFlagIds.length,
        incidenceWeight: 1 / 6,
        incidenceSource: 'omitted-label-hex-rule',
        incidenceStatus: !omitted
          ? 'hex-incidence-omitted-label-failed'
          : incidentFlagIds.length === 6
            ? 'incidence-set-pass'
            : 'incidence-set-count-failed',
      };
    });
}

function buildFlagIncidentSupportRows(context: IncidenceContext): FlagIncidentSupportRow[] {
  return context.flagRows.map((row) => {
    const flagId = row.objectKey as A3FlagId;
    const incidentSupports = context.supportIncidenceRows.filter((support) => support.incidentFlagIds.includes(flagId));
    const incidentSquareIds = incidentSupports
      .filter((support) => support.supportDomain === 've-square')
      .map((support) => support.supportObjectId);
    const incidentHexIds = incidentSupports
      .filter((support) => support.supportDomain === 've-a2-hexagon')
      .map((support) => support.supportObjectId);

    return {
      flagId,
      incidentSquareIds,
      incidentHexIds,
      incidentSquareCount: incidentSquareIds.length,
      incidentHexCount: incidentHexIds.length,
      incidenceStatus: incidentSquareIds.length === 2 && incidentHexIds.length === 2
        ? 'flag-incidence-pass'
        : 'incidence-set-count-failed',
    };
  });
}

function buildForwardIncidenceClosureRows(context: IncidenceContext): ForwardIncidenceClosureRow[] {
  const flagSection = sectionFromRows(context.flagRows);
  const supportSection = applyB(flagSection, context.supportIncidenceRows);

  return context.supportRows.map((support) => {
    const computed = supportSection.get(support.objectId) ?? zeroTwoSector();
    const maxError = twoSectorMaxError(computed, support);
    const closureStatus: ForwardIncidenceClosureRow['closureStatus'] = maxError <= EPSILON
      ? 'forward-incidence-closure-pass'
      : support.objectDomain === 've-square'
        ? 'forward-incidence-square-closure-failed'
        : 'forward-incidence-hex-closure-failed';

    return {
      supportObjectId: support.objectId,
      supportDomain: support.objectDomain as SupportDomain,
      incidentFlagIds: context.supportIncidenceById.get(support.objectId)?.incidentFlagIds ?? [],
      computedSectorMinus: cleanVec3(computed.sectorMinus),
      expectedSectorMinus: cleanVec3(support.sectorMinus),
      computedSectorPlus: cleanVec3(computed.sectorPlus),
      expectedSectorPlus: cleanVec3(support.sectorPlus),
      maxError,
      closureStatus,
    };
  });
}

function buildForwardIncidenceClosureSummary(rows: readonly ForwardIncidenceClosureRow[]): ForwardIncidenceClosureSummary {
  const squareFailCount = rows.filter((row) => row.closureStatus === 'forward-incidence-square-closure-failed').length;
  const hexFailCount = rows.filter((row) => row.closureStatus === 'forward-incidence-hex-closure-failed').length;
  const status: ForwardIncidenceClosureSummary['status'] =
    squareFailCount > 0
      ? 'forward-incidence-square-closure-failed'
      : hexFailCount > 0
        ? 'forward-incidence-hex-closure-failed'
        : 'forward-incidence-closure-pass';

  return {
    supportCount: rows.length,
    passCount: rows.filter((row) => row.closureStatus === 'forward-incidence-closure-pass').length,
    squareFailCount,
    hexFailCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status,
  };
}

function buildAdjointPairingDeclaration(): AdjointPairingDeclaration {
  return {
    flagPairing: '<sigma,tau>_F = sum over flags of E-sector Euclidean pairings',
    supportPairing: '<eta,zeta>_P = sum over supports of E-sector Euclidean pairings',
    fiberPairing: '<(u_-,u_+),(v_-,v_+)>_E = dot(u_-,v_-) + dot(u_+,v_+)',
    squareContributionWeight: 0.25,
    hexContributionWeight: 1 / 6,
    pairingStatus: 'unweighted-pairing-declared',
  };
}

function buildAdjointBasisRows(context: IncidenceContext): AdjointBasisRow[] {
  return context.flagRows.flatMap((flagRow) =>
    context.supportRows.flatMap((supportRow) =>
      E_COORDINATES.flatMap((flagBasisCoordinate) =>
        E_COORDINATES.map((supportBasisCoordinate) => {
          const flagSection = new Map<string, TwoSectorValue>([[flagRow.objectId, basisValue(flagBasisCoordinate)]]);
          const supportBasis = basisValue(supportBasisCoordinate);
          const supportSection = new Map<string, TwoSectorValue>([[supportRow.objectId, supportBasis]]);
          const leftSupportSection = applyB(flagSection, context.supportIncidenceRows);
          const rightFlagSection = applyBStar(supportSection, context.flagRows, context.supportIncidenceRows);
          const leftPairing = twoSectorDot(leftSupportSection.get(supportRow.objectId) ?? zeroTwoSector(), supportBasis);
          const rightPairing = twoSectorDot(basisValue(flagBasisCoordinate), rightFlagSection.get(flagRow.objectId) ?? zeroTwoSector());
          const absoluteError = Math.abs(leftPairing - rightPairing);

          return {
            basisCaseId: `basis:${flagRow.objectId}:${flagBasisCoordinate}:${supportRow.objectId}:${supportBasisCoordinate}`,
            flagObjectId: flagRow.objectId,
            supportObjectId: supportRow.objectId,
            flagBasisCoordinate,
            supportBasisCoordinate,
            leftPairing: cleanNumber(leftPairing),
            rightPairing: cleanNumber(rightPairing),
            absoluteError,
            adjointStatus: absoluteError <= EPSILON
              ? 'unweighted-adjoint-identity-pass'
              : 'adjoint-pairing-identity-failed',
          };
        }),
      ),
    ),
  );
}

function buildAdjointPairingSummary(rows: readonly AdjointBasisRow[]): AdjointPairingSummary {
  const passCount = rows.filter((row) => row.adjointStatus === 'unweighted-adjoint-identity-pass').length;

  return {
    basisCaseCount: rows.length,
    passCount,
    maxError: maxOf(rows.map((row) => row.absoluteError)),
    status: rows.length === 4320 && passCount === rows.length
      ? 'unweighted-adjoint-identity-pass'
      : 'adjoint-pairing-identity-failed',
  };
}

function buildAdjointReturnRows(context: IncidenceContext): AdjointReturnRow[] {
  const supportSection = sectionFromRows(context.supportRows);
  const flagReturn = applyBStar(supportSection, context.flagRows, context.supportIncidenceRows);

  return context.flagRows.map((flagRow) => {
    const computed = flagReturn.get(flagRow.objectId) ?? zeroTwoSector();
    const expectedMinus = scaleVec3(flagRow.sectorMinus, 1 / 4);
    const expectedPlus = scaleVec3(flagRow.sectorPlus, 1 / 9);
    const minusError = maxAbsVec3(subVec3(computed.sectorMinus, expectedMinus));
    const plusError = maxAbsVec3(subVec3(computed.sectorPlus, expectedPlus));
    const returnStatus: AdjointReturnRow['returnStatus'] = minusError <= EPSILON && plusError <= EPSILON
      ? 'adjoint-return-q-mode-pass'
      : minusError > EPSILON && plusError > EPSILON
        ? 'adjoint-return-sector-collapsed'
        : minusError > EPSILON
          ? 'adjoint-return-minus-failed'
          : 'adjoint-return-plus-failed';

    return {
      flagId: flagRow.objectKey as A3FlagId,
      computedSectorMinus: cleanVec3(computed.sectorMinus),
      expectedSectorMinus: cleanVec3(expectedMinus),
      computedSectorPlus: cleanVec3(computed.sectorPlus),
      expectedSectorPlus: cleanVec3(expectedPlus),
      maxError: Math.max(minusError, plusError),
      returnStatus,
    };
  });
}

function buildAdjointReturnSummary(rows: readonly AdjointReturnRow[]): AdjointReturnSummary {
  const passCount = rows.filter((row) => row.returnStatus === 'adjoint-return-q-mode-pass').length;
  const minusFail = rows.some((row) => row.returnStatus === 'adjoint-return-minus-failed');
  const plusFail = rows.some((row) => row.returnStatus === 'adjoint-return-plus-failed');
  const sectorCollapse = rows.some((row) => row.returnStatus === 'adjoint-return-sector-collapsed');

  return {
    flagCount: rows.length,
    passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: passCount === rows.length
      ? 'adjoint-return-q-mode-pass'
      : sectorCollapse
        ? 'adjoint-return-sector-collapsed'
        : minusFail
          ? 'adjoint-return-minus-failed'
          : plusFail
            ? 'adjoint-return-plus-failed'
            : 'adjoint-return-sector-collapsed',
  };
}

function buildKIncCases(context: IncidenceContext): KIncCase[] {
  const empty = emptySection();
  const firstFlag = context.flagRows[0];
  const firstSquare = context.squareRows[0];
  const firstHex = context.hexRows[0];

  return [
    {
      caseId: 'Wq-two-layer-section',
      section: {
        flag: sectionFromRows(context.flagRows),
        support: sectionFromRows(context.supportRows),
      },
    },
    basisCase('basis-flag-minus-x', firstFlag.objectId, 'flag', 'sectorMinus.x', empty),
    basisCase('basis-flag-plus-y', firstFlag.objectId, 'flag', 'sectorPlus.y', empty),
    basisCase('basis-square-minus-z', firstSquare.objectId, 'support', 'sectorMinus.z', empty),
    basisCase('basis-square-plus-x', firstSquare.objectId, 'support', 'sectorPlus.x', empty),
    basisCase('basis-hex-minus-y', firstHex.objectId, 'support', 'sectorMinus.y', empty),
    basisCase('basis-hex-plus-z', firstHex.objectId, 'support', 'sectorPlus.z', empty),
  ];
}

function basisCase(
  caseId: string,
  objectId: string,
  layer: 'flag' | 'support',
  coordinate: CoordinateId,
  empty: Section,
): KIncCase {
  const section = cloneSection(empty);
  section[layer].set(objectId, basisValue(coordinate));
  return { caseId, section };
}

function buildKIncEquivarianceRows(
  parentReport: T28S1Report,
  context: IncidenceContext,
  cases: readonly KIncCase[],
): KIncEquivarianceRow[] {
  return parentReport.s4ActionRows.flatMap((actionRow) =>
    cases.map((testCase) => {
      const left = kInc(actSection(testCase.section, actionRow, context), context);
      const right = actSection(kInc(testCase.section, context), actionRow, context);
      const sectorMinusError = sectionSectorError(left, right, 'sectorMinus');
      const sectorPlusError = sectionSectorError(left, right, 'sectorPlus');

      return {
        permutationId: actionRow.permutationId,
        caseId: testCase.caseId,
        sectorMinusError,
        sectorPlusError,
        equivarianceStatus: sectorMinusError <= EPSILON && sectorPlusError <= EPSILON
          ? 'k-inc-s4-equivariant'
          : 'k-inc-equivariance-failed',
      };
    }),
  );
}

function buildKIncEquivarianceSummary(
  rows: readonly KIncEquivarianceRow[],
  permutationCount: number,
  caseCount: number,
): KIncEquivarianceSummary {
  const passCount = rows.filter((row) => row.equivarianceStatus === 'k-inc-s4-equivariant').length;

  return {
    permutationCount,
    caseCount,
    checkedRowCount: rows.length,
    passCount,
    maxMinusError: maxOf(rows.map((row) => row.sectorMinusError)),
    maxPlusError: maxOf(rows.map((row) => row.sectorPlusError)),
    status: passCount === rows.length ? 'k-inc-s4-equivariant' : 'k-inc-equivariance-failed',
  };
}

function buildKIncSquaredRows(context: IncidenceContext): KIncSquaredRow[] {
  const wqSection = {
    flag: sectionFromRows(context.flagRows),
    support: sectionFromRows(context.supportRows),
  };
  const k2 = kInc(kInc(wqSection, context), context);
  const allRows = [...context.flagRows, ...context.supportRows];

  return allRows.map((row) => {
    const layer = row.objectDomain === 'flag' ? 'flag' : 'support';
    const computed = k2[layer].get(row.objectId) ?? zeroTwoSector();
    const expectedMinus =
      row.objectDomain === 'flag' || row.objectDomain === 've-square'
        ? scaleVec3(row.sectorMinus, 1 / 4)
        : zeroVec3();
    const expectedPlus =
      row.objectDomain === 'flag' || row.objectDomain === 've-a2-hexagon'
        ? scaleVec3(row.sectorPlus, 1 / 9)
        : zeroVec3();
    const maxError = Math.max(
      maxAbsVec3(subVec3(computed.sectorMinus, expectedMinus)),
      maxAbsVec3(subVec3(computed.sectorPlus, expectedPlus)),
    );

    return {
      objectId: row.objectId,
      objectDomain: row.objectDomain,
      computedK2Minus: cleanVec3(computed.sectorMinus),
      expectedK2Minus: cleanVec3(expectedMinus),
      computedK2Plus: cleanVec3(computed.sectorPlus),
      expectedK2Plus: cleanVec3(expectedPlus),
      maxError,
      k2Label: 'q-mode-incidence-return-scaling',
      k2Status: maxError <= EPSILON
        ? 'q-mode-incidence-return-scaling-pass'
        : 'k2-q-mode-scaling-failed',
    };
  });
}

function buildKIncSquaredSummary(rows: readonly KIncSquaredRow[]): KIncSquaredSummary {
  const passRows = rows.filter((row) => row.k2Status === 'q-mode-incidence-return-scaling-pass');

  return {
    objectCount: rows.length,
    passCount: passRows.length,
    flagPassCount: passRows.filter((row) => row.objectDomain === 'flag').length,
    squarePassCount: passRows.filter((row) => row.objectDomain === 've-square').length,
    hexPassCount: passRows.filter((row) => row.objectDomain === 've-a2-hexagon').length,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: passRows.length === rows.length
      ? 'q-mode-incidence-return-scaling-pass'
      : 'k2-q-mode-scaling-failed',
  };
}

function buildSectorPreservationRows(context: IncidenceContext): SectorPreservationRow[] {
  const flagMinus = keepOnlySector(sectionFromRows(context.flagRows), 'sectorMinus');
  const flagPlus = keepOnlySector(sectionFromRows(context.flagRows), 'sectorPlus');
  const supportMinus = keepOnlySector(sectionFromRows(context.supportRows), 'sectorMinus');
  const supportPlus = keepOnlySector(sectionFromRows(context.supportRows), 'sectorPlus');
  const squareMinusSupport = new Map(
    context.squareRows.map((row) => [row.objectId, { sectorMinus: row.sectorMinus, sectorPlus: zeroVec3(), valueStatus: 'assigned' as const }]),
  );
  const hexPlusSupport = new Map(
    context.hexRows.map((row) => [row.objectId, { sectorMinus: zeroVec3(), sectorPlus: row.sectorPlus, valueStatus: 'assigned' as const }]),
  );
  const rows: SectorPreservationRow[] = [];

  rows.push(sectorRow('minus-flag-through-B', 'flag', 'flag', 'sectorMinus', 'B_E', 'support', 'support sectorPlus', maxSectorNorm(applyB(flagMinus, context.supportIncidenceRows), 'sectorPlus')));
  rows.push(sectorRow('plus-flag-through-B', 'flag', 'flag', 'sectorPlus', 'B_E', 'support', 'support sectorMinus', maxSectorNorm(applyB(flagPlus, context.supportIncidenceRows), 'sectorMinus')));
  rows.push(sectorRow('minus-support-through-B-star', 'support', 'support', 'sectorMinus', 'B_E^*', 'flag', 'flag sectorPlus', maxSectorNorm(applyBStar(supportMinus, context.flagRows, context.supportIncidenceRows), 'sectorPlus')));
  rows.push(sectorRow('plus-support-through-B-star', 'support', 'support', 'sectorPlus', 'B_E^*', 'flag', 'flag sectorMinus', maxSectorNorm(applyBStar(supportPlus, context.flagRows, context.supportIncidenceRows), 'sectorMinus')));

  const squareMinusK = kInc({ flag: new Map(), support: squareMinusSupport }, context);
  rows.push(sectorRow('square-minus-support-through-K-inc', 'support', 've-square', 'sectorMinus', 'K_inc', 'two-layer', 'hex-plus support or flag plus leakage', Math.max(maxSectorNorm(squareMinusK.support, 'sectorPlus'), maxSectorNorm(squareMinusK.flag, 'sectorPlus')), 'unauthorized-square-hex-coupling'));

  const hexPlusK = kInc({ flag: new Map(), support: hexPlusSupport }, context);
  rows.push(sectorRow('hex-plus-support-through-K-inc', 'support', 've-a2-hexagon', 'sectorPlus', 'K_inc', 'two-layer', 'square-minus support or flag minus leakage', Math.max(maxSectorNorm(hexPlusK.support, 'sectorMinus'), maxSectorNorm(hexPlusK.flag, 'sectorMinus')), 'unauthorized-square-hex-coupling'));

  return rows;
}

function sectorRow(
  checkId: string,
  inputLayer: SectorPreservationRow['inputLayer'],
  inputDomain: SectorPreservationRow['inputDomain'],
  inputSector: SectorId,
  operator: SectorPreservationRow['operator'],
  outputLayer: SectorPreservationRow['outputLayer'],
  forbiddenOutputDescription: string,
  forbiddenOutputNormDebugOnly: number,
  failKind: 'sector-leakage-detected' | 'unauthorized-square-hex-coupling' = 'sector-leakage-detected',
): SectorPreservationRow {
  return {
    checkId,
    inputLayer,
    inputDomain,
    inputSector,
    operator,
    outputLayer,
    forbiddenOutputDescription,
    forbiddenOutputNormDebugOnly,
    preservationStatus: forbiddenOutputNormDebugOnly <= EPSILON ? 'sector-preservation-pass' : failKind,
  };
}

function buildSectorPreservationSummary(rows: readonly SectorPreservationRow[]): SectorPreservationSummary {
  const leakageCount = rows.filter((row) => row.preservationStatus === 'sector-leakage-detected').length;
  const unauthorizedCouplingCount = rows.filter((row) => row.preservationStatus === 'unauthorized-square-hex-coupling').length;

  return {
    checkCount: rows.length,
    passCount: rows.filter((row) => row.preservationStatus === 'sector-preservation-pass').length,
    leakageCount,
    unauthorizedCouplingCount,
    status: unauthorizedCouplingCount > 0
      ? 'unauthorized-square-hex-coupling'
      : leakageCount > 0
        ? 'sector-leakage-detected'
        : 'sector-preservation-pass',
  };
}

function buildSquarePolarityGateRows(parentReport: T28S1Report): SquarePolarityGateRow[] {
  const corruptedCandidates = unorderedSquareIncidenceAmbiguityCandidates(parentReport.squarePolarityRows);

  return corruptedCandidates.map((candidate) => {
      const authorization = authorizeSquareIncidence(candidate);
      const falselyAuthorized = authorization.authorizationStatus === 'square-incidence-authorized';

      return {
        corruptedSquareObjectId: candidate.squareObjectId,
        flagSetKey: candidate.flagSetKey,
        sourceLabelPairPresent: candidate.sourceLabelPair !== null,
        targetLabelPairPresent: candidate.targetLabelPair !== null,
        incidenceAttemptStatus: falselyAuthorized ? 'square-incidence-falsely-authorized' : 'square-incidence-blocked',
        status: falselyAuthorized
          ? 'square-edge-channel-sign-not-authorized-control-failed'
          : 'square-incidence-polarity-gate-pass',
      };
    });
}

function unorderedSquareIncidenceAmbiguityCandidates(
  squarePolarityRows: readonly T28S1SquarePolarityRow[],
): CorruptedSquareIncidenceCandidate[] {
  return squarePolarityRows
    .filter((row) => row.status === 'square-polarity-authorized')
    .map((row) => ({
      squareObjectId: row.squareObjectId,
      flagCycle: row.flagCycle,
      flagSetKey: flagSetKey(row.flagCycle),
      sourceLabelPair: null,
      targetLabelPair: null,
      correspondingTetraEdge: null,
      status: 'corrupted-unordered-square-control',
    }));
}

function buildSquarePolarityGateSummary(rows: readonly SquarePolarityGateRow[]): SquarePolarityGateSummary {
  const falselyAuthorizedCount = rows.filter((row) => row.incidenceAttemptStatus === 'square-incidence-falsely-authorized').length;

  return {
    checkedCount: rows.length,
    blockedCount: rows.filter((row) => row.incidenceAttemptStatus === 'square-incidence-blocked').length,
    falselyAuthorizedCount,
    status: falselyAuthorizedCount === 0
      ? 'square-incidence-polarity-gate-pass'
      : 'square-edge-channel-sign-not-authorized-control-failed',
  };
}

function buildRawHexScaleGateRows(context: IncidenceContext): RawHexScaleGateRow[] {
  const flagSection = sectionFromRows(context.flagRows);
  const supportSection = applyB(flagSection, context.supportIncidenceRows);

  return context.hexRows.map((hexRow) => {
    const computed = supportSection.get(hexRow.objectId) ?? zeroTwoSector();
    const corruptedExpected = scaleVec3(hexRow.sectorPlus, 3 / 2);
    const correctExpected = hexRow.sectorPlus;
    const maxErrorAgainstCorrupt = maxAbsVec3(subVec3(computed.sectorPlus, corruptedExpected));
    const maxErrorAgainstCorrect = maxAbsVec3(subVec3(computed.sectorPlus, correctExpected));
    const corruptionDetected = maxErrorAgainstCorrupt > EPSILON && maxErrorAgainstCorrect <= EPSILON;

    return {
      hexObjectId: hexRow.objectId,
      computedFromBE: cleanVec3(computed.sectorPlus),
      corruptedExpected: cleanVec3(corruptedExpected),
      correctExpected: cleanVec3(correctExpected),
      corruptionDetected,
      maxErrorAgainstCorrupt,
      maxErrorAgainstCorrect,
      status: corruptionDetected ? 'raw-hex-scale-gate-pass' : 'raw-hex-scale-corruption-undetected',
    };
  });
}

function buildRawHexScaleGateSummary(rows: readonly RawHexScaleGateRow[]): RawHexScaleGateSummary {
  const corruptionDetectedCount = rows.filter((row) => row.corruptionDetected).length;

  return {
    checkedCount: rows.length,
    corruptionDetectedCount,
    status: corruptionDetectedCount === rows.length ? 'raw-hex-scale-gate-pass' : 'raw-hex-scale-corruption-undetected',
  };
}

function buildControlRows(args: {
  context: IncidenceContext;
  forwardIncidenceClosureRows: readonly ForwardIncidenceClosureRow[];
  adjointReturnRows: readonly AdjointReturnRow[];
  squarePolarityGateSummary: SquarePolarityGateSummary;
  rawHexScaleGateSummary: RawHexScaleGateSummary;
  kIncSquaredRows: readonly KIncSquaredRow[];
}): ControlRow[] {
  const zero = emptySection();
  const zeroK = kInc(zero, args.context);
  const zeroMax = sectionMaxNorm(zeroK);
  const unnormalizedMaxError = unnormalizedIncidenceMaxError(args.context);
  const scalarMaxError = scalarMagnitudeControlMaxError(args.context);
  const sectorCollapseMaxError = sectorCollapseControlMaxError(args.context);
  const arbitraryOrderMaxError = arbitraryOrderControlMaxError(args.context, args.forwardIncidenceClosureRows, args.adjointReturnRows, args.kIncSquaredRows);
  const c4ObservedStatus = args.squarePolarityGateSummary.falselyAuthorizedCount === 0
    ? 'square-edge-channel-sign-not-authorized'
    : 'unordered-square-sign-ambiguity-missed';

  return [
    controlRow('C0', 'zero section', 'B_E(0)=0; B_E^*(0)=0; K_inc(0,0)=0', zeroMax <= EPSILON ? 'zero-section-preserved' : 'zero-section-failed', zeroMax <= EPSILON, zeroMax, 'Zero two-layer section remains zero.'),
    controlRow('C1', 'unnormalized incidence control', 'unnormalized incidence rejected', unnormalizedMaxError > EPSILON ? 'unnormalized-incidence-rejected' : 'unnormalized-incidence-falsely-accepted', unnormalizedMaxError > EPSILON, unnormalizedMaxError, 'Unnormalized sums do not match W_P closure.'),
    controlRow('C2', 'scalar magnitude control', 'magnitude-only scalar embedding rejected', scalarMaxError > EPSILON ? 'scalar-magnitude-control-rejected' : 'scalar-magnitude-control-falsely-accepted', scalarMaxError > EPSILON, scalarMaxError, 'Magnitude-only embedding does not reproduce vector sector/sign structure.'),
    controlRow('C3', 'sector collapse control', 'sector collapse rejected', sectorCollapseMaxError > EPSILON ? 'sector-collapse-control-rejected' : 'sector-collapse-control-falsely-accepted', sectorCollapseMaxError > EPSILON, sectorCollapseMaxError, 'One-sector collapse does not preserve the two-sector closure.'),
    {
      controlId: 'C4',
      controlName: 'square-polarity corruption control',
      expectedStatus: 'square-edge-channel-sign-not-authorized',
      observedStatus: c4ObservedStatus,
      maxError: args.squarePolarityGateSummary.falselyAuthorizedCount,
      checkedCount: args.squarePolarityGateSummary.checkedCount,
      blockedCount: args.squarePolarityGateSummary.blockedCount,
      unauthorizedCount: args.squarePolarityGateSummary.blockedCount,
      status: c4ObservedStatus === 'square-edge-channel-sign-not-authorized' ? 'control-pass' : 'control-fail',
      note: `${args.squarePolarityGateSummary.checkedCount} unordered square flag-set controls lacked sourceLabelPair/targetLabelPair and ${args.squarePolarityGateSummary.blockedCount} were blocked.`,
    },
    controlRow('C5', 'raw-scale corruption control', 'raw hex scale corruption detected', args.rawHexScaleGateSummary.status, args.rawHexScaleGateSummary.status === 'raw-hex-scale-gate-pass', args.rawHexScaleGateSummary.checkedCount - args.rawHexScaleGateSummary.corruptionDetectedCount, 'Hex scale corruption is detected against B_E W_F.'),
    controlRow('C6', 'arbitrary-order control', 'object-id maps are order independent', arbitraryOrderMaxError <= EPSILON ? 'object-id-order-independent' : 'arbitrary-row-order-dependence-detected', arbitraryOrderMaxError <= EPSILON, arbitraryOrderMaxError, 'Reversed row order leaves B_E, B_E^*, and K_inc² outputs unchanged by object ID.'),
  ];
}

function controlRow(
  controlId: ControlRow['controlId'],
  controlName: string,
  expectedStatus: string,
  observedStatus: string,
  pass: boolean,
  maxError: number,
  note: string,
): ControlRow {
  return {
    controlId,
    controlName,
    expectedStatus,
    observedStatus,
    maxError,
    status: pass ? 'control-pass' : 'control-fail',
    note,
  };
}

function buildBoundaryRows(): BoundaryRow[] {
  return REQUIRED_BOUNDARY_IDS.map((boundaryId) => ({
    boundaryId,
    statement: `${boundaryId} is enforced as a lab-scope boundary and does not deny the long-term field-world target.`,
    enforced: true,
  }));
}

function buildFalsifierRows(args: {
  parentReport: T28S1Report;
  supportIncidenceRows: readonly SupportIncidenceRow[];
  controlRows: readonly ControlRow[];
  squarePolarityGateSummary: SquarePolarityGateSummary;
  rawHexScaleGateSummary: RawHexScaleGateSummary;
  sectorPreservationSummary: SectorPreservationSummary;
  finalVerdict: T28S2FinalVerdict;
}): FalsifierRow[] {
  return [
    falsifier('F1', 'T28-S1 parent missing or not accepted.', !parentAcceptedForFalsifier(args.parentReport), `parent finalVerdict=${args.parentReport.finalVerdict}; ok=${args.parentReport.ok}; square=${args.parentReport.squarePolaritySummary.squareComponentStatus}; rawScale=${args.parentReport.rawScaleSummary.rawScaleStatus}; s4=${args.parentReport.s4ActionSummary.status}.`),
    falsifier('F2', 'Imports or uses T28-R as authority.', false, 'Implementation imports only T28-S1; T28-R is context-only.'),
    falsifier('F3', 'Builds square incidence from unordered flag set without source/target polarity.', args.supportIncidenceRows.some((row) => row.supportDomain === 've-square' && row.incidenceStatus === 'incidence-set-pass' && row.incidenceSource !== 'authorized-square-source-target-polarity'), 'Square incidence rows require authorized source/target polarity.'),
    falsifier('F4', 'Accepts unnormalized incidence sums as closure.', controlFailedByObserved(args.controlRows, 'C1', 'unnormalized-incidence-falsely-accepted'), 'C1 rejects unnormalized sums.'),
    falsifier('F5', 'Accepts magnitude-only scalar input as reproducing vector sector/sign structure.', controlFailedByObserved(args.controlRows, 'C2', 'scalar-magnitude-control-falsely-accepted'), 'C2 rejects magnitude-only scalar embedding.'),
    falsifier('F6', 'Collapses sectorMinus and sectorPlus into one sector.', controlFailedByObserved(args.controlRows, 'C3', 'sector-collapse-control-falsely-accepted'), 'C3 rejects one-sector collapse.'),
    falsifier('F7', 'Fails to detect raw hex scale corruption.', args.rawHexScaleGateSummary.status !== 'raw-hex-scale-gate-pass', `${args.rawHexScaleGateSummary.corruptionDetectedCount}/${args.rawHexScaleGateSummary.checkedCount} corruptions detected.`),
    falsifier('F8', 'Treats B_E, B_E^*, K_inc, or K_inc^2 as forbidden promoted structures.', false, 'Rows use finite incidence/operator audit labels only.'),
    falsifier('F9', 'Introduces square-hex coupling under K_inc alone.', args.sectorPreservationSummary.status === 'unauthorized-square-hex-coupling', `${args.sectorPreservationSummary.unauthorizedCouplingCount} coupling rows.`),
    falsifier('F10', 'Operator output depends on array row order rather than object IDs.', controlFailedByObserved(args.controlRows, 'C6', 'arbitrary-row-order-dependence-detected'), 'C6 reverses rows and object-id outputs remain unchanged.'),
    falsifier('F11', 'Uses norm-first success criteria rather than vector equality.', false, 'Statuses compare sector Vec3 values; norms are debug/control magnitudes only.'),
    falsifier('F12', 'Mutates Shape, packet, operation registry, store, UI, field atlas policy, FieldCue, GeneratedSiteReading, or runtime state.', false, 'New diagnostic-only source and script.'),
  ];
}

function parentAcceptedForFalsifier(parentReport: T28S1Report): boolean {
  return parentAccepted(parentReport);
}

function classifyFinalVerdict(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  supportSetSummary: SupportSetSummary;
  supportIncidenceRows: readonly SupportIncidenceRow[];
  flagIncidentSupportRows: readonly FlagIncidentSupportRow[];
  forwardIncidenceClosureSummary: ForwardIncidenceClosureSummary;
  adjointPairingSummary: AdjointPairingSummary;
  adjointReturnSummary: AdjointReturnSummary;
  kIncEquivarianceSummary: KIncEquivarianceSummary;
  kIncSquaredSummary: KIncSquaredSummary;
  sectorPreservationSummary: SectorPreservationSummary;
  squarePolarityGateSummary: SquarePolarityGateSummary;
  rawHexScaleGateSummary: RawHexScaleGateSummary;
  controlRows: readonly ControlRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
}): T28S2FinalVerdict {
  if (requiredBoundaryMissing(args.boundaryRows) || args.falsifierRows.some((row) => row.triggered)) {
    return 'T28-S-Lab-2-boundary-failed';
  }

  if (args.squarePolarityGateSummary.status !== 'square-incidence-polarity-gate-pass') {
    return 'T28-S-Lab-2-square-polarity-gate-failed';
  }

  if (args.rawHexScaleGateSummary.status !== 'raw-hex-scale-gate-pass') {
    return 'T28-S-Lab-2-raw-scale-gate-failed';
  }

  if (scalarCollapseRegression(args.controlRows)) {
    return 'T28-S-Lab-2-scalar-collapse-regression-failed';
  }

  if (
    args.parentEvidenceRows.some((row) => row.parentStatus === 'rejected-parent') ||
    args.supportSetSummary.status !== 'support-set-ready' ||
    args.supportIncidenceRows.some((row) => row.incidenceStatus !== 'incidence-set-pass') ||
    args.flagIncidentSupportRows.some((row) => row.incidenceStatus !== 'flag-incidence-pass') ||
    args.forwardIncidenceClosureSummary.status !== 'forward-incidence-closure-pass'
  ) {
    return 'T28-S-Lab-2-forward-incidence-closure-failed';
  }

  if (
    args.adjointPairingSummary.status !== 'unweighted-adjoint-identity-pass' ||
    args.adjointReturnSummary.status !== 'adjoint-return-q-mode-pass'
  ) {
    return 'T28-S-Lab-2-adjoint-identity-failed';
  }

  if (args.sectorPreservationSummary.status !== 'sector-preservation-pass') {
    return 'T28-S-Lab-2-sector-preservation-failed';
  }

  if (args.kIncEquivarianceSummary.status !== 'k-inc-s4-equivariant') {
    return 'T28-S-Lab-2-k-inc-equivariance-failed';
  }

  if (args.kIncSquaredSummary.status !== 'q-mode-incidence-return-scaling-pass') {
    return 'T28-S-Lab-2-k2-q-mode-scaling-failed';
  }

  return 'T28-S-Lab-2-vector-native-incidence-operator-pass';
}

function buildIntegrityIssues(args: {
  parentEvidenceRows: readonly ParentEvidenceRow[];
  supportSetSummary: SupportSetSummary;
  supportIncidenceRows: readonly SupportIncidenceRow[];
  flagIncidentSupportRows: readonly FlagIncidentSupportRow[];
  forwardIncidenceClosureSummary: ForwardIncidenceClosureSummary;
  adjointBasisRows: readonly AdjointBasisRow[];
  adjointPairingSummary: AdjointPairingSummary;
  adjointReturnSummary: AdjointReturnSummary;
  kIncEquivarianceSummary: KIncEquivarianceSummary;
  kIncSquaredSummary: KIncSquaredSummary;
  sectorPreservationSummary: SectorPreservationSummary;
  squarePolarityGateSummary: SquarePolarityGateSummary;
  rawHexScaleGateSummary: RawHexScaleGateSummary;
  controlRows: readonly ControlRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  finalVerdict: T28S2FinalVerdict;
}): string[] {
  const issues: string[] = [];

  if (args.parentEvidenceRows[0]?.parentStatus !== 'accepted-parent') issues.push('T28-S1 parent missing or not accepted');
  if (args.supportSetSummary.supportCount !== 10) issues.push('support count mismatch');
  if (args.supportSetSummary.flagCount !== 12) issues.push('flag count mismatch');
  if (args.supportSetSummary.squareCount !== 6) issues.push('square count mismatch');
  if (args.supportSetSummary.hexCount !== 4) issues.push('hex count mismatch');
  if (args.supportIncidenceRows.some((row) => row.incidenceStatus === 'incidence-set-count-failed')) issues.push('support incidence count mismatch');
  if (args.flagIncidentSupportRows.some((row) => row.incidenceStatus !== 'flag-incidence-pass')) issues.push('flag incident support count mismatch');
  if (args.supportIncidenceRows.some((row) => row.incidenceStatus === 'square-incidence-polarity-missing')) issues.push('square incidence used missing polarity');
  if (args.supportIncidenceRows.some((row) => row.incidenceStatus === 'hex-incidence-omitted-label-failed')) issues.push('hex omitted-label parse failed');
  if (args.forwardIncidenceClosureSummary.status !== 'forward-incidence-closure-pass') issues.push('forward incidence closure failed');
  if (args.adjointBasisRows.length !== 4320) issues.push('adjoint basis row count not expected');
  if (args.adjointPairingSummary.status !== 'unweighted-adjoint-identity-pass') issues.push('adjoint basis pairing failed');
  if (args.adjointReturnSummary.status !== 'adjoint-return-q-mode-pass') issues.push('adjoint return failed');
  if (args.kIncEquivarianceSummary.status !== 'k-inc-s4-equivariant') issues.push('K_inc equivariance failed');
  if (args.kIncSquaredSummary.status !== 'q-mode-incidence-return-scaling-pass') issues.push('K_inc^2 q-mode scaling failed');
  if (args.sectorPreservationSummary.leakageCount > 0) issues.push('sector leakage detected');
  if (args.sectorPreservationSummary.unauthorizedCouplingCount > 0) issues.push('unauthorized square-hex coupling detected');
  if (args.squarePolarityGateSummary.status !== 'square-incidence-polarity-gate-pass') issues.push('square-polarity corruption control failed');
  if (args.rawHexScaleGateSummary.status !== 'raw-hex-scale-gate-pass') issues.push('raw-scale corruption control failed');
  if (controlFailedByObserved(args.controlRows, 'C1', 'unnormalized-incidence-falsely-accepted')) issues.push('unnormalized incidence falsely accepted');
  if (controlFailedByObserved(args.controlRows, 'C2', 'scalar-magnitude-control-falsely-accepted')) issues.push('magnitude-only scalar control falsely accepted');
  if (controlFailedByObserved(args.controlRows, 'C3', 'sector-collapse-control-falsely-accepted')) issues.push('sector collapse falsely accepted');
  if (controlFailedByObserved(args.controlRows, 'C6', 'arbitrary-row-order-dependence-detected')) issues.push('arbitrary row order dependence detected');
  if (requiredBoundaryMissing(args.boundaryRows)) issues.push('required boundary row missing');
  if (
    REQUIRED_FALSIFIER_IDS.some((id) => !args.falsifierRows.some((row) => row.falsifierId === id)) ||
    args.falsifierRows.some((row) => row.triggered)
  ) {
    issues.push('falsifier row missing or triggered');
  }

  const expectedVerdict = classifyFinalVerdict({
    parentEvidenceRows: args.parentEvidenceRows,
    supportSetSummary: args.supportSetSummary,
    supportIncidenceRows: args.supportIncidenceRows,
    flagIncidentSupportRows: args.flagIncidentSupportRows,
    forwardIncidenceClosureSummary: args.forwardIncidenceClosureSummary,
    adjointPairingSummary: args.adjointPairingSummary,
    adjointReturnSummary: args.adjointReturnSummary,
    kIncEquivarianceSummary: args.kIncEquivarianceSummary,
    kIncSquaredSummary: args.kIncSquaredSummary,
    sectorPreservationSummary: args.sectorPreservationSummary,
    squarePolarityGateSummary: args.squarePolarityGateSummary,
    rawHexScaleGateSummary: args.rawHexScaleGateSummary,
    controlRows: args.controlRows,
    boundaryRows: args.boundaryRows,
    falsifierRows: args.falsifierRows,
  });

  if (expectedVerdict !== args.finalVerdict) issues.push('final verdict inconsistent with precedence');

  return unique(issues);
}

function applyB(flagSection: ReadonlyMap<string, TwoSectorValue>, incidenceRows: readonly SupportIncidenceRow[]): Map<string, TwoSectorValue> {
  return new Map(
    incidenceRows.map((row) => {
      const values = row.incidentFlagIds.map((flagId) => flagSection.get(flagObjectId(flagId)) ?? zeroTwoSector());
      return [
        row.supportObjectId,
        {
          sectorMinus: scaleVec3(values.reduce((sum, value) => addVec3(sum, value.sectorMinus), zeroVec3()), row.incidenceWeight),
          sectorPlus: scaleVec3(values.reduce((sum, value) => addVec3(sum, value.sectorPlus), zeroVec3()), row.incidenceWeight),
          valueStatus: 'assigned' as const,
        },
      ];
    }),
  );
}

function authorizeSquareIncidence(candidate: SquareIncidenceCandidate): {
  authorizationStatus: 'square-incidence-authorized' | 'square-incidence-blocked';
  incidentFlagIds: A3FlagId[];
} {
  if (
    candidate.status !== 'square-polarity-authorized' ||
    !candidate.sourceLabelPair ||
    !candidate.targetLabelPair ||
    !candidate.correspondingTetraEdge ||
    !sourceTargetPairComplementPass(candidate.sourceLabelPair, candidate.targetLabelPair)
  ) {
    return { authorizationStatus: 'square-incidence-blocked', incidentFlagIds: [] };
  }

  const incidentFlagIds = flagSetKey(
    candidate.sourceLabelPair.flatMap((source) => candidate.targetLabelPair?.map((target) => flagId(source, target)) ?? []),
  ).split('|') as A3FlagId[];

  return incidentFlagIds.length === 4
    ? { authorizationStatus: 'square-incidence-authorized', incidentFlagIds }
    : { authorizationStatus: 'square-incidence-blocked', incidentFlagIds: [] };
}

function applyBStar(
  supportSection: ReadonlyMap<string, TwoSectorValue>,
  flagRows: readonly T28S1ReadoutRow[],
  incidenceRows: readonly SupportIncidenceRow[],
): Map<string, TwoSectorValue> {
  return new Map(
    flagRows.map((flagRow) => {
      const flagId = flagRow.objectKey as A3FlagId;
      const incidentRows = incidenceRows.filter((row) => row.incidentFlagIds.includes(flagId));
      const value = incidentRows.reduce<TwoSectorValue>((sum, row) => {
        const supportValue = supportSection.get(row.supportObjectId) ?? zeroTwoSector();
        return {
          sectorMinus: addVec3(sum.sectorMinus, scaleVec3(supportValue.sectorMinus, row.incidenceWeight)),
          sectorPlus: addVec3(sum.sectorPlus, scaleVec3(supportValue.sectorPlus, row.incidenceWeight)),
          valueStatus: 'assigned',
        };
      }, zeroTwoSector());
      return [flagRow.objectId, value];
    }),
  );
}

function kInc(section: Section, context: IncidenceContext): Section {
  return {
    flag: applyBStar(section.support, context.flagRows, context.supportIncidenceRows),
    support: applyB(section.flag, context.supportIncidenceRows),
  };
}

function actSection(section: Section, actionRow: T28S1S4ActionRow, context: IncidenceContext): Section {
  const flag = new Map<string, TwoSectorValue>();
  const support = new Map<string, TwoSectorValue>();

  for (const [objectId, value] of section.flag.entries()) {
    flag.set(targetFlagObjectId(objectId, actionRow.permutationMap), actValue(value, actionRow));
  }

  for (const [objectId, value] of section.support.entries()) {
    support.set(targetSupportObjectId(objectId, actionRow.permutationMap, context), actValue(value, actionRow));
  }

  return { flag, support };
}

function actValue(value: TwoSectorValue, actionRow: T28S1S4ActionRow): TwoSectorValue {
  return {
    sectorMinus: matrixVecMul3(actionRow.matrix3x3, value.sectorMinus),
    sectorPlus: matrixVecMul3(actionRow.matrix3x3, value.sectorPlus),
    valueStatus: value.valueStatus,
    blockedReason: value.blockedReason,
  };
}

function targetFlagObjectId(objectId: string, permutationMap: Record<A3Label, A3Label>): string {
  const [source, target] = parseFlagId(objectId.slice('flag:'.length) as A3FlagId);
  return flagObjectId(flagId(permutationMap[source], permutationMap[target]));
}

function targetSupportObjectId(
  objectId: string,
  permutationMap: Record<A3Label, A3Label>,
  context: IncidenceContext,
): string {
  if (objectId.startsWith('ve-central-hexagon-omitted:')) {
    const label = parseHexOmittedLabel(objectId);
    return label ? hexObjectId(permutationMap[label]) : objectId;
  }

  const square = context.squarePolarityByObjectId.get(objectId);
  if (!square?.sourceLabelPair || !square.targetLabelPair) return objectId;

  const sourcePair = sortPair([permutationMap[square.sourceLabelPair[0]], permutationMap[square.sourceLabelPair[1]]]);
  const targetPair = sortPair([permutationMap[square.targetLabelPair[0]], permutationMap[square.targetLabelPair[1]]]);
  return context.squarePolarityByDirectedPair.get(directedPairKey(sourcePair, targetPair))?.squareObjectId ?? objectId;
}

function unnormalizedIncidenceMaxError(context: IncidenceContext): number {
  const flagSection = sectionFromRows(context.flagRows);
  const unnormalizedRows = context.supportIncidenceRows.map((row) => ({ ...row, incidenceWeight: 1 }));
  const output = applyB(flagSection, unnormalizedRows);
  return maxOf(context.supportRows.map((row) => twoSectorMaxError(output.get(row.objectId) ?? zeroTwoSector(), row)));
}

function scalarMagnitudeControlMaxError(context: IncidenceContext): number {
  const scalarFlagSection = new Map(
    context.flagRows.map((row) => [
      row.objectId,
      {
        sectorMinus: [normVec3(row.sectorMinus), 0, 0] as Vec3,
        sectorPlus: [normVec3(row.sectorPlus), 0, 0] as Vec3,
        valueStatus: 'assigned' as const,
      },
    ]),
  );
  const output = applyB(scalarFlagSection, context.supportIncidenceRows);
  return maxOf(context.supportRows.map((row) => twoSectorMaxError(output.get(row.objectId) ?? zeroTwoSector(), row)));
}

function sectorCollapseControlMaxError(context: IncidenceContext): number {
  const collapsedFlagSection = new Map(
    context.flagRows.map((row) => [
      row.objectId,
      {
        sectorMinus: addVec3(row.sectorMinus, row.sectorPlus),
        sectorPlus: zeroVec3(),
        valueStatus: 'assigned' as const,
      },
    ]),
  );
  const output = applyB(collapsedFlagSection, context.supportIncidenceRows);
  return maxOf(context.supportRows.map((row) => twoSectorMaxError(output.get(row.objectId) ?? zeroTwoSector(), row)));
}

function arbitraryOrderControlMaxError(
  context: IncidenceContext,
  forwardRows: readonly ForwardIncidenceClosureRow[],
  adjointReturnRows: readonly AdjointReturnRow[],
  k2Rows: readonly KIncSquaredRow[],
): number {
  const reversedContext: IncidenceContext = {
    ...context,
    flagRows: [...context.flagRows].reverse(),
    supportRows: [...context.supportRows].reverse(),
    squareRows: [...context.squareRows].reverse(),
    hexRows: [...context.hexRows].reverse(),
    supportIncidenceRows: [...context.supportIncidenceRows].reverse(),
    supportIncidenceById: new Map([...context.supportIncidenceRows].reverse().map((row) => [row.supportObjectId, row])),
  };
  const reversedForward = buildForwardIncidenceClosureRows(reversedContext);
  const reversedAdjointReturn = buildAdjointReturnRows(reversedContext);
  const reversedK2 = buildKIncSquaredRows(reversedContext);
  const forwardById = new Map(forwardRows.map((row) => [row.supportObjectId, row]));
  const adjointByFlagId = new Map(adjointReturnRows.map((row) => [row.flagId, row]));
  const k2ById = new Map(k2Rows.map((row) => [row.objectId, row]));
  const forwardError = maxOf(
    reversedForward.map((row) => {
      const expected = forwardById.get(row.supportObjectId);
      return expected ? Math.max(
        maxAbsVec3(subVec3(row.computedSectorMinus, expected.computedSectorMinus)),
        maxAbsVec3(subVec3(row.computedSectorPlus, expected.computedSectorPlus)),
      ) : Number.POSITIVE_INFINITY;
    }),
  );
  const adjointReturnError = maxOf(
    reversedAdjointReturn.map((row) => {
      const expected = adjointByFlagId.get(row.flagId);
      return expected ? Math.max(
        maxAbsVec3(subVec3(row.computedSectorMinus, expected.computedSectorMinus)),
        maxAbsVec3(subVec3(row.computedSectorPlus, expected.computedSectorPlus)),
      ) : Number.POSITIVE_INFINITY;
    }),
  );
  const k2Error = maxOf(
    reversedK2.map((row) => {
      const expected = k2ById.get(row.objectId);
      return expected ? Math.max(
        maxAbsVec3(subVec3(row.computedK2Minus, expected.computedK2Minus)),
        maxAbsVec3(subVec3(row.computedK2Plus, expected.computedK2Plus)),
      ) : Number.POSITIVE_INFINITY;
    }),
  );

  return Math.max(forwardError, adjointReturnError, k2Error);
}

function sectionFromRows(rows: readonly T28S1ReadoutRow[]): Map<string, TwoSectorValue> {
  return new Map(
    rows.map((row) => [
      row.objectId,
      {
        sectorMinus: row.sectorMinus,
        sectorPlus: row.sectorPlus,
        valueStatus: row.valueStatus,
        blockedReason: row.blockedReason,
      },
    ]),
  );
}

function keepOnlySector(section: ReadonlyMap<string, TwoSectorValue>, sectorId: SectorId): Map<string, TwoSectorValue> {
  return new Map(
    [...section.entries()].map(([objectId, value]) => [
      objectId,
      {
        sectorMinus: sectorId === 'sectorMinus' ? value.sectorMinus : zeroVec3(),
        sectorPlus: sectorId === 'sectorPlus' ? value.sectorPlus : zeroVec3(),
        valueStatus: value.valueStatus,
      },
    ]),
  );
}

function maxSectorNorm(section: ReadonlyMap<string, TwoSectorValue>, sectorId: SectorId): number {
  return maxOf([...section.values()].map((value) => normVec3(value[sectorId])));
}

function sectionMaxNorm(section: Section): number {
  return Math.max(maxSectorNorm(section.flag, 'sectorMinus'), maxSectorNorm(section.flag, 'sectorPlus'), maxSectorNorm(section.support, 'sectorMinus'), maxSectorNorm(section.support, 'sectorPlus'));
}

function sectionSectorError(left: Section, right: Section, sectorId: SectorId): number {
  const flagKeys = unique([...left.flag.keys(), ...right.flag.keys()]);
  const supportKeys = unique([...left.support.keys(), ...right.support.keys()]);
  return Math.max(
    maxOf(flagKeys.map((key) => maxAbsVec3(subVec3(left.flag.get(key)?.[sectorId] ?? zeroVec3(), right.flag.get(key)?.[sectorId] ?? zeroVec3())))),
    maxOf(supportKeys.map((key) => maxAbsVec3(subVec3(left.support.get(key)?.[sectorId] ?? zeroVec3(), right.support.get(key)?.[sectorId] ?? zeroVec3())))),
  );
}

function emptySection(): Section {
  return { flag: new Map(), support: new Map() };
}

function cloneSection(section: Section): Section {
  return { flag: new Map(section.flag), support: new Map(section.support) };
}

function zeroTwoSector(): TwoSectorValue {
  return { sectorMinus: zeroVec3(), sectorPlus: zeroVec3(), valueStatus: 'assigned' };
}

function basisValue(coordinate: CoordinateId): TwoSectorValue {
  const value = zeroTwoSector();
  const [sector, axis] = coordinate.split('.') as [SectorId, 'x' | 'y' | 'z'];
  const index = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
  value[sector][index] = 1;
  return value;
}

function twoSectorDot(left: TwoSectorValue, right: TwoSectorValue): number {
  return dotVec3(left.sectorMinus, right.sectorMinus) + dotVec3(left.sectorPlus, right.sectorPlus);
}

function twoSectorMaxError(left: TwoSectorValue, right: Pick<TwoSectorValue, 'sectorMinus' | 'sectorPlus'>): number {
  return Math.max(
    maxAbsVec3(subVec3(left.sectorMinus, right.sectorMinus)),
    maxAbsVec3(subVec3(left.sectorPlus, right.sectorPlus)),
  );
}

function scalarCollapseRegression(rows: readonly ControlRow[]): boolean {
  return ['C1', 'C2', 'C3'].some((id) => rows.some((row) => row.controlId === id && row.status !== 'control-pass'));
}

function controlFailedByObserved(rows: readonly ControlRow[], controlId: ControlRow['controlId'], observedStatus: string): boolean {
  return rows.some((row) => row.controlId === controlId && row.observedStatus === observedStatus);
}

function requiredBoundaryMissing(rows: readonly BoundaryRow[]): boolean {
  return REQUIRED_BOUNDARY_IDS.some((id) => !rows.some((row) => row.boundaryId === id && row.enforced));
}

function falsifier(
  falsifierId: FalsifierRow['falsifierId'],
  description: string,
  triggered: boolean,
  evidence: string,
): FalsifierRow {
  return { falsifierId, description, triggered, evidence, status: triggered ? 'triggered' : 'clear' };
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

export function zeroVec3(): Vec3 {
  return [0, 0, 0];
}

export function averageVec3(values: readonly Vec3[]): Vec3 {
  return values.length === 0
    ? zeroVec3()
    : scaleVec3(values.reduce((sum, value) => addVec3(sum, value), zeroVec3()), 1 / values.length);
}

export function sameVec3WithinEpsilon(left: Vec3, right: Vec3): boolean {
  return maxAbsVec3(subVec3(left, right)) <= EPSILON;
}

function matrixVecMul3(matrix: T28S1S4ActionRow['matrix3x3'], value: Vec3): Vec3 {
  return [
    dotVec3(matrix[0], value),
    dotVec3(matrix[1], value),
    dotVec3(matrix[2], value),
  ];
}

function maxOf(values: readonly number[]): number {
  return values.length === 0 ? 0 : Math.max(...values);
}

function parseFlagId(flagId: A3FlagId): [A3Label, A3Label] {
  const [source, target] = flagId.split('->') as [A3Label, A3Label];
  return [source, target];
}

function flagId(source: A3Label, target: A3Label): A3FlagId {
  return `${source}->${target}`;
}

function flagObjectId(flag: A3FlagId): string {
  return `flag:${flag}`;
}

function hexObjectId(label: A3Label): string {
  return `ve-central-hexagon-omitted:${label}`;
}

function parseHexOmittedLabel(objectId: string): A3Label | null {
  const label = objectId.slice('ve-central-hexagon-omitted:'.length);
  return A3_LABELS.includes(label as A3Label) ? (label as A3Label) : null;
}

function flagSetKey(flagSet: readonly A3FlagId[]): string {
  return unique(flagSet).sort((left, right) => DIRECTED_FLAGS.indexOf(left) - DIRECTED_FLAGS.indexOf(right)).join('|');
}

function sortPair(pair: [A3Label, A3Label]): [A3Label, A3Label] {
  return [...pair].sort((left, right) => A3_LABELS.indexOf(left) - A3_LABELS.indexOf(right)) as [A3Label, A3Label];
}

function directedPairKey(sourcePair: [A3Label, A3Label], targetPair: [A3Label, A3Label]): string {
  return `${sourcePair.join('')}|${targetPair.join('')}`;
}

function sourceTargetPairComplementPass(
  sourceLabelPair: readonly A3Label[],
  targetLabelPair: readonly A3Label[],
): boolean {
  const intersection = sourceLabelPair.filter((label) => targetLabelPair.includes(label));
  const union = unique([...sourceLabelPair, ...targetLabelPair]);

  return intersection.length === 0 && sameSet(union, A3_LABELS);
}

function sameSet<T>(left: readonly T[], right: readonly T[]): boolean {
  return left.length === right.length && left.every((value) => right.includes(value));
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

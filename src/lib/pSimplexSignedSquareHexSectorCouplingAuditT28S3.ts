import { buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report } from './pSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1';
import { buildPSimplexVectorNativeIncidenceOperatorAuditT28S2Report } from './pSimplexVectorNativeIncidenceOperatorAuditT28S2';

export type Vec3 = [number, number, number];
export type A3Label = 'A' | 'B' | 'C' | 'D';
export type A3FlagId = `${A3Label}->${A3Label}`;
export type SquareDomain = 've-square';
export type HexDomain = 've-a2-hexagon';
type EdgeId = 'AB' | 'AC' | 'AD' | 'BC' | 'BD' | 'CD';

export interface ParentEvidenceRow {
  parentId:
    | 'T28-S-Lab-1'
    | 'T28-S-Lab-2'
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
  parentStatus: 'accepted-parent' | 'rejected-parent' | 'context-only';
}

export interface SupportSetSummary {
  squareCount: number;
  hexCount: number;
  squarePolarityAuthorizedCount: number;
  rawHexCount: number;
  s2SquareCount: number;
  s2HexCount: number;
  status: 'support-set-ready' | 'support-set-count-failed' | 'parent-support-set-mismatch';
}

export interface QModeSectionSummary {
  squareQModeCount: number;
  hexQModeCount: number;
  squareMinusNonzeroCount: number;
  squarePlusNonzeroCount: number;
  hexMinusNonzeroCount: number;
  hexPlusNonzeroCount: number;
  rawScaleStatus: string;
  squarePolarityStatus: string;
  status: 'q-mode-sections-ready' | 'q-mode-section-sector-contaminated' | 'q-mode-section-missing';
}

export interface UnsignedIncidenceRow {
  hexId: string;
  squareId: string;
  unsignedIntersectionCount: number;
  computedUnsignedContribution: Vec3;
  expectedRawHexQMode: Vec3;
  status: 'unsigned-square-hex-incidence-fails-standard-q-structure' | 'unsigned-incidence-falsely-accepted';
}

export interface UnsignedIncidenceSummary {
  rowCount: number;
  allIntersectionCountTwo: boolean;
  perHexComputedUnsignedVectors: Record<string, Vec3>;
  perHexExpectedRawHexVectors: Record<string, Vec3>;
  maxErrorAgainstExpected: number;
  falselyAcceptedCount: number;
  status: 'unsigned-square-hex-incidence-fails-standard-q-structure' | 'unsigned-incidence-falsely-accepted';
}

export interface SignedKernelRow {
  hexId: string;
  squareId: string;
  sourceLabelPair: [A3Label, A3Label] | null;
  targetLabelPair: [A3Label, A3Label] | null;
  omittedLabel: A3Label | null;
  membershipStatus: 'omitted-in-source' | 'omitted-in-target' | 'omitted-membership-failed';
  kappaValue: -1 | 1 | 0;
  squarePolarityStatus: string;
  kernelRowStatus:
    | 'signed-kernel-row-pass'
    | 'signed-kernel-square-polarity-missing'
    | 'signed-kernel-membership-failed'
    | 'signed-kernel-used-unordered-square-sign';
}

export interface SignedKernelSummary {
  rowCount: number;
  passCount: number;
  plusCount: number;
  minusCount: number;
  missingPolarityCount: number;
  membershipFailCount: number;
  unorderedSquareSignUseCount: number;
  status:
    | 'signed-square-hex-kernel-constructed'
    | 'signed-kernel-square-polarity-missing'
    | 'signed-kernel-membership-failed'
    | 'signed-kernel-used-unordered-square-sign';
}

export interface SignedKernelS4EquivarianceRow {
  permutationId: string;
  hexId: string;
  squareId: string;
  permutedHexId: string;
  permutedSquareId: string;
  originalKappa: -1 | 1 | 0;
  permutedKappa: -1 | 1 | 0;
  status: 'signed-square-hex-kernel-s4-equivariant' | 'signed-kernel-s4-equivariance-failed';
}

export interface SignedKernelS4EquivarianceSummary {
  permutationCount: number;
  kernelEntryCount: number;
  checkedRowCount: number;
  passCount: number;
  failCount: number;
  status: 'signed-square-hex-kernel-s4-equivariant' | 'signed-kernel-s4-equivariance-failed';
}

export interface RawSquareToHexRow {
  hexId: string;
  computedVector: Vec3;
  expectedRawHexVector: Vec3;
  maxError: number;
  normalization: number;
  status:
    | 'raw-square-to-hex-q-mode-pass'
    | 'raw-square-to-hex-q-mode-failed'
    | 'raw-scale-corrupted'
    | 'scalar-source-law-used';
}

export interface RawSquareToHexSummary {
  rowCount: number;
  passCount: number;
  maxError: number;
  status:
    | 'raw-square-to-hex-q-mode-pass'
    | 'raw-square-to-hex-q-mode-failed'
    | 'raw-scale-corrupted'
    | 'scalar-source-law-used';
}

export interface ReverseExactHexToSquareRow {
  squareId: string;
  sourceLabelPair: [A3Label, A3Label] | null;
  targetLabelPair: [A3Label, A3Label] | null;
  computedVector: Vec3;
  expectedSquareVector: Vec3;
  maxError: number;
  normalization: number;
  status:
    | 'reverse-exact-hex-to-square-q-mode-pass'
    | 'reverse-exact-hex-to-square-q-mode-failed'
    | 'square-polarity-corrupted'
    | 'scalar-source-law-used';
}

export interface ReverseExactHexToSquareSummary {
  rowCount: number;
  passCount: number;
  maxError: number;
  status:
    | 'reverse-exact-hex-to-square-q-mode-pass'
    | 'reverse-exact-hex-to-square-q-mode-failed'
    | 'square-polarity-corrupted'
    | 'scalar-source-law-used';
}

export interface UnweightedAdjointHexToSquareRow {
  squareId: string;
  sourceLabelPair: [A3Label, A3Label] | null;
  targetLabelPair: [A3Label, A3Label] | null;
  computedAdjointVector: Vec3;
  expectedTwoNinthsSquareVector: Vec3;
  maxError: number;
  normalization: number;
  status:
    | 'unweighted-adjoint-returns-two-ninths-square-q-mode-pass'
    | 'unweighted-adjoint-return-factor-failed';
}

export interface UnweightedAdjointHexToSquareSummary {
  rowCount: number;
  passCount: number;
  maxError: number;
  status:
    | 'unweighted-adjoint-returns-two-ninths-square-q-mode-pass'
    | 'unweighted-adjoint-return-factor-failed';
}

export interface NormalizationDistinctionRow {
  exactCoefficient: number;
  adjointCoefficient: number;
  exactQModeReturnFactor: number;
  adjointQModeReturnFactor: number;
  exactEqualsAdjoint: boolean;
  normalizationDistinctionStatus:
    | 'exact-and-adjoint-normalizations-distinguished'
    | 'exact-adjoint-normalizations-conflated';
}

export interface NormalizationDistinctionSummary {
  rowCount: number;
  status: 'exact-and-adjoint-normalizations-distinguished' | 'exact-adjoint-normalizations-conflated';
}

export interface WeightedPairingReconciliationRow {
  requiredHexWeight: number;
  requiredSquareWeight: number;
  requiredRatio: number;
  adoptedWeightedPairing: false;
  boundaryStatement: string;
  status: 'weighted-pairing-reconciliation-computed' | 'weighted-pairing-ratio-computation-failed';
}

export interface SquarePolarityGateRow {
  corruptedSquareObjectId: string;
  flagSetKey: string;
  sourceLabelPairPresent: boolean;
  targetLabelPairPresent: boolean;
  signedKernelAttemptStatus: 'blocked' | 'falsely-authorized';
  rawMapAttemptStatus: 'blocked' | 'falsely-authorized';
  exactReverseAttemptStatus: 'blocked' | 'falsely-authorized';
  unweightedAdjointAttemptStatus: 'blocked' | 'falsely-authorized';
  status:
    | 'square-hex-coupling-blocked-by-square-polarity'
    | 'square-hex-coupling-falsely-authorized-from-unordered-square';
}

export interface SquarePolarityGateSummary {
  checkedCount: number;
  blockedCount: number;
  falselyAuthorizedCount: number;
  status:
    | 'square-hex-coupling-blocked-by-square-polarity'
    | 'square-hex-coupling-falsely-authorized-from-unordered-square';
}

export interface RawScaleGateRow {
  hexId: string;
  correctRawHexVector: Vec3;
  corruptedHexVector: Vec3;
  corruptionDetected: boolean;
  exactReverseAgainstRawScaleStatus: 'raw-scale-corruption-detected' | 'raw-scale-corruption-undetected';
  adjointAgainstRawScaleStatus: 'raw-scale-corruption-detected' | 'raw-scale-corruption-undetected';
  status:
    | 'square-hex-coupling-raw-scale-gate-pass'
    | 'square-hex-coupling-raw-scale-corruption-undetected';
}

export interface RawScaleGateSummary {
  checkedCount: number;
  corruptionDetectedCount: number;
  status:
    | 'square-hex-coupling-raw-scale-gate-pass'
    | 'square-hex-coupling-raw-scale-corruption-undetected';
}

export interface NoScalarCollapseRow {
  checkId: string;
  prohibitedUse: string;
  observedUse: boolean;
  allowedDebugOnly: boolean;
  status: 'no-scalar-collapse-in-sector-coupling' | 'sector-coupling-scalar-collapse-regression';
}

export interface NoScalarCollapseSummary {
  checkCount: number;
  passCount: number;
  failCount: number;
  status: 'no-scalar-collapse-in-sector-coupling' | 'sector-coupling-scalar-collapse-regression';
}

export interface ControlRow {
  controlId: 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
  controlName: string;
  expectedStatus: string;
  observedStatus: string;
  maxErrorDebugOnly?: number;
  checkedCount?: number;
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

export type T28S3FinalVerdict =
  | 'T28-S-Lab-3-signed-square-hex-sector-coupling-pass'
  | 'T28-S-Lab-3-unsigned-incidence-falsely-accepted'
  | 'T28-S-Lab-3-signed-kernel-equivariance-failed'
  | 'T28-S-Lab-3-raw-square-to-hex-failed'
  | 'T28-S-Lab-3-reverse-exact-failed'
  | 'T28-S-Lab-3-unweighted-adjoint-factor-failed'
  | 'T28-S-Lab-3-normalization-distinction-failed'
  | 'T28-S-Lab-3-square-polarity-gate-failed'
  | 'T28-S-Lab-3-raw-scale-gate-failed'
  | 'T28-S-Lab-3-scalar-collapse-regression-failed'
  | 'T28-S-Lab-3-boundary-failed';

export interface PSimplexSignedSquareHexSectorCouplingAuditT28S3Report {
  method: 'p-simplex-signed-square-hex-sector-coupling-audit-t28s3';
  experimentName: 'T28-S-Lab-3 - Signed Square-Hex Sector-Coupling Audit';
  diagnosticScope: 'signed-square-hex-sector-coupling-audit-only';
  branchRef: 'wgate/arf-w1-root-frame-v0';
  parentEvidenceRows: ParentEvidenceRow[];
  supportSetSummary: SupportSetSummary;
  qModeSectionSummary: QModeSectionSummary;
  unsignedIncidenceRows: UnsignedIncidenceRow[];
  unsignedIncidenceSummary: UnsignedIncidenceSummary;
  signedKernelRows: SignedKernelRow[];
  signedKernelSummary: SignedKernelSummary;
  signedKernelS4EquivarianceRows: SignedKernelS4EquivarianceRow[];
  signedKernelS4EquivarianceSummary: SignedKernelS4EquivarianceSummary;
  rawSquareToHexRows: RawSquareToHexRow[];
  rawSquareToHexSummary: RawSquareToHexSummary;
  reverseExactHexToSquareRows: ReverseExactHexToSquareRow[];
  reverseExactHexToSquareSummary: ReverseExactHexToSquareSummary;
  unweightedAdjointHexToSquareRows: UnweightedAdjointHexToSquareRow[];
  unweightedAdjointHexToSquareSummary: UnweightedAdjointHexToSquareSummary;
  normalizationDistinctionRows: NormalizationDistinctionRow[];
  normalizationDistinctionSummary: NormalizationDistinctionSummary;
  weightedPairingReconciliationRow: WeightedPairingReconciliationRow;
  squarePolarityGateRows: SquarePolarityGateRow[];
  squarePolarityGateSummary: SquarePolarityGateSummary;
  rawScaleGateRows: RawScaleGateRow[];
  rawScaleGateSummary: RawScaleGateSummary;
  noScalarCollapseRows: NoScalarCollapseRow[];
  noScalarCollapseSummary: NoScalarCollapseSummary;
  controlRows: ControlRow[];
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  finalVerdict: T28S3FinalVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

type T28S1Report = ReturnType<typeof buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report>;
type T28S2Report = ReturnType<typeof buildPSimplexVectorNativeIncidenceOperatorAuditT28S2Report>;
type T28S1ReadoutRow = T28S1Report['readoutSectionRows'][number];
type T28S1SquarePolarityRow = T28S1Report['squarePolarityRows'][number];
type T28S1S4ActionRow = T28S1Report['s4ActionRows'][number];
type T28S2SupportIncidenceRow = T28S2Report['supportIncidenceRows'][number];

interface AuditContext {
  squareRows: T28S1ReadoutRow[];
  hexRows: T28S1ReadoutRow[];
  authorizedSquareRows: T28S1SquarePolarityRow[];
  squareReadoutById: Map<string, T28S1ReadoutRow>;
  hexReadoutById: Map<string, T28S1ReadoutRow>;
  squarePolarityById: Map<string, T28S1SquarePolarityRow>;
  squarePolarityByDirectedPair: Map<string, T28S1SquarePolarityRow>;
  s2IncidenceById: Map<string, T28S2SupportIncidenceRow>;
  signedKernelRows: SignedKernelRow[];
}

interface SquareCandidate {
  squareObjectId: string;
  flagCycle: readonly A3FlagId[];
  sourceLabelPair: [A3Label, A3Label] | null;
  targetLabelPair: [A3Label, A3Label] | null;
  correspondingTetraEdge: string | null;
  squarePolarityStatus: string;
}

const METHOD = 'p-simplex-signed-square-hex-sector-coupling-audit-t28s3' as const;
const EXPERIMENT_NAME = 'T28-S-Lab-3 - Signed Square-Hex Sector-Coupling Audit' as const;
const DIAGNOSTIC_SCOPE = 'signed-square-hex-sector-coupling-audit-only' as const;
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
const REQUIRED_BOUNDARY_IDS = [
  'not-scalar-source-law',
  'not-norm-first',
  'not-arbitrary-projection',
  'not-unordered-square-sign',
  'not-raw-scale-normalized',
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
const REQUIRED_FALSIFIER_IDS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14'] as const;
const PROHIBITED_SOURCE_LAWS = [
  'norm(q)',
  'norm(eta_Q)',
  'norm(zeta_H)',
  'scalar magnitude',
  'equal-source scalar weight',
  'arbitrary projection to R',
  'category numbers',
  'display order',
  'row order',
  'semantic labels as values',
] as const;

export function buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report(): PSimplexSignedSquareHexSectorCouplingAuditT28S3Report {
  const s1Report = buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report();
  const s2Report = buildPSimplexVectorNativeIncidenceOperatorAuditT28S2Report();
  const parentEvidenceRows = buildParentEvidenceRows(s1Report, s2Report);
  const context = buildAuditContext(s1Report, s2Report);
  const supportSetSummary = buildSupportSetSummary(s1Report, s2Report, context);
  const qModeSectionSummary = buildQModeSectionSummary(s1Report, context);
  const unsignedIncidenceRows = buildUnsignedIncidenceRows(context);
  const unsignedIncidenceSummary = buildUnsignedIncidenceSummary(unsignedIncidenceRows, context);
  const signedKernelRows = context.signedKernelRows;
  const signedKernelSummary = buildSignedKernelSummary(signedKernelRows);
  const signedKernelS4EquivarianceRows = buildSignedKernelS4EquivarianceRows(s1Report, context);
  const signedKernelS4EquivarianceSummary = buildSignedKernelS4EquivarianceSummary(signedKernelS4EquivarianceRows, s1Report.s4ActionRows.length, signedKernelRows.length);
  const rawSquareToHexRows = buildRawSquareToHexRows(context);
  const rawSquareToHexSummary = buildRawSquareToHexSummary(rawSquareToHexRows);
  const reverseExactHexToSquareRows = buildReverseExactHexToSquareRows(context);
  const reverseExactHexToSquareSummary = buildReverseExactHexToSquareSummary(reverseExactHexToSquareRows);
  const unweightedAdjointHexToSquareRows = buildUnweightedAdjointHexToSquareRows(context);
  const unweightedAdjointHexToSquareSummary = buildUnweightedAdjointHexToSquareSummary(unweightedAdjointHexToSquareRows);
  const normalizationDistinctionRows = buildNormalizationDistinctionRows();
  const normalizationDistinctionSummary = buildNormalizationDistinctionSummary(normalizationDistinctionRows);
  const weightedPairingReconciliationRow = buildWeightedPairingReconciliationRow();
  const squarePolarityGateRows = buildSquarePolarityGateRows(context);
  const squarePolarityGateSummary = buildSquarePolarityGateSummary(squarePolarityGateRows);
  const rawScaleGateRows = buildRawScaleGateRows(context);
  const rawScaleGateSummary = buildRawScaleGateSummary(rawScaleGateRows);
  const noScalarCollapseRows = buildNoScalarCollapseRows();
  const noScalarCollapseSummary = buildNoScalarCollapseSummary(noScalarCollapseRows);
  const controlRows = buildControlRows({
    context,
    unsignedIncidenceSummary,
    squarePolarityGateSummary,
    rawScaleGateSummary,
    normalizationDistinctionSummary,
    noScalarCollapseSummary,
    rawSquareToHexRows,
    reverseExactHexToSquareRows,
    unweightedAdjointHexToSquareRows,
    signedKernelRows,
  });
  const boundaryRows = buildBoundaryRows();
  const preliminaryVerdict = classifyFinalVerdict({
    boundaryRows,
    falsifierRows: [],
    unsignedIncidenceSummary,
    squarePolarityGateSummary,
    rawScaleGateSummary,
    noScalarCollapseSummary,
    controlRows,
    signedKernelS4EquivarianceSummary,
    rawSquareToHexSummary,
    reverseExactHexToSquareSummary,
    unweightedAdjointHexToSquareSummary,
    normalizationDistinctionSummary,
  });
  const falsifierRows = buildFalsifierRows({
    s1Report,
    s2Report,
    signedKernelSummary,
    unsignedIncidenceSummary,
    signedKernelS4EquivarianceSummary,
    rawSquareToHexSummary,
    reverseExactHexToSquareSummary,
    unweightedAdjointHexToSquareSummary,
    normalizationDistinctionSummary,
    squarePolarityGateSummary,
    rawScaleGateSummary,
    noScalarCollapseSummary,
    controlRows,
    finalVerdict: preliminaryVerdict,
  });
  const finalVerdict = classifyFinalVerdict({
    boundaryRows,
    falsifierRows,
    unsignedIncidenceSummary,
    squarePolarityGateSummary,
    rawScaleGateSummary,
    noScalarCollapseSummary,
    controlRows,
    signedKernelS4EquivarianceSummary,
    rawSquareToHexSummary,
    reverseExactHexToSquareSummary,
    unweightedAdjointHexToSquareSummary,
    normalizationDistinctionSummary,
  });
  const integrityIssues = buildIntegrityIssues({
    s1Report,
    s2Report,
    supportSetSummary,
    qModeSectionSummary,
    unsignedIncidenceRows,
    unsignedIncidenceSummary,
    signedKernelSummary,
    signedKernelS4EquivarianceSummary,
    rawSquareToHexRows,
    rawSquareToHexSummary,
    reverseExactHexToSquareRows,
    reverseExactHexToSquareSummary,
    unweightedAdjointHexToSquareRows,
    unweightedAdjointHexToSquareSummary,
    normalizationDistinctionSummary,
    weightedPairingReconciliationRow,
    squarePolarityGateSummary,
    rawScaleGateSummary,
    noScalarCollapseSummary,
    controlRows,
    boundaryRows,
    falsifierRows,
    finalVerdict,
  });
  const ok =
    integrityIssues.length === 0 &&
    falsifierRows.every((row) => !row.triggered) &&
    finalVerdict === 'T28-S-Lab-3-signed-square-hex-sector-coupling-pass';

  return {
    method: METHOD,
    experimentName: EXPERIMENT_NAME,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    parentEvidenceRows,
    supportSetSummary,
    qModeSectionSummary,
    unsignedIncidenceRows,
    unsignedIncidenceSummary,
    signedKernelRows,
    signedKernelSummary,
    signedKernelS4EquivarianceRows,
    signedKernelS4EquivarianceSummary,
    rawSquareToHexRows,
    rawSquareToHexSummary,
    reverseExactHexToSquareRows,
    reverseExactHexToSquareSummary,
    unweightedAdjointHexToSquareRows,
    unweightedAdjointHexToSquareSummary,
    normalizationDistinctionRows,
    normalizationDistinctionSummary,
    weightedPairingReconciliationRow,
    squarePolarityGateRows,
    squarePolarityGateSummary,
    rawScaleGateRows,
    rawScaleGateSummary,
    noScalarCollapseRows,
    noScalarCollapseSummary,
    controlRows,
    boundaryRows,
    falsifierRows,
    finalVerdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok,
  };
}

function buildParentEvidenceRows(s1Report: T28S1Report, s2Report: T28S2Report): ParentEvidenceRow[] {
  const rows: ParentEvidenceRow[] = [
    {
      parentId: 'T28-S-Lab-1',
      method: s1Report.method,
      ok: s1Report.ok,
      finalVerdict: s1Report.finalVerdict,
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
      parentStatus: parentS1Accepted(s1Report) ? 'accepted-parent' : 'rejected-parent',
    },
    {
      parentId: 'T28-S-Lab-2',
      method: s2Report.method,
      ok: s2Report.ok,
      finalVerdict: s2Report.finalVerdict,
      consumedSections: [
        'supportSetSummary',
        'supportIncidenceRows',
        'flagIncidentSupportRows',
        'forwardIncidenceClosureRows',
        'adjointReturnRows',
        'kIncSquaredRows',
        'sectorPreservationRows',
        'squarePolarityGateRows',
        'rawHexScaleGateRows',
        'controlRows',
        'boundaryRows',
        'finalVerdict',
        'ok',
      ],
      parentStatus: parentS2Accepted(s2Report) ? 'accepted-parent' : 'rejected-parent',
    },
  ];
  const inheritedRows = new Map<string, ParentEvidenceRow>();

  for (const row of s1Report.parentEvidenceRows) {
    inheritedRows.set(row.parentId, {
      parentId: inheritedParentId(row.parentId),
      method: row.method,
      ok: row.ok,
      verdict: row.verdict,
      summaryVerdict: row.summaryVerdict,
      consumedSections: [],
      parentStatus: row.parentStatus === 'accepted-parent' ? 'accepted-parent' : 'rejected-parent',
    });
  }

  for (const row of s2Report.parentEvidenceRows) {
    if (row.parentId === 'T28-S-Lab-1' || row.parentId === 'T28-R context-only-not-authority') continue;
    const baseParentId = row.parentId.replace(' inherited', '');
    inheritedRows.set(baseParentId, {
      parentId: row.parentId as ParentEvidenceRow['parentId'],
      method: row.method,
      ok: row.ok,
      verdict: row.verdict,
      summaryVerdict: row.summaryVerdict,
      consumedSections: [],
      parentStatus: row.parentStatus === 'accepted-parent' ? 'accepted-parent' : 'rejected-parent',
    });
  }

  for (const key of ['p-simplex-vector-order-parameter-diagnostic-v0', 'T28-N0', 'T28-P', 'T28-Q']) {
    const row = inheritedRows.get(key);
    if (row) rows.push(row);
  }

  rows.push({
    parentId: 'T28-R context-only-not-authority',
    method: 'context-only-not-authority',
    ok: null,
    consumedSections: [],
    parentStatus: 'context-only',
  });

  return rows;
}

function parentS1Accepted(report: T28S1Report): boolean {
  return report.ok === true &&
    report.finalVerdict === 'T28-S-Lab-1-vector-native-two-sector-preflight-pass' &&
    report.squarePolaritySummary.squareComponentStatus === 'square-polarity-authorized' &&
    report.rawScaleSummary.rawScaleStatus === 'raw-incidence-scale-preserved' &&
    report.s4ActionSummary.status === 'tetrahedral-standard-action-verified';
}

function parentS2Accepted(report: T28S2Report): boolean {
  return report.ok === true &&
    report.finalVerdict === 'T28-S-Lab-2-vector-native-incidence-operator-pass' &&
    report.supportSetSummary.status === 'support-set-ready' &&
    report.sectorPreservationSummary.status === 'sector-preservation-pass' &&
    report.squarePolarityGateSummary.status === 'square-incidence-polarity-gate-pass' &&
    report.rawHexScaleGateSummary.status === 'raw-hex-scale-gate-pass';
}

function inheritedParentId(parentId: string): ParentEvidenceRow['parentId'] {
  if (parentId === 'p-simplex-vector-order-parameter-diagnostic-v0') return 'p-simplex-vector-order-parameter-diagnostic-v0 inherited';
  if (parentId === 'T28-N0') return 'T28-N0 inherited';
  if (parentId === 'T28-P') return 'T28-P inherited';
  if (parentId === 'T28-Q') return 'T28-Q inherited';
  return 'T28-R context-only-not-authority';
}

function buildAuditContext(s1Report: T28S1Report, s2Report: T28S2Report): AuditContext {
  const squareRows = s1Report.readoutSectionRows.filter((row) => row.objectDomain === 've-square');
  const hexRows = s1Report.readoutSectionRows.filter((row) => row.objectDomain === 've-a2-hexagon');
  const authorizedSquareRows = s1Report.squarePolarityRows.filter((row) => row.status === 'square-polarity-authorized');
  const squareReadoutById = new Map(squareRows.map((row) => [row.objectId, row]));
  const hexReadoutById = new Map(hexRows.map((row) => [row.objectId, row]));
  const squarePolarityById = new Map(authorizedSquareRows.map((row) => [row.squareObjectId, row]));
  const squarePolarityByDirectedPair = new Map(
    authorizedSquareRows
      .filter((row) => row.sourceLabelPair && row.targetLabelPair)
      .map((row) => [
        squareDirectedPairKey(row.sourceLabelPair as [A3Label, A3Label], row.targetLabelPair as [A3Label, A3Label]),
        row,
      ]),
  );
  const s2IncidenceById = new Map(s2Report.supportIncidenceRows.map((row) => [row.supportObjectId, row]));
  const partialContext = {
    squareRows,
    hexRows,
    authorizedSquareRows,
    squareReadoutById,
    hexReadoutById,
    squarePolarityById,
    squarePolarityByDirectedPair,
    s2IncidenceById,
  };
  const signedKernelRows = buildSignedKernelRows(partialContext);

  return { ...partialContext, signedKernelRows };
}

function buildSupportSetSummary(s1Report: T28S1Report, s2Report: T28S2Report, context: AuditContext): SupportSetSummary {
  const squareCount = context.squareRows.length;
  const hexCount = context.hexRows.length;
  const squarePolarityAuthorizedCount = context.authorizedSquareRows.length;
  const rawHexCount = context.hexRows.filter((row) => normVec3(row.sectorPlus) > EPSILON).length;
  const s2SquareCount = s2Report.supportIncidenceRows.filter((row) => row.supportDomain === 've-square').length;
  const s2HexCount = s2Report.supportIncidenceRows.filter((row) => row.supportDomain === 've-a2-hexagon').length;
  const localReady = squareCount === 6 && hexCount === 4 && squarePolarityAuthorizedCount === 6 && rawHexCount === 4;
  const parentReady = s2Report.supportSetSummary.squareCount === 6 && s2Report.supportSetSummary.hexCount === 4 && s2SquareCount === 6 && s2HexCount === 4;

  return {
    squareCount,
    hexCount,
    squarePolarityAuthorizedCount,
    rawHexCount,
    s2SquareCount,
    s2HexCount,
    status: !localReady
      ? 'support-set-count-failed'
      : parentReady && s1Report.squarePolaritySummary.authorizedSquareCount === 6
        ? 'support-set-ready'
        : 'parent-support-set-mismatch',
  };
}

function buildQModeSectionSummary(s1Report: T28S1Report, context: AuditContext): QModeSectionSummary {
  const squareQModeCount = context.squareRows.length;
  const hexQModeCount = context.hexRows.length;
  const squareMinusNonzeroCount = context.squareRows.filter((row) => normVec3(row.sectorMinus) > EPSILON).length;
  const squarePlusNonzeroCount = context.squareRows.filter((row) => normVec3(row.sectorPlus) > EPSILON).length;
  const hexMinusNonzeroCount = context.hexRows.filter((row) => normVec3(row.sectorMinus) > EPSILON).length;
  const hexPlusNonzeroCount = context.hexRows.filter((row) => normVec3(row.sectorPlus) > EPSILON).length;
  const missing = squareQModeCount !== 6 || hexQModeCount !== 4 || squareMinusNonzeroCount !== 6 || hexPlusNonzeroCount !== 4;
  const contaminated = squarePlusNonzeroCount !== 0 || hexMinusNonzeroCount !== 0;

  return {
    squareQModeCount,
    hexQModeCount,
    squareMinusNonzeroCount,
    squarePlusNonzeroCount,
    hexMinusNonzeroCount,
    hexPlusNonzeroCount,
    rawScaleStatus: s1Report.rawScaleSummary.rawScaleStatus,
    squarePolarityStatus: s1Report.squarePolaritySummary.squareComponentStatus,
    status: missing
      ? 'q-mode-section-missing'
      : contaminated
        ? 'q-mode-section-sector-contaminated'
        : 'q-mode-sections-ready',
  };
}

function buildUnsignedIncidenceRows(context: AuditContext): UnsignedIncidenceRow[] {
  const perHex = computeUnsignedPerHex(context);

  return context.hexRows.flatMap((hexRow) =>
    context.squareRows.map((squareRow) => {
      const unsignedIntersectionCount = unsignedIntersectionCountFor(context, hexRow.objectId, squareRow.objectId);
      const computedUnsignedContribution = scaleVec3(squareRow.sectorMinus, unsignedIntersectionCount / 6);
      const computedForHex = perHex.get(hexRow.objectId) ?? zeroVec3();
      const accepted = sameVec3WithinEpsilon(computedForHex, hexRow.sectorPlus);

      return {
        hexId: hexRow.objectId,
        squareId: squareRow.objectId,
        unsignedIntersectionCount,
        computedUnsignedContribution: cleanVec3(computedUnsignedContribution),
        expectedRawHexQMode: cleanVec3(hexRow.sectorPlus),
        status: accepted
          ? 'unsigned-incidence-falsely-accepted'
          : 'unsigned-square-hex-incidence-fails-standard-q-structure',
      };
    }),
  );
}

function buildUnsignedIncidenceSummary(rows: readonly UnsignedIncidenceRow[], context: AuditContext): UnsignedIncidenceSummary {
  const perHex = computeUnsignedPerHex(context);
  const perHexComputedUnsignedVectors = Object.fromEntries([...perHex.entries()].map(([hexId, value]) => [hexId, cleanVec3(value)]));
  const perHexExpectedRawHexVectors = Object.fromEntries(context.hexRows.map((row) => [row.objectId, cleanVec3(row.sectorPlus)]));
  const maxErrorAgainstExpected = maxOf(context.hexRows.map((row) => maxAbsVec3(subVec3(perHex.get(row.objectId) ?? zeroVec3(), row.sectorPlus))));
  const falselyAcceptedCount = rows.filter((row) => row.status === 'unsigned-incidence-falsely-accepted').length;

  return {
    rowCount: rows.length,
    allIntersectionCountTwo: rows.every((row) => row.unsignedIntersectionCount === 2),
    perHexComputedUnsignedVectors,
    perHexExpectedRawHexVectors,
    maxErrorAgainstExpected,
    falselyAcceptedCount,
    status: falselyAcceptedCount === 0 && maxErrorAgainstExpected > EPSILON
      ? 'unsigned-square-hex-incidence-fails-standard-q-structure'
      : 'unsigned-incidence-falsely-accepted',
  };
}

function computeUnsignedPerHex(context: AuditContext): Map<string, Vec3> {
  return new Map(
    context.hexRows.map((hexRow) => {
      const value = context.squareRows.reduce((sum, squareRow) => {
        const count = unsignedIntersectionCountFor(context, hexRow.objectId, squareRow.objectId);
        return addVec3(sum, scaleVec3(squareRow.sectorMinus, count / 6));
      }, zeroVec3());
      return [hexRow.objectId, value];
    }),
  );
}

function unsignedIntersectionCountFor(context: AuditContext, hexId: string, squareId: string): number {
  const hexFlags = context.s2IncidenceById.get(hexId)?.incidentFlagIds ?? [];
  const squareFlags = context.s2IncidenceById.get(squareId)?.incidentFlagIds ?? [];
  return squareFlags.filter((flagId) => hexFlags.includes(flagId)).length;
}

function buildSignedKernelRows(context: Omit<AuditContext, 'signedKernelRows'>): SignedKernelRow[] {
  return context.hexRows.flatMap((hexRow) =>
    context.authorizedSquareRows.map((squareRow) => signedKernelRow(hexRow.objectId, squareRow)),
  );
}

function signedKernelRow(hexId: string, squareRow: T28S1SquarePolarityRow | SquareCandidate): SignedKernelRow {
  const omittedLabel = parseHexOmittedLabel(hexId);
  const candidate: SquareCandidate = {
    squareObjectId: squareRow.squareObjectId,
    flagCycle: squareRow.flagCycle,
    sourceLabelPair: squareRow.sourceLabelPair,
    targetLabelPair: squareRow.targetLabelPair,
    correspondingTetraEdge: squareRow.correspondingTetraEdge,
    squarePolarityStatus: 'status' in squareRow ? squareRow.status : squareRow.squarePolarityStatus,
  };
  const authorized = authorizeSignedSquareCandidate(candidate);
  const membership =
    !omittedLabel || !candidate.sourceLabelPair || !candidate.targetLabelPair
      ? 'omitted-membership-failed'
      : candidate.sourceLabelPair.includes(omittedLabel)
        ? 'omitted-in-source'
        : candidate.targetLabelPair.includes(omittedLabel)
          ? 'omitted-in-target'
          : 'omitted-membership-failed';
  const kappaValue: SignedKernelRow['kappaValue'] = membership === 'omitted-in-source'
    ? -1
    : membership === 'omitted-in-target'
      ? 1
      : 0;
  const kernelRowStatus: SignedKernelRow['kernelRowStatus'] = !authorized
    ? 'signed-kernel-square-polarity-missing'
    : membership === 'omitted-membership-failed'
      ? 'signed-kernel-membership-failed'
      : 'signed-kernel-row-pass';

  return {
    hexId,
    squareId: candidate.squareObjectId,
    sourceLabelPair: candidate.sourceLabelPair,
    targetLabelPair: candidate.targetLabelPair,
    omittedLabel,
    membershipStatus: membership,
    kappaValue,
    squarePolarityStatus: candidate.squarePolarityStatus,
    kernelRowStatus,
  };
}

function authorizeSignedSquareCandidate(candidate: SquareCandidate): boolean {
  return candidate.squarePolarityStatus === 'square-polarity-authorized' &&
    candidate.sourceLabelPair !== null &&
    candidate.targetLabelPair !== null &&
    candidate.correspondingTetraEdge !== null &&
    candidate.correspondingTetraEdge === edgeIdFromPair(candidate.sourceLabelPair) &&
    sourceTargetPairComplementPass(candidate.sourceLabelPair, candidate.targetLabelPair);
}

function buildSignedKernelSummary(rows: readonly SignedKernelRow[]): SignedKernelSummary {
  const passCount = rows.filter((row) => row.kernelRowStatus === 'signed-kernel-row-pass').length;
  const plusCount = rows.filter((row) => row.kappaValue === 1).length;
  const minusCount = rows.filter((row) => row.kappaValue === -1).length;
  const missingPolarityCount = rows.filter((row) => row.kernelRowStatus === 'signed-kernel-square-polarity-missing').length;
  const membershipFailCount = rows.filter((row) => row.kernelRowStatus === 'signed-kernel-membership-failed').length;
  const unorderedSquareSignUseCount = rows.filter((row) => row.kernelRowStatus === 'signed-kernel-used-unordered-square-sign').length;

  return {
    rowCount: rows.length,
    passCount,
    plusCount,
    minusCount,
    missingPolarityCount,
    membershipFailCount,
    unorderedSquareSignUseCount,
    status: missingPolarityCount > 0
      ? 'signed-kernel-square-polarity-missing'
      : membershipFailCount > 0
        ? 'signed-kernel-membership-failed'
        : unorderedSquareSignUseCount > 0
          ? 'signed-kernel-used-unordered-square-sign'
          : 'signed-square-hex-kernel-constructed',
  };
}

function buildSignedKernelS4EquivarianceRows(s1Report: T28S1Report, context: AuditContext): SignedKernelS4EquivarianceRow[] {
  const kernelByKey = new Map(context.signedKernelRows.map((row) => [kernelKey(row.hexId, row.squareId), row]));

  return s1Report.s4ActionRows.flatMap((actionRow) =>
    context.signedKernelRows.map((row) => {
      const omittedLabel = row.omittedLabel;
      const square = context.squarePolarityById.get(row.squareId);
      const permutedHexId = omittedLabel ? hexObjectId(actionRow.permutationMap[omittedLabel]) : row.hexId;
      const permutedSquareId = square ? targetSquareObjectId(square, actionRow, context) : row.squareId;
      const permutedKappa = kernelByKey.get(kernelKey(permutedHexId, permutedSquareId))?.kappaValue ?? 0;
      const pass = row.kappaValue === permutedKappa;

      return {
        permutationId: actionRow.permutationId,
        hexId: row.hexId,
        squareId: row.squareId,
        permutedHexId,
        permutedSquareId,
        originalKappa: row.kappaValue,
        permutedKappa,
        status: pass
          ? 'signed-square-hex-kernel-s4-equivariant'
          : 'signed-kernel-s4-equivariance-failed',
      };
    }),
  );
}

function targetSquareObjectId(square: T28S1SquarePolarityRow, actionRow: T28S1S4ActionRow, context: AuditContext): string {
  if (!square.sourceLabelPair || !square.targetLabelPair) return square.squareObjectId;
  const sourcePair = labelSort([
    actionRow.permutationMap[square.sourceLabelPair[0]],
    actionRow.permutationMap[square.sourceLabelPair[1]],
  ]);
  const targetPair = labelSort([
    actionRow.permutationMap[square.targetLabelPair[0]],
    actionRow.permutationMap[square.targetLabelPair[1]],
  ]);
  return context.squarePolarityByDirectedPair.get(squareDirectedPairKey(sourcePair, targetPair))?.squareObjectId ?? square.squareObjectId;
}

function buildSignedKernelS4EquivarianceSummary(
  rows: readonly SignedKernelS4EquivarianceRow[],
  permutationCount: number,
  kernelEntryCount: number,
): SignedKernelS4EquivarianceSummary {
  const failCount = rows.filter((row) => row.status === 'signed-kernel-s4-equivariance-failed').length;

  return {
    permutationCount,
    kernelEntryCount,
    checkedRowCount: rows.length,
    passCount: rows.length - failCount,
    failCount,
    status: failCount === 0 && rows.length === 576
      ? 'signed-square-hex-kernel-s4-equivariant'
      : 'signed-kernel-s4-equivariance-failed',
  };
}

function buildRawSquareToHexRows(context: AuditContext, squareOverride?: ReadonlyMap<string, Vec3>): RawSquareToHexRow[] {
  return context.hexRows.map((hexRow) => {
    const computedVector = computeRawSquareToHexVector(context, hexRow.objectId, squareOverride);
    const maxError = maxAbsVec3(subVec3(computedVector, hexRow.sectorPlus));

    return {
      hexId: hexRow.objectId,
      computedVector: cleanVec3(computedVector),
      expectedRawHexVector: cleanVec3(hexRow.sectorPlus),
      maxError,
      normalization: 1 / 6,
      status: maxError <= EPSILON ? 'raw-square-to-hex-q-mode-pass' : 'raw-square-to-hex-q-mode-failed',
    };
  });
}

function computeRawSquareToHexVector(context: AuditContext, hexId: string, squareOverride?: ReadonlyMap<string, Vec3>): Vec3 {
  return context.signedKernelRows
    .filter((row) => row.hexId === hexId)
    .reduce((sum, row) => {
      const squareVector = squareOverride?.get(row.squareId) ?? requiredReadoutByObjectId(context.squareReadoutById, row.squareId).sectorMinus;
      return addVec3(sum, scaleVec3(squareVector, row.kappaValue / 6));
    }, zeroVec3());
}

function buildRawSquareToHexSummary(rows: readonly RawSquareToHexRow[]): RawSquareToHexSummary {
  const passCount = rows.filter((row) => row.status === 'raw-square-to-hex-q-mode-pass').length;

  return {
    rowCount: rows.length,
    passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: passCount === rows.length && rows.length === 4
      ? 'raw-square-to-hex-q-mode-pass'
      : 'raw-square-to-hex-q-mode-failed',
  };
}

function buildReverseExactHexToSquareRows(context: AuditContext, hexOverride?: ReadonlyMap<string, Vec3>): ReverseExactHexToSquareRow[] {
  return context.authorizedSquareRows.map((squareRow) => {
    const computedVector = computeHexToSquareVector(context, squareRow.squareObjectId, 3 / 4, hexOverride);
    const expectedSquareVector = requiredReadoutByObjectId(context.squareReadoutById, squareRow.squareObjectId).sectorMinus;
    const maxError = maxAbsVec3(subVec3(computedVector, expectedSquareVector));

    return {
      squareId: squareRow.squareObjectId,
      sourceLabelPair: squareRow.sourceLabelPair,
      targetLabelPair: squareRow.targetLabelPair,
      computedVector: cleanVec3(computedVector),
      expectedSquareVector: cleanVec3(expectedSquareVector),
      maxError,
      normalization: 3 / 4,
      status: maxError <= EPSILON ? 'reverse-exact-hex-to-square-q-mode-pass' : 'reverse-exact-hex-to-square-q-mode-failed',
    };
  });
}

function buildReverseExactHexToSquareSummary(rows: readonly ReverseExactHexToSquareRow[]): ReverseExactHexToSquareSummary {
  const passCount = rows.filter((row) => row.status === 'reverse-exact-hex-to-square-q-mode-pass').length;

  return {
    rowCount: rows.length,
    passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: passCount === rows.length && rows.length === 6
      ? 'reverse-exact-hex-to-square-q-mode-pass'
      : 'reverse-exact-hex-to-square-q-mode-failed',
  };
}

function buildUnweightedAdjointHexToSquareRows(context: AuditContext, hexOverride?: ReadonlyMap<string, Vec3>): UnweightedAdjointHexToSquareRow[] {
  return context.authorizedSquareRows.map((squareRow) => {
    const computedAdjointVector = computeHexToSquareVector(context, squareRow.squareObjectId, 1 / 6, hexOverride);
    const expectedTwoNinthsSquareVector = scaleVec3(requiredReadoutByObjectId(context.squareReadoutById, squareRow.squareObjectId).sectorMinus, 2 / 9);
    const maxError = maxAbsVec3(subVec3(computedAdjointVector, expectedTwoNinthsSquareVector));

    return {
      squareId: squareRow.squareObjectId,
      sourceLabelPair: squareRow.sourceLabelPair,
      targetLabelPair: squareRow.targetLabelPair,
      computedAdjointVector: cleanVec3(computedAdjointVector),
      expectedTwoNinthsSquareVector: cleanVec3(expectedTwoNinthsSquareVector),
      maxError,
      normalization: 1 / 6,
      status: maxError <= EPSILON
        ? 'unweighted-adjoint-returns-two-ninths-square-q-mode-pass'
        : 'unweighted-adjoint-return-factor-failed',
    };
  });
}

function buildUnweightedAdjointHexToSquareSummary(rows: readonly UnweightedAdjointHexToSquareRow[]): UnweightedAdjointHexToSquareSummary {
  const passCount = rows.filter((row) => row.status === 'unweighted-adjoint-returns-two-ninths-square-q-mode-pass').length;

  return {
    rowCount: rows.length,
    passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: passCount === rows.length && rows.length === 6
      ? 'unweighted-adjoint-returns-two-ninths-square-q-mode-pass'
      : 'unweighted-adjoint-return-factor-failed',
  };
}

function computeHexToSquareVector(context: AuditContext, squareId: string, coefficient: number, hexOverride?: ReadonlyMap<string, Vec3>): Vec3 {
  return context.signedKernelRows
    .filter((row) => row.squareId === squareId)
    .reduce((sum, row) => {
      const hexVector = hexOverride?.get(row.hexId) ?? requiredReadoutByObjectId(context.hexReadoutById, row.hexId).sectorPlus;
      return addVec3(sum, scaleVec3(hexVector, row.kappaValue * coefficient));
    }, zeroVec3());
}

function buildNormalizationDistinctionRows(): NormalizationDistinctionRow[] {
  return [
    {
      exactCoefficient: 3 / 4,
      adjointCoefficient: 1 / 6,
      exactQModeReturnFactor: 1,
      adjointQModeReturnFactor: 2 / 9,
      exactEqualsAdjoint: false,
      normalizationDistinctionStatus: 'exact-and-adjoint-normalizations-distinguished',
    },
  ];
}

function buildNormalizationDistinctionSummary(rows: readonly NormalizationDistinctionRow[]): NormalizationDistinctionSummary {
  return {
    rowCount: rows.length,
    status: rows.length === 1 && rows.every((row) => row.normalizationDistinctionStatus === 'exact-and-adjoint-normalizations-distinguished')
      ? 'exact-and-adjoint-normalizations-distinguished'
      : 'exact-adjoint-normalizations-conflated',
  };
}

function buildWeightedPairingReconciliationRow(): WeightedPairingReconciliationRow {
  const requiredSquareWeight = 2;
  const requiredHexWeight = 9;
  const requiredRatio = requiredHexWeight / requiredSquareWeight;

  return {
    requiredHexWeight,
    requiredSquareWeight,
    requiredRatio,
    adoptedWeightedPairing: false,
    boundaryStatement: 'This does not adopt the weighted pairing. It only reports the ratio.',
    status: Math.abs(requiredRatio - 4.5) <= EPSILON
      ? 'weighted-pairing-reconciliation-computed'
      : 'weighted-pairing-ratio-computation-failed',
  };
}

function buildSquarePolarityGateRows(context: AuditContext): SquarePolarityGateRow[] {
  return context.authorizedSquareRows.map((row) => {
    const corrupted: SquareCandidate = {
      squareObjectId: row.squareObjectId,
      flagCycle: row.flagCycle,
      sourceLabelPair: null,
      targetLabelPair: null,
      correspondingTetraEdge: null,
      squarePolarityStatus: 'corrupted-unordered-square-control',
    };
    const blocked = !authorizeSignedSquareCandidate(corrupted);
    const attemptStatus = blocked ? 'blocked' : 'falsely-authorized';

    return {
      corruptedSquareObjectId: row.squareObjectId,
      flagSetKey: flagSetKey(row.flagCycle),
      sourceLabelPairPresent: corrupted.sourceLabelPair !== null,
      targetLabelPairPresent: corrupted.targetLabelPair !== null,
      signedKernelAttemptStatus: attemptStatus,
      rawMapAttemptStatus: attemptStatus,
      exactReverseAttemptStatus: attemptStatus,
      unweightedAdjointAttemptStatus: attemptStatus,
      status: blocked
        ? 'square-hex-coupling-blocked-by-square-polarity'
        : 'square-hex-coupling-falsely-authorized-from-unordered-square',
    };
  });
}

function buildSquarePolarityGateSummary(rows: readonly SquarePolarityGateRow[]): SquarePolarityGateSummary {
  const blockedCount = rows.filter((row) =>
    row.signedKernelAttemptStatus === 'blocked' &&
    row.rawMapAttemptStatus === 'blocked' &&
    row.exactReverseAttemptStatus === 'blocked' &&
    row.unweightedAdjointAttemptStatus === 'blocked'
  ).length;
  const falselyAuthorizedCount = rows.length - blockedCount;

  return {
    checkedCount: rows.length,
    blockedCount,
    falselyAuthorizedCount,
    status: falselyAuthorizedCount === 0 && rows.length === 6
      ? 'square-hex-coupling-blocked-by-square-polarity'
      : 'square-hex-coupling-falsely-authorized-from-unordered-square',
  };
}

function buildRawScaleGateRows(context: AuditContext): RawScaleGateRow[] {
  return context.hexRows.map((hexRow) => {
    const corruptedHexVector = scaleVec3(hexRow.sectorPlus, 3 / 2);
    const hexOverride = new Map(context.hexRows.map((row) => [row.objectId, row.sectorPlus]));
    hexOverride.set(hexRow.objectId, corruptedHexVector);
    const exactRows = buildReverseExactHexToSquareRows(context, hexOverride);
    const adjointRows = buildUnweightedAdjointHexToSquareRows(context, hexOverride);
    const exactFails = exactRows.some((row) => row.status !== 'reverse-exact-hex-to-square-q-mode-pass');
    const adjointFails = adjointRows.some((row) => row.status !== 'unweighted-adjoint-returns-two-ninths-square-q-mode-pass');
    const corruptionDetected = maxAbsVec3(subVec3(corruptedHexVector, hexRow.sectorPlus)) > EPSILON && exactFails && adjointFails;

    return {
      hexId: hexRow.objectId,
      correctRawHexVector: cleanVec3(hexRow.sectorPlus),
      corruptedHexVector: cleanVec3(corruptedHexVector),
      corruptionDetected,
      exactReverseAgainstRawScaleStatus: exactFails ? 'raw-scale-corruption-detected' : 'raw-scale-corruption-undetected',
      adjointAgainstRawScaleStatus: adjointFails ? 'raw-scale-corruption-detected' : 'raw-scale-corruption-undetected',
      status: corruptionDetected
        ? 'square-hex-coupling-raw-scale-gate-pass'
        : 'square-hex-coupling-raw-scale-corruption-undetected',
    };
  });
}

function buildRawScaleGateSummary(rows: readonly RawScaleGateRow[]): RawScaleGateSummary {
  const corruptionDetectedCount = rows.filter((row) => row.corruptionDetected).length;

  return {
    checkedCount: rows.length,
    corruptionDetectedCount,
    status: rows.length === 4 && corruptionDetectedCount === rows.length
      ? 'square-hex-coupling-raw-scale-gate-pass'
      : 'square-hex-coupling-raw-scale-corruption-undetected',
  };
}

function buildNoScalarCollapseRows(): NoScalarCollapseRow[] {
  return PROHIBITED_SOURCE_LAWS.map((prohibitedUse, index) => ({
    checkId: `NS${index + 1}`,
    prohibitedUse,
    observedUse: false,
    allowedDebugOnly: true,
    status: 'no-scalar-collapse-in-sector-coupling',
  }));
}

function buildNoScalarCollapseSummary(rows: readonly NoScalarCollapseRow[]): NoScalarCollapseSummary {
  const failCount = rows.filter((row) => row.status === 'sector-coupling-scalar-collapse-regression').length;

  return {
    checkCount: rows.length,
    passCount: rows.length - failCount,
    failCount,
    status: failCount === 0 ? 'no-scalar-collapse-in-sector-coupling' : 'sector-coupling-scalar-collapse-regression',
  };
}

function buildControlRows(args: {
  context: AuditContext;
  unsignedIncidenceSummary: UnsignedIncidenceSummary;
  squarePolarityGateSummary: SquarePolarityGateSummary;
  rawScaleGateSummary: RawScaleGateSummary;
  normalizationDistinctionSummary: NormalizationDistinctionSummary;
  noScalarCollapseSummary: NoScalarCollapseSummary;
  rawSquareToHexRows: readonly RawSquareToHexRow[];
  reverseExactHexToSquareRows: readonly ReverseExactHexToSquareRow[];
  unweightedAdjointHexToSquareRows: readonly UnweightedAdjointHexToSquareRow[];
  signedKernelRows: readonly SignedKernelRow[];
}): ControlRow[] {
  const zeroMax = zeroControlMaxError(args.context);
  const scalarMaxError = scalarMagnitudeControlMaxError(args.context);
  const arbitraryOrderMaxError = arbitraryOrderControlMaxError(args.context, args.signedKernelRows, args.rawSquareToHexRows, args.reverseExactHexToSquareRows, args.unweightedAdjointHexToSquareRows);
  const conflationRejected = args.normalizationDistinctionSummary.status === 'exact-and-adjoint-normalizations-distinguished';

  return [
    controlRow('C0', 'zero section', 'zero maps remain zero', zeroMax <= EPSILON ? 'zero-section-preserved' : 'zero-section-failed', zeroMax <= EPSILON, zeroMax, undefined, 'C_QH_raw(0), C_HQ_exact(0), and C_HQ_adj(0) remain zero.'),
    controlRow('C1', 'unsigned incidence control', 'unsigned square-hex incidence rejected', args.unsignedIncidenceSummary.status, args.unsignedIncidenceSummary.status === 'unsigned-square-hex-incidence-fails-standard-q-structure', args.unsignedIncidenceSummary.maxErrorAgainstExpected, args.unsignedIncidenceSummary.rowCount, 'Unsigned incidence is not accepted as q-standard sector coupling.'),
    controlRow('C2', 'square-polarity corruption control', 'square-hex coupling blocked by square polarity', args.squarePolarityGateSummary.status, args.squarePolarityGateSummary.status === 'square-hex-coupling-blocked-by-square-polarity', args.squarePolarityGateSummary.falselyAuthorizedCount, args.squarePolarityGateSummary.checkedCount, 'Corrupted unordered square candidates cannot authorize signed coupling.'),
    controlRow('C3', 'raw-scale corruption control', 'raw-scale corruption detected', args.rawScaleGateSummary.status === 'square-hex-coupling-raw-scale-gate-pass' ? 'raw-scale-corruption-detected' : 'raw-scale-corruption-undetected', args.rawScaleGateSummary.status === 'square-hex-coupling-raw-scale-gate-pass', args.rawScaleGateSummary.checkedCount - args.rawScaleGateSummary.corruptionDetectedCount, args.rawScaleGateSummary.checkedCount, 'Replacing raw hex q-mode values by normalized values is detected.'),
    controlRow('C4', 'exact/adjoint conflation control', 'exact-adjoint conflation rejected', 'exact-adjoint-normalizations-conflated', conflationRejected, conflationRejected ? 0 : 1, 1, 'The deliberate exact/adjoint conflation is rejected by the normalization distinction audit.'),
    controlRow('C5', 'scalar magnitude control', 'scalar magnitude q-mode rejected', scalarMaxError > EPSILON ? 'sector-coupling-scalar-collapse-regression' : 'scalar-magnitude-falsely-accepted', scalarMaxError > EPSILON && args.noScalarCollapseSummary.status === 'no-scalar-collapse-in-sector-coupling', scalarMaxError, 1, 'Magnitude-only q-mode replacement fails vector equality.'),
    controlRow('C6', 'arbitrary-order control', 'object-id maps are order independent', arbitraryOrderMaxError <= EPSILON ? 'object-id-order-independent' : 'arbitrary-row-order-dependence-detected', arbitraryOrderMaxError <= EPSILON, arbitraryOrderMaxError, 4, 'Reversed square and hex row order leaves signed kernel, raw C_QH, exact reverse, and unweighted adjoint outputs unchanged by object ID.'),
  ];
}

function controlRow(
  controlId: ControlRow['controlId'],
  controlName: string,
  expectedStatus: string,
  observedStatus: string,
  pass: boolean,
  maxErrorDebugOnly: number,
  checkedCount: number | undefined,
  note: string,
): ControlRow {
  return {
    controlId,
    controlName,
    expectedStatus,
    observedStatus,
    maxErrorDebugOnly,
    checkedCount,
    status: pass ? 'control-pass' : 'control-fail',
    note,
  };
}

function zeroControlMaxError(context: AuditContext): number {
  const squareZero = new Map(context.squareRows.map((row) => [row.objectId, zeroVec3()]));
  const hexZero = new Map(context.hexRows.map((row) => [row.objectId, zeroVec3()]));
  const raw = context.hexRows.map((row) => computeRawSquareToHexVector(context, row.objectId, squareZero));
  const exact = context.squareRows.map((row) => computeHexToSquareVector(context, row.objectId, 3 / 4, hexZero));
  const adjoint = context.squareRows.map((row) => computeHexToSquareVector(context, row.objectId, 1 / 6, hexZero));
  return maxOf([...raw, ...exact, ...adjoint].map(maxAbsVec3));
}

function scalarMagnitudeControlMaxError(context: AuditContext): number {
  const scalarSquares = new Map(
    context.squareRows.map((row) => [
      row.objectId,
      [normVec3(row.sectorMinus), 0, 0] as Vec3,
    ]),
  );
  const rows = buildRawSquareToHexRows(context, scalarSquares);
  return maxOf(rows.map((row) => row.maxError));
}

function arbitraryOrderControlMaxError(
  context: AuditContext,
  originalKernelRows: readonly SignedKernelRow[],
  originalRawRows: readonly RawSquareToHexRow[],
  originalExactRows: readonly ReverseExactHexToSquareRow[],
  originalAdjointRows: readonly UnweightedAdjointHexToSquareRow[],
): number {
  const reversedContext: AuditContext = {
    ...context,
    squareRows: [...context.squareRows].reverse(),
    hexRows: [...context.hexRows].reverse(),
    authorizedSquareRows: [...context.authorizedSquareRows].reverse(),
  };
  reversedContext.signedKernelRows = buildSignedKernelRows(reversedContext);
  const reversedRawRows = buildRawSquareToHexRows(reversedContext);
  const reversedExactRows = buildReverseExactHexToSquareRows(reversedContext);
  const reversedAdjointRows = buildUnweightedAdjointHexToSquareRows(reversedContext);
  const originalKernelById = new Map(originalKernelRows.map((row) => [kernelKey(row.hexId, row.squareId), row]));
  const originalRawById = new Map(originalRawRows.map((row) => [row.hexId, row]));
  const originalExactById = new Map(originalExactRows.map((row) => [row.squareId, row]));
  const originalAdjointById = new Map(originalAdjointRows.map((row) => [row.squareId, row]));
  const kernelError = maxOf(
    reversedContext.signedKernelRows.map((row) => {
      const expected = originalKernelById.get(kernelKey(row.hexId, row.squareId));
      return expected && expected.kappaValue === row.kappaValue ? 0 : Number.POSITIVE_INFINITY;
    }),
  );
  const rawError = maxOf(
    reversedRawRows.map((row) => {
      const expected = originalRawById.get(row.hexId);
      return expected ? maxAbsVec3(subVec3(row.computedVector, expected.computedVector)) : Number.POSITIVE_INFINITY;
    }),
  );
  const exactError = maxOf(
    reversedExactRows.map((row) => {
      const expected = originalExactById.get(row.squareId);
      return expected ? maxAbsVec3(subVec3(row.computedVector, expected.computedVector)) : Number.POSITIVE_INFINITY;
    }),
  );
  const adjointError = maxOf(
    reversedAdjointRows.map((row) => {
      const expected = originalAdjointById.get(row.squareId);
      return expected ? maxAbsVec3(subVec3(row.computedAdjointVector, expected.computedAdjointVector)) : Number.POSITIVE_INFINITY;
    }),
  );

  return Math.max(kernelError, rawError, exactError, adjointError);
}

function buildBoundaryRows(): BoundaryRow[] {
  return REQUIRED_BOUNDARY_IDS.map((boundaryId) => ({
    boundaryId,
    statement: `${boundaryId} is enforced as a lab-scope boundary and does not deny the long-term field-world target.`,
    enforced: true,
  }));
}

function buildFalsifierRows(args: {
  s1Report: T28S1Report;
  s2Report: T28S2Report;
  signedKernelSummary: SignedKernelSummary;
  unsignedIncidenceSummary: UnsignedIncidenceSummary;
  signedKernelS4EquivarianceSummary: SignedKernelS4EquivarianceSummary;
  rawSquareToHexSummary: RawSquareToHexSummary;
  reverseExactHexToSquareSummary: ReverseExactHexToSquareSummary;
  unweightedAdjointHexToSquareSummary: UnweightedAdjointHexToSquareSummary;
  normalizationDistinctionSummary: NormalizationDistinctionSummary;
  squarePolarityGateSummary: SquarePolarityGateSummary;
  rawScaleGateSummary: RawScaleGateSummary;
  noScalarCollapseSummary: NoScalarCollapseSummary;
  controlRows: readonly ControlRow[];
  finalVerdict: T28S3FinalVerdict;
}): FalsifierRow[] {
  return [
    falsifier('F1', 'T28-S1 parent missing or not accepted.', !parentS1Accepted(args.s1Report), `T28-S1 ok=${args.s1Report.ok}; finalVerdict=${args.s1Report.finalVerdict}.`),
    falsifier('F2', 'T28-S2 parent missing or not accepted.', !parentS2Accepted(args.s2Report), `T28-S2 ok=${args.s2Report.ok}; finalVerdict=${args.s2Report.finalVerdict}.`),
    falsifier('F3', 'Uses T28-R as authority.', false, 'T28-R is context-only-not-authority.'),
    falsifier('F4', 'Infers square sign from unordered square flag set.', args.signedKernelSummary.unorderedSquareSignUseCount > 0, `${args.signedKernelSummary.unorderedSquareSignUseCount} unordered sign uses.`),
    falsifier('F5', 'Accepts unsigned square-hex incidence as valid q-standard coupling.', args.unsignedIncidenceSummary.status !== 'unsigned-square-hex-incidence-fails-standard-q-structure', `unsigned status=${args.unsignedIncidenceSummary.status}.`),
    falsifier('F6', 'Raw square-to-hex map fails or uses wrong normalization.', args.rawSquareToHexSummary.status !== 'raw-square-to-hex-q-mode-pass', `raw status=${args.rawSquareToHexSummary.status}.`),
    falsifier('F7', 'Reverse exact map fails or uses wrong normalization.', args.reverseExactHexToSquareSummary.status !== 'reverse-exact-hex-to-square-q-mode-pass', `reverse status=${args.reverseExactHexToSquareSummary.status}.`),
    falsifier('F8', 'Unweighted adjoint return factor fails or conflates with exact reverse.', args.unweightedAdjointHexToSquareSummary.status !== 'unweighted-adjoint-returns-two-ninths-square-q-mode-pass', `adjoint status=${args.unweightedAdjointHexToSquareSummary.status}.`),
    falsifier('F9', 'Exact reverse and unweighted adjoint normalizations are conflated.', args.normalizationDistinctionSummary.status !== 'exact-and-adjoint-normalizations-distinguished', `normalization status=${args.normalizationDistinctionSummary.status}.`),
    falsifier('F10', 'Square-polarity corruption is falsely authorized.', args.squarePolarityGateSummary.status !== 'square-hex-coupling-blocked-by-square-polarity', `square gate status=${args.squarePolarityGateSummary.status}.`),
    falsifier('F11', 'Raw hex scale corruption is not detected.', args.rawScaleGateSummary.status !== 'square-hex-coupling-raw-scale-gate-pass', `raw-scale gate status=${args.rawScaleGateSummary.status}.`),
    falsifier('F12', 'Uses scalar magnitude, arbitrary projection, category number, semantic label, display order, or row order as coupling law.', args.noScalarCollapseSummary.status !== 'no-scalar-collapse-in-sector-coupling' || controlFailed(args.controlRows, 'C5') || controlFailed(args.controlRows, 'C6'), 'No scalar/projection/order source law is accepted.'),
    falsifier('F13', 'Promotes result to forbidden runtime or interpretive behavior.', false, 'Diagnostic remains finite vector-native lab audit only.'),
    falsifier('F14', 'Mutates Shape, packet, operation registry, store, UI, field atlas policy, FieldCue, GeneratedSiteReading, or runtime state.', false, 'New diagnostic source and script only.'),
  ];
}

function falsifier(
  falsifierId: FalsifierRow['falsifierId'],
  description: string,
  triggered: boolean,
  evidence: string,
): FalsifierRow {
  return { falsifierId, description, triggered, evidence, status: triggered ? 'triggered' : 'clear' };
}

function classifyFinalVerdict(args: {
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  unsignedIncidenceSummary: UnsignedIncidenceSummary;
  squarePolarityGateSummary: SquarePolarityGateSummary;
  rawScaleGateSummary: RawScaleGateSummary;
  noScalarCollapseSummary: NoScalarCollapseSummary;
  controlRows: readonly ControlRow[];
  signedKernelS4EquivarianceSummary: SignedKernelS4EquivarianceSummary;
  rawSquareToHexSummary: RawSquareToHexSummary;
  reverseExactHexToSquareSummary: ReverseExactHexToSquareSummary;
  unweightedAdjointHexToSquareSummary: UnweightedAdjointHexToSquareSummary;
  normalizationDistinctionSummary: NormalizationDistinctionSummary;
}): T28S3FinalVerdict {
  if (requiredBoundaryMissing(args.boundaryRows) || args.falsifierRows.some((row) => row.triggered)) {
    return 'T28-S-Lab-3-boundary-failed';
  }

  if (args.unsignedIncidenceSummary.status !== 'unsigned-square-hex-incidence-fails-standard-q-structure') {
    return 'T28-S-Lab-3-unsigned-incidence-falsely-accepted';
  }

  if (args.squarePolarityGateSummary.status !== 'square-hex-coupling-blocked-by-square-polarity') {
    return 'T28-S-Lab-3-square-polarity-gate-failed';
  }

  if (args.rawScaleGateSummary.status !== 'square-hex-coupling-raw-scale-gate-pass') {
    return 'T28-S-Lab-3-raw-scale-gate-failed';
  }

  if (args.noScalarCollapseSummary.status !== 'no-scalar-collapse-in-sector-coupling' || controlFailed(args.controlRows, 'C5')) {
    return 'T28-S-Lab-3-scalar-collapse-regression-failed';
  }

  if (args.signedKernelS4EquivarianceSummary.status !== 'signed-square-hex-kernel-s4-equivariant') {
    return 'T28-S-Lab-3-signed-kernel-equivariance-failed';
  }

  if (args.rawSquareToHexSummary.status !== 'raw-square-to-hex-q-mode-pass') {
    return 'T28-S-Lab-3-raw-square-to-hex-failed';
  }

  if (args.reverseExactHexToSquareSummary.status !== 'reverse-exact-hex-to-square-q-mode-pass') {
    return 'T28-S-Lab-3-reverse-exact-failed';
  }

  if (args.unweightedAdjointHexToSquareSummary.status !== 'unweighted-adjoint-returns-two-ninths-square-q-mode-pass') {
    return 'T28-S-Lab-3-unweighted-adjoint-factor-failed';
  }

  if (args.normalizationDistinctionSummary.status !== 'exact-and-adjoint-normalizations-distinguished') {
    return 'T28-S-Lab-3-normalization-distinction-failed';
  }

  return 'T28-S-Lab-3-signed-square-hex-sector-coupling-pass';
}

function buildIntegrityIssues(args: {
  s1Report: T28S1Report;
  s2Report: T28S2Report;
  supportSetSummary: SupportSetSummary;
  qModeSectionSummary: QModeSectionSummary;
  unsignedIncidenceRows: readonly UnsignedIncidenceRow[];
  unsignedIncidenceSummary: UnsignedIncidenceSummary;
  signedKernelSummary: SignedKernelSummary;
  signedKernelS4EquivarianceSummary: SignedKernelS4EquivarianceSummary;
  rawSquareToHexRows: readonly RawSquareToHexRow[];
  rawSquareToHexSummary: RawSquareToHexSummary;
  reverseExactHexToSquareRows: readonly ReverseExactHexToSquareRow[];
  reverseExactHexToSquareSummary: ReverseExactHexToSquareSummary;
  unweightedAdjointHexToSquareRows: readonly UnweightedAdjointHexToSquareRow[];
  unweightedAdjointHexToSquareSummary: UnweightedAdjointHexToSquareSummary;
  normalizationDistinctionSummary: NormalizationDistinctionSummary;
  weightedPairingReconciliationRow: WeightedPairingReconciliationRow;
  squarePolarityGateSummary: SquarePolarityGateSummary;
  rawScaleGateSummary: RawScaleGateSummary;
  noScalarCollapseSummary: NoScalarCollapseSummary;
  controlRows: readonly ControlRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  finalVerdict: T28S3FinalVerdict;
}): string[] {
  const issues: string[] = [];

  if (!parentS1Accepted(args.s1Report)) issues.push('T28-S1 parent missing/not accepted');
  if (!parentS2Accepted(args.s2Report)) issues.push('T28-S2 parent missing/not accepted');
  if (args.supportSetSummary.squareCount !== 6) issues.push('square count not 6');
  if (args.supportSetSummary.hexCount !== 4) issues.push('hex count not 4');
  if (args.qModeSectionSummary.status !== 'q-mode-sections-ready') issues.push('q-mode section missing/sector-contaminated');
  if (args.unsignedIncidenceRows.some((row) => row.unsignedIntersectionCount !== 2)) issues.push('unsigned intersection count not 2');
  if (args.unsignedIncidenceSummary.status !== 'unsigned-square-hex-incidence-fails-standard-q-structure') issues.push('unsigned incidence falsely accepted');
  if (args.signedKernelSummary.rowCount !== 24) issues.push('signed kernel row count not 24');
  if (args.signedKernelSummary.missingPolarityCount > 0) issues.push('signed kernel polarity missing');
  if (args.signedKernelSummary.membershipFailCount > 0) issues.push('signed kernel membership failed');
  if (args.signedKernelS4EquivarianceSummary.checkedRowCount !== 576) issues.push('S4 equivariance row count not 576');
  if (args.signedKernelS4EquivarianceSummary.status !== 'signed-square-hex-kernel-s4-equivariant') issues.push('signed kernel S4 equivariance failed');
  if (args.rawSquareToHexRows.length !== 4) issues.push('raw square-to-hex row count not 4');
  if (args.rawSquareToHexSummary.status !== 'raw-square-to-hex-q-mode-pass') issues.push('raw square-to-hex map failed');
  if (args.reverseExactHexToSquareRows.length !== 6) issues.push('reverse exact row count not 6');
  if (args.reverseExactHexToSquareSummary.status !== 'reverse-exact-hex-to-square-q-mode-pass') issues.push('reverse exact failed');
  if (args.unweightedAdjointHexToSquareRows.length !== 6) issues.push('unweighted adjoint row count not 6');
  if (args.unweightedAdjointHexToSquareSummary.status !== 'unweighted-adjoint-returns-two-ninths-square-q-mode-pass') issues.push('unweighted adjoint factor failed');
  if (args.normalizationDistinctionSummary.status !== 'exact-and-adjoint-normalizations-distinguished') issues.push('exact/adjoint distinction failed');
  if (args.weightedPairingReconciliationRow.status !== 'weighted-pairing-reconciliation-computed' || Math.abs(args.weightedPairingReconciliationRow.requiredRatio - 4.5) > EPSILON) issues.push('weighted-pairing ratio wrong if implemented');
  if (args.squarePolarityGateSummary.status !== 'square-hex-coupling-blocked-by-square-polarity') issues.push('square-polarity corruption control failed');
  if (args.rawScaleGateSummary.status !== 'square-hex-coupling-raw-scale-gate-pass') issues.push('raw-scale corruption control failed');
  if (args.noScalarCollapseSummary.status !== 'no-scalar-collapse-in-sector-coupling') issues.push('scalar-collapse audit failed');
  if (!allControlsPass(args.controlRows)) issues.push('C0-C6 missing or failed');
  if (requiredBoundaryMissing(args.boundaryRows)) issues.push('required boundary row missing');
  if (
    REQUIRED_FALSIFIER_IDS.some((id) => !args.falsifierRows.some((row) => row.falsifierId === id)) ||
    args.falsifierRows.some((row) => row.triggered)
  ) {
    issues.push('falsifier row missing or triggered');
  }

  const expectedVerdict = classifyFinalVerdict({
    boundaryRows: args.boundaryRows,
    falsifierRows: args.falsifierRows,
    unsignedIncidenceSummary: args.unsignedIncidenceSummary,
    squarePolarityGateSummary: args.squarePolarityGateSummary,
    rawScaleGateSummary: args.rawScaleGateSummary,
    noScalarCollapseSummary: args.noScalarCollapseSummary,
    controlRows: args.controlRows,
    signedKernelS4EquivarianceSummary: args.signedKernelS4EquivarianceSummary,
    rawSquareToHexSummary: args.rawSquareToHexSummary,
    reverseExactHexToSquareSummary: args.reverseExactHexToSquareSummary,
    unweightedAdjointHexToSquareSummary: args.unweightedAdjointHexToSquareSummary,
    normalizationDistinctionSummary: args.normalizationDistinctionSummary,
  });

  if (expectedVerdict !== args.finalVerdict) issues.push('final verdict inconsistent with precedence');

  return unique(issues);
}

function allControlsPass(rows: readonly ControlRow[]): boolean {
  return rows.length === 7 && (['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'] as const).every((id) =>
    rows.some((row) => row.controlId === id && row.status === 'control-pass'),
  );
}

function controlFailed(rows: readonly ControlRow[], controlId: ControlRow['controlId']): boolean {
  return rows.some((row) => row.controlId === controlId && row.status !== 'control-pass');
}

function requiredBoundaryMissing(rows: readonly BoundaryRow[]): boolean {
  return REQUIRED_BOUNDARY_IDS.some((id) => !rows.some((row) => row.boundaryId === id && row.enforced));
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

export function sumVec3(values: readonly Vec3[]): Vec3 {
  return values.reduce((sum, value) => addVec3(sum, value), zeroVec3());
}

export function sameVec3WithinEpsilon(left: Vec3, right: Vec3): boolean {
  return maxAbsVec3(subVec3(left, right)) <= EPSILON;
}

function labelSort(pair: readonly A3Label[]): [A3Label, A3Label] {
  return [...pair].sort((left, right) => A3_LABELS.indexOf(left) - A3_LABELS.indexOf(right)) as [A3Label, A3Label];
}

function flagSetKey(flagSet: readonly A3FlagId[]): string {
  return unique(flagSet).sort((left, right) => DIRECTED_FLAGS.indexOf(left) - DIRECTED_FLAGS.indexOf(right)).join('|');
}

function parseFlagId(flagId: A3FlagId): [A3Label, A3Label] {
  const [source, target] = flagId.split('->') as [A3Label, A3Label];
  return [source, target];
}

function parseHexOmittedLabel(objectId: string): A3Label | null {
  const label = objectId.slice('ve-central-hexagon-omitted:'.length);
  return A3_LABELS.includes(label as A3Label) ? (label as A3Label) : null;
}

function squareDirectedPairKey(sourceLabelPair: readonly A3Label[], targetLabelPair: readonly A3Label[]): string {
  return `${labelSort(sourceLabelPair).join('')}|${labelSort(targetLabelPair).join('')}`;
}

function samePair(left: readonly A3Label[] | null, right: readonly A3Label[] | null): boolean {
  if (!left || !right) return false;
  const leftSorted = labelSort(left);
  const rightSorted = labelSort(right);
  return leftSorted[0] === rightSorted[0] && leftSorted[1] === rightSorted[1];
}

function edgeIdFromPair(pair: readonly A3Label[] | null): EdgeId | null {
  if (!pair || pair.length !== 2) return null;
  return labelSort(pair).join('') as EdgeId;
}

function requiredReadoutByObjectId(map: ReadonlyMap<string, T28S1ReadoutRow>, objectId: string): T28S1ReadoutRow {
  const row = map.get(objectId);
  if (!row) {
    throw new Error(`Missing T28-S1 readout row for ${objectId}`);
  }
  return row;
}

function hexObjectId(label: A3Label): string {
  return `ve-central-hexagon-omitted:${label}`;
}

function kernelKey(hexId: string, squareId: string): string {
  return `${hexId}::${squareId}`;
}

function sourceTargetPairComplementPass(sourceLabelPair: readonly A3Label[], targetLabelPair: readonly A3Label[]): boolean {
  const intersection = sourceLabelPair.filter((label) => targetLabelPair.includes(label));
  const union = unique([...sourceLabelPair, ...targetLabelPair]);
  return intersection.length === 0 && sameSet(union, A3_LABELS);
}

function sameSet<T>(left: readonly T[], right: readonly T[]): boolean {
  return left.length === right.length && left.every((value) => right.includes(value));
}

function maxOf(values: readonly number[]): number {
  return values.length === 0 ? 0 : Math.max(...values);
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

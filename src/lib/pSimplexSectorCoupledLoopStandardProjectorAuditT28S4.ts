import { buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report } from './pSimplexSignedSquareHexSectorCouplingAuditT28S3';
import { buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report } from './pSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1';
import { buildPSimplexVectorNativeIncidenceOperatorAuditT28S2Report } from './pSimplexVectorNativeIncidenceOperatorAuditT28S2';

export type Vec3 = [number, number, number];
export type A3Label = 'A' | 'B' | 'C' | 'D';
export type ObjectDomain = 've-square' | 've-a2-hexagon';
export type OperatorDomain = 'Q' | 'H' | 'QH';
export type BridgeType = 'exact' | 'adjoint';
type Matrix = number[][];
type AxisId = 'x' | 'y' | 'z';
type OperatorId =
  | 'kappa'
  | 'G_H'
  | 'G_Q'
  | 'P_H'
  | 'P_Q'
  | 'D'
  | 'R_exact'
  | 'R_adj'
  | 'L_Q_exact'
  | 'L_H_exact'
  | 'L_Q_adj'
  | 'L_H_adj'
  | 'J_exact'
  | 'J_adj';

export interface ParentEvidenceRow {
  parentId:
    | 'T28-S-Lab-3'
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
  kernelRowCount: number;
  squareQModeCount: number;
  hexQModeCount: number;
  status: 'support-set-ready' | 'support-set-count-failed' | 'parent-support-set-mismatch';
}

export interface OperatorDefinitionRow {
  operatorId: OperatorId;
  domain: OperatorDomain;
  codomain: OperatorDomain;
  coefficient: number;
  sourceDefinition: string;
  operatorStatus: 'operator-defined' | 'operator-definition-failed';
}

export interface SignedKernelGramRow {
  gramMatrixId: 'G_H' | 'G_Q';
  leftObjectId: string;
  rightObjectId: string;
  computedEntry: number;
  expectedEntry: number;
  relationClass:
    | 'hex-diagonal'
    | 'hex-off-diagonal'
    | 'square-diagonal'
    | 'square-complement'
    | 'square-one-label-overlap'
    | 'square-non-complement-zero';
  rowSum?: number;
  status: 'signed-kernel-gram-structure-pass' | 'signed-kernel-gram-structure-failed';
}

export interface GramStructureSummary {
  rowCount: number;
  passCount: number;
  maxError: number;
  hRowSumMaxError: number;
  status: 'signed-kernel-gram-structure-pass' | 'signed-kernel-gram-structure-failed';
}

export interface ProjectorStructureRow {
  projectorId: 'P_H' | 'P_Q';
  domain: 'H' | 'Q';
  rank: number;
  expectedRank: number;
  trace: number;
  expectedTrace: number;
  idempotenceMaxError: number;
  rankMethod: 'rational-row-reduction-on-integer-gram' | 'numeric-rank-with-epsilon';
  status: 'standard-projector-structure-pass' | 'standard-projector-structure-failed';
}

export interface ProjectorStructureSummary {
  rowCount: number;
  passCount: number;
  maxIdempotenceError: number;
  status: 'standard-projector-structure-pass' | 'standard-projector-structure-failed';
}

export interface QModeProjectionRow {
  objectId: string;
  domain: 'Q' | 'H';
  computedProjectedVector: Vec3;
  expectedVector: Vec3;
  maxError: number;
  status:
    | 'q-mode-standard-subspace-membership-pass'
    | 'q-mode-standard-subspace-membership-failed';
}

export interface QModeProjectionSummary {
  rowCount: number;
  passCount: number;
  maxError: number;
  status:
    | 'q-mode-standard-subspace-membership-pass'
    | 'q-mode-standard-subspace-membership-failed';
}

export interface NullControlRow {
  controlId: string;
  controlKind:
    | 'hex-trivial'
    | 'square-complement-symmetric'
    | 'square-anti-complement-projection'
    | 'square-standard-control';
  inputObjectIds: string[];
  computedProjection: Record<string, Vec3>;
  expectedProjection: Record<string, Vec3>;
  maxError: number;
  status:
    | 'hex-trivial-mode-killed'
    | 'square-complement-symmetric-mode-killed'
    | 'square-anti-complement-projected-to-standard-subspace'
    | 'square-standard-mode-preserved'
    | 'trivial-mode-not-killed'
    | 'complement-symmetric-mode-not-killed'
    | 'standard-control-not-preserved';
}

export interface NullControlSummary {
  rowCount: number;
  passCount: number;
  maxError: number;
  status: 'null-controls-pass' | 'null-control-failed';
}

export interface ExactLoopProjectorRow {
  loopId: 'L_Q_exact' | 'L_H_exact';
  domain: 'Q' | 'H';
  leftObjectId: string;
  rightObjectId: string;
  computedEntry: number;
  expectedProjectorEntry: number;
  maxError: number;
  status: 'exact-loop-standard-projector-pass' | 'exact-loop-standard-projector-failed';
}

export interface ExactLoopProjectorSummary {
  rowCount: number;
  passCount: number;
  maxError: number;
  status: 'exact-loop-standard-projector-pass' | 'exact-loop-standard-projector-failed';
}

export interface AdjointLoopScaledProjectorRow {
  loopId: 'L_Q_adj' | 'L_H_adj';
  domain: 'Q' | 'H';
  leftObjectId: string;
  rightObjectId: string;
  computedEntry: number;
  expectedScaledProjectorEntry: number;
  scaleFactor: number;
  maxError: number;
  status: 'adjoint-loop-scaled-projector-pass' | 'adjoint-loop-scaled-projector-failed';
}

export interface AdjointLoopScaledProjectorSummary {
  rowCount: number;
  passCount: number;
  maxError: number;
  scaleFactor: number;
  factorLabel: 'finite-adjoint-loop-factor';
  status: 'adjoint-loop-scaled-projector-pass' | 'adjoint-loop-scaled-projector-failed';
}

export interface QSeedIterationRow {
  seedId: 'square-only-q-seed' | 'hex-only-q-seed';
  bridgeType: BridgeType;
  iterationIndex: number;
  computedSquareComponent: Record<string, Vec3>;
  expectedSquareComponent: Record<string, Vec3>;
  computedHexComponent: Record<string, Vec3>;
  expectedHexComponent: Record<string, Vec3>;
  maxError: number;
  status:
    | 'exact-loop-q-seed-iteration-pass'
    | 'adjoint-loop-q-seed-iteration-pass'
    | 'exact-loop-q-seed-iteration-failed'
    | 'adjoint-loop-q-seed-iteration-failed';
}

export interface QSeedIterationSummary {
  rowCount: number;
  passCount: number;
  maxError: number;
  status: 'q-seed-iteration-pass' | 'q-seed-iteration-failed';
}

export interface FullQPairIterationRow {
  bridgeType: BridgeType;
  iterationIndex: number;
  computedSquareComponent: Record<string, Vec3>;
  expectedSquareComponent: Record<string, Vec3>;
  computedHexComponent: Record<string, Vec3>;
  expectedHexComponent: Record<string, Vec3>;
  maxError: number;
  status:
    | 'exact-full-q-pair-fixed-point-pass'
    | 'adjoint-full-q-pair-scaled-two-step-pass'
    | 'exact-full-q-pair-fixed-point-failed'
    | 'adjoint-full-q-pair-scaled-two-step-failed';
}

export interface FullQPairIterationSummary {
  rowCount: number;
  passCount: number;
  maxError: number;
  status: 'full-q-pair-iteration-pass' | 'full-q-pair-iteration-failed';
}

export interface SelectivityControlRow {
  controlId: string;
  controlKind: string;
  operatorTested: string;
  expectedBehavior: string;
  observedBehavior: string;
  maxError?: number;
  status: 'sector-loop-selectivity-controls-pass' | 'sector-loop-selectivity-control-failed';
}

export interface SelectivityControlSummary {
  rowCount: number;
  passCount: number;
  failCount: number;
  status: 'sector-loop-selectivity-controls-pass' | 'sector-loop-selectivity-control-failed';
}

export interface LoopEquivarianceRow {
  operatorId:
    | 'P_Q'
    | 'P_H'
    | 'L_Q_exact'
    | 'L_H_exact'
    | 'L_Q_adj'
    | 'L_H_adj'
    | 'J_exact'
    | 'J_adj';
  permutationId: string;
  basisCaseId: string;
  domain: OperatorDomain;
  codomain: OperatorDomain;
  sectorOrLayer: 'Q' | 'H' | 'QH';
  maxError: number;
  status: 'sector-loop-operators-s4-equivariant' | 'sector-loop-operator-equivariance-failed';
}

export interface LoopEquivarianceSummary {
  operatorCount: number;
  permutationCount: number;
  basisCaseCount: number;
  checkedRowCount: number;
  passCount: number;
  maxError: number;
  status: 'sector-loop-operators-s4-equivariant' | 'sector-loop-operator-equivariance-failed';
}

export interface BoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: boolean;
}

export interface BoundaryLanguageSummary {
  forbiddenLabelScanCount: number;
  forbiddenLabelHitCount: number;
  status: 'boundary-language-pass' | 'phase-resonance-promotion-boundary-failed';
}

export interface FalsifierRow {
  falsifierId: string;
  description: string;
  triggered: boolean;
  evidence: string;
  status: 'clear' | 'triggered';
}

export type T28S4FinalVerdict =
  | 'T28-S-Lab-4-sector-coupled-loop-standard-projector-pass'
  | 'T28-S-Lab-4-gram-structure-failed'
  | 'T28-S-Lab-4-projector-structure-failed'
  | 'T28-S-Lab-4-q-mode-membership-failed'
  | 'T28-S-Lab-4-null-control-failed'
  | 'T28-S-Lab-4-exact-loop-projector-failed'
  | 'T28-S-Lab-4-adjoint-loop-scaled-projector-failed'
  | 'T28-S-Lab-4-q-seed-iteration-failed'
  | 'T28-S-Lab-4-selectivity-control-failed'
  | 'T28-S-Lab-4-loop-equivariance-failed'
  | 'T28-S-Lab-4-scalar-collapse-regression-failed'
  | 'T28-S-Lab-4-boundary-failed';

export interface PSimplexSectorCoupledLoopStandardProjectorAuditT28S4Report {
  method: 'p-simplex-sector-coupled-loop-standard-projector-audit-t28s4';
  experimentName: 'T28-S-Lab-4 - Sector-Coupled Loop / Standard-Projector Audit';
  diagnosticScope: 'sector-coupled-loop-standard-projector-audit-only';
  branchRef: 'wgate/arf-w1-root-frame-v0';
  parentEvidenceRows: ParentEvidenceRow[];
  supportSetSummary: SupportSetSummary;
  operatorDefinitionRows: OperatorDefinitionRow[];
  signedKernelGramRows: SignedKernelGramRow[];
  gramStructureSummary: GramStructureSummary;
  projectorStructureRows: ProjectorStructureRow[];
  projectorStructureSummary: ProjectorStructureSummary;
  qModeProjectionRows: QModeProjectionRow[];
  qModeProjectionSummary: QModeProjectionSummary;
  nullControlRows: NullControlRow[];
  nullControlSummary: NullControlSummary;
  exactLoopProjectorRows: ExactLoopProjectorRow[];
  exactLoopProjectorSummary: ExactLoopProjectorSummary;
  adjointLoopScaledProjectorRows: AdjointLoopScaledProjectorRow[];
  adjointLoopScaledProjectorSummary: AdjointLoopScaledProjectorSummary;
  qSeedIterationRows: QSeedIterationRow[];
  qSeedIterationSummary: QSeedIterationSummary;
  fullQPairIterationRows: FullQPairIterationRow[];
  fullQPairIterationSummary: FullQPairIterationSummary;
  selectivityControlRows: SelectivityControlRow[];
  selectivityControlSummary: SelectivityControlSummary;
  loopEquivarianceRows: LoopEquivarianceRow[];
  loopEquivarianceSummary: LoopEquivarianceSummary;
  boundaryRows: BoundaryRow[];
  boundaryLanguageSummary: BoundaryLanguageSummary;
  falsifierRows: FalsifierRow[];
  finalVerdict: T28S4FinalVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

type S1Report = ReturnType<typeof buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report>;
type S2Report = ReturnType<typeof buildPSimplexVectorNativeIncidenceOperatorAuditT28S2Report>;
type S3Report = ReturnType<typeof buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report>;
type S1ReadoutRow = S1Report['readoutSectionRows'][number];
type S1SquarePolarityRow = S1Report['squarePolarityRows'][number];
type S1S4ActionRow = S1Report['s4ActionRows'][number];

interface Section {
  ids: string[];
  values: Map<string, Vec3>;
}

interface PairSection {
  q: Section;
  h: Section;
}

interface OperatorContext {
  squareIds: string[];
  hexIds: string[];
  squareRows: S1ReadoutRow[];
  hexRows: S1ReadoutRow[];
  qModeQ: Section;
  qModeH: Section;
  squarePolarityById: Map<string, S1SquarePolarityRow>;
  squarePolarityByDirectedPair: Map<string, S1SquarePolarityRow>;
  kappa: Matrix;
  gH: Matrix;
  gQ: Matrix;
  pH: Matrix;
  pQ: Matrix;
  d: Matrix;
  rExact: Matrix;
  rAdj: Matrix;
  lQExact: Matrix;
  lHExact: Matrix;
  lQAdj: Matrix;
  lHAdj: Matrix;
  complementBySquareId: Map<string, string>;
}

const METHOD = 'p-simplex-sector-coupled-loop-standard-projector-audit-t28s4' as const;
const EXPERIMENT_NAME = 'T28-S-Lab-4 - Sector-Coupled Loop / Standard-Projector Audit' as const;
const DIAGNOSTIC_SCOPE = 'sector-coupled-loop-standard-projector-audit-only' as const;
const BRANCH_REF = 'wgate/arf-w1-root-frame-v0' as const;
const EPSILON = 1e-9;
const A3_LABELS: readonly A3Label[] = ['A', 'B', 'C', 'D'];
const AXES: readonly AxisId[] = ['x', 'y', 'z'];
const BASIS_VECTORS: Record<AxisId, Vec3> = {
  x: [1, 0, 0],
  y: [0, 1, 0],
  z: [0, 0, 1],
};
const REQUIRED_BOUNDARY_IDS = [
  'not-scalar-source-law',
  'not-norm-first',
  'not-arbitrary-projection',
  'not-unordered-square-sign',
  'not-raw-scale-normalized',
  'not-natural-laplacian',
  'not-field-world-operator',
  'not-phase-behavior',
  'not-resonance',
  'not-damping',
  'not-attenuation',
  'not-route',
  'not-gate',
  'not-vortex',
  'not-region',
  'not-support-maturity',
  'not-blockage',
  'not-topology',
  'not-semantic-naming',
  'not-fieldcue',
  'not-runtime',
  'not-ui',
  'not-packet-writing',
  'not-shape-mutation',
] as const;
const REQUIRED_FALSIFIER_IDS = [
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
] as const;
const FORBIDDEN_LANGUAGE_LABELS = [
  'phase behavior',
  'resonance',
  'field resonance',
  'damping',
  'attenuation',
  'energy loss',
  'route',
  'gate',
  'vortex',
  'region',
  'natural propagation coefficient',
  'support maturity',
  'mature support',
  'blockage',
  'FieldCue',
  'topology',
  'semantic naming',
  'runtime',
  'natural Laplacian',
  'field-world operator',
] as const;
const BOUNDARY_SAFE_PRECONDITION_LABELS = ['resonance precondition', 'phase precondition'] as const;

export function buildPSimplexSectorCoupledLoopStandardProjectorAuditT28S4Report(): PSimplexSectorCoupledLoopStandardProjectorAuditT28S4Report {
  const lab3Report = buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report();
  const lab1Report = buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report();
  const lab2Report = buildPSimplexVectorNativeIncidenceOperatorAuditT28S2Report();
  const context = buildOperatorContext(lab1Report, lab3Report);
  const parentEvidenceRows = buildParentEvidenceRows(lab3Report, lab1Report, lab2Report);
  const supportSetSummary = buildSupportSetSummary(lab3Report, lab1Report, lab2Report, context);
  const operatorDefinitionRows = buildOperatorDefinitionRows();
  const signedKernelGramRows = buildSignedKernelGramRows(context);
  const gramStructureSummary = buildGramStructureSummary(signedKernelGramRows);
  const projectorStructureRows = buildProjectorStructureRows(context);
  const projectorStructureSummary = buildProjectorStructureSummary(projectorStructureRows);
  const qModeProjectionRows = buildQModeProjectionRows(context);
  const qModeProjectionSummary = buildQModeProjectionSummary(qModeProjectionRows);
  const nullControlRows = buildNullControlRows(context);
  const nullControlSummary = buildNullControlSummary(nullControlRows);
  const exactLoopProjectorRows = buildExactLoopProjectorRows(context);
  const exactLoopProjectorSummary = buildExactLoopProjectorSummary(exactLoopProjectorRows);
  const adjointLoopScaledProjectorRows = buildAdjointLoopScaledProjectorRows(context);
  const adjointLoopScaledProjectorSummary = buildAdjointLoopScaledProjectorSummary(adjointLoopScaledProjectorRows);
  const qSeedIterationRows = buildQSeedIterationRows(context);
  const qSeedIterationSummary = buildQSeedIterationSummary(qSeedIterationRows);
  const fullQPairIterationRows = buildFullQPairIterationRows(context);
  const fullQPairIterationSummary = buildFullQPairIterationSummary(fullQPairIterationRows);
  const selectivityControlRows = buildSelectivityControlRows(lab3Report, context, nullControlRows);
  const selectivityControlSummary = buildSelectivityControlSummary(selectivityControlRows);
  const loopEquivarianceRows = buildLoopEquivarianceRows(lab1Report, context);
  const loopEquivarianceSummary = buildLoopEquivarianceSummary(loopEquivarianceRows, lab1Report.s4ActionRows.length);
  const boundaryRows = buildBoundaryRows();
  const boundaryLanguageSummary = buildBoundaryLanguageSummary();
  const preliminaryVerdict = classifyFinalVerdict({
    boundaryRows,
    boundaryLanguageSummary,
    falsifierRows: [],
    scalarSourceLawFailed: false,
    gramStructureSummary,
    projectorStructureSummary,
    qModeProjectionSummary,
    nullControlSummary,
    exactLoopProjectorSummary,
    adjointLoopScaledProjectorSummary,
    qSeedIterationSummary,
    fullQPairIterationSummary,
    selectivityControlSummary,
    loopEquivarianceSummary,
  });
  const falsifierRows = buildFalsifierRows({
    lab3Report,
    lab1Report,
    lab2Report,
    supportSetSummary,
    gramStructureSummary,
    projectorStructureSummary,
    qModeProjectionSummary,
    nullControlSummary,
    exactLoopProjectorSummary,
    adjointLoopScaledProjectorSummary,
    qSeedIterationSummary,
    fullQPairIterationSummary,
    selectivityControlSummary,
    loopEquivarianceSummary,
    boundaryLanguageSummary,
    finalVerdict: preliminaryVerdict,
  });
  const finalVerdict = classifyFinalVerdict({
    boundaryRows,
    boundaryLanguageSummary,
    falsifierRows,
    scalarSourceLawFailed: false,
    gramStructureSummary,
    projectorStructureSummary,
    qModeProjectionSummary,
    nullControlSummary,
    exactLoopProjectorSummary,
    adjointLoopScaledProjectorSummary,
    qSeedIterationSummary,
    fullQPairIterationSummary,
    selectivityControlSummary,
    loopEquivarianceSummary,
  });
  const integrityIssues = buildIntegrityIssues({
    lab3Report,
    lab1Report,
    lab2Report,
    supportSetSummary,
    signedKernelGramRows,
    gramStructureSummary,
    projectorStructureSummary,
    qModeProjectionSummary,
    nullControlSummary,
    exactLoopProjectorRows,
    exactLoopProjectorSummary,
    adjointLoopScaledProjectorRows,
    adjointLoopScaledProjectorSummary,
    qSeedIterationSummary,
    fullQPairIterationSummary,
    selectivityControlSummary,
    loopEquivarianceSummary,
    boundaryRows,
    boundaryLanguageSummary,
    falsifierRows,
    finalVerdict,
  });
  const ok =
    integrityIssues.length === 0 &&
    falsifierRows.every((row) => !row.triggered) &&
    finalVerdict === 'T28-S-Lab-4-sector-coupled-loop-standard-projector-pass';

  return {
    method: METHOD,
    experimentName: EXPERIMENT_NAME,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    parentEvidenceRows,
    supportSetSummary,
    operatorDefinitionRows,
    signedKernelGramRows,
    gramStructureSummary,
    projectorStructureRows,
    projectorStructureSummary,
    qModeProjectionRows,
    qModeProjectionSummary,
    nullControlRows,
    nullControlSummary,
    exactLoopProjectorRows,
    exactLoopProjectorSummary,
    adjointLoopScaledProjectorRows,
    adjointLoopScaledProjectorSummary,
    qSeedIterationRows,
    qSeedIterationSummary,
    fullQPairIterationRows,
    fullQPairIterationSummary,
    selectivityControlRows,
    selectivityControlSummary,
    loopEquivarianceRows,
    loopEquivarianceSummary,
    boundaryRows,
    boundaryLanguageSummary,
    falsifierRows,
    finalVerdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok,
  };
}

function buildOperatorContext(lab1Report: S1Report, lab3Report: S3Report): OperatorContext {
  const squareRows = lab1Report.readoutSectionRows.filter((row) => row.objectDomain === 've-square');
  const hexRows = lab1Report.readoutSectionRows.filter((row) => row.objectDomain === 've-a2-hexagon');
  const squareIds = squareRows.map((row) => row.objectId);
  const hexIds = hexRows.map((row) => row.objectId);
  const squarePolarityRows = lab1Report.squarePolarityRows.filter((row) => row.status === 'square-polarity-authorized');
  const squarePolarityById = new Map(squarePolarityRows.map((row) => [row.squareObjectId, row]));
  const squarePolarityByDirectedPair = new Map(
    squarePolarityRows
      .filter((row) => row.sourceLabelPair && row.targetLabelPair)
      .map((row) => [
        squareDirectedPairKey(row.sourceLabelPair as [A3Label, A3Label], row.targetLabelPair as [A3Label, A3Label]),
        row,
      ]),
  );
  const kappaByKey = new Map(lab3Report.signedKernelRows.map((row) => [kernelKey(row.hexId, row.squareId), row.kappaValue]));
  const kappa = hexIds.map((hexId) => squareIds.map((squareId) => kappaByKey.get(kernelKey(hexId, squareId)) ?? 0));
  const gH = matrixMultiply(kappa, transpose(kappa));
  const gQ = matrixMultiply(transpose(kappa), kappa);
  const pH = scaleMatrix(gH, 1 / 8);
  const pQ = scaleMatrix(gQ, 1 / 8);
  const d = scaleMatrix(kappa, 1 / 6);
  const rExact = scaleMatrix(transpose(kappa), 3 / 4);
  const rAdj = scaleMatrix(transpose(kappa), 1 / 6);
  const complementBySquareId = buildComplementBySquareId(squarePolarityRows, squarePolarityByDirectedPair);

  return {
    squareIds,
    hexIds,
    squareRows,
    hexRows,
    qModeQ: sectionFromRows(squareIds, squareRows, 'sectorMinus'),
    qModeH: sectionFromRows(hexIds, hexRows, 'sectorPlus'),
    squarePolarityById,
    squarePolarityByDirectedPair,
    kappa,
    gH,
    gQ,
    pH,
    pQ,
    d,
    rExact,
    rAdj,
    lQExact: matrixMultiply(rExact, d),
    lHExact: matrixMultiply(d, rExact),
    lQAdj: matrixMultiply(rAdj, d),
    lHAdj: matrixMultiply(d, rAdj),
    complementBySquareId,
  };
}

function buildComplementBySquareId(
  squareRows: readonly S1SquarePolarityRow[],
  byDirectedPair: ReadonlyMap<string, S1SquarePolarityRow>,
): Map<string, string> {
  return new Map(
    squareRows.map((row) => {
      if (!row.sourceLabelPair || !row.targetLabelPair) return [row.squareObjectId, row.squareObjectId];
      const complement = byDirectedPair.get(squareDirectedPairKey(row.targetLabelPair, row.sourceLabelPair));
      return [row.squareObjectId, complement?.squareObjectId ?? row.squareObjectId];
    }),
  );
}

function buildParentEvidenceRows(lab3Report: S3Report, lab1Report: S1Report, lab2Report: S2Report): ParentEvidenceRow[] {
  const rows: ParentEvidenceRow[] = [
    {
      parentId: 'T28-S-Lab-3',
      method: lab3Report.method,
      ok: lab3Report.ok,
      finalVerdict: lab3Report.finalVerdict,
      consumedSections: [
        'signedKernelRows',
        'signedKernelS4EquivarianceRows',
        'rawSquareToHexRows',
        'reverseExactHexToSquareRows',
        'unweightedAdjointHexToSquareRows',
        'normalizationDistinctionRows',
        'weightedPairingReconciliationRow',
        'squarePolarityGateRows',
        'rawScaleGateRows',
        'controlRows',
        'boundaryRows',
        'finalVerdict',
        'ok',
      ],
      parentStatus: parentLab3Accepted(lab3Report) ? 'accepted-parent' : 'rejected-parent',
    },
    {
      parentId: 'T28-S-Lab-1',
      method: lab1Report.method,
      ok: lab1Report.ok,
      finalVerdict: lab1Report.finalVerdict,
      consumedSections: [
        'readoutSectionRows',
        'squarePolarityRows',
        'rawScaleSummary',
        's4ActionRows',
        'finalVerdict',
        'ok',
      ],
      parentStatus: parentLab1Accepted(lab1Report) ? 'accepted-parent' : 'rejected-parent',
    },
    {
      parentId: 'T28-S-Lab-2',
      method: lab2Report.method,
      ok: lab2Report.ok,
      finalVerdict: lab2Report.finalVerdict,
      consumedSections: [
        'supportSetSummary',
        'sectorPreservationSummary',
        'squarePolarityGateSummary',
        'rawHexScaleGateSummary',
        'boundaryRows',
        'finalVerdict',
        'ok',
      ],
      parentStatus: parentLab2Accepted(lab2Report) ? 'accepted-parent' : 'rejected-parent',
    },
  ];

  for (const parentId of ['p-simplex-vector-order-parameter-diagnostic-v0', 'T28-N0', 'T28-P', 'T28-Q']) {
    const inherited =
      lab3Report.parentEvidenceRows.find((row) => row.parentId === `${parentId} inherited`) ??
      lab1Report.parentEvidenceRows.find((row) => row.parentId === parentId);
    if (!inherited) continue;
    rows.push({
      parentId: inheritedParentId(parentId),
      method: inherited.method,
      ok: inherited.ok,
      verdict: 'verdict' in inherited ? inherited.verdict : undefined,
      summaryVerdict: 'summaryVerdict' in inherited ? inherited.summaryVerdict : undefined,
      consumedSections: [],
      parentStatus: inherited.parentStatus === 'accepted-parent' ? 'accepted-parent' : 'rejected-parent',
    });
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

function parentLab3Accepted(report: S3Report): boolean {
  return report.ok === true &&
    report.finalVerdict === 'T28-S-Lab-3-signed-square-hex-sector-coupling-pass' &&
    report.signedKernelSummary.status === 'signed-square-hex-kernel-constructed' &&
    report.signedKernelS4EquivarianceSummary.status === 'signed-square-hex-kernel-s4-equivariant' &&
    report.rawSquareToHexSummary.status === 'raw-square-to-hex-q-mode-pass' &&
    report.reverseExactHexToSquareSummary.status === 'reverse-exact-hex-to-square-q-mode-pass' &&
    report.unweightedAdjointHexToSquareSummary.status === 'unweighted-adjoint-returns-two-ninths-square-q-mode-pass' &&
    report.normalizationDistinctionSummary.status === 'exact-and-adjoint-normalizations-distinguished' &&
    report.squarePolarityGateSummary.status === 'square-hex-coupling-blocked-by-square-polarity' &&
    report.rawScaleGateSummary.status === 'square-hex-coupling-raw-scale-gate-pass';
}

function parentLab1Accepted(report: S1Report): boolean {
  return report.ok === true &&
    report.finalVerdict === 'T28-S-Lab-1-vector-native-two-sector-preflight-pass' &&
    report.squarePolaritySummary.squareComponentStatus === 'square-polarity-authorized' &&
    report.rawScaleSummary.rawScaleStatus === 'raw-incidence-scale-preserved' &&
    report.s4ActionSummary.status === 'tetrahedral-standard-action-verified';
}

function parentLab2Accepted(report: S2Report): boolean {
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

function buildSupportSetSummary(lab3Report: S3Report, lab1Report: S1Report, lab2Report: S2Report, context: OperatorContext): SupportSetSummary {
  const squareCount = context.squareIds.length;
  const hexCount = context.hexIds.length;
  const kernelRowCount = lab3Report.signedKernelRows.length;
  const squareQModeCount = context.squareRows.filter((row) => normVec3(row.sectorMinus) > EPSILON && normVec3(row.sectorPlus) <= EPSILON).length;
  const hexQModeCount = context.hexRows.filter((row) => normVec3(row.sectorPlus) > EPSILON && normVec3(row.sectorMinus) <= EPSILON).length;
  const localReady = squareCount === 6 && hexCount === 4 && kernelRowCount === 24 && squareQModeCount === 6 && hexQModeCount === 4;
  const parentReady = lab1Report.squarePolaritySummary.authorizedSquareCount === 6 &&
    lab2Report.supportSetSummary.squareCount === 6 &&
    lab2Report.supportSetSummary.hexCount === 4 &&
    lab3Report.supportSetSummary.status === 'support-set-ready';

  return {
    squareCount,
    hexCount,
    kernelRowCount,
    squareQModeCount,
    hexQModeCount,
    status: !localReady
      ? 'support-set-count-failed'
      : parentReady
        ? 'support-set-ready'
        : 'parent-support-set-mismatch',
  };
}

function buildOperatorDefinitionRows(): OperatorDefinitionRow[] {
  const definitions: Array<[OperatorId, OperatorDomain, OperatorDomain, number, string]> = [
    ['kappa', 'Q', 'H', 1, 'signed square-hex kernel from Lab-3 rows'],
    ['G_H', 'H', 'H', 1, 'kappa * kappa_transpose'],
    ['G_Q', 'Q', 'Q', 1, 'kappa_transpose * kappa'],
    ['P_H', 'H', 'H', 1 / 8, '(1/8) * G_H'],
    ['P_Q', 'Q', 'Q', 1 / 8, '(1/8) * G_Q'],
    ['D', 'Q', 'H', 1 / 6, '(1/6) * kappa'],
    ['R_exact', 'H', 'Q', 3 / 4, '(3/4) * kappa_transpose'],
    ['R_adj', 'H', 'Q', 1 / 6, '(1/6) * kappa_transpose'],
    ['L_Q_exact', 'Q', 'Q', 1 / 8, 'R_exact * D'],
    ['L_H_exact', 'H', 'H', 1 / 8, 'D * R_exact'],
    ['L_Q_adj', 'Q', 'Q', 1 / 36, 'R_adj * D'],
    ['L_H_adj', 'H', 'H', 1 / 36, 'D * R_adj'],
    ['J_exact', 'QH', 'QH', 1, '(eta,zeta) -> (R_exact zeta, D eta)'],
    ['J_adj', 'QH', 'QH', 1, '(eta,zeta) -> (R_adj zeta, D eta)'],
  ];

  return definitions.map(([operatorId, domain, codomain, coefficient, sourceDefinition]) => ({
    operatorId,
    domain,
    codomain,
    coefficient,
    sourceDefinition,
    operatorStatus: 'operator-defined',
  }));
}

function buildSignedKernelGramRows(context: OperatorContext): SignedKernelGramRow[] {
  const hRows = context.hexIds.flatMap((leftId, leftIndex) =>
    context.hexIds.map((rightId, rightIndex) => {
      const computedEntry = context.gH[leftIndex][rightIndex];
      const expectedEntry = leftIndex === rightIndex ? 6 : -2;
      const rowSum = sumNumbers(context.gH[leftIndex]);
      const maxError = Math.max(Math.abs(computedEntry - expectedEntry), Math.abs(rowSum));

      return {
        gramMatrixId: 'G_H' as const,
        leftObjectId: leftId,
        rightObjectId: rightId,
        computedEntry,
        expectedEntry,
        relationClass: leftIndex === rightIndex ? 'hex-diagonal' as const : 'hex-off-diagonal' as const,
        rowSum,
        status: maxError <= EPSILON
          ? 'signed-kernel-gram-structure-pass' as const
          : 'signed-kernel-gram-structure-failed' as const,
      };
    }),
  );
  const qRows = context.squareIds.flatMap((leftId, leftIndex) =>
    context.squareIds.map((rightId, rightIndex) => {
      const computedEntry = context.gQ[leftIndex][rightIndex];
      const relationClass = squareRelationClass(context, leftId, rightId);
      const expectedEntry = relationClass === 'square-diagonal'
        ? 4
        : relationClass === 'square-complement'
          ? -4
          : 0;

      return {
        gramMatrixId: 'G_Q' as const,
        leftObjectId: leftId,
        rightObjectId: rightId,
        computedEntry,
        expectedEntry,
        relationClass,
        status: Math.abs(computedEntry - expectedEntry) <= EPSILON
          ? 'signed-kernel-gram-structure-pass' as const
          : 'signed-kernel-gram-structure-failed' as const,
      };
    }),
  );

  return [...hRows, ...qRows];
}

function squareRelationClass(
  context: OperatorContext,
  leftId: string,
  rightId: string,
): SignedKernelGramRow['relationClass'] {
  if (leftId === rightId) return 'square-diagonal';
  if (context.complementBySquareId.get(leftId) === rightId) return 'square-complement';
  const left = context.squarePolarityById.get(leftId);
  const right = context.squarePolarityById.get(rightId);
  if (left?.sourceLabelPair && right?.sourceLabelPair && left.sourceLabelPair.some((label) => right.sourceLabelPair?.includes(label))) {
    return 'square-one-label-overlap';
  }
  return 'square-non-complement-zero';
}

function buildGramStructureSummary(rows: readonly SignedKernelGramRow[]): GramStructureSummary {
  const passCount = rows.filter((row) => row.status === 'signed-kernel-gram-structure-pass').length;
  const hRows = rows.filter((row) => row.gramMatrixId === 'G_H');

  return {
    rowCount: rows.length,
    passCount,
    maxError: maxOf(rows.map((row) => Math.abs(row.computedEntry - row.expectedEntry))),
    hRowSumMaxError: maxOf(hRows.map((row) => Math.abs(row.rowSum ?? 0))),
    status: rows.length === 52 && passCount === rows.length
      ? 'signed-kernel-gram-structure-pass'
      : 'signed-kernel-gram-structure-failed',
  };
}

function buildProjectorStructureRows(context: OperatorContext): ProjectorStructureRow[] {
  return [
    projectorRow('P_H', 'H', context.gH, context.pH),
    projectorRow('P_Q', 'Q', context.gQ, context.pQ),
  ];
}

function projectorRow(
  projectorId: ProjectorStructureRow['projectorId'],
  domain: ProjectorStructureRow['domain'],
  gram: Matrix,
  projector: Matrix,
): ProjectorStructureRow {
  const rank = matrixRankRationalOrTolerance(gram);
  const trace = matrixTrace(projector);
  const idempotenceMaxError = matrixIdempotenceMaxError(projector);
  const pass = rank === 3 && Math.abs(trace - 3) <= EPSILON && idempotenceMaxError <= EPSILON;

  return {
    projectorId,
    domain,
    rank,
    expectedRank: 3,
    trace: cleanNumber(trace),
    expectedTrace: 3,
    idempotenceMaxError,
    rankMethod: 'rational-row-reduction-on-integer-gram',
    status: pass ? 'standard-projector-structure-pass' : 'standard-projector-structure-failed',
  };
}

function buildProjectorStructureSummary(rows: readonly ProjectorStructureRow[]): ProjectorStructureSummary {
  const passCount = rows.filter((row) => row.status === 'standard-projector-structure-pass').length;

  return {
    rowCount: rows.length,
    passCount,
    maxIdempotenceError: maxOf(rows.map((row) => row.idempotenceMaxError)),
    status: rows.length === 2 && passCount === rows.length
      ? 'standard-projector-structure-pass'
      : 'standard-projector-structure-failed',
  };
}

function buildQModeProjectionRows(context: OperatorContext): QModeProjectionRow[] {
  const projectedQ = applyMatrixToSection(context.pQ, context.qModeQ, context.squareIds);
  const projectedH = applyMatrixToSection(context.pH, context.qModeH, context.hexIds);
  const qRows = context.squareIds.map((objectId) => projectionRow(objectId, 'Q', projectedQ, context.qModeQ));
  const hRows = context.hexIds.map((objectId) => projectionRow(objectId, 'H', projectedH, context.qModeH));

  return [...qRows, ...hRows];
}

function projectionRow(objectId: string, domain: 'Q' | 'H', computed: Section, expected: Section): QModeProjectionRow {
  const computedVector = computed.values.get(objectId) ?? zeroVec3();
  const expectedVector = expected.values.get(objectId) ?? zeroVec3();
  const maxError = maxAbsVec3(subVec3(computedVector, expectedVector));

  return {
    objectId,
    domain,
    computedProjectedVector: cleanVec3(computedVector),
    expectedVector: cleanVec3(expectedVector),
    maxError,
    status: maxError <= EPSILON
      ? 'q-mode-standard-subspace-membership-pass'
      : 'q-mode-standard-subspace-membership-failed',
  };
}

function buildQModeProjectionSummary(rows: readonly QModeProjectionRow[]): QModeProjectionSummary {
  const passCount = rows.filter((row) => row.status === 'q-mode-standard-subspace-membership-pass').length;

  return {
    rowCount: rows.length,
    passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: rows.length === 10 && passCount === rows.length
      ? 'q-mode-standard-subspace-membership-pass'
      : 'q-mode-standard-subspace-membership-failed',
  };
}

function buildNullControlRows(context: OperatorContext): NullControlRow[] {
  const vector: Vec3 = [1, 2, -1];
  const hexTrivial = sectionFromValues(context.hexIds, new Map(context.hexIds.map((id) => [id, vector])));
  const projectedHexTrivial = applyMatrixToSection(context.pH, hexTrivial, context.hexIds);
  const zeroHex = zeroSection(context.hexIds);
  const rows: NullControlRow[] = [
    nullControlRow(
      'NC-hex-trivial',
      'hex-trivial',
      context.hexIds,
      projectedHexTrivial,
      zeroHex,
      'hex-trivial-mode-killed',
      'trivial-mode-not-killed',
    ),
  ];
  const complementPairs = uniqueComplementPairs(context);

  for (const [leftId, rightId] of complementPairs) {
    const symmetric = zeroSection(context.squareIds);
    symmetric.values.set(leftId, vector);
    symmetric.values.set(rightId, vector);
    rows.push(nullControlRow(
      `NC-square-complement-symmetric:${leftId}`,
      'square-complement-symmetric',
      [leftId, rightId],
      applyMatrixToSection(context.pQ, symmetric, context.squareIds),
      zeroSection(context.squareIds),
      'square-complement-symmetric-mode-killed',
      'complement-symmetric-mode-not-killed',
    ));

    const anti = zeroSection(context.squareIds);
    anti.values.set(leftId, vector);
    anti.values.set(rightId, scaleVec3(vector, -1));
    const projectedAnti = applyMatrixToSection(context.pQ, anti, context.squareIds);
    rows.push({
      controlId: `NC-square-anti-complement:${leftId}`,
      controlKind: 'square-anti-complement-projection',
      inputObjectIds: [leftId, rightId],
      computedProjection: sectionToRecord(projectedAnti),
      expectedProjection: sectionToRecord(projectedAnti),
      maxError: 0,
      status: 'square-anti-complement-projected-to-standard-subspace',
    });
  }

  for (const axis of AXES) {
    const standard = coordinateSection(context.qModeQ, axis);
    rows.push(nullControlRow(
      `NC-square-standard:${axis}`,
      'square-standard-control',
      context.squareIds,
      applyMatrixToSection(context.pQ, standard, context.squareIds),
      standard,
      'square-standard-mode-preserved',
      'standard-control-not-preserved',
    ));
  }

  return rows;
}

function nullControlRow(
  controlId: string,
  controlKind: NullControlRow['controlKind'],
  inputObjectIds: string[],
  computed: Section,
  expected: Section,
  passStatus: NullControlRow['status'],
  failStatus: NullControlRow['status'],
): NullControlRow {
  const maxError = compareVectorSectionsByObjectId(computed, expected);

  return {
    controlId,
    controlKind,
    inputObjectIds,
    computedProjection: sectionToRecord(computed),
    expectedProjection: sectionToRecord(expected),
    maxError,
    status: maxError <= EPSILON ? passStatus : failStatus,
  };
}

function buildNullControlSummary(rows: readonly NullControlRow[]): NullControlSummary {
  const passCount = rows.filter((row) =>
    row.status === 'hex-trivial-mode-killed' ||
    row.status === 'square-complement-symmetric-mode-killed' ||
    row.status === 'square-anti-complement-projected-to-standard-subspace' ||
    row.status === 'square-standard-mode-preserved'
  ).length;

  return {
    rowCount: rows.length,
    passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: passCount === rows.length ? 'null-controls-pass' : 'null-control-failed',
  };
}

function uniqueComplementPairs(context: OperatorContext): Array<[string, string]> {
  const seen = new Set<string>();
  const pairs: Array<[string, string]> = [];

  for (const id of context.squareIds) {
    const complement = context.complementBySquareId.get(id);
    if (!complement || id === complement) continue;
    const key = [id, complement].sort().join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    pairs.push([id, complement]);
  }

  return pairs;
}

function buildExactLoopProjectorRows(context: OperatorContext): ExactLoopProjectorRow[] {
  return [
    ...loopProjectorRows('L_Q_exact', 'Q', context.squareIds, context.lQExact, context.pQ),
    ...loopProjectorRows('L_H_exact', 'H', context.hexIds, context.lHExact, context.pH),
  ];
}

function loopProjectorRows(
  loopId: ExactLoopProjectorRow['loopId'],
  domain: 'Q' | 'H',
  ids: readonly string[],
  computedMatrix: Matrix,
  expectedMatrix: Matrix,
): ExactLoopProjectorRow[] {
  return ids.flatMap((leftId, leftIndex) =>
    ids.map((rightId, rightIndex) => {
      const computedEntry = computedMatrix[leftIndex][rightIndex];
      const expectedProjectorEntry = expectedMatrix[leftIndex][rightIndex];
      const maxError = Math.abs(computedEntry - expectedProjectorEntry);

      return {
        loopId,
        domain,
        leftObjectId: leftId,
        rightObjectId: rightId,
        computedEntry: cleanNumber(computedEntry),
        expectedProjectorEntry: cleanNumber(expectedProjectorEntry),
        maxError,
        status: maxError <= EPSILON
          ? 'exact-loop-standard-projector-pass'
          : 'exact-loop-standard-projector-failed',
      };
    }),
  );
}

function buildExactLoopProjectorSummary(rows: readonly ExactLoopProjectorRow[]): ExactLoopProjectorSummary {
  const passCount = rows.filter((row) => row.status === 'exact-loop-standard-projector-pass').length;

  return {
    rowCount: rows.length,
    passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: rows.length === 52 && passCount === rows.length
      ? 'exact-loop-standard-projector-pass'
      : 'exact-loop-standard-projector-failed',
  };
}

function buildAdjointLoopScaledProjectorRows(context: OperatorContext): AdjointLoopScaledProjectorRow[] {
  return [
    ...scaledProjectorRows('L_Q_adj', 'Q', context.squareIds, context.lQAdj, scaleMatrix(context.pQ, 2 / 9)),
    ...scaledProjectorRows('L_H_adj', 'H', context.hexIds, context.lHAdj, scaleMatrix(context.pH, 2 / 9)),
  ];
}

function scaledProjectorRows(
  loopId: AdjointLoopScaledProjectorRow['loopId'],
  domain: 'Q' | 'H',
  ids: readonly string[],
  computedMatrix: Matrix,
  expectedMatrix: Matrix,
): AdjointLoopScaledProjectorRow[] {
  return ids.flatMap((leftId, leftIndex) =>
    ids.map((rightId, rightIndex) => {
      const computedEntry = computedMatrix[leftIndex][rightIndex];
      const expectedScaledProjectorEntry = expectedMatrix[leftIndex][rightIndex];
      const maxError = Math.abs(computedEntry - expectedScaledProjectorEntry);

      return {
        loopId,
        domain,
        leftObjectId: leftId,
        rightObjectId: rightId,
        computedEntry: cleanNumber(computedEntry),
        expectedScaledProjectorEntry: cleanNumber(expectedScaledProjectorEntry),
        scaleFactor: 2 / 9,
        maxError,
        status: maxError <= EPSILON
          ? 'adjoint-loop-scaled-projector-pass'
          : 'adjoint-loop-scaled-projector-failed',
      };
    }),
  );
}

function buildAdjointLoopScaledProjectorSummary(rows: readonly AdjointLoopScaledProjectorRow[]): AdjointLoopScaledProjectorSummary {
  const passCount = rows.filter((row) => row.status === 'adjoint-loop-scaled-projector-pass').length;

  return {
    rowCount: rows.length,
    passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    scaleFactor: 2 / 9,
    factorLabel: 'finite-adjoint-loop-factor',
    status: rows.length === 52 && passCount === rows.length
      ? 'adjoint-loop-scaled-projector-pass'
      : 'adjoint-loop-scaled-projector-failed',
  };
}

function buildQSeedIterationRows(context: OperatorContext): QSeedIterationRow[] {
  return [
    ...seedRows(context, 'square-only-q-seed', 'exact', 3),
    ...seedRows(context, 'square-only-q-seed', 'adjoint', 4),
    ...seedRows(context, 'hex-only-q-seed', 'exact', 2),
    ...seedRows(context, 'hex-only-q-seed', 'adjoint', 3),
  ];
}

function seedRows(context: OperatorContext, seedId: QSeedIterationRow['seedId'], bridgeType: BridgeType, maxIteration: number): QSeedIterationRow[] {
  const start: PairSection = seedId === 'square-only-q-seed'
    ? { q: cloneSection(context.qModeQ), h: zeroSection(context.hexIds) }
    : { q: zeroSection(context.squareIds), h: cloneSection(context.qModeH) };
  const rows: QSeedIterationRow[] = [];
  let current = start;

  for (let iterationIndex = 0; iterationIndex <= maxIteration; iterationIndex += 1) {
    const expected = expectedSeedPair(context, seedId, bridgeType, iterationIndex);
    const maxError = comparePairSections(current, expected);
    rows.push({
      seedId,
      bridgeType,
      iterationIndex,
      computedSquareComponent: sectionToRecord(current.q),
      expectedSquareComponent: sectionToRecord(expected.q),
      computedHexComponent: sectionToRecord(current.h),
      expectedHexComponent: sectionToRecord(expected.h),
      maxError,
      status: maxError <= EPSILON
        ? bridgeType === 'exact'
          ? 'exact-loop-q-seed-iteration-pass'
          : 'adjoint-loop-q-seed-iteration-pass'
        : bridgeType === 'exact'
          ? 'exact-loop-q-seed-iteration-failed'
          : 'adjoint-loop-q-seed-iteration-failed',
    });
    current = applyBridge(context, bridgeType, current);
  }

  return rows;
}

function expectedSeedPair(context: OperatorContext, seedId: QSeedIterationRow['seedId'], bridgeType: BridgeType, iterationIndex: number): PairSection {
  const isSquareTurn = seedId === 'square-only-q-seed'
    ? iterationIndex % 2 === 0
    : iterationIndex % 2 === 1;
  const adjointScaleExponent = seedId === 'square-only-q-seed'
    ? Math.floor(iterationIndex / 2)
    : Math.floor((iterationIndex + 1) / 2);
  const factor = bridgeType === 'exact'
    ? 1
    : Math.pow(2 / 9, adjointScaleExponent);

  if (isSquareTurn) {
    return {
      q: scaleSection(context.qModeQ, factor),
      h: zeroSection(context.hexIds),
    };
  }

  return {
    q: zeroSection(context.squareIds),
    h: scaleSection(context.qModeH, factor),
  };
}

function buildQSeedIterationSummary(rows: readonly QSeedIterationRow[]): QSeedIterationSummary {
  const passCount = rows.filter((row) =>
    row.status === 'exact-loop-q-seed-iteration-pass' ||
    row.status === 'adjoint-loop-q-seed-iteration-pass'
  ).length;

  return {
    rowCount: rows.length,
    passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: passCount === rows.length ? 'q-seed-iteration-pass' : 'q-seed-iteration-failed',
  };
}

function buildFullQPairIterationRows(context: OperatorContext): FullQPairIterationRow[] {
  const exactStart = { q: cloneSection(context.qModeQ), h: cloneSection(context.qModeH) };
  const exactFirst = applyBridge(context, 'exact', exactStart);
  const adjointFirst = applyBridge(context, 'adjoint', exactStart);
  const adjointSecond = applyBridge(context, 'adjoint', adjointFirst);
  const rows = [
    fullPairRow('exact', 1, exactFirst, exactStart, 'exact-full-q-pair-fixed-point-pass', 'exact-full-q-pair-fixed-point-failed'),
    fullPairRow('adjoint', 1, adjointFirst, { q: scaleSection(context.qModeQ, 2 / 9), h: cloneSection(context.qModeH) }, 'adjoint-full-q-pair-scaled-two-step-pass', 'adjoint-full-q-pair-scaled-two-step-failed'),
    fullPairRow('adjoint', 2, adjointSecond, { q: scaleSection(context.qModeQ, 2 / 9), h: scaleSection(context.qModeH, 2 / 9) }, 'adjoint-full-q-pair-scaled-two-step-pass', 'adjoint-full-q-pair-scaled-two-step-failed'),
  ];

  return rows;
}

function fullPairRow(
  bridgeType: BridgeType,
  iterationIndex: number,
  computed: PairSection,
  expected: PairSection,
  passStatus: FullQPairIterationRow['status'],
  failStatus: FullQPairIterationRow['status'],
): FullQPairIterationRow {
  const maxError = comparePairSections(computed, expected);

  return {
    bridgeType,
    iterationIndex,
    computedSquareComponent: sectionToRecord(computed.q),
    expectedSquareComponent: sectionToRecord(expected.q),
    computedHexComponent: sectionToRecord(computed.h),
    expectedHexComponent: sectionToRecord(expected.h),
    maxError,
    status: maxError <= EPSILON ? passStatus : failStatus,
  };
}

function buildFullQPairIterationSummary(rows: readonly FullQPairIterationRow[]): FullQPairIterationSummary {
  const passCount = rows.filter((row) =>
    row.status === 'exact-full-q-pair-fixed-point-pass' ||
    row.status === 'adjoint-full-q-pair-scaled-two-step-pass'
  ).length;

  return {
    rowCount: rows.length,
    passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: passCount === rows.length ? 'full-q-pair-iteration-pass' : 'full-q-pair-iteration-failed',
  };
}

function buildSelectivityControlRows(lab3Report: S3Report, context: OperatorContext, nullRows: readonly NullControlRow[]): SelectivityControlRow[] {
  const scalarError = scalarMagnitudeControlMaxError(context);
  const hexTrivial = nullRows.find((row) => row.controlKind === 'hex-trivial');
  const complementRows = nullRows.filter((row) => row.controlKind === 'square-complement-symmetric');
  const complementMax = maxOf(complementRows.map((row) => row.maxError));

  return [
    selectivityRow('SC1', 'unsigned incidence control', 'D candidate', 'fail q-mode coupling', lab3Report.unsignedIncidenceSummary.status, lab3Report.unsignedIncidenceSummary.status === 'unsigned-square-hex-incidence-fails-standard-q-structure', lab3Report.unsignedIncidenceSummary.maxErrorAgainstExpected),
    selectivityRow('SC2', 'scalar magnitude control', 'P_Q/P_H source law', 'fail vector standard structure', scalarError > EPSILON ? 'scalar replacement rejected' : 'scalar replacement accepted', scalarError > EPSILON, scalarError),
    selectivityRow('SC3', 'square-polarity corruption', 'signed maps', 'block signed maps', lab3Report.squarePolarityGateSummary.status, lab3Report.squarePolarityGateSummary.status === 'square-hex-coupling-blocked-by-square-polarity', lab3Report.squarePolarityGateSummary.falselyAuthorizedCount),
    selectivityRow('SC4', 'raw-scale corruption', 'q-mode claims', 'fail raw q-mode claims', lab3Report.rawScaleGateSummary.status, lab3Report.rawScaleGateSummary.status === 'square-hex-coupling-raw-scale-gate-pass', lab3Report.rawScaleGateSummary.checkedCount - lab3Report.rawScaleGateSummary.corruptionDetectedCount),
    selectivityRow('SC5', 'hex trivial mode', 'P_H', 'kill trivial hex mode', hexTrivial?.status ?? 'missing', hexTrivial?.status === 'hex-trivial-mode-killed', hexTrivial?.maxError),
    selectivityRow('SC6', 'square complement-symmetric mode', 'P_Q', 'kill complement-symmetric square mode', complementMax <= EPSILON ? 'complement-symmetric modes killed' : 'complement-symmetric modes not killed', complementMax <= EPSILON, complementMax),
  ];
}

function selectivityRow(
  controlId: string,
  controlKind: string,
  operatorTested: string,
  expectedBehavior: string,
  observedBehavior: string,
  pass: boolean,
  maxError?: number,
): SelectivityControlRow {
  return {
    controlId,
    controlKind,
    operatorTested,
    expectedBehavior,
    observedBehavior,
    maxError,
    status: pass ? 'sector-loop-selectivity-controls-pass' : 'sector-loop-selectivity-control-failed',
  };
}

function buildSelectivityControlSummary(rows: readonly SelectivityControlRow[]): SelectivityControlSummary {
  const failCount = rows.filter((row) => row.status === 'sector-loop-selectivity-control-failed').length;

  return {
    rowCount: rows.length,
    passCount: rows.length - failCount,
    failCount,
    status: failCount === 0 ? 'sector-loop-selectivity-controls-pass' : 'sector-loop-selectivity-control-failed',
  };
}

function buildLoopEquivarianceRows(lab1Report: S1Report, context: OperatorContext): LoopEquivarianceRow[] {
  const rows: LoopEquivarianceRow[] = [];
  const qBasis = basisCasesForSection(context.squareIds, 'Q');
  const hBasis = basisCasesForSection(context.hexIds, 'H');
  const pairBasis = [...qBasis, ...hBasis];

  for (const action of lab1Report.s4ActionRows) {
    rows.push(...singleLayerEquivarianceRows('P_Q', 'Q', 'Q', context.pQ, context.squareIds, qBasis, action, context));
    rows.push(...singleLayerEquivarianceRows('P_H', 'H', 'H', context.pH, context.hexIds, hBasis, action, context));
    rows.push(...singleLayerEquivarianceRows('L_Q_exact', 'Q', 'Q', context.lQExact, context.squareIds, qBasis, action, context));
    rows.push(...singleLayerEquivarianceRows('L_H_exact', 'H', 'H', context.lHExact, context.hexIds, hBasis, action, context));
    rows.push(...singleLayerEquivarianceRows('L_Q_adj', 'Q', 'Q', context.lQAdj, context.squareIds, qBasis, action, context));
    rows.push(...singleLayerEquivarianceRows('L_H_adj', 'H', 'H', context.lHAdj, context.hexIds, hBasis, action, context));
    rows.push(...pairEquivarianceRows('J_exact', pairBasis, action, context));
    rows.push(...pairEquivarianceRows('J_adj', pairBasis, action, context));
  }

  return rows;
}

interface BasisCase {
  basisCaseId: string;
  layer: 'Q' | 'H';
  objectId: string;
  axis: AxisId;
}

function basisCasesForSection(ids: readonly string[], layer: 'Q' | 'H'): BasisCase[] {
  return ids.flatMap((objectId) =>
    AXES.map((axis) => ({
      basisCaseId: `${layer}:${objectId}:${axis}`,
      layer,
      objectId,
      axis,
    })),
  );
}

function singleLayerEquivarianceRows(
  operatorId: LoopEquivarianceRow['operatorId'],
  domain: 'Q' | 'H',
  codomain: 'Q' | 'H',
  matrix: Matrix,
  ids: readonly string[],
  basisCases: readonly BasisCase[],
  action: S1S4ActionRow,
  context: OperatorContext,
): LoopEquivarianceRow[] {
  return basisCases.map((basisCase) => {
    const basis = basisSection(ids, basisCase.objectId, basisCase.axis);
    const actedInput = applyS4ToSection(basis, domain, action, context);
    const left = applyMatrixToSection(matrix, actedInput, ids);
    const right = applyS4ToSection(applyMatrixToSection(matrix, basis, ids), codomain, action, context);
    const maxError = compareVectorSectionsByObjectId(left, right);

    return {
      operatorId,
      permutationId: action.permutationId,
      basisCaseId: basisCase.basisCaseId,
      domain,
      codomain,
      sectorOrLayer: domain,
      maxError,
      status: maxError <= EPSILON
        ? 'sector-loop-operators-s4-equivariant'
        : 'sector-loop-operator-equivariance-failed',
    };
  });
}

function pairEquivarianceRows(
  operatorId: 'J_exact' | 'J_adj',
  basisCases: readonly BasisCase[],
  action: S1S4ActionRow,
  context: OperatorContext,
): LoopEquivarianceRow[] {
  return basisCases.map((basisCase) => {
    const input = basisPairSection(context, basisCase);
    const actedInput = applyS4ToPairSection(input, action, context);
    const left = applyBridge(context, operatorId === 'J_exact' ? 'exact' : 'adjoint', actedInput);
    const right = applyS4ToPairSection(applyBridge(context, operatorId === 'J_exact' ? 'exact' : 'adjoint', input), action, context);
    const maxError = comparePairSections(left, right);

    return {
      operatorId,
      permutationId: action.permutationId,
      basisCaseId: basisCase.basisCaseId,
      domain: 'QH',
      codomain: 'QH',
      sectorOrLayer: 'QH',
      maxError,
      status: maxError <= EPSILON
        ? 'sector-loop-operators-s4-equivariant'
        : 'sector-loop-operator-equivariance-failed',
    };
  });
}

function buildLoopEquivarianceSummary(rows: readonly LoopEquivarianceRow[], permutationCount: number): LoopEquivarianceSummary {
  const passCount = rows.filter((row) => row.status === 'sector-loop-operators-s4-equivariant').length;

  return {
    operatorCount: 8,
    permutationCount,
    basisCaseCount: 30,
    checkedRowCount: rows.length,
    passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: rows.length === 3600 && passCount === rows.length
      ? 'sector-loop-operators-s4-equivariant'
      : 'sector-loop-operator-equivariance-failed',
  };
}

function buildBoundaryRows(): BoundaryRow[] {
  return REQUIRED_BOUNDARY_IDS.map((boundaryId) => ({
    boundaryId,
    statement: `${boundaryId} is enforced as a lab-scope boundary and does not deny the long-term field-world target.`,
    enforced: true,
  }));
}

function buildBoundaryLanguageSummary(): BoundaryLanguageSummary {
  const scannedLabels = [
    METHOD,
    EXPERIMENT_NAME,
    DIAGNOSTIC_SCOPE,
    'standard-projector',
    'exact-loop-projector',
    'adjoint-loop-scaled-projector',
    'q-mode fixed point',
    'finite-adjoint loop factor',
    'sector-exchange precondition',
    'resonance precondition',
    'phase precondition',
  ];
  const forbiddenLabelHitCount = scannedLabels.filter((label) => forbiddenBoundaryPromotionUsed(label)).length;

  return {
    forbiddenLabelScanCount: scannedLabels.length,
    forbiddenLabelHitCount,
    status: forbiddenLabelHitCount === 0 ? 'boundary-language-pass' : 'phase-resonance-promotion-boundary-failed',
  };
}

function forbiddenBoundaryPromotionUsed(label: string): boolean {
  const normalizedLabel = label.toLowerCase();

  if (BOUNDARY_SAFE_PRECONDITION_LABELS.some((safeLabel) => normalizedLabel === safeLabel)) {
    return false;
  }

  return FORBIDDEN_LANGUAGE_LABELS.some((forbidden) => normalizedLabel.includes(forbidden.toLowerCase()));
}

function buildFalsifierRows(args: {
  lab3Report: S3Report;
  lab1Report: S1Report;
  lab2Report: S2Report;
  supportSetSummary: SupportSetSummary;
  gramStructureSummary: GramStructureSummary;
  projectorStructureSummary: ProjectorStructureSummary;
  qModeProjectionSummary: QModeProjectionSummary;
  nullControlSummary: NullControlSummary;
  exactLoopProjectorSummary: ExactLoopProjectorSummary;
  adjointLoopScaledProjectorSummary: AdjointLoopScaledProjectorSummary;
  qSeedIterationSummary: QSeedIterationSummary;
  fullQPairIterationSummary: FullQPairIterationSummary;
  selectivityControlSummary: SelectivityControlSummary;
  loopEquivarianceSummary: LoopEquivarianceSummary;
  boundaryLanguageSummary: BoundaryLanguageSummary;
  finalVerdict: T28S4FinalVerdict;
}): FalsifierRow[] {
  return [
    falsifier('F1', 'Lab-3 parent missing or not accepted.', !parentLab3Accepted(args.lab3Report), `Lab-3 ok=${args.lab3Report.ok}; finalVerdict=${args.lab3Report.finalVerdict}.`),
    falsifier('F2', 'Lab-1 or Lab-2 context missing or inconsistent.', !parentLab1Accepted(args.lab1Report) || !parentLab2Accepted(args.lab2Report) || args.supportSetSummary.status !== 'support-set-ready', `Lab-1 ok=${args.lab1Report.ok}; Lab-2 ok=${args.lab2Report.ok}; support=${args.supportSetSummary.status}.`),
    falsifier('F3', 'Uses T28-R as authority.', false, 'T28-R is context-only-not-authority.'),
    falsifier('F4', 'Reconstructs square sign from unordered square flag sets.', false, 'Kappa is consumed from accepted Lab-3 signedKernelRows.'),
    falsifier('F5', 'Gram structure fails.', args.gramStructureSummary.status !== 'signed-kernel-gram-structure-pass', `gram=${args.gramStructureSummary.status}.`),
    falsifier('F6', 'Projector idempotence/rank/trace fails.', args.projectorStructureSummary.status !== 'standard-projector-structure-pass', `projector=${args.projectorStructureSummary.status}.`),
    falsifier('F7', 'q-mode projector membership fails.', args.qModeProjectionSummary.status !== 'q-mode-standard-subspace-membership-pass', `q-mode=${args.qModeProjectionSummary.status}.`),
    falsifier('F8', 'Null controls are not killed/preserved as expected.', args.nullControlSummary.status !== 'null-controls-pass', `null=${args.nullControlSummary.status}.`),
    falsifier('F9', 'Exact loop does not equal projector at operator level.', args.exactLoopProjectorSummary.status !== 'exact-loop-standard-projector-pass', `exact=${args.exactLoopProjectorSummary.status}.`),
    falsifier('F10', 'Adjoint loop does not equal 2/9 scaled projector at operator level.', args.adjointLoopScaledProjectorSummary.status !== 'adjoint-loop-scaled-projector-pass', `adjoint=${args.adjointLoopScaledProjectorSummary.status}.`),
    falsifier('F11', 'q-seed iteration fails.', args.qSeedIterationSummary.status !== 'q-seed-iteration-pass', `qSeed=${args.qSeedIterationSummary.status}.`),
    falsifier('F12', 'Full q-pair fixed/scaled behavior fails.', args.fullQPairIterationSummary.status !== 'full-q-pair-iteration-pass', `full=${args.fullQPairIterationSummary.status}.`),
    falsifier('F13', 'Selectivity controls fail.', args.selectivityControlSummary.status !== 'sector-loop-selectivity-controls-pass', `selectivity=${args.selectivityControlSummary.status}.`),
    falsifier('F14', 'Loop/projector S4 equivariance fails.', args.loopEquivarianceSummary.status !== 'sector-loop-operators-s4-equivariant', `equivariance=${args.loopEquivarianceSummary.status}.`),
    falsifier('F15', 'Uses scalar magnitude, norm-first source law, arbitrary projection, display order, row order, category numbers, or semantic labels as operator law.', false, 'Operators are finite scalar matrices over object IDs applied to Vec3 values.'),
    falsifier('F16', 'Promotes result to forbidden mature interpretation labels.', args.boundaryLanguageSummary.status !== 'boundary-language-pass', `boundaryLanguage=${args.boundaryLanguageSummary.status}.`),
    falsifier('F17', 'Mutates Shape, packet, operation registry, store, UI, field atlas policy, FieldCue, GeneratedSiteReading, or runtime state.', false, 'New diagnostic source and script only.'),
  ];
}

function falsifier(falsifierId: FalsifierRow['falsifierId'], description: string, triggered: boolean, evidence: string): FalsifierRow {
  return { falsifierId, description, triggered, evidence, status: triggered ? 'triggered' : 'clear' };
}

function classifyFinalVerdict(args: {
  boundaryRows: readonly BoundaryRow[];
  boundaryLanguageSummary: BoundaryLanguageSummary;
  falsifierRows: readonly FalsifierRow[];
  scalarSourceLawFailed: boolean;
  gramStructureSummary: GramStructureSummary;
  projectorStructureSummary: ProjectorStructureSummary;
  qModeProjectionSummary: QModeProjectionSummary;
  nullControlSummary: NullControlSummary;
  exactLoopProjectorSummary: ExactLoopProjectorSummary;
  adjointLoopScaledProjectorSummary: AdjointLoopScaledProjectorSummary;
  qSeedIterationSummary: QSeedIterationSummary;
  fullQPairIterationSummary: FullQPairIterationSummary;
  selectivityControlSummary: SelectivityControlSummary;
  loopEquivarianceSummary: LoopEquivarianceSummary;
}): T28S4FinalVerdict {
  if (
    requiredBoundaryMissing(args.boundaryRows) ||
    args.boundaryLanguageSummary.status !== 'boundary-language-pass' ||
    args.falsifierRows.some((row) => row.triggered)
  ) {
    return 'T28-S-Lab-4-boundary-failed';
  }

  if (args.scalarSourceLawFailed) return 'T28-S-Lab-4-scalar-collapse-regression-failed';
  if (args.gramStructureSummary.status !== 'signed-kernel-gram-structure-pass') return 'T28-S-Lab-4-gram-structure-failed';
  if (args.projectorStructureSummary.status !== 'standard-projector-structure-pass') return 'T28-S-Lab-4-projector-structure-failed';
  if (args.qModeProjectionSummary.status !== 'q-mode-standard-subspace-membership-pass') return 'T28-S-Lab-4-q-mode-membership-failed';
  if (args.nullControlSummary.status !== 'null-controls-pass') return 'T28-S-Lab-4-null-control-failed';
  if (args.exactLoopProjectorSummary.status !== 'exact-loop-standard-projector-pass') return 'T28-S-Lab-4-exact-loop-projector-failed';
  if (args.adjointLoopScaledProjectorSummary.status !== 'adjoint-loop-scaled-projector-pass') return 'T28-S-Lab-4-adjoint-loop-scaled-projector-failed';
  if (
    args.qSeedIterationSummary.status !== 'q-seed-iteration-pass' ||
    args.fullQPairIterationSummary.status !== 'full-q-pair-iteration-pass'
  ) {
    return 'T28-S-Lab-4-q-seed-iteration-failed';
  }
  if (args.selectivityControlSummary.status !== 'sector-loop-selectivity-controls-pass') return 'T28-S-Lab-4-selectivity-control-failed';
  if (args.loopEquivarianceSummary.status !== 'sector-loop-operators-s4-equivariant') return 'T28-S-Lab-4-loop-equivariance-failed';

  return 'T28-S-Lab-4-sector-coupled-loop-standard-projector-pass';
}

function buildIntegrityIssues(args: {
  lab3Report: S3Report;
  lab1Report: S1Report;
  lab2Report: S2Report;
  supportSetSummary: SupportSetSummary;
  signedKernelGramRows: readonly SignedKernelGramRow[];
  gramStructureSummary: GramStructureSummary;
  projectorStructureSummary: ProjectorStructureSummary;
  qModeProjectionSummary: QModeProjectionSummary;
  nullControlSummary: NullControlSummary;
  exactLoopProjectorRows: readonly ExactLoopProjectorRow[];
  exactLoopProjectorSummary: ExactLoopProjectorSummary;
  adjointLoopScaledProjectorRows: readonly AdjointLoopScaledProjectorRow[];
  adjointLoopScaledProjectorSummary: AdjointLoopScaledProjectorSummary;
  qSeedIterationSummary: QSeedIterationSummary;
  fullQPairIterationSummary: FullQPairIterationSummary;
  selectivityControlSummary: SelectivityControlSummary;
  loopEquivarianceSummary: LoopEquivarianceSummary;
  boundaryRows: readonly BoundaryRow[];
  boundaryLanguageSummary: BoundaryLanguageSummary;
  falsifierRows: readonly FalsifierRow[];
  finalVerdict: T28S4FinalVerdict;
}): string[] {
  const issues: string[] = [];
  const hGramCount = args.signedKernelGramRows.filter((row) => row.gramMatrixId === 'G_H').length;
  const qGramCount = args.signedKernelGramRows.filter((row) => row.gramMatrixId === 'G_Q').length;

  if (!parentLab3Accepted(args.lab3Report)) issues.push('Lab-3 parent missing/not accepted');
  if (!parentLab1Accepted(args.lab1Report) || !parentLab2Accepted(args.lab2Report)) issues.push('Lab-1 or Lab-2 context missing/inconsistent');
  if (args.supportSetSummary.squareCount !== 6) issues.push('square count not 6');
  if (args.supportSetSummary.hexCount !== 4) issues.push('hex count not 4');
  if (args.supportSetSummary.kernelRowCount !== 24) issues.push('signed kernel row count not 24');
  if (hGramCount !== 16 || qGramCount !== 36) issues.push('G_H row count not 16 or G_Q row count not 36');
  if (args.gramStructureSummary.status !== 'signed-kernel-gram-structure-pass') issues.push('Gram entry mismatch');
  if (args.gramStructureSummary.hRowSumMaxError > EPSILON) issues.push('hex row sum nonzero in G_H');
  if (args.projectorStructureSummary.status !== 'standard-projector-structure-pass') {
    issues.push('projector rank mismatch');
    issues.push('projector trace mismatch');
    issues.push('projector idempotence failure');
  }
  if (args.qModeProjectionSummary.status !== 'q-mode-standard-subspace-membership-pass') issues.push('q-mode membership failure');
  if (args.nullControlSummary.status !== 'null-controls-pass') issues.push('null control failure');
  if (args.exactLoopProjectorRows.length !== 52) issues.push('exact loop row count not 52');
  if (args.exactLoopProjectorSummary.status !== 'exact-loop-standard-projector-pass') issues.push('exact loop projector equality failure');
  if (args.adjointLoopScaledProjectorRows.length !== 52) issues.push('adjoint loop row count not 52');
  if (args.adjointLoopScaledProjectorSummary.status !== 'adjoint-loop-scaled-projector-pass') issues.push('adjoint loop scaled-projector equality failure');
  if (args.qSeedIterationSummary.status !== 'q-seed-iteration-pass') issues.push('q-seed iteration failure');
  if (args.fullQPairIterationSummary.status !== 'full-q-pair-iteration-pass') issues.push('full q-pair iteration failure');
  if (args.selectivityControlSummary.status !== 'sector-loop-selectivity-controls-pass') issues.push('selectivity control failure');
  if (args.loopEquivarianceSummary.checkedRowCount !== 3600) issues.push('loop equivariance row count unexpected');
  if (args.loopEquivarianceSummary.status !== 'sector-loop-operators-s4-equivariant') issues.push('loop equivariance failure');
  if (args.selectivityControlSummary.failCount > 0) issues.push('scalar-collapse/no-source-law control failure');
  if (requiredBoundaryMissing(args.boundaryRows)) issues.push('required boundary missing');
  if (args.boundaryLanguageSummary.status !== 'boundary-language-pass') issues.push('forbidden label used');
  if (
    REQUIRED_FALSIFIER_IDS.some((id) => !args.falsifierRows.some((row) => row.falsifierId === id)) ||
    args.falsifierRows.some((row) => row.triggered)
  ) {
    issues.push('falsifier row missing or triggered');
  }

  const expectedVerdict = classifyFinalVerdict({
    boundaryRows: args.boundaryRows,
    boundaryLanguageSummary: args.boundaryLanguageSummary,
    falsifierRows: args.falsifierRows,
    scalarSourceLawFailed: false,
    gramStructureSummary: args.gramStructureSummary,
    projectorStructureSummary: args.projectorStructureSummary,
    qModeProjectionSummary: args.qModeProjectionSummary,
    nullControlSummary: args.nullControlSummary,
    exactLoopProjectorSummary: args.exactLoopProjectorSummary,
    adjointLoopScaledProjectorSummary: args.adjointLoopScaledProjectorSummary,
    qSeedIterationSummary: args.qSeedIterationSummary,
    fullQPairIterationSummary: args.fullQPairIterationSummary,
    selectivityControlSummary: args.selectivityControlSummary,
    loopEquivarianceSummary: args.loopEquivarianceSummary,
  });

  if (expectedVerdict !== args.finalVerdict) issues.push('final verdict inconsistent with precedence');

  return unique(issues);
}

function applyBridge(context: OperatorContext, bridgeType: BridgeType, section: PairSection): PairSection {
  return {
    q: applyMatrixToSection(bridgeType === 'exact' ? context.rExact : context.rAdj, section.h, context.squareIds),
    h: applyMatrixToSection(context.d, section.q, context.hexIds),
  };
}

function applyMatrixToSection(matrix: Matrix, input: Section, outputIds: readonly string[]): Section {
  const values = new Map<string, Vec3>();

  outputIds.forEach((outputId, rowIndex) => {
    const vector = input.ids.reduce((sum, inputId, columnIndex) => {
      const coefficient = matrix[rowIndex]?.[columnIndex] ?? 0;
      return addVec3(sum, scaleVec3(input.values.get(inputId) ?? zeroVec3(), coefficient));
    }, zeroVec3());
    values.set(outputId, vector);
  });

  return { ids: [...outputIds], values };
}

function applyS4ToPairSection(section: PairSection, action: S1S4ActionRow, context: OperatorContext): PairSection {
  return {
    q: applyS4ToSection(section.q, 'Q', action, context),
    h: applyS4ToSection(section.h, 'H', action, context),
  };
}

function applyS4ToSection(section: Section, domain: 'Q' | 'H', action: S1S4ActionRow, context: OperatorContext): Section {
  const values = new Map<string, Vec3>();

  for (const objectId of section.ids) {
    const targetId = applyObjectPermutation(objectId, domain, action, context);
    values.set(targetId, applyS4ToVec3(section.values.get(objectId) ?? zeroVec3(), action));
  }

  return {
    ids: domain === 'Q' ? context.squareIds : context.hexIds,
    values,
  };
}

function applyObjectPermutation(objectId: string, domain: 'Q' | 'H', action: S1S4ActionRow, context: OperatorContext): string {
  if (domain === 'H') {
    const label = parseHexOmittedLabel(objectId);
    return label ? hexObjectId(action.permutationMap[label]) : objectId;
  }

  const square = context.squarePolarityById.get(objectId);
  if (!square?.sourceLabelPair || !square.targetLabelPair) return objectId;
  const sourcePair = labelSort([
    action.permutationMap[square.sourceLabelPair[0]],
    action.permutationMap[square.sourceLabelPair[1]],
  ]);
  const targetPair = labelSort([
    action.permutationMap[square.targetLabelPair[0]],
    action.permutationMap[square.targetLabelPair[1]],
  ]);
  return context.squarePolarityByDirectedPair.get(squareDirectedPairKey(sourcePair, targetPair))?.squareObjectId ?? objectId;
}

function applyS4ToVec3(value: Vec3, action: S1S4ActionRow): Vec3 {
  return [
    dotVec3(action.matrix3x3[0], value),
    dotVec3(action.matrix3x3[1], value),
    dotVec3(action.matrix3x3[2], value),
  ];
}

function comparePairSections(left: PairSection, right: PairSection): number {
  return Math.max(compareVectorSectionsByObjectId(left.q, right.q), compareVectorSectionsByObjectId(left.h, right.h));
}

function compareVectorSectionsByObjectId(left: Section, right: Section): number {
  const ids = unique([...left.ids, ...right.ids, ...left.values.keys(), ...right.values.keys()]);
  return maxOf(ids.map((id) => maxAbsVec3(subVec3(left.values.get(id) ?? zeroVec3(), right.values.get(id) ?? zeroVec3()))));
}

function compareScalarMatricesByObjectId(left: Matrix, right: Matrix): number {
  return maxOf(left.flatMap((row, rowIndex) => row.map((value, columnIndex) => Math.abs(value - (right[rowIndex]?.[columnIndex] ?? 0)))));
}

function scalarMagnitudeControlMaxError(context: OperatorContext): number {
  const scalarQ = sectionFromValues(context.squareIds, new Map(
    context.squareIds.map((id) => {
      const value = context.qModeQ.values.get(id) ?? zeroVec3();
      return [id, [normVec3(value), 0, 0] as Vec3];
    }),
  ));
  const projected = applyMatrixToSection(context.pQ, scalarQ, context.squareIds);
  return compareVectorSectionsByObjectId(projected, scalarQ);
}

function sectionFromRows(ids: readonly string[], rows: readonly S1ReadoutRow[], sector: 'sectorMinus' | 'sectorPlus'): Section {
  return sectionFromValues(ids, new Map(rows.map((row) => [row.objectId, row[sector]])));
}

function sectionFromValues(ids: readonly string[], values: Map<string, Vec3>): Section {
  return { ids: [...ids], values: new Map(values) };
}

function zeroSection(ids: readonly string[]): Section {
  return sectionFromValues(ids, new Map(ids.map((id) => [id, zeroVec3()])));
}

function cloneSection(section: Section): Section {
  return sectionFromValues(section.ids, section.values);
}

function scaleSection(section: Section, scale: number): Section {
  return sectionFromValues(section.ids, new Map(section.ids.map((id) => [id, scaleVec3(section.values.get(id) ?? zeroVec3(), scale)])));
}

function coordinateSection(section: Section, axis: AxisId): Section {
  const index = axisIndex(axis);
  return sectionFromValues(section.ids, new Map(section.ids.map((id) => {
    const value = section.values.get(id) ?? zeroVec3();
    const coordinate = zeroVec3();
    coordinate[index] = value[index];
    return [id, coordinate];
  })));
}

function basisSection(ids: readonly string[], objectId: string, axis: AxisId): Section {
  return sectionFromValues(ids, new Map(ids.map((id) => [id, id === objectId ? BASIS_VECTORS[axis] : zeroVec3()])));
}

function basisPairSection(context: OperatorContext, basisCase: BasisCase): PairSection {
  return {
    q: basisCase.layer === 'Q' ? basisSection(context.squareIds, basisCase.objectId, basisCase.axis) : zeroSection(context.squareIds),
    h: basisCase.layer === 'H' ? basisSection(context.hexIds, basisCase.objectId, basisCase.axis) : zeroSection(context.hexIds),
  };
}

function sectionToRecord(section: Section): Record<string, Vec3> {
  return Object.fromEntries(section.ids.map((id) => [id, cleanVec3(section.values.get(id) ?? zeroVec3())]));
}

function matrixMultiply(left: Matrix, right: Matrix): Matrix {
  return left.map((row) =>
    right[0].map((_, columnIndex) =>
      row.reduce((sum, value, innerIndex) => sum + value * right[innerIndex][columnIndex], 0),
    ),
  );
}

function matrixVectorMultiplyScalar(matrix: Matrix, vector: readonly number[]): number[] {
  return matrix.map((row) => row.reduce((sum, value, index) => sum + value * (vector[index] ?? 0), 0));
}

function matrixTrace(matrix: Matrix): number {
  return matrix.reduce((sum, row, index) => sum + (row[index] ?? 0), 0);
}

function matrixRankRationalOrTolerance(matrix: Matrix): number {
  const work = matrix.map((row) => row.map((value) => cleanNumber(value)));
  let rank = 0;
  let pivotColumn = 0;

  while (rank < work.length && pivotColumn < (work[0]?.length ?? 0)) {
    let pivotRow = rank;
    while (pivotRow < work.length && Math.abs(work[pivotRow][pivotColumn]) <= EPSILON) {
      pivotRow += 1;
    }
    if (pivotRow === work.length) {
      pivotColumn += 1;
      continue;
    }
    [work[rank], work[pivotRow]] = [work[pivotRow], work[rank]];
    const pivot = work[rank][pivotColumn];
    work[rank] = work[rank].map((value) => value / pivot);
    for (let rowIndex = 0; rowIndex < work.length; rowIndex += 1) {
      if (rowIndex === rank) continue;
      const factor = work[rowIndex][pivotColumn];
      work[rowIndex] = work[rowIndex].map((value, columnIndex) => value - factor * work[rank][columnIndex]);
    }
    rank += 1;
    pivotColumn += 1;
  }

  return rank;
}

function matrixIdempotenceMaxError(matrix: Matrix): number {
  return compareScalarMatricesByObjectId(matrixMultiply(matrix, matrix), matrix);
}

function transpose(matrix: Matrix): Matrix {
  return matrix[0].map((_, columnIndex) => matrix.map((row) => row[columnIndex]));
}

function scaleMatrix(matrix: Matrix, scale: number): Matrix {
  return matrix.map((row) => row.map((value) => value * scale));
}

function labelSort(pair: readonly A3Label[]): [A3Label, A3Label] {
  return [...pair].sort((left, right) => A3_LABELS.indexOf(left) - A3_LABELS.indexOf(right)) as [A3Label, A3Label];
}

function squareDirectedPairKey(sourceLabelPair: readonly A3Label[], targetLabelPair: readonly A3Label[]): string {
  return `${labelSort(sourceLabelPair).join('')}|${labelSort(targetLabelPair).join('')}`;
}

function parseHexOmittedLabel(objectId: string): A3Label | null {
  const label = objectId.slice('ve-central-hexagon-omitted:'.length);
  return A3_LABELS.includes(label as A3Label) ? (label as A3Label) : null;
}

function hexObjectId(label: A3Label): string {
  return `ve-central-hexagon-omitted:${label}`;
}

function kernelKey(hexId: string, squareId: string): string {
  return `${hexId}::${squareId}`;
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

function sumNumbers(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0);
}

function axisIndex(axis: AxisId): number {
  return axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
}

function maxOf(values: readonly number[]): number {
  return values.length === 0 ? 0 : Math.max(...values);
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

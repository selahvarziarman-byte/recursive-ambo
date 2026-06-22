import { buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report } from './pSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1';
import { buildPSimplexVectorNativeIncidenceOperatorAuditT28S2Report } from './pSimplexVectorNativeIncidenceOperatorAuditT28S2';
import { buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report } from './pSimplexSignedSquareHexSectorCouplingAuditT28S3';
import { buildPSimplexSectorCoupledLoopStandardProjectorAuditT28S4Report } from './pSimplexSectorCoupledLoopStandardProjectorAuditT28S4';

export type Vec3 = [number, number, number];
export type A3Label = 'A' | 'B' | 'C' | 'D';
export type EdgeId = 'AB' | 'AC' | 'AD' | 'BC' | 'BD' | 'CD';
export type SiteId = 'M_AB' | 'M_AC' | 'M_AD' | 'M_BC' | 'M_BD' | 'M_CD';
export type SquareObjectId = string;
export type HexObjectId = string;

type Matrix = number[][];
type S1Report = ReturnType<typeof buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report>;
type S2Report = ReturnType<typeof buildPSimplexVectorNativeIncidenceOperatorAuditT28S2Report>;
type S3Report = ReturnType<typeof buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report>;
type S4Report = ReturnType<typeof buildPSimplexSectorCoupledLoopStandardProjectorAuditT28S4Report>;
type S1SquarePolarityRow = S1Report['squarePolarityRows'][number];
type S1ReadoutRow = S1Report['readoutSectionRows'][number];

interface Section {
  ids: string[];
  values: Map<string, Vec3>;
}

interface PairSection {
  square: Section;
  hex: Section;
}

interface SiteForm {
  siteId: SiteId;
  edgeId: EdgeId;
  sourcePair: [A3Label, A3Label];
  complementPair: [A3Label, A3Label];
  qS: Vec3;
  squareForwardId: SquareObjectId;
  squareReverseId: SquareObjectId;
  squareAntiPair: Section;
  hexEnvelope: Section;
  complementSiteId: SiteId;
}

interface OperatorContext {
  squareIds: SquareObjectId[];
  hexIds: HexObjectId[];
  squareRows: S1ReadoutRow[];
  hexRows: S1ReadoutRow[];
  squarePolarityByDirectedPair: Map<string, S1SquarePolarityRow>;
  qByLabel: Map<A3Label, Vec3>;
  kappa: Matrix;
  d: Matrix;
  rExact: Matrix;
  rAdj: Matrix;
  pQ: Matrix;
  pH: Matrix;
  operatorMatrixProvenance: 'reconstructed-from-Lab3-kappa-consistent-with-Lab4';
}

interface CorruptedSquareAuthority {
  squareObjectId: SquareObjectId;
  sourceLabelPair: readonly A3Label[] | null;
  targetLabelPair: readonly A3Label[] | null;
  correspondingTetraEdge: EdgeId | null;
}

interface LocalControlEvidence {
  checkedCount: number;
  passedCount: number;
  failureCount: number;
  observedStatus: string;
  maxError: number;
  note: string;
}

export interface ParentEvidenceRow {
  parentId:
    | 'T28-S-Lab-4'
    | 'T28-S-Lab-1'
    | 'T28-S-Lab-2'
    | 'T28-S-Lab-3'
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

export interface SiteSupportLedgerRow {
  siteId: SiteId;
  sourcePair: A3Label[];
  complementPair: A3Label[];
  q_S: Vec3;
  squareForwardId: SquareObjectId;
  squareReverseId: SquareObjectId;
  squareAntiPairRows: Array<{ objectId: SquareObjectId; value: Vec3 }>;
  hexEnvelopeRows: Array<{
    hexId: HexObjectId;
    omittedLabel: A3Label;
    signClass: 'endpoint-negative' | 'complement-positive';
    value: Vec3;
  }>;
  complementSiteId: SiteId;
  complementSupportAxisEquivalent: boolean;
  maxConstructionError: number;
  status: 'site-level-standard-support-ledger-ready' | 'site-level-standard-support-ledger-failed';
}

export interface SiteSupportLedgerSummary {
  siteCount: number;
  readyCount: number;
  complementEquivalenceCount: number;
  maxConstructionError: number;
  status: 'site-level-standard-support-ledger-ready' | 'site-level-standard-support-ledger-failed';
}

export interface BaselinePreservationRow {
  siteId: SiteId;
  testId:
    | 'P_Q-preserves-square-anti-pair'
    | 'P_H-preserves-hex-envelope'
    | 'D-square-to-hex-envelope'
    | 'R_exact-hex-to-square-anti-pair'
    | 'R_adj-hex-to-two-ninths-square-anti-pair';
  computedSquareSection: Record<string, Vec3>;
  expectedSquareSection: Record<string, Vec3>;
  computedHexSection: Record<string, Vec3>;
  expectedHexSection: Record<string, Vec3>;
  maxError: number;
  status: 'site-standard-support-baseline-pass' | 'site-standard-support-baseline-failed';
}

export interface RowSummary<PassStatus extends string, FailStatus extends string> {
  rowCount: number;
  passCount: number;
  maxError: number;
  status: PassStatus | FailStatus;
}

export interface SquareAblationRow {
  siteId: SiteId;
  ablationCase:
    | 'single-forward-square-seed'
    | 'single-reverse-square-seed'
    | 'remove-forward-from-anti-pair'
    | 'remove-reverse-from-anti-pair'
    | 'remove-both-antipodal-squares';
  inputSquareSection: Record<string, Vec3>;
  projectedSquareSection: Record<string, Vec3>;
  expectedProjectedSquareSection: Record<string, Vec3>;
  hexDriveSection: Record<string, Vec3>;
  expectedHexDriveSection: Record<string, Vec3>;
  exactLoopReturn: Record<string, Vec3>;
  expectedExactLoopReturn: Record<string, Vec3>;
  adjointLoopReturn: Record<string, Vec3>;
  expectedAdjointLoopReturn: Record<string, Vec3>;
  expectedStrengthFactor: number;
  expectedAdjointStrengthFactor: number;
  maxError: number;
  status:
    | 'square-support-ablation-prediction-pass'
    | 'square-support-ablation-prediction-failed'
    | 'square-ablation-not-load-bearing'
    | 'unexpected-square-completion';
}

export interface SquareSubstitutionRow {
  siteId: SiteId;
  substitutionCase:
    | 'symmetric-square-pair'
    | 'complement-site-equivalence'
    | 'wrong-non-complement-site-anti-pair'
    | 'one-label-overlap-square';
  inputSquareSection: Record<string, Vec3>;
  projectedSquareSection: Record<string, Vec3>;
  expectedProjectedSquareSection: Record<string, Vec3>;
  expectedSiteId: SiteId | 'none';
  testedSiteId: SiteId;
  acceptedAsTestedSite: boolean;
  maxError: number;
  status:
    | 'square-symmetric-substitution-killed'
    | 'antipodal-complement-site-support-axis-equivalent'
    | 'redirected-to-other-site-square-standard'
    | 'one-label-overlap-square-substitution-redirected'
    | 'wrong-square-substitution-falsely-accepted-for-site';
}

export interface SquareSubstitutionSummary {
  rowCount: number;
  passCount: number;
  falseAcceptedCount: number;
  complementEquivalenceCount: number;
  maxError: number;
  status:
    | 'square-substitution-controls-pass'
    | 'square-substitution-control-failed'
    | 'wrong-square-substitution-falsely-accepted-for-site';
}

export interface HexAblationRow {
  siteId: SiteId;
  ablationCase:
    | 'remove-endpoint-hex-left'
    | 'remove-endpoint-hex-right'
    | 'remove-complement-hex-left'
    | 'remove-complement-hex-right'
    | 'remove-endpoint-pair'
    | 'remove-complement-pair'
    | 'remove-all-hexes';
  inputHexSection: Record<string, Vec3>;
  projectedHexSection: Record<string, Vec3>;
  expectedProjectedHexSection: Record<string, Vec3>;
  exactSquareReturn: Record<string, Vec3>;
  expectedExactSquareReturn: Record<string, Vec3>;
  adjointSquareReturn: Record<string, Vec3>;
  expectedAdjointSquareReturn: Record<string, Vec3>;
  maxError: number;
  status:
    | 'hex-support-ablation-prediction-pass'
    | 'hex-support-ablation-prediction-failed'
    | 'hex-ablation-not-load-bearing'
    | 'unexpected-hex-completion';
}

export interface HexSubstitutionRow {
  siteId: SiteId;
  substitutionCase:
    | 'uniform-hex-substitution'
    | 'complement-site-envelope-equivalence'
    | 'wrong-non-complement-site-envelope'
    | 'endpoint-complement-sign-reversal';
  inputHexSection: Record<string, Vec3>;
  projectedHexSection: Record<string, Vec3>;
  expectedProjectedHexSection: Record<string, Vec3>;
  exactSquareReturn: Record<string, Vec3>;
  expectedExactSquareReturn: Record<string, Vec3>;
  adjointSquareReturn: Record<string, Vec3>;
  expectedAdjointSquareReturn: Record<string, Vec3>;
  acceptedAsTestedSite: boolean;
  expectedSiteId: SiteId | 'antipodal-opposition' | 'none';
  testedSiteId: SiteId;
  maxError: number;
  status:
    | 'uniform-hex-substitution-killed'
    | 'antipodal-complement-site-hex-envelope-equivalent'
    | 'redirected-to-other-site-hex-envelope'
    | 'hex-envelope-sign-reversal-preserved-as-antipodal-opposition'
    | 'wrong-hex-substitution-falsely-accepted-for-site';
}

export interface HexSubstitutionSummary {
  rowCount: number;
  passCount: number;
  falseAcceptedCount: number;
  complementEquivalenceCount: number;
  maxError: number;
  status:
    | 'hex-substitution-controls-pass'
    | 'hex-substitution-control-failed'
    | 'wrong-hex-substitution-falsely-accepted-for-site';
}

export interface ExactLoopSiteCompletionRow {
  siteId: SiteId;
  sourceCaseId: string;
  seedLayer: 'square-only' | 'hex-only';
  iterationIndex: 1 | 2;
  computedSquareSection: Record<string, Vec3>;
  expectedSquareSection: Record<string, Vec3>;
  computedHexSection: Record<string, Vec3>;
  expectedHexSection: Record<string, Vec3>;
  maxError: number;
  status:
    | 'site-level-exact-loop-support-completion-pass'
    | 'site-level-exact-loop-support-completion-failed';
}

export interface AdjointLoopSiteCompletionRow {
  siteId: SiteId;
  sourceCaseId: string;
  seedLayer: 'square-only' | 'hex-only';
  iterationIndex: 2;
  computedSquareSection: Record<string, Vec3>;
  expectedSquareSection: Record<string, Vec3>;
  computedHexSection: Record<string, Vec3>;
  expectedHexSection: Record<string, Vec3>;
  finiteAdjointLoopFactor: number;
  maxError: number;
  status:
    | 'site-level-adjoint-loop-support-completion-pass'
    | 'site-level-adjoint-loop-support-completion-failed';
}

export interface S4OrbitCoverageRow {
  siteId: SiteId;
  sourcePair: A3Label[];
  complementPair: A3Label[];
  baselinePass: boolean;
  squareAblationPass: boolean;
  squareSubstitutionPass: boolean;
  hexAblationPass: boolean;
  hexSubstitutionPass: boolean;
  exactLoopPass: boolean;
  adjointLoopPass: boolean;
  maxError: number;
  status: 'site-support-candidacy-s4-orbit-pass' | 'site-support-candidacy-s4-orbit-failed';
}

export interface S4OrbitCoverageSummary {
  siteCount: number;
  orbitPassCount: number;
  maxError: number;
  status: 'site-support-candidacy-s4-orbit-pass' | 'site-support-candidacy-s4-orbit-failed';
}

export interface OptionalDestructiveMaskRow {
  siteId: SiteId;
  maskCase: 'mask-one-square-from-anti-pair' | 'mask-one-hex-from-envelope';
  maskedSupportIds: string[];
  renormalized: false;
  computedMaskedCompletion: Record<string, Vec3>;
  unmaskedExpectedCompletion: Record<string, Vec3>;
  changedFromUnmasked: boolean;
  status:
    | 'destructive-support-mask-control-pass'
    | 'destructive-support-mask-falsely-preserved-standard-completion';
}

export interface OptionalDestructiveMaskSummary {
  rowCount: number;
  passCount: number;
  status:
    | 'destructive-support-mask-control-pass'
    | 'destructive-support-mask-falsely-preserved-standard-completion'
    | 'destructive-support-mask-control-not-implemented';
}

export interface ControlRow {
  controlId: 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
  controlName: string;
  expectedStatus: string;
  observedStatus: string;
  checkedCount: number;
  maxError: number;
  status: 'control-pass' | 'control-fail';
  note: string;
}

export interface BoundaryRow {
  boundaryId: (typeof REQUIRED_BOUNDARY_IDS)[number];
  statement: string;
  enforced: true;
}

export interface FalsifierRow {
  falsifierId: (typeof REQUIRED_FALSIFIER_IDS)[number];
  description: string;
  triggered: boolean;
  evidence: string;
  status: 'clear' | 'triggered';
}

export type T28S5FinalVerdict =
  | 'T28-S-Lab-5-site-level-support-candidacy-pass'
  | 'T28-S-Lab-5-site-ledger-reconstruction-failed'
  | 'T28-S-Lab-5-baseline-preservation-failed'
  | 'T28-S-Lab-5-square-ablation-prediction-failed'
  | 'T28-S-Lab-5-square-substitution-control-failed'
  | 'T28-S-Lab-5-hex-ablation-prediction-failed'
  | 'T28-S-Lab-5-hex-substitution-control-failed'
  | 'T28-S-Lab-5-exact-loop-site-completion-failed'
  | 'T28-S-Lab-5-adjoint-loop-site-completion-failed'
  | 'T28-S-Lab-5-s4-orbit-failed'
  | 'T28-S-Lab-5-scalar-collapse-regression-failed'
  | 'T28-S-Lab-5-square-polarity-gate-failed'
  | 'T28-S-Lab-5-raw-scale-gate-failed'
  | 'T28-S-Lab-5-boundary-failed';

export interface PSimplexSiteLevelSupportCandidacyAuditT28S5Report {
  method: typeof METHOD;
  experimentName: typeof EXPERIMENT_NAME;
  diagnosticScope: typeof DIAGNOSTIC_SCOPE;
  branchRef: typeof BRANCH_REF;
  operatorMatrixProvenance: OperatorContext['operatorMatrixProvenance'];
  parentEvidenceRows: ParentEvidenceRow[];
  siteSupportLedgerRows: SiteSupportLedgerRow[];
  siteSupportLedgerSummary: SiteSupportLedgerSummary;
  baselinePreservationRows: BaselinePreservationRow[];
  baselinePreservationSummary: RowSummary<'site-standard-support-baseline-pass', 'site-standard-support-baseline-failed'>;
  squareAblationRows: SquareAblationRow[];
  squareAblationSummary: RowSummary<'square-support-ablation-prediction-pass', 'square-support-ablation-prediction-failed'>;
  squareSubstitutionRows: SquareSubstitutionRow[];
  squareSubstitutionSummary: SquareSubstitutionSummary;
  hexAblationRows: HexAblationRow[];
  hexAblationSummary: RowSummary<'hex-support-ablation-prediction-pass', 'hex-support-ablation-prediction-failed'>;
  hexSubstitutionRows: HexSubstitutionRow[];
  hexSubstitutionSummary: HexSubstitutionSummary;
  exactLoopSiteCompletionRows: ExactLoopSiteCompletionRow[];
  exactLoopSiteCompletionSummary: RowSummary<'site-level-exact-loop-support-completion-pass', 'site-level-exact-loop-support-completion-failed'>;
  adjointLoopSiteCompletionRows: AdjointLoopSiteCompletionRow[];
  adjointLoopSiteCompletionSummary: RowSummary<'site-level-adjoint-loop-support-completion-pass', 'site-level-adjoint-loop-support-completion-failed'>;
  s4OrbitCoverageRows: S4OrbitCoverageRow[];
  s4OrbitCoverageSummary: S4OrbitCoverageSummary;
  optionalDestructiveMaskRows: OptionalDestructiveMaskRow[];
  optionalDestructiveMaskSummary: OptionalDestructiveMaskSummary;
  controlRows: ControlRow[];
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  finalVerdict: T28S5FinalVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

const METHOD = 'p-simplex-site-level-support-candidacy-audit-t28s5' as const;
const EXPERIMENT_NAME = 'T28-S-Lab-5 - Site-Level Support Candidacy Audit' as const;
const DIAGNOSTIC_SCOPE = 'site-level-support-candidacy-audit-only' as const;
const BRANCH_REF = 'wgate/arf-w1-root-frame-v0' as const;
const EPSILON = 1e-9;
const A3_LABELS: readonly A3Label[] = ['A', 'B', 'C', 'D'];
const SITES: readonly SiteId[] = ['M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];
const REQUIRED_BOUNDARY_IDS = [
  'not-mature-support',
  'not-field-world-inhabitant',
  'not-route',
  'not-gate',
  'not-vortex',
  'not-region',
  'not-resonance',
  'not-phase-behavior',
  'not-damping',
  'not-attenuation',
  'not-topology',
  'not-semantic-naming',
  'not-fieldcue',
  'not-runtime',
  'not-ui',
  'not-packet-writing',
  'not-shape-mutation',
  'not-scalar-source-law',
  'not-norm-first',
  'not-arbitrary-projection',
  'not-unordered-square-sign',
  'not-raw-scale-normalized',
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
  'F18',
] as const;

export function buildPSimplexSiteLevelSupportCandidacyAuditT28S5Report(): PSimplexSiteLevelSupportCandidacyAuditT28S5Report {
  const lab1Report = buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report();
  const lab2Report = buildPSimplexVectorNativeIncidenceOperatorAuditT28S2Report();
  const lab3Report = buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report();
  const lab4Report = buildPSimplexSectorCoupledLoopStandardProjectorAuditT28S4Report();
  const context = buildOperatorContext(lab1Report, lab3Report);
  const parentEvidenceRows = buildParentEvidenceRows(lab4Report, lab1Report, lab2Report, lab3Report);
  const siteForms = SITES.map((siteId) => buildSiteForm(siteId, context));

  const siteSupportLedgerRows = buildSiteSupportLedgerRows(siteForms, context);
  const siteSupportLedgerSummary = buildSiteSupportLedgerSummary(siteSupportLedgerRows);
  const baselinePreservationRows = buildBaselinePreservationRows(siteForms, context);
  const baselinePreservationSummary = summarizeRows(
    baselinePreservationRows,
    'site-standard-support-baseline-pass',
    'site-standard-support-baseline-failed',
  );
  const squareAblationRows = buildSquareAblationRows(siteForms, context);
  const squareAblationSummary = summarizeRows(
    squareAblationRows,
    'square-support-ablation-prediction-pass',
    'square-support-ablation-prediction-failed',
  );
  const squareSubstitutionRows = buildSquareSubstitutionRows(siteForms, context);
  const squareSubstitutionSummary = buildSquareSubstitutionSummary(squareSubstitutionRows);
  const hexAblationRows = buildHexAblationRows(siteForms, context);
  const hexAblationSummary = summarizeRows(
    hexAblationRows,
    'hex-support-ablation-prediction-pass',
    'hex-support-ablation-prediction-failed',
  );
  const hexSubstitutionRows = buildHexSubstitutionRows(siteForms, context);
  const hexSubstitutionSummary = buildHexSubstitutionSummary(hexSubstitutionRows);
  const exactLoopSiteCompletionRows = buildExactLoopSiteCompletionRows({
    siteForms,
    context,
    squareAblationRows,
    squareSubstitutionRows,
    hexAblationRows,
    hexSubstitutionRows,
  });
  const exactLoopSiteCompletionSummary = summarizeRows(
    exactLoopSiteCompletionRows,
    'site-level-exact-loop-support-completion-pass',
    'site-level-exact-loop-support-completion-failed',
  );
  const adjointLoopSiteCompletionRows = buildAdjointLoopSiteCompletionRows({
    siteForms,
    context,
    squareAblationRows,
    squareSubstitutionRows,
    hexAblationRows,
    hexSubstitutionRows,
  });
  const adjointLoopSiteCompletionSummary = summarizeRows(
    adjointLoopSiteCompletionRows,
    'site-level-adjoint-loop-support-completion-pass',
    'site-level-adjoint-loop-support-completion-failed',
  );
  const s4OrbitCoverageRows = buildS4OrbitCoverageRows({
    siteForms,
    baselinePreservationRows,
    squareAblationRows,
    squareSubstitutionRows,
    hexAblationRows,
    hexSubstitutionRows,
    exactLoopSiteCompletionRows,
    adjointLoopSiteCompletionRows,
  });
  const s4OrbitCoverageSummary = buildS4OrbitCoverageSummary(s4OrbitCoverageRows);
  const optionalDestructiveMaskRows = buildOptionalDestructiveMaskRows(siteForms, context);
  const optionalDestructiveMaskSummary = buildOptionalDestructiveMaskSummary(optionalDestructiveMaskRows);
  const controlRows = buildControlRows({
    siteForms,
    context,
    lab3Report,
    squareSubstitutionSummary,
    hexSubstitutionSummary,
  });
  const boundaryRows = buildBoundaryRows();
  const falsifierRows = buildFalsifierRows({
    lab4Report,
    lab1Report,
    lab2Report,
    lab3Report,
    siteSupportLedgerSummary,
    baselinePreservationSummary,
    squareAblationSummary,
    squareSubstitutionSummary,
    hexAblationSummary,
    hexSubstitutionSummary,
    exactLoopSiteCompletionSummary,
    adjointLoopSiteCompletionSummary,
    s4OrbitCoverageSummary,
    optionalDestructiveMaskSummary,
    controlRows,
  });
  const finalVerdict = classifyFinalVerdict({
    boundaryRows,
    falsifierRows,
    controlRows,
    siteSupportLedgerSummary,
    baselinePreservationSummary,
    squareAblationSummary,
    squareSubstitutionSummary,
    hexAblationSummary,
    hexSubstitutionSummary,
    exactLoopSiteCompletionSummary,
    adjointLoopSiteCompletionSummary,
    s4OrbitCoverageSummary,
  });
  const integrityIssues = buildIntegrityIssues({
    lab4Report,
    lab1Report,
    lab2Report,
    lab3Report,
    siteSupportLedgerRows,
    siteSupportLedgerSummary,
    baselinePreservationRows,
    baselinePreservationSummary,
    squareAblationRows,
    squareAblationSummary,
    squareSubstitutionRows,
    squareSubstitutionSummary,
    hexAblationRows,
    hexAblationSummary,
    hexSubstitutionRows,
    hexSubstitutionSummary,
    exactLoopSiteCompletionSummary,
    adjointLoopSiteCompletionSummary,
    s4OrbitCoverageSummary,
    optionalDestructiveMaskSummary,
    controlRows,
    boundaryRows,
    falsifierRows,
    finalVerdict,
  });
  const ok =
    integrityIssues.length === 0 &&
    falsifierRows.every((row) => !row.triggered) &&
    finalVerdict === 'T28-S-Lab-5-site-level-support-candidacy-pass';

  return {
    method: METHOD,
    experimentName: EXPERIMENT_NAME,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    operatorMatrixProvenance: context.operatorMatrixProvenance,
    parentEvidenceRows,
    siteSupportLedgerRows,
    siteSupportLedgerSummary,
    baselinePreservationRows,
    baselinePreservationSummary,
    squareAblationRows,
    squareAblationSummary,
    squareSubstitutionRows,
    squareSubstitutionSummary,
    hexAblationRows,
    hexAblationSummary,
    hexSubstitutionRows,
    hexSubstitutionSummary,
    exactLoopSiteCompletionRows,
    exactLoopSiteCompletionSummary,
    adjointLoopSiteCompletionRows,
    adjointLoopSiteCompletionSummary,
    s4OrbitCoverageRows,
    s4OrbitCoverageSummary,
    optionalDestructiveMaskRows,
    optionalDestructiveMaskSummary,
    controlRows,
    boundaryRows,
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
  const squarePolarityByDirectedPair = new Map(
    squarePolarityRows
      .filter((row) => row.sourceLabelPair && row.targetLabelPair)
      .map((row) => [
        directedPairKey(row.sourceLabelPair as [A3Label, A3Label], row.targetLabelPair as [A3Label, A3Label]),
        row,
      ]),
  );
  const qByLabel = new Map<A3Label, Vec3>(
    hexRows.map((row) => {
      const label = hexLabelFromId(row.objectId);
      return [label, scaleVec3(row.sectorPlus as Vec3, -3 / 2)];
    }),
  );
  const kappaByKey = new Map(lab3Report.signedKernelRows.map((row) => [`${row.hexId}::${row.squareId}`, row.kappaValue]));
  const kappa = hexIds.map((hexId) => squareIds.map((squareId) => kappaByKey.get(`${hexId}::${squareId}`) ?? 0));
  const gH = matrixMultiply(kappa, transpose(kappa));
  const gQ = matrixMultiply(transpose(kappa), kappa);

  return {
    squareIds,
    hexIds,
    squareRows,
    hexRows,
    squarePolarityByDirectedPair,
    qByLabel,
    kappa,
    d: scaleMatrix(kappa, 1 / 6),
    rExact: scaleMatrix(transpose(kappa), 3 / 4),
    rAdj: scaleMatrix(transpose(kappa), 1 / 6),
    pQ: scaleMatrix(gQ, 1 / 8),
    pH: scaleMatrix(gH, 1 / 8),
    operatorMatrixProvenance: 'reconstructed-from-Lab3-kappa-consistent-with-Lab4',
  };
}

function buildParentEvidenceRows(lab4Report: S4Report, lab1Report: S1Report, lab2Report: S2Report, lab3Report: S3Report): ParentEvidenceRow[] {
  const rows: ParentEvidenceRow[] = [
    {
      parentId: 'T28-S-Lab-4',
      method: lab4Report.method,
      ok: lab4Report.ok,
      finalVerdict: lab4Report.finalVerdict,
      consumedSections: [
        'projectorStructureRows',
        'exactLoopProjectorRows',
        'adjointLoopScaledProjectorRows',
        'qModeProjectionRows',
        'nullControlRows',
        'qSeedIterationRows',
        'fullQPairIterationRows',
        'loopEquivarianceRows',
        'boundaryRows',
        'finalVerdict',
        'ok',
      ],
      parentStatus: parentLab4Accepted(lab4Report) ? 'accepted-parent' : 'rejected-parent',
    },
    {
      parentId: 'T28-S-Lab-1',
      method: lab1Report.method,
      ok: lab1Report.ok,
      finalVerdict: lab1Report.finalVerdict,
      consumedSections: ['readoutSectionRows', 'squarePolarityRows', 'rawScaleSummary', 's4ActionRows', 'finalVerdict', 'ok'],
      parentStatus: parentLab1Accepted(lab1Report) ? 'accepted-parent' : 'rejected-parent',
    },
    {
      parentId: 'T28-S-Lab-2',
      method: lab2Report.method,
      ok: lab2Report.ok,
      finalVerdict: lab2Report.finalVerdict,
      consumedSections: [
        'supportSetSummary',
        'supportIncidenceRows',
        'sectorPreservationSummary',
        'squarePolarityGateSummary',
        'rawHexScaleGateSummary',
        'boundaryRows',
        'finalVerdict',
        'ok',
      ],
      parentStatus: parentLab2Accepted(lab2Report) ? 'accepted-parent' : 'rejected-parent',
    },
    {
      parentId: 'T28-S-Lab-3',
      method: lab3Report.method,
      ok: lab3Report.ok,
      finalVerdict: lab3Report.finalVerdict,
      consumedSections: [
        'signedKernelRows',
        'rawSquareToHexRows',
        'reverseExactHexToSquareRows',
        'unweightedAdjointHexToSquareRows',
        'normalizationDistinctionRows',
        'squarePolarityGateRows',
        'rawScaleGateRows',
        'finalVerdict',
        'ok',
      ],
      parentStatus: parentLab3Accepted(lab3Report) ? 'accepted-parent' : 'rejected-parent',
    },
  ];

  for (const parentId of ['p-simplex-vector-order-parameter-diagnostic-v0', 'T28-N0', 'T28-P', 'T28-Q']) {
    const inherited =
      lab4Report.parentEvidenceRows.find((row) => row.parentId === `${parentId} inherited`) ??
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

function parentLab4Accepted(report: S4Report): boolean {
  return report.ok === true &&
    report.finalVerdict === 'T28-S-Lab-4-sector-coupled-loop-standard-projector-pass' &&
    report.projectorStructureSummary.status === 'standard-projector-structure-pass' &&
    report.qModeProjectionSummary.status === 'q-mode-standard-subspace-membership-pass' &&
    report.nullControlSummary.status === 'null-controls-pass' &&
    report.exactLoopProjectorSummary.status === 'exact-loop-standard-projector-pass' &&
    report.adjointLoopScaledProjectorSummary.status === 'adjoint-loop-scaled-projector-pass' &&
    report.loopEquivarianceSummary.status === 'sector-loop-operators-s4-equivariant';
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

function parentLab3Accepted(report: S3Report): boolean {
  return report.ok === true &&
    report.finalVerdict === 'T28-S-Lab-3-signed-square-hex-sector-coupling-pass' &&
    report.signedKernelSummary.status === 'signed-square-hex-kernel-constructed' &&
    report.rawSquareToHexSummary.status === 'raw-square-to-hex-q-mode-pass' &&
    report.reverseExactHexToSquareSummary.status === 'reverse-exact-hex-to-square-q-mode-pass' &&
    report.unweightedAdjointHexToSquareSummary.status === 'unweighted-adjoint-returns-two-ninths-square-q-mode-pass' &&
    report.normalizationDistinctionSummary.status === 'exact-and-adjoint-normalizations-distinguished' &&
    report.squarePolarityGateSummary.status === 'square-hex-coupling-blocked-by-square-polarity' &&
    report.rawScaleGateSummary.status === 'square-hex-coupling-raw-scale-gate-pass';
}

function buildSiteSupportLedgerRows(siteForms: readonly SiteForm[], context: OperatorContext): SiteSupportLedgerRow[] {
  const bySiteId = new Map(siteForms.map((site) => [site.siteId, site]));

  return siteForms.map((site) => {
    const complement = bySiteId.get(site.complementSiteId) ?? site;
    const squareError = compareSquareSections(site.squareAntiPair, complement.squareAntiPair);
    const hexError = compareHexSections(site.hexEnvelope, complement.hexEnvelope);
    const maxConstructionError = Math.max(squareError, hexError);
    const complementSupportAxisEquivalent = maxConstructionError <= EPSILON;
    const squareAntiPairRows = [site.squareForwardId, site.squareReverseId].map((objectId) => ({
      objectId,
      value: cleanVec3(site.squareAntiPair.values.get(objectId) ?? zeroVec3()),
    }));
    const hexEnvelopeRows = context.hexIds.map((hexId) => {
      const omittedLabel = hexLabelFromId(hexId);
      return {
        hexId,
        omittedLabel,
        signClass: site.sourcePair.includes(omittedLabel) ? 'endpoint-negative' as const : 'complement-positive' as const,
        value: cleanVec3(site.hexEnvelope.values.get(hexId) ?? zeroVec3()),
      };
    });

    return {
      siteId: site.siteId,
      sourcePair: [...site.sourcePair],
      complementPair: [...site.complementPair],
      q_S: cleanVec3(site.qS),
      squareForwardId: site.squareForwardId,
      squareReverseId: site.squareReverseId,
      squareAntiPairRows,
      hexEnvelopeRows,
      complementSiteId: site.complementSiteId,
      complementSupportAxisEquivalent,
      maxConstructionError,
      status: complementSupportAxisEquivalent &&
        squareAntiPairRows.length === 2 &&
        hexEnvelopeRows.length === 4
        ? 'site-level-standard-support-ledger-ready'
        : 'site-level-standard-support-ledger-failed',
    };
  });
}

function buildSiteSupportLedgerSummary(rows: readonly SiteSupportLedgerRow[]): SiteSupportLedgerSummary {
  const readyCount = rows.filter((row) => row.status === 'site-level-standard-support-ledger-ready').length;
  const complementEquivalenceCount = rows.filter((row) => row.complementSupportAxisEquivalent).length;

  return {
    siteCount: rows.length,
    readyCount,
    complementEquivalenceCount,
    maxConstructionError: maxOf(rows.map((row) => row.maxConstructionError)),
    status: rows.length === 6 && readyCount === rows.length && complementEquivalenceCount === rows.length
      ? 'site-level-standard-support-ledger-ready'
      : 'site-level-standard-support-ledger-failed',
  };
}

function buildBaselinePreservationRows(siteForms: readonly SiteForm[], context: OperatorContext): BaselinePreservationRow[] {
  return siteForms.flatMap((site) => [
    baselineRow(site, 'P_Q-preserves-square-anti-pair', applyPQ(context, site.squareAntiPair), site.squareAntiPair, buildZeroHexSection(context), buildZeroHexSection(context)),
    baselineRow(site, 'P_H-preserves-hex-envelope', buildZeroSquareSection(context), buildZeroSquareSection(context), applyPH(context, site.hexEnvelope), site.hexEnvelope),
    baselineRow(site, 'D-square-to-hex-envelope', buildZeroSquareSection(context), buildZeroSquareSection(context), applyD(context, site.squareAntiPair), site.hexEnvelope),
    baselineRow(site, 'R_exact-hex-to-square-anti-pair', applyRExact(context, site.hexEnvelope), site.squareAntiPair, buildZeroHexSection(context), buildZeroHexSection(context)),
    baselineRow(site, 'R_adj-hex-to-two-ninths-square-anti-pair', applyRAdj(context, site.hexEnvelope), scaleSection(site.squareAntiPair, 2 / 9), buildZeroHexSection(context), buildZeroHexSection(context)),
  ]);
}

function baselineRow(
  site: SiteForm,
  testId: BaselinePreservationRow['testId'],
  computedSquare: Section,
  expectedSquare: Section,
  computedHex: Section,
  expectedHex: Section,
): BaselinePreservationRow {
  const maxError = Math.max(compareSquareSections(computedSquare, expectedSquare), compareHexSections(computedHex, expectedHex));

  return {
    siteId: site.siteId,
    testId,
    computedSquareSection: sectionToRecord(computedSquare),
    expectedSquareSection: sectionToRecord(expectedSquare),
    computedHexSection: sectionToRecord(computedHex),
    expectedHexSection: sectionToRecord(expectedHex),
    maxError,
    status: maxError <= EPSILON ? 'site-standard-support-baseline-pass' : 'site-standard-support-baseline-failed',
  };
}

function buildSquareAblationRows(siteForms: readonly SiteForm[], context: OperatorContext): SquareAblationRow[] {
  return siteForms.flatMap((site) => {
    const zeroSquare = buildZeroSquareSection(context);
    const halfSquare = scaleSection(site.squareAntiPair, 1 / 2);
    const halfHex = scaleSection(site.hexEnvelope, 1 / 2);
    const ninthSquare = scaleSection(site.squareAntiPair, 1 / 9);
    const singleForward = setSectionValue(zeroSquare, site.squareForwardId, site.qS);
    const singleReverse = setSectionValue(zeroSquare, site.squareReverseId, scaleVec3(site.qS, -1));
    const removeForward = setSectionValue(cloneSection(site.squareAntiPair), site.squareForwardId, zeroVec3());
    const removeReverse = setSectionValue(cloneSection(site.squareAntiPair), site.squareReverseId, zeroVec3());
    const removeBoth = buildZeroSquareSection(context);

    return [
      squareAblationRow(site, context, 'single-forward-square-seed', singleForward, halfSquare, halfHex, halfSquare, ninthSquare, 1 / 2, 1 / 9),
      squareAblationRow(site, context, 'single-reverse-square-seed', singleReverse, halfSquare, halfHex, halfSquare, ninthSquare, 1 / 2, 1 / 9),
      squareAblationRow(site, context, 'remove-forward-from-anti-pair', removeForward, halfSquare, halfHex, halfSquare, ninthSquare, 1 / 2, 1 / 9),
      squareAblationRow(site, context, 'remove-reverse-from-anti-pair', removeReverse, halfSquare, halfHex, halfSquare, ninthSquare, 1 / 2, 1 / 9),
      squareAblationRow(site, context, 'remove-both-antipodal-squares', removeBoth, buildZeroSquareSection(context), buildZeroHexSection(context), buildZeroSquareSection(context), buildZeroSquareSection(context), 0, 0),
    ];
  });
}

function squareAblationRow(
  site: SiteForm,
  context: OperatorContext,
  ablationCase: SquareAblationRow['ablationCase'],
  input: Section,
  expectedProjected: Section,
  expectedHexDrive: Section,
  expectedExact: Section,
  expectedAdjoint: Section,
  expectedStrengthFactor: number,
  expectedAdjointStrengthFactor: number,
): SquareAblationRow {
  const projected = applyPQ(context, input);
  const hexDrive = applyD(context, input);
  const exactLoopReturn = applyRExact(context, hexDrive);
  const adjointLoopReturn = applyRAdj(context, hexDrive);
  const maxError = Math.max(
    compareSquareSections(projected, expectedProjected),
    compareHexSections(hexDrive, expectedHexDrive),
    compareSquareSections(exactLoopReturn, expectedExact),
    compareSquareSections(adjointLoopReturn, expectedAdjoint),
  );

  return {
    siteId: site.siteId,
    ablationCase,
    inputSquareSection: sectionToRecord(input),
    projectedSquareSection: sectionToRecord(projected),
    expectedProjectedSquareSection: sectionToRecord(expectedProjected),
    hexDriveSection: sectionToRecord(hexDrive),
    expectedHexDriveSection: sectionToRecord(expectedHexDrive),
    exactLoopReturn: sectionToRecord(exactLoopReturn),
    expectedExactLoopReturn: sectionToRecord(expectedExact),
    adjointLoopReturn: sectionToRecord(adjointLoopReturn),
    expectedAdjointLoopReturn: sectionToRecord(expectedAdjoint),
    expectedStrengthFactor,
    expectedAdjointStrengthFactor,
    maxError,
    status: maxError <= EPSILON ? 'square-support-ablation-prediction-pass' : 'square-support-ablation-prediction-failed',
  };
}

function buildSquareSubstitutionRows(siteForms: readonly SiteForm[], context: OperatorContext): SquareSubstitutionRow[] {
  const bySiteId = new Map(siteForms.map((site) => [site.siteId, site]));

  return siteForms.flatMap((site) => {
    const complement = bySiteId.get(site.complementSiteId) ?? site;
    const wrongSite = firstNonComplementSite(site, siteForms);
    const overlapSite = firstOneLabelOverlapSite(site, siteForms);
    const symmetric = setSectionValue(
      setSectionValue(buildZeroSquareSection(context), site.squareForwardId, site.qS),
      site.squareReverseId,
      site.qS,
    );
    const overlapSeed = setSectionValue(buildZeroSquareSection(context), overlapSite.squareForwardId, overlapSite.qS);

    return [
      squareSubstitutionRow(site, context, 'symmetric-square-pair', symmetric, buildZeroSquareSection(context), 'none'),
      squareSubstitutionRow(site, context, 'complement-site-equivalence', complement.squareAntiPair, site.squareAntiPair, complement.siteId),
      squareSubstitutionRow(site, context, 'wrong-non-complement-site-anti-pair', wrongSite.squareAntiPair, wrongSite.squareAntiPair, wrongSite.siteId),
      squareSubstitutionRow(site, context, 'one-label-overlap-square', overlapSeed, scaleSection(overlapSite.squareAntiPair, 1 / 2), overlapSite.siteId),
    ];
  });
}

function squareSubstitutionRow(
  site: SiteForm,
  context: OperatorContext,
  substitutionCase: SquareSubstitutionRow['substitutionCase'],
  input: Section,
  expectedProjected: Section,
  expectedSiteId: SiteId | 'none',
): SquareSubstitutionRow {
  const projected = applyPQ(context, input);
  const acceptedAsTestedSite = compareSquareSections(projected, site.squareAntiPair) <= EPSILON;
  const maxError = compareSquareSections(projected, expectedProjected);
  const pass = maxError <= EPSILON && (
    substitutionCase === 'complement-site-equivalence' ||
    substitutionCase === 'symmetric-square-pair' ||
    !acceptedAsTestedSite
  );
  const status = pass
    ? substitutionCase === 'symmetric-square-pair'
      ? 'square-symmetric-substitution-killed'
      : substitutionCase === 'complement-site-equivalence'
        ? 'antipodal-complement-site-support-axis-equivalent'
        : substitutionCase === 'wrong-non-complement-site-anti-pair'
          ? 'redirected-to-other-site-square-standard'
          : 'one-label-overlap-square-substitution-redirected'
    : 'wrong-square-substitution-falsely-accepted-for-site';

  return {
    siteId: site.siteId,
    substitutionCase,
    inputSquareSection: sectionToRecord(input),
    projectedSquareSection: sectionToRecord(projected),
    expectedProjectedSquareSection: sectionToRecord(expectedProjected),
    expectedSiteId,
    testedSiteId: site.siteId,
    acceptedAsTestedSite,
    maxError,
    status,
  };
}

function buildSquareSubstitutionSummary(rows: readonly SquareSubstitutionRow[]): SquareSubstitutionSummary {
  const falseAcceptedCount = rows.filter((row) => row.status === 'wrong-square-substitution-falsely-accepted-for-site').length;
  const complementEquivalenceCount = rows.filter((row) => row.status === 'antipodal-complement-site-support-axis-equivalent').length;
  const passCount = rows.length - falseAcceptedCount;

  return {
    rowCount: rows.length,
    passCount,
    falseAcceptedCount,
    complementEquivalenceCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: falseAcceptedCount === 0 && rows.length === 24 && complementEquivalenceCount === 6
      ? 'square-substitution-controls-pass'
      : falseAcceptedCount > 0
        ? 'wrong-square-substitution-falsely-accepted-for-site'
        : 'square-substitution-control-failed',
  };
}

function buildHexAblationRows(siteForms: readonly SiteForm[], context: OperatorContext): HexAblationRow[] {
  return siteForms.flatMap((site) => {
    const [endpointLeft, endpointRight] = site.sourcePair;
    const [complementLeft, complementRight] = site.complementPair;

    return [
      hexAblationRow(site, context, 'remove-endpoint-hex-left', removeHexLabels(site.hexEnvelope, [endpointLeft]), expectedSingleEndpointHexProjection(site, endpointLeft)),
      hexAblationRow(site, context, 'remove-endpoint-hex-right', removeHexLabels(site.hexEnvelope, [endpointRight]), expectedSingleEndpointHexProjection(site, endpointRight)),
      hexAblationRow(site, context, 'remove-complement-hex-left', removeHexLabels(site.hexEnvelope, [complementLeft]), expectedSingleComplementHexProjection(site, complementLeft)),
      hexAblationRow(site, context, 'remove-complement-hex-right', removeHexLabels(site.hexEnvelope, [complementRight]), expectedSingleComplementHexProjection(site, complementRight)),
      hexAblationRow(site, context, 'remove-endpoint-pair', removeHexLabels(site.hexEnvelope, site.sourcePair), scaleSection(site.hexEnvelope, 1 / 2)),
      hexAblationRow(site, context, 'remove-complement-pair', removeHexLabels(site.hexEnvelope, site.complementPair), scaleSection(site.hexEnvelope, 1 / 2)),
      hexAblationRow(site, context, 'remove-all-hexes', buildZeroHexSection(context), buildZeroHexSection(context)),
    ];
  });
}

function hexAblationRow(
  site: SiteForm,
  context: OperatorContext,
  ablationCase: HexAblationRow['ablationCase'],
  input: Section,
  expectedProjected: Section,
): HexAblationRow {
  const projected = applyPH(context, input);
  const exactSquareReturn = applyRExact(context, input);
  const expectedExactSquareReturn = applyRExact(context, expectedProjected);
  const adjointSquareReturn = applyRAdj(context, input);
  const expectedAdjointSquareReturn = scaleSection(expectedExactSquareReturn, 2 / 9);
  const maxError = Math.max(
    compareHexSections(projected, expectedProjected),
    compareSquareSections(exactSquareReturn, expectedExactSquareReturn),
    compareSquareSections(adjointSquareReturn, expectedAdjointSquareReturn),
  );

  return {
    siteId: site.siteId,
    ablationCase,
    inputHexSection: sectionToRecord(input),
    projectedHexSection: sectionToRecord(projected),
    expectedProjectedHexSection: sectionToRecord(expectedProjected),
    exactSquareReturn: sectionToRecord(exactSquareReturn),
    expectedExactSquareReturn: sectionToRecord(expectedExactSquareReturn),
    adjointSquareReturn: sectionToRecord(adjointSquareReturn),
    expectedAdjointSquareReturn: sectionToRecord(expectedAdjointSquareReturn),
    maxError,
    status: maxError <= EPSILON ? 'hex-support-ablation-prediction-pass' : 'hex-support-ablation-prediction-failed',
  };
}

function buildHexSubstitutionRows(siteForms: readonly SiteForm[], context: OperatorContext): HexSubstitutionRow[] {
  const bySiteId = new Map(siteForms.map((site) => [site.siteId, site]));

  return siteForms.flatMap((site) => {
    const complement = bySiteId.get(site.complementSiteId) ?? site;
    const wrongSite = firstNonComplementSite(site, siteForms);
    const uniform = sectionFromValues(context.hexIds, new Map(context.hexIds.map((hexId) => [hexId, site.qS])));
    const reversed = scaleSection(site.hexEnvelope, -1);

    return [
      hexSubstitutionRow(site, context, 'uniform-hex-substitution', uniform, buildZeroHexSection(context), buildZeroSquareSection(context), buildZeroSquareSection(context), 'none'),
      hexSubstitutionRow(site, context, 'complement-site-envelope-equivalence', complement.hexEnvelope, site.hexEnvelope, site.squareAntiPair, scaleSection(site.squareAntiPair, 2 / 9), complement.siteId),
      hexSubstitutionRow(site, context, 'wrong-non-complement-site-envelope', wrongSite.hexEnvelope, wrongSite.hexEnvelope, wrongSite.squareAntiPair, scaleSection(wrongSite.squareAntiPair, 2 / 9), wrongSite.siteId),
      hexSubstitutionRow(site, context, 'endpoint-complement-sign-reversal', reversed, reversed, scaleSection(site.squareAntiPair, -1), scaleSection(site.squareAntiPair, -2 / 9), 'antipodal-opposition'),
    ];
  });
}

function hexSubstitutionRow(
  site: SiteForm,
  context: OperatorContext,
  substitutionCase: HexSubstitutionRow['substitutionCase'],
  input: Section,
  expectedProjected: Section,
  expectedExact: Section,
  expectedAdjoint: Section,
  expectedSiteId: SiteId | 'antipodal-opposition' | 'none',
): HexSubstitutionRow {
  const projected = applyPH(context, input);
  const exactSquareReturn = applyRExact(context, input);
  const adjointSquareReturn = applyRAdj(context, input);
  const acceptedAsTestedSite = compareHexSections(projected, site.hexEnvelope) <= EPSILON;
  const maxError = Math.max(
    compareHexSections(projected, expectedProjected),
    compareSquareSections(exactSquareReturn, expectedExact),
    compareSquareSections(adjointSquareReturn, expectedAdjoint),
  );
  const pass = maxError <= EPSILON && (
    substitutionCase === 'complement-site-envelope-equivalence' ||
    substitutionCase === 'uniform-hex-substitution' ||
    substitutionCase === 'endpoint-complement-sign-reversal' ||
    !acceptedAsTestedSite
  );
  const status = pass
    ? substitutionCase === 'uniform-hex-substitution'
      ? 'uniform-hex-substitution-killed'
      : substitutionCase === 'complement-site-envelope-equivalence'
        ? 'antipodal-complement-site-hex-envelope-equivalent'
        : substitutionCase === 'wrong-non-complement-site-envelope'
          ? 'redirected-to-other-site-hex-envelope'
          : 'hex-envelope-sign-reversal-preserved-as-antipodal-opposition'
    : 'wrong-hex-substitution-falsely-accepted-for-site';

  return {
    siteId: site.siteId,
    substitutionCase,
    inputHexSection: sectionToRecord(input),
    projectedHexSection: sectionToRecord(projected),
    expectedProjectedHexSection: sectionToRecord(expectedProjected),
    exactSquareReturn: sectionToRecord(exactSquareReturn),
    expectedExactSquareReturn: sectionToRecord(expectedExact),
    adjointSquareReturn: sectionToRecord(adjointSquareReturn),
    expectedAdjointSquareReturn: sectionToRecord(expectedAdjoint),
    acceptedAsTestedSite,
    expectedSiteId,
    testedSiteId: site.siteId,
    maxError,
    status,
  };
}

function buildHexSubstitutionSummary(rows: readonly HexSubstitutionRow[]): HexSubstitutionSummary {
  const falseAcceptedCount = rows.filter((row) => row.status === 'wrong-hex-substitution-falsely-accepted-for-site').length;
  const complementEquivalenceCount = rows.filter((row) => row.status === 'antipodal-complement-site-hex-envelope-equivalent').length;
  const passCount = rows.length - falseAcceptedCount;

  return {
    rowCount: rows.length,
    passCount,
    falseAcceptedCount,
    complementEquivalenceCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: falseAcceptedCount === 0 && rows.length === 24 && complementEquivalenceCount === 6
      ? 'hex-substitution-controls-pass'
      : falseAcceptedCount > 0
        ? 'wrong-hex-substitution-falsely-accepted-for-site'
        : 'hex-substitution-control-failed',
  };
}

function buildExactLoopSiteCompletionRows(args: {
  siteForms: readonly SiteForm[];
  context: OperatorContext;
  squareAblationRows: readonly SquareAblationRow[];
  squareSubstitutionRows: readonly SquareSubstitutionRow[];
  hexAblationRows: readonly HexAblationRow[];
  hexSubstitutionRows: readonly HexSubstitutionRow[];
}): ExactLoopSiteCompletionRow[] {
  const squareCases = [
    ...args.siteForms.map((site) => ({ site, sourceCaseId: 'standard-square-anti-pair', input: site.squareAntiPair, expectedProjection: site.squareAntiPair, includeFirst: true })),
    ...args.squareAblationRows.map((row) => ({ site: siteById(args.siteForms, row.siteId), sourceCaseId: `square-ablation:${row.ablationCase}`, input: sectionFromRecord(args.context.squareIds, row.inputSquareSection), expectedProjection: sectionFromRecord(args.context.squareIds, row.expectedProjectedSquareSection), includeFirst: false })),
    ...args.squareSubstitutionRows.map((row) => ({ site: siteById(args.siteForms, row.siteId), sourceCaseId: `square-substitution:${row.substitutionCase}`, input: sectionFromRecord(args.context.squareIds, row.inputSquareSection), expectedProjection: sectionFromRecord(args.context.squareIds, row.expectedProjectedSquareSection), includeFirst: false })),
  ];
  const hexCases = [
    ...args.siteForms.map((site) => ({ site, sourceCaseId: 'standard-hex-envelope', input: site.hexEnvelope, expectedProjection: site.hexEnvelope, includeFirst: true })),
    ...args.hexAblationRows.map((row) => ({ site: siteById(args.siteForms, row.siteId), sourceCaseId: `hex-ablation:${row.ablationCase}`, input: sectionFromRecord(args.context.hexIds, row.inputHexSection), expectedProjection: sectionFromRecord(args.context.hexIds, row.expectedProjectedHexSection), includeFirst: false })),
    ...args.hexSubstitutionRows.map((row) => ({ site: siteById(args.siteForms, row.siteId), sourceCaseId: `hex-substitution:${row.substitutionCase}`, input: sectionFromRecord(args.context.hexIds, row.inputHexSection), expectedProjection: sectionFromRecord(args.context.hexIds, row.expectedProjectedHexSection), includeFirst: false })),
  ];
  const rows: ExactLoopSiteCompletionRow[] = [];

  for (const item of squareCases) {
    const first = applyD(args.context, item.input);
    if (item.includeFirst) {
      rows.push(exactLoopRow(item.site, item.sourceCaseId, 'square-only', 1, buildZeroSquareSection(args.context), first, buildZeroSquareSection(args.context), item.site.hexEnvelope));
    }
    rows.push(exactLoopRow(item.site, item.sourceCaseId, 'square-only', 2, applyRExact(args.context, first), buildZeroHexSection(args.context), item.expectedProjection, buildZeroHexSection(args.context)));
  }

  for (const item of hexCases) {
    const first = applyRExact(args.context, item.input);
    if (item.includeFirst) {
      rows.push(exactLoopRow(item.site, item.sourceCaseId, 'hex-only', 1, first, buildZeroHexSection(args.context), item.site.squareAntiPair, buildZeroHexSection(args.context)));
    }
    rows.push(exactLoopRow(item.site, item.sourceCaseId, 'hex-only', 2, buildZeroSquareSection(args.context), applyD(args.context, first), buildZeroSquareSection(args.context), item.expectedProjection));
  }

  return rows;
}

function exactLoopRow(
  site: SiteForm,
  sourceCaseId: string,
  seedLayer: 'square-only' | 'hex-only',
  iterationIndex: 1 | 2,
  computedSquare: Section,
  computedHex: Section,
  expectedSquare: Section,
  expectedHex: Section,
): ExactLoopSiteCompletionRow {
  const maxError = Math.max(compareSquareSections(computedSquare, expectedSquare), compareHexSections(computedHex, expectedHex));

  return {
    siteId: site.siteId,
    sourceCaseId,
    seedLayer,
    iterationIndex,
    computedSquareSection: sectionToRecord(computedSquare),
    expectedSquareSection: sectionToRecord(expectedSquare),
    computedHexSection: sectionToRecord(computedHex),
    expectedHexSection: sectionToRecord(expectedHex),
    maxError,
    status: maxError <= EPSILON ? 'site-level-exact-loop-support-completion-pass' : 'site-level-exact-loop-support-completion-failed',
  };
}

function buildAdjointLoopSiteCompletionRows(args: {
  siteForms: readonly SiteForm[];
  context: OperatorContext;
  squareAblationRows: readonly SquareAblationRow[];
  squareSubstitutionRows: readonly SquareSubstitutionRow[];
  hexAblationRows: readonly HexAblationRow[];
  hexSubstitutionRows: readonly HexSubstitutionRow[];
}): AdjointLoopSiteCompletionRow[] {
  const squareCases = [
    ...args.siteForms.map((site) => ({ site, sourceCaseId: 'standard-square-anti-pair', input: site.squareAntiPair, expectedProjection: site.squareAntiPair })),
    ...args.squareAblationRows.map((row) => ({ site: siteById(args.siteForms, row.siteId), sourceCaseId: `square-ablation:${row.ablationCase}`, input: sectionFromRecord(args.context.squareIds, row.inputSquareSection), expectedProjection: sectionFromRecord(args.context.squareIds, row.expectedProjectedSquareSection) })),
    ...args.squareSubstitutionRows.map((row) => ({ site: siteById(args.siteForms, row.siteId), sourceCaseId: `square-substitution:${row.substitutionCase}`, input: sectionFromRecord(args.context.squareIds, row.inputSquareSection), expectedProjection: sectionFromRecord(args.context.squareIds, row.expectedProjectedSquareSection) })),
  ];
  const hexCases = [
    ...args.siteForms.map((site) => ({ site, sourceCaseId: 'standard-hex-envelope', input: site.hexEnvelope, expectedProjection: site.hexEnvelope })),
    ...args.hexAblationRows.map((row) => ({ site: siteById(args.siteForms, row.siteId), sourceCaseId: `hex-ablation:${row.ablationCase}`, input: sectionFromRecord(args.context.hexIds, row.inputHexSection), expectedProjection: sectionFromRecord(args.context.hexIds, row.expectedProjectedHexSection) })),
    ...args.hexSubstitutionRows.map((row) => ({ site: siteById(args.siteForms, row.siteId), sourceCaseId: `hex-substitution:${row.substitutionCase}`, input: sectionFromRecord(args.context.hexIds, row.inputHexSection), expectedProjection: sectionFromRecord(args.context.hexIds, row.expectedProjectedHexSection) })),
  ];

  return [
    ...squareCases.map((item) => {
      const computedSquare = applyRAdj(args.context, applyD(args.context, item.input));
      return adjointLoopRow(item.site, item.sourceCaseId, 'square-only', computedSquare, buildZeroHexSection(args.context), scaleSection(item.expectedProjection, 2 / 9), buildZeroHexSection(args.context));
    }),
    ...hexCases.map((item) => {
      const computedHex = applyD(args.context, applyRAdj(args.context, item.input));
      return adjointLoopRow(item.site, item.sourceCaseId, 'hex-only', buildZeroSquareSection(args.context), computedHex, buildZeroSquareSection(args.context), scaleSection(item.expectedProjection, 2 / 9));
    }),
  ];
}

function adjointLoopRow(
  site: SiteForm,
  sourceCaseId: string,
  seedLayer: 'square-only' | 'hex-only',
  computedSquare: Section,
  computedHex: Section,
  expectedSquare: Section,
  expectedHex: Section,
): AdjointLoopSiteCompletionRow {
  const maxError = Math.max(compareSquareSections(computedSquare, expectedSquare), compareHexSections(computedHex, expectedHex));

  return {
    siteId: site.siteId,
    sourceCaseId,
    seedLayer,
    iterationIndex: 2,
    computedSquareSection: sectionToRecord(computedSquare),
    expectedSquareSection: sectionToRecord(expectedSquare),
    computedHexSection: sectionToRecord(computedHex),
    expectedHexSection: sectionToRecord(expectedHex),
    finiteAdjointLoopFactor: 2 / 9,
    maxError,
    status: maxError <= EPSILON ? 'site-level-adjoint-loop-support-completion-pass' : 'site-level-adjoint-loop-support-completion-failed',
  };
}

function buildS4OrbitCoverageRows(args: {
  siteForms: readonly SiteForm[];
  baselinePreservationRows: readonly BaselinePreservationRow[];
  squareAblationRows: readonly SquareAblationRow[];
  squareSubstitutionRows: readonly SquareSubstitutionRow[];
  hexAblationRows: readonly HexAblationRow[];
  hexSubstitutionRows: readonly HexSubstitutionRow[];
  exactLoopSiteCompletionRows: readonly ExactLoopSiteCompletionRow[];
  adjointLoopSiteCompletionRows: readonly AdjointLoopSiteCompletionRow[];
}): S4OrbitCoverageRow[] {
  return args.siteForms.map((site) => {
    const baselineRows = args.baselinePreservationRows.filter((row) => row.siteId === site.siteId);
    const squareAblationRows = args.squareAblationRows.filter((row) => row.siteId === site.siteId);
    const squareSubstitutionRows = args.squareSubstitutionRows.filter((row) => row.siteId === site.siteId);
    const hexAblationRows = args.hexAblationRows.filter((row) => row.siteId === site.siteId);
    const hexSubstitutionRows = args.hexSubstitutionRows.filter((row) => row.siteId === site.siteId);
    const exactRows = args.exactLoopSiteCompletionRows.filter((row) => row.siteId === site.siteId);
    const adjointRows = args.adjointLoopSiteCompletionRows.filter((row) => row.siteId === site.siteId);
    const baselinePass = baselineRows.every((row) => row.status === 'site-standard-support-baseline-pass');
    const squareAblationPass = squareAblationRows.every((row) => row.status === 'square-support-ablation-prediction-pass');
    const squareSubstitutionPass = squareSubstitutionRows.every((row) => row.status !== 'wrong-square-substitution-falsely-accepted-for-site');
    const hexAblationPass = hexAblationRows.every((row) => row.status === 'hex-support-ablation-prediction-pass');
    const hexSubstitutionPass = hexSubstitutionRows.every((row) => row.status !== 'wrong-hex-substitution-falsely-accepted-for-site');
    const exactLoopPass = exactRows.every((row) => row.status === 'site-level-exact-loop-support-completion-pass');
    const adjointLoopPass = adjointRows.every((row) => row.status === 'site-level-adjoint-loop-support-completion-pass');
    const maxError = maxOf([
      ...baselineRows.map((row) => row.maxError),
      ...squareAblationRows.map((row) => row.maxError),
      ...squareSubstitutionRows.map((row) => row.maxError),
      ...hexAblationRows.map((row) => row.maxError),
      ...hexSubstitutionRows.map((row) => row.maxError),
      ...exactRows.map((row) => row.maxError),
      ...adjointRows.map((row) => row.maxError),
    ]);
    const pass = baselinePass && squareAblationPass && squareSubstitutionPass && hexAblationPass && hexSubstitutionPass && exactLoopPass && adjointLoopPass;

    return {
      siteId: site.siteId,
      sourcePair: [...site.sourcePair],
      complementPair: [...site.complementPair],
      baselinePass,
      squareAblationPass,
      squareSubstitutionPass,
      hexAblationPass,
      hexSubstitutionPass,
      exactLoopPass,
      adjointLoopPass,
      maxError,
      status: pass ? 'site-support-candidacy-s4-orbit-pass' : 'site-support-candidacy-s4-orbit-failed',
    };
  });
}

function buildS4OrbitCoverageSummary(rows: readonly S4OrbitCoverageRow[]): S4OrbitCoverageSummary {
  const orbitPassCount = rows.filter((row) => row.status === 'site-support-candidacy-s4-orbit-pass').length;

  return {
    siteCount: rows.length,
    orbitPassCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: rows.length === 6 && orbitPassCount === rows.length
      ? 'site-support-candidacy-s4-orbit-pass'
      : 'site-support-candidacy-s4-orbit-failed',
  };
}

function buildOptionalDestructiveMaskRows(siteForms: readonly SiteForm[], context: OperatorContext): OptionalDestructiveMaskRow[] {
  return siteForms.flatMap((site) => {
    const squareMaskedCompletion = maskSection(
      applyRExact(context, applyD(context, maskSection(site.squareAntiPair, [site.squareForwardId]))),
      [site.squareForwardId],
    );
    const squareChanged = compareSquareSections(squareMaskedCompletion, site.squareAntiPair) > EPSILON;
    const maskedHexId = hexIdForOmittedLabel(site.sourcePair[0]);
    const hexMaskedCompletion = maskSection(
      applyD(context, applyRExact(context, maskSection(site.hexEnvelope, [maskedHexId]))),
      [maskedHexId],
    );
    const hexChanged = compareHexSections(hexMaskedCompletion, site.hexEnvelope) > EPSILON;

    return [
      {
        siteId: site.siteId,
        maskCase: 'mask-one-square-from-anti-pair',
        maskedSupportIds: [site.squareForwardId],
        renormalized: false,
        computedMaskedCompletion: sectionToRecord(squareMaskedCompletion),
        unmaskedExpectedCompletion: sectionToRecord(site.squareAntiPair),
        changedFromUnmasked: squareChanged,
        status: squareChanged
          ? 'destructive-support-mask-control-pass'
          : 'destructive-support-mask-falsely-preserved-standard-completion',
      },
      {
        siteId: site.siteId,
        maskCase: 'mask-one-hex-from-envelope',
        maskedSupportIds: [maskedHexId],
        renormalized: false,
        computedMaskedCompletion: sectionToRecord(hexMaskedCompletion),
        unmaskedExpectedCompletion: sectionToRecord(site.hexEnvelope),
        changedFromUnmasked: hexChanged,
        status: hexChanged
          ? 'destructive-support-mask-control-pass'
          : 'destructive-support-mask-falsely-preserved-standard-completion',
      },
    ];
  });
}

function buildOptionalDestructiveMaskSummary(rows: readonly OptionalDestructiveMaskRow[]): OptionalDestructiveMaskSummary {
  const passCount = rows.filter((row) => row.status === 'destructive-support-mask-control-pass').length;

  return {
    rowCount: rows.length,
    passCount,
    status: rows.length === 0
      ? 'destructive-support-mask-control-not-implemented'
      : passCount === rows.length
        ? 'destructive-support-mask-control-pass'
        : 'destructive-support-mask-falsely-preserved-standard-completion',
  };
}

function buildControlRows(args: {
  siteForms: readonly SiteForm[];
  context: OperatorContext;
  lab3Report: S3Report;
  squareSubstitutionSummary: SquareSubstitutionSummary;
  hexSubstitutionSummary: HexSubstitutionSummary;
}): ControlRow[] {
  const zeroSquare = buildZeroSquareSection(args.context);
  const zeroHex = buildZeroHexSection(args.context);
  const zeroError = maxOf([
    compareSquareSections(applyPQ(args.context, zeroSquare), zeroSquare),
    compareHexSections(applyPH(args.context, zeroHex), zeroHex),
    compareHexSections(applyD(args.context, zeroSquare), zeroHex),
    compareSquareSections(applyRExact(args.context, zeroHex), zeroSquare),
    compareSquareSections(applyRAdj(args.context, zeroHex), zeroSquare),
  ]);
  const scalarError = scalarMagnitudeSeedError(args.context, args.siteForms[0]);
  const sectorCollapseError = compareHexSections(applyD(args.context, args.siteForms[0].squareAntiPair), buildZeroHexSection(args.context));
  const squarePolarityCorruption = siteLevelSquarePolarityCorruptionControl(args.context, args.siteForms);
  const rawHexScaleCorruption = siteLevelRawHexScaleCorruptionControl(args.context, args.siteForms);
  const orderError = objectOrderInvariantMaxError(args.context, args.siteForms);
  const wrongSiteFalseAcceptance = args.squareSubstitutionSummary.falseAcceptedCount + args.hexSubstitutionSummary.falseAcceptedCount;

  return [
    controlRow('C0', 'zero seed', 'zero-seed-control-pass', zeroError <= EPSILON ? 'zero-seed-control-pass' : 'zero-seed-control-failed', 5, zeroError, 'Zero square and hex sections remain zero under P_Q, P_H, D, R_exact, and R_adj.'),
    controlRow('C1', 'scalar magnitude seed', 'scalar-support-seed-rejected', scalarError > EPSILON ? 'scalar-support-seed-rejected' : 'scalar-support-seed-accepted', 1, scalarError, 'Replacing the vector site seed by scalar magnitude does not preserve vector standard structure.'),
    controlRow('C2', 'sector collapse', 'sector-collapse-rejected', sectorCollapseError > EPSILON ? 'sector-collapse-rejected' : 'sector-collapse-accepted', 1, sectorCollapseError, 'Square contrast and hex common sectors are not interchangeable sources.'),
    controlRow('C3', 'unordered square sign', 'square-support-candidacy-blocked-by-polarity', squarePolarityCorruption.observedStatus, squarePolarityCorruption.checkedCount, squarePolarityCorruption.maxError, squarePolarityCorruption.note),
    controlRow('C4', 'raw hex scale corruption', 'hex-support-raw-scale-corruption-detected', rawHexScaleCorruption.observedStatus, rawHexScaleCorruption.checkedCount, rawHexScaleCorruption.maxError, rawHexScaleCorruption.note),
    controlRow('C5', 'row-order/object-order control', 'object-id-order-independent', orderError <= EPSILON ? 'object-id-order-independent' : 'object-order-dependent', args.siteForms.length, orderError, 'Reversed support row order leaves outputs unchanged by object ID.'),
    controlRow('C6', 'wrong-site false-positive control', 'wrong-site-support-form-not-falsely-accepted', wrongSiteFalseAcceptance === 0 ? 'wrong-site-support-form-not-falsely-accepted' : 'wrong-site-support-form-falsely-accepted', 12, wrongSiteFalseAcceptance, 'Non-complement wrong-site square and hex forms are redirected; complement sites are labeled equivalent.'),
  ];
}

function siteLevelSquarePolarityCorruptionControl(context: OperatorContext, siteForms: readonly SiteForm[]): LocalControlEvidence {
  let blockedCount = 0;
  let falselyAuthorizedCount = 0;

  for (const site of siteForms) {
    const forwardAuthority = context.squarePolarityByDirectedPair.get(directedPairKey(site.sourcePair, site.complementPair));
    const reverseAuthority = context.squarePolarityByDirectedPair.get(directedPairKey(site.complementPair, site.sourcePair));
    const corruptedForward: CorruptedSquareAuthority = {
      squareObjectId: forwardAuthority?.squareObjectId ?? site.squareForwardId,
      sourceLabelPair: null,
      targetLabelPair: null,
      correspondingTetraEdge: null,
    };
    const corruptedReverse: CorruptedSquareAuthority = {
      squareObjectId: reverseAuthority?.squareObjectId ?? site.squareReverseId,
      sourceLabelPair: null,
      targetLabelPair: null,
      correspondingTetraEdge: null,
    };

    if (authorizeSiteSquareSupportFromAuthority(site, corruptedForward, corruptedReverse)) {
      falselyAuthorizedCount += 1;
    } else {
      blockedCount += 1;
    }
  }

  return {
    checkedCount: siteForms.length,
    passedCount: blockedCount,
    failureCount: falselyAuthorizedCount,
    observedStatus: siteForms.length === 6 && blockedCount === siteForms.length
      ? 'square-support-candidacy-blocked-by-polarity'
      : 'square-support-candidacy-polarity-leak',
    maxError: falselyAuthorizedCount,
    note: `${blockedCount} Lab-5-local site square-polarity corruption attempts lacked sourceLabelPair/targetLabelPair authority and were blocked.`,
  };
}

function authorizeSiteSquareSupportFromAuthority(
  site: SiteForm,
  forwardAuthority: CorruptedSquareAuthority,
  reverseAuthority: CorruptedSquareAuthority,
): boolean {
  if (
    !forwardAuthority.sourceLabelPair ||
    !forwardAuthority.targetLabelPair ||
    !reverseAuthority.sourceLabelPair ||
    !reverseAuthority.targetLabelPair ||
    !forwardAuthority.correspondingTetraEdge ||
    !reverseAuthority.correspondingTetraEdge
  ) {
    return false;
  }

  return forwardAuthority.squareObjectId === site.squareForwardId &&
    reverseAuthority.squareObjectId === site.squareReverseId &&
    forwardAuthority.correspondingTetraEdge === site.edgeId &&
    reverseAuthority.correspondingTetraEdge === complementEdge(site.edgeId) &&
    directedPairKey(forwardAuthority.sourceLabelPair, forwardAuthority.targetLabelPair) === directedPairKey(site.sourcePair, site.complementPair) &&
    directedPairKey(reverseAuthority.sourceLabelPair, reverseAuthority.targetLabelPair) === directedPairKey(site.complementPair, site.sourcePair);
}

function siteLevelRawHexScaleCorruptionControl(context: OperatorContext, siteForms: readonly SiteForm[]): LocalControlEvidence {
  let corruptionDetectedCount = 0;
  let missedCount = 0;
  let maxSeparation = 0;

  for (const site of siteForms) {
    const corruptedEnvelope = scaleSection(site.hexEnvelope, 3 / 2);
    const rawEnvelopeError = compareHexSections(corruptedEnvelope, site.hexEnvelope);
    const exactReturnError = compareSquareSections(applyRExact(context, corruptedEnvelope), site.squareAntiPair);
    const adjointReturnError = compareSquareSections(applyRAdj(context, corruptedEnvelope), scaleSection(site.squareAntiPair, 2 / 9));
    const detected = rawEnvelopeError > EPSILON && exactReturnError > EPSILON && adjointReturnError > EPSILON;

    if (detected) {
      corruptionDetectedCount += 1;
    } else {
      missedCount += 1;
    }
    maxSeparation = Math.max(maxSeparation, rawEnvelopeError, exactReturnError, adjointReturnError);
  }

  return {
    checkedCount: siteForms.length,
    passedCount: corruptionDetectedCount,
    failureCount: missedCount,
    observedStatus: siteForms.length === 6 && corruptionDetectedCount === siteForms.length
      ? 'hex-support-raw-scale-corruption-detected'
      : 'hex-support-raw-scale-corruption-missed',
    maxError: missedCount,
    note: `${corruptionDetectedCount} Lab-5-local raw hex scale corruptions used (3/2)E_S(q_S) and failed raw envelope and return-form checks; max separation ${cleanNumber(maxSeparation)}.`,
  };
}

function controlRow(
  controlId: ControlRow['controlId'],
  controlName: string,
  expectedStatus: string,
  observedStatus: string,
  checkedCount: number,
  maxError: number,
  note: string,
): ControlRow {
  return {
    controlId,
    controlName,
    expectedStatus,
    observedStatus,
    checkedCount,
    maxError,
    status: observedStatus === expectedStatus ? 'control-pass' : 'control-fail',
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
  lab4Report: S4Report;
  lab1Report: S1Report;
  lab2Report: S2Report;
  lab3Report: S3Report;
  siteSupportLedgerSummary: SiteSupportLedgerSummary;
  baselinePreservationSummary: RowSummary<string, string>;
  squareAblationSummary: RowSummary<string, string>;
  squareSubstitutionSummary: SquareSubstitutionSummary;
  hexAblationSummary: RowSummary<string, string>;
  hexSubstitutionSummary: HexSubstitutionSummary;
  exactLoopSiteCompletionSummary: RowSummary<string, string>;
  adjointLoopSiteCompletionSummary: RowSummary<string, string>;
  s4OrbitCoverageSummary: S4OrbitCoverageSummary;
  optionalDestructiveMaskSummary: OptionalDestructiveMaskSummary;
  controlRows: readonly ControlRow[];
}): FalsifierRow[] {
  const controlsFail = args.controlRows.some((row) => row.status !== 'control-pass');
  const complementMishandled = args.siteSupportLedgerSummary.complementEquivalenceCount !== 6 ||
    args.squareSubstitutionSummary.complementEquivalenceCount !== 6 ||
    args.hexSubstitutionSummary.complementEquivalenceCount !== 6;

  return [
    falsifier('F1', 'Lab-4 parent missing or not accepted.', !parentLab4Accepted(args.lab4Report), `Lab-4 ok=${args.lab4Report.ok}; finalVerdict=${args.lab4Report.finalVerdict}.`),
    falsifier('F2', 'Lab-1/Lab-2/Lab-3 context missing or inconsistent.', !parentLab1Accepted(args.lab1Report) || !parentLab2Accepted(args.lab2Report) || !parentLab3Accepted(args.lab3Report), `Lab-1=${args.lab1Report.finalVerdict}; Lab-2=${args.lab2Report.finalVerdict}; Lab-3=${args.lab3Report.finalVerdict}.`),
    falsifier('F3', 'Uses T28-R as authority.', false, 'T28-R is recorded only as context-only-not-authority.'),
    falsifier('F4', 'Uses unordered square sign instead of authorized square polarity.', false, 'Square IDs are recovered from authorized source/target polarity rows.'),
    falsifier('F5', 'Site ledger reconstruction fails.', args.siteSupportLedgerSummary.status !== 'site-level-standard-support-ledger-ready', `ledger=${args.siteSupportLedgerSummary.status}.`),
    falsifier('F6', 'Baseline preservation fails.', args.baselinePreservationSummary.status !== 'site-standard-support-baseline-pass', `baseline=${args.baselinePreservationSummary.status}.`),
    falsifier('F7', 'Square ablation prediction fails.', args.squareAblationSummary.status !== 'square-support-ablation-prediction-pass', `squareAblation=${args.squareAblationSummary.status}.`),
    falsifier('F8', 'Square substitution control fails.', args.squareSubstitutionSummary.status !== 'square-substitution-controls-pass', `squareSubstitution=${args.squareSubstitutionSummary.status}.`),
    falsifier('F9', 'Hex ablation prediction fails.', args.hexAblationSummary.status !== 'hex-support-ablation-prediction-pass', `hexAblation=${args.hexAblationSummary.status}.`),
    falsifier('F10', 'Hex substitution control fails.', args.hexSubstitutionSummary.status !== 'hex-substitution-controls-pass', `hexSubstitution=${args.hexSubstitutionSummary.status}.`),
    falsifier('F11', 'Exact loop site completion fails.', args.exactLoopSiteCompletionSummary.status !== 'site-level-exact-loop-support-completion-pass', `exact=${args.exactLoopSiteCompletionSummary.status}.`),
    falsifier('F12', 'Adjoint loop site completion fails or labels 2/9 as damping/attenuation.', args.adjointLoopSiteCompletionSummary.status !== 'site-level-adjoint-loop-support-completion-pass', `adjoint=${args.adjointLoopSiteCompletionSummary.status}; factorLabel=finite-adjoint-loop-factor.`),
    falsifier('F13', 'S4 orbit coverage fails.', args.s4OrbitCoverageSummary.status !== 'site-support-candidacy-s4-orbit-pass', `orbit=${args.s4OrbitCoverageSummary.status}.`),
    falsifier('F14', 'Scalar magnitude, sector collapse, raw-scale, polarity, row-order, or wrong-site controls fail.', controlsFail, `controlFailCount=${args.controlRows.filter((row) => row.status !== 'control-pass').length}.`),
    falsifier('F15', 'Complement site equivalence is mishandled as a wrong-site false positive or false negative.', complementMishandled, `ledger=${args.siteSupportLedgerSummary.complementEquivalenceCount}; square=${args.squareSubstitutionSummary.complementEquivalenceCount}; hex=${args.hexSubstitutionSummary.complementEquivalenceCount}.`),
    falsifier('F16', 'Optional destructive mask, if implemented, is reported as a new support law.', false, `mask=${args.optionalDestructiveMaskSummary.status}; destructive-control only.`),
    falsifier('F17', 'Promotes result to mature support, field-world inhabitant, route, gate, vortex, region, resonance, phase behavior, damping, attenuation, topology, semantic naming, FieldCue, runtime, UI, packet writing, shape mutation, natural Laplacian, or field-world maturity.', false, 'Final verdict is site-level support operational candidacy only.'),
    falsifier('F18', 'Mutates Shape, packet, operation registry, store, UI, field atlas policy, FieldCue, GeneratedSiteReading, or runtime state.', false, 'New diagnostic source and script only.'),
  ];
}

function falsifier(falsifierId: FalsifierRow['falsifierId'], description: string, triggered: boolean, evidence: string): FalsifierRow {
  return { falsifierId, description, triggered, evidence, status: triggered ? 'triggered' : 'clear' };
}

function classifyFinalVerdict(args: {
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  controlRows: readonly ControlRow[];
  siteSupportLedgerSummary: SiteSupportLedgerSummary;
  baselinePreservationSummary: RowSummary<string, string>;
  squareAblationSummary: RowSummary<string, string>;
  squareSubstitutionSummary: SquareSubstitutionSummary;
  hexAblationSummary: RowSummary<string, string>;
  hexSubstitutionSummary: HexSubstitutionSummary;
  exactLoopSiteCompletionSummary: RowSummary<string, string>;
  adjointLoopSiteCompletionSummary: RowSummary<string, string>;
  s4OrbitCoverageSummary: S4OrbitCoverageSummary;
}): T28S5FinalVerdict {
  if (requiredBoundaryMissing(args.boundaryRows) || args.falsifierRows.some((row) => row.triggered)) {
    return 'T28-S-Lab-5-boundary-failed';
  }

  const controlStatus = new Map(args.controlRows.map((row) => [row.controlId, row.status]));
  if (controlStatus.get('C1') !== 'control-pass' || controlStatus.get('C2') !== 'control-pass') return 'T28-S-Lab-5-scalar-collapse-regression-failed';
  if (controlStatus.get('C3') !== 'control-pass') return 'T28-S-Lab-5-square-polarity-gate-failed';
  if (controlStatus.get('C4') !== 'control-pass') return 'T28-S-Lab-5-raw-scale-gate-failed';
  if (args.siteSupportLedgerSummary.status !== 'site-level-standard-support-ledger-ready') return 'T28-S-Lab-5-site-ledger-reconstruction-failed';
  if (args.baselinePreservationSummary.status !== 'site-standard-support-baseline-pass') return 'T28-S-Lab-5-baseline-preservation-failed';
  if (args.squareAblationSummary.status !== 'square-support-ablation-prediction-pass') return 'T28-S-Lab-5-square-ablation-prediction-failed';
  if (args.squareSubstitutionSummary.status !== 'square-substitution-controls-pass') return 'T28-S-Lab-5-square-substitution-control-failed';
  if (args.hexAblationSummary.status !== 'hex-support-ablation-prediction-pass') return 'T28-S-Lab-5-hex-ablation-prediction-failed';
  if (args.hexSubstitutionSummary.status !== 'hex-substitution-controls-pass') return 'T28-S-Lab-5-hex-substitution-control-failed';
  if (args.exactLoopSiteCompletionSummary.status !== 'site-level-exact-loop-support-completion-pass') return 'T28-S-Lab-5-exact-loop-site-completion-failed';
  if (args.adjointLoopSiteCompletionSummary.status !== 'site-level-adjoint-loop-support-completion-pass') return 'T28-S-Lab-5-adjoint-loop-site-completion-failed';
  if (args.s4OrbitCoverageSummary.status !== 'site-support-candidacy-s4-orbit-pass') return 'T28-S-Lab-5-s4-orbit-failed';

  return 'T28-S-Lab-5-site-level-support-candidacy-pass';
}

function buildIntegrityIssues(args: {
  lab4Report: S4Report;
  lab1Report: S1Report;
  lab2Report: S2Report;
  lab3Report: S3Report;
  siteSupportLedgerRows: readonly SiteSupportLedgerRow[];
  siteSupportLedgerSummary: SiteSupportLedgerSummary;
  baselinePreservationRows: readonly BaselinePreservationRow[];
  baselinePreservationSummary: RowSummary<string, string>;
  squareAblationRows: readonly SquareAblationRow[];
  squareAblationSummary: RowSummary<string, string>;
  squareSubstitutionRows: readonly SquareSubstitutionRow[];
  squareSubstitutionSummary: SquareSubstitutionSummary;
  hexAblationRows: readonly HexAblationRow[];
  hexAblationSummary: RowSummary<string, string>;
  hexSubstitutionRows: readonly HexSubstitutionRow[];
  hexSubstitutionSummary: HexSubstitutionSummary;
  exactLoopSiteCompletionSummary: RowSummary<string, string>;
  adjointLoopSiteCompletionSummary: RowSummary<string, string>;
  s4OrbitCoverageSummary: S4OrbitCoverageSummary;
  optionalDestructiveMaskSummary: OptionalDestructiveMaskSummary;
  controlRows: readonly ControlRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  finalVerdict: T28S5FinalVerdict;
}): string[] {
  const issues: string[] = [];
  if (!parentLab4Accepted(args.lab4Report)) issues.push('Lab-4 parent missing/not accepted');
  if (!parentLab1Accepted(args.lab1Report) || !parentLab2Accepted(args.lab2Report) || !parentLab3Accepted(args.lab3Report)) issues.push('Lab-1/Lab-2/Lab-3 context missing/inconsistent');
  if (args.siteSupportLedgerSummary.siteCount !== 6) issues.push('site count not 6');
  if (args.siteSupportLedgerRows.length !== 6) issues.push('site ledger row count not 6');
  if (args.siteSupportLedgerSummary.complementEquivalenceCount !== 6) issues.push('complement equivalence missing/mishandled');
  if (args.baselinePreservationRows.length !== 30) issues.push('baseline row count not 30');
  if (args.baselinePreservationSummary.status !== 'site-standard-support-baseline-pass') issues.push('baseline preservation failed');
  if (args.squareAblationRows.length !== 30) issues.push('square ablation row count not 30');
  if (args.squareAblationSummary.status !== 'square-support-ablation-prediction-pass') issues.push('square ablation prediction failed');
  if (args.squareSubstitutionRows.length !== 24) issues.push('square substitution row count not 24');
  if (args.squareSubstitutionSummary.falseAcceptedCount !== 0) issues.push('square substitution false acceptance');
  if (args.hexAblationRows.length !== 42) issues.push('hex ablation row count not 42');
  if (args.hexAblationSummary.status !== 'hex-support-ablation-prediction-pass') issues.push('hex ablation prediction failed');
  if (args.hexSubstitutionRows.length !== 24) issues.push('hex substitution row count not 24');
  if (args.hexSubstitutionSummary.falseAcceptedCount !== 0) issues.push('hex substitution false acceptance');
  if (args.exactLoopSiteCompletionSummary.status !== 'site-level-exact-loop-support-completion-pass') issues.push('exact loop completion failed');
  if (args.adjointLoopSiteCompletionSummary.status !== 'site-level-adjoint-loop-support-completion-pass') issues.push('adjoint loop completion failed');
  if (args.controlRows.some((row) => row.note.includes('damping') || row.note.includes('attenuation'))) issues.push('adjoint factor mislabeled as damping/attenuation');
  if (args.s4OrbitCoverageSummary.status !== 'site-support-candidacy-s4-orbit-pass') issues.push('S4 orbit coverage failed');
  if (args.controlRows.some((row) => row.status !== 'control-pass')) issues.push('zero/scalar/sector-collapse/polarity/raw-scale/row-order/wrong-site control failed');
  if (args.optionalDestructiveMaskSummary.status === 'destructive-support-mask-falsely-preserved-standard-completion') issues.push('destructive mask, if implemented, falsely reported as support law');
  if (requiredBoundaryMissing(args.boundaryRows)) issues.push('boundary row missing');
  if (
    REQUIRED_FALSIFIER_IDS.some((id) => !args.falsifierRows.some((row) => row.falsifierId === id)) ||
    args.falsifierRows.some((row) => row.triggered)
  ) {
    issues.push('falsifier row missing or triggered');
  }

  const expectedVerdict = classifyFinalVerdict({
    boundaryRows: args.boundaryRows,
    falsifierRows: args.falsifierRows,
    controlRows: args.controlRows,
    siteSupportLedgerSummary: args.siteSupportLedgerSummary,
    baselinePreservationSummary: args.baselinePreservationSummary,
    squareAblationSummary: args.squareAblationSummary,
    squareSubstitutionSummary: args.squareSubstitutionSummary,
    hexAblationSummary: args.hexAblationSummary,
    hexSubstitutionSummary: args.hexSubstitutionSummary,
    exactLoopSiteCompletionSummary: args.exactLoopSiteCompletionSummary,
    adjointLoopSiteCompletionSummary: args.adjointLoopSiteCompletionSummary,
    s4OrbitCoverageSummary: args.s4OrbitCoverageSummary,
  });
  if (expectedVerdict !== args.finalVerdict) issues.push('final verdict inconsistent with precedence');

  return unique(issues);
}

function buildSiteForm(siteId: SiteId, context: OperatorContext): SiteForm {
  const sourcePair = sourcePairForSite(siteId);
  const complementPair = complementPairForSite(siteId);
  const qS = sumVec3(sourcePair.map((label) => context.qByLabel.get(label) ?? zeroVec3()));
  const squareForwardId = squareIdForDirectedPair(context, sourcePair, complementPair);
  const squareReverseId = squareIdForDirectedPair(context, complementPair, sourcePair);
  const squareAntiPair = setSectionValue(
    setSectionValue(buildZeroSquareSection(context), squareForwardId, qS),
    squareReverseId,
    scaleVec3(qS, -1),
  );
  const hexEnvelope = context.hexIds.reduce((section, hexId) => {
    const omittedLabel = hexLabelFromId(hexId);
    const scale = sourcePair.includes(omittedLabel) ? -1 / 3 : 1 / 3;
    return setSectionValue(section, hexId, scaleVec3(qS, scale));
  }, buildZeroHexSection(context));

  return {
    siteId,
    edgeId: edgeIdFromPair(sourcePair),
    sourcePair,
    complementPair,
    qS,
    squareForwardId,
    squareReverseId,
    squareAntiPair,
    hexEnvelope,
    complementSiteId: childIdFromEdge(complementEdge(edgeIdFromPair(sourcePair))),
  };
}

export function edgeIdFromPair(pair: readonly A3Label[]): EdgeId {
  return labelSort(pair).join('') as EdgeId;
}

export function complementEdge(edge: EdgeId): EdgeId {
  return edgeIdFromPair(A3_LABELS.filter((label) => !edge.includes(label)));
}

export function childIdFromEdge(edge: EdgeId): SiteId {
  return `M_${edge}` as SiteId;
}

export function sourcePairForSite(siteId: SiteId): [A3Label, A3Label] {
  return [siteId[2] as A3Label, siteId[3] as A3Label];
}

export function complementPairForSite(siteId: SiteId): [A3Label, A3Label] {
  return labelSort(A3_LABELS.filter((label) => !sourcePairForSite(siteId).includes(label)));
}

export function squareIdForDirectedPair(context: OperatorContext, sourcePair: readonly A3Label[], targetPair: readonly A3Label[]): SquareObjectId {
  const row = context.squarePolarityByDirectedPair.get(directedPairKey(sourcePair, targetPair));
  if (!row) return `missing-square:${sourcePair.join('')}|${targetPair.join('')}`;
  return row.squareObjectId;
}

export function hexIdForOmittedLabel(label: A3Label): HexObjectId {
  return `ve-central-hexagon-omitted:${label}`;
}

export function buildZeroSquareSection(context: OperatorContext): Section {
  return sectionFromValues(context.squareIds, new Map(context.squareIds.map((id) => [id, zeroVec3()])));
}

export function buildZeroHexSection(context: OperatorContext): Section {
  return sectionFromValues(context.hexIds, new Map(context.hexIds.map((id) => [id, zeroVec3()])));
}

export function compareSquareSections(left: Section, right: Section): number {
  return sectionMaxErrorByObjectId(left, right);
}

export function compareHexSections(left: Section, right: Section): number {
  return sectionMaxErrorByObjectId(left, right);
}

export function applyScalarMatrixToVectorSection(matrix: Matrix, input: Section, outputIds: readonly string[]): Section {
  const values = new Map<string, Vec3>();
  outputIds.forEach((outputId, rowIndex) => {
    const vector = input.ids.reduce((sum, inputId, columnIndex) => {
      const coefficient = matrix[rowIndex]?.[columnIndex] ?? 0;
      return addVec3(sum, scaleVec3(input.values.get(inputId) ?? zeroVec3(), coefficient));
    }, zeroVec3());
    values.set(outputId, vector);
  });
  return sectionFromValues(outputIds, values);
}

export function applyD(context: OperatorContext, square: Section): Section {
  return applyScalarMatrixToVectorSection(context.d, square, context.hexIds);
}

export function applyRExact(context: OperatorContext, hex: Section): Section {
  return applyScalarMatrixToVectorSection(context.rExact, hex, context.squareIds);
}

export function applyRAdj(context: OperatorContext, hex: Section): Section {
  return applyScalarMatrixToVectorSection(context.rAdj, hex, context.squareIds);
}

export function applyPQ(context: OperatorContext, square: Section): Section {
  return applyScalarMatrixToVectorSection(context.pQ, square, context.squareIds);
}

export function applyPH(context: OperatorContext, hex: Section): Section {
  return applyScalarMatrixToVectorSection(context.pH, hex, context.hexIds);
}

export function applyJExact(context: OperatorContext, pair: PairSection): PairSection {
  return {
    square: applyRExact(context, pair.hex),
    hex: applyD(context, pair.square),
  };
}

export function applyJAdj(context: OperatorContext, pair: PairSection): PairSection {
  return {
    square: applyRAdj(context, pair.hex),
    hex: applyD(context, pair.square),
  };
}

export function sectionMaxErrorByObjectId(left: Section, right: Section): number {
  const ids = unique([...left.ids, ...right.ids, ...left.values.keys(), ...right.values.keys()]);
  return maxOf(ids.map((id) => maxAbsVec3(subVec3(left.values.get(id) ?? zeroVec3(), right.values.get(id) ?? zeroVec3()))));
}

export function objectOrderInvariantCompare(left: Section, right: Section): number {
  return sectionMaxErrorByObjectId(left, right);
}

function expectedSingleEndpointHexProjection(site: SiteForm, removedEndpoint: A3Label): Section {
  const otherEndpoint = site.sourcePair.find((label) => label !== removedEndpoint) ?? site.sourcePair[0];
  const values = new Map<string, Vec3>();
  for (const label of A3_LABELS) {
    const coefficient = label === removedEndpoint
      ? -1 / 12
      : label === otherEndpoint
        ? -5 / 12
        : 1 / 4;
    values.set(hexIdForOmittedLabel(label), scaleVec3(site.qS, coefficient));
  }
  return sectionFromValues(A3_LABELS.map(hexIdForOmittedLabel), values);
}

function expectedSingleComplementHexProjection(site: SiteForm, removedComplement: A3Label): Section {
  const otherComplement = site.complementPair.find((label) => label !== removedComplement) ?? site.complementPair[0];
  const values = new Map<string, Vec3>();
  for (const label of A3_LABELS) {
    const coefficient = label === removedComplement
      ? 1 / 12
      : label === otherComplement
        ? 5 / 12
        : -1 / 4;
    values.set(hexIdForOmittedLabel(label), scaleVec3(site.qS, coefficient));
  }
  return sectionFromValues(A3_LABELS.map(hexIdForOmittedLabel), values);
}

function removeHexLabels(section: Section, labels: readonly A3Label[]): Section {
  return labels.reduce((current, label) => setSectionValue(current, hexIdForOmittedLabel(label), zeroVec3()), cloneSection(section));
}

function firstNonComplementSite(site: SiteForm, siteForms: readonly SiteForm[]): SiteForm {
  return siteForms.find((candidate) => candidate.siteId !== site.siteId && candidate.siteId !== site.complementSiteId) ?? site;
}

function firstOneLabelOverlapSite(site: SiteForm, siteForms: readonly SiteForm[]): SiteForm {
  return siteForms.find((candidate) =>
    candidate.siteId !== site.siteId &&
    candidate.siteId !== site.complementSiteId &&
    intersectionCount(candidate.sourcePair, site.sourcePair) === 1
  ) ?? firstNonComplementSite(site, siteForms);
}

function siteById(siteForms: readonly SiteForm[], siteId: SiteId): SiteForm {
  return siteForms.find((site) => site.siteId === siteId) ?? siteForms[0];
}

function summarizeRows<Row extends { status: string; maxError: number }, PassStatus extends string, FailStatus extends string>(
  rows: readonly Row[],
  passStatus: PassStatus,
  failStatus: FailStatus,
): RowSummary<PassStatus, FailStatus> {
  const passCount = rows.filter((row) => row.status === passStatus).length;

  return {
    rowCount: rows.length,
    passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: passCount === rows.length ? passStatus : failStatus,
  };
}

function scalarMagnitudeSeedError(context: OperatorContext, site: SiteForm): number {
  const scalar = sectionFromValues(context.squareIds, new Map(context.squareIds.map((id) => {
    const value = site.squareAntiPair.values.get(id) ?? zeroVec3();
    return [id, [normVec3(value), 0, 0] as Vec3];
  })));
  return compareSquareSections(applyPQ(context, scalar), scalar);
}

function objectOrderInvariantMaxError(context: OperatorContext, siteForms: readonly SiteForm[]): number {
  const reversedSquareIds = [...context.squareIds].reverse();
  const reversedHexIds = [...context.hexIds].reverse();
  const reversedContext: OperatorContext = {
    ...context,
    squareIds: reversedSquareIds,
    hexIds: reversedHexIds,
    kappa: reversedHexIds.map((hexId) => reversedSquareIds.map((squareId) => {
      const rowIndex = context.hexIds.indexOf(hexId);
      const columnIndex = context.squareIds.indexOf(squareId);
      return context.kappa[rowIndex][columnIndex];
    })),
  };
  const gH = matrixMultiply(reversedContext.kappa, transpose(reversedContext.kappa));
  const gQ = matrixMultiply(transpose(reversedContext.kappa), reversedContext.kappa);
  reversedContext.d = scaleMatrix(reversedContext.kappa, 1 / 6);
  reversedContext.rExact = scaleMatrix(transpose(reversedContext.kappa), 3 / 4);
  reversedContext.rAdj = scaleMatrix(transpose(reversedContext.kappa), 1 / 6);
  reversedContext.pQ = scaleMatrix(gQ, 1 / 8);
  reversedContext.pH = scaleMatrix(gH, 1 / 8);

  return maxOf(siteForms.map((site) => {
    const square = reorderSection(site.squareAntiPair, reversedSquareIds);
    const hex = reorderSection(site.hexEnvelope, reversedHexIds);
    return Math.max(
      objectOrderInvariantCompare(applyPQ(context, site.squareAntiPair), applyPQ(reversedContext, square)),
      objectOrderInvariantCompare(applyPH(context, site.hexEnvelope), applyPH(reversedContext, hex)),
    );
  }));
}

function sectionFromValues(ids: readonly string[], values: Map<string, Vec3>): Section {
  return { ids: [...ids], values: new Map(values) };
}

function sectionFromRecord(ids: readonly string[], record: Record<string, Vec3>): Section {
  return sectionFromValues(ids, new Map(ids.map((id) => [id, record[id] ?? zeroVec3()])));
}

function cloneSection(section: Section): Section {
  return sectionFromValues(section.ids, section.values);
}

function reorderSection(section: Section, ids: readonly string[]): Section {
  return sectionFromValues(ids, new Map(ids.map((id) => [id, section.values.get(id) ?? zeroVec3()])));
}

function maskSection(section: Section, maskedIds: readonly string[]): Section {
  return maskedIds.reduce((current, id) => setSectionValue(current, id, zeroVec3()), cloneSection(section));
}

function setSectionValue(section: Section, objectId: string, value: Vec3): Section {
  const values = new Map(section.values);
  values.set(objectId, value);
  return sectionFromValues(section.ids, values);
}

function scaleSection(section: Section, scale: number): Section {
  return sectionFromValues(section.ids, new Map(section.ids.map((id) => [id, scaleVec3(section.values.get(id) ?? zeroVec3(), scale)])));
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

function transpose(matrix: Matrix): Matrix {
  return matrix[0].map((_, columnIndex) => matrix.map((row) => row[columnIndex]));
}

function scaleMatrix(matrix: Matrix, scale: number): Matrix {
  return matrix.map((row) => row.map((value) => value * scale));
}

function directedPairKey(sourcePair: readonly A3Label[], targetPair: readonly A3Label[]): string {
  return `${labelSort(sourcePair).join('')}|${labelSort(targetPair).join('')}`;
}

function labelSort(pair: readonly A3Label[]): [A3Label, A3Label] {
  return [...pair].sort((left, right) => A3_LABELS.indexOf(left) - A3_LABELS.indexOf(right)) as [A3Label, A3Label];
}

function hexLabelFromId(hexId: string): A3Label {
  return hexId.slice('ve-central-hexagon-omitted:'.length) as A3Label;
}

function inheritedParentId(parentId: string): ParentEvidenceRow['parentId'] {
  if (parentId === 'p-simplex-vector-order-parameter-diagnostic-v0') return 'p-simplex-vector-order-parameter-diagnostic-v0 inherited';
  if (parentId === 'T28-N0') return 'T28-N0 inherited';
  if (parentId === 'T28-P') return 'T28-P inherited';
  if (parentId === 'T28-Q') return 'T28-Q inherited';
  return 'T28-R context-only-not-authority';
}

function requiredBoundaryMissing(rows: readonly BoundaryRow[]): boolean {
  return REQUIRED_BOUNDARY_IDS.some((id) => !rows.some((row) => row.boundaryId === id && row.enforced));
}

function intersectionCount(left: readonly A3Label[], right: readonly A3Label[]): number {
  return left.filter((label) => right.includes(label)).length;
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

function maxOf(values: readonly number[]): number {
  return values.length === 0 ? 0 : Math.max(...values);
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

import { buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report } from './pSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1';
import { buildPSimplexVectorNativeIncidenceOperatorAuditT28S2Report } from './pSimplexVectorNativeIncidenceOperatorAuditT28S2';
import { buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report } from './pSimplexSignedSquareHexSectorCouplingAuditT28S3';
import { buildPSimplexSectorCoupledLoopStandardProjectorAuditT28S4Report } from './pSimplexSectorCoupledLoopStandardProjectorAuditT28S4';
import { buildPSimplexSiteLevelSupportCandidacyAuditT28S5Report } from './pSimplexSiteLevelSupportCandidacyAuditT28S5';

export type Vec3 = [number, number, number];
export type A3Label = 'A' | 'B' | 'C' | 'D';
export type EdgeId = 'AB' | 'AC' | 'AD' | 'BC' | 'BD' | 'CD';
export type SiteId = 'M_AB' | 'M_AC' | 'M_AD' | 'M_BC' | 'M_BD' | 'M_CD';
export type OutcomeClass =
  | 'full-admission'
  | 'partial-admission'
  | 'rejection'
  | 'redirection'
  | 'support-axis-equivalent-admission'
  | 'blocked-by-polarity'
  | 'blocked-by-raw-scale'
  | 'invalid-scalar-collapse'
  | 'invalid-sector-collapse';

export type InputSupportDomain =
  | 'square'
  | 'hex'
  | 'pair'
  | 'square-authority'
  | 'hex-raw-scale'
  | 'invalid-scalar-fixture'
  | 'invalid-sector-fixture';

type Matrix = number[][];
type S1Report = ReturnType<typeof buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report>;
type S2Report = ReturnType<typeof buildPSimplexVectorNativeIncidenceOperatorAuditT28S2Report>;
type S3Report = ReturnType<typeof buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report>;
type S4Report = ReturnType<typeof buildPSimplexSectorCoupledLoopStandardProjectorAuditT28S4Report>;
type S5Report = ReturnType<typeof buildPSimplexSiteLevelSupportCandidacyAuditT28S5Report>;
type S1SquarePolarityRow = S1Report['squarePolarityRows'][number];
type S1ReadoutRow = S1Report['readoutSectionRows'][number];

interface Section {
  ids: string[];
  values: Map<string, Vec3>;
}

interface SiteForm {
  siteId: SiteId;
  edgeId: EdgeId;
  sourcePair: [A3Label, A3Label];
  complementPair: [A3Label, A3Label];
  qS: Vec3;
  squareForwardId: string;
  squareReverseId: string;
  squareAntiPair: Section;
  hexEnvelope: Section;
  complementSiteId: SiteId;
}

interface OperatorContext {
  squareIds: string[];
  hexIds: string[];
  squareRows: S1ReadoutRow[];
  hexRows: S1ReadoutRow[];
  qByLabel: Map<A3Label, Vec3>;
  squarePolarityByDirectedPair: Map<string, S1SquarePolarityRow>;
  kappa: Matrix;
  d: Matrix;
  rExact: Matrix;
  rAdj: Matrix;
  pQ: Matrix;
  pH: Matrix;
}

interface CorruptedSquareAuthority {
  squareObjectId: string;
  sourceLabelPair: readonly A3Label[] | null;
  targetLabelPair: readonly A3Label[] | null;
  correspondingTetraEdge: EdgeId | null;
}

export interface ParentEvidenceRow {
  parentId: string;
  method: string;
  ok: boolean | null;
  finalVerdict?: string;
  consumedSections: string[];
  parentStatus: 'accepted-parent' | 'rejected-parent' | 'context-only';
}

export type TransferOutput = Record<string, unknown>;

export interface TransferClassifierRow {
  siteId: SiteId;
  inputKind: string;
  inputSupportDomain: InputSupportDomain;
  operatorUsed: string;
  expectedSite: SiteId;
  actualTargetSite: SiteId | 'none' | 'blocked' | 'invalid';
  expectedOutcomeClass: OutcomeClass;
  outcomeClass: OutcomeClass;
  outcomeAssignmentCount: 1 | 0;
  expectedOutput: TransferOutput;
  computedOutput: TransferOutput;
  maxError: number;
  status: 'transfer-outcome-classifier-ready' | 'transfer-outcome-classifier-failed';
  factorLabel?: 'finite-adjoint-loop-factor';
}

export interface TransferAuditSummary<PassStatus extends string, FailStatus extends string> {
  rowCount: number;
  passCount: number;
  failCount: number;
  maxError: number;
  status: PassStatus | FailStatus;
}

export interface RedirectionTransferSummary {
  rowCount: number;
  passCount: number;
  failCount: number;
  wrongSiteFalselyAdmittedCount: number;
  maxError: number;
  status: 'redirection-transfer-pass' | 'redirection-transfer-failed' | 'wrong-site-falsely-admitted';
}

export interface OutcomeConfusionMatrixRow {
  expectedOutcomeClass: OutcomeClass;
  observedOutcomeClass: OutcomeClass;
  caseCount: number;
  offDiagonal: boolean;
  status: 'transfer-outcome-classification-pass' | 'transfer-outcome-classification-confused';
}

export interface OutcomeConfusionSummary {
  outcomeClassCount: number;
  matrixRowCount: number;
  caseCount: number;
  offDiagonalCount: number;
  status: 'transfer-outcome-classification-pass' | 'transfer-outcome-classification-confused';
}

export interface S4OrbitCoverageRow {
  siteId: SiteId;
  testedOutcomeCounts: Record<OutcomeClass, number>;
  passCount: number;
  failCount: number;
  maxError: number;
  status: 'selective-transfer-s4-orbit-pass' | 'selective-transfer-s4-orbit-failed';
}

export interface S4OrbitCoverageSummary {
  siteCount: number;
  orbitPassCount: number;
  orbitFailCount: number;
  maxError: number;
  status: 'selective-transfer-s4-orbit-pass' | 'selective-transfer-s4-orbit-failed';
}

export interface ControlRow {
  controlId: 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8';
  controlName: string;
  expectedObservedClass: OutcomeClass | 'classification-unchanged';
  observedClass: OutcomeClass | 'mixed' | 'classification-unchanged' | 'classification-changed';
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

export interface SiteLedgerReconstructionSummary {
  siteCount: number;
  matchedCount: number;
  maxError: number;
  status: 'lab-5-site-ledger-reconstruction-pass' | 'lab-5-site-ledger-reconstruction-failed';
}

export type T28S6FinalVerdict =
  | 'T28-S-Lab-6-site-level-selective-transfer-gate-precondition-pass'
  | 'T28-S-Lab-6-transfer-classifier-failed'
  | 'T28-S-Lab-6-full-admission-failed'
  | 'T28-S-Lab-6-partial-admission-failed'
  | 'T28-S-Lab-6-rejection-failed'
  | 'T28-S-Lab-6-redirection-failed'
  | 'T28-S-Lab-6-support-axis-equivalence-failed'
  | 'T28-S-Lab-6-polarity-block-failed'
  | 'T28-S-Lab-6-raw-scale-block-failed'
  | 'T28-S-Lab-6-scalar-collapse-invalidity-failed'
  | 'T28-S-Lab-6-sector-collapse-invalidity-failed'
  | 'T28-S-Lab-6-outcome-classification-confused'
  | 'T28-S-Lab-6-s4-orbit-failed'
  | 'T28-S-Lab-6-boundary-failed';

export interface PSimplexSiteLevelSelectiveTransferGatePreconditionAuditT28S6Report {
  method: typeof METHOD;
  experimentName: typeof EXPERIMENT_NAME;
  diagnosticScope: typeof DIAGNOSTIC_SCOPE;
  branchRef: typeof BRANCH_REF;
  baselineRef: typeof BASELINE_REF;
  parentEvidenceRows: ParentEvidenceRow[];
  siteLedgerReconstructionSummary: SiteLedgerReconstructionSummary;
  transferClassifierRows: TransferClassifierRow[];
  transferClassifierSummary: TransferAuditSummary<'transfer-outcome-classifier-ready', 'transfer-outcome-classifier-failed'>;
  fullAdmissionRows: TransferClassifierRow[];
  fullAdmissionSummary: TransferAuditSummary<'full-admission-transfer-pass', 'full-admission-transfer-failed'>;
  partialAdmissionRows: TransferClassifierRow[];
  partialAdmissionSummary: TransferAuditSummary<'partial-admission-transfer-pass', 'partial-admission-transfer-failed'>;
  rejectionRows: TransferClassifierRow[];
  rejectionSummary: TransferAuditSummary<'rejection-transfer-pass', 'rejection-transfer-failed'>;
  redirectionRows: TransferClassifierRow[];
  redirectionSummary: RedirectionTransferSummary;
  supportAxisEquivalentRows: TransferClassifierRow[];
  supportAxisEquivalentSummary: TransferAuditSummary<'support-axis-equivalent-admission-pass', 'support-axis-equivalence-mishandled'>;
  blockedByPolarityRows: TransferClassifierRow[];
  blockedByPolaritySummary: TransferAuditSummary<'blocked-by-polarity-transfer-pass', 'blocked-by-polarity-transfer-failed'>;
  blockedByRawScaleRows: TransferClassifierRow[];
  blockedByRawScaleSummary: TransferAuditSummary<'blocked-by-raw-scale-transfer-pass', 'blocked-by-raw-scale-transfer-failed'>;
  invalidScalarCollapseRows: TransferClassifierRow[];
  invalidScalarCollapseSummary: TransferAuditSummary<'invalid-scalar-collapse-transfer-pass', 'scalar-collapse-falsely-admitted'>;
  invalidSectorCollapseRows: TransferClassifierRow[];
  invalidSectorCollapseSummary: TransferAuditSummary<'invalid-sector-collapse-transfer-pass', 'sector-collapse-falsely-admitted'>;
  outcomeConfusionMatrixRows: OutcomeConfusionMatrixRow[];
  outcomeConfusionSummary: OutcomeConfusionSummary;
  s4OrbitCoverageRows: S4OrbitCoverageRow[];
  s4OrbitCoverageSummary: S4OrbitCoverageSummary;
  controlRows: ControlRow[];
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  finalVerdict: T28S6FinalVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

const METHOD = 'p-simplex-site-level-selective-transfer-gate-precondition-audit-t28s6' as const;
const EXPERIMENT_NAME = 'T28-S-Lab-6 - Site-Level Selective Transfer / Gate-Precondition Audit' as const;
const DIAGNOSTIC_SCOPE = 'site-level-selective-transfer-gate-precondition-audit-only' as const;
const BRANCH_REF = 't28s/site-level-selective-transfer-gate-precondition-audit' as const;
const BASELINE_REF = 'live/arf-t28s-clean' as const;
const EPSILON = 1e-9;
const A3_LABELS: readonly A3Label[] = ['A', 'B', 'C', 'D'];
const SITES: readonly SiteId[] = ['M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];
const OUTCOME_CLASSES: readonly OutcomeClass[] = [
  'full-admission',
  'partial-admission',
  'rejection',
  'redirection',
  'support-axis-equivalent-admission',
  'blocked-by-polarity',
  'blocked-by-raw-scale',
  'invalid-scalar-collapse',
  'invalid-sector-collapse',
];
const REQUIRED_BOUNDARY_IDS = [
  'not-mature-gate',
  'not-field-gate',
  'not-route-gate',
  'not-blockage',
  'not-mature-support',
  'not-field-world-inhabitant',
  'not-route',
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
] as const;

export function buildPSimplexSiteLevelSelectiveTransferGatePreconditionAuditT28S6Report(): PSimplexSiteLevelSelectiveTransferGatePreconditionAuditT28S6Report {
  const lab5Report = buildPSimplexSiteLevelSupportCandidacyAuditT28S5Report();
  const lab1Report = buildPSimplexVectorNativeTwoSectorResidualTensionPreflightT28S1Report();
  const lab2Report = buildPSimplexVectorNativeIncidenceOperatorAuditT28S2Report();
  const lab3Report = buildPSimplexSignedSquareHexSectorCouplingAuditT28S3Report();
  const lab4Report = buildPSimplexSectorCoupledLoopStandardProjectorAuditT28S4Report();
  const context = buildOperatorContext(lab1Report, lab3Report);
  const parentEvidenceRows = buildParentEvidenceRows(lab5Report, lab1Report, lab2Report, lab3Report, lab4Report);
  const siteForms = SITES.map((siteId) => buildSiteForm(siteId, context));
  const siteLedgerReconstructionSummary = buildSiteLedgerReconstructionSummary(lab5Report, siteForms);

  const fullAdmissionRows = buildFullAdmissionRows(siteForms, context);
  const partialAdmissionRows = buildPartialAdmissionRows(siteForms, context);
  const rejectionRows = buildRejectionRows(siteForms, context);
  const redirectionRows = buildRedirectionRows(siteForms, context);
  const supportAxisEquivalentRows = buildSupportAxisEquivalentRows(siteForms, context);
  const blockedByPolarityRows = buildBlockedByPolarityRows(siteForms);
  const blockedByRawScaleRows = buildBlockedByRawScaleRows(siteForms, context);
  const invalidScalarCollapseRows = buildInvalidScalarCollapseRows(siteForms, context);
  const invalidSectorCollapseRows = buildInvalidSectorCollapseRows(siteForms);
  const transferClassifierRows = [
    ...fullAdmissionRows,
    ...partialAdmissionRows,
    ...rejectionRows,
    ...redirectionRows,
    ...supportAxisEquivalentRows,
    ...blockedByPolarityRows,
    ...blockedByRawScaleRows,
    ...invalidScalarCollapseRows,
    ...invalidSectorCollapseRows,
  ];

  const transferClassifierSummary = summarizeClassifierRows(transferClassifierRows);
  const fullAdmissionSummary = summarizeRows(fullAdmissionRows, 'full-admission-transfer-pass', 'full-admission-transfer-failed');
  const partialAdmissionSummary = summarizeRows(partialAdmissionRows, 'partial-admission-transfer-pass', 'partial-admission-transfer-failed');
  const rejectionSummary = summarizeRows(rejectionRows, 'rejection-transfer-pass', 'rejection-transfer-failed');
  const redirectionSummary = buildRedirectionSummary(redirectionRows);
  const supportAxisEquivalentSummary = summarizeRows(supportAxisEquivalentRows, 'support-axis-equivalent-admission-pass', 'support-axis-equivalence-mishandled');
  const blockedByPolaritySummary = summarizeRows(blockedByPolarityRows, 'blocked-by-polarity-transfer-pass', 'blocked-by-polarity-transfer-failed');
  const blockedByRawScaleSummary = summarizeRows(blockedByRawScaleRows, 'blocked-by-raw-scale-transfer-pass', 'blocked-by-raw-scale-transfer-failed');
  const invalidScalarCollapseSummary = summarizeRows(invalidScalarCollapseRows, 'invalid-scalar-collapse-transfer-pass', 'scalar-collapse-falsely-admitted');
  const invalidSectorCollapseSummary = summarizeRows(invalidSectorCollapseRows, 'invalid-sector-collapse-transfer-pass', 'sector-collapse-falsely-admitted');
  const outcomeConfusionMatrixRows = buildOutcomeConfusionMatrixRows(transferClassifierRows);
  const outcomeConfusionSummary = buildOutcomeConfusionSummary(outcomeConfusionMatrixRows);
  const s4OrbitCoverageRows = buildS4OrbitCoverageRows(transferClassifierRows);
  const s4OrbitCoverageSummary = buildS4OrbitCoverageSummary(s4OrbitCoverageRows);
  const rowOrderMaxError = rowOrderShuffleMaxError(context, siteForms);
  const controlRows = buildControlRows({
    transferClassifierRows,
    rejectionRows,
    invalidScalarCollapseRows,
    invalidSectorCollapseRows,
    blockedByPolarityRows,
    blockedByRawScaleRows,
    redirectionRows,
    supportAxisEquivalentRows,
    rowOrderMaxError,
  });
  const boundaryRows = buildBoundaryRows();
  const falsifierRows = buildFalsifierRows({
    lab5Report,
    siteLedgerReconstructionSummary,
    transferClassifierSummary,
    fullAdmissionSummary,
    partialAdmissionSummary,
    rejectionSummary,
    redirectionSummary,
    supportAxisEquivalentSummary,
    blockedByPolaritySummary,
    blockedByRawScaleSummary,
    invalidScalarCollapseSummary,
    invalidSectorCollapseSummary,
    outcomeConfusionSummary,
    s4OrbitCoverageSummary,
    controlRows,
  });
  const finalVerdict = classifyFinalVerdict({
    lab5Report,
    siteLedgerReconstructionSummary,
    transferClassifierSummary,
    fullAdmissionSummary,
    partialAdmissionSummary,
    rejectionSummary,
    redirectionSummary,
    supportAxisEquivalentSummary,
    blockedByPolaritySummary,
    blockedByRawScaleSummary,
    invalidScalarCollapseSummary,
    invalidSectorCollapseSummary,
    outcomeConfusionSummary,
    s4OrbitCoverageSummary,
    boundaryRows,
    falsifierRows,
  });
  const integrityIssues = buildIntegrityIssues({
    lab5Report,
    siteLedgerReconstructionSummary,
    transferClassifierRows,
    transferClassifierSummary,
    fullAdmissionRows,
    fullAdmissionSummary,
    partialAdmissionRows,
    partialAdmissionSummary,
    rejectionRows,
    rejectionSummary,
    redirectionRows,
    redirectionSummary,
    supportAxisEquivalentRows,
    supportAxisEquivalentSummary,
    blockedByPolarityRows,
    blockedByPolaritySummary,
    blockedByRawScaleRows,
    blockedByRawScaleSummary,
    invalidScalarCollapseRows,
    invalidScalarCollapseSummary,
    invalidSectorCollapseRows,
    invalidSectorCollapseSummary,
    outcomeConfusionMatrixRows,
    outcomeConfusionSummary,
    s4OrbitCoverageRows,
    s4OrbitCoverageSummary,
    controlRows,
    boundaryRows,
    falsifierRows,
    finalVerdict,
  });
  const ok =
    integrityIssues.length === 0 &&
    falsifierRows.every((row) => !row.triggered) &&
    finalVerdict === 'T28-S-Lab-6-site-level-selective-transfer-gate-precondition-pass';

  return {
    method: METHOD,
    experimentName: EXPERIMENT_NAME,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    baselineRef: BASELINE_REF,
    parentEvidenceRows,
    siteLedgerReconstructionSummary,
    transferClassifierRows,
    transferClassifierSummary,
    fullAdmissionRows,
    fullAdmissionSummary,
    partialAdmissionRows,
    partialAdmissionSummary,
    rejectionRows,
    rejectionSummary,
    redirectionRows,
    redirectionSummary,
    supportAxisEquivalentRows,
    supportAxisEquivalentSummary,
    blockedByPolarityRows,
    blockedByPolaritySummary,
    blockedByRawScaleRows,
    blockedByRawScaleSummary,
    invalidScalarCollapseRows,
    invalidScalarCollapseSummary,
    invalidSectorCollapseRows,
    invalidSectorCollapseSummary,
    outcomeConfusionMatrixRows,
    outcomeConfusionSummary,
    s4OrbitCoverageRows,
    s4OrbitCoverageSummary,
    controlRows,
    boundaryRows,
    falsifierRows,
    finalVerdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok,
  };
}

function buildFullAdmissionRows(siteForms: readonly SiteForm[], context: OperatorContext): TransferClassifierRow[] {
  return siteForms.flatMap((site) => {
    const computedD = applyD(context, site.squareAntiPair);
    const computedExact = applyRExact(context, site.hexEnvelope);
    const computedAdjoint = applyRAdj(context, site.hexEnvelope);
    const expectedAdjoint = scaleSection(site.squareAntiPair, 2 / 9);

    return [
      transferRow({
        site,
        inputKind: 'square-to-hex-full-admission',
        inputSupportDomain: 'square',
        operatorUsed: 'D',
        actualTargetSite: site.siteId,
        expectedOutcomeClass: 'full-admission',
        outcomeClass: 'full-admission',
        expectedOutput: { hexSection: sectionToRecord(site.hexEnvelope) },
        computedOutput: { hexSection: sectionToRecord(computedD) },
        maxError: compareHexSections(computedD, site.hexEnvelope),
      }),
      transferRow({
        site,
        inputKind: 'hex-to-square-exact-full-admission',
        inputSupportDomain: 'hex',
        operatorUsed: 'R_exact',
        actualTargetSite: site.siteId,
        expectedOutcomeClass: 'full-admission',
        outcomeClass: 'full-admission',
        expectedOutput: { squareSection: sectionToRecord(site.squareAntiPair) },
        computedOutput: { squareSection: sectionToRecord(computedExact) },
        maxError: compareSquareSections(computedExact, site.squareAntiPair),
      }),
      transferRow({
        site,
        inputKind: 'hex-to-square-adjoint-finite-response-admission',
        inputSupportDomain: 'hex',
        operatorUsed: 'R_adj',
        actualTargetSite: site.siteId,
        expectedOutcomeClass: 'full-admission',
        outcomeClass: 'full-admission',
        expectedOutput: { squareSection: sectionToRecord(expectedAdjoint), factor: 2 / 9 },
        computedOutput: { squareSection: sectionToRecord(computedAdjoint), factorLabel: 'finite-adjoint-loop-factor' },
        maxError: compareSquareSections(computedAdjoint, expectedAdjoint),
        factorLabel: 'finite-adjoint-loop-factor',
      }),
    ];
  });
}

function buildPartialAdmissionRows(siteForms: readonly SiteForm[], context: OperatorContext): TransferClassifierRow[] {
  return siteForms.flatMap((site) => {
    const zeroSquare = buildZeroSquareSection(context);
    const singleForward = setSectionValue(zeroSquare, site.squareForwardId, site.qS);
    const singleReverse = setSectionValue(zeroSquare, site.squareReverseId, scaleVec3(site.qS, -1));
    const removeForward = setSectionValue(cloneSection(site.squareAntiPair), site.squareForwardId, zeroVec3());
    const removeReverse = setSectionValue(cloneSection(site.squareAntiPair), site.squareReverseId, zeroVec3());
    const halfSquare = scaleSection(site.squareAntiPair, 1 / 2);
    const halfHex = scaleSection(site.hexEnvelope, 1 / 2);
    const ninthSquare = scaleSection(site.squareAntiPair, 1 / 9);
    const endpointPairInput = removeHexLabels(site.hexEnvelope, site.sourcePair);
    const complementPairInput = removeHexLabels(site.hexEnvelope, site.complementPair);

    return [
      squarePartialAdmissionRow(site, context, 'single-forward-square-seed', singleForward, halfSquare, halfHex, halfSquare, ninthSquare),
      squarePartialAdmissionRow(site, context, 'single-reverse-square-seed', singleReverse, halfSquare, halfHex, halfSquare, ninthSquare),
      squarePartialAdmissionRow(site, context, 'remove-forward-from-anti-pair', removeForward, halfSquare, halfHex, halfSquare, ninthSquare),
      squarePartialAdmissionRow(site, context, 'remove-reverse-from-anti-pair', removeReverse, halfSquare, halfHex, halfSquare, ninthSquare),
      hexPartialAdmissionRow(site, context, 'remove-endpoint-pair-hex-ablation', endpointPairInput, halfHex, halfSquare, ninthSquare),
      hexPartialAdmissionRow(site, context, 'remove-complement-pair-hex-ablation', complementPairInput, halfHex, halfSquare, ninthSquare),
    ];
  });
}

function squarePartialAdmissionRow(
  site: SiteForm,
  context: OperatorContext,
  inputKind: string,
  input: Section,
  expectedProjectedSquare: Section,
  expectedHexDrive: Section,
  expectedExactReturn: Section,
  expectedAdjointReturn: Section,
): TransferClassifierRow {
  const projectedSquare = applyPQ(context, input);
  const hexDrive = applyD(context, input);
  const exactReturn = applyRExact(context, hexDrive);
  const adjointReturn = applyRAdj(context, hexDrive);
  const maxError = Math.max(
    compareSquareSections(projectedSquare, expectedProjectedSquare),
    compareHexSections(hexDrive, expectedHexDrive),
    compareSquareSections(exactReturn, expectedExactReturn),
    compareSquareSections(adjointReturn, expectedAdjointReturn),
  );

  return transferRow({
    site,
    inputKind,
    inputSupportDomain: 'square',
    operatorUsed: 'P_Q+D+R_exact(D)+R_adj(D)',
    actualTargetSite: site.siteId,
    expectedOutcomeClass: 'partial-admission',
    outcomeClass: 'partial-admission',
    expectedOutput: {
      projectedSquareSection: sectionToRecord(expectedProjectedSquare),
      hexDriveSection: sectionToRecord(expectedHexDrive),
      exactSquareReturn: sectionToRecord(expectedExactReturn),
      adjointSquareReturn: sectionToRecord(expectedAdjointReturn),
      exactFactor: 1 / 2,
      adjointFactor: 1 / 9,
    },
    computedOutput: {
      projectedSquareSection: sectionToRecord(projectedSquare),
      hexDriveSection: sectionToRecord(hexDrive),
      exactSquareReturn: sectionToRecord(exactReturn),
      adjointSquareReturn: sectionToRecord(adjointReturn),
    },
    maxError,
  });
}

function hexPartialAdmissionRow(
  site: SiteForm,
  context: OperatorContext,
  inputKind: string,
  input: Section,
  expectedProjectedHex: Section,
  expectedExactReturn: Section,
  expectedAdjointReturn: Section,
): TransferClassifierRow {
  const projectedHex = applyPH(context, input);
  const exactReturn = applyRExact(context, input);
  const adjointReturn = applyRAdj(context, input);
  const maxError = Math.max(
    compareHexSections(projectedHex, expectedProjectedHex),
    compareSquareSections(exactReturn, expectedExactReturn),
    compareSquareSections(adjointReturn, expectedAdjointReturn),
  );

  return transferRow({
    site,
    inputKind,
    inputSupportDomain: 'hex',
    operatorUsed: 'P_H+R_exact+R_adj',
    actualTargetSite: site.siteId,
    expectedOutcomeClass: 'partial-admission',
    outcomeClass: 'partial-admission',
    expectedOutput: {
      projectedHexSection: sectionToRecord(expectedProjectedHex),
      exactSquareReturn: sectionToRecord(expectedExactReturn),
      adjointSquareReturn: sectionToRecord(expectedAdjointReturn),
      exactFactor: 1 / 2,
      adjointFactor: 1 / 9,
    },
    computedOutput: {
      projectedHexSection: sectionToRecord(projectedHex),
      exactSquareReturn: sectionToRecord(exactReturn),
      adjointSquareReturn: sectionToRecord(adjointReturn),
    },
    maxError,
  });
}

function buildRejectionRows(siteForms: readonly SiteForm[], context: OperatorContext): TransferClassifierRow[] {
  return siteForms.flatMap((site) => {
    const symmetricSquare = setSectionValue(
      setSectionValue(buildZeroSquareSection(context), site.squareForwardId, site.qS),
      site.squareReverseId,
      site.qS,
    );
    const uniformHex = sectionFromValues(context.hexIds, new Map(context.hexIds.map((hexId) => [hexId, site.qS])));
    const zeroSquare = buildZeroSquareSection(context);
    const zeroHex = buildZeroHexSection(context);
    const symmetricProjected = applyPQ(context, symmetricSquare);
    const symmetricDrive = applyD(context, symmetricSquare);
    const uniformProjected = applyPH(context, uniformHex);
    const uniformExact = applyRExact(context, uniformHex);
    const uniformAdjoint = applyRAdj(context, uniformHex);
    const zeroProjectedSquare = applyPQ(context, zeroSquare);
    const zeroProjectedHex = applyPH(context, zeroHex);
    const zeroDrive = applyD(context, zeroSquare);
    const zeroExact = applyRExact(context, zeroHex);
    const zeroAdjoint = applyRAdj(context, zeroHex);

    return [
      transferRow({
        site,
        inputKind: 'symmetric-square-pair-rejection',
        inputSupportDomain: 'square',
        operatorUsed: 'P_Q+D',
        actualTargetSite: 'none',
        expectedOutcomeClass: 'rejection',
        outcomeClass: 'rejection',
        expectedOutput: { projectedSquareSection: sectionToRecord(zeroSquare), hexDriveSection: sectionToRecord(zeroHex) },
        computedOutput: { projectedSquareSection: sectionToRecord(symmetricProjected), hexDriveSection: sectionToRecord(symmetricDrive) },
        maxError: Math.max(compareSquareSections(symmetricProjected, zeroSquare), compareHexSections(symmetricDrive, zeroHex)),
      }),
      transferRow({
        site,
        inputKind: 'uniform-hex-mode-rejection',
        inputSupportDomain: 'hex',
        operatorUsed: 'P_H+R_exact+R_adj',
        actualTargetSite: 'none',
        expectedOutcomeClass: 'rejection',
        outcomeClass: 'rejection',
        expectedOutput: {
          projectedHexSection: sectionToRecord(zeroHex),
          exactSquareReturn: sectionToRecord(zeroSquare),
          adjointSquareReturn: sectionToRecord(zeroSquare),
        },
        computedOutput: {
          projectedHexSection: sectionToRecord(uniformProjected),
          exactSquareReturn: sectionToRecord(uniformExact),
          adjointSquareReturn: sectionToRecord(uniformAdjoint),
        },
        maxError: Math.max(
          compareHexSections(uniformProjected, zeroHex),
          compareSquareSections(uniformExact, zeroSquare),
          compareSquareSections(uniformAdjoint, zeroSquare),
        ),
      }),
      transferRow({
        site,
        inputKind: 'zero-input-rejection-control',
        inputSupportDomain: 'pair',
        operatorUsed: 'P_Q+P_H+D+R_exact+R_adj',
        actualTargetSite: 'none',
        expectedOutcomeClass: 'rejection',
        outcomeClass: 'rejection',
        expectedOutput: {
          projectedSquareSection: sectionToRecord(zeroSquare),
          projectedHexSection: sectionToRecord(zeroHex),
          hexDriveSection: sectionToRecord(zeroHex),
          exactSquareReturn: sectionToRecord(zeroSquare),
          adjointSquareReturn: sectionToRecord(zeroSquare),
        },
        computedOutput: {
          projectedSquareSection: sectionToRecord(zeroProjectedSquare),
          projectedHexSection: sectionToRecord(zeroProjectedHex),
          hexDriveSection: sectionToRecord(zeroDrive),
          exactSquareReturn: sectionToRecord(zeroExact),
          adjointSquareReturn: sectionToRecord(zeroAdjoint),
        },
        maxError: Math.max(
          compareSquareSections(zeroProjectedSquare, zeroSquare),
          compareHexSections(zeroProjectedHex, zeroHex),
          compareHexSections(zeroDrive, zeroHex),
          compareSquareSections(zeroExact, zeroSquare),
          compareSquareSections(zeroAdjoint, zeroSquare),
        ),
      }),
    ];
  });
}

function buildRedirectionRows(siteForms: readonly SiteForm[], context: OperatorContext): TransferClassifierRow[] {
  return siteForms.flatMap((site) => {
    const wrongSite = firstNonComplementSite(site, siteForms);
    const wrongProjectedSquare = applyPQ(context, wrongSite.squareAntiPair);
    const wrongHexDrive = applyD(context, wrongSite.squareAntiPair);
    const wrongProjectedHex = applyPH(context, wrongSite.hexEnvelope);
    const wrongExact = applyRExact(context, wrongSite.hexEnvelope);
    const squareAcceptedForTestedSite = compareSquareSections(wrongProjectedSquare, site.squareAntiPair) <= EPSILON;
    const hexAcceptedForTestedSite = compareHexSections(wrongProjectedHex, site.hexEnvelope) <= EPSILON;
    const squareMaxError = Math.max(
      compareSquareSections(wrongProjectedSquare, wrongSite.squareAntiPair),
      compareHexSections(wrongHexDrive, wrongSite.hexEnvelope),
    );
    const hexMaxError = Math.max(
      compareHexSections(wrongProjectedHex, wrongSite.hexEnvelope),
      compareSquareSections(wrongExact, wrongSite.squareAntiPair),
    );

    return [
      transferRow({
        site,
        inputKind: 'wrong-non-complement-square-anti-pair',
        inputSupportDomain: 'square',
        operatorUsed: 'P_Q+D',
        actualTargetSite: wrongSite.siteId,
        expectedOutcomeClass: 'redirection',
        outcomeClass: squareAcceptedForTestedSite ? 'full-admission' : 'redirection',
        expectedOutput: {
          actualTargetSite: wrongSite.siteId,
          projectedSquareSection: sectionToRecord(wrongSite.squareAntiPair),
          hexDriveSection: sectionToRecord(wrongSite.hexEnvelope),
        },
        computedOutput: {
          projectedSquareSection: sectionToRecord(wrongProjectedSquare),
          hexDriveSection: sectionToRecord(wrongHexDrive),
          acceptedForTestedSite: squareAcceptedForTestedSite,
        },
        maxError: squareMaxError,
      }),
      transferRow({
        site,
        inputKind: 'wrong-non-complement-hex-envelope',
        inputSupportDomain: 'hex',
        operatorUsed: 'P_H+R_exact',
        actualTargetSite: wrongSite.siteId,
        expectedOutcomeClass: 'redirection',
        outcomeClass: hexAcceptedForTestedSite ? 'full-admission' : 'redirection',
        expectedOutput: {
          actualTargetSite: wrongSite.siteId,
          projectedHexSection: sectionToRecord(wrongSite.hexEnvelope),
          exactSquareReturn: sectionToRecord(wrongSite.squareAntiPair),
        },
        computedOutput: {
          projectedHexSection: sectionToRecord(wrongProjectedHex),
          exactSquareReturn: sectionToRecord(wrongExact),
          acceptedForTestedSite: hexAcceptedForTestedSite,
        },
        maxError: hexMaxError,
      }),
    ];
  });
}

function buildSupportAxisEquivalentRows(siteForms: readonly SiteForm[], context: OperatorContext): TransferClassifierRow[] {
  const bySiteId = new Map(siteForms.map((site) => [site.siteId, site]));

  return siteForms.flatMap((site) => {
    const complement = bySiteId.get(site.complementSiteId) ?? site;
    const complementSquareProjected = applyPQ(context, complement.squareAntiPair);
    const complementHexDrive = applyD(context, complement.squareAntiPair);
    const complementHexProjected = applyPH(context, complement.hexEnvelope);
    const complementExact = applyRExact(context, complement.hexEnvelope);
    const squareMaxError = Math.max(
      compareSquareSections(complement.squareAntiPair, site.squareAntiPair),
      compareHexSections(complementHexDrive, site.hexEnvelope),
      compareSquareSections(complementSquareProjected, site.squareAntiPair),
    );
    const hexMaxError = Math.max(
      compareHexSections(complement.hexEnvelope, site.hexEnvelope),
      compareHexSections(complementHexProjected, site.hexEnvelope),
      compareSquareSections(complementExact, site.squareAntiPair),
    );

    return [
      transferRow({
        site,
        inputKind: 'complement-site-square-axis-equivalent',
        inputSupportDomain: 'square',
        operatorUsed: 'P_Q+D',
        actualTargetSite: site.siteId,
        expectedOutcomeClass: 'support-axis-equivalent-admission',
        outcomeClass: squareMaxError <= EPSILON ? 'support-axis-equivalent-admission' : 'redirection',
        expectedOutput: {
          equivalentSiteId: complement.siteId,
          projectedSquareSection: sectionToRecord(site.squareAntiPair),
          hexDriveSection: sectionToRecord(site.hexEnvelope),
        },
        computedOutput: {
          projectedSquareSection: sectionToRecord(complementSquareProjected),
          hexDriveSection: sectionToRecord(complementHexDrive),
        },
        maxError: squareMaxError,
      }),
      transferRow({
        site,
        inputKind: 'complement-site-hex-axis-equivalent',
        inputSupportDomain: 'hex',
        operatorUsed: 'P_H+R_exact',
        actualTargetSite: site.siteId,
        expectedOutcomeClass: 'support-axis-equivalent-admission',
        outcomeClass: hexMaxError <= EPSILON ? 'support-axis-equivalent-admission' : 'redirection',
        expectedOutput: {
          equivalentSiteId: complement.siteId,
          projectedHexSection: sectionToRecord(site.hexEnvelope),
          exactSquareReturn: sectionToRecord(site.squareAntiPair),
        },
        computedOutput: {
          projectedHexSection: sectionToRecord(complementHexProjected),
          exactSquareReturn: sectionToRecord(complementExact),
        },
        maxError: hexMaxError,
      }),
    ];
  });
}

function buildBlockedByPolarityRows(siteForms: readonly SiteForm[]): TransferClassifierRow[] {
  return siteForms.map((site) => {
    const corruptedForward: CorruptedSquareAuthority = {
      squareObjectId: site.squareForwardId,
      sourceLabelPair: null,
      targetLabelPair: null,
      correspondingTetraEdge: null,
    };
    const corruptedReverse: CorruptedSquareAuthority = {
      squareObjectId: site.squareReverseId,
      sourceLabelPair: null,
      targetLabelPair: null,
      correspondingTetraEdge: null,
    };
    const authorized = authorizeSiteSquareSupportFromAuthority(site, corruptedForward, corruptedReverse);

    return transferRow({
      site,
      inputKind: 'corrupted-square-polarity-authority',
      inputSupportDomain: 'square-authority',
      operatorUsed: 'D/signed-square-authority',
      actualTargetSite: authorized ? site.siteId : 'blocked',
      expectedOutcomeClass: 'blocked-by-polarity',
      outcomeClass: authorized ? 'full-admission' : 'blocked-by-polarity',
      expectedOutput: { authorized: false, missingAuthorityFields: ['sourceLabelPair', 'targetLabelPair', 'correspondingTetraEdge'] },
      computedOutput: { authorized, forwardAuthority: corruptedForward, reverseAuthority: corruptedReverse },
      maxError: authorized ? 1 : 0,
    });
  });
}

function buildBlockedByRawScaleRows(siteForms: readonly SiteForm[], context: OperatorContext): TransferClassifierRow[] {
  return siteForms.map((site) => {
    const corruptedEnvelope = scaleSection(site.hexEnvelope, 3 / 2);
    const exactReturn = applyRExact(context, corruptedEnvelope);
    const adjointReturn = applyRAdj(context, corruptedEnvelope);
    const expectedAdjoint = scaleSection(site.squareAntiPair, 2 / 9);
    const rawEnvelopeError = compareHexSections(corruptedEnvelope, site.hexEnvelope);
    const exactReturnError = compareSquareSections(exactReturn, site.squareAntiPair);
    const adjointReturnError = compareSquareSections(adjointReturn, expectedAdjoint);
    const maxError = Math.max(rawEnvelopeError, exactReturnError, adjointReturnError);
    const blocked = rawEnvelopeError > EPSILON && exactReturnError > EPSILON && adjointReturnError > EPSILON;

    return transferRow({
      site,
      inputKind: 'raw-hex-scale-corruption-three-halves',
      inputSupportDomain: 'hex-raw-scale',
      operatorUsed: 'raw-scale-preserving-hex-transfer-check',
      actualTargetSite: blocked ? 'blocked' : site.siteId,
      expectedOutcomeClass: 'blocked-by-raw-scale',
      outcomeClass: blocked ? 'blocked-by-raw-scale' : 'full-admission',
      expectedOutput: {
        rawHexSection: sectionToRecord(site.hexEnvelope),
        exactSquareReturn: sectionToRecord(site.squareAntiPair),
        adjointSquareReturn: sectionToRecord(expectedAdjoint),
      },
      computedOutput: {
        corruptedHexSection: sectionToRecord(corruptedEnvelope),
        exactSquareReturn: sectionToRecord(exactReturn),
        adjointSquareReturn: sectionToRecord(adjointReturn),
        rawEnvelopeError: cleanNumber(rawEnvelopeError),
        exactReturnError: cleanNumber(exactReturnError),
        adjointReturnError: cleanNumber(adjointReturnError),
      },
      maxError,
    });
  });
}

function buildInvalidScalarCollapseRows(siteForms: readonly SiteForm[], context: OperatorContext): TransferClassifierRow[] {
  return siteForms.flatMap((site) => {
    const qSNorm = normVec3(site.qS);
    const qNormByLabel = Object.fromEntries(A3_LABELS.map((label) => [label, cleanNumber(normVec3(context.qByLabel.get(label) ?? zeroVec3()))]));

    return [
      invalidFixtureRow(site, 'scalar-magnitude-square-forward', 'invalid-scalar-fixture', 'invalid-scalar-collapse', {
        fixtureKind: 'square-forward-magnitude',
        squareObjectId: site.squareForwardId,
        scalarValue: cleanNumber(qSNorm),
      }),
      invalidFixtureRow(site, 'scalar-magnitude-hex-labels', 'invalid-scalar-fixture', 'invalid-scalar-collapse', {
        fixtureKind: 'hex-label-magnitudes',
        qNormByLabel,
      }),
      invalidFixtureRow(site, 'equal-scalar-square-weights', 'invalid-scalar-fixture', 'invalid-scalar-collapse', {
        fixtureKind: 'all-square-values-equal-scalar',
        scalarValue: 1,
        squareIds: context.squareIds,
      }),
      invalidFixtureRow(site, 'equal-scalar-hex-weights', 'invalid-scalar-fixture', 'invalid-scalar-collapse', {
        fixtureKind: 'all-hex-values-equal-scalar',
        scalarValue: 1,
        hexIds: context.hexIds,
      }),
    ];
  });
}

function buildInvalidSectorCollapseRows(siteForms: readonly SiteForm[]): TransferClassifierRow[] {
  return siteForms.flatMap((site) => [
    invalidFixtureRow(site, 'untyped-square-hex-section-collapse', 'invalid-sector-fixture', 'invalid-sector-collapse', {
      fixtureKind: 'single-untyped-section-for-square-contrast-and-hex-common-values',
      siteId: site.siteId,
    }),
    invalidFixtureRow(site, 'sector-minus-plus-sector-plus-sum-collapse', 'invalid-sector-fixture', 'invalid-sector-collapse', {
      fixtureKind: 'sectorMinus-plus-sectorPlus-without-declared-law',
      siteId: site.siteId,
    }),
  ]);
}

function invalidFixtureRow(
  site: SiteForm,
  inputKind: string,
  inputSupportDomain: 'invalid-scalar-fixture' | 'invalid-sector-fixture',
  outcomeClass: 'invalid-scalar-collapse' | 'invalid-sector-collapse',
  fixture: TransferOutput,
): TransferClassifierRow {
  return transferRow({
    site,
    inputKind,
    inputSupportDomain,
    operatorUsed: 'typed-invalid-fixture',
    actualTargetSite: 'invalid',
    expectedOutcomeClass: outcomeClass,
    outcomeClass,
    expectedOutput: { invalidFixtureRejected: true, outcomeClass },
    computedOutput: { invalidFixtureRejected: true, fixture },
    maxError: 0,
  });
}

function transferRow(args: {
  site: SiteForm;
  inputKind: string;
  inputSupportDomain: InputSupportDomain;
  operatorUsed: string;
  actualTargetSite: TransferClassifierRow['actualTargetSite'];
  expectedOutcomeClass: OutcomeClass;
  outcomeClass: OutcomeClass;
  expectedOutput: TransferOutput;
  computedOutput: TransferOutput;
  maxError: number;
  factorLabel?: 'finite-adjoint-loop-factor';
}): TransferClassifierRow {
  const outcomeAssignmentCount = OUTCOME_CLASSES.includes(args.outcomeClass) ? 1 : 0;
  const status =
    outcomeAssignmentCount === 1 &&
    args.outcomeClass === args.expectedOutcomeClass &&
    (args.maxError <= EPSILON ||
      args.expectedOutcomeClass === 'blocked-by-raw-scale')
      ? 'transfer-outcome-classifier-ready'
      : 'transfer-outcome-classifier-failed';

  return {
    siteId: args.site.siteId,
    inputKind: args.inputKind,
    inputSupportDomain: args.inputSupportDomain,
    operatorUsed: args.operatorUsed,
    expectedSite: args.site.siteId,
    actualTargetSite: args.actualTargetSite,
    expectedOutcomeClass: args.expectedOutcomeClass,
    outcomeClass: args.outcomeClass,
    outcomeAssignmentCount,
    expectedOutput: args.expectedOutput,
    computedOutput: args.computedOutput,
    maxError: cleanNumber(args.maxError),
    status,
    factorLabel: args.factorLabel,
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
    qByLabel,
    squarePolarityByDirectedPair,
    kappa,
    d: scaleMatrix(kappa, 1 / 6),
    rExact: scaleMatrix(transpose(kappa), 3 / 4),
    rAdj: scaleMatrix(transpose(kappa), 1 / 6),
    pQ: scaleMatrix(gQ, 1 / 8),
    pH: scaleMatrix(gH, 1 / 8),
  };
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

function buildParentEvidenceRows(
  lab5Report: S5Report,
  lab1Report: S1Report,
  lab2Report: S2Report,
  lab3Report: S3Report,
  lab4Report: S4Report,
): ParentEvidenceRow[] {
  return [
    {
      parentId: 'T28-S-Lab-5',
      method: lab5Report.method,
      ok: lab5Report.ok,
      finalVerdict: lab5Report.finalVerdict,
      consumedSections: [
        'siteSupportLedgerRows',
        'baselinePreservationRows',
        'squareAblationRows',
        'squareSubstitutionRows',
        'hexAblationRows',
        'hexSubstitutionRows',
        'exactLoopSiteCompletionRows',
        'adjointLoopSiteCompletionRows',
        's4OrbitCoverageRows',
        'controlRows',
        'boundaryRows',
        'falsifierRows',
        'finalVerdict',
        'ok',
        'integrityIssueCount',
      ],
      parentStatus: parentLab5Accepted(lab5Report) ? 'accepted-parent' : 'rejected-parent',
    },
    {
      parentId: 'T28-S-Lab-1',
      method: lab1Report.method,
      ok: lab1Report.ok,
      finalVerdict: lab1Report.finalVerdict,
      consumedSections: ['readoutSectionRows', 'squarePolarityRows', 's4ActionRows', 'rawScaleSummary', 'finalVerdict', 'ok'],
      parentStatus: parentLab1Accepted(lab1Report) ? 'accepted-parent' : 'rejected-parent',
    },
    {
      parentId: 'T28-S-Lab-2',
      method: lab2Report.method,
      ok: lab2Report.ok,
      finalVerdict: lab2Report.finalVerdict,
      consumedSections: ['supportSetSummary', 'sectorPreservationSummary', 'squarePolarityGateSummary', 'rawHexScaleGateSummary', 'finalVerdict', 'ok'],
      parentStatus: parentLab2Accepted(lab2Report) ? 'accepted-parent' : 'rejected-parent',
    },
    {
      parentId: 'T28-S-Lab-3',
      method: lab3Report.method,
      ok: lab3Report.ok,
      finalVerdict: lab3Report.finalVerdict,
      consumedSections: ['signedKernelRows', 'squarePolarityGateRows', 'rawScaleGateRows', 'finalVerdict', 'ok'],
      parentStatus: parentLab3Accepted(lab3Report) ? 'accepted-parent' : 'rejected-parent',
    },
    {
      parentId: 'T28-S-Lab-4',
      method: lab4Report.method,
      ok: lab4Report.ok,
      finalVerdict: lab4Report.finalVerdict,
      consumedSections: ['projectorStructureRows', 'loopEquivarianceRows', 'finalVerdict', 'ok'],
      parentStatus: parentLab4Accepted(lab4Report) ? 'accepted-parent' : 'rejected-parent',
    },
    {
      parentId: 'T28-R context-only-not-authority',
      method: 'context-only-not-authority',
      ok: null,
      consumedSections: [],
      parentStatus: 'context-only',
    },
  ];
}

function buildSiteLedgerReconstructionSummary(lab5Report: S5Report, siteForms: readonly SiteForm[]): SiteLedgerReconstructionSummary {
  const lab5RowsBySite = new Map(lab5Report.siteSupportLedgerRows.map((row) => [row.siteId, row]));
  let matchedCount = 0;
  let maxError = 0;

  for (const site of siteForms) {
    const row = lab5RowsBySite.get(site.siteId);
    if (!row) {
      maxError = Number.POSITIVE_INFINITY;
      continue;
    }
    const squareSection = sectionFromValues(
      site.squareAntiPair.ids,
      new Map(row.squareAntiPairRows.map((entry) => [entry.objectId, entry.value as Vec3])),
    );
    const hexSection = sectionFromValues(
      site.hexEnvelope.ids,
      new Map(row.hexEnvelopeRows.map((entry) => [entry.hexId, entry.value as Vec3])),
    );
    const rowError = Math.max(
      compareSquareSections(site.squareAntiPair, squareSection),
      compareHexSections(site.hexEnvelope, hexSection),
    );
    maxError = Math.max(maxError, rowError);
    if (
      row.status === 'site-level-standard-support-ledger-ready' &&
      row.complementSupportAxisEquivalent &&
      rowError <= EPSILON
    ) {
      matchedCount += 1;
    }
  }

  return {
    siteCount: siteForms.length,
    matchedCount,
    maxError: cleanNumber(maxError),
    status: siteForms.length === 6 && matchedCount === siteForms.length && maxError <= EPSILON
      ? 'lab-5-site-ledger-reconstruction-pass'
      : 'lab-5-site-ledger-reconstruction-failed',
  };
}

function summarizeClassifierRows(rows: readonly TransferClassifierRow[]): TransferAuditSummary<'transfer-outcome-classifier-ready', 'transfer-outcome-classifier-failed'> {
  return summarizeRows(rows, 'transfer-outcome-classifier-ready', 'transfer-outcome-classifier-failed');
}

function summarizeRows<PassStatus extends string, FailStatus extends string>(
  rows: readonly TransferClassifierRow[],
  passStatus: PassStatus,
  failStatus: FailStatus,
): TransferAuditSummary<PassStatus, FailStatus> {
  const passCount = rows.filter((row) => row.status === 'transfer-outcome-classifier-ready').length;

  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: passCount === rows.length ? passStatus : failStatus,
  };
}

function buildRedirectionSummary(rows: readonly TransferClassifierRow[]): RedirectionTransferSummary {
  const passCount = rows.filter((row) => row.status === 'transfer-outcome-classifier-ready').length;
  const wrongSiteFalselyAdmittedCount = rows.filter((row) =>
    row.expectedOutcomeClass === 'redirection' &&
    row.actualTargetSite === row.expectedSite &&
    row.outcomeClass !== 'redirection'
  ).length;

  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    wrongSiteFalselyAdmittedCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: wrongSiteFalselyAdmittedCount > 0
      ? 'wrong-site-falsely-admitted'
      : passCount === rows.length
        ? 'redirection-transfer-pass'
        : 'redirection-transfer-failed',
  };
}

function buildOutcomeConfusionMatrixRows(rows: readonly TransferClassifierRow[]): OutcomeConfusionMatrixRow[] {
  const rowsByKey = new Map<string, number>();
  for (const row of rows) {
    const key = confusionKey(row.expectedOutcomeClass, row.outcomeClass);
    rowsByKey.set(key, (rowsByKey.get(key) ?? 0) + 1);
  }

  return OUTCOME_CLASSES.flatMap((expectedOutcomeClass) => {
    const observedClasses = OUTCOME_CLASSES.filter((observedOutcomeClass) => rowsByKey.has(confusionKey(expectedOutcomeClass, observedOutcomeClass)));
    const classes = observedClasses.length > 0 ? observedClasses : [expectedOutcomeClass];
    return classes.map((observedOutcomeClass) => {
      const offDiagonal = expectedOutcomeClass !== observedOutcomeClass;
      return {
        expectedOutcomeClass,
        observedOutcomeClass,
        caseCount: rowsByKey.get(confusionKey(expectedOutcomeClass, observedOutcomeClass)) ?? 0,
        offDiagonal,
        status: offDiagonal ? 'transfer-outcome-classification-confused' as const : 'transfer-outcome-classification-pass' as const,
      };
    });
  });
}

function buildOutcomeConfusionSummary(rows: readonly OutcomeConfusionMatrixRow[]): OutcomeConfusionSummary {
  const offDiagonalCount = sumNumbers(rows.filter((row) => row.offDiagonal).map((row) => row.caseCount));

  return {
    outcomeClassCount: OUTCOME_CLASSES.length,
    matrixRowCount: rows.length,
    caseCount: sumNumbers(rows.map((row) => row.caseCount)),
    offDiagonalCount,
    status: offDiagonalCount === 0 ? 'transfer-outcome-classification-pass' : 'transfer-outcome-classification-confused',
  };
}

function buildS4OrbitCoverageRows(rows: readonly TransferClassifierRow[]): S4OrbitCoverageRow[] {
  return SITES.map((siteId) => {
    const siteRows = rows.filter((row) => row.expectedSite === siteId);
    const testedOutcomeCounts = zeroOutcomeCountRecord();
    for (const row of siteRows) {
      testedOutcomeCounts[row.expectedOutcomeClass] += 1;
    }
    const passCount = siteRows.filter((row) => row.status === 'transfer-outcome-classifier-ready').length;
    const failCount = siteRows.length - passCount;
    const coversAllOutcomes = OUTCOME_CLASSES.every((outcomeClass) => testedOutcomeCounts[outcomeClass] > 0);

    return {
      siteId,
      testedOutcomeCounts,
      passCount,
      failCount,
      maxError: maxOf(siteRows.map((row) => row.maxError)),
      status: siteRows.length > 0 && coversAllOutcomes && failCount === 0
        ? 'selective-transfer-s4-orbit-pass'
        : 'selective-transfer-s4-orbit-failed',
    };
  });
}

function buildS4OrbitCoverageSummary(rows: readonly S4OrbitCoverageRow[]): S4OrbitCoverageSummary {
  const orbitPassCount = rows.filter((row) => row.status === 'selective-transfer-s4-orbit-pass').length;

  return {
    siteCount: rows.length,
    orbitPassCount,
    orbitFailCount: rows.length - orbitPassCount,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: rows.length === 6 && orbitPassCount === rows.length
      ? 'selective-transfer-s4-orbit-pass'
      : 'selective-transfer-s4-orbit-failed',
  };
}

function buildControlRows(args: {
  transferClassifierRows: readonly TransferClassifierRow[];
  rejectionRows: readonly TransferClassifierRow[];
  invalidScalarCollapseRows: readonly TransferClassifierRow[];
  invalidSectorCollapseRows: readonly TransferClassifierRow[];
  blockedByPolarityRows: readonly TransferClassifierRow[];
  blockedByRawScaleRows: readonly TransferClassifierRow[];
  redirectionRows: readonly TransferClassifierRow[];
  supportAxisEquivalentRows: readonly TransferClassifierRow[];
  rowOrderMaxError: number;
}): ControlRow[] {
  const zeroRows = args.rejectionRows.filter((row) => row.inputKind === 'zero-input-rejection-control');
  const symmetricUniformRows = args.rejectionRows.filter((row) => row.inputKind !== 'zero-input-rejection-control');
  return [
    controlRow('C0', 'zero input rejection', 'rejection', observedClassForRows(zeroRows), zeroRows.length, maxOf(zeroRows.map((row) => row.maxError)), 'Zero square and hex inputs are classified as rejection.'),
    controlRow('C1', 'scalar magnitude invalidity', 'invalid-scalar-collapse', observedClassForRows(args.invalidScalarCollapseRows), args.invalidScalarCollapseRows.length, maxOf(args.invalidScalarCollapseRows.map((row) => row.maxError)), 'Scalar magnitude and equal scalar fixtures remain typed invalid fixtures.'),
    controlRow('C2', 'sector collapse invalidity', 'invalid-sector-collapse', observedClassForRows(args.invalidSectorCollapseRows), args.invalidSectorCollapseRows.length, maxOf(args.invalidSectorCollapseRows.map((row) => row.maxError)), 'Contrast/common sector collapse fixtures remain typed invalid fixtures.'),
    controlRow('C3', 'square polarity corruption block', 'blocked-by-polarity', observedClassForRows(args.blockedByPolarityRows), args.blockedByPolarityRows.length, maxOf(args.blockedByPolarityRows.map((row) => row.maxError)), 'Corrupted square authority does not authorize signed square transfer.'),
    controlRow('C4', 'raw scale corruption block', 'blocked-by-raw-scale', observedClassForRows(args.blockedByRawScaleRows), args.blockedByRawScaleRows.length, maxOf(args.blockedByRawScaleRows.map((row) => row.maxError)), 'Raw hex scale corruption is classified as blocked by raw scale.'),
    controlRow('C5', 'wrong non-complement site redirection', 'redirection', observedClassForRows(args.redirectionRows), args.redirectionRows.length, maxOf(args.redirectionRows.map((row) => row.maxError)), 'Wrong non-complement site forms are assigned to their actual site.'),
    controlRow('C6', 'complement site support-axis equivalent admission', 'support-axis-equivalent-admission', observedClassForRows(args.supportAxisEquivalentRows), args.supportAxisEquivalentRows.length, maxOf(args.supportAxisEquivalentRows.map((row) => row.maxError)), 'Complement site forms are not counted as wrong-site redirection.'),
    controlRow('C7', 'symmetric square and uniform hex rejection', 'rejection', observedClassForRows(symmetricUniformRows), symmetricUniformRows.length, maxOf(symmetricUniformRows.map((row) => row.maxError)), 'Symmetric square pairs and uniform hex modes are rejected.'),
    controlRow('C8', 'row/order shuffle classification invariance', 'classification-unchanged', args.rowOrderMaxError <= EPSILON ? 'classification-unchanged' : 'classification-changed', SITES.length, cleanNumber(args.rowOrderMaxError), 'Reversed object order preserves object-ID-indexed transfer outputs.'),
  ];
}

function controlRow(
  controlId: ControlRow['controlId'],
  controlName: string,
  expectedObservedClass: ControlRow['expectedObservedClass'],
  observedClass: ControlRow['observedClass'],
  checkedCount: number,
  maxError: number,
  note: string,
): ControlRow {
  return {
    controlId,
    controlName,
    expectedObservedClass,
    observedClass,
    checkedCount,
    maxError: cleanNumber(maxError),
    status: expectedObservedClass === observedClass ? 'control-pass' : 'control-fail',
    note,
  };
}

function buildBoundaryRows(): BoundaryRow[] {
  return REQUIRED_BOUNDARY_IDS.map((boundaryId) => ({
    boundaryId,
    statement: `${boundaryId} is enforced as a diagnostic-only lab boundary.`,
    enforced: true,
  }));
}

function buildFalsifierRows(args: {
  lab5Report: S5Report;
  siteLedgerReconstructionSummary: SiteLedgerReconstructionSummary;
  transferClassifierSummary: TransferAuditSummary<string, string>;
  fullAdmissionSummary: TransferAuditSummary<string, string>;
  partialAdmissionSummary: TransferAuditSummary<string, string>;
  rejectionSummary: TransferAuditSummary<string, string>;
  redirectionSummary: RedirectionTransferSummary;
  supportAxisEquivalentSummary: TransferAuditSummary<string, string>;
  blockedByPolaritySummary: TransferAuditSummary<string, string>;
  blockedByRawScaleSummary: TransferAuditSummary<string, string>;
  invalidScalarCollapseSummary: TransferAuditSummary<string, string>;
  invalidSectorCollapseSummary: TransferAuditSummary<string, string>;
  outcomeConfusionSummary: OutcomeConfusionSummary;
  s4OrbitCoverageSummary: S4OrbitCoverageSummary;
  controlRows: readonly ControlRow[];
}): FalsifierRow[] {
  return [
    falsifier('F1', 'Lab-5 parent missing or not accepted.', !parentLab5Accepted(args.lab5Report), `Lab-5 ok=${args.lab5Report.ok}; finalVerdict=${args.lab5Report.finalVerdict}; integrityIssueCount=${args.lab5Report.integrityIssueCount}.`),
    falsifier('F2', 'Transfer classifier missing or non-deterministic.', args.transferClassifierSummary.status !== 'transfer-outcome-classifier-ready' || args.siteLedgerReconstructionSummary.status !== 'lab-5-site-ledger-reconstruction-pass', `classifier=${args.transferClassifierSummary.status}; ledger=${args.siteLedgerReconstructionSummary.status}.`),
    falsifier('F3', 'Full-admission standard supports fail.', args.fullAdmissionSummary.status !== 'full-admission-transfer-pass', `full=${args.fullAdmissionSummary.status}.`),
    falsifier('F4', 'Partial-admission cases fail or are misclassified as full admission.', args.partialAdmissionSummary.status !== 'partial-admission-transfer-pass', `partial=${args.partialAdmissionSummary.status}.`),
    falsifier('F5', 'Rejection cases are admitted.', args.rejectionSummary.status !== 'rejection-transfer-pass', `rejection=${args.rejectionSummary.status}.`),
    falsifier('F6', 'Wrong-site inputs falsely admitted for tested site.', args.redirectionSummary.status !== 'redirection-transfer-pass', `redirection=${args.redirectionSummary.status}; falseAdmitted=${args.redirectionSummary.wrongSiteFalselyAdmittedCount}.`),
    falsifier('F7', 'Complement-site equivalence mishandled.', args.supportAxisEquivalentSummary.status !== 'support-axis-equivalent-admission-pass', `supportAxis=${args.supportAxisEquivalentSummary.status}.`),
    falsifier('F8', 'Square polarity corruption falsely admitted.', args.blockedByPolaritySummary.status !== 'blocked-by-polarity-transfer-pass', `polarity=${args.blockedByPolaritySummary.status}.`),
    falsifier('F9', 'Raw-scale corruption falsely admitted.', args.blockedByRawScaleSummary.status !== 'blocked-by-raw-scale-transfer-pass', `rawScale=${args.blockedByRawScaleSummary.status}.`),
    falsifier('F10', 'Scalar magnitude or equal scalar source accepted.', args.invalidScalarCollapseSummary.status !== 'invalid-scalar-collapse-transfer-pass', `scalar=${args.invalidScalarCollapseSummary.status}.`),
    falsifier('F11', 'Sector collapse accepted.', args.invalidSectorCollapseSummary.status !== 'invalid-sector-collapse-transfer-pass', `sector=${args.invalidSectorCollapseSummary.status}.`),
    falsifier('F12', 'Outcome confusion matrix has off-diagonal classification.', args.outcomeConfusionSummary.offDiagonalCount !== 0, `offDiagonalCount=${args.outcomeConfusionSummary.offDiagonalCount}.`),
    falsifier('F13', 'S4 orbit coverage fails.', args.s4OrbitCoverageSummary.status !== 'selective-transfer-s4-orbit-pass', `s4=${args.s4OrbitCoverageSummary.status}.`),
    falsifier('F14', 'Row/order dependence appears.', controlFailed(args.controlRows, 'C8'), `C8=${controlStatus(args.controlRows, 'C8')}.`),
    falsifier('F15', 'Boundary promotion to disallowed mature labels occurs.', false, 'Boundary rows are diagnostic-only nonpromotion rows.'),
    falsifier('F16', 'Runtime/UI/packet/Shape mutation appears.', false, 'Lab-6 adds a diagnostic source file and diagnostic script only.'),
  ];
}

function falsifier(falsifierId: FalsifierRow['falsifierId'], description: string, triggered: boolean, evidence: string): FalsifierRow {
  return { falsifierId, description, triggered, evidence, status: triggered ? 'triggered' : 'clear' };
}

function classifyFinalVerdict(args: {
  lab5Report: S5Report;
  siteLedgerReconstructionSummary: SiteLedgerReconstructionSummary;
  transferClassifierSummary: TransferAuditSummary<string, string>;
  fullAdmissionSummary: TransferAuditSummary<string, string>;
  partialAdmissionSummary: TransferAuditSummary<string, string>;
  rejectionSummary: TransferAuditSummary<string, string>;
  redirectionSummary: RedirectionTransferSummary;
  supportAxisEquivalentSummary: TransferAuditSummary<string, string>;
  blockedByPolaritySummary: TransferAuditSummary<string, string>;
  blockedByRawScaleSummary: TransferAuditSummary<string, string>;
  invalidScalarCollapseSummary: TransferAuditSummary<string, string>;
  invalidSectorCollapseSummary: TransferAuditSummary<string, string>;
  outcomeConfusionSummary: OutcomeConfusionSummary;
  s4OrbitCoverageSummary: S4OrbitCoverageSummary;
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
}): T28S6FinalVerdict {
  if (
    !parentLab5Accepted(args.lab5Report) ||
    args.siteLedgerReconstructionSummary.status !== 'lab-5-site-ledger-reconstruction-pass' ||
    args.transferClassifierSummary.status !== 'transfer-outcome-classifier-ready'
  ) {
    return 'T28-S-Lab-6-transfer-classifier-failed';
  }
  if (args.fullAdmissionSummary.status !== 'full-admission-transfer-pass') return 'T28-S-Lab-6-full-admission-failed';
  if (args.partialAdmissionSummary.status !== 'partial-admission-transfer-pass') return 'T28-S-Lab-6-partial-admission-failed';
  if (args.rejectionSummary.status !== 'rejection-transfer-pass') return 'T28-S-Lab-6-rejection-failed';
  if (args.redirectionSummary.status !== 'redirection-transfer-pass') return 'T28-S-Lab-6-redirection-failed';
  if (args.supportAxisEquivalentSummary.status !== 'support-axis-equivalent-admission-pass') return 'T28-S-Lab-6-support-axis-equivalence-failed';
  if (args.blockedByPolaritySummary.status !== 'blocked-by-polarity-transfer-pass') return 'T28-S-Lab-6-polarity-block-failed';
  if (args.blockedByRawScaleSummary.status !== 'blocked-by-raw-scale-transfer-pass') return 'T28-S-Lab-6-raw-scale-block-failed';
  if (args.invalidScalarCollapseSummary.status !== 'invalid-scalar-collapse-transfer-pass') return 'T28-S-Lab-6-scalar-collapse-invalidity-failed';
  if (args.invalidSectorCollapseSummary.status !== 'invalid-sector-collapse-transfer-pass') return 'T28-S-Lab-6-sector-collapse-invalidity-failed';
  if (args.outcomeConfusionSummary.offDiagonalCount !== 0) return 'T28-S-Lab-6-outcome-classification-confused';
  if (args.s4OrbitCoverageSummary.status !== 'selective-transfer-s4-orbit-pass') return 'T28-S-Lab-6-s4-orbit-failed';
  if (requiredBoundaryMissing(args.boundaryRows) || controlFailedByFalsifier(args.falsifierRows, ['F15', 'F16'])) return 'T28-S-Lab-6-boundary-failed';

  return 'T28-S-Lab-6-site-level-selective-transfer-gate-precondition-pass';
}

function buildIntegrityIssues(args: {
  lab5Report: S5Report;
  siteLedgerReconstructionSummary: SiteLedgerReconstructionSummary;
  transferClassifierRows: readonly TransferClassifierRow[];
  transferClassifierSummary: TransferAuditSummary<string, string>;
  fullAdmissionRows: readonly TransferClassifierRow[];
  fullAdmissionSummary: TransferAuditSummary<string, string>;
  partialAdmissionRows: readonly TransferClassifierRow[];
  partialAdmissionSummary: TransferAuditSummary<string, string>;
  rejectionRows: readonly TransferClassifierRow[];
  rejectionSummary: TransferAuditSummary<string, string>;
  redirectionRows: readonly TransferClassifierRow[];
  redirectionSummary: RedirectionTransferSummary;
  supportAxisEquivalentRows: readonly TransferClassifierRow[];
  supportAxisEquivalentSummary: TransferAuditSummary<string, string>;
  blockedByPolarityRows: readonly TransferClassifierRow[];
  blockedByPolaritySummary: TransferAuditSummary<string, string>;
  blockedByRawScaleRows: readonly TransferClassifierRow[];
  blockedByRawScaleSummary: TransferAuditSummary<string, string>;
  invalidScalarCollapseRows: readonly TransferClassifierRow[];
  invalidScalarCollapseSummary: TransferAuditSummary<string, string>;
  invalidSectorCollapseRows: readonly TransferClassifierRow[];
  invalidSectorCollapseSummary: TransferAuditSummary<string, string>;
  outcomeConfusionMatrixRows: readonly OutcomeConfusionMatrixRow[];
  outcomeConfusionSummary: OutcomeConfusionSummary;
  s4OrbitCoverageRows: readonly S4OrbitCoverageRow[];
  s4OrbitCoverageSummary: S4OrbitCoverageSummary;
  controlRows: readonly ControlRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  finalVerdict: T28S6FinalVerdict;
}): string[] {
  const issues: string[] = [];
  if (!parentLab5Accepted(args.lab5Report)) issues.push('Lab-5 parent missing/not accepted');
  if (args.siteLedgerReconstructionSummary.status !== 'lab-5-site-ledger-reconstruction-pass') issues.push('Lab-5 site ledger reconstruction failed');
  if (args.transferClassifierRows.length !== 144) issues.push('transfer classifier row count not 144');
  if (args.fullAdmissionRows.length !== 18) issues.push('full admission row count not 18');
  if (args.partialAdmissionRows.length !== 36) issues.push('partial admission row count not 36');
  if (args.rejectionRows.length !== 18) issues.push('rejection row count not 18');
  if (args.redirectionRows.length !== 12) issues.push('redirection row count not 12');
  if (args.supportAxisEquivalentRows.length !== 12) issues.push('support-axis equivalent row count not 12');
  if (args.blockedByPolarityRows.length !== 6) issues.push('blocked-by-polarity row count not 6');
  if (args.blockedByRawScaleRows.length !== 6) issues.push('blocked-by-raw-scale row count not 6');
  if (args.invalidScalarCollapseRows.length !== 24) issues.push('invalid scalar collapse row count not 24');
  if (args.invalidSectorCollapseRows.length !== 12) issues.push('invalid sector collapse row count not 12');
  if (args.transferClassifierRows.some((row) => row.outcomeAssignmentCount !== 1)) issues.push('not every row has exactly one outcome assignment');
  if (args.transferClassifierSummary.status !== 'transfer-outcome-classifier-ready') issues.push('transfer classifier setup failed');
  if (args.fullAdmissionSummary.status !== 'full-admission-transfer-pass') issues.push('full admission failed');
  if (args.partialAdmissionSummary.status !== 'partial-admission-transfer-pass') issues.push('partial admission failed');
  if (args.rejectionSummary.status !== 'rejection-transfer-pass') issues.push('rejection failed');
  if (args.redirectionSummary.status !== 'redirection-transfer-pass') issues.push('redirection failed');
  if (args.supportAxisEquivalentSummary.status !== 'support-axis-equivalent-admission-pass') issues.push('support-axis equivalence failed');
  if (args.blockedByPolaritySummary.status !== 'blocked-by-polarity-transfer-pass') issues.push('polarity block failed');
  if (args.blockedByRawScaleSummary.status !== 'blocked-by-raw-scale-transfer-pass') issues.push('raw-scale block failed');
  if (args.invalidScalarCollapseSummary.status !== 'invalid-scalar-collapse-transfer-pass') issues.push('scalar collapse invalidity failed');
  if (args.invalidSectorCollapseSummary.status !== 'invalid-sector-collapse-transfer-pass') issues.push('sector collapse invalidity failed');
  if (args.outcomeConfusionMatrixRows.length < OUTCOME_CLASSES.length) issues.push('outcome confusion matrix does not cover every outcome class');
  if (args.outcomeConfusionSummary.offDiagonalCount !== 0) issues.push('outcome confusion off diagonal count not zero');
  if (args.s4OrbitCoverageRows.length !== 6) issues.push('S4 orbit row count not 6');
  if (args.s4OrbitCoverageSummary.status !== 'selective-transfer-s4-orbit-pass') issues.push('S4 orbit coverage failed');
  if (args.controlRows.length !== 9 || args.controlRows.some((row) => row.status !== 'control-pass')) issues.push('control row missing or failed');
  if (requiredBoundaryMissing(args.boundaryRows)) issues.push('boundary row missing');
  if (REQUIRED_FALSIFIER_IDS.some((id) => !args.falsifierRows.some((row) => row.falsifierId === id)) || args.falsifierRows.some((row) => row.triggered)) {
    issues.push('falsifier row missing or triggered');
  }

  const expectedVerdict = classifyFinalVerdict({
    lab5Report: args.lab5Report,
    siteLedgerReconstructionSummary: args.siteLedgerReconstructionSummary,
    transferClassifierSummary: args.transferClassifierSummary,
    fullAdmissionSummary: args.fullAdmissionSummary,
    partialAdmissionSummary: args.partialAdmissionSummary,
    rejectionSummary: args.rejectionSummary,
    redirectionSummary: args.redirectionSummary,
    supportAxisEquivalentSummary: args.supportAxisEquivalentSummary,
    blockedByPolaritySummary: args.blockedByPolaritySummary,
    blockedByRawScaleSummary: args.blockedByRawScaleSummary,
    invalidScalarCollapseSummary: args.invalidScalarCollapseSummary,
    invalidSectorCollapseSummary: args.invalidSectorCollapseSummary,
    outcomeConfusionSummary: args.outcomeConfusionSummary,
    s4OrbitCoverageSummary: args.s4OrbitCoverageSummary,
    boundaryRows: args.boundaryRows,
    falsifierRows: args.falsifierRows,
  });
  if (expectedVerdict !== args.finalVerdict) issues.push('final verdict inconsistent with precedence');

  return unique(issues);
}

function parentLab5Accepted(report: S5Report): boolean {
  return report.ok === true &&
    report.finalVerdict === 'T28-S-Lab-5-site-level-support-candidacy-pass' &&
    report.integrityIssueCount === 0;
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

function rowOrderShuffleMaxError(context: OperatorContext, siteForms: readonly SiteForm[]): number {
  const reversedSquareIds = [...context.squareIds].reverse();
  const reversedHexIds = [...context.hexIds].reverse();
  const reversedContext: OperatorContext = {
    ...context,
    squareIds: reversedSquareIds,
    hexIds: reversedHexIds,
    d: reindexMatrix(context.d, context.hexIds, context.squareIds, reversedHexIds, reversedSquareIds),
    rExact: reindexMatrix(context.rExact, context.squareIds, context.hexIds, reversedSquareIds, reversedHexIds),
    rAdj: reindexMatrix(context.rAdj, context.squareIds, context.hexIds, reversedSquareIds, reversedHexIds),
    pQ: reindexMatrix(context.pQ, context.squareIds, context.squareIds, reversedSquareIds, reversedSquareIds),
    pH: reindexMatrix(context.pH, context.hexIds, context.hexIds, reversedHexIds, reversedHexIds),
  };

  return maxOf(siteForms.map((site) => {
    const square = reorderSection(site.squareAntiPair, reversedSquareIds);
    const hex = reorderSection(site.hexEnvelope, reversedHexIds);
    return Math.max(
      compareHexSections(applyD(context, site.squareAntiPair), applyD(reversedContext, square)),
      compareSquareSections(applyRExact(context, site.hexEnvelope), applyRExact(reversedContext, hex)),
      compareSquareSections(applyRAdj(context, site.hexEnvelope), applyRAdj(reversedContext, hex)),
      compareSquareSections(applyPQ(context, site.squareAntiPair), applyPQ(reversedContext, square)),
      compareHexSections(applyPH(context, site.hexEnvelope), applyPH(reversedContext, hex)),
    );
  }));
}

function reindexMatrix(matrix: Matrix, originalOutputIds: readonly string[], originalInputIds: readonly string[], newOutputIds: readonly string[], newInputIds: readonly string[]): Matrix {
  return newOutputIds.map((outputId) => {
    const rowIndex = originalOutputIds.indexOf(outputId);
    return newInputIds.map((inputId) => {
      const columnIndex = originalInputIds.indexOf(inputId);
      return matrix[rowIndex]?.[columnIndex] ?? 0;
    });
  });
}

function applyD(context: OperatorContext, square: Section): Section {
  return applyScalarMatrixToVectorSection(context.d, square, context.hexIds);
}

function applyRExact(context: OperatorContext, hex: Section): Section {
  return applyScalarMatrixToVectorSection(context.rExact, hex, context.squareIds);
}

function applyRAdj(context: OperatorContext, hex: Section): Section {
  return applyScalarMatrixToVectorSection(context.rAdj, hex, context.squareIds);
}

function applyPQ(context: OperatorContext, square: Section): Section {
  return applyScalarMatrixToVectorSection(context.pQ, square, context.squareIds);
}

function applyPH(context: OperatorContext, hex: Section): Section {
  return applyScalarMatrixToVectorSection(context.pH, hex, context.hexIds);
}

function applyScalarMatrixToVectorSection(matrix: Matrix, input: Section, outputIds: readonly string[]): Section {
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

function buildZeroSquareSection(context: OperatorContext): Section {
  return sectionFromValues(context.squareIds, new Map(context.squareIds.map((id) => [id, zeroVec3()])));
}

function buildZeroHexSection(context: OperatorContext): Section {
  return sectionFromValues(context.hexIds, new Map(context.hexIds.map((id) => [id, zeroVec3()])));
}

function compareSquareSections(left: Section, right: Section): number {
  return sectionMaxErrorByObjectId(left, right);
}

function compareHexSections(left: Section, right: Section): number {
  return sectionMaxErrorByObjectId(left, right);
}

function sectionMaxErrorByObjectId(left: Section, right: Section): number {
  const ids = unique([...left.ids, ...right.ids, ...left.values.keys(), ...right.values.keys()]);
  return maxOf(ids.map((id) => maxAbsVec3(subVec3(left.values.get(id) ?? zeroVec3(), right.values.get(id) ?? zeroVec3()))));
}

function sectionFromValues(ids: readonly string[], values: Map<string, Vec3>): Section {
  return { ids: [...ids], values: new Map(values) };
}

function cloneSection(section: Section): Section {
  return sectionFromValues(section.ids, section.values);
}

function reorderSection(section: Section, ids: readonly string[]): Section {
  return sectionFromValues(ids, new Map(ids.map((id) => [id, section.values.get(id) ?? zeroVec3()])));
}

function removeHexLabels(section: Section, labels: readonly A3Label[]): Section {
  return labels.reduce((current, label) => setSectionValue(current, hexIdForOmittedLabel(label), zeroVec3()), cloneSection(section));
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

function squareIdForDirectedPair(context: OperatorContext, sourcePair: readonly A3Label[], targetPair: readonly A3Label[]): string {
  return context.squarePolarityByDirectedPair.get(directedPairKey(sourcePair, targetPair))?.squareObjectId ?? `missing-square:${sourcePair.join('')}|${targetPair.join('')}`;
}

function edgeIdFromPair(pair: readonly A3Label[]): EdgeId {
  return labelSort(pair).join('') as EdgeId;
}

function complementEdge(edge: EdgeId): EdgeId {
  return edgeIdFromPair(A3_LABELS.filter((label) => !edge.includes(label)));
}

function childIdFromEdge(edge: EdgeId): SiteId {
  return `M_${edge}` as SiteId;
}

function sourcePairForSite(siteId: SiteId): [A3Label, A3Label] {
  return [siteId[2] as A3Label, siteId[3] as A3Label];
}

function complementPairForSite(siteId: SiteId): [A3Label, A3Label] {
  return labelSort(A3_LABELS.filter((label) => !sourcePairForSite(siteId).includes(label)));
}

function firstNonComplementSite(site: SiteForm, siteForms: readonly SiteForm[]): SiteForm {
  return siteForms.find((candidate) => candidate.siteId !== site.siteId && candidate.siteId !== site.complementSiteId) ?? site;
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

function hexIdForOmittedLabel(label: A3Label): string {
  return `ve-central-hexagon-omitted:${label}`;
}

function observedClassForRows(rows: readonly TransferClassifierRow[]): ControlRow['observedClass'] {
  const classes = unique(rows.map((row) => row.outcomeClass));
  return classes.length === 1 ? classes[0] : 'mixed';
}

function zeroOutcomeCountRecord(): Record<OutcomeClass, number> {
  return Object.fromEntries(OUTCOME_CLASSES.map((outcomeClass) => [outcomeClass, 0])) as Record<OutcomeClass, number>;
}

function confusionKey(expectedOutcomeClass: OutcomeClass, observedOutcomeClass: OutcomeClass): string {
  return `${expectedOutcomeClass}::${observedOutcomeClass}`;
}

function controlFailed(rows: readonly ControlRow[], controlId: ControlRow['controlId']): boolean {
  return rows.find((row) => row.controlId === controlId)?.status !== 'control-pass';
}

function controlStatus(rows: readonly ControlRow[], controlId: ControlRow['controlId']): string {
  return rows.find((row) => row.controlId === controlId)?.status ?? 'missing';
}

function controlFailedByFalsifier(rows: readonly FalsifierRow[], ids: readonly FalsifierRow['falsifierId'][]): boolean {
  return rows.some((row) => ids.includes(row.falsifierId) && row.triggered);
}

function requiredBoundaryMissing(rows: readonly BoundaryRow[]): boolean {
  return REQUIRED_BOUNDARY_IDS.some((id) => !rows.some((row) => row.boundaryId === id && row.enforced));
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

function normVec3(value: Vec3): number {
  return Math.sqrt(dotVec3(value, value));
}

function maxAbsVec3(value: Vec3): number {
  return Math.max(Math.abs(value[0]), Math.abs(value[1]), Math.abs(value[2]));
}

function cleanNumber(value: number): number {
  return Math.abs(value) <= EPSILON ? 0 : Number(value.toFixed(12));
}

function cleanVec3(value: Vec3): Vec3 {
  return [cleanNumber(value[0]), cleanNumber(value[1]), cleanNumber(value[2])];
}

function zeroVec3(): Vec3 {
  return [0, 0, 0];
}

function sumVec3(values: readonly Vec3[]): Vec3 {
  return values.reduce((sum, value) => addVec3(sum, value), zeroVec3());
}

function sumNumbers(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0);
}

function maxOf(values: readonly number[]): number {
  return values.length === 0 ? 0 : Math.max(...values);
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

import { buildPSimplexOrderedPairTransitionAntiRouteAuditT28S8Report } from './pSimplexOrderedPairTransitionAntiRouteAuditT28S8';
import {
  buildPSimplexTraceRetentionSupportProjectionCompatibilityAuditT28S9Report,
  type GateBodyId,
  type Vec3,
} from './pSimplexTraceRetentionSupportProjectionCompatibilityAuditT28S9';

type S8Report = ReturnType<typeof buildPSimplexOrderedPairTransitionAntiRouteAuditT28S8Report>;
type S9Report = ReturnType<typeof buildPSimplexTraceRetentionSupportProjectionCompatibilityAuditT28S9Report>;
type S9TraceTokenConstructionRow = S9Report['traceTokenConstructionRows'][number];
type S9ComplementAxisTraceIdentityRow = S9Report['complementAxisTraceIdentityRows'][number];

type PrimaryAdmissibilityClass =
  | 'direct-transition-trace'
  | 'open-composable-trace'
  | 'non-composable-token-sequence'
  | 'zero-support-backtrack-trace'
  | 'zero-support-cycle-trace'
  | 'invalid-scalar-trace'
  | 'invalid-sector-collapsed-trace'
  | 'invalid-trace-order-collapse'
  | 'invalid-site-address-duplication';

type AdmissibilityBand = 'structurally-invalid' | 'trace-valid-passage-inadmissible' | 'passage-precondition-admissible';
type ZeroSupportStatus = 'zero-support' | 'nonzero-support';
type ComposabilityStatus = 'composable' | 'non-composable' | 'structurally-invalid';
type RelationAnnotation = 'projection-equivalent-trace-distinct';

interface SupportProjection {
  square: Record<string, Vec3>;
  hex: Record<string, Vec3>;
}

interface TraceToken {
  tokenId: string;
  orderedPairId: string;
  sourceBodyId: GateBodyId;
  targetBodyId: GateBodyId;
  absentBodyId: GateBodyId;
  sourceCoefficient: number;
  targetCoefficient: number;
  absentBodyCoefficient: number;
  supportProjection: SupportProjection;
}

interface TraceLedger {
  kind: 'trace-ledger';
  traceId: string;
  tokenIds: string[];
  supportProjectionOverride?: SupportProjection;
  projectionEquivalentTraceIds?: string[];
}

interface StructuralInvalidTraceAttempt {
  kind: 'structural-invalidity';
  traceId: string;
  invalidCaseId: string;
  invalidityKind:
    | 'scalar-magnitude-trace'
    | 'equal-scalar-body-weights'
    | 'sector-collapsed-trace'
    | 'unordered-token-set-treated-as-ordered-ledger'
    | 'site-address-double-counting'
    | 'six-site-address-trace-model';
  expectedPrimaryClass: PrimaryAdmissibilityClass;
  reason: string;
}

type TraceAdmissibilityInput = TraceLedger | StructuralInvalidTraceAttempt;

interface TraceAdmissibilityClassification {
  traceId: string;
  tokenCount: number;
  bodySequence: GateBodyId[];
  entryBodyId: GateBodyId | null;
  exitBodyId: GateBodyId | null;
  retainedIntermediateBodies: GateBodyId[];
  projectionErasedBodies: GateBodyId[];
  supportProjection: SupportProjection;
  zeroSupportStatus: ZeroSupportStatus;
  composabilityStatus: ComposabilityStatus;
  primaryAdmissibilityClass: PrimaryAdmissibilityClass;
  primaryClassAssignmentCount: number;
  admissibilityBand: AdmissibilityBand;
  admissibilityBandAssignmentCount: number;
  projectionEquivalentTraceIds: string[];
  relationAnnotations: RelationAnnotation[];
  reason: string;
  routeMaturityStatus: 'not-route';
  loopMaturityStatus?: 'not-loop';
  vortexMaturityStatus?: 'not-vortex';
  circulationMaturityStatus?: 'not-circulation';
  status: string;
}

interface Summary<PassStatus extends string, FailStatus extends string> {
  rowCount: number;
  passCount: number;
  failCount: number;
  maxError: number;
  status: PassStatus | FailStatus;
}

export interface ParentEvidenceRow {
  parentId: 'T28-S-Lab-9' | 'T28-S-Lab-8 ordered-pair-preforms-secondary' | 'T28-R context-only-not-authority';
  method: string;
  ok: boolean | null;
  finalVerdict?: string;
  integrityIssueCount?: number;
  consumedSections: string[];
  status: 'lab-9-parent-accepted' | 'lab-9-parent-not-accepted' | 'secondary-parent-consumed' | 'secondary-parent-not-accepted' | 'context-only';
}

export interface ClassifierSetupRow {
  setupId: string;
  expectedStatus: string;
  observedStatus: string;
  deterministic: boolean;
  status: 'classifier-setup-pass' | 'classifier-setup-fail';
}

export interface DirectTransitionClassificationRow {
  traceId: string;
  tokenIds: string[];
  bodySequence: GateBodyId[];
  entryBodyId: GateBodyId | null;
  exitBodyId: GateBodyId | null;
  primaryAdmissibilityClass: PrimaryAdmissibilityClass;
  admissibilityBand: AdmissibilityBand;
  zeroSupportStatus: ZeroSupportStatus;
  routeMaturityStatus: 'not-route';
  maxError: number;
  status: 'direct-transition-trace-classification-pass' | 'direct-transition-trace-classification-failed';
}

export interface OpenComposableClassificationRow {
  traceId: string;
  tokenIds: string[];
  bodySequence: GateBodyId[];
  entryBodyId: GateBodyId | null;
  exitBodyId: GateBodyId | null;
  retainedIntermediateBodies: GateBodyId[];
  projectionErasedBodies: GateBodyId[];
  primaryAdmissibilityClass: PrimaryAdmissibilityClass;
  admissibilityBand: AdmissibilityBand;
  zeroSupportStatus: ZeroSupportStatus;
  routeMaturityStatus: 'not-route';
  maxError: number;
  status:
    | 'open-composable-trace-classification-pass'
    | 'open-composable-trace-classification-failed'
    | 'open-composable-trace-falsely-promoted-to-route'
    | 'intermediate-body-not-retained';
}

export interface ProjectionEquivalentRelationRow {
  comparisonId: string;
  traceAId: string;
  traceBId: string;
  traceATokenIds: string[];
  traceBTokenIds: string[];
  supportProjectionEqual: boolean;
  traceIdentityEqual: boolean;
  traceAPrimaryClass: PrimaryAdmissibilityClass;
  traceBPrimaryClass: PrimaryAdmissibilityClass;
  relationAnnotation: RelationAnnotation | 'none';
  annotationIsPrimaryClass: boolean;
  maxError: number;
  status: 'projection-equivalent-trace-relation-pass' | 'projection-equivalent-traces-falsely-identified';
}

export interface NonComposableClassificationRow {
  traceId: string;
  tokenIds: string[];
  bodySequence: GateBodyId[];
  composabilityStatus: ComposabilityStatus;
  primaryAdmissibilityClass: PrimaryAdmissibilityClass;
  admissibilityBand: AdmissibilityBand;
  routeMaturityStatus: 'not-route';
  status:
    | 'non-composable-token-sequence-classification-pass'
    | 'non-composable-token-sequence-falsely-admissible'
    | 'non-composable-sequence-falsely-promoted-to-route';
}

export interface BacktrackClassificationRow {
  traceId: string;
  tokenIds: string[];
  bodySequence: GateBodyId[];
  traceRetained: boolean;
  primaryAdmissibilityClass: PrimaryAdmissibilityClass;
  admissibilityBand: AdmissibilityBand;
  zeroSupportStatus: ZeroSupportStatus;
  routeMaturityStatus: 'not-route';
  loopMaturityStatus: 'not-loop';
  maxError: number;
  status:
    | 'zero-support-backtrack-trace-classification-pass'
    | 'zero-support-backtrack-trace-erased'
    | 'zero-support-backtrack-falsely-promoted-to-route'
    | 'zero-support-backtrack-falsely-promoted-to-loop';
}

export interface CycleClassificationRow {
  traceId: string;
  tokenIds: string[];
  bodySequence: GateBodyId[];
  traceRetained: boolean;
  primaryAdmissibilityClass: PrimaryAdmissibilityClass;
  admissibilityBand: AdmissibilityBand;
  zeroSupportStatus: ZeroSupportStatus;
  routeMaturityStatus: 'not-route';
  loopMaturityStatus: 'not-loop';
  vortexMaturityStatus: 'not-vortex';
  circulationMaturityStatus: 'not-circulation';
  maxError: number;
  status:
    | 'zero-support-cycle-trace-classification-pass'
    | 'zero-support-cycle-trace-erased'
    | 'zero-support-cycle-falsely-promoted-to-loop'
    | 'zero-support-cycle-falsely-promoted-to-vortex'
    | 'zero-support-cycle-falsely-promoted-to-circulation'
    | 'zero-support-cycle-falsely-promoted-to-route';
}

export interface StructuralInvalidityClassificationRow {
  invalidCaseId: string;
  invalidityKind: StructuralInvalidTraceAttempt['invalidityKind'];
  expectedPrimaryClass: PrimaryAdmissibilityClass;
  observedPrimaryClass: PrimaryAdmissibilityClass;
  expectedAdmissibilityBand: AdmissibilityBand;
  observedAdmissibilityBand: AdmissibilityBand;
  status:
    | 'structurally-invalid-trace-classification-pass'
    | 'scalar-trace-falsely-admitted'
    | 'sector-collapsed-trace-falsely-admitted'
    | 'trace-order-collapse-falsely-admitted'
    | 'site-address-duplication-falsely-admitted'
    | 'six-site-address-trace-model-falsely-admitted';
}

type StructuralInvalidityFailureStatus = Exclude<StructuralInvalidityClassificationRow['status'], 'structurally-invalid-trace-classification-pass'>;

export interface ClassificationPrecedenceRow {
  precedenceId: string;
  expectedStatus: string;
  observedStatus: string;
  primaryAdmissibilityClass: PrimaryAdmissibilityClass;
  admissibilityBand: AdmissibilityBand;
  status: 'trace-classification-precedence-pass' | 'trace-classification-precedence-failed';
}

export interface TraceSupportIdentityBoundaryRow {
  relationId: 'sameTraceSameProjection' | 'differentTraceSameProjection' | 'differentTraceDifferentProjection';
  leftTraceId: string;
  rightTraceId: string;
  leftPrimaryClass: PrimaryAdmissibilityClass;
  rightPrimaryClass: PrimaryAdmissibilityClass;
  traceIdentityEqual: boolean;
  supportProjectionEqual: boolean;
  classificationCollapsedIntoSupportProjection: boolean;
  status: 'trace-classification-independent-from-support-projection' | 'trace-classification-collapsed-into-support-projection';
}

export interface ComplementAxisIdentityRow {
  bodyId: GateBodyId;
  siteAddressA: string;
  siteAddressB: string;
  bodyMembershipA: string;
  bodyMembershipB: string;
  identityPreserved: boolean;
  status: 'complement-axis-trace-admissibility-identity-preserved' | 'complement-axis-trace-admissibility-identity-lost';
}

export interface ComplementAxisIdentitySummary {
  rowCount: number;
  passCount: number;
  failCount: number;
  maxError: number;
  siteAddressDoubleCountingStatus: 'site-address-double-counting-rejected' | 'site-address-double-counting-falsely-admitted';
  sixSiteAddressTraceClassifierStatus: 'six-site-address-trace-classifier-rejected' | 'six-site-address-trace-classifier-falsely-admitted';
  status:
    | 'complement-axis-trace-admissibility-identity-preserved'
    | 'complement-axis-trace-admissibility-identity-lost'
    | 'site-address-double-counting-falsely-admitted'
    | 'six-site-address-trace-classifier-falsely-admitted';
}

export interface RowOrderShuffleClassificationRow {
  traceId: string;
  canonicalPrimaryClass: PrimaryAdmissibilityClass;
  shuffledPrimaryClass: PrimaryAdmissibilityClass;
  canonicalAdmissibilityBand: AdmissibilityBand;
  shuffledAdmissibilityBand: AdmissibilityBand;
  traceOrderPreserved: boolean;
  supportObjectIdComparisonPreserved: boolean;
  classificationUnchanged: boolean;
  supportProjectionOrderShuffled: boolean;
  status: 'row-order-shuffle-classification-pass' | 'row-order-dependence-detected';
}

export interface AntiRouteLanguageBoundaryRow {
  boundaryId: typeof ANTI_ROUTE_BOUNDARY_IDS[number];
  positivePromotionDetected: boolean;
  status: 'trace-admissibility-anti-route-boundary-pass' | 'trace-admissibility-anti-route-boundary-failed';
}

export interface ControlRow {
  controlId: typeof REQUIRED_CONTROL_IDS[number];
  controlName: string;
  expectedStatus: string;
  observedStatus: string;
  checkedCount: number;
  maxError: number;
  status: 'control-pass' | 'control-fail';
}

export interface BoundaryRow {
  boundaryId: typeof REQUIRED_BOUNDARY_IDS[number];
  statement: string;
  enforced: boolean;
  positivePromotionDetected: boolean;
}

export interface FalsifierRow {
  falsifierId: typeof REQUIRED_FALSIFIER_IDS[number];
  description: string;
  triggered: boolean;
  evidence: string;
  status: 'clear' | 'triggered';
}

type T28S10FinalVerdict =
  | 'T28-S-Lab-10-trace-admissibility-classifier-pass'
  | 'T28-S-Lab-10-lab-9-parent-not-accepted'
  | 'T28-S-Lab-10-classifier-setup-failed'
  | 'T28-S-Lab-10-direct-transition-classification-failed'
  | 'T28-S-Lab-10-open-composable-classification-failed'
  | 'T28-S-Lab-10-projection-equivalent-relation-failed'
  | 'T28-S-Lab-10-non-composable-classification-failed'
  | 'T28-S-Lab-10-backtrack-classification-failed'
  | 'T28-S-Lab-10-cycle-classification-failed'
  | 'T28-S-Lab-10-structural-invalidity-classification-failed'
  | 'T28-S-Lab-10-classification-precedence-failed'
  | 'T28-S-Lab-10-trace-support-identity-boundary-failed'
  | 'T28-S-Lab-10-complement-axis-identity-failed'
  | 'T28-S-Lab-10-anti-route-boundary-failed'
  | 'T28-S-Lab-10-boundary-failed';

export interface PSimplexTraceAdmissibilityClassifierAuditT28S10Report {
  method: typeof METHOD;
  experimentName: typeof EXPERIMENT_NAME;
  diagnosticScope: typeof DIAGNOSTIC_SCOPE;
  branchRef: typeof BRANCH_REF;
  baselineRef: typeof BASELINE_REF;
  parentEvidenceRows: ParentEvidenceRow[];
  classifierSetupRows: ClassifierSetupRow[];
  classifierSetupSummary: Summary<'trace-admissibility-classifier-ready', 'trace-admissibility-classifier-failed'>;
  directTransitionClassificationRows: DirectTransitionClassificationRow[];
  directTransitionClassificationSummary: Summary<'direct-transition-trace-classification-pass', 'direct-transition-trace-classification-failed'>;
  openComposableClassificationRows: OpenComposableClassificationRow[];
  openComposableClassificationSummary: Summary<
    'open-composable-trace-classification-pass',
    'open-composable-trace-classification-failed' | 'open-composable-trace-falsely-promoted-to-route' | 'intermediate-body-not-retained'
  >;
  projectionEquivalentRelationRows: ProjectionEquivalentRelationRow[];
  projectionEquivalentRelationSummary: Summary<'projection-equivalent-trace-relation-pass', 'projection-equivalent-traces-falsely-identified'>;
  nonComposableClassificationRows: NonComposableClassificationRow[];
  nonComposableClassificationSummary: Summary<
    'non-composable-token-sequence-classification-pass',
    'non-composable-token-sequence-falsely-admissible' | 'non-composable-sequence-falsely-promoted-to-route'
  >;
  backtrackClassificationRows: BacktrackClassificationRow[];
  backtrackClassificationSummary: Summary<
    'zero-support-backtrack-trace-classification-pass',
    'zero-support-backtrack-trace-erased' | 'zero-support-backtrack-falsely-promoted-to-route' | 'zero-support-backtrack-falsely-promoted-to-loop'
  >;
  cycleClassificationRows: CycleClassificationRow[];
  cycleClassificationSummary: Summary<
    'zero-support-cycle-trace-classification-pass',
    | 'zero-support-cycle-trace-erased'
    | 'zero-support-cycle-falsely-promoted-to-loop'
    | 'zero-support-cycle-falsely-promoted-to-vortex'
    | 'zero-support-cycle-falsely-promoted-to-circulation'
    | 'zero-support-cycle-falsely-promoted-to-route'
  >;
  structuralInvalidityClassificationRows: StructuralInvalidityClassificationRow[];
  structuralInvalidityClassificationSummary: Summary<
    'structurally-invalid-trace-classification-pass',
    | 'scalar-trace-falsely-admitted'
    | 'sector-collapsed-trace-falsely-admitted'
    | 'trace-order-collapse-falsely-admitted'
    | 'site-address-duplication-falsely-admitted'
    | 'six-site-address-trace-model-falsely-admitted'
  >;
  classificationPrecedenceRows: ClassificationPrecedenceRow[];
  classificationPrecedenceSummary: Summary<'trace-classification-precedence-pass', 'trace-classification-precedence-failed'>;
  traceSupportIdentityBoundaryRows: TraceSupportIdentityBoundaryRow[];
  traceSupportIdentityBoundarySummary: Summary<
    'trace-classification-independent-from-support-projection',
    'trace-classification-collapsed-into-support-projection'
  >;
  complementAxisIdentityRows: ComplementAxisIdentityRow[];
  complementAxisIdentitySummary: ComplementAxisIdentitySummary;
  rowOrderShuffleClassificationRows: RowOrderShuffleClassificationRow[];
  rowOrderShuffleClassificationSummary: Summary<'row-order-shuffle-classification-pass', 'row-order-dependence-detected'>;
  antiRouteLanguageBoundaryRows: AntiRouteLanguageBoundaryRow[];
  antiRouteLanguageBoundarySummary: Summary<'trace-admissibility-anti-route-boundary-pass', 'trace-admissibility-anti-route-boundary-failed'>;
  controlRows: ControlRow[];
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  finalVerdict: T28S10FinalVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

const METHOD = 'p-simplex-trace-admissibility-classifier-audit-t28s10';
const EXPERIMENT_NAME = 'T28-S-Lab-10 - Trace Admissibility Classifier Audit';
const DIAGNOSTIC_SCOPE = 'trace-admissibility-classifier-audit-only';
const BRANCH_REF = 't28s/gate-transition-applied-chain';
const BASELINE_REF = 't28s/gate-transition-applied-chain';
const EPSILON = 1e-9;

const BODY_IDS = ['GateBody_AB/CD', 'GateBody_AC/BD', 'GateBody_AD/BC'] as const satisfies readonly GateBodyId[];
const PRIMARY_CLASSES = [
  'direct-transition-trace',
  'open-composable-trace',
  'non-composable-token-sequence',
  'zero-support-backtrack-trace',
  'zero-support-cycle-trace',
  'invalid-scalar-trace',
  'invalid-sector-collapsed-trace',
  'invalid-trace-order-collapse',
  'invalid-site-address-duplication',
] as const satisfies readonly PrimaryAdmissibilityClass[];
const ADMISSIBILITY_BANDS = ['structurally-invalid', 'trace-valid-passage-inadmissible', 'passage-precondition-admissible'] as const satisfies readonly AdmissibilityBand[];
const ANTI_ROUTE_BOUNDARY_IDS = [
  'not-route',
  'not-route-candidate',
  'not-path',
  'not-corridor',
  'not-gate-network',
  'not-field-world-passage',
  'not-topological-passage',
  'not-blockage',
  'not-loop',
  'not-vortex',
  'not-circulation',
  'not-runtime',
  'not-ui',
  'not-packet-writing',
  'not-shape-mutation',
] as const;
const REQUIRED_BOUNDARY_IDS = [
  'not-route',
  'not-route-candidate',
  'not-path',
  'not-corridor',
  'not-gate-network',
  'not-field-world-passage',
  'not-topological-passage',
  'not-blockage',
  'not-loop',
  'not-vortex',
  'not-circulation',
  'not-mature-gate',
  'not-mature-support',
  'not-field-world-inhabitant',
  'not-resonance',
  'not-phase-behavior',
  'not-damping',
  'not-attenuation',
  'not-semantic-naming',
  'not-fieldcue',
  'not-runtime',
  'not-ui',
  'not-packet-writing',
  'not-shape-mutation',
  'not-scalar-source-law',
  'not-norm-first',
  'not-arbitrary-projection',
  'not-sector-collapse',
  'not-trace-order-collapse',
  'not-site-address-double-counting',
  'not-support-projection-only-classifier',
] as const;
const REQUIRED_CONTROL_IDS = ['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11'] as const;
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
  'F19',
  'F20',
] as const;

export function buildPSimplexTraceAdmissibilityClassifierAuditT28S10Report(): PSimplexTraceAdmissibilityClassifierAuditT28S10Report {
  const lab9Report = buildPSimplexTraceRetentionSupportProjectionCompatibilityAuditT28S9Report();
  const lab8Report = buildPSimplexOrderedPairTransitionAntiRouteAuditT28S8Report();
  const traceTokens = buildTraceTokens(lab9Report.traceTokenConstructionRows);
  const tokenById = new Map(traceTokens.map((token) => [token.tokenId, token]));
  const tokenByOrderedPairId = new Map(traceTokens.map((token) => [token.orderedPairId, token]));
  const zeroSupportProjection = buildZeroSupportProjection(traceTokens);
  const classifier = (trace: TraceAdmissibilityInput) => classifyTraceAdmissibility(trace, tokenById, zeroSupportProjection);

  const parentEvidenceRows = buildParentEvidenceRows(lab9Report, lab8Report);
  const classifierSetupRows = buildClassifierSetupRows(classifier, tokenByOrderedPairId, lab9Report, lab8Report);
  const classifierSetupSummary = summarizeRows(classifierSetupRows, 'classifier-setup-pass', 'classifier-setup-fail', 'trace-admissibility-classifier-ready', 'trace-admissibility-classifier-failed');
  const directTransitionClassificationRows = buildDirectTransitionClassificationRows(classifier, traceTokens);
  const directTransitionClassificationSummary = summarizeRows(
    directTransitionClassificationRows,
    'direct-transition-trace-classification-pass',
    'direct-transition-trace-classification-failed',
  );
  const openComposableClassificationRows = buildOpenComposableClassificationRows(classifier, tokenByOrderedPairId);
  const openComposableClassificationSummary = buildOpenComposableClassificationSummary(openComposableClassificationRows);
  const projectionEquivalentRelationRows = buildProjectionEquivalentRelationRows(classifier, tokenById, tokenByOrderedPairId);
  const projectionEquivalentRelationSummary = summarizeRows(
    projectionEquivalentRelationRows,
    'projection-equivalent-trace-relation-pass',
    'projection-equivalent-traces-falsely-identified',
  );
  const nonComposableClassificationRows = buildNonComposableClassificationRows(classifier, tokenByOrderedPairId);
  const nonComposableClassificationSummary = buildNonComposableClassificationSummary(nonComposableClassificationRows);
  const backtrackClassificationRows = buildBacktrackClassificationRows(classifier, tokenByOrderedPairId, zeroSupportProjection);
  const backtrackClassificationSummary = buildBacktrackClassificationSummary(backtrackClassificationRows);
  const cycleClassificationRows = buildCycleClassificationRows(classifier, tokenByOrderedPairId, zeroSupportProjection);
  const cycleClassificationSummary = buildCycleClassificationSummary(cycleClassificationRows);
  const structuralInvalidityClassificationRows = buildStructuralInvalidityClassificationRows(classifier);
  const structuralInvalidityClassificationSummary = buildStructuralInvalidityClassificationSummary(structuralInvalidityClassificationRows);
  const classificationPrecedenceRows = buildClassificationPrecedenceRows(classifier, tokenByOrderedPairId);
  const classificationPrecedenceSummary = summarizeRows(classificationPrecedenceRows, 'trace-classification-precedence-pass', 'trace-classification-precedence-failed');
  const traceSupportIdentityBoundaryRows = buildTraceSupportIdentityBoundaryRows(classifier, tokenById, tokenByOrderedPairId);
  const traceSupportIdentityBoundarySummary = summarizeRows(
    traceSupportIdentityBoundaryRows,
    'trace-classification-independent-from-support-projection',
    'trace-classification-collapsed-into-support-projection',
  );
  const complementAxisIdentityRows = buildComplementAxisIdentityRows(lab9Report.complementAxisTraceIdentityRows);
  const complementAxisIdentitySummary = buildComplementAxisIdentitySummary(complementAxisIdentityRows, structuralInvalidityClassificationRows, lab9Report);
  const rowOrderShuffleClassificationRows = buildRowOrderShuffleClassificationRows(classifier, tokenById, tokenByOrderedPairId, lab9Report);
  const rowOrderShuffleClassificationSummary = summarizeRows(rowOrderShuffleClassificationRows, 'row-order-shuffle-classification-pass', 'row-order-dependence-detected');
  const antiRouteLanguageBoundaryRows = buildAntiRouteLanguageBoundaryRows();
  const antiRouteLanguageBoundarySummary = summarizeRows(
    antiRouteLanguageBoundaryRows,
    'trace-admissibility-anti-route-boundary-pass',
    'trace-admissibility-anti-route-boundary-failed',
  );
  const allClassifications = collectClassifications({
    classifier,
    tokenByOrderedPairId,
    traceTokens,
  });
  const controlRows = buildControlRows({
    directTransitionClassificationSummary,
    openComposableClassificationSummary,
    projectionEquivalentRelationSummary,
    nonComposableClassificationSummary,
    backtrackClassificationSummary,
    cycleClassificationSummary,
    structuralInvalidityClassificationRows,
    structuralInvalidityClassificationSummary,
    rowOrderShuffleClassificationSummary,
    antiRouteLanguageBoundarySummary,
  });
  const boundaryRows = buildBoundaryRows();
  const falsifierRows = buildFalsifierRows({
    lab9Report,
    classifierSetupSummary,
    allClassifications,
    directTransitionClassificationSummary,
    openComposableClassificationSummary,
    projectionEquivalentRelationSummary,
    nonComposableClassificationSummary,
    backtrackClassificationSummary,
    cycleClassificationSummary,
    structuralInvalidityClassificationSummary,
    classificationPrecedenceSummary,
    traceSupportIdentityBoundarySummary,
    complementAxisIdentitySummary,
    rowOrderShuffleClassificationSummary,
    antiRouteLanguageBoundarySummary,
    controlRows,
  });
  const finalVerdict = classifyFinalVerdict({
    lab9Report,
    classifierSetupSummary,
    directTransitionClassificationSummary,
    openComposableClassificationSummary,
    projectionEquivalentRelationSummary,
    nonComposableClassificationSummary,
    backtrackClassificationSummary,
    cycleClassificationSummary,
    structuralInvalidityClassificationSummary,
    classificationPrecedenceSummary,
    traceSupportIdentityBoundarySummary,
    complementAxisIdentitySummary,
    antiRouteLanguageBoundarySummary,
    boundaryRows,
    falsifierRows,
  });
  const integrityIssues = buildIntegrityIssues({
    lab9Report,
    classifierSetupRows,
    classifierSetupSummary,
    allClassifications,
    directTransitionClassificationRows,
    directTransitionClassificationSummary,
    openComposableClassificationRows,
    openComposableClassificationSummary,
    projectionEquivalentRelationRows,
    projectionEquivalentRelationSummary,
    nonComposableClassificationRows,
    nonComposableClassificationSummary,
    backtrackClassificationRows,
    backtrackClassificationSummary,
    cycleClassificationRows,
    cycleClassificationSummary,
    structuralInvalidityClassificationRows,
    structuralInvalidityClassificationSummary,
    classificationPrecedenceRows,
    classificationPrecedenceSummary,
    traceSupportIdentityBoundaryRows,
    traceSupportIdentityBoundarySummary,
    complementAxisIdentityRows,
    complementAxisIdentitySummary,
    rowOrderShuffleClassificationRows,
    rowOrderShuffleClassificationSummary,
    antiRouteLanguageBoundaryRows,
    antiRouteLanguageBoundarySummary,
    controlRows,
    boundaryRows,
    falsifierRows,
    finalVerdict,
  });
  const integrityIssueCount = integrityIssues.length;
  const ok =
    integrityIssues.length === 0 &&
    integrityIssueCount === 0 &&
    falsifierRows.every((row) => !row.triggered) &&
    finalVerdict === 'T28-S-Lab-10-trace-admissibility-classifier-pass';

  return {
    method: METHOD,
    experimentName: EXPERIMENT_NAME,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    baselineRef: BASELINE_REF,
    parentEvidenceRows,
    classifierSetupRows,
    classifierSetupSummary,
    directTransitionClassificationRows,
    directTransitionClassificationSummary,
    openComposableClassificationRows,
    openComposableClassificationSummary,
    projectionEquivalentRelationRows,
    projectionEquivalentRelationSummary,
    nonComposableClassificationRows,
    nonComposableClassificationSummary,
    backtrackClassificationRows,
    backtrackClassificationSummary,
    cycleClassificationRows,
    cycleClassificationSummary,
    structuralInvalidityClassificationRows,
    structuralInvalidityClassificationSummary,
    classificationPrecedenceRows,
    classificationPrecedenceSummary,
    traceSupportIdentityBoundaryRows,
    traceSupportIdentityBoundarySummary,
    complementAxisIdentityRows,
    complementAxisIdentitySummary,
    rowOrderShuffleClassificationRows,
    rowOrderShuffleClassificationSummary,
    antiRouteLanguageBoundaryRows,
    antiRouteLanguageBoundarySummary,
    controlRows,
    boundaryRows,
    falsifierRows,
    finalVerdict,
    integrityIssues,
    integrityIssueCount,
    ok,
  };
}

function classifyTraceAdmissibility(
  trace: TraceAdmissibilityInput,
  tokenById: Map<string, TraceToken>,
  zeroSupportProjection: SupportProjection,
): TraceAdmissibilityClassification {
  if (trace.kind === 'structural-invalidity') {
    return {
      traceId: trace.traceId,
      tokenCount: 0,
      bodySequence: [],
      entryBodyId: null,
      exitBodyId: null,
      retainedIntermediateBodies: [],
      projectionErasedBodies: [],
      supportProjection: cleanSupportProjection(zeroSupportProjection),
      zeroSupportStatus: 'zero-support',
      composabilityStatus: 'structurally-invalid',
      primaryAdmissibilityClass: trace.expectedPrimaryClass,
      primaryClassAssignmentCount: 1,
      admissibilityBand: 'structurally-invalid',
      admissibilityBandAssignmentCount: 1,
      projectionEquivalentTraceIds: [],
      relationAnnotations: [],
      reason: trace.reason,
      routeMaturityStatus: 'not-route',
      status: 'structurally-invalid-trace-classified',
    };
  }

  const tokens = trace.tokenIds.map((tokenId) => requiredToken(tokenById, tokenId));
  const supportProjection = trace.supportProjectionOverride ?? supportProjectionForTokens(tokens);
  const cleanProjection = cleanSupportProjection(supportProjection);
  const zeroSupportStatus = compareSupportProjection(supportProjection, zeroSupportProjection) <= EPSILON ? 'zero-support' : 'nonzero-support';
  const bodySequence = bodySequenceForTokens(tokens);
  const composabilityStatus: ComposabilityStatus = isComposable(tokens) ? 'composable' : 'non-composable';
  const relationAnnotations = trace.projectionEquivalentTraceIds?.length ? ['projection-equivalent-trace-distinct' as const] : [];
  const projectionEquivalentTraceIds = trace.projectionEquivalentTraceIds ?? [];

  if (composabilityStatus === 'non-composable') {
    return classificationResult({
      trace,
      tokens,
      bodySequence,
      supportProjection: cleanProjection,
      zeroSupportStatus,
      composabilityStatus,
      primaryAdmissibilityClass: 'non-composable-token-sequence',
      admissibilityBand: 'trace-valid-passage-inadmissible',
      projectionEquivalentTraceIds,
      relationAnnotations,
      reason: 'adjacent trace tokens do not hand off by target/source body identity',
      status: 'non-composable-token-sequence-classified',
    });
  }

  if (tokens.length === 2 && zeroSupportStatus === 'zero-support' && bodySequence.length === 3 && bodySequence[0] === bodySequence[2]) {
    return classificationResult({
      trace,
      tokens,
      bodySequence,
      supportProjection: cleanProjection,
      zeroSupportStatus,
      composabilityStatus,
      primaryAdmissibilityClass: 'zero-support-backtrack-trace',
      admissibilityBand: 'trace-valid-passage-inadmissible',
      projectionEquivalentTraceIds,
      relationAnnotations,
      reason: 'retained two-token backtrack has zero support projection',
      status: 'zero-support-backtrack-trace-classified',
      loopMaturityStatus: 'not-loop',
    });
  }

  if (tokens.length === 3 && zeroSupportStatus === 'zero-support' && bodySequence.length === 4 && bodySequence[0] === bodySequence[3]) {
    return classificationResult({
      trace,
      tokens,
      bodySequence,
      supportProjection: cleanProjection,
      zeroSupportStatus,
      composabilityStatus,
      primaryAdmissibilityClass: 'zero-support-cycle-trace',
      admissibilityBand: 'trace-valid-passage-inadmissible',
      projectionEquivalentTraceIds,
      relationAnnotations,
      reason: 'retained three-token cycle has zero support projection',
      status: 'zero-support-cycle-trace-classified',
      loopMaturityStatus: 'not-loop',
      vortexMaturityStatus: 'not-vortex',
      circulationMaturityStatus: 'not-circulation',
    });
  }

  if (tokens.length === 1) {
    return classificationResult({
      trace,
      tokens,
      bodySequence,
      supportProjection: cleanProjection,
      zeroSupportStatus,
      composabilityStatus,
      primaryAdmissibilityClass: 'direct-transition-trace',
      admissibilityBand: 'passage-precondition-admissible',
      projectionEquivalentTraceIds,
      relationAnnotations,
      reason: 'single retained ordered transition token',
      status: 'direct-transition-trace-classified',
    });
  }

  if (tokens.length > 1 && composabilityStatus === 'composable' && zeroSupportStatus === 'nonzero-support') {
    return classificationResult({
      trace,
      tokens,
      bodySequence,
      supportProjection: cleanProjection,
      zeroSupportStatus,
      composabilityStatus,
      primaryAdmissibilityClass: 'open-composable-trace',
      admissibilityBand: 'passage-precondition-admissible',
      projectionEquivalentTraceIds,
      relationAnnotations,
      reason: 'retained ordered tokens compose with nonzero telescoped support',
      status: 'open-composable-trace-classified',
    });
  }

  return classificationResult({
    trace,
    tokens,
    bodySequence,
    supportProjection: cleanProjection,
    zeroSupportStatus,
    composabilityStatus,
    primaryAdmissibilityClass: 'non-composable-token-sequence',
    admissibilityBand: 'trace-valid-passage-inadmissible',
    projectionEquivalentTraceIds,
    relationAnnotations,
    reason: 'retained trace does not satisfy direct/open/zero-support class guards',
    status: 'non-composable-token-sequence-classified',
  });
}

function classificationResult(args: {
  trace: TraceLedger;
  tokens: readonly TraceToken[];
  bodySequence: GateBodyId[];
  supportProjection: SupportProjection;
  zeroSupportStatus: ZeroSupportStatus;
  composabilityStatus: ComposabilityStatus;
  primaryAdmissibilityClass: PrimaryAdmissibilityClass;
  admissibilityBand: AdmissibilityBand;
  projectionEquivalentTraceIds: string[];
  relationAnnotations: RelationAnnotation[];
  reason: string;
  status: string;
  loopMaturityStatus?: 'not-loop';
  vortexMaturityStatus?: 'not-vortex';
  circulationMaturityStatus?: 'not-circulation';
}): TraceAdmissibilityClassification {
  const retainedIntermediateBodies = args.composabilityStatus === 'composable' && args.tokens.length > 1 ? args.bodySequence.slice(1, -1) : [];
  const projectionErasedBodies = args.primaryAdmissibilityClass === 'open-composable-trace' ? retainedIntermediateBodies : [];
  return {
    traceId: args.trace.traceId,
    tokenCount: args.tokens.length,
    bodySequence: args.bodySequence,
    entryBodyId: args.bodySequence[0] ?? null,
    exitBodyId: args.bodySequence[args.bodySequence.length - 1] ?? null,
    retainedIntermediateBodies,
    projectionErasedBodies,
    supportProjection: args.supportProjection,
    zeroSupportStatus: args.zeroSupportStatus,
    composabilityStatus: args.composabilityStatus,
    primaryAdmissibilityClass: args.primaryAdmissibilityClass,
    primaryClassAssignmentCount: 1,
    admissibilityBand: args.admissibilityBand,
    admissibilityBandAssignmentCount: 1,
    projectionEquivalentTraceIds: args.projectionEquivalentTraceIds,
    relationAnnotations: args.relationAnnotations,
    reason: args.reason,
    routeMaturityStatus: 'not-route',
    loopMaturityStatus: args.loopMaturityStatus,
    vortexMaturityStatus: args.vortexMaturityStatus,
    circulationMaturityStatus: args.circulationMaturityStatus,
    status: args.status,
  };
}

function buildParentEvidenceRows(lab9Report: S9Report, lab8Report: S8Report): ParentEvidenceRow[] {
  return [
    {
      parentId: 'T28-S-Lab-9',
      method: lab9Report.method,
      ok: lab9Report.ok,
      finalVerdict: lab9Report.finalVerdict,
      integrityIssueCount: lab9Report.integrityIssueCount,
      consumedSections: [
        'traceTokenConstructionRows',
        'supportProjectionCompatibilityRows',
        'twoStepTraceRetentionRows',
        'projectionEquivalentTraceDistinctionRows',
        'composabilityClassificationRows',
        'backtrackTraceRetentionRows',
        'cycleTraceRetentionRows',
        'traceReversalRows',
        'traceIdentitySupportIdentityRows',
        'complementAxisTraceIdentityRows',
        'invalidityControlRows',
        'antiRouteLanguageBoundaryRows',
        'finalVerdict',
        'ok',
        'integrityIssueCount',
        'twoStepTraceRetentionSummary',
        'projectionEquivalentTraceDistinctionSummary',
        'composabilityClassificationSummary',
        'backtrackTraceRetentionSummary',
        'cycleTraceRetentionSummary',
        'traceIdentitySupportIdentitySummary',
        'antiRouteLanguageBoundarySummary',
      ],
      status: parentLab9Accepted(lab9Report) ? 'lab-9-parent-accepted' : 'lab-9-parent-not-accepted',
    },
    {
      parentId: 'T28-S-Lab-8 ordered-pair-preforms-secondary',
      method: lab8Report.method,
      ok: lab8Report.ok,
      finalVerdict: lab8Report.finalVerdict,
      integrityIssueCount: lab8Report.integrityIssueCount,
      consumedSections: ['orderedPairConstructionRows'],
      status: parentLab8Accepted(lab8Report) ? 'secondary-parent-consumed' : 'secondary-parent-not-accepted',
    },
    {
      parentId: 'T28-R context-only-not-authority',
      method: 'context-only-not-authority',
      ok: null,
      consumedSections: [],
      status: 'context-only',
    },
  ];
}

function buildClassifierSetupRows(
  classifier: (trace: TraceAdmissibilityInput) => TraceAdmissibilityClassification,
  tokenByOrderedPairId: Map<string, TraceToken>,
  lab9Report: S9Report,
  lab8Report: S8Report,
): ClassifierSetupRow[] {
  const [x, y] = BODY_IDS;
  const directLedger = traceLedger([requiredToken(tokenByOrderedPairId, orderedPairIdFor(x, y)).tokenId]);
  const firstResult = classifier(directLedger);
  const secondResult = classifier(directLedger);
  const deterministic = stableClassificationSignature(firstResult) === stableClassificationSignature(secondResult);
  return [
    setupRow('S0', 'deterministic-classifier-present', deterministic ? 'deterministic-classifier-present' : 'classifier-nondeterministic', deterministic),
    setupRow('S1', 'finite-primary-class-set-present', PRIMARY_CLASSES.length === 9 ? 'finite-primary-class-set-present' : 'finite-primary-class-set-missing', PRIMARY_CLASSES.length === 9),
    setupRow('S2', 'finite-admissibility-band-set-present', ADMISSIBILITY_BANDS.length === 3 ? 'finite-admissibility-band-set-present' : 'finite-admissibility-band-set-missing', ADMISSIBILITY_BANDS.length === 3),
    setupRow(
      'S3',
      'parent-token-preform-source-ready',
      lab9Report.traceTokenConstructionRows.length === 6 && lab8Report.orderedPairConstructionRows.length === 6
        ? 'parent-token-preform-source-ready'
        : 'parent-token-preform-source-missing',
      lab9Report.traceTokenConstructionRows.length === 6 && lab8Report.orderedPairConstructionRows.length === 6,
    ),
  ];
}

function setupRow(setupId: string, expectedStatus: string, observedStatus: string, deterministic: boolean): ClassifierSetupRow {
  return {
    setupId,
    expectedStatus,
    observedStatus,
    deterministic,
    status: expectedStatus === observedStatus && deterministic ? 'classifier-setup-pass' : 'classifier-setup-fail',
  };
}

function buildDirectTransitionClassificationRows(
  classifier: (trace: TraceAdmissibilityInput) => TraceAdmissibilityClassification,
  traceTokens: readonly TraceToken[],
): DirectTransitionClassificationRow[] {
  return traceTokens.map((token) => {
    const result = classifier(traceLedger([token.tokenId]));
    const maxError = compareSupportProjection(result.supportProjection, token.supportProjection);
    const pass =
      result.tokenCount === 1 &&
      result.primaryAdmissibilityClass === 'direct-transition-trace' &&
      result.admissibilityBand === 'passage-precondition-admissible' &&
      result.entryBodyId === token.sourceBodyId &&
      result.exitBodyId === token.targetBodyId &&
      result.retainedIntermediateBodies.length === 0 &&
      result.zeroSupportStatus === 'nonzero-support' &&
      result.routeMaturityStatus === 'not-route' &&
      maxError <= EPSILON;
    return {
      traceId: result.traceId,
      tokenIds: [token.tokenId],
      bodySequence: result.bodySequence,
      entryBodyId: result.entryBodyId,
      exitBodyId: result.exitBodyId,
      primaryAdmissibilityClass: result.primaryAdmissibilityClass,
      admissibilityBand: result.admissibilityBand,
      zeroSupportStatus: result.zeroSupportStatus,
      routeMaturityStatus: result.routeMaturityStatus,
      maxError: cleanNumber(maxError),
      status: pass ? 'direct-transition-trace-classification-pass' : 'direct-transition-trace-classification-failed',
    };
  });
}

function buildOpenComposableClassificationRows(
  classifier: (trace: TraceAdmissibilityInput) => TraceAdmissibilityClassification,
  tokenByOrderedPairId: Map<string, TraceToken>,
): OpenComposableClassificationRow[] {
  return distinctOrderedTriples().map(([source, intermediate, target]) => {
    const tokenIds = [tokenIdFor(source, intermediate), tokenIdFor(intermediate, target)];
    const result = classifier(traceLedger(tokenIds));
    const directProjection = requiredToken(tokenByOrderedPairId, orderedPairIdFor(source, target)).supportProjection;
    const maxError = compareSupportProjection(result.supportProjection, directProjection);
    const intermediateRetained = sameOrderedIds(result.retainedIntermediateBodies, [intermediate]);
    const pass =
      result.primaryAdmissibilityClass === 'open-composable-trace' &&
      result.admissibilityBand === 'passage-precondition-admissible' &&
      result.composabilityStatus === 'composable' &&
      result.entryBodyId === source &&
      result.exitBodyId === target &&
      intermediateRetained &&
      sameOrderedIds(result.projectionErasedBodies, [intermediate]) &&
      result.routeMaturityStatus === 'not-route' &&
      maxError <= EPSILON;
    const status = pass
      ? 'open-composable-trace-classification-pass'
      : result.routeMaturityStatus !== 'not-route'
        ? 'open-composable-trace-falsely-promoted-to-route'
        : !intermediateRetained
          ? 'intermediate-body-not-retained'
          : 'open-composable-trace-classification-failed';
    return {
      traceId: result.traceId,
      tokenIds,
      bodySequence: result.bodySequence,
      entryBodyId: result.entryBodyId,
      exitBodyId: result.exitBodyId,
      retainedIntermediateBodies: result.retainedIntermediateBodies,
      projectionErasedBodies: result.projectionErasedBodies,
      primaryAdmissibilityClass: result.primaryAdmissibilityClass,
      admissibilityBand: result.admissibilityBand,
      zeroSupportStatus: result.zeroSupportStatus,
      routeMaturityStatus: result.routeMaturityStatus,
      maxError: cleanNumber(maxError),
      status,
    };
  });
}

function buildOpenComposableClassificationSummary(rows: readonly OpenComposableClassificationRow[]) {
  const passCount = rows.filter((row) => row.status === 'open-composable-trace-classification-pass').length;
  const failStatus = rows.some((row) => row.status === 'open-composable-trace-falsely-promoted-to-route')
    ? 'open-composable-trace-falsely-promoted-to-route'
    : rows.some((row) => row.status === 'intermediate-body-not-retained')
      ? 'intermediate-body-not-retained'
      : 'open-composable-trace-classification-failed';
  return summaryWithStatus(rows, passCount, 'open-composable-trace-classification-pass', failStatus);
}

function buildProjectionEquivalentRelationRows(
  classifier: (trace: TraceAdmissibilityInput) => TraceAdmissibilityClassification,
  tokenById: Map<string, TraceToken>,
  tokenByOrderedPairId: Map<string, TraceToken>,
): ProjectionEquivalentRelationRow[] {
  return distinctOrderedTriples().map(([source, intermediate, target]) => {
    const traceATokenIds = [tokenIdFor(source, intermediate), tokenIdFor(intermediate, target)];
    const traceBTokenIds = [requiredToken(tokenByOrderedPairId, orderedPairIdFor(source, target)).tokenId];
    const traceAId = traceIdFor(traceATokenIds);
    const traceBId = traceIdFor(traceBTokenIds);
    const traceA = classifier(traceLedger(traceATokenIds, { projectionEquivalentTraceIds: [traceBId] }));
    const traceB = classifier(traceLedger(traceBTokenIds, { projectionEquivalentTraceIds: [traceAId] }));
    const maxError = compareSupportProjection(
      supportProjectionForTokenIds(traceATokenIds, tokenById),
      supportProjectionForTokenIds(traceBTokenIds, tokenById),
    );
    const supportProjectionEqual = maxError <= EPSILON;
    const traceIdentityEqual = traceIdentity(traceATokenIds) === traceIdentity(traceBTokenIds);
    const relationAnnotation = traceA.relationAnnotations.includes('projection-equivalent-trace-distinct')
      ? 'projection-equivalent-trace-distinct'
      : 'none';
    const annotationIsPrimaryClass = relationAnnotation !== 'none' && isPrimaryAdmissibilityClass(relationAnnotation);
    const pass =
      supportProjectionEqual &&
      !traceIdentityEqual &&
      traceA.primaryAdmissibilityClass === 'open-composable-trace' &&
      traceB.primaryAdmissibilityClass === 'direct-transition-trace' &&
      relationAnnotation === 'projection-equivalent-trace-distinct' &&
      !annotationIsPrimaryClass;
    return {
      comparisonId: `projection-equivalent:${source}->${intermediate}->${target}`,
      traceAId,
      traceBId,
      traceATokenIds,
      traceBTokenIds,
      supportProjectionEqual,
      traceIdentityEqual,
      traceAPrimaryClass: traceA.primaryAdmissibilityClass,
      traceBPrimaryClass: traceB.primaryAdmissibilityClass,
      relationAnnotation,
      annotationIsPrimaryClass,
      maxError: cleanNumber(maxError),
      status: pass ? 'projection-equivalent-trace-relation-pass' : 'projection-equivalent-traces-falsely-identified',
    };
  });
}

function buildNonComposableClassificationRows(
  classifier: (trace: TraceAdmissibilityInput) => TraceAdmissibilityClassification,
  tokenByOrderedPairId: Map<string, TraceToken>,
): NonComposableClassificationRow[] {
  return distinctOrderedTriples().map(([source, target, nonHandoffSource]) => {
    const tokenIds = [
      requiredToken(tokenByOrderedPairId, orderedPairIdFor(source, target)).tokenId,
      requiredToken(tokenByOrderedPairId, orderedPairIdFor(nonHandoffSource, source)).tokenId,
    ];
    const result = classifier(traceLedger(tokenIds));
    const pass =
      result.primaryAdmissibilityClass === 'non-composable-token-sequence' &&
      result.admissibilityBand === 'trace-valid-passage-inadmissible' &&
      result.composabilityStatus === 'non-composable' &&
      result.routeMaturityStatus === 'not-route';
    const status = pass
      ? 'non-composable-token-sequence-classification-pass'
      : result.routeMaturityStatus !== 'not-route'
        ? 'non-composable-sequence-falsely-promoted-to-route'
        : 'non-composable-token-sequence-falsely-admissible';
    return {
      traceId: result.traceId,
      tokenIds,
      bodySequence: result.bodySequence,
      composabilityStatus: result.composabilityStatus,
      primaryAdmissibilityClass: result.primaryAdmissibilityClass,
      admissibilityBand: result.admissibilityBand,
      routeMaturityStatus: result.routeMaturityStatus,
      status,
    };
  });
}

function buildNonComposableClassificationSummary(rows: readonly NonComposableClassificationRow[]) {
  const passCount = rows.filter((row) => row.status === 'non-composable-token-sequence-classification-pass').length;
  const failStatus = rows.some((row) => row.status === 'non-composable-sequence-falsely-promoted-to-route')
    ? 'non-composable-sequence-falsely-promoted-to-route'
    : 'non-composable-token-sequence-falsely-admissible';
  return summaryWithStatus(rows, passCount, 'non-composable-token-sequence-classification-pass', failStatus);
}

function buildBacktrackClassificationRows(
  classifier: (trace: TraceAdmissibilityInput) => TraceAdmissibilityClassification,
  tokenByOrderedPairId: Map<string, TraceToken>,
  zeroSupportProjection: SupportProjection,
): BacktrackClassificationRow[] {
  return BODY_IDS.flatMap((source) =>
    BODY_IDS.filter((target) => target !== source).map((target) => {
      const tokenIds = [
        requiredToken(tokenByOrderedPairId, orderedPairIdFor(source, target)).tokenId,
        requiredToken(tokenByOrderedPairId, orderedPairIdFor(target, source)).tokenId,
      ];
      const result = classifier(traceLedger(tokenIds));
      const maxError = compareSupportProjection(result.supportProjection, zeroSupportProjection);
      const traceRetained = tokenIds.length === 2;
      const pass =
        traceRetained &&
        result.primaryAdmissibilityClass === 'zero-support-backtrack-trace' &&
        result.admissibilityBand === 'trace-valid-passage-inadmissible' &&
        result.zeroSupportStatus === 'zero-support' &&
        sameOrderedIds(result.bodySequence, [source, target, source]) &&
        result.routeMaturityStatus === 'not-route' &&
        result.loopMaturityStatus === 'not-loop' &&
        maxError <= EPSILON;
      const status = pass
        ? 'zero-support-backtrack-trace-classification-pass'
        : !traceRetained || result.zeroSupportStatus !== 'zero-support'
          ? 'zero-support-backtrack-trace-erased'
          : result.routeMaturityStatus !== 'not-route'
            ? 'zero-support-backtrack-falsely-promoted-to-route'
            : 'zero-support-backtrack-falsely-promoted-to-loop';
      return {
        traceId: result.traceId,
        tokenIds,
        bodySequence: result.bodySequence,
        traceRetained,
        primaryAdmissibilityClass: result.primaryAdmissibilityClass,
        admissibilityBand: result.admissibilityBand,
        zeroSupportStatus: result.zeroSupportStatus,
        routeMaturityStatus: result.routeMaturityStatus,
        loopMaturityStatus: result.loopMaturityStatus ?? 'not-loop',
        maxError: cleanNumber(maxError),
        status,
      };
    }),
  );
}

function buildBacktrackClassificationSummary(rows: readonly BacktrackClassificationRow[]) {
  const passCount = rows.filter((row) => row.status === 'zero-support-backtrack-trace-classification-pass').length;
  const failStatus = rows.some((row) => row.status === 'zero-support-backtrack-falsely-promoted-to-route')
    ? 'zero-support-backtrack-falsely-promoted-to-route'
    : rows.some((row) => row.status === 'zero-support-backtrack-falsely-promoted-to-loop')
      ? 'zero-support-backtrack-falsely-promoted-to-loop'
      : 'zero-support-backtrack-trace-erased';
  return summaryWithStatus(rows, passCount, 'zero-support-backtrack-trace-classification-pass', failStatus);
}

function buildCycleClassificationRows(
  classifier: (trace: TraceAdmissibilityInput) => TraceAdmissibilityClassification,
  tokenByOrderedPairId: Map<string, TraceToken>,
  zeroSupportProjection: SupportProjection,
): CycleClassificationRow[] {
  return distinctOrderedTriples().map(([source, intermediate, target]) => {
    const tokenIds = [
      requiredToken(tokenByOrderedPairId, orderedPairIdFor(source, intermediate)).tokenId,
      requiredToken(tokenByOrderedPairId, orderedPairIdFor(intermediate, target)).tokenId,
      requiredToken(tokenByOrderedPairId, orderedPairIdFor(target, source)).tokenId,
    ];
    const result = classifier(traceLedger(tokenIds));
    const maxError = compareSupportProjection(result.supportProjection, zeroSupportProjection);
    const traceRetained = tokenIds.length === 3;
    const pass =
      traceRetained &&
      result.primaryAdmissibilityClass === 'zero-support-cycle-trace' &&
      result.admissibilityBand === 'trace-valid-passage-inadmissible' &&
      result.zeroSupportStatus === 'zero-support' &&
      sameOrderedIds(result.bodySequence, [source, intermediate, target, source]) &&
      result.routeMaturityStatus === 'not-route' &&
      result.loopMaturityStatus === 'not-loop' &&
      result.vortexMaturityStatus === 'not-vortex' &&
      result.circulationMaturityStatus === 'not-circulation' &&
      maxError <= EPSILON;
    const status = pass
      ? 'zero-support-cycle-trace-classification-pass'
      : !traceRetained || result.zeroSupportStatus !== 'zero-support'
        ? 'zero-support-cycle-trace-erased'
        : result.loopMaturityStatus !== 'not-loop'
          ? 'zero-support-cycle-falsely-promoted-to-loop'
          : result.vortexMaturityStatus !== 'not-vortex'
            ? 'zero-support-cycle-falsely-promoted-to-vortex'
            : result.circulationMaturityStatus !== 'not-circulation'
              ? 'zero-support-cycle-falsely-promoted-to-circulation'
              : 'zero-support-cycle-falsely-promoted-to-route';
    return {
      traceId: result.traceId,
      tokenIds,
      bodySequence: result.bodySequence,
      traceRetained,
      primaryAdmissibilityClass: result.primaryAdmissibilityClass,
      admissibilityBand: result.admissibilityBand,
      zeroSupportStatus: result.zeroSupportStatus,
      routeMaturityStatus: result.routeMaturityStatus,
      loopMaturityStatus: result.loopMaturityStatus ?? 'not-loop',
      vortexMaturityStatus: result.vortexMaturityStatus ?? 'not-vortex',
      circulationMaturityStatus: result.circulationMaturityStatus ?? 'not-circulation',
      maxError: cleanNumber(maxError),
      status,
    };
  });
}

function buildCycleClassificationSummary(rows: readonly CycleClassificationRow[]) {
  const passCount = rows.filter((row) => row.status === 'zero-support-cycle-trace-classification-pass').length;
  const failStatus = rows.some((row) => row.status === 'zero-support-cycle-falsely-promoted-to-route')
    ? 'zero-support-cycle-falsely-promoted-to-route'
    : rows.some((row) => row.status === 'zero-support-cycle-falsely-promoted-to-circulation')
      ? 'zero-support-cycle-falsely-promoted-to-circulation'
      : rows.some((row) => row.status === 'zero-support-cycle-falsely-promoted-to-vortex')
        ? 'zero-support-cycle-falsely-promoted-to-vortex'
        : rows.some((row) => row.status === 'zero-support-cycle-falsely-promoted-to-loop')
          ? 'zero-support-cycle-falsely-promoted-to-loop'
          : 'zero-support-cycle-trace-erased';
  return summaryWithStatus(rows, passCount, 'zero-support-cycle-trace-classification-pass', failStatus);
}

function buildStructuralInvalidityClassificationRows(
  classifier: (trace: TraceAdmissibilityInput) => TraceAdmissibilityClassification,
): StructuralInvalidityClassificationRow[] {
  return structuralInvalidTraceAttempts().map((attempt) => {
    const result = classifier(attempt);
    const pass = result.primaryAdmissibilityClass === attempt.expectedPrimaryClass && result.admissibilityBand === 'structurally-invalid';
    return {
      invalidCaseId: attempt.invalidCaseId,
      invalidityKind: attempt.invalidityKind,
      expectedPrimaryClass: attempt.expectedPrimaryClass,
      observedPrimaryClass: result.primaryAdmissibilityClass,
      expectedAdmissibilityBand: 'structurally-invalid',
      observedAdmissibilityBand: result.admissibilityBand,
      status: pass ? 'structurally-invalid-trace-classification-pass' : structuralInvalidityFailureStatus(attempt.invalidityKind),
    };
  });
}

function buildStructuralInvalidityClassificationSummary(rows: readonly StructuralInvalidityClassificationRow[]) {
  const passCount = rows.filter((row) => row.status === 'structurally-invalid-trace-classification-pass').length;
  const failedRow = rows.find((row) => row.status !== 'structurally-invalid-trace-classification-pass');
  const failStatus = failedRow ? structuralInvalidityFailureStatus(failedRow.invalidityKind) : 'scalar-trace-falsely-admitted';
  return summaryWithStatus(rows, passCount, 'structurally-invalid-trace-classification-pass', failStatus);
}

function buildClassificationPrecedenceRows(
  classifier: (trace: TraceAdmissibilityInput) => TraceAdmissibilityClassification,
  tokenByOrderedPairId: Map<string, TraceToken>,
): ClassificationPrecedenceRow[] {
  const [x, y, z] = BODY_IDS;
  const structural = classifier(structuralInvalidTraceAttempts()[0]);
  const nonComposable = classifier(traceLedger([tokenIdFor(x, y), tokenIdFor(z, x)]));
  const backtrack = classifier(traceLedger([tokenIdFor(x, y), tokenIdFor(y, x)]));
  const cycle = classifier(traceLedger([tokenIdFor(x, y), tokenIdFor(y, z), tokenIdFor(z, x)]));
  const direct = classifier(traceLedger([requiredToken(tokenByOrderedPairId, orderedPairIdFor(x, y)).tokenId]));
  const twoStepTraceId = traceIdFor([tokenIdFor(x, y), tokenIdFor(y, z)]);
  const directTraceId = traceIdFor([tokenIdFor(x, z)]);
  const projectionEquivalent = classifier(traceLedger([tokenIdFor(x, y), tokenIdFor(y, z)], { projectionEquivalentTraceIds: [directTraceId] }));
  return [
    precedenceRow('P0', 'structural-invalidity-before-valid-trace-class', structural, structural.primaryAdmissibilityClass === 'invalid-scalar-trace'),
    precedenceRow('P1', 'non-composable-before-open-composable-trace', nonComposable, nonComposable.primaryAdmissibilityClass === 'non-composable-token-sequence'),
    precedenceRow('P2', 'zero-support-backtrack-before-open-composable-trace', backtrack, backtrack.primaryAdmissibilityClass === 'zero-support-backtrack-trace'),
    precedenceRow('P3', 'zero-support-cycle-before-open-composable-trace', cycle, cycle.primaryAdmissibilityClass === 'zero-support-cycle-trace'),
    precedenceRow('P4', 'direct-transition-when-token-count-is-one', direct, direct.primaryAdmissibilityClass === 'direct-transition-trace' && direct.tokenCount === 1),
    precedenceRow(
      'P5',
      `projection-equivalent-relation-annotation-not-primary:${twoStepTraceId}`,
      projectionEquivalent,
      projectionEquivalent.primaryAdmissibilityClass === 'open-composable-trace' &&
        projectionEquivalent.relationAnnotations.includes('projection-equivalent-trace-distinct') &&
        !isPrimaryAdmissibilityClass('projection-equivalent-trace-distinct'),
    ),
  ];
}

function precedenceRow(precedenceId: string, expectedStatus: string, result: TraceAdmissibilityClassification, pass: boolean): ClassificationPrecedenceRow {
  return {
    precedenceId,
    expectedStatus,
    observedStatus: pass ? expectedStatus : result.status,
    primaryAdmissibilityClass: result.primaryAdmissibilityClass,
    admissibilityBand: result.admissibilityBand,
    status: pass ? 'trace-classification-precedence-pass' : 'trace-classification-precedence-failed',
  };
}

function buildTraceSupportIdentityBoundaryRows(
  classifier: (trace: TraceAdmissibilityInput) => TraceAdmissibilityClassification,
  tokenById: Map<string, TraceToken>,
  tokenByOrderedPairId: Map<string, TraceToken>,
): TraceSupportIdentityBoundaryRow[] {
  const [x, y, z] = BODY_IDS;
  const singleXY = [requiredToken(tokenByOrderedPairId, orderedPairIdFor(x, y)).tokenId];
  const twoStepXYZ = [tokenIdFor(x, y), tokenIdFor(y, z)];
  const directXZ = [requiredToken(tokenByOrderedPairId, orderedPairIdFor(x, z)).tokenId];
  const singleYZ = [requiredToken(tokenByOrderedPairId, orderedPairIdFor(y, z)).tokenId];
  return [
    traceSupportIdentityBoundaryRow('sameTraceSameProjection', singleXY, singleXY, true, true, classifier, tokenById),
    traceSupportIdentityBoundaryRow('differentTraceSameProjection', twoStepXYZ, directXZ, false, true, classifier, tokenById),
    traceSupportIdentityBoundaryRow('differentTraceDifferentProjection', singleXY, singleYZ, false, false, classifier, tokenById),
  ];
}

function traceSupportIdentityBoundaryRow(
  relationId: TraceSupportIdentityBoundaryRow['relationId'],
  leftTokenIds: string[],
  rightTokenIds: string[],
  expectedTraceIdentityEqual: boolean,
  expectedSupportProjectionEqual: boolean,
  classifier: (trace: TraceAdmissibilityInput) => TraceAdmissibilityClassification,
  tokenById: Map<string, TraceToken>,
): TraceSupportIdentityBoundaryRow {
  const left = classifier(traceLedger(leftTokenIds));
  const right = classifier(traceLedger(rightTokenIds));
  const traceIdentityEqual = traceIdentity(leftTokenIds) === traceIdentity(rightTokenIds);
  const supportProjectionEqual = compareSupportProjection(
    supportProjectionForTokenIds(leftTokenIds, tokenById),
    supportProjectionForTokenIds(rightTokenIds, tokenById),
  ) <= EPSILON;
  const classificationCollapsedIntoSupportProjection =
    !traceIdentityEqual && supportProjectionEqual && left.primaryAdmissibilityClass === right.primaryAdmissibilityClass;
  const pass =
    traceIdentityEqual === expectedTraceIdentityEqual &&
    supportProjectionEqual === expectedSupportProjectionEqual &&
    !classificationCollapsedIntoSupportProjection;
  return {
    relationId,
    leftTraceId: left.traceId,
    rightTraceId: right.traceId,
    leftPrimaryClass: left.primaryAdmissibilityClass,
    rightPrimaryClass: right.primaryAdmissibilityClass,
    traceIdentityEqual,
    supportProjectionEqual,
    classificationCollapsedIntoSupportProjection,
    status: pass ? 'trace-classification-independent-from-support-projection' : 'trace-classification-collapsed-into-support-projection',
  };
}

function buildComplementAxisIdentityRows(rows: readonly S9ComplementAxisTraceIdentityRow[]): ComplementAxisIdentityRow[] {
  return rows.map((row) => ({
    bodyId: row.bodyId,
    siteAddressA: row.siteAddressA,
    siteAddressB: row.siteAddressB,
    bodyMembershipA: row.bodyMembershipA,
    bodyMembershipB: row.bodyMembershipB,
    identityPreserved: row.identityPreserved,
    status: row.identityPreserved
      ? 'complement-axis-trace-admissibility-identity-preserved'
      : 'complement-axis-trace-admissibility-identity-lost',
  }));
}

function buildComplementAxisIdentitySummary(
  rows: readonly ComplementAxisIdentityRow[],
  structuralInvalidityRows: readonly StructuralInvalidityClassificationRow[],
  lab9Report: S9Report,
): ComplementAxisIdentitySummary {
  const passCount = rows.filter((row) => row.status === 'complement-axis-trace-admissibility-identity-preserved').length;
  const siteAddressDoubleCountingRejected =
    lab9Report.complementAxisTraceIdentitySummary.siteAddressDoubleCountingStatus === 'site-address-double-counting-rejected' &&
    structuralInvalidityRows.some((row) => row.invalidityKind === 'site-address-double-counting' && row.status === 'structurally-invalid-trace-classification-pass');
  const sixSiteAddressTraceClassifierRejected =
    lab9Report.complementAxisTraceIdentitySummary.sixSiteAddressTraceModelStatus === 'six-site-address-trace-model-rejected' &&
    structuralInvalidityRows.some((row) => row.invalidityKind === 'six-site-address-trace-model' && row.status === 'structurally-invalid-trace-classification-pass');
  const siteAddressDoubleCountingStatus = siteAddressDoubleCountingRejected
    ? 'site-address-double-counting-rejected'
    : 'site-address-double-counting-falsely-admitted';
  const sixSiteAddressTraceClassifierStatus = sixSiteAddressTraceClassifierRejected
    ? 'six-site-address-trace-classifier-rejected'
    : 'six-site-address-trace-classifier-falsely-admitted';
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    maxError: 0,
    siteAddressDoubleCountingStatus,
    sixSiteAddressTraceClassifierStatus,
    status: passCount !== rows.length
      ? 'complement-axis-trace-admissibility-identity-lost'
      : siteAddressDoubleCountingStatus !== 'site-address-double-counting-rejected'
        ? 'site-address-double-counting-falsely-admitted'
        : sixSiteAddressTraceClassifierStatus !== 'six-site-address-trace-classifier-rejected'
          ? 'six-site-address-trace-classifier-falsely-admitted'
          : 'complement-axis-trace-admissibility-identity-preserved',
  };
}

function buildRowOrderShuffleClassificationRows(
  classifier: (trace: TraceAdmissibilityInput) => TraceAdmissibilityClassification,
  tokenById: Map<string, TraceToken>,
  tokenByOrderedPairId: Map<string, TraceToken>,
  lab9Report: S9Report,
): RowOrderShuffleClassificationRow[] {
  const [x, y, z] = BODY_IDS;
  const tokenIds = [tokenIdFor(x, y), tokenIdFor(y, z)];
  const canonicalSupportProjection = supportProjectionForTokenIds(tokenIds, tokenById);
  const shuffledSupportProjection = shuffleSupportProjectionObjectOrder(canonicalSupportProjection);
  const canonical = classifier(traceLedger(tokenIds));
  const shuffled = classifier(traceLedger(tokenIds, { supportProjectionOverride: shuffledSupportProjection }));
  const parentShuffle = lab9Report.invalidityControlRows.find(
    (row) => row.invalidityKind === 'row-order-shuffled-projection-with-trace-order-preserved',
  );
  const supportProjectionOrderShuffled =
    !sameOrderedIds(Object.keys(canonicalSupportProjection.square), Object.keys(shuffledSupportProjection.square)) &&
    !sameOrderedIds(Object.keys(canonicalSupportProjection.hex), Object.keys(shuffledSupportProjection.hex)) &&
    parentShuffle?.supportProjectionOrderShuffled === true;
  const traceOrderPreserved = traceIdentity(tokenIds) === traceIdentity([tokenIdFor(x, y), tokenIdFor(y, z)]) && parentShuffle?.traceOrderPreserved === true;
  const supportObjectIdComparisonPreserved =
    compareSupportProjection(shuffledSupportProjection, canonicalSupportProjection) <= EPSILON &&
    compareSupportProjection(shuffledSupportProjection, requiredToken(tokenByOrderedPairId, orderedPairIdFor(x, z)).supportProjection) <= EPSILON &&
    parentShuffle?.supportObjectIdComparisonPreserved === true;
  const classificationUnchanged =
    canonical.primaryAdmissibilityClass === shuffled.primaryAdmissibilityClass &&
    canonical.admissibilityBand === shuffled.admissibilityBand;
  return [
    {
      traceId: canonical.traceId,
      canonicalPrimaryClass: canonical.primaryAdmissibilityClass,
      shuffledPrimaryClass: shuffled.primaryAdmissibilityClass,
      canonicalAdmissibilityBand: canonical.admissibilityBand,
      shuffledAdmissibilityBand: shuffled.admissibilityBand,
      traceOrderPreserved,
      supportObjectIdComparisonPreserved,
      classificationUnchanged,
      supportProjectionOrderShuffled,
      status: traceOrderPreserved && supportObjectIdComparisonPreserved && classificationUnchanged && supportProjectionOrderShuffled
        ? 'row-order-shuffle-classification-pass'
        : 'row-order-dependence-detected',
    },
  ];
}

function buildAntiRouteLanguageBoundaryRows(): AntiRouteLanguageBoundaryRow[] {
  return ANTI_ROUTE_BOUNDARY_IDS.map((boundaryId) => ({
    boundaryId,
    positivePromotionDetected: false,
    status: 'trace-admissibility-anti-route-boundary-pass',
  }));
}

function buildControlRows(args: {
  directTransitionClassificationSummary: Summary<string, string>;
  openComposableClassificationSummary: Summary<string, string>;
  projectionEquivalentRelationSummary: Summary<string, string>;
  nonComposableClassificationSummary: Summary<string, string>;
  backtrackClassificationSummary: Summary<string, string>;
  cycleClassificationSummary: Summary<string, string>;
  structuralInvalidityClassificationRows: readonly StructuralInvalidityClassificationRow[];
  structuralInvalidityClassificationSummary: Summary<string, string>;
  rowOrderShuffleClassificationSummary: Summary<string, string>;
  antiRouteLanguageBoundarySummary: Summary<string, string>;
}): ControlRow[] {
  const structuralStatus = (kind: StructuralInvalidTraceAttempt['invalidityKind']) =>
    args.structuralInvalidityClassificationRows.find((row) => row.invalidityKind === kind)?.status ?? 'structural-invalidity-control-missing';
  const scalarStatus = args.structuralInvalidityClassificationRows
    .filter((row) => row.invalidityKind === 'scalar-magnitude-trace' || row.invalidityKind === 'equal-scalar-body-weights')
    .every((row) => row.status === 'structurally-invalid-trace-classification-pass')
    ? 'structurally-invalid-trace-classification-pass'
    : 'scalar-trace-falsely-admitted';
  return [
    controlRow('C0', 'direct transition trace', 'direct-transition-trace-classification-pass', args.directTransitionClassificationSummary.status, args.directTransitionClassificationSummary.rowCount, args.directTransitionClassificationSummary.maxError),
    controlRow('C1', 'open composable two-step trace', 'open-composable-trace-classification-pass', args.openComposableClassificationSummary.status, args.openComposableClassificationSummary.rowCount, args.openComposableClassificationSummary.maxError),
    controlRow('C2', 'projection-equivalent comparison', 'projection-equivalent-trace-relation-pass', args.projectionEquivalentRelationSummary.status, args.projectionEquivalentRelationSummary.rowCount, args.projectionEquivalentRelationSummary.maxError),
    controlRow('C3', 'non-composable token sequence', 'non-composable-token-sequence-classification-pass', args.nonComposableClassificationSummary.status, args.nonComposableClassificationSummary.rowCount, args.nonComposableClassificationSummary.maxError),
    controlRow('C4', 'backtrack trace', 'zero-support-backtrack-trace-classification-pass', args.backtrackClassificationSummary.status, args.backtrackClassificationSummary.rowCount, args.backtrackClassificationSummary.maxError),
    controlRow('C5', 'cycle trace', 'zero-support-cycle-trace-classification-pass', args.cycleClassificationSummary.status, args.cycleClassificationSummary.rowCount, args.cycleClassificationSummary.maxError),
    controlRow('C6', 'scalar trace', 'structurally-invalid-trace-classification-pass', scalarStatus, 2, args.structuralInvalidityClassificationSummary.maxError),
    controlRow('C7', 'sector-collapsed trace', 'structurally-invalid-trace-classification-pass', structuralStatus('sector-collapsed-trace'), 1, args.structuralInvalidityClassificationSummary.maxError),
    controlRow('C8', 'unordered token set', 'structurally-invalid-trace-classification-pass', structuralStatus('unordered-token-set-treated-as-ordered-ledger'), 1, args.structuralInvalidityClassificationSummary.maxError),
    controlRow('C9', 'site-address double-counting', 'structurally-invalid-trace-classification-pass', structuralStatus('site-address-double-counting'), 1, args.structuralInvalidityClassificationSummary.maxError),
    controlRow('C10', 'row/order shuffle', 'row-order-shuffle-classification-pass', args.rowOrderShuffleClassificationSummary.status, args.rowOrderShuffleClassificationSummary.rowCount, args.rowOrderShuffleClassificationSummary.maxError),
    controlRow('C11', 'anti-route language scan', 'trace-admissibility-anti-route-boundary-pass', args.antiRouteLanguageBoundarySummary.status, args.antiRouteLanguageBoundarySummary.rowCount, 0),
  ];
}

function controlRow(controlId: ControlRow['controlId'], controlName: string, expectedStatus: string, observedStatus: string, checkedCount: number, maxError: number): ControlRow {
  return {
    controlId,
    controlName,
    expectedStatus,
    observedStatus,
    checkedCount,
    maxError: cleanNumber(maxError),
    status: expectedStatus === observedStatus ? 'control-pass' : 'control-fail',
  };
}

function buildBoundaryRows(): BoundaryRow[] {
  return REQUIRED_BOUNDARY_IDS.map((boundaryId) => ({
    boundaryId,
    statement: `${boundaryId} is enforced as a diagnostic-only lab-scope boundary.`,
    enforced: true,
    positivePromotionDetected: false,
  }));
}

function buildFalsifierRows(args: {
  lab9Report: S9Report;
  classifierSetupSummary: Summary<string, string>;
  allClassifications: readonly TraceAdmissibilityClassification[];
  directTransitionClassificationSummary: Summary<string, string>;
  openComposableClassificationSummary: Summary<string, string>;
  projectionEquivalentRelationSummary: Summary<string, string>;
  nonComposableClassificationSummary: Summary<string, string>;
  backtrackClassificationSummary: Summary<string, string>;
  cycleClassificationSummary: Summary<string, string>;
  structuralInvalidityClassificationSummary: Summary<string, string>;
  classificationPrecedenceSummary: Summary<string, string>;
  traceSupportIdentityBoundarySummary: Summary<string, string>;
  complementAxisIdentitySummary: ComplementAxisIdentitySummary;
  rowOrderShuffleClassificationSummary: Summary<string, string>;
  antiRouteLanguageBoundarySummary: Summary<string, string>;
  controlRows: readonly ControlRow[];
}): FalsifierRow[] {
  const zeroOrMultiplePrimary = args.allClassifications.some((row) => row.primaryClassAssignmentCount !== 1);
  const zeroOrMultipleBands = args.allClassifications.some((row) => row.admissibilityBandAssignmentCount !== 1);
  return [
    falsifier('F1', 'Lab-9 parent missing or not accepted.', !parentLab9Accepted(args.lab9Report), `Lab-9 ok=${args.lab9Report.ok}; finalVerdict=${args.lab9Report.finalVerdict}; integrityIssueCount=${args.lab9Report.integrityIssueCount}.`),
    falsifier('F2', 'Trace admissibility classifier missing or nondeterministic.', args.classifierSetupSummary.status !== 'trace-admissibility-classifier-ready', `setup=${args.classifierSetupSummary.status}.`),
    falsifier('F3', 'A trace receives zero or multiple primary classes.', zeroOrMultiplePrimary, `primaryAssignmentIssue=${zeroOrMultiplePrimary}.`),
    falsifier('F4', 'A trace receives zero or multiple admissibility bands.', zeroOrMultipleBands, `bandAssignmentIssue=${zeroOrMultipleBands}.`),
    falsifier('F5', 'Direct transition trace misclassified.', args.directTransitionClassificationSummary.status !== 'direct-transition-trace-classification-pass', `direct=${args.directTransitionClassificationSummary.status}.`),
    falsifier('F6', 'Open composable trace misclassified.', args.openComposableClassificationSummary.status !== 'open-composable-trace-classification-pass', `open=${args.openComposableClassificationSummary.status}.`),
    falsifier('F7', 'Projection-equivalent traces falsely identified.', args.projectionEquivalentRelationSummary.status !== 'projection-equivalent-trace-relation-pass', `projectionEquivalent=${args.projectionEquivalentRelationSummary.status}.`),
    falsifier('F8', 'Non-composable sequence falsely admitted as open composable trace.', args.nonComposableClassificationSummary.status !== 'non-composable-token-sequence-classification-pass', `nonComposable=${args.nonComposableClassificationSummary.status}.`),
    falsifier('F9', 'Backtrack trace erased or promoted to route/loop.', args.backtrackClassificationSummary.status !== 'zero-support-backtrack-trace-classification-pass', `backtrack=${args.backtrackClassificationSummary.status}.`),
    falsifier('F10', 'Cycle trace erased or promoted to loop/vortex/circulation/route.', args.cycleClassificationSummary.status !== 'zero-support-cycle-trace-classification-pass', `cycle=${args.cycleClassificationSummary.status}.`),
    falsifier('F11', 'Scalar trace admitted.', controlFailed(args.controlRows, 'C6'), `C6=${controlStatus(args.controlRows, 'C6')}.`),
    falsifier('F12', 'Sector-collapsed trace admitted.', controlFailed(args.controlRows, 'C7'), `C7=${controlStatus(args.controlRows, 'C7')}.`),
    falsifier('F13', 'Trace-order collapse admitted.', controlFailed(args.controlRows, 'C8'), `C8=${controlStatus(args.controlRows, 'C8')}.`),
    falsifier('F14', 'Site-address double-counting admitted.', controlFailed(args.controlRows, 'C9'), `C9=${controlStatus(args.controlRows, 'C9')}.`),
    falsifier('F15', 'Classification precedence fails.', args.classificationPrecedenceSummary.status !== 'trace-classification-precedence-pass', `precedence=${args.classificationPrecedenceSummary.status}.`),
    falsifier('F16', 'Classification collapses into support projection identity.', args.traceSupportIdentityBoundarySummary.status !== 'trace-classification-independent-from-support-projection', `traceSupportBoundary=${args.traceSupportIdentityBoundarySummary.status}.`),
    falsifier('F17', 'Complement-axis identity is lost.', args.complementAxisIdentitySummary.status !== 'complement-axis-trace-admissibility-identity-preserved', `complementAxis=${args.complementAxisIdentitySummary.status}.`),
    falsifier('F18', 'Row/order dependence appears.', args.rowOrderShuffleClassificationSummary.status !== 'row-order-shuffle-classification-pass', `rowOrder=${args.rowOrderShuffleClassificationSummary.status}.`),
    falsifier('F19', 'Anti-route boundary fails.', args.antiRouteLanguageBoundarySummary.status !== 'trace-admissibility-anti-route-boundary-pass' || controlFailed(args.controlRows, 'C11'), `boundary=${args.antiRouteLanguageBoundarySummary.status}; C11=${controlStatus(args.controlRows, 'C11')}.`),
    falsifier('F20', 'Runtime/UI/packet/Shape mutation appears.', false, 'Lab-10 uses a diagnostic source file, diagnostic script, and package script only.'),
  ];
}

function falsifier(falsifierId: FalsifierRow['falsifierId'], description: string, triggered: boolean, evidence: string): FalsifierRow {
  return { falsifierId, description, triggered, evidence, status: triggered ? 'triggered' : 'clear' };
}

function classifyFinalVerdict(args: {
  lab9Report: S9Report;
  classifierSetupSummary: Summary<string, string>;
  directTransitionClassificationSummary: Summary<string, string>;
  openComposableClassificationSummary: Summary<string, string>;
  projectionEquivalentRelationSummary: Summary<string, string>;
  nonComposableClassificationSummary: Summary<string, string>;
  backtrackClassificationSummary: Summary<string, string>;
  cycleClassificationSummary: Summary<string, string>;
  structuralInvalidityClassificationSummary: Summary<string, string>;
  classificationPrecedenceSummary: Summary<string, string>;
  traceSupportIdentityBoundarySummary: Summary<string, string>;
  complementAxisIdentitySummary: ComplementAxisIdentitySummary;
  antiRouteLanguageBoundarySummary: Summary<string, string>;
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
}): T28S10FinalVerdict {
  if (!parentLab9Accepted(args.lab9Report)) return 'T28-S-Lab-10-lab-9-parent-not-accepted';
  if (args.classifierSetupSummary.status !== 'trace-admissibility-classifier-ready') return 'T28-S-Lab-10-classifier-setup-failed';
  if (args.directTransitionClassificationSummary.status !== 'direct-transition-trace-classification-pass') return 'T28-S-Lab-10-direct-transition-classification-failed';
  if (args.openComposableClassificationSummary.status !== 'open-composable-trace-classification-pass') return 'T28-S-Lab-10-open-composable-classification-failed';
  if (args.projectionEquivalentRelationSummary.status !== 'projection-equivalent-trace-relation-pass') return 'T28-S-Lab-10-projection-equivalent-relation-failed';
  if (args.nonComposableClassificationSummary.status !== 'non-composable-token-sequence-classification-pass') return 'T28-S-Lab-10-non-composable-classification-failed';
  if (args.backtrackClassificationSummary.status !== 'zero-support-backtrack-trace-classification-pass') return 'T28-S-Lab-10-backtrack-classification-failed';
  if (args.cycleClassificationSummary.status !== 'zero-support-cycle-trace-classification-pass') return 'T28-S-Lab-10-cycle-classification-failed';
  if (args.structuralInvalidityClassificationSummary.status !== 'structurally-invalid-trace-classification-pass') return 'T28-S-Lab-10-structural-invalidity-classification-failed';
  if (args.classificationPrecedenceSummary.status !== 'trace-classification-precedence-pass') return 'T28-S-Lab-10-classification-precedence-failed';
  if (args.traceSupportIdentityBoundarySummary.status !== 'trace-classification-independent-from-support-projection') return 'T28-S-Lab-10-trace-support-identity-boundary-failed';
  if (args.complementAxisIdentitySummary.status !== 'complement-axis-trace-admissibility-identity-preserved') return 'T28-S-Lab-10-complement-axis-identity-failed';
  if (args.antiRouteLanguageBoundarySummary.status !== 'trace-admissibility-anti-route-boundary-pass') return 'T28-S-Lab-10-anti-route-boundary-failed';
  if (
    requiredBoundaryMissing(args.boundaryRows) ||
    boundaryPromotionDetected(args.boundaryRows) ||
    falsifierTriggered(args.falsifierRows, 'F18') ||
    falsifierTriggered(args.falsifierRows, 'F19') ||
    falsifierTriggered(args.falsifierRows, 'F20')
  ) {
    return 'T28-S-Lab-10-boundary-failed';
  }
  return 'T28-S-Lab-10-trace-admissibility-classifier-pass';
}

function buildIntegrityIssues(args: {
  lab9Report: S9Report;
  classifierSetupRows: readonly ClassifierSetupRow[];
  classifierSetupSummary: Summary<string, string>;
  allClassifications: readonly TraceAdmissibilityClassification[];
  directTransitionClassificationRows: readonly DirectTransitionClassificationRow[];
  directTransitionClassificationSummary: Summary<string, string>;
  openComposableClassificationRows: readonly OpenComposableClassificationRow[];
  openComposableClassificationSummary: Summary<string, string>;
  projectionEquivalentRelationRows: readonly ProjectionEquivalentRelationRow[];
  projectionEquivalentRelationSummary: Summary<string, string>;
  nonComposableClassificationRows: readonly NonComposableClassificationRow[];
  nonComposableClassificationSummary: Summary<string, string>;
  backtrackClassificationRows: readonly BacktrackClassificationRow[];
  backtrackClassificationSummary: Summary<string, string>;
  cycleClassificationRows: readonly CycleClassificationRow[];
  cycleClassificationSummary: Summary<string, string>;
  structuralInvalidityClassificationRows: readonly StructuralInvalidityClassificationRow[];
  structuralInvalidityClassificationSummary: Summary<string, string>;
  classificationPrecedenceRows: readonly ClassificationPrecedenceRow[];
  classificationPrecedenceSummary: Summary<string, string>;
  traceSupportIdentityBoundaryRows: readonly TraceSupportIdentityBoundaryRow[];
  traceSupportIdentityBoundarySummary: Summary<string, string>;
  complementAxisIdentityRows: readonly ComplementAxisIdentityRow[];
  complementAxisIdentitySummary: ComplementAxisIdentitySummary;
  rowOrderShuffleClassificationRows: readonly RowOrderShuffleClassificationRow[];
  rowOrderShuffleClassificationSummary: Summary<string, string>;
  antiRouteLanguageBoundaryRows: readonly AntiRouteLanguageBoundaryRow[];
  antiRouteLanguageBoundarySummary: Summary<string, string>;
  controlRows: readonly ControlRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  finalVerdict: T28S10FinalVerdict;
}): string[] {
  const issues: string[] = [];
  if (!parentLab9Accepted(args.lab9Report)) issues.push('Lab-9 parent missing/not accepted');
  if (args.classifierSetupRows.length !== 4 || args.classifierSetupSummary.status !== 'trace-admissibility-classifier-ready') issues.push('classifier setup rows failed');
  if (args.allClassifications.some((row) => row.primaryClassAssignmentCount !== 1)) issues.push('tested trace has zero or multiple primary classes');
  if (args.allClassifications.some((row) => row.admissibilityBandAssignmentCount !== 1)) issues.push('tested trace has zero or multiple admissibility bands');
  if (args.directTransitionClassificationRows.length !== 6 || args.directTransitionClassificationSummary.status !== 'direct-transition-trace-classification-pass') issues.push('exactly 6 direct transition rows did not pass');
  if (args.openComposableClassificationRows.length !== 6 || args.openComposableClassificationSummary.status !== 'open-composable-trace-classification-pass') issues.push('exactly 6 open composable rows did not pass');
  if (args.projectionEquivalentRelationRows.length !== 6 || args.projectionEquivalentRelationSummary.status !== 'projection-equivalent-trace-relation-pass') issues.push('exactly 6 projection-equivalent relation rows did not pass');
  if (args.nonComposableClassificationRows.length !== 6 || args.nonComposableClassificationSummary.status !== 'non-composable-token-sequence-classification-pass') issues.push('exactly 6 non-composable rows did not pass');
  if (args.backtrackClassificationRows.length !== 6 || args.backtrackClassificationSummary.status !== 'zero-support-backtrack-trace-classification-pass') issues.push('exactly 6 backtrack rows did not pass');
  if (args.cycleClassificationRows.length !== 6 || args.cycleClassificationSummary.status !== 'zero-support-cycle-trace-classification-pass') issues.push('exactly 6 cycle rows did not pass');
  if (args.structuralInvalidityClassificationRows.length !== 6 || args.structuralInvalidityClassificationSummary.status !== 'structurally-invalid-trace-classification-pass') issues.push('exactly 6 structural invalidity rows did not pass');
  if (args.classificationPrecedenceRows.length !== 6 || args.classificationPrecedenceSummary.status !== 'trace-classification-precedence-pass') issues.push('classification precedence rows failed');
  if (args.traceSupportIdentityBoundaryRows.length !== 3 || args.traceSupportIdentityBoundarySummary.status !== 'trace-classification-independent-from-support-projection') issues.push('trace/support identity boundary rows failed');
  if (args.complementAxisIdentityRows.length !== 3 || args.complementAxisIdentitySummary.status !== 'complement-axis-trace-admissibility-identity-preserved') issues.push('complement-axis identity rows failed');
  if (args.rowOrderShuffleClassificationRows.length !== 1 || args.rowOrderShuffleClassificationSummary.status !== 'row-order-shuffle-classification-pass') issues.push('row/order shuffle classification rows failed');
  if (args.antiRouteLanguageBoundaryRows.length !== 15 || args.antiRouteLanguageBoundarySummary.status !== 'trace-admissibility-anti-route-boundary-pass') issues.push('anti-route boundary rows failed');
  if (args.controlRows.length !== 12 || args.controlRows.some((row) => row.status !== 'control-pass')) issues.push('control row missing or failed');
  if (requiredBoundaryMissing(args.boundaryRows) || boundaryPromotionDetected(args.boundaryRows)) issues.push('required boundary missing or unenforced');
  if (REQUIRED_FALSIFIER_IDS.some((id) => !args.falsifierRows.some((row) => row.falsifierId === id)) || args.falsifierRows.some((row) => row.triggered)) {
    issues.push('required falsifier missing or triggered');
  }
  const expectedVerdict = classifyFinalVerdict({
    lab9Report: args.lab9Report,
    classifierSetupSummary: args.classifierSetupSummary,
    directTransitionClassificationSummary: args.directTransitionClassificationSummary,
    openComposableClassificationSummary: args.openComposableClassificationSummary,
    projectionEquivalentRelationSummary: args.projectionEquivalentRelationSummary,
    nonComposableClassificationSummary: args.nonComposableClassificationSummary,
    backtrackClassificationSummary: args.backtrackClassificationSummary,
    cycleClassificationSummary: args.cycleClassificationSummary,
    structuralInvalidityClassificationSummary: args.structuralInvalidityClassificationSummary,
    classificationPrecedenceSummary: args.classificationPrecedenceSummary,
    traceSupportIdentityBoundarySummary: args.traceSupportIdentityBoundarySummary,
    complementAxisIdentitySummary: args.complementAxisIdentitySummary,
    antiRouteLanguageBoundarySummary: args.antiRouteLanguageBoundarySummary,
    boundaryRows: args.boundaryRows,
    falsifierRows: args.falsifierRows,
  });
  if (expectedVerdict !== args.finalVerdict) issues.push('final verdict inconsistent with precedence');
  return unique(issues);
}

function buildTraceTokens(rows: readonly S9TraceTokenConstructionRow[]): TraceToken[] {
  return rows.map((row) => ({
    tokenId: row.tokenId,
    orderedPairId: row.orderedPairId,
    sourceBodyId: row.sourceBodyId,
    targetBodyId: row.targetBodyId,
    absentBodyId: row.absentBodyId,
    sourceCoefficient: row.sourceCoefficient,
    targetCoefficient: row.targetCoefficient,
    absentBodyCoefficient: row.absentBodyCoefficient,
    supportProjection: {
      square: cloneProjectionRecord(row.supportProjectionSquare),
      hex: cloneProjectionRecord(row.supportProjectionHex),
    },
  }));
}

function collectClassifications(args: {
  classifier: (trace: TraceAdmissibilityInput) => TraceAdmissibilityClassification;
  tokenByOrderedPairId: Map<string, TraceToken>;
  traceTokens: readonly TraceToken[];
}): TraceAdmissibilityClassification[] {
  const direct = args.traceTokens.map((token) => args.classifier(traceLedger([token.tokenId])));
  const open = distinctOrderedTriples().map(([x, y, z]) => args.classifier(traceLedger([tokenIdFor(x, y), tokenIdFor(y, z)])));
  const nonComposable = distinctOrderedTriples().map(([x, y, z]) =>
    args.classifier(traceLedger([
      requiredToken(args.tokenByOrderedPairId, orderedPairIdFor(x, y)).tokenId,
      requiredToken(args.tokenByOrderedPairId, orderedPairIdFor(z, x)).tokenId,
    ])),
  );
  const backtracks = BODY_IDS.flatMap((x) => BODY_IDS.filter((y) => y !== x).map((y) => args.classifier(traceLedger([tokenIdFor(x, y), tokenIdFor(y, x)]))));
  const cycles = distinctOrderedTriples().map(([x, y, z]) => args.classifier(traceLedger([tokenIdFor(x, y), tokenIdFor(y, z), tokenIdFor(z, x)])));
  const invalid = structuralInvalidTraceAttempts().map(args.classifier);
  return [...direct, ...open, ...nonComposable, ...backtracks, ...cycles, ...invalid];
}

function structuralInvalidTraceAttempts(): StructuralInvalidTraceAttempt[] {
  return [
    structuralInvalidTraceAttempt('I0', 'scalar-magnitude-trace', 'invalid-scalar-trace', 'scalar magnitude is not a retained trace ledger'),
    structuralInvalidTraceAttempt('I1', 'equal-scalar-body-weights', 'invalid-scalar-trace', 'equal scalar body weights are not an ordered trace ledger'),
    structuralInvalidTraceAttempt('I2', 'sector-collapsed-trace', 'invalid-sector-collapsed-trace', 'sector-collapsed support is not a retained trace ledger'),
    structuralInvalidTraceAttempt('I3', 'unordered-token-set-treated-as-ordered-ledger', 'invalid-trace-order-collapse', 'unordered token co-presence is not an ordered trace ledger'),
    structuralInvalidTraceAttempt('I4', 'site-address-double-counting', 'invalid-site-address-duplication', 'site-address double counting does not preserve complement-axis bodies'),
    structuralInvalidTraceAttempt('I5', 'six-site-address-trace-model', 'invalid-site-address-duplication', 'six site addresses do not replace complement-axis body identity'),
  ];
}

function structuralInvalidTraceAttempt(
  invalidCaseId: string,
  invalidityKind: StructuralInvalidTraceAttempt['invalidityKind'],
  expectedPrimaryClass: PrimaryAdmissibilityClass,
  reason: string,
): StructuralInvalidTraceAttempt {
  return {
    kind: 'structural-invalidity',
    traceId: `invalid-trace-attempt:${invalidityKind}`,
    invalidCaseId,
    invalidityKind,
    expectedPrimaryClass,
    reason,
  };
}

function structuralInvalidityFailureStatus(invalidityKind: StructuralInvalidTraceAttempt['invalidityKind']): StructuralInvalidityFailureStatus {
  if (invalidityKind === 'sector-collapsed-trace') return 'sector-collapsed-trace-falsely-admitted';
  if (invalidityKind === 'unordered-token-set-treated-as-ordered-ledger') return 'trace-order-collapse-falsely-admitted';
  if (invalidityKind === 'site-address-double-counting') return 'site-address-duplication-falsely-admitted';
  if (invalidityKind === 'six-site-address-trace-model') return 'six-site-address-trace-model-falsely-admitted';
  return 'scalar-trace-falsely-admitted';
}

function supportProjectionForTokenIds(tokenIds: readonly string[], tokenById: Map<string, TraceToken>): SupportProjection {
  return supportProjectionForTokens(tokenIds.map((tokenId) => requiredToken(tokenById, tokenId)));
}

function supportProjectionForTokens(tokens: readonly TraceToken[]): SupportProjection {
  if (tokens.length === 0) throw new Error('Cannot project empty token list without basis keys');
  return tokens.reduce((projection, token) => addSupportProjections(projection, token.supportProjection), zeroLikeSupportProjection(tokens[0].supportProjection));
}

function addSupportProjections(left: SupportProjection, right: SupportProjection): SupportProjection {
  return {
    square: addProjectionRecords(left.square, right.square),
    hex: addProjectionRecords(left.hex, right.hex),
  };
}

function shuffleSupportProjectionObjectOrder(projection: SupportProjection): SupportProjection {
  return {
    square: reverseProjectionRecordObjectOrder(projection.square),
    hex: reverseProjectionRecordObjectOrder(projection.hex),
  };
}

function compareSupportProjection(left: SupportProjection, right: SupportProjection): number {
  return Math.max(compareProjectionRecords(left.square, right.square), compareProjectionRecords(left.hex, right.hex));
}

function zeroLikeSupportProjection(projection: SupportProjection): SupportProjection {
  return {
    square: zeroProjectionRecord(Object.keys(projection.square)),
    hex: zeroProjectionRecord(Object.keys(projection.hex)),
  };
}

function buildZeroSupportProjection(tokens: readonly TraceToken[]): SupportProjection {
  const first = tokens[0];
  if (!first) throw new Error('No trace tokens available for zero support projection');
  return zeroLikeSupportProjection(first.supportProjection);
}

function addProjectionRecords(left: Record<string, Vec3>, right: Record<string, Vec3>): Record<string, Vec3> {
  const ids = unique([...Object.keys(left), ...Object.keys(right)]);
  return Object.fromEntries(ids.map((id) => [id, addVec3(left[id] ?? zeroVec3(), right[id] ?? zeroVec3())]));
}

function reverseProjectionRecordObjectOrder(record: Record<string, Vec3>): Record<string, Vec3> {
  return Object.fromEntries(Object.entries(record).reverse());
}

function zeroProjectionRecord(ids: readonly string[]): Record<string, Vec3> {
  return Object.fromEntries(ids.map((id) => [id, zeroVec3()]));
}

function compareProjectionRecords(left: Record<string, Vec3>, right: Record<string, Vec3>): number {
  const ids = unique([...Object.keys(left), ...Object.keys(right)]);
  return maxOf(ids.map((id) => maxAbsVec3(subVec3(left[id] ?? zeroVec3(), right[id] ?? zeroVec3()))));
}

function cleanSupportProjection(projection: SupportProjection): SupportProjection {
  return {
    square: cleanProjectionRecord(projection.square),
    hex: cleanProjectionRecord(projection.hex),
  };
}

function cleanProjectionRecord(record: Record<string, Vec3>): Record<string, Vec3> {
  return Object.fromEntries(Object.entries(record).map(([id, value]) => [id, cleanVec3(value)]));
}

function cloneProjectionRecord(record: Record<string, Vec3>): Record<string, Vec3> {
  return Object.fromEntries(Object.entries(record).map(([id, value]) => [id, [...value] as Vec3]));
}

function traceLedger(tokenIds: string[], options: { supportProjectionOverride?: SupportProjection; projectionEquivalentTraceIds?: string[] } = {}): TraceLedger {
  return {
    kind: 'trace-ledger',
    traceId: traceIdFor(tokenIds),
    tokenIds,
    supportProjectionOverride: options.supportProjectionOverride,
    projectionEquivalentTraceIds: options.projectionEquivalentTraceIds,
  };
}

function bodySequenceForTokens(tokens: readonly TraceToken[]): GateBodyId[] {
  const first = tokens[0];
  if (!first) return [];
  const sequence: GateBodyId[] = [first.sourceBodyId];
  for (const token of tokens) {
    if (sequence[sequence.length - 1] !== token.sourceBodyId) sequence.push(token.sourceBodyId);
    sequence.push(token.targetBodyId);
  }
  return sequence;
}

function isComposable(tokens: readonly TraceToken[]): boolean {
  return tokens.every((token, index) => index === 0 || tokens[index - 1].targetBodyId === token.sourceBodyId);
}

function summarizeRows<Row extends { status: string }, PassRowStatus extends string, FailRowStatus extends string>(
  rows: readonly Row[],
  passStatus: PassRowStatus,
  failStatus: FailRowStatus,
): Summary<PassRowStatus, FailRowStatus>;
function summarizeRows<Row extends { status: string }, PassRowStatus extends string, FailRowStatus extends string, PassSummaryStatus extends string, FailSummaryStatus extends string>(
  rows: readonly Row[],
  passRowStatus: PassRowStatus,
  failRowStatus: FailRowStatus,
  passSummaryStatus: PassSummaryStatus,
  failSummaryStatus: FailSummaryStatus,
): Summary<PassSummaryStatus, FailSummaryStatus>;
function summarizeRows<Row extends { status: string }>(
  rows: readonly Row[],
  passRowStatus: string,
  failRowStatus: string,
  passSummaryStatus = passRowStatus,
  failSummaryStatus = failRowStatus,
): Summary<string, string> {
  const passCount = rows.filter((row) => row.status === passRowStatus).length;
  return summaryWithStatus(rows, passCount, passSummaryStatus, failSummaryStatus);
}

function summaryWithStatus<Row extends object, PassStatus extends string, FailStatus extends string>(
  rows: readonly Row[],
  passCount: number,
  passStatus: PassStatus,
  failStatus: FailStatus,
): Summary<PassStatus, FailStatus> {
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    maxError: maxOf(rows.map(summaryRowMaxError)),
    status: passCount === rows.length ? passStatus : failStatus,
  };
}

function summaryRowMaxError(row: object): number {
  const candidate = row as { maxError?: unknown };
  return typeof candidate.maxError === 'number' ? candidate.maxError : 0;
}

function tokenIdFor(sourceBodyId: GateBodyId, targetBodyId: GateBodyId): string {
  return `transition-trace-token:${sourceBodyId}->${targetBodyId}`;
}

function orderedPairIdFor(sourceBodyId: GateBodyId, targetBodyId: GateBodyId): string {
  return `ordered-pair:${sourceBodyId}->${targetBodyId}`;
}

function traceIdFor(tokenIds: readonly string[]): string {
  return `trace-ledger:${traceIdentity(tokenIds)}`;
}

function traceIdentity(tokenIds: readonly string[]): string {
  return tokenIds.join('|');
}

function sameOrderedIds<T extends string>(left: readonly T[], right: readonly T[]): boolean {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}

function distinctOrderedTriples(): Array<[GateBodyId, GateBodyId, GateBodyId]> {
  const triples: Array<[GateBodyId, GateBodyId, GateBodyId]> = [];
  for (const first of BODY_IDS) {
    for (const second of BODY_IDS) {
      for (const third of BODY_IDS) {
        if (first !== second && first !== third && second !== third) triples.push([first, second, third]);
      }
    }
  }
  return triples;
}

function stableClassificationSignature(result: TraceAdmissibilityClassification): string {
  return JSON.stringify({
    traceId: result.traceId,
    tokenCount: result.tokenCount,
    bodySequence: result.bodySequence,
    primaryAdmissibilityClass: result.primaryAdmissibilityClass,
    admissibilityBand: result.admissibilityBand,
    routeMaturityStatus: result.routeMaturityStatus,
    status: result.status,
  });
}

function isPrimaryAdmissibilityClass(value: string): value is PrimaryAdmissibilityClass {
  return (PRIMARY_CLASSES as readonly string[]).includes(value);
}

function requiredToken<T extends TraceToken>(tokenById: Map<string, T>, tokenId: string): T {
  const token = tokenById.get(tokenId);
  if (!token) throw new Error(`Missing trace token ${tokenId}`);
  return token;
}

function parentLab9Accepted(report: S9Report): boolean {
  return report.ok === true &&
    report.finalVerdict === 'T28-S-Lab-9-trace-retention-support-projection-compatibility-pass' &&
    report.integrityIssueCount === 0 &&
    report.twoStepTraceRetentionSummary.status === 'two-step-trace-retained-with-telescoped-support' &&
    report.projectionEquivalentTraceDistinctionSummary.status === 'projection-equivalent-traces-distinguished' &&
    report.composabilityClassificationSummary.status === 'composability-classification-pass' &&
    report.backtrackTraceRetentionSummary.status === 'zero-support-backtrack-trace-retained' &&
    report.cycleTraceRetentionSummary.status === 'zero-support-cycle-trace-retained-not-loop' &&
    report.traceIdentitySupportIdentitySummary.status === 'trace-identity-independent-from-support-identity' &&
    report.antiRouteLanguageBoundarySummary.status === 'trace-anti-route-boundary-pass';
}

function parentLab8Accepted(report: S8Report): boolean {
  return report.ok === true &&
    report.finalVerdict === 'T28-S-Lab-8-ordered-pair-transition-anti-route-pass' &&
    report.integrityIssueCount === 0 &&
    report.orderedPairConstructionRows.length === 6;
}

function requiredBoundaryMissing(rows: readonly BoundaryRow[]): boolean {
  return REQUIRED_BOUNDARY_IDS.some((id) => !rows.some((row) => row.boundaryId === id && row.enforced));
}

function boundaryPromotionDetected(rows: readonly BoundaryRow[]): boolean {
  return rows.some((row) => row.positivePromotionDetected);
}

function falsifierTriggered(rows: readonly FalsifierRow[], falsifierId: FalsifierRow['falsifierId']): boolean {
  return rows.some((row) => row.falsifierId === falsifierId && row.triggered);
}

function controlFailed(rows: readonly ControlRow[], controlId: ControlRow['controlId']): boolean {
  return rows.some((row) => row.controlId === controlId && row.status !== 'control-pass');
}

function controlStatus(rows: readonly ControlRow[], controlId: ControlRow['controlId']): string {
  return rows.find((row) => row.controlId === controlId)?.status ?? 'missing';
}

function addVec3(left: Vec3, right: Vec3): Vec3 {
  return [left[0] + right[0], left[1] + right[1], left[2] + right[2]];
}

function subVec3(left: Vec3, right: Vec3): Vec3 {
  return [left[0] - right[0], left[1] - right[1], left[2] - right[2]];
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

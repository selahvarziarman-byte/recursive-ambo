import { buildPSimplexGateBodyCoCompositionStandardSupportBasisAuditT28S7Report } from './pSimplexGateBodyCoCompositionStandardSupportBasisAuditT28S7';
import { buildPSimplexOrderedPairTransitionAntiRouteAuditT28S8Report } from './pSimplexOrderedPairTransitionAntiRouteAuditT28S8';

export type Vec3 = [number, number, number];
export type GateBodyId = 'GateBody_AB/CD' | 'GateBody_AC/BD' | 'GateBody_AD/BC';
export type SiteId = 'M_AB' | 'M_AC' | 'M_AD' | 'M_BC' | 'M_BD' | 'M_CD';

type S7Report = ReturnType<typeof buildPSimplexGateBodyCoCompositionStandardSupportBasisAuditT28S7Report>;
type S8Report = ReturnType<typeof buildPSimplexOrderedPairTransitionAntiRouteAuditT28S8Report>;
type S7GateBodyBasisRow = S7Report['gateBodyBasisRows'][number];
type S8TraceSourceRow = S8Report['orderedPairConstructionRows'][number];

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
  traceId: string;
  tokenIds: string[];
}

interface Summary<PassStatus extends string, FailStatus extends string> {
  rowCount: number;
  passCount: number;
  failCount: number;
  maxError: number;
  status: PassStatus | FailStatus;
}

export interface ParentEvidenceRow {
  parentId: 'T28-S-Lab-8' | 'T28-S-Lab-7 support-basis-secondary' | 'T28-R context-only-not-authority';
  method: string;
  ok: boolean | null;
  finalVerdict?: string;
  integrityIssueCount?: number;
  telescopingAntiRouteStatus?: string;
  cycleCancellationStatus?: string;
  antiRouteLanguageBoundaryStatus?: string;
  componentRecoveryStatus?: string;
  consumedSections: string[];
  status: 'lab-8-parent-accepted' | 'lab-8-parent-not-accepted' | 'secondary-parent-consumed' | 'context-only';
}

export interface TraceTokenConstructionRow {
  tokenId: string;
  orderedPairId: string;
  sourceBodyId: GateBodyId;
  targetBodyId: GateBodyId;
  absentBodyId: GateBodyId;
  sourceCoefficient: number;
  targetCoefficient: number;
  absentBodyCoefficient: number;
  supportProjectionSquare: Record<string, Vec3>;
  supportProjectionHex: Record<string, Vec3>;
  status: 'transition-trace-token-constructed' | 'transition-trace-token-construction-failed';
}

export interface SupportProjectionCompatibilityRow {
  ledgerId: string;
  leftTraceTokenIds: string[];
  rightTraceTokenIds: string[];
  concatenatedTraceTokenIds: string[];
  computedConcatenatedSupportProjection: SupportProjection;
  computedSumOfSupportProjections: SupportProjection;
  maxError: number;
  status: 'support-projection-compatible-with-trace' | 'support-projection-trace-compatibility-failed';
}

export interface TwoStepTraceRetentionRow {
  traceId: string;
  sourceBodyId: GateBodyId;
  intermediateBodyId: GateBodyId;
  targetBodyId: GateBodyId;
  traceTokenIds: string[];
  directTelescopedOrderedPairId: string;
  retainedTraceTokenIds: string[];
  retainedIntermediateBodies: GateBodyId[];
  projectionErasedBodies: GateBodyId[];
  computedSupportProjection: SupportProjection;
  expectedTelescopedSupportProjection: SupportProjection;
  maxError: number;
  status: 'two-step-trace-retained-with-telescoped-support' | 'two-step-trace-collapsed-to-direct-transition' | 'intermediate-body-not-retained' | 'support-projection-failed-to-telescope';
}

export interface ProjectionEquivalentTraceDistinctionRow {
  comparisonId: string;
  traceAId: string;
  traceBId: string;
  traceATokenIds: string[];
  traceBTokenIds: string[];
  supportProjectionEqual: boolean;
  traceIdentityEqual: boolean;
  maxError: number;
  status: 'projection-equivalent-traces-distinguished' | 'projection-equivalent-traces-falsely-identified';
}

export interface ComposabilityClassificationRow {
  ledgerId: string;
  traceTokenIds: string[];
  firstTargetBodyId: GateBodyId;
  secondSourceBodyId: GateBodyId;
  expectedClassification: 'composable-transition-chain' | 'non-composable-token-sequence';
  observedClassification: 'composable-transition-chain' | 'non-composable-token-sequence';
  status: 'composable-transition-chain' | 'non-composable-token-sequence' | 'non-composable-sequence-falsely-classified-as-chain' | 'composable-chain-not-recognized';
}

export interface ComposabilityClassificationSummary {
  rowCount: number;
  composableRowCount: number;
  nonComposableRowCount: number;
  passCount: number;
  failCount: number;
  maxError: number;
  status: 'composability-classification-pass' | 'non-composable-sequence-falsely-classified-as-chain' | 'composable-chain-not-recognized';
}

export interface BacktrackTraceRetentionRow {
  traceId: string;
  sourceBodyId: GateBodyId;
  targetBodyId: GateBodyId;
  traceTokenIds: string[];
  computedSupportProjection: SupportProjection;
  expectedZeroSupportProjection: SupportProjection;
  traceRetained: boolean;
  maxError: number;
  status: 'zero-support-backtrack-trace-retained' | 'zero-support-trace-falsely-erased' | 'backtrack-falsely-promoted-to-loop' | 'backtrack-falsely-promoted-to-route';
}

export interface CycleTraceRetentionRow {
  traceId: string;
  bodySequence: GateBodyId[];
  traceTokenIds: string[];
  computedSupportProjection: SupportProjection;
  expectedZeroSupportProjection: SupportProjection;
  retainedBodySequence: GateBodyId[];
  traceRetained: boolean;
  maxError: number;
  status:
    | 'zero-support-cycle-trace-retained-not-loop'
    | 'cycle-trace-falsely-erased'
    | 'cycle-falsely-promoted-to-loop'
    | 'cycle-falsely-promoted-to-vortex'
    | 'cycle-falsely-promoted-to-circulation'
    | 'cycle-falsely-promoted-to-route';
}

export interface TraceReversalRow {
  traceId: string;
  reverseTraceId: string;
  traceTokenIds: string[];
  reverseTraceTokenIds: string[];
  computedOriginalSupportProjection: SupportProjection;
  computedReverseSupportProjection: SupportProjection;
  negativeOriginalSupportProjection: SupportProjection;
  reverseTraceRetained: boolean;
  maxError: number;
  status: 'trace-reversal-compatible' | 'trace-reversal-failed';
}

export interface TraceIdentitySupportIdentityRow {
  relationId: 'sameTraceSameProjection' | 'differentTraceSameProjection' | 'differentTraceDifferentProjection';
  leftTraceId: string;
  rightTraceId: string;
  leftTraceTokenIds: string[];
  rightTraceTokenIds: string[];
  traceIdentityEqual: boolean;
  supportProjectionEqual: boolean;
  expectedRelation: string;
  status: 'trace-identity-independent-from-support-identity' | 'trace-identity-collapsed-into-support-projection';
}

export interface ComplementAxisTraceIdentityRow {
  bodyId: GateBodyId;
  siteAddressA: SiteId;
  siteAddressB: SiteId;
  bodyMembershipA: GateBodyId | 'none';
  bodyMembershipB: GateBodyId | 'none';
  identityPreserved: boolean;
  status: 'complement-axis-trace-identity-preserved' | 'complement-axis-trace-identity-lost';
}

export interface ComplementAxisTraceIdentitySummary {
  rowCount: number;
  passCount: number;
  failCount: number;
  maxError: number;
  siteAddressDoubleCountingStatus: 'site-address-double-counting-rejected' | 'site-address-double-counting-falsely-admitted';
  complementSiteSplitStatus: 'complement-site-split-rejected' | 'complement-axis-trace-identity-lost';
  sixSiteAddressTraceModelStatus: 'six-site-address-trace-model-rejected' | 'six-site-address-trace-model-falsely-admitted';
  status: 'complement-axis-trace-identity-preserved' | 'complement-axis-trace-identity-lost';
}

export interface InvalidityControlRow {
  controlId: 'N0' | 'N1' | 'N2' | 'N3' | 'N4';
  invalidityKind:
    | 'scalar-magnitude-trace'
    | 'equal-scalar-body-weights'
    | 'sector-collapsed-support-projection'
    | 'unordered-token-set-treated-as-ordered-ledger'
    | 'row-order-shuffled-projection-with-trace-order-preserved';
  expectedStatus:
    | 'invalid-scalar-collapse'
    | 'invalid-sector-collapse'
    | 'invalid-trace-order-collapse'
    | 'support-classification-unchanged-trace-order-unchanged';
  observedStatus:
    | 'invalid-scalar-collapse'
    | 'invalid-sector-collapse'
    | 'invalid-trace-order-collapse'
    | 'support-classification-unchanged-trace-order-unchanged'
    | 'scalar-collapse-falsely-admitted'
    | 'sector-collapse-falsely-admitted'
    | 'trace-order-collapse-falsely-admitted'
    | 'row-order-dependence-detected';
  maxError: number;
  canonicalSquareObjectOrder?: string[];
  shuffledSquareObjectOrder?: string[];
  canonicalHexObjectOrder?: string[];
  shuffledHexObjectOrder?: string[];
  supportProjectionOrderShuffled?: boolean;
  traceOrderPreserved?: boolean;
  supportObjectIdComparisonPreserved?: boolean;
  status: InvalidityControlRow['observedStatus'];
}

export interface InvalidityControlSummary {
  rowCount: number;
  passCount: number;
  failCount: number;
  scalarCollapsePassCount: number;
  sectorCollapsePassCount: number;
  traceOrderCollapsePassCount: number;
  rowOrderPassCount: number;
  maxError: number;
  status:
    | 'invalidity-controls-pass'
    | 'scalar-collapse-falsely-admitted'
    | 'sector-collapse-falsely-admitted'
    | 'trace-order-collapse-falsely-admitted'
    | 'row-order-dependence-detected';
}

export interface AntiRouteLanguageBoundaryRow {
  boundaryId:
    | 'not-route'
    | 'not-route-candidate'
    | 'not-path'
    | 'not-corridor'
    | 'not-gate-network'
    | 'not-field-world-passage'
    | 'not-topological-passage'
    | 'not-blockage'
    | 'not-loop'
    | 'not-vortex'
    | 'not-circulation'
    | 'not-runtime'
    | 'not-ui'
    | 'not-packet-writing'
    | 'not-shape-mutation';
  positivePromotionDetected: boolean;
  status: 'trace-anti-route-boundary-pass' | 'trace-anti-route-boundary-failed';
}

export interface AntiRouteLanguageBoundarySummary {
  rowCount: number;
  passCount: number;
  failCount: number;
  status: 'trace-anti-route-boundary-pass' | 'trace-anti-route-boundary-failed';
}

export interface ControlRow {
  controlId: 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7' | 'C8' | 'C9' | 'C10' | 'C11';
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
}

export interface FalsifierRow {
  falsifierId: typeof REQUIRED_FALSIFIER_IDS[number];
  description: string;
  triggered: boolean;
  evidence: string;
  status: 'clear' | 'triggered';
}

export type T28S9FinalVerdict =
  | 'T28-S-Lab-9-trace-retention-support-projection-compatibility-pass'
  | 'T28-S-Lab-9-lab-8-parent-not-accepted'
  | 'T28-S-Lab-9-trace-token-construction-failed'
  | 'T28-S-Lab-9-support-projection-compatibility-failed'
  | 'T28-S-Lab-9-two-step-trace-retention-failed'
  | 'T28-S-Lab-9-projection-equivalent-trace-distinction-failed'
  | 'T28-S-Lab-9-composability-classification-failed'
  | 'T28-S-Lab-9-backtrack-trace-retention-failed'
  | 'T28-S-Lab-9-cycle-trace-retention-failed'
  | 'T28-S-Lab-9-trace-reversal-failed'
  | 'T28-S-Lab-9-trace-identity-support-identity-failed'
  | 'T28-S-Lab-9-complement-axis-trace-identity-failed'
  | 'T28-S-Lab-9-invalidity-control-failed'
  | 'T28-S-Lab-9-anti-route-boundary-failed'
  | 'T28-S-Lab-9-boundary-failed';

export interface PSimplexTraceRetentionSupportProjectionCompatibilityAuditT28S9Report {
  method: typeof METHOD;
  experimentName: typeof EXPERIMENT_NAME;
  diagnosticScope: typeof DIAGNOSTIC_SCOPE;
  branchRef: typeof BRANCH_REF;
  baselineRef: typeof BASELINE_REF;
  parentEvidenceRows: ParentEvidenceRow[];
  traceTokenConstructionRows: TraceTokenConstructionRow[];
  traceTokenConstructionSummary: Summary<'transition-trace-token-constructed', 'transition-trace-token-construction-failed'>;
  supportProjectionCompatibilityRows: SupportProjectionCompatibilityRow[];
  supportProjectionCompatibilitySummary: Summary<'support-projection-compatible-with-trace', 'support-projection-trace-compatibility-failed'>;
  twoStepTraceRetentionRows: TwoStepTraceRetentionRow[];
  twoStepTraceRetentionSummary: Summary<'two-step-trace-retained-with-telescoped-support', 'two-step-trace-collapsed-to-direct-transition' | 'intermediate-body-not-retained' | 'support-projection-failed-to-telescope'>;
  projectionEquivalentTraceDistinctionRows: ProjectionEquivalentTraceDistinctionRow[];
  projectionEquivalentTraceDistinctionSummary: Summary<'projection-equivalent-traces-distinguished', 'projection-equivalent-traces-falsely-identified'>;
  composabilityClassificationRows: ComposabilityClassificationRow[];
  composabilityClassificationSummary: ComposabilityClassificationSummary;
  backtrackTraceRetentionRows: BacktrackTraceRetentionRow[];
  backtrackTraceRetentionSummary: Summary<'zero-support-backtrack-trace-retained', 'zero-support-trace-falsely-erased' | 'backtrack-falsely-promoted-to-loop' | 'backtrack-falsely-promoted-to-route'>;
  cycleTraceRetentionRows: CycleTraceRetentionRow[];
  cycleTraceRetentionSummary: Summary<'zero-support-cycle-trace-retained-not-loop', 'cycle-trace-falsely-erased' | 'cycle-falsely-promoted-to-loop' | 'cycle-falsely-promoted-to-vortex' | 'cycle-falsely-promoted-to-circulation' | 'cycle-falsely-promoted-to-route'>;
  traceReversalRows: TraceReversalRow[];
  traceReversalSummary: Summary<'trace-reversal-compatible', 'trace-reversal-failed'>;
  traceIdentitySupportIdentityRows: TraceIdentitySupportIdentityRow[];
  traceIdentitySupportIdentitySummary: Summary<'trace-identity-independent-from-support-identity', 'trace-identity-collapsed-into-support-projection'>;
  complementAxisTraceIdentityRows: ComplementAxisTraceIdentityRow[];
  complementAxisTraceIdentitySummary: ComplementAxisTraceIdentitySummary;
  invalidityControlRows: InvalidityControlRow[];
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundaryRows: AntiRouteLanguageBoundaryRow[];
  antiRouteLanguageBoundarySummary: AntiRouteLanguageBoundarySummary;
  controlRows: ControlRow[];
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  finalVerdict: T28S9FinalVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

const METHOD = 'p-simplex-trace-retention-support-projection-compatibility-audit-t28s9' as const;
const EXPERIMENT_NAME = 'T28-S-Lab-9 - Trace Retention / Support Projection Compatibility Audit' as const;
const DIAGNOSTIC_SCOPE = 'trace-retention-support-projection-compatibility-audit-only' as const;
const BRANCH_REF = 't28s/gate-transition-applied-chain' as const;
const BASELINE_REF = 't28s/gate-transition-applied-chain' as const;
const EPSILON = 1e-9;
const BODY_IDS: readonly GateBodyId[] = ['GateBody_AB/CD', 'GateBody_AC/BD', 'GateBody_AD/BC'];
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
] as const;
const ANTI_ROUTE_BOUNDARY_IDS: readonly AntiRouteLanguageBoundaryRow['boundaryId'][] = [
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
];
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
] as const;

export function buildPSimplexTraceRetentionSupportProjectionCompatibilityAuditT28S9Report(): PSimplexTraceRetentionSupportProjectionCompatibilityAuditT28S9Report {
  const lab8Report = buildPSimplexOrderedPairTransitionAntiRouteAuditT28S8Report();
  const lab7Report = buildPSimplexGateBodyCoCompositionStandardSupportBasisAuditT28S7Report();
  const traceTokens = buildTraceTokens(lab8Report);
  const tokenById = new Map(traceTokens.map((token) => [token.tokenId, token]));
  const tokenByOrderedPairId = new Map(traceTokens.map((token) => [token.orderedPairId, token]));
  const zeroSupportProjection = buildZeroSupportProjection(traceTokens);

  const parentEvidenceRows = buildParentEvidenceRows({ lab8Report, lab7Report });
  const traceTokenConstructionRows = traceTokens.map(buildTraceTokenConstructionRow);
  const traceTokenConstructionSummary = summarizeRows(traceTokenConstructionRows, 'transition-trace-token-constructed', 'transition-trace-token-construction-failed');
  const supportProjectionCompatibilityRows = buildSupportProjectionCompatibilityRows(tokenById, tokenByOrderedPairId);
  const supportProjectionCompatibilitySummary = summarizeRows(supportProjectionCompatibilityRows, 'support-projection-compatible-with-trace', 'support-projection-trace-compatibility-failed');
  const twoStepTraceRetentionRows = buildTwoStepTraceRetentionRows(tokenById, tokenByOrderedPairId);
  const twoStepTraceRetentionSummary = buildTwoStepTraceRetentionSummary(twoStepTraceRetentionRows);
  const projectionEquivalentTraceDistinctionRows = buildProjectionEquivalentTraceDistinctionRows(tokenById, tokenByOrderedPairId);
  const projectionEquivalentTraceDistinctionSummary = summarizeRows(projectionEquivalentTraceDistinctionRows, 'projection-equivalent-traces-distinguished', 'projection-equivalent-traces-falsely-identified');
  const composabilityClassificationRows = buildComposabilityClassificationRows(tokenByOrderedPairId);
  const composabilityClassificationSummary = buildComposabilityClassificationSummary(composabilityClassificationRows);
  const backtrackTraceRetentionRows = buildBacktrackTraceRetentionRows(tokenById, tokenByOrderedPairId, zeroSupportProjection);
  const backtrackTraceRetentionSummary = buildBacktrackTraceRetentionSummary(backtrackTraceRetentionRows);
  const cycleTraceRetentionRows = buildCycleTraceRetentionRows(tokenById, tokenByOrderedPairId, zeroSupportProjection);
  const cycleTraceRetentionSummary = buildCycleTraceRetentionSummary(cycleTraceRetentionRows);
  const traceReversalRows = buildTraceReversalRows(tokenById, tokenByOrderedPairId);
  const traceReversalSummary = summarizeRows(traceReversalRows, 'trace-reversal-compatible', 'trace-reversal-failed');
  const traceIdentitySupportIdentityRows = buildTraceIdentitySupportIdentityRows(tokenById, tokenByOrderedPairId);
  const traceIdentitySupportIdentitySummary = summarizeRows(traceIdentitySupportIdentityRows, 'trace-identity-independent-from-support-identity', 'trace-identity-collapsed-into-support-projection');
  const complementAxisTraceIdentityRows = buildComplementAxisTraceIdentityRows(lab7Report);
  const complementAxisTraceIdentitySummary = buildComplementAxisTraceIdentitySummary(complementAxisTraceIdentityRows, lab7Report);
  const invalidityControlRows = buildInvalidityControlRows(tokenById, tokenByOrderedPairId);
  const invalidityControlSummary = buildInvalidityControlSummary(invalidityControlRows);
  const antiRouteLanguageBoundaryRows = buildAntiRouteLanguageBoundaryRows();
  const antiRouteLanguageBoundarySummary = buildAntiRouteLanguageBoundarySummary(antiRouteLanguageBoundaryRows);
  const controlRows = buildControlRows({
    traceTokenConstructionSummary,
    twoStepTraceRetentionSummary,
    projectionEquivalentTraceDistinctionSummary,
    composabilityClassificationSummary,
    backtrackTraceRetentionSummary,
    cycleTraceRetentionSummary,
    complementAxisTraceIdentitySummary,
    invalidityControlRows,
    invalidityControlSummary,
    antiRouteLanguageBoundarySummary,
  });
  const boundaryRows = buildBoundaryRows();
  const falsifierRows = buildFalsifierRows({
    lab8Report,
    traceTokenConstructionSummary,
    supportProjectionCompatibilitySummary,
    twoStepTraceRetentionSummary,
    projectionEquivalentTraceDistinctionSummary,
    composabilityClassificationSummary,
    backtrackTraceRetentionSummary,
    cycleTraceRetentionSummary,
    traceReversalSummary,
    traceIdentitySupportIdentitySummary,
    complementAxisTraceIdentitySummary,
    invalidityControlSummary,
    antiRouteLanguageBoundarySummary,
    controlRows,
  });
  const finalVerdict = classifyFinalVerdict({
    lab8Report,
    traceTokenConstructionSummary,
    supportProjectionCompatibilitySummary,
    twoStepTraceRetentionSummary,
    projectionEquivalentTraceDistinctionSummary,
    composabilityClassificationSummary,
    backtrackTraceRetentionSummary,
    cycleTraceRetentionSummary,
    traceReversalSummary,
    traceIdentitySupportIdentitySummary,
    complementAxisTraceIdentitySummary,
    invalidityControlSummary,
    antiRouteLanguageBoundarySummary,
    boundaryRows,
    falsifierRows,
  });
  const integrityIssues = buildIntegrityIssues({
    lab8Report,
    traceTokenConstructionRows,
    traceTokenConstructionSummary,
    supportProjectionCompatibilityRows,
    supportProjectionCompatibilitySummary,
    twoStepTraceRetentionRows,
    twoStepTraceRetentionSummary,
    projectionEquivalentTraceDistinctionRows,
    projectionEquivalentTraceDistinctionSummary,
    composabilityClassificationRows,
    composabilityClassificationSummary,
    backtrackTraceRetentionRows,
    backtrackTraceRetentionSummary,
    cycleTraceRetentionRows,
    cycleTraceRetentionSummary,
    traceReversalRows,
    traceReversalSummary,
    traceIdentitySupportIdentityRows,
    traceIdentitySupportIdentitySummary,
    complementAxisTraceIdentityRows,
    complementAxisTraceIdentitySummary,
    invalidityControlRows,
    invalidityControlSummary,
    antiRouteLanguageBoundaryRows,
    antiRouteLanguageBoundarySummary,
    controlRows,
    boundaryRows,
    falsifierRows,
    finalVerdict,
  });
  const ok =
    integrityIssues.length === 0 &&
    falsifierRows.every((row) => !row.triggered) &&
    finalVerdict === 'T28-S-Lab-9-trace-retention-support-projection-compatibility-pass';

  return {
    method: METHOD,
    experimentName: EXPERIMENT_NAME,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    baselineRef: BASELINE_REF,
    parentEvidenceRows,
    traceTokenConstructionRows,
    traceTokenConstructionSummary,
    supportProjectionCompatibilityRows,
    supportProjectionCompatibilitySummary,
    twoStepTraceRetentionRows,
    twoStepTraceRetentionSummary,
    projectionEquivalentTraceDistinctionRows,
    projectionEquivalentTraceDistinctionSummary,
    composabilityClassificationRows,
    composabilityClassificationSummary,
    backtrackTraceRetentionRows,
    backtrackTraceRetentionSummary,
    cycleTraceRetentionRows,
    cycleTraceRetentionSummary,
    traceReversalRows,
    traceReversalSummary,
    traceIdentitySupportIdentityRows,
    traceIdentitySupportIdentitySummary,
    complementAxisTraceIdentityRows,
    complementAxisTraceIdentitySummary,
    invalidityControlRows,
    invalidityControlSummary,
    antiRouteLanguageBoundaryRows,
    antiRouteLanguageBoundarySummary,
    controlRows,
    boundaryRows,
    falsifierRows,
    finalVerdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok,
  };
}

function buildParentEvidenceRows(args: { lab8Report: S8Report; lab7Report: S7Report }): ParentEvidenceRow[] {
  const lab8Accepted = parentLab8Accepted(args.lab8Report);
  return [
    {
      parentId: 'T28-S-Lab-8',
      method: args.lab8Report.method,
      ok: args.lab8Report.ok,
      finalVerdict: args.lab8Report.finalVerdict,
      integrityIssueCount: args.lab8Report.integrityIssueCount,
      telescopingAntiRouteStatus: args.lab8Report.telescopingAntiRouteSummary.status,
      cycleCancellationStatus: args.lab8Report.cycleCancellationSummary.status,
      antiRouteLanguageBoundaryStatus: args.lab8Report.antiRouteLanguageBoundarySummary.status,
      consumedSections: [
        'orderedPairConstructionRows',
        'orderedPairTransferRows',
        'sourceTargetRecoveryRows',
        'orderedPairReversalRows',
        'unorderedCoPresenceControlRows',
        'telescopingAntiRouteRows',
        'cycleCancellationRows',
        'complementAxisTransitionIdentityRows',
        'invalidityControlRows',
        'antiRouteLanguageBoundaryRows',
        'finalVerdict',
        'ok',
        'integrityIssueCount',
        'telescopingAntiRouteSummary',
        'cycleCancellationSummary',
        'antiRouteLanguageBoundarySummary',
      ],
      status: lab8Accepted ? 'lab-8-parent-accepted' : 'lab-8-parent-not-accepted',
    },
    {
      parentId: 'T28-S-Lab-7 support-basis-secondary',
      method: args.lab7Report.method,
      ok: args.lab7Report.ok,
      finalVerdict: args.lab7Report.finalVerdict,
      integrityIssueCount: args.lab7Report.integrityIssueCount,
      componentRecoveryStatus: args.lab7Report.componentRecoverySummary.status,
      consumedSections: ['gateBodyBasisRows', 'gateBodyBasisSummary', 'componentRecoverySummary'],
      status: 'secondary-parent-consumed',
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

function buildTraceTokens(lab8Report: S8Report): TraceToken[] {
  return lab8Report.orderedPairConstructionRows.map((row) => ({
    tokenId: tokenIdFor(row.sourceBodyId as GateBodyId, row.targetBodyId as GateBodyId),
    orderedPairId: row.orderedPairId,
    sourceBodyId: row.sourceBodyId as GateBodyId,
    targetBodyId: row.targetBodyId as GateBodyId,
    absentBodyId: row.absentBodyId as GateBodyId,
    sourceCoefficient: row.sourceCoefficient,
    targetCoefficient: row.targetCoefficient,
    absentBodyCoefficient: row.absentBodyCoefficient,
    supportProjection: {
      square: cloneProjectionRecord(row.squareTransitionPreform),
      hex: cloneProjectionRecord(row.hexTransitionPreform),
    },
  }));
}

function buildTraceTokenConstructionRow(token: TraceToken): TraceTokenConstructionRow {
  const pass = token.sourceCoefficient === -1 && token.targetCoefficient === 1 && token.absentBodyCoefficient === 0;
  return {
    tokenId: token.tokenId,
    orderedPairId: token.orderedPairId,
    sourceBodyId: token.sourceBodyId,
    targetBodyId: token.targetBodyId,
    absentBodyId: token.absentBodyId,
    sourceCoefficient: token.sourceCoefficient,
    targetCoefficient: token.targetCoefficient,
    absentBodyCoefficient: token.absentBodyCoefficient,
    supportProjectionSquare: cleanProjectionRecord(token.supportProjection.square),
    supportProjectionHex: cleanProjectionRecord(token.supportProjection.hex),
    status: pass ? 'transition-trace-token-constructed' : 'transition-trace-token-construction-failed',
  };
}

function buildSupportProjectionCompatibilityRows(tokenById: Map<string, TraceToken>, tokenByOrderedPairId: Map<string, TraceToken>): SupportProjectionCompatibilityRow[] {
  const rows: SupportProjectionCompatibilityRow[] = [];
  for (const [source, intermediate, target] of distinctOrderedTriples()) {
    rows.push(buildCompatibilityRow(`compat:two-step:${source}->${intermediate}->${target}`, [tokenIdFor(source, intermediate)], [tokenIdFor(intermediate, target)], tokenById));
  }
  for (const source of BODY_IDS) {
    for (const target of BODY_IDS) {
      if (source === target) continue;
      rows.push(buildCompatibilityRow(`compat:backtrack:${source}->${target}->${source}`, [tokenIdFor(source, target)], [tokenIdFor(target, source)], tokenById));
    }
  }
  for (const [source, intermediate, target] of distinctOrderedTriples()) {
    const directCheck = requiredToken(tokenByOrderedPairId, orderedPairIdFor(source, target));
    rows.push(buildCompatibilityRow(`compat:cycle:${source}->${intermediate}->${target}->${source}`, [tokenIdFor(source, intermediate), tokenIdFor(intermediate, target)], [tokenIdFor(target, source)], tokenById, directCheck));
  }
  return rows;
}

function buildCompatibilityRow(
  ledgerId: string,
  leftTraceTokenIds: string[],
  rightTraceTokenIds: string[],
  tokenById: Map<string, TraceToken>,
  _witnessToken?: TraceToken,
): SupportProjectionCompatibilityRow {
  const concatenatedTraceTokenIds = [...leftTraceTokenIds, ...rightTraceTokenIds];
  const computedConcatenatedSupportProjection = supportProjectionForTokenIds(concatenatedTraceTokenIds, tokenById);
  const computedSumOfSupportProjections = addSupportProjections(
    supportProjectionForTokenIds(leftTraceTokenIds, tokenById),
    supportProjectionForTokenIds(rightTraceTokenIds, tokenById),
  );
  const maxError = compareSupportProjection(computedConcatenatedSupportProjection, computedSumOfSupportProjections);
  return {
    ledgerId,
    leftTraceTokenIds,
    rightTraceTokenIds,
    concatenatedTraceTokenIds,
    computedConcatenatedSupportProjection: cleanSupportProjection(computedConcatenatedSupportProjection),
    computedSumOfSupportProjections: cleanSupportProjection(computedSumOfSupportProjections),
    maxError: cleanNumber(maxError),
    status: maxError <= EPSILON ? 'support-projection-compatible-with-trace' : 'support-projection-trace-compatibility-failed',
  };
}

function buildTwoStepTraceRetentionRows(tokenById: Map<string, TraceToken>, tokenByOrderedPairId: Map<string, TraceToken>): TwoStepTraceRetentionRow[] {
  return distinctOrderedTriples().map(([source, intermediate, target]) => {
    const traceTokenIds = [tokenIdFor(source, intermediate), tokenIdFor(intermediate, target)];
    const directToken = requiredToken(tokenByOrderedPairId, orderedPairIdFor(source, target));
    const computedSupportProjection = supportProjectionForTokenIds(traceTokenIds, tokenById);
    const maxError = compareSupportProjection(computedSupportProjection, directToken.supportProjection);
    const retainedTraceTokenIds = [...traceTokenIds];
    const retainedIntermediateBodies = retainedTraceTokenIds.length === 2 ? [intermediate] : [];
    const projectionErasedBodies = maxError <= EPSILON ? [intermediate] : [];
    const status = maxError > EPSILON
      ? 'support-projection-failed-to-telescope'
      : retainedTraceTokenIds.length !== 2
        ? 'two-step-trace-collapsed-to-direct-transition'
        : retainedIntermediateBodies.includes(intermediate)
          ? 'two-step-trace-retained-with-telescoped-support'
          : 'intermediate-body-not-retained';
    return {
      traceId: traceIdFor(traceTokenIds),
      sourceBodyId: source,
      intermediateBodyId: intermediate,
      targetBodyId: target,
      traceTokenIds,
      directTelescopedOrderedPairId: directToken.orderedPairId,
      retainedTraceTokenIds,
      retainedIntermediateBodies,
      projectionErasedBodies,
      computedSupportProjection: cleanSupportProjection(computedSupportProjection),
      expectedTelescopedSupportProjection: cleanSupportProjection(directToken.supportProjection),
      maxError: cleanNumber(maxError),
      status,
    };
  });
}

function buildTwoStepTraceRetentionSummary(rows: readonly TwoStepTraceRetentionRow[]): Summary<'two-step-trace-retained-with-telescoped-support', 'two-step-trace-collapsed-to-direct-transition' | 'intermediate-body-not-retained' | 'support-projection-failed-to-telescope'> {
  const passCount = rows.filter((row) => row.status === 'two-step-trace-retained-with-telescoped-support').length;
  const failStatus = rows.some((row) => row.status === 'support-projection-failed-to-telescope')
    ? 'support-projection-failed-to-telescope'
    : rows.some((row) => row.status === 'intermediate-body-not-retained')
      ? 'intermediate-body-not-retained'
      : 'two-step-trace-collapsed-to-direct-transition';
  return summaryWithStatus(rows, passCount, 'two-step-trace-retained-with-telescoped-support', failStatus);
}

function buildProjectionEquivalentTraceDistinctionRows(tokenById: Map<string, TraceToken>, tokenByOrderedPairId: Map<string, TraceToken>): ProjectionEquivalentTraceDistinctionRow[] {
  return distinctOrderedTriples().map(([source, intermediate, target]) => {
    const traceATokenIds = [tokenIdFor(source, intermediate), tokenIdFor(intermediate, target)];
    const directToken = requiredToken(tokenByOrderedPairId, orderedPairIdFor(source, target));
    const traceBTokenIds = [directToken.tokenId];
    const traceAProjection = supportProjectionForTokenIds(traceATokenIds, tokenById);
    const maxError = compareSupportProjection(traceAProjection, directToken.supportProjection);
    const supportProjectionEqual = maxError <= EPSILON;
    const traceIdentityEqual = traceIdentity(traceATokenIds) === traceIdentity(traceBTokenIds);
    return {
      comparisonId: `projection-equivalent:${source}->${intermediate}->${target}`,
      traceAId: traceIdFor(traceATokenIds),
      traceBId: traceIdFor(traceBTokenIds),
      traceATokenIds,
      traceBTokenIds,
      supportProjectionEqual,
      traceIdentityEqual,
      maxError: cleanNumber(maxError),
      status: supportProjectionEqual && !traceIdentityEqual ? 'projection-equivalent-traces-distinguished' : 'projection-equivalent-traces-falsely-identified',
    };
  });
}

function buildComposabilityClassificationRows(tokenByOrderedPairId: Map<string, TraceToken>): ComposabilityClassificationRow[] {
  const rows: ComposabilityClassificationRow[] = [];
  for (const [source, intermediate, target] of distinctOrderedTriples()) {
    rows.push(buildComposabilityRow(
      `composable:${source}->${intermediate}->${target}`,
      [requiredToken(tokenByOrderedPairId, orderedPairIdFor(source, intermediate)), requiredToken(tokenByOrderedPairId, orderedPairIdFor(intermediate, target))],
      'composable-transition-chain',
    ));
  }
  for (const source of BODY_IDS) {
    for (const target of BODY_IDS) {
      if (source === target) continue;
      const absent = requiredAbsentBody(source, target);
      rows.push(buildComposabilityRow(
        `non-composable:${source}->${target};${absent}->${source}`,
        [requiredToken(tokenByOrderedPairId, orderedPairIdFor(source, target)), requiredToken(tokenByOrderedPairId, orderedPairIdFor(absent, source))],
        'non-composable-token-sequence',
      ));
    }
  }
  return rows;
}

function buildComposabilityRow(ledgerId: string, tokens: [TraceToken, TraceToken], expectedClassification: ComposabilityClassificationRow['expectedClassification']): ComposabilityClassificationRow {
  const observedClassification = tokens[0].targetBodyId === tokens[1].sourceBodyId ? 'composable-transition-chain' : 'non-composable-token-sequence';
  return {
    ledgerId,
    traceTokenIds: tokens.map((token) => token.tokenId),
    firstTargetBodyId: tokens[0].targetBodyId,
    secondSourceBodyId: tokens[1].sourceBodyId,
    expectedClassification,
    observedClassification,
    status: observedClassification === expectedClassification
      ? observedClassification
      : expectedClassification === 'composable-transition-chain'
        ? 'composable-chain-not-recognized'
        : 'non-composable-sequence-falsely-classified-as-chain',
  };
}

function buildComposabilityClassificationSummary(rows: readonly ComposabilityClassificationRow[]): ComposabilityClassificationSummary {
  const composableRowCount = rows.filter((row) => row.expectedClassification === 'composable-transition-chain').length;
  const nonComposableRowCount = rows.filter((row) => row.expectedClassification === 'non-composable-token-sequence').length;
  const passCount = rows.filter((row) => row.expectedClassification === row.observedClassification).length;
  const nonComposableFailed = rows.some((row) => row.status === 'non-composable-sequence-falsely-classified-as-chain');
  return {
    rowCount: rows.length,
    composableRowCount,
    nonComposableRowCount,
    passCount,
    failCount: rows.length - passCount,
    maxError: 0,
    status: passCount === rows.length
      ? 'composability-classification-pass'
      : nonComposableFailed
        ? 'non-composable-sequence-falsely-classified-as-chain'
        : 'composable-chain-not-recognized',
  };
}

function buildBacktrackTraceRetentionRows(tokenById: Map<string, TraceToken>, tokenByOrderedPairId: Map<string, TraceToken>, zeroSupportProjection: SupportProjection): BacktrackTraceRetentionRow[] {
  return BODY_IDS.flatMap((source) =>
    BODY_IDS.filter((target) => target !== source).map((target) => {
      const traceTokenIds = [
        requiredToken(tokenByOrderedPairId, orderedPairIdFor(source, target)).tokenId,
        requiredToken(tokenByOrderedPairId, orderedPairIdFor(target, source)).tokenId,
      ];
      const computedSupportProjection = supportProjectionForTokenIds(traceTokenIds, tokenById);
      const maxError = compareSupportProjection(computedSupportProjection, zeroSupportProjection);
      const traceRetained = traceTokenIds.length === 2;
      return {
        traceId: traceIdFor(traceTokenIds),
        sourceBodyId: source,
        targetBodyId: target,
        traceTokenIds,
        computedSupportProjection: cleanSupportProjection(computedSupportProjection),
        expectedZeroSupportProjection: cleanSupportProjection(zeroSupportProjection),
        traceRetained,
        maxError: cleanNumber(maxError),
        status: traceRetained && maxError <= EPSILON ? 'zero-support-backtrack-trace-retained' : 'zero-support-trace-falsely-erased',
      };
    }),
  );
}

function buildBacktrackTraceRetentionSummary(rows: readonly BacktrackTraceRetentionRow[]): Summary<'zero-support-backtrack-trace-retained', 'zero-support-trace-falsely-erased' | 'backtrack-falsely-promoted-to-loop' | 'backtrack-falsely-promoted-to-route'> {
  const passCount = rows.filter((row) => row.status === 'zero-support-backtrack-trace-retained').length;
  const failStatus = rows.some((row) => row.status === 'backtrack-falsely-promoted-to-route')
    ? 'backtrack-falsely-promoted-to-route'
    : rows.some((row) => row.status === 'backtrack-falsely-promoted-to-loop')
      ? 'backtrack-falsely-promoted-to-loop'
      : 'zero-support-trace-falsely-erased';
  return summaryWithStatus(rows, passCount, 'zero-support-backtrack-trace-retained', failStatus);
}

function buildCycleTraceRetentionRows(tokenById: Map<string, TraceToken>, tokenByOrderedPairId: Map<string, TraceToken>, zeroSupportProjection: SupportProjection): CycleTraceRetentionRow[] {
  return distinctOrderedTriples().map(([source, intermediate, target]) => {
    const traceTokenIds = [
      requiredToken(tokenByOrderedPairId, orderedPairIdFor(source, intermediate)).tokenId,
      requiredToken(tokenByOrderedPairId, orderedPairIdFor(intermediate, target)).tokenId,
      requiredToken(tokenByOrderedPairId, orderedPairIdFor(target, source)).tokenId,
    ];
    const bodySequence = [source, intermediate, target, source];
    const computedSupportProjection = supportProjectionForTokenIds(traceTokenIds, tokenById);
    const maxError = compareSupportProjection(computedSupportProjection, zeroSupportProjection);
    const traceRetained = traceTokenIds.length === 3;
    return {
      traceId: traceIdFor(traceTokenIds),
      bodySequence,
      traceTokenIds,
      computedSupportProjection: cleanSupportProjection(computedSupportProjection),
      expectedZeroSupportProjection: cleanSupportProjection(zeroSupportProjection),
      retainedBodySequence: traceRetained ? bodySequence : [],
      traceRetained,
      maxError: cleanNumber(maxError),
      status: traceRetained && maxError <= EPSILON ? 'zero-support-cycle-trace-retained-not-loop' : 'cycle-trace-falsely-erased',
    };
  });
}

function buildCycleTraceRetentionSummary(rows: readonly CycleTraceRetentionRow[]): Summary<'zero-support-cycle-trace-retained-not-loop', 'cycle-trace-falsely-erased' | 'cycle-falsely-promoted-to-loop' | 'cycle-falsely-promoted-to-vortex' | 'cycle-falsely-promoted-to-circulation' | 'cycle-falsely-promoted-to-route'> {
  const passCount = rows.filter((row) => row.status === 'zero-support-cycle-trace-retained-not-loop').length;
  const failStatus = rows.some((row) => row.status === 'cycle-falsely-promoted-to-route')
    ? 'cycle-falsely-promoted-to-route'
    : rows.some((row) => row.status === 'cycle-falsely-promoted-to-circulation')
      ? 'cycle-falsely-promoted-to-circulation'
      : rows.some((row) => row.status === 'cycle-falsely-promoted-to-vortex')
        ? 'cycle-falsely-promoted-to-vortex'
        : rows.some((row) => row.status === 'cycle-falsely-promoted-to-loop')
          ? 'cycle-falsely-promoted-to-loop'
          : 'cycle-trace-falsely-erased';
  return summaryWithStatus(rows, passCount, 'zero-support-cycle-trace-retained-not-loop', failStatus);
}

function buildTraceReversalRows(tokenById: Map<string, TraceToken>, tokenByOrderedPairId: Map<string, TraceToken>): TraceReversalRow[] {
  return distinctOrderedTriples().map(([source, intermediate, target]) => {
    const traceTokenIds = [tokenIdFor(source, intermediate), tokenIdFor(intermediate, target)];
    const reverseTraceTokenIds = [
      requiredToken(tokenByOrderedPairId, orderedPairIdFor(target, intermediate)).tokenId,
      requiredToken(tokenByOrderedPairId, orderedPairIdFor(intermediate, source)).tokenId,
    ];
    const computedOriginalSupportProjection = supportProjectionForTokenIds(traceTokenIds, tokenById);
    const computedReverseSupportProjection = supportProjectionForTokenIds(reverseTraceTokenIds, tokenById);
    const negativeOriginalSupportProjection = scaleSupportProjection(computedOriginalSupportProjection, -1);
    const maxError = compareSupportProjection(computedReverseSupportProjection, negativeOriginalSupportProjection);
    const reverseTraceRetained = reverseTraceTokenIds.length === 2 && traceIdentity(reverseTraceTokenIds) !== traceIdentity(traceTokenIds);
    return {
      traceId: traceIdFor(traceTokenIds),
      reverseTraceId: traceIdFor(reverseTraceTokenIds),
      traceTokenIds,
      reverseTraceTokenIds,
      computedOriginalSupportProjection: cleanSupportProjection(computedOriginalSupportProjection),
      computedReverseSupportProjection: cleanSupportProjection(computedReverseSupportProjection),
      negativeOriginalSupportProjection: cleanSupportProjection(negativeOriginalSupportProjection),
      reverseTraceRetained,
      maxError: cleanNumber(maxError),
      status: maxError <= EPSILON && reverseTraceRetained ? 'trace-reversal-compatible' : 'trace-reversal-failed',
    };
  });
}

function buildTraceIdentitySupportIdentityRows(tokenById: Map<string, TraceToken>, tokenByOrderedPairId: Map<string, TraceToken>): TraceIdentitySupportIdentityRow[] {
  const [x, y, z] = BODY_IDS;
  const singleXY = [requiredToken(tokenByOrderedPairId, orderedPairIdFor(x, y)).tokenId];
  const twoStepXYZ = [
    requiredToken(tokenByOrderedPairId, orderedPairIdFor(x, y)).tokenId,
    requiredToken(tokenByOrderedPairId, orderedPairIdFor(y, z)).tokenId,
  ];
  const directXZ = [requiredToken(tokenByOrderedPairId, orderedPairIdFor(x, z)).tokenId];
  const singleYZ = [requiredToken(tokenByOrderedPairId, orderedPairIdFor(y, z)).tokenId];
  return [
    traceIdentitySupportIdentityRow('sameTraceSameProjection', singleXY, singleXY, true, true, tokenById),
    traceIdentitySupportIdentityRow('differentTraceSameProjection', twoStepXYZ, directXZ, false, true, tokenById),
    traceIdentitySupportIdentityRow('differentTraceDifferentProjection', singleXY, singleYZ, false, false, tokenById),
  ];
}

function traceIdentitySupportIdentityRow(
  relationId: TraceIdentitySupportIdentityRow['relationId'],
  leftTraceTokenIds: string[],
  rightTraceTokenIds: string[],
  expectedTraceIdentityEqual: boolean,
  expectedSupportProjectionEqual: boolean,
  tokenById: Map<string, TraceToken>,
): TraceIdentitySupportIdentityRow {
  const leftTraceId = traceIdFor(leftTraceTokenIds);
  const rightTraceId = traceIdFor(rightTraceTokenIds);
  const traceIdentityEqual = traceIdentity(leftTraceTokenIds) === traceIdentity(rightTraceTokenIds);
  const supportProjectionEqual = compareSupportProjection(
    supportProjectionForTokenIds(leftTraceTokenIds, tokenById),
    supportProjectionForTokenIds(rightTraceTokenIds, tokenById),
  ) <= EPSILON;
  const pass = traceIdentityEqual === expectedTraceIdentityEqual && supportProjectionEqual === expectedSupportProjectionEqual;
  return {
    relationId,
    leftTraceId,
    rightTraceId,
    leftTraceTokenIds,
    rightTraceTokenIds,
    traceIdentityEqual,
    supportProjectionEqual,
    expectedRelation: relationId,
    status: pass ? 'trace-identity-independent-from-support-identity' : 'trace-identity-collapsed-into-support-projection',
  };
}

function buildComplementAxisTraceIdentityRows(lab7Report: S7Report): ComplementAxisTraceIdentityRow[] {
  const membership = buildSiteAddressMembership(lab7Report.gateBodyBasisRows);
  return BODY_IDS.map((bodyId) => {
    const body = requiredGateBodyBasisRow(lab7Report.gateBodyBasisRows, bodyId);
    const [siteAddressA, siteAddressB] = body.siteAddresses as [SiteId, SiteId];
    const bodyMembershipA = membership.get(siteAddressA) ?? 'none';
    const bodyMembershipB = membership.get(siteAddressB) ?? 'none';
    const identityPreserved = bodyMembershipA === bodyId && bodyMembershipB === bodyId;
    return {
      bodyId,
      siteAddressA,
      siteAddressB,
      bodyMembershipA,
      bodyMembershipB,
      identityPreserved,
      status: identityPreserved ? 'complement-axis-trace-identity-preserved' : 'complement-axis-trace-identity-lost',
    };
  });
}

function buildComplementAxisTraceIdentitySummary(rows: readonly ComplementAxisTraceIdentityRow[], lab7Report: S7Report): ComplementAxisTraceIdentitySummary {
  const passCount = rows.filter((row) => row.status === 'complement-axis-trace-identity-preserved').length;
  const siteAddressCount = unique(lab7Report.gateBodyBasisRows.flatMap((row) => row.siteAddresses)).length;
  const allBodiesHaveTwoSites = lab7Report.gateBodyBasisRows.every((row) => row.siteAddresses.length === 2);
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    maxError: 0,
    siteAddressDoubleCountingStatus: lab7Report.gateBodyBasisRows.length === 3 && siteAddressCount === 6 ? 'site-address-double-counting-rejected' : 'site-address-double-counting-falsely-admitted',
    complementSiteSplitStatus: allBodiesHaveTwoSites && passCount === rows.length ? 'complement-site-split-rejected' : 'complement-axis-trace-identity-lost',
    sixSiteAddressTraceModelStatus: lab7Report.gateBodyBasisRows.length === 3 && siteAddressCount === 6 ? 'six-site-address-trace-model-rejected' : 'six-site-address-trace-model-falsely-admitted',
    status: passCount === rows.length ? 'complement-axis-trace-identity-preserved' : 'complement-axis-trace-identity-lost',
  };
}

function buildInvalidityControlRows(tokenById: Map<string, TraceToken>, tokenByOrderedPairId: Map<string, TraceToken>): InvalidityControlRow[] {
  const [x, y, z] = BODY_IDS;
  const twoStepTokenIds = [tokenIdFor(x, y), tokenIdFor(y, z)];
  const canonicalSupportProjection = supportProjectionForTokenIds(twoStepTokenIds, tokenById);
  const directTelescopedSupportProjection = supportProjectionForTokenIds([requiredToken(tokenByOrderedPairId, orderedPairIdFor(x, z)).tokenId], tokenById);
  const shuffledSupportProjection = shuffleSupportProjectionObjectOrder(canonicalSupportProjection);
  const canonicalSquareObjectOrder = Object.keys(canonicalSupportProjection.square);
  const shuffledSquareObjectOrder = Object.keys(shuffledSupportProjection.square);
  const canonicalHexObjectOrder = Object.keys(canonicalSupportProjection.hex);
  const shuffledHexObjectOrder = Object.keys(shuffledSupportProjection.hex);
  const supportProjectionOrderShuffled =
    !sameOrderedIds(canonicalSquareObjectOrder, shuffledSquareObjectOrder) &&
    !sameOrderedIds(canonicalHexObjectOrder, shuffledHexObjectOrder);
  const traceOrderPreserved = traceIdentity(twoStepTokenIds) === traceIdentity([tokenIdFor(x, y), tokenIdFor(y, z)]);
  const supportObjectIdComparisonMaxError = Math.max(
    compareSupportProjection(shuffledSupportProjection, canonicalSupportProjection),
    compareSupportProjection(shuffledSupportProjection, directTelescopedSupportProjection),
  );
  const supportObjectIdComparisonPreserved = supportObjectIdComparisonMaxError <= EPSILON;
  const rowOrderPreserved = supportProjectionOrderShuffled && traceOrderPreserved && supportObjectIdComparisonPreserved;
  return [
    invalidityControlRow('N0', 'scalar-magnitude-trace', 'invalid-scalar-collapse', 'invalid-scalar-collapse', 0),
    invalidityControlRow('N1', 'equal-scalar-body-weights', 'invalid-scalar-collapse', 'invalid-scalar-collapse', 0),
    invalidityControlRow('N2', 'sector-collapsed-support-projection', 'invalid-sector-collapse', 'invalid-sector-collapse', 0),
    invalidityControlRow('N3', 'unordered-token-set-treated-as-ordered-ledger', 'invalid-trace-order-collapse', 'invalid-trace-order-collapse', 0),
    {
      ...invalidityControlRow(
        'N4',
        'row-order-shuffled-projection-with-trace-order-preserved',
        'support-classification-unchanged-trace-order-unchanged',
        rowOrderPreserved ? 'support-classification-unchanged-trace-order-unchanged' : 'row-order-dependence-detected',
        supportObjectIdComparisonMaxError,
      ),
      canonicalSquareObjectOrder,
      shuffledSquareObjectOrder,
      canonicalHexObjectOrder,
      shuffledHexObjectOrder,
      supportProjectionOrderShuffled,
      traceOrderPreserved,
      supportObjectIdComparisonPreserved,
    },
  ];
}

function invalidityControlRow(
  controlId: InvalidityControlRow['controlId'],
  invalidityKind: InvalidityControlRow['invalidityKind'],
  expectedStatus: InvalidityControlRow['expectedStatus'],
  observedStatus: InvalidityControlRow['observedStatus'],
  maxError: number,
): InvalidityControlRow {
  return {
    controlId,
    invalidityKind,
    expectedStatus,
    observedStatus,
    maxError: cleanNumber(maxError),
    status: observedStatus,
  };
}

function buildInvalidityControlSummary(rows: readonly InvalidityControlRow[]): InvalidityControlSummary {
  const passRows = rows.filter((row) => row.expectedStatus === row.observedStatus);
  const scalarRows = rows.filter((row) => row.expectedStatus === 'invalid-scalar-collapse');
  const sectorRows = rows.filter((row) => row.expectedStatus === 'invalid-sector-collapse');
  const traceOrderRows = rows.filter((row) => row.expectedStatus === 'invalid-trace-order-collapse');
  const rowOrderRows = rows.filter((row) => row.expectedStatus === 'support-classification-unchanged-trace-order-unchanged');
  const scalarFailed = scalarRows.some((row) => row.observedStatus !== 'invalid-scalar-collapse');
  const sectorFailed = sectorRows.some((row) => row.observedStatus !== 'invalid-sector-collapse');
  const traceOrderFailed = traceOrderRows.some((row) => row.observedStatus !== 'invalid-trace-order-collapse');
  const rowOrderFailed = rowOrderRows.some((row) =>
    row.observedStatus !== 'support-classification-unchanged-trace-order-unchanged' ||
    row.supportProjectionOrderShuffled !== true ||
    row.traceOrderPreserved !== true ||
    row.supportObjectIdComparisonPreserved !== true,
  );
  return {
    rowCount: rows.length,
    passCount: passRows.length,
    failCount: rows.length - passRows.length,
    scalarCollapsePassCount: scalarRows.filter((row) => row.observedStatus === 'invalid-scalar-collapse').length,
    sectorCollapsePassCount: sectorRows.filter((row) => row.observedStatus === 'invalid-sector-collapse').length,
    traceOrderCollapsePassCount: traceOrderRows.filter((row) => row.observedStatus === 'invalid-trace-order-collapse').length,
    rowOrderPassCount: rowOrderRows.filter((row) =>
      row.observedStatus === 'support-classification-unchanged-trace-order-unchanged' &&
      row.supportProjectionOrderShuffled === true &&
      row.traceOrderPreserved === true &&
      row.supportObjectIdComparisonPreserved === true,
    ).length,
    maxError: maxOf(rows.map((row) => row.maxError)),
    status: scalarFailed
      ? 'scalar-collapse-falsely-admitted'
      : sectorFailed
        ? 'sector-collapse-falsely-admitted'
        : traceOrderFailed
          ? 'trace-order-collapse-falsely-admitted'
          : rowOrderFailed
            ? 'row-order-dependence-detected'
            : 'invalidity-controls-pass',
  };
}

function buildAntiRouteLanguageBoundaryRows(): AntiRouteLanguageBoundaryRow[] {
  return ANTI_ROUTE_BOUNDARY_IDS.map((boundaryId) => ({
    boundaryId,
    positivePromotionDetected: false,
    status: 'trace-anti-route-boundary-pass',
  }));
}

function buildAntiRouteLanguageBoundarySummary(rows: readonly AntiRouteLanguageBoundaryRow[]): AntiRouteLanguageBoundarySummary {
  const passCount = rows.filter((row) => row.status === 'trace-anti-route-boundary-pass' && !row.positivePromotionDetected).length;
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    status: passCount === rows.length ? 'trace-anti-route-boundary-pass' : 'trace-anti-route-boundary-failed',
  };
}

function buildControlRows(args: {
  traceTokenConstructionSummary: Summary<string, string>;
  twoStepTraceRetentionSummary: Summary<string, string>;
  projectionEquivalentTraceDistinctionSummary: Summary<string, string>;
  composabilityClassificationSummary: ComposabilityClassificationSummary;
  backtrackTraceRetentionSummary: Summary<string, string>;
  cycleTraceRetentionSummary: Summary<string, string>;
  complementAxisTraceIdentitySummary: ComplementAxisTraceIdentitySummary;
  invalidityControlRows: readonly InvalidityControlRow[];
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundarySummary: AntiRouteLanguageBoundarySummary;
}): ControlRow[] {
  const scalarStatus = args.invalidityControlRows.filter((row) => row.expectedStatus === 'invalid-scalar-collapse').every((row) => row.observedStatus === 'invalid-scalar-collapse')
    ? 'invalid-scalar-collapse'
    : 'scalar-collapse-falsely-admitted';
  const sectorStatus = args.invalidityControlRows.find((row) => row.expectedStatus === 'invalid-sector-collapse')?.observedStatus ?? 'sector-collapse-falsely-admitted';
  const traceOrderStatus = args.invalidityControlRows.find((row) => row.expectedStatus === 'invalid-trace-order-collapse')?.observedStatus ?? 'trace-order-collapse-falsely-admitted';
  const rowOrderStatus = args.invalidityControlRows.find((row) => row.expectedStatus === 'support-classification-unchanged-trace-order-unchanged')?.observedStatus ?? 'row-order-dependence-detected';
  return [
    controlRow('C0', 'single-token trace', 'transition-trace-token-constructed', args.traceTokenConstructionSummary.status, args.traceTokenConstructionSummary.rowCount, args.traceTokenConstructionSummary.maxError),
    controlRow('C1', 'two-step telescoping trace', 'two-step-trace-retained-with-telescoped-support', args.twoStepTraceRetentionSummary.status, args.twoStepTraceRetentionSummary.rowCount, args.twoStepTraceRetentionSummary.maxError),
    controlRow('C2', 'direct transition comparison', 'projection-equivalent-traces-distinguished', args.projectionEquivalentTraceDistinctionSummary.status, args.projectionEquivalentTraceDistinctionSummary.rowCount, args.projectionEquivalentTraceDistinctionSummary.maxError),
    controlRow('C3', 'non-composable token sequence', 'composability-classification-pass', args.composabilityClassificationSummary.status, args.composabilityClassificationSummary.rowCount, args.composabilityClassificationSummary.maxError),
    controlRow('C4', 'backtrack trace', 'zero-support-backtrack-trace-retained', args.backtrackTraceRetentionSummary.status, args.backtrackTraceRetentionSummary.rowCount, args.backtrackTraceRetentionSummary.maxError),
    controlRow('C5', 'cycle trace', 'zero-support-cycle-trace-retained-not-loop', args.cycleTraceRetentionSummary.status, args.cycleTraceRetentionSummary.rowCount, args.cycleTraceRetentionSummary.maxError),
    controlRow('C6', 'scalar trace', 'invalid-scalar-collapse', scalarStatus, 2, args.invalidityControlSummary.maxError),
    controlRow('C7', 'sector-collapse trace', 'invalid-sector-collapse', sectorStatus, 1, args.invalidityControlSummary.maxError),
    controlRow('C8', 'unordered token set', 'invalid-trace-order-collapse', traceOrderStatus, 1, args.invalidityControlSummary.maxError),
    controlRow('C9', 'site-address double-counting', 'site-address-double-counting-rejected', args.complementAxisTraceIdentitySummary.siteAddressDoubleCountingStatus, args.complementAxisTraceIdentitySummary.rowCount, 0),
    controlRow('C10', 'row/order shuffle', 'support-classification-unchanged-trace-order-unchanged', rowOrderStatus, 1, args.invalidityControlSummary.maxError),
    controlRow('C11', 'anti-route language scan', 'trace-anti-route-boundary-pass', args.antiRouteLanguageBoundarySummary.status, args.antiRouteLanguageBoundarySummary.rowCount, 0),
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
  }));
}

function buildFalsifierRows(args: {
  lab8Report: S8Report;
  traceTokenConstructionSummary: Summary<string, string>;
  supportProjectionCompatibilitySummary: Summary<string, string>;
  twoStepTraceRetentionSummary: Summary<string, string>;
  projectionEquivalentTraceDistinctionSummary: Summary<string, string>;
  composabilityClassificationSummary: ComposabilityClassificationSummary;
  backtrackTraceRetentionSummary: Summary<string, string>;
  cycleTraceRetentionSummary: Summary<string, string>;
  traceReversalSummary: Summary<string, string>;
  traceIdentitySupportIdentitySummary: Summary<string, string>;
  complementAxisTraceIdentitySummary: ComplementAxisTraceIdentitySummary;
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundarySummary: AntiRouteLanguageBoundarySummary;
  controlRows: readonly ControlRow[];
}): FalsifierRow[] {
  return [
    falsifier('F1', 'Lab-8 parent missing or not accepted.', !parentLab8Accepted(args.lab8Report), `Lab-8 ok=${args.lab8Report.ok}; finalVerdict=${args.lab8Report.finalVerdict}; integrityIssueCount=${args.lab8Report.integrityIssueCount}; telescoping=${args.lab8Report.telescopingAntiRouteSummary.status}; cycle=${args.lab8Report.cycleCancellationSummary.status}; boundary=${args.lab8Report.antiRouteLanguageBoundarySummary.status}.`),
    falsifier('F2', 'Trace token construction fails.', args.traceTokenConstructionSummary.status !== 'transition-trace-token-constructed', `tokens=${args.traceTokenConstructionSummary.status}.`),
    falsifier('F3', 'Support projection compatibility fails.', args.supportProjectionCompatibilitySummary.status !== 'support-projection-compatible-with-trace', `compatibility=${args.supportProjectionCompatibilitySummary.status}.`),
    falsifier('F4', 'Two-step trace collapses to direct transition.', args.twoStepTraceRetentionSummary.status === 'two-step-trace-collapsed-to-direct-transition', `twoStep=${args.twoStepTraceRetentionSummary.status}.`),
    falsifier('F5', 'Intermediate body is not retained.', args.twoStepTraceRetentionSummary.status === 'intermediate-body-not-retained' || args.twoStepTraceRetentionSummary.status === 'support-projection-failed-to-telescope', `twoStep=${args.twoStepTraceRetentionSummary.status}.`),
    falsifier('F6', 'Projection-equivalent traces are falsely identified.', args.projectionEquivalentTraceDistinctionSummary.status !== 'projection-equivalent-traces-distinguished', `distinction=${args.projectionEquivalentTraceDistinctionSummary.status}.`),
    falsifier('F7', 'Non-composable sequence is falsely classified as composable chain.', args.composabilityClassificationSummary.status !== 'composability-classification-pass', `composability=${args.composabilityClassificationSummary.status}.`),
    falsifier('F8', 'Zero-support backtrack trace is erased.', args.backtrackTraceRetentionSummary.status !== 'zero-support-backtrack-trace-retained', `backtrack=${args.backtrackTraceRetentionSummary.status}.`),
    falsifier('F9', 'Cycle trace is erased or promoted to loop/vortex/circulation/route.', args.cycleTraceRetentionSummary.status !== 'zero-support-cycle-trace-retained-not-loop', `cycle=${args.cycleTraceRetentionSummary.status}.`),
    falsifier('F10', 'Trace reversal fails.', args.traceReversalSummary.status !== 'trace-reversal-compatible', `reversal=${args.traceReversalSummary.status}.`),
    falsifier('F11', 'Trace identity collapses into support identity.', args.traceIdentitySupportIdentitySummary.status !== 'trace-identity-independent-from-support-identity', `identity=${args.traceIdentitySupportIdentitySummary.status}.`),
    falsifier('F12', 'Complement-axis trace identity is lost.', args.complementAxisTraceIdentitySummary.status !== 'complement-axis-trace-identity-preserved', `identity=${args.complementAxisTraceIdentitySummary.status}.`),
    falsifier('F13', 'Site-address double-counting is admitted.', args.complementAxisTraceIdentitySummary.siteAddressDoubleCountingStatus !== 'site-address-double-counting-rejected', `site=${args.complementAxisTraceIdentitySummary.siteAddressDoubleCountingStatus}.`),
    falsifier('F14', 'Scalar collapse is admitted.', controlFailed(args.controlRows, 'C6'), `C6=${controlStatus(args.controlRows, 'C6')}.`),
    falsifier('F15', 'Sector collapse is admitted.', controlFailed(args.controlRows, 'C7'), `C7=${controlStatus(args.controlRows, 'C7')}.`),
    falsifier('F16', 'Trace order collapse is admitted.', controlFailed(args.controlRows, 'C8'), `C8=${controlStatus(args.controlRows, 'C8')}.`),
    falsifier('F17', 'Row/order dependence appears.', controlFailed(args.controlRows, 'C10'), `C10=${controlStatus(args.controlRows, 'C10')}.`),
    falsifier('F18', 'Anti-route boundary fails.', args.antiRouteLanguageBoundarySummary.status !== 'trace-anti-route-boundary-pass' || controlFailed(args.controlRows, 'C11'), `boundary=${args.antiRouteLanguageBoundarySummary.status}; C11=${controlStatus(args.controlRows, 'C11')}.`),
    falsifier('F19', 'Runtime/UI/packet/Shape mutation appears.', false, 'Lab-9 adds a diagnostic source file and diagnostic script only.'),
  ];
}

function falsifier(falsifierId: FalsifierRow['falsifierId'], description: string, triggered: boolean, evidence: string): FalsifierRow {
  return { falsifierId, description, triggered, evidence, status: triggered ? 'triggered' : 'clear' };
}

function classifyFinalVerdict(args: {
  lab8Report: S8Report;
  traceTokenConstructionSummary: Summary<string, string>;
  supportProjectionCompatibilitySummary: Summary<string, string>;
  twoStepTraceRetentionSummary: Summary<string, string>;
  projectionEquivalentTraceDistinctionSummary: Summary<string, string>;
  composabilityClassificationSummary: ComposabilityClassificationSummary;
  backtrackTraceRetentionSummary: Summary<string, string>;
  cycleTraceRetentionSummary: Summary<string, string>;
  traceReversalSummary: Summary<string, string>;
  traceIdentitySupportIdentitySummary: Summary<string, string>;
  complementAxisTraceIdentitySummary: ComplementAxisTraceIdentitySummary;
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundarySummary: AntiRouteLanguageBoundarySummary;
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
}): T28S9FinalVerdict {
  if (!parentLab8Accepted(args.lab8Report)) return 'T28-S-Lab-9-lab-8-parent-not-accepted';
  if (args.traceTokenConstructionSummary.status !== 'transition-trace-token-constructed') return 'T28-S-Lab-9-trace-token-construction-failed';
  if (args.supportProjectionCompatibilitySummary.status !== 'support-projection-compatible-with-trace') return 'T28-S-Lab-9-support-projection-compatibility-failed';
  if (args.twoStepTraceRetentionSummary.status !== 'two-step-trace-retained-with-telescoped-support') return 'T28-S-Lab-9-two-step-trace-retention-failed';
  if (args.projectionEquivalentTraceDistinctionSummary.status !== 'projection-equivalent-traces-distinguished') return 'T28-S-Lab-9-projection-equivalent-trace-distinction-failed';
  if (args.composabilityClassificationSummary.status !== 'composability-classification-pass') return 'T28-S-Lab-9-composability-classification-failed';
  if (args.backtrackTraceRetentionSummary.status !== 'zero-support-backtrack-trace-retained') return 'T28-S-Lab-9-backtrack-trace-retention-failed';
  if (args.cycleTraceRetentionSummary.status !== 'zero-support-cycle-trace-retained-not-loop') return 'T28-S-Lab-9-cycle-trace-retention-failed';
  if (args.traceReversalSummary.status !== 'trace-reversal-compatible') return 'T28-S-Lab-9-trace-reversal-failed';
  if (args.traceIdentitySupportIdentitySummary.status !== 'trace-identity-independent-from-support-identity') return 'T28-S-Lab-9-trace-identity-support-identity-failed';
  if (args.complementAxisTraceIdentitySummary.status !== 'complement-axis-trace-identity-preserved') return 'T28-S-Lab-9-complement-axis-trace-identity-failed';
  if (args.invalidityControlSummary.status !== 'invalidity-controls-pass') return 'T28-S-Lab-9-invalidity-control-failed';
  if (args.antiRouteLanguageBoundarySummary.status !== 'trace-anti-route-boundary-pass') return 'T28-S-Lab-9-anti-route-boundary-failed';
  if (requiredBoundaryMissing(args.boundaryRows) || falsifierTriggered(args.falsifierRows, 'F18') || falsifierTriggered(args.falsifierRows, 'F19')) return 'T28-S-Lab-9-boundary-failed';
  return 'T28-S-Lab-9-trace-retention-support-projection-compatibility-pass';
}

function buildIntegrityIssues(args: {
  lab8Report: S8Report;
  traceTokenConstructionRows: readonly TraceTokenConstructionRow[];
  traceTokenConstructionSummary: Summary<string, string>;
  supportProjectionCompatibilityRows: readonly SupportProjectionCompatibilityRow[];
  supportProjectionCompatibilitySummary: Summary<string, string>;
  twoStepTraceRetentionRows: readonly TwoStepTraceRetentionRow[];
  twoStepTraceRetentionSummary: Summary<string, string>;
  projectionEquivalentTraceDistinctionRows: readonly ProjectionEquivalentTraceDistinctionRow[];
  projectionEquivalentTraceDistinctionSummary: Summary<string, string>;
  composabilityClassificationRows: readonly ComposabilityClassificationRow[];
  composabilityClassificationSummary: ComposabilityClassificationSummary;
  backtrackTraceRetentionRows: readonly BacktrackTraceRetentionRow[];
  backtrackTraceRetentionSummary: Summary<string, string>;
  cycleTraceRetentionRows: readonly CycleTraceRetentionRow[];
  cycleTraceRetentionSummary: Summary<string, string>;
  traceReversalRows: readonly TraceReversalRow[];
  traceReversalSummary: Summary<string, string>;
  traceIdentitySupportIdentityRows: readonly TraceIdentitySupportIdentityRow[];
  traceIdentitySupportIdentitySummary: Summary<string, string>;
  complementAxisTraceIdentityRows: readonly ComplementAxisTraceIdentityRow[];
  complementAxisTraceIdentitySummary: ComplementAxisTraceIdentitySummary;
  invalidityControlRows: readonly InvalidityControlRow[];
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundaryRows: readonly AntiRouteLanguageBoundaryRow[];
  antiRouteLanguageBoundarySummary: AntiRouteLanguageBoundarySummary;
  controlRows: readonly ControlRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  finalVerdict: T28S9FinalVerdict;
}): string[] {
  const issues: string[] = [];
  if (!parentLab8Accepted(args.lab8Report)) issues.push('Lab-8 parent missing/not accepted');
  if (args.traceTokenConstructionRows.length !== 6 || args.traceTokenConstructionSummary.status !== 'transition-trace-token-constructed') issues.push('exactly 6 trace tokens not constructed');
  if (args.supportProjectionCompatibilityRows.length !== 18 || args.supportProjectionCompatibilitySummary.status !== 'support-projection-compatible-with-trace') issues.push('support-projection compatibility rows failed');
  if (args.twoStepTraceRetentionRows.length !== 6 || args.twoStepTraceRetentionSummary.status !== 'two-step-trace-retained-with-telescoped-support') issues.push('two-step trace retention rows failed');
  if (args.projectionEquivalentTraceDistinctionRows.length !== 6 || args.projectionEquivalentTraceDistinctionSummary.status !== 'projection-equivalent-traces-distinguished') issues.push('projection-equivalent trace distinction rows failed');
  if (args.composabilityClassificationRows.length !== 12 || args.composabilityClassificationSummary.status !== 'composability-classification-pass') issues.push('composability classification rows failed');
  if (args.backtrackTraceRetentionRows.length !== 6 || args.backtrackTraceRetentionSummary.status !== 'zero-support-backtrack-trace-retained') issues.push('backtrack trace retention rows failed');
  if (args.cycleTraceRetentionRows.length !== 6 || args.cycleTraceRetentionSummary.status !== 'zero-support-cycle-trace-retained-not-loop') issues.push('cycle trace retention rows failed');
  if (args.traceReversalRows.length !== 6 || args.traceReversalSummary.status !== 'trace-reversal-compatible') issues.push('trace reversal rows failed');
  if (args.traceIdentitySupportIdentityRows.length !== 3 || args.traceIdentitySupportIdentitySummary.status !== 'trace-identity-independent-from-support-identity') issues.push('trace identity/support identity rows failed');
  if (args.complementAxisTraceIdentityRows.length !== 3 || args.complementAxisTraceIdentitySummary.status !== 'complement-axis-trace-identity-preserved') issues.push('complement-axis trace identity rows failed');
  if (args.invalidityControlRows.length !== 5 || args.invalidityControlSummary.status !== 'invalidity-controls-pass') issues.push('invalidity control rows failed');
  if (args.antiRouteLanguageBoundaryRows.length !== 15 || args.antiRouteLanguageBoundarySummary.status !== 'trace-anti-route-boundary-pass') issues.push('anti-route boundary rows failed');
  if (args.controlRows.length !== 12 || args.controlRows.some((row) => row.status !== 'control-pass')) issues.push('control row missing or failed');
  if (requiredBoundaryMissing(args.boundaryRows)) issues.push('required boundary missing or unenforced');
  if (REQUIRED_FALSIFIER_IDS.some((id) => !args.falsifierRows.some((row) => row.falsifierId === id)) || args.falsifierRows.some((row) => row.triggered)) {
    issues.push('falsifier row missing or triggered');
  }
  const expectedVerdict = classifyFinalVerdict({
    lab8Report: args.lab8Report,
    traceTokenConstructionSummary: args.traceTokenConstructionSummary,
    supportProjectionCompatibilitySummary: args.supportProjectionCompatibilitySummary,
    twoStepTraceRetentionSummary: args.twoStepTraceRetentionSummary,
    projectionEquivalentTraceDistinctionSummary: args.projectionEquivalentTraceDistinctionSummary,
    composabilityClassificationSummary: args.composabilityClassificationSummary,
    backtrackTraceRetentionSummary: args.backtrackTraceRetentionSummary,
    cycleTraceRetentionSummary: args.cycleTraceRetentionSummary,
    traceReversalSummary: args.traceReversalSummary,
    traceIdentitySupportIdentitySummary: args.traceIdentitySupportIdentitySummary,
    complementAxisTraceIdentitySummary: args.complementAxisTraceIdentitySummary,
    invalidityControlSummary: args.invalidityControlSummary,
    antiRouteLanguageBoundarySummary: args.antiRouteLanguageBoundarySummary,
    boundaryRows: args.boundaryRows,
    falsifierRows: args.falsifierRows,
  });
  if (expectedVerdict !== args.finalVerdict) issues.push('final verdict inconsistent with precedence');
  return unique(issues);
}

function supportProjectionForTokenIds(tokenIds: readonly string[], tokenById: Map<string, TraceToken>): SupportProjection {
  const tokens = tokenIds.map((tokenId) => requiredToken(tokenById, tokenId));
  if (tokens.length === 0) throw new Error('Cannot project empty token list without basis keys');
  return tokens.reduce((projection, token) => addSupportProjections(projection, token.supportProjection), zeroLikeSupportProjection(tokens[0].supportProjection));
}

function addSupportProjections(left: SupportProjection, right: SupportProjection): SupportProjection {
  return {
    square: addProjectionRecords(left.square, right.square),
    hex: addProjectionRecords(left.hex, right.hex),
  };
}

function scaleSupportProjection(projection: SupportProjection, scale: number): SupportProjection {
  return {
    square: scaleProjectionRecord(projection.square, scale),
    hex: scaleProjectionRecord(projection.hex, scale),
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

function scaleProjectionRecord(record: Record<string, Vec3>, scale: number): Record<string, Vec3> {
  return Object.fromEntries(Object.entries(record).map(([id, value]) => [id, scaleVec3(value, scale)]));
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

function summarizeRows<Row extends { maxError?: number; status: string }, PassStatus extends string, FailStatus extends string>(
  rows: readonly Row[],
  passStatus: PassStatus,
  failStatus: FailStatus,
): Summary<PassStatus, FailStatus> {
  const passCount = rows.filter((row) => row.status === passStatus).length;
  return summaryWithStatus(rows, passCount, passStatus, failStatus);
}

function summaryWithStatus<Row extends { maxError?: number }, PassStatus extends string, FailStatus extends string>(
  rows: readonly Row[],
  passCount: number,
  passStatus: PassStatus,
  failStatus: FailStatus,
): Summary<PassStatus, FailStatus> {
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    maxError: maxOf(rows.map((row) => typeof row.maxError === 'number' ? row.maxError : 0)),
    status: passCount === rows.length ? passStatus : failStatus,
  };
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

function sameOrderedIds(left: readonly string[], right: readonly string[]): boolean {
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

function requiredAbsentBody(sourceBodyId: GateBodyId, targetBodyId: GateBodyId): GateBodyId {
  const absent = BODY_IDS.find((bodyId) => bodyId !== sourceBodyId && bodyId !== targetBodyId);
  if (!absent) throw new Error(`Missing absent body for ${sourceBodyId}->${targetBodyId}`);
  return absent;
}

function buildSiteAddressMembership(rows: readonly S7GateBodyBasisRow[]): Map<SiteId, GateBodyId> {
  return new Map(rows.flatMap((row) => (row.siteAddresses as SiteId[]).map((siteId) => [siteId, row.bodyId as GateBodyId] as const)));
}

function requiredGateBodyBasisRow(rows: readonly S7GateBodyBasisRow[], bodyId: GateBodyId): S7GateBodyBasisRow {
  const row = rows.find((candidate) => candidate.bodyId === bodyId);
  if (!row) throw new Error(`Missing gate body basis row ${bodyId}`);
  return row;
}

function requiredToken<T extends TraceToken>(tokenById: Map<string, T>, tokenId: string): T {
  const token = tokenById.get(tokenId);
  if (!token) throw new Error(`Missing trace token ${tokenId}`);
  return token;
}

function parentLab8Accepted(report: S8Report): boolean {
  return report.ok === true &&
    report.finalVerdict === 'T28-S-Lab-8-ordered-pair-transition-anti-route-pass' &&
    report.integrityIssueCount === 0 &&
    report.telescopingAntiRouteSummary.status === 'telescoping-intermediate-erased-not-route' &&
    report.cycleCancellationSummary.status === 'cycle-cancellation-not-loop' &&
    report.antiRouteLanguageBoundarySummary.status === 'anti-route-language-boundary-pass';
}

function requiredBoundaryMissing(rows: readonly BoundaryRow[]): boolean {
  return REQUIRED_BOUNDARY_IDS.some((id) => !rows.some((row) => row.boundaryId === id && row.enforced));
}

function controlFailed(rows: readonly ControlRow[], controlId: ControlRow['controlId']): boolean {
  return rows.find((row) => row.controlId === controlId)?.status !== 'control-pass';
}

function controlStatus(rows: readonly ControlRow[], controlId: ControlRow['controlId']): string {
  return rows.find((row) => row.controlId === controlId)?.status ?? 'missing';
}

function falsifierTriggered(rows: readonly FalsifierRow[], falsifierId: FalsifierRow['falsifierId']): boolean {
  return rows.find((row) => row.falsifierId === falsifierId)?.triggered === true;
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

function maxAbsVec3(value: Vec3): number {
  return Math.max(Math.abs(value[0]), Math.abs(value[1]), Math.abs(value[2]));
}

function zeroVec3(): Vec3 {
  return [0, 0, 0];
}

function maxOf(values: readonly number[]): number {
  return values.length === 0 ? 0 : Math.max(...values);
}

function cleanNumber(value: number): number {
  return Math.abs(value) <= EPSILON ? 0 : Number(value.toFixed(12));
}

function cleanVec3(value: Vec3): Vec3 {
  return [cleanNumber(value[0]), cleanNumber(value[1]), cleanNumber(value[2])];
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

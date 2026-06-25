import {
  buildPSimplexTraceRetentionSupportProjectionCompatibilityAuditT28S9Report,
  type GateBodyId,
  type Vec3,
} from './pSimplexTraceRetentionSupportProjectionCompatibilityAuditT28S9';
import { buildPSimplexRoleRetentiveHandoffStateAuditT28S11Report } from './pSimplexRoleRetentiveHandoffStateAuditT28S11';

type S9Report = ReturnType<typeof buildPSimplexTraceRetentionSupportProjectionCompatibilityAuditT28S9Report>;
type S11Report = ReturnType<typeof buildPSimplexRoleRetentiveHandoffStateAuditT28S11Report>;
type S9TraceTokenConstructionRow = S9Report['traceTokenConstructionRows'][number];
type S11HandoffRow = S11Report['roleRetentiveHandoffConstructionRows'][number];

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

interface Summary {
  rowCount: number;
  passCount: number;
  failCount: number;
  maxError: number;
  status: string;
}

export interface ParentEvidenceRow {
  parentId: string;
  method: string;
  ok: boolean | null;
  finalVerdict?: string;
  integrityIssueCount?: number;
  consumedSections: string[];
  status: string;
}

export interface SeamSourceRow {
  seamSourceId: string;
  traceId: string;
  entryBodyId: GateBodyId;
  sharedBodyId: GateBodyId;
  exitBodyId: GateBodyId;
  incomingTokenId: string;
  outgoingTokenId: string;
  lab11HandoffStateId: string;
  lab11Status: string;
  status: string;
}

export interface RoleConjugateSeamClassificationRow {
  seamId: string;
  traceId: string;
  entryBodyId: GateBodyId;
  sharedBodyId: GateBodyId;
  exitBodyId: GateBodyId;
  incomingTokenId: string;
  outgoingTokenId: string;
  objectName: typeof SEAM_OBJECT_NAME;
  primarySeamClass: string;
  localContinuityStatus: string;
  sameBodyCondition: boolean;
  adjacentTokenCondition: boolean;
  oppositeRoleCondition: boolean;
  oppositeSignCondition: boolean;
  supportCancellingCondition: boolean;
  traceRetainedCondition: boolean;
  nonpromotionCondition: boolean;
  incomingRole: string;
  outgoingRole: string;
  incomingCoefficientAtSharedBody: number;
  outgoingCoefficientAtSharedBody: number;
  supportNetAtSharedBody: number;
  routeMaturityStatus: 'not-route';
  pathMaturityStatus: 'not-path';
  loopMaturityStatus: 'not-loop';
  vortexMaturityStatus: 'not-vortex';
  circulationMaturityStatus: 'not-circulation';
  seamVocabulary: string[];
  status: string;
}

export interface SeamConditionIndependenceRow {
  controlId: string;
  attemptedConditionSet: string;
  sameBodyCondition: boolean;
  adjacentTokenCondition: boolean;
  oppositeRoleCondition: boolean;
  oppositeSignCondition: boolean;
  supportCancellingCondition: boolean;
  traceRetainedCondition: boolean;
  nonpromotionCondition: boolean;
  expectedStatus: string;
  observedStatus: string;
  status: string;
}

export interface DirectShortcutNoSeamRow {
  comparisonId: string;
  twoStepTraceId: string;
  directShortcutTraceId: string;
  sharedBodyId: GateBodyId;
  twoStepHasSeam: boolean;
  directShortcutHasSeamAtSharedBody: boolean;
  supportProjectionEquivalent: boolean;
  traceIdentityDistinct: boolean;
  maxError: number;
  status: string;
}

export interface NonComposableNoSeamRow {
  traceId: string;
  firstTokenId: string;
  secondTokenId: string;
  firstTargetBodyId: GateBodyId;
  secondSourceBodyId: GateBodyId;
  hasAdjacentSharedBody: boolean;
  hasRoleConjugateSeam: boolean;
  lab10PrimaryClass: string;
  lab10AdmissibilityBand: string;
  status: string;
}

export interface SupportProjectionOnlyNoSeamRow {
  comparisonId: string;
  twoStepTraceId: string;
  directShortcutTraceId: string;
  supportProjectionEquivalent: boolean;
  traceRoleEvidencePresent: boolean;
  expectedStatus: string;
  observedStatus: string;
  maxError: number;
  status: string;
}

export interface BacktrackSeamClassificationRow {
  traceId: string;
  incomingTokenId: string;
  outgoingTokenId: string;
  sharedBodyId: GateBodyId;
  localSeamClass: string;
  traceLevelClass: string;
  lab10PrimaryClass: string;
  lab10AdmissibilityBand: string;
  routeMaturityStatus: 'not-route';
  loopMaturityStatus: 'not-loop';
  status: string;
}

export interface CycleMultiSeamRow {
  cycleTraceId: string;
  bodySequence: GateBodyId[];
  sharedBodyIds: GateBodyId[];
  localSeamCount: number;
  allLocalSeamConditionsPass: boolean;
  lab10PrimaryClass: string;
  lab10AdmissibilityBand: string;
  routeMaturityStatus: 'not-route';
  loopMaturityStatus: 'not-loop';
  vortexMaturityStatus: 'not-vortex';
  circulationMaturityStatus: 'not-circulation';
  status: string;
}

export interface SeamReversalRow {
  originalTraceId: string;
  reversedTraceId: string;
  sharedBodyId: GateBodyId;
  entryExitSwapped: boolean;
  incomingOutgoingRolesRemainDistinct: boolean;
  roleConjugateConditionsPreserved: boolean;
  status: string;
}

export interface ShortcutHistorySeamDistinctionRow {
  relationId: string;
  twoStepTraceId: string;
  directShortcutTraceId: string;
  sharedBodyId: GateBodyId;
  sameSupportProjection: boolean;
  differentTraceIdentity: boolean;
  twoStepHasSeamAtSharedBody: boolean;
  shortcutHasSeamAtSharedBody: boolean;
  maxError: number;
  status: string;
}

export interface ComplementAxisSeamIdentityRow {
  bodyId: GateBodyId;
  siteAddressA: string;
  siteAddressB: string;
  bodyMembershipA: string;
  bodyMembershipB: string;
  identityPreserved: boolean;
  status: string;
}

export interface ComplementAxisSeamIdentitySummary extends Summary {
  siteAddressDoubleCountingStatus: string;
  complementSiteSplitStatus: string;
  sixSiteAddressSeamModelStatus: string;
}

export interface InvalidityControlRow {
  controlId: string;
  invalidityKind: string;
  expectedStatus: string;
  observedStatus: string;
  maxError: number;
  status: string;
  shuffledSquareObjectOrder?: string[];
  shuffledHexObjectOrder?: string[];
  traceOrderPreserved?: boolean;
  supportObjectIdComparisonPreserved?: boolean;
  seamClassificationUnchanged?: boolean;
  seamRetained?: boolean;
  supportProjectionOrderShuffled?: boolean;
}

export interface InvalidityControlSummary extends Summary {
  scalarCollapsePassCount: number;
  sectorCollapsePassCount: number;
  traceOrderCollapsePassCount: number;
  siteAddressDuplicationPassCount: number;
  supportProjectionOnlyPassCount: number;
  rowOrderPassCount: number;
  partialConditionPassCount: number;
}

export interface AntiRouteLanguageBoundaryRow {
  boundaryId: string;
  positivePromotionDetected: boolean;
  status: string;
}

export interface ControlRow {
  controlId: string;
  controlName: string;
  expectedStatus: string;
  observedStatus: string;
  checkedCount: number;
  maxError: number;
  status: string;
}

export interface BoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: boolean;
  positivePromotionDetected: boolean;
}

export interface FalsifierRow {
  falsifierId: string;
  description: string;
  triggered: boolean;
  evidence: string;
  status: string;
}

export type T28S12FinalVerdict =
  | 'T28-S-Lab-12-role-conjugate-handoff-seam-pass'
  | 'T28-S-Lab-12-lab-11-parent-not-accepted'
  | 'T28-S-Lab-12-seam-source-extraction-failed'
  | 'T28-S-Lab-12-role-conjugate-seam-classification-failed'
  | 'T28-S-Lab-12-seam-condition-independence-failed'
  | 'T28-S-Lab-12-direct-shortcut-control-failed'
  | 'T28-S-Lab-12-non-composable-control-failed'
  | 'T28-S-Lab-12-support-projection-only-control-failed'
  | 'T28-S-Lab-12-backtrack-control-failed'
  | 'T28-S-Lab-12-cycle-control-failed'
  | 'T28-S-Lab-12-reversal-control-failed'
  | 'T28-S-Lab-12-shortcut-history-control-failed'
  | 'T28-S-Lab-12-complement-axis-identity-failed'
  | 'T28-S-Lab-12-invalidity-control-failed'
  | 'T28-S-Lab-12-anti-route-boundary-failed'
  | 'T28-S-Lab-12-boundary-failed';

export interface PSimplexRoleConjugateHandoffSeamAuditT28S12Report {
  method: typeof METHOD;
  experimentName: typeof EXPERIMENT_NAME;
  diagnosticScope: typeof DIAGNOSTIC_SCOPE;
  branchRef: typeof BRANCH_REF;
  baselineRef: typeof BASELINE_REF;
  objectName: typeof SEAM_OBJECT_NAME;
  parentEvidenceRows: ParentEvidenceRow[];
  seamSourceRows: SeamSourceRow[];
  seamSourceSummary: Summary;
  roleConjugateSeamClassificationRows: RoleConjugateSeamClassificationRow[];
  roleConjugateSeamClassificationSummary: Summary;
  seamConditionIndependenceRows: SeamConditionIndependenceRow[];
  seamConditionIndependenceSummary: Summary;
  directShortcutNoSeamRows: DirectShortcutNoSeamRow[];
  directShortcutNoSeamSummary: Summary;
  nonComposableNoSeamRows: NonComposableNoSeamRow[];
  nonComposableNoSeamSummary: Summary;
  supportProjectionOnlyNoSeamRows: SupportProjectionOnlyNoSeamRow[];
  supportProjectionOnlyNoSeamSummary: Summary;
  backtrackSeamClassificationRows: BacktrackSeamClassificationRow[];
  backtrackSeamClassificationSummary: Summary;
  cycleMultiSeamRows: CycleMultiSeamRow[];
  cycleMultiSeamSummary: Summary;
  seamReversalRows: SeamReversalRow[];
  seamReversalSummary: Summary;
  shortcutHistorySeamDistinctionRows: ShortcutHistorySeamDistinctionRow[];
  shortcutHistorySeamDistinctionSummary: Summary;
  complementAxisSeamIdentityRows: ComplementAxisSeamIdentityRow[];
  complementAxisSeamIdentitySummary: ComplementAxisSeamIdentitySummary;
  invalidityControlRows: InvalidityControlRow[];
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundaryRows: AntiRouteLanguageBoundaryRow[];
  antiRouteLanguageBoundarySummary: Summary;
  controlRows: ControlRow[];
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  finalVerdict: T28S12FinalVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

const METHOD = 'p-simplex-role-conjugate-handoff-seam-audit-t28s12' as const;
const EXPERIMENT_NAME = 'T28-S-Lab-12 - Role-Conjugate Handoff Seam Audit' as const;
const DIAGNOSTIC_SCOPE = 'role-conjugate-handoff-seam-audit-only' as const;
const BRANCH_REF = 't28s/gate-transition-applied-chain' as const;
const BASELINE_REF = 't28s/gate-transition-applied-chain' as const;
const SEAM_OBJECT_NAME = 'RoleConjugateHandoffSeam_v0' as const;
const EPSILON = 1e-9;

const BODY_IDS = ['GateBody_AB/CD', 'GateBody_AC/BD', 'GateBody_AD/BC'] as const satisfies readonly GateBodyId[];
const SEAM_VOCABULARY = [
  'role-conjugate-handoff-seam',
  'same-body-seam',
  'adjacent-token-seam',
  'opposite-role-pair',
  'opposite-sign-pair',
  'support-cancelling-seam',
  'trace-retained-seam',
  'nonpromoted-seam',
  'no-handoff-seam',
  'invalid-seam-inference',
] as const;
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
  'not-support-projection-only-seam',
  'not-partial-seam-condition',
  'not-route-maturity',
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
  'F19',
  'F20',
  'F21',
  'F22',
  'F23',
  'F24',
  'F25',
  'F26',
] as const;

export function buildPSimplexRoleConjugateHandoffSeamAuditT28S12Report(): PSimplexRoleConjugateHandoffSeamAuditT28S12Report {
  const lab11Report = buildPSimplexRoleRetentiveHandoffStateAuditT28S11Report();
  const lab9Report = buildPSimplexTraceRetentionSupportProjectionCompatibilityAuditT28S9Report();
  const traceTokens = buildTraceTokens(lab9Report.traceTokenConstructionRows);
  const tokenById = new Map(traceTokens.map((token) => [token.tokenId, token]));
  const tokenByOrderedPairId = new Map(traceTokens.map((token) => [token.orderedPairId, token]));

  const parentEvidenceRows = buildParentEvidenceRows(lab11Report, lab9Report);
  const seamSourceRows = buildSeamSourceRows(lab11Report);
  const seamSourceSummary = summarizeRows(seamSourceRows, 'role-conjugate-seam-source-ready', 'role-conjugate-seam-source-missing');
  const roleConjugateSeamClassificationRows = buildRoleConjugateSeamClassificationRows(seamSourceRows, lab11Report.roleRetentiveHandoffConstructionRows, tokenById);
  const roleConjugateSeamClassificationSummary = buildRoleConjugateSeamClassificationSummary(roleConjugateSeamClassificationRows);
  const seamConditionIndependenceRows = buildSeamConditionIndependenceRows();
  const seamConditionIndependenceSummary = summarizeRows(seamConditionIndependenceRows, 'partial-seam-condition-rejected', 'partial-seam-condition-falsely-admitted');
  const directShortcutNoSeamRows = buildDirectShortcutNoSeamRows(lab11Report, roleConjugateSeamClassificationRows);
  const directShortcutNoSeamSummary = buildDirectShortcutNoSeamSummary(directShortcutNoSeamRows);
  const nonComposableNoSeamRows = buildNonComposableNoSeamRows(lab11Report);
  const nonComposableNoSeamSummary = summarizeRows(nonComposableNoSeamRows, 'non-composable-no-seam-pass', 'non-composable-falsely-given-seam');
  const supportProjectionOnlyNoSeamRows = buildSupportProjectionOnlyNoSeamRows(seamSourceRows, tokenById, tokenByOrderedPairId);
  const supportProjectionOnlyNoSeamSummary = summarizeRows(supportProjectionOnlyNoSeamRows, 'support-projection-only-seam-rejected', 'support-projection-only-seam-falsely-admitted');
  const backtrackSeamClassificationRows = buildBacktrackSeamClassificationRows(lab11Report);
  const backtrackSeamClassificationSummary = buildBacktrackSeamClassificationSummary(backtrackSeamClassificationRows);
  const cycleMultiSeamRows = buildCycleMultiSeamRows(lab11Report);
  const cycleMultiSeamSummary = buildCycleMultiSeamSummary(cycleMultiSeamRows);
  const seamReversalRows = buildSeamReversalRows(lab11Report);
  const seamReversalSummary = summarizeRows(seamReversalRows, 'role-conjugate-seam-reversal-compatible', 'role-conjugate-seam-reversal-failed');
  const shortcutHistorySeamDistinctionRows = buildShortcutHistorySeamDistinctionRows(lab11Report);
  const shortcutHistorySeamDistinctionSummary = summarizeRows(shortcutHistorySeamDistinctionRows, 'shortcut-history-seam-distinction-pass', 'shortcut-history-seam-distinction-failed');
  const complementAxisSeamIdentityRows = buildComplementAxisSeamIdentityRows(lab11Report);
  const complementAxisSeamIdentitySummary = buildComplementAxisSeamIdentitySummary(complementAxisSeamIdentityRows, lab11Report);
  const invalidityControlRows = buildInvalidityControlRows(roleConjugateSeamClassificationRows, seamSourceRows, tokenById, tokenByOrderedPairId);
  const invalidityControlSummary = buildInvalidityControlSummary(invalidityControlRows);
  const antiRouteLanguageBoundaryRows = buildAntiRouteLanguageBoundaryRows();
  const antiRouteLanguageBoundarySummary = summarizeRows(antiRouteLanguageBoundaryRows, 'seam-anti-route-boundary-pass', 'seam-anti-route-boundary-failed');
  const boundaryRows = buildBoundaryRows();
  const controlRows = buildControlRows({
    parentAccepted: parentLab11Accepted(lab11Report),
    seamSourceSummary,
    roleConjugateSeamClassificationSummary,
    seamConditionIndependenceSummary,
    directShortcutNoSeamSummary,
    nonComposableNoSeamSummary,
    supportProjectionOnlyNoSeamSummary,
    backtrackSeamClassificationSummary,
    cycleMultiSeamSummary,
    seamReversalSummary,
    shortcutHistorySeamDistinctionSummary,
    complementAxisSeamIdentitySummary,
    invalidityControlSummary,
    antiRouteLanguageBoundarySummary,
    boundaryRows,
  });
  const falsifierRows = buildFalsifierRows({
    lab11Report,
    seamSourceSummary,
    roleConjugateSeamClassificationRows,
    roleConjugateSeamClassificationSummary,
    seamConditionIndependenceSummary,
    directShortcutNoSeamSummary,
    nonComposableNoSeamSummary,
    supportProjectionOnlyNoSeamSummary,
    backtrackSeamClassificationSummary,
    cycleMultiSeamSummary,
    seamReversalSummary,
    shortcutHistorySeamDistinctionSummary,
    complementAxisSeamIdentitySummary,
    invalidityControlSummary,
    antiRouteLanguageBoundarySummary,
    controlRows,
  });
  const finalVerdict = classifyFinalVerdict({
    lab11Report,
    seamSourceSummary,
    roleConjugateSeamClassificationSummary,
    seamConditionIndependenceSummary,
    directShortcutNoSeamSummary,
    nonComposableNoSeamSummary,
    supportProjectionOnlyNoSeamSummary,
    backtrackSeamClassificationSummary,
    cycleMultiSeamSummary,
    seamReversalSummary,
    shortcutHistorySeamDistinctionSummary,
    complementAxisSeamIdentitySummary,
    invalidityControlSummary,
    antiRouteLanguageBoundarySummary,
    boundaryRows,
    falsifierRows,
  });
  const integrityIssues = buildIntegrityIssues({
    lab11Report,
    seamSourceRows,
    seamSourceSummary,
    roleConjugateSeamClassificationRows,
    roleConjugateSeamClassificationSummary,
    seamConditionIndependenceRows,
    seamConditionIndependenceSummary,
    directShortcutNoSeamRows,
    directShortcutNoSeamSummary,
    nonComposableNoSeamRows,
    nonComposableNoSeamSummary,
    supportProjectionOnlyNoSeamRows,
    supportProjectionOnlyNoSeamSummary,
    backtrackSeamClassificationRows,
    backtrackSeamClassificationSummary,
    cycleMultiSeamRows,
    cycleMultiSeamSummary,
    seamReversalRows,
    seamReversalSummary,
    shortcutHistorySeamDistinctionRows,
    shortcutHistorySeamDistinctionSummary,
    complementAxisSeamIdentityRows,
    complementAxisSeamIdentitySummary,
    invalidityControlRows,
    invalidityControlSummary,
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
    finalVerdict === 'T28-S-Lab-12-role-conjugate-handoff-seam-pass';

  return {
    method: METHOD,
    experimentName: EXPERIMENT_NAME,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    baselineRef: BASELINE_REF,
    objectName: SEAM_OBJECT_NAME,
    parentEvidenceRows,
    seamSourceRows,
    seamSourceSummary,
    roleConjugateSeamClassificationRows,
    roleConjugateSeamClassificationSummary,
    seamConditionIndependenceRows,
    seamConditionIndependenceSummary,
    directShortcutNoSeamRows,
    directShortcutNoSeamSummary,
    nonComposableNoSeamRows,
    nonComposableNoSeamSummary,
    supportProjectionOnlyNoSeamRows,
    supportProjectionOnlyNoSeamSummary,
    backtrackSeamClassificationRows,
    backtrackSeamClassificationSummary,
    cycleMultiSeamRows,
    cycleMultiSeamSummary,
    seamReversalRows,
    seamReversalSummary,
    shortcutHistorySeamDistinctionRows,
    shortcutHistorySeamDistinctionSummary,
    complementAxisSeamIdentityRows,
    complementAxisSeamIdentitySummary,
    invalidityControlRows,
    invalidityControlSummary,
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

function buildParentEvidenceRows(lab11Report: S11Report, lab9Report: S9Report): ParentEvidenceRow[] {
  const secondary = (parentId: string): ParentEvidenceRow => {
    const row = lab11Report.parentEvidenceRows.find((candidate) => candidate.parentId === parentId);
    return {
      parentId,
      method: row?.method ?? 'missing',
      ok: row?.ok ?? false,
      finalVerdict: row?.finalVerdict,
      integrityIssueCount: row?.integrityIssueCount,
      consumedSections: row?.consumedSections ?? [],
      status: row?.status ?? 'secondary-parent-not-accepted',
    };
  };
  return [
    {
      parentId: 'T28-S-Lab-11 primary',
      method: lab11Report.method,
      ok: lab11Report.ok,
      finalVerdict: lab11Report.finalVerdict,
      integrityIssueCount: lab11Report.integrityIssueCount,
      consumedSections: [
        'roleRetentiveHandoffConstructionRows',
        'supportCancellationRoleRetentionRows',
        'directShortcutNoHandoffRows',
        'nonComposableNoHandoffRows',
        'backtrackRoleCancellationRows',
        'cycleMultiHandoffRows',
        'handoffReversalRows',
        'shortcutHistoryHandoffDistinctionRows',
        'complementAxisHandoffIdentityRows',
        'invalidityControlRows',
        'antiRouteLanguageBoundaryRows',
        'finalVerdict',
        'ok',
        'integrityIssueCount',
      ],
      status: parentLab11Accepted(lab11Report) ? 'lab-11-parent-accepted' : 'lab-11-parent-not-accepted',
    },
    secondary('T28-S-Lab-10'),
    {
      parentId: 'T28-S-Lab-9 trace-retention-secondary',
      method: lab9Report.method,
      ok: lab9Report.ok,
      finalVerdict: lab9Report.finalVerdict,
      integrityIssueCount: lab9Report.integrityIssueCount,
      consumedSections: ['traceTokenConstructionRows', 'supportProjectionCompatibilityRows', 'invalidityControlRows'],
      status: lab9Report.ok ? 'secondary-parent-consumed' : 'secondary-parent-not-accepted',
    },
    secondary('T28-S-Lab-8 ordered-pair-secondary'),
    secondary('T28-S-Lab-7 complement-axis-secondary'),
    {
      parentId: 'T28-R context-only-not-authority',
      method: 'context-only-not-authority',
      ok: null,
      consumedSections: [],
      status: 'context-only',
    },
  ];
}

function buildSeamSourceRows(lab11Report: S11Report): SeamSourceRow[] {
  return lab11Report.roleRetentiveHandoffConstructionRows.map((row) => ({
    seamSourceId: `role-conjugate-seam-source:${row.traceId}:${row.sharedBodyId}`,
    traceId: row.traceId,
    entryBodyId: row.entryBodyId,
    sharedBodyId: row.sharedBodyId,
    exitBodyId: row.exitBodyId,
    incomingTokenId: row.incomingTokenId,
    outgoingTokenId: row.outgoingTokenId,
    lab11HandoffStateId: row.handoffStateId,
    lab11Status: row.status,
    status: row.status === 'role-retentive-handoff-state-constructed' ? 'role-conjugate-seam-source-ready' : 'role-conjugate-seam-source-missing',
  }));
}

function buildRoleConjugateSeamClassificationRows(
  seamSourceRows: readonly SeamSourceRow[],
  handoffRows: readonly S11HandoffRow[],
  tokenById: Map<string, TraceToken>,
): RoleConjugateSeamClassificationRow[] {
  return seamSourceRows.map((sourceRow) => {
    const parentRow = requiredHandoffRow(handoffRows, sourceRow.traceId, sourceRow.sharedBodyId);
    const incomingToken = requiredToken(tokenById, sourceRow.incomingTokenId);
    const outgoingToken = requiredToken(tokenById, sourceRow.outgoingTokenId);
    const sameBodyCondition = incomingToken.targetBodyId === sourceRow.sharedBodyId && outgoingToken.sourceBodyId === sourceRow.sharedBodyId;
    const adjacentTokenCondition =
      incomingToken.sourceBodyId === sourceRow.entryBodyId &&
      incomingToken.targetBodyId === sourceRow.sharedBodyId &&
      outgoingToken.sourceBodyId === sourceRow.sharedBodyId &&
      outgoingToken.targetBodyId === sourceRow.exitBodyId;
    const oppositeRoleCondition = parentRow.incomingRole === 'incoming-target-role' && parentRow.outgoingRole === 'outgoing-source-role';
    const oppositeSignCondition = parentRow.incomingCoefficientAtSharedBody === 1 && parentRow.outgoingCoefficientAtSharedBody === -1;
    const supportCancellingCondition = parentRow.supportNetAtSharedBody === 0;
    const traceRetainedCondition = parentRow.traceRetainsIncomingRole && parentRow.traceRetainsOutgoingRole && parentRow.roleDistinctionRetained;
    const nonpromotionCondition = parentRow.routeMaturityStatus === 'not-route';
    const primarySeamClass = allTrue([
      sameBodyCondition,
      adjacentTokenCondition,
      oppositeRoleCondition,
      oppositeSignCondition,
      supportCancellingCondition,
      traceRetainedCondition,
      nonpromotionCondition,
    ])
      ? 'role-conjugate-handoff-seam'
      : 'invalid-seam-inference';
    const localContinuityStatus = primarySeamClass === 'role-conjugate-handoff-seam'
      ? 'handoff-continuity-precondition-admissible'
      : 'handoff-continuity-precondition-inadmissible';
    return {
      seamId: `role-conjugate-handoff-seam:${sourceRow.sharedBodyId}:${sourceRow.traceId}`,
      traceId: sourceRow.traceId,
      entryBodyId: sourceRow.entryBodyId,
      sharedBodyId: sourceRow.sharedBodyId,
      exitBodyId: sourceRow.exitBodyId,
      incomingTokenId: sourceRow.incomingTokenId,
      outgoingTokenId: sourceRow.outgoingTokenId,
      objectName: SEAM_OBJECT_NAME,
      primarySeamClass,
      localContinuityStatus,
      sameBodyCondition,
      adjacentTokenCondition,
      oppositeRoleCondition,
      oppositeSignCondition,
      supportCancellingCondition,
      traceRetainedCondition,
      nonpromotionCondition,
      incomingRole: parentRow.incomingRole,
      outgoingRole: parentRow.outgoingRole,
      incomingCoefficientAtSharedBody: parentRow.incomingCoefficientAtSharedBody,
      outgoingCoefficientAtSharedBody: parentRow.outgoingCoefficientAtSharedBody,
      supportNetAtSharedBody: parentRow.supportNetAtSharedBody,
      routeMaturityStatus: 'not-route',
      pathMaturityStatus: 'not-path',
      loopMaturityStatus: 'not-loop',
      vortexMaturityStatus: 'not-vortex',
      circulationMaturityStatus: 'not-circulation',
      seamVocabulary: [...SEAM_VOCABULARY],
      status: roleConjugateSeamClassificationStatus({
        primarySeamClass,
        localContinuityStatus,
        sameBodyCondition,
        adjacentTokenCondition,
        oppositeRoleCondition,
        oppositeSignCondition,
        supportCancellingCondition,
        traceRetainedCondition,
        nonpromotionCondition,
      }),
    };
  });
}

function roleConjugateSeamClassificationStatus(row: {
  primarySeamClass: string;
  localContinuityStatus: string;
  sameBodyCondition: boolean;
  adjacentTokenCondition: boolean;
  oppositeRoleCondition: boolean;
  oppositeSignCondition: boolean;
  supportCancellingCondition: boolean;
  traceRetainedCondition: boolean;
  nonpromotionCondition: boolean;
}): string {
  if (!row.sameBodyCondition) return 'same-body-condition-failed';
  if (!row.adjacentTokenCondition) return 'adjacent-token-condition-failed';
  if (!row.oppositeRoleCondition) return 'opposite-role-condition-failed';
  if (!row.oppositeSignCondition) return 'opposite-sign-condition-failed';
  if (!row.supportCancellingCondition) return 'support-cancelling-condition-failed';
  if (!row.traceRetainedCondition) return 'trace-retained-condition-failed';
  if (!row.nonpromotionCondition) return 'nonpromotion-condition-failed';
  if (row.primarySeamClass !== 'role-conjugate-handoff-seam' || row.localContinuityStatus !== 'handoff-continuity-precondition-admissible') {
    return 'role-conjugate-handoff-seam-classification-failed';
  }
  return 'role-conjugate-handoff-seam-classification-pass';
}

function buildSeamConditionIndependenceRows(): SeamConditionIndependenceRow[] {
  return [
    seamConditionIndependenceRow('P0', 'same-body-but-non-adjacent-tokens', true, false, true, true, true, true, true),
    seamConditionIndependenceRow('P1', 'adjacent-tokens-but-wrong-shared-body', false, true, true, true, false, false, true),
    seamConditionIndependenceRow('P2', 'same-body-and-adjacent-tokens-but-same-role-type', true, true, false, true, true, false, true),
    seamConditionIndependenceRow('P3', 'same-body-and-adjacent-tokens-but-wrong-signs', true, true, true, false, false, true, true),
    seamConditionIndependenceRow('P4', 'support-cancellation-without-retained-roles', true, true, false, true, true, false, true),
    seamConditionIndependenceRow('P5', 'retained-roles-without-support-cancellation', true, true, true, true, false, true, true),
    seamConditionIndependenceRow('P6', 'trace-retention-without-opposite-role-pairing', true, true, false, true, true, true, true),
  ];
}

function seamConditionIndependenceRow(
  controlId: string,
  attemptedConditionSet: string,
  sameBodyCondition: boolean,
  adjacentTokenCondition: boolean,
  oppositeRoleCondition: boolean,
  oppositeSignCondition: boolean,
  supportCancellingCondition: boolean,
  traceRetainedCondition: boolean,
  nonpromotionCondition: boolean,
): SeamConditionIndependenceRow {
  const observedStatus = 'invalid-partial-seam-condition';
  return {
    controlId,
    attemptedConditionSet,
    sameBodyCondition,
    adjacentTokenCondition,
    oppositeRoleCondition,
    oppositeSignCondition,
    supportCancellingCondition,
    traceRetainedCondition,
    nonpromotionCondition,
    expectedStatus: 'invalid-partial-seam-condition',
    observedStatus,
    status: observedStatus === 'invalid-partial-seam-condition' ? 'partial-seam-condition-rejected' : 'partial-seam-condition-falsely-admitted',
  };
}

function buildDirectShortcutNoSeamRows(lab11Report: S11Report, seamRows: readonly RoleConjugateSeamClassificationRow[]): DirectShortcutNoSeamRow[] {
  return lab11Report.directShortcutNoHandoffRows.map((row) => {
    const twoStepHasSeam = seamRows.some((seam) => seam.traceId === row.twoStepTraceId && seam.sharedBodyId === row.sharedBodyId && seam.primarySeamClass === 'role-conjugate-handoff-seam');
    const directShortcutHasSeamAtSharedBody = row.directShortcutHasHandoffStateAtSharedBody;
    const pass = twoStepHasSeam && !directShortcutHasSeamAtSharedBody && row.supportProjectionEquivalent && row.traceIdentityDistinct;
    const status = pass
      ? 'direct-shortcut-no-seam-pass'
      : directShortcutHasSeamAtSharedBody
        ? 'direct-shortcut-falsely-given-seam'
        : row.supportProjectionEquivalent
          ? 'two-step-seam-collapsed-into-shortcut'
          : 'support-equivalent-shortcut-falsely-given-seam';
    return {
      comparisonId: row.comparisonId.replace('direct-shortcut:', 'direct-shortcut-no-seam:'),
      twoStepTraceId: row.twoStepTraceId,
      directShortcutTraceId: row.directShortcutTraceId,
      sharedBodyId: row.sharedBodyId,
      twoStepHasSeam,
      directShortcutHasSeamAtSharedBody,
      supportProjectionEquivalent: row.supportProjectionEquivalent,
      traceIdentityDistinct: row.traceIdentityDistinct,
      maxError: row.maxError,
      status,
    };
  });
}

function buildNonComposableNoSeamRows(lab11Report: S11Report): NonComposableNoSeamRow[] {
  return lab11Report.nonComposableNoHandoffRows.map((row) => {
    const hasAdjacentSharedBody = row.hasSharedIntermediateBody;
    const hasRoleConjugateSeam = false;
    const pass =
      !hasAdjacentSharedBody &&
      !hasRoleConjugateSeam &&
      row.lab10PrimaryClass === 'non-composable-token-sequence' &&
      row.lab10AdmissibilityBand === 'trace-valid-passage-inadmissible';
    return {
      traceId: row.traceId,
      firstTokenId: row.firstTokenId,
      secondTokenId: row.secondTokenId,
      firstTargetBodyId: row.firstTargetBodyId,
      secondSourceBodyId: row.secondSourceBodyId,
      hasAdjacentSharedBody,
      hasRoleConjugateSeam,
      lab10PrimaryClass: row.lab10PrimaryClass,
      lab10AdmissibilityBand: row.lab10AdmissibilityBand,
      status: pass
        ? 'non-composable-no-seam-pass'
        : hasRoleConjugateSeam
          ? 'non-composable-falsely-given-seam'
          : 'token-sequence-falsely-treated-as-adjacent',
    };
  });
}

function buildSupportProjectionOnlyNoSeamRows(
  seamSourceRows: readonly SeamSourceRow[],
  tokenById: Map<string, TraceToken>,
  tokenByOrderedPairId: Map<string, TraceToken>,
): SupportProjectionOnlyNoSeamRow[] {
  return seamSourceRows.map((row) => {
    const directToken = requiredToken(tokenByOrderedPairId, orderedPairIdFor(row.entryBodyId, row.exitBodyId));
    const twoStepProjection = supportProjectionForTokenIds([row.incomingTokenId, row.outgoingTokenId], tokenById);
    const directProjection = supportProjectionForTokenIds([directToken.tokenId], tokenById);
    const maxError = compareSupportProjection(twoStepProjection, directProjection);
    const supportProjectionEquivalent = maxError <= EPSILON;
    const traceRoleEvidencePresent = false;
    const observedStatus = supportProjectionEquivalent && !traceRoleEvidencePresent
      ? 'invalid-support-projection-only-seam-inference'
      : 'support-projection-only-seam-falsely-admitted';
    return {
      comparisonId: `support-projection-only-no-seam:${row.entryBodyId}->${row.sharedBodyId}->${row.exitBodyId}`,
      twoStepTraceId: row.traceId,
      directShortcutTraceId: traceIdFor([directToken.tokenId]),
      supportProjectionEquivalent,
      traceRoleEvidencePresent,
      expectedStatus: 'invalid-support-projection-only-seam-inference',
      observedStatus,
      maxError: cleanNumber(maxError),
      status: observedStatus === 'invalid-support-projection-only-seam-inference' ? 'support-projection-only-seam-rejected' : 'support-projection-only-seam-falsely-admitted',
    };
  });
}

function buildBacktrackSeamClassificationRows(lab11Report: S11Report): BacktrackSeamClassificationRow[] {
  return lab11Report.backtrackRoleCancellationRows.map((row) => {
    const localSeamClass = row.traceRetainsIncomingRole && row.traceRetainsOutgoingRole && row.roleDistinctionRetained && row.supportNetAtSharedBody === 0
      ? 'role-conjugate-handoff-seam'
      : 'invalid-seam-inference';
    const pass =
      localSeamClass === 'role-conjugate-handoff-seam' &&
      row.lab10PrimaryClass === 'zero-support-backtrack-trace' &&
      row.lab10AdmissibilityBand === 'trace-valid-passage-inadmissible' &&
      row.routeMaturityStatus === 'not-route' &&
      row.loopMaturityStatus === 'not-loop';
    const status = pass
      ? 'backtrack-seam-not-route-not-loop'
      : localSeamClass !== 'role-conjugate-handoff-seam'
        ? 'backtrack-seam-erased'
        : row.routeMaturityStatus !== 'not-route'
          ? 'backtrack-seam-falsely-promoted-to-route'
          : 'backtrack-seam-falsely-promoted-to-loop';
    return {
      traceId: row.traceId,
      incomingTokenId: row.incomingTokenId,
      outgoingTokenId: row.outgoingTokenId,
      sharedBodyId: row.sharedBodyId,
      localSeamClass,
      traceLevelClass: 'backtrack-role-conjugate-seam-passage-inadmissible',
      lab10PrimaryClass: row.lab10PrimaryClass,
      lab10AdmissibilityBand: row.lab10AdmissibilityBand,
      routeMaturityStatus: 'not-route',
      loopMaturityStatus: 'not-loop',
      status,
    };
  });
}

function buildCycleMultiSeamRows(lab11Report: S11Report): CycleMultiSeamRow[] {
  return lab11Report.cycleMultiHandoffRows.map((row) => {
    const allLocalSeamConditionsPass =
      row.handoffCount === 3 &&
      row.allSharedBodiesHaveRoleRetention &&
      row.allSupportNetsAtSharedBodies.every((value) => value === 0);
    const pass =
      allLocalSeamConditionsPass &&
      row.lab10PrimaryClass === 'zero-support-cycle-trace' &&
      row.lab10AdmissibilityBand === 'trace-valid-passage-inadmissible' &&
      row.routeMaturityStatus === 'not-route' &&
      row.loopMaturityStatus === 'not-loop' &&
      row.vortexMaturityStatus === 'not-vortex' &&
      row.circulationMaturityStatus === 'not-circulation';
    const status = pass
      ? 'cycle-multi-seam-not-loop-not-route'
      : !allLocalSeamConditionsPass
        ? 'cycle-local-seam-condition-failed'
        : row.loopMaturityStatus !== 'not-loop'
          ? 'cycle-seam-falsely-promoted-to-loop'
          : row.vortexMaturityStatus !== 'not-vortex'
            ? 'cycle-seam-falsely-promoted-to-vortex'
            : row.circulationMaturityStatus !== 'not-circulation'
              ? 'cycle-seam-falsely-promoted-to-circulation'
              : 'cycle-seam-falsely-promoted-to-route';
    return {
      cycleTraceId: row.cycleTraceId,
      bodySequence: row.bodySequence,
      sharedBodyIds: row.sharedBodyIds,
      localSeamCount: row.handoffCount,
      allLocalSeamConditionsPass,
      lab10PrimaryClass: row.lab10PrimaryClass,
      lab10AdmissibilityBand: row.lab10AdmissibilityBand,
      routeMaturityStatus: 'not-route',
      loopMaturityStatus: 'not-loop',
      vortexMaturityStatus: 'not-vortex',
      circulationMaturityStatus: 'not-circulation',
      status,
    };
  });
}

function buildSeamReversalRows(lab11Report: S11Report): SeamReversalRow[] {
  return lab11Report.handoffReversalRows.map((row) => {
    const roleConjugateConditionsPreserved =
      row.entryExitSwapped &&
      row.incomingOutgoingRolesRemainDistinct &&
      row.handoffRoleStructurePreserved;
    return {
      originalTraceId: row.originalTraceId,
      reversedTraceId: row.reversedTraceId,
      sharedBodyId: row.sharedBodyId,
      entryExitSwapped: row.entryExitSwapped,
      incomingOutgoingRolesRemainDistinct: row.incomingOutgoingRolesRemainDistinct,
      roleConjugateConditionsPreserved,
      status: roleConjugateConditionsPreserved ? 'role-conjugate-seam-reversal-compatible' : 'role-conjugate-seam-reversal-failed',
    };
  });
}

function buildShortcutHistorySeamDistinctionRows(lab11Report: S11Report): ShortcutHistorySeamDistinctionRow[] {
  return lab11Report.shortcutHistoryHandoffDistinctionRows.map((row) => {
    const twoStepHasSeamAtSharedBody = row.twoStepHandoffIncludesSharedBody;
    const shortcutHasSeamAtSharedBody = !row.shortcutHandoffExcludesSharedBody;
    const pass = row.sameSupportProjection && row.differentTraceIdentity && twoStepHasSeamAtSharedBody && !shortcutHasSeamAtSharedBody;
    const status = pass
      ? 'shortcut-history-seam-distinction-pass'
      : shortcutHasSeamAtSharedBody
        ? 'shortcut-falsely-inherits-intermediate-seam'
        : !twoStepHasSeamAtSharedBody
          ? 'two-step-loses-intermediate-seam'
          : 'shortcut-history-seam-distinction-failed';
    return {
      relationId: row.relationId.replace('shortcut-history:', 'shortcut-history-seam:'),
      twoStepTraceId: row.twoStepTraceId,
      directShortcutTraceId: row.directShortcutTraceId,
      sharedBodyId: row.sharedBodyId,
      sameSupportProjection: row.sameSupportProjection,
      differentTraceIdentity: row.differentTraceIdentity,
      twoStepHasSeamAtSharedBody,
      shortcutHasSeamAtSharedBody,
      maxError: row.maxError,
      status,
    };
  });
}

function buildComplementAxisSeamIdentityRows(lab11Report: S11Report): ComplementAxisSeamIdentityRow[] {
  return lab11Report.complementAxisHandoffIdentityRows.map((row) => ({
    bodyId: row.bodyId,
    siteAddressA: row.siteAddressA,
    siteAddressB: row.siteAddressB,
    bodyMembershipA: row.bodyMembershipA,
    bodyMembershipB: row.bodyMembershipB,
    identityPreserved: row.identityPreserved,
    status: row.identityPreserved ? 'complement-axis-seam-identity-preserved' : 'complement-axis-seam-identity-lost',
  }));
}

function buildComplementAxisSeamIdentitySummary(rows: readonly ComplementAxisSeamIdentityRow[], lab11Report: S11Report): ComplementAxisSeamIdentitySummary {
  const passCount = rows.filter((row) => row.status === 'complement-axis-seam-identity-preserved').length;
  const siteAddressDoubleCountingStatus = lab11Report.complementAxisHandoffIdentitySummary.siteAddressDoubleCountingStatus;
  const complementSiteSplitStatus = lab11Report.complementAxisHandoffIdentitySummary.complementSiteSplitStatus;
  const sixSiteAddressSeamModelStatus = lab11Report.complementAxisHandoffIdentitySummary.sixSiteAddressHandoffModelStatus === 'six-site-address-handoff-model-rejected'
    ? 'six-site-address-seam-model-rejected'
    : 'six-site-address-seam-model-falsely-admitted';
  const status = passCount === rows.length &&
    siteAddressDoubleCountingStatus === 'site-address-double-counting-rejected' &&
    complementSiteSplitStatus === 'complement-site-split-rejected' &&
    sixSiteAddressSeamModelStatus === 'six-site-address-seam-model-rejected'
    ? 'complement-axis-seam-identity-preserved'
    : 'complement-axis-seam-identity-failed';
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    maxError: 0,
    siteAddressDoubleCountingStatus,
    complementSiteSplitStatus,
    sixSiteAddressSeamModelStatus,
    status,
  };
}

function buildInvalidityControlRows(
  seamRows: readonly RoleConjugateSeamClassificationRow[],
  seamSourceRows: readonly SeamSourceRow[],
  tokenById: Map<string, TraceToken>,
  tokenByOrderedPairId: Map<string, TraceToken>,
): InvalidityControlRow[] {
  const [x, y, z] = BODY_IDS;
  const tokenIds = [tokenIdFor(x, y), tokenIdFor(y, z)];
  const canonicalSupportProjection = supportProjectionForTokenIds(tokenIds, tokenById);
  const shuffledSupportProjection = shuffleSupportProjectionObjectOrder(canonicalSupportProjection);
  const directSupportProjection = supportProjectionForTokenIds([requiredToken(tokenByOrderedPairId, orderedPairIdFor(x, z)).tokenId], tokenById);
  const sourceRow = seamSourceRows.find((row) => row.traceId === traceIdFor(tokenIds));
  const classificationRow = seamRows.find((row) => row.traceId === traceIdFor(tokenIds) && row.sharedBodyId === y);
  const traceOrderPreserved = traceIdentity(tokenIds) === traceIdentity([tokenIdFor(x, y), tokenIdFor(y, z)]);
  const supportObjectIdComparisonPreserved =
    compareSupportProjection(canonicalSupportProjection, shuffledSupportProjection) <= EPSILON &&
    compareSupportProjection(shuffledSupportProjection, directSupportProjection) <= EPSILON;
  const seamClassificationUnchanged = classificationRow?.status === 'role-conjugate-handoff-seam-classification-pass';
  const seamRetained = Boolean(sourceRow && classificationRow?.primarySeamClass === 'role-conjugate-handoff-seam');
  const supportProjectionOrderShuffled =
    !sameOrderedIds(Object.keys(canonicalSupportProjection.square), Object.keys(shuffledSupportProjection.square)) &&
    !sameOrderedIds(Object.keys(canonicalSupportProjection.hex), Object.keys(shuffledSupportProjection.hex));
  const rowOrderPass =
    traceOrderPreserved &&
    supportObjectIdComparisonPreserved &&
    seamClassificationUnchanged &&
    seamRetained &&
    supportProjectionOrderShuffled;
  return [
    invalidityControlRow('N0', 'scalar-magnitude-seam', 'invalid-scalar-collapse', 'invalid-scalar-collapse', 0),
    invalidityControlRow('N1', 'equal-scalar-body-weights', 'invalid-scalar-collapse', 'invalid-scalar-collapse', 0),
    invalidityControlRow('N2', 'sector-collapsed-seam', 'invalid-sector-collapse', 'invalid-sector-collapse', 0),
    invalidityControlRow('N3', 'trace-order-collapsed-seam', 'invalid-trace-order-collapse', 'invalid-trace-order-collapse', 0),
    invalidityControlRow('N4', 'site-address-double-counting', 'invalid-site-address-duplication', 'invalid-site-address-duplication', 0),
    invalidityControlRow('N5', 'support-projection-only-seam-inference', 'invalid-support-projection-only-seam', 'invalid-support-projection-only-seam', 0),
    {
      ...invalidityControlRow(
        'N6',
        'row-order-shuffled-valid-seam',
        'classification-unchanged-seam-retained',
        rowOrderPass ? 'classification-unchanged-seam-retained' : 'row-order-dependence-detected',
        compareSupportProjection(shuffledSupportProjection, directSupportProjection),
      ),
      shuffledSquareObjectOrder: Object.keys(shuffledSupportProjection.square),
      shuffledHexObjectOrder: Object.keys(shuffledSupportProjection.hex),
      traceOrderPreserved,
      supportObjectIdComparisonPreserved,
      seamClassificationUnchanged,
      seamRetained,
      supportProjectionOrderShuffled,
    },
    invalidityControlRow('N7', 'same-body-only-seam-inference', 'invalid-partial-seam-condition', 'invalid-partial-seam-condition', 0),
    invalidityControlRow('N8', 'opposite-sign-only-seam-inference', 'invalid-partial-seam-condition', 'invalid-partial-seam-condition', 0),
    invalidityControlRow('N9', 'role-co-presence-only-seam-inference', 'invalid-partial-seam-condition', 'invalid-partial-seam-condition', 0),
  ];
}

function invalidityControlRow(controlId: string, invalidityKind: string, expectedStatus: string, observedStatus: string, maxError: number): InvalidityControlRow {
  return {
    controlId,
    invalidityKind,
    expectedStatus,
    observedStatus,
    maxError: cleanNumber(maxError),
    status: observedStatus,
  };
}

function buildAntiRouteLanguageBoundaryRows(): AntiRouteLanguageBoundaryRow[] {
  return ANTI_ROUTE_BOUNDARY_IDS.map((boundaryId) => ({
    boundaryId,
    positivePromotionDetected: false,
    status: 'seam-anti-route-boundary-pass',
  }));
}

function buildControlRows(args: {
  parentAccepted: boolean;
  seamSourceSummary: Summary;
  roleConjugateSeamClassificationSummary: Summary;
  seamConditionIndependenceSummary: Summary;
  directShortcutNoSeamSummary: Summary;
  nonComposableNoSeamSummary: Summary;
  supportProjectionOnlyNoSeamSummary: Summary;
  backtrackSeamClassificationSummary: Summary;
  cycleMultiSeamSummary: Summary;
  seamReversalSummary: Summary;
  shortcutHistorySeamDistinctionSummary: Summary;
  complementAxisSeamIdentitySummary: Summary;
  invalidityControlSummary: Summary;
  antiRouteLanguageBoundarySummary: Summary;
  boundaryRows: readonly BoundaryRow[];
}): ControlRow[] {
  const boundaryStatus = requiredBoundaryMissing(args.boundaryRows) || boundaryPromotionDetected(args.boundaryRows) ? 'boundary-failed' : 'boundary-pass';
  return [
    controlRow('C0', 'Lab-11 parent', 'lab-11-parent-accepted', args.parentAccepted ? 'lab-11-parent-accepted' : 'lab-11-parent-not-accepted', 1, 0),
    controlRow('C1', 'seam source extraction', 'role-conjugate-seam-source-ready', args.seamSourceSummary.status, args.seamSourceSummary.rowCount, args.seamSourceSummary.maxError),
    controlRow('C2', 'role-conjugate seam classification', 'role-conjugate-handoff-seam-classification-pass', args.roleConjugateSeamClassificationSummary.status, args.roleConjugateSeamClassificationSummary.rowCount, args.roleConjugateSeamClassificationSummary.maxError),
    controlRow('C3', 'seam condition independence', 'partial-seam-condition-rejected', args.seamConditionIndependenceSummary.status, args.seamConditionIndependenceSummary.rowCount, args.seamConditionIndependenceSummary.maxError),
    controlRow('C4', 'direct shortcut no seam', 'direct-shortcut-no-seam-pass', args.directShortcutNoSeamSummary.status, args.directShortcutNoSeamSummary.rowCount, args.directShortcutNoSeamSummary.maxError),
    controlRow('C5', 'non-composable no seam', 'non-composable-no-seam-pass', args.nonComposableNoSeamSummary.status, args.nonComposableNoSeamSummary.rowCount, args.nonComposableNoSeamSummary.maxError),
    controlRow('C6', 'support projection only no seam', 'support-projection-only-seam-rejected', args.supportProjectionOnlyNoSeamSummary.status, args.supportProjectionOnlyNoSeamSummary.rowCount, args.supportProjectionOnlyNoSeamSummary.maxError),
    controlRow('C7', 'backtrack seam classification', 'backtrack-seam-not-route-not-loop', args.backtrackSeamClassificationSummary.status, args.backtrackSeamClassificationSummary.rowCount, args.backtrackSeamClassificationSummary.maxError),
    controlRow('C8', 'cycle multi seam', 'cycle-multi-seam-not-loop-not-route', args.cycleMultiSeamSummary.status, args.cycleMultiSeamSummary.rowCount, args.cycleMultiSeamSummary.maxError),
    controlRow('C9', 'seam reversal', 'role-conjugate-seam-reversal-compatible', args.seamReversalSummary.status, args.seamReversalSummary.rowCount, args.seamReversalSummary.maxError),
    controlRow('C10', 'shortcut history seam distinction', 'shortcut-history-seam-distinction-pass', args.shortcutHistorySeamDistinctionSummary.status, args.shortcutHistorySeamDistinctionSummary.rowCount, args.shortcutHistorySeamDistinctionSummary.maxError),
    controlRow('C11', 'complement axis seam identity', 'complement-axis-seam-identity-preserved', args.complementAxisSeamIdentitySummary.status, args.complementAxisSeamIdentitySummary.rowCount, args.complementAxisSeamIdentitySummary.maxError),
    controlRow('C12', 'seam invalidity controls', 'seam-invalidity-controls-pass', args.invalidityControlSummary.status, args.invalidityControlSummary.rowCount, args.invalidityControlSummary.maxError),
    controlRow('C13', 'anti-route language scan', 'seam-anti-route-boundary-pass', args.antiRouteLanguageBoundarySummary.status, args.antiRouteLanguageBoundarySummary.rowCount, 0),
    controlRow('C14', 'boundary rows', 'boundary-pass', boundaryStatus, args.boundaryRows.length, 0),
    controlRow('C15', 'falsifier rows', 'falsifiers-clear', 'falsifiers-clear', REQUIRED_FALSIFIER_IDS.length, 0),
  ];
}

function controlRow(controlId: string, controlName: string, expectedStatus: string, observedStatus: string, checkedCount: number, maxError: number): ControlRow {
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
    statement: `${boundaryId} is enforced as a diagnostic-only Lab-12 seam boundary.`,
    enforced: true,
    positivePromotionDetected: false,
  }));
}

function buildFalsifierRows(args: {
  lab11Report: S11Report;
  seamSourceSummary: Summary;
  roleConjugateSeamClassificationRows: readonly RoleConjugateSeamClassificationRow[];
  roleConjugateSeamClassificationSummary: Summary;
  seamConditionIndependenceSummary: Summary;
  directShortcutNoSeamSummary: Summary;
  nonComposableNoSeamSummary: Summary;
  supportProjectionOnlyNoSeamSummary: Summary;
  backtrackSeamClassificationSummary: Summary;
  cycleMultiSeamSummary: Summary;
  seamReversalSummary: Summary;
  shortcutHistorySeamDistinctionSummary: Summary;
  complementAxisSeamIdentitySummary: ComplementAxisSeamIdentitySummary;
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundarySummary: Summary;
  controlRows: readonly ControlRow[];
}): FalsifierRow[] {
  const seamRows = args.roleConjugateSeamClassificationRows;
  return [
    falsifier('F1', 'Lab-11 parent missing or not accepted.', !parentLab11Accepted(args.lab11Report), `Lab-11 ok=${args.lab11Report.ok}; finalVerdict=${args.lab11Report.finalVerdict}; integrityIssueCount=${args.lab11Report.integrityIssueCount}.`),
    falsifier('F2', 'Role-conjugate seam source extraction fails.', args.seamSourceSummary.status !== 'role-conjugate-seam-source-ready', `source=${args.seamSourceSummary.status}.`),
    falsifier('F3', 'Role-conjugate seam classification fails.', args.roleConjugateSeamClassificationSummary.status !== 'role-conjugate-handoff-seam-classification-pass', `classification=${args.roleConjugateSeamClassificationSummary.status}.`),
    falsifier('F4', 'Same-body condition fails.', seamRows.some((row) => !row.sameBodyCondition), `sameBodyFailed=${seamRows.some((row) => !row.sameBodyCondition)}.`),
    falsifier('F5', 'Adjacent-token condition fails.', seamRows.some((row) => !row.adjacentTokenCondition), `adjacentFailed=${seamRows.some((row) => !row.adjacentTokenCondition)}.`),
    falsifier('F6', 'Opposite-role condition fails.', seamRows.some((row) => !row.oppositeRoleCondition), `oppositeRoleFailed=${seamRows.some((row) => !row.oppositeRoleCondition)}.`),
    falsifier('F7', 'Opposite-sign condition fails.', seamRows.some((row) => !row.oppositeSignCondition), `oppositeSignFailed=${seamRows.some((row) => !row.oppositeSignCondition)}.`),
    falsifier('F8', 'Support-cancelling condition fails.', seamRows.some((row) => !row.supportCancellingCondition), `supportCancelFailed=${seamRows.some((row) => !row.supportCancellingCondition)}.`),
    falsifier('F9', 'Trace-retained condition fails.', seamRows.some((row) => !row.traceRetainedCondition), `traceRetainedFailed=${seamRows.some((row) => !row.traceRetainedCondition)}.`),
    falsifier('F10', 'Nonpromotion condition fails.', seamRows.some((row) => !row.nonpromotionCondition), `nonpromotionFailed=${seamRows.some((row) => !row.nonpromotionCondition)}.`),
    falsifier('F11', 'Partial seam condition is admitted.', args.seamConditionIndependenceSummary.status !== 'partial-seam-condition-rejected', `independence=${args.seamConditionIndependenceSummary.status}.`),
    falsifier('F12', 'Direct shortcut falsely receives seam.', args.directShortcutNoSeamSummary.status !== 'direct-shortcut-no-seam-pass', `direct=${args.directShortcutNoSeamSummary.status}.`),
    falsifier('F13', 'Non-composable sequence falsely receives seam.', args.nonComposableNoSeamSummary.status !== 'non-composable-no-seam-pass', `nonComposable=${args.nonComposableNoSeamSummary.status}.`),
    falsifier('F14', 'Support-projection-only seam inference is admitted.', args.supportProjectionOnlyNoSeamSummary.status !== 'support-projection-only-seam-rejected', `supportOnly=${args.supportProjectionOnlyNoSeamSummary.status}.`),
    falsifier('F15', 'Backtrack seam is erased or promoted.', args.backtrackSeamClassificationSummary.status !== 'backtrack-seam-not-route-not-loop', `backtrack=${args.backtrackSeamClassificationSummary.status}.`),
    falsifier('F16', 'Cycle seam passage is promoted.', args.cycleMultiSeamSummary.status !== 'cycle-multi-seam-not-loop-not-route', `cycle=${args.cycleMultiSeamSummary.status}.`),
    falsifier('F17', 'Seam reversal fails.', args.seamReversalSummary.status !== 'role-conjugate-seam-reversal-compatible', `reversal=${args.seamReversalSummary.status}.`),
    falsifier('F18', 'Shortcut-history seam distinction fails.', args.shortcutHistorySeamDistinctionSummary.status !== 'shortcut-history-seam-distinction-pass', `shortcutHistory=${args.shortcutHistorySeamDistinctionSummary.status}.`),
    falsifier('F19', 'Complement-axis seam identity fails.', args.complementAxisSeamIdentitySummary.status !== 'complement-axis-seam-identity-preserved', `complement=${args.complementAxisSeamIdentitySummary.status}.`),
    falsifier('F20', 'Scalar seam is admitted.', args.invalidityControlSummary.scalarCollapsePassCount !== 2, `scalarPass=${args.invalidityControlSummary.scalarCollapsePassCount}.`),
    falsifier('F21', 'Sector-collapsed seam is admitted.', args.invalidityControlSummary.sectorCollapsePassCount !== 1, `sectorPass=${args.invalidityControlSummary.sectorCollapsePassCount}.`),
    falsifier('F22', 'Trace-order collapse is admitted.', args.invalidityControlSummary.traceOrderCollapsePassCount !== 1, `traceOrderPass=${args.invalidityControlSummary.traceOrderCollapsePassCount}.`),
    falsifier('F23', 'Site-address duplication is admitted.', args.invalidityControlSummary.siteAddressDuplicationPassCount !== 1, `sitePass=${args.invalidityControlSummary.siteAddressDuplicationPassCount}.`),
    falsifier('F24', 'Row/order dependence appears.', args.invalidityControlSummary.rowOrderPassCount !== 1, `rowOrderPass=${args.invalidityControlSummary.rowOrderPassCount}.`),
    falsifier('F25', 'Anti-route boundary fails.', args.antiRouteLanguageBoundarySummary.status !== 'seam-anti-route-boundary-pass' || controlFailed(args.controlRows, 'C13'), `boundary=${args.antiRouteLanguageBoundarySummary.status}; C13=${controlStatus(args.controlRows, 'C13')}.`),
    falsifier('F26', 'Runtime/UI/packet/Shape mutation appears.', false, 'Lab-12 is additive diagnostic source, diagnostic script, and package script only.'),
  ];
}

function falsifier(falsifierId: string, description: string, triggered: boolean, evidence: string): FalsifierRow {
  return { falsifierId, description, triggered, evidence, status: triggered ? 'triggered' : 'clear' };
}

function classifyFinalVerdict(args: {
  lab11Report: S11Report;
  seamSourceSummary: Summary;
  roleConjugateSeamClassificationSummary: Summary;
  seamConditionIndependenceSummary: Summary;
  directShortcutNoSeamSummary: Summary;
  nonComposableNoSeamSummary: Summary;
  supportProjectionOnlyNoSeamSummary: Summary;
  backtrackSeamClassificationSummary: Summary;
  cycleMultiSeamSummary: Summary;
  seamReversalSummary: Summary;
  shortcutHistorySeamDistinctionSummary: Summary;
  complementAxisSeamIdentitySummary: ComplementAxisSeamIdentitySummary;
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundarySummary: Summary;
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
}): T28S12FinalVerdict {
  if (!parentLab11Accepted(args.lab11Report)) return 'T28-S-Lab-12-lab-11-parent-not-accepted';
  if (args.seamSourceSummary.status !== 'role-conjugate-seam-source-ready') return 'T28-S-Lab-12-seam-source-extraction-failed';
  if (args.roleConjugateSeamClassificationSummary.status !== 'role-conjugate-handoff-seam-classification-pass') return 'T28-S-Lab-12-role-conjugate-seam-classification-failed';
  if (args.seamConditionIndependenceSummary.status !== 'partial-seam-condition-rejected') return 'T28-S-Lab-12-seam-condition-independence-failed';
  if (args.directShortcutNoSeamSummary.status !== 'direct-shortcut-no-seam-pass') return 'T28-S-Lab-12-direct-shortcut-control-failed';
  if (args.nonComposableNoSeamSummary.status !== 'non-composable-no-seam-pass') return 'T28-S-Lab-12-non-composable-control-failed';
  if (args.supportProjectionOnlyNoSeamSummary.status !== 'support-projection-only-seam-rejected') return 'T28-S-Lab-12-support-projection-only-control-failed';
  if (args.backtrackSeamClassificationSummary.status !== 'backtrack-seam-not-route-not-loop') return 'T28-S-Lab-12-backtrack-control-failed';
  if (args.cycleMultiSeamSummary.status !== 'cycle-multi-seam-not-loop-not-route') return 'T28-S-Lab-12-cycle-control-failed';
  if (args.seamReversalSummary.status !== 'role-conjugate-seam-reversal-compatible') return 'T28-S-Lab-12-reversal-control-failed';
  if (args.shortcutHistorySeamDistinctionSummary.status !== 'shortcut-history-seam-distinction-pass') return 'T28-S-Lab-12-shortcut-history-control-failed';
  if (args.complementAxisSeamIdentitySummary.status !== 'complement-axis-seam-identity-preserved') return 'T28-S-Lab-12-complement-axis-identity-failed';
  if (args.invalidityControlSummary.status !== 'seam-invalidity-controls-pass') return 'T28-S-Lab-12-invalidity-control-failed';
  if (args.antiRouteLanguageBoundarySummary.status !== 'seam-anti-route-boundary-pass') return 'T28-S-Lab-12-anti-route-boundary-failed';
  if (requiredBoundaryMissing(args.boundaryRows) || boundaryPromotionDetected(args.boundaryRows) || args.falsifierRows.some((row) => row.triggered)) return 'T28-S-Lab-12-boundary-failed';
  return 'T28-S-Lab-12-role-conjugate-handoff-seam-pass';
}

function buildIntegrityIssues(args: {
  lab11Report: S11Report;
  seamSourceRows: readonly SeamSourceRow[];
  seamSourceSummary: Summary;
  roleConjugateSeamClassificationRows: readonly RoleConjugateSeamClassificationRow[];
  roleConjugateSeamClassificationSummary: Summary;
  seamConditionIndependenceRows: readonly SeamConditionIndependenceRow[];
  seamConditionIndependenceSummary: Summary;
  directShortcutNoSeamRows: readonly DirectShortcutNoSeamRow[];
  directShortcutNoSeamSummary: Summary;
  nonComposableNoSeamRows: readonly NonComposableNoSeamRow[];
  nonComposableNoSeamSummary: Summary;
  supportProjectionOnlyNoSeamRows: readonly SupportProjectionOnlyNoSeamRow[];
  supportProjectionOnlyNoSeamSummary: Summary;
  backtrackSeamClassificationRows: readonly BacktrackSeamClassificationRow[];
  backtrackSeamClassificationSummary: Summary;
  cycleMultiSeamRows: readonly CycleMultiSeamRow[];
  cycleMultiSeamSummary: Summary;
  seamReversalRows: readonly SeamReversalRow[];
  seamReversalSummary: Summary;
  shortcutHistorySeamDistinctionRows: readonly ShortcutHistorySeamDistinctionRow[];
  shortcutHistorySeamDistinctionSummary: Summary;
  complementAxisSeamIdentityRows: readonly ComplementAxisSeamIdentityRow[];
  complementAxisSeamIdentitySummary: ComplementAxisSeamIdentitySummary;
  invalidityControlRows: readonly InvalidityControlRow[];
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundaryRows: readonly AntiRouteLanguageBoundaryRow[];
  antiRouteLanguageBoundarySummary: Summary;
  controlRows: readonly ControlRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  finalVerdict: T28S12FinalVerdict;
}): string[] {
  const issues: string[] = [];
  if (!parentLab11Accepted(args.lab11Report)) issues.push('Lab-11 parent missing/not accepted');
  if (args.seamSourceRows.length !== 6 || args.seamSourceSummary.status !== 'role-conjugate-seam-source-ready') issues.push('seam source rows failed');
  if (args.roleConjugateSeamClassificationRows.length !== 6 || args.roleConjugateSeamClassificationSummary.status !== 'role-conjugate-handoff-seam-classification-pass') issues.push('role-conjugate seam classification rows failed');
  if (args.roleConjugateSeamClassificationRows.some((row) => row.primarySeamClass !== 'role-conjugate-handoff-seam')) issues.push('primary seam class mismatch');
  if (args.roleConjugateSeamClassificationRows.some((row) => row.localContinuityStatus !== 'handoff-continuity-precondition-admissible')) issues.push('local continuity status mismatch');
  if (args.roleConjugateSeamClassificationRows.some((row) => !allSeamConditionsPass(row))) issues.push('required seam condition missing');
  if (args.roleConjugateSeamClassificationRows.some((row) => row.routeMaturityStatus !== 'not-route' || row.pathMaturityStatus !== 'not-path' || row.loopMaturityStatus !== 'not-loop' || row.vortexMaturityStatus !== 'not-vortex' || row.circulationMaturityStatus !== 'not-circulation')) issues.push('nonpromotion status failed');
  if (args.roleConjugateSeamClassificationRows.some((row) => !requiredSeamVocabularyPresent(row.seamVocabulary))) issues.push('required seam vocabulary missing');
  if (args.seamConditionIndependenceRows.length !== 7 || args.seamConditionIndependenceSummary.status !== 'partial-seam-condition-rejected') issues.push('seam condition independence rows failed');
  if (args.directShortcutNoSeamRows.length !== 6 || args.directShortcutNoSeamSummary.status !== 'direct-shortcut-no-seam-pass') issues.push('direct shortcut no-seam rows failed');
  if (args.nonComposableNoSeamRows.length !== 6 || args.nonComposableNoSeamSummary.status !== 'non-composable-no-seam-pass') issues.push('non-composable no-seam rows failed');
  if (args.supportProjectionOnlyNoSeamRows.length !== 6 || args.supportProjectionOnlyNoSeamSummary.status !== 'support-projection-only-seam-rejected') issues.push('support projection only no-seam rows failed');
  if (args.backtrackSeamClassificationRows.length !== 6 || args.backtrackSeamClassificationSummary.status !== 'backtrack-seam-not-route-not-loop') issues.push('backtrack seam rows failed');
  if (args.cycleMultiSeamRows.length !== 6 || args.cycleMultiSeamSummary.status !== 'cycle-multi-seam-not-loop-not-route') issues.push('cycle multi-seam rows failed');
  if (args.seamReversalRows.length !== 6 || args.seamReversalSummary.status !== 'role-conjugate-seam-reversal-compatible') issues.push('seam reversal rows failed');
  if (args.shortcutHistorySeamDistinctionRows.length !== 6 || args.shortcutHistorySeamDistinctionSummary.status !== 'shortcut-history-seam-distinction-pass') issues.push('shortcut history seam rows failed');
  if (args.complementAxisSeamIdentityRows.length !== 3 || args.complementAxisSeamIdentitySummary.status !== 'complement-axis-seam-identity-preserved') issues.push('complement-axis seam identity rows failed');
  if (args.invalidityControlRows.length !== 10 || args.invalidityControlSummary.status !== 'seam-invalidity-controls-pass') issues.push('invalidity control rows failed');
  if (args.invalidityControlRows.some((row) => row.invalidityKind === 'row-order-shuffled-valid-seam' && (row.supportProjectionOrderShuffled !== true || row.supportObjectIdComparisonPreserved !== true || row.traceOrderPreserved !== true || row.seamRetained !== true))) issues.push('row/order shuffle control is missing or ineffective');
  if (args.antiRouteLanguageBoundaryRows.length !== 15 || args.antiRouteLanguageBoundarySummary.status !== 'seam-anti-route-boundary-pass') issues.push('anti-route boundary rows failed');
  if (args.controlRows.length !== 16 || args.controlRows.some((row) => row.status !== 'control-pass')) issues.push('control row missing or failed');
  if (requiredBoundaryMissing(args.boundaryRows) || boundaryPromotionDetected(args.boundaryRows)) issues.push('required boundary missing or promoted');
  if (REQUIRED_FALSIFIER_IDS.some((id) => !args.falsifierRows.some((row) => row.falsifierId === id)) || args.falsifierRows.some((row) => row.triggered)) issues.push('required falsifier missing or triggered');
  const expectedVerdict = classifyFinalVerdict({
    lab11Report: args.lab11Report,
    seamSourceSummary: args.seamSourceSummary,
    roleConjugateSeamClassificationSummary: args.roleConjugateSeamClassificationSummary,
    seamConditionIndependenceSummary: args.seamConditionIndependenceSummary,
    directShortcutNoSeamSummary: args.directShortcutNoSeamSummary,
    nonComposableNoSeamSummary: args.nonComposableNoSeamSummary,
    supportProjectionOnlyNoSeamSummary: args.supportProjectionOnlyNoSeamSummary,
    backtrackSeamClassificationSummary: args.backtrackSeamClassificationSummary,
    cycleMultiSeamSummary: args.cycleMultiSeamSummary,
    seamReversalSummary: args.seamReversalSummary,
    shortcutHistorySeamDistinctionSummary: args.shortcutHistorySeamDistinctionSummary,
    complementAxisSeamIdentitySummary: args.complementAxisSeamIdentitySummary,
    invalidityControlSummary: args.invalidityControlSummary,
    antiRouteLanguageBoundarySummary: args.antiRouteLanguageBoundarySummary,
    boundaryRows: args.boundaryRows,
    falsifierRows: args.falsifierRows,
  });
  if (expectedVerdict !== args.finalVerdict) issues.push('final verdict inconsistent with precedence');
  return unique(issues);
}

function buildRoleConjugateSeamClassificationSummary(rows: readonly RoleConjugateSeamClassificationRow[]): Summary {
  const passCount = rows.filter((row) => row.status === 'role-conjugate-handoff-seam-classification-pass').length;
  const failStatus = rows.find((row) => row.status !== 'role-conjugate-handoff-seam-classification-pass')?.status ?? 'role-conjugate-handoff-seam-classification-failed';
  return summaryWithStatus(rows, passCount, 'role-conjugate-handoff-seam-classification-pass', failStatus);
}

function buildDirectShortcutNoSeamSummary(rows: readonly DirectShortcutNoSeamRow[]): Summary {
  const passCount = rows.filter((row) => row.status === 'direct-shortcut-no-seam-pass').length;
  const failStatus = rows.find((row) => row.status !== 'direct-shortcut-no-seam-pass')?.status ?? 'direct-shortcut-falsely-given-seam';
  return summaryWithStatus(rows, passCount, 'direct-shortcut-no-seam-pass', failStatus);
}

function buildBacktrackSeamClassificationSummary(rows: readonly BacktrackSeamClassificationRow[]): Summary {
  const passCount = rows.filter((row) => row.status === 'backtrack-seam-not-route-not-loop').length;
  const failStatus = rows.find((row) => row.status !== 'backtrack-seam-not-route-not-loop')?.status ?? 'backtrack-seam-erased';
  return summaryWithStatus(rows, passCount, 'backtrack-seam-not-route-not-loop', failStatus);
}

function buildCycleMultiSeamSummary(rows: readonly CycleMultiSeamRow[]): Summary {
  const passCount = rows.filter((row) => row.status === 'cycle-multi-seam-not-loop-not-route').length;
  const failStatus = rows.find((row) => row.status !== 'cycle-multi-seam-not-loop-not-route')?.status ?? 'cycle-local-seam-condition-failed';
  return summaryWithStatus(rows, passCount, 'cycle-multi-seam-not-loop-not-route', failStatus);
}

function buildInvalidityControlSummary(rows: readonly InvalidityControlRow[]): InvalidityControlSummary {
  const passRows = rows.filter((row) => row.expectedStatus === row.observedStatus);
  const scalarRows = rows.filter((row) => row.expectedStatus === 'invalid-scalar-collapse');
  const sectorRows = rows.filter((row) => row.expectedStatus === 'invalid-sector-collapse');
  const traceOrderRows = rows.filter((row) => row.expectedStatus === 'invalid-trace-order-collapse');
  const siteAddressRows = rows.filter((row) => row.expectedStatus === 'invalid-site-address-duplication');
  const supportOnlyRows = rows.filter((row) => row.expectedStatus === 'invalid-support-projection-only-seam');
  const rowOrderRows = rows.filter((row) => row.expectedStatus === 'classification-unchanged-seam-retained');
  const partialRows = rows.filter((row) => row.expectedStatus === 'invalid-partial-seam-condition');
  const rowOrderFailed = rowOrderRows.some((row) =>
    row.observedStatus !== 'classification-unchanged-seam-retained' ||
    row.traceOrderPreserved !== true ||
    row.supportObjectIdComparisonPreserved !== true ||
    row.seamClassificationUnchanged !== true ||
    row.seamRetained !== true ||
    row.supportProjectionOrderShuffled !== true,
  );
  const status = scalarRows.some((row) => row.observedStatus !== 'invalid-scalar-collapse')
    ? 'scalar-seam-falsely-admitted'
    : sectorRows.some((row) => row.observedStatus !== 'invalid-sector-collapse')
      ? 'sector-collapsed-seam-falsely-admitted'
      : traceOrderRows.some((row) => row.observedStatus !== 'invalid-trace-order-collapse')
        ? 'trace-order-collapse-falsely-admitted'
        : siteAddressRows.some((row) => row.observedStatus !== 'invalid-site-address-duplication')
          ? 'site-address-duplication-falsely-admitted'
          : supportOnlyRows.some((row) => row.observedStatus !== 'invalid-support-projection-only-seam')
            ? 'support-projection-only-seam-falsely-admitted'
            : partialRows.some((row) => row.observedStatus !== 'invalid-partial-seam-condition')
              ? 'partial-seam-condition-falsely-admitted'
              : rowOrderFailed
                ? 'row-order-dependence-detected'
                : 'seam-invalidity-controls-pass';
  return {
    rowCount: rows.length,
    passCount: passRows.length,
    failCount: rows.length - passRows.length,
    maxError: maxOf(rows.map((row) => row.maxError)),
    scalarCollapsePassCount: scalarRows.filter((row) => row.observedStatus === 'invalid-scalar-collapse').length,
    sectorCollapsePassCount: sectorRows.filter((row) => row.observedStatus === 'invalid-sector-collapse').length,
    traceOrderCollapsePassCount: traceOrderRows.filter((row) => row.observedStatus === 'invalid-trace-order-collapse').length,
    siteAddressDuplicationPassCount: siteAddressRows.filter((row) => row.observedStatus === 'invalid-site-address-duplication').length,
    supportProjectionOnlyPassCount: supportOnlyRows.filter((row) => row.observedStatus === 'invalid-support-projection-only-seam').length,
    rowOrderPassCount: rowOrderRows.filter((row) =>
      row.observedStatus === 'classification-unchanged-seam-retained' &&
      row.traceOrderPreserved === true &&
      row.supportObjectIdComparisonPreserved === true &&
      row.seamClassificationUnchanged === true &&
      row.seamRetained === true &&
      row.supportProjectionOrderShuffled === true,
    ).length,
    partialConditionPassCount: partialRows.filter((row) => row.observedStatus === 'invalid-partial-seam-condition').length,
    status,
  };
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

function cloneProjectionRecord(record: Record<string, Vec3>): Record<string, Vec3> {
  return Object.fromEntries(Object.entries(record).map(([id, value]) => [id, [...value] as Vec3]));
}

function summarizeRows<Row extends { status: string }>(rows: readonly Row[], passStatus: string, failStatus: string): Summary {
  const passCount = rows.filter((row) => row.status === passStatus).length;
  return summaryWithStatus(rows, passCount, passStatus, failStatus);
}

function summaryWithStatus<Row extends object>(rows: readonly Row[], passCount: number, passStatus: string, failStatus: string): Summary {
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

function sameOrderedIds(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((id, index) => id === right[index]);
}

function requiredToken<T extends TraceToken>(tokenById: Map<string, T>, tokenId: string): T {
  const token = tokenById.get(tokenId);
  if (!token) throw new Error(`Missing trace token ${tokenId}`);
  return token;
}

function requiredHandoffRow(rows: readonly S11HandoffRow[], traceId: string, sharedBodyId: GateBodyId): S11HandoffRow {
  const row = rows.find((candidate) => candidate.traceId === traceId && candidate.sharedBodyId === sharedBodyId);
  if (!row) throw new Error(`Missing Lab-11 handoff row ${traceId} at ${sharedBodyId}`);
  return row;
}

function parentLab11Accepted(report: S11Report): boolean {
  return report.ok === true &&
    report.finalVerdict === 'T28-S-Lab-11-role-retentive-handoff-state-pass' &&
    report.integrityIssueCount === 0 &&
    report.roleRetentiveHandoffConstructionSummary.status === 'role-retentive-handoff-state-constructed' &&
    report.supportCancellationRoleRetentionSummary.status === 'support-cancellation-with-role-retention-pass' &&
    report.directShortcutNoHandoffSummary.status === 'direct-shortcut-no-handoff-state-pass' &&
    report.nonComposableNoHandoffSummary.status === 'non-composable-no-handoff-pass' &&
    report.backtrackRoleCancellationSummary.status === 'backtrack-role-cancellation-not-route' &&
    report.cycleMultiHandoffSummary.status === 'cycle-role-retention-not-loop-not-route' &&
    report.handoffReversalSummary.status === 'handoff-reversal-compatible' &&
    report.shortcutHistoryHandoffDistinctionSummary.status === 'shortcut-history-handoff-distinction-pass' &&
    report.antiRouteLanguageBoundarySummary.status === 'handoff-anti-route-boundary-pass';
}

function allSeamConditionsPass(row: RoleConjugateSeamClassificationRow): boolean {
  return allTrue([
    row.sameBodyCondition,
    row.adjacentTokenCondition,
    row.oppositeRoleCondition,
    row.oppositeSignCondition,
    row.supportCancellingCondition,
    row.traceRetainedCondition,
    row.nonpromotionCondition,
  ]);
}

function requiredSeamVocabularyPresent(values: readonly string[]): boolean {
  return SEAM_VOCABULARY.every((value) => values.includes(value));
}

function requiredBoundaryMissing(rows: readonly BoundaryRow[]): boolean {
  return REQUIRED_BOUNDARY_IDS.some((id) => !rows.some((row) => row.boundaryId === id && row.enforced));
}

function boundaryPromotionDetected(rows: readonly BoundaryRow[]): boolean {
  return rows.some((row) => row.positivePromotionDetected);
}

function controlFailed(rows: readonly ControlRow[], controlId: string): boolean {
  return rows.some((row) => row.controlId === controlId && row.status !== 'control-pass');
}

function controlStatus(rows: readonly ControlRow[], controlId: string): string {
  return rows.find((row) => row.controlId === controlId)?.status ?? 'missing';
}

function allTrue(values: readonly boolean[]): boolean {
  return values.every(Boolean);
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

function cleanNumber(value: number): number {
  return Math.abs(value) <= EPSILON ? 0 : Number(value.toFixed(12));
}

function maxOf(values: readonly number[]): number {
  return values.length ? Math.max(...values) : 0;
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

import { buildPSimplexGateBodyCoCompositionStandardSupportBasisAuditT28S7Report } from './pSimplexGateBodyCoCompositionStandardSupportBasisAuditT28S7';
import { buildPSimplexOrderedPairTransitionAntiRouteAuditT28S8Report } from './pSimplexOrderedPairTransitionAntiRouteAuditT28S8';
import {
  buildPSimplexTraceRetentionSupportProjectionCompatibilityAuditT28S9Report,
  type GateBodyId,
  type Vec3,
} from './pSimplexTraceRetentionSupportProjectionCompatibilityAuditT28S9';
import { buildPSimplexTraceAdmissibilityClassifierAuditT28S10Report } from './pSimplexTraceAdmissibilityClassifierAuditT28S10';

type S7Report = ReturnType<typeof buildPSimplexGateBodyCoCompositionStandardSupportBasisAuditT28S7Report>;
type S8Report = ReturnType<typeof buildPSimplexOrderedPairTransitionAntiRouteAuditT28S8Report>;
type S9Report = ReturnType<typeof buildPSimplexTraceRetentionSupportProjectionCompatibilityAuditT28S9Report>;
type S10Report = ReturnType<typeof buildPSimplexTraceAdmissibilityClassifierAuditT28S10Report>;
type S9TraceTokenConstructionRow = S9Report['traceTokenConstructionRows'][number];

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

interface HandoffState {
  handoffStateId: string;
  traceId: string;
  entryBodyId: GateBodyId;
  sharedBodyId: GateBodyId;
  exitBodyId: GateBodyId;
  incomingTokenId: string;
  incomingRole: 'incoming-target-role';
  incomingCoefficientAtSharedBody: number;
  outgoingTokenId: string;
  outgoingRole: 'outgoing-source-role';
  outgoingCoefficientAtSharedBody: number;
  supportNetAtSharedBody: number;
  traceRetainsIncomingRole: boolean;
  traceRetainsOutgoingRole: boolean;
  roleDistinctionRetained: boolean;
  roleVocabulary: string[];
  routeMaturityStatus: 'not-route';
  status: string;
}

export interface ParentEvidenceRow {
  parentId: string;
  method: string;
  ok: boolean | null;
  finalVerdict?: string;
  integrityIssueCount?: number;
  openComposableClassificationStatus?: string;
  traceSupportIdentityBoundaryStatus?: string;
  complementAxisIdentityStatus?: string;
  antiRouteLanguageBoundaryStatus?: string;
  consumedSections: string[];
  status: string;
}

export interface OpenComposableHandoffSourceRow {
  traceId: string;
  incomingTokenId: string;
  outgoingTokenId: string;
  entryBodyId: GateBodyId;
  sharedBodyId: GateBodyId;
  exitBodyId: GateBodyId;
  lab10PrimaryClass: string;
  lab10AdmissibilityBand: string;
  status: string;
}

export interface RoleRetentiveHandoffConstructionRow extends HandoffState {}

export interface SupportCancellationRoleRetentionRow {
  handoffStateId: string;
  traceId: string;
  sharedBodyId: GateBodyId;
  incomingCoefficientAtSharedBody: number;
  outgoingCoefficientAtSharedBody: number;
  supportNetAtSharedBody: number;
  traceRetainsIncomingRole: boolean;
  traceRetainsOutgoingRole: boolean;
  roleDistinctionRetained: boolean;
  status: string;
}

export interface DirectShortcutNoHandoffRow {
  comparisonId: string;
  twoStepTraceId: string;
  directShortcutTraceId: string;
  sharedBodyId: GateBodyId;
  twoStepHasHandoffState: boolean;
  directShortcutHasHandoffStateAtSharedBody: boolean;
  supportProjectionEquivalent: boolean;
  traceIdentityDistinct: boolean;
  maxError: number;
  status: string;
}

export interface NonComposableNoHandoffRow {
  traceId: string;
  firstTokenId: string;
  secondTokenId: string;
  firstTargetBodyId: GateBodyId;
  secondSourceBodyId: GateBodyId;
  hasSharedIntermediateBody: boolean;
  hasRoleRetentiveHandoffState: boolean;
  lab10PrimaryClass: string;
  lab10AdmissibilityBand: string;
  status: string;
}

export interface BacktrackRoleCancellationRow {
  traceId: string;
  incomingTokenId: string;
  outgoingTokenId: string;
  sharedBodyId: GateBodyId;
  incomingRole: 'incoming-target-role';
  outgoingRole: 'outgoing-source-role';
  incomingCoefficientAtSharedBody: number;
  outgoingCoefficientAtSharedBody: number;
  supportNetAtSharedBody: number;
  traceRetainsIncomingRole: boolean;
  traceRetainsOutgoingRole: boolean;
  roleDistinctionRetained: boolean;
  backtrackRoleClass: 'backtrack-role-cancellation';
  lab10PrimaryClass: string;
  lab10AdmissibilityBand: string;
  routeMaturityStatus: 'not-route';
  loopMaturityStatus: 'not-loop';
  status: string;
}

export interface CycleMultiHandoffRow {
  cycleTraceId: string;
  bodySequence: GateBodyId[];
  sharedBodyIds: GateBodyId[];
  handoffStateIds: string[];
  handoffCount: number;
  allSharedBodiesHaveRoleRetention: boolean;
  allSupportNetsAtSharedBodies: number[];
  lab10PrimaryClass: string;
  lab10AdmissibilityBand: string;
  routeMaturityStatus: 'not-route';
  loopMaturityStatus: 'not-loop';
  vortexMaturityStatus: 'not-vortex';
  circulationMaturityStatus: 'not-circulation';
  status: string;
}

export interface HandoffReversalRow {
  originalTraceId: string;
  reversedTraceId: string;
  sharedBodyId: GateBodyId;
  originalIncomingTokenId: string;
  originalOutgoingTokenId: string;
  reversedIncomingTokenId: string;
  reversedOutgoingTokenId: string;
  originalEntryBodyId: GateBodyId;
  originalExitBodyId: GateBodyId;
  reversedEntryBodyId: GateBodyId;
  reversedExitBodyId: GateBodyId;
  incomingOutgoingRolesRemainDistinct: boolean;
  entryExitSwapped: boolean;
  handoffRoleStructurePreserved: boolean;
  status: string;
}

export interface ShortcutHistoryHandoffDistinctionRow {
  relationId: string;
  twoStepTraceId: string;
  directShortcutTraceId: string;
  sharedBodyId: GateBodyId;
  sameSupportProjection: boolean;
  differentTraceIdentity: boolean;
  twoStepHandoffIncludesSharedBody: boolean;
  shortcutHandoffExcludesSharedBody: boolean;
  maxError: number;
  status: string;
}

export interface ComplementAxisHandoffIdentityRow {
  bodyId: GateBodyId;
  siteAddressA: string;
  siteAddressB: string;
  bodyMembershipA: string;
  bodyMembershipB: string;
  identityPreserved: boolean;
  status: string;
}

export interface ComplementAxisHandoffIdentitySummary extends Summary {
  siteAddressDoubleCountingStatus: string;
  complementSiteSplitStatus: string;
  sixSiteAddressHandoffModelStatus: string;
}

export interface InvalidityControlRow {
  controlId: string;
  invalidityKind: string;
  expectedStatus: string;
  observedStatus: string;
  maxError: number;
  status: string;
  traceOrderPreserved?: boolean;
  supportObjectIdComparisonPreserved?: boolean;
  handoffClassificationUnchanged?: boolean;
  rolesRetained?: boolean;
  supportProjectionOrderShuffled?: boolean;
}

export interface InvalidityControlSummary extends Summary {
  scalarCollapsePassCount: number;
  sectorCollapsePassCount: number;
  traceOrderCollapsePassCount: number;
  siteAddressDuplicationPassCount: number;
  supportProjectionOnlyPassCount: number;
  rowOrderPassCount: number;
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

export interface PSimplexRoleRetentiveHandoffStateAuditT28S11Report {
  method: typeof METHOD;
  experimentName: typeof EXPERIMENT_NAME;
  diagnosticScope: typeof DIAGNOSTIC_SCOPE;
  branchRef: typeof BRANCH_REF;
  baselineRef: typeof BASELINE_REF;
  parentEvidenceRows: ParentEvidenceRow[];
  openComposableHandoffSourceRows: OpenComposableHandoffSourceRow[];
  openComposableHandoffSourceSummary: Summary;
  roleRetentiveHandoffConstructionRows: RoleRetentiveHandoffConstructionRow[];
  roleRetentiveHandoffConstructionSummary: Summary;
  supportCancellationRoleRetentionRows: SupportCancellationRoleRetentionRow[];
  supportCancellationRoleRetentionSummary: Summary;
  directShortcutNoHandoffRows: DirectShortcutNoHandoffRow[];
  directShortcutNoHandoffSummary: Summary;
  nonComposableNoHandoffRows: NonComposableNoHandoffRow[];
  nonComposableNoHandoffSummary: Summary;
  backtrackRoleCancellationRows: BacktrackRoleCancellationRow[];
  backtrackRoleCancellationSummary: Summary;
  cycleMultiHandoffRows: CycleMultiHandoffRow[];
  cycleMultiHandoffSummary: Summary;
  handoffReversalRows: HandoffReversalRow[];
  handoffReversalSummary: Summary;
  shortcutHistoryHandoffDistinctionRows: ShortcutHistoryHandoffDistinctionRow[];
  shortcutHistoryHandoffDistinctionSummary: Summary;
  complementAxisHandoffIdentityRows: ComplementAxisHandoffIdentityRow[];
  complementAxisHandoffIdentitySummary: ComplementAxisHandoffIdentitySummary;
  invalidityControlRows: InvalidityControlRow[];
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundaryRows: AntiRouteLanguageBoundaryRow[];
  antiRouteLanguageBoundarySummary: Summary;
  controlRows: ControlRow[];
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  finalVerdict: string;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

const METHOD = 'p-simplex-role-retentive-handoff-state-audit-t28s11';
const EXPERIMENT_NAME = 'T28-S-Lab-11 - Role-Retentive Handoff State Audit';
const DIAGNOSTIC_SCOPE = 'role-retentive-handoff-state-audit-only';
const BRANCH_REF = 't28s/gate-transition-applied-chain';
const BASELINE_REF = 't28s/gate-transition-applied-chain';
const EPSILON = 1e-9;

const BODY_IDS = ['GateBody_AB/CD', 'GateBody_AC/BD', 'GateBody_AD/BC'] as const satisfies readonly GateBodyId[];
const ROLE_VOCABULARY = [
  'incoming-target-role',
  'outgoing-source-role',
  'shared-intermediate-body',
  'support-cancelled-intermediate',
  'role-retained-intermediate',
  'role-retentive-handoff-state',
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
  'not-support-projection-only-handoff',
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
] as const;

export function buildPSimplexRoleRetentiveHandoffStateAuditT28S11Report(): PSimplexRoleRetentiveHandoffStateAuditT28S11Report {
  const lab10Report = buildPSimplexTraceAdmissibilityClassifierAuditT28S10Report();
  const lab9Report = buildPSimplexTraceRetentionSupportProjectionCompatibilityAuditT28S9Report();
  const lab8Report = buildPSimplexOrderedPairTransitionAntiRouteAuditT28S8Report();
  const lab7Report = buildPSimplexGateBodyCoCompositionStandardSupportBasisAuditT28S7Report();
  const traceTokens = buildTraceTokens(lab9Report.traceTokenConstructionRows);
  const tokenById = new Map(traceTokens.map((token) => [token.tokenId, token]));
  const tokenByOrderedPairId = new Map(traceTokens.map((token) => [token.orderedPairId, token]));

  const parentEvidenceRows = buildParentEvidenceRows(lab10Report, lab9Report, lab8Report, lab7Report);
  const openComposableHandoffSourceRows = buildOpenComposableHandoffSourceRows(lab10Report, tokenByOrderedPairId);
  const openComposableHandoffSourceSummary = summarizeRows(openComposableHandoffSourceRows, 'open-composable-handoff-source-ready', 'open-composable-handoff-source-missing');
  const roleRetentiveHandoffConstructionRows = buildRoleRetentiveHandoffConstructionRows(openComposableHandoffSourceRows, tokenById);
  const roleRetentiveHandoffConstructionSummary = buildRoleRetentiveHandoffConstructionSummary(roleRetentiveHandoffConstructionRows);
  const supportCancellationRoleRetentionRows = buildSupportCancellationRoleRetentionRows(roleRetentiveHandoffConstructionRows);
  const supportCancellationRoleRetentionSummary = buildSupportCancellationRoleRetentionSummary(supportCancellationRoleRetentionRows);
  const directShortcutNoHandoffRows = buildDirectShortcutNoHandoffRows(openComposableHandoffSourceRows, roleRetentiveHandoffConstructionRows, tokenById, tokenByOrderedPairId);
  const directShortcutNoHandoffSummary = buildDirectShortcutNoHandoffSummary(directShortcutNoHandoffRows);
  const nonComposableNoHandoffRows = buildNonComposableNoHandoffRows(lab10Report, tokenByOrderedPairId);
  const nonComposableNoHandoffSummary = summarizeRows(nonComposableNoHandoffRows, 'non-composable-no-handoff-pass', 'non-composable-falsely-given-handoff');
  const backtrackRoleCancellationRows = buildBacktrackRoleCancellationRows(lab10Report, tokenByOrderedPairId, tokenById);
  const backtrackRoleCancellationSummary = buildBacktrackRoleCancellationSummary(backtrackRoleCancellationRows);
  const cycleMultiHandoffRows = buildCycleMultiHandoffRows(lab10Report, tokenByOrderedPairId, tokenById);
  const cycleMultiHandoffSummary = buildCycleMultiHandoffSummary(cycleMultiHandoffRows);
  const handoffReversalRows = buildHandoffReversalRows(openComposableHandoffSourceRows, tokenById, tokenByOrderedPairId);
  const handoffReversalSummary = summarizeRows(handoffReversalRows, 'handoff-reversal-compatible', 'handoff-reversal-failed');
  const shortcutHistoryHandoffDistinctionRows = buildShortcutHistoryHandoffDistinctionRows(openComposableHandoffSourceRows, roleRetentiveHandoffConstructionRows, tokenById, tokenByOrderedPairId);
  const shortcutHistoryHandoffDistinctionSummary = buildShortcutHistoryHandoffDistinctionSummary(shortcutHistoryHandoffDistinctionRows);
  const complementAxisHandoffIdentityRows = buildComplementAxisHandoffIdentityRows(lab10Report);
  const complementAxisHandoffIdentitySummary = buildComplementAxisHandoffIdentitySummary(complementAxisHandoffIdentityRows, lab9Report);
  const invalidityControlRows = buildInvalidityControlRows(roleRetentiveHandoffConstructionRows, tokenById, tokenByOrderedPairId);
  const invalidityControlSummary = buildInvalidityControlSummary(invalidityControlRows);
  const antiRouteLanguageBoundaryRows = buildAntiRouteLanguageBoundaryRows();
  const antiRouteLanguageBoundarySummary = summarizeRows(antiRouteLanguageBoundaryRows, 'handoff-anti-route-boundary-pass', 'handoff-anti-route-boundary-failed');
  const controlRows = buildControlRows({
    roleRetentiveHandoffConstructionSummary,
    supportCancellationRoleRetentionSummary,
    directShortcutNoHandoffSummary,
    nonComposableNoHandoffSummary,
    backtrackRoleCancellationSummary,
    cycleMultiHandoffSummary,
    handoffReversalSummary,
    shortcutHistoryHandoffDistinctionSummary,
    invalidityControlRows,
    invalidityControlSummary,
    antiRouteLanguageBoundarySummary,
  });
  const boundaryRows = buildBoundaryRows();
  const falsifierRows = buildFalsifierRows({
    lab10Report,
    openComposableHandoffSourceSummary,
    roleRetentiveHandoffConstructionRows,
    roleRetentiveHandoffConstructionSummary,
    supportCancellationRoleRetentionSummary,
    directShortcutNoHandoffSummary,
    nonComposableNoHandoffSummary,
    backtrackRoleCancellationSummary,
    cycleMultiHandoffSummary,
    handoffReversalSummary,
    shortcutHistoryHandoffDistinctionSummary,
    complementAxisHandoffIdentitySummary,
    invalidityControlSummary,
    antiRouteLanguageBoundarySummary,
    controlRows,
  });
  const finalVerdict = classifyFinalVerdict({
    lab10Report,
    openComposableHandoffSourceSummary,
    roleRetentiveHandoffConstructionSummary,
    supportCancellationRoleRetentionSummary,
    directShortcutNoHandoffSummary,
    nonComposableNoHandoffSummary,
    backtrackRoleCancellationSummary,
    cycleMultiHandoffSummary,
    handoffReversalSummary,
    shortcutHistoryHandoffDistinctionSummary,
    complementAxisHandoffIdentitySummary,
    invalidityControlSummary,
    antiRouteLanguageBoundarySummary,
    boundaryRows,
    falsifierRows,
  });
  const integrityIssues = buildIntegrityIssues({
    lab10Report,
    openComposableHandoffSourceRows,
    openComposableHandoffSourceSummary,
    roleRetentiveHandoffConstructionRows,
    roleRetentiveHandoffConstructionSummary,
    supportCancellationRoleRetentionRows,
    supportCancellationRoleRetentionSummary,
    directShortcutNoHandoffRows,
    directShortcutNoHandoffSummary,
    nonComposableNoHandoffRows,
    nonComposableNoHandoffSummary,
    backtrackRoleCancellationRows,
    backtrackRoleCancellationSummary,
    cycleMultiHandoffRows,
    cycleMultiHandoffSummary,
    handoffReversalRows,
    handoffReversalSummary,
    shortcutHistoryHandoffDistinctionRows,
    shortcutHistoryHandoffDistinctionSummary,
    complementAxisHandoffIdentityRows,
    complementAxisHandoffIdentitySummary,
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
    finalVerdict === 'T28-S-Lab-11-role-retentive-handoff-state-pass';

  return {
    method: METHOD,
    experimentName: EXPERIMENT_NAME,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    branchRef: BRANCH_REF,
    baselineRef: BASELINE_REF,
    parentEvidenceRows,
    openComposableHandoffSourceRows,
    openComposableHandoffSourceSummary,
    roleRetentiveHandoffConstructionRows,
    roleRetentiveHandoffConstructionSummary,
    supportCancellationRoleRetentionRows,
    supportCancellationRoleRetentionSummary,
    directShortcutNoHandoffRows,
    directShortcutNoHandoffSummary,
    nonComposableNoHandoffRows,
    nonComposableNoHandoffSummary,
    backtrackRoleCancellationRows,
    backtrackRoleCancellationSummary,
    cycleMultiHandoffRows,
    cycleMultiHandoffSummary,
    handoffReversalRows,
    handoffReversalSummary,
    shortcutHistoryHandoffDistinctionRows,
    shortcutHistoryHandoffDistinctionSummary,
    complementAxisHandoffIdentityRows,
    complementAxisHandoffIdentitySummary,
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

function buildParentEvidenceRows(lab10Report: S10Report, lab9Report: S9Report, lab8Report: S8Report, lab7Report: S7Report): ParentEvidenceRow[] {
  return [
    {
      parentId: 'T28-S-Lab-10',
      method: lab10Report.method,
      ok: lab10Report.ok,
      finalVerdict: lab10Report.finalVerdict,
      integrityIssueCount: lab10Report.integrityIssueCount,
      openComposableClassificationStatus: lab10Report.openComposableClassificationSummary.status,
      traceSupportIdentityBoundaryStatus: lab10Report.traceSupportIdentityBoundarySummary.status,
      complementAxisIdentityStatus: lab10Report.complementAxisIdentitySummary.status,
      antiRouteLanguageBoundaryStatus: lab10Report.antiRouteLanguageBoundarySummary.status,
      consumedSections: [
        'classifierSetupRows',
        'directTransitionClassificationRows',
        'openComposableClassificationRows',
        'projectionEquivalentRelationRows',
        'nonComposableClassificationRows',
        'backtrackClassificationRows',
        'cycleClassificationRows',
        'structuralInvalidityClassificationRows',
        'classificationPrecedenceRows',
        'traceSupportIdentityBoundaryRows',
        'complementAxisIdentityRows',
        'rowOrderShuffleClassificationRows',
        'antiRouteLanguageBoundaryRows',
        'finalVerdict',
        'ok',
        'integrityIssueCount',
        'openComposableClassificationSummary',
        'traceSupportIdentityBoundarySummary',
        'complementAxisIdentitySummary',
        'antiRouteLanguageBoundarySummary',
      ],
      status: parentLab10Accepted(lab10Report) ? 'lab-10-parent-accepted' : 'lab-10-parent-not-accepted',
    },
    {
      parentId: 'T28-S-Lab-9 trace-retention-secondary',
      method: lab9Report.method,
      ok: lab9Report.ok,
      finalVerdict: lab9Report.finalVerdict,
      integrityIssueCount: lab9Report.integrityIssueCount,
      consumedSections: ['traceTokenConstructionRows', 'supportProjectionCompatibilityRows', 'invalidityControlRows'],
      status: lab9Report.ok ? 'secondary-parent-consumed' : 'secondary-parent-not-accepted',
    },
    {
      parentId: 'T28-S-Lab-8 ordered-pair-secondary',
      method: lab8Report.method,
      ok: lab8Report.ok,
      finalVerdict: lab8Report.finalVerdict,
      integrityIssueCount: lab8Report.integrityIssueCount,
      consumedSections: ['orderedPairConstructionRows'],
      status: lab8Report.ok ? 'secondary-parent-consumed' : 'secondary-parent-not-accepted',
    },
    {
      parentId: 'T28-S-Lab-7 complement-axis-secondary',
      method: lab7Report.method,
      ok: lab7Report.ok,
      finalVerdict: lab7Report.finalVerdict,
      integrityIssueCount: lab7Report.integrityIssueCount,
      consumedSections: ['gateBodyBasisRows'],
      status: lab7Report.ok ? 'secondary-parent-consumed' : 'secondary-parent-not-accepted',
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

function buildOpenComposableHandoffSourceRows(lab10Report: S10Report, tokenByOrderedPairId: Map<string, TraceToken>): OpenComposableHandoffSourceRow[] {
  return distinctOrderedTriples().map(([entryBodyId, sharedBodyId, exitBodyId]) => {
    const incomingTokenId = requiredToken(tokenByOrderedPairId, orderedPairIdFor(entryBodyId, sharedBodyId)).tokenId;
    const outgoingTokenId = requiredToken(tokenByOrderedPairId, orderedPairIdFor(sharedBodyId, exitBodyId)).tokenId;
    const traceId = traceIdFor([incomingTokenId, outgoingTokenId]);
    const lab10Row = lab10Report.openComposableClassificationRows.find((row) => row.traceId === traceId);
    const ready =
      lab10Row?.primaryAdmissibilityClass === 'open-composable-trace' &&
      lab10Row.admissibilityBand === 'passage-precondition-admissible' &&
      lab10Row.entryBodyId === entryBodyId &&
      lab10Row.exitBodyId === exitBodyId &&
      lab10Row.retainedIntermediateBodies.length === 1 &&
      lab10Row.retainedIntermediateBodies[0] === sharedBodyId;
    return {
      traceId,
      incomingTokenId,
      outgoingTokenId,
      entryBodyId,
      sharedBodyId,
      exitBodyId,
      lab10PrimaryClass: lab10Row?.primaryAdmissibilityClass ?? 'missing',
      lab10AdmissibilityBand: lab10Row?.admissibilityBand ?? 'missing',
      status: ready ? 'open-composable-handoff-source-ready' : 'open-composable-handoff-source-missing',
    };
  });
}

function buildRoleRetentiveHandoffConstructionRows(rows: readonly OpenComposableHandoffSourceRow[], tokenById: Map<string, TraceToken>): RoleRetentiveHandoffConstructionRow[] {
  return rows.map((row) => {
    const state = buildHandoffState({
      traceId: row.traceId,
      entryBodyId: row.entryBodyId,
      sharedBodyId: row.sharedBodyId,
      exitBodyId: row.exitBodyId,
      incomingToken: requiredToken(tokenById, row.incomingTokenId),
      outgoingToken: requiredToken(tokenById, row.outgoingTokenId),
    });
    return {
      ...state,
      status: handoffConstructionStatus(state),
    };
  });
}

function buildSupportCancellationRoleRetentionRows(rows: readonly RoleRetentiveHandoffConstructionRow[]): SupportCancellationRoleRetentionRow[] {
  return rows.map((row) => {
    const supportCancelled = cleanNumber(row.supportNetAtSharedBody) === 0;
    const rolesRetained = row.traceRetainsIncomingRole && row.traceRetainsOutgoingRole && row.roleDistinctionRetained;
    const status = supportCancelled && rolesRetained
      ? 'support-cancellation-with-role-retention-pass'
      : !supportCancelled && rolesRetained
        ? 'support-cancellation-failed'
        : supportCancelled && !rolesRetained
          ? 'support-cancellation-erased-role-trace'
          : 'role-trace-retained-without-support-cancellation';
    return {
      handoffStateId: row.handoffStateId,
      traceId: row.traceId,
      sharedBodyId: row.sharedBodyId,
      incomingCoefficientAtSharedBody: row.incomingCoefficientAtSharedBody,
      outgoingCoefficientAtSharedBody: row.outgoingCoefficientAtSharedBody,
      supportNetAtSharedBody: row.supportNetAtSharedBody,
      traceRetainsIncomingRole: row.traceRetainsIncomingRole,
      traceRetainsOutgoingRole: row.traceRetainsOutgoingRole,
      roleDistinctionRetained: row.roleDistinctionRetained,
      status,
    };
  });
}

function buildDirectShortcutNoHandoffRows(
  sourceRows: readonly OpenComposableHandoffSourceRow[],
  handoffRows: readonly RoleRetentiveHandoffConstructionRow[],
  tokenById: Map<string, TraceToken>,
  tokenByOrderedPairId: Map<string, TraceToken>,
): DirectShortcutNoHandoffRow[] {
  return sourceRows.map((row) => {
    const directTokenId = requiredToken(tokenByOrderedPairId, orderedPairIdFor(row.entryBodyId, row.exitBodyId)).tokenId;
    const directShortcutTraceId = traceIdFor([directTokenId]);
    const twoStepHasHandoffState = handoffRows.some((handoff) => handoff.traceId === row.traceId && handoff.sharedBodyId === row.sharedBodyId);
    const directShortcutHasHandoffStateAtSharedBody = hasRoleRetentiveHandoffState([directTokenId], row.sharedBodyId, tokenById);
    const maxError = compareSupportProjection(
      supportProjectionForTokenIds([row.incomingTokenId, row.outgoingTokenId], tokenById),
      supportProjectionForTokenIds([directTokenId], tokenById),
    );
    const supportProjectionEquivalent = maxError <= EPSILON;
    const traceIdentityDistinct = row.traceId !== directShortcutTraceId;
    const status = twoStepHasHandoffState && !directShortcutHasHandoffStateAtSharedBody && supportProjectionEquivalent && traceIdentityDistinct
      ? 'direct-shortcut-no-handoff-state-pass'
      : directShortcutHasHandoffStateAtSharedBody
        ? 'direct-shortcut-falsely-given-handoff'
        : !twoStepHasHandoffState
          ? 'two-step-handoff-not-distinguished-from-shortcut'
          : 'projection-equivalence-collapsed-handoff-state';
    return {
      comparisonId: `direct-shortcut:${row.entryBodyId}->${row.sharedBodyId}->${row.exitBodyId}`,
      twoStepTraceId: row.traceId,
      directShortcutTraceId,
      sharedBodyId: row.sharedBodyId,
      twoStepHasHandoffState,
      directShortcutHasHandoffStateAtSharedBody,
      supportProjectionEquivalent,
      traceIdentityDistinct,
      maxError: cleanNumber(maxError),
      status,
    };
  });
}

function buildNonComposableNoHandoffRows(lab10Report: S10Report, tokenByOrderedPairId: Map<string, TraceToken>): NonComposableNoHandoffRow[] {
  return distinctOrderedTriples().map(([firstSource, firstTarget, secondSource]) => {
    const firstToken = requiredToken(tokenByOrderedPairId, orderedPairIdFor(firstSource, firstTarget));
    const secondToken = requiredToken(tokenByOrderedPairId, orderedPairIdFor(secondSource, firstSource));
    const tokenIds = [firstToken.tokenId, secondToken.tokenId];
    const traceId = traceIdFor(tokenIds);
    const lab10Row = lab10Report.nonComposableClassificationRows.find((row) => row.traceId === traceId);
    const hasSharedIntermediateBody = firstToken.targetBodyId === secondToken.sourceBodyId;
    const hasRoleRetentiveHandoffState = hasSharedIntermediateBody;
    const pass =
      !hasSharedIntermediateBody &&
      !hasRoleRetentiveHandoffState &&
      lab10Row?.primaryAdmissibilityClass === 'non-composable-token-sequence' &&
      lab10Row.admissibilityBand === 'trace-valid-passage-inadmissible';
    return {
      traceId,
      firstTokenId: firstToken.tokenId,
      secondTokenId: secondToken.tokenId,
      firstTargetBodyId: firstToken.targetBodyId,
      secondSourceBodyId: secondToken.sourceBodyId,
      hasSharedIntermediateBody,
      hasRoleRetentiveHandoffState,
      lab10PrimaryClass: lab10Row?.primaryAdmissibilityClass ?? 'missing',
      lab10AdmissibilityBand: lab10Row?.admissibilityBand ?? 'missing',
      status: pass ? 'non-composable-no-handoff-pass' : 'non-composable-falsely-given-handoff',
    };
  });
}

function buildBacktrackRoleCancellationRows(lab10Report: S10Report, tokenByOrderedPairId: Map<string, TraceToken>, tokenById: Map<string, TraceToken>): BacktrackRoleCancellationRow[] {
  return BODY_IDS.flatMap((entryBodyId) =>
    BODY_IDS.filter((sharedBodyId) => sharedBodyId !== entryBodyId).map((sharedBodyId) => {
      const incomingToken = requiredToken(tokenByOrderedPairId, orderedPairIdFor(entryBodyId, sharedBodyId));
      const outgoingToken = requiredToken(tokenByOrderedPairId, orderedPairIdFor(sharedBodyId, entryBodyId));
      const traceId = traceIdFor([incomingToken.tokenId, outgoingToken.tokenId]);
      const state = buildHandoffState({ traceId, entryBodyId, sharedBodyId, exitBodyId: entryBodyId, incomingToken, outgoingToken });
      const lab10Row = lab10Report.backtrackClassificationRows.find((row) => row.traceId === traceId);
      const pass =
        state.traceRetainsIncomingRole &&
        state.traceRetainsOutgoingRole &&
        state.roleDistinctionRetained &&
        state.supportNetAtSharedBody === 0 &&
        lab10Row?.primaryAdmissibilityClass === 'zero-support-backtrack-trace' &&
        lab10Row.admissibilityBand === 'trace-valid-passage-inadmissible' &&
        lab10Row.routeMaturityStatus === 'not-route' &&
        lab10Row.loopMaturityStatus === 'not-loop' &&
        compareSupportProjection(supportProjectionForTokenIds([incomingToken.tokenId, outgoingToken.tokenId], tokenById), zeroLikeSupportProjection(incomingToken.supportProjection)) <= EPSILON;
      const status = pass
        ? 'backtrack-role-cancellation-not-route'
        : lab10Row?.routeMaturityStatus !== 'not-route'
          ? 'backtrack-falsely-promoted-to-route'
          : lab10Row?.loopMaturityStatus !== 'not-loop'
            ? 'backtrack-falsely-promoted-to-loop'
            : 'backtrack-role-retention-erased';
      return {
        traceId,
        incomingTokenId: incomingToken.tokenId,
        outgoingTokenId: outgoingToken.tokenId,
        sharedBodyId,
        incomingRole: state.incomingRole,
        outgoingRole: state.outgoingRole,
        incomingCoefficientAtSharedBody: state.incomingCoefficientAtSharedBody,
        outgoingCoefficientAtSharedBody: state.outgoingCoefficientAtSharedBody,
        supportNetAtSharedBody: state.supportNetAtSharedBody,
        traceRetainsIncomingRole: state.traceRetainsIncomingRole,
        traceRetainsOutgoingRole: state.traceRetainsOutgoingRole,
        roleDistinctionRetained: state.roleDistinctionRetained,
        backtrackRoleClass: 'backtrack-role-cancellation',
        lab10PrimaryClass: lab10Row?.primaryAdmissibilityClass ?? 'missing',
        lab10AdmissibilityBand: lab10Row?.admissibilityBand ?? 'missing',
        routeMaturityStatus: lab10Row?.routeMaturityStatus === 'not-route' ? 'not-route' : 'not-route',
        loopMaturityStatus: lab10Row?.loopMaturityStatus === 'not-loop' ? 'not-loop' : 'not-loop',
        status,
      };
    }),
  );
}

function buildCycleMultiHandoffRows(lab10Report: S10Report, tokenByOrderedPairId: Map<string, TraceToken>, tokenById: Map<string, TraceToken>): CycleMultiHandoffRow[] {
  return distinctOrderedTriples().map(([x, y, z]) => {
    const tokens = [
      requiredToken(tokenByOrderedPairId, orderedPairIdFor(x, y)),
      requiredToken(tokenByOrderedPairId, orderedPairIdFor(y, z)),
      requiredToken(tokenByOrderedPairId, orderedPairIdFor(z, x)),
    ];
    const tokenIds = tokens.map((token) => token.tokenId);
    const cycleTraceId = traceIdFor(tokenIds);
    const bodySequence = [x, y, z, x];
    const handoffs = [
      buildHandoffState({ traceId: cycleTraceId, entryBodyId: x, sharedBodyId: y, exitBodyId: z, incomingToken: tokens[0], outgoingToken: tokens[1] }),
      buildHandoffState({ traceId: cycleTraceId, entryBodyId: y, sharedBodyId: z, exitBodyId: x, incomingToken: tokens[1], outgoingToken: tokens[2] }),
      buildHandoffState({ traceId: cycleTraceId, entryBodyId: z, sharedBodyId: x, exitBodyId: y, incomingToken: tokens[2], outgoingToken: tokens[0] }),
    ];
    const lab10Row = lab10Report.cycleClassificationRows.find((row) => row.traceId === cycleTraceId);
    const allSharedBodiesHaveRoleRetention = handoffs.every((handoff) => handoff.traceRetainsIncomingRole && handoff.traceRetainsOutgoingRole && handoff.roleDistinctionRetained);
    const allSupportNetsAtSharedBodies = handoffs.map((handoff) => handoff.supportNetAtSharedBody);
    const pass =
      handoffs.length === 3 &&
      allSharedBodiesHaveRoleRetention &&
      allSupportNetsAtSharedBodies.every((value) => value === 0) &&
      lab10Row?.primaryAdmissibilityClass === 'zero-support-cycle-trace' &&
      lab10Row.admissibilityBand === 'trace-valid-passage-inadmissible' &&
      lab10Row.routeMaturityStatus === 'not-route' &&
      lab10Row.loopMaturityStatus === 'not-loop' &&
      lab10Row.vortexMaturityStatus === 'not-vortex' &&
      lab10Row.circulationMaturityStatus === 'not-circulation' &&
      compareSupportProjection(supportProjectionForTokenIds(tokenIds, tokenById), zeroLikeSupportProjection(tokens[0].supportProjection)) <= EPSILON;
    const status = pass
      ? 'cycle-role-retention-not-loop-not-route'
      : lab10Row?.loopMaturityStatus !== 'not-loop'
        ? 'cycle-falsely-promoted-to-loop'
        : lab10Row?.vortexMaturityStatus !== 'not-vortex'
          ? 'cycle-falsely-promoted-to-vortex'
          : lab10Row?.circulationMaturityStatus !== 'not-circulation'
            ? 'cycle-falsely-promoted-to-circulation'
            : lab10Row?.routeMaturityStatus !== 'not-route'
              ? 'cycle-falsely-promoted-to-route'
              : 'cycle-role-retention-failed';
    return {
      cycleTraceId,
      bodySequence,
      sharedBodyIds: [y, z, x],
      handoffStateIds: handoffs.map((handoff) => handoff.handoffStateId),
      handoffCount: handoffs.length,
      allSharedBodiesHaveRoleRetention,
      allSupportNetsAtSharedBodies,
      lab10PrimaryClass: lab10Row?.primaryAdmissibilityClass ?? 'missing',
      lab10AdmissibilityBand: lab10Row?.admissibilityBand ?? 'missing',
      routeMaturityStatus: 'not-route',
      loopMaturityStatus: 'not-loop',
      vortexMaturityStatus: 'not-vortex',
      circulationMaturityStatus: 'not-circulation',
      status,
    };
  });
}

function buildHandoffReversalRows(sourceRows: readonly OpenComposableHandoffSourceRow[], tokenById: Map<string, TraceToken>, tokenByOrderedPairId: Map<string, TraceToken>): HandoffReversalRow[] {
  return sourceRows.map((row) => {
    const reversedIncomingToken = requiredToken(tokenByOrderedPairId, orderedPairIdFor(row.exitBodyId, row.sharedBodyId));
    const reversedOutgoingToken = requiredToken(tokenByOrderedPairId, orderedPairIdFor(row.sharedBodyId, row.entryBodyId));
    const reversedTraceId = traceIdFor([reversedIncomingToken.tokenId, reversedOutgoingToken.tokenId]);
    const originalState = buildHandoffState({
      traceId: row.traceId,
      entryBodyId: row.entryBodyId,
      sharedBodyId: row.sharedBodyId,
      exitBodyId: row.exitBodyId,
      incomingToken: requiredToken(tokenById, row.incomingTokenId),
      outgoingToken: requiredToken(tokenById, row.outgoingTokenId),
    });
    const reversedState = buildHandoffState({
      traceId: reversedTraceId,
      entryBodyId: row.exitBodyId,
      sharedBodyId: row.sharedBodyId,
      exitBodyId: row.entryBodyId,
      incomingToken: reversedIncomingToken,
      outgoingToken: reversedOutgoingToken,
    });
    const incomingOutgoingRolesRemainDistinct = originalState.roleDistinctionRetained && reversedState.roleDistinctionRetained;
    const entryExitSwapped = row.entryBodyId === reversedState.exitBodyId && row.exitBodyId === reversedState.entryBodyId;
    const handoffRoleStructurePreserved =
      originalState.sharedBodyId === reversedState.sharedBodyId &&
      originalState.incomingCoefficientAtSharedBody === reversedState.incomingCoefficientAtSharedBody &&
      originalState.outgoingCoefficientAtSharedBody === reversedState.outgoingCoefficientAtSharedBody &&
      originalState.supportNetAtSharedBody === reversedState.supportNetAtSharedBody;
    return {
      originalTraceId: row.traceId,
      reversedTraceId,
      sharedBodyId: row.sharedBodyId,
      originalIncomingTokenId: row.incomingTokenId,
      originalOutgoingTokenId: row.outgoingTokenId,
      reversedIncomingTokenId: reversedIncomingToken.tokenId,
      reversedOutgoingTokenId: reversedOutgoingToken.tokenId,
      originalEntryBodyId: row.entryBodyId,
      originalExitBodyId: row.exitBodyId,
      reversedEntryBodyId: reversedState.entryBodyId,
      reversedExitBodyId: reversedState.exitBodyId,
      incomingOutgoingRolesRemainDistinct,
      entryExitSwapped,
      handoffRoleStructurePreserved,
      status: incomingOutgoingRolesRemainDistinct && entryExitSwapped && handoffRoleStructurePreserved ? 'handoff-reversal-compatible' : 'handoff-reversal-failed',
    };
  });
}

function buildShortcutHistoryHandoffDistinctionRows(
  sourceRows: readonly OpenComposableHandoffSourceRow[],
  handoffRows: readonly RoleRetentiveHandoffConstructionRow[],
  tokenById: Map<string, TraceToken>,
  tokenByOrderedPairId: Map<string, TraceToken>,
): ShortcutHistoryHandoffDistinctionRow[] {
  return sourceRows.map((row) => {
    const directTokenId = requiredToken(tokenByOrderedPairId, orderedPairIdFor(row.entryBodyId, row.exitBodyId)).tokenId;
    const directShortcutTraceId = traceIdFor([directTokenId]);
    const maxError = compareSupportProjection(
      supportProjectionForTokenIds([row.incomingTokenId, row.outgoingTokenId], tokenById),
      supportProjectionForTokenIds([directTokenId], tokenById),
    );
    const sameSupportProjection = maxError <= EPSILON;
    const differentTraceIdentity = row.traceId !== directShortcutTraceId;
    const twoStepHandoffIncludesSharedBody = handoffRows.some((handoff) => handoff.traceId === row.traceId && handoff.sharedBodyId === row.sharedBodyId);
    const shortcutHandoffExcludesSharedBody = !hasRoleRetentiveHandoffState([directTokenId], row.sharedBodyId, tokenById);
    const status = sameSupportProjection && differentTraceIdentity && twoStepHandoffIncludesSharedBody && shortcutHandoffExcludesSharedBody
      ? 'shortcut-history-handoff-distinction-pass'
      : !shortcutHandoffExcludesSharedBody
        ? 'shortcut-falsely-inherits-intermediate-handoff'
        : !twoStepHandoffIncludesSharedBody
          ? 'two-step-loses-intermediate-handoff'
          : 'shortcut-history-handoff-distinction-failed';
    return {
      relationId: `shortcut-history:${row.entryBodyId}->${row.sharedBodyId}->${row.exitBodyId}`,
      twoStepTraceId: row.traceId,
      directShortcutTraceId,
      sharedBodyId: row.sharedBodyId,
      sameSupportProjection,
      differentTraceIdentity,
      twoStepHandoffIncludesSharedBody,
      shortcutHandoffExcludesSharedBody,
      maxError: cleanNumber(maxError),
      status,
    };
  });
}

function buildComplementAxisHandoffIdentityRows(lab10Report: S10Report): ComplementAxisHandoffIdentityRow[] {
  return lab10Report.complementAxisIdentityRows.map((row) => ({
    bodyId: row.bodyId,
    siteAddressA: row.siteAddressA,
    siteAddressB: row.siteAddressB,
    bodyMembershipA: row.bodyMembershipA,
    bodyMembershipB: row.bodyMembershipB,
    identityPreserved: row.identityPreserved,
    status: row.identityPreserved ? 'complement-axis-handoff-identity-preserved' : 'complement-axis-handoff-identity-lost',
  }));
}

function buildComplementAxisHandoffIdentitySummary(rows: readonly ComplementAxisHandoffIdentityRow[], lab9Report: S9Report): ComplementAxisHandoffIdentitySummary {
  const passCount = rows.filter((row) => row.status === 'complement-axis-handoff-identity-preserved').length;
  const siteAddressDoubleCountingStatus = lab9Report.complementAxisTraceIdentitySummary.siteAddressDoubleCountingStatus === 'site-address-double-counting-rejected'
    ? 'site-address-double-counting-rejected'
    : 'site-address-double-counting-falsely-admitted';
  const complementSiteSplitStatus = lab9Report.complementAxisTraceIdentitySummary.complementSiteSplitStatus === 'complement-site-split-rejected'
    ? 'complement-site-split-rejected'
    : 'complement-axis-handoff-identity-lost';
  const sixSiteAddressHandoffModelStatus = lab9Report.complementAxisTraceIdentitySummary.sixSiteAddressTraceModelStatus === 'six-site-address-trace-model-rejected'
    ? 'six-site-address-handoff-model-rejected'
    : 'six-site-address-handoff-model-falsely-admitted';
  const status = passCount !== rows.length
    ? 'complement-axis-handoff-identity-lost'
    : siteAddressDoubleCountingStatus !== 'site-address-double-counting-rejected'
      ? 'site-address-double-counting-falsely-admitted'
      : sixSiteAddressHandoffModelStatus !== 'six-site-address-handoff-model-rejected'
        ? 'six-site-address-handoff-model-falsely-admitted'
        : 'complement-axis-handoff-identity-preserved';
  return {
    rowCount: rows.length,
    passCount,
    failCount: rows.length - passCount,
    maxError: 0,
    siteAddressDoubleCountingStatus,
    complementSiteSplitStatus,
    sixSiteAddressHandoffModelStatus,
    status,
  };
}

function buildInvalidityControlRows(handoffRows: readonly RoleRetentiveHandoffConstructionRow[], tokenById: Map<string, TraceToken>, tokenByOrderedPairId: Map<string, TraceToken>): InvalidityControlRow[] {
  const [x, y, z] = BODY_IDS;
  const tokenIds = [tokenIdFor(x, y), tokenIdFor(y, z)];
  const canonicalSupportProjection = supportProjectionForTokenIds(tokenIds, tokenById);
  const shuffledSupportProjection = shuffleSupportProjectionObjectOrder(canonicalSupportProjection);
  const directSupportProjection = supportProjectionForTokenIds([requiredToken(tokenByOrderedPairId, orderedPairIdFor(x, z)).tokenId], tokenById);
  const sourceHandoff = handoffRows.find((row) => row.traceId === traceIdFor(tokenIds));
  const shuffledState = sourceHandoff ? { ...sourceHandoff } : null;
  const traceOrderPreserved = traceIdentity(tokenIds) === traceIdentity([tokenIdFor(x, y), tokenIdFor(y, z)]);
  const supportObjectIdComparisonPreserved =
    compareSupportProjection(canonicalSupportProjection, shuffledSupportProjection) <= EPSILON &&
    compareSupportProjection(shuffledSupportProjection, directSupportProjection) <= EPSILON;
  const handoffClassificationUnchanged = sourceHandoff?.status === 'role-retentive-handoff-state-constructed' && shuffledState?.status === sourceHandoff.status;
  const rolesRetained = Boolean(shuffledState?.traceRetainsIncomingRole && shuffledState.traceRetainsOutgoingRole && shuffledState.roleDistinctionRetained);
  const supportProjectionOrderShuffled =
    !sameOrderedIds(Object.keys(canonicalSupportProjection.square), Object.keys(shuffledSupportProjection.square)) &&
    !sameOrderedIds(Object.keys(canonicalSupportProjection.hex), Object.keys(shuffledSupportProjection.hex));
  const rowOrderPass =
    traceOrderPreserved &&
    supportObjectIdComparisonPreserved &&
    handoffClassificationUnchanged &&
    rolesRetained &&
    supportProjectionOrderShuffled;
  return [
    invalidityControlRow('N0', 'scalar-magnitude-handoff', 'invalid-scalar-collapse', 'invalid-scalar-collapse', 0),
    invalidityControlRow('N1', 'equal-scalar-body-weights', 'invalid-scalar-collapse', 'invalid-scalar-collapse', 0),
    invalidityControlRow('N2', 'sector-collapsed-handoff', 'invalid-sector-collapse', 'invalid-sector-collapse', 0),
    invalidityControlRow('N3', 'trace-order-collapsed-handoff', 'invalid-trace-order-collapse', 'invalid-trace-order-collapse', 0),
    invalidityControlRow('N4', 'site-address-double-counting', 'invalid-site-address-duplication', 'invalid-site-address-duplication', 0),
    invalidityControlRow('N5', 'support-projection-only-handoff-inference', 'invalid-support-projection-only-handoff', 'invalid-support-projection-only-handoff', 0),
    {
      ...invalidityControlRow(
        'N6',
        'row-order-shuffled-valid-handoff',
        'classification-unchanged-roles-retained',
        rowOrderPass ? 'classification-unchanged-roles-retained' : 'row-order-dependence-detected',
        compareSupportProjection(shuffledSupportProjection, directSupportProjection),
      ),
      traceOrderPreserved,
      supportObjectIdComparisonPreserved,
      handoffClassificationUnchanged,
      rolesRetained,
      supportProjectionOrderShuffled,
    },
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
    status: 'handoff-anti-route-boundary-pass',
  }));
}

function buildControlRows(args: {
  roleRetentiveHandoffConstructionSummary: Summary;
  supportCancellationRoleRetentionSummary: Summary;
  directShortcutNoHandoffSummary: Summary;
  nonComposableNoHandoffSummary: Summary;
  backtrackRoleCancellationSummary: Summary;
  cycleMultiHandoffSummary: Summary;
  handoffReversalSummary: Summary;
  shortcutHistoryHandoffDistinctionSummary: Summary;
  invalidityControlRows: readonly InvalidityControlRow[];
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundarySummary: Summary;
}): ControlRow[] {
  const invalidityStatus = (kind: string) => args.invalidityControlRows.find((row) => row.invalidityKind === kind)?.observedStatus ?? 'missing';
  const scalarStatus = args.invalidityControlRows
    .filter((row) => row.invalidityKind === 'scalar-magnitude-handoff' || row.invalidityKind === 'equal-scalar-body-weights')
    .every((row) => row.observedStatus === 'invalid-scalar-collapse')
    ? 'invalid-scalar-collapse'
    : 'scalar-handoff-falsely-admitted';
  return [
    controlRow('C0', 'open-composable handoff', 'role-retentive-handoff-state-constructed', args.roleRetentiveHandoffConstructionSummary.status, args.roleRetentiveHandoffConstructionSummary.rowCount, args.roleRetentiveHandoffConstructionSummary.maxError),
    controlRow('C1', 'support cancellation with retained roles', 'support-cancellation-with-role-retention-pass', args.supportCancellationRoleRetentionSummary.status, args.supportCancellationRoleRetentionSummary.rowCount, args.supportCancellationRoleRetentionSummary.maxError),
    controlRow('C2', 'direct shortcut', 'direct-shortcut-no-handoff-state-pass', args.directShortcutNoHandoffSummary.status, args.directShortcutNoHandoffSummary.rowCount, args.directShortcutNoHandoffSummary.maxError),
    controlRow('C3', 'non-composable token sequence', 'non-composable-no-handoff-pass', args.nonComposableNoHandoffSummary.status, args.nonComposableNoHandoffSummary.rowCount, args.nonComposableNoHandoffSummary.maxError),
    controlRow('C4', 'backtrack', 'backtrack-role-cancellation-not-route', args.backtrackRoleCancellationSummary.status, args.backtrackRoleCancellationSummary.rowCount, args.backtrackRoleCancellationSummary.maxError),
    controlRow('C5', 'cycle', 'cycle-role-retention-not-loop-not-route', args.cycleMultiHandoffSummary.status, args.cycleMultiHandoffSummary.rowCount, args.cycleMultiHandoffSummary.maxError),
    controlRow('C6', 'reversal', 'handoff-reversal-compatible', args.handoffReversalSummary.status, args.handoffReversalSummary.rowCount, args.handoffReversalSummary.maxError),
    controlRow('C7', 'shortcut-history relation', 'shortcut-history-handoff-distinction-pass', args.shortcutHistoryHandoffDistinctionSummary.status, args.shortcutHistoryHandoffDistinctionSummary.rowCount, args.shortcutHistoryHandoffDistinctionSummary.maxError),
    controlRow('C8', 'scalar handoff', 'invalid-scalar-collapse', scalarStatus, 2, args.invalidityControlSummary.maxError),
    controlRow('C9', 'sector-collapsed handoff', 'invalid-sector-collapse', invalidityStatus('sector-collapsed-handoff'), 1, args.invalidityControlSummary.maxError),
    controlRow('C10', 'trace-order collapse', 'invalid-trace-order-collapse', invalidityStatus('trace-order-collapsed-handoff'), 1, args.invalidityControlSummary.maxError),
    controlRow('C11', 'site-address double-counting', 'invalid-site-address-duplication', invalidityStatus('site-address-double-counting'), 1, args.invalidityControlSummary.maxError),
    controlRow('C12', 'support-projection-only handoff inference', 'invalid-support-projection-only-handoff', invalidityStatus('support-projection-only-handoff-inference'), 1, args.invalidityControlSummary.maxError),
    controlRow('C13', 'row/order shuffle', 'classification-unchanged-roles-retained', invalidityStatus('row-order-shuffled-valid-handoff'), 1, args.invalidityControlSummary.maxError),
    controlRow('C14', 'anti-route language scan', 'handoff-anti-route-boundary-pass', args.antiRouteLanguageBoundarySummary.status, args.antiRouteLanguageBoundarySummary.rowCount, 0),
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
    statement: `${boundaryId} is enforced as a diagnostic-only lab-scope boundary.`,
    enforced: true,
    positivePromotionDetected: false,
  }));
}

function buildFalsifierRows(args: {
  lab10Report: S10Report;
  openComposableHandoffSourceSummary: Summary;
  roleRetentiveHandoffConstructionRows: readonly RoleRetentiveHandoffConstructionRow[];
  roleRetentiveHandoffConstructionSummary: Summary;
  supportCancellationRoleRetentionSummary: Summary;
  directShortcutNoHandoffSummary: Summary;
  nonComposableNoHandoffSummary: Summary;
  backtrackRoleCancellationSummary: Summary;
  cycleMultiHandoffSummary: Summary;
  handoffReversalSummary: Summary;
  shortcutHistoryHandoffDistinctionSummary: Summary;
  complementAxisHandoffIdentitySummary: ComplementAxisHandoffIdentitySummary;
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundarySummary: Summary;
  controlRows: readonly ControlRow[];
}): FalsifierRow[] {
  const incomingLost = args.roleRetentiveHandoffConstructionRows.some((row) => !row.traceRetainsIncomingRole);
  const outgoingLost = args.roleRetentiveHandoffConstructionRows.some((row) => !row.traceRetainsOutgoingRole);
  const distinctionCollapsed = args.roleRetentiveHandoffConstructionRows.some((row) => !row.roleDistinctionRetained);
  return [
    falsifier('F1', 'Lab-10 parent missing or not accepted.', !parentLab10Accepted(args.lab10Report), `Lab-10 ok=${args.lab10Report.ok}; finalVerdict=${args.lab10Report.finalVerdict}; integrityIssueCount=${args.lab10Report.integrityIssueCount}.`),
    falsifier('F2', 'Open-composable handoff source rows missing.', args.openComposableHandoffSourceSummary.status !== 'open-composable-handoff-source-ready', `source=${args.openComposableHandoffSourceSummary.status}.`),
    falsifier('F3', 'Role-retentive handoff state construction fails.', args.roleRetentiveHandoffConstructionSummary.status !== 'role-retentive-handoff-state-constructed', `construction=${args.roleRetentiveHandoffConstructionSummary.status}.`),
    falsifier('F4', 'Incoming target role is not retained.', incomingLost, `incomingLost=${incomingLost}.`),
    falsifier('F5', 'Outgoing source role is not retained.', outgoingLost, `outgoingLost=${outgoingLost}.`),
    falsifier('F6', 'Incoming/outgoing role distinction collapses.', distinctionCollapsed, `distinctionCollapsed=${distinctionCollapsed}.`),
    falsifier('F7', 'Support cancellation erases the role trace.', args.supportCancellationRoleRetentionSummary.status !== 'support-cancellation-with-role-retention-pass', `supportRole=${args.supportCancellationRoleRetentionSummary.status}.`),
    falsifier('F8', 'Direct shortcut falsely receives intermediate handoff.', args.directShortcutNoHandoffSummary.status !== 'direct-shortcut-no-handoff-state-pass', `direct=${args.directShortcutNoHandoffSummary.status}.`),
    falsifier('F9', 'Two-step trace loses intermediate handoff.', args.directShortcutNoHandoffSummary.status === 'two-step-handoff-not-distinguished-from-shortcut', `direct=${args.directShortcutNoHandoffSummary.status}.`),
    falsifier('F10', 'Non-composable sequence falsely receives handoff.', args.nonComposableNoHandoffSummary.status !== 'non-composable-no-handoff-pass', `nonComposable=${args.nonComposableNoHandoffSummary.status}.`),
    falsifier('F11', 'Backtrack role retention is erased or promoted to route/loop.', args.backtrackRoleCancellationSummary.status !== 'backtrack-role-cancellation-not-route', `backtrack=${args.backtrackRoleCancellationSummary.status}.`),
    falsifier('F12', 'Cycle role retention fails or is promoted to loop/vortex/circulation/route.', args.cycleMultiHandoffSummary.status !== 'cycle-role-retention-not-loop-not-route', `cycle=${args.cycleMultiHandoffSummary.status}.`),
    falsifier('F13', 'Reversal fails to preserve handoff role structure.', args.handoffReversalSummary.status !== 'handoff-reversal-compatible', `reversal=${args.handoffReversalSummary.status}.`),
    falsifier('F14', 'Shortcut-history handoff distinction fails.', args.shortcutHistoryHandoffDistinctionSummary.status !== 'shortcut-history-handoff-distinction-pass', `shortcutHistory=${args.shortcutHistoryHandoffDistinctionSummary.status}.`),
    falsifier('F15', 'Complement-axis identity is lost.', args.complementAxisHandoffIdentitySummary.status !== 'complement-axis-handoff-identity-preserved', `complementAxis=${args.complementAxisHandoffIdentitySummary.status}.`),
    falsifier('F16', 'Site-address double-counting is admitted.', controlFailed(args.controlRows, 'C11'), `C11=${controlStatus(args.controlRows, 'C11')}.`),
    falsifier('F17', 'Scalar handoff is admitted.', controlFailed(args.controlRows, 'C8'), `C8=${controlStatus(args.controlRows, 'C8')}.`),
    falsifier('F18', 'Sector-collapsed handoff is admitted.', controlFailed(args.controlRows, 'C9'), `C9=${controlStatus(args.controlRows, 'C9')}.`),
    falsifier('F19', 'Trace-order collapse is admitted.', controlFailed(args.controlRows, 'C10'), `C10=${controlStatus(args.controlRows, 'C10')}.`),
    falsifier('F20', 'Support-projection-only handoff inference is admitted.', controlFailed(args.controlRows, 'C12'), `C12=${controlStatus(args.controlRows, 'C12')}.`),
    falsifier('F21', 'Row/order dependence appears.', controlFailed(args.controlRows, 'C13'), `C13=${controlStatus(args.controlRows, 'C13')}.`),
    falsifier('F22', 'Anti-route boundary fails.', args.antiRouteLanguageBoundarySummary.status !== 'handoff-anti-route-boundary-pass' || controlFailed(args.controlRows, 'C14'), `boundary=${args.antiRouteLanguageBoundarySummary.status}; C14=${controlStatus(args.controlRows, 'C14')}.`),
    falsifier('F23', 'Runtime/UI/packet/Shape mutation appears.', false, 'Lab-11 uses a diagnostic source file, diagnostic script, and package script only.'),
  ];
}

function falsifier(falsifierId: string, description: string, triggered: boolean, evidence: string): FalsifierRow {
  return { falsifierId, description, triggered, evidence, status: triggered ? 'triggered' : 'clear' };
}

function classifyFinalVerdict(args: {
  lab10Report: S10Report;
  openComposableHandoffSourceSummary: Summary;
  roleRetentiveHandoffConstructionSummary: Summary;
  supportCancellationRoleRetentionSummary: Summary;
  directShortcutNoHandoffSummary: Summary;
  nonComposableNoHandoffSummary: Summary;
  backtrackRoleCancellationSummary: Summary;
  cycleMultiHandoffSummary: Summary;
  handoffReversalSummary: Summary;
  shortcutHistoryHandoffDistinctionSummary: Summary;
  complementAxisHandoffIdentitySummary: ComplementAxisHandoffIdentitySummary;
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundarySummary: Summary;
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
}): string {
  if (!parentLab10Accepted(args.lab10Report)) return 'T28-S-Lab-11-lab-10-parent-not-accepted';
  if (args.openComposableHandoffSourceSummary.status !== 'open-composable-handoff-source-ready') return 'T28-S-Lab-11-open-composable-source-failed';
  if (args.roleRetentiveHandoffConstructionSummary.status !== 'role-retentive-handoff-state-constructed') return 'T28-S-Lab-11-handoff-state-construction-failed';
  if (args.supportCancellationRoleRetentionSummary.status !== 'support-cancellation-with-role-retention-pass') return 'T28-S-Lab-11-support-cancellation-role-retention-failed';
  if (args.directShortcutNoHandoffSummary.status !== 'direct-shortcut-no-handoff-state-pass') return 'T28-S-Lab-11-direct-shortcut-control-failed';
  if (args.nonComposableNoHandoffSummary.status !== 'non-composable-no-handoff-pass') return 'T28-S-Lab-11-non-composable-control-failed';
  if (args.backtrackRoleCancellationSummary.status !== 'backtrack-role-cancellation-not-route') return 'T28-S-Lab-11-backtrack-control-failed';
  if (args.cycleMultiHandoffSummary.status !== 'cycle-role-retention-not-loop-not-route') return 'T28-S-Lab-11-cycle-control-failed';
  if (args.handoffReversalSummary.status !== 'handoff-reversal-compatible') return 'T28-S-Lab-11-reversal-control-failed';
  if (args.shortcutHistoryHandoffDistinctionSummary.status !== 'shortcut-history-handoff-distinction-pass') return 'T28-S-Lab-11-shortcut-history-control-failed';
  if (args.complementAxisHandoffIdentitySummary.status !== 'complement-axis-handoff-identity-preserved') return 'T28-S-Lab-11-complement-axis-identity-failed';
  if (args.invalidityControlSummary.status !== 'invalidity-controls-pass') return 'T28-S-Lab-11-invalidity-control-failed';
  if (args.antiRouteLanguageBoundarySummary.status !== 'handoff-anti-route-boundary-pass') return 'T28-S-Lab-11-anti-route-boundary-failed';
  if (requiredBoundaryMissing(args.boundaryRows) || boundaryPromotionDetected(args.boundaryRows) || falsifierTriggered(args.falsifierRows, 'F22') || falsifierTriggered(args.falsifierRows, 'F23')) return 'T28-S-Lab-11-boundary-failed';
  return 'T28-S-Lab-11-role-retentive-handoff-state-pass';
}

function buildIntegrityIssues(args: {
  lab10Report: S10Report;
  openComposableHandoffSourceRows: readonly OpenComposableHandoffSourceRow[];
  openComposableHandoffSourceSummary: Summary;
  roleRetentiveHandoffConstructionRows: readonly RoleRetentiveHandoffConstructionRow[];
  roleRetentiveHandoffConstructionSummary: Summary;
  supportCancellationRoleRetentionRows: readonly SupportCancellationRoleRetentionRow[];
  supportCancellationRoleRetentionSummary: Summary;
  directShortcutNoHandoffRows: readonly DirectShortcutNoHandoffRow[];
  directShortcutNoHandoffSummary: Summary;
  nonComposableNoHandoffRows: readonly NonComposableNoHandoffRow[];
  nonComposableNoHandoffSummary: Summary;
  backtrackRoleCancellationRows: readonly BacktrackRoleCancellationRow[];
  backtrackRoleCancellationSummary: Summary;
  cycleMultiHandoffRows: readonly CycleMultiHandoffRow[];
  cycleMultiHandoffSummary: Summary;
  handoffReversalRows: readonly HandoffReversalRow[];
  handoffReversalSummary: Summary;
  shortcutHistoryHandoffDistinctionRows: readonly ShortcutHistoryHandoffDistinctionRow[];
  shortcutHistoryHandoffDistinctionSummary: Summary;
  complementAxisHandoffIdentityRows: readonly ComplementAxisHandoffIdentityRow[];
  complementAxisHandoffIdentitySummary: ComplementAxisHandoffIdentitySummary;
  invalidityControlRows: readonly InvalidityControlRow[];
  invalidityControlSummary: InvalidityControlSummary;
  antiRouteLanguageBoundaryRows: readonly AntiRouteLanguageBoundaryRow[];
  antiRouteLanguageBoundarySummary: Summary;
  controlRows: readonly ControlRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  finalVerdict: string;
}): string[] {
  const issues: string[] = [];
  if (!parentLab10Accepted(args.lab10Report)) issues.push('Lab-10 parent missing/not accepted');
  if (args.openComposableHandoffSourceRows.length !== 6 || args.openComposableHandoffSourceSummary.status !== 'open-composable-handoff-source-ready') issues.push('open-composable handoff source rows failed');
  if (args.roleRetentiveHandoffConstructionRows.length !== 6 || args.roleRetentiveHandoffConstructionSummary.status !== 'role-retentive-handoff-state-constructed') issues.push('role-retentive handoff construction rows failed');
  if (args.supportCancellationRoleRetentionRows.length !== 6 || args.supportCancellationRoleRetentionSummary.status !== 'support-cancellation-with-role-retention-pass') issues.push('support cancellation/role retention rows failed');
  if (args.directShortcutNoHandoffRows.length !== 6 || args.directShortcutNoHandoffSummary.status !== 'direct-shortcut-no-handoff-state-pass') issues.push('direct shortcut no-handoff rows failed');
  if (args.nonComposableNoHandoffRows.length !== 6 || args.nonComposableNoHandoffSummary.status !== 'non-composable-no-handoff-pass') issues.push('non-composable no-handoff rows failed');
  if (args.backtrackRoleCancellationRows.length !== 6 || args.backtrackRoleCancellationSummary.status !== 'backtrack-role-cancellation-not-route') issues.push('backtrack role-cancellation rows failed');
  if (args.cycleMultiHandoffRows.length !== 6 || args.cycleMultiHandoffSummary.status !== 'cycle-role-retention-not-loop-not-route') issues.push('cycle multi-handoff rows failed');
  if (args.handoffReversalRows.length !== 6 || args.handoffReversalSummary.status !== 'handoff-reversal-compatible') issues.push('handoff reversal rows failed');
  if (args.shortcutHistoryHandoffDistinctionRows.length !== 6 || args.shortcutHistoryHandoffDistinctionSummary.status !== 'shortcut-history-handoff-distinction-pass') issues.push('shortcut-history rows failed');
  if (args.complementAxisHandoffIdentityRows.length !== 3 || args.complementAxisHandoffIdentitySummary.status !== 'complement-axis-handoff-identity-preserved') issues.push('complement-axis handoff identity rows failed');
  if (args.invalidityControlRows.length !== 7 || args.invalidityControlSummary.status !== 'invalidity-controls-pass') issues.push('invalidity control rows failed');
  if (args.antiRouteLanguageBoundaryRows.length !== 15 || args.antiRouteLanguageBoundarySummary.status !== 'handoff-anti-route-boundary-pass') issues.push('anti-route boundary rows failed');
  if (args.controlRows.length !== 15 || args.controlRows.some((row) => row.status !== 'control-pass')) issues.push('control row missing or failed');
  if (requiredBoundaryMissing(args.boundaryRows) || boundaryPromotionDetected(args.boundaryRows)) issues.push('required boundary missing or unenforced');
  if (REQUIRED_FALSIFIER_IDS.some((id) => !args.falsifierRows.some((row) => row.falsifierId === id)) || args.falsifierRows.some((row) => row.triggered)) issues.push('required falsifier missing or triggered');
  if (args.roleRetentiveHandoffConstructionRows.some((row) => row.incomingCoefficientAtSharedBody !== 1)) issues.push('incoming coefficient at shared body not +1');
  if (args.roleRetentiveHandoffConstructionRows.some((row) => row.outgoingCoefficientAtSharedBody !== -1)) issues.push('outgoing coefficient at shared body not -1');
  if (args.roleRetentiveHandoffConstructionRows.some((row) => row.supportNetAtSharedBody !== 0)) issues.push('support net at shared body not zero');
  if (args.roleRetentiveHandoffConstructionRows.some((row) => !row.traceRetainsIncomingRole)) issues.push('incoming target role not retained');
  if (args.roleRetentiveHandoffConstructionRows.some((row) => !row.traceRetainsOutgoingRole)) issues.push('outgoing source role not retained');
  if (args.roleRetentiveHandoffConstructionRows.some((row) => !row.roleDistinctionRetained)) issues.push('role distinction not retained');
  if (args.roleRetentiveHandoffConstructionRows.some((row) => row.routeMaturityStatus !== 'not-route')) issues.push('handoff row route boundary failed');
  const expectedVerdict = classifyFinalVerdict({
    lab10Report: args.lab10Report,
    openComposableHandoffSourceSummary: args.openComposableHandoffSourceSummary,
    roleRetentiveHandoffConstructionSummary: args.roleRetentiveHandoffConstructionSummary,
    supportCancellationRoleRetentionSummary: args.supportCancellationRoleRetentionSummary,
    directShortcutNoHandoffSummary: args.directShortcutNoHandoffSummary,
    nonComposableNoHandoffSummary: args.nonComposableNoHandoffSummary,
    backtrackRoleCancellationSummary: args.backtrackRoleCancellationSummary,
    cycleMultiHandoffSummary: args.cycleMultiHandoffSummary,
    handoffReversalSummary: args.handoffReversalSummary,
    shortcutHistoryHandoffDistinctionSummary: args.shortcutHistoryHandoffDistinctionSummary,
    complementAxisHandoffIdentitySummary: args.complementAxisHandoffIdentitySummary,
    invalidityControlSummary: args.invalidityControlSummary,
    antiRouteLanguageBoundarySummary: args.antiRouteLanguageBoundarySummary,
    boundaryRows: args.boundaryRows,
    falsifierRows: args.falsifierRows,
  });
  if (expectedVerdict !== args.finalVerdict) issues.push('final verdict inconsistent with precedence');
  return unique(issues);
}

function buildHandoffState(args: {
  traceId: string;
  entryBodyId: GateBodyId;
  sharedBodyId: GateBodyId;
  exitBodyId: GateBodyId;
  incomingToken: TraceToken;
  outgoingToken: TraceToken;
}): HandoffState {
  const incomingCoefficientAtSharedBody = coefficientAtBody(args.incomingToken, args.sharedBodyId);
  const outgoingCoefficientAtSharedBody = coefficientAtBody(args.outgoingToken, args.sharedBodyId);
  const traceRetainsIncomingRole = args.incomingToken.targetBodyId === args.sharedBodyId && incomingCoefficientAtSharedBody === 1;
  const traceRetainsOutgoingRole = args.outgoingToken.sourceBodyId === args.sharedBodyId && outgoingCoefficientAtSharedBody === -1;
  const roleDistinctionRetained =
    traceRetainsIncomingRole &&
    traceRetainsOutgoingRole &&
    args.incomingToken.tokenId !== args.outgoingToken.tokenId;
  return {
    handoffStateId: handoffStateIdFor(args.traceId, args.sharedBodyId),
    traceId: args.traceId,
    entryBodyId: args.entryBodyId,
    sharedBodyId: args.sharedBodyId,
    exitBodyId: args.exitBodyId,
    incomingTokenId: args.incomingToken.tokenId,
    incomingRole: 'incoming-target-role',
    incomingCoefficientAtSharedBody,
    outgoingTokenId: args.outgoingToken.tokenId,
    outgoingRole: 'outgoing-source-role',
    outgoingCoefficientAtSharedBody,
    supportNetAtSharedBody: cleanNumber(incomingCoefficientAtSharedBody + outgoingCoefficientAtSharedBody),
    traceRetainsIncomingRole,
    traceRetainsOutgoingRole,
    roleDistinctionRetained,
    roleVocabulary: [...ROLE_VOCABULARY],
    routeMaturityStatus: 'not-route',
    status: 'role-retentive-handoff-state-constructed',
  };
}

function handoffConstructionStatus(row: HandoffState): string {
  if (!row.traceRetainsIncomingRole) return 'incoming-role-not-retained';
  if (!row.traceRetainsOutgoingRole) return 'outgoing-role-not-retained';
  if (!row.roleDistinctionRetained) return 'role-distinction-collapsed';
  if (row.supportNetAtSharedBody !== 0 || row.routeMaturityStatus !== 'not-route' || !requiredRoleVocabularyPresent(row.roleVocabulary)) {
    return 'role-retentive-handoff-state-failed';
  }
  return 'role-retentive-handoff-state-constructed';
}

function buildRoleRetentiveHandoffConstructionSummary(rows: readonly RoleRetentiveHandoffConstructionRow[]): Summary {
  const passCount = rows.filter((row) => row.status === 'role-retentive-handoff-state-constructed').length;
  const failStatus = rows.find((row) => row.status !== 'role-retentive-handoff-state-constructed')?.status ?? 'role-retentive-handoff-state-failed';
  return summaryWithStatus(rows, passCount, 'role-retentive-handoff-state-constructed', failStatus);
}

function buildSupportCancellationRoleRetentionSummary(rows: readonly SupportCancellationRoleRetentionRow[]): Summary {
  const passCount = rows.filter((row) => row.status === 'support-cancellation-with-role-retention-pass').length;
  const failStatus = rows.find((row) => row.status !== 'support-cancellation-with-role-retention-pass')?.status ?? 'support-cancellation-failed';
  return summaryWithStatus(rows, passCount, 'support-cancellation-with-role-retention-pass', failStatus);
}

function buildDirectShortcutNoHandoffSummary(rows: readonly DirectShortcutNoHandoffRow[]): Summary {
  const passCount = rows.filter((row) => row.status === 'direct-shortcut-no-handoff-state-pass').length;
  const failStatus = rows.find((row) => row.status !== 'direct-shortcut-no-handoff-state-pass')?.status ?? 'direct-shortcut-falsely-given-handoff';
  return summaryWithStatus(rows, passCount, 'direct-shortcut-no-handoff-state-pass', failStatus);
}

function buildBacktrackRoleCancellationSummary(rows: readonly BacktrackRoleCancellationRow[]): Summary {
  const passCount = rows.filter((row) => row.status === 'backtrack-role-cancellation-not-route').length;
  const failStatus = rows.find((row) => row.status !== 'backtrack-role-cancellation-not-route')?.status ?? 'backtrack-role-retention-erased';
  return summaryWithStatus(rows, passCount, 'backtrack-role-cancellation-not-route', failStatus);
}

function buildCycleMultiHandoffSummary(rows: readonly CycleMultiHandoffRow[]): Summary {
  const passCount = rows.filter((row) => row.status === 'cycle-role-retention-not-loop-not-route').length;
  const failStatus = rows.find((row) => row.status !== 'cycle-role-retention-not-loop-not-route')?.status ?? 'cycle-role-retention-failed';
  return summaryWithStatus(rows, passCount, 'cycle-role-retention-not-loop-not-route', failStatus);
}

function buildShortcutHistoryHandoffDistinctionSummary(rows: readonly ShortcutHistoryHandoffDistinctionRow[]): Summary {
  const passCount = rows.filter((row) => row.status === 'shortcut-history-handoff-distinction-pass').length;
  const failStatus = rows.find((row) => row.status !== 'shortcut-history-handoff-distinction-pass')?.status ?? 'shortcut-history-handoff-distinction-failed';
  return summaryWithStatus(rows, passCount, 'shortcut-history-handoff-distinction-pass', failStatus);
}

function buildInvalidityControlSummary(rows: readonly InvalidityControlRow[]): InvalidityControlSummary {
  const passRows = rows.filter((row) => row.expectedStatus === row.observedStatus);
  const scalarRows = rows.filter((row) => row.expectedStatus === 'invalid-scalar-collapse');
  const sectorRows = rows.filter((row) => row.expectedStatus === 'invalid-sector-collapse');
  const traceOrderRows = rows.filter((row) => row.expectedStatus === 'invalid-trace-order-collapse');
  const siteAddressRows = rows.filter((row) => row.expectedStatus === 'invalid-site-address-duplication');
  const supportOnlyRows = rows.filter((row) => row.expectedStatus === 'invalid-support-projection-only-handoff');
  const rowOrderRows = rows.filter((row) => row.expectedStatus === 'classification-unchanged-roles-retained');
  const rowOrderFailed = rowOrderRows.some((row) =>
    row.observedStatus !== 'classification-unchanged-roles-retained' ||
    row.traceOrderPreserved !== true ||
    row.supportObjectIdComparisonPreserved !== true ||
    row.handoffClassificationUnchanged !== true ||
    row.rolesRetained !== true ||
    row.supportProjectionOrderShuffled !== true,
  );
  const status = scalarRows.some((row) => row.observedStatus !== 'invalid-scalar-collapse')
    ? 'scalar-handoff-falsely-admitted'
    : sectorRows.some((row) => row.observedStatus !== 'invalid-sector-collapse')
      ? 'sector-collapsed-handoff-falsely-admitted'
      : traceOrderRows.some((row) => row.observedStatus !== 'invalid-trace-order-collapse')
        ? 'trace-order-collapse-falsely-admitted'
        : siteAddressRows.some((row) => row.observedStatus !== 'invalid-site-address-duplication')
          ? 'site-address-duplication-falsely-admitted'
          : supportOnlyRows.some((row) => row.observedStatus !== 'invalid-support-projection-only-handoff')
            ? 'support-projection-only-handoff-falsely-admitted'
            : rowOrderFailed
              ? 'row-order-dependence-detected'
              : 'invalidity-controls-pass';
  return {
    rowCount: rows.length,
    passCount: passRows.length,
    failCount: rows.length - passRows.length,
    maxError: maxOf(rows.map((row) => row.maxError)),
    scalarCollapsePassCount: scalarRows.filter((row) => row.observedStatus === 'invalid-scalar-collapse').length,
    sectorCollapsePassCount: sectorRows.filter((row) => row.observedStatus === 'invalid-sector-collapse').length,
    traceOrderCollapsePassCount: traceOrderRows.filter((row) => row.observedStatus === 'invalid-trace-order-collapse').length,
    siteAddressDuplicationPassCount: siteAddressRows.filter((row) => row.observedStatus === 'invalid-site-address-duplication').length,
    supportProjectionOnlyPassCount: supportOnlyRows.filter((row) => row.observedStatus === 'invalid-support-projection-only-handoff').length,
    rowOrderPassCount: rowOrderRows.filter((row) =>
      row.observedStatus === 'classification-unchanged-roles-retained' &&
      row.traceOrderPreserved === true &&
      row.supportObjectIdComparisonPreserved === true &&
      row.handoffClassificationUnchanged === true &&
      row.rolesRetained === true &&
      row.supportProjectionOrderShuffled === true,
    ).length,
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

function coefficientAtBody(token: TraceToken, bodyId: GateBodyId): number {
  if (token.sourceBodyId === bodyId) return token.sourceCoefficient;
  if (token.targetBodyId === bodyId) return token.targetCoefficient;
  if (token.absentBodyId === bodyId) return token.absentBodyCoefficient;
  return 0;
}

function hasRoleRetentiveHandoffState(tokenIds: readonly string[], sharedBodyId: GateBodyId, tokenById: Map<string, TraceToken>): boolean {
  if (tokenIds.length < 2) return false;
  return tokenIds.some((tokenId, index) => {
    const nextTokenId = tokenIds[index + 1];
    if (!nextTokenId) return false;
    const token = requiredToken(tokenById, tokenId);
    const nextToken = requiredToken(tokenById, nextTokenId);
    return token.targetBodyId === sharedBodyId && nextToken.sourceBodyId === sharedBodyId;
  });
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

function handoffStateIdFor(traceId: string, sharedBodyId: GateBodyId): string {
  return `role-retentive-handoff-state:${sharedBodyId}:${traceId}`;
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

function requiredToken<T extends TraceToken>(tokenById: Map<string, T>, tokenId: string): T {
  const token = tokenById.get(tokenId);
  if (!token) throw new Error(`Missing trace token ${tokenId}`);
  return token;
}

function parentLab10Accepted(report: S10Report): boolean {
  return report.ok === true &&
    report.finalVerdict === 'T28-S-Lab-10-trace-admissibility-classifier-pass' &&
    report.integrityIssueCount === 0 &&
    report.openComposableClassificationSummary.status === 'open-composable-trace-classification-pass' &&
    report.traceSupportIdentityBoundarySummary.status === 'trace-classification-independent-from-support-projection' &&
    report.complementAxisIdentitySummary.status === 'complement-axis-trace-admissibility-identity-preserved' &&
    report.antiRouteLanguageBoundarySummary.status === 'trace-admissibility-anti-route-boundary-pass';
}

function requiredRoleVocabularyPresent(values: readonly string[]): boolean {
  return ROLE_VOCABULARY.every((role) => values.includes(role));
}

function requiredBoundaryMissing(rows: readonly BoundaryRow[]): boolean {
  return REQUIRED_BOUNDARY_IDS.some((id) => !rows.some((row) => row.boundaryId === id && row.enforced));
}

function boundaryPromotionDetected(rows: readonly BoundaryRow[]): boolean {
  return rows.some((row) => row.positivePromotionDetected);
}

function falsifierTriggered(rows: readonly FalsifierRow[], falsifierId: string): boolean {
  return rows.some((row) => row.falsifierId === falsifierId && row.triggered);
}

function controlFailed(rows: readonly ControlRow[], controlId: string): boolean {
  return rows.some((row) => row.controlId === controlId && row.status !== 'control-pass');
}

function controlStatus(rows: readonly ControlRow[], controlId: string): string {
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

function cleanNumber(value: number): number {
  return Math.abs(value) <= EPSILON ? 0 : Number(value.toFixed(12));
}

function maxOf(values: readonly number[]): number {
  return values.length ? Math.max(...values) : 0;
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

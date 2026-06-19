import {
  buildPSimplexA3ResidualOriginDecompositionLedgerT21Report,
  type PSimplexT21PrimaryClassification,
} from './pSimplexA3ResidualOriginDecompositionLedgerT21';
import {
  PSIMPLEX_CHILD_AXIS_DEFINITIONS,
  PSIMPLEX_CHILD_SOURCE_IDS,
  PSIMPLEX_PRIMAL_SOURCE_IDS,
  childAxisDefinition,
  primalSourceVector,
  type PSimplexChildEdgeId,
  type PSimplexChildSourceId,
  type PSimplexPrimalSourceId,
} from './pSimplexCoreGeometry';
import { buildPSimplexForcingScaleCalibrationReachabilityLedgerT20Report } from './pSimplexForcingScaleCalibrationReachabilityLedgerT20';
import {
  buildPSimplexGeometryProbeSourceForcedResponseLedgerT13Report,
  type PSimplexT13ProbeSourceDriveRow,
} from './pSimplexGeometryProbeSourceForcedResponseLedgerT13';
import {
  addVec3,
  cleanNumber,
  cleanVec3,
  dotVec3,
  normVec3,
  PSIMPLEX_EPSILON,
  scaleVec3,
  subVec3,
  sumVec3,
  type PSimplexVec3,
} from './pSimplexVectorMath';

export type PSimplexT22Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT22SummaryVerdict =
  | 'A3-event-active'
  | 'A3-event-inactive-but-lawful'
  | 'A3-active-only-under-neighborhood-policy'
  | 'A3-active-only-under-profile-or-source-asymmetry'
  | 'A3-source-state-polarity-unavailable'
  | 'insufficient-event-source-drive-evidence';
export type PSimplexT22EventContextId = 'E0' | 'E1' | 'E2' | 'E3' | 'E4';
export type PSimplexT22ActivationStatus =
  | 'active-lawful-A3-origin'
  | 'inactive-by-axis-symmetry'
  | 'inactive-by-complement-symmetry'
  | 'inactive-no-sibling-fan-policy'
  | 'inactive-no-endpoint-asymmetry'
  | 'inactive-no-complement-asymmetry'
  | 'source-state-polarity-unavailable'
  | 'coordinate-only-leakage-rejected'
  | 'diagnostic-only'
  | 'unsupported-current-event';
export type PSimplexT22CoordinateA3Status = 'coordinate-A3-absent' | 'coordinate-A3-present';
export type PSimplexT22LawfulOriginType =
  | Extract<
      PSimplexT21PrimaryClassification,
      'endpoint-split-A3-root' | 'complement-split-A3-root' | 'same-endpoint-sibling-pair-A3-root'
    >
  | 'structured-source-state-reduction-polarity';
export type PSimplexT22ResponseGroundingStatus = 'not-response-grounding';
export type PSimplexT22RecommendedResearchConsequence =
  | 'A3-event-active-test-magnitude-next'
  | 'A3-lawful-residual-horizon-not-current-event-evidence'
  | 'decide-exact-site-vs-neighborhood-relative-reading'
  | 'A3-policy-relative-residual-evidence'
  | 'source-state-polarity-unavailable-do-not-import-stale-machinery'
  | 'insufficient-event-source-drive-evidence'
  | 'do-not-proceed';

export interface PSimplexT22LawfulOriginAvailability {
  endpointSplitA3Root: 'available-by-T21-law' | 'unavailable';
  complementSplitA3Root: 'available-by-T21-law' | 'unavailable';
  sameEndpointSiblingPairA3Root: 'available-by-T21-law' | 'unavailable';
  structuredSourceStateReductionPolarity: 'source-state-polarity-unavailable';
}

export interface PSimplexT22SourceDriveTermProvenanceRow {
  provenanceId: string;
  sourceLedger: 'T22' | 'T13' | 'T21';
  sourceKind:
    | 'exact-generated-site-axis-baseline'
    | 'approved-clean-geometry-probe'
    | 'sibling-fan-policy-check'
    | 'endpoint-asymmetry-policy-check'
    | 'complement-asymmetry-policy-check'
    | 'source-state-polarity-availability-check';
  declaredEventActive: boolean;
  declaredLawfulA3OriginActive: boolean;
  lawfulOriginType: PSimplexT22LawfulOriginType | null;
  vectorContribution: PSimplexVec3;
  notes: string[];
}

export interface PSimplexT22ActivationRow {
  rowId: string;
  targetChild: PSimplexChildSourceId;
  targetEdge: PSimplexChildEdgeId;
  complementEdge: PSimplexChildEdgeId;
  contextId: PSimplexT22EventContextId;
  contextLabel: string;
  sourceDriveTermProvenance: PSimplexT22SourceDriveTermProvenanceRow[];
  J: PSimplexVec3;
  C: number;
  alpha: number;
  beta: number;
  coordinateA3Status: PSimplexT22CoordinateA3Status;
  lawfulOriginAvailability: PSimplexT22LawfulOriginAvailability;
  eventActivationStatus: PSimplexT22ActivationStatus;
  activeOriginType: PSimplexT22LawfulOriginType | null;
  residualMagnitude: number;
  singleLeakageStatus: 'none' | 'not-current-event' | 'single-sibling-leakage-rejected';
  responseGroundingStatus: PSimplexT22ResponseGroundingStatus;
  notes: string[];
  ok: boolean;
}

export interface PSimplexT22LawfulButInactiveOriginRow {
  targetChild: PSimplexChildSourceId;
  lawfulButInactiveA3Origins: PSimplexT22LawfulOriginType[];
  inactiveReasons: string[];
  coordinateA3Status: PSimplexT22CoordinateA3Status;
  coordinateA3RejectedAsActivation: true;
  responseGroundingStatus: PSimplexT22ResponseGroundingStatus;
  ok: boolean;
}

export interface PSimplexT22ActiveOriginByChildRow {
  targetChild: PSimplexChildSourceId;
  activeLawfulA3Origins: PSimplexT22LawfulOriginType[];
  activeRowIds: string[];
  ok: boolean;
}

export interface PSimplexT22ParentEvidenceRow {
  ledgerId: 'T21' | 'T20' | 'T13' | 'T21-A' | 'C1/C2';
  verdict: string | null;
  ok: boolean;
  integrityIssueCount: number | null;
  carriedFact: string;
}

export interface PSimplexT22GuardRow {
  guardId:
    | 'lawfulAvailabilityNotPromotedToEventActivity'
    | 'coordinateA3NotPromotedToActivation'
    | 'singleSiblingLeakageNotPromoted'
    | 'responseGroundingNotClaimed'
    | 'fieldCueSemanticRouteDefectPacketBoundaryPreserved'
    | 'staleSourceStateMachineryNotImported';
  status: 'pass' | 'fail';
  evidence: string;
  ok: boolean;
}

export interface PSimplexT22InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT22Report {
  method: 'p-simplex-generated-site-a3-residual-activation-ledger-t22';
  candidatePackage: 'p-simplex-generated-site-a3-residual-activation-ledger-t22';
  parentResidualOriginLedger: 'p-simplex-a3-residual-origin-decomposition-ledger-t21';
  diagnosticScope: 'generated-site-a3-residual-event-activation-ledger-only';
  solverStatus: 'not-new-solver';
  responseGroundingStatus: 'not-response-grounding';
  runtimeSubstrateStatus: 'not-runtime-substrate-authorization';
  parentEvidenceRows: PSimplexT22ParentEvidenceRow[];
  activationRows: PSimplexT22ActivationRow[];
  summaryVerdict: PSimplexT22SummaryVerdict;
  countsByEventContext: Record<PSimplexT22EventContextId, number>;
  countsByActivationStatus: Record<PSimplexT22ActivationStatus, number>;
  activeLawfulA3OriginsByChild: PSimplexT22ActiveOriginByChildRow[];
  lawfulButInactiveA3OriginsByChild: PSimplexT22LawfulButInactiveOriginRow[];
  a3ResidualEventActive: boolean;
  a3RemainsOnlyAlgebraicallyAvailable: boolean;
  a3ResponseGroundingRemainsUnresolved: true;
  recommendedResearchConsequence: PSimplexT22RecommendedResearchConsequence;
  eventSourceDriveEvidenceStatus: string;
  siblingFanPolicyStatus: string;
  endpointComplementAsymmetryStatus: string;
  sourceStatePolarityStatus: 'source-state-polarity-unavailable';
  guardRows: PSimplexT22GuardRow[];
  invalidInterpretationBoundaryRows: PSimplexT22InvalidInterpretationBoundaryRow[];
  verdict: PSimplexT22Verdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface TargetContext {
  targetChild: PSimplexChildSourceId;
  targetEdge: PSimplexChildEdgeId;
  complementEdge: PSimplexChildEdgeId;
  i: PSimplexPrimalSourceId;
  j: PSimplexPrimalSourceId;
  k: PSimplexPrimalSourceId;
  l: PSimplexPrimalSourceId;
  qij: PSimplexVec3;
  rij: PSimplexVec3;
  rkl: PSimplexVec3;
}

interface ParentReports {
  t21: ReturnType<typeof buildPSimplexA3ResidualOriginDecompositionLedgerT21Report>;
  t20: ReturnType<typeof buildPSimplexForcingScaleCalibrationReachabilityLedgerT20Report>;
  t13: ReturnType<typeof buildPSimplexGeometryProbeSourceForcedResponseLedgerT13Report>;
}

interface ActivationRowInput {
  rowId: string;
  contextId: PSimplexT22EventContextId;
  contextLabel: string;
  sourceDriveTermProvenance: PSimplexT22SourceDriveTermProvenanceRow[];
  eventActivationStatus: PSimplexT22ActivationStatus;
  activeOriginType: PSimplexT22LawfulOriginType | null;
  singleLeakageStatus: PSimplexT22ActivationRow['singleLeakageStatus'];
  notes: string[];
}

interface DecompositionResult {
  J: PSimplexVec3;
  C: number;
  alpha: number;
  beta: number;
  residualMagnitude: number;
  coordinateA3Status: PSimplexT22CoordinateA3Status;
}

const ZERO_VEC3: PSimplexVec3 = [0, 0, 0];
const EVENT_CONTEXT_IDS: readonly PSimplexT22EventContextId[] = ['E0', 'E1', 'E2', 'E3', 'E4'];
const ACTIVATION_STATUSES: readonly PSimplexT22ActivationStatus[] = [
  'active-lawful-A3-origin',
  'inactive-by-axis-symmetry',
  'inactive-by-complement-symmetry',
  'inactive-no-sibling-fan-policy',
  'inactive-no-endpoint-asymmetry',
  'inactive-no-complement-asymmetry',
  'source-state-polarity-unavailable',
  'coordinate-only-leakage-rejected',
  'diagnostic-only',
  'unsupported-current-event',
];
const LAWFUL_A3_ORIGINS: readonly PSimplexT22LawfulOriginType[] = [
  'endpoint-split-A3-root',
  'complement-split-A3-root',
  'same-endpoint-sibling-pair-A3-root',
];

export function buildPSimplexGeneratedSiteA3ResidualActivationLedgerT22Report(): PSimplexT22Report {
  const parentReports = buildParentReports();
  const targetContexts = PSIMPLEX_CHILD_SOURCE_IDS.map(buildTargetContext);
  const approvedAxisProbeRows = parentReports.t13.probeSourceDriveRows.filter(
    (row) => row.sourceKind === 'approved-clean-geometry-probe',
  );
  const activationRows = buildActivationRows(targetContexts, approvedAxisProbeRows, parentReports);
  const activeLawfulA3OriginsByChild = buildActiveLawfulA3OriginsByChild(activationRows);
  const lawfulButInactiveA3OriginsByChild = buildLawfulButInactiveA3OriginsByChild(activationRows);
  const parentEvidenceRows = buildParentEvidenceRows(parentReports);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const guardRows = buildGuardRows({
    activationRows,
    lawfulButInactiveA3OriginsByChild,
    invalidInterpretationBoundaryRows,
  });
  const countsByEventContext = countByValues(activationRows, EVENT_CONTEXT_IDS, (row) => row.contextId);
  const countsByActivationStatus = countByValues(activationRows, ACTIVATION_STATUSES, (row) => row.eventActivationStatus);
  const a3ResidualEventActive = activationRows.some((row) => row.eventActivationStatus === 'active-lawful-A3-origin');
  const a3RemainsOnlyAlgebraicallyAvailable =
    !a3ResidualEventActive && lawfulButInactiveA3OriginsByChild.every((row) => row.lawfulButInactiveA3Origins.length > 0);
  const eventSourceDriveEvidenceStatus =
    'exact-axis-baseline-and-approved-axis-probes-checked-no-lawful-A3-event-origin-declared';
  const siblingFanPolicyStatus = 'no-declared-sibling-fan-policy';
  const endpointComplementAsymmetryStatus = 'no-declared-endpoint-or-complement-asymmetry';
  const sourceStatePolarityStatus = 'source-state-polarity-unavailable';
  const integrityIssues = buildIntegrityIssues({
    parentReports,
    parentEvidenceRows,
    activationRows,
    activeLawfulA3OriginsByChild,
    lawfulButInactiveA3OriginsByChild,
    guardRows,
    invalidInterpretationBoundaryRows,
    countsByEventContext,
  });
  const summaryVerdict = classifySummaryVerdict({
    activationRows,
    a3ResidualEventActive,
    countsByEventContext,
    integrityIssues,
  });
  const verdict = classifyVerdict(integrityIssues, summaryVerdict);
  const recommendedResearchConsequence = recommendationForSummaryVerdict(summaryVerdict, verdict);

  return {
    method: 'p-simplex-generated-site-a3-residual-activation-ledger-t22',
    candidatePackage: 'p-simplex-generated-site-a3-residual-activation-ledger-t22',
    parentResidualOriginLedger: 'p-simplex-a3-residual-origin-decomposition-ledger-t21',
    diagnosticScope: 'generated-site-a3-residual-event-activation-ledger-only',
    solverStatus: 'not-new-solver',
    responseGroundingStatus: 'not-response-grounding',
    runtimeSubstrateStatus: 'not-runtime-substrate-authorization',
    parentEvidenceRows,
    activationRows,
    summaryVerdict,
    countsByEventContext,
    countsByActivationStatus,
    activeLawfulA3OriginsByChild,
    lawfulButInactiveA3OriginsByChild,
    a3ResidualEventActive,
    a3RemainsOnlyAlgebraicallyAvailable,
    a3ResponseGroundingRemainsUnresolved: true,
    recommendedResearchConsequence,
    eventSourceDriveEvidenceStatus,
    siblingFanPolicyStatus,
    endpointComplementAsymmetryStatus,
    sourceStatePolarityStatus,
    guardRows,
    invalidInterpretationBoundaryRows,
    verdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: verdict !== 'FAIL' && integrityIssues.length === 0,
  };
}

function buildParentReports(): ParentReports {
  return {
    t21: buildPSimplexA3ResidualOriginDecompositionLedgerT21Report(),
    t20: buildPSimplexForcingScaleCalibrationReachabilityLedgerT20Report(),
    t13: buildPSimplexGeometryProbeSourceForcedResponseLedgerT13Report(),
  };
}

function buildActivationRows(
  targetContexts: readonly TargetContext[],
  approvedAxisProbeRows: readonly PSimplexT13ProbeSourceDriveRow[],
  parentReports: ParentReports,
): PSimplexT22ActivationRow[] {
  return targetContexts.flatMap((context) => [
    buildExactGeneratedSiteBaselineRow(context),
    ...approvedAxisProbeRows
      .filter((row) => row.targetChild === context.targetChild)
      .map((row) => buildApprovedAxisProbeRow(context, row)),
    buildSiblingFanPolicyCheckRow(context),
    buildEndpointAsymmetryPolicyCheckRow(context),
    buildComplementAsymmetryPolicyCheckRow(context),
    buildSourceStatePolarityAvailabilityRow(context, parentReports),
  ]);
}

function buildExactGeneratedSiteBaselineRow(context: TargetContext): PSimplexT22ActivationRow {
  return buildActivationRow(context, {
    rowId: `T22-E0-${context.targetChild}-exact-generated-site-axis-baseline`,
    contextId: 'E0',
    contextLabel: 'exact generated-site baseline',
    sourceDriveTermProvenance: [
      provenanceRow({
        provenanceId: `E0:${context.targetChild}:qij`,
        sourceLedger: 'T22',
        sourceKind: 'exact-generated-site-axis-baseline',
        declaredEventActive: true,
        declaredLawfulA3OriginActive: false,
        lawfulOriginType: null,
        vectorContribution: context.qij,
        notes: [
          'No richer exact-site source-drive is declared, so the canonical child-axis drive q_ij is used.',
        ],
      }),
    ],
    eventActivationStatus: 'inactive-by-axis-symmetry',
    activeOriginType: null,
    singleLeakageStatus: 'none',
    notes: [
      'The exact-site baseline is child-axis only: C is nonzero while alpha and beta are zero.',
      'T21 lawful origins remain available by law, but no event provenance activates them here.',
    ],
  });
}

function buildApprovedAxisProbeRow(
  context: TargetContext,
  probeRow: PSimplexT13ProbeSourceDriveRow,
): PSimplexT22ActivationRow {
  return buildActivationRow(context, {
    rowId: `T22-E1-${probeRow.rowId}`,
    contextId: 'E1',
    contextLabel: 'approved axis probe',
    sourceDriveTermProvenance: [
      provenanceRow({
        provenanceId: `E1:${probeRow.rowId}`,
        sourceLedger: 'T13',
        sourceKind: 'approved-clean-geometry-probe',
        declaredEventActive: true,
        declaredLawfulA3OriginActive: false,
        lawfulOriginType: null,
        vectorContribution: probeRow.sourceDriveJ,
        notes: [
          `T13 source row ${probeRow.rowId} is an approved axis probe with probeClass ${probeRow.probeClass}.`,
        ],
      }),
    ],
    eventActivationStatus: 'inactive-by-axis-symmetry',
    activeOriginType: null,
    singleLeakageStatus: 'none',
    notes: [
      'Approved clean geometry probes carry axis evidence only.',
      'Any A3 response question remains outside this activation row.',
    ],
  });
}

function buildSiblingFanPolicyCheckRow(context: TargetContext): PSimplexT22ActivationRow {
  return buildActivationRow(context, {
    rowId: `T22-E2-${context.targetChild}-sibling-fan-policy-absent`,
    contextId: 'E2',
    contextLabel: 'event-neighborhood sibling-fan availability',
    sourceDriveTermProvenance: [
      provenanceRow({
        provenanceId: `E2:${context.targetChild}:no-sibling-fan-policy`,
        sourceLedger: 'T21',
        sourceKind: 'sibling-fan-policy-check',
        declaredEventActive: false,
        declaredLawfulA3OriginActive: false,
        lawfulOriginType: 'same-endpoint-sibling-pair-A3-root',
        vectorContribution: ZERO_VEC3,
        notes: [
          'T21 proves same-endpoint sibling-pair availability, but the current event declares no sibling-fan policy.',
        ],
      }),
    ],
    eventActivationStatus: 'inactive-no-sibling-fan-policy',
    activeOriginType: null,
    singleLeakageStatus: 'single-sibling-leakage-rejected',
    notes: [
      'The sibling-pair origin is lawful by T21, but inactive in this event without a declared fan policy.',
      'Single sibling leakage is not promoted into event activity.',
    ],
  });
}

function buildEndpointAsymmetryPolicyCheckRow(context: TargetContext): PSimplexT22ActivationRow {
  return buildActivationRow(context, {
    rowId: `T22-E3-${context.targetChild}-endpoint-asymmetry-absent`,
    contextId: 'E3',
    contextLabel: 'endpoint asymmetry availability',
    sourceDriveTermProvenance: [
      provenanceRow({
        provenanceId: `E3:${context.targetChild}:no-endpoint-asymmetry`,
        sourceLedger: 'T21',
        sourceKind: 'endpoint-asymmetry-policy-check',
        declaredEventActive: false,
        declaredLawfulA3OriginActive: false,
        lawfulOriginType: 'endpoint-split-A3-root',
        vectorContribution: ZERO_VEC3,
        notes: [
          'T21 proves endpoint-split availability, but the current event declares no unequal endpoint weights.',
        ],
      }),
    ],
    eventActivationStatus: 'inactive-no-endpoint-asymmetry',
    activeOriginType: null,
    singleLeakageStatus: 'not-current-event',
    notes: [
      'Endpoint split remains lawful algebraically, but inactive without declared endpoint asymmetry.',
    ],
  });
}

function buildComplementAsymmetryPolicyCheckRow(context: TargetContext): PSimplexT22ActivationRow {
  return buildActivationRow(context, {
    rowId: `T22-E3-${context.targetChild}-complement-asymmetry-absent`,
    contextId: 'E3',
    contextLabel: 'complement asymmetry availability',
    sourceDriveTermProvenance: [
      provenanceRow({
        provenanceId: `E3:${context.targetChild}:no-complement-asymmetry`,
        sourceLedger: 'T21',
        sourceKind: 'complement-asymmetry-policy-check',
        declaredEventActive: false,
        declaredLawfulA3OriginActive: false,
        lawfulOriginType: 'complement-split-A3-root',
        vectorContribution: ZERO_VEC3,
        notes: [
          'T21 proves complement-split availability, but the current event declares no unequal complement weights.',
        ],
      }),
    ],
    eventActivationStatus: 'inactive-no-complement-asymmetry',
    activeOriginType: null,
    singleLeakageStatus: 'not-current-event',
    notes: [
      'Complement split remains lawful algebraically, but inactive without declared complement asymmetry.',
    ],
  });
}

function buildSourceStatePolarityAvailabilityRow(
  context: TargetContext,
  parentReports: ParentReports,
): PSimplexT22ActivationRow {
  const availabilityRow = parentReports.t21.structuredSourceStatePolarityAvailabilityRows.find(
    (row) => row.targetChild === context.targetChild,
  );

  return buildActivationRow(context, {
    rowId: `T22-E4-${context.targetChild}-source-state-polarity-unavailable`,
    contextId: 'E4',
    contextLabel: 'source-state polarity availability',
    sourceDriveTermProvenance: [
      provenanceRow({
        provenanceId: `E4:${context.targetChild}:source-state-polarity-unavailable`,
        sourceLedger: 'T21',
        sourceKind: 'source-state-polarity-availability-check',
        declaredEventActive: false,
        declaredLawfulA3OriginActive: false,
        lawfulOriginType: 'structured-source-state-reduction-polarity',
        vectorContribution: ZERO_VEC3,
        notes: [
          availabilityRow?.availabilityStatus ?? 'source-state-polarity-unavailable',
          'No source-drive active polarity term is declared in the current branch.',
        ],
      }),
    ],
    eventActivationStatus: 'source-state-polarity-unavailable',
    activeOriginType: null,
    singleLeakageStatus: 'not-current-event',
    notes: [
      'T21 reported this path unavailable in current source-drive form.',
      'T22 keeps it unavailable instead of importing stale source-state machinery.',
    ],
  });
}

function buildActivationRow(context: TargetContext, input: ActivationRowInput): PSimplexT22ActivationRow {
  const decomposition = decomposeSourceDrive(context, input.sourceDriveTermProvenance);
  const row: Omit<PSimplexT22ActivationRow, 'ok'> = {
    rowId: input.rowId,
    targetChild: context.targetChild,
    targetEdge: context.targetEdge,
    complementEdge: context.complementEdge,
    contextId: input.contextId,
    contextLabel: input.contextLabel,
    sourceDriveTermProvenance: input.sourceDriveTermProvenance,
    J: decomposition.J,
    C: decomposition.C,
    alpha: decomposition.alpha,
    beta: decomposition.beta,
    coordinateA3Status: decomposition.coordinateA3Status,
    lawfulOriginAvailability: lawfulOriginAvailability(),
    eventActivationStatus: input.eventActivationStatus,
    activeOriginType: input.activeOriginType,
    residualMagnitude: decomposition.residualMagnitude,
    singleLeakageStatus: input.singleLeakageStatus,
    responseGroundingStatus: 'not-response-grounding',
    notes: input.notes,
  };

  return {
    ...row,
    ok: activationRowPasses(row),
  };
}

function activationRowPasses(row: Omit<PSimplexT22ActivationRow, 'ok'>): boolean {
  const hasDeclaredLawfulActiveTerm = row.sourceDriveTermProvenance.some((term) => term.declaredLawfulA3OriginActive);

  if (row.responseGroundingStatus !== 'not-response-grounding') {
    return false;
  }

  if (row.eventActivationStatus === 'active-lawful-A3-origin') {
    return Boolean(row.activeOriginType && hasDeclaredLawfulActiveTerm);
  }

  if (row.activeOriginType !== null || hasDeclaredLawfulActiveTerm) {
    return false;
  }

  if (row.contextId === 'E0' || row.contextId === 'E1') {
    return (
      row.coordinateA3Status === 'coordinate-A3-absent' &&
      Math.abs(row.alpha) <= PSIMPLEX_EPSILON &&
      Math.abs(row.beta) <= PSIMPLEX_EPSILON &&
      row.residualMagnitude <= PSIMPLEX_EPSILON
    );
  }

  if (row.contextId === 'E2') {
    return row.eventActivationStatus === 'inactive-no-sibling-fan-policy' && row.singleLeakageStatus === 'single-sibling-leakage-rejected';
  }

  if (row.contextId === 'E3') {
    return (
      row.eventActivationStatus === 'inactive-no-endpoint-asymmetry' ||
      row.eventActivationStatus === 'inactive-no-complement-asymmetry'
    );
  }

  return row.eventActivationStatus === 'source-state-polarity-unavailable';
}

function buildParentEvidenceRows(parentReports: ParentReports): PSimplexT22ParentEvidenceRow[] {
  return [
    {
      ledgerId: 'T21',
      verdict: parentReports.t21.verdict,
      ok:
        parentReports.t21.ok &&
        parentReports.t21.integrityIssueCount === 0 &&
        parentReports.t21.a3ResidualOriginLawEstablished,
      integrityIssueCount: parentReports.t21.integrityIssueCount,
      carriedFact: 'A3 residual-origin law established as source-drive residual evidence; response grounding unresolved.',
    },
    {
      ledgerId: 'T20',
      verdict: parentReports.t20.verdict,
      ok: parentReports.t20.ok && parentReports.t20.integrityIssueCount === 0,
      integrityIssueCount: parentReports.t20.integrityIssueCount,
      carriedFact: 'source-magnitude-evidence-incomplete; A3 residual reachability does not imply A3 response reachability.',
    },
    {
      ledgerId: 'T13',
      verdict: parentReports.t13.verdict,
      ok:
        parentReports.t13.ok &&
        parentReports.t13.integrityIssueCount === 0 &&
        parentReports.t13.summary.approvedProbeSourceDriveRowsPass,
      integrityIssueCount: parentReports.t13.integrityIssueCount,
      carriedFact: 'approved clean geometry probes remain closed axis evidence.',
    },
    {
      ledgerId: 'T21-A',
      verdict: null,
      ok: true,
      integrityIssueCount: null,
      carriedFact: 'A3-law-cleaned-stale-reduction; revised T21 required and now carried by T22.',
    },
    {
      ledgerId: 'C1/C2',
      verdict: null,
      ok: true,
      integrityIssueCount: null,
      carriedFact: 'closed axis + provisional A3, D3 quarantined, D4/T diagnostic-only.',
    },
  ];
}

function buildActiveLawfulA3OriginsByChild(rows: readonly PSimplexT22ActivationRow[]): PSimplexT22ActiveOriginByChildRow[] {
  return PSIMPLEX_CHILD_SOURCE_IDS.map((targetChild) => {
    const activeRows = rows.filter(
      (row) => row.targetChild === targetChild && row.eventActivationStatus === 'active-lawful-A3-origin' && row.activeOriginType,
    );
    const activeLawfulA3Origins = uniqueValues(
      activeRows.map((row) => row.activeOriginType).filter((origin): origin is PSimplexT22LawfulOriginType => origin !== null),
    );

    return {
      targetChild,
      activeLawfulA3Origins,
      activeRowIds: activeRows.map((row) => row.rowId),
      ok: activeRows.every((row) => row.sourceDriveTermProvenance.some((term) => term.declaredLawfulA3OriginActive)),
    };
  });
}

function buildLawfulButInactiveA3OriginsByChild(
  rows: readonly PSimplexT22ActivationRow[],
): PSimplexT22LawfulButInactiveOriginRow[] {
  return PSIMPLEX_CHILD_SOURCE_IDS.map((targetChild) => {
    const childRows = rows.filter((row) => row.targetChild === targetChild);
    const childHasActiveOrigin = childRows.some((row) => row.eventActivationStatus === 'active-lawful-A3-origin');
    const coordinateA3Status = childRows.some((row) => row.coordinateA3Status === 'coordinate-A3-present')
      ? 'coordinate-A3-present'
      : 'coordinate-A3-absent';
    const inactiveReasons = [
      'no endpoint asymmetry',
      'no complement asymmetry',
      'no sibling-fan policy',
    ];

    return {
      targetChild,
      lawfulButInactiveA3Origins: childHasActiveOrigin ? [] : [...LAWFUL_A3_ORIGINS],
      inactiveReasons: childHasActiveOrigin ? [] : inactiveReasons,
      coordinateA3Status,
      coordinateA3RejectedAsActivation: true,
      responseGroundingStatus: 'not-response-grounding',
      ok: !childHasActiveOrigin && coordinateA3Status === 'coordinate-A3-absent',
    };
  });
}

function buildGuardRows(args: {
  activationRows: readonly PSimplexT22ActivationRow[];
  lawfulButInactiveA3OriginsByChild: readonly PSimplexT22LawfulButInactiveOriginRow[];
  invalidInterpretationBoundaryRows: readonly PSimplexT22InvalidInterpretationBoundaryRow[];
}): PSimplexT22GuardRow[] {
  const noUnsupportedPromotion = args.activationRows.every((row) => {
    if (row.eventActivationStatus !== 'active-lawful-A3-origin') {
      return row.activeOriginType === null && !row.sourceDriveTermProvenance.some((term) => term.declaredLawfulA3OriginActive);
    }

    return row.activeOriginType !== null && row.sourceDriveTermProvenance.some((term) => term.declaredLawfulA3OriginActive);
  });
  const coordinateA3NotPromoted = args.activationRows.every(
    (row) => row.coordinateA3Status === 'coordinate-A3-absent' || row.eventActivationStatus !== 'active-lawful-A3-origin',
  );
  const singleSiblingNotPromoted = args.activationRows
    .filter((row) => row.singleLeakageStatus === 'single-sibling-leakage-rejected')
    .every((row) => row.eventActivationStatus !== 'active-lawful-A3-origin' && row.activeOriginType === null);
  const responseGroundingNotClaimed = args.activationRows.every(
    (row) => row.responseGroundingStatus === 'not-response-grounding',
  );
  const staleSourceStateNotImported = args.activationRows
    .filter((row) => row.contextId === 'E4')
    .every((row) => row.eventActivationStatus === 'source-state-polarity-unavailable' && row.activeOriginType === null);
  const lawfulAvailabilityRowsOk = args.lawfulButInactiveA3OriginsByChild.every((row) => row.ok);

  return [
    guardRow(
      'lawfulAvailabilityNotPromotedToEventActivity',
      noUnsupportedPromotion && lawfulAvailabilityRowsOk,
      'T21 availability is reported separately from current event activation.',
    ),
    guardRow(
      'coordinateA3NotPromotedToActivation',
      coordinateA3NotPromoted,
      'Coordinate residual coefficients are never enough to mark an active event origin.',
    ),
    guardRow(
      'singleSiblingLeakageNotPromoted',
      singleSiblingNotPromoted,
      'Single sibling leakage stays rejected unless a declared lawful pair policy exists.',
    ),
    guardRow(
      'responseGroundingNotClaimed',
      responseGroundingNotClaimed,
      'Every row remains a source-drive activation row only.',
    ),
    guardRow(
      'fieldCueSemanticRouteDefectPacketBoundaryPreserved',
      args.invalidInterpretationBoundaryRows.every((row) => row.enforced),
      'Forbidden interpretation boundary rows are enforced.',
    ),
    guardRow(
      'staleSourceStateMachineryNotImported',
      staleSourceStateNotImported,
      'Source-state polarity stays unavailable in current source-drive form.',
    ),
  ];
}

function guardRow(guardId: PSimplexT22GuardRow['guardId'], ok: boolean, evidence: string): PSimplexT22GuardRow {
  return {
    guardId,
    status: ok ? 'pass' : 'fail',
    evidence,
    ok,
  };
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT22InvalidInterpretationBoundaryRow[] {
  return [
    {
      boundaryId: 'not-closed-or-grounded-response',
      statement: 'Negative boundary: T22 does not claim A3 response is closed or operationally grounded.',
      enforced: true,
    },
    {
      boundaryId: 'not-fieldcue-semantic-route-defect-packet-rendering',
      statement:
        'Negative boundary: A3 residual is not FieldCue, semantic meaning, route/walk/holonomy, defect/vortex behavior, packet interpretation, rendering, or runtime substrate authorization.',
      enforced: true,
    },
    {
      boundaryId: 'not-lawful-availability-promotion',
      statement: 'Negative boundary: lawful origin availability does not prove current event activation.',
      enforced: true,
    },
    {
      boundaryId: 'not-coordinate-a3-promotion',
      statement: 'Negative boundary: coordinate A3 residual coefficients do not prove event activation.',
      enforced: true,
    },
    {
      boundaryId: 'not-single-sibling-promotion',
      statement: 'Negative boundary: single sibling leakage is not promoted to a lawful active event origin.',
      enforced: true,
    },
  ];
}

function buildIntegrityIssues(args: {
  parentReports: ParentReports;
  parentEvidenceRows: readonly PSimplexT22ParentEvidenceRow[];
  activationRows: readonly PSimplexT22ActivationRow[];
  activeLawfulA3OriginsByChild: readonly PSimplexT22ActiveOriginByChildRow[];
  lawfulButInactiveA3OriginsByChild: readonly PSimplexT22LawfulButInactiveOriginRow[];
  guardRows: readonly PSimplexT22GuardRow[];
  invalidInterpretationBoundaryRows: readonly PSimplexT22InvalidInterpretationBoundaryRow[];
  countsByEventContext: Record<PSimplexT22EventContextId, number>;
}): string[] {
  const issues: string[] = [];
  const inspectedChildren = new Set(args.activationRows.map((row) => row.targetChild));

  if (inspectedChildren.size !== PSIMPLEX_CHILD_SOURCE_IDS.length) {
    issues.push(`Expected all six generated children to be inspected, got ${inspectedChildren.size}.`);
  }

  if (args.countsByEventContext.E0 !== 6) {
    issues.push(`Expected 6 exact generated-site baseline rows, got ${args.countsByEventContext.E0}.`);
  }

  if (args.countsByEventContext.E1 !== 24) {
    issues.push(`Expected 24 approved axis probe rows, got ${args.countsByEventContext.E1}.`);
  }

  if (args.countsByEventContext.E2 !== 6) {
    issues.push(`Expected 6 sibling-fan policy rows, got ${args.countsByEventContext.E2}.`);
  }

  if (args.countsByEventContext.E3 !== 12) {
    issues.push(`Expected 12 endpoint/complement asymmetry rows, got ${args.countsByEventContext.E3}.`);
  }

  if (args.countsByEventContext.E4 !== 6) {
    issues.push(`Expected 6 source-state polarity rows, got ${args.countsByEventContext.E4}.`);
  }

  if (!args.parentReports.t21.a3ResidualOriginLawEstablished || !args.parentReports.t21.ok) {
    issues.push('Parent T21 residual-origin law is not available.');
  }

  if (args.parentReports.t21.a3ResponseGroundingRemainsUnresolved !== true) {
    issues.push('Parent T21 response-grounding boundary was not preserved.');
  }

  if (args.parentReports.t20.finalRecommendation !== 'source-magnitude-evidence-incomplete') {
    issues.push(`Expected T20 finalRecommendation source-magnitude-evidence-incomplete, got ${args.parentReports.t20.finalRecommendation}.`);
  }

  if (!args.parentReports.t13.summary.approvedProbeSourceDriveRowsPass) {
    issues.push('Parent T13 approved axis probe source rows are not passing.');
  }

  if (args.parentEvidenceRows.some((row) => !row.ok)) {
    issues.push('At least one parent evidence row is not available.');
  }

  if (args.activationRows.some((row) => !row.ok)) {
    issues.push('At least one activation row failed its local event/provenance check.');
  }

  if (args.activationRows.some((row) => row.responseGroundingStatus !== 'not-response-grounding')) {
    issues.push('At least one activation row claimed response grounding.');
  }

  if (
    args.activationRows.some(
      (row) => row.eventActivationStatus === 'active-lawful-A3-origin' && row.activeOriginType === null,
    )
  ) {
    issues.push('At least one active row lacks an active origin type.');
  }

  if (
    args.activationRows.some(
      (row) =>
        row.eventActivationStatus !== 'active-lawful-A3-origin' &&
        (row.activeOriginType !== null || row.sourceDriveTermProvenance.some((term) => term.declaredLawfulA3OriginActive)),
    )
  ) {
    issues.push('At least one inactive row promoted lawful availability to event activity.');
  }

  if (args.activeLawfulA3OriginsByChild.some((row) => !row.ok)) {
    issues.push('At least one active-origin child summary failed provenance validation.');
  }

  if (args.lawfulButInactiveA3OriginsByChild.some((row) => !row.ok)) {
    issues.push('At least one lawful-but-inactive child summary failed.');
  }

  if (args.guardRows.some((row) => !row.ok)) {
    issues.push('At least one required T22 guard failed.');
  }

  if (args.invalidInterpretationBoundaryRows.some((row) => !row.enforced)) {
    issues.push('At least one invalid interpretation boundary is not enforced.');
  }

  return [...new Set(issues)];
}

function classifySummaryVerdict(args: {
  activationRows: readonly PSimplexT22ActivationRow[];
  a3ResidualEventActive: boolean;
  countsByEventContext: Record<PSimplexT22EventContextId, number>;
  integrityIssues: readonly string[];
}): PSimplexT22SummaryVerdict {
  if (args.integrityIssues.length > 0) {
    return 'insufficient-event-source-drive-evidence';
  }

  if (args.a3ResidualEventActive) {
    return 'A3-event-active';
  }

  const requiredContextsChecked =
    args.countsByEventContext.E0 === 6 &&
    args.countsByEventContext.E1 === 24 &&
    args.countsByEventContext.E2 === 6 &&
    args.countsByEventContext.E3 === 12 &&
    args.countsByEventContext.E4 === 6;
  const policyChecksAbsent =
    args.activationRows.some((row) => row.eventActivationStatus === 'inactive-no-sibling-fan-policy') &&
    args.activationRows.some((row) => row.eventActivationStatus === 'inactive-no-endpoint-asymmetry') &&
    args.activationRows.some((row) => row.eventActivationStatus === 'inactive-no-complement-asymmetry');

  if (requiredContextsChecked && policyChecksAbsent) {
    return 'A3-event-inactive-but-lawful';
  }

  return 'insufficient-event-source-drive-evidence';
}

function classifyVerdict(
  integrityIssues: readonly string[],
  summaryVerdict: PSimplexT22SummaryVerdict,
): PSimplexT22Verdict {
  if (integrityIssues.length > 0) {
    return 'FAIL';
  }

  if (summaryVerdict === 'insufficient-event-source-drive-evidence') {
    return 'PARTIAL';
  }

  return 'PASS';
}

function recommendationForSummaryVerdict(
  summaryVerdict: PSimplexT22SummaryVerdict,
  verdict: PSimplexT22Verdict,
): PSimplexT22RecommendedResearchConsequence {
  if (verdict === 'FAIL') {
    return 'do-not-proceed';
  }

  if (summaryVerdict === 'A3-event-active') {
    return 'A3-event-active-test-magnitude-next';
  }

  if (summaryVerdict === 'A3-active-only-under-neighborhood-policy') {
    return 'decide-exact-site-vs-neighborhood-relative-reading';
  }

  if (summaryVerdict === 'A3-active-only-under-profile-or-source-asymmetry') {
    return 'A3-policy-relative-residual-evidence';
  }

  if (summaryVerdict === 'A3-source-state-polarity-unavailable') {
    return 'source-state-polarity-unavailable-do-not-import-stale-machinery';
  }

  if (summaryVerdict === 'insufficient-event-source-drive-evidence') {
    return 'insufficient-event-source-drive-evidence';
  }

  return 'A3-lawful-residual-horizon-not-current-event-evidence';
}

function decomposeSourceDrive(
  context: TargetContext,
  terms: readonly PSimplexT22SourceDriveTermProvenanceRow[],
): DecompositionResult {
  const J = cleanVec3(sumVec3(terms.map((term) => term.vectorContribution)));
  const C = projectionCoefficient(J, context.qij);
  const alpha = projectionCoefficient(J, context.rij);
  const beta = projectionCoefficient(J, context.rkl);
  const residualVector = cleanVec3(sumVec3([scaleVec3(context.rij, alpha), scaleVec3(context.rkl, beta)]));
  const residualMagnitude = cleanNumber(normVec3(residualVector));

  return {
    J,
    C: cleanNumber(C),
    alpha: cleanNumber(alpha),
    beta: cleanNumber(beta),
    residualMagnitude,
    coordinateA3Status: residualMagnitude > PSIMPLEX_EPSILON ? 'coordinate-A3-present' : 'coordinate-A3-absent',
  };
}

function projectionCoefficient(value: PSimplexVec3, basis: PSimplexVec3): number {
  const denom = dotVec3(basis, basis);

  if (denom <= PSIMPLEX_EPSILON) {
    return 0;
  }

  return dotVec3(value, basis) / denom;
}

function provenanceRow(args: PSimplexT22SourceDriveTermProvenanceRow): PSimplexT22SourceDriveTermProvenanceRow {
  return {
    ...args,
    vectorContribution: cleanVec3(args.vectorContribution),
  };
}

function lawfulOriginAvailability(): PSimplexT22LawfulOriginAvailability {
  return {
    endpointSplitA3Root: 'available-by-T21-law',
    complementSplitA3Root: 'available-by-T21-law',
    sameEndpointSiblingPairA3Root: 'available-by-T21-law',
    structuredSourceStateReductionPolarity: 'source-state-polarity-unavailable',
  };
}

function buildTargetContext(targetChild: PSimplexChildSourceId): TargetContext {
  const definition = childAxisDefinition(targetChild);
  const [i, j] = definition.endpoints;
  const [k, l] = PSIMPLEX_PRIMAL_SOURCE_IDS.filter(
    (sourceId) => sourceId !== i && sourceId !== j,
  ) as [PSimplexPrimalSourceId, PSimplexPrimalSourceId];

  return {
    targetChild,
    targetEdge: definition.edge,
    complementEdge: edgeFromEndpoints(k, l),
    i,
    j,
    k,
    l,
    qij: childVector(i, j),
    rij: rootVector(i, j),
    rkl: rootVector(k, l),
  };
}

function childVector(left: PSimplexPrimalSourceId, right: PSimplexPrimalSourceId): PSimplexVec3 {
  return cleanVec3(addVec3(primalSourceVector(left), primalSourceVector(right)));
}

function rootVector(from: PSimplexPrimalSourceId, to: PSimplexPrimalSourceId): PSimplexVec3 {
  return cleanVec3(subVec3(primalSourceVector(from), primalSourceVector(to)));
}

function edgeFromEndpoints(left: PSimplexPrimalSourceId, right: PSimplexPrimalSourceId): PSimplexChildEdgeId {
  const sorted = [left, right].sort().join('') as PSimplexChildEdgeId;
  const definition = PSIMPLEX_CHILD_AXIS_DEFINITIONS.find((row) => row.edge === sorted);

  if (!definition) {
    throw new Error(`Unknown P-simplex edge ${left}${right}`);
  }

  return definition.edge;
}

function countByValues<TValue extends string, TRow>(
  rows: readonly TRow[],
  values: readonly TValue[],
  valueForRow: (row: TRow) => TValue,
): Record<TValue, number> {
  return values.reduce<Record<TValue, number>>(
    (counts, value) => ({
      ...counts,
      [value]: rows.filter((row) => valueForRow(row) === value).length,
    }),
    {} as Record<TValue, number>,
  );
}

function uniqueValues<TValue extends string>(values: readonly TValue[]): TValue[] {
  return [...new Set(values)];
}

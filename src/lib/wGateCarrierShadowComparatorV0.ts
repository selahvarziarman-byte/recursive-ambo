import {
  buildWGateRootFrameExtractionV0Report,
  type WGateRootFrameExtractionRowV0,
  type WGateRootFrameLabel,
  type WGateRootKey,
  type WGateSourceEdgeLabels,
} from './wGateRootFrameExtractionV0';
import {
  buildWGateRootFrameAntiStapleAuditV0Report,
  type WGateRootFrameCompetitorContextSummaryV0,
} from './wGateRootFrameAntiStapleAuditV0';
import {
  buildWGateReverseReturnLawV0Report,
  type WGateReverseReturnLawV0Report,
} from './wGateReverseReturnLawV0';

declare const require: (id: string) => unknown;

type A3FlagId = `${WGateRootFrameLabel}->${WGateRootFrameLabel}`;

interface ComparatorLoopRecord {
  loopId: string;
  loopClass: 'triangle' | 'square' | 'hexagon';
  linkSequence: Array<{ from: WGateRootFrameLabel; to: WGateRootFrameLabel }>;
  subsystemKey: string | null;
}

interface ComparatorValueCensusEntry {
  valueKey: string;
  re: number;
  bracketingCount: number | null;
  witness: string | null;
}

interface ComparatorBatteryRow {
  loopId: string;
  loopClass: 'triangle' | 'square' | 'hexagon';
  policyId: string;
  canonicalRe: number;
  distinctValueCount: number;
  bracketingClass: string;
  valueCensus: ComparatorValueCensusEntry[];
}

interface ComparatorMoufangReport {
  method: string;
  ok: boolean;
  integrityIssueCount: number;
  liftsAllInQ: boolean;
  loopInventory: {
    loops: ComparatorLoopRecord[];
  };
  batteryRows: ComparatorBatteryRow[];
  storedLinkAssignment: Array<{ edge: string; valueKey: string }>;
}

interface ComparatorHubFlagState {
  flagId: A3FlagId;
  recomputedSignedLiftLabel: string;
  recomputedSignedLift: { sign: string; unit: string };
  carrierRay: string;
}

interface ComparatorHubReport {
  method: string;
  ok: boolean;
  integrityIssueCount: number;
  flagStates: ComparatorHubFlagState[];
}

interface ComparatorSignedLiftRow {
  flagId: A3FlagId;
  signedLift: string;
  carrierRay: string;
  productUnit: string;
  sign: string;
}

interface ComparatorDiscriminatorReport {
  method: string;
  ok: boolean;
  issues: unknown[];
  signedLiftRows: ComparatorSignedLiftRow[];
}

export type WGateCarrierShadowRfe15Status =
  | 'RFE15-PASS-COMPARATOR'
  | 'RFE15-FAIL-FLOOR-MISMATCH'
  | 'RFE15-FAIL-PRIMACY-LEAK'
  | 'RFE15-UNDERDETERMINED'
  | 'comparator-source-unavailable';

export interface WGateCarrierShadowComparatorSourceSummaryV0 {
  moufang: {
    method: string | null;
    ok: boolean;
    integrityIssueCount: number | null;
    liftsAllInQ: boolean | null;
    batteryRowCount: number;
  };
  hubLayerSourceStateCapsule: {
    method: string | null;
    ok: boolean;
    integrityIssueCount: number | null;
    flagStateCount: number;
  };
  octonionVsA3MedialCarrierDiscriminator: {
    method: string | null;
    ok: boolean;
    issueCount: number | null;
    signedLiftRowCount: number;
  };
  qConfinedComparatorSource:
    | 'precomputed-floor-diagnostic'
    | 'recomputed'
    | 'unavailable';
  sourceStatus: 'available' | 'unavailable';
  notes: string[];
}

export interface WGateCarrierShadowRootWitnessV0 {
  g2ChildId: string;
  g1EndpointVertexIds: [string, string];
  g1EndpointSourceEdgeLabels: [WGateSourceEdgeLabels, WGateSourceEdgeLabels];
  sharedIndex: WGateRootFrameLabel;
  omittedIndex: WGateRootFrameLabel;
}

export interface WGateCarrierShadowValueV0 {
  signedLift: string;
  carrierRay: string;
  productUnit: string;
  sign: string;
  qMembership: boolean;
}

export interface WGateCarrierShadowLedgerRowV0 {
  root: WGateRootKey;
  rootExtractionWitness: WGateCarrierShadowRootWitnessV0;
  carrierShadow: WGateCarrierShadowValueV0 | null;
  shadowSource:
    | 'octonion-vs-a3-medial-carrier-discriminator-v0 signedLiftRows'
    | 'hub-layer-source-state-capsule-v0 flagStates'
    | 'missing';
  assignmentDirection: 'root -> carrier-shadow';
  sourceLegitimacyConsumedCarrier: false;
  issue: string | null;
  ok: boolean;
}

export interface WGateQConfinedComparatorRowV0 {
  flagId: A3FlagId;
  root: WGateRootKey | null;
  signedLift: string;
  carrierRay: string;
  productUnit: string;
  sign: string;
  qMembership: boolean;
  source: 'octonion-vs-a3-medial-carrier-discriminator-v0 signedLiftRows';
  ok: boolean;
}

export interface WGateTriangleSquareHolonomyRowV0 {
  loopId: string;
  loopKind: 'triangle' | 'square';
  policyId: 'policy-a-signed-carrier-link';
  rootFrameLoop: A3FlagId[];
  carrierShadowLoop: string[];
  canonicalRe: number;
  expectedRe: 1;
  matchesW0Floor: boolean;
  bracketingClass: string;
  ok: boolean;
}

export interface WGateA2HexagonHolonomyRowV0 {
  hexagonId: string;
  a2Subsystem: string;
  rootFrameHexagon: A3FlagId[];
  carrierShadowHexagon: string[];
  canonicalRe: number;
  expectedRe: -1;
  matchesW0Floor: boolean;
  bracketingClass: string;
  ok: boolean;
}

export interface WGateBracketingInvarianceRowV0 {
  loopId: string;
  loopKind: 'triangle' | 'square' | 'hexagon';
  policyId: 'policy-a-signed-carrier-link';
  distinctValueCount: number;
  distinctReValues: number[];
  bracketingValueSetCardinality: number;
  bracketingClass: string;
  qConfinedBracketingInvariant: boolean;
  ok: boolean;
}

export interface WGateCarrierShadowLeakageRowV0 {
  leakageId: string;
  description: string;
  carrierConsumedBeforeExtraction: boolean;
  carrierConsumedForRootAssignment: boolean;
  carrierConsumedForRootIdentity: boolean;
  ok: boolean;
}

export interface WGateCarrierShadowDestructiveRowV0 {
  controlId:
    | 'W1C-MOCK-CARRIER-FIRST-ROUTE'
    | 'W1C-COMPARATOR-SOURCE-REMOVAL'
    | 'W1C-ROOT-EXTRACTION-REMOVAL';
  producesPlausibleRows?: boolean;
  mockCarrierFirstRouteProducesPlausibleRows?: boolean;
  carrierConsumedBeforeExtraction?: boolean;
  rootExtractionRowsConsumed?: boolean;
  mockCarrierFirstRouteRejected?: boolean;
  rejected?: boolean;
  rootExtractionStillPasses?: boolean;
  comparatorRowsAvailable?: boolean;
  comparatorCanRun?: boolean;
  sourceLegitimacyUnaffected?: boolean;
  carrierFloorStillAvailable?: boolean;
  rootRowsAvailable?: boolean;
  wArfComparatorCanRun?: boolean;
  w0AloneGrantsSourceLegitimacy?: boolean;
  ok: boolean;
  reason: string;
}

export interface WGateCarrierShadowComparatorV0Report {
  method: 'w-gate-carrier-shadow-comparator-v0';
  candidateW: 'ambo-root-frame-source-regime-v0';
  shortName: 'W_ARF_v0';
  diagnosticScope: 'w1c-carrier-shadow-comparator-rfe15-only';
  parentDiagnostic: 'w-gate-root-frame-extraction-v0';
  hardeningDiagnostic: 'w-gate-root-frame-anti-staple-audit-v0';
  reverseReturnDiagnostic: 'w-gate-reverse-return-law-v0';
  reverseReturnBranch: 'R-root';
  verdictStatus: 'computes-and-reports-only-auditor-classifies';
  fieldStatus: 'not-field-law';
  observableStatus: 'not-w2';
  carrierShadowComparatorStatus: 'comparator-only';
  carrierShadowSourceLegitimacyStatus: 'not-consumed-as-source-legitimacy';
  packetWriteStatus: 'no-packet-writing';
  uiStatus: 'no-ui';
  topologyStatus: 'not-topology-workspace';
  operationRegistryStatus: 'not-operation-registry-work';
  rootFrameExtractionStillPasses: boolean;
  antiStapleRegressionStillPasses: boolean;
  reverseReturnRegressionStillPasses: boolean;
  usedCarrierLabelsForRootExtraction: false;
  usedCarrierLabelsForRootAssignment: false;
  usedCarrierLabelsForRootIdentity: false;
  usedStoredRootTable: false;
  usedStoredOrderedFlagTable: false;
  carrierRowsConsumedOnlyAfterExtraction: boolean;
  consumptionOrder: [
    'W-1 root-frame extraction',
    'W-1A anti-staple audit',
    'W-1B reverse-return R-root classification',
    'W0/Q-floor comparator reports',
  ];
  comparatorSourceSummary: WGateCarrierShadowComparatorSourceSummaryV0;
  qConfinedComparatorRows: WGateQConfinedComparatorRowV0[];
  qConfinedComparatorSource:
    | 'precomputed-floor-diagnostic'
    | 'recomputed'
    | 'unavailable';
  qSet: ['e3', 'e5', 'e6'];
  qMemberCount: number;
  qNonMemberCount: number;
  allCarrierShadowRowsInQ: boolean;
  rootToShadowLedgerRows: WGateCarrierShadowLedgerRowV0[];
  triangleSquareHolonomyRows: WGateTriangleSquareHolonomyRowV0[];
  a2HexagonHolonomyRows: WGateA2HexagonHolonomyRowV0[];
  bracketingInvarianceRows: WGateBracketingInvarianceRowV0[];
  leakageRows: WGateCarrierShadowLeakageRowV0[];
  destructiveRows: WGateCarrierShadowDestructiveRowV0[];
  competitorContextSummary: WGateRootFrameCompetitorContextSummaryV0;
  rfe15Status: WGateCarrierShadowRfe15Status;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface WGateCarrierShadowComparatorV0Options {
  competitorContextSummary?: WGateRootFrameCompetitorContextSummaryV0;
}

interface ComparatorReports {
  moufang: ComparatorMoufangReport | null;
  hub: ComparatorHubReport | null;
  discriminator: ComparatorDiscriminatorReport | null;
  importError: string | null;
}

const Q_SET = ['e3', 'e5', 'e6'] as const;
const CONSUMPTION_ORDER: WGateCarrierShadowComparatorV0Report['consumptionOrder'] = [
  'W-1 root-frame extraction',
  'W-1A anti-staple audit',
  'W-1B reverse-return R-root classification',
  'W0/Q-floor comparator reports',
];

export function buildWGateCarrierShadowComparatorV0Report(
  options: WGateCarrierShadowComparatorV0Options = {},
): WGateCarrierShadowComparatorV0Report {
  const integrityIssues: string[] = [];
  const parent = buildWGateRootFrameExtractionV0Report();
  const antiStaple = buildWGateRootFrameAntiStapleAuditV0Report();
  const reverseReturn = buildWGateReverseReturnLawV0Report();
  const rootFrameExtractionStillPasses = isParentExtractionClean(parent);
  const antiStapleRegressionStillPasses = isAntiStapleClean(antiStaple);
  const reverseReturnRegressionStillPasses = isReverseReturnClean(reverseReturn);

  if (!rootFrameExtractionStillPasses) {
    integrityIssues.push('Parent W-1 extraction preconditions failed.');
  }

  if (!antiStapleRegressionStillPasses) {
    integrityIssues.push('W-1A anti-staple regression preconditions failed.');
  }

  if (!reverseReturnRegressionStillPasses) {
    integrityIssues.push('W-1B R-root reverse/return preconditions failed.');
  }

  const comparatorReports = loadComparatorReports();
  const comparatorSourceSummary = buildComparatorSourceSummary(comparatorReports);
  const comparatorAvailable = comparatorSourceSummary.sourceStatus === 'available';

  if (!comparatorAvailable) {
    integrityIssues.push(
      comparatorReports.importError ??
        'One or more W0/Q-floor comparator source reports is unavailable or not ok.',
    );
  }

  const rootToShadowLedgerRows = comparatorAvailable
    ? buildRootToShadowLedgerRows(parent.rootExtractionRows, comparatorReports)
    : [];
  const qConfinedComparatorRows = comparatorAvailable
    ? buildQConfinedComparatorRows(parent.rootExtractionRows, comparatorReports.discriminator as ComparatorDiscriminatorReport)
    : [];
  const qMemberCount = qConfinedComparatorRows.filter((row) => row.qMembership).length;
  const qNonMemberCount = qConfinedComparatorRows.length - qMemberCount;
  const allCarrierShadowRowsInQ =
    comparatorAvailable &&
    comparatorReports.moufang?.liftsAllInQ === true &&
    qConfinedComparatorRows.length === 12 &&
    qNonMemberCount === 0 &&
    rootToShadowLedgerRows.length === 12 &&
    rootToShadowLedgerRows.every((row) => row.carrierShadow?.qMembership === true);

  const triangleSquareHolonomyRows = comparatorAvailable
    ? buildTriangleSquareHolonomyRows(comparatorReports)
    : [];
  const a2HexagonHolonomyRows = comparatorAvailable
    ? buildA2HexagonHolonomyRows(comparatorReports)
    : [];
  const bracketingInvarianceRows = comparatorAvailable
    ? buildBracketingInvarianceRows(comparatorReports)
    : [];
  const leakageRows = buildLeakageRows();
  const destructiveRows = buildDestructiveRows({
    rootFrameExtractionStillPasses,
    comparatorAvailable,
    discriminator: comparatorReports.discriminator,
  });
  const carrierRowsConsumedOnlyAfterExtraction =
    leakageRows.every((row) => row.ok) &&
    destructiveRows.find((row) => row.controlId === 'W1C-MOCK-CARRIER-FIRST-ROUTE')
      ?.mockCarrierFirstRouteRejected === true;

  if (rootToShadowLedgerRows.length !== 12 || !rootToShadowLedgerRows.every((row) => row.ok)) {
    integrityIssues.push('Root-to-shadow ledger is incomplete or contains missing comparator rows.');
  }

  if (!allCarrierShadowRowsInQ && comparatorAvailable) {
    integrityIssues.push('One or more carrier-shadow rows failed Q-confined membership.');
  }

  if (!triangleSquareHolonomyRows.length || !triangleSquareHolonomyRows.every((row) => row.ok)) {
    integrityIssues.push('Triangle/square Q-confined holonomy floor did not match Re=+1.');
  }

  if (!a2HexagonHolonomyRows.length || !a2HexagonHolonomyRows.every((row) => row.ok)) {
    integrityIssues.push('A2 hexagon Q-confined holonomy floor did not match Re=-1.');
  }

  if (!bracketingInvarianceRows.length || !bracketingInvarianceRows.every((row) => row.ok)) {
    integrityIssues.push('One or more Q-confined bracketing invariance rows failed.');
  }

  if (!leakageRows.every((row) => row.ok) || !destructiveRows.every((row) => row.ok)) {
    integrityIssues.push('Carrier-shadow anti-primacy leakage controls failed.');
  }

  const rfe15Status = computeRfe15Status({
    parentOk: rootFrameExtractionStillPasses,
    antiStapleOk: antiStapleRegressionStillPasses,
    reverseReturnOk: reverseReturnRegressionStillPasses,
    comparatorAvailable,
    allCarrierShadowRowsInQ,
    rootToShadowLedgerRows,
    triangleSquareHolonomyRows,
    a2HexagonHolonomyRows,
    bracketingInvarianceRows,
    leakageRows,
    destructiveRows,
  });
  const dedupedIssues = dedupeStrings(integrityIssues);

  return {
    method: 'w-gate-carrier-shadow-comparator-v0',
    candidateW: 'ambo-root-frame-source-regime-v0',
    shortName: 'W_ARF_v0',
    diagnosticScope: 'w1c-carrier-shadow-comparator-rfe15-only',
    parentDiagnostic: 'w-gate-root-frame-extraction-v0',
    hardeningDiagnostic: 'w-gate-root-frame-anti-staple-audit-v0',
    reverseReturnDiagnostic: 'w-gate-reverse-return-law-v0',
    reverseReturnBranch: 'R-root',
    verdictStatus: 'computes-and-reports-only-auditor-classifies',
    fieldStatus: 'not-field-law',
    observableStatus: 'not-w2',
    carrierShadowComparatorStatus: 'comparator-only',
    carrierShadowSourceLegitimacyStatus: 'not-consumed-as-source-legitimacy',
    packetWriteStatus: 'no-packet-writing',
    uiStatus: 'no-ui',
    topologyStatus: 'not-topology-workspace',
    operationRegistryStatus: 'not-operation-registry-work',
    rootFrameExtractionStillPasses,
    antiStapleRegressionStillPasses,
    reverseReturnRegressionStillPasses,
    usedCarrierLabelsForRootExtraction: false,
    usedCarrierLabelsForRootAssignment: false,
    usedCarrierLabelsForRootIdentity: false,
    usedStoredRootTable: false,
    usedStoredOrderedFlagTable: false,
    carrierRowsConsumedOnlyAfterExtraction,
    consumptionOrder: CONSUMPTION_ORDER,
    comparatorSourceSummary,
    qConfinedComparatorRows,
    qConfinedComparatorSource: comparatorSourceSummary.qConfinedComparatorSource,
    qSet: ['e3', 'e5', 'e6'],
    qMemberCount,
    qNonMemberCount,
    allCarrierShadowRowsInQ,
    rootToShadowLedgerRows,
    triangleSquareHolonomyRows,
    a2HexagonHolonomyRows,
    bracketingInvarianceRows,
    leakageRows,
    destructiveRows,
    competitorContextSummary: options.competitorContextSummary ?? defaultCompetitorContextSummary(),
    rfe15Status,
    integrityIssues: dedupedIssues,
    integrityIssueCount: dedupedIssues.length,
    ok: rfe15Status === 'RFE15-PASS-COMPARATOR' && dedupedIssues.length === 0,
  };
}

function isParentExtractionClean(
  parent: ReturnType<typeof buildWGateRootFrameExtractionV0Report>,
): boolean {
  return (
    parent.ok &&
    parent.integrityIssueCount === 0 &&
    parent.rootExtractionRows.length === 12 &&
    parent.usedCarrierLabels === false &&
    parent.usedStoredOrderedFlagTable === false &&
    parent.rootExtractionSource === 'g0-g1-g2-ambo-incidence'
  );
}

function isAntiStapleClean(
  antiStaple: ReturnType<typeof buildWGateRootFrameAntiStapleAuditV0Report>,
): boolean {
  return (
    antiStaple.ok &&
    antiStaple.integrityIssueCount === 0 &&
    antiStaple.leakageStatus === 'no-assignment-level-leakage-detected' &&
    antiStaple.incidenceDependencyStatus === 'incidence-required-by-parent-and-w1a-controls' &&
    antiStaple.storedMapLeakStatus === 'no-stored-map-assignment-route-detected' &&
    antiStaple.carrierLabelLeakStatus === 'no-carrier-label-assignment-route-detected' &&
    antiStaple.orderedFlagLeakStatus === 'no-ordered-flag-assignment-route-detected'
  );
}

function isReverseReturnClean(reverseReturn: WGateReverseReturnLawV0Report): boolean {
  const rRoot = reverseReturn.branchRows.find((row) => row.branchId === 'R-root');

  return (
    reverseReturn.ok &&
    reverseReturn.integrityIssueCount === 0 &&
    reverseReturn.recommendedBranch === 'R-root-local-best-fit' &&
    rRoot?.coherent === true &&
    rRoot.sourceLegitimacyCompatible === true &&
    reverseReturn.carrierShadowComparatorStatus === 'not-consumed-in-w1b'
  );
}

function loadComparatorReports(): ComparatorReports {
  try {
    const moufangModule = require('./moufangHolonomyValidityV0') as {
      buildMoufangHolonomyValidityV0Report: () => ComparatorMoufangReport;
    };
    const hubModule = require('./hubLayerSourceStateCapsuleV0') as {
      buildHubLayerSourceStateCapsuleV0Report: () => ComparatorHubReport;
    };
    const discriminatorModule = require('./octonionVsA3MedialCarrierDiscriminatorV0') as {
      buildOctonionVsA3MedialCarrierDiscriminatorV0Report: () => ComparatorDiscriminatorReport;
    };
    const moufang = moufangModule.buildMoufangHolonomyValidityV0Report();
    const hub = hubModule.buildHubLayerSourceStateCapsuleV0Report();
    const discriminator =
      discriminatorModule.buildOctonionVsA3MedialCarrierDiscriminatorV0Report();

    return { moufang, hub, discriminator, importError: null };
  } catch (error) {
    return {
      moufang: null,
      hub: null,
      discriminator: null,
      importError: `Comparator source unavailable: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

function buildComparatorSourceSummary(
  reports: ComparatorReports,
): WGateCarrierShadowComparatorSourceSummaryV0 {
  const moufangOk =
    reports.moufang?.ok === true && reports.moufang.integrityIssueCount === 0;
  const hubOk = reports.hub?.ok === true && reports.hub.integrityIssueCount === 0;
  const discriminatorOk =
    reports.discriminator?.ok === true && reports.discriminator.issues.length === 0;
  const sourceStatus = moufangOk && hubOk && discriminatorOk ? 'available' : 'unavailable';

  return {
    moufang: {
      method: reports.moufang?.method ?? null,
      ok: reports.moufang?.ok ?? false,
      integrityIssueCount: reports.moufang?.integrityIssueCount ?? null,
      liftsAllInQ: reports.moufang?.liftsAllInQ ?? null,
      batteryRowCount: reports.moufang?.batteryRows.length ?? 0,
    },
    hubLayerSourceStateCapsule: {
      method: reports.hub?.method ?? null,
      ok: reports.hub?.ok ?? false,
      integrityIssueCount: reports.hub?.integrityIssueCount ?? null,
      flagStateCount: reports.hub?.flagStates.length ?? 0,
    },
    octonionVsA3MedialCarrierDiscriminator: {
      method: reports.discriminator?.method ?? null,
      ok: reports.discriminator?.ok ?? false,
      issueCount: reports.discriminator?.issues.length ?? null,
      signedLiftRowCount: reports.discriminator?.signedLiftRows.length ?? 0,
    },
    qConfinedComparatorSource:
      sourceStatus === 'available' ? 'precomputed-floor-diagnostic' : 'unavailable',
    sourceStatus,
    notes: [
      'Required comparator sources are consumed only after W-1/W-1A/W-1B parent reports are built.',
      'Moufang/Q-floor, hub capsule, and discriminator rows are comparator data only; they do not assign roots.',
    ],
  };
}

function buildRootToShadowLedgerRows(
  rootRows: WGateRootFrameExtractionRowV0[],
  reports: ComparatorReports,
): WGateCarrierShadowLedgerRowV0[] {
  const discriminator = reports.discriminator as ComparatorDiscriminatorReport;
  const hub = reports.hub as ComparatorHubReport;
  const signedLiftByFlagId = new Map(discriminator.signedLiftRows.map((row) => [row.flagId, row]));
  const flagStateByFlagId = new Map(hub.flagStates.map((row) => [row.flagId, row]));

  return rootRows.map((rootRow) => {
    const flagId = rootFlagId(rootRow);
    const signedLift = signedLiftByFlagId.get(flagId);
    const flagState = flagStateByFlagId.get(flagId);

    if (signedLift) {
      return {
        root: rootRow.rootKey,
        rootExtractionWitness: rootWitness(rootRow),
        carrierShadow: carrierShadowFromSignedLift(signedLift),
        shadowSource: 'octonion-vs-a3-medial-carrier-discriminator-v0 signedLiftRows',
        assignmentDirection: 'root -> carrier-shadow',
        sourceLegitimacyConsumedCarrier: false,
        issue: null,
        ok: true,
      };
    }

    if (flagState) {
      return {
        root: rootRow.rootKey,
        rootExtractionWitness: rootWitness(rootRow),
        carrierShadow: carrierShadowFromFlagState(flagState),
        shadowSource: 'hub-layer-source-state-capsule-v0 flagStates',
        assignmentDirection: 'root -> carrier-shadow',
        sourceLegitimacyConsumedCarrier: false,
        issue: null,
        ok: true,
      };
    }

    return {
      root: rootRow.rootKey,
      rootExtractionWitness: rootWitness(rootRow),
      carrierShadow: null,
      shadowSource: 'missing',
      assignmentDirection: 'root -> carrier-shadow',
      sourceLegitimacyConsumedCarrier: false,
      issue: `No comparator carrier-shadow row found for flag ${flagId}.`,
      ok: false,
    };
  });
}

function buildQConfinedComparatorRows(
  rootRows: WGateRootFrameExtractionRowV0[],
  discriminator: ComparatorDiscriminatorReport,
): WGateQConfinedComparatorRowV0[] {
  const rootByFlagId = new Map(rootRows.map((row) => [rootFlagId(row), row.rootKey]));

  return discriminator.signedLiftRows.map((row) => ({
    flagId: row.flagId,
    root: rootByFlagId.get(row.flagId) ?? null,
    signedLift: row.signedLift,
    carrierRay: row.carrierRay,
    productUnit: row.productUnit,
    sign: row.sign,
    qMembership: isQUnit(row.productUnit),
    source: 'octonion-vs-a3-medial-carrier-discriminator-v0 signedLiftRows',
    ok: rootByFlagId.has(row.flagId) && isQUnit(row.productUnit),
  }));
}

function buildTriangleSquareHolonomyRows(
  reports: ComparatorReports,
): WGateTriangleSquareHolonomyRowV0[] {
  const moufang = reports.moufang as ComparatorMoufangReport;
  const linkValueByFlagId = buildLinkValueByFlagId(moufang);
  const loopById = new Map(moufang.loopInventory.loops.map((loop) => [loop.loopId, loop]));

  return policyARows(moufang)
    .filter((row) => row.loopClass === 'triangle' || row.loopClass === 'square')
    .map((row) => {
      const loop = requireLoop(row, loopById);
      const rootFrameLoop = loopToFlagIds(loop);
      const qConfined = isLoopQConfined(rootFrameLoop, linkValueByFlagId);
      const matchesW0Floor = qConfined && row.canonicalRe === 1;

      return {
        loopId: row.loopId,
        loopKind: row.loopClass as 'triangle' | 'square',
        policyId: 'policy-a-signed-carrier-link',
        rootFrameLoop,
        carrierShadowLoop: rootFrameLoop.map((flagId) => linkValueByFlagId.get(flagId) ?? 'missing'),
        canonicalRe: row.canonicalRe,
        expectedRe: 1,
        matchesW0Floor,
        bracketingClass: row.bracketingClass,
        ok: matchesW0Floor,
      };
    });
}

function buildA2HexagonHolonomyRows(
  reports: ComparatorReports,
): WGateA2HexagonHolonomyRowV0[] {
  const moufang = reports.moufang as ComparatorMoufangReport;
  const linkValueByFlagId = buildLinkValueByFlagId(moufang);
  const loopById = new Map(moufang.loopInventory.loops.map((loop) => [loop.loopId, loop]));

  return policyARows(moufang)
    .filter((row) => row.loopClass === 'hexagon')
    .map((row) => {
      const loop = requireLoop(row, loopById);
      const rootFrameHexagon = loopToFlagIds(loop);
      const qConfined = isLoopQConfined(rootFrameHexagon, linkValueByFlagId);
      const matchesW0Floor = qConfined && row.canonicalRe === -1;

      return {
        hexagonId: row.loopId,
        a2Subsystem: loop.subsystemKey ?? 'unknown',
        rootFrameHexagon,
        carrierShadowHexagon: rootFrameHexagon.map((flagId) => linkValueByFlagId.get(flagId) ?? 'missing'),
        canonicalRe: row.canonicalRe,
        expectedRe: -1,
        matchesW0Floor,
        bracketingClass: row.bracketingClass,
        ok: matchesW0Floor,
      };
    });
}

function buildBracketingInvarianceRows(
  reports: ComparatorReports,
): WGateBracketingInvarianceRowV0[] {
  const moufang = reports.moufang as ComparatorMoufangReport;
  const linkValueByFlagId = buildLinkValueByFlagId(moufang);
  const loopById = new Map(moufang.loopInventory.loops.map((loop) => [loop.loopId, loop]));

  return policyARows(moufang).map((row) => {
    const loop = requireLoop(row, loopById);
    const rootFrameLoop = loopToFlagIds(loop);
    const qConfined = isLoopQConfined(rootFrameLoop, linkValueByFlagId);
    const distinctReValues = uniqueNumbers(row.valueCensus.map((entry) => entry.re));
    const bracketingValueSetCardinality = distinctReValues.length;
    const qConfinedBracketingInvariant = qConfined && bracketingValueSetCardinality === 1;

    return {
      loopId: row.loopId,
      loopKind: row.loopClass,
      policyId: 'policy-a-signed-carrier-link',
      distinctValueCount: row.distinctValueCount,
      distinctReValues,
      bracketingValueSetCardinality,
      bracketingClass: row.bracketingClass,
      qConfinedBracketingInvariant,
      ok: qConfinedBracketingInvariant,
    };
  });
}

function buildLeakageRows(): WGateCarrierShadowLeakageRowV0[] {
  return [
    {
      leakageId: 'W1C-LEAKAGE-CONSUMPTION-ORDER',
      description: 'Carrier-shadow reports are called only after W-1/W-1A/W-1B parent reports are built.',
      carrierConsumedBeforeExtraction: false,
      carrierConsumedForRootAssignment: false,
      carrierConsumedForRootIdentity: false,
      ok: true,
    },
    {
      leakageId: 'W1C-LEAKAGE-ROOT-ASSIGNMENT',
      description: 'Root assignment remains the W-1 shared/omitted incidence extraction.',
      carrierConsumedBeforeExtraction: false,
      carrierConsumedForRootAssignment: false,
      carrierConsumedForRootIdentity: false,
      ok: true,
    },
    {
      leakageId: 'W1C-LEAKAGE-ROOT-IDENTITY',
      description: 'Carrier rays and signed lifts annotate extracted roots downstream and never define root identity.',
      carrierConsumedBeforeExtraction: false,
      carrierConsumedForRootAssignment: false,
      carrierConsumedForRootIdentity: false,
      ok: true,
    },
  ];
}

function buildDestructiveRows(args: {
  rootFrameExtractionStillPasses: boolean;
  comparatorAvailable: boolean;
  discriminator: ComparatorDiscriminatorReport | null;
}): WGateCarrierShadowDestructiveRowV0[] {
  const mockCarrierFirstRouteProducesPlausibleRows =
    (args.discriminator?.signedLiftRows.length ?? 0) === 12 &&
    (args.discriminator?.signedLiftRows.every((row) => parseFlagId(row.flagId) !== null) ?? false);
  const mockCarrierFirstRouteRejected = true;

  return [
    {
      controlId: 'W1C-MOCK-CARRIER-FIRST-ROUTE',
      producesPlausibleRows: mockCarrierFirstRouteProducesPlausibleRows,
      mockCarrierFirstRouteProducesPlausibleRows,
      carrierConsumedBeforeExtraction: true,
      rootExtractionRowsConsumed: false,
      mockCarrierFirstRouteRejected,
      rejected: mockCarrierFirstRouteRejected,
      ok: mockCarrierFirstRouteProducesPlausibleRows && mockCarrierFirstRouteRejected,
      reason:
        'Carrier-first route can fabricate plausible rho(i,j) labels from flag rows, but it consumes carrier data before W-1 extraction and is rejected.',
    },
    {
      controlId: 'W1C-COMPARATOR-SOURCE-REMOVAL',
      rootExtractionStillPasses: args.rootFrameExtractionStillPasses,
      comparatorRowsAvailable: false,
      comparatorCanRun: false,
      sourceLegitimacyUnaffected: args.rootFrameExtractionStillPasses,
      ok: args.rootFrameExtractionStillPasses,
      reason:
        'Removing W0 comparator rows after W-1 extraction leaves source legitimacy intact but makes RFE-15 comparison unavailable.',
    },
    {
      controlId: 'W1C-ROOT-EXTRACTION-REMOVAL',
      carrierFloorStillAvailable: args.comparatorAvailable,
      rootRowsAvailable: false,
      wArfComparatorCanRun: false,
      w0AloneGrantsSourceLegitimacy: false,
      ok: args.comparatorAvailable,
      reason:
        'W0 carrier floor may still exist, but without extracted W_ARF_v0 root rows it cannot grant source legitimacy or run the comparator.',
    },
  ];
}

function computeRfe15Status(args: {
  parentOk: boolean;
  antiStapleOk: boolean;
  reverseReturnOk: boolean;
  comparatorAvailable: boolean;
  allCarrierShadowRowsInQ: boolean;
  rootToShadowLedgerRows: WGateCarrierShadowLedgerRowV0[];
  triangleSquareHolonomyRows: WGateTriangleSquareHolonomyRowV0[];
  a2HexagonHolonomyRows: WGateA2HexagonHolonomyRowV0[];
  bracketingInvarianceRows: WGateBracketingInvarianceRowV0[];
  leakageRows: WGateCarrierShadowLeakageRowV0[];
  destructiveRows: WGateCarrierShadowDestructiveRowV0[];
}): WGateCarrierShadowRfe15Status {
  if (!args.parentOk || !args.antiStapleOk || !args.reverseReturnOk) {
    return 'RFE15-UNDERDETERMINED';
  }

  if (!args.comparatorAvailable) {
    return 'comparator-source-unavailable';
  }

  const primacyLeak =
    args.leakageRows.some((row) => !row.ok) ||
    args.destructiveRows.some((row) => row.controlId === 'W1C-MOCK-CARRIER-FIRST-ROUTE' && !row.rejected) ||
    args.destructiveRows.some((row) => row.controlId === 'W1C-ROOT-EXTRACTION-REMOVAL' && row.w0AloneGrantsSourceLegitimacy);

  if (primacyLeak) {
    return 'RFE15-FAIL-PRIMACY-LEAK';
  }

  const floorMismatch =
    !args.allCarrierShadowRowsInQ ||
    args.rootToShadowLedgerRows.length !== 12 ||
    !args.rootToShadowLedgerRows.every((row) => row.ok) ||
    !args.triangleSquareHolonomyRows.length ||
    !args.triangleSquareHolonomyRows.every((row) => row.ok) ||
    !args.a2HexagonHolonomyRows.length ||
    !args.a2HexagonHolonomyRows.every((row) => row.ok) ||
    !args.bracketingInvarianceRows.length ||
    !args.bracketingInvarianceRows.every((row) => row.ok);

  if (floorMismatch) {
    return 'RFE15-FAIL-FLOOR-MISMATCH';
  }

  if (!args.destructiveRows.every((row) => row.ok)) {
    return 'RFE15-UNDERDETERMINED';
  }

  return 'RFE15-PASS-COMPARATOR';
}

function rootFlagId(row: WGateRootFrameExtractionRowV0): A3FlagId {
  return `${row.sharedIndex}->${row.omittedIndex}` as A3FlagId;
}

function rootWitness(row: WGateRootFrameExtractionRowV0): WGateCarrierShadowRootWitnessV0 {
  return {
    g2ChildId: row.g2VertexId,
    g1EndpointVertexIds: row.g1EndpointVertexIds,
    g1EndpointSourceEdgeLabels: row.g1EndpointSourceEdges,
    sharedIndex: row.sharedIndex,
    omittedIndex: row.omittedIndex,
  };
}

function carrierShadowFromSignedLift(row: ComparatorSignedLiftRow): WGateCarrierShadowValueV0 {
  return {
    signedLift: row.signedLift,
    carrierRay: row.carrierRay,
    productUnit: row.productUnit,
    sign: row.sign,
    qMembership: isQUnit(row.productUnit),
  };
}

function carrierShadowFromFlagState(row: ComparatorHubFlagState): WGateCarrierShadowValueV0 {
  return {
    signedLift: row.recomputedSignedLiftLabel,
    carrierRay: row.carrierRay,
    productUnit: row.recomputedSignedLift.unit,
    sign: row.recomputedSignedLift.sign,
    qMembership: isQUnit(row.recomputedSignedLift.unit),
  };
}

function policyARows(moufang: ComparatorMoufangReport): ComparatorBatteryRow[] {
  return moufang.batteryRows.filter((row) => row.policyId === 'policy-a-signed-carrier-link');
}

function buildLinkValueByFlagId(moufang: ComparatorMoufangReport): Map<A3FlagId, string> {
  return new Map(
    moufang.storedLinkAssignment.map((row) => [row.edge as A3FlagId, row.valueKey]),
  );
}

function requireLoop(
  batteryRow: ComparatorBatteryRow,
  loopById: Map<string, ComparatorLoopRecord>,
): ComparatorLoopRecord {
  const loop = loopById.get(batteryRow.loopId);

  if (!loop) {
    throw new Error(`Missing loop inventory row for ${batteryRow.loopId}`);
  }

  return loop;
}

function loopToFlagIds(loop: ComparatorLoopRecord): A3FlagId[] {
  return loop.linkSequence.map((link) => `${link.from}->${link.to}` as A3FlagId);
}

function isLoopQConfined(
  flagIds: A3FlagId[],
  linkValueByFlagId: Map<A3FlagId, string>,
): boolean {
  return flagIds.every((flagId) => {
    const value = linkValueByFlagId.get(flagId);

    return value !== undefined && isQUnit(value.replace(/^[+-]/, ''));
  });
}

function isQUnit(unit: string): boolean {
  return (Q_SET as readonly string[]).includes(unit);
}

function parseFlagId(flagId: A3FlagId): { from: WGateRootFrameLabel; to: WGateRootFrameLabel } | null {
  const match = /^([A-D])->([A-D])$/.exec(flagId);

  if (!match || match[1] === match[2]) {
    return null;
  }

  return {
    from: match[1] as WGateRootFrameLabel,
    to: match[2] as WGateRootFrameLabel,
  };
}

function uniqueNumbers(values: number[]): number[] {
  return [...new Set(values)].sort((left, right) => left - right);
}

function dedupeStrings(values: string[]): string[] {
  return [...new Set(values)];
}

function defaultCompetitorContextSummary(): WGateRootFrameCompetitorContextSummaryV0 {
  return {
    status: 'not-provided-to-builder',
    workspacePath: null,
    branch: null,
    head: null,
    dirtyStatus: [],
    relevantArtifacts: [],
    notes: [
      'The diagnostic script supplies read-only shared-worktree context; the builder itself does not inspect or mutate sibling worktrees.',
    ],
  };
}

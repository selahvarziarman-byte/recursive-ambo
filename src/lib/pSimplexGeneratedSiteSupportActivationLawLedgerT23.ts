import { buildPSimplexA3ResidualOriginDecompositionLedgerT21Report } from './pSimplexA3ResidualOriginDecompositionLedgerT21';
import {
  buildPSimplexGeneratedSiteA3ResidualActivationLedgerT22Report,
  type PSimplexT22SummaryVerdict,
} from './pSimplexGeneratedSiteA3ResidualActivationLedgerT22';
import { buildPSimplexForcingScaleCalibrationReachabilityLedgerT20Report } from './pSimplexForcingScaleCalibrationReachabilityLedgerT20';
import {
  PSIMPLEX_A3_ROOT_DEFINITIONS,
  PSIMPLEX_CHILD_AXIS_DEFINITIONS,
  PSIMPLEX_CHILD_SOURCE_IDS,
  PSIMPLEX_PRIMAL_SOURCE_IDS,
  childAxisDefinition,
  childAxisVector,
  primalSourceVector,
  type PSimplexA3RootId,
  type PSimplexChildEdgeId,
  type PSimplexChildSourceId,
  type PSimplexPrimalSourceId,
} from './pSimplexCoreGeometry';
import {
  addVec3,
  cleanNumber,
  cleanVec3,
  dotVec3,
  normalizeVec3,
  PSIMPLEX_EPSILON,
  scaleVec3,
  subVec3,
  type PSimplexVec3,
} from './pSimplexVectorMath';

export type PSimplexT23Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT23SummaryVerdict =
  | 'law-activated-A3-support-policy-available'
  | 'anchor-gauge-support-policy-available'
  | 'oriented-edge-support-policy-available'
  | 'complement-root-support-policy-available'
  | 'support-policy-available-governance-needed'
  | 'support-policy-failed';
export type PSimplexT23PolicyId = 'P0' | 'P1' | 'P2' | 'P3';
export type PSimplexT23GaugeChoice =
  | 'none'
  | 'anchor-A'
  | 'global-oriented-edge'
  | 'complement-root';
export type PSimplexT23GaugeStatus =
  | 'not-applicable'
  | 'anchor-gauge-selected'
  | 'orientation-gauge-selected'
  | 'complement-gauge-selected';
export type PSimplexT23PolicyRelativeStatus = 'exact-site-baseline' | 'policy-relative';
export type PSimplexT23AntipodalCovarianceStatus = 'holds' | 'fails' | 'not-applicable';
export type PSimplexT23ResponseGroundingStatus = 'not-response-grounding';
export type PSimplexT23Classification =
  | 'exact-site-axis-only'
  | 'law-activated-A3-residual'
  | 'anchor-gauge-A3-activation'
  | 'orientation-gauge-A3-activation'
  | 'complement-gauge-A3-activation'
  | 'antipodal-covariant'
  | 'antipodal-covariance-failed'
  | 'single-sibling-leakage-rejected'
  | 'D3-body-absent'
  | 'unsupported-policy';
export type PSimplexT23RecommendedResearchConsequence =
  | 'support-policy-law-available-response-grounding-still-unresolved'
  | 'support-policy-available-but-governance-needed'
  | 'support-policy-failed-do-not-proceed';

export interface PSimplexT23SiblingPairCertificate {
  certificateId: string;
  certificateSource: 'T21';
  certificateKind: 'same-endpoint-sibling-pair-A3-root';
  identity: 'q_ik + q_il = r_ij' | 'q_jk + q_jl = -r_ij' | 'q_ik + q_jk = r_kl' | 'q_il + q_jl = -r_kl';
  selectedRoot: PSimplexA3RootId;
  selectedRootSign: 1 | -1;
  sourceSiblingPairTerms: PSimplexChildSourceId[];
  singleSiblingLeakage: false;
  ok: boolean;
}

export interface PSimplexT23SupportActivationRow {
  rowId: string;
  policyId: PSimplexT23PolicyId;
  policyLabel: string;
  gaugeChoice: PSimplexT23GaugeChoice;
  gaugeStatus: PSimplexT23GaugeStatus;
  targetChild: PSimplexChildSourceId;
  targetEdge: PSimplexChildEdgeId;
  antipodalChild: PSimplexChildSourceId;
  antipodalEdge: PSimplexChildEdgeId;
  rho: number;
  axisVector: PSimplexVec3;
  selectedA3Root: PSimplexA3RootId | null;
  selectedA3RootNormalized: PSimplexVec3 | null;
  selectedSiblingPairCertificate: PSimplexT23SiblingPairCertificate | null;
  JPolicy: PSimplexVec3;
  axisCoefficient: number;
  a3ResidualCoefficient: number;
  a3Active: boolean;
  axisActive: boolean;
  singleSiblingLeakage: false;
  d3BodyComponent: false;
  antipodalCovarianceStatus: PSimplexT23AntipodalCovarianceStatus;
  classification: PSimplexT23Classification;
  primaryClassification: PSimplexT23Classification;
  secondaryClassifications: PSimplexT23Classification[];
  responseGroundingStatus: PSimplexT23ResponseGroundingStatus;
  policyRelativeStatus: PSimplexT23PolicyRelativeStatus;
  notes: string[];
  ok: boolean;
}

export interface PSimplexT23AntipodalCovarianceRow {
  policyId: PSimplexT23PolicyId;
  rho: number;
  pair: string;
  leftChild: PSimplexChildSourceId;
  rightChild: PSimplexChildSourceId;
  leftA3Root: PSimplexA3RootId | null;
  rightA3Root: PSimplexA3RootId | null;
  a3OppositionHolds: boolean;
  axisOppositionHolds: boolean;
  rhoMatched: boolean;
  antipodalCovarianceStatus: PSimplexT23AntipodalCovarianceStatus;
  ok: boolean;
}

export interface PSimplexT23LeakageResultRow {
  policyId: PSimplexT23PolicyId;
  singleSiblingLeakagePresent: boolean;
  singleSiblingLeakageRejected: boolean;
  allActiveRowsUseSiblingPairCertificates: boolean;
  ok: boolean;
}

export interface PSimplexT23D3BodyAbsenceResultRow {
  policyId: PSimplexT23PolicyId;
  d3BodyComponentPresent: boolean;
  bodyDirectionSource: 'none-by-construction' | 'detected';
  ok: boolean;
}

export interface PSimplexT23ParentEvidenceRow {
  ledgerId: 'T22' | 'T21' | 'T20' | 'C1/C2';
  verdict: string | null;
  ok: boolean;
  integrityIssueCount: number | null;
  carriedFact: string;
}

export interface PSimplexT23GuardRow {
  guardId:
    | 'exactSiteNotRewritten'
    | 'supportPolicySeparatedFromExactEvent'
    | 'lawfulCertificateRequiredForActivation'
    | 'singleSiblingLeakageRejected'
    | 'axisActivityPreserved'
    | 'antipodalCovarianceChecked'
    | 'd3BodyAbsent'
    | 'responseGroundingNotClaimed'
    | 'fieldCueSemanticRouteDefectPacketBoundaryPreserved'
    | 'runtimeSubstrateNotAuthorized';
  status: 'pass' | 'fail';
  evidence: string;
  ok: boolean;
}

export interface PSimplexT23InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT23Report {
  method: 'p-simplex-generated-site-support-activation-law-ledger-t23';
  candidatePackage: 'p-simplex-generated-site-support-activation-law-ledger-t23';
  parentGeneratedSiteActivationLedger: 'p-simplex-generated-site-a3-residual-activation-ledger-t22';
  diagnosticScope: 'support-policy-law-activation-ledger-only';
  solverStatus: 'not-new-solver';
  responseGroundingStatus: 'not-response-grounding';
  runtimeSubstrateStatus: 'not-runtime-substrate-authorization';
  parentEvidenceRows: PSimplexT23ParentEvidenceRow[];
  supportActivationRows: PSimplexT23SupportActivationRow[];
  perPolicyAntipodalCovarianceResult: PSimplexT23AntipodalCovarianceRow[];
  perPolicyLeakageResult: PSimplexT23LeakageResultRow[];
  perPolicyD3BodyAbsenceResult: PSimplexT23D3BodyAbsenceResultRow[];
  summaryVerdict: PSimplexT23SummaryVerdict;
  countsByPolicy: Record<PSimplexT23PolicyId, number>;
  countsByRho: Record<string, number>;
  countsByPrimaryClassification: Record<PSimplexT23Classification, number>;
  countsBySecondaryClassification: Record<PSimplexT23Classification, number>;
  lawActivatedA3SupportPolicyAvailable: boolean;
  coherentPolicyFamilies: PSimplexT23PolicyId[];
  policyFamiliesNeedingGovernance: PSimplexT23PolicyId[];
  recommendedResearchConsequence: PSimplexT23RecommendedResearchConsequence;
  guardRows: PSimplexT23GuardRow[];
  invalidInterpretationBoundaryRows: PSimplexT23InvalidInterpretationBoundaryRow[];
  verdict: PSimplexT23Verdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface ParentReports {
  t22: ReturnType<typeof buildPSimplexGeneratedSiteA3ResidualActivationLedgerT22Report>;
  t21: ReturnType<typeof buildPSimplexA3ResidualOriginDecompositionLedgerT21Report>;
  t20: ReturnType<typeof buildPSimplexForcingScaleCalibrationReachabilityLedgerT20Report>;
}

interface TargetContext {
  targetChild: PSimplexChildSourceId;
  targetEdge: PSimplexChildEdgeId;
  antipodalChild: PSimplexChildSourceId;
  antipodalEdge: PSimplexChildEdgeId;
  i: PSimplexPrimalSourceId;
  j: PSimplexPrimalSourceId;
  k: PSimplexPrimalSourceId;
  l: PSimplexPrimalSourceId;
  axisVector: PSimplexVec3;
  rij: PSimplexVec3;
  rkl: PSimplexVec3;
}

interface PolicySpec {
  policyId: PSimplexT23PolicyId;
  policyLabel: string;
  gaugeChoice: PSimplexT23GaugeChoice;
  gaugeStatus: PSimplexT23GaugeStatus;
  policyRelativeStatus: PSimplexT23PolicyRelativeStatus;
}

interface RootSelection {
  selectedA3Root: PSimplexA3RootId;
  selectedA3RootNormalized: PSimplexVec3;
  selectedSiblingPairCertificate: PSimplexT23SiblingPairCertificate;
}

const RHO_VALUES = [0, 0.25, 0.5, 1] as const;
const POLICY_SPECS: readonly PolicySpec[] = [
  {
    policyId: 'P0',
    policyLabel: 'exact-site baseline',
    gaugeChoice: 'none',
    gaugeStatus: 'not-applicable',
    policyRelativeStatus: 'exact-site-baseline',
  },
  {
    policyId: 'P1',
    policyLabel: 'anchor-vertex sibling-fan policy',
    gaugeChoice: 'anchor-A',
    gaugeStatus: 'anchor-gauge-selected',
    policyRelativeStatus: 'policy-relative',
  },
  {
    policyId: 'P2',
    policyLabel: 'oriented-edge sibling-fan policy',
    gaugeChoice: 'global-oriented-edge',
    gaugeStatus: 'orientation-gauge-selected',
    policyRelativeStatus: 'policy-relative',
  },
  {
    policyId: 'P3',
    policyLabel: 'complement-root sibling-fan policy',
    gaugeChoice: 'complement-root',
    gaugeStatus: 'complement-gauge-selected',
    policyRelativeStatus: 'policy-relative',
  },
];
const POLICY_IDS: readonly PSimplexT23PolicyId[] = ['P0', 'P1', 'P2', 'P3'];
const CLASSIFICATIONS: readonly PSimplexT23Classification[] = [
  'exact-site-axis-only',
  'law-activated-A3-residual',
  'anchor-gauge-A3-activation',
  'orientation-gauge-A3-activation',
  'complement-gauge-A3-activation',
  'antipodal-covariant',
  'antipodal-covariance-failed',
  'single-sibling-leakage-rejected',
  'D3-body-absent',
  'unsupported-policy',
];
const ANTIPODAL_CHILD_BY_ID: Record<PSimplexChildSourceId, PSimplexChildSourceId> = {
  M_AB: 'M_CD',
  M_AC: 'M_BD',
  M_AD: 'M_BC',
  M_BC: 'M_AD',
  M_BD: 'M_AC',
  M_CD: 'M_AB',
};
const ANTIPODAL_PAIRS: ReadonlyArray<[PSimplexChildSourceId, PSimplexChildSourceId]> = [
  ['M_AB', 'M_CD'],
  ['M_AC', 'M_BD'],
  ['M_AD', 'M_BC'],
];
const ANCHOR_A_ROOT_BY_CHILD: Record<PSimplexChildSourceId, PSimplexA3RootId> = {
  M_AB: 'r_AB',
  M_AC: 'r_AC',
  M_AD: 'r_AD',
  M_BC: 'r_DA',
  M_BD: 'r_CA',
  M_CD: 'r_BA',
};
const COMPLEMENT_ROOT_BY_CHILD: Record<PSimplexChildSourceId, PSimplexA3RootId> = {
  M_AB: 'r_CD',
  M_AC: 'r_BD',
  M_AD: 'r_BC',
  M_BC: 'r_CB',
  M_BD: 'r_DB',
  M_CD: 'r_DC',
};

export function buildPSimplexGeneratedSiteSupportActivationLawLedgerT23Report(): PSimplexT23Report {
  const parentReports = buildParentReports();
  const targetContexts = PSIMPLEX_CHILD_SOURCE_IDS.map(buildTargetContext);
  const supportActivationRows = POLICY_SPECS.flatMap((policy) =>
    targetContexts.flatMap((context) => RHO_VALUES.map((rho) => buildSupportActivationRow(policy, context, rho, parentReports))),
  );
  const perPolicyAntipodalCovarianceResult = buildAntipodalCovarianceRows(supportActivationRows);
  const perPolicyLeakageResult = buildLeakageRows(supportActivationRows);
  const perPolicyD3BodyAbsenceResult = buildD3BodyAbsenceRows(supportActivationRows);
  const parentEvidenceRows = buildParentEvidenceRows(parentReports);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const coherentPolicyFamilies = buildCoherentPolicyFamilies({
    supportActivationRows,
    perPolicyAntipodalCovarianceResult,
    perPolicyLeakageResult,
    perPolicyD3BodyAbsenceResult,
  });
  const policyFamiliesNeedingGovernance = coherentPolicyFamilies.filter((policyId) => policyId === 'P1' || policyId === 'P3');
  const lawActivatedA3SupportPolicyAvailable = coherentPolicyFamilies.length > 0;
  const guardRows = buildGuardRows({
    parentReports,
    supportActivationRows,
    perPolicyAntipodalCovarianceResult,
    perPolicyLeakageResult,
    perPolicyD3BodyAbsenceResult,
    invalidInterpretationBoundaryRows,
  });
  const countsByPolicy = countByValues(supportActivationRows, POLICY_IDS, (row) => row.policyId);
  const countsByRho = countByRhoValues(supportActivationRows);
  const countsByPrimaryClassification = countByValues(supportActivationRows, CLASSIFICATIONS, (row) => row.primaryClassification);
  const countsBySecondaryClassification = countSecondaryClassifications(supportActivationRows);
  const integrityIssues = buildIntegrityIssues({
    parentReports,
    parentEvidenceRows,
    supportActivationRows,
    perPolicyAntipodalCovarianceResult,
    perPolicyLeakageResult,
    perPolicyD3BodyAbsenceResult,
    coherentPolicyFamilies,
    guardRows,
    countsByPolicy,
    countsByRho,
  });
  const summaryVerdict = classifySummaryVerdict(coherentPolicyFamilies, policyFamiliesNeedingGovernance, integrityIssues);
  const verdict = classifyVerdict(integrityIssues, lawActivatedA3SupportPolicyAvailable, policyFamiliesNeedingGovernance);
  const recommendedResearchConsequence = recommendationForVerdict(verdict, policyFamiliesNeedingGovernance);

  return {
    method: 'p-simplex-generated-site-support-activation-law-ledger-t23',
    candidatePackage: 'p-simplex-generated-site-support-activation-law-ledger-t23',
    parentGeneratedSiteActivationLedger: 'p-simplex-generated-site-a3-residual-activation-ledger-t22',
    diagnosticScope: 'support-policy-law-activation-ledger-only',
    solverStatus: 'not-new-solver',
    responseGroundingStatus: 'not-response-grounding',
    runtimeSubstrateStatus: 'not-runtime-substrate-authorization',
    parentEvidenceRows,
    supportActivationRows,
    perPolicyAntipodalCovarianceResult,
    perPolicyLeakageResult,
    perPolicyD3BodyAbsenceResult,
    summaryVerdict,
    countsByPolicy,
    countsByRho,
    countsByPrimaryClassification,
    countsBySecondaryClassification,
    lawActivatedA3SupportPolicyAvailable,
    coherentPolicyFamilies,
    policyFamiliesNeedingGovernance,
    recommendedResearchConsequence,
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
    t22: buildPSimplexGeneratedSiteA3ResidualActivationLedgerT22Report(),
    t21: buildPSimplexA3ResidualOriginDecompositionLedgerT21Report(),
    t20: buildPSimplexForcingScaleCalibrationReachabilityLedgerT20Report(),
  };
}

function buildSupportActivationRow(
  policy: PolicySpec,
  context: TargetContext,
  rho: number,
  parentReports: ParentReports,
): PSimplexT23SupportActivationRow {
  const rootSelection = selectRootForPolicy(policy.policyId, context, parentReports);
  const selectedA3RootNormalized = rootSelection?.selectedA3RootNormalized ?? null;
  const axisCoefficient = 1;
  const a3ResidualCoefficient = rootSelection && rho > PSIMPLEX_EPSILON ? rho : 0;
  const JPolicy = cleanVec3(
    selectedA3RootNormalized
      ? addVec3(context.axisVector, scaleVec3(selectedA3RootNormalized, a3ResidualCoefficient))
      : context.axisVector,
  );
  const a3Active = Boolean(rootSelection && rho > PSIMPLEX_EPSILON && rootSelection.selectedSiblingPairCertificate.ok);
  const axisActive = Math.abs(axisCoefficient) > PSIMPLEX_EPSILON;
  const antipodalCovarianceStatus = policy.policyId === 'P0' ? 'not-applicable' : policyRootOppositionHolds(policy.policyId, context.targetChild) ? 'holds' : 'fails';
  const primaryClassification = primaryClassificationFor(policy.policyId, rho);
  const secondaryClassifications = secondaryClassificationsFor(policy.policyId, rho, antipodalCovarianceStatus);
  const row: Omit<PSimplexT23SupportActivationRow, 'ok'> = {
    rowId: `T23-${policy.policyId}-${context.targetChild}-rho-${rhoToken(rho)}`,
    policyId: policy.policyId,
    policyLabel: policy.policyLabel,
    gaugeChoice: policy.gaugeChoice,
    gaugeStatus: policy.gaugeStatus,
    targetChild: context.targetChild,
    targetEdge: context.targetEdge,
    antipodalChild: context.antipodalChild,
    antipodalEdge: context.antipodalEdge,
    rho: cleanNumber(rho),
    axisVector: context.axisVector,
    selectedA3Root: rootSelection?.selectedA3Root ?? null,
    selectedA3RootNormalized,
    selectedSiblingPairCertificate: rootSelection?.selectedSiblingPairCertificate ?? null,
    JPolicy,
    axisCoefficient,
    a3ResidualCoefficient: cleanNumber(a3ResidualCoefficient),
    a3Active,
    axisActive,
    singleSiblingLeakage: false,
    d3BodyComponent: false,
    antipodalCovarianceStatus,
    classification: primaryClassification,
    primaryClassification,
    secondaryClassifications,
    responseGroundingStatus: 'not-response-grounding',
    policyRelativeStatus: policy.policyRelativeStatus,
    notes: notesForRow(policy.policyId, rho, a3Active),
  };

  return {
    ...row,
    ok: supportActivationRowPasses(row),
  };
}

function supportActivationRowPasses(row: Omit<PSimplexT23SupportActivationRow, 'ok'>): boolean {
  if (!row.axisActive || row.singleSiblingLeakage || row.d3BodyComponent) {
    return false;
  }

  if (row.responseGroundingStatus !== 'not-response-grounding') {
    return false;
  }

  if (row.policyId === 'P0') {
    return (
      row.policyRelativeStatus === 'exact-site-baseline' &&
      !row.a3Active &&
      row.selectedA3Root === null &&
      row.selectedSiblingPairCertificate === null &&
      row.primaryClassification === 'exact-site-axis-only'
    );
  }

  if (row.policyRelativeStatus !== 'policy-relative' || row.antipodalCovarianceStatus !== 'holds') {
    return false;
  }

  if (row.rho <= PSIMPLEX_EPSILON) {
    return !row.a3Active && row.a3ResidualCoefficient === 0 && row.selectedSiblingPairCertificate?.ok === true;
  }

  return (
    row.a3Active &&
    row.a3ResidualCoefficient > PSIMPLEX_EPSILON &&
    row.selectedSiblingPairCertificate?.ok === true &&
    row.selectedSiblingPairCertificate.singleSiblingLeakage === false
  );
}

function selectRootForPolicy(
  policyId: PSimplexT23PolicyId,
  context: TargetContext,
  parentReports: ParentReports,
): RootSelection | null {
  if (policyId === 'P0') {
    return null;
  }

  const selectedA3Root =
    policyId === 'P3' ? COMPLEMENT_ROOT_BY_CHILD[context.targetChild] : ANCHOR_A_ROOT_BY_CHILD[context.targetChild];
  const selectedA3RootNormalized = rootVectorForRootId(selectedA3Root);
  const selectedSiblingPairCertificate = buildSiblingPairCertificate(context, selectedA3Root, parentReports);

  return {
    selectedA3Root,
    selectedA3RootNormalized,
    selectedSiblingPairCertificate,
  };
}

function buildSiblingPairCertificate(
  context: TargetContext,
  selectedRoot: PSimplexA3RootId,
  parentReports: ParentReports,
): PSimplexT23SiblingPairCertificate {
  const relation = relationForSelectedRoot(context, selectedRoot);
  const auditRow = parentReports.t21.siblingPairLawAuditRows.find(
    (row) => row.targetChild === context.targetChild && row.identity === relation.identity,
  );

  return {
    certificateId: `T21-${context.targetChild}-${relation.identity.replace(/[^A-Za-z0-9]+/g, '-')}-${selectedRoot}`,
    certificateSource: 'T21',
    certificateKind: 'same-endpoint-sibling-pair-A3-root',
    identity: relation.identity,
    selectedRoot,
    selectedRootSign: relation.selectedRootSign,
    sourceSiblingPairTerms: relation.sourceSiblingPairTerms,
    singleSiblingLeakage: false,
    ok: Boolean(auditRow?.ok && relation.ok && relation.sourceSiblingPairTerms.length === 2),
  };
}

function relationForSelectedRoot(
  context: TargetContext,
  selectedRoot: PSimplexA3RootId,
): {
  identity: PSimplexT23SiblingPairCertificate['identity'];
  selectedRootSign: 1 | -1;
  sourceSiblingPairTerms: PSimplexChildSourceId[];
  ok: boolean;
} {
  const selected = rootVectorForRootId(selectedRoot);
  const targetPositive = normalizedAlignment(selected, context.rij) > 1 - PSIMPLEX_EPSILON;
  const targetNegative = normalizedAlignment(selected, scaleVec3(context.rij, -1)) > 1 - PSIMPLEX_EPSILON;
  const complementPositive = normalizedAlignment(selected, context.rkl) > 1 - PSIMPLEX_EPSILON;
  const complementNegative = normalizedAlignment(selected, scaleVec3(context.rkl, -1)) > 1 - PSIMPLEX_EPSILON;

  if (targetPositive) {
    return {
      identity: 'q_ik + q_il = r_ij',
      selectedRootSign: 1,
      sourceSiblingPairTerms: [childIdFromEndpoints(context.i, context.k), childIdFromEndpoints(context.i, context.l)],
      ok: true,
    };
  }

  if (targetNegative) {
    return {
      identity: 'q_jk + q_jl = -r_ij',
      selectedRootSign: -1,
      sourceSiblingPairTerms: [childIdFromEndpoints(context.j, context.k), childIdFromEndpoints(context.j, context.l)],
      ok: true,
    };
  }

  if (complementPositive) {
    return {
      identity: 'q_ik + q_jk = r_kl',
      selectedRootSign: 1,
      sourceSiblingPairTerms: [childIdFromEndpoints(context.i, context.k), childIdFromEndpoints(context.j, context.k)],
      ok: true,
    };
  }

  if (complementNegative) {
    return {
      identity: 'q_il + q_jl = -r_kl',
      selectedRootSign: -1,
      sourceSiblingPairTerms: [childIdFromEndpoints(context.i, context.l), childIdFromEndpoints(context.j, context.l)],
      ok: true,
    };
  }

  return {
    identity: 'q_ik + q_il = r_ij',
    selectedRootSign: 1,
    sourceSiblingPairTerms: [],
    ok: false,
  };
}

function buildAntipodalCovarianceRows(rows: readonly PSimplexT23SupportActivationRow[]): PSimplexT23AntipodalCovarianceRow[] {
  return POLICY_IDS.flatMap((policyId) =>
    RHO_VALUES.flatMap((rho) =>
      ANTIPODAL_PAIRS.map(([leftChild, rightChild]) => {
        const left = rows.find((row) => row.policyId === policyId && row.targetChild === leftChild && row.rho === cleanNumber(rho));
        const right = rows.find((row) => row.policyId === policyId && row.targetChild === rightChild && row.rho === cleanNumber(rho));
        const axisOppositionHolds = Boolean(left && right && vectorOppositionHolds(left.axisVector, right.axisVector));
        const a3OppositionHolds =
          policyId === 'P0'
            ? false
            : Boolean(left?.selectedA3RootNormalized && right?.selectedA3RootNormalized && vectorOppositionHolds(left.selectedA3RootNormalized, right.selectedA3RootNormalized));
        const rhoMatched = Boolean(left && right && Math.abs(left.rho - right.rho) <= PSIMPLEX_EPSILON);
        const antipodalCovarianceStatus =
          policyId === 'P0' ? 'not-applicable' : axisOppositionHolds && a3OppositionHolds && rhoMatched ? 'holds' : 'fails';

        return {
          policyId,
          rho: cleanNumber(rho),
          pair: `${leftChild}<->${rightChild}`,
          leftChild,
          rightChild,
          leftA3Root: left?.selectedA3Root ?? null,
          rightA3Root: right?.selectedA3Root ?? null,
          a3OppositionHolds,
          axisOppositionHolds,
          rhoMatched,
          antipodalCovarianceStatus,
          ok: policyId === 'P0' ? axisOppositionHolds && rhoMatched : antipodalCovarianceStatus === 'holds',
        };
      }),
    ),
  );
}

function buildLeakageRows(rows: readonly PSimplexT23SupportActivationRow[]): PSimplexT23LeakageResultRow[] {
  return POLICY_IDS.map((policyId) => {
    const policyRows = rows.filter((row) => row.policyId === policyId);
    const activeRows = policyRows.filter((row) => row.a3Active);
    const allActiveRowsUseSiblingPairCertificates = activeRows.every(
      (row) =>
        row.selectedSiblingPairCertificate?.ok === true &&
        row.selectedSiblingPairCertificate.certificateKind === 'same-endpoint-sibling-pair-A3-root' &&
        row.selectedSiblingPairCertificate.sourceSiblingPairTerms.length === 2,
    );
    const singleSiblingLeakagePresent = policyRows.some((row) => row.singleSiblingLeakage);

    return {
      policyId,
      singleSiblingLeakagePresent,
      singleSiblingLeakageRejected: !singleSiblingLeakagePresent,
      allActiveRowsUseSiblingPairCertificates,
      ok: !singleSiblingLeakagePresent && allActiveRowsUseSiblingPairCertificates,
    };
  });
}

function buildD3BodyAbsenceRows(rows: readonly PSimplexT23SupportActivationRow[]): PSimplexT23D3BodyAbsenceResultRow[] {
  return POLICY_IDS.map((policyId) => {
    const d3BodyComponentPresent = rows.some((row) => row.policyId === policyId && row.d3BodyComponent);

    return {
      policyId,
      d3BodyComponentPresent,
      bodyDirectionSource: d3BodyComponentPresent ? 'detected' : 'none-by-construction',
      ok: !d3BodyComponentPresent,
    };
  });
}

function buildParentEvidenceRows(parentReports: ParentReports): PSimplexT23ParentEvidenceRow[] {
  return [
    {
      ledgerId: 'T22',
      verdict: parentReports.t22.verdict,
      ok:
        parentReports.t22.ok &&
        parentReports.t22.integrityIssueCount === 0 &&
        parentReports.t22.summaryVerdict === 'A3-event-inactive-but-lawful' &&
        parentReports.t22.a3ResidualEventActive === false &&
        parentReports.t22.a3RemainsOnlyAlgebraicallyAvailable === true,
      integrityIssueCount: parentReports.t22.integrityIssueCount,
      carriedFact:
        'exact-site event A3 inactive; A3 remains algebraically available; response grounding unresolved.',
    },
    {
      ledgerId: 'T21',
      verdict: parentReports.t21.verdict,
      ok:
        parentReports.t21.ok &&
        parentReports.t21.integrityIssueCount === 0 &&
        parentReports.t21.a3ResidualOriginLawEstablished,
      integrityIssueCount: parentReports.t21.integrityIssueCount,
      carriedFact:
        'lawful A3 residual-origin law established for endpoint split, complement split, and sibling-pair origins.',
    },
    {
      ledgerId: 'T20',
      verdict: parentReports.t20.verdict,
      ok: parentReports.t20.ok && parentReports.t20.integrityIssueCount === 0,
      integrityIssueCount: parentReports.t20.integrityIssueCount,
      carriedFact:
        'source-magnitude-evidence-incomplete; A3 residual reachability does not imply A3 response reachability.',
    },
    {
      ledgerId: 'C1/C2',
      verdict: null,
      ok: true,
      integrityIssueCount: null,
      carriedFact: 'closed axis + provisional A3; D3 quarantined; D4/T diagnostic-only.',
    },
  ];
}

function buildCoherentPolicyFamilies(args: {
  supportActivationRows: readonly PSimplexT23SupportActivationRow[];
  perPolicyAntipodalCovarianceResult: readonly PSimplexT23AntipodalCovarianceRow[];
  perPolicyLeakageResult: readonly PSimplexT23LeakageResultRow[];
  perPolicyD3BodyAbsenceResult: readonly PSimplexT23D3BodyAbsenceResultRow[];
}): PSimplexT23PolicyId[] {
  return (['P1', 'P2', 'P3'] as const).filter((policyId) => {
    const activeRows = args.supportActivationRows.filter((row) => row.policyId === policyId && row.rho > PSIMPLEX_EPSILON);
    const activeChildren = new Set(activeRows.filter((row) => row.a3Active && row.ok).map((row) => row.targetChild));
    const covarianceOk = args.perPolicyAntipodalCovarianceResult
      .filter((row) => row.policyId === policyId && row.rho > PSIMPLEX_EPSILON)
      .every((row) => row.ok && row.antipodalCovarianceStatus === 'holds');
    const leakageOk = args.perPolicyLeakageResult.find((row) => row.policyId === policyId)?.ok === true;
    const d3Ok = args.perPolicyD3BodyAbsenceResult.find((row) => row.policyId === policyId)?.ok === true;

    return activeRows.length === 18 && activeChildren.size === 6 && covarianceOk && leakageOk && d3Ok;
  });
}

function buildGuardRows(args: {
  parentReports: ParentReports;
  supportActivationRows: readonly PSimplexT23SupportActivationRow[];
  perPolicyAntipodalCovarianceResult: readonly PSimplexT23AntipodalCovarianceRow[];
  perPolicyLeakageResult: readonly PSimplexT23LeakageResultRow[];
  perPolicyD3BodyAbsenceResult: readonly PSimplexT23D3BodyAbsenceResultRow[];
  invalidInterpretationBoundaryRows: readonly PSimplexT23InvalidInterpretationBoundaryRow[];
}): PSimplexT23GuardRow[] {
  const p0Rows = args.supportActivationRows.filter((row) => row.policyId === 'P0');
  const supportRows = args.supportActivationRows.filter((row) => row.policyId !== 'P0');
  const exactSiteNotRewritten =
    args.parentReports.t22.summaryVerdict === ('A3-event-inactive-but-lawful' satisfies PSimplexT22SummaryVerdict) &&
    p0Rows.length === 24 &&
    p0Rows.every((row) => !row.a3Active && row.primaryClassification === 'exact-site-axis-only');
  const supportSeparated = supportRows.every((row) => row.policyRelativeStatus === 'policy-relative');
  const certificateRequired = supportRows
    .filter((row) => row.a3Active)
    .every((row) => row.selectedSiblingPairCertificate?.ok === true);
  const leakageRejected = args.perPolicyLeakageResult.every((row) => row.ok && row.singleSiblingLeakageRejected);
  const axisPreserved = args.supportActivationRows.every((row) => row.axisActive);
  const covarianceChecked =
    args.perPolicyAntipodalCovarianceResult.length === POLICY_IDS.length * RHO_VALUES.length * ANTIPODAL_PAIRS.length &&
    args.perPolicyAntipodalCovarianceResult
      .filter((row) => row.policyId !== 'P0')
      .every((row) => row.antipodalCovarianceStatus === 'holds' && row.ok);
  const d3Absent = args.perPolicyD3BodyAbsenceResult.every((row) => row.ok && !row.d3BodyComponentPresent);
  const responseGroundingNotClaimed = args.supportActivationRows.every(
    (row) => row.responseGroundingStatus === 'not-response-grounding',
  );

  return [
    guardRow('exactSiteNotRewritten', exactSiteNotRewritten, 'P0 preserves the T22 exact-site axis-only result.'),
    guardRow(
      'supportPolicySeparatedFromExactEvent',
      supportSeparated,
      'P1/P2/P3 rows are policy-relative and do not rewrite exact-site event activity.',
    ),
    guardRow(
      'lawfulCertificateRequiredForActivation',
      certificateRequired,
      'Every active A3 support row carries a valid T21 sibling-pair certificate.',
    ),
    guardRow(
      'singleSiblingLeakageRejected',
      leakageRejected,
      'No active support row uses a single sibling term.',
    ),
    guardRow('axisActivityPreserved', axisPreserved, 'All policy rows keep the axis coefficient nonzero.'),
    guardRow(
      'antipodalCovarianceChecked',
      covarianceChecked,
      'All support policies are checked across all three antipodal child pairs and all rho values.',
    ),
    guardRow(
      'd3BodyAbsent',
      d3Absent,
      'Policy drives use only axis direction plus a certified A3 root; no D3/body term is introduced.',
    ),
    guardRow(
      'responseGroundingNotClaimed',
      responseGroundingNotClaimed,
      'Rows remain support-activation source-drive law checks only.',
    ),
    guardRow(
      'fieldCueSemanticRouteDefectPacketBoundaryPreserved',
      args.invalidInterpretationBoundaryRows.every((row) => row.enforced),
      'Forbidden interpretation boundary rows are explicit and negative.',
    ),
    guardRow(
      'runtimeSubstrateNotAuthorized',
      true,
      'T23 does not authorize runtime substrate extraction or adoption of a support policy.',
    ),
  ];
}

function guardRow(guardId: PSimplexT23GuardRow['guardId'], ok: boolean, evidence: string): PSimplexT23GuardRow {
  return {
    guardId,
    status: ok ? 'pass' : 'fail',
    evidence,
    ok,
  };
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT23InvalidInterpretationBoundaryRow[] {
  return [
    {
      boundaryId: 'not-natural-exact-site-activity',
      statement: 'Negative boundary: T23 does not claim A3 was naturally active at the exact site.',
      enforced: true,
    },
    {
      boundaryId: 'not-closed-or-grounded-response',
      statement: 'Negative boundary: T23 does not claim A3 response is closed or operationally grounded.',
      enforced: true,
    },
    {
      boundaryId: 'not-fieldcue-semantic-route-defect-packet-rendering',
      statement:
        'Negative boundary: A3 residual is not FieldCue, semantic meaning, route/walk/holonomy, defect/vortex behavior, packet interpretation, or rendering behavior.',
      enforced: true,
    },
    {
      boundaryId: 'not-runtime-substrate-authorization',
      statement:
        'Negative boundary: this diagnostic does not authorize runtime substrate extraction and no support policy is adopted by runtime.',
      enforced: true,
    },
  ];
}

function buildIntegrityIssues(args: {
  parentReports: ParentReports;
  parentEvidenceRows: readonly PSimplexT23ParentEvidenceRow[];
  supportActivationRows: readonly PSimplexT23SupportActivationRow[];
  perPolicyAntipodalCovarianceResult: readonly PSimplexT23AntipodalCovarianceRow[];
  perPolicyLeakageResult: readonly PSimplexT23LeakageResultRow[];
  perPolicyD3BodyAbsenceResult: readonly PSimplexT23D3BodyAbsenceResultRow[];
  coherentPolicyFamilies: readonly PSimplexT23PolicyId[];
  guardRows: readonly PSimplexT23GuardRow[];
  countsByPolicy: Record<PSimplexT23PolicyId, number>;
  countsByRho: Record<string, number>;
}): string[] {
  const issues: string[] = [];

  if (args.parentEvidenceRows.some((row) => !row.ok)) {
    issues.push('At least one required parent evidence row is unavailable.');
  }

  if (args.parentReports.t22.summaryVerdict !== 'A3-event-inactive-but-lawful' || args.parentReports.t22.a3ResidualEventActive) {
    issues.push('T22 exact-site inactive result was not preserved.');
  }

  if (!args.parentReports.t21.a3ResidualOriginLawEstablished) {
    issues.push('T21 lawful A3 residual-origin law is unavailable.');
  }

  if (args.parentReports.t20.finalRecommendation !== 'source-magnitude-evidence-incomplete') {
    issues.push('T20 source-magnitude evidence boundary is not carried forward.');
  }

  if (args.supportActivationRows.length !== POLICY_IDS.length * PSIMPLEX_CHILD_SOURCE_IDS.length * RHO_VALUES.length) {
    issues.push(`Expected 96 support activation rows, got ${args.supportActivationRows.length}.`);
  }

  for (const policyId of POLICY_IDS) {
    if (args.countsByPolicy[policyId] !== PSIMPLEX_CHILD_SOURCE_IDS.length * RHO_VALUES.length) {
      issues.push(`Policy ${policyId} does not cover all children and rho values.`);
    }
  }

  for (const rho of RHO_VALUES) {
    if (args.countsByRho[rhoKey(rho)] !== POLICY_IDS.length * PSIMPLEX_CHILD_SOURCE_IDS.length) {
      issues.push(`Rho ${rho} does not cover all policies and children.`);
    }
  }

  if (args.supportActivationRows.some((row) => !row.ok)) {
    issues.push('At least one support activation row failed its local policy-law check.');
  }

  const activeRows = args.supportActivationRows.filter((row) => row.a3Active);
  if (activeRows.some((row) => row.selectedSiblingPairCertificate?.ok !== true)) {
    issues.push('At least one active A3 row lacks a valid sibling-pair certificate.');
  }

  if (args.supportActivationRows.some((row) => row.singleSiblingLeakage)) {
    issues.push('Single sibling leakage appeared in a support policy row.');
  }

  if (args.supportActivationRows.some((row) => row.d3BodyComponent)) {
    issues.push('A D3/body component appeared in a support policy row.');
  }

  if (args.coherentPolicyFamilies.length === 0) {
    issues.push('No support policy family satisfied activation, covariance, leakage, and D3/body absence checks.');
  }

  if (args.perPolicyAntipodalCovarianceResult.filter((row) => row.policyId !== 'P0').some((row) => !row.ok)) {
    issues.push('At least one support policy antipodal covariance row failed.');
  }

  if (args.perPolicyLeakageResult.some((row) => !row.ok)) {
    issues.push('At least one leakage result row failed.');
  }

  if (args.perPolicyD3BodyAbsenceResult.some((row) => !row.ok)) {
    issues.push('At least one D3/body absence row failed.');
  }

  if (args.guardRows.some((row) => !row.ok)) {
    issues.push('At least one required T23 guard failed.');
  }

  return [...new Set(issues)];
}

function classifySummaryVerdict(
  coherentPolicyFamilies: readonly PSimplexT23PolicyId[],
  policyFamiliesNeedingGovernance: readonly PSimplexT23PolicyId[],
  integrityIssues: readonly string[],
): PSimplexT23SummaryVerdict {
  if (integrityIssues.length > 0 || coherentPolicyFamilies.length === 0) {
    return 'support-policy-failed';
  }

  if (coherentPolicyFamilies.some((policyId) => !policyFamiliesNeedingGovernance.includes(policyId))) {
    return 'law-activated-A3-support-policy-available';
  }

  if (coherentPolicyFamilies.includes('P1')) {
    return 'anchor-gauge-support-policy-available';
  }

  if (coherentPolicyFamilies.includes('P2')) {
    return 'oriented-edge-support-policy-available';
  }

  if (coherentPolicyFamilies.includes('P3')) {
    return 'complement-root-support-policy-available';
  }

  return 'support-policy-available-governance-needed';
}

function classifyVerdict(
  integrityIssues: readonly string[],
  lawActivatedA3SupportPolicyAvailable: boolean,
  policyFamiliesNeedingGovernance: readonly PSimplexT23PolicyId[],
): PSimplexT23Verdict {
  if (integrityIssues.length > 0 || !lawActivatedA3SupportPolicyAvailable) {
    return 'FAIL';
  }

  return policyFamiliesNeedingGovernance.length === 3 ? 'PARTIAL' : 'PASS';
}

function recommendationForVerdict(
  verdict: PSimplexT23Verdict,
  policyFamiliesNeedingGovernance: readonly PSimplexT23PolicyId[],
): PSimplexT23RecommendedResearchConsequence {
  if (verdict === 'FAIL') {
    return 'support-policy-failed-do-not-proceed';
  }

  return policyFamiliesNeedingGovernance.length === 3
    ? 'support-policy-available-but-governance-needed'
    : 'support-policy-law-available-response-grounding-still-unresolved';
}

function primaryClassificationFor(policyId: PSimplexT23PolicyId, rho: number): PSimplexT23Classification {
  if (policyId === 'P0' || rho <= PSIMPLEX_EPSILON) {
    return 'exact-site-axis-only';
  }

  if (policyId === 'P1') {
    return 'anchor-gauge-A3-activation';
  }

  if (policyId === 'P2') {
    return 'orientation-gauge-A3-activation';
  }

  return 'complement-gauge-A3-activation';
}

function secondaryClassificationsFor(
  policyId: PSimplexT23PolicyId,
  rho: number,
  covarianceStatus: PSimplexT23AntipodalCovarianceStatus,
): PSimplexT23Classification[] {
  const classifications: PSimplexT23Classification[] = ['D3-body-absent'];

  if (policyId !== 'P0') {
    classifications.push('single-sibling-leakage-rejected');
  }

  if (policyId !== 'P0' && covarianceStatus === 'holds') {
    classifications.push('antipodal-covariant');
  }

  if (policyId !== 'P0' && rho > PSIMPLEX_EPSILON) {
    classifications.push('law-activated-A3-residual');
  }

  return classifications;
}

function notesForRow(policyId: PSimplexT23PolicyId, rho: number, a3Active: boolean): string[] {
  if (policyId === 'P0') {
    return [
      'P0 preserves the exact-site axis-only baseline inherited from T22.',
      'Rho is recorded as a sweep coordinate but no support A3 root is selected.',
    ];
  }

  if (rho <= PSIMPLEX_EPSILON) {
    return [
      'Support policy is declared, but rho is zero, so the row remains an axis-only policy baseline.',
      'The sibling-pair certificate is available for nonzero support activation.',
    ];
  }

  return [
    a3Active
      ? 'A lawful sibling-pair certificate activates the selected A3 residual root under this support policy.'
      : 'A3 activation failed because the selected certificate is not valid.',
    'This is a policy-relative source-drive law check, not response grounding.',
  ];
}

function buildTargetContext(targetChild: PSimplexChildSourceId): TargetContext {
  const definition = childAxisDefinition(targetChild);
  const antipodalChild = ANTIPODAL_CHILD_BY_ID[targetChild];
  const antipodalDefinition = childAxisDefinition(antipodalChild);
  const [i, j] = definition.endpoints;
  const [k, l] = PSIMPLEX_PRIMAL_SOURCE_IDS.filter(
    (sourceId) => sourceId !== i && sourceId !== j,
  ) as [PSimplexPrimalSourceId, PSimplexPrimalSourceId];

  return {
    targetChild,
    targetEdge: definition.edge,
    antipodalChild,
    antipodalEdge: antipodalDefinition.edge,
    i,
    j,
    k,
    l,
    axisVector: cleanVec3(childAxisVector(targetChild)),
    rij: rootVector(i, j),
    rkl: rootVector(k, l),
  };
}

function rootVectorForRootId(rootId: PSimplexA3RootId): PSimplexVec3 {
  const definition = PSIMPLEX_A3_ROOT_DEFINITIONS.find((row) => row.rootId === rootId);

  if (!definition) {
    throw new Error(`Unknown P-simplex A3 root ${rootId}`);
  }

  return cleanVec3(normalizeVec3(rootVector(definition.from, definition.to)));
}

function rootVector(from: PSimplexPrimalSourceId, to: PSimplexPrimalSourceId): PSimplexVec3 {
  return cleanVec3(subVec3(primalSourceVector(from), primalSourceVector(to)));
}

function childIdFromEndpoints(left: PSimplexPrimalSourceId, right: PSimplexPrimalSourceId): PSimplexChildSourceId {
  return `M_${edgeFromEndpoints(left, right)}`;
}

function edgeFromEndpoints(left: PSimplexPrimalSourceId, right: PSimplexPrimalSourceId): PSimplexChildEdgeId {
  const sorted = [left, right].sort().join('') as PSimplexChildEdgeId;
  const definition = PSIMPLEX_CHILD_AXIS_DEFINITIONS.find((row) => row.edge === sorted);

  if (!definition) {
    throw new Error(`Unknown P-simplex edge ${left}${right}`);
  }

  return definition.edge;
}

function policyRootOppositionHolds(policyId: PSimplexT23PolicyId, targetChild: PSimplexChildSourceId): boolean {
  if (policyId === 'P0') {
    return false;
  }

  const rootByChild = policyId === 'P3' ? COMPLEMENT_ROOT_BY_CHILD : ANCHOR_A_ROOT_BY_CHILD;
  const targetRoot = rootVectorForRootId(rootByChild[targetChild]);
  const antipodalRoot = rootVectorForRootId(rootByChild[ANTIPODAL_CHILD_BY_ID[targetChild]]);

  return vectorOppositionHolds(targetRoot, antipodalRoot);
}

function vectorOppositionHolds(left: PSimplexVec3, right: PSimplexVec3): boolean {
  return normalizedAlignment(left, scaleVec3(right, -1)) > 1 - PSIMPLEX_EPSILON;
}

function normalizedAlignment(left: PSimplexVec3, right: PSimplexVec3): number {
  return cleanNumber(dotVec3(normalizeVec3(left), normalizeVec3(right)));
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

function countByRhoValues(rows: readonly PSimplexT23SupportActivationRow[]): Record<string, number> {
  return RHO_VALUES.reduce<Record<string, number>>(
    (counts, rho) => ({
      ...counts,
      [rhoKey(rho)]: rows.filter((row) => Math.abs(row.rho - rho) <= PSIMPLEX_EPSILON).length,
    }),
    {},
  );
}

function countSecondaryClassifications(rows: readonly PSimplexT23SupportActivationRow[]): Record<PSimplexT23Classification, number> {
  return CLASSIFICATIONS.reduce<Record<PSimplexT23Classification, number>>(
    (counts, classification) => ({
      ...counts,
      [classification]: rows.filter((row) => row.secondaryClassifications.includes(classification)).length,
    }),
    {} as Record<PSimplexT23Classification, number>,
  );
}

function rhoToken(rho: number): string {
  return cleanNumber(rho).toString().replace('.', 'p');
}

function rhoKey(rho: number): string {
  return cleanNumber(rho).toString();
}

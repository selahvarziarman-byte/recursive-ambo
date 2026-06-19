import { buildPSimplexA3ResidualOriginDecompositionLedgerT21Report } from './pSimplexA3ResidualOriginDecompositionLedgerT21';
import { buildPSimplexForcingScaleCalibrationReachabilityLedgerT20Report } from './pSimplexForcingScaleCalibrationReachabilityLedgerT20';
import { buildPSimplexGeneratedSiteA3ResidualActivationLedgerT22Report } from './pSimplexGeneratedSiteA3ResidualActivationLedgerT22';
import {
  buildPSimplexGeneratedSiteSupportActivationLawLedgerT23Report,
  type PSimplexT23SupportActivationRow,
} from './pSimplexGeneratedSiteSupportActivationLawLedgerT23';
import {
  PSIMPLEX_A3_ROOT_DEFINITIONS,
  PSIMPLEX_CHILD_SOURCE_IDS,
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
  normVec3,
  normalizeVec3,
  PSIMPLEX_EPSILON,
  scaleVec3,
  subVec3,
  type PSimplexVec3,
} from './pSimplexVectorMath';

export type PSimplexT24Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT24SummaryVerdict =
  | 'P2sqrt3-germ-convention-available'
  | 'P2sqrt3-germ-convention-available-governance-ready'
  | 'P2sqrt3-germ-convention-partial-governance-needed'
  | 'P2sqrt3-germ-convention-failed';
export type PSimplexT24RecommendedResearchConsequence =
  | 'P2sqrt3-available-as-first-policy-relative-generated-site-germ-convention'
  | 'P2sqrt3-available-but-governance-note-required'
  | 'P2sqrt3-failed-do-not-proceed';
export type PSimplexT24Classification =
  | 'p2sqrt3-germ-vector'
  | 'p2sqrt3-30-degree-tilt'
  | 'p2sqrt3-antipodal-covariant'
  | 'p2sqrt3-certified-A3'
  | 'exact-site-preserved'
  | 'single-sibling-leakage-rejected'
  | 'D3-body-absent'
  | 'boundary-preserved'
  | 'unsupported-germ';

export interface PSimplexT24BoundaryStatuses {
  policyStatus: 'policy-relative';
  conventionStatus: 'research-convention-candidate';
  runtimeAdoptionStatus: 'not-runtime-adopted';
  exactSiteStatus: 'not-exact-site-evidence';
  responseGroundingStatus: 'not-response-grounding';
  semanticStatus: 'not-semantic-naming';
  fieldCueStatus: 'not-fieldcue';
  topologyStatus: 'not-topology-workspace';
  runtimeSubstrateStatus: 'not-runtime-substrate';
}

export interface PSimplexT24SiblingPairCertificate {
  certificateSource: 'T23/T21';
  certificateKind: 'same-endpoint-sibling-pair-A3-root';
  parentCertificateId: string;
  identity: string;
  selectedRoot: PSimplexA3RootId;
  selectedRootSign: 1 | -1;
  sourceSiblingPairTerms: PSimplexChildSourceId[];
  singleSiblingLeakage: false;
  ok: boolean;
}

export interface PSimplexT24GermChildRow {
  rowId: string;
  childId: PSimplexChildSourceId;
  literalTargetEdge: PSimplexChildEdgeId;
  orientedGermEdge: PSimplexChildEdgeId;
  selectedA3Root: PSimplexA3RootId;
  antipodalChild: PSimplexChildSourceId;
  nAxis: PSimplexVec3;
  nA3: PSimplexVec3;
  rho: number;
  rhoExpression: '1/sqrt(3)';
  JGerm: PSimplexVec3;
  axisCoefficient: number;
  a3Coefficient: number;
  axisActive: boolean;
  a3Active: boolean;
  axisA3Orthogonality: number;
  angleFromAxisDegrees: number;
  angleErrorDegrees: number;
  antipodalCovarianceStatus: 'holds' | 'fails';
  singleSiblingLeakageStatus: 'absent/rejected';
  d3BodyStatus: 'absent';
  selectedSiblingPairCertificate: PSimplexT24SiblingPairCertificate;
  classification: PSimplexT24Classification;
  primaryClassification: PSimplexT24Classification;
  secondaryClassifications: PSimplexT24Classification[];
  boundaryStatuses: PSimplexT24BoundaryStatuses;
  ok: boolean;
}

export interface PSimplexT24ExactSitePreservationRow {
  childId: PSimplexChildSourceId;
  JExact: PSimplexVec3;
  nAxis: PSimplexVec3;
  a3Active: false;
  exactSiteStatus: 'exact-site-axis-only';
  responseGroundingStatus: 'not-response-grounding';
  classification: 'exact-site-preserved';
  ok: boolean;
}

export interface PSimplexT24AntipodalCovarianceRow {
  pair: string;
  leftChild: PSimplexChildSourceId;
  rightChild: PSimplexChildSourceId;
  axisOppositionHolds: boolean;
  a3OppositionHolds: boolean;
  rhoMatched: boolean;
  germVectorSum: PSimplexVec3;
  germVectorSumNorm: number;
  antipodalCovarianceStatus: 'holds' | 'fails';
  ok: boolean;
}

export interface PSimplexT24AngleVerificationRow {
  childId: PSimplexChildSourceId;
  angleFromAxisDegrees: number;
  expectedAngleDegrees: 30;
  angleErrorDegrees: number;
  ok: boolean;
}

export interface PSimplexT24OrthogonalityRow {
  childId: PSimplexChildSourceId;
  axisA3Orthogonality: number;
  expected: 0;
  ok: boolean;
}

export interface PSimplexT24LeakageD3AbsenceRow {
  childId: PSimplexChildSourceId;
  singleSiblingLeakageStatus: 'absent/rejected';
  d3BodyStatus: 'absent';
  certificateOk: boolean;
  ok: boolean;
}

export interface PSimplexT24BoundaryStatusRow {
  childId: PSimplexChildSourceId;
  boundaryStatuses: PSimplexT24BoundaryStatuses;
  ok: boolean;
}

export interface PSimplexT24ParentEvidenceRow {
  ledgerId: 'T23' | 'T22' | 'T21' | 'T20' | 'C1/C2';
  verdict: string | null;
  ok: boolean;
  integrityIssueCount: number | null;
  carriedFact: string;
}

export interface PSimplexT24GuardRow {
  guardId:
    | 'exactSitePreserved'
    | 'p2OrientationConventionResolved'
    | 'p2Sqrt3RatioApplied'
    | 'axisA3OrthogonalityVerified'
    | 'thirtyDegreeTiltVerified'
    | 'antipodalCovarianceVerified'
    | 'lawfulSiblingPairCertificateUsed'
    | 'singleSiblingLeakageRejected'
    | 'd3BodyAbsent'
    | 'responseGroundingNotClaimed'
    | 'fieldCueSemanticTopologyBoundaryPreserved'
    | 'runtimeSubstrateNotAuthorized';
  status: 'pass' | 'fail';
  evidence: string;
  ok: boolean;
}

export interface PSimplexT24InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT24Report {
  method: 'p-simplex-p2-sqrt3-generated-site-germ-convention-ledger-t24';
  candidatePackage: 'p-simplex-p2-sqrt3-generated-site-germ-convention-ledger-t24';
  parentSupportActivationLedger: 'p-simplex-generated-site-support-activation-law-ledger-t23';
  diagnosticScope: 'p2sqrt3-policy-relative-generated-site-germ-convention-only';
  solverStatus: 'not-new-solver';
  responseGroundingStatus: 'not-response-grounding';
  runtimeSubstrateStatus: 'not-runtime-substrate-authorization';
  parentEvidenceRows: PSimplexT24ParentEvidenceRow[];
  summaryVerdict: PSimplexT24SummaryVerdict;
  rowCount: number;
  germRowCount: number;
  exactSitePreservationRowCount: number;
  perChildGermVectors: PSimplexT24GermChildRow[];
  antipodalCovarianceTable: PSimplexT24AntipodalCovarianceRow[];
  angleVerificationTable: PSimplexT24AngleVerificationRow[];
  orthogonalityTable: PSimplexT24OrthogonalityRow[];
  leakageD3AbsenceTable: PSimplexT24LeakageD3AbsenceRow[];
  boundaryStatusTable: PSimplexT24BoundaryStatusRow[];
  exactSitePreservationRows: PSimplexT24ExactSitePreservationRow[];
  recommendedResearchConsequence: PSimplexT24RecommendedResearchConsequence;
  guardRows: PSimplexT24GuardRow[];
  invalidInterpretationBoundaryRows: PSimplexT24InvalidInterpretationBoundaryRow[];
  verdict: PSimplexT24Verdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface ParentReports {
  t23: ReturnType<typeof buildPSimplexGeneratedSiteSupportActivationLawLedgerT23Report>;
  t22: ReturnType<typeof buildPSimplexGeneratedSiteA3ResidualActivationLedgerT22Report>;
  t21: ReturnType<typeof buildPSimplexA3ResidualOriginDecompositionLedgerT21Report>;
  t20: ReturnType<typeof buildPSimplexForcingScaleCalibrationReachabilityLedgerT20Report>;
}

interface ChildContext {
  childId: PSimplexChildSourceId;
  literalTargetEdge: PSimplexChildEdgeId;
  orientedGermEdge: PSimplexChildEdgeId;
  selectedA3Root: PSimplexA3RootId;
  antipodalChild: PSimplexChildSourceId;
  antipodalEdge: PSimplexChildEdgeId;
  nAxis: PSimplexVec3;
  nA3: PSimplexVec3;
}

const RHO = 1 / Math.sqrt(3);
const EXPECTED_ANGLE_DEGREES = 30;
const ANGLE_TOLERANCE_DEGREES = 1e-9;
const ANTIPODAL_CHILD_BY_ID: Record<PSimplexChildSourceId, PSimplexChildSourceId> = {
  M_AB: 'M_CD',
  M_AC: 'M_BD',
  M_AD: 'M_BC',
  M_BC: 'M_AD',
  M_BD: 'M_AC',
  M_CD: 'M_AB',
};
const P2_ORIENTED_ROOT_BY_CHILD: Record<PSimplexChildSourceId, PSimplexA3RootId> = {
  M_AB: 'r_AB',
  M_AC: 'r_AC',
  M_AD: 'r_AD',
  M_BC: 'r_DA',
  M_BD: 'r_CA',
  M_CD: 'r_BA',
};
const ORIENTED_GERM_EDGE_BY_CHILD: Record<PSimplexChildSourceId, PSimplexChildEdgeId> = {
  M_AB: 'AB',
  M_AC: 'AC',
  M_AD: 'AD',
  M_BC: 'AD',
  M_BD: 'AC',
  M_CD: 'AB',
};
const ANTIPODAL_PAIRS: ReadonlyArray<[PSimplexChildSourceId, PSimplexChildSourceId]> = [
  ['M_AB', 'M_CD'],
  ['M_AC', 'M_BD'],
  ['M_AD', 'M_BC'],
];

export function buildPSimplexP2Sqrt3GeneratedSiteGermConventionLedgerT24Report(): PSimplexT24Report {
  const parentReports = buildParentReports();
  const childContexts = PSIMPLEX_CHILD_SOURCE_IDS.map(buildChildContext);
  const perChildGermVectors = childContexts.map((context) => buildGermChildRow(context, parentReports));
  const exactSitePreservationRows = childContexts.map(buildExactSitePreservationRow);
  const antipodalCovarianceTable = buildAntipodalCovarianceTable(perChildGermVectors);
  const angleVerificationTable = perChildGermVectors.map((row) => ({
    childId: row.childId,
    angleFromAxisDegrees: row.angleFromAxisDegrees,
    expectedAngleDegrees: 30 as const,
    angleErrorDegrees: row.angleErrorDegrees,
    ok: row.angleErrorDegrees <= ANGLE_TOLERANCE_DEGREES,
  }));
  const orthogonalityTable = perChildGermVectors.map((row) => ({
    childId: row.childId,
    axisA3Orthogonality: row.axisA3Orthogonality,
    expected: 0 as const,
    ok: Math.abs(row.axisA3Orthogonality) <= PSIMPLEX_EPSILON,
  }));
  const leakageD3AbsenceTable = perChildGermVectors.map((row) => ({
    childId: row.childId,
    singleSiblingLeakageStatus: row.singleSiblingLeakageStatus,
    d3BodyStatus: row.d3BodyStatus,
    certificateOk: row.selectedSiblingPairCertificate.ok,
    ok:
      row.singleSiblingLeakageStatus === 'absent/rejected' &&
      row.d3BodyStatus === 'absent' &&
      row.selectedSiblingPairCertificate.ok,
  }));
  const boundaryStatusTable = perChildGermVectors.map((row) => ({
    childId: row.childId,
    boundaryStatuses: row.boundaryStatuses,
    ok: boundaryStatusesPass(row.boundaryStatuses),
  }));
  const parentEvidenceRows = buildParentEvidenceRows(parentReports);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const guardRows = buildGuardRows({
    parentReports,
    perChildGermVectors,
    exactSitePreservationRows,
    antipodalCovarianceTable,
    angleVerificationTable,
    orthogonalityTable,
    leakageD3AbsenceTable,
    boundaryStatusTable,
    invalidInterpretationBoundaryRows,
  });
  const rowCount = perChildGermVectors.length + exactSitePreservationRows.length;
  const integrityIssues = buildIntegrityIssues({
    parentEvidenceRows,
    perChildGermVectors,
    exactSitePreservationRows,
    antipodalCovarianceTable,
    angleVerificationTable,
    orthogonalityTable,
    leakageD3AbsenceTable,
    boundaryStatusTable,
    guardRows,
    rowCount,
  });
  const summaryVerdict = integrityIssues.length === 0
    ? 'P2sqrt3-germ-convention-available'
    : 'P2sqrt3-germ-convention-failed';
  const verdict = integrityIssues.length === 0 ? 'PASS' : 'FAIL';
  const recommendedResearchConsequence = verdict === 'PASS'
    ? 'P2sqrt3-available-as-first-policy-relative-generated-site-germ-convention'
    : 'P2sqrt3-failed-do-not-proceed';

  return {
    method: 'p-simplex-p2-sqrt3-generated-site-germ-convention-ledger-t24',
    candidatePackage: 'p-simplex-p2-sqrt3-generated-site-germ-convention-ledger-t24',
    parentSupportActivationLedger: 'p-simplex-generated-site-support-activation-law-ledger-t23',
    diagnosticScope: 'p2sqrt3-policy-relative-generated-site-germ-convention-only',
    solverStatus: 'not-new-solver',
    responseGroundingStatus: 'not-response-grounding',
    runtimeSubstrateStatus: 'not-runtime-substrate-authorization',
    parentEvidenceRows,
    summaryVerdict,
    rowCount,
    germRowCount: perChildGermVectors.length,
    exactSitePreservationRowCount: exactSitePreservationRows.length,
    perChildGermVectors,
    antipodalCovarianceTable,
    angleVerificationTable,
    orthogonalityTable,
    leakageD3AbsenceTable,
    boundaryStatusTable,
    exactSitePreservationRows,
    recommendedResearchConsequence,
    guardRows,
    invalidInterpretationBoundaryRows,
    verdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: verdict === 'PASS' && integrityIssues.length === 0,
  };
}

function buildParentReports(): ParentReports {
  return {
    t23: buildPSimplexGeneratedSiteSupportActivationLawLedgerT23Report(),
    t22: buildPSimplexGeneratedSiteA3ResidualActivationLedgerT22Report(),
    t21: buildPSimplexA3ResidualOriginDecompositionLedgerT21Report(),
    t20: buildPSimplexForcingScaleCalibrationReachabilityLedgerT20Report(),
  };
}

function buildGermChildRow(context: ChildContext, parentReports: ParentReports): PSimplexT24GermChildRow {
  const selectedSiblingPairCertificate = buildCertificate(context, parentReports);
  const JGerm = cleanVec3(addVec3(context.nAxis, scaleVec3(context.nA3, RHO)));
  const axisA3Orthogonality = cleanNumber(dotVec3(context.nAxis, context.nA3));
  const angleFromAxisDegrees = cleanNumber((Math.acos(dotVec3(normalizeVec3(JGerm), context.nAxis)) * 180) / Math.PI);
  const angleErrorDegrees = cleanNumber(Math.abs(angleFromAxisDegrees - EXPECTED_ANGLE_DEGREES));
  const antipodalCovarianceStatus = antipodalRootOppositionHolds(context) ? 'holds' : 'fails';
  const boundaryStatuses = buildBoundaryStatuses();
  const row: Omit<PSimplexT24GermChildRow, 'ok'> = {
    rowId: `T24-P2sqrt3-${context.childId}`,
    childId: context.childId,
    literalTargetEdge: context.literalTargetEdge,
    orientedGermEdge: context.orientedGermEdge,
    selectedA3Root: context.selectedA3Root,
    antipodalChild: context.antipodalChild,
    nAxis: context.nAxis,
    nA3: context.nA3,
    rho: cleanNumber(RHO),
    rhoExpression: '1/sqrt(3)',
    JGerm,
    axisCoefficient: 1,
    a3Coefficient: cleanNumber(RHO),
    axisActive: true,
    a3Active: true,
    axisA3Orthogonality,
    angleFromAxisDegrees,
    angleErrorDegrees,
    antipodalCovarianceStatus,
    singleSiblingLeakageStatus: 'absent/rejected',
    d3BodyStatus: 'absent',
    selectedSiblingPairCertificate,
    classification: 'p2sqrt3-germ-vector',
    primaryClassification: 'p2sqrt3-germ-vector',
    secondaryClassifications: [
      'p2sqrt3-30-degree-tilt',
      'p2sqrt3-antipodal-covariant',
      'p2sqrt3-certified-A3',
      'single-sibling-leakage-rejected',
      'D3-body-absent',
      'boundary-preserved',
    ],
    boundaryStatuses,
  };

  return {
    ...row,
    ok: germChildRowPasses(row),
  };
}

function germChildRowPasses(row: Omit<PSimplexT24GermChildRow, 'ok'>): boolean {
  return (
    row.axisActive &&
    row.a3Active &&
    Math.abs(row.axisA3Orthogonality) <= PSIMPLEX_EPSILON &&
    row.angleErrorDegrees <= ANGLE_TOLERANCE_DEGREES &&
    row.antipodalCovarianceStatus === 'holds' &&
    row.selectedSiblingPairCertificate.ok &&
    row.selectedSiblingPairCertificate.singleSiblingLeakage === false &&
    row.selectedSiblingPairCertificate.sourceSiblingPairTerms.length === 2 &&
    row.singleSiblingLeakageStatus === 'absent/rejected' &&
    row.d3BodyStatus === 'absent' &&
    boundaryStatusesPass(row.boundaryStatuses)
  );
}

function buildExactSitePreservationRow(context: ChildContext): PSimplexT24ExactSitePreservationRow {
  return {
    childId: context.childId,
    JExact: context.nAxis,
    nAxis: context.nAxis,
    a3Active: false,
    exactSiteStatus: 'exact-site-axis-only',
    responseGroundingStatus: 'not-response-grounding',
    classification: 'exact-site-preserved',
    ok: true,
  };
}

function buildAntipodalCovarianceTable(rows: readonly PSimplexT24GermChildRow[]): PSimplexT24AntipodalCovarianceRow[] {
  return ANTIPODAL_PAIRS.map(([leftChild, rightChild]) => {
    const left = rowForChild(rows, leftChild);
    const right = rowForChild(rows, rightChild);
    const germVectorSum = cleanVec3(addVec3(left.JGerm, right.JGerm));
    const germVectorSumNorm = cleanNumber(normVec3(germVectorSum));
    const axisOppositionHolds = vectorOppositionHolds(left.nAxis, right.nAxis);
    const a3OppositionHolds = vectorOppositionHolds(left.nA3, right.nA3);
    const rhoMatched = Math.abs(left.rho - right.rho) <= PSIMPLEX_EPSILON;
    const ok =
      axisOppositionHolds &&
      a3OppositionHolds &&
      rhoMatched &&
      germVectorSumNorm <= PSIMPLEX_EPSILON;

    return {
      pair: `${leftChild}<->${rightChild}`,
      leftChild,
      rightChild,
      axisOppositionHolds,
      a3OppositionHolds,
      rhoMatched,
      germVectorSum,
      germVectorSumNorm,
      antipodalCovarianceStatus: ok ? 'holds' : 'fails',
      ok,
    };
  });
}

function buildCertificate(context: ChildContext, parentReports: ParentReports): PSimplexT24SiblingPairCertificate {
  const parentRow = parentReports.t23.supportActivationRows.find((row) => isParentP2RhoOneRow(row, context));
  const parentCertificate = parentRow?.selectedSiblingPairCertificate;

  return {
    certificateSource: 'T23/T21',
    certificateKind: 'same-endpoint-sibling-pair-A3-root',
    parentCertificateId: parentCertificate?.certificateId ?? `missing-certificate-${context.childId}`,
    identity: parentCertificate?.identity ?? 'missing',
    selectedRoot: context.selectedA3Root,
    selectedRootSign: parentCertificate?.selectedRootSign ?? 1,
    sourceSiblingPairTerms: parentCertificate ? [...parentCertificate.sourceSiblingPairTerms] : [],
    singleSiblingLeakage: false,
    ok:
      parentRow?.ok === true &&
      parentRow.a3Active === true &&
      parentRow.policyId === 'P2' &&
      parentCertificate?.ok === true &&
      parentCertificate.selectedRoot === context.selectedA3Root &&
      parentCertificate.singleSiblingLeakage === false &&
      parentCertificate.sourceSiblingPairTerms.length === 2,
  };
}

function isParentP2RhoOneRow(row: PSimplexT23SupportActivationRow, context: ChildContext): boolean {
  return (
    row.policyId === 'P2' &&
    row.targetChild === context.childId &&
    Math.abs(row.rho - 1) <= PSIMPLEX_EPSILON &&
    row.selectedA3Root === context.selectedA3Root
  );
}

function buildParentEvidenceRows(parentReports: ParentReports): PSimplexT24ParentEvidenceRow[] {
  return [
    {
      ledgerId: 'T23',
      verdict: parentReports.t23.verdict,
      ok:
        parentReports.t23.ok &&
        parentReports.t23.integrityIssueCount === 0 &&
        parentReports.t23.summaryVerdict === 'law-activated-A3-support-policy-available' &&
        parentReports.t23.coherentPolicyFamilies.includes('P2'),
      integrityIssueCount: parentReports.t23.integrityIssueCount,
      carriedFact:
        'law-activated-A3-support-policy-available; P2 coherent policy family; response grounding unresolved.',
    },
    {
      ledgerId: 'T22',
      verdict: parentReports.t22.verdict,
      ok:
        parentReports.t22.ok &&
        parentReports.t22.integrityIssueCount === 0 &&
        parentReports.t22.a3ResidualEventActive === false,
      integrityIssueCount: parentReports.t22.integrityIssueCount,
      carriedFact:
        'exact-site event A3 inactive; A3 remains algebraically available at exact site; response grounding unresolved.',
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
        'lawful A3 residual-origin law established; sibling-pair lawful origins available; source-state polarity unavailable.',
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

function buildGuardRows(args: {
  parentReports: ParentReports;
  perChildGermVectors: readonly PSimplexT24GermChildRow[];
  exactSitePreservationRows: readonly PSimplexT24ExactSitePreservationRow[];
  antipodalCovarianceTable: readonly PSimplexT24AntipodalCovarianceRow[];
  angleVerificationTable: readonly PSimplexT24AngleVerificationRow[];
  orthogonalityTable: readonly PSimplexT24OrthogonalityRow[];
  leakageD3AbsenceTable: readonly PSimplexT24LeakageD3AbsenceRow[];
  boundaryStatusTable: readonly PSimplexT24BoundaryStatusRow[];
  invalidInterpretationBoundaryRows: readonly PSimplexT24InvalidInterpretationBoundaryRow[];
}): PSimplexT24GuardRow[] {
  const exactSitePreserved =
    args.parentReports.t22.a3ResidualEventActive === false &&
    args.exactSitePreservationRows.length === 6 &&
    args.exactSitePreservationRows.every((row) => row.ok && !row.a3Active);
  const p2OrientationConventionResolved = args.perChildGermVectors.every(
    (row) => row.selectedA3Root === P2_ORIENTED_ROOT_BY_CHILD[row.childId],
  );
  const p2Sqrt3RatioApplied = args.perChildGermVectors.every(
    (row) => Math.abs(row.rho - RHO) <= PSIMPLEX_EPSILON && row.rhoExpression === '1/sqrt(3)',
  );
  const certificatesOk = args.perChildGermVectors.every(
    (row) => row.selectedSiblingPairCertificate.ok && row.selectedSiblingPairCertificate.certificateSource === 'T23/T21',
  );
  const singleSiblingRejected = args.leakageD3AbsenceTable.every(
    (row) => row.ok && row.singleSiblingLeakageStatus === 'absent/rejected',
  );
  const d3BodyAbsent = args.leakageD3AbsenceTable.every((row) => row.ok && row.d3BodyStatus === 'absent');
  const responseGroundingNotClaimed = args.boundaryStatusTable.every(
    (row) => row.boundaryStatuses.responseGroundingStatus === 'not-response-grounding',
  );

  return [
    guardRow('exactSitePreserved', exactSitePreserved, 'Exact-site rows remain axis-only with A3 inactive.'),
    guardRow(
      'p2OrientationConventionResolved',
      p2OrientationConventionResolved,
      'The P2 oriented germ root map is used for all six children, including antipodal children.',
    ),
    guardRow('p2Sqrt3RatioApplied', p2Sqrt3RatioApplied, 'All germ rows use rho = 1/sqrt(3).'),
    guardRow(
      'axisA3OrthogonalityVerified',
      args.orthogonalityTable.every((row) => row.ok),
      'Every n_axis dot n_A3 check is zero within tolerance.',
    ),
    guardRow(
      'thirtyDegreeTiltVerified',
      args.angleVerificationTable.every((row) => row.ok),
      'Every germ vector is 30 degrees from its child axis.',
    ),
    guardRow(
      'antipodalCovarianceVerified',
      args.antipodalCovarianceTable.every((row) => row.ok),
      'Each antipodal pair has opposed axes, opposed A3 roots, matched rho, and zero germ-vector sum.',
    ),
    guardRow(
      'lawfulSiblingPairCertificateUsed',
      certificatesOk,
      'Every active A3 germ row uses a T23/T21 sibling-pair certificate.',
    ),
    guardRow('singleSiblingLeakageRejected', singleSiblingRejected, 'Single-sibling leakage is absent/rejected.'),
    guardRow('d3BodyAbsent', d3BodyAbsent, 'No D3/body term is introduced by the germ convention.'),
    guardRow('responseGroundingNotClaimed', responseGroundingNotClaimed, 'Every germ row remains not-response-grounding.'),
    guardRow(
      'fieldCueSemanticTopologyBoundaryPreserved',
      args.invalidInterpretationBoundaryRows.every((row) => row.enforced) &&
        args.boundaryStatusTable.every(
          (row) =>
            row.boundaryStatuses.fieldCueStatus === 'not-fieldcue' &&
            row.boundaryStatuses.semanticStatus === 'not-semantic-naming' &&
            row.boundaryStatuses.topologyStatus === 'not-topology-workspace',
        ),
      'FieldCue, semantic, and topology boundaries are negative-only.',
    ),
    guardRow(
      'runtimeSubstrateNotAuthorized',
      args.boundaryStatusTable.every(
        (row) =>
          row.boundaryStatuses.runtimeSubstrateStatus === 'not-runtime-substrate' &&
          row.boundaryStatuses.runtimeAdoptionStatus === 'not-runtime-adopted',
      ),
      'T24 does not authorize runtime substrate extraction or runtime adoption.',
    ),
  ];
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT24InvalidInterpretationBoundaryRow[] {
  return [
    {
      boundaryId: 'not-natural-exact-site-activity',
      statement: 'Negative boundary: T24 does not claim A3 was naturally active at the exact site.',
      enforced: true,
    },
    {
      boundaryId: 'not-closed-or-grounded-response',
      statement: 'Negative boundary: T24 does not claim A3 response is closed or operationally grounded.',
      enforced: true,
    },
    {
      boundaryId: 'not-fieldcue-semantic-route-defect-packet-rendering-topology',
      statement:
        'Negative boundary: A3 residual is not FieldCue, semantic meaning, route/walk/holonomy, defect/vortex behavior, packet interpretation, rendering behavior, or topology workspace.',
      enforced: true,
    },
    {
      boundaryId: 'not-runtime-substrate-authorization',
      statement:
        'Negative boundary: this diagnostic does not authorize runtime substrate extraction and P2sqrt3 is not adopted by runtime.',
      enforced: true,
    },
  ];
}

function buildIntegrityIssues(args: {
  parentEvidenceRows: readonly PSimplexT24ParentEvidenceRow[];
  perChildGermVectors: readonly PSimplexT24GermChildRow[];
  exactSitePreservationRows: readonly PSimplexT24ExactSitePreservationRow[];
  antipodalCovarianceTable: readonly PSimplexT24AntipodalCovarianceRow[];
  angleVerificationTable: readonly PSimplexT24AngleVerificationRow[];
  orthogonalityTable: readonly PSimplexT24OrthogonalityRow[];
  leakageD3AbsenceTable: readonly PSimplexT24LeakageD3AbsenceRow[];
  boundaryStatusTable: readonly PSimplexT24BoundaryStatusRow[];
  guardRows: readonly PSimplexT24GuardRow[];
  rowCount: number;
}): string[] {
  const issues: string[] = [];

  if (args.parentEvidenceRows.some((row) => !row.ok)) {
    issues.push('At least one required parent evidence row is unavailable.');
  }

  if (args.rowCount !== 12) {
    issues.push(`Expected 12 total rows, got ${args.rowCount}.`);
  }

  if (args.perChildGermVectors.length !== 6 || args.perChildGermVectors.some((row) => !row.ok)) {
    issues.push('Expected six passing P2sqrt3 germ rows.');
  }

  if (args.exactSitePreservationRows.length !== 6 || args.exactSitePreservationRows.some((row) => !row.ok)) {
    issues.push('Expected six passing exact-site preservation rows.');
  }

  if (args.perChildGermVectors.some((row) => !row.axisActive || !row.a3Active)) {
    issues.push('At least one germ row does not have both axis and A3 active.');
  }

  if (args.orthogonalityTable.some((row) => !row.ok)) {
    issues.push('At least one axis/A3 orthogonality check failed.');
  }

  if (args.angleVerificationTable.some((row) => !row.ok)) {
    issues.push('At least one 30-degree angle check failed.');
  }

  if (args.antipodalCovarianceTable.length !== 3 || args.antipodalCovarianceTable.some((row) => !row.ok)) {
    issues.push('At least one antipodal covariance check failed.');
  }

  if (args.leakageD3AbsenceTable.some((row) => !row.ok)) {
    issues.push('At least one leakage or D3/body absence check failed.');
  }

  if (args.boundaryStatusTable.some((row) => !row.ok)) {
    issues.push('At least one boundary status row failed.');
  }

  if (args.guardRows.some((row) => !row.ok)) {
    issues.push('At least one required T24 guard failed.');
  }

  return [...new Set(issues)];
}

function buildChildContext(childId: PSimplexChildSourceId): ChildContext {
  const definition = childAxisDefinition(childId);
  const antipodalChild = ANTIPODAL_CHILD_BY_ID[childId];
  const antipodalDefinition = childAxisDefinition(antipodalChild);
  const selectedA3Root = P2_ORIENTED_ROOT_BY_CHILD[childId];

  return {
    childId,
    literalTargetEdge: definition.edge,
    orientedGermEdge: ORIENTED_GERM_EDGE_BY_CHILD[childId],
    selectedA3Root,
    antipodalChild,
    antipodalEdge: antipodalDefinition.edge,
    nAxis: cleanVec3(childAxisVector(childId)),
    nA3: rootVectorForRootId(selectedA3Root),
  };
}

function buildBoundaryStatuses(): PSimplexT24BoundaryStatuses {
  return {
    policyStatus: 'policy-relative',
    conventionStatus: 'research-convention-candidate',
    runtimeAdoptionStatus: 'not-runtime-adopted',
    exactSiteStatus: 'not-exact-site-evidence',
    responseGroundingStatus: 'not-response-grounding',
    semanticStatus: 'not-semantic-naming',
    fieldCueStatus: 'not-fieldcue',
    topologyStatus: 'not-topology-workspace',
    runtimeSubstrateStatus: 'not-runtime-substrate',
  };
}

function boundaryStatusesPass(statuses: PSimplexT24BoundaryStatuses): boolean {
  return (
    statuses.policyStatus === 'policy-relative' &&
    statuses.conventionStatus === 'research-convention-candidate' &&
    statuses.runtimeAdoptionStatus === 'not-runtime-adopted' &&
    statuses.exactSiteStatus === 'not-exact-site-evidence' &&
    statuses.responseGroundingStatus === 'not-response-grounding' &&
    statuses.semanticStatus === 'not-semantic-naming' &&
    statuses.fieldCueStatus === 'not-fieldcue' &&
    statuses.topologyStatus === 'not-topology-workspace' &&
    statuses.runtimeSubstrateStatus === 'not-runtime-substrate'
  );
}

function guardRow(guardId: PSimplexT24GuardRow['guardId'], ok: boolean, evidence: string): PSimplexT24GuardRow {
  return {
    guardId,
    status: ok ? 'pass' : 'fail',
    evidence,
    ok,
  };
}

function rowForChild(rows: readonly PSimplexT24GermChildRow[], childId: PSimplexChildSourceId): PSimplexT24GermChildRow {
  const row = rows.find((entry) => entry.childId === childId);

  if (!row) {
    throw new Error(`Missing T24 germ row for ${childId}`);
  }

  return row;
}

function antipodalRootOppositionHolds(context: ChildContext): boolean {
  const antipodalRoot = rootVectorForRootId(P2_ORIENTED_ROOT_BY_CHILD[context.antipodalChild]);

  return vectorOppositionHolds(context.nA3, antipodalRoot);
}

function vectorOppositionHolds(left: PSimplexVec3, right: PSimplexVec3): boolean {
  return cleanNumber(dotVec3(normalizeVec3(left), normalizeVec3(right))) <= -1 + PSIMPLEX_EPSILON;
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

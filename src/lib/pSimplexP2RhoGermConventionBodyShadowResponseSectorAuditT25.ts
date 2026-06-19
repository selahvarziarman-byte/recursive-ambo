import { buildPSimplexA3ResidualOriginDecompositionLedgerT21Report } from './pSimplexA3ResidualOriginDecompositionLedgerT21';
import { buildPSimplexForcingScaleCalibrationReachabilityLedgerT20Report } from './pSimplexForcingScaleCalibrationReachabilityLedgerT20';
import { buildPSimplexGeneratedSiteA3ResidualActivationLedgerT22Report } from './pSimplexGeneratedSiteA3ResidualActivationLedgerT22';
import { buildPSimplexGeneratedSiteSupportActivationLawLedgerT23Report } from './pSimplexGeneratedSiteSupportActivationLawLedgerT23';
import { buildPSimplexP2Sqrt3GeneratedSiteGermConventionLedgerT24Report } from './pSimplexP2Sqrt3GeneratedSiteGermConventionLedgerT24';
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

export type PSimplexT25Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT25GeometricVerdict = 'PASS' | 'FAIL';
export type PSimplexT25SummaryVerdict =
  | 'P2rho-body-safe-range-established'
  | 'P2rho-sqrt3-body-shadow-risk'
  | 'P2rho-response-sector-partial'
  | 'P2rho-body-shadow-audit-failed';
export type PSimplexT25RecommendedResearchConsequence =
  | 'choose-first-safe-P2rho-ratio-before-governance-note'
  | 'P2sqrt3-rejected-for-body-shadow-use-smaller-rho'
  | 'response-sector-needed-before-final-ratio-governance'
  | 'P2rho-body-shadow-audit-failed-do-not-proceed';
export type PSimplexT25RhoExpression = '0' | '1/8' | '1/4' | '1/3' | '1/sqrt(3)' | '1' | 'sqrt(2)';
export type PSimplexT25FiniteDirectionClass = 'axis' | 'A3' | 'body';
export type PSimplexT25BodyShadowClassification =
  | 'exact-axis'
  | 'axis-dominant-A3-germ'
  | 'A3-active-body-safe'
  | 'body-shadow-risk'
  | 'body-near'
  | 'body-exact-reference';
export type PSimplexT25ResponseSectorEvaluationStatus =
  | 'not-evaluated-existing-classifier-unavailable'
  | 'evaluated-existing-classifier';
export type PSimplexT25ResponseSectorClassification =
  | 'axis-response-sector'
  | 'mixed-tilt-response-sector'
  | 'A3-response-sector'
  | 'body-shadow-response-risk'
  | 'body-response-sector'
  | 'not-evaluated';
export type PSimplexT25Sqrt3RatioStatus = 'safe' | 'risky' | 'rejected';

export interface PSimplexT25BoundaryStatuses {
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

export interface PSimplexT25RhoSpec {
  rhoExpression: PSimplexT25RhoExpression;
  rhoValue: number;
}

export interface PSimplexT25RhoRow {
  rowId: string;
  childId: PSimplexChildSourceId;
  rhoExpression: PSimplexT25RhoExpression;
  rhoValue: number;
  literalTargetEdge: PSimplexChildEdgeId;
  orientedGermEdge: PSimplexChildEdgeId;
  selectedA3Root: PSimplexA3RootId;
  antipodalChild: PSimplexChildSourceId;
  nAxis: PSimplexVec3;
  nA3: PSimplexVec3;
  nBodyReference: PSimplexVec3;
  JRho: PSimplexVec3;
  JRhoNormalized: PSimplexVec3;
  angleFromAxisDegrees: number;
  angleFromA3RootDegrees: number;
  angleFromNearestBodyDegrees: number;
  axisAlignment: number;
  a3Alignment: number;
  bodyAlignment: number;
  closedFormAxisAlignment: number;
  closedFormA3Alignment: number;
  closedFormBodyAlignment: number;
  axisAlignmentError: number;
  a3AlignmentError: number;
  bodyAlignmentError: number;
  nearestFiniteDirectionClass: PSimplexT25FiniteDirectionClass;
  bodyShadowClassification: PSimplexT25BodyShadowClassification;
  secondaryBodyShadowClassifications: PSimplexT25BodyShadowClassification[];
  responseSectorClassification: PSimplexT25ResponseSectorClassification;
  singleSiblingLeakageStatus: 'absent/rejected';
  d3BodyPromotionStatus: 'not-promoted';
  d3BodyComponentStatus: 'no-explicit-D3-body-term';
  boundaryStatuses: PSimplexT25BoundaryStatuses;
  ok: boolean;
}

export interface PSimplexT25AntipodalCovarianceRow {
  rhoExpression: PSimplexT25RhoExpression;
  rhoValue: number;
  pair: string;
  leftChild: PSimplexChildSourceId;
  rightChild: PSimplexChildSourceId;
  leftJRho: PSimplexVec3;
  rightJRho: PSimplexVec3;
  vectorSum: PSimplexVec3;
  vectorSumNorm: number;
  axisOppositionHolds: boolean;
  a3OppositionHolds: boolean;
  rhoMatched: boolean;
  antipodalCovarianceStatus: 'holds' | 'fails';
  ok: boolean;
}

export interface PSimplexT25ClassificationCountRow {
  rhoExpression: PSimplexT25RhoExpression;
  rhoValue: number;
  bodyShadowClassificationCounts: Record<PSimplexT25BodyShadowClassification, number>;
  nearestFiniteDirectionClassCounts: Record<PSimplexT25FiniteDirectionClass, number>;
  ok: boolean;
}

export interface PSimplexT25PerChildBodyShadowRow {
  childId: PSimplexChildSourceId;
  literalTargetEdge: PSimplexChildEdgeId;
  orientedGermEdge: PSimplexChildEdgeId;
  selectedA3Root: PSimplexA3RootId;
  classificationsByRho: Array<{
    rhoExpression: PSimplexT25RhoExpression;
    rhoValue: number;
    nearestFiniteDirectionClass: PSimplexT25FiniteDirectionClass;
    bodyShadowClassification: PSimplexT25BodyShadowClassification;
  }>;
  bodySafeRhoExpressions: PSimplexT25RhoExpression[];
  bodyShadowRiskRhoExpressions: PSimplexT25RhoExpression[];
  bodyNearRhoExpressions: PSimplexT25RhoExpression[];
  exactBodyReferenceRhoExpressions: PSimplexT25RhoExpression[];
  sqrt3RatioStatus: PSimplexT25Sqrt3RatioStatus;
  ok: boolean;
}

export interface PSimplexT25SafeRhoRange {
  safeRhoLowerBound: 0;
  safeRhoUpperBoundExclusive: number;
  rhoAxisBodyCrossing: number;
  safeRhoRule: '0 < rho < (sqrt(3) - 1) / sqrt(2)';
  sampleSafeCandidateExpressions: PSimplexT25RhoExpression[];
  sampleSafeCandidateValues: number[];
  ok: boolean;
}

export interface PSimplexT25RecommendedFirstGermConventionRatio {
  recommendedFirstGermConventionRatio: number | null;
  recommendedFirstGermConventionRatioExpression: PSimplexT25RhoExpression | null;
  recommendedFirstGermConventionReason: string;
  derivedFromTestedRows: boolean;
  ok: boolean;
}

export interface PSimplexT25Sqrt3RatioAudit {
  sqrt3RatioStatus: PSimplexT25Sqrt3RatioStatus;
  rhoExpression: '1/sqrt(3)';
  rhoValue: number;
  rhoAxisBodyCrossing: number;
  bodyAlignmentExceedsAxisAlignment: boolean;
  nearestFiniteDirectionClassCounts: Record<PSimplexT25FiniteDirectionClass, number>;
  bodyShadowClassificationCounts: Record<PSimplexT25BodyShadowClassification, number>;
  ok: boolean;
}

export interface PSimplexT25ResponseSectorRow {
  rowId: string;
  gainS: number;
  responseSectorEvaluationStatus: PSimplexT25ResponseSectorEvaluationStatus;
  responseSectorClassification: PSimplexT25ResponseSectorClassification;
  notEvaluatedReason: string;
  ok: boolean;
}

export interface PSimplexT25ParentEvidenceRow {
  ledgerId: 'T24' | 'T23' | 'T22' | 'T21' | 'T20' | 'C1/C2';
  verdict: string | null;
  summaryVerdict: string | null;
  ok: boolean;
  integrityIssueCount: number | null;
  carriedFact: string;
}

export interface PSimplexT25GuardRow {
  guardId:
    | 'parentT24Preserved'
    | 'p2OrientationConventionPreserved'
    | 'rhoSweepComplete'
    | 'bodyReferenceDirectionDefined'
    | 'bodyShadowClassificationComplete'
    | 'sqrt3RatioExplicitlyAudited'
    | 'safeRhoRangeProduced'
    | 'recommendedRatioDerivedNotHardcoded'
    | 'antipodalCovarianceVerified'
    | 'singleSiblingLeakageRejected'
    | 'd3BodyNotPromoted'
    | 'responseGroundingNotClaimed'
    | 'fieldCueSemanticTopologyBoundaryPreserved'
    | 'runtimeSubstrateNotAuthorized';
  status: 'pass' | 'fail';
  evidence: string;
  ok: boolean;
}

export interface PSimplexT25InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT25Report {
  method: 'p-simplex-p2-rho-germ-convention-body-shadow-response-sector-audit-t25';
  candidatePackage: 'p-simplex-p2-rho-germ-convention-body-shadow-response-sector-audit-t25';
  parentGermConventionLedger: 'p-simplex-p2-sqrt3-generated-site-germ-convention-ledger-t24';
  diagnosticScope: 'p2rho-geometric-body-shadow-response-sector-audit-only';
  parentEvidenceRows: PSimplexT25ParentEvidenceRow[];
  rhoRows: PSimplexT25RhoRow[];
  antipodalCovarianceTable: PSimplexT25AntipodalCovarianceRow[];
  perRhoClassificationCounts: PSimplexT25ClassificationCountRow[];
  perChildBodyShadowTable: PSimplexT25PerChildBodyShadowRow[];
  safeRhoRange: PSimplexT25SafeRhoRange;
  recommendedSafeRhoRange: PSimplexT25SafeRhoRange;
  sqrt3RatioStatus: PSimplexT25Sqrt3RatioStatus;
  sqrt3RatioAudit: PSimplexT25Sqrt3RatioAudit;
  recommendedFirstGermConventionRatio: number | null;
  recommendedFirstGermConventionRatioExpression: PSimplexT25RhoExpression | null;
  recommendedFirstGermConventionReason: string;
  recommendedFirstGermConvention: PSimplexT25RecommendedFirstGermConventionRatio;
  responseSectorEvaluationStatus: PSimplexT25ResponseSectorEvaluationStatus;
  responseSectorRows: PSimplexT25ResponseSectorRow[];
  summaryVerdict: PSimplexT25SummaryVerdict;
  geometricVerdict: PSimplexT25GeometricVerdict;
  verdict: PSimplexT25Verdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
  guardRows: PSimplexT25GuardRow[];
  invalidInterpretationBoundaryRows: PSimplexT25InvalidInterpretationBoundaryRow[];
  rowCount: number;
  childCount: number;
  rhoCount: number;
  boundaryStatement: string;
  recommendedResearchConsequence: PSimplexT25RecommendedResearchConsequence;
}

interface ParentReports {
  t24: ReturnType<typeof buildPSimplexP2Sqrt3GeneratedSiteGermConventionLedgerT24Report>;
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
  nAxis: PSimplexVec3;
  nA3: PSimplexVec3;
  nBodyReference: PSimplexVec3;
}

const BODY_RHO_REFERENCE = Math.sqrt(2);
const RHO_AXIS_BODY_CROSSING = (Math.sqrt(3) - 1) / Math.sqrt(2);
const RESPONSE_SECTOR_EVALUATION_STATUS: PSimplexT25ResponseSectorEvaluationStatus =
  'not-evaluated-existing-classifier-unavailable';

const RHO_SPECS: readonly PSimplexT25RhoSpec[] = [
  { rhoExpression: '0', rhoValue: 0 },
  { rhoExpression: '1/8', rhoValue: 1 / 8 },
  { rhoExpression: '1/4', rhoValue: 1 / 4 },
  { rhoExpression: '1/3', rhoValue: 1 / 3 },
  { rhoExpression: '1/sqrt(3)', rhoValue: 1 / Math.sqrt(3) },
  { rhoExpression: '1', rhoValue: 1 },
  { rhoExpression: 'sqrt(2)', rhoValue: BODY_RHO_REFERENCE },
];

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

const BODY_SHADOW_CLASSIFICATIONS: readonly PSimplexT25BodyShadowClassification[] = [
  'exact-axis',
  'axis-dominant-A3-germ',
  'A3-active-body-safe',
  'body-shadow-risk',
  'body-near',
  'body-exact-reference',
];

const FINITE_DIRECTION_CLASSES: readonly PSimplexT25FiniteDirectionClass[] = ['axis', 'A3', 'body'];

export function buildPSimplexP2RhoGermConventionBodyShadowResponseSectorAuditT25Report(): PSimplexT25Report {
  const parentReports = buildParentReports();
  const childContexts = PSIMPLEX_CHILD_SOURCE_IDS.map(buildChildContext);
  const rhoRows = childContexts.flatMap((context) => RHO_SPECS.map((rhoSpec) => buildRhoRow(context, rhoSpec)));
  const antipodalCovarianceTable = buildAntipodalCovarianceTable(rhoRows);
  const perRhoClassificationCounts = buildPerRhoClassificationCounts(rhoRows);
  const perChildBodyShadowTable = buildPerChildBodyShadowTable(rhoRows);
  const safeRhoRange = buildSafeRhoRange(rhoRows, antipodalCovarianceTable);
  const sqrt3RatioAudit = buildSqrt3RatioAudit(rhoRows);
  const recommendedFirstGermConvention = buildRecommendedFirstGermConvention(rhoRows, antipodalCovarianceTable);
  const responseSectorRows = buildResponseSectorRows();
  const parentEvidenceRows = buildParentEvidenceRows(parentReports);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const guardRows = buildGuardRows({
    parentReports,
    rhoRows,
    antipodalCovarianceTable,
    safeRhoRange,
    sqrt3RatioAudit,
    recommendedFirstGermConvention,
    invalidInterpretationBoundaryRows,
  });
  const integrityIssues = buildIntegrityIssues({
    parentEvidenceRows,
    rhoRows,
    antipodalCovarianceTable,
    perRhoClassificationCounts,
    perChildBodyShadowTable,
    safeRhoRange,
    sqrt3RatioAudit,
    recommendedFirstGermConvention,
    guardRows,
  });
  const geometricVerdict = integrityIssues.length === 0 && guardRows.every((row) => row.ok) ? 'PASS' : 'FAIL';
  const verdict = classifyVerdict(geometricVerdict, RESPONSE_SECTOR_EVALUATION_STATUS);
  const summaryVerdict = classifySummaryVerdict(geometricVerdict, RESPONSE_SECTOR_EVALUATION_STATUS, sqrt3RatioAudit);
  const recommendedResearchConsequence = classifyRecommendedResearchConsequence(
    geometricVerdict,
    RESPONSE_SECTOR_EVALUATION_STATUS,
    sqrt3RatioAudit,
  );

  return {
    method: 'p-simplex-p2-rho-germ-convention-body-shadow-response-sector-audit-t25',
    candidatePackage: 'p-simplex-p2-rho-germ-convention-body-shadow-response-sector-audit-t25',
    parentGermConventionLedger: 'p-simplex-p2-sqrt3-generated-site-germ-convention-ledger-t24',
    diagnosticScope: 'p2rho-geometric-body-shadow-response-sector-audit-only',
    parentEvidenceRows,
    rhoRows,
    antipodalCovarianceTable,
    perRhoClassificationCounts,
    perChildBodyShadowTable,
    safeRhoRange,
    recommendedSafeRhoRange: safeRhoRange,
    sqrt3RatioStatus: sqrt3RatioAudit.sqrt3RatioStatus,
    sqrt3RatioAudit,
    recommendedFirstGermConventionRatio: recommendedFirstGermConvention.recommendedFirstGermConventionRatio,
    recommendedFirstGermConventionRatioExpression:
      recommendedFirstGermConvention.recommendedFirstGermConventionRatioExpression,
    recommendedFirstGermConventionReason: recommendedFirstGermConvention.recommendedFirstGermConventionReason,
    recommendedFirstGermConvention,
    responseSectorEvaluationStatus: RESPONSE_SECTOR_EVALUATION_STATUS,
    responseSectorRows,
    summaryVerdict,
    geometricVerdict,
    verdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: geometricVerdict === 'PASS' && verdict !== 'FAIL' && integrityIssues.length === 0,
    guardRows,
    invalidInterpretationBoundaryRows,
    rowCount: rhoRows.length,
    childCount: PSIMPLEX_CHILD_SOURCE_IDS.length,
    rhoCount: RHO_SPECS.length,
    boundaryStatement:
      'negative-boundary-rows-enforced; T25 is a geometric audit only and does not authorize runtime adoption, response grounding, or substrate extraction.',
    recommendedResearchConsequence,
  };
}

function buildParentReports(): ParentReports {
  return {
    t24: buildPSimplexP2Sqrt3GeneratedSiteGermConventionLedgerT24Report(),
    t23: buildPSimplexGeneratedSiteSupportActivationLawLedgerT23Report(),
    t22: buildPSimplexGeneratedSiteA3ResidualActivationLedgerT22Report(),
    t21: buildPSimplexA3ResidualOriginDecompositionLedgerT21Report(),
    t20: buildPSimplexForcingScaleCalibrationReachabilityLedgerT20Report(),
  };
}

function buildChildContext(childId: PSimplexChildSourceId): ChildContext {
  const selectedA3Root = P2_ORIENTED_ROOT_BY_CHILD[childId];
  const nAxis = cleanVec3(childAxisVector(childId));
  const nA3 = rootVectorForRootId(selectedA3Root);

  return {
    childId,
    literalTargetEdge: childAxisDefinition(childId).edge,
    orientedGermEdge: ORIENTED_GERM_EDGE_BY_CHILD[childId],
    selectedA3Root,
    antipodalChild: ANTIPODAL_CHILD_BY_ID[childId],
    nAxis,
    nA3,
    nBodyReference: cleanVec3(normalizeVec3(addVec3(nAxis, scaleVec3(nA3, BODY_RHO_REFERENCE)))),
  };
}

function buildRhoRow(context: ChildContext, rhoSpec: PSimplexT25RhoSpec): PSimplexT25RhoRow {
  const JRho = cleanVec3(addVec3(context.nAxis, scaleVec3(context.nA3, rhoSpec.rhoValue)));
  const JRhoNormalized = cleanVec3(normalizeVec3(JRho));
  const axisAlignment = cleanNumber(dotVec3(JRhoNormalized, context.nAxis));
  const a3Alignment = cleanNumber(dotVec3(JRhoNormalized, context.nA3));
  const bodyAlignment = cleanNumber(dotVec3(JRhoNormalized, context.nBodyReference));
  const closedFormAxisAlignment = cleanNumber(1 / Math.sqrt(1 + rhoSpec.rhoValue ** 2));
  const closedFormA3Alignment = cleanNumber(rhoSpec.rhoValue / Math.sqrt(1 + rhoSpec.rhoValue ** 2));
  const closedFormBodyAlignment = cleanNumber(
    (1 + rhoSpec.rhoValue * Math.sqrt(2)) / (Math.sqrt(1 + rhoSpec.rhoValue ** 2) * Math.sqrt(3)),
  );
  const nearestFiniteDirectionClass = nearestFiniteDirectionClassFor(axisAlignment, a3Alignment, bodyAlignment);
  const bodyShadowClassification = classifyBodyShadow(rhoSpec.rhoValue, nearestFiniteDirectionClass, axisAlignment, bodyAlignment);
  const secondaryBodyShadowClassifications = buildSecondaryClassifications(
    rhoSpec.rhoValue,
    nearestFiniteDirectionClass,
    axisAlignment,
    bodyAlignment,
    bodyShadowClassification,
  );
  const boundaryStatuses = buildBoundaryStatuses();
  const row: Omit<PSimplexT25RhoRow, 'ok'> = {
    rowId: `T25-${context.childId}-rho-${rhoToken(rhoSpec.rhoExpression)}`,
    childId: context.childId,
    rhoExpression: rhoSpec.rhoExpression,
    rhoValue: cleanNumber(rhoSpec.rhoValue),
    literalTargetEdge: context.literalTargetEdge,
    orientedGermEdge: context.orientedGermEdge,
    selectedA3Root: context.selectedA3Root,
    antipodalChild: context.antipodalChild,
    nAxis: context.nAxis,
    nA3: context.nA3,
    nBodyReference: context.nBodyReference,
    JRho,
    JRhoNormalized,
    angleFromAxisDegrees: angleDegrees(axisAlignment),
    angleFromA3RootDegrees: angleDegrees(a3Alignment),
    angleFromNearestBodyDegrees: angleDegrees(bodyAlignment),
    axisAlignment,
    a3Alignment,
    bodyAlignment,
    closedFormAxisAlignment,
    closedFormA3Alignment,
    closedFormBodyAlignment,
    axisAlignmentError: cleanNumber(Math.abs(axisAlignment - closedFormAxisAlignment)),
    a3AlignmentError: cleanNumber(Math.abs(a3Alignment - closedFormA3Alignment)),
    bodyAlignmentError: cleanNumber(Math.abs(bodyAlignment - closedFormBodyAlignment)),
    nearestFiniteDirectionClass,
    bodyShadowClassification,
    secondaryBodyShadowClassifications,
    responseSectorClassification: 'not-evaluated',
    singleSiblingLeakageStatus: 'absent/rejected',
    d3BodyPromotionStatus: 'not-promoted',
    d3BodyComponentStatus: 'no-explicit-D3-body-term',
    boundaryStatuses,
  };

  return {
    ...row,
    ok: rhoRowPasses(row),
  };
}

function rhoRowPasses(row: Omit<PSimplexT25RhoRow, 'ok'>): boolean {
  return (
    normVec3(row.JRhoNormalized) > 1 - PSIMPLEX_EPSILON &&
    row.axisAlignment >= -PSIMPLEX_EPSILON &&
    row.a3Alignment >= -PSIMPLEX_EPSILON &&
    row.bodyAlignment >= -PSIMPLEX_EPSILON &&
    row.axisAlignmentError <= PSIMPLEX_EPSILON &&
    row.a3AlignmentError <= PSIMPLEX_EPSILON &&
    row.bodyAlignmentError <= PSIMPLEX_EPSILON &&
    BODY_SHADOW_CLASSIFICATIONS.includes(row.bodyShadowClassification) &&
    FINITE_DIRECTION_CLASSES.includes(row.nearestFiniteDirectionClass) &&
    row.singleSiblingLeakageStatus === 'absent/rejected' &&
    row.d3BodyPromotionStatus === 'not-promoted' &&
    row.d3BodyComponentStatus === 'no-explicit-D3-body-term' &&
    boundaryStatusesPass(row.boundaryStatuses)
  );
}

function buildAntipodalCovarianceTable(rows: readonly PSimplexT25RhoRow[]): PSimplexT25AntipodalCovarianceRow[] {
  return RHO_SPECS.flatMap((rhoSpec) =>
    ANTIPODAL_PAIRS.map(([leftChild, rightChild]) => {
      const left = rowForChildAndRho(rows, leftChild, rhoSpec.rhoExpression);
      const right = rowForChildAndRho(rows, rightChild, rhoSpec.rhoExpression);
      const vectorSum = cleanVec3(addVec3(left.JRho, right.JRho));
      const vectorSumNorm = cleanNumber(normVec3(vectorSum));
      const axisOppositionHolds = vectorOppositionHolds(left.nAxis, right.nAxis);
      const a3OppositionHolds = vectorOppositionHolds(left.nA3, right.nA3);
      const rhoMatched = Math.abs(left.rhoValue - right.rhoValue) <= PSIMPLEX_EPSILON;
      const ok = axisOppositionHolds && a3OppositionHolds && rhoMatched && vectorSumNorm <= PSIMPLEX_EPSILON;

      return {
        rhoExpression: rhoSpec.rhoExpression,
        rhoValue: cleanNumber(rhoSpec.rhoValue),
        pair: `${leftChild}<->${rightChild}`,
        leftChild,
        rightChild,
        leftJRho: left.JRho,
        rightJRho: right.JRho,
        vectorSum,
        vectorSumNorm,
        axisOppositionHolds,
        a3OppositionHolds,
        rhoMatched,
        antipodalCovarianceStatus: ok ? 'holds' : 'fails',
        ok,
      };
    }),
  );
}

function buildPerRhoClassificationCounts(rows: readonly PSimplexT25RhoRow[]): PSimplexT25ClassificationCountRow[] {
  return RHO_SPECS.map((rhoSpec) => {
    const rhoRows = rows.filter((row) => row.rhoExpression === rhoSpec.rhoExpression);
    const bodyShadowClassificationCounts = zeroBodyShadowClassificationCounts();
    const nearestFiniteDirectionClassCounts = zeroFiniteDirectionClassCounts();

    for (const row of rhoRows) {
      bodyShadowClassificationCounts[row.bodyShadowClassification] += 1;
      nearestFiniteDirectionClassCounts[row.nearestFiniteDirectionClass] += 1;
    }

    return {
      rhoExpression: rhoSpec.rhoExpression,
      rhoValue: cleanNumber(rhoSpec.rhoValue),
      bodyShadowClassificationCounts,
      nearestFiniteDirectionClassCounts,
      ok: rhoRows.length === PSIMPLEX_CHILD_SOURCE_IDS.length,
    };
  });
}

function buildPerChildBodyShadowTable(rows: readonly PSimplexT25RhoRow[]): PSimplexT25PerChildBodyShadowRow[] {
  return PSIMPLEX_CHILD_SOURCE_IDS.map((childId) => {
    const childRows = rows.filter((row) => row.childId === childId);
    const bodySafeRows = childRows.filter(rowIsBodySafeCandidate);
    const riskRows = childRows.filter((row) =>
      row.bodyShadowClassification === 'body-shadow-risk' ||
      row.bodyShadowClassification === 'body-near' ||
      row.bodyShadowClassification === 'body-exact-reference',
    );
    const bodyNearRows = childRows.filter((row) => row.bodyShadowClassification === 'body-near');
    const exactBodyRows = childRows.filter((row) => row.bodyShadowClassification === 'body-exact-reference');
    const sqrt3Rows = childRows.filter((row) => row.rhoExpression === '1/sqrt(3)');
    const context = buildChildContext(childId);

    return {
      childId,
      literalTargetEdge: context.literalTargetEdge,
      orientedGermEdge: context.orientedGermEdge,
      selectedA3Root: context.selectedA3Root,
      classificationsByRho: childRows.map((row) => ({
        rhoExpression: row.rhoExpression,
        rhoValue: row.rhoValue,
        nearestFiniteDirectionClass: row.nearestFiniteDirectionClass,
        bodyShadowClassification: row.bodyShadowClassification,
      })),
      bodySafeRhoExpressions: bodySafeRows.map((row) => row.rhoExpression),
      bodyShadowRiskRhoExpressions: riskRows.map((row) => row.rhoExpression),
      bodyNearRhoExpressions: bodyNearRows.map((row) => row.rhoExpression),
      exactBodyReferenceRhoExpressions: exactBodyRows.map((row) => row.rhoExpression),
      sqrt3RatioStatus: classifySqrt3Status(sqrt3Rows),
      ok: childRows.length === RHO_SPECS.length && sqrt3Rows.length === 1,
    };
  });
}

function buildSafeRhoRange(
  rows: readonly PSimplexT25RhoRow[],
  antipodalCovarianceTable: readonly PSimplexT25AntipodalCovarianceRow[],
): PSimplexT25SafeRhoRange {
  const sampleSafeRows = RHO_SPECS.filter((rhoSpec) => rhoSpec.rhoValue > PSIMPLEX_EPSILON).filter((rhoSpec) =>
    rows
      .filter((row) => row.rhoExpression === rhoSpec.rhoExpression)
      .every(rowIsBodySafeCandidate) &&
    antipodalCovarianceTable
      .filter((row) => row.rhoExpression === rhoSpec.rhoExpression)
      .every((row) => row.ok),
  );

  return {
    safeRhoLowerBound: 0,
    safeRhoUpperBoundExclusive: cleanNumber(RHO_AXIS_BODY_CROSSING),
    rhoAxisBodyCrossing: cleanNumber(RHO_AXIS_BODY_CROSSING),
    safeRhoRule: '0 < rho < (sqrt(3) - 1) / sqrt(2)',
    sampleSafeCandidateExpressions: sampleSafeRows.map((row) => row.rhoExpression),
    sampleSafeCandidateValues: sampleSafeRows.map((row) => cleanNumber(row.rhoValue)),
    ok:
      RHO_AXIS_BODY_CROSSING > 0 &&
      sampleSafeRows.length > 0 &&
      sampleSafeRows.every((row) => row.rhoValue < RHO_AXIS_BODY_CROSSING),
  };
}

function buildSqrt3RatioAudit(rows: readonly PSimplexT25RhoRow[]): PSimplexT25Sqrt3RatioAudit {
  const sqrt3Rows = rows.filter((row) => row.rhoExpression === '1/sqrt(3)');
  const bodyShadowClassificationCounts = zeroBodyShadowClassificationCounts();
  const nearestFiniteDirectionClassCounts = zeroFiniteDirectionClassCounts();

  for (const row of sqrt3Rows) {
    bodyShadowClassificationCounts[row.bodyShadowClassification] += 1;
    nearestFiniteDirectionClassCounts[row.nearestFiniteDirectionClass] += 1;
  }

  const status = classifySqrt3Status(sqrt3Rows);

  return {
    sqrt3RatioStatus: status,
    rhoExpression: '1/sqrt(3)',
    rhoValue: cleanNumber(1 / Math.sqrt(3)),
    rhoAxisBodyCrossing: cleanNumber(RHO_AXIS_BODY_CROSSING),
    bodyAlignmentExceedsAxisAlignment: sqrt3Rows.every((row) => row.bodyAlignment >= row.axisAlignment),
    nearestFiniteDirectionClassCounts,
    bodyShadowClassificationCounts,
    ok:
      sqrt3Rows.length === PSIMPLEX_CHILD_SOURCE_IDS.length &&
      status === 'risky' &&
      sqrt3Rows.every((row) => row.bodyShadowClassification === 'body-near'),
  };
}

function buildRecommendedFirstGermConvention(
  rows: readonly PSimplexT25RhoRow[],
  antipodalCovarianceTable: readonly PSimplexT25AntipodalCovarianceRow[],
): PSimplexT25RecommendedFirstGermConventionRatio {
  const safeRhoSpecs = RHO_SPECS.filter((rhoSpec) => rhoSpec.rhoValue > PSIMPLEX_EPSILON)
    .filter((rhoSpec) =>
      rows
        .filter((row) => row.rhoExpression === rhoSpec.rhoExpression)
        .every(rowIsBodySafeCandidate) &&
      antipodalCovarianceTable
        .filter((row) => row.rhoExpression === rhoSpec.rhoExpression)
        .every((row) => row.ok),
    )
    .sort((left, right) => left.rhoValue - right.rhoValue);
  const selected = safeRhoSpecs[safeRhoSpecs.length - 1] ?? null;

  return {
    recommendedFirstGermConventionRatio: selected ? cleanNumber(selected.rhoValue) : null,
    recommendedFirstGermConventionRatioExpression: selected?.rhoExpression ?? null,
    recommendedFirstGermConventionReason: selected
      ? 'largest-tested-rho-with-active-A3-axis-dominant-body-safe-antipodal-covariant-leakage-free-D3-not-promoted'
      : 'no-tested-rho-satisfied-active-A3-axis-dominant-body-safe-antipodal-covariant-leakage-free-D3-not-promoted',
    derivedFromTestedRows: Boolean(selected),
    ok: Boolean(selected),
  };
}

function buildResponseSectorRows(): PSimplexT25ResponseSectorRow[] {
  return [1, 1.5, 2].map((gainS) => ({
    rowId: `T25-response-sector-s-${rhoToken(String(gainS))}`,
    gainS,
    responseSectorEvaluationStatus: RESPONSE_SECTOR_EVALUATION_STATUS,
    responseSectorClassification: 'not-evaluated',
    notEvaluatedReason:
      'No exported pure arbitrary-source-drive response-sector classifier was available; T25 does not create or extend solver logic.',
    ok: true,
  }));
}

function buildParentEvidenceRows(parentReports: ParentReports): PSimplexT25ParentEvidenceRow[] {
  return [
    {
      ledgerId: 'T24',
      verdict: parentReports.t24.verdict,
      summaryVerdict: parentReports.t24.summaryVerdict,
      ok:
        parentReports.t24.ok &&
        parentReports.t24.integrityIssueCount === 0 &&
        parentReports.t24.verdict === 'PASS' &&
        t24ConventionMatchesRequiredP2(parentReports),
      integrityIssueCount: parentReports.t24.integrityIssueCount,
      carriedFact:
        'P2sqrt3 was available as a policy-relative generated-site germ convention, without proving body-shadow safety.',
    },
    {
      ledgerId: 'T23',
      verdict: parentReports.t23.verdict,
      summaryVerdict: parentReports.t23.summaryVerdict,
      ok:
        parentReports.t23.ok &&
        parentReports.t23.integrityIssueCount === 0 &&
        parentReports.t23.coherentPolicyFamilies.includes('P2'),
      integrityIssueCount: parentReports.t23.integrityIssueCount,
      carriedFact: 'P2 was a coherent support-activation law family with sibling-pair certificates.',
    },
    {
      ledgerId: 'T22',
      verdict: parentReports.t22.verdict,
      summaryVerdict: parentReports.t22.summaryVerdict,
      ok:
        parentReports.t22.ok &&
        parentReports.t22.integrityIssueCount === 0 &&
        parentReports.t22.a3ResidualEventActive === false,
      integrityIssueCount: parentReports.t22.integrityIssueCount,
      carriedFact: 'Exact-site A3 event activity remained inactive.',
    },
    {
      ledgerId: 'T21',
      verdict: parentReports.t21.verdict,
      summaryVerdict: parentReports.t21.summaryVerdict,
      ok:
        parentReports.t21.ok &&
        parentReports.t21.integrityIssueCount === 0 &&
        parentReports.t21.a3ResidualOriginLawEstablished,
      integrityIssueCount: parentReports.t21.integrityIssueCount,
      carriedFact: 'A3 residual-origin decomposition was established as a lawful source-drive fact.',
    },
    {
      ledgerId: 'T20',
      verdict: parentReports.t20.verdict,
      summaryVerdict: null,
      ok: parentReports.t20.ok && parentReports.t20.integrityIssueCount === 0,
      integrityIssueCount: parentReports.t20.integrityIssueCount,
      carriedFact: 'Forcing-scale calibration kept A3 reachability separate from response closure.',
    },
    {
      ledgerId: 'C1/C2',
      verdict: null,
      summaryVerdict: null,
      ok: true,
      integrityIssueCount: null,
      carriedFact: 'Closed axis plus provisional A3 remains the near-term readout posture; body response remains quarantined.',
    },
  ];
}

function buildGuardRows(args: {
  parentReports: ParentReports;
  rhoRows: readonly PSimplexT25RhoRow[];
  antipodalCovarianceTable: readonly PSimplexT25AntipodalCovarianceRow[];
  safeRhoRange: PSimplexT25SafeRhoRange;
  sqrt3RatioAudit: PSimplexT25Sqrt3RatioAudit;
  recommendedFirstGermConvention: PSimplexT25RecommendedFirstGermConventionRatio;
  invalidInterpretationBoundaryRows: readonly PSimplexT25InvalidInterpretationBoundaryRow[];
}): PSimplexT25GuardRow[] {
  const rhoSweepComplete = RHO_SPECS.every(
    (rhoSpec) =>
      args.rhoRows.filter((row) => row.rhoExpression === rhoSpec.rhoExpression).length === PSIMPLEX_CHILD_SOURCE_IDS.length,
  );
  const p2OrientationConventionPreserved = args.rhoRows.every(
    (row) =>
      row.selectedA3Root === P2_ORIENTED_ROOT_BY_CHILD[row.childId] &&
      row.orientedGermEdge === ORIENTED_GERM_EDGE_BY_CHILD[row.childId],
  );
  const bodyReferenceDirectionDefined = args.rhoRows.every(
    (row) =>
      normVec3(row.nBodyReference) > 1 - PSIMPLEX_EPSILON &&
      normVec3(row.nBodyReference) < 1 + PSIMPLEX_EPSILON,
  );
  const bodyShadowClassificationComplete = args.rhoRows.every(
    (row) => row.ok && BODY_SHADOW_CLASSIFICATIONS.includes(row.bodyShadowClassification),
  );
  const singleSiblingLeakageRejected = args.rhoRows.every((row) => row.singleSiblingLeakageStatus === 'absent/rejected');
  const d3BodyNotPromoted = args.rhoRows.every(
    (row) => row.d3BodyPromotionStatus === 'not-promoted' && row.d3BodyComponentStatus === 'no-explicit-D3-body-term',
  );
  const responseGroundingNotClaimed = args.rhoRows.every(
    (row) => row.boundaryStatuses.responseGroundingStatus === 'not-response-grounding',
  );
  const fieldCueSemanticTopologyBoundaryPreserved =
    args.invalidInterpretationBoundaryRows.every((row) => row.enforced) &&
    args.rhoRows.every(
      (row) =>
        row.boundaryStatuses.fieldCueStatus === 'not-fieldcue' &&
        row.boundaryStatuses.semanticStatus === 'not-semantic-naming' &&
        row.boundaryStatuses.topologyStatus === 'not-topology-workspace',
    );
  const runtimeSubstrateNotAuthorized = args.rhoRows.every(
    (row) =>
      row.boundaryStatuses.runtimeAdoptionStatus === 'not-runtime-adopted' &&
      row.boundaryStatuses.runtimeSubstrateStatus === 'not-runtime-substrate',
  );

  return [
    guardRow(
      'parentT24Preserved',
      t24ConventionMatchesRequiredP2(args.parentReports),
      'T24 is passing and its P2 oriented root map is preserved before the P2rho sweep.',
    ),
    guardRow(
      'p2OrientationConventionPreserved',
      p2OrientationConventionPreserved,
      'Every T25 row uses the T24 P2 oriented germ edge and A3 root convention.',
    ),
    guardRow('rhoSweepComplete', rhoSweepComplete, 'All six children are evaluated across all seven required rho values.'),
    guardRow(
      'bodyReferenceDirectionDefined',
      bodyReferenceDirectionDefined,
      'Each row defines n_body = normalize(n_axis + sqrt(2) n_A3).',
    ),
    guardRow(
      'bodyShadowClassificationComplete',
      bodyShadowClassificationComplete,
      'Every row carries a finite-direction class and body-shadow classification.',
    ),
    guardRow(
      'sqrt3RatioExplicitlyAudited',
      args.sqrt3RatioAudit.ok && args.sqrt3RatioAudit.sqrt3RatioStatus === 'risky',
      'rho = 1/sqrt(3) is explicitly checked against the axis/body crossing threshold.',
    ),
    guardRow('safeRhoRangeProduced', args.safeRhoRange.ok, 'The geometric safe range is reported as a strict open interval.'),
    guardRow(
      'recommendedRatioDerivedNotHardcoded',
      args.recommendedFirstGermConvention.ok && args.recommendedFirstGermConvention.derivedFromTestedRows,
      'The recommended first ratio is selected from tested rows satisfying the safe-candidate rule.',
    ),
    guardRow(
      'antipodalCovarianceVerified',
      args.antipodalCovarianceTable.length === RHO_SPECS.length * ANTIPODAL_PAIRS.length &&
        args.antipodalCovarianceTable.every((row) => row.ok),
      'Every tested rho preserves J_rho(M_antipode) = -J_rho(M_child).',
    ),
    guardRow(
      'singleSiblingLeakageRejected',
      singleSiblingLeakageRejected,
      'Single-sibling leakage remains absent/rejected for every row.',
    ),
    guardRow('d3BodyNotPromoted', d3BodyNotPromoted, 'Body-shadow proximity is not promoted into an active D3/body claim.'),
    guardRow('responseGroundingNotClaimed', responseGroundingNotClaimed, 'No row claims response grounding.'),
    guardRow(
      'fieldCueSemanticTopologyBoundaryPreserved',
      fieldCueSemanticTopologyBoundaryPreserved,
      'Field-cue, semantic, and topology boundaries are negative-only.',
    ),
    guardRow(
      'runtimeSubstrateNotAuthorized',
      runtimeSubstrateNotAuthorized,
      'The audit does not authorize runtime adoption or substrate extraction.',
    ),
  ];
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT25InvalidInterpretationBoundaryRow[] {
  return [
    {
      boundaryId: 'not-runtime-adopted',
      statement: 'Negative boundary: P2rho is not runtime-adopted.',
      enforced: true,
    },
    {
      boundaryId: 'not-closed-or-operationally-grounded-A3-response',
      statement: 'Negative boundary: A3 response is not closed and is not operationally grounded.',
      enforced: true,
    },
    {
      boundaryId: 'not-safe-body-near-by-missing-explicit-term',
      statement:
        'Negative boundary: Body-near behavior is not safe merely because no explicit body term was added.',
      enforced: true,
    },
    {
      boundaryId: 'not-fieldcue-semantic-route-defect-packet-rendering-topology',
      statement:
        'Negative boundary: A3 residual is not FieldCue, semantic meaning, route/walk/holonomy, defect/vortex behavior, packet interpretation, rendering behavior, or topology workspace.',
      enforced: true,
    },
    {
      boundaryId: 'not-runtime-substrate-extraction',
      statement: 'Negative boundary: this audit does not authorize runtime substrate extraction.',
      enforced: true,
    },
  ];
}

function buildIntegrityIssues(args: {
  parentEvidenceRows: readonly PSimplexT25ParentEvidenceRow[];
  rhoRows: readonly PSimplexT25RhoRow[];
  antipodalCovarianceTable: readonly PSimplexT25AntipodalCovarianceRow[];
  perRhoClassificationCounts: readonly PSimplexT25ClassificationCountRow[];
  perChildBodyShadowTable: readonly PSimplexT25PerChildBodyShadowRow[];
  safeRhoRange: PSimplexT25SafeRhoRange;
  sqrt3RatioAudit: PSimplexT25Sqrt3RatioAudit;
  recommendedFirstGermConvention: PSimplexT25RecommendedFirstGermConventionRatio;
  guardRows: readonly PSimplexT25GuardRow[];
}): string[] {
  const issues: string[] = [];

  if (args.parentEvidenceRows.some((row) => !row.ok)) {
    issues.push('At least one required parent evidence row is unavailable or inconsistent.');
  }

  if (args.rhoRows.length !== PSIMPLEX_CHILD_SOURCE_IDS.length * RHO_SPECS.length) {
    issues.push(`Expected 42 P2rho rows, got ${args.rhoRows.length}.`);
  }

  if (args.rhoRows.some((row) => !row.ok)) {
    issues.push('At least one P2rho geometric audit row failed its internal checks.');
  }

  if (args.antipodalCovarianceTable.length !== RHO_SPECS.length * ANTIPODAL_PAIRS.length) {
    issues.push(`Expected 21 antipodal covariance rows, got ${args.antipodalCovarianceTable.length}.`);
  }

  if (args.antipodalCovarianceTable.some((row) => !row.ok)) {
    issues.push('At least one antipodal covariance row failed.');
  }

  if (args.perRhoClassificationCounts.some((row) => !row.ok)) {
    issues.push('At least one rho classification-count row has incomplete child coverage.');
  }

  if (args.perChildBodyShadowTable.some((row) => !row.ok)) {
    issues.push('At least one child body-shadow table row has incomplete rho coverage.');
  }

  if (!args.safeRhoRange.ok) {
    issues.push('The geometric safe rho range was not produced.');
  }

  if (!args.sqrt3RatioAudit.ok || args.sqrt3RatioAudit.sqrt3RatioStatus !== 'risky') {
    issues.push('rho = 1/sqrt(3) was not explicitly reported as body-shadow risky.');
  }

  if (!args.recommendedFirstGermConvention.ok) {
    issues.push('No recommended first germ-convention ratio could be derived from tested rows.');
  }

  if (args.guardRows.some((row) => !row.ok)) {
    issues.push('At least one required T25 guard failed.');
  }

  return [...new Set(issues)];
}

function nearestFiniteDirectionClassFor(
  axisAlignment: number,
  a3Alignment: number,
  bodyAlignment: number,
): PSimplexT25FiniteDirectionClass {
  const maximum = Math.max(axisAlignment, a3Alignment, bodyAlignment);

  if (Math.abs(bodyAlignment - maximum) <= PSIMPLEX_EPSILON) {
    return 'body';
  }

  if (Math.abs(axisAlignment - maximum) <= PSIMPLEX_EPSILON) {
    return 'axis';
  }

  return 'A3';
}

function classifyBodyShadow(
  rhoValue: number,
  nearestFiniteDirectionClass: PSimplexT25FiniteDirectionClass,
  axisAlignment: number,
  bodyAlignment: number,
): PSimplexT25BodyShadowClassification {
  if (Math.abs(rhoValue - BODY_RHO_REFERENCE) <= PSIMPLEX_EPSILON) {
    return 'body-exact-reference';
  }

  if (rhoValue <= PSIMPLEX_EPSILON) {
    return 'exact-axis';
  }

  if (nearestFiniteDirectionClass === 'body') {
    return 'body-near';
  }

  if (bodyAlignment + PSIMPLEX_EPSILON >= axisAlignment) {
    return 'body-shadow-risk';
  }

  if (nearestFiniteDirectionClass === 'axis') {
    return 'axis-dominant-A3-germ';
  }

  return 'A3-active-body-safe';
}

function buildSecondaryClassifications(
  rhoValue: number,
  nearestFiniteDirectionClass: PSimplexT25FiniteDirectionClass,
  axisAlignment: number,
  bodyAlignment: number,
  primaryClassification: PSimplexT25BodyShadowClassification,
): PSimplexT25BodyShadowClassification[] {
  const secondary = new Set<PSimplexT25BodyShadowClassification>();

  if (rhoValue <= PSIMPLEX_EPSILON) {
    secondary.add('exact-axis');
  } else if (axisAlignment > bodyAlignment && nearestFiniteDirectionClass !== 'body') {
    secondary.add('A3-active-body-safe');

    if (nearestFiniteDirectionClass === 'axis') {
      secondary.add('axis-dominant-A3-germ');
    }
  } else {
    secondary.add('body-shadow-risk');

    if (nearestFiniteDirectionClass === 'body' && Math.abs(rhoValue - BODY_RHO_REFERENCE) > PSIMPLEX_EPSILON) {
      secondary.add('body-near');
    }
  }

  if (Math.abs(rhoValue - BODY_RHO_REFERENCE) <= PSIMPLEX_EPSILON) {
    secondary.add('body-exact-reference');
  }

  secondary.delete(primaryClassification);

  return [...secondary];
}

function rowIsBodySafeCandidate(row: PSimplexT25RhoRow): boolean {
  return (
    row.rhoValue > PSIMPLEX_EPSILON &&
    row.axisAlignment > row.bodyAlignment &&
    row.nearestFiniteDirectionClass !== 'body' &&
    (row.bodyShadowClassification === 'axis-dominant-A3-germ' ||
      row.bodyShadowClassification === 'A3-active-body-safe') &&
    row.singleSiblingLeakageStatus === 'absent/rejected' &&
    row.d3BodyPromotionStatus === 'not-promoted'
  );
}

function classifySqrt3Status(rows: readonly PSimplexT25RhoRow[]): PSimplexT25Sqrt3RatioStatus {
  if (rows.length === 0 || rows.some((row) => !row.ok)) {
    return 'rejected';
  }

  if (
    rows.every(
      (row) =>
        row.bodyAlignment < row.axisAlignment &&
        row.nearestFiniteDirectionClass !== 'body' &&
        row.bodyShadowClassification !== 'body-near' &&
        row.bodyShadowClassification !== 'body-shadow-risk',
    )
  ) {
    return 'safe';
  }

  return 'risky';
}

function classifyVerdict(
  geometricVerdict: PSimplexT25GeometricVerdict,
  responseSectorEvaluationStatus: PSimplexT25ResponseSectorEvaluationStatus,
): PSimplexT25Verdict {
  if (geometricVerdict === 'FAIL') {
    return 'FAIL';
  }

  return responseSectorEvaluationStatus === 'not-evaluated-existing-classifier-unavailable' ? 'PARTIAL' : 'PASS';
}

function classifySummaryVerdict(
  geometricVerdict: PSimplexT25GeometricVerdict,
  responseSectorEvaluationStatus: PSimplexT25ResponseSectorEvaluationStatus,
  sqrt3RatioAudit: PSimplexT25Sqrt3RatioAudit,
): PSimplexT25SummaryVerdict {
  if (geometricVerdict === 'FAIL') {
    return 'P2rho-body-shadow-audit-failed';
  }

  if (responseSectorEvaluationStatus === 'not-evaluated-existing-classifier-unavailable') {
    return 'P2rho-response-sector-partial';
  }

  if (sqrt3RatioAudit.sqrt3RatioStatus === 'risky') {
    return 'P2rho-sqrt3-body-shadow-risk';
  }

  return 'P2rho-body-safe-range-established';
}

function classifyRecommendedResearchConsequence(
  geometricVerdict: PSimplexT25GeometricVerdict,
  responseSectorEvaluationStatus: PSimplexT25ResponseSectorEvaluationStatus,
  sqrt3RatioAudit: PSimplexT25Sqrt3RatioAudit,
): PSimplexT25RecommendedResearchConsequence {
  if (geometricVerdict === 'FAIL') {
    return 'P2rho-body-shadow-audit-failed-do-not-proceed';
  }

  if (sqrt3RatioAudit.sqrt3RatioStatus === 'risky') {
    return 'P2sqrt3-rejected-for-body-shadow-use-smaller-rho';
  }

  if (responseSectorEvaluationStatus === 'not-evaluated-existing-classifier-unavailable') {
    return 'response-sector-needed-before-final-ratio-governance';
  }

  return 'choose-first-safe-P2rho-ratio-before-governance-note';
}

function buildBoundaryStatuses(): PSimplexT25BoundaryStatuses {
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

function boundaryStatusesPass(statuses: PSimplexT25BoundaryStatuses): boolean {
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

function t24ConventionMatchesRequiredP2(parentReports: ParentReports): boolean {
  return (
    parentReports.t24.ok &&
    parentReports.t24.integrityIssueCount === 0 &&
    parentReports.t24.perChildGermVectors.length === PSIMPLEX_CHILD_SOURCE_IDS.length &&
    parentReports.t24.perChildGermVectors.every(
      (row) =>
        row.selectedA3Root === P2_ORIENTED_ROOT_BY_CHILD[row.childId] &&
        row.orientedGermEdge === ORIENTED_GERM_EDGE_BY_CHILD[row.childId] &&
        row.boundaryStatuses.runtimeAdoptionStatus === 'not-runtime-adopted' &&
        row.boundaryStatuses.responseGroundingStatus === 'not-response-grounding',
    )
  );
}

function zeroBodyShadowClassificationCounts(): Record<PSimplexT25BodyShadowClassification, number> {
  return {
    'exact-axis': 0,
    'axis-dominant-A3-germ': 0,
    'A3-active-body-safe': 0,
    'body-shadow-risk': 0,
    'body-near': 0,
    'body-exact-reference': 0,
  };
}

function zeroFiniteDirectionClassCounts(): Record<PSimplexT25FiniteDirectionClass, number> {
  return {
    axis: 0,
    A3: 0,
    body: 0,
  };
}

function guardRow(guardId: PSimplexT25GuardRow['guardId'], ok: boolean, evidence: string): PSimplexT25GuardRow {
  return {
    guardId,
    status: ok ? 'pass' : 'fail',
    evidence,
    ok,
  };
}

function rowForChildAndRho(
  rows: readonly PSimplexT25RhoRow[],
  childId: PSimplexChildSourceId,
  rhoExpression: PSimplexT25RhoExpression,
): PSimplexT25RhoRow {
  const row = rows.find((entry) => entry.childId === childId && entry.rhoExpression === rhoExpression);

  if (!row) {
    throw new Error(`Missing T25 row for ${childId} at rho ${rhoExpression}`);
  }

  return row;
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

function angleDegrees(alignment: number): number {
  return cleanNumber((Math.acos(clamp(alignment, -1, 1)) * 180) / Math.PI);
}

function clamp(value: number, lower: number, upper: number): number {
  return Math.max(lower, Math.min(upper, value));
}

function rhoToken(value: string): string {
  return value.replace(/\//g, '-over-').replace(/\(/g, '').replace(/\)/g, '').replace(/\./g, '-');
}

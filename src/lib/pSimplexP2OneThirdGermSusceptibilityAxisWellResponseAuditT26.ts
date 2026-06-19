import { buildPSimplexA3ResidualOriginDecompositionLedgerT21Report } from './pSimplexA3ResidualOriginDecompositionLedgerT21';
import { buildPSimplexForcingScaleCalibrationReachabilityLedgerT20Report } from './pSimplexForcingScaleCalibrationReachabilityLedgerT20';
import { buildPSimplexGeneratedSiteA3ResidualActivationLedgerT22Report } from './pSimplexGeneratedSiteA3ResidualActivationLedgerT22';
import { buildPSimplexGeneratedSiteSupportActivationLawLedgerT23Report } from './pSimplexGeneratedSiteSupportActivationLawLedgerT23';
import { buildPSimplexP2RhoGermConventionBodyShadowResponseSectorAuditT25Report } from './pSimplexP2RhoGermConventionBodyShadowResponseSectorAuditT25';
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

export type PSimplexT26Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT26LocalSusceptibilityVerdict = 'PASS' | 'FAIL';
export type PSimplexT26SummaryVerdict =
  | 'P2-one-third-A3-susceptibility-confirmed'
  | 'P2-one-third-susceptibility-confirmed-body-shadow-warning'
  | 'P2-one-third-body-shadow-risk'
  | 'P2-one-third-susceptibility-inconclusive';
export type PSimplexT26DriveType = 'exact-site' | 'P2(1/3)-germ';
export type PSimplexT26Classification =
  | 'exact-axis-response'
  | 'axis-with-A3-susceptibility'
  | 'axis-dominant-A3-susceptibility'
  | 'bodyward-tangent-susceptibility'
  | 'linearized-body-shadow-risk'
  | 'not-response-closure';
export type PSimplexT26A3SusceptibilityStatus = 'absent' | 'active-linearized';
export type PSimplexT26BodyStatus = 'body-absent' | 'bodyward-tangent-only' | 'linearized-body-shadow-risk';
export type PSimplexT26BodyShadowEstimateStatus =
  | 'body-absent'
  | 'axis-dominant-below-linearized-crossing'
  | 'linearized-body-shadow-risk';
export type PSimplexT26AcceptabilityStatus =
  | 'acceptable-as-local-susceptibility-germ'
  | 'acceptable-with-linearized-only-caveat'
  | 'not-acceptable-body-shadow-risk'
  | 'inconclusive';
export type PSimplexT26RecommendedResearchConsequence =
  | 'P2-one-third-local-A3-susceptibility-established'
  | 'P2-one-third-local-susceptibility-established-nonlinear-confirmation-needed'
  | 'P2-one-third-rejected-by-linearized-body-shadow-risk'
  | 'T26-susceptibility-inconclusive-do-not-proceed';
export type PSimplexMatrix3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number],
];

export interface PSimplexT26BoundaryStatuses {
  policyStatus: 'policy-relative';
  susceptibilityStatus: 'local-linearized-susceptibility';
  responseGroundingStatus: 'local-susceptibility-only';
  responseClosureStatus: 'not-closed-response';
  fieldCueStatus: 'not-fieldcue';
  semanticStatus: 'not-semantic-naming';
  routeHolonomyStatus: 'not-route-walk-holonomy';
  defectVortexStatus: 'not-defect-vortex';
  packetStatus: 'not-packet-interpretation';
  topologyStatus: 'not-topology-workspace';
  runtimeSubstrateStatus: 'not-runtime-substrate';
}

export interface PSimplexT26ParentEvidenceRow {
  ledgerId: 'T25' | 'T24' | 'T23' | 'T22' | 'T21' | 'T20' | 'C1/C2';
  verdict: string | null;
  summaryVerdict: string | null;
  ok: boolean;
  integrityIssueCount: number | null;
  carriedFact: string;
}

export interface PSimplexT26HessianVerificationRow {
  childId: PSimplexChildSourceId;
  axisWell: PSimplexVec3;
  hessianMatrix: PSimplexMatrix3;
  radialAxisStiffness: number;
  transverseA3Stiffness: number;
  transverseOtherStiffness: number;
  transverseStiffnessA3: number;
  transverseStiffnessOther: number;
  positiveDefinite: boolean;
  expectedRotatedDiagonal: PSimplexMatrix3;
  expectedHessianClass: '+x/-x' | '+y/-y' | '+z/-z';
  stiffnessStatus: 'axis-radial-8-transverse-2';
  localStabilityStatus: 'stable-axis-well' | 'unstable-axis-well';
  ok: boolean;
}

export interface PSimplexT26SusceptibilityRow {
  rowId: string;
  childId: PSimplexChildSourceId;
  driveType: PSimplexT26DriveType;
  eta: number;
  nAxis: PSimplexVec3;
  nA3: PSimplexVec3;
  nBody: PSimplexVec3;
  J: PSimplexVec3;
  sourceAxisCoefficient: number;
  sourceA3Coefficient: number;
  hessianMatrix: PSimplexMatrix3;
  radialAxisStiffness: number;
  transverseA3Stiffness: number;
  deltaPhiLinearized: PSimplexVec3;
  axisCorrectionMagnitude: number;
  a3TransverseMagnitude: number;
  axisSusceptibilityCoefficient: number;
  a3SusceptibilityCoefficient: number;
  a3ToAxisPerturbationRatio: number;
  approxResponseLinearized: PSimplexVec3;
  approxResponseAxisAlignment: number;
  approxResponseA3Alignment: number;
  approxResponseBodyAlignment: number;
  linearizedAxisBodyCrossingEta: number;
  bodyShadowEstimateStatus: PSimplexT26BodyShadowEstimateStatus;
  primaryClassification: PSimplexT26Classification;
  secondaryClassifications: PSimplexT26Classification[];
  A3SusceptibilityStatus: PSimplexT26A3SusceptibilityStatus;
  bodyStatus: PSimplexT26BodyStatus;
  responseGroundingStatus: 'local-susceptibility-only';
  responseClosureStatus: 'not-closed-response';
  boundaryStatuses: PSimplexT26BoundaryStatuses;
  ok: boolean;
}

export interface PSimplexT26AntipodalSusceptibilityCovarianceRow {
  eta: number;
  driveType: PSimplexT26DriveType;
  pair: string;
  leftChild: PSimplexChildSourceId;
  rightChild: PSimplexChildSourceId;
  leftDeltaPhi: PSimplexVec3;
  rightDeltaPhi: PSimplexVec3;
  deltaPhiSum: PSimplexVec3;
  deltaPhiSumNorm: number;
  leftApproxResponse: PSimplexVec3;
  rightApproxResponse: PSimplexVec3;
  approxResponseSum: PSimplexVec3;
  approxResponseSumNorm: number;
  antipodalSusceptibilityCovarianceStatus: 'holds' | 'fails';
  ok: boolean;
}

export interface PSimplexT26TangentToBodyRow {
  childId: PSimplexChildSourceId;
  nAxis: PSimplexVec3;
  nA3: PSimplexVec3;
  nBody: PSimplexVec3;
  tBody: PSimplexVec3;
  tBodyAlignmentWithA3: number;
  tangentStatus: 'A3-is-bodyward-tangent' | 'A3-bodyward-tangent-mismatch';
  bodyInterpretationBoundary: 'bodyward-tangent-not-body-response';
  ok: boolean;
}

export interface PSimplexT26LinearizedBodyShadowEstimateRow {
  tableId: 'linearized-response-body-shadow-estimate';
  eta: number;
  axisCoefficientA: number;
  transverseCoefficientT: number;
  transverseToAxisRatio: number;
  axisBodyCrossingRatio: number;
  linearizedAxisBodyCrossingEta: number;
  axisAlignment: number;
  a3Alignment: number;
  bodyAlignment: number;
  bodyShadowEstimateStatus: 'axis-dominant-below-linearized-crossing' | 'linearized-body-shadow-risk';
  ok: boolean;
}

export interface PSimplexT26SusceptibilitySummary {
  rowCount: number;
  driveType: PSimplexT26DriveType;
  a3SusceptibilityStatus: PSimplexT26A3SusceptibilityStatus;
  axisSusceptibilityCoefficient: number;
  a3SusceptibilityCoefficient: number;
  a3ToAxisPerturbationRatio: number;
  allRowsOk: boolean;
}

export interface PSimplexT26AntipodalSusceptibilitySummary {
  rowCount: number;
  holdsCount: number;
  failedCount: number;
  status: 'holds' | 'fails';
  ok: boolean;
}

export interface PSimplexT26TangentToBodySummary {
  rowCount: number;
  tangentVerifiedCount: number;
  status: 'A3-is-bodyward-tangent' | 'A3-bodyward-tangent-mismatch';
  boundary: 'bodyward-tangent-not-body-response';
  ok: boolean;
}

export interface PSimplexT26LinearizedBodyShadowSummary {
  rowCount: number;
  linearizedAxisBodyCrossingEta: number;
  sampledEtaMax: number;
  sampledRiskRowCount: number;
  allSampledRowsAxisDominant: boolean;
  status: 'axis-dominant-through-sampled-eta' | 'sampled-linearized-body-shadow-risk';
  ok: boolean;
}

export interface PSimplexT26GuardRow {
  guardId:
    | 'parentT25Preserved'
    | 'p2OneThirdRatioPreserved'
    | 'p2OrientationConventionPreserved'
    | 'hessianStiffnessVerified'
    | 'axisWellLocalStabilityVerified'
    | 'exactSiteZeroA3SusceptibilityVerified'
    | 'p2OneThirdA3SusceptibilityVerified'
    | 'a3SusceptibilityCoefficientVerified'
    | 'perturbationRatioBoundaryPreserved'
    | 'antipodalSusceptibilityCovarianceVerified'
    | 'tangentToBodyVerified'
    | 'bodywardTangentNotPromotedToBodyResponse'
    | 'linearizedBodyShadowEstimateProvided'
    | 'responseClosureNotClaimed'
    | 'responseGroundingLimitedToLocalSusceptibility'
    | 'fieldCueSemanticRouteDefectPacketTopologyBoundaryPreserved'
    | 'runtimeSubstrateNotAuthorized';
  status: 'pass' | 'fail';
  evidence: string;
  ok: boolean;
}

export interface PSimplexT26InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT26Report {
  method: 'p-simplex-p2-one-third-germ-susceptibility-axis-well-response-audit-t26';
  candidatePackage: 'p-simplex-p2-one-third-germ-susceptibility-axis-well-response-audit-t26';
  parentBodyShadowAudit: 'p-simplex-p2-rho-germ-convention-body-shadow-response-sector-audit-t25';
  diagnosticScope: 'p2-one-third-local-axis-well-susceptibility-audit-only';
  parentEvidenceRows: PSimplexT26ParentEvidenceRow[];
  hessianVerificationRows: PSimplexT26HessianVerificationRow[];
  susceptibilityRows: PSimplexT26SusceptibilityRow[];
  antipodalSusceptibilityCovarianceRows: PSimplexT26AntipodalSusceptibilityCovarianceRow[];
  tangentToBodyRows: PSimplexT26TangentToBodyRow[];
  linearizedBodyShadowEstimateRows: PSimplexT26LinearizedBodyShadowEstimateRow[];
  summaryVerdict: PSimplexT26SummaryVerdict;
  localSusceptibilityVerdict: PSimplexT26LocalSusceptibilityVerdict;
  verdict: PSimplexT26Verdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
  exactSiteSusceptibilitySummary: PSimplexT26SusceptibilitySummary;
  p2OneThirdSusceptibilitySummary: PSimplexT26SusceptibilitySummary;
  antipodalSusceptibilitySummary: PSimplexT26AntipodalSusceptibilitySummary;
  tangentToBodySummary: PSimplexT26TangentToBodySummary;
  linearizedBodyShadowSummary: PSimplexT26LinearizedBodyShadowSummary;
  p2OneThirdAcceptabilityStatus: PSimplexT26AcceptabilityStatus;
  remainingUnresolved: string[];
  recommendedResearchConsequence: PSimplexT26RecommendedResearchConsequence;
  guardRows: PSimplexT26GuardRow[];
  invalidInterpretationBoundaryRows: PSimplexT26InvalidInterpretationBoundaryRow[];
  rowCount: number;
  childCount: number;
  etaCount: number;
  driveTypeCount: number;
}

interface ParentReports {
  t25: ReturnType<typeof buildPSimplexP2RhoGermConventionBodyShadowResponseSectorAuditT25Report>;
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
  nBody: PSimplexVec3;
  transverseOther: PSimplexVec3;
}

const RHO_ONE_THIRD = 1 / 3;
const BODY_REFERENCE_RHO = Math.sqrt(2);
const AXIS_BODY_CROSSING_RATIO = (Math.sqrt(3) - 1) / Math.sqrt(2);
const LINEARIZED_AXIS_BODY_CROSSING_ETA = AXIS_BODY_CROSSING_RATIO / (1 / 6 - AXIS_BODY_CROSSING_RATIO / 8);
const RADIAL_AXIS_STIFFNESS = 8;
const TRANSVERSE_STIFFNESS = 2;
const ETA_SAMPLES = [0.25, 0.5, 1, 1.5, 2] as const;
const DRIVE_TYPES: readonly PSimplexT26DriveType[] = ['exact-site', 'P2(1/3)-germ'];

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

export function buildPSimplexP2OneThirdGermSusceptibilityAxisWellResponseAuditT26Report(): PSimplexT26Report {
  const parentReports = buildParentReports();
  const childContexts = PSIMPLEX_CHILD_SOURCE_IDS.map(buildChildContext);
  const hessianVerificationRows = childContexts.map(buildHessianVerificationRow);
  const susceptibilityRows = childContexts.flatMap((context) =>
    DRIVE_TYPES.flatMap((driveType) => ETA_SAMPLES.map((eta) => buildSusceptibilityRow(context, driveType, eta))),
  );
  const antipodalSusceptibilityCovarianceRows = buildAntipodalSusceptibilityCovarianceRows(susceptibilityRows);
  const tangentToBodyRows = childContexts.map(buildTangentToBodyRow);
  const linearizedBodyShadowEstimateRows = ETA_SAMPLES.map(buildLinearizedBodyShadowEstimateRow);
  const parentEvidenceRows = buildParentEvidenceRows(parentReports);
  const exactSiteSusceptibilitySummary = buildSusceptibilitySummary(susceptibilityRows, 'exact-site');
  const p2OneThirdSusceptibilitySummary = buildSusceptibilitySummary(susceptibilityRows, 'P2(1/3)-germ');
  const antipodalSusceptibilitySummary = buildAntipodalSusceptibilitySummary(antipodalSusceptibilityCovarianceRows);
  const tangentToBodySummary = buildTangentToBodySummary(tangentToBodyRows);
  const linearizedBodyShadowSummary = buildLinearizedBodyShadowSummary(linearizedBodyShadowEstimateRows);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const guardRows = buildGuardRows({
    parentReports,
    hessianVerificationRows,
    susceptibilityRows,
    antipodalSusceptibilityCovarianceRows,
    tangentToBodyRows,
    linearizedBodyShadowEstimateRows,
    invalidInterpretationBoundaryRows,
  });
  const integrityIssues = buildIntegrityIssues({
    parentEvidenceRows,
    hessianVerificationRows,
    susceptibilityRows,
    antipodalSusceptibilityCovarianceRows,
    tangentToBodyRows,
    linearizedBodyShadowEstimateRows,
    exactSiteSusceptibilitySummary,
    p2OneThirdSusceptibilitySummary,
    antipodalSusceptibilitySummary,
    tangentToBodySummary,
    linearizedBodyShadowSummary,
    guardRows,
  });
  const localSusceptibilityVerdict = integrityIssues.length === 0 && guardRows.every((row) => row.ok) ? 'PASS' : 'FAIL';
  const sampledLinearizedRisk = linearizedBodyShadowSummary.sampledRiskRowCount > 0;
  const verdict = classifyVerdict(localSusceptibilityVerdict, sampledLinearizedRisk);
  const summaryVerdict = classifySummaryVerdict(localSusceptibilityVerdict, sampledLinearizedRisk);
  const p2OneThirdAcceptabilityStatus = classifyAcceptabilityStatus(localSusceptibilityVerdict, verdict, sampledLinearizedRisk);
  const recommendedResearchConsequence = classifyRecommendedResearchConsequence(
    localSusceptibilityVerdict,
    verdict,
    sampledLinearizedRisk,
  );

  return {
    method: 'p-simplex-p2-one-third-germ-susceptibility-axis-well-response-audit-t26',
    candidatePackage: 'p-simplex-p2-one-third-germ-susceptibility-axis-well-response-audit-t26',
    parentBodyShadowAudit: 'p-simplex-p2-rho-germ-convention-body-shadow-response-sector-audit-t25',
    diagnosticScope: 'p2-one-third-local-axis-well-susceptibility-audit-only',
    parentEvidenceRows,
    hessianVerificationRows,
    susceptibilityRows,
    antipodalSusceptibilityCovarianceRows,
    tangentToBodyRows,
    linearizedBodyShadowEstimateRows,
    summaryVerdict,
    localSusceptibilityVerdict,
    verdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: verdict !== 'FAIL' && integrityIssues.length === 0,
    exactSiteSusceptibilitySummary,
    p2OneThirdSusceptibilitySummary,
    antipodalSusceptibilitySummary,
    tangentToBodySummary,
    linearizedBodyShadowSummary,
    p2OneThirdAcceptabilityStatus,
    remainingUnresolved: [
      'exact nonlinear response confirmation',
      'global response-sector classification',
      'runtime adoption',
      'response closure',
      'semantic / FieldCue interpretation',
    ],
    recommendedResearchConsequence,
    guardRows,
    invalidInterpretationBoundaryRows,
    rowCount: susceptibilityRows.length,
    childCount: PSIMPLEX_CHILD_SOURCE_IDS.length,
    etaCount: ETA_SAMPLES.length,
    driveTypeCount: DRIVE_TYPES.length,
  };
}

function buildParentReports(): ParentReports {
  return {
    t25: buildPSimplexP2RhoGermConventionBodyShadowResponseSectorAuditT25Report(),
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
  const nBody = cleanVec3(normalizeVec3(addVec3(nAxis, scaleVec3(nA3, BODY_REFERENCE_RHO))));

  return {
    childId,
    literalTargetEdge: childAxisDefinition(childId).edge,
    orientedGermEdge: ORIENTED_GERM_EDGE_BY_CHILD[childId],
    selectedA3Root,
    antipodalChild: ANTIPODAL_CHILD_BY_ID[childId],
    nAxis,
    nA3,
    nBody,
    transverseOther: cleanVec3(normalizeVec3(crossVec3(nAxis, nA3))),
  };
}

function buildHessianVerificationRow(context: ChildContext): PSimplexT26HessianVerificationRow {
  const hessianMatrix = hessianV0At(context.nAxis);
  const expectedRotatedDiagonal = expectedHessianForAxis(context.nAxis);
  const radialAxisStiffness = cleanNumber(quadraticForm(context.nAxis, hessianMatrix));
  const transverseA3Stiffness = cleanNumber(quadraticForm(context.nA3, hessianMatrix));
  const transverseOtherStiffness = cleanNumber(quadraticForm(context.transverseOther, hessianMatrix));
  const positiveDefinite =
    radialAxisStiffness > PSIMPLEX_EPSILON &&
    transverseA3Stiffness > PSIMPLEX_EPSILON &&
    transverseOtherStiffness > PSIMPLEX_EPSILON;
  const ok =
    positiveDefinite &&
    matrixNearlyEqual(hessianMatrix, expectedRotatedDiagonal) &&
    nearlyEqual(radialAxisStiffness, RADIAL_AXIS_STIFFNESS) &&
    nearlyEqual(transverseA3Stiffness, TRANSVERSE_STIFFNESS) &&
    nearlyEqual(transverseOtherStiffness, TRANSVERSE_STIFFNESS);

  return {
    childId: context.childId,
    axisWell: context.nAxis,
    hessianMatrix,
    radialAxisStiffness,
    transverseA3Stiffness,
    transverseOtherStiffness,
    transverseStiffnessA3: transverseA3Stiffness,
    transverseStiffnessOther: transverseOtherStiffness,
    positiveDefinite,
    expectedRotatedDiagonal,
    expectedHessianClass: expectedHessianClassForAxis(context.nAxis),
    stiffnessStatus: 'axis-radial-8-transverse-2',
    localStabilityStatus: ok ? 'stable-axis-well' : 'unstable-axis-well',
    ok,
  };
}

function buildSusceptibilityRow(
  context: ChildContext,
  driveType: PSimplexT26DriveType,
  eta: number,
): PSimplexT26SusceptibilityRow {
  const hessianMatrix = hessianV0At(context.nAxis);
  const sourceAxisCoefficient = 1;
  const sourceA3Coefficient = driveType === 'exact-site' ? 0 : RHO_ONE_THIRD;
  const J = cleanVec3(addVec3(scaleVec3(context.nAxis, sourceAxisCoefficient), scaleVec3(context.nA3, sourceA3Coefficient)));
  const axisSusceptibilityCoefficient = cleanNumber(sourceAxisCoefficient / RADIAL_AXIS_STIFFNESS);
  const a3SusceptibilityCoefficient = cleanNumber(sourceA3Coefficient / TRANSVERSE_STIFFNESS);
  const axisCorrectionMagnitude = cleanNumber(eta * axisSusceptibilityCoefficient);
  const a3TransverseMagnitude = cleanNumber(eta * a3SusceptibilityCoefficient);
  const deltaPhiLinearized = cleanVec3(
    addVec3(
      scaleVec3(context.nAxis, axisCorrectionMagnitude),
      scaleVec3(context.nA3, a3TransverseMagnitude),
    ),
  );
  const approxResponseLinearized = cleanVec3(addVec3(context.nAxis, deltaPhiLinearized));
  const normalizedApproxResponse = normalizeVec3(approxResponseLinearized);
  const approxResponseAxisAlignment = cleanNumber(dotVec3(normalizedApproxResponse, context.nAxis));
  const approxResponseA3Alignment = cleanNumber(dotVec3(normalizedApproxResponse, context.nA3));
  const approxResponseBodyAlignment = cleanNumber(dotVec3(normalizedApproxResponse, context.nBody));
  const a3ToAxisPerturbationRatio =
    Math.abs(axisSusceptibilityCoefficient) > PSIMPLEX_EPSILON
      ? cleanNumber(Math.abs(a3SusceptibilityCoefficient / axisSusceptibilityCoefficient))
      : 0;
  const bodyShadowEstimateStatus = classifyBodyShadowEstimateStatus(driveType, eta, approxResponseAxisAlignment, approxResponseBodyAlignment);
  const primaryClassification = primaryClassificationFor(driveType, bodyShadowEstimateStatus);
  const secondaryClassifications = secondaryClassificationsFor(driveType, bodyShadowEstimateStatus);
  const A3SusceptibilityStatus = driveType === 'exact-site' ? 'absent' : 'active-linearized';
  const bodyStatus = bodyStatusFor(driveType, bodyShadowEstimateStatus);
  const boundaryStatuses = buildBoundaryStatuses();
  const row: Omit<PSimplexT26SusceptibilityRow, 'ok'> = {
    rowId: `T26-${context.childId}-${driveToken(driveType)}-eta-${etaToken(eta)}`,
    childId: context.childId,
    driveType,
    eta: cleanNumber(eta),
    nAxis: context.nAxis,
    nA3: context.nA3,
    nBody: context.nBody,
    J,
    sourceAxisCoefficient,
    sourceA3Coefficient: cleanNumber(sourceA3Coefficient),
    hessianMatrix,
    radialAxisStiffness: RADIAL_AXIS_STIFFNESS,
    transverseA3Stiffness: TRANSVERSE_STIFFNESS,
    deltaPhiLinearized,
    axisCorrectionMagnitude,
    a3TransverseMagnitude,
    axisSusceptibilityCoefficient,
    a3SusceptibilityCoefficient,
    a3ToAxisPerturbationRatio,
    approxResponseLinearized,
    approxResponseAxisAlignment,
    approxResponseA3Alignment,
    approxResponseBodyAlignment,
    linearizedAxisBodyCrossingEta: cleanNumber(LINEARIZED_AXIS_BODY_CROSSING_ETA),
    bodyShadowEstimateStatus,
    primaryClassification,
    secondaryClassifications,
    A3SusceptibilityStatus,
    bodyStatus,
    responseGroundingStatus: 'local-susceptibility-only',
    responseClosureStatus: 'not-closed-response',
    boundaryStatuses,
  };

  return {
    ...row,
    ok: susceptibilityRowPasses(row),
  };
}

function susceptibilityRowPasses(row: Omit<PSimplexT26SusceptibilityRow, 'ok'>): boolean {
  const exactSiteOk =
    row.driveType !== 'exact-site' ||
    (row.A3SusceptibilityStatus === 'absent' &&
      row.a3SusceptibilityCoefficient === 0 &&
      row.a3TransverseMagnitude === 0 &&
      row.bodyStatus === 'body-absent' &&
      row.primaryClassification === 'exact-axis-response');
  const p2Ok =
    row.driveType !== 'P2(1/3)-germ' ||
    (row.A3SusceptibilityStatus === 'active-linearized' &&
      nearlyEqual(row.a3SusceptibilityCoefficient, 1 / 6) &&
      nearlyEqual(row.axisSusceptibilityCoefficient, 1 / 8) &&
      nearlyEqual(row.a3ToAxisPerturbationRatio, 4 / 3) &&
      row.bodyShadowEstimateStatus === 'axis-dominant-below-linearized-crossing');

  return (
    exactSiteOk &&
    p2Ok &&
    row.radialAxisStiffness === RADIAL_AXIS_STIFFNESS &&
    row.transverseA3Stiffness === TRANSVERSE_STIFFNESS &&
    row.responseGroundingStatus === 'local-susceptibility-only' &&
    row.responseClosureStatus === 'not-closed-response' &&
    boundaryStatusesPass(row.boundaryStatuses)
  );
}

function buildAntipodalSusceptibilityCovarianceRows(
  rows: readonly PSimplexT26SusceptibilityRow[],
): PSimplexT26AntipodalSusceptibilityCovarianceRow[] {
  return ETA_SAMPLES.flatMap((eta) =>
    DRIVE_TYPES.flatMap((driveType) =>
      ANTIPODAL_PAIRS.map(([leftChild, rightChild]) => {
        const left = rowForChildDriveEta(rows, leftChild, driveType, eta);
        const right = rowForChildDriveEta(rows, rightChild, driveType, eta);
        const deltaPhiSum = cleanVec3(addVec3(left.deltaPhiLinearized, right.deltaPhiLinearized));
        const approxResponseSum = cleanVec3(addVec3(left.approxResponseLinearized, right.approxResponseLinearized));
        const deltaPhiSumNorm = cleanNumber(normVec3(deltaPhiSum));
        const approxResponseSumNorm = cleanNumber(normVec3(approxResponseSum));
        const ok = deltaPhiSumNorm <= PSIMPLEX_EPSILON && approxResponseSumNorm <= PSIMPLEX_EPSILON;

        return {
          eta: cleanNumber(eta),
          driveType,
          pair: `${leftChild}<->${rightChild}`,
          leftChild,
          rightChild,
          leftDeltaPhi: left.deltaPhiLinearized,
          rightDeltaPhi: right.deltaPhiLinearized,
          deltaPhiSum,
          deltaPhiSumNorm,
          leftApproxResponse: left.approxResponseLinearized,
          rightApproxResponse: right.approxResponseLinearized,
          approxResponseSum,
          approxResponseSumNorm,
          antipodalSusceptibilityCovarianceStatus: ok ? 'holds' : 'fails',
          ok,
        };
      }),
    ),
  );
}

function buildTangentToBodyRow(context: ChildContext): PSimplexT26TangentToBodyRow {
  const axisProjection = scaleVec3(context.nAxis, dotVec3(context.nBody, context.nAxis));
  const tBody = cleanVec3(normalizeVec3(subVec3(context.nBody, axisProjection)));
  const tBodyAlignmentWithA3 = cleanNumber(dotVec3(tBody, context.nA3));
  const ok = tBodyAlignmentWithA3 >= 1 - PSIMPLEX_EPSILON;

  return {
    childId: context.childId,
    nAxis: context.nAxis,
    nA3: context.nA3,
    nBody: context.nBody,
    tBody,
    tBodyAlignmentWithA3,
    tangentStatus: ok ? 'A3-is-bodyward-tangent' : 'A3-bodyward-tangent-mismatch',
    bodyInterpretationBoundary: 'bodyward-tangent-not-body-response',
    ok,
  };
}

function buildLinearizedBodyShadowEstimateRow(eta: number): PSimplexT26LinearizedBodyShadowEstimateRow {
  const axisCoefficientA = cleanNumber(1 + eta / RADIAL_AXIS_STIFFNESS);
  const transverseCoefficientT = cleanNumber(eta / 6);
  const transverseToAxisRatio = cleanNumber(transverseCoefficientT / axisCoefficientA);
  const denominator = Math.sqrt(axisCoefficientA ** 2 + transverseCoefficientT ** 2);
  const axisAlignment = cleanNumber(axisCoefficientA / denominator);
  const a3Alignment = cleanNumber(transverseCoefficientT / denominator);
  const bodyAlignment = cleanNumber((axisCoefficientA + BODY_REFERENCE_RHO * transverseCoefficientT) / (denominator * Math.sqrt(3)));
  const bodyShadowEstimateStatus =
    transverseToAxisRatio >= AXIS_BODY_CROSSING_RATIO || bodyAlignment >= axisAlignment
      ? 'linearized-body-shadow-risk'
      : 'axis-dominant-below-linearized-crossing';

  return {
    tableId: 'linearized-response-body-shadow-estimate',
    eta: cleanNumber(eta),
    axisCoefficientA,
    transverseCoefficientT,
    transverseToAxisRatio,
    axisBodyCrossingRatio: cleanNumber(AXIS_BODY_CROSSING_RATIO),
    linearizedAxisBodyCrossingEta: cleanNumber(LINEARIZED_AXIS_BODY_CROSSING_ETA),
    axisAlignment,
    a3Alignment,
    bodyAlignment,
    bodyShadowEstimateStatus,
    ok: bodyShadowEstimateStatus === 'axis-dominant-below-linearized-crossing',
  };
}

function buildParentEvidenceRows(parentReports: ParentReports): PSimplexT26ParentEvidenceRow[] {
  return [
    {
      ledgerId: 'T25',
      verdict: parentReports.t25.verdict,
      summaryVerdict: parentReports.t25.summaryVerdict,
      ok:
        parentReports.t25.ok &&
        parentReports.t25.integrityIssueCount === 0 &&
        parentReports.t25.geometricVerdict === 'PASS' &&
        parentReports.t25.recommendedFirstGermConventionRatioExpression === '1/3' &&
        parentReports.t25.sqrt3RatioStatus === 'risky',
      integrityIssueCount: parentReports.t25.integrityIssueCount,
      carriedFact:
        'P2sqrt3 was body-shadow risky; rho=1/3 was the largest safe sampled P2rho germ ratio; response sector unresolved.',
    },
    {
      ledgerId: 'T24',
      verdict: parentReports.t24.verdict,
      summaryVerdict: parentReports.t24.summaryVerdict,
      ok:
        parentReports.t24.ok &&
        parentReports.t24.integrityIssueCount === 0 &&
        parentReports.t24.perChildGermVectors.every(
          (row) => row.selectedA3Root === P2_ORIENTED_ROOT_BY_CHILD[row.childId],
        ),
      integrityIssueCount: parentReports.t24.integrityIssueCount,
      carriedFact: 'P2-oriented sibling-fan germ support can law-activate A3 residuals.',
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
      carriedFact: 'P2 remained a coherent support-activation policy family.',
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
      carriedFact: 'Exact-site reading keeps axis active and A3 inactive.',
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
      carriedFact: 'A3 residual-origin decomposition supplies the selected A3 root law.',
    },
    {
      ledgerId: 'T20',
      verdict: parentReports.t20.verdict,
      summaryVerdict: null,
      ok: parentReports.t20.ok && parentReports.t20.integrityIssueCount === 0,
      integrityIssueCount: parentReports.t20.integrityIssueCount,
      carriedFact: 'Response closure and runtime adoption remain outside forcing-scale reachability.',
    },
    {
      ledgerId: 'C1/C2',
      verdict: null,
      summaryVerdict: null,
      ok: true,
      integrityIssueCount: null,
      carriedFact: 'Closed axis plus provisional A3 remains the research posture; body response remains quarantined.',
    },
  ];
}

function buildSusceptibilitySummary(
  rows: readonly PSimplexT26SusceptibilityRow[],
  driveType: PSimplexT26DriveType,
): PSimplexT26SusceptibilitySummary {
  const driveRows = rows.filter((row) => row.driveType === driveType);
  const representative = driveRows[0];

  return {
    rowCount: driveRows.length,
    driveType,
    a3SusceptibilityStatus: driveType === 'exact-site' ? 'absent' : 'active-linearized',
    axisSusceptibilityCoefficient: representative?.axisSusceptibilityCoefficient ?? 0,
    a3SusceptibilityCoefficient: representative?.a3SusceptibilityCoefficient ?? 0,
    a3ToAxisPerturbationRatio: representative?.a3ToAxisPerturbationRatio ?? 0,
    allRowsOk: driveRows.length === PSIMPLEX_CHILD_SOURCE_IDS.length * ETA_SAMPLES.length && driveRows.every((row) => row.ok),
  };
}

function buildAntipodalSusceptibilitySummary(
  rows: readonly PSimplexT26AntipodalSusceptibilityCovarianceRow[],
): PSimplexT26AntipodalSusceptibilitySummary {
  const holdsCount = rows.filter((row) => row.ok).length;
  const failedCount = rows.length - holdsCount;

  return {
    rowCount: rows.length,
    holdsCount,
    failedCount,
    status: failedCount === 0 ? 'holds' : 'fails',
    ok: rows.length === ANTIPODAL_PAIRS.length * DRIVE_TYPES.length * ETA_SAMPLES.length && failedCount === 0,
  };
}

function buildTangentToBodySummary(rows: readonly PSimplexT26TangentToBodyRow[]): PSimplexT26TangentToBodySummary {
  const tangentVerifiedCount = rows.filter((row) => row.ok).length;

  return {
    rowCount: rows.length,
    tangentVerifiedCount,
    status: tangentVerifiedCount === rows.length ? 'A3-is-bodyward-tangent' : 'A3-bodyward-tangent-mismatch',
    boundary: 'bodyward-tangent-not-body-response',
    ok: rows.length === PSIMPLEX_CHILD_SOURCE_IDS.length && tangentVerifiedCount === rows.length,
  };
}

function buildLinearizedBodyShadowSummary(
  rows: readonly PSimplexT26LinearizedBodyShadowEstimateRow[],
): PSimplexT26LinearizedBodyShadowSummary {
  const sampledRiskRowCount = rows.filter((row) => row.bodyShadowEstimateStatus === 'linearized-body-shadow-risk').length;

  return {
    rowCount: rows.length,
    linearizedAxisBodyCrossingEta: cleanNumber(LINEARIZED_AXIS_BODY_CROSSING_ETA),
    sampledEtaMax: Math.max(...ETA_SAMPLES),
    sampledRiskRowCount,
    allSampledRowsAxisDominant: sampledRiskRowCount === 0 && rows.every((row) => row.ok),
    status: sampledRiskRowCount === 0 ? 'axis-dominant-through-sampled-eta' : 'sampled-linearized-body-shadow-risk',
    ok: rows.length === ETA_SAMPLES.length && sampledRiskRowCount === 0,
  };
}

function buildGuardRows(args: {
  parentReports: ParentReports;
  hessianVerificationRows: readonly PSimplexT26HessianVerificationRow[];
  susceptibilityRows: readonly PSimplexT26SusceptibilityRow[];
  antipodalSusceptibilityCovarianceRows: readonly PSimplexT26AntipodalSusceptibilityCovarianceRow[];
  tangentToBodyRows: readonly PSimplexT26TangentToBodyRow[];
  linearizedBodyShadowEstimateRows: readonly PSimplexT26LinearizedBodyShadowEstimateRow[];
  invalidInterpretationBoundaryRows: readonly PSimplexT26InvalidInterpretationBoundaryRow[];
}): PSimplexT26GuardRow[] {
  const exactRows = args.susceptibilityRows.filter((row) => row.driveType === 'exact-site');
  const p2Rows = args.susceptibilityRows.filter((row) => row.driveType === 'P2(1/3)-germ');
  const parentT25Preserved =
    args.parentReports.t25.ok &&
    args.parentReports.t25.integrityIssueCount === 0 &&
    args.parentReports.t25.geometricVerdict === 'PASS' &&
    args.parentReports.t25.recommendedFirstGermConventionRatioExpression === '1/3';
  const p2OneThirdRatioPreserved = p2Rows.every(
    (row) => nearlyEqual(row.sourceA3Coefficient, RHO_ONE_THIRD) && row.driveType === 'P2(1/3)-germ',
  );
  const p2OrientationConventionPreserved =
    args.susceptibilityRows.every((row) => {
      const root = P2_ORIENTED_ROOT_BY_CHILD[row.childId];
      const parentRow = args.parentReports.t25.rhoRows.find(
        (entry) => entry.childId === row.childId && entry.rhoExpression === '1/3',
      );

      return parentRow?.selectedA3Root === root && parentRow.orientedGermEdge === ORIENTED_GERM_EDGE_BY_CHILD[row.childId];
    }) &&
    args.parentReports.t24.perChildGermVectors.every(
      (row) => row.selectedA3Root === P2_ORIENTED_ROOT_BY_CHILD[row.childId],
    );
  const hessianStiffnessVerified = args.hessianVerificationRows.every(
    (row) =>
      row.ok &&
      nearlyEqual(row.radialAxisStiffness, RADIAL_AXIS_STIFFNESS) &&
      nearlyEqual(row.transverseA3Stiffness, TRANSVERSE_STIFFNESS) &&
      nearlyEqual(row.transverseOtherStiffness, TRANSVERSE_STIFFNESS),
  );
  const exactSiteZeroA3SusceptibilityVerified = exactRows.every(
    (row) => row.ok && row.a3SusceptibilityCoefficient === 0 && row.a3TransverseMagnitude === 0,
  );
  const p2OneThirdA3SusceptibilityVerified = p2Rows.every(
    (row) => row.ok && row.A3SusceptibilityStatus === 'active-linearized' && row.a3TransverseMagnitude > 0,
  );
  const a3SusceptibilityCoefficientVerified = p2Rows.every((row) => nearlyEqual(row.a3SusceptibilityCoefficient, 1 / 6));
  const perturbationRatioBoundaryPreserved = p2Rows.every(
    (row) => nearlyEqual(row.a3ToAxisPerturbationRatio, 4 / 3) && row.responseClosureStatus === 'not-closed-response',
  );
  const bodywardTangentNotPromotedToBodyResponse =
    args.tangentToBodyRows.every((row) => row.bodyInterpretationBoundary === 'bodyward-tangent-not-body-response') &&
    args.susceptibilityRows.every((row) => row.bodyStatus !== 'linearized-body-shadow-risk');
  const responseClosureNotClaimed = args.susceptibilityRows.every(
    (row) => row.responseClosureStatus === 'not-closed-response' && row.boundaryStatuses.responseClosureStatus === 'not-closed-response',
  );
  const responseGroundingLimitedToLocalSusceptibility = args.susceptibilityRows.every(
    (row) =>
      row.responseGroundingStatus === 'local-susceptibility-only' &&
      row.boundaryStatuses.responseGroundingStatus === 'local-susceptibility-only',
  );
  const fieldCueSemanticRouteDefectPacketTopologyBoundaryPreserved =
    args.invalidInterpretationBoundaryRows.every((row) => row.enforced) &&
    args.susceptibilityRows.every(
      (row) =>
        row.boundaryStatuses.fieldCueStatus === 'not-fieldcue' &&
        row.boundaryStatuses.semanticStatus === 'not-semantic-naming' &&
        row.boundaryStatuses.routeHolonomyStatus === 'not-route-walk-holonomy' &&
        row.boundaryStatuses.defectVortexStatus === 'not-defect-vortex' &&
        row.boundaryStatuses.packetStatus === 'not-packet-interpretation' &&
        row.boundaryStatuses.topologyStatus === 'not-topology-workspace',
    );
  const runtimeSubstrateNotAuthorized = args.susceptibilityRows.every(
    (row) => row.boundaryStatuses.runtimeSubstrateStatus === 'not-runtime-substrate',
  );

  return [
    guardRow('parentT25Preserved', parentT25Preserved, 'T25 is available and selects rho=1/3 as the safe sampled P2rho ratio.'),
    guardRow('p2OneThirdRatioPreserved', p2OneThirdRatioPreserved, 'Every germ row uses source coefficient rho = 1/3.'),
    guardRow(
      'p2OrientationConventionPreserved',
      p2OrientationConventionPreserved,
      'The P2 oriented root map is verified against T25 rho=1/3 rows and T24 germ rows.',
    ),
    guardRow('hessianStiffnessVerified', hessianStiffnessVerified, 'Hessian stiffness is 8 radial and 2 transverse.'),
    guardRow(
      'axisWellLocalStabilityVerified',
      args.hessianVerificationRows.every((row) => row.localStabilityStatus === 'stable-axis-well'),
      'Every signed axis well has positive stiffness in radial and transverse directions.',
    ),
    guardRow(
      'exactSiteZeroA3SusceptibilityVerified',
      exactSiteZeroA3SusceptibilityVerified,
      'Exact-site forcing has zero A3 susceptibility.',
    ),
    guardRow(
      'p2OneThirdA3SusceptibilityVerified',
      p2OneThirdA3SusceptibilityVerified,
      'P2(1/3) forcing has nonzero A3 susceptibility along the selected root.',
    ),
    guardRow('a3SusceptibilityCoefficientVerified', a3SusceptibilityCoefficientVerified, 'P2(1/3) A3 coefficient is 1/6.'),
    guardRow(
      'perturbationRatioBoundaryPreserved',
      perturbationRatioBoundaryPreserved,
      'The 4/3 ratio is recorded as a perturbation-only ratio, not response closure.',
    ),
    guardRow(
      'antipodalSusceptibilityCovarianceVerified',
      args.antipodalSusceptibilityCovarianceRows.length === ANTIPODAL_PAIRS.length * DRIVE_TYPES.length * ETA_SAMPLES.length &&
        args.antipodalSusceptibilityCovarianceRows.every((row) => row.ok),
      'Antipodal pairs have opposed linearized displacements and opposed approximate responses.',
    ),
    guardRow(
      'tangentToBodyVerified',
      args.tangentToBodyRows.length === PSIMPLEX_CHILD_SOURCE_IDS.length && args.tangentToBodyRows.every((row) => row.ok),
      'The selected P2 A3 root is the tangent direction from each axis well toward its body reference.',
    ),
    guardRow(
      'bodywardTangentNotPromotedToBodyResponse',
      bodywardTangentNotPromotedToBodyResponse,
      'The bodyward tangent relation is bounded away from body-response promotion.',
    ),
    guardRow(
      'linearizedBodyShadowEstimateProvided',
      args.linearizedBodyShadowEstimateRows.length === ETA_SAMPLES.length &&
        args.linearizedBodyShadowEstimateRows.every((row) => row.ok),
      'The linearized axis/body crossing estimate is reported and sampled eta rows remain below it.',
    ),
    guardRow('responseClosureNotClaimed', responseClosureNotClaimed, 'Every row remains not-closed-response.'),
    guardRow(
      'responseGroundingLimitedToLocalSusceptibility',
      responseGroundingLimitedToLocalSusceptibility,
      'Every row limits response grounding to local susceptibility only.',
    ),
    guardRow(
      'fieldCueSemanticRouteDefectPacketTopologyBoundaryPreserved',
      fieldCueSemanticRouteDefectPacketTopologyBoundaryPreserved,
      'Field-cue, semantic, route, defect, packet, and topology boundaries are negative-only.',
    ),
    guardRow(
      'runtimeSubstrateNotAuthorized',
      runtimeSubstrateNotAuthorized,
      'No row authorizes runtime substrate extraction or runtime adoption.',
    ),
  ];
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT26InvalidInterpretationBoundaryRow[] {
  return [
    {
      boundaryId: 'not-closed-A3-response',
      statement: 'Negative boundary: A3 response is not closed.',
      enforced: true,
    },
    {
      boundaryId: 'not-operationally-grounded-A3-response',
      statement: 'Negative boundary: A3 response is not operationally grounded.',
      enforced: true,
    },
    {
      boundaryId: 'not-fieldcue-semantic-route-defect-packet-topology',
      statement:
        'Negative boundary: A3 residual is not FieldCue, semantic meaning, route/walk/holonomy, defect/vortex behavior, packet interpretation, or topology workspace.',
      enforced: true,
    },
    {
      boundaryId: 'bodyward-tangent-not-body-response',
      statement: 'Negative boundary: Bodyward tangent does not mean body response.',
      enforced: true,
    },
    {
      boundaryId: 'not-runtime-substrate-extraction-or-adoption',
      statement:
        'Negative boundary: this does not authorize runtime substrate extraction and P2(1/3) is not runtime adopted.',
      enforced: true,
    },
  ];
}

function buildIntegrityIssues(args: {
  parentEvidenceRows: readonly PSimplexT26ParentEvidenceRow[];
  hessianVerificationRows: readonly PSimplexT26HessianVerificationRow[];
  susceptibilityRows: readonly PSimplexT26SusceptibilityRow[];
  antipodalSusceptibilityCovarianceRows: readonly PSimplexT26AntipodalSusceptibilityCovarianceRow[];
  tangentToBodyRows: readonly PSimplexT26TangentToBodyRow[];
  linearizedBodyShadowEstimateRows: readonly PSimplexT26LinearizedBodyShadowEstimateRow[];
  exactSiteSusceptibilitySummary: PSimplexT26SusceptibilitySummary;
  p2OneThirdSusceptibilitySummary: PSimplexT26SusceptibilitySummary;
  antipodalSusceptibilitySummary: PSimplexT26AntipodalSusceptibilitySummary;
  tangentToBodySummary: PSimplexT26TangentToBodySummary;
  linearizedBodyShadowSummary: PSimplexT26LinearizedBodyShadowSummary;
  guardRows: readonly PSimplexT26GuardRow[];
}): string[] {
  const issues: string[] = [];

  if (args.parentEvidenceRows.some((row) => !row.ok)) {
    issues.push('At least one required parent evidence row is unavailable or inconsistent.');
  }

  if (args.hessianVerificationRows.length !== PSIMPLEX_CHILD_SOURCE_IDS.length || args.hessianVerificationRows.some((row) => !row.ok)) {
    issues.push('Hessian/stiffness verification is incomplete or failed.');
  }

  if (args.susceptibilityRows.length !== PSIMPLEX_CHILD_SOURCE_IDS.length * DRIVE_TYPES.length * ETA_SAMPLES.length) {
    issues.push(`Expected 60 susceptibility rows, got ${args.susceptibilityRows.length}.`);
  }

  if (args.susceptibilityRows.some((row) => !row.ok)) {
    issues.push('At least one susceptibility row failed.');
  }

  if (!args.exactSiteSusceptibilitySummary.allRowsOk || args.exactSiteSusceptibilitySummary.a3SusceptibilityCoefficient !== 0) {
    issues.push('Exact-site rows did not preserve zero A3 susceptibility.');
  }

  if (!args.p2OneThirdSusceptibilitySummary.allRowsOk || !nearlyEqual(args.p2OneThirdSusceptibilitySummary.a3SusceptibilityCoefficient, 1 / 6)) {
    issues.push('P2(1/3) rows did not confirm A3 susceptibility coefficient 1/6.');
  }

  if (!nearlyEqual(args.p2OneThirdSusceptibilitySummary.a3ToAxisPerturbationRatio, 4 / 3)) {
    issues.push('P2(1/3) perturbation ratio was not 4/3.');
  }

  if (!args.antipodalSusceptibilitySummary.ok || args.antipodalSusceptibilityCovarianceRows.some((row) => !row.ok)) {
    issues.push('Antipodal susceptibility covariance failed.');
  }

  if (!args.tangentToBodySummary.ok || args.tangentToBodyRows.some((row) => !row.ok)) {
    issues.push('Tangent-to-body verification failed.');
  }

  if (!args.linearizedBodyShadowSummary.ok || args.linearizedBodyShadowEstimateRows.some((row) => !row.ok)) {
    issues.push('At least one sampled eta row reached linearized body-shadow risk.');
  }

  if (args.guardRows.some((row) => !row.ok)) {
    issues.push('At least one required T26 guard failed.');
  }

  return [...new Set(issues)];
}

function hessianV0At(phi: PSimplexVec3): PSimplexMatrix3 {
  const [x, y, z] = phi;
  const radiusSquared = dotVec3(phi, phi);
  const radialScale = 4 * (radiusSquared - 1);
  const radial: PSimplexMatrix3 = [
    [radialScale + 8 * x * x, 8 * x * y, 8 * x * z],
    [8 * y * x, radialScale + 8 * y * y, 8 * y * z],
    [8 * z * x, 8 * z * y, radialScale + 8 * z * z],
  ];
  const anisotropic: PSimplexMatrix3 = [
    [2 * (y * y + z * z), 4 * x * y, 4 * x * z],
    [4 * y * x, 2 * (x * x + z * z), 4 * y * z],
    [4 * z * x, 4 * z * y, 2 * (x * x + y * y)],
  ];

  return cleanMatrix3(addMatrix3(radial, anisotropic));
}

function expectedHessianForAxis(axis: PSimplexVec3): PSimplexMatrix3 {
  const axisIndex = coordinateIndexForAxis(axis);

  return [
    [axisIndex === 0 ? 8 : 2, 0, 0],
    [0, axisIndex === 1 ? 8 : 2, 0],
    [0, 0, axisIndex === 2 ? 8 : 2],
  ];
}

function expectedHessianClassForAxis(axis: PSimplexVec3): PSimplexT26HessianVerificationRow['expectedHessianClass'] {
  const axisIndex = coordinateIndexForAxis(axis);

  if (axisIndex === 0) {
    return '+x/-x';
  }

  return axisIndex === 1 ? '+y/-y' : '+z/-z';
}

function classifyBodyShadowEstimateStatus(
  driveType: PSimplexT26DriveType,
  eta: number,
  axisAlignment: number,
  bodyAlignment: number,
): PSimplexT26BodyShadowEstimateStatus {
  if (driveType === 'exact-site') {
    return 'body-absent';
  }

  return eta >= LINEARIZED_AXIS_BODY_CROSSING_ETA || bodyAlignment >= axisAlignment
    ? 'linearized-body-shadow-risk'
    : 'axis-dominant-below-linearized-crossing';
}

function primaryClassificationFor(
  driveType: PSimplexT26DriveType,
  bodyShadowEstimateStatus: PSimplexT26BodyShadowEstimateStatus,
): PSimplexT26Classification {
  if (driveType === 'exact-site') {
    return 'exact-axis-response';
  }

  return bodyShadowEstimateStatus === 'linearized-body-shadow-risk'
    ? 'linearized-body-shadow-risk'
    : 'axis-dominant-A3-susceptibility';
}

function secondaryClassificationsFor(
  driveType: PSimplexT26DriveType,
  bodyShadowEstimateStatus: PSimplexT26BodyShadowEstimateStatus,
): PSimplexT26Classification[] {
  if (driveType === 'exact-site') {
    return ['not-response-closure'];
  }

  const secondary: PSimplexT26Classification[] = [
    'axis-with-A3-susceptibility',
    'bodyward-tangent-susceptibility',
    'not-response-closure',
  ];

  if (bodyShadowEstimateStatus === 'linearized-body-shadow-risk') {
    secondary.unshift('linearized-body-shadow-risk');
  }

  return secondary;
}

function bodyStatusFor(
  driveType: PSimplexT26DriveType,
  bodyShadowEstimateStatus: PSimplexT26BodyShadowEstimateStatus,
): PSimplexT26BodyStatus {
  if (driveType === 'exact-site') {
    return 'body-absent';
  }

  return bodyShadowEstimateStatus === 'linearized-body-shadow-risk'
    ? 'linearized-body-shadow-risk'
    : 'bodyward-tangent-only';
}

function classifyVerdict(
  localSusceptibilityVerdict: PSimplexT26LocalSusceptibilityVerdict,
  sampledLinearizedRisk: boolean,
): PSimplexT26Verdict {
  if (localSusceptibilityVerdict === 'FAIL' || sampledLinearizedRisk) {
    return 'FAIL';
  }

  return 'PASS';
}

function classifySummaryVerdict(
  localSusceptibilityVerdict: PSimplexT26LocalSusceptibilityVerdict,
  sampledLinearizedRisk: boolean,
): PSimplexT26SummaryVerdict {
  if (localSusceptibilityVerdict === 'FAIL') {
    return 'P2-one-third-susceptibility-inconclusive';
  }

  return sampledLinearizedRisk
    ? 'P2-one-third-body-shadow-risk'
    : 'P2-one-third-A3-susceptibility-confirmed';
}

function classifyAcceptabilityStatus(
  localSusceptibilityVerdict: PSimplexT26LocalSusceptibilityVerdict,
  verdict: PSimplexT26Verdict,
  sampledLinearizedRisk: boolean,
): PSimplexT26AcceptabilityStatus {
  if (localSusceptibilityVerdict === 'FAIL') {
    return 'inconclusive';
  }

  if (sampledLinearizedRisk) {
    return 'not-acceptable-body-shadow-risk';
  }

  return verdict === 'PASS' ? 'acceptable-as-local-susceptibility-germ' : 'acceptable-with-linearized-only-caveat';
}

function classifyRecommendedResearchConsequence(
  localSusceptibilityVerdict: PSimplexT26LocalSusceptibilityVerdict,
  verdict: PSimplexT26Verdict,
  sampledLinearizedRisk: boolean,
): PSimplexT26RecommendedResearchConsequence {
  if (localSusceptibilityVerdict === 'FAIL') {
    return 'T26-susceptibility-inconclusive-do-not-proceed';
  }

  if (sampledLinearizedRisk) {
    return 'P2-one-third-rejected-by-linearized-body-shadow-risk';
  }

  return verdict === 'PASS'
    ? 'P2-one-third-local-A3-susceptibility-established'
    : 'P2-one-third-local-susceptibility-established-nonlinear-confirmation-needed';
}

function buildBoundaryStatuses(): PSimplexT26BoundaryStatuses {
  return {
    policyStatus: 'policy-relative',
    susceptibilityStatus: 'local-linearized-susceptibility',
    responseGroundingStatus: 'local-susceptibility-only',
    responseClosureStatus: 'not-closed-response',
    fieldCueStatus: 'not-fieldcue',
    semanticStatus: 'not-semantic-naming',
    routeHolonomyStatus: 'not-route-walk-holonomy',
    defectVortexStatus: 'not-defect-vortex',
    packetStatus: 'not-packet-interpretation',
    topologyStatus: 'not-topology-workspace',
    runtimeSubstrateStatus: 'not-runtime-substrate',
  };
}

function boundaryStatusesPass(statuses: PSimplexT26BoundaryStatuses): boolean {
  return (
    statuses.policyStatus === 'policy-relative' &&
    statuses.susceptibilityStatus === 'local-linearized-susceptibility' &&
    statuses.responseGroundingStatus === 'local-susceptibility-only' &&
    statuses.responseClosureStatus === 'not-closed-response' &&
    statuses.fieldCueStatus === 'not-fieldcue' &&
    statuses.semanticStatus === 'not-semantic-naming' &&
    statuses.routeHolonomyStatus === 'not-route-walk-holonomy' &&
    statuses.defectVortexStatus === 'not-defect-vortex' &&
    statuses.packetStatus === 'not-packet-interpretation' &&
    statuses.topologyStatus === 'not-topology-workspace' &&
    statuses.runtimeSubstrateStatus === 'not-runtime-substrate'
  );
}

function guardRow(guardId: PSimplexT26GuardRow['guardId'], ok: boolean, evidence: string): PSimplexT26GuardRow {
  return {
    guardId,
    status: ok ? 'pass' : 'fail',
    evidence,
    ok,
  };
}

function rowForChildDriveEta(
  rows: readonly PSimplexT26SusceptibilityRow[],
  childId: PSimplexChildSourceId,
  driveType: PSimplexT26DriveType,
  eta: number,
): PSimplexT26SusceptibilityRow {
  const row = rows.find(
    (entry) => entry.childId === childId && entry.driveType === driveType && Math.abs(entry.eta - eta) <= PSIMPLEX_EPSILON,
  );

  if (!row) {
    throw new Error(`Missing T26 susceptibility row for ${childId}, ${driveType}, eta=${eta}`);
  }

  return row;
}

function addMatrix3(left: PSimplexMatrix3, right: PSimplexMatrix3): PSimplexMatrix3 {
  return [
    [left[0][0] + right[0][0], left[0][1] + right[0][1], left[0][2] + right[0][2]],
    [left[1][0] + right[1][0], left[1][1] + right[1][1], left[1][2] + right[1][2]],
    [left[2][0] + right[2][0], left[2][1] + right[2][1], left[2][2] + right[2][2]],
  ];
}

function cleanMatrix3(matrix: PSimplexMatrix3): PSimplexMatrix3 {
  return [
    [cleanNumber(matrix[0][0]), cleanNumber(matrix[0][1]), cleanNumber(matrix[0][2])],
    [cleanNumber(matrix[1][0]), cleanNumber(matrix[1][1]), cleanNumber(matrix[1][2])],
    [cleanNumber(matrix[2][0]), cleanNumber(matrix[2][1]), cleanNumber(matrix[2][2])],
  ];
}

function matrixVec3(matrix: PSimplexMatrix3, value: PSimplexVec3): PSimplexVec3 {
  return [
    matrix[0][0] * value[0] + matrix[0][1] * value[1] + matrix[0][2] * value[2],
    matrix[1][0] * value[0] + matrix[1][1] * value[1] + matrix[1][2] * value[2],
    matrix[2][0] * value[0] + matrix[2][1] * value[1] + matrix[2][2] * value[2],
  ];
}

function quadraticForm(value: PSimplexVec3, matrix: PSimplexMatrix3): number {
  return dotVec3(value, matrixVec3(matrix, value));
}

function matrixNearlyEqual(left: PSimplexMatrix3, right: PSimplexMatrix3): boolean {
  return left.every((row, rowIndex) =>
    row.every((value, columnIndex) => Math.abs(value - right[rowIndex][columnIndex]) <= PSIMPLEX_EPSILON),
  );
}

function crossVec3(left: PSimplexVec3, right: PSimplexVec3): PSimplexVec3 {
  return [
    left[1] * right[2] - left[2] * right[1],
    left[2] * right[0] - left[0] * right[2],
    left[0] * right[1] - left[1] * right[0],
  ];
}

function coordinateIndexForAxis(axis: PSimplexVec3): 0 | 1 | 2 {
  const absolute = axis.map((value) => Math.abs(value));
  const index = absolute.indexOf(Math.max(...absolute));

  if (index === 0 || index === 1 || index === 2) {
    return index;
  }

  throw new Error(`Unable to classify axis ${axis.join(',')}`);
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

function nearlyEqual(left: number, right: number): boolean {
  return Math.abs(left - right) <= PSIMPLEX_EPSILON;
}

function driveToken(driveType: PSimplexT26DriveType): string {
  return driveType === 'exact-site' ? 'exact-site' : 'p2-one-third-germ';
}

function etaToken(eta: number): string {
  return String(eta).replace(/\./g, '-');
}

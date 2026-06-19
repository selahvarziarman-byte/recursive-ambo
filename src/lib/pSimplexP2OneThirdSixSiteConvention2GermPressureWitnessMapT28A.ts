import {
  buildPSimplexP2OneThirdNonlinearAxisBranchContinuationAuditT27Report,
  type PSimplexT27SummaryVerdict,
} from './pSimplexP2OneThirdNonlinearAxisBranchContinuationAuditT27';
import {
  PSIMPLEX_A3_ROOT_DEFINITIONS,
  PSIMPLEX_CHILD_SOURCE_IDS,
  childAxisDefinition,
  childAxisVector,
  primalSourceVector,
  signedAxisVector,
  type PSimplexA3RootId,
  type PSimplexChildEdgeId,
  type PSimplexChildSourceId,
  type PSimplexPrimalSourceId,
  type PSimplexSignedAxis,
} from './pSimplexCoreGeometry';
import {
  cleanNumber,
  cleanVec3,
  dotVec3,
  normVec3,
  normalizeVec3,
  PSIMPLEX_EPSILON,
  subVec3,
  type PSimplexVec3,
} from './pSimplexVectorMath';

export type PSimplexT28ASummaryVerdict =
  | 'six-site-pressure-witness-map-coherent'
  | 'representative-T27-valid-six-site-propagation-requires-additional-convention-work'
  | 'T27-representative-branch-cannot-map-to-six-site-witness-structure';
export type PSimplexT28AAxisPair = '+x/-x' | '+y/-y' | '+z/-z';
export type PSimplexT28AConventionId = 'P2-one-third-convention-2';
export type PSimplexT28AWitnessClassification = 'finite-amplitude-germ-stability-witness';
export type PSimplexT28APressureClassification =
  | 'controlled-transverse-A3-pressure'
  | 'exact-site-vs-germ-contrast'
  | 'axis-dominant-germ-pressure';
export type PSimplexT28APressurePrimitiveStatus = 'structural-witness-only';
export type PSimplexT28AFieldPressurePrimitiveStatus = 'structural-pressure-primitive-not-fieldcue';
export type PSimplexT28ASiteNamingStatus = 'not-named';
export type PSimplexT28ASemanticInterpretationStatus = 'not-semantic-interpretation';
export type PSimplexT28AAxisDominanceStatus =
  | 'axis-dominant-through-tested-range'
  | 'not-axis-dominant-through-tested-range';
export type PSimplexT28ABodyShadowMarginStatus = 'positive-margin' | 'nonpositive-margin';
export type PSimplexT28AExactGermContrastStatus =
  | 'exact-site-axis-only-vs-declared-A3-germ'
  | 'missing-exact-germ-contrast';
export type PSimplexT28ACovarianceStatus = 'signed-opposition-holds' | 'signed-opposition-fails';

export interface PSimplexT28ABoundaryStatuses {
  responseGroundingStatus: 'local-branch-only';
  A3ClosureStatus: 'not-closed-response';
  fieldCueStatus: 'not-fieldcue';
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  runtimeSubstrateStatus: 'not-runtime-substrate';
  bodyStatus: 'not-promoted';
  packetStatus: 'not-packet-interpretation';
  routeHolonomyStatus: 'not-route-walk-holonomy';
  defectVortexStatus: 'not-defect-vortex';
}

export interface PSimplexT28AParentEvidenceRow {
  ledgerId: 'T27';
  method: string;
  diagnosticScope: string;
  representativeChild: 'M_AB';
  summaryVerdict: PSimplexT27SummaryVerdict;
  ok: boolean;
  integrityIssueCount: number;
  inheritedDenseScanRowCount: number;
  inheritedSampledBranchRowCount: number;
  carriedFact: string;
  licenseStatement: 'T27 licenses a six-site Convention-2 germ-pressure witness map, not merely a representative M_AB branch fact.';
}

export interface PSimplexT28AConvention1SubstrateRow extends PSimplexT28ABoundaryStatuses {
  childId: PSimplexChildSourceId;
  sourceEdge: PSimplexChildEdgeId;
  sourceEndpoints: [PSimplexPrimalSourceId, PSimplexPrimalSourceId];
  exactSiteAxis: PSimplexVec3;
  signedAxis: PSimplexSignedAxis;
  axisPair: PSimplexT28AAxisPair;
  antipodalChild: PSimplexChildSourceId;
  exactSiteAxisOnlyStatus: 'exact-site-axis-only';
  exactSiteA3Status: 'exact-site-A3-inactive';
  ok: boolean;
}

export interface PSimplexT28AConvention2GermRow extends PSimplexT28ABoundaryStatuses {
  childId: PSimplexChildSourceId;
  conventionId: PSimplexT28AConventionId;
  p2OrientedRoot: PSimplexA3RootId;
  p2A3GermDirection: PSimplexVec3;
  rhoExpression: '1/3';
  rhoValue: number;
  normalizedBodyShadowThreshold: number;
  coordinateBodyShadowThreshold: number;
  coordinateThresholdStatus: 'coordinate-convention-only';
  branchConvention: 'normalized-axis-A3-plane';
  potentialId: 'pointwise-vector-LG-v0';
  conventionStatus: 'declared-germ-convention';
  ok: boolean;
}

export interface PSimplexT28ASixSiteWitnessRow extends PSimplexT28ABoundaryStatuses {
  childId: PSimplexChildSourceId;
  sourceEdge: PSimplexChildEdgeId;
  antipodalChild: PSimplexChildSourceId;
  parentT27SummaryVerdict: PSimplexT27SummaryVerdict;
  inheritedRepresentativeChild: 'M_AB';
  evidenceTransport: 'signed-coordinate-antipodal-symmetry';
  branchStabilityStatus: string;
  axisDominanceStatus: PSimplexT28AAxisDominanceStatus;
  inheritedMaxRatioBA: number;
  inheritedMaxRatioEta: number;
  normalizedBodyShadowThreshold: number;
  asymptoticPositiveBranchRatioBound: number;
  sampledBodyShadowMargin: number;
  asymptoticBodyShadowMargin: number;
  bodyShadowMarginStatus: PSimplexT28ABodyShadowMarginStatus;
  nonlinearCrossingStatus: 'no-crossing-in-tested-range' | 'crossing-detected';
  antipodalCovarianceStatus: 'holds-by-signed-symmetry' | 'fails';
  exactGermContrastStatus: PSimplexT28AExactGermContrastStatus;
  witnessClassification: PSimplexT28AWitnessClassification;
  pressureClassifications: PSimplexT28APressureClassification[];
  pressurePrimitiveStatus: PSimplexT28APressurePrimitiveStatus;
  fieldPressurePrimitiveStatus: PSimplexT28AFieldPressurePrimitiveStatus;
  siteNamingStatus: PSimplexT28ASiteNamingStatus;
  semanticInterpretationStatus: PSimplexT28ASemanticInterpretationStatus;
  ok: boolean;
}

export interface PSimplexT28AAntipodalPairRow {
  pairId: string;
  leftChild: PSimplexChildSourceId;
  rightChild: PSimplexChildSourceId;
  leftAxis: PSimplexVec3;
  rightAxis: PSimplexVec3;
  axisCovarianceStatus: PSimplexT28ACovarianceStatus;
  leftA3Root: PSimplexA3RootId;
  rightA3Root: PSimplexA3RootId;
  a3GermCovarianceStatus: PSimplexT28ACovarianceStatus;
  inheritedT27CovarianceStatus: 'holds-by-signed-symmetry' | 'fails';
  pairCoverageStatus: 'both-children-covered' | 'child-coverage-missing';
  ok: boolean;
}

export interface PSimplexT28AWitnessClassificationSummary {
  rowCount: number;
  classification: PSimplexT28AWitnessClassification;
  classifiedRowCount: number;
  status:
    | 'all-six-sites-classified-as-finite-amplitude-germ-stability-witness'
    | 'witness-classification-incomplete';
  ok: boolean;
}

export interface PSimplexT28APressurePrimitiveSummary {
  rowCount: number;
  structuralWitnessOnlyCount: number;
  fieldCueClaimCount: number;
  siteNamingClaimCount: number;
  semanticInterpretationClaimCount: number;
  pressureClassificationCounts: Record<PSimplexT28APressureClassification, number>;
  status:
    | 'structural-pressure-primitives-only-no-fieldcue-no-naming'
    | 'pressure-primitive-boundary-failed';
  ok: boolean;
}

export interface PSimplexT28ABodyShadowMarginSummary {
  rowCount: number;
  sampledBodyShadowMargin: number;
  asymptoticBodyShadowMargin: number;
  minSampledBodyShadowMargin: number;
  minAsymptoticBodyShadowMargin: number;
  status: 'positive-margins-preserved' | 'nonpositive-margin-detected';
  ok: boolean;
}

export interface PSimplexT28AExactGermContrastSummary {
  rowCount: number;
  exactSiteA3InactiveCount: number;
  declaredGermConventionCount: number;
  contrastRowCount: number;
  status:
    | 'exact-site-axis-only-vs-declared-germ-contrast-preserved'
    | 'exact-germ-contrast-incomplete';
  ok: boolean;
}

export interface PSimplexT28AGuardRow {
  guardId:
    | 'parentT27Accepted'
    | 'parentT27SummaryVerdictAccepted'
    | 'parentT27CrossingNotDetected'
    | 'sixSiteCoverageComplete'
    | 'exactAxisMappingComplete'
    | 'p2A3GermMappingComplete'
    | 'antipodalPairCoverageComplete'
    | 'signedCovarianceVerified'
    | 'exactSiteA3Inactive'
    | 'localBranchBoundaryPreserved'
    | 'positiveSampledBodyShadowMargin'
    | 'positiveAsymptoticBodyShadowMargin'
    | 'closedEnumInterpretationFieldsPreserved'
    | 'invalidInterpretationBoundaryPreserved'
    | 'forbiddenInterpretationBoundariesPreserved';
  status: 'pass' | 'fail';
  evidence: string;
  ok: boolean;
}

export interface PSimplexT28AFalsifierRow {
  falsifierId:
    | 'F1-any-site-lacks-exact-axis-mapping'
    | 'F2-any-site-lacks-P2-A3-germ-mapping'
    | 'F3-antipodal-pair-fails-signed-covariance'
    | 'F4-any-site-reported-exact-site-A3-active'
    | 'F5-branch-or-witness-promoted-beyond-local-branch-only'
    | 'F6-sampled-body-shadow-margin-nonpositive'
    | 'F7-asymptotic-body-shadow-margin-nonpositive'
    | 'F8-report-field-promotes-semantic-naming'
    | 'F9-report-claims-forbidden-interpretation'
    | 'F10-child-treated-without-antipodal-partner'
    | 'F11-T27-parent-report-not-ok'
    | 'F12-T27-summaryVerdict-not-accepted'
    | 'F13-T27-body-shadow-crossing-detected';
  description: string;
  triggered: boolean;
  status: 'clear' | 'triggered';
  evidence: string;
  ok: boolean;
}

export interface PSimplexT28AInvalidInterpretationBoundaryRow {
  boundaryId:
    | 'not-fieldcue'
    | 'not-semantic-naming'
    | 'not-topology-workspace'
    | 'not-runtime-substrate'
    | 'not-closed-A3-response'
    | 'body-shadow-not-body-response'
    | 'not-route-walk-holonomy'
    | 'not-defect-vortex'
    | 'not-packet-interpretation';
  statement: string;
  enforced: true;
}

export interface PSimplexT28AReport {
  method: 'p-simplex-p2-one-third-six-site-convention2-germ-pressure-witness-map-t28a';
  candidatePackage: 'p-simplex-p2-one-third-six-site-convention2-germ-pressure-witness-map-t28a';
  diagnosticScope: 'six-site-convention2-germ-pressure-witness-map-only';
  parentEvidence: 'T27';
  licenseStatement: 'T27 licenses a six-site Convention-2 germ-pressure witness map, not merely a representative M_AB branch fact.';
  parentEvidenceRows: PSimplexT28AParentEvidenceRow[];
  convention1SubstrateRows: PSimplexT28AConvention1SubstrateRow[];
  convention2GermRows: PSimplexT28AConvention2GermRow[];
  sixSiteWitnessRows: PSimplexT28ASixSiteWitnessRow[];
  antipodalPairRows: PSimplexT28AAntipodalPairRow[];
  witnessClassificationSummary: PSimplexT28AWitnessClassificationSummary;
  pressurePrimitiveSummary: PSimplexT28APressurePrimitiveSummary;
  bodyShadowMarginSummary: PSimplexT28ABodyShadowMarginSummary;
  exactGermContrastSummary: PSimplexT28AExactGermContrastSummary;
  guardRows: PSimplexT28AGuardRow[];
  falsifierRows: PSimplexT28AFalsifierRow[];
  invalidInterpretationBoundaryRows: PSimplexT28AInvalidInterpretationBoundaryRow[];
  integrityIssues: string[];
  integrityIssueCount: number;
  summaryVerdict: PSimplexT28ASummaryVerdict;
  ok: boolean;
  childCount: number;
  antipodalPairCount: number;
}

type T27Report = ReturnType<typeof buildPSimplexP2OneThirdNonlinearAxisBranchContinuationAuditT27Report>;

const LICENSE_STATEMENT =
  'T27 licenses a six-site Convention-2 germ-pressure witness map, not merely a representative M_AB branch fact.' as const;

const ACCEPTED_T27_SUMMARY_VERDICTS: readonly PSimplexT27SummaryVerdict[] = [
  'P2-one-third-nonlinear-axis-branch-confirmed',
  'P2-one-third-nonlinear-branch-confirmed-with-body-shadow-bound',
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

const ANTIPODAL_PAIRS: ReadonlyArray<[PSimplexChildSourceId, PSimplexChildSourceId]> = [
  ['M_AB', 'M_CD'],
  ['M_AC', 'M_BD'],
  ['M_AD', 'M_BC'],
];

const REQUIRED_PRESSURE_CLASSIFICATIONS: readonly PSimplexT28APressureClassification[] = [
  'controlled-transverse-A3-pressure',
  'exact-site-vs-germ-contrast',
  'axis-dominant-germ-pressure',
];

export function buildPSimplexP2OneThirdSixSiteConvention2GermPressureWitnessMapT28AReport(): PSimplexT28AReport {
  const t27 = buildPSimplexP2OneThirdNonlinearAxisBranchContinuationAuditT27Report();
  const parentEvidenceRows = buildParentEvidenceRows(t27);
  const convention1SubstrateRows = PSIMPLEX_CHILD_SOURCE_IDS.map(buildConvention1SubstrateRow);
  const convention2GermRows = PSIMPLEX_CHILD_SOURCE_IDS.map((childId) => buildConvention2GermRow(childId, t27));
  const sixSiteWitnessRows = PSIMPLEX_CHILD_SOURCE_IDS.map((childId) => buildSixSiteWitnessRow(childId, t27));
  const antipodalPairRows = buildAntipodalPairRows(t27, sixSiteWitnessRows);
  const witnessClassificationSummary = buildWitnessClassificationSummary(sixSiteWitnessRows);
  const pressurePrimitiveSummary = buildPressurePrimitiveSummary(sixSiteWitnessRows);
  const bodyShadowMarginSummary = buildBodyShadowMarginSummary(sixSiteWitnessRows);
  const exactGermContrastSummary = buildExactGermContrastSummary(
    convention1SubstrateRows,
    convention2GermRows,
    sixSiteWitnessRows,
  );
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const guardRows = buildGuardRows({
    t27,
    parentEvidenceRows,
    convention1SubstrateRows,
    convention2GermRows,
    sixSiteWitnessRows,
    antipodalPairRows,
    invalidInterpretationBoundaryRows,
  });
  const falsifierRows = buildFalsifierRows({
    t27,
    convention1SubstrateRows,
    convention2GermRows,
    sixSiteWitnessRows,
    antipodalPairRows,
  });
  const integrityIssues = buildIntegrityIssues(guardRows, falsifierRows);
  const summaryVerdict = classifySummaryVerdict(t27, integrityIssues, falsifierRows);

  return {
    method: 'p-simplex-p2-one-third-six-site-convention2-germ-pressure-witness-map-t28a',
    candidatePackage: 'p-simplex-p2-one-third-six-site-convention2-germ-pressure-witness-map-t28a',
    diagnosticScope: 'six-site-convention2-germ-pressure-witness-map-only',
    parentEvidence: 'T27',
    licenseStatement: LICENSE_STATEMENT,
    parentEvidenceRows,
    convention1SubstrateRows,
    convention2GermRows,
    sixSiteWitnessRows,
    antipodalPairRows,
    witnessClassificationSummary,
    pressurePrimitiveSummary,
    bodyShadowMarginSummary,
    exactGermContrastSummary,
    guardRows,
    falsifierRows,
    invalidInterpretationBoundaryRows,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    summaryVerdict,
    ok: summaryVerdict === 'six-site-pressure-witness-map-coherent' && integrityIssues.length === 0,
    childCount: PSIMPLEX_CHILD_SOURCE_IDS.length,
    antipodalPairCount: antipodalPairRows.length,
  };
}

function buildParentEvidenceRows(t27: T27Report): PSimplexT28AParentEvidenceRow[] {
  return [
    {
      ledgerId: 'T27',
      method: t27.method,
      diagnosticScope: t27.diagnosticScope,
      representativeChild: t27.representativeChild,
      summaryVerdict: t27.summaryVerdict,
      ok:
        t27.ok &&
        t27.integrityIssueCount === 0 &&
        ACCEPTED_T27_SUMMARY_VERDICTS.includes(t27.summaryVerdict),
      integrityIssueCount: t27.integrityIssueCount,
      inheritedDenseScanRowCount: t27.denseScanSummary.denseRowCount,
      inheritedSampledBranchRowCount: t27.branchRows.length,
      carriedFact:
        'P2(1/3) has a stable nonlinear axis-dominant representative branch with bounded body-shadow margins and negative interpretation boundaries.',
      licenseStatement: LICENSE_STATEMENT,
    },
  ];
}

function buildConvention1SubstrateRow(childId: PSimplexChildSourceId): PSimplexT28AConvention1SubstrateRow {
  const definition = childAxisDefinition(childId);
  const exactSiteAxis = cleanVec3(childAxisVector(childId));
  const row: Omit<PSimplexT28AConvention1SubstrateRow, 'ok'> = {
    childId,
    sourceEdge: definition.edge,
    sourceEndpoints: [definition.endpoints[0], definition.endpoints[1]],
    exactSiteAxis,
    signedAxis: definition.signedAxis,
    axisPair: axisPairForSignedAxis(definition.signedAxis),
    antipodalChild: ANTIPODAL_CHILD_BY_ID[childId],
    exactSiteAxisOnlyStatus: 'exact-site-axis-only',
    exactSiteA3Status: 'exact-site-A3-inactive',
    ...buildBoundaryStatuses(),
  };

  return {
    ...row,
    ok: exactAxisRowPasses(row),
  };
}

function buildConvention2GermRow(
  childId: PSimplexChildSourceId,
  t27: T27Report,
): PSimplexT28AConvention2GermRow {
  const row: Omit<PSimplexT28AConvention2GermRow, 'ok'> = {
    childId,
    conventionId: 'P2-one-third-convention-2',
    p2OrientedRoot: P2_ORIENTED_ROOT_BY_CHILD[childId],
    p2A3GermDirection: rootVectorForRootId(P2_ORIENTED_ROOT_BY_CHILD[childId]),
    rhoExpression: '1/3',
    rhoValue: cleanNumber(1 / 3),
    normalizedBodyShadowThreshold: t27.bodyShadowCrossingEstimate.normalizedBodyShadowThreshold,
    coordinateBodyShadowThreshold: t27.bodyShadowCrossingEstimate.coordinateBodyShadowThreshold,
    coordinateThresholdStatus: t27.bodyShadowCrossingEstimate.coordinateThresholdStatus,
    branchConvention: 'normalized-axis-A3-plane',
    potentialId: 'pointwise-vector-LG-v0',
    conventionStatus: 'declared-germ-convention',
    ...buildBoundaryStatuses(),
  };

  return {
    ...row,
    ok: germRowPasses(row),
  };
}

function buildSixSiteWitnessRow(childId: PSimplexChildSourceId, t27: T27Report): PSimplexT28ASixSiteWitnessRow {
  const definition = childAxisDefinition(childId);
  const normalizedBodyShadowThreshold = t27.bodyShadowCrossingEstimate.normalizedBodyShadowThreshold;
  const sampledBodyShadowMargin = cleanNumber(normalizedBodyShadowThreshold - t27.denseScanSummary.maxRatioBA);
  const asymptoticBodyShadowMargin = cleanNumber(
    normalizedBodyShadowThreshold - t27.bodyShadowCrossingEstimate.asymptoticPositiveBranchRatioBound,
  );
  const row: Omit<PSimplexT28ASixSiteWitnessRow, 'ok'> = {
    childId,
    sourceEdge: definition.edge,
    antipodalChild: ANTIPODAL_CHILD_BY_ID[childId],
    parentT27SummaryVerdict: t27.summaryVerdict,
    inheritedRepresentativeChild: t27.representativeChild,
    evidenceTransport: 'signed-coordinate-antipodal-symmetry',
    branchStabilityStatus: t27.stabilitySummary.status,
    axisDominanceStatus: axisDominanceStatusFor(t27, sampledBodyShadowMargin),
    inheritedMaxRatioBA: t27.denseScanSummary.maxRatioBA,
    inheritedMaxRatioEta: t27.denseScanSummary.maxRatioEta,
    normalizedBodyShadowThreshold,
    asymptoticPositiveBranchRatioBound: t27.bodyShadowCrossingEstimate.asymptoticPositiveBranchRatioBound,
    sampledBodyShadowMargin,
    asymptoticBodyShadowMargin,
    bodyShadowMarginStatus:
      sampledBodyShadowMargin > PSIMPLEX_EPSILON && asymptoticBodyShadowMargin > PSIMPLEX_EPSILON
        ? 'positive-margin'
        : 'nonpositive-margin',
    nonlinearCrossingStatus: t27.bodyShadowCrossingEstimate.nonlinearCrossingStatus,
    antipodalCovarianceStatus: t27.antipodalCovarianceSummary.status,
    exactGermContrastStatus: 'exact-site-axis-only-vs-declared-A3-germ',
    witnessClassification: 'finite-amplitude-germ-stability-witness',
    pressureClassifications: [...REQUIRED_PRESSURE_CLASSIFICATIONS],
    pressurePrimitiveStatus: 'structural-witness-only',
    fieldPressurePrimitiveStatus: 'structural-pressure-primitive-not-fieldcue',
    siteNamingStatus: 'not-named',
    semanticInterpretationStatus: 'not-semantic-interpretation',
    ...buildBoundaryStatuses(),
  };

  return {
    ...row,
    ok: witnessRowPasses(row),
  };
}

function buildAntipodalPairRows(
  t27: T27Report,
  witnessRows: readonly PSimplexT28ASixSiteWitnessRow[],
): PSimplexT28AAntipodalPairRow[] {
  const coveredChildren = new Set(witnessRows.map((row) => row.childId));

  return ANTIPODAL_PAIRS.map(([leftChild, rightChild]) => {
    const leftAxis = cleanVec3(childAxisVector(leftChild));
    const rightAxis = cleanVec3(childAxisVector(rightChild));
    const leftA3Root = P2_ORIENTED_ROOT_BY_CHILD[leftChild];
    const rightA3Root = P2_ORIENTED_ROOT_BY_CHILD[rightChild];
    const axisOppositionHolds = vectorOppositionHolds(leftAxis, rightAxis);
    const a3GermOppositionHolds = vectorOppositionHolds(rootVectorForRootId(leftA3Root), rootVectorForRootId(rightA3Root));
    const pairCoverageStatus =
      coveredChildren.has(leftChild) && coveredChildren.has(rightChild) ? 'both-children-covered' : 'child-coverage-missing';
    const inheritedT27CovarianceStatus = t27.antipodalCovarianceSummary.status;

    return {
      pairId: `${leftChild}<->${rightChild}`,
      leftChild,
      rightChild,
      leftAxis,
      rightAxis,
      axisCovarianceStatus: axisOppositionHolds ? 'signed-opposition-holds' : 'signed-opposition-fails',
      leftA3Root,
      rightA3Root,
      a3GermCovarianceStatus: a3GermOppositionHolds ? 'signed-opposition-holds' : 'signed-opposition-fails',
      inheritedT27CovarianceStatus,
      pairCoverageStatus,
      ok:
        axisOppositionHolds &&
        a3GermOppositionHolds &&
        inheritedT27CovarianceStatus === 'holds-by-signed-symmetry' &&
        pairCoverageStatus === 'both-children-covered',
    };
  });
}

function buildWitnessClassificationSummary(
  rows: readonly PSimplexT28ASixSiteWitnessRow[],
): PSimplexT28AWitnessClassificationSummary {
  const classifiedRowCount = rows.filter(
    (row) => row.witnessClassification === 'finite-amplitude-germ-stability-witness',
  ).length;
  const ok = rows.length === PSIMPLEX_CHILD_SOURCE_IDS.length && classifiedRowCount === rows.length;

  return {
    rowCount: rows.length,
    classification: 'finite-amplitude-germ-stability-witness',
    classifiedRowCount,
    status: ok
      ? 'all-six-sites-classified-as-finite-amplitude-germ-stability-witness'
      : 'witness-classification-incomplete',
    ok,
  };
}

function buildPressurePrimitiveSummary(
  rows: readonly PSimplexT28ASixSiteWitnessRow[],
): PSimplexT28APressurePrimitiveSummary {
  const pressureClassificationCounts = zeroPressureClassificationCounts();

  for (const row of rows) {
    for (const classification of row.pressureClassifications) {
      pressureClassificationCounts[classification] += 1;
    }
  }

  const structuralWitnessOnlyCount = rows.filter((row) => row.pressurePrimitiveStatus === 'structural-witness-only').length;
  const fieldCueClaimCount = rows.filter(
    (row) => row.fieldPressurePrimitiveStatus !== 'structural-pressure-primitive-not-fieldcue',
  ).length;
  const siteNamingClaimCount = rows.filter((row) => row.siteNamingStatus !== 'not-named').length;
  const semanticInterpretationClaimCount = rows.filter(
    (row) => row.semanticInterpretationStatus !== 'not-semantic-interpretation',
  ).length;
  const ok =
    rows.length === PSIMPLEX_CHILD_SOURCE_IDS.length &&
    structuralWitnessOnlyCount === rows.length &&
    fieldCueClaimCount === 0 &&
    siteNamingClaimCount === 0 &&
    semanticInterpretationClaimCount === 0 &&
    rows.every((row) => pressureClassificationsPass(row.pressureClassifications));

  return {
    rowCount: rows.length,
    structuralWitnessOnlyCount,
    fieldCueClaimCount,
    siteNamingClaimCount,
    semanticInterpretationClaimCount,
    pressureClassificationCounts,
    status: ok
      ? 'structural-pressure-primitives-only-no-fieldcue-no-naming'
      : 'pressure-primitive-boundary-failed',
    ok,
  };
}

function buildBodyShadowMarginSummary(
  rows: readonly PSimplexT28ASixSiteWitnessRow[],
): PSimplexT28ABodyShadowMarginSummary {
  const sampledMargins = rows.map((row) => row.sampledBodyShadowMargin);
  const asymptoticMargins = rows.map((row) => row.asymptoticBodyShadowMargin);
  const minSampledBodyShadowMargin = cleanNumber(Math.min(...sampledMargins));
  const minAsymptoticBodyShadowMargin = cleanNumber(Math.min(...asymptoticMargins));
  const ok = rows.length > 0 && minSampledBodyShadowMargin > PSIMPLEX_EPSILON && minAsymptoticBodyShadowMargin > PSIMPLEX_EPSILON;

  return {
    rowCount: rows.length,
    sampledBodyShadowMargin: sampledMargins[0] ?? Number.NaN,
    asymptoticBodyShadowMargin: asymptoticMargins[0] ?? Number.NaN,
    minSampledBodyShadowMargin,
    minAsymptoticBodyShadowMargin,
    status: ok ? 'positive-margins-preserved' : 'nonpositive-margin-detected',
    ok,
  };
}

function buildExactGermContrastSummary(
  convention1Rows: readonly PSimplexT28AConvention1SubstrateRow[],
  convention2Rows: readonly PSimplexT28AConvention2GermRow[],
  witnessRows: readonly PSimplexT28ASixSiteWitnessRow[],
): PSimplexT28AExactGermContrastSummary {
  const exactSiteA3InactiveCount = convention1Rows.filter((row) => row.exactSiteA3Status === 'exact-site-A3-inactive').length;
  const declaredGermConventionCount = convention2Rows.filter((row) => row.conventionStatus === 'declared-germ-convention').length;
  const contrastRowCount = witnessRows.filter(
    (row) => row.exactGermContrastStatus === 'exact-site-axis-only-vs-declared-A3-germ',
  ).length;
  const ok =
    convention1Rows.length === PSIMPLEX_CHILD_SOURCE_IDS.length &&
    convention2Rows.length === PSIMPLEX_CHILD_SOURCE_IDS.length &&
    witnessRows.length === PSIMPLEX_CHILD_SOURCE_IDS.length &&
    exactSiteA3InactiveCount === PSIMPLEX_CHILD_SOURCE_IDS.length &&
    declaredGermConventionCount === PSIMPLEX_CHILD_SOURCE_IDS.length &&
    contrastRowCount === PSIMPLEX_CHILD_SOURCE_IDS.length;

  return {
    rowCount: witnessRows.length,
    exactSiteA3InactiveCount,
    declaredGermConventionCount,
    contrastRowCount,
    status: ok
      ? 'exact-site-axis-only-vs-declared-germ-contrast-preserved'
      : 'exact-germ-contrast-incomplete',
    ok,
  };
}

function buildGuardRows(args: {
  t27: T27Report;
  parentEvidenceRows: readonly PSimplexT28AParentEvidenceRow[];
  convention1SubstrateRows: readonly PSimplexT28AConvention1SubstrateRow[];
  convention2GermRows: readonly PSimplexT28AConvention2GermRow[];
  sixSiteWitnessRows: readonly PSimplexT28ASixSiteWitnessRow[];
  antipodalPairRows: readonly PSimplexT28AAntipodalPairRow[];
  invalidInterpretationBoundaryRows: readonly PSimplexT28AInvalidInterpretationBoundaryRow[];
}): PSimplexT28AGuardRow[] {
  return [
    guardRow(
      'parentT27Accepted',
      args.parentEvidenceRows.every((row) => row.ok),
      'T27 is ok, has no integrity issues, and supplies accepted representative nonlinear branch evidence.',
    ),
    guardRow(
      'parentT27SummaryVerdictAccepted',
      ACCEPTED_T27_SUMMARY_VERDICTS.includes(args.t27.summaryVerdict),
      'T27 summaryVerdict is one of the accepted nonlinear branch confirmations.',
    ),
    guardRow(
      'parentT27CrossingNotDetected',
      args.t27.bodyShadowCrossingEstimate.nonlinearCrossingStatus !== 'crossing-detected',
      'T27 body-shadow estimate reports no nonlinear crossing in the tested range.',
    ),
    guardRow(
      'sixSiteCoverageComplete',
      args.sixSiteWitnessRows.length === PSIMPLEX_CHILD_SOURCE_IDS.length &&
        PSIMPLEX_CHILD_SOURCE_IDS.every((childId) => args.sixSiteWitnessRows.some((row) => row.childId === childId)),
      'All six generated midpoint sites are present in the witness map.',
    ),
    guardRow(
      'exactAxisMappingComplete',
      args.convention1SubstrateRows.length === PSIMPLEX_CHILD_SOURCE_IDS.length &&
        args.convention1SubstrateRows.every((row) => row.ok),
      'Every site has a Convention-1 exact axis from childAxisDefinition / childAxisVector.',
    ),
    guardRow(
      'p2A3GermMappingComplete',
      args.convention2GermRows.length === PSIMPLEX_CHILD_SOURCE_IDS.length &&
        args.convention2GermRows.every((row) => row.ok),
      'Every site has the required P2 oriented root and A3 germ direction.',
    ),
    guardRow(
      'antipodalPairCoverageComplete',
      args.antipodalPairRows.length === ANTIPODAL_PAIRS.length &&
        args.antipodalPairRows.every((row) => row.pairCoverageStatus === 'both-children-covered'),
      'Each site is represented with its antipodal partner.',
    ),
    guardRow(
      'signedCovarianceVerified',
      args.antipodalPairRows.every((row) => row.ok),
      'Axes, P2 A3 roots, and inherited T27 covariance all hold by signed opposition/symmetry.',
    ),
    guardRow(
      'exactSiteA3Inactive',
      args.convention1SubstrateRows.every((row) => row.exactSiteA3Status === 'exact-site-A3-inactive'),
      'Convention-1 substrate rows preserve exact-site A3 inactivity.',
    ),
    guardRow(
      'localBranchBoundaryPreserved',
      args.t27.branchRows.every((row) => row.boundaryStatuses.responseGroundingStatus === 'local-branch-only') &&
        args.sixSiteWitnessRows.every((row) => row.responseGroundingStatus === 'local-branch-only'),
      'T27 branch rows and T28-A witness rows remain local-branch-only.',
    ),
    guardRow(
      'positiveSampledBodyShadowMargin',
      args.sixSiteWitnessRows.every((row) => row.sampledBodyShadowMargin > PSIMPLEX_EPSILON),
      'sampledBodyShadowMargin is positive for every site.',
    ),
    guardRow(
      'positiveAsymptoticBodyShadowMargin',
      args.sixSiteWitnessRows.every((row) => row.asymptoticBodyShadowMargin > PSIMPLEX_EPSILON),
      'asymptoticBodyShadowMargin is positive for every site.',
    ),
    guardRow(
      'closedEnumInterpretationFieldsPreserved',
      closedEnumInterpretationFieldsPass(args.sixSiteWitnessRows),
      'Witness and pressure primitive interpretation fields are checked through closed enums.',
    ),
    guardRow(
      'invalidInterpretationBoundaryPreserved',
      args.invalidInterpretationBoundaryRows.length > 0 && args.invalidInterpretationBoundaryRows.every((row) => row.enforced),
      'Invalid interpretation boundary rows are explicit and enforced.',
    ),
    guardRow(
      'forbiddenInterpretationBoundariesPreserved',
      allNegativeBoundariesPass(args.t27, args.convention1SubstrateRows, args.convention2GermRows, args.sixSiteWitnessRows),
      'FieldCue, semantic naming, topology, route/holonomy, defect/vortex, packet, body, and runtime boundaries remain negative.',
    ),
  ];
}

function buildFalsifierRows(args: {
  t27: T27Report;
  convention1SubstrateRows: readonly PSimplexT28AConvention1SubstrateRow[];
  convention2GermRows: readonly PSimplexT28AConvention2GermRow[];
  sixSiteWitnessRows: readonly PSimplexT28ASixSiteWitnessRow[];
  antipodalPairRows: readonly PSimplexT28AAntipodalPairRow[];
}): PSimplexT28AFalsifierRow[] {
  return [
    falsifierRow(
      'F1-any-site-lacks-exact-axis-mapping',
      'Any site lacks exact axis mapping.',
      args.convention1SubstrateRows.length !== PSIMPLEX_CHILD_SOURCE_IDS.length ||
        args.convention1SubstrateRows.some((row) => !exactAxisRowPasses(row)),
      `${args.convention1SubstrateRows.filter((row) => row.ok).length}/${PSIMPLEX_CHILD_SOURCE_IDS.length} exact-axis rows pass.`,
    ),
    falsifierRow(
      'F2-any-site-lacks-P2-A3-germ-mapping',
      'Any site lacks P2 A3 germ mapping.',
      args.convention2GermRows.length !== PSIMPLEX_CHILD_SOURCE_IDS.length ||
        args.convention2GermRows.some((row) => !germRowPasses(row)),
      `${args.convention2GermRows.filter((row) => row.ok).length}/${PSIMPLEX_CHILD_SOURCE_IDS.length} P2 A3 germ rows pass.`,
    ),
    falsifierRow(
      'F3-antipodal-pair-fails-signed-covariance',
      'Any antipodal pair fails signed covariance.',
      args.antipodalPairRows.some(
        (row) =>
          row.axisCovarianceStatus !== 'signed-opposition-holds' ||
          row.a3GermCovarianceStatus !== 'signed-opposition-holds',
      ),
      `${args.antipodalPairRows.filter((row) => row.ok).length}/${ANTIPODAL_PAIRS.length} antipodal pair rows pass.`,
    ),
    falsifierRow(
      'F4-any-site-reported-exact-site-A3-active',
      'Any site is reported as exact-site A3 active.',
      args.convention1SubstrateRows.some((row) => row.exactSiteA3Status !== 'exact-site-A3-inactive'),
      'All Convention-1 rows must report exact-site-A3-inactive.',
    ),
    falsifierRow(
      'F5-branch-or-witness-promoted-beyond-local-branch-only',
      'Any branch row or witness row is promoted beyond local-branch-only.',
      args.t27.branchRows.some((row) => row.boundaryStatuses.responseGroundingStatus !== 'local-branch-only') ||
        args.sixSiteWitnessRows.some((row) => row.responseGroundingStatus !== 'local-branch-only'),
      'T27 branch rows and T28-A witness rows are checked for local-branch-only response grounding.',
    ),
    falsifierRow(
      'F6-sampled-body-shadow-margin-nonpositive',
      'Any sampled body-shadow margin is nonpositive under normalized threshold.',
      args.sixSiteWitnessRows.some((row) => row.sampledBodyShadowMargin <= PSIMPLEX_EPSILON),
      `Minimum sampled margin: ${cleanNumber(Math.min(...args.sixSiteWitnessRows.map((row) => row.sampledBodyShadowMargin)))}.`,
    ),
    falsifierRow(
      'F7-asymptotic-body-shadow-margin-nonpositive',
      'Any asymptotic body-shadow margin is nonpositive under normalized threshold.',
      args.sixSiteWitnessRows.some((row) => row.asymptoticBodyShadowMargin <= PSIMPLEX_EPSILON),
      `Minimum asymptotic margin: ${cleanNumber(Math.min(...args.sixSiteWitnessRows.map((row) => row.asymptoticBodyShadowMargin)))}.`,
    ),
    falsifierRow(
      'F8-report-field-promotes-semantic-naming',
      'Any report field promotes semantic naming.',
      !closedEnumSemanticFieldsPass(args.sixSiteWitnessRows),
      'siteNamingStatus, semanticInterpretationStatus, witnessClassification, pressureClassifications, and semanticStatus are closed negative enums.',
    ),
    falsifierRow(
      'F9-report-claims-forbidden-interpretation',
      'Any report claims FieldCue, topology, route, holonomy, defect, vortex, packet interpretation, body response, or runtime status.',
      !allNegativeBoundariesPass(
        args.t27,
        args.convention1SubstrateRows,
        args.convention2GermRows,
        args.sixSiteWitnessRows,
      ) || !closedEnumInterpretationFieldsPass(args.sixSiteWitnessRows),
      'Forbidden interpretation claims are guarded by boundary statuses and closed pressure primitive enums.',
    ),
    falsifierRow(
      'F10-child-treated-without-antipodal-partner',
      'Any child is treated without its antipodal partner.',
      !allChildrenHaveAntipodalPartner(args.antipodalPairRows),
      `${args.antipodalPairRows.filter((row) => row.pairCoverageStatus === 'both-children-covered').length}/${ANTIPODAL_PAIRS.length} antipodal pairs cover both children.`,
    ),
    falsifierRow(
      'F11-T27-parent-report-not-ok',
      'T27 parent report is not ok.',
      !args.t27.ok || args.t27.integrityIssueCount > 0,
      `T27 ok=${args.t27.ok}; integrityIssueCount=${args.t27.integrityIssueCount}.`,
    ),
    falsifierRow(
      'F12-T27-summaryVerdict-not-accepted',
      'T27 summaryVerdict is not P2-one-third-nonlinear-axis-branch-confirmed or P2-one-third-nonlinear-branch-confirmed-with-body-shadow-bound.',
      !ACCEPTED_T27_SUMMARY_VERDICTS.includes(args.t27.summaryVerdict),
      `T27 summaryVerdict=${args.t27.summaryVerdict}.`,
    ),
    falsifierRow(
      'F13-T27-body-shadow-crossing-detected',
      'T27 body-shadow crossing status is crossing-detected.',
      args.t27.bodyShadowCrossingEstimate.nonlinearCrossingStatus === 'crossing-detected',
      `T27 nonlinearCrossingStatus=${args.t27.bodyShadowCrossingEstimate.nonlinearCrossingStatus}.`,
    ),
  ];
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT28AInvalidInterpretationBoundaryRow[] {
  return [
    {
      boundaryId: 'not-fieldcue',
      statement: 'Negative boundary: this witness map does not create or identify FieldCue.',
      enforced: true,
    },
    {
      boundaryId: 'not-semantic-naming',
      statement: 'Negative boundary: generated sites are not semantically named or interpreted.',
      enforced: true,
    },
    {
      boundaryId: 'not-topology-workspace',
      statement: 'Negative boundary: this map does not introduce topology workspace operations.',
      enforced: true,
    },
    {
      boundaryId: 'not-runtime-substrate',
      statement: 'Negative boundary: Convention-2 germ pressure is not runtime substrate adoption.',
      enforced: true,
    },
    {
      boundaryId: 'not-closed-A3-response',
      statement: 'Negative boundary: A3 remains susceptibility / transverse deformation, not a closed response class.',
      enforced: true,
    },
    {
      boundaryId: 'body-shadow-not-body-response',
      statement: 'Negative boundary: bounded body-shadow margins are not body response.',
      enforced: true,
    },
    {
      boundaryId: 'not-route-walk-holonomy',
      statement: 'Negative boundary: no route, walk, or holonomy interpretation is introduced.',
      enforced: true,
    },
    {
      boundaryId: 'not-defect-vortex',
      statement: 'Negative boundary: no defect or vortex interpretation is introduced.',
      enforced: true,
    },
    {
      boundaryId: 'not-packet-interpretation',
      statement: 'Negative boundary: no packet interpretation is introduced or written.',
      enforced: true,
    },
  ];
}

function buildIntegrityIssues(
  guardRows: readonly PSimplexT28AGuardRow[],
  falsifierRows: readonly PSimplexT28AFalsifierRow[],
): string[] {
  const issues = [
    ...guardRows.filter((row) => !row.ok).map((row) => `Guard failed: ${row.guardId}.`),
    ...falsifierRows.filter((row) => row.triggered).map((row) => `Falsifier triggered: ${row.falsifierId}.`),
  ];

  return [...new Set(issues)];
}

function classifySummaryVerdict(
  t27: T27Report,
  integrityIssues: readonly string[],
  falsifierRows: readonly PSimplexT28AFalsifierRow[],
): PSimplexT28ASummaryVerdict {
  const parentInvalid =
    !t27.ok ||
    t27.integrityIssueCount > 0 ||
    !ACCEPTED_T27_SUMMARY_VERDICTS.includes(t27.summaryVerdict) ||
    t27.bodyShadowCrossingEstimate.nonlinearCrossingStatus === 'crossing-detected';

  if (parentInvalid) {
    return 'T27-representative-branch-cannot-map-to-six-site-witness-structure';
  }

  if (integrityIssues.length > 0 || falsifierRows.some((row) => row.triggered)) {
    return 'representative-T27-valid-six-site-propagation-requires-additional-convention-work';
  }

  return 'six-site-pressure-witness-map-coherent';
}

function exactAxisRowPasses(row: Omit<PSimplexT28AConvention1SubstrateRow, 'ok'> | PSimplexT28AConvention1SubstrateRow): boolean {
  const definition = childAxisDefinition(row.childId);
  const expectedAxis = cleanVec3(childAxisVector(row.childId));
  const expectedSignedAxis = cleanVec3(signedAxisVector(definition.signedAxis));

  return (
    row.sourceEdge === definition.edge &&
    row.sourceEndpoints[0] === definition.endpoints[0] &&
    row.sourceEndpoints[1] === definition.endpoints[1] &&
    row.signedAxis === definition.signedAxis &&
    row.axisPair === axisPairForSignedAxis(definition.signedAxis) &&
    row.antipodalChild === ANTIPODAL_CHILD_BY_ID[row.childId] &&
    row.exactSiteAxisOnlyStatus === 'exact-site-axis-only' &&
    row.exactSiteA3Status === 'exact-site-A3-inactive' &&
    vectorNearlyEqual(row.exactSiteAxis, expectedAxis) &&
    vectorNearlyEqual(row.exactSiteAxis, expectedSignedAxis) &&
    boundaryStatusesPass(row)
  );
}

function germRowPasses(row: Omit<PSimplexT28AConvention2GermRow, 'ok'> | PSimplexT28AConvention2GermRow): boolean {
  const expectedRoot = P2_ORIENTED_ROOT_BY_CHILD[row.childId];

  return (
    row.conventionId === 'P2-one-third-convention-2' &&
    row.p2OrientedRoot === expectedRoot &&
    vectorNearlyEqual(row.p2A3GermDirection, rootVectorForRootId(expectedRoot)) &&
    normVec3(row.p2A3GermDirection) > 1 - PSIMPLEX_EPSILON &&
    normVec3(row.p2A3GermDirection) < 1 + PSIMPLEX_EPSILON &&
    row.rhoExpression === '1/3' &&
    nearlyEqual(row.rhoValue, 1 / 3) &&
    row.normalizedBodyShadowThreshold > 0 &&
    row.coordinateBodyShadowThreshold > 0 &&
    row.coordinateThresholdStatus === 'coordinate-convention-only' &&
    row.branchConvention === 'normalized-axis-A3-plane' &&
    row.potentialId === 'pointwise-vector-LG-v0' &&
    row.conventionStatus === 'declared-germ-convention' &&
    boundaryStatusesPass(row)
  );
}

function witnessRowPasses(row: Omit<PSimplexT28ASixSiteWitnessRow, 'ok'> | PSimplexT28ASixSiteWitnessRow): boolean {
  return (
    row.inheritedRepresentativeChild === 'M_AB' &&
    row.evidenceTransport === 'signed-coordinate-antipodal-symmetry' &&
    row.axisDominanceStatus === 'axis-dominant-through-tested-range' &&
    row.sampledBodyShadowMargin > PSIMPLEX_EPSILON &&
    row.asymptoticBodyShadowMargin > PSIMPLEX_EPSILON &&
    row.bodyShadowMarginStatus === 'positive-margin' &&
    row.nonlinearCrossingStatus === 'no-crossing-in-tested-range' &&
    row.antipodalCovarianceStatus === 'holds-by-signed-symmetry' &&
    row.exactGermContrastStatus === 'exact-site-axis-only-vs-declared-A3-germ' &&
    closedEnumInterpretationFieldsPass([row]) &&
    boundaryStatusesPass(row)
  );
}

function axisDominanceStatusFor(t27: T27Report, sampledBodyShadowMargin: number): PSimplexT28AAxisDominanceStatus {
  const branchRowsAxisDominant = t27.branchRows.every((row) => row.bodyShadowStatus === 'axis-dominant-no-body-shadow');
  const denseScanAxisDominant = !t27.denseScanSummary.bodyShadowCrossingDetected && sampledBodyShadowMargin > PSIMPLEX_EPSILON;

  return branchRowsAxisDominant && denseScanAxisDominant
    ? 'axis-dominant-through-tested-range'
    : 'not-axis-dominant-through-tested-range';
}

function allChildrenHaveAntipodalPartner(rows: readonly PSimplexT28AAntipodalPairRow[]): boolean {
  return PSIMPLEX_CHILD_SOURCE_IDS.every((childId) => {
    const antipodalChild = ANTIPODAL_CHILD_BY_ID[childId];

    return rows.some(
      (row) =>
        (row.leftChild === childId && row.rightChild === antipodalChild) ||
        (row.rightChild === childId && row.leftChild === antipodalChild),
    );
  });
}

function allNegativeBoundariesPass(
  t27: T27Report,
  convention1Rows: readonly PSimplexT28AConvention1SubstrateRow[],
  convention2Rows: readonly PSimplexT28AConvention2GermRow[],
  witnessRows: readonly PSimplexT28ASixSiteWitnessRow[],
): boolean {
  return (
    t27.branchRows.every((row) => boundaryStatusesPass(row.boundaryStatuses)) &&
    convention1Rows.every(boundaryStatusesPass) &&
    convention2Rows.every(boundaryStatusesPass) &&
    witnessRows.every(boundaryStatusesPass)
  );
}

function closedEnumSemanticFieldsPass(
  rows: readonly (Omit<PSimplexT28ASixSiteWitnessRow, 'ok'> | PSimplexT28ASixSiteWitnessRow)[],
): boolean {
  return rows.every(
    (row) =>
      row.siteNamingStatus === 'not-named' &&
      row.semanticInterpretationStatus === 'not-semantic-interpretation' &&
      row.semanticStatus === 'not-semantic-naming' &&
      row.witnessClassification === 'finite-amplitude-germ-stability-witness' &&
      pressureClassificationsPass(row.pressureClassifications),
  );
}

function closedEnumInterpretationFieldsPass(
  rows: readonly (Omit<PSimplexT28ASixSiteWitnessRow, 'ok'> | PSimplexT28ASixSiteWitnessRow)[],
): boolean {
  return (
    closedEnumSemanticFieldsPass(rows) &&
    rows.every(
      (row) =>
        row.pressurePrimitiveStatus === 'structural-witness-only' &&
        row.fieldPressurePrimitiveStatus === 'structural-pressure-primitive-not-fieldcue',
    )
  );
}

function pressureClassificationsPass(values: readonly PSimplexT28APressureClassification[]): boolean {
  return (
    values.length === REQUIRED_PRESSURE_CLASSIFICATIONS.length &&
    REQUIRED_PRESSURE_CLASSIFICATIONS.every((required) => values.includes(required)) &&
    values.every((value) => REQUIRED_PRESSURE_CLASSIFICATIONS.includes(value))
  );
}

function zeroPressureClassificationCounts(): Record<PSimplexT28APressureClassification, number> {
  return {
    'controlled-transverse-A3-pressure': 0,
    'exact-site-vs-germ-contrast': 0,
    'axis-dominant-germ-pressure': 0,
  };
}

function axisPairForSignedAxis(axis: PSimplexSignedAxis): PSimplexT28AAxisPair {
  if (axis === '+x' || axis === '-x') {
    return '+x/-x';
  }

  if (axis === '+y' || axis === '-y') {
    return '+y/-y';
  }

  return '+z/-z';
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

function vectorOppositionHolds(left: PSimplexVec3, right: PSimplexVec3): boolean {
  return cleanNumber(dotVec3(normalizeVec3(left), normalizeVec3(right))) <= -1 + PSIMPLEX_EPSILON;
}

function vectorNearlyEqual(left: PSimplexVec3, right: PSimplexVec3): boolean {
  return left.every((value, index) => Math.abs(value - right[index]) <= PSIMPLEX_EPSILON);
}

function nearlyEqual(left: number, right: number): boolean {
  return Math.abs(left - right) <= PSIMPLEX_EPSILON;
}

function buildBoundaryStatuses(): PSimplexT28ABoundaryStatuses {
  return {
    responseGroundingStatus: 'local-branch-only',
    A3ClosureStatus: 'not-closed-response',
    fieldCueStatus: 'not-fieldcue',
    semanticStatus: 'not-semantic-naming',
    topologyStatus: 'not-topology-workspace',
    runtimeSubstrateStatus: 'not-runtime-substrate',
    bodyStatus: 'not-promoted',
    packetStatus: 'not-packet-interpretation',
    routeHolonomyStatus: 'not-route-walk-holonomy',
    defectVortexStatus: 'not-defect-vortex',
  };
}

function boundaryStatusesPass(statuses: PSimplexT28ABoundaryStatuses): boolean {
  return (
    statuses.responseGroundingStatus === 'local-branch-only' &&
    statuses.A3ClosureStatus === 'not-closed-response' &&
    statuses.fieldCueStatus === 'not-fieldcue' &&
    statuses.semanticStatus === 'not-semantic-naming' &&
    statuses.topologyStatus === 'not-topology-workspace' &&
    statuses.runtimeSubstrateStatus === 'not-runtime-substrate' &&
    statuses.bodyStatus === 'not-promoted' &&
    statuses.packetStatus === 'not-packet-interpretation' &&
    statuses.routeHolonomyStatus === 'not-route-walk-holonomy' &&
    statuses.defectVortexStatus === 'not-defect-vortex'
  );
}

function guardRow(guardId: PSimplexT28AGuardRow['guardId'], ok: boolean, evidence: string): PSimplexT28AGuardRow {
  return {
    guardId,
    status: ok ? 'pass' : 'fail',
    evidence,
    ok,
  };
}

function falsifierRow(
  falsifierId: PSimplexT28AFalsifierRow['falsifierId'],
  description: string,
  triggered: boolean,
  evidence: string,
): PSimplexT28AFalsifierRow {
  return {
    falsifierId,
    description,
    triggered,
    status: triggered ? 'triggered' : 'clear',
    evidence,
    ok: !triggered,
  };
}

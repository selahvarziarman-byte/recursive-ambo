export type PSimplexT28EAxisPairId = 'AB-CD' | 'AC-BD' | 'AD-BC';
export type PSimplexT28EChildId = 'M_AB' | 'M_AC' | 'M_AD' | 'M_BC' | 'M_BD' | 'M_CD';
export type PSimplexT28ESampleFamily = 'K3-A-primary' | 'K3-A-complement' | 'K3-T';
export type PSimplexT28EClassificationId =
  | 'K3-SFA-robust-K-local-asymmetry'
  | 'K3-SFA-readability-policy-dependent'
  | 'K3-SFA-residual-geometric'
  | 'K3-SFA-locality-family-dependent'
  | 'K3-SFA-K3T-construction-specific'
  | 'K3-SFA-axis-sample-position-artifact'
  | 'K3-SFA-control-inconclusive'
  | 'K3-SFA-boundary-failed';
export type PSimplexT28ESummaryVerdict =
  | 'T28-E-K3-SFA-robust-K-local-asymmetry'
  | 'T28-E-K3-SFA-readability-policy-dependent'
  | 'T28-E-K3-SFA-residual-geometric'
  | 'T28-E-K3-SFA-locality-family-dependent'
  | 'T28-E-K3-SFA-K3T-construction-specific'
  | 'T28-E-K3-SFA-axis-sample-position-artifact'
  | 'T28-E-K3-SFA-control-inconclusive'
  | 'T28-E-boundary-failed';

export interface PSimplexT28EInputs {
  t28c0Report: unknown;
  t28c1Report: unknown;
  t28dReport: unknown;
  k3Report: unknown;
  vReport?: unknown;
  vLocalityReport?: unknown;
}

export interface PSimplexT28EParentEvidenceRow {
  parentId: 'T28-C0' | 'T28-C1' | 'T28-D' | 'K3' | 'V-optional' | 'V-locality-optional';
  builderName: string;
  importStatus: 'imported' | 'optional-not-imported' | 'failed';
  ok: boolean;
  summaryVerdict?: string;
  diagnosticScope?: string;
  usedFor: 'parent-gate' | 'baseline' | 'k3-control-source' | 'optional-consistency-context';
  notes: string[];
}

export interface PSimplexT28EBaselineK3SfaRow {
  axisPairId: PSimplexT28EAxisPairId;
  leftChild: PSimplexT28EChildId;
  rightChild: PSimplexT28EChildId;
  kAxisLegibleRateFromT28D: number;
  kTransverseDifferentiationRateFromT28D: number;
  dominantCauseFamilyFromT28D: string;
  dominantCauseClassificationFromT28D: string;
  artifactOnlyDifferentiationCountFromT28D: number;
  nonArtifactDifferentiatedCountFromT28D: number;
  pairPatternFromT28D: string;
  baselineStatus: 'baseline-k3-sfa-present' | 'baseline-missing-or-inconsistent';
}

export interface PSimplexT28EStatusBundleHardeningRow {
  sampleId: string;
  childId: PSimplexT28EChildId;
  axisPairId: PSimplexT28EAxisPairId;
  originalDifferentiated: boolean;
  statusBundleRemoved: true;
  residualRemaining: boolean;
  localityRemaining: boolean;
  nonStatusEvidenceCount: number;
  stillDifferentiatedAfterStatusBundleRemoval: boolean;
  statusBundleHardeningClass:
    | 'persists-with-residual-and-locality'
    | 'persists-with-residual-only'
    | 'persists-with-locality-only'
    | 'collapses-to-status-bundle'
    | 'inconclusive';
  notes: string[];
}

export interface PSimplexT28EStatusBundlePairAggregateRow {
  axisPairId: PSimplexT28EAxisPairId;
  k3TRowCount: number;
  statusHardenedDifferentiatedCount: number;
  statusBundleHardeningStatus: 'persists' | 'weakens' | 'collapses' | 'inconclusive';
}

export interface PSimplexT28EResidualOnlyRow {
  sampleId: string;
  sampleFamily: PSimplexT28ESampleFamily;
  childId: PSimplexT28EChildId;
  axisPairId: PSimplexT28EAxisPairId;
  axisAlignment: number | null;
  axisProjection: number | null;
  transverseResidualMagnitude: number | null;
  residualClass: 'low-residual-axis-legible' | 'high-residual-transverse' | 'intermediate' | 'missing';
  residualOnlySupportsSfa: boolean;
}

export interface PSimplexT28EResidualSeparationRow {
  axisPairId: PSimplexT28EAxisPairId;
  axisResidualMean: number | null;
  axisResidualMax: number | null;
  transverseResidualMean: number | null;
  transverseResidualMin: number | null;
  residualSeparation: number | null;
  residualRatio: number | null;
  residualSeparationStatus: 'strong-positive' | 'weak-positive' | 'none' | 'negative' | 'inconclusive';
}

export interface PSimplexT28ELocalityOnlyRow {
  sampleId: string;
  sampleFamily: PSimplexT28ESampleFamily;
  childId: PSimplexT28EChildId;
  axisPairId: PSimplexT28EAxisPairId;
  localitySensitive: boolean | null;
  kernelArtifactRisk: boolean | null;
  localityOnlyClass:
    | 'axis-nonlocality-clean'
    | 'transverse-locality-sensitive'
    | 'artifact-risk-only'
    | 'not-locality-distinguished'
    | 'missing';
}

export interface PSimplexT28ELocalitySeparationRow {
  axisPairId: PSimplexT28EAxisPairId;
  axisLocalitySensitiveCount: number;
  axisSampleCount: number;
  transverseLocalitySensitiveCount: number;
  transverseSampleCount: number;
  localitySeparationStatus: 'transverse-only' | 'mixed' | 'none' | 'artifact-only' | 'inconclusive';
}

export interface PSimplexT28ESyntheticTransverseControlRow {
  controlId: string;
  controlKind: 'opposite-sibling-midpoint' | 'rotated-axis-offset' | 'centroid-transverse' | 'other-explicit-local-control' | 'not-feasible';
  axisPairId: PSimplexT28EAxisPairId;
  targetChild: PSimplexT28EChildId | null;
  syntheticControlStatus: 'synthetic-control-not-feasible' | 'synthetic-control-implemented';
  reason: string;
  controlConstructionFormula?: string;
  matchesK3TBehavior?: boolean;
  controlInterpretation: 'general-transverse-behavior' | 'K3T-specific-behavior' | 'control-inconclusive';
}

export interface PSimplexT28EAxisFamilyStressRow {
  axisPairId: PSimplexT28EAxisPairId;
  childId: PSimplexT28EChildId;
  baseSampleFamily: 'K3-A-primary' | 'K3-A-complement';
  stressControlStatus: 'stress-control-implemented' | 'stress-control-not-feasible';
  baseCleanReadingAllowed: boolean | null;
  perturbedCleanReadingAllowed: boolean | null;
  baseAxisAlignment: number | null;
  perturbedAxisAlignment: number | null;
  baseTransverseResidualMagnitude: number | null;
  perturbedTransverseResidualMagnitude: number | null;
  axisLegibilityStableUnderStress: boolean | null;
  stressInterpretation: 'axis-family-robust' | 'axis-family-position-fragile' | 'stress-inconclusive' | 'not-feasible';
  controlConstructionFormula?: string;
}

export interface PSimplexT28EPairUniformityControlRow {
  controlFamily:
    | 'baseline'
    | 'status-bundle-hardening'
    | 'residual-only'
    | 'locality-only'
    | 'synthetic-transverse-control'
    | 'axis-family-stress';
  AB_CD_status: string;
  AC_BD_status: string;
  AD_BC_status: string;
  uniformityStatus: 'uniform-across-three-pairs' | 'mostly-uniform' | 'pair-specific' | 'inconclusive';
}

export interface PSimplexT28EClassificationRow {
  classificationId: PSimplexT28EClassificationId;
  applies: boolean;
  confidence: 'high' | 'medium' | 'low' | 'not-applicable';
  evidence: string[];
  blockedBy: string[];
}

export interface PSimplexT28EGlobalSummary {
  t28dParentVerdict: string | null;
  t28c1ParentVerdict: string | null;
  baselinePresentPairCount: number;
  statusBundlePersistPairCount: number;
  statusBundleCollapsePairCount: number;
  residualStrongPositivePairCount: number;
  residualWeakPositivePairCount: number;
  residualInconclusivePairCount: number;
  localityTransverseOnlyPairCount: number;
  localityArtifactOnlyPairCount: number;
  localityInconclusivePairCount: number;
  syntheticControlImplementedCount: number;
  syntheticControlNotFeasibleCount: number;
  syntheticControlMatchesK3TCount: number;
  axisStressImplementedCount: number;
  axisStressNotFeasibleCount: number;
  axisStressFragileCount: number;
  axisStressRobustCount: number;
  uniformityByControlFamily: Record<string, string>;
  primaryClassification: string;
  secondaryClassifications: string[];
  interpretation:
    | 'robust-k-local-asymmetry'
    | 'readability-policy-dependent'
    | 'residual-geometric'
    | 'locality-family-dependent'
    | 'k3t-construction-specific'
    | 'axis-sample-position-artifact'
    | 'control-inconclusive'
    | 'boundary-failed';
}

export interface PSimplexT28EBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT28EFalsifierRow {
  falsifierId: string;
  description: string;
  triggered: boolean;
  evidence: string;
  status: 'clear' | 'triggered';
}

export interface PSimplexT28EReport {
  method: 'p-simplex-k3-sampling-family-asymmetry-control-audit-t28e';
  diagnosticScope: 'k3-sampling-family-asymmetry-control-audit-only';
  branchRef: 'wgate/arf-w1-root-frame-v0';
  parentEvidenceRows: PSimplexT28EParentEvidenceRow[];
  baselineK3SfaRows: PSimplexT28EBaselineK3SfaRow[];
  statusBundleHardeningRows: PSimplexT28EStatusBundleHardeningRow[];
  statusBundlePairAggregateRows: PSimplexT28EStatusBundlePairAggregateRow[];
  residualOnlyRows: PSimplexT28EResidualOnlyRow[];
  residualSeparationRows: PSimplexT28EResidualSeparationRow[];
  localityOnlyRows: PSimplexT28ELocalityOnlyRow[];
  localitySeparationRows: PSimplexT28ELocalitySeparationRow[];
  syntheticTransverseControlRows: PSimplexT28ESyntheticTransverseControlRow[];
  axisFamilyStressRows: PSimplexT28EAxisFamilyStressRow[];
  pairUniformityControlRows: PSimplexT28EPairUniformityControlRow[];
  classificationRows: PSimplexT28EClassificationRow[];
  primaryClassification: PSimplexT28EClassificationId;
  secondaryClassifications: string[];
  globalSummary: PSimplexT28EGlobalSummary;
  boundaryRows: PSimplexT28EBoundaryRow[];
  falsifierRows: PSimplexT28EFalsifierRow[];
  summaryVerdict: PSimplexT28ESummaryVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

type JsonRecord = Record<string, unknown>;

const BRANCH_REF = 'wgate/arf-w1-root-frame-v0' as const;
const EPSILON = 1e-9;
const REQUIRED_T28D_VERDICT = 'T28-D-K-sampling-family-asymmetry-with-V-blindness';
const REQUIRED_T28C1_VERDICT = 'ATD-H0-fails-preload-or-single-channel-only';
const AXIS_PAIRS: ReadonlyArray<{
  axisPairId: PSimplexT28EAxisPairId;
  leftChild: PSimplexT28EChildId;
  rightChild: PSimplexT28EChildId;
}> = [
  { axisPairId: 'AB-CD', leftChild: 'M_AB', rightChild: 'M_CD' },
  { axisPairId: 'AC-BD', leftChild: 'M_AC', rightChild: 'M_BD' },
  { axisPairId: 'AD-BC', leftChild: 'M_AD', rightChild: 'M_BC' },
];
const CLASSIFICATION_IDS: readonly PSimplexT28EClassificationId[] = [
  'K3-SFA-robust-K-local-asymmetry',
  'K3-SFA-readability-policy-dependent',
  'K3-SFA-residual-geometric',
  'K3-SFA-locality-family-dependent',
  'K3-SFA-K3T-construction-specific',
  'K3-SFA-axis-sample-position-artifact',
  'K3-SFA-control-inconclusive',
  'K3-SFA-boundary-failed',
];

export function buildPSimplexK3SamplingFamilyAsymmetryControlAuditT28EReportFromInputs(
  inputs: PSimplexT28EInputs,
): PSimplexT28EReport {
  const parentEvidenceRows = buildParentEvidenceRows(inputs);
  const t28dParentVerdict = stringField(inputs.t28dReport, 'summaryVerdict') ?? null;
  const t28c1ParentVerdict =
    stringField(inputs.t28c1Report, 'summaryVerdict') ??
    stringField(objectField(inputs.t28dReport, 'globalSummary'), 't28c1ParentVerdict') ??
    null;
  const t28dInvariantSatisfied = t28dParentVerdict === REQUIRED_T28D_VERDICT;
  const t28c1InvariantSatisfied = t28c1ParentVerdict === REQUIRED_T28C1_VERDICT;
  const t28dPlaceholderDetected = detectT28DPlaceholderReport(inputs.t28dReport);
  const baselineK3SfaRows = buildBaselineRows(inputs.t28dReport);
  const statusBundleHardeningRows = buildStatusBundleHardeningRows(inputs.t28dReport, inputs.k3Report);
  const statusBundlePairAggregateRows = buildStatusBundlePairAggregateRows(statusBundleHardeningRows);
  const residualOnlyRows = buildResidualOnlyRows(inputs.k3Report);
  const residualSeparationRows = buildResidualSeparationRows(residualOnlyRows);
  const localityOnlyRows = buildLocalityOnlyRows(inputs.k3Report);
  const localitySeparationRows = buildLocalitySeparationRows(localityOnlyRows);
  const syntheticTransverseControlRows = buildSyntheticTransverseControlRows();
  const axisFamilyStressRows = buildAxisFamilyStressRows(inputs.k3Report);
  const pairUniformityControlRows = buildPairUniformityRows({
    baselineK3SfaRows,
    statusBundlePairAggregateRows,
    residualSeparationRows,
    localitySeparationRows,
    syntheticTransverseControlRows,
    axisFamilyStressRows,
  });
  const boundaryFailed = false;
  const controlInconclusive =
    !t28dInvariantSatisfied ||
    !t28c1InvariantSatisfied ||
    t28dPlaceholderDetected ||
    parentEvidenceRows.filter((row) => row.parentId !== 'V-optional' && row.parentId !== 'V-locality-optional').some((row) => !row.ok) ||
    baselineK3SfaRows.some((row) => row.baselineStatus === 'baseline-missing-or-inconsistent') ||
    statusBundleHardeningRows.length !== 6 ||
    residualSeparationRows.some((row) => row.residualSeparationStatus === 'inconclusive') ||
    localitySeparationRows.some((row) => row.localitySeparationStatus === 'inconclusive');
  const classificationRows = buildClassificationRows({
    boundaryFailed,
    controlInconclusive,
    statusBundlePairAggregateRows,
    residualSeparationRows,
    localitySeparationRows,
    syntheticTransverseControlRows,
    axisFamilyStressRows,
    pairUniformityControlRows,
  });
  const primaryClassification = choosePrimaryClassification(classificationRows);
  const secondaryClassifications = classificationRows
    .filter((row) => row.applies && row.classificationId !== primaryClassification)
    .map((row) => row.classificationId);
  const globalSummary = buildGlobalSummary({
    t28dParentVerdict,
    t28c1ParentVerdict,
    primaryClassification,
    secondaryClassifications,
    baselineK3SfaRows,
    statusBundlePairAggregateRows,
    residualSeparationRows,
    localitySeparationRows,
    syntheticTransverseControlRows,
    axisFamilyStressRows,
    pairUniformityControlRows,
  });
  const summaryVerdict = summaryVerdictForPrimary(primaryClassification);
  const boundaryRows = buildBoundaryRows();
  const falsifierRows = buildFalsifierRows({
    t28dInvariantSatisfied,
    t28dPlaceholderDetected,
    summaryVerdict,
    primaryClassification,
    statusBundleHardeningRows,
    residualOnlyRows,
    residualSeparationRows,
    localityOnlyRows,
    localitySeparationRows,
    syntheticTransverseControlRows,
    axisFamilyStressRows,
    pairUniformityControlRows,
  });
  const integrityIssues = buildIntegrityIssues({
    parentEvidenceRows,
    baselineK3SfaRows,
    statusBundleHardeningRows,
    statusBundlePairAggregateRows,
    residualOnlyRows,
    residualSeparationRows,
    localityOnlyRows,
    localitySeparationRows,
    syntheticTransverseControlRows,
    axisFamilyStressRows,
    pairUniformityControlRows,
    classificationRows,
    primaryClassification,
    summaryVerdict,
    t28dPlaceholderDetected,
  });

  return {
    method: 'p-simplex-k3-sampling-family-asymmetry-control-audit-t28e',
    diagnosticScope: 'k3-sampling-family-asymmetry-control-audit-only',
    branchRef: BRANCH_REF,
    parentEvidenceRows,
    baselineK3SfaRows,
    statusBundleHardeningRows,
    statusBundlePairAggregateRows,
    residualOnlyRows,
    residualSeparationRows,
    localityOnlyRows,
    localitySeparationRows,
    syntheticTransverseControlRows,
    axisFamilyStressRows,
    pairUniformityControlRows,
    classificationRows,
    primaryClassification,
    secondaryClassifications,
    globalSummary,
    boundaryRows,
    falsifierRows,
    summaryVerdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: integrityIssues.length === 0,
  };
}

function buildParentEvidenceRows(inputs: PSimplexT28EInputs): PSimplexT28EParentEvidenceRow[] {
  return [
    parentRow('T28-C0', 'buildPSimplexCrossProjectionProvenanceEligibilityPreflightT28C0Report', inputs.t28c0Report, 'parent-gate', [
      'T28-C0 is a parent gate only.',
    ]),
    parentRow('T28-C1', 'buildPSimplexAxisTransverseDiscriminationSurvivalMetricT28C1ReportFromInputs', inputs.t28c1Report, 'parent-gate', [
      'T28-C1 invariant is inherited through T28-D and is not retested as survival.',
    ]),
    parentRow('T28-D', 'buildPSimplexK3LocalAtdDecompositionVBlindnessAuditT28DReportFromInputs', inputs.t28dReport, 'baseline', [
      'T28-D supplies K3-SFA-H1 baseline rows.',
    ]),
    parentRow('K3', 'buildPSimplexGeometryGraphSamplingGateK3V0Report', inputs.k3Report, 'k3-control-source', [
      'K3 sample/vector/locality rows provide control data only.',
    ]),
    parentRow('V-optional', 'buildPSimplexVectorOrderParameterDiagnosticV0Report', inputs.vReport, 'optional-consistency-context', [
      'V parent is optional context only and provides no field-world maturity.',
    ], true),
    parentRow('V-locality-optional', 'buildPSimplexVectorOrderParameterLocalityDiagnosticV0Report', inputs.vLocalityReport, 'optional-consistency-context', [
      'V-locality parent is optional context only.',
    ], true),
  ];
}

function parentRow(
  parentId: PSimplexT28EParentEvidenceRow['parentId'],
  builderName: string,
  report: unknown,
  usedFor: PSimplexT28EParentEvidenceRow['usedFor'],
  notes: string[],
  optional = false,
): PSimplexT28EParentEvidenceRow {
  const importStatus = isRecord(report) ? 'imported' : optional ? 'optional-not-imported' : 'failed';

  return {
    parentId,
    builderName,
    importStatus,
    ok: parentOk(parentId, report, optional),
    summaryVerdict: stringField(report, 'summaryVerdict') ?? stringField(report, 'verdict'),
    diagnosticScope: stringField(report, 'diagnosticScope'),
    usedFor,
    notes,
  };
}

function parentOk(parentId: PSimplexT28EParentEvidenceRow['parentId'], report: unknown, optional: boolean): boolean {
  if (!isRecord(report)) {
    return optional;
  }

  if (parentId === 'T28-C0') {
    const verdict = stringField(report, 'summaryVerdict');

    return booleanField(report, 'ok') === true && numericIssueCount(report) === 0 && verdict !== undefined && !verdict.startsWith('ineligible-');
  }

  if (parentId === 'T28-C1') {
    return booleanField(report, 'ok') === true && numericIssueCount(report) === 0 && stringField(report, 'summaryVerdict') === REQUIRED_T28C1_VERDICT;
  }

  if (parentId === 'T28-D') {
    return (
      booleanField(report, 'ok') === true &&
      numericIssueCount(report) === 0 &&
      stringField(report, 'summaryVerdict') === REQUIRED_T28D_VERDICT &&
      !detectT28DPlaceholderReport(report)
    );
  }

  return booleanField(report, 'ok') === true && numericIssueCount(report) === 0;
}

function buildBaselineRows(t28dReport: unknown): PSimplexT28EBaselineK3SfaRow[] {
  const rows = arrayField(t28dReport, 'kPairStabilityRows');

  return AXIS_PAIRS.map((pair) => {
    const row = rows.find((entry) => stringField(entry, 'axisPairId') === pair.axisPairId);
    const kAxisLegibleRate = numberField(row, 'kAxisLegibleRate') ?? 0;
    const kTransverseDifferentiationRate = numberField(row, 'kTransverseDifferentiationRate') ?? 0;
    const dominantCauseFamily = stringField(row, 'dominantCauseFamily') ?? 'missing';
    const dominantCauseClassification = stringField(row, 'dominantCauseClassification') ?? 'missing';
    const artifactOnlyCount = numberField(row, 'artifactOnlyDifferentiationCount') ?? 0;
    const nonArtifactCount = numberField(row, 'nonArtifactDifferentiatedCount') ?? 0;
    const pairPattern = stringField(row, 'pairPattern') ?? 'missing';
    const present =
      isRecord(row) &&
      kAxisLegibleRate === 1 &&
      kTransverseDifferentiationRate === 1 &&
      dominantCauseFamily === 'unreadable-or-status' &&
      dominantCauseClassification === 'multi-cause-non-artifact-differentiation' &&
      artifactOnlyCount === 0 &&
      nonArtifactCount === 2 &&
      pairPattern === 'same-as-all-pairs';

    return {
      ...pair,
      kAxisLegibleRateFromT28D: kAxisLegibleRate,
      kTransverseDifferentiationRateFromT28D: kTransverseDifferentiationRate,
      dominantCauseFamilyFromT28D: dominantCauseFamily,
      dominantCauseClassificationFromT28D: dominantCauseClassification,
      artifactOnlyDifferentiationCountFromT28D: artifactOnlyCount,
      nonArtifactDifferentiatedCountFromT28D: nonArtifactCount,
      pairPatternFromT28D: pairPattern,
      baselineStatus: present ? 'baseline-k3-sfa-present' : 'baseline-missing-or-inconsistent',
    };
  });
}

function buildStatusBundleHardeningRows(
  t28dReport: unknown,
  k3Report: unknown,
): PSimplexT28EStatusBundleHardeningRow[] {
  const dCauseRows = arrayField(t28dReport, 'kTransverseCauseRows');
  const vectors = arrayField(k3Report, 'k3VectorResultRows');
  const audits = arrayField(k3Report, 'k3LocalityAuditRows');

  return dCauseRows
    .filter((row) => stringField(row, 'sampleId')?.startsWith('K3-T-') === true)
    .map((row) => {
      const sampleId = stringField(row, 'sampleId') ?? 'missing';
      const vector = vectors.find((entry) => stringField(entry, 'sampleId') === sampleId);
      const audit = audits.find((entry) => stringField(entry, 'sampleId') === sampleId);
      const residualRemaining = (numberField(vector, 'transverseResidualMagnitude') ?? numberField(row, 'transverseResidualMagnitude') ?? 0) > EPSILON;
      const artifactOnlyAfterStatusRemoval = booleanField(audit, 'kernelArtifactRisk') === true && !residualRemaining && booleanField(audit, 'localitySensitive') !== true;
      const localityRemaining = booleanField(audit, 'localitySensitive') === true && !artifactOnlyAfterStatusRemoval;
      const nonStatusEvidenceCount = (residualRemaining ? 1 : 0) + (localityRemaining ? 1 : 0);
      const stillDifferentiatedAfterStatusBundleRemoval = nonStatusEvidenceCount > 0;

      return {
        sampleId,
        childId: childIdFromSampleId(sampleId),
        axisPairId: axisPairIdForChild(childIdFromSampleId(sampleId)),
        originalDifferentiated: arrayField(row, 'nonArtifactCauses').length > 0 || booleanField(row, 'artifactOnly') === true,
        statusBundleRemoved: true,
        residualRemaining,
        localityRemaining,
        nonStatusEvidenceCount,
        stillDifferentiatedAfterStatusBundleRemoval,
        statusBundleHardeningClass: !isRecord(vector) || !isRecord(audit)
          ? 'inconclusive'
          : residualRemaining && localityRemaining
            ? 'persists-with-residual-and-locality'
            : residualRemaining
              ? 'persists-with-residual-only'
              : localityRemaining
                ? 'persists-with-locality-only'
                : 'collapses-to-status-bundle',
        notes: ['Status/readability bundle removed; residual and locality evidence are evaluated without treating kernel risk alone as support.'],
      };
    });
}

function buildStatusBundlePairAggregateRows(
  rows: readonly PSimplexT28EStatusBundleHardeningRow[],
): PSimplexT28EStatusBundlePairAggregateRow[] {
  return AXIS_PAIRS.map((pair) => {
    const pairRows = rows.filter((row) => row.axisPairId === pair.axisPairId);
    const count = pairRows.filter((row) => row.stillDifferentiatedAfterStatusBundleRemoval).length;

    return {
      axisPairId: pair.axisPairId,
      k3TRowCount: pairRows.length,
      statusHardenedDifferentiatedCount: count,
      statusBundleHardeningStatus: pairRows.length !== 2 || pairRows.some((row) => row.statusBundleHardeningClass === 'inconclusive')
        ? 'inconclusive'
        : count === 2
          ? 'persists'
          : count === 0
            ? 'collapses'
            : 'weakens',
    };
  });
}

function buildResidualOnlyRows(k3Report: unknown): PSimplexT28EResidualOnlyRow[] {
  const samples = relevantK3Samples(k3Report);
  const vectors = arrayField(k3Report, 'k3VectorResultRows');

  return samples.map((sample) => {
    const sampleId = stringField(sample, 'sampleId') ?? 'missing';
    const sampleFamily = sampleFamilyField(sample);
    const vector = vectors.find((row) => stringField(row, 'sampleId') === sampleId);
    const residual = numberField(vector, 'transverseResidualMagnitude');
    const axisAlignment = numberField(vector, 'axisAlignment') ?? null;
    const axisProjection = numberField(vector, 'axisProjection') ?? null;
    const childId = childIdFromSampleId(sampleId);
    const missing = residual === undefined || axisAlignment === null || axisProjection === null;
    const residualClass = missing
      ? 'missing'
      : sampleFamily === 'K3-T' && residual > EPSILON
        ? 'high-residual-transverse'
        : sampleFamily !== 'K3-T' && residual <= EPSILON
          ? 'low-residual-axis-legible'
          : 'intermediate';

    return {
      sampleId,
      sampleFamily,
      childId,
      axisPairId: axisPairIdForChild(childId),
      axisAlignment,
      axisProjection,
      transverseResidualMagnitude: residual ?? null,
      residualClass,
      residualOnlySupportsSfa: residualClass === 'low-residual-axis-legible' || residualClass === 'high-residual-transverse',
    };
  });
}

function buildResidualSeparationRows(rows: readonly PSimplexT28EResidualOnlyRow[]): PSimplexT28EResidualSeparationRow[] {
  return AXIS_PAIRS.map((pair) => {
    const pairRows = rows.filter((row) => row.axisPairId === pair.axisPairId);
    const axisResiduals = pairRows
      .filter((row) => row.sampleFamily !== 'K3-T')
      .map((row) => row.transverseResidualMagnitude)
      .filter(isNumber);
    const transverseResiduals = pairRows
      .filter((row) => row.sampleFamily === 'K3-T')
      .map((row) => row.transverseResidualMagnitude)
      .filter(isNumber);

    if (axisResiduals.length !== 4 || transverseResiduals.length !== 2) {
      return residualSeparationRow(pair.axisPairId, null, null, null, null, null, null, 'inconclusive');
    }

    const axisMean = cleanNumber(mean(axisResiduals));
    const transverseMean = cleanNumber(mean(transverseResiduals));
    const separation = cleanNumber(transverseMean - axisMean);
    const ratio = transverseMean > EPSILON ? cleanNumber(transverseMean / Math.max(axisMean, EPSILON)) : null;

    return residualSeparationRow(
      pair.axisPairId,
      axisMean,
      cleanNumber(Math.max(...axisResiduals)),
      transverseMean,
      cleanNumber(Math.min(...transverseResiduals)),
      separation,
      ratio,
      separation > 0.1 && ratio !== null && ratio >= 2
        ? 'strong-positive'
        : separation > EPSILON
          ? 'weak-positive'
          : Math.abs(separation) <= EPSILON
            ? 'none'
            : 'negative',
    );
  });
}

function buildLocalityOnlyRows(k3Report: unknown): PSimplexT28ELocalityOnlyRow[] {
  const samples = relevantK3Samples(k3Report);
  const audits = arrayField(k3Report, 'k3LocalityAuditRows');
  const vectors = arrayField(k3Report, 'k3VectorResultRows');

  return samples.map((sample) => {
    const sampleId = stringField(sample, 'sampleId') ?? 'missing';
    const sampleFamily = sampleFamilyField(sample);
    const audit = audits.find((row) => stringField(row, 'sampleId') === sampleId);
    const vector = vectors.find((row) => stringField(row, 'sampleId') === sampleId);
    const localitySensitive = booleanField(audit, 'localitySensitive');
    const kernelArtifactRisk = booleanField(audit, 'kernelArtifactRisk');
    const residualIndependent = (numberField(vector, 'transverseResidualMagnitude') ?? 0) > EPSILON;
    const childId = childIdFromSampleId(sampleId);
    const missing = localitySensitive === undefined || kernelArtifactRisk === undefined;
    const artifactOnly = localitySensitive === true && kernelArtifactRisk === true && !residualIndependent;

    return {
      sampleId,
      sampleFamily,
      childId,
      axisPairId: axisPairIdForChild(childId),
      localitySensitive: localitySensitive ?? null,
      kernelArtifactRisk: kernelArtifactRisk ?? null,
      localityOnlyClass: missing
        ? 'missing'
        : sampleFamily === 'K3-T' && localitySensitive === true && !artifactOnly
          ? 'transverse-locality-sensitive'
          : sampleFamily !== 'K3-T' && localitySensitive === false
            ? 'axis-nonlocality-clean'
            : artifactOnly
              ? 'artifact-risk-only'
              : 'not-locality-distinguished',
    };
  });
}

function buildLocalitySeparationRows(rows: readonly PSimplexT28ELocalityOnlyRow[]): PSimplexT28ELocalitySeparationRow[] {
  return AXIS_PAIRS.map((pair) => {
    const pairRows = rows.filter((row) => row.axisPairId === pair.axisPairId);
    const axisRows = pairRows.filter((row) => row.sampleFamily !== 'K3-T');
    const transverseRows = pairRows.filter((row) => row.sampleFamily === 'K3-T');
    const axisLocalitySensitiveCount = axisRows.filter((row) => row.localitySensitive === true).length;
    const transverseLocalitySensitiveCount = transverseRows.filter((row) => row.localitySensitive === true).length;
    const artifactOnly = transverseRows.length > 0 && transverseRows.every((row) => row.localityOnlyClass === 'artifact-risk-only');

    return {
      axisPairId: pair.axisPairId,
      axisLocalitySensitiveCount,
      axisSampleCount: axisRows.length,
      transverseLocalitySensitiveCount,
      transverseSampleCount: transverseRows.length,
      localitySeparationStatus: axisRows.length !== 4 || transverseRows.length !== 2 || pairRows.some((row) => row.localityOnlyClass === 'missing')
        ? 'inconclusive'
        : artifactOnly
          ? 'artifact-only'
          : transverseLocalitySensitiveCount === 2 && axisLocalitySensitiveCount === 0
            ? 'transverse-only'
            : transverseLocalitySensitiveCount > 0 && axisLocalitySensitiveCount > 0
              ? 'mixed'
              : 'none',
    };
  });
}

function buildSyntheticTransverseControlRows(): PSimplexT28ESyntheticTransverseControlRow[] {
  return AXIS_PAIRS.map((pair) => ({
    controlId: `synthetic-transverse-not-feasible:${pair.axisPairId}`,
    controlKind: 'not-feasible',
    axisPairId: pair.axisPairId,
    targetChild: null,
    syntheticControlStatus: 'synthetic-control-not-feasible',
    reason: 'No existing clean finite K3 geometry helper exposes a grounded synthetic transverse construction for T28-E.',
    controlInterpretation: 'control-inconclusive',
  }));
}

function buildAxisFamilyStressRows(k3Report: unknown): PSimplexT28EAxisFamilyStressRow[] {
  const samples = relevantK3Samples(k3Report).filter((sample) => sampleFamilyField(sample) !== 'K3-T');
  const vectors = arrayField(k3Report, 'k3VectorResultRows');

  return samples.map((sample) => {
    const sampleId = stringField(sample, 'sampleId') ?? 'missing';
    const vector = vectors.find((row) => stringField(row, 'sampleId') === sampleId);
    const childId = childIdFromSampleId(sampleId);

    return {
      axisPairId: axisPairIdForChild(childId),
      childId,
      baseSampleFamily: sampleFamilyField(sample) === 'K3-A-complement' ? 'K3-A-complement' : 'K3-A-primary',
      stressControlStatus: 'stress-control-not-feasible',
      baseCleanReadingAllowed: booleanField(vector, 'cleanReadingAllowed') ?? null,
      perturbedCleanReadingAllowed: null,
      baseAxisAlignment: numberField(vector, 'axisAlignment') ?? null,
      perturbedAxisAlignment: null,
      baseTransverseResidualMagnitude: numberField(vector, 'transverseResidualMagnitude') ?? null,
      perturbedTransverseResidualMagnitude: null,
      axisLegibilityStableUnderStress: null,
      stressInterpretation: 'not-feasible',
    };
  });
}

function buildPairUniformityRows(args: {
  baselineK3SfaRows: readonly PSimplexT28EBaselineK3SfaRow[];
  statusBundlePairAggregateRows: readonly PSimplexT28EStatusBundlePairAggregateRow[];
  residualSeparationRows: readonly PSimplexT28EResidualSeparationRow[];
  localitySeparationRows: readonly PSimplexT28ELocalitySeparationRow[];
  syntheticTransverseControlRows: readonly PSimplexT28ESyntheticTransverseControlRow[];
  axisFamilyStressRows: readonly PSimplexT28EAxisFamilyStressRow[];
}): PSimplexT28EPairUniformityControlRow[] {
  return [
    uniformityRow('baseline', statusesByPair(args.baselineK3SfaRows, (row) => row.baselineStatus)),
    uniformityRow('status-bundle-hardening', statusesByPair(args.statusBundlePairAggregateRows, (row) => row.statusBundleHardeningStatus)),
    uniformityRow('residual-only', statusesByPair(args.residualSeparationRows, (row) => row.residualSeparationStatus)),
    uniformityRow('locality-only', statusesByPair(args.localitySeparationRows, (row) => row.localitySeparationStatus)),
    uniformityRow('synthetic-transverse-control', statusesByPair(args.syntheticTransverseControlRows, (row) => row.syntheticControlStatus)),
    uniformityRow('axis-family-stress', statusesByPair(args.axisFamilyStressRows, (row) => row.stressControlStatus)),
  ];
}

function buildClassificationRows(args: {
  boundaryFailed: boolean;
  controlInconclusive: boolean;
  statusBundlePairAggregateRows: readonly PSimplexT28EStatusBundlePairAggregateRow[];
  residualSeparationRows: readonly PSimplexT28EResidualSeparationRow[];
  localitySeparationRows: readonly PSimplexT28ELocalitySeparationRow[];
  syntheticTransverseControlRows: readonly PSimplexT28ESyntheticTransverseControlRow[];
  axisFamilyStressRows: readonly PSimplexT28EAxisFamilyStressRow[];
  pairUniformityControlRows: readonly PSimplexT28EPairUniformityControlRow[];
}): PSimplexT28EClassificationRow[] {
  const statusPersistsAll = args.statusBundlePairAggregateRows.every((row) => row.statusBundleHardeningStatus === 'persists');
  const statusCollapsesAll = args.statusBundlePairAggregateRows.every((row) => row.statusBundleHardeningStatus === 'collapses');
  const residualStrongAll = args.residualSeparationRows.every((row) => row.residualSeparationStatus === 'strong-positive');
  const residualWeakOrInconclusive = args.residualSeparationRows.every((row) =>
    row.residualSeparationStatus === 'weak-positive' || row.residualSeparationStatus === 'none' || row.residualSeparationStatus === 'inconclusive',
  );
  const localityTransverseOnlyAll = args.localitySeparationRows.every((row) => row.localitySeparationStatus === 'transverse-only');
  const syntheticImplemented = args.syntheticTransverseControlRows.some((row) => row.syntheticControlStatus === 'synthetic-control-implemented');
  const syntheticSpecific = syntheticImplemented && args.syntheticTransverseControlRows.some((row) => row.matchesK3TBehavior === false);
  const stressImplemented = args.axisFamilyStressRows.some((row) => row.stressControlStatus === 'stress-control-implemented');
  const stressFragile = stressImplemented && args.axisFamilyStressRows.some((row) => row.stressInterpretation === 'axis-family-position-fragile');
  const availableUniformity =
    uniformityFor(args.pairUniformityControlRows, 'baseline') === 'uniform-across-three-pairs' &&
    uniformityFor(args.pairUniformityControlRows, 'status-bundle-hardening') === 'uniform-across-three-pairs' &&
    uniformityFor(args.pairUniformityControlRows, 'residual-only') === 'uniform-across-three-pairs' &&
    uniformityFor(args.pairUniformityControlRows, 'locality-only') === 'uniform-across-three-pairs';
  const robust = statusPersistsAll && residualStrongAll && localityTransverseOnlyAll && availableUniformity;

  return [
    classificationRow('K3-SFA-robust-K-local-asymmetry', robust, robust ? 'medium' : 'not-applicable', [
      `statusPersistsAll=${statusPersistsAll}`,
      `residualStrongAll=${residualStrongAll}`,
      `localityTransverseOnlyAll=${localityTransverseOnlyAll}`,
    ], residualStrongAll ? ['residual-geometric-classification-has-higher-precedence'] : []),
    classificationRow('K3-SFA-readability-policy-dependent', statusCollapsesAll, statusCollapsesAll ? 'high' : 'not-applicable', [
      `statusCollapsePairs=${args.statusBundlePairAggregateRows.filter((row) => row.statusBundleHardeningStatus === 'collapses').length}`,
    ], statusPersistsAll ? ['status-bundle-hardening-persists-for-all-pairs'] : []),
    classificationRow('K3-SFA-residual-geometric', residualStrongAll, residualStrongAll ? 'high' : 'not-applicable', [
      `residualStrongPositivePairs=${args.residualSeparationRows.filter((row) => row.residualSeparationStatus === 'strong-positive').length}`,
    ], []),
    classificationRow('K3-SFA-locality-family-dependent', localityTransverseOnlyAll && residualWeakOrInconclusive, localityTransverseOnlyAll ? 'medium' : 'not-applicable', [
      `localityTransverseOnlyPairs=${args.localitySeparationRows.filter((row) => row.localitySeparationStatus === 'transverse-only').length}`,
    ], residualStrongAll ? ['residual-separation-is-strong-positive'] : []),
    classificationRow('K3-SFA-K3T-construction-specific', syntheticSpecific, syntheticSpecific ? 'medium' : 'not-applicable', [
      `syntheticImplemented=${syntheticImplemented}`,
    ], syntheticImplemented ? [] : ['synthetic-controls-not-feasible']),
    classificationRow('K3-SFA-axis-sample-position-artifact', stressFragile, stressFragile ? 'medium' : 'not-applicable', [
      `axisStressImplemented=${stressImplemented}`,
    ], stressImplemented ? [] : ['axis-stress-controls-not-feasible']),
    classificationRow('K3-SFA-control-inconclusive', args.controlInconclusive, args.controlInconclusive ? 'high' : 'not-applicable', [
      `controlInconclusive=${args.controlInconclusive}`,
    ], args.controlInconclusive ? [] : ['required-parent-baseline-status-residual-locality-controls-available']),
    classificationRow('K3-SFA-boundary-failed', args.boundaryFailed, args.boundaryFailed ? 'high' : 'not-applicable', [
      `boundaryFailed=${args.boundaryFailed}`,
    ], []),
  ];
}

function choosePrimaryClassification(rows: readonly PSimplexT28EClassificationRow[]): PSimplexT28EClassificationId {
  const precedence: readonly PSimplexT28EClassificationId[] = [
    'K3-SFA-boundary-failed',
    'K3-SFA-control-inconclusive',
    'K3-SFA-readability-policy-dependent',
    'K3-SFA-axis-sample-position-artifact',
    'K3-SFA-K3T-construction-specific',
    'K3-SFA-residual-geometric',
    'K3-SFA-locality-family-dependent',
    'K3-SFA-robust-K-local-asymmetry',
  ];

  return precedence.find((classificationId) => rows.some((row) => row.classificationId === classificationId && row.applies)) ?? 'K3-SFA-control-inconclusive';
}

function buildGlobalSummary(args: {
  t28dParentVerdict: string | null;
  t28c1ParentVerdict: string | null;
  primaryClassification: PSimplexT28EClassificationId;
  secondaryClassifications: string[];
  baselineK3SfaRows: readonly PSimplexT28EBaselineK3SfaRow[];
  statusBundlePairAggregateRows: readonly PSimplexT28EStatusBundlePairAggregateRow[];
  residualSeparationRows: readonly PSimplexT28EResidualSeparationRow[];
  localitySeparationRows: readonly PSimplexT28ELocalitySeparationRow[];
  syntheticTransverseControlRows: readonly PSimplexT28ESyntheticTransverseControlRow[];
  axisFamilyStressRows: readonly PSimplexT28EAxisFamilyStressRow[];
  pairUniformityControlRows: readonly PSimplexT28EPairUniformityControlRow[];
}): PSimplexT28EGlobalSummary {
  return {
    t28dParentVerdict: args.t28dParentVerdict,
    t28c1ParentVerdict: args.t28c1ParentVerdict,
    baselinePresentPairCount: args.baselineK3SfaRows.filter((row) => row.baselineStatus === 'baseline-k3-sfa-present').length,
    statusBundlePersistPairCount: args.statusBundlePairAggregateRows.filter((row) => row.statusBundleHardeningStatus === 'persists').length,
    statusBundleCollapsePairCount: args.statusBundlePairAggregateRows.filter((row) => row.statusBundleHardeningStatus === 'collapses').length,
    residualStrongPositivePairCount: args.residualSeparationRows.filter((row) => row.residualSeparationStatus === 'strong-positive').length,
    residualWeakPositivePairCount: args.residualSeparationRows.filter((row) => row.residualSeparationStatus === 'weak-positive').length,
    residualInconclusivePairCount: args.residualSeparationRows.filter((row) => row.residualSeparationStatus === 'inconclusive').length,
    localityTransverseOnlyPairCount: args.localitySeparationRows.filter((row) => row.localitySeparationStatus === 'transverse-only').length,
    localityArtifactOnlyPairCount: args.localitySeparationRows.filter((row) => row.localitySeparationStatus === 'artifact-only').length,
    localityInconclusivePairCount: args.localitySeparationRows.filter((row) => row.localitySeparationStatus === 'inconclusive').length,
    syntheticControlImplementedCount: args.syntheticTransverseControlRows.filter((row) => row.syntheticControlStatus === 'synthetic-control-implemented').length,
    syntheticControlNotFeasibleCount: args.syntheticTransverseControlRows.filter((row) => row.syntheticControlStatus === 'synthetic-control-not-feasible').length,
    syntheticControlMatchesK3TCount: args.syntheticTransverseControlRows.filter((row) => row.matchesK3TBehavior === true).length,
    axisStressImplementedCount: args.axisFamilyStressRows.filter((row) => row.stressControlStatus === 'stress-control-implemented').length,
    axisStressNotFeasibleCount: args.axisFamilyStressRows.filter((row) => row.stressControlStatus === 'stress-control-not-feasible').length,
    axisStressFragileCount: args.axisFamilyStressRows.filter((row) => row.stressInterpretation === 'axis-family-position-fragile').length,
    axisStressRobustCount: args.axisFamilyStressRows.filter((row) => row.stressInterpretation === 'axis-family-robust').length,
    uniformityByControlFamily: Object.fromEntries(args.pairUniformityControlRows.map((row) => [row.controlFamily, row.uniformityStatus])),
    primaryClassification: args.primaryClassification,
    secondaryClassifications: args.secondaryClassifications,
    interpretation: interpretationFor(args.primaryClassification),
  };
}

function buildBoundaryRows(): PSimplexT28EBoundaryRow[] {
  return [
    boundaryRow('not-ATD-H0-survival', 'T28-E does not retest or rescue ATD-H0 survival.'),
    boundaryRow('not-ACTS-v0', 'ACTS-v0 is not introduced.'),
    boundaryRow('not-corridor', 'No corridor maturity is claimed.'),
    boundaryRow('not-route', 'No route maturity is claimed.'),
    boundaryRow('not-gate', 'No gate maturity is claimed.'),
    boundaryRow('not-loop', 'No loop interpretation is claimed.'),
    boundaryRow('not-vortex', 'No vortex interpretation is claimed.'),
    boundaryRow('not-support-region', 'No support-region interpretation is claimed.'),
    boundaryRow('not-topology', 'No topology workspace or operation is authorized.'),
    boundaryRow('not-fieldcue', 'No FieldCue is created or authorized.'),
    boundaryRow('not-semantic-naming', 'No semantic naming is introduced.'),
    boundaryRow('not-generated-site-reading', 'No generated-site reading is created.'),
    boundaryRow('not-runtime', 'No runtime behavior or substrate is authorized.'),
    boundaryRow('not-field-resurrection', 'No field residue is resurrected into support.'),
    boundaryRow('not-P-channel-support', 'P-channel support is excluded.'),
    boundaryRow('not-G-spatial-propagation', 'G-channel spatial propagation support is excluded.'),
    boundaryRow('not-closed-A3-response', 'Closed A3 response is not claimed.'),
    boundaryRow('not-body-response', 'Body response is not claimed.'),
  ];
}

function buildFalsifierRows(args: {
  t28dInvariantSatisfied: boolean;
  t28dPlaceholderDetected: boolean;
  summaryVerdict: PSimplexT28ESummaryVerdict;
  primaryClassification: PSimplexT28EClassificationId;
  statusBundleHardeningRows: readonly PSimplexT28EStatusBundleHardeningRow[];
  residualOnlyRows: readonly PSimplexT28EResidualOnlyRow[];
  residualSeparationRows: readonly PSimplexT28EResidualSeparationRow[];
  localityOnlyRows: readonly PSimplexT28ELocalityOnlyRow[];
  localitySeparationRows: readonly PSimplexT28ELocalitySeparationRow[];
  syntheticTransverseControlRows: readonly PSimplexT28ESyntheticTransverseControlRow[];
  axisFamilyStressRows: readonly PSimplexT28EAxisFamilyStressRow[];
  pairUniformityControlRows: readonly PSimplexT28EPairUniformityControlRow[];
}): PSimplexT28EFalsifierRow[] {
  const syntheticImplementedWithoutFormula = args.syntheticTransverseControlRows.some(
    (row) => row.syntheticControlStatus === 'synthetic-control-implemented' && !row.controlConstructionFormula,
  );
  const stressImplementedWithoutFormula = args.axisFamilyStressRows.some(
    (row) => row.stressControlStatus === 'stress-control-implemented' && !row.controlConstructionFormula,
  );
  const infeasibleSyntheticUsed = args.primaryClassification === 'K3-SFA-K3T-construction-specific' &&
    args.syntheticTransverseControlRows.every((row) => row.syntheticControlStatus === 'synthetic-control-not-feasible');
  const infeasibleStressUsed =
    args.primaryClassification === 'K3-SFA-axis-sample-position-artifact' &&
    args.axisFamilyStressRows.every((row) => row.stressControlStatus === 'stress-control-not-feasible');

  return [
    falsifierRow('F1', 'ATD-H0 survival is retested or rescued.', false, 'Only K3-SFA control classifications are emitted.'),
    falsifierRow('F2', 'K3-SFA is promoted to forbidden mature feature vocabulary.', false, 'Forbidden maturity vocabulary appears only in negative boundary rows.'),
    falsifierRow('F3', 'P-channel is imported or used as support.', false, 'T28-E imports no P-channel parent.'),
    falsifierRow('F4', 'G-channel is used as spatial propagation.', false, 'G-channel is only used inside the real T28-C1 parent chain and not as T28-E support.'),
    falsifierRow('F5', 'Status-bundle hardening is not performed.', args.statusBundleHardeningRows.length !== 6, `${args.statusBundleHardeningRows.length}/6 status rows.`),
    falsifierRow('F6', 'Residual-only comparison is not performed.', args.residualOnlyRows.length === 0 || args.residualSeparationRows.length !== 3, `${args.residualOnlyRows.length} residual rows; ${args.residualSeparationRows.length}/3 separation rows.`),
    falsifierRow('F7', 'Locality-only comparison is not performed.', args.localityOnlyRows.length === 0 || args.localitySeparationRows.length !== 3, `${args.localityOnlyRows.length} locality rows; ${args.localitySeparationRows.length}/3 separation rows.`),
    falsifierRow('F8', 'Synthetic controls are claimed as implemented but no construction formula/control rows exist.', syntheticImplementedWithoutFormula, `implemented=${args.syntheticTransverseControlRows.filter((row) => row.syntheticControlStatus === 'synthetic-control-implemented').length}.`),
    falsifierRow('F9', 'Axis stress controls are claimed as implemented but no perturbation formula/stress rows exist.', stressImplementedWithoutFormula, `implemented=${args.axisFamilyStressRows.filter((row) => row.stressControlStatus === 'stress-control-implemented').length}.`),
    falsifierRow('F10', 'Pair-specific behavior is hidden under global uniformity.', args.pairUniformityControlRows.some((row) => row.uniformityStatus === 'uniform-across-three-pairs' && !statusesActuallyUniform(row)), 'Uniformity rows are computed per control family.'),
    falsifierRow('F11', 'KernelArtifactRisk alone is treated as robust invariant evidence.', false, 'Artifact-only locality rows are not counted as robust evidence.'),
    falsifierRow('F12', 'Synthetic-control-not-feasible is treated as evidence for K3T construction specificity.', infeasibleSyntheticUsed, `primary=${args.primaryClassification}.`),
    falsifierRow('F13', 'Stress-control-not-feasible is treated as evidence for axis-position robustness or fragility.', infeasibleStressUsed, `primary=${args.primaryClassification}.`),
    falsifierRow('F14', 'Summary verdict exceeds allowed classification vocabulary.', forbiddenVerdict(args.summaryVerdict), `summaryVerdict=${args.summaryVerdict}.`),
    falsifierRow('F15', 'More than one primary classification is assigned.', !CLASSIFICATION_IDS.includes(args.primaryClassification), `primary=${args.primaryClassification}.`),
    falsifierRow('F16', 'T28-D parent invariant is not checked.', false, `T28-D invariant checked; satisfied=${args.t28dInvariantSatisfied}.`),
    falsifierRow('F17', 'T28-D no-input placeholder report is used as parent truth.', args.t28dPlaceholderDetected, `placeholderDetected=${args.t28dPlaceholderDetected}.`),
    falsifierRow('F18', 'Parent controls are infeasible but reported as implemented.', syntheticImplementedWithoutFormula || stressImplementedWithoutFormula, 'Feasibility status is explicit per control row.'),
  ];
}

function buildIntegrityIssues(args: {
  parentEvidenceRows: readonly PSimplexT28EParentEvidenceRow[];
  baselineK3SfaRows: readonly PSimplexT28EBaselineK3SfaRow[];
  statusBundleHardeningRows: readonly PSimplexT28EStatusBundleHardeningRow[];
  statusBundlePairAggregateRows: readonly PSimplexT28EStatusBundlePairAggregateRow[];
  residualOnlyRows: readonly PSimplexT28EResidualOnlyRow[];
  residualSeparationRows: readonly PSimplexT28EResidualSeparationRow[];
  localityOnlyRows: readonly PSimplexT28ELocalityOnlyRow[];
  localitySeparationRows: readonly PSimplexT28ELocalitySeparationRow[];
  syntheticTransverseControlRows: readonly PSimplexT28ESyntheticTransverseControlRow[];
  axisFamilyStressRows: readonly PSimplexT28EAxisFamilyStressRow[];
  pairUniformityControlRows: readonly PSimplexT28EPairUniformityControlRow[];
  classificationRows: readonly PSimplexT28EClassificationRow[];
  primaryClassification: PSimplexT28EClassificationId;
  summaryVerdict: PSimplexT28ESummaryVerdict;
  t28dPlaceholderDetected: boolean;
}): string[] {
  const issues: string[] = [];

  if (args.parentEvidenceRows.length !== 6) {
    issues.push(`Missing parent evidence rows: expected 6, got ${args.parentEvidenceRows.length}.`);
  }

  if (args.baselineK3SfaRows.length !== 3) {
    issues.push(`Missing baseline rows: expected 3, got ${args.baselineK3SfaRows.length}.`);
  }

  if (args.statusBundleHardeningRows.length !== 6) {
    issues.push(`Missing status-bundle hardening rows: expected 6, got ${args.statusBundleHardeningRows.length}.`);
  }

  if (args.statusBundlePairAggregateRows.length !== 3) {
    issues.push(`Missing status-bundle pair aggregate rows: expected 3, got ${args.statusBundlePairAggregateRows.length}.`);
  }

  if (args.residualOnlyRows.length !== 18) {
    issues.push(`Missing residual rows: expected 18, got ${args.residualOnlyRows.length}.`);
  }

  if (args.residualSeparationRows.length !== 3) {
    issues.push(`Missing residual separation rows: expected 3, got ${args.residualSeparationRows.length}.`);
  }

  if (args.localityOnlyRows.length !== 18) {
    issues.push(`Missing locality rows: expected 18, got ${args.localityOnlyRows.length}.`);
  }

  if (args.localitySeparationRows.length !== 3) {
    issues.push(`Missing locality separation rows: expected 3, got ${args.localitySeparationRows.length}.`);
  }

  if (args.pairUniformityControlRows.length !== 6) {
    issues.push(`Missing pair uniformity control rows: expected 6, got ${args.pairUniformityControlRows.length}.`);
  }

  if (args.classificationRows.length !== CLASSIFICATION_IDS.length) {
    issues.push(`Missing classification rows: expected ${CLASSIFICATION_IDS.length}, got ${args.classificationRows.length}.`);
  }

  if (!CLASSIFICATION_IDS.includes(args.primaryClassification)) {
    issues.push('Missing primary classification.');
  }

  if (forbiddenVerdict(args.summaryVerdict)) {
    issues.push('Forbidden verdict string used.');
  }

  if (summaryVerdictForPrimary(args.primaryClassification) !== args.summaryVerdict) {
    issues.push('Summary verdict inconsistent with primary classification.');
  }

  if (args.syntheticTransverseControlRows.some((row) => row.syntheticControlStatus === 'synthetic-control-implemented' && !row.controlConstructionFormula)) {
    issues.push('Synthetic control marked implemented without construction formula.');
  }

  if (args.axisFamilyStressRows.some((row) => row.stressControlStatus === 'stress-control-implemented' && !row.controlConstructionFormula)) {
    issues.push('Axis stress marked implemented without perturbation formula.');
  }

  if (
    args.primaryClassification === 'K3-SFA-K3T-construction-specific' &&
    args.syntheticTransverseControlRows.every((row) => row.syntheticControlStatus === 'synthetic-control-not-feasible')
  ) {
    issues.push('Not-feasible synthetic control used as positive evidence.');
  }

  if (
    args.primaryClassification === 'K3-SFA-axis-sample-position-artifact' &&
    args.axisFamilyStressRows.every((row) => row.stressControlStatus === 'stress-control-not-feasible')
  ) {
    issues.push('Not-feasible axis stress control used as positive evidence.');
  }

  if (args.t28dPlaceholderDetected && args.primaryClassification !== 'K3-SFA-control-inconclusive') {
    issues.push('T28-D no-input placeholder used as parent truth.');
  }

  return unique(issues);
}

function relevantK3Samples(k3Report: unknown): unknown[] {
  return arrayField(k3Report, 'k3SampleRows').filter((sample) =>
    isRelevantSampleFamily(stringField(sample, 'sampleFamily')),
  );
}

function sampleFamilyField(sample: unknown): PSimplexT28ESampleFamily {
  const value = stringField(sample, 'sampleFamily');

  return value === 'K3-A-complement' || value === 'K3-T' ? value : 'K3-A-primary';
}

function isRelevantSampleFamily(value: string | undefined): value is PSimplexT28ESampleFamily {
  return value === 'K3-A-primary' || value === 'K3-A-complement' || value === 'K3-T';
}

function residualSeparationRow(
  axisPairId: PSimplexT28EAxisPairId,
  axisResidualMean: number | null,
  axisResidualMax: number | null,
  transverseResidualMean: number | null,
  transverseResidualMin: number | null,
  residualSeparation: number | null,
  residualRatio: number | null,
  residualSeparationStatus: PSimplexT28EResidualSeparationRow['residualSeparationStatus'],
): PSimplexT28EResidualSeparationRow {
  return {
    axisPairId,
    axisResidualMean,
    axisResidualMax,
    transverseResidualMean,
    transverseResidualMin,
    residualSeparation,
    residualRatio,
    residualSeparationStatus,
  };
}

function uniformityRow(
  controlFamily: PSimplexT28EPairUniformityControlRow['controlFamily'],
  statuses: Record<PSimplexT28EAxisPairId, string>,
): PSimplexT28EPairUniformityControlRow {
  const values = [statuses['AB-CD'], statuses['AC-BD'], statuses['AD-BC']];

  return {
    controlFamily,
    AB_CD_status: statuses['AB-CD'],
    AC_BD_status: statuses['AC-BD'],
    AD_BC_status: statuses['AD-BC'],
    uniformityStatus: values.some((value) => value.includes('inconclusive') || value.includes('not-feasible') || value === 'missing')
      ? 'inconclusive'
      : new Set(values).size === 1
        ? 'uniform-across-three-pairs'
        : new Set(values).size === 2
          ? 'mostly-uniform'
          : 'pair-specific',
  };
}

function statusesByPair<T extends { axisPairId: PSimplexT28EAxisPairId }>(
  rows: readonly T[],
  status: (row: T) => string,
): Record<PSimplexT28EAxisPairId, string> {
  return Object.fromEntries(
    AXIS_PAIRS.map((pair) => {
      const pairRows = rows.filter((row) => row.axisPairId === pair.axisPairId);
      const value = pairRows.length === 0
        ? 'missing'
        : pairRows.length === 1
          ? status(pairRows[0])
          : unique(pairRows.map(status)).length === 1
            ? status(pairRows[0])
            : 'mixed';

      return [pair.axisPairId, value];
    }),
  ) as Record<PSimplexT28EAxisPairId, string>;
}

function uniformityFor(
  rows: readonly PSimplexT28EPairUniformityControlRow[],
  controlFamily: PSimplexT28EPairUniformityControlRow['controlFamily'],
): string {
  return rows.find((row) => row.controlFamily === controlFamily)?.uniformityStatus ?? 'inconclusive';
}

function classificationRow(
  classificationId: PSimplexT28EClassificationId,
  applies: boolean,
  confidence: PSimplexT28EClassificationRow['confidence'],
  evidence: string[],
  blockedBy: string[],
): PSimplexT28EClassificationRow {
  return {
    classificationId,
    applies,
    confidence: applies ? confidence : 'not-applicable',
    evidence,
    blockedBy,
  };
}

function summaryVerdictForPrimary(primary: PSimplexT28EClassificationId): PSimplexT28ESummaryVerdict {
  if (primary === 'K3-SFA-boundary-failed') {
    return 'T28-E-boundary-failed';
  }

  if (primary === 'K3-SFA-control-inconclusive') {
    return 'T28-E-K3-SFA-control-inconclusive';
  }

  if (primary === 'K3-SFA-readability-policy-dependent') {
    return 'T28-E-K3-SFA-readability-policy-dependent';
  }

  if (primary === 'K3-SFA-axis-sample-position-artifact') {
    return 'T28-E-K3-SFA-axis-sample-position-artifact';
  }

  if (primary === 'K3-SFA-K3T-construction-specific') {
    return 'T28-E-K3-SFA-K3T-construction-specific';
  }

  if (primary === 'K3-SFA-residual-geometric') {
    return 'T28-E-K3-SFA-residual-geometric';
  }

  if (primary === 'K3-SFA-locality-family-dependent') {
    return 'T28-E-K3-SFA-locality-family-dependent';
  }

  return 'T28-E-K3-SFA-robust-K-local-asymmetry';
}

function interpretationFor(primary: PSimplexT28EClassificationId): PSimplexT28EGlobalSummary['interpretation'] {
  if (primary === 'K3-SFA-boundary-failed') {
    return 'boundary-failed';
  }

  if (primary === 'K3-SFA-control-inconclusive') {
    return 'control-inconclusive';
  }

  if (primary === 'K3-SFA-readability-policy-dependent') {
    return 'readability-policy-dependent';
  }

  if (primary === 'K3-SFA-axis-sample-position-artifact') {
    return 'axis-sample-position-artifact';
  }

  if (primary === 'K3-SFA-K3T-construction-specific') {
    return 'k3t-construction-specific';
  }

  if (primary === 'K3-SFA-residual-geometric') {
    return 'residual-geometric';
  }

  if (primary === 'K3-SFA-locality-family-dependent') {
    return 'locality-family-dependent';
  }

  return 'robust-k-local-asymmetry';
}

function detectT28DPlaceholderReport(report: unknown): boolean {
  if (!isRecord(report) || stringField(report, 'method') !== 'p-simplex-k3-local-atd-decomposition-v-blindness-audit-t28d') {
    return false;
  }

  const parentRows = arrayField(report, 'parentEvidenceRows');

  return parentRows.length > 0 && parentRows.some((row) => {
    const parentId = stringField(row, 'parentId');

    return parentId !== 'V-locality-optional' && stringField(row, 'importStatus') !== 'imported';
  });
}

function forbiddenVerdict(summaryVerdict: string): boolean {
  return [
    'ATD-H0-survives',
    'ACTS-v0-accepted',
    'corridor-confirmed',
    'route-confirmed',
    'gate-confirmed',
    'fieldworld-feature-confirmed',
    'FieldCue-ready',
    'topology-authorized',
    'runtime-authorized',
  ].includes(summaryVerdict);
}

function statusesActuallyUniform(row: PSimplexT28EPairUniformityControlRow): boolean {
  return new Set([row.AB_CD_status, row.AC_BD_status, row.AD_BC_status]).size === 1;
}

function boundaryRow(boundaryId: string, statement: string): PSimplexT28EBoundaryRow {
  return {
    boundaryId,
    statement,
    enforced: true,
  };
}

function falsifierRow(falsifierId: string, description: string, triggered: boolean, evidence: string): PSimplexT28EFalsifierRow {
  return {
    falsifierId,
    description,
    triggered,
    evidence,
    status: triggered ? 'triggered' : 'clear',
  };
}

function axisPairIdForChild(childId: PSimplexT28EChildId): PSimplexT28EAxisPairId {
  if (childId === 'M_AB' || childId === 'M_CD') {
    return 'AB-CD';
  }

  if (childId === 'M_AC' || childId === 'M_BD') {
    return 'AC-BD';
  }

  return 'AD-BC';
}

function childIdFromSampleId(sampleId: string): PSimplexT28EChildId {
  const match = /(M_[A-Z]{2})$/u.exec(sampleId);
  const value = match?.[1];

  return value === 'M_AB' || value === 'M_AC' || value === 'M_AD' || value === 'M_BC' || value === 'M_BD' || value === 'M_CD'
    ? value
    : 'M_AB';
}

function objectField(value: unknown, key: string): unknown {
  if (!isRecord(value)) {
    return undefined;
  }

  return value[key];
}

function numericIssueCount(report: unknown): number {
  return numberField(report, 'integrityIssueCount') ?? numberField(report, 'issueCount') ?? 0;
}

function arrayField(value: unknown, key: string): unknown[] {
  if (!isRecord(value)) {
    return [];
  }

  const field = value[key];

  return Array.isArray(field) ? field : [];
}

function stringField(value: unknown, key: string): string | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const field = value[key];

  return typeof field === 'string' ? field : undefined;
}

function numberField(value: unknown, key: string): number | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const field = value[key];

  return typeof field === 'number' ? field : undefined;
}

function booleanField(value: unknown, key: string): boolean | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const field = value[key];

  return typeof field === 'boolean' ? field : undefined;
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null;
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

function mean(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function cleanNumber(value: number): number {
  if (Math.abs(value) <= 1e-12) {
    return 0;
  }

  return Number(value.toFixed(12));
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

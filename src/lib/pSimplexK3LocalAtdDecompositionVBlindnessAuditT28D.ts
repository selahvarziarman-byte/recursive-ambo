export type PSimplexT28DAxisPairId = 'AB-CD' | 'AC-BD' | 'AD-BC';
export type PSimplexT28DChildId = 'M_AB' | 'M_AC' | 'M_AD' | 'M_BC' | 'M_BD' | 'M_CD';
export type PSimplexT28DClassificationId =
  | 'K-local-invariant'
  | 'K-local-artifact-risk'
  | 'K-locality-sensitive-only'
  | 'K-sampling-family-asymmetry'
  | 'V-readout-mismatch'
  | 'insufficient-to-classify';
export type PSimplexT28DSummaryVerdict =
  | 'T28-D-K-local-invariant-with-V-readout-mismatch'
  | 'T28-D-K-sampling-family-asymmetry-with-V-blindness'
  | 'T28-D-K-locality-sensitive-only'
  | 'T28-D-K-artifact-risk'
  | 'T28-D-insufficient-to-classify'
  | 'T28-D-boundary-failed';
export type PSimplexT28DNonArtifactCause =
  | 'clean-reading-blocked'
  | 'suppression-reason-present'
  | 'unreadable-under-axis-policy'
  | 'axis-bent-or-mixed'
  | 'locality-sensitive'
  | 'transverse-residual';
export type PSimplexT28DDifferentiationCause = PSimplexT28DNonArtifactCause | 'kernel-artifact-risk';
export type PSimplexT28DCauseFamily =
  | 'clean-reading-blocked'
  | 'suppression-reason'
  | 'unreadable-or-status'
  | 'locality-sensitive'
  | 'transverse-residual'
  | 'kernel-artifact-only'
  | 'multi-cause'
  | 'none'
  | 'inconclusive';

export interface PSimplexT28DInputs {
  t28c0Report: unknown;
  t28c1Report: unknown;
  k3Report: unknown;
  vReport: unknown;
  vLocalityReport?: unknown;
}

export interface PSimplexT28DParentEvidenceRow {
  parentId: 'T28-C0' | 'T28-C1' | 'K3' | 'V' | 'V-locality-optional';
  builderName: string;
  importStatus: 'imported' | 'optional-not-imported' | 'failed';
  ok: boolean;
  summaryVerdict?: string;
  diagnosticScope?: string;
  usedFor: 'parent-gate' | 'k-decomposition' | 'v-blindness' | 'optional-v-context';
  notes: string[];
}

export interface PSimplexT28DKSignalDecompositionRow {
  axisPairId: PSimplexT28DAxisPairId;
  leftChild: PSimplexT28DChildId;
  rightChild: PSimplexT28DChildId;
  kAxisLegibleRateFromT28C1: number;
  kTransverseDifferentiationRateFromT28C1: number;
  kScoreFromT28C1: 0 | 1 | 2;
  kAxisSampleIds: string[];
  kTransverseSampleIds: string[];
  kSignalPresent: boolean;
  kSignalStatus: 'k-signal-present' | 'k-signal-absent' | 'k-signal-incomplete';
}

export interface PSimplexT28DKTransverseCauseRow {
  axisPairId: PSimplexT28DAxisPairId;
  childId: PSimplexT28DChildId;
  sampleId: string;
  cleanReadingAllowed: boolean | null;
  readabilityStatus: string | null;
  status: string | null;
  suppressionReason: string | null;
  localitySensitive: boolean | null;
  kernelArtifactRisk: boolean | null;
  transverseResidualMagnitude: number | null;
  differentiationCauses: PSimplexT28DDifferentiationCause[];
  nonArtifactCauses: PSimplexT28DNonArtifactCause[];
  artifactOnly: boolean;
  causeClassification:
    | 'non-artifact-locality-differentiation'
    | 'artifact-only-differentiation'
    | 'mixed-artifact-and-locality'
    | 'status-only-differentiation'
    | 'residual-only-differentiation'
    | 'clean-reading-only-differentiation'
    | 'multi-cause-non-artifact-differentiation'
    | 'undifferentiated'
    | 'missing-row';
}

export interface PSimplexT28DKCauseAblationRow {
  axisPairId: PSimplexT28DAxisPairId;
  originalKTransverseRowCount: number;
  originalKTransverseDifferentiatedCount: number;
  artifactOnlyDifferentiationCount: number;
  nonArtifactDifferentiatedCount: number;
  withoutKernelArtifactOnlyCount: number;
  withoutCleanReadingBlockedCount: number;
  withoutSuppressionReasonCount: number;
  withoutUnreadableOrStatusCount: number;
  withoutLocalitySensitiveCount: number;
  withoutTransverseResidualCount: number;
  persistsWithoutKernelArtifactOnly: boolean;
  persistsWithoutCleanReadingBlocked: boolean;
  persistsWithoutSuppressionReason: boolean;
  persistsWithoutUnreadableOrStatus: boolean;
  persistsWithoutLocalitySensitive: boolean;
  persistsWithoutTransverseResidual: boolean;
  dominantCauseFamily: PSimplexT28DCauseFamily;
}

export interface PSimplexT28DKArtifactAblationRow {
  axisPairId: PSimplexT28DAxisPairId;
  originalKTransverseDifferentiatedCount: number;
  artifactOnlyDifferentiationCount: number;
  nonArtifactDifferentiatedCount: number;
  kSignalAfterArtifactAblation: 'persists' | 'collapses' | 'weakens' | 'inconclusive';
}

export interface PSimplexT28DKPairStabilityRow {
  axisPairId: PSimplexT28DAxisPairId;
  kAxisLegibleRate: number;
  kTransverseDifferentiationRate: number;
  dominantCauseClassification: string;
  dominantCauseFamily: string;
  kernelArtifactCaveatCount: number;
  artifactOnlyDifferentiationCount: number;
  nonArtifactDifferentiatedCount: number;
  pairPattern: 'same-as-all-pairs' | 'pair-specific-variation' | 'outlier' | 'inconclusive';
}

export interface PSimplexT28DVBlindnessRow {
  axisPairId: PSimplexT28DAxisPairId;
  vAxisLegibleRate: number;
  vTransverseDifferentiationRate: number;
  vScore: 0 | 1 | 2;
  vAxisVisible: boolean;
  vTransverseVisible: boolean;
  vBlindnessClassification:
    | 'axis-visible-transverse-blind'
    | 'axis-and-transverse-visible'
    | 'axis-not-visible'
    | 'v-data-missing';
  vBlindnessReason:
    | 'sibling-contamination-rows-axis-preserving'
    | 'sibling-contamination-rows-neutral'
    | 'transverse-readout-not-same-object-as-k3-t'
    | 'v-parent-row-insufficient-detail'
    | 'unknown';
  vAxisRowIds: string[];
  vTransverseRowIds: string[];
  notes: string[];
}

export interface PSimplexT28DVKObjectMismatchRow {
  axisPairId: PSimplexT28DAxisPairId;
  kObject: 'sample-position-and-kernel-locality-object';
  vObject: 'accumulated-source-vector-order-object';
  kEvidenceBasis: string[];
  vEvidenceBasis: string[];
  sameObjectStatus: 'same-object-not-established' | 'different-readout-objects' | 'possibly-same-object-needs-new-v-readout';
  objectMismatchStatus:
    | 'v-k-object-mismatch-likely'
    | 'v-k-object-mismatch-possible'
    | 'v-k-object-mismatch-not-supported';
  notes: string[];
}

export interface PSimplexT28DClassificationRow {
  classificationId: PSimplexT28DClassificationId;
  applies: boolean;
  confidence: 'high' | 'medium' | 'low' | 'not-applicable';
  evidence: string[];
  blockedBy: string[];
}

export interface PSimplexT28DGlobalSummary {
  t28c1ParentVerdict: string | null;
  kSignalPairCount: number;
  kArtifactAblationPersistCount: number;
  kArtifactAblationCollapseCount: number;
  kUniformity: string;
  totalK3TRows: number;
  totalDifferentiatedK3TRows: number;
  totalArtifactOnlyRows: number;
  totalNonArtifactDifferentiatedRows: number;
  dominantGlobalCauseFamily: string;
  vAxisVisiblePairCount: number;
  vTransverseVisiblePairCount: number;
  vBlindPairCount: number;
  objectMismatchLikelyPairCount: number;
  primaryClassification: string;
  secondaryClassifications: string[];
  interpretation:
    | 'k-local-signal-persists-v-readout-mismatch'
    | 'k-sampling-family-asymmetry'
    | 'k-locality-sensitive-only'
    | 'k-artifact-risk'
    | 'insufficient-to-classify'
    | 'boundary-failed';
}

export interface PSimplexT28DBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT28DFalsifierRow {
  falsifierId: string;
  description: string;
  triggered: boolean;
  evidence: string;
  status: 'clear' | 'triggered';
}

export interface PSimplexT28DReport {
  method: 'p-simplex-k3-local-atd-decomposition-v-blindness-audit-t28d';
  diagnosticScope: 'k3-local-atd-decomposition-and-v-blindness-audit-only';
  branchRef: 'wgate/arf-w1-root-frame-v0';
  parentEvidenceRows: PSimplexT28DParentEvidenceRow[];
  kSignalDecompositionRows: PSimplexT28DKSignalDecompositionRow[];
  kTransverseCauseRows: PSimplexT28DKTransverseCauseRow[];
  kCauseAblationRows: PSimplexT28DKCauseAblationRow[];
  kArtifactAblationRows: PSimplexT28DKArtifactAblationRow[];
  kPairStabilityRows: PSimplexT28DKPairStabilityRow[];
  vBlindnessRows: PSimplexT28DVBlindnessRow[];
  vKObjectMismatchRows: PSimplexT28DVKObjectMismatchRow[];
  classificationRows: PSimplexT28DClassificationRow[];
  primaryClassification: PSimplexT28DClassificationId;
  secondaryClassifications: string[];
  globalSummary: PSimplexT28DGlobalSummary;
  boundaryRows: PSimplexT28DBoundaryRow[];
  falsifierRows: PSimplexT28DFalsifierRow[];
  summaryVerdict: PSimplexT28DSummaryVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

type JsonRecord = Record<string, unknown>;

const BRANCH_REF = 'wgate/arf-w1-root-frame-v0' as const;
const EPSILON = 1e-9;
const REQUIRED_T28C1_VERDICT = 'ATD-H0-fails-preload-or-single-channel-only';
const AXIS_PAIRS: ReadonlyArray<{
  axisPairId: PSimplexT28DAxisPairId;
  leftChild: PSimplexT28DChildId;
  rightChild: PSimplexT28DChildId;
}> = [
  { axisPairId: 'AB-CD', leftChild: 'M_AB', rightChild: 'M_CD' },
  { axisPairId: 'AC-BD', leftChild: 'M_AC', rightChild: 'M_BD' },
  { axisPairId: 'AD-BC', leftChild: 'M_AD', rightChild: 'M_BC' },
];
const CLASSIFICATION_IDS: readonly PSimplexT28DClassificationId[] = [
  'K-local-invariant',
  'K-local-artifact-risk',
  'K-locality-sensitive-only',
  'K-sampling-family-asymmetry',
  'V-readout-mismatch',
  'insufficient-to-classify',
];

export function buildPSimplexK3LocalAtdDecompositionVBlindnessAuditT28DReportFromInputs(
  inputs: PSimplexT28DInputs,
): PSimplexT28DReport {
  const parentEvidenceRows = buildParentEvidenceRows(inputs);
  const t28c1ParentVerdict = stringField(inputs.t28c1Report, 'summaryVerdict') ?? null;
  const t28c1ParentInvariantSatisfied = t28c1ParentVerdict === REQUIRED_T28C1_VERDICT;
  const t28c1NoInputPlaceholderDetected = detectT28C1PlaceholderReport(inputs.t28c1Report);
  const kSignalDecompositionRows = buildKSignalDecompositionRows(inputs.t28c1Report, inputs.k3Report);
  const kTransverseCauseRows = buildKTransverseCauseRows(kSignalDecompositionRows, inputs.k3Report);
  const kCauseAblationRows = buildKCauseAblationRows(kSignalDecompositionRows, kTransverseCauseRows);
  const kArtifactAblationRows = buildKArtifactAblationRows(kSignalDecompositionRows, kCauseAblationRows);
  const kPatternUniformity = classifyKPatternUniformity(kSignalDecompositionRows, kCauseAblationRows);
  const kPairStabilityRows = buildKPairStabilityRows(kSignalDecompositionRows, kTransverseCauseRows, kCauseAblationRows);
  const vBlindnessRows = buildVBlindnessRows(inputs.t28c1Report, inputs.vReport);
  const vKObjectMismatchRows = buildVKObjectMismatchRows(kArtifactAblationRows, kTransverseCauseRows, vBlindnessRows);
  const insufficient = insufficientToClassify({
    parentEvidenceRows,
    t28c1ParentInvariantSatisfied,
    t28c1NoInputPlaceholderDetected,
    kSignalDecompositionRows,
    kTransverseCauseRows,
    kArtifactAblationRows,
    vBlindnessRows,
  });
  const classificationRows = buildClassificationRows({
    insufficient,
    kSignalDecompositionRows,
    kTransverseCauseRows,
    kCauseAblationRows,
    kArtifactAblationRows,
    kPatternUniformity,
    vBlindnessRows,
    vKObjectMismatchRows,
  });
  const primaryClassification = choosePrimaryClassification(classificationRows);
  const secondaryClassifications = classificationRows
    .filter((row) => row.applies && row.classificationId !== primaryClassification)
    .map((row) => row.classificationId);
  const boundaryRows = buildBoundaryRows();
  const globalSummary = buildGlobalSummary({
    t28c1ParentVerdict,
    primaryClassification,
    secondaryClassifications,
    kSignalDecompositionRows,
    kTransverseCauseRows,
    kCauseAblationRows,
    kArtifactAblationRows,
    kPatternUniformity,
    vBlindnessRows,
    vKObjectMismatchRows,
  });
  const summaryVerdict = classifySummaryVerdict({
    primaryClassification,
    classificationRows,
    globalSummary,
  });
  const falsifierRows = buildFalsifierRows({
    t28c1ParentInvariantSatisfied,
    t28c1NoInputPlaceholderDetected,
    kSignalDecompositionRows,
    kTransverseCauseRows,
    kArtifactAblationRows,
    kPatternUniformity,
    vBlindnessRows,
    primaryClassification,
    summaryVerdict,
  });
  const integrityIssues = buildIntegrityIssues({
    parentEvidenceRows,
    kSignalDecompositionRows,
    kTransverseCauseRows,
    kCauseAblationRows,
    kArtifactAblationRows,
    kPairStabilityRows,
    vBlindnessRows,
    vKObjectMismatchRows,
    classificationRows,
    primaryClassification,
    summaryVerdict,
    globalSummary,
    t28c1NoInputPlaceholderDetected,
    t28c1ExpectedK3TSampleIds: expectedK3TSampleIds(inputs.t28c1Report),
  });

  return {
    method: 'p-simplex-k3-local-atd-decomposition-v-blindness-audit-t28d',
    diagnosticScope: 'k3-local-atd-decomposition-and-v-blindness-audit-only',
    branchRef: BRANCH_REF,
    parentEvidenceRows,
    kSignalDecompositionRows,
    kTransverseCauseRows,
    kCauseAblationRows,
    kArtifactAblationRows,
    kPairStabilityRows,
    vBlindnessRows,
    vKObjectMismatchRows,
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

function buildParentEvidenceRows(inputs: PSimplexT28DInputs): PSimplexT28DParentEvidenceRow[] {
  const t28c1Verdict = stringField(inputs.t28c1Report, 'summaryVerdict');

  return [
    parentEvidenceRow(
      'T28-C0',
      'buildPSimplexCrossProjectionProvenanceEligibilityPreflightT28C0Report',
      inputs.t28c0Report,
      'parent-gate',
      [t28c0GatePasses(inputs.t28c0Report) ? 'T28-C0 gate permits T28-D decomposition.' : 'T28-C0 gate is unavailable or ineligible.'],
    ),
    parentEvidenceRow(
      'T28-C1',
      'buildPSimplexAxisTransverseDiscriminationSurvivalMetricT28C1ReportFromInputs',
      inputs.t28c1Report,
      'parent-gate',
      [
        `Required parent verdict ${REQUIRED_T28C1_VERDICT}; observed ${t28c1Verdict ?? 'missing'}.`,
        'T28-C1 supplies the accepted K/V split; T28-D does not retest it.',
      ],
    ),
    parentEvidenceRow(
      'K3',
      'buildPSimplexGeometryGraphSamplingGateK3V0Report',
      inputs.k3Report,
      'k-decomposition',
      ['K3 sample/vector/locality rows provide cause decomposition only.'],
    ),
    parentEvidenceRow(
      'V',
      'buildPSimplexVectorOrderParameterDiagnosticV0Report',
      inputs.vReport,
      'v-blindness',
      ['V accumulated-source rows provide readout-split context only.'],
    ),
    parentEvidenceRow(
      'V-locality-optional',
      'buildPSimplexVectorOrderParameterLocalityDiagnosticV0Report',
      inputs.vLocalityReport,
      'optional-v-context',
      ['Optional V-locality parent is context only; no parent provides field-world maturity.'],
      { optional: true },
    ),
  ];
}

function parentEvidenceRow(
  parentId: PSimplexT28DParentEvidenceRow['parentId'],
  builderName: string,
  report: unknown,
  usedFor: PSimplexT28DParentEvidenceRow['usedFor'],
  notes: string[],
  options: { optional?: boolean } = {},
): PSimplexT28DParentEvidenceRow {
  const importStatus = isRecord(report) ? 'imported' : options.optional ? 'optional-not-imported' : 'failed';

  return {
    parentId,
    builderName,
    importStatus,
    ok: parentOk(parentId, report, options.optional === true),
    summaryVerdict: stringField(report, 'summaryVerdict') ?? stringField(report, 'verdict'),
    diagnosticScope: stringField(report, 'diagnosticScope'),
    usedFor,
    notes,
  };
}

function parentOk(parentId: PSimplexT28DParentEvidenceRow['parentId'], report: unknown, optional: boolean): boolean {
  if (!isRecord(report)) {
    return optional;
  }

  if (parentId === 'T28-C0') {
    return t28c0GatePasses(report);
  }

  if (parentId === 'T28-C1') {
    return (
      booleanField(report, 'ok') === true &&
      numericIssueCount(report) === 0 &&
      stringField(report, 'summaryVerdict') === REQUIRED_T28C1_VERDICT &&
      !detectT28C1PlaceholderReport(report)
    );
  }

  return booleanField(report, 'ok') === true && numericIssueCount(report) === 0;
}

function t28c0GatePasses(report: unknown): boolean {
  const verdict = stringField(report, 'summaryVerdict');

  return booleanField(report, 'ok') === true && numericIssueCount(report) === 0 && verdict !== undefined && !verdict.startsWith('ineligible-');
}

function buildKSignalDecompositionRows(
  t28c1Report: unknown,
  k3Report: unknown,
): PSimplexT28DKSignalDecompositionRow[] {
  const t28c1KRows = arrayField(t28c1Report, 'kMetricRows');
  const k3SampleIds = new Set(arrayField(k3Report, 'k3SampleRows').map((row) => stringField(row, 'sampleId')).filter(isString));
  const k3VectorIds = new Set(arrayField(k3Report, 'k3VectorResultRows').map((row) => stringField(row, 'sampleId')).filter(isString));
  const k3AuditIds = new Set(arrayField(k3Report, 'k3LocalityAuditRows').map((row) => stringField(row, 'sampleId')).filter(isString));

  return AXIS_PAIRS.map((pair) => {
    const row = t28c1KRows.find((entry) => stringField(entry, 'axisPairId') === pair.axisPairId);
    const kAxisSampleIds = stringArrayField(row, 'kAxisSampleIds');
    const kTransverseSampleIds = stringArrayField(row, 'kTransverseSampleIds');
    const kScoreFromT28C1 = scoreField(row, 'kScore');
    const requiredRowsExist =
      isRecord(row) &&
      kAxisSampleIds.length > 0 &&
      kTransverseSampleIds.length > 0 &&
      [...kAxisSampleIds, ...kTransverseSampleIds].every((sampleId) =>
        k3SampleIds.has(sampleId) && k3VectorIds.has(sampleId) && k3AuditIds.has(sampleId),
      );
    const kSignalStatus =
      !requiredRowsExist ? 'k-signal-incomplete' : kScoreFromT28C1 > 0 ? 'k-signal-present' : 'k-signal-absent';

    return {
      ...pair,
      kAxisLegibleRateFromT28C1: numberField(row, 'kAxisLegibleRate') ?? 0,
      kTransverseDifferentiationRateFromT28C1: numberField(row, 'kTransverseDifferentiationRate') ?? 0,
      kScoreFromT28C1,
      kAxisSampleIds,
      kTransverseSampleIds,
      kSignalPresent: kSignalStatus === 'k-signal-present',
      kSignalStatus,
    };
  });
}

function buildKTransverseCauseRows(
  kRows: readonly PSimplexT28DKSignalDecompositionRow[],
  k3Report: unknown,
): PSimplexT28DKTransverseCauseRow[] {
  const samples = arrayField(k3Report, 'k3SampleRows');
  const vectors = arrayField(k3Report, 'k3VectorResultRows');
  const audits = arrayField(k3Report, 'k3LocalityAuditRows');

  return kRows.flatMap((pair) =>
    pair.kTransverseSampleIds.map((sampleId) => {
      const sample = samples.find((row) => stringField(row, 'sampleId') === sampleId);
      const vector = vectors.find((row) => stringField(row, 'sampleId') === sampleId);
      const audit = audits.find((row) => stringField(row, 'sampleId') === sampleId);

      return buildKTransverseCauseRow(pair.axisPairId, sampleId, sample, vector, audit);
    }),
  );
}

function buildKTransverseCauseRow(
  axisPairId: PSimplexT28DAxisPairId,
  sampleId: string,
  sample: unknown,
  vector: unknown,
  audit: unknown,
): PSimplexT28DKTransverseCauseRow {
  if (!isRecord(sample) || !isRecord(vector) || !isRecord(audit)) {
    return {
      axisPairId,
      childId: childIdFromSampleId(sampleId),
      sampleId,
      cleanReadingAllowed: null,
      readabilityStatus: null,
      status: null,
      suppressionReason: null,
      localitySensitive: null,
      kernelArtifactRisk: null,
      transverseResidualMagnitude: null,
      differentiationCauses: [],
      nonArtifactCauses: [],
      artifactOnly: false,
      causeClassification: 'missing-row',
    };
  }

  const cleanReadingAllowed = booleanField(vector, 'cleanReadingAllowed') ?? null;
  const readabilityStatus = stringField(vector, 'readabilityStatus') ?? null;
  const status = stringField(vector, 'status') ?? null;
  const suppressionReason = nullableStringField(vector, 'suppressionReason') ?? nullableStringField(audit, 'suppressionReason') ?? null;
  const localitySensitive = booleanField(audit, 'localitySensitive') ?? null;
  const kernelArtifactRisk = booleanField(audit, 'kernelArtifactRisk') ?? null;
  const transverseResidualMagnitude =
    numberField(vector, 'transverseResidualMagnitude') ?? numberField(audit, 'transverseResidualMagnitude') ?? null;
  const cleanReadingBlocked = cleanReadingAllowed === false;
  const hasSuppressionReason = typeof suppressionReason === 'string' && suppressionReason.length > 0;
  const unreadableUnderAxisPolicy = readabilityStatus === 'unreadable-under-axis-policy' || status === 'unreadable-under-axis-policy';
  const axisBentOrMixed = status === 'axis-bent' || status === 'mixed-axis' || readabilityStatus === 'axis-bent' || readabilityStatus === 'mixed-axis';
  const statusLocalitySensitive = status === 'locality-sensitive' || readabilityStatus === 'locality-sensitive';
  const hasResidual = (transverseResidualMagnitude ?? 0) > EPSILON;
  const explicitNonArtifactCauses = unique([
    hasSuppressionReason ? 'suppression-reason-present' : null,
    unreadableUnderAxisPolicy ? 'unreadable-under-axis-policy' : null,
    axisBentOrMixed ? 'axis-bent-or-mixed' : null,
    localitySensitive === true || statusLocalitySensitive ? 'locality-sensitive' : null,
    hasResidual ? 'transverse-residual' : null,
  ].filter(isNonArtifactCause));
  const cleanReadingBlockedCounts = cleanReadingBlocked && (kernelArtifactRisk !== true || explicitNonArtifactCauses.length > 0);
  const nonArtifactCauses = unique([
    cleanReadingBlockedCounts ? 'clean-reading-blocked' : null,
    ...explicitNonArtifactCauses,
  ].filter(isNonArtifactCause));
  const differentiationCauses = unique([
    cleanReadingBlocked ? 'clean-reading-blocked' : null,
    ...explicitNonArtifactCauses,
    kernelArtifactRisk === true ? 'kernel-artifact-risk' : null,
  ].filter(isDifferentiationCause));
  const artifactOnly =
    cleanReadingBlocked &&
    kernelArtifactRisk === true &&
    explicitNonArtifactCauses.length === 0;

  return {
    axisPairId,
    childId: childIdFromSampleId(sampleId),
    sampleId,
    cleanReadingAllowed,
    readabilityStatus,
    status,
    suppressionReason,
    localitySensitive,
    kernelArtifactRisk,
    transverseResidualMagnitude,
    differentiationCauses,
    nonArtifactCauses,
    artifactOnly,
    causeClassification: classifyCause(nonArtifactCauses, artifactOnly, kernelArtifactRisk === true),
  };
}

function classifyCause(
  nonArtifactCauses: readonly PSimplexT28DNonArtifactCause[],
  artifactOnly: boolean,
  kernelArtifactRisk: boolean,
): PSimplexT28DKTransverseCauseRow['causeClassification'] {
  if (artifactOnly) {
    return 'artifact-only-differentiation';
  }

  if (nonArtifactCauses.length === 0) {
    return 'undifferentiated';
  }

  if (nonArtifactCauses.length > 1) {
    return 'multi-cause-non-artifact-differentiation';
  }

  const onlyCause = nonArtifactCauses[0];

  if (onlyCause === 'locality-sensitive' || onlyCause === 'suppression-reason-present') {
    return kernelArtifactRisk ? 'mixed-artifact-and-locality' : 'non-artifact-locality-differentiation';
  }

  if (onlyCause === 'unreadable-under-axis-policy' || onlyCause === 'axis-bent-or-mixed') {
    return 'status-only-differentiation';
  }

  if (onlyCause === 'transverse-residual') {
    return 'residual-only-differentiation';
  }

  return 'clean-reading-only-differentiation';
}

function buildKCauseAblationRows(
  kRows: readonly PSimplexT28DKSignalDecompositionRow[],
  causeRows: readonly PSimplexT28DKTransverseCauseRow[],
): PSimplexT28DKCauseAblationRow[] {
  return kRows.map((pair) => {
    const rows = causeRows.filter((row) => row.axisPairId === pair.axisPairId);
    const originalKTransverseDifferentiatedCount = rows.filter((row) => row.differentiationCauses.length > 0).length;
    const artifactOnlyDifferentiationCount = rows.filter((row) => row.artifactOnly).length;
    const nonArtifactDifferentiatedCount = rows.filter((row) => row.nonArtifactCauses.length > 0).length;
    const withoutKernelArtifactOnlyCount = nonArtifactDifferentiatedCount;
    const withoutCleanReadingBlockedCount = countRowsAfterCauseAblation(rows, 'clean-reading-blocked');
    const withoutSuppressionReasonCount = countRowsAfterCauseAblation(rows, 'suppression-reason-present');
    const withoutUnreadableOrStatusCount = countRowsAfterCauseAblation(rows, 'unreadable-or-status');
    const withoutLocalitySensitiveCount = countRowsAfterCauseAblation(rows, 'locality-sensitive');
    const withoutTransverseResidualCount = countRowsAfterCauseAblation(rows, 'transverse-residual');

    return {
      axisPairId: pair.axisPairId,
      originalKTransverseRowCount: rows.length,
      originalKTransverseDifferentiatedCount,
      artifactOnlyDifferentiationCount,
      nonArtifactDifferentiatedCount,
      withoutKernelArtifactOnlyCount,
      withoutCleanReadingBlockedCount,
      withoutSuppressionReasonCount,
      withoutUnreadableOrStatusCount,
      withoutLocalitySensitiveCount,
      withoutTransverseResidualCount,
      persistsWithoutKernelArtifactOnly: withoutKernelArtifactOnlyCount > 0,
      persistsWithoutCleanReadingBlocked: withoutCleanReadingBlockedCount > 0,
      persistsWithoutSuppressionReason: withoutSuppressionReasonCount > 0,
      persistsWithoutUnreadableOrStatus: withoutUnreadableOrStatusCount > 0,
      persistsWithoutLocalitySensitive: withoutLocalitySensitiveCount > 0,
      persistsWithoutTransverseResidual: withoutTransverseResidualCount > 0,
      dominantCauseFamily: dominantCauseFamily(rows),
    };
  });
}

function buildKArtifactAblationRows(
  kRows: readonly PSimplexT28DKSignalDecompositionRow[],
  ablationRows: readonly PSimplexT28DKCauseAblationRow[],
): PSimplexT28DKArtifactAblationRow[] {
  return kRows.map((pair) => {
    const ablation = ablationRows.find((row) => row.axisPairId === pair.axisPairId);
    const original = ablation?.originalKTransverseDifferentiatedCount ?? 0;
    const nonArtifact = ablation?.nonArtifactDifferentiatedCount ?? 0;
    const artifactOnly = ablation?.artifactOnlyDifferentiationCount ?? 0;
    const missing = pair.kSignalStatus === 'k-signal-incomplete' || !ablation || ablation.originalKTransverseRowCount !== pair.kTransverseSampleIds.length;

    return {
      axisPairId: pair.axisPairId,
      originalKTransverseDifferentiatedCount: original,
      artifactOnlyDifferentiationCount: artifactOnly,
      nonArtifactDifferentiatedCount: nonArtifact,
      kSignalAfterArtifactAblation: missing
        ? 'inconclusive'
        : nonArtifact === original && original > 0
          ? 'persists'
          : nonArtifact > 0 && nonArtifact < original
            ? 'weakens'
            : original > 0 && nonArtifact === 0
              ? 'collapses'
              : 'inconclusive',
    };
  });
}

function buildKPairStabilityRows(
  kRows: readonly PSimplexT28DKSignalDecompositionRow[],
  causeRows: readonly PSimplexT28DKTransverseCauseRow[],
  ablationRows: readonly PSimplexT28DKCauseAblationRow[],
): PSimplexT28DKPairStabilityRow[] {
  const baseRows = kRows.map((pair) => {
    const pairCauseRows = causeRows.filter((row) => row.axisPairId === pair.axisPairId);
    const ablation = requireAblationRow(ablationRows, pair.axisPairId);

    return {
      axisPairId: pair.axisPairId,
      kAxisLegibleRate: pair.kAxisLegibleRateFromT28C1,
      kTransverseDifferentiationRate: pair.kTransverseDifferentiationRateFromT28C1,
      dominantCauseClassification: dominantString(pairCauseRows.map((row) => row.causeClassification)),
      dominantCauseFamily: ablation.dominantCauseFamily,
      kernelArtifactCaveatCount: pairCauseRows.filter((row) => row.kernelArtifactRisk === true).length,
      artifactOnlyDifferentiationCount: ablation.artifactOnlyDifferentiationCount,
      nonArtifactDifferentiatedCount: ablation.nonArtifactDifferentiatedCount,
      pairPattern: 'inconclusive' as PSimplexT28DKPairStabilityRow['pairPattern'],
    };
  });
  const signatures = baseRows.map((row) =>
    [row.kAxisLegibleRate, row.kTransverseDifferentiationRate, row.dominantCauseFamily].join('|'),
  );
  const signatureCounts = countValues(signatures);
  const allSame = new Set(signatures).size === 1;

  return baseRows.map((row, index) => {
    const signature = signatures[index];
    const count = signatureCounts.get(signature) ?? 0;
    const missing = kRows.find((entry) => entry.axisPairId === row.axisPairId)?.kSignalStatus === 'k-signal-incomplete';

    return {
      ...row,
      pairPattern: missing
        ? 'inconclusive'
        : allSame
          ? 'same-as-all-pairs'
          : count === 1
            ? 'outlier'
            : 'pair-specific-variation',
    };
  });
}

function buildVBlindnessRows(t28c1Report: unknown, vReport: unknown): PSimplexT28DVBlindnessRow[] {
  const vMetricRows = arrayField(t28c1Report, 'vMetricRows');
  const siblingRows = arrayField(vReport, 'siblingContaminationRows');

  return AXIS_PAIRS.map((pair) => {
    const row = vMetricRows.find((entry) => stringField(entry, 'axisPairId') === pair.axisPairId);
    const vAxisRowIds = stringArrayField(row, 'vAxisRowIds');
    const vTransverseRowIds = stringArrayField(row, 'vTransverseRowIds');
    const vAxisLegibleRate = numberField(row, 'vAxisLegibleRate') ?? 0;
    const vTransverseDifferentiationRate = numberField(row, 'vTransverseDifferentiationRate') ?? 0;
    const vScore = scoreField(row, 'vScore');
    const rowsExist = isRecord(row) && vAxisRowIds.length > 0 && vTransverseRowIds.length > 0;
    const vAxisVisible = rowsExist && vAxisLegibleRate >= 0.75;
    const vTransverseVisible = rowsExist && vTransverseDifferentiationRate > 0;
    const pairChildren = [pair.leftChild, pair.rightChild];
    const siblingAxisResults = siblingRows
      .filter((entry) => pairChildren.includes(stringField(entry, 'childSite') as PSimplexT28DChildId))
      .map((entry) => stringField(entry, 'axisResult'))
      .filter(isString);

    return {
      axisPairId: pair.axisPairId,
      vAxisLegibleRate,
      vTransverseDifferentiationRate,
      vScore,
      vAxisVisible,
      vTransverseVisible,
      vBlindnessClassification: !rowsExist
        ? 'v-data-missing'
        : vAxisVisible && !vTransverseVisible
          ? 'axis-visible-transverse-blind'
          : vAxisVisible && vTransverseVisible
            ? 'axis-and-transverse-visible'
            : 'axis-not-visible',
      vBlindnessReason: classifyVBlindnessReason(rowsExist, siblingAxisResults),
      vAxisRowIds,
      vTransverseRowIds,
      notes: [
        'V readout does not express transverse differentiation under this metric.',
        'This is treated as a readout split, not a V failure.',
      ],
    };
  });
}

function buildVKObjectMismatchRows(
  artifactRows: readonly PSimplexT28DKArtifactAblationRow[],
  causeRows: readonly PSimplexT28DKTransverseCauseRow[],
  vRows: readonly PSimplexT28DVBlindnessRow[],
): PSimplexT28DVKObjectMismatchRow[] {
  return AXIS_PAIRS.map((pair) => {
    const artifact = requireArtifactRow(artifactRows, pair.axisPairId);
    const pairCauseRows = causeRows.filter((row) => row.axisPairId === pair.axisPairId);
    const vRow = requireVBlindnessRow(vRows, pair.axisPairId);
    const kPersists = artifact.kSignalAfterArtifactAblation === 'persists';
    const hasNonArtifact = pairCauseRows.some((row) => row.nonArtifactCauses.length > 0);
    const vBlind = vRow.vBlindnessClassification === 'axis-visible-transverse-blind';
    const mismatchLikely = kPersists && hasNonArtifact && vBlind;
    const mismatchPossible = !mismatchLikely && artifact.kSignalAfterArtifactAblation !== 'collapses' && vRow.vBlindnessClassification !== 'axis-and-transverse-visible';

    return {
      axisPairId: pair.axisPairId,
      kObject: 'sample-position-and-kernel-locality-object',
      vObject: 'accumulated-source-vector-order-object',
      kEvidenceBasis: [
        `artifactAblation=${artifact.kSignalAfterArtifactAblation}`,
        `nonArtifactDifferentiatedCount=${artifact.nonArtifactDifferentiatedCount}`,
      ],
      vEvidenceBasis: [
        `vBlindnessClassification=${vRow.vBlindnessClassification}`,
        `vAxisLegibleRate=${vRow.vAxisLegibleRate}`,
        `vTransverseDifferentiationRate=${vRow.vTransverseDifferentiationRate}`,
      ],
      sameObjectStatus: mismatchLikely
        ? 'different-readout-objects'
        : mismatchPossible
          ? 'possibly-same-object-needs-new-v-readout'
          : 'same-object-not-established',
      objectMismatchStatus: mismatchLikely
        ? 'v-k-object-mismatch-likely'
        : mismatchPossible
          ? 'v-k-object-mismatch-possible'
          : 'v-k-object-mismatch-not-supported',
      notes: ['T28-D compares readout objects only; it does not promote a mature field-world feature.'],
    };
  });
}

function buildClassificationRows(args: {
  insufficient: boolean;
  kSignalDecompositionRows: readonly PSimplexT28DKSignalDecompositionRow[];
  kTransverseCauseRows: readonly PSimplexT28DKTransverseCauseRow[];
  kCauseAblationRows: readonly PSimplexT28DKCauseAblationRow[];
  kArtifactAblationRows: readonly PSimplexT28DKArtifactAblationRow[];
  kPatternUniformity: string;
  vBlindnessRows: readonly PSimplexT28DVBlindnessRow[];
  vKObjectMismatchRows: readonly PSimplexT28DVKObjectMismatchRow[];
}): PSimplexT28DClassificationRow[] {
  const allArtifactPersist = args.kArtifactAblationRows.every((row) => row.kSignalAfterArtifactAblation === 'persists');
  const anyArtifactCollapse = args.kArtifactAblationRows.some((row) => row.kSignalAfterArtifactAblation === 'collapses');
  const allKSignal = args.kSignalDecompositionRows.every((row) => row.kSignalPresent);
  const allVBlind = args.vBlindnessRows.every((row) => row.vBlindnessClassification === 'axis-visible-transverse-blind');
  const allMismatchLikely = args.vKObjectMismatchRows.every((row) => row.objectMismatchStatus === 'v-k-object-mismatch-likely');
  const families = unique(args.kTransverseCauseRows.flatMap((row) => row.nonArtifactCauses.map(causeFamilyForNonArtifactCause)));
  const localityOnlyFamilies = families.length > 0 && families.every((family) => family === 'locality-sensitive' || family === 'suppression-reason');
  const samplingFamilyApplies =
    allKSignal &&
    args.kPatternUniformity === 'uniform-across-three-pairs' &&
    args.kSignalDecompositionRows.every((row) => row.kAxisLegibleRateFromT28C1 >= 0.75 && row.kTransverseDifferentiationRateFromT28C1 > 0);
  const invariantApplies =
    allArtifactPersist &&
    args.kTransverseCauseRows.length > 0 &&
    args.kTransverseCauseRows.filter((row) => row.nonArtifactCauses.length > 0).length >= 4;
  const mismatchApplies = allArtifactPersist && allVBlind && allMismatchLikely;

  return [
    classificationRow('K-local-invariant', invariantApplies, invariantApplies ? 'medium' : 'not-applicable', [
      `artifactPersistPairs=${args.kArtifactAblationRows.filter((row) => row.kSignalAfterArtifactAblation === 'persists').length}`,
      `nonArtifactRows=${args.kTransverseCauseRows.filter((row) => row.nonArtifactCauses.length > 0).length}`,
    ], samplingFamilyApplies ? ['better-described-as-uniform-K3-sampling-family-asymmetry-in-this-audit'] : []),
    classificationRow('K-local-artifact-risk', anyArtifactCollapse, anyArtifactCollapse ? 'high' : 'not-applicable', [
      `artifactCollapsePairs=${args.kArtifactAblationRows.filter((row) => row.kSignalAfterArtifactAblation === 'collapses').length}`,
    ], allArtifactPersist ? ['artifact-ablation-persists-for-all-pairs'] : []),
    classificationRow('K-locality-sensitive-only', localityOnlyFamilies && allArtifactPersist, localityOnlyFamilies ? 'medium' : 'not-applicable', [
      `nonArtifactCauseFamilies=${families.join(',') || 'none'}`,
    ], localityOnlyFamilies ? [] : ['status-or-residual-or-clean-reading-cause-also-present']),
    classificationRow('K-sampling-family-asymmetry', samplingFamilyApplies, samplingFamilyApplies ? 'high' : 'not-applicable', [
      `kPatternUniformity=${args.kPatternUniformity}`,
      `kSignalPairCount=${args.kSignalDecompositionRows.filter((row) => row.kSignalPresent).length}`,
    ], []),
    classificationRow('V-readout-mismatch', mismatchApplies, mismatchApplies ? 'high' : 'not-applicable', [
      `vBlindPairCount=${args.vBlindnessRows.filter((row) => row.vBlindnessClassification === 'axis-visible-transverse-blind').length}`,
      `objectMismatchLikelyPairCount=${args.vKObjectMismatchRows.filter((row) => row.objectMismatchStatus === 'v-k-object-mismatch-likely').length}`,
    ], []),
    classificationRow('insufficient-to-classify', args.insufficient, args.insufficient ? 'high' : 'not-applicable', [
      `missingKRows=${args.kSignalDecompositionRows.filter((row) => row.kSignalStatus === 'k-signal-incomplete').length}`,
      `missingVRows=${args.vBlindnessRows.filter((row) => row.vBlindnessClassification === 'v-data-missing').length}`,
    ], args.insufficient ? [] : ['required-parent-and-row-invariants-satisfied']),
  ];
}

function choosePrimaryClassification(rows: readonly PSimplexT28DClassificationRow[]): PSimplexT28DClassificationId {
  const precedence: readonly PSimplexT28DClassificationId[] = [
    'insufficient-to-classify',
    'K-local-artifact-risk',
    'K-locality-sensitive-only',
    'K-sampling-family-asymmetry',
    'V-readout-mismatch',
    'K-local-invariant',
  ];

  return precedence.find((classificationId) => rows.some((row) => row.classificationId === classificationId && row.applies)) ?? 'insufficient-to-classify';
}

function buildGlobalSummary(args: {
  t28c1ParentVerdict: string | null;
  primaryClassification: PSimplexT28DClassificationId;
  secondaryClassifications: string[];
  kSignalDecompositionRows: readonly PSimplexT28DKSignalDecompositionRow[];
  kTransverseCauseRows: readonly PSimplexT28DKTransverseCauseRow[];
  kCauseAblationRows: readonly PSimplexT28DKCauseAblationRow[];
  kArtifactAblationRows: readonly PSimplexT28DKArtifactAblationRow[];
  kPatternUniformity: string;
  vBlindnessRows: readonly PSimplexT28DVBlindnessRow[];
  vKObjectMismatchRows: readonly PSimplexT28DVKObjectMismatchRow[];
}): PSimplexT28DGlobalSummary {
  const dominantGlobalCauseFamily = dominantGlobalFamily(args.kCauseAblationRows);

  return {
    t28c1ParentVerdict: args.t28c1ParentVerdict,
    kSignalPairCount: args.kSignalDecompositionRows.filter((row) => row.kSignalPresent).length,
    kArtifactAblationPersistCount: args.kArtifactAblationRows.filter((row) => row.kSignalAfterArtifactAblation === 'persists').length,
    kArtifactAblationCollapseCount: args.kArtifactAblationRows.filter((row) => row.kSignalAfterArtifactAblation === 'collapses').length,
    kUniformity: args.kPatternUniformity,
    totalK3TRows: args.kTransverseCauseRows.length,
    totalDifferentiatedK3TRows: args.kCauseAblationRows.reduce((sum, row) => sum + row.originalKTransverseDifferentiatedCount, 0),
    totalArtifactOnlyRows: args.kCauseAblationRows.reduce((sum, row) => sum + row.artifactOnlyDifferentiationCount, 0),
    totalNonArtifactDifferentiatedRows: args.kCauseAblationRows.reduce((sum, row) => sum + row.nonArtifactDifferentiatedCount, 0),
    dominantGlobalCauseFamily,
    vAxisVisiblePairCount: args.vBlindnessRows.filter((row) => row.vAxisVisible).length,
    vTransverseVisiblePairCount: args.vBlindnessRows.filter((row) => row.vTransverseVisible).length,
    vBlindPairCount: args.vBlindnessRows.filter((row) => row.vBlindnessClassification === 'axis-visible-transverse-blind').length,
    objectMismatchLikelyPairCount: args.vKObjectMismatchRows.filter((row) => row.objectMismatchStatus === 'v-k-object-mismatch-likely').length,
    primaryClassification: args.primaryClassification,
    secondaryClassifications: args.secondaryClassifications,
    interpretation: interpretationFor(args.primaryClassification, dominantGlobalCauseFamily),
  };
}

function classifySummaryVerdict(args: {
  primaryClassification: PSimplexT28DClassificationId;
  classificationRows: readonly PSimplexT28DClassificationRow[];
  globalSummary: PSimplexT28DGlobalSummary;
}): PSimplexT28DSummaryVerdict {
  if (args.primaryClassification === 'insufficient-to-classify') {
    return 'T28-D-insufficient-to-classify';
  }

  if (args.primaryClassification === 'K-local-artifact-risk') {
    return 'T28-D-K-artifact-risk';
  }

  if (args.primaryClassification === 'K-locality-sensitive-only') {
    return 'T28-D-K-locality-sensitive-only';
  }

  if (
    args.primaryClassification === 'K-sampling-family-asymmetry' ||
    (classificationApplies(args.classificationRows, 'K-sampling-family-asymmetry') && args.globalSummary.vBlindPairCount === 3)
  ) {
    return 'T28-D-K-sampling-family-asymmetry-with-V-blindness';
  }

  if (
    args.globalSummary.kArtifactAblationPersistCount === 3 &&
    args.globalSummary.totalNonArtifactDifferentiatedRows > 0 &&
    classificationApplies(args.classificationRows, 'V-readout-mismatch')
  ) {
    return 'T28-D-K-local-invariant-with-V-readout-mismatch';
  }

  return 'T28-D-insufficient-to-classify';
}

function buildBoundaryRows(): PSimplexT28DBoundaryRow[] {
  return [
    boundaryRow('not-ATD-H0-survival', 'T28-D decomposes the accepted T28-C1 split and does not retest or rescue ATD-H0.'),
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
  t28c1ParentInvariantSatisfied: boolean;
  t28c1NoInputPlaceholderDetected: boolean;
  kSignalDecompositionRows: readonly PSimplexT28DKSignalDecompositionRow[];
  kTransverseCauseRows: readonly PSimplexT28DKTransverseCauseRow[];
  kArtifactAblationRows: readonly PSimplexT28DKArtifactAblationRow[];
  kPatternUniformity: string;
  vBlindnessRows: readonly PSimplexT28DVBlindnessRow[];
  primaryClassification: PSimplexT28DClassificationId;
  summaryVerdict: PSimplexT28DSummaryVerdict;
}): PSimplexT28DFalsifierRow[] {
  const kRowsMissing = args.kSignalDecompositionRows.some((row) => row.kSignalStatus === 'k-signal-incomplete');
  const vRowsMissing = args.vBlindnessRows.some((row) => row.vBlindnessClassification === 'v-data-missing');
  const uniformityFalse = args.kPatternUniformity === 'uniform-across-three-pairs' && !allPairKSignaturesSame(args.kSignalDecompositionRows, args.kArtifactAblationRows);

  return [
    falsifierRow('F1', 'T28-D retests or rescues ATD-H0 survival.', false, 'Report uses decomposition verdicts only.'),
    falsifierRow('F2', 'K-only signal is promoted to field-world feature.', false, 'K rows are classified only as local readout evidence.'),
    falsifierRow('F3', 'Corridor/route/gate/topology/FieldCue language is promoted.', false, 'Forbidden maturity terms appear only in negative boundary rows.'),
    falsifierRow(
      'F4',
      'KernelArtifactRisk alone is counted as non-artifact K differentiation.',
      args.kTransverseCauseRows.some((row) => row.artifactOnly && row.nonArtifactCauses.length > 0),
      `artifactOnlyRows=${args.kTransverseCauseRows.filter((row) => row.artifactOnly).length}.`,
    ),
    falsifierRow('F5', 'V-blindness is treated as V failure rather than readout split.', false, 'V rows are described as readout split context.'),
    falsifierRow('F6', 'S or G are used as positive support.', false, 'S and G are not T28-D positive support parents.'),
    falsifierRow('F7', 'P-channel is imported or used as support.', false, 'No P-channel parent is imported by T28-D.'),
    falsifierRow('F8', 'Pair-specific K result is falsely reported as uniform.', uniformityFalse, `kPatternUniformity=${args.kPatternUniformity}.`),
    falsifierRow('F9', 'Artifact ablation not performed.', args.kArtifactAblationRows.length !== 3, `${args.kArtifactAblationRows.length}/3 artifact rows present.`),
    falsifierRow(
      'F10',
      'Summary verdict claims survival instead of decomposition.',
      forbiddenSurvivalVerdict(args.summaryVerdict),
      `summaryVerdict=${args.summaryVerdict}.`,
    ),
    falsifierRow(
      'F11',
      'No T28-C1 parent invariant check is performed.',
      false,
      `T28-C1 invariant checked; satisfied=${args.t28c1ParentInvariantSatisfied}.`,
    ),
    falsifierRow(
      'F12',
      'T28-C1 no-input placeholder report is used as accepted parent evidence.',
      args.t28c1NoInputPlaceholderDetected,
      `placeholderDetected=${args.t28c1NoInputPlaceholderDetected}.`,
    ),
    falsifierRow(
      'F13',
      'K3-T rows cannot be mapped but classification is still positive.',
      kRowsMissing && args.primaryClassification !== 'insufficient-to-classify',
      `missingKRows=${kRowsMissing}.`,
    ),
    falsifierRow(
      'F14',
      'V rows cannot be mapped but V-blindness is still claimed.',
      vRowsMissing && args.vBlindnessRows.some((row) => row.vBlindnessClassification === 'axis-visible-transverse-blind'),
      `missingVRows=${vRowsMissing}.`,
    ),
    falsifierRow('F15', 'Primary classification is missing.', !CLASSIFICATION_IDS.includes(args.primaryClassification), `primary=${args.primaryClassification}.`),
  ];
}

function buildIntegrityIssues(args: {
  parentEvidenceRows: readonly PSimplexT28DParentEvidenceRow[];
  kSignalDecompositionRows: readonly PSimplexT28DKSignalDecompositionRow[];
  kTransverseCauseRows: readonly PSimplexT28DKTransverseCauseRow[];
  kCauseAblationRows: readonly PSimplexT28DKCauseAblationRow[];
  kArtifactAblationRows: readonly PSimplexT28DKArtifactAblationRow[];
  kPairStabilityRows: readonly PSimplexT28DKPairStabilityRow[];
  vBlindnessRows: readonly PSimplexT28DVBlindnessRow[];
  vKObjectMismatchRows: readonly PSimplexT28DVKObjectMismatchRow[];
  classificationRows: readonly PSimplexT28DClassificationRow[];
  primaryClassification: PSimplexT28DClassificationId;
  summaryVerdict: PSimplexT28DSummaryVerdict;
  globalSummary: PSimplexT28DGlobalSummary;
  t28c1NoInputPlaceholderDetected: boolean;
  t28c1ExpectedK3TSampleIds: readonly string[];
}): string[] {
  const issues: string[] = [];

  if (args.parentEvidenceRows.length !== 5) {
    issues.push(`Missing parent evidence rows: expected 5, got ${args.parentEvidenceRows.length}.`);
  }

  if (args.kSignalDecompositionRows.length !== 3) {
    issues.push(`Missing K signal decomposition rows: expected 3, got ${args.kSignalDecompositionRows.length}.`);
  }

  const causeSampleIds = new Set(args.kTransverseCauseRows.map((row) => row.sampleId));
  const missingCauseIds = args.t28c1ExpectedK3TSampleIds.filter((sampleId) => !causeSampleIds.has(sampleId));

  if (missingCauseIds.length > 0) {
    issues.push(`Missing K3-T cause rows for T28-C1 sample ids: ${missingCauseIds.join(', ')}.`);
  }

  if (args.kArtifactAblationRows.length !== 3) {
    issues.push(`Missing artifact ablation rows: expected 3, got ${args.kArtifactAblationRows.length}.`);
  }

  if (args.kCauseAblationRows.length !== 3) {
    issues.push(`Missing cause ablation rows: expected 3, got ${args.kCauseAblationRows.length}.`);
  }

  if (args.kPairStabilityRows.length !== 3) {
    issues.push(`Missing pair stability rows: expected 3, got ${args.kPairStabilityRows.length}.`);
  }

  if (args.vBlindnessRows.length !== 3) {
    issues.push(`Missing V blindness rows: expected 3, got ${args.vBlindnessRows.length}.`);
  }

  if (args.vKObjectMismatchRows.length !== 3) {
    issues.push(`Missing V/K object mismatch rows: expected 3, got ${args.vKObjectMismatchRows.length}.`);
  }

  if (args.classificationRows.length !== CLASSIFICATION_IDS.length) {
    issues.push(`Missing classification rows: expected ${CLASSIFICATION_IDS.length}, got ${args.classificationRows.length}.`);
  }

  if (!CLASSIFICATION_IDS.includes(args.primaryClassification)) {
    issues.push('Missing primary classification.');
  }

  if (forbiddenSurvivalVerdict(args.summaryVerdict)) {
    issues.push('Forbidden survival or mature verdict string used.');
  }

  if (summaryInconsistentWithPrimary(args.summaryVerdict, args.primaryClassification)) {
    issues.push('Summary verdict inconsistent with primary classification.');
  }

  if (args.kTransverseCauseRows.some((row) => row.artifactOnly && row.nonArtifactCauses.length > 0)) {
    issues.push('Artifact-only rows counted as non-artifact differentiated rows.');
  }

  if (args.globalSummary.kUniformity === 'uniform-across-three-pairs' && !allPairKSignaturesSame(args.kSignalDecompositionRows, args.kArtifactAblationRows)) {
    issues.push('Uniformity claimed despite pair variation.');
  }

  if (args.t28c1NoInputPlaceholderDetected) {
    issues.push('T28-C1 no-input placeholder report used as parent truth.');
  }

  return unique(issues);
}

function insufficientToClassify(args: {
  parentEvidenceRows: readonly PSimplexT28DParentEvidenceRow[];
  t28c1ParentInvariantSatisfied: boolean;
  t28c1NoInputPlaceholderDetected: boolean;
  kSignalDecompositionRows: readonly PSimplexT28DKSignalDecompositionRow[];
  kTransverseCauseRows: readonly PSimplexT28DKTransverseCauseRow[];
  kArtifactAblationRows: readonly PSimplexT28DKArtifactAblationRow[];
  vBlindnessRows: readonly PSimplexT28DVBlindnessRow[];
}): boolean {
  const requiredParentsOk = args.parentEvidenceRows
    .filter((row) => row.parentId !== 'V-locality-optional')
    .every((row) => row.ok);

  return (
    !requiredParentsOk ||
    !args.t28c1ParentInvariantSatisfied ||
    args.t28c1NoInputPlaceholderDetected ||
    args.kSignalDecompositionRows.some((row) => row.kSignalStatus === 'k-signal-incomplete') ||
    args.kTransverseCauseRows.some((row) => row.causeClassification === 'missing-row') ||
    args.kArtifactAblationRows.some((row) => row.kSignalAfterArtifactAblation === 'inconclusive') ||
    args.vBlindnessRows.some((row) => row.vBlindnessClassification === 'v-data-missing')
  );
}

function countRowsAfterCauseAblation(
  rows: readonly PSimplexT28DKTransverseCauseRow[],
  family: PSimplexT28DNonArtifactCause | 'unreadable-or-status',
): number {
  return rows.filter((row) => {
    const remaining = row.nonArtifactCauses.filter((cause) => {
      if (family === 'unreadable-or-status') {
        return cause !== 'unreadable-under-axis-policy' && cause !== 'axis-bent-or-mixed';
      }

      return cause !== family;
    });

    return remaining.length > 0;
  }).length;
}

function dominantCauseFamily(rows: readonly PSimplexT28DKTransverseCauseRow[]): PSimplexT28DCauseFamily {
  if (rows.length === 0 || rows.some((row) => row.causeClassification === 'missing-row')) {
    return 'inconclusive';
  }

  const nonArtifactFamilies = rows.flatMap((row) => row.nonArtifactCauses.map(causeFamilyForNonArtifactCause));

  if (nonArtifactFamilies.length === 0) {
    return rows.some((row) => row.artifactOnly) ? 'kernel-artifact-only' : 'none';
  }

  const counts = countValues(nonArtifactFamilies);
  const maxCount = Math.max(...counts.values());
  const winners = [...counts.entries()].filter(([, count]) => count === maxCount).map(([family]) => family);

  return winners.length === 1 && counts.size === 1 ? winners[0] : winners.length === 1 ? winners[0] : 'multi-cause';
}

function dominantGlobalFamily(rows: readonly PSimplexT28DKCauseAblationRow[]): string {
  const families = rows.map((row) => row.dominantCauseFamily);
  const counts = countValues(families);
  const maxCount = Math.max(...counts.values());
  const winners = [...counts.entries()].filter(([, count]) => count === maxCount).map(([family]) => family);

  return winners.length === 1 ? winners[0] : 'multi-cause';
}

function causeFamilyForNonArtifactCause(cause: PSimplexT28DNonArtifactCause): Exclude<PSimplexT28DCauseFamily, 'kernel-artifact-only' | 'multi-cause' | 'none' | 'inconclusive'> {
  if (cause === 'suppression-reason-present') {
    return 'suppression-reason';
  }

  if (cause === 'unreadable-under-axis-policy' || cause === 'axis-bent-or-mixed') {
    return 'unreadable-or-status';
  }

  return cause;
}

function classifyKPatternUniformity(
  kRows: readonly PSimplexT28DKSignalDecompositionRow[],
  ablationRows: readonly PSimplexT28DKCauseAblationRow[],
): 'uniform-across-three-pairs' | 'mostly-uniform' | 'pair-specific' | 'inconclusive' {
  if (
    kRows.length !== 3 ||
    ablationRows.length !== 3 ||
    kRows.some((row) => row.kSignalStatus === 'k-signal-incomplete') ||
    ablationRows.some((row) => row.dominantCauseFamily === 'inconclusive')
  ) {
    return 'inconclusive';
  }

  const signatures = kRows.map((row) => {
    const ablation = requireAblationRow(ablationRows, row.axisPairId);

    return [row.kScoreFromT28C1, row.kTransverseDifferentiationRateFromT28C1, ablation.dominantCauseFamily].join('|');
  });

  if (new Set(signatures).size === 1) {
    return 'uniform-across-three-pairs';
  }

  return kRows.every((row) => row.kSignalPresent) ? 'mostly-uniform' : 'pair-specific';
}

function allPairKSignaturesSame(
  kRows: readonly PSimplexT28DKSignalDecompositionRow[],
  artifactRows: readonly PSimplexT28DKArtifactAblationRow[],
): boolean {
  if (kRows.length !== 3 || artifactRows.length !== 3) {
    return false;
  }

  const signatures = kRows.map((row) => {
    const artifact = requireArtifactRow(artifactRows, row.axisPairId);

    return [row.kScoreFromT28C1, row.kTransverseDifferentiationRateFromT28C1, artifact.kSignalAfterArtifactAblation].join('|');
  });

  return new Set(signatures).size === 1;
}

function classifyVBlindnessReason(rowsExist: boolean, siblingAxisResults: readonly string[]): PSimplexT28DVBlindnessRow['vBlindnessReason'] {
  if (!rowsExist) {
    return 'v-parent-row-insufficient-detail';
  }

  if (siblingAxisResults.length > 0 && siblingAxisResults.every((value) => value === 'axis-preserved')) {
    return 'sibling-contamination-rows-axis-preserving';
  }

  if (siblingAxisResults.length > 0 && siblingAxisResults.every((value) => value === 'axis-cancelled')) {
    return 'sibling-contamination-rows-neutral';
  }

  return siblingAxisResults.length === 0 ? 'v-parent-row-insufficient-detail' : 'transverse-readout-not-same-object-as-k3-t';
}

function interpretationFor(primaryClassification: PSimplexT28DClassificationId, dominantGlobalCauseFamily: string): PSimplexT28DGlobalSummary['interpretation'] {
  if (primaryClassification === 'insufficient-to-classify') {
    return 'insufficient-to-classify';
  }

  if (primaryClassification === 'K-local-artifact-risk') {
    return 'k-artifact-risk';
  }

  if (primaryClassification === 'K-locality-sensitive-only') {
    return 'k-locality-sensitive-only';
  }

  if (primaryClassification === 'K-sampling-family-asymmetry') {
    return 'k-sampling-family-asymmetry';
  }

  return dominantGlobalCauseFamily === 'kernel-artifact-only' ? 'k-artifact-risk' : 'k-local-signal-persists-v-readout-mismatch';
}

function summaryInconsistentWithPrimary(
  summaryVerdict: PSimplexT28DSummaryVerdict,
  primaryClassification: PSimplexT28DClassificationId,
): boolean {
  if (primaryClassification === 'insufficient-to-classify') {
    return summaryVerdict !== 'T28-D-insufficient-to-classify';
  }

  if (primaryClassification === 'K-local-artifact-risk') {
    return summaryVerdict !== 'T28-D-K-artifact-risk';
  }

  if (primaryClassification === 'K-locality-sensitive-only') {
    return summaryVerdict !== 'T28-D-K-locality-sensitive-only';
  }

  if (primaryClassification === 'K-sampling-family-asymmetry') {
    return summaryVerdict !== 'T28-D-K-sampling-family-asymmetry-with-V-blindness';
  }

  return false;
}

function detectT28C1PlaceholderReport(report: unknown): boolean {
  if (!isRecord(report) || stringField(report, 'method') !== 'p-simplex-axis-transverse-discrimination-survival-metric-t28c1') {
    return false;
  }

  const parentRows = arrayField(report, 'parentEvidenceRows');

  return parentRows.length > 0 && parentRows.some((row) => stringField(row, 'importStatus') !== 'imported');
}

function expectedK3TSampleIds(t28c1Report: unknown): string[] {
  return unique(arrayField(t28c1Report, 'kMetricRows').flatMap((row) => stringArrayField(row, 'kTransverseSampleIds')));
}

function classificationRow(
  classificationId: PSimplexT28DClassificationId,
  applies: boolean,
  confidence: PSimplexT28DClassificationRow['confidence'],
  evidence: string[],
  blockedBy: string[],
): PSimplexT28DClassificationRow {
  return {
    classificationId,
    applies,
    confidence: applies ? confidence : 'not-applicable',
    evidence,
    blockedBy,
  };
}

function boundaryRow(boundaryId: string, statement: string): PSimplexT28DBoundaryRow {
  return {
    boundaryId,
    statement,
    enforced: true,
  };
}

function falsifierRow(falsifierId: string, description: string, triggered: boolean, evidence: string): PSimplexT28DFalsifierRow {
  return {
    falsifierId,
    description,
    triggered,
    evidence,
    status: triggered ? 'triggered' : 'clear',
  };
}

function forbiddenSurvivalVerdict(summaryVerdict: string): boolean {
  return [
    'ATD-H0-survives',
    'ACTS-v0-survives',
    'corridor-confirmed',
    'route-confirmed',
    'gate-confirmed',
    'fieldworld-feature-confirmed',
    'FieldCue-ready',
    'generated-site-reading-ready',
    'topology-authorized',
    'runtime-authorized',
  ].includes(summaryVerdict);
}

function classificationApplies(rows: readonly PSimplexT28DClassificationRow[], classificationId: PSimplexT28DClassificationId): boolean {
  return rows.some((row) => row.classificationId === classificationId && row.applies);
}

function requireAblationRow(
  rows: readonly PSimplexT28DKCauseAblationRow[],
  axisPairId: PSimplexT28DAxisPairId,
): PSimplexT28DKCauseAblationRow {
  const row = rows.find((entry) => entry.axisPairId === axisPairId);

  if (!row) {
    throw new Error(`Missing T28-D cause ablation row ${axisPairId}`);
  }

  return row;
}

function requireArtifactRow(
  rows: readonly PSimplexT28DKArtifactAblationRow[],
  axisPairId: PSimplexT28DAxisPairId,
): PSimplexT28DKArtifactAblationRow {
  const row = rows.find((entry) => entry.axisPairId === axisPairId);

  if (!row) {
    throw new Error(`Missing T28-D artifact ablation row ${axisPairId}`);
  }

  return row;
}

function requireVBlindnessRow(
  rows: readonly PSimplexT28DVBlindnessRow[],
  axisPairId: PSimplexT28DAxisPairId,
): PSimplexT28DVBlindnessRow {
  const row = rows.find((entry) => entry.axisPairId === axisPairId);

  if (!row) {
    throw new Error(`Missing T28-D V blindness row ${axisPairId}`);
  }

  return row;
}

function childIdFromSampleId(sampleId: string): PSimplexT28DChildId {
  const match = /(M_[A-Z]{2})$/u.exec(sampleId);
  const childId = match?.[1];

  return isChildId(childId) ? childId : 'M_AB';
}

function isChildId(value: string | undefined): value is PSimplexT28DChildId {
  return value === 'M_AB' || value === 'M_AC' || value === 'M_AD' || value === 'M_BC' || value === 'M_BD' || value === 'M_CD';
}

function scoreField(value: unknown, key: string): 0 | 1 | 2 {
  const field = numberField(value, key);

  return field === 1 || field === 2 ? field : 0;
}

function dominantString(values: readonly string[]): string {
  if (values.length === 0) {
    return 'inconclusive';
  }

  const counts = countValues(values);
  const maxCount = Math.max(...counts.values());
  const winners = [...counts.entries()].filter(([, count]) => count === maxCount).map(([value]) => value);

  return winners.length === 1 ? winners[0] : 'mixed';
}

function countValues<T>(values: readonly T[]): Map<T, number> {
  const counts = new Map<T, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return counts;
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

function stringArrayField(value: unknown, key: string): string[] {
  return arrayField(value, key).filter(isString);
}

function stringField(value: unknown, key: string): string | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const field = value[key];

  return typeof field === 'string' ? field : undefined;
}

function nullableStringField(value: unknown, key: string): string | null | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const field = value[key];

  return typeof field === 'string' || field === null ? field : undefined;
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

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNonArtifactCause(value: unknown): value is PSimplexT28DNonArtifactCause {
  return (
    value === 'clean-reading-blocked' ||
    value === 'suppression-reason-present' ||
    value === 'unreadable-under-axis-policy' ||
    value === 'axis-bent-or-mixed' ||
    value === 'locality-sensitive' ||
    value === 'transverse-residual'
  );
}

function isDifferentiationCause(value: unknown): value is PSimplexT28DDifferentiationCause {
  return isNonArtifactCause(value) || value === 'kernel-artifact-risk';
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

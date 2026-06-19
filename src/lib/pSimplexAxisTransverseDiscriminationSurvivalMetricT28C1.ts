export type PSimplexT28C1BranchRef = 'wgate/arf-w1-root-frame-v0';
export type PSimplexT28C1AxisPairId = 'AB-CD' | 'AC-BD' | 'AD-BC';
export type PSimplexT28C1ChildId = 'M_AB' | 'M_AC' | 'M_AD' | 'M_BC' | 'M_BD' | 'M_CD';
export type PSimplexT28C1PairSurvivalVerdict =
  | 'pair-survives'
  | 'pair-partial'
  | 'pair-fails-preload-only'
  | 'pair-fails-no-differential'
  | 'pair-fails-boundary-collapse'
  | 'pair-ineligible-missing-required-rows';
export type PSimplexT28C1SummaryVerdict =
  | 'ATD-H0-class-survives-pre-feature'
  | 'ATD-H0-local-candidate-only'
  | 'ATD-H0-partial-cross-channel-discrimination'
  | 'ATD-H0-fails-no-cross-channel-discrimination'
  | 'ATD-H0-fails-preload-or-single-channel-only'
  | 'ATD-H0-fails-boundary-collapse'
  | 'ATD-H0-ineligible-missing-required-evidence';
export type PSimplexT28C1SupportStatus = 'strong' | 'weak' | 'none';

export interface PSimplexT28C1ParentInput {
  builderName: string;
  importStatus: 'imported' | 'not-imported' | 'optional-not-imported' | 'failed';
  report?: unknown;
  errorMessage?: string;
}

export interface PSimplexT28C1Inputs {
  t28c0Parent: PSimplexT28C1ParentInput;
  sParent: PSimplexT28C1ParentInput;
  optionalSStructuralChannelParent?: PSimplexT28C1ParentInput;
  vParent: PSimplexT28C1ParentInput;
  kParent: PSimplexT28C1ParentInput;
  gParent: PSimplexT28C1ParentInput;
}

export interface PSimplexT28C1CandidateRow {
  candidateId: 'ATD-H0';
  candidateName: 'axis/transverse discrimination hypothesis';
  candidateStatus: 'newly-proposed-research-hypothesis';
  maturityStatus: 'pre-feature-only';
  priorAcceptedObject: false;
  forbiddenMaturity: [
    'not-route',
    'not-gate',
    'not-corridor',
    'not-loop',
    'not-vortex',
    'not-support-region',
    'not-topology',
    'not-fieldcue',
    'not-semantic-naming',
    'not-runtime',
  ];
}

export interface PSimplexT28C1ParentEvidenceRow {
  parentId: string;
  builderName: string;
  importStatus: 'imported' | 'not-imported' | 'optional-not-imported' | 'failed';
  ok: boolean;
  summaryVerdict?: string;
  diagnosticScope?: string;
  usedForScoring: boolean;
  usedAsBoundary: boolean;
  notes: string[];
}

export interface PSimplexT28C1AxisPairRow {
  axisPairId: PSimplexT28C1AxisPairId;
  leftChild: PSimplexT28C1ChildId;
  rightChild: PSimplexT28C1ChildId;
  axisClass: 'axis-class';
  transverseClass: 'transverse-class';
  description: string;
  ok: boolean;
}

export interface PSimplexT28C1SGuardRow {
  axisPairId: PSimplexT28C1AxisPairId;
  leftChild: PSimplexT28C1ChildId;
  rightChild: PSimplexT28C1ChildId;
  sourceStateSkeletonPresent: boolean;
  complementRelationPresent: boolean;
  antipodalRelationPresent: boolean;
  axisPairMembershipPresent: boolean;
  preloadStatus: 'source-state-preload-identified' | 'source-state-preload-missing';
  sCanScorePositiveEvidence: false;
  sGuardStatus:
    | 'pass'
    | 'fail-missing-source-state-skeleton'
    | 'fail-s-treated-as-positive-evidence';
}

export interface PSimplexT28C1GGuardRow {
  axisPairId: PSimplexT28C1AxisPairId;
  leftChild: PSimplexT28C1ChildId;
  rightChild: PSimplexT28C1ChildId;
  leftWitnessRowPresent: boolean;
  rightWitnessRowPresent: boolean;
  p2OneThirdGermAvailable: boolean;
  bodyShadowMarginStatus: 'positive-margin' | 'nonpositive-margin' | 'missing';
  antipodalCovarianceStatus: 'holds-by-signed-symmetry' | 'fails' | 'missing';
  exactGermContrastStatus:
    | 'exact-site-axis-only-vs-declared-A3-germ'
    | 'missing-exact-germ-contrast'
    | 'missing';
  closedResponseClaim: false;
  spatialPropagationClaim: false;
  gCanScorePositiveEvidence: false;
  gGuardStatus:
    | 'pass'
    | 'fail-missing-germ-boundary'
    | 'fail-body-shadow-boundary'
    | 'fail-antipodal-covariance'
    | 'fail-closed-response-leak'
    | 'fail-spatial-propagation-leak';
}

export interface PSimplexT28C1PQuarantineRow {
  pChannelIncludedInScore: false;
  pChannelStatus: 'quarantined-excluded-from-survival-score';
  pForbiddenSupportRule: 'P-channel scalar field / route-gate residue cannot count as support in T28-C1.';
  pAllowedFutureUse: 'Only a later researcher-defined same-object scalar relation may allow P-channel evidence.';
  pLeakDetected: boolean;
}

export interface PSimplexT28C1VMetricRow {
  axisPairId: PSimplexT28C1AxisPairId;
  leftChild: PSimplexT28C1ChildId;
  rightChild: PSimplexT28C1ChildId;
  vAxisRowIds: string[];
  vTransverseRowIds: string[];
  vAxisRowCount: number;
  vAxisLegibleCount: number;
  vAxisLegibleRate: number;
  vTransverseRowCount: number;
  vTransverseDifferentiationPoints: number;
  vTransverseDifferentiationRate: number;
  vScore: 0 | 1 | 2;
  vSupportStatus: PSimplexT28C1SupportStatus | 'ineligible-missing-v-rows';
  l4AxisRowsExcludedCount: number;
  adapterNotes: string[];
}

export interface PSimplexT28C1KMetricRow {
  axisPairId: PSimplexT28C1AxisPairId;
  leftChild: PSimplexT28C1ChildId;
  rightChild: PSimplexT28C1ChildId;
  kAxisSampleIds: string[];
  kTransverseSampleIds: string[];
  kAxisRowCount: number;
  kAxisLegibleCount: number;
  kAxisLegibleRate: number;
  kTransverseRowCount: number;
  kTransverseDifferentiatedCount: number;
  kTransverseDifferentiationRate: number;
  kernelArtifactCaveatCount: number;
  kernelArtifactOnlyDifferentiationCount: number;
  kScore: 0 | 1 | 2;
  kSupportStatus: PSimplexT28C1SupportStatus | 'ineligible-missing-k-rows';
  adapterNotes: string[];
}

export interface PSimplexT28C1PairSurvivalRow {
  axisPairId: PSimplexT28C1AxisPairId;
  leftChild: PSimplexT28C1ChildId;
  rightChild: PSimplexT28C1ChildId;
  sGuardStatus: PSimplexT28C1SGuardRow['sGuardStatus'];
  gGuardStatus: PSimplexT28C1GGuardRow['gGuardStatus'];
  pChannelStatus: PSimplexT28C1PQuarantineRow['pChannelStatus'];
  vScore: 0 | 1 | 2;
  kScore: 0 | 1 | 2;
  combinedVKScore: number;
  pairSurvivalVerdict: PSimplexT28C1PairSurvivalVerdict;
  pairCanMatureBeyondPreFeature: false;
}

export interface PSimplexT28C1GlobalSummary {
  survivingPairCount: number;
  partialPairCount: number;
  failedPairCount: number;
  boundaryFailureCount: number;
  ineligiblePairCount: number;
  vStrongPairCount: number;
  kStrongPairCount: number;
  pLeakDetected: boolean;
  sPositiveEvidenceLeakDetected: boolean;
  gSpatialPropagationLeakDetected: boolean;
  interpretation:
    | 'pre-feature-axis-transverse-discrimination-supported'
    | 'local-pre-feature-candidate-only'
    | 'partial-cross-channel-discrimination-only'
    | 'no-cross-channel-discrimination'
    | 'preload-or-single-channel-only'
    | 'boundary-collapse'
    | 'missing-required-evidence';
}

export interface PSimplexT28C1BoundaryRow {
  boundaryId:
    | 'not-route'
    | 'not-gate'
    | 'not-corridor'
    | 'not-loop'
    | 'not-vortex'
    | 'not-support-region'
    | 'not-topology'
    | 'not-fieldcue'
    | 'not-semantic-naming'
    | 'not-generated-site-reading'
    | 'not-runtime'
    | 'not-field-resurrection'
    | 'not-closed-A3-response'
    | 'not-body-response'
    | 'not-P-channel-support';
  statement: string;
  enforced: true;
}

export interface PSimplexT28C1FalsifierRow {
  falsifierId:
    | 'F1'
    | 'F2'
    | 'F3'
    | 'F4'
    | 'F5'
    | 'F6'
    | 'F7'
    | 'F8'
    | 'F9'
    | 'F10'
    | 'F11'
    | 'F12'
    | 'F13'
    | 'F14'
    | 'F15';
  description: string;
  triggered: boolean;
  evidence: string;
  status: 'clear' | 'triggered';
}

export interface PSimplexT28C1Report {
  method: 'p-simplex-axis-transverse-discrimination-survival-metric-t28c1';
  diagnosticScope: 'axis-transverse-discrimination-survival-metric-only';
  branchRef: PSimplexT28C1BranchRef;
  candidateRow: PSimplexT28C1CandidateRow;
  parentEvidenceRows: PSimplexT28C1ParentEvidenceRow[];
  axisPairRows: PSimplexT28C1AxisPairRow[];
  sGuardRows: PSimplexT28C1SGuardRow[];
  gGuardRows: PSimplexT28C1GGuardRow[];
  pQuarantineRow: PSimplexT28C1PQuarantineRow;
  vMetricRows: PSimplexT28C1VMetricRow[];
  kMetricRows: PSimplexT28C1KMetricRow[];
  pairSurvivalRows: PSimplexT28C1PairSurvivalRow[];
  globalSummary: PSimplexT28C1GlobalSummary;
  boundaryRows: PSimplexT28C1BoundaryRow[];
  falsifierRows: PSimplexT28C1FalsifierRow[];
  summaryVerdict: PSimplexT28C1SummaryVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

type JsonRecord = Record<string, unknown>;

const BRANCH_REF: PSimplexT28C1BranchRef = 'wgate/arf-w1-root-frame-v0';
const AXIS_PAIRS: ReadonlyArray<{
  axisPairId: PSimplexT28C1AxisPairId;
  leftChild: PSimplexT28C1ChildId;
  rightChild: PSimplexT28C1ChildId;
}> = [
  { axisPairId: 'AB-CD', leftChild: 'M_AB', rightChild: 'M_CD' },
  { axisPairId: 'AC-BD', leftChild: 'M_AC', rightChild: 'M_BD' },
  { axisPairId: 'AD-BC', leftChild: 'M_AD', rightChild: 'M_BC' },
];
const V_AXIS_SCENARIOS = ['L0', 'L1', 'L2', 'L3'] as const;
const V_EXCLUDED_AXIS_SCENARIO = 'L4';
const AXIS_LEGIBLE_STATUSES = ['axis-preserved', 'axis-flipped', 'axis-cancelled', 'neutral-by-symmetry'] as const;
const K_TRANSVERSE_DIFFERENTIATED_STATUSES = [
  'axis-bent',
  'mixed-axis',
  'unreadable-under-axis-policy',
  'locality-sensitive',
] as const;

export function buildPSimplexAxisTransverseDiscriminationSurvivalMetricT28C1ReportFromInputs(
  inputs: PSimplexT28C1Inputs,
): PSimplexT28C1Report {
  const candidateRow = buildCandidateRow();
  const parentEvidenceRows = buildParentEvidenceRows(inputs);
  const axisPairRows = AXIS_PAIRS.map(buildAxisPairRow);
  const sGuardRows = buildSGuardRows(inputs.sParent.report);
  const gGuardRows = buildGGuardRows(inputs.gParent.report);
  const pQuarantineRow = buildPQuarantineRow();
  const vMetricRows = buildVMetricRows(inputs.vParent.report);
  const kMetricRows = buildKMetricRows(inputs.kParent.report);
  const pairSurvivalRows = buildPairSurvivalRows({
    sGuardRows,
    gGuardRows,
    pQuarantineRow,
    vMetricRows,
    kMetricRows,
  });
  const boundaryRows = buildBoundaryRows();
  const globalSummary = buildGlobalSummary(pairSurvivalRows, vMetricRows, kMetricRows, pQuarantineRow, sGuardRows, gGuardRows);
  const summaryVerdict = classifySummaryVerdict(parentEvidenceRows, pairSurvivalRows, globalSummary, candidateRow);
  const falsifierRows = buildFalsifierRows({
    candidateRow,
    parentEvidenceRows,
    sGuardRows,
    gGuardRows,
    pQuarantineRow,
    vMetricRows,
    kMetricRows,
    pairSurvivalRows,
    globalSummary,
    summaryVerdict,
  });
  const integrityIssues = buildIntegrityIssues({
    candidateRow,
    parentEvidenceRows,
    axisPairRows,
    sGuardRows,
    gGuardRows,
    pQuarantineRow,
    vMetricRows,
    kMetricRows,
    pairSurvivalRows,
    boundaryRows,
    falsifierRows,
    globalSummary,
    summaryVerdict,
  });

  return {
    method: 'p-simplex-axis-transverse-discrimination-survival-metric-t28c1',
    diagnosticScope: 'axis-transverse-discrimination-survival-metric-only',
    branchRef: BRANCH_REF,
    candidateRow,
    parentEvidenceRows,
    axisPairRows,
    sGuardRows,
    gGuardRows,
    pQuarantineRow,
    vMetricRows,
    kMetricRows,
    pairSurvivalRows,
    globalSummary,
    boundaryRows,
    falsifierRows,
    summaryVerdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: integrityIssues.length === 0,
  };
}

export function buildPSimplexAxisTransverseDiscriminationSurvivalMetricT28C1Report(): PSimplexT28C1Report {
  return buildPSimplexAxisTransverseDiscriminationSurvivalMetricT28C1ReportFromInputs({
    t28c0Parent: {
      builderName: 'buildPSimplexCrossProjectionProvenanceEligibilityPreflightT28C0Report',
      importStatus: 'not-imported',
    },
    sParent: { builderName: 'buildStructuredSourceStateDiagnosticV0Report', importStatus: 'not-imported' },
    optionalSStructuralChannelParent: {
      builderName: 'buildStructuredSourceStateMultiProjectionStructuralChannelV0Report',
      importStatus: 'optional-not-imported',
    },
    vParent: { builderName: 'buildPSimplexVectorOrderParameterDiagnosticV0Report', importStatus: 'not-imported' },
    kParent: { builderName: 'buildPSimplexGeometryGraphSamplingGateK3V0Report', importStatus: 'not-imported' },
    gParent: {
      builderName: 'buildPSimplexP2OneThirdSixSiteConvention2GermPressureWitnessMapT28AReport',
      importStatus: 'not-imported',
    },
  });
}

function buildCandidateRow(): PSimplexT28C1CandidateRow {
  return {
    candidateId: 'ATD-H0',
    candidateName: 'axis/transverse discrimination hypothesis',
    candidateStatus: 'newly-proposed-research-hypothesis',
    maturityStatus: 'pre-feature-only',
    priorAcceptedObject: false,
    forbiddenMaturity: [
      'not-route',
      'not-gate',
      'not-corridor',
      'not-loop',
      'not-vortex',
      'not-support-region',
      'not-topology',
      'not-fieldcue',
      'not-semantic-naming',
      'not-runtime',
    ],
  };
}

function buildParentEvidenceRows(inputs: PSimplexT28C1Inputs): PSimplexT28C1ParentEvidenceRow[] {
  const optionalS = inputs.optionalSStructuralChannelParent ?? {
    builderName: 'buildStructuredSourceStateMultiProjectionStructuralChannelV0Report',
    importStatus: 'optional-not-imported' as const,
  };

  return [
    parentEvidenceRow('T28-C0', inputs.t28c0Parent, false, true, [
      'Preflight gate only; not survival evidence.',
      t28c0GatePasses(inputs.t28c0Parent.report) ? 'T28-C0 permits later metric design.' : 'T28-C0 gate is missing or ineligible.',
    ]),
    parentEvidenceRow('S', inputs.sParent, false, true, ['S-channel is source-state preload / boundary only.']),
    parentEvidenceRow('S-structural-channel', optionalS, false, optionalS.importStatus === 'imported', [
      optionalS.importStatus === 'imported'
        ? 'Optional S structural-channel report imported as supplementary boundary context.'
        : 'Optional S structural-channel report was not imported.',
    ]),
    parentEvidenceRow('V', inputs.vParent, true, false, ['V-channel is a positive-support parent for axis-order behavior.']),
    parentEvidenceRow('K', inputs.kParent, true, false, ['K-channel is a positive-support parent for relation/locality/K3 sampling.']),
    parentEvidenceRow('G/T28-A', inputs.gParent, false, true, ['G-channel is germ/readout boundary only, not spatial propagation.']),
  ];
}

function parentEvidenceRow(
  parentId: string,
  input: PSimplexT28C1ParentInput,
  usedForScoring: boolean,
  usedAsBoundary: boolean,
  notes: string[],
): PSimplexT28C1ParentEvidenceRow {
  return {
    parentId,
    builderName: input.builderName,
    importStatus: input.importStatus,
    ok: parentInputOk(input, parentId),
    summaryVerdict: stringField(input.report, 'summaryVerdict') ?? stringField(input.report, 'verdict'),
    diagnosticScope: stringField(input.report, 'diagnosticScope'),
    usedForScoring,
    usedAsBoundary,
    notes: input.errorMessage ? [...notes, `import-error:${input.errorMessage}`] : notes,
  };
}

function parentInputOk(input: PSimplexT28C1ParentInput, parentId: string): boolean {
  if (input.importStatus !== 'imported') {
    return parentId === 'S-structural-channel' && input.importStatus === 'optional-not-imported';
  }

  if (parentId === 'T28-C0') {
    return t28c0GatePasses(input.report);
  }

  return booleanField(input.report, 'ok') === true && numericIssueCount(input.report) === 0;
}

function t28c0GatePasses(report: unknown): boolean {
  const summaryVerdict = stringField(report, 'summaryVerdict');

  return (
    booleanField(report, 'ok') === true &&
    numericIssueCount(report) === 0 &&
    summaryVerdict !== undefined &&
    !summaryVerdict.startsWith('ineligible-')
  );
}

function buildAxisPairRow(pair: (typeof AXIS_PAIRS)[number]): PSimplexT28C1AxisPairRow {
  return {
    ...pair,
    axisClass: 'axis-class',
    transverseClass: 'transverse-class',
    description:
      'A(P) uses antipodal child-axis behavior; T(P) uses one-endpoint sibling or K3 transverse sample behavior for the same children.',
    ok: true,
  };
}

function buildSGuardRows(sReport: unknown): PSimplexT28C1SGuardRow[] {
  const generatedChildStates = arrayField(sReport, 'generatedChildStates');
  const complementAxes = arrayField(sReport, 'complementAxes');

  return AXIS_PAIRS.map((pair) => {
    const leftState = generatedChildStates.find((row) => stringField(row, 'childSiteId') === pair.leftChild);
    const rightState = generatedChildStates.find((row) => stringField(row, 'childSiteId') === pair.rightChild);
    const axis = complementAxes.find((row) => normalizeAxisPairId(stringField(row, 'axisPairId')) === pair.axisPairId);
    const axisChildSites = stringArrayField(axis, 'childSiteIds');
    const sourceStateSkeletonPresent = isRecord(leftState) && isRecord(rightState);
    const complementRelationPresent =
      stringField(leftState, 'complementEdgeStateId') === edgeId(pair.rightChild) &&
      stringField(rightState, 'complementEdgeStateId') === edgeId(pair.leftChild);
    const antipodalRelationPresent =
      stringField(leftState, 'antipodalChildSiteId') === pair.rightChild &&
      stringField(rightState, 'antipodalChildSiteId') === pair.leftChild;
    const axisPairMembershipPresent =
      axisChildSites.includes(pair.leftChild) &&
      axisChildSites.includes(pair.rightChild) &&
      axisChildSites.length === 2;
    const preloadPass =
      sourceStateSkeletonPresent &&
      complementRelationPresent &&
      antipodalRelationPresent &&
      axisPairMembershipPresent;

    return {
      ...pair,
      sourceStateSkeletonPresent,
      complementRelationPresent,
      antipodalRelationPresent,
      axisPairMembershipPresent,
      preloadStatus: preloadPass ? 'source-state-preload-identified' : 'source-state-preload-missing',
      sCanScorePositiveEvidence: false,
      sGuardStatus: preloadPass ? 'pass' : 'fail-missing-source-state-skeleton',
    };
  });
}

function buildGGuardRows(gReport: unknown): PSimplexT28C1GGuardRow[] {
  const witnessRows = arrayField(gReport, 'sixSiteWitnessRows');
  const antipodalPairRows = arrayField(gReport, 'antipodalPairRows');

  return AXIS_PAIRS.map((pair) => {
    const leftWitness = witnessRows.find((row) => stringField(row, 'childId') === pair.leftChild);
    const rightWitness = witnessRows.find((row) => stringField(row, 'childId') === pair.rightChild);
    const pairRow = antipodalPairRows.find((row) => pairMatches(row, pair.leftChild, pair.rightChild));
    const leftWitnessRowPresent = isRecord(leftWitness);
    const rightWitnessRowPresent = isRecord(rightWitness);
    const p2OneThirdGermAvailable = leftWitnessRowPresent && rightWitnessRowPresent;
    const bodyShadowMarginStatus = pairBodyShadowMarginStatus(leftWitness, rightWitness);
    const antipodalCovarianceStatus = pairAntipodalCovarianceStatus(pairRow, leftWitness, rightWitness);
    const exactGermContrastStatus = pairExactGermContrastStatus(leftWitness, rightWitness);
    const closedResponseLeak =
      stringField(leftWitness, 'A3ClosureStatus') !== 'not-closed-response' ||
      stringField(rightWitness, 'A3ClosureStatus') !== 'not-closed-response';
    const spatialPropagationLeak =
      stringField(leftWitness, 'fieldPressurePrimitiveStatus') !== 'structural-pressure-primitive-not-fieldcue' ||
      stringField(rightWitness, 'fieldPressurePrimitiveStatus') !== 'structural-pressure-primitive-not-fieldcue';

    return {
      ...pair,
      leftWitnessRowPresent,
      rightWitnessRowPresent,
      p2OneThirdGermAvailable,
      bodyShadowMarginStatus,
      antipodalCovarianceStatus,
      exactGermContrastStatus,
      closedResponseClaim: false,
      spatialPropagationClaim: false,
      gCanScorePositiveEvidence: false,
      gGuardStatus: classifyGGuardStatus({
        p2OneThirdGermAvailable,
        bodyShadowMarginStatus,
        antipodalCovarianceStatus,
        exactGermContrastStatus,
        closedResponseLeak,
        spatialPropagationLeak,
      }),
    };
  });
}

function classifyGGuardStatus(args: {
  p2OneThirdGermAvailable: boolean;
  bodyShadowMarginStatus: PSimplexT28C1GGuardRow['bodyShadowMarginStatus'];
  antipodalCovarianceStatus: PSimplexT28C1GGuardRow['antipodalCovarianceStatus'];
  exactGermContrastStatus: PSimplexT28C1GGuardRow['exactGermContrastStatus'];
  closedResponseLeak: boolean;
  spatialPropagationLeak: boolean;
}): PSimplexT28C1GGuardRow['gGuardStatus'] {
  if (!args.p2OneThirdGermAvailable || args.exactGermContrastStatus === 'missing') {
    return 'fail-missing-germ-boundary';
  }

  if (args.bodyShadowMarginStatus !== 'positive-margin') {
    return 'fail-body-shadow-boundary';
  }

  if (args.antipodalCovarianceStatus !== 'holds-by-signed-symmetry') {
    return 'fail-antipodal-covariance';
  }

  if (args.closedResponseLeak) {
    return 'fail-closed-response-leak';
  }

  if (args.spatialPropagationLeak) {
    return 'fail-spatial-propagation-leak';
  }

  return 'pass';
}

function buildPQuarantineRow(): PSimplexT28C1PQuarantineRow {
  return {
    pChannelIncludedInScore: false,
    pChannelStatus: 'quarantined-excluded-from-survival-score',
    pForbiddenSupportRule: 'P-channel scalar field / route-gate residue cannot count as support in T28-C1.',
    pAllowedFutureUse: 'Only a later researcher-defined same-object scalar relation may allow P-channel evidence.',
    pLeakDetected: false,
  };
}

function buildVMetricRows(vReport: unknown): PSimplexT28C1VMetricRow[] {
  const axisRows = arrayField(vReport, 'accumulatedLocalChildSampleRows');
  const siblingRows = arrayField(vReport, 'siblingContaminationRows');

  return AXIS_PAIRS.map((pair) => {
    const pairChildren = [pair.leftChild, pair.rightChild];
    const selectedAxisRows = axisRows.filter(
      (row) => pairChildren.includes(stringField(row, 'childSite') as PSimplexT28C1ChildId) &&
        V_AXIS_SCENARIOS.includes(stringField(row, 'scenarioId') as (typeof V_AXIS_SCENARIOS)[number]),
    );
    const excludedL4Rows = axisRows.filter(
      (row) => pairChildren.includes(stringField(row, 'childSite') as PSimplexT28C1ChildId) &&
        stringField(row, 'scenarioId') === V_EXCLUDED_AXIS_SCENARIO,
    );
    const selectedTransverseRows = siblingRows.filter((row) =>
      pairChildren.includes(stringField(row, 'childSite') as PSimplexT28C1ChildId),
    );
    const vAxisLegibleCount = selectedAxisRows.filter((row) => axisStatusLegible(stringField(row, 'axisResult'))).length;
    const vTransverseDifferentiationPoints = cleanNumber(
      selectedTransverseRows.reduce<number>(
        (sum, row) => sum + vTransverseWeight(stringField(row, 'axisResult')),
        0,
      ),
    );
    const vAxisRowCount = selectedAxisRows.length;
    const vTransverseRowCount = selectedTransverseRows.length;
    const missingRows = vAxisRowCount !== 8 || vTransverseRowCount !== 2;
    const vAxisLegibleRate = rate(vAxisLegibleCount, vAxisRowCount);
    const vTransverseDifferentiationRate = rate(vTransverseDifferentiationPoints, vTransverseRowCount);
    const vScore = missingRows ? 0 : scoreFor(vAxisLegibleRate, vTransverseDifferentiationRate);

    return {
      ...pair,
      vAxisRowIds: selectedAxisRows.map((row) => `V-axis:${stringField(row, 'childSite')}:${stringField(row, 'scenarioId')}`),
      vTransverseRowIds: selectedTransverseRows.map((row) => `V-sibling:${stringField(row, 'childSite')}`),
      vAxisRowCount,
      vAxisLegibleCount,
      vAxisLegibleRate,
      vTransverseRowCount,
      vTransverseDifferentiationPoints,
      vTransverseDifferentiationRate,
      vScore,
      vSupportStatus: missingRows ? 'ineligible-missing-v-rows' : supportStatusFor(vScore),
      l4AxisRowsExcludedCount: excludedL4Rows.length,
      adapterNotes: [
        'Adapted from accumulatedLocalChildSampleRows and siblingContaminationRows.',
        `Excluded L4 child-only amputation control rows: ${excludedL4Rows.length}.`,
      ],
    };
  });
}

function buildKMetricRows(kReport: unknown): PSimplexT28C1KMetricRow[] {
  const sampleRows = arrayField(kReport, 'k3SampleRows');
  const vectorRows = arrayField(kReport, 'k3VectorResultRows');
  const auditRows = arrayField(kReport, 'k3LocalityAuditRows');

  return AXIS_PAIRS.map((pair) => {
    const pairChildren = [pair.leftChild, pair.rightChild];
    const axisSamples = sampleRows.filter(
      (row) =>
        pairChildren.includes(stringField(row, 'targetChild') as PSimplexT28C1ChildId) &&
        ['K3-A-primary', 'K3-A-complement'].includes(stringField(row, 'sampleFamily') ?? ''),
    );
    const transverseSamples = sampleRows.filter(
      (row) =>
        pairChildren.includes(stringField(row, 'targetChild') as PSimplexT28C1ChildId) &&
        stringField(row, 'sampleFamily') === 'K3-T',
    );
    const axisJoined = axisSamples.map((sample) => joinKSample(sample, vectorRows, auditRows));
    const transverseJoined = transverseSamples.map((sample) => joinKSample(sample, vectorRows, auditRows));
    const kAxisLegibleCount = axisJoined.filter(kAxisRowLegible).length;
    const transverseClassifications = transverseJoined.map(kTransverseDifferentiation);
    const kTransverseDifferentiatedCount = transverseClassifications.filter((row) => row.differentiated).length;
    const kernelArtifactCaveatCount = transverseJoined.filter((row) => booleanField(row.audit, 'kernelArtifactRisk') === true).length;
    const kernelArtifactOnlyDifferentiationCount = transverseClassifications.filter((row) => row.kernelArtifactOnly).length;
    const kAxisRowCount = axisJoined.length;
    const kTransverseRowCount = transverseJoined.length;
    const missingRows = kAxisRowCount !== 4 || kTransverseRowCount !== 2 || axisJoined.some((row) => !row.complete) || transverseJoined.some((row) => !row.complete);
    const kAxisLegibleRate = rate(kAxisLegibleCount, kAxisRowCount);
    const kTransverseDifferentiationRate = rate(kTransverseDifferentiatedCount, kTransverseRowCount);
    const kScore = missingRows ? 0 : scoreFor(kAxisLegibleRate, kTransverseDifferentiationRate);

    return {
      ...pair,
      kAxisSampleIds: axisSamples.map((row) => stringField(row, 'sampleId') ?? 'missing-sample-id'),
      kTransverseSampleIds: transverseSamples.map((row) => stringField(row, 'sampleId') ?? 'missing-sample-id'),
      kAxisRowCount,
      kAxisLegibleCount,
      kAxisLegibleRate,
      kTransverseRowCount,
      kTransverseDifferentiatedCount,
      kTransverseDifferentiationRate,
      kernelArtifactCaveatCount,
      kernelArtifactOnlyDifferentiationCount,
      kScore,
      kSupportStatus: missingRows ? 'ineligible-missing-k-rows' : supportStatusFor(kScore),
      adapterNotes: [
        'Adapted from k3SampleRows joined to k3VectorResultRows and k3LocalityAuditRows by sampleId.',
        'K3-T kernelArtifactRisk is reported as a caveat, not counted as differentiation by itself.',
      ],
    };
  });
}

function buildPairSurvivalRows(args: {
  sGuardRows: readonly PSimplexT28C1SGuardRow[];
  gGuardRows: readonly PSimplexT28C1GGuardRow[];
  pQuarantineRow: PSimplexT28C1PQuarantineRow;
  vMetricRows: readonly PSimplexT28C1VMetricRow[];
  kMetricRows: readonly PSimplexT28C1KMetricRow[];
}): PSimplexT28C1PairSurvivalRow[] {
  return AXIS_PAIRS.map((pair) => {
    const s = requirePairRow(args.sGuardRows, pair.axisPairId);
    const g = requirePairRow(args.gGuardRows, pair.axisPairId);
    const v = requirePairRow(args.vMetricRows, pair.axisPairId);
    const k = requirePairRow(args.kMetricRows, pair.axisPairId);
    const combinedVKScore = v.vScore + k.kScore;
    const missingRequiredRows =
      v.vSupportStatus === 'ineligible-missing-v-rows' ||
      k.kSupportStatus === 'ineligible-missing-k-rows' ||
      s.sGuardStatus === 'fail-missing-source-state-skeleton' ||
      g.gGuardStatus === 'fail-missing-germ-boundary';
    const boundaryCollapse =
      !missingRequiredRows &&
      (s.sGuardStatus !== 'pass' || g.gGuardStatus !== 'pass' || args.pQuarantineRow.pLeakDetected);

    return {
      ...pair,
      sGuardStatus: s.sGuardStatus,
      gGuardStatus: g.gGuardStatus,
      pChannelStatus: args.pQuarantineRow.pChannelStatus,
      vScore: v.vScore,
      kScore: k.kScore,
      combinedVKScore,
      pairSurvivalVerdict: classifyPairSurvivalVerdict({
        missingRequiredRows,
        boundaryCollapse,
        vScore: v.vScore,
        kScore: k.kScore,
        combinedVKScore,
        differentialEvidenceExists:
          v.vTransverseDifferentiationPoints > 0 ||
          k.kTransverseDifferentiatedCount > 0,
      }),
      pairCanMatureBeyondPreFeature: false,
    };
  });
}

function classifyPairSurvivalVerdict(args: {
  missingRequiredRows: boolean;
  boundaryCollapse: boolean;
  vScore: 0 | 1 | 2;
  kScore: 0 | 1 | 2;
  combinedVKScore: number;
  differentialEvidenceExists: boolean;
}): PSimplexT28C1PairSurvivalVerdict {
  if (args.missingRequiredRows) {
    return 'pair-ineligible-missing-required-rows';
  }

  if (args.boundaryCollapse) {
    return 'pair-fails-boundary-collapse';
  }

  if (args.vScore >= 1 && args.kScore >= 1 && args.combinedVKScore >= 3) {
    return 'pair-survives';
  }

  if (args.combinedVKScore >= 2) {
    return 'pair-partial';
  }

  if (args.vScore === 0 && args.kScore === 0 && !args.differentialEvidenceExists) {
    return 'pair-fails-preload-only';
  }

  return 'pair-fails-no-differential';
}

function buildGlobalSummary(
  pairRows: readonly PSimplexT28C1PairSurvivalRow[],
  vRows: readonly PSimplexT28C1VMetricRow[],
  kRows: readonly PSimplexT28C1KMetricRow[],
  pRow: PSimplexT28C1PQuarantineRow,
  sRows: readonly PSimplexT28C1SGuardRow[],
  gRows: readonly PSimplexT28C1GGuardRow[],
): PSimplexT28C1GlobalSummary {
  const survivingPairCount = countPairs(pairRows, 'pair-survives');
  const partialPairCount = countPairs(pairRows, 'pair-partial');
  const boundaryFailureCount = countPairs(pairRows, 'pair-fails-boundary-collapse');
  const ineligiblePairCount = countPairs(pairRows, 'pair-ineligible-missing-required-rows');
  const failedPairCount = pairRows.filter((row) => row.pairSurvivalVerdict.startsWith('pair-fails')).length;
  const vStrongPairCount = vRows.filter((row) => row.vSupportStatus === 'strong').length;
  const kStrongPairCount = kRows.filter((row) => row.kSupportStatus === 'strong').length;
  const sPositiveEvidenceLeakDetected = sRows.some((row) => row.sCanScorePositiveEvidence);
  const gSpatialPropagationLeakDetected = gRows.some((row) => row.spatialPropagationClaim || row.gCanScorePositiveEvidence);
  const onlyOnePositiveChannel =
    (vRows.some((row) => row.vScore > 0) ? 1 : 0) + (kRows.some((row) => row.kScore > 0) ? 1 : 0) === 1;

  return {
    survivingPairCount,
    partialPairCount,
    failedPairCount,
    boundaryFailureCount,
    ineligiblePairCount,
    vStrongPairCount,
    kStrongPairCount,
    pLeakDetected: pRow.pLeakDetected,
    sPositiveEvidenceLeakDetected,
    gSpatialPropagationLeakDetected,
    interpretation:
      ineligiblePairCount > 0
        ? 'missing-required-evidence'
        : boundaryFailureCount > 0 || pRow.pLeakDetected || sPositiveEvidenceLeakDetected || gSpatialPropagationLeakDetected
          ? 'boundary-collapse'
          : survivingPairCount >= 2
            ? 'pre-feature-axis-transverse-discrimination-supported'
            : survivingPairCount === 1
              ? 'local-pre-feature-candidate-only'
              : onlyOnePositiveChannel
                ? 'preload-or-single-channel-only'
                : partialPairCount >= 2
                  ? 'partial-cross-channel-discrimination-only'
                  : 'no-cross-channel-discrimination',
  };
}

function classifySummaryVerdict(
  parentRows: readonly PSimplexT28C1ParentEvidenceRow[],
  pairRows: readonly PSimplexT28C1PairSurvivalRow[],
  globalSummary: PSimplexT28C1GlobalSummary,
  candidateRow: PSimplexT28C1CandidateRow,
): PSimplexT28C1SummaryVerdict {
  const requiredParentFailed = parentRows.some(
    (row) => row.parentId !== 'S-structural-channel' && !row.ok,
  );
  const forbiddenMaturity = candidateRow.priorAcceptedObject || candidateRow.maturityStatus !== 'pre-feature-only';

  if (requiredParentFailed || globalSummary.ineligiblePairCount > 0) {
    return 'ATD-H0-ineligible-missing-required-evidence';
  }

  if (
    forbiddenMaturity ||
    globalSummary.boundaryFailureCount > 0 ||
    globalSummary.pLeakDetected ||
    globalSummary.sPositiveEvidenceLeakDetected ||
    globalSummary.gSpatialPropagationLeakDetected
  ) {
    return 'ATD-H0-fails-boundary-collapse';
  }

  if (globalSummary.survivingPairCount >= 2) {
    return 'ATD-H0-class-survives-pre-feature';
  }

  if (globalSummary.survivingPairCount === 1) {
    return 'ATD-H0-local-candidate-only';
  }

  if (globalSummary.interpretation === 'preload-or-single-channel-only') {
    return 'ATD-H0-fails-preload-or-single-channel-only';
  }

  if (pairRows.filter((row) => row.pairSurvivalVerdict === 'pair-partial').length >= 2) {
    return 'ATD-H0-partial-cross-channel-discrimination';
  }

  if (pairRows.every((row) => row.pairSurvivalVerdict === 'pair-fails-preload-only')) {
    return 'ATD-H0-fails-preload-or-single-channel-only';
  }

  return 'ATD-H0-fails-no-cross-channel-discrimination';
}

function buildBoundaryRows(): PSimplexT28C1BoundaryRow[] {
  return [
    boundaryRow('not-route', 'No route maturity is claimed.'),
    boundaryRow('not-gate', 'No gate maturity is claimed.'),
    boundaryRow('not-corridor', 'No corridor maturity or accepted feature is claimed.'),
    boundaryRow('not-loop', 'No loop interpretation is claimed.'),
    boundaryRow('not-vortex', 'No vortex interpretation is claimed.'),
    boundaryRow('not-support-region', 'No support-region interpretation is claimed.'),
    boundaryRow('not-topology', 'No topology workspace or operation is authorized.'),
    boundaryRow('not-fieldcue', 'No FieldCue is created or authorized.'),
    boundaryRow('not-semantic-naming', 'No semantic naming is introduced.'),
    boundaryRow('not-generated-site-reading', 'No generated-site reading is created.'),
    boundaryRow('not-runtime', 'No runtime behavior or substrate is authorized.'),
    boundaryRow('not-field-resurrection', 'P-channel field residue is not resurrected into support.'),
    boundaryRow('not-closed-A3-response', 'A3 response remains not closed.'),
    boundaryRow('not-body-response', 'Body-shadow and germ boundaries are not body response.'),
    boundaryRow('not-P-channel-support', 'P-channel is quarantined and excluded from survival scoring.'),
  ];
}

function buildFalsifierRows(args: {
  candidateRow: PSimplexT28C1CandidateRow;
  parentEvidenceRows: readonly PSimplexT28C1ParentEvidenceRow[];
  sGuardRows: readonly PSimplexT28C1SGuardRow[];
  gGuardRows: readonly PSimplexT28C1GGuardRow[];
  pQuarantineRow: PSimplexT28C1PQuarantineRow;
  vMetricRows: readonly PSimplexT28C1VMetricRow[];
  kMetricRows: readonly PSimplexT28C1KMetricRow[];
  pairSurvivalRows: readonly PSimplexT28C1PairSurvivalRow[];
  globalSummary: PSimplexT28C1GlobalSummary;
  summaryVerdict: PSimplexT28C1SummaryVerdict;
}): PSimplexT28C1FalsifierRow[] {
  const vRowsMissing = args.vMetricRows.some((row) => row.vSupportStatus === 'ineligible-missing-v-rows');
  const kRowsMissing = args.kMetricRows.some((row) => row.kSupportStatus === 'ineligible-missing-k-rows');
  const l4Counted = args.vMetricRows.some((row) => row.vAxisRowIds.some((rowId) => rowId.includes(':L4')));
  const kernelArtifactOnly = args.kMetricRows.some((row) => row.kernelArtifactOnlyDifferentiationCount > 0);

  return [
    falsifierRow(
      'F1',
      'ATD-H0 is treated as accepted prior object.',
      args.candidateRow.priorAcceptedObject,
      `priorAcceptedObject=${args.candidateRow.priorAcceptedObject}.`,
    ),
    falsifierRow(
      'F2',
      'ACTS-v0 or corridor language appears as accepted feature.',
      false,
      'ACTS-v0 is not implemented; corridor appears only in negative maturity/boundary fields.',
    ),
    falsifierRow(
      'F3',
      'P-channel contributes positive support.',
      args.pQuarantineRow.pLeakDetected || args.pQuarantineRow.pChannelIncludedInScore,
      `pChannelIncludedInScore=${args.pQuarantineRow.pChannelIncludedInScore}; pLeakDetected=${args.pQuarantineRow.pLeakDetected}.`,
    ),
    falsifierRow(
      'F4',
      'S-channel contributes positive support.',
      args.sGuardRows.some((row) => row.sCanScorePositiveEvidence),
      'All S guard rows set sCanScorePositiveEvidence=false.',
    ),
    falsifierRow(
      'F5',
      'G-channel contributes spatial propagation support.',
      args.gGuardRows.some((row) => row.spatialPropagationClaim || row.gCanScorePositiveEvidence),
      'All G guard rows set spatialPropagationClaim=false and gCanScorePositiveEvidence=false.',
    ),
    falsifierRow(
      'F6',
      'Any route/gate/corridor/topology/FieldCue/runtime maturity is claimed.',
      args.candidateRow.priorAcceptedObject || args.candidateRow.maturityStatus !== 'pre-feature-only',
      `candidate maturityStatus=${args.candidateRow.maturityStatus}.`,
    ),
    falsifierRow(
      'F7',
      'V rows are missing or only vocabulary-mapped without computed source rows.',
      vRowsMissing,
      `${args.vMetricRows.filter((row) => row.vSupportStatus !== 'ineligible-missing-v-rows').length}/3 V metric rows have required computed source rows.`,
    ),
    falsifierRow(
      'F8',
      'K rows are missing or only vocabulary-mapped without computed sample rows.',
      kRowsMissing,
      `${args.kMetricRows.filter((row) => row.kSupportStatus !== 'ineligible-missing-k-rows').length}/3 K metric rows have required computed sample rows.`,
    ),
    falsifierRow(
      'F9',
      'L4 child-only amputation control is counted as V-axis evidence.',
      l4Counted,
      `Excluded L4 rows: ${args.vMetricRows.reduce((sum, row) => sum + row.l4AxisRowsExcludedCount, 0)}.`,
    ),
    falsifierRow(
      'F10',
      'Kernel artifact risk alone is counted as K-transverse differentiation.',
      kernelArtifactOnly,
      `Kernel-artifact-only differentiation rows: ${args.kMetricRows.reduce((sum, row) => sum + row.kernelArtifactOnlyDifferentiationCount, 0)}.`,
    ),
    falsifierRow(
      'F11',
      'A pair survives with vScore = 0 or kScore = 0.',
      args.pairSurvivalRows.some((row) => row.pairSurvivalVerdict === 'pair-survives' && (row.vScore === 0 || row.kScore === 0)),
      `${args.pairSurvivalRows.filter((row) => row.pairSurvivalVerdict === 'pair-survives').length} pair-survives rows.`,
    ),
    falsifierRow(
      'F12',
      'Global class survival is declared with fewer than 2 surviving pairs.',
      args.summaryVerdict === 'ATD-H0-class-survives-pre-feature' && args.globalSummary.survivingPairCount < 2,
      `survivingPairCount=${args.globalSummary.survivingPairCount}; summaryVerdict=${args.summaryVerdict}.`,
    ),
    falsifierRow(
      'F13',
      'S preload alone explains the result but is not classified as preload-only failure.',
      args.globalSummary.interpretation === 'preload-or-single-channel-only' &&
        args.summaryVerdict !== 'ATD-H0-fails-preload-or-single-channel-only',
      `interpretation=${args.globalSummary.interpretation}; summaryVerdict=${args.summaryVerdict}.`,
    ),
    falsifierRow(
      'F14',
      'G boundary leak: A3 closed response, body response, spatial propagation, or FieldCue.',
      args.gGuardRows.some((row) => row.gGuardStatus === 'fail-closed-response-leak' || row.gGuardStatus === 'fail-spatial-propagation-leak'),
      `${args.gGuardRows.filter((row) => row.gGuardStatus === 'pass').length}/3 G guard rows pass.`,
    ),
    falsifierRow(
      'F15',
      'Summary verdict uses forbidden mature feature language.',
      forbiddenMatureVerdict(args.summaryVerdict),
      `summaryVerdict=${args.summaryVerdict}.`,
    ),
  ];
}

function buildIntegrityIssues(args: {
  candidateRow: PSimplexT28C1CandidateRow;
  parentEvidenceRows: readonly PSimplexT28C1ParentEvidenceRow[];
  axisPairRows: readonly PSimplexT28C1AxisPairRow[];
  sGuardRows: readonly PSimplexT28C1SGuardRow[];
  gGuardRows: readonly PSimplexT28C1GGuardRow[];
  pQuarantineRow: PSimplexT28C1PQuarantineRow;
  vMetricRows: readonly PSimplexT28C1VMetricRow[];
  kMetricRows: readonly PSimplexT28C1KMetricRow[];
  pairSurvivalRows: readonly PSimplexT28C1PairSurvivalRow[];
  boundaryRows: readonly PSimplexT28C1BoundaryRow[];
  falsifierRows: readonly PSimplexT28C1FalsifierRow[];
  globalSummary: PSimplexT28C1GlobalSummary;
  summaryVerdict: PSimplexT28C1SummaryVerdict;
}): string[] {
  const issues: string[] = [];

  if (args.candidateRow.candidateId !== 'ATD-H0') {
    issues.push('Missing required ATD-H0 candidate row.');
  }

  if (args.parentEvidenceRows.length !== 6) {
    issues.push(`Expected 6 parent evidence rows, got ${args.parentEvidenceRows.length}.`);
  }

  if (args.axisPairRows.length !== 3 || args.pairSurvivalRows.length !== 3) {
    issues.push('Missing one of the three required axis pairs.');
  }

  if (
    args.summaryVerdict !== 'ATD-H0-ineligible-missing-required-evidence' &&
    (args.sGuardRows.length !== 3 ||
      args.gGuardRows.length !== 3 ||
      args.vMetricRows.some((row) => row.vSupportStatus === 'ineligible-missing-v-rows') ||
      args.kMetricRows.some((row) => row.kSupportStatus === 'ineligible-missing-k-rows'))
  ) {
    issues.push('Missing S/G/V/K rows without ineligible verdict.');
  }

  if (forbiddenMatureVerdict(args.summaryVerdict)) {
    issues.push('Forbidden mature verdict string used.');
  }

  if (args.candidateRow.priorAcceptedObject || args.candidateRow.maturityStatus !== 'pre-feature-only') {
    issues.push('Report uses forbidden candidate maturity.');
  }

  if (args.pairSurvivalRows.some((row) => row.pairCanMatureBeyondPreFeature)) {
    issues.push('At least one pairCanMatureBeyondPreFeature field is true.');
  }

  if (
    args.pQuarantineRow.pLeakDetected &&
    args.summaryVerdict !== 'ATD-H0-fails-boundary-collapse'
  ) {
    issues.push('P leak detected but summaryVerdict is not boundary-collapse failure.');
  }

  if (
    args.summaryVerdict === 'ATD-H0-class-survives-pre-feature' &&
    args.globalSummary.survivingPairCount < 2
  ) {
    issues.push('Global class survival declared with fewer than 2 surviving pairs.');
  }

  if (args.vMetricRows.some((row) => row.vAxisRowIds.some((rowId) => rowId.includes(':L4')))) {
    issues.push('L4 rows counted in V-axis evidence.');
  }

  if (args.kMetricRows.some((row) => row.kernelArtifactOnlyDifferentiationCount > 0)) {
    issues.push('Kernel artifact risk alone counted as K-transverse differentiation.');
  }

  if (args.boundaryRows.length !== 15 || args.boundaryRows.some((row) => !row.enforced)) {
    issues.push('Missing one or more required boundary rows.');
  }

  const triggeredFalsifiers = args.falsifierRows.filter((row) => row.triggered);

  if (
    triggeredFalsifiers.length > 0 &&
    ![
      'ATD-H0-ineligible-missing-required-evidence',
      'ATD-H0-fails-boundary-collapse',
      'ATD-H0-fails-preload-or-single-channel-only',
      'ATD-H0-fails-no-cross-channel-discrimination',
    ].includes(args.summaryVerdict)
  ) {
    issues.push('Triggered falsifier did not produce an ineligible or failure verdict.');
  }

  return unique(issues);
}

function pairBodyShadowMarginStatus(
  leftWitness: unknown,
  rightWitness: unknown,
): PSimplexT28C1GGuardRow['bodyShadowMarginStatus'] {
  if (!isRecord(leftWitness) || !isRecord(rightWitness)) {
    return 'missing';
  }

  return stringField(leftWitness, 'bodyShadowMarginStatus') === 'positive-margin' &&
    stringField(rightWitness, 'bodyShadowMarginStatus') === 'positive-margin'
    ? 'positive-margin'
    : 'nonpositive-margin';
}

function pairAntipodalCovarianceStatus(
  pairRow: unknown,
  leftWitness: unknown,
  rightWitness: unknown,
): PSimplexT28C1GGuardRow['antipodalCovarianceStatus'] {
  if (!isRecord(pairRow) && (!isRecord(leftWitness) || !isRecord(rightWitness))) {
    return 'missing';
  }

  if (stringField(pairRow, 'inheritedT27CovarianceStatus') === 'holds-by-signed-symmetry') {
    return 'holds-by-signed-symmetry';
  }

  if (
    stringField(leftWitness, 'antipodalCovarianceStatus') === 'holds-by-signed-symmetry' &&
    stringField(rightWitness, 'antipodalCovarianceStatus') === 'holds-by-signed-symmetry'
  ) {
    return 'holds-by-signed-symmetry';
  }

  return 'fails';
}

function pairExactGermContrastStatus(
  leftWitness: unknown,
  rightWitness: unknown,
): PSimplexT28C1GGuardRow['exactGermContrastStatus'] {
  if (!isRecord(leftWitness) || !isRecord(rightWitness)) {
    return 'missing';
  }

  return stringField(leftWitness, 'exactGermContrastStatus') === 'exact-site-axis-only-vs-declared-A3-germ' &&
    stringField(rightWitness, 'exactGermContrastStatus') === 'exact-site-axis-only-vs-declared-A3-germ'
    ? 'exact-site-axis-only-vs-declared-A3-germ'
    : 'missing-exact-germ-contrast';
}

function pairMatches(row: unknown, leftChild: PSimplexT28C1ChildId, rightChild: PSimplexT28C1ChildId): boolean {
  return (
    (stringField(row, 'leftChild') === leftChild && stringField(row, 'rightChild') === rightChild) ||
    (stringField(row, 'leftChild') === rightChild && stringField(row, 'rightChild') === leftChild)
  );
}

function axisStatusLegible(value: string | undefined): boolean {
  return AXIS_LEGIBLE_STATUSES.includes(value as (typeof AXIS_LEGIBLE_STATUSES)[number]);
}

function vTransverseWeight(value: string | undefined): number {
  if (value === 'axis-bent' || value === 'threshold-sensitive') {
    return 1;
  }

  if (value === 'axis-cancelled' || value === 'axis-flipped') {
    return 0.5;
  }

  return 0;
}

function kAxisRowLegible(row: JoinedKRow): boolean {
  return (
    row.complete &&
    booleanField(row.vector, 'cleanReadingAllowed') === true &&
    axisStatusLegible(stringField(row.vector, 'readabilityStatus')) &&
    booleanField(row.audit, 'kernelArtifactRisk') === false
  );
}

interface JoinedKRow {
  sample: unknown;
  vector: unknown;
  audit: unknown;
  complete: boolean;
}

interface KTransverseDifferentiation {
  differentiated: boolean;
  kernelArtifactOnly: boolean;
}

function joinKSample(sample: unknown, vectorRows: readonly unknown[], auditRows: readonly unknown[]): JoinedKRow {
  const sampleId = stringField(sample, 'sampleId');
  const vector = vectorRows.find((row) => stringField(row, 'sampleId') === sampleId);
  const audit = auditRows.find((row) => stringField(row, 'sampleId') === sampleId);

  return {
    sample,
    vector,
    audit,
    complete: isRecord(sample) && isRecord(vector) && isRecord(audit),
  };
}

function kTransverseDifferentiation(row: JoinedKRow): KTransverseDifferentiation {
  const status = stringField(row.vector, 'status') ?? '';
  const readabilityStatus = stringField(row.vector, 'readabilityStatus') ?? '';
  const suppressionReason = stringField(row.vector, 'suppressionReason') ?? '';
  const localitySensitive = booleanField(row.audit, 'localitySensitive') === true;
  const kernelRisk = booleanField(row.audit, 'kernelArtifactRisk') === true;
  const cleanReadingBlocked = booleanField(row.vector, 'cleanReadingAllowed') === false;
  const transverseResidualMagnitude = numberField(row.vector, 'transverseResidualMagnitude') ?? 0;
  const explicitNonKernelReasons = [
    suppressionReason.length > 0,
    K_TRANSVERSE_DIFFERENTIATED_STATUSES.includes(status as (typeof K_TRANSVERSE_DIFFERENTIATED_STATUSES)[number]),
    K_TRANSVERSE_DIFFERENTIATED_STATUSES.includes(
      readabilityStatus as (typeof K_TRANSVERSE_DIFFERENTIATED_STATUSES)[number],
    ),
    localitySensitive,
    transverseResidualMagnitude > 1e-9,
  ];
  const hasExplicitNonKernelReason = explicitNonKernelReasons.some(Boolean);
  const cleanReadingBlockedCounts = cleanReadingBlocked && !kernelRisk;
  const hasNonKernelReason = cleanReadingBlockedCounts || hasExplicitNonKernelReason;

  return {
    differentiated: row.complete && hasNonKernelReason,
    kernelArtifactOnly: row.complete && kernelRisk && cleanReadingBlocked && !hasExplicitNonKernelReason,
  };
}

function scoreFor(axisLegibleRate: number, transverseDifferentiationRate: number): 0 | 1 | 2 {
  if (axisLegibleRate >= 0.75 && transverseDifferentiationRate >= 0.5) {
    return 2;
  }

  if (axisLegibleRate >= 0.5 && transverseDifferentiationRate > 0) {
    return 1;
  }

  return 0;
}

function supportStatusFor(score: 0 | 1 | 2): PSimplexT28C1SupportStatus {
  if (score === 2) {
    return 'strong';
  }

  return score === 1 ? 'weak' : 'none';
}

function rate(numerator: number, denominator: number): number {
  return denominator > 0 ? cleanNumber(numerator / denominator) : 0;
}

function cleanNumber(value: number): number {
  if (Math.abs(value) <= 1e-12) {
    return 0;
  }

  return Number(value.toFixed(12));
}

function countPairs(rows: readonly PSimplexT28C1PairSurvivalRow[], verdict: PSimplexT28C1PairSurvivalVerdict): number {
  return rows.filter((row) => row.pairSurvivalVerdict === verdict).length;
}

function requiredParentEvidenceFails(parentRows: readonly PSimplexT28C1ParentEvidenceRow[]): boolean {
  return parentRows.some((row) => row.parentId !== 'S-structural-channel' && !row.ok);
}

function numericIssueCount(report: unknown): number {
  return numberField(report, 'integrityIssueCount') ?? numberField(report, 'issueCount') ?? 0;
}

function normalizeAxisPairId(value: string | undefined): string | undefined {
  return value?.replace(/^axis:/u, '');
}

function edgeId(childId: PSimplexT28C1ChildId): string {
  return childId.replace(/^M_/u, '');
}

function requirePairRow<T extends { axisPairId: PSimplexT28C1AxisPairId }>(
  rows: readonly T[],
  axisPairId: PSimplexT28C1AxisPairId,
): T {
  const row = rows.find((entry) => entry.axisPairId === axisPairId);

  if (!row) {
    throw new Error(`Missing T28-C1 pair row ${axisPairId}`);
  }

  return row;
}

function boundaryRow(boundaryId: PSimplexT28C1BoundaryRow['boundaryId'], statement: string): PSimplexT28C1BoundaryRow {
  return {
    boundaryId,
    statement,
    enforced: true,
  };
}

function falsifierRow(
  falsifierId: PSimplexT28C1FalsifierRow['falsifierId'],
  description: string,
  triggered: boolean,
  evidence: string,
): PSimplexT28C1FalsifierRow {
  return {
    falsifierId,
    description,
    triggered,
    evidence,
    status: triggered ? 'triggered' : 'clear',
  };
}

function forbiddenMatureVerdict(summaryVerdict: string): boolean {
  return [
    'route-confirmed',
    'gate-confirmed',
    'corridor-confirmed',
    'fieldworld-feature-confirmed',
    'fieldcue-ready',
    'generated-site-reading-ready',
    'topology-authorized',
    'runtime-authorized',
  ].includes(summaryVerdict);
}

function arrayField(value: unknown, key: string): unknown[] {
  if (!isRecord(value)) {
    return [];
  }

  const field = value[key];

  return Array.isArray(field) ? field : [];
}

function stringArrayField(value: unknown, key: string): string[] {
  return arrayField(value, key).filter((entry): entry is string => typeof entry === 'string');
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

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}

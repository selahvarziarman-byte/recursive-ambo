import {
  EPSILON,
  addVec3,
  buildPSimplexVectorOrderParameterDiagnosticV0Report,
  dotVec3,
  normVec3,
  normalizeVec3,
  scaleVec3,
  subVec3,
  sumVec3,
  type PSimplexChildEdgeId,
  type PSimplexChildSourceId,
  type PSimplexPrimalSourceId,
  type PSimplexVec3,
} from './pSimplexVectorOrderParameterDiagnosticV0';

export type PSimplexLocalityStatus =
  | 'axis-preserved'
  | 'axis-flipped'
  | 'axis-cancelled'
  | 'axis-bent'
  | 'mixed-axis'
  | 'neutral-by-symmetry'
  | 'locality-sensitive'
  | 'source-population-amputated-control';
export type PSimplexLocalityVerdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexLocalityRecommendation =
  | 'declare-stricter-kernel-locality-before-geometry-sampling'
  | 'proceed-to-geometry-sampling-with-locality-policy'
  | 'redesign-locality-diagnostic';

export interface PSimplexLocalityScenarioRowV0 {
  scenarioId: string;
  scenarioName: string;
  gamma0: 0;
  gamma1: 1;
  kernelPattern: string;
  expectedStatuses: PSimplexLocalityStatus[];
  testedChildCount: number;
  axisPreservedCount: number;
  axisBentCount: number;
  mixedAxisCount: number;
  axisFlippedCount: number;
  axisCancelledCount: number;
  thresholdSensitiveCount: number;
  ok: boolean;
}

export interface PSimplexLocalityChildRowV0 {
  scenarioId: string;
  scenarioName: string;
  childSite: PSimplexChildSourceId;
  primaryAxis: PSimplexVec3;
  primaryEndpointOrder: [PSimplexPrimalSourceId, PSimplexPrimalSourceId];
  complementChild: PSimplexChildSourceId;
  siblingsSharingFirstEndpoint: PSimplexChildSourceId[];
  siblingsSharingSecondEndpoint: PSimplexChildSourceId[];
  highSibling?: PSimplexChildSourceId;
  activeKernelWeights: Partial<Record<PSimplexChildSourceId, number>>;
  phi: PSimplexVec3;
  magnitude: number;
  normalizedDirection: PSimplexVec3 | null;
  axisProjection: number;
  orthogonalResidual: PSimplexVec3;
  orthogonalResidualMagnitude: number;
  axisAlignmentScore: number;
  axisBendDirection: PSimplexVec3 | null;
  status: PSimplexLocalityStatus;
  thresholdSensitive: boolean;
  expectedStatuses: PSimplexLocalityStatus[];
  expectedStatusMatched: boolean;
  ok: boolean;
  notes: string;
}

export interface PSimplexAxisAlignmentSummaryV0 {
  totalRows: number;
  axisPreservedCount: number;
  axisBentCount: number;
  mixedAxisCount: number;
  axisFlippedCount: number;
  axisCancelledCount: number;
  thresholdSensitiveCount: number;
}

export interface PSimplexLocalityPolicyConsequenceRowV0 {
  consequenceId: string;
  status: PSimplexLocalityStatus;
  observation: string;
  evidence: string;
  recommendation: PSimplexLocalityRecommendation;
}

export interface PSimplexVectorOrderParameterLocalityDiagnosticV0Report {
  method: 'p-simplex-vector-order-parameter-locality-diagnostic-v0';
  candidatePackage: 'p-simplex-v0.2';
  parentDiagnostic: 'p-simplex-vector-order-parameter-diagnostic-v0';
  diagnosticScope: 'asymmetric-sibling-locality-vector-order-parameter-only';
  vectorCarrierStatus: 'r3-vector-order-parameter';
  solverStatus: 'not-lg-solver';
  geometrySamplingStatus: 'not-geometry-rendering-or-position-sampling';
  semanticStatus: 'not-semantic-naming';
  fieldCueStatus: 'not-field-cue';
  routeStatus: 'no-route-walk-holonomy';
  sourcePopulationPolicy: 'accumulated-sources-s-leq-1';
  epsilon: number;
  preservedAlignmentThreshold: number;
  bentAlignmentMin: number;
  parentDiagnosticStillPasses: boolean;
  activeSourceCount: 10;
  scenarioRows: PSimplexLocalityScenarioRowV0[];
  perChildLocalityRows: PSimplexLocalityChildRowV0[];
  axisAlignmentSummary: PSimplexAxisAlignmentSummaryV0;
  axisSurvivalRows: PSimplexLocalityChildRowV0[];
  axisBentRows: PSimplexLocalityChildRowV0[];
  axisFlipOrCancelRows: PSimplexLocalityChildRowV0[];
  localityPolicyConsequences: PSimplexLocalityPolicyConsequenceRowV0[];
  finalRecommendation: PSimplexLocalityRecommendation;
  verdict: PSimplexLocalityVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface ChildSourceRecord {
  sourceId: PSimplexChildSourceId;
  parentEdge: PSimplexChildEdgeId;
  endpoints: [PSimplexPrimalSourceId, PSimplexPrimalSourceId];
  complementEdge: PSimplexChildEdgeId;
  antipodalPartner: PSimplexChildSourceId;
  q: PSimplexVec3;
  primaryAxis: PSimplexVec3;
}

interface ScenarioSpec {
  scenarioId: string;
  scenarioName: string;
  kernelPattern: string;
  expectedStatuses: PSimplexLocalityStatus[];
  buildWeights: (child: ChildSourceRecord, children: ChildSourceRecord[]) => Partial<Record<PSimplexChildSourceId, number>>;
  notes: string;
}

const PRESERVED_ALIGNMENT_THRESHOLD = 0.9;
const BENT_ALIGNMENT_MIN = 0.5;
const THRESHOLD_SENSITIVITY_WINDOW = 0.05;
const CHILD_ORDER: readonly PSimplexChildSourceId[] = ['M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];

export function buildPSimplexVectorOrderParameterLocalityDiagnosticV0Report(): PSimplexVectorOrderParameterLocalityDiagnosticV0Report {
  const parentReport = buildPSimplexVectorOrderParameterDiagnosticV0Report();
  const structuralIssues: string[] = [];
  const childSources = deriveChildSources(parentReport.sourceLedgerRows, structuralIssues);
  const scenarioSpecs = buildScenarioSpecs();
  const perChildLocalityRows =
    structuralIssues.length === 0
      ? scenarioSpecs.flatMap((scenario) =>
          childSources.map((child) => buildLocalityRow(child, childSources, scenario)),
        )
      : [];
  const axisAlignmentSummary = buildAxisAlignmentSummary(perChildLocalityRows);
  const scenarioRows = buildScenarioRows(scenarioSpecs, perChildLocalityRows, childSources.length);
  const axisSurvivalRows = perChildLocalityRows.filter((row) => row.status === 'axis-preserved');
  const axisBentRows = perChildLocalityRows.filter((row) => row.status === 'axis-bent' || row.status === 'mixed-axis');
  const axisFlipOrCancelRows = perChildLocalityRows.filter(
    (row) => row.status === 'axis-flipped' || row.status === 'axis-cancelled',
  );
  const localityPolicyConsequences = buildLocalityPolicyConsequences(perChildLocalityRows, axisAlignmentSummary);
  const finalRecommendation = chooseFinalRecommendation(axisAlignmentSummary, structuralIssues);
  const integrityIssues = buildIntegrityIssues({
    structuralIssues,
    parentDiagnosticStillPasses: parentReport.ok && parentReport.integrityIssueCount === 0,
    activeSourceCount: parentReport.activeSourceCount,
    childSources,
    scenarioRows,
    perChildLocalityRows,
    axisAlignmentSummary,
    finalRecommendation,
  });
  const verdict = classifyVerdict(integrityIssues, perChildLocalityRows, axisAlignmentSummary);

  return {
    method: 'p-simplex-vector-order-parameter-locality-diagnostic-v0',
    candidatePackage: 'p-simplex-v0.2',
    parentDiagnostic: 'p-simplex-vector-order-parameter-diagnostic-v0',
    diagnosticScope: 'asymmetric-sibling-locality-vector-order-parameter-only',
    vectorCarrierStatus: 'r3-vector-order-parameter',
    solverStatus: 'not-lg-solver',
    geometrySamplingStatus: 'not-geometry-rendering-or-position-sampling',
    semanticStatus: 'not-semantic-naming',
    fieldCueStatus: 'not-field-cue',
    routeStatus: 'no-route-walk-holonomy',
    sourcePopulationPolicy: 'accumulated-sources-s-leq-1',
    epsilon: EPSILON,
    preservedAlignmentThreshold: PRESERVED_ALIGNMENT_THRESHOLD,
    bentAlignmentMin: BENT_ALIGNMENT_MIN,
    parentDiagnosticStillPasses: parentReport.ok && parentReport.integrityIssueCount === 0,
    activeSourceCount: parentReport.activeSourceCount as 10,
    scenarioRows,
    perChildLocalityRows,
    axisAlignmentSummary,
    axisSurvivalRows,
    axisBentRows,
    axisFlipOrCancelRows,
    localityPolicyConsequences,
    finalRecommendation,
    verdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: integrityIssues.length === 0,
  };
}

function buildScenarioSpecs(): ScenarioSpec[] {
  return [
    {
      scenarioId: 'S0',
      scenarioName: 'symmetric sibling cancellation control',
      kernelPattern: 'K_primary=1; K_all_siblings=1; K_complement=0',
      expectedStatuses: ['axis-preserved'],
      buildWeights: (child, children) => {
        const weights = withWeight(child.sourceId, 1);

        for (const sibling of siblingsForChild(child, children)) {
          addWeight(weights, sibling.sourceId, 1);
        }

        return weights;
      },
      notes: 'Symmetric one-endpoint sibling terms are expected to cancel pairwise in the internal source fixture.',
    },
    {
      scenarioId: 'S1',
      scenarioName: 'one sibling high',
      kernelPattern: 'K_primary=1; K_first_sibling=1; all_other_children=0',
      expectedStatuses: ['axis-bent', 'mixed-axis'],
      buildWeights: (child, children) => {
        const firstSibling = firstByChildOrder(siblingsForChild(child, children));

        return withWeights([
          [child.sourceId, 1],
          [firstSibling.sourceId, 1],
        ]);
      },
      notes: 'A single high sibling adds a non-primary child axis to the vector sum.',
    },
    {
      scenarioId: 'S2',
      scenarioName: 'same-parent sibling pair high',
      kernelPattern: 'K_primary=1; K_siblings_sharing_first_endpoint=1; all_other_children=0',
      expectedStatuses: ['axis-bent', 'mixed-axis'],
      buildWeights: (child, children) =>
        withWeights([
          [child.sourceId, 1],
          ...siblingsSharingEndpoint(child, children, child.endpoints[0]).map((sibling) => [sibling.sourceId, 1] as const),
        ]),
      notes: 'Both high sibling children sharing the first endpoint add two non-primary child axes.',
    },
    {
      scenarioId: 'S3',
      scenarioName: 'opposite-endpoint sibling pair high',
      kernelPattern: 'K_primary=1; K_siblings_sharing_second_endpoint=1; all_other_children=0',
      expectedStatuses: ['axis-bent', 'mixed-axis'],
      buildWeights: (child, children) =>
        withWeights([
          [child.sourceId, 1],
          ...siblingsSharingEndpoint(child, children, child.endpoints[1]).map((sibling) => [sibling.sourceId, 1] as const),
        ]),
      notes: 'Both high sibling children sharing the second endpoint add two non-primary child axes.',
    },
    ...[0.5, 1, 2].map((lambda): ScenarioSpec => ({
      scenarioId: `S4-lambda-${formatScenarioNumber(lambda)}`,
      scenarioName: `complement child high lambda ${formatReportNumber(lambda)}`,
      kernelPattern: `K_primary=1; K_complement=${formatReportNumber(lambda)}; K_siblings=0`,
      expectedStatuses:
        lambda < 1 ? ['axis-preserved'] : lambda === 1 ? ['axis-cancelled'] : ['axis-flipped'],
      buildWeights: (child, children) => {
        const complement = requireChild(children, child.antipodalPartner);

        return withWeights([
          [child.sourceId, 1],
          [complement.sourceId, lambda],
        ]);
      },
      notes: 'Complement-only weighting remains collinear with the primary axis and changes sign at lambda greater than one.',
    })),
    {
      scenarioId: 'S5',
      scenarioName: 'mixed asymmetric local kernel',
      kernelPattern: 'K_primary=1; K_first_sibling=0.75; K_complement=0.50; K_second_sibling=0.25',
      expectedStatuses: ['axis-preserved', 'axis-bent', 'mixed-axis', 'axis-flipped', 'axis-cancelled'],
      buildWeights: (child, children) => {
        const firstSibling = firstByChildOrder(siblingsSharingEndpoint(child, children, child.endpoints[0]));
        const secondSibling = firstByChildOrder(siblingsSharingEndpoint(child, children, child.endpoints[1]));
        const complement = requireChild(children, child.antipodalPartner);

        return withWeights([
          [child.sourceId, 1],
          [firstSibling.sourceId, 0.75],
          [complement.sourceId, 0.5],
          [secondSibling.sourceId, 0.25],
        ]);
      },
      notes: 'A finite mixed asymmetric child-only kernel tests whether local generated children pull the vector away from the primary axis.',
    },
  ];
}

function buildLocalityRow(
  child: ChildSourceRecord,
  children: ChildSourceRecord[],
  scenario: ScenarioSpec,
): PSimplexLocalityChildRowV0 {
  const activeKernelWeights = scenario.buildWeights(child, children);
  const phi = sumVec3(
    children.map((candidate) => scaleVec3(candidate.q, activeKernelWeights[candidate.sourceId] ?? 0)),
  );
  const magnitude = normVec3(phi);
  const normalizedDirection = normalizeVec3(phi);
  const axisProjection = dotVec3(phi, child.primaryAxis);
  const projectedOntoPrimaryAxis = scaleVec3(child.primaryAxis, axisProjection);
  const orthogonalResidual = subVec3(phi, projectedOntoPrimaryAxis);
  const orthogonalResidualMagnitude = normVec3(orthogonalResidual);
  const axisBendDirection = normalizeVec3(orthogonalResidual);
  const axisAlignmentScore = magnitude > EPSILON ? Math.abs(axisProjection) / magnitude : 0;
  const status = classifyLocalityStatus(magnitude, axisProjection, axisAlignmentScore);
  const thresholdSensitive = isThresholdSensitive(axisAlignmentScore, magnitude);
  const siblingsFirst = siblingsSharingEndpoint(child, children, child.endpoints[0]).map((sibling) => sibling.sourceId);
  const siblingsSecond = siblingsSharingEndpoint(child, children, child.endpoints[1]).map((sibling) => sibling.sourceId);
  const highSibling = firstHighSibling(child, activeKernelWeights);
  const expectedStatusMatched = scenario.expectedStatuses.includes(status);

  return {
    scenarioId: scenario.scenarioId,
    scenarioName: scenario.scenarioName,
    childSite: child.sourceId,
    primaryAxis: cleanVec3(child.primaryAxis),
    primaryEndpointOrder: child.endpoints,
    complementChild: child.antipodalPartner,
    siblingsSharingFirstEndpoint: siblingsFirst,
    siblingsSharingSecondEndpoint: siblingsSecond,
    highSibling,
    activeKernelWeights: cleanWeights(activeKernelWeights),
    phi: cleanVec3(phi),
    magnitude: cleanNumber(magnitude),
    normalizedDirection: normalizedDirection ? cleanVec3(normalizedDirection) : null,
    axisProjection: cleanNumber(axisProjection),
    orthogonalResidual: cleanVec3(orthogonalResidual),
    orthogonalResidualMagnitude: cleanNumber(orthogonalResidualMagnitude),
    axisAlignmentScore: cleanNumber(axisAlignmentScore),
    axisBendDirection: axisBendDirection ? cleanVec3(axisBendDirection) : null,
    status,
    thresholdSensitive,
    expectedStatuses: scenario.expectedStatuses,
    expectedStatusMatched,
    ok: expectedStatusMatched && isFiniteVector(phi),
    notes: scenario.notes,
  };
}

function deriveChildSources(
  sourceLedgerRows: ReturnType<typeof buildPSimplexVectorOrderParameterDiagnosticV0Report>['sourceLedgerRows'],
  structuralIssues: string[],
): ChildSourceRecord[] {
  const childRows = sourceLedgerRows.filter((row) => row.sourceKind === 'child');
  const childSources = childRows.flatMap((row): ChildSourceRecord[] => {
    if (
      !isChildSourceId(row.sourceId) ||
      !row.parentEdge ||
      !row.endpoints ||
      !row.complementEdge ||
      !row.antipodalPartner
    ) {
      structuralIssues.push(`Child source ledger row ${row.sourceId} is missing required locality metadata.`);
      return [];
    }

    const primaryAxis = normalizeVec3(row.q);

    if (!primaryAxis) {
      structuralIssues.push(`Child source ${row.sourceId} has a zero vector and cannot define a primary axis.`);
      return [];
    }

    return [
      {
        sourceId: row.sourceId,
        parentEdge: row.parentEdge,
        endpoints: row.endpoints,
        complementEdge: row.complementEdge,
        antipodalPartner: row.antipodalPartner,
        q: row.q,
        primaryAxis,
      },
    ];
  });
  const sortedSources = childSources.sort(
    (left, right) => CHILD_ORDER.indexOf(left.sourceId) - CHILD_ORDER.indexOf(right.sourceId),
  );

  for (const childId of CHILD_ORDER) {
    if (!sortedSources.some((source) => source.sourceId === childId)) {
      structuralIssues.push(`Missing expected child source ${childId}.`);
    }
  }

  return sortedSources;
}

function buildScenarioRows(
  scenarioSpecs: ScenarioSpec[],
  rows: PSimplexLocalityChildRowV0[],
  childCount: number,
): PSimplexLocalityScenarioRowV0[] {
  return scenarioSpecs.map((scenario) => {
    const scenarioRows = rows.filter((row) => row.scenarioId === scenario.scenarioId);
    const summary = buildAxisAlignmentSummary(scenarioRows);

    return {
      scenarioId: scenario.scenarioId,
      scenarioName: scenario.scenarioName,
      gamma0: 0,
      gamma1: 1,
      kernelPattern: scenario.kernelPattern,
      expectedStatuses: scenario.expectedStatuses,
      testedChildCount: scenarioRows.length,
      axisPreservedCount: summary.axisPreservedCount,
      axisBentCount: summary.axisBentCount,
      mixedAxisCount: summary.mixedAxisCount,
      axisFlippedCount: summary.axisFlippedCount,
      axisCancelledCount: summary.axisCancelledCount,
      thresholdSensitiveCount: summary.thresholdSensitiveCount,
      ok: scenarioRows.length === childCount && scenarioRows.every((row) => row.ok),
    };
  });
}

function buildAxisAlignmentSummary(rows: PSimplexLocalityChildRowV0[]): PSimplexAxisAlignmentSummaryV0 {
  return {
    totalRows: rows.length,
    axisPreservedCount: rows.filter((row) => row.status === 'axis-preserved').length,
    axisBentCount: rows.filter((row) => row.status === 'axis-bent').length,
    mixedAxisCount: rows.filter((row) => row.status === 'mixed-axis').length,
    axisFlippedCount: rows.filter((row) => row.status === 'axis-flipped').length,
    axisCancelledCount: rows.filter((row) => row.status === 'axis-cancelled').length,
    thresholdSensitiveCount: rows.filter((row) => row.thresholdSensitive).length,
  };
}

function buildLocalityPolicyConsequences(
  rows: PSimplexLocalityChildRowV0[],
  summary: PSimplexAxisAlignmentSummaryV0,
): PSimplexLocalityPolicyConsequenceRowV0[] {
  return [
    {
      consequenceId: 'C0',
      status: 'axis-preserved',
      observation: 'Symmetric sibling contamination cancels pairwise and preserves axes.',
      evidence: scenarioEvidence(rows, 'S0'),
      recommendation: 'proceed-to-geometry-sampling-with-locality-policy',
    },
    {
      consequenceId: 'C1',
      status: 'axis-bent',
      observation: 'One-sibling-high contamination bends axes.',
      evidence: scenarioEvidence(rows, 'S1'),
      recommendation: 'declare-stricter-kernel-locality-before-geometry-sampling',
    },
    {
      consequenceId: 'C2',
      status: 'axis-bent',
      observation: 'Same-parent sibling pair high bends axes.',
      evidence: scenarioEvidence(rows, 'S2'),
      recommendation: 'declare-stricter-kernel-locality-before-geometry-sampling',
    },
    {
      consequenceId: 'C3',
      status: 'axis-bent',
      observation: 'Opposite-endpoint sibling pair high bends axes.',
      evidence: scenarioEvidence(rows, 'S3'),
      recommendation: 'declare-stricter-kernel-locality-before-geometry-sampling',
    },
    {
      consequenceId: 'C4',
      status: 'locality-sensitive',
      observation: 'Complement-only boost stays on axis and can preserve, cancel, or flip.',
      evidence: [
        scenarioEvidence(rows, 'S4-lambda-0_5'),
        scenarioEvidence(rows, 'S4-lambda-1_0'),
        scenarioEvidence(rows, 'S4-lambda-2_0'),
      ].join(' '),
      recommendation: 'proceed-to-geometry-sampling-with-locality-policy',
    },
    {
      consequenceId: 'C5',
      status: 'locality-sensitive',
      observation: 'Mixed asymmetric kernels expose locality sensitivity.',
      evidence: scenarioEvidence(rows, 'S5'),
      recommendation: 'declare-stricter-kernel-locality-before-geometry-sampling',
    },
    {
      consequenceId: 'C6',
      status: 'locality-sensitive',
      observation: 'Graph or position sampling should wait until a kernel locality policy is declared.',
      evidence: `bentOrMixed=${summary.axisBentCount + summary.mixedAxisCount}/${summary.totalRows}`,
      recommendation: 'declare-stricter-kernel-locality-before-geometry-sampling',
    },
  ];
}

function buildIntegrityIssues(args: {
  structuralIssues: string[];
  parentDiagnosticStillPasses: boolean;
  activeSourceCount: number;
  childSources: ChildSourceRecord[];
  scenarioRows: PSimplexLocalityScenarioRowV0[];
  perChildLocalityRows: PSimplexLocalityChildRowV0[];
  axisAlignmentSummary: PSimplexAxisAlignmentSummaryV0;
  finalRecommendation: PSimplexLocalityRecommendation;
}): string[] {
  const issues = [...args.structuralIssues];

  if (!args.parentDiagnosticStillPasses) {
    issues.push('Parent v0.1 diagnostic did not pass.');
  }

  if (args.activeSourceCount !== 10) {
    issues.push(`Expected activeSourceCount=10 from parent diagnostic, got ${args.activeSourceCount}.`);
  }

  if (args.childSources.length !== 6) {
    issues.push(`Expected 6 child sources, got ${args.childSources.length}.`);
  }

  if (args.scenarioRows.length !== 8) {
    issues.push(`Expected 8 scenario rows, got ${args.scenarioRows.length}.`);
  }

  if (args.perChildLocalityRows.length !== 48) {
    issues.push(`Expected 48 per-child locality rows, got ${args.perChildLocalityRows.length}.`);
  }

  const s0Rows = rowsForScenario(args.perChildLocalityRows, 'S0');
  const s1Rows = rowsForScenario(args.perChildLocalityRows, 'S1');
  const s2Rows = rowsForScenario(args.perChildLocalityRows, 'S2');
  const s3Rows = rowsForScenario(args.perChildLocalityRows, 'S3');
  const s5Rows = rowsForScenario(args.perChildLocalityRows, 'S5');

  if (s0Rows.length !== 6 || s0Rows.some((row) => row.status !== 'axis-preserved')) {
    issues.push('S0 symmetric sibling control did not preserve all primary axes.');
  }

  for (const [scenarioId, rows] of [
    ['S1', s1Rows],
    ['S2', s2Rows],
    ['S3', s3Rows],
    ['S5', s5Rows],
  ] as const) {
    if (!rows.some((row) => row.status === 'axis-bent' || row.status === 'mixed-axis')) {
      issues.push(`${scenarioId} did not produce any bent or mixed-axis rows.`);
    }
  }

  if (!scenarioHasOnlyStatus(args.perChildLocalityRows, 'S4-lambda-0_5', 'axis-preserved')) {
    issues.push('S4 lambda 0.5 did not preserve all primary axes.');
  }

  if (!scenarioHasOnlyStatus(args.perChildLocalityRows, 'S4-lambda-1_0', 'axis-cancelled')) {
    issues.push('S4 lambda 1.0 did not cancel all primary axes.');
  }

  if (!scenarioHasOnlyStatus(args.perChildLocalityRows, 'S4-lambda-2_0', 'axis-flipped')) {
    issues.push('S4 lambda 2.0 did not flip all primary axes.');
  }

  if (args.scenarioRows.some((row) => !row.ok)) {
    issues.push('At least one scenario row did not match its finite expected status set.');
  }

  if (args.perChildLocalityRows.some((row) => !row.ok)) {
    issues.push('At least one per-child locality row failed its finite expected status set.');
  }

  if (
    args.axisAlignmentSummary.axisPreservedCount === 0 ||
    args.axisAlignmentSummary.axisBentCount === 0 ||
    args.axisAlignmentSummary.axisFlippedCount === 0 ||
    args.axisAlignmentSummary.axisCancelledCount === 0
  ) {
    issues.push('Report did not exercise preserved, bent, flipped, and cancelled classifications.');
  }

  if (args.finalRecommendation !== 'declare-stricter-kernel-locality-before-geometry-sampling') {
    issues.push(`Unexpected final locality recommendation: ${args.finalRecommendation}.`);
  }

  return [...new Set(issues)];
}

function classifyVerdict(
  integrityIssues: string[],
  rows: PSimplexLocalityChildRowV0[],
  summary: PSimplexAxisAlignmentSummaryV0,
): PSimplexLocalityVerdict {
  if (integrityIssues.length > 0) {
    return 'FAIL';
  }

  const thresholdDominated = summary.totalRows > 0 && summary.thresholdSensitiveCount > summary.totalRows / 2;
  const testedChildCount = new Set(rows.map((row) => row.childSite)).size;

  if (thresholdDominated || testedChildCount < 6) {
    return 'PARTIAL';
  }

  return 'PASS';
}

function chooseFinalRecommendation(
  summary: PSimplexAxisAlignmentSummaryV0,
  structuralIssues: string[],
): PSimplexLocalityRecommendation {
  if (structuralIssues.length > 0 || summary.totalRows === 0) {
    return 'redesign-locality-diagnostic';
  }

  if (summary.axisBentCount + summary.mixedAxisCount > 0) {
    return 'declare-stricter-kernel-locality-before-geometry-sampling';
  }

  return 'proceed-to-geometry-sampling-with-locality-policy';
}

function classifyLocalityStatus(
  magnitude: number,
  axisProjection: number,
  alignmentScore: number,
): PSimplexLocalityStatus {
  if (magnitude <= EPSILON) {
    return 'axis-cancelled';
  }

  if (alignmentScore >= PRESERVED_ALIGNMENT_THRESHOLD && axisProjection > EPSILON) {
    return 'axis-preserved';
  }

  if (alignmentScore >= PRESERVED_ALIGNMENT_THRESHOLD && axisProjection < -EPSILON) {
    return 'axis-flipped';
  }

  if (alignmentScore >= BENT_ALIGNMENT_MIN && alignmentScore < PRESERVED_ALIGNMENT_THRESHOLD) {
    return 'axis-bent';
  }

  return 'mixed-axis';
}

function isThresholdSensitive(alignmentScore: number, magnitude: number): boolean {
  return (
    magnitude > EPSILON &&
    (Math.abs(alignmentScore - PRESERVED_ALIGNMENT_THRESHOLD) <= THRESHOLD_SENSITIVITY_WINDOW ||
      Math.abs(alignmentScore - BENT_ALIGNMENT_MIN) <= THRESHOLD_SENSITIVITY_WINDOW)
  );
}

function siblingsForChild(child: ChildSourceRecord, children: ChildSourceRecord[]): ChildSourceRecord[] {
  return children.filter((candidate) => isSibling(child, candidate));
}

function siblingsSharingEndpoint(
  child: ChildSourceRecord,
  children: ChildSourceRecord[],
  endpoint: PSimplexPrimalSourceId,
): ChildSourceRecord[] {
  return siblingsForChild(child, children).filter((candidate) => candidate.endpoints.includes(endpoint));
}

function isSibling(left: ChildSourceRecord, right: ChildSourceRecord): boolean {
  if (left.sourceId === right.sourceId || left.antipodalPartner === right.sourceId) {
    return false;
  }

  return left.endpoints.filter((endpoint) => right.endpoints.includes(endpoint)).length === 1;
}

function requireChild(children: ChildSourceRecord[], sourceId: PSimplexChildSourceId): ChildSourceRecord {
  const child = children.find((candidate) => candidate.sourceId === sourceId);

  if (!child) {
    throw new Error(`Missing child source ${sourceId}`);
  }

  return child;
}

function firstByChildOrder(children: ChildSourceRecord[]): ChildSourceRecord {
  const sorted = [...children].sort((left, right) => CHILD_ORDER.indexOf(left.sourceId) - CHILD_ORDER.indexOf(right.sourceId));
  const first = sorted[0];

  if (!first) {
    throw new Error('Expected at least one sibling child.');
  }

  return first;
}

function withWeight(
  sourceId: PSimplexChildSourceId,
  weight: number,
): Partial<Record<PSimplexChildSourceId, number>> {
  return { [sourceId]: weight };
}

function withWeights(
  weights: ReadonlyArray<readonly [PSimplexChildSourceId, number]>,
): Partial<Record<PSimplexChildSourceId, number>> {
  const result: Partial<Record<PSimplexChildSourceId, number>> = {};

  for (const [sourceId, weight] of weights) {
    addWeight(result, sourceId, weight);
  }

  return result;
}

function addWeight(
  weights: Partial<Record<PSimplexChildSourceId, number>>,
  sourceId: PSimplexChildSourceId,
  weight: number,
): void {
  weights[sourceId] = (weights[sourceId] ?? 0) + weight;
}

function firstHighSibling(
  child: ChildSourceRecord,
  weights: Partial<Record<PSimplexChildSourceId, number>>,
): PSimplexChildSourceId | undefined {
  return CHILD_ORDER.find(
    (candidate) => candidate !== child.sourceId && candidate !== child.antipodalPartner && (weights[candidate] ?? 0) > 0,
  );
}

function scenarioEvidence(rows: PSimplexLocalityChildRowV0[], scenarioId: string): string {
  const scenarioRows = rowsForScenario(rows, scenarioId);
  const summary = buildAxisAlignmentSummary(scenarioRows);

  return `${scenarioId}: preserved=${summary.axisPreservedCount}, bent=${summary.axisBentCount}, mixed=${summary.mixedAxisCount}, flipped=${summary.axisFlippedCount}, cancelled=${summary.axisCancelledCount}`;
}

function rowsForScenario(rows: PSimplexLocalityChildRowV0[], scenarioId: string): PSimplexLocalityChildRowV0[] {
  return rows.filter((row) => row.scenarioId === scenarioId);
}

function scenarioHasOnlyStatus(
  rows: PSimplexLocalityChildRowV0[],
  scenarioId: string,
  status: PSimplexLocalityStatus,
): boolean {
  const scenarioRows = rowsForScenario(rows, scenarioId);

  return scenarioRows.length === 6 && scenarioRows.every((row) => row.status === status);
}

function isChildSourceId(value: string): value is PSimplexChildSourceId {
  return CHILD_ORDER.includes(value as PSimplexChildSourceId);
}

function isFiniteVector(value: PSimplexVec3): boolean {
  return value.every(Number.isFinite);
}

function cleanWeights(
  weights: Partial<Record<PSimplexChildSourceId, number>>,
): Partial<Record<PSimplexChildSourceId, number>> {
  return Object.fromEntries(
    Object.entries(weights)
      .filter((entry): entry is [PSimplexChildSourceId, number] => isChildSourceId(entry[0]) && Math.abs(entry[1]) > EPSILON)
      .sort(([left], [right]) => CHILD_ORDER.indexOf(left) - CHILD_ORDER.indexOf(right))
      .map(([sourceId, weight]) => [sourceId, cleanNumber(weight)]),
  ) as Partial<Record<PSimplexChildSourceId, number>>;
}

function cleanVec3(value: PSimplexVec3): PSimplexVec3 {
  return [cleanNumber(value[0]), cleanNumber(value[1]), cleanNumber(value[2])];
}

function cleanNumber(value: number): number {
  if (Math.abs(value) <= EPSILON) {
    return 0;
  }

  return Number(value.toFixed(12));
}

function formatScenarioNumber(value: number): string {
  return value.toFixed(1).replace('.', '_');
}

function formatReportNumber(value: number): string {
  return value.toFixed(1);
}

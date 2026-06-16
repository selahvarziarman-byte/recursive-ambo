import {
  buildPSimplexChildLocalGeometryPositionProbeLedgerT7Report,
  type PSimplexT7PerChildProbeLedgerRow,
} from './pSimplexChildLocalGeometryPositionProbeLedgerT7';
import {
  buildPSimplexVectorOrderParameterDiagnosticV0Report,
  type PSimplexChildSourceId,
  type PSimplexInvalidReductionAuditRowV0,
  type PSimplexVec3,
} from './pSimplexVectorOrderParameterDiagnosticV0';

export type PSimplexV0ApprovedProbeClass = 'G' | 'E' | 'A+' | 'A-';
export type PSimplexV0ResidualProbeClass = 'T';
export type PSimplexV0AxisSignature = '+x' | '-x' | '+y' | '-y' | '+z' | '-z';
export type PSimplexV0PositiveAxisSignature = '+x' | '+y' | '+z';
export type PSimplexV0NegativeAxisSignature = '-x' | '-y' | '-z';
export type PSimplexV0ObservedAxisSignature = PSimplexV0AxisSignature | 'mixed' | 'unreadable';
export type PSimplexV0ApprovedProbeVectorStatus =
  | 'clean-axis-preserved'
  | 'clean-axis-flipped'
  | 'clean-axis-cancelled'
  | 'neutral-by-symmetry';
export type PSimplexV0Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexV0FinalRecommendation =
  | 'advance-to-a3-cubocta-oriented-difference-horizon-or-define-first-vector-lg-potential'
  | 'revise-child-local-stencil-policy-before-proceeding'
  | 'return-to-kernel-locality-policy';
export type PSimplexV0ReductionObservedVerdict = 'PASS' | 'PARTIAL' | 'FAIL' | 'MISSING';

export interface PSimplexV0SourcePopulationConfirmation {
  activeSourcePopulation: 'S<=1 = {A,B,C,D} union {M_AB,M_AC,M_AD,M_BC,M_BD,M_CD}';
  parentSourcesRemainActive: boolean;
  childOnlyPopulationIsModel: boolean;
  activeSourceCount: number;
  primalSourceCount: number;
  childSourceCount: number;
  sourcePopulationPolicy: 'accumulated-sources-s-leq-1';
  countEvidenceSource: 'p-simplex-vector-order-parameter-diagnostic-v0-with-t7-target-child-cross-check';
  ok: boolean;
}

export interface PSimplexV0ApprovedProbeClassRow {
  probeClass: PSimplexV0ApprovedProbeClass;
  description: string;
  authorizedForCleanReading: true;
  includedInMinimalDiagnostic: true;
  expectedStatus: 'clean-axis-preserved';
  source: 'T7-approved-child-local-probe';
}

export interface PSimplexV0ApprovedProbeVectorRow {
  targetChild: PSimplexChildSourceId;
  probeClass: PSimplexV0ApprovedProbeClass;
  sampleId: string;
  relationClassWeights: Record<string, number[]>;
  sourceWeights: Record<string, number>;
  phi: PSimplexVec3;
  magnitude: number;
  p: number;
  transverseResidualVector: PSimplexVec3;
  r: number;
  alpha: number;
  cleanThreshold: 0.9;
  cleanThresholdMargin: number;
  status: PSimplexV0ApprovedProbeVectorStatus;
  cleanReadingAllowed: boolean;
  thresholdSensitive: boolean;
  axisSignature: PSimplexV0AxisSignature;
  ok: boolean;
}

export interface PSimplexV0PerChildAxisSignatureRow {
  targetChild: PSimplexChildSourceId;
  expectedAxisSignature: PSimplexV0AxisSignature;
  observedAxisSignature: PSimplexV0ObservedAxisSignature;
  readableProbeClasses: PSimplexV0ApprovedProbeClass[];
  failedProbeClasses: PSimplexV0ApprovedProbeClass[];
  allApprovedProbesReadable: boolean;
  ok: boolean;
}

export interface PSimplexV0AntipodalPairConsistencyRow {
  pairId: 'AB/CD' | 'AC/BD' | 'AD/BC';
  positiveChild: PSimplexChildSourceId;
  negativeChild: PSimplexChildSourceId;
  expectedPositiveAxis: PSimplexV0PositiveAxisSignature;
  expectedNegativeAxis: PSimplexV0NegativeAxisSignature;
  positiveReadable: boolean;
  negativeReadable: boolean;
  allApprovedProbeClassesConsistent: boolean;
  ok: boolean;
}

export interface PSimplexV0ReductionControlRow {
  controlId: 'scalar-magnitude-only' | 'equal-source-weight-scalar' | 'bas-cp-status';
  expectedVerdict: 'FAIL';
  observedVerdict: PSimplexV0ReductionObservedVerdict;
  reason: string;
  ok: boolean;
}

export interface PSimplexV0ResidualControlRow {
  targetChild: PSimplexChildSourceId;
  probeClass: PSimplexV0ResidualProbeClass;
  sampleId: string;
  diagnosticOnly: true;
  cleanReadable: boolean;
  ledgerStatus: 'locality-sensitive-suppressed';
  underlyingK3Status: string;
  alpha: number;
  suppressionReason: string;
  ok: boolean;
}

export interface PSimplexV0BoundaryStatementRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexV0Summary {
  activeSourceCount: number;
  approvedProbeClassCount: number;
  approvedProbeVectorRowCount: number;
  cleanApprovedProbeRowCount: number;
  thresholdSensitiveApprovedProbeRowCount: number;
  perChildAxisSignatureCount: number;
  antipodalPairConsistencyCount: number;
  reductionControlCount: number;
  residualControlCount: number;
  boundaryStatementCount: number;
}

export interface PSimplexMinimalGeometryPositionVectorDiagnosticV0Report {
  method: 'p-simplex-minimal-geometry-position-vector-diagnostic-v0';
  candidatePackage: 'p-simplex-minimal-geometry-position-vector-diagnostic-v0.1';
  parentProbeLedger: 'p-simplex-child-local-geometry-position-probe-ledger-t7';
  diagnosticScope: 'approved-child-local-geometry-position-vector-report-only';
  vectorCarrierStatus: 'r3-vector-order-parameter';
  fieldAtlasStatus: 'not-field-atlas';
  renderingStatus: 'not-rendering';
  denseSamplingStatus: 'not-dense-sampling';
  solverStatus: 'not-lg-solver';
  fieldCueStatus: 'not-field-cue';
  semanticStatus: 'not-semantic-naming';
  routeStatus: 'no-route-walk-holonomy';
  sourcePopulationPolicy: 'accumulated-sources-s-leq-1';
  parentProbeLedgerStillPasses: boolean;
  sourcePopulationConfirmation: PSimplexV0SourcePopulationConfirmation;
  approvedProbeClassRows: PSimplexV0ApprovedProbeClassRow[];
  approvedProbeVectorRows: PSimplexV0ApprovedProbeVectorRow[];
  perChildAxisSignatureRows: PSimplexV0PerChildAxisSignatureRow[];
  antipodalPairConsistencyRows: PSimplexV0AntipodalPairConsistencyRow[];
  reductionControlRows: PSimplexV0ReductionControlRow[];
  residualControlRows: PSimplexV0ResidualControlRow[];
  boundaryStatementRows: PSimplexV0BoundaryStatementRow[];
  summary: PSimplexV0Summary;
  verdict: PSimplexV0Verdict;
  finalRecommendation: PSimplexV0FinalRecommendation;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

const EPSILON = 1e-9;
const CLEAN_THRESHOLD = 0.9;
const THRESHOLD_SENSITIVE_UPPER = 0.95;
const APPROVED_PROBE_CLASSES: readonly PSimplexV0ApprovedProbeClass[] = ['G', 'E', 'A+', 'A-'];
const CHILD_SOURCE_IDS: readonly PSimplexChildSourceId[] = ['M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];
const CLEAN_APPROVED_STATUSES: readonly PSimplexV0ApprovedProbeVectorStatus[] = [
  'clean-axis-preserved',
  'clean-axis-flipped',
  'clean-axis-cancelled',
  'neutral-by-symmetry',
];
const EXPECTED_AXIS_BY_CHILD: Record<PSimplexChildSourceId, PSimplexV0AxisSignature> = {
  M_AB: '+x',
  M_CD: '-x',
  M_AC: '+y',
  M_BD: '-y',
  M_AD: '+z',
  M_BC: '-z',
};
const APPROVED_PROBE_CLASS_ROWS: readonly PSimplexV0ApprovedProbeClassRow[] = [
  {
    probeClass: 'G',
    description: 'Graph-distance child-parent incidence probe',
    authorizedForCleanReading: true,
    includedInMinimalDiagnostic: true,
    expectedStatus: 'clean-axis-preserved',
    source: 'T7-approved-child-local-probe',
  },
  {
    probeClass: 'E',
    description: 'Exact child midpoint radial probe',
    authorizedForCleanReading: true,
    includedInMinimalDiagnostic: true,
    expectedStatus: 'clean-axis-preserved',
    source: 'T7-approved-child-local-probe',
  },
  {
    probeClass: 'A+',
    description: 'Positive axial offset',
    authorizedForCleanReading: true,
    includedInMinimalDiagnostic: true,
    expectedStatus: 'clean-axis-preserved',
    source: 'T7-approved-child-local-probe',
  },
  {
    probeClass: 'A-',
    description: 'Negative axial offset',
    authorizedForCleanReading: true,
    includedInMinimalDiagnostic: true,
    expectedStatus: 'clean-axis-preserved',
    source: 'T7-approved-child-local-probe',
  },
];

export function buildPSimplexMinimalGeometryPositionVectorDiagnosticV0Report(): PSimplexMinimalGeometryPositionVectorDiagnosticV0Report {
  const parentT7Report = buildPSimplexChildLocalGeometryPositionProbeLedgerT7Report();
  const vectorOrderReport = buildPSimplexVectorOrderParameterDiagnosticV0Report();
  const parentProbeLedgerStillPasses =
    parentT7Report.ok && parentT7Report.integrityIssueCount === 0 && parentT7Report.verdict === 'PASS';
  const sourcePopulationConfirmation = buildSourcePopulationConfirmation(parentT7Report, vectorOrderReport);
  const approvedProbeClassRows = APPROVED_PROBE_CLASS_ROWS.map((row) => ({ ...row }));
  const approvedProbeVectorRows = buildApprovedProbeVectorRows(parentT7Report.perChildProbeLedgerRows);
  const perChildAxisSignatureRows = buildPerChildAxisSignatureRows(approvedProbeVectorRows);
  const antipodalPairConsistencyRows = buildAntipodalPairConsistencyRows(
    approvedProbeVectorRows,
    perChildAxisSignatureRows,
  );
  const reductionControlRows = buildReductionControlRows(vectorOrderReport.invalidReductionAuditRows);
  const residualControlRows = buildResidualControlRows(parentT7Report.perChildProbeLedgerRows);
  const boundaryStatementRows = buildBoundaryStatementRows();
  const summary = buildSummary({
    sourcePopulationConfirmation,
    approvedProbeClassRows,
    approvedProbeVectorRows,
    perChildAxisSignatureRows,
    antipodalPairConsistencyRows,
    reductionControlRows,
    residualControlRows,
    boundaryStatementRows,
  });
  const integrityIssues = buildIntegrityIssues({
    parentProbeLedgerStillPasses,
    sourcePopulationConfirmation,
    approvedProbeClassRows,
    approvedProbeVectorRows,
    perChildAxisSignatureRows,
    antipodalPairConsistencyRows,
    reductionControlRows,
    residualControlRows,
    boundaryStatementRows,
    parentT7Rows: parentT7Report.perChildProbeLedgerRows,
    summary,
  });
  const verdict = classifyVerdict(integrityIssues, approvedProbeVectorRows, residualControlRows);
  const finalRecommendation = recommendationForVerdict(verdict);

  return {
    method: 'p-simplex-minimal-geometry-position-vector-diagnostic-v0',
    candidatePackage: 'p-simplex-minimal-geometry-position-vector-diagnostic-v0.1',
    parentProbeLedger: 'p-simplex-child-local-geometry-position-probe-ledger-t7',
    diagnosticScope: 'approved-child-local-geometry-position-vector-report-only',
    vectorCarrierStatus: 'r3-vector-order-parameter',
    fieldAtlasStatus: 'not-field-atlas',
    renderingStatus: 'not-rendering',
    denseSamplingStatus: 'not-dense-sampling',
    solverStatus: 'not-lg-solver',
    fieldCueStatus: 'not-field-cue',
    semanticStatus: 'not-semantic-naming',
    routeStatus: 'no-route-walk-holonomy',
    sourcePopulationPolicy: 'accumulated-sources-s-leq-1',
    parentProbeLedgerStillPasses,
    sourcePopulationConfirmation,
    approvedProbeClassRows,
    approvedProbeVectorRows,
    perChildAxisSignatureRows,
    antipodalPairConsistencyRows,
    reductionControlRows,
    residualControlRows,
    boundaryStatementRows,
    summary,
    verdict,
    finalRecommendation,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: verdict !== 'FAIL' && integrityIssues.length === 0,
  };
}

function buildSourcePopulationConfirmation(
  parentT7Report: ReturnType<typeof buildPSimplexChildLocalGeometryPositionProbeLedgerT7Report>,
  vectorOrderReport: ReturnType<typeof buildPSimplexVectorOrderParameterDiagnosticV0Report>,
): PSimplexV0SourcePopulationConfirmation {
  const childSourceCount = parentT7Report.summary?.targetChildCount ?? vectorOrderReport.generation1SourceCount;
  const primalSourceCount = vectorOrderReport.generation0SourceCount;
  const activeSourceCount = vectorOrderReport.activeSourceCount;
  const ok =
    parentT7Report.sourcePopulationPolicy === 'accumulated-sources-s-leq-1' &&
    vectorOrderReport.sourcePopulationPolicy === 'accumulated-sources-s-leq-1' &&
    parentT7Report.ok &&
    vectorOrderReport.ok &&
    activeSourceCount === 10 &&
    primalSourceCount === 4 &&
    childSourceCount === 6;

  return {
    activeSourcePopulation: 'S<=1 = {A,B,C,D} union {M_AB,M_AC,M_AD,M_BC,M_BD,M_CD}',
    parentSourcesRemainActive: true,
    childOnlyPopulationIsModel: false,
    activeSourceCount,
    primalSourceCount,
    childSourceCount,
    sourcePopulationPolicy: 'accumulated-sources-s-leq-1',
    countEvidenceSource: 'p-simplex-vector-order-parameter-diagnostic-v0-with-t7-target-child-cross-check',
    ok,
  };
}

function buildApprovedProbeVectorRows(
  parentRows: PSimplexT7PerChildProbeLedgerRow[],
): PSimplexV0ApprovedProbeVectorRow[] {
  return parentRows
    .flatMap((row): PSimplexV0ApprovedProbeVectorRow[] => {
      if (!isApprovedProbeClass(row.probeClass) || row.samplePolicy !== 'approved-child-local-probe') {
        return [];
      }

      const status = row.ledgerStatus as PSimplexV0ApprovedProbeVectorStatus;
      const axisSignature = axisSignatureFromPhi(row.phi) ?? axisSignatureForStatus(row.targetChild, status);
      const thresholdSensitive = row.alpha >= CLEAN_THRESHOLD && row.alpha < THRESHOLD_SENSITIVE_UPPER;
      const cleanReadingAllowed = row.cleanReadingAllowed === true;
      const ok =
        cleanReadingAllowed &&
        status === 'clean-axis-preserved' &&
        axisSignature === EXPECTED_AXIS_BY_CHILD[row.targetChild] &&
        relationWeightsPresent(row.relationClassWeights) &&
        sourceWeightsPresent(row.sourceWeights) &&
        vectorDecompositionPresent(row);

      return [{
        targetChild: row.targetChild,
        probeClass: row.probeClass,
        sampleId: row.sampleId,
        relationClassWeights: copyRelationClassWeights(row.relationClassWeights),
        sourceWeights: { ...row.sourceWeights },
        phi: copyVec3(row.phi),
        magnitude: row.magnitude,
        p: row.p,
        transverseResidualVector: copyVec3(row.transverseResidualVector),
        r: row.r,
        alpha: row.alpha,
        cleanThreshold: CLEAN_THRESHOLD,
        cleanThresholdMargin: row.cleanThresholdMargin,
        status,
        cleanReadingAllowed,
        thresholdSensitive,
        axisSignature,
        ok,
      }];
    })
    .sort(compareApprovedProbeVectorRows);
}

function buildPerChildAxisSignatureRows(
  approvedRows: PSimplexV0ApprovedProbeVectorRow[],
): PSimplexV0PerChildAxisSignatureRow[] {
  return CHILD_SOURCE_IDS.map((targetChild) => {
    const childRows = approvedRows.filter((row) => row.targetChild === targetChild);
    const cleanRows = childRows.filter((row) => row.cleanReadingAllowed && isCleanApprovedStatus(row.status));
    const observedSignatures = [...new Set(cleanRows.map((row) => row.axisSignature))];
    const expectedAxisSignature = EXPECTED_AXIS_BY_CHILD[targetChild];
    const observedAxisSignature =
      cleanRows.length === 0
        ? 'unreadable'
        : observedSignatures.length === 1
          ? observedSignatures[0]
          : 'mixed';
    const readableProbeClasses = APPROVED_PROBE_CLASSES.filter((probeClass) =>
      childRows.some(
        (row) =>
          row.probeClass === probeClass &&
          row.cleanReadingAllowed &&
          row.status === 'clean-axis-preserved' &&
          row.axisSignature === expectedAxisSignature,
      ),
    );
    const failedProbeClasses = APPROVED_PROBE_CLASSES.filter(
      (probeClass) => !readableProbeClasses.includes(probeClass),
    );
    const allApprovedProbesReadable = readableProbeClasses.length === APPROVED_PROBE_CLASSES.length;

    return {
      targetChild,
      expectedAxisSignature,
      observedAxisSignature,
      readableProbeClasses,
      failedProbeClasses,
      allApprovedProbesReadable,
      ok: allApprovedProbesReadable && observedAxisSignature === expectedAxisSignature,
    };
  });
}

function buildAntipodalPairConsistencyRows(
  approvedRows: PSimplexV0ApprovedProbeVectorRow[],
  axisSignatureRows: PSimplexV0PerChildAxisSignatureRow[],
): PSimplexV0AntipodalPairConsistencyRow[] {
  const rowsByChild = new Map(axisSignatureRows.map((row) => [row.targetChild, row]));

  return [
    buildAntipodalPairConsistencyRow({
      pairId: 'AB/CD',
      positiveChild: 'M_AB',
      negativeChild: 'M_CD',
      expectedPositiveAxis: '+x',
      expectedNegativeAxis: '-x',
      approvedRows,
      rowsByChild,
    }),
    buildAntipodalPairConsistencyRow({
      pairId: 'AC/BD',
      positiveChild: 'M_AC',
      negativeChild: 'M_BD',
      expectedPositiveAxis: '+y',
      expectedNegativeAxis: '-y',
      approvedRows,
      rowsByChild,
    }),
    buildAntipodalPairConsistencyRow({
      pairId: 'AD/BC',
      positiveChild: 'M_AD',
      negativeChild: 'M_BC',
      expectedPositiveAxis: '+z',
      expectedNegativeAxis: '-z',
      approvedRows,
      rowsByChild,
    }),
  ];
}

function buildAntipodalPairConsistencyRow(args: {
  pairId: PSimplexV0AntipodalPairConsistencyRow['pairId'];
  positiveChild: PSimplexChildSourceId;
  negativeChild: PSimplexChildSourceId;
  expectedPositiveAxis: PSimplexV0PositiveAxisSignature;
  expectedNegativeAxis: PSimplexV0NegativeAxisSignature;
  approvedRows: PSimplexV0ApprovedProbeVectorRow[];
  rowsByChild: Map<PSimplexChildSourceId, PSimplexV0PerChildAxisSignatureRow>;
}): PSimplexV0AntipodalPairConsistencyRow {
  const positiveAxisRow = args.rowsByChild.get(args.positiveChild);
  const negativeAxisRow = args.rowsByChild.get(args.negativeChild);
  const positiveReadable =
    positiveAxisRow?.ok === true && positiveAxisRow.observedAxisSignature === args.expectedPositiveAxis;
  const negativeReadable =
    negativeAxisRow?.ok === true && negativeAxisRow.observedAxisSignature === args.expectedNegativeAxis;
  const allApprovedProbeClassesConsistent =
    positiveReadable &&
    negativeReadable &&
    APPROVED_PROBE_CLASSES.every((probeClass) => {
      const positiveProbe = args.approvedRows.find(
        (row) => row.targetChild === args.positiveChild && row.probeClass === probeClass,
      );
      const negativeProbe = args.approvedRows.find(
        (row) => row.targetChild === args.negativeChild && row.probeClass === probeClass,
      );

      return (
        positiveProbe?.axisSignature === args.expectedPositiveAxis &&
        positiveProbe.status === 'clean-axis-preserved' &&
        positiveProbe.cleanReadingAllowed &&
        negativeProbe?.axisSignature === args.expectedNegativeAxis &&
        negativeProbe.status === 'clean-axis-preserved' &&
        negativeProbe.cleanReadingAllowed
      );
    });

  return {
    pairId: args.pairId,
    positiveChild: args.positiveChild,
    negativeChild: args.negativeChild,
    expectedPositiveAxis: args.expectedPositiveAxis,
    expectedNegativeAxis: args.expectedNegativeAxis,
    positiveReadable,
    negativeReadable,
    allApprovedProbeClassesConsistent,
    ok: allApprovedProbeClassesConsistent,
  };
}

function buildReductionControlRows(
  auditRows: PSimplexInvalidReductionAuditRowV0[],
): PSimplexV0ReductionControlRow[] {
  return [
    buildReductionControlRow('scalar-magnitude-only', auditRows),
    buildReductionControlRow('equal-source-weight-scalar', auditRows),
    buildReductionControlRow('bas-cp-status', auditRows),
  ];
}

function buildReductionControlRow(
  controlId: PSimplexV0ReductionControlRow['controlId'],
  auditRows: PSimplexInvalidReductionAuditRowV0[],
): PSimplexV0ReductionControlRow {
  const auditRow = auditRows.find((row) => row.reductionId === controlId);
  const observedVerdict = auditRow?.observedVerdict ?? 'MISSING';

  return {
    controlId,
    expectedVerdict: 'FAIL',
    observedVerdict,
    reason: auditRow?.reason ?? `Missing invalid-reduction audit row for ${controlId}.`,
    ok: observedVerdict === 'FAIL',
  };
}

function buildResidualControlRows(parentRows: PSimplexT7PerChildProbeLedgerRow[]): PSimplexV0ResidualControlRow[] {
  return parentRows
    .flatMap((row): PSimplexV0ResidualControlRow[] => {
      if (row.probeClass !== 'T') {
        return [];
      }

      const cleanReadable = row.cleanReadingAllowed === true;
      const suppressionReason = row.suppressionReason ?? '';
      const ok =
        row.samplePolicy === 'diagnostic-only-transverse-probe' &&
        !cleanReadable &&
        row.ledgerStatus === 'locality-sensitive-suppressed' &&
        suppressionReason.length > 0 &&
        Number.isFinite(row.alpha);

      return [{
        targetChild: row.targetChild,
        probeClass: 'T',
        sampleId: row.sampleId,
        diagnosticOnly: true,
        cleanReadable,
        ledgerStatus: 'locality-sensitive-suppressed',
        underlyingK3Status: row.underlyingK3Status,
        alpha: row.alpha,
        suppressionReason,
        ok,
      }];
    })
    .sort(compareResidualControlRows);
}

function buildBoundaryStatementRows(): PSimplexV0BoundaryStatementRow[] {
  return [
    { boundaryId: 'not-field-atlas', statement: 'not FieldAtlas', enforced: true },
    { boundaryId: 'not-rendering', statement: 'not rendering', enforced: true },
    { boundaryId: 'not-dense-sampling', statement: 'not dense sampling', enforced: true },
    { boundaryId: 'not-vector-lg-dynamics', statement: 'not vector-LG dynamics', enforced: true },
    { boundaryId: 'not-field-cue', statement: 'not FieldCue', enforced: true },
    { boundaryId: 'no-basin-wall-complement-pressure', statement: 'no basin/wall/complement-pressure', enforced: true },
    { boundaryId: 'no-route-walk-holonomy', statement: 'no route/walk/holonomy', enforced: true },
    { boundaryId: 'no-defect-vortex-evidence', statement: 'no defect/vortex evidence', enforced: true },
    { boundaryId: 'no-semantic-naming', statement: 'no semantic naming', enforced: true },
    { boundaryId: 'no-dwelling', statement: 'no dwelling', enforced: true },
    { boundaryId: 't-not-clean-probe', statement: 'T is not a clean probe', enforced: true },
    {
      boundaryId: 'broad-geometry-sampling-not-authorized',
      statement: 'broad geometry sampling is not authorized',
      enforced: true,
    },
  ];
}

function buildSummary(args: {
  sourcePopulationConfirmation: PSimplexV0SourcePopulationConfirmation;
  approvedProbeClassRows: PSimplexV0ApprovedProbeClassRow[];
  approvedProbeVectorRows: PSimplexV0ApprovedProbeVectorRow[];
  perChildAxisSignatureRows: PSimplexV0PerChildAxisSignatureRow[];
  antipodalPairConsistencyRows: PSimplexV0AntipodalPairConsistencyRow[];
  reductionControlRows: PSimplexV0ReductionControlRow[];
  residualControlRows: PSimplexV0ResidualControlRow[];
  boundaryStatementRows: PSimplexV0BoundaryStatementRow[];
}): PSimplexV0Summary {
  return {
    activeSourceCount: args.sourcePopulationConfirmation.activeSourceCount,
    approvedProbeClassCount: args.approvedProbeClassRows.length,
    approvedProbeVectorRowCount: args.approvedProbeVectorRows.length,
    cleanApprovedProbeRowCount: args.approvedProbeVectorRows.filter((row) => row.cleanReadingAllowed).length,
    thresholdSensitiveApprovedProbeRowCount: args.approvedProbeVectorRows.filter((row) => row.thresholdSensitive).length,
    perChildAxisSignatureCount: args.perChildAxisSignatureRows.length,
    antipodalPairConsistencyCount: args.antipodalPairConsistencyRows.length,
    reductionControlCount: args.reductionControlRows.length,
    residualControlCount: args.residualControlRows.length,
    boundaryStatementCount: args.boundaryStatementRows.length,
  };
}

function buildIntegrityIssues(args: {
  parentProbeLedgerStillPasses: boolean;
  sourcePopulationConfirmation: PSimplexV0SourcePopulationConfirmation;
  approvedProbeClassRows: PSimplexV0ApprovedProbeClassRow[];
  approvedProbeVectorRows: PSimplexV0ApprovedProbeVectorRow[];
  perChildAxisSignatureRows: PSimplexV0PerChildAxisSignatureRow[];
  antipodalPairConsistencyRows: PSimplexV0AntipodalPairConsistencyRow[];
  reductionControlRows: PSimplexV0ReductionControlRow[];
  residualControlRows: PSimplexV0ResidualControlRow[];
  boundaryStatementRows: PSimplexV0BoundaryStatementRow[];
  parentT7Rows: PSimplexT7PerChildProbeLedgerRow[];
  summary: PSimplexV0Summary;
}): string[] {
  const issues: string[] = [];

  if (!args.parentProbeLedgerStillPasses) {
    issues.push('Parent T7 diagnostic does not pass.');
  }

  if (!args.sourcePopulationConfirmation.ok) {
    issues.push('Source population confirmation failed.');
  }

  if (args.sourcePopulationConfirmation.activeSourceCount !== 10) {
    issues.push(`Expected active source count 10, got ${args.sourcePopulationConfirmation.activeSourceCount}.`);
  }

  if (args.sourcePopulationConfirmation.childOnlyPopulationIsModel) {
    issues.push('Child-only source population was treated as the model.');
  }

  if (!args.sourcePopulationConfirmation.parentSourcesRemainActive) {
    issues.push('Parent sources were not confirmed active.');
  }

  if (args.approvedProbeClassRows.length !== 4) {
    issues.push(`Expected 4 approvedProbeClassRows, got ${args.approvedProbeClassRows.length}.`);
  }

  if (args.approvedProbeVectorRows.length !== 24) {
    issues.push(`Expected 24 approvedProbeVectorRows, got ${args.approvedProbeVectorRows.length}.`);
  }

  if (args.approvedProbeVectorRows.some((row) => !row.cleanReadingAllowed)) {
    issues.push('At least one approved probe row is not clean-readable.');
  }

  if (args.approvedProbeVectorRows.some((row) => !isCleanApprovedStatus(row.status))) {
    issues.push('At least one approved probe row has a status outside the clean vector statuses.');
  }

  if (
    args.approvedProbeVectorRows.some(
      (row) => !relationWeightsPresent(row.relationClassWeights) || !sourceWeightsPresent(row.sourceWeights),
    )
  ) {
    issues.push('At least one approved probe row lacks relationClassWeights or sourceWeights.');
  }

  if (args.approvedProbeVectorRows.some((row) => !approvedVectorDecompositionPresent(row))) {
    issues.push('At least one approved probe row lacks phi, magnitude, p, r, or alpha.');
  }

  const failedApprovedRows = args.approvedProbeVectorRows.filter((row) => !row.ok);

  if (failedApprovedRows.length > 0) {
    issues.push(
      `Approved probe rows failed child-axis readability: ${failedApprovedRows
        .map((row) => `${row.targetChild}:${row.probeClass}`)
        .join(', ')}.`,
    );
  }

  if (args.perChildAxisSignatureRows.length !== 6) {
    issues.push(`Expected 6 perChildAxisSignatureRows, got ${args.perChildAxisSignatureRows.length}.`);
  }

  if (args.perChildAxisSignatureRows.some((row) => !row.ok)) {
    issues.push('At least one child axis signature row is inconsistent.');
  }

  if (args.antipodalPairConsistencyRows.length !== 3) {
    issues.push(`Expected 3 antipodalPairConsistencyRows, got ${args.antipodalPairConsistencyRows.length}.`);
  }

  if (args.antipodalPairConsistencyRows.some((row) => !row.ok)) {
    issues.push('At least one antipodal pair lost consistency.');
  }

  if (args.reductionControlRows.length !== 3) {
    issues.push(`Expected 3 reductionControlRows, got ${args.reductionControlRows.length}.`);
  }

  if (args.reductionControlRows.some((row) => row.observedVerdict !== 'FAIL' || !row.ok)) {
    issues.push('At least one scalar/status reduction control was not rejected.');
  }

  if (args.residualControlRows.length !== 6) {
    issues.push(`Expected 6 residualControlRows, got ${args.residualControlRows.length}.`);
  }

  if (args.residualControlRows.some((row) => row.cleanReadable)) {
    issues.push('At least one T residual row was marked clean-readable.');
  }

  if (args.residualControlRows.some((row) => !row.ok || !row.diagnosticOnly)) {
    issues.push('At least one T residual row was not suppressed as diagnostic-only.');
  }

  if (
    args.parentT7Rows.some(
      (row) => row.probeClass === 'T' && row.samplePolicy === 'approved-child-local-probe',
    )
  ) {
    issues.push('T appears in the approved probe population.');
  }

  if (args.boundaryStatementRows.some((row) => !row.enforced)) {
    issues.push('At least one boundary statement is not enforced.');
  }

  if (forbiddenVocabularyAppears(args)) {
    issues.push('Forbidden vocabulary appears outside allowed negative boundary/status statements.');
  }

  if (args.summary.approvedProbeClassCount !== 4 || args.summary.approvedProbeVectorRowCount !== 24) {
    issues.push('Summary counts do not match approved probe expectations.');
  }

  return [...new Set(issues)];
}

function classifyVerdict(
  integrityIssues: string[],
  approvedRows: PSimplexV0ApprovedProbeVectorRow[],
  residualRows: PSimplexV0ResidualControlRow[],
): PSimplexV0Verdict {
  if (integrityIssues.length > 0) {
    return 'FAIL';
  }

  if (
    approvedRows.some((row) => row.thresholdSensitive) ||
    residualRows.some((row) => row.suppressionReason.length === 0)
  ) {
    return 'PARTIAL';
  }

  return 'PASS';
}

function recommendationForVerdict(verdict: PSimplexV0Verdict): PSimplexV0FinalRecommendation {
  if (verdict === 'PASS') {
    return 'advance-to-a3-cubocta-oriented-difference-horizon-or-define-first-vector-lg-potential';
  }

  if (verdict === 'PARTIAL') {
    return 'revise-child-local-stencil-policy-before-proceeding';
  }

  return 'return-to-kernel-locality-policy';
}

function isApprovedProbeClass(value: string): value is PSimplexV0ApprovedProbeClass {
  return APPROVED_PROBE_CLASSES.includes(value as PSimplexV0ApprovedProbeClass);
}

function isCleanApprovedStatus(value: string): value is PSimplexV0ApprovedProbeVectorStatus {
  return CLEAN_APPROVED_STATUSES.includes(value as PSimplexV0ApprovedProbeVectorStatus);
}

function axisSignatureForStatus(
  targetChild: PSimplexChildSourceId,
  status: PSimplexV0ApprovedProbeVectorStatus,
): PSimplexV0AxisSignature {
  const expectedAxis = EXPECTED_AXIS_BY_CHILD[targetChild];

  return status === 'clean-axis-flipped' ? oppositeAxisSignature(expectedAxis) : expectedAxis;
}

function axisSignatureFromPhi(phi: PSimplexVec3): PSimplexV0AxisSignature | null {
  const absX = Math.abs(phi[0]);
  const absY = Math.abs(phi[1]);
  const absZ = Math.abs(phi[2]);
  const max = Math.max(absX, absY, absZ);

  if (max <= EPSILON) {
    return null;
  }

  if (absX >= absY - EPSILON && absX >= absZ - EPSILON) {
    return phi[0] >= 0 ? '+x' : '-x';
  }

  if (absY >= absX - EPSILON && absY >= absZ - EPSILON) {
    return phi[1] >= 0 ? '+y' : '-y';
  }

  return phi[2] >= 0 ? '+z' : '-z';
}

function oppositeAxisSignature(axis: PSimplexV0AxisSignature): PSimplexV0AxisSignature {
  return axis.startsWith('+')
    ? (`-${axis.slice(1)}` as PSimplexV0AxisSignature)
    : (`+${axis.slice(1)}` as PSimplexV0AxisSignature);
}

function relationWeightsPresent(value: Record<string, number[]>): boolean {
  return Object.keys(value).length > 0 && Object.values(value).every((weights) => weights.every(Number.isFinite));
}

function sourceWeightsPresent(value: Record<string, number>): boolean {
  return Object.keys(value).length > 0 && Object.values(value).every(Number.isFinite);
}

function vectorDecompositionPresent(row: PSimplexT7PerChildProbeLedgerRow): boolean {
  return (
    isVec3(row.phi) &&
    isVec3(row.transverseResidualVector) &&
    Number.isFinite(row.magnitude) &&
    Number.isFinite(row.p) &&
    Number.isFinite(row.r) &&
    Number.isFinite(row.alpha)
  );
}

function approvedVectorDecompositionPresent(row: PSimplexV0ApprovedProbeVectorRow): boolean {
  return (
    isVec3(row.phi) &&
    isVec3(row.transverseResidualVector) &&
    Number.isFinite(row.magnitude) &&
    Number.isFinite(row.p) &&
    Number.isFinite(row.r) &&
    Number.isFinite(row.alpha)
  );
}

function isVec3(value: PSimplexVec3): boolean {
  return value.length === 3 && value.every(Number.isFinite);
}

function copyVec3(value: PSimplexVec3): PSimplexVec3 {
  return [value[0], value[1], value[2]];
}

function copyRelationClassWeights(value: Record<string, number[]>): Record<string, number[]> {
  return Object.fromEntries(Object.entries(value).map(([key, weights]) => [key, [...weights]]));
}

function compareApprovedProbeVectorRows(
  left: PSimplexV0ApprovedProbeVectorRow,
  right: PSimplexV0ApprovedProbeVectorRow,
): number {
  const childComparison = childOrder(left.targetChild) - childOrder(right.targetChild);

  if (childComparison !== 0) {
    return childComparison;
  }

  return approvedProbeClassOrder(left.probeClass) - approvedProbeClassOrder(right.probeClass);
}

function compareResidualControlRows(
  left: PSimplexV0ResidualControlRow,
  right: PSimplexV0ResidualControlRow,
): number {
  return childOrder(left.targetChild) - childOrder(right.targetChild);
}

function childOrder(child: PSimplexChildSourceId): number {
  return CHILD_SOURCE_IDS.indexOf(child);
}

function approvedProbeClassOrder(probeClass: PSimplexV0ApprovedProbeClass): number {
  return APPROVED_PROBE_CLASSES.indexOf(probeClass);
}

function forbiddenVocabularyAppears(args: {
  approvedProbeClassRows: PSimplexV0ApprovedProbeClassRow[];
  approvedProbeVectorRows: PSimplexV0ApprovedProbeVectorRow[];
  perChildAxisSignatureRows: PSimplexV0PerChildAxisSignatureRow[];
  antipodalPairConsistencyRows: PSimplexV0AntipodalPairConsistencyRow[];
  reductionControlRows: PSimplexV0ReductionControlRow[];
  residualControlRows: PSimplexV0ResidualControlRow[];
  boundaryStatementRows: PSimplexV0BoundaryStatementRow[];
}): boolean {
  const values = [
    'no-route-walk-holonomy',
    ...args.approvedProbeClassRows.flatMap((row) => [
      row.probeClass,
      row.description,
      row.expectedStatus,
      row.source,
    ]),
    ...args.approvedProbeVectorRows.flatMap((row) => [
      row.targetChild,
      row.probeClass,
      row.sampleId,
      row.status,
      row.axisSignature,
    ]),
    ...args.perChildAxisSignatureRows.flatMap((row) => [
      row.targetChild,
      row.expectedAxisSignature,
      row.observedAxisSignature,
    ]),
    ...args.antipodalPairConsistencyRows.flatMap((row) => [
      row.pairId,
      row.positiveChild,
      row.negativeChild,
      row.expectedPositiveAxis,
      row.expectedNegativeAxis,
    ]),
    ...args.reductionControlRows.flatMap((row) => [
      row.controlId,
      row.expectedVerdict,
      row.observedVerdict,
      row.reason,
    ]),
    ...args.residualControlRows.flatMap((row) => [
      row.targetChild,
      row.probeClass,
      row.sampleId,
      row.ledgerStatus,
      row.underlyingK3Status,
      row.suppressionReason,
    ]),
    ...args.boundaryStatementRows.flatMap((row) => [row.boundaryId, row.statement]),
  ];

  return values.some((value) => hasForbiddenPositiveClaim(value));
}

function hasForbiddenPositiveClaim(value: string): boolean {
  const normalized = value.toLowerCase();

  if (isAllowedNegativeClaim(normalized)) {
    return false;
  }

  return [
    'basin',
    'wall',
    'complement-pressure',
    'defect',
    'route',
    'walk',
    'holonomy',
    'vortex',
    'dwelling',
    'naming pressure',
    'semantic meaning',
  ].some((term) => normalized.includes(term));
}

function isAllowedNegativeClaim(value: string): boolean {
  return (
    value.startsWith('no-') ||
    value.startsWith('no ') ||
    value.startsWith('not-') ||
    value.startsWith('not ') ||
    value.includes(' is not ') ||
    value.includes(' not authorized') ||
    value.includes('not clean')
  );
}

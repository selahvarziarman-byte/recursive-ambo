import {
  buildPSimplexGeometryGraphSamplingGateK3V0Report,
  type PSimplexK3PerChildEvidenceRowV0,
  type PSimplexK3SampleFamily,
  type PSimplexK3ThresholdMarginClass,
} from './pSimplexGeometryGraphSamplingGateK3V0';
import type { PSimplexChildSourceId, PSimplexVec3 } from './pSimplexVectorOrderParameterDiagnosticV0';

export type PSimplexT7ProbeClass = 'G' | 'E' | 'A+' | 'A-' | 'T';
export type PSimplexT7SamplePolicy = 'approved-child-local-probe' | 'diagnostic-only-transverse-probe';
export type PSimplexT7ExpectedClassification = 'clean' | 'suppressed-locality-sensitive';
export type PSimplexT7LedgerStatus =
  | 'clean-axis-preserved'
  | 'clean-axis-flipped'
  | 'clean-axis-cancelled'
  | 'neutral-by-symmetry'
  | 'locality-sensitive-suppressed'
  | 'axis-bent'
  | 'mixed-axis'
  | 'kernel-artifact-risk'
  | 'unauthorized-sample-class';
export type PSimplexT7Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT7FinalRecommendation =
  | 'advance-to-minimal-geometry-position-vector-diagnostic-or-sibling-sweep-residual-diagnostic'
  | 'revise-child-local-stencil-policy-before-moving-forward'
  | 'return-to-kernel-locality-policy';

export interface PSimplexT7SampleClassRow {
  probeClass: PSimplexT7ProbeClass;
  k3SampleFamily: PSimplexK3SampleFamily;
  description: string;
  authorizedForCleanReading: boolean;
  expectedClassification: PSimplexT7ExpectedClassification;
  samplePolicy: PSimplexT7SamplePolicy;
  requiredCondition: string;
}

export interface PSimplexT7PerChildProbeLedgerRow {
  targetChild: PSimplexChildSourceId;
  probeClass: PSimplexT7ProbeClass;
  k3SampleFamily: string;
  sampleId: string;
  authorizedForCleanReading: boolean;
  samplePolicy: PSimplexT7SamplePolicy;
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
  thresholdMarginClass: PSimplexK3ThresholdMarginClass;
  axisCompatible: boolean;
  axisCompatibilityFailures: string[];
  underlyingK3Status: string;
  ledgerStatus: PSimplexT7LedgerStatus;
  cleanReadingAllowed: boolean;
  suppressionReason: string | null;
  expectedClassificationMatched: boolean;
}

export interface PSimplexT7ClassStatusRow {
  probeClass: PSimplexT7ProbeClass;
  k3SampleFamily: string;
  sampleCount: number;
  cleanReadingAllowedCount: number;
  suppressedCount: number;
  authorizedCount: number;
  unauthorizedCount: number;
  localitySensitiveCount: number;
  kernelArtifactRiskCount: number;
  statusCounts: Record<string, number>;
  minAlpha: number;
  maxAlpha: number;
  minCleanThresholdMargin: number;
  maxCleanThresholdMargin: number;
}

export interface PSimplexT7ThresholdMarginRow {
  targetChild: PSimplexChildSourceId;
  probeClass: PSimplexT7ProbeClass;
  sampleId: string;
  alpha: number;
  cleanThreshold: 0.9;
  cleanThresholdMargin: number;
  thresholdMarginClass: PSimplexK3ThresholdMarginClass;
}

export interface PSimplexT7Summary {
  targetChildCount: number;
  probeClassCount: number;
  ledgerRowCount: number;
  approvedProbeRowCount: number;
  diagnosticOnlyProbeRowCount: number;
  cleanApprovedProbeCount: number;
  suppressedApprovedProbeCount: number;
  suppressedTransverseProbeCount: number;
  relationWeightsPresentCount: number;
  vectorDecompositionPresentCount: number;
  statusCounts: Record<string, number>;
}

export interface PSimplexChildLocalGeometryPositionProbeLedgerT7Report {
  method: 'p-simplex-child-local-geometry-position-probe-ledger-t7';
  candidatePolicy: 'p-simplex-child-local-geometry-position-stencil-policy-v0.1';
  parentK3Diagnostic: 'p-simplex-geometry-graph-sampling-gate-k3-v0';
  diagnosticScope: 'bounded-child-local-probe-ledger-only';
  vectorCarrierStatus: 'r3-vector-order-parameter';
  fieldAtlasStatus: 'not-field-atlas';
  renderingStatus: 'not-rendering';
  solverStatus: 'not-lg-solver';
  fieldCueStatus: 'not-field-cue';
  semanticStatus: 'not-semantic-naming';
  routeStatus: 'no-route-walk-holonomy';
  denseSamplingStatus: 'not-dense-sampling';
  sourcePopulationPolicy: 'accumulated-sources-s-leq-1';
  parentK3DiagnosticStillPasses: boolean;
  sampleClassRows: PSimplexT7SampleClassRow[];
  perChildProbeLedgerRows: PSimplexT7PerChildProbeLedgerRow[];
  classStatusRows: PSimplexT7ClassStatusRow[];
  thresholdMarginRows: PSimplexT7ThresholdMarginRow[];
  summary: PSimplexT7Summary;
  verdict: PSimplexT7Verdict;
  finalRecommendation: PSimplexT7FinalRecommendation;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

const CLEAN_THRESHOLD = 0.9;
const BARELY_CLEAN_UPPER = 0.95;
const PROBE_CLASS_ROWS: readonly PSimplexT7SampleClassRow[] = [
  {
    probeClass: 'G',
    k3SampleFamily: 'K3-G',
    description: 'Graph-distance child-parent incidence probe.',
    authorizedForCleanReading: true,
    expectedClassification: 'clean',
    samplePolicy: 'approved-child-local-probe',
    requiredCondition: 'axisCompatible=true, alpha>=0.90, relation weights present, source weights present',
  },
  {
    probeClass: 'E',
    k3SampleFamily: 'K3-E',
    description: 'Exact child midpoint radial probe.',
    authorizedForCleanReading: true,
    expectedClassification: 'clean',
    samplePolicy: 'approved-child-local-probe',
    requiredCondition: 'axisCompatible=true, alpha>=0.90, relation weights present, source weights present',
  },
  {
    probeClass: 'A+',
    k3SampleFamily: 'K3-A-primary',
    description: 'Positive axial offset probe.',
    authorizedForCleanReading: true,
    expectedClassification: 'clean',
    samplePolicy: 'approved-child-local-probe',
    requiredCondition: 'axisCompatible=true, alpha>=0.90, relation weights present, source weights present',
  },
  {
    probeClass: 'A-',
    k3SampleFamily: 'K3-A-complement',
    description: 'Negative axial offset probe.',
    authorizedForCleanReading: true,
    expectedClassification: 'clean',
    samplePolicy: 'approved-child-local-probe',
    requiredCondition: 'axisCompatible=true, alpha>=0.90, relation weights present, source weights present',
  },
  {
    probeClass: 'T',
    k3SampleFamily: 'K3-T',
    description: 'Deterministic transverse sibling-directed probe.',
    authorizedForCleanReading: false,
    expectedClassification: 'suppressed-locality-sensitive',
    samplePolicy: 'diagnostic-only-transverse-probe',
    requiredCondition: 'always suppressed in this policy; unauthorized-transverse-diagnostic-class',
  },
];

export function buildPSimplexChildLocalGeometryPositionProbeLedgerT7Report(): PSimplexChildLocalGeometryPositionProbeLedgerT7Report {
  const parentK3Report = buildPSimplexGeometryGraphSamplingGateK3V0Report();
  const sampleClassRows = PROBE_CLASS_ROWS.map((row) => ({ ...row }));
  const perChildProbeLedgerRows = buildPerChildProbeLedgerRows(parentK3Report.perChildEvidenceRows ?? []);
  const classStatusRows = buildClassStatusRows(perChildProbeLedgerRows);
  const thresholdMarginRows = buildThresholdMarginRows(perChildProbeLedgerRows);
  const summary = buildSummary(sampleClassRows, perChildProbeLedgerRows);
  const parentK3DiagnosticStillPasses = parentK3Report.ok && parentK3Report.integrityIssueCount === 0;
  const integrityIssues = buildIntegrityIssues({
    parentK3DiagnosticStillPasses,
    activeSourceCount: parentK3Report.summary?.activeSourceCount,
    targetChildCount: parentK3Report.summary?.targetChildCount,
    parentEvidenceRows: parentK3Report.perChildEvidenceRows,
    sampleClassRows,
    perChildProbeLedgerRows,
    classStatusRows,
    thresholdMarginRows,
  });
  const verdict = classifyVerdict(integrityIssues, perChildProbeLedgerRows);
  const finalRecommendation = recommendationForVerdict(verdict);

  return {
    method: 'p-simplex-child-local-geometry-position-probe-ledger-t7',
    candidatePolicy: 'p-simplex-child-local-geometry-position-stencil-policy-v0.1',
    parentK3Diagnostic: 'p-simplex-geometry-graph-sampling-gate-k3-v0',
    diagnosticScope: 'bounded-child-local-probe-ledger-only',
    vectorCarrierStatus: 'r3-vector-order-parameter',
    fieldAtlasStatus: 'not-field-atlas',
    renderingStatus: 'not-rendering',
    solverStatus: 'not-lg-solver',
    fieldCueStatus: 'not-field-cue',
    semanticStatus: 'not-semantic-naming',
    routeStatus: 'no-route-walk-holonomy',
    denseSamplingStatus: 'not-dense-sampling',
    sourcePopulationPolicy: 'accumulated-sources-s-leq-1',
    parentK3DiagnosticStillPasses,
    sampleClassRows,
    perChildProbeLedgerRows,
    classStatusRows,
    thresholdMarginRows,
    summary,
    verdict,
    finalRecommendation,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: integrityIssues.length === 0,
  };
}

function buildPerChildProbeLedgerRows(k3EvidenceRows: PSimplexK3PerChildEvidenceRowV0[]): PSimplexT7PerChildProbeLedgerRow[] {
  return k3EvidenceRows
    .flatMap((k3Row): PSimplexT7PerChildProbeLedgerRow[] => {
      const sampleClass = sampleClassForK3Family(k3Row.sampleFamily);

      if (!sampleClass) {
        return [];
      }

      const ledgerStatus = ledgerStatusFor(sampleClass, k3Row);
      const cleanReadingAllowed = cleanReadingAllowedFor(sampleClass, ledgerStatus);
      const suppressionReason = suppressionReasonFor(sampleClass, k3Row, cleanReadingAllowed);

      return [{
        targetChild: k3Row.targetChild,
        probeClass: sampleClass.probeClass,
        k3SampleFamily: k3Row.sampleFamily,
        sampleId: k3Row.sampleId,
        authorizedForCleanReading: sampleClass.authorizedForCleanReading,
        samplePolicy: sampleClass.samplePolicy,
        relationClassWeights: k3Row.relationClassWeights,
        sourceWeights: k3Row.sourceWeights,
        phi: k3Row.phi,
        magnitude: k3Row.magnitude,
        p: k3Row.p,
        transverseResidualVector: k3Row.transverseResidualVector,
        r: k3Row.r,
        alpha: k3Row.alpha,
        cleanThreshold: CLEAN_THRESHOLD,
        cleanThresholdMargin: k3Row.cleanThresholdMargin,
        thresholdMarginClass: thresholdMarginClassFor(k3Row),
        axisCompatible: k3Row.axisCompatible,
        axisCompatibilityFailures: k3Row.axisCompatibilityFailures,
        underlyingK3Status: k3Row.status,
        ledgerStatus,
        cleanReadingAllowed,
        suppressionReason,
        expectedClassificationMatched: expectedClassificationMatched(sampleClass, cleanReadingAllowed),
      }];
    })
    .sort(compareLedgerRows);
}

function buildClassStatusRows(rows: PSimplexT7PerChildProbeLedgerRow[]): PSimplexT7ClassStatusRow[] {
  return PROBE_CLASS_ROWS.map((sampleClass) => {
    const classRows = rows.filter((row) => row.probeClass === sampleClass.probeClass);
    const alphas = classRows.map((row) => row.alpha);
    const margins = classRows.map((row) => row.cleanThresholdMargin);

    return {
      probeClass: sampleClass.probeClass,
      k3SampleFamily: sampleClass.k3SampleFamily,
      sampleCount: classRows.length,
      cleanReadingAllowedCount: classRows.filter((row) => row.cleanReadingAllowed).length,
      suppressedCount: classRows.filter((row) => !row.cleanReadingAllowed).length,
      authorizedCount: classRows.filter((row) => row.authorizedForCleanReading).length,
      unauthorizedCount: classRows.filter((row) => !row.authorizedForCleanReading).length,
      localitySensitiveCount: classRows.filter((row) => row.ledgerStatus === 'locality-sensitive-suppressed').length,
      kernelArtifactRiskCount: classRows.filter((row) => row.ledgerStatus === 'kernel-artifact-risk').length,
      statusCounts: countByStatus(classRows),
      minAlpha: minOrZero(alphas),
      maxAlpha: maxOrZero(alphas),
      minCleanThresholdMargin: minOrZero(margins),
      maxCleanThresholdMargin: maxOrZero(margins),
    };
  });
}

function buildThresholdMarginRows(rows: PSimplexT7PerChildProbeLedgerRow[]): PSimplexT7ThresholdMarginRow[] {
  return rows.map((row) => ({
    targetChild: row.targetChild,
    probeClass: row.probeClass,
    sampleId: row.sampleId,
    alpha: row.alpha,
    cleanThreshold: CLEAN_THRESHOLD,
    cleanThresholdMargin: row.cleanThresholdMargin,
    thresholdMarginClass: row.thresholdMarginClass,
  }));
}

function buildSummary(
  sampleClassRows: PSimplexT7SampleClassRow[],
  rows: PSimplexT7PerChildProbeLedgerRow[],
): PSimplexT7Summary {
  const approvedRows = rows.filter((row) => row.samplePolicy === 'approved-child-local-probe');
  const diagnosticRows = rows.filter((row) => row.samplePolicy === 'diagnostic-only-transverse-probe');

  return {
    targetChildCount: new Set(rows.map((row) => row.targetChild)).size,
    probeClassCount: sampleClassRows.length,
    ledgerRowCount: rows.length,
    approvedProbeRowCount: approvedRows.length,
    diagnosticOnlyProbeRowCount: diagnosticRows.length,
    cleanApprovedProbeCount: approvedRows.filter((row) => row.cleanReadingAllowed).length,
    suppressedApprovedProbeCount: approvedRows.filter((row) => !row.cleanReadingAllowed).length,
    suppressedTransverseProbeCount: diagnosticRows.filter((row) => !row.cleanReadingAllowed).length,
    relationWeightsPresentCount: rows.filter(relationWeightsPresent).length,
    vectorDecompositionPresentCount: rows.filter(vectorDecompositionPresent).length,
    statusCounts: countByStatus(rows),
  };
}

function buildIntegrityIssues(args: {
  parentK3DiagnosticStillPasses: boolean;
  activeSourceCount: number | undefined;
  targetChildCount: number | undefined;
  parentEvidenceRows: PSimplexK3PerChildEvidenceRowV0[] | undefined;
  sampleClassRows: PSimplexT7SampleClassRow[];
  perChildProbeLedgerRows: PSimplexT7PerChildProbeLedgerRow[];
  classStatusRows: PSimplexT7ClassStatusRow[];
  thresholdMarginRows: PSimplexT7ThresholdMarginRow[];
}): string[] {
  const issues: string[] = [];

  if (!args.parentK3DiagnosticStillPasses) {
    issues.push('Parent K3 diagnostic did not pass.');
  }

  if (!args.parentEvidenceRows || args.parentEvidenceRows.length === 0) {
    issues.push('Parent K3 evidence rows are missing.');
  }

  if (args.activeSourceCount !== 10) {
    issues.push(`Expected active source count 10, got ${args.activeSourceCount ?? 'missing'}.`);
  }

  if (args.targetChildCount !== 6) {
    issues.push(`Expected target child count 6, got ${args.targetChildCount ?? 'missing'}.`);
  }

  if (args.sampleClassRows.length !== 5) {
    issues.push(`Expected 5 sampleClassRows, got ${args.sampleClassRows.length}.`);
  }

  if (args.perChildProbeLedgerRows.length !== 30) {
    issues.push(`Expected 30 perChildProbeLedgerRows, got ${args.perChildProbeLedgerRows.length}.`);
  }

  if (args.classStatusRows.length !== 5) {
    issues.push(`Expected 5 classStatusRows, got ${args.classStatusRows.length}.`);
  }

  if (args.thresholdMarginRows.length !== 30) {
    issues.push(`Expected 30 thresholdMarginRows, got ${args.thresholdMarginRows.length}.`);
  }

  for (const targetChild of uniqueTargetChildren(args.perChildProbeLedgerRows)) {
    const probeClasses = new Set(
      args.perChildProbeLedgerRows.filter((row) => row.targetChild === targetChild).map((row) => row.probeClass),
    );

    if (PROBE_CLASS_ROWS.some((row) => !probeClasses.has(row.probeClass))) {
      issues.push(`Target child ${targetChild} does not have exactly G,E,A+,A-,T.`);
    }
  }

  const approvedRows = args.perChildProbeLedgerRows.filter((row) => row.samplePolicy === 'approved-child-local-probe');
  const transverseRows = args.perChildProbeLedgerRows.filter((row) => row.probeClass === 'T');

  if (approvedRows.some((row) => !row.cleanReadingAllowed)) {
    issues.push('At least one approved probe row is not clean.');
  }

  if (transverseRows.some((row) => row.cleanReadingAllowed)) {
    issues.push('At least one T row was allowed as a clean child-axis reading.');
  }

  if (transverseRows.some((row) => row.ledgerStatus !== 'locality-sensitive-suppressed')) {
    issues.push('At least one T row was not marked locality-sensitive-suppressed.');
  }

  if (args.perChildProbeLedgerRows.some((row) => !relationWeightsPresent(row) || Object.keys(row.sourceWeights).length === 0)) {
    issues.push('At least one ledger row lacks relationClassWeights or sourceWeights.');
  }

  if (args.perChildProbeLedgerRows.some((row) => !vectorDecompositionPresent(row))) {
    issues.push('At least one ledger row lacks phi, magnitude, p, r, or alpha.');
  }

  if (args.perChildProbeLedgerRows.some((row) => !row.cleanReadingAllowed && !row.suppressionReason)) {
    issues.push('At least one suppressed ledger row lacks suppressionReason.');
  }

  if (forbiddenVocabularyAppears(args.perChildProbeLedgerRows, args.sampleClassRows)) {
    issues.push('Forbidden vocabulary appears in T7 ledger fields.');
  }

  return [...new Set(issues)];
}

function classifyVerdict(
  integrityIssues: string[],
  rows: PSimplexT7PerChildProbeLedgerRow[],
): PSimplexT7Verdict {
  if (integrityIssues.length > 0) {
    return 'FAIL';
  }

  const approvedRows = rows.filter((row) => row.samplePolicy === 'approved-child-local-probe');

  if (approvedRows.some((row) => row.alpha >= CLEAN_THRESHOLD && row.alpha < BARELY_CLEAN_UPPER)) {
    return 'PARTIAL';
  }

  return 'PASS';
}

function recommendationForVerdict(verdict: PSimplexT7Verdict): PSimplexT7FinalRecommendation {
  if (verdict === 'PASS') {
    return 'advance-to-minimal-geometry-position-vector-diagnostic-or-sibling-sweep-residual-diagnostic';
  }

  if (verdict === 'PARTIAL') {
    return 'revise-child-local-stencil-policy-before-moving-forward';
  }

  return 'return-to-kernel-locality-policy';
}

function ledgerStatusFor(
  sampleClass: PSimplexT7SampleClassRow,
  k3Row: PSimplexK3PerChildEvidenceRowV0,
): PSimplexT7LedgerStatus {
  if (!sampleClass.authorizedForCleanReading) {
    return sampleClass.probeClass === 'T' ? 'locality-sensitive-suppressed' : 'unauthorized-sample-class';
  }

  if (k3Row.status === 'neutral-by-symmetry') {
    return 'neutral-by-symmetry';
  }

  if (!k3Row.axisCompatible) {
    return 'kernel-artifact-risk';
  }

  if (k3Row.status === 'axis-cancelled') {
    return 'clean-axis-cancelled';
  }

  if (k3Row.alpha < CLEAN_THRESHOLD) {
    return k3Row.status === 'mixed-axis' ? 'mixed-axis' : 'axis-bent';
  }

  if (k3Row.status === 'axis-preserved') {
    return 'clean-axis-preserved';
  }

  if (k3Row.status === 'axis-flipped') {
    return 'clean-axis-flipped';
  }

  if (k3Row.status === 'mixed-axis') {
    return 'mixed-axis';
  }

  if (k3Row.status === 'axis-bent') {
    return 'axis-bent';
  }

  return 'kernel-artifact-risk';
}

function cleanReadingAllowedFor(
  sampleClass: PSimplexT7SampleClassRow,
  ledgerStatus: PSimplexT7LedgerStatus,
): boolean {
  if (!sampleClass.authorizedForCleanReading) {
    return false;
  }

  return (
    ledgerStatus === 'clean-axis-preserved' ||
    ledgerStatus === 'clean-axis-flipped' ||
    ledgerStatus === 'clean-axis-cancelled' ||
    ledgerStatus === 'neutral-by-symmetry'
  );
}

function suppressionReasonFor(
  sampleClass: PSimplexT7SampleClassRow,
  k3Row: PSimplexK3PerChildEvidenceRowV0,
  cleanReadingAllowed: boolean,
): string | null {
  if (cleanReadingAllowed) {
    return null;
  }

  if (sampleClass.probeClass === 'T') {
    return ['unauthorized-transverse-diagnostic-class', k3Row.suppressionReason].filter(Boolean).join('; ');
  }

  if (!sampleClass.authorizedForCleanReading) {
    return 'unauthorized-sample-class';
  }

  if (!k3Row.axisCompatible) {
    return 'axis-compatibility-failed';
  }

  if (k3Row.alpha < CLEAN_THRESHOLD) {
    return 'alpha-below-clean-threshold';
  }

  return 'not-clean-under-ledger-policy';
}

function expectedClassificationMatched(sampleClass: PSimplexT7SampleClassRow, cleanReadingAllowed: boolean): boolean {
  return sampleClass.expectedClassification === 'clean' ? cleanReadingAllowed : !cleanReadingAllowed;
}

function sampleClassForK3Family(sampleFamily: PSimplexK3SampleFamily): PSimplexT7SampleClassRow | undefined {
  return PROBE_CLASS_ROWS.find((row) => row.k3SampleFamily === sampleFamily);
}

function thresholdMarginClassFor(k3Row: PSimplexK3PerChildEvidenceRowV0): PSimplexK3ThresholdMarginClass {
  if (k3Row.magnitude === 0) {
    return 'neutral-or-cancelled';
  }

  if (k3Row.alpha >= 0.999) {
    return 'exact-or-near-perfect';
  }

  if (k3Row.alpha >= 0.95) {
    return 'comfortably-clean';
  }

  if (k3Row.alpha >= CLEAN_THRESHOLD) {
    return 'barely-clean';
  }

  return 'below-clean-threshold';
}

function relationWeightsPresent(row: PSimplexT7PerChildProbeLedgerRow): boolean {
  return Object.keys(row.relationClassWeights).length > 0;
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

function isVec3(value: PSimplexVec3): boolean {
  return value.length === 3 && value.every(Number.isFinite);
}

function countByStatus(rows: PSimplexT7PerChildProbeLedgerRow[]): Record<string, number> {
  return rows.reduce<Record<string, number>>((counts, row) => {
    counts[row.ledgerStatus] = (counts[row.ledgerStatus] ?? 0) + 1;
    return counts;
  }, {});
}

function uniqueTargetChildren(rows: PSimplexT7PerChildProbeLedgerRow[]): PSimplexChildSourceId[] {
  return [...new Set(rows.map((row) => row.targetChild))];
}

function compareLedgerRows(left: PSimplexT7PerChildProbeLedgerRow, right: PSimplexT7PerChildProbeLedgerRow): number {
  const targetOrder = childOrder(left.targetChild) - childOrder(right.targetChild);

  if (targetOrder !== 0) {
    return targetOrder;
  }

  return probeOrder(left.probeClass) - probeOrder(right.probeClass);
}

function childOrder(child: PSimplexChildSourceId): number {
  return ['M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'].indexOf(child);
}

function probeOrder(probeClass: PSimplexT7ProbeClass): number {
  return ['G', 'E', 'A+', 'A-', 'T'].indexOf(probeClass);
}

function minOrZero(values: number[]): number {
  return values.length > 0 ? Math.min(...values) : 0;
}

function maxOrZero(values: number[]): number {
  return values.length > 0 ? Math.max(...values) : 0;
}

function forbiddenVocabularyAppears(
  rows: PSimplexT7PerChildProbeLedgerRow[],
  sampleClassRows: PSimplexT7SampleClassRow[],
): boolean {
  const forbidden = [
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
  ];
  const values = [
    ...sampleClassRows.flatMap((row) => [
      row.description,
      row.expectedClassification,
      row.samplePolicy,
      row.requiredCondition,
    ]),
    ...rows.flatMap((row) => [
      row.underlyingK3Status,
      row.ledgerStatus,
      row.suppressionReason ?? '',
      ...row.axisCompatibilityFailures,
    ]),
  ];

  return values.some((value) => forbidden.some((term) => value.includes(term)));
}

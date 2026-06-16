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
  type PSimplexSourceKind,
  type PSimplexSourceLedgerRowV0,
  type PSimplexVec3,
} from './pSimplexVectorOrderParameterDiagnosticV0';
import { buildPSimplexVectorOrderParameterLocalityDiagnosticV0Report } from './pSimplexVectorOrderParameterLocalityDiagnosticV0';
import {
  buildPSimplexRelationAuditedSamplingDiagnosticV0Report,
  type PSimplexRelationClass,
  type PSimplexSamplingStatus,
} from './pSimplexRelationAuditedSamplingDiagnosticV0';

export type PSimplexK3SampleFamily = 'K3-G' | 'K3-E' | 'K3-A-primary' | 'K3-A-complement' | 'K3-T';
export type PSimplexK3KernelKind = 'graph-distance' | 'euclidean-radial';
export type PSimplexK3PositionRole = 'primal-tetrahedron-vertex' | 'generated-edge-midpoint-child';
export type PSimplexK3ReadabilityStatus =
  | 'axis-preserved'
  | 'axis-flipped'
  | 'axis-cancelled'
  | 'neutral-by-symmetry'
  | 'unreadable-under-axis-policy';
export type PSimplexK3Recommendation =
  | 'proceed-to-minimal-geometry-position-vector-diagnostic'
  | 'define-child-local-sampling-stencil-before-broader-geometry-sampling'
  | 'return-to-kernel-locality-policy';
export type PSimplexK3Verdict = 'PASS' | 'PARTIAL' | 'FAIL';

export interface PSimplexK3GeometrySourceRowV0 {
  sourceId: PSimplexPrimalSourceId | PSimplexChildSourceId;
  generation: 0 | 1;
  sourceKind: PSimplexSourceKind;
  geometryPosition: PSimplexVec3;
  qVector: PSimplexVec3;
  positionRole: PSimplexK3PositionRole;
}

export interface PSimplexK3GraphRowV0 {
  targetChild: PSimplexChildSourceId;
  sourceId: PSimplexPrimalSourceId | PSimplexChildSourceId;
  graphDistance: number | null;
  graphWeight: number;
  relationClass: PSimplexRelationClass;
}

export interface PSimplexK3SampleRowV0 {
  sampleId: string;
  targetChild: PSimplexChildSourceId;
  sampleFamily: PSimplexK3SampleFamily;
  samplePositionType:
    | 'target-child-graph-node'
    | 'exact-child-position'
    | 'axial-primary-offset'
    | 'axial-complement-offset'
    | 'transverse-sibling-midpoint';
  samplePosition: PSimplexVec3;
  kernelKind: PSimplexK3KernelKind;
  relationClassWeights: Record<PSimplexRelationClass, number[]>;
  sourceWeights: Record<string, number>;
  axisCompatible: boolean;
  axisCompatibilityFailures: string[];
}

export interface PSimplexK3VectorResultRowV0 {
  sampleId: string;
  targetChild: PSimplexChildSourceId;
  phi: PSimplexVec3;
  magnitude: number;
  axisProjection: number;
  transverseResidualVector: PSimplexVec3;
  transverseResidualMagnitude: number;
  axisAlignment: number;
  status: PSimplexSamplingStatus;
  cleanReadingAllowed: boolean;
  readabilityStatus: PSimplexK3ReadabilityStatus;
  suppressionReason: string | null;
}

export interface PSimplexK3LocalityAuditRowV0 {
  sampleId: string;
  targetChild: PSimplexChildSourceId;
  sampleFamily: PSimplexK3SampleFamily;
  axisCompatible: boolean;
  localitySensitive: boolean;
  siblingLeakageAmount: number;
  nonlocalLeakageAmount: number;
  transverseResidualMagnitude: number;
  axisAlignment: number;
  kernelArtifactRisk: boolean;
  cleanReadingAllowed: boolean;
  suppressionReason: string | null;
  notes: string;
}

export interface PSimplexK3ContinuityControlRowV0 {
  controlId: 'C0' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5';
  controlKind:
    | 'k0-uniform-accumulated-control'
    | 'k1-axis-local-relation-stencil'
    | 'k2-one-sibling-leakage-suppression'
    | 'k4-pair-cancelled-relation-graph'
    | 'child-only-amputation-invalid-control'
    | 'scalar-and-status-reduction-rejection';
  expectedResult: string;
  observedResult: string;
  ok: boolean;
}

export interface PSimplexGeometryGraphSamplingGateK3SummaryV0 {
  activeSourceCount: number;
  targetChildCount: number;
  geometrySourceCount: number;
  graphRowCount: number;
  k3SampleCount: number;
  k3GraphSampleCount: number;
  k3ExactChildPositionSampleCount: number;
  k3AxialOffsetSampleCount: number;
  k3TransverseOffsetSampleCount: number;
  axisCompatibleCount: number;
  axisIncompatibleCount: number;
  cleanReadingAllowedCount: number;
  suppressedReadingCount: number;
  localitySensitiveCount: number;
  kernelArtifactRiskCount: number;
  k3ExactCleanCount: number;
  k3AxialCleanCount: number;
  k3TransverseSuppressedCount: number;
}

export interface PSimplexGeometryGraphSamplingGateK3V0Report {
  method: 'p-simplex-geometry-graph-sampling-gate-k3-v0';
  candidatePackage: 'p-simplex-vop-v0.3-k3-geometry-graph-gate';
  parentVectorDiagnostic: 'p-simplex-vector-order-parameter-diagnostic-v0';
  parentLocalityDiagnostic: 'p-simplex-vector-order-parameter-locality-diagnostic-v0';
  parentRelationAuditDiagnostic: 'p-simplex-relation-audited-sampling-diagnostic-v0';
  diagnosticScope: 'finite-k3-graph-and-geometry-position-sampling-only';
  vectorCarrierStatus: 'r3-vector-order-parameter';
  solverStatus: 'not-lg-solver';
  atlasImplementationStatus: 'not-field-atlas';
  renderingStatus: 'not-rendering';
  fieldCueStatus: 'not-field-cue';
  semanticStatus: 'not-semantic-naming';
  routeStatus: 'no-route-walk-holonomy';
  denseSamplingStatus: 'not-dense-surface-sampling';
  sourcePopulationPolicy: 'accumulated-sources-s-leq-1';
  parentVectorDiagnosticStillPasses: boolean;
  parentLocalityDiagnosticStillPasses: boolean;
  parentRelationAuditDiagnosticStillPasses: boolean;
  geometrySourceRows: PSimplexK3GeometrySourceRowV0[];
  graphRows: PSimplexK3GraphRowV0[];
  k3SampleRows: PSimplexK3SampleRowV0[];
  k3VectorResultRows: PSimplexK3VectorResultRowV0[];
  k3LocalityAuditRows: PSimplexK3LocalityAuditRowV0[];
  continuityControlRows: PSimplexK3ContinuityControlRowV0[];
  summary: PSimplexGeometryGraphSamplingGateK3SummaryV0;
  finalRecommendation: PSimplexK3Recommendation;
  verdict: PSimplexK3Verdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface SourceRecord {
  sourceId: PSimplexPrimalSourceId | PSimplexChildSourceId;
  generation: 0 | 1;
  sourceKind: PSimplexSourceKind;
  q: PSimplexVec3;
  endpoints?: [PSimplexPrimalSourceId, PSimplexPrimalSourceId];
  complementEdge?: PSimplexChildEdgeId;
  antipodalPartner?: PSimplexChildSourceId;
}

interface TargetRecord extends SourceRecord {
  sourceId: PSimplexChildSourceId;
  generation: 1;
  sourceKind: 'child';
  endpoints: [PSimplexPrimalSourceId, PSimplexPrimalSourceId];
  complementEdge: PSimplexChildEdgeId;
  antipodalPartner: PSimplexChildSourceId;
  complementEndpoints: [PSimplexPrimalSourceId, PSimplexPrimalSourceId];
  targetAxis: PSimplexVec3;
  geometryPosition: PSimplexVec3;
}

interface GeometrySourceRecord extends SourceRecord {
  geometryPosition: PSimplexVec3;
  positionRole: PSimplexK3PositionRole;
}

const PRIMAL_ORDER: readonly PSimplexPrimalSourceId[] = ['A', 'B', 'C', 'D'];
const CHILD_ORDER: readonly PSimplexChildSourceId[] = ['M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];
const RELATION_CLASSES: readonly PSimplexRelationClass[] = [
  'primary-child',
  'endpoint-parent',
  'complement-parent',
  'complement-child',
  'one-endpoint-sibling-child',
  'nonlocal-other',
];
const AXIS_CLEAN_THRESHOLD = 0.9;
const AXIS_WARNING_THRESHOLD = 0.75;
const AXIS_BENT_THRESHOLD = 0.5;
const ONE_OVER_SQRT_THREE = 1 / Math.sqrt(3);
const OFFSET_FACTOR = 0.25;
const PRIMAL_POSITIONS: Record<PSimplexPrimalSourceId, PSimplexVec3> = {
  A: [ONE_OVER_SQRT_THREE, ONE_OVER_SQRT_THREE, ONE_OVER_SQRT_THREE],
  B: [ONE_OVER_SQRT_THREE, -ONE_OVER_SQRT_THREE, -ONE_OVER_SQRT_THREE],
  C: [-ONE_OVER_SQRT_THREE, ONE_OVER_SQRT_THREE, -ONE_OVER_SQRT_THREE],
  D: [-ONE_OVER_SQRT_THREE, -ONE_OVER_SQRT_THREE, ONE_OVER_SQRT_THREE],
};

export function buildPSimplexGeometryGraphSamplingGateK3V0Report(): PSimplexGeometryGraphSamplingGateK3V0Report {
  const parentVectorReport = buildPSimplexVectorOrderParameterDiagnosticV0Report();
  const parentLocalityReport = buildPSimplexVectorOrderParameterLocalityDiagnosticV0Report();
  const parentRelationReport = buildPSimplexRelationAuditedSamplingDiagnosticV0Report();
  const structuralIssues: string[] = [];
  const sources = deriveSources(parentVectorReport.sourceLedgerRows, structuralIssues);
  const geometrySources = buildGeometrySources(sources, structuralIssues);
  const targetChildren = deriveTargetChildren(geometrySources, structuralIssues);
  const graphRows = buildGraphRows(targetChildren, geometrySources);
  const k3SampleRows = buildK3SampleRows(targetChildren, geometrySources, graphRows);
  const k3VectorResultRows = k3SampleRows.map((sample) => buildK3VectorResultRow(sample, geometrySources, targetChildren));
  const k3LocalityAuditRows = k3SampleRows.map((sample) =>
    buildK3LocalityAuditRow(sample, graphRows, k3VectorResultRows),
  );
  const continuityControlRows = buildContinuityControlRows(parentRelationReport);
  const parentVectorDiagnosticStillPasses = parentVectorReport.ok && parentVectorReport.integrityIssueCount === 0;
  const parentLocalityDiagnosticStillPasses =
    parentLocalityReport.ok && parentLocalityReport.integrityIssueCount === 0;
  const parentRelationAuditDiagnosticStillPasses =
    parentRelationReport.ok && parentRelationReport.integrityIssueCount === 0;
  const summary = buildSummary({
    activeSourceCount: parentVectorReport.activeSourceCount,
    targetChildCount: targetChildren.length,
    geometrySourceRows: geometrySources,
    graphRows,
    k3SampleRows,
    k3VectorResultRows,
    k3LocalityAuditRows,
  });
  const integrityIssues = buildIntegrityIssues({
    structuralIssues,
    parentVectorDiagnosticStillPasses,
    parentLocalityDiagnosticStillPasses,
    parentRelationAuditDiagnosticStillPasses,
    activeSourceCount: parentVectorReport.activeSourceCount,
    geometrySources,
    targetChildren,
    graphRows,
    k3SampleRows,
    k3VectorResultRows,
    k3LocalityAuditRows,
    continuityControlRows,
  });
  const finalRecommendation = chooseFinalRecommendation(k3SampleRows, k3LocalityAuditRows, integrityIssues);
  const verdict = classifyVerdict(integrityIssues, k3SampleRows, k3VectorResultRows, k3LocalityAuditRows);

  return {
    method: 'p-simplex-geometry-graph-sampling-gate-k3-v0',
    candidatePackage: 'p-simplex-vop-v0.3-k3-geometry-graph-gate',
    parentVectorDiagnostic: 'p-simplex-vector-order-parameter-diagnostic-v0',
    parentLocalityDiagnostic: 'p-simplex-vector-order-parameter-locality-diagnostic-v0',
    parentRelationAuditDiagnostic: 'p-simplex-relation-audited-sampling-diagnostic-v0',
    diagnosticScope: 'finite-k3-graph-and-geometry-position-sampling-only',
    vectorCarrierStatus: 'r3-vector-order-parameter',
    solverStatus: 'not-lg-solver',
    atlasImplementationStatus: 'not-field-atlas',
    renderingStatus: 'not-rendering',
    fieldCueStatus: 'not-field-cue',
    semanticStatus: 'not-semantic-naming',
    routeStatus: 'no-route-walk-holonomy',
    denseSamplingStatus: 'not-dense-surface-sampling',
    sourcePopulationPolicy: 'accumulated-sources-s-leq-1',
    parentVectorDiagnosticStillPasses,
    parentLocalityDiagnosticStillPasses,
    parentRelationAuditDiagnosticStillPasses,
    geometrySourceRows: geometrySources.map(toGeometrySourceRow),
    graphRows,
    k3SampleRows,
    k3VectorResultRows,
    k3LocalityAuditRows,
    continuityControlRows,
    summary,
    finalRecommendation,
    verdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: integrityIssues.length === 0,
  };
}

function deriveSources(rows: PSimplexSourceLedgerRowV0[], issues: string[]): SourceRecord[] {
  const sources = rows.map((row): SourceRecord => ({
    sourceId: row.sourceId,
    generation: row.generation,
    sourceKind: row.sourceKind,
    q: row.q,
    endpoints: row.endpoints,
    complementEdge: row.complementEdge,
    antipodalPartner: row.antipodalPartner,
  }));

  if (sources.length !== 10) {
    issues.push(`Expected 10 active sources, got ${sources.length}.`);
  }

  return [...sources].sort(compareSources);
}

function buildGeometrySources(sources: SourceRecord[], issues: string[]): GeometrySourceRecord[] {
  return sources.flatMap((source): GeometrySourceRecord[] => {
    const geometryPosition = geometryPositionForSource(source, issues);

    if (!geometryPosition) {
      return [];
    }

    return [
      {
        ...source,
        geometryPosition,
        positionRole: source.sourceKind === 'primal' ? 'primal-tetrahedron-vertex' : 'generated-edge-midpoint-child',
      },
    ];
  });
}

function deriveTargetChildren(sources: GeometrySourceRecord[], issues: string[]): TargetRecord[] {
  const targets: TargetRecord[] = [];

  for (const childId of CHILD_ORDER) {
    const source = sources.find((candidate) => candidate.sourceId === childId);

    if (!source || !isChildSourceId(source.sourceId) || source.sourceKind !== 'child') {
      issues.push(`Missing target child ${childId}.`);
      continue;
    }

    if (!source.endpoints || !source.complementEdge || !source.antipodalPartner) {
      issues.push(`Target child ${childId} lacks relation metadata.`);
      continue;
    }

    const targetAxis = normalizeVec3(source.q);

    if (!targetAxis) {
      issues.push(`Target child ${childId} has no nonzero q-axis.`);
      continue;
    }

    targets.push({
      ...source,
      sourceId: source.sourceId,
      generation: 1,
      sourceKind: 'child',
      endpoints: source.endpoints,
      complementEdge: source.complementEdge,
      antipodalPartner: source.antipodalPartner,
      complementEndpoints: endpointsForEdge(source.complementEdge),
      targetAxis,
      geometryPosition: source.geometryPosition,
    });
  }

  return targets;
}

function toGeometrySourceRow(source: GeometrySourceRecord): PSimplexK3GeometrySourceRowV0 {
  return {
    sourceId: source.sourceId,
    generation: source.generation,
    sourceKind: source.sourceKind,
    geometryPosition: cleanVec3(source.geometryPosition),
    qVector: cleanVec3(source.q),
    positionRole: source.positionRole,
  };
}

function buildGraphRows(targets: TargetRecord[], sources: GeometrySourceRecord[]): PSimplexK3GraphRowV0[] {
  const graph = buildIncidenceGraph(sources);

  return targets.flatMap((target) => {
    const distances = bfsDistances(target.sourceId, graph);

    return sources.map((source) => {
      const graphDistance = distances.get(source.sourceId) ?? null;

      return {
        targetChild: target.sourceId,
        sourceId: source.sourceId,
        graphDistance,
        graphWeight: cleanNumber(graphDistance === null ? 0 : graphWeight(graphDistance)),
        relationClass: relationClassFor(target, source),
      };
    });
  });
}

function buildK3SampleRows(
  targets: TargetRecord[],
  sources: GeometrySourceRecord[],
  graphRows: PSimplexK3GraphRowV0[],
): PSimplexK3SampleRowV0[] {
  return targets.flatMap((target) => [
    buildGraphSampleRow(target, sources, graphRows),
    buildEuclideanSampleRow(target, sources, 'K3-E', 'exact-child-position', target.geometryPosition),
    buildEuclideanSampleRow(target, sources, 'K3-A-primary', 'axial-primary-offset', axialSamplePosition(target, 1)),
    buildEuclideanSampleRow(target, sources, 'K3-A-complement', 'axial-complement-offset', axialSamplePosition(target, -1)),
    buildEuclideanSampleRow(target, sources, 'K3-T', 'transverse-sibling-midpoint', transverseSamplePosition(target, sources)),
  ]);
}

function buildGraphSampleRow(
  target: TargetRecord,
  sources: GeometrySourceRecord[],
  graphRows: PSimplexK3GraphRowV0[],
): PSimplexK3SampleRowV0 {
  const rowsForTarget = graphRows.filter((row) => row.targetChild === target.sourceId);
  const sourceWeights = Object.fromEntries(
    rowsForTarget.map((row) => [row.sourceId, row.graphWeight]),
  ) as Record<string, number>;

  return buildSampleRow({
    sampleId: `K3-G-${target.sourceId}`,
    target,
    sources,
    sampleFamily: 'K3-G',
    samplePositionType: 'target-child-graph-node',
    samplePosition: target.geometryPosition,
    kernelKind: 'graph-distance',
    sourceWeights,
  });
}

function buildEuclideanSampleRow(
  target: TargetRecord,
  sources: GeometrySourceRecord[],
  sampleFamily: Exclude<PSimplexK3SampleFamily, 'K3-G'>,
  samplePositionType: Exclude<PSimplexK3SampleRowV0['samplePositionType'], 'target-child-graph-node'>,
  samplePosition: PSimplexVec3,
): PSimplexK3SampleRowV0 {
  const sourceWeights = Object.fromEntries(
    sources.map((source) => [source.sourceId, radialWeight(distanceVec3(samplePosition, source.geometryPosition))]),
  ) as Record<string, number>;

  return buildSampleRow({
    sampleId: `${sampleFamily}-${target.sourceId}`,
    target,
    sources,
    sampleFamily,
    samplePositionType,
    samplePosition,
    kernelKind: 'euclidean-radial',
    sourceWeights,
  });
}

function buildSampleRow(args: {
  sampleId: string;
  target: TargetRecord;
  sources: GeometrySourceRecord[];
  sampleFamily: PSimplexK3SampleFamily;
  samplePositionType: PSimplexK3SampleRowV0['samplePositionType'];
  samplePosition: PSimplexVec3;
  kernelKind: PSimplexK3KernelKind;
  sourceWeights: Record<string, number>;
}): PSimplexK3SampleRowV0 {
  const axisCompatibilityFailures = axisCompatibilityFailuresFor(args.target, args.sources, args.sourceWeights);
  const relationRows = args.sources.map((source) => ({
    sourceId: source.sourceId,
    relationClass: relationClassFor(args.target, source),
  }));

  return {
    sampleId: args.sampleId,
    targetChild: args.target.sourceId,
    sampleFamily: args.sampleFamily,
    samplePositionType: args.samplePositionType,
    samplePosition: cleanVec3(args.samplePosition),
    kernelKind: args.kernelKind,
    relationClassWeights: relationClassWeights(relationRows, args.sourceWeights),
    sourceWeights: cleanWeightRecord(args.sourceWeights),
    axisCompatible: axisCompatibilityFailures.length === 0,
    axisCompatibilityFailures,
  };
}

function buildK3VectorResultRow(
  sample: PSimplexK3SampleRowV0,
  sources: GeometrySourceRecord[],
  targets: TargetRecord[],
): PSimplexK3VectorResultRowV0 {
  const target = requireTarget(targets, sample.targetChild);
  const phi = sumVec3(sources.map((source) => scaleVec3(source.q, sample.sourceWeights[source.sourceId] ?? 0)));
  const magnitude = normVec3(phi);
  const axisProjection = dotVec3(phi, target.targetAxis);
  const projected = scaleVec3(target.targetAxis, axisProjection);
  const transverseResidualVector = subVec3(phi, projected);
  const transverseResidualMagnitude = normVec3(transverseResidualVector);
  const axisAlignment = magnitude > EPSILON ? Math.abs(axisProjection) / magnitude : 0;
  const status = classifyStatus(magnitude, transverseResidualMagnitude, axisProjection, axisAlignment);
  const cleanReadingAllowed =
    status === 'neutral-by-symmetry' ||
    status === 'axis-cancelled' ||
    (axisAlignment >= AXIS_CLEAN_THRESHOLD &&
      (status === 'axis-preserved' || status === 'axis-flipped'));
  const suppressionReason = cleanReadingAllowed ? null : 'axis-alignment-below-clean-threshold';

  return {
    sampleId: sample.sampleId,
    targetChild: sample.targetChild,
    phi: cleanVec3(phi),
    magnitude: cleanNumber(magnitude),
    axisProjection: cleanNumber(axisProjection),
    transverseResidualVector: cleanVec3(transverseResidualVector),
    transverseResidualMagnitude: cleanNumber(transverseResidualMagnitude),
    axisAlignment: cleanNumber(axisAlignment),
    status,
    cleanReadingAllowed,
    readabilityStatus: readabilityStatusFor(status, cleanReadingAllowed),
    suppressionReason,
  };
}

function buildK3LocalityAuditRow(
  sample: PSimplexK3SampleRowV0,
  graphRows: PSimplexK3GraphRowV0[],
  vectorRows: PSimplexK3VectorResultRowV0[],
): PSimplexK3LocalityAuditRowV0 {
  const vector = requireVectorResult(vectorRows, sample.sampleId);
  const relationRows = graphRows.filter((row) => row.targetChild === sample.targetChild);
  const siblingLeakageAmount = relationRows
    .filter((row) => row.relationClass === 'one-endpoint-sibling-child')
    .reduce((sum, row) => sum + Math.abs(sample.sourceWeights[row.sourceId] ?? 0), 0);
  const nonlocalLeakageAmount = relationRows
    .filter((row) => row.relationClass === 'nonlocal-other')
    .reduce((sum, row) => sum + Math.abs(sample.sourceWeights[row.sourceId] ?? 0), 0);
  const localitySensitive =
    !sample.axisCompatible ||
    vector.status === 'axis-warning' ||
    vector.status === 'axis-bent' ||
    vector.status === 'mixed-axis';
  const kernelArtifactRisk = !sample.axisCompatible || !vector.cleanReadingAllowed;

  return {
    sampleId: sample.sampleId,
    targetChild: sample.targetChild,
    sampleFamily: sample.sampleFamily,
    axisCompatible: sample.axisCompatible,
    localitySensitive,
    siblingLeakageAmount: cleanNumber(siblingLeakageAmount),
    nonlocalLeakageAmount: cleanNumber(nonlocalLeakageAmount),
    transverseResidualMagnitude: vector.transverseResidualMagnitude,
    axisAlignment: vector.axisAlignment,
    kernelArtifactRisk,
    cleanReadingAllowed: vector.cleanReadingAllowed,
    suppressionReason: vector.suppressionReason,
    notes: localitySensitive
      ? 'K3 sample is locality-sensitive; transverse residual is logged without interpretation and clean reading is gated.'
      : 'K3 sample passed relation symmetry and axis readability gates.',
  };
}

function buildContinuityControlRows(
  relationReport: ReturnType<typeof buildPSimplexRelationAuditedSamplingDiagnosticV0Report>,
): PSimplexK3ContinuityControlRowV0[] {
  const k1Samples = relationReport.sampleRows.filter((row) => row.kernelFamily === 'K1');
  const k1Results = relationReport.vectorResultRows.filter((row) =>
    k1Samples.some((sample) => sample.sampleId === row.sampleId),
  );
  const k2Samples = relationReport.sampleRows.filter((row) => row.kernelFamily === 'K2');
  const k2Audits = relationReport.localityAuditRows.filter((row) =>
    k2Samples.some((sample) => sample.sampleId === row.sampleId),
  );
  const k4Samples = relationReport.sampleRows.filter((row) => row.kernelFamily === 'K4');
  const k4Results = relationReport.vectorResultRows.filter((row) =>
    k4Samples.some((sample) => sample.sampleId === row.sampleId),
  );
  const c0 = relationReport.controlRows.find((row) => row.controlId === 'C0');
  const c1 = relationReport.controlRows.find((row) => row.controlId === 'C1');
  const c2 = relationReport.controlRows.find((row) => row.controlId === 'C2');
  const c3 = relationReport.controlRows.find((row) => row.controlId === 'C3');

  return [
    {
      controlId: 'C0',
      controlKind: 'k0-uniform-accumulated-control',
      expectedResult: 'K0 uniform accumulated control remains neutral',
      observedResult: c0?.observedResult ?? 'missing',
      ok: Boolean(c0?.ok),
    },
    {
      controlId: 'C1',
      controlKind: 'k1-axis-local-relation-stencil',
      expectedResult: 'K1 relation stencils remain axis-compatible and readable',
      observedResult: `axisCompatible=${k1Samples.every((row) => row.axisCompatible)}, suppressed=${k1Results.filter((row) => row.suppressedCleanReading).length}`,
      ok: k1Samples.length === 18 && k1Samples.every((row) => row.axisCompatible) && k1Results.every((row) => !row.suppressedCleanReading),
    },
    {
      controlId: 'C2',
      controlKind: 'k2-one-sibling-leakage-suppression',
      expectedResult: 'K2 leakage remains locality-sensitive and suppressed',
      observedResult: `localitySensitive=${k2Audits.filter((row) => row.localitySensitive).length}, suppressed=${k2Audits.filter((row) => row.suppressedCleanReading).length}`,
      ok:
        k2Audits.length === 6 &&
        k2Audits.every((row) => row.localitySensitive && row.suppressedCleanReading),
    },
    {
      controlId: 'C3',
      controlKind: 'k4-pair-cancelled-relation-graph',
      expectedResult: 'K4 pair-cancelled relation graph remains clean',
      observedResult: `axisCompatible=${k4Samples.every((row) => row.axisCompatible)}, suppressed=${k4Results.filter((row) => row.suppressedCleanReading).length}`,
      ok: k4Samples.length === 6 && k4Samples.every((row) => row.axisCompatible) && k4Results.every((row) => !row.suppressedCleanReading),
    },
    {
      controlId: 'C4',
      controlKind: 'child-only-amputation-invalid-control',
      expectedResult: 'child-only amputation remains invalid as actual model',
      observedResult: c1 ? `ok=${c1.ok}, actualFieldModelValid=${c1.actualFieldModelValid}` : 'missing',
      ok: Boolean(c1?.ok && !c1.actualFieldModelValid),
    },
    {
      controlId: 'C5',
      controlKind: 'scalar-and-status-reduction-rejection',
      expectedResult: 'scalar and status reductions remain rejected',
      observedResult: `scalar=${c2?.observedResult ?? 'missing'}, status=${c3?.observedResult ?? 'missing'}`,
      ok: Boolean(c2?.ok && c3?.ok),
    },
  ];
}

function buildSummary(args: {
  activeSourceCount: number;
  targetChildCount: number;
  geometrySourceRows: GeometrySourceRecord[];
  graphRows: PSimplexK3GraphRowV0[];
  k3SampleRows: PSimplexK3SampleRowV0[];
  k3VectorResultRows: PSimplexK3VectorResultRowV0[];
  k3LocalityAuditRows: PSimplexK3LocalityAuditRowV0[];
}): PSimplexGeometryGraphSamplingGateK3SummaryV0 {
  return {
    activeSourceCount: args.activeSourceCount,
    targetChildCount: args.targetChildCount,
    geometrySourceCount: args.geometrySourceRows.length,
    graphRowCount: args.graphRows.length,
    k3SampleCount: args.k3SampleRows.length,
    k3GraphSampleCount: countSamples(args.k3SampleRows, 'K3-G'),
    k3ExactChildPositionSampleCount: countSamples(args.k3SampleRows, 'K3-E'),
    k3AxialOffsetSampleCount: countSamples(args.k3SampleRows, 'K3-A-primary') + countSamples(args.k3SampleRows, 'K3-A-complement'),
    k3TransverseOffsetSampleCount: countSamples(args.k3SampleRows, 'K3-T'),
    axisCompatibleCount: args.k3SampleRows.filter((row) => row.axisCompatible).length,
    axisIncompatibleCount: args.k3SampleRows.filter((row) => !row.axisCompatible).length,
    cleanReadingAllowedCount: args.k3VectorResultRows.filter((row) => row.cleanReadingAllowed).length,
    suppressedReadingCount: args.k3VectorResultRows.filter((row) => !row.cleanReadingAllowed).length,
    localitySensitiveCount: args.k3LocalityAuditRows.filter((row) => row.localitySensitive).length,
    kernelArtifactRiskCount: args.k3LocalityAuditRows.filter((row) => row.kernelArtifactRisk).length,
    k3ExactCleanCount: cleanCount(args.k3SampleRows, args.k3VectorResultRows, 'K3-E'),
    k3AxialCleanCount:
      cleanCount(args.k3SampleRows, args.k3VectorResultRows, 'K3-A-primary') +
      cleanCount(args.k3SampleRows, args.k3VectorResultRows, 'K3-A-complement'),
    k3TransverseSuppressedCount: suppressedCount(args.k3SampleRows, args.k3VectorResultRows, 'K3-T'),
  };
}

function buildIntegrityIssues(args: {
  structuralIssues: string[];
  parentVectorDiagnosticStillPasses: boolean;
  parentLocalityDiagnosticStillPasses: boolean;
  parentRelationAuditDiagnosticStillPasses: boolean;
  activeSourceCount: number;
  geometrySources: GeometrySourceRecord[];
  targetChildren: TargetRecord[];
  graphRows: PSimplexK3GraphRowV0[];
  k3SampleRows: PSimplexK3SampleRowV0[];
  k3VectorResultRows: PSimplexK3VectorResultRowV0[];
  k3LocalityAuditRows: PSimplexK3LocalityAuditRowV0[];
  continuityControlRows: PSimplexK3ContinuityControlRowV0[];
}): string[] {
  const issues = [...args.structuralIssues];

  if (!args.parentVectorDiagnosticStillPasses) {
    issues.push('Parent vector diagnostic failed.');
  }

  if (!args.parentLocalityDiagnosticStillPasses) {
    issues.push('Parent locality diagnostic failed.');
  }

  if (!args.parentRelationAuditDiagnosticStillPasses) {
    issues.push('Parent relation-audited sampling diagnostic failed.');
  }

  if (args.activeSourceCount !== 10) {
    issues.push(`Expected activeSourceCount=10, got ${args.activeSourceCount}.`);
  }

  if (args.geometrySources.length !== 10) {
    issues.push(`Expected geometry source count 10, got ${args.geometrySources.length}.`);
  }

  if (args.targetChildren.length !== 6) {
    issues.push(`Expected target child count 6, got ${args.targetChildren.length}.`);
  }

  if (args.graphRows.length !== 60) {
    issues.push(`Expected graph row count 60, got ${args.graphRows.length}.`);
  }

  if (args.k3SampleRows.length !== 30) {
    issues.push(`Expected K3 sample count 30, got ${args.k3SampleRows.length}.`);
  }

  for (const family of ['K3-G', 'K3-E', 'K3-A-primary', 'K3-A-complement', 'K3-T'] as const) {
    if (countSamples(args.k3SampleRows, family) !== 6) {
      issues.push(`Expected 6 ${family} samples.`);
    }
  }

  const graphSamples = samplesForFamily(args.k3SampleRows, 'K3-G');
  const exactSamples = samplesForFamily(args.k3SampleRows, 'K3-E');
  const axialSamples = args.k3SampleRows.filter(
    (row) => row.sampleFamily === 'K3-A-primary' || row.sampleFamily === 'K3-A-complement',
  );
  const transverseSamples = samplesForFamily(args.k3SampleRows, 'K3-T');
  const transverseAudits = auditsForFamily(args.k3LocalityAuditRows, 'K3-T');

  if (graphSamples.some((row) => !row.axisCompatible)) {
    issues.push('At least one K3-G graph-distance sample failed axis compatibility.');
  }

  if (exactSamples.some((row) => !row.axisCompatible)) {
    issues.push('At least one K3-E exact child-position sample failed axis compatibility.');
  }

  if (axialSamples.some((row) => !row.axisCompatible)) {
    issues.push('At least one K3-A axial offset sample failed axis compatibility.');
  }

  if (transverseSamples.length !== 6 || transverseSamples.some((row) => row.axisCompatible)) {
    issues.push('K3-T transverse samples were not all axis-incompatible stress probes.');
  }

  if (transverseAudits.length !== 6 || transverseAudits.some((row) => !row.localitySensitive || !row.kernelArtifactRisk)) {
    issues.push('K3-T transverse samples were not all locality-sensitive kernel-artifact risks.');
  }

  if (
    vectorRowsForFamilies(args.k3SampleRows, args.k3VectorResultRows, ['K3-G', 'K3-E']).some(
      (row) => !row.cleanReadingAllowed,
    )
  ) {
    issues.push('K3-G or K3-E produced an unreadable child-axis sample.');
  }

  if (
    vectorRowsForFamilies(args.k3SampleRows, args.k3VectorResultRows, ['K3-T']).some(
      (row) => row.axisAlignment < AXIS_CLEAN_THRESHOLD && row.cleanReadingAllowed,
    )
  ) {
    issues.push('A K3-T transverse sample below the clean threshold was not suppressed.');
  }

  if (args.continuityControlRows.some((row) => !row.ok)) {
    issues.push('At least one parent continuity control failed.');
  }

  if (statusValuesContainForbiddenTerms(args.k3VectorResultRows)) {
    issues.push('A K3 vector status contained forbidden vocabulary.');
  }

  return [...new Set(issues)];
}

function classifyVerdict(
  integrityIssues: string[],
  samples: PSimplexK3SampleRowV0[],
  vectorRows: PSimplexK3VectorResultRowV0[],
  audits: PSimplexK3LocalityAuditRowV0[],
): PSimplexK3Verdict {
  if (integrityIssues.length > 0) {
    return 'FAIL';
  }

  const axialRows = vectorRowsForFamilies(samples, vectorRows, ['K3-A-primary', 'K3-A-complement']);

  if (axialRows.some((row) => !row.cleanReadingAllowed)) {
    return 'PARTIAL';
  }

  if (auditsForFamily(audits, 'K3-T').some((row) => row.localitySensitive)) {
    return 'PASS';
  }

  return 'PARTIAL';
}

function chooseFinalRecommendation(
  samples: PSimplexK3SampleRowV0[],
  audits: PSimplexK3LocalityAuditRowV0[],
  issues: string[],
): PSimplexK3Recommendation {
  if (issues.length > 0) {
    return 'return-to-kernel-locality-policy';
  }

  if (auditsForFamily(audits, 'K3-T').some((row) => row.localitySensitive)) {
    return 'define-child-local-sampling-stencil-before-broader-geometry-sampling';
  }

  const allSamplesClean = samples.every((sample) => sample.axisCompatible);

  return allSamplesClean
    ? 'proceed-to-minimal-geometry-position-vector-diagnostic'
    : 'define-child-local-sampling-stencil-before-broader-geometry-sampling';
}

function geometryPositionForSource(source: SourceRecord, issues: string[]): PSimplexVec3 | null {
  if (source.sourceKind === 'primal' && isPrimalSourceId(source.sourceId)) {
    return PRIMAL_POSITIONS[source.sourceId];
  }

  if (source.sourceKind === 'child' && source.endpoints) {
    return scaleVec3(addVec3(PRIMAL_POSITIONS[source.endpoints[0]], PRIMAL_POSITIONS[source.endpoints[1]]), 0.5);
  }

  issues.push(`Cannot derive geometry position for source ${source.sourceId}.`);
  return null;
}

function axialSamplePosition(target: TargetRecord, direction: 1 | -1): PSimplexVec3 {
  const geometryAxis = normalizeVec3(target.geometryPosition);
  const offset = OFFSET_FACTOR * normVec3(target.geometryPosition);

  return geometryAxis ? addVec3(target.geometryPosition, scaleVec3(geometryAxis, direction * offset)) : target.geometryPosition;
}

function transverseSamplePosition(target: TargetRecord, sources: GeometrySourceRecord[]): PSimplexVec3 {
  const sibling = firstSibling(target, sources);

  return scaleVec3(addVec3(target.geometryPosition, sibling.geometryPosition), 0.5);
}

function buildIncidenceGraph(sources: GeometrySourceRecord[]): Map<string, Set<string>> {
  const graph = new Map<string, Set<string>>();

  for (const source of sources) {
    graph.set(source.sourceId, new Set());
  }

  for (const child of sources.filter((source) => source.sourceKind === 'child')) {
    if (!child.endpoints) {
      continue;
    }

    for (const endpoint of child.endpoints) {
      graph.get(child.sourceId)?.add(endpoint);
      graph.get(endpoint)?.add(child.sourceId);
    }
  }

  return graph;
}

function bfsDistances(start: string, graph: Map<string, Set<string>>): Map<string, number> {
  const distances = new Map<string, number>([[start, 0]]);
  const queue = [start];

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      continue;
    }

    const nextDistance = (distances.get(current) ?? 0) + 1;

    for (const neighbor of graph.get(current) ?? []) {
      if (distances.has(neighbor)) {
        continue;
      }

      distances.set(neighbor, nextDistance);
      queue.push(neighbor);
    }
  }

  return distances;
}

function relationClassFor(target: TargetRecord, source: SourceRecord): PSimplexRelationClass {
  if (source.sourceKind === 'child' && source.sourceId === target.sourceId) {
    return 'primary-child';
  }

  if (source.sourceKind === 'primal' && target.endpoints.includes(source.sourceId as PSimplexPrimalSourceId)) {
    return 'endpoint-parent';
  }

  if (source.sourceKind === 'primal' && target.complementEndpoints.includes(source.sourceId as PSimplexPrimalSourceId)) {
    return 'complement-parent';
  }

  if (source.sourceKind === 'child' && source.sourceId === target.antipodalPartner) {
    return 'complement-child';
  }

  if (source.sourceKind === 'child' && source.endpoints && sharesExactlyOneEndpoint(target.endpoints, source.endpoints)) {
    return 'one-endpoint-sibling-child';
  }

  return 'nonlocal-other';
}

function axisCompatibilityFailuresFor(
  target: TargetRecord,
  sources: GeometrySourceRecord[],
  weights: Record<string, number>,
): string[] {
  const failures: string[] = [];
  const [endpointA, endpointB] = target.endpoints;
  const [complementA, complementB] = target.complementEndpoints;

  if (!nearlyEqual(weights[endpointA], weights[endpointB])) {
    failures.push('endpoint-parent-symmetry-failed');
  }

  if (!nearlyEqual(weights[complementA], weights[complementB])) {
    failures.push('complement-parent-symmetry-failed');
  }

  for (const [left, right] of siblingCancellationPairs(target)) {
    if (!nearlyEqual(weights[left], weights[right])) {
      failures.push(`sibling-pair-symmetry-failed:${left}:${right}`);
    }
  }

  for (const source of sources) {
    if (relationClassFor(target, source) === 'nonlocal-other' && Math.abs(weights[source.sourceId] ?? 0) > EPSILON) {
      failures.push(`nonlocal-source-nonzero:${source.sourceId}`);
    }
  }

  return failures;
}

function classifyStatus(
  magnitude: number,
  residualMagnitude: number,
  axisProjection: number,
  axisAlignment: number,
): PSimplexSamplingStatus {
  if (magnitude <= EPSILON && residualMagnitude <= EPSILON) {
    return 'axis-cancelled';
  }

  if (axisAlignment >= AXIS_CLEAN_THRESHOLD && axisProjection > EPSILON) {
    return 'axis-preserved';
  }

  if (axisAlignment >= AXIS_CLEAN_THRESHOLD && axisProjection < -EPSILON) {
    return 'axis-flipped';
  }

  if (axisAlignment >= AXIS_WARNING_THRESHOLD) {
    return 'axis-warning';
  }

  if (axisAlignment >= AXIS_BENT_THRESHOLD) {
    return 'axis-bent';
  }

  return 'mixed-axis';
}

function readabilityStatusFor(status: PSimplexSamplingStatus, cleanReadingAllowed: boolean): PSimplexK3ReadabilityStatus {
  if (!cleanReadingAllowed) {
    return 'unreadable-under-axis-policy';
  }

  if (
    status === 'axis-preserved' ||
    status === 'axis-flipped' ||
    status === 'axis-cancelled' ||
    status === 'neutral-by-symmetry'
  ) {
    return status;
  }

  return 'unreadable-under-axis-policy';
}

function relationClassWeights(
  rows: Array<{ sourceId: string; relationClass: PSimplexRelationClass }>,
  weights: Record<string, number>,
): Record<PSimplexRelationClass, number[]> {
  return Object.fromEntries(
    RELATION_CLASSES.map((relationClass) => [
      relationClass,
      rows
        .filter((row) => row.relationClass === relationClass)
        .map((row) => cleanNumber(weights[row.sourceId] ?? 0)),
    ]),
  ) as Record<PSimplexRelationClass, number[]>;
}

function graphWeight(distance: number): number {
  return 1 / (1 + distance);
}

function radialWeight(distance: number): number {
  return 1 / (1 + distance);
}

function distanceVec3(left: PSimplexVec3, right: PSimplexVec3): number {
  return normVec3(subVec3(left, right));
}

function firstSibling(target: TargetRecord, sources: GeometrySourceRecord[]): GeometrySourceRecord {
  const sibling = sources
    .filter(
      (source) =>
        source.sourceKind === 'child' &&
        source.sourceId !== target.sourceId &&
        source.sourceId !== target.antipodalPartner &&
        source.endpoints &&
        sharesExactlyOneEndpoint(target.endpoints, source.endpoints),
    )
    .sort(compareSources)[0];

  if (!sibling) {
    throw new Error(`No sibling child found for ${target.sourceId}.`);
  }

  return sibling;
}

function siblingCancellationPairs(target: TargetRecord): Array<[PSimplexChildSourceId, PSimplexChildSourceId]> {
  const [i, j] = target.endpoints;
  const [k, l] = target.complementEndpoints;

  return [
    [childIdForEndpoints(i, k), childIdForEndpoints(j, l)],
    [childIdForEndpoints(i, l), childIdForEndpoints(j, k)],
  ];
}

function childIdForEndpoints(
  left: PSimplexPrimalSourceId,
  right: PSimplexPrimalSourceId,
): PSimplexChildSourceId {
  const edge = [left, right].sort((a, b) => PRIMAL_ORDER.indexOf(a) - PRIMAL_ORDER.indexOf(b)).join('');

  return `M_${edge}` as PSimplexChildSourceId;
}

function endpointsForEdge(edge: PSimplexChildEdgeId): [PSimplexPrimalSourceId, PSimplexPrimalSourceId] {
  return edge.split('') as [PSimplexPrimalSourceId, PSimplexPrimalSourceId];
}

function sharesExactlyOneEndpoint(
  left: [PSimplexPrimalSourceId, PSimplexPrimalSourceId],
  right: [PSimplexPrimalSourceId, PSimplexPrimalSourceId],
): boolean {
  return left.filter((endpoint) => right.includes(endpoint)).length === 1;
}

function requireTarget(targets: TargetRecord[], targetChild: PSimplexChildSourceId): TargetRecord {
  const target = targets.find((candidate) => candidate.sourceId === targetChild);

  if (!target) {
    throw new Error(`Missing target ${targetChild}.`);
  }

  return target;
}

function requireVectorResult(rows: PSimplexK3VectorResultRowV0[], sampleId: string): PSimplexK3VectorResultRowV0 {
  const row = rows.find((candidate) => candidate.sampleId === sampleId);

  if (!row) {
    throw new Error(`Missing K3 vector result ${sampleId}.`);
  }

  return row;
}

function countSamples(rows: PSimplexK3SampleRowV0[], family: PSimplexK3SampleFamily): number {
  return rows.filter((row) => row.sampleFamily === family).length;
}

function cleanCount(
  samples: PSimplexK3SampleRowV0[],
  vectors: PSimplexK3VectorResultRowV0[],
  family: PSimplexK3SampleFamily,
): number {
  const ids = new Set(samplesForFamily(samples, family).map((row) => row.sampleId));

  return vectors.filter((row) => ids.has(row.sampleId) && row.cleanReadingAllowed).length;
}

function suppressedCount(
  samples: PSimplexK3SampleRowV0[],
  vectors: PSimplexK3VectorResultRowV0[],
  family: PSimplexK3SampleFamily,
): number {
  const ids = new Set(samplesForFamily(samples, family).map((row) => row.sampleId));

  return vectors.filter((row) => ids.has(row.sampleId) && !row.cleanReadingAllowed).length;
}

function samplesForFamily(rows: PSimplexK3SampleRowV0[], family: PSimplexK3SampleFamily): PSimplexK3SampleRowV0[] {
  return rows.filter((row) => row.sampleFamily === family);
}

function auditsForFamily(rows: PSimplexK3LocalityAuditRowV0[], family: PSimplexK3SampleFamily): PSimplexK3LocalityAuditRowV0[] {
  return rows.filter((row) => row.sampleFamily === family);
}

function vectorRowsForFamilies(
  samples: PSimplexK3SampleRowV0[],
  vectorRows: PSimplexK3VectorResultRowV0[],
  families: PSimplexK3SampleFamily[],
): PSimplexK3VectorResultRowV0[] {
  const ids = new Set(samples.filter((sample) => families.includes(sample.sampleFamily)).map((sample) => sample.sampleId));

  return vectorRows.filter((row) => ids.has(row.sampleId));
}

function statusValuesContainForbiddenTerms(rows: PSimplexK3VectorResultRowV0[]): boolean {
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
    'semantic interpretation',
  ];

  return rows.some((row) => forbidden.some((term) => row.status.includes(term) || row.readabilityStatus.includes(term)));
}

function cleanWeightRecord(weights: Record<string, number>): Record<string, number> {
  return Object.fromEntries(
    Object.entries(weights)
      .sort(([left], [right]) => sourceOrder(left as PSimplexPrimalSourceId | PSimplexChildSourceId) - sourceOrder(right as PSimplexPrimalSourceId | PSimplexChildSourceId))
      .map(([sourceId, weight]) => [sourceId, cleanNumber(weight)]),
  );
}

function compareSources(left: SourceRecord, right: SourceRecord): number {
  return sourceOrder(left.sourceId) - sourceOrder(right.sourceId);
}

function sourceOrder(sourceId: PSimplexPrimalSourceId | PSimplexChildSourceId): number {
  if (isPrimalSourceId(sourceId)) {
    return PRIMAL_ORDER.indexOf(sourceId);
  }

  return PRIMAL_ORDER.length + CHILD_ORDER.indexOf(sourceId);
}

function isPrimalSourceId(value: string): value is PSimplexPrimalSourceId {
  return PRIMAL_ORDER.includes(value as PSimplexPrimalSourceId);
}

function isChildSourceId(value: string): value is PSimplexChildSourceId {
  return CHILD_ORDER.includes(value as PSimplexChildSourceId);
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

function nearlyEqual(left = 0, right = 0): boolean {
  return Math.abs(left - right) <= EPSILON;
}

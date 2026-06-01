import type {
  ComplexValue,
  FieldChartSemanticRole,
  FieldSourceScalar,
} from './fieldAtlas';
import {
  buildSurfaceSampleGraph,
  type ChartSampleGraph,
  type SurfaceSampleGraph,
  type SurfaceSampleGraphNode,
} from './fieldAtlasSampleGraph';
import type {
  SampledClosedShapeSurfaceAtlas,
  SurfaceChartAtlasSample,
} from './fieldAtlasSurfaceSampling';
import type { FaceId, Vec3 } from '../types/geometry';

export type FieldAtlasIntensityCandidateMethod =
  'chart-local-sample-graph-intensity-candidates-v1';
export type FieldAtlasIntensityCandidateScope = 'chart-local-only';
export type FieldAtlasCandidateGlobalSurfaceContinuity = 'none';
export type FieldAtlasCandidateConfirmationStatus = 'candidate-only';
export type ChartLocalIntensityExtremumKind =
  | 'local-minimum-candidate'
  | 'local-maximum-candidate';
export type ChartLocalExtremumComparison = 'strict' | 'plateau';
export type NearNodeThresholdPolicy = 'chart-local-relative-intensity-and-mixture-v1';

export interface FieldAtlasIntensityCandidateOptions {
  extremaTolerance?: number;
  relativeIntensityEpsilon?: number;
  nearNodeRelativeIntensityMax?: number;
  minEffectiveSourceCount?: number;
}

export interface ResolvedFieldAtlasIntensityCandidateOptions {
  extremaTolerance: number;
  relativeIntensityEpsilon: number;
  nearNodeRelativeIntensityMax: number;
  minEffectiveSourceCount: number;
}

export interface ChartLocalCandidateBase {
  candidateId: string;
  candidateKind:
    | 'chart-local-intensity-extremum-candidate'
    | 'chart-local-near-node-candidate';
  sampleId: string;
  chartId: string;
  chartSemanticRole: FieldChartSemanticRole;
  sourceFaceId: FaceId;
  position: Vec3;
  localChartPosition: [number, number];
  barycentric: [number, number, number];
  psi: ComplexValue;
  intensity: number;
  phase: number;
  relativeIntensity: number;
  neighborCount: number;
  neighborSampleIds: string[];
  effectiveSourceCount: number;
  topContributionRatio: number;
  contributionMagnitudes: FieldSourceScalar[];
  contributionRatios: FieldSourceScalar[];
  confirmationStatus: FieldAtlasCandidateConfirmationStatus;
  method: FieldAtlasIntensityCandidateMethod;
  scope: FieldAtlasIntensityCandidateScope;
  globalSurfaceContinuity: FieldAtlasCandidateGlobalSurfaceContinuity;
  reason: string;
}

export interface ChartLocalIntensityExtremumCandidate extends ChartLocalCandidateBase {
  candidateKind: 'chart-local-intensity-extremum-candidate';
  extremumKind: ChartLocalIntensityExtremumKind;
  comparison: ChartLocalExtremumComparison;
  intensityMarginToNearestNeighbor: number;
}

export interface ChartLocalNearNodeCandidate extends ChartLocalCandidateBase {
  candidateKind: 'chart-local-near-node-candidate';
  thresholdPolicy: NearNodeThresholdPolicy;
  nearNodeRelativeIntensityMax: number;
  minEffectiveSourceCount: number;
  chartMinIntensity: number;
  chartMaxIntensity: number;
  derivedFromExtremumCandidateId: string;
}

export interface ChartIntensityCandidateDiagnostic {
  chartId: string;
  chartSemanticRole: FieldChartSemanticRole;
  sourceFaceId: FaceId;
  sampleCount: number;
  finiteIntensitySampleCount: number;
  neighborEdgeCount: number;
  minIntensity: number;
  maxIntensity: number;
  intensityRange: number;
  nearNodeRelativeIntensityMax: number;
  minEffectiveSourceCount: number;
  intensityExtremumCandidateCount: number;
  localMinimumCandidateCount: number;
  localMaximumCandidateCount: number;
  nearNodeCandidateCount: number;
  underconnected: boolean;
  underconnectedReason?: string;
  method: FieldAtlasIntensityCandidateMethod;
  scope: FieldAtlasIntensityCandidateScope;
  globalSurfaceContinuity: FieldAtlasCandidateGlobalSurfaceContinuity;
}

export interface FieldAtlasIntensityCandidateSummary {
  chartCount: number;
  totalCandidateCount: number;
  totalIntensityExtremumCandidateCount: number;
  totalLocalMinimumCandidateCount: number;
  totalLocalMaximumCandidateCount: number;
  totalNearNodeCandidateCount: number;
  computationalOnlyCandidateCount: number;
  underconnectedChartCount: number;
  method: FieldAtlasIntensityCandidateMethod;
  scope: FieldAtlasIntensityCandidateScope;
  globalSurfaceContinuity: FieldAtlasCandidateGlobalSurfaceContinuity;
}

export interface FieldAtlasIntensityCandidateDiagnostics {
  method: FieldAtlasIntensityCandidateMethod;
  scope: FieldAtlasIntensityCandidateScope;
  globalSurfaceContinuity: FieldAtlasCandidateGlobalSurfaceContinuity;
  thresholdPolicy: NearNodeThresholdPolicy;
  options: ResolvedFieldAtlasIntensityCandidateOptions;
  summary: FieldAtlasIntensityCandidateSummary;
  extremaCandidates: ChartLocalIntensityExtremumCandidate[];
  nearNodeCandidates: ChartLocalNearNodeCandidate[];
  chartDiagnostics: ChartIntensityCandidateDiagnostic[];
  sampleGraph: SurfaceSampleGraph;
}

const METHOD: FieldAtlasIntensityCandidateMethod =
  'chart-local-sample-graph-intensity-candidates-v1';
const SCOPE: FieldAtlasIntensityCandidateScope = 'chart-local-only';
const GLOBAL_SURFACE_CONTINUITY: FieldAtlasCandidateGlobalSurfaceContinuity = 'none';
const THRESHOLD_POLICY: NearNodeThresholdPolicy =
  'chart-local-relative-intensity-and-mixture-v1';

const DEFAULT_EXTREMA_TOLERANCE = 1e-9;
const DEFAULT_RELATIVE_INTENSITY_EPSILON = 1e-12;
const DEFAULT_NEAR_NODE_RELATIVE_INTENSITY_MAX = 0.2;
const DEFAULT_MIN_EFFECTIVE_SOURCE_COUNT = 2;

export function buildIntensityCandidateDiagnostics(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
  options: FieldAtlasIntensityCandidateOptions = {},
): FieldAtlasIntensityCandidateDiagnostics {
  const resolvedOptions = resolveIntensityCandidateOptions(options);
  const sampleGraph = buildSurfaceSampleGraph(sampledAtlas);
  const sampleById = new Map(sampledAtlas.samples.map((sample) => [sample.id, sample]));
  const extremaCandidates: ChartLocalIntensityExtremumCandidate[] = [];
  const nearNodeCandidates: ChartLocalNearNodeCandidate[] = [];
  const chartDiagnostics = sampleGraph.chartGraphs.map((chartGraph) => {
    const chartRange = getChartIntensityRange(chartGraph.nodes, resolvedOptions);
    const chartExtrema = buildChartLocalExtremumCandidates(
      chartGraph,
      sampleById,
      chartRange,
      resolvedOptions,
    );
    const chartNearNodes = buildChartLocalNearNodeCandidates(
      chartExtrema,
      chartRange,
      resolvedOptions,
    );

    extremaCandidates.push(...chartExtrema);
    nearNodeCandidates.push(...chartNearNodes);

    return {
      chartId: chartGraph.chartId,
      chartSemanticRole: chartGraph.chartSemanticRole,
      sourceFaceId: chartGraph.sourceFaceId,
      sampleCount: chartGraph.nodes.length,
      finiteIntensitySampleCount: chartRange.finiteIntensitySampleCount,
      neighborEdgeCount: chartGraph.edges.length,
      minIntensity: chartRange.minIntensity,
      maxIntensity: chartRange.maxIntensity,
      intensityRange: chartRange.intensityRange,
      nearNodeRelativeIntensityMax: resolvedOptions.nearNodeRelativeIntensityMax,
      minEffectiveSourceCount: resolvedOptions.minEffectiveSourceCount,
      intensityExtremumCandidateCount: chartExtrema.length,
      localMinimumCandidateCount: chartExtrema.filter(
        (candidate) => candidate.extremumKind === 'local-minimum-candidate',
      ).length,
      localMaximumCandidateCount: chartExtrema.filter(
        (candidate) => candidate.extremumKind === 'local-maximum-candidate',
      ).length,
      nearNodeCandidateCount: chartNearNodes.length,
      underconnected: chartGraph.summary.underconnected,
      ...(chartGraph.summary.underconnectedReason
        ? { underconnectedReason: chartGraph.summary.underconnectedReason }
        : {}),
      method: METHOD,
      scope: SCOPE,
      globalSurfaceContinuity: GLOBAL_SURFACE_CONTINUITY,
    };
  });
  const summary = buildCandidateSummary(
    sampleGraph,
    extremaCandidates,
    nearNodeCandidates,
  );

  return {
    method: METHOD,
    scope: SCOPE,
    globalSurfaceContinuity: GLOBAL_SURFACE_CONTINUITY,
    thresholdPolicy: THRESHOLD_POLICY,
    options: resolvedOptions,
    summary,
    extremaCandidates,
    nearNodeCandidates,
    chartDiagnostics,
    sampleGraph,
  };
}

export function findChartLocalIntensityExtrema(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
  options: FieldAtlasIntensityCandidateOptions = {},
): ChartLocalIntensityExtremumCandidate[] {
  return buildIntensityCandidateDiagnostics(sampledAtlas, options).extremaCandidates;
}

export function findChartLocalNearNodeCandidates(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
  options: FieldAtlasIntensityCandidateOptions = {},
): ChartLocalNearNodeCandidate[] {
  return buildIntensityCandidateDiagnostics(sampledAtlas, options).nearNodeCandidates;
}

export function resolveIntensityCandidateOptions(
  options: FieldAtlasIntensityCandidateOptions = {},
): ResolvedFieldAtlasIntensityCandidateOptions {
  return {
    extremaTolerance: finiteNonnegative(
      options.extremaTolerance,
      DEFAULT_EXTREMA_TOLERANCE,
    ),
    relativeIntensityEpsilon: finitePositive(
      options.relativeIntensityEpsilon,
      DEFAULT_RELATIVE_INTENSITY_EPSILON,
    ),
    nearNodeRelativeIntensityMax: clamp(
      finiteNonnegative(
        options.nearNodeRelativeIntensityMax,
        DEFAULT_NEAR_NODE_RELATIVE_INTENSITY_MAX,
      ),
      0,
      1,
    ),
    minEffectiveSourceCount: finiteNonnegative(
      options.minEffectiveSourceCount,
      DEFAULT_MIN_EFFECTIVE_SOURCE_COUNT,
    ),
  };
}

function buildChartLocalExtremumCandidates(
  chartGraph: ChartSampleGraph,
  sampleById: Map<string, SurfaceChartAtlasSample>,
  chartRange: ChartIntensityRange,
  options: ResolvedFieldAtlasIntensityCandidateOptions,
): ChartLocalIntensityExtremumCandidate[] {
  const neighborsBySampleId = buildNeighborsBySampleId(chartGraph);
  const candidates: ChartLocalIntensityExtremumCandidate[] = [];

  for (const node of chartGraph.nodes) {
    if (!Number.isFinite(node.intensity)) {
      continue;
    }

    const sample = sampleById.get(node.sampleId);
    const neighborNodes = (neighborsBySampleId.get(node.sampleId) ?? []).filter((neighbor) =>
      Number.isFinite(neighbor.intensity),
    );

    if (!sample || !neighborNodes.length) {
      continue;
    }

    const minimumComparison = classifyLocalMinimumComparison(
      node.intensity,
      neighborNodes,
      options.extremaTolerance,
    );

    if (minimumComparison) {
      candidates.push(
        buildExtremumCandidate(sample, node, neighborNodes, chartRange, {
          extremumKind: 'local-minimum-candidate',
          comparison: minimumComparison,
        }),
      );
    }

    const maximumComparison = classifyLocalMaximumComparison(
      node.intensity,
      neighborNodes,
      options.extremaTolerance,
    );

    if (maximumComparison) {
      candidates.push(
        buildExtremumCandidate(sample, node, neighborNodes, chartRange, {
          extremumKind: 'local-maximum-candidate',
          comparison: maximumComparison,
        }),
      );
    }
  }

  return candidates.sort((first, second) => first.candidateId.localeCompare(second.candidateId));
}

function buildChartLocalNearNodeCandidates(
  extremaCandidates: ChartLocalIntensityExtremumCandidate[],
  chartRange: ChartIntensityRange,
  options: ResolvedFieldAtlasIntensityCandidateOptions,
): ChartLocalNearNodeCandidate[] {
  return extremaCandidates
    .filter((candidate) => candidate.extremumKind === 'local-minimum-candidate')
    .filter(
      (candidate) =>
        candidate.relativeIntensity <= options.nearNodeRelativeIntensityMax &&
        candidate.effectiveSourceCount >= options.minEffectiveSourceCount,
    )
    .map((candidate) => ({
      ...copyCandidateBase(candidate, {
        candidateId: `field-candidate:chart-local-near-node:${candidate.chartId}:${candidate.sampleId}`,
        candidateKind: 'chart-local-near-node-candidate',
        reason:
          `Local minimum candidate has relativeIntensity=${formatDiagnosticNumber(
            candidate.relativeIntensity,
          )} <= ${formatDiagnosticNumber(options.nearNodeRelativeIntensityMax)} and ` +
          `effectiveSourceCount=${formatDiagnosticNumber(
            candidate.effectiveSourceCount,
          )} >= ${formatDiagnosticNumber(options.minEffectiveSourceCount)}.`,
      }),
      candidateKind: 'chart-local-near-node-candidate' as const,
      thresholdPolicy: THRESHOLD_POLICY,
      nearNodeRelativeIntensityMax: options.nearNodeRelativeIntensityMax,
      minEffectiveSourceCount: options.minEffectiveSourceCount,
      chartMinIntensity: chartRange.minIntensity,
      chartMaxIntensity: chartRange.maxIntensity,
      derivedFromExtremumCandidateId: candidate.candidateId,
    }))
    .sort((first, second) => first.candidateId.localeCompare(second.candidateId));
}

function buildExtremumCandidate(
  sample: SurfaceChartAtlasSample,
  node: SurfaceSampleGraphNode,
  neighborNodes: SurfaceSampleGraphNode[],
  chartRange: ChartIntensityRange,
  comparison: {
    extremumKind: ChartLocalIntensityExtremumKind;
    comparison: ChartLocalExtremumComparison;
  },
): ChartLocalIntensityExtremumCandidate {
  const neighborIntensities = neighborNodes.map((neighbor) => neighbor.intensity);
  const margin =
    comparison.extremumKind === 'local-minimum-candidate'
      ? Math.min(...neighborIntensities.map((intensity) => intensity - node.intensity))
      : Math.min(...neighborIntensities.map((intensity) => node.intensity - intensity));
  const relation =
    comparison.extremumKind === 'local-minimum-candidate'
      ? '<= all chart-local neighbors'
      : '>= all chart-local neighbors';

  return {
    ...buildCandidateBase(sample, node, neighborNodes, chartRange, {
      candidateId: `field-candidate:chart-local-intensity-extremum:${comparison.extremumKind}:${node.chartId}:${node.sampleId}`,
      candidateKind: 'chart-local-intensity-extremum-candidate',
      reason: `Sample is ${relation} across ${neighborNodes.length} chart-local neighbor(s).`,
    }),
    candidateKind: 'chart-local-intensity-extremum-candidate',
    extremumKind: comparison.extremumKind,
    comparison: comparison.comparison,
    intensityMarginToNearestNeighbor: margin,
  };
}

function buildCandidateBase(
  sample: SurfaceChartAtlasSample,
  node: SurfaceSampleGraphNode,
  neighborNodes: SurfaceSampleGraphNode[],
  chartRange: ChartIntensityRange,
  options: {
    candidateId: string;
    candidateKind: ChartLocalCandidateBase['candidateKind'];
    reason: string;
  },
): ChartLocalCandidateBase {
  const mixture = computeContributionMixture(sample.contributionRatios);

  return {
    candidateId: options.candidateId,
    candidateKind: options.candidateKind,
    sampleId: sample.id,
    chartId: node.chartId,
    chartSemanticRole: node.chartSemanticRole,
    sourceFaceId: node.sourceFaceId,
    position: copyVec3(sample.position),
    localChartPosition: [node.localChartPosition[0], node.localChartPosition[1]],
    barycentric: [node.barycentric[0], node.barycentric[1], node.barycentric[2]],
    psi: { re: sample.psi.re, im: sample.psi.im },
    intensity: sample.intensity,
    phase: sample.phase,
    relativeIntensity: computeRelativeIntensity(sample.intensity, chartRange),
    neighborCount: neighborNodes.length,
    neighborSampleIds: neighborNodes.map((neighbor) => neighbor.sampleId).sort(),
    effectiveSourceCount: mixture.effectiveSourceCount,
    topContributionRatio: mixture.topContributionRatio,
    contributionMagnitudes: copySourceScalars(sample.contributionMagnitudes),
    contributionRatios: copySourceScalars(sample.contributionRatios),
    confirmationStatus: 'candidate-only',
    method: METHOD,
    scope: SCOPE,
    globalSurfaceContinuity: GLOBAL_SURFACE_CONTINUITY,
    reason: options.reason,
  };
}

function copyCandidateBase(
  candidate: ChartLocalIntensityExtremumCandidate,
  options: {
    candidateId: string;
    candidateKind: 'chart-local-near-node-candidate';
    reason: string;
  },
): ChartLocalCandidateBase {
  return {
    candidateId: options.candidateId,
    candidateKind: options.candidateKind,
    sampleId: candidate.sampleId,
    chartId: candidate.chartId,
    chartSemanticRole: candidate.chartSemanticRole,
    sourceFaceId: candidate.sourceFaceId,
    position: copyVec3(candidate.position),
    localChartPosition: [candidate.localChartPosition[0], candidate.localChartPosition[1]],
    barycentric: [candidate.barycentric[0], candidate.barycentric[1], candidate.barycentric[2]],
    psi: { re: candidate.psi.re, im: candidate.psi.im },
    intensity: candidate.intensity,
    phase: candidate.phase,
    relativeIntensity: candidate.relativeIntensity,
    neighborCount: candidate.neighborCount,
    neighborSampleIds: [...candidate.neighborSampleIds],
    effectiveSourceCount: candidate.effectiveSourceCount,
    topContributionRatio: candidate.topContributionRatio,
    contributionMagnitudes: copySourceScalars(candidate.contributionMagnitudes),
    contributionRatios: copySourceScalars(candidate.contributionRatios),
    confirmationStatus: candidate.confirmationStatus,
    method: candidate.method,
    scope: candidate.scope,
    globalSurfaceContinuity: candidate.globalSurfaceContinuity,
    reason: options.reason,
  };
}

function classifyLocalMinimumComparison(
  intensity: number,
  neighborNodes: SurfaceSampleGraphNode[],
  tolerance: number,
): ChartLocalExtremumComparison | null {
  if (neighborNodes.some((neighbor) => intensity > neighbor.intensity + tolerance)) {
    return null;
  }

  const strictlyLowerCount = neighborNodes.filter(
    (neighbor) => intensity < neighbor.intensity - tolerance,
  ).length;

  if (!strictlyLowerCount) {
    return null;
  }

  return strictlyLowerCount === neighborNodes.length ? 'strict' : 'plateau';
}

function classifyLocalMaximumComparison(
  intensity: number,
  neighborNodes: SurfaceSampleGraphNode[],
  tolerance: number,
): ChartLocalExtremumComparison | null {
  if (neighborNodes.some((neighbor) => intensity < neighbor.intensity - tolerance)) {
    return null;
  }

  const strictlyHigherCount = neighborNodes.filter(
    (neighbor) => intensity > neighbor.intensity + tolerance,
  ).length;

  if (!strictlyHigherCount) {
    return null;
  }

  return strictlyHigherCount === neighborNodes.length ? 'strict' : 'plateau';
}

function buildNeighborsBySampleId(
  chartGraph: ChartSampleGraph,
): Map<string, SurfaceSampleGraphNode[]> {
  const nodeById = new Map(chartGraph.nodes.map((node) => [node.sampleId, node]));
  const neighborsBySampleId = new Map<string, SurfaceSampleGraphNode[]>();

  for (const node of chartGraph.nodes) {
    neighborsBySampleId.set(node.sampleId, []);
  }

  for (const edge of chartGraph.edges) {
    const first = nodeById.get(edge.sampleIds[0]);
    const second = nodeById.get(edge.sampleIds[1]);

    if (!first || !second) {
      continue;
    }

    neighborsBySampleId.get(first.sampleId)?.push(second);
    neighborsBySampleId.get(second.sampleId)?.push(first);
  }

  return neighborsBySampleId;
}

interface ChartIntensityRange {
  minIntensity: number;
  maxIntensity: number;
  intensityRange: number;
  relativeIntensityDenominator: number;
  finiteIntensitySampleCount: number;
}

function getChartIntensityRange(
  nodes: SurfaceSampleGraphNode[],
  options: ResolvedFieldAtlasIntensityCandidateOptions,
): ChartIntensityRange {
  const finiteIntensities = nodes
    .map((node) => node.intensity)
    .filter((intensity) => Number.isFinite(intensity));
  const range = getIntensityRange(finiteIntensities);
  const intensityRange = range.maxIntensity - range.minIntensity;

  return {
    minIntensity: range.minIntensity,
    maxIntensity: range.maxIntensity,
    intensityRange,
    relativeIntensityDenominator: Math.max(
      options.relativeIntensityEpsilon,
      intensityRange,
    ),
    finiteIntensitySampleCount: finiteIntensities.length,
  };
}

function getIntensityRange(values: number[]): { minIntensity: number; maxIntensity: number } {
  const finiteValues = values.filter((value) => Number.isFinite(value));

  if (!finiteValues.length) {
    return { minIntensity: 0, maxIntensity: 0 };
  }

  return finiteValues.reduce(
    (range, value) => ({
      minIntensity: Math.min(range.minIntensity, value),
      maxIntensity: Math.max(range.maxIntensity, value),
    }),
    {
      minIntensity: Number.POSITIVE_INFINITY,
      maxIntensity: Number.NEGATIVE_INFINITY,
    },
  );
}

function computeRelativeIntensity(intensity: number, chartRange: ChartIntensityRange): number {
  return (intensity - chartRange.minIntensity) / chartRange.relativeIntensityDenominator;
}

function computeContributionMixture(ratios: FieldSourceScalar[]): {
  effectiveSourceCount: number;
  topContributionRatio: number;
} {
  const ratioValues = ratios
    .map((ratio) => ratio.value)
    .filter((ratio) => Number.isFinite(ratio) && ratio >= 0);
  const ratioSquareSum = ratioValues.reduce((sum, ratio) => sum + ratio * ratio, 0);
  const topContributionRatio = ratioValues.length ? Math.max(...ratioValues) : 0;

  return {
    effectiveSourceCount: ratioSquareSum > 0 ? 1 / ratioSquareSum : 0,
    topContributionRatio,
  };
}

function buildCandidateSummary(
  sampleGraph: SurfaceSampleGraph,
  extremaCandidates: ChartLocalIntensityExtremumCandidate[],
  nearNodeCandidates: ChartLocalNearNodeCandidate[],
): FieldAtlasIntensityCandidateSummary {
  const allCandidates = [...extremaCandidates, ...nearNodeCandidates];

  return {
    chartCount: sampleGraph.summary.chartCount,
    totalCandidateCount: allCandidates.length,
    totalIntensityExtremumCandidateCount: extremaCandidates.length,
    totalLocalMinimumCandidateCount: extremaCandidates.filter(
      (candidate) => candidate.extremumKind === 'local-minimum-candidate',
    ).length,
    totalLocalMaximumCandidateCount: extremaCandidates.filter(
      (candidate) => candidate.extremumKind === 'local-maximum-candidate',
    ).length,
    totalNearNodeCandidateCount: nearNodeCandidates.length,
    computationalOnlyCandidateCount: allCandidates.filter(
      (candidate) => candidate.chartSemanticRole === 'computational-only',
    ).length,
    underconnectedChartCount: sampleGraph.summary.underconnectedChartCount,
    method: METHOD,
    scope: SCOPE,
    globalSurfaceContinuity: GLOBAL_SURFACE_CONTINUITY,
  };
}

function finiteNonnegative(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : fallback;
}

function finitePositive(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function copySourceScalars(values: FieldSourceScalar[]): FieldSourceScalar[] {
  return values.map((value) => ({
    sourceId: value.sourceId,
    vertexId: value.vertexId,
    value: value.value,
  }));
}

function copyVec3(position: Vec3): Vec3 {
  return [position[0], position[1], position[2]];
}

function formatDiagnosticNumber(value: number): string {
  return Number.isFinite(value) ? value.toExponential(6) : String(value);
}

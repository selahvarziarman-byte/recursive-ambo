import type {
  FieldAtlasSourceKind,
  FieldChartSemanticRole,
} from './fieldAtlas';
import {
  buildIntensityCandidateDiagnostics,
  type ChartLocalIntensityExtremumCandidate,
  type ChartLocalNearNodeCandidate,
  type FieldAtlasIntensityCandidateOptions,
} from './fieldAtlasIntensityCandidates';
import {
  buildSurfaceSampleGraph,
  type SurfaceSampleGraph,
} from './fieldAtlasSampleGraph';
import {
  sampleClosedShapeSurfaceAtlas,
  type SampledClosedShapeSurfaceAtlas,
  type SurfaceChartSamplingOptions,
} from './fieldAtlasSurfaceSampling';
import type { FaceId, Shape, Vec3 } from '../types/geometry';

export type FieldFeatureReportMethod = 'field-feature-report-v0';
export type FieldFeatureReportScope = 'chart-local-only';
export type FieldFeatureReportGlobalSurfaceContinuity = 'none';
export type FieldFeatureReportSemanticStatus = 'not-semantic-naming';
export type FieldFeatureReportObservationStatus = 'report-candidate';
export type FieldFeatureObservationKind =
  | 'cancellation-like-site-candidate'
  | 'high-intensity-anchor-candidate'
  | 'ambiguous-field-site';
export type FieldFeatureReportStatus = 'supported' | 'unsupported';

export interface FieldFeatureReportOptions {
  sampling?: SurfaceChartSamplingOptions;
  intensityCandidates?: FieldAtlasIntensityCandidateOptions;
  highIntensityRelativeMin?: number;
  maxCancellationLike?: number;
  maxHighIntensityAnchors?: number;
  maxAmbiguous?: number;
}

export interface ResolvedFieldFeatureReportOptions {
  sampling?: SurfaceChartSamplingOptions;
  intensityCandidates: FieldAtlasIntensityCandidateOptions;
  highIntensityRelativeMin: number;
  maxCancellationLike: number;
  maxHighIntensityAnchors: number;
  maxAmbiguous: number;
}

export interface FieldFeatureReportSourceSummary {
  totalSources: number;
  generatedSources: number;
  amboMidpointSources: number;
}

export interface FieldFeatureReportAtlasSummary {
  chartCount: number;
  sampleCount: number;
  intensityRange: {
    min: number;
    max: number;
  };
  underconnectedChartCount: number;
  computationalOnlyChartCount: number;
}

export interface FieldFeatureReportObservationSummary {
  totalObservations: number;
  cancellationLikeCount: number;
  highIntensityAnchorCount: number;
  ambiguousCount: number;
  computationalOnlyObservationCount: number;
}

export interface FieldFeatureReportObservation {
  observationId: string;
  observationKind: FieldFeatureObservationKind;
  sourceCandidateId?: string;
  sourceCandidateKind?:
    | 'chart-local-intensity-extremum-candidate'
    | 'chart-local-near-node-candidate';
  sourceExtremumKind?: 'local-minimum-candidate' | 'local-maximum-candidate';
  sampleId: string;
  chartId: string;
  chartSemanticRole: FieldChartSemanticRole;
  sourceFaceId: FaceId;
  position: Vec3;
  localChartPosition: [number, number];
  intensity: number;
  phase: number;
  relativeIntensity: number;
  effectiveSourceCount: number;
  topContributionRatio: number;
  status: FieldFeatureReportObservationStatus;
  semanticStatus: FieldFeatureReportSemanticStatus;
  scope: FieldFeatureReportScope;
  globalSurfaceContinuity: FieldFeatureReportGlobalSurfaceContinuity;
  reason: string;
}

export interface SupportedFieldFeatureReport {
  reportId: string;
  status: 'supported';
  method: FieldFeatureReportMethod;
  scope: FieldFeatureReportScope;
  globalSurfaceContinuity: FieldFeatureReportGlobalSurfaceContinuity;
  semanticStatus: FieldFeatureReportSemanticStatus;
  sourceSummary: FieldFeatureReportSourceSummary;
  atlasSummary: FieldFeatureReportAtlasSummary;
  observationSummary: FieldFeatureReportObservationSummary;
  observations: FieldFeatureReportObservation[];
  options: ResolvedFieldFeatureReportOptions;
}

export interface UnsupportedFieldFeatureReport {
  reportId: string;
  status: 'unsupported';
  method: FieldFeatureReportMethod;
  scope: FieldFeatureReportScope;
  globalSurfaceContinuity: FieldFeatureReportGlobalSurfaceContinuity;
  semanticStatus: FieldFeatureReportSemanticStatus;
  reason: string;
  observations: [];
  options: ResolvedFieldFeatureReportOptions;
}

export type FieldFeatureReport =
  | SupportedFieldFeatureReport
  | UnsupportedFieldFeatureReport;

type FieldFeatureSourceCandidate =
  | ChartLocalIntensityExtremumCandidate
  | ChartLocalNearNodeCandidate;

const METHOD: FieldFeatureReportMethod = 'field-feature-report-v0';
const SCOPE: FieldFeatureReportScope = 'chart-local-only';
const GLOBAL_SURFACE_CONTINUITY: FieldFeatureReportGlobalSurfaceContinuity = 'none';
const SEMANTIC_STATUS: FieldFeatureReportSemanticStatus = 'not-semantic-naming';
const OBSERVATION_STATUS: FieldFeatureReportObservationStatus = 'report-candidate';
const DEFAULT_HIGH_INTENSITY_RELATIVE_MIN = 0.8;
const DEFAULT_MAX_CANCELLATION_LIKE = 8;
const DEFAULT_MAX_HIGH_INTENSITY_ANCHORS = 8;
const DEFAULT_MAX_AMBIGUOUS = 8;
const BOUNDARY_EPSILON = 1e-12;

export function buildFieldFeatureReport(
  shape: Shape,
  options: FieldFeatureReportOptions = {},
): FieldFeatureReport {
  const resolvedOptions = resolveFieldFeatureReportOptions(options);

  try {
    return buildFieldFeatureReportFromAtlas(
      sampleClosedShapeSurfaceAtlas(shape, resolvedOptions.sampling),
      resolvedOptions,
    );
  } catch (error) {
    return {
      reportId: `field-feature-report-v0:unsupported:${shape.id}`,
      status: 'unsupported',
      method: METHOD,
      scope: SCOPE,
      globalSurfaceContinuity: GLOBAL_SURFACE_CONTINUITY,
      semanticStatus: SEMANTIC_STATUS,
      reason: error instanceof Error ? error.message : String(error),
      observations: [],
      options: resolvedOptions,
    };
  }
}

export function buildFieldFeatureReportFromAtlas(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
  options: FieldFeatureReportOptions = {},
): SupportedFieldFeatureReport {
  const resolvedOptions = resolveFieldFeatureReportOptions(options);
  const sampleGraph = buildSurfaceSampleGraph(sampledAtlas);
  const candidateDiagnostics = buildIntensityCandidateDiagnostics(
    sampledAtlas,
    resolvedOptions.intensityCandidates,
  );
  const cancellationLikeObservations = buildCancellationLikeObservations(
    candidateDiagnostics.nearNodeCandidates,
    resolvedOptions,
  );
  const highIntensityAnchorObservations = buildHighIntensityAnchorObservations(
    candidateDiagnostics.extremaCandidates,
    resolvedOptions,
  );
  const selectedCandidateIds = new Set(
    [...cancellationLikeObservations, ...highIntensityAnchorObservations]
      .map((observation) => observation.sourceCandidateId)
      .filter((candidateId): candidateId is string => Boolean(candidateId)),
  );
  const ambiguousObservations = buildAmbiguousObservations(
    [
      ...candidateDiagnostics.nearNodeCandidates,
      ...candidateDiagnostics.extremaCandidates,
    ],
    sampleGraph,
    selectedCandidateIds,
    resolvedOptions,
  );
  const observations = [
    ...cancellationLikeObservations,
    ...highIntensityAnchorObservations,
    ...ambiguousObservations,
  ];

  return {
    reportId: `field-feature-report-v0:${sampledAtlas.domain.id}`,
    status: 'supported',
    method: METHOD,
    scope: SCOPE,
    globalSurfaceContinuity: GLOBAL_SURFACE_CONTINUITY,
    semanticStatus: SEMANTIC_STATUS,
    sourceSummary: buildSourceSummary(sampledAtlas),
    atlasSummary: buildAtlasSummary(sampledAtlas, sampleGraph),
    observationSummary: buildObservationSummary(observations),
    observations,
    options: resolvedOptions,
  };
}

export function summarizeFieldFeatureReport(report: FieldFeatureReport): string {
  if (report.status === 'unsupported') {
    return `${report.method}: unsupported (${report.reason})`;
  }

  return (
    `${report.method}: observations=${report.observationSummary.totalObservations} ` +
    `(cancellation-like=${report.observationSummary.cancellationLikeCount}, ` +
    `high-intensity=${report.observationSummary.highIntensityAnchorCount}, ` +
    `ambiguous=${report.observationSummary.ambiguousCount}); ` +
    `sources=${report.sourceSummary.totalSources}, ` +
    `generated=${report.sourceSummary.generatedSources}, ` +
    `charts=${report.atlasSummary.chartCount}, samples=${report.atlasSummary.sampleCount}; ` +
    `semantic=${report.semanticStatus}`
  );
}

function buildCancellationLikeObservations(
  nearNodeCandidates: ChartLocalNearNodeCandidate[],
  options: ResolvedFieldFeatureReportOptions,
): FieldFeatureReportObservation[] {
  return [...nearNodeCandidates]
    .sort(
      (first, second) =>
        first.relativeIntensity - second.relativeIntensity ||
        second.effectiveSourceCount - first.effectiveSourceCount ||
        first.candidateId.localeCompare(second.candidateId),
    )
    .slice(0, options.maxCancellationLike)
    .map((candidate) =>
      buildObservationFromCandidate(candidate, 'cancellation-like-site-candidate', {
        observationId: `field-observation:v0:cancellation-like:${candidate.candidateId}`,
        reason:
          `Low chart-local relative intensity (${formatReportNumber(
            candidate.relativeIntensity,
          )}) with effectiveSourceCount=${formatReportNumber(
            candidate.effectiveSourceCount,
          )} suggests cancellation-like interference from a mixed source contribution. ` +
          'This remains report-candidate only, not a confirmed node or semantic site.',
      }),
    );
}

function buildHighIntensityAnchorObservations(
  extremaCandidates: ChartLocalIntensityExtremumCandidate[],
  options: ResolvedFieldFeatureReportOptions,
): FieldFeatureReportObservation[] {
  return extremaCandidates
    .filter((candidate) => candidate.extremumKind === 'local-maximum-candidate')
    .filter(
      (candidate) =>
        candidate.relativeIntensity >= options.highIntensityRelativeMin,
    )
    .sort(
      (first, second) =>
        second.relativeIntensity - first.relativeIntensity ||
        first.candidateId.localeCompare(second.candidateId),
    )
    .slice(0, options.maxHighIntensityAnchors)
    .map((candidate) =>
      buildObservationFromCandidate(candidate, 'high-intensity-anchor-candidate', {
        observationId: `field-observation:v0:high-intensity-anchor:${candidate.candidateId}`,
        reason:
          `Chart-local maximum has relativeIntensity=${formatReportNumber(
            candidate.relativeIntensity,
          )} >= ${formatReportNumber(options.highIntensityRelativeMin)}, marking a bounded ` +
          'high-intensity report candidate. This is not a semantic anchor or packet name.',
      }),
    );
}

function buildAmbiguousObservations(
  candidates: FieldFeatureSourceCandidate[],
  sampleGraph: SurfaceSampleGraph,
  selectedCandidateIds: Set<string>,
  options: ResolvedFieldFeatureReportOptions,
): FieldFeatureReportObservation[] {
  const underconnectedChartIds = new Set(
    sampleGraph.summary.chartSummaries
      .filter((summary) => summary.underconnected)
      .map((summary) => summary.chartId),
  );

  return candidates
    .filter((candidate) => !selectedCandidateIds.has(candidate.candidateId))
    .map((candidate) => ({
      candidate,
      reasons: getAmbiguityReasons(candidate, underconnectedChartIds),
    }))
    .filter(({ reasons }) => reasons.length > 0)
    .sort((first, second) => {
      const firstScore = getAmbiguityPriority(first.candidate, underconnectedChartIds);
      const secondScore = getAmbiguityPriority(second.candidate, underconnectedChartIds);

      return secondScore - firstScore || first.candidate.candidateId.localeCompare(
        second.candidate.candidateId,
      );
    })
    .slice(0, options.maxAmbiguous)
    .map(({ candidate, reasons }) =>
      buildObservationFromCandidate(candidate, 'ambiguous-field-site', {
        observationId: `field-observation:v0:ambiguous:${candidate.candidateId}`,
        reason: `${reasons.join(' ')} Stronger field-feature classification is deferred; this remains report-candidate only.`,
      }),
    );
}

function buildObservationFromCandidate(
  candidate: FieldFeatureSourceCandidate,
  observationKind: FieldFeatureObservationKind,
  options: {
    observationId: string;
    reason: string;
  },
): FieldFeatureReportObservation {
  return {
    observationId: options.observationId,
    observationKind,
    sourceCandidateId: candidate.candidateId,
    sourceCandidateKind: candidate.candidateKind,
    ...(candidate.candidateKind === 'chart-local-intensity-extremum-candidate'
      ? { sourceExtremumKind: candidate.extremumKind }
      : {}),
    sampleId: candidate.sampleId,
    chartId: candidate.chartId,
    chartSemanticRole: candidate.chartSemanticRole,
    sourceFaceId: candidate.sourceFaceId,
    position: copyVec3(candidate.position),
    localChartPosition: [
      candidate.localChartPosition[0],
      candidate.localChartPosition[1],
    ],
    intensity: candidate.intensity,
    phase: candidate.phase,
    relativeIntensity: candidate.relativeIntensity,
    effectiveSourceCount: candidate.effectiveSourceCount,
    topContributionRatio: candidate.topContributionRatio,
    status: OBSERVATION_STATUS,
    semanticStatus: SEMANTIC_STATUS,
    scope: SCOPE,
    globalSurfaceContinuity: GLOBAL_SURFACE_CONTINUITY,
    reason: options.reason,
  };
}

function buildSourceSummary(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
): FieldFeatureReportSourceSummary {
  const sourceKindCounts = countSourceKinds(sampledAtlas.sources);
  const amboMidpointSources = sourceKindCounts['ambo-midpoint-child'];

  return {
    totalSources: sampledAtlas.sources.length,
    generatedSources: sourceKindCounts['generated-child'] + amboMidpointSources,
    amboMidpointSources,
  };
}

function buildAtlasSummary(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
  sampleGraph: SurfaceSampleGraph,
): FieldFeatureReportAtlasSummary {
  return {
    chartCount: sampledAtlas.domain.surfaceCharts.length,
    sampleCount: sampledAtlas.samples.length,
    intensityRange: getIntensityRange(
      sampledAtlas.samples.map((sample) => sample.intensity),
    ),
    underconnectedChartCount: sampleGraph.summary.underconnectedChartCount,
    computationalOnlyChartCount: sampledAtlas.domain.surfaceCharts.filter(
      (chart) => chart.semanticRole === 'computational-only',
    ).length,
  };
}

function buildObservationSummary(
  observations: FieldFeatureReportObservation[],
): FieldFeatureReportObservationSummary {
  return {
    totalObservations: observations.length,
    cancellationLikeCount: observations.filter(
      (observation) =>
        observation.observationKind === 'cancellation-like-site-candidate',
    ).length,
    highIntensityAnchorCount: observations.filter(
      (observation) =>
        observation.observationKind === 'high-intensity-anchor-candidate',
    ).length,
    ambiguousCount: observations.filter(
      (observation) => observation.observationKind === 'ambiguous-field-site',
    ).length,
    computationalOnlyObservationCount: observations.filter(
      (observation) => observation.chartSemanticRole === 'computational-only',
    ).length,
  };
}

function getAmbiguityReasons(
  candidate: FieldFeatureSourceCandidate,
  underconnectedChartIds: Set<string>,
): string[] {
  const reasons: string[] = [];

  if (underconnectedChartIds.has(candidate.chartId)) {
    reasons.push('Candidate lies on an underconnected chart sample graph.');
  }

  if (candidate.chartSemanticRole === 'computational-only') {
    reasons.push('Candidate lies on computational-only chart triangulation.');
  }

  if (isBoundaryLocalCandidate(candidate)) {
    reasons.push('Candidate is chart-boundary local.');
  }

  return reasons;
}

function getAmbiguityPriority(
  candidate: FieldFeatureSourceCandidate,
  underconnectedChartIds: Set<string>,
): number {
  return (
    (underconnectedChartIds.has(candidate.chartId) ? 4 : 0) +
    (candidate.chartSemanticRole === 'computational-only' ? 2 : 0) +
    (isBoundaryLocalCandidate(candidate) ? 1 : 0)
  );
}

function isBoundaryLocalCandidate(candidate: FieldFeatureSourceCandidate): boolean {
  return candidate.barycentric.some(
    (coordinate) => Math.abs(coordinate) <= BOUNDARY_EPSILON,
  );
}

function resolveFieldFeatureReportOptions(
  options: FieldFeatureReportOptions = {},
): ResolvedFieldFeatureReportOptions {
  return {
    ...(options.sampling ? { sampling: options.sampling } : {}),
    intensityCandidates: options.intensityCandidates ?? {},
    highIntensityRelativeMin: clamp(
      finiteNonnegative(
        options.highIntensityRelativeMin,
        DEFAULT_HIGH_INTENSITY_RELATIVE_MIN,
      ),
      0,
      1,
    ),
    maxCancellationLike: finiteBoundedCount(
      options.maxCancellationLike,
      DEFAULT_MAX_CANCELLATION_LIKE,
    ),
    maxHighIntensityAnchors: finiteBoundedCount(
      options.maxHighIntensityAnchors,
      DEFAULT_MAX_HIGH_INTENSITY_ANCHORS,
    ),
    maxAmbiguous: finiteBoundedCount(options.maxAmbiguous, DEFAULT_MAX_AMBIGUOUS),
  };
}

function countSourceKinds(
  sources: SampledClosedShapeSurfaceAtlas['sources'],
): Record<FieldAtlasSourceKind, number> {
  const counts: Record<FieldAtlasSourceKind, number> = {
    seed: 0,
    preserved: 0,
    'generated-child': 0,
    'ambo-midpoint-child': 0,
  };

  for (const source of sources) {
    counts[source.sourceKind] += 1;
  }

  return counts;
}

function getIntensityRange(values: number[]): { min: number; max: number } {
  const finiteValues = values.filter(Number.isFinite);

  if (!finiteValues.length) {
    return { min: 0, max: 0 };
  }

  return finiteValues.reduce(
    (range, value) => ({
      min: Math.min(range.min, value),
      max: Math.max(range.max, value),
    }),
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
  );
}

function finiteNonnegative(value: number | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? value
    : fallback;
}

function finiteBoundedCount(value: number | undefined, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(0, Math.floor(value));
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function copyVec3(position: Vec3): Vec3 {
  return [position[0], position[1], position[2]];
}

function formatReportNumber(value: number): string {
  return Number.isFinite(value) ? value.toExponential(3) : String(value);
}

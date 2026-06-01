import type { FieldChartSemanticRole } from './fieldAtlas';
import type {
  SampledClosedShapeSurfaceAtlas,
  SurfaceChartAtlasSample,
} from './fieldAtlasSurfaceSampling';
import type { FaceId } from '../types/geometry';

export type FieldAtlasPhaseMethod = 'chart-local-nearest-phase-unwrap-plane-v1';
export type FieldAtlasPhaseScope = 'chart-local-only';
export type FieldAtlasGlobalPhaseContinuity = 'none';

export interface SamplePhaseUnwrap {
  sampleId: string;
  chartId: string;
  chartSemanticRole: FieldChartSemanticRole;
  sourceFaceId: FaceId;
  localChartPosition: [number, number];
  wrappedPhase: number;
  unwrappedPhase: number;
  phaseShiftTurns: number;
  method: FieldAtlasPhaseMethod;
  scope: FieldAtlasPhaseScope;
  globalContinuity: FieldAtlasGlobalPhaseContinuity;
}

export interface SamplePhaseGradientEstimate {
  sampleId: string;
  chartId: string;
  chartSemanticRole: FieldChartSemanticRole;
  sourceFaceId: FaceId;
  localChartPosition: [number, number];
  wrappedPhase: number;
  unwrappedPhase: number;
  phaseGradient: [number, number];
  phaseGradientMagnitude: number;
  method: FieldAtlasPhaseMethod;
  scope: FieldAtlasPhaseScope;
  globalContinuity: FieldAtlasGlobalPhaseContinuity;
}

export interface ChartPhaseUnwrapDiagnostic {
  chartId: string;
  chartSemanticRole: FieldChartSemanticRole;
  sourceFaceId: FaceId;
  sampleCount: number;
  unwrappedSampleCount: number;
  underdetermined: boolean;
  underdeterminedReason?: string;
  method: FieldAtlasPhaseMethod;
  scope: FieldAtlasPhaseScope;
  globalContinuity: FieldAtlasGlobalPhaseContinuity;
}

export interface ChartPhaseDiagnostic extends ChartPhaseUnwrapDiagnostic {
  estimatedGradientCount: number;
  minPhaseGradientMagnitude: number;
  maxPhaseGradientMagnitude: number;
  averagePhaseGradientMagnitude: number;
}

export interface FieldAtlasPhaseDiagnostics {
  method: FieldAtlasPhaseMethod;
  scope: FieldAtlasPhaseScope;
  globalContinuity: FieldAtlasGlobalPhaseContinuity;
  sampleUnwraps: SamplePhaseUnwrap[];
  samplePhaseGradients: SamplePhaseGradientEstimate[];
  chartDiagnostics: ChartPhaseDiagnostic[];
}

const METHOD: FieldAtlasPhaseMethod = 'chart-local-nearest-phase-unwrap-plane-v1';
const SCOPE: FieldAtlasPhaseScope = 'chart-local-only';
const GLOBAL_CONTINUITY: FieldAtlasGlobalPhaseContinuity = 'none';
const MIN_SAMPLES_FOR_PHASE_PLANE = 3;
const LOCAL_NEIGHBOR_LIMIT = 6;
const SOLVER_EPSILON = 1e-12;

export function unwrapChartSamplePhases(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
): SamplePhaseUnwrap[] {
  return buildChartPhaseDiagnosticsWithSamples(sampledAtlas).sampleUnwraps;
}

export function estimateChartPhaseGradients(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
): SamplePhaseGradientEstimate[] {
  return buildChartPhaseDiagnosticsWithSamples(sampledAtlas).samplePhaseGradients;
}

export function buildChartPhaseDiagnostics(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
): ChartPhaseDiagnostic[] {
  return buildPhaseDiagnostics(sampledAtlas).chartDiagnostics;
}

export function buildPhaseDiagnostics(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
): FieldAtlasPhaseDiagnostics {
  return buildChartPhaseDiagnosticsWithSamples(sampledAtlas);
}

function buildChartPhaseDiagnosticsWithSamples(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
): FieldAtlasPhaseDiagnostics {
  const samplesByChartId = groupSamplesByChartId(sampledAtlas.samples);
  const sampleUnwraps: SamplePhaseUnwrap[] = [];
  const samplePhaseGradients: SamplePhaseGradientEstimate[] = [];
  const chartDiagnostics = sampledAtlas.domain.surfaceCharts.map((chart) => {
    const chartSamples = samplesByChartId.get(chart.chartId) ?? [];
    const unwrapResult = unwrapSamplesForChart(chartSamples);

    if (unwrapResult.underdeterminedReason) {
      return buildUnderdeterminedChartDiagnostic(
        chart.chartId,
        chart.semanticRole,
        chart.sourceFaceId,
        chartSamples.length,
        unwrapResult.unwrappedSamples.length,
        unwrapResult.underdeterminedReason,
      );
    }

    sampleUnwraps.push(...unwrapResult.unwrappedSamples);

    const chartPhaseGradientEstimates = unwrapResult.unwrappedSamples
      .map((sample) => estimateSamplePhaseGradient(sample, unwrapResult.unwrappedSamples))
      .filter(
        (estimate): estimate is SamplePhaseGradientEstimate => Boolean(estimate),
      );

    samplePhaseGradients.push(...chartPhaseGradientEstimates);

    if (!chartPhaseGradientEstimates.length) {
      return buildUnderdeterminedChartDiagnostic(
        chart.chartId,
        chart.semanticRole,
        chart.sourceFaceId,
        chartSamples.length,
        unwrapResult.unwrappedSamples.length,
        'Chart-local unwrapped phase coordinates are rank-deficient for least-squares gradient estimation.',
      );
    }

    const magnitudes = chartPhaseGradientEstimates.map(
      (estimate) => estimate.phaseGradientMagnitude,
    );
    const range = getRange(magnitudes);

    return {
      chartId: chart.chartId,
      chartSemanticRole: chart.semanticRole,
      sourceFaceId: chart.sourceFaceId,
      sampleCount: chartSamples.length,
      unwrappedSampleCount: unwrapResult.unwrappedSamples.length,
      estimatedGradientCount: chartPhaseGradientEstimates.length,
      minPhaseGradientMagnitude: range.min,
      maxPhaseGradientMagnitude: range.max,
      averagePhaseGradientMagnitude: average(magnitudes),
      underdetermined: false,
      method: METHOD,
      scope: SCOPE,
      globalContinuity: GLOBAL_CONTINUITY,
    };
  });

  return {
    method: METHOD,
    scope: SCOPE,
    globalContinuity: GLOBAL_CONTINUITY,
    sampleUnwraps,
    samplePhaseGradients,
    chartDiagnostics,
  };
}

function unwrapSamplesForChart(chartSamples: SurfaceChartAtlasSample[]): {
  unwrappedSamples: SamplePhaseUnwrap[];
  underdeterminedReason?: string;
} {
  const validSamples = chartSamples.filter(isPhaseEligibleSample);

  if (validSamples.length < MIN_SAMPLES_FOR_PHASE_PLANE) {
    return {
      unwrappedSamples: [],
      underdeterminedReason: `At least ${MIN_SAMPLES_FOR_PHASE_PLANE} finite chart-local phase samples are required for chart-local phase unwrapping and plane-fit gradient estimation.`,
    };
  }

  const anchor = chooseAnchorSample(validSamples);
  const unwrappedSamplesById = new Map<string, SamplePhaseUnwrap>();
  const pendingSamplesById = new Map(validSamples.map((sample) => [sample.id, sample]));

  addUnwrappedSample(unwrappedSamplesById, pendingSamplesById, anchor, normalizeWrappedAngle(anchor.phase));

  while (pendingSamplesById.size) {
    const next = findNearestPendingSample(pendingSamplesById, unwrappedSamplesById);

    if (!next) {
      return {
        unwrappedSamples: Array.from(unwrappedSamplesById.values()),
        underdeterminedReason: 'Chart-local phase unwrap could not span all chart samples.',
      };
    }

    const wrappedDifference = normalizeWrappedAngle(
      next.sample.phase - next.neighbor.wrappedPhase,
    );

    addUnwrappedSample(
      unwrappedSamplesById,
      pendingSamplesById,
      next.sample,
      next.neighbor.unwrappedPhase + wrappedDifference,
    );
  }

  return { unwrappedSamples: Array.from(unwrappedSamplesById.values()) };
}

function chooseAnchorSample(samples: SurfaceChartAtlasSample[]): SurfaceChartAtlasSample {
  const centroid = samples.reduce<[number, number]>(
    (sum, sample) => [
      sum[0] + sample.localChartPosition[0],
      sum[1] + sample.localChartPosition[1],
    ],
    [0, 0],
  );
  const center: [number, number] = [centroid[0] / samples.length, centroid[1] / samples.length];

  return [...samples].sort((first, second) => {
    const distanceDelta =
      squaredLocalDistance(first.localChartPosition, center) -
      squaredLocalDistance(second.localChartPosition, center);

    return distanceDelta || first.id.localeCompare(second.id);
  })[0];
}

function addUnwrappedSample(
  unwrappedSamplesById: Map<string, SamplePhaseUnwrap>,
  pendingSamplesById: Map<string, SurfaceChartAtlasSample>,
  sample: SurfaceChartAtlasSample,
  unwrappedPhase: number,
): void {
  const wrappedPhase = normalizeWrappedAngle(sample.phase);
  const phaseShiftTurns = Math.round((unwrappedPhase - wrappedPhase) / (2 * Math.PI));

  unwrappedSamplesById.set(sample.id, {
    sampleId: sample.id,
    chartId: sample.chartId,
    chartSemanticRole: sample.chartSemanticRole,
    sourceFaceId: sample.sourceFaceId,
    localChartPosition: [sample.localChartPosition[0], sample.localChartPosition[1]],
    wrappedPhase,
    unwrappedPhase,
    phaseShiftTurns,
    method: METHOD,
    scope: SCOPE,
    globalContinuity: GLOBAL_CONTINUITY,
  });
  pendingSamplesById.delete(sample.id);
}

function findNearestPendingSample(
  pendingSamplesById: Map<string, SurfaceChartAtlasSample>,
  unwrappedSamplesById: Map<string, SamplePhaseUnwrap>,
): { sample: SurfaceChartAtlasSample; neighbor: SamplePhaseUnwrap } | null {
  let best: {
    sample: SurfaceChartAtlasSample;
    neighbor: SamplePhaseUnwrap;
    distanceSquared: number;
  } | null = null;

  for (const sample of pendingSamplesById.values()) {
    for (const neighbor of unwrappedSamplesById.values()) {
      const distanceSquared = squaredLocalDistance(
        sample.localChartPosition,
        neighbor.localChartPosition,
      );

      if (
        !best ||
        distanceSquared < best.distanceSquared ||
        (distanceSquared === best.distanceSquared &&
          `${sample.id}:${neighbor.sampleId}` < `${best.sample.id}:${best.neighbor.sampleId}`)
      ) {
        best = { sample, neighbor, distanceSquared };
      }
    }
  }

  return best ? { sample: best.sample, neighbor: best.neighbor } : null;
}

function estimateSamplePhaseGradient(
  sample: SamplePhaseUnwrap,
  chartSamples: SamplePhaseUnwrap[],
): SamplePhaseGradientEstimate | null {
  const localSamples = chartSamples
    .map((candidate) => ({
      sample: candidate,
      distanceSquared: squaredLocalDistance(
        sample.localChartPosition,
        candidate.localChartPosition,
      ),
    }))
    .sort(
      (a, b) =>
        a.distanceSquared - b.distanceSquared || a.sample.sampleId.localeCompare(b.sample.sampleId),
    )
    .slice(0, Math.min(LOCAL_NEIGHBOR_LIMIT, chartSamples.length))
    .map((candidate) => candidate.sample);
  const fit = fitPhasePlane(localSamples);

  if (!fit) {
    return null;
  }

  const phaseGradient: [number, number] = [fit.a, fit.b];

  return {
    sampleId: sample.sampleId,
    chartId: sample.chartId,
    chartSemanticRole: sample.chartSemanticRole,
    sourceFaceId: sample.sourceFaceId,
    localChartPosition: [sample.localChartPosition[0], sample.localChartPosition[1]],
    wrappedPhase: sample.wrappedPhase,
    unwrappedPhase: sample.unwrappedPhase,
    phaseGradient,
    phaseGradientMagnitude: Math.hypot(phaseGradient[0], phaseGradient[1]),
    method: METHOD,
    scope: SCOPE,
    globalContinuity: GLOBAL_CONTINUITY,
  };
}

function fitPhasePlane(samples: SamplePhaseUnwrap[]): {
  a: number;
  b: number;
  c: number;
} | null {
  if (samples.length < MIN_SAMPLES_FOR_PHASE_PLANE) {
    return null;
  }

  let sumU = 0;
  let sumV = 0;
  let sumUU = 0;
  let sumUV = 0;
  let sumVV = 0;
  let sumPhase = 0;
  let sumUPhase = 0;
  let sumVPhase = 0;

  for (const sample of samples) {
    const [u, v] = sample.localChartPosition;
    const phase = sample.unwrappedPhase;

    sumU += u;
    sumV += v;
    sumUU += u * u;
    sumUV += u * v;
    sumVV += v * v;
    sumPhase += phase;
    sumUPhase += u * phase;
    sumVPhase += v * phase;
  }

  const solution = solve3x3(
    [
      [sumUU, sumUV, sumU],
      [sumUV, sumVV, sumV],
      [sumU, sumV, samples.length],
    ],
    [sumUPhase, sumVPhase, sumPhase],
  );

  return solution ? { a: solution[0], b: solution[1], c: solution[2] } : null;
}

function solve3x3(
  matrix: [[number, number, number], [number, number, number], [number, number, number]],
  rhs: [number, number, number],
): [number, number, number] | null {
  const determinant = determinant3x3(matrix);

  if (!Number.isFinite(determinant) || Math.abs(determinant) <= SOLVER_EPSILON) {
    return null;
  }

  return [
    determinant3x3(replaceColumn(matrix, rhs, 0)) / determinant,
    determinant3x3(replaceColumn(matrix, rhs, 1)) / determinant,
    determinant3x3(replaceColumn(matrix, rhs, 2)) / determinant,
  ];
}

function determinant3x3(
  matrix: [[number, number, number], [number, number, number], [number, number, number]],
): number {
  return (
    matrix[0][0] * (matrix[1][1] * matrix[2][2] - matrix[1][2] * matrix[2][1]) -
    matrix[0][1] * (matrix[1][0] * matrix[2][2] - matrix[1][2] * matrix[2][0]) +
    matrix[0][2] * (matrix[1][0] * matrix[2][1] - matrix[1][1] * matrix[2][0])
  );
}

function replaceColumn(
  matrix: [[number, number, number], [number, number, number], [number, number, number]],
  columnValues: [number, number, number],
  columnIndex: number,
): [[number, number, number], [number, number, number], [number, number, number]] {
  return matrix.map((row, rowIndex) =>
    row.map((value, index) => (index === columnIndex ? columnValues[rowIndex] : value)),
  ) as [[number, number, number], [number, number, number], [number, number, number]];
}

function buildUnderdeterminedChartDiagnostic(
  chartId: string,
  chartSemanticRole: FieldChartSemanticRole,
  sourceFaceId: FaceId,
  sampleCount: number,
  unwrappedSampleCount: number,
  underdeterminedReason: string,
): ChartPhaseDiagnostic {
  return {
    chartId,
    chartSemanticRole,
    sourceFaceId,
    sampleCount,
    unwrappedSampleCount,
    estimatedGradientCount: 0,
    minPhaseGradientMagnitude: 0,
    maxPhaseGradientMagnitude: 0,
    averagePhaseGradientMagnitude: 0,
    underdetermined: true,
    underdeterminedReason,
    method: METHOD,
    scope: SCOPE,
    globalContinuity: GLOBAL_CONTINUITY,
  };
}

function isPhaseEligibleSample(sample: SurfaceChartAtlasSample): boolean {
  return (
    Array.isArray(sample.localChartPosition) &&
    sample.localChartPosition.length === 2 &&
    sample.localChartPosition.every(Number.isFinite) &&
    Number.isFinite(sample.phase)
  );
}

function groupSamplesByChartId(
  samples: SurfaceChartAtlasSample[],
): Map<string, SurfaceChartAtlasSample[]> {
  const samplesByChartId = new Map<string, SurfaceChartAtlasSample[]>();

  for (const sample of samples) {
    const chartSamples = samplesByChartId.get(sample.chartId) ?? [];

    chartSamples.push(sample);
    samplesByChartId.set(sample.chartId, chartSamples);
  }

  return samplesByChartId;
}

function squaredLocalDistance(a: [number, number], b: [number, number]): number {
  const du = a[0] - b[0];
  const dv = a[1] - b[1];

  return du * du + dv * dv;
}

function normalizeWrappedAngle(value: number): number {
  const tau = 2 * Math.PI;
  const normalized = ((((value + Math.PI) % tau) + tau) % tau) - Math.PI;

  return normalized === -Math.PI ? Math.PI : normalized;
}

function getRange(values: number[]): { min: number; max: number } {
  return values.reduce(
    (range, value) => ({
      min: Math.min(range.min, value),
      max: Math.max(range.max, value),
    }),
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
  );
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

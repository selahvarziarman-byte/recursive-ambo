import type { FieldChartSemanticRole } from './fieldAtlas';
import type {
  SampledClosedShapeSurfaceAtlas,
  SurfaceChartAtlasSample,
} from './fieldAtlasSurfaceSampling';
import type { FaceId } from '../types/geometry';

export type FieldAtlasGradientMethod = 'chart-local-least-squares-plane-v1';

export interface PhaseGradientStatus {
  status: 'omitted';
  reason: string;
}

export interface SampleGradientEstimate {
  sampleId: string;
  chartId: string;
  chartSemanticRole: FieldChartSemanticRole;
  sourceFaceId: FaceId;
  localChartPosition: [number, number];
  intensityGradient: [number, number];
  intensityGradientMagnitude: number;
  method: FieldAtlasGradientMethod;
  phaseGradientStatus: PhaseGradientStatus;
}

export interface ChartGradientDiagnostic {
  chartId: string;
  chartSemanticRole: FieldChartSemanticRole;
  sourceFaceId: FaceId;
  sampleCount: number;
  estimatedGradientCount: number;
  minIntensityGradientMagnitude: number;
  maxIntensityGradientMagnitude: number;
  averageIntensityGradientMagnitude: number;
  underdetermined: boolean;
  underdeterminedReason?: string;
  method: FieldAtlasGradientMethod;
  phaseGradientStatus: PhaseGradientStatus;
}

export interface FieldAtlasGradientDiagnostics {
  method: FieldAtlasGradientMethod;
  sampleGradients: SampleGradientEstimate[];
  chartDiagnostics: ChartGradientDiagnostic[];
}

const METHOD: FieldAtlasGradientMethod = 'chart-local-least-squares-plane-v1';
const MIN_SAMPLES_FOR_PLANE = 3;
const LOCAL_NEIGHBOR_LIMIT = 6;
const SOLVER_EPSILON = 1e-12;
const PHASE_GRADIENT_STATUS: PhaseGradientStatus = {
  status: 'omitted',
  reason: 'Phase gradient is omitted until an explicit wrapped-phase unwrapping policy exists.',
};

export function buildChartGradientDiagnostics(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
): ChartGradientDiagnostic[] {
  return buildGradientDiagnostics(sampledAtlas).chartDiagnostics;
}

export function estimateChartSampleGradients(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
): SampleGradientEstimate[] {
  return buildGradientDiagnostics(sampledAtlas).sampleGradients;
}

export function buildGradientDiagnostics(
  sampledAtlas: SampledClosedShapeSurfaceAtlas,
): FieldAtlasGradientDiagnostics {
  const samplesByChartId = groupSamplesByChartId(sampledAtlas.samples);
  const sampleGradients: SampleGradientEstimate[] = [];
  const chartDiagnostics = sampledAtlas.domain.surfaceCharts.map((chart) => {
    const chartSamples = samplesByChartId.get(chart.chartId) ?? [];
    const validSamples = chartSamples.filter(isGradientEligibleSample);

    if (validSamples.length < MIN_SAMPLES_FOR_PLANE) {
      return buildUnderdeterminedChartDiagnostic(
        chart.chartId,
        chart.semanticRole,
        chart.sourceFaceId,
        chartSamples.length,
        `At least ${MIN_SAMPLES_FOR_PLANE} finite chart-local samples are required for a plane-fit gradient.`,
      );
    }

    const chartGradientEstimates = validSamples
      .map((sample) => estimateSampleGradient(sample, validSamples))
      .filter((estimate): estimate is SampleGradientEstimate => Boolean(estimate));

    sampleGradients.push(...chartGradientEstimates);

    if (!chartGradientEstimates.length) {
      return buildUnderdeterminedChartDiagnostic(
        chart.chartId,
        chart.semanticRole,
        chart.sourceFaceId,
        chartSamples.length,
        'Chart-local sample coordinates are rank-deficient for least-squares gradient estimation.',
      );
    }

    const magnitudes = chartGradientEstimates.map(
      (estimate) => estimate.intensityGradientMagnitude,
    );
    const range = getRange(magnitudes);

    return {
      chartId: chart.chartId,
      chartSemanticRole: chart.semanticRole,
      sourceFaceId: chart.sourceFaceId,
      sampleCount: chartSamples.length,
      estimatedGradientCount: chartGradientEstimates.length,
      minIntensityGradientMagnitude: range.min,
      maxIntensityGradientMagnitude: range.max,
      averageIntensityGradientMagnitude: average(magnitudes),
      underdetermined: false,
      method: METHOD,
      phaseGradientStatus: PHASE_GRADIENT_STATUS,
    };
  });

  return {
    method: METHOD,
    sampleGradients,
    chartDiagnostics,
  };
}

function estimateSampleGradient(
  sample: SurfaceChartAtlasSample,
  chartSamples: SurfaceChartAtlasSample[],
): SampleGradientEstimate | null {
  const localSamples = chartSamples
    .map((candidate) => ({
      sample: candidate,
      distanceSquared: squaredLocalDistance(sample.localChartPosition, candidate.localChartPosition),
    }))
    .sort((a, b) => a.distanceSquared - b.distanceSquared)
    .slice(0, Math.min(LOCAL_NEIGHBOR_LIMIT, chartSamples.length))
    .map((candidate) => candidate.sample);
  const fit = fitIntensityPlane(localSamples);

  if (!fit) {
    return null;
  }

  const intensityGradient: [number, number] = [fit.a, fit.b];

  return {
    sampleId: sample.id,
    chartId: sample.chartId,
    chartSemanticRole: sample.chartSemanticRole,
    sourceFaceId: sample.sourceFaceId,
    localChartPosition: [sample.localChartPosition[0], sample.localChartPosition[1]],
    intensityGradient,
    intensityGradientMagnitude: Math.hypot(intensityGradient[0], intensityGradient[1]),
    method: METHOD,
    phaseGradientStatus: PHASE_GRADIENT_STATUS,
  };
}

function fitIntensityPlane(samples: SurfaceChartAtlasSample[]): {
  a: number;
  b: number;
  c: number;
} | null {
  if (samples.length < MIN_SAMPLES_FOR_PLANE) {
    return null;
  }

  let sumU = 0;
  let sumV = 0;
  let sumUU = 0;
  let sumUV = 0;
  let sumVV = 0;
  let sumI = 0;
  let sumUI = 0;
  let sumVI = 0;

  for (const sample of samples) {
    const [u, v] = sample.localChartPosition;
    const intensity = sample.intensity;

    sumU += u;
    sumV += v;
    sumUU += u * u;
    sumUV += u * v;
    sumVV += v * v;
    sumI += intensity;
    sumUI += u * intensity;
    sumVI += v * intensity;
  }

  const solution = solve3x3(
    [
      [sumUU, sumUV, sumU],
      [sumUV, sumVV, sumV],
      [sumU, sumV, samples.length],
    ],
    [sumUI, sumVI, sumI],
  );

  return solution ? { a: solution[0], b: solution[1], c: solution[2] } : null;
}

function solve3x3(matrix: [[number, number, number], [number, number, number], [number, number, number]], rhs: [number, number, number]): [number, number, number] | null {
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
  underdeterminedReason: string,
): ChartGradientDiagnostic {
  return {
    chartId,
    chartSemanticRole,
    sourceFaceId,
    sampleCount,
    estimatedGradientCount: 0,
    minIntensityGradientMagnitude: 0,
    maxIntensityGradientMagnitude: 0,
    averageIntensityGradientMagnitude: 0,
    underdetermined: true,
    underdeterminedReason,
    method: METHOD,
    phaseGradientStatus: PHASE_GRADIENT_STATUS,
  };
}

function isGradientEligibleSample(sample: SurfaceChartAtlasSample): boolean {
  return (
    Array.isArray(sample.localChartPosition) &&
    sample.localChartPosition.length === 2 &&
    sample.localChartPosition.every(Number.isFinite) &&
    Number.isFinite(sample.intensity)
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

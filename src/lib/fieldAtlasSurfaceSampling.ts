import {
  buildClosedShapeSurfaceSourceDomain,
  buildFieldSourcePopulation,
  sampleFieldAtlasAtPoint,
  type ClosedShapeSurfaceSourceDomain,
  type FieldAtlasSample,
  type FieldAtlasSource,
  type FieldChartSemanticRole,
  type FieldSurfaceSampleChart,
} from './fieldAtlas';
import type { FaceId, Shape, Vec3 } from '../types/geometry';

export interface SurfaceChartSamplingOptions {
  subdivisions?: number;
  maxSamples?: number;
}

export interface ResolvedSurfaceChartSamplingOptions {
  subdivisions: number;
  maxSamples: number;
}

export interface SurfaceChartSamplePoint {
  id: string;
  position: Vec3;
  localChartPosition: [number, number];
  barycentric: [number, number, number];
  chartId: string;
  chartSemanticRole: FieldChartSemanticRole;
  sourceFaceId: FaceId;
}

export interface SurfaceChartAtlasSample extends FieldAtlasSample {
  localChartPosition: [number, number];
  barycentric: [number, number, number];
  chartId: string;
  chartSemanticRole: FieldChartSemanticRole;
  sourceFaceId: FaceId;
}

export interface SurfaceChartSampleSummary {
  chartId: string;
  chartSemanticRole: FieldChartSemanticRole;
  sourceFaceId: FaceId;
  sampleCount: number;
  minIntensity: number;
  maxIntensity: number;
  minPhase: number;
  maxPhase: number;
  allContributionRatiosValid: boolean;
}

export interface SampledClosedShapeSurfaceAtlas {
  domain: ClosedShapeSurfaceSourceDomain;
  sources: FieldAtlasSource[];
  samplePoints: SurfaceChartSamplePoint[];
  samples: SurfaceChartAtlasSample[];
  chartSummaries: SurfaceChartSampleSummary[];
  options: ResolvedSurfaceChartSamplingOptions;
}

const DEFAULT_SUBDIVISIONS = 2;
const DEFAULT_MAX_SAMPLES = 512;
const MAX_SUBDIVISIONS = 8;
const MAX_SAMPLE_CAP = 4096;

export function buildSurfaceChartSamplePoints(
  domain: ClosedShapeSurfaceSourceDomain,
  options: SurfaceChartSamplingOptions = {},
): SurfaceChartSamplePoint[] {
  const resolvedOptions = resolveSurfaceChartSamplingOptions(options);
  const barycentricSamples = buildBarycentricLattice(resolvedOptions.subdivisions);
  const samplePoints: SurfaceChartSamplePoint[] = [];

  for (const chart of domain.surfaceCharts) {
    for (const barycentricSample of barycentricSamples) {
      if (samplePoints.length >= resolvedOptions.maxSamples) {
        return samplePoints;
      }

      samplePoints.push(buildSurfaceChartSamplePoint(chart, barycentricSample));
    }
  }

  return samplePoints;
}

export function sampleClosedShapeSurfaceAtlas(
  shape: Shape,
  options: SurfaceChartSamplingOptions = {},
): SampledClosedShapeSurfaceAtlas {
  const resolvedOptions = resolveSurfaceChartSamplingOptions(options);
  const domain = buildClosedShapeSurfaceSourceDomain(shape);
  const sources = buildFieldSourcePopulation(shape, domain);
  const samplePoints = buildSurfaceChartSamplePoints(domain, resolvedOptions);
  const samples = samplePoints.map((samplePoint) => {
    const sample = sampleFieldAtlasAtPoint(sources, samplePoint.position, {
      sampleId: samplePoint.id,
      localChartPosition: samplePoint.localChartPosition,
      barycentric: samplePoint.barycentric,
      chartId: samplePoint.chartId,
      chartSemanticRole: samplePoint.chartSemanticRole,
    });

    return {
      ...sample,
      localChartPosition: samplePoint.localChartPosition,
      barycentric: samplePoint.barycentric,
      chartId: samplePoint.chartId,
      chartSemanticRole: samplePoint.chartSemanticRole,
      sourceFaceId: samplePoint.sourceFaceId,
    };
  });

  return {
    domain,
    sources,
    samplePoints,
    samples,
    chartSummaries: buildChartSummaries(domain.surfaceCharts, samples),
    options: resolvedOptions,
  };
}

export function resolveSurfaceChartSamplingOptions(
  options: SurfaceChartSamplingOptions = {},
): ResolvedSurfaceChartSamplingOptions {
  return {
    subdivisions: clampInteger(options.subdivisions, DEFAULT_SUBDIVISIONS, 1, MAX_SUBDIVISIONS),
    maxSamples: clampInteger(options.maxSamples, DEFAULT_MAX_SAMPLES, 1, MAX_SAMPLE_CAP),
  };
}

function buildSurfaceChartSamplePoint(
  chart: FieldSurfaceSampleChart,
  barycentricSample: BarycentricLatticePoint,
): SurfaceChartSamplePoint {
  const barycentric = barycentricSample.barycentric;

  return {
    id: `surface-chart-sample:${chart.chartId}:b${barycentricSample.indices.join('-')}-of-${
      barycentricSample.subdivisions
    }`,
    position: pointFromPositionsBarycentric(chart.positions, barycentric),
    localChartPosition: [barycentric[1], barycentric[2]],
    barycentric,
    chartId: chart.chartId,
    chartSemanticRole: chart.semanticRole,
    sourceFaceId: chart.sourceFaceId,
  };
}

interface BarycentricLatticePoint {
  barycentric: [number, number, number];
  indices: [number, number, number];
  subdivisions: number;
}

function buildBarycentricLattice(subdivisions: number): BarycentricLatticePoint[] {
  const points: BarycentricLatticePoint[] = [];

  for (let a = 0; a <= subdivisions; a += 1) {
    for (let b = 0; b <= subdivisions - a; b += 1) {
      const c = subdivisions - a - b;

      points.push({
        barycentric: [a / subdivisions, b / subdivisions, c / subdivisions],
        indices: [a, b, c],
        subdivisions,
      });
    }
  }

  return points;
}

function buildChartSummaries(
  charts: FieldSurfaceSampleChart[],
  samples: SurfaceChartAtlasSample[],
): SurfaceChartSampleSummary[] {
  return charts.map((chart) => {
    const chartSamples = samples.filter((sample) => sample.chartId === chart.chartId);
    const intensityRange = getRange(chartSamples.map((sample) => sample.intensity));
    const phaseRange = getRange(chartSamples.map((sample) => sample.phase));

    return {
      chartId: chart.chartId,
      chartSemanticRole: chart.semanticRole,
      sourceFaceId: chart.sourceFaceId,
      sampleCount: chartSamples.length,
      minIntensity: intensityRange.min,
      maxIntensity: intensityRange.max,
      minPhase: phaseRange.min,
      maxPhase: phaseRange.max,
      allContributionRatiosValid: chartSamples.every(hasValidContributionRatios),
    };
  });
}

function hasValidContributionRatios(sample: SurfaceChartAtlasSample): boolean {
  const ratioSum = sample.contributionRatios.reduce((sum, ratio) => sum + ratio.value, 0);

  return (
    sample.contributionRatios.every((ratio) => Number.isFinite(ratio.value) && ratio.value >= 0) &&
    Number.isFinite(ratioSum) &&
    Math.abs(ratioSum - 1) <= 1e-9
  );
}

function getRange(values: number[]): { min: number; max: number } {
  if (!values.length) {
    return { min: 0, max: 0 };
  }

  return values.reduce(
    (range, value) => ({
      min: Math.min(range.min, value),
      max: Math.max(range.max, value),
    }),
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
  );
}

function pointFromPositionsBarycentric(
  positions: [Vec3, Vec3, Vec3],
  barycentric: [number, number, number],
): Vec3 {
  return [
    positions[0][0] * barycentric[0] +
      positions[1][0] * barycentric[1] +
      positions[2][0] * barycentric[2],
    positions[0][1] * barycentric[0] +
      positions[1][1] * barycentric[1] +
      positions[2][1] * barycentric[2],
    positions[0][2] * barycentric[0] +
      positions[1][2] * barycentric[1] +
      positions[2][2] * barycentric[2],
  ];
}

function clampInteger(
  value: number | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(maximum, Math.max(minimum, Math.floor(value)));
}

import { type ReactNode, useMemo } from 'react';
import {
  buildClosedShapeSurfaceRepresentativeSamplePoints,
  buildClosedShapeSurfaceSourceDomain,
  buildFieldSourcePopulation,
  sampleFieldAtlasPoints,
  type ClosedShapeSurfaceSourceDomain,
  type FieldAtlasSample,
  type FieldAtlasSource,
  type FieldAtlasSourceKind,
  type FieldSurfaceSampleChart,
} from '../lib/fieldAtlas';
import {
  sampleClosedShapeSurfaceAtlas,
  type SampledClosedShapeSurfaceAtlas,
  type SurfaceChartSampleSummary,
} from '../lib/fieldAtlasSurfaceSampling';
import {
  buildGradientDiagnostics,
  type ChartGradientDiagnostic,
  type FieldAtlasGradientDiagnostics,
} from '../lib/fieldAtlasGradient';
import { useGeometryStore } from '../store/geometryStore';
import type { Shape, VertexId } from '../types/geometry';

interface FieldAtlasInspectorProps {
  shape: Shape;
  formatVertexRef: (vertexId: VertexId) => string;
  shortenId: (id: string) => string;
}

type FieldAtlasInspectorModel =
  | {
      status: 'supported';
      domain: ClosedShapeSurfaceSourceDomain;
      sources: FieldAtlasSource[];
      samples: FieldAtlasSample[];
      sourceKindCounts: Record<FieldAtlasSourceKind, number>;
      intensityRange: { min: number; max: number };
      representativeSamples: FieldAtlasSample[];
      chartById: Map<string, FieldSurfaceSampleChart>;
    }
  | {
      status: 'unsupported';
      reason: string;
    };

type SurfaceSamplingInspectorModel =
  | {
      status: 'supported';
      atlas: SampledClosedShapeSurfaceAtlas;
      intensityRange: NumericRange;
      phaseRange: NumericRange;
      directChartCount: number;
      computationalChartCount: number;
      allChartContributionRatiosValid: boolean;
      chartById: Map<string, FieldSurfaceSampleChart>;
    }
  | {
      status: 'unsupported';
      reason: string;
    };

type GradientDiagnosticsInspectorModel =
  | {
      status: 'supported';
      diagnostics: FieldAtlasGradientDiagnostics;
      chartById: Map<string, FieldSurfaceSampleChart>;
      underdeterminedChartCount: number;
      determinedChartCount: number;
      intensityGradientMagnitude: NumericSummary;
      phaseGradientStatus: string;
    }
  | {
      status: 'unsupported';
      reason: string;
    };

interface NumericRange {
  min: number;
  max: number;
}

interface NumericSummary extends NumericRange {
  average: number;
}

interface SurfaceChartLabelSummary {
  chartId: string;
  sourceFaceId: string;
}

const sourceKindOrder: FieldAtlasSourceKind[] = [
  'seed',
  'preserved',
  'generated-child',
  'ambo-midpoint-child',
];

export function FieldAtlasInspector({
  shape,
  formatVertexRef,
  shortenId,
}: FieldAtlasInspectorProps) {
  const atlas = useMemo(() => buildInspectorModel(shape), [shape]);
  const surfaceSampling = useMemo(() => buildSurfaceSamplingModel(shape), [shape]);
  const gradientDiagnostics = useMemo(() => buildGradientDiagnosticsModel(shape), [shape]);
  const hoveredFieldAtlasSampleId = useGeometryStore(
    (state) => state.hoveredFieldAtlasSampleId,
  );
  const setHoveredFieldAtlasSampleId = useGeometryStore(
    (state) => state.setHoveredFieldAtlasSampleId,
  );

  if (atlas.status === 'unsupported') {
    return (
      <div className="grid gap-3 text-sm">
        <div className="rounded border border-amber-400/30 bg-amber-400/10 px-3 py-2">
          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
            Unsupported
          </span>
          <p className="mt-2 text-xs leading-5 text-stone-300">{atlas.reason}</p>
        </div>
        <SurfaceSamplingSection
          shape={shape}
          model={surfaceSampling}
          formatVertexRef={formatVertexRef}
          shortenId={shortenId}
        />
        <GradientDiagnosticsSection
          shape={shape}
          model={gradientDiagnostics}
          formatVertexRef={formatVertexRef}
          shortenId={shortenId}
        />
        <FieldAtlasDiagnosticNote />
      </div>
    );
  }

  return (
    <div className="grid gap-3 text-sm">
      <div className="rounded border border-emerald-400/30 bg-emerald-400/10 px-3 py-2">
        <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">
          Supported
        </span>
        <p className="mt-2 text-xs leading-5 text-stone-300">
          Closed-shape surface atlas from current raw geometry.
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-2 text-xs">
        <FieldAtlasMetric label="Domain" value="closed-shape surface" />
        <FieldAtlasMetric
          label="Strategy"
          value={formatSurfaceSelectionStrategy(atlas.domain.surfaceSelectionStrategy)}
        />
        <FieldAtlasMetric label="Sources" value={atlas.sources.length} />
        <FieldAtlasMetric
          label="Ambo children"
          value={atlas.sourceKindCounts['ambo-midpoint-child']}
        />
        <FieldAtlasMetric label="Faces" value={atlas.domain.faceIds.length} />
        <FieldAtlasMetric label="Charts" value={atlas.domain.surfaceCharts.length} />
        <FieldAtlasMetric label="Samples" value={atlas.samples.length} />
        <FieldAtlasMetric
          label="Intensity"
          value={`${formatNumber(atlas.intensityRange.min)} - ${formatNumber(
            atlas.intensityRange.max,
          )}`}
        />
      </dl>

      <div className="rounded border border-stone-800 bg-stone-950 px-3 py-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          Source Kinds
        </h3>
        <div className="mt-2 flex flex-wrap gap-2 text-xs">
          {sourceKindOrder.map((kind) => (
            <span
              key={kind}
              className="rounded border border-stone-800 bg-stone-900 px-2 py-1 text-stone-300"
            >
              {formatSourceKind(kind)}{' '}
              <span className="font-mono text-stone-500">
                {atlas.sourceKindCounts[kind]}
              </span>
            </span>
          ))}
        </div>
      </div>

      <SurfaceSamplingSection
        shape={shape}
        model={surfaceSampling}
        formatVertexRef={formatVertexRef}
        shortenId={shortenId}
      />

      <GradientDiagnosticsSection
        shape={shape}
        model={gradientDiagnostics}
        formatVertexRef={formatVertexRef}
        shortenId={shortenId}
      />

      <div className="grid gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          Representative Samples
        </h3>
        {atlas.representativeSamples.map((sample) => (
          <SampleSummary
            key={sample.id}
            shape={shape}
            sample={sample}
            chart={sample.chartId ? atlas.chartById.get(sample.chartId) : undefined}
            formatVertexRef={formatVertexRef}
            shortenId={shortenId}
            isHovered={hoveredFieldAtlasSampleId === sample.id}
            onHoverStart={setHoveredFieldAtlasSampleId}
            onHoverEnd={() => setHoveredFieldAtlasSampleId(null)}
          />
        ))}
      </div>

      <FieldAtlasDiagnosticNote />
    </div>
  );
}

function FieldAtlasMetric({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded border border-stone-800 bg-stone-950 px-2 py-2">
      <dt className="text-stone-500">{label}</dt>
      <dd className="mt-1 min-w-0 truncate text-stone-200">{value}</dd>
    </div>
  );
}

function SampleSummary({
  shape,
  sample,
  chart,
  formatVertexRef,
  shortenId,
  isHovered,
  onHoverStart,
  onHoverEnd,
}: {
  shape: Shape;
  sample: FieldAtlasSample;
  chart?: FieldSurfaceSampleChart;
  formatVertexRef: (vertexId: VertexId) => string;
  shortenId: (id: string) => string;
  isHovered: boolean;
  onHoverStart: (sampleId: string) => void;
  onHoverEnd: () => void;
}) {
  const topContributions = [...sample.contributionRatios]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
  const formatSourceLabel = (vertexId: VertexId) =>
    formatSourceVertexLabel(shape, vertexId, formatVertexRef);

  return (
    <div
      className={`rounded border px-3 py-2 text-xs transition ${
        isHovered
          ? 'border-emerald-300/70 bg-emerald-400/10 shadow-[0_0_0_1px_rgba(110,231,183,0.22)]'
          : 'border-stone-800 bg-stone-950'
      }`}
      data-field-atlas-sample-id={sample.id}
      onFocus={() => onHoverStart(sample.id)}
      onBlur={onHoverEnd}
      onPointerEnter={() => onHoverStart(sample.id)}
      onPointerLeave={onHoverEnd}
      tabIndex={0}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="block truncate font-medium text-stone-200">
            {formatSampleLabel(shape, sample, chart, formatVertexRef, shortenId)}
          </span>
          <span className="mt-1 block text-stone-500">
            intensity {formatNumber(sample.intensity)} / phase {formatNumber(sample.phase)} rad
          </span>
        </span>
        {sample.chartSemanticRole ? (
          <span className="shrink-0 rounded border border-stone-700 bg-stone-900 px-2 py-0.5 text-[11px] text-stone-400">
            {formatChartRole(sample.chartSemanticRole)}
          </span>
        ) : null}
      </div>
      <div className="mt-2 grid gap-1">
        {topContributions.map((contribution) => (
          <div
            key={contribution.sourceId}
            className="flex items-center justify-between gap-3 text-stone-400"
          >
            <span className="min-w-0 truncate">{formatSourceLabel(contribution.vertexId)}</span>
            <span className="shrink-0 font-mono text-stone-500">
              {formatPercent(contribution.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FieldAtlasDiagnosticNote() {
  return (
    <p className="rounded border border-stone-800 bg-stone-950 px-3 py-2 text-xs leading-5 text-stone-500">
      Derived diagnostic atlas only: sampled from closed geometry, independent of Explode View, and
      not semantic naming.
    </p>
  );
}

function SurfaceSamplingSection({
  shape,
  model,
  formatVertexRef,
  shortenId,
}: {
  shape: Shape;
  model: SurfaceSamplingInspectorModel;
  formatVertexRef: (vertexId: VertexId) => string;
  shortenId: (id: string) => string;
}) {
  if (model.status === 'unsupported') {
    return (
      <div className="rounded border border-amber-400/30 bg-amber-400/10 px-3 py-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
            Surface Sampling
          </h3>
          <span className="shrink-0 rounded border border-amber-300/40 bg-amber-300/10 px-2 py-0.5 text-[11px] text-amber-100">
            unsupported
          </span>
        </div>
        <p className="mt-2 text-xs leading-5 text-stone-300">{model.reason}</p>
      </div>
    );
  }

  return (
    <div className="rounded border border-stone-800 bg-stone-950 px-3 py-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Surface Sampling
          </h3>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            Bounded chart samples from closed geometry; computational charts are non-semantic.
          </p>
        </div>
        <span className="shrink-0 rounded border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[11px] text-emerald-100">
          supported
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <FieldAtlasMetric label="Subdivisions" value={model.atlas.options.subdivisions} />
        <FieldAtlasMetric label="Max cap" value={model.atlas.options.maxSamples} />
        <FieldAtlasMetric label="Samples" value={model.atlas.samples.length} />
        <FieldAtlasMetric label="Charts" value={model.atlas.domain.surfaceCharts.length} />
        <FieldAtlasMetric label="Direct charts" value={model.directChartCount} />
        <FieldAtlasMetric label="Computational" value={model.computationalChartCount} />
        <FieldAtlasMetric label="Sources" value={model.atlas.sources.length} />
        <FieldAtlasMetric
          label="Ratios"
          value={model.allChartContributionRatiosValid ? 'all valid' : 'check diagnostic'}
        />
        <FieldAtlasMetric label="Intensity" value={formatRange(model.intensityRange)} />
        <FieldAtlasMetric label="Phase" value={`${formatRange(model.phaseRange)} rad`} />
      </dl>

      <div className="mt-3 grid max-h-64 gap-2 overflow-y-auto pr-1">
        {model.atlas.chartSummaries.map((summary) => (
          <SurfaceChartSummaryRow
            key={summary.chartId}
            shape={shape}
            summary={summary}
            chart={model.chartById.get(summary.chartId)}
            formatVertexRef={formatVertexRef}
            shortenId={shortenId}
          />
        ))}
      </div>
    </div>
  );
}

function SurfaceChartSummaryRow({
  shape,
  summary,
  chart,
  formatVertexRef,
  shortenId,
}: {
  shape: Shape;
  summary: SurfaceChartSampleSummary;
  chart?: FieldSurfaceSampleChart;
  formatVertexRef: (vertexId: VertexId) => string;
  shortenId: (id: string) => string;
}) {
  return (
    <div className="rounded border border-stone-800 bg-stone-900/70 px-3 py-2 text-xs">
      <div className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="block truncate font-medium text-stone-200">
            {formatSurfaceChartLabel(shape, chart, summary, formatVertexRef, shortenId)}
          </span>
          <span className="mt-1 block truncate text-stone-500">
            source face{' '}
            {formatFaceBoundaryLabel(shape, summary.sourceFaceId, formatVertexRef, shortenId)}
          </span>
        </span>
        <span
          className={`shrink-0 rounded border px-2 py-0.5 text-[11px] ${
            summary.chartSemanticRole === 'computational-only'
              ? 'border-amber-400/40 bg-amber-400/10 text-amber-100'
              : 'border-cyan-400/40 bg-cyan-400/10 text-cyan-100'
          }`}
        >
          {formatChartRole(summary.chartSemanticRole)}
        </span>
      </div>

      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-stone-400">
        <dt>samples</dt>
        <dd className="text-right font-mono text-stone-500">{summary.sampleCount}</dd>
        <dt>intensity</dt>
        <dd className="text-right font-mono text-stone-500">
          {formatNumber(summary.minIntensity)} - {formatNumber(summary.maxIntensity)}
        </dd>
        <dt>phase</dt>
        <dd className="text-right font-mono text-stone-500">
          {formatNumber(summary.minPhase)} - {formatNumber(summary.maxPhase)}
        </dd>
        <dt>ratios</dt>
        <dd className="text-right text-stone-500">
          {summary.allContributionRatiosValid ? 'valid' : 'invalid'}
        </dd>
      </dl>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-stone-600">
        <span className="font-mono">chart {shortenId(summary.chartId)}</span>
        <span className="font-mono">face {shortenId(summary.sourceFaceId)}</span>
      </div>
    </div>
  );
}

function GradientDiagnosticsSection({
  shape,
  model,
  formatVertexRef,
  shortenId,
}: {
  shape: Shape;
  model: GradientDiagnosticsInspectorModel;
  formatVertexRef: (vertexId: VertexId) => string;
  shortenId: (id: string) => string;
}) {
  if (model.status === 'unsupported') {
    return (
      <div className="rounded border border-amber-400/30 bg-amber-400/10 px-3 py-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
            Gradient Diagnostics
          </h3>
          <span className="shrink-0 rounded border border-amber-300/40 bg-amber-300/10 px-2 py-0.5 text-[11px] text-amber-100">
            unsupported
          </span>
        </div>
        <p className="mt-2 text-xs leading-5 text-stone-300">{model.reason}</p>
      </div>
    );
  }

  return (
    <div className="rounded border border-stone-800 bg-stone-950 px-3 py-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Gradient Diagnostics
          </h3>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            Approximate chart-local intensity gradients; not feature extraction or semantic naming.
          </p>
        </div>
        <span className="shrink-0 rounded border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[11px] text-emerald-100">
          supported
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <FieldAtlasMetric label="Method" value={formatGradientMethod(model.diagnostics.method)} />
        <FieldAtlasMetric label="Charts" value={model.diagnostics.chartDiagnostics.length} />
        <FieldAtlasMetric label="Estimates" value={model.diagnostics.sampleGradients.length} />
        <FieldAtlasMetric label="Underdetermined" value={model.underdeterminedChartCount} />
        <FieldAtlasMetric label="Determined" value={model.determinedChartCount} />
        <FieldAtlasMetric label="Phase gradient" value={model.phaseGradientStatus} />
        <FieldAtlasMetric
          label="Gradient min"
          value={formatNumber(model.intensityGradientMagnitude.min)}
        />
        <FieldAtlasMetric
          label="Gradient max"
          value={formatNumber(model.intensityGradientMagnitude.max)}
        />
        <FieldAtlasMetric
          label="Gradient avg"
          value={formatNumber(model.intensityGradientMagnitude.average)}
        />
      </dl>

      <div className="mt-3 grid max-h-64 gap-2 overflow-y-auto pr-1">
        {model.diagnostics.chartDiagnostics.map((diagnostic) => (
          <GradientChartDiagnosticRow
            key={diagnostic.chartId}
            shape={shape}
            diagnostic={diagnostic}
            chart={model.chartById.get(diagnostic.chartId)}
            formatVertexRef={formatVertexRef}
            shortenId={shortenId}
          />
        ))}
      </div>
    </div>
  );
}

function GradientChartDiagnosticRow({
  shape,
  diagnostic,
  chart,
  formatVertexRef,
  shortenId,
}: {
  shape: Shape;
  diagnostic: ChartGradientDiagnostic;
  chart?: FieldSurfaceSampleChart;
  formatVertexRef: (vertexId: VertexId) => string;
  shortenId: (id: string) => string;
}) {
  return (
    <div className="rounded border border-stone-800 bg-stone-900/70 px-3 py-2 text-xs">
      <div className="flex items-start justify-between gap-3">
        <span className="min-w-0">
          <span className="block truncate font-medium text-stone-200">
            {formatSurfaceChartLabel(shape, chart, diagnostic, formatVertexRef, shortenId)}
          </span>
          <span className="mt-1 block truncate text-stone-500">
            source face{' '}
            {formatFaceBoundaryLabel(shape, diagnostic.sourceFaceId, formatVertexRef, shortenId)}
          </span>
        </span>
        <span
          className={`shrink-0 rounded border px-2 py-0.5 text-[11px] ${
            diagnostic.chartSemanticRole === 'computational-only'
              ? 'border-amber-400/40 bg-amber-400/10 text-amber-100'
              : 'border-cyan-400/40 bg-cyan-400/10 text-cyan-100'
          }`}
        >
          {formatChartRole(diagnostic.chartSemanticRole)}
        </span>
      </div>

      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-stone-400">
        <dt>samples</dt>
        <dd className="text-right font-mono text-stone-500">{diagnostic.sampleCount}</dd>
        <dt>estimates</dt>
        <dd className="text-right font-mono text-stone-500">
          {diagnostic.estimatedGradientCount}
        </dd>
        <dt>gradient</dt>
        <dd className="text-right font-mono text-stone-500">
          {diagnostic.underdetermined
            ? 'undetermined'
            : `${formatNumber(diagnostic.minIntensityGradientMagnitude)} - ${formatNumber(
                diagnostic.maxIntensityGradientMagnitude,
              )}`}
        </dd>
        <dt>average</dt>
        <dd className="text-right font-mono text-stone-500">
          {diagnostic.underdetermined
            ? 'n/a'
            : formatNumber(diagnostic.averageIntensityGradientMagnitude)}
        </dd>
        <dt>phase</dt>
        <dd className="text-right text-stone-500">
          {formatPhaseGradientStatus(diagnostic.phaseGradientStatus)}
        </dd>
        <dt>status</dt>
        <dd className="text-right text-stone-500">
          {diagnostic.underdetermined ? 'underdetermined' : 'determined'}
        </dd>
      </dl>

      {diagnostic.underdeterminedReason ? (
        <p className="mt-2 text-xs leading-5 text-amber-100/80">
          {diagnostic.underdeterminedReason}
        </p>
      ) : null}

      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-stone-600">
        <span className="font-mono">chart {shortenId(diagnostic.chartId)}</span>
        <span className="font-mono">face {shortenId(diagnostic.sourceFaceId)}</span>
      </div>
    </div>
  );
}

function buildInspectorModel(shape: Shape): FieldAtlasInspectorModel {
  try {
    const domain = buildClosedShapeSurfaceSourceDomain(shape);
    const sources = buildFieldSourcePopulation(shape, domain);
    const samplePoints = buildClosedShapeSurfaceRepresentativeSamplePoints(domain);
    const samples = sampleFieldAtlasPoints(sources, samplePoints);

    return {
      status: 'supported',
      domain,
      sources,
      samples,
      sourceKindCounts: countSourceKinds(sources),
      intensityRange: getIntensityRange(samples),
      representativeSamples: pickRepresentativeSamples(samples),
      chartById: new Map(domain.surfaceCharts.map((chart) => [chart.chartId, chart])),
    };
  } catch (error) {
    return {
      status: 'unsupported',
      reason: formatError(error),
    };
  }
}

function buildSurfaceSamplingModel(shape: Shape): SurfaceSamplingInspectorModel {
  try {
    const atlas = sampleClosedShapeSurfaceAtlas(shape);

    return {
      status: 'supported',
      atlas,
      intensityRange: getNumericRange(atlas.samples.map((sample) => sample.intensity)),
      phaseRange: getNumericRange(atlas.samples.map((sample) => sample.phase)),
      directChartCount: atlas.domain.surfaceCharts.filter(
        (chart) => chart.kind === 'direct-triangle-face-chart',
      ).length,
      computationalChartCount: atlas.domain.surfaceCharts.filter(
        (chart) => chart.semanticRole === 'computational-only',
      ).length,
      allChartContributionRatiosValid: atlas.chartSummaries.every(
        (summary) => summary.allContributionRatiosValid,
      ),
      chartById: new Map(atlas.domain.surfaceCharts.map((chart) => [chart.chartId, chart])),
    };
  } catch (error) {
    return {
      status: 'unsupported',
      reason: formatError(error),
    };
  }
}

function buildGradientDiagnosticsModel(shape: Shape): GradientDiagnosticsInspectorModel {
  try {
    const sampledAtlas = sampleClosedShapeSurfaceAtlas(shape);
    const diagnostics = buildGradientDiagnostics(sampledAtlas);
    const determinedChartDiagnostics = diagnostics.chartDiagnostics.filter(
      (diagnostic) => !diagnostic.underdetermined,
    );

    return {
      status: 'supported',
      diagnostics,
      chartById: new Map(sampledAtlas.domain.surfaceCharts.map((chart) => [chart.chartId, chart])),
      underdeterminedChartCount: diagnostics.chartDiagnostics.length - determinedChartDiagnostics.length,
      determinedChartCount: determinedChartDiagnostics.length,
      intensityGradientMagnitude: getChartGradientMagnitudeSummary(determinedChartDiagnostics),
      phaseGradientStatus: formatGlobalPhaseGradientStatus(diagnostics),
    };
  } catch (error) {
    return {
      status: 'unsupported',
      reason: formatError(error),
    };
  }
}

function countSourceKinds(sources: FieldAtlasSource[]): Record<FieldAtlasSourceKind, number> {
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

function getIntensityRange(samples: FieldAtlasSample[]): NumericRange {
  return getNumericRange(samples.map((sample) => sample.intensity));
}

function getNumericRange(values: number[]): NumericRange {
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

function getChartGradientMagnitudeSummary(
  diagnostics: ChartGradientDiagnostic[],
): NumericSummary {
  if (!diagnostics.length) {
    return { min: 0, max: 0, average: 0 };
  }

  return {
    min: Math.min(
      ...diagnostics.map((diagnostic) => diagnostic.minIntensityGradientMagnitude),
    ),
    max: Math.max(
      ...diagnostics.map((diagnostic) => diagnostic.maxIntensityGradientMagnitude),
    ),
    average:
      diagnostics.reduce(
        (sum, diagnostic) => sum + diagnostic.averageIntensityGradientMagnitude,
        0,
      ) / diagnostics.length,
  };
}

function pickRepresentativeSamples(samples: FieldAtlasSample[]): FieldAtlasSample[] {
  if (samples.length <= 4) {
    return samples;
  }

  const selected: FieldAtlasSample[] = [];
  const addSample = (sample: FieldAtlasSample | undefined) => {
    if (sample && !selected.some((candidate) => candidate.id === sample.id)) {
      selected.push(sample);
    }
  };

  addSample(samples.find((sample) => sample.id.startsWith('closed-shape-surface:vertex:')));
  addSample(samples.find((sample) => sample.chartId));
  addSample(samples.reduce((minimum, sample) => (sample.intensity < minimum.intensity ? sample : minimum)));
  addSample(samples.reduce((maximum, sample) => (sample.intensity > maximum.intensity ? sample : maximum)));

  for (const sample of samples) {
    if (selected.length >= 4) {
      break;
    }

    addSample(sample);
  }

  return selected;
}

function formatSurfaceSelectionStrategy(
  strategy: ClosedShapeSurfaceSourceDomain['surfaceSelectionStrategy'],
): string {
  if (strategy.kind === 'single-cell-seed-surface') {
    return 'single-cell seed';
  }

  return `topological incidence (${strategy.boundaryFaceCount} boundary / ${strategy.internalFaceCount} internal)`;
}

function formatSurfaceChartLabel(
  shape: Shape,
  chart: FieldSurfaceSampleChart | undefined,
  summary: SurfaceChartLabelSummary,
  formatVertexRef: (vertexId: VertexId) => string,
  shortenId: (id: string) => string,
): string {
  if (!chart) {
    return `Chart ${shortenId(summary.chartId)}`;
  }

  if (chart.kind === 'computational-triangle-chart') {
    return `Computational chart ${formatEdgeLabel(shape, chart.boundaryVertexIds, formatVertexRef)}`;
  }

  return `Face-local chart ${formatFaceBoundaryLabel(
    shape,
    chart.sourceFaceId,
    formatVertexRef,
    shortenId,
  )}`;
}

function formatGradientMethod(method: string): string {
  return method === 'chart-local-least-squares-plane-v1'
    ? 'least-squares plane'
    : method;
}

function formatGlobalPhaseGradientStatus(diagnostics: FieldAtlasGradientDiagnostics): string {
  const statuses = new Set(
    diagnostics.chartDiagnostics.map((diagnostic) =>
      formatPhaseGradientStatus(diagnostic.phaseGradientStatus),
    ),
  );

  return Array.from(statuses).join(', ') || 'none';
}

function formatSourceKind(kind: FieldAtlasSourceKind): string {
  if (kind === 'ambo-midpoint-child') {
    return 'Ambo midpoint';
  }

  if (kind === 'generated-child') {
    return 'Generated';
  }

  return kind[0].toUpperCase() + kind.slice(1);
}

function formatSampleLabel(
  shape: Shape,
  sample: FieldAtlasSample,
  chart: FieldSurfaceSampleChart | undefined,
  formatVertexRef: (vertexId: VertexId) => string,
  shortenId: (id: string) => string,
): string {
  const vertexPrefix = 'closed-shape-surface:vertex:';
  const facePrefix = 'closed-shape-surface:face-centroid:';

  if (sample.id.startsWith(vertexPrefix)) {
    return `Vertex ${formatSourceVertexLabel(
      shape,
      sample.id.slice(vertexPrefix.length),
      formatVertexRef,
    )}`;
  }

  if (sample.id.startsWith(facePrefix)) {
    return `Face center ${formatFaceBoundaryLabel(
      shape,
      sample.id.slice(facePrefix.length),
      formatVertexRef,
      shortenId,
    )}`;
  }

  if (chart?.kind === 'computational-triangle-chart') {
    return `Chart center ${formatEdgeLabel(shape, chart.boundaryVertexIds, formatVertexRef)}`;
  }

  if (chart?.kind === 'direct-triangle-face-chart') {
    return `Face center ${formatFaceBoundaryLabel(
      shape,
      chart.sourceFaceId,
      formatVertexRef,
      shortenId,
    )}`;
  }

  return shortenId(sample.id);
}

function formatSourceVertexLabel(
  shape: Shape,
  vertexId: VertexId,
  formatVertexRef: (vertexId: VertexId) => string,
): string {
  const vertex = shape.vertices[vertexId];

  if (
    vertex?.createdBy.operation === 'ambo-dissection' &&
    vertex.createdBy.sourceVertexIds.length === 2
  ) {
    const [a, b] = vertex.createdBy.sourceVertexIds;

    return `mid(${formatVertexRef(a)}-${formatVertexRef(b)})`;
  }

  return formatVertexRef(vertexId);
}

function formatFaceBoundaryLabel(
  shape: Shape,
  faceId: string,
  formatVertexRef: (vertexId: VertexId) => string,
  shortenId: (id: string) => string,
): string {
  const face = shape.faces.find((candidate) => candidate.id === faceId);

  return face
    ? face.vertexIds
        .map((vertexId) => formatSourceVertexLabel(shape, vertexId, formatVertexRef))
        .join(' - ')
    : shortenId(faceId);
}

function formatEdgeLabel(
  shape: Shape,
  vertexIds: [VertexId, VertexId],
  formatVertexRef: (vertexId: VertexId) => string,
): string {
  return vertexIds
    .map((vertexId) => formatSourceVertexLabel(shape, vertexId, formatVertexRef))
    .join(' - ');
}

function formatChartRole(role: string): string {
  return role === 'computational-only' ? 'computational-only' : role;
}

function formatPhaseGradientStatus(
  status: ChartGradientDiagnostic['phaseGradientStatus'],
): string {
  return status.status === 'omitted' ? 'omitted' : status.status;
}

function formatRange(range: NumericRange): string {
  return `${formatNumber(range.min)} - ${formatNumber(range.max)}`;
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return String(value);
  }

  if (value === 0) {
    return '0';
  }

  const absoluteValue = Math.abs(value);

  if (absoluteValue < 0.001 || absoluteValue >= 10000) {
    return value.toExponential(2);
  }

  return value.toFixed(absoluteValue < 1 ? 4 : 3).replace(/\.?0+$/, '');
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(value >= 0.1 ? 0 : 1)}%`;
}

function formatError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const [reason, details] = message.split(' Details: ');

  if (!details) {
    return reason;
  }

  return `${reason} Details are available from the field-atlas diagnostic.`;
}

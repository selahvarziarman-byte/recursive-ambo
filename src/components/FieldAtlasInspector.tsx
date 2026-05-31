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

  if (atlas.status === 'unsupported') {
    return (
      <div className="grid gap-3 text-sm">
        <div className="rounded border border-amber-400/30 bg-amber-400/10 px-3 py-2">
          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
            Unsupported
          </span>
          <p className="mt-2 text-xs leading-5 text-stone-300">{atlas.reason}</p>
        </div>
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
}: {
  shape: Shape;
  sample: FieldAtlasSample;
  chart?: FieldSurfaceSampleChart;
  formatVertexRef: (vertexId: VertexId) => string;
  shortenId: (id: string) => string;
}) {
  const topContributions = [...sample.contributionRatios]
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
  const formatSourceLabel = (vertexId: VertexId) =>
    formatSourceVertexLabel(shape, vertexId, formatVertexRef);

  return (
    <div className="rounded border border-stone-800 bg-stone-950 px-3 py-2 text-xs">
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

function getIntensityRange(samples: FieldAtlasSample[]): { min: number; max: number } {
  if (!samples.length) {
    return { min: 0, max: 0 };
  }

  return samples.reduce(
    (range, sample) => ({
      min: Math.min(range.min, sample.intensity),
      max: Math.max(range.max, sample.intensity),
    }),
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
  );
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
  return role === 'computational-only' ? 'computational' : role;
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

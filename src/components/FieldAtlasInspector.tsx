import { type ReactNode, useMemo, useState } from 'react';
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
import {
  buildPhaseDiagnostics,
  type ChartPhaseDiagnostic,
  type FieldAtlasPhaseDiagnostics,
} from '../lib/fieldAtlasPhase';
import {
  buildFieldFeatureReport,
  type FieldFeatureReport,
  type FieldFeatureReportObservation,
} from '../lib/fieldAtlasFeatureReport';
import {
  buildProfileAwareFieldAtlasViewModelRuntimeReport,
  type ProfileAwareFieldAtlasChartAnchorMarker,
  type ProfileAwareFieldAtlasChartProbe,
  type ProfileAwareFieldAtlasChildSourceDerivationProbe,
  type ProfileAwareFieldAtlasFeatureMarker,
  type ProfileAwareFieldAtlasFeatureProbe,
  type ProfileAwareFieldAtlasProbe,
  type ProfileAwareFieldAtlasRenderScale,
  type ProfileAwareFieldAtlasRouteGateCandidateMarker,
  type ProfileAwareFieldAtlasRouteGateProbe,
  type ProfileAwareFieldAtlasSourceProbe,
  type ProfileAwareFieldAtlasSummaryProbe,
  type ProfileAwareFieldAtlasSupportRegionCandidateMarker,
  type ProfileAwareFieldAtlasSupportRegionProbe,
  type ProfileAwareFieldAtlasSurfaceSampleProbe,
  type ProfileAwareFieldAtlasViewModelRuntimeReport,
} from '../lib/fieldSourceProfileAwareAtlasViewModel';
import {
  useGeometryStore,
  type FieldAtlasLayerVisibility,
  type FieldAtlasSampleRenderMode,
} from '../store/geometryStore';
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

type PhaseDiagnosticsInspectorModel =
  | {
      status: 'supported';
      diagnostics: FieldAtlasPhaseDiagnostics;
      chartById: Map<string, FieldSurfaceSampleChart>;
      underdeterminedChartCount: number;
      determinedChartCount: number;
      phaseGradientMagnitude: NumericSummary;
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
  const fieldReport = useMemo(() => buildFieldFeatureReport(shape), [shape]);
  const profileAwareRuntimeReport = useMemo(
    () => buildProfileAwareFieldAtlasViewModelRuntimeReport(shape),
    [shape],
  );
  const [advancedDiagnosticsOpen, setAdvancedDiagnosticsOpen] = useState(false);
  const hoveredFieldAtlasSampleId = useGeometryStore(
    (state) => state.hoveredFieldAtlasSampleId,
  );
  const setHoveredFieldAtlasSampleId = useGeometryStore(
    (state) => state.setHoveredFieldAtlasSampleId,
  );
  const pinnedFieldAtlasProbeRef = useGeometryStore(
    (state) => state.pinnedFieldAtlasProbeRef,
  );
  const setPinnedFieldAtlasProbeRef = useGeometryStore(
    (state) => state.setPinnedFieldAtlasProbeRef,
  );
  const clearPinnedFieldAtlasProbeRef = useGeometryStore(
    (state) => state.clearPinnedFieldAtlasProbeRef,
  );
  const clearHoveredFieldAtlasSampleId = (sampleId: string) => {
    if (useGeometryStore.getState().hoveredFieldAtlasSampleId === sampleId) {
      setHoveredFieldAtlasSampleId(null);
    }
  };
  const togglePinnedFieldAtlasProbeRef = (probeRef: string) => {
    setPinnedFieldAtlasProbeRef(
      pinnedFieldAtlasProbeRef === probeRef ? null : probeRef,
    );
  };

  if (atlas.status === 'unsupported') {
    return (
      <div className="grid gap-3 text-sm">
        <div className="rounded border border-amber-400/30 bg-amber-400/10 px-3 py-2">
          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
            Unsupported
          </span>
          <p className="mt-2 text-xs leading-5 text-stone-300">{atlas.reason}</p>
        </div>
        <ProfileAwareFieldModeRuntimeSection
          report={profileAwareRuntimeReport}
          hoveredFieldAtlasSampleId={hoveredFieldAtlasSampleId}
          pinnedFieldAtlasProbeRef={pinnedFieldAtlasProbeRef}
          onHoverSampleStart={setHoveredFieldAtlasSampleId}
          onHoverSampleEnd={clearHoveredFieldAtlasSampleId}
          onTogglePinnedProbe={togglePinnedFieldAtlasProbeRef}
          onClearPinnedProbe={clearPinnedFieldAtlasProbeRef}
          shortenId={shortenId}
        />
        <FieldReportSection
          report={fieldReport}
          hoveredFieldAtlasSampleId={hoveredFieldAtlasSampleId}
          onHoverSampleStart={setHoveredFieldAtlasSampleId}
          onHoverSampleEnd={clearHoveredFieldAtlasSampleId}
        />
        <AdvancedFieldDiagnosticsSection
          open={advancedDiagnosticsOpen}
          onOpenChange={setAdvancedDiagnosticsOpen}
          shape={shape}
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

      <ProfileAwareFieldModeRuntimeSection
        report={profileAwareRuntimeReport}
        hoveredFieldAtlasSampleId={hoveredFieldAtlasSampleId}
        pinnedFieldAtlasProbeRef={pinnedFieldAtlasProbeRef}
        onHoverSampleStart={setHoveredFieldAtlasSampleId}
        onHoverSampleEnd={clearHoveredFieldAtlasSampleId}
        onTogglePinnedProbe={togglePinnedFieldAtlasProbeRef}
        onClearPinnedProbe={clearPinnedFieldAtlasProbeRef}
        shortenId={shortenId}
      />

      <dl className="grid grid-cols-2 gap-2 text-xs">
        <FieldAtlasMetric label="Domain" value="closed-shape surface" />
        <FieldAtlasMetric label="Sources" value={atlas.sources.length} />
        <FieldAtlasMetric
          label="Generated"
          value={countGeneratedSources(atlas.sourceKindCounts)}
        />
        <FieldAtlasMetric label="Surface faces" value={atlas.domain.faceIds.length} />
        <FieldAtlasMetric label="Sample probes" value={atlas.samples.length} />
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
          {sourceKindOrder
            .filter((kind) => atlas.sourceKindCounts[kind] > 0)
            .map((kind) => (
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

      <FieldReportSection
        report={fieldReport}
        hoveredFieldAtlasSampleId={hoveredFieldAtlasSampleId}
        onHoverSampleStart={setHoveredFieldAtlasSampleId}
        onHoverSampleEnd={clearHoveredFieldAtlasSampleId}
      />

      <div className="grid gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          Sample Probes
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

      <AdvancedFieldDiagnosticsSection
        open={advancedDiagnosticsOpen}
        onOpenChange={setAdvancedDiagnosticsOpen}
        shape={shape}
        formatVertexRef={formatVertexRef}
        shortenId={shortenId}
      />

      <FieldAtlasDiagnosticNote />
    </div>
  );
}

function ProfileAwareFieldModeRuntimeSection({
  report,
  hoveredFieldAtlasSampleId,
  pinnedFieldAtlasProbeRef,
  onHoverSampleStart,
  onHoverSampleEnd,
  onTogglePinnedProbe,
  onClearPinnedProbe,
  shortenId,
}: {
  report: ProfileAwareFieldAtlasViewModelRuntimeReport;
  hoveredFieldAtlasSampleId: string | null;
  pinnedFieldAtlasProbeRef: string | null;
  onHoverSampleStart: (sampleId: string) => void;
  onHoverSampleEnd: (sampleId: string) => void;
  onTogglePinnedProbe: (probeRef: string) => void;
  onClearPinnedProbe: () => void;
  shortenId: (id: string) => string;
}) {
  const fieldAtlasLayerVisibility = useGeometryStore(
    (state) => state.fieldAtlasLayerVisibility,
  );
  const toggleFieldAtlasLayerVisibility = useGeometryStore(
    (state) => state.toggleFieldAtlasLayerVisibility,
  );
  const fieldAtlasSampleRenderMode = useGeometryStore(
    (state) => state.fieldAtlasSampleRenderMode,
  );
  const setFieldAtlasSampleRenderMode = useGeometryStore(
    (state) => state.setFieldAtlasSampleRenderMode,
  );

  if (report.runtimeBoundaryStatus === 'unsupported') {
    return (
      <div className="rounded border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
            Profile-aware Field Mode: unsupported
          </h3>
          <span className="rounded border border-amber-300/40 bg-amber-300/10 px-2 py-0.5 font-mono text-[11px] text-amber-100">
            {report.unsupportedIssueCode}
          </span>
        </div>
        <p className="mt-2 leading-5 text-stone-300">{report.unsupportedReason}</p>
        <dl className="mt-2 grid grid-cols-2 gap-2">
          <FieldAtlasMetric
            label="Input seed"
            value={report.inputShapeSeedKey ?? 'n/a'}
          />
          <FieldAtlasMetric label="Operation" value={report.inputShapeOperation} />
          <FieldAtlasMetric
            label="Generation"
            value={report.inputShapeGenerationDepth}
          />
          <FieldAtlasMetric label="Semantic" value={report.semanticStatus} />
          <FieldAtlasMetric label="Topology" value={report.topologyStatus} />
          <FieldAtlasMetric label="Packet write" value={report.packetWriteStatus} />
        </dl>
      </div>
    );
  }

  const viewModel = report.viewModel;
  const visibleChartAnchorMarkers =
    viewModel.chartOverlaySummary.chartAnchorMarkers.slice(0, 5);
  const visibleFeatureMarkers =
    viewModel.featureOverlaySummary.featureMarkers.slice(0, 5);
  const visibleRouteGateCandidateMarkers =
    viewModel.routeGateOverlaySummary.candidateMarkers.slice(0, 5);
  const visibleSupportRegionCandidateMarkers =
    viewModel.supportRegionOverlaySummary.candidateMarkers.slice(0, 5);
  const pinnedProbe = pinnedFieldAtlasProbeRef
    ? viewModel.probeIndex.probes[pinnedFieldAtlasProbeRef]
    : undefined;
  const hoveredProbe = hoveredFieldAtlasSampleId
    ? viewModel.probeIndex.probes[hoveredFieldAtlasSampleId]
    : undefined;
  const activeProbe = pinnedProbe ?? hoveredProbe;
  const activeProbeRef: string | undefined = pinnedProbe
    ? pinnedFieldAtlasProbeRef ?? undefined
    : hoveredProbe
      ? hoveredFieldAtlasSampleId ?? undefined
      : undefined;
  const activeProbeMode = pinnedProbe ? 'pinned' : hoveredProbe ? 'hovered' : undefined;
  const pinnedProbeIsStale = Boolean(pinnedFieldAtlasProbeRef && !pinnedProbe);

  return (
    <div className="rounded border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200">
          Profile-aware Field Mode: supported
        </h3>
        <span className="rounded border border-emerald-300/40 bg-emerald-300/10 px-2 py-0.5 font-mono text-[11px] text-emerald-100">
          {report.runtimeBoundaryStatus}
        </span>
      </div>

      <dl className="mt-2 grid grid-cols-2 gap-2">
        <FieldAtlasMetric label="Source policy" value={report.sourcePolicyId} />
        <FieldAtlasMetric label="Shape" value={shortenId(viewModel.shapeId)} />
        <FieldAtlasMetric
          label="Domain"
          value={viewModel.domainId ? shortenId(viewModel.domainId) : 'n/a'}
        />
        <FieldAtlasMetric
          label="Source markers"
          value={viewModel.sourceMarkers.length}
        />
        <FieldAtlasMetric
          label="Sample markers"
          value={viewModel.surfaceSampleMarkers.length}
        />
        <FieldAtlasMetric
          label="Feature markers"
          value={viewModel.featureOverlaySummary.featureMarkers.length}
        />
        <FieldAtlasMetric
          label="Route/gate"
          value={viewModel.routeGateOverlaySummary.totalRouteGateCandidateCount}
        />
        <FieldAtlasMetric
          label="Support/region"
          value={
            viewModel.supportRegionOverlaySummary.totalSupportRegionCandidateCount
          }
        />
        <FieldAtlasMetric label="Policy" value={report.policyRelativityStatus} />
        <FieldAtlasMetric label="Semantic" value={report.semanticStatus} />
        <FieldAtlasMetric label="Topology" value={report.topologyStatus} />
        <FieldAtlasMetric label="Overlay" value={viewModel.candidateOverlayStatus} />
      </dl>

      <ProfileAwareLayerVisibilityControls
        counts={{
          sources: viewModel.sourceMarkers.length,
          samples: viewModel.surfaceSampleMarkers.length,
          charts: viewModel.chartOverlaySummary.chartAnchorMarkers.length,
          features: viewModel.featureOverlaySummary.featureMarkers.length,
          routeGateCandidates:
            viewModel.routeGateOverlaySummary.candidateMarkers.length,
          supportRegionCandidates:
            viewModel.supportRegionOverlaySummary.candidateMarkers.length,
        }}
        visibility={fieldAtlasLayerVisibility}
        onToggle={toggleFieldAtlasLayerVisibility}
      />

      <ProfileAwareSampleRenderModeControls
        mode={fieldAtlasSampleRenderMode}
        onModeChange={setFieldAtlasSampleRenderMode}
        renderScale={viewModel.renderScale}
      />

      <div className="mt-3 grid gap-2">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Chart Summaries
          </h4>
          <p className="mt-1 leading-5 text-stone-500">
            Chart anchors are sample centroids only; not face heatmaps or
            topology.
          </p>
        </div>
        {visibleChartAnchorMarkers.length ? (
          visibleChartAnchorMarkers.map((marker) => (
            <ProfileAwareChartAnchorRow
              key={marker.chartId}
              marker={marker}
              isHovered={hoveredFieldAtlasSampleId === marker.probeRef}
              isPinned={pinnedFieldAtlasProbeRef === marker.probeRef}
              onHoverStart={onHoverSampleStart}
              onHoverEnd={onHoverSampleEnd}
              onTogglePinnedProbe={onTogglePinnedProbe}
              shortenId={shortenId}
            />
          ))
        ) : (
          <p className="rounded border border-stone-800 bg-stone-900 px-2 py-2 text-stone-500">
            No profile-aware chart summary anchors under the current runtime
            bounds.
          </p>
        )}
      </div>

      <div className="mt-3 grid gap-2">
        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          Feature Markers
        </h4>
        {visibleFeatureMarkers.length ? (
          visibleFeatureMarkers.map((marker) => (
            <ProfileAwareFeatureMarkerRow
              key={marker.featureId}
              marker={marker}
              reason={getProfileAwareFeatureReason(report, marker)}
              isHovered={hoveredFieldAtlasSampleId === marker.probeRef}
              onHoverStart={onHoverSampleStart}
              onHoverEnd={onHoverSampleEnd}
            />
          ))
        ) : (
          <p className="rounded border border-stone-800 bg-stone-900 px-2 py-2 text-stone-500">
            No profile-aware feature markers under the current runtime bounds.
          </p>
        )}
      </div>

      <div className="mt-3 grid gap-2">
        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          Route/Gate Candidates
        </h4>
        {visibleRouteGateCandidateMarkers.length ? (
          visibleRouteGateCandidateMarkers.map((marker) => (
            <ProfileAwareRouteGateCandidateRow
              key={marker.candidateId}
              marker={marker}
              isHovered={hoveredFieldAtlasSampleId === marker.probeRef}
              isPinned={pinnedFieldAtlasProbeRef === marker.probeRef}
              onHoverStart={onHoverSampleStart}
              onHoverEnd={onHoverSampleEnd}
              onTogglePinnedProbe={onTogglePinnedProbe}
            />
          ))
        ) : (
          <p className="rounded border border-stone-800 bg-stone-900 px-2 py-2 text-stone-500">
            No profile-aware route/gate candidate anchors under the current runtime
            bounds.
          </p>
        )}
      </div>

      <div className="mt-3 grid gap-2">
        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          Support/Region Candidates
        </h4>
        {visibleSupportRegionCandidateMarkers.length ? (
          visibleSupportRegionCandidateMarkers.map((marker) => (
            <ProfileAwareSupportRegionCandidateRow
              key={marker.candidateId}
              marker={marker}
              isHovered={hoveredFieldAtlasSampleId === marker.probeRef}
              isPinned={pinnedFieldAtlasProbeRef === marker.probeRef}
              onHoverStart={onHoverSampleStart}
              onHoverEnd={onHoverSampleEnd}
              onTogglePinnedProbe={onTogglePinnedProbe}
            />
          ))
        ) : (
          <p className="rounded border border-stone-800 bg-stone-900 px-2 py-2 text-stone-500">
            No profile-aware support/region candidate anchors under the current
            runtime bounds.
          </p>
        )}
      </div>

      <ProfileAwareActiveProbeSection
        activeProbeRef={activeProbeRef}
        activeProbeMode={activeProbeMode}
        pinnedProbeRef={pinnedFieldAtlasProbeRef}
        pinnedProbeIsStale={pinnedProbeIsStale}
        probe={activeProbe}
        onClearPinnedProbe={onClearPinnedProbe}
        shortenId={shortenId}
      />
    </div>
  );
}

function ProfileAwareLayerVisibilityControls({
  counts,
  visibility,
  onToggle,
}: {
  counts: Record<keyof FieldAtlasLayerVisibility, number>;
  visibility: FieldAtlasLayerVisibility;
  onToggle: (key: keyof FieldAtlasLayerVisibility) => void;
}) {
  const layers: Array<{
    key: keyof FieldAtlasLayerVisibility;
    label: string;
  }> = [
    { key: 'sources', label: 'Sources' },
    { key: 'samples', label: 'Samples' },
    { key: 'charts', label: 'Charts' },
    { key: 'features', label: 'Features' },
    { key: 'routeGateCandidates', label: 'Route/Gate' },
    { key: 'supportRegionCandidates', label: 'Support/Region' },
  ];

  return (
    <div className="mt-3 rounded border border-stone-800 bg-stone-950 px-2 py-2">
      <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
        Visible Layers
      </h4>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {layers.map((layer) => {
          const isVisible = visibility[layer.key];

          return (
            <button
              key={layer.key}
              className={`rounded border px-2 py-1.5 text-left transition ${
                isVisible
                  ? 'border-emerald-300/40 bg-emerald-400/10 text-emerald-100'
                  : 'border-stone-800 bg-stone-900 text-stone-500'
              }`}
              data-profile-aware-layer-visibility={layer.key}
              onClick={() => onToggle(layer.key)}
              type="button"
            >
              <span className="flex items-center justify-between gap-2">
                <span>{layer.label}</span>
                <span className="font-mono text-[11px]">{counts[layer.key]}</span>
              </span>
              {!isVisible ? (
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.12em]">
                  hidden
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProfileAwareSampleRenderModeControls({
  mode,
  onModeChange,
  renderScale,
}: {
  mode: FieldAtlasSampleRenderMode;
  onModeChange: (mode: FieldAtlasSampleRenderMode) => void;
  renderScale: ProfileAwareFieldAtlasRenderScale;
}) {
  const modes: Array<{
    mode: FieldAtlasSampleRenderMode;
    label: string;
  }> = [
    { mode: 'family', label: 'Family' },
    { mode: 'intensity', label: 'Intensity' },
    { mode: 'phase', label: 'Phase' },
    { mode: 'dominance', label: 'Dominance' },
  ];

  return (
    <div className="mt-3 rounded border border-stone-800 bg-stone-950 px-2 py-2">
      <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
        Sample Render Mode
      </h4>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {modes.map((entry) => {
          const isActive = entry.mode === mode;

          return (
            <button
              key={entry.mode}
              className={`rounded border px-2 py-1.5 text-left transition ${
                isActive
                  ? 'border-cyan-300/50 bg-cyan-400/10 text-cyan-100'
                  : 'border-stone-800 bg-stone-900 text-stone-500'
              }`}
              data-profile-aware-sample-render-mode={entry.mode}
              onClick={() => onModeChange(entry.mode)}
              type="button"
            >
              {entry.label}
            </button>
          );
        })}
      </div>
      <dl className="mt-2 grid gap-1 font-mono text-[11px] text-stone-400">
        <div className="flex items-center justify-between gap-2">
          <dt>intensity</dt>
          <dd>
            {formatNumber(renderScale.intensityMin)} -{' '}
            {formatNumber(renderScale.intensityMax)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt>phase</dt>
          <dd>
            {formatNumber(renderScale.phaseMin)} -{' '}
            {formatNumber(renderScale.phaseMax)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt>dominance</dt>
          <dd>
            {formatNumber(renderScale.dominantContributionRatioMin)} -{' '}
            {formatNumber(renderScale.dominantContributionRatioMax)}
          </dd>
        </div>
      </dl>
      <p className="mt-2 leading-5 text-stone-500">
        Phase is sample-local, not a global continuity claim. Dominance is a
        contribution ratio, not semantic naming.
      </p>
    </div>
  );
}

function ProfileAwareChartAnchorRow({
  marker,
  isHovered,
  isPinned,
  onHoverStart,
  onHoverEnd,
  onTogglePinnedProbe,
  shortenId,
}: {
  marker: ProfileAwareFieldAtlasChartAnchorMarker;
  isHovered: boolean;
  isPinned: boolean;
  onHoverStart: (hoverRef: string) => void;
  onHoverEnd: (hoverRef: string) => void;
  onTogglePinnedProbe: (probeRef: string) => void;
  shortenId: (id: string) => string;
}) {
  return (
    <button
      className={`rounded border px-2 py-2 text-left transition ${
        isPinned
          ? 'border-amber-200/80 bg-amber-300/10 shadow-[0_0_0_1px_rgba(252,211,77,0.22)]'
          : isHovered
            ? 'border-violet-300/70 bg-violet-400/10 shadow-[0_0_0_1px_rgba(196,181,253,0.18)]'
            : 'border-stone-800 bg-stone-900'
      }`}
      data-profile-aware-chart-anchor-id={marker.chartId}
      onClick={() => onTogglePinnedProbe(marker.probeRef)}
      onFocus={() => onHoverStart(marker.probeRef)}
      onBlur={() => onHoverEnd(marker.probeRef)}
      onPointerEnter={() => onHoverStart(marker.probeRef)}
      onPointerLeave={() => onHoverEnd(marker.probeRef)}
      type="button"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-stone-200">
          {formatChartRole(marker.chartSemanticRole)}
        </span>
        <span className="font-mono text-[11px] text-stone-500">
          samples {marker.sampleCount}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-stone-500">
        <span className="font-mono">
          face {shortenId(marker.sourceFaceId)}
        </span>
        <span className="text-right font-mono">
          ratios {marker.allContributionRatiosValid ? 'valid' : 'invalid'}
        </span>
        <span className="font-mono">
          int {formatNumber(marker.minIntensity)} - {formatNumber(marker.maxIntensity)}
        </span>
        <span className="text-right font-mono">
          phase {formatNumber(marker.minPhase)} - {formatNumber(marker.maxPhase)}
        </span>
      </div>
    </button>
  );
}

function ProfileAwareFeatureMarkerRow({
  marker,
  reason,
  isHovered,
  onHoverStart,
  onHoverEnd,
}: {
  marker: ProfileAwareFieldAtlasFeatureMarker;
  reason: string;
  isHovered: boolean;
  onHoverStart: (hoverRef: string) => void;
  onHoverEnd: (hoverRef: string) => void;
}) {
  return (
    <div
      className={`rounded border px-2 py-2 transition ${
        isHovered
          ? 'border-amber-300/70 bg-amber-400/10 shadow-[0_0_0_1px_rgba(252,211,77,0.18)]'
          : 'border-stone-800 bg-stone-900'
      }`}
      data-profile-aware-feature-marker-id={marker.featureId}
      onFocus={() => onHoverStart(marker.probeRef)}
      onBlur={() => onHoverEnd(marker.probeRef)}
      onPointerEnter={() => onHoverStart(marker.probeRef)}
      onPointerLeave={() => onHoverEnd(marker.probeRef)}
      tabIndex={0}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-stone-200">
          {formatReportObservationKind(marker.observationKind)}
        </span>
        <span className="font-mono text-[11px] text-stone-500">{marker.status}</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-stone-500">
        <span className="font-mono">int {formatNumber(marker.intensity)}</span>
        <span className="text-right font-mono">
          rel {formatNumber(marker.relativeIntensity)}
        </span>
        <span className="font-mono">top ratio {formatPercent(marker.topContributionRatio)}</span>
        <span className="text-right font-mono">{marker.semanticStatus}</span>
      </div>
      <p className="mt-2 leading-5 text-stone-400">
        {shortenReportReason(reason || 'profile-aware feature observation marker')}
      </p>
    </div>
  );
}

function ProfileAwareRouteGateCandidateRow({
  marker,
  isHovered,
  isPinned,
  onHoverStart,
  onHoverEnd,
  onTogglePinnedProbe,
}: {
  marker: ProfileAwareFieldAtlasRouteGateCandidateMarker;
  isHovered: boolean;
  isPinned: boolean;
  onHoverStart: (hoverRef: string) => void;
  onHoverEnd: (hoverRef: string) => void;
  onTogglePinnedProbe: (probeRef: string) => void;
}) {
  return (
    <button
      className={`rounded border px-2 py-2 text-left transition ${
        isPinned
          ? 'border-cyan-300/70 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(103,232,249,0.18)]'
          : isHovered
            ? 'border-amber-300/70 bg-amber-400/10 shadow-[0_0_0_1px_rgba(252,211,77,0.18)]'
            : 'border-stone-800 bg-stone-900'
      }`}
      data-profile-aware-route-gate-candidate-id={marker.candidateId}
      onClick={() => onTogglePinnedProbe(marker.probeRef)}
      onFocus={() => onHoverStart(marker.probeRef)}
      onBlur={() => onHoverEnd(marker.probeRef)}
      onPointerEnter={() => onHoverStart(marker.probeRef)}
      onPointerLeave={() => onHoverEnd(marker.probeRef)}
      type="button"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-stone-200">
          {formatRouteGateCandidateKind(marker.candidateKind)}
        </span>
        <span className="font-mono text-[11px] text-stone-500">
          {marker.reliability}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-stone-500">
        <span className="font-mono">{marker.candidateSubtype}</span>
        <span className="text-right font-mono">{marker.claimStatus}</span>
        <span className="font-mono">samples {marker.sampleIds.length}</span>
        <span className="text-right font-mono">edges {marker.edgeIds.length}</span>
        <span className="font-mono">
          seam {marker.seamEdgesInvolved ? 'yes' : 'no'}
        </span>
        <span className="text-right font-mono">
          anchor {marker.anchorSampleId ? 'yes' : 'no'}
        </span>
      </div>
      <p className="mt-2 leading-5 text-stone-400">
        {shortenReportReason(marker.reason)}
      </p>
    </button>
  );
}

function ProfileAwareSupportRegionCandidateRow({
  marker,
  isHovered,
  isPinned,
  onHoverStart,
  onHoverEnd,
  onTogglePinnedProbe,
}: {
  marker: ProfileAwareFieldAtlasSupportRegionCandidateMarker;
  isHovered: boolean;
  isPinned: boolean;
  onHoverStart: (hoverRef: string) => void;
  onHoverEnd: (hoverRef: string) => void;
  onTogglePinnedProbe: (probeRef: string) => void;
}) {
  return (
    <button
      className={`rounded border px-2 py-2 text-left transition ${
        isPinned
          ? 'border-cyan-300/70 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(103,232,249,0.18)]'
          : isHovered
            ? 'border-amber-300/70 bg-amber-400/10 shadow-[0_0_0_1px_rgba(252,211,77,0.18)]'
            : 'border-stone-800 bg-stone-900'
      }`}
      data-profile-aware-support-region-candidate-id={marker.candidateId}
      onClick={() => onTogglePinnedProbe(marker.probeRef)}
      onFocus={() => onHoverStart(marker.probeRef)}
      onBlur={() => onHoverEnd(marker.probeRef)}
      onPointerEnter={() => onHoverStart(marker.probeRef)}
      onPointerLeave={() => onHoverEnd(marker.probeRef)}
      type="button"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-stone-200">
          {formatSupportRegionCandidateKind(marker.candidateKind)}
        </span>
        <span className="font-mono text-[11px] text-stone-500">
          {marker.reliability}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-stone-500">
        <span className="font-mono">{formatSupportKind(marker.supportKind)}</span>
        <span className="text-right font-mono">
          samples {marker.sampleIds.length}
        </span>
        <span className="font-mono">
          observations {marker.observationIds.length}
        </span>
        <span className="text-right font-mono">
          route/gate {marker.routeGateCandidateIds.length}
        </span>
        <span className="font-mono">
          seam {marker.seamEdgesInvolved ? 'yes' : 'no'}
        </span>
        <span className="text-right font-mono">
          computational {marker.computationalOnlyInvolved ? 'yes' : 'no'}
        </span>
      </div>
      <p className="mt-2 leading-5 text-stone-400">
        {shortenReportReason(marker.reason)}
      </p>
    </button>
  );
}

function getProfileAwareFeatureReason(
  report: ProfileAwareFieldAtlasViewModelRuntimeReport,
  marker: ProfileAwareFieldAtlasFeatureMarker,
): string {
  if (report.runtimeBoundaryStatus !== 'supported') {
    return '';
  }

  const probe = report.viewModel.probeIndex.probes[marker.probeRef];

  return probe?.probeKind === 'feature-observation' ? probe.reason : '';
}

function ProfileAwareActiveProbeSection({
  activeProbeRef,
  activeProbeMode,
  pinnedProbeRef,
  pinnedProbeIsStale,
  probe,
  onClearPinnedProbe,
  shortenId,
}: {
  activeProbeRef?: string;
  activeProbeMode?: 'pinned' | 'hovered';
  pinnedProbeRef: string | null;
  pinnedProbeIsStale: boolean;
  probe?: ProfileAwareFieldAtlasProbe;
  onClearPinnedProbe: () => void;
  shortenId: (id: string) => string;
}) {
  const title =
    activeProbeMode === 'pinned'
      ? 'Pinned Field Probe'
      : activeProbeMode === 'hovered'
        ? 'Hovered Field Probe'
        : 'Active Field Probe';

  return (
    <div className="mt-3 rounded border border-stone-800 bg-stone-950 px-3 py-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          {title}
        </h4>
        <div className="flex flex-wrap items-center gap-2">
          {probe ? (
            <span className="rounded border border-cyan-400/40 bg-cyan-400/10 px-2 py-0.5 font-mono text-[11px] text-cyan-100">
              {probe.probeKind}
            </span>
          ) : null}
          {pinnedProbeRef ? (
            <button
              className="rounded border border-stone-700 bg-stone-900 px-2 py-0.5 text-[11px] text-stone-300 transition hover:border-amber-300/60 hover:text-amber-100"
              type="button"
              onClick={onClearPinnedProbe}
            >
              Clear pinned probe
            </button>
          ) : null}
        </div>
      </div>

      {pinnedProbeIsStale ? (
        <p className="mt-2 rounded border border-amber-400/30 bg-amber-400/10 px-2 py-2 leading-5 text-amber-100/90">
          Pinned probe {shortenId(pinnedProbeRef ?? '')} is not available in the current
          profile-aware view model.
        </p>
      ) : null}

      {probe ? (
        <div className="mt-2">
          {renderProfileAwareProbeCard(probe, shortenId)}
        </div>
      ) : (
        <p className="mt-2 rounded border border-stone-800 bg-stone-900 px-2 py-2 leading-5 text-stone-500">
          Hover a profile-aware source, sample, chart anchor, feature marker,
          route/gate candidate anchor, or support/region candidate anchor to
          inspect its field payload.
          {activeProbeRef ? (
            <span className="mt-1 block font-mono text-stone-600">
              no probe for {shortenId(activeProbeRef)}
            </span>
          ) : null}
        </p>
      )}
    </div>
  );
}

function renderProfileAwareProbeCard(
  probe: ProfileAwareFieldAtlasProbe,
  shortenId: (id: string) => string,
): ReactNode {
  switch (probe.probeKind) {
    case 'source':
      return <ProfileAwareSourceProbeCard probe={probe} shortenId={shortenId} />;
    case 'surface-sample':
      return <ProfileAwareSurfaceSampleProbeCard probe={probe} shortenId={shortenId} />;
    case 'chart-summary':
      return <ProfileAwareChartProbeCard probe={probe} shortenId={shortenId} />;
    case 'feature-observation':
      return <ProfileAwareFeatureProbeCard probe={probe} shortenId={shortenId} />;
    case 'route-gate-candidate':
      return <ProfileAwareRouteGateProbeCard probe={probe} shortenId={shortenId} />;
    case 'support-region-candidate':
      return (
        <ProfileAwareSupportRegionProbeCard probe={probe} shortenId={shortenId} />
      );
    case 'route-gate-summary':
    case 'support-region-summary':
      return <ProfileAwareSummaryProbeCard probe={probe} />;
    default:
      return null;
  }
}

function ProfileAwareSourceProbeCard({
  probe,
  shortenId,
}: {
  probe: ProfileAwareFieldAtlasSourceProbe;
  shortenId: (id: string) => string;
}) {
  return (
    <div className="grid gap-2">
      <dl className="grid grid-cols-2 gap-2">
        <FieldAtlasMetric label="Probe kind" value={probe.probeKind} />
        <FieldAtlasMetric label="Source" value={shortenId(probe.sourceId)} />
        <FieldAtlasMetric label="Vertex" value={shortenId(probe.vertexId)} />
        <FieldAtlasMetric label="Source kind" value={probe.sourceKind} />
        <FieldAtlasMetric
          label="Amplitude"
          value={formatNumber(probe.emissionParameters.amplitude)}
        />
        <FieldAtlasMetric
          label="Wave number"
          value={formatNumber(probe.emissionParameters.waveNumber)}
        />
        <FieldAtlasMetric
          label="Phase"
          value={formatNumber(probe.emissionParameters.phase)}
        />
        <FieldAtlasMetric
          label="Attenuation"
          value={formatNumber(probe.emissionParameters.attenuation)}
        />
        <FieldAtlasMetric
          label="Profile"
          value={formatOptionalProbeId(probe.profileId, shortenId)}
        />
        <FieldAtlasMetric
          label="Source edge"
          value={formatOptionalProbeId(probe.sourceEdgeId, shortenId)}
        />
        <FieldAtlasMetric
          label="Complement"
          value={formatOptionalProbeId(probe.complementEdgeId, shortenId)}
        />
        <FieldAtlasMetric
          label="Antipodal child"
          value={formatOptionalProbeId(probe.antipodalChildVertexId, shortenId)}
        />
        <FieldAtlasMetric label="Semantic" value={probe.semanticStatus} />
      </dl>
      {probe.childDerivation ? (
        <ProfileAwareChildSourceDerivationSection
          derivation={probe.childDerivation}
          shortenId={shortenId}
        />
      ) : null}
      {probe.candidateCaveats.length ? (
        <div className="rounded border border-stone-800 bg-stone-900 px-2 py-2">
          <h5 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
            Candidate Caveats
          </h5>
          <div className="mt-2 flex flex-wrap gap-2">
            {probe.candidateCaveats.map((caveat) => (
              <span
                key={caveat}
                className="rounded border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-mono text-[11px] text-amber-100"
              >
                {caveat}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProfileAwareChildSourceDerivationSection({
  derivation,
  shortenId,
}: {
  derivation: ProfileAwareFieldAtlasChildSourceDerivationProbe;
  shortenId: (id: string) => string;
}) {
  const visibleChannels = derivation.quarkChannels.slice(0, 4);

  return (
    <div className="rounded border border-stone-800 bg-stone-900 px-2 py-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h5 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          Child Source Derivation
        </h5>
        <span className="rounded border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 font-mono text-[11px] text-cyan-100">
          {derivation.quarkChannels.length} channels
        </span>
      </div>

      <dl className="mt-2 grid grid-cols-2 gap-2">
        <FieldAtlasMetric label="Child role" value={derivation.childRole} />
        <FieldAtlasMetric label="Grammar" value={derivation.grammarId} />
        <FieldAtlasMetric
          label="Source edge"
          value={`${shortenId(derivation.sourceEdgeId)} ${formatProbeIdList(
            derivation.sourceEdgeVertexIds,
            shortenId,
          )}`}
        />
        <FieldAtlasMetric
          label="Complement"
          value={`${formatOptionalProbeId(
            derivation.complementEdgeId,
            shortenId,
          )} ${formatProbeIdList(derivation.complementEdgeVertexIds ?? [], shortenId)}`}
        />
        <FieldAtlasMetric
          label="Antipodal child"
          value={formatOptionalProbeId(derivation.antipodalChildVertexId, shortenId)}
        />
        <FieldAtlasMetric label="Merge" value={derivation.mergeKind} />
        <FieldAtlasMetric
          label="Projection"
          value={formatProbeIdList(derivation.projectionVertexIds, shortenId)}
        />
        <FieldAtlasMetric
          label="Parent/projection"
          value={`${formatNumber(derivation.ratio.parentWeight)} / ${formatNumber(
            derivation.ratio.projectionWeight,
          )}`}
        />
        <FieldAtlasMetric
          label="Degeneracy"
          value={formatStatusList(derivation.degeneracyStatuses)}
        />
        <FieldAtlasMetric
          label="Fallback"
          value={
            derivation.fallbackKind
              ? `${derivation.fallbackKind}: ${derivation.fallbackReason ?? 'n/a'}`
              : 'none'
          }
        />
      </dl>

      {derivation.derivedParameters ? (
        <dl className="mt-2 grid grid-cols-2 gap-2">
          <FieldAtlasMetric
            label="Derived amp"
            value={formatNumber(derivation.derivedParameters.amplitude)}
          />
          <FieldAtlasMetric
            label="Derived wave"
            value={formatNumber(derivation.derivedParameters.waveNumber)}
          />
          <FieldAtlasMetric
            label="Derived phase"
            value={formatNumber(derivation.derivedParameters.phase)}
          />
          <FieldAtlasMetric
            label="Derived atten"
            value={formatNumber(derivation.derivedParameters.attenuation)}
          />
        </dl>
      ) : null}

      <div className="mt-3 grid gap-2">
        <h6 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          Quark Channels
        </h6>
        {visibleChannels.map((channel) => (
          <ProfileAwareQuarkChannelRow
            key={channel.channelId}
            channel={channel}
            shortenId={shortenId}
          />
        ))}
      </div>
    </div>
  );
}

function ProfileAwareQuarkChannelRow({
  channel,
  shortenId,
}: {
  channel: ProfileAwareFieldAtlasChildSourceDerivationProbe['quarkChannels'][number];
  shortenId: (id: string) => string;
}) {
  return (
    <div className="rounded border border-stone-800 bg-stone-950 px-2 py-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="min-w-0 truncate font-mono text-[11px] text-stone-300">
          {shortenId(channel.channelId)}
        </span>
        <span className="font-mono text-[11px] text-stone-500">
          {shortenId(channel.parent60)}60 / {shortenId(channel.projection30)}30
        </span>
      </div>
      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-stone-500">
        <dt>parent profile</dt>
        <dd className="text-right font-mono">{shortenId(channel.parentProfileId)}</dd>
        <dt>projection profile</dt>
        <dd className="text-right font-mono">
          {shortenId(channel.projectionProfileId)}
        </dd>
        <dt>amplitude</dt>
        <dd className="text-right font-mono">
          {formatNumber(channel.channelParameters.amplitude)}
        </dd>
        <dt>wave number</dt>
        <dd className="text-right font-mono">
          {formatNumber(channel.channelParameters.waveNumber)}
        </dd>
        <dt>phase</dt>
        <dd className="text-right font-mono">
          {formatNumber(channel.channelParameters.phase)}
        </dd>
        <dt>attenuation</dt>
        <dd className="text-right font-mono">
          {formatNumber(channel.channelParameters.attenuation)}
        </dd>
      </dl>
    </div>
  );
}

function ProfileAwareSurfaceSampleProbeCard({
  probe,
  shortenId,
}: {
  probe: ProfileAwareFieldAtlasSurfaceSampleProbe;
  shortenId: (id: string) => string;
}) {
  const topContributions = probe.topContributions.slice(0, 4);

  return (
    <div className="grid gap-2">
      <dl className="grid grid-cols-2 gap-2">
        <FieldAtlasMetric label="Probe kind" value={probe.probeKind} />
        <FieldAtlasMetric label="Sample" value={shortenId(probe.sampleId)} />
        <FieldAtlasMetric label="Chart" value={shortenId(probe.chartId)} />
        <FieldAtlasMetric
          label="Source face"
          value={formatOptionalProbeId(probe.sourceFaceId, shortenId)}
        />
        <FieldAtlasMetric label="Intensity" value={formatNumber(probe.intensity)} />
        <FieldAtlasMetric label="Phase" value={formatNumber(probe.phase)} />
        <FieldAtlasMetric label="Psi re" value={formatNumber(probe.psi.re)} />
        <FieldAtlasMetric label="Psi im" value={formatNumber(probe.psi.im)} />
        <FieldAtlasMetric
          label="Ratio sum"
          value={formatNumber(probe.contributionRatioSum)}
        />
        <FieldAtlasMetric
          label="Dominant source"
          value={formatOptionalProbeId(probe.dominantContributionSourceId, shortenId)}
        />
        <FieldAtlasMetric
          label="Dominant ratio"
          value={formatOptionalNumber(probe.dominantContributionRatio)}
        />
        <FieldAtlasMetric label="Semantic" value={probe.semanticStatus} />
      </dl>

      <div className="rounded border border-stone-800 bg-stone-900 px-2 py-2">
        <h5 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          Top Contributions
        </h5>
        <div className="mt-2 grid gap-1">
          {topContributions.length ? (
            topContributions.map((contribution) => (
              <div
                key={contribution.sourceId}
                className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2 text-[11px] text-stone-400"
              >
                <span className="truncate font-mono">
                  {shortenId(contribution.sourceId)}
                </span>
                <span className="truncate font-mono">
                  {shortenId(contribution.vertexId)}
                </span>
                <span className="text-right font-mono text-stone-500">
                  {formatPercent(contribution.value)}
                  {typeof contribution.magnitude === 'number'
                    ? ` / ${formatNumber(contribution.magnitude)}`
                    : ''}
                </span>
              </div>
            ))
          ) : (
            <p className="text-stone-500">No contribution entries.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileAwareChartProbeCard({
  probe,
  shortenId,
}: {
  probe: ProfileAwareFieldAtlasChartProbe;
  shortenId: (id: string) => string;
}) {
  return (
    <div className="grid gap-2">
      <dl className="grid grid-cols-2 gap-2">
        <FieldAtlasMetric label="Probe kind" value={probe.probeKind} />
        <FieldAtlasMetric label="Chart" value={shortenId(probe.chartId)} />
        <FieldAtlasMetric
          label="Source face"
          value={shortenId(probe.sourceFaceId)}
        />
        <FieldAtlasMetric
          label="Role"
          value={formatChartRole(probe.chartSemanticRole)}
        />
        <FieldAtlasMetric label="Samples" value={probe.sampleCount} />
        <FieldAtlasMetric
          label="Intensity min"
          value={formatNumber(probe.minIntensity)}
        />
        <FieldAtlasMetric
          label="Intensity max"
          value={formatNumber(probe.maxIntensity)}
        />
        <FieldAtlasMetric label="Phase min" value={formatNumber(probe.minPhase)} />
        <FieldAtlasMetric label="Phase max" value={formatNumber(probe.maxPhase)} />
        <FieldAtlasMetric
          label="Ratios"
          value={probe.allContributionRatiosValid ? 'valid' : 'invalid'}
        />
        <FieldAtlasMetric label="Semantic" value={probe.semanticStatus} />
        <FieldAtlasMetric label="Topology" value={probe.topologyStatus} />
        <FieldAtlasMetric label="Phase" value={probe.phaseContinuityStatus} />
      </dl>
      <p className="rounded border border-stone-800 bg-stone-900 px-2 py-2 leading-5 text-stone-400">
        Chart anchors are sample centroids only; not face heatmaps or topology.
      </p>
    </div>
  );
}

function ProfileAwareFeatureProbeCard({
  probe,
  shortenId,
}: {
  probe: ProfileAwareFieldAtlasFeatureProbe;
  shortenId: (id: string) => string;
}) {
  return (
    <div className="grid gap-2">
      <dl className="grid grid-cols-2 gap-2">
        <FieldAtlasMetric label="Probe kind" value={probe.probeKind} />
        <FieldAtlasMetric label="Feature" value={shortenId(probe.featureId)} />
        <FieldAtlasMetric label="Observation" value={probe.observationKind} />
        <FieldAtlasMetric label="Sample" value={shortenId(probe.sampleId)} />
        <FieldAtlasMetric label="Chart" value={shortenId(probe.chartId)} />
        <FieldAtlasMetric label="Source face" value={shortenId(probe.sourceFaceId)} />
        <FieldAtlasMetric label="Intensity" value={formatNumber(probe.intensity)} />
        <FieldAtlasMetric label="Phase" value={formatNumber(probe.phase)} />
        <FieldAtlasMetric
          label="Relative"
          value={formatNumber(probe.relativeIntensity)}
        />
        <FieldAtlasMetric
          label="Effective count"
          value={formatNumber(probe.effectiveSourceCount)}
        />
        <FieldAtlasMetric
          label="Top ratio"
          value={formatPercent(probe.topContributionRatio)}
        />
        <FieldAtlasMetric label="Status" value={probe.status} />
        <FieldAtlasMetric label="Semantic" value={probe.semanticStatus} />
        <FieldAtlasMetric
          label="Linked sample"
          value={shortenId(probe.linkedSampleProbeRef)}
        />
        <FieldAtlasMetric
          label="Policy names"
          value={formatReportSourcePolicyNames(probe.sourcePolicyNames)}
        />
      </dl>
      <p className="rounded border border-stone-800 bg-stone-900 px-2 py-2 leading-5 text-stone-400">
        {shortenReportReason(probe.reason)}
      </p>
    </div>
  );
}

function ProfileAwareRouteGateProbeCard({
  probe,
  shortenId,
}: {
  probe: ProfileAwareFieldAtlasRouteGateProbe;
  shortenId: (id: string) => string;
}) {
  return (
    <div className="grid gap-2">
      <dl className="grid grid-cols-2 gap-2">
        <FieldAtlasMetric label="Probe kind" value={probe.probeKind} />
        <FieldAtlasMetric label="Candidate" value={shortenId(probe.candidateId)} />
        <FieldAtlasMetric
          label="Kind"
          value={formatRouteGateCandidateKind(probe.candidateKind)}
        />
        <FieldAtlasMetric label="Subtype" value={probe.candidateSubtype} />
        <FieldAtlasMetric label="Status" value={probe.status} />
        <FieldAtlasMetric label="Claim" value={probe.claimStatus} />
        <FieldAtlasMetric label="Reliability" value={probe.reliability} />
        <FieldAtlasMetric label="Semantic" value={probe.semanticStatus} />
        <FieldAtlasMetric label="Topology" value={probe.topologyStatus} />
        <FieldAtlasMetric label="Phase" value={probe.phaseContinuityStatus} />
        <FieldAtlasMetric label="Samples" value={probe.sampleIds.length} />
        <FieldAtlasMetric label="Charts" value={probe.chartIds.length} />
        <FieldAtlasMetric label="Edges" value={probe.edgeIds.length} />
        <FieldAtlasMetric
          label="Seam involved"
          value={probe.seamEdgesInvolved ? 'yes' : 'no'}
        />
        <FieldAtlasMetric
          label="Path length"
          value={formatOptionalNumber(probe.pathLength)}
        />
        <FieldAtlasMetric
          label="Anchor sample"
          value={formatOptionalProbeId(probe.anchorSampleId, shortenId)}
        />
        <FieldAtlasMetric
          label="Intensity min"
          value={formatNumber(probe.intensitySummary.min)}
        />
        <FieldAtlasMetric
          label="Intensity max"
          value={formatNumber(probe.intensitySummary.max)}
        />
        <FieldAtlasMetric
          label="Intensity avg"
          value={formatNumber(probe.intensitySummary.average)}
        />
        <FieldAtlasMetric
          label="Avg source count"
          value={formatNumber(
            probe.contributionMixtureSummary.averageEffectiveSourceCount,
          )}
        />
        <FieldAtlasMetric
          label="Max top ratio"
          value={formatPercent(probe.contributionMixtureSummary.maxTopContributionRatio)}
        />
        <FieldAtlasMetric
          label="Mixed samples"
          value={probe.contributionMixtureSummary.mixedSampleCount}
        />
        <FieldAtlasMetric
          label="Policy names"
          value={formatReportSourcePolicyNames(probe.sourcePolicyNames)}
        />
      </dl>
      <p className="rounded border border-stone-800 bg-stone-900 px-2 py-2 leading-5 text-stone-400">
        {shortenReportReason(probe.reason)}
      </p>
    </div>
  );
}

function ProfileAwareSupportRegionProbeCard({
  probe,
  shortenId,
}: {
  probe: ProfileAwareFieldAtlasSupportRegionProbe;
  shortenId: (id: string) => string;
}) {
  return (
    <div className="grid gap-2">
      <dl className="grid grid-cols-2 gap-2">
        <FieldAtlasMetric label="Probe kind" value={probe.probeKind} />
        <FieldAtlasMetric label="Candidate" value={shortenId(probe.candidateId)} />
        <FieldAtlasMetric
          label="Kind"
          value={formatSupportRegionCandidateKind(probe.candidateKind)}
        />
        <FieldAtlasMetric
          label="Support kind"
          value={formatSupportKind(probe.supportKind)}
        />
        <FieldAtlasMetric label="Status" value={probe.status} />
        <FieldAtlasMetric label="Reliability" value={probe.reliability} />
        <FieldAtlasMetric label="Semantic" value={probe.semanticStatus} />
        <FieldAtlasMetric label="Topology" value={probe.topologyStatus} />
        <FieldAtlasMetric label="Phase" value={probe.phaseContinuityStatus} />
        <FieldAtlasMetric label="Samples" value={probe.sampleIds.length} />
        <FieldAtlasMetric label="Charts" value={probe.chartIds.length} />
        <FieldAtlasMetric label="Edges" value={probe.edgeIds.length} />
        <FieldAtlasMetric
          label="Observations"
          value={probe.observationIds.length}
        />
        <FieldAtlasMetric
          label="Route/gate refs"
          value={probe.routeGateCandidateIds.length}
        />
        <FieldAtlasMetric
          label="Seam involved"
          value={probe.seamEdgesInvolved ? 'yes' : 'no'}
        />
        <FieldAtlasMetric
          label="Computational only"
          value={probe.computationalOnlyInvolved ? 'yes' : 'no'}
        />
        <FieldAtlasMetric
          label="Anchor sample"
          value={formatOptionalProbeId(probe.anchorSampleId, shortenId)}
        />
        <FieldAtlasMetric
          label="Evidence samples"
          value={probe.evidenceSummary.sampleCount}
        />
        <FieldAtlasMetric
          label="Evidence charts"
          value={probe.evidenceSummary.chartCount}
        />
        <FieldAtlasMetric
          label="Seam edges"
          value={probe.evidenceSummary.seamEdgeCount}
        />
        <FieldAtlasMetric
          label="Chart-local edges"
          value={probe.evidenceSummary.chartLocalEdgeCount}
        />
        <FieldAtlasMetric
          label="Avg intensity"
          value={formatNumber(probe.evidenceSummary.averageIntensity)}
        />
        <FieldAtlasMetric
          label="Min intensity"
          value={formatNumber(probe.evidenceSummary.minIntensity)}
        />
        <FieldAtlasMetric
          label="Max intensity"
          value={formatNumber(probe.evidenceSummary.maxIntensity)}
        />
        <FieldAtlasMetric
          label="Avg source count"
          value={formatNumber(probe.evidenceSummary.averageEffectiveSourceCount)}
        />
        <FieldAtlasMetric
          label="Max top ratio"
          value={formatPercent(probe.evidenceSummary.maxTopContributionRatio)}
        />
        <FieldAtlasMetric
          label="Feature obs"
          value={probe.evidenceSummary.fieldFeatureObservationCount}
        />
        <FieldAtlasMetric
          label="Route/gate count"
          value={probe.evidenceSummary.routeGateCandidateCount}
        />
        <FieldAtlasMetric
          label="Computational samples"
          value={probe.evidenceSummary.computationalOnlySampleCount}
        />
        <FieldAtlasMetric
          label="Policy names"
          value={formatReportSourcePolicyNames(probe.sourcePolicyNames)}
        />
      </dl>
      <p className="rounded border border-stone-800 bg-stone-900 px-2 py-2 leading-5 text-stone-400">
        {shortenReportReason(probe.reason)}
      </p>
    </div>
  );
}

function ProfileAwareSummaryProbeCard({
  probe,
}: {
  probe: ProfileAwareFieldAtlasSummaryProbe;
}) {
  return (
    <dl className="grid grid-cols-2 gap-2">
      <FieldAtlasMetric label="Probe kind" value={probe.probeKind} />
      <FieldAtlasMetric label="Candidate status" value={probe.candidateStatus} />
      <FieldAtlasMetric label="Total count" value={probe.totalCount} />
      <FieldAtlasMetric label="Semantic" value={probe.semanticStatus} />
    </dl>
  );
}

function formatOptionalProbeId(
  value: string | undefined,
  shortenId: (id: string) => string,
): string {
  return value ? shortenId(value) : 'n/a';
}

function formatRouteGateCandidateKind(kind: string): string {
  return kind.replace(/-/g, ' ');
}

function formatSupportRegionCandidateKind(kind: string): string {
  return kind.replace(/-/g, ' ');
}

function formatSupportKind(kind: string): string {
  return kind.replace(/-/g, ' ');
}

function formatProbeIdList(
  values: readonly string[],
  shortenId: (id: string) => string,
): string {
  return values.length ? values.map(shortenId).join(', ') : 'n/a';
}

function formatStatusList(values: readonly string[]): string {
  return values.length ? values.join(', ') : 'none';
}

function formatOptionalNumber(value: number | undefined): string {
  return typeof value === 'number' ? formatNumber(value) : 'n/a';
}

function FieldReportSection({
  report,
  hoveredFieldAtlasSampleId,
  onHoverSampleStart,
  onHoverSampleEnd,
}: {
  report: FieldFeatureReport;
  hoveredFieldAtlasSampleId: string | null;
  onHoverSampleStart: (sampleId: string) => void;
  onHoverSampleEnd: (sampleId: string) => void;
}) {
  if (report.status === 'unsupported') {
    return (
      <div className="rounded border border-stone-800 bg-stone-950 px-3 py-2 text-xs">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          Field Report
        </h3>
        <div className="mt-2 rounded border border-amber-400/30 bg-amber-400/10 px-2 py-2">
          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
            Unsupported
          </span>
          <p className="mt-2 leading-5 text-stone-300">{report.reason}</p>
        </div>
        <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
          <FieldAtlasMetric label="Method" value={report.method} />
          <FieldAtlasMetric label="Scope" value={formatReportScope(report.scope)} />
          <FieldAtlasMetric
            label="Semantic"
            value={formatReportSemanticStatus(report.semanticStatus)}
          />
          <FieldAtlasMetric
            label="Global continuity"
            value={formatReportGlobalContinuity(report.globalSurfaceContinuity)}
          />
        </dl>
      </div>
    );
  }

  const visibleObservations = report.observations.slice(0, 5);

  return (
    <div className="rounded border border-stone-800 bg-stone-950 px-3 py-2 text-xs">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
        Field Report
      </h3>
      <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <FieldAtlasMetric
          label="Semantic"
          value={formatReportSemanticStatus(report.semanticStatus)}
        />
        <FieldAtlasMetric label="Scope" value={formatReportScope(report.scope)} />
        <FieldAtlasMetric
          label="Global continuity"
          value={formatReportGlobalContinuity(report.globalSurfaceContinuity)}
        />
        <FieldAtlasMetric
          label="Source policy"
          value={formatReportSourcePolicyNames(report.sourceSummary.sourcePolicyNames)}
        />
        <FieldAtlasMetric label="Sources" value={report.sourceSummary.totalSources} />
        <FieldAtlasMetric label="Generated" value={report.sourceSummary.generatedSources} />
        <FieldAtlasMetric
          label="Ambo midpoints"
          value={report.sourceSummary.amboMidpointSources}
        />
        <FieldAtlasMetric
          label="Cancellation-like"
          value={report.observationSummary.cancellationLikeCount}
        />
        <FieldAtlasMetric
          label="High-intensity"
          value={report.observationSummary.highIntensityAnchorCount}
        />
        <FieldAtlasMetric
          label="Ambiguous sites"
          value={report.observationSummary.ambiguousCount}
        />
      </dl>

      <div className="mt-3 grid gap-2">
        {visibleObservations.length ? (
          visibleObservations.map((observation) => (
            <FieldReportObservationRow
              key={observation.observationId}
              observation={observation}
              isHovered={hoveredFieldAtlasSampleId === observation.sampleId}
              onHoverStart={onHoverSampleStart}
              onHoverEnd={onHoverSampleEnd}
            />
          ))
        ) : (
          <p className="rounded border border-stone-800 bg-stone-900 px-2 py-2 text-stone-500">
            No report-candidate observations under the current report bounds.
          </p>
        )}
      </div>
    </div>
  );
}

function FieldReportObservationRow({
  observation,
  isHovered,
  onHoverStart,
  onHoverEnd,
}: {
  observation: FieldFeatureReportObservation;
  isHovered: boolean;
  onHoverStart: (sampleId: string) => void;
  onHoverEnd: (sampleId: string) => void;
}) {
  return (
    <div
      className={`rounded border px-2 py-2 transition ${
        isHovered
          ? 'border-amber-300/70 bg-amber-400/10 shadow-[0_0_0_1px_rgba(252,211,77,0.18)]'
          : 'border-stone-800 bg-stone-900'
      }`}
      data-field-report-observation-id={observation.observationId}
      onFocus={() => onHoverStart(observation.sampleId)}
      onBlur={() => onHoverEnd(observation.sampleId)}
      onPointerEnter={() => onHoverStart(observation.sampleId)}
      onPointerLeave={() => onHoverEnd(observation.sampleId)}
      tabIndex={0}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-stone-200">
          {formatReportObservationKind(observation.observationKind)}
        </span>
        <span className="font-mono text-[11px] text-stone-500">{observation.status}</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-stone-500">
        <span>{formatReportSemanticStatus(observation.semanticStatus)}</span>
        <span className="text-right font-mono">
          rel {formatNumber(observation.relativeIntensity)}
        </span>
        <span className="font-mono">
          eff {formatNumber(observation.effectiveSourceCount)}
        </span>
        <span className="text-right font-mono">
          top {formatPercent(observation.topContributionRatio)}
        </span>
      </div>
      <p className="mt-2 leading-5 text-stone-400">
        {shortenReportReason(observation.reason)}
      </p>
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

function AdvancedFieldDiagnosticsSection({
  open,
  onOpenChange,
  shape,
  formatVertexRef,
  shortenId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shape: Shape;
  formatVertexRef: (vertexId: VertexId) => string;
  shortenId: (id: string) => string;
}) {
  return (
    <details
      className="rounded border border-stone-800 bg-stone-950 px-3 py-2 text-xs"
      open={open}
      onToggle={(event) => onOpenChange(event.currentTarget.open)}
    >
      <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
        Advanced Field Diagnostics (Internal)
      </summary>
      {open ? (
        <AdvancedFieldDiagnosticsContent
          shape={shape}
          formatVertexRef={formatVertexRef}
          shortenId={shortenId}
        />
      ) : null}
    </details>
  );
}

function AdvancedFieldDiagnosticsContent({
  shape,
  formatVertexRef,
  shortenId,
}: {
  shape: Shape;
  formatVertexRef: (vertexId: VertexId) => string;
  shortenId: (id: string) => string;
}) {
  const surfaceSampling = useMemo(() => buildSurfaceSamplingModel(shape), [shape]);
  const gradientDiagnostics = useMemo(() => buildGradientDiagnosticsModel(shape), [shape]);
  const phaseDiagnostics = useMemo(() => buildPhaseDiagnosticsModel(shape), [shape]);

  return (
    <>
      <p className="mt-2 text-xs leading-5 text-stone-500">
        Internal atlas scaffolding for model checks: bounded surface sampling, chart-local
        gradients, and chart-local phase diagnostics.
      </p>
      <div className="mt-3 grid gap-3">
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
        <PhaseDiagnosticsSection
          shape={shape}
          model={phaseDiagnostics}
          formatVertexRef={formatVertexRef}
          shortenId={shortenId}
        />
      </div>
    </>
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

function PhaseDiagnosticsSection({
  shape,
  model,
  formatVertexRef,
  shortenId,
}: {
  shape: Shape;
  model: PhaseDiagnosticsInspectorModel;
  formatVertexRef: (vertexId: VertexId) => string;
  shortenId: (id: string) => string;
}) {
  if (model.status === 'unsupported') {
    return (
      <div className="rounded border border-amber-400/30 bg-amber-400/10 px-3 py-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
            Phase Diagnostics
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
            Phase Diagnostics
          </h3>
          <p className="mt-1 text-xs leading-5 text-stone-500">
            Chart-local phase unwrapping only; no global phase-continuity claim.
          </p>
        </div>
        <span className="shrink-0 rounded border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[11px] text-emerald-100">
          supported
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <FieldAtlasMetric
          label="Method"
          value={formatPhaseMethod(model.diagnostics.method)}
        />
        <FieldAtlasMetric label="Scope" value={formatPhaseScope(model.diagnostics.scope)} />
        <FieldAtlasMetric
          label="Global"
          value={formatGlobalPhaseContinuity(model.diagnostics.globalContinuity)}
        />
        <FieldAtlasMetric label="Charts" value={model.diagnostics.chartDiagnostics.length} />
        <FieldAtlasMetric label="Unwrapped" value={model.diagnostics.sampleUnwraps.length} />
        <FieldAtlasMetric
          label="Phase estimates"
          value={model.diagnostics.samplePhaseGradients.length}
        />
        <FieldAtlasMetric label="Underdetermined" value={model.underdeterminedChartCount} />
        <FieldAtlasMetric label="Determined" value={model.determinedChartCount} />
        <FieldAtlasMetric
          label="Phase grad min"
          value={formatNumber(model.phaseGradientMagnitude.min)}
        />
        <FieldAtlasMetric
          label="Phase grad max"
          value={formatNumber(model.phaseGradientMagnitude.max)}
        />
        <FieldAtlasMetric
          label="Phase grad avg"
          value={formatNumber(model.phaseGradientMagnitude.average)}
        />
      </dl>

      <div className="mt-3 grid max-h-64 gap-2 overflow-y-auto pr-1">
        {model.diagnostics.chartDiagnostics.map((diagnostic) => (
          <PhaseChartDiagnosticRow
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

function PhaseChartDiagnosticRow({
  shape,
  diagnostic,
  chart,
  formatVertexRef,
  shortenId,
}: {
  shape: Shape;
  diagnostic: ChartPhaseDiagnostic;
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
        <dt>unwrapped</dt>
        <dd className="text-right font-mono text-stone-500">
          {diagnostic.unwrappedSampleCount}
        </dd>
        <dt>estimates</dt>
        <dd className="text-right font-mono text-stone-500">
          {diagnostic.estimatedGradientCount}
        </dd>
        <dt>phase gradient</dt>
        <dd className="text-right font-mono text-stone-500">
          {diagnostic.underdetermined
            ? 'undetermined'
            : `${formatNumber(diagnostic.minPhaseGradientMagnitude)} - ${formatNumber(
                diagnostic.maxPhaseGradientMagnitude,
              )}`}
        </dd>
        <dt>average</dt>
        <dd className="text-right font-mono text-stone-500">
          {diagnostic.underdetermined
            ? 'n/a'
            : formatNumber(diagnostic.averagePhaseGradientMagnitude)}
        </dd>
        <dt>status</dt>
        <dd className="text-right text-stone-500">
          {diagnostic.underdetermined ? 'underdetermined' : 'determined'}
        </dd>
        <dt>method</dt>
        <dd className="text-right text-stone-500">{formatPhaseMethod(diagnostic.method)}</dd>
        <dt>scope</dt>
        <dd className="text-right text-stone-500">{formatPhaseScope(diagnostic.scope)}</dd>
        <dt>global</dt>
        <dd className="text-right text-stone-500">
          {formatGlobalPhaseContinuity(diagnostic.globalContinuity)}
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

function buildPhaseDiagnosticsModel(shape: Shape): PhaseDiagnosticsInspectorModel {
  try {
    const sampledAtlas = sampleClosedShapeSurfaceAtlas(shape);
    const diagnostics = buildPhaseDiagnostics(sampledAtlas);
    const determinedChartDiagnostics = diagnostics.chartDiagnostics.filter(
      (diagnostic) => !diagnostic.underdetermined,
    );

    return {
      status: 'supported',
      diagnostics,
      chartById: new Map(sampledAtlas.domain.surfaceCharts.map((chart) => [chart.chartId, chart])),
      underdeterminedChartCount: diagnostics.chartDiagnostics.length - determinedChartDiagnostics.length,
      determinedChartCount: determinedChartDiagnostics.length,
      phaseGradientMagnitude: getChartPhaseMagnitudeSummary(determinedChartDiagnostics),
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

function countGeneratedSources(counts: Record<FieldAtlasSourceKind, number>): number {
  return counts['generated-child'] + counts['ambo-midpoint-child'];
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

function getChartPhaseMagnitudeSummary(diagnostics: ChartPhaseDiagnostic[]): NumericSummary {
  if (!diagnostics.length) {
    return { min: 0, max: 0, average: 0 };
  }

  return {
    min: Math.min(...diagnostics.map((diagnostic) => diagnostic.minPhaseGradientMagnitude)),
    max: Math.max(...diagnostics.map((diagnostic) => diagnostic.maxPhaseGradientMagnitude)),
    average:
      diagnostics.reduce((sum, diagnostic) => sum + diagnostic.averagePhaseGradientMagnitude, 0) /
      diagnostics.length,
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

function formatPhaseMethod(method: string): string {
  return method === 'chart-local-nearest-phase-unwrap-plane-v1'
    ? 'nearest unwrap plane'
    : method;
}

function formatPhaseScope(scope: string): string {
  return scope === 'chart-local-only' ? 'chart-local only' : scope;
}

function formatGlobalPhaseContinuity(globalContinuity: string): string {
  return globalContinuity === 'none' ? 'no global claim' : globalContinuity;
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
    return `Surface probe ${formatEdgeLabel(shape, chart.boundaryVertexIds, formatVertexRef)}`;
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

function formatReportObservationKind(kind: string): string {
  switch (kind) {
    case 'cancellation-like-site-candidate':
      return 'Cancellation-like candidate';
    case 'high-intensity-anchor-candidate':
      return 'High-intensity anchor candidate';
    case 'ambiguous-field-site':
      return 'Ambiguous field-site candidate';
    default:
      return kind;
  }
}

function formatReportSemanticStatus(status: string): string {
  return status === 'not-semantic-naming' ? 'not semantic naming' : status;
}

function formatReportScope(scope: string): string {
  return scope === 'chart-local-only' ? 'chart-local only' : scope;
}

function formatReportGlobalContinuity(globalSurfaceContinuity: string): string {
  return globalSurfaceContinuity === 'none' ? 'none' : globalSurfaceContinuity;
}

function formatReportSourcePolicyNames(sourcePolicyNames: string[]): string {
  return sourcePolicyNames.length ? sourcePolicyNames.join(', ') : 'none';
}

function shortenReportReason(reason: string): string {
  const compactReason = reason.replace(/\s+/g, ' ').trim();

  return compactReason.length > 150 ? `${compactReason.slice(0, 147)}...` : compactReason;
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

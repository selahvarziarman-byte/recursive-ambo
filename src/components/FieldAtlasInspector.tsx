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
  buildProfileAwareEvidenceStabilityReport,
  type ProfileAwareEvidenceStabilityCountKey,
  type ProfileAwareEvidenceStabilityReport,
} from '../lib/fieldSourceProfileAwareEvidenceStability';
import {
  buildProfileAwareRuntimeSupportPolicyReport,
  type ProfileAwareRuntimeSupportPolicyReport,
} from '../lib/fieldSourceProfileAwareRuntimeSupportPolicy';
import {
  buildProfileAwareRuntimeSupportMatrixReport,
  type ProfileAwareRuntimeSupportMatrixReport,
} from '../lib/fieldSourceProfileAwareRuntimeSupportMatrix';
import {
  getProfileAwareRuntimeSupportPolicyRegistrySummary,
  type ProfileAwareRuntimeSupportPolicyRegistrySummary,
} from '../lib/fieldSourceProfileAwareRuntimeSupportPolicyRegistry';
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
  type ProfileAwareFieldAtlasViewModelReport,
  type ProfileAwareFieldAtlasViewModelRuntimeReport,
} from '../lib/fieldSourceProfileAwareAtlasViewModel';
import {
  useGeometryStore,
  type OperationHistoryEntry,
  type FieldAtlasLayerVisibility,
  type FieldAtlasSampleRenderMode,
} from '../store/geometryStore';
import type { Shape, ShapeId, VertexId } from '../types/geometry';
import { FieldCueV0Panel } from './FieldCueV0Panel';
import { GeneratedSiteReadingV0Panel } from './GeneratedSiteReadingV0Panel';

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
const evidenceStabilityRangeKeys: ProfileAwareEvidenceStabilityCountKey[] = [
  'totalObservationCount',
  'totalRouteGateCandidateCount',
  'totalSupportRegionCandidateCount',
  'cancellationLikeObservationCount',
  'gateCandidateCount',
  'supportClassCandidateCount',
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
  const profileAwareEvidenceStabilityReport = useMemo(
    () => buildProfileAwareEvidenceStabilityReport(),
    [],
  );
  const shapes = useGeometryStore((state) => state.shapes);
  const shapeOrder = useGeometryStore((state) => state.shapeOrder);
  const currentShapeId = useGeometryStore((state) => state.currentShapeId);
  const operationHistory = useGeometryStore((state) => state.operationHistory);
  const currentShapeIndex = shapeOrder.indexOf(currentShapeId);
  const previousShapeId =
    currentShapeIndex > 0 ? shapeOrder[currentShapeIndex - 1] : undefined;
  const previousShape = previousShapeId ? shapes[previousShapeId] : undefined;
  const currentHistoryEntry = getLatestHistoryEntryForShape(
    operationHistory,
    currentShapeId,
  );
  const previousHistoryEntry = previousShapeId
    ? getLatestHistoryEntryForShape(operationHistory, previousShapeId)
    : undefined;
  const previousProfileAwareRuntimeReport = useMemo(
    () =>
      previousShape
        ? buildProfileAwareFieldAtlasViewModelRuntimeReport(previousShape)
        : null,
    [previousShape],
  );
  const currentSemanticHandoffSummary = useMemo(
    () =>
      buildProfileAwareSemanticHandoffSummary(
        profileAwareRuntimeReport,
        profileAwareEvidenceStabilityReport,
      ),
    [profileAwareEvidenceStabilityReport, profileAwareRuntimeReport],
  );
  const previousSemanticHandoffSummary = useMemo(
    () =>
      previousProfileAwareRuntimeReport
        ? buildProfileAwareSemanticHandoffSummary(
            previousProfileAwareRuntimeReport,
            profileAwareEvidenceStabilityReport,
          )
        : null,
    [previousProfileAwareRuntimeReport, profileAwareEvidenceStabilityReport],
  );
  const semanticHandoffTransition = useMemo(
    () =>
      buildProfileAwareSemanticHandoffTransition({
        previousSummary: previousSemanticHandoffSummary,
        currentSummary: currentSemanticHandoffSummary,
        previousShapeId,
        currentShapeId,
        previousLabel: previousHistoryEntry?.label,
        currentLabel: currentHistoryEntry?.label,
      }),
    [
      currentHistoryEntry,
      currentSemanticHandoffSummary,
      currentShapeId,
      previousHistoryEntry,
      previousSemanticHandoffSummary,
      previousShapeId,
    ],
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

  return (
    <div className="grid gap-3 text-sm">
      <GeneratedSiteReadingV0Panel shape={shape} />

      <details className="rounded border border-cyan-400/20 bg-cyan-950/10 px-3 py-2 text-xs">
        <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
          Internal FieldCueV0 diagnostics
        </summary>
        <p className="mt-2 leading-5 text-stone-400">
          source signature, candidate links, probe highlighting
        </p>
        <div className="mt-3">
          <FieldCueV0Panel
            shape={shape}
            hoveredProbeRef={hoveredFieldAtlasSampleId}
            pinnedProbeRef={pinnedFieldAtlasProbeRef}
            onHoverStart={setHoveredFieldAtlasSampleId}
            onHoverEnd={clearHoveredFieldAtlasSampleId}
            onTogglePinnedProbe={togglePinnedFieldAtlasProbeRef}
          />
        </div>
      </details>

      <details className="rounded border border-stone-800 bg-stone-950 px-3 py-2 text-xs">
        <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          Technical field diagnostics: internal candidate machinery
        </summary>
        <p className="mt-2 leading-5 text-stone-500">
          Internal field diagnostics: policy-relative candidate machinery, not
          the generated-site reading surface.
        </p>
        <div className="mt-3">
          <ProfileAwareFieldModeRuntimeSection
            report={profileAwareRuntimeReport}
            evidenceStabilityReport={profileAwareEvidenceStabilityReport}
            semanticHandoffSummary={currentSemanticHandoffSummary}
            semanticHandoffTransition={semanticHandoffTransition}
            hoveredFieldAtlasSampleId={hoveredFieldAtlasSampleId}
            pinnedFieldAtlasProbeRef={pinnedFieldAtlasProbeRef}
            onHoverSampleStart={setHoveredFieldAtlasSampleId}
            onHoverSampleEnd={clearHoveredFieldAtlasSampleId}
            onTogglePinnedProbe={togglePinnedFieldAtlasProbeRef}
            onClearPinnedProbe={clearPinnedFieldAtlasProbeRef}
            shortenId={shortenId}
          />
        </div>
      </details>

      <LegacyFieldAtlasDiagnosticsSection
        atlas={atlas}
        fieldReport={fieldReport}
        hoveredFieldAtlasSampleId={hoveredFieldAtlasSampleId}
        onHoverSampleStart={setHoveredFieldAtlasSampleId}
        onHoverSampleEnd={clearHoveredFieldAtlasSampleId}
        onClearHoveredSample={() => setHoveredFieldAtlasSampleId(null)}
        shape={shape}
        formatVertexRef={formatVertexRef}
        shortenId={shortenId}
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

function LegacyFieldAtlasDiagnosticsSection({
  atlas,
  fieldReport,
  hoveredFieldAtlasSampleId,
  onHoverSampleStart,
  onHoverSampleEnd,
  onClearHoveredSample,
  shape,
  formatVertexRef,
  shortenId,
}: {
  atlas: FieldAtlasInspectorModel;
  fieldReport: FieldFeatureReport;
  hoveredFieldAtlasSampleId: string | null;
  onHoverSampleStart: (sampleId: string) => void;
  onHoverSampleEnd: (sampleId: string) => void;
  onClearHoveredSample: () => void;
  shape: Shape;
  formatVertexRef: (vertexId: VertexId) => string;
  shortenId: (id: string) => string;
}) {
  return (
    <details className="rounded border border-stone-800 bg-stone-950 px-3 py-2 text-xs">
      <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
        Legacy / Raw Field Diagnostics
      </summary>
      <p className="mt-2 leading-5 text-stone-500">
        Older closed-surface field diagnostics retained for comparison and
        internal development; profile-aware Field Mode above is the primary
        product surface.
      </p>

      <div className="mt-3 grid gap-3">
        {atlas.status === 'unsupported' ? (
          <div className="rounded border border-amber-400/30 bg-amber-400/10 px-3 py-2">
            <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-amber-200">
              Unsupported
            </span>
            <p className="mt-2 text-xs leading-5 text-stone-300">
              {atlas.reason}
            </p>
          </div>
        ) : (
          <>
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
              <FieldAtlasMetric label="Sources" value={atlas.sources.length} />
              <FieldAtlasMetric
                label="Generated"
                value={countGeneratedSources(atlas.sourceKindCounts)}
              />
              <FieldAtlasMetric
                label="Surface faces"
                value={atlas.domain.faceIds.length}
              />
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
          </>
        )}

        <FieldReportSection
          report={fieldReport}
          hoveredFieldAtlasSampleId={hoveredFieldAtlasSampleId}
          onHoverSampleStart={onHoverSampleStart}
          onHoverSampleEnd={onHoverSampleEnd}
        />

        {atlas.status === 'supported' ? (
          <div className="grid gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              Sample Probes
            </h3>
            {atlas.representativeSamples.map((sample) => (
              <SampleSummary
                key={sample.id}
                shape={shape}
                sample={sample}
                chart={
                  sample.chartId ? atlas.chartById.get(sample.chartId) : undefined
                }
                formatVertexRef={formatVertexRef}
                shortenId={shortenId}
                isHovered={hoveredFieldAtlasSampleId === sample.id}
                onHoverStart={onHoverSampleStart}
                onHoverEnd={onClearHoveredSample}
              />
            ))}
          </div>
        ) : null}
      </div>
    </details>
  );
}

function ProfileAwareFieldModeRuntimeSection({
  report,
  evidenceStabilityReport,
  semanticHandoffSummary,
  semanticHandoffTransition,
  hoveredFieldAtlasSampleId,
  pinnedFieldAtlasProbeRef,
  onHoverSampleStart,
  onHoverSampleEnd,
  onTogglePinnedProbe,
  onClearPinnedProbe,
  shortenId,
}: {
  report: ProfileAwareFieldAtlasViewModelRuntimeReport;
  evidenceStabilityReport: ProfileAwareEvidenceStabilityReport;
  semanticHandoffSummary: ProfileAwareSemanticHandoffSummary;
  semanticHandoffTransition: ProfileAwareSemanticHandoffTransition;
  hoveredFieldAtlasSampleId: string | null;
  pinnedFieldAtlasProbeRef: string | null;
  onHoverSampleStart: (sampleId: string) => void;
  onHoverSampleEnd: (sampleId: string) => void;
  onTogglePinnedProbe: (probeRef: string) => void;
  onClearPinnedProbe: () => void;
  shortenId: (id: string) => string;
}) {
  const semanticHandoffPressureRecords =
    buildProfileAwareSemanticHandoffPressureRecords(report);
  const semanticHandoffEnvelopePreview =
    buildProfileAwareSemanticHandoffEnvelopePreview({
      semanticHandoffSummary,
      semanticHandoffTransition,
      pressureRecords: semanticHandoffPressureRecords,
    });
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
        <ProfileAwareRuntimeAvailabilityNotice report={report} />
        <ProfileAwareEvidenceStabilitySection
          report={evidenceStabilityReport}
          shortenId={shortenId}
        />
        <ProfileAwareSemanticHandoffReadinessSection
          summary={semanticHandoffSummary}
        />
        <ProfileAwareSemanticHandoffTransitionSection
          transition={semanticHandoffTransition}
        />
        <ProfileAwareSemanticHandoffPressurePreviewSection
          records={semanticHandoffPressureRecords}
          hoveredProbeRef={hoveredFieldAtlasSampleId}
          pinnedProbeRef={pinnedFieldAtlasProbeRef}
          onHoverStart={onHoverSampleStart}
          onHoverEnd={onHoverSampleEnd}
          onTogglePinnedProbe={onTogglePinnedProbe}
        />
        <ProfileAwareSemanticHandoffEnvelopePreviewSection
          preview={semanticHandoffEnvelopePreview}
          hoveredProbeRef={hoveredFieldAtlasSampleId}
          pinnedProbeRef={pinnedFieldAtlasProbeRef}
          onHoverStart={onHoverSampleStart}
          onHoverEnd={onHoverSampleEnd}
          onTogglePinnedProbe={onTogglePinnedProbe}
          shortenId={shortenId}
        />
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
  const activeChartIds = getChartIdsFromProfileAwareProbe(activeProbe);
  const activeChartContext = buildProfileAwareActiveChartContext(
    viewModel,
    activeChartIds,
  );
  const activeSourceId = getSourceIdFromProfileAwareProbe(activeProbe, viewModel);
  const activeSourceContext = buildProfileAwareActiveSourceContext(
    viewModel,
    activeSourceId,
  );

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

      <ProfileAwareRuntimeAvailabilityNotice report={report} />

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

      <ProfileAwareActiveChartContextSection
        context={activeChartContext}
        shortenId={shortenId}
      />

      <ProfileAwareActiveSourceContextSection
        context={activeSourceContext}
        shortenId={shortenId}
      />

      <ProfileAwareEvidenceStabilitySection
        report={evidenceStabilityReport}
        shortenId={shortenId}
      />

      <ProfileAwareSemanticHandoffReadinessSection
        summary={semanticHandoffSummary}
      />

      <ProfileAwareSemanticHandoffTransitionSection
        transition={semanticHandoffTransition}
      />

      <ProfileAwareSemanticHandoffPressurePreviewSection
        records={semanticHandoffPressureRecords}
        hoveredProbeRef={hoveredFieldAtlasSampleId}
        pinnedProbeRef={pinnedFieldAtlasProbeRef}
        onHoverStart={onHoverSampleStart}
        onHoverEnd={onHoverSampleEnd}
        onTogglePinnedProbe={onTogglePinnedProbe}
      />

      <ProfileAwareSemanticHandoffEnvelopePreviewSection
        preview={semanticHandoffEnvelopePreview}
        hoveredProbeRef={hoveredFieldAtlasSampleId}
        pinnedProbeRef={pinnedFieldAtlasProbeRef}
        onHoverStart={onHoverSampleStart}
        onHoverEnd={onHoverSampleEnd}
        onTogglePinnedProbe={onTogglePinnedProbe}
        shortenId={shortenId}
      />

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

type ProfileAwareActiveChartContext = {
  activeChartIds: string[];
  primaryChartProbe?: ProfileAwareFieldAtlasChartProbe;
  chartCount: number;
  sampleMarkerCount: number;
  featureMarkerCount: number;
  routeGateCandidateCount: number;
  supportRegionCandidateCount: number;
  relatedSampleIds: string[];
  relatedFeatureIds: string[];
  intensityRange?: { min: number; max: number };
  phaseRange?: { min: number; max: number };
  allContributionRatiosValid: boolean;
};

function ProfileAwareActiveChartContextSection({
  context,
  shortenId,
}: {
  context: ProfileAwareActiveChartContext | null;
  shortenId: (id: string) => string;
}) {
  return (
    <div className="mt-3 rounded border border-stone-800 bg-stone-950 px-2 py-2">
      <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
        Active Chart Context
      </h4>
      {context ? (
        <div className="mt-2 grid gap-2">
          <dl className="grid grid-cols-2 gap-2">
            {context.primaryChartProbe ? (
              <>
                <FieldAtlasMetric
                  label="Chart"
                  value={shortenId(context.primaryChartProbe.chartId)}
                />
                <FieldAtlasMetric
                  label="Source face"
                  value={shortenId(context.primaryChartProbe.sourceFaceId)}
                />
                <FieldAtlasMetric
                  label="Role"
                  value={formatChartRole(context.primaryChartProbe.chartSemanticRole)}
                />
              </>
            ) : (
              <FieldAtlasMetric label="Charts" value={context.chartCount} />
            )}
            <FieldAtlasMetric label="Samples" value={context.sampleMarkerCount} />
            <FieldAtlasMetric
              label="Features"
              value={context.featureMarkerCount}
            />
            <FieldAtlasMetric
              label="Route/gate"
              value={context.routeGateCandidateCount}
            />
            <FieldAtlasMetric
              label="Support/region"
              value={context.supportRegionCandidateCount}
            />
            <FieldAtlasMetric
              label="Intensity"
              value={
                context.intensityRange
                  ? `${formatNumber(context.intensityRange.min)} - ${formatNumber(
                      context.intensityRange.max,
                    )}`
                  : 'n/a'
              }
            />
            <FieldAtlasMetric
              label="Phase"
              value={
                context.phaseRange
                  ? `${formatNumber(context.phaseRange.min)} - ${formatNumber(
                      context.phaseRange.max,
                    )}`
                  : 'n/a'
              }
            />
            <FieldAtlasMetric
              label="Ratios"
              value={context.allContributionRatiosValid ? 'valid' : 'invalid'}
            />
          </dl>
          {!context.primaryChartProbe ? (
            <div className="font-mono text-[11px] text-stone-500">
              charts{' '}
              {context.activeChartIds
                .slice(0, 4)
                .map((chartId) => shortenId(chartId))
                .join(', ')}
            </div>
          ) : null}
          {context.relatedSampleIds.length || context.relatedFeatureIds.length ? (
            <div className="grid gap-1 font-mono text-[11px] text-stone-500">
              {context.relatedSampleIds.length ? (
                <div>
                  samples{' '}
                  {context.relatedSampleIds.map((sampleId) => shortenId(sampleId)).join(', ')}
                </div>
              ) : null}
              {context.relatedFeatureIds.length ? (
                <div>
                  features{' '}
                  {context.relatedFeatureIds.map((featureId) => shortenId(featureId)).join(', ')}
                </div>
              ) : null}
            </div>
          ) : null}
          <p className="leading-5 text-stone-500">
            Chart context is derived from chart membership carried by the active
            probe; not topology or semantic naming.
          </p>
        </div>
      ) : (
        <p className="mt-2 leading-5 text-stone-500">
          Hover or pin a chart, sample, feature, route/gate candidate, or
          support/region candidate to inspect chart context.
        </p>
      )}
    </div>
  );
}

type ProfileAwareActiveSourceContext = {
  sourceId: string;
  sourceKind?: string;
  vertexId?: string;
  profileId?: string;
  generatedChild: boolean;
  sampleMarkerCount: number;
  featureMarkerCount: number;
  topSamples: Array<{
    sampleId: string;
    chartId: string;
    contributionRatio: number;
    intensity: number;
  }>;
};

function ProfileAwareActiveSourceContextSection({
  context,
  shortenId,
}: {
  context: ProfileAwareActiveSourceContext | null;
  shortenId: (id: string) => string;
}) {
  return (
    <div className="mt-3 rounded border border-stone-800 bg-stone-950 px-2 py-2">
      <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
        Active Source Context
      </h4>
      {context ? (
        <div className="mt-2 grid gap-2">
          <dl className="grid grid-cols-2 gap-2">
            <FieldAtlasMetric
              label="Source"
              value={shortenId(context.sourceId)}
            />
            <FieldAtlasMetric
              label="Source kind"
              value={context.sourceKind ?? 'n/a'}
            />
            <FieldAtlasMetric
              label="Vertex"
              value={context.vertexId ? shortenId(context.vertexId) : 'n/a'}
            />
            <FieldAtlasMetric
              label="Profile"
              value={context.profileId ? shortenId(context.profileId) : 'n/a'}
            />
            <FieldAtlasMetric
              label="Generated child"
              value={context.generatedChild ? 'yes' : 'no'}
            />
            <FieldAtlasMetric label="Samples" value={context.sampleMarkerCount} />
            <FieldAtlasMetric
              label="Features"
              value={context.featureMarkerCount}
            />
          </dl>
          {context.topSamples.length ? (
            <div className="grid gap-1">
              {context.topSamples.map((sample) => (
                <div
                  key={sample.sampleId}
                  className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-2 font-mono text-[11px] text-stone-500"
                >
                  <span className="truncate">{shortenId(sample.sampleId)}</span>
                  <span className="truncate">{shortenId(sample.chartId)}</span>
                  <span className="text-right">
                    {formatPercent(sample.contributionRatio)} /{' '}
                    {formatNumber(sample.intensity)}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
          <p className="leading-5 text-stone-500">
            Source context is derived from contribution-mixture membership; not
            semantic naming or causal attribution.
          </p>
        </div>
      ) : (
        <p className="mt-2 leading-5 text-stone-500">
          Hover or pin a source marker, or a sample/feature with a dominant
          source, to inspect contribution context.
        </p>
      )}
    </div>
  );
}

type ProfileAwareEvidenceStabilityMaxBucketFlags =
  ProfileAwareEvidenceStabilityReport['sensitivitySummary']['maxBucketSaturation'];

const evidenceStabilityBucketLabels: Array<
  [keyof ProfileAwareEvidenceStabilityMaxBucketFlags, string]
> = [
  ['routeGateGatesReachedMax', 'route/gate gates'],
  ['routeGateRoutesReachedMax', 'route/gate routes'],
  ['routeGateBlockedReachedMax', 'route/gate blocked'],
  ['supportRegionSupportClassesReachedMax', 'support classes'],
  ['supportRegionRegionsReachedMax', 'support regions'],
  ['supportRegionConstraintsReachedMax', 'constraints'],
  ['supportRegionRouteFailuresReachedMax', 'route failures'],
];

function ProfileAwareEvidenceStabilitySection({
  report,
  shortenId,
}: {
  report: ProfileAwareEvidenceStabilityReport;
  shortenId: (id: string) => string;
}) {
  const summary = report.sensitivitySummary;
  const saturatedBuckets = getSaturatedEvidenceStabilityBucketLabels(
    summary.maxBucketSaturation,
  );
  const visibleChangedKeys = summary.changedCountKeys.slice(0, 6);
  const visibleRangeKeys = evidenceStabilityRangeKeys.filter((key) =>
    Object.prototype.hasOwnProperty.call(summary.countRanges, key),
  );

  return (
    <div className="mt-3 rounded border border-stone-800 bg-stone-950 px-2 py-2">
      <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
        Evidence Stability
      </h4>
      <dl className="mt-2 grid grid-cols-2 gap-2">
        <FieldAtlasMetric
          label="Status"
          value={`${report.ok ? 'ok' : 'issues'} / ${report.issueCount}`}
        />
        <FieldAtlasMetric label="Variants" value={report.variantCount} />
        <FieldAtlasMetric
          label="Sampling variants"
          value={report.samplingVariantCount}
        />
        <FieldAtlasMetric
          label="Profile variants"
          value={report.profileSetupVariantCount}
        />
        <FieldAtlasMetric
          label="Sampling sensitive"
          value={formatYesNo(summary.samplingSensitive)}
        />
        <FieldAtlasMetric
          label="Profile sensitive"
          value={formatYesNo(summary.profileSetupSensitive)}
        />
        <FieldAtlasMetric
          label="Changed keys"
          value={summary.changedCountKeys.length}
        />
        <FieldAtlasMetric
          label="Feature keys"
          value={summary.featureChangedCountKeys.length}
        />
        <FieldAtlasMetric
          label="Route/gate keys"
          value={summary.routeGateChangedCountKeys.length}
        />
        <FieldAtlasMetric
          label="Support keys"
          value={summary.supportRegionChangedCountKeys.length}
        />
        <FieldAtlasMetric
          label="Max bucket saturated"
          value={formatYesNo(summary.maxBucketSaturation.anyMaxBucketSaturated)}
        />
      </dl>

      {visibleChangedKeys.length ? (
        <div className="mt-2 flex flex-wrap gap-1 font-mono text-[11px] text-stone-500">
          {visibleChangedKeys.map((key) => (
            <span
              key={key}
              className="rounded border border-stone-800 bg-stone-900 px-1.5 py-0.5"
            >
              {key}
            </span>
          ))}
        </div>
      ) : null}

      {saturatedBuckets.length ? (
        <div className="mt-2 font-mono text-[11px] text-stone-500">
          buckets {saturatedBuckets.join(', ')}
        </div>
      ) : null}

      <details className="mt-2 rounded border border-stone-800 bg-stone-900 px-2 py-2">
        <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">
          Count Ranges
        </summary>
        <div className="mt-2 grid gap-1 font-mono text-[11px] text-stone-500">
          {visibleRangeKeys.map((key) => {
            const range = summary.countRanges[key];

            return (
              <div
                key={key}
                className="grid grid-cols-[minmax(0,1fr)_auto] gap-2"
              >
                <span className="truncate">{key}</span>
                <span>
                  {formatNumber(range.min)}-{formatNumber(range.max)}
                </span>
              </div>
            );
          })}
        </div>
      </details>

      {report.variants.length ? (
        <div className="mt-2 grid gap-1">
          {report.variants.slice(0, 4).map((variant) => (
            <div
              key={variant.variantId}
              className="rounded border border-stone-800 bg-stone-900 px-2 py-1.5 font-mono text-[11px] text-stone-500"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-stone-400">
                <span>{shortenId(variant.variantId)}</span>
                <span>{variant.ok ? 'ok' : `${variant.issueCount} issues`}</span>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1">
                <span>subdivisions {variant.samplingSubdivisions}</span>
                <span className="truncate">
                  {formatProfileAwareStabilityLabel(variant.profileSetupLabel)}
                </span>
                <span>samples {variant.sampleCount}</span>
                <span>obs {variant.totalObservationCount}</span>
                <span>route/gate {variant.totalRouteGateCandidateCount}</span>
                <span>support {variant.totalSupportRegionCandidateCount}</span>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <p className="mt-2 leading-5 text-stone-500">
        Stability is diagnostic sensitivity across bounded sampling/profile
        variants; it is not a confirmation claim and does not compare against
        old/default policy invariance.
      </p>
    </div>
  );
}

function getSaturatedEvidenceStabilityBucketLabels(
  flags: ProfileAwareEvidenceStabilityMaxBucketFlags,
): string[] {
  return evidenceStabilityBucketLabels
    .filter(([key]) => flags[key])
    .map(([, label]) => label);
}

function ProfileAwareRuntimeAvailabilityNotice({
  report,
}: {
  report: ProfileAwareFieldAtlasViewModelRuntimeReport;
}) {
  const supported = report.runtimeBoundaryStatus === 'supported';

  return (
    <div
      className={`mt-3 rounded border px-2 py-2 ${
        supported
          ? 'border-emerald-300/30 bg-emerald-300/10 text-emerald-100'
          : 'border-amber-300/30 bg-amber-300/10 text-amber-100'
      }`}
    >
      <p className="leading-5">
        {supported
          ? 'Field Mode is available for this shape. Runtime policy details are internal diagnostics.'
          : 'Field Mode is unavailable for this shape. Internal diagnostics can explain the support boundary.'}
      </p>
      {report.runtimeBoundaryStatus === 'unsupported' ? (
        <p className="mt-1 leading-5 text-stone-300">
          {report.unsupportedReason}
        </p>
      ) : null}
    </div>
  );
}

function ProfileAwareRuntimeSupportInternalDiagnosticsSection({
  runtimeReport,
  policyReport,
  matrixReport,
  registrySummary,
  shortenId,
}: {
  runtimeReport: ProfileAwareFieldAtlasViewModelRuntimeReport;
  policyReport: ProfileAwareRuntimeSupportPolicyReport;
  matrixReport: ProfileAwareRuntimeSupportMatrixReport;
  registrySummary: ProfileAwareRuntimeSupportPolicyRegistrySummary;
  shortenId: (id: string) => string;
}) {
  return (
    <div className="mt-3 rounded border border-stone-800 bg-stone-950 px-2 py-2">
      <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
        Profile-aware Runtime Support Policy
      </h4>
      <p className="mt-2 leading-5 text-stone-500">
        Internal runtime diagnostics only. These tables do not expand support
        and are not semantic-facing controls.
      </p>
      <dl className="mt-2 grid grid-cols-2 gap-2">
        <FieldAtlasMetric
          label="Runtime boundary"
          value={runtimeReport.runtimeBoundaryStatus}
        />
        <FieldAtlasMetric label="Policy" value={policyReport.policyId} />
        <FieldAtlasMetric label="Support" value={policyReport.supportStatus} />
        <FieldAtlasMetric
          label="Input shape"
          value={shortenId(policyReport.inputShapeId)}
        />
        <FieldAtlasMetric label="Seed" value={policyReport.seedKey ?? 'n/a'} />
        <FieldAtlasMetric label="Operation" value={policyReport.operation} />
        <FieldAtlasMetric label="Generation" value={policyReport.generationDepth} />
        <FieldAtlasMetric
          label="Created vertices"
          value={policyReport.createdVertexCount}
        />
        <FieldAtlasMetric
          label="Support expansion"
          value={policyReport.supportExpansionStatus}
        />
        <FieldAtlasMetric
          label="Fallback"
          value={policyReport.fallbackSupportStatus}
        />
      </dl>

      <div className="mt-2 grid gap-1">
        {policyReport.criteria.map((criterion) => (
          <div
            key={criterion.id}
            className="rounded border border-stone-800 bg-stone-900 px-2 py-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium text-stone-300">
                {criterion.label}
              </span>
              <span className="font-mono text-[11px] text-stone-500">
                {formatYesNo(criterion.passed)}
              </span>
            </div>
            <div className="mt-1 grid grid-cols-2 gap-2 font-mono text-[11px] text-stone-500">
              <span>actual {criterion.actual ?? 'n/a'}</span>
              <span className="text-right">expected {criterion.expected}</span>
            </div>
          </div>
        ))}
      </div>

      {policyReport.supportStatus === 'unsupported' ? (
        <div className="mt-2 rounded border border-amber-300/30 bg-amber-300/10 px-2 py-2 text-amber-100">
          <div className="font-mono text-[11px]">
            {policyReport.unsupportedIssueCode ?? 'unsupported'}
          </div>
          <p className="mt-1 leading-5 text-stone-300">
            {policyReport.unsupportedReason ??
              'Current shape is outside runtime policy.'}
          </p>
        </div>
      ) : null}

      <div className="mt-2 flex flex-wrap gap-1 font-mono text-[11px] text-stone-500">
        {policyReport.expansionCandidates.map((candidate) => (
          <span
            key={candidate.id}
            className="rounded border border-stone-800 bg-stone-900 px-1.5 py-0.5"
            title={candidate.note}
          >
            {candidate.id}: {candidate.status}
          </span>
        ))}
      </div>

      <details className="mt-2 rounded border border-stone-800 bg-stone-900 px-2 py-2">
        <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">
          Runtime Support Policy Registry
        </summary>
        <dl className="mt-2 grid grid-cols-2 gap-2">
          <FieldAtlasMetric
            label="Registry"
            value={registrySummary.registryId}
          />
          <FieldAtlasMetric
            label="Entries"
            value={registrySummary.entryCount}
          />
          <FieldAtlasMetric
            label="Current baseline"
            value={registrySummary.currentBaselineCount}
          />
          <FieldAtlasMetric
            label="Candidate-not-promoted"
            value={registrySummary.candidateNotPromotedCount}
          />
          <FieldAtlasMetric
            label="Not-yet-supported"
            value={registrySummary.notYetSupportedCount}
          />
          <FieldAtlasMetric
            label="Unsupported controls"
            value={registrySummary.unsupportedControlCount}
          />
          <FieldAtlasMetric
            label="Support expansion"
            value={registrySummary.supportExpansionStatus}
          />
          <FieldAtlasMetric
            label="Fallback"
            value={registrySummary.fallbackSupportStatus}
          />
          <FieldAtlasMetric
            label="Active policy"
            value={policyReport.activeRegistryPolicyId}
          />
          <FieldAtlasMetric
            label="Active label"
            value={policyReport.activeRegistryPolicyLabel}
          />
          <FieldAtlasMetric
            label="Active status"
            value={policyReport.activeRegistryPolicyStatus}
          />
        </dl>
        <p className="mt-2 leading-5 text-stone-500">
          Registry entries name support boundaries and candidates only. They do
          not expand runtime support or enable fallback behavior.
        </p>
      </details>

      <details className="mt-2 rounded border border-stone-800 bg-stone-900 px-2 py-2">
        <summary className="cursor-pointer text-[11px] font-semibold uppercase tracking-[0.12em] text-stone-500">
          Runtime Support Matrix (Diagnostic)
        </summary>
        <dl className="mt-2 grid grid-cols-2 gap-2">
          <FieldAtlasMetric label="Cases" value={matrixReport.caseCount} />
          <FieldAtlasMetric
            label="Runtime supported"
            value={matrixReport.supportedRuntimeCaseCount}
          />
          <FieldAtlasMetric
            label="Runtime unsupported"
            value={matrixReport.unsupportedRuntimeCaseCount}
          />
          <FieldAtlasMetric
            label="Construction failed"
            value={matrixReport.constructionFailedCaseCount}
          />
          <FieldAtlasMetric
            label="Not promoted"
            value={matrixReport.notPromotedCandidateCount}
          />
          <FieldAtlasMetric
            label="Policy/runtime mismatch"
            value={matrixReport.policyRuntimeMismatchCount}
          />
          <FieldAtlasMetric
            label="Support expansion"
            value={matrixReport.supportExpansionStatus}
          />
          <FieldAtlasMetric
            label="Fallback"
            value={matrixReport.fallbackSupportStatus}
          />
        </dl>

        <div className="mt-2 grid gap-1">
          {matrixReport.cases.map((matrixCase) => (
            <div
              key={matrixCase.caseId}
              className="rounded border border-stone-800 bg-stone-950 px-2 py-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-stone-300">
                  {matrixCase.label}
                </span>
                <span className="font-mono text-[11px] text-stone-500">
                  {matrixCase.caseClass}
                </span>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px] text-stone-500">
                <span>construction {matrixCase.constructionStatus}</span>
                <span className="text-right">
                  promotion {matrixCase.promotionStatus}
                </span>
                <span>policy {matrixCase.policySupportStatus ?? 'n/a'}</span>
                <span className="text-right">
                  runtime {matrixCase.runtimeBoundaryStatus ?? 'n/a'}
                </span>
                {typeof matrixCase.generationDepth === 'number' ? (
                  <span>generation {matrixCase.generationDepth}</span>
                ) : null}
                {matrixCase.targetCellKind || matrixCase.targetCellTopology ? (
                  <span className="text-right">
                    target {matrixCase.targetCellKind ?? 'cell'} /{' '}
                    {matrixCase.targetCellTopology ?? 'n/a'}
                  </span>
                ) : null}
                <span>
                  mismatch {formatYesNo(matrixCase.policyRuntimeAgreement === false)}
                </span>
              </div>
              {matrixCase.constructionFailureReason || matrixCase.unsupportedReason ? (
                <p className="mt-2 leading-5 text-stone-500">
                  {matrixCase.constructionFailureReason ??
                    matrixCase.unsupportedReason}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        <p className="mt-2 leading-5 text-stone-500">
          Matrix cases are diagnostic probes only. They do not expand runtime
          support, promote candidates, or enable fallback behavior.
        </p>
      </details>

      <p className="mt-2 leading-5 text-stone-500">
        Runtime support is policy-bound. This branch exposes the support
        boundary only; it does not expand support or add fallback behavior.
      </p>
    </div>
  );
}

type ProfileAwareSemanticHandoffReadiness =
  | 'not-available'
  | 'diagnostic-only'
  | 'candidate-pressure-available'
  | 'candidate-pressure-sensitive';

type ProfileAwareSemanticHandoffSummary = {
  readiness: ProfileAwareSemanticHandoffReadiness;
  fieldModeSupported: boolean;
  evidenceOk: boolean;
  samplingSensitive: boolean;
  profileSetupSensitive: boolean;
  changedCountKeyCount: number;
  featureCandidateCount: number;
  routeGateCandidateCount: number;
  supportRegionCandidateCount: number;
  stableEnoughForInspection: boolean;
  semanticStatus: string;
  topologyStatus: string;
  packetWriteStatus: string;
  caveats: string[];
  handoffHints: string[];
};

type ProfileAwareSemanticHandoffTransitionStatus =
  | 'no-previous-shape'
  | 'handoff-became-available'
  | 'handoff-became-sensitive'
  | 'handoff-remained-available'
  | 'handoff-remained-sensitive'
  | 'handoff-became-diagnostic-only'
  | 'handoff-became-unavailable'
  | 'handoff-remained-unavailable';

type ProfileAwareSemanticHandoffTransition = {
  status: ProfileAwareSemanticHandoffTransitionStatus;
  previousShapeId?: ShapeId;
  currentShapeId: ShapeId;
  previousLabel?: string;
  currentLabel?: string;
  previousReadiness?: ProfileAwareSemanticHandoffReadiness;
  currentReadiness: ProfileAwareSemanticHandoffReadiness;
  featureCandidateDelta?: number;
  routeGateCandidateDelta?: number;
  supportRegionCandidateDelta?: number;
  changedCountKeyDelta?: number;
  caveats: string[];
  handoffHints: string[];
};

type ProfileAwareSemanticHandoffPressureKind =
  | 'feature-observation'
  | 'route-gate-candidate'
  | 'support-region-candidate';

type ProfileAwareSemanticHandoffPressureRecord = {
  id: string;
  kind: ProfileAwareSemanticHandoffPressureKind;
  label: string;
  probeRef: string;
  candidateStatus: 'report-candidate' | 'candidate-only';
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  pressureBasis: string;
  sampleCount?: number;
  chartCount?: number;
  observationCount?: number;
  routeGateRefCount?: number;
  intensity?: number;
  relativeIntensity?: number;
  reliability?: string;
  reason: string;
  caveats: string[];
};

type ProfileAwareSemanticHandoffEnvelopeStatus =
  | 'not-available'
  | 'diagnostic-only'
  | 'candidate-pressure-available'
  | 'candidate-pressure-sensitive';

type ProfileAwareSemanticHandoffEnvelopePreview = {
  envelopeStatus: ProfileAwareSemanticHandoffEnvelopeStatus;
  currentReadiness: ProfileAwareSemanticHandoffReadiness;
  transitionStatus: ProfileAwareSemanticHandoffTransitionStatus;
  pressureRecordCount: number;
  featurePressureRecordCount: number;
  routeGatePressureRecordCount: number;
  supportRegionPressureRecordCount: number;
  topPressureRecords: Array<{
    id: string;
    kind: ProfileAwareSemanticHandoffPressureKind;
    label: string;
    probeRef: string;
    candidateStatus: 'report-candidate' | 'candidate-only';
    reliability?: string;
  }>;
  evidenceOk: boolean;
  samplingSensitive: boolean;
  profileSetupSensitive: boolean;
  changedCountKeyCount: number;
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  packetWriteStatus: 'not-packet-writing';
  exportStatus: 'not-exported';
  persistenceStatus: 'not-persisted';
  handoffMechanismStatus: 'preview-only';
  caveats: string[];
  handoffHints: string[];
};

function ProfileAwareSemanticHandoffReadinessSection({
  summary,
}: {
  summary: ProfileAwareSemanticHandoffSummary;
}) {
  return (
    <div className="mt-3 rounded border border-stone-800 bg-stone-950 px-2 py-2">
      <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
        Semantic Handoff Readiness
      </h4>
      <dl className="mt-2 grid grid-cols-2 gap-2">
        <FieldAtlasMetric label="Readiness" value={summary.readiness} />
        <FieldAtlasMetric
          label="Field Mode supported"
          value={formatYesNo(summary.fieldModeSupported)}
        />
        <FieldAtlasMetric label="Evidence ok" value={formatYesNo(summary.evidenceOk)} />
        <FieldAtlasMetric
          label="Sampling sensitive"
          value={formatYesNo(summary.samplingSensitive)}
        />
        <FieldAtlasMetric
          label="Profile sensitive"
          value={formatYesNo(summary.profileSetupSensitive)}
        />
        <FieldAtlasMetric
          label="Changed keys"
          value={summary.changedCountKeyCount}
        />
        <FieldAtlasMetric
          label="Feature candidates"
          value={summary.featureCandidateCount}
        />
        <FieldAtlasMetric
          label="Route/gate candidates"
          value={summary.routeGateCandidateCount}
        />
        <FieldAtlasMetric
          label="Support/region candidates"
          value={summary.supportRegionCandidateCount}
        />
        <FieldAtlasMetric
          label="Stable enough for inspection"
          value={formatYesNo(summary.stableEnoughForInspection)}
        />
      </dl>

      {summary.handoffHints.length ? (
        <div className="mt-2 grid gap-1 text-stone-500">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em]">
            Handoff hints
          </div>
          {summary.handoffHints.slice(0, 4).map((hint) => (
            <p key={hint} className="leading-5">
              {hint}
            </p>
          ))}
        </div>
      ) : null}

      {summary.caveats.length ? (
        <div className="mt-2 flex flex-wrap gap-1 font-mono text-[11px] text-stone-500">
          {summary.caveats.slice(0, 6).map((caveat) => (
            <span
              key={caveat}
              className="rounded border border-stone-800 bg-stone-900 px-1.5 py-0.5"
            >
              {caveat}
            </span>
          ))}
        </div>
      ) : null}

      <p className="mt-2 leading-5 text-stone-500">
        Field handoff is a pressure/candidate summary for later semantic work;
        it is not semantic naming, topology, or packet writing.
      </p>
    </div>
  );
}

function ProfileAwareSemanticHandoffTransitionSection({
  transition,
}: {
  transition: ProfileAwareSemanticHandoffTransition;
}) {
  return (
    <div className="mt-3 rounded border border-stone-800 bg-stone-950 px-2 py-2">
      <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
        Semantic Handoff Transition
      </h4>
      <dl className="mt-2 grid grid-cols-2 gap-2">
        <FieldAtlasMetric label="Transition" value={transition.status} />
        <FieldAtlasMetric
          label="Previous readiness"
          value={transition.previousReadiness ?? 'n/a'}
        />
        <FieldAtlasMetric
          label="Current readiness"
          value={transition.currentReadiness}
        />
        <FieldAtlasMetric
          label="Previous"
          value={transition.previousLabel ?? transition.previousShapeId ?? 'n/a'}
        />
        <FieldAtlasMetric
          label="Current"
          value={transition.currentLabel ?? transition.currentShapeId}
        />
        <FieldAtlasMetric
          label="Feature candidate delta"
          value={formatSignedDelta(transition.featureCandidateDelta)}
        />
        <FieldAtlasMetric
          label="Route/gate candidate delta"
          value={formatSignedDelta(transition.routeGateCandidateDelta)}
        />
        <FieldAtlasMetric
          label="Support/region candidate delta"
          value={formatSignedDelta(transition.supportRegionCandidateDelta)}
        />
        <FieldAtlasMetric
          label="Changed evidence key delta"
          value={formatSignedDelta(transition.changedCountKeyDelta)}
        />
      </dl>

      {transition.handoffHints.length ? (
        <div className="mt-2 grid gap-1 text-stone-500">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em]">
            Transition hints
          </div>
          {transition.handoffHints.slice(0, 4).map((hint) => (
            <p key={hint} className="leading-5">
              {hint}
            </p>
          ))}
        </div>
      ) : null}

      {transition.caveats.length ? (
        <div className="mt-2 flex flex-wrap gap-1 font-mono text-[11px] text-stone-500">
          {transition.caveats.slice(0, 6).map((caveat) => (
            <span
              key={caveat}
              className="rounded border border-stone-800 bg-stone-900 px-1.5 py-0.5"
            >
              {caveat}
            </span>
          ))}
        </div>
      ) : null}

      <p className="mt-2 leading-5 text-stone-500">
        Handoff transition compares readiness summaries only; it does not claim
        candidate identity, semantic continuity, topology continuity, route
        persistence, or support/region persistence.
      </p>
    </div>
  );
}

function ProfileAwareSemanticHandoffPressurePreviewSection({
  records,
  hoveredProbeRef,
  pinnedProbeRef,
  onHoverStart,
  onHoverEnd,
  onTogglePinnedProbe,
}: {
  records: ProfileAwareSemanticHandoffPressureRecord[];
  hoveredProbeRef: string | null;
  pinnedProbeRef: string | null;
  onHoverStart: (hoverRef: string) => void;
  onHoverEnd: (hoverRef: string) => void;
  onTogglePinnedProbe: (probeRef: string) => void;
}) {
  const featureRecordCount = records.filter(
    (record) => record.kind === 'feature-observation',
  ).length;
  const routeGateRecordCount = records.filter(
    (record) => record.kind === 'route-gate-candidate',
  ).length;
  const supportRegionRecordCount = records.filter(
    (record) => record.kind === 'support-region-candidate',
  ).length;

  return (
    <div className="mt-3 rounded border border-stone-800 bg-stone-950 px-2 py-2">
      <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
        Semantic Handoff Pressure Preview
      </h4>
      <dl className="mt-2 grid grid-cols-2 gap-2">
        <FieldAtlasMetric label="Total records" value={records.length} />
        <FieldAtlasMetric label="Feature records" value={featureRecordCount} />
        <FieldAtlasMetric
          label="Route/gate records"
          value={routeGateRecordCount}
        />
        <FieldAtlasMetric
          label="Support/region records"
          value={supportRegionRecordCount}
        />
      </dl>

      {records.length ? (
        <div className="mt-2 grid gap-1">
          {records.slice(0, 8).map((record) => (
            <ProfileAwareSemanticHandoffPressureRecordRow
              key={`${record.kind}:${record.id}`}
              record={record}
              isHovered={hoveredProbeRef === record.probeRef}
              isPinned={pinnedProbeRef === record.probeRef}
              onHoverStart={onHoverStart}
              onHoverEnd={onHoverEnd}
              onTogglePinnedProbe={onTogglePinnedProbe}
            />
          ))}
        </div>
      ) : (
        <p className="mt-2 rounded border border-stone-800 bg-stone-900 px-2 py-2 text-stone-500">
          No semantic handoff pressure records are available for this Field Mode
          runtime.
        </p>
      )}

      <p className="mt-2 leading-5 text-stone-500">
        Pressure records are read-only handoff candidates for later semantic
        work; they are not semantic names, topology claims, or packet writes.
      </p>
    </div>
  );
}

function ProfileAwareSemanticHandoffPressureRecordRow({
  record,
  isHovered,
  isPinned,
  onHoverStart,
  onHoverEnd,
  onTogglePinnedProbe,
}: {
  record: ProfileAwareSemanticHandoffPressureRecord;
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
      data-profile-aware-pressure-record-id={record.id}
      onClick={() => onTogglePinnedProbe(record.probeRef)}
      onFocus={() => onHoverStart(record.probeRef)}
      onBlur={() => onHoverEnd(record.probeRef)}
      onPointerEnter={() => onHoverStart(record.probeRef)}
      onPointerLeave={() => onHoverEnd(record.probeRef)}
      type="button"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium text-stone-200">{record.label}</span>
        <span className="font-mono text-[11px] text-stone-500">
          {record.kind}
        </span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-stone-500">
        <span className="font-mono">{record.candidateStatus}</span>
        <span className="text-right font-mono">
          {record.reliability ?? record.pressureBasis}
        </span>
        {typeof record.sampleCount === 'number' ? (
          <span className="font-mono">samples {record.sampleCount}</span>
        ) : null}
        {typeof record.chartCount === 'number' ? (
          <span className="text-right font-mono">charts {record.chartCount}</span>
        ) : null}
        {typeof record.observationCount === 'number' ? (
          <span className="font-mono">obs {record.observationCount}</span>
        ) : null}
        {typeof record.routeGateRefCount === 'number' ? (
          <span className="text-right font-mono">
            route/gate refs {record.routeGateRefCount}
          </span>
        ) : null}
        {typeof record.intensity === 'number' ? (
          <span className="font-mono">int {formatNumber(record.intensity)}</span>
        ) : null}
        {typeof record.relativeIntensity === 'number' ? (
          <span className="text-right font-mono">
            rel {formatNumber(record.relativeIntensity)}
          </span>
        ) : null}
      </div>
      <p className="mt-2 leading-5 text-stone-400">
        {record.pressureBasis}; {shortenReportReason(record.reason)}
      </p>
      <div className="mt-2 flex flex-wrap gap-1 font-mono text-[11px] text-stone-500">
        {record.caveats.slice(0, 3).map((caveat) => (
          <span
            key={caveat}
            className="rounded border border-stone-800 bg-stone-950 px-1.5 py-0.5"
          >
            {caveat}
          </span>
        ))}
      </div>
    </button>
  );
}

function ProfileAwareSemanticHandoffEnvelopePreviewSection({
  preview,
  hoveredProbeRef,
  pinnedProbeRef,
  onHoverStart,
  onHoverEnd,
  onTogglePinnedProbe,
  shortenId,
}: {
  preview: ProfileAwareSemanticHandoffEnvelopePreview;
  hoveredProbeRef: string | null;
  pinnedProbeRef: string | null;
  onHoverStart: (hoverRef: string) => void;
  onHoverEnd: (hoverRef: string) => void;
  onTogglePinnedProbe: (probeRef: string) => void;
  shortenId: (id: string) => string;
}) {
  return (
    <div className="mt-3 rounded border border-stone-800 bg-stone-950 px-2 py-2">
      <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
        Semantic Handoff Envelope Preview
      </h4>
      <dl className="mt-2 grid grid-cols-2 gap-2">
        <FieldAtlasMetric label="Envelope" value={preview.envelopeStatus} />
        <FieldAtlasMetric label="Readiness" value={preview.currentReadiness} />
        <FieldAtlasMetric label="Transition" value={preview.transitionStatus} />
        <FieldAtlasMetric
          label="Pressure records"
          value={preview.pressureRecordCount}
        />
        <FieldAtlasMetric
          label="Feature records"
          value={preview.featurePressureRecordCount}
        />
        <FieldAtlasMetric
          label="Route/gate records"
          value={preview.routeGatePressureRecordCount}
        />
        <FieldAtlasMetric
          label="Support/region records"
          value={preview.supportRegionPressureRecordCount}
        />
        <FieldAtlasMetric
          label="Evidence ok"
          value={formatYesNo(preview.evidenceOk)}
        />
        <FieldAtlasMetric
          label="Sampling sensitive"
          value={formatYesNo(preview.samplingSensitive)}
        />
        <FieldAtlasMetric
          label="Profile sensitive"
          value={formatYesNo(preview.profileSetupSensitive)}
        />
        <FieldAtlasMetric
          label="Changed keys"
          value={preview.changedCountKeyCount}
        />
        <FieldAtlasMetric
          label="Handoff mechanism"
          value={preview.handoffMechanismStatus}
        />
        <FieldAtlasMetric label="Export" value={preview.exportStatus} />
        <FieldAtlasMetric
          label="Persistence"
          value={preview.persistenceStatus}
        />
        <FieldAtlasMetric
          label="Packet write"
          value={preview.packetWriteStatus}
        />
      </dl>

      {preview.topPressureRecords.length ? (
        <div className="mt-2 grid gap-1">
          {preview.topPressureRecords.map((record) => (
            <button
              key={`${record.kind}:${record.id}`}
              className={`rounded border px-2 py-2 text-left transition ${
                pinnedProbeRef === record.probeRef
                  ? 'border-cyan-300/70 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(103,232,249,0.18)]'
                  : hoveredProbeRef === record.probeRef
                    ? 'border-amber-300/70 bg-amber-400/10 shadow-[0_0_0_1px_rgba(252,211,77,0.18)]'
                    : 'border-stone-800 bg-stone-900'
              }`}
              data-profile-aware-envelope-pressure-record-id={record.id}
              onClick={() => onTogglePinnedProbe(record.probeRef)}
              onFocus={() => onHoverStart(record.probeRef)}
              onBlur={() => onHoverEnd(record.probeRef)}
              onPointerEnter={() => onHoverStart(record.probeRef)}
              onPointerLeave={() => onHoverEnd(record.probeRef)}
              type="button"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-stone-200">{record.label}</span>
                <span className="font-mono text-[11px] text-stone-500">
                  {record.kind}
                </span>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px] text-stone-500">
                <span>{record.candidateStatus}</span>
                <span className="text-right">{record.reliability ?? 'probe ref'}</span>
                <span className="col-span-2 truncate">
                  {shortenId(record.probeRef)}
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-2 rounded border border-stone-800 bg-stone-900 px-2 py-2 text-stone-500">
          No top pressure refs are available for this envelope preview.
        </p>
      )}

      {preview.handoffHints.length ? (
        <div className="mt-2 grid gap-1 text-stone-500">
          {preview.handoffHints.slice(0, 2).map((hint) => (
            <p key={hint} className="leading-5">
              {hint}
            </p>
          ))}
        </div>
      ) : null}

      <div className="mt-2 flex flex-wrap gap-1 font-mono text-[11px] text-stone-500">
        {preview.caveats.slice(0, 8).map((caveat) => (
          <span
            key={caveat}
            className="rounded border border-stone-800 bg-stone-900 px-1.5 py-0.5"
          >
            {caveat}
          </span>
        ))}
      </div>

      <p className="mt-2 leading-5 text-stone-500">
        Envelope preview is a read-only object-shape for later semantic work; it
        is not exported, persisted, packet-written, semantically named, or
        topologically validated.
      </p>
    </div>
  );
}

function buildProfileAwareSemanticHandoffSummary(
  runtimeReport: ProfileAwareFieldAtlasViewModelRuntimeReport,
  evidenceStabilityReport: ProfileAwareEvidenceStabilityReport,
): ProfileAwareSemanticHandoffSummary {
  const samplingSensitive =
    evidenceStabilityReport.sensitivitySummary.samplingSensitive;
  const profileSetupSensitive =
    evidenceStabilityReport.sensitivitySummary.profileSetupSensitive;
  const sensitivityActive = samplingSensitive || profileSetupSensitive;
  const baseCaveats = [
    'not semantic naming',
    'not topology workspace',
    'not packet writing',
    'policy relative',
    'old policy not assumed invariant',
    'candidates are candidates only',
    'stability is sensitivity, not confirmation',
  ];

  if (runtimeReport.runtimeBoundaryStatus === 'unsupported') {
    return {
      readiness: 'not-available',
      fieldModeSupported: false,
      evidenceOk: evidenceStabilityReport.ok,
      samplingSensitive,
      profileSetupSensitive,
      changedCountKeyCount:
        evidenceStabilityReport.sensitivitySummary.changedCountKeys.length,
      featureCandidateCount: 0,
      routeGateCandidateCount: 0,
      supportRegionCandidateCount: 0,
      stableEnoughForInspection: false,
      semanticStatus: runtimeReport.semanticStatus,
      topologyStatus: runtimeReport.topologyStatus,
      packetWriteStatus: runtimeReport.packetWriteStatus,
      caveats: [
        runtimeReport.unsupportedIssueCode,
        runtimeReport.unsupportedReason,
        ...baseCaveats,
      ],
      handoffHints: [
        'Profile-aware Field Mode is not available for this shape.',
      ],
    };
  }

  const featureCandidateCount =
    runtimeReport.viewModel.featureOverlaySummary.featureMarkers.length;
  const routeGateCandidateCount =
    runtimeReport.viewModel.routeGateOverlaySummary.candidateMarkers.length;
  const supportRegionCandidateCount =
    runtimeReport.viewModel.supportRegionOverlaySummary.candidateMarkers.length;
  const candidateCount =
    featureCandidateCount + routeGateCandidateCount + supportRegionCandidateCount;
  const readiness: ProfileAwareSemanticHandoffReadiness =
    candidateCount === 0
      ? 'diagnostic-only'
      : sensitivityActive
        ? 'candidate-pressure-sensitive'
        : 'candidate-pressure-available';
  const handoffHints =
    candidateCount === 0
      ? [
          'Field can be inspected, but no candidate pressure families are currently available.',
        ]
      : sensitivityActive
        ? [
            'Candidate pressure is available, but sensitivity flags require cautious handoff.',
            'Review changed evidence counts before semantic or topological follow-up.',
          ]
        : [
            'Candidate pressure families are available for later semantic inspection.',
            'Use candidate counts as handoff pressure, not confirmation.',
          ];

  return {
    readiness,
    fieldModeSupported: true,
    evidenceOk: evidenceStabilityReport.ok,
    samplingSensitive,
    profileSetupSensitive,
    changedCountKeyCount:
      evidenceStabilityReport.sensitivitySummary.changedCountKeys.length,
    featureCandidateCount,
    routeGateCandidateCount,
    supportRegionCandidateCount,
    stableEnoughForInspection: evidenceStabilityReport.ok && !sensitivityActive,
    semanticStatus: runtimeReport.semanticStatus,
    topologyStatus: runtimeReport.topologyStatus,
    packetWriteStatus: runtimeReport.packetWriteStatus,
    caveats: baseCaveats,
    handoffHints,
  };
}

function buildProfileAwareSemanticHandoffTransition({
  previousSummary,
  currentSummary,
  previousShapeId,
  currentShapeId,
  previousLabel,
  currentLabel,
}: {
  previousSummary: ProfileAwareSemanticHandoffSummary | null;
  currentSummary: ProfileAwareSemanticHandoffSummary;
  previousShapeId?: ShapeId;
  currentShapeId: ShapeId;
  previousLabel?: string;
  currentLabel?: string;
}): ProfileAwareSemanticHandoffTransition {
  const caveats = [
    'readiness summaries only',
    'no candidate identity',
    'no semantic continuity',
    'no topology continuity',
    'no route persistence',
    'no support/region persistence',
  ];

  if (!previousSummary) {
    return {
      status: 'no-previous-shape',
      previousShapeId,
      currentShapeId,
      previousLabel,
      currentLabel,
      currentReadiness: currentSummary.readiness,
      caveats,
      handoffHints: ['No previous shape in workspace sequence.'],
    };
  }

  const featureCandidateDelta =
    currentSummary.featureCandidateCount - previousSummary.featureCandidateCount;
  const routeGateCandidateDelta =
    currentSummary.routeGateCandidateCount -
    previousSummary.routeGateCandidateCount;
  const supportRegionCandidateDelta =
    currentSummary.supportRegionCandidateCount -
    previousSummary.supportRegionCandidateCount;
  const changedCountKeyDelta =
    currentSummary.changedCountKeyCount - previousSummary.changedCountKeyCount;
  const status = getProfileAwareSemanticHandoffTransitionStatus(
    previousSummary.readiness,
    currentSummary.readiness,
  );
  const handoffHints = getProfileAwareSemanticHandoffTransitionHints(
    status,
    previousSummary.readiness,
    currentSummary.readiness,
  );

  return {
    status,
    previousShapeId,
    currentShapeId,
    previousLabel,
    currentLabel,
    previousReadiness: previousSummary.readiness,
    currentReadiness: currentSummary.readiness,
    featureCandidateDelta,
    routeGateCandidateDelta,
    supportRegionCandidateDelta,
    changedCountKeyDelta,
    caveats,
    handoffHints,
  };
}

function getProfileAwareSemanticHandoffTransitionStatus(
  previousReadiness: ProfileAwareSemanticHandoffReadiness,
  currentReadiness: ProfileAwareSemanticHandoffReadiness,
): ProfileAwareSemanticHandoffTransitionStatus {
  if (
    previousReadiness === 'not-available' &&
    currentReadiness === 'candidate-pressure-available'
  ) {
    return 'handoff-became-available';
  }

  if (
    currentReadiness === 'candidate-pressure-sensitive' &&
    previousReadiness !== 'candidate-pressure-sensitive'
  ) {
    return 'handoff-became-sensitive';
  }

  if (currentReadiness === 'not-available') {
    return previousReadiness === 'not-available'
      ? 'handoff-remained-unavailable'
      : 'handoff-became-unavailable';
  }

  if (currentReadiness === 'diagnostic-only') {
    return 'handoff-became-diagnostic-only';
  }

  if (
    previousReadiness === 'candidate-pressure-sensitive' &&
    currentReadiness === 'candidate-pressure-sensitive'
  ) {
    return 'handoff-remained-sensitive';
  }

  if (currentReadiness === 'candidate-pressure-available') {
    return isProfileAwareCandidatePressureReadiness(previousReadiness)
      ? 'handoff-remained-available'
      : 'handoff-became-available';
  }

  return 'handoff-became-diagnostic-only';
}

function isProfileAwareCandidatePressureReadiness(
  readiness: ProfileAwareSemanticHandoffReadiness,
): boolean {
  return (
    readiness === 'candidate-pressure-available' ||
    readiness === 'candidate-pressure-sensitive'
  );
}

function getProfileAwareSemanticHandoffTransitionHints(
  status: ProfileAwareSemanticHandoffTransitionStatus,
  previousReadiness: ProfileAwareSemanticHandoffReadiness,
  currentReadiness: ProfileAwareSemanticHandoffReadiness,
): string[] {
  if (
    previousReadiness === 'candidate-pressure-sensitive' &&
    currentReadiness === 'candidate-pressure-available'
  ) {
    return [
      'Candidate pressure is still available and sensitivity decreased.',
      'Treat deltas as handoff-pressure count changes only.',
    ];
  }

  switch (status) {
    case 'handoff-became-available':
      return ['Candidate pressure became available for semantic handoff inspection.'];
    case 'handoff-became-sensitive':
      return [
        'Candidate pressure is available, but the current handoff is sensitivity-marked.',
      ];
    case 'handoff-remained-available':
      return ['Candidate pressure remained available across the workspace transition.'];
    case 'handoff-remained-sensitive':
      return ['Candidate pressure remained sensitivity-marked across the transition.'];
    case 'handoff-became-diagnostic-only':
      return ['Current Field Mode remains inspectable, but candidate pressure is absent.'];
    case 'handoff-became-unavailable':
      return ['Profile-aware Field Mode became unavailable for handoff inspection.'];
    case 'handoff-remained-unavailable':
      return ['Profile-aware Field Mode remained unavailable across the transition.'];
    case 'no-previous-shape':
      return ['No previous shape in workspace sequence.'];
    default:
      return [];
  }
}

function buildProfileAwareSemanticHandoffPressureRecords(
  runtimeReport: ProfileAwareFieldAtlasViewModelRuntimeReport,
): ProfileAwareSemanticHandoffPressureRecord[] {
  if (runtimeReport.runtimeBoundaryStatus !== 'supported') {
    return [];
  }

  const records: ProfileAwareSemanticHandoffPressureRecord[] = [];
  const viewModel = runtimeReport.viewModel;

  for (const marker of viewModel.featureOverlaySummary.featureMarkers) {
    const probe = viewModel.probeIndex.probes[marker.probeRef];

    records.push({
      id: marker.featureId,
      kind: 'feature-observation',
      label: formatReportObservationKind(marker.observationKind),
      probeRef: marker.probeRef,
      candidateStatus: marker.status,
      semanticStatus: marker.semanticStatus,
      topologyStatus: 'not-topology-workspace',
      pressureBasis: 'feature observation',
      sampleCount: 1,
      chartCount: 1,
      intensity: marker.intensity,
      relativeIntensity: marker.relativeIntensity,
      reason:
        probe?.probeKind === 'feature-observation'
          ? probe.reason
          : 'profile-aware feature observation marker',
      caveats: [
        'report candidate',
        'not semantic naming',
        'not topology workspace',
        'not packet writing',
      ],
    });
  }

  for (const marker of viewModel.routeGateOverlaySummary.candidateMarkers) {
    records.push({
      id: marker.candidateId,
      kind: 'route-gate-candidate',
      label: `${formatRouteGateCandidateKind(marker.candidateKind)} / ${formatRouteGateCandidateKind(
        marker.candidateSubtype,
      )}`,
      probeRef: marker.probeRef,
      candidateStatus: marker.status,
      semanticStatus: marker.semanticStatus,
      topologyStatus: marker.topologyStatus,
      pressureBasis: 'route/gate candidate pressure',
      sampleCount: marker.sampleIds.length,
      chartCount: marker.chartIds.length,
      reliability: marker.reliability,
      reason: marker.reason,
      caveats: [
        'candidate only',
        'not route confirmation',
        'not semantic naming',
        'not topology workspace',
        'not route persistence',
        'not packet writing',
      ],
    });
  }

  for (const marker of viewModel.supportRegionOverlaySummary.candidateMarkers) {
    records.push({
      id: marker.candidateId,
      kind: 'support-region-candidate',
      label: `${formatSupportRegionCandidateKind(
        marker.candidateKind,
      )} / ${formatSupportKind(marker.supportKind)}`,
      probeRef: marker.probeRef,
      candidateStatus: marker.status,
      semanticStatus: marker.semanticStatus,
      topologyStatus: marker.topologyStatus,
      pressureBasis: 'support/region candidate pressure',
      sampleCount: marker.sampleIds.length,
      chartCount: marker.chartIds.length,
      observationCount: marker.observationIds.length,
      routeGateRefCount: marker.routeGateCandidateIds.length,
      reliability: marker.reliability,
      reason: marker.reason,
      caveats: [
        'candidate only',
        'not support/region confirmation',
        'not semantic naming',
        'not topology workspace',
        'not support/region persistence',
        'not packet writing',
      ],
    });
  }

  return records.sort((first, second) => {
    const kindDelta =
      getProfileAwareSemanticHandoffPressureKindOrder(first.kind) -
      getProfileAwareSemanticHandoffPressureKindOrder(second.kind);

    return kindDelta || first.id.localeCompare(second.id);
  });
}

function buildProfileAwareSemanticHandoffEnvelopePreview({
  semanticHandoffSummary,
  semanticHandoffTransition,
  pressureRecords,
}: {
  semanticHandoffSummary: ProfileAwareSemanticHandoffSummary;
  semanticHandoffTransition: ProfileAwareSemanticHandoffTransition;
  pressureRecords: ProfileAwareSemanticHandoffPressureRecord[];
}): ProfileAwareSemanticHandoffEnvelopePreview {
  const envelopeStatus: ProfileAwareSemanticHandoffEnvelopeStatus =
    semanticHandoffSummary.readiness;
  const featurePressureRecordCount = pressureRecords.filter(
    (record) => record.kind === 'feature-observation',
  ).length;
  const routeGatePressureRecordCount = pressureRecords.filter(
    (record) => record.kind === 'route-gate-candidate',
  ).length;
  const supportRegionPressureRecordCount = pressureRecords.filter(
    (record) => record.kind === 'support-region-candidate',
  ).length;

  return {
    envelopeStatus,
    currentReadiness: semanticHandoffSummary.readiness,
    transitionStatus: semanticHandoffTransition.status,
    pressureRecordCount: pressureRecords.length,
    featurePressureRecordCount,
    routeGatePressureRecordCount,
    supportRegionPressureRecordCount,
    topPressureRecords: pressureRecords.slice(0, 5).map((record) => ({
      id: record.id,
      kind: record.kind,
      label: record.label,
      probeRef: record.probeRef,
      candidateStatus: record.candidateStatus,
      reliability: record.reliability,
    })),
    evidenceOk: semanticHandoffSummary.evidenceOk,
    samplingSensitive: semanticHandoffSummary.samplingSensitive,
    profileSetupSensitive: semanticHandoffSummary.profileSetupSensitive,
    changedCountKeyCount: semanticHandoffSummary.changedCountKeyCount,
    semanticStatus: 'not-semantic-naming',
    topologyStatus: 'not-topology-workspace',
    packetWriteStatus: 'not-packet-writing',
    exportStatus: 'not-exported',
    persistenceStatus: 'not-persisted',
    handoffMechanismStatus: 'preview-only',
    caveats: [
      'preview only',
      'not exported',
      'not persisted',
      'not packet writing',
      'not semantic naming',
      'not topology workspace',
      'no candidate identity',
      'no route persistence',
      'no support/region persistence',
      'no semantic continuity',
      'no topology continuity',
    ],
    handoffHints:
      getProfileAwareSemanticHandoffEnvelopeHints(envelopeStatus),
  };
}

function getProfileAwareSemanticHandoffEnvelopeHints(
  envelopeStatus: ProfileAwareSemanticHandoffEnvelopeStatus,
): string[] {
  switch (envelopeStatus) {
    case 'not-available':
      return ['No semantic handoff envelope is available for this shape.'];
    case 'diagnostic-only':
      return [
        'Envelope is diagnostic-only; no candidate pressure records are available.',
      ];
    case 'candidate-pressure-sensitive':
      return [
        'Envelope contains candidate pressure, but sensitivity caveats require cautious semantic follow-up.',
      ];
    case 'candidate-pressure-available':
      return [
        'Envelope contains candidate pressure records for later semantic inspection.',
      ];
    default:
      return [];
  }
}

function getProfileAwareSemanticHandoffPressureKindOrder(
  kind: ProfileAwareSemanticHandoffPressureKind,
): number {
  switch (kind) {
    case 'feature-observation':
      return 0;
    case 'route-gate-candidate':
      return 1;
    case 'support-region-candidate':
      return 2;
    default:
      return 3;
  }
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

function getSourceIdFromProfileAwareProbe(
  probe: ProfileAwareFieldAtlasProbe | undefined,
  viewModel: ProfileAwareFieldAtlasViewModelReport,
): string | undefined {
  if (!probe) {
    return undefined;
  }

  switch (probe.probeKind) {
    case 'source':
      return probe.sourceId;
    case 'surface-sample':
      return probe.dominantContributionSourceId;
    case 'feature-observation':
      return getDominantSourceIdFromLinkedSampleProbe(
        probe.linkedSampleProbeRef,
        viewModel,
      );
    case 'chart-summary':
    case 'route-gate-candidate':
    case 'support-region-candidate':
    case 'route-gate-summary':
    case 'support-region-summary':
      return undefined;
    default:
      return undefined;
  }
}

function getDominantSourceIdFromLinkedSampleProbe(
  linkedSampleProbeRef: string,
  viewModel: ProfileAwareFieldAtlasViewModelReport,
): string | undefined {
  const linkedProbe = viewModel.probeIndex.probes[linkedSampleProbeRef];

  return linkedProbe?.probeKind === 'surface-sample'
    ? linkedProbe.dominantContributionSourceId
    : undefined;
}

function buildProfileAwareActiveSourceContext(
  viewModel: ProfileAwareFieldAtlasViewModelReport,
  sourceId: string | undefined,
): ProfileAwareActiveSourceContext | null {
  if (!sourceId) {
    return null;
  }

  const sourceProbe = Object.values(viewModel.probeIndex.probes).find(
    (probe): probe is ProfileAwareFieldAtlasSourceProbe =>
      probe.probeKind === 'source' && probe.sourceId === sourceId,
  );
  const matchingSamples = viewModel.surfaceSampleMarkers
    .map((marker) => {
      const contributionRatio = marker.contributionRatios.find(
        (ratio) => ratio.sourceId === sourceId && ratio.value > 0,
      );

      return contributionRatio
        ? {
            sampleId: marker.sampleId,
            chartId: marker.chartId,
            contributionRatio: contributionRatio.value,
            intensity: marker.intensity,
          }
        : null;
    })
    .filter(
      (
        sample,
      ): sample is ProfileAwareActiveSourceContext['topSamples'][number] =>
        Boolean(sample),
    )
    .sort(
      (first, second) =>
        second.contributionRatio - first.contributionRatio ||
        first.sampleId.localeCompare(second.sampleId),
    );
  const matchingSampleIds = new Set(
    matchingSamples.map((sample) => sample.sampleId),
  );
  const featureMarkerCount =
    viewModel.featureOverlaySummary.featureMarkers.filter((marker) =>
      matchingSampleIds.has(marker.sampleId),
    ).length;

  return {
    sourceId,
    ...(sourceProbe?.sourceKind ? { sourceKind: sourceProbe.sourceKind } : {}),
    ...(sourceProbe?.vertexId ? { vertexId: sourceProbe.vertexId } : {}),
    ...(sourceProbe?.profileId ? { profileId: sourceProbe.profileId } : {}),
    generatedChild: Boolean(
      sourceProbe?.sourceKind?.startsWith('generated-child') ||
        sourceProbe?.childDerivation,
    ),
    sampleMarkerCount: matchingSamples.length,
    featureMarkerCount,
    topSamples: matchingSamples.slice(0, 4),
  };
}

function getChartIdsFromProfileAwareProbe(
  probe?: ProfileAwareFieldAtlasProbe,
): string[] {
  if (!probe) {
    return [];
  }

  switch (probe.probeKind) {
    case 'chart-summary':
    case 'surface-sample':
    case 'feature-observation':
      return [probe.chartId];
    case 'route-gate-candidate':
    case 'support-region-candidate':
      return [...probe.chartIds];
    case 'source':
    case 'route-gate-summary':
    case 'support-region-summary':
      return [];
    default:
      return [];
  }
}

function buildProfileAwareActiveChartContext(
  viewModel: ProfileAwareFieldAtlasViewModelReport,
  chartIds: string[],
): ProfileAwareActiveChartContext | null {
  const activeChartIds = Array.from(new Set(chartIds));

  if (!activeChartIds.length) {
    return null;
  }

  const activeChartIdSet = new Set(activeChartIds);
  const chartProbes = activeChartIds
    .map((chartId) => {
      const chartMarker = viewModel.chartOverlaySummary.chartAnchorMarkers.find(
        (marker) => marker.chartId === chartId,
      );
      const probe = chartMarker
        ? viewModel.probeIndex.probes[chartMarker.probeRef]
        : undefined;

      return probe?.probeKind === 'chart-summary' ? probe : undefined;
    })
    .filter(
      (probe): probe is ProfileAwareFieldAtlasChartProbe => Boolean(probe),
    );
  const primaryChartProbe =
    activeChartIds.length === 1 ? chartProbes[0] : undefined;
  const sampleMarkers = viewModel.surfaceSampleMarkers.filter(
    (marker) => activeChartIdSet.has(marker.chartId),
  );
  const featureMarkers = viewModel.featureOverlaySummary.featureMarkers.filter(
    (marker) => activeChartIdSet.has(marker.chartId),
  );
  const routeGateCandidateMarkers =
    viewModel.routeGateOverlaySummary.candidateMarkers.filter((marker) =>
      marker.chartIds.some((chartId) => activeChartIdSet.has(chartId)),
    );
  const supportRegionCandidateMarkers =
    viewModel.supportRegionOverlaySummary.candidateMarkers.filter((marker) =>
      marker.chartIds.some((chartId) => activeChartIdSet.has(chartId)),
    );
  const intensityRange = getProbeNumberRange(
    chartProbes.flatMap((probe) => [probe.minIntensity, probe.maxIntensity]),
  );
  const phaseRange = getProbeNumberRange(
    chartProbes.flatMap((probe) => [probe.minPhase, probe.maxPhase]),
  );

  return {
    activeChartIds,
    primaryChartProbe,
    chartCount: activeChartIds.length,
    sampleMarkerCount: sampleMarkers.length,
    featureMarkerCount: featureMarkers.length,
    routeGateCandidateCount: routeGateCandidateMarkers.length,
    supportRegionCandidateCount: supportRegionCandidateMarkers.length,
    relatedSampleIds: sampleMarkers.slice(0, 4).map((marker) => marker.sampleId),
    relatedFeatureIds: featureMarkers
      .slice(0, 4)
      .map((marker) => marker.featureId),
    ...(intensityRange ? { intensityRange } : {}),
    ...(phaseRange ? { phaseRange } : {}),
    allContributionRatiosValid: chartProbes.length
      ? chartProbes.every((probe) => probe.allContributionRatiosValid)
      : true,
  };
}

function getProbeNumberRange(
  values: number[],
): { min: number; max: number } | undefined {
  const finiteValues = values.filter((value) => Number.isFinite(value));

  if (!finiteValues.length) {
    return undefined;
  }

  return finiteValues.reduce(
    (range, value) => ({
      min: Math.min(range.min, value),
      max: Math.max(range.max, value),
    }),
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
  );
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
  const profileAwareRuntimeReport = useMemo(
    () => buildProfileAwareFieldAtlasViewModelRuntimeReport(shape),
    [shape],
  );
  const runtimeSupportPolicyReport = useMemo(
    () => buildProfileAwareRuntimeSupportPolicyReport(shape),
    [shape],
  );
  const runtimeSupportMatrixReport = useMemo(
    () => buildProfileAwareRuntimeSupportMatrixReport(),
    [],
  );
  const runtimeSupportPolicyRegistrySummary = useMemo(
    () => getProfileAwareRuntimeSupportPolicyRegistrySummary(),
    [],
  );
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
        <ProfileAwareRuntimeSupportInternalDiagnosticsSection
          runtimeReport={profileAwareRuntimeReport}
          policyReport={runtimeSupportPolicyReport}
          matrixReport={runtimeSupportMatrixReport}
          registrySummary={runtimeSupportPolicyRegistrySummary}
          shortenId={shortenId}
        />
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

function getLatestHistoryEntryForShape(
  operationHistory: OperationHistoryEntry[],
  shapeId: ShapeId,
): OperationHistoryEntry | undefined {
  for (let index = operationHistory.length - 1; index >= 0; index -= 1) {
    const entry = operationHistory[index];

    if (entry.shapeId === shapeId) {
      return entry;
    }
  }

  return undefined;
}

function formatYesNo(value: boolean): string {
  return value ? 'yes' : 'no';
}

function formatSignedDelta(value: number | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return 'n/a';
  }

  return value > 0 ? `+${value}` : String(value);
}

function formatProfileAwareStabilityLabel(label: string): string {
  return label.replace(/-profile-setup$/, '').replace(/-/g, ' ');
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

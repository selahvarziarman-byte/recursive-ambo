import { Html } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import {
  buildProfileAwareFieldAtlasViewModelRuntimeReport,
  type ProfileAwareFieldAtlasFeatureMarker,
  type ProfileAwareFieldAtlasRouteGateCandidateMarker,
  type ProfileAwareFieldAtlasSourceMarker,
  type ProfileAwareFieldAtlasSupportRegionCandidateMarker,
  type ProfileAwareFieldAtlasSurfaceSampleMarker,
} from '../lib/fieldSourceProfileAwareAtlasViewModel';
import {
  useGeometryStore,
  type FieldAtlasLayerVisibility,
} from '../store/geometryStore';
import type { Shape, Vec3 } from '../types/geometry';

interface FieldAtlasSampleMarkersProps {
  shape: Shape;
  enabled: boolean;
}

interface FieldAtlasMarker {
  id: string;
  hoverRef: string;
  position: Vec3;
  radius: number;
  opacity: number;
  color: string;
  emissive: string;
  emissiveIntensity: number;
  intensity: number;
  valueLabel: 'amplitude' | 'intensity';
  label: string;
  detailLabel?: string;
  kind:
    | 'source-marker'
    | 'surface-sample-marker'
    | 'feature-observation-marker'
    | 'route-gate-candidate-anchor-marker'
    | 'support-region-candidate-anchor-marker';
}

export function FieldAtlasSampleMarkers({ shape, enabled }: FieldAtlasSampleMarkersProps) {
  const fieldAtlasLayerVisibility = useGeometryStore(
    (state) => state.fieldAtlasLayerVisibility,
  );
  const markers = useMemo(
    () => buildMarkerModel(shape, enabled, fieldAtlasLayerVisibility),
    [enabled, fieldAtlasLayerVisibility, shape],
  );
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

  useEffect(() => {
    if (!enabled && hoveredFieldAtlasSampleId) {
      setHoveredFieldAtlasSampleId(null);
    }
  }, [enabled, hoveredFieldAtlasSampleId, setHoveredFieldAtlasSampleId]);

  if (!enabled || !markers.length) {
    return null;
  }

  return (
    <group>
      {markers.map((marker) => {
        const isHovered = hoveredFieldAtlasSampleId === marker.hoverRef;
        const isPinned = pinnedFieldAtlasProbeRef === marker.hoverRef;
        const markerScale = isPinned ? 2.12 : isHovered ? 1.85 : 1;

        return (
          <mesh
            key={marker.id}
            position={marker.position}
            renderOrder={isPinned ? 28 : isHovered ? 24 : 18}
            scale={markerScale}
            onClick={(event) => {
              event.stopPropagation();
              setPinnedFieldAtlasProbeRef(isPinned ? null : marker.hoverRef);
            }}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onPointerEnter={(event) => {
              event.stopPropagation();
              setHoveredFieldAtlasSampleId(marker.hoverRef);
              document.body.style.cursor = 'default';
            }}
            onPointerLeave={(event) => {
              event.stopPropagation();
              clearHoveredRef(marker.hoverRef, setHoveredFieldAtlasSampleId);
              document.body.style.cursor = 'auto';
            }}
            onPointerMove={(event) => {
              event.stopPropagation();
              setHoveredFieldAtlasSampleId(marker.hoverRef);
            }}
          >
            {marker.kind === 'surface-sample-marker' ? (
              <octahedronGeometry args={[marker.radius, 0]} />
            ) : (
              <sphereGeometry args={[marker.radius, 18, 12]} />
            )}
            <meshStandardMaterial
              color={isPinned ? '#fef3c7' : isHovered ? '#fde68a' : marker.color}
              depthWrite={false}
              emissive={isPinned ? '#a16207' : isHovered ? '#92400e' : marker.emissive}
              emissiveIntensity={isPinned ? 1.05 : isHovered ? 0.92 : marker.emissiveIntensity}
              opacity={isPinned ? 0.98 : isHovered ? 0.94 : marker.opacity}
              roughness={0.38}
              transparent
            />
            {isHovered ? (
              <Html
                center
                distanceFactor={7}
                position={[0, marker.radius * 3.2, 0]}
                style={{ pointerEvents: 'none' }}
              >
                <div className="whitespace-nowrap rounded border border-emerald-300/50 bg-stone-950/95 px-2 py-1 text-[11px] leading-4 text-stone-100 shadow-lg">
                  <span className="block font-medium text-emerald-100">{marker.label}</span>
                  {marker.detailLabel ? (
                    <span className="block text-stone-300">{marker.detailLabel}</span>
                  ) : null}
                  <span className="block font-mono text-stone-400">
                    {marker.valueLabel} {formatNumber(marker.intensity)}
                  </span>
                </div>
              </Html>
            ) : null}
          </mesh>
        );
      })}
    </group>
  );
}

function buildMarkerModel(
  shape: Shape,
  enabled: boolean,
  layerVisibility: FieldAtlasLayerVisibility,
): FieldAtlasMarker[] {
  if (!enabled) {
    return [];
  }

  try {
    const runtimeReport = buildProfileAwareFieldAtlasViewModelRuntimeReport(shape);

    if (runtimeReport.runtimeBoundaryStatus !== 'supported') {
      return [];
    }

    const viewModel = runtimeReport.viewModel;
    const sourceMarkers = layerVisibility.sources ? viewModel.sourceMarkers : [];
    const surfaceSampleMarkers = layerVisibility.samples
      ? viewModel.surfaceSampleMarkers
      : [];
    const featureMarkers = layerVisibility.features
      ? viewModel.featureOverlaySummary.featureMarkers
      : [];
    const routeGateCandidateMarkers = layerVisibility.routeGateCandidates
      ? viewModel.routeGateOverlaySummary.candidateMarkers
      : [];
    const supportRegionCandidateMarkers =
      layerVisibility.supportRegionCandidates
        ? viewModel.supportRegionOverlaySummary.candidateMarkers
        : [];
    const positions = [
      ...sourceMarkers.map((marker) => marker.position),
      ...surfaceSampleMarkers.map((marker) => marker.position),
      ...featureMarkers.map((marker) => marker.position),
      ...routeGateCandidateMarkers
        .map((marker) => marker.position)
        .filter((position): position is Vec3 => Boolean(position)),
      ...supportRegionCandidateMarkers
        .map((marker) => marker.position)
        .filter((position): position is Vec3 => Boolean(position)),
    ];
    const radiusBase = getMarkerRadiusBase(positions);
    const intensityRange = {
      min: viewModel.renderScale.intensityMin,
      max: viewModel.renderScale.intensityMax,
    };

    return [
      ...sourceMarkers.map((marker) => buildSourceMarker(marker, radiusBase)),
      ...surfaceSampleMarkers.map((marker) =>
        buildSurfaceSampleMarker(marker, radiusBase, intensityRange),
      ),
      ...featureMarkers.map((marker) =>
        buildFeatureMarker(marker, radiusBase),
      ),
      ...routeGateCandidateMarkers
        .map((marker) => buildRouteGateCandidateMarker(marker, radiusBase))
        .filter((marker): marker is FieldAtlasMarker => Boolean(marker)),
      ...supportRegionCandidateMarkers
        .map((marker) => buildSupportRegionCandidateMarker(marker, radiusBase))
        .filter((marker): marker is FieldAtlasMarker => Boolean(marker)),
    ];
  } catch {
    return [];
  }
}

function buildSourceMarker(
  marker: ProfileAwareFieldAtlasSourceMarker,
  radiusBase: number,
): FieldAtlasMarker {
  return {
    id: `source:${marker.sourceId}`,
    hoverRef: marker.probeRef,
    position: copyVec3(marker.position),
    radius: radiusBase * (marker.isGeneratedChildSource ? 1.18 : 1.28),
    opacity: marker.isGeneratedChildSource ? 0.74 : 0.82,
    color: marker.isGeneratedChildSource ? '#86efac' : '#bbf7d0',
    emissive: '#14532d',
    emissiveIntensity: marker.isGeneratedChildSource ? 0.34 : 0.42,
    intensity: marker.amplitude,
    valueLabel: 'amplitude',
    label: 'Source marker',
    detailLabel: formatSourceMarkerDetail(marker),
    kind: 'source-marker',
  };
}

function buildSurfaceSampleMarker(
  marker: ProfileAwareFieldAtlasSurfaceSampleMarker,
  radiusBase: number,
  intensityRange: { min: number; max: number },
): FieldAtlasMarker {
  const normalizedIntensity = normalizeIntensity(marker.intensity, intensityRange);

  return {
    id: `sample:${marker.sampleId}`,
    hoverRef: marker.probeRef,
    position: copyVec3(marker.position),
    radius: radiusBase * (0.78 + normalizedIntensity * 0.36),
    opacity: 0.46 + normalizedIntensity * 0.2,
    color: '#67e8f9',
    emissive: '#164e63',
    emissiveIntensity: 0.26,
    intensity: marker.intensity,
    valueLabel: 'intensity',
    label: 'Surface sample marker',
    detailLabel: formatSurfaceSampleMarkerDetail(marker),
    kind: 'surface-sample-marker',
  };
}

function buildFeatureMarker(
  marker: ProfileAwareFieldAtlasFeatureMarker,
  radiusBase: number,
): FieldAtlasMarker {
  return {
    id: `feature:${marker.featureId}`,
    hoverRef: marker.probeRef,
    position: copyVec3(marker.position),
    radius: radiusBase * 0.96,
    opacity: 0.86,
    color: '#fbbf24',
    emissive: '#78350f',
    emissiveIntensity: 0.5,
    intensity: marker.intensity,
    valueLabel: 'intensity',
    label: formatFeatureMarkerLabel(marker),
    detailLabel: `${marker.status}; ${formatMarkerStatus(marker.semanticStatus)}`,
    kind: 'feature-observation-marker',
  };
}

function buildRouteGateCandidateMarker(
  marker: ProfileAwareFieldAtlasRouteGateCandidateMarker,
  radiusBase: number,
): FieldAtlasMarker | null {
  if (!marker.position) {
    return null;
  }

  return {
    id: `route-gate-candidate:${marker.candidateId}`,
    hoverRef: marker.probeRef,
    position: copyVec3(marker.position),
    radius: radiusBase * 1.08,
    opacity: 0.82,
    color: '#fda4af',
    emissive: '#7f1d1d',
    emissiveIntensity: 0.46,
    intensity: marker.intensitySummary.average,
    valueLabel: 'intensity',
    label: 'Route/gate candidate anchor',
    detailLabel: `${marker.candidateKind}; ${marker.reliability}`,
    kind: 'route-gate-candidate-anchor-marker',
  };
}

function buildSupportRegionCandidateMarker(
  marker: ProfileAwareFieldAtlasSupportRegionCandidateMarker,
  radiusBase: number,
): FieldAtlasMarker | null {
  if (!marker.position) {
    return null;
  }

  return {
    id: `support-region-candidate:${marker.candidateId}`,
    hoverRef: marker.probeRef,
    position: copyVec3(marker.position),
    radius: radiusBase * 1.02,
    opacity: 0.8,
    color: '#93c5fd',
    emissive: '#1e3a8a',
    emissiveIntensity: 0.42,
    intensity: marker.evidenceSummary.averageIntensity,
    valueLabel: 'intensity',
    label: 'Support/region candidate anchor',
    detailLabel: `${marker.candidateKind}; ${marker.reliability}`,
    kind: 'support-region-candidate-anchor-marker',
  };
}

function clearHoveredRef(
  hoverRef: string,
  setHoveredFieldAtlasSampleId: (sampleId: string | null) => void,
): void {
  if (useGeometryStore.getState().hoveredFieldAtlasSampleId === hoverRef) {
    setHoveredFieldAtlasSampleId(null);
  }
}

function formatSourceMarkerDetail(marker: ProfileAwareFieldAtlasSourceMarker): string {
  const profile = marker.profileId ? `profile ${marker.profileId}` : 'profile n/a';
  const kind = marker.sourceKind.replace(/-/g, ' ');

  return `${kind}; ${profile}`;
}

function formatSurfaceSampleMarkerDetail(
  marker: ProfileAwareFieldAtlasSurfaceSampleMarker,
): string {
  if (typeof marker.dominantContributionRatio !== 'number') {
    return `contributions ${marker.contributionCount}`;
  }

  return `top contribution ${formatNumber(marker.dominantContributionRatio)}`;
}

function formatFeatureMarkerLabel(marker: ProfileAwareFieldAtlasFeatureMarker): string {
  switch (marker.observationKind) {
    case 'cancellation-like-site-candidate':
      return 'cancellation-like candidate';
    case 'high-intensity-anchor-candidate':
      return 'high-intensity anchor candidate';
    case 'ambiguous-field-site':
      return 'ambiguous field-site candidate';
    default:
      return 'report-candidate';
  }
}

function formatMarkerStatus(status: string): string {
  return status === 'not-semantic-naming' ? 'not semantic naming' : status;
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

function normalizeIntensity(intensity: number, range: { min: number; max: number }): number {
  if (!Number.isFinite(intensity)) {
    return 0;
  }

  const span = range.max - range.min;

  if (span <= 1e-9) {
    return 0.45;
  }

  return Math.min(1, Math.max(0, (intensity - range.min) / span));
}

function getMarkerRadiusBase(positions: Vec3[]): number {
  if (!positions.length) {
    return 0.035;
  }

  const bounds = positions.reduce(
    (box, position) => ({
      min: [
        Math.min(box.min[0], position[0]),
        Math.min(box.min[1], position[1]),
        Math.min(box.min[2], position[2]),
      ] as Vec3,
      max: [
        Math.max(box.max[0], position[0]),
        Math.max(box.max[1], position[1]),
        Math.max(box.max[2], position[2]),
      ] as Vec3,
    }),
    { min: [...positions[0]] as Vec3, max: [...positions[0]] as Vec3 },
  );
  const extent = Math.max(
    bounds.max[0] - bounds.min[0],
    bounds.max[1] - bounds.min[1],
    bounds.max[2] - bounds.min[2],
  );

  return Math.min(0.06, Math.max(0.032, extent * 0.018));
}

function copyVec3(position: Vec3): Vec3 {
  return [position[0], position[1], position[2]];
}

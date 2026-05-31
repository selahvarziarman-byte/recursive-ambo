import { Html } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import {
  buildClosedShapeSurfaceRepresentativeSamplePoints,
  buildClosedShapeSurfaceSourceDomain,
  buildFieldSourcePopulation,
  sampleFieldAtlasPoints,
  type FieldAtlasSample,
} from '../lib/fieldAtlas';
import { useGeometryStore } from '../store/geometryStore';
import type { Shape, Vec3 } from '../types/geometry';

interface FieldAtlasSampleMarkersProps {
  shape: Shape;
  enabled: boolean;
}

interface FieldAtlasMarker {
  id: string;
  position: Vec3;
  radius: number;
  opacity: number;
  color: string;
  emissive: string;
  emissiveIntensity: number;
  intensity: number;
  label: string;
  kind: 'source-vertex' | 'surface-sample';
}

export function FieldAtlasSampleMarkers({ shape, enabled }: FieldAtlasSampleMarkersProps) {
  const markers = useMemo(() => buildMarkerModel(shape, enabled), [enabled, shape]);
  const hoveredFieldAtlasSampleId = useGeometryStore(
    (state) => state.hoveredFieldAtlasSampleId,
  );
  const setHoveredFieldAtlasSampleId = useGeometryStore(
    (state) => state.setHoveredFieldAtlasSampleId,
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
        const isHovered = hoveredFieldAtlasSampleId === marker.id;
        const markerScale = isHovered ? 1.85 : 1;

        return (
          <mesh
            key={marker.id}
            position={marker.position}
            renderOrder={isHovered ? 24 : 18}
            scale={markerScale}
            onClick={(event) => {
              event.stopPropagation();
            }}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onPointerEnter={(event) => {
              event.stopPropagation();
              setHoveredFieldAtlasSampleId(marker.id);
              document.body.style.cursor = 'default';
            }}
            onPointerLeave={(event) => {
              event.stopPropagation();
              clearHoveredSample(marker.id, setHoveredFieldAtlasSampleId);
              document.body.style.cursor = 'auto';
            }}
            onPointerMove={(event) => {
              event.stopPropagation();
              setHoveredFieldAtlasSampleId(marker.id);
            }}
          >
            {marker.kind === 'source-vertex' ? (
              <sphereGeometry args={[marker.radius, 18, 12]} />
            ) : (
              <octahedronGeometry args={[marker.radius, 0]} />
            )}
            <meshStandardMaterial
              color={isHovered ? '#fde68a' : marker.color}
              depthWrite={false}
              emissive={isHovered ? '#92400e' : marker.emissive}
              emissiveIntensity={isHovered ? 0.92 : marker.emissiveIntensity}
              opacity={isHovered ? 0.94 : marker.opacity}
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
                  <span className="block font-mono text-stone-400">
                    intensity {formatNumber(marker.intensity)}
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

function buildMarkerModel(shape: Shape, enabled: boolean): FieldAtlasMarker[] {
  if (!enabled) {
    return [];
  }

  try {
    const domain = buildClosedShapeSurfaceSourceDomain(shape);
    const sources = buildFieldSourcePopulation(shape, domain);
    const samplePoints = buildClosedShapeSurfaceRepresentativeSamplePoints(domain);
    const samples = sampleFieldAtlasPoints(sources, samplePoints);
    const range = getIntensityRange(samples);
    const radiusBase = getMarkerRadiusBase(domain.positions);

    return samples.map((sample) => {
      const normalizedIntensity = normalizeIntensity(sample.intensity, range);
      const isSourceVertexSample = sample.id.startsWith('closed-shape-surface:vertex:');

      return {
        id: sample.id,
        position: sample.position,
        radius: isSourceVertexSample
          ? radiusBase * (1.08 + normalizedIntensity * 0.18)
          : radiusBase * (0.82 + normalizedIntensity * 0.42),
        opacity: isSourceVertexSample
          ? 0.58 + normalizedIntensity * 0.14
          : 0.44 + normalizedIntensity * 0.24,
        color: isSourceVertexSample ? '#86efac' : '#67e8f9',
        emissive: isSourceVertexSample ? '#14532d' : '#164e63',
        emissiveIntensity: isSourceVertexSample ? 0.34 : 0.26,
        intensity: sample.intensity,
        label: formatSampleMarkerLabel(sample),
        kind: isSourceVertexSample ? 'source-vertex' : 'surface-sample',
      };
    });
  } catch {
    return [];
  }
}

function clearHoveredSample(
  sampleId: string,
  setHoveredFieldAtlasSampleId: (sampleId: string | null) => void,
): void {
  if (useGeometryStore.getState().hoveredFieldAtlasSampleId === sampleId) {
    setHoveredFieldAtlasSampleId(null);
  }
}

function formatSampleMarkerLabel(sample: FieldAtlasSample): string {
  if (sample.id.startsWith('closed-shape-surface:vertex:')) {
    return 'Vertex sample';
  }

  if (sample.id.startsWith('closed-shape-surface:face-centroid:')) {
    return 'Face sample';
  }

  if (sample.chartSemanticRole === 'computational-only') {
    return 'Chart sample';
  }

  return 'Surface sample';
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

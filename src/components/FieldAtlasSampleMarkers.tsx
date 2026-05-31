import { useMemo } from 'react';
import * as THREE from 'three';
import {
  buildClosedShapeSurfaceRepresentativeSamplePoints,
  buildClosedShapeSurfaceSourceDomain,
  buildFieldSourcePopulation,
  sampleFieldAtlasPoints,
  type FieldAtlasSample,
} from '../lib/fieldAtlas';
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
  kind: 'source-vertex' | 'surface-sample';
}

const disabledRaycast: THREE.Object3D['raycast'] = () => undefined;

export function FieldAtlasSampleMarkers({ shape, enabled }: FieldAtlasSampleMarkersProps) {
  const markers = useMemo(() => buildMarkerModel(shape, enabled), [enabled, shape]);

  if (!enabled || !markers.length) {
    return null;
  }

  return (
    <group>
      {markers.map((marker) => (
        <mesh
          key={marker.id}
          position={marker.position}
          raycast={disabledRaycast}
          renderOrder={18}
        >
          {marker.kind === 'source-vertex' ? (
            <sphereGeometry args={[marker.radius, 18, 12]} />
          ) : (
            <octahedronGeometry args={[marker.radius, 0]} />
          )}
          <meshStandardMaterial
            color={marker.color}
            depthWrite={false}
            emissive={marker.emissive}
            emissiveIntensity={marker.emissiveIntensity}
            opacity={marker.opacity}
            roughness={0.38}
            transparent
          />
        </mesh>
      ))}
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
        kind: isSourceVertexSample ? 'source-vertex' : 'surface-sample',
      };
    });
  } catch {
    return [];
  }
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

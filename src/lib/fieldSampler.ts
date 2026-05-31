import type { Shape, Vec3, VertexId } from '../types/geometry';

export type FieldKernelName = 'inverse-distance';

export interface FieldSource {
  vertexId: VertexId;
  position: Vec3;
  weight: number;
  label?: string;
}

export interface FieldSampleOptions {
  epsilon?: number;
  power?: number;
}

export const FIELD_KERNEL: FieldKernelName = 'inverse-distance';

export const DEFAULT_FIELD_SAMPLE_OPTIONS: Required<FieldSampleOptions> = {
  epsilon: 1e-6,
  power: 2,
};

export function buildFieldSources(shape: Shape): FieldSource[] {
  return Object.values(shape.vertices)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((vertex) => {
      const label = vertex.data.label.trim();

      return {
        vertexId: vertex.id,
        position: [...vertex.position],
        weight: 1,
        ...(label ? { label } : {}),
      };
    });
}

export function sampleFieldAtPoint(
  sources: FieldSource[],
  point: Vec3,
  options: FieldSampleOptions = {},
): number {
  const { epsilon, power } = resolveFieldSampleOptions(options);

  return sources.reduce((sum, source) => {
    const distance = distanceVec3(source.position, point);

    // Diagnostic, dimensionless inverse-distance kernel; not a physics claim.
    return sum + source.weight / Math.pow(distance + epsilon, power);
  }, 0);
}

function resolveFieldSampleOptions(options: FieldSampleOptions): Required<FieldSampleOptions> {
  const epsilon =
    typeof options.epsilon === 'number' && Number.isFinite(options.epsilon) && options.epsilon > 0
      ? options.epsilon
      : DEFAULT_FIELD_SAMPLE_OPTIONS.epsilon;
  const power =
    typeof options.power === 'number' && Number.isFinite(options.power) && options.power > 0
      ? options.power
      : DEFAULT_FIELD_SAMPLE_OPTIONS.power;

  return {
    epsilon,
    power,
  };
}

function distanceVec3(a: Vec3, b: Vec3): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];

  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

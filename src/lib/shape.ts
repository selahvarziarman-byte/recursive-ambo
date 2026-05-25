import type {
  Edge,
  Face,
  ShapeId,
  Vec3,
  VertexDataPacket,
  VertexId,
} from '../types/geometry';
import { canonicalEdgeKey, makeEdgeId } from './ids';

export function createDefaultVertexData(
  label: string,
  color = '#22c55e',
  custom: VertexDataPacket['custom'] = {},
): VertexDataPacket {
  return {
    label,
    notes: '',
    color,
    tags: [],
    custom,
  };
}

export function midpoint(a: Vec3, b: Vec3): Vec3 {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
}

export function deriveEdges(faces: Face[], shapeId: ShapeId): Edge[] {
  const edges = new Map<string, Edge>();

  for (const face of faces) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = canonicalEdgeKey(a, b);

      if (!edges.has(key)) {
        edges.set(key, {
          id: makeEdgeId(shapeId, a, b),
          vertexIds: [a, b],
          sourceVertexIds: [a, b],
        });
      }
    }
  }

  return Array.from(edges.values());
}

export function formatVec3([x, y, z]: Vec3): string {
  return `${x.toFixed(3)}, ${y.toFixed(3)}, ${z.toFixed(3)}`;
}

export function uniqueVertexIds(vertexIds: VertexId[]): VertexId[] {
  return Array.from(new Set(vertexIds));
}

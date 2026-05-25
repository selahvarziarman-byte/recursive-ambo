import type {
  Cell,
  Edge,
  Face,
  PacketLineage,
  Shape,
  ShapeId,
  Vec3,
  Vertex,
  VertexDataPacket,
  VertexId,
} from '../types/geometry';
import { canonicalEdgeKey, makeEdgeId } from './ids';
import { defaultPacket } from './packets';

export function createDefaultVertexData(
  label: string,
  color = '#22c55e',
  custom: VertexDataPacket['custom'] = {},
  lineage?: PacketLineage,
): VertexDataPacket {
  return {
    label,
    notes: '',
    color,
    tags: [],
    custom,
    ...defaultPacket(lineage),
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

export function getCellFaces(shape: Shape, cell: Cell): Face[] {
  const faceIds = new Set(cell.faceIds);

  return shape.faces.filter((face) => faceIds.has(face.id));
}

export function getCellVertices(shape: Shape, cell: Cell): Vertex[] {
  return cell.vertexIds
    .map((vertexId) => shape.vertices[vertexId])
    .filter((vertex): vertex is Vertex => Boolean(vertex));
}

export function getFaceVertices(shape: Shape, face: Face): Vertex[] {
  return face.vertexIds
    .map((vertexId) => shape.vertices[vertexId])
    .filter((vertex): vertex is Vertex => Boolean(vertex));
}

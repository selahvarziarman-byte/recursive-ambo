import type {
  CellId,
  CellKind,
  EdgeId,
  FaceId,
  GenerationId,
  OperationKind,
  ShapeId,
  VertexId,
} from '../types/geometry';

export function stableHash(input: string): string {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(36);
}

export function canonicalEdgeKey(a: VertexId, b: VertexId): string {
  return [a, b].sort().join('|');
}

export function makeShapeId(
  parentShapeId: ShapeId,
  operation: OperationKind,
  generationDepth: number,
): ShapeId {
  return `shape:${operation}:${generationDepth}:${stableHash(`${parentShapeId}|${operation}|${generationDepth}`)}`;
}

export function makeEdgeId(shapeId: ShapeId, a: VertexId, b: VertexId): EdgeId {
  return `edge:${stableHash(`${shapeId}|${canonicalEdgeKey(a, b)}`)}`;
}

export function makeMidpointVertexId(parentCellId: CellId, a: VertexId, b: VertexId): VertexId {
  return `vertex:mid:${stableHash(`${parentCellId}|midpoint|${canonicalEdgeKey(a, b)}`)}`;
}

export function makeFaceId(
  shapeId: ShapeId,
  role: string,
  sourceId: string,
  vertexIds: VertexId[],
): FaceId {
  return `face:${stableHash(`${shapeId}|${role}|${sourceId}|${vertexIds.join('|')}`)}`;
}

export function makeCellId(
  shapeId: ShapeId,
  kind: CellKind,
  sourceId: string,
  vertexIds: VertexId[],
): CellId {
  return `cell:${kind}:${stableHash(`${shapeId}|${kind}|${sourceId}|${vertexIds.join('|')}`)}`;
}

export function makeGenerationId(
  shapeId: ShapeId,
  sourceOperation: OperationKind,
  depth: number,
): GenerationId {
  return `generation:${stableHash(`${shapeId}|${sourceOperation}|${depth}`)}`;
}

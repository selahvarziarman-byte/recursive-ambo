import type { Cell, Face, Shape, Vec3, Vertex } from '../types/geometry';
import { isCellActiveFrontier } from './cellLifecycle';
import { buildSemanticDualModel, type SemanticDualModel } from './dualization';
import { stableHash } from './ids';
import { getCellFaces, getCellVertices, getFaceVertices } from './shape';

export type DualViewSupportedTopology = 'tetrahedron' | 'octahedron' | 'cube';
export type DualViewTopology =
  | DualViewSupportedTopology
  | 'cuboctahedron'
  | 'square-pyramid'
  | 'unknown';

export interface DualViewDescription {
  source: DualViewTopology;
  dual?: DualViewSupportedTopology;
}

export interface DualViewVertex {
  id: string;
  position: Vec3;
}

export interface DualViewFace {
  id: string;
  vertexIds: string[];
}

export interface DualViewProxy {
  cellId: string;
  topology: DualViewSupportedTopology;
  vertices: DualViewVertex[];
  faces: DualViewFace[];
}

export type DualUniverseViewModel =
  | { kind: 'legacy-proxy'; proxy: DualViewProxy }
  | { kind: 'semantic-model'; semanticModel: SemanticDualModel }
  | { kind: 'unsupported'; reason: string };

interface DualVertexEntry {
  face: Face;
  vertex: DualViewVertex;
}

export function describeDualViewTopology(shape: Shape, cell: Cell): DualViewDescription {
  const faces = getCellFaces(shape, cell);
  const faceSizes = faces.map((face) => face.vertexIds.length);

  if (cell.vertexIds.length === 4 && faces.length === 4 && faceSizes.every((size) => size === 3)) {
    return { source: 'tetrahedron', dual: 'tetrahedron' };
  }

  if (cell.vertexIds.length === 6 && faces.length === 8 && faceSizes.every((size) => size === 3)) {
    return { source: 'octahedron', dual: 'cube' };
  }

  if (cell.vertexIds.length === 8 && faces.length === 6 && faceSizes.every((size) => size === 4)) {
    return { source: 'cube', dual: 'octahedron' };
  }

  if (cell.kind === 'core' && cell.vertexIds.length === 12) {
    return { source: 'cuboctahedron' };
  }

  if (cell.kind === 'residue' && cell.vertexIds.length === 5) {
    return { source: 'square-pyramid' };
  }

  return { source: 'unknown' };
}

export function isDualViewSupportedCell(shape: Shape, cell: Cell): boolean {
  return Boolean(describeDualViewTopology(shape, cell).dual);
}

export function buildDualUniverseViewModel(shape: Shape, cell: Cell): DualUniverseViewModel {
  if (isSemanticDualUniverseSource(shape, cell)) {
    try {
      return {
        kind: 'semantic-model',
        semanticModel: buildSemanticDualModel(shape, cell.id),
      };
    } catch {
      return {
        kind: 'unsupported',
        reason: 'Semantic Dual Universe could not build a valid dodecahedron counterpart for this cell.',
      };
    }
  }

  const proxy = buildDualViewProxy(shape, cell);

  if (proxy) {
    return {
      kind: 'legacy-proxy',
      proxy,
    };
  }

  return {
    kind: 'unsupported',
    reason: getDualUniverseUnsupportedReason(shape, cell),
  };
}

export function buildDualViewProxy(shape: Shape, cell: Cell): DualViewProxy | null {
  const topology = describeDualViewTopology(shape, cell);

  if (!topology.dual) {
    return null;
  }

  const sourceFaces = getCellFaces(shape, cell);
  const sourceVertices = getCellVertices(shape, cell);
  const sourceCentroid = averagePosition(sourceVertices.map((vertex) => vertex.position));
  const rawDualPositions = sourceFaces.map((face) => faceCentroid(shape, face));
  const scaleFactor = dualScaleFactor(
    sourceCentroid,
    sourceVertices.map((vertex) => vertex.position),
    rawDualPositions,
  );
  const dualVertexByFaceId = new Map<string, DualVertexEntry>();

  for (let index = 0; index < sourceFaces.length; index += 1) {
    const face = sourceFaces[index];
    const vertex = {
      id: makeDualViewVertexId(cell.id, face.id),
      position: scaleAround(sourceCentroid, rawDualPositions[index], scaleFactor),
    };

    dualVertexByFaceId.set(face.id, { face, vertex });
  }

  const faces = sourceVertices.map((sourceVertex) =>
    createDualFace(shape, cell, sourceVertex, sourceFaces, sourceCentroid, dualVertexByFaceId),
  );

  return {
    cellId: cell.id,
    topology: topology.dual,
    vertices: sourceFaces.map((face) => getDualVertex(dualVertexByFaceId, face.id).vertex),
    faces,
  };
}

function isSemanticDualUniverseSource(shape: Shape, cell: Cell): boolean {
  return (
    cell.kind === 'core' &&
    cell.topology === 'pyritohedral-icosahedron' &&
    isCellActiveFrontier(shape, cell.id)
  );
}

function getDualUniverseUnsupportedReason(shape: Shape, cell: Cell): string {
  if (cell.kind === 'core' && cell.topology === 'pyritohedral-icosahedron') {
    return 'Semantic Dual Universe is available only for active pyritohedral-icosahedron core cells.';
  }

  const topology = describeDualViewTopology(shape, cell);

  if (topology.source !== 'unknown') {
    return `Dual Universe is not available for ${topology.source}.`;
  }

  return 'Dual Universe is not available for this cell topology.';
}

function createDualFace(
  shape: Shape,
  cell: Cell,
  sourceVertex: Vertex,
  sourceFaces: Face[],
  sourceCentroid: Vec3,
  dualVertexByFaceId: Map<string, DualVertexEntry>,
): DualViewFace {
  const incidentFaces = sourceFaces.filter((face) => face.vertexIds.includes(sourceVertex.id));
  const orderedFaces = orderIncidentFaces(shape, sourceVertex, incidentFaces, sourceCentroid);
  const vertexIds = orderedFaces.map((face) => getDualVertex(dualVertexByFaceId, face.id).vertex.id);

  return {
    id: makeDualViewFaceId(cell.id, sourceVertex.id, vertexIds),
    vertexIds,
  };
}

function orderIncidentFaces(
  shape: Shape,
  sourceVertex: Vertex,
  incidentFaces: Face[],
  sourceCentroid: Vec3,
): Face[] {
  const normal = normalizeVec3(
    subtractVec3(sourceVertex.position, sourceCentroid),
    fallbackDirection(sourceVertex.id),
  );
  const basis = tangentBasis(normal);

  return [...incidentFaces].sort((a, b) => {
    const angleA = faceAngle(shape, a, sourceVertex.position, basis.u, basis.v);
    const angleB = faceAngle(shape, b, sourceVertex.position, basis.u, basis.v);
    const angleDelta = angleA - angleB;

    return Math.abs(angleDelta) > 0.000001 ? angleDelta : a.id.localeCompare(b.id);
  });
}

function faceAngle(shape: Shape, face: Face, origin: Vec3, u: Vec3, v: Vec3): number {
  const projected = subtractVec3(faceCentroid(shape, face), origin);

  return Math.atan2(dotVec3(projected, v), dotVec3(projected, u));
}

function makeDualViewVertexId(cellId: string, faceId: string): string {
  return `vertex:dual-view:${stableHash(`${cellId}|${faceId}`)}`;
}

function makeDualViewFaceId(cellId: string, sourceVertexId: string, vertexIds: string[]): string {
  return `face:dual-view:${stableHash(`${cellId}|${sourceVertexId}|${vertexIds.join('|')}`)}`;
}

function getDualVertex(entries: Map<string, DualVertexEntry>, sourceFaceId: string): DualVertexEntry {
  const entry = entries.get(sourceFaceId);

  if (!entry) {
    throw new Error(`Missing dual view vertex for source face ${sourceFaceId}`);
  }

  return entry;
}

function faceCentroid(shape: Shape, face: Face): Vec3 {
  return averagePosition(getFaceVertices(shape, face).map((vertex) => vertex.position));
}

function dualScaleFactor(sourceCentroid: Vec3, sourcePositions: Vec3[], rawDualPositions: Vec3[]): number {
  const rawDualRadius = averageDistance(sourceCentroid, rawDualPositions);

  if (rawDualRadius < 0.0001) {
    return 1;
  }

  return averageDistance(sourceCentroid, sourcePositions) / rawDualRadius;
}

function averageDistance(origin: Vec3, positions: Vec3[]): number {
  if (!positions.length) {
    return 0;
  }

  return (
    positions.reduce(
      (total, position) =>
        total +
        Math.hypot(position[0] - origin[0], position[1] - origin[1], position[2] - origin[2]),
      0,
    ) / positions.length
  );
}

function averagePosition(positions: Vec3[]): Vec3 {
  if (!positions.length) {
    return [0, 0, 0];
  }

  return scaleVec3(
    positions.reduce<Vec3>((sum, position) => addVec3(sum, position), [0, 0, 0]),
    1 / positions.length,
  );
}

function scaleAround(origin: Vec3, position: Vec3, scale: number): Vec3 {
  return addVec3(origin, scaleVec3(subtractVec3(position, origin), scale));
}

function tangentBasis(normal: Vec3): { u: Vec3; v: Vec3 } {
  const reference: Vec3 = Math.abs(normal[0]) < 0.8 ? [1, 0, 0] : [0, 1, 0];
  const u = normalizeVec3(crossVec3(reference, normal), [0, 0, 1]);
  const v = normalizeVec3(crossVec3(normal, u), [0, 1, 0]);

  return { u, v };
}

function addVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtractVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scaleVec3([x, y, z]: Vec3, scale: number): Vec3 {
  return [x * scale, y * scale, z * scale];
}

function dotVec3(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function crossVec3(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function normalizeVec3(vector: Vec3, fallback: Vec3): Vec3 {
  const length = Math.hypot(vector[0], vector[1], vector[2]);

  if (length < 0.0001) {
    return fallback;
  }

  return scaleVec3(vector, 1 / length);
}

function fallbackDirection(seed: string): Vec3 {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 2654435761);
  }

  const angle = ((hash >>> 0) / 4294967295) * Math.PI * 2;

  return normalizeVec3([Math.cos(angle), Math.sin(angle), 0.5], [1, 0, 0]);
}

import type { Cell, Face, Shape, VertexId } from '../types/geometry';
import { canonicalEdgeKey } from './ids';

export type GenericAmboReadinessStatus =
  | 'enabled'
  | 'disabled: supported logic absent'
  | 'blocked: malformed topology'
  | 'blocked: missing classification'
  | 'unknown';

export interface DerivedCellEdge {
  id: string;
  vertexIds: [VertexId, VertexId];
}

export interface GenericAmboPreview {
  midpointVertexCount: number;
  residueCellCount: number;
  coreSourceFaceFaceCount: number;
  coreSourceVertexFaceCount: number;
  totalCoreFaceCount: number;
  residueTypes: string[];
  coreClassification: string;
}

export interface CellTopologySignature {
  topology: string;
  vertexCount: number;
  edgeCount: number;
  faceCount: number;
  faceSizeHistogram: Record<number, number>;
  vertexDegreeHistogram: Record<number, number>;
  hasOrderedFaces: boolean;
  hasValidDerivedEdges: boolean;
  hasValidVertexIncidentRings: boolean;
  missingVertexIds: string[];
  malformedFaceIds: string[];
  invalidVertexRingIds: string[];
  readinessStatus: GenericAmboReadinessStatus;
  readinessProblems: string[];
  preview: GenericAmboPreview | null;
}

export interface TopologyFrontierGroup {
  topology: string;
  cells: Cell[];
  signatures: CellTopologySignature[];
  representative: CellTopologySignature;
  signaturesVary: boolean;
}

export function deriveCellEdges(shape: Shape, cell: Cell): DerivedCellEdge[] {
  const faces = getCellFaces(shape, cell);
  const edges = new Map<string, DerivedCellEdge>();

  for (const face of faces) {
    if (face.vertexIds.length < 2) {
      continue;
    }

    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = canonicalEdgeKey(a, b);

      if (!edges.has(key)) {
        edges.set(key, {
          id: shape.edges.find((edge) => canonicalEdgeKey(...edge.vertexIds) === key)?.id ?? key,
          vertexIds: [a, b],
        });
      }
    }
  }

  return Array.from(edges.values()).sort((a, b) => a.id.localeCompare(b.id));
}

export function getFaceSizeHistogram(shape: Shape, cell: Cell): Record<number, number> {
  return histogram(getCellFaces(shape, cell).map((face) => face.vertexIds.length));
}

export function getVertexDegreeHistogram(shape: Shape, cell: Cell): Record<number, number> {
  const degrees = getVertexDegrees(shape, cell);

  return histogram(cell.vertexIds.map((vertexId) => degrees.get(vertexId) ?? 0));
}

export function getCellTopologySignature(shape: Shape, cell: Cell): CellTopologySignature {
  const topology = getCellTopologyLabel(cell);
  const cellVertexIds = new Set(cell.vertexIds);
  const faces = getCellFaces(shape, cell);
  const missingFaceIds = cell.faceIds.filter((faceId) => !shape.faces.some((face) => face.id === faceId));
  const missingVertexIds = uniqueStrings([
    ...cell.vertexIds.filter((vertexId) => !shape.vertices[vertexId]),
    ...faces.flatMap((face) =>
      face.vertexIds.filter((vertexId) => !shape.vertices[vertexId] || !cellVertexIds.has(vertexId)),
    ),
  ]);
  const malformedFaceIds = uniqueStrings([
    ...missingFaceIds,
    ...faces
      .filter(
        (face) =>
          face.vertexIds.length < 3 ||
          new Set(face.vertexIds).size !== face.vertexIds.length ||
          face.vertexIds.some((vertexId) => !cellVertexIds.has(vertexId) || !shape.vertices[vertexId]),
      )
      .map((face) => face.id),
  ]);
  const edges = deriveCellEdges(shape, cell);
  const degrees = getVertexDegrees(shape, cell);
  const invalidVertexRingIds = cell.vertexIds.filter((vertexId) => {
    const degree = degrees.get(vertexId) ?? 0;
    const ring = neighborRingAroundVertex(faces, vertexId);

    return degree < 3 || !ring || ring.length !== degree;
  });
  const hasOrderedFaces = faces.length === cell.faceIds.length && faces.length > 0 && !malformedFaceIds.length;
  const hasValidDerivedEdges = hasOrderedFaces && edges.length > 0;
  const hasValidVertexIncidentRings = hasValidDerivedEdges && !invalidVertexRingIds.length;
  const readinessProblems = getReadinessProblems({
    topology,
    hasOrderedFaces,
    hasValidDerivedEdges,
    hasValidVertexIncidentRings,
    missingVertexIds,
    malformedFaceIds,
    invalidVertexRingIds,
  });
  const readinessStatus = getReadinessStatus(topology, readinessProblems);

  return {
    topology,
    vertexCount: cell.vertexIds.length,
    edgeCount: edges.length,
    faceCount: faces.length,
    faceSizeHistogram: getFaceSizeHistogram(shape, cell),
    vertexDegreeHistogram: getVertexDegreeHistogram(shape, cell),
    hasOrderedFaces,
    hasValidDerivedEdges,
    hasValidVertexIncidentRings,
    missingVertexIds,
    malformedFaceIds,
    invalidVertexRingIds,
    readinessStatus,
    readinessProblems,
    preview: hasValidVertexIncidentRings
      ? getGenericAmboPreview(cell, edges.length, faces.length, degrees)
      : null,
  };
}

export function groupCellsByTopology(shape: Shape): TopologyFrontierGroup[] {
  const groups = new Map<string, Cell[]>();

  for (const cell of shape.cells) {
    const topology = getCellTopologyLabel(cell);
    groups.set(topology, [...(groups.get(topology) ?? []), cell]);
  }

  return Array.from(groups.entries())
    .map(([topology, cells]) => {
      const signatures = cells.map((cell) => getCellTopologySignature(shape, cell));
      const representative = signatures[0];

      return {
        topology,
        cells,
        signatures,
        representative,
        signaturesVary: new Set(signatures.map(signatureKey)).size > 1,
      };
    })
    .sort((a, b) => a.topology.localeCompare(b.topology));
}

export function getTopologyFrontierRows(shape: Shape): TopologyFrontierGroup[] {
  return groupCellsByTopology(shape);
}

function getCellFaces(shape: Shape, cell: Cell): Face[] {
  const facesById = new Map(shape.faces.map((face) => [face.id, face]));

  return cell.faceIds
    .map((faceId) => facesById.get(faceId))
    .filter((face): face is Face => Boolean(face));
}

function getCellTopologyLabel(cell: Cell): string {
  if (cell.topology) {
    return cell.topology;
  }

  if (cell.kind === 'seed') {
    return 'seed';
  }

  if (cell.kind === 'core') {
    return 'core';
  }

  if (cell.kind === 'residue') {
    return 'residue';
  }

  return 'unknown';
}

function getVertexDegrees(shape: Shape, cell: Cell): Map<VertexId, number> {
  const degrees = new Map(cell.vertexIds.map((vertexId) => [vertexId, 0]));

  for (const edge of deriveCellEdges(shape, cell)) {
    const [a, b] = edge.vertexIds;

    degrees.set(a, (degrees.get(a) ?? 0) + 1);
    degrees.set(b, (degrees.get(b) ?? 0) + 1);
  }

  return degrees;
}

function neighborRingAroundVertex(sourceFaces: Face[], center: VertexId): VertexId[] | null {
  const adjacency = new Map<VertexId, Set<VertexId>>();

  for (const face of sourceFaces) {
    const centerIndex = face.vertexIds.indexOf(center);

    if (centerIndex === -1 || face.vertexIds.length < 3) {
      continue;
    }

    const previous = face.vertexIds[(centerIndex - 1 + face.vertexIds.length) % face.vertexIds.length];
    const next = face.vertexIds[(centerIndex + 1) % face.vertexIds.length];

    connectRingNeighbors(adjacency, previous, next);
  }

  if (adjacency.size < 3 || Array.from(adjacency.values()).some((neighbors) => neighbors.size !== 2)) {
    return null;
  }

  const ring = walkNeighborRing(adjacency);

  return ring.length === adjacency.size ? ring : null;
}

function connectRingNeighbors(
  adjacency: Map<VertexId, Set<VertexId>>,
  a: VertexId,
  b: VertexId,
): void {
  if (!adjacency.has(a)) {
    adjacency.set(a, new Set());
  }

  if (!adjacency.has(b)) {
    adjacency.set(b, new Set());
  }

  adjacency.get(a)?.add(b);
  adjacency.get(b)?.add(a);
}

function walkNeighborRing(adjacency: Map<VertexId, Set<VertexId>>): VertexId[] {
  const start = adjacency.keys().next().value;

  if (!start) {
    return [];
  }

  const ordered: VertexId[] = [start];
  const visited = new Set<VertexId>([start]);
  let previous: VertexId | null = null;
  let current = start;

  while (ordered.length < adjacency.size) {
    const next = Array.from(adjacency.get(current) ?? []).find(
      (neighbor) => neighbor !== previous && !visited.has(neighbor),
    );

    if (!next) {
      break;
    }

    ordered.push(next);
    visited.add(next);
    previous = current;
    current = next;
  }

  return ordered;
}

function getReadinessProblems({
  topology,
  hasOrderedFaces,
  hasValidDerivedEdges,
  hasValidVertexIncidentRings,
  missingVertexIds,
  malformedFaceIds,
  invalidVertexRingIds,
}: {
  topology: string;
  hasOrderedFaces: boolean;
  hasValidDerivedEdges: boolean;
  hasValidVertexIncidentRings: boolean;
  missingVertexIds: string[];
  malformedFaceIds: string[];
  invalidVertexRingIds: string[];
}): string[] {
  const problems: string[] = [];

  if (topology === 'unknown') {
    problems.push('missing topology classification');
  }

  if (missingVertexIds.length) {
    problems.push(`${missingVertexIds.length} missing vertex references`);
  }

  if (malformedFaceIds.length || !hasOrderedFaces) {
    problems.push('ordered face cycles are missing or malformed');
  }

  if (!hasValidDerivedEdges) {
    problems.push('valid derived edges are unavailable');
  }

  if (invalidVertexRingIds.length || !hasValidVertexIncidentRings) {
    problems.push('vertex incident rings are incomplete or invalid');
  }

  return problems;
}

function getReadinessStatus(
  topology: string,
  problems: string[],
): GenericAmboReadinessStatus {
  if (problems.some((problem) => problem.includes('missing topology classification'))) {
    return 'blocked: missing classification';
  }

  if (problems.length) {
    return 'blocked: malformed topology';
  }

  if (isCurrentlyEnabledTopology(topology)) {
    return 'enabled';
  }

  return 'disabled: supported logic absent';
}

function isCurrentlyEnabledTopology(topology: string): boolean {
  return [
    'tetrahedron',
    'octahedron',
    'cube',
    'cuboctahedron',
    'square-pyramid',
    'rectified-square-pyramid',
    'rectified-square-pyramid-ambo-core',
  ].includes(topology);
}

function getGenericAmboPreview(
  cell: Cell,
  edgeCount: number,
  faceCount: number,
  degrees: Map<VertexId, number>,
): GenericAmboPreview {
  const residueTypes = Array.from(
    new Set(
      cell.vertexIds.map((vertexId) => residueTypeForDegree(degrees.get(vertexId) ?? 0)),
    ),
  ).sort();

  return {
    midpointVertexCount: edgeCount,
    residueCellCount: cell.vertexIds.length,
    coreSourceFaceFaceCount: faceCount,
    coreSourceVertexFaceCount: cell.vertexIds.length,
    totalCoreFaceCount: faceCount + cell.vertexIds.length,
    residueTypes,
    coreClassification: getExpectedCoreClassification(cell.topology ?? 'unknown'),
  };
}

function getExpectedCoreClassification(sourceTopology: string): string {
  if (sourceTopology === 'tetrahedron') {
    return 'core topology: octahedron';
  }

  if (sourceTopology === 'octahedron' || sourceTopology === 'cube') {
    return 'core topology: cuboctahedron';
  }

  if (sourceTopology === 'cuboctahedron') {
    return 'core topology: rhombicuboctahedron';
  }

  if (sourceTopology === 'square-pyramid') {
    return 'core topology: rectified-square-pyramid';
  }

  if (sourceTopology === 'rectified-square-pyramid') {
    return 'core topology: rectified-square-pyramid-ambo-core';
  }

  if (sourceTopology === 'rectified-square-pyramid-ambo-core') {
    return 'core topology: rectified-square-pyramid-ambo-core-ambo-core';
  }

  return 'core topology classification missing';
}

function residueTypeForDegree(degree: number): string {
  if (degree === 3) {
    return 'degree 3 -> tetrahedron-like residue';
  }

  if (degree === 4) {
    return 'degree 4 -> square-pyramid-like residue';
  }

  if (degree > 4) {
    return `degree ${degree} -> ${degree}-gonal pyramid-like residue`;
  }

  return `degree ${degree} -> insufficient residue ring`;
}

function histogram(values: number[]): Record<number, number> {
  return values.reduce<Record<number, number>>((counts, value) => {
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values)).sort();
}

function signatureKey(signature: CellTopologySignature): string {
  return [
    signature.vertexCount,
    signature.edgeCount,
    signature.faceCount,
    formatHistogram(signature.faceSizeHistogram),
    formatHistogram(signature.vertexDegreeHistogram),
    signature.readinessStatus,
  ].join('|');
}

function formatHistogram(histogramValue: Record<number, number>): string {
  return Object.entries(histogramValue)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([size, count]) => `${size}:${count}`)
    .join(',');
}

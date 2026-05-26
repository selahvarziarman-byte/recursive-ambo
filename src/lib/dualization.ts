import type {
  Cell,
  Edge,
  Face,
  PacketLineage,
  Shape,
  Vec3,
  Vertex,
  VertexDataPacket,
  VertexId,
} from '../types/geometry';
import {
  canonicalEdgeKey,
  makeCellId,
  makeDualVertexId,
  makeFaceId,
  makeGenerationId,
  makeShapeId,
} from './ids';
import {
  deriveCellLineage,
  deriveFaceLineage,
  packetSourceRef,
} from './packets';
import { createDefaultVertexData, deriveEdges, getCellFaces } from './shape';

interface DualizationSourceTopology {
  cell: Cell;
  vertexIds: VertexId[];
  faces: Face[];
  edges: Edge[];
  edgeByKey: Map<string, Edge>;
  incidentFacesByEdgeKey: Map<string, Face[]>;
  incidentFacesByVertex: Map<VertexId, Face[]>;
  cellCentroid: Vec3;
}

interface DualVertexEntry {
  sourceFace: Face;
  vertex: Vertex;
}

interface DualFaceEntry {
  sourceVertexId: VertexId;
  face: Face;
  sourceFaceIds: string[];
}

interface DualEdgeMetadata {
  sourceEdge: Edge;
  sourceCellId: string;
  lineage: PacketLineage;
}

const EPSILON = 0.000001;

export function canApplyDualization(shape: Shape, targetCellId?: string | null): boolean {
  const cell = getTargetCell(shape, targetCellId);

  if (!cell) {
    return false;
  }

  try {
    const topology = buildPyritohedralIcosahedronSourceTopology(shape, cell);

    if (!topology) {
      return false;
    }

    buildDualFaceEntries(shape, 'dualization:validation', topology.cell.id, topology, new Map());
    return true;
  } catch {
    return false;
  }
}

export function applyDualization(parent: Shape, targetCellId?: string | null): Shape {
  const sourceCell = getTargetCell(parent, targetCellId);

  if (!sourceCell) {
    throw new Error('No cell available for dualization.');
  }

  const topology = buildPyritohedralIcosahedronSourceTopology(parent, sourceCell);

  if (!topology) {
    throw new Error(
      'Dualization currently supports structurally valid pyritohedral-icosahedron core cells only.',
    );
  }

  return applyPyritohedralIcosahedronDualization(parent, topology);
}

function applyPyritohedralIcosahedronDualization(
  parent: Shape,
  topology: DualizationSourceTopology,
): Shape {
  const { cell: sourceCell } = topology;
  const generationDepth = sourceCell.generationDepth + 1;
  const shapeGenerationDepth = Math.max(parent.genealogy.generationDepth, generationDepth);
  const shapeId = makeShapeId(parent.id, 'dualization', shapeGenerationDepth);
  const parentCellId = makeCellId(shapeId, 'parent', sourceCell.id, sourceCell.vertexIds);
  const dualVertexEntries = createDualVertices(parent, shapeId, sourceCell.id, topology.faces);
  const dualVertexByFaceId = new Map(
    dualVertexEntries.map((entry) => [entry.sourceFace.id, entry]),
  );
  const dualFaceEntries = buildDualFaceEntries(parent, shapeId, sourceCell.id, topology, dualVertexByFaceId);
  const resultFaces = dualFaceEntries.map((entry) => entry.face);
  const dualVertexIds = dualVertexEntries.map((entry) => entry.vertex.id);
  const resultCellId = makeCellId(shapeId, 'core', sourceCell.id, dualVertexIds);
  const sourceEdgeIds = topology.edges.map((edge) => edge.id);
  const parentFaces = createParentCellFaces(shapeId, parentCellId, topology.faces);
  const parentCell: Cell = {
    id: parentCellId,
    kind: 'parent',
    topology: sourceCell.topology,
    generationDepth: sourceCell.generationDepth,
    parentCellId: sourceCell.parentCellId,
    sourceOperation: sourceCell.sourceOperation,
    vertexIds: sourceCell.vertexIds,
    faceIds: parentFaces.map((face) => face.id),
    sourceVertexIds: sourceCell.vertexIds,
    sourceEdgeIds,
    lineage: deriveCellLineage(
      [packetSourceRef('cell', sourceCell.id, 'source-cell')],
      shapeId,
      'preserved',
    ),
  };
  const resultCell: Cell = {
    id: resultCellId,
    kind: 'core',
    topology: 'dodecahedron',
    generationDepth,
    parentCellId,
    sourceOperation: 'dualization',
    vertexIds: dualVertexIds,
    faceIds: resultFaces.map((face) => face.id),
    sourceVertexIds: sourceCell.vertexIds,
    sourceEdgeIds,
    lineage: deriveCellLineage(
      [packetSourceRef('cell', sourceCell.id, 'source-cell')],
      shapeId,
      'derived-from-cell',
    ),
  };
  const replacedFaceIds = new Set(sourceCell.faceIds);
  const faces = [
    ...parent.faces.filter((face) => !replacedFaceIds.has(face.id)),
    ...parentFaces,
    ...resultFaces,
  ];
  const dualEdgeMetadataByKey = buildDualEdgeMetadata(
    shapeId,
    sourceCell.id,
    topology,
    dualVertexByFaceId,
    resultFaces,
  );
  const edges = deriveDualizationEdges(faces, shapeId, dualEdgeMetadataByKey);
  const vertices = {
    ...cloneParentVertices(parent.vertices),
    ...Object.fromEntries(dualVertexEntries.map((entry) => [entry.vertex.id, entry.vertex])),
  };
  const cells = [
    ...parent.cells.filter((cell) => cell.id !== sourceCell.id),
    parentCell,
    resultCell,
  ];
  const createdAt = new Date().toISOString();

  return {
    id: shapeId,
    name: `Dualization ${parent.name}`,
    seedKey: parent.seedKey,
    vertices,
    edges,
    faces,
    cells,
    generations: [
      ...parent.generations,
      {
        id: makeGenerationId(shapeId, 'dualization', generationDepth),
        depth: generationDepth,
        sourceOperation: 'dualization',
        parentShapeId: parent.id,
        parentCellIds: [parentCellId],
        createdCellIds: [resultCell.id],
        createdVertexIds: dualVertexIds,
        createdAt,
      },
    ],
    genealogy: {
      parentShapeId: parent.id,
      operation: 'dualization',
      generationDepth: shapeGenerationDepth,
      sourceVertexIds: sourceCell.vertexIds,
      createdVertexIds: dualVertexIds,
      createdAt,
    },
  };
}

function getTargetCell(shape: Shape, targetCellId?: string | null): Cell | null {
  if (!targetCellId) {
    return null;
  }

  return shape.cells.find((cell) => cell.id === targetCellId) ?? null;
}

function buildPyritohedralIcosahedronSourceTopology(
  shape: Shape,
  cell: Cell,
): DualizationSourceTopology | null {
  if (cell.kind !== 'core' || cell.topology !== 'pyritohedral-icosahedron') {
    return null;
  }

  const faces = getCellFaces(shape, cell);
  const cellVertexIds = new Set(cell.vertexIds);

  if (
    cell.vertexIds.length !== 12 ||
    faces.length !== 20 ||
    faces.length !== cell.faceIds.length ||
    faces.some(
      (face) =>
        face.vertexIds.length !== 3 ||
        new Set(face.vertexIds).size !== face.vertexIds.length ||
        face.vertexIds.some((vertexId) => !cellVertexIds.has(vertexId) || !shape.vertices[vertexId]),
    )
  ) {
    return null;
  }

  const edgeByKey = getRequiredCellEdgeMap(shape, faces);

  if (!edgeByKey || edgeByKey.size !== 30) {
    return null;
  }

  const edges = Array.from(edgeByKey.values());
  const vertexDegrees = degreeSequence(cell.vertexIds, edges);
  const incidentFacesByEdgeKey = getIncidentFacesByEdgeKey(faces);
  const incidentFacesByVertex = getIncidentFacesByVertex(cell.vertexIds, faces);

  if (
    countValues(vertexDegrees, 5) !== 12 ||
    Array.from(incidentFacesByEdgeKey.values()).some((incidentFaces) => incidentFaces.length !== 2) ||
    cell.vertexIds.some((vertexId) => (incidentFacesByVertex.get(vertexId)?.length ?? 0) !== 5)
  ) {
    return null;
  }

  return {
    cell,
    vertexIds: [...cell.vertexIds],
    faces: [...faces].sort((a, b) => a.id.localeCompare(b.id)),
    edges,
    edgeByKey,
    incidentFacesByEdgeKey,
    incidentFacesByVertex,
    cellCentroid: averagePosition(cell.vertexIds.map((vertexId) => shape.vertices[vertexId].position)),
  };
}

function createDualVertices(
  shape: Shape,
  shapeId: string,
  sourceCellId: string,
  sourceFaces: Face[],
): DualVertexEntry[] {
  return [...sourceFaces]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((sourceFace, index) => {
      const dualVertexId = makeDualVertexId(shapeId, sourceFace.id);
      const lineage = deriveFaceLineage(
        [
          packetSourceRef('face', sourceFace.id, 'source-face'),
          packetSourceRef('cell', sourceCellId, 'source-cell'),
        ],
        shapeId,
        'derived-from-face',
      );

      return {
        sourceFace,
        vertex: {
          id: dualVertexId,
          position: faceCentroid(shape, sourceFace),
          data: createDefaultVertexData(`D${index + 1}`, '#c084fc', {}, lineage),
          createdBy: {
            shapeId,
            operation: 'dualization',
            sourceVertexIds: [...sourceFace.vertexIds],
            sourceFaceId: sourceFace.id,
            sourceCellId,
          },
        },
      };
    });
}

function buildDualFaceEntries(
  shape: Shape,
  shapeId: string,
  sourceCellId: string,
  topology: DualizationSourceTopology,
  dualVertexByFaceId: Map<string, DualVertexEntry>,
): DualFaceEntry[] {
  return [...topology.vertexIds].sort().map((sourceVertexId) => {
    const sourceFaceIds = orderIncidentSourceFaces(shape, topology, sourceVertexId, dualVertexByFaceId);
    const vertexIds = sourceFaceIds.map((sourceFaceId) => {
      const entry = dualVertexByFaceId.get(sourceFaceId);

      if (!entry) {
        return makeDualVertexId(shapeId, sourceFaceId);
      }

      return entry.vertex.id;
    });
    const face: Face = {
      id: makeFaceId(shapeId, 'dual-face-from-vertex', sourceVertexId, vertexIds),
      vertexIds,
      role: 'dual-face-from-vertex',
      sourceCellId,
      sourceVertexId,
      lineage: deriveFaceLineage(
        [
          packetSourceRef('vertex', sourceVertexId, 'source-vertex'),
          packetSourceRef('cell', sourceCellId, 'source-cell'),
        ],
        shapeId,
        'derived-from-vertex',
      ),
    };

    return {
      sourceVertexId,
      face,
      sourceFaceIds,
    };
  });
}

function orderIncidentSourceFaces(
  shape: Shape,
  topology: DualizationSourceTopology,
  sourceVertexId: VertexId,
  dualVertexByFaceId: Map<string, DualVertexEntry>,
): string[] {
  const incidentFaces = [...(topology.incidentFacesByVertex.get(sourceVertexId) ?? [])].sort((a, b) =>
    a.id.localeCompare(b.id),
  );

  if (incidentFaces.length !== 5) {
    throw new Error(`Dualization expected five incident faces around source vertex ${sourceVertexId}.`);
  }

  const adjacency = buildIncidentFaceCycleAdjacency(topology, sourceVertexId, incidentFaces);
  const startFaceId = incidentFaces[0].id;
  const startNeighbors = [...(adjacency.get(startFaceId) ?? [])].sort();

  if (startNeighbors.length !== 2) {
    throw new Error(`Dualization found malformed local face cycle around source vertex ${sourceVertexId}.`);
  }

  const candidates = startNeighbors
    .map((neighborFaceId) => walkFaceCycle(adjacency, startFaceId, neighborFaceId))
    .filter((candidate): candidate is string[] => Boolean(candidate));

  if (candidates.length !== 2) {
    throw new Error(`Dualization could not walk both local face-cycle directions at ${sourceVertexId}.`);
  }

  return chooseOutwardFaceOrder(shape, topology, sourceVertexId, candidates, dualVertexByFaceId);
}

function buildIncidentFaceCycleAdjacency(
  topology: DualizationSourceTopology,
  sourceVertexId: VertexId,
  incidentFaces: Face[],
): Map<string, Set<string>> {
  const incidentFaceIds = new Set(incidentFaces.map((face) => face.id));
  const adjacency = new Map(incidentFaces.map((face) => [face.id, new Set<string>()]));

  for (const edge of topology.edges) {
    if (!edge.vertexIds.includes(sourceVertexId)) {
      continue;
    }

    const incidentFacesForEdge = topology.incidentFacesByEdgeKey.get(canonicalEdgeKey(...edge.vertexIds)) ?? [];
    const localFaces = incidentFacesForEdge.filter((face) => incidentFaceIds.has(face.id));

    if (localFaces.length !== 2) {
      throw new Error(`Dualization found malformed source edge fan at vertex ${sourceVertexId}.`);
    }

    adjacency.get(localFaces[0].id)?.add(localFaces[1].id);
    adjacency.get(localFaces[1].id)?.add(localFaces[0].id);
  }

  if (Array.from(adjacency.values()).some((neighbors) => neighbors.size !== 2)) {
    throw new Error(`Dualization local face adjacency is not a five-cycle at ${sourceVertexId}.`);
  }

  const connected = new Set<string>();
  const stack = [incidentFaces[0].id];

  while (stack.length) {
    const current = stack.pop();

    if (!current || connected.has(current)) {
      continue;
    }

    connected.add(current);
    stack.push(...(adjacency.get(current) ?? []));
  }

  if (connected.size !== incidentFaces.length) {
    throw new Error(`Dualization local face cycle is disconnected at ${sourceVertexId}.`);
  }

  return adjacency;
}

function walkFaceCycle(
  adjacency: Map<string, Set<string>>,
  startFaceId: string,
  firstNeighborFaceId: string,
): string[] | null {
  const order = [startFaceId];
  let previous = startFaceId;
  let current = firstNeighborFaceId;

  while (order.length < adjacency.size) {
    if (order.includes(current)) {
      return null;
    }

    order.push(current);

    if (order.length === adjacency.size) {
      return adjacency.get(current)?.has(startFaceId) ? order : null;
    }

    const next = [...(adjacency.get(current) ?? [])]
      .sort()
      .find((neighborFaceId) => neighborFaceId !== previous);

    if (!next) {
      return null;
    }

    previous = current;
    current = next;
  }

  return order;
}

function chooseOutwardFaceOrder(
  shape: Shape,
  topology: DualizationSourceTopology,
  sourceVertexId: VertexId,
  candidates: string[][],
  dualVertexByFaceId: Map<string, DualVertexEntry>,
): string[] {
  const sourceVertex = shape.vertices[sourceVertexId];
  const outward = normalizeVec3(subtractVec3(sourceVertex.position, topology.cellCentroid));

  if (!outward) {
    throw new Error(`Dualization could not determine outward direction at ${sourceVertexId}.`);
  }

  const scoredCandidates = candidates.map((sourceFaceIds) => {
    const positions = sourceFaceIds.map((sourceFaceId) => {
      const entry = dualVertexByFaceId.get(sourceFaceId);
      const sourceFace = topology.faces.find((face) => face.id === sourceFaceId);

      if (entry) {
        return entry.vertex.position;
      }

      if (!sourceFace) {
        throw new Error(`Dualization could not find source face ${sourceFaceId}.`);
      }

      return faceCentroid(shape, sourceFace);
    });
    const normal = polygonNormal(positions);

    if (!normal) {
      throw new Error(`Dualization produced a near-zero dual face normal at ${sourceVertexId}.`);
    }

    return {
      sourceFaceIds,
      dot: dotVec3(normal, outward),
    };
  });
  const best = scoredCandidates.sort((a, b) => b.dot - a.dot)[0];

  if (!best || best.dot <= EPSILON) {
    throw new Error(`Dualization could not orient dual face outward at ${sourceVertexId}.`);
  }

  return rotateCycleToLowestId(best.sourceFaceIds);
}

function createParentCellFaces(
  shapeId: string,
  parentCellId: string,
  sourceFaces: Face[],
): Face[] {
  return sourceFaces.map((face) => ({
    id: makeFaceId(shapeId, 'parent-cell-face', face.id, face.vertexIds),
    vertexIds: face.vertexIds,
    role: 'parent-cell-face',
    sourceCellId: parentCellId,
    sourceFaceId: face.id,
    lineage: deriveFaceLineage(
      [
        packetSourceRef('face', face.id, 'source-face'),
        packetSourceRef('cell', parentCellId, 'parent-cell'),
      ],
      shapeId,
      'preserved',
    ),
  }));
}

function buildDualEdgeMetadata(
  shapeId: string,
  sourceCellId: string,
  topology: DualizationSourceTopology,
  dualVertexByFaceId: Map<string, DualVertexEntry>,
  resultFaces: Face[],
): Map<string, DualEdgeMetadata> {
  const sourceFaceByDualVertexId = new Map(
    Array.from(dualVertexByFaceId.values()).map((entry) => [entry.vertex.id, entry.sourceFace]),
  );
  const metadataByKey = new Map<string, DualEdgeMetadata>();

  for (const face of resultFaces) {
    const vertexIds = face.vertexIds;

    for (let index = 0; index < vertexIds.length; index += 1) {
      const a = vertexIds[index];
      const b = vertexIds[(index + 1) % vertexIds.length];
      const key = canonicalEdgeKey(a, b);

      if (metadataByKey.has(key)) {
        continue;
      }

      const sourceFaceA = sourceFaceByDualVertexId.get(a);
      const sourceFaceB = sourceFaceByDualVertexId.get(b);

      if (!sourceFaceA || !sourceFaceB) {
        throw new Error('Dualization could not resolve source faces for a dual edge.');
      }

      const sourceEdge = getSharedSourceEdge(topology, sourceFaceA, sourceFaceB);

      metadataByKey.set(key, {
        sourceEdge,
        sourceCellId,
        lineage: deriveFaceLineage(
          [
            packetSourceRef('edge', sourceEdge.id, 'source-edge'),
            packetSourceRef('cell', sourceCellId, 'source-cell'),
          ],
          shapeId,
          'derived-from-edge',
        ),
      });
    }
  }

  if (metadataByKey.size !== topology.edges.length) {
    throw new Error('Dualization did not produce one dual edge for each source edge.');
  }

  const usedSourceEdgeIds = new Set(Array.from(metadataByKey.values()).map((metadata) => metadata.sourceEdge.id));

  if (usedSourceEdgeIds.size !== topology.edges.length) {
    throw new Error('Dualization source edge correspondence is not one-to-one.');
  }

  return metadataByKey;
}

function deriveDualizationEdges(
  faces: Face[],
  shapeId: string,
  dualEdgeMetadataByKey: Map<string, DualEdgeMetadata>,
): Edge[] {
  return deriveEdges(faces, shapeId).map((edge) => {
    const metadata = dualEdgeMetadataByKey.get(canonicalEdgeKey(...edge.vertexIds));

    if (!metadata) {
      return edge;
    }

    return {
      ...edge,
      sourceEdgeId: metadata.sourceEdge.id,
      sourceCellId: metadata.sourceCellId,
      lineage: metadata.lineage,
    };
  });
}

function getSharedSourceEdge(
  topology: DualizationSourceTopology,
  sourceFaceA: Face,
  sourceFaceB: Face,
): Edge {
  const sharedVertexIds = sourceFaceA.vertexIds.filter((vertexId) => sourceFaceB.vertexIds.includes(vertexId));

  if (sharedVertexIds.length !== 2) {
    throw new Error(`Dualization source faces ${sourceFaceA.id} and ${sourceFaceB.id} do not share one edge.`);
  }

  const sourceEdge = topology.edgeByKey.get(canonicalEdgeKey(sharedVertexIds[0], sharedVertexIds[1]));

  if (!sourceEdge) {
    throw new Error(`Dualization could not resolve source edge between ${sourceFaceA.id} and ${sourceFaceB.id}.`);
  }

  return sourceEdge;
}

function getRequiredCellEdgeMap(shape: Shape, faces: Face[]): Map<string, Edge> | null {
  const shapeEdgesByKey = new Map(
    shape.edges.map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]),
  );
  const edges = new Map<string, Edge>();

  for (const face of faces) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = canonicalEdgeKey(a, b);
      const edge = shapeEdgesByKey.get(key);

      if (!edge) {
        return null;
      }

      edges.set(key, edge);
    }
  }

  return edges;
}

function getIncidentFacesByEdgeKey(faces: Face[]): Map<string, Face[]> {
  const incidentFacesByEdgeKey = new Map<string, Face[]>();

  for (const face of faces) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = canonicalEdgeKey(a, b);

      incidentFacesByEdgeKey.set(key, [...(incidentFacesByEdgeKey.get(key) ?? []), face]);
    }
  }

  return incidentFacesByEdgeKey;
}

function getIncidentFacesByVertex(vertexIds: VertexId[], faces: Face[]): Map<VertexId, Face[]> {
  return new Map(
    vertexIds.map((vertexId) => [
      vertexId,
      faces.filter((face) => face.vertexIds.includes(vertexId)),
    ]),
  );
}

function degreeSequence(vertexIds: VertexId[], edges: Edge[]): number[] {
  const degrees = new Map(vertexIds.map((vertexId) => [vertexId, 0]));

  for (const edge of edges) {
    const [a, b] = edge.vertexIds;
    degrees.set(a, (degrees.get(a) ?? 0) + 1);
    degrees.set(b, (degrees.get(b) ?? 0) + 1);
  }

  return vertexIds.map((vertexId) => degrees.get(vertexId) ?? 0);
}

function countValues(values: number[], targetValue: number): number {
  return values.filter((value) => value === targetValue).length;
}

function cloneParentVertices(vertices: Record<string, Vertex>): Record<string, Vertex> {
  return Object.fromEntries(
    Object.entries(vertices).map(([id, vertex]) => [
      id,
      {
        ...vertex,
        data: cloneVertexData(vertex.data),
      },
    ]),
  );
}

function cloneVertexData(data: VertexDataPacket): VertexDataPacket {
  return {
    ...data,
    tags: [...data.tags],
    custom: { ...data.custom },
  };
}

function faceCentroid(shape: Shape, face: Face): Vec3 {
  return averagePosition(face.vertexIds.map((vertexId) => shape.vertices[vertexId].position));
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

function polygonNormal(positions: Vec3[]): Vec3 | null {
  const normal = positions.reduce<Vec3>(
    (sum, current, index) => {
      const next = positions[(index + 1) % positions.length];

      return [
        sum[0] + (current[1] - next[1]) * (current[2] + next[2]),
        sum[1] + (current[2] - next[2]) * (current[0] + next[0]),
        sum[2] + (current[0] - next[0]) * (current[1] + next[1]),
      ];
    },
    [0, 0, 0],
  );

  return normalizeVec3(normal);
}

function rotateCycleToLowestId(ids: string[]): string[] {
  const lowestId = [...ids].sort()[0];
  const index = ids.indexOf(lowestId);

  return [...ids.slice(index), ...ids.slice(0, index)];
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

function normalizeVec3(vector: Vec3): Vec3 | null {
  const length = Math.hypot(vector[0], vector[1], vector[2]);

  return length <= EPSILON ? null : scaleVec3(vector, 1 / length);
}

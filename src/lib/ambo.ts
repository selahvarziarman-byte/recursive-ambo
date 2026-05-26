import type {
  Cell,
  CellTopology,
  Edge,
  Face,
  PacketLineage,
  Shape,
  Vertex,
  VertexDataPacket,
  VertexId,
} from '../types/geometry';
import {
  canonicalEdgeKey,
  makeCellId,
  makeFaceId,
  makeGenerationId,
  makeMidpointVertexId,
  makeShapeId,
} from './ids';
import {
  deriveCellLineage,
  deriveCompositePacket,
  deriveFaceLineage,
  deriveFromParentCell,
  deriveFromSourceFace,
  deriveFromSourceVertex,
  packetSourceRef,
} from './packets';
import { createDefaultVertexData, deriveEdges, getCellFaces, midpoint } from './shape';

type SupportedAmboTopology =
  | 'tetrahedron'
  | 'octahedron'
  | 'cube'
  | 'cuboctahedron'
  | 'square-pyramid'
  | 'rectified-square-pyramid'
  | 'rectified-square-pyramid-ambo-core';

interface CellWithFaces extends Cell {
  faces: Face[];
}

interface SourceTopology {
  cell: Cell;
  sourceTopology: SupportedAmboTopology;
  vertexIds: VertexId[];
  faces: Face[];
  edges: Edge[];
  edgeByKey: Map<string, Edge>;
  orderedNeighborsByVertex: Map<VertexId, VertexId[]>;
}

export function canApplyAmboDissection(shape: Shape, targetCellId?: string | null): boolean {
  const cell = getTargetCell(shape, targetCellId);

  return Boolean(cell && buildSupportedSourceTopology(shape, cell));
}

export function applyAmboDissection(parent: Shape, targetCellId?: string | null): Shape {
  const sourceCell = getTargetCell(parent, targetCellId);

  if (!sourceCell) {
    throw new Error('No cell available for ambo dissection.');
  }

  const topology = buildSupportedSourceTopology(parent, sourceCell);

  if (!topology) {
    throw new Error(
      'Ambo dissection currently supports tetrahedron, octahedron, cube, cuboctahedron, square-pyramid, rectified-square-pyramid, and rectified-square-pyramid-ambo-core cells.',
    );
  }

  return applyGenericAmboDissection(parent, topology);
}

function applyGenericAmboDissection(parent: Shape, topology: SourceTopology): Shape {
  const { cell: sourceCell } = topology;
  const generationDepth = sourceCell.generationDepth + 1;
  const shapeGenerationDepth = Math.max(parent.genealogy.generationDepth, generationDepth);
  const shapeId = makeShapeId(parent.id, 'ambo-dissection', shapeGenerationDepth);
  const parentCellId = makeCellId(shapeId, 'parent', sourceCell.id, sourceCell.vertexIds);
  const midpointIds = new Map<string, VertexId>();
  const vertices = cloneParentVertices(parent.vertices);

  for (const edge of topology.edges) {
    const [a, b] = edge.vertexIds;
    const midpointId = makeMidpointVertexId(sourceCell.id, a, b);
    const sourceA = parent.vertices[a];
    const sourceB = parent.vertices[b];
    const midpointPacket = deriveCompositePacket(
      [
        packetSourceRef('edge', edge.id, 'source-edge'),
        packetSourceRef('vertex', a, 'endpoint'),
        packetSourceRef('vertex', b, 'endpoint'),
      ],
      shapeId,
      'derived-from-edge',
    );

    midpointIds.set(canonicalEdgeKey(a, b), midpointId);
    vertices[midpointId] = {
      id: midpointId,
      position: midpoint(sourceA.position, sourceB.position),
      data: createDefaultVertexData(
        `${sourceA.data.label}${sourceB.data.label}`,
        '#eab308',
        {},
        midpointPacket.lineage,
      ),
      createdBy: {
        shapeId,
        operation: 'ambo-dissection',
        sourceVertexIds: [a, b],
        sourceEdgeId: edge.id,
      },
    };
  }

  const parentFaces = createParentCellFaces(shapeId, parentCellId, topology.faces);
  const sourceEdgeIds = topology.edges.map((edge) => edge.id);
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

  const coreCell = createCoreCell(topology, shapeId, generationDepth, parentCellId, midpointIds);
  const residueCells = topology.vertexIds.map((sourceVertexId) =>
    createResidueCell(topology, shapeId, generationDepth, parentCellId, sourceVertexId, midpointIds),
  );
  const generatedCells = [coreCell, ...residueCells];
  const generatedFaces = generatedCells.flatMap((cellWithFaces) => cellWithFaces.faces);
  const replacedFaceIds = new Set(sourceCell.faceIds);
  const cells = [
    ...parent.cells.filter((cell) => cell.id !== sourceCell.id),
    parentCell,
    ...generatedCells.map(({ faces: _faces, ...cell }) => cell),
  ];
  const faces = [
    ...parent.faces.filter((face) => !replacedFaceIds.has(face.id)),
    ...parentFaces,
    ...generatedFaces,
  ];
  const createdVertexIds = Array.from(midpointIds.values());
  const createdAt = new Date().toISOString();

  return {
    id: shapeId,
    name: `Ambo Dissection ${parent.name}`,
    seedKey: parent.seedKey,
    vertices,
    edges: deriveEdges(faces, shapeId),
    faces,
    cells,
    generations: [
      ...parent.generations,
      {
        id: makeGenerationId(shapeId, 'ambo-dissection', generationDepth),
        depth: generationDepth,
        sourceOperation: 'ambo-dissection',
        parentShapeId: parent.id,
        parentCellIds: [parentCellId],
        createdCellIds: generatedCells.map((cell) => cell.id),
        createdVertexIds,
        createdAt,
      },
    ],
    genealogy: {
      parentShapeId: parent.id,
      operation: 'ambo-dissection',
      generationDepth: shapeGenerationDepth,
      sourceVertexIds: sourceCell.vertexIds,
      createdVertexIds,
      createdAt,
    },
  };
}

function getTargetCell(shape: Shape, targetCellId?: string | null): Cell | null {
  if (targetCellId) {
    return shape.cells.find((cell) => cell.id === targetCellId) ?? null;
  }

  return shape.cells.find((cell) => cell.kind === 'seed') ?? null;
}

function buildSupportedSourceTopology(shape: Shape, cell: Cell): SourceTopology | null {
  const sourceTopology = classifySupportedSourceTopology(shape, cell);

  if (!sourceTopology) {
    return null;
  }

  const topology = buildSourceTopology(shape, cell, sourceTopology);

  if (!topology || !hasValidVertexRings(topology)) {
    return null;
  }

  return topology;
}

function classifySupportedSourceTopology(
  shape: Shape,
  cell: Cell,
): SupportedAmboTopology | null {
  const faces = getCellFaces(shape, cell);
  const edgeMap = getCellEdgeMap(shape, faces);
  const edgeCount = edgeMap.size;
  const faceSizes = faces.map((face) => face.vertexIds.length);
  const vertexDegrees = degreeSequence(cell.vertexIds, Array.from(edgeMap.values()));
  const isTetrahedronGeometry =
    cell.vertexIds.length === 4 &&
    faces.length === 4 &&
    edgeCount === 6 &&
    faceSizes.every((size) => size === 3);
  const isOctahedronGeometry =
    cell.vertexIds.length === 6 &&
    faces.length === 8 &&
    edgeCount === 12 &&
    faceSizes.every((size) => size === 3);
  const isCubeGeometry =
    cell.vertexIds.length === 8 &&
    faces.length === 6 &&
    edgeCount === 12 &&
    faceSizes.every((size) => size === 4);
  const isCuboctahedronGeometry =
    cell.vertexIds.length === 12 &&
    faces.length === 14 &&
    edgeCount === 24 &&
    countFaceSizes(faceSizes, 3) === 8 &&
    countFaceSizes(faceSizes, 4) === 6;
  const isSquarePyramidGeometry =
    cell.vertexIds.length === 5 &&
    faces.length === 5 &&
    edgeCount === 8 &&
    countFaceSizes(faceSizes, 3) === 4 &&
    countFaceSizes(faceSizes, 4) === 1;
  const isRectifiedSquarePyramidGeometry =
    cell.vertexIds.length === 8 &&
    faces.length === 10 &&
    edgeCount === 16 &&
    countFaceSizes(faceSizes, 3) === 8 &&
    countFaceSizes(faceSizes, 4) === 2 &&
    countFaceSizes(vertexDegrees, 4) === 8;
  const isRectifiedSquarePyramidAmboCoreGeometry =
    cell.vertexIds.length === 16 &&
    faces.length === 18 &&
    edgeCount === 32 &&
    countFaceSizes(faceSizes, 3) === 8 &&
    countFaceSizes(faceSizes, 4) === 10 &&
    countFaceSizes(vertexDegrees, 4) === 16;

  if (
    isTetrahedronGeometry &&
    (cell.topology === 'tetrahedron' || (!cell.topology && (cell.kind === 'seed' || cell.kind === 'residue')))
  ) {
    return 'tetrahedron';
  }

  if (
    isOctahedronGeometry &&
    (cell.topology === 'octahedron' || (!cell.topology && cell.kind === 'core'))
  ) {
    return 'octahedron';
  }

  if (isCubeGeometry && cell.topology === 'cube') {
    return 'cube';
  }

  if (isCuboctahedronGeometry && cell.topology === 'cuboctahedron') {
    return 'cuboctahedron';
  }

  if (isSquarePyramidGeometry && cell.topology === 'square-pyramid') {
    return 'square-pyramid';
  }

  if (isRectifiedSquarePyramidGeometry && cell.topology === 'rectified-square-pyramid') {
    return 'rectified-square-pyramid';
  }

  if (
    isRectifiedSquarePyramidAmboCoreGeometry &&
    cell.topology === 'rectified-square-pyramid-ambo-core'
  ) {
    return 'rectified-square-pyramid-ambo-core';
  }

  return null;
}

function buildSourceTopology(
  shape: Shape,
  cell: Cell,
  sourceTopology: SupportedAmboTopology,
): SourceTopology | null {
  const faces = getCellFaces(shape, cell);
  const cellVertexIds = new Set(cell.vertexIds);

  if (
    cell.vertexIds.length < 4 ||
    !faces.length ||
    faces.some(
      (face) =>
        face.vertexIds.length < 3 ||
        face.vertexIds.some((vertexId) => !cellVertexIds.has(vertexId) || !shape.vertices[vertexId]),
    )
  ) {
    return null;
  }

  const edges = normalizeEdgesForCell(Array.from(getCellEdgeMap(shape, faces).values()), cell.vertexIds);
  const edgeByKey = new Map(edges.map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]));
  const orderedNeighborsByVertex = new Map<VertexId, VertexId[]>();

  for (const vertexId of cell.vertexIds) {
    const neighborRing = neighborRingAroundVertex(faces, vertexId);

    if (!neighborRing || neighborRing.length < 3) {
      return null;
    }

    if (neighborRing.some((neighborId) => !edgeByKey.has(canonicalEdgeKey(vertexId, neighborId)))) {
      return null;
    }

    orderedNeighborsByVertex.set(vertexId, neighborRing);
  }

  return {
    cell,
    sourceTopology,
    vertexIds: [...cell.vertexIds],
    faces,
    edges,
    edgeByKey,
    orderedNeighborsByVertex,
  };
}

function normalizeEdgesForCell(edges: Edge[], vertexIds: VertexId[]): Edge[] {
  const vertexOrder = new Map(vertexIds.map((vertexId, index) => [vertexId, index]));

  return [...edges]
    .map((edge) => {
      const [a, b] = edge.vertexIds;
      const orderA = vertexOrder.get(a) ?? Number.MAX_SAFE_INTEGER;
      const orderB = vertexOrder.get(b) ?? Number.MAX_SAFE_INTEGER;
      const vertexPair: [VertexId, VertexId] = orderA <= orderB ? [a, b] : [b, a];

      return {
        ...edge,
        vertexIds: vertexPair,
        sourceVertexIds: vertexPair,
      };
    })
    .sort((edgeA, edgeB) => {
      const [a1, b1] = edgeA.vertexIds.map((vertexId) => vertexOrder.get(vertexId) ?? 0);
      const [a2, b2] = edgeB.vertexIds.map((vertexId) => vertexOrder.get(vertexId) ?? 0);

      return a1 - a2 || b1 - b2 || edgeA.id.localeCompare(edgeB.id);
    });
}

function hasValidVertexRings(topology: SourceTopology): boolean {
  if (topology.sourceTopology === 'square-pyramid') {
    const ringSizes = topology.vertexIds.map(
      (vertexId) => topology.orderedNeighborsByVertex.get(vertexId)?.length ?? 0,
    );

    return countFaceSizes(ringSizes, 4) === 1 && countFaceSizes(ringSizes, 3) === 4;
  }

  const expectedRingSize = getExpectedVertexRingSize(topology.sourceTopology);

  return topology.vertexIds.every((vertexId) => {
    const neighbors = topology.orderedNeighborsByVertex.get(vertexId) ?? [];

    return neighbors.length === expectedRingSize;
  });
}

function getExpectedVertexRingSize(sourceTopology: SupportedAmboTopology): number {
  return sourceTopology === 'octahedron' ||
    sourceTopology === 'cuboctahedron' ||
    sourceTopology === 'rectified-square-pyramid' ||
    sourceTopology === 'rectified-square-pyramid-ambo-core'
    ? 4
    : 3;
}

function countFaceSizes(faceSizes: number[], targetSize: number): number {
  return faceSizes.filter((size) => size === targetSize).length;
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

function cloneParentVertices(vertices: Record<VertexId, Vertex>): Record<VertexId, Vertex> {
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
    lineage: deriveFromSourceFace(face.id, shapeId),
  }));
}

function createCoreCell(
  topology: SourceTopology,
  shapeId: string,
  generationDepth: number,
  parentCellId: string,
  midpointIds: Map<string, VertexId>,
): CellWithFaces {
  const vertexIds = topology.edges.map((edge) => getMidpointId(midpointIds, ...edge.vertexIds));
  const cellId = makeCellId(shapeId, 'core', parentCellId, vertexIds);
  const faces: Face[] = [
    ...topology.faces.map((sourceFace) => {
      const faceVertexIds = midpointLoopForFace(sourceFace, midpointIds);

      return {
        id: makeFaceId(shapeId, 'dissection-core-face', sourceFace.id, faceVertexIds),
        vertexIds: faceVertexIds,
        role: 'dissection-core-face' as const,
        sourceCellId: cellId,
        sourceFaceId: sourceFace.id,
        lineage: deriveFromSourceFace(sourceFace.id, shapeId),
      };
    }),
    ...topology.vertexIds.map((sourceVertexId) => {
      const faceVertexIds = midpointRingForVertex(topology, sourceVertexId, midpointIds);

      return {
        id: makeFaceId(shapeId, 'dissection-core-face', sourceVertexId, faceVertexIds),
        vertexIds: faceVertexIds,
        role: 'dissection-core-face' as const,
        sourceCellId: cellId,
        sourceVertexId,
        lineage: deriveFromSourceVertex(sourceVertexId, shapeId),
      };
    }),
  ];

  return {
    id: cellId,
    kind: 'core',
    topology: getCoreTopology(topology.sourceTopology),
    generationDepth,
    parentCellId,
    sourceOperation: 'ambo-dissection',
    vertexIds,
    faceIds: faces.map((face) => face.id),
    sourceVertexIds: topology.vertexIds,
    sourceEdgeIds: topology.edges.map((edge) => edge.id),
    lineage: deriveFromParentCell(parentCellId, shapeId),
    faces,
  };
}

function createResidueCell(
  topology: SourceTopology,
  shapeId: string,
  generationDepth: number,
  parentCellId: string,
  sourceVertexId: VertexId,
  midpointIds: Map<string, VertexId>,
): CellWithFaces {
  const neighborRing = getNeighborRing(topology, sourceVertexId);
  const baseVertexIds = midpointRingForVertex(topology, sourceVertexId, midpointIds);
  const vertexIds = [sourceVertexId, ...baseVertexIds];
  const cellId = makeCellId(shapeId, 'residue', sourceVertexId, vertexIds);
  const faces = createResidueFaces(topology, shapeId, cellId, sourceVertexId, neighborRing, midpointIds);

  return {
    id: cellId,
    kind: 'residue',
    topology: getResidueTopology(topology.sourceTopology, neighborRing.length),
    generationDepth,
    parentCellId,
    sourceOperation: 'ambo-dissection',
    vertexIds,
    faceIds: faces.map((face) => face.id),
    sourceVertexIds: vertexIds,
    sourceEdgeIds: neighborRing.map((neighborId) => getParentEdge(topology, sourceVertexId, neighborId).id),
    preservedVertexId: sourceVertexId,
    lineage: deriveCellLineage(
      [
        packetSourceRef('cell', parentCellId, 'parent-cell'),
        packetSourceRef('vertex', sourceVertexId, 'preserved-vertex'),
      ],
      shapeId,
      'composite',
    ),
    faces,
  };
}

function getCoreTopology(sourceTopology: SupportedAmboTopology): CellTopology {
  if (sourceTopology === 'tetrahedron') {
    return 'octahedron';
  }

  if (sourceTopology === 'square-pyramid') {
    return 'rectified-square-pyramid';
  }

  if (sourceTopology === 'cuboctahedron') {
    return 'rhombicuboctahedron';
  }

  if (sourceTopology === 'rectified-square-pyramid') {
    return 'rectified-square-pyramid-ambo-core';
  }

  if (sourceTopology === 'rectified-square-pyramid-ambo-core') {
    return 'rectified-square-pyramid-ambo-core-ambo-core';
  }

  return 'cuboctahedron';
}

function getResidueTopology(
  sourceTopology: SupportedAmboTopology,
  sourceVertexDegree: number,
): CellTopology {
  if (sourceTopology === 'square-pyramid') {
    return sourceVertexDegree === 4 ? 'square-pyramid' : 'tetrahedron';
  }

  if (
    sourceTopology === 'octahedron' ||
    sourceTopology === 'cuboctahedron' ||
    sourceTopology === 'rectified-square-pyramid' ||
    sourceTopology === 'rectified-square-pyramid-ambo-core'
  ) {
    return 'square-pyramid';
  }

  return 'tetrahedron';
}

function createResidueFaces(
  topology: SourceTopology,
  shapeId: string,
  cellId: string,
  sourceVertexId: VertexId,
  neighborRing: VertexId[],
  midpointIds: Map<string, VertexId>,
): Face[] {
  const faces: Face[] = [];

  for (let index = 0; index < neighborRing.length; index += 1) {
    const a = neighborRing[index];
    const b = neighborRing[(index + 1) % neighborRing.length];
    const vertexIds = [
      sourceVertexId,
      getMidpointId(midpointIds, sourceVertexId, a),
      getMidpointId(midpointIds, sourceVertexId, b),
    ];
    const sourceFace = findFaceContaining(topology.faces, [sourceVertexId, a, b]);

    faces.push({
      id: makeFaceId(shapeId, 'dissection-residue-face', `${cellId}:side:${index}`, vertexIds),
      vertexIds,
      role: 'dissection-residue-face',
      sourceCellId: cellId,
      sourceFaceId: sourceFace?.id,
      sourceVertexId,
      lineage: deriveGeneratedFaceLineage(shapeId, sourceFace?.id, sourceVertexId),
    });
  }

  const baseVertexIds = midpointRingForVertex(topology, sourceVertexId, midpointIds);

  faces.push({
    id: makeFaceId(shapeId, 'dissection-residue-face', `${cellId}:base`, baseVertexIds),
    vertexIds: baseVertexIds,
    role: 'dissection-residue-face',
    sourceCellId: cellId,
    sourceVertexId,
    lineage: deriveFromSourceVertex(sourceVertexId, shapeId),
  });

  return faces;
}

function deriveGeneratedFaceLineage(
  operationId: string,
  sourceFaceId?: string,
  sourceVertexId?: VertexId,
): PacketLineage {
  if (sourceFaceId && sourceVertexId) {
    return deriveFaceLineage(
      [
        packetSourceRef('face', sourceFaceId, 'source-face'),
        packetSourceRef('vertex', sourceVertexId, 'source-vertex'),
      ],
      operationId,
      'composite',
    );
  }

  if (sourceFaceId) {
    return deriveFromSourceFace(sourceFaceId, operationId);
  }

  if (sourceVertexId) {
    return deriveFromSourceVertex(sourceVertexId, operationId);
  }

  return deriveFaceLineage([], operationId, 'default');
}

function midpointLoopForFace(face: Face, midpointIds: Map<string, VertexId>): VertexId[] {
  return face.vertexIds.map((vertexId, index) =>
    getMidpointId(midpointIds, vertexId, face.vertexIds[(index + 1) % face.vertexIds.length]),
  );
}

function midpointRingForVertex(
  topology: SourceTopology,
  sourceVertexId: VertexId,
  midpointIds: Map<string, VertexId>,
): VertexId[] {
  return getNeighborRing(topology, sourceVertexId).map((neighborId) =>
    getMidpointId(midpointIds, sourceVertexId, neighborId),
  );
}

function getNeighborRing(topology: SourceTopology, sourceVertexId: VertexId): VertexId[] {
  const neighborRing = topology.orderedNeighborsByVertex.get(sourceVertexId);

  if (!neighborRing) {
    throw new Error(`Missing incident edge ring for ${sourceVertexId}`);
  }

  return neighborRing;
}

function neighborRingAroundVertex(sourceFaces: Face[], center: VertexId): VertexId[] | null {
  const adjacency = new Map<VertexId, Set<VertexId>>();

  for (const face of sourceFaces) {
    const centerIndex = face.vertexIds.indexOf(center);

    if (centerIndex === -1) {
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
  const start = adjacency.keys().next().value as VertexId | undefined;

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

function getMidpointId(
  midpointIds: Map<string, VertexId>,
  a: VertexId,
  b: VertexId,
): VertexId {
  const midpointId = midpointIds.get(canonicalEdgeKey(a, b));

  if (!midpointId) {
    throw new Error(`Missing midpoint for edge ${a} -> ${b}`);
  }

  return midpointId;
}

function getParentEdge(topology: SourceTopology, a: VertexId, b: VertexId): Edge {
  const edge = topology.edgeByKey.get(canonicalEdgeKey(a, b));

  if (!edge) {
    throw new Error(`Missing source edge ${a} -> ${b}`);
  }

  return edge;
}

function getCellEdgeMap(shape: Shape, faces: Face[]): Map<string, Edge> {
  const shapeEdgesByKey = new Map(
    shape.edges.map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]),
  );

  return new Map(
    deriveEdges(faces, shape.id).map((edge) => [
      canonicalEdgeKey(...edge.vertexIds),
      shapeEdgesByKey.get(canonicalEdgeKey(...edge.vertexIds)) ?? edge,
    ]),
  );
}

function findFaceContaining(faces: Face[], vertexIds: VertexId[]): Face | undefined {
  return faces.find((face) => vertexIds.every((vertexId) => face.vertexIds.includes(vertexId)));
}

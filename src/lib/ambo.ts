import type { Cell, Edge, Face, Shape, Vertex, VertexDataPacket, VertexId } from '../types/geometry';
import {
  canonicalEdgeKey,
  makeCellId,
  makeFaceId,
  makeGenerationId,
  makeMidpointVertexId,
  makeShapeId,
} from './ids';
import { createDefaultVertexData, deriveEdges, midpoint } from './shape';

type TetraCorners = [VertexId, VertexId, VertexId, VertexId];

export function canApplyAmboDissection(shape: Shape): boolean {
  const cell = shape.cells[0];

  return (
    shape.cells.length === 1 &&
    cell?.kind === 'seed' &&
    cell.vertexIds.length === 4 &&
    cell.faceIds.length === 4 &&
    shape.edges.length === 6
  );
}

export function applyAmboDissection(parent: Shape): Shape {
  if (!canApplyAmboDissection(parent)) {
    throw new Error('Ambo dissection milestone currently supports exactly one seed tetrahedron.');
  }

  const generationDepth = parent.genealogy.generationDepth + 1;
  const shapeId = makeShapeId(parent.id, 'ambo-dissection', generationDepth);
  const sourceCell = parent.cells[0];
  const parentCellId = makeCellId(shapeId, 'parent', sourceCell.id, sourceCell.vertexIds);
  const corners = sourceCell.vertexIds as TetraCorners;
  const tetraEdges = createTetraEdgePairs(corners);
  const edgeByKey = new Map(parent.edges.map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]));
  const midpointIds = new Map<string, VertexId>();
  const vertices = cloneParentVertices(parent.vertices);

  for (const [a, b] of tetraEdges) {
    const edge = getParentEdge(edgeByKey, a, b);
    const midpointId = makeMidpointVertexId(sourceCell.id, a, b);
    const sourceA = parent.vertices[a];
    const sourceB = parent.vertices[b];

    midpointIds.set(canonicalEdgeKey(a, b), midpointId);
    vertices[midpointId] = {
      id: midpointId,
      position: midpoint(sourceA.position, sourceB.position),
      data: createDefaultVertexData(
        `${sourceA.data.label}${sourceB.data.label}`,
        '#eab308',
      ),
      createdBy: {
        shapeId,
        operation: 'ambo-dissection',
        sourceVertexIds: [a, b],
        sourceEdgeId: edge.id,
      },
    };
  }

  const parentFaces = createParentCellFaces(parent, shapeId, sourceCell, parentCellId);
  const parentCell: Cell = {
    id: parentCellId,
    kind: 'parent',
    generationDepth: parent.genealogy.generationDepth,
    parentCellId: sourceCell.parentCellId,
    sourceOperation: parent.genealogy.operation,
    vertexIds: sourceCell.vertexIds,
    faceIds: parentFaces.map((face) => face.id),
    sourceVertexIds: sourceCell.vertexIds,
    sourceEdgeIds: parent.edges.map((edge) => edge.id),
  };

  const coreCell = createCoreCell(
    parent,
    shapeId,
    generationDepth,
    parentCellId,
    corners,
    tetraEdges,
    edgeByKey,
    midpointIds,
  );
  const residueCells = corners.map((corner) =>
    createResidueCell(
      parent,
      shapeId,
      generationDepth,
      parentCellId,
      corners,
      corner,
      edgeByKey,
      midpointIds,
    ),
  );
  const generatedCells = [coreCell, ...residueCells];
  const generatedFaces = generatedCells.flatMap((cellWithFaces) => cellWithFaces.faces);
  const cells = [parentCell, ...generatedCells.map(({ faces: _faces, ...cell }) => cell)];
  const faces = [...parentFaces, ...generatedFaces];
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
      generationDepth,
      sourceVertexIds: sourceCell.vertexIds,
      createdVertexIds,
      createdAt,
    },
  };
}

interface CellWithFaces extends Cell {
  faces: Face[];
}

function createTetraEdgePairs([a, b, c, d]: TetraCorners): Array<[VertexId, VertexId]> {
  return [
    [a, b],
    [a, c],
    [a, d],
    [b, c],
    [b, d],
    [c, d],
  ];
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
  parent: Shape,
  shapeId: string,
  sourceCell: Cell,
  parentCellId: string,
): Face[] {
  return sourceCell.faceIds.map((sourceFaceId) => {
    const face = getFace(parent, sourceFaceId);

    return {
      id: makeFaceId(shapeId, 'parent-cell-face', sourceFaceId, face.vertexIds),
      vertexIds: face.vertexIds,
      role: 'parent-cell-face',
      sourceCellId: parentCellId,
      sourceFaceId,
    };
  });
}

function createCoreCell(
  parent: Shape,
  shapeId: string,
  generationDepth: number,
  parentCellId: string,
  corners: TetraCorners,
  tetraEdges: Array<[VertexId, VertexId]>,
  edgeByKey: Map<string, Edge>,
  midpointIds: Map<string, VertexId>,
): CellWithFaces {
  const vertexIds = tetraEdges.map(([a, b]) => getMidpointId(midpointIds, a, b));
  const cellId = makeCellId(shapeId, 'core', parentCellId, vertexIds);
  const faces: Face[] = [];

  for (const sourceFace of parent.faces) {
    if (sourceFace.vertexIds.length !== 3) {
      continue;
    }

    const faceVertexIds = midpointLoopForFace(sourceFace.vertexIds as [VertexId, VertexId, VertexId], midpointIds);

    faces.push({
      id: makeFaceId(shapeId, 'dissection-core-face', sourceFace.id, faceVertexIds),
      vertexIds: faceVertexIds,
      role: 'dissection-core-face',
      sourceCellId: cellId,
      sourceFaceId: sourceFace.id,
    });
  }

  for (const corner of corners) {
    const faceVertexIds = corners
      .filter((vertexId) => vertexId !== corner)
      .map((vertexId) => getMidpointId(midpointIds, corner, vertexId));

    faces.push({
      id: makeFaceId(shapeId, 'dissection-core-face', corner, faceVertexIds),
      vertexIds: faceVertexIds,
      role: 'dissection-core-face',
      sourceCellId: cellId,
      sourceVertexId: corner,
    });
  }

  return {
    id: cellId,
    kind: 'core',
    generationDepth,
    parentCellId,
    sourceOperation: 'ambo-dissection',
    vertexIds,
    faceIds: faces.map((face) => face.id),
    sourceVertexIds: corners,
    sourceEdgeIds: tetraEdges.map(([a, b]) => getParentEdge(edgeByKey, a, b).id),
    faces,
  };
}

function createResidueCell(
  parent: Shape,
  shapeId: string,
  generationDepth: number,
  parentCellId: string,
  corners: TetraCorners,
  corner: VertexId,
  edgeByKey: Map<string, Edge>,
  midpointIds: Map<string, VertexId>,
): CellWithFaces {
  const otherCorners = corners.filter((vertexId) => vertexId !== corner);
  const incidentMidpoints = otherCorners.map((vertexId) =>
    getMidpointId(midpointIds, corner, vertexId),
  );
  const vertexIds = [corner, ...incidentMidpoints];
  const cellId = makeCellId(shapeId, 'residue', corner, vertexIds);
  const faces = createResidueFaces(parent, shapeId, cellId, corner, otherCorners, midpointIds);

  return {
    id: cellId,
    kind: 'residue',
    generationDepth,
    parentCellId,
    sourceOperation: 'ambo-dissection',
    vertexIds,
    faceIds: faces.map((face) => face.id),
    sourceVertexIds: vertexIds,
    sourceEdgeIds: otherCorners.map((vertexId) => getParentEdge(edgeByKey, corner, vertexId).id),
    preservedVertexId: corner,
    faces,
  };
}

function createResidueFaces(
  parent: Shape,
  shapeId: string,
  cellId: string,
  corner: VertexId,
  otherCorners: VertexId[],
  midpointIds: Map<string, VertexId>,
): Face[] {
  const faces: Face[] = [];

  for (let index = 0; index < otherCorners.length; index += 1) {
    const a = otherCorners[index];
    const b = otherCorners[(index + 1) % otherCorners.length];
    const vertexIds = [
      corner,
      getMidpointId(midpointIds, corner, a),
      getMidpointId(midpointIds, corner, b),
    ];
    const sourceFace = findFaceContaining(parent, [corner, a, b]);

    faces.push({
      id: makeFaceId(shapeId, 'dissection-residue-face', `${cellId}:outer:${index}`, vertexIds),
      vertexIds,
      role: 'dissection-residue-face',
      sourceCellId: cellId,
      sourceFaceId: sourceFace?.id,
      sourceVertexId: corner,
    });
  }

  const internalFaceVertexIds = otherCorners.map((vertexId) =>
    getMidpointId(midpointIds, corner, vertexId),
  );

  faces.push({
    id: makeFaceId(shapeId, 'dissection-residue-face', `${cellId}:internal`, internalFaceVertexIds),
    vertexIds: internalFaceVertexIds,
    role: 'dissection-residue-face',
    sourceCellId: cellId,
    sourceVertexId: corner,
  });

  return faces;
}

function midpointLoopForFace(
  [a, b, c]: [VertexId, VertexId, VertexId],
  midpointIds: Map<string, VertexId>,
): VertexId[] {
  return [
    getMidpointId(midpointIds, a, b),
    getMidpointId(midpointIds, b, c),
    getMidpointId(midpointIds, c, a),
  ];
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

function getParentEdge(edgeByKey: Map<string, Edge>, a: VertexId, b: VertexId): Edge {
  const edge = edgeByKey.get(canonicalEdgeKey(a, b));

  if (!edge) {
    throw new Error(`Missing tetrahedron edge ${a} -> ${b}`);
  }

  return edge;
}

function getFace(shape: Shape, faceId: string): Face {
  const face = shape.faces.find((candidate) => candidate.id === faceId);

  if (!face) {
    throw new Error(`Missing face ${faceId}`);
  }

  return face;
}

function findFaceContaining(shape: Shape, vertexIds: VertexId[]): Face | undefined {
  return shape.faces.find((face) => vertexIds.every((vertexId) => face.vertexIds.includes(vertexId)));
}

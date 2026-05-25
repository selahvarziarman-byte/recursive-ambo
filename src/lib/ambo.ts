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

export function canApplyAmboDissection(shape: Shape, targetCellId?: string | null): boolean {
  const cell = getTargetCell(shape, targetCellId);

  return Boolean(cell && isDissectableTetrahedronCell(shape, cell));
}

export function applyAmboDissection(parent: Shape, targetCellId?: string | null): Shape {
  const sourceCell = getTargetCell(parent, targetCellId);

  if (!sourceCell || !isDissectableTetrahedronCell(parent, sourceCell)) {
    throw new Error('Ambo dissection currently supports seed and residue tetrahedron cells.');
  }

  const generationDepth = sourceCell.generationDepth + 1;
  const shapeGenerationDepth = Math.max(parent.genealogy.generationDepth, generationDepth);
  const shapeId = makeShapeId(parent.id, 'ambo-dissection', shapeGenerationDepth);
  const parentCellId = makeCellId(shapeId, 'parent', sourceCell.id, sourceCell.vertexIds);
  const corners = sourceCell.vertexIds as TetraCorners;
  const tetraEdges = createTetraEdgePairs(corners);
  const sourceFaces = getCellFaces(parent, sourceCell);
  const edgeByKey = getCellEdgeMap(parent, sourceFaces);
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

  const parentFaces = createParentCellFaces(shapeId, sourceCell, parentCellId, sourceFaces);
  const parentCell: Cell = {
    id: parentCellId,
    kind: 'parent',
    generationDepth: sourceCell.generationDepth,
    parentCellId: sourceCell.parentCellId,
    sourceOperation: sourceCell.sourceOperation,
    vertexIds: sourceCell.vertexIds,
    faceIds: parentFaces.map((face) => face.id),
    sourceVertexIds: sourceCell.vertexIds,
    sourceEdgeIds: tetraEdges.map(([a, b]) => getParentEdge(edgeByKey, a, b).id),
  };

  const coreCell = createCoreCell(
    sourceFaces,
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
      sourceFaces,
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

interface CellWithFaces extends Cell {
  faces: Face[];
}

function getTargetCell(shape: Shape, targetCellId?: string | null): Cell | null {
  if (targetCellId) {
    return shape.cells.find((cell) => cell.id === targetCellId) ?? null;
  }

  const seedCell = shape.cells.find((cell) => cell.kind === 'seed');

  return seedCell ?? null;
}

function isDissectableTetrahedronCell(shape: Shape, cell: Cell): boolean {
  if (cell.kind !== 'seed' && cell.kind !== 'residue') {
    return false;
  }

  return cell.vertexIds.length === 4 && getCellFaces(shape, cell).length === 4;
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
  shapeId: string,
  sourceCell: Cell,
  parentCellId: string,
  sourceFaces: Face[],
): Face[] {
  return sourceFaces.map((face) => ({
    id: makeFaceId(shapeId, 'parent-cell-face', face.id, face.vertexIds),
    vertexIds: face.vertexIds,
    role: 'parent-cell-face',
    sourceCellId: parentCellId,
    sourceFaceId: face.id,
  }));
}

function createCoreCell(
  sourceFaces: Face[],
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

  for (const sourceFace of sourceFaces) {
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
  sourceFaces: Face[],
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
  const faces = createResidueFaces(sourceFaces, shapeId, cellId, corner, otherCorners, midpointIds);

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
  sourceFaces: Face[],
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
    const sourceFace = findFaceContaining(sourceFaces, [corner, a, b]);

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

function getCellFaces(shape: Shape, cell: Cell): Face[] {
  const faceIds = new Set(cell.faceIds);

  return shape.faces.filter((face) => faceIds.has(face.id));
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

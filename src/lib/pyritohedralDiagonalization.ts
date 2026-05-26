import type {
  Cell,
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
  makeShapeId,
} from './ids';
import {
  deriveCellLineage,
  deriveFaceLineage,
  deriveFromSourceFace,
  packetSourceRef,
} from './packets';
import { deriveEdges, getCellFaces } from './shape';

interface CuboctahedronSourceTopology {
  cell: Cell;
  vertexIds: VertexId[];
  faces: Face[];
  triangleFaces: Face[];
  squareFaces: Face[];
  edges: Edge[];
  edgeByKey: Map<string, Edge>;
}

interface DiagonalChoice {
  sourceFace: Face;
  vertexIds: [VertexId, VertexId];
  key: string;
  splitFaces: [VertexId[], VertexId[]];
}

export function canApplyPyritohedralDiagonalization(
  shape: Shape,
  targetCellId?: string | null,
): boolean {
  const cell = getTargetCell(shape, targetCellId);
  const topology = cell ? buildCuboctahedronSourceTopology(shape, cell) : null;

  if (!topology) {
    return false;
  }

  try {
    selectCoherentDiagonalMatching(topology);
    return true;
  } catch {
    return false;
  }
}

export function applyPyritohedralDiagonalization(
  parent: Shape,
  targetCellId?: string | null,
): Shape {
  const sourceCell = getTargetCell(parent, targetCellId);

  if (!sourceCell) {
    throw new Error('No cell available for pyritohedral diagonalization.');
  }

  const topology = buildCuboctahedronSourceTopology(parent, sourceCell);

  if (!topology) {
    throw new Error(
      'Pyritohedral diagonalization currently supports structurally valid cuboctahedron cells only.',
    );
  }

  return applyCuboctahedronDiagonalization(parent, topology);
}

function applyCuboctahedronDiagonalization(
  parent: Shape,
  topology: CuboctahedronSourceTopology,
): Shape {
  const { cell: sourceCell } = topology;
  const generationDepth = sourceCell.generationDepth + 1;
  const shapeGenerationDepth = Math.max(parent.genealogy.generationDepth, generationDepth);
  const shapeId = makeShapeId(parent.id, 'pyritohedral-diagonalization', shapeGenerationDepth);
  const parentCellId = makeCellId(shapeId, 'parent', sourceCell.id, sourceCell.vertexIds);
  const vertices = cloneParentVertices(parent.vertices);
  const diagonalChoices = selectCoherentDiagonalMatching(topology);
  const parentFaces = createParentCellFaces(shapeId, parentCellId, topology.faces);
  const resultFaces = createPyritohedralFaces(shapeId, sourceCell.id, topology, diagonalChoices);
  const resultCellId = makeCellId(shapeId, 'core', sourceCell.id, sourceCell.vertexIds);
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
  const resultCell: Cell = {
    id: resultCellId,
    kind: 'core',
    topology: 'pyritohedral-icosahedron',
    generationDepth,
    parentCellId,
    sourceOperation: 'pyritohedral-diagonalization',
    vertexIds: sourceCell.vertexIds,
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
  const cells = [
    ...parent.cells.filter((cell) => cell.id !== sourceCell.id),
    parentCell,
    resultCell,
  ];
  const faces = [
    ...parent.faces.filter((face) => !replacedFaceIds.has(face.id)),
    ...parentFaces,
    ...resultFaces,
  ];
  const edges = derivePyritohedralEdges(faces, shapeId, sourceCell.id, diagonalChoices);
  const createdAt = new Date().toISOString();

  return {
    id: shapeId,
    name: `Pyritohedral Diagonalization ${parent.name}`,
    seedKey: parent.seedKey,
    vertices,
    edges,
    faces,
    cells,
    generations: [
      ...parent.generations,
      {
        id: makeGenerationId(shapeId, 'pyritohedral-diagonalization', generationDepth),
        depth: generationDepth,
        sourceOperation: 'pyritohedral-diagonalization',
        parentShapeId: parent.id,
        parentCellIds: [parentCellId],
        createdCellIds: [resultCell.id],
        createdVertexIds: [],
        createdAt,
      },
    ],
    genealogy: {
      parentShapeId: parent.id,
      operation: 'pyritohedral-diagonalization',
      generationDepth: shapeGenerationDepth,
      sourceVertexIds: sourceCell.vertexIds,
      createdVertexIds: [],
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

function buildCuboctahedronSourceTopology(
  shape: Shape,
  cell: Cell,
): CuboctahedronSourceTopology | null {
  if (cell.topology !== 'cuboctahedron') {
    return null;
  }

  const faces = getCellFaces(shape, cell);
  const cellVertexIds = new Set(cell.vertexIds);

  if (
    cell.vertexIds.length !== 12 ||
    faces.length !== 14 ||
    faces.some(
      (face) =>
        face.vertexIds.length < 3 ||
        new Set(face.vertexIds).size !== face.vertexIds.length ||
        face.vertexIds.some((vertexId) => !cellVertexIds.has(vertexId) || !shape.vertices[vertexId]),
    )
  ) {
    return null;
  }

  const edgeByKey = getCellEdgeMap(shape, faces);
  const edges = Array.from(edgeByKey.values());
  const faceSizes = faces.map((face) => face.vertexIds.length);
  const vertexDegrees = degreeSequence(cell.vertexIds, edges);
  const triangleFaces = faces.filter((face) => face.vertexIds.length === 3);
  const squareFaces = faces.filter((face) => face.vertexIds.length === 4);

  if (
    edges.length !== 24 ||
    countValues(faceSizes, 3) !== 8 ||
    countValues(faceSizes, 4) !== 6 ||
    triangleFaces.length !== 8 ||
    squareFaces.length !== 6 ||
    countValues(vertexDegrees, 4) !== 12
  ) {
    return null;
  }

  return {
    cell,
    vertexIds: [...cell.vertexIds],
    faces,
    triangleFaces,
    squareFaces,
    edges,
    edgeByKey,
  };
}

function selectCoherentDiagonalMatching(
  topology: CuboctahedronSourceTopology,
): DiagonalChoice[] {
  const squareFaces = [...topology.squareFaces].sort((a, b) => a.id.localeCompare(b.id));
  const candidateChoices = squareFaces.map((face) => getSquareDiagonalChoices(face));
  let bestChoices: DiagonalChoice[] | null = null;
  let bestKey: string | null = null;
  const assignmentCount = 2 ** candidateChoices.length;

  for (let mask = 0; mask < assignmentCount; mask += 1) {
    const choices = candidateChoices.map((choicesForFace, index) => choicesForFace[(mask >> index) & 1]);

    if (!isPerfectVertexMatching(topology.vertexIds, choices)) {
      continue;
    }

    if (choices.some((choice) => topology.edgeByKey.has(choice.key))) {
      continue;
    }

    const key = choices
      .map((choice) => choice.key)
      .sort()
      .join('\n');

    if (bestKey === null || key.localeCompare(bestKey) < 0) {
      bestKey = key;
      bestChoices = choices;
    }
  }

  if (!bestChoices) {
    throw new Error(
      'Pyritohedral diagonalization could not find a coherent square-face diagonal matching.',
    );
  }

  return [...bestChoices].sort((a, b) => a.key.localeCompare(b.key));
}

function getSquareDiagonalChoices(face: Face): [DiagonalChoice, DiagonalChoice] {
  const [a, b, c, d] = face.vertexIds;

  return [
    {
      sourceFace: face,
      vertexIds: [a, c],
      key: canonicalEdgeKey(a, c),
      splitFaces: [
        [a, b, c],
        [a, c, d],
      ],
    },
    {
      sourceFace: face,
      vertexIds: [b, d],
      key: canonicalEdgeKey(b, d),
      splitFaces: [
        [b, c, d],
        [b, d, a],
      ],
    },
  ];
}

function isPerfectVertexMatching(vertexIds: VertexId[], choices: DiagonalChoice[]): boolean {
  const counts = new Map(vertexIds.map((vertexId) => [vertexId, 0]));

  for (const choice of choices) {
    for (const vertexId of choice.vertexIds) {
      counts.set(vertexId, (counts.get(vertexId) ?? 0) + 1);
    }
  }

  return vertexIds.every((vertexId) => counts.get(vertexId) === 1);
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

function createPyritohedralFaces(
  shapeId: string,
  sourceCellId: string,
  topology: CuboctahedronSourceTopology,
  diagonalChoices: DiagonalChoice[],
): Face[] {
  const preservedFaces = [...topology.triangleFaces]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((face) => ({
      id: makeFaceId(shapeId, 'pyritohedral-preserved-face', face.id, face.vertexIds),
      vertexIds: face.vertexIds,
      role: 'pyritohedral-preserved-face' as const,
      data: clonePacketData(face.data),
      sourceCellId,
      sourceFaceId: face.id,
      lineage: deriveFaceLineage(
        [
          packetSourceRef('face', face.id, 'source-face'),
          packetSourceRef('cell', sourceCellId, 'source-cell'),
        ],
        shapeId,
        'preserved',
      ),
    }));
  const splitFaces = diagonalChoices.flatMap((choice) =>
    choice.splitFaces.map((vertexIds, index) => ({
      id: makeFaceId(
        shapeId,
        'pyritohedral-split-face',
        `${choice.sourceFace.id}:split:${index}`,
        vertexIds,
      ),
      vertexIds,
      role: 'pyritohedral-split-face' as const,
      sourceCellId,
      sourceFaceId: choice.sourceFace.id,
      lineage: deriveFaceLineage(
        [
          packetSourceRef('face', choice.sourceFace.id, 'source-face'),
          packetSourceRef('cell', sourceCellId, 'source-cell'),
        ],
        shapeId,
        'derived-from-face',
      ),
    })),
  );

  return [...preservedFaces, ...splitFaces];
}

function derivePyritohedralEdges(
  faces: Face[],
  shapeId: string,
  sourceCellId: string,
  diagonalChoices: DiagonalChoice[],
): Edge[] {
  const diagonalByKey = new Map(diagonalChoices.map((choice) => [choice.key, choice]));

  return deriveEdges(faces, shapeId).map((edge) => {
    const choice = diagonalByKey.get(canonicalEdgeKey(...edge.vertexIds));

    if (!choice) {
      return edge;
    }

    return {
      ...edge,
      role: 'construction-diagonal' as const,
      sourceFaceId: choice.sourceFace.id,
      sourceCellId,
      lineage: createConstructionDiagonalLineage(shapeId, sourceCellId, choice.sourceFace.id),
    };
  });
}

function createConstructionDiagonalLineage(
  operationId: string,
  sourceCellId: string,
  sourceFaceId: string,
): PacketLineage {
  return deriveFaceLineage(
    [
      packetSourceRef('face', sourceFaceId, 'source-square-face'),
      packetSourceRef('cell', sourceCellId, 'source-cell'),
    ],
    operationId,
    'derived-from-face',
  );
}

function getCellEdgeMap(shape: Shape, faces: Face[]): Map<string, Edge> {
  const shapeEdgesByKey = new Map(
    shape.edges.map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]),
  );

  return new Map(
    deriveEdges(faces, shape.id).map((edge) => {
      const key = canonicalEdgeKey(...edge.vertexIds);

      return [key, shapeEdgesByKey.get(key) ?? edge];
    }),
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

function clonePacketData(data: Face['data']): Face['data'] {
  return data ? { ...data } : undefined;
}

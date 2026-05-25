import type { SeedDefinition, SeedKey, Shape, Vertex } from '../types/geometry';
import { makeCellId, makeGenerationId } from '../lib/ids';
import { deriveEdges, createDefaultVertexData } from '../lib/shape';

export const seedRegistry: Record<SeedKey, SeedDefinition> = {
  tetrahedron: {
    key: 'tetrahedron',
    label: 'Tetrahedron',
    description: 'A regular tetrahedron centered at the origin.',
    vertices: [
      { key: 'a', label: 'A', position: [1, 1, 1], color: '#14b8a6' },
      { key: 'b', label: 'B', position: [-1, -1, 1], color: '#f97316' },
      { key: 'c', label: 'C', position: [-1, 1, -1], color: '#a3e635' },
      { key: 'd', label: 'D', position: [1, -1, -1], color: '#38bdf8' },
    ],
    faces: [
      { key: 'abc', vertexKeys: ['a', 'b', 'c'] },
      { key: 'adb', vertexKeys: ['a', 'd', 'b'] },
      { key: 'acd', vertexKeys: ['a', 'c', 'd'] },
      { key: 'bdc', vertexKeys: ['b', 'd', 'c'] },
    ],
  },
};

export function createSeedShape(seedKey: SeedKey): Shape {
  const seed = seedRegistry[seedKey];

  if (!seed) {
    throw new Error(`Unknown seed: ${seedKey}`);
  }

  const shapeId = `shape:seed:${seed.key}`;
  const vertices = seed.vertices.reduce<Record<string, Vertex>>((accumulator, vertex) => {
    const id = `vertex:${seed.key}:${vertex.key}`;

    accumulator[id] = {
      id,
      position: vertex.position,
      data: createDefaultVertexData(vertex.label, vertex.color),
      createdBy: {
        shapeId,
        operation: 'seed',
        sourceVertexIds: [],
      },
    };

    return accumulator;
  }, {});

  const vertexIdsByKey = Object.fromEntries(
    seed.vertices.map((vertex) => [vertex.key, `vertex:${seed.key}:${vertex.key}`]),
  );

  const faces = seed.faces.map((face) => ({
    id: `face:${seed.key}:${face.key}`,
    vertexIds: face.vertexKeys.map((key) => vertexIdsByKey[key]),
    role: 'seed-face' as const,
  }));
  const vertexIds = Object.keys(vertices);
  const faceIds = faces.map((face) => face.id);
  const seedCellId = makeCellId(shapeId, 'seed', seed.key, vertexIds);
  const createdAt = new Date().toISOString();

  return {
    id: shapeId,
    name: seed.label,
    seedKey: seed.key,
    vertices,
    edges: deriveEdges(faces, shapeId),
    faces,
    cells: [
      {
        id: seedCellId,
        kind: 'seed',
        generationDepth: 0,
        parentCellId: null,
        sourceOperation: 'seed',
        vertexIds,
        faceIds,
        sourceVertexIds: [],
        sourceEdgeIds: [],
      },
    ],
    generations: [
      {
        id: makeGenerationId(shapeId, 'seed', 0),
        depth: 0,
        sourceOperation: 'seed',
        parentShapeId: null,
        parentCellIds: [],
        createdCellIds: [seedCellId],
        createdVertexIds: vertexIds,
        createdAt,
      },
    ],
    genealogy: {
      parentShapeId: null,
      operation: 'seed',
      generationDepth: 0,
      sourceVertexIds: [],
      createdVertexIds: vertexIds,
      createdAt,
    },
  };
}

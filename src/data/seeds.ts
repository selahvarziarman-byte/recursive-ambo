import type { SeedDefinition, SeedKey, Shape, Vertex } from '../types/geometry';
import { makeCellId, makeGenerationId } from '../lib/ids';
import { defaultPacket, deriveFaceLineage, packetSourceRef } from '../lib/packets';
import { deriveEdges, createDefaultVertexData } from '../lib/shape';

export const seedRegistry: Record<SeedKey, SeedDefinition> = {
  tetrahedron: {
    key: 'tetrahedron',
    label: 'Tetrahedron',
    description: 'A regular tetrahedron centered at the origin.',
    topology: 'tetrahedron',
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
  octahedron: {
    key: 'octahedron',
    label: 'Octahedron',
    description: 'A regular octahedron with six axis-aligned vertices.',
    topology: 'octahedron',
    vertices: [
      { key: 'px', label: '+X', position: [1, 0, 0], color: '#14b8a6' },
      { key: 'nx', label: '-X', position: [-1, 0, 0], color: '#f97316' },
      { key: 'py', label: '+Y', position: [0, 1, 0], color: '#a3e635' },
      { key: 'ny', label: '-Y', position: [0, -1, 0], color: '#38bdf8' },
      { key: 'pz', label: '+Z', position: [0, 0, 1], color: '#f472b6' },
      { key: 'nz', label: '-Z', position: [0, 0, -1], color: '#c084fc' },
    ],
    faces: [
      { key: 'px-py-pz', vertexKeys: ['px', 'py', 'pz'] },
      { key: 'py-nx-pz', vertexKeys: ['py', 'nx', 'pz'] },
      { key: 'nx-ny-pz', vertexKeys: ['nx', 'ny', 'pz'] },
      { key: 'ny-px-pz', vertexKeys: ['ny', 'px', 'pz'] },
      { key: 'px-nz-py', vertexKeys: ['px', 'nz', 'py'] },
      { key: 'py-nz-nx', vertexKeys: ['py', 'nz', 'nx'] },
      { key: 'nx-nz-ny', vertexKeys: ['nx', 'nz', 'ny'] },
      { key: 'ny-nz-px', vertexKeys: ['ny', 'nz', 'px'] },
    ],
  },
  cube: {
    key: 'cube',
    label: 'Cube',
    description: 'A cube with eight vertices and six ordered square faces.',
    topology: 'cube',
    vertices: [
      { key: 'a', label: 'A', position: [-1, -1, -1], color: '#14b8a6' },
      { key: 'b', label: 'B', position: [1, -1, -1], color: '#f97316' },
      { key: 'c', label: 'C', position: [1, 1, -1], color: '#a3e635' },
      { key: 'd', label: 'D', position: [-1, 1, -1], color: '#38bdf8' },
      { key: 'e', label: 'E', position: [-1, -1, 1], color: '#f472b6' },
      { key: 'f', label: 'F', position: [1, -1, 1], color: '#c084fc' },
      { key: 'g', label: 'G', position: [1, 1, 1], color: '#facc15' },
      { key: 'h', label: 'H', position: [-1, 1, 1], color: '#60a5fa' },
    ],
    faces: [
      { key: 'bottom', vertexKeys: ['a', 'd', 'c', 'b'] },
      { key: 'top', vertexKeys: ['e', 'f', 'g', 'h'] },
      { key: 'front', vertexKeys: ['a', 'b', 'f', 'e'] },
      { key: 'right', vertexKeys: ['b', 'c', 'g', 'f'] },
      { key: 'back', vertexKeys: ['c', 'd', 'h', 'g'] },
      { key: 'left', vertexKeys: ['d', 'a', 'e', 'h'] },
    ],
  },
  // THE TRIANGLE SEED (ADR 0031 §9.77, RATIFIED claims §553; the mothership's STAMP TRIANGLE-SEED, claims §555; Arman's Δ255 —
  // this file's spend sanctioned verbatim "Sanction both, build all three"): one face of the tetrahedron taken alone, the other
  // three silent — the tetrahedron's face BDC, lettered A B C, the plane x + y + z = -1 (nearly face-on to the default camera
  // [3.2, 2.4, 3.8]: 80 degrees from the line of sight; the face ABC would lie 18 degrees from it, nearly edge-on — measured
  // at the price, 2026-10-30, HEAD 3b96c3a). One cell of kind `seed` holding ONE face: `createSeedShape` builds it exactly as it
  // builds the solids (three edges derived from the one face); the dissection's polygon path (src/lib/ambo.ts) cuts it.
  // Manifest re-sealed in the same change.
  triangle: {
    key: 'triangle',
    label: 'Triangle',
    description: 'A regular triangle: one face of the tetrahedron, taken alone.',
    topology: 'triangle',
    vertices: [
      { key: 'a', label: 'A', position: [-1, -1, 1], color: '#14b8a6' },
      { key: 'b', label: 'B', position: [1, -1, -1], color: '#f97316' },
      { key: 'c', label: 'C', position: [-1, 1, -1], color: '#a3e635' },
    ],
    faces: [{ key: 'abc', vertexKeys: ['a', 'b', 'c'] }],
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

  const faces = seed.faces.map((face) => {
    const vertexIds = face.vertexKeys.map((key) => vertexIdsByKey[key]);

    return {
      id: `face:${seed.key}:${face.key}`,
      vertexIds,
      role: 'seed-face' as const,
      lineage: deriveFaceLineage(
        vertexIds.map((vertexId) => packetSourceRef('vertex', vertexId, 'seed-face-vertex')),
        shapeId,
        'composite',
      ),
    };
  });
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
        topology: seed.topology,
        generationDepth: 0,
        parentCellId: null,
        sourceOperation: 'seed',
        vertexIds,
        faceIds,
        sourceVertexIds: [],
        sourceEdgeIds: [],
        lineage: defaultPacket().lineage,
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

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
  JsonValue,
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
// THE ASCENT STANCE-STAMP (2026-08-02): a MINTED medial face owns its corner
// angle combinatorially — invocation's rule ((n−2)π/n), distance-free; a
// COPIED face RIDES its source's owned angles. The atom is READ (frozen),
// never re-derived.
// R2 (2026-08-14): the regular stamp is RETIRED at these mint sites — the
// angles are acos-imported from the carried positions (measure, never stamp)
import { importCornerAngles } from './cornerAngleImport';
import { midpointLetters } from './christening';
import { carriedTriads, TRIADS_KEY } from './respects';
import { carriedRelatings, relatingsHeld, RELATINGS_KEY } from './relatings';
import { verdictsOn, VERDICTS_KEY } from './sorting';

const DEFAULT_MIDPOINT_COLOR = '#eab308';

type SupportedAmboTopology =
  | 'tetrahedron'
  | 'octahedron'
  | 'cube'
  | 'cuboctahedron'
  | 'square-pyramid'
  | 'rectified-square-pyramid'
  | 'rectified-square-pyramid-ambo-core'
  // THE TRIANGLE SEED (ADR 0031 §9.77, RATIFIED claims §553; the mothership's STAMP TRIANGLE-SEED, claims §555; Arman's Δ255): a
  // 2-CELL — one face, three corners, three edges. Its cut is the ambo of a POLYGON: the three midpoints the children, the medial
  // triangle the core and the three corner triangles the residues, AS FACES — each a cell of ONE face (the record's cells are what the
  // operations address; the core and the residues of a triangle are triangles again, and the same path cuts them at generation 2).
  | 'triangle';

/** a 2-cell: a cell of ONE face — a corner's ring is OPEN (its two neighbours in the face's cycle) and has no vertex figure */
const isTwoCell = (topology: SourceTopology): boolean => topology.faces.length === 1;

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
      'Ambo dissection currently supports tetrahedron, octahedron, cube, cuboctahedron, square-pyramid, rectified-square-pyramid, rectified-square-pyramid-ambo-core, and triangle cells.',
    );
  }

  return applyGenericAmboDissection(parent, topology);
}

function applyGenericAmboDissection(parent: Shape, topology: SourceTopology): Shape {
  const { cell: sourceCell } = topology;
  const generationDepth = sourceCell.generationDepth + 1;
  const shapeGenerationDepth = Math.max(parent.genealogy.generationDepth, generationDepth);
  // §148 ruling 3 (2026-09-24) — THE ID INDEXES THE ACT: parent AND cell. The frozen mint hashes its first argument whole
  // with the operation and the depth; hashed on the parent alone, two different cells of one parent minted ONE id and the
  // second child silently overwrote the first in the session (measured: gen 1's core and its residue at A both minted
  // `…:2:czpwku`). The parent's id and the dissected cell's id ride the hashed argument together; the id's form is the
  // mint's own, the genealogy still names the parent by itself.
  const shapeId = makeShapeId(`${parent.id}/${sourceCell.id}`, 'ambo-dissection', shapeGenerationDepth);
  const parentCellId = makeCellId(shapeId, 'parent', sourceCell.id, sourceCell.vertexIds);
  const midpointIds = new Map<string, VertexId>();
  const vertices = cloneParentVertices(parent.vertices);
  const minted: VertexId[] = [];

  for (const edge of topology.edges) {
    const [a, b] = edge.vertexIds;
    // ONE EDGE, ONE CHILD (D4; the mothership's 2026-10-30 08:53 ruling on the coder's price, claims §555 — THE TRIANGLE SEED's
    // one-midpoint cure, taken by the solid too): a midpoint is the child of its EDGE, whichever of the edge's cells is cut first. A
    // later cut of a cell sharing the edge REUSES the child the first cut made — found in the parent's record by the pair it was made on
    // — and mints none; the id stays the first cutter's (the frozen mint keys a midpoint by its cutting cell, src/lib/ids.ts, untouched).
    // MEASURED before the cure at 3b96c3a: a generation-1 residue cut after the core minted a second vertex at each of the three
    // midpoints the residue's base shares with the core's face — two children of one relation, made by the order of his cuts.
    const made = midpointAlreadyMade(parent, a, b);
    if (made) {
      midpointIds.set(canonicalEdgeKey(a, b), made.id);
      continue;
    }
    const midpointId = makeMidpointVertexId(sourceCell.id, a, b);
    minted.push(midpointId);
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
      // C-13b (Δ58): the slot holds the composed string, by the one rule the re-composition also reads (src/lib/christening.ts)
      data: createDefaultVertexData(
        midpointLetters(sourceA.data.label, sourceB.data.label),
        averageVertexColors(sourceA.data.color, sourceB.data.color),
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

  const coreCell = createCoreCell(topology, shapeId, generationDepth, parentCellId, midpointIds, vertices);
  const residueCells = topology.vertexIds.map((sourceVertexId) =>
    createResidueCell(topology, shapeId, generationDepth, parentCellId, sourceVertexId, midpointIds, vertices),
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
  const createdVertexIds = minted; // the children THIS cut made — a reused child is not created by this act
  const createdAt = new Date().toISOString();
  // C-7e (Δ84 "pay the price", 2026-09-22) — THE CARRY: the person's record on an edge RIDES the dissection.
  // `deriveEdges` mints every edge of the new shape fresh — `makeEdgeId(shapeId, pair)` depends on the SHAPE id
  // (shape.ts and ids.ts, FROZEN, untouched; measured at C-7c: `edge:251ovc` → `edge:1njwrxo`) — so the record
  // is COPIED onto the re-derived edge of the SAME PAIR: copied, never re-derived (an identification the person
  // did not give does not appear; `roles` and `types` only, as the one writer keeps them), and a pair whose
  // parent edge held none carries none — a true absence carries as a true absence. The record reads FIRST
  // corner ↦ SECOND, and a re-derived edge is walked by whichever face `deriveEdges` meets first — MEASURED:
  // gen 1 → gen 2 keeps every pair's order, gen 2 → gen 3 on the core walks 12 of 78 surviving pairs the other
  // way — so on a pair walked the other way the pairs are MIRRORED (the same act, said from the new first
  // corner). Every pair of the parent survives (the dissected cell's faces become parent-cell-faces; the other
  // cells' faces are kept). Nothing here assumes the order of the person's acts across generations.
  // C-14 — the RESPECTS ride the FACE, not the edge: a dissected cell's face record is carried onto its parent-cell-face by
  // `createParentCellFaces` (positional in the corner order that copy keeps); every other face is kept whole with its packet.
  // MODES-1 · B1 — the RELATINGS ride the edge's packet (`edge.data.relatings`, the other modes and the bars) and are carried onto
  // the same pair exactly as the record is: copied, mirrored (x ↔ y) where the derived edge is walked the other way, never re-derived.
  const recordedByPair = new Map(parent.edges.filter((edge) => edge.identification || relatingsHeld(edge).length > 0).map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]));
  const edges = deriveEdges(faces, shapeId).map((edge) => {
    const source = recordedByPair.get(canonicalEdgeKey(...edge.vertexIds));
    if (!source) return edge;
    const mirrored = source.vertexIds[0] !== edge.vertexIds[0];
    const copy = (pairs: Array<[string, string]>): Array<[string, string]> => pairs.map(([x, y]): [string, string] => (mirrored ? [y, x] : [x, y]));
    const withRecord = source.identification ? { ...edge, identification: { roles: copy(source.identification.roles), types: copy(source.identification.types) } } : edge;
    const relatings = carriedRelatings(source.data, mirrored);
    return relatings === undefined ? withRecord : { ...withRecord, data: { ...(withRecord.data ?? {}), [RELATINGS_KEY]: relatings } };
  });

  return {
    id: shapeId,
    // C-12a item 2 — the universe's name says the dissection ONCE: a parent already named `Ambo Dissection …` keeps its
    // name (the generation rides `genealogy.generationDepth`, printed beside the name where the shapes are listed);
    // `Ambo Dissection Ambo Dissection Tetrahedron` was the doubling, measured at the lift from gen 2
    name: parent.name.startsWith('Ambo Dissection ') ? parent.name : `Ambo Dissection ${parent.name}`,
    seedKey: parent.seedKey,
    vertices,
    edges,
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
  // THE TRIANGLE SEED: a 2-cell of three corners — one face of three, three edges, every corner of degree 2
  const isTriangleGeometry =
    cell.vertexIds.length === 3 &&
    faces.length === 1 &&
    edgeCount === 3 &&
    faceSizes.every((size) => size === 3) &&
    vertexDegrees.every((degree) => degree === 2);

  if (isTriangleGeometry && cell.topology === 'triangle') {
    return 'triangle';
  }

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

  // THE TRIANGLE SEED: a 2-cell's corner holds an OPEN ring — its two neighbours in the face's own cycle. The builder below asks each
  // corner for a CLOSED ring of three or more (a 3-cell's corner) and four corners at least; the polygon takes its own branch
  if (sourceTopology === 'triangle') {
    return buildPolygonSourceTopology(shape, cell, faces, sourceTopology);
  }

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

/** THE TRIANGLE SEED — the source topology of a 2-cell: its one face, the edges derived from it, and at each corner the OPEN ring
 * [previous, next] in the face's own cycle (the face's cycle is the only order a polygon has) */
function buildPolygonSourceTopology(
  shape: Shape,
  cell: Cell,
  faces: Face[],
  sourceTopology: SupportedAmboTopology,
): SourceTopology | null {
  const face = faces[0];
  const cellVertexIds = new Set(cell.vertexIds);

  if (
    faces.length !== 1 ||
    !face ||
    face.vertexIds.length < 3 ||
    new Set(face.vertexIds).size !== face.vertexIds.length ||
    face.vertexIds.some((vertexId) => !cellVertexIds.has(vertexId) || !shape.vertices[vertexId]) ||
    cell.vertexIds.some((vertexId) => !face.vertexIds.includes(vertexId))
  ) {
    return null;
  }

  const edges = normalizeEdgesForCell(Array.from(getCellEdgeMap(shape, faces).values()), cell.vertexIds);
  const edgeByKey = new Map(edges.map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]));
  const orderedNeighborsByVertex = new Map<VertexId, VertexId[]>();
  const n = face.vertexIds.length;

  face.vertexIds.forEach((vertexId, index) => {
    orderedNeighborsByVertex.set(vertexId, [face.vertexIds[(index - 1 + n) % n], face.vertexIds[(index + 1) % n]]);
  });

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
  if (isTwoCell(topology)) {
    // THE TRIANGLE SEED: a 2-cell's corner holds an OPEN ring of two — its neighbours in the face's cycle
    return topology.vertexIds.every((vertexId) => (topology.orderedNeighborsByVertex.get(vertexId) ?? []).length === 2);
  }

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

function averageVertexColors(colorA: string, colorB: string): string {
  const rgbA = parseHexColor(colorA);
  const rgbB = parseHexColor(colorB);

  if (!rgbA || !rgbB) {
    return DEFAULT_MIDPOINT_COLOR;
  }

  return formatHexColor([
    Math.round((rgbA[0] + rgbB[0]) / 2),
    Math.round((rgbA[1] + rgbB[1]) / 2),
    Math.round((rgbA[2] + rgbB[2]) / 2),
  ]);
}

function parseHexColor(color: string): [number, number, number] | null {
  const match = /^#([0-9a-f]{6})$/i.exec(color);

  if (!match) {
    return null;
  }

  const hex = match[1];

  return [
    Number.parseInt(hex.slice(0, 2), 16),
    Number.parseInt(hex.slice(2, 4), 16),
    Number.parseInt(hex.slice(4, 6), 16),
  ];
}

function formatHexColor(rgb: [number, number, number]): string {
  return `#${rgb.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

function createParentCellFaces(
  shapeId: string,
  parentCellId: string,
  sourceFaces: Face[],
): Face[] {
  return sourceFaces.map((face) => {
    // C-14 — THE RECORD RIDES THE FACE: the person's triads on the dissected cell's face (positional in the corner order this
    // copy keeps — `vertexIds: face.vertexIds`) onto its parent-cell-face; the triads and nothing else of the packet; absent stays absent
    const triads = carriedTriads(face.data);
    const verdicts = verdictsOn(face); // MODES-1 · B3 — the verdicts ride the face with the triads, positional in the same corner order
    return {
      id: makeFaceId(shapeId, 'parent-cell-face', face.id, face.vertexIds),
      vertexIds: face.vertexIds,
      role: 'parent-cell-face',
      sourceCellId: parentCellId,
      sourceFaceId: face.id,
      // the copy RIDES the source's owned atom (additive — absent stays absent)
      ...(face.cornerAngles ? { cornerAngles: face.cornerAngles } : {}),
      ...(triads !== undefined || verdicts.length > 0 ? { data: { ...(triads !== undefined ? { [TRIADS_KEY]: triads } : {}), ...(verdicts.length > 0 ? { [VERDICTS_KEY]: verdicts as unknown as JsonValue } : {}) } } : {}),
      lineage: deriveFromSourceFace(face.id, shapeId),
    };
  });
}

function createCoreCell(
  topology: SourceTopology,
  shapeId: string,
  generationDepth: number,
  parentCellId: string,
  midpointIds: Map<string, VertexId>,
  vertices: Record<VertexId, Vertex>,
): CellWithFaces {
  const vertexIds = topology.edges.map((edge) => getMidpointId(midpointIds, ...edge.vertexIds));
  const cellId = makeCellId(shapeId, 'core', parentCellId, vertexIds);
  const faces: Face[] = [
    ...topology.faces.map((sourceFace) => {
      const faceVertexIds = midpointLoopForFace(sourceFace, midpointIds);
      // MINTED medial face — R2: the angles acos-IMPORTED from the carried
      // midpoint positions (measure, never stamp); malformed ⇒ un-owned
      const trueAngles = importCornerAngles(faceVertexIds, vertices);

      return {
        id: makeFaceId(shapeId, 'dissection-core-face', sourceFace.id, faceVertexIds),
        vertexIds: faceVertexIds,
        role: 'dissection-core-face' as const,
        sourceCellId: cellId,
        sourceFaceId: sourceFace.id,
        ...(trueAngles ? { cornerAngles: trueAngles } : {}),
        lineage: deriveFromSourceFace(sourceFace.id, shapeId),
      };
    }),
    // THE TRIANGLE SEED: a 2-cell's corner has no vertex figure (its ring is open) — the core of a polygon is its medial polygon alone
    ...(isTwoCell(topology) ? [] : topology.vertexIds).map((sourceVertexId) => {
      const faceVertexIds = midpointRingForVertex(topology, sourceVertexId, midpointIds);
      // MINTED medial face — R2: the angles acos-IMPORTED from the carried
      // midpoint positions (measure, never stamp); malformed ⇒ un-owned
      const trueAngles = importCornerAngles(faceVertexIds, vertices);

      return {
        id: makeFaceId(shapeId, 'dissection-core-face', sourceVertexId, faceVertexIds),
        vertexIds: faceVertexIds,
        role: 'dissection-core-face' as const,
        sourceCellId: cellId,
        sourceVertexId,
        ...(trueAngles ? { cornerAngles: trueAngles } : {}),
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
  vertices: Record<VertexId, Vertex>,
): CellWithFaces {
  const neighborRing = getNeighborRing(topology, sourceVertexId);
  const baseVertexIds = midpointRingForVertex(topology, sourceVertexId, midpointIds);
  const vertexIds = [sourceVertexId, ...baseVertexIds];
  const cellId = makeCellId(shapeId, 'residue', sourceVertexId, vertexIds);
  const faces = createResidueFaces(topology, shapeId, cellId, sourceVertexId, neighborRing, midpointIds, vertices);

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
  if (sourceTopology === 'triangle') {
    return 'triangle'; // THE TRIANGLE SEED: the medial triangle of a triangle
  }

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
  if (sourceTopology === 'triangle') {
    return 'triangle'; // THE TRIANGLE SEED: a corner triangle of a triangle
  }

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
  vertices: Record<VertexId, Vertex>,
): Face[] {
  if (isTwoCell(topology)) {
    // THE TRIANGLE SEED: a 2-cell's residue is the CORNER TRIANGLE — one face, [m_previous, corner, m_next] in the parent face's own
    // winding (the medial face follows that winding too, so the whole cut is wound as the face was); its source is the one face, its
    // lineage the face and the corner, as a side face's; no base — a 3-cell's residue base is its corner's vertex figure, which a
    // polygon's corner has not
    const [previous, next] = neighborRing;
    const vertexIds = [
      getMidpointId(midpointIds, sourceVertexId, previous),
      sourceVertexId,
      getMidpointId(midpointIds, sourceVertexId, next),
    ];
    const sourceFace = topology.faces[0];
    const trueAngles = importCornerAngles(vertexIds, vertices);

    return [
      {
        id: makeFaceId(shapeId, 'dissection-residue-face', `${cellId}:corner`, vertexIds),
        vertexIds,
        role: 'dissection-residue-face',
        sourceCellId: cellId,
        sourceFaceId: sourceFace.id,
        sourceVertexId,
        ...(trueAngles ? { cornerAngles: trueAngles } : {}),
        lineage: deriveGeneratedFaceLineage(shapeId, sourceFace.id, sourceVertexId),
      },
    ];
  }

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
    // MINTED residue side — R2: the angles acos-IMPORTED from the carried
    // positions (measure, never stamp); malformed ⇒ un-owned
    const sideAngles = importCornerAngles(vertexIds, vertices);

    faces.push({
      id: makeFaceId(shapeId, 'dissection-residue-face', `${cellId}:side:${index}`, vertexIds),
      vertexIds,
      role: 'dissection-residue-face',
      sourceCellId: cellId,
      sourceFaceId: sourceFace?.id,
      sourceVertexId,
      ...(sideAngles ? { cornerAngles: sideAngles } : {}),
      lineage: deriveGeneratedFaceLineage(shapeId, sourceFace?.id, sourceVertexId),
    });
  }

  const baseVertexIds = midpointRingForVertex(topology, sourceVertexId, midpointIds);
  // MINTED residue base — R2: the angles acos-IMPORTED from the carried
  // positions (measure, never stamp); malformed ⇒ un-owned
  const baseAngles = importCornerAngles(baseVertexIds, vertices);

  faces.push({
    id: makeFaceId(shapeId, 'dissection-residue-face', `${cellId}:base`, baseVertexIds),
    vertexIds: baseVertexIds,
    role: 'dissection-residue-face',
    sourceCellId: cellId,
    sourceVertexId,
    ...(baseAngles ? { cornerAngles: baseAngles } : {}),
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

/** ONE EDGE, ONE CHILD — the midpoint an earlier dissection made on this pair, read off the parent's own record (`createdBy`: the act
 * and the pair), or null where none was made; the vertex's position is the pair's midpoint already */
function midpointAlreadyMade(parent: Shape, a: VertexId, b: VertexId): Vertex | null {
  const key = canonicalEdgeKey(a, b);

  return (
    Object.values(parent.vertices).find(
      (vertex) =>
        vertex.createdBy.operation === 'ambo-dissection' &&
        vertex.createdBy.sourceVertexIds.length === 2 &&
        canonicalEdgeKey(vertex.createdBy.sourceVertexIds[0], vertex.createdBy.sourceVertexIds[1]) === key,
    ) ?? null
  );
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

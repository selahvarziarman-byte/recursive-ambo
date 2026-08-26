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
// THE ASCENT STANCE-STAMP (2026-08-02) is RETIRED here by R2 (2026-08-14,
// the Sovereign's D5 finding): a MINTED split face no longer assumes the
// regular constant — its angles are acos-IMPORTED from the carried vertex
// positions (measure, never stamp; malformed ⇒ un-owned). A COPIED face
// still RIDES its source's owned angles unchanged — EXCEPT across R1's
// metric correction below, which no stamp crosses.
import { importCornerAngles } from './cornerAngleImport';

// ---------------------------------------------------------------------------
// R1 — THE METRIC RELAXATION (B-107; built to the researcher's seal
// SEAL_R1_THE_METRIC_RELAXATION_t_equals_one_over_phi.md, never re-derived
// here). The diagonalization used to carry the cuboctahedron's positions
// verbatim: 12 vertices at the cyclic perms of (0,±1,±1)·h — icosahedron
// COMBINATORICS on cuboctahedron METRIC, icosahedron-SHAPED but never
// regular (the split squares truly owned 45·45·90; R2's import told the
// truth about a wrong metric). The relaxation moves the 12 onto the same
// family at t = 1/φ — the UNIQUE t making the two edge classes (short 2t ·
// long √(t²+(1−t)²+1)) equal, i.e. the positive root of t² + t − 1 — IN
// PLACE: same vertex ids, and the face/edge ids (which encode vertex ids)
// are byte-identical BY CONSTRUCTION. The correction MARKS itself on each
// moved vertex's packet (a trace — the meaning of the act) and RE-BEGETS
// NOTHING: no new vertices, no genealogy edge, createdVertexIds stays [].
// ⛔ THE SEAL'S TRAP, honoured: the landing is verified on the FIXED CARRIED
// COMBINATORICS — the 20 result faces' 60 corner angles within ε = 1e-6 rad
// of 60° — NEVER a distance-derived graph (which self-selects equal edges
// and reads 60° for ANY t: a test that cannot fail). The t-slot assignment
// has a chirality that must agree with the diagonal matching's; both are
// tried and the landing DECIDES. A cuboctahedron cell whose positions this
// recognizer cannot read (a rotated or sheared frame) stands UNRELAXED with
// carried positions — the honest carry, byte-identical to the pre-R1
// behavior, and NO mark is minted (nothing fabricated).
// ---------------------------------------------------------------------------

const RELAX_T = (Math.sqrt(5) - 1) / 2; // 1/φ — the seal §1's derived target
const RELAX_EPS_RAD = 1e-6; // the seal §2's ε — on the MEASURED angle, never positions
const REGULAR_TRIANGLE_RAD = Math.PI / 3;
// the trace, one producer — the witness pins this exact string
export const R1_RELAXATION_MARK = 'metric-relaxed · t = 1/φ (R1)';

function relaxedIcosahedronPositions(
  vertices: Record<VertexId, Vertex>,
  cellVertexIds: VertexId[],
  carriedFaceCycles: VertexId[][],
): Map<VertexId, [number, number, number]> | null {
  // recognize the family: every position carries exactly one ~zero coordinate
  // and two coordinates of one shared magnitude h (the cuboctahedron's edge
  // midpoints in the axis-aligned frame)
  let h = 0;
  for (const id of cellVertexIds) {
    const p = vertices[id]?.position;
    if (!p) return null;
    for (const x of p) h = Math.max(h, Math.abs(x));
  }
  if (h < 1e-9) return null;
  const zeroAxisOf = new Map<VertexId, number>();
  for (const id of cellVertexIds) {
    const p = vertices[id].position;
    const magnitudes = p.map((x) => Math.abs(x) / h);
    const zeroes = magnitudes.filter((m) => m < 1e-9).length;
    const ones = magnitudes.filter((m) => Math.abs(m - 1) < 1e-9).length;
    if (zeroes !== 1 || ones !== 2) return null;
    zeroAxisOf.set(id, p.findIndex((x) => Math.abs(x) / h < 1e-9));
  }
  // both chiralities of the t-slot assignment; the seal's invariant — the 60
  // corner angles of the CARRIED faces — decides which one lands
  for (const chirality of [1, 2]) {
    const candidate = new Map<VertexId, [number, number, number]>();
    for (const id of cellVertexIds) {
      const p = vertices[id].position;
      const tAxis = ((zeroAxisOf.get(id) as number) + chirality) % 3;
      const q: [number, number, number] = [p[0], p[1], p[2]];
      q[tAxis] = Math.sign(p[tAxis]) * RELAX_T * h;
      candidate.set(id, q);
    }
    const positionOf = (id: VertexId): [number, number, number] | undefined =>
      candidate.get(id) ?? (vertices[id]?.position as [number, number, number] | undefined);
    let maxDeviation = 0;
    let malformed = false;
    for (const cycle of carriedFaceCycles) {
      for (let k = 0; k < cycle.length && !malformed; k += 1) {
        const v = positionOf(cycle[k]);
        const prev = positionOf(cycle[(k - 1 + cycle.length) % cycle.length]);
        const next = positionOf(cycle[(k + 1) % cycle.length]);
        if (!v || !prev || !next) {
          malformed = true;
          break;
        }
        const e1 = [prev[0] - v[0], prev[1] - v[1], prev[2] - v[2]];
        const e2 = [next[0] - v[0], next[1] - v[1], next[2] - v[2]];
        const n1 = Math.hypot(e1[0], e1[1], e1[2]);
        const n2 = Math.hypot(e2[0], e2[1], e2[2]);
        if (n1 < 1e-12 || n2 < 1e-12) {
          malformed = true;
          break;
        }
        const cos = (e1[0] * e2[0] + e1[1] * e2[1] + e1[2] * e2[2]) / (n1 * n2);
        const angle = Math.acos(Math.max(-1, Math.min(1, cos)));
        maxDeviation = Math.max(maxDeviation, Math.abs(angle - REGULAR_TRIANGLE_RAD));
      }
      if (malformed) break;
    }
    if (!malformed && maxDeviation <= RELAX_EPS_RAD) return candidate;
  }
  return null;
}

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
  // R1 — the relaxation runs BEFORE any face mints, so every acos-import
  // below measures the RELAXED metric; the moved vertices carry the mark.
  // The carried verification cycles ARE the result's 20 faces (8 preserved
  // triangles + 12 split halves) — the seal's fixed combinatorics.
  const carriedFaceCycles = [
    ...topology.triangleFaces.map((face) => face.vertexIds),
    ...diagonalChoices.flatMap((choice) => choice.splitFaces),
  ];
  const relaxedPositions = relaxedIcosahedronPositions(vertices, topology.vertexIds, carriedFaceCycles);
  if (relaxedPositions) {
    for (const [vertexId, position] of relaxedPositions) {
      const vertex = vertices[vertexId];
      vertices[vertexId] = {
        ...vertex,
        position,
        data: { ...vertex.data, tags: [...vertex.data.tags, R1_RELAXATION_MARK] },
      };
    }
  }
  // R1: after a metric correction NO STAMP CROSSES IT — every face on the
  // moved vertices re-derives its angle atom from the relaxed positions (the
  // D6 law: no seal can catch a stale stamp over new positions, so none may
  // survive one); with no relaxation the copies ride byte-identically.
  const relaxedVertices = relaxedPositions ? vertices : null;
  const parentFaces = createParentCellFaces(shapeId, parentCellId, topology.faces, relaxedVertices);
  const resultFaces = createPyritohedralFaces(shapeId, sourceCell.id, topology, diagonalChoices, vertices, relaxedVertices);
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
  relaxedVertices: Record<VertexId, Vertex> | null,
): Face[] {
  return sourceFaces.map((face) => ({
    id: makeFaceId(shapeId, 'parent-cell-face', face.id, face.vertexIds),
    vertexIds: face.vertexIds,
    role: 'parent-cell-face',
    sourceCellId: parentCellId,
    sourceFaceId: face.id,
    // the copy RIDES the source's owned atom (additive — absent stays absent)
    // — UNLESS R1 moved these vertices: then the atom RE-DERIVES from the
    // relaxed positions (a parent-record square over relaxed positions is a
    // skew quad; the stamp of its old 90s would be the stale stamp D6 names)
    ...ownedAngleAtom(face, relaxedVertices),
    lineage: deriveFromSourceFace(face.id, shapeId),
  }));
}

// R1 — the one rule for copied atoms across the correction: re-derive over
// moved vertices (measure, never stamp; malformed ⇒ un-owned), copy verbatim
// when nothing moved.
function ownedAngleAtom(
  face: Face,
  relaxedVertices: Record<VertexId, Vertex> | null,
): Record<string, never> | { cornerAngles: number[] } {
  if (relaxedVertices) {
    const trueAngles = importCornerAngles(face.vertexIds, relaxedVertices);
    return trueAngles ? { cornerAngles: trueAngles } : {};
  }
  return face.cornerAngles ? { cornerAngles: face.cornerAngles } : {};
}

function createPyritohedralFaces(
  shapeId: string,
  sourceCellId: string,
  topology: CuboctahedronSourceTopology,
  diagonalChoices: DiagonalChoice[],
  vertices: Record<VertexId, Vertex>,
  relaxedVertices: Record<VertexId, Vertex> | null,
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
      // the copy RIDES the source's owned atom — unless R1 moved the
      // vertices: then it re-derives (the preserved triangles stay
      // equilateral at t=1/φ, but the atom must be MEASURED there, not
      // inherited across the correction)
      ...ownedAngleAtom(face, relaxedVertices),
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
    choice.splitFaces.map((vertexIds, index) => {
      // MINTED split face — R2 (the Sovereign's D5 finding cured at the root):
      // the angles acos-IMPORTED from the carried positions — a square's
      // diagonal halves TRULY own 45·45·90, never a stamped 60·60·60
      // (measure, never stamp); malformed ⇒ un-owned
      const trueAngles = importCornerAngles(vertexIds, vertices);

      return {
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
        ...(trueAngles ? { cornerAngles: trueAngles } : {}),
        lineage: deriveFaceLineage(
          [
            packetSourceRef('face', choice.sourceFace.id, 'source-face'),
            packetSourceRef('cell', sourceCellId, 'source-cell'),
          ],
          shapeId,
          'derived-from-face',
        ),
      };
    }),
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

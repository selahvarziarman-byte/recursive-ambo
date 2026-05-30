import type { Cell, Edge, EdgeId, Face, FaceId, Shape, VertexId } from '../types/geometry';
import { canonicalEdgeKey } from './ids';
import { getCellFaces } from './shape';

export type DiagonalizationMatrixEntryLabel = 'AC' | 'AD' | 'BC' | 'BD' | 'AB' | 'CD';

export interface DiagonalizationMatrixEntry {
  label: DiagonalizationMatrixEntryLabel;
  vertexIds: [VertexId, VertexId];
  edgeId: EdgeId | null;
  edgeRole: Edge['role'] | null;
  isMatrixDiagonal: boolean;
  isChosenConstructionDiagonal: boolean;
  isAlternateDiagonal: boolean;
  isBoundary: boolean;
  isOffDiagonalBoundary: boolean;
  isImplicitBoundary: boolean;
}

export interface DiagonalizationMatrixEntries {
  ac: DiagonalizationMatrixEntry;
  ad: DiagonalizationMatrixEntry;
  bc: DiagonalizationMatrixEntry;
  bd: DiagonalizationMatrixEntry;
  ab: DiagonalizationMatrixEntry;
  cd: DiagonalizationMatrixEntry;
}

export interface DiagonalizationMatrixReport {
  contextCellId: string;
  sourceSquareFaceId: FaceId;
  displayFaceId: FaceId;
  orderedVertexIds: [VertexId, VertexId, VertexId, VertexId];
  rows: [VertexId, VertexId];
  columns: [VertexId, VertexId];
  entries: DiagonalizationMatrixEntries;
  diagonalEntries: [DiagonalizationMatrixEntry, DiagonalizationMatrixEntry];
  offDiagonalEntries: [DiagonalizationMatrixEntry, DiagonalizationMatrixEntry];
  implicitBoundaryEntries: [DiagonalizationMatrixEntry, DiagonalizationMatrixEntry];
  chosenEntry: DiagonalizationMatrixEntry | null;
  alternateEntry: DiagonalizationMatrixEntry | null;
  problems: string[];
  status: 'ok' | 'failed';
}

interface DiagonalizationContext {
  cell: Cell;
}

export function buildDiagonalizationMatrices(
  shape: Shape,
  cell: Cell | null,
): DiagonalizationMatrixReport[] {
  const context = resolveDiagonalizationContext(shape, cell);

  if (!context) {
    return [];
  }

  const faces = getCellFaces(shape, context.cell);
  const squareFaces = faces.filter((face) => face.vertexIds.length === 4);

  if (!squareFaces.length) {
    return [];
  }

  const boundaryEdgesByKey = getCellBoundaryEdgeMap(shape, context.cell);
  const resultEdgesByKey = new Map(
    shape.edges.map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]),
  );
  const constructionEdgesBySourceFaceId = getConstructionEdgesBySourceFaceId(shape);

  return squareFaces.map((face) =>
    buildMatrixReport({
      shape,
      contextCell: context.cell,
      face,
      boundaryEdgesByKey,
      resultEdgesByKey,
      constructionEdgesBySourceFaceId,
    }),
  );
}

function resolveDiagonalizationContext(
  shape: Shape,
  cell: Cell | null,
): DiagonalizationContext | null {
  if (!cell) {
    return null;
  }

  if (cell.kind === 'core' && cell.topology === 'pyritohedral-icosahedron') {
    const parentCell = cell.parentCellId
      ? shape.cells.find((candidate) => candidate.id === cell.parentCellId) ?? null
      : null;

    return isPyritohedralParentCell(shape, parentCell) ? { cell: parentCell } : null;
  }

  return isPyritohedralParentCell(shape, cell) ? { cell } : null;
}

function isPyritohedralParentCell(shape: Shape, cell: Cell | null): cell is Cell {
  if (!cell || cell.kind !== 'parent' || cell.topology !== 'cuboctahedron') {
    return false;
  }

  return shape.cells.some(
    (candidate) =>
      candidate.parentCellId === cell.id &&
      candidate.sourceOperation === 'pyritohedral-diagonalization' &&
      candidate.topology === 'pyritohedral-icosahedron',
  );
}

function buildMatrixReport({
  shape,
  contextCell,
  face,
  boundaryEdgesByKey,
  resultEdgesByKey,
  constructionEdgesBySourceFaceId,
}: {
  shape: Shape;
  contextCell: Cell;
  face: Face;
  boundaryEdgesByKey: Map<string, Edge>;
  resultEdgesByKey: Map<string, Edge>;
  constructionEdgesBySourceFaceId: Map<string, Edge[]>;
}): DiagonalizationMatrixReport {
  const problems: string[] = [];
  const [a, b, c, d] = face.vertexIds;
  const orderedVertexIds: [VertexId, VertexId, VertexId, VertexId] = [a, b, c, d];
  const sourceSquareFaceId = face.sourceFaceId ?? face.id;
  const constructionEdges = constructionEdgesBySourceFaceId.get(sourceSquareFaceId) ?? [];
  const constructionKeys = new Set(
    constructionEdges.map((edge) => canonicalEdgeKey(...edge.vertexIds)),
  );
  const entries: DiagonalizationMatrixEntries = {
    ac: makeMatrixEntry('AC', [a, c], 'diagonal'),
    ad: makeMatrixEntry('AD', [a, d], 'off-diagonal'),
    bc: makeMatrixEntry('BC', [b, c], 'off-diagonal'),
    bd: makeMatrixEntry('BD', [b, d], 'diagonal'),
    ab: makeMatrixEntry('AB', [a, b], 'implicit'),
    cd: makeMatrixEntry('CD', [c, d], 'implicit'),
  };
  const diagonalEntries: [DiagonalizationMatrixEntry, DiagonalizationMatrixEntry] = [
    entries.ac,
    entries.bd,
  ];
  const offDiagonalEntries: [DiagonalizationMatrixEntry, DiagonalizationMatrixEntry] = [
    entries.ad,
    entries.bc,
  ];
  const implicitBoundaryEntries: [DiagonalizationMatrixEntry, DiagonalizationMatrixEntry] = [
    entries.ab,
    entries.cd,
  ];

  if (face.vertexIds.length !== 4) {
    problems.push(`expected 4 vertices, found ${face.vertexIds.length}`);
  }

  const missingVertexIds = orderedVertexIds.filter((vertexId) => !shape.vertices[vertexId]);

  if (missingVertexIds.length) {
    problems.push(`missing vertices: ${missingVertexIds.join(', ')}`);
  }

  for (const entry of Object.values(entries)) {
    const entryKey = canonicalEdgeKey(entry.vertexIds[0], entry.vertexIds[1]);
    const boundaryEdge = boundaryEdgesByKey.get(entryKey) ?? null;
    const resultEdge = resultEdgesByKey.get(entryKey) ?? null;

    entry.isBoundary = Boolean(boundaryEdge);
    entry.edgeId = resultEdge?.id ?? boundaryEdge?.id ?? null;
    entry.edgeRole = resultEdge?.role ?? boundaryEdge?.role ?? null;
    entry.isChosenConstructionDiagonal = constructionKeys.has(entryKey);
  }

  for (const entry of diagonalEntries) {
    entry.isAlternateDiagonal = !entry.isChosenConstructionDiagonal;
  }

  const chosenEntries = diagonalEntries.filter((entry) => entry.isChosenConstructionDiagonal);
  const alternateEntries = diagonalEntries.filter((entry) => entry.isAlternateDiagonal);

  if (constructionEdges.length !== 1) {
    problems.push(
      `expected 1 construction diagonal for source square, found ${constructionEdges.length}`,
    );
  }

  if (chosenEntries.length !== 1) {
    problems.push(`expected exactly one matrix diagonal chosen, found ${chosenEntries.length}`);
  }

  for (const edge of constructionEdges) {
    const key = canonicalEdgeKey(...edge.vertexIds);

    if (!diagonalEntries.some((entry) => canonicalEdgeKey(...entry.vertexIds) === key)) {
      problems.push(`construction edge ${edge.vertexIds.join('-')} is not AC or BD`);
    }

    if (edge.role !== 'construction-diagonal') {
      problems.push(`chosen edge ${edge.id} missing construction-diagonal role`);
    }
  }

  const diagonalBoundaryEntries = diagonalEntries.filter((entry) => entry.isBoundary);
  const offDiagonalNonBoundaryEntries = offDiagonalEntries.filter((entry) => !entry.isBoundary);
  const implicitNonBoundaryEntries = implicitBoundaryEntries.filter((entry) => !entry.isBoundary);

  if (diagonalBoundaryEntries.length) {
    problems.push(
      `matrix diagonals were boundary edges: ${diagonalBoundaryEntries
        .map((entry) => entry.label)
        .join(', ')}`,
    );
  }

  if (offDiagonalNonBoundaryEntries.length) {
    problems.push(
      `off-diagonal entries were not boundary edges: ${offDiagonalNonBoundaryEntries
        .map((entry) => entry.label)
        .join(', ')}`,
    );
  }

  if (implicitNonBoundaryEntries.length) {
    problems.push(
      `implicit entries were not boundary edges: ${implicitNonBoundaryEntries
        .map((entry) => entry.label)
        .join(', ')}`,
    );
  }

  for (const entry of [...offDiagonalEntries, ...implicitBoundaryEntries]) {
    if (entry.edgeRole === 'construction-diagonal') {
      problems.push(`${entry.label} boundary entry was marked construction-diagonal`);
    }
  }

  return {
    contextCellId: contextCell.id,
    sourceSquareFaceId,
    displayFaceId: face.id,
    orderedVertexIds,
    rows: [a, b],
    columns: [c, d],
    entries,
    diagonalEntries,
    offDiagonalEntries,
    implicitBoundaryEntries,
    chosenEntry: chosenEntries[0] ?? null,
    alternateEntry: chosenEntries.length === 1 ? alternateEntries[0] ?? null : null,
    problems,
    status: problems.length ? 'failed' : 'ok',
  };
}

function makeMatrixEntry(
  label: DiagonalizationMatrixEntryLabel,
  vertexIds: [VertexId, VertexId],
  role: 'diagonal' | 'off-diagonal' | 'implicit',
): DiagonalizationMatrixEntry {
  return {
    label,
    vertexIds,
    edgeId: null,
    edgeRole: null,
    isMatrixDiagonal: role === 'diagonal',
    isChosenConstructionDiagonal: false,
    isAlternateDiagonal: false,
    isBoundary: false,
    isOffDiagonalBoundary: role === 'off-diagonal',
    isImplicitBoundary: role === 'implicit',
  };
}

function getConstructionEdgesBySourceFaceId(shape: Shape): Map<string, Edge[]> {
  const edgesBySourceFaceId = new Map<string, Edge[]>();

  for (const edge of shape.edges) {
    if (edge.role !== 'construction-diagonal' || !edge.sourceFaceId) {
      continue;
    }

    const edges = edgesBySourceFaceId.get(edge.sourceFaceId) ?? [];
    edges.push(edge);
    edgesBySourceFaceId.set(edge.sourceFaceId, edges);
  }

  return edgesBySourceFaceId;
}

function getCellBoundaryEdgeMap(shape: Shape, cell: Cell): Map<string, Edge> {
  const edgesByKey = new Map(shape.edges.map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]));
  const boundaryEdgesByKey = new Map<string, Edge>();

  for (const face of getCellFaces(shape, cell)) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = canonicalEdgeKey(a, b);
      const edge = edgesByKey.get(key);

      if (edge) {
        boundaryEdgesByKey.set(key, edge);
      }
    }
  }

  return boundaryEdgesByKey;
}

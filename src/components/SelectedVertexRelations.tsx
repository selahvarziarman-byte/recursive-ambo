import { useMemo } from 'react';
import { formatVec3 } from '../lib/shape';
import { type InspectionHoverTarget, useGeometryStore } from '../store/geometryStore';
import type {
  Cell,
  Face,
  PacketData,
  Shape,
  Vec3,
  Vertex,
  VertexDataPacket,
  VertexId,
} from '../types/geometry';

export function SelectedVertexRelations({
  shape,
  selectedCell,
  vertexId,
}: {
  shape: Shape;
  selectedCell: Cell | null;
  vertexId: VertexId;
}) {
  const selectVertex = useGeometryStore((state) => state.selectVertex);
  const setHoverTarget = useGeometryStore((state) => state.setHoverTarget);
  const antipodalResult = useMemo(
    () => findCellAntipodalVertices(shape, selectedCell, vertexId),
    [selectedCell, shape, vertexId],
  );
  const faceOppositeResult = useMemo(
    () => findFaceLocalOpposites(shape, selectedCell, vertexId),
    [selectedCell, shape, vertexId],
  );

  return (
    <>
      <dt className="text-stone-500">Antipodal</dt>
      <dd className="min-w-0 text-stone-200">
        <AntipodalVertexValue
          result={antipodalResult}
          shape={shape}
          onSelectVertex={selectVertex}
        />
      </dd>
      <dt className="text-stone-500">Face opposites</dt>
      <dd className="min-w-0 text-stone-200">
        <FaceOppositeValue
          result={faceOppositeResult}
          shape={shape}
          onSelectVertex={selectVertex}
          onHoverTarget={setHoverTarget}
        />
      </dd>
    </>
  );
}

type AntipodalVertexResult =
  | { status: 'select-cell' }
  | { status: 'outside-cell' }
  | { status: 'matches'; vertices: Vertex[] };

type FaceOppositeResult =
  | { status: 'select-cell' }
  | { status: 'matches'; rows: FaceOppositeRow[] };

type FaceOppositeRow =
  | { status: 'missing-face'; faceId: string }
  | { status: 'duplicate-selected-vertex'; face: Face; selectedCount: number }
  | {
      status: 'triangle';
      face: Face;
      oppositeEdgeVertexIds: [VertexId, VertexId];
      midpoint: Vec3 | null;
      matches: Vertex[];
    }
  | { status: 'quadrilateral'; face: Face; oppositeVertexId: VertexId; oppositeVertex: Vertex | null }
  | {
      status: 'triangle-target';
      face: Face;
      sourceVertexId: VertexId;
      sourceVertex: Vertex | null;
      oppositeEdgeVertexIds: [VertexId, VertexId];
      targetVertex: Vertex;
      midpoint: Vec3;
    }
  | {
      status: 'quadrilateral-target';
      face: Face;
      sourceVertexId: VertexId;
      sourceVertex: Vertex | null;
      oppositeVertexId: VertexId;
      targetVertex: Vertex;
      matchKind: 'id' | 'position';
    }
  | { status: 'unsupported'; face: Face; size: number };

function AntipodalVertexValue({
  result,
  shape,
  onSelectVertex,
}: {
  result: AntipodalVertexResult;
  shape: Shape;
  onSelectVertex: (vertexId: VertexId) => void;
}) {
  if (result.status === 'select-cell') {
    return <span className="text-stone-500">select a cell</span>;
  }

  if (result.status === 'outside-cell') {
    return <span className="text-stone-500">selected vertex outside selected cell</span>;
  }

  if (result.vertices.length === 0) {
    return <span>none</span>;
  }

  if (result.vertices.length > 1) {
    return (
      <span className="break-words">
        ambiguous: {result.vertices.map((vertex) => shortenId(vertex.id)).join(', ')}
      </span>
    );
  }

  const antipodalVertex = result.vertices[0];
  const label = getVertexDisplayLabel(shape, antipodalVertex.id);
  const shortId = shortenId(antipodalVertex.id);

  return (
    <button
      type="button"
      onClick={() => onSelectVertex(antipodalVertex.id)}
      className="min-w-0 text-left text-teal-200 transition hover:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
    >
      <span className="block truncate">{label}</span>
      <span className="block truncate font-mono text-xs text-stone-500">{shortId}</span>
    </button>
  );
}

function FaceOppositeValue({
  result,
  shape,
  onSelectVertex,
  onHoverTarget,
}: {
  result: FaceOppositeResult;
  shape: Shape;
  onSelectVertex: (vertexId: VertexId) => void;
  onHoverTarget: (target: InspectionHoverTarget | null) => void;
}) {
  if (result.status === 'select-cell') {
    return <span className="text-stone-500">select a cell</span>;
  }

  if (!result.rows.length) {
    return <span className="text-stone-500">none in selected cell faces</span>;
  }

  return (
    <div className="grid gap-2">
      {result.rows.map((row) => (
        <FaceOppositeRowValue
          key={getFaceOppositeRowKey(row)}
          row={row}
          shape={shape}
          onSelectVertex={onSelectVertex}
          onHoverTarget={onHoverTarget}
        />
      ))}
    </div>
  );
}

function FaceOppositeRowValue({
  row,
  shape,
  onSelectVertex,
  onHoverTarget,
}: {
  row: FaceOppositeRow;
  shape: Shape;
  onSelectVertex: (vertexId: VertexId) => void;
  onHoverTarget: (target: InspectionHoverTarget | null) => void;
}) {
  if (row.status === 'missing-face') {
    return (
      <span className="block rounded border border-stone-800 bg-stone-950/70 px-2 py-1.5 text-xs text-stone-500">
        missing face: <span className="font-mono">{shortenId(row.faceId)}</span>
      </span>
    );
  }

  if (row.status === 'duplicate-selected-vertex') {
    return (
      <span className="block rounded border border-stone-800 bg-stone-950/70 px-2 py-1.5 text-xs text-stone-500">
        face {getFaceDisplayLabel(shape, row.face.id)}: selected vertex appears {row.selectedCount}{' '}
        times
      </span>
    );
  }

  if (row.status === 'triangle') {
    return (
      <div
        onPointerEnter={() =>
          onHoverTarget({ kind: 'edge', vertexIds: row.oppositeEdgeVertexIds })
        }
        onPointerLeave={() => onHoverTarget(null)}
        className="rounded border border-stone-800 bg-stone-950/70 px-2 py-1.5 text-xs"
      >
        <span className="block truncate text-stone-500">
          face {getFaceDisplayLabel(shape, row.face.id)}
        </span>
        <span className="mt-1 block text-stone-300">
          opposite edge midpoint: {formatEdgeRef(shape, row.oppositeEdgeVertexIds)}
        </span>
        <TriangleMidpointMatchValue
          row={row}
          shape={shape}
          onSelectVertex={onSelectVertex}
        />
      </div>
    );
  }

  if (row.status === 'quadrilateral') {
    const label = getVertexDisplayLabel(shape, row.oppositeVertexId);
    const shortId = shortenId(row.oppositeVertexId);

    return (
      <div
        onPointerEnter={() =>
          row.oppositeVertex
            ? onHoverTarget({ kind: 'vertex', vertexId: row.oppositeVertex.id })
            : undefined
        }
        onPointerLeave={() => onHoverTarget(null)}
        className="rounded border border-stone-800 bg-stone-950/70 px-2 py-1.5 text-xs"
      >
        <span className="block truncate text-stone-500">
          face {getFaceDisplayLabel(shape, row.face.id)}
        </span>
        <span className="mt-1 block text-stone-300">opposite vertex: {label}</span>
        {row.oppositeVertex ? (
          <button
            type="button"
            onClick={() => onSelectVertex(row.oppositeVertexId)}
            className="mt-1 min-w-0 text-left text-teal-200 transition hover:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <span className="block truncate">Select opposite vertex</span>
            <span className="block truncate font-mono text-[11px] text-stone-500">{shortId}</span>
          </button>
        ) : (
          <span className="mt-1 block font-mono text-[11px] text-stone-500">
            missing vertex: {shortId}
          </span>
        )}
      </div>
    );
  }

  if (row.status === 'triangle-target') {
    const sourceLabel = getVertexDisplayLabel(shape, row.sourceVertexId);
    const sourceShortId = shortenId(row.sourceVertexId);

    return (
      <div
        onPointerEnter={() =>
          onHoverTarget({ kind: 'edge', vertexIds: row.oppositeEdgeVertexIds })
        }
        onPointerLeave={() => onHoverTarget(null)}
        className="rounded border border-stone-800 bg-stone-950/70 px-2 py-1.5 text-xs"
      >
        <span className="block truncate text-stone-500">
          face {getFaceDisplayLabel(shape, row.face.id)}
        </span>
        <span className="mt-1 block text-stone-300">
          this vertex is opposite target for {sourceLabel}
        </span>
        <span className="mt-1 block text-stone-400">
          opposite edge midpoint: {formatEdgeRef(shape, row.oppositeEdgeVertexIds)}
        </span>
        <span className="mt-1 block font-mono text-[11px] text-stone-500">
          midpoint: {formatVec3(row.midpoint)}
        </span>
        {row.sourceVertex ? (
          <button
            type="button"
            onClick={() => onSelectVertex(row.sourceVertexId)}
            className="mt-1 min-w-0 text-left text-teal-200 transition hover:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <span className="block truncate">Select source vertex</span>
            <span className="block truncate font-mono text-[11px] text-stone-500">
              {sourceShortId}
            </span>
          </button>
        ) : (
          <span className="mt-1 block font-mono text-[11px] text-stone-500">
            missing source vertex: {sourceShortId}
          </span>
        )}
      </div>
    );
  }

  if (row.status === 'quadrilateral-target') {
    const sourceLabel = getVertexDisplayLabel(shape, row.sourceVertexId);
    const sourceShortId = shortenId(row.sourceVertexId);
    const targetLabel = getVertexDisplayLabel(shape, row.oppositeVertexId);
    const targetShortId = shortenId(row.oppositeVertexId);

    return (
      <div
        onPointerEnter={() =>
          row.sourceVertex
            ? onHoverTarget({ kind: 'vertex', vertexId: row.sourceVertex.id })
            : undefined
        }
        onPointerLeave={() => onHoverTarget(null)}
        className="rounded border border-stone-800 bg-stone-950/70 px-2 py-1.5 text-xs"
      >
        <span className="block truncate text-stone-500">
          face {getFaceDisplayLabel(shape, row.face.id)}
        </span>
        <span className="mt-1 block text-stone-300">
          this vertex is opposite target for {sourceLabel}
        </span>
        <span className="mt-1 block text-stone-400">
          opposite vertex: {targetLabel}
          {row.matchKind === 'position' ? ' (matched by position)' : ''}
        </span>
        <span className="block truncate font-mono text-[11px] text-stone-500">
          {targetShortId}
        </span>
        {row.sourceVertex ? (
          <button
            type="button"
            onClick={() => onSelectVertex(row.sourceVertexId)}
            className="mt-1 min-w-0 text-left text-teal-200 transition hover:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            <span className="block truncate">Select source vertex</span>
            <span className="block truncate font-mono text-[11px] text-stone-500">
              {sourceShortId}
            </span>
          </button>
        ) : (
          <span className="mt-1 block font-mono text-[11px] text-stone-500">
            missing source vertex: {sourceShortId}
          </span>
        )}
      </div>
    );
  }

  return (
    <span className="block rounded border border-stone-800 bg-stone-950/70 px-2 py-1.5 text-xs text-stone-500">
      face {getFaceDisplayLabel(shape, row.face.id)}: unsupported face size ({row.size})
    </span>
  );
}

function TriangleMidpointMatchValue({
  row,
  shape,
  onSelectVertex,
}: {
  row: Extract<FaceOppositeRow, { status: 'triangle' }>;
  shape: Shape;
  onSelectVertex: (vertexId: VertexId) => void;
}) {
  if (!row.midpoint) {
    return <span className="mt-1 block text-stone-500">endpoint position unavailable</span>;
  }

  if (row.matches.length === 1) {
    const midpointVertex = row.matches[0];
    const label = getVertexDisplayLabel(shape, midpointVertex.id);
    const shortId = shortenId(midpointVertex.id);

    return (
      <button
        type="button"
        onClick={() => onSelectVertex(midpointVertex.id)}
        className="mt-1 min-w-0 text-left text-teal-200 transition hover:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
      >
        <span className="block truncate">Select midpoint vertex</span>
        <span className="block truncate text-stone-300">{label}</span>
        <span className="block truncate font-mono text-[11px] text-stone-500">{shortId}</span>
      </button>
    );
  }

  if (row.matches.length > 1) {
    return (
      <span className="mt-1 block break-words text-stone-500">
        ambiguous actual vertices:{' '}
        {row.matches
          .map((vertex) => `${getVertexDisplayLabel(shape, vertex.id)} (${shortenId(vertex.id)})`)
          .join(', ')}
      </span>
    );
  }

  return (
    <span className="mt-1 block font-mono text-[11px] text-stone-500">
      virtual midpoint: {formatVec3(row.midpoint)}
    </span>
  );
}

function findCellAntipodalVertices(
  shape: Shape,
  cell: Cell | null,
  vertexId: VertexId,
): AntipodalVertexResult {
  if (!cell) {
    return { status: 'select-cell' };
  }

  if (!cell.vertexIds.includes(vertexId)) {
    return { status: 'outside-cell' };
  }

  const selectedVertex = shape.vertices[vertexId];
  const center = cellCentroidForAntipodes(shape, cell);

  if (!selectedVertex || !center) {
    return { status: 'matches', vertices: [] };
  }

  const radius = cellRadiusForAntipodes(shape, cell, center);
  const tolerance = Math.max(1e-5, radius * 1e-4);
  const reflected: Vec3 = [
    2 * center[0] - selectedVertex.position[0],
    2 * center[1] - selectedVertex.position[1],
    2 * center[2] - selectedVertex.position[2],
  ];
  const vertices = cell.vertexIds
    .filter((candidateId) => candidateId !== vertexId)
    .map((candidateId) => shape.vertices[candidateId])
    .filter((candidate): candidate is Vertex => Boolean(candidate))
    .filter((candidate) => distanceVec3(candidate.position, reflected) <= tolerance);

  return { status: 'matches', vertices };
}

function findFaceLocalOpposites(
  shape: Shape,
  cell: Cell | null,
  vertexId: VertexId,
): FaceOppositeResult {
  if (!cell) {
    return { status: 'select-cell' };
  }

  const rows = cell.vertexIds.includes(vertexId)
    ? findSourceFaceOppositeRows(shape, cell, vertexId)
    : findTargetFaceOppositeRows(shape, cell, vertexId);

  return { status: 'matches', rows };
}

function findSourceFaceOppositeRows(
  shape: Shape,
  cell: Cell,
  vertexId: VertexId,
): FaceOppositeRow[] {
  return cell.faceIds
    .map((faceId): FaceOppositeRow | null => {
      const face = shape.faces.find((candidate) => candidate.id === faceId);

      if (!face) {
        return { status: 'missing-face', faceId };
      }

      const selectedCount = face.vertexIds.filter((candidateId) => candidateId === vertexId).length;

      if (selectedCount === 0) {
        return null;
      }

      if (selectedCount > 1) {
        return { status: 'duplicate-selected-vertex', face, selectedCount };
      }

      if (face.vertexIds.length === 3) {
        const oppositeEdgeVertexIds = face.vertexIds.filter(
          (candidateId) => candidateId !== vertexId,
        ) as [VertexId, VertexId];
        const midpoint = getEdgeMidpoint(shape, oppositeEdgeVertexIds);
        const matches = midpoint ? findVerticesAtPosition(shape, cell, midpoint, face) : [];

        return {
          status: 'triangle',
          face,
          oppositeEdgeVertexIds,
          midpoint,
          matches,
        };
      }

      if (face.vertexIds.length === 4) {
        const selectedIndex = face.vertexIds.findIndex((candidateId) => candidateId === vertexId);
        const oppositeVertexId = face.vertexIds[(selectedIndex + 2) % face.vertexIds.length];

        return {
          status: 'quadrilateral',
          face,
          oppositeVertexId,
          oppositeVertex: shape.vertices[oppositeVertexId] ?? null,
        };
      }

      return { status: 'unsupported', face, size: face.vertexIds.length };
    })
    .filter((row): row is FaceOppositeRow => Boolean(row));
}

function findTargetFaceOppositeRows(
  shape: Shape,
  cell: Cell,
  vertexId: VertexId,
): FaceOppositeRow[] {
  const targetVertex = shape.vertices[vertexId];

  if (!targetVertex) {
    return [];
  }

  return cell.faceIds.flatMap((faceId): FaceOppositeRow[] => {
    const face = shape.faces.find((candidate) => candidate.id === faceId);

    if (!face) {
      return [{ status: 'missing-face', faceId }];
    }

    if (face.vertexIds.length === 3) {
      return findTriangleTargetFaceOppositeRows(shape, face, targetVertex);
    }

    if (face.vertexIds.length === 4) {
      return findQuadrilateralTargetFaceOppositeRows(shape, face, targetVertex);
    }

    return [];
  });
}

function findTriangleTargetFaceOppositeRows(
  shape: Shape,
  face: Face,
  targetVertex: Vertex,
): FaceOppositeRow[] {
  const targetPosition = asValidVec3(targetVertex.position);

  if (!targetPosition) {
    return [];
  }

  const tolerance = getFaceOppositeTolerance(shape, face);

  return face.vertexIds.flatMap((sourceVertexId): FaceOppositeRow[] => {
    const oppositeEdgeVertexIds = face.vertexIds.filter(
      (candidateId) => candidateId !== sourceVertexId,
    ) as [VertexId, VertexId];
    const midpoint = getEdgeMidpoint(shape, oppositeEdgeVertexIds);

    if (!midpoint || distanceVec3(targetPosition, midpoint) > tolerance) {
      return [];
    }

    return [
      {
        status: 'triangle-target',
        face,
        sourceVertexId,
        sourceVertex: shape.vertices[sourceVertexId] ?? null,
        oppositeEdgeVertexIds,
        targetVertex,
        midpoint,
      },
    ];
  });
}

function findQuadrilateralTargetFaceOppositeRows(
  shape: Shape,
  face: Face,
  targetVertex: Vertex,
): FaceOppositeRow[] {
  const oppositePairs: Array<[VertexId, VertexId]> = [
    [face.vertexIds[0], face.vertexIds[2]],
    [face.vertexIds[2], face.vertexIds[0]],
    [face.vertexIds[1], face.vertexIds[3]],
    [face.vertexIds[3], face.vertexIds[1]],
  ];
  const targetPosition = asValidVec3(targetVertex.position);
  const tolerance = getFaceOppositeTolerance(shape, face);

  return oppositePairs.flatMap(([sourceVertexId, oppositeVertexId]): FaceOppositeRow[] => {
    const oppositePosition = getValidVertexPosition(shape, oppositeVertexId);
    const isIdMatch = oppositeVertexId === targetVertex.id;
    const isPositionMatch = Boolean(
      targetPosition &&
        oppositePosition &&
        distanceVec3(targetPosition, oppositePosition) <= tolerance,
    );

    if (!isIdMatch && !isPositionMatch) {
      return [];
    }

    return [
      {
        status: 'quadrilateral-target',
        face,
        sourceVertexId,
        sourceVertex: shape.vertices[sourceVertexId] ?? null,
        oppositeVertexId,
        targetVertex,
        matchKind: isIdMatch ? 'id' : 'position',
      },
    ];
  });
}

function getFaceOppositeRowKey(row: FaceOppositeRow): string {
  if (row.status === 'missing-face') {
    return `missing:${row.faceId}`;
  }

  if (row.status === 'triangle-target') {
    return `${row.status}:${row.face.id}:${row.sourceVertexId}:${row.oppositeEdgeVertexIds.join('-')}`;
  }

  if (row.status === 'quadrilateral-target') {
    return `${row.status}:${row.face.id}:${row.sourceVertexId}:${row.oppositeVertexId}`;
  }

  return `${row.status}:${row.face.id}`;
}

function getEdgeMidpoint(shape: Shape, vertexIds: [VertexId, VertexId]): Vec3 | null {
  const a = getValidVertexPosition(shape, vertexIds[0]);
  const b = getValidVertexPosition(shape, vertexIds[1]);

  if (!a || !b) {
    return null;
  }

  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
}

function findVerticesAtPosition(shape: Shape, cell: Cell, position: Vec3, face: Face): Vertex[] {
  const tolerance = getFaceOppositeTolerance(shape, face);
  const cellMatches = uniqueVerticesById(
    cell.vertexIds
      .map((candidateId) => shape.vertices[candidateId])
      .filter((candidate): candidate is Vertex =>
        isVertexNearPosition(candidate, position, tolerance),
      ),
  );

  if (cellMatches.length) {
    return cellMatches;
  }

  return uniqueVerticesById(
    Object.values(shape.vertices).filter((candidate) =>
      isVertexNearPosition(candidate, position, tolerance),
    ),
  );
}

function getFaceOppositeTolerance(shape: Shape, face: Face): number {
  return Math.max(1e-5, getFaceRadius(shape, face) * 1e-4);
}

function isVertexNearPosition(
  vertex: Vertex | undefined,
  position: Vec3,
  tolerance: number,
): vertex is Vertex {
  const candidatePosition = vertex ? asValidVec3(vertex.position) : null;

  return Boolean(candidatePosition && distanceVec3(candidatePosition, position) <= tolerance);
}

function uniqueVerticesById(vertices: Vertex[]): Vertex[] {
  const seen = new Set<VertexId>();

  return vertices.filter((vertex) => {
    if (seen.has(vertex.id)) {
      return false;
    }

    seen.add(vertex.id);
    return true;
  });
}

function getFaceRadius(shape: Shape, face: Face): number {
  const positions = face.vertexIds
    .map((candidateId) => getValidVertexPosition(shape, candidateId))
    .filter((position): position is Vec3 => Boolean(position));

  if (!positions.length) {
    return 0;
  }

  const center: Vec3 = [
    positions.reduce((sum, position) => sum + position[0], 0) / positions.length,
    positions.reduce((sum, position) => sum + position[1], 0) / positions.length,
    positions.reduce((sum, position) => sum + position[2], 0) / positions.length,
  ];

  return positions.reduce((radius, position) => Math.max(radius, distanceVec3(position, center)), 0);
}

function getValidVertexPosition(shape: Shape, vertexId: VertexId): Vec3 | null {
  return asValidVec3(shape.vertices[vertexId]?.position);
}

function asValidVec3(position: unknown): Vec3 | null {
  return Array.isArray(position) &&
    position.length === 3 &&
    position.every((component) => typeof component === 'number' && Number.isFinite(component))
    ? [position[0], position[1], position[2]]
    : null;
}

function cellCentroidForAntipodes(shape: Shape, cell: Cell): Vec3 | null {
  const positions = cell.vertexIds
    .map((vertexId) => shape.vertices[vertexId]?.position)
    .filter((position): position is Vec3 => Boolean(position));

  if (!positions.length) {
    return null;
  }

  return [
    positions.reduce((sum, position) => sum + position[0], 0) / positions.length,
    positions.reduce((sum, position) => sum + position[1], 0) / positions.length,
    positions.reduce((sum, position) => sum + position[2], 0) / positions.length,
  ];
}

function cellRadiusForAntipodes(shape: Shape, cell: Cell, center: Vec3): number {
  return cell.vertexIds.reduce((radius, vertexId) => {
    const position = shape.vertices[vertexId]?.position;

    return position ? Math.max(radius, distanceVec3(position, center)) : radius;
  }, 0);
}

function distanceVec3(a: Vec3, b: Vec3): number {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

function getVertexDisplayLabel(shape: Shape, vertexId: VertexId): string {
  const vertex = shape.vertices[vertexId];

  return vertex ? getPacketDisplayLabel(vertex.data) ?? shortenId(vertexId) : shortenId(vertexId);
}

function getFaceDisplayLabel(shape: Shape, faceId: string): string {
  const face = shape.faces.find((candidate) => candidate.id === faceId);

  return face ? getPacketDataDisplayLabel(face.data) ?? shortenId(faceId) : shortenId(faceId);
}

function formatEdgeRef(shape: Shape, vertexIds: [VertexId, VertexId]): string {
  return `${getVertexDisplayLabel(shape, vertexIds[0])} - ${getVertexDisplayLabel(
    shape,
    vertexIds[1],
  )}`;
}

function getPacketDisplayLabel(packet: VertexDataPacket): string | null {
  return (
    getPacketDataString(packet.custom, 'title') ??
    getMeaningfulText(packet.label) ??
    getPacketDataString(packet.custom, 'name') ??
    getPacketDataString(packet.custom, 'summary') ??
    getPacketDataString(packet.custom, 'description') ??
    getFirstMeaningfulLine(packet.notes)
  );
}

function getPacketDataDisplayLabel(data: PacketData | undefined): string | null {
  return (
    getPacketDataString(data, 'title') ??
    getPacketDataString(data, 'label') ??
    getPacketDataString(data, 'name') ??
    getPacketDataString(data, 'summary') ??
    getPacketDataString(data, 'description') ??
    getPacketDataString(data, 'notes')
  );
}

function getPacketDataString(data: PacketData | undefined, key: string): string | null {
  if (!data) {
    return null;
  }

  const value =
    data[key] ??
    Object.entries(data).find(([candidateKey]) => candidateKey.toLowerCase() === key)?.[1];

  return typeof value === 'string' ? getMeaningfulText(value) : null;
}

function getMeaningfulText(value: string | undefined): string | null {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

function getFirstMeaningfulLine(value: string | undefined): string | null {
  return value
    ?.split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) ?? null;
}

function shortenId(id: string): string {
  return id.length > 34 ? `${id.slice(0, 18)}...${id.slice(-10)}` : id;
}

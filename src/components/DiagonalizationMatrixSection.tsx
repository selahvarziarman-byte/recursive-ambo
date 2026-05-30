import type {
  DiagonalizationMatrixEntry,
  DiagonalizationMatrixReport,
} from '../lib/diagonalizationMatrix';
import type { Shape, VertexDataPacket, VertexId } from '../types/geometry';

export function DiagonalizationMatrixSection({
  shape,
  reports,
}: {
  shape: Shape;
  reports: DiagonalizationMatrixReport[];
}) {
  return (
    <div className="grid gap-2">
      {reports.map((report) => (
        <DiagonalizationMatrixCard
          key={`${report.sourceSquareFaceId}:${report.displayFaceId}`}
          shape={shape}
          report={report}
        />
      ))}
    </div>
  );
}

function DiagonalizationMatrixCard({
  shape,
  report,
}: {
  shape: Shape;
  report: DiagonalizationMatrixReport;
}) {
  const [a, b, c, d] = report.orderedVertexIds;
  const statusClassName =
    report.status === 'ok'
      ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
      : 'border-rose-400/40 bg-rose-400/10 text-rose-200';

  return (
    <div className="rounded border border-stone-800 bg-stone-950 px-3 py-2 text-xs">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium text-stone-200">
            Square face: <span className="font-mono">{shortenId(report.sourceSquareFaceId)}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-stone-500">
            {report.orderedVertexIds.map((vertexId) => (
              <span key={vertexId} className="min-w-0 truncate">
                {getVertexDisplayLabel(shape, vertexId)}
              </span>
            ))}
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-1 font-mono text-[10px] text-stone-600">
            {report.orderedVertexIds.map((vertexId) => (
              <span key={vertexId}>{shortenId(vertexId)}</span>
            ))}
          </div>
        </div>
        <span className={`shrink-0 rounded border px-2 py-0.5 text-[10px] ${statusClassName}`}>
          {report.status === 'ok' ? 'MATRIX_OK' : 'MATRIX_FAILED'}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-[minmax(48px,0.7fr)_minmax(0,1fr)_minmax(0,1fr)] gap-1">
        <span />
        <MatrixVertexLabel shape={shape} vertexId={c} />
        <MatrixVertexLabel shape={shape} vertexId={d} />
        <MatrixVertexLabel shape={shape} vertexId={a} />
        <MatrixEntryCell shape={shape} entry={report.entries.ac} />
        <MatrixEntryCell shape={shape} entry={report.entries.ad} />
        <MatrixVertexLabel shape={shape} vertexId={b} />
        <MatrixEntryCell shape={shape} entry={report.entries.bc} />
        <MatrixEntryCell shape={shape} entry={report.entries.bd} />
      </div>

      <dl className="mt-3 grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-1 text-[11px]">
        <dt className="text-stone-500">chosen</dt>
        <dd className="text-stone-200">{report.chosenEntry?.label ?? 'none'}</dd>
        <dt className="text-stone-500">alternate</dt>
        <dd className="text-stone-200">{report.alternateEntry?.label ?? 'none'}</dd>
        <dt className="text-stone-500">off-diagonal</dt>
        <dd className="text-stone-200">{formatMatrixEntryLabels(report.offDiagonalEntries)}</dd>
        <dt className="text-stone-500">implicit</dt>
        <dd className="text-stone-200">
          {formatMatrixEntryLabels(report.implicitBoundaryEntries)}
        </dd>
      </dl>

      {report.problems.length ? (
        <div className="mt-2 rounded border border-rose-400/30 bg-rose-400/10 px-2 py-1 text-[11px] text-rose-100">
          {report.problems.join('; ')}
        </div>
      ) : null}
    </div>
  );
}

function MatrixVertexLabel({ shape, vertexId }: { shape: Shape; vertexId: VertexId }) {
  return (
    <span className="min-w-0 rounded border border-stone-800 bg-stone-900/70 px-2 py-1 text-stone-300">
      <span className="block truncate">{getVertexDisplayLabel(shape, vertexId)}</span>
      <span className="block truncate font-mono text-[10px] text-stone-600">
        {shortenId(vertexId)}
      </span>
    </span>
  );
}

function MatrixEntryCell({
  shape,
  entry,
}: {
  shape: Shape;
  entry: DiagonalizationMatrixEntry;
}) {
  const endpointLabel = formatMatrixEndpointPair(shape, entry.vertexIds);
  const className = entry.isChosenConstructionDiagonal
    ? 'border-amber-300/60 bg-amber-300/10 text-amber-100'
    : entry.isAlternateDiagonal
      ? 'border-stone-700 bg-stone-900 text-stone-300'
      : 'border-stone-800 bg-stone-950/80 text-stone-400';
  const roleLabel = entry.isChosenConstructionDiagonal
    ? 'chosen'
    : entry.isAlternateDiagonal
      ? 'alternate'
      : entry.isBoundary
        ? 'boundary'
        : 'open';

  return (
    <span className={`min-w-0 rounded border px-2 py-1 ${className}`}>
      <span className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate font-semibold" title={endpointLabel}>
          {endpointLabel}
          {entry.isChosenConstructionDiagonal ? ' *' : ''}
        </span>
        <span className="shrink-0 text-[10px] text-stone-500">{roleLabel}</span>
      </span>
      <span className="mt-0.5 block truncate text-[10px] text-stone-500">
        slot: {entry.label}
      </span>
    </span>
  );
}

function formatMatrixEndpointPair(shape: Shape, vertexIds: [VertexId, VertexId]): string {
  return `${getVertexDisplayLabel(shape, vertexIds[0])} - ${getVertexDisplayLabel(
    shape,
    vertexIds[1],
  )}`;
}

function formatMatrixEntryLabels(entries: readonly DiagonalizationMatrixEntry[]): string {
  return entries.map((entry) => entry.label).join(', ');
}

function getVertexDisplayLabel(shape: Shape, vertexId: VertexId): string {
  const vertex = shape.vertices[vertexId];

  return vertex ? getPacketDisplayLabel(vertex.data) ?? shortenId(vertexId) : shortenId(vertexId);
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

function getPacketDataString(data: VertexDataPacket['custom'], key: string): string | null {
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

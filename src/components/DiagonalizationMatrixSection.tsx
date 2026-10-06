// ═══ THE DIAGONALIZATION MATRIX — in COPY-1 §5.4's words (STAMP LAYOUT-1, the cut's stage 4b): `square face A·B·C·D` with its four
// corners by name (no id), no chip when the matrix reads and `could not be read:` with its problems when it does not; a grid cell
// `A–C` with its role `chosen` · `alternate` · `boundary` · `open` (the ` *` and `slot: AC` are gone); one line `chosen AC · alternate
// BD · off-diagonal AD, BC · implicit AB, CD` — the matrix's own letters for the square's four corners in order, not names.
import { faceDisplayName } from '../manuscript/apertureModel';
import { faceThroughAncestors } from './faceNames';
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
  const corners = report.orderedVertexIds.map((vertexId) => getVertexDisplayLabel(shape, vertexId));

  return (
    <div data-matrix-card={report.status} className="rounded border border-stone-800 bg-stone-950 px-3 py-2 text-xs">
      <div className="min-w-0">
        <div className="font-medium text-stone-200">square face {squareFaceName(shape, report.sourceSquareFaceId, corners)}</div>
        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-stone-500">
          {corners.map((corner, index) => (
            <span key={`${report.orderedVertexIds[index]}:${index}`} className="min-w-0 truncate">
              {corner}
            </span>
          ))}
        </div>
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

      <p className="mt-3 text-[11px] text-stone-300">
        {[
          `chosen ${report.chosenEntry?.label ?? 'none'}`,
          `alternate ${report.alternateEntry?.label ?? 'none'}`,
          `off-diagonal ${formatMatrixEntryLabels(report.offDiagonalEntries)}`,
          `implicit ${formatMatrixEntryLabels(report.implicitBoundaryEntries)}`,
        ].join(' · ')}
      </p>

      {report.status !== 'ok' || report.problems.length ? (
        <div className="mt-2 rounded border border-rose-400/30 bg-rose-400/10 px-2 py-1 text-[11px] text-rose-100">
          could not be read: {report.problems.join(' · ')}
        </div>
      ) : null}
    </div>
  );
}

// the square by its corners' composed name (D14 through the one composer); the source square usually lives in the ancestor the
// diagonalization consumed — found through the ancestry; where no shape holds it, the corners in the matrix's own order
function squareFaceName(shape: Shape, faceId: string, corners: string[]): string {
  const found = faceThroughAncestors(shape, faceId);
  return found ? faceDisplayName(found.in, found.face, () => 'unnamed') : corners.join('·');
}

function MatrixVertexLabel({ shape, vertexId }: { shape: Shape; vertexId: VertexId }) {
  return (
    <span className="min-w-0 rounded border border-stone-800 bg-stone-900/70 px-2 py-1 text-stone-300">
      <span className="block truncate">{getVertexDisplayLabel(shape, vertexId)}</span>
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
        <span className="min-w-0 truncate font-semibold">{endpointLabel}</span>
        <span className="shrink-0 text-[10px] text-stone-500">{roleLabel}</span>
      </span>
    </span>
  );
}

// P3 — an edge by its corners, `A–C`, the alphabetically-first corner first
function formatMatrixEndpointPair(shape: Shape, vertexIds: [VertexId, VertexId]): string {
  return vertexIds.map((id) => getVertexDisplayLabel(shape, id)).sort((x, y) => x.localeCompare(y)).join('–');
}

function formatMatrixEntryLabels(entries: readonly DiagonalizationMatrixEntry[]): string {
  return entries.map((entry) => entry.label).join(', ');
}

// COPY-1 rule 5 — a vertex by its name; with none, `unnamed` (never its id)
function getVertexDisplayLabel(shape: Shape, vertexId: VertexId): string {
  const vertex = shape.vertices[vertexId];

  return vertex ? getPacketDisplayLabel(vertex.data) ?? 'unnamed' : 'unnamed';
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

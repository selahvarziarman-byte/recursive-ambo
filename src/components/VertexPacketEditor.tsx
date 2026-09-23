import {
  type KeyboardEvent,
  useEffect,
  useRef,
  useMemo,
  useState,
} from 'react';
import { useGeometryStore } from '../store/geometryStore';
// C-6c (ii)+(iii): a corner TAKES a cast from a file — the loader checks a
// structure and never grades; this editor writes the selected corner's `cast`
// and nothing else (the five promises, discharged by behaviour)
import { readCastFile, castSummaryLine } from '../lib/castLoader';
import type {
  Cell,
  JsonValue,
  PacketLineage,
  PacketSourceRef,
  Shape,
  Vertex,
  VertexDataPacket,
  VertexId,
} from '../types/geometry';

type PacketStatus = 'named' | 'annotated' | 'empty' | 'lineage-only';

interface EditorPacketRow {
  vertex: Vertex;
  displayLabel: string;
  role: string;
  status: PacketStatus;
  generationDepth: number | null;
}

type CustomPacketJsonValidation =
  | { ok: true; custom: Record<string, JsonValue> }
  | { ok: false; message: string };

export function VertexPacketEditorContent() {
  const shape = useCurrentShape();
  const selectedVertexId = useGeometryStore((state) => state.selectedVertexId);
  const selectVertex = useGeometryStore((state) => state.selectVertex);
  const updateSelectedVertexData = useGeometryStore((state) => state.updateSelectedVertexData);
  const vertex = selectedVertexId ? shape.vertices[selectedVertexId] : null;
  const [labelDraft, setLabelDraft] = useState('');
  const [notesDraft, setNotesDraft] = useState('');
  const [colorDraft, setColorDraft] = useState('#facc15');
  const [tagsDraft, setTagsDraft] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [customText, setCustomText] = useState('{}');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  // the load's own line: the loader's words (taken — with its marks · or the refusal by name); null = nothing loaded yet
  const [castLoadLine, setCastLoadLine] = useState<{ text: string; refused: boolean } | null>(null);
  const castFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (vertex) {
      setLabelDraft(vertex.data.label);
      setNotesDraft(vertex.data.notes);
      setColorDraft(vertex.data.color);
      setTagsDraft(vertex.data.tags);
      setTagInput('');
      setCustomText(JSON.stringify(vertex.data.custom, null, 2));
      setSaveMessage(null);
      setCastLoadLine(null); // PER CORNER: another corner's load line is not this one's
    }
  }, [vertex?.id]);

  const customValidation = useMemo(() => validateCustomPacketJson(customText), [customText]);

  if (!vertex) {
    return <p className="text-sm text-stone-500">No vertex selected.</p>;
  }

  const packetStatus = getVertexPacketStatus(shape, vertex);
  const unresolvedRows = getUnresolvedGeneratedPacketRows(shape);

  const addTag = () => {
    const tag = tagInput.trim();

    if (!tag) {
      setTagInput('');
      return;
    }

    if (!tagsDraft.some((existingTag) => existingTag.toLowerCase() === tag.toLowerCase())) {
      setTagsDraft([...tagsDraft, tag]);
    }

    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTagsDraft(tagsDraft.filter((existingTag) => existingTag !== tag));
  };

  const handleTagInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    }
  };

  const saveDraft = (): { saved: boolean; nextRows: EditorPacketRow[] } => {
    const validation = validateCustomPacketJson(customText);

    if (!validation.ok) {
      setSaveMessage(validation.message);
      return { saved: false, nextRows: [] };
    }

    const nextVertex: Vertex = {
      ...vertex,
      data: {
        ...vertex.data,
        label: labelDraft,
        notes: notesDraft,
        color: colorDraft,
        tags: tagsDraft,
        custom: validation.custom,
      },
    };
    const nextShape: Shape = {
      ...shape,
      vertices: {
        ...shape.vertices,
        [vertex.id]: nextVertex,
      },
    };
    const nextRows = getUnresolvedGeneratedPacketRows(nextShape);

    updateSelectedVertexData({
      label: labelDraft,
      notes: notesDraft,
      color: colorDraft,
      tags: tagsDraft,
      custom: validation.custom,
    });
    setCustomText(JSON.stringify(validation.custom, null, 2));
    setSaveMessage('Packet saved.');

    return { saved: true, nextRows };
  };

  // C-6c: `.cast.json` → the selected corner's `cast`. Refused files write
  // NOTHING (the corner keeps what it held); a taken file writes `cast` alone —
  // never `label`, never anything of the edge.
  const loadCastFile = async (file: File) => {
    if (!vertex || vertex.createdBy.operation !== 'seed') return; // C-8 item 2 (Δ86): a cast is loaded onto a seed corner alone — the offer is absent elsewhere; this is the same rule at the function
    const text = await file.text();
    const load = readCastFile(text);
    if (!load.taken) {
      setCastLoadLine({ text: load.refusal, refused: true });
      return;
    }
    updateSelectedVertexData({ cast: load.cast });
    const marks = load.marks.length ? ` · ${load.marks.length} ${load.marks.length === 1 ? 'mark' : 'marks'}: ${load.marks.join(' · ')}` : '';
    setCastLoadLine({ text: `${castSummaryLine(load.cast)}${marks}`, refused: false });
  };

  const saveAndNextUnresolved = () => {
    const result = saveDraft();

    if (!result.saved) {
      return;
    }

    const nextRow = findNextUnresolvedVertexAfterCurrent(result.nextRows, vertex.id);

    if (nextRow) {
      selectVertex(nextRow.vertex.id);
      return;
    }

    const currentStillUnresolved = result.nextRows.some((row) => row.vertex.id === vertex.id);

    setSaveMessage(
      currentStillUnresolved
        ? 'Packet saved. Current packet is still unresolved.'
        : 'Packet saved. No unresolved generated midpoint packets remain.',
    );
  };

  return (
    <div className="grid gap-3">
      <div className="rounded border border-stone-800 bg-stone-950 px-3 py-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className={packetStatusClassName(packetStatus)}>
            {formatPacketStatus(packetStatus)}
          </span>
          <span className="rounded border border-stone-700 bg-stone-900 px-2 py-0.5 text-stone-300">
            {formatVertexEditorOrigin(vertex)}
          </span>
        </div>
        <p className="mt-2 truncate text-stone-400">{formatVertexLineageSummary(shape, vertex)}</p>
      </div>

      <label className="grid gap-1 text-sm text-stone-300">
        Label
        <input
          value={labelDraft}
          onChange={(event) => setLabelDraft(event.target.value)}
          className="h-9 rounded border border-stone-700 bg-stone-950 px-3 text-stone-100 outline-none focus:border-teal-400"
        />
      </label>

      <label className="grid gap-1 text-sm text-stone-300">
        Color
        <input
          type="color"
          value={colorDraft}
          onChange={(event) => setColorDraft(event.target.value)}
          className="h-10 w-full rounded border border-stone-700 bg-stone-950 p-1"
        />
      </label>

      <div className="grid gap-2 text-sm text-stone-300">
        Tags
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(event) => setTagInput(event.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Add tag"
            className="h-9 min-w-0 flex-1 rounded border border-stone-700 bg-stone-950 px-3 text-stone-100 outline-none placeholder:text-stone-600 focus:border-teal-400"
          />
          <button
            type="button"
            onClick={addTag}
            className="h-9 rounded border border-stone-700 bg-stone-900 px-3 text-xs font-semibold text-stone-100 transition hover:border-teal-400 hover:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            Add
          </button>
        </div>
        <div className="flex min-h-8 flex-wrap gap-2">
          {tagsDraft.length ? (
            tagsDraft.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded border border-stone-700 bg-stone-900 px-2 py-1 text-xs text-stone-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-stone-400 transition hover:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  aria-label={`Remove ${tag}`}
                >
                  x
                </button>
              </span>
            ))
          ) : (
            <span className="text-xs text-stone-400">No tags.</span>
          )}
        </div>
      </div>

      <label className="grid gap-1 text-sm text-stone-300">
        Notes
        <textarea
          value={notesDraft}
          onChange={(event) => setNotesDraft(event.target.value)}
          rows={4}
          className="resize-none rounded border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 outline-none focus:border-teal-400"
        />
      </label>

      <label className="grid gap-1 text-sm text-stone-300">
        Custom JSON
        <textarea
          value={customText}
          onChange={(event) => setCustomText(event.target.value)}
          spellCheck={false}
          rows={5}
          className="resize-none rounded border border-stone-700 bg-stone-950 px-3 py-2 font-mono text-xs text-stone-100 outline-none focus:border-teal-400"
        />
      </label>
      {!customValidation.ok ? <p className="text-xs text-rose-300">{customValidation.message}</p> : null}

      {/* C-6c surface 1 (the designer's siting): the load sits beside `Save packet`
          — a FILE door, not a text field: the `Custom JSON` blob above is typed,
          this opens the file chooser; the grain is the section's (the packet) */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={saveDraft}
          disabled={!customValidation.ok}
          className="h-9 rounded border border-teal-500/60 bg-teal-400 px-3 text-sm font-semibold text-stone-950 transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-200 disabled:cursor-not-allowed disabled:border-stone-700 disabled:bg-stone-800 disabled:text-stone-500"
        >
          Save packet
        </button>
        <button
          type="button"
          onClick={saveAndNextUnresolved}
          disabled={!customValidation.ok || !unresolvedRows.length}
          className="h-9 rounded border border-stone-700 bg-stone-900 px-3 text-sm font-semibold text-stone-100 transition hover:border-amber-300 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:border-stone-800 disabled:bg-stone-950 disabled:text-stone-600"
        >
          Save and next unresolved
        </button>
        {/* C-8 item 2 — ARMAN'S RULE, BY CONSTRUCTION (Δ86: "no cast loading is only for the seed"): `load cast…` is OFFERED
            on the seed's own corners ALONE — a whitelist by what the vertex IS (`createdBy.operation === 'seed'`), never a
            blacklist of generated midpoints that would leave another born vertex open — and ABSENT on every other vertex:
            never disabled, and no word added (the reason is on screen already; a fourth copy would mark the ordinary).
            The precondition once lived in this button's title and was never a guard (C-6c). */}
        {vertex?.createdBy.operation === 'seed' ? (
          <>
            <button
              type="button"
              onClick={() => castFileInputRef.current?.click()}
              title="a corner takes a concept-space from a .cast.json file — the device checks its structure and never grades it"
              className="h-9 rounded border border-stone-700 bg-stone-900 px-3 text-sm font-semibold text-stone-100 transition hover:border-violet-300 hover:text-violet-100 focus:outline-none focus:ring-2 focus:ring-violet-400"
            >
              load cast… (.cast.json)
            </button>
            <input
              ref={castFileInputRef}
              type="file"
              accept=".json,application/json"
              data-cast-file-input="true"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (file) void loadCastFile(file);
              }}
            />
          </>
        ) : null}
      </div>
      {castLoadLine ? (
        <p data-cast-load-result="true" className={`text-xs ${castLoadLine.refused ? 'text-rose-300' : 'text-stone-400'}`}>
          {castLoadLine.text}
        </p>
      ) : null}
      {saveMessage ? (
        <p
          className={`text-xs ${
            saveMessage.toLowerCase().includes('valid') ? 'text-rose-300' : 'text-stone-400'
          }`}
        >
          {saveMessage}
        </p>
      ) : null}
    </div>
  );
}

function validateCustomPacketJson(text: string): CustomPacketJsonValidation {
  try {
    const parsed = JSON.parse(text) as JsonValue;

    if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
      return { ok: false, message: 'Custom data must be a JSON object.' };
    }

    return { ok: true, custom: parsed as Record<string, JsonValue> };
  } catch {
    return { ok: false, message: 'Custom data is not valid JSON.' };
  }
}

function findNextUnresolvedVertexAfterCurrent(
  rows: EditorPacketRow[],
  currentVertexId: VertexId,
): EditorPacketRow | null {
  if (!rows.length) {
    return null;
  }

  const currentIndex = rows.findIndex((row) => row.vertex.id === currentVertexId);
  const startIndex = currentIndex >= 0 ? currentIndex + 1 : 0;

  for (let offset = 0; offset < rows.length; offset += 1) {
    const row = rows[(startIndex + offset) % rows.length];

    if (row.vertex.id !== currentVertexId) {
      return row;
    }
  }

  return null;
}

function formatVertexEditorOrigin(vertex: Vertex): string {
  if (vertex.createdBy.operation === 'dualization') {
    return 'dual/materialized vertex';
  }

  if (isGeneratedMidpointVertex(vertex)) {
    return 'generated midpoint';
  }

  if (vertex.data.lineage?.inheritanceMode === 'preserved') {
    return 'preserved source vertex';
  }

  if (
    vertex.createdBy.operation === 'seed' ||
    vertex.data.lineage?.inheritanceMode === 'default'
  ) {
    return 'seed/source vertex';
  }

  return `${vertex.createdBy.operation} vertex`;
}

function useCurrentShape() {
  const shapes = useGeometryStore((state) => state.shapes);
  const currentShapeId = useGeometryStore((state) => state.currentShapeId);

  return useMemo(() => shapes[currentShapeId], [currentShapeId, shapes]);
}

function getUnresolvedGeneratedPacketRows(shape: Shape): EditorPacketRow[] {
  return Object.values(shape.vertices)
    .map((vertex) => {
      const containingCells = getContainingCells(shape, vertex.id).sort(
        compareCellsForPacketContext,
      );

      return {
        vertex,
        displayLabel: getVertexDisplayLabel(shape, vertex.id),
        role: getVertexRole(vertex),
        status: getVertexPacketStatus(shape, vertex),
        generationDepth: getVertexGenerationDepth(containingCells),
      };
    })
    .filter(isUnresolvedGeneratedPacketRow)
    .sort(comparePacketRows);
}

function isUnresolvedGeneratedPacketRow(row: EditorPacketRow): boolean {
  return (
    isGeneratedMidpointVertex(row.vertex) &&
    (row.status === 'empty' || row.status === 'lineage-only')
  );
}

function comparePacketRows(a: EditorPacketRow, b: EditorPacketRow): number {
  return (
    packetStatusSortOrder(a.status) - packetStatusSortOrder(b.status) ||
    a.role.localeCompare(b.role) ||
    (a.generationDepth ?? Number.MAX_SAFE_INTEGER) -
      (b.generationDepth ?? Number.MAX_SAFE_INTEGER) ||
    a.displayLabel.localeCompare(b.displayLabel) ||
    a.vertex.id.localeCompare(b.vertex.id)
  );
}

function packetStatusSortOrder(status: PacketStatus): number {
  if (status === 'lineage-only') {
    return 0;
  }

  if (status === 'empty') {
    return 1;
  }

  if (status === 'annotated') {
    return 2;
  }

  return 3;
}

function getVertexPacketStatus(shape: Shape, vertex: Vertex): PacketStatus {
  if (hasNamedPacketContent(shape, vertex)) {
    return 'named';
  }

  if (hasAnnotatedPacketContent(vertex.data)) {
    return 'annotated';
  }

  if (isGeneratedMidpointVertex(vertex) && vertex.data.lineage) {
    return 'lineage-only';
  }

  return 'empty';
}

function hasNamedPacketContent(shape: Shape, vertex: Vertex): boolean {
  return Boolean(
    getPacketDataString(vertex.data.custom, 'title') ||
      getPacketDataString(vertex.data.custom, 'name') ||
      getUserAuthoredPacketLabel(shape, vertex),
  );
}

function hasAnnotatedPacketContent(packet: VertexDataPacket): boolean {
  return Boolean(
    getFirstMeaningfulLine(packet.notes) ||
      getPacketDataString(packet.custom, 'summary') ||
      getPacketDataString(packet.custom, 'description') ||
      getPacketDataString(packet.custom, 'body') ||
      packet.tags.length,
  );
}

function getUserAuthoredPacketLabel(shape: Shape, vertex: Vertex): string | null {
  const label = getMeaningfulText(vertex.data.label);

  if (!label) {
    return null;
  }

  return isAutoGeneratedMidpointLabel(shape, vertex, label) ? null : label;
}

function isAutoGeneratedMidpointLabel(shape: Shape, vertex: Vertex, label: string): boolean {
  if (!isGeneratedMidpointVertex(vertex) || vertex.createdBy.sourceVertexIds.length < 2) {
    return false;
  }

  const sourceLabels = vertex.createdBy.sourceVertexIds
    .slice(0, 2)
    .map((vertexId) => getMeaningfulText(shape.vertices[vertexId]?.data.label))
    .filter((sourceLabel): sourceLabel is string => Boolean(sourceLabel));

  if (sourceLabels.length < 2) {
    return false;
  }

  const [a, b] = sourceLabels;
  const autoLabels = new Set([`${a}${b}`, `${b}${a}`, `${a}-${b}`, `${b}-${a}`]);

  return autoLabels.has(label);
}

function isGeneratedMidpointVertex(vertex: Vertex): boolean {
  return (
    Boolean(vertex.createdBy.sourceEdgeId) ||
    vertex.data.lineage?.inheritanceMode === 'derived-from-edge'
  );
}

function getVertexGenerationDepth(containingCells: Cell[]): number | null {
  if (!containingCells.length) {
    return null;
  }

  return Math.min(...containingCells.map((cell) => cell.generationDepth));
}

function getContainingCells(shape: Shape, vertexId: VertexId): Cell[] {
  return shape.cells.filter((cell) => cell.vertexIds.includes(vertexId));
}

function compareCellsForPacketContext(a: Cell, b: Cell): number {
  return (
    a.generationDepth - b.generationDepth ||
    a.kind.localeCompare(b.kind) ||
    describeCellTopology(a).localeCompare(describeCellTopology(b)) ||
    a.id.localeCompare(b.id)
  );
}

function formatPacketStatus(status: PacketStatus): string {
  if (status === 'lineage-only') {
    return 'lineage-only';
  }

  return status;
}

function packetStatusClassName(status: PacketStatus): string {
  const base = 'shrink-0 rounded border px-2 py-0.5 text-xs';

  if (status === 'named') {
    return `${base} border-emerald-400/40 bg-emerald-400/10 text-emerald-200`;
  }

  if (status === 'annotated') {
    return `${base} border-cyan-400/40 bg-cyan-400/10 text-cyan-200`;
  }

  if (status === 'lineage-only') {
    return `${base} border-amber-400/40 bg-amber-400/10 text-amber-200`;
  }

  // C-7f item 7: a status a person reads (`empty`) at the floor — stone-500 on stone-900 read 3.6:1
  return `${base} border-stone-700 bg-stone-900 text-stone-300`;
}

function getVertexRole(vertex: Vertex): string {
  if (isGeneratedMidpointVertex(vertex)) {
    return 'generated midpoint';
  }

  if (vertex.data.lineage?.inheritanceMode === 'preserved') {
    return 'preserved source';
  }

  if (
    vertex.createdBy.operation === 'seed' ||
    vertex.data.lineage?.inheritanceMode === 'default'
  ) {
    return 'seed/source';
  }

  return 'unknown';
}

function formatVertexLineageSummary(shape: Shape, vertex: Vertex): string {
  const lineage = vertex.data.lineage;

  if (!lineage) {
    return vertex.createdBy.operation === 'seed' ? 'seed vertex' : 'lineage unknown';
  }

  if (lineage.inheritanceMode === 'default' || vertex.createdBy.operation === 'seed') {
    return 'seed vertex';
  }

  if (lineage.inheritanceMode === 'preserved') {
    return 'preserved source vertex';
  }

  if (lineage.inheritanceMode === 'derived-from-edge') {
    const endpoints = lineage.sources.filter(
      (source) => source.kind === 'vertex' && source.role === 'endpoint',
    );

    if (endpoints.length >= 2) {
      return `midpoint derived from edge ${formatEdgeRef(shape, [
        endpoints[0].id,
        endpoints[1].id,
      ])}`;
    }

    const sourceEdge = lineage.sources.find((source) => source.kind === 'edge');

    return sourceEdge
      ? `midpoint derived from edge ${formatSourceRef(shape, sourceEdge)}`
      : 'midpoint derived from edge';
  }

  return formatLineageSummary(shape, lineage);
}

function formatLineageSummary(shape: Shape, lineage: PacketLineage | undefined): string {
  if (!lineage) {
    return 'lineage unknown';
  }

  const sourceSummary = formatSourceRefs(shape, lineage.sources);

  if (lineage.inheritanceMode === 'composite') {
    return sourceSummary ? `composite lineage from ${sourceSummary}` : 'composite lineage';
  }

  return sourceSummary
    ? `${lineage.inheritanceMode} from ${sourceSummary}`
    : lineage.inheritanceMode;
}

function formatSourceRefs(shape: Shape, sources: PacketSourceRef[]): string {
  if (!sources.length) {
    return '';
  }

  const visibleSources = sources.slice(0, 3).map((source) => formatSourceRef(shape, source));
  const remainingCount = sources.length - visibleSources.length;

  return remainingCount > 0
    ? `${visibleSources.join(', ')} + ${remainingCount} more`
    : visibleSources.join(', ');
}

function formatSourceRef(shape: Shape, sourceRef: PacketSourceRef): string {
  if (sourceRef.kind === 'vertex') {
    return getVertexDisplayLabel(shape, sourceRef.id);
  }

  if (sourceRef.kind === 'edge') {
    const edge = shape.edges.find((candidate) => candidate.id === sourceRef.id);

    return edge ? formatEdgeRef(shape, edge.vertexIds) : shortenId(sourceRef.id);
  }

  if (sourceRef.kind === 'face') {
    return getFaceDisplayLabel(shape, sourceRef.id);
  }

  return getCellDisplayLabel(shape, sourceRef.id);
}

function formatEdgeRef(shape: Shape, vertexIds: [VertexId, VertexId]): string {
  return `${getVertexDisplayLabel(shape, vertexIds[0])} - ${getVertexDisplayLabel(
    shape,
    vertexIds[1],
  )}`;
}

function getVertexDisplayLabel(shape: Shape, vertexId: VertexId): string {
  const vertex = shape.vertices[vertexId];

  return vertex ? getPacketDisplayLabel(vertex.data) ?? shortenId(vertexId) : shortenId(vertexId);
}

function getFaceDisplayLabel(shape: Shape, faceId: string): string {
  const face = shape.faces.find((candidate) => candidate.id === faceId);

  return face ? getPacketDataDisplayLabel(face.data) ?? shortenId(faceId) : shortenId(faceId);
}

function getCellDisplayLabel(shape: Shape, cellId: string): string {
  const cell = shape.cells.find((candidate) => candidate.id === cellId);
  const packetLabel = getPacketDataDisplayLabel(cell?.data);

  if (packetLabel) {
    return packetLabel;
  }

  return cell ? `${describeCellTopology(cell)} ${shortenId(cell.id)}` : shortenId(cellId);
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

function getPacketDataDisplayLabel(data: Cell['data']): string | null {
  return (
    getPacketDataString(data, 'title') ??
    getPacketDataString(data, 'label') ??
    getPacketDataString(data, 'name') ??
    getPacketDataString(data, 'summary') ??
    getPacketDataString(data, 'description') ??
    getPacketDataString(data, 'notes')
  );
}

function getPacketDataString(data: Cell['data'], key: string): string | null {
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

function describeCellTopology(cell: Cell): string {
  if (cell.topology) {
    return cell.topology;
  }

  if (cell.kind === 'seed') {
    return 'tetrahedron';
  }

  if (cell.kind === 'core' && cell.vertexIds.length === 6) {
    return 'octahedron';
  }

  if (cell.kind === 'core' && cell.vertexIds.length === 12) {
    return 'cuboctahedron';
  }

  if (cell.kind === 'residue' && cell.vertexIds.length === 4) {
    return 'tetrahedron';
  }

  if (cell.kind === 'residue' && cell.vertexIds.length === 5) {
    return 'square-pyramid';
  }

  return 'unknown';
}

function shortenId(id: string): string {
  return id.length > 34 ? `${id.slice(0, 18)}...${id.slice(-10)}` : id;
}

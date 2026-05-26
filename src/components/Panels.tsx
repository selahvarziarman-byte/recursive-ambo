import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { seedRegistry } from '../data/seeds';
import { isDualViewSupportedCell } from '../lib/dualView';
import { defaultOperation } from '../operations/registry';
import { formatVec3 } from '../lib/shape';
import { type OperationHistoryEntry, useGeometryStore } from '../store/geometryStore';
import type {
  Cell,
  CellKind,
  Face,
  JsonValue,
  PacketLineage,
  PacketSourceRef,
  Shape,
  Vertex,
  VertexDataPacket,
  VertexId,
} from '../types/geometry';
import { Panel } from './Panel';

type TopologyFilter =
  | 'all'
  | 'tetrahedron'
  | 'octahedron'
  | 'cube'
  | 'cuboctahedron'
  | 'square-pyramid'
  | 'rhombicuboctahedron'
  | 'rectified-square-pyramid'
  | 'other';

type OperabilityFilter = 'all' | 'operable' | 'disabled';
type RightSidebarTab = 'workspace' | 'selection' | 'history';

interface WorkspaceCellRow {
  cell: Cell;
  id: string;
  shortId: string;
  topology: string;
  kind: CellKind;
  generationDepth: number;
  parentCellId: string | null;
  parentKnown: boolean;
  childCount: number;
  isOperable: boolean;
  disabledReason: string | null;
}

interface CellVertexRow {
  vertex: Vertex;
  displayLabel: string;
  shortId: string;
  role: string;
  packetDetail: string | null;
  lineageSummary: string;
}

interface CellFaceRow {
  face: Face;
  shortId: string;
  size: number;
  sourceRole: string;
  lineageSummary: string;
}

interface CellEdgeRow {
  id: string;
  vertexIds: [VertexId, VertexId];
  displayLabel: string;
  secondaryLabel: string | null;
}

const topologyFilterOptions: Array<{ value: TopologyFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'tetrahedron', label: 'tetrahedron' },
  { value: 'octahedron', label: 'octahedron' },
  { value: 'cube', label: 'cube' },
  { value: 'cuboctahedron', label: 'cuboctahedron' },
  { value: 'square-pyramid', label: 'square-pyramid' },
  { value: 'rhombicuboctahedron', label: 'rhombicuboctahedron' },
  { value: 'rectified-square-pyramid', label: 'rectified-square-pyramid' },
  { value: 'other', label: 'unknown/other' },
];

export function SeedSelector() {
  const selectedSeedKey = useGeometryStore((state) => state.selectedSeedKey);
  const loadSeed = useGeometryStore((state) => state.loadSeed);
  const seeds = Object.values(seedRegistry);

  return (
    <Panel title="Seed Selector">
      <label className="grid gap-2 text-sm text-stone-300">
        Seed shape
        <select
          value={selectedSeedKey}
          onChange={(event) => loadSeed(event.target.value)}
          className="h-10 rounded border border-stone-700 bg-stone-950 px-3 text-sm text-stone-100 outline-none focus:border-teal-400"
        >
          {seeds.map((seed) => (
            <option key={seed.key} value={seed.key}>
              {seed.label}
            </option>
          ))}
        </select>
      </label>
      <p className="mt-3 text-sm leading-5 text-stone-400">
        {seedRegistry[selectedSeedKey]?.description}
      </p>
    </Panel>
  );
}

export function OperationControls() {
  const applyOperationToSelection = useGeometryStore((state) => state.applyOperationToSelection);
  const resetWorkspace = useGeometryStore((state) => state.resetWorkspace);
  const selectedCellId = useGeometryStore((state) => state.selectedCellId);
  const cellVisibility = useGeometryStore((state) => state.cellVisibility);
  const explodeAmount = useGeometryStore((state) => state.viewLayout.explodeAmount);
  const dualViewEnabled = useGeometryStore((state) => state.viewLayout.dualViewEnabled);
  const toggleCellVisibility = useGeometryStore((state) => state.toggleCellVisibility);
  const setExplodeAmount = useGeometryStore((state) => state.setExplodeAmount);
  const toggleDualView = useGeometryStore((state) => state.toggleDualView);
  const resetViewLayout = useGeometryStore((state) => state.resetViewLayout);
  const shape = useCurrentShape();
  const selectedCell = findCell(shape, selectedCellId);
  const operation = defaultOperation;
  const operationContext = { shape, selectedCellId, selectedCell };
  const canApply = operation.canApply(operationContext);
  const cellCounts = countCellsByKind(shape);
  const operationStatus =
    operation.getStatusMessage?.(operationContext) ??
    operation.getDisabledReason(operationContext) ??
    operation.description;

  return (
    <Panel title="Operation Controls">
      <button
        type="button"
        onClick={() => applyOperationToSelection(operation.id)}
        disabled={!canApply}
        className="h-10 w-full rounded border border-amber-500/70 bg-amber-400 px-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:cursor-not-allowed disabled:border-stone-700 disabled:bg-stone-800 disabled:text-stone-500"
      >
        Apply {operation.label}
      </button>
      <p className="mt-3 text-sm leading-5 text-stone-400">{operationStatus}</p>
      <button
        type="button"
        onClick={resetWorkspace}
        className="mt-4 h-10 w-full rounded border border-stone-700 bg-stone-900 px-3 text-sm font-semibold text-stone-100 transition hover:border-stone-500 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500"
      >
        Reset Workspace
      </button>
      <div className="mt-4 grid gap-2 text-sm text-stone-300">
        <label className="flex items-center justify-between gap-3">
          Core cells
          <input
            type="checkbox"
            checked={cellVisibility.showCoreCells}
            onChange={() => toggleCellVisibility('showCoreCells')}
            className="h-4 w-4 accent-cyan-300"
          />
        </label>
        <label className="flex items-center justify-between gap-3">
          Residue cells
          <input
            type="checkbox"
            checked={cellVisibility.showResidueCells}
            onChange={() => toggleCellVisibility('showResidueCells')}
            className="h-4 w-4 accent-amber-300"
          />
        </label>
        <label className="flex items-center justify-between gap-3">
          Previous/parent cells
          <input
            type="checkbox"
            checked={cellVisibility.showParentCells}
            onChange={() => toggleCellVisibility('showParentCells')}
            className="h-4 w-4 accent-stone-300"
          />
        </label>
      </div>
      <div className="mt-4 border-t border-stone-800 pt-4">
        <label className="mb-4 flex items-center justify-between gap-3 text-sm text-stone-300">
          Dual View
          <input
            type="checkbox"
            checked={dualViewEnabled}
            onChange={toggleDualView}
            className="h-4 w-4 accent-violet-300"
          />
        </label>
        <label className="grid gap-2 text-sm text-stone-300">
          <span className="flex items-center justify-between gap-3">
            Explode View
            <span className="font-mono text-xs text-stone-500">
              {Math.round(explodeAmount * 100)}
            </span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(explodeAmount * 100)}
            onChange={(event) => setExplodeAmount(Number(event.target.value) / 100)}
            className="w-full accent-teal-300"
          />
        </label>
        <button
          type="button"
          onClick={resetViewLayout}
          className="mt-3 h-9 w-full rounded border border-stone-700 bg-stone-900 px-3 text-sm text-stone-200 transition hover:border-stone-500 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500"
        >
          Reset View Layout
        </button>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
        <dt className="text-stone-500">Generation</dt>
        <dd className="text-right text-stone-200">{shape.genealogy.generationDepth}</dd>
        <dt className="text-stone-500">Cells</dt>
        <dd className="text-right text-stone-200">{shape.cells.length}</dd>
        <dt className="text-stone-500">Core</dt>
        <dd className="text-right text-stone-200">{cellCounts.core}</dd>
        <dt className="text-stone-500">Residue</dt>
        <dd className="text-right text-stone-200">{cellCounts.residue}</dd>
        <dt className="text-stone-500">Faces</dt>
        <dd className="text-right text-stone-200">{shape.faces.length}</dd>
        <dt className="text-stone-500">Vertices</dt>
        <dd className="text-right text-stone-200">{Object.keys(shape.vertices).length}</dd>
      </dl>
    </Panel>
  );
}

export function ObjectInspector() {
  const shape = useCurrentShape();
  const selectedCellId = useGeometryStore((state) => state.selectedCellId);
  const selectedVertexId = useGeometryStore((state) => state.selectedVertexId);
  const dualViewEnabled = useGeometryStore((state) => state.viewLayout.dualViewEnabled);
  const vertex = selectedVertexId ? shape.vertices[selectedVertexId] : null;
  const selectedCell = findCell(shape, selectedCellId);
  const selectedVertexCells = selectedVertexId
    ? shape.cells.filter((cell) => cell.vertexIds.includes(selectedVertexId))
    : [];
  const cellCounts = countCellsByKind(shape);

  return (
    <Panel title="Object Inspector">
      <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
        <dt className="text-stone-500">Shape</dt>
        <dd className="truncate text-stone-200">{shape.name}</dd>
        <dt className="text-stone-500">Shape ID</dt>
        <dd className="break-all font-mono text-xs text-stone-300">{shape.id}</dd>
        <dt className="text-stone-500">Operation</dt>
        <dd className="text-stone-200">{shape.genealogy.operation}</dd>
        <dt className="text-stone-500">Parent</dt>
        <dd className="break-all font-mono text-xs text-stone-300">
          {shape.genealogy.parentShapeId ?? 'none'}
        </dd>
        <dt className="text-stone-500">Cells</dt>
        <dd className="text-stone-200">{formatCellCounts(cellCounts)}</dd>
      </dl>

      <div className="mt-4 border-t border-stone-800 pt-4">
        {selectedCell ? (
          <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
            <dt className="text-stone-500">Cell</dt>
            <dd className="break-all font-mono text-xs text-stone-300">{selectedCell.id}</dd>
            <dt className="text-stone-500">Kind</dt>
            <dd className="text-stone-200">{selectedCell.kind}</dd>
            <dt className="text-stone-500">Topology</dt>
            <dd className="text-stone-200">{describeCellTopology(selectedCell)}</dd>
            <dt className="text-stone-500">Generation</dt>
            <dd className="text-stone-200">{selectedCell.generationDepth}</dd>
            <dt className="text-stone-500">Parent cell</dt>
            <dd className="break-all font-mono text-xs text-stone-300">
              {selectedCell.parentCellId ?? 'none'}
            </dd>
            <dt className="text-stone-500">Source op</dt>
            <dd className="text-stone-200">{selectedCell.sourceOperation}</dd>
            {dualViewEnabled ? (
              <>
                <dt className="text-stone-500">View</dt>
                <dd className="text-stone-200">
                  {isDualViewSupportedCell(shape, selectedCell)
                    ? 'Dual View active: displaying dual proxy'
                    : 'Dual View active: original shown dimmed'}
                </dd>
              </>
            ) : null}
          </dl>
        ) : (
          <p className="text-sm text-stone-500">Click a cell in the workspace to inspect it.</p>
        )}
      </div>

      <div className="mt-4 border-t border-stone-800 pt-4">
        {vertex ? (
          <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
            <dt className="text-stone-500">Vertex</dt>
            <dd className="break-all font-mono text-xs text-stone-300">{vertex.id}</dd>
            <dt className="text-stone-500">Position</dt>
            <dd className="font-mono text-xs text-stone-300">{formatVec3(vertex.position)}</dd>
            <dt className="text-stone-500">Created by</dt>
            <dd className="text-stone-200">{vertex.createdBy.operation}</dd>
            <dt className="text-stone-500">Sources</dt>
            <dd className="break-all font-mono text-xs text-stone-300">
              {vertex.createdBy.sourceVertexIds.length
                ? vertex.createdBy.sourceVertexIds.join(', ')
                : 'none'}
            </dd>
            <dt className="text-stone-500">Cell roles</dt>
            <dd className="text-stone-200">
              {selectedVertexCells.length
                ? selectedVertexCells.map((cell) => cell.kind).join(', ')
                : 'none'}
            </dd>
          </dl>
        ) : (
          <p className="text-sm text-stone-500">Click a vertex in the workspace to inspect it.</p>
        )}
      </div>
    </Panel>
  );
}

export function RightSidebar() {
  const [activeTab, setActiveTab] = useState<RightSidebarTab>('workspace');

  return (
    <div className="flex h-full min-h-[440px] flex-col">
      <div className="grid grid-cols-3 border-b border-stone-800 bg-neutral-950 p-2">
        {(['workspace', 'selection', 'history'] as RightSidebarTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`h-9 rounded text-sm font-semibold capitalize transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
              activeTab === tab
                ? 'bg-teal-400/15 text-teal-100'
                : 'text-stone-400 hover:bg-stone-900 hover:text-stone-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {activeTab === 'workspace' ? <WorkspacePanel /> : null}
        {activeTab === 'selection' ? <SelectionPanel /> : null}
        {activeTab === 'history' ? <HistoryPanel /> : null}
      </div>
    </div>
  );
}

function WorkspacePanel() {
  return (
    <section className="p-4">
      <WorkspaceTopologyContent />
    </section>
  );
}

function SelectionPanel() {
  const shape = useCurrentShape();
  const selectedCellId = useGeometryStore((state) => state.selectedCellId);
  const selectedVertexId = useGeometryStore((state) => state.selectedVertexId);
  const dualViewEnabled = useGeometryStore((state) => state.viewLayout.dualViewEnabled);
  const selectedCell = findCell(shape, selectedCellId);
  const vertex = selectedVertexId ? shape.vertices[selectedVertexId] : null;
  const rows = useMemo(() => getWorkspaceCellRows(shape), [shape]);
  const selectedCellRow = selectedCell ? rows.find((row) => row.id === selectedCell.id) ?? null : null;
  const selectedCellFaces = useMemo(
    () => (selectedCell ? getCellFaces(shape, selectedCell) : []),
    [selectedCell, shape],
  );
  const selectedCellEdges = useMemo(
    () => (selectedCell ? getCellEdges(shape, selectedCell) : []),
    [selectedCell, shape],
  );

  return (
    <section className="grid gap-4 p-4">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
          Cell
        </h2>
        {selectedCell && selectedCellRow ? (
          <SelectedCellSummary
            row={selectedCellRow}
            faceCount={selectedCellFaces.length}
            vertexCount={selectedCell.vertexIds.length}
            edgeCount={selectedCellEdges.length}
            dualViewEnabled={dualViewEnabled}
            shape={shape}
          />
        ) : (
          <p className="mt-2 text-sm text-stone-500">No cell selected.</p>
        )}
      </div>
      {selectedCell ? (
        <CellComposition
          shape={shape}
          cell={selectedCell}
          faces={selectedCellFaces}
          edges={selectedCellEdges}
        />
      ) : null}

      <div className="border-t border-stone-800 pt-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
          Vertex Packet
        </h2>
        {vertex ? <SelectedVertexSummary vertexId={vertex.id} shape={shape} /> : null}
        <div className="mt-3">
          <VertexPacketEditorContent />
        </div>
      </div>
    </section>
  );
}

function SelectedCellSummary({
  row,
  faceCount,
  vertexCount,
  edgeCount,
  dualViewEnabled,
  shape,
}: {
  row: WorkspaceCellRow;
  faceCount: number;
  vertexCount: number;
  edgeCount: number;
  dualViewEnabled: boolean;
  shape: Shape;
}) {
  return (
    <div className="mt-2 rounded border border-stone-800 bg-stone-950 px-3 py-3 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-stone-100">{row.topology}</p>
          <p className="mt-1 truncate font-mono text-xs text-stone-500">{row.shortId}</p>
        </div>
        <span
          className={`shrink-0 rounded border px-2 py-0.5 text-xs ${
            row.isOperable
              ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
              : 'border-stone-700 bg-stone-900 text-stone-500'
          }`}
          title={row.disabledReason ?? 'Ambo Dissection available'}
        >
          {row.isOperable ? 'Ambo enabled' : 'Ambo disabled'}
        </span>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
        <dt className="text-stone-500">Kind</dt>
        <dd className="text-right text-stone-200">{row.kind}</dd>
        <dt className="text-stone-500">Generation</dt>
        <dd className="text-right text-stone-200">{row.generationDepth}</dd>
        <dt className="text-stone-500">Children</dt>
        <dd className="text-right text-stone-200">{row.childCount}</dd>
        <dt className="text-stone-500">Faces</dt>
        <dd className="text-right text-stone-200">{faceCount}</dd>
        <dt className="text-stone-500">Vertices</dt>
        <dd className="text-right text-stone-200">{vertexCount}</dd>
        <dt className="text-stone-500">Edges</dt>
        <dd className="text-right text-stone-200">{edgeCount}</dd>
        <dt className="text-stone-500">Lineage</dt>
        <dd className="text-right text-stone-200">{formatCellLineageSummary(shape, row.cell)}</dd>
        <dt className="text-stone-500">Packet</dt>
        <dd className="text-right text-stone-200">{formatPacketDataSummary(row.cell.data)}</dd>
      </dl>
      <p className="mt-3 truncate text-xs text-stone-600">{formatParentLabel(row)}</p>
      {dualViewEnabled ? (
        <p className="mt-2 text-xs text-stone-500">
          {isDualViewSupportedCell(shape, row.cell)
            ? 'Dual View active: displaying dual proxy'
            : 'Dual View active: original shown dimmed'}
        </p>
      ) : null}
    </div>
  );
}

function CellComposition({
  shape,
  cell,
  faces,
  edges,
}: {
  shape: Shape;
  cell: Cell;
  faces: Face[];
  edges: CellEdgeRow[];
}) {
  const selectVertex = useGeometryStore((state) => state.selectVertex);
  const selectedVertexId = useGeometryStore((state) => state.selectedVertexId);
  const vertices = useMemo(() => getCellVertexRows(shape, cell), [cell, shape]);
  const faceRows = useMemo(() => getCellFaceRows(shape, faces), [faces, shape]);

  return (
    <div className="grid gap-4 border-t border-stone-800 pt-4">
      <SelectionSubsection title="Cell Vertices" count={vertices.length}>
        <div className="grid max-h-56 gap-2 overflow-y-auto pr-1">
          {vertices.map((row) => {
            const isSelected = row.vertex.id === selectedVertexId;

            return (
              <button
                key={row.vertex.id}
                type="button"
                onClick={() => selectVertex(row.vertex.id)}
                className={`rounded border px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? 'border-amber-300 bg-amber-300/10 text-amber-100'
                    : 'border-stone-800 bg-stone-950 text-stone-300 hover:border-stone-600'
                }`}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="min-w-0">
                    <span className="mt-1 block truncate text-stone-200">
                      {row.displayLabel}
                    </span>
                    <span className="block truncate font-mono text-xs text-stone-500">
                      {row.shortId}
                    </span>
                    {row.packetDetail ? (
                      <span className="mt-1 block truncate text-xs text-stone-500">
                        {row.packetDetail}
                      </span>
                    ) : null}
                  </span>
                  <span className="shrink-0 rounded border border-stone-700 bg-stone-900 px-2 py-0.5 text-xs text-stone-400">
                    {row.role}
                  </span>
                </span>
                <span className="mt-2 block truncate text-xs text-stone-500">
                  {row.lineageSummary}
                </span>
              </button>
            );
          })}
        </div>
      </SelectionSubsection>

      <SelectionSubsection title="Cell Faces" count={faceRows.length}>
        <div className="grid max-h-56 gap-2 overflow-y-auto pr-1">
          {faceRows.map((row) => (
            <div
              key={row.face.id}
              className="rounded border border-stone-800 bg-stone-950 px-3 py-2 text-sm"
            >
              <span className="flex items-start justify-between gap-2">
                <span className="min-w-0">
                  <span className="block truncate font-mono text-xs text-stone-400">
                    {row.shortId}
                  </span>
                  <span className="mt-1 block text-stone-200">{row.sourceRole}</span>
                </span>
                <span className="shrink-0 rounded border border-stone-700 bg-stone-900 px-2 py-0.5 text-xs text-stone-400">
                  {row.size} vertices
                </span>
              </span>
              <span className="mt-2 block truncate text-xs text-stone-500">
                {row.lineageSummary}
              </span>
            </div>
          ))}
        </div>
      </SelectionSubsection>

      <SelectionSubsection title="Cell Edges" count={edges.length}>
        <div className="grid max-h-44 gap-1 overflow-y-auto rounded border border-stone-800 bg-stone-950 p-2">
          {edges.map((edge) => (
            <div
              key={edge.id}
              className="rounded border border-stone-900 bg-stone-950/70 px-2 py-1 text-xs text-stone-400"
              title={edge.vertexIds.join(' - ')}
            >
              <span className="block truncate text-stone-300">{edge.displayLabel}</span>
              {edge.secondaryLabel ? (
                <span className="mt-0.5 block truncate font-mono text-[11px] text-stone-600">
                  {edge.secondaryLabel}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </SelectionSubsection>
    </div>
  );
}

function SelectionSubsection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
        {title}
        <span className="font-mono text-[11px] tracking-normal text-stone-600">{count}</span>
      </h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function SelectedVertexSummary({ vertexId, shape }: { vertexId: string; shape: Shape }) {
  const vertex = shape.vertices[vertexId];
  const selectedVertexCells = shape.cells.filter((cell) => cell.vertexIds.includes(vertexId));
  const containingFaces = getContainingFaces(shape, vertexId);
  const displayLabel = getVertexDisplayLabel(shape, vertexId);
  const shortId = shortenId(vertexId);

  if (!vertex) {
    return null;
  }

  return (
    <dl className="mt-2 grid grid-cols-[88px_minmax(0,1fr)] gap-x-3 gap-y-2 rounded border border-stone-800 bg-stone-950 px-3 py-3 text-sm">
      <dt className="text-stone-500">Vertex</dt>
      <dd className="min-w-0">
        <span className="block truncate text-stone-200">{displayLabel}</span>
        {displayLabel !== shortId ? (
          <span className="block truncate font-mono text-xs text-stone-500">{shortId}</span>
        ) : null}
      </dd>
      <dt className="text-stone-500">Position</dt>
      <dd className="font-mono text-xs text-stone-300">{formatVec3(vertex.position)}</dd>
      <dt className="text-stone-500">Packet</dt>
      <dd className="truncate text-stone-200">{formatVertexPacketPreview(vertex)}</dd>
      <dt className="text-stone-500">Lineage</dt>
      <dd className="text-stone-200">{formatVertexLineageSummary(shape, vertex)}</dd>
      <dt className="text-stone-500">Cells</dt>
      <dd className="text-stone-200">{selectedVertexCells.length}</dd>
      <dt className="text-stone-500">Faces</dt>
      <dd className="text-stone-200">{containingFaces.length}</dd>
    </dl>
  );
}

function HistoryPanel() {
  const undoWorkspace = useGeometryStore((state) => state.undoWorkspace);
  const redoWorkspace = useGeometryStore((state) => state.redoWorkspace);
  const canUndo = useGeometryStore((state) => state.undoStack.length > 0);
  const canRedo = useGeometryStore((state) => state.redoStack.length > 0);
  const operationHistory = useGeometryStore((state) => state.operationHistory);
  const redoOperationHistory = useGeometryStore((state) => state.redoOperationHistory);

  return (
    <section className="grid gap-4 p-4">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={undoWorkspace}
          disabled={!canUndo}
          className="h-9 rounded border border-stone-700 bg-stone-900 px-3 text-sm font-semibold text-stone-100 transition hover:border-stone-500 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:cursor-not-allowed disabled:border-stone-800 disabled:bg-stone-950 disabled:text-stone-600"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={redoWorkspace}
          disabled={!canRedo}
          className="h-9 rounded border border-stone-700 bg-stone-900 px-3 text-sm font-semibold text-stone-100 transition hover:border-stone-500 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:cursor-not-allowed disabled:border-stone-800 disabled:bg-stone-950 disabled:text-stone-600"
        >
          Redo
        </button>
      </div>
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
          Operation History
        </h2>
        <div className="mt-2">
          <OperationHistoryList entries={operationHistory} />
        </div>
      </div>
      {redoOperationHistory.length ? (
        <div className="border-t border-stone-800 pt-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
            Redo Branch
          </h2>
          <div className="mt-2">
            <OperationHistoryList entries={redoOperationHistory} isRedoBranch />
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function WorkspaceTopologyBrowser() {
  return (
    <Panel title="Workspace Topology">
      <WorkspaceTopologyContent />
    </Panel>
  );
}

function WorkspaceTopologyContent() {
  const shape = useCurrentShape();
  const selectedCellId = useGeometryStore((state) => state.selectedCellId);
  const selectCell = useGeometryStore((state) => state.selectCell);
  const [topologyFilter, setTopologyFilter] = useState<TopologyFilter>('all');
  const [operabilityFilter, setOperabilityFilter] = useState<OperabilityFilter>('all');
  const rows = useMemo(() => getWorkspaceCellRows(shape), [shape]);
  const filteredRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          matchesTopologyFilter(row, topologyFilter) &&
          matchesOperabilityFilter(row, operabilityFilter),
      ),
    [operabilityFilter, rows, topologyFilter],
  );
  const tree = useMemo(() => buildWorkspaceCellTree(filteredRows), [filteredRows]);
  const cellCounts = countCellsByKind(shape);

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <label className="grid gap-1 text-xs text-stone-400">
          Topology
          <select
            value={topologyFilter}
            onChange={(event) => setTopologyFilter(event.target.value as TopologyFilter)}
            className="h-9 rounded border border-stone-700 bg-stone-950 px-2 text-xs text-stone-100 outline-none focus:border-teal-400"
          >
            {topologyFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs text-stone-400">
          Ambo
          <select
            value={operabilityFilter}
            onChange={(event) => setOperabilityFilter(event.target.value as OperabilityFilter)}
            className="h-9 rounded border border-stone-700 bg-stone-950 px-2 text-xs text-stone-100 outline-none focus:border-teal-400"
          >
            <option value="all">All</option>
            <option value="operable">Operable</option>
            <option value="disabled">Disabled</option>
          </select>
        </label>
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded border border-stone-800 bg-stone-950 px-2 py-2">
          <dt className="text-stone-500">Cells</dt>
          <dd className="mt-1 text-stone-200">{shape.cells.length}</dd>
        </div>
        <div className="rounded border border-stone-800 bg-stone-950 px-2 py-2">
          <dt className="text-stone-500">Core</dt>
          <dd className="mt-1 text-stone-200">{cellCounts.core}</dd>
        </div>
        <div className="rounded border border-stone-800 bg-stone-950 px-2 py-2">
          <dt className="text-stone-500">Residue</dt>
          <dd className="mt-1 text-stone-200">{cellCounts.residue}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-stone-500">
        {filteredRows.length} of {rows.length} cells shown
      </p>
      <div className="mt-3 grid max-h-[calc(100vh-17rem)] gap-2 overflow-y-auto pr-1">
        {tree.roots.length ? (
          tree.roots.map((row) => (
            <WorkspaceCellTreeRow
              key={row.id}
              row={row}
              childrenByParent={tree.childrenByParent}
              depth={0}
              selectedCellId={selectedCellId}
              onSelect={selectCell}
            />
          ))
        ) : (
          <p className="text-sm text-stone-500">No cells match the current filters.</p>
        )}
      </div>
    </>
  );
}

function WorkspaceCellTreeRow({
  row,
  childrenByParent,
  depth,
  selectedCellId,
  onSelect,
}: {
  row: WorkspaceCellRow;
  childrenByParent: Map<string, WorkspaceCellRow[]>;
  depth: number;
  selectedCellId: string | null;
  onSelect: (cellId: string | null) => void;
}) {
  const children = childrenByParent.get(row.id) ?? [];
  const isSelected = row.id === selectedCellId;

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={() => onSelect(row.id)}
        aria-pressed={isSelected}
        style={{ paddingLeft: 12 + depth * 14 }}
        className={`rounded border py-2 pr-3 text-left text-sm transition ${
          isSelected
            ? 'border-amber-300 bg-amber-300/10 text-amber-100'
            : 'border-stone-800 bg-stone-950 text-stone-300 hover:border-stone-600'
        }`}
      >
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0">
            <span className="block truncate font-medium text-stone-100">{row.topology}</span>
            <span className="mt-1 block truncate font-mono text-xs text-stone-500">
              {row.shortId}
            </span>
          </span>
          <span
            className={`shrink-0 rounded border px-2 py-0.5 text-xs ${
              row.isOperable
                ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                : 'border-stone-700 bg-stone-900 text-stone-500'
            }`}
            title={row.disabledReason ?? 'Ambo Dissection available'}
          >
            {row.isOperable ? 'Operable' : 'Disabled'}
          </span>
        </span>
        <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-500">
          <span>{row.kind}</span>
          <span>g{row.generationDepth}</span>
          <span>{row.childCount} children</span>
        </span>
        <span className="mt-1 block truncate text-xs text-stone-600">
          {formatParentLabel(row)}
        </span>
      </button>
      {children.map((child) => (
        <WorkspaceCellTreeRow
          key={child.id}
          row={child}
          childrenByParent={childrenByParent}
          depth={depth + 1}
          selectedCellId={selectedCellId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export function GenealogyViewer() {
  const shapes = useGeometryStore((state) => state.shapes);
  const shapeOrder = useGeometryStore((state) => state.shapeOrder);
  const currentShapeId = useGeometryStore((state) => state.currentShapeId);
  const selectShape = useGeometryStore((state) => state.selectShape);
  const operationHistory = useGeometryStore((state) => state.operationHistory);
  const redoOperationHistory = useGeometryStore((state) => state.redoOperationHistory);
  const currentShape = shapes[currentShapeId];

  return (
    <Panel title="Genealogy">
      <div className="grid gap-2">
        {shapeOrder.map((shapeId) => {
          const shape = shapes[shapeId];
          const isCurrent = shapeId === currentShapeId;

          return (
            <button
              key={shapeId}
              type="button"
              onClick={() => selectShape(shapeId)}
              className={`rounded border px-3 py-2 text-left text-sm transition ${
                isCurrent
                  ? 'border-teal-400 bg-teal-400/10 text-teal-100'
                  : 'border-stone-800 bg-stone-950 text-stone-300 hover:border-stone-600'
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-medium">{shape.name}</span>
                <span className="font-mono text-xs text-stone-500">
                  g{shape.genealogy.generationDepth}
                </span>
              </span>
              <span className="mt-1 block truncate font-mono text-xs text-stone-500">
                {shape.genealogy.parentShapeId ?? 'seed'}
              </span>
              <span className="mt-1 block text-xs text-stone-500">
                {shape.genealogy.operation} - {formatCellCounts(countCellsByKind(shape))}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 border-t border-stone-800 pt-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
          Operation History
        </h3>
        <OperationHistoryList entries={operationHistory} />
        {redoOperationHistory.length ? (
          <div className="mt-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
              Redo Branch
            </h3>
            <OperationHistoryList entries={redoOperationHistory} isRedoBranch />
          </div>
        ) : null}
      </div>
      <div className="mt-4 border-t border-stone-800 pt-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
          Cell History
        </h3>
        <div className="grid gap-2">
          {currentShape.generations.map((generation) => (
            <div
              key={generation.id}
              className="rounded border border-stone-800 bg-stone-950 px-3 py-2 text-sm"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-stone-200">{generation.sourceOperation}</span>
                <span className="font-mono text-xs text-stone-500">g{generation.depth}</span>
              </span>
              <span className="mt-1 block text-xs text-stone-500">
                {generation.createdCellIds.length} cells - {generation.createdVertexIds.length}{' '}
                vertices
              </span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function OperationHistoryList({
  entries,
  isRedoBranch = false,
}: {
  entries: OperationHistoryEntry[];
  isRedoBranch?: boolean;
}) {
  if (!entries.length) {
    return <p className="text-sm text-stone-500">No operations yet.</p>;
  }

  return (
    <div className="grid gap-2">
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={`rounded border px-3 py-2 text-sm ${
            isRedoBranch
              ? 'border-stone-800 bg-stone-950/60 text-stone-500'
              : 'border-stone-800 bg-stone-950 text-stone-300'
          }`}
        >
          <span className="flex items-center justify-between gap-2">
            <span className="font-medium text-stone-200">{entry.label}</span>
            <span className="font-mono text-xs text-stone-500">g{entry.generationDepth}</span>
          </span>
          <span className="mt-1 block truncate font-mono text-xs text-stone-500">
            {formatHistoryTarget(entry)}
          </span>
          <span className="mt-1 block text-xs text-stone-500">
            {entry.producedCellCount} cells produced
          </span>
        </div>
      ))}
    </div>
  );
}

export function VertexDataPacketEditor() {
  return (
    <Panel title="Vertex Data Packet">
      <VertexPacketEditorContent />
    </Panel>
  );
}

function VertexPacketEditorContent() {
  const shape = useCurrentShape();
  const selectedVertexId = useGeometryStore((state) => state.selectedVertexId);
  const updateSelectedVertexData = useGeometryStore((state) => state.updateSelectedVertexData);
  const vertex = selectedVertexId ? shape.vertices[selectedVertexId] : null;
  const [customText, setCustomText] = useState('{}');
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    if (vertex) {
      setCustomText(JSON.stringify(vertex.data.custom, null, 2));
      setJsonError(null);
    }
  }, [vertex?.id, vertex?.data.custom]);

  if (!vertex) {
    return <p className="text-sm text-stone-500">No vertex selected.</p>;
  }

  const updatePacket = (patch: Partial<VertexDataPacket>) => {
    updateSelectedVertexData(patch);
  };

  const saveCustomJson = () => {
    try {
      const parsed = JSON.parse(customText) as JsonValue;

      if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
        setJsonError('Custom data must be a JSON object.');
        return;
      }

      updatePacket({ custom: parsed as Record<string, JsonValue> });
      setJsonError(null);
    } catch {
      setJsonError('Custom data is not valid JSON.');
    }
  };

  return (
    <div className="grid gap-3">
      <label className="grid gap-1 text-sm text-stone-300">
        Label
        <input
          value={vertex.data.label}
          onChange={(event) => updatePacket({ label: event.target.value })}
          className="h-9 rounded border border-stone-700 bg-stone-950 px-3 text-stone-100 outline-none focus:border-teal-400"
        />
      </label>

      <label className="grid gap-1 text-sm text-stone-300">
        Color
        <input
          type="color"
          value={vertex.data.color}
          onChange={(event) => updatePacket({ color: event.target.value })}
          className="h-10 w-full rounded border border-stone-700 bg-stone-950 p-1"
        />
      </label>

      <label className="grid gap-1 text-sm text-stone-300">
        Tags
        <input
          value={vertex.data.tags.join(', ')}
          onChange={(event) =>
            updatePacket({
              tags: event.target.value
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean),
            })
          }
          placeholder="comma, separated"
          className="h-9 rounded border border-stone-700 bg-stone-950 px-3 text-stone-100 outline-none placeholder:text-stone-600 focus:border-teal-400"
        />
      </label>

      <label className="grid gap-1 text-sm text-stone-300">
        Notes
        <textarea
          value={vertex.data.notes}
          onChange={(event) => updatePacket({ notes: event.target.value })}
          rows={4}
          className="resize-none rounded border border-stone-700 bg-stone-950 px-3 py-2 text-stone-100 outline-none focus:border-teal-400"
        />
      </label>

      <label className="grid gap-1 text-sm text-stone-300">
        Custom JSON
        <textarea
          value={customText}
          onChange={(event) => setCustomText(event.target.value)}
          onBlur={saveCustomJson}
          spellCheck={false}
          rows={5}
          className="resize-none rounded border border-stone-700 bg-stone-950 px-3 py-2 font-mono text-xs text-stone-100 outline-none focus:border-teal-400"
        />
      </label>
      {jsonError ? <p className="text-xs text-rose-300">{jsonError}</p> : null}
    </div>
  );
}

function useCurrentShape() {
  const shapes = useGeometryStore((state) => state.shapes);
  const currentShapeId = useGeometryStore((state) => state.currentShapeId);

  return useMemo(() => shapes[currentShapeId], [currentShapeId, shapes]);
}

function findCell(shape: Shape, cellId: string | null): Cell | null {
  if (!cellId) {
    return null;
  }

  return shape.cells.find((cell) => cell.id === cellId) ?? null;
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

function getCellFaces(shape: Shape, cell: Cell): Face[] {
  const facesById = new Map(shape.faces.map((face) => [face.id, face]));

  return cell.faceIds
    .map((faceId) => facesById.get(faceId))
    .filter((face): face is Face => Boolean(face));
}

function getCellEdges(shape: Shape, cell: Cell): CellEdgeRow[] {
  const edges = new Map<string, CellEdgeRow>();

  for (const face of getCellFaces(shape, cell)) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = canonicalVertexPairKey(a, b);

      if (!edges.has(key)) {
        edges.set(key, {
          id: key,
          vertexIds: [a, b],
          displayLabel: formatEdgeRef(shape, [a, b]),
          secondaryLabel: `${shortenId(a)} - ${shortenId(b)}`,
        });
      }
    }
  }

  return Array.from(edges.values()).sort((a, b) => a.displayLabel.localeCompare(b.displayLabel));
}

function getCellVertexRows(shape: Shape, cell: Cell): CellVertexRow[] {
  return cell.vertexIds
    .map((vertexId) => shape.vertices[vertexId])
    .filter((vertex): vertex is Vertex => Boolean(vertex))
    .map((vertex) => {
      const role = inferCellVertexRole(cell, vertex);

      return {
        vertex,
        displayLabel: getVertexDisplayLabel(shape, vertex.id),
        shortId: shortenId(vertex.id),
        role,
        packetDetail: formatVertexPacketDetail(vertex),
        lineageSummary:
          role === 'preserved source'
            ? 'preserved source vertex'
            : formatVertexLineageSummary(shape, vertex),
      };
    });
}

function getCellFaceRows(shape: Shape, faces: Face[]): CellFaceRow[] {
  return faces.map((face) => ({
    face,
    shortId: shortenId(face.id),
    size: face.vertexIds.length,
    sourceRole: inferFaceSourceRole(shape, face),
    lineageSummary: formatFaceLineageSummary(shape, face),
  }));
}

function getContainingFaces(shape: Shape, vertexId: VertexId): Face[] {
  return shape.faces.filter((face) => face.vertexIds.includes(vertexId));
}

function inferCellVertexRole(cell: Cell, vertex: Vertex): string {
  if (cell.preservedVertexId === vertex.id) {
    return 'preserved source';
  }

  if (
    vertex.createdBy.sourceEdgeId ||
    vertex.data.lineage?.inheritanceMode === 'derived-from-edge'
  ) {
    return 'generated midpoint';
  }

  if (
    vertex.createdBy.operation === 'seed' ||
    vertex.data.lineage?.inheritanceMode === 'default'
  ) {
    return 'seed/source';
  }

  if (cell.sourceVertexIds.includes(vertex.id)) {
    return 'source';
  }

  return 'unknown';
}

function inferFaceSourceRole(shape: Shape, face: Face): string {
  if (face.role === 'seed-face') {
    return 'seed face';
  }

  if (face.sourceFaceId) {
    return `derived from source face ${getFaceDisplayLabel(shape, face.sourceFaceId)}`;
  }

  if (face.sourceVertexId) {
    return `derived from source vertex ${getVertexDisplayLabel(shape, face.sourceVertexId)}`;
  }

  return 'unknown';
}

function canonicalVertexPairKey(a: VertexId, b: VertexId): string {
  return [a, b].sort().join('|');
}

function getWorkspaceCellRows(shape: Shape): WorkspaceCellRow[] {
  const cellIds = new Set(shape.cells.map((cell) => cell.id));
  const childCounts = shape.cells.reduce<Record<string, number>>((counts, cell) => {
    if (!cell.parentCellId) {
      return counts;
    }

    return {
      ...counts,
      [cell.parentCellId]: (counts[cell.parentCellId] ?? 0) + 1,
    };
  }, {});

  return [...shape.cells]
    .sort(compareCellsForBrowser)
    .map((cell) => {
      const operationContext = {
        shape,
        selectedCellId: cell.id,
        selectedCell: cell,
      };
      const isOperable = defaultOperation.canApply(operationContext);

      return {
        cell,
        id: cell.id,
        shortId: shortenId(cell.id),
        topology: describeCellTopology(cell),
        kind: cell.kind,
        generationDepth: cell.generationDepth,
        parentCellId: cell.parentCellId,
        parentKnown: Boolean(cell.parentCellId && cellIds.has(cell.parentCellId)),
        childCount: childCounts[cell.id] ?? 0,
        isOperable,
        disabledReason: isOperable ? null : defaultOperation.getDisabledReason(operationContext),
      };
    });
}

function buildWorkspaceCellTree(rows: WorkspaceCellRow[]): {
  roots: WorkspaceCellRow[];
  childrenByParent: Map<string, WorkspaceCellRow[]>;
} {
  const visibleIds = new Set(rows.map((row) => row.id));
  const roots: WorkspaceCellRow[] = [];
  const childrenByParent = new Map<string, WorkspaceCellRow[]>();

  for (const row of rows) {
    if (row.parentCellId && visibleIds.has(row.parentCellId)) {
      const siblings = childrenByParent.get(row.parentCellId) ?? [];

      siblings.push(row);
      childrenByParent.set(row.parentCellId, siblings);
    } else {
      roots.push(row);
    }
  }

  roots.sort(compareRowsForBrowser);
  childrenByParent.forEach((children) => children.sort(compareRowsForBrowser));

  return { roots, childrenByParent };
}

function compareCellsForBrowser(a: Cell, b: Cell): number {
  return (
    a.generationDepth - b.generationDepth ||
    describeCellTopology(a).localeCompare(describeCellTopology(b)) ||
    a.kind.localeCompare(b.kind) ||
    a.id.localeCompare(b.id)
  );
}

function compareRowsForBrowser(a: WorkspaceCellRow, b: WorkspaceCellRow): number {
  return (
    a.generationDepth - b.generationDepth ||
    a.topology.localeCompare(b.topology) ||
    a.kind.localeCompare(b.kind) ||
    a.id.localeCompare(b.id)
  );
}

function matchesTopologyFilter(row: WorkspaceCellRow, filter: TopologyFilter): boolean {
  if (filter === 'all') {
    return true;
  }

  if (filter === 'other') {
    return !topologyFilterOptions.some(
      (option) => option.value !== 'all' && option.value !== 'other' && option.value === row.topology,
    );
  }

  return row.topology === filter;
}

function matchesOperabilityFilter(row: WorkspaceCellRow, filter: OperabilityFilter): boolean {
  if (filter === 'operable') {
    return row.isOperable;
  }

  if (filter === 'disabled') {
    return !row.isOperable;
  }

  return true;
}

function shortenId(id: string): string {
  return id.length > 34 ? `${id.slice(0, 18)}...${id.slice(-10)}` : id;
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

function formatVertexRef(shape: Shape, vertexId: VertexId): string {
  return getVertexDisplayLabel(shape, vertexId);
}

function formatEdgeRef(shape: Shape, vertexIds: [VertexId, VertexId]): string {
  return `${formatVertexRef(shape, vertexIds[0])} - ${formatVertexRef(shape, vertexIds[1])}`;
}

function formatSourceRef(shape: Shape, sourceRef: PacketSourceRef): string {
  if (sourceRef.kind === 'vertex') {
    return formatVertexRef(shape, sourceRef.id);
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

function formatParentLabel(row: WorkspaceCellRow): string {
  if (!row.parentCellId) {
    return 'parent: none';
  }

  return row.parentKnown
    ? `parent: ${shortenId(row.parentCellId)}`
    : `parent unknown: ${shortenId(row.parentCellId)}`;
}

function formatVertexPacketPreview(vertex: Vertex): string {
  return getPacketDisplayLabel(vertex.data) ?? 'untitled packet';
}

function formatVertexPacketDetail(vertex: Vertex): string | null {
  if (vertex.data.tags.length) {
    return vertex.data.tags.slice(0, 2).join(', ');
  }

  const notesLine = getFirstMeaningfulLine(vertex.data.notes);
  const displayLabel = getPacketDisplayLabel(vertex.data);

  return notesLine && notesLine !== displayLabel ? notesLine : null;
}

function formatPacketDataSummary(data: Cell['data']): string {
  if (!data || !Object.keys(data).length) {
    return 'none';
  }

  const keys = Object.keys(data);

  return `${keys.length} fields`;
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

function formatFaceLineageSummary(shape: Shape, face: Face): string {
  if (!face.lineage) {
    return face.role === 'seed-face' ? 'seed face' : 'lineage unknown';
  }

  if (face.lineage.inheritanceMode === 'derived-from-face') {
    const sourceFace = findLineageSource(face.lineage, 'face');

    return sourceFace
      ? `face derived from source face ${formatSourceRef(shape, sourceFace)}`
      : 'face derived from source face';
  }

  if (face.lineage.inheritanceMode === 'derived-from-vertex') {
    const sourceVertex = findLineageSource(face.lineage, 'vertex');

    return sourceVertex
      ? `face derived from source vertex ${formatSourceRef(shape, sourceVertex)}`
      : 'face derived from source vertex';
  }

  if (face.lineage.inheritanceMode === 'default' || face.role === 'seed-face') {
    return 'seed face';
  }

  return formatLineageSummary(shape, face.lineage);
}

function formatCellLineageSummary(shape: Shape, cell: Cell): string {
  if (!cell.lineage) {
    return 'lineage unknown';
  }

  if (cell.lineage.inheritanceMode === 'derived-from-cell') {
    const sourceCell = findLineageSource(cell.lineage, 'cell');

    return sourceCell
      ? `cell derived from parent cell ${formatSourceRef(shape, sourceCell)}`
      : 'cell derived from parent cell';
  }

  if (cell.lineage.inheritanceMode === 'default') {
    return 'seed cell';
  }

  if (cell.lineage.inheritanceMode === 'preserved') {
    return 'preserved source cell';
  }

  return formatLineageSummary(shape, cell.lineage);
}

function findLineageSource(lineage: PacketLineage, kind: PacketLineage['sources'][number]['kind']) {
  return lineage.sources.find((source) => source.kind === kind);
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

function countCellsByKind(shape: Shape): Record<CellKind, number> {
  return shape.cells.reduce<Record<CellKind, number>>(
    (counts, cell) => ({
      ...counts,
      [cell.kind]: counts[cell.kind] + 1,
    }),
    {
      seed: 0,
      parent: 0,
      core: 0,
      residue: 0,
    },
  );
}

function formatCellCounts(counts: Record<CellKind, number>): string {
  const parts: Array<[CellKind, number]> = [
    ['seed', counts.seed],
    ['parent', counts.parent],
    ['core', counts.core],
    ['residue', counts.residue],
  ];

  return parts
    .filter(([, count]) => count > 0)
    .map(([kind, count]) => `${kind}:${count}`)
    .join(' ');
}

function formatHistoryTarget(entry: OperationHistoryEntry): string {
  if (entry.targetTopology && entry.targetCellId) {
    return `${entry.targetTopology} - ${shortenId(entry.targetCellId)}`;
  }

  if (entry.targetTopology) {
    return entry.targetTopology;
  }

  return shortenId(entry.targetCellId ?? entry.shapeId);
}

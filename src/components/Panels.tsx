import { useEffect, useMemo, useState } from 'react';
import { seedRegistry } from '../data/seeds';
import { isDualViewSupportedCell } from '../lib/dualView';
import { defaultOperation } from '../operations/registry';
import { formatVec3 } from '../lib/shape';
import { type OperationHistoryEntry, useGeometryStore } from '../store/geometryStore';
import type { Cell, CellKind, JsonValue, Shape, VertexDataPacket } from '../types/geometry';
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

  return (
    <section className="grid gap-4 p-4">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
          Cell
        </h2>
        {selectedCell && selectedCellRow ? (
          <SelectedCellSummary
            row={selectedCellRow}
            faceCount={selectedCell.faceIds.length}
            vertexCount={selectedCell.vertexIds.length}
            dualViewEnabled={dualViewEnabled}
            shape={shape}
          />
        ) : (
          <p className="mt-2 text-sm text-stone-500">No cell selected.</p>
        )}
      </div>

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
  dualViewEnabled,
  shape,
}: {
  row: WorkspaceCellRow;
  faceCount: number;
  vertexCount: number;
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

function SelectedVertexSummary({ vertexId, shape }: { vertexId: string; shape: Shape }) {
  const vertex = shape.vertices[vertexId];
  const selectedVertexCells = shape.cells.filter((cell) => cell.vertexIds.includes(vertexId));

  if (!vertex) {
    return null;
  }

  return (
    <dl className="mt-2 grid grid-cols-[88px_minmax(0,1fr)] gap-x-3 gap-y-2 rounded border border-stone-800 bg-stone-950 px-3 py-3 text-sm">
      <dt className="text-stone-500">Vertex</dt>
      <dd className="truncate font-mono text-xs text-stone-300">{shortenId(vertex.id)}</dd>
      <dt className="text-stone-500">Position</dt>
      <dd className="font-mono text-xs text-stone-300">{formatVec3(vertex.position)}</dd>
      <dt className="text-stone-500">Packet</dt>
      <dd className="truncate text-stone-200">{vertex.data.label}</dd>
      <dt className="text-stone-500">Lineage</dt>
      <dd className="text-stone-200">{formatLineageSummary(vertex.data.lineage)}</dd>
      <dt className="text-stone-500">Cell roles</dt>
      <dd className="text-stone-200">
        {selectedVertexCells.length
          ? selectedVertexCells.map((cell) => describeCellTopology(cell)).join(', ')
          : 'none'}
      </dd>
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

function formatParentLabel(row: WorkspaceCellRow): string {
  if (!row.parentCellId) {
    return 'parent: none';
  }

  return row.parentKnown
    ? `parent: ${shortenId(row.parentCellId)}`
    : `parent unknown: ${shortenId(row.parentCellId)}`;
}

function formatLineageSummary(lineage: VertexDataPacket['lineage']): string {
  if (!lineage) {
    return 'none';
  }

  const sourceCount = lineage.sources.length;

  return `${lineage.inheritanceMode}${sourceCount ? `, ${sourceCount} sources` : ''}`;
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
    return `${entry.targetTopology} - ${entry.targetCellId}`;
  }

  if (entry.targetTopology) {
    return entry.targetTopology;
  }

  return entry.targetCellId ?? entry.shapeId;
}

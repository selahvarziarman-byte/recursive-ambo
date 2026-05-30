import { type ChangeEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { seedRegistry } from '../data/seeds';
import {
  getCellChildCount,
  getCellLifecycleStatus,
  getCellLifecycleStatusLabel,
  isCellActiveFrontier,
  type CellLifecycleStatus,
} from '../lib/cellLifecycle';
import {
  isDualViewSupportedCell,
  resolveDualInspectionTarget,
  type ResolvedDualInspectionTarget,
} from '../lib/dualView';
import { defaultOperation, registeredOperations } from '../operations/registry';
import { formatVec3 } from '../lib/shape';
import {
  getTopologyFrontierRows,
  type CellTopologySignature,
  type TopologyFrontierGroup,
} from '../lib/topologySignature';
import { parseWorkspaceImport } from '../lib/workspacePersistence';
import {
  type DualInspectionTarget,
  type OperationHistoryEntry,
  useGeometryStore,
} from '../store/geometryStore';
import type {
  Cell,
  CellKind,
  Face,
  JsonValue,
  PacketLineage,
  PacketSourceRef,
  Shape,
  Vec3,
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
  | 'pyritohedral-icosahedron'
  | 'dodecahedron'
  | 'square-pyramid'
  | 'rhombicuboctahedron'
  | 'rectified-square-pyramid'
  | 'rectified-square-pyramid-ambo-core'
  | 'other';

type OperabilityFilter = 'all' | 'operable' | 'disabled';
type RightSidebarTab = 'workspace' | 'selection' | 'packets' | 'history';
type PacketWorkbenchFilter =
  | 'unresolved-generated'
  | 'all'
  | 'generated-midpoints'
  | 'source'
  | 'empty'
  | 'named';
type PacketStatus = 'named' | 'annotated' | 'empty' | 'lineage-only';

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
  lifecycleStatus: CellLifecycleStatus;
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
  roleLabel: string | null;
}

interface PacketWorkbenchRow {
  vertex: Vertex;
  displayLabel: string;
  shortId: string;
  role: string;
  status: PacketStatus;
  containingCellCount: number;
  containingFaceCount: number;
  generationDepth: number | null;
  lineageSummary: string;
}

const topologyFilterOptions: Array<{ value: TopologyFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'tetrahedron', label: 'tetrahedron' },
  { value: 'octahedron', label: 'octahedron' },
  { value: 'cube', label: 'cube' },
  { value: 'cuboctahedron', label: 'cuboctahedron' },
  { value: 'pyritohedral-icosahedron', label: 'pyritohedral-icosahedron' },
  { value: 'dodecahedron', label: 'dodecahedron' },
  { value: 'square-pyramid', label: 'square-pyramid' },
  { value: 'rhombicuboctahedron', label: 'rhombicuboctahedron' },
  { value: 'rectified-square-pyramid', label: 'rectified-square-pyramid' },
  {
    value: 'rectified-square-pyramid-ambo-core',
    label: 'rectified-square-pyramid-ambo-core',
  },
  { value: 'other', label: 'unknown/other' },
];

const packetFilterOptions: Array<{ value: PacketWorkbenchFilter; label: string }> = [
  { value: 'unresolved-generated', label: 'Unresolved generated' },
  { value: 'all', label: 'All vertices' },
  { value: 'generated-midpoints', label: 'Generated midpoints' },
  { value: 'source', label: 'Preserved/source' },
  { value: 'empty', label: 'Empty / unresolved' },
  { value: 'named', label: 'Named packets' },
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
  const operationContext = { shape, selectedCellId, selectedCell };
  const operationRows = registeredOperations.map((operation) => {
    const canApply = operation.canApply(operationContext);

    return {
      operation,
      canApply,
      status:
        operation.getStatusMessage?.(operationContext) ??
        operation.getDisabledReason(operationContext) ??
        operation.description,
    };
  });
  const availableOperationRows = operationRows.filter((row) => row.canApply);
  const visibleOperationRows = availableOperationRows.length
    ? availableOperationRows
    : operationRows.filter((row) => row.operation.id === defaultOperation.id);
  const primaryOperationRow = visibleOperationRows[0] ?? operationRows[0];
  const cellCounts = countCellsByKind(shape);
  const operationStatus =
    availableOperationRows.length > 1
      ? `${availableOperationRows.length} operations are available for the selected cell.`
      : primaryOperationRow?.status;

  return (
    <Panel title="Operation Controls">
      <div className="grid gap-2">
        {visibleOperationRows.map(({ operation, canApply }) => (
          <button
            key={operation.id}
            type="button"
            onClick={() => applyOperationToSelection(operation.id)}
            disabled={!canApply}
            className="h-10 w-full rounded border border-amber-500/70 bg-amber-400 px-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:cursor-not-allowed disabled:border-stone-700 disabled:bg-stone-800 disabled:text-stone-500"
          >
            Apply {operation.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm leading-5 text-stone-400">{operationStatus}</p>
      <button
        type="button"
        onClick={resetWorkspace}
        className="mt-4 h-10 w-full rounded border border-stone-700 bg-stone-900 px-3 text-sm font-semibold text-stone-100 transition hover:border-stone-500 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500"
      >
        Reset Workspace
      </button>
      <WorkspacePersistenceControls />
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

function WorkspacePersistenceControls() {
  const exportWorkspace = useGeometryStore((state) => state.exportWorkspace);
  const importWorkspace = useGeometryStore((state) => state.importWorkspace);
  const [status, setStatus] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);

  function handleExport() {
    try {
      const workspace = exportWorkspace();
      const blob = new Blob([JSON.stringify(workspace, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `platonic-engine-workspace-${formatWorkspaceTimestamp(new Date())}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus({ kind: 'success', message: 'Workspace JSON exported.' });
    } catch (error) {
      setStatus({ kind: 'error', message: formatImportExportError(error) });
    }
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsedJson = JSON.parse(text);
      const workspace = parseWorkspaceImport(parsedJson);

      importWorkspace(workspace);
      setStatus({ kind: 'success', message: 'Workspace JSON imported.' });
    } catch (error) {
      setStatus({ kind: 'error', message: formatImportExportError(error) });
    } finally {
      input.value = '';
    }
  }

  return (
    <div className="mt-4 border-t border-stone-800 pt-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
        Save / Load
      </h3>
      <div className="mt-3 grid gap-2">
        <button
          type="button"
          onClick={handleExport}
          className="h-9 w-full rounded border border-stone-700 bg-stone-900 px-3 text-sm text-stone-100 transition hover:border-stone-500 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500"
        >
          Export Workspace JSON
        </button>
        <label className="flex h-9 w-full cursor-pointer items-center justify-center rounded border border-stone-700 bg-stone-900 px-3 text-sm text-stone-100 transition hover:border-stone-500 hover:bg-stone-800 focus-within:ring-2 focus-within:ring-stone-500">
          Import Workspace JSON
          <input
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            className="sr-only"
          />
        </label>
      </div>
      {status ? (
        <p
          className={`mt-3 text-sm leading-5 ${
            status.kind === 'error' ? 'text-red-300' : 'text-stone-400'
          }`}
        >
          {status.message}
        </p>
      ) : null}
    </div>
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
    <div className="flex h-full min-h-0 flex-col">
      <div className="grid grid-cols-4 border-b border-stone-800 bg-neutral-950 p-2">
        {(['workspace', 'selection', 'packets', 'history'] as RightSidebarTab[]).map((tab) => (
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
        {activeTab === 'packets' ? <PacketsPanel /> : null}
        {activeTab === 'history' ? <HistoryPanel /> : null}
      </div>
    </div>
  );
}

function WorkspacePanel() {
  return (
    <section className="grid gap-4 p-4">
      <WorkspaceTopologyContent />
      <AmboSupportFrontier />
    </section>
  );
}

function SelectionPanel() {
  const shape = useCurrentShape();
  const selectedCellId = useGeometryStore((state) => state.selectedCellId);
  const selectedVertexId = useGeometryStore((state) => state.selectedVertexId);
  const dualViewEnabled = useGeometryStore((state) => state.viewLayout.dualViewEnabled);
  const isolateSelectedCell = useGeometryStore((state) => state.viewLayout.isolateSelectedCell);
  const toggleIsolateSelectedCell = useGeometryStore((state) => state.toggleIsolateSelectedCell);
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
          <>
            <SelectedCellSummary
              row={selectedCellRow}
              faceCount={selectedCellFaces.length}
              vertexCount={selectedCell.vertexIds.length}
              edgeCount={selectedCellEdges.length}
              dualViewEnabled={dualViewEnabled}
              shape={shape}
            />
            <CellLineageNavigation row={selectedCellRow} rows={rows} />
          </>
        ) : (
          <p className="mt-2 text-sm text-stone-500">No cell selected.</p>
        )}
      </div>
      <DualUniverseInspectionSection />
      {selectedCell ? (
        <label className="flex items-center justify-between gap-3 rounded border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-300">
          Isolate selected cell
          <input
            type="checkbox"
            checked={isolateSelectedCell}
            onChange={toggleIsolateSelectedCell}
            disabled={!selectedCell}
            className="h-4 w-4 accent-amber-300 disabled:opacity-50"
          />
        </label>
      ) : null}
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
        {vertex ? (
          <SelectedVertexSummary
            vertexId={vertex.id}
            shape={shape}
            selectedCell={selectedCell}
          />
        ) : null}
        <div className="mt-3">
          <VertexPacketEditorContent />
        </div>
      </div>
    </section>
  );
}

function DualUniverseInspectionSection() {
  const shape = useCurrentShape();
  const dualInspectionTarget = useGeometryStore((state) => state.dualInspectionTarget);
  const clearDualInspectionTarget = useGeometryStore((state) => state.clearDualInspectionTarget);
  const resolvedTarget = useMemo(
    () =>
      dualInspectionTarget
        ? resolveDualInspectionTarget(shape, dualInspectionTarget)
        : null,
    [dualInspectionTarget, shape],
  );

  if (!dualInspectionTarget) {
    return null;
  }

  const isCorrespondenceTarget = dualInspectionTarget.modelKind === 'correspondence';

  return (
    <div className="rounded border border-violet-400/30 bg-violet-400/5 px-3 py-3 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-200">
            {isCorrespondenceTarget ? 'Dual Correspondence Inspection' : 'Dual Universe Inspection'}
          </h2>
          <p className="mt-2 text-xs leading-5 text-stone-400">
            {isCorrespondenceTarget
              ? 'Read-only correspondence model. This is not a generated Shape and does not edit packets.'
              : 'Dual Universe inspection is read-only.'}
          </p>
        </div>
        <button
          type="button"
          onClick={clearDualInspectionTarget}
          className="rounded border border-stone-700 bg-stone-950 px-2 py-1 text-xs text-stone-300 transition hover:border-stone-500 hover:text-stone-100"
        >
          Clear
        </button>
      </div>
      {resolvedTarget ? (
        <>
          <SourceNavigationActions resolvedTarget={resolvedTarget} />
          <ResolvedDualInspectionDetails shape={shape} resolvedTarget={resolvedTarget} />
        </>
      ) : (
        <StaleDualInspectionDetails target={dualInspectionTarget} />
      )}
    </div>
  );
}

function ResolvedDualInspectionDetails({
  shape,
  resolvedTarget,
}: {
  shape: Shape;
  resolvedTarget: ResolvedDualInspectionTarget;
}) {
  if (resolvedTarget.modelKind === 'correspondence') {
    return (
      <ResolvedDualCorrespondenceInspectionDetails
        shape={shape}
        resolvedTarget={resolvedTarget}
      />
    );
  }

  if (resolvedTarget.kind === 'face') {
    const packetSummary = resolvedTarget.sourceVertex
      ? formatVertexPacketDetail(resolvedTarget.sourceVertex) ??
        getPacketDisplayLabel(resolvedTarget.sourceVertex.data) ??
        'untitled packet'
      : 'source vertex unavailable';

    return (
      <dl className="mt-3 grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
        <InspectionDetail label="Entity" value="dual face" />
        <InspectionDetail label="Dual face" value={resolvedTarget.dualFace.id} code />
        <InspectionDetail label="Source cell" value={resolvedTarget.target.sourceCellId} code />
        <InspectionDetail label="Source vertex" value={resolvedTarget.target.sourceVertexId} code />
        <InspectionDetail
          label="Lineage"
          value={resolvedTarget.dualFace.lineage?.inheritanceMode ?? 'none'}
        />
        <InspectionDetail
          label="Dual vertices"
          value={resolvedTarget.dualFace.vertexIds.join(', ')}
          code
        />
        <InspectionDetail label="Packet" value={packetSummary} />
      </dl>
    );
  }

  if (resolvedTarget.kind === 'edge') {
    return (
      <dl className="mt-3 grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
        <InspectionDetail label="Entity" value="dual edge" />
        <InspectionDetail label="Dual edge" value={resolvedTarget.dualEdge.id} code />
        <InspectionDetail label="Source edge" value={resolvedTarget.target.sourceEdgeId} code />
        <InspectionDetail label="Source cell" value={resolvedTarget.target.sourceCellId} code />
        <InspectionDetail
          label="Lineage"
          value={resolvedTarget.dualEdge.lineage?.inheritanceMode ?? 'none'}
        />
        <InspectionDetail
          label="Dual vertices"
          value={resolvedTarget.dualEdge.vertexIds.join(', ')}
          code
        />
        <InspectionDetail
          label="Source endpoints"
          value={
            resolvedTarget.sourceEdge
              ? formatEdgeRef(shape, resolvedTarget.sourceEdge.vertexIds)
              : 'source edge unavailable'
          }
        />
      </dl>
    );
  }

  if (resolvedTarget.kind === 'vertex') {
    return (
      <dl className="mt-3 grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
        <InspectionDetail label="Entity" value="dual vertex" />
        <InspectionDetail label="Dual vertex" value={resolvedTarget.dualVertex.id} code />
        <InspectionDetail label="Source face" value={resolvedTarget.target.sourceFaceId} code />
        <InspectionDetail label="Source cell" value={resolvedTarget.target.sourceCellId} code />
        <InspectionDetail
          label="Lineage"
          value={resolvedTarget.dualVertex.data.lineage?.inheritanceMode ?? 'none'}
        />
        <InspectionDetail
          label="Source face vertices"
          value={resolvedTarget.sourceFace?.vertexIds.join(', ') ?? 'source face unavailable'}
          code={Boolean(resolvedTarget.sourceFace)}
        />
        <InspectionDetail
          label="Position"
          value={formatVec3(resolvedTarget.dualVertex.position)}
          code
        />
      </dl>
    );
  }

  return (
    <dl className="mt-3 grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
      <InspectionDetail label="Entity" value="dual cell" />
      <InspectionDetail label="Dual cell" value={resolvedTarget.dualCell.id} code />
      <InspectionDetail label="Source cell" value={resolvedTarget.target.sourceCellId} code />
      <InspectionDetail
        label="Lineage"
        value={resolvedTarget.dualCell.lineage?.inheritanceMode ?? 'none'}
      />
      <InspectionDetail label="Topology" value={resolvedTarget.dualCell.topology ?? 'unknown'} />
    </dl>
  );
}

function ResolvedDualCorrespondenceInspectionDetails({
  shape,
  resolvedTarget,
}: {
  shape: Shape;
  resolvedTarget: Extract<ResolvedDualInspectionTarget, { modelKind: 'correspondence' }>;
}) {
  if (resolvedTarget.kind === 'face') {
    const packetSummary = resolvedTarget.sourceVertex
      ? formatVertexPacketDetail(resolvedTarget.sourceVertex) ??
        getPacketDisplayLabel(resolvedTarget.sourceVertex.data) ??
        'untitled packet'
      : 'source vertex unavailable';

    return (
      <dl className="mt-3 grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
        <InspectionDetail label="Entity" value="dual face" />
        <InspectionDetail label="Model" value="read-only correspondence" />
        <InspectionDetail label="Topology" value={resolvedTarget.correspondenceModel.dualTopologyLabel} />
        <InspectionDetail label="Dual face" value={resolvedTarget.dualFace.id} code />
        <InspectionDetail label="Source cell" value={resolvedTarget.target.sourceCellId} code />
        <InspectionDetail label="Source vertex" value={resolvedTarget.target.sourceVertexId} code />
        <InspectionDetail
          label="Dual vertices"
          value={resolvedTarget.dualFace.vertexIds.join(', ')}
          code
        />
        <InspectionDetail label="Source packet" value={packetSummary} />
      </dl>
    );
  }

  if (resolvedTarget.kind === 'edge') {
    return (
      <dl className="mt-3 grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
        <InspectionDetail label="Entity" value="dual edge" />
        <InspectionDetail label="Model" value="read-only correspondence" />
        <InspectionDetail label="Topology" value={resolvedTarget.correspondenceModel.dualTopologyLabel} />
        <InspectionDetail label="Dual edge" value={resolvedTarget.dualEdge.id} code />
        <InspectionDetail label="Source edge" value={resolvedTarget.target.sourceEdgeId} code />
        <InspectionDetail label="Source cell" value={resolvedTarget.target.sourceCellId} code />
        <InspectionDetail
          label="Dual vertices"
          value={resolvedTarget.dualEdge.vertexIds.join(', ')}
          code
        />
        <InspectionDetail
          label="Source endpoints"
          value={
            resolvedTarget.sourceEdge
              ? formatEdgeRef(shape, resolvedTarget.sourceEdge.vertexIds)
              : 'source edge unavailable'
          }
        />
      </dl>
    );
  }

  return (
    <dl className="mt-3 grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
      <InspectionDetail label="Entity" value="dual vertex" />
      <InspectionDetail label="Model" value="read-only correspondence" />
      <InspectionDetail label="Topology" value={resolvedTarget.correspondenceModel.dualTopologyLabel} />
      <InspectionDetail label="Dual vertex" value={resolvedTarget.dualVertex.id} code />
      <InspectionDetail label="Source face" value={resolvedTarget.target.sourceFaceId} code />
      <InspectionDetail label="Source cell" value={resolvedTarget.target.sourceCellId} code />
      <InspectionDetail
        label="Source face vertices"
        value={resolvedTarget.sourceFace?.vertexIds.join(', ') ?? 'source face unavailable'}
        code={Boolean(resolvedTarget.sourceFace)}
      />
      <InspectionDetail
        label="Position"
        value={formatVec3(resolvedTarget.dualVertex.position)}
        code
      />
    </dl>
  );
}

function SourceNavigationActions({
  resolvedTarget,
}: {
  resolvedTarget: ResolvedDualInspectionTarget;
}) {
  const selectCell = useGeometryStore((state) => state.selectCell);
  const selectVertex = useGeometryStore((state) => state.selectVertex);
  const clearDualInspectionTarget = useGeometryStore((state) => state.clearDualInspectionTarget);
  const setHoverTarget = useGeometryStore((state) => state.setHoverTarget);
  const sourceVertex = resolvedTarget.kind === 'face' ? resolvedTarget.sourceVertex : null;

  function handleSelectSourceCell() {
    setHoverTarget(null);
    selectCell(resolvedTarget.sourceCell.id);
    clearDualInspectionTarget();
  }

  function handleSelectSourceVertex() {
    if (!sourceVertex) {
      return;
    }

    setHoverTarget(null);
    selectCell(resolvedTarget.sourceCell.id);
    selectVertex(sourceVertex.id);
    clearDualInspectionTarget();
  }

  return (
    <div className="mt-3 border-t border-violet-400/20 pt-3">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-violet-200">
        Source
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSelectSourceCell}
          className="rounded border border-stone-700 bg-stone-950 px-2.5 py-1.5 text-xs font-semibold text-stone-200 transition hover:border-cyan-300 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          Select source cell
        </button>
        {sourceVertex ? (
          <button
            type="button"
            onClick={handleSelectSourceVertex}
            className="rounded border border-stone-700 bg-stone-950 px-2.5 py-1.5 text-xs font-semibold text-stone-200 transition hover:border-amber-300 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            Select source vertex
          </button>
        ) : null}
      </div>
    </div>
  );
}

function StaleDualInspectionDetails({ target }: { target: DualInspectionTarget }) {
  return (
    <dl className="mt-3 grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
      <InspectionDetail label="Entity" value={`stale dual ${target.kind}`} />
      <InspectionDetail label="Source cell" value={target.sourceCellId} code />
      <InspectionDetail
        label="Status"
        value={
          target.modelKind === 'correspondence'
            ? 'The source cell no longer produces the selected read-only Dual Correspondence model.'
            : 'The source cell no longer produces a semantic Dual Universe model.'
        }
      />
    </dl>
  );
}

function InspectionDetail({
  label,
  value,
  code = false,
}: {
  label: string;
  value: string;
  code?: boolean;
}) {
  return (
    <>
      <dt className="text-stone-500">{label}</dt>
      <dd className={`${code ? 'break-all font-mono text-xs' : ''} text-stone-200`}>{value}</dd>
    </>
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
        <dt className="text-stone-500">Lifecycle</dt>
        <dd className="text-right text-stone-200">
          {getCellLifecycleStatusLabel(row.lifecycleStatus)}
        </dd>
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

function CellLineageNavigation({
  row,
  rows,
}: {
  row: WorkspaceCellRow;
  rows: WorkspaceCellRow[];
}) {
  const selectCell = useGeometryStore((state) => state.selectCell);
  const setHoverTarget = useGeometryStore((state) => state.setHoverTarget);
  const parentRow = row.cell.parentCellId
    ? rows.find((candidate) => candidate.id === row.cell.parentCellId) ?? null
    : null;
  const childRows = rows.filter((candidate) => candidate.cell.parentCellId === row.id);
  const parentStatus = row.cell.parentCellId
    ? parentRow
      ? `${parentRow.kind} ${parentRow.topology} ${parentRow.shortId}`
      : `Parent missing: ${shortenId(row.cell.parentCellId)}`
    : 'none';

  function handleSelectCell(cellId: string) {
    setHoverTarget(null);
    selectCell(cellId);
  }

  return (
    <div className="mt-3 rounded border border-stone-800 bg-stone-950 px-3 py-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
          Lineage Navigation
        </h3>
        <span className="shrink-0 rounded border border-stone-700 bg-stone-900 px-2 py-0.5 text-xs text-stone-400">
          {childRows.length} children
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-2 text-xs">
        <dt className="text-stone-500">Lifecycle</dt>
        <dd className="text-stone-200">{getCellLifecycleStatusLabel(row.lifecycleStatus)}</dd>
        <dt className="text-stone-500">Generation</dt>
        <dd className="text-stone-200">g{row.generationDepth}</dd>
        <dt className="text-stone-500">Source op</dt>
        <dd className="text-stone-200">{row.cell.sourceOperation}</dd>
        <dt className="text-stone-500">Children</dt>
        <dd className="text-stone-200">{childRows.length}</dd>
        <dt className="text-stone-500">Parent</dt>
        <dd
          className={`${parentRow ? 'text-stone-200' : 'text-stone-500'} truncate`}
          title={parentRow?.id ?? row.cell.parentCellId ?? undefined}
        >
          {parentStatus}
        </dd>
      </dl>

      <div className="mt-3 border-t border-stone-800 pt-3">
        <div className="mb-2 text-xs font-semibold text-stone-500">Parent</div>
        {parentRow ? (
          <button
            type="button"
            onClick={() => handleSelectCell(parentRow.id)}
            onPointerEnter={() => setHoverTarget({ kind: 'cell', cellId: parentRow.id })}
            onPointerLeave={() => setHoverTarget(null)}
            className="w-full rounded border border-stone-700 bg-stone-900 px-3 py-2 text-left text-xs text-stone-200 transition hover:border-amber-300 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <span className="block font-medium">
              {parentRow.kind} {parentRow.topology} g{parentRow.generationDepth}
            </span>
            <span className="mt-1 block truncate font-mono text-[11px] text-stone-500">
              {parentRow.shortId}
            </span>
          </button>
        ) : (
          <p className="text-xs text-stone-500">
            {row.cell.parentCellId ? 'Parent unavailable in current shape.' : 'No parent cell.'}
          </p>
        )}
      </div>

      <div className="mt-3 border-t border-stone-800 pt-3">
        <div className="mb-2 text-xs font-semibold text-stone-500">Children</div>
        {childRows.length ? (
          <div className="grid max-h-44 gap-2 overflow-y-auto pr-1">
            {childRows.map((childRow) => (
              <button
                key={childRow.id}
                type="button"
                onClick={() => handleSelectCell(childRow.id)}
                onPointerEnter={() => setHoverTarget({ kind: 'cell', cellId: childRow.id })}
                onPointerLeave={() => setHoverTarget(null)}
                className="rounded border border-stone-800 bg-stone-950 px-3 py-2 text-left text-xs text-stone-300 transition hover:border-cyan-300 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="min-w-0">
                    <span className="block font-medium text-stone-200">
                      {childRow.kind} {childRow.topology} g{childRow.generationDepth}
                    </span>
                    <span className="mt-1 block truncate font-mono text-[11px] text-stone-500">
                      {childRow.shortId}
                    </span>
                  </span>
                  <span className="shrink-0 rounded border border-stone-700 bg-stone-900 px-1.5 py-0.5 text-[10px] text-stone-400">
                    {getCellLifecycleStatusLabel(childRow.lifecycleStatus)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500">No child cells.</p>
        )}
      </div>
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
  const setHoverTarget = useGeometryStore((state) => state.setHoverTarget);
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
                onPointerEnter={() => setHoverTarget({ kind: 'vertex', vertexId: row.vertex.id })}
                onPointerLeave={() => setHoverTarget(null)}
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
              onPointerEnter={() => setHoverTarget({ kind: 'face', faceId: row.face.id })}
              onPointerLeave={() => setHoverTarget(null)}
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
              onPointerEnter={() => setHoverTarget({ kind: 'edge', vertexIds: edge.vertexIds })}
              onPointerLeave={() => setHoverTarget(null)}
              className="rounded border border-stone-900 bg-stone-950/70 px-2 py-1 text-xs text-stone-400"
              title={edge.vertexIds.join(' - ')}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-stone-300">{edge.displayLabel}</span>
                {edge.roleLabel ? (
                  <span className="shrink-0 rounded border border-rose-400/40 bg-rose-400/10 px-1.5 py-0.5 text-[10px] text-rose-200">
                    {edge.roleLabel}
                  </span>
                ) : null}
              </span>
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

function PacketsPanel() {
  const shape = useCurrentShape();
  const selectedVertexId = useGeometryStore((state) => state.selectedVertexId);
  const selectVertex = useGeometryStore((state) => state.selectVertex);
  const setHoverTarget = useGeometryStore((state) => state.setHoverTarget);
  const [filter, setFilter] = useState<PacketWorkbenchFilter>('unresolved-generated');
  const rows = useMemo(() => getPacketWorkbenchRows(shape), [shape]);
  const filteredRows = useMemo(() => filterPacketRows(rows, filter), [filter, rows]);
  const unresolvedRows = useMemo(
    () => rows.filter(isUnresolvedGeneratedPacketRow),
    [rows],
  );
  const selectedRow = selectedVertexId
    ? rows.find((row) => row.vertex.id === selectedVertexId) ?? null
    : null;
  const selectedIndex = selectedRow
    ? unresolvedRows.findIndex((row) => row.vertex.id === selectedRow.vertex.id)
    : -1;

  const selectUnresolved = (direction: 1 | -1) => {
    const nextRow =
      direction > 0
        ? findNextUnresolvedVertex(unresolvedRows, selectedVertexId)
        : findPreviousUnresolvedVertex(unresolvedRows, selectedVertexId);

    if (nextRow) {
      selectVertex(nextRow.vertex.id);
    }
  };

  return (
    <section className="grid gap-4 p-4">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
          Packet Workbench
        </h2>
        <p className="mt-2 text-sm leading-5 text-stone-400">
          {unresolvedRows.length} unresolved generated midpoint packets
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => selectUnresolved(-1)}
          disabled={!unresolvedRows.length}
          className="h-9 rounded border border-stone-700 bg-stone-900 px-2 text-sm text-stone-100 transition hover:border-stone-500 hover:bg-stone-800 disabled:cursor-not-allowed disabled:border-stone-800 disabled:bg-stone-950 disabled:text-stone-600"
        >
          Previous unresolved
        </button>
        <button
          type="button"
          onClick={() => selectUnresolved(1)}
          disabled={!unresolvedRows.length}
          className="h-9 rounded border border-stone-700 bg-stone-900 px-2 text-sm text-stone-100 transition hover:border-stone-500 hover:bg-stone-800 disabled:cursor-not-allowed disabled:border-stone-800 disabled:bg-stone-950 disabled:text-stone-600"
        >
          Next unresolved
        </button>
      </div>
      {unresolvedRows.length && selectedIndex >= 0 ? (
        <p className="text-xs text-stone-500">
          unresolved {selectedIndex + 1} of {unresolvedRows.length}
        </p>
      ) : null}

      <label className="grid gap-1 text-xs text-stone-400">
        Filter
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value as PacketWorkbenchFilter)}
          className="h-9 rounded border border-stone-700 bg-stone-950 px-2 text-xs text-stone-100 outline-none focus:border-teal-400"
        >
          {packetFilterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="grid max-h-[calc(100vh-29rem)] gap-2 overflow-y-auto pr-1">
        {filteredRows.length ? (
          filteredRows.map((row) => (
            <PacketWorkbenchRowButton
              key={row.vertex.id}
              row={row}
              isSelected={row.vertex.id === selectedVertexId}
              onSelect={() => selectVertex(row.vertex.id)}
              onHover={(isHovered) =>
                setHoverTarget(isHovered ? { kind: 'vertex', vertexId: row.vertex.id } : null)
              }
            />
          ))
        ) : (
          <p className="rounded border border-stone-800 bg-stone-950 px-3 py-3 text-sm text-stone-500">
            {filter === 'unresolved-generated'
              ? 'no unresolved generated midpoint packets.'
              : 'No vertex packets match the current filter.'}
          </p>
        )}
      </div>

      <div className="border-t border-stone-800 pt-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
          Edit Selected Packet
        </h2>
        <div className="mt-3">
          <VertexPacketEditorContent />
        </div>
      </div>
    </section>
  );
}

function PacketWorkbenchRowButton({
  row,
  isSelected,
  onSelect,
  onHover,
}: {
  row: PacketWorkbenchRow;
  isSelected: boolean;
  onSelect: () => void;
  onHover: (isHovered: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      className={`rounded border px-3 py-2 text-left text-sm transition ${
        isSelected
          ? 'border-amber-300 bg-amber-300/10 text-amber-100'
          : 'border-stone-800 bg-stone-950 text-stone-300 hover:border-stone-600'
      }`}
    >
      <span className="flex items-start justify-between gap-2">
        <span className="min-w-0">
          <span className="block truncate text-stone-100">{row.displayLabel}</span>
          <span className="mt-0.5 block truncate font-mono text-xs text-stone-500">
            {row.shortId}
          </span>
        </span>
        <span className={packetStatusClassName(row.status)}>{formatPacketStatus(row.status)}</span>
      </span>
      <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-500">
        <span>{row.role}</span>
        <span>{row.generationDepth === null ? 'g?' : `g${row.generationDepth}`}</span>
        <span>{row.containingCellCount} cells</span>
        <span>{row.containingFaceCount} faces</span>
      </span>
      <span className="mt-2 block truncate text-xs text-stone-500">{row.lineageSummary}</span>
    </button>
  );
}

function SelectedVertexSummary({
  vertexId,
  shape,
  selectedCell,
}: {
  vertexId: string;
  shape: Shape;
  selectedCell: Cell | null;
}) {
  const selectVertex = useGeometryStore((state) => state.selectVertex);
  const vertex = shape.vertices[vertexId];
  const selectedVertexCells = shape.cells.filter((cell) => cell.vertexIds.includes(vertexId));
  const containingFaces = getContainingFaces(shape, vertexId);
  const displayLabel = getVertexDisplayLabel(shape, vertexId);
  const shortId = shortenId(vertexId);
  const antipodalResult = useMemo(
    () => findCellAntipodalVertices(shape, selectedCell, vertexId),
    [selectedCell, shape, vertexId],
  );

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
      <dt className="text-stone-500">Antipodal</dt>
      <dd className="min-w-0 text-stone-200">
        <AntipodalVertexValue
          result={antipodalResult}
          shape={shape}
          onSelectVertex={selectVertex}
        />
      </dd>
    </dl>
  );
}

type AntipodalVertexResult =
  | { status: 'select-cell' }
  | { status: 'outside-cell' }
  | { status: 'matches'; vertices: Vertex[] };

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
  const isExpanded = row.lifecycleStatus !== 'active';

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
            : isExpanded
              ? 'border-stone-900 bg-stone-950/50 text-stone-500 hover:border-stone-700'
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
                : isExpanded
                  ? 'border-amber-400/30 bg-amber-400/10 text-amber-200'
                : 'border-stone-700 bg-stone-900 text-stone-500'
            }`}
            title={row.disabledReason ?? 'Ambo Dissection available'}
          >
            {row.isOperable ? 'Operable' : getCellLifecycleStatusLabel(row.lifecycleStatus)}
          </span>
        </span>
        <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone-500">
          <span>{row.kind}</span>
          <span>{getCellLifecycleStatusLabel(row.lifecycleStatus)}</span>
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

function AmboSupportFrontier() {
  const shape = useCurrentShape();
  const selectCell = useGeometryStore((state) => state.selectCell);
  const groups = useMemo(() => getTopologyFrontierRows(shape), [shape]);

  return (
    <div className="border-t border-stone-800 pt-4">
      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
        Ambo Support Frontier
      </h2>
      <div className="mt-3 grid gap-2">
        {groups.map((group) => (
          <AmboSupportFrontierRow
            key={group.topology}
            group={group}
            shape={shape}
            onSelectCell={selectCell}
          />
        ))}
      </div>
    </div>
  );
}

function AmboSupportFrontierRow({
  group,
  shape,
  onSelectCell,
}: {
  group: TopologyFrontierGroup;
  shape: Shape;
  onSelectCell: (cellId: string | null) => void;
}) {
  const activeCells = group.cells.filter((cell) => isCellActiveFrontier(shape, cell.id));
  const expandedCount = group.cells.length - activeCells.length;
  const operationStatuses = activeCells.map((cell) => {
    const context = { shape, selectedCellId: cell.id, selectedCell: cell };
    const enabled = defaultOperation.canApply(context);

    return {
      enabled,
      reason: enabled ? null : defaultOperation.getDisabledReason(context),
    };
  });
  const enabledCount = operationStatuses.filter((status) => status.enabled).length;
  const disabledActiveCount = activeCells.length - enabledCount;
  const disabledReasons = Array.from(
    new Set(
      operationStatuses
        .map((status) => status.reason)
        .filter((reason): reason is string => Boolean(reason)),
    ),
  );
  const signature = group.representative;
  const readinessClassName =
    signature.readinessStatus === 'enabled'
      ? 'text-emerald-200'
      : signature.readinessStatus.startsWith('blocked')
        ? 'text-rose-200'
        : 'text-amber-200';

  return (
    <details className="rounded border border-stone-800 bg-stone-950 px-3 py-2 text-sm">
      <summary className="cursor-pointer list-none">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="block truncate font-medium text-stone-100">{group.topology}</span>
            <span className="mt-1 block text-xs text-stone-500">
              {activeCells.length} active
              {expandedCount ? `, ${expandedCount} expanded` : ''} -{' '}
              {formatAmboStatus(enabledCount, activeCells.length)}
            </span>
          </span>
          <span
            className={`shrink-0 rounded border px-2 py-0.5 text-xs ${
              enabledCount
                ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                : 'border-stone-700 bg-stone-900 text-stone-500'
            }`}
          >
            {activeCells.length ? (enabledCount ? 'enabled' : 'disabled') : 'historical'}
          </span>
        </span>
        <span className="mt-2 block truncate text-xs text-stone-500">
          {formatCompactSignature(signature)}
          {group.signaturesVary ? ' - mixed signatures' : ''}
        </span>
        <span className={`mt-1 block truncate text-xs ${readinessClassName}`}>
          {signature.readinessStatus}
        </span>
      </summary>

      <div className="mt-3 grid gap-3 border-t border-stone-800 pt-3 text-xs">
        {expandedCount ? (
          <div className="rounded border border-stone-800 bg-stone-900/60 px-2 py-2 text-stone-400">
            <span className="block text-stone-500">Lifecycle</span>
            <span className="mt-1 block leading-5">
              {activeCells.length} active frontier, {expandedCount} expanded/historical
            </span>
          </div>
        ) : null}

        {disabledReasons.length || (!activeCells.length && expandedCount) ? (
          <div className="rounded border border-stone-800 bg-stone-900/60 px-2 py-2 text-stone-400">
            <span className="block text-stone-500">Disabled reason</span>
            <span className="mt-1 block leading-5">
              {disabledReasons[0] ?? 'Cell has already been expanded.'}
            </span>
            {disabledReasons.length > 1 ? (
              <span className="mt-1 block text-stone-600">
                + {disabledReasons.length - 1} more reason
                {disabledReasons.length === 2 ? '' : 's'}
              </span>
            ) : null}
          </div>
        ) : null}

        <dl className="grid grid-cols-3 gap-2">
          <MetricBox label="Vertices" value={signature.vertexCount} />
          <MetricBox label="Edges" value={signature.edgeCount} />
          <MetricBox label="Faces" value={signature.faceCount} />
        </dl>
        <dl className="grid grid-cols-2 gap-2">
          <MetricBox label="Active disabled" value={disabledActiveCount} />
          <MetricBox label="Expanded" value={expandedCount} />
        </dl>

        <dl className="grid gap-1 text-stone-400">
          <dt className="text-stone-500">Face sizes</dt>
          <dd>{formatHistogram(signature.faceSizeHistogram)}</dd>
          <dt className="text-stone-500">Vertex degrees</dt>
          <dd>{formatHistogram(signature.vertexDegreeHistogram)}</dd>
          <dt className="text-stone-500">Generic readiness</dt>
          <dd>{formatReadinessDetails(signature)}</dd>
        </dl>

        {signature.preview ? (
          <div className="rounded border border-stone-800 bg-stone-900/60 px-2 py-2 text-stone-400">
            <span className="block text-stone-500">Analytical output preview</span>
            <span className="mt-1 block leading-5">
              {signature.preview.midpointVertexCount} midpoint vertices,{' '}
              {signature.preview.residueCellCount} residues,{' '}
              {signature.preview.totalCoreFaceCount} core faces
            </span>
            <span className="mt-1 block leading-5">
              core faces: {signature.preview.coreSourceFaceFaceCount} from faces +{' '}
              {signature.preview.coreSourceVertexFaceCount} from vertices
            </span>
            <span className="mt-1 block leading-5">
              residues: {signature.preview.residueTypes.join(', ')}
            </span>
            <span className="mt-1 block leading-5">{signature.preview.coreClassification}</span>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => onSelectCell(group.cells[0]?.id ?? null)}
          className="h-8 rounded border border-stone-700 bg-stone-900 px-2 text-xs text-stone-200 transition hover:border-stone-500 hover:bg-stone-800"
        >
          Select representative cell
        </button>
      </div>
    </details>
  );
}

function MetricBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-stone-800 bg-stone-900/60 px-2 py-2">
      <dt className="text-stone-500">{label}</dt>
      <dd className="mt-1 text-stone-200">{value}</dd>
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
  const shapeEdgesByKey = new Map(
    shape.edges.map((edge) => [canonicalVertexPairKey(...edge.vertexIds), edge]),
  );

  for (const face of getCellFaces(shape, cell)) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = canonicalVertexPairKey(a, b);
      const edge = shapeEdgesByKey.get(key);
      const isConstructionDiagonal = edge?.role === 'construction-diagonal';

      if (!edges.has(key)) {
        edges.set(key, {
          id: key,
          vertexIds: [a, b],
          displayLabel: formatEdgeRef(shape, [a, b]),
          secondaryLabel: formatEdgeSecondaryLabel(edge, a, b),
          roleLabel: isConstructionDiagonal ? 'construction' : null,
        });
      }
    }
  }

  return Array.from(edges.values()).sort((a, b) => a.displayLabel.localeCompare(b.displayLabel));
}

function formatEdgeSecondaryLabel(
  edge: Shape['edges'][number] | undefined,
  a: VertexId,
  b: VertexId,
): string {
  const sourceLabels = [
    edge?.sourceEdgeId ? `source edge ${shortenId(edge.sourceEdgeId)}` : null,
    edge?.sourceFaceId ? `source face ${shortenId(edge.sourceFaceId)}` : null,
  ].filter((label): label is string => Boolean(label));

  return [`${shortenId(a)} - ${shortenId(b)}`, ...sourceLabels].join(' | ');
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

function getPacketWorkbenchRows(shape: Shape): PacketWorkbenchRow[] {
  return Object.values(shape.vertices)
    .map((vertex) => {
      const containingCells = getContainingCells(shape, vertex.id);
      const containingFaces = getContainingFaces(shape, vertex.id);

      return {
        vertex,
        displayLabel: getVertexDisplayLabel(shape, vertex.id),
        shortId: shortenId(vertex.id),
        role: getVertexRole(vertex),
        status: getVertexPacketStatus(shape, vertex),
        containingCellCount: containingCells.length,
        containingFaceCount: containingFaces.length,
        generationDepth: getVertexGenerationDepth(containingCells),
        lineageSummary: formatVertexLineageSummary(shape, vertex),
      };
    })
    .sort(comparePacketRows);
}

function filterPacketRows(
  rows: PacketWorkbenchRow[],
  filter: PacketWorkbenchFilter,
): PacketWorkbenchRow[] {
  if (filter === 'all') {
    return rows;
  }

  if (filter === 'unresolved-generated') {
    return rows.filter(isUnresolvedGeneratedPacketRow);
  }

  if (filter === 'generated-midpoints') {
    return rows.filter((row) => isGeneratedMidpointVertex(row.vertex));
  }

  if (filter === 'source') {
    return rows.filter((row) => row.role === 'seed/source' || row.role === 'preserved source');
  }

  if (filter === 'empty') {
    return rows.filter((row) => row.status === 'empty' || row.status === 'lineage-only');
  }

  return rows.filter((row) => row.status === 'named');
}

function isUnresolvedGeneratedPacketRow(row: PacketWorkbenchRow): boolean {
  return (
    isGeneratedMidpointVertex(row.vertex) &&
    (row.status === 'empty' || row.status === 'lineage-only')
  );
}

function findNextUnresolvedVertex(
  rows: PacketWorkbenchRow[],
  currentVertexId: VertexId | null,
): PacketWorkbenchRow | null {
  if (!rows.length) {
    return null;
  }

  const currentIndex = currentVertexId
    ? rows.findIndex((row) => row.vertex.id === currentVertexId)
    : -1;

  return rows[(currentIndex + 1 + rows.length) % rows.length];
}

function findPreviousUnresolvedVertex(
  rows: PacketWorkbenchRow[],
  currentVertexId: VertexId | null,
): PacketWorkbenchRow | null {
  if (!rows.length) {
    return null;
  }

  const currentIndex = currentVertexId
    ? rows.findIndex((row) => row.vertex.id === currentVertexId)
    : -1;
  const nextIndex = currentIndex >= 0 ? currentIndex - 1 : rows.length - 1;

  return rows[(nextIndex + rows.length) % rows.length];
}

function getContainingCells(shape: Shape, vertexId: VertexId): Cell[] {
  return shape.cells.filter((cell) => cell.vertexIds.includes(vertexId));
}

function getContainingFaces(shape: Shape, vertexId: VertexId): Face[] {
  return shape.faces.filter((face) => face.vertexIds.includes(vertexId));
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

function comparePacketRows(a: PacketWorkbenchRow, b: PacketWorkbenchRow): number {
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

  return `${base} border-stone-700 bg-stone-900 text-stone-500`;
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

  return [...shape.cells]
    .sort(compareCellsForBrowser)
    .map((cell) => {
      const operationContext = {
        shape,
        selectedCellId: cell.id,
        selectedCell: cell,
      };
      const isOperable = defaultOperation.canApply(operationContext);
      const lifecycleStatus = getCellLifecycleStatus(shape, cell.id);

      return {
        cell,
        id: cell.id,
        shortId: shortenId(cell.id),
        topology: describeCellTopology(cell),
        kind: cell.kind,
        generationDepth: cell.generationDepth,
        parentCellId: cell.parentCellId,
        parentKnown: Boolean(cell.parentCellId && cellIds.has(cell.parentCellId)),
        childCount: getCellChildCount(shape, cell.id),
        lifecycleStatus,
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

function formatWorkspaceTimestamp(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    '-',
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('');
}

function formatImportExportError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function formatAmboStatus(enabledCount: number, totalCount: number): string {
  if (totalCount === 0) {
    return 'no active frontier';
  }

  if (enabledCount === totalCount) {
    return 'Ambo enabled';
  }

  if (enabledCount === 0) {
    return 'Ambo disabled';
  }

  return `Ambo enabled for ${enabledCount} of ${totalCount}`;
}

function formatCompactSignature(signature: CellTopologySignature): string {
  return `${signature.vertexCount}V ${signature.edgeCount}E ${signature.faceCount}F`;
}

function formatReadinessDetails(signature: CellTopologySignature): string {
  if (!signature.readinessProblems.length) {
    return [
      signature.hasOrderedFaces ? 'ordered faces' : 'faces unavailable',
      signature.hasValidDerivedEdges ? 'derived edges' : 'edges unavailable',
      signature.hasValidVertexIncidentRings ? 'valid incident rings' : 'rings unavailable',
    ].join(', ');
  }

  return signature.readinessProblems.join('; ');
}

function formatHistogram(histogramValue: Record<number, number>): string {
  const entries = Object.entries(histogramValue).sort(([a], [b]) => Number(a) - Number(b));

  if (!entries.length) {
    return 'none';
  }

  return entries.map(([size, count]) => `${size}:${count}`).join(' ');
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

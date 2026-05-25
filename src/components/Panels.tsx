import { useEffect, useMemo, useState } from 'react';
import { seedRegistry } from '../data/seeds';
import { isDualViewSupportedCell } from '../lib/dualView';
import { defaultOperation } from '../operations/registry';
import { formatVec3 } from '../lib/shape';
import { useGeometryStore } from '../store/geometryStore';
import type { Cell, CellKind, JsonValue, Shape, VertexDataPacket } from '../types/geometry';
import { Panel } from './Panel';

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

export function GenealogyViewer() {
  const shapes = useGeometryStore((state) => state.shapes);
  const shapeOrder = useGeometryStore((state) => state.shapeOrder);
  const currentShapeId = useGeometryStore((state) => state.currentShapeId);
  const selectShape = useGeometryStore((state) => state.selectShape);
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

export function VertexDataPacketEditor() {
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
    return (
      <Panel title="Vertex Data Packet">
        <p className="text-sm text-stone-500">No vertex selected.</p>
      </Panel>
    );
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
    <Panel title="Vertex Data Packet">
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
    </Panel>
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
    return 'square pyramid';
  }

  return 'unknown';
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

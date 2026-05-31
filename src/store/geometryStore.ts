import { create } from 'zustand';
import { createSeedShape } from '../data/seeds';
import { isCellActiveFrontier } from '../lib/cellLifecycle';
import {
  serializeWorkspaceSnapshot,
  validateWorkspaceImport,
  type PersistedViewLayout,
  type PersistedWorkspaceV1,
} from '../lib/workspacePersistence';
import { getOperation } from '../operations/registry';
import type {
  Cell,
  CellId,
  EdgeId,
  FaceId,
  SeedKey,
  Shape,
  ShapeId,
  VertexDataPacket,
  VertexId,
} from '../types/geometry';

export type DualInspectionModelKind = 'semantic' | 'correspondence';

type SemanticDualInspectionTargetBase = {
  universe: 'dual';
  modelKind: 'semantic';
  sourceCellId: CellId;
  dualModelId: ShapeId;
};

type CorrespondenceDualInspectionTargetBase = {
  universe: 'dual';
  modelKind: 'correspondence';
  sourceCellId: CellId;
  dualModelId: string;
};

export type DualInspectionTarget =
  | (SemanticDualInspectionTargetBase & { kind: 'cell'; dualCellId: CellId })
  | (SemanticDualInspectionTargetBase & { kind: 'vertex'; dualVertexId: VertexId; sourceFaceId: FaceId })
  | (SemanticDualInspectionTargetBase & { kind: 'face'; dualFaceId: FaceId; sourceVertexId: VertexId })
  | (SemanticDualInspectionTargetBase & { kind: 'edge'; dualEdgeId: EdgeId; sourceEdgeId: EdgeId })
  | (CorrespondenceDualInspectionTargetBase & { kind: 'vertex'; dualVertexId: VertexId; sourceFaceId: FaceId })
  | (CorrespondenceDualInspectionTargetBase & { kind: 'face'; dualFaceId: FaceId; sourceVertexId: VertexId })
  | (CorrespondenceDualInspectionTargetBase & { kind: 'edge'; dualEdgeId: EdgeId; sourceEdgeId: EdgeId });

interface CellVisibility {
  showCoreCells: boolean;
  showResidueCells: boolean;
  showParentCells: boolean;
}

interface ViewLayout {
  explodeAmount: number;
  dualViewEnabled: boolean;
  isolateSelectedCell: boolean;
  showFieldAtlasSamples: boolean;
}

export type InspectionHoverTarget =
  | { kind: 'cell'; cellId: CellId }
  | { kind: 'vertex'; vertexId: VertexId }
  | { kind: 'edge'; vertexIds: [VertexId, VertexId] }
  | { kind: 'face'; faceId: FaceId };

interface WorkspaceSnapshot {
  selectedSeedKey: SeedKey;
  shapes: Record<ShapeId, Shape>;
  shapeOrder: ShapeId[];
  currentShapeId: ShapeId;
  selectedCellId: CellId | null;
  selectedVertexId: VertexId | null;
}

export interface OperationHistoryEntry {
  id: string;
  label: string;
  operationId: string;
  targetCellId: CellId | null;
  targetTopology: string | null;
  generationDepth: number;
  producedCellCount: number;
  shapeId: ShapeId;
  createdAt: string;
}

const defaultCellVisibility: CellVisibility = {
  showCoreCells: true,
  showResidueCells: true,
  showParentCells: false,
};

const defaultViewLayout: ViewLayout = {
  explodeAmount: 0,
  dualViewEnabled: false,
  isolateSelectedCell: false,
  showFieldAtlasSamples: false,
};

const HISTORY_LIMIT = 50;

interface GeometryState {
  selectedSeedKey: SeedKey;
  shapes: Record<ShapeId, Shape>;
  shapeOrder: ShapeId[];
  currentShapeId: ShapeId;
  selectedCellId: CellId | null;
  selectedVertexId: VertexId | null;
  dualInspectionTarget: DualInspectionTarget | null;
  cellVisibility: CellVisibility;
  viewLayout: ViewLayout;
  hoverTarget: InspectionHoverTarget | null;
  undoStack: WorkspaceSnapshot[];
  redoStack: WorkspaceSnapshot[];
  operationHistory: OperationHistoryEntry[];
  redoOperationHistory: OperationHistoryEntry[];
  historySequence: number;
  loadSeed: (seedKey: SeedKey) => void;
  resetWorkspace: () => void;
  undoWorkspace: () => void;
  redoWorkspace: () => void;
  resetViewLayout: () => void;
  applyOperationToSelection: (operationId: string) => void;
  applyAmboDissectionToCurrent: () => void;
  selectShape: (shapeId: ShapeId) => void;
  selectCell: (cellId: CellId | null) => void;
  selectVertex: (vertexId: VertexId | null) => void;
  setDualInspectionTarget: (target: DualInspectionTarget | null) => void;
  clearDualInspectionTarget: () => void;
  toggleCellVisibility: (key: keyof CellVisibility) => void;
  setExplodeAmount: (explodeAmount: number) => void;
  toggleDualView: () => void;
  toggleIsolateSelectedCell: () => void;
  toggleFieldAtlasSamples: () => void;
  setHoverTarget: (target: InspectionHoverTarget | null) => void;
  updateSelectedVertexData: (patch: Partial<VertexDataPacket>) => void;
  exportWorkspace: () => PersistedWorkspaceV1;
  importWorkspace: (workspace: PersistedWorkspaceV1) => void;
}

const initialShape = createSeedShape('tetrahedron');
const initialHistoryEntry: OperationHistoryEntry = {
  id: 'history:0',
  label: `Seed: ${initialShape.name}`,
  operationId: 'seed',
  targetCellId: initialShape.cells[0]?.id ?? null,
  targetTopology: initialShape.cells[0]?.topology ?? initialShape.seedKey ?? null,
  generationDepth: initialShape.genealogy.generationDepth,
  producedCellCount: initialShape.cells.length,
  shapeId: initialShape.id,
  createdAt: initialShape.genealogy.createdAt,
};

export const useGeometryStore = create<GeometryState>((set, get) => ({
  selectedSeedKey: 'tetrahedron',
  shapes: {
    [initialShape.id]: initialShape,
  },
  shapeOrder: [initialShape.id],
  currentShapeId: initialShape.id,
  selectedCellId: null,
  selectedVertexId: null,
  dualInspectionTarget: null,
  cellVisibility: defaultCellVisibility,
  viewLayout: defaultViewLayout,
  hoverTarget: null,
  undoStack: [],
  redoStack: [],
  operationHistory: [initialHistoryEntry],
  redoOperationHistory: [],
  historySequence: 0,
  loadSeed: (seedKey) => {
    const state = get();
    const shape = createSeedShape(seedKey);
    const historySequence = state.historySequence + 1;
    const entry = createHistoryEntry({
      id: makeHistoryEntryId(historySequence),
      label: `Seed: ${shape.name}`,
      operationId: 'seed-selection',
      shape,
      targetCell: shape.cells[0] ?? null,
      producedCellCount: shape.cells.length,
    });

    set({
      ...pushHistory(state, entry),
      selectedSeedKey: seedKey,
      shapes: {
        [shape.id]: shape,
      },
      shapeOrder: [shape.id],
      currentShapeId: shape.id,
      selectedCellId: null,
      selectedVertexId: null,
      dualInspectionTarget: null,
      cellVisibility: defaultCellVisibility,
      viewLayout: defaultViewLayout,
      hoverTarget: null,
      historySequence,
    });
  },
  resetWorkspace: () => {
    const state = get();
    const shape = createSeedShape(state.selectedSeedKey);
    const historySequence = state.historySequence + 1;
    const entry = createHistoryEntry({
      id: makeHistoryEntryId(historySequence),
      label: `Reset Workspace: ${shape.name}`,
      operationId: 'reset-workspace',
      shape,
      targetCell: shape.cells[0] ?? null,
      producedCellCount: shape.cells.length,
    });

    set({
      ...pushHistory(state, entry),
      shapes: {
        [shape.id]: shape,
      },
      shapeOrder: [shape.id],
      currentShapeId: shape.id,
      selectedCellId: null,
      selectedVertexId: null,
      dualInspectionTarget: null,
      cellVisibility: defaultCellVisibility,
      viewLayout: defaultViewLayout,
      hoverTarget: null,
      historySequence,
    });
  },
  undoWorkspace: () => {
    const state = get();
    const previousSnapshot = state.undoStack[state.undoStack.length - 1];
    const undoneEntry = state.operationHistory[state.operationHistory.length - 1];

    if (!previousSnapshot || !undoneEntry) {
      return;
    }

    const nextRedoStack = [captureWorkspaceSnapshot(state), ...state.redoStack];
    const nextRedoHistory = [undoneEntry, ...state.redoOperationHistory];

    set({
      ...restoreWorkspaceSnapshot(previousSnapshot),
      undoStack: state.undoStack.slice(0, -1),
      redoStack: nextRedoStack,
      operationHistory: state.operationHistory.slice(0, -1),
      redoOperationHistory: nextRedoHistory,
      hoverTarget: null,
      dualInspectionTarget: null,
    });
  },
  redoWorkspace: () => {
    const state = get();
    const nextSnapshot = state.redoStack[0];
    const redoneEntry = state.redoOperationHistory[0];

    if (!nextSnapshot || !redoneEntry) {
      return;
    }

    const undoStack = appendCappedSnapshot(state.undoStack, captureWorkspaceSnapshot(state));
    const operationHistory = appendCappedHistory(state.operationHistory, redoneEntry);

    set({
      ...restoreWorkspaceSnapshot(nextSnapshot),
      undoStack,
      redoStack: state.redoStack.slice(1),
      operationHistory,
      redoOperationHistory: state.redoOperationHistory.slice(1),
      hoverTarget: null,
      dualInspectionTarget: null,
    });
  },
  resetViewLayout: () => {
    set({ viewLayout: defaultViewLayout, hoverTarget: null, dualInspectionTarget: null });
  },
  applyOperationToSelection: (operationId) => {
    const state = get();
    const { currentShapeId, selectedCellId, shapes, shapeOrder } = state;
    const operation = getOperation(operationId);
    const currentShape = shapes[currentShapeId];
    const selectedCell = selectedCellId
      ? currentShape?.cells.find((cell) => cell.id === selectedCellId) ?? null
      : null;

    if (
      !operation ||
      !currentShape ||
      (selectedCellId !== null && !selectedCell)
    ) {
      return;
    }

    const context = {
      shape: currentShape,
      selectedCellId,
      selectedCell,
    };
    const targetCell = selectedCell ?? currentShape.cells.find((cell) => cell.kind === 'seed') ?? null;

    if (!targetCell || !isCellActiveFrontier(currentShape, targetCell.id) || !operation.canApply(context)) {
      return;
    }

    const nextShape = operation.execute(context);
    const nextShapeOrder = shapeOrder.includes(nextShape.id)
      ? shapeOrder
      : [...shapeOrder, nextShape.id];
    const latestGeneration = nextShape.generations[nextShape.generations.length - 1];
    const historySequence = state.historySequence + 1;
    const entry = createHistoryEntry({
      id: makeHistoryEntryId(historySequence),
      label: operation.label,
      operationId: operation.id,
      shape: nextShape,
      targetCell,
      producedCellCount: latestGeneration?.createdCellIds.length ?? nextShape.cells.length,
      createdAt: latestGeneration?.createdAt,
    });

    set({
      ...pushHistory(state, entry),
      shapes: {
        ...shapes,
        [nextShape.id]: nextShape,
      },
      shapeOrder: nextShapeOrder,
      currentShapeId: nextShape.id,
      selectedCellId: null,
      selectedVertexId: null,
      dualInspectionTarget: null,
      hoverTarget: null,
      historySequence,
    });
  },
  applyAmboDissectionToCurrent: () => {
    get().applyOperationToSelection('ambo-dissection');
  },
  selectShape: (shapeId) => {
    const shape = get().shapes[shapeId];

    if (!shape) {
      return;
    }

    set((state) => ({
      currentShapeId: shapeId,
      selectedCellId:
        state.selectedCellId && shape.cells.some((cell) => cell.id === state.selectedCellId)
          ? state.selectedCellId
          : null,
      selectedVertexId:
        state.selectedVertexId && shape.vertices[state.selectedVertexId]
          ? state.selectedVertexId
          : null,
      dualInspectionTarget: null,
      hoverTarget: null,
    }));
  },
  selectCell: (cellId) => {
    set({ selectedCellId: cellId, selectedVertexId: null, dualInspectionTarget: null });
  },
  selectVertex: (vertexId) => {
    set({ selectedVertexId: vertexId, dualInspectionTarget: null });
  },
  setDualInspectionTarget: (target) => {
    set({ dualInspectionTarget: target, selectedVertexId: null, hoverTarget: null });
  },
  clearDualInspectionTarget: () => {
    set({ dualInspectionTarget: null });
  },
  toggleCellVisibility: (key) => {
    set((state) => ({
      cellVisibility: {
        ...state.cellVisibility,
        [key]: !state.cellVisibility[key],
      },
    }));
  },
  setExplodeAmount: (explodeAmount) => {
    set((state) => ({
      viewLayout: {
        ...state.viewLayout,
        explodeAmount: Math.min(1, Math.max(0, explodeAmount)),
      },
    }));
  },
  toggleDualView: () => {
    set((state) => ({
      viewLayout: {
        ...state.viewLayout,
        dualViewEnabled: !state.viewLayout.dualViewEnabled,
      },
      hoverTarget: null,
      dualInspectionTarget: state.viewLayout.dualViewEnabled ? null : state.dualInspectionTarget,
    }));
  },
  toggleIsolateSelectedCell: () => {
    set((state) => ({
      viewLayout: {
        ...state.viewLayout,
        isolateSelectedCell: !state.viewLayout.isolateSelectedCell,
      },
    }));
  },
  toggleFieldAtlasSamples: () => {
    set((state) => ({
      viewLayout: {
        ...state.viewLayout,
        showFieldAtlasSamples: !state.viewLayout.showFieldAtlasSamples,
      },
    }));
  },
  setHoverTarget: (target) => {
    set({ hoverTarget: target });
  },
  updateSelectedVertexData: (patch) => {
    const { currentShapeId, selectedVertexId, shapes } = get();

    if (!selectedVertexId) {
      return;
    }

    const shape = shapes[currentShapeId];
    const vertex = shape?.vertices[selectedVertexId];

    if (!shape || !vertex) {
      return;
    }

    set({
      shapes: {
        ...shapes,
        [shape.id]: {
          ...shape,
          vertices: {
            ...shape.vertices,
            [selectedVertexId]: {
              ...vertex,
              data: {
                ...vertex.data,
                ...patch,
              },
            },
          },
        },
      },
    });
  },
  exportWorkspace: () => {
    const state = get();

    return serializeWorkspaceSnapshot({
      selectedSeedKey: state.selectedSeedKey,
      shapes: state.shapes,
      shapeOrder: state.shapeOrder,
      currentShapeId: state.currentShapeId,
      selectedCellId: state.selectedCellId,
      selectedVertexId: state.selectedVertexId,
      operationHistory: state.operationHistory,
      historySequence: state.historySequence,
      cellVisibility: state.cellVisibility,
      viewLayout: state.viewLayout,
    });
  },
  importWorkspace: (workspace) => {
    const validation = validateWorkspaceImport(workspace);

    if (!validation.ok) {
      throw new Error(validation.errors.join('\n'));
    }

    const importedWorkspace = validation.workspace;
    const currentShape = importedWorkspace.shapes[importedWorkspace.currentShapeId];
    const selectedCellId =
      importedWorkspace.selectedCellId &&
      currentShape.cells.some((cell) => cell.id === importedWorkspace.selectedCellId)
        ? importedWorkspace.selectedCellId
        : null;
    const selectedVertexId =
      importedWorkspace.selectedVertexId &&
      currentShape.vertices[importedWorkspace.selectedVertexId]
        ? importedWorkspace.selectedVertexId
        : null;

    set({
      selectedSeedKey: importedWorkspace.selectedSeedKey,
      shapes: importedWorkspace.shapes,
      shapeOrder: importedWorkspace.shapeOrder,
      currentShapeId: importedWorkspace.currentShapeId,
      selectedCellId,
      selectedVertexId,
      dualInspectionTarget: null,
      cellVisibility: importedWorkspace.cellVisibility
        ? { ...importedWorkspace.cellVisibility }
        : defaultCellVisibility,
      viewLayout: importedWorkspace.viewLayout
        ? normalizeViewLayout(importedWorkspace.viewLayout)
        : defaultViewLayout,
      hoverTarget: null,
      undoStack: [],
      redoStack: [],
      operationHistory: importedWorkspace.operationHistory,
      redoOperationHistory: [],
      historySequence: importedWorkspace.historySequence,
    });
  },
}));

function captureWorkspaceSnapshot(state: GeometryState): WorkspaceSnapshot {
  return {
    selectedSeedKey: state.selectedSeedKey,
    shapes: state.shapes,
    shapeOrder: state.shapeOrder,
    currentShapeId: state.currentShapeId,
    selectedCellId: state.selectedCellId,
    selectedVertexId: state.selectedVertexId,
  };
}

function normalizeViewLayout(viewLayout: PersistedViewLayout): ViewLayout {
  return {
    explodeAmount: viewLayout.explodeAmount,
    dualViewEnabled: viewLayout.dualViewEnabled,
    isolateSelectedCell: viewLayout.isolateSelectedCell,
    showFieldAtlasSamples:
      viewLayout.showFieldAtlasSamples ?? defaultViewLayout.showFieldAtlasSamples,
  };
}

function restoreWorkspaceSnapshot(snapshot: WorkspaceSnapshot): WorkspaceSnapshot {
  const shape = snapshot.shapes[snapshot.currentShapeId];
  const selectedCellId =
    shape && snapshot.selectedCellId && shape.cells.some((cell) => cell.id === snapshot.selectedCellId)
      ? snapshot.selectedCellId
      : null;
  const selectedVertexId =
    shape && snapshot.selectedVertexId && shape.vertices[snapshot.selectedVertexId]
      ? snapshot.selectedVertexId
      : null;

  return {
    ...snapshot,
    selectedCellId,
    selectedVertexId,
  };
}

function pushHistory(
  state: GeometryState,
  entry: OperationHistoryEntry,
): Pick<
  GeometryState,
  'undoStack' | 'redoStack' | 'operationHistory' | 'redoOperationHistory'
> {
  return {
    undoStack: appendCappedSnapshot(state.undoStack, captureWorkspaceSnapshot(state)),
    redoStack: [],
    operationHistory: appendCappedHistory(state.operationHistory, entry),
    redoOperationHistory: [],
  };
}

function appendCappedSnapshot(
  snapshots: WorkspaceSnapshot[],
  snapshot: WorkspaceSnapshot,
): WorkspaceSnapshot[] {
  return [...snapshots, snapshot].slice(-HISTORY_LIMIT);
}

function appendCappedHistory(
  history: OperationHistoryEntry[],
  entry: OperationHistoryEntry,
): OperationHistoryEntry[] {
  return [...history, entry].slice(-HISTORY_LIMIT);
}

function makeHistoryEntryId(sequence: number): string {
  return `history:${sequence}`;
}

function createHistoryEntry({
  id,
  label,
  operationId,
  shape,
  targetCell,
  producedCellCount,
  createdAt,
}: {
  id: string;
  label: string;
  operationId: string;
  shape: Shape;
  targetCell: Cell | null;
  producedCellCount: number;
  createdAt?: string;
}): OperationHistoryEntry {
  return {
    id,
    label,
    operationId,
    targetCellId: targetCell?.id ?? null,
    targetTopology: targetCell?.topology ?? null,
    generationDepth: shape.genealogy.generationDepth,
    producedCellCount,
    shapeId: shape.id,
    createdAt: createdAt ?? shape.genealogy.createdAt,
  };
}

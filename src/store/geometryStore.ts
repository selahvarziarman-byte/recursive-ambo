import { create } from 'zustand';
import { createSeedShape } from '../data/seeds';
import { isCellActiveFrontier } from '../lib/cellLifecycle';
import { liftSubComplex, type LiftSelection } from '../lib/subComplexLift';
import { thicken } from '../lib/thicken';
import { serializeSnapshot } from '../playground/snapshot';
import { useLiftStore } from './liftStore';
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

export interface FieldAtlasLayerVisibility {
  sources: boolean;
  samples: boolean;
  charts: boolean;
  features: boolean;
  routeGateCandidates: boolean;
  supportRegionCandidates: boolean;
}

export type FieldAtlasSampleRenderMode =
  | 'family'
  | 'intensity'
  | 'phase'
  | 'dominance';

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

const defaultFieldAtlasLayerVisibility: FieldAtlasLayerVisibility = {
  sources: true,
  samples: true,
  charts: true,
  features: true,
  routeGateCandidates: true,
  supportRegionCandidates: true,
};

const defaultFieldAtlasSampleRenderMode: FieldAtlasSampleRenderMode = 'family';

const HISTORY_LIMIT = 50;

interface GeometryState {
  selectedSeedKey: SeedKey;
  shapes: Record<ShapeId, Shape>;
  shapeOrder: ShapeId[];
  currentShapeId: ShapeId;
  selectedCellId: CellId | null;
  selectedVertexId: VertexId | null;
  // multi-region lift (P1b follow-on): the SET of entities picked for lifting
  // (shift-click; all four kinds). Distinct from the single inspection
  // selection above, which stays unchanged.
  liftSelection: LiftSelection[];
  dualInspectionTarget: DualInspectionTarget | null;
  cellVisibility: CellVisibility;
  viewLayout: ViewLayout;
  fieldAtlasLayerVisibility: FieldAtlasLayerVisibility;
  fieldAtlasSampleRenderMode: FieldAtlasSampleRenderMode;
  hoverTarget: InspectionHoverTarget | null;
  hoveredFieldAtlasSampleId: string | null;
  pinnedFieldAtlasProbeRef: string | null;
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
  liftSelectionToManuscript: () => string;
  thickenLiftToManuscript: () => string;
  toggleLiftSelection: (selection: LiftSelection) => void;
  clearLiftSelection: () => void;
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
  setFieldAtlasLayerVisibility: (
    patch: Partial<FieldAtlasLayerVisibility>,
  ) => void;
  toggleFieldAtlasLayerVisibility: (
    key: keyof FieldAtlasLayerVisibility,
  ) => void;
  resetFieldAtlasLayerVisibility: () => void;
  setFieldAtlasSampleRenderMode: (
    mode: FieldAtlasSampleRenderMode,
  ) => void;
  resetFieldAtlasSampleRenderMode: () => void;
  setHoverTarget: (target: InspectionHoverTarget | null) => void;
  setHoveredFieldAtlasSampleId: (sampleId: string | null) => void;
  setPinnedFieldAtlasProbeRef: (probeRef: string | null) => void;
  clearPinnedFieldAtlasProbeRef: () => void;
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
  liftSelection: [],
  dualInspectionTarget: null,
  cellVisibility: defaultCellVisibility,
  viewLayout: defaultViewLayout,
  fieldAtlasLayerVisibility: defaultFieldAtlasLayerVisibility,
  fieldAtlasSampleRenderMode: defaultFieldAtlasSampleRenderMode,
  hoverTarget: null,
  hoveredFieldAtlasSampleId: null,
  pinnedFieldAtlasProbeRef: null,
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
      liftSelection: [],
      dualInspectionTarget: null,
      cellVisibility: defaultCellVisibility,
      viewLayout: defaultViewLayout,
      fieldAtlasLayerVisibility: defaultFieldAtlasLayerVisibility,
      fieldAtlasSampleRenderMode: defaultFieldAtlasSampleRenderMode,
      hoverTarget: null,
      hoveredFieldAtlasSampleId: null,
      pinnedFieldAtlasProbeRef: null,
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
      liftSelection: [],
      dualInspectionTarget: null,
      cellVisibility: defaultCellVisibility,
      viewLayout: defaultViewLayout,
      fieldAtlasLayerVisibility: defaultFieldAtlasLayerVisibility,
      fieldAtlasSampleRenderMode: defaultFieldAtlasSampleRenderMode,
      hoverTarget: null,
      hoveredFieldAtlasSampleId: null,
      pinnedFieldAtlasProbeRef: null,
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
      liftSelection: [],
      undoStack: state.undoStack.slice(0, -1),
      redoStack: nextRedoStack,
      operationHistory: state.operationHistory.slice(0, -1),
      redoOperationHistory: nextRedoHistory,
      hoverTarget: null,
      hoveredFieldAtlasSampleId: null,
      pinnedFieldAtlasProbeRef: null,
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
      liftSelection: [],
      undoStack,
      redoStack: state.redoStack.slice(1),
      operationHistory,
      redoOperationHistory: state.redoOperationHistory.slice(1),
      hoverTarget: null,
      hoveredFieldAtlasSampleId: null,
      pinnedFieldAtlasProbeRef: null,
      dualInspectionTarget: null,
    });
  },
  resetViewLayout: () => {
    set({
      viewLayout: defaultViewLayout,
      fieldAtlasLayerVisibility: defaultFieldAtlasLayerVisibility,
      fieldAtlasSampleRenderMode: defaultFieldAtlasSampleRenderMode,
      hoverTarget: null,
      hoveredFieldAtlasSampleId: null,
      pinnedFieldAtlasProbeRef: null,
      dualInspectionTarget: null,
    });
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
      liftSelection: [],
      dualInspectionTarget: null,
      hoverTarget: null,
      hoveredFieldAtlasSampleId: null,
      pinnedFieldAtlasProbeRef: null,
      historySequence,
    });
  },
  // P1b — the granular ambo→manuscript save: lift the selection's downward
  // closure as a self-contained sub-Shape, serialize it through the COMMITTED
  // snapshot path (sourceId = this shape's id — the provenance tag), and push
  // it onto the shared lift channel for the Manuscript shelf to drain. The
  // ambo original is NEVER mutated (the extraction is a fresh restriction;
  // nothing here writes back). Throws honest reasons (no selection / the
  // precondition) — the UI gates and shows them.
  //
  // Multi-region (the P1b follow-on): a non-empty `liftSelection` SET lifts as
  // ONE sub-complex; an empty set falls back to the single inspection-selected
  // cell/vertex (the original P1b behavior, unchanged). A successful set lift
  // clears the set.
  liftSelectionToManuscript: () => {
    const { currentShapeId, shapes, selectedCellId, selectedVertexId, liftSelection } = get();
    const shape = shapes[currentShapeId];
    if (!shape) {
      throw new Error('geometryStore: no current shape to lift from');
    }
    const selections: LiftSelection[] =
      liftSelection.length > 0
        ? liftSelection
        : selectedCellId
          ? [{ kind: 'cell', id: selectedCellId }]
          : selectedVertexId
            ? [{ kind: 'vertex', id: selectedVertexId }]
            : [];
    if (selections.length === 0) {
      throw new Error(
        'geometryStore: select a cell or a vertex to lift (or shift-click a region into the lift set)',
      );
    }
    const lifted = liftSubComplex(shape, selections);
    const file = serializeSnapshot(lifted.shape, shape.id);
    useLiftStore.getState().push({ title: lifted.title, file });
    if (liftSelection.length > 0) {
      set({ liftSelection: [] });
    }
    return lifted.title;
  },
  // THICKEN (A.1 rung 1, 2026-07-18, sealed 039feb1b…82cae): the person's own
  // lifted circle becomes a band that REMEMBERS. The selection is lifted
  // exactly as liftSelectionToManuscript lifts it, then the committed ×I
  // product runs on the lifted sub-shape, and BOTH forms ride the shelf
  // channel: the circle (the parent, alive — `product` is NON-CONSUMING) and
  // the band (born of it, arity-1, its genealogy naming THEIR circle). No new
  // form — the band is the annulus they could already glue from a square; a
  // new PARENT is the whole payoff.
  thickenLiftToManuscript: () => {
    const { currentShapeId, shapes, selectedCellId, selectedVertexId, liftSelection } = get();
    const shape = shapes[currentShapeId];
    if (!shape) {
      throw new Error('geometryStore: no current shape to lift from');
    }
    const selections: LiftSelection[] =
      liftSelection.length > 0
        ? liftSelection
        : selectedCellId
          ? [{ kind: 'cell', id: selectedCellId }]
          : selectedVertexId
            ? [{ kind: 'vertex', id: selectedVertexId }]
            : [];
    if (selections.length === 0) {
      throw new Error(
        'geometryStore: select a cell or a vertex to lift (or shift-click a region into the lift set)',
      );
    }
    const lifted = liftSubComplex(shape, selections);
    const band = thicken(lifted.shape);
    useLiftStore.getState().push({ title: lifted.title, file: serializeSnapshot(lifted.shape, shape.id) });
    useLiftStore.getState().push({ title: band.shape.name, file: serializeSnapshot(band.shape, shape.id) });
    if (liftSelection.length > 0) {
      set({ liftSelection: [] });
    }
    return band.shape.name;
  },
  // toggle one entity in/out of the multi-region lift set (identity = kind+id)
  toggleLiftSelection: (selection) => {
    set((state) => {
      const present = state.liftSelection.some(
        (s) => s.kind === selection.kind && s.id === selection.id,
      );
      return {
        liftSelection: present
          ? state.liftSelection.filter(
              (s) => !(s.kind === selection.kind && s.id === selection.id),
            )
          : [...state.liftSelection, selection],
      };
    });
  },
  clearLiftSelection: () => {
    set({ liftSelection: [] });
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
      liftSelection: [],
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
      hoveredFieldAtlasSampleId: null,
      pinnedFieldAtlasProbeRef: null,
    }));
  },
  selectCell: (cellId) => {
    set({
      selectedCellId: cellId,
      selectedVertexId: null,
      dualInspectionTarget: null,
      hoveredFieldAtlasSampleId: null,
    });
  },
  selectVertex: (vertexId) => {
    set({ selectedVertexId: vertexId, dualInspectionTarget: null, hoveredFieldAtlasSampleId: null });
  },
  setDualInspectionTarget: (target) => {
    set({
      dualInspectionTarget: target,
      selectedVertexId: null,
      hoverTarget: null,
      hoveredFieldAtlasSampleId: null,
    });
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
  setFieldAtlasLayerVisibility: (patch) => {
    set((state) => ({
      fieldAtlasLayerVisibility: {
        ...state.fieldAtlasLayerVisibility,
        ...patch,
      },
    }));
  },
  toggleFieldAtlasLayerVisibility: (key) => {
    set((state) => ({
      fieldAtlasLayerVisibility: {
        ...state.fieldAtlasLayerVisibility,
        [key]: !state.fieldAtlasLayerVisibility[key],
      },
    }));
  },
  resetFieldAtlasLayerVisibility: () => {
    set({ fieldAtlasLayerVisibility: defaultFieldAtlasLayerVisibility });
  },
  setFieldAtlasSampleRenderMode: (mode) => {
    set({ fieldAtlasSampleRenderMode: mode });
  },
  resetFieldAtlasSampleRenderMode: () => {
    set({ fieldAtlasSampleRenderMode: defaultFieldAtlasSampleRenderMode });
  },
  setHoverTarget: (target) => {
    set({ hoverTarget: target });
  },
  setHoveredFieldAtlasSampleId: (sampleId) => {
    set({ hoveredFieldAtlasSampleId: sampleId });
  },
  setPinnedFieldAtlasProbeRef: (probeRef) => {
    set({ pinnedFieldAtlasProbeRef: probeRef });
  },
  clearPinnedFieldAtlasProbeRef: () => {
    set({ pinnedFieldAtlasProbeRef: null });
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
      liftSelection: [],
      selectedCellId,
      selectedVertexId,
      dualInspectionTarget: null,
      cellVisibility: importedWorkspace.cellVisibility
        ? { ...importedWorkspace.cellVisibility }
        : defaultCellVisibility,
      viewLayout: importedWorkspace.viewLayout
        ? normalizeViewLayout(importedWorkspace.viewLayout)
        : defaultViewLayout,
      fieldAtlasLayerVisibility: defaultFieldAtlasLayerVisibility,
      fieldAtlasSampleRenderMode: defaultFieldAtlasSampleRenderMode,
      hoverTarget: null,
      hoveredFieldAtlasSampleId: null,
      pinnedFieldAtlasProbeRef: null,
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

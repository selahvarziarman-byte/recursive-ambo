import { create } from 'zustand';
import { createSeedShape } from '../data/seeds';
import { getOperation } from '../operations/registry';
import type { CellId, SeedKey, Shape, ShapeId, VertexDataPacket, VertexId } from '../types/geometry';

interface CellVisibility {
  showCoreCells: boolean;
  showResidueCells: boolean;
  showParentCells: boolean;
}

interface ViewLayout {
  explodeAmount: number;
}

const defaultCellVisibility: CellVisibility = {
  showCoreCells: true,
  showResidueCells: true,
  showParentCells: false,
};

const defaultViewLayout: ViewLayout = {
  explodeAmount: 0,
};

interface GeometryState {
  selectedSeedKey: SeedKey;
  shapes: Record<ShapeId, Shape>;
  shapeOrder: ShapeId[];
  currentShapeId: ShapeId;
  selectedCellId: CellId | null;
  selectedVertexId: VertexId | null;
  cellVisibility: CellVisibility;
  viewLayout: ViewLayout;
  loadSeed: (seedKey: SeedKey) => void;
  resetWorkspace: () => void;
  resetViewLayout: () => void;
  applyOperationToSelection: (operationId: string) => void;
  applyAmboDissectionToCurrent: () => void;
  selectShape: (shapeId: ShapeId) => void;
  selectCell: (cellId: CellId | null) => void;
  selectVertex: (vertexId: VertexId | null) => void;
  toggleCellVisibility: (key: keyof CellVisibility) => void;
  setExplodeAmount: (explodeAmount: number) => void;
  updateSelectedVertexData: (patch: Partial<VertexDataPacket>) => void;
}

const initialShape = createSeedShape('tetrahedron');

export const useGeometryStore = create<GeometryState>((set, get) => ({
  selectedSeedKey: 'tetrahedron',
  shapes: {
    [initialShape.id]: initialShape,
  },
  shapeOrder: [initialShape.id],
  currentShapeId: initialShape.id,
  selectedCellId: null,
  selectedVertexId: null,
  cellVisibility: defaultCellVisibility,
  viewLayout: defaultViewLayout,
  loadSeed: (seedKey) => {
    const shape = createSeedShape(seedKey);

    set({
      selectedSeedKey: seedKey,
      shapes: {
        [shape.id]: shape,
      },
      shapeOrder: [shape.id],
      currentShapeId: shape.id,
      selectedCellId: null,
      selectedVertexId: null,
      cellVisibility: defaultCellVisibility,
      viewLayout: defaultViewLayout,
    });
  },
  resetWorkspace: () => {
    const shape = createSeedShape(get().selectedSeedKey);

    set({
      shapes: {
        [shape.id]: shape,
      },
      shapeOrder: [shape.id],
      currentShapeId: shape.id,
      selectedCellId: null,
      selectedVertexId: null,
      cellVisibility: defaultCellVisibility,
      viewLayout: defaultViewLayout,
    });
  },
  resetViewLayout: () => {
    set({ viewLayout: defaultViewLayout });
  },
  applyOperationToSelection: (operationId) => {
    const { currentShapeId, selectedCellId, shapes, shapeOrder } = get();
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

    if (!operation.canApply(context)) {
      return;
    }

    const nextShape = operation.execute(context);
    const nextShapeOrder = shapeOrder.includes(nextShape.id)
      ? shapeOrder
      : [...shapeOrder, nextShape.id];

    set({
      shapes: {
        ...shapes,
        [nextShape.id]: nextShape,
      },
      shapeOrder: nextShapeOrder,
      currentShapeId: nextShape.id,
      selectedCellId: null,
      selectedVertexId: null,
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
    }));
  },
  selectCell: (cellId) => {
    set({ selectedCellId: cellId, selectedVertexId: null });
  },
  selectVertex: (vertexId) => {
    set({ selectedVertexId: vertexId });
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
    set({
      viewLayout: {
        explodeAmount: Math.min(1, Math.max(0, explodeAmount)),
      },
    });
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
}));

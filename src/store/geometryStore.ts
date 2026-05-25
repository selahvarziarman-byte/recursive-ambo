import { create } from 'zustand';
import { createSeedShape } from '../data/seeds';
import { applyAmboDissection, canApplyAmboDissection } from '../lib/ambo';
import type { CellId, SeedKey, Shape, ShapeId, VertexDataPacket, VertexId } from '../types/geometry';

interface CellVisibility {
  showCoreCells: boolean;
  showResidueCells: boolean;
  showParentCells: boolean;
}

const defaultCellVisibility: CellVisibility = {
  showCoreCells: true,
  showResidueCells: true,
  showParentCells: false,
};

interface GeometryState {
  selectedSeedKey: SeedKey;
  shapes: Record<ShapeId, Shape>;
  shapeOrder: ShapeId[];
  currentShapeId: ShapeId;
  selectedCellId: CellId | null;
  selectedVertexId: VertexId | null;
  cellVisibility: CellVisibility;
  loadSeed: (seedKey: SeedKey) => void;
  resetWorkspace: () => void;
  applyAmboDissectionToCurrent: () => void;
  selectShape: (shapeId: ShapeId) => void;
  selectCell: (cellId: CellId | null) => void;
  selectVertex: (vertexId: VertexId | null) => void;
  toggleCellVisibility: (key: keyof CellVisibility) => void;
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
    });
  },
  applyAmboDissectionToCurrent: () => {
    const { currentShapeId, selectedCellId, shapes, shapeOrder } = get();
    const currentShape = shapes[currentShapeId];
    const selectedCell = selectedCellId
      ? currentShape?.cells.find((cell) => cell.id === selectedCellId) ?? null
      : null;

    if (
      !currentShape ||
      (selectedCellId !== null && !selectedCell) ||
      (selectedCell !== null && selectedCell.kind !== 'seed' && selectedCell.kind !== 'residue')
    ) {
      return;
    }

    if (!canApplyAmboDissection(currentShape, selectedCellId)) {
      return;
    }

    const nextShape = applyAmboDissection(currentShape, selectedCellId);
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

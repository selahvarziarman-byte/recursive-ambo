import { create } from 'zustand';
import { createSeedShape } from '../data/seeds';
import { applyAmboDissection, canApplyAmboDissection } from '../lib/ambo';
import type { SeedKey, Shape, ShapeId, VertexDataPacket, VertexId } from '../types/geometry';

interface CellVisibility {
  showCoreCells: boolean;
  showResidueCells: boolean;
  showParentCells: boolean;
}

interface GeometryState {
  selectedSeedKey: SeedKey;
  shapes: Record<ShapeId, Shape>;
  shapeOrder: ShapeId[];
  currentShapeId: ShapeId;
  selectedVertexId: VertexId | null;
  cellVisibility: CellVisibility;
  loadSeed: (seedKey: SeedKey) => void;
  applyAmboDissectionToCurrent: () => void;
  selectShape: (shapeId: ShapeId) => void;
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
  selectedVertexId: null,
  cellVisibility: {
    showCoreCells: true,
    showResidueCells: true,
    showParentCells: false,
  },
  loadSeed: (seedKey) => {
    const shape = createSeedShape(seedKey);

    set({
      selectedSeedKey: seedKey,
      shapes: {
        [shape.id]: shape,
      },
      shapeOrder: [shape.id],
      currentShapeId: shape.id,
      selectedVertexId: null,
    });
  },
  applyAmboDissectionToCurrent: () => {
    const { currentShapeId, shapes, shapeOrder } = get();
    const currentShape = shapes[currentShapeId];

    if (!currentShape || !canApplyAmboDissection(currentShape)) {
      return;
    }

    const nextShape = applyAmboDissection(currentShape);
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
      selectedVertexId:
        state.selectedVertexId && shape.vertices[state.selectedVertexId]
          ? state.selectedVertexId
          : null,
    }));
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

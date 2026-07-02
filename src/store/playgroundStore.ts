import { create } from 'zustand';
import { loadForm, type FormBuilder } from '../lib/multiform';
import type { CellId, Shape, ShapeId, VertexId } from '../types/geometry';

export interface PlaygroundProvenance {
  source: string | null;
  origin: 'invoked' | 'loaded';
}

export interface PlaygroundForm {
  shape: Shape;
  provenance: PlaygroundProvenance;
}

interface PlaygroundSnapshot {
  forms: Record<ShapeId, PlaygroundForm>;
  formOrder: ShapeId[];
  currentFormId: ShapeId | null;
  selectedCellId: CellId | null;
  selectedVertexId: VertexId | null;
}

interface PlaygroundState extends PlaygroundSnapshot {
  invokeForm: (builder: FormBuilder, source?: string | null) => Shape;
  addForm: (shape: Shape, provenance: PlaygroundProvenance) => void;
  selectForm: (shapeId: ShapeId | null) => void;
  selectCell: (cellId: CellId | null) => void;
  selectVertex: (vertexId: VertexId | null) => void;
  removeForm: (shapeId: ShapeId) => void;
  resetPlayground: () => void;
}

export const buildPlaygroundSquareForm: FormBuilder = () => ({
  name: 'square',
  vertices: [
    { id: 'A', position: [-0.7, -0.7, 0], label: 'A' },
    { id: 'B', position: [0.7, -0.7, 0], label: 'B' },
    { id: 'C', position: [0.7, 0.7, 0], label: 'C' },
    { id: 'D', position: [-0.7, 0.7, 0], label: 'D' },
  ],
  faces: [{ vertexIds: ['A', 'B', 'C', 'D'] }],
});

function createInitialPlaygroundSnapshot(): PlaygroundSnapshot {
  const plain = loadForm(buildPlaygroundSquareForm);
  const demo = loadForm(buildPlaygroundSquareForm, 'demo');

  return {
    forms: {
      [plain.id]: {
        shape: plain,
        provenance: { source: null, origin: 'invoked' },
      },
      [demo.id]: {
        shape: demo,
        provenance: { source: 'demo', origin: 'invoked' },
      },
    },
    formOrder: [plain.id, demo.id],
    currentFormId: plain.id,
    selectedCellId: null,
    selectedVertexId: null,
  };
}

export const usePlaygroundStore = create<PlaygroundState>((set, get) => ({
  ...createInitialPlaygroundSnapshot(),
  invokeForm: (builder, source = null) => {
    const normalizedSource = source?.trim() ?? '';
    const shape = loadForm(builder, normalizedSource);

    get().addForm(shape, {
      source: normalizedSource || null,
      origin: 'invoked',
    });

    return shape;
  },
  addForm: (shape, provenance) => {
    set((state) => {
      const exists = Boolean(state.forms[shape.id]);
      const formOrder = exists ? state.formOrder : [...state.formOrder, shape.id];

      return {
        forms: {
          ...state.forms,
          [shape.id]: {
            shape,
            provenance: {
              source: provenance.source?.trim() || null,
              origin: provenance.origin,
            },
          },
        },
        formOrder,
        currentFormId: state.currentFormId ?? shape.id,
        selectedCellId: exists ? state.selectedCellId : null,
        selectedVertexId: exists ? state.selectedVertexId : null,
      };
    });
  },
  selectForm: (shapeId) => {
    set((state) => {
      if (shapeId === null) {
        return {
          currentFormId: null,
          selectedCellId: null,
          selectedVertexId: null,
        };
      }

      const form = state.forms[shapeId];

      if (!form) {
        return {};
      }

      return {
        currentFormId: shapeId,
        selectedCellId:
          state.selectedCellId &&
          form.shape.cells.some((cell) => cell.id === state.selectedCellId)
            ? state.selectedCellId
            : null,
        selectedVertexId:
          state.selectedVertexId && form.shape.vertices[state.selectedVertexId]
            ? state.selectedVertexId
            : null,
      };
    });
  },
  selectCell: (cellId) => {
    set((state) => {
      const form = state.currentFormId ? state.forms[state.currentFormId] : null;
      const selectedCellId =
        cellId && form?.shape.cells.some((cell) => cell.id === cellId) ? cellId : null;

      return {
        selectedCellId,
        selectedVertexId: selectedCellId ? null : state.selectedVertexId,
      };
    });
  },
  selectVertex: (vertexId) => {
    set((state) => {
      const form = state.currentFormId ? state.forms[state.currentFormId] : null;

      return {
        selectedVertexId: vertexId && form?.shape.vertices[vertexId] ? vertexId : null,
        selectedCellId: null,
      };
    });
  },
  removeForm: (shapeId) => {
    set((state) => {
      if (!state.forms[shapeId]) {
        return {};
      }

      const { [shapeId]: _removed, ...forms } = state.forms;
      const formOrder = state.formOrder.filter((id) => id !== shapeId);
      const currentFormId =
        state.currentFormId === shapeId ? formOrder[0] ?? null : state.currentFormId;

      return {
        forms,
        formOrder,
        currentFormId,
        selectedCellId: state.currentFormId === shapeId ? null : state.selectedCellId,
        selectedVertexId: state.currentFormId === shapeId ? null : state.selectedVertexId,
      };
    });
  },
  resetPlayground: () => {
    set(createInitialPlaygroundSnapshot());
  },
}));

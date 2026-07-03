import { create } from 'zustand';
import { loadForm, type FormBuilder } from '../lib/multiform';
import { getPlaygroundOperation } from '../playground/playgroundOperations';
import type { CellId, FaceId, Shape, ShapeId, VertexId } from '../types/geometry';

export interface PlaygroundProvenance {
  source: string | null;
  origin: 'invoked' | 'loaded' | 'operated';
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
  selectedFaceId: FaceId | null;
}

interface PlaygroundState extends PlaygroundSnapshot {
  invokeForm: (builder: FormBuilder, source?: string | null) => Shape;
  addForm: (shape: Shape, provenance: PlaygroundProvenance) => void;
  selectForm: (shapeId: ShapeId | null) => void;
  selectCell: (cellId: CellId | null) => void;
  selectVertex: (vertexId: VertexId | null) => void;
  selectFace: (faceId: FaceId | null) => void;
  applyOperationToSelection: (operationId: string) => Shape;
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
    selectedFaceId: null,
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
          selectedFaceId: null,
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
        selectedFaceId:
          state.selectedFaceId &&
          form.shape.faces.some((face) => face.id === state.selectedFaceId)
            ? state.selectedFaceId
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
  selectFace: (faceId) => {
    set((state) => {
      const form = state.currentFormId ? state.forms[state.currentFormId] : null;

      return {
        selectedFaceId:
          faceId && form?.shape.faces.some((face) => face.id === faceId) ? faceId : null,
      };
    });
  },
  // G5.1 — apply a registry operation to the current form + selected face: the
  // committed op runs, G5.0 materializes the certificate, and the BORN child
  // joins the store carrying its single-parent genealogy (parentShapeId = the
  // source form), so `buildGenealogyDag` over the store's forms records the
  // birth. The source form is never mutated (derive-only; the child is new).
  applyOperationToSelection: (operationId) => {
    const state = get();
    const form = state.currentFormId ? state.forms[state.currentFormId] : null;
    if (!form) {
      throw new Error('playgroundStore: no form selected — nothing to operate on');
    }
    const selectedFace =
      (state.selectedFaceId &&
        form.shape.faces.find((face) => face.id === state.selectedFaceId)) ||
      null;
    const operation = getPlaygroundOperation(operationId);
    const context = {
      form: form.shape,
      selectedFaceId: state.selectedFaceId,
      selectedFace,
    };
    if (!operation.canApply(context)) {
      throw new Error(
        `playgroundStore: operation "${operationId}" is not applicable — ${operation.getDisabledReason(context) ?? 'ineligible selection'}`,
      );
    }
    const born = operation.execute(context);

    get().addForm(born, { source: operation.id, origin: 'operated' });

    return born;
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
        selectedFaceId: state.currentFormId === shapeId ? null : state.selectedFaceId,
      };
    });
  },
  resetPlayground: () => {
    set(createInitialPlaygroundSnapshot());
  },
}));

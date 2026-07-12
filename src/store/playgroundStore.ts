import { create } from 'zustand';
import { loadForm, type FormBuilder } from '../lib/multiform';
import {
  ASSEMBLE_OPERATION_ID,
  canAssemblePair,
  executeAssemblePair,
  getAssemblePairDisabledReason,
  getPlaygroundOperation,
  resolveLineage,
} from '../playground/playgroundOperations';
import {
  executeAssembleWithEdges,
  executeCustomGlue,
  validateAssembleEdges,
  validateCustomPairings,
  type AssembleEdgeChoice,
} from '../playground/customGluing';
import {
  deserializeSnapshot,
  serializeSnapshot,
  type PlaygroundSnapshotFile,
} from '../playground/snapshot';
import type { BoundaryPairing } from '../lib/surfaceOperations';
import type { CellId, FaceId, Shape, ShapeId, VertexId } from '../types/geometry';

export interface PlaygroundProvenance {
  source: string | null;
  origin: 'invoked' | 'loaded' | 'operated' | 'born';
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
  snapshots: PlaygroundSnapshotFile[]; // E1 — the in-app snapshot list (session-scoped)
}

interface PlaygroundState extends PlaygroundSnapshot {
  invokeForm: (builder: FormBuilder, source?: string | null) => Shape;
  addForm: (shape: Shape, provenance: PlaygroundProvenance) => void;
  selectForm: (shapeId: ShapeId | null) => void;
  selectCell: (cellId: CellId | null) => void;
  selectVertex: (vertexId: VertexId | null) => void;
  selectFace: (faceId: FaceId | null) => void;
  applyOperationToSelection: (operationId: string) => Shape;
  applyCustomGlueToSelection: (pairings: BoundaryPairing[]) => Shape;
  applyAssembleToSelection: (secondFormId: ShapeId, edgeChoice?: AssembleEdgeChoice) => Shape;
  saveFormAsSnapshot: (formId: ShapeId) => PlaygroundSnapshotFile;
  loadSnapshot: (file: PlaygroundSnapshotFile, loadSource?: string) => Shape;
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
    snapshots: [],
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
    // REGISTRY UNBOUNDING (mothership-required, 2026-07-11): walk the REAL
    // lineage chain through the store's forms (never the store's population —
    // ancestors only) and pass the FULL ancestry; the immediate parent rides
    // `parentShape` exactly as before (gen-1 behavior byte-identical).
    // MULTI-PARENT DAG WALK (2026-07-12): the store's shapes ride along as the
    // CANDIDATE population so an assemble/connectedSum child (parentShapeId
    // null by design) recovers BOTH parents by the committed site-provenance
    // rule — still ancestors only, never the population as ancestry.
    const candidates = Object.values(state.forms).map((entry) => entry.shape);
    const ancestry = resolveLineage(form.shape, (id) => state.forms[id]?.shape, candidates);
    const context = {
      form: form.shape,
      selectedFaceId: state.selectedFaceId,
      selectedFace,
      // Q6 — whole-form ops (dual) may need the parent for quotient recovery
      parentShape: ancestry[0] ?? null,
      ancestry,
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
  // C4 — the interactive gluing-picker: an ARBITRARY boundary-edge pairing on
  // the selected face (unpaired edges stay free — an open surface), through the
  // committed ops + G5.0 materializer. The pure `customGluing` layer gates it
  // (this action throws loudly on an invalid choice; the UI disables first).
  applyCustomGlueToSelection: (pairings) => {
    const state = get();
    const form = state.currentFormId ? state.forms[state.currentFormId] : null;
    if (!form) {
      throw new Error('playgroundStore: no form selected — nothing to glue');
    }
    const selectedFace =
      (state.selectedFaceId &&
        form.shape.faces.find((face) => face.id === state.selectedFaceId)) ||
      null;
    // Q-M2 — chaining onto a born quotient face composes with the birth word,
    // recovered by replay against the parent. REGISTRY UNBOUNDING (2026-07-11):
    // the parent is the head of the REAL lineage walk (identical to the old
    // one-hop lookup when the parent is in the store — the custom-glue path is
    // polygon-domain and one-hop BY DESIGN, but the walk is one code path).
    // MULTI-PARENT DAG WALK (2026-07-12): candidates ride along (one code
    // path); for a multi-parent child ancestry[0] is deterministically parent
    // A (the committed first argument) — such children are multi-face and the
    // single-face gate refuses them here regardless.
    const parentShape = resolveLineage(
      form.shape,
      (id) => state.forms[id]?.shape,
      Object.values(state.forms).map((entry) => entry.shape),
    )[0] ?? null;
    const reason = validateCustomPairings(selectedFace, pairings, form.shape, parentShape);
    if (reason) {
      throw new Error(`playgroundStore: custom glue is not applicable — ${reason}`);
    }
    const born = executeCustomGlue(
      form.shape,
      selectedFace as NonNullable<typeof selectedFace>,
      pairings,
      parentShape,
    );

    get().addForm(born, { source: 'glue-custom', origin: 'operated' });

    return born;
  },
  // G3 — the arity-2 birth: assemble the CURRENT form (A) with a second form (B)
  // via the committed `assemble` and the v0 canonical identification. The child
  // is a multi-parent shape-root carrying BOTH parents through the committed
  // ledger/pull-back; `buildGenealogyDag` over the store recovers ancestors {A,B}.
  // C4 — an optional edgeChoice picks WHICH boundary edge of A and of B the
  // merge identifies (endpoint-parallel or reversed); omitted → the canonical
  // default, byte-identical to the pre-C4 path.
  applyAssembleToSelection: (secondFormId, edgeChoice) => {
    const state = get();
    const formA = state.currentFormId ? state.forms[state.currentFormId] : null;
    const formB = state.forms[secondFormId] ?? null;
    if (!formA) {
      throw new Error('playgroundStore: no form selected — assemble needs a current form (A)');
    }
    if (!canAssemblePair(formA.shape, formB?.shape ?? null)) {
      throw new Error(
        `playgroundStore: assemble is not applicable — ${getAssemblePairDisabledReason(formA.shape, formB?.shape ?? null) ?? 'ineligible pair'}`,
      );
    }
    if (edgeChoice) {
      const reason = validateAssembleEdges(formA.shape, formB?.shape ?? null, edgeChoice);
      if (reason) {
        throw new Error(`playgroundStore: assemble edge choice is not applicable — ${reason}`);
      }
    }
    const child = edgeChoice
      ? executeAssembleWithEdges(formA.shape, (formB as PlaygroundForm).shape, edgeChoice)
      : executeAssemblePair(formA.shape, (formB as PlaygroundForm).shape);

    get().addForm(child, { source: ASSEMBLE_OPERATION_ID, origin: 'born' });

    return child;
  },
  // E1 — snapshot save/load (ADR 0010): a self-contained serialization out, a
  // source-namespaced form in (`origin:'loaded'`; the source is a NAME). The
  // pure `snapshot` module owns the format + the co-location ≠ identity
  // namespacing (the committed multiform mechanism, reused).
  saveFormAsSnapshot: (formId) => {
    const form = get().forms[formId];
    if (!form) {
      throw new Error(`playgroundStore: no form "${formId}" to snapshot`);
    }
    const file = serializeSnapshot(form.shape, form.provenance.source ?? 'playground');
    set((state) => ({ snapshots: [...state.snapshots, file] }));
    return file;
  },
  loadSnapshot: (file, loadSource) => {
    const { shape, provenance } = deserializeSnapshot(file, loadSource);
    get().addForm(shape, provenance);
    return shape;
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

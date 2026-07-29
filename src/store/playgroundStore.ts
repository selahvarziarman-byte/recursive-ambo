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
import { connectedSum } from '../lib/connectedSum';
import { equalizePreparedDisks, refineAcquiredToDisk, refineToDisk } from '../lib/surfaceRefinement';
// the word-recoverability probe for combine's routing (the committed
// replay-verified recovery — never a provenance flag)
import { recoverBornSurface } from '../playground/bornFormRouting';
import type { CellId, Face, FaceId, Shape, ShapeId, VertexId } from '../types/geometry';

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
  // the loaded forms' CARRIED ancestor chains (GAP2C's acquire-metadata, the
  // playground twin of the manuscript shelf's carry): a snapshot-loaded
  // quotient acquires through its reconstructed chain — combine's wordless
  // refine consumes it
  loadedAncestors: Record<ShapeId, Shape[]>;
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
  applyCombineToSelection: (secondFormId: ShapeId) => Shape;
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
    loadedAncestors: {},
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
  // THE GATE (2026-07-17, sealed d130debf…21d3) — the arity-2 COMBINE: the
  // person sums TWO OF THEIR OWN forms. formA (current) + formB (picked by id)
  // → THE WIRE → the committed `connectedSum` → the born form joins the store.
  //
  // THE WIRE LIVES HERE, IN THE GATE — never inside connectedSum (frozen; its
  // contract is "sum two summable forms"; the gate's job is to hand it
  // summable forms, exactly what the catalogue does implicitly by choosing
  // grid tori). A MINIMAL 1-face word-form (the RP²/T²/Klein the person
  // begets) cannot be summed as begotten — the single-face wall — so the gate
  // refines it through the committed pair (`refineToDisk`, whose EXIT tests
  // every wall it must clear) and hands the sum its minted disk. A MULTI-face
  // form is already summable vocabulary — refining it here would mint a NEW
  // wall in front of forms that sum at HEAD today (the grid tori), the exact
  // defect class this arc kills.
  //
  // The child is born with `parentShapeId: null` (connectedSum's committed
  // design); the committed MULTI-PARENT DAG WALK (2026-07-12) recovers BOTH
  // parents from the store's candidates by site-provenance — the refined
  // intermediates carry the parents' own ids VERBATIM (refine is not a
  // birth), so the walk lands on the person's stored forms.
  applyCombineToSelection: (secondFormId) => {
    const state = get();
    const formA = state.currentFormId ? state.forms[state.currentFormId] : null;
    const formB = state.forms[secondFormId] ?? null;
    if (!formA) {
      throw new Error('playgroundStore: no form selected — combine needs a current form (A)');
    }
    if (!formB) {
      throw new Error('playgroundStore: combine needs a second form (B) — pick one from the list');
    }
    if (formA.shape.id === formB.shape.id) {
      throw new Error(
        'playgroundStore: combine needs two DISTINCT forms — invoke or beget a second one (co-location ≠ identity)',
      );
    }
    const candidates = Object.values(state.forms).map((entry) => entry.shape);
    // a face is a CLEAN PORT iff its rim is a simple loop with one edge
    // instance per corner pair — the sum's own :127/:132 questions, re-derived
    // here (THE EXIT's discipline: ask the wall's question, never import the
    // frozen wall)
    const hasCleanPort = (form: Shape): boolean =>
      form.faces.some((face) => {
        const cycle = face.vertexIds;
        if (cycle.length < 3 || new Set(cycle).size !== cycle.length) return false;
        for (let k = 0; k < cycle.length; k += 1) {
          const x = cycle[k];
          const y = cycle[(k + 1) % cycle.length];
          const instances = form.edges.filter(
            (e) => (e.vertexIds[0] === x && e.vertexIds[1] === y) || (e.vertexIds[0] === y && e.vertexIds[1] === x),
          ).length;
          if (instances !== 1) return false;
        }
        return true;
      });
    const prepare = (form: Shape): { shape: Shape; disk: Face | null } => {
      // already summable vocabulary — pass through untouched (the grid tori's
      // committed path: SOME face offers a clean port)
      if (form.faces.length !== 1 && hasCleanPort(form)) {
        return { shape: form, disk: null };
      }
      const carried = state.loadedAncestors[form.id] ?? [];
      const lineage = [...resolveLineage(form, (id) => state.forms[id]?.shape, candidates), ...carried];
      const parent = lineage[0] ?? null;
      // ROUTED BY WORD-RECOVERABILITY, never provenance: the committed replay
      // recovery speaks for word forms (refineToDisk, byte-kept); a form the
      // recovery refuses — the person's own lift-built composites — refines
      // through the WORDLESS pair on its acquired complex
      if (form.faces.length === 1 && recoverBornSurface(form, parent)) {
        const refined = refineToDisk(form, parent);
        return {
          shape: refined.shape,
          disk: refined.shape.faces.find((face) => face.id.endsWith(':disk')) ?? null,
        };
      }
      const refined = refineAcquiredToDisk(form, lineage.length > 0 ? lineage : null);
      return {
        shape: refined.shape,
        disk: refined.shape.faces.find((face) => face.id.endsWith(':disk')) ?? null,
      };
    };
    const preparedA = prepare(formA.shape);
    const preparedB = prepare(formB.shape);
    // M2 — pairwise equalize: unequal MINTED rims compose the sew preparer's
    // deficit-pattern across the pair, so the sum's equal-rims wall passes
    const { a, b } = equalizePreparedDisks(preparedA, preparedB);
    const child = connectedSum(a.shape, b.shape, {
      ...(a.disk ? { faceA: a.disk } : {}),
      ...(b.disk ? { faceB: b.disk } : {}),
    }).shape;

    get().addForm(child, { source: 'combine', origin: 'born' });

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
    const { shape, provenance, ancestors } = deserializeSnapshot(file, loadSource);
    get().addForm(shape, provenance);
    // the snapshot's reconstructed chain rides as acquire-metadata (GAP2C):
    // without it a loaded quotient cannot acquire, and combine's wordless
    // refine would refuse the person's own saved forms
    if (ancestors && ancestors.length > 0) {
      set((state) => ({ loadedAncestors: { ...state.loadedAncestors, [shape.id]: ancestors } }));
    }
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

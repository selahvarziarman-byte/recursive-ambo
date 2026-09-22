import { create } from 'zustand';
import { createSeedShape } from '../data/seeds';
import { isCellActiveFrontier } from '../lib/cellLifecycle';
import { liftSubComplex, type LiftSelection } from '../lib/subComplexLift';
import { openLift } from '../lib/openLift';
import { segmentGateReason, thicken } from '../lib/thicken';
import { closeSegmentIntoLoop } from '../lib/closeEdgeIntoCircle';
import { serializeSnapshot } from '../playground/snapshot';
import { useLiftStore } from './liftStore';
import {
  serializeWorkspaceSnapshot,
  validateWorkspaceImport,
  type PersistedViewLayout,
  type PersistedWorkspaceV1,
} from '../lib/workspacePersistence';
import { getOperation } from '../operations/registry';
// C-7b — THE REFUSAL AT THE ACT: the register's check on a pair the person gives (the mold's
// types by definition, caster words only by τ) and the FORM of a word pair; imported by the
// store because the act IS the store action — no write without the check, by construction
import { refusalOf, wordPairForm, type Conflict } from '../lib/jRegister';
import type {
  Cell,
  CellId,
  Edge,
  EdgeId,
  EdgeIdentification,
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

// C-7b — THE MIDPOINT'S ACTS: the person points role to role and word to word on the
// source edge; a refused act stays PENDING beside its refusal (the FORM in words, or the
// contradictions by name) so the person can withdraw EITHER half — the attempt, or the
// prior act it conflicts with — and a withdrawal of a prior half re-makes the attempt.
export interface MidpointAct {
  kind: 'role' | 'word';
  pair: [string, string]; // this cast's ↦ that cast's (the edge's first corner ↦ its second)
}

export interface MidpointRefusal {
  act: MidpointAct;
  form?: string; // a refusal of the FORM (a role already paired · a word across arities · a name not declared)
  conflicts: Conflict[]; // the contradictions, by name — empty on a refusal of the form
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
  // GAP2A PARITY: the single inspection-selected EDGE (plain-click in the
  // composition rows) — the third selection kind, feeding the lift fallback
  // exactly as a selected vertex does (the segment operand thicken needs)
  selectedEdgeId: EdgeId | null;
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
  openLiftStarToManuscript: () => string;
  thickenManuscript: (shape: Shape, segment: Shape) => { name: string; shapeId: string; metricBaseId: string | null };
  closeSegmentManuscript: (segment: Shape) => string;
  toggleLiftSelection: (selection: LiftSelection) => void;
  clearLiftSelection: () => void;
  selectShape: (shapeId: ShapeId) => void;
  selectCell: (cellId: CellId | null) => void;
  selectVertex: (vertexId: VertexId | null) => void;
  selectEdge: (edgeId: EdgeId | null) => void;
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
  // C-6d (β) — THE J REGISTER'S RECORD. τ given on an edge BEFORE a take is held here,
  // not in the record: the FROZEN `EdgeIdentification` (roles and types both required)
  // cannot mark "τ given, not yet acted" apart from "none taken", so the take is what
  // writes τ into the record; a withdrawal hands it back here. Not exported with the
  // workspace (the record is; said in the report).
  edgeTauDrafts: Record<EdgeId, EdgeIdentification['types']>;
  setEdgeTau: (edgeId: EdgeId, types: EdgeIdentification['types']) => void;
  takeEdgeIdentification: (edgeId: EdgeId, roles: EdgeIdentification['roles']) => void;
  withdrawEdgeIdentification: (edgeId: EdgeId) => void;
  // C-7b — the midpoint's acts on the source edge, checked at the act; a refusal per edge,
  // transient (never exported — the record is)
  midpointRefusals: Record<EdgeId, MidpointRefusal>;
  giveRolePair: (edgeId: EdgeId, x: string, y: string) => void;
  withdrawRolePair: (edgeId: EdgeId, x: string, y: string) => void;
  giveWordPair: (edgeId: EdgeId, s: string, t: string) => void;
  withdrawWordPair: (edgeId: EdgeId, s: string, t: string) => void;
  withdrawMidpointAttempt: (edgeId: EdgeId) => void;
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
  selectedEdgeId: null,
  edgeTauDrafts: {},
  midpointRefusals: {},
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
      selectedEdgeId: null,
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
      selectedEdgeId: null,
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
      selectedEdgeId: null,
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
      selectedEdgeId: null,
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
      selectedEdgeId: null,
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
    const { currentShapeId, shapes, selectedCellId, selectedVertexId, selectedEdgeId, liftSelection } = get();
    const shape = shapes[currentShapeId];
    if (!shape) {
      throw new Error('geometryStore: no current shape to lift from');
    }
    const selections: LiftSelection[] =
      liftSelection.length > 0
        ? liftSelection
        // the MOST SPECIFIC inspection selection wins: an explicitly selected
        // edge/vertex lifts as ITSELF, never the cell it was picked within (the
        // cell stays selected for its rows). The prior cell-first order shadowed
        // a selected edge with its cell, so "select an edge → lift" lifted the
        // whole cell and a segment was unliftable (2026-07-24).
        : selectedEdgeId
          ? [{ kind: 'edge', id: selectedEdgeId }]
          : selectedVertexId
            ? [{ kind: 'vertex', id: selectedVertexId }]
            : selectedCellId
              ? [{ kind: 'cell', id: selectedCellId }]
              : [];
    if (selections.length === 0) {
      throw new Error(
        'geometryStore: select a cell, a vertex, or an edge to lift (or shift-click a region into the lift set)',
      );
    }
    const lifted = liftSubComplex(shape, selections);
    // GAP2C: the workspace population rides as serialize-time ancestry — the
    // snapshot's predicate carries the chain exactly when the lifted region's
    // own complex is direct-unreadable (a seamed composite), else byte-as-before
    const file = serializeSnapshot(lifted.shape, shape.id, Object.values(shapes), shape.name);
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
    const { currentShapeId, shapes, selectedCellId, selectedVertexId, selectedEdgeId, liftSelection } = get();
    const shape = shapes[currentShapeId];
    if (!shape) {
      throw new Error('geometryStore: no current shape to lift from');
    }
    const selections: LiftSelection[] =
      liftSelection.length > 0
        ? liftSelection
        // the MOST SPECIFIC inspection selection wins: an explicitly selected
        // edge/vertex lifts as ITSELF, never the cell it was picked within (the
        // cell stays selected for its rows). The prior cell-first order shadowed
        // a selected edge with its cell, so "select an edge → lift" lifted the
        // whole cell and a segment was unliftable (2026-07-24).
        : selectedEdgeId
          ? [{ kind: 'edge', id: selectedEdgeId }]
          : selectedVertexId
            ? [{ kind: 'vertex', id: selectedVertexId }]
            : selectedCellId
              ? [{ kind: 'cell', id: selectedCellId }]
              : [];
    if (selections.length === 0) {
      throw new Error(
        'geometryStore: select a cell, a vertex, or an edge to lift (or shift-click a region into the lift set)',
      );
    }
    const lifted = liftSubComplex(shape, selections);
    const band = thicken(lifted.shape);
    // GAP2C: the same serialize-time ancestry as the plain lift; the band's
    // own chain additionally rides through its lifted parent
    useLiftStore.getState().push({
      title: lifted.title,
      file: serializeSnapshot(lifted.shape, shape.id, Object.values(shapes), shape.name),
    });
    useLiftStore.getState().push({
      title: band.shape.name,
      file: serializeSnapshot(band.shape, shape.id, [lifted.shape, ...Object.values(shapes)], shape.name),
    });
    if (liftSelection.length > 0) {
      set({ liftSelection: [] });
    }
    return band.shape.name;
  },
  // DOOR 3 (2026-08-13, SEAL_OPEN_STAR_EXTRACTOR + researcher 1837): the
  // OPEN-LIFT word on the terrain — the star of the selected X_K midpoint,
  // read off the selected cell's skin, extracted as a BOUNDED base Shape
  // (rim FREE — patchLift's carriage minus its closure) and pushed down the
  // shelf channel like every lift-born form. The committed openLift gates
  // (the site check, the triangle-fan v0 scope, the disk link) throw honest
  // and the panel shows them; the terrain stays live ('open-lift' is
  // NON-CONSUMING). Ancestry rides GAP2C-style so the carried terrain
  // lineage stays readable on the shelf.
  openLiftStarToManuscript: () => {
    const { currentShapeId, shapes, selectedCellId, selectedVertexId } = get();
    const shape = shapes[currentShapeId];
    if (!shape) {
      throw new Error('geometryStore: no current shape to open-lift from');
    }
    if (!selectedVertexId) {
      throw new Error('geometryStore: select the star centre first (an X_K midpoint vertex)');
    }
    if (!selectedCellId) {
      throw new Error('geometryStore: select the skin cell the star is read from (e.g. the diagonalized core)');
    }
    const lifted = openLift(shape, selectedVertexId, selectedCellId);
    useLiftStore.getState().push({
      title: lifted.shape.name,
      file: serializeSnapshot(lifted.shape, shape.id, Object.values(shapes), shape.name),
    });
    return lifted.shape.name;
  },
  // GAP2B THICKEN ARITY-2 (the 8th word): the person's TWO held forms — the
  // shape and their lifted segment — product through the same committed
  // thicken (Q1-guarded inside it; refusals throw honest and the view shows
  // them). The band rides the shelf channel exactly as the unary lift door
  // pushes it; both parents stay live (`product` is NON-CONSUMING).
  thickenManuscript: (shape, segment) => {
    const band = thicken(shape, segment);
    // 2(b) (B-2026-08-22-C, mothership-ruled): the join hands the OPERAND —
    // `[shape]` rides the file as ancestors (the record being WHOLE: the
    // base is what the band is made OF, not context it refers to), and the
    // committed loader preserves the genealogy pointer onto the
    // reconstructed ancestor in the hop's own id space — the pillar reader
    // gets its operand and the sealed metric survives every shelf hop.
    // D1's thread now starts at the genealogy pointer itself (thicken names
    // the base at both arities); the segment still rides the product
    // record. D8 stands: the mint-time shape id keys the carried base for
    // the same-session placed product (exact id — nothing hopped there).
    useLiftStore.getState().push({ title: band.shape.name, file: serializeSnapshot(band.shape, shape.id, [shape], shape.name) });
    return { name: band.shape.name, shapeId: band.shape.id, metricBaseId: band.product.parents?.shapeId ?? null };
  },
  // P1 THE LOOP-MAKER (DOORS batch): the FOLD word on a SEGMENT closes it into
  // the circle — closeEdgeIntoCircle's ledger fact, minted as the loop Shape,
  // pushed down the same shelf channel as every lift-born form. Q1 is the ONE
  // gate ("must be a segment"), re-used verbatim; the segment parent rides the
  // snapshot's ancestry so the loop's chain stays whole.
  closeSegmentManuscript: (segment) => {
    const refusal = segmentGateReason(segment);
    if (refusal !== null) {
      throw new Error(`closeSegment: the fold closes a SEGMENT into a loop; this form ${refusal}`);
    }
    const born = closeSegmentIntoLoop(segment, segment.edges[0]);
    useLiftStore.getState().push({
      title: born.shape.name,
      file: serializeSnapshot(born.shape, segment.id, [segment], segment.name),
    });
    return born.shape.name;
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
      selectedEdgeId:
        state.selectedEdgeId && shape.edges.some((edge) => edge.id === state.selectedEdgeId)
          ? state.selectedEdgeId
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
      selectedEdgeId: null,
      dualInspectionTarget: null,
      hoveredFieldAtlasSampleId: null,
    });
  },
  selectVertex: (vertexId) => {
    set({
      selectedVertexId: vertexId,
      selectedEdgeId: null,
      dualInspectionTarget: null,
      hoveredFieldAtlasSampleId: null,
    });
  },
  // GAP2A PARITY — the edge joins the selection kinds: mirror of selectVertex
  // (clears the vertex; the CELL stays — an edge is picked within its cell's
  // composition, the cell context remains the inspector's frame)
  selectEdge: (edgeId) => {
    set({
      selectedEdgeId: edgeId,
      selectedVertexId: null,
      dualInspectionTarget: null,
      hoveredFieldAtlasSampleId: null,
    });
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
  // ═══ C-6d (β) — the person's `J` on an edge: `Edge.identification` (FROZEN type, untouched)
  // is WRITTEN by `writeEdgeIdentification` below and nowhere else — `roles` and `types`
  // (τ) ONLY; `support` and `fiat` are DERIVED at every read and written by nothing. No
  // history entry: an identification is the person's record on the edge, like a packet
  // edit, not an operation on the shape. ═══
  setEdgeTau: (edgeId, types) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    const edge = shape?.edges.find((candidate) => candidate.id === edgeId);
    if (!shape || !edge) {
      return;
    }
    if (edge.identification) {
      // a TAKEN J survives a τ change as the person's record: the roles stay, τ changes, the marks re-derive
      writeEdgeIdentification(set, state, shape, edgeId, { roles: edge.identification.roles, types });
      return;
    }
    const edgeTauDrafts = { ...state.edgeTauDrafts };
    if (types.length) {
      edgeTauDrafts[edgeId] = types;
    } else {
      delete edgeTauDrafts[edgeId];
    }
    set({ edgeTauDrafts });
  },
  takeEdgeIdentification: (edgeId, roles) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    const edge = shape?.edges.find((candidate) => candidate.id === edgeId);
    if (!shape || !edge) {
      return;
    }
    // the τ in force at the take — the record's if one stands, else the draft; `none` is a take too (roles empty)
    const types = edge.identification ? edge.identification.types : state.edgeTauDrafts[edgeId] ?? [];
    const edgeTauDrafts = { ...state.edgeTauDrafts };
    delete edgeTauDrafts[edgeId];
    writeEdgeIdentification(set, { ...state, edgeTauDrafts }, shape, edgeId, { roles, types });
  },
  withdrawEdgeIdentification: (edgeId) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    const edge = shape?.edges.find((candidate) => candidate.id === edgeId);
    if (!shape || !edge || !edge.identification) {
      return;
    }
    // the act undone: the record leaves the edge; its τ goes back to the draft so the offering stands as it was
    const edgeTauDrafts = { ...state.edgeTauDrafts };
    if (edge.identification.types.length) {
      edgeTauDrafts[edgeId] = edge.identification.types;
    } else {
      delete edgeTauDrafts[edgeId];
    }
    writeEdgeIdentification(set, { ...state, edgeTauDrafts }, shape, edgeId, undefined);
  },
  // ═══ C-7b — THE MIDPOINT'S ACTS (the record placement stands, 0031 §5: `identification`
  // on the source edge between the two parents, in the current shape; the midpoint READS it).
  // Every act is CHECKED AT THE ACT — the FORM first, then the register's refusal — and a
  // contradiction refuses with NOTHING glued (the edge keeps its prior state). τ before the
  // first role pair lives in the draft, as (β) held it; a record leaves the edge when its last
  // role pair is withdrawn, its τ handed back to the draft. Every write routes through THE ONE
  // WRITER. No history entry — the person's record on the edge, like a packet edit. ═══
  giveRolePair: (edgeId, x, y) => midpointAct(set, get, edgeId, { kind: 'role', pair: [x, y] }),
  giveWordPair: (edgeId, s, t) => midpointAct(set, get, edgeId, { kind: 'word', pair: [s, t] }),
  withdrawRolePair: (edgeId, x, y) => midpointWithdraw(set, get, edgeId, { kind: 'role', pair: [x, y] }),
  withdrawWordPair: (edgeId, s, t) => midpointWithdraw(set, get, edgeId, { kind: 'word', pair: [s, t] }),
  withdrawMidpointAttempt: (edgeId) => {
    const midpointRefusals = { ...get().midpointRefusals };
    delete midpointRefusals[edgeId];
    set({ midpointRefusals });
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
      selectedEdgeId: null,
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

// C-6d (β): THE ONE WRITER of `Edge.identification` — every action routes here; the concept-type
// census pins this site alone. `roles` and `types` only: a stored derived value is a stamp that drifts.
function writeEdgeIdentification(
  set: (partial: Partial<GeometryState>) => void,
  state: GeometryState,
  shape: Shape,
  edgeId: EdgeId,
  next: { roles: EdgeIdentification['roles']; types: EdgeIdentification['types'] } | undefined,
): void {
  const edges = shape.edges.map((edge) => {
    if (edge.id !== edgeId) {
      return edge;
    }
    const rest = { ...edge };
    delete rest.identification;
    if (!next) {
      return rest;
    }
    return {
      ...rest,
      identification: {
        roles: next.roles.map(([x, y]) => [x, y] as [string, string]),
        types: next.types.map(([x, y]) => [x, y] as [string, string]),
      },
    };
  });
  set({
    edgeTauDrafts: state.edgeTauDrafts,
    midpointRefusals: state.midpointRefusals,
    shapes: {
      ...state.shapes,
      [shape.id]: {
        ...shape,
        edges,
      },
    },
  });
}

// ─── C-7b — the midpoint's acts, behind the one writer ───
type Getter = () => GeometryState;
type Setter = (partial: Partial<GeometryState>) => void;

/** the record in force on an edge: the identification's roles and τ, or no roles and the draft's τ */
function midpointRecord(state: GeometryState, edge: Edge): { roles: EdgeIdentification['roles']; types: EdgeIdentification['types'] } {
  const rec = edge.identification;
  return { roles: rec ? rec.roles : [], types: rec ? rec.types : state.edgeTauDrafts[edge.id] ?? [] };
}

/** the roles and τ written as the record when a role pair stands; τ alone goes to the draft; nothing at all clears both */
function midpointWrite(set: Setter, state: GeometryState, shape: Shape, edge: Edge, roles: EdgeIdentification['roles'], types: EdgeIdentification['types']): void {
  const edgeTauDrafts = { ...state.edgeTauDrafts };
  if (roles.length === 0) {
    if (types.length) edgeTauDrafts[edge.id] = types;
    else delete edgeTauDrafts[edge.id];
    writeEdgeIdentification(set, { ...state, edgeTauDrafts }, shape, edge.id, undefined);
    return;
  }
  delete edgeTauDrafts[edge.id];
  writeEdgeIdentification(set, { ...state, edgeTauDrafts }, shape, edge.id, { roles, types });
}

function midpointAct(set: Setter, get: Getter, edgeId: EdgeId, act: MidpointAct): void {
  const state = get();
  const shape = state.shapes[state.currentShapeId];
  const edge = shape?.edges.find((candidate) => candidate.id === edgeId);
  if (!shape || !edge) return;
  const A = shape.vertices[edge.vertexIds[0]]?.data.cast;
  const B = shape.vertices[edge.vertexIds[1]]?.data.cast;
  if (!A || !B) return; // a seam whose corners do not both hold a cast has no act
  const { roles, types } = midpointRecord(state, edge);
  const refuse = (form: string | undefined, conflicts: Conflict[]): void => {
    set({ midpointRefusals: { ...get().midpointRefusals, [edgeId]: { act, ...(form ? { form } : {}), conflicts } } });
  };
  let nextRoles = roles;
  let nextTypes = types;
  if (act.kind === 'role') {
    const [x, y] = act.pair;
    if (!A.roles.some((r) => r.id === x)) return refuse(`"${x}" is not a role this cast holds`, []);
    if (!B.roles.some((r) => r.id === y)) return refuse(`"${y}" is not a role that cast holds`, []);
    const px = roles.find(([a]) => a === x);
    if (px) return refuse(`${x} is already paired with ${px[1]} — one role, one partner`, []);
    const py = roles.find(([, b]) => b === y);
    if (py) return refuse(`${y} is already paired with ${py[0]} — one role, one partner`, []);
    nextRoles = [...roles, [x, y]];
  } else {
    const [s, w] = act.pair;
    const form = wordPairForm(A, B, s, w);
    if (form) return refuse(form, []);
    const ps = types.find(([a]) => a === s);
    if (ps) return refuse(`${s} is already translated to ${ps[1]} — one word, one translation`, []);
    const pw = types.find(([, b]) => b === w);
    if (pw) return refuse(`${w} is already the translation of ${pw[0]} — one word, one translation`, []);
    nextTypes = [...types, [s, w]];
  }
  const conflicts = refusalOf(A, B, nextRoles, nextTypes);
  if (conflicts.length) return refuse(undefined, conflicts);
  const midpointRefusals = { ...state.midpointRefusals };
  delete midpointRefusals[edgeId];
  midpointWrite(set, { ...state, midpointRefusals }, shape, edge, nextRoles, nextTypes);
}

function midpointWithdraw(set: Setter, get: Getter, edgeId: EdgeId, act: MidpointAct): void {
  const state = get();
  const shape = state.shapes[state.currentShapeId];
  const edge = shape?.edges.find((candidate) => candidate.id === edgeId);
  if (!shape || !edge) return;
  const { roles, types } = midpointRecord(state, edge);
  const nextRoles = act.kind === 'role' ? roles.filter(([a, b]) => !(a === act.pair[0] && b === act.pair[1])) : roles;
  const nextTypes = act.kind === 'word' ? types.filter(([a, b]) => !(a === act.pair[0] && b === act.pair[1])) : types;
  if (nextRoles.length === roles.length && nextTypes.length === types.length) return; // nothing of that name to withdraw
  midpointWrite(set, state, shape, edge, nextRoles, nextTypes);
  // a PENDING attempt is re-made: the person removed the half they judged wrong; the act they made stands to be made
  const pending = get().midpointRefusals[edgeId];
  if (pending) {
    const midpointRefusals = { ...get().midpointRefusals };
    delete midpointRefusals[edgeId];
    set({ midpointRefusals });
    midpointAct(set, get, edgeId, pending.act);
  }
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

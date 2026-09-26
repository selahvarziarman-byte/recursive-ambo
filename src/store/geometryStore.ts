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
// C-7e — the pair key the ambo mints edges by (ids.ts is FROZEN; imported, not edited)
import { canonicalEdgeKey } from '../lib/ids';
// C-7b — THE REFUSAL AT THE ACT: the register's check on a pair the person gives (the mold's
// types by definition, caster words only by τ) and the FORM of a word pair; imported by the
// store because the act IS the store action — no write without the check, by construction
import { refusalOf, wordPairForm, type Conflict } from '../lib/jRegister';
// C-8 — THE RESOLVER: the two ends of a seam resolved (a seed corner's cast; a born corner's derived space), the identity
// the SOLID fixes on the seam (the check runs over it; the record never holds it), and every born act read again under
// the shape an act would leave (the dependency refusal, item 4)
import { brokenBornActs, composedOn, edgeKind, generationOf, nameIn, spaceOf, stoneOn, stoneWords, type BrokenBornAct, type Resolved } from '../lib/spaceOf';
import { isGeneratedMidpoint, migrateChristening, recomposeUnchristened, withChristened } from '../lib/christening';
import { triadLegsOf, triadOf, withTriad, withoutTriad, type RespectKind, type TriadPick, type TriadRefusal } from '../lib/respects';
import { IS, relatingOf, relatingsHeld, withRelating, withoutRelating, type Relating, type RelatingRefusal, type Sign } from '../lib/relatings';
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
  withdrawal?: true; // C-8 item 4: the act was a WITHDRAWAL of this pair (refused only when a born act rests on it)
}

/**
 * C-8 item 4 — THE DEPENDENCY REFUSAL, across generations (the researcher's, forced by the lift law): a later act that
 * would BREAK an earlier born act is refused at the act, naming the born act it would break — where it lives (its edge,
 * its site), how many generations up, and the act itself; the person may withdraw the older act first. Accepting it and
 * dropping the born act ERASES; accepting both FABRICATES; refusing the new act is neither.
 */
export interface MidpointDependency {
  edgeId: EdgeId; // the medial edge holding the born act
  siteId: VertexId | null; // the midpoint minted on that edge, when the shape holds it
  generationsUp: number; // the born act's site against this act's site
  act: MidpointAct; // the born act, as its record holds it
  names: [string, string]; // the born act as a person reads it — the spaces' labels, never a local key
  why: string; // what this act would do to it, in words
}

export interface MidpointRefusal {
  act: MidpointAct;
  form?: string; // a refusal of the FORM (a role already paired · a word across arities · a name not declared · a role the solid made one already)
  conflicts: Conflict[]; // the contradictions, by name — empty on a refusal of the form
  dependency?: MidpointDependency; // C-8 item 4 — the born act this act would break
}

/** C-7f item 3 (the designer) — a pair the store RE-MADE when the person withdrew the half they judged wrong; the surface attributes it (`yours · re-made when you withdrew r8 ↦ Φ6`). Transient, like the refusal — never exported */
export interface MidpointRemade {
  act: MidpointAct; // the pair that stands, re-made
  withdrawn: MidpointAct; // the person's withdrawal that re-made it
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
  // C-10b: the selected FACE rides the undo snapshot beside the cell and the vertex (optional — older snapshots carry none)
  selectedFaceId?: FaceId | null;
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
  // C-10b (§131, the designer's item 2): the selected FACE — its reading (C-5 at gen 0, C-9 born) mounts at ITS home in the
  // selection panel; a face is picked within its cell's composition (the cell stays), on the solid or in the Cell Faces list
  selectedFaceId: FaceId | null;
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
  selectFace: (faceId: FaceId | null) => void;
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
  // C-7f item 3 — the attribution of a re-made pair, per edge; transient
  midpointRemade: Record<EdgeId, MidpointRemade>;
  // C-14 — a triad refused at a face, by name, with the person's picks: the surface shows it beside the face until he withdraws the attempt (never persisted — an attempt is not a record)
  triadRefusals: Record<string, TriadRefusal & { kind: RespectKind; picks: TriadPick[] }>;
  giveRolePair: (edgeId: EdgeId, x: string, y: string) => void;
  withdrawRolePair: (edgeId: EdgeId, x: string, y: string) => void;
  giveWordPair: (edgeId: EdgeId, s: string, t: string) => void;
  withdrawWordPair: (edgeId: EdgeId, s: string, t: string) => void;
  withdrawMidpointAttempt: (edgeId: EdgeId) => void;
  // C-14 — THE TRIAD AS RESPECTS, the person's act at a face (ADR 0031 §3.11): three picks, one per corner, recorded ON THE FACE
  // (positional in its corner order, no id inside — src/lib/respects.ts); its three respects, one per edge in the light of the
  // third corner, are read from it — ATOMIC: a refused leg enters nothing and is named. No history entry: a triad is the
  // person's record on the face, like a pairing on the edge. The one hand back is the whole triad.
  giveTriad: (faceId: string, kind: RespectKind, picks: TriadPick[]) => TriadRefusal | null;
  withdrawTriad: (faceId: string, kind: RespectKind, picks: TriadPick[]) => void;
  withdrawTriadAttempt: (faceId: string) => void;
  // MODES-1 · B1 — THE EDGE RECORD IN MODES (the projection ruling D1–D3, D12; src/lib/relatings.ts). The lexicon L: the words the
  // person DECLARED, in his order (a declaration is an act; persisted with the workspace; IS and the words in use are derived
  // beside it by `lexiconOf`). A relating (w, x, y, ±) is given on an edge and recorded in the edge's packet — its one writer is
  // `writeEdgeRelatings` below; an IS-instance is the pairing itself and routes to `giveRolePair` (one home for IS). A refusal
  // per edge, transient (never persisted — an attempt is not a record). No history entry: a relating is the person's record.
  lexicon: string[];
  relatingRefusals: Record<EdgeId, RelatingRefusal & { relating: Relating }>;
  declareMode: (word: string) => void;
  withdrawMode: (word: string) => void;
  giveRelating: (edgeId: EdgeId, w: string, x: string, y: string, sign: Sign) => RelatingRefusal | null;
  withdrawRelating: (edgeId: EdgeId, w: string, x: string, y: string) => void;
  withdrawRelatingAttempt: (edgeId: EdgeId) => void;
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
  selectedFaceId: null,
  edgeTauDrafts: {},
  lexicon: [],
  relatingRefusals: {},
  midpointRefusals: {},
  midpointRemade: {},
  triadRefusals: {},
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
      selectedFaceId: null,
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
      selectedFaceId: null,
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
      selectedFaceId: null,
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
      selectedFaceId: null,
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
    // §148 ruling 3 (2026-09-24, after C-12a's measurement) — THE EXISTING CHILD IS MADE CURRENT, NEVER RE-DERIVED. The
    // child's id indexes the act (the parent AND the dissected cell ride the mint's hashed argument — ambo.ts); when the
    // act's result is already held, the person returns to it. Re-deriving it from the parent's records alone DROPPED every
    // act the person had given at the child (measured: a born pair 1 → 0, with no mark — the data-loss class), and before
    // the mint change a DIFFERENT cell of the same parent minted the same id and overwrote the first child. Nothing is
    // stored, nothing enters the history; the derivation above is discarded.
    if (shapes[nextShape.id]) {
      get().selectShape(nextShape.id);
      return;
    }
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
      selectedFaceId: null,
      liftSelection: [],
      dualInspectionTarget: null,
      hoverTarget: null,
      hoveredFieldAtlasSampleId: null,
      pinnedFieldAtlasProbeRef: null,
      historySequence,
    });
    // C-7e (Δ84): the drafts ride the ambo by PAIR, once the new shape is current (the record itself is carried in ambo.ts)
    if (operation.id === 'ambo-dissection') carryDraftsByPair(set, get, currentShape, nextShape);
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
    const { currentShapeId, shapes, selectedCellId, selectedVertexId, selectedEdgeId, selectedFaceId, liftSelection } = get();
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
            : selectedFaceId
              ? [{ kind: 'face', id: selectedFaceId }] // C-10b: a selected face lifts as itself, before its cell
              : selectedCellId
                ? [{ kind: 'cell', id: selectedCellId }]
                : [];
    if (selections.length === 0) {
      throw new Error(
        'geometryStore: select a cell, a face, a vertex, or an edge to lift (or shift-click a region into the lift set)',
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
      selectedFaceId:
        state.selectedFaceId && shape.faces.some((face) => face.id === state.selectedFaceId) ? state.selectedFaceId : null,
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
      selectedFaceId: null,
      dualInspectionTarget: null,
      hoveredFieldAtlasSampleId: null,
    });
  },
  selectVertex: (vertexId) => {
    set({
      selectedVertexId: vertexId,
      selectedEdgeId: null,
      selectedFaceId: null,
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
      selectedFaceId: null,
      dualInspectionTarget: null,
      hoveredFieldAtlasSampleId: null,
    });
  },
  // C-10b — THE FACE'S ACT (§131): a face is selected to be READ — its reading mounts at its home in the selection panel
  // (C-6a's "no select-face act" stood until the act had a meaning; the designer's §131 item 2 gives it one). Mirror of
  // selectEdge: the vertex and the edge clear, the CELL stays (a face is picked within its cell's composition).
  selectFace: (faceId) => {
    set({
      selectedFaceId: faceId,
      selectedVertexId: null,
      selectedEdgeId: null,
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

    const patchedData = { ...vertex.data, ...patch };
    // C-13b (Δ58 · Δ104 as M1 reconciles them) — THE CHRISTENING ACT. A changed label is the person's word on this corner
    // wherever the corner is shown: it reaches the copy of this vertex in every shape of the genealogy, and for a midpoint
    // it sets the positive mark (a non-empty label christens; an emptied one un-christens — the slot is never emptied, the
    // composed string returns). Then every un-christened midpoint's slot, in every shape, is re-composed by the mint's own
    // rule so the letters follow their corners; a christened midpoint is never touched.
    if (patch.label !== undefined && patch.label !== vertex.data.label) {
      const label = patch.label;
      const christened = isGeneratedMidpoint(vertex) ? label.trim().length > 0 : null;
      const marked = (data: VertexDataPacket): VertexDataPacket => (christened === null ? data : { ...data, custom: withChristened(data.custom, christened) });
      const next: Record<ShapeId, Shape> = {};
      for (const [id, held] of Object.entries(shapes)) {
        let target = held;
        if (id === shape.id) {
          target = { ...shape, vertices: { ...shape.vertices, [selectedVertexId]: { ...vertex, data: marked(patchedData) } } };
        } else if (held.vertices[selectedVertexId]) {
          const copy = held.vertices[selectedVertexId];
          target = { ...held, vertices: { ...held.vertices, [selectedVertexId]: { ...copy, data: marked({ ...copy.data, label }) } } };
        }
        next[id] = recomposeUnchristened(target);
      }
      set({ shapes: next });
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
              data: patchedData,
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
  giveTriad: (faceId, kind, picks) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    if (!shape) return { corner: null, item: null, leg: null, why: 'no current shape' };
    const triad = triadOf(shape, faceId, kind, picks, { tauDrafts: state.edgeTauDrafts });
    if (triad.refused) {
      set({ triadRefusals: { ...state.triadRefusals, [faceId]: { ...triad.refused, kind, picks } } });
      return triad.refused;
    }
    // atomic: ONE record written in one set — the face the act was pointed at (its three respects are read from it), nothing else
    const faces = shape.faces.map((f) => (f.id === faceId ? withTriad(f, kind, triad.record) : f));
    const triadRefusals = { ...state.triadRefusals };
    delete triadRefusals[faceId];
    set({ shapes: { ...state.shapes, [shape.id]: { ...shape, faces } }, triadRefusals });
    return null;
  },
  withdrawTriad: (faceId, kind, picks) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    if (!shape) return;
    const face = shape.faces.find((f) => f.id === faceId);
    if (!face) return;
    // the structure alone: a triad withdraws whole even when a corner's space has since changed — from every face record of
    // this vertex set (a face two cells hold is two records; the readers gather them as one light)
    const twin = (f: Shape['faces'][number]): boolean => f.vertexIds.length === face.vertexIds.length && face.vertexIds.every((v) => f.vertexIds.includes(v));
    const faces = shape.faces.map((f) => {
      if (!twin(f)) return f;
      const t = triadLegsOf(shape, f.id, picks);
      return t.refused ? f : withoutTriad(f, kind, t.record);
    });
    set({ shapes: { ...state.shapes, [shape.id]: { ...shape, faces } } });
  },
  withdrawTriadAttempt: (faceId) => {
    const triadRefusals = { ...get().triadRefusals };
    delete triadRefusals[faceId];
    set({ triadRefusals });
  },
  // ═══ MODES-1 · B1 — the lexicon and the relatings ═══
  declareMode: (word) => {
    const mode = word.trim();
    const { lexicon } = get();
    if (!mode || mode === IS || lexicon.includes(mode)) return;
    set({ lexicon: [...lexicon, mode] });
  },
  withdrawMode: (word) => {
    const { lexicon } = get();
    if (!lexicon.includes(word)) return;
    set({ lexicon: lexicon.filter((w) => w !== word) }); // the relatings in it stay — they are the person's record; the word stays in use
  },
  giveRelating: (edgeId, w, x, y, sign) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    if (!shape) return { corner: null, item: null, why: 'no current shape' };
    if (w.trim() === IS && sign === '+') {
      // an IS-instance IS the pairing: one home, the typed record, through the pairing's own act and its refusals
      state.giveRolePair(edgeId, x, y);
      return null;
    }
    const act = relatingOf(shape, edgeId, w, x, y, sign, { tauDrafts: state.edgeTauDrafts });
    if (act.refused) {
      set({ relatingRefusals: { ...state.relatingRefusals, [edgeId]: { ...act.refused, relating: [w, x, y, sign] } } });
      return act.refused;
    }
    const relatingRefusals = { ...state.relatingRefusals };
    delete relatingRefusals[edgeId];
    writeEdgeRelatings(set, { ...state, relatingRefusals }, shape, edgeId, (edge) => withRelating(edge, act.relating));
    return null;
  },
  withdrawRelating: (edgeId, w, x, y) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    if (!shape) return;
    if (w.trim() === IS) {
      const edge = shape.edges.find((c) => c.id === edgeId);
      if (edge && relatingsHeld(edge).some((r) => r[0] === IS && r[1] === x && r[2] === y)) writeEdgeRelatings(set, state, shape, edgeId, (e) => withoutRelating(e, IS, x, y)); // an IS bar, the packet's
      else state.withdrawRolePair(edgeId, x, y); // an IS-instance, the pairing's
      return;
    }
    writeEdgeRelatings(set, state, shape, edgeId, (edge) => withoutRelating(edge, w.trim(), x, y));
  },
  withdrawRelatingAttempt: (edgeId) => {
    const relatingRefusals = { ...get().relatingRefusals };
    delete relatingRefusals[edgeId];
    set({ relatingRefusals });
  },
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
      edgeTauDrafts: state.edgeTauDrafts, // F3 — the word pairs given alone ride the file
      lexicon: state.lexicon, // B1 — the declared modes ride the file (the relatings ride the edges' packets inside `shapes`)
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
      // C-13b — workspaces saved before the christened mark existed: the stated heuristic, once, at import (src/lib/christening.ts)
      shapes: Object.fromEntries(Object.entries(importedWorkspace.shapes).map(([id, held]) => [id, migrateChristening(held)])),
      shapeOrder: importedWorkspace.shapeOrder,
      currentShapeId: importedWorkspace.currentShapeId,
      edgeTauDrafts: importedWorkspace.edgeTauDrafts ?? {}, // F3 — the file's word pairs given alone restored; the session's dropped (a file saved before F3 carries none)
      lexicon: importedWorkspace.lexicon ?? [], // B1 — the file's declared modes restored; the session's dropped (a file saved before B1 carries none)
      relatingRefusals: {},
      liftSelection: [],
      selectedCellId,
      selectedVertexId,
      selectedEdgeId: null,
      selectedFaceId: null,
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
    selectedFaceId: state.selectedFaceId,
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
  const selectedFaceId =
    shape && snapshot.selectedFaceId && shape.faces.some((face) => face.id === snapshot.selectedFaceId) ? snapshot.selectedFaceId : null;

  return {
    ...snapshot,
    selectedCellId,
    selectedVertexId,
    selectedFaceId,
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

// MODES-1 · B1: THE ONE WRITER of an edge's relatings (the packet, `edge.data.relatings`) — every act routes here; the
// module's pure `withRelating`/`withoutRelating` shape the packet, this site alone puts it on a shape.
function writeEdgeRelatings(set: (partial: Partial<GeometryState>) => void, state: GeometryState, shape: Shape, edgeId: EdgeId, change: (edge: Edge) => Edge): void {
  const edges = shape.edges.map((edge) => (edge.id === edgeId ? change(edge) : edge));
  set({ relatingRefusals: state.relatingRefusals, shapes: { ...state.shapes, [shape.id]: { ...shape, edges } } });
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

// C-7e (Δ84, 2026-09-22) — THE DRAFTS RIDE THE DISSECTION BY PAIR: `edgeTauDrafts` (a τ before the first role
// pair) and a pending `midpointRefusals` entry are keyed by edge id, and the ambo mints every edge of the new
// shape fresh (`makeEdgeId(shapeId, pair)`); the record itself is carried in ambo.ts, mirrored when the new edge
// is walked the other way — a pair reads first corner ↦ second, so a draft mirrors likewise. A draft is copied
// onto the new edge of the same pair; a pending attempt is RE-MADE there through the same check every act takes
// (the person's act is the input; its refusal is a reading — RECORD, NOT READING). The old keys stay: the gen-1
// shape keeps its record and its drafts alike. (A τ before the first role pair is the parked persistence price's
// own case — this makes it survive a dissection, not a reload.)
function carryDraftsByPair(set: Setter, get: Getter, from: Shape, to: Shape): void {
  const state = get();
  const byPair = new Map(from.edges.map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]));
  const edgeTauDrafts = { ...state.edgeTauDrafts };
  const midpointRemade = { ...state.midpointRemade };
  const pending: Array<[EdgeId, MidpointAct]> = [];
  for (const edge of to.edges) {
    const source = byPair.get(canonicalEdgeKey(...edge.vertexIds));
    if (!source) continue;
    const flip = <T,>([x, y]: [T, T]): [T, T] => (source.vertexIds[0] === edge.vertexIds[0] ? [x, y] : [y, x]);
    const draft = state.edgeTauDrafts[source.id];
    if (draft) edgeTauDrafts[edge.id] = draft.map(flip);
    const refusal = state.midpointRefusals[source.id];
    if (refusal) pending.push([edge.id, { kind: refusal.act.kind, pair: flip(refusal.act.pair) }]);
    const remade = state.midpointRemade[source.id]; // C-7f item 3 — the attribution rides with its pair
    if (remade) midpointRemade[edge.id] = { act: { kind: remade.act.kind, pair: flip(remade.act.pair) }, withdrawn: { kind: remade.withdrawn.kind, pair: flip(remade.withdrawn.pair) } };
  }
  set({ edgeTauDrafts, midpointRemade });
  for (const [edgeId, act] of pending) midpointAct(set, get, edgeId, act);
}

/** C-8 — the two ends of a seam RESOLVED, in the edge's own orientation (the record reads first ↦ second); null when either end holds no space */
function resolvedEnds(state: GeometryState, shape: Shape, edge: Edge): [Resolved, Resolved] | null {
  const options = { tauDrafts: state.edgeTauDrafts };
  const memo = new Map<VertexId, Resolved | null>();
  const A = spaceOf(shape, edge.vertexIds[0], options, memo);
  const B = spaceOf(shape, edge.vertexIds[1], options, memo);
  return A && B ? [A, B] : null;
}

/** the midpoint minted on an edge — the vertex whose two parents are its ends — when the shape holds it */
const midpointOf = (shape: Shape, edge: Edge): VertexId | null =>
  Object.values(shape.vertices).find((v) => v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(edge.vertexIds[0]) && v.createdBy.sourceVertexIds.includes(edge.vertexIds[1]))?.id ?? null;

/** C-8 item 4 — the born act an attempt on `edge` would break, as the refusal names it: its edge, its site, the generations between the two sites, the act, and why */
function dependencyOf(shape: Shape, edge: Edge, broken: BrokenBornAct): MidpointDependency {
  const here = midpointOf(shape, edge);
  const hereGen = here !== null ? generationOf(shape, here) : 1 + Math.max(generationOf(shape, edge.vertexIds[0]), generationOf(shape, edge.vertexIds[1]));
  const thereGen = broken.siteId !== null ? generationOf(shape, broken.siteId) : hereGen;
  return { edgeId: broken.edgeId, siteId: broken.siteId, generationsUp: thereGen - hereGen, act: { kind: broken.kind, pair: broken.pair }, names: broken.names, why: broken.why };
}

function midpointAct(set: Setter, get: Getter, edgeId: EdgeId, act: MidpointAct): void {
  const state = get();
  const shape = state.shapes[state.currentShapeId];
  const edge = shape?.edges.find((candidate) => candidate.id === edgeId);
  if (!shape || !edge) return;
  // C-8 item 1 — the two ends RESOLVED: a seed corner's cast, a born corner's space derived from its parents (never a
  // loaded file on a midpoint, Δ86); a seam whose ends do not both hold a space has no act
  const ends = resolvedEnds(state, shape, edge);
  if (!ends) return;
  const [RA, RB] = ends;
  const A = RA.space;
  const B = RB.space;
  const { roles, types } = midpointRecord(state, edge);
  const refuse = (form: string | undefined, conflicts: Conflict[], dependency?: MidpointDependency): void => {
    set({ midpointRefusals: { ...get().midpointRefusals, [edgeId]: { act, ...(form ? { form } : {}), conflicts, ...(dependency ? { dependency } : {}) } } });
  };
  // C-8 items 1 and 3 — the identity the SOLID fixes on this seam (nothing on a seed edge): the check runs over it and the
  // record never holds it; a pair colliding with it is refused by name — the composed identity is never entered, never
  // withdrawable, never a proposal
  const kind = edgeKind(shape, edge.vertexIds[0], edge.vertexIds[1]);
  const composed = kind === 'seed' ? null : composedOn(shape, RA, RB, [edge.vertexIds[0], edge.vertexIds[1]], kind);
  const cornerWords = (key: string): string => (composed?.corners.get(key) ?? []).map((id) => shape.vertices[id]?.data.label || id).join(' · ');
  let nextRoles = roles;
  let nextTypes = types;
  if (act.kind === 'role') {
    const [x, y] = act.pair;
    if (!A.roles.some((r) => r.id === x)) return refuse(`"${x}" is not a role this cast holds`, []);
    if (!B.roles.some((r) => r.id === y)) return refuse(`"${y}" is not a role that cast holds`, []);
    if (composed) {
      const cx = composed.roles.find(([a]) => a === x);
      if (cx) return refuse(`${nameIn(A, x)} is already one with ${nameIn(B, cx[1])} by the solid — composed · corner ${cornerWords(`0|${x}`)}; not yours to pair or withdraw`, []);
      const cy = composed.roles.find(([, b]) => b === y);
      if (cy) return refuse(`${nameIn(B, y)} is already one with ${nameIn(A, cy[0])} by the solid — composed · corner ${cornerWords(`1|${y}`)}; not yours to pair or withdraw`, []);
    }
    const px = roles.find(([a]) => a === x);
    if (px) return refuse(`${x} is already paired with ${px[1]} — one role, one partner`, []);
    const py = roles.find(([, b]) => b === y);
    if (py) return refuse(`${y} is already paired with ${py[0]} — one role, one partner`, []);
    // C-8c — THE STONE AT THE ACT (0031 §6 invariant 3): the class this pair would make holds two seed roles of ONE
    // corner ⇒ refused by name — the two seed roles by their own labels and their corner — nothing written
    const stone = stoneOn(RA, RB, x, y, 'role');
    if (stone) return refuse(stoneWords(shape, stone, `${nameIn(A, x)} ↦ ${nameIn(B, y)}`), []);
    nextRoles = [...roles, [x, y]];
  } else {
    const [s, w] = act.pair;
    const form = wordPairForm(A, B, s, w);
    if (form) return refuse(form, []);
    if (composed) {
      const cs = composed.words.find(([a]) => a === s);
      if (cs) return refuse(`${s} is already one word with ${cs[1]} by the solid — composed; not yours to translate or withdraw`, []);
      const cw = composed.words.find(([, b]) => b === w);
      if (cw) return refuse(`${w} is already one word with ${cw[0]} by the solid — composed; not yours to translate or withdraw`, []);
    }
    const ps = types.find(([a]) => a === s);
    if (ps) return refuse(`${s} is already translated to ${ps[1]} — one word, one translation`, []);
    const pw = types.find(([, b]) => b === w);
    if (pw) return refuse(`${w} is already the translation of ${pw[0]} — one word, one translation`, []);
    // C-8c — the stone on words: two seed words of ONE corner made one ⇒ refused by name
    const stone = stoneOn(RA, RB, s, w, 'word');
    if (stone) return refuse(stoneWords(shape, stone, `${s} ↦ ${w}`), []);
    nextTypes = [...types, [s, w]];
  }
  const conflicts = refusalOf(A, B, [...(composed ? composed.roles : []), ...nextRoles], [...(composed ? composed.words : []), ...nextTypes]);
  if (conflicts.length) return refuse(undefined, conflicts);
  // C-8 item 4 — THE DEPENDENCY REFUSAL: every born act elsewhere read again with this act's record as a CANDIDATE on this
  // edge (an option to the read, never a shape written or fabricated)
  const broken = brokenBornActs(shape, { tauDrafts: state.edgeTauDrafts, candidate: { edgeId, roles: nextRoles, types: nextTypes } }, edgeId);
  if (broken.length) return refuse(undefined, [], dependencyOf(shape, edge, broken[0]));
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
  // C-8 item 4 — a withdrawal that would BREAK a born act elsewhere is refused the same way: the born act rests on what this pair made
  const broken = brokenBornActs(shape, { tauDrafts: state.edgeTauDrafts, candidate: { edgeId, roles: nextRoles, types: nextTypes } }, edgeId);
  if (broken.length) {
    set({ midpointRefusals: { ...state.midpointRefusals, [edgeId]: { act: { ...act, withdrawal: true }, conflicts: [], dependency: dependencyOf(shape, edge, broken[0]) } } });
    return;
  }
  midpointWrite(set, state, shape, edge, nextRoles, nextTypes);
  // C-7f item 3 — the attribution of a re-made pair leaves with the pair
  const attributed = get().midpointRemade[edgeId];
  if (attributed && attributed.act.kind === act.kind && attributed.act.pair[0] === act.pair[0] && attributed.act.pair[1] === act.pair[1]) {
    const midpointRemade = { ...get().midpointRemade };
    delete midpointRemade[edgeId];
    set({ midpointRemade });
  }
  // a PENDING attempt is re-made: the person removed the half they judged wrong; the act they made stands to be made
  const pending = get().midpointRefusals[edgeId];
  if (pending) {
    const midpointRefusals = { ...get().midpointRefusals };
    delete midpointRefusals[edgeId];
    set({ midpointRefusals });
    midpointAct(set, get, edgeId, pending.act);
    // C-7f item 3 (the designer: "a pair that appears without a gesture is otherwise indistinguishable from a device-made
    // one") — when the re-made act was MADE (no refusal stands), the surface attributes it to the person's withdrawal
    if (get().midpointRefusals[edgeId] === undefined) set({ midpointRemade: { ...get().midpointRemade, [edgeId]: { act: pending.act, withdrawn: act } } });
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

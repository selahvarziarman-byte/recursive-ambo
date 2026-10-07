import {
  type ChangeEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { seedRegistry } from '../data/seeds';
import {
  getCellChildCount,
  getCellLifecycleStatus,
  getCellLifecycleStatusLabel,
  isCellActiveFrontier,
  type CellLifecycleStatus,
} from '../lib/cellLifecycle';
import {
  isDualViewSupportedCell,
  resolveDualInspectionTarget,
  type ResolvedDualInspectionTarget,
} from '../lib/dualView';
import { buildDiagonalizationMatrices } from '../lib/diagonalizationMatrix';
import { R1_RELAXATION_MARK } from '../lib/pyritohedralDiagonalization';
import {
  buildAtomicRegistryReport,
  type AtomicRegistryReport,
  type AtomicRegistryUnsupportedDetails,
} from '../lib/atomicRegistry';
import { buildGeneralSitePacketPresenterReport, type GeneralSitePacket } from '../lib/generalSitePacketPresenterV0';
import { buildSiteWitnessCatalogueV0, type SiteWitnesses } from '../lib/siteWitnessCatalogueV0';
import { defaultOperation, registeredOperations } from '../operations/registry';
import { formatVec3 } from '../lib/shape';
import {
  getTopologyFrontierRows,
  readinessWords,
  type CellTopologySignature,
  type TopologyFrontierGroup,
} from '../lib/topologySignature';
import { parseWorkspaceImport } from '../lib/workspacePersistence';
import { askServerHead, pageVersionLine } from '../lib/pageVersion';
import { downwardClosure, validateLiftSelection, type LiftSelection } from '../lib/subComplexLift';
import { openLiftReason } from '../lib/openLift'; // M12 (3) — the open-lift's own predicate gates its button
// TASK D (B-2026-08-23-C §5): the composer that exists — the face's D14
// name, shared with the aperture menu (never a second composer, never the id)
import { faceDisplayName } from '../manuscript/apertureModel';
// C-10b: the face's home reuses the Ambo's own face blocks; a dissected source face is named through the workspace's ancestry
import { BornFaceRecord, FaceRecord, faceCellsOf } from './MidpointSurface';
import { dissectedFaceWords, faceThroughAncestors } from './faceNames';
import {
  type DualInspectionTarget,
  type OperationHistoryEntry,
  useGeometryStore,
} from '../store/geometryStore';
import type {
  Cell,
  CellKind,
  EdgeId,
  Face,
  PacketLineage,
  PacketSourceRef,
  Shape,
  Vertex,
  VertexDataPacket,
  VertexId,
} from '../types/geometry';
import { DiagonalizationMatrixSection } from './DiagonalizationMatrixSection';
import { Panel } from './Panel';
import { Hint } from './HelpNote';
import { cellKindCountsWords, cellKindWord, cellWords, countNoun, faceSizesWords, historyWords, holdNoCastWords, holdNoSpaceWords, lineageModeWords, listWords, operationWords, positionWords, shapeWords, vertexDegreesWords, vertexRoleWords, withArticle } from './copyWords';
import { seedsUnder } from '../manuscript/liftedConceptModel'; // M10 — the seed corners under a midpoint, as the lifted card names them
import { GeneralSiteFacePanel } from './GeneralSiteFacePanel';
import { Layer3WitnessPanel } from './Layer3WitnessPanel';
import { SelectedVertexRelations } from './SelectedVertexRelations';
import { SiteWitnessTracePanel } from './SiteWitnessTracePanel';
import { VertexPacketEditorContent } from './VertexPacketEditor';
// C-6c (iv): the card reads a HELD cast — every number re-derived from it, never stored
import { castCounts, castMarks, castSummaryLine, notTakenAddresses, notTakenLine, orderingRows } from '../lib/castLoader';
import { holdsLoadedCast, isSeedVertex, spaceOf } from '../lib/spaceOf';
import { childSpaceOf, columnSpaceOf } from '../lib/instanceSpace'; // COPY-1 §7.5 — the vertex card's Space row is the CHILD's count, one reader with the midpoint's head
import { givenLabelOf } from '../lib/christening';
import type { ConceptSpace } from '../types/geometry';

type TopologyFilter =
  | 'all'
  | 'tetrahedron'
  | 'octahedron'
  | 'cube'
  | 'cuboctahedron'
  | 'pyritohedral-icosahedron'
  | 'dodecahedron'
  | 'square-pyramid'
  | 'rhombicuboctahedron'
  | 'rectified-square-pyramid'
  | 'rectified-square-pyramid-ambo-core'
  | 'other';

type OperabilityFilter = 'all' | 'operable' | 'disabled';
type PacketWorkbenchFilter =
  | 'unresolved-generated'
  | 'all'
  | 'generated-midpoints'
  | 'source'
  | 'empty'
  | 'named';
type PacketStatus = 'named' | 'annotated' | 'empty' | 'lineage-only';

interface WorkspaceCellRow {
  cell: Cell;
  id: string;
  shortId: string;
  topology: string;
  kind: CellKind;
  generationDepth: number;
  parentCellId: string | null;
  parentKnown: boolean;
  childCount: number;
  lifecycleStatus: CellLifecycleStatus;
  isOperable: boolean;
  disabledReason: string | null;
}

interface CellVertexRow {
  vertex: Vertex;
  displayLabel: string;
  role: string;
  packetDetail: string | null;
  lineageSummary: string;
}

interface CellFaceRow {
  face: Face;
  // TASK D (B-2026-08-23-C §5): the face's person-facing NAME — D14-composed
  // from its corners by the composer that exists (apertureModel's
  // faceDisplayName): rotate to the earliest corner label, run the face's
  // own cycle direction, `·`-join. NEVER the face id — the id rides the
  // demoted mono sub-line once; COPY-1 P1: the id line is gone.
  displayName: string;
  size: number;
  lineageSummary: string;
}

interface CellEdgeRow {
  id: string; // the canonical VERTEX-PAIR KEY — display/dedup identity, NOT an entity id
  // R1 THE LIFT: the row's REAL edge entity id — the only id the lift consumes.
  // null ⇔ no edge entity backs the pair (measured-dead on app-produced forms;
  // the type carries the branch honestly instead of a lying string).
  edgeId: EdgeId | null;
  vertexIds: [VertexId, VertexId];
  displayLabel: string;
  secondaryLabel: string | null;
  roleLabel: string | null;
}

interface PacketWorkbenchRow {
  vertex: Vertex;
  displayLabel: string;
  shortId: string;
  role: string;
  status: PacketStatus;
  containingCells: Cell[];
  containingCellCount: number;
  containingFaceCount: number;
  generationDepth: number | null;
  lineageSummary: string;
}

// COPY-1 §5.4 cells (P2): the shape filter's options as words
const topologyFilterOptions: Array<{ value: TopologyFilter; label: string }> = [
  { value: 'all', label: 'all' },
  { value: 'tetrahedron', label: 'tetrahedron' },
  { value: 'octahedron', label: 'octahedron' },
  { value: 'cube', label: 'cube' },
  { value: 'cuboctahedron', label: 'cuboctahedron' },
  { value: 'pyritohedral-icosahedron', label: 'pyritohedral icosahedron' },
  { value: 'dodecahedron', label: 'dodecahedron' },
  { value: 'square-pyramid', label: 'square pyramid' },
  { value: 'rhombicuboctahedron', label: 'rhombicuboctahedron' },
  { value: 'rectified-square-pyramid', label: 'rectified square pyramid' },
  {
    value: 'rectified-square-pyramid-ambo-core',
    label: 'rectified square pyramid (Ambo core)',
  },
  { value: 'other', label: 'other' },
];

// COPY-1 §5.4 casts & names: the names workbench's filter, in words
const packetFilterOptions: Array<{ value: PacketWorkbenchFilter; label: string }> = [
  { value: 'unresolved-generated', label: 'unnamed midpoints' },
  { value: 'all', label: 'all' },
  { value: 'generated-midpoints', label: 'midpoints' },
  { value: 'source', label: 'corners' },
  { value: 'empty', label: 'not named' },
  { value: 'named', label: 'named' },
];

/** COPY-1 §5.1 · LAYOUT-1 §3 — THE MAKING COLUMN (the left of the solid view, about 11% of the width): the seed, apply with its
 * status line, the lift region, the three lifts → Manuscript, reset. It has no ?; a disabled button's hint says what it waits for
 * (§6's table) and an enabled button carries no tooltip — its name says what it does. The notice under the lifts is ONE line, the
 * act's outcome, its kind carried as data (`done` | `refused`), never read off a word (COPY-1 §7.2). The refusals print the store's
 * and the libs' sentences as they are — those sentences are COPY-1 §5.1's now, and no prefix (`geometryStore:` …) exists to strip. */
export function MakingColumn() {
  const selectedSeedKey = useGeometryStore((state) => state.selectedSeedKey);
  const loadSeed = useGeometryStore((state) => state.loadSeed);
  const applyOperationToSelection = useGeometryStore((state) => state.applyOperationToSelection);
  const resetWorkspace = useGeometryStore((state) => state.resetWorkspace);
  const selectedCellId = useGeometryStore((state) => state.selectedCellId);
  const selectedVertexId = useGeometryStore((state) => state.selectedVertexId);
  const selectedEdgeId = useGeometryStore((state) => state.selectedEdgeId);
  const selectedFaceId = useGeometryStore((state) => state.selectedFaceId);
  const liftSelectionToManuscript = useGeometryStore((state) => state.liftSelectionToManuscript);
  const thickenLiftToManuscript = useGeometryStore((state) => state.thickenLiftToManuscript);
  const openLiftStarToManuscript = useGeometryStore((state) => state.openLiftStarToManuscript);
  const liftSelection = useGeometryStore((state) => state.liftSelection);
  const clearLiftSelection = useGeometryStore((state) => state.clearLiftSelection);
  const [notice, setNotice] = useState<{ kind: 'done' | 'refused'; text: string } | null>(null);
  const shape = useCurrentShape();
  const seeds = Object.values(seedRegistry);
  // M12 (4): an attempt is not a record — the next act clears a notice (an operation on the shape, a change of selection, a lift).
  // THE ACT'S OWN CHANGE IS NOT THE NEXT ACT (measured by the eye leg: a region lift clears the region, and the notice vanished with
  // it): the state the act left is recorded beside the notice, and only a change after it clears the notice.
  const noticeAt = useRef<string | null>(null);
  const selectionKey = (st: { currentShapeId: string; selectedCellId: string | null; selectedVertexId: string | null; selectedEdgeId: string | null; selectedFaceId: string | null; liftSelection: LiftSelection[] }): string =>
    JSON.stringify([st.currentShapeId, st.selectedCellId, st.selectedVertexId, st.selectedEdgeId, st.selectedFaceId, st.liftSelection]);
  useEffect(() => {
    const now = selectionKey({ currentShapeId: shape.id, selectedCellId, selectedVertexId, selectedEdgeId, selectedFaceId, liftSelection });
    if (noticeAt.current !== null && noticeAt.current === now) return;
    noticeAt.current = null;
    setNotice(null);
  }, [shape.id, selectedCellId, selectedVertexId, selectedEdgeId, selectedFaceId, liftSelection]);
  // the lift region: the running set + the LIVE connectivity verdict (the P1b validator over the auto-completed downward closure — it
  // can only ever refuse for disconnected; closure never refuses by construction); the reasons are the validator's own sentences
  const liftRegion = useMemo(() => {
    if (liftSelection.length === 0) return null;
    const counts = new Map<string, number>();
    for (const s of liftSelection) counts.set(s.kind, (counts.get(s.kind) ?? 0) + 1);
    const summary = [...counts.entries()].map(([kind, n]) => countNoun(n, kind, kind === 'vertex' ? 'vertices' : `${kind}s`)).join(' · ');
    try {
      const closure = downwardClosure(shape, liftSelection);
      return { summary, closure, reason: validateLiftSelection(shape, closure) };
    } catch (error) {
      return { summary, closure: null, reason: error instanceof Error ? error.message : String(error) };
    }
  }, [liftSelection, shape]);
  // THE GATES READ THE ACTS' OWN PREDICATES (MARKER LAYOUT-1 · M12 (3), ruled: one reader for the button and the act, never two
  // that can drift) — a button is disabled exactly when its act would refuse, and its hint is the reason the act would give:
  //   · the lift: a picked region's validator (`validateLiftSelection`), else the store's own list — a cell, a face, a vertex or an
  //     edge (a selected face lifts as itself, C-10b);
  //   · thicken: the same lift, then `thicken` — which refuses a form with a 3-cell, so a selection or a region holding a cell is
  //     refused before the click; its four hints are MARKER LAYOUT-1 · M14's (the designer's 11:27, §280), each matching its gate;
  //   · open-lift: the store's two sentences for a missing centre or cell, then the open-lift's own predicate (`openLiftReason`).
  const liftHint = liftRegion
    ? liftRegion.reason
    : selectedCellId || selectedVertexId || selectedEdgeId || selectedFaceId
      ? null
      : 'select a cell, a face, a vertex or an edge first, or shift-click a region';
  const liftDisabled = liftHint !== null;
  // MARKER LAYOUT-1 · M14 — thicken takes a vertex or an edge, or a region with no cell in it; four hints, each matching its gate (the
  // store's order: a region, else an edge, else a vertex, else the cell): a region holding a cell · a cell alone (the act's refusal is a
  // fact about dimension, so he has it before the click) · a face alone (M10 (2)) · nothing selected. A cell beside a vertex or an edge
  // thickens the vertex or the edge, and needs no hint. The act's own sentence (`this form has a 3-cell, …`) stays where the act prints it.
  const thickenHint = liftRegion
    ? liftRegion.reason ?? (liftSelection.some((s) => s.kind === 'cell') ? "thicken doesn't take a cell (it would be 4-dimensional): take the cells out of the region" : null)
    : selectedVertexId || selectedEdgeId
      ? null
      : selectedCellId
        ? "thicken doesn't take a cell (it would be 4-dimensional): select a vertex or an edge, or shift-click a region"
        : selectedFaceId
          ? "thicken doesn't take a face: select a vertex or an edge, or shift-click a region"
          : 'select a vertex or an edge first, or shift-click a region';
  const thickenDisabled = thickenHint !== null;
  const openLiftHint = useMemo(() => {
    if (!selectedVertexId && !selectedCellId) return 'select a skin cell and its star-centre midpoint first';
    if (!selectedVertexId) return "select the star's centre first (a midpoint)";
    if (!selectedCellId) return 'select the cell the star is read from first (for example the diagonalized core)';
    return openLiftReason(shape, selectedVertexId, selectedCellId).reason;
  }, [selectedCellId, selectedVertexId, shape]);
  const openLiftDisabled = openLiftHint !== null;
  const selectedCell = findCell(shape, selectedCellId);
  const operationContext = { shape, selectedCellId, selectedCell };
  const operationRows = registeredOperations.map((operation) => {
    const canApply = operation.canApply(operationContext);

    return {
      operation,
      canApply,
      status:
        operation.getStatusMessage?.(operationContext) ??
        operation.getDisabledReason(operationContext) ??
        operation.description,
    };
  });
  const availableOperationRows = operationRows.filter((row) => row.canApply);
  const visibleOperationRows = availableOperationRows.length
    ? availableOperationRows
    : operationRows.filter((row) => row.operation.id === defaultOperation.id);
  const primaryOperationRow = visibleOperationRows[0] ?? operationRows[0];
  const operationStatus =
    availableOperationRows.length > 1
      ? `${availableOperationRows.length} operations apply to this cell`
      : primaryOperationRow?.status;
  const act = (kind: 'lift' | 'thicken' | 'open-lift', run: () => string): void => {
    try {
      const title = run();
      noticeAt.current = selectionKey(useGeometryStore.getState());
      setNotice({
        kind: 'done',
        text:
          kind === 'lift'
            ? `lifted “${title}” to the Manuscript shelf`
            : kind === 'thicken'
              ? `thickened “${title}” and its parent circle, to the Manuscript shelf`
              : `open-lifted “${title}” to the Manuscript shelf`,
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      noticeAt.current = selectionKey(useGeometryStore.getState());
      setNotice({ kind: 'refused', text: `${kind === 'thicken' ? 'not thickened' : 'not lifted'} — ${reason}` });
    }
  };
  const liftButton =
    'h-9 w-full rounded border border-stone-600 bg-stone-900 px-2 text-left text-xs font-semibold text-stone-100 transition hover:border-stone-400 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:cursor-not-allowed disabled:border-stone-700 disabled:bg-stone-800 disabled:text-stone-500';
  // a disabled button under its hint (LAYOUT-1 §6: what it is waiting for); an enabled one bare
  const gated = (disabled: boolean, hint: string, node: ReactNode): ReactNode =>
    disabled && hint ? (
      <Hint text={hint} className="block w-full">
        {node}
      </Hint>
    ) : (
      node
    );

  return (
    <div data-ambo-making="true" className="grid gap-3 px-3 py-3">
      <div className="grid gap-1">
        <p className="text-xs text-stone-500">seed</p>
        <label className="grid gap-1 text-xs text-stone-400">
          shape
          <select
            value={selectedSeedKey}
            onChange={(event) => loadSeed(event.target.value)}
            data-ambo-seed="true"
            className="h-9 rounded border border-stone-700 bg-stone-950 px-2 text-xs text-stone-100 outline-none focus:border-teal-400"
          >
            {seeds.map((seed) => (
              <option key={seed.key} value={seed.key}>
                {seed.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-2">
        {/* M12 (5): the status line under the button already says why it waits — no hint doubles it */}
        {visibleOperationRows.map(({ operation, canApply }) => (
          <div key={operation.id}>
            {gated(
              false,
              '',
              <button
                type="button"
                data-ambo-apply={operation.id}
                onClick={() => applyOperationToSelection(operation.id)}
                disabled={!canApply}
                className="h-9 w-full rounded border border-amber-500/70 bg-amber-400 px-2 text-left text-xs font-semibold text-stone-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:cursor-not-allowed disabled:border-stone-700 disabled:bg-stone-800 disabled:text-stone-500"
              >
                apply {operation.label}
              </button>,
            )}
          </div>
        ))}
        <p data-ambo-operation-status="true" className="text-xs leading-5 text-stone-400">
          {operationStatus}
        </p>
      </div>
      {liftRegion ? (
        <div data-ambo-lift-region="true" className="rounded border border-emerald-700/50 bg-stone-900 px-2 py-2 text-xs">
          <span className="flex items-center justify-between gap-2">
            <span className="font-semibold text-emerald-300">lift region: {liftRegion.summary}</span>
            <button
              type="button"
              onClick={clearLiftSelection}
              className="shrink-0 rounded border border-stone-600 px-2 py-0.5 text-xs text-stone-300 transition hover:border-stone-400 hover:text-stone-100"
            >
              clear
            </button>
          </span>
          {liftRegion.reason ? (
            <span data-ambo-lift-region-refusal="true" className="mt-1.5 block leading-4 text-rose-300">
              {liftRegion.reason}
            </span>
          ) : liftRegion.closure ? (
            <span data-ambo-lift-region-closure="true" className="mt-1.5 block leading-4 text-stone-400">
              {closureWords(liftRegion.closure)}
            </span>
          ) : null}
        </div>
      ) : null}
      {/* P1b — the granular ambo→manuscript save: lift the selection's downward closure onto the Manuscript shelf (ADR 0010; the
          ambo original is never mutated). Multi-region: shift-click faces/vertices on the solid (shift+alt = whole cell) and face/edge
          rows in the selection drawer to build a REGION; empty region = the single selection fallback. */}
      {gated(
        liftDisabled,
        liftHint ?? '',
        <button
          type="button"
          data-ambo-lift="true"
          onClick={() => act('lift', liftSelectionToManuscript)}
          disabled={liftDisabled}
          className={liftButton}
        >
          lift {liftRegion ? 'region' : 'selection'} → Manuscript
        </button>,
      )}
      {/* THICKEN (A.1 rung 1) — the lifted selection × I: the band that remembers being their circle */}
      {gated(
        thickenDisabled,
        thickenHint ?? '',
        <button
          type="button"
          data-ambo-thicken="true"
          onClick={() => act('thicken', thickenLiftToManuscript)}
          disabled={thickenDisabled}
          className={liftButton}
        >
          thicken {liftRegion ? 'region' : 'selection'} × I → Manuscript
        </button>,
      )}
      {/* DOOR 3 (SEAL_OPEN_STAR_EXTRACTOR): the open-lift word — the selected midpoint's star, read off the selected cell's skin,
          extracted OPEN (the rim stays free) onto the shelf */}
      {gated(
        openLiftDisabled,
        openLiftHint ?? '',
        <button
          type="button"
          data-ambo-open-lift="true"
          onClick={() => act('open-lift', openLiftStarToManuscript)}
          disabled={openLiftDisabled}
          className={liftButton}
        >
          open-lift star → Manuscript
        </button>,
      )}
      {notice ? (
        <p data-ambo-lift-notice={notice.kind} className={`text-xs leading-4 ${notice.kind === 'refused' ? 'text-rose-300' : 'text-stone-400'}`}>
          {notice.text}
        </p>
      ) : null}
      <button
        type="button"
        data-ambo-reset="true"
        onClick={resetWorkspace}
        className="mt-1 h-9 w-full rounded border border-stone-700 bg-stone-900 px-2 text-left text-xs font-semibold text-stone-100 transition hover:border-stone-500 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500"
      >
        reset
      </button>
    </div>
  );
}

/** COPY-1 §5.1 — the region's closure in one sentence: `connected; it closes to 6 vertices, 12 edges, 8 faces and 1 cell` (a count of
 * nothing is not listed) */
function closureWords(closure: ReturnType<typeof downwardClosure>): string {
  const parts = [
    countNoun(closure.vertexIds.length, 'vertex', 'vertices'),
    ...(closure.edgeIds.length ? [countNoun(closure.edgeIds.length, 'edge')] : []),
    ...(closure.faceIds.length ? [countNoun(closure.faceIds.length, 'face')] : []),
    ...(closure.cellIds.length ? [countNoun(closure.cellIds.length, 'cell')] : []),
  ];
  return `connected; it closes to ${listWords(parts)}`;
}

/** COPY-1 §5.4 **view** · LAYOUT-1 §3 — the view drawer: core, residue and parent cells, the dual view, field samples, explode, reset
 * view (the labels by P6) */
export function ViewPanel() {
  const cellVisibility = useGeometryStore((state) => state.cellVisibility);
  const explodeAmount = useGeometryStore((state) => state.viewLayout.explodeAmount);
  const dualViewEnabled = useGeometryStore((state) => state.viewLayout.dualViewEnabled);
  const showFieldAtlasSamples = useGeometryStore((state) => state.viewLayout.showFieldAtlasSamples);
  const toggleCellVisibility = useGeometryStore((state) => state.toggleCellVisibility);
  const setExplodeAmount = useGeometryStore((state) => state.setExplodeAmount);
  const toggleDualView = useGeometryStore((state) => state.toggleDualView);
  const toggleFieldAtlasSamples = useGeometryStore((state) => state.toggleFieldAtlasSamples);
  const resetViewLayout = useGeometryStore((state) => state.resetViewLayout);
  const toggle = (label: string, checked: boolean, onChange: () => void, accent: string): ReactNode => (
    <label key={label} className="flex items-center justify-between gap-3 text-sm text-stone-300">
      {label}
      <input type="checkbox" checked={checked} onChange={onChange} className={`h-4 w-4 ${accent}`} />
    </label>
  );

  return (
    <div data-ambo-view-panel="true" className="grid gap-2 px-4 py-3">
      {toggle('core cells', cellVisibility.showCoreCells, () => toggleCellVisibility('showCoreCells'), 'accent-cyan-300')}
      {toggle('residue cells', cellVisibility.showResidueCells, () => toggleCellVisibility('showResidueCells'), 'accent-amber-300')}
      {toggle('parent cells', cellVisibility.showParentCells, () => toggleCellVisibility('showParentCells'), 'accent-stone-300')}
      <div className="grid gap-2 border-t border-stone-800 pt-3">
        {toggle('dual view', dualViewEnabled, toggleDualView, 'accent-violet-300')}
        {toggle('field samples', showFieldAtlasSamples, toggleFieldAtlasSamples, 'accent-emerald-300')}
        <label className="grid gap-2 text-sm text-stone-300">
          <span className="flex items-center justify-between gap-3">
            explode
            <span className="font-mono text-xs text-stone-500">{Math.round(explodeAmount * 100)}</span>
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(explodeAmount * 100)}
            onChange={(event) => setExplodeAmount(Number(event.target.value) / 100)}
            className="w-full accent-teal-300"
          />
        </label>
        <button
          type="button"
          onClick={resetViewLayout}
          className="h-9 w-full rounded border border-stone-700 bg-stone-900 px-3 text-left text-sm text-stone-200 transition hover:border-stone-500 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500"
        >
          reset view
        </button>
      </div>
    </div>
  );
}

// STAMP USE-2 (2026-09-25) — THE PAGE SAYS WHICH VERSION IT RUNS: the version it was loaded from, asked of /__whereami
// ONCE when this panel mounts (a reload remounts it, so the label is the load's by construction; the meaning and the
// measurement are in src/lib/pageVersion.ts). Nothing here polls, listens or reloads: the stamp's item 2 — a line for a
// page left running across a release — was built and CUT before landing on Arman's ruling (2026-09-25 20:54): that page
// is implementation scaffolding, worked around by halting the use while the coder works. The label stays because a
// reader of the PAGE needs what the page runs, and a label that ever differs from /__whereami is that rule's falsifier.
function usePageHead(): string | null {
  const [pageHead, setPageHead] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    void askServerHead().then((head) => {
      if (alive) setPageHead(head);
    });
    return () => {
      alive = false;
    };
  }, []);

  return pageHead;
}

function PageVersionLine() {
  const pageHead = usePageHead();

  // M10 (4) — the line's place is held while the answer comes (~1.5 s): a hidden, aria-hidden ghost of the line's height, so the
  // drawer's rows below do not jump when it arrives; where the server never answers, nothing visible stands (the true absence)
  if (pageHead === null) {
    return <p aria-hidden="true" data-page-version-ghost="true" className="mt-2 text-xs leading-5 text-stone-500" style={{ visibility: 'hidden' }}>this page</p>;
  }

  return (
    <p data-page-version="true" className="mt-2 text-xs leading-5 text-stone-500">
      {pageVersionLine(pageHead)}
    </p>
  );
}

/** COPY-1 §5.4 **save & history** — export, import and the page's version line. The outcome is ONE line whose kind rides as data
 * (`data-workspace-status`): `exported` · `imported` · `imported · 2 items not taken: …` (what the import did not take, item by item,
 * by name — MODES-4 · M4, the cast card's own line) · `not imported — …` · `not exported — …` (COPY-1 rule 8). */
function WorkspacePersistenceControls() {
  const exportWorkspace = useGeometryStore((state) => state.exportWorkspace);
  const importWorkspace = useGeometryStore((state) => state.importWorkspace);
  const [status, setStatus] = useState<{ kind: 'success' | 'error'; message: string } | null>(null);
  const importInputRef = useRef<HTMLInputElement | null>(null); // C-14g · M1 — the import input opened by its button through a ref, as the cast input is

  function handleExport() {
    try {
      const workspace = exportWorkspace();
      const blob = new Blob([JSON.stringify(workspace, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `platonic-engine-workspace-${formatWorkspaceTimestamp(new Date())}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setStatus({ kind: 'success', message: 'exported' });
    } catch (error) {
      setStatus({ kind: 'error', message: `not exported — ${refusalWords(error)}` });
    }
  }

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsedJson = JSON.parse(text);
      const workspace = parseWorkspaceImport(parsedJson);

      const notTaken = importWorkspace(workspace);
      setStatus({ kind: 'success', message: notTaken.length ? `imported · ${notTakenLine(notTaken)}` : 'imported' });
    } catch (error) {
      setStatus({ kind: 'error', message: `not imported — ${refusalWords(error)}` });
    } finally {
      input.value = '';
    }
  }

  return (
    <div className="grid gap-3">
      <h3 className="text-xs text-stone-500">
        save & load
      </h3>
      <PageVersionLine />
      <div className="grid gap-2">
        <button
          type="button"
          data-workspace-export="true"
          onClick={handleExport}
          className="h-9 w-full rounded border border-stone-700 bg-stone-900 px-3 text-left text-sm text-stone-100 transition hover:border-stone-500 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500"
        >
          export workspace (.json)
        </button>
        {/* C-14g · M1 — THE IMPORT INPUT BY THE CAST INPUT'S CONSTRUCTION: a button, and a hidden input with `data-workspace-import-input`,
            always mounted with its panel and opened through a ref — an automation sets files by the attribute, a person clicks the button */}
        <button
          type="button"
          data-workspace-import="true"
          onClick={() => importInputRef.current?.click()}
          className="h-9 w-full rounded border border-stone-700 bg-stone-900 px-3 text-left text-sm text-stone-100 transition hover:border-stone-500 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500"
        >
          import workspace (.json)
        </button>
        <input
          ref={importInputRef}
          type="file"
          accept=".json,application/json"
          data-workspace-import-input="true"
          className="hidden"
          onChange={handleImport}
        />
      </div>
      {status ? (
        <p
          data-workspace-status={status.kind}
          className={`text-sm leading-5 ${
            status.kind === 'error' ? 'text-red-300' : 'text-stone-400'
          }`}
        >
          {status.message}
        </p>
      ) : null}
    </div>
  );
}

/** COPY-1 §5.4 — a refusal's reason in words: a file that is not JSON gives the browser's own message after the sentence; the
 * validator's sentences (workspacePersistence) ride as they are, several joined by ` · ` */
function refusalWords(error: unknown): string {
  if (error instanceof SyntaxError) return `the file isn't valid JSON (${error.message})`;
  const message = error instanceof Error ? error.message : String(error);
  return message.split('\n').filter(Boolean).join(' · ');
}

export function ObjectInspector() {
  const shape = useCurrentShape();
  const selectedCellId = useGeometryStore((state) => state.selectedCellId);
  const selectedVertexId = useGeometryStore((state) => state.selectedVertexId);
  const selectedEdgeId = useGeometryStore((state) => state.selectedEdgeId);
  const dualViewEnabled = useGeometryStore((state) => state.viewLayout.dualViewEnabled);
  const vertex = selectedVertexId ? shape.vertices[selectedVertexId] : null;
  // GAP2A PARITY — the minimal edge read (rich class/role content deferred)
  const selectedEdge = selectedEdgeId
    ? shape.edges.find((edge) => edge.id === selectedEdgeId) ?? null
    : null;
  const selectedCell = findCell(shape, selectedCellId);
  const selectedVertexCells = selectedVertexId
    ? shape.cells.filter((cell) => cell.vertexIds.includes(selectedVertexId))
    : [];
  const cellCounts = countCellsByKind(shape);

  return (
    <Panel title="Object Inspector">
      <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
        <dt className="text-stone-500">Shape</dt>
        <dd className="truncate text-stone-200">{shape.name}</dd>
        <dt className="text-stone-500">Shape ID</dt>
        <dd className="break-all font-mono text-xs text-stone-300">{shape.id}</dd>
        <dt className="text-stone-500">Operation</dt>
        <dd className="text-stone-200">{shape.genealogy.operation}</dd>
        <dt className="text-stone-500">Parent</dt>
        <dd className="break-all font-mono text-xs text-stone-300">
          {shape.genealogy.parentShapeId ?? 'none'}
        </dd>
        <dt className="text-stone-500">Cells</dt>
        <dd className="text-stone-200">{formatCellCounts(cellCounts)}</dd>
      </dl>

      <div className="mt-4 border-t border-stone-800 pt-4">
        {selectedCell ? (
          <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
            <dt className="text-stone-500">Cell</dt>
            <dd className="break-all font-mono text-xs text-stone-300">{selectedCell.id}</dd>
            <dt className="text-stone-500">Kind</dt>
            <dd className="text-stone-200">{selectedCell.kind}</dd>
            <dt className="text-stone-500">Topology</dt>
            <dd className="text-stone-200">{describeCellTopology(selectedCell)}</dd>
            <dt className="text-stone-500">Generation</dt>
            <dd className="text-stone-200">{selectedCell.generationDepth}</dd>
            <dt className="text-stone-500">Parent cell</dt>
            <dd className="break-all font-mono text-xs text-stone-300">
              {selectedCell.parentCellId ?? 'none'}
            </dd>
            <dt className="text-stone-500">Source op</dt>
            <dd className="text-stone-200">{selectedCell.sourceOperation}</dd>
            {dualViewEnabled ? (
              <>
                <dt className="text-stone-500">View</dt>
                <dd className="text-stone-200">
                  {isDualViewSupportedCell(shape, selectedCell)
                    ? 'Dual View active: displaying dual proxy'
                    : 'Dual View active: original shown dimmed'}
                </dd>
              </>
            ) : null}
          </dl>
        ) : (
          <p className="text-sm text-stone-500">Click a cell in the workspace to inspect it.</p>
        )}
      </div>

      <div className="mt-4 border-t border-stone-800 pt-4">
        {vertex ? (
          <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
            <dt className="text-stone-500">Vertex</dt>
            <dd className="break-all font-mono text-xs text-stone-300">{vertex.id}</dd>
            <dt className="text-stone-500">Position</dt>
            <dd className="font-mono text-xs text-stone-300">{formatVec3(vertex.position)}</dd>
            <dt className="text-stone-500">Created by</dt>
            <dd className="text-stone-200">{vertex.createdBy.operation}</dd>
            <dt className="text-stone-500">Sources</dt>
            <dd className="break-all font-mono text-xs text-stone-300">
              {vertex.createdBy.sourceVertexIds.length
                ? vertex.createdBy.sourceVertexIds.join(', ')
                : 'none'}
            </dd>
            <dt className="text-stone-500">Cell roles</dt>
            <dd className="text-stone-200">
              {selectedVertexCells.length
                ? selectedVertexCells.map((cell) => cell.kind).join(', ')
                : 'none'}
            </dd>
          </dl>
        ) : (
          <p className="text-sm text-stone-500">Click a vertex in the workspace to inspect it.</p>
        )}
      </div>

      {selectedEdge ? (
        <div className="mt-4 border-t border-stone-800 pt-4">
          <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
            <dt className="text-stone-500">Edge</dt>
            <dd className="break-all font-mono text-xs text-stone-300">{selectedEdge.id}</dd>
            <dt className="text-stone-500">Vertices</dt>
            <dd className="break-all font-mono text-xs text-stone-300">
              {selectedEdge.vertexIds.join(' - ')}
            </dd>
            <dt className="text-stone-500">Liftable</dt>
            <dd className="text-stone-200">yes — lifts to a V2 E1 F0 segment</dd>
          </dl>
        </div>
      ) : null}
    </Panel>
  );
}

/** COPY-1 §5.4 **save & history** · LAYOUT-1 §3 — the drawer: export, import, undo, redo, and the history list (`history` · `undone`) */
export function SaveAndHistoryPanel() {
  const undoWorkspace = useGeometryStore((state) => state.undoWorkspace);
  const redoWorkspace = useGeometryStore((state) => state.redoWorkspace);
  const canUndo = useGeometryStore((state) => state.undoStack.length > 0);
  const canRedo = useGeometryStore((state) => state.redoStack.length > 0);
  const operationHistory = useGeometryStore((state) => state.operationHistory);
  const redoOperationHistory = useGeometryStore((state) => state.redoOperationHistory);
  const historyButton =
    'h-9 rounded border border-stone-700 bg-stone-900 px-3 text-sm font-semibold text-stone-100 transition hover:border-stone-500 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500 disabled:cursor-not-allowed disabled:border-stone-800 disabled:bg-stone-950 disabled:text-stone-600';

  return (
    <section data-ambo-history-panel="true" className="grid gap-4 px-4 py-3">
      <WorkspacePersistenceControls />
      <div className="grid grid-cols-2 gap-2 border-t border-stone-800 pt-4">
        <button type="button" data-history-undo="true" onClick={undoWorkspace} disabled={!canUndo} className={historyButton}>
          undo
        </button>
        <button type="button" data-history-redo="true" onClick={redoWorkspace} disabled={!canRedo} className={historyButton}>
          redo
        </button>
      </div>
      <div>
        <h2 className="text-xs text-stone-500">history</h2>
        <div className="mt-2">
          <OperationHistoryList entries={operationHistory} />
        </div>
      </div>
      {redoOperationHistory.length ? (
        <div className="border-t border-stone-800 pt-4">
          <h2 className="text-xs text-stone-500">undone</h2>
          <div className="mt-2">
            <OperationHistoryList entries={redoOperationHistory} isRedoBranch />
          </div>
        </div>
      ) : null}
    </section>
  );
}

/** COPY-1 §5.4 **cells** · LAYOUT-1 §3 — the cells drawer: the cells by shape and state, Ambo by shape, the genealogy */
export function WorkspacePanel() {
  const shape = useCurrentShape();

  return (
    <section className="grid gap-4 p-4">
      <WorkspaceTopologyContent />
      <AmboSupportFrontier />
      {/* C-12a item 3 (§144, Δ95) — THE WAY BACK: the genealogy stood defined and mounted nowhere; a person who dissected twice
          could not return to gen 1. Every shape of the session, the current one marked; choosing an earlier one makes it current
          (`selectShape` — measured: it keeps only the selections the chosen shape holds, clears the lift set and the inspection). */}
      <GenealogyViewer />
    </section>
  );
}

/** C-10b (§131 item 2, the designer's blocker — the interior face 3,900 px down): THE FACE'S HOME. A selected face's reading is
 * printed ONCE, here — reached his way (explode, point at the face and click), by the parts' face rows, or by the line at a midpoint
 * site. In COPY-1 §5.4's words: `face A·B·C·D has 4 corners; only three-cornered faces are read so far` · `face A·B·C, a seed face` ·
 * `face A·AB·AC, the corner cell's own` (M1: that face reads through the one monodromy like every born face — the old clause `every role returns to itself`
 * is gone) · then the seed face's reading (§4.7) or a born face's (§5.4). The hands are ACTS here (the Ambo's own store). */
export function SelectedFaceReading({ shape, faceId }: { shape: Shape; faceId: string }) {
  const face = shape.faces.find((f) => f.id === faceId);
  if (!face) return null;
  const name = getPacketDataDisplayLabel(face.data) ?? faceDisplayName(shape, face, () => 'unnamed');
  if (face.vertexIds.length !== 3) {
    return (
      <p data-face-home={name} data-face-home-kind="not-a-triangle" className="text-xs text-stone-400">
        {`face ${name} has ${countNoun(face.vertexIds.length, 'corner')}; only three-cornered faces are read so far`}
      </p>
    );
  }
  const cycle = [face.vertexIds[0], face.vertexIds[1], face.vertexIds[2]] as [VertexId, VertexId, VertexId];
  const seeds = cycle.every((v) => isSeedVertex(shape, v));
  const words = faceCellsOf(shape, face.id, cycle);
  const kind = seeds ? 'seed' : words.cornerCellFace ? 'corner-cell' : words.other ? 'interior' : 'one-cell';
  return (
    <div data-face-home={name} data-face-home-kind={kind} className="grid gap-1 text-xs text-stone-400">
      <p data-face-home-head="true" className="text-stone-200">
        {/* M1 (THE-THIRD-RESOLUTION): the corner cell's own face reads through the one monodromy like every born face — its old
            `every role at its corner returns to itself` was the identity regime's leftovers, not the transport's reading */}
        {seeds ? `face ${name}, a seed face` : `face ${name}, ${words.kindWords}`}
      </p>
      {seeds ? (
        <FaceRecord shape={shape} cycle={cycle} faceName={name} here={null} />
      ) : (
        <BornFaceRecord shape={shape} cycle={cycle} faceName={name} faceId={face.id} here={null} />
      )}
    </div>
  );
}

/** COPY-1 §5.4 **selection** · LAYOUT-1 §3 — the selection drawer, all of today's Selection tab: the chips lowercase (P6), the
 * sections by their names, the trace section only when it has content */
export function SelectionPanel() {
  const shape = useCurrentShape();
  const selectedCellId = useGeometryStore((state) => state.selectedCellId);
  const selectedVertexId = useGeometryStore((state) => state.selectedVertexId);
  const selectedFaceId = useGeometryStore((state) => state.selectedFaceId); // C-10b
  const selectedFace = selectedFaceId ? shape.faces.find((f) => f.id === selectedFaceId) ?? null : null;
  const dualInspectionTarget = useGeometryStore((state) => state.dualInspectionTarget);
  const dualViewEnabled = useGeometryStore((state) => state.viewLayout.dualViewEnabled);
  const isolateSelectedCell = useGeometryStore((state) => state.viewLayout.isolateSelectedCell);
  const toggleIsolateSelectedCell = useGeometryStore((state) => state.toggleIsolateSelectedCell);
  const selectedCell = findCell(shape, selectedCellId);
  const vertex = selectedVertexId ? shape.vertices[selectedVertexId] : null;
  const rows = useMemo(() => getWorkspaceCellRows(shape), [shape]);
  const selectedCellRow = selectedCell ? rows.find((row) => row.id === selectedCell.id) ?? null : null;
  const selectedCellFaces = useMemo(
    () => (selectedCell ? getCellFaces(shape, selectedCell) : []),
    [selectedCell, shape],
  );
  const selectedCellEdges = useMemo(
    () => (selectedCell ? getCellEdges(shape, selectedCell) : []),
    [selectedCell, shape],
  );
  const diagonalizationMatrices = useMemo(
    () => buildDiagonalizationMatrices(shape, selectedCell),
    [selectedCell, shape],
  );
  const atomicRegistryReport = useMemo(
    () => (selectedVertexId ? buildAtomicRegistryReport(shape, selectedVertexId) : null),
    [selectedVertexId, shape],
  );
  const presenterReport = useMemo(() => buildGeneralSitePacketPresenterReport(shape), [shape]);
  const sitePacket = useMemo<GeneralSitePacket | null>(
    () =>
      selectedVertexId
        ? presenterReport.packets.find((packet) => packet.trace.siteId === selectedVertexId) ?? null
        : null,
    [presenterReport, selectedVertexId],
  );
  const witnessReport = useMemo(() => buildSiteWitnessCatalogueV0(shape), [shape]);
  const siteWitness = useMemo<SiteWitnesses | null>(
    () =>
      selectedVertexId
        ? witnessReport.sites.find((s) => s.siteId === selectedVertexId) ?? null
        : null,
    [witnessReport, selectedVertexId],
  );
  const sectionIndexEntries: SelectionSectionIndexEntry[] = [];

  if (dualInspectionTarget) {
    sectionIndexEntries.push({
      id: 'selection-dual-inspection',
      label: dualInspectionTarget.modelKind === 'correspondence' ? 'dual correspondence' : 'dual universe',
    });
  }

  if (selectedCell) {
    sectionIndexEntries.push({ id: 'selection-cell', label: 'cell' });
  }

  if (selectedFace) {
    sectionIndexEntries.push({ id: 'selection-face-home', label: 'face' }); // C-10b: the face's home
  }

  if (vertex) {
    sectionIndexEntries.push({ id: 'selection-vertex', label: 'vertex' });
    if (sitePacket) {
      sectionIndexEntries.push({ id: 'selection-face', label: 'site' });
      if (siteWitness) sectionIndexEntries.push({ id: 'selection-trace', label: 'trace' });
    }
    sectionIndexEntries.push(
      { id: 'selection-atomic-registry', label: 'atomic registry' },
      { id: 'selection-packet', label: 'name & notes' },
    );
  }

  sectionIndexEntries.push({ id: 'selection-layer3-witness', label: 'layer 3 witness' });

  if (selectedCellRow) {
    sectionIndexEntries.push({ id: 'selection-lineage', label: 'lineage' });
  }

  if (diagonalizationMatrices.length) {
    sectionIndexEntries.push({ id: 'selection-matrix', label: 'diagonalization matrix' });
  }

  if (selectedCell) {
    sectionIndexEntries.push({ id: 'selection-composition', label: 'parts' });
  }

  return (
    <section className="grid gap-4 p-4">
      <div id="selection-current-focus" className="scroll-mt-4">
        <CurrentFocusCard
          shape={shape}
          dualInspectionTarget={dualInspectionTarget}
          selectedCell={selectedCell}
          selectedVertex={vertex}
        />
      </div>
      <SelectionSectionIndex entries={sectionIndexEntries} />

      {dualInspectionTarget ? (
        <SidebarSection
          id="selection-dual-inspection"
          title={
            dualInspectionTarget.modelKind === 'correspondence'
              ? 'dual correspondence'
              : 'dual universe'
          }
          defaultOpen
          resetKey={getDualInspectionTargetId(dualInspectionTarget)}
        >
          <DualUniverseInspectionSection />
        </SidebarSection>
      ) : null}

      {selectedCell && selectedCellRow ? (
        <SidebarSection
          id="selection-cell"
          title="cell"
          defaultOpen
          resetKey={selectedCell.id}
        >
          <div className="grid gap-3">
            <SelectedCellSummary
              row={selectedCellRow}
              rows={rows}
              faceCount={selectedCellFaces.length}
              vertexCount={selectedCell.vertexIds.length}
              edgeCount={selectedCellEdges.length}
              dualViewEnabled={dualViewEnabled}
              shape={shape}
            />
            <label className="flex items-center justify-between gap-3 rounded border border-stone-800 bg-stone-950 px-3 py-2 text-sm text-stone-300">
              isolate this cell
              <input
                type="checkbox"
                checked={isolateSelectedCell}
                onChange={toggleIsolateSelectedCell}
                disabled={!selectedCell}
                className="h-4 w-4 accent-amber-300 disabled:opacity-50"
              />
            </label>
          </div>
        </SidebarSection>
      ) : null}

      {selectedFace ? (
        // C-10b (§131 item 2): THE FACE'S HOME — the selected face's reading, printed once, here
        <SidebarSection id="selection-face-home" title="face" defaultOpen resetKey={selectedFace.id}>
          <SelectedFaceReading shape={shape} faceId={selectedFace.id} />
        </SidebarSection>
      ) : null}

      {vertex ? (
        <SidebarSection
          id="selection-vertex"
          title="vertex"
          defaultOpen
          resetKey={vertex.id}
        >
          <SelectedVertexSummary
            vertexId={vertex.id}
            shape={shape}
            selectedCell={selectedCell}
          />
        </SidebarSection>
      ) : null}

      {vertex && sitePacket ? (
        <SidebarSection id="selection-face" title="site" defaultOpen resetKey={vertex.id}>
          <GeneralSiteFacePanel packet={sitePacket} />
        </SidebarSection>
      ) : null}

      {/* COPY-1 §5.4 trace: the section shows when it has content — `Structural trace — reserved. Not yet derived.` is gone */}
      {vertex && sitePacket && siteWitness ? (
        <SidebarSection id="selection-trace" title="trace" defaultOpen={false} resetKey={vertex.id}>
          <SiteWitnessTracePanel witness={siteWitness} />
        </SidebarSection>
      ) : null}

      {/* C-7c (2026-09-22, Δ80): the `J Register` (C-6d (β)/(γ)) is UNMOUNTED — its offering
          was retired as a surface, its one unique path (a J at a g0 edge before the ambo)
          does not reach the ambo shape, and one record wearing two sentences was the defect
          class. The module and its file stay on disk; the act now lives at the midpoint on
          the canvas (the unfolded midpoint). The Layer 3 Witness below is untouched. */}
      <SidebarSection
        id="selection-layer3-witness"
        title="layer 3 witness"
        defaultOpen
        resetKey="committed-witness-form"
      >
        <Layer3WitnessPanel />
      </SidebarSection>

      {vertex && atomicRegistryReport ? (
        <SidebarSection
          id="selection-atomic-registry"
          title="atomic registry"
          defaultOpen
          resetKey={vertex.id}
        >
          <AtomicRegistryLens shape={shape} report={atomicRegistryReport} />
        </SidebarSection>
      ) : null}

      {vertex ? (
        <SidebarSection
          id="selection-packet"
          title="name & notes"
          defaultOpen
          resetKey={vertex.id}
        >
          <VertexPacketEditorContent />
        </SidebarSection>
      ) : null}

      {selectedCellRow ? (
        <SidebarSection
          id="selection-lineage"
          title="lineage"
          defaultOpen={false}
          resetKey={selectedCellRow.id}
        >
          <CellLineageNavigation row={selectedCellRow} rows={rows} />
        </SidebarSection>
      ) : null}

      {diagonalizationMatrices.length ? (
        <SidebarSection
          id="selection-matrix"
          title="diagonalization matrix"
          defaultOpen
          resetKey={`${selectedCell?.id ?? 'none'}:${diagonalizationMatrices.length}`}
        >
          <DiagonalizationMatrixSection shape={shape} reports={diagonalizationMatrices} />
        </SidebarSection>
      ) : null}

      {selectedCell ? (
        <SidebarSection
          id="selection-composition"
          title="parts"
          // C-6a part 2 (§94, ruled): OPEN by default — this section holds the ONLY
          // route to lifting an edge (the canvas has no edge handler), and a row a
          // person has never seen has never shown its tooltip
          defaultOpen
          resetKey={selectedCell.id}
        >
          <CellComposition
            shape={shape}
            cell={selectedCell}
            faces={selectedCellFaces}
            edges={selectedCellEdges}
          />
        </SidebarSection>
      ) : null}
    </section>
  );
}

interface SelectionSectionIndexEntry {
  id: string;
  label: string;
  count?: ReactNode;
}

function SelectionSectionIndex({ entries }: { entries: SelectionSectionIndexEntry[] }) {
  if (!entries.length) {
    return null;
  }

  return (
    <nav
      aria-label="Selection sections"
      className="flex flex-wrap gap-2 rounded border border-stone-800 bg-stone-950 px-3 py-2 text-xs"
    >
      {entries.map((entry) => (
        <a
          key={entry.id}
          href={`#${entry.id}`}
          className="inline-flex items-center gap-1 rounded border border-stone-700 bg-stone-900 px-2 py-1 font-semibold text-stone-300 transition hover:border-teal-300 hover:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          {entry.label}
          {entry.count !== undefined ? (
            <span className="font-mono text-[10px] text-stone-500">{entry.count}</span>
          ) : null}
        </a>
      ))}
    </nav>
  );
}

function SidebarSection({
  id,
  title,
  count,
  defaultOpen,
  resetKey,
  children,
}: {
  id: string;
  title: string;
  count?: ReactNode;
  defaultOpen: boolean;
  resetKey?: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelId = `${id}-content`;

  useEffect(() => {
    setIsOpen(defaultOpen);
  }, [defaultOpen, resetKey]);

  return (
    <section id={id} className="scroll-mt-4 border-t border-stone-800 pt-3">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 text-left focus:outline-none focus:ring-2 focus:ring-teal-500"
      >
        <span className="min-w-0">
          <span className="block truncate text-xs font-semibold text-stone-500">
            {title}
          </span>
          {count !== undefined ? (
            <span className="mt-1 block font-mono text-[11px] text-stone-600">{count}</span>
          ) : null}
        </span>
        <span
          aria-hidden="true"
          className="grid h-6 w-6 shrink-0 place-items-center rounded border border-stone-700 bg-stone-900 font-mono text-xs text-stone-300"
        >
          {isOpen ? '-' : '+'}
        </span>
      </button>
      {isOpen ? (
        <div id={panelId} className="mt-3">
          {children}
        </div>
      ) : null}
    </section>
  );
}

function CurrentFocusCard({
  shape,
  dualInspectionTarget,
  selectedCell,
  selectedVertex,
}: {
  shape: Shape;
  dualInspectionTarget: DualInspectionTarget | null;
  selectedCell: Cell | null;
  selectedVertex: Vertex | null;
}) {
  const resolvedDualTarget = useMemo(
    () =>
      dualInspectionTarget
        ? resolveDualInspectionTarget(shape, dualInspectionTarget)
        : null,
    [dualInspectionTarget, shape],
  );
  const focus = getCurrentFocusDetails({
    dualInspectionTarget,
    resolvedDualTarget,
    selectedCell,
    selectedVertex,
  });

  return (
    <div data-focus-card={focus.badge ?? 'none'} className="rounded border border-stone-800 bg-stone-950 px-3 py-3 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xs font-semibold text-stone-500">in focus</h2>
          <p className="mt-2 truncate text-sm font-medium text-stone-100">{focus.title}</p>
        </div>
        {focus.badge ? (
          <span className={`shrink-0 rounded border px-2 py-1 text-[11px] font-semibold ${focus.badgeClassName}`}>
            {focus.badge}
          </span>
        ) : null}
      </div>
      {focus.details.length ? (
        <dl className="mt-3 grid grid-cols-[88px_minmax(0,1fr)] gap-x-3 gap-y-1.5 text-xs">
          {focus.details.map((detail) => (
            <CurrentFocusDetail key={detail.label} label={detail.label} value={detail.value} />
          ))}
        </dl>
      ) : null}
    </div>
  );
}

interface CurrentFocusDetailRow {
  label: string;
  value: string;
}

interface CurrentFocusDetails {
  title: string;
  badge: string | null;
  badgeClassName: string;
  details: CurrentFocusDetailRow[];
}

/** COPY-1 §5.4 selection — the focus card: `dual` · `vertex` · `cell` by P6, their rows `name: A` (`unnamed`) · `in the selected cell, a
 * seed tetrahedron` · `not in the selected cell` · `no cell selected` · `kind: core · shape: octahedron · generation: 1`; with nothing
 * selected the card reads `nothing selected` and nothing more (the instruction that stood under it is gone) */
function getCurrentFocusDetails({
  dualInspectionTarget,
  resolvedDualTarget,
  selectedCell,
  selectedVertex,
}: {
  dualInspectionTarget: DualInspectionTarget | null;
  resolvedDualTarget: ResolvedDualInspectionTarget | null;
  selectedCell: Cell | null;
  selectedVertex: Vertex | null;
}): CurrentFocusDetails {
  if (dualInspectionTarget) {
    if (resolvedDualTarget) {
      const sourceCell = resolvedDualTarget.sourceCell;

      return {
        title: 'dual',
        badge: 'dual',
        badgeClassName: 'border-violet-400/40 bg-violet-400/10 text-violet-100',
        details: [
          { label: 'model', value: formatDualModelLabel(resolvedDualTarget) },
          { label: 'entity', value: `dual ${resolvedDualTarget.kind}` },
          { label: 'source cell', value: formatCellSummary(sourceCell) },
          { label: 'relation', value: describeDualFocusRelation(resolvedDualTarget) },
        ],
      };
    }

    return {
      title: 'dual',
      badge: 'stale',
      badgeClassName: 'border-rose-400/40 bg-rose-400/10 text-rose-100',
      details: [
        { label: 'model', value: dualInspectionTarget.modelKind === 'correspondence' ? 'correspondence (read only)' : 'semantic dual universe' },
        { label: 'entity', value: `dual ${dualInspectionTarget.kind}` },
        { label: 'status', value: 'no longer in this shape' },
      ],
    };
  }

  if (selectedVertex) {
    const label = getPacketDisplayLabel(selectedVertex.data) ?? 'unnamed';
    const cellHasVertex = selectedCell?.vertexIds.includes(selectedVertex.id) ?? false;
    const context = selectedCell
      ? cellHasVertex
        ? `in the selected cell, ${withArticle(cellWordsOf(selectedCell))}`
        : 'not in the selected cell'
      : 'no cell selected';

    return {
      title: 'vertex',
      badge: 'primal',
      badgeClassName: 'border-cyan-400/40 bg-cyan-400/10 text-cyan-100',
      details: [
        { label: 'name', value: label },
        { label: 'cell', value: context },
      ],
    };
  }

  if (selectedCell) {
    return {
      title: 'cell',
      badge: 'primal',
      badgeClassName: 'border-amber-400/40 bg-amber-400/10 text-amber-100',
      details: [
        { label: 'kind', value: selectedCell.kind },
        ...(shapeWords(describeCellTopology(selectedCell)) ? [{ label: 'shape', value: shapeWords(describeCellTopology(selectedCell)) as string }] : []),
        { label: 'generation', value: String(selectedCell.generationDepth) },
      ],
    };
  }

  return {
    title: 'nothing selected',
    badge: null,
    badgeClassName: '',
    details: [],
  };
}

// a cell by kind and shape, no generation: `seed tetrahedron` · `core octahedron` · `core` (no recorded shape — P4); a parent-kind cell
// by the page's word for it (`seed` at generation 0, `dissected` above it)
function cellWordsOf(cell: Cell): string {
  const words = shapeWords(describeCellTopology(cell));
  const kind = cellKindWord(cell.kind, cell.generationDepth);
  return words ? `${kind} ${words}` : kind;
}

// P7 — the dual inspector's relation row in words
function describeDualFocusRelation(resolvedTarget: ResolvedDualInspectionTarget): string {
  if (resolvedTarget.kind === 'cell') {
    return 'the dual cell of a source cell';
  }

  if (resolvedTarget.kind === 'vertex') {
    return 'the dual vertex of a source face';
  }

  if (resolvedTarget.kind === 'face') {
    return 'the dual face of a source vertex';
  }

  return 'the dual edge of a source edge';
}

function formatResolvedDualRelation(resolvedTarget: ResolvedDualInspectionTarget): string {
  if (resolvedTarget.kind === 'cell') {
    return `a semantic ${shapeWords(describeCellTopology(resolvedTarget.dualCell)) ?? 'cell'}, dual to the source ${shapeWords(describeCellTopology(resolvedTarget.sourceCell)) ?? 'cell'}`;
  }

  return describeDualFocusRelation(resolvedTarget);
}

// P7 — `correspondence (read only)` · `semantic dual universe`
function formatDualModelLabel(resolvedTarget: ResolvedDualInspectionTarget): string {
  return resolvedTarget.modelKind === 'correspondence'
    ? 'correspondence (read only)'
    : 'semantic dual universe';
}

// P4 — `seed tetrahedron, generation 0`
function formatCellSummary(cell: Cell): string {
  return cellWords(cell.kind, describeCellTopology(cell), cell.generationDepth);
}

// P7 — `4 vertices, 6 edges, 4 faces`
function formatCellCountsSummary(vertexCount: number, edgeCount: number, faceCount: number): string {
  return `${countNoun(vertexCount, 'vertex', 'vertices')}, ${countNoun(edgeCount, 'edge')}, ${countNoun(faceCount, 'face')}`;
}

function formatFaceSummary(shape: Shape, face: Face): string {
  const packetLabel = getPacketDataDisplayLabel(face.data);
  const roleLabel = face.role.replace(/-/g, ' ');

  // C-7h item 11: the face by its corners' name (D14), never by its id
  return `${packetLabel ?? faceDisplayName(shape, face)} (${roleLabel})`;
}

// P7 — under `made from`: `vertex A` · `face A·B·C` · `the source cell`
function formatFaceSourceRelation(shape: Shape, face: Face): string | null {
  if (face.sourceVertexId) {
    return `vertex ${getVertexDisplayLabel(shape, face.sourceVertexId)}`;
  }

  if (face.sourceFaceId) {
    return `face ${getFaceDisplayLabel(shape, face.sourceFaceId)}`;
  }

  if (face.sourceCellId) {
    return 'the source cell';
  }

  return null;
}

// rule 5 — a vertex by its name, else `unnamed`; the dual model's own vertices are read where the shape does not hold them
function formatVertexSummary(
  shape: Shape,
  vertexId: VertexId,
  verticesById?: Record<string, Vertex>,
): string {
  const vertex = shape.vertices[vertexId] ?? verticesById?.[vertexId];

  return vertex ? getPacketDisplayLabel(vertex.data) ?? 'unnamed' : 'unnamed';
}

// P7 — names joined; dual vertices without names read as a count (`3 dual vertices`) instead of ids
function formatVertexIdListAsLabels(
  shape: Shape,
  vertexIds: string[],
  separator = ', ',
  verticesById?: Record<string, Vertex>,
): string {
  const names = vertexIds.map((vertexId) => formatVertexSummary(shape, vertexId, verticesById));
  if (names.length > 1 && names.every((name) => name === 'unnamed')) return `${names.length} dual vertices`;
  return names.join(separator);
}

// P7 — `A · seed corner` (repeats dropped)
function formatVertexPacketSummary(shape: Shape, vertex: Vertex): string {
  return joinUniqueDetailParts([
    getPacketDisplayLabel(vertex.data) ?? 'unnamed',
    vertexRoleWords(getVertexRole(vertex)),
    formatVertexPacketDetail(vertex),
    formatVertexLineageSummary(shape, vertex),
  ]);
}

function joinUniqueDetailParts(parts: Array<string | null | undefined>): string {
  const seen = new Set<string>();
  const visibleParts: string[] = [];

  for (const part of parts) {
    const value = part?.trim();

    if (!value || seen.has(value)) {
      continue;
    }

    seen.add(value);
    visibleParts.push(value);
  }

  return visibleParts.join(' · ');
}

function getDualInspectionTargetId(target: DualInspectionTarget): string {
  if (target.kind === 'cell') {
    return target.dualCellId;
  }

  if (target.kind === 'vertex') {
    return target.dualVertexId;
  }

  if (target.kind === 'face') {
    return target.dualFaceId;
  }

  return target.dualEdgeId;
}

function CurrentFocusDetail({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-stone-500">{label}</dt>
      <dd className="min-w-0 text-stone-200">{value}</dd>
    </>
  );
}

/** COPY-1 §3 P7 — the dual inspector's eight variants, one pattern: labels lowercase, the relation in words, no id row, the two
 * notices `read only: a correspondence, not a new shape; it changes no names or notes` · `read only`, the stale target
 * `stale: no longer in this shape` */
function DualUniverseInspectionSection() {
  const shape = useCurrentShape();
  const dualInspectionTarget = useGeometryStore((state) => state.dualInspectionTarget);
  const clearDualInspectionTarget = useGeometryStore((state) => state.clearDualInspectionTarget);
  const resolvedTarget = useMemo(
    () =>
      dualInspectionTarget
        ? resolveDualInspectionTarget(shape, dualInspectionTarget)
        : null,
    [dualInspectionTarget, shape],
  );

  if (!dualInspectionTarget) {
    return null;
  }

  const isCorrespondenceTarget = dualInspectionTarget.modelKind === 'correspondence';

  return (
    <div className="rounded border border-violet-400/30 bg-violet-400/5 px-3 py-3 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold text-violet-200">
            {isCorrespondenceTarget ? 'dual correspondence' : 'dual universe'}
          </h2>
          <p className="mt-2 text-xs leading-5 text-stone-400">
            {isCorrespondenceTarget
              ? 'read only: a correspondence, not a new shape; it changes no names or notes'
              : 'read only'}
          </p>
        </div>
        <button
          type="button"
          onClick={clearDualInspectionTarget}
          className="rounded border border-stone-700 bg-stone-950 px-2 py-1 text-xs text-stone-300 transition hover:border-stone-500 hover:text-stone-100"
        >
          clear
        </button>
      </div>
      {resolvedTarget ? (
        <>
          <SourceNavigationActions resolvedTarget={resolvedTarget} />
          <ResolvedDualInspectionDetails shape={shape} resolvedTarget={resolvedTarget} />
        </>
      ) : (
        <StaleDualInspectionDetails target={dualInspectionTarget} />
      )}
    </div>
  );
}

function ResolvedDualInspectionDetails({
  shape,
  resolvedTarget,
}: {
  shape: Shape;
  resolvedTarget: ResolvedDualInspectionTarget;
}) {
  if (resolvedTarget.modelKind === 'correspondence') {
    return (
      <ResolvedDualCorrespondenceInspectionDetails
        shape={shape}
        resolvedTarget={resolvedTarget}
      />
    );
  }

  if (resolvedTarget.kind === 'face') {
    const packetSummary = resolvedTarget.sourceVertex
      ? formatVertexPacketSummary(shape, resolvedTarget.sourceVertex)
      : 'the source vertex is not in this shape';

    return (
      <dl className="mt-3 grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
        <InspectionDetail label="entity" value="dual face" />
        <InspectionDetail label="model" value={formatDualModelLabel(resolvedTarget)} />
        <InspectionDetail label="relation" value={formatResolvedDualRelation(resolvedTarget)} />
        <InspectionDetail
          label="source vertex"
          value={
            resolvedTarget.sourceVertex
              ? formatVertexSummary(shape, resolvedTarget.sourceVertex.id)
              : 'the source vertex is not in this shape'
          }
        />
        <InspectionDetail label="name & notes" value={packetSummary} />
        <InspectionDetail label="source cell" value={formatCellSummary(resolvedTarget.sourceCell)} />
        <InspectionDetail
          label="dual vertices"
          value={formatVertexIdListAsLabels(
            shape,
            resolvedTarget.dualFace.vertexIds,
            ', ',
            resolvedTarget.semanticModel.dualVertices,
          )}
        />
      </dl>
    );
  }

  if (resolvedTarget.kind === 'edge') {
    const lineageMode = resolvedTarget.dualEdge.lineage?.inheritanceMode;
    return (
      <dl className="mt-3 grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
        <InspectionDetail label="entity" value="dual edge" />
        <InspectionDetail label="model" value={formatDualModelLabel(resolvedTarget)} />
        <InspectionDetail label="relation" value={formatResolvedDualRelation(resolvedTarget)} />
        <InspectionDetail
          label="source edge"
          value={
            resolvedTarget.sourceEdge
              ? formatEdgeRef(shape, resolvedTarget.sourceEdge.vertexIds)
              : 'the source edge is not in this shape'
          }
        />
        <InspectionDetail label="source cell" value={formatCellSummary(resolvedTarget.sourceCell)} />
        <InspectionDetail
          label="dual edge"
          value={formatVertexIdListAsLabels(
            shape,
            resolvedTarget.dualEdge.vertexIds,
            '–',
            resolvedTarget.semanticModel.dualVertices,
          )}
        />
        {lineageMode ? <InspectionDetail label="lineage" value={lineageModeWords(lineageMode)} /> : null}
      </dl>
    );
  }

  if (resolvedTarget.kind === 'vertex') {
    const sourceRelation = resolvedTarget.sourceFace
      ? formatFaceSourceRelation(shape, resolvedTarget.sourceFace)
      : null;

    return (
      <dl className="mt-3 grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
        <InspectionDetail label="entity" value="dual vertex" />
        <InspectionDetail label="model" value={formatDualModelLabel(resolvedTarget)} />
        <InspectionDetail label="relation" value={formatResolvedDualRelation(resolvedTarget)} />
        <InspectionDetail
          label="source face"
          value={
            resolvedTarget.sourceFace
              ? formatFaceSummary(shape, resolvedTarget.sourceFace)
              : 'the source face is not in this shape'
          }
        />
        {sourceRelation ? <InspectionDetail label="made from" value={sourceRelation} /> : null}
        <InspectionDetail
          label="face vertices"
          value={
            resolvedTarget.sourceFace
              ? formatVertexIdListAsLabels(shape, resolvedTarget.sourceFace.vertexIds)
              : 'the source face is not in this shape'
          }
        />
        <InspectionDetail label="source cell" value={formatCellSummary(resolvedTarget.sourceCell)} />
        <InspectionDetail
          label="dual vertex"
          value={formatVertexSummary(
            shape,
            resolvedTarget.dualVertex.id,
            resolvedTarget.semanticModel.dualVertices,
          )}
        />
        <InspectionDetail label="position" value={positionWords(resolvedTarget.dualVertex.position)} />
      </dl>
    );
  }

  return (
    <dl className="mt-3 grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
      <InspectionDetail label="entity" value="semantic dual cell" />
      <InspectionDetail label="model" value={formatDualModelLabel(resolvedTarget)} />
      <InspectionDetail label="relation" value={formatResolvedDualRelation(resolvedTarget)} />
      <InspectionDetail label="source cell" value={formatCellSummary(resolvedTarget.sourceCell)} />
      <InspectionDetail label="dual cell" value={formatCellSummary(resolvedTarget.dualCell)} />
      <InspectionDetail
        label="counts"
        value={formatCellCountsSummary(
          resolvedTarget.dualCell.vertexIds.length,
          resolvedTarget.semanticModel.dualEdges.length,
          resolvedTarget.dualCell.faceIds.length,
        )}
      />
    </dl>
  );
}

function ResolvedDualCorrespondenceInspectionDetails({
  shape,
  resolvedTarget,
}: {
  shape: Shape;
  resolvedTarget: Extract<ResolvedDualInspectionTarget, { modelKind: 'correspondence' }>;
}) {
  if (resolvedTarget.kind === 'face') {
    const packetSummary = resolvedTarget.sourceVertex
      ? formatVertexPacketSummary(shape, resolvedTarget.sourceVertex)
      : 'the source vertex is not in this shape';

    return (
      <dl className="mt-3 grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
        <InspectionDetail label="entity" value="dual face" />
        <InspectionDetail label="model" value={formatDualModelLabel(resolvedTarget)} />
        <InspectionDetail label="relation" value={formatResolvedDualRelation(resolvedTarget)} />
        <InspectionDetail
          label="source vertex"
          value={
            resolvedTarget.sourceVertex
              ? formatVertexSummary(shape, resolvedTarget.sourceVertex.id)
              : 'the source vertex is not in this shape'
          }
        />
        <InspectionDetail label="source name & notes" value={packetSummary} />
        <InspectionDetail label="source cell" value={formatCellSummary(resolvedTarget.sourceCell)} />
        <InspectionDetail
          label="dual shape"
          value={resolvedTarget.correspondenceModel.dualTopologyLabel}
        />
        <InspectionDetail
          label="dual vertices"
          value={formatVertexIdListAsLabels(shape, resolvedTarget.dualFace.vertexIds)}
        />
      </dl>
    );
  }

  if (resolvedTarget.kind === 'edge') {
    return (
      <dl className="mt-3 grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
        <InspectionDetail label="entity" value="dual edge" />
        <InspectionDetail label="model" value={formatDualModelLabel(resolvedTarget)} />
        <InspectionDetail label="relation" value={formatResolvedDualRelation(resolvedTarget)} />
        <InspectionDetail
          label="source edge"
          value={
            resolvedTarget.sourceEdge
              ? formatEdgeRef(shape, resolvedTarget.sourceEdge.vertexIds)
              : 'the source edge is not in this shape'
          }
        />
        <InspectionDetail label="source cell" value={formatCellSummary(resolvedTarget.sourceCell)} />
        <InspectionDetail
          label="dual shape"
          value={resolvedTarget.correspondenceModel.dualTopologyLabel}
        />
        <InspectionDetail
          label="dual edge"
          value={formatVertexIdListAsLabels(shape, resolvedTarget.dualEdge.vertexIds, '–')}
        />
      </dl>
    );
  }

  const sourceRelation = resolvedTarget.sourceFace
    ? formatFaceSourceRelation(shape, resolvedTarget.sourceFace)
    : null;

  return (
    <dl className="mt-3 grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
      <InspectionDetail label="entity" value="dual vertex" />
      <InspectionDetail label="model" value={formatDualModelLabel(resolvedTarget)} />
      <InspectionDetail label="relation" value={formatResolvedDualRelation(resolvedTarget)} />
      <InspectionDetail
        label="source face"
        value={
          resolvedTarget.sourceFace
            ? formatFaceSummary(shape, resolvedTarget.sourceFace)
            : 'the source face is not in this shape'
        }
      />
      {sourceRelation ? <InspectionDetail label="made from" value={sourceRelation} /> : null}
      <InspectionDetail
        label="face vertices"
        value={
          resolvedTarget.sourceFace
            ? formatVertexIdListAsLabels(shape, resolvedTarget.sourceFace.vertexIds)
            : 'the source face is not in this shape'
        }
      />
      <InspectionDetail label="source cell" value={formatCellSummary(resolvedTarget.sourceCell)} />
      <InspectionDetail
        label="dual shape"
        value={resolvedTarget.correspondenceModel.dualTopologyLabel}
      />
      <InspectionDetail label="position" value={positionWords(resolvedTarget.dualVertex.position)} />
    </dl>
  );
}

function SourceNavigationActions({
  resolvedTarget,
}: {
  resolvedTarget: ResolvedDualInspectionTarget;
}) {
  const selectCell = useGeometryStore((state) => state.selectCell);
  const selectVertex = useGeometryStore((state) => state.selectVertex);
  const clearDualInspectionTarget = useGeometryStore((state) => state.clearDualInspectionTarget);
  const setHoverTarget = useGeometryStore((state) => state.setHoverTarget);
  const sourceVertex = resolvedTarget.kind === 'face' ? resolvedTarget.sourceVertex : null;

  function handleSelectSourceCell() {
    setHoverTarget(null);
    selectCell(resolvedTarget.sourceCell.id);
    clearDualInspectionTarget();
  }

  function handleSelectSourceVertex() {
    if (!sourceVertex) {
      return;
    }

    setHoverTarget(null);
    selectCell(resolvedTarget.sourceCell.id);
    selectVertex(sourceVertex.id);
    clearDualInspectionTarget();
  }

  return (
    <div className="mt-3 border-t border-violet-400/20 pt-3">
      <div className="mb-2 text-xs font-semibold text-violet-200">source</div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSelectSourceCell}
          className="rounded border border-stone-700 bg-stone-950 px-2.5 py-1.5 text-xs font-semibold text-stone-200 transition hover:border-cyan-300 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          select the source cell
        </button>
        {sourceVertex ? (
          <button
            type="button"
            onClick={handleSelectSourceVertex}
            className="rounded border border-stone-700 bg-stone-950 px-2.5 py-1.5 text-xs font-semibold text-stone-200 transition hover:border-amber-300 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            select the source vertex
          </button>
        ) : null}
      </div>
    </div>
  );
}

function StaleDualInspectionDetails({ target }: { target: DualInspectionTarget }) {
  return (
    <dl className="mt-3 grid grid-cols-[112px_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
      <InspectionDetail label="entity" value="stale: no longer in this shape" />
      <InspectionDetail label="model" value={target.modelKind === 'correspondence' ? 'correspondence (read only)' : 'semantic dual universe'} />
      <InspectionDetail label="kind" value={target.kind} />
      <InspectionDetail label="status" value="its source cell no longer gives this view" />
    </dl>
  );
}

function InspectionDetail({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-stone-500">{label}</dt>
      <dd className="min-w-0 break-words text-stone-200">{value}</dd>
    </>
  );
}

/** COPY-1 §5.4 selection — the cell card: the shape's name (no id line) · its chip `can take Ambo` / `can't take Ambo` with the
 * operation's reason as its hint · `kind: core · generation: 1 · state: active · children: 0 · faces: 8 · vertices: 6 · edges: 12` ·
 * `lineage: from the parent tetrahedron` · `name & notes: none` (`3 fields`) · `parent: the seed tetrahedron` · the R1 notice ·
 * `dual view on: showing its dual` / `dual view on: this cell has no dual, so it shows dimmed` */
function SelectedCellSummary({
  row,
  rows,
  faceCount,
  vertexCount,
  edgeCount,
  dualViewEnabled,
  shape,
}: {
  row: WorkspaceCellRow;
  rows: WorkspaceCellRow[];
  faceCount: number;
  vertexCount: number;
  edgeCount: number;
  dualViewEnabled: boolean;
  shape: Shape;
}) {
  const chip = (
    <span
      data-cell-card-chip={row.isOperable ? 'can' : 'cannot'}
      className={`shrink-0 rounded border px-2 py-0.5 text-xs ${
        row.isOperable
          ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
          : 'border-stone-700 bg-stone-900 text-stone-500'
      }`}
    >
      {row.isOperable ? 'can take Ambo' : "can't take Ambo"}
    </span>
  );
  return (
    <div data-cell-card="true" className="mt-2 rounded border border-stone-800 bg-stone-950 px-3 py-3 text-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="min-w-0 font-medium text-stone-100">{shapeWords(row.topology) ?? row.kind}</p>
        {row.disabledReason ? <Hint text={row.disabledReason}>{chip}</Hint> : chip}
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
        <dt className="text-stone-500">kind</dt>
        <dd className="text-right text-stone-200">{row.kind}</dd>
        <dt className="text-stone-500">generation</dt>
        <dd className="text-right text-stone-200">{row.generationDepth}</dd>
        <dt className="text-stone-500">state</dt>
        <dd className="text-right text-stone-200">
          {getCellLifecycleStatusLabel(row.lifecycleStatus)}
        </dd>
        <dt className="text-stone-500">children</dt>
        <dd className="text-right text-stone-200">{row.childCount}</dd>
        <dt className="text-stone-500">faces</dt>
        <dd className="text-right text-stone-200">{faceCount}</dd>
        <dt className="text-stone-500">vertices</dt>
        <dd className="text-right text-stone-200">{vertexCount}</dd>
        <dt className="text-stone-500">edges</dt>
        <dd className="text-right text-stone-200">{edgeCount}</dd>
        <dt className="text-stone-500">lineage</dt>
        <dd className="text-right text-stone-200">{formatCellLineageSummary(shape, row.cell)}</dd>
        <dt className="text-stone-500">name &amp; notes</dt>
        <dd className="text-right text-stone-200">{formatPacketDataSummary(row.cell.data)}</dd>
      </dl>
      {/* B-110 §4 — THE LEANING-RESIDUE WORD (the designer's; COPY-1 §5.4's sentence). R1 relaxed the twelve corners to t = 1/φ, so the
          core and its residues no longer tile the cube they came from — a person who sees the residues leaning needs the REASON.
          ⛔ Sited by the substrate's own POSITIVE MARK (the relaxed vertices carry `metric-relaxed · t = 1/φ (R1)`), so it can never
          speak on the pre-op ambo shape — by construction, not by discipline. */}
      {cellCarriesR1Relaxation(shape, row.cell) ? (
        <p className="mt-3 text-xs leading-relaxed text-stone-400">
          its twelve corners were moved to make the icosahedron regular, so the pieces no longer fill the cube they came from
        </p>
      ) : null}
      <p className="mt-3 truncate text-xs text-stone-600">{formatParentLabel(row, rows)}</p>
      {dualViewEnabled ? (
        <p className="mt-2 text-xs text-stone-500">
          {isDualViewSupportedCell(shape, row.cell)
            ? 'dual view on: showing its dual'
            : 'dual view on: this cell has no dual, so it shows dimmed'}
        </p>
      ) : null}
    </div>
  );
}

/** COPY-1 §5.4 selection — lineage: `parent: seed tetrahedron` · `parent: not in this shape` · `no parent` · `no children` (`2 children`)
 * · `state: active · generation 1 · made by: Ambo Dissection · children: 0` · a parent's or child's button `seed tetrahedron, generation 0`
 * (`residue tetrahedron, generation 2 · active`) · `the parent isn't in this shape` · `no child cells` */
function CellLineageNavigation({
  row,
  rows,
}: {
  row: WorkspaceCellRow;
  rows: WorkspaceCellRow[];
}) {
  const selectCell = useGeometryStore((state) => state.selectCell);
  const setHoverTarget = useGeometryStore((state) => state.setHoverTarget);
  const parentRow = row.cell.parentCellId
    ? rows.find((candidate) => candidate.id === row.cell.parentCellId) ?? null
    : null;
  const childRows = rows.filter((candidate) => candidate.cell.parentCellId === row.id);
  const parentStatus = row.cell.parentCellId
    ? parentRow
      ? `parent: ${cellNameOrWords(parentRow.cell)}`
      : 'parent: not in this shape'
    : 'no parent';

  function handleSelectCell(cellId: string) {
    setHoverTarget(null);
    selectCell(cellId);
  }

  return (
    <div className="mt-3 rounded border border-stone-800 bg-stone-950 px-3 py-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold text-stone-500">lineage</h3>
        <span className="shrink-0 rounded border border-stone-700 bg-stone-900 px-2 py-0.5 text-xs text-stone-400">
          {childrenWords(childRows.length)}
        </span>
      </div>

      <p className="mt-3 text-xs text-stone-300">
        {[`state: ${getCellLifecycleStatusLabel(row.lifecycleStatus)}`, `generation ${row.generationDepth}`, `made by: ${operationWords(row.cell.sourceOperation) ?? 'the seed'}`, `children: ${childRows.length}`].join(' · ')}
      </p>
      <p className={`mt-1 truncate text-xs ${parentRow ? 'text-stone-300' : 'text-stone-500'}`}>{parentStatus}</p>

      <div className="mt-3 border-t border-stone-800 pt-3">
        <div className="mb-2 text-xs font-semibold text-stone-500">parent</div>
        {parentRow ? (
          <button
            type="button"
            onClick={() => handleSelectCell(parentRow.id)}
            onPointerEnter={() => setHoverTarget({ kind: 'cell', cellId: parentRow.id })}
            onPointerLeave={() => setHoverTarget(null)}
            className="w-full rounded border border-stone-700 bg-stone-900 px-3 py-2 text-left text-xs text-stone-200 transition hover:border-amber-300 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <span className="block font-medium">{cellButtonWords(parentRow.cell)}</span>
          </button>
        ) : (
          <p className="text-xs text-stone-500">
            {row.cell.parentCellId ? "the parent isn't in this shape" : 'no parent'}
          </p>
        )}
      </div>

      <div className="mt-3 border-t border-stone-800 pt-3">
        <div className="mb-2 text-xs font-semibold text-stone-500">children</div>
        {childRows.length ? (
          <div className="grid max-h-44 gap-2 overflow-y-auto pr-1">
            {childRows.map((childRow) => (
              <button
                key={childRow.id}
                type="button"
                onClick={() => handleSelectCell(childRow.id)}
                onPointerEnter={() => setHoverTarget({ kind: 'cell', cellId: childRow.id })}
                onPointerLeave={() => setHoverTarget(null)}
                className="rounded border border-stone-800 bg-stone-950 px-3 py-2 text-left text-xs text-stone-300 transition hover:border-cyan-300 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="block min-w-0 truncate font-medium text-stone-200">{cellButtonWords(childRow.cell)}</span>
                  <span className="shrink-0 rounded border border-stone-700 bg-stone-900 px-1.5 py-0.5 text-[10px] text-stone-400">
                    {getCellLifecycleStatusLabel(childRow.lifecycleStatus)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-500">no child cells</p>
        )}
      </div>
    </div>
  );
}

/** COPY-1 §5.4 selection — parts: `vertices 6` · `faces 8` · `edges 12` · rows by name (`unnamed` without one; no id line) · a vertex's
 * role chip (P2) and lineage (P5) · a face `AB·AC·BC · 3 corners · from vertex A` · an edge `AB–AC · construction diagonal · from face
 * A·B·C` · the row hints unchanged · `its ends are identified, so there is no edge to lift` */
function CellComposition({
  shape,
  cell,
  faces,
  edges,
}: {
  shape: Shape;
  cell: Cell;
  faces: Face[];
  edges: CellEdgeRow[];
}) {
  const selectVertex = useGeometryStore((state) => state.selectVertex);
  const selectedVertexId = useGeometryStore((state) => state.selectedVertexId);
  const selectEdge = useGeometryStore((state) => state.selectEdge);
  const selectedEdgeId = useGeometryStore((state) => state.selectedEdgeId);
  const selectFace = useGeometryStore((state) => state.selectFace); // C-10b: the face's plain click reads it
  const selectedFaceId = useGeometryStore((state) => state.selectedFaceId);
  const setHoverTarget = useGeometryStore((state) => state.setHoverTarget);
  // multi-region lift: shift-click any row toggles the entity into the set
  const toggleLiftSelection = useGeometryStore((state) => state.toggleLiftSelection);
  const liftSelection = useGeometryStore((state) => state.liftSelection);
  const inLiftSet = (kind: 'face' | 'edge' | 'vertex', id: string) =>
    liftSelection.some((s) => s.kind === kind && s.id === id);
  const vertices = useMemo(() => getCellVertexRows(shape, cell), [cell, shape]);
  const faceRows = useMemo(() => getCellFaceRows(shape, faces), [faces, shape]);
  const [edgeNotice, setEdgeNotice] = useState<string | null>(null);

  return (
    <div className="grid gap-4">
      <SelectionSubsection title="vertices" count={vertices.length}>
        <div className="grid max-h-56 gap-2 overflow-y-auto pr-1">
          {vertices.map((row) => {
            const isSelected = row.vertex.id === selectedVertexId;
            const isLifted = inLiftSet('vertex', row.vertex.id);

            return (
              <button
                key={row.vertex.id}
                type="button"
                onClick={(event) => {
                  if (event.shiftKey) {
                    toggleLiftSelection({ kind: 'vertex', id: row.vertex.id });
                    return;
                  }
                  selectVertex(row.vertex.id);
                }}
                onPointerEnter={() => setHoverTarget({ kind: 'vertex', vertexId: row.vertex.id })}
                onPointerLeave={() => setHoverTarget(null)}
                // C-6b (§96, the designer): the module's consumers are named on SELECTION
                // (`lift selection → Manuscript` · `fit selected`) — `inspect` named the
                // consequence and severed the chain; the three rows speak alike now
                title="click: select · shift-click: toggle in the lift region"
                className={`rounded border px-3 py-2 text-left text-sm transition ${
                  isLifted
                    ? 'border-emerald-400 bg-emerald-400/10 text-emerald-100'
                    : isSelected
                      ? 'border-amber-300 bg-amber-300/10 text-amber-100'
                      : 'border-stone-800 bg-stone-950 text-stone-300 hover:border-stone-600'
                }`}
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="min-w-0">
                    {/* STAMP A-3 — the name line wears the DESIGNATION style only when it IS one: `unnamed` (COPY-1's absence word, rule 5)
                        is graded like the absence register. ⛔ Δ58: midpoint labels (`AC`, `AB`) ride exactly as minted and grade as
                        present content. */}
                    <span
                      className={`block truncate ${
                        row.displayLabel === 'unnamed' ? 'italic text-stone-500' : 'text-stone-200'
                      }`}
                    >
                      {row.displayLabel}
                    </span>
                    {row.packetDetail ? (
                      <span className="mt-1 block truncate text-xs text-stone-500">
                        {row.packetDetail}
                      </span>
                    ) : null}
                  </span>
                  {/* the designer's 16:06 (3): `midpoint` once — the lineage (`midpoint of A–B`) says the role, so the chip goes where it begins with it */}
                  {row.lineageSummary.startsWith(vertexRoleWords(row.role)) ? null : (
                    <span className="shrink-0 rounded border border-stone-700 bg-stone-900 px-2 py-0.5 text-xs text-stone-400">
                      {vertexRoleWords(row.role)}
                    </span>
                  )}
                </span>
                <span className="mt-2 block truncate text-xs text-stone-500">
                  {row.lineageSummary}
                </span>
              </button>
            );
          })}
        </div>
      </SelectionSubsection>

      <SelectionSubsection title="faces" count={faceRows.length}>
        <div className="grid max-h-56 gap-2 overflow-y-auto pr-1">
          {faceRows.map((row) => (
            <div
              key={row.face.id}
              data-face-row={row.face.id}
              aria-selected={selectedFaceId === row.face.id}
              onClick={(event) => {
                if (event.shiftKey) {
                  toggleLiftSelection({ kind: 'face', id: row.face.id });
                  return;
                }
                selectFace(row.face.id);
              }}
              onPointerEnter={() => setHoverTarget({ kind: 'face', faceId: row.face.id })}
              onPointerLeave={() => setHoverTarget(null)}
              title="click: read the face · shift-click: toggle in the lift region"
              // C-6a (§92.3) held that a plain click does NOTHING here until the face's act had a
              // meaning. C-10b (§131 item 2, the designer's blocker) gives it one: the plain click
              // SELECTS the face and its reading (C-5 at gen 0, C-9 born) mounts at the face's home
              // in this panel — so the row is a control now and takes the pointer cursor.
              className={`cursor-pointer rounded border px-3 py-2 text-sm ${
                selectedFaceId === row.face.id
                  ? 'border-amber-400 bg-amber-400/10'
                  : inLiftSet('face', row.face.id)
                    ? 'border-emerald-400 bg-emerald-400/10'
                    : 'border-stone-800 bg-stone-950'
              }`}
            >
              <span className="flex items-start justify-between gap-2">
                {/* STAMP C-1 item 4 — the researcher's GRADING: the NAME line is the DESIGNATION register (its absence word styled AS an
                    absence, never as a designation doing WHICH-work); the id line is gone (COPY-1 P1) */}
                <span
                  className={`block min-w-0 truncate ${
                    row.displayName === 'unnamed' ? 'italic text-stone-500' : 'text-stone-200'
                  }`}
                >
                  {row.displayName}
                </span>
                <span className="shrink-0 rounded border border-stone-700 bg-stone-900 px-2 py-0.5 text-xs text-stone-400">
                  {countNoun(row.size, 'corner')}
                </span>
              </span>
              <span data-face-row-lineage="true" className="mt-2 block truncate text-xs text-stone-500">
                {row.lineageSummary}
              </span>
            </div>
          ))}
        </div>
      </SelectionSubsection>

      <SelectionSubsection title="edges" count={edges.length}>
        <div className="grid max-h-44 gap-1 overflow-y-auto rounded border border-stone-800 bg-stone-950 p-2">
          {edges.map((edge) => (
            <div
              key={edge.id}
              onClick={(event) => {
                // R1 THE LIFT: hand the REAL edge id — the pair key (edge.id) is
                // display identity and is NOT in the source shape's edge table.
                if (event.shiftKey) {
                  // the GAP2A shift-click branch, exactly
                  if (edge.edgeId !== null) {
                    toggleLiftSelection({ kind: 'edge', id: edge.edgeId });
                    setEdgeNotice(null);
                  } else {
                    setEdgeNotice('its ends are identified, so there is no edge to lift');
                  }
                  return;
                }
                // GAP2A PARITY — plain-click SELECTS a liftable edge (the
                // segment operand's door); a pair whose ends are identified has no
                // single edge to select and says so in the same seam notice
                if (edge.edgeId !== null) {
                  selectEdge(edge.edgeId);
                  setEdgeNotice(null);
                } else {
                  setEdgeNotice('its ends are identified, so there is no edge to lift');
                }
              }}
              onPointerEnter={() => setHoverTarget({ kind: 'edge', vertexIds: edge.vertexIds })}
              onPointerLeave={() => setHoverTarget(null)}
              className={`cursor-pointer rounded border px-2 py-1 text-xs text-stone-400 ${
                edge.edgeId !== null && inLiftSet('edge', edge.edgeId)
                  ? 'border-emerald-400 bg-emerald-400/10'
                  : edge.edgeId !== null && edge.edgeId === selectedEdgeId
                    ? 'border-amber-300 bg-amber-300/10'
                    : 'border-stone-900 bg-stone-950/70'
              }`}
              title={
                edge.edgeId !== null
                  ? // C-6a: the row tells the truth about its plain click — the vertex row's grammar; the edge by name (P1, P3)
                    `${edge.displayLabel} · click: select · shift-click: toggle in the lift region`
                  : `${edge.displayLabel} · its ends are identified, so there is no edge to lift`
              }
            >
              <span className="flex items-center justify-between gap-2">
                <span className="min-w-0 truncate text-stone-300">{edge.displayLabel}</span>
                {edge.roleLabel ? (
                  <span className="shrink-0 rounded border border-rose-400/40 bg-rose-400/10 px-1.5 py-0.5 text-[10px] text-rose-200">
                    {edge.roleLabel}
                  </span>
                ) : null}
              </span>
              {edge.secondaryLabel ? (
                <span className="mt-0.5 block truncate text-[11px] text-stone-600">
                  {edge.secondaryLabel}
                </span>
              ) : null}
            </div>
          ))}
        </div>
        {edgeNotice ? (
          <p className="mt-2 text-xs leading-4 text-rose-300/80">{edgeNotice}</p>
        ) : null}
      </SelectionSubsection>
    </div>
  );
}

function SelectionSubsection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="flex items-center justify-between gap-2 text-xs font-semibold text-stone-500">
        {title}
        <span className="text-[11px] text-stone-600">{count}</span>
      </h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/** COPY-1 §5.4 **casts & names** · LAYOUT-1 §3 — the casts & names drawer: the names workbench, name & notes, the cast loader */
export function PacketsPanel() {
  const shape = useCurrentShape();
  const selectedCellId = useGeometryStore((state) => state.selectedCellId);
  const selectedVertexId = useGeometryStore((state) => state.selectedVertexId);
  const selectCell = useGeometryStore((state) => state.selectCell);
  const selectVertex = useGeometryStore((state) => state.selectVertex);
  const setHoverTarget = useGeometryStore((state) => state.setHoverTarget);
  const [filter, setFilter] = useState<PacketWorkbenchFilter>('unresolved-generated');
  const [searchQuery, setSearchQuery] = useState('');
  const rows = useMemo(() => getPacketWorkbenchRows(shape), [shape]);
  const filteredRows = useMemo(
    () => filterPacketRows(rows, filter).filter((row) => packetRowMatchesSearch(row, searchQuery)),
    [filter, rows, searchQuery],
  );
  const unresolvedRows = useMemo(
    () => rows.filter(isUnresolvedGeneratedPacketRow),
    [rows],
  );
  const selectedRow = selectedVertexId
    ? rows.find((row) => row.vertex.id === selectedVertexId) ?? null
    : null;
  const selectedIndex = selectedRow
    ? unresolvedRows.findIndex((row) => row.vertex.id === selectedRow.vertex.id)
    : -1;

  const selectUnresolved = (direction: 1 | -1) => {
    const nextRow =
      direction > 0
        ? findNextUnresolvedVertex(unresolvedRows, selectedVertexId)
        : findPreviousUnresolvedVertex(unresolvedRows, selectedVertexId);

    if (nextRow) {
      selectVertex(nextRow.vertex.id);
    }
  };

  const selectContainingCell = (row: PacketWorkbenchRow) => {
    const containingCell = choosePacketContainingCell(row, selectedCellId);

    if (!containingCell) {
      return;
    }

    selectCell(containingCell.id);
    selectVertex(row.vertex.id);
    setHoverTarget(null);
  };

  return (
    <section className="grid gap-4 p-4">
      <div>
        <h2 className="text-xs font-semibold text-stone-500">names</h2>
        <p className="mt-2 text-sm leading-5 text-stone-400">
          {unresolvedRows.length ? `${countNoun(unresolvedRows.length, 'midpoint')} not named yet` : 'every midpoint is named'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => selectUnresolved(-1)}
          disabled={!unresolvedRows.length}
          className="h-9 rounded border border-stone-700 bg-stone-900 px-2 text-sm text-stone-100 transition hover:border-stone-500 hover:bg-stone-800 disabled:cursor-not-allowed disabled:border-stone-800 disabled:bg-stone-950 disabled:text-stone-600"
        >
          previous unnamed
        </button>
        <button
          type="button"
          onClick={() => selectUnresolved(1)}
          disabled={!unresolvedRows.length}
          className="h-9 rounded border border-stone-700 bg-stone-900 px-2 text-sm text-stone-100 transition hover:border-stone-500 hover:bg-stone-800 disabled:cursor-not-allowed disabled:border-stone-800 disabled:bg-stone-950 disabled:text-stone-600"
        >
          next unnamed
        </button>
      </div>
      {unresolvedRows.length && selectedIndex >= 0 ? (
        <p className="text-xs text-stone-500">
          unnamed {selectedIndex + 1} of {unresolvedRows.length}
        </p>
      ) : null}

      <div className="grid gap-2">
        <label className="grid gap-1 text-xs text-stone-400">
          search
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="search names, notes and tags"
            className="h-9 rounded border border-stone-700 bg-stone-950 px-2 text-xs text-stone-100 outline-none placeholder:text-stone-600 focus:border-teal-400"
          />
        </label>
        <label className="grid gap-1 text-xs text-stone-400">
          filter
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as PacketWorkbenchFilter)}
            className="h-9 rounded border border-stone-700 bg-stone-950 px-2 text-xs text-stone-100 outline-none focus:border-teal-400"
          >
            {packetFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs text-stone-500">
          {filteredRows.length} of {rows.length}
        </p>
      </div>

      <div className="grid max-h-[calc(100vh-29rem)] gap-2 overflow-y-auto pr-1">
        {filteredRows.length ? (
          filteredRows.map((row) => (
            <PacketWorkbenchRowButton
              key={row.vertex.id}
              row={row}
              isSelected={row.vertex.id === selectedVertexId}
              selectedCellId={selectedCellId}
              onSelect={() => selectVertex(row.vertex.id)}
              onSelectContainingCell={() => selectContainingCell(row)}
              onHover={(isHovered) =>
                setHoverTarget(isHovered ? { kind: 'vertex', vertexId: row.vertex.id } : null)
              }
            />
          ))
        ) : (
          <p className="rounded border border-stone-800 bg-stone-950 px-3 py-3 text-sm text-stone-500">
            {searchQuery.trim()
              ? 'nothing matches'
              : filter === 'unresolved-generated'
              ? 'every midpoint is named'
              : 'nothing matches this filter'}
          </p>
        )}
      </div>

      <div className="border-t border-stone-800 pt-4">
        <h2 className="text-xs font-semibold text-stone-500">name &amp; notes</h2>
        <div className="mt-3">
          <VertexPacketEditorContent />
        </div>
      </div>
    </section>
  );
}

function PacketWorkbenchRowButton({
  row,
  isSelected,
  selectedCellId,
  onSelect,
  onSelectContainingCell,
  onHover,
}: {
  row: PacketWorkbenchRow;
  isSelected: boolean;
  selectedCellId: string | null;
  onSelect: () => void;
  onSelectContainingCell: () => void;
  onHover: (isHovered: boolean) => void;
}) {
  const hasContainingCell = row.containingCells.length > 0;

  return (
    <div
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      className={`rounded border text-sm transition ${
        isSelected
          ? 'border-amber-300 bg-amber-300/10 text-amber-100'
          : 'border-stone-800 bg-stone-950 text-stone-300 hover:border-stone-600'
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="w-full px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <span className="flex items-start justify-between gap-2">
          <span className={`block min-w-0 truncate ${row.displayLabel === 'unnamed' ? 'italic text-stone-500' : 'text-stone-100'}`}>{row.displayLabel}</span>
          <span className={packetStatusClassName(row.status)}>
            {formatPacketStatus(row.status)}
          </span>
        </span>
        <span className="mt-2 block truncate text-xs text-stone-500">
          {[row.lineageSummary !== vertexRoleWords(row.role) && row.lineageSummary.startsWith(vertexRoleWords(row.role)) ? null : vertexRoleWords(row.role), row.generationDepth === null ? 'in no cell' : `generation ${row.generationDepth}`, `in ${countNoun(row.containingFaceCount, 'face')}`].filter((part): part is string => part !== null).join(' · ')}
        </span>
        {/* the lineage line (P5) only where it says more than the role chip already does: a seed corner's lineage IS `seed corner` */}
        {row.lineageSummary !== vertexRoleWords(row.role) ? <span className="mt-2 block truncate text-xs text-stone-500">{row.lineageSummary}</span> : null}
      </button>
      <div className="flex items-center justify-between gap-2 border-t border-stone-800/80 px-3 py-2 text-xs text-stone-500">
        <span className="min-w-0 truncate">{formatPacketCellContext(row, selectedCellId)}</span>
        {hasContainingCell ? (
          <button
            type="button"
            onClick={onSelectContainingCell}
            className="shrink-0 rounded border border-stone-700 bg-stone-900 px-2 py-1 text-[11px] font-semibold text-stone-200 transition hover:border-amber-300 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            select its cell
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** COPY-1 §5.4 selection — the vertex card: `name: A` (no id line) · `position: 1.000, 1.000, 1.000` · `name & notes: A` (`unnamed`) ·
 * `lineage: seed corner` · `cells: 2 · faces: 3` · the cast's rows (a seed corner holding one) · the space row (a born vertex) ·
 * the opposites */
function SelectedVertexSummary({
  vertexId,
  shape,
  selectedCell,
}: {
  vertexId: string;
  shape: Shape;
  selectedCell: Cell | null;
}) {
  const vertex = shape.vertices[vertexId];
  const selectedVertexCells = shape.cells.filter((cell) => cell.vertexIds.includes(vertexId));
  const containingFaces = getContainingFaces(shape, vertexId);
  const displayLabel = getVertexDisplayLabel(shape, vertexId);

  if (!vertex) {
    return null;
  }

  return (
    <dl data-vertex-card="true" className="mt-2 grid grid-cols-[88px_minmax(0,1fr)] gap-x-3 gap-y-2 rounded border border-stone-800 bg-stone-950 px-3 py-3 text-sm">
      <dt className="text-stone-500">name</dt>
      <dd className={`min-w-0 truncate ${displayLabel === 'unnamed' ? 'italic text-stone-500' : 'text-stone-200'}`}>{displayLabel}</dd>
      <dt className="text-stone-500">position</dt>
      <dd className="text-xs text-stone-300">{positionWords(vertex.position)}</dd>
      <dt className="text-stone-500">name &amp; notes</dt>
      <dd className="truncate text-stone-200">{formatVertexPacketPreview(vertex)}</dd>
      <dt className="text-stone-500">lineage</dt>
      <dd className="text-stone-200">{formatVertexLineageSummary(shape, vertex)}</dd>
      <dt className="text-stone-500">cells</dt>
      <dd className="text-stone-200">{selectedVertexCells.length}</dd>
      <dt className="text-stone-500">faces</dt>
      <dd className="text-stone-200">{containingFaces.length}</dd>
      {/* C-6c surface 2 (the designer's ruling): THREE STATES — no cast → NO ROW (a
          true absence, never n-a); a cast of nothing; a cast with content. ONE
          number for relations counting both homes; the term-order count per
          relation-type (term order is content — no verdict, a count); two
          registers side by side, each marked as whose; UNKNOWN shown where written
          plus one count, omission silent; the marks re-derived, never stored. */}
      {vertex.createdBy.operation === 'seed' && vertex.data.cast ? (
        <CastCardRows cast={vertex.data.cast} personLabel={vertex.data.label} />
      ) : null}
      {vertex.createdBy.operation !== 'seed' ? <SpaceCardRow shape={shape} vertexId={vertex.id} /> : null}
      <SelectedVertexRelations shape={shape} selectedCell={selectedCell} vertexId={vertex.id} />
    </dl>
  );
}

// C-7f item 5 (the designer, measured at a corner holding the T cell: the card 312 × 1119 px, 1.4× the viewport — a GRID
// MISMATCH, not a size to tune: the inspector's grid is `dt` LABEL / `dd` VALUE with a 187 px value cell, and the cast's
// rows are SENTENCES, so seven relation-type rows wrap every time). RULED: the card has ONE grid and it is a label·value
// grid — A SENTENCE MAY NOT BE PUT IN ITS VALUE HALF. Every cast row is sentence-shaped, so each SPANS the card's full
// width (`col-span-2` on its label and its sentence); label·value pairs elsewhere keep the two-column grid. The height
// and the aspect ratio had one cause — MEASURED after: the height stayed (327 × 1133), the second cause the sentences'
// length. C-7g item 3 (the designer, from that measurement): the second cause is REPETITION, not width — the reading
// `read as directed` once per relation-type, seven times on one card, the wrap breaking each sentence before its verdict.
// So the term-order rows GROUP BY READING, not by relation-type: one row per (reading × reversal) class, the reading once
// per row, every word with its count (`orderingRows`) — the FORM of C-6d (γ) §3.2's clause changed, its meaning kept.
// C-7h item 10 (the designer's live drive, §125.1: "the card at a born vertex is silent about a space it has — a positive fact
// carried by nothing being there"): a BORN vertex's card says the space it holds in ONE row, its own counts derived at every
// read through the resolver, never a Cast row (the vertex holds no cast; its space is its parents' gluing); a born vertex
// still holding an old LOADED cast says so in one line and shows no cast rows — the card follows the layer: not read (Δ86).
// MARKER LAYOUT-1 · M10 (the designer's 10:38, §275): a born vertex whose space does not resolve says so in the same row —
// `space` · `none yet: A and B hold no cast` — naming the seed corners under it that hold no cast, as the lifted card does.
function SpaceCardRow({ shape, vertexId }: { shape: Shape; vertexId: VertexId }) {
  const resolved = useMemo(() => spaceOf(shape, vertexId), [shape, vertexId]);
  const loaded = holdsLoadedCast(shape, vertexId);
  const bare = useMemo(() => (resolved ? [] : parentsWithoutSpace(shape, vertexId)), [resolved, shape, vertexId]);
  const label = (id: VertexId): string => getVertexDisplayLabel(shape, id);
  return (
    <>
      {loaded ? (
        <>
          <dt className="col-span-2 text-stone-500">cast</dt>
          <dd data-space-card-row="loaded-ignored" className="col-span-2 text-stone-400">loaded but not read (a midpoint's space comes from its parents)</dd>
        </>
      ) : null}
      {resolved && resolved.edge ? (
        <>
          <dt className="col-span-2 text-stone-500">space</dt>
          <dd data-space-card-row="derived" className="col-span-2 text-stone-200">
            {/* COPY-1 §7.5 — the child's count (`childSpaceOf`, the one reader the midpoint's head counts with), never the pushout's */}
            {`the concept between ${label(resolved.edge.parents[0])} and ${label(resolved.edge.parents[1])}, made of ${(() => { const n = childSpaceOf(shape, vertexId)?.roles.length ?? 0; return `${n} ${n === 1 ? 'relating' : 'relatings'}`; })()}`}
          </dd>
        </>
      ) : null}
      {!resolved && bare.length ? (
        <>
          <dt className="col-span-2 text-stone-500">space</dt>
          <dd data-space-card-row="none-yet" className="col-span-2 text-stone-400">{`none yet: ${holdNoSpaceWords(bare.map((b) => ({ name: label(b.id), why: b.why })))}`}</dd>
        </>
      ) : null}
    </>
  );
}

/** M10, extended by MODES-3 (the designer's 16:26 §1b) — the PARENTS of a born vertex that hold no space for the act, each with its
 * reason: a seed corner that holds no cast (`cast`), a midpoint whose child has no relating (`relating`) — the one reader the hover
 * readout and the card use, through `columnSpaceOf` (what a corner offers at a midpoint view) */
export function parentsWithoutSpace(shape: Shape, vertexId: VertexId): Array<{ id: VertexId; why: 'cast' | 'relating' }> {
  const v = shape.vertices[vertexId];
  if (!v || v.createdBy.sourceVertexIds.length !== 2) return [];
  const memo = new Map<VertexId, ConceptSpace | null>();
  return v.createdBy.sourceVertexIds.flatMap((p) => {
    const pv = shape.vertices[p];
    if (!pv) return [];
    if (columnSpaceOf(shape, p, {}, memo) !== null) return [];
    return [{ id: p, why: pv.createdBy.operation === 'seed' ? ('cast' as const) : ('relating' as const) }];
  });
}

function CastCardRows({ cast, personLabel }: { cast: ConceptSpace; personLabel: string }) {
  const counts = castCounts(cast);
  const marks = castMarks(cast);
  // C-6e: the device's own record of what it did not take — the addresses under
  // warrant.malformed, read by KEY only, a second clause never folded into the marks
  const notTaken = notTakenLine(notTakenAddresses(cast));
  const unknownWhere = cast.roles.flatMap((role) =>
    Object.entries(role.types ?? {})
      .filter(([, value]) => value === 'UNKNOWN')
      .map(([type]) => `${role.id}: ${type}`),
  );
  return (
    <>
      <dt className="col-span-2 text-stone-500">cast</dt>
      <dd data-cast-card-row="summary" className="col-span-2 text-stone-200">{castSummaryLine(cast)}</dd>
      {/* C-6c (i)'s rider: the subject matter — what the concept is OF — beside the
          person's label, in the caster's register, printed ONLY when held (a
          positive fact needs a positive mark; the triangle has none, the T cell has one) */}
      {/* COPY-1 §5.4 — `of: A, as you named it · membership in a club, as the caster wrote it` */}
      {cast.subject ? (
        <>
          <dt className="col-span-2 text-stone-500">of</dt>
          <dd data-cast-card-row="subject" className="col-span-2 min-w-0 text-stone-200">
            {`${personLabel.trim() ? personLabel : 'unnamed'}, as you named it · ${cast.subject}, as the caster wrote it`}
          </dd>
        </>
      ) : null}
      {/* `roles: the member · the club · r3` — a role without a label keeps its id in monospace (rule 5: the caster's address, the font marks it), with
          the hint `the caster gave no label`; the line that explained it is gone (rule 11) */}
      {cast.roles.length ? (
        <>
          <dt className="col-span-2 text-stone-500">roles</dt>
          <dd data-cast-card-row="roles" className="col-span-2 min-w-0 text-stone-200">
            <span className="block">
              {cast.roles.map((role, index) => (
                <span key={role.id}>
                  {role.label ? (
                    <span>{role.label}</span>
                  ) : (
                    <Hint text="the caster gave no label"><span className="font-mono text-xs text-stone-400">{role.id}</span></Hint>
                  )}
                  {index < cast.roles.length - 1 ? <span className="text-stone-600">{' · '}</span> : null}
                </span>
              ))}
            </span>
          </dd>
        </>
      ) : null}
      {counts.orderings.length ? (
        <>
          <dt className="col-span-2 text-stone-500">term order</dt>
          <dd data-cast-card-row="orderings" className="col-span-2 text-stone-200">
            {orderingRows(counts.orderings).map((row) => (
              <span key={row.key} data-cast-orderings-row={row.key} className="block">{row.text}</span>
            ))}
          </dd>
        </>
      ) : null}
      {/* `unknown: 2 types (r1: cause · r3: part)` — counted where it was written; omission is silent */}
      {counts.unknownTypes ? (
        <>
          <dt className="col-span-2 text-stone-500">unknown</dt>
          <dd data-cast-card-row="unknown" className="col-span-2 text-stone-200">
            {`${counts.unknownTypes} ${counts.unknownTypes === 1 ? 'type' : 'types'} (${unknownWhere.join(' · ')})`}
          </dd>
        </>
      ) : null}
      {marks.length || notTaken ? (
        <>
          <dt className="col-span-2 text-stone-500">marks</dt>
          <dd data-cast-card-row="marks" className="col-span-2 text-stone-200">
            {marks.map((mark) => (
              <span key={mark} className="block">{mark}</span>
            ))}
            {notTaken ? <span data-cast-not-taken="true" className="block">{notTaken}</span> : null}
          </dd>
        </>
      ) : null}
    </>
  );
}

/** COPY-1 §5.4 selection — the atomic registry: `status: supported` · `status: unsupported` · `reason: not a midpoint` (P2) · `source edge:
 * A–B` · `parents: A, B` · `projection: C, D` · `candidate: edge mediation with face-local projection` · `triangle faces` · `face 1` ·
 * `candidate` · `source face: A·B·C` · `midpoints: AB, AC, BC` · `AB mediates A–B under face-local projection from C` · `a candidate
 * reading, not a final one`; the unsupported details `operation: Ambo Dissection` · `source edge: A–B` · `source vertices: A, B` ·
 * `faces: A·B·C, A·B·D`. The `Technical IDs` block is gone (P1). */
function AtomicRegistryLens({
  shape,
  report,
}: {
  shape: Shape;
  report: AtomicRegistryReport;
}) {
  if (report.status === 'unsupported') {
    return (
      <div className="rounded border border-stone-800 bg-stone-950 px-3 py-3 text-sm">
        <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-2">
          <AtomicRegistryDetail label="status" value="unsupported" />
          <AtomicRegistryDetail label="reason" value={atomicReasonWords(report.reason)} />
          <AtomicRegistryUnsupportedDetailsRows shape={shape} details={report.details} />
        </dl>
      </div>
    );
  }

  const projectionSourceLabels = Array.from(
    new Set(
      report.triangularFaceContexts.map((context) =>
        formatAtomicVertexLabel(shape, context.projectionSourceVertexId),
      ),
    ),
  ).sort((a, b) => a.localeCompare(b));

  return (
    <div className="grid gap-3 rounded border border-stone-800 bg-stone-950 px-3 py-3 text-sm">
      <dl className="grid grid-cols-[96px_minmax(0,1fr)] gap-x-3 gap-y-2">
        <AtomicRegistryDetail label="status" value="supported" />
        <AtomicRegistryDetail
          label="source edge"
          value={formatAtomicVertexIdList(shape, report.sourceEdge.vertexIds, '–')}
        />
        <AtomicRegistryDetail
          label="parents"
          value={report.parentVertices
            .map((vertex) => formatAtomicVertexLabel(shape, vertex.id))
            .join(', ')}
        />
        <AtomicRegistryDetail
          label="projection"
          value={projectionSourceLabels.join(', ')}
        />
        <AtomicRegistryDetail
          label="candidate"
          value={report.candidateReadings.map((reading) => reading.kind.replace(/-/g, ' ').replace('face local', 'face-local')).join(', ')}
        />
      </dl>

      <div className="border-t border-stone-800 pt-3">
        <p className="text-xs font-semibold text-stone-500">triangle faces</p>
        <ul className="mt-2 grid gap-2">
          {report.triangularFaceContexts.map((context, index) => {
            const sourceEdgeLabel = formatAtomicVertexIdList(shape, report.sourceEdge.vertexIds, '–');
            const sourceMidpointLabel = formatAtomicVertexLabel(shape, report.target.vertexId);
            const projectionSourceLabel = formatAtomicVertexLabel(
              shape,
              context.projectionSourceVertexId,
            );

            return (
              <li
                key={`${context.generatedFaceId}:${context.projectionSourceVertexId}`}
                className="rounded border border-stone-800 bg-neutral-950 px-3 py-3 text-xs text-stone-300"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-stone-200">face {index + 1}</p>
                  <span className="shrink-0 rounded border border-amber-300/20 bg-amber-300/5 px-2 py-0.5 text-[11px] font-semibold text-amber-100">
                    candidate
                  </span>
                </div>

                <dl className="mt-2 grid grid-cols-[104px_minmax(0,1fr)] gap-x-3 gap-y-1.5">
                  <AtomicRegistryDetail
                    label="source face"
                    value={formatAtomicVertexIdList(shape, context.sourceFaceVertexIds, '·')}
                  />
                  <AtomicRegistryDetail label="source edge" value={sourceEdgeLabel} />
                  <AtomicRegistryDetail label="projection" value={projectionSourceLabel} />
                  <AtomicRegistryDetail
                    label="midpoints"
                    value={formatAtomicVertexIdList(shape, context.generatedFaceVertexIds, ', ')}
                  />
                </dl>

                <p className="mt-3 rounded border border-stone-800 bg-stone-950 px-2 py-2 text-stone-200">
                  {sourceMidpointLabel} mediates {sourceEdgeLabel} under face-local projection from{' '}
                  {projectionSourceLabel}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="rounded border border-amber-300/20 bg-amber-300/5 px-2 py-2 text-xs text-amber-100">
        a candidate reading, not a final one
      </p>
    </div>
  );
}

// P2 — the registry's reason codes in words
function atomicReasonWords(reason: AtomicRegistryReport extends { reason: infer R } ? R : string): string {
  const words: Record<string, string> = {
    'vertex-not-found': 'vertex not found',
    'not-generated-midpoint': 'not a midpoint',
    'missing-source-edge': 'no source edge',
    'missing-parent-vertices': 'parents missing',
    'missing-source-face-context': 'no source face',
    'non-triangular-context': 'not a triangle',
    'ambiguous-context': 'ambiguous',
    'unsupported-generation-law': 'made by an unsupported operation',
  };
  return words[String(reason)] ?? String(reason).replace(/-/g, ' ');
}

function AtomicRegistryDetail({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <>
      <dt className="text-stone-500">{label}</dt>
      <dd className="min-w-0 text-stone-200">{value}</dd>
    </>
  );
}

function AtomicRegistryUnsupportedDetailsRows({
  shape,
  details,
}: {
  shape: Shape;
  details?: AtomicRegistryUnsupportedDetails;
}) {
  if (!details) {
    return null;
  }
  const sourceEdge = details.sourceEdgeId ? shape.edges.find((edge) => edge.id === details.sourceEdgeId) ?? null : null;

  return (
    <>
      {details.operation ? (
        <AtomicRegistryDetail label="operation" value={operationWords(details.operation) ?? details.operation} />
      ) : null}
      {sourceEdge ? (
        <AtomicRegistryDetail label="source edge" value={formatAtomicVertexIdList(shape, sourceEdge.vertexIds, '–')} />
      ) : null}
      {details.sourceVertexIds?.length ? (
        <AtomicRegistryDetail
          label="source vertices"
          value={formatAtomicVertexIdList(shape, details.sourceVertexIds, ', ')}
        />
      ) : null}
      {details.faceIds?.length ? (
        <AtomicRegistryDetail label="faces" value={details.faceIds.map((faceId) => getFaceDisplayLabel(shape, faceId)).join(', ')} />
      ) : null}
    </>
  );
}

function formatAtomicVertexLabel(shape: Shape, vertexId: VertexId): string {
  return formatVertexRef(shape, vertexId);
}

function formatAtomicVertexIdList(
  shape: Shape,
  vertexIds: VertexId[],
  separator: string,
): string {
  return vertexIds.map((vertexId) => formatAtomicVertexLabel(shape, vertexId)).join(separator);
}

export function WorkspaceTopologyBrowser() {
  return (
    <Panel title="Workspace Topology">
      <WorkspaceTopologyContent />
    </Panel>
  );
}

function WorkspaceTopologyContent() {
  const shape = useCurrentShape();
  const selectedCellId = useGeometryStore((state) => state.selectedCellId);
  const selectCell = useGeometryStore((state) => state.selectCell);
  const [topologyFilter, setTopologyFilter] = useState<TopologyFilter>('all');
  const [operabilityFilter, setOperabilityFilter] = useState<OperabilityFilter>('all');
  const rows = useMemo(() => getWorkspaceCellRows(shape), [shape]);
  const filteredRows = useMemo(
    () =>
      rows.filter(
        (row) =>
          matchesTopologyFilter(row, topologyFilter) &&
          matchesOperabilityFilter(row, operabilityFilter),
      ),
    [operabilityFilter, rows, topologyFilter],
  );
  const tree = useMemo(() => buildWorkspaceCellTree(filteredRows), [filteredRows]);
  const cellCounts = countCellsByKind(shape);

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <label className="grid gap-1 text-xs text-stone-400">
          shape
          <select
            value={topologyFilter}
            onChange={(event) => setTopologyFilter(event.target.value as TopologyFilter)}
            className="h-9 rounded border border-stone-700 bg-stone-950 px-2 text-xs text-stone-100 outline-none focus:border-teal-400"
          >
            {topologyFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs text-stone-400">
          Ambo
          <select
            value={operabilityFilter}
            onChange={(event) => setOperabilityFilter(event.target.value as OperabilityFilter)}
            className="h-9 rounded border border-stone-700 bg-stone-950 px-2 text-xs text-stone-100 outline-none focus:border-teal-400"
          >
            <option value="all">all</option>
            <option value="operable">can take Ambo</option>
            <option value="disabled">can&apos;t take Ambo</option>
          </select>
        </label>
      </div>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded border border-stone-800 bg-stone-950 px-2 py-2">
          <dt className="text-stone-500">cells</dt>
          <dd className="mt-1 text-stone-200">{shape.cells.length}</dd>
        </div>
        <div className="rounded border border-stone-800 bg-stone-950 px-2 py-2">
          <dt className="text-stone-500">core</dt>
          <dd className="mt-1 text-stone-200">{cellCounts.core}</dd>
        </div>
        <div className="rounded border border-stone-800 bg-stone-950 px-2 py-2">
          <dt className="text-stone-500">residue</dt>
          <dd className="mt-1 text-stone-200">{cellCounts.residue}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-stone-500">
        {filteredRows.length} of {countNoun(rows.length, 'cell')}
      </p>
      <div className="mt-3 grid max-h-[calc(100vh-17rem)] gap-2 overflow-y-auto pr-1">
        {tree.roots.length ? (
          tree.roots.map((row) => (
            <WorkspaceCellTreeRow
              key={row.id}
              row={row}
              rows={rows}
              childrenByParent={tree.childrenByParent}
              depth={0}
              selectedCellId={selectedCellId}
              onSelect={selectCell}
            />
          ))
        ) : (
          <p className="text-sm text-stone-500">no cells match</p>
        )}
      </div>
    </>
  );
}

/** COPY-1 §5.4 cells — a cell's row: `octahedron` (no id line) · its chip `can take Ambo`, or its state · `core · active · generation 1 ·
 * no children` · `parent: the seed tetrahedron` (`no parent`; `parent: not in this shape`) */
function WorkspaceCellTreeRow({
  row,
  rows,
  childrenByParent,
  depth,
  selectedCellId,
  onSelect,
}: {
  row: WorkspaceCellRow;
  rows: WorkspaceCellRow[];
  childrenByParent: Map<string, WorkspaceCellRow[]>;
  depth: number;
  selectedCellId: string | null;
  onSelect: (cellId: string | null) => void;
}) {
  const children = childrenByParent.get(row.id) ?? [];
  const isSelected = row.id === selectedCellId;
  const isExpanded = row.lifecycleStatus !== 'active';

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={() => onSelect(row.id)}
        aria-pressed={isSelected}
        style={{ paddingLeft: 12 + depth * 14 }}
        className={`rounded border py-2 pr-3 text-left text-sm transition ${
          isSelected
            ? 'border-amber-300 bg-amber-300/10 text-amber-100'
            : isExpanded
              ? 'border-stone-900 bg-stone-950/50 text-stone-500 hover:border-stone-700'
            : 'border-stone-800 bg-stone-950 text-stone-300 hover:border-stone-600'
        }`}
      >
        <span className="flex items-start justify-between gap-2">
          <span className="block min-w-0 truncate font-medium text-stone-100">{shapeWords(row.topology) ?? row.kind}</span>
          <span
            className={`shrink-0 rounded border px-2 py-0.5 text-xs ${
              row.isOperable
                ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                : isExpanded
                  ? 'border-amber-400/30 bg-amber-400/10 text-amber-200'
                : 'border-stone-700 bg-stone-900 text-stone-500'
            }`}
          >
            {row.isOperable ? 'can take Ambo' : getCellLifecycleStatusLabel(row.lifecycleStatus)}
          </span>
        </span>
        <span className="mt-2 block truncate text-xs text-stone-500">
          {cellRowLine(row)}
        </span>
        <span className="mt-1 block truncate text-xs text-stone-600">
          {formatParentLabel(row, rows)}
        </span>
      </button>
      {children.map((child) => (
        <WorkspaceCellTreeRow
          key={child.id}
          row={child}
          rows={rows}
          childrenByParent={childrenByParent}
          depth={depth + 1}
          selectedCellId={selectedCellId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

/** `no children` · `1 child` · `2 children` */
// the cells row's line: `seed · dissected · generation 0 · 5 children` · `core · active · generation 1 · no children` — the kind word
// (`cellKindWord`) and the state; a parent-kind cell above generation 0 is `dissected` by kind and by state, said once
/** the designer's 16:06 (2): the row's CHIP carries the state (`can take Ambo` or the lifecycle word), so the line never repeats it —
 * `seed · generation 0 · 5 children` · `core · generation 1 · no children` (a parent above generation 0 is `dissected` by KIND, said here once) */
function cellRowLine(row: WorkspaceCellRow): string {
  const kind = cellKindWord(row.kind, row.generationDepth);
  // the designer's gate (12:32 §1): the row's CHIP already says the state; a kind word that is the same word (`dissected` on a parent above
  // generation 0) is said once — `octahedron · dissected · generation 1 · 7 children`, never `dissected · dissected`
  const chip = row.isOperable ? 'can take Ambo' : getCellLifecycleStatusLabel(row.lifecycleStatus);
  return [kind === chip ? null : kind, `generation ${row.generationDepth}`, childrenWords(row.childCount)].filter((x): x is string => x !== null).join(' · ');
}

function childrenWords(count: number): string {
  return count === 0 ? 'no children' : countNoun(count, 'child', 'children');
}

/** COPY-1 §5.4 cells — **Ambo, by shape**: a group per shape — `octahedron` · `1 active: Ambo applies` (`1 active, 1 dissected: …`;
 * `Ambo applies to 2 of 4`; `Ambo doesn't apply`; `no active cells`) · `6 vertices, 12 edges, 8 faces` (`, mixed`) · its readiness
 * (P2). Opened: `state: …` · `why not: …` · the counts · `face sizes: …` · `vertex degrees: …` · `checks: …` · `what Ambo would make: …`
 * · `core faces: …` · `residue cells: …` · `core: octahedron` (`core not classified`) · `select one` */
function AmboSupportFrontier() {
  const shape = useCurrentShape();
  const selectCell = useGeometryStore((state) => state.selectCell);
  const groups = useMemo(() => getTopologyFrontierRows(shape), [shape]);

  return (
    <div className="border-t border-stone-800 pt-4">
      <h2 className="text-xs font-semibold text-stone-500">
        Ambo, by shape
      </h2>
      <div className="mt-3 grid gap-2">
        {groups.map((group) => (
          <AmboSupportFrontierRow
            key={group.topology}
            group={group}
            shape={shape}
            onSelectCell={selectCell}
          />
        ))}
      </div>
    </div>
  );
}

function AmboSupportFrontierRow({
  group,
  shape,
  onSelectCell,
}: {
  group: TopologyFrontierGroup;
  shape: Shape;
  onSelectCell: (cellId: string | null) => void;
}) {
  const activeCells = group.cells.filter((cell) => isCellActiveFrontier(shape, cell.id));
  const expandedCount = group.cells.length - activeCells.length;
  const enabledCount = activeCells.filter((cell) =>
    defaultOperation.canApply({ shape, selectedCellId: cell.id, selectedCell: cell }),
  ).length;
  const disabledActiveCount = activeCells.length - enabledCount;
  const disabledReasons = Array.from(
    new Set(
      activeCells
        .filter(
          (cell) => !defaultOperation.canApply({ shape, selectedCellId: cell.id, selectedCell: cell }),
        )
        .map((cell) =>
          defaultOperation.getDisabledReason({ shape, selectedCellId: cell.id, selectedCell: cell }),
        )
        .filter((reason): reason is string => Boolean(reason)),
    ),
  );
  const signature = group.representative;
  const readinessClassName =
    signature.readinessStatus === 'enabled'
      ? 'text-emerald-200'
      : signature.readinessStatus.startsWith('blocked')
        ? 'text-rose-200'
        : 'text-amber-200';
  const stateWords = activeCells.length
    ? `${activeCells.length} active${expandedCount ? `, ${expandedCount} dissected` : ''}: ${formatAmboStatus(enabledCount, activeCells.length)}`
    : `no active cells${expandedCount ? `, ${expandedCount} dissected` : ''}`;

  return (
    <details className="rounded border border-stone-800 bg-stone-950 px-3 py-2 text-sm">
      <summary className="cursor-pointer list-none">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="block truncate font-medium text-stone-100">{shapeWords(group.topology) ?? group.topology}</span>
            <span className="mt-1 block text-xs text-stone-500">{stateWords}</span>
          </span>
          <span
            className={`shrink-0 rounded border px-2 py-0.5 text-xs ${
              enabledCount
                ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'
                : 'border-stone-700 bg-stone-900 text-stone-500'
            }`}
          >
            {activeCells.length ? (enabledCount ? 'can take Ambo' : "can't take Ambo") : 'past'}
          </span>
        </span>
        <span className="mt-2 block truncate text-xs text-stone-500">
          {formatCompactSignature(signature)}
          {group.signaturesVary ? ', mixed' : ''}
        </span>
        <span className={`mt-1 block truncate text-xs ${readinessClassName}`}>
          {readinessWords(signature.readinessStatus)}
        </span>
      </summary>

      <div className="mt-3 grid gap-3 border-t border-stone-800 pt-3 text-xs">
        {expandedCount ? (
          <div className="rounded border border-stone-800 bg-stone-900/60 px-2 py-2 text-stone-400">
            <span className="block leading-5">
              state: {activeCells.length} active, {expandedCount} dissected
            </span>
          </div>
        ) : null}

        {disabledReasons.length || (!activeCells.length && expandedCount) ? (
          <div className="rounded border border-stone-800 bg-stone-900/60 px-2 py-2 text-stone-400">
            <span className="block leading-5">
              why not: {disabledReasons[0] ?? 'this cell has already been dissected'}
            </span>
            {disabledReasons.length > 1 ? (
              <span className="mt-1 block text-stone-600">
                + {countNoun(disabledReasons.length - 1, 'more reason')}
              </span>
            ) : null}
          </div>
        ) : null}

        <dl className="grid grid-cols-3 gap-2">
          <MetricBox label="vertices" value={signature.vertexCount} />
          <MetricBox label="edges" value={signature.edgeCount} />
          <MetricBox label="faces" value={signature.faceCount} />
        </dl>
        <dl className="grid grid-cols-2 gap-2">
          <MetricBox label="active, can't take Ambo" value={disabledActiveCount} />
          <MetricBox label="dissected" value={expandedCount} />
        </dl>

        <dl className="grid gap-1 text-stone-400">
          <dt className="text-stone-500">face sizes</dt>
          <dd>{faceSizesWords(signature.faceSizeHistogram)}</dd>
          <dt className="text-stone-500">vertex degrees</dt>
          <dd>{vertexDegreesWords(signature.vertexDegreeHistogram)}</dd>
          <dt className="text-stone-500">checks</dt>
          <dd>{formatReadinessDetails(signature)}</dd>
        </dl>

        {signature.preview ? (
          <div className="rounded border border-stone-800 bg-stone-900/60 px-2 py-2 text-stone-400">
            <span className="block leading-5">
              what Ambo would make: {signature.preview.midpointVertexCount} midpoints,{' '}
              {countNoun(signature.preview.residueCellCount, 'residue cell')},{' '}
              {countNoun(signature.preview.totalCoreFaceCount, 'core face')}
            </span>
            <span className="block leading-5">
              core faces: {signature.preview.coreSourceFaceFaceCount} from faces,{' '}
              {signature.preview.coreSourceVertexFaceCount} from vertices
            </span>
            <span className="block leading-5">
              residue cells: {signature.preview.residueTypes.join(' · ')}
            </span>
            <span className="block leading-5">{signature.preview.coreClassification}</span>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => onSelectCell(group.cells[0]?.id ?? null)}
          className="h-8 rounded border border-stone-700 bg-stone-900 px-2 text-xs text-stone-200 transition hover:border-stone-500 hover:bg-stone-800"
        >
          select one
        </button>
      </div>
    </details>
  );
}

function MetricBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded border border-stone-800 bg-stone-900/60 px-2 py-2">
      <dt className="text-stone-500">{label}</dt>
      <dd className="mt-1 text-stone-200">{value}</dd>
    </div>
  );
}

/** COPY-1 §5.4 cells — **genealogy**: every shape of the session (the shape's name · `generation 1` · `from Tetrahedron`, the parent
 * shape's name, never its id; the seed reads `the seed` · `Ambo Dissection · 1 seed, 1 core, 4 residue`), then `history` · `undone` ·
 * `cells by generation` (`Ambo Dissection · generation 1 · 5 cells, 6 vertices`). C-12a item 3 (§144, Δ95) — THE WAY BACK: choosing an
 * earlier shape makes it current (`selectShape` keeps only the selections the chosen shape holds). */
export function GenealogyViewer() {
  const shapes = useGeometryStore((state) => state.shapes);
  const shapeOrder = useGeometryStore((state) => state.shapeOrder);
  const currentShapeId = useGeometryStore((state) => state.currentShapeId);
  const selectShape = useGeometryStore((state) => state.selectShape);
  const operationHistory = useGeometryStore((state) => state.operationHistory);
  const redoOperationHistory = useGeometryStore((state) => state.redoOperationHistory);
  const currentShape = shapes[currentShapeId];

  return (
    <Panel title="genealogy">
      <div className="grid gap-2">
        {shapeOrder.map((shapeId) => {
          const shape = shapes[shapeId];
          const isCurrent = shapeId === currentShapeId;
          const parentId = shape.genealogy.parentShapeId;
          // `from Tetrahedron` — the parent shape's name, never its id; the seed shape's operation line already reads `the seed`, so no parent line repeats it
          const parentWords = parentId ? `from ${shapes[parentId]?.name ?? 'a shape no longer here'}` : null;

          return (
            <button
              key={shapeId}
              type="button"
              onClick={() => selectShape(shapeId)}
              className={`rounded border px-3 py-2 text-left text-sm transition ${
                isCurrent
                  ? 'border-teal-400 bg-teal-400/10 text-teal-100'
                  : 'border-stone-800 bg-stone-950 text-stone-300 hover:border-stone-600'
              }`}
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-medium">{shape.name}</span>
                <span className="text-xs text-stone-500">generation {shape.genealogy.generationDepth}</span>
              </span>
              {parentWords ? <span className="mt-1 block truncate text-xs text-stone-500">{parentWords}</span> : null}
              <span className="mt-1 block text-xs text-stone-500">
                {operationWords(shape.genealogy.operation)} · {cellKindCountsWords(shape)}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 border-t border-stone-800 pt-4">
        <h3 className="mb-2 text-xs font-semibold text-stone-500">history</h3>
        <OperationHistoryList entries={operationHistory} />
        {redoOperationHistory.length ? (
          <div className="mt-4">
            <h3 className="mb-2 text-xs font-semibold text-stone-500">undone</h3>
            <OperationHistoryList entries={redoOperationHistory} isRedoBranch />
          </div>
        ) : null}
      </div>
      <div className="mt-4 border-t border-stone-800 pt-4">
        <h3 className="mb-2 text-xs font-semibold text-stone-500">cells by generation</h3>
        <div className="grid gap-2">
          {currentShape.generations.map((generation) => (
            <div
              key={generation.id}
              className="rounded border border-stone-800 bg-stone-950 px-3 py-2 text-sm"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-stone-200">{operationWords(generation.sourceOperation)}</span>
                <span className="text-xs text-stone-500">generation {generation.depth}</span>
              </span>
              <span className="mt-1 block text-xs text-stone-500">
                {countNoun(generation.createdCellIds.length, 'cell')}, {countNoun(generation.createdVertexIds.length, 'vertex', 'vertices')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

/** COPY-1 §5.4 — the history's entries: `the seed: Tetrahedron` · `reset: Tetrahedron` · `Ambo Dissection`, each with `generation 1`,
 * `on a tetrahedron` (its target by shape — never by id; left out without a recorded shape) and `made 5 cells`; empty: `nothing yet` */
function OperationHistoryList({
  entries,
  isRedoBranch = false,
}: {
  entries: OperationHistoryEntry[];
  isRedoBranch?: boolean;
}) {
  if (!entries.length) {
    return <p className="text-sm text-stone-500">nothing yet</p>;
  }

  return (
    <div className="grid gap-2">
      {entries.map((entry) => {
        const target = historyTargetWords(entry);
        return (
          <div
            key={entry.id}
            data-history-entry={entry.operationId}
            className={`rounded border px-3 py-2 text-sm ${
              isRedoBranch
                ? 'border-stone-800 bg-stone-950/60 text-stone-500'
                : 'border-stone-800 bg-stone-950 text-stone-300'
            }`}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="font-medium text-stone-200">{historyWords(entry.label)}</span>
              <span className="text-xs text-stone-500">generation {entry.generationDepth}</span>
            </span>
            {target ? <span className="mt-1 block truncate text-xs text-stone-500">{target}</span> : null}
            <span className="mt-1 block text-xs text-stone-500">made {countNoun(entry.producedCellCount, 'cell')}</span>
          </div>
        );
      })}
    </div>
  );
}

export function VertexDataPacketEditor() {
  return (
    <Panel title="Vertex Data Packet">
      <VertexPacketEditorContent />
    </Panel>
  );
}

function useCurrentShape() {
  const shapes = useGeometryStore((state) => state.shapes);
  const currentShapeId = useGeometryStore((state) => state.currentShapeId);

  return useMemo(() => shapes[currentShapeId], [currentShapeId, shapes]);
}

function findCell(shape: Shape, cellId: string | null): Cell | null {
  if (!cellId) {
    return null;
  }

  return shape.cells.find((cell) => cell.id === cellId) ?? null;
}

// B-110 §4: the leaning-residue word's SITE predicate — does this cell stand
// on vertices R1 actually moved? Read from the relaxation's own positive mark
// (one producer, exported by the op), never inferred from a topology name: a
// cell could be named `pyritohedral-icosahedron` and stand unrelaxed (the
// recognizer refuses rotated frames and carries positions verbatim), and that
// cell must say nothing.
function cellCarriesR1Relaxation(shape: Shape, cell: Cell): boolean {
  return cell.vertexIds.some((id) => shape.vertices[id]?.data.tags.includes(R1_RELAXATION_MARK));
}

function describeCellTopology(cell: Cell): string {
  if (cell.topology) {
    return cell.topology;
  }

  if (cell.kind === 'seed') {
    return 'tetrahedron';
  }

  if (cell.kind === 'core' && cell.vertexIds.length === 6) {
    return 'octahedron';
  }

  if (cell.kind === 'core' && cell.vertexIds.length === 12) {
    return 'cuboctahedron';
  }

  if (cell.kind === 'residue' && cell.vertexIds.length === 4) {
    return 'tetrahedron';
  }

  if (cell.kind === 'residue' && cell.vertexIds.length === 5) {
    return 'square-pyramid';
  }

  return 'unknown';
}

function getCellFaces(shape: Shape, cell: Cell): Face[] {
  const facesById = new Map(shape.faces.map((face) => [face.id, face]));

  return cell.faceIds
    .map((faceId) => facesById.get(faceId))
    .filter((face): face is Face => Boolean(face));
}

function getCellEdges(shape: Shape, cell: Cell): CellEdgeRow[] {
  const edges = new Map<string, CellEdgeRow>();
  const shapeEdgesByKey = new Map(
    shape.edges.map((edge) => [canonicalVertexPairKey(...edge.vertexIds), edge]),
  );

  for (const face of getCellFaces(shape, cell)) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = canonicalVertexPairKey(a, b);
      const edge = shapeEdgesByKey.get(key);
      const isConstructionDiagonal = edge?.role === 'construction-diagonal';

      if (!edges.has(key)) {
        edges.set(key, {
          id: key,
          edgeId: edge?.id ?? null,
          vertexIds: [a, b],
          displayLabel: formatEdgeRef(shape, [a, b]),
          secondaryLabel: formatEdgeSecondaryLabel(shape, edge),
          roleLabel: isConstructionDiagonal ? 'construction diagonal' : null,
        });
      }
    }
  }

  return Array.from(edges.values()).sort((a, b) => a.displayLabel.localeCompare(b.displayLabel));
}

// COPY-1 §5.4 parts — an edge's second line: `from face A·B·C` · `from edge A–B`, by name; nothing where no source is held (the ids are gone)
function formatEdgeSecondaryLabel(
  shape: Shape,
  edge: Shape['edges'][number] | undefined,
): string | null {
  if (!edge) return null;
  const parts: string[] = [];
  if (edge.sourceFaceId) {
    const found = faceThroughAncestors(shape, edge.sourceFaceId);
    if (found) parts.push(`from face ${getPacketDataDisplayLabel(found.face.data) ?? faceDisplayName(found.in, found.face, () => 'unnamed')}`);
  }
  if (edge.sourceEdgeId) {
    const source = shape.edges.find((candidate) => candidate.id === edge.sourceEdgeId);
    if (source) parts.push(`from edge ${formatEdgeRef(shape, source.vertexIds)}`);
  }
  return parts.length ? parts.join(' · ') : null;
}

function getCellVertexRows(shape: Shape, cell: Cell): CellVertexRow[] {
  return cell.vertexIds
    .map((vertexId) => shape.vertices[vertexId])
    .filter((vertex): vertex is Vertex => Boolean(vertex))
    .map((vertex) => {
      const role = inferCellVertexRole(cell, vertex);

      return {
        vertex,
        displayLabel: getVertexDisplayLabel(shape, vertex.id),
        role,
        packetDetail: formatVertexPacketDetail(vertex),
        lineageSummary:
          role === 'preserved source'
            ? 'kept from the source'
            : formatVertexLineageSummary(shape, vertex),
      };
    });
}

function getCellFaceRows(shape: Shape, faces: Face[]): CellFaceRow[] {
  return faces.map((face) => ({
    face,
    displayName: faceDisplayName(shape, face, () => 'unnamed'),
    size: face.vertexIds.length,
    lineageSummary: formatFaceLineageSummary(shape, face),
  }));
}

function getPacketWorkbenchRows(shape: Shape): PacketWorkbenchRow[] {
  return Object.values(shape.vertices)
    .map((vertex) => {
      const containingCells = getContainingCells(shape, vertex.id).sort(
        compareCellsForPacketContext,
      );
      const containingFaces = getContainingFaces(shape, vertex.id);

      return {
        vertex,
        displayLabel: getVertexDisplayLabel(shape, vertex.id),
        shortId: shortenId(vertex.id),
        role: getVertexRole(vertex),
        status: getVertexPacketStatus(shape, vertex),
        containingCells,
        containingCellCount: containingCells.length,
        containingFaceCount: containingFaces.length,
        generationDepth: getVertexGenerationDepth(containingCells),
        lineageSummary: formatVertexLineageSummary(shape, vertex),
      };
    })
    .sort(comparePacketRows);
}

function filterPacketRows(
  rows: PacketWorkbenchRow[],
  filter: PacketWorkbenchFilter,
): PacketWorkbenchRow[] {
  if (filter === 'all') {
    return rows;
  }

  if (filter === 'unresolved-generated') {
    return rows.filter(isUnresolvedGeneratedPacketRow);
  }

  if (filter === 'generated-midpoints') {
    return rows.filter((row) => isGeneratedMidpointVertex(row.vertex));
  }

  if (filter === 'source') {
    return rows.filter((row) => row.role === 'seed/source' || row.role === 'preserved source');
  }

  if (filter === 'empty') {
    return rows.filter((row) => row.status === 'empty' || row.status === 'lineage-only');
  }

  return rows.filter((row) => row.status === 'named');
}

function packetRowMatchesSearch(row: PacketWorkbenchRow, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return getPacketRowSearchText(row).toLowerCase().includes(normalizedQuery);
}

// COPY-1 §5.4 — the search reads what its placeholder says (`search names, notes and tags`): a vertex's name, its notes and its tags.
// An id is not on the page (rule 5), so it is not in the search: a word that matched an id would show a row for a reason he cannot see.
function getPacketRowSearchText(row: PacketWorkbenchRow): string {
  const { vertex } = row;
  const fields: Array<string | null | undefined> = [row.displayLabel, vertex.data.label, vertex.data.notes, ...vertex.data.tags];

  return fields.filter(isPacketSearchField).join('\n');
}

function isPacketSearchField(value: string | null | undefined): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function formatPacketCellContext(
  row: PacketWorkbenchRow,
  selectedCellId: string | null,
): string {
  const cellCountLabel = `${row.containingCellCount} ${
    row.containingCellCount === 1 ? 'cell' : 'cells'
  }`;
  const selectedContainingCell = selectedCellId
    ? row.containingCells.find((cell) => cell.id === selectedCellId)
    : null;

  if (selectedContainingCell) {
    return `in ${cellCountLabel}, including the selected one`;
  }

  const firstContainingCell = row.containingCells[0];

  if (firstContainingCell) {
    return `in ${cellCountLabel}, first ${formatPacketContextCell(firstContainingCell)}`;
  }

  return row.containingCellCount ? `in ${cellCountLabel}` : 'in no cell';
}

function choosePacketContainingCell(
  row: PacketWorkbenchRow,
  selectedCellId: string | null,
): Cell | null {
  const selectedContainingCell = selectedCellId
    ? row.containingCells.find((cell) => cell.id === selectedCellId)
    : null;

  return selectedContainingCell ?? row.containingCells[0] ?? null;
}

// COPY-1 §5.4 — `a core octahedron (generation 1)`
function formatPacketContextCell(cell: Cell): string {
  return `${withArticle(cellWordsOf(cell))} (generation ${cell.generationDepth})`;
}

function compareCellsForPacketContext(a: Cell, b: Cell): number {
  return (
    a.generationDepth - b.generationDepth ||
    a.kind.localeCompare(b.kind) ||
    describeCellTopology(a).localeCompare(describeCellTopology(b)) ||
    a.id.localeCompare(b.id)
  );
}

function isUnresolvedGeneratedPacketRow(row: PacketWorkbenchRow): boolean {
  return (
    isGeneratedMidpointVertex(row.vertex) &&
    (row.status === 'empty' || row.status === 'lineage-only')
  );
}

function findNextUnresolvedVertex(
  rows: PacketWorkbenchRow[],
  currentVertexId: VertexId | null,
): PacketWorkbenchRow | null {
  if (!rows.length) {
    return null;
  }

  const currentIndex = currentVertexId
    ? rows.findIndex((row) => row.vertex.id === currentVertexId)
    : -1;

  return rows[(currentIndex + 1 + rows.length) % rows.length];
}

function findPreviousUnresolvedVertex(
  rows: PacketWorkbenchRow[],
  currentVertexId: VertexId | null,
): PacketWorkbenchRow | null {
  if (!rows.length) {
    return null;
  }

  const currentIndex = currentVertexId
    ? rows.findIndex((row) => row.vertex.id === currentVertexId)
    : -1;
  const nextIndex = currentIndex >= 0 ? currentIndex - 1 : rows.length - 1;

  return rows[(nextIndex + rows.length) % rows.length];
}

function getContainingCells(shape: Shape, vertexId: VertexId): Cell[] {
  return shape.cells.filter((cell) => cell.vertexIds.includes(vertexId));
}

function getContainingFaces(shape: Shape, vertexId: VertexId): Face[] {
  return shape.faces.filter((face) => face.vertexIds.includes(vertexId));
}

function getVertexRole(vertex: Vertex): string {
  if (isGeneratedMidpointVertex(vertex)) {
    return 'generated midpoint';
  }

  if (vertex.data.lineage?.inheritanceMode === 'preserved') {
    return 'preserved source';
  }

  if (
    vertex.createdBy.operation === 'seed' ||
    vertex.data.lineage?.inheritanceMode === 'default'
  ) {
    return 'seed/source';
  }

  return 'unknown';
}

function getVertexPacketStatus(shape: Shape, vertex: Vertex): PacketStatus {
  if (hasNamedPacketContent(shape, vertex)) {
    return 'named';
  }

  if (hasAnnotatedPacketContent(vertex.data)) {
    return 'annotated';
  }

  if (isGeneratedMidpointVertex(vertex) && vertex.data.lineage) {
    return 'lineage-only';
  }

  return 'empty';
}

function hasNamedPacketContent(shape: Shape, vertex: Vertex): boolean {
  return Boolean(
    getPacketDataString(vertex.data.custom, 'title') ||
      getPacketDataString(vertex.data.custom, 'name') ||
      getUserAuthoredPacketLabel(shape, vertex),
  );
}

function hasAnnotatedPacketContent(packet: VertexDataPacket): boolean {
  return Boolean(
    getFirstMeaningfulLine(packet.notes) ||
      getPacketDataString(packet.custom, 'summary') ||
      getPacketDataString(packet.custom, 'description') ||
      getPacketDataString(packet.custom, 'body') ||
      packet.tags.length,
  );
}

// C-13b (F4; the mothership's C-13 · M1): the person's name is read from the packet's positive mark through the ONE judge
// (src/lib/christening.ts) — never inferred by comparing the slot with the corners' current labels (the judge that did so
// read a stale composed string as a name once a corner was renamed)
function getUserAuthoredPacketLabel(_shape: Shape, vertex: Vertex): string | null {
  return givenLabelOf(vertex);
}

function isGeneratedMidpointVertex(vertex: Vertex): boolean {
  return (
    Boolean(vertex.createdBy.sourceEdgeId) ||
    vertex.data.lineage?.inheritanceMode === 'derived-from-edge'
  );
}

function getVertexGenerationDepth(containingCells: Cell[]): number | null {
  if (!containingCells.length) {
    return null;
  }

  return Math.min(...containingCells.map((cell) => cell.generationDepth));
}

function comparePacketRows(a: PacketWorkbenchRow, b: PacketWorkbenchRow): number {
  return (
    packetStatusSortOrder(a.status) - packetStatusSortOrder(b.status) ||
    a.role.localeCompare(b.role) ||
    (a.generationDepth ?? Number.MAX_SAFE_INTEGER) -
      (b.generationDepth ?? Number.MAX_SAFE_INTEGER) ||
    a.displayLabel.localeCompare(b.displayLabel) ||
    a.vertex.id.localeCompare(b.vertex.id)
  );
}

function packetStatusSortOrder(status: PacketStatus): number {
  if (status === 'lineage-only') {
    return 0;
  }

  if (status === 'empty') {
    return 1;
  }

  if (status === 'annotated') {
    return 2;
  }

  return 3;
}

// COPY-1 P2 — `named` · `notes only` · `not named`
function formatPacketStatus(status: PacketStatus): string {
  if (status === 'annotated') return 'notes only';
  if (status === 'named') return 'named';
  return 'not named';
}

function packetStatusClassName(status: PacketStatus): string {
  const base = 'shrink-0 rounded border px-2 py-0.5 text-xs';

  if (status === 'named') {
    return `${base} border-emerald-400/40 bg-emerald-400/10 text-emerald-200`;
  }

  if (status === 'annotated') {
    return `${base} border-cyan-400/40 bg-cyan-400/10 text-cyan-200`;
  }

  if (status === 'lineage-only') {
    return `${base} border-amber-400/40 bg-amber-400/10 text-amber-200`;
  }

  return `${base} border-stone-700 bg-stone-900 text-stone-500`;
}

function inferCellVertexRole(cell: Cell, vertex: Vertex): string {
  if (cell.preservedVertexId === vertex.id) {
    return 'preserved source';
  }

  if (
    vertex.createdBy.sourceEdgeId ||
    vertex.data.lineage?.inheritanceMode === 'derived-from-edge'
  ) {
    return 'generated midpoint';
  }

  if (
    vertex.createdBy.operation === 'seed' ||
    vertex.data.lineage?.inheritanceMode === 'default'
  ) {
    return 'seed/source';
  }

  if (cell.sourceVertexIds.includes(vertex.id)) {
    return 'source';
  }

  return 'unknown';
}

function canonicalVertexPairKey(a: VertexId, b: VertexId): string {
  return [a, b].sort().join('|');
}

function getWorkspaceCellRows(shape: Shape): WorkspaceCellRow[] {
  const cellIds = new Set(shape.cells.map((cell) => cell.id));

  return [...shape.cells]
    .sort(compareCellsForBrowser)
    .map((cell) => {
      const operationContext = {
        shape,
        selectedCellId: cell.id,
        selectedCell: cell,
      };
      const isOperable = defaultOperation.canApply(operationContext);
      const lifecycleStatus = getCellLifecycleStatus(shape, cell.id);

      return {
        cell,
        id: cell.id,
        shortId: shortenId(cell.id),
        topology: describeCellTopology(cell),
        kind: cell.kind,
        generationDepth: cell.generationDepth,
        parentCellId: cell.parentCellId,
        parentKnown: Boolean(cell.parentCellId && cellIds.has(cell.parentCellId)),
        childCount: getCellChildCount(shape, cell.id),
        lifecycleStatus,
        isOperable,
        disabledReason: isOperable ? null : defaultOperation.getDisabledReason(operationContext),
      };
    });
}

function buildWorkspaceCellTree(rows: WorkspaceCellRow[]): {
  roots: WorkspaceCellRow[];
  childrenByParent: Map<string, WorkspaceCellRow[]>;
} {
  const visibleIds = new Set(rows.map((row) => row.id));
  const roots: WorkspaceCellRow[] = [];
  const childrenByParent = new Map<string, WorkspaceCellRow[]>();

  for (const row of rows) {
    if (row.parentCellId && visibleIds.has(row.parentCellId)) {
      const siblings = childrenByParent.get(row.parentCellId) ?? [];

      siblings.push(row);
      childrenByParent.set(row.parentCellId, siblings);
    } else {
      roots.push(row);
    }
  }

  roots.sort(compareRowsForBrowser);
  childrenByParent.forEach((children) => children.sort(compareRowsForBrowser));

  return { roots, childrenByParent };
}

function compareCellsForBrowser(a: Cell, b: Cell): number {
  return (
    a.generationDepth - b.generationDepth ||
    describeCellTopology(a).localeCompare(describeCellTopology(b)) ||
    a.kind.localeCompare(b.kind) ||
    a.id.localeCompare(b.id)
  );
}

function compareRowsForBrowser(a: WorkspaceCellRow, b: WorkspaceCellRow): number {
  return (
    a.generationDepth - b.generationDepth ||
    a.topology.localeCompare(b.topology) ||
    a.kind.localeCompare(b.kind) ||
    a.id.localeCompare(b.id)
  );
}

function matchesTopologyFilter(row: WorkspaceCellRow, filter: TopologyFilter): boolean {
  if (filter === 'all') {
    return true;
  }

  if (filter === 'other') {
    return !topologyFilterOptions.some(
      (option) => option.value !== 'all' && option.value !== 'other' && option.value === row.topology,
    );
  }

  return row.topology === filter;
}

function matchesOperabilityFilter(row: WorkspaceCellRow, filter: OperabilityFilter): boolean {
  if (filter === 'operable') {
    return row.isOperable;
  }

  if (filter === 'disabled') {
    return !row.isOperable;
  }

  return true;
}

function shortenId(id: string): string {
  return id.length > 34 ? `${id.slice(0, 18)}...${id.slice(-10)}` : id;
}

function formatWorkspaceTimestamp(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    '-',
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('');
}

// COPY-1 §5.4 cells — `Ambo applies` · `Ambo doesn't apply` · `Ambo applies to 2 of 4` (the group's line says `no active cells` itself)
function formatAmboStatus(enabledCount: number, totalCount: number): string {
  if (enabledCount === totalCount) {
    return 'Ambo applies';
  }

  if (enabledCount === 0) {
    return "Ambo doesn't apply";
  }

  return `Ambo applies to ${enabledCount} of ${totalCount}`;
}

// P2 — `6 vertices, 12 edges, 8 faces`
function formatCompactSignature(signature: CellTopologySignature): string {
  return `${countNoun(signature.vertexCount, 'vertex', 'vertices')}, ${countNoun(signature.edgeCount, 'edge')}, ${countNoun(signature.faceCount, 'face')}`;
}

// `checks: faces ordered, edges derived, rings valid`; its problems in the signature's own words (`not classified` · `2 vertices missing` · …)
function formatReadinessDetails(signature: CellTopologySignature): string {
  if (!signature.readinessProblems.length) {
    return [
      signature.hasOrderedFaces ? 'faces ordered' : 'faces not ordered',
      signature.hasValidDerivedEdges ? 'edges derived' : 'edges not derived',
      signature.hasValidVertexIncidentRings ? 'rings valid' : 'rings not valid',
    ].join(', ');
  }

  return signature.readinessProblems.join(' · ');
}

function getPacketDisplayLabel(packet: VertexDataPacket): string | null {
  return (
    getPacketDataString(packet.custom, 'title') ??
    getMeaningfulText(packet.label) ??
    getPacketDataString(packet.custom, 'name') ??
    getPacketDataString(packet.custom, 'summary') ??
    getPacketDataString(packet.custom, 'description') ??
    getFirstMeaningfulLine(packet.notes)
  );
}

function getPacketDataDisplayLabel(data: Cell['data']): string | null {
  return (
    getPacketDataString(data, 'title') ??
    getPacketDataString(data, 'label') ??
    getPacketDataString(data, 'name') ??
    getPacketDataString(data, 'summary') ??
    getPacketDataString(data, 'description') ??
    getPacketDataString(data, 'notes')
  );
}

// COPY-1 rule 5 — a vertex by its name; with none, `unnamed` (never its id)
function getVertexDisplayLabel(shape: Shape, vertexId: VertexId): string {
  const vertex = shape.vertices[vertexId];

  return vertex ? getPacketDisplayLabel(vertex.data) ?? 'unnamed' : 'unnamed';
}

// C-7h item 11 (CLAUDE.md §2.5 and §2.8 — the designer saw `face face:wpx1fn` in the card): a face is NAMED FROM ITS CORNERS
// by D14 (the one composer, through apertureModel's wrapper), and where that yields nothing the name slot's lawful absence
// word — NEVER its id; a face the shape no longer holds is said so, not addressed
function getFaceDisplayLabel(shape: Shape, faceId: string): string {
  // C-10b: a face this shape no longer holds is named through the workspace's ancestry when an ancestor holds it
  const found = faceThroughAncestors(shape, faceId);

  return found ? getPacketDataDisplayLabel(found.face.data) ?? faceDisplayName(found.in, found.face, () => 'unnamed') : 'a face this shape no longer holds';
}

// a cell by its name, else by its kind and shape (`the seed tetrahedron`), never its id (P1) — M14's one reader
function getCellDisplayLabel(shape: Shape, cellId: string): string {
  const cell = shape.cells.find((candidate) => candidate.id === cellId);

  return cell ? cellNameOrWords(cell) : 'a cell this shape no longer holds';
}

function formatVertexRef(shape: Shape, vertexId: VertexId): string {
  return getVertexDisplayLabel(shape, vertexId);
}

// P3 — an edge by its corners, `A–B`, the alphabetically-first corner first
function formatEdgeRef(shape: Shape, vertexIds: [VertexId, VertexId]): string {
  return vertexIds.map((id) => formatVertexRef(shape, id)).sort((a, b) => a.localeCompare(b)).join('–');
}

function formatSourceRef(shape: Shape, sourceRef: PacketSourceRef): string {
  if (sourceRef.kind === 'vertex') {
    return formatVertexRef(shape, sourceRef.id);
  }

  if (sourceRef.kind === 'edge') {
    const edge = shape.edges.find((candidate) => candidate.id === sourceRef.id);

    return edge ? formatEdgeRef(shape, edge.vertexIds) : 'an edge this shape no longer holds';
  }

  if (sourceRef.kind === 'face') {
    return getFaceDisplayLabel(shape, sourceRef.id);
  }

  return getCellDisplayLabel(shape, sourceRef.id);
}

function formatSourceRefs(shape: Shape, sources: PacketSourceRef[]): string {
  if (!sources.length) {
    return '';
  }

  const visibleSources = sources.slice(0, 3).map((source) => formatSourceRef(shape, source));
  const remainingCount = sources.length - visibleSources.length;

  return remainingCount > 0
    ? `${visibleSources.join(', ')} and ${remainingCount} more`
    : visibleSources.join(', ');
}

function getPacketDataString(data: Cell['data'], key: string): string | null {
  if (!data) {
    return null;
  }

  const value =
    data[key] ??
    Object.entries(data).find(([candidateKey]) => candidateKey.toLowerCase() === key)?.[1];

  return typeof value === 'string' ? getMeaningfulText(value) : null;
}

function getMeaningfulText(value: string | undefined): string | null {
  const trimmed = value?.trim();

  return trimmed ? trimmed : null;
}

function getFirstMeaningfulLine(value: string | undefined): string | null {
  return value
    ?.split(/\r?\n/)
    .map((line) => line.trim())
    .find(Boolean) ?? null;
}

/** MARKER LAYOUT-1 · M14 (the designer's 11:27, §280) — a cell by HIS name where it has one, else by its kind and shape with the article:
 * `the knower` · `the seed tetrahedron` (the dissected seed's copy, kind `parent`, at generation 0) · `the dissected octahedron` (a
 * parent-kind cell above it) · `the core octahedron`. The one reader wherever a cell's parent is named, as the hover readout already
 * leads with a name. Exported for the gesture-truth witness, which RUNS it. */
export function cellNameOrWords(cell: Cell): string {
  return getPacketDataDisplayLabel(cell.data) ?? `the ${cellWordsOf(cell)}`;
}

// a cell as a button names it (`the knower · seed tetrahedron, generation 0`), else its kind, shape and generation
function cellButtonWords(cell: Cell): string {
  const name = getPacketDataDisplayLabel(cell.data);
  const words = formatCellSummary(cell);
  return name ? `${name} · ${words}` : words;
}

// COPY-1 §5.4 cells — `parent: the seed tetrahedron` · `parent: the knower` (M14) · `no parent` · `parent: not in this shape` (never an id)
function formatParentLabel(row: WorkspaceCellRow, rows: WorkspaceCellRow[]): string {
  if (!row.parentCellId) {
    return 'no parent';
  }

  const parent = rows.find((candidate) => candidate.id === row.parentCellId);

  return parent ? `parent: ${cellNameOrWords(parent.cell)}` : 'parent: not in this shape';
}

function formatVertexPacketPreview(vertex: Vertex): string {
  return getPacketDisplayLabel(vertex.data) ?? 'unnamed';
}

function formatVertexPacketDetail(vertex: Vertex): string | null {
  if (vertex.data.tags.length) {
    return vertex.data.tags.slice(0, 2).join(', ');
  }

  const notesLine = getFirstMeaningfulLine(vertex.data.notes);
  const displayLabel = getPacketDisplayLabel(vertex.data);

  return notesLine && notesLine !== displayLabel ? notesLine : null;
}

function formatPacketDataSummary(data: Cell['data']): string {
  if (!data || !Object.keys(data).length) {
    return 'none';
  }

  const keys = Object.keys(data);

  return `${keys.length} fields`;
}

// COPY-1 P5 — `seed corner` · `kept from the source` · `midpoint of A–B` · `origin unknown`
function formatVertexLineageSummary(shape: Shape, vertex: Vertex): string {
  const lineage = vertex.data.lineage;

  if (!lineage) {
    return vertex.createdBy.operation === 'seed' ? 'seed corner' : 'origin unknown';
  }

  if (lineage.inheritanceMode === 'default' || vertex.createdBy.operation === 'seed') {
    return 'seed corner';
  }

  if (lineage.inheritanceMode === 'preserved') {
    return 'kept from the source';
  }

  if (lineage.inheritanceMode === 'derived-from-edge') {
    const endpoints = lineage.sources.filter(
      (source) => source.kind === 'vertex' && source.role === 'endpoint',
    );

    if (endpoints.length >= 2) {
      return `midpoint of ${formatEdgeRef(shape, [endpoints[0].id, endpoints[1].id])}`;
    }

    const sourceEdge = lineage.sources.find((source) => source.kind === 'edge');

    return sourceEdge
      ? `midpoint of ${formatSourceRef(shape, sourceEdge)}`
      : 'midpoint';
  }

  return formatLineageSummary(shape, lineage);
}

// COPY-1 P5 — `seed face` · `from face A·B·C` · `from the seed face A·B·C, now dissected` · `from vertex A` · `origin unknown`
function formatFaceLineageSummary(shape: Shape, face: Face): string {
  if (!face.lineage) {
    return face.role === 'seed-face' ? 'seed face' : 'origin unknown';
  }

  if (face.lineage.inheritanceMode === 'derived-from-face') {
    const sourceFace = findLineageSource(face.lineage, 'face');
    if (!sourceFace) return 'from a face';
    // C-10b (§131 item 4, the designer's blocker): the source face is usually the SEED face, DISSECTED — it lives in an ancestor
    // shape and has a D14 name there; the absence word only where no ancestor holds it either
    const found = faceThroughAncestors(shape, sourceFace.id);
    if (found && found.dissected) {
      return `from ${dissectedFaceWords(found, getPacketDataDisplayLabel(found.face.data) ?? faceDisplayName(found.in, found.face, () => 'unnamed'), shape)}`;
    }
    return `from face ${formatSourceRef(shape, sourceFace)}`;
  }

  if (face.lineage.inheritanceMode === 'derived-from-vertex') {
    const sourceVertex = findLineageSource(face.lineage, 'vertex');

    return sourceVertex
      ? `from vertex ${formatSourceRef(shape, sourceVertex)}`
      : 'from a vertex';
  }

  if (face.lineage.inheritanceMode === 'default' || face.role === 'seed-face') {
    return 'seed face';
  }

  return formatLineageSummary(shape, face.lineage);
}

// COPY-1 P5 — `from the parent tetrahedron` · `seed cell` · `kept from the source` · `origin unknown`
function formatCellLineageSummary(shape: Shape, cell: Cell): string {
  if (!cell.lineage) {
    return 'origin unknown';
  }

  if (cell.lineage.inheritanceMode === 'derived-from-cell') {
    const sourceCell = findLineageSource(cell.lineage, 'cell');

    return sourceCell
      ? `from ${formatSourceRef(shape, sourceCell)}`
      : 'from the parent cell';
  }

  if (cell.lineage.inheritanceMode === 'default') {
    return 'seed cell';
  }

  if (cell.lineage.inheritanceMode === 'preserved') {
    return 'kept from the source';
  }

  return formatLineageSummary(shape, cell.lineage);
}

function findLineageSource(lineage: PacketLineage, kind: PacketLineage['sources'][number]['kind']) {
  return lineage.sources.find((source) => source.kind === kind);
}

// COPY-1 P5 — `made from A, B, C and 1 more` · `made from several sources` · `from edge A–B` (P2's mode words) · `origin unknown`
function formatLineageSummary(shape: Shape, lineage: PacketLineage | undefined): string {
  if (!lineage) {
    return 'origin unknown';
  }

  const sourceSummary = formatSourceRefs(shape, lineage.sources);

  if (lineage.inheritanceMode === 'composite') {
    return sourceSummary ? `made from ${sourceSummary}` : 'made from several sources';
  }

  const words = lineageModeWords(lineage.inheritanceMode);
  return sourceSummary ? `${words} ${sourceSummary}` : words;
}

function countCellsByKind(shape: Shape): Record<CellKind, number> {
  return shape.cells.reduce<Record<CellKind, number>>(
    (counts, cell) => ({
      ...counts,
      [cell.kind]: counts[cell.kind] + 1,
    }),
    {
      seed: 0,
      parent: 0,
      core: 0,
      residue: 0,
    },
  );
}

function formatCellCounts(counts: Record<CellKind, number>): string {
  const parts: Array<[CellKind, number]> = [
    ['seed', counts.seed],
    ['parent', counts.parent],
    ['core', counts.core],
    ['residue', counts.residue],
  ];

  return parts
    .filter(([, count]) => count > 0)
    .map(([kind, count]) => `${count} ${count === 1 ? kind : `${kind}s`}`) // the designer's gate (12:32 §2): singular at 1
    .join(', ');
}

function historyTargetWords(entry: OperationHistoryEntry): string | null {
  const words = shapeWords(entry.targetTopology);
  return words ? `on ${withArticle(words)}` : null;
}

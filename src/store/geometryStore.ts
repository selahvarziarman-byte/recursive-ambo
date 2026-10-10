import { create } from 'zustand';
import { createSeedShape } from '../data/seeds';
import { isCellActiveFrontier } from '../lib/cellLifecycle';
import { liftSubComplex, type LiftSelection } from '../lib/subComplexLift';
import { openLift } from '../lib/openLift';
import { segmentGateReason, thicken } from '../lib/thicken';
import { closeSegmentIntoLoop } from '../lib/closeEdgeIntoCircle';
import { serializeSnapshot, type SnapshotLexicon } from '../playground/snapshot';
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
import { triadLegsOf, triadOf, triadsOn, withTriad, withoutTriad, type RespectKind, type TriadPick, type TriadRefusal } from '../lib/respects';
import { AGAINST, ALONG, IS, IS_GLYPH, dirOf, instancesOn, isReservedWord, relating, relatingOf, relatingsHeld, reservedWordRefusal, withRelating, withoutRelating, type Dir, type LexiconFacts, type Relating, type RelatingRefusal, type Sign } from '../lib/relatings';
import { IS_RULE, barByKey, barOf, barredAt, ruleReads, shapeOf, verdictNamesPath, verdictsOn, withVerdict, withoutVerdict, type BondRule, type Rule, type RuleSubject, type Shape3, type VerdictRecord } from '../lib/sorting';
import { NAMED_AT_KEY, altitudeDiff, appendLog, bondRuleDiff, pairDiff, relatingDiff, ruleDiff, tupleDiff, verdictDiff, type LogEntry } from '../lib/stage';
// STAMP THE-ALTITUDE · slice 1 — the saying in a light: the record's home and its checked act (altitude.ts); the act IS the store action
import { ALTITUDES_KEY, altitudeHeld, altitudeSayingOf, apexSlotOf, bondSayingOf, endSlotOf, withBondSaying, withSaying, withoutBondSaying, withoutSaying, type AltitudeRefusal, type EndSlot } from '../lib/altitude';
import { childSpaceOf, columnSpaceOf, instanceKey, instancesFrom, orphanedByKeys, orphanedRelatings, termWordsOf } from '../lib/instanceSpace';
import { childLoopsCached, diagonalPlaceOf, diagonalsOf, loopIdOf, loopReadingFor, loopRecordsFor, loopShapeOf, roleIdOf, type Answer, type LoopAnswerRow, type LoopRuleRow, type RelationNameRow, type WaySide } from '../lib/childLoops';
import { sortingOf } from '../lib/sorting';
import { edgeBetween } from '../lib/faceReading';
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

/** STAMP THE-FINDINGS-BATCH · slice 2 · A (ADR 0031 §9.38 (c)): a name he gave a role of a midpoint's child — the shape whose record it is, the site's vertex
 *  id, the role's key (the relating it is, `instanceKey`), the name. Kept PER SHAPE, as the relatings it names are: each shape of the session holds its own
 *  copy of every edge, so a name given at one generation is carried into the next when that shape is first made, and lives on there by its own acts */
export type RoleName = [ShapeId, VertexId, string, string];

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
  mode?: string; // STAMP MODES-3: a relating in a mode at generation ≥ 2 (its word), else a pair
  reversed?: boolean; // said from the edge's second corner
}

/**
 * COPY-1 §7.7 / LAYOUT-1 §7 — A DECISION THE STORE REFUSES IS SHOWN WHERE IT WAS MADE: the refusal's sentence (it opens `not taken —`
 * on the page) with its HANDS AS DATA — the pair it runs into (its withdraw), the bar it runs into (its withdraw), `comes to nothing`
 * (the not-it decision) — keyed by the edge and the passage; transient (never persisted — an attempt is not a record)
 */
export interface SayRefusal {
  text: string;
  pair?: [string, string]; // the pair it runs into, in the edge's stored orientation
  bar?: Relating; // the bar it runs into, as stored
  notIt?: { faceId: string; record: VerdictRecord }; // the not-it decision on this passage, as a hand
}

export interface MidpointRefusal {
  act: MidpointAct;
  form?: string; // a refusal of the FORM (a role already paired · a word across arities · a name not declared · a role the solid made one already)
  prior?: MidpointAct; // COPY-1 §7.1 — the earlier pair a refusal of the form collides with, AS DATA (the surface's withdraw button reads it; no sentence is parsed)
  conflicts: Conflict[]; // the contradictions, by name — empty on a refusal of the form
  dependency?: MidpointDependency; // C-8 item 4 — the born act this act would break
  solid?: MidpointSolidRefusal; // LAYOUT-1 §7 / COPY-1 §4.3 — the solid already makes the two one: where that pairing lives, AS DATA (the surface's `open B–C` reads it)
}

/** LAYOUT-1 §7 — at a generation-2 site, pairing two relatings that hold the same role of the shared corner is refused; the refusal says where
 *  that pairing lives, one generation down, and takes him there: the shared corner and its role both hold, the two relatings' other ends,
 *  the edge between the two other parents (where the pairing of those ends is made), whether he has paired them there, and that edge's midpoint */
export interface MidpointSolidRefusal {
  corner: VertexId; // the corner both relatings hold a role of (the parents' shared corner)
  role: string; // that role, as the corner names it
  others: [string, string]; // the two relatings' other ends, as their own corners name them (the first for the act's first end)
  edge: [VertexId, VertexId] | null; // the edge between the two other parents — where their pairing lives; null where there is no such edge
  paired: boolean; // he has paired those two ends on that edge already
  open: VertexId | null; // that edge's midpoint — the view `open B–C` goes to
  instances: [string, string]; // the two relatings as sentences, for the form used anywhere else
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
  // MODES-4 · row 9 (D17, the log census): the LOG rides the undo snapshot with the record — an undo restores both, so no entry
  // outlives the record it names (a pair given at generation 2 and undone left its entry standing before; inert only by the edge id)
  log?: LogEntry[];
  // slice 2 · A: the names of the child's roles ride the undo snapshot with the record they name — an undo that takes a relating back takes its name
  roleNames?: RoleName[];
  // slice 2 · D: his answers on the loops and his names for their relations, likewise (his rules hold across the solid, as the modes' rules do, and stay)
  loopAnswers?: LoopAnswerRow[];
  relationNames?: RelationNameRow[];
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
  sayRefusals: Record<string, SayRefusal>; // COPY-1 §7.7: `${edgeId}|${passageKey}` → the refused decision, shown where it was made
  withdrawSayAttempt: (key: string) => void;
  declareMode: (word: string) => string | null; // MODES-4 · M4 — the refusal returned by name, nothing silent (LAYOUT-1 §7 shows it where the act was made)
  withdrawMode: (word: string) => void;
  // MODES-4 · D13 (the second resolution §1; ADR 0031 §9.8): the act carries the person's DIRECTION — `→` the first corner's role is
  // the subject, `←` the second's; positional in the record, never a vertex id; IS symmetric (the pairing, as before)
  giveRelating: (edgeId: EdgeId, w: string, x: string, y: string, sign: Sign, dir?: Dir) => RelatingRefusal | null;
  withdrawRelating: (edgeId: EdgeId, w: string, x: string, y: string, dir?: Dir) => void;
  withdrawRelatingAttempt: (edgeId: EdgeId) => void;
  // STAMP THE-ALTITUDE · slice 1 (ADR 0031 §9.29 D22; the ruling §19.2; the mothership's 09:09 BUILD): THE SAYING IN A LIGHT — the opposite
  // corner's statement at a face's edge, checked at the act (the direction law by name, F2; IS and ≡ refused), written into the FACE's packet at
  // the apex's slot, logged (D17); a word first spoken in a light is DECLARED into the lexicon on record (its own `mode` log line — a
  // declaration is an act); a refusal per (face, apex), transient, named where the act was made
  altitudeRefusals: Record<string, AltitudeRefusal & { saying: [string, string, string, Sign] }>;
  // THE-ALTITUDE · slice 3 (the designer's §8): a light asked for at a midpoint the surface is not showing yet — the face's three's `open` elsewhere; the surface at that site takes it once
  lightRequest: { siteId: VertexId; apex: VertexId } | null;
  requestLight: (siteId: VertexId, apex: VertexId) => void;
  takeLightRequest: () => void;
  // STAMP THE-MODES-TAB (the designer's spec §1.4–§1.5; Arman's 18:46 — the matrix, each route drawn, one at a time): the pair of roles chosen in
  // a midpoint's modes tab and how its card walks — the page's view, never a record (a reload forgets it); keyed by the site, so another midpoint
  // never inherits it
  modesView: { siteId: VertexId; cell: string; all: boolean; at: number } | null;
  setModesView: (v: { siteId: VertexId; cell: string; all: boolean; at: number } | null) => void;
  // STAMP THE-MODES-TAB · slice 3 (§1.1): the modes tab's strip — the word pressed there (its facts open under the strip) and whether the rest of the
  // lexicon shows on its line; the page's view like `modesView`, keyed by the site, never a record
  modesStrip: { siteId: VertexId; word: string | null; all: boolean } | null;
  setModesStrip: (v: { siteId: VertexId; word: string | null; all: boolean } | null) => void;
  // the designer's 22:48 (4) on the mothership's ruling of 22:55: `decisions differ in N shapes · show` under the modes tab's grid — whether its list is
  // open, and the shapes whose pairs are shown; the page's view, keyed by the site, never a record
  modesDiffer: { siteId: VertexId; open: boolean; shapes: string[] } | null;
  setModesDiffer: (v: { siteId: VertexId; open: boolean; shapes: string[] } | null) => void;
  giveAltitudeSaying: (faceId: string, apex: VertexId, end: VertexId, z: string, w: string, x: string, sign: Sign, why?: string) => AltitudeRefusal | null;
  withdrawAltitudeSaying: (faceId: string, apex: VertexId, end: VertexId, z: string, w: string, x: string) => void;
  withdrawAltitudeAttempt: (faceId: string, apex: VertexId) => void;
  // THE-ALTITUDE · slice 2 (§9.30 R1–R2): his saying about a BOND at an end — the override of the induced configuration, checked against Z's cast; and
  // his RULE over three words across a corner's relation (the composite of a bond, D6), named and withdrawn; both logged (D17), the rules riding the file
  giveBondSaying: (faceId: string, apex: VertexId, end: VertexId, x: string, S: string, z: string, z2: string, sign: Sign) => AltitudeRefusal | null;
  withdrawBondSaying: (faceId: string, apex: VertexId, end: VertexId, x: string, S: string, z: string, z2: string) => void;
  bondRules: BondRule[];
  nameBondRule: (w: string, S: string, w2: string, w3: string) => string | null;
  withdrawBondRule: (w: string, S: string, w2: string) => void;
  // STAMP THE-FINDINGS-BATCH · slice 2 · A (ADR 0031 §9.38 (c) with its guard; the mothership's 11:06, meaning ruled at claims §345, §352): THE NAMES OF
  // THE CHILD'S ROLES — his alone, by a traced act (the log), withdrawable; unique among that child's roles (a second role given the same name is refused,
  // naming the role that holds it, and nothing is recorded); withdrawn with its relating by the two writers every relating goes through, in the same
  // act, so a name never comes back when the relating is made again; it designates only — no relating, path, verdict or sorting reads it; rides the file
  roleNames: RoleName[];
  nameRole: (siteId: VertexId, key: string, name: string) => string | null; // the refusal by name (`"…" already names (…)`), or null
  withdrawRoleName: (siteId: VertexId, key: string) => void;
  // the guard's refusal where the act was made — the page's, transient, never a record; the field keeps what he typed (`name`)
  roleNameRefusal: { siteId: VertexId; key: string; name: string; holder: string; sentence: string } | null; // `sentence`: the holder's, read where it stands
  clearRoleNameRefusal: () => void;
  // the point tab's drawing of the child: the role chosen there (its card opens below) and the drawing's zoom (null: whole, as it opens) — the page's
  // view, keyed by the site so another midpoint never inherits it, never a record (a reload forgets it)
  childView: { siteId: VertexId; key: string | null; scale: number | null } | null;
  setChildView: (v: { siteId: VertexId; key: string | null; scale: number | null } | null) => void;
  // STAMP THE-FINDINGS-BATCH · slice 2 · D (ADR 0031 §9.42–§9.44; the mothership's rulings on D, 13:41, with the researcher's §19.28): HIS ANSWERS ON THE
  // LOOPS — a word, or 0 (comes to nothing), on a way of a diagonal of a loop, kept per shape like the relatings they rest on, gone with the loop; HIS RULES
  // for a loop's SHAPE (its normal form, never the column's order), across the solid as the modes' rules are; HIS NAMES for the child's relations (filled
  // loops), with the role each reads from — gone when the loop is filled no more. Each a logged act riding the file; nothing proposed; a loop's own answer
  // stands before a rule's
  loopAnswers: LoopAnswerRow[];
  loopRules: LoopRuleRow[];
  relationNames: RelationNameRow[];
  sayLoop: (siteId: VertexId, loopId: string, start: string, way: WaySide, answer: Answer) => string | null;
  withdrawLoopSay: (siteId: VertexId, loopId: string, start: string, way: WaySide) => void;
  sayLoopRule: (siteId: VertexId, loopId: string, start: string, way: WaySide, answer: Answer, modes: boolean) => string | null;
  withdrawLoopRule: (key: string, modes: boolean, place?: 1 | 2, way?: WaySide) => void;
  nameRelation: (siteId: VertexId, loopId: string, name: string) => string | null;
  readRelationFrom: (siteId: VertexId, loopId: string, from: string) => void;
  withdrawRelationName: (siteId: VertexId, loopId: string) => void;
  // a refused answer where the act was made (a reserved word), transient, never a record
  loopRefusal: { siteId: VertexId; loopId: string; start: string; way: WaySide; why: string } | null;
  clearLoopRefusal: () => void;
  // the card's walk through the chosen role's loops (`at`), whom a say is for (`scope`), whether the modes count, and what is shown on demand — the page's
  // view, keyed by the site and the role, never a record
  loopView: { siteId: VertexId; key: string; at: number; scope: 'loop' | 'shape'; modes: boolean; shown: string[] } | null;
  setLoopView: (v: { siteId: VertexId; key: string; at: number; scope: 'loop' | 'shape'; modes: boolean; shown: string[] } | null) => void;
  // slice 2 · E: the relation pressed in the child's strip (its loops drawn lit, its card below) — the page's view, keyed by the site, never a record
  relationView: { siteId: VertexId; word: string } | null;
  setRelationView: (v: { siteId: VertexId; word: string } | null) => void;
  // MODES-4 · D13 and §9.13 — THE LEXICON'S FACTS beside the words (the designer's §1: declared once, where the mode lives, mesh-wide):
  // a CONVERSE equation `y w′ x ≡ x w y` (a rule of the converse kind; optional, his), and the OPAQUE bit — a mode is transparent
  // by default; declared opaque, substitution does not ride through it (a mixed path there composes to nothing, held apart)
  converses: Array<[string, string]>;
  opaque: string[];
  declareConverse: (w: string, w2: string) => string | null; // M4 — the refusal returned by name
  withdrawConverse: (w: string) => void;
  setOpaque: (w: string, opaque: boolean) => string | null; // M4 — the refusal returned by name
  // MODES-1 · B3 — VERDICTS, RULES, EXCEPTIONS (the projection ruling D6; src/lib/sorting.ts). A verdict is the person's word on ONE
  // path at a face — `composed` to a direct instance's mode, or `not` — recorded ON THE FACE, positional (no id inside); a RULE
  // (w, w′) ↦ w‴ names a composite for every path with that word-pair, mesh-wide (the store; persisted); a verdict against a rule
  // is an EXCEPTION, recorded as the verdict it is. IS ; IS = IS is built in and never stored. Nothing here proposes either.
  rules: Rule[];
  // MODES-4 · D17 (the second resolution §9; src/lib/stage.ts) — THE LOG: the person's acts in the order he made them, each appended by
  // the writer it lands through (a refusal appends nothing), INPUT, persisted with the workspace; a name's STAGE is its naming act's
  // position, kept on the vertex (`namedAt`); the state a name was given under is re-derived from the log at that stage, never stored
  log: LogEntry[];
  // MODES-4 · M3 (ADR 0031 §9.14): a rule is keyed on the word pair and the path's SHAPE — chain (a 3-tuple; one key whichever way
  // the chain crosses the edge) · fork · join (the pair order-free)
  nameRule: (w: string, w2: string, w3: string, shape?: Shape3, subject?: RuleSubject) => string | null; // M4 — the refusal returned by name; MARKER LAYOUT-1 · M3: a fork's or join's SUBJECT end as he chose it (none for a same-word rule — undirected, §9.21)
  withdrawRule: (w: string, w2: string, shape?: Shape3) => void;
  giveVerdict: (faceId: string, record: VerdictRecord) => string | null;
  withdrawVerdict: (faceId: string, record: Omit<VerdictRecord, 'verdict' | 'w3' | 'exception'>) => void;
  exportWorkspace: () => PersistedWorkspaceV1;
  importWorkspace: (workspace: PersistedWorkspaceV1) => string[]; // M4 — what the import did NOT take, item by item, by name (§251); empty for every file measured
}

/**
 * MODES-4 · M4 — THE IMPORT (the mothership's 10:11, §251). A file holding IS's name or glyph AS A WORD OF HIS — a lexicon entry, an
 * opaque word, a converse's word, a rule's word or result, a relating's mode other than the pairing's own bar (IS, −), a composed
 * decision's word — is neither honoured silently nor dropped silently: each such item is NOT TAKEN, by name, and the relatings and
 * decisions that depend on a word not taken go with it, named in the same line (the cast loader's own pattern, `notTakenLine`);
 * THE REST OF THE FILE IS IMPORTED — never the whole file refused for it (the released `ebdd1b7` accepts ≡ as a mode word, and a file
 * Virgin Land exports from it must open here). A NOT decision carrying the reserved word beside `not it` — the form before M3's S5,
 * 2,317 of them in the customer's saves and nothing else of this kind (measured 09-30) — is the ordinary, read by reading with NO
 * mark: the device filled that field from the passage's composite, never his hand; the bytes stay. A file holding none of this
 * passes through untouched.
 */
function withoutReservedWords(w: PersistedWorkspaceV1): { workspace: PersistedWorkspaceV1; notTaken: string[] } {
  const notTaken: string[] = [];
  const q = (s: string): string => `"${s.trim()}"`;
  const words = new Set((w.lexicon ?? []).filter(isReservedWord).map((m) => m.trim())); // the words not taken — what depends on them goes with them
  const lexicon = (w.lexicon ?? []).filter((m) => { if (!isReservedWord(m)) return true; notTaken.push(`mode ${q(m)}`); return false; });
  const opaque = (w.opaque ?? []).filter((m) => { if (!isReservedWord(m)) return true; notTaken.push(`the stand-in setting of ${q(m)}`); return false; });
  const converses = (w.converses ?? []).filter(([a, b]) => { if (!isReservedWord(a) && !isReservedWord(b)) return true; notTaken.push(`the converse ${q(b)} of ${q(a)}`); return false; });
  // COPY-1 §4.6 / §11.4 (the mothership's 10:36): a rule not taken is named in its own line's form — `the rule carries then ≡ = supports` ·
  // `the rule carries and ≡ from one point = supports` · `… into one point = …` — never `↦`
  const rules = (w.rules ?? []).filter((r) => { if (![r[0], r[1], r[2]].some(isReservedWord)) return true; const joint = r[3] === 'fork' ? ' and ' : r[3] === 'join' ? ' and ' : ' then '; const where = r[3] === 'fork' ? ' from one point' : r[3] === 'join' ? ' into one point' : ''; notTaken.push(`the rule ${r[0].trim()}${joint}${r[1].trim()}${where} = ${r[2].trim()}`); return false; });
  // THE-ALTITUDE · slice 2 (§9.30 R2): a bond rule naming IS or ≡ in any of its four words is not taken, in the gesture's own form — `the rule interprets, keeps and might.act.as across a relation = ≡`
  const bondRules = (w.bondRules ?? []).filter((r) => { if (!r.some(isReservedWord)) return true; notTaken.push(`the rule ${r[0].trim()}, ${r[1].trim()} and ${r[2].trim()} across a relation = ${r[3].trim()}`); return false; });
  const shapes = Object.fromEntries(Object.entries(w.shapes).map(([id, sh]) => {
    const label = (v: string): string => sh.vertices[v]?.data.label || v;
    const edges = sh.edges.map((e) => {
      let next = e;
      for (const r of relatingsHeld(e)) {
        if (!isReservedWord(r[0]) || (r[0].trim() === IS && r[3] === '-')) continue; // the IS bar is the pairing's own negative — it stays
        next = withoutRelating(next, r[0], r[1], r[2], dirOf(r));
        notTaken.push(`${r[3] === '-' ? 'bar' : 'relating'} ${dirOf(r) === ALONG ? `${r[1]} ${IS_GLYPH} ${r[2]}` : `${r[2]} ${IS_GLYPH} ${r[1]}`} on ${label(e.vertexIds[0])}–${label(e.vertexIds[1])}`);
      }
      return next;
    });
    const faces = sh.faces.map((f) => {
      let next = f;
      for (const v of verdictsOn(f)) {
        // a NOT's old word beside `not it` is the device's copy, never his — read by reading, no mark (§251); a decision on a passage
        // whose leg is a word not taken goes with that word
        const reserved = (v.verdict === 'composed' && typeof v.w3 === 'string' && isReservedWord(v.w3)) || words.has(v.w.trim()) || words.has(v.w2.trim());
        if (!reserved) continue;
        next = withoutVerdict(next, v);
        notTaken.push(`the decision ${v.verdict === 'composed' ? q(`${v.x} ${v.w3} ${v.y}`) : '"comes to nothing"'} on ${f.vertexIds.map(label).join('·')}`); // COPY-1: a decision in its own words; a face `A·B·C` (P3)
      }
      // THE-ALTITUDE: a saying in a light whose word is IS or ≡ is not taken (a saying in IS would pair; the pairing has one home), named in its own words
      const slots = next.data?.[ALTITUDES_KEY];
      for (const k of Object.keys(slots && typeof slots === 'object' && !Array.isArray(slots) ? (slots as Record<string, unknown>) : {})) for (const s of altitudeHeld(next, Number(k))) {
        if (!isReservedWord(s[0] === 'say' ? s[2] : s[3])) continue;
        next = s[0] === 'say' ? withoutSaying(next, Number(k), s[1], s[2], s[3], s[4]) : withoutBondSaying(next, Number(k), s[1], s[2], s[3], s[4], s[5]);
        // the page's word for what he records is "relating" (the mothership, 12:02); "saying" stays inside the code and the records
        notTaken.push(`the relating ${q(s[0] === 'say' ? `${s[1]} ${s[2]} ${s[4]}` : `at ${s[2]}, ${s[4]} ${s[3]} ${s[5]}`)} in a light on ${f.vertexIds.map(label).join('·')}`);
      }
      return next;
    });
    return [id, { ...sh, edges, faces }];
  }));
  return { workspace: { ...w, lexicon, opaque, converses, rules, bondRules, shapes }, notTaken };
}

/** THE-ALTITUDE: the key a refusal in a light is kept under — the face and the light's corner */
export const altitudeRefusalKey = (faceId: string, apex: VertexId): string => `${faceId}|${apex}`;

const initialShape = createSeedShape('tetrahedron');
const initialHistoryEntry: OperationHistoryEntry = {
  id: 'history:0',
  label: `the seed: ${initialShape.name}`, // COPY-1 §5.4: the history's words are the record's (a file saved before them is read as the same act — historyWords)
  operationId: 'seed',
  targetCellId: initialShape.cells[0]?.id ?? null,
  targetTopology: initialShape.cells[0]?.topology ?? initialShape.seedKey ?? null,
  generationDepth: initialShape.genealogy.generationDepth,
  producedCellCount: initialShape.cells.length,
  shapeId: initialShape.id,
  createdAt: initialShape.genealogy.createdAt,
};

// M2 (THE-THIRD-RESOLUTION; the snapshot spend e0dedd8): THE LEXICON'S FACTS the lift file carries — the person's converse equations and the
// modes he declared opaque, exactly as the store holds them at the lift (an empty set is a positive fact: he declared none). Every lift site
// below hands them; the Manuscript reads them off the file (the identification image's twist clause; the sorting's opaque bit).
const lexiconFactsOf = (s: { converses: Array<[string, string]>; opaque: string[] }): SnapshotLexicon => ({ converses: s.converses, opaque: s.opaque });

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
  altitudeRefusals: {},
  lightRequest: null,
  modesView: null,
  modesStrip: null,
  modesDiffer: null,
  bondRules: [],
  roleNames: [],
  roleNameRefusal: null,
  childView: null,
  loopAnswers: [],
  loopRules: [],
  relationNames: [],
  loopRefusal: null,
  loopView: null,
  relationView: null,
  sayRefusals: {},
  withdrawSayAttempt: (key) => { const sayRefusals = { ...get().sayRefusals }; delete sayRefusals[key]; set({ sayRefusals }); },
  converses: [],
  opaque: [],
  rules: [],
  log: [],
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
      label: `the seed: ${shape.name}`,
      operationId: 'seed-selection',
      shape,
      targetCell: shape.cells[0] ?? null,
      producedCellCount: shape.cells.length,
    });

    set({
      ...pushHistory(state, entry),
      selectedSeedKey: seedKey,
      roleNames: [], // slice 2 · A — a new seed holds no relating, so no name (ids recur: a kept name would come back with a relating made again)
      roleNameRefusal: null,
      childView: null,
      loopAnswers: [], // slice 2 · D — no loop, so no answer and no relation's name
      relationNames: [],
      loopRules: [], // a rule's key names its casts by the corners holding them, and a new seed's corners hold new casts though their ids recur (the review of 38925cd)
      loopRefusal: null,
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
      label: `reset: ${shape.name}`,
      operationId: 'reset-workspace',
      shape,
      targetCell: shape.cells[0] ?? null,
      producedCellCount: shape.cells.length,
    });

    set({
      ...pushHistory(state, entry),
      roleNames: [], // slice 2 · A — the reset's seed holds no relating, so no name (an undo takes the names back with the record)
      roleNameRefusal: null,
      childView: null,
      loopAnswers: [], // slice 2 · D — likewise his answers and his relations' names
      relationNames: [],
      loopRules: [], // and his loop rules: the reset's corners hold new casts (an undo takes back the record; the rules, held across the solid, start anew)
      loopRefusal: null,
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
      ...namesAfterUndo(previousSnapshot, state.loopRules, { converses: state.converses, opaque: state.opaque }), // slice 2 · D — the names as they stood, read against the rules now in force
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
      ...namesAfterUndo(nextSnapshot, state.loopRules, { converses: state.converses, opaque: state.opaque }), // slice 2 · D
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
    // slice 2 · A: the names of the relatings the new shape carries come with them (the child's record carried in ambo.ts, its names here)
    if (operation.id === 'ambo-dissection') { const carried = namesCarried(get().roleNames, currentShape, nextShape); if (carried !== get().roleNames) set({ roleNames: carried }); }
    if (operation.id === 'ambo-dissection') set(loopRecordsCarried(get(), currentShape, nextShape)); // slice 2 · D — his answers and his relations' names, with the loops the new shape carries
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
      throw new Error('no shape is loaded');
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
        'select a cell, a face, a vertex or an edge first, or shift-click a region', // COPY-1 §5.1 — the lift's own list; the page prints it after `not lifted —`
      );
    }
    const lifted = liftSubComplex(shape, selections);
    // GAP2C: the workspace population rides as serialize-time ancestry — the
    // snapshot's predicate carries the chain exactly when the lifted region's
    // own complex is direct-unreadable (a seamed composite), else byte-as-before
    const file = serializeSnapshot(lifted.shape, shape.id, Object.values(shapes), shape.name, lexiconFactsOf(get()));
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
      throw new Error('no shape is loaded');
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
        'select a vertex or an edge first, or shift-click a region', // MARKER LAYOUT-1 · M14 — what thicken takes (a cell alone is refused by the act; the panel says so before the click)
      );
    }
    const lifted = liftSubComplex(shape, selections);
    const band = thicken(lifted.shape);
    // GAP2C: the same serialize-time ancestry as the plain lift; the band's
    // own chain additionally rides through its lifted parent
    useLiftStore.getState().push({
      title: lifted.title,
      file: serializeSnapshot(lifted.shape, shape.id, Object.values(shapes), shape.name, lexiconFactsOf(get())),
    });
    useLiftStore.getState().push({
      title: band.shape.name,
      file: serializeSnapshot(band.shape, shape.id, [lifted.shape, ...Object.values(shapes)], shape.name, lexiconFactsOf(get())),
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
      throw new Error('no shape is loaded');
    }
    if (!selectedVertexId) {
      throw new Error("select the star's centre first (a midpoint)");
    }
    if (!selectedCellId) {
      throw new Error('select the cell the star is read from first (for example the diagonalized core)');
    }
    const lifted = openLift(shape, selectedVertexId, selectedCellId);
    useLiftStore.getState().push({
      title: lifted.shape.name,
      file: serializeSnapshot(lifted.shape, shape.id, Object.values(shapes), shape.name, lexiconFactsOf(get())),
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
    useLiftStore.getState().push({ title: band.shape.name, file: serializeSnapshot(band.shape, shape.id, [shape], shape.name, lexiconFactsOf(get())) });
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
      file: serializeSnapshot(born.shape, segment.id, [segment], segment.name, lexiconFactsOf(get())),
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
      // MODES-4 · D17 (the second resolution §9; src/lib/stage.ts), sharpening MODES-1 · B5 (D11): the naming act is APPENDED TO THE LOG
      // and its position is the name's STAGE, kept on the vertex as input (`namedAt`); the state the name was given under is re-derived
      // from the log at that stage, and *since then* is the difference of two derived sortings. B5's snapshot of derived values
      // (`namedUnder`) is written no more — a stored derived value is a stamp that drifts from the code that made it; one taken before
      // D17 stands as the record of that name, marked on the surface. A name given anew takes a new stage and lets the old snapshot go
      // with the old name; an un-christened midpoint keeps no stage
      const log = appendLog(get().log, { act: 'name', vertex: selectedVertexId, label, was: vertex.data.label, christened: christened === true });
      const stage = log.length;
      const marked = (data: VertexDataPacket): VertexDataPacket => {
        if (christened === null) return data;
        const custom = { ...withChristened(data.custom, christened) };
        delete custom['namedUnder'];
        if (christened) custom[NAMED_AT_KEY] = stage as unknown as VertexDataPacket['custom'][string];
        else delete custom[NAMED_AT_KEY];
        return { ...data, custom };
      };
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
      set({ shapes: next, log });
      return;
    }

    const edited: Shape = { ...shape, vertices: { ...shape.vertices, [selectedVertexId]: { ...vertex, data: patchedData } } };
    set({
      shapes: {
        ...shapes,
        [shape.id]: edited,
      },
      roleNames: namesStanding(get().roleNames, edited), // slice 2 · A — a role gone from a cast takes its relating's name with it
      ...loopRecordsStanding(get(), edited), // slice 2 · D — a parent's relation gone from a cast takes the loops it made, and his answers on them
      // slice 2 · D (the review of 38925cd): a corner's cast changed — read through its one reader, the resolver (its space before and after the act) — the
      // loop rules keyed on its words go: they were that cast's words, foreign to any other
      ...(JSON.stringify(spaceOf(shape, selectedVertexId)?.space ?? null) !== JSON.stringify(spaceOf(edited, selectedVertexId)?.space ?? null) ? { loopRules: get().loopRules.filter(([k]) => !k.includes(`${selectedVertexId}|`)) } : {}),
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
      writeEdgeIdentification(set, state, shape, edgeId, { roles: edge.identification.roles, types }, state.edgeTauDrafts[edgeId] ?? null);
      return;
    }
    const edgeTauDrafts = { ...state.edgeTauDrafts };
    const draftWas = state.edgeTauDrafts[edgeId] ?? null;
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
    writeEdgeIdentification(set, { ...state, edgeTauDrafts }, shape, edgeId, { roles, types }, state.edgeTauDrafts[edgeId] ?? null);
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
    writeEdgeIdentification(set, { ...state, edgeTauDrafts }, shape, edgeId, undefined, state.edgeTauDrafts[edgeId] ?? null);
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
    // D17 — the log: the triad as it landed
    set({ shapes: { ...state.shapes, [shape.id]: { ...shape, faces } }, triadRefusals, log: appendLog(state.log, { act: 'triad', face: faceId, corners: [...(shape.faces.find((f) => f.id === faceId)?.vertexIds ?? [])], kind, added: [triad.record], removed: [] }) });
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
    let log = state.log;
    const faces = shape.faces.map((f) => {
      if (!twin(f)) return f;
      const t = triadLegsOf(shape, f.id, picks);
      if (t.refused) return f;
      const next = withoutTriad(f, kind, t.record);
      // D17 — the log: the withdrawal, per face record it left
      const diff = tupleDiff(kind === 'role' ? triadsOn(f).roles : triadsOn(f).words, kind === 'role' ? triadsOn(next).roles : triadsOn(next).words);
      if (diff.removed.length) log = appendLog(log, { act: 'triad', face: f.id, corners: [...f.vertexIds], kind, added: [], removed: diff.removed });
      return next;
    });
    set({ shapes: { ...state.shapes, [shape.id]: { ...shape, faces } }, log });
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
    // MODES-4 · M4 — NOTHING SILENT: each refusal returned by name (LAYOUT-1 §7 shows it where the act was made); IS's name and its glyph
    // refused by the one predicate, the pairing named as the route — COPY-1's forms
    if (!mode) return 'a mode is a word';
    if (isReservedWord(mode)) return reservedWordRefusal('a mode');
    if (lexicon.includes(mode)) return `${mode} is already declared`;
    set({ lexicon: [...lexicon, mode], log: appendLog(get().log, { act: 'mode', word: mode, on: true }) }); // D17 — the log
    return null;
  },
  withdrawMode: (word) => {
    const { lexicon } = get();
    if (!lexicon.includes(word)) return;
    set({ lexicon: lexicon.filter((w) => w !== word), log: appendLog(get().log, { act: 'mode', word, on: false }) }); // the relatings in it stay — they are the person's record; the word stays in use; D17 — the log
  },
  giveRelating: (edgeId, w, x, y, sign, dir = ALONG) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    if (!shape) return { corner: null, item: null, why: 'no current shape' };
    if (w.trim() === IS && sign === '+') {
      // an IS-instance IS the pairing: one home, the typed record, through the pairing's own act and its refusals — a refusal the
      // pairing records (the midpoint's, by name) is returned here too, so the caller never reads silence for a refused act (B4)
      state.giveRolePair(edgeId, x, y);
      const refused = get().midpointRefusals[edgeId];
      return refused && refused.act.kind === 'role' && refused.act.pair[0] === x && refused.act.pair[1] === y ? { corner: null, item: null, why: refused.form ?? 'the pairing refused this pair' } : null;
    }
    // B4 (D10): the roles a relating may name are the modes layer's — a seed's cast, a born corner's own child (its instances)
    const act = relatingOf(shape, edgeId, w, x, y, sign, { tauDrafts: state.edgeTauDrafts }, (s, c, o) => childSpaceOf(s, c, o), dir);
    if (act.refused) {
      set({ relatingRefusals: { ...state.relatingRefusals, [edgeId]: { ...act.refused, relating: relating(w, x, y, sign, dir) } } });
      return act.refused;
    }
    const relatingRefusals = { ...state.relatingRefusals };
    delete relatingRefusals[edgeId];
    writeEdgeRelatings(set, { ...state, relatingRefusals }, shape, edgeId, (edge) => withRelating(edge, act.relating));
    return null;
  },
  withdrawRelating: (edgeId, w, x, y, dir = ALONG) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    if (!shape) return;
    if (w.trim() === IS) {
      const edge = shape.edges.find((c) => c.id === edgeId);
      if (edge && relatingsHeld(edge).some((r) => r[0] === IS && r[1] === x && r[2] === y)) writeEdgeRelatings(set, state, shape, edgeId, (e) => withoutRelating(e, IS, x, y)); // an IS bar, the packet's
      else state.withdrawRolePair(edgeId, x, y); // an IS-instance, the pairing's
      return;
    }
    // STAMP MODES-3 (the mothership's ruling 2, 16:18): a relating at generation ≥ 2 whose END is this relating's instance would be
    // orphaned by its withdrawal — refused by name, the relating said as he said it (the designer's 16:26 §3); the far hand is at that site
    const withdrawnEdge = shape.edges.find((c) => c.id === edgeId);
    const orphan = withdrawnEdge ? orphanedByKeys(shape, new Set([instanceKey(w.trim(), x, y, dir)]), edgeId)[0] : undefined;
    if (withdrawnEdge && orphan) {
      const dep = dependencyOf(shape, withdrawnEdge, orphan);
      const there = dep.siteId !== null ? (shape.vertices[dep.siteId]?.data.label?.trim() || 'unnamed') : 'the edge it comes from';
      const said = dep.mode && dep.mode !== IS ? (dep.reversed ? `${dep.names[1]} ${dep.mode} ${dep.names[0]}` : `${dep.names[0]} ${dep.mode} ${dep.names[1]}`) : `${dep.names[0]} ≡ ${dep.names[1]}`;
      const o = { tauDrafts: state.edgeTauDrafts };
      const mine = dir === ALONG ? `${termWordsOf(shape, withdrawnEdge.vertexIds[0], x, o)} ${w.trim()} ${termWordsOf(shape, withdrawnEdge.vertexIds[1], y, o)}` : `${termWordsOf(shape, withdrawnEdge.vertexIds[1], y, o)} ${w.trim()} ${termWordsOf(shape, withdrawnEdge.vertexIds[0], x, o)}`;
      const up = dep.generationsUp === 1 ? 'one generation up' : `${dep.generationsUp} generations up`;
      set({ relatingRefusals: { ...state.relatingRefusals, [edgeId]: { corner: null, item: null, why: `${mine} is one end of ${said} at ${there}, ${up}`, relating: relating(w.trim(), x, y, '+', dir) } } });
      return;
    }
    writeEdgeRelatings(set, state, shape, edgeId, (edge) => withoutRelating(edge, w.trim(), x, y, dir));
  },
  // ═══ MODES-4 · D13, §9.13 — the lexicon's facts: a converse equation, the opaque bit ═══
  declareConverse: (w, w2) => {
    const a = w.trim(); const b = w2.trim();
    // M4 — IS is symmetric and its law is fixed: no converse of it, in either spelling; refused by name, nothing silent
    if (!a || !b) return 'a converse names two words';
    if (isReservedWord(a) || isReservedWord(b)) return reservedWordRefusal("a converse's word", 'it is the same both ways, so it has no other way round');
    const converses = get().converses.filter(([p, q]) => p !== a && q !== a && p !== b && q !== b); // one equation per word
    const next: Array<[string, string]> = [...converses, [a, b]];
    const diff = pairDiff(get().converses, next);
    set({ converses: next, log: appendLog(get().log, { act: 'converse', added: diff.added, removed: diff.removed }) }); // D17 — the log
    return null;
  },
  withdrawConverse: (w) => {
    const converses = get().converses.filter(([p, q]) => p !== w && q !== w);
    if (converses.length !== get().converses.length) set({ converses, log: appendLog(get().log, { act: 'converse', added: [], removed: pairDiff(get().converses, converses).removed }) }); // D17 — the log
  },
  setOpaque: (w, opaque) => {
    const a = w.trim();
    // M4 — the pairing carries no opaque bit, in either spelling; refused by name, nothing silent
    if (!a) return 'the stand-in bit is set on a mode';
    if (isReservedWord(a)) return reservedWordRefusal('the mode whose stand-in bit is set', 'in a pair the two roles stand in for each other by what a pair is');
    const held = get().opaque.includes(a);
    if (opaque && !held) set({ opaque: [...get().opaque, a], log: appendLog(get().log, { act: 'opaque', word: a, on: true }) }); // D17 — the log
    if (!opaque && held) set({ opaque: get().opaque.filter((m) => m !== a), log: appendLog(get().log, { act: 'opaque', word: a, on: false }) });
    return null;
  },
  withdrawRelatingAttempt: (edgeId) => {
    const relatingRefusals = { ...get().relatingRefusals };
    delete relatingRefusals[edgeId];
    set({ relatingRefusals });
  },
  // ─── STAMP THE-ALTITUDE · slice 1 — the saying in a light ───
  giveAltitudeSaying: (faceId, apex, end, z, w, x, sign, why) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    if (!shape) return { corner: null, item: null, why: 'no current shape' };
    const key = altitudeRefusalKey(faceId, apex);
    // B4 (D10): the roles a saying may name are the modes layer's — a seed's cast, a born corner's own child (its instances)
    const act = altitudeSayingOf(shape, faceId, apex, end, z, w, x, sign, { tauDrafts: state.edgeTauDrafts }, (s, c, o) => childSpaceOf(s, c, o), why ?? null);
    if (act.refused) {
      set({ altitudeRefusals: { ...state.altitudeRefusals, [key]: { ...act.refused, saying: [z, w.trim(), x, sign] } } });
      return act.refused;
    }
    const altitudeRefusals = { ...state.altitudeRefusals };
    delete altitudeRefusals[key];
    // D1, D22 — the word declared into L on record: a declaration is an act and takes its log line (IS and ≡ never reach here: the act refuses them)
    const word = act.saying[2];
    const declared = state.lexicon.includes(word);
    const lexicon = declared ? state.lexicon : [...state.lexicon, word];
    let log = declared ? state.log : appendLog(state.log, { act: 'mode', word, on: true });
    const before = altitudeHeld(act.face, act.slot);
    const face = withSaying(act.face, act.slot, act.saying);
    const diff = altitudeDiff(before, altitudeHeld(face, act.slot));
    if (diff.added.length || diff.removed.length) log = appendLog(log, { act: 'altitude', face: faceId, corners: [...act.face.vertexIds], apex, slot: act.slot, added: diff.added, removed: diff.removed }); // D17 — the log
    set({ altitudeRefusals, lexicon, log, shapes: { ...state.shapes, [shape.id]: { ...shape, faces: shape.faces.map((f) => (f.id === faceId ? face : f)) } } });
    return null;
  },
  withdrawAltitudeSaying: (faceId, apex, end, z, w, x) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    if (!shape) return;
    const held = shape.faces.find((f) => f.id === faceId);
    if (!held) return;
    const slot = apexSlotOf(held, apex);
    if (slot < 0) return;
    const before = altitudeHeld(held, slot);
    const e = endSlotOf(held, end);
    if (e < 0) return;
    const face = withoutSaying(held, slot, z, w, e as EndSlot, x);
    const diff = altitudeDiff(before, altitudeHeld(face, slot));
    if (!diff.added.length && !diff.removed.length) return;
    const log = appendLog(state.log, { act: 'altitude', face: faceId, corners: [...held.vertexIds], apex, slot, added: diff.added, removed: diff.removed }); // D17 — the log: the hand back; the word stays in the lexicon (in use or declared, never lost)
    set({ log, shapes: { ...state.shapes, [shape.id]: { ...shape, faces: shape.faces.map((f) => (f.id === faceId ? face : f)) } } });
  },
  withdrawAltitudeAttempt: (faceId, apex) => {
    const altitudeRefusals = { ...get().altitudeRefusals };
    delete altitudeRefusals[altitudeRefusalKey(faceId, apex)];
    set({ altitudeRefusals });
  },
  requestLight: (siteId, apex) => { set({ lightRequest: { siteId, apex } }); },
  takeLightRequest: () => { set({ lightRequest: null }); },
  setModesView: (v) => { set({ modesView: v }); },
  setModesStrip: (v) => { set({ modesStrip: v }); },
  setModesDiffer: (v) => { set({ modesDiffer: v }); },
  // ─── STAMP THE-ALTITUDE · slice 2 — the bond saying and the bond rule ───
  giveBondSaying: (faceId, apex, end, x, S, z, z2, sign) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    if (!shape) return { corner: null, item: null, why: 'no current shape' };
    const key = altitudeRefusalKey(faceId, apex);
    const act = bondSayingOf(shape, faceId, apex, end, x, S, z, z2, sign, { tauDrafts: state.edgeTauDrafts }, (s, c, o) => childSpaceOf(s, c, o));
    if (act.refused) {
      set({ altitudeRefusals: { ...state.altitudeRefusals, [key]: { ...act.refused, saying: [z, S, z2, sign] } } });
      return act.refused;
    }
    const altitudeRefusals = { ...state.altitudeRefusals };
    delete altitudeRefusals[key];
    const before = altitudeHeld(act.face, act.slot);
    const face = withBondSaying(act.face, act.slot, act.saying);
    const diff = altitudeDiff(before, altitudeHeld(face, act.slot));
    const log = diff.added.length || diff.removed.length ? appendLog(state.log, { act: 'altitude', face: faceId, corners: [...act.face.vertexIds], apex, slot: act.slot, added: diff.added, removed: diff.removed }) : state.log; // D17 — the log
    set({ altitudeRefusals, log, shapes: { ...state.shapes, [shape.id]: { ...shape, faces: shape.faces.map((f) => (f.id === faceId ? face : f)) } } });
    return null;
  },
  withdrawBondSaying: (faceId, apex, end, x, S, z, z2) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    if (!shape) return;
    const held = shape.faces.find((f) => f.id === faceId);
    if (!held) return;
    const slot = apexSlotOf(held, apex);
    if (slot < 0) return;
    const before = altitudeHeld(held, slot);
    const e = endSlotOf(held, end);
    if (e < 0) return;
    const face = withoutBondSaying(held, slot, e as EndSlot, x, S, z, z2);
    const diff = altitudeDiff(before, altitudeHeld(face, slot));
    if (!diff.added.length && !diff.removed.length) return;
    const log = appendLog(state.log, { act: 'altitude', face: faceId, corners: [...held.vertexIds], apex, slot, added: diff.added, removed: diff.removed }); // D17 — the log: the hand back
    set({ log, shapes: { ...state.shapes, [shape.id]: { ...shape, faces: shape.faces.map((f) => (f.id === faceId ? face : f)) } } });
  },
  nameBondRule: (w, S, w2, w3) => {
    const a = w.trim(); const s = S.trim(); const b = w2.trim(); const c = w3.trim();
    if (!a || !s || !b || !c) return "a rule across a corner's relation names three words and what they come to";
    if (isReservedWord(a) || isReservedWord(b) || isReservedWord(s)) return reservedWordRefusal("a rule's word", 'what a pair carries through follows from the pair, not from a rule');
    if (isReservedWord(c)) return reservedWordRefusal('what a rule comes to', `two roles are made one by pairing them, not by composing ${a}, ${s} and ${b}`);
    const rules = get().bondRules.filter((r) => !(r[0] === a && r[1] === s && r[2] === b));
    const next: BondRule[] = [...rules, [a, s, b, c]];
    const diff = bondRuleDiff(get().bondRules, next);
    set({ bondRules: next, log: appendLog(get().log, { act: 'bondrule', added: diff.added, removed: diff.removed }) }); // D17 — the log
    return null;
  },
  withdrawBondRule: (w, S, w2) => {
    const rules = get().bondRules.filter((r) => !(r[0] === w && r[1] === S && r[2] === w2));
    if (rules.length !== get().bondRules.length) set({ bondRules: rules, log: appendLog(get().log, { act: 'bondrule', added: [], removed: bondRuleDiff(get().bondRules, rules).removed }) }); // D17 — the log
  },
  // ═══ slice 2 · A — the names of the child's roles ═══
  nameRole: (siteId, key, name) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    const n = name.trim();
    if (!shape || !n) return 'a name is a word';
    const child = childSpaceOf(shape, siteId);
    if (!child || !child.roles.some((r) => r.id === key)) return 'this relating does not stand here';
    // THE GUARD (§9.38 (c)): naming designates, it never identifies — a name another role of this child holds (in this shape's record, which names only
    // relatings that stand: every route by which one stops standing drops its name) is refused by name, the holder said by its sentence (its name is the
    // very word in question); the same test as a word declared twice (exact, trimmed): one test, not two
    const sh = shape.id;
    const holder = state.roleNames.find(([s, v, k, m]) => s === sh && v === siteId && k !== key && m === n);
    if (holder) {
      const sentence = termWordsOf(shape, siteId, holder[2]);
      set({ roleNameRefusal: { siteId, key, name: n, holder: holder[2], sentence } });
      return `"${n}" already names ${sentence}`;
    }
    const was = state.roleNames.find(([s, v, k]) => s === sh && v === siteId && k === key)?.[3] ?? '';
    if (was === n) {
      if (state.roleNameRefusal) set({ roleNameRefusal: null });
      return null;
    }
    set({ roleNames: [...state.roleNames.filter(([s, v, k]) => !(s === sh && v === siteId && k === key)), [sh, siteId, key, n]], roleNameRefusal: null, log: appendLog(state.log, { act: 'rolename', shape: sh, site: siteId, role: key, name: n, was }) }); // D17 — the log
    return null;
  },
  withdrawRoleName: (siteId, key) => {
    const state = get();
    const sh = state.currentShapeId;
    const was = state.roleNames.find(([s, v, k]) => s === sh && v === siteId && k === key)?.[3];
    if (was === undefined) return;
    set({ roleNames: state.roleNames.filter(([s, v, k]) => !(s === sh && v === siteId && k === key)), roleNameRefusal: null, log: appendLog(state.log, { act: 'rolename', shape: sh, site: siteId, role: key, name: '', was }) }); // D17 — the log
  },
  clearRoleNameRefusal: () => { if (get().roleNameRefusal) set({ roleNameRefusal: null }); },
  // ═══ slice 2 · D — his answers on the loops, his rules, his names for the child's relations ═══
  sayLoop: (siteId, loopId, start, way, answer) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    const at = shape ? askedWay(shape, siteId, loopId, start, way) : null;
    if (!shape || !at) return 'this way of this loop is not asked here';
    const word = answer === 0 ? 0 : answer.trim();
    if (word === '') return 'an answer is a word, or comes to nothing';
    if (word !== 0 && isReservedWord(word)) { const why = reservedWordRefusal("what a way comes to", 'two roles are made one by pairing them, not by a loop'); set({ loopRefusal: { siteId, loopId, start, way, why } }); return why; }
    const was = state.loopAnswers.find(([s, v, l, st, w]) => s === shape.id && v === siteId && l === loopId && st === start && w === way)?.[5] ?? null;
    if (was === word) { if (state.loopRefusal) set({ loopRefusal: null }); return null; }
    const loopAnswers: LoopAnswerRow[] = [...state.loopAnswers.filter(([s, v, l, st, w]) => !(s === shape.id && v === siteId && l === loopId && st === start && w === way)), [shape.id, siteId, loopId, start, way, word]];
    set({ loopAnswers, relationNames: relationNamesFilled(state.relationNames, state.shapes, loopAnswers, state.loopRules, { converses: state.converses, opaque: state.opaque }), loopRefusal: null, log: appendLog(state.log, { act: 'loopsay', shape: shape.id, site: siteId, loop: loopId, start, way, answer: word, was }) }); // D17 — the log
    return null;
  },
  withdrawLoopSay: (siteId, loopId, start, way) => {
    const state = get();
    const sh = state.currentShapeId;
    const was = state.loopAnswers.find(([s, v, l, st, w]) => s === sh && v === siteId && l === loopId && st === start && w === way)?.[5];
    if (was === undefined) return;
    const loopAnswers = state.loopAnswers.filter(([s, v, l, st, w]) => !(s === sh && v === siteId && l === loopId && st === start && w === way));
    set({ loopAnswers, relationNames: relationNamesFilled(state.relationNames, state.shapes, loopAnswers, state.loopRules, { converses: state.converses, opaque: state.opaque }), loopRefusal: null, log: appendLog(state.log, { act: 'loopsay', shape: sh, site: siteId, loop: loopId, start, way, answer: null, was }) }); // D17 — the log
  },
  sayLoopRule: (siteId, loopId, start, way, answer, modes) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    const at = shape ? askedWay(shape, siteId, loopId, start, way) : null;
    if (!shape || !at) return 'this way of this loop is not asked here';
    const word = answer === 0 ? 0 : answer.trim();
    if (word === '') return 'an answer is a word, or comes to nothing';
    if (word !== 0 && isReservedWord(word)) { const why = reservedWordRefusal("what a way comes to", 'two roles are made one by pairing them, not by a loop'); set({ loopRefusal: { siteId, loopId, start, way, why } }); return why; }
    // the rule binds the loop's SHAPE in its normal form; the way asked here is that form's diagonal at its own place (mirrored loops take it at the other)
    const sh = loopShapeOf(at.L, at.loop, modes);
    const place = diagonalPlaceOf(sh, at.from);
    const m: 0 | 1 = modes ? 1 : 0;
    const was = state.loopRules.find(([k, mm, p, w]) => k === sh.key && mm === m && p === place && w === way)?.[4] ?? null;
    if (was === word) { if (state.loopRefusal) set({ loopRefusal: null }); return null; }
    const loopRules: LoopRuleRow[] = [...state.loopRules.filter(([k, mm, p, w]) => !(k === sh.key && mm === m && p === place && w === way)), [sh.key, m, place, way, word]];
    set({ loopRules, relationNames: relationNamesFilled(state.relationNames, state.shapes, state.loopAnswers, loopRules, { converses: state.converses, opaque: state.opaque }), loopRefusal: null, log: appendLog(state.log, { act: 'looprule', key: sh.key, modes: m, place, way, answer: word, was }) }); // D17 — the log
    return null;
  },
  withdrawLoopRule: (key, modes, place, way) => {
    const state = get();
    const m: 0 | 1 = modes ? 1 : 0;
    const gone = state.loopRules.filter(([k, mm, p, w]) => k === key && mm === m && (place === undefined || p === place) && (way === undefined || w === way));
    if (!gone.length) return;
    const loopRules = state.loopRules.filter((r) => !gone.includes(r));
    let log = state.log;
    for (const [k, mm, p, w, a] of gone) log = appendLog(log, { act: 'looprule', key: k, modes: mm, place: p, way: w, answer: null, was: a }); // D17 — one line per way withdrawn
    set({ loopRules, relationNames: relationNamesFilled(state.relationNames, state.shapes, state.loopAnswers, loopRules, { converses: state.converses, opaque: state.opaque }), log });
  },
  nameRelation: (siteId, loopId, name) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    const n = name.trim();
    if (!shape || !n) return 'a name is a word';
    const L = childLoopsCached(shape, siteId);
    const loop = L?.loops.find((l) => loopIdOf(L, l) === loopId);
    if (!L || !loop || loopReadingFor(L, loop, loopRecordsFor(shape, siteId, L, state.loopAnswers, state.loopRules, { converses: state.converses, opaque: state.opaque })).state !== 'filled') return 'only a filled loop is a relation to name';
    const held = state.relationNames.find(([s, v, l]) => s === shape.id && v === siteId && l === loopId);
    if (held && held[3] === n) return null;
    const relationNames: RelationNameRow[] = [...state.relationNames.filter(([s, v, l]) => !(s === shape.id && v === siteId && l === loopId)), [shape.id, siteId, loopId, n, held ? held[4] : '']];
    set({ relationNames, log: appendLog(state.log, { act: 'relname', shape: shape.id, site: siteId, loop: loopId, name: n, from: held ? held[4] : '', was: held ? held[3] : '' }) }); // D17 — the log
    return null;
  },
  readRelationFrom: (siteId, loopId, from) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    const held = shape ? state.relationNames.find(([s, v, l]) => s === shape.id && v === siteId && l === loopId) : undefined;
    if (!shape || !held || held[4] === from) return;
    // the reading is one of the loop's two roles (by its own identity), on a loop still filled
    const L = childLoopsCached(shape, siteId);
    const loop = L?.loops.find((l) => loopIdOf(L, l) === loopId);
    if (!L || !loop || ![roleIdOf(L, loop.i), roleIdOf(L, loop.j)].includes(from) || loopReadingFor(L, loop, loopRecordsFor(shape, siteId, L, state.loopAnswers, state.loopRules, { converses: state.converses, opaque: state.opaque })).state !== 'filled') return;
    const relationNames: RelationNameRow[] = state.relationNames.map((r) => (r === held ? [r[0], r[1], r[2], r[3], from] : r));
    set({ relationNames, log: appendLog(state.log, { act: 'relname', shape: shape.id, site: siteId, loop: loopId, name: held[3], from, was: held[3], wasFrom: held[4] }) }); // D17 — the log, the reading before kept
  },
  withdrawRelationName: (siteId, loopId) => {
    const state = get();
    const sh = state.currentShapeId;
    const held = state.relationNames.find(([s, v, l]) => s === sh && v === siteId && l === loopId);
    if (!held) return;
    set({ relationNames: state.relationNames.filter((r) => r !== held), log: appendLog(state.log, { act: 'relname', shape: sh, site: siteId, loop: loopId, name: '', from: '', was: held[3] }) }); // D17 — the log
  },
  clearLoopRefusal: () => { if (get().loopRefusal) set({ loopRefusal: null }); },
  setLoopView: (v) => { set({ loopView: v }); },
  setRelationView: (v) => { set({ relationView: v }); },
  setChildView: (v) => { set({ childView: v }); },
  // ═══ MODES-1 · B3 — the rules and the verdicts ═══
  nameRule: (w, w2, w3, shape = 'chain', subject) => {
    const a = w.trim(); const b = w2.trim(); const c = w3.trim();
    // M4 (§9.18) — NOTHING SILENT, each refusal by name through the one predicate, in either spelling: a rule's two WORDS (M6, §9.12 —
    // a pair with IS composes by SUBSTITUTION, a law, never a rule of his; the identity regime's IS ; IS = IS is built in, never
    // stored) and its RESULT (a rule (w, w′) ↦ IS would manufacture identifications by composition, Δ117 Q3 — the two gaps the
    // marker read at fb72659: the result was stored, and the glyph passed as a word)
    if (!a || !b || !c) return 'a rule names two words and what they come to';
    if ((a === IS_RULE[0] && b === IS_RULE[1]) || isReservedWord(a) || isReservedWord(b)) return reservedWordRefusal("a rule's word", 'what a pair carries through follows from the pair, not from a rule');
    if (isReservedWord(c)) return reservedWordRefusal('what a rule comes to', `two roles are made one by pairing them, not by composing ${a} and ${b}`);
    // MODES-4 · M3 (§9.14): one rule per (pair, shape) — a chain in its own order; a fork or a join order-free
    const rules = get().rules.filter((r) => !ruleReads(r, { w: a, w2: b, shape }));
    // M3: a fork or a join stores the subject end he chose; a same-word fork or join stores none (its composite is undirected, §9.21)
    const next: Rule[] = [...rules, shape === 'chain' ? [a, b, c] : subject && a !== b ? [a, b, c, shape, subject] : [a, b, c, shape]];
    const diff = ruleDiff(get().rules, next);
    set({ rules: next, log: appendLog(get().log, { act: 'rule', added: diff.added, removed: diff.removed }) }); // D17 — the log
    return null;
  },
  withdrawRule: (w, w2, shape = 'chain') => {
    const rules = get().rules.filter((r) => !ruleReads(r, { w, w2, shape }));
    if (rules.length !== get().rules.length) set({ rules, log: appendLog(get().log, { act: 'rule', added: [], removed: ruleDiff(get().rules, rules).removed }) }); // D17 — the log
  },
  giveVerdict: (faceId, record) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    // COPY-1 §4.3 / §7.7 and LAYOUT-1 §7 — A DECISION THE STORE REFUSES IS SHOWN WHERE IT WAS MADE: the sentence (the page opens it
    // `not taken —`) with its hands AS DATA, keyed by the edge and the passage (`sayRefusals`); the refusals no gesture reaches are
    // worded all the same. Every sentence states a fact of his record; nothing is called his; names, never ids (the one reader).
    if (!shape) return 'no shape is loaded';
    const face = shape.faces.find((f) => f.id === faceId);
    if (!face) return "this face isn't on the solid";
    if (face.vertexIds.length !== 3) return `decisions are made on three-cornered faces, and this one has ${face.vertexIds.length}`;
    const [i, j] = record.base;
    if (![0, 1, 2].includes(i) || ![0, 1, 2].includes(j) || i === j) return "this decision's record is incomplete";
    if (![record.x, record.w, record.z, record.w2, record.y].every((s) => typeof s === 'string' && s.trim().length > 0)) return "this decision's record is incomplete";
    if (record.verdict === 'composed' && !(typeof record.w3 === 'string' && record.w3.trim().length > 0)) return 'the decision has no word';
    const edge = edgeBetween(shape.edges, face.vertexIds[i], face.vertexIds[j]);
    const passageKey = `${record.x}|${record.w}|${record.z}|${record.w2}|${record.y}${record.dirs && !(record.dirs[0] === ALONG && record.dirs[1] === ALONG) ? `|${record.dirs.join('')}` : ''}`;
    const refusalKey = `${edge ? edge.id : faceId}|${passageKey}`;
    const refuse = (text: string, hands: Omit<SayRefusal, 'text'> = {}): string => { set({ sayRefusals: { ...get().sayRefusals, [refusalKey]: { text, ...hands } } }); return text; };
    const clear = (): void => { if (get().sayRefusals[refusalKey]) { const sayRefusals = { ...get().sayRefusals }; delete sayRefusals[refusalKey]; set({ sayRefusals }); } };
    // M3 S5 (b), RULED: a decision against his own pair or bar is refused BY NAME AT THE ACT — a tension is a passage pressing on his own
    // record, and deciding it would enter a contradiction in one click; his route is to withdraw the pair or the bar (the hands below),
    // after which the passage re-reads. The store refuses the act itself, so the rule holds by construction, not by the hand's absence.
    {
      const facts = { converses: state.converses, opaque: state.opaque };
      const sorting = sortingOf(shape, edge, {}, state.rules, facts);
      const view = sorting ? sorting.views.find((v) => v.faceId === faceId || shape.faces.find((f) => f.id === v.faceId)?.vertexIds.every((v2) => face.vertexIds.includes(v2))) : undefined;
      const path = view ? view.paths.find((p) => verdictNamesPath(record, p.path, view.paths.map((q) => q.path))) : undefined;
      const la = shape.vertices[face.vertexIds[i]]?.data.label || face.vertexIds[i];
      const lb = shape.vertices[face.vertexIds[j]]?.data.label || face.vertexIds[j];
      const opts = { tauDrafts: state.edgeTauDrafts };
      const nx = termWordsOf(shape, face.vertexIds[i], record.x, opts);
      const ny = termWordsOf(shape, face.vertexIds[j], record.y, opts);
      const notRecord: VerdictRecord = { base: record.base, x: record.x, w: record.w, z: record.z, w2: record.w2, y: record.y, ...(record.dirs ? { dirs: record.dirs } : {}), verdict: 'not' };
      // the second resolution §6, ahead of M5's law (MODES-4 · row 7): on a STANDING IS tension `comes to nothing` is refused naming the ROUTE — the pair
      if (path && path.reading === 'TENSION' && path.composite === IS && record.verdict === 'not') return refuse(`${nx} ≡ ${ny} runs into the pairs on ${la}–${lb}; to change it, change a pair`);
      // M5 (ADR 0031 §9.12): no decision on a passage with an IS leg — what it comes to follows from the pair
      if (isReservedWord(record.w) || isReservedWord(record.w2)) return refuse('this passage has a pair in it, so what it comes to follows from the pair; you decide only passages of two modes');
      // THE SECOND RESOLUTION §6/§7 (row 7), BY CONSTRUCTION: a decision is TO A WORD OF HIS — never ≡ (IS's ONE HOME, §247; M4 §9.18) — and
      // never to a word he has BARRED at the endpoints, whatever the passage reads (the sorting's own bar predicate, in every converse spelling)
      if (record.verdict === 'composed') {
        const w3 = (record.w3 as string).trim();
        if (isReservedWord(w3)) return refuse(`a passage isn't decided as ≡; to make a pair, pair the roles on ${la}–${lb}`);
        // M6 (5): a chosen order is a fork's or a join's; a chain's decision keeps the chain's own order (reachable by script alone)
        if (record.w3dir && (path ? path.path.shape === 'chain' : !record.dirs || shapeOf(record.dirs[0], record.dirs[1]) === 'chain')) return refuse("this passage is a chain, so its decision keeps the chain's own order");
        const from = path ? path.path.from : record.dirs && shapeOf(record.dirs[0], record.dirs[1]) === 'chain' && record.dirs[0] === AGAINST ? 'y' : 'x';
        const dir: Dir = record.w3dir ?? (record.dirs && from === 'y' ? AGAINST : ALONG);
        if (sorting && barredAt(sorting, facts, w3, record.x, record.y, dir)) {
          const bar = barOf(sorting, facts, w3, record.x, record.y, dir);
          return refuse(`${dir === AGAINST ? `${ny} ${w3} ${nx}` : `${nx} ${w3} ${ny}`} is barred on ${la}–${lb}`, bar ? { bar } : {});
        }
      }
      if (path && path.reading === 'TENSION' && record.verdict === 'composed') {
        const key = (path.direct ?? '').split('|');
        const w3 = (record.w3 as string).trim();
        if (path.end === 'target' && key.length === 3) return refuse(`${nx} ${w3} ${ny} runs into the pair ${termWordsOf(shape, face.vertexIds[i], key[1], opts)} ≡ ${ny} on ${la}–${lb}`, { pair: [key[1], record.y] });
        if (path.end === 'source' && key.length === 3) return refuse(`${nx} ${w3} ${ny} runs into the pair ${nx} ≡ ${termWordsOf(shape, face.vertexIds[j], key[2], opts)} on ${la}–${lb}`, { pair: [record.x, key[2]] });
        // §6: no decision on a TENSION at all — the line names what presses; his ways out are the bar's withdrawal or `comes to nothing`.
        // M8 (2): the bar is named FROM THE BAR ITSELF — the key that presses (`pressing` where a direct stands beside it, else `direct`) in
        // the key's OWN order — never from the composite's direction (an undirected composite has none)
        const barKey = path.pressing ?? path.direct;
        const pressed = sorting && barKey ? barByKey(sorting, facts, barKey) : null;
        const [bw, , , bd] = (barKey ?? '').split('|');
        const w = bw || path.composite || w3;
        const barWords = bd === AGAINST ? `${ny} ${w} ${nx}` : `${nx} ${w} ${ny}`;
        return refuse(`this passage runs into the bar ${barWords} on ${la}–${lb}`, { ...(pressed ? { bar: pressed } : {}), notIt: { faceId, record: notRecord } });
      }
    }
    clear();
    const stored: VerdictRecord = { ...record, base: [i, j] };
    const faces = shape.faces.map((f) => (f.id === faceId ? withVerdict(f, stored) : f));
    // D17 — the log: the decision as it landed (a same-path decision it replaces taken out with it)
    const diff = verdictDiff(verdictsOn(face), verdictsOn(faces.find((f) => f.id === faceId)));
    set({ shapes: { ...state.shapes, [shape.id]: { ...shape, faces } }, log: appendLog(state.log, { act: 'say', face: faceId, corners: [...face.vertexIds], added: diff.added, removed: diff.removed }) });
    return null;
  },
  withdrawVerdict: (faceId, record) => {
    const state = get();
    const shape = state.shapes[state.currentShapeId];
    if (!shape) return;
    const face = shape.faces.find((f) => f.id === faceId);
    if (!face) return;
    const twin = (f: Shape['faces'][number]): boolean => f.vertexIds.length === face.vertexIds.length && face.vertexIds.every((v, k) => f.vertexIds[k] === v);
    const faces = shape.faces.map((f) => (twin(f) ? withoutVerdict(f, record) : f));
    // D17 — the log: the withdrawal, per face record it left (a face two cells hold is two records)
    let log = state.log;
    shape.faces.forEach((f, k) => { if (!twin(f)) return; const diff = verdictDiff(verdictsOn(f), verdictsOn(faces[k])); if (diff.added.length || diff.removed.length) log = appendLog(log, { act: 'say', face: f.id, corners: [...f.vertexIds], added: diff.added, removed: diff.removed }); });
    set({ shapes: { ...state.shapes, [shape.id]: { ...shape, faces } }, log });
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
      rules: state.rules, // B3 — the person's rules ride the file (the verdicts ride the faces' packets inside `shapes`)
      bondRules: state.bondRules, // THE-ALTITUDE · slice 2 — his rules over three words ride the file (the bond sayings ride the faces' packets)
      roleNames: state.roleNames, // slice 2 · A — the names he gave the child's roles ride the file
      loopAnswers: state.loopAnswers, // slice 2 · D — his answers on the loops
      loopRules: state.loopRules, // slice 2 · D — his rules for loops' shapes
      relationNames: state.relationNames, // slice 2 · D — his names for the child's relations
      converses: state.converses, // MODES-4 · D13 — his converse equations ride the file
      opaque: state.opaque, // MODES-4 · §9.13 — the modes he declared opaque ride the file
      log: state.log, // MODES-4 · D17 — the person's acts in order, INPUT: the file carries the log beside the sets
    });
  },
  importWorkspace: (workspace) => {
    const validation = validateWorkspaceImport(workspace);

    if (!validation.ok) {
      throw new Error(validation.errors.join('\n'));
    }

    const purged = withoutReservedWords(validation.workspace); // M4 — item by item, named; the rest imported (§251)
    const importedWorkspace = purged.workspace;
    const importedShapes = Object.fromEntries(Object.entries(importedWorkspace.shapes).map(([id, held]) => [id, migrateChristening(held)]));
    const fileNames = namesFromFile(importedWorkspace.roleNames ?? [], importedShapes);
    const fileLoops = loopRecordsFromFile(importedWorkspace.loopAnswers ?? [], importedWorkspace.loopRules ?? [], importedWorkspace.relationNames ?? [], importedShapes, { converses: importedWorkspace.converses ?? [], opaque: importedWorkspace.opaque ?? [] });
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
      rules: importedWorkspace.rules ?? [], // B3 — the file's rules restored; the session's dropped
      bondRules: importedWorkspace.bondRules ?? [], // THE-ALTITUDE · slice 2
      roleNames: fileNames.names, // slice 2 · A — the file's names of the child's roles restored (read against its shapes); the session's dropped
      roleNameRefusal: null,
      childView: null,
      loopAnswers: fileLoops.answers, // slice 2 · D — the file's answers, rules and relation names, read against its shapes
      loopRules: fileLoops.rules, // IS and ≡ not taken, a second rule for one way not taken
      relationNames: fileLoops.names,
      loopRefusal: null,
      converses: importedWorkspace.converses ?? [], // MODES-4 — the file's converse equations restored (a file saved before MODES-4 carries none)
      opaque: importedWorkspace.opaque ?? [], // MODES-4 — the file's opaque modes restored
      log: importedWorkspace.log ?? [], // MODES-4 · D17 — the file's log restored, the session's dropped (a file saved before row 8 carries none: its names stand as snapshots, marked)
      relatingRefusals: {},
      sayRefusals: {},
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
    return [...purged.notTaken, ...fileNames.notTaken, ...fileLoops.notTaken];
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
    log: state.log, // row 9 — the log with the record
    roleNames: state.roleNames, // slice 2 · A — the names with the relatings they name
    loopAnswers: state.loopAnswers, // slice 2 · D — his answers with the loops they answer
    relationNames: state.relationNames,
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
    ...(snapshot.log ? { log: snapshot.log } : {}), // row 9 — a snapshot without a log (none persists; said) leaves the log as it is
    ...(snapshot.roleNames ? { roleNames: snapshot.roleNames } : {}), // slice 2 · A — the names as they stood with that record
    ...(snapshot.loopAnswers ? { loopAnswers: snapshot.loopAnswers } : {}), // slice 2 · D
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
  draftWas: EdgeIdentification['types'] | null = null,
): void {
  const before = shape.edges.find((edge) => edge.id === edgeId);
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
  // D17 — THE LOG (src/lib/stage.ts): the one writer of the identification packet appends what this act put into and took out of the
  // record — the role pairs, the τ pairs, the draft it moved (`draftWas` the draft before the act, the caller's pre-state) — as it lands
  const heldRoles = before?.identification ? before.identification.roles : [];
  const heldTypes = before?.identification ? before.identification.types : draftWas ?? [];
  const draftNow = state.edgeTauDrafts[edgeId] ?? null;
  const entry = { act: 'pair' as const, edge: edgeId, corners: before ? [...before.vertexIds] : undefined, roles: pairDiff(heldRoles, next ? next.roles : []), types: pairDiff(heldTypes, next ? next.types : draftNow ?? []), draft: { was: draftWas, now: draftNow } };
  const moved = entry.roles.added.length > 0 || entry.roles.removed.length > 0 || entry.types.added.length > 0 || entry.types.removed.length > 0 || JSON.stringify(draftWas) !== JSON.stringify(draftNow);
  const after: Shape = { ...shape, edges };
  set({
    edgeTauDrafts: state.edgeTauDrafts,
    midpointRefusals: state.midpointRefusals,
    log: moved ? appendLog(state.log, entry) : state.log,
    roleNames: namesStanding(state.roleNames, after), // slice 2 · A — a withdrawn pair takes its name with it
    ...loopRecordsStanding(state, after), // slice 2 · D — and a loop gone takes his answers and its relation's name
    shapes: {
      ...state.shapes,
      [shape.id]: after,
    },
  });
}

/** slice 2 · A (§9.38 (c)): A NAME GOES WITH ITS RELATING — the shape just written keeps only the names whose relating stands in its site's child; every
 *  other one is dropped in the same act, so it never comes back when the relating is made again. The other shapes' records are their own, untouched */
function namesStanding(names: RoleName[], after: Shape): RoleName[] {
  if (!names.some(([s]) => s === after.id)) return names;
  const memo = new Map<VertexId, Set<string> | null>();
  const keysAt = (site: VertexId): Set<string> | null => {
    if (!memo.has(site)) { const child = childSpaceOf(after, site); memo.set(site, child ? new Set(child.roles.map((r) => r.id)) : null); }
    return memo.get(site) ?? null;
  };
  const kept = names.filter(([s, site, key]) => s !== after.id || !!keysAt(site)?.has(key));
  return kept.length === names.length ? names : kept;
}

/** slice 2 · A: a shape made from another (the dissection, once — a child already held is returned to, never re-derived) starts with the names of the
 *  relatings it carries: each name of the parent's record whose site and relating stand in the new shape, unless that role or that name is held there */
function namesCarried(names: RoleName[], from: Shape, to: Shape): RoleName[] {
  const added: RoleName[] = [];
  for (const [s, site, key, name] of names) {
    if (s !== from.id || !to.vertices[site] || !childSpaceOf(to, site)?.roles.some((r) => r.id === key)) continue;
    const there = [...names, ...added].filter(([t, v]) => t === to.id && v === site);
    if (there.some(([, , k, m]) => k === key || m === name)) continue;
    added.push([to.id, site, key, name]);
  }
  return added.length ? [...names, ...added] : names;
}

/** slice 2 · D: an undone (or redone) record's relation names, read against the rules now in force — the rules hold across the solid and are no part of the
 *  snapshot, so a name a rule's change took away never comes back with an undo onto a loop that is not filled */
function namesAfterUndo(snapshot: WorkspaceSnapshot, rules: LoopRuleRow[], facts: LexiconFacts): { relationNames?: RelationNameRow[] } {
  if (!snapshot.relationNames) return {};
  return { relationNames: relationNamesFilled(snapshot.relationNames, snapshot.shapes, snapshot.loopAnswers ?? [], rules, facts) };
}

/** slice 2 · D: the way of a loop his answer is asked on — a loop of this site that can be asked (neither form nor two words at one pair), a diagonal starting
 *  at one of its two roles, a way that is not the relating itself — or null */
function askedWay(shape: Shape, siteId: VertexId, loopId: string, start: string, way: WaySide): { L: NonNullable<ReturnType<typeof childLoopsCached>>; loop: NonNullable<ReturnType<typeof childLoopsCached>>['loops'][number]; from: 'i' | 'j' } | null {
  const L = childLoopsCached(shape, siteId);
  const loop = L?.loops.find((l) => loopIdOf(L, l) === loopId);
  if (!L || !loop || loop.form || loop.kind === 'two') return null;
  const d = diagonalsOf(L, loop).find((x) => roleIdOf(L, x.from === 'i' ? loop.i : loop.j) === start);
  if (!d || (way === 'a' ? d.a.itself : d.b.itself)) return null;
  return { L, loop, from: d.from };
}

/** slice 2 · D: a relation's name stands only while its loop is FILLED — his answers or his rules changed so that it is filled no more, the name goes, never
 *  back by itself (each shape's names read in that shape) */
function relationNamesFilled(names: RelationNameRow[], shapes: Record<ShapeId, Shape>, answers: LoopAnswerRow[], rules: LoopRuleRow[], facts: LexiconFacts): RelationNameRow[] {
  if (names.length === 0) return names;
  const kept = names.filter(([s, site, loopId]) => {
    const shape = shapes[s];
    const L = shape ? childLoopsCached(shape, site) : null;
    const loop = L?.loops.find((l) => loopIdOf(L, l) === loopId);
    return !!shape && !!L && !!loop && loopReadingFor(L, loop, loopRecordsFor(shape, site, L, answers, rules, facts)).state === 'filled';
  });
  return kept.length === names.length ? names : kept;
}

/** slice 2 · D: the shape just written keeps only the answers and relation names of loops that still stand in it (a relating, a parent's relation or a bar
 *  changed): a loop gone takes his answers on it, and its relation's name; the other shapes' records are their own */
function loopRecordsStanding(state: GeometryState, after: Shape): { loopAnswers: LoopAnswerRow[]; relationNames: RelationNameRow[] } {
  const stands = (site: VertexId, loopId: string): boolean => { const L = childLoopsCached(after, site); return !!L && L.loops.some((l) => !l.form && l.kind !== 'two' && loopIdOf(L, l) === loopId); };
  const answers = state.loopAnswers.some(([s]) => s === after.id) ? state.loopAnswers.filter(([s, site, l]) => s !== after.id || stands(site, l)) : state.loopAnswers;
  const loopAnswers = answers.length === state.loopAnswers.length ? state.loopAnswers : answers;
  const shapes = { ...state.shapes, [after.id]: after };
  return { loopAnswers, relationNames: relationNamesFilled(state.relationNames, shapes, loopAnswers, state.loopRules, { converses: state.converses, opaque: state.opaque }) };
}

/** slice 2 · D: a shape made from another (the dissection, once) starts with his answers and relation names on the loops it carries */
function loopRecordsCarried(state: GeometryState, from: Shape, to: Shape): { loopAnswers: LoopAnswerRow[]; relationNames: RelationNameRow[] } {
  const stands = (site: VertexId, loopId: string): boolean => { if (!to.vertices[site]) return false; const L = childLoopsCached(to, site); return !!L && L.loops.some((l) => !l.form && l.kind !== 'two' && loopIdOf(L, l) === loopId); };
  const answers: LoopAnswerRow[] = state.loopAnswers.filter(([s, site, l]) => s === from.id && stands(site, l) && !state.loopAnswers.some(([t, v, m, st, w]) => t === to.id && v === site && m === l)).map(([, site, l, st, w, a]) => [to.id, site, l, st, w, a]);
  const loopAnswers = answers.length ? [...state.loopAnswers, ...answers] : state.loopAnswers;
  const names: RelationNameRow[] = state.relationNames.filter(([s, site, l]) => s === from.id && stands(site, l) && !state.relationNames.some(([t, v, m]) => t === to.id && v === site && m === l)).map(([, site, l, n, f]) => [to.id, site, l, n, f]);
  const shapes = { ...state.shapes, [to.id]: to };
  return { loopAnswers, relationNames: relationNamesFilled(names.length ? [...state.relationNames, ...names] : state.relationNames, shapes, loopAnswers, state.loopRules, { converses: state.converses, opaque: state.opaque }) };
}

/** slice 2 · D: a file's answers and relation names, read against its shapes — each taken only on a loop that stands and can be asked there (an answer also
 *  only on a way that is asked), a relation's name only on a loop the file's own answers and rules fill; the rest NOT TAKEN, by name */
function loopRecordsFromFile(answers: LoopAnswerRow[], rules: LoopRuleRow[], names: RelationNameRow[], shapes: Record<ShapeId, Shape>, facts: LexiconFacts): { answers: LoopAnswerRow[]; rules: LoopRuleRow[]; names: RelationNameRow[]; notTaken: string[] } {
  const notTaken: string[] = [];
  const where = (s: string, site: VertexId): string => shapes[s]?.vertices[site]?.data.label?.trim() || 'a midpoint';
  const keptAnswers: LoopAnswerRow[] = [];
  for (const row of answers) {
    const [s, site, loopId, start, way, a] = row;
    const shape = shapes[s];
    if (typeof a === 'string' && isReservedWord(a)) { notTaken.push(`an answer "${a.trim()}" on a loop at ${where(s, site)}: ${reservedWordRefusal('what a way comes to', 'two roles are made one by pairing them, not by a loop')}`); continue; }
    if (keptAnswers.some(([t, v, l, st, w]) => t === s && v === site && l === loopId && st === start && w === way)) { notTaken.push(`a second answer on one way of a loop at ${where(s, site)}`); continue; }
    if (!shape || !askedWay(shape, site, loopId, start, way)) { notTaken.push(`an answer on a loop at ${where(s, site)}: that loop's way is not asked there`); continue; }
    keptAnswers.push(row);
  }
  const keptRules = keptRulesOf(rules, notTaken);
  const first = names.filter(([s, site, l], k) => !names.slice(0, k).some(([t, v, m]) => t === s && v === site && m === l));
  const keptNames = relationNamesFilled(first, shapes, keptAnswers, keptRules, facts);
  for (const row of names) if (!keptNames.includes(row)) notTaken.push(first.includes(row) ? `the name "${row[3]}" for a relation at ${where(row[0], row[1])}: its loop is not filled there` : `a second name for one relation at ${where(row[0], row[1])}`);
  return { answers: keptAnswers, rules: keptRules, names: keptNames, notTaken };
}

/** slice 2 · D: a file's rules — IS and ≡ not taken, by name; a second rule for one way of one shape not taken */
function keptRulesOf(rules: LoopRuleRow[], notTaken: string[]): LoopRuleRow[] {
  const kept: LoopRuleRow[] = [];
  for (const r of rules) {
    if (typeof r[4] === 'string' && isReservedWord(r[4])) { notTaken.push(`a rule for a loop's shape coming to "${r[4].trim()}": ${reservedWordRefusal('what a way comes to', 'two roles are made one by pairing them, not by a loop')}`); continue; }
    if (kept.some((k) => k[0] === r[0] && k[1] === r[1] && k[2] === r[2] && k[3] === r[3])) { notTaken.push("a second rule for one way of a loop's shape"); continue; }
    kept.push(r);
  }
  return kept;
}

/** slice 2 · A: the names a file brings, read against the shapes it brings — each taken only where its shape and site are held, its relating stands, its
 *  role is not named twice and its name is held by no other role at that site (the store's guard, which the file never passed through); the rest NOT
 *  TAKEN, by name */
function namesFromFile(names: RoleName[], shapes: Record<ShapeId, Shape>): { names: RoleName[]; notTaken: string[] } {
  const kept: RoleName[] = [];
  const notTaken: string[] = [];
  for (const [s, site, key, raw] of names) {
    const name = raw.trim();
    const shape = shapes[s];
    const where = shape?.vertices[site]?.data.label?.trim() || 'a midpoint';
    const stands = !!shape && !!childSpaceOf(shape, site)?.roles.some((r) => r.id === key);
    const twice = kept.some(([t, v, k, m]) => t === s && v === site && (k === key || m === name));
    if (!stands || twice) { notTaken.push(`the name "${name}" at ${where}: ${!stands ? 'its relating does not stand there' : 'another role there holds it, or that role is named already'}`); continue; }
    kept.push([s, site, key, name]);
  }
  return { names: kept, notTaken };
}

// MODES-1 · B1: THE ONE WRITER of an edge's relatings (the packet, `edge.data.relatings`) — every act routes here; the
// module's pure `withRelating`/`withoutRelating` shape the packet, this site alone puts it on a shape.
function writeEdgeRelatings(set: (partial: Partial<GeometryState>) => void, state: GeometryState, shape: Shape, edgeId: EdgeId, change: (edge: Edge) => Edge): void {
  const held = shape.edges.find((edge) => edge.id === edgeId);
  const edges = shape.edges.map((edge) => (edge.id === edgeId ? change(edge) : edge));
  // D17 — the log: the relatings this act put in and took out (a bar is a relating with its sign; a withdrawal takes out)
  const diff = relatingDiff(relatingsHeld(held), relatingsHeld(edges.find((edge) => edge.id === edgeId)));
  const log = diff.added.length || diff.removed.length ? appendLog(state.log, { act: 'relate', edge: edgeId, corners: held ? [...held.vertexIds] : undefined, added: diff.added, removed: diff.removed }) : state.log;
  const after: Shape = { ...shape, edges };
  set({ relatingRefusals: state.relatingRefusals, log, roleNames: namesStanding(state.roleNames, after), ...loopRecordsStanding(state, after), shapes: { ...state.shapes, [shape.id]: after } }); // slice 2 · A — a withdrawn relating takes its name with it; slice 2 · D — a loop gone, its answers
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
  const draftWas = state.edgeTauDrafts[edge.id] ?? null;
  if (roles.length === 0) {
    if (types.length) edgeTauDrafts[edge.id] = types;
    else delete edgeTauDrafts[edge.id];
    writeEdgeIdentification(set, { ...state, edgeTauDrafts }, shape, edge.id, undefined, draftWas);
    return;
  }
  delete edgeTauDrafts[edge.id];
  writeEdgeIdentification(set, { ...state, edgeTauDrafts }, shape, edge.id, { roles, types }, draftWas);
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
  return { edgeId: broken.edgeId, siteId: broken.siteId, generationsUp: thereGen - hereGen, act: { kind: broken.kind, pair: broken.pair }, names: broken.names, why: broken.why, ...(broken.mode ? { mode: broken.mode, reversed: broken.reversed === true } : {}) };
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
  const refuse = (form: string | undefined, conflicts: Conflict[], dependency?: MidpointDependency, prior?: MidpointAct, solid?: MidpointSolidRefusal): void => {
    set({ midpointRefusals: { ...get().midpointRefusals, [edgeId]: { act, ...(form ? { form } : {}), ...(prior ? { prior } : {}), conflicts, ...(dependency ? { dependency } : {}), ...(solid ? { solid } : {}) } } });
  };
  const la = shape.vertices[edge.vertexIds[0]]?.data.label || 'unnamed';
  const lb = shape.vertices[edge.vertexIds[1]]?.data.label || 'unnamed';
  // LAYOUT-1 §7 / COPY-1 §4.3 — the solid's identity refused WITH ITS DATA: at a generation-2 medial edge the two ends are relatings holding one
  // role of the parents' shared corner; the pairing that makes them one lives on the edge between the two other parents, one generation down
  const opts = { tauDrafts: get().edgeTauDrafts };
  const solidRefusal = (x: string, y: string): MidpointSolidRefusal | null => {
    const [U, V] = edge.vertexIds;
    const pu = shape.vertices[U]?.createdBy.sourceVertexIds ?? []; const pv = shape.vertices[V]?.createdBy.sourceVertexIds ?? [];
    const P = pu.find((p) => pv.includes(p));
    if (P === undefined || pu.length !== 2 || pv.length !== 2) return null;
    const Qu = pu.find((p) => p !== P); const Qv = pv.find((p) => p !== P);
    if (Qu === undefined || Qv === undefined) return null;
    const iu = instancesFrom(shape, P, Qu, opts).find((k) => k.key === x);
    const iv = instancesFrom(shape, P, Qv, opts).find((k) => k.key === y);
    if (!iu || !iv || iu.p !== iv.p) return null;
    const between = edgeBetween(shape.edges, Qu, Qv) ?? null;
    // the pairs on that edge through the one reader (B1: `instancesOn` — IS-instances are the pairing), in the edge's own order
    const paired = !!between && instancesOn(between).some((r) => r[0] === IS && (between.vertexIds[0] === Qu ? r[1] === iu.q && r[2] === iv.q : r[1] === iv.q && r[2] === iu.q));
    const name = (c: VertexId, id: string): string => { const sp = spaceOf(shape, c, opts); return sp ? nameIn(sp.space, id) : id; };
    return { corner: P, role: name(P, iu.p), others: [name(Qu, iu.q), name(Qv, iv.q)], edge: between ? [between.vertexIds[0], between.vertexIds[1]] : null, paired, open: between ? midpointOf(shape, between) : null, instances: [termWordsOf(shape, U, x, opts), termWordsOf(shape, V, y, opts)] };
  };
  const solidWords = (s: MidpointSolidRefusal): string => {
    const L = (v: VertexId): string => shape.vertices[v]?.data.label || 'unnamed';
    if (s.edge) {
      const e = `${L(s.edge[0])}–${L(s.edge[1])}`;
      return s.paired
        ? `these are already one: both hold ${s.role}, and you paired ${s.others[0]} with ${s.others[1]} on ${e}`
        : `both hold ${s.role}, so this means pairing ${s.others[0]} with ${s.others[1]}, which you do on ${e}`;
    }
    return `the solid already makes ${s.instances[0]} and ${s.instances[1]} one, through ${L(s.corner)}; you can't pair or withdraw that`;
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
    if (!A.roles.some((r) => r.id === x)) return refuse(`${x} isn't a role of ${la}`, []);
    if (!B.roles.some((r) => r.id === y)) return refuse(`${y} isn't a role of ${lb}`, []);
    // STAMP MODES-3 (the mothership's ruling 1, 16:18 — no new born pair): a term no COLUMN offers — a parent's leftover seed role the
    // resolver's merged space still houses — is refused by name; what the columns offer is what the act takes, by construction
    const colA = columnSpaceOf(shape, edge.vertexIds[0], opts);
    const colB = columnSpaceOf(shape, edge.vertexIds[1], opts);
    if (colA && !colA.roles.some((r) => r.id === x)) return refuse(`${nameIn(A, x)} isn't a role of ${la}`, []);
    if (colB && !colB.roles.some((r) => r.id === y)) return refuse(`${nameIn(B, y)} isn't a role of ${lb}`, []);
    // MODES-4 · M1 (ADR 0031 §9.10; the designer's 11:00 §1; the ruling of 10:58): on a CORNER edge the pair of the parent's role a
    // and an instance i with a = π_P(i) is the coordinate map itself — never an entry of the extent (D14); the IS act on it is refused
    // by name, the subject the relating, so the line reads the same whichever order the two were given in: `(F7 ≡ Φ1) already holds
    // F7 — it is carried there`. `holds` is the one structure word. A mode word on the same pair is an ordinary entry (§9.10)
    if (kind === 'corner') {
      const parentFirst = shape.vertices[edge.vertexIds[1]]?.createdBy.sourceVertexIds.includes(edge.vertexIds[0]) ?? false;
      const P = parentFirst ? edge.vertexIds[0] : edge.vertexIds[1];
      const C = parentFirst ? edge.vertexIds[1] : edge.vertexIds[0];
      const [a, i] = parentFirst ? [x, y] : [y, x];
      const Q = shape.vertices[C]?.createdBy.sourceVertexIds.find((v) => v !== P);
      // the instance's P-coordinate read off the edge P–Q's own stored order (instancesFrom), never off the sources' listed order
      const inst = Q !== undefined ? instancesFrom(shape, P, Q, { tauDrafts: get().edgeTauDrafts }).find((k) => k.key === i) : undefined;
      if (inst && inst.p === a) return refuse(`${termWordsOf(shape, C, i, { tauDrafts: get().edgeTauDrafts })} already holds ${nameIn(parentFirst ? A : B, a)}, so it's carried there`, []);
    }
    if (composed) {
      // STAMP MODES-3: only THE COMPOSED PAIR ITSELF is refused — x and y both holding the same role of the shared corner, the coordinate
      // identity (D15's inherited ≡, LAYOUT-1 §7's form); a point holding a role of the shared corner paired with a point holding another
      // is a generation-2 relating, taken (C-8 item 3's `never pickable` went with the composed mark)
      const cx = composed.roles.find(([a, b]) => a === x && b === y);
      const pair: [string, string] | null = cx ? [x, y] : null;
      if (pair) {
        const s = solidRefusal(pair[0], pair[1]);
        if (s) return refuse(solidWords(s), [], undefined, undefined, s);
        const corner = cornerWords(`0|${x}`) || cornerWords(`1|${y}`) || 'their shared corner';
        return refuse(`the solid already makes ${termWordsOf(shape, edge.vertexIds[0], pair[0], opts)} and ${termWordsOf(shape, edge.vertexIds[1], pair[1], opts)} one, through ${corner}; you can't pair or withdraw that`, []);
      }
    }
    const px = roles.find(([a]) => a === x);
    if (px) return refuse(`${nameIn(A, x)} is already paired with ${nameIn(B, px[1])}, and a role takes one partner`, [], undefined, { kind: 'role', pair: [px[0], px[1]] });
    const py = roles.find(([, b]) => b === y);
    if (py) return refuse(`${nameIn(B, y)} is already paired with ${nameIn(A, py[0])}, and a role takes one partner`, [], undefined, { kind: 'role', pair: [py[0], py[1]] });
    // C-8c — THE STONE AT THE ACT (0031 §6 invariant 3): the class this pair would make holds two seed roles of ONE
    // corner ⇒ refused by name — the two seed roles by their own labels and their corner — nothing written
    const stone = stoneOn(RA, RB, x, y, 'role');
    if (stone) return refuse(stoneWords(shape, stone, `${nameIn(A, x)} ↦ ${nameIn(B, y)}`), []);
    nextRoles = [...roles, [x, y]];
  } else {
    const [s, w] = act.pair;
    const form = wordPairForm(A, B, s, w, [la, lb]);
    if (form) return refuse(form, []);
    if (composed) {
      // STAMP MODES-3: the composed WORD pair itself (the shared corner's one word on both sides), and nothing else
      const cs = composed.words.find(([a, b]) => a === s && b === w);
      if (cs) return refuse(`the solid already makes ${s} and ${cs[1]} one word; you can't translate or withdraw that`, []);
    }
    const ps = types.find(([a]) => a === s);
    if (ps) return refuse(`${s} is already translated as ${ps[1]}, and a word takes one translation`, [], undefined, { kind: 'word', pair: [ps[0], ps[1]] });
    const pw = types.find(([, b]) => b === w);
    if (pw) return refuse(`${w} is already the translation of ${pw[0]}`, [], undefined, { kind: 'word', pair: [pw[0], pw[1]] });
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
  // STAMP MODES-3 (the ruling's 2): a relating at generation ≥ 2 this act would orphan — its end no longer held by the parent's child
  const orphaned = orphanedRelatings(shape, { tauDrafts: state.edgeTauDrafts, candidate: { edgeId, roles: nextRoles, types: nextTypes } }, edgeId);
  if (orphaned.length) return refuse(undefined, [], dependencyOf(shape, edge, orphaned[0]));
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
  // STAMP MODES-3 (the mothership's ruling 2, 16:18): a withdrawal that would ORPHAN a relating at generation ≥ 2 — the pair withdrawn is
  // one of its ends — is refused the same way, naming the relating; the far hand withdraws that relating first (the designer's 16:26 §3)
  const orphaned = orphanedRelatings(shape, { tauDrafts: state.edgeTauDrafts, candidate: { edgeId, roles: nextRoles, types: nextTypes } }, edgeId);
  if (orphaned.length) {
    set({ midpointRefusals: { ...state.midpointRefusals, [edgeId]: { act: { ...act, withdrawal: true }, conflicts: [], dependency: dependencyOf(shape, edge, orphaned[0]) } } });
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

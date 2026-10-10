import type { CellId, SeedKey, Shape, ShapeId, VertexId } from '../types/geometry';
import type { LogEntry } from './stage';

export const WORKSPACE_PERSISTENCE_SCHEMA = 'platonic-engine.workspace';
export const WORKSPACE_PERSISTENCE_VERSION = 1;

export interface PersistedCellVisibility {
  showCoreCells: boolean;
  showResidueCells: boolean;
  showParentCells: boolean;
}

export interface PersistedViewLayout {
  explodeAmount: number;
  dualViewEnabled: boolean;
  isolateSelectedCell: boolean;
  showFieldAtlasSamples?: boolean;
}

export interface PersistedOperationHistoryEntry {
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

/**
 * F3 (2026-09-25, Arman's Δ113 — persistence only): the word pairs given on an edge with no plain role pair live in the store's
 * `edgeTauDrafts` (τ before the first role pair, C-7e), not in the edge's record; they ride the workspace file under this field,
 * keyed by the edge's id, and an Import restores the file's and drops the session's. Absent on files saved before F3.
 */
export type PersistedEdgeTauDrafts = Record<string, Array<[string, string]>>;

export interface PersistedWorkspaceV1 {
  schema: typeof WORKSPACE_PERSISTENCE_SCHEMA;
  version: typeof WORKSPACE_PERSISTENCE_VERSION;
  exportedAt: string;
  label?: string;
  selectedSeedKey: SeedKey;
  shapes: Record<ShapeId, Shape>;
  shapeOrder: ShapeId[];
  currentShapeId: ShapeId;
  selectedCellId: CellId | null;
  selectedVertexId: VertexId | null;
  operationHistory: PersistedOperationHistoryEntry[];
  historySequence: number;
  cellVisibility?: PersistedCellVisibility;
  viewLayout?: PersistedViewLayout;
  edgeTauDrafts?: PersistedEdgeTauDrafts;
  lexicon?: string[]; // MODES-1 · B1 — the declared modes (the relatings ride the edges' packets inside `shapes`)
  bondRules?: Array<[string, string, string, string]>; // THE-ALTITUDE · slice 2 (§9.30 R2) — the person's rules over three words across a corner's relation
  roleNames?: Array<[string, string, string, string]>; // STAMP THE-FINDINGS-BATCH · slice 2 · A (§9.38 (c)) — the names he gave the roles of a midpoint's child, per shape: the shape, the site's vertex id, the role's key, the name
  rules?: Array<[string, string, string] | [string, string, string, 'chain' | 'fork' | 'join'] | [string, string, string, 'chain' | 'fork' | 'join', 'first' | 'second']>; // MODES-1 · B3 — the person's rules (the verdicts ride the faces' packets inside `shapes`); MODES-4 — keyed on the path's shape, a 3-tuple the chain
  converses?: Array<[string, string]>; // MODES-4 · D13 — the person's converse equations, `y w′ x ≡ x w y`
  opaque?: string[]; // MODES-4 · §9.13 — the modes the person declared opaque (substitution does not ride through them)
  log?: LogEntry[]; // MODES-4 · D17 — the person's acts in the order he made them, INPUT (src/lib/stage.ts); absent on files saved before row 8
}

export interface WorkspacePersistenceSnapshot {
  selectedSeedKey: SeedKey;
  shapes: Record<ShapeId, Shape>;
  shapeOrder: ShapeId[];
  currentShapeId: ShapeId;
  selectedCellId: CellId | null;
  selectedVertexId: VertexId | null;
  operationHistory: PersistedOperationHistoryEntry[];
  historySequence: number;
  cellVisibility?: PersistedCellVisibility;
  viewLayout?: PersistedViewLayout;
  edgeTauDrafts?: PersistedEdgeTauDrafts;
  lexicon?: string[]; // MODES-1 · B1 — the declared modes (the relatings ride the edges' packets inside `shapes`)
  bondRules?: Array<[string, string, string, string]>; // THE-ALTITUDE · slice 2 (§9.30 R2) — the person's rules over three words across a corner's relation
  roleNames?: Array<[string, string, string, string]>; // STAMP THE-FINDINGS-BATCH · slice 2 · A (§9.38 (c)) — the names he gave the roles of a midpoint's child, per shape: the shape, the site's vertex id, the role's key, the name
  rules?: Array<[string, string, string] | [string, string, string, 'chain' | 'fork' | 'join'] | [string, string, string, 'chain' | 'fork' | 'join', 'first' | 'second']>; // MODES-1 · B3 — the person's rules (the verdicts ride the faces' packets inside `shapes`); MODES-4 — keyed on the path's shape
  converses?: Array<[string, string]>; // MODES-4 · D13 — the person's converse equations
  opaque?: string[]; // MODES-4 · §9.13 — the modes the person declared opaque
  log?: LogEntry[]; // MODES-4 · D17 — the log rides the file beside the sets
}

export type WorkspaceImportValidationResult =
  | { ok: true; workspace: PersistedWorkspaceV1 }
  | { ok: false; errors: string[] };

export function serializeWorkspaceSnapshot(
  snapshot: WorkspacePersistenceSnapshot,
  exportedAt = new Date().toISOString(),
): PersistedWorkspaceV1 {
  return {
    schema: WORKSPACE_PERSISTENCE_SCHEMA,
    version: WORKSPACE_PERSISTENCE_VERSION,
    exportedAt,
    label: 'PlatonicEngine workspace',
    selectedSeedKey: snapshot.selectedSeedKey,
    shapes: snapshot.shapes,
    shapeOrder: snapshot.shapeOrder,
    currentShapeId: snapshot.currentShapeId,
    selectedCellId: snapshot.selectedCellId,
    selectedVertexId: snapshot.selectedVertexId,
    operationHistory: snapshot.operationHistory,
    historySequence: snapshot.historySequence,
    cellVisibility: snapshot.cellVisibility,
    viewLayout: snapshot.viewLayout,
    edgeTauDrafts: snapshot.edgeTauDrafts ?? {},
    lexicon: snapshot.lexicon ?? [],
    rules: snapshot.rules ?? [],
    bondRules: snapshot.bondRules ?? [], // THE-ALTITUDE · slice 2 (§9.30 R2) — his rules over three words ride the file
    roleNames: snapshot.roleNames ?? [], // slice 2 · A — the names of the child's roles ride the file
    converses: snapshot.converses ?? [],
    opaque: snapshot.opaque ?? [],
    log: snapshot.log ?? [],
  };
}

export function parseWorkspaceImport(input: unknown): PersistedWorkspaceV1 {
  const result = validateWorkspaceImport(input);

  if (!result.ok) {
    throw new Error(result.errors.join('\n'));
  }

  return result.workspace;
}

export function validateWorkspaceImport(input: unknown): WorkspaceImportValidationResult {
  const errors: string[] = [];

  if (!isRecord(input)) {
    return {
      ok: false,
      errors: ["the file isn't a JSON object"], // COPY-1 §5.4 — every refusal here is a sentence the page prints after `not imported —`
    };
  }

  // a file that is not a workspace file is refused with that one sentence: the checks below are checks on a workspace file's fields,
  // and listing each of them after this sentence said nothing more (measured at the eye, stage 4a)
  if (input.schema !== WORKSPACE_PERSISTENCE_SCHEMA) {
    return { ok: false, errors: ["this isn't a workspace file"] };
  }

  if (input.version !== WORKSPACE_PERSISTENCE_VERSION) {
    errors.push(`the file's workspace version isn't ${WORKSPACE_PERSISTENCE_VERSION}`);
  }

  if (typeof input.exportedAt !== 'string' || !input.exportedAt) {
    errors.push("the file's exportedAt is malformed");
  }

  if (typeof input.selectedSeedKey !== 'string' || !input.selectedSeedKey) {
    errors.push("the file's selectedSeedKey is malformed");
  }

  if (!isRecord(input.shapes)) {
    errors.push("the file's shapes is malformed");
  }

  if (!Array.isArray(input.shapeOrder) || !input.shapeOrder.length) {
    errors.push("the file's shapeOrder is malformed");
  } else if (!input.shapeOrder.every((shapeId) => typeof shapeId === 'string' && shapeId)) {
    errors.push("the file's shapeOrder is malformed");
  }

  if (typeof input.currentShapeId !== 'string' || !input.currentShapeId) {
    errors.push("the file's currentShapeId is malformed");
  }

  if (input.selectedCellId !== null && typeof input.selectedCellId !== 'string') {
    errors.push("the file's selectedCellId is malformed");
  }

  if (input.selectedVertexId !== null && typeof input.selectedVertexId !== 'string') {
    errors.push("the file's selectedVertexId is malformed");
  }

  if (!Array.isArray(input.operationHistory)) {
    errors.push("the file's operationHistory is malformed");
  }

  if (
    typeof input.historySequence !== 'number' ||
    !Number.isInteger(input.historySequence) ||
    input.historySequence < 0
  ) {
    errors.push("the file's historySequence is malformed");
  }

  const shapes = isRecord(input.shapes) ? input.shapes : {};
  const shapeOrder = Array.isArray(input.shapeOrder)
    ? input.shapeOrder.filter((shapeId): shapeId is string => typeof shapeId === 'string')
    : [];
  const currentShapeId = typeof input.currentShapeId === 'string' ? input.currentShapeId : '';

  for (const [shapeId, shape] of Object.entries(shapes)) {
    validateShapeObject(shapeId, shape, errors);
  }

  if (currentShapeId && !shapes[currentShapeId]) {
    errors.push("the file's current shape is missing");
  }

  for (const shapeId of shapeOrder) {
    if (!shapes[shapeId]) {
      errors.push('a shape the file lists is missing');
    }
  }

  const currentShape = isShapeLike(shapes[currentShapeId]) ? shapes[currentShapeId] : null;

  if (currentShape && typeof input.selectedCellId === 'string') {
    if (!currentShape.cells.some((cell) => cell.id === input.selectedCellId)) {
      errors.push("the file's selectedCellId is malformed");
    }
  }

  if (currentShape && typeof input.selectedVertexId === 'string') {
    if (!currentShape.vertices[input.selectedVertexId]) {
      errors.push("the file's selectedVertexId is malformed");
    }
  }

  if (input.cellVisibility !== undefined && !isCellVisibility(input.cellVisibility)) {
    errors.push("the file's cellVisibility is malformed");
  }

  if (input.viewLayout !== undefined && !isViewLayout(input.viewLayout)) {
    errors.push("the file's viewLayout is malformed");
  }

  if (input.edgeTauDrafts !== undefined && !isEdgeTauDrafts(input.edgeTauDrafts)) {
    errors.push("the file's edgeTauDrafts is malformed");
  }

  if (input.lexicon !== undefined && !isLexicon(input.lexicon)) {
    errors.push("the file's lexicon is malformed");
  }

  if (input.rules !== undefined && !isRules(input.rules)) {
    errors.push("the file's rules is malformed");
  }

  if (input.bondRules !== undefined && !isBondRules(input.bondRules)) {
    errors.push("the file's bond rules is malformed");
  }

  if (input.roleNames !== undefined && !isRoleNames(input.roleNames)) {
    errors.push("the file's role names is malformed");
  }

  if (input.log !== undefined && !isLog(input.log)) {
    errors.push("the file's log is malformed");
  }

  if (input.converses !== undefined && !isConverses(input.converses)) {
    errors.push("the file's converses is malformed");
  }

  if (input.opaque !== undefined && !isLexicon(input.opaque)) {
    errors.push("the file's opaque is malformed");
  }

  if (errors.length) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    workspace: input as unknown as PersistedWorkspaceV1,
  };
}

function validateShapeObject(shapeId: string, shape: unknown, errors: string[]): void {
  if (!isShapeLike(shape)) {
    errors.push('a shape in the file is incomplete');
    return;
  }

  if (shape.id !== shapeId) {
    errors.push("a shape's id doesn't match its key");
  }
}

function isShapeLike(value: unknown): value is Shape {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    isRecord(value.vertices) &&
    Array.isArray(value.edges) &&
    Array.isArray(value.faces) &&
    Array.isArray(value.cells) &&
    Array.isArray(value.generations) &&
    isRecord(value.genealogy)
  );
}

function isCellVisibility(value: unknown): value is PersistedCellVisibility {
  return (
    isRecord(value) &&
    typeof value.showCoreCells === 'boolean' &&
    typeof value.showResidueCells === 'boolean' &&
    typeof value.showParentCells === 'boolean'
  );
}

function isViewLayout(value: unknown): value is PersistedViewLayout {
  return (
    isRecord(value) &&
    typeof value.dualViewEnabled === 'boolean' &&
    typeof value.isolateSelectedCell === 'boolean' &&
    (value.showFieldAtlasSamples === undefined ||
      typeof value.showFieldAtlasSamples === 'boolean') &&
    typeof value.explodeAmount === 'number' &&
    Number.isFinite(value.explodeAmount)
  );
}

/** F3 — a record of edge id → word pairs, each pair two strings; a file saved before F3 has no field at all (accepted) */
function isEdgeTauDrafts(value: unknown): value is PersistedEdgeTauDrafts {
  return (
    isRecord(value) &&
    Object.values(value).every(
      (pairs) => Array.isArray(pairs) && pairs.every((pair) => Array.isArray(pair) && pair.length === 2 && pair.every((w) => typeof w === 'string')),
    )
  );
}

/** MODES-1 · B1 — the declared modes: words, in the person's order; a file saved before B1 has no field at all (accepted) */
function isLexicon(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((w) => typeof w === 'string' && w.trim().length > 0);
}

/** MODES-1 · B3 — the person's rules (w, w′) ↦ w‴: triples of words, or (MODES-4) a triple with the path's shape — chain · fork · join; a file saved before B3 has no field (accepted) */
/** MODES-4 · D17 — the log: a sequence of acts numbered 1, 2, … in order, each naming its act (the entries' bodies are the store's own; a malformed one is refused whole) */
function isLog(value: unknown): value is LogEntry[] {
  return Array.isArray(value) && value.every((e, i) => isRecord(e) && e.n === i + 1 && typeof e.act === 'string' && e.act.length > 0);
}

/** THE-ALTITUDE · slice 2 (§9.30 R2): a bond rule is four words — `w`, the relation's name `S`, `w2`, and what the passage across the relation comes to */
function isBondRules(value: unknown): value is Array<[string, string, string, string]> {
  const word = (w: unknown): boolean => typeof w === 'string' && w.trim().length > 0;
  return Array.isArray(value) && value.every((r) => Array.isArray(r) && r.length === 4 && r.every(word));
}

/** slice 2 · A (§9.38 (c)): a role's name is four words — the shape whose record it is, the site's vertex id, the role's key, and the name he gave it
 *  (whether each still names a relating that stands, once, and alone at its site, is the store's import's to read — it holds the shapes) */
function isRoleNames(value: unknown): value is Array<[string, string, string, string]> {
  const word = (w: unknown): boolean => typeof w === 'string' && w.trim().length > 0;
  return Array.isArray(value) && value.every((r) => Array.isArray(r) && r.length === 4 && r.every(word));
}

function isRules(value: unknown): value is Array<[string, string, string] | [string, string, string, 'chain' | 'fork' | 'join']> {
  const word = (w: unknown): boolean => typeof w === 'string' && w.trim().length > 0;
  return Array.isArray(value) && value.every((r) => Array.isArray(r) && ((r.length === 3 && r.every(word)) || (r.length === 4 && r.slice(0, 3).every(word) && ['chain', 'fork', 'join'].includes(r[3])) || (r.length === 5 && r.slice(0, 3).every(word) && ['fork', 'join'].includes(r[3]) && ['first', 'second'].includes(r[4]))));
}

/** MODES-4 · D13 — the person's converse equations: pairs of words; a file saved before MODES-4 has no field (accepted) */
function isConverses(value: unknown): value is Array<[string, string]> {
  return Array.isArray(value) && value.every((r) => Array.isArray(r) && r.length === 2 && r.every((w) => typeof w === 'string' && w.trim().length > 0));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

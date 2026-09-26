import type { CellId, SeedKey, Shape, ShapeId, VertexId } from '../types/geometry';

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
  rules?: Array<[string, string, string]>; // MODES-1 · B3 — the person's rules (the verdicts ride the faces' packets inside `shapes`)
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
  rules?: Array<[string, string, string]>; // MODES-1 · B3 — the person's rules (the verdicts ride the faces' packets inside `shapes`)
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
      errors: ['Workspace import must be a JSON object.'],
    };
  }

  if (input.schema !== WORKSPACE_PERSISTENCE_SCHEMA) {
    errors.push(`Workspace schema must be ${WORKSPACE_PERSISTENCE_SCHEMA}.`);
  }

  if (input.version !== WORKSPACE_PERSISTENCE_VERSION) {
    errors.push(`Workspace version must be ${WORKSPACE_PERSISTENCE_VERSION}.`);
  }

  if (typeof input.exportedAt !== 'string' || !input.exportedAt) {
    errors.push('Workspace exportedAt must be a timestamp string.');
  }

  if (typeof input.selectedSeedKey !== 'string' || !input.selectedSeedKey) {
    errors.push('Workspace selectedSeedKey must be a string.');
  }

  if (!isRecord(input.shapes)) {
    errors.push('Workspace shapes must be an object.');
  }

  if (!Array.isArray(input.shapeOrder) || !input.shapeOrder.length) {
    errors.push('Workspace shapeOrder must be a nonempty array.');
  } else if (!input.shapeOrder.every((shapeId) => typeof shapeId === 'string' && shapeId)) {
    errors.push('Workspace shapeOrder must contain shape ids.');
  }

  if (typeof input.currentShapeId !== 'string' || !input.currentShapeId) {
    errors.push('Workspace currentShapeId must be a string.');
  }

  if (input.selectedCellId !== null && typeof input.selectedCellId !== 'string') {
    errors.push('Workspace selectedCellId must be a string or null.');
  }

  if (input.selectedVertexId !== null && typeof input.selectedVertexId !== 'string') {
    errors.push('Workspace selectedVertexId must be a string or null.');
  }

  if (!Array.isArray(input.operationHistory)) {
    errors.push('Workspace operationHistory must be an array.');
  }

  if (
    typeof input.historySequence !== 'number' ||
    !Number.isInteger(input.historySequence) ||
    input.historySequence < 0
  ) {
    errors.push('Workspace historySequence must be a nonnegative integer.');
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
    errors.push('Workspace currentShapeId must exist in shapes.');
  }

  for (const shapeId of shapeOrder) {
    if (!shapes[shapeId]) {
      errors.push(`Workspace shapeOrder id ${shapeId} is missing from shapes.`);
    }
  }

  const currentShape = isShapeLike(shapes[currentShapeId]) ? shapes[currentShapeId] : null;

  if (currentShape && typeof input.selectedCellId === 'string') {
    if (!currentShape.cells.some((cell) => cell.id === input.selectedCellId)) {
      errors.push('Workspace selectedCellId must exist in the current shape.');
    }
  }

  if (currentShape && typeof input.selectedVertexId === 'string') {
    if (!currentShape.vertices[input.selectedVertexId]) {
      errors.push('Workspace selectedVertexId must exist in the current shape.');
    }
  }

  if (input.cellVisibility !== undefined && !isCellVisibility(input.cellVisibility)) {
    errors.push('Workspace cellVisibility is malformed.');
  }

  if (input.viewLayout !== undefined && !isViewLayout(input.viewLayout)) {
    errors.push('Workspace viewLayout is malformed.');
  }

  if (input.edgeTauDrafts !== undefined && !isEdgeTauDrafts(input.edgeTauDrafts)) {
    errors.push('Workspace edgeTauDrafts is malformed.');
  }

  if (input.lexicon !== undefined && !isLexicon(input.lexicon)) {
    errors.push('Workspace lexicon is malformed.');
  }

  if (input.rules !== undefined && !isRules(input.rules)) {
    errors.push('Workspace rules is malformed.');
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
    errors.push(`Shape ${shapeId} must contain vertices, edges, faces, cells, generations, and genealogy.`);
    return;
  }

  if (shape.id !== shapeId) {
    errors.push(`Shape object id ${shape.id} does not match shapes key ${shapeId}.`);
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

/** MODES-1 · B3 — the person's rules (w, w′) ↦ w‴: triples of words; a file saved before B3 has no field (accepted) */
function isRules(value: unknown): value is Array<[string, string, string]> {
  return Array.isArray(value) && value.every((r) => Array.isArray(r) && r.length === 3 && r.every((w) => typeof w === 'string' && w.trim().length > 0));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

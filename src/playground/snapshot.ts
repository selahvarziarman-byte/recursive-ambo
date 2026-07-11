// snapshot — E1 (mothership G2): self-contained save/load across universes (ADR 0010).
//
// A snapshot is a SELF-CONTAINED serialization of one form — its full Shape
// (vertices / edges / faces / genealogy, verbatim) plus an OPAQUE `sourceId`:
// pure provenance, a NAME, not a doorway (deserialization never touches any
// live universe). Loading rebuilds the form SOURCE-NAMESPACED so co-location ≠
// identity holds across universes — the COMMITTED multiform mechanism, reused
// not forked: every vertex-id occurrence is prefixed `<source>:<id>` (the same
// `${source}:${plainId}` rule `loadForm` applies), and the committed
// `lineage.primalMultiset` then keys each source-less root to its own
// namespaced id (multiform.ts's stated extension point — no lineage change).
// Structure is otherwise BYTE-FAITHFUL: edges are carried, never re-derived
// (a quotient form's parallel edge classes survive); carried (minted) lineage
// survives with its roots prefixed.
//
// Re-rooting: the loaded form's `parentShapeId` is set to null — its parents
// live in the SOURCE universe (named by `sourceId`, not resolvable here); the
// original pointer stays inside the snapshot file untouched. The rest of the
// genealogy (operation, depth, source/created vertex ids — namespaced) is
// preserved as the self-contained truth of what the form IS.
//
// DERIVE-ONLY · committed modules by import; no invariant recomputed.

import type { Cell, Edge, Face, Generation, Shape, Vertex, VertexId } from '../types/geometry';

// The reserved `primalMultisetKey` characters — the committed
// `multiform.assertKeySafe` precedent (replicated here because the committed
// guard is module-private; same chars, same refusal, attributed).
const RESERVED_KEY_CHARS = ['×', '|'];

function assertKeySafe(part: string, what: string): void {
  for (const reserved of RESERVED_KEY_CHARS) {
    if (part.includes(reserved)) {
      throw new Error(
        `snapshot: ${what} "${part}" contains reserved primalMultisetKey char "${reserved}" — it would corrupt the lineage key`,
      );
    }
  }
}

export const SNAPSHOT_VERSION = 1 as const;

export interface PlaygroundSnapshotFile {
  version: typeof SNAPSHOT_VERSION;
  sourceId: string; // opaque provenance — a name, not a doorway
  savedAt: string; // ISO timestamp (the one non-deterministic field)
  shape: Shape; // the form's FULL structure, verbatim (self-contained)
}

export interface LoadedSnapshotForm {
  shape: Shape;
  provenance: { origin: 'loaded'; source: string };
}

// Save: a deep JSON clone of the Shape (proves self-containment — Shape is
// plain data; nothing live survives serialization) + the opaque source name.
export function serializeSnapshot(shape: Shape, sourceId: string): PlaygroundSnapshotFile {
  const source = sourceId.trim();
  if (!source) throw new Error('snapshot: sourceId must be a non-empty name');
  assertKeySafe(source, 'sourceId');
  return {
    version: SNAPSHOT_VERSION,
    sourceId: source,
    savedAt: new Date().toISOString(),
    shape: JSON.parse(JSON.stringify(shape)) as Shape,
  };
}

function isPlainShape(shape: unknown): shape is Shape {
  const s = shape as Shape;
  return Boolean(
    s &&
      typeof s.id === 'string' &&
      typeof s.name === 'string' &&
      s.vertices &&
      typeof s.vertices === 'object' &&
      Array.isArray(s.edges) &&
      Array.isArray(s.faces) &&
      s.genealogy &&
      typeof s.genealogy === 'object',
  );
}

// Load: rebuild SOURCE-NAMESPACED. Every vertex-id occurrence gets the
// committed `<source>:<id>` prefix; the shape id becomes
// `snapshot:<source>:<originalId>` (distinct per source — two universes'
// copies coexist; the same source re-loads idempotently onto one id).
export function deserializeSnapshot(
  file: PlaygroundSnapshotFile,
  loadSource?: string,
): LoadedSnapshotForm {
  if (!file || file.version !== SNAPSHOT_VERSION) {
    throw new Error(
      `snapshot: unsupported snapshot version "${String((file as { version?: unknown })?.version)}" (expected ${SNAPSHOT_VERSION})`,
    );
  }
  if (!isPlainShape(file.shape)) {
    throw new Error('snapshot: the snapshot carries no well-formed Shape — refusing to load');
  }
  const source = (loadSource ?? file.sourceId).trim();
  if (!source) throw new Error('snapshot: load source must be a non-empty name');
  assertKeySafe(source, 'load source');

  const original = JSON.parse(JSON.stringify(file.shape)) as Shape; // never mutate the file
  const ns = (id: VertexId): VertexId => {
    assertKeySafe(id, 'vertex id');
    return `${source}:${id}`;
  };

  const vertices: Record<VertexId, Vertex> = {};
  for (const vertex of Object.values(original.vertices)) {
    const id = ns(vertex.id);
    vertices[id] = {
      ...vertex,
      id,
      createdBy: {
        ...vertex.createdBy,
        // carried lineage survives with its roots PREFIXED — the committed
        // primalMultiset then unions namespaced roots (co-location ≠ identity).
        sourceVertexIds: vertex.createdBy.sourceVertexIds.map(ns),
      },
    };
  }

  const edges: Edge[] = original.edges.map((edge) => ({
    ...edge,
    id: ns(edge.id),
    vertexIds: [ns(edge.vertexIds[0]), ns(edge.vertexIds[1])] as Edge['vertexIds'],
    ...(edge.sourceVertexIds
      ? { sourceVertexIds: edge.sourceVertexIds.map(ns) as Edge['sourceVertexIds'] }
      : {}),
  }));

  const faces: Face[] = original.faces.map((face) => ({
    ...face,
    id: ns(face.id),
    vertexIds: face.vertexIds.map(ns),
  }));

  // P1b + P2: CELLS + GENERATIONS load coherently too (2D playground forms have
  // empty arrays: unaffected). P2 completes the namespacing RULE: every id the
  // loaded shape OWNS (vertex / edge / face / cell / generation ids) and every
  // ref to those ids prefix TOGETHER — ids and refs stay coherent, and two
  // loads of one source under different names are FULLY id-disjoint (the
  // enacted `assemble` fail-louds on any cross-form id collision; loaded
  // universes must actually be distinct universes). Same-source re-loads keep
  // the same prefix — the E1 idempotence is untouched. LINEAGE refs into the
  // SOURCE universe (`sourceEdgeIds`, `sourceEdgeId`, `sourceFaceId`,
  // generation `parentShapeId`, `createdBy.shapeId`) stay VERBATIM — names,
  // not doorways.
  const cells: Cell[] = (original.cells ?? []).map((cell) => ({
    ...cell,
    id: ns(cell.id),
    ...(cell.parentCellId ? { parentCellId: ns(cell.parentCellId) } : {}),
    vertexIds: cell.vertexIds.map(ns),
    faceIds: cell.faceIds.map(ns),
    sourceVertexIds: cell.sourceVertexIds.map(ns),
    ...(cell.preservedVertexId ? { preservedVertexId: ns(cell.preservedVertexId) } : {}),
  }));
  const generations: Generation[] = (original.generations ?? []).map((generation) => ({
    ...generation,
    id: ns(generation.id),
    parentCellIds: generation.parentCellIds.map(ns),
    createdCellIds: generation.createdCellIds.map(ns),
    createdVertexIds: generation.createdVertexIds.map(ns),
  }));

  const shape: Shape = {
    ...original,
    id: `snapshot:${source}:${original.id}`,
    vertices,
    edges,
    faces,
    cells,
    generations,
    genealogy: {
      ...original.genealogy,
      // re-rooted: the parent lives in the SOURCE universe (a name, not a doorway).
      parentShapeId: null,
      sourceVertexIds: original.genealogy.sourceVertexIds.map(ns),
      createdVertexIds: original.genealogy.createdVertexIds.map(ns),
    },
  };

  return { shape, provenance: { origin: 'loaded', source } };
}

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
// GAP2C (sanctioned frozen edit): the save-time predicate consumes the
// COMMITTED direct bridge itself — "is this form direct-readable?" is the
// bridge's own verdict, never a re-expression of its rules here; the load-time
// RECONSTRUCTION runs the committed identify against the carried recipe (the
// id suffix), so the standing replay-recovery byte-compare holds at acquire
// time BY CONSTRUCTION, never by a weakened guard.
import {
  directComplexOf,
  identify,
  parseIdentificationSuffix,
} from '../lib/complexIdentification';

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
  // GAP2C: present EXACTLY when the form's own complex is direct-unreadable
  // at save time (the bridge's verdict) — the ancestor chain, direct parent
  // first, walked to an acquirable root, each Shape verbatim. Absent on every
  // direct-readable save: those files are byte-shaped exactly as before.
  ancestors?: Shape[];
}

export interface LoadedSnapshotForm {
  shape: Shape;
  provenance: { origin: 'loaded'; source: string };
  // GAP2C: the carried chain, namespaced under the SAME load source — acquire
  // metadata for the manuscript's lineage argument, NEVER a population entry.
  ancestors?: Shape[];
}

// Save: a deep JSON clone of the Shape (proves self-containment — Shape is
// plain data; nothing live survives serialization) + the opaque source name.
// GAP2C: `ancestry` (additive, optional — the committed 2-arg calls are
// byte-identical) is the caller's population of candidate ancestors. The
// PREDICATE: if the committed bridge reads the form directly, nothing is
// carried (today's file exactly); if it THROWS (seam/quotient), the parent
// chain is walked through `ancestry` — direct parent first — until a link the
// bridge reads (the acquirable root, inclusive) and STORED verbatim. A
// pointer that leaves the population ends the walk (the carried prefix is
// still honest metadata); a genealogy cycle exhausts finitely.
export function serializeSnapshot(
  shape: Shape,
  sourceId: string,
  ancestry: Shape[] = [],
): PlaygroundSnapshotFile {
  const source = sourceId.trim();
  if (!source) throw new Error('snapshot: sourceId must be a non-empty name');
  assertKeySafe(source, 'sourceId');
  let ancestors: Shape[] | null = null;
  try {
    directComplexOf(shape);
  } catch {
    const byId = new Map(ancestry.map((candidate) => [candidate.id, candidate]));
    const chain: Shape[] = [];
    const seen = new Set<string>([shape.id]);
    let cursor = shape.genealogy.parentShapeId;
    while (cursor && !seen.has(cursor)) {
      const parent = byId.get(cursor);
      if (!parent) break;
      seen.add(parent.id);
      chain.push(parent);
      try {
        directComplexOf(parent);
        break; // the acquirable root — the chain is complete
      } catch {
        cursor = parent.genealogy.parentShapeId;
      }
    }
    if (chain.length > 0) ancestors = chain;
  }
  return {
    version: SNAPSHOT_VERSION,
    sourceId: source,
    savedAt: new Date().toISOString(),
    shape: JSON.parse(JSON.stringify(shape)) as Shape,
    ...(ancestors ? { ancestors: JSON.parse(JSON.stringify(ancestors)) as Shape[] } : {}),
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

  const ns = (id: VertexId): VertexId => {
    assertKeySafe(id, 'vertex id');
    return `${source}:${id}`;
  };

  // GAP2C: the one namespacing rule, applied to the FORM and to each carried
  // ancestor alike — every owned id and every ref prefix TOGETHER (the P2
  // rule, unchanged); the shape id becomes `snapshot:<source>:<originalId>`
  // for the form AND the ancestors, so a preserved parent pointer equals its
  // ancestor's namespaced id exactly (the acquisition chain matches by id).
  const namespaceOne = (original: Shape, parentPointer: string | null): Shape => {
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
      // #37 (B-2026-08-22-A, researcher's sweep predicate: "reads an entity
      // id out of a data-blob field"): the dihedral record's KEYS are carried
      // id-refs — `<entityId>@<level>` composites minted from this shape's
      // own ids — and the spread above left them VERBATIM, so one shelf
      // round-trip made every record key stale (measured: the fan's cone
      // rendered flat off the person's own route). The whole key is
      // prefixed; the `@…` level suffix is STRUCTURAL and rides inside it
      // untouched (conformalAtom's level reads are unaffected). Consumers
      // now resolve these keys by exact `===` — the suffix stopgap dies.
      ...(cell.dihedralAngles
        ? {
            dihedralAngles: Object.fromEntries(
              Object.entries(cell.dihedralAngles).map(([key, angle]) => [ns(key), angle]),
            ),
          }
        : {}),
    }));
    const generations: Generation[] = (original.generations ?? []).map((generation) => ({
      ...generation,
      id: ns(generation.id),
      parentCellIds: generation.parentCellIds.map(ns),
      createdCellIds: generation.createdCellIds.map(ns),
      createdVertexIds: generation.createdVertexIds.map(ns),
    }));

    return {
      ...original,
      id: `snapshot:${source}:${original.id}`,
      vertices,
      edges,
      faces,
      cells,
      generations,
      genealogy: {
        ...original.genealogy,
        // re-rooted OR preserved: null when the parent lives only in the
        // SOURCE universe (a name, not a doorway — the committed behavior);
        // the namespaced pointer when the chain rides THIS file (GAP2C).
        parentShapeId: parentPointer,
        sourceVertexIds: original.genealogy.sourceVertexIds.map(ns),
        createdVertexIds: original.genealogy.createdVertexIds.map(ns),
      },
    };
  };

  const original = JSON.parse(JSON.stringify(file.shape)) as Shape; // never mutate the file
  const carried = (file.ancestors ?? []).map(
    (ancestor) => JSON.parse(JSON.stringify(ancestor)) as Shape,
  );

  // GAP2C RECONSTRUCTION (the mandate's own word): the chain is carried
  // direct-parent-first, root-last; the acquirable ROOT loads as a plain
  // namespaced copy, and each link ABOVE it that carries the committed
  // identification recipe (its id suffix) is REBUILT by running the SAME
  // identify against the link below — its ids are then replay-native, so the
  // standing replay-recovery (byte-compare and all) succeeds at acquire time
  // by construction. A link whose recipe is unparsable, whose replay refuses,
  // or whose parent link could not itself be rebuilt in a mappable id space
  // falls back to its namespaced copy — downstream acquisition then ends at
  // its honest null (the guard is never weakened, the load never lies).
  const reconstructed: Shape[] = new Array(carried.length);
  // plainNs[k] — link k's ids are the PLAIN `ns()` image of the file's ids
  // (true for namespaced copies; false for replay-rebuilt links, whose minted
  // ids compose differently) — the recipe of the link ABOVE maps by ns() only
  // against a plain-ns parent.
  const plainNs: boolean[] = new Array(carried.length);
  for (let k = carried.length - 1; k >= 0; k -= 1) {
    const link = carried[k];
    const below = k + 1 < carried.length ? carried[k + 1] : null;
    const spec = parseIdentificationSuffix(link.id);
    const parentMatches = below !== null && link.genealogy.parentShapeId === below.id;
    if (spec && parentMatches && plainNs[k + 1] === true) {
      try {
        const replay = identify(
          reconstructed[k + 1],
          spec.cycleA.map(ns),
          spec.cycleB.map(ns),
          spec.modes,
          null,
        );
        reconstructed[k] = replay.shape;
        plainNs[k] = false;
        continue;
      } catch {
        // the replay refused — fall through to the namespaced copy
      }
    }
    reconstructed[k] = namespaceOne(
      link,
      below && link.genealogy.parentShapeId === below.id ? reconstructed[k + 1].id : null,
    );
    plainNs[k] = true;
  }

  // the form's pointer is PRESERVED exactly when its parent rides this file's
  // chain — it points at the RECONSTRUCTED parent (whatever id space that
  // link resolved into); with no carried chain, the committed null re-root.
  const parentPointer =
    carried.length > 0 && original.genealogy.parentShapeId === carried[0].id
      ? reconstructed[0].id
      : null;
  const shape = namespaceOne(original, parentPointer);

  return {
    shape,
    provenance: { origin: 'loaded', source },
    ...(reconstructed.length > 0 ? { ancestors: reconstructed } : {}),
  };
}

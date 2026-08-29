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

import type {
  Cell,
  ComposedRelationStamp,
  Edge,
  Face,
  Generation,
  PacketData,
  Shape,
  Vertex,
  VertexId,
} from '../types/geometry';
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
// R-2's SIBLING (B-110 / A1, sanctioned): the WORD machinery, for replaying a
// word-born form's own recipe at load. All three modules are already FROZEN
// and already inside the manifest's import closure — importing them adds no
// file, edits none, and creates no cycle (none imports snapshot).
import { collapseFace, flipGlueFace, glueFace } from '../lib/surfaceOperations';
import { materializeSurfaceResult } from '../lib/materializeOperation';
import { parsePairingSuffix } from './bornFormRouting';

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
  // ═══ B-131/S2 — THE SPLIT (the twice-measured law, its second site): A
  // SLOT SERVING BOTH AN ADDRESS PURPOSE AND A DESIGNATION PURPOSE MUST BE
  // SPLIT, NEVER RENAMED — renaming picks one victim; splitting is the cure.
  // `sourceId` is the ADDRESS (the shelf's grouping key, the provenance —
  // byte-identical forever); this slot is the DESIGNATION a person reads
  // (the source universe's own name), present exactly when the writer holds
  // one. Old files: absent — a true absence, never fabricated. Additive,
  // optional — every committed 3-arg call is byte-identical (the GAP2C
  // precedent verbatim).
  sourceName?: string;
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
  // sourceName — the S2 split's designation half, carried through the load
  // exactly when the file holds it (see PlaygroundSnapshotFile.sourceName)
  provenance: { origin: 'loaded'; source: string; sourceName?: string };
  // GAP2C: the carried chain, namespaced under the SAME load source — acquire
  // metadata for the manuscript's lineage argument, NEVER a population entry.
  ancestors?: Shape[];
}

// Save: a deep JSON clone of the Shape (proves self-containment — Shape is
// plain data; nothing live survives serialization) + the opaque source name.
// GAP2C: `ancestry` (additive, optional — the committed 2-arg calls are
// byte-identical) is the caller's population of candidate ancestors. The
// PREDICATE (widened, B-2026-08-22-C 2(b), sanctioned frozen edit): a caller
// that HANDS an ancestry is DECLARING the operands of the making — the
// mothership's ruling: the operands are not context the product refers to,
// they are what the product IS, and carrying them is the record being WHOLE
// — so the chain-walk runs whenever ancestry is offered, acquirable product
// or not (the fan band: directComplexOf reads it fine, and its base must
// still ride so the sealed metric has its OPERAND on the far side of the
// hop). With NO ancestry offered the old predicate stands verbatim: if the
// committed bridge reads the form directly nothing is carried; if it THROWS
// (seam/quotient) the walk would find nothing in an empty population anyway.
// The walk itself is unchanged: direct parent first, until a link the bridge
// reads (the acquirable root, inclusive), STORED verbatim. A pointer that
// leaves the population ends the walk (the carried prefix is still honest
// metadata); a genealogy cycle exhausts finitely.
export function serializeSnapshot(
  shape: Shape,
  sourceId: string,
  ancestry: Shape[] = [],
  // the S2 split's designation half — optional and additive; committed
  // 2-/3-arg callers are byte-identical and their files byte-shaped as before
  sourceName?: string,
): PlaygroundSnapshotFile {
  const source = sourceId.trim();
  if (!source) throw new Error('snapshot: sourceId must be a non-empty name');
  assertKeySafe(source, 'sourceId');
  const designation = typeof sourceName === 'string' && sourceName.trim() !== '' ? sourceName.trim() : null;
  let ancestors: Shape[] | null = null;
  let walkChain = ancestry.length > 0;
  if (!walkChain) {
    try {
      directComplexOf(shape);
    } catch {
      walkChain = true;
    }
  }
  if (walkChain) {
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
    ...(designation ? { sourceName: designation } : {}),
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
  // the S2 split, read side: the designation rides beside the address when
  // the file holds one — it names the ORIGIN universe, so a loadSource
  // override does not displace it; absent on old files (a true absence)
  const carriedSourceName =
    typeof file.sourceName === 'string' && file.sourceName.trim() !== '' ? file.sourceName.trim() : null;
  const provenance: LoadedSnapshotForm['provenance'] = {
    origin: 'loaded',
    source,
    ...(carriedSourceName ? { sourceName: carriedSourceName } : {}),
  };

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

    // #37 GAP 1 (B-2026-08-22-B, sanctioned): the MANIFOLD RECORD is a NAMED
    // field this loader re-roots — `parts`/`sourceVertexIds` are DOORWAYS to
    // ids this shape owns and prefix with everything else; the record `id`
    // and each `sharedBy` entry NAME a dropped source-universe entity (a
    // name, not a doorway — VERBATIM, so nothing nests on a re-load). A
    // pre-promotion file's `data.composes`/`data.sharedBy` blobs are LIFTED
    // here into the named fields (same re-rooting, blob keys stripped — ONE
    // home after every load); a malformed blob is left where it lay,
    // untouched and uninterpreted.
    const promoteManifoldRecord = (
      entity: Pick<Edge, 'composes' | 'sharedBy' | 'data'>,
    ): { composes?: ComposedRelationStamp; sharedBy?: string[]; data?: PacketData } => {
      const blobC = entity.data?.['composes'] as
        | { kind?: unknown; id?: unknown; parts?: unknown; sourceVertexIds?: unknown }
        | undefined;
      const blobS = entity.data?.['sharedBy'];
      const rawC = entity.composes ?? blobC;
      const rawS = entity.sharedBy ?? blobS;
      const wellC =
        rawC !== undefined &&
        (rawC.kind === 'edge' || rawC.kind === 'face') &&
        typeof rawC.id === 'string' &&
        Array.isArray(rawC.parts) &&
        rawC.parts.every((p): p is string => typeof p === 'string');
      const wellS = Array.isArray(rawS) && rawS.every((s): s is string => typeof s === 'string');
      const migratedC = !entity.composes && wellC;
      const migratedS = !entity.sharedBy && wellS;
      let data = entity.data;
      if (data && (migratedC || migratedS)) {
        const stripped: PacketData = { ...data };
        if (migratedC) delete stripped['composes'];
        if (migratedS) delete stripped['sharedBy'];
        data = Object.keys(stripped).length > 0 ? stripped : undefined;
      }
      return {
        ...(wellC
          ? {
              composes: {
                kind: rawC.kind as 'edge' | 'face',
                id: rawC.id as string,
                parts: (rawC.parts as string[]).map(ns),
                sourceVertexIds: (Array.isArray(rawC.sourceVertexIds)
                  ? (rawC.sourceVertexIds as unknown[]).filter(
                      (v): v is string => typeof v === 'string',
                    )
                  : []
                ).map(ns),
              },
            }
          : {}),
        ...(wellS ? { sharedBy: [...(rawS as string[])] } : {}),
        // present only when a migration changed it — stripped-to-empty
        // becomes an explicit undefined the JSON serializer drops
        ...(data !== entity.data ? { data } : {}),
      };
    };

    const edges: Edge[] = original.edges.map((edge) => ({
      ...edge,
      id: ns(edge.id),
      vertexIds: [ns(edge.vertexIds[0]), ns(edge.vertexIds[1])] as Edge['vertexIds'],
      ...(edge.sourceVertexIds
        ? { sourceVertexIds: edge.sourceVertexIds.map(ns) as Edge['sourceVertexIds'] }
        : {}),
      ...promoteManifoldRecord(edge),
    }));

    const faces: Face[] = original.faces.map((face) => ({
      ...face,
      id: ns(face.id),
      vertexIds: face.vertexIds.map(ns),
      ...promoteManifoldRecord(face),
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

  // R-2 THE UNION (B-106 B3, sanctioned): the form's OWN idn link replays by
  // the SAME law the loop above applies to chain-internal links — before this
  // edit only the ancestors replayed, so every snapshot-loaded identified
  // form ns-copied with its recipe's ORIGINAL cycle spellings and nulled the
  // committed acquisition (bridged downstream since ab077ef; the bridge
  // retires with this landing). A replayed form is replay-native: the
  // standing replay-recovery (byte-compare unweakened) succeeds at acquire
  // time by construction. Same fallback law as the loop: no recipe, a parent
  // off the chain head, a non-plain-ns parent, or a refusing replay falls
  // back to the namespaced copy — downstream acquisition then ends at its
  // honest null; the load never lies.
  const ownSpec = parseIdentificationSuffix(original.id);
  if (
    ownSpec &&
    carried.length > 0 &&
    original.genealogy.parentShapeId === carried[0].id &&
    plainNs[0] === true
  ) {
    try {
      const replay = identify(
        reconstructed[0],
        ownSpec.cycleA.map(ns),
        ownSpec.cycleB.map(ns),
        ownSpec.modes,
        null,
      );
      return {
        shape: replay.shape,
        provenance,
        ancestors: reconstructed,
      };
    } catch {
      // the replay refused — the namespaced copy below stands
    }
  }

  // R-2's SIBLING — THE WORD UNION (B-110 / marker A1, Arman-sanctioned:
  // "pay the price"; confirmed in-terminal at this seat before the spend).
  // The same disease one recipe over: a WORD-born single-face form
  // (glue / flip-glue / collapse) ns-copies on load, and the committed
  // word recovery's byte-compare can never pass on it — the copy's ids are
  // `<source>:`-prefixed while a replay mints from the ns'd parent's shape
  // id — so `recoverBornSurface` nulls and the whole acquisition chain
  // nulls with it. MEASURED cost before the cure: the card's TYPE is lost
  // (classifyForm reads "genus 1" natively and REFUSES on the loaded copy),
  // combine refuses, identify refuses — a form the person saves comes back
  // a stranger, and persistence is load-bearing since Δ10's doors.
  // ⇒ Replay the form's OWN WORD at load and return the replay, exactly as
  // the idn arm above does. ★ The word's pairings are SLOT INDICES, not ids
  // (`parsePairingSuffix` reads them off the born id), so unlike the idn
  // recipe they need no namespacing at all — the parent face is found by
  // the ns'd face id the copy and its parent already share.
  // The fallback law is unchanged and total: not a word birth, a parent off
  // the chain head, a non-plain-ns parent, an unparsable word, a missing
  // parent face, or a refusing replay all fall through to the namespaced
  // copy — downstream acquisition then ends at its honest null. The load
  // never lies, and no committed refusal is weakened.
  const ownOperation = original.genealogy.operation;
  if (
    (ownOperation === 'glue' || ownOperation === 'flip-glue' || ownOperation === 'collapse') &&
    original.faces.length === 1 &&
    carried.length > 0 &&
    original.genealogy.parentShapeId === carried[0].id &&
    plainNs[0] === true
  ) {
    try {
      const parentShape = reconstructed[0];
      // the born form's single face carries its PARENT face's id — the
      // committed recovery's own premise, now read in the ns'd space
      const parentFace = parentShape.faces.find((face) => face.id === ns(original.faces[0].id));
      if (parentFace) {
        const wordPairings = parsePairingSuffix(original.id);
        if (ownOperation === 'collapse') {
          const trace = collapseFace(parentShape, parentFace);
          const replay = materializeSurfaceResult(parentShape, parentFace, trace);
          return { shape: replay.shape, provenance, ancestors: reconstructed };
        }
        if (wordPairings) {
          const op = ownOperation === 'flip-glue' ? flipGlueFace : glueFace;
          const trace = op(parentShape, parentFace, wordPairings);
          const replay = materializeSurfaceResult(parentShape, parentFace, trace, wordPairings);
          return { shape: replay.shape, provenance, ancestors: reconstructed };
        }
      }
    } catch {
      // the replay refused — the namespaced copy below stands
    }
  }
  const shape = namespaceOne(original, parentPointer);

  return {
    shape,
    provenance,
    ...(reconstructed.length > 0 ? { ancestors: reconstructed } : {}),
  };
}

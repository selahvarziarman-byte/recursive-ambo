// openLift — DOOR 3 (2026-08-13, sovereign-ruled): THE OPEN-STAR EXTRACTOR —
// patchLift's lineage-carriage MINUS its closure (SEAL_OPEN_STAR_EXTRACTOR;
// researcher 1837 lineage contract).
//
// THE OBJECT: the open star of a skin vertex X_K — the triangle fan of terrain
// faces incident to X_K — lifted into a BOUNDED base Shape for `thicken`. The
// rim (the link cycle) stays a FREE boundary: unpaired, unmerged, unclosed.
// Where `patchLift` closes the disk with the antipodal boundary pairing ("no
// free boundary left"), this module performs NO identification at all — the
// rim stays a rim.
//
// THE WALLS (researcher 1837 §4):
//   WALL 1 — shape-side, registry-CONSUMING; NOT a registry role-extension.
//   The X_K identification is the committed registry's own site enumeration
//   (the scoped-midpoint law) and the disk gate is the committed
//   `decomposeLink`. The star's FACES are read cell-scoped (the committed
//   `getCellFaces` over the person's selected cell) because the registry's
//   reading layer keys on the ambo constructor's face role
//   (incidenceTraceRegistry.ts:664 `'dissection-core-face'`) and predates the
//   pyritohedral skin — measured: on a diagonalized shape every site's
//   readings are empty. The seam holds: the registry READS incidence; this
//   module only CONSTRUCTS the Shape. (The premise delta is disclosed in the
//   arc handback; the link adjacency below is the committed corner-arc idiom —
//   cutOperation.ts:43 / buildVertexLinkAdjacency semantics — instantiated
//   over the star faces, then gated by the registry's own `decomposeLink`.)
//   WALL 2 — the closure is REMOVED: patchLift.ts:196-317 (the antipodal
//   pairing + the edge-class union-find) has no counterpart here. Nothing is
//   minted, merged, or paired.
//   WALL 3 — angles via the face-spread: `{ ...face }` carries `cornerAngles`
//   VERBATIM (patchLift.ts:265 precedent). ⛔ NO re-derivation — this module
//   never calls `regularCornerAngle`/`acos`; the terrain already owns its
//   atoms (ambo.ts:523 / pyritohedralDiagonalization.ts:377 stamps).
//   WALL 4 — genealogy: a real single-parent edge (`parentShapeId =
//   source.id`, `generationDepth = source.depth + 1`), operation `'open-lift'`
//   (the sovereign-ruled non-glue lift word: NON_CONSUMING, NOT a GLUE_KIND),
//   NON-consuming — the terrain stays byte-unchanged. No minted children.
//
// THE CARRIAGE (the lift law — carry what the substrate holds, mark what it
// doesn't, fabricate/erase neither): vertices carried VERBATIM by reference
// (`createdBy.sourceVertexIds` retained — ⛔ never a `loadForm` round-trip,
// which seed-stamps and erases the primalMultiset); faces carried VERBATIM
// via the spread; edges carried from the source's own Edge records
// (`sourceVertexIds` = the endpoints); the rim marked free by CONSTRUCTION
// (a bounded Shape with no pairings anywhere).
//
// DERIVE-ONLY · ADDITIVE: committed modules by import only
// (`buildIncidenceTraceRegistry` / `decomposeLink`, `getCellFaces`,
// `canonicalEdgeKey`). `patchLift.ts` is byte-unchanged by this build.

import type { Edge, Face, OperationKind, Shape, Vertex, VertexId } from '../types/geometry';
import { canonicalEdgeKey } from './ids';
import { getCellFaces } from './shape';
import { buildIncidenceTraceRegistry, decomposeLink } from './incidenceTraceRegistry';

const OPEN_LIFT_OPERATION: OperationKind = 'open-lift';

export interface OpenLift {
  shape: Shape; // the bounded base — the rim is FREE (no pairing exists anywhere on it)
  center: VertexId; // the X_K midpoint the star was read at
  rimVertexIds: VertexId[]; // the link vertices (the free rim), sorted — a census, not a fabricated order
  fanFaceIds: string[]; // the carried terrain face ids, in the cell's own face order
}

// Lift the open star of `centerId` (an X_K midpoint of `source`) read off the
// faces of `targetCellId`, into a bounded base Shape. Throws (no lift) on any
// precondition failure — the X_K site check, the cell, the v0 triangle-fan
// scope, or the disk gate. The rim is left a free boundary — NO closure.
export function openLift(source: Shape, centerId: VertexId, targetCellId: string): OpenLift {
  // (1) X_K IDENTIFICATION — the committed registry's site enumeration. The
  // site exists for every ambo-dissection midpoint regardless of which
  // constructor later re-skinned the cell (the enumeration is vertex-keyed).
  const site = buildIncidenceTraceRegistry(source).sites.find((s) => s.scopedVertexId === centerId);
  if (!site) {
    throw new Error(`openLift: "${centerId}" is not an X_K midpoint site of the source — no lift`);
  }

  // (2) THE STAR, cell-scoped: the target cell's faces incident to the centre.
  // The cell scope is explicit because a generated shape superposes its
  // generations (parent-cell copies, residue faces) — the person's selected
  // cell names WHICH skin the star is read from.
  const cell = source.cells.find((c) => c.id === targetCellId);
  if (!cell) {
    throw new Error(`openLift: target cell "${targetCellId}" not found on the source shape — no lift`);
  }
  const starFaces = getCellFaces(source, cell).filter((face) => face.vertexIds.includes(centerId));
  if (starFaces.length === 0) {
    throw new Error(
      `openLift: cell "${targetCellId}" carries no face incident to "${centerId}" — no star to lift`,
    );
  }

  // (3) v0 scope — a TRIANGLE fan only (patchLift's own v0 law, :185-194):
  // every star face a 3-gon of distinct vertices containing the centre once.
  for (const face of starFaces) {
    const centerUses = face.vertexIds.filter((v) => v === centerId).length;
    if (face.vertexIds.length !== 3 || new Set(face.vertexIds).size !== 3 || centerUses !== 1) {
      throw new Error(
        `openLift: v0 supports triangle fans only — star face "${face.id}" is a ` +
          `${face.vertexIds.length}-gon with ${centerUses} centre use(s); no lift`,
      );
    }
  }

  // (4) THE DISK GATE — the committed corner-arc link idiom (cutOperation.ts:43;
  // buildVertexLinkAdjacency:605 semantics: each incident face contributes ONE
  // undirected arc joining the centre's two cyclic neighbours), decomposed by
  // the registry's own `decomposeLink`. 'interior' (a single closed cycle) ⟺
  // the open star is a disk; anything else is refused loudly.
  const adjacency = new Map<string, string[]>();
  const addHalfEdge = (from: string, to: string): void => {
    const list = adjacency.get(from);
    if (list) {
      list.push(to);
    } else {
      adjacency.set(from, [to]);
    }
  };
  for (const face of starFaces) {
    const cycle = face.vertexIds;
    const index = cycle.indexOf(centerId);
    const prev = cycle[(index - 1 + cycle.length) % cycle.length];
    const next = cycle[(index + 1) % cycle.length];
    addHalfEdge(prev, next);
    addHalfEdge(next, prev);
  }
  const gate = decomposeLink(adjacency);
  if (gate.valence !== 'interior') {
    throw new Error(
      `openLift: the star of "${centerId}" on cell "${targetCellId}" is not a disk — link valence '${gate.valence}' (required 'interior'); no lift`,
    );
  }
  const rimVertexIds = [...adjacency.keys()].sort((a, b) => a.localeCompare(b));

  // (5) THE CARRIAGE — verbatim, closure-FREE. Vertices by reference (createdBy
  // retained), faces via the spread (cornerAngles ride), edges from the
  // source's own records. Nothing minted, nothing merged, nothing paired.
  const liftShapeId = `shape:open-lift:${source.id}:${centerId}`;
  const patchVertexIds: VertexId[] = [centerId, ...rimVertexIds];
  const vertices: Record<VertexId, Vertex> = {};
  for (const id of patchVertexIds) {
    const vertex = source.vertices[id];
    if (!vertex) {
      throw new Error(`openLift: star vertex "${id}" not found on the source shape — no lift`);
    }
    vertices[id] = vertex;
  }

  const faces: Face[] = starFaces.map((face) => ({ ...face }));

  const sourceEdgeByKey = new Map<string, Edge>();
  for (const edge of source.edges) {
    sourceEdgeByKey.set(canonicalEdgeKey(edge.vertexIds[0], edge.vertexIds[1]), edge);
  }
  const edges: Edge[] = [];
  const seenKeys = new Set<string>();
  for (const face of starFaces) {
    const vs = face.vertexIds;
    for (let i = 0; i < vs.length; i += 1) {
      const key = canonicalEdgeKey(vs[i], vs[(i + 1) % vs.length]);
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);
      const carried = sourceEdgeByKey.get(key);
      if (!carried) {
        throw new Error(`openLift: star edge "${key}" not found on the source shape's edges — no lift`);
      }
      edges.push({
        ...carried,
        sourceVertexIds: [carried.vertexIds[0], carried.vertexIds[1]] as [VertexId, VertexId],
      });
    }
  }

  // (6) WALL 4 — the genealogy: single-parent, NON-consuming, 'open-lift'.
  const shape: Shape = {
    id: liftShapeId,
    name: `open-lift(${source.name})`,
    vertices,
    edges,
    faces,
    cells: [],
    generations: [],
    genealogy: {
      parentShapeId: source.id,
      operation: OPEN_LIFT_OPERATION,
      generationDepth: source.genealogy.generationDepth + 1,
      sourceVertexIds: [...patchVertexIds],
      createdVertexIds: [], // nothing minted — the carriage is verbatim
      createdAt: '',
    },
  };

  return {
    shape,
    center: centerId,
    rimVertexIds,
    fanFaceIds: starFaces.map((face) => face.id),
  };
}

// subComplexLift — P1b: the granular ambo→manuscript save (ADR 0010 at the
// grain of a single entity).
//
// Lift a SUB-COMPLEX out of an ambo universe as a SELF-CONTAINED Shape:
//   · downwardClosure — the selected entities plus everything below them
//     (cell → its faces → their boundary edges → their vertices);
//   · validateLiftSelection — the charter's precondition, CONNECTED +
//     DOWNWARD-CLOSED, refused with an honest reason. Manifold-soundness is
//     deliberately NOT a gate (a junction-carrying region lifts anyway — the
//     committed link classifiers REPORT downstream; instruments, not guards).
//   · extractSubShape — the restriction of the source Shape to the closure,
//     with the Q4 re-root contract:
//       - STRUCTURE (vertices / edges / faces / cells / generations) is
//         restricted to the closure; the closure guarantees every structural
//         ref resolves internally.
//       - LINEAGE is retained VERBATIM (createdBy.sourceVertexIds,
//         edge/cell source ids) — internal refs stay resolvable; EXTERNAL refs
//         (targets left behind in the ambo) become SOURCE-TAGGED PRIMALS by
//         the COMMITTED machinery itself: `deserializeSnapshot` prefixes every
//         vertex-id occurrence `<source>:` and `lineage.primalMultiset` keys
//         each absent source as its own primal root (multiform's stated
//         extension point, reused not forked). Nothing here re-invents lineage.
//       - the ONE structural re-root done here: a lifted cell whose
//         `parentCellId` was not lifted gets `parentCellId: null` (the parent
//         lives in the source universe — a name, not a doorway), mirroring the
//         snapshot loader's own `parentShapeId: null` re-root.
//   · genealogy mirrors the committed patch-lift convention (patchLift.ts —
//     "Route-B patch-lift RATIFIED; NON-CONSUMING"): a real parent edge to the
//     source shape (`operation: 'patch-lift'`, depth + 1, sourceVertexIds =
//     the read sites); the snapshot loader re-roots `parentShapeId` to null on
//     the manuscript side, exactly as it does for every loaded universe.
//
// The ambo original is NEVER mutated — every output is freshly built.
//
// FLOOR (this pass): atomic downward-closed entities (cell / face / edge /
// vertex). The API takes selection ARRAYS and the validator checks arbitrary
// sets, so composed multi-element regions (the flagged follow-on) ride the
// same functions once a multi-select UI exists.
//
// ADDITIVE · DERIVE-ONLY: types + plain restriction; no engine import, no
// invariant recomputed.

import type {
  Cell,
  Edge,
  Face,
  Generation,
  Shape,
  VertexId,
} from '../types/geometry';
// P5 — Part B reads the committed apex-trace (the registry is the ONE source
// of the (M, C) relation; consumed by import, never re-derived)
import { buildIncidenceTraceRegistry } from './incidenceTraceRegistry';

export type LiftEntityKind = 'cell' | 'face' | 'edge' | 'vertex';

export interface LiftSelection {
  kind: LiftEntityKind;
  id: string;
}

// the sub-complex as explicit member sets (all four dimensions)
export interface SubComplex {
  cellIds: string[];
  faceIds: string[];
  edgeIds: string[];
  vertexIds: VertexId[];
  // THE GRAIN LAW (SEAL_THE_LIFT_IDENTITY_AND_GRAIN, completed by SLICE2):
  // CARRY what the substrate holds · MARK what it doesn't. The closure pulls
  // the finer cells geometrically ON a lifted coarse entity — collinear on an
  // edge (the A-AC-C grain + its half-edges) AND within a face's own planar
  // region (the mid-face, its chords, interior vertices). A mark remains
  // ONLY for what is genuinely un-carriable (an unconnected stray) — never a
  // silently bare lift. Marks are stamped on the lifted copies' own
  // `data.grainMark` by extractSubShape (a serializing carrier — measured
  // through the committed snapshot round-trip).
  grainMarks?: Array<{ kind: 'edge' | 'face'; id: string; mark: string }>;
  // THE MANIFOLD (SEAL_PHASE_B_MANIFOLD, researcher-ruled COARSE-AS-RELATION):
  // the finer subdivision is the LIVE boundary; a coarse entity whose region
  // the finer cells exactly compose is DROPPED from the live sets and
  // RECORDED here — `composed-of` (a coarse side = the union of its halves;
  // a coarse face = its finer tiling) or `shared-by` (a twin wall record —
  // one live copy kept). Nothing is erased: the relation IS the record, and
  // extractSubShape stamps it onto the live copies' own NAMED fields
  // (`composes` / `sharedBy` — #37 GAP 1, loader-re-rooted) so the card
  // (Phase C) reads it off the shape by exact `===`.
  composedRelations?: Array<{
    kind: 'edge' | 'face';
    id: string;
    relation: 'composed-of' | 'shared-by';
    parts: string[]; // composed-of: the finer ids (edges: the path in order) · shared-by: [the kept live id]
    sourceVertexIds: VertexId[];
  }>;
}

export interface LiftedSubShape {
  shape: Shape;
  title: string;
  closure: SubComplex;
}

const unorderedKey = (a: VertexId, b: VertexId): string => (a < b ? `${a}\0${b}` : `${b}\0${a}`);

// every shape edge matching an unordered endpoint pair (parallel edges all match)
function edgesByEndpoints(shape: Shape): Map<string, Edge[]> {
  const map = new Map<string, Edge[]>();
  for (const edge of shape.edges) {
    const key = unorderedKey(edge.vertexIds[0], edge.vertexIds[1]);
    const list = map.get(key);
    if (list) list.push(edge);
    else map.set(key, [edge]);
  }
  return map;
}

function faceSidePairs(face: Face): Array<[VertexId, VertexId]> {
  const vs = face.vertexIds;
  return vs.map((v, i) => [v, vs[(i + 1) % vs.length]] as [VertexId, VertexId]);
}

// ---------------------------------------------------------------------------
// the downward closure of a selection set
// ---------------------------------------------------------------------------
export function downwardClosure(shape: Shape, selections: LiftSelection[]): SubComplex {
  if (selections.length === 0) {
    throw new Error('subComplexLift: nothing selected — pick an entity to lift');
  }
  const byEndpoints = edgesByEndpoints(shape);
  const cellIds = new Set<string>();
  const faceIds = new Set<string>();
  const edgeIds = new Set<string>();
  const vertexIds = new Set<VertexId>();

  const addVertex = (id: VertexId): void => {
    if (!shape.vertices[id]) {
      throw new Error(`subComplexLift: vertex "${id}" is not in the source shape`);
    }
    vertexIds.add(id);
  };
  const addEdge = (edge: Edge): void => {
    edgeIds.add(edge.id);
    addVertex(edge.vertexIds[0]);
    addVertex(edge.vertexIds[1]);
  };
  const addFace = (face: Face): void => {
    faceIds.add(face.id);
    for (const v of face.vertexIds) addVertex(v);
    for (const [a, b] of faceSidePairs(face)) {
      for (const edge of byEndpoints.get(unorderedKey(a, b)) ?? []) addEdge(edge);
    }
  };
  const addCell = (cell: Cell): void => {
    cellIds.add(cell.id);
    for (const v of cell.vertexIds) addVertex(v);
    for (const faceId of cell.faceIds) {
      const face = shape.faces.find((f) => f.id === faceId);
      if (!face) {
        throw new Error(`subComplexLift: cell "${cell.id}" names face "${faceId}" which is not in the source shape`);
      }
      addFace(face);
    }
  };

  for (const selection of selections) {
    if (selection.kind === 'cell') {
      const cell = shape.cells.find((c) => c.id === selection.id);
      if (!cell) throw new Error(`subComplexLift: cell "${selection.id}" is not in the source shape`);
      addCell(cell);
    } else if (selection.kind === 'face') {
      const face = shape.faces.find((f) => f.id === selection.id);
      if (!face) throw new Error(`subComplexLift: face "${selection.id}" is not in the source shape`);
      addFace(face);
    } else if (selection.kind === 'edge') {
      const edge = shape.edges.find((e) => e.id === selection.id);
      if (!edge) throw new Error(`subComplexLift: edge "${selection.id}" is not in the source shape`);
      addEdge(edge);
    } else {
      addVertex(selection.id);
    }
  }

  // ---- THE GRAIN PASS (SEAL_THE_LIFT_IDENTITY_AND_GRAIN + SLICE2) ---------
  // Positions are legal at the lift SOURCE (the P5 doctrine below): the finer
  // cells geometrically ON a lifted coarse entity — collinear on an edge,
  // within a face's own planar region (the T-junction is REAL and stays real;
  // ambo.ts untouched) — are PULLED with their packets. ONE fixpoint queue:
  // edges drain first (side grain lands before a face's interior is judged),
  // a face's interior pull re-feeds the edge queue (a pulled chord is itself
  // swept for deeper collinear grain). Only what is genuinely un-carriable
  // (an off-span / unconnected stray) keeps the honest MARK — never silent.
  const grainMarks: Array<{ kind: 'edge' | 'face'; id: string; mark: string }> = [];
  const positionOf = (id: VertexId): [number, number, number] | undefined => shape.vertices[id]?.position;
  const dist = (p: readonly number[], q: readonly number[]): number =>
    Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);

  // the planar region of a face — Newell plane + boundary-tolerant 2D
  // containment (shared by the face grain sweep and the manifold pass);
  // `area` = |Newell normal| / 2 (the exact polygon area)
  const planarRegionOf = (
    face: Face,
  ): { inRegion: (p: readonly number[]) => boolean; area: number } | null => {
    if (face.vertexIds.length < 3) return null;
    const corners = face.vertexIds.map((id) => positionOf(id));
    if (corners.some((c) => !c)) return null; // malformed — no claim, nothing fabricated
    const pts = corners as Array<[number, number, number]>;
    let nx = 0;
    let ny = 0;
    let nz = 0;
    for (let i = 0; i < pts.length; i += 1) {
      const p = pts[i];
      const q = pts[(i + 1) % pts.length];
      nx += (p[1] - q[1]) * (p[2] + q[2]);
      ny += (p[2] - q[2]) * (p[0] + q[0]);
      nz += (p[0] - q[0]) * (p[1] + q[1]);
    }
    const nLen = Math.hypot(nx, ny, nz);
    if (nLen < 1e-12) return null;
    const n = [nx / nLen, ny / nLen, nz / nLen] as const;
    const p0 = pts[0];
    const scale = Math.max(...pts.map((p) => dist(p0, p)), 1e-12);
    const eps = 1e-7 * scale + 1e-12;
    const dominant = Math.abs(n[0]) >= Math.abs(n[1]) && Math.abs(n[0]) >= Math.abs(n[2]) ? 0 : Math.abs(n[1]) >= Math.abs(n[2]) ? 1 : 2;
    const project = (p: readonly number[]): [number, number] =>
      dominant === 0 ? [p[1], p[2]] : dominant === 1 ? [p[0], p[2]] : [p[0], p[1]];
    const poly = pts.map(project);
    const nearSegment2 = (pt: [number, number], u: [number, number], v: [number, number]): boolean => {
      const dx = v[0] - u[0];
      const dy = v[1] - u[1];
      const len2 = dx * dx + dy * dy;
      const t = len2 < 1e-24 ? 0 : Math.max(0, Math.min(1, ((pt[0] - u[0]) * dx + (pt[1] - u[1]) * dy) / len2));
      return Math.hypot(pt[0] - (u[0] + t * dx), pt[1] - (u[1] + t * dy)) < eps;
    };
    const inRegion = (p: readonly number[]): boolean => {
      const off = (p[0] - p0[0]) * n[0] + (p[1] - p0[1]) * n[1] + (p[2] - p0[2]) * n[2];
      if (Math.abs(off) >= eps) return false;
      const pt = project(p);
      for (let i = 0; i < poly.length; i += 1) {
        if (nearSegment2(pt, poly[i], poly[(i + 1) % poly.length])) return true; // on the boundary
      }
      let inside = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
        const [xi, yi] = poly[i];
        const [xj, yj] = poly[j];
        if (yi > pt[1] !== yj > pt[1] && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    };
    return { inRegion, area: nLen / 2 };
  };

  const edgeStrayChecks: Array<{ edgeId: string; strayIds: VertexId[] }> = [];
  const faceStrayChecks: Array<{ faceId: string; vertexIds: VertexId[]; edgeIds: string[]; faceIds: string[] }> = [];
  const sweptEdgeIds = new Set<string>();
  const sweptFaceIds = new Set<string>();
  const edgeQueue: string[] = [...edgeIds];
  const faceQueue: string[] = [...faceIds];

  // EDGE grain-CARRY (slice 1): the finer cells collinear ON the coarse span,
  // pulled where CONNECTED to the span through finer edges (a disconnected
  // pull would break the lift's own connectivity gate)
  const sweepEdge = (edgeId: string): void => {
    if (sweptEdgeIds.has(edgeId)) return;
    sweptEdgeIds.add(edgeId);
    const edge = shape.edges.find((e) => e.id === edgeId);
    if (!edge) return;
    const a = positionOf(edge.vertexIds[0]);
    const b = positionOf(edge.vertexIds[1]);
    if (!a || !b) return;
    const span = dist(a, b);
    if (span < 1e-12) return;
    const eps = 1e-7 * span + 1e-12;
    const onSegment = (p: readonly number[]): boolean => Math.abs(dist(a, p) + dist(p, b) - span) < eps;
    const candidates = Object.keys(shape.vertices).filter(
      (id) =>
        id !== edge.vertexIds[0] &&
        id !== edge.vertexIds[1] &&
        onSegment(shape.vertices[id].position),
    );
    if (candidates.length === 0) return;
    const segSet = new Set<VertexId>([edge.vertexIds[0], edge.vertexIds[1], ...candidates]);
    const finerEdges = shape.edges.filter(
      (h) => h.id !== edge.id && segSet.has(h.vertexIds[0]) && segSet.has(h.vertexIds[1]),
    );
    const adjacency = new Map<VertexId, VertexId[]>();
    for (const h of finerEdges) {
      adjacency.set(h.vertexIds[0], [...(adjacency.get(h.vertexIds[0]) ?? []), h.vertexIds[1]]);
      adjacency.set(h.vertexIds[1], [...(adjacency.get(h.vertexIds[1]) ?? []), h.vertexIds[0]]);
    }
    const reached = new Set<VertexId>([edge.vertexIds[0], edge.vertexIds[1]]);
    const queue: VertexId[] = [...reached];
    while (queue.length > 0) {
      const cur = queue.pop() as VertexId;
      for (const next of adjacency.get(cur) ?? []) {
        if (!reached.has(next)) {
          reached.add(next);
          queue.push(next);
        }
      }
    }
    for (const h of finerEdges) {
      if (reached.has(h.vertexIds[0]) && reached.has(h.vertexIds[1]) && !edgeIds.has(h.id)) {
        addEdge(h);
        edgeQueue.push(h.id);
      }
    }
    const strays = candidates.filter((id) => !reached.has(id));
    if (strays.length > 0) edgeStrayChecks.push({ edgeId: edge.id, strayIds: strays });
  };

  // FACE-interior grain-CARRY (SLICE2 — the slice-1 detector, now a carrier):
  // the finer cells living in the coarse face's own planar region (the
  // mid-face, its chords, an interior vertex) are PULLED — vertices through
  // their connecting finer edges (BFS from the region's already-carried
  // members — the same connectivity discipline as the edge carry), then the
  // contained faces once every corner is carried. What stays unreachable is
  // re-checked at the end and MARKED, never dropped silent.
  const sweepFace = (faceId: string): void => {
    if (sweptFaceIds.has(faceId)) return;
    sweptFaceIds.add(faceId);
    const face = shape.faces.find((f) => f.id === faceId);
    if (!face) return;
    const region = planarRegionOf(face);
    if (!region) return; // malformed — no claim, nothing fabricated
    const { inRegion } = region;
    // NOT-FINER exclusions (measured substrate fact, flagged to the
    // researcher): the dissection records a shared wall TWICE — one face per
    // cell, COINCIDENT same-corner twins. A twin (and a parallel side-twin
    // edge) is the NEIGHBOR's boundary bookkeeping at the SAME granularity,
    // not finer structure ON this face — neither pulled nor marked (the grain
    // law is about the finer subdivision: midpoints, chords, contained
    // sub-faces).
    const faceCornerSet = new Set(face.vertexIds);
    const sideKeys = new Set(faceSidePairs(face).map(([a, b]) => unorderedKey(a, b)));
    const candV = Object.keys(shape.vertices).filter(
      (id) => !vertexIds.has(id) && inRegion(shape.vertices[id].position),
    );
    const candE = shape.edges.filter((h) => {
      if (edgeIds.has(h.id)) return false;
      if (sideKeys.has(unorderedKey(h.vertexIds[0], h.vertexIds[1]))) return false;
      const u = positionOf(h.vertexIds[0]);
      const v = positionOf(h.vertexIds[1]);
      return Boolean(u && v && inRegion(u) && inRegion(v));
    });
    const candF = shape.faces.filter((f2) => {
      if (f2.id === face.id || faceIds.has(f2.id) || f2.vertexIds.length === 0) return false;
      if (f2.vertexIds.length === face.vertexIds.length && f2.vertexIds.every((id) => faceCornerSet.has(id))) {
        return false; // the coincident twin
      }
      return f2.vertexIds.every((id) => {
        const p = positionOf(id);
        return Boolean(p && inRegion(p));
      });
    });
    if (candV.length === 0 && candE.length === 0 && candF.length === 0) return;
    // BFS: seed = every already-carried vertex lying in this region (the
    // face's corners + its side grain), traversal through the candidate edges
    const carriedInRegion = [...vertexIds].filter((id) => {
      const p = positionOf(id);
      return Boolean(p && inRegion(p));
    });
    const adjacency = new Map<VertexId, VertexId[]>();
    for (const h of candE) {
      adjacency.set(h.vertexIds[0], [...(adjacency.get(h.vertexIds[0]) ?? []), h.vertexIds[1]]);
      adjacency.set(h.vertexIds[1], [...(adjacency.get(h.vertexIds[1]) ?? []), h.vertexIds[0]]);
    }
    const reached = new Set<VertexId>(carriedInRegion);
    const queue: VertexId[] = [...reached];
    while (queue.length > 0) {
      const cur = queue.pop() as VertexId;
      for (const next of adjacency.get(cur) ?? []) {
        if (!reached.has(next)) {
          reached.add(next);
          queue.push(next);
        }
      }
    }
    for (const h of candE) {
      if (reached.has(h.vertexIds[0]) && reached.has(h.vertexIds[1]) && !edgeIds.has(h.id)) {
        addEdge(h);
        edgeQueue.push(h.id); // a pulled chord is swept for its own collinear grain
      }
    }
    for (const f2 of candF) {
      if (f2.vertexIds.every((id) => vertexIds.has(id)) && !faceIds.has(f2.id)) {
        addFace(f2);
        faceQueue.push(f2.id); // a pulled face is swept for ITS interior (deeper universes)
      }
    }
    faceStrayChecks.push({
      faceId: face.id,
      vertexIds: candV,
      edgeIds: candE.map((h) => h.id),
      faceIds: candF.map((f2) => f2.id),
    });
  };

  // the fixpoint: edges drain first; a face pull re-feeds both queues
  while (edgeQueue.length > 0 || faceQueue.length > 0) {
    if (edgeQueue.length > 0) {
      sweepEdge(edgeQueue.pop() as string);
    } else {
      sweepFace(faceQueue.pop() as string);
    }
  }

  // the stray re-checks — a candidate a later sweep carried is no refusal;
  // one still absent from the FINAL closure gets the honest mark
  for (const { edgeId, strayIds } of edgeStrayChecks) {
    if (strayIds.some((id) => !vertexIds.has(id))) {
      grainMarks.push({ kind: 'edge', id: edgeId, mark: 'coarse edge; finer structure not carried' });
    }
  }
  for (const stray of faceStrayChecks) {
    const uncarried =
      stray.vertexIds.some((id) => !vertexIds.has(id)) ||
      stray.edgeIds.some((id) => !edgeIds.has(id)) ||
      stray.faceIds.some((id) => !faceIds.has(id));
    if (uncarried) {
      grainMarks.push({ kind: 'face', id: stray.faceId, mark: 'coarse face; finer structure not carried' });
    }
  }

  // ---- THE MANIFOLD PASS (SEAL_PHASE_B_MANIFOLD — researcher-ruled --------
  // COARSE-AS-RELATION): for SURFACE closures only (no cells — a lifted
  // volume keeps its per-cell walls; dropping one would break the cells' own
  // downward closure), the finer subdivision becomes the LIVE boundary:
  //   1 · a TWIN wall (same vertex set — the neighbor's duplicate record)
  //       keeps ONE live copy; the duplicate becomes a SHARED-BY relation;
  //   2 · a COARSE SIDE whose carried midpoints chain it through live finer
  //       halves is DROPPED from the live edges and RECORDED composed-of
  //       (A-C = A-AC ∘ AC-C — no vertex is pushed to a junction, the
  //       boundary walks degree-2, the stance measures by subdivision
  //       invariance);
  //   3 · a COARSE FACE exactly tiled by finer live faces (area-sum equal)
  //       is DROPPED and RECORDED composed-of (the two-layer cover would
  //       double-count every corner's stance).
  // Nothing is erased — the relation IS the record (stamped in extract).
  const composedRelations: NonNullable<SubComplex['composedRelations']> = [];
  if (cellIds.size === 0) {
    // 1 · twins → shared-by (faces, then edges)
    const faceTwinKey = new Map<string, string>();
    for (const faceId of [...faceIds]) {
      const face = shape.faces.find((f) => f.id === faceId);
      if (!face) continue;
      const key = [...face.vertexIds].sort().join('\0');
      const kept = faceTwinKey.get(key);
      if (kept) {
        faceIds.delete(faceId);
        composedRelations.push({
          kind: 'face',
          id: faceId,
          relation: 'shared-by',
          parts: [kept],
          sourceVertexIds: [...face.vertexIds],
        });
      } else {
        faceTwinKey.set(key, faceId);
      }
    }
    const edgeTwinKey = new Map<string, string>();
    for (const edgeId of [...edgeIds]) {
      const edge = shape.edges.find((e) => e.id === edgeId);
      if (!edge) continue;
      const key = unorderedKey(edge.vertexIds[0], edge.vertexIds[1]);
      const kept = edgeTwinKey.get(key);
      if (kept) {
        edgeIds.delete(edgeId);
        composedRelations.push({
          kind: 'edge',
          id: edgeId,
          relation: 'shared-by',
          parts: [kept],
          sourceVertexIds: [...edge.vertexIds],
        });
      } else {
        edgeTwinKey.set(key, edgeId);
      }
    }
    // 2 · coarse sides of closure faces → composed-of their half chain
    const closureFaces = [...faceIds]
      .map((id) => shape.faces.find((f) => f.id === id))
      .filter((f): f is Face => Boolean(f));
    const sideKeySet = new Set(
      closureFaces.flatMap((f) => faceSidePairs(f).map(([a, b]) => unorderedKey(a, b))),
    );
    for (const edgeId of [...edgeIds]) {
      const edge = shape.edges.find((e) => e.id === edgeId);
      if (!edge) continue;
      // the face-carry scope: only a closure face's own side composes; a bare
      // edge lift keeps its sealed T-junction (the slice-1 truth)
      if (!sideKeySet.has(unorderedKey(edge.vertexIds[0], edge.vertexIds[1]))) continue;
      const a = positionOf(edge.vertexIds[0]);
      const b = positionOf(edge.vertexIds[1]);
      if (!a || !b) continue;
      const span = dist(a, b);
      if (span < 1e-12) continue;
      const eps = 1e-7 * span + 1e-12;
      const between = [...vertexIds].filter((id) => {
        if (id === edge.vertexIds[0] || id === edge.vertexIds[1]) return false;
        const p = positionOf(id);
        return Boolean(p && Math.abs(dist(a, p) + dist(p, b) - span) < eps);
      });
      if (between.length === 0) continue; // no carried subdivision — the side stays live
      const stations: VertexId[] = [
        edge.vertexIds[0],
        ...between.sort(
          (u, v) =>
            dist(a, positionOf(u) as [number, number, number]) -
            dist(a, positionOf(v) as [number, number, number]),
        ),
        edge.vertexIds[1],
      ];
      const liveEdgeBetween = (u: VertexId, v: VertexId): string | null => {
        for (const id of edgeIds) {
          if (id === edge.id) continue;
          const h = shape.edges.find((e) => e.id === id);
          if (h && unorderedKey(h.vertexIds[0], h.vertexIds[1]) === unorderedKey(u, v)) return h.id;
        }
        return null;
      };
      const path: string[] = [];
      let complete = true;
      for (let k = 0; k + 1 < stations.length; k += 1) {
        const hop = liveEdgeBetween(stations[k], stations[k + 1]);
        if (!hop) {
          complete = false;
          break;
        }
        path.push(hop);
      }
      if (!complete) continue; // the halves are not all live — the coarse side must stay
      edgeIds.delete(edge.id);
      composedRelations.push({
        kind: 'edge',
        id: edge.id,
        relation: 'composed-of',
        parts: path,
        sourceVertexIds: [...edge.vertexIds],
      });
    }
    // 3 · a coarse face exactly tiled by finer live faces → composed-of
    for (const faceId of [...faceIds]) {
      const face = shape.faces.find((f) => f.id === faceId);
      if (!face) continue;
      const region = planarRegionOf(face);
      if (!region) continue;
      const tiling = [...faceIds]
        .filter((id) => id !== faceId)
        .map((id) => shape.faces.find((f) => f.id === id))
        .filter((f2): f2 is Face => Boolean(f2))
        .filter(
          (f2) =>
            f2.vertexIds.length > 0 &&
            f2.vertexIds.every((id) => {
              const p = positionOf(id);
              return Boolean(p && region.inRegion(p));
            }),
        );
      if (tiling.length < 2) continue;
      const tilingArea = tiling.reduce((sum, f2) => sum + (planarRegionOf(f2)?.area ?? 0), 0);
      if (Math.abs(tilingArea - region.area) > 1e-6 * Math.max(region.area, 1e-12)) continue; // not an exact tiling
      faceIds.delete(faceId);
      composedRelations.push({
        kind: 'face',
        id: faceId,
        relation: 'composed-of',
        parts: tiling.map((f2) => f2.id),
        sourceVertexIds: [...face.vertexIds],
      });
    }
  }

  return {
    cellIds: [...cellIds],
    faceIds: [...faceIds],
    edgeIds: [...edgeIds],
    vertexIds: [...vertexIds],
    ...(grainMarks.length > 0 ? { grainMarks } : {}),
    ...(composedRelations.length > 0 ? { composedRelations } : {}),
  };
}

// ---------------------------------------------------------------------------
// the precondition — connected + downward-closed (an honest reason or null).
// Checks an ARBITRARY member set (the follow-on multi-select gate); closures
// built by downwardClosure pass by construction.
// ---------------------------------------------------------------------------
export function validateLiftSelection(shape: Shape, set: SubComplex): string | null {
  const cells = new Set(set.cellIds);
  const faces = new Set(set.faceIds);
  const edges = new Set(set.edgeIds);
  const vertices = new Set(set.vertexIds);
  if (cells.size + faces.size + edges.size + vertices.size === 0) {
    return 'the selection is empty — pick an entity to lift';
  }
  const byEndpoints = edgesByEndpoints(shape);

  // ---- downward-closed: everything below a member is a member -------------
  for (const cellId of cells) {
    const cell = shape.cells.find((c) => c.id === cellId);
    if (!cell) return `cell "${cellId}" is not in the source shape`;
    for (const faceId of cell.faceIds) {
      if (!faces.has(faceId)) {
        return `not downward-closed: cell "${cellId}" carries face "${faceId}" which is not in the selection`;
      }
    }
    for (const v of cell.vertexIds) {
      if (!vertices.has(v)) {
        return `not downward-closed: cell "${cellId}" carries vertex "${v}" which is not in the selection`;
      }
    }
  }
  for (const faceId of faces) {
    const face = shape.faces.find((f) => f.id === faceId);
    if (!face) return `face "${faceId}" is not in the source shape`;
    for (const v of face.vertexIds) {
      if (!vertices.has(v)) {
        return `not downward-closed: face "${faceId}" carries vertex "${v}" which is not in the selection`;
      }
    }
    for (const [a, b] of faceSidePairs(face)) {
      for (const edge of byEndpoints.get(unorderedKey(a, b)) ?? []) {
        if (!edges.has(edge.id)) {
          return `not downward-closed: face "${faceId}" carries edge "${edge.id}" which is not in the selection`;
        }
      }
    }
  }
  for (const edgeId of edges) {
    const edge = shape.edges.find((e) => e.id === edgeId);
    if (!edge) return `edge "${edgeId}" is not in the source shape`;
    for (const v of edge.vertexIds) {
      if (!vertices.has(v)) {
        return `not downward-closed: edge "${edgeId}" carries vertex "${v}" which is not in the selection`;
      }
    }
  }

  // ---- connected: one component over the incidence graph ------------------
  const parent = new Map<string, string>();
  const find = (x: string): string => {
    if (!parent.has(x)) parent.set(x, x);
    let root = x;
    while (parent.get(root) !== root) root = parent.get(root) as string;
    let cursor = x;
    while (parent.get(cursor) !== root) {
      const next = parent.get(cursor) as string;
      parent.set(cursor, root);
      cursor = next;
    }
    return root;
  };
  const union = (a: string, b: string): void => {
    parent.set(find(a), find(b));
  };
  for (const v of vertices) find(`v:${v}`);
  for (const edgeId of edges) {
    const edge = shape.edges.find((e) => e.id === edgeId);
    if (!edge) continue;
    find(`e:${edgeId}`);
    for (const v of edge.vertexIds) if (vertices.has(v)) union(`e:${edgeId}`, `v:${v}`);
  }
  for (const faceId of faces) {
    const face = shape.faces.find((f) => f.id === faceId);
    if (!face) continue;
    find(`f:${faceId}`);
    for (const v of face.vertexIds) if (vertices.has(v)) union(`f:${faceId}`, `v:${v}`);
  }
  for (const cellId of cells) {
    const cell = shape.cells.find((c) => c.id === cellId);
    if (!cell) continue;
    find(`c:${cellId}`);
    for (const faceId of cell.faceIds) if (faces.has(faceId)) union(`c:${cellId}`, `f:${faceId}`);
    for (const v of cell.vertexIds) if (vertices.has(v)) union(`c:${cellId}`, `v:${v}`);
  }
  const roots = new Set<string>();
  for (const key of parent.keys()) roots.add(find(key));
  if (roots.size > 1) {
    return `the selection is disconnected (${roots.size} components) — lift components separately`;
  }

  return null;
}

// ---------------------------------------------------------------------------
// the extraction — the source Shape restricted to the closure (Q4 re-root)
// ---------------------------------------------------------------------------
export function extractSubShape(
  shape: Shape,
  closure: SubComplex,
  label: string,
): LiftedSubShape {
  const reason = validateLiftSelection(shape, closure);
  if (reason) {
    throw new Error(`subComplexLift: refusing the lift — ${reason}`);
  }
  const cellSet = new Set(closure.cellIds);
  const faceSet = new Set(closure.faceIds);
  const edgeSet = new Set(closure.edgeIds);
  const vertexSet = new Set(closure.vertexIds);

  // structure restricted; LINEAGE fields verbatim (see the header: external
  // refs become source-tagged primals through the committed load + lineage).
  const vertices = Object.fromEntries(
    closure.vertexIds.map((id) => [id, JSON.parse(JSON.stringify(shape.vertices[id]))]),
  ) as Shape['vertices'];
  const edges: Edge[] = shape.edges
    .filter((edge) => edgeSet.has(edge.id))
    .map((edge) => JSON.parse(JSON.stringify(edge)) as Edge);
  const faces: Face[] = shape.faces
    .filter((face) => faceSet.has(face.id))
    .map((face) => JSON.parse(JSON.stringify(face)) as Face);
  const cells: Cell[] = shape.cells
    .filter((cell) => cellSet.has(cell.id))
    .map((cell) => {
      const copy = JSON.parse(JSON.stringify(cell)) as Cell;
      // the one structural re-root: an un-lifted parent cell lives in the
      // source universe — a name, not a doorway (mirrors parentShapeId: null).
      if (copy.parentCellId && !cellSet.has(copy.parentCellId)) copy.parentCellId = null;
      if (copy.preservedVertexId && !vertexSet.has(copy.preservedVertexId)) {
        delete copy.preservedVertexId;
      }
      return copy;
    });
  // generations RESTRICTED to the lifted members (id lists filtered; records
  // that touch nothing lifted are dropped — the sub-shape's own history only)
  const generations: Generation[] = shape.generations
    .map((generation) => {
      const copy = JSON.parse(JSON.stringify(generation)) as Generation;
      copy.parentCellIds = copy.parentCellIds.filter((id) => cellSet.has(id));
      copy.createdCellIds = copy.createdCellIds.filter((id) => cellSet.has(id));
      copy.createdVertexIds = copy.createdVertexIds.filter((id) => vertexSet.has(id));
      return copy;
    })
    .filter(
      (generation) =>
        generation.parentCellIds.length > 0 ||
        generation.createdCellIds.length > 0 ||
        generation.createdVertexIds.length > 0,
    );

  // §3 THE CO-ORIENT (SEAL_S3_BLACK_TRIANGLE_S4_SURFACE_LOCK): every face of
  // a COPLANAR region must co-wind — the dissection's medial cell arrives
  // ANTI-wound (Newell·ref −1.000, engineer-probed) and its inverted-hull
  // back-face turns cameraward: a black interior FILL (black owns no
  // register). The cure is at the SOURCE of the winding: an anti-wound
  // carried face's vertex order is REVERSED (cornerAngles follow the cycle;
  // the P5 stamp below then recomputes aligned). SURFACE closures only — a
  // volume's twin walls wind opposite BY DESIGN (outward per cell).
  if (closure.cellIds.length === 0) {
    const newellOf = (face: Face): [number, number, number] | null => {
      const pts = face.vertexIds.map((id) => vertices[id]?.position);
      if (pts.some((p) => !p) || pts.length < 3) return null;
      let nx = 0;
      let ny = 0;
      let nz = 0;
      for (let i = 0; i < pts.length; i += 1) {
        const p = pts[i] as [number, number, number];
        const q = pts[(i + 1) % pts.length] as [number, number, number];
        nx += (p[1] - q[1]) * (p[2] + q[2]);
        ny += (p[2] - q[2]) * (p[0] + q[0]);
        nz += (p[0] - q[0]) * (p[1] + q[1]);
      }
      const len = Math.hypot(nx, ny, nz);
      return len > 1e-12 ? [nx / len, ny / len, nz / len] : null;
    };
    const planeGroups: Array<{ normal: [number, number, number]; offset: number }> = [];
    for (const face of faces) {
      const n = newellOf(face);
      if (!n) continue;
      const p0 = vertices[face.vertexIds[0]]?.position;
      if (!p0) continue;
      const offset = p0[0] * n[0] + p0[1] * n[1] + p0[2] * n[2];
      const group = planeGroups.find(
        (g) =>
          Math.abs(g.normal[0] * n[0] + g.normal[1] * n[1] + g.normal[2] * n[2]) > 0.999 &&
          Math.abs(Math.abs(g.offset) - Math.abs(offset)) < 1e-6 * Math.max(1, Math.abs(g.offset)),
      );
      if (!group) {
        planeGroups.push({ normal: n, offset }); // the region's reference winding — the first face
        continue;
      }
      const dot = group.normal[0] * n[0] + group.normal[1] * n[1] + group.normal[2] * n[2];
      if (dot < 0) {
        face.vertexIds.reverse();
        if (face.cornerAngles) face.cornerAngles.reverse();
      }
    }
  }

  // P5 — PART A: THE SECOND SOURCE (2026-07-31). The lift always carried the
  // Ambo's angles in its coordinates and read none of them — it reads now:
  // each lifted face's corner k measures θ_k = acos((e₁·e₂)/(|e₁||e₂|)) from
  // the CARRIED positions (e₁ = v_{k−1}−v_k, e₂ = v_{k+1}−v_k) and stamps
  // `Face.cornerAngles` (the P0 carrier, reused — index-aligned). Positions
  // are read HERE because the lift is a SOURCE (its job, exactly as
  // invocation sources from n) — the transforms P1–P4 still read none. A
  // malformed corner (a missing vertex, a zero-length edge vector) leaves
  // the face UN-OWNED — nothing fabricated. The faces are already deep
  // copies, so the stamp mutates nothing of the parent's.
  for (const face of faces) {
    const cycle = face.vertexIds;
    const n = cycle.length;
    if (n < 3) continue;
    const imported: number[] = [];
    let malformed = false;
    for (let k = 0; k < n; k += 1) {
      const v = vertices[cycle[k]]?.position;
      const prev = vertices[cycle[(k - 1 + n) % n]]?.position;
      const next = vertices[cycle[(k + 1) % n]]?.position;
      if (!v || !prev || !next) {
        malformed = true;
        break;
      }
      const e1 = [prev[0] - v[0], prev[1] - v[1], prev[2] - v[2]];
      const e2 = [next[0] - v[0], next[1] - v[1], next[2] - v[2]];
      const n1 = Math.hypot(e1[0], e1[1], e1[2]);
      const n2 = Math.hypot(e2[0], e2[1], e2[2]);
      if (n1 < 1e-12 || n2 < 1e-12) {
        malformed = true;
        break;
      }
      const cos = (e1[0] * e2[0] + e1[1] * e2[1] + e1[2] * e2[2]) / (n1 * n2);
      imported.push(Math.acos(Math.max(-1, Math.min(1, cos))));
    }
    if (!malformed) face.cornerAngles = imported;
  }

  // THE GRAIN MARKS (the LAW: carry OR honestly mark, never silently bare) —
  // stamped on the lifted copies' OWN data (`data.grainMark`, an existing
  // PacketData carrier that rides the committed snapshot round-trip; the
  // card reads it and renders the refusal). The copies are deep — nothing of
  // the source is touched.
  for (const gm of closure.grainMarks ?? []) {
    if (gm.kind === 'edge') {
      const target = edges.find((e) => e.id === gm.id);
      if (target) target.data = { ...(target.data ?? {}), grainMark: gm.mark };
    } else {
      const target = faces.find((f) => f.id === gm.id);
      if (target) target.data = { ...(target.data ?? {}), grainMark: gm.mark };
    }
  }

  // THE MANIFOLD RECORDS (SEAL_PHASE_B_MANIFOLD · #37 GAP 1 promotion,
  // B-2026-08-22-B): a dropped coarse entity IS a relation now — stamped
  // onto its LIVE parts' own NAMED field (`composes`) and onto the kept
  // twin (`sharedBy`): a field the committed loader re-roots by name, so
  // the card resolves the refs by exact `===` after any number of loads
  // (the opaque-data-blob home is retired; the loader migrates old files).
  // Deep copies — the source is never touched.
  for (const rec of closure.composedRelations ?? []) {
    if (rec.relation === 'composed-of') {
      const stamp = {
        kind: rec.kind,
        id: rec.id,
        parts: [...rec.parts],
        sourceVertexIds: [...rec.sourceVertexIds],
      };
      for (const partId of rec.parts) {
        const target =
          rec.kind === 'edge' ? edges.find((e) => e.id === partId) : faces.find((f) => f.id === partId);
        if (target) target.composes = stamp;
      }
    } else {
      const keptId = rec.parts[0];
      const target =
        rec.kind === 'edge' ? edges.find((e) => e.id === keptId) : faces.find((f) => f.id === keptId);
      if (target) target.sharedBy = [...(target.sharedBy ?? []), rec.id];
    }
  }

  const title = `${label} of ${shape.name}`;
  const lifted: Shape = {
    id: `lift:${label.replace(/\s+/g, '-')}:from:${shape.id}`,
    name: title,
    vertices,
    edges,
    faces,
    cells,
    generations,
    genealogy: {
      // the committed patch-lift convention (patchLift.ts): a real parent edge
      // to the source; NON-CONSUMING; the snapshot loader re-roots to null.
      parentShapeId: shape.id,
      operation: 'patch-lift',
      generationDepth: shape.genealogy.generationDepth + 1,
      sourceVertexIds: [...closure.vertexIds],
      createdVertexIds: [], // a pure restriction mints nothing
      createdAt: '',
    },
  };
  return { shape: lifted, title, closure };
}

// the one-call façade the stores use: closure → precondition → extraction
export function liftSubComplex(shape: Shape, selections: LiftSelection[]): LiftedSubShape {
  const closure = downwardClosure(shape, selections);
  // THE DISTINCT ID (SEAL_THE_LIFT_IDENTITY_AND_GRAIN; the kind-doubling
  // cleaned per SLICE2): the single-selection label names WHICH entity — the
  // entity id ALREADY carries its kind prefix (`edge:2f1akb`), so the label
  // is the id alone and the minted shape id reads
  // `lift:edge:<hash>:from:<shape.id>` (ONE kind, still DISTINCT per entity —
  // the sheet dedup keys on shape.id; both edges place). The multi-select
  // region label is unchanged (no UI mints one yet — the flagged follow-on).
  const label =
    selections.length === 1
      ? selections[0].id
      : `${selections.length}-entity region`;
  return extractSubShape(shape, closure, label);
}

// ---------------------------------------------------------------------------
// P5 — PART B: THE APEX-TRACE MEDIAN READ (2026-07-31). A READER, living at
// the lift SOURCE (positions are legal here and nowhere downstream): for
// each apex-trace entry (midpoint M with a resolved apex C — the committed
// incidenceTraceRegistry's face-mediation readings), the MEDIAN C→M of the
// source triangle {A, B, C} carries THREE relations, read from positions:
//   · the FOOT (at M, between M→C and the base M→A)  = 90°
//   · the APEX (at C, between C→M and the side C→A)  = 30°
//   · the BASE (at A, between A→C and the base A→B)  = 60°
// — a CROSS-GENERATION child↔ancestor relation, surfaced as THREE SEPARATE
// readings. ⛔ THE HORIZON GUARD: the barycentric is NEVER assembled — the
// centroid (the medians' meet) is a semantic void, deficit-zero; this read
// computes NO meet, stores NO field, and MINTS NO VERTEX (the shape rides
// through untouched — a reader, not a transform; NOT stamped on
// `Face.cornerAngles`, which carries corners, not relations).
// ---------------------------------------------------------------------------
export interface ApexMedianReading {
  midpointId: VertexId; // M — the site's support (the child-generation vertex)
  apexId: VertexId; // C — the resolved ancestor vertex opposite M's edge
  baseIds: [VertexId, VertexId]; // {A, B} — the midpoint's parents
  footAngle: number; // at M: (M→C, M→A)
  apexAngle: number; // at C: (C→M, C→A)
  baseAngle: number; // at A: (A→C, A→B)
}

export function readApexTraceMedians(shape: Shape): ApexMedianReading[] {
  const registry = buildIncidenceTraceRegistry(shape);
  const angleAt = (at: [number, number, number], p: [number, number, number], q: [number, number, number]): number => {
    const e1 = [p[0] - at[0], p[1] - at[1], p[2] - at[2]];
    const e2 = [q[0] - at[0], q[1] - at[1], q[2] - at[2]];
    const n1 = Math.hypot(e1[0], e1[1], e1[2]);
    const n2 = Math.hypot(e2[0], e2[1], e2[2]);
    if (n1 < 1e-12 || n2 < 1e-12) {
      throw new Error('subComplexLift: a degenerate median leg — the apex-trace read refuses (no angle exists)');
    }
    const cos = (e1[0] * e2[0] + e1[1] * e2[1] + e1[2] * e2[2]) / (n1 * n2);
    return Math.acos(Math.max(-1, Math.min(1, cos)));
  };
  const readings: ApexMedianReading[] = [];
  for (const site of registry.sites) {
    for (const reading of site.readings) {
      if (reading.contextKind !== 'face-mediation' || !reading.apex) continue;
      const m = shape.vertices[site.scopedVertexId]?.position;
      const a = shape.vertices[site.parents[0]]?.position;
      const b = shape.vertices[site.parents[1]]?.position;
      const c = shape.vertices[reading.apex]?.position;
      if (!m || !a || !b || !c) continue; // an off-shape ancestor — the relation has no local read
      readings.push({
        midpointId: site.scopedVertexId,
        apexId: reading.apex,
        baseIds: [site.parents[0], site.parents[1]],
        footAngle: angleAt(m, c, a),
        apexAngle: angleAt(c, m, a),
        baseAngle: angleAt(a, c, b),
      });
    }
  }
  return readings;
}

// patchLift — route-B: the lineage-preserving sub-region → surface constructor.
//
// Given a live generated complex and a chosen DISK sub-region (the star of an
// interior X_K midpoint), lift the region into a closed surface that carries the
// region's birth-memory on BOTH lineage axes (researcher ruling
// RESEARCHER_RULING_ROUTE_B_LINEAGE_CARRIAGE; mothership charter
// RELAY_MOTHERSHIP_TO_ENGINEER_ZOO_UNBLOCKED_ROUTE_B):
//
//   axis 1 — vertex-primal descent: every patch vertex is carried VERBATIM (its
//   original `createdBy.sourceVertexIds` retained — no `loadForm` round-trip,
//   which seed-stamps and provably erases the lineage `primalMultiset` is built
//   from), and each boundary-merged vertex is minted CARRIED-NOT-MINTED with
//   `sourceVertexIds` = [both identified parents] (assemble-style), so its
//   primal multiset is the union of its parents' descent — never a fresh
//   primal. The identification's ledger is the COMMITTED
//   `buildLedgerFromIdentification`. Bare `glueFace`/`flipGlueFace` union-find
//   is NOT used for the shape vertices — at a merge it keeps one
//   representative and drops the other's descent.
//
//   axis 2 — shape genealogy: the lifted surface is a SINGLE-PARENT child of
//   the source complex (`parentShapeId = source.id`, `operation = 'patch-lift'`,
//   `generationDepth = source.depth + 1`). Unlike `assemble` (multi-parent →
//   shape-root), patch-lift records a real parent edge, like ambo/cut.
//
// DISK PRECONDITION (enforced): the centre's core-medial link must decompose to
// `valence === 'interior'` (a single S¹) via the COMMITTED `decomposeLink`
// BEFORE any lift; anything else (boundary / junction / no-context) is
// REJECTED loudly — no lift on a non-disk region.
//
// THE PAIRING (named, deterministic): the ANTIPODAL BOUNDARY PAIRING. The
// ordered boundary cycle b₀…b₍ₙ₋₁₎ is read off the committed registry link
// (walked deterministically from the lexicographically-smallest link vertex
// toward its lexicographically-smallest neighbour), and b_i is identified with
// b_{i+n/2} (n even, ≥ 4 — rejected otherwise). Antipodality is invariant
// under rotation/reflection of the cycle, so the pairing does not depend on
// the walk's start or direction. Each boundary edge {b_i,b_{i+1}} is thereby
// identified with its antipode {b_{i+n/2},b_{i+n/2+1}} — every boundary edge
// paired 2→1, no free boundary left: the disk closes into a closed surface.
//
// REPRESENTATION (load-bearing): the quotient's 1-skeleton contains PARALLEL
// 1-cells — e.g. the spokes centre–b_i and centre–b_{i+n/2} remain DISTINCT
// edges of the surface even though their merged endpoints coincide. An
// endpoint-keyed re-derivation (`deriveEdges`) would fuse them and corrupt χ
// and the links, so the lift carries EXPLICIT edge classes: `shape.edges`
// holds one carried Edge per identified class (parallel classes preserved,
// `vertexIds` = merged endpoints, `sourceVertexIds` = the pre-merge
// endpoints), `cellCounts`/`chi` count the REAL identified cells (the
// committed SurfaceTrace V−E+F semantics: supports − edge-classes + faces),
// vertex links are decomposed at the EDGE-CLASS level (the committed level-2
// construction: link-vertices = incident edge classes, link-edges = face
// corners), and `complex` is the edge-class-faithful `AssembledComplex` for
// the committed `globalW1Class`.
//
// v0 SCOPE (named): the star must be a TRIANGLE fan — every core-medial face
// of the centre a 3-gon containing the centre exactly once — so the registry
// link cycle IS the patch boundary cycle. Ambo-generated interior stars
// satisfy this; a fan carrying 4-gon faces (deeper material) is rejected
// loudly, never mishandled.
//
// DERIVE-ONLY · ADDITIVE: the source Shape is never mutated; committed modules
// are consumed by import only (`buildIncidenceTraceRegistry` /
// `buildVertexLinkAdjacency` / `decomposeLink`, `buildLedgerFromIdentification`,
// `createDefaultVertexData` / `midpoint`, `canonicalEdgeKey`).

import type {
  Edge,
  Face,
  OperationKind,
  Shape,
  ShapeId,
  Vertex,
  VertexId,
} from '../types/geometry';
import { canonicalEdgeKey } from './ids';
import { createDefaultVertexData, midpoint } from './shape';
import {
  buildIncidenceTraceRegistry,
  buildVertexLinkAdjacency,
  decomposeLink,
  type LinkDecomposition,
  type LinkValence,
} from './incidenceTraceRegistry';
import { buildLedgerFromIdentification, type TransformationLedger } from './transformationLedger';
import type { AssembledComplex } from './globalW1';

const PATCH_LIFT_OPERATION: OperationKind = 'patch-lift';

// `primalMultisetKey` (lineage.ts:57-61) joins `id×count` terms with the
// reserved chars `×` and `|`; a minted merged-vertex id must contain neither.
const RESERVED_KEY_CHARS = ['×', '|'];

function assertKeySafe(part: string, what: string): void {
  for (const reserved of RESERVED_KEY_CHARS) {
    if (part.includes(reserved)) {
      throw new Error(
        `patchLift: ${what} "${part}" contains reserved primalMultisetKey char "${reserved}" — it would corrupt the lineage key`,
      );
    }
  }
}

export interface PatchLiftPairing {
  name: 'antipodal-boundary-pairing';
  pairs: [VertexId, VertexId][]; // [b_i, b_{i+n/2}] in boundary-walk order
}

export interface PatchVertexLink {
  vertexId: VertexId;
  valence: LinkValence; // 'interior' on every vertex ⟺ the lift is a closed manifold surface
  decomposition: LinkDecomposition;
}

export interface PatchLift {
  shape: Shape; // the lifted surface L — the two-axis lineage carrier
  ledger: TransformationLedger; // the carried boundary identification (committed builder)
  center: VertexId;
  boundaryCycle: VertexId[]; // the ordered link cycle read off the committed registry
  pairing: PatchLiftPairing;
  complex: AssembledComplex; // edge-class-faithful CW complex (feed to globalW1Class)
  links: PatchVertexLink[]; // per-vertex link decomposition at edge-class level
  cellCounts: { v: number; e: number; f: number }; // REAL identified cell counts
  chi: number; // Euler characteristic v − e + f — the surface invariant
}

// Walk the interior link's single cycle deterministically: start at the
// lexicographically-smallest link vertex, step to its lexicographically-smallest
// neighbour, then always continue away from the previous vertex. The caller has
// already verified `valence === 'interior'` (every degree 2, one component) and
// n ≥ 4, so the walk is a simple cycle covering the whole link.
function walkBoundaryCycle(adjacency: Map<string, string[]>): VertexId[] {
  const start = [...adjacency.keys()].sort((a, b) => a.localeCompare(b))[0];
  const first = [...(adjacency.get(start) ?? [])].sort((a, b) => a.localeCompare(b))[0];
  const cycle: VertexId[] = [start, first];
  for (;;) {
    const current = cycle[cycle.length - 1];
    const previous = cycle[cycle.length - 2];
    const next = (adjacency.get(current) ?? []).find((v) => v !== previous);
    if (next === undefined) {
      throw new Error(`patchLift: boundary walk stalled at "${current}" — link is not a simple cycle`);
    }
    if (next === start) break;
    cycle.push(next);
  }
  if (cycle.length !== adjacency.size) {
    throw new Error(
      `patchLift: boundary walk covered ${cycle.length} of ${adjacency.size} link vertices — link is not a single cycle`,
    );
  }
  return cycle;
}

// Lift the disk star of `centerId` (an interior X_K midpoint of `source`) into a
// closed surface, carrying lineage on both axes. Throws (no lift) on any
// precondition failure — the disk gate, the v0 triangle-fan scope, or an odd/
// too-short boundary cycle.
export function patchLift(source: Shape, centerId: VertexId): PatchLift {
  // (1) DISK PRECONDITION — committed registry link + decomposeLink, BEFORE any lift.
  const registry = buildIncidenceTraceRegistry(source);
  const site = registry.sites.find((s) => s.scopedVertexId === centerId);
  const adjacency = site
    ? buildVertexLinkAdjacency(centerId, site.readings)
    : new Map<string, string[]>();
  const gate = decomposeLink(adjacency);
  if (gate.valence !== 'interior') {
    throw new Error(
      `patchLift: center "${centerId}" is not a disk centre — link valence '${gate.valence}' (required 'interior'); no lift`,
    );
  }
  const centerSite = site as NonNullable<typeof site>; // interior ⇒ non-empty link ⇒ the site exists

  // (2) The disk star — the committed core-medial fan (one face per registry reading).
  const faceById = new Map<string, Face>(source.faces.map((face) => [face.id, face]));
  const fanFaces: Face[] = [];
  const seenFaceIds = new Set<string>();
  for (const reading of centerSite.readings) {
    if (seenFaceIds.has(reading.generatedFaceId)) continue;
    seenFaceIds.add(reading.generatedFaceId);
    const face = faceById.get(reading.generatedFaceId);
    if (!face) {
      throw new Error(`patchLift: core-medial face "${reading.generatedFaceId}" not found on the source shape`);
    }
    fanFaces.push(face);
  }

  // (3) v0 scope guard: a triangle fan (then the link cycle IS the patch boundary).
  for (const face of fanFaces) {
    const centerUses = face.vertexIds.filter((v) => v === centerId).length;
    if (face.vertexIds.length !== 3 || new Set(face.vertexIds).size !== 3 || centerUses !== 1) {
      throw new Error(
        `patchLift: v0 supports triangle fans only — core-medial face "${face.id}" is a ` +
          `${face.vertexIds.length}-gon with ${centerUses} centre use(s); no lift`,
      );
    }
  }

  // (4) The ordered boundary cycle + the antipodal-pairing parity gate.
  const n = adjacency.size;
  if (n < 4 || n % 2 !== 0) {
    throw new Error(
      `patchLift: the antipodal boundary pairing needs an EVEN boundary cycle of length >= 4 (got n=${n}); no lift`,
    );
  }
  const boundaryCycle = walkBoundaryCycle(adjacency);
  for (const b of boundaryCycle) {
    if (!source.vertices[b]) {
      throw new Error(`patchLift: boundary vertex "${b}" not found on the source shape`);
    }
  }

  // (5) The antipodal pairing + the carried-not-minted merges.
  const half = n / 2;
  const liftShapeId: ShapeId = `shape:patch-lift:${source.id}:${centerId}`;
  const pairs: [VertexId, VertexId][] = [];
  const mergedOf = new Map<VertexId, VertexId>();
  const mintedChildren: Vertex[] = [];
  for (let i = 0; i < half; i += 1) {
    const a = boundaryCycle[i];
    const b = boundaryCycle[i + half];
    assertKeySafe(a, 'identified parent id');
    assertKeySafe(b, 'identified parent id');
    const childId: VertexId = `patch-lift:${[a, b].sort((x, y) => x.localeCompare(y)).join('~')}`;
    if (source.vertices[childId] || mergedOf.has(childId)) {
      throw new Error(`patchLift: merged child id "${childId}" collides with an existing site`);
    }
    pairs.push([a, b]);
    mergedOf.set(a, childId);
    mergedOf.set(b, childId);
    mintedChildren.push({
      id: childId,
      position: midpoint(source.vertices[a].position, source.vertices[b].position),
      data: createDefaultVertexData(childId),
      createdBy: {
        shapeId: liftShapeId,
        operation: PATCH_LIFT_OPERATION,
        // CARRIED-NOT-MINTED (axis 1): the merged vertex carries BOTH identified
        // parents, so `primalMultiset` computes the union of their descent —
        // never a fresh `{child×1}` primal, never one representative's half.
        sourceVertexIds: [a, b],
      },
    });
  }
  const resultOf = (id: VertexId): VertexId => mergedOf.get(id) ?? id;

  // (6) The lifted vertex set: unmerged patch vertices carried VERBATIM (createdBy
  // retained — axis 1), plus the minted merged children.
  const patchVertexIds: VertexId[] = [centerId, ...boundaryCycle];
  const vertices: Record<VertexId, Vertex> = {};
  for (const id of patchVertexIds) {
    if (mergedOf.has(id)) continue;
    vertices[id] = source.vertices[id];
  }
  for (const child of mintedChildren) {
    if (vertices[child.id]) {
      throw new Error(`patchLift: merged child id "${child.id}" collides with a carried vertex`);
    }
    vertices[child.id] = child;
  }

  // (7) Faces: the fan faces carried with cycles rewritten through the identification.
  const faces: Face[] = fanFaces.map((face) => {
    const rewritten = face.vertexIds.map((v) => resultOf(v));
    if (new Set(rewritten).size !== rewritten.length) {
      throw new Error(`patchLift: identification degenerates face "${face.id}" (repeated vertex after merge); no lift`);
    }
    return { ...face, vertexIds: rewritten };
  });

  // (8) EDGE CLASSES — the real identified 1-cells. Patch edges are enumerated off
  // the ORIGINAL fan-face cycles and carried from the source's Edge records; the
  // boundary pairing unions each boundary edge with its antipode (a local
  // union-find over canonical edge keys — bookkeeping mirroring the committed χ
  // path in surfaceOperations.identifyByPairs, which is single-face-scoped and
  // does not export its union-find; no engine math is recomputed). Parallel
  // classes (the spokes) are PRESERVED — never endpoint-fused.
  const sourceEdgeByKey = new Map<string, Edge>();
  for (const edge of source.edges) {
    sourceEdgeByKey.set(canonicalEdgeKey(edge.vertexIds[0], edge.vertexIds[1]), edge);
  }

  const patchEdgeKeys: string[] = [];
  const seenKeys = new Set<string>();
  for (const face of fanFaces) {
    const vs = face.vertexIds;
    for (let i = 0; i < vs.length; i += 1) {
      const key = canonicalEdgeKey(vs[i], vs[(i + 1) % vs.length]);
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        patchEdgeKeys.push(key);
      }
    }
  }

  const ufParent = new Map<string, string>();
  const find = (x: string): string => {
    if (!ufParent.has(x)) ufParent.set(x, x);
    let root = x;
    while (ufParent.get(root) !== root) root = ufParent.get(root) as string;
    let cursor = x;
    while (ufParent.get(cursor) !== root) {
      const next = ufParent.get(cursor) as string;
      ufParent.set(cursor, root);
      cursor = next;
    }
    return root;
  };
  const union = (a: string, b: string): void => {
    ufParent.set(find(a), find(b));
  };
  for (const key of patchEdgeKeys) find(key);
  for (let i = 0; i < half; i += 1) {
    const keyA = canonicalEdgeKey(boundaryCycle[i], boundaryCycle[(i + 1) % n]);
    const keyB = canonicalEdgeKey(boundaryCycle[i + half], boundaryCycle[(i + half + 1) % n]);
    if (!seenKeys.has(keyA) || !seenKeys.has(keyB)) {
      throw new Error(`patchLift: boundary edge pairing references an edge outside the fan (${keyA} / ${keyB})`);
    }
    union(keyA, keyB);
  }

  const membersByRoot = new Map<string, string[]>();
  for (const key of patchEdgeKeys) {
    const root = find(key);
    const members = membersByRoot.get(root);
    if (members) {
      members.push(key);
    } else {
      membersByRoot.set(root, [key]);
    }
  }
  const classes: { repKey: string; carried: Edge }[] = [];
  const classEdgeIdOfKey = new Map<string, string>(); // canonical key -> its class's carried edge id
  for (const members of membersByRoot.values()) {
    const sortedMembers = [...members].sort((a, b) => a.localeCompare(b));
    const repKey = sortedMembers[0];
    const carried = sourceEdgeByKey.get(repKey);
    if (!carried) {
      throw new Error(`patchLift: patch edge "${repKey}" not found on the source shape's edges`);
    }
    for (const key of sortedMembers) classEdgeIdOfKey.set(key, carried.id);
    classes.push({ repKey, carried });
  }
  classes.sort((a, b) => a.repKey.localeCompare(b.repKey));

  const edges: Edge[] = classes.map(({ carried }) => ({
    ...carried,
    vertexIds: [resultOf(carried.vertexIds[0]), resultOf(carried.vertexIds[1])] as [VertexId, VertexId],
    // the pre-merge endpoints, carried as the edge's source trace
    sourceVertexIds: [carried.vertexIds[0], carried.vertexIds[1]] as [VertexId, VertexId],
  }));

  // (9) The edge-class-faithful AssembledComplex (for the committed globalW1Class).
  // Each class's canonical (u,v) = its carried representative's merged endpoints in
  // stored orientation; each face slot reads its direction against that canonical.
  const canonicalOf = new Map<string, [string, string]>();
  for (const { carried } of classes) {
    canonicalOf.set(carried.id, [resultOf(carried.vertexIds[0]), resultOf(carried.vertexIds[1])]);
  }
  const complexFaces = fanFaces.map((face) => {
    const vs = face.vertexIds;
    const boundary = vs.map((x, i) => {
      const y = vs[(i + 1) % vs.length];
      const classEdgeId = classEdgeIdOfKey.get(canonicalEdgeKey(x, y)) as string;
      const [u, v] = canonicalOf.get(classEdgeId) as [string, string];
      if (u === v) {
        throw new Error(`patchLift: edge class "${classEdgeId}" collapsed to a self-loop — direction is ambiguous`);
      }
      const fx = resultOf(x);
      const fy = resultOf(y);
      let dir: 1 | -1;
      if (fx === u && fy === v) {
        dir = 1;
      } else if (fx === v && fy === u) {
        dir = -1;
      } else {
        throw new Error(`patchLift: face "${face.id}" slot ${x}->${y} does not land on its edge class's endpoints`);
      }
      return { edge: classEdgeId, dir };
    });
    return { boundary };
  });
  const complex: AssembledComplex = {
    vertices: Object.keys(vertices),
    edges: classes.map(({ carried }) => {
      const [u, v] = canonicalOf.get(carried.id) as [string, string];
      return { id: carried.id, u, v };
    }),
    faces: complexFaces,
  };

  // (10) Per-vertex links at the EDGE-CLASS level (the committed level-2
  // construction: link-vertices = the incident edge classes, link-edges = the face
  // corners absorbed into the vertex — each corner joins its two adjacent edge
  // classes), decomposed by the committed decomposeLink. Every valence 'interior'
  // ⟺ the lift is a closed manifold surface.
  const links: PatchVertexLink[] = Object.keys(vertices)
    .sort((a, b) => a.localeCompare(b))
    .map((vertexId) => {
      const linkAdjacency = new Map<string, string[]>();
      const addHalfEdge = (from: string, to: string): void => {
        const list = linkAdjacency.get(from);
        if (list) {
          list.push(to);
        } else {
          linkAdjacency.set(from, [to]);
        }
      };
      for (const face of fanFaces) {
        const vs = face.vertexIds;
        for (let p = 0; p < vs.length; p += 1) {
          if (resultOf(vs[p]) !== vertexId) continue;
          const prevKey = canonicalEdgeKey(vs[(p - 1 + vs.length) % vs.length], vs[p]);
          const nextKey = canonicalEdgeKey(vs[p], vs[(p + 1) % vs.length]);
          const a = classEdgeIdOfKey.get(prevKey) as string;
          const b = classEdgeIdOfKey.get(nextKey) as string;
          addHalfEdge(a, b);
          addHalfEdge(b, a);
        }
      }
      const decomposition = decomposeLink(linkAdjacency);
      return { vertexId, valence: decomposition.valence, decomposition };
    });

  // (11) The REAL identified cell counts (the committed V−E+F surface invariant:
  // supports − edge classes + faces) and the committed identification ledger.
  const cellCounts = { v: Object.keys(vertices).length, e: classes.length, f: faces.length };
  const chi = cellCounts.v - cellCounts.e + cellCounts.f;
  const ledger = buildLedgerFromIdentification(patchVertexIds, (id) => resultOf(id));

  const shape: Shape = {
    id: liftShapeId,
    name: `patch-lift(${source.name})`,
    vertices,
    edges,
    faces,
    cells: [],
    generations: [],
    genealogy: {
      // axis 2: SINGLE-PARENT birth — a real parent edge, unlike assemble's root.
      parentShapeId: source.id,
      operation: PATCH_LIFT_OPERATION,
      generationDepth: source.genealogy.generationDepth + 1,
      sourceVertexIds: [...patchVertexIds],
      createdVertexIds: mintedChildren.map((child) => child.id),
      createdAt: '',
    },
  };

  return {
    shape,
    ledger,
    center: centerId,
    boundaryCycle,
    pairing: { name: 'antipodal-boundary-pairing', pairs },
    complex,
    links,
    cellCounts,
    chi,
  };
}

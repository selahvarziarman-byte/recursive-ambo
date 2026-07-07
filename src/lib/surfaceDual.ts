// surfaceDual — the surface (Poincaré) dual op `dual(M²)` (Q6 / ADR 0020).
//
// On a SOUND CLOSED 2-manifold: V* = F, E* = E, F* = V — the dual vertex at each
// face's centroid; the dual edge joining the two faces along each edge; the dual
// face around each vertex, boundary = the cyclic order of faces around it.
// M* ≅ M (a re-cellulation): χ, w₁, genus, H₁ preserved; the involution
// M** = M is the falsifiable correctness check.
//
// THE SEAM, AS GROUNDED (the engineer's reuse note corrected against source):
// the committed `dualization.ts` construction is NOT importable-general —
// `createDualVertices` / `buildDualFaceEntries` / `orderIncidentSourceFaces`
// are module-PRIVATE, `orderIncidentSourceFaces` HARD-requires degree-5
// vertices (dualization.ts:527 "expected five incident faces", :574 "not a
// five-cycle" — pyritohedral-only), and the incidence is ENDPOINT-KEYED
// (:563 `canonicalEdgeKey(...edge.vertexIds)`), which fuses the self-loop /
// parallel edge classes every QUOTIENT fixture in the seal carries (the pinned
// SELF-DUAL torus is V1/E2/F1 with two self-loops). The mandate's hard line —
// dualization.ts BYTE-UNCHANGED — therefore wins over "call them directly":
// this module builds the dual ONCE, slot-faithfully, over the campaign's
// faithful `AssembledComplex` representation (which subsumes the plain case),
// REUSING the committed pieces that are honestly reusable: `decomposeLink`
// (the soundness gate's recognizer), `deriveFaceLineage`/`packetSourceRef`
// (lineage, honest kinds only), `createDefaultVertexData`, `canonicalEdgeKey`
// (plain translation), and the committed `dualization` OperationKind. The
// correspondence maps mirror the committed `SemanticDualModel` naming.
//
// DERIVE-ONLY · ADDITIVE: committed modules by import; dualization.ts, the
// level-2 ops, Build-1/2 all byte-unchanged.

import type { Edge, Face, Shape, Vec3, Vertex, VertexId } from '../types/geometry';
import type { AssembledComplex } from './globalW1';
import { decomposeLink } from './incidenceTraceRegistry';
import { canonicalEdgeKey } from './ids';
import { createDefaultVertexData } from './shape';
import { deriveFaceLineage, packetSourceRef } from './packets';

export interface SurfaceDualCorrespondence {
  sourceFaceToDualVertex: Record<string, VertexId>;
  dualVertexToSourceFace: Record<VertexId, string>;
  sourceEdgeToDualEdge: Record<string, string>;
  dualEdgeToSourceEdge: Record<string, string>;
  sourceVertexToDualFace: Record<VertexId, string>;
  dualFaceToSourceVertex: Record<string, VertexId>;
}

export interface SurfaceDualResult {
  shape: Shape; // M* — a 2-complex surface Shape (NOT a Cell)
  complex: AssembledComplex; // M*'s own faithful complex (feeds M**, χ, w₁)
  correspondence: SurfaceDualCorrespondence;
}

export interface SurfaceDualOptions {
  complex?: AssembledComplex; // a QUOTIENT form's faithful complex (the fieldForShape precedent)
}

// ---------------------------------------------------------------------------
// the faithful complex (direct translation for plain shapes — the campaign pattern)
// ---------------------------------------------------------------------------

function tryDirectComplex(shape: Shape): AssembledComplex | null {
  const edgeByKey = new Map<string, { id: string; u: string; v: string }>();
  for (const edge of shape.edges) {
    const [u, v] = edge.vertexIds;
    if (u === v) return null; // self-loop — needs the faithful complex
    const key = canonicalEdgeKey(u, v);
    if (edgeByKey.has(key)) return null; // parallel classes — needs the faithful complex
    edgeByKey.set(key, { id: edge.id, u, v });
  }
  const faces: AssembledComplex['faces'] = [];
  for (const face of shape.faces) {
    const vs = face.vertexIds;
    const boundary: Array<{ edge: string; dir: 1 | -1 }> = [];
    for (let k = 0; k < vs.length; k += 1) {
      const x = vs[k];
      const y = vs[(k + 1) % vs.length];
      const edge = edgeByKey.get(canonicalEdgeKey(x, y));
      if (!edge) return null;
      boundary.push({ edge: edge.id, dir: edge.u === x && edge.v === y ? 1 : -1 });
    }
    faces.push({ boundary });
  }
  return { vertices: Object.keys(shape.vertices), edges: [...edgeByKey.values()], faces };
}

// ---------------------------------------------------------------------------
// the incidence walk (ends / corners) — one source of truth for gate AND dual
// ---------------------------------------------------------------------------

interface Corner {
  faceIndex: number;
  slot: number; // the corner sits at the TAIL of boundary[slot] (= head of boundary[slot-1])
  vertex: string; // the vertex class at the corner
  inEnd: string; // END key of the incoming half-edge
  outEnd: string; // END key of the outgoing half-edge
}

const endKeyOf = (edgeId: string, endIndex: 0 | 1): string => JSON.stringify([edgeId, endIndex]);

function buildIncidence(complex: AssembledComplex) {
  const edgeById = new Map(complex.edges.map((e) => [e.id, e]));
  // per-edge slot incidences (face, slot) — the gate's 2-incidence count
  const incidencesOfEdge = new Map<string, { faceIndex: number; slot: number }[]>();
  const corners: Corner[] = [];
  complex.faces.forEach((face, faceIndex) => {
    const n = face.boundary.length;
    for (let k = 0; k < n; k += 1) {
      const slotEdge = face.boundary[k];
      const edge = edgeById.get(slotEdge.edge);
      if (!edge) throw new Error(`surfaceDual: face slot references unknown edge ${slotEdge.edge}`);
      const list = incidencesOfEdge.get(edge.id);
      if (list) list.push({ faceIndex, slot: k });
      else incidencesOfEdge.set(edge.id, [{ faceIndex, slot: k }]);

      const prev = face.boundary[(k - 1 + n) % n];
      const prevEdge = edgeById.get(prev.edge) as { id: string; u: string; v: string };
      // the corner at slot k: tail of slot k === head of slot k−1 (consistency asserted)
      const tailVertex = slotEdge.dir === 1 ? edge.u : edge.v;
      const headOfPrev = prev.dir === 1 ? prevEdge.v : prevEdge.u;
      if (tailVertex !== headOfPrev) {
        throw new Error(
          `surfaceDual: face ${faceIndex} boundary is not a closed vertex cycle at slot ${k} (${headOfPrev} vs ${tailVertex})`,
        );
      }
      corners.push({
        faceIndex,
        slot: k,
        vertex: tailVertex,
        inEnd: endKeyOf(prev.edge, prev.dir === 1 ? 1 : 0),
        outEnd: endKeyOf(slotEdge.edge, slotEdge.dir === 1 ? 0 : 1),
      });
    }
  });
  // every edge referenced by 0 faces? (edges not on any face — skeleton edges)
  for (const edge of complex.edges) {
    if (!incidencesOfEdge.has(edge.id)) incidencesOfEdge.set(edge.id, []);
  }
  return { edgeById, incidencesOfEdge, corners };
}

// ---------------------------------------------------------------------------
// the gate (refuse, don't fake) + the per-vertex cyclic corner walk
// ---------------------------------------------------------------------------

interface VertexWalk {
  vertex: string;
  corners: Corner[]; // in cyclic link order
  crossedEnds: string[]; // END crossed LEAVING corners[i] (into corners[i+1])
}

function gateAndWalk(complex: AssembledComplex): { walks: VertexWalk[] } {
  const { incidencesOfEdge, corners } = buildIncidence(complex);

  // (gate 1) every edge in EXACTLY two face slots
  for (const [edgeId, incidences] of incidencesOfEdge) {
    if (incidences.length === 1) {
      throw new Error(`surfaceDual: REFUSED — boundary edge ${edgeId} (1 face incidence): dual undefined on bounded surfaces`);
    }
    if (incidences.length !== 2) {
      throw new Error(
        `surfaceDual: REFUSED — non-manifold edge ${edgeId} (${incidences.length} face incidences): dual edge ambiguous`,
      );
    }
  }

  // (gate 2 + the walk) every vertex link ONE interior cycle (committed decomposeLink)
  const cornersAtVertex = new Map<string, Corner[]>();
  for (const corner of corners) {
    const list = cornersAtVertex.get(corner.vertex);
    if (list) list.push(corner);
    else cornersAtVertex.set(corner.vertex, [corner]);
  }
  for (const v of complex.vertices) {
    if (!cornersAtVertex.has(v)) {
      throw new Error(`surfaceDual: REFUSED — isolated vertex ${v} (no face corner): not a closed surface`);
    }
  }

  const walks: VertexWalk[] = [];
  for (const [vertex, vertexCorners] of cornersAtVertex) {
    const adjacency = new Map<string, string[]>();
    const cornersAtEnd = new Map<string, Corner[]>();
    const push = (map: Map<string, string[]>, key: string, value: string): void => {
      const list = map.get(key);
      if (list) list.push(value);
      else map.set(key, [value]);
    };
    for (const corner of vertexCorners) {
      push(adjacency, corner.inEnd, corner.outEnd);
      push(adjacency, corner.outEnd, corner.inEnd);
      for (const end of [corner.inEnd, corner.outEnd]) {
        const list = cornersAtEnd.get(end);
        if (list) list.push(corner);
        else cornersAtEnd.set(end, [corner]);
      }
    }
    const decomposition = decomposeLink(adjacency);
    if (decomposition.valence !== 'interior') {
      throw new Error(
        `surfaceDual: REFUSED — vertex ${vertex} link reads '${decomposition.valence}' (need one interior cycle): not a sound closed surface`,
      );
    }
    // walk the single cycle: corner → other end → other corner → …
    const sortedCorners = [...vertexCorners].sort(
      (a, b) => a.faceIndex - b.faceIndex || a.slot - b.slot,
    );
    const start = sortedCorners[0];
    const orderedCorners: Corner[] = [start];
    const crossedEnds: string[] = [];
    const used = new Set<Corner>([start]);
    let current = start;
    let leaveVia = start.outEnd; // deterministic direction
    while (orderedCorners.length < vertexCorners.length) {
      const candidates = (cornersAtEnd.get(leaveVia) ?? []).filter((c) => !used.has(c));
      if (candidates.length !== 1) {
        throw new Error(`surfaceDual: link walk at ${vertex} is not a single simple cycle (END ${leaveVia})`);
      }
      const next = candidates[0];
      crossedEnds.push(leaveVia);
      orderedCorners.push(next);
      used.add(next);
      leaveVia = next.inEnd === leaveVia ? next.outEnd : next.inEnd;
      current = next;
    }
    void current;
    if (leaveVia !== start.inEnd && leaveVia !== start.outEnd) {
      throw new Error(`surfaceDual: link walk at ${vertex} did not close`);
    }
    crossedEnds.push(leaveVia); // the END closing back into the start corner
    walks.push({ vertex, corners: orderedCorners, crossedEnds });
  }
  return { walks };
}

// ---------------------------------------------------------------------------
// the dual
// ---------------------------------------------------------------------------

function centroidOf(points: Vec3[]): Vec3 {
  const n = points.length || 1;
  const sum = points.reduce<Vec3>((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0]);
  return [sum[0] / n, sum[1] / n, sum[2] / n];
}

const endEdgeId = (endKey: string): string => (JSON.parse(endKey) as [string, number])[0];

export function surfaceDual(shape: Shape, options: SurfaceDualOptions = {}): SurfaceDualResult {
  const complex = options.complex ?? tryDirectComplex(shape);
  if (!complex) {
    throw new Error(
      `surfaceDual: "${shape.id}" carries quotient cells (self-loop/parallel edge classes) — pass the form's own faithful complex via options.complex`,
    );
  }
  const { incidencesOfEdge, corners } = buildIncidence(complex);
  const { walks } = gateAndWalk(complex);

  const dualShapeId = `shape:surface-dual:${shape.id}`;

  // V* = one dual vertex per source FACE (centroid; carried-not-minted lineage)
  const cornersOfFace = new Map<number, Corner[]>();
  for (const corner of corners) {
    const list = cornersOfFace.get(corner.faceIndex);
    if (list) list.push(corner);
    else cornersOfFace.set(corner.faceIndex, [corner]);
  }
  const dualVertexIdOfFace = (faceIndex: number): VertexId => `dualv:${shape.id}:f${faceIndex}`;
  const vertices: Record<VertexId, Vertex> = {};
  const sourceFaceToDualVertex: Record<string, VertexId> = {};
  const dualVertexToSourceFace: Record<VertexId, string> = {};
  complex.faces.forEach((_face, faceIndex) => {
    const faceCorners = (cornersOfFace.get(faceIndex) ?? []).sort((a, b) => a.slot - b.slot);
    const id = dualVertexIdOfFace(faceIndex);
    const cornerVertexIds = faceCorners.map((c) => c.vertex);
    vertices[id] = {
      id,
      position: centroidOf(cornerVertexIds.map((v) => shape.vertices[v]?.position ?? [0, 0, 0])),
      data: createDefaultVertexData(`D${faceIndex + 1}`, '#c084fc'),
      createdBy: {
        shapeId: dualShapeId,
        operation: 'dualization',
        // carried-not-minted: the dual vertex stands for the face — it carries
        // the face's corner classes (the committed createDualVertices discipline).
        sourceVertexIds: [...cornerVertexIds],
      },
    };
    const faceKey = `face:${faceIndex}`;
    sourceFaceToDualVertex[faceKey] = id;
    dualVertexToSourceFace[id] = faceKey;
  });

  // E* = one dual edge per source edge (its two face incidences; self-loop when equal)
  const dualEdgeIdOfEdge = new Map<string, string>();
  const sourceEdgeToDualEdge: Record<string, string> = {};
  const dualEdgeToSourceEdge: Record<string, string> = {};
  const edges: Edge[] = [];
  const canonicalIncidences = new Map<string, { faceIndex: number; slot: number }[]>();
  for (const [edgeId, incidences] of incidencesOfEdge) {
    const sorted = [...incidences].sort((a, b) => a.faceIndex - b.faceIndex || a.slot - b.slot);
    canonicalIncidences.set(edgeId, sorted);
    const id = `duale:${edgeId}`;
    dualEdgeIdOfEdge.set(edgeId, id);
    sourceEdgeToDualEdge[edgeId] = id;
    dualEdgeToSourceEdge[id] = edgeId;
    edges.push({
      id,
      vertexIds: [dualVertexIdOfFace(sorted[0].faceIndex), dualVertexIdOfFace(sorted[1].faceIndex)],
      role: 'boundary',
      sourceVertexIds: [
        (complex.edges.find((e) => e.id === edgeId) as { u: string }).u,
        (complex.edges.find((e) => e.id === edgeId) as { v: string }).v,
      ] as Edge['sourceVertexIds'],
    } as Edge);
  }

  // F* = one dual face per source vertex — boundary = the cyclic corner walk
  const faces: Face[] = [];
  const complexFaces: AssembledComplex['faces'] = [];
  const sourceVertexToDualFace: Record<VertexId, string> = {};
  const dualFaceToSourceVertex: Record<string, VertexId> = {};
  for (const walk of [...walks].sort((a, b) => a.vertex.localeCompare(b.vertex))) {
    const m = walk.corners.length;
    const vertexIds: VertexId[] = walk.corners.map((c) => dualVertexIdOfFace(c.faceIndex));
    const boundary: Array<{ edge: string; dir: 1 | -1 }> = [];
    for (let i = 0; i < m; i += 1) {
      const from = walk.corners[i];
      const crossed = walk.crossedEnds[i];
      const edgeId = endEdgeId(crossed);
      // the FROM slot-incidence: the corner touches this END via its out-slot or in-slot
      const fromSlot = from.outEnd === crossed ? from.slot : (from.slot - 1 + complex.faces[from.faceIndex].boundary.length) % complex.faces[from.faceIndex].boundary.length;
      const sorted = canonicalIncidences.get(edgeId) as { faceIndex: number; slot: number }[];
      const isFirst = sorted[0].faceIndex === from.faceIndex && sorted[0].slot === fromSlot;
      boundary.push({ edge: dualEdgeIdOfEdge.get(edgeId) as string, dir: isFirst ? 1 : -1 });
    }
    const dualFaceId = `dualf:${walk.vertex}`;
    faces.push({
      id: dualFaceId,
      vertexIds,
      role: 'dual-face-from-vertex' as Face['role'],
      lineage: deriveFaceLineage(
        [packetSourceRef('vertex', walk.vertex, 'source-vertex')],
        dualShapeId,
        'derived-from-vertex',
      ),
    } as Face);
    complexFaces.push({ boundary });
    sourceVertexToDualFace[walk.vertex] = dualFaceId;
    dualFaceToSourceVertex[dualFaceId] = walk.vertex;
  }

  const dualComplex: AssembledComplex = {
    vertices: Object.keys(vertices),
    edges: edges.map((e) => ({ id: e.id, u: e.vertexIds[0], v: e.vertexIds[1] })),
    faces: complexFaces,
  };

  const dualShape: Shape = {
    id: dualShapeId,
    name: `dual(${shape.name})`,
    vertices,
    edges,
    faces,
    cells: [],
    generations: [],
    genealogy: {
      parentShapeId: shape.id,
      operation: 'dualization',
      generationDepth: shape.genealogy.generationDepth + 1,
      sourceVertexIds: [...complex.vertices],
      createdVertexIds: Object.keys(vertices),
      createdAt: '',
    },
  };

  return {
    shape: dualShape,
    complex: dualComplex,
    correspondence: {
      sourceFaceToDualVertex,
      dualVertexToSourceFace,
      sourceEdgeToDualEdge,
      dualEdgeToSourceEdge,
      sourceVertexToDualFace,
      dualFaceToSourceVertex,
    },
  };
}

// A throw-free probe for UI gating: {ok} or the refusal reason.
export function previewSurfaceDual(
  shape: Shape,
  options: SurfaceDualOptions = {},
): { ok: true } | { ok: false; reason: string } {
  try {
    surfaceDual(shape, options);
    return { ok: true };
  } catch (error) {
    return { ok: false, reason: (error as Error).message };
  }
}

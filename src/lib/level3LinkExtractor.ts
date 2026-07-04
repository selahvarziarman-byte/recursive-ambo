// level3LinkExtractor — level-3 Build 1: edge-links and vertex-links from ONE incidence.
//
// Everything here READS the flag algebra `faceIdentification.enact` built in its
// single pass (flag / end / corner classes) — the mothership's carried
// condition: the Lk_{Lk(v)}(w) = Lk(v, w) identity holds only if edge- and
// vertex-links derive consistently from one incidence. Nothing is re-derived
// from endpoint keys (the level-2 END-class lesson, one dimension up).
//
//   EDGE-LINK of an edge-class [e] — the graph of faces/cells AROUND the edge,
//   in the exact adjacency shape the committed `decomposeLink` consumes
//   (mirror of `buildVertexLinkAdjacency`, incidenceTraceRegistry.ts:605, one
//   dimension up):
//     link-vertices = FLAG classes (face-side-at-edge) of the member edges;
//     link-edges    = CELL WEDGES — in each cell, each member edge's two
//                     incident faces are joined through the cell's material.
//   A closed interior edge reads a single cycle ('interior'); a raw boundary
//   edge an arc ('boundary'); a pinched edge multiple strata ('junction').
//
//   VERTEX-LINK Lk(v) of a vertex-class [v] — the 2-complex:
//     V = END classes (edge-end at v) · E = CORNER classes (face-wedge at v) ·
//     F = CELL CORNERS (cell-wedge at v; never identified in Build 1).
//   Emitted with its χ = V − E + F and its connected-component count (over the
//   1-skeleton: corners join their face's two edge-ends at v; every link-face
//   is glued along corners, so 1-skeleton connectivity IS complex connectivity).
//
// DERIVE-ONLY: no topology math beyond incidence walking — the committed
// `decomposeLink` (consumed by the GATE, not here) stays the only recognizer.

import type { Level3Complex } from './faceIdentification';

export interface EdgeLinkReading {
  edgeClass: string;
  memberEdgeIds: string[];
  adjacency: Map<string, string[]>; // flag-class graph — decomposeLink's input shape
  linkVertexCount: number;
  linkEdgeCount: number; // cell wedges
}

// Every edge-class's link graph. In each cell, a member edge must lie on
// EXACTLY two of that cell's faces (a solid seed's boundary is a closed
// surface) — anything else is a malformed seed and throws loudly.
export function extractEdgeLinks(complex: Level3Complex): EdgeLinkReading[] {
  // face incidence per (cell, original edge): which original faces run along it
  const facesAtEdge = new Map<string, { faceId: string }[]>(); // `${cellId} ${edgeId}` -> faces
  for (const face of complex.originalFaces) {
    const n = face.cycle.length;
    for (let k = 0; k < n; k += 1) {
      const edgeId = complex.edgeOfFaceSlot(face.id, k);
      const key = `${face.cellId} ${edgeId}`;
      const list = facesAtEdge.get(key);
      if (list) list.push({ faceId: face.id });
      else facesAtEdge.set(key, [{ faceId: face.id }]);
    }
  }

  const byClass = new Map<string, { id: string; cellId: string }[]>();
  for (const edge of complex.originalEdges) {
    const root = complex.edgeClassOf(edge.id);
    const list = byClass.get(root);
    if (list) list.push({ id: edge.id, cellId: edge.cellId });
    else byClass.set(root, [{ id: edge.id, cellId: edge.cellId }]);
  }

  const readings: EdgeLinkReading[] = [];
  for (const [edgeClass, members] of byClass) {
    const adjacency = new Map<string, string[]>();
    const ensure = (x: string): string[] => {
      let list = adjacency.get(x);
      if (!list) {
        list = [];
        adjacency.set(x, list);
      }
      return list;
    };
    let linkEdgeCount = 0;
    for (const member of members) {
      const incident = facesAtEdge.get(`${member.cellId} ${member.id}`) ?? [];
      if (incident.length !== 2) {
        throw new Error(
          `level3LinkExtractor: edge ${member.id} lies on ${incident.length} faces of cell ${member.cellId} — a solid seed's boundary must give exactly 2`,
        );
      }
      // the CELL WEDGE joins the two face-flags of this cell at this edge
      const flagA = complex.flagClassOf(incident[0].faceId, member.id);
      const flagB = complex.flagClassOf(incident[1].faceId, member.id);
      ensure(flagA).push(flagB);
      ensure(flagB).push(flagA);
      linkEdgeCount += 1;
    }
    readings.push({
      edgeClass,
      memberEdgeIds: members.map((m) => m.id),
      adjacency,
      linkVertexCount: adjacency.size,
      linkEdgeCount,
    });
  }
  return readings;
}

export interface VertexLinkReading {
  vertexClass: string;
  memberVertexIds: string[];
  counts: { v: number; e: number; f: number }; // END classes / CORNER classes / cell corners
  chi: number; // V − E + F
  components: number; // over the 1-skeleton (corner arcs joining edge-ends)
}

export function extractVertexLinks(complex: Level3Complex): VertexLinkReading[] {
  const membersOf = new Map<string, string[]>();
  for (const v of complex.originalVertices) {
    const root = complex.vertexClassOf(v);
    const list = membersOf.get(root);
    if (list) list.push(v);
    else membersOf.set(root, [v]);
  }

  // per original vertex: its incident edge-ends and, per face, its two edges at
  // that corner (the corner arc) — read straight off the original incidence.
  const endsAtVertex = new Map<string, string[]>(); // vertex -> end classes (via endClassOf)
  for (const edge of complex.originalEdges) {
    for (const v of [edge.a, edge.b]) {
      const list = endsAtVertex.get(v);
      const endClass = complex.endClassOf(edge.id, v);
      if (list) list.push(endClass);
      else endsAtVertex.set(v, [endClass]);
    }
  }

  interface CornerArc {
    cornerClass: string;
    endIn: string; // end class of the face's incoming edge at the corner
    endOut: string; // end class of the outgoing edge
  }
  const cornersAtVertex = new Map<string, CornerArc[]>();
  for (const face of complex.originalFaces) {
    const n = face.cycle.length;
    for (let k = 0; k < n; k += 1) {
      const v = face.cycle[k];
      const eIn = complex.edgeOfFaceSlot(face.id, (k - 1 + n) % n); // prev -> v
      const eOut = complex.edgeOfFaceSlot(face.id, k); // v -> next
      const arc: CornerArc = {
        cornerClass: complex.cornerClassOf(face.id, v),
        endIn: complex.endClassOf(eIn, v),
        endOut: complex.endClassOf(eOut, v),
      };
      const list = cornersAtVertex.get(v);
      if (list) list.push(arc);
      else cornersAtVertex.set(v, [arc]);
    }
  }

  // cell corners per original vertex: one per (cell, vertex-on-cell) incidence.
  const cellCornersAtVertex = new Map<string, string[]>();
  for (const cell of complex.cells) {
    for (const v of cell.seed.vertexIds) {
      const list = cellCornersAtVertex.get(v);
      const key = `${cell.id} ${v}`;
      if (list) list.push(key);
      else cellCornersAtVertex.set(v, [key]);
    }
  }

  const readings: VertexLinkReading[] = [];
  for (const [vertexClass, members] of membersOf) {
    const endClasses = new Set<string>();
    const cornerClasses = new Set<string>();
    let cellCorners = 0;
    // 1-skeleton connectivity: union-find over end classes through corner arcs
    const parent = new Map<string, string>();
    const find = (x: string): string => {
      if (!parent.has(x)) parent.set(x, x);
      let root = x;
      while (parent.get(root) !== root) root = parent.get(root) as string;
      return root;
    };
    const union = (a: string, b: string): void => {
      parent.set(find(a), find(b));
    };
    for (const v of members) {
      for (const endClass of endsAtVertex.get(v) ?? []) {
        endClasses.add(endClass);
        find(endClass);
      }
      for (const arc of cornersAtVertex.get(v) ?? []) {
        cornerClasses.add(arc.cornerClass);
        union(arc.endIn, arc.endOut);
      }
      cellCorners += (cellCornersAtVertex.get(v) ?? []).length;
    }
    const componentRoots = new Set<string>();
    for (const endClass of endClasses) componentRoots.add(find(endClass));
    const counts = { v: endClasses.size, e: cornerClasses.size, f: cellCorners };
    readings.push({
      vertexClass,
      memberVertexIds: members,
      counts,
      chi: counts.v - counts.e + counts.f,
      components: componentRoots.size,
    });
  }
  return readings;
}

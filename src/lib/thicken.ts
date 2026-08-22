// thicken — THE ×I PRODUCT (A.1 rung 1; engineer-chartered 2026-07-18, sealed
// 039feb1b…82cae, natively measured; mothership: rung 1 delivers THE FIRST
// FORM BORN OF A FORM THE PERSON SELECTED OUT OF ANOTHER FORM).
//
// THE OP: A × I, cell-for-cell —
//   n_k(A×I) = 2·n_k(A) + n_{k−1}(A)
// Every cell `a` begets `a×0`, `a×1` (same dimension) and `a×I` (dim+1). The
// SIGNS are Leibniz, MINTED here and never endpoint-derived:
//   ∂(a×I) = (∂a)×I + (−1)^{dim a} · (a×1 − a×0)
// which for an edge e = (a,b) walks the prism quad [a×0, b×0, b×1, a×1]
// (e×0 forward, b×I up, e×1 backward, a×I down) — that cycle IS the sign law
// spelled as a boundary walk, and it is the only orientation this module
// mints.
//
// NO NEW FORM — the band over the person's lifted circle IS the annulus they
// can already glue from a square (glueFace(square, one pair) → V2E3F1; the
// level-2 tower is COMPLETE, so identical readings are a PROOF of sameness).
// A NEW ANCESTRY: the annulus-from-a-square is born of a SQUARE; the band
// from thicken(their lifted loop) is born of THEIR CIRCLE, and carries that
// birth-memory. The ancestry is what this module IS.
//
// IT IS A BIRTH (dim+1 — a boundary appears) BUT NON-CONSUMING: the
// projection π_A recovers the parent exactly, so the parent stays live —
// `product` fills the seat genealogyDag's doctrine held for it ("once it
// exists, `product`"); NO pentimento is ever minted for the parent. The
// LINEAGE is arity-1: the interval is a PARAMETER, not a form the person
// holds; a×0, a×1, a×I → a is a 3-to-1 CARRIER surjection, structurally
// refine's, and the ledger already speaks it as a pull-back — no new
// mechanism.
//
// THE BOUND IS A DOOR (LAW 14): a form carrying 3-cells is refused by name —
// "this form carries a 3-cell — a solid × a segment is a 4-manifold; this
// engine stops at 3." (R7, B-2026-08-24-B §4: the old sentence said "two
// surfaces" over operands that are a SOLID and a SEGMENT — the refusal now
// names what the person actually did.) The TWISTED I-bundle is NOT a
// product (twisted = product THEN identify) and no primitive for it exists
// here.
//
// RUNG 1 PINS THE INPUT THE PERSON CAN ACTUALLY HAND IT (her law): the
// engine's S¹ is an n-CYCLE (V3E3F0 — the lifted tetra-face rim), never the
// V1E1 self-loop (nGon(1) throws; no seed carries a self-loop; the direct
// bridge refuses self-loops anyway). V3E3F0 × I = V6 E9 F3, χ = 0.
//
// GAP2B (2026-07-23) — THE 8TH WORD, arity-2: `thicken(shape, segment)` — the
// person invokes the product on TWO forms they hold (the shape + their own
// lifted segment), like connected sum. The segment is Q1-GUARDED (a connected
// 1-manifold-with-boundary — two ends; the ONE place "must be a segment" is
// judged) and stays a CANONICAL factor: the prism, the Leibniz signs and the
// drawing offset are byte-for-byte the unary build — the offset is NEVER
// derived from the segment's length (that slot is a later cut). Lineage: the
// two-parent birth rides parentShapeId null (the connectedSum design — no
// single pointer crowns one parent) with both parents named on the record.
// The unary spelling remains for the committed callers (the lift door, the
// standing witnesses) and is byte-identical — so the "arity-1" doctrine above
// now reads: the CANONICAL interval is a parameter; a HELD segment is a
// parent.

import type { Cell, Edge, Face, Shape, Vertex, VertexId } from '../types/geometry';
import { createDefaultVertexData } from './shape';

export interface ThickenRecord {
  parentShapeId: string;
  // GAP2B: the arity-2 birth names BOTH parents (the shape and the segment);
  // absent on the unary spelling (the canonical-I parameter is not a parent)
  parents?: { shapeId: string; segmentId: string };
  // the 3-to-1 carrier surjection new→old: a×0, a×1, a×I ↦ a (old cells map
  // through their own generator; the interval is a parameter, not a parent)
  carrier: Record<string, string>;
  counts: { v: number; e: number; f: number; c: number };
}

export interface ThickenResult {
  shape: Shape;
  product: ThickenRecord;
}

const at0 = (id: string): string => `${id}@0`;
const at1 = (id: string): string => `${id}@1`;
const atI = (id: string): string => `${id}@I`;

// the ×1 copy is displaced along the loop's own plane normal (Newell), scaled
// by the mean edge length — deterministic, no ambient claim (a drawing offset)
const thickenOffset = (form: Shape): [number, number, number] => {
  const ids = Object.keys(form.vertices);
  let nx = 0;
  let ny = 0;
  let nz = 0;
  for (const edge of form.edges) {
    const [a, b] = edge.vertexIds;
    const p = form.vertices[a]?.position ?? [0, 0, 0];
    const q = form.vertices[b]?.position ?? [0, 0, 0];
    nx += (p[1] - q[1]) * (p[2] + q[2]);
    ny += (p[2] - q[2]) * (p[0] + q[0]);
    nz += (p[0] - q[0]) * (p[1] + q[1]);
  }
  const norm = Math.hypot(nx, ny, nz);
  let meanEdge = 0;
  for (const edge of form.edges) {
    const [a, b] = edge.vertexIds;
    const p = form.vertices[a]?.position ?? [0, 0, 0];
    const q = form.vertices[b]?.position ?? [0, 0, 0];
    meanEdge += Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
  }
  meanEdge = form.edges.length > 0 ? meanEdge / form.edges.length : 1;
  const scale = meanEdge > 0 ? meanEdge : 1;
  if (norm < 1e-12 || ids.length === 0) return [0, 0, scale];
  return [(nx / norm) * scale, (ny / norm) * scale, (nz / norm) * scale];
};

// Q1 — THE SEGMENT GATE (GAP2B; the ONE place "must be a segment" is judged —
// a later widening to dim(a)+dim(b) ≤ 3 replaces this predicate and nothing
// else): a connected 1-manifold-with-boundary — no faces, no cells, every
// vertex meets ≤ 2 edges, exactly two degree-1 ends, one piece. Rejects a
// faced form, a loop (no ends — a self-loop lands here too), a branched
// graph (a degree-3 vertex), dust, a disconnected union. Returns the refusing
// clause (dev-facing) or null when the form IS a segment.
export function segmentGateReason(form: Shape): string | null {
  if (form.faces.length > 0) return `carries ${form.faces.length} face(s) — a segment has none`;
  if (form.cells.length > 0) return `carries ${form.cells.length} cell(s) — a segment has none`;
  if (form.edges.length === 0) return 'carries no edge — a segment is one or more chained edges';
  const degree = new Map<string, number>();
  for (const id of Object.keys(form.vertices)) degree.set(id, 0);
  for (const edge of form.edges) {
    for (const v of edge.vertexIds) degree.set(v, (degree.get(v) ?? 0) + 1);
  }
  for (const [v, d] of degree) {
    if (d > 2) return `vertex ${v} meets ${d} edges — a segment never branches`;
  }
  const ends = [...degree.values()].filter((d) => d === 1).length;
  if (ends !== 2) return `has ${ends} free end(s) — a segment has exactly two (a loop has none)`;
  const adjacency = new Map<string, string[]>();
  for (const edge of form.edges) {
    const [a, b] = edge.vertexIds;
    adjacency.set(a, [...(adjacency.get(a) ?? []), b]);
    adjacency.set(b, [...(adjacency.get(b) ?? []), a]);
  }
  const all = Object.keys(form.vertices);
  const seen = new Set<string>([all[0]]);
  const queue = [all[0]];
  while (queue.length > 0) {
    const v = queue.shift() as string;
    for (const w of adjacency.get(v) ?? []) {
      if (!seen.has(w)) {
        seen.add(w);
        queue.push(w);
      }
    }
  }
  if (seen.size !== all.length) return 'is not connected — a segment is one piece';
  return null;
}

export function thicken(form: Shape, segment?: Shape, name?: string): ThickenResult {
  if (form.cells.length > 0) {
    throw new Error(
      'thicken: this form carries a 3-cell — a solid × a segment is a 4-manifold; this engine stops at 3.',
    );
  }
  if (segment !== undefined) {
    const refusal = segmentGateReason(segment);
    if (refusal !== null) {
      throw new Error(
        `thicken: the second operand must be a segment (a connected 1-manifold with boundary — two ends); this form ${refusal}`,
      );
    }
  }
  const shapeId = `shape:thicken:${form.id}`;
  const offset = thickenOffset(form);
  const carrier: Record<string, string> = {};

  const vertices: Record<VertexId, Vertex> = {};
  for (const [id, v] of Object.entries(form.vertices)) {
    for (const [copyId, pos] of [
      [at0(id), v.position],
      [at1(id), [v.position[0] + offset[0], v.position[1] + offset[1], v.position[2] + offset[2]]],
    ] as [string, [number, number, number]][]) {
      vertices[copyId] = {
        id: copyId,
        position: pos,
        // D12-b part 1 (engineer 1740, researcher-ratified): the ×I copy's
        // label is ABSENT — never the copy's own id (the manufacture this
        // cures), never the source's name (that would drop the level and
        // store a reading as a record). The empty label is the absence form:
        // it rides the snapshot namespacing verbatim (ids are prefixed,
        // labels are not), so absence is namespacing-invariant. Readers
        // resolve absence through `createdBy.sourceVertexIds` (presence-
        // first, lineage-on-absence — the ratified ruling).
        data: createDefaultVertexData(''),
        createdBy: {
          shapeId,
          operation: 'product',
          sourceVertexIds: [id],
        },
      };
      carrier[copyId] = id;
    }
  }

  const edges: Edge[] = [];
  // e×0, e×1 — the two levels of every parent edge
  for (const edge of form.edges) {
    const [a, b] = edge.vertexIds;
    edges.push({ id: at0(edge.id), vertexIds: [at0(a), at0(b)], sourceVertexIds: [at0(a), at0(b)] });
    edges.push({ id: at1(edge.id), vertexIds: [at1(a), at1(b)], sourceVertexIds: [at1(a), at1(b)] });
    carrier[at0(edge.id)] = edge.id;
    carrier[at1(edge.id)] = edge.id;
  }
  // v×I — the vertical edge over every parent vertex
  for (const id of Object.keys(form.vertices)) {
    edges.push({ id: atI(id), vertexIds: [at0(id), at1(id)], sourceVertexIds: [at0(id), at1(id)] });
    carrier[atI(id)] = id;
  }

  const faces: Face[] = [];
  // f×0, f×1 — the two levels of every parent face. P4 (2026-07-31): an
  // OWNED base face's cornerAngles RIDE VERBATIM to both copies (the same
  // corner cycle, level-mapped — alignment preserved); an un-owned base
  // stays un-owned (nothing fabricated).
  for (const face of form.faces) {
    const ride = face.cornerAngles ? { cornerAngles: [...face.cornerAngles] } : {};
    faces.push({ id: at0(face.id), vertexIds: face.vertexIds.map(at0), role: 'seed-face' as const, ...ride });
    faces.push({ id: at1(face.id), vertexIds: face.vertexIds.map(at1), role: 'seed-face' as const, ...ride });
    carrier[at0(face.id)] = face.id;
    carrier[at1(face.id)] = face.id;
  }
  // e×I — the prism quad over every parent edge, in the Leibniz orientation
  for (const edge of form.edges) {
    const [a, b] = edge.vertexIds;
    faces.push({
      id: atI(edge.id),
      vertexIds: [at0(a), at0(b), at1(b), at1(a)],
      role: 'seed-face' as const,
    });
    carrier[atI(edge.id)] = edge.id;
  }

  const cells: Cell[] = [];
  // f×I — the prism 3-cell over every parent face (rung 2's territory)
  for (const face of form.faces) {
    const rim = face.vertexIds;
    // side faces: the e×I prisms of every parent edge incident to the rim —
    // collected by INCIDENCE and DEDUPED, because a quotient rim (repeated
    // vertices) under-determines the slot→edge binding from the Shape alone
    // (the rim module's lesson); on faithful inputs this is exactly the
    // consecutive-pair walk
    const rimSet = new Set(rim);
    const sideFaceIds: string[] = [];
    for (const e of form.edges) {
      if (rimSet.has(e.vertexIds[0]) && rimSet.has(e.vertexIds[1]) && !sideFaceIds.includes(atI(e.id))) {
        sideFaceIds.push(atI(e.id));
      }
    }
    // P4 — THE CONFORMAL DIHEDRAL (2026-07-31): an OWNED base face lifts its
    // 2-D atom into the prism cell's per-edge dihedrals, KEYED:
    //   · VERTICAL pillar v×I → the base corner θ_v at that vertex — the
    //     face's corners WRAP-SUMMED over its slots citing v (a quotient rim
    //     may cite a class more than once; the cell's whole wedge at the
    //     pillar is their sum);
    //   · HORIZONTAL e×{0,1} → π/2 (the ⊥ product — wall meets floor),
    //     over the SAME incidence-collected side edges the cell's faces use.
    // Combinatorial only — no positions; an un-owned base leaves the cell
    // un-owned (nothing fabricated).
    let dihedralAngles: Record<string, number> | undefined;
    if (face.cornerAngles) {
      dihedralAngles = {};
      face.vertexIds.forEach((v, k) => {
        dihedralAngles![atI(v)] = (dihedralAngles![atI(v)] ?? 0) + (face.cornerAngles as number[])[k];
      });
      for (const sideId of sideFaceIds) {
        const parentEdgeId = sideId.slice(0, -'@I'.length);
        dihedralAngles[at0(parentEdgeId)] = Math.PI / 2;
        dihedralAngles[at1(parentEdgeId)] = Math.PI / 2;
      }
    }
    cells.push({
      id: atI(face.id),
      kind: 'core',
      generationDepth: form.genealogy.generationDepth + 1,
      parentCellId: null,
      sourceOperation: 'product',
      vertexIds: [...face.vertexIds.map(at0), ...face.vertexIds.map(at1)],
      faceIds: [at0(face.id), at1(face.id), ...sideFaceIds],
      sourceVertexIds: face.vertexIds,
      sourceEdgeIds: [],
      ...(dihedralAngles ? { dihedralAngles } : {}),
    });
    carrier[atI(face.id)] = face.id;
  }
  // old cells map to themselves through the parent (the carrier is total on
  // the CHILD; the parent's own cells are recovered by π_A, not listed here)

  const shape: Shape = {
    id: shapeId,
    name: name ?? `${form.name} × I`,
    vertices,
    edges,
    faces,
    cells,
    generations: [],
    genealogy: {
      // 2(b) (B-2026-08-22-C, mothership-ruled): the pointer NAMES THE BASE
      // at both arities — a thicken is `shape × segment → band` and the
      // band's meaning IS that operation on those operands, so the base is
      // not "crowned over" the segment: it is the metric operand the sealed
      // caption must find on the far side of a hop (the segment still rides
      // the product record below, which names both parents). The old
      // arity-2 null (the connectedSum spelling) left D1's thread rootless
      // — measured: the loader nulls an un-carried pointer, the hop starves
      // `readPillarDihedrals` of its operand, and the walk caption fell to
      // the k×90° heuristic on every shelf-routed band.
      parentShapeId: form.id,
      operation: 'product',
      generationDepth: form.genealogy.generationDepth + 1,
      sourceVertexIds: Object.keys(form.vertices),
      createdVertexIds: Object.keys(vertices),
      createdAt: '',
    },
  };

  return {
    shape,
    product: {
      parentShapeId: form.id,
      ...(segment !== undefined ? { parents: { shapeId: form.id, segmentId: segment.id } } : {}),
      carrier,
      counts: {
        v: Object.keys(vertices).length,
        e: edges.length,
        f: faces.length,
        c: cells.length,
      },
    },
  };
}

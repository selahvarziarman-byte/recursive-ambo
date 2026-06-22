// THE CASCADE DRIVER — step 2a: the identification closure (downward ∂ → fixpoint).
//
// ADR 0004: the systemic trace is a FIXPOINT CLOSURE — incidence FORCES, the
// certifiers CHECK. This module is the forcing engine: a full-dimensional seed of
// cell-identifications is run to a fixpoint by downward boundary-matching (F1). A
// match at dimension d unions the two d-cells and FORCES a match at each boundary
// (d−1)-cell pair; the recursion bottoms out at vertices (empty boundary).
//
// SCOPE (step 2a): the IDENTIFICATION closure ONLY — merges, μ, fixpoint, confluence
// (Case A combinatorics). The sign is RECORDED on every match/merge but NOT consumed:
// the face-2-colouring / w₁ is step 2b. NO removal (∂ᵀ), NO collapse, NO honesty
// overlay — steps 3–4. Later layers are added by ADDING, never by reshaping this.
//
// DERIVE-ONLY · committed modules UNCHANGED. Reuses faceEdgePairs / Edge.vertexIds.
// No Shape mutation. JOIN, not identify: the seed identifies the BOUNDARY (edges →
// vertices); the 2-cells are never in the seed, so faces SURVIVE. No cell is created.

import type { Edge, Face, Shape, VertexId } from '../types/geometry';
import { faceEdgePairs } from './surfaceOperations';

// A cell-identification carrying its attaching map (boundary correspondence) and sign.
export interface CellMatch {
  dim: number; // dimension of the identified cells (2 = face, 1 = edge, 0 = vertex)
  a: string; // the two cell ids identified (a ≡ b)
  b: string;
  boundary: Array<[string, string]>; // attaching map: each boundary cell of a ↦ matched boundary cell of b (one dim down)
  sign: 1 | -1; // orientation of the match (RECORDED; not consumed for w₁ in 2a)
}

export interface CascadeSeed {
  matches: CellMatch[];
}

// A forced merge with provenance: the chain of matches that forced it, and the sign.
export interface ForcedMerge {
  dim: number;
  a: string;
  b: string;
  sign: 1 | -1;
  path: string[]; // forcing path: the chain of `dim:a=b` labels from a seed match down to here
}

export interface CascadeTrace {
  partition: Record<number, string[][]>; // per-dimension union-find classes (each sorted; list sorted)
  forcedMerges: ForcedMerge[];
  mu: { before: number; after: number }; // total distinct cells across dimensions
  passes: number; // sweeps to reach the fixpoint (last sweep forces nothing)
}

// ---------------------------------------------------------------------------
// per-dimension union-find over cell ids
// ---------------------------------------------------------------------------
function makeUnionFind(ids: string[]) {
  const parent = new Map<string, string>();
  for (const id of ids) parent.set(id, id);
  const find = (x: string): string => {
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
  // returns true iff this call MERGED two distinct classes (a real forcing step)
  const union = (a: string, b: string): boolean => {
    const ra = find(a);
    const rb = find(b);
    if (ra === rb) return false;
    parent.set(ra, rb);
    return true;
  };
  const classCount = (): number => {
    const roots = new Set<string>();
    for (const id of parent.keys()) roots.add(find(id));
    return roots.size;
  };
  const classes = (): string[][] => {
    const byRoot = new Map<string, string[]>();
    for (const id of parent.keys()) {
      const root = find(id);
      (byRoot.get(root) ?? byRoot.set(root, []).get(root)!).push(id);
    }
    return [...byRoot.values()]
      .map((members) => [...members].sort((x, y) => x.localeCompare(y)))
      .sort((p, q) => (p[0] ?? '').localeCompare(q[0] ?? ''));
  };
  return { find, union, classCount, classes };
}

// ---------------------------------------------------------------------------
// the ∂ accessor (reuse committed helpers)
// ---------------------------------------------------------------------------
// boundaryOf(face) = its boundary edges, each as the REAL Edge id matched by vertexIds,
// oriented along the face cycle (from → to). boundaryOf(edge) = its two vertexIds.
function edgeKey(u: string, v: string): string {
  return [u, v].sort((a, b) => a.localeCompare(b)).join('|');
}

function boundaryOfFace(shape: Shape, face: Face): Array<{ id: string; from: VertexId; to: VertexId }> {
  const edgeByKey = new Map<string, Edge>();
  for (const edge of shape.edges) edgeByKey.set(edgeKey(edge.vertexIds[0], edge.vertexIds[1]), edge);
  return faceEdgePairs(face).map(([from, to]) => {
    const edge = edgeByKey.get(edgeKey(from, to));
    if (!edge) throw new Error(`boundaryOfFace: no real edge for ${from}..${to} on face ${face.id}`);
    return { id: edge.id, from, to };
  });
}

function boundaryOfEdge(shape: Shape, edgeId: string): [VertexId, VertexId] {
  const edge = shape.edges.find((e) => e.id === edgeId);
  if (!edge) throw new Error(`boundaryOfEdge: no edge ${edgeId}`);
  return [edge.vertexIds[0], edge.vertexIds[1]];
}

// Derive the boundary correspondence of a FORCED child match (one dimension down).
// dim 0 (vertices) → empty (terminal). dim 1 (edges) → align the two edges' endpoints
// honouring the parent sign (+1 preserving tail↦tail/head↦head, −1 reversing). The
// edge case is BUILT for the face→edge level (steps 2b/3) and is NOT exercised by
// Case A (which seeds edges, so every forced child is a vertex).
function deriveChildBoundary(
  shape: Shape,
  childDim: number,
  a: string,
  b: string,
  parentSign: 1 | -1,
): Array<[string, string]> {
  if (childDim <= 0) return []; // vertices are terminal — no boundary
  if (childDim === 1) {
    const [a0, a1] = boundaryOfEdge(shape, a);
    const [b0, b1] = boundaryOfEdge(shape, b);
    return parentSign === 1
      ? [[a0, b0], [a1, b1]]
      : [[a0, b1], [a1, b0]];
  }
  return [];
}

// ---------------------------------------------------------------------------
// the closure to a fixpoint (F1 boundary-matching)
// ---------------------------------------------------------------------------
interface QueuedMatch extends CellMatch {
  path: string[];
}

export function runCascade(shape: Shape, seedFaces: Face[], seed: CascadeSeed): CascadeTrace {
  // The cell universe = the cells of the seed 2-cells (faces, their boundary edges,
  // their vertices). μ is measured over THIS subcomplex.
  const faceIds = [...new Set(seedFaces.map((f) => f.id))];
  const edgeIds = [
    ...new Set(seedFaces.flatMap((f) => boundaryOfFace(shape, f).map((e) => e.id))),
  ];
  const vertexIds = [...new Set(seedFaces.flatMap((f) => [...f.vertexIds]))];

  const uf: Record<number, ReturnType<typeof makeUnionFind>> = {
    0: makeUnionFind(vertexIds),
    1: makeUnionFind(edgeIds),
    2: makeUnionFind(faceIds),
  };
  const muBefore = faceIds.length + edgeIds.length + vertexIds.length;

  const label = (m: { dim: number; a: string; b: string }): string => `${m.dim}:${m.a}=${m.b}`;
  const forcedMerges: ForcedMerge[] = [];

  // Seed the work-list; each item carries its forcing path (provenance).
  const queue: QueuedMatch[] = seed.matches.map((m) => ({ ...m, path: [label(m)] }));

  let passes = 0;
  let changed = true;
  while (changed) {
    passes += 1;
    changed = false;
    while (queue.length) {
      const m = queue.shift() as QueuedMatch;
      const dimUf = uf[m.dim];
      if (!dimUf) continue; // out-of-range dimension — defensive (never in Case A)
      const merged = dimUf.union(m.a, m.b);
      if (!merged) continue; // already identified — forces nothing further (idempotent)
      changed = true;
      forcedMerges.push({ dim: m.dim, a: m.a, b: m.b, sign: m.sign, path: m.path });
      // FORCE each boundary pair one dimension down (downward ∂ only).
      for (const [ba, bb] of m.boundary) {
        const childDim = m.dim - 1;
        const childBoundary = deriveChildBoundary(shape, childDim, ba, bb, m.sign);
        const childSign: 1 | -1 = (m.sign * 1) as 1 | -1; // sign composes (trivially at the vertex level)
        const child: QueuedMatch = {
          dim: childDim,
          a: ba,
          b: bb,
          boundary: childBoundary,
          sign: childSign,
          path: [...m.path, label({ dim: childDim, a: ba, b: bb })],
        };
        queue.push(child);
      }
    }
    // Re-sweep: re-enqueue the seed to confirm the fixpoint (an extra sweep must force
    // nothing new). If the productive pass changed anything, run one confirming sweep.
    if (changed) {
      for (const m of seed.matches) queue.push({ ...m, path: [label(m)] });
    }
  }

  const muAfter = uf[2].classCount() + uf[1].classCount() + uf[0].classCount();
  return {
    partition: { 0: uf[0].classes(), 1: uf[1].classes(), 2: uf[2].classes() },
    forcedMerges,
    mu: { before: muBefore, after: muAfter },
    passes,
  };
}

// ---------------------------------------------------------------------------
// seed builders — JOIN two disjoint faces by a boundary correspondence φ
// ---------------------------------------------------------------------------
// φ aligns F1's oriented boundary cycle to F2's: rotation (index-preserving, sign +1)
// or reflection (index-reversing, sign −1). Each F1 boundary edge is matched to the F2
// edge spanning the corresponded vertices, carrying the vertex correspondence as its
// attaching map. The 2-cells are NOT in the seed — faces survive (JOIN, not identify).
export function buildJoinSeed(
  shape: Shape,
  f1: Face,
  f2: Face,
  mode: 'rotation' | 'reflection',
): CascadeSeed {
  const v1 = f1.vertexIds;
  const v2 = f2.vertexIds;
  const n = v1.length;
  const e1 = boundaryOfFace(shape, f1);
  const e2 = boundaryOfFace(shape, f2);
  const e2ByKey = new Map<string, { id: string }>();
  for (const e of e2) e2ByKey.set(edgeKey(e.from, e.to), e);

  const phi = (i: number): number => (mode === 'rotation' ? i % n : (n - i) % n);
  const sign: 1 | -1 = mode === 'rotation' ? 1 : -1;

  const matches: CellMatch[] = [];
  for (let i = 0; i < n; i += 1) {
    const wi = v2[phi(i)];
    const wNext = v2[phi(i + 1)];
    const f2Edge = e2ByKey.get(edgeKey(wi, wNext));
    if (!f2Edge) throw new Error(`buildJoinSeed: no F2 edge for ${wi}..${wNext}`);
    matches.push({
      dim: 1,
      a: e1[i].id,
      b: f2Edge.id,
      boundary: [
        [v1[i], wi],
        [v1[(i + 1) % n], wNext],
      ],
      sign,
    });
  }
  return { matches };
}

// SELF-GLUE seed (step 2b, Case B): glue ONE pair of OPPOSITE boundary edges of a
// SINGLE face to each other (the 2-cell survives — a self-glue of its boundary, not a
// 2-cell merge). `control` (sign +1, crossed correspondence) → cylinder; `flip`
// (sign −1, parallel correspondence) → Möbius. The two modes differ ONLY in which
// vertex correspondence the one edge-match carries (the sign); the merge-count / μ /
// fixpoint are identical, but the resulting partition orients the doubly-met edge
// oppositely (cylinder) vs identically (Möbius).
export function buildSelfGlueSeed(
  shape: Shape,
  face: Face,
  mode: 'control' | 'flip',
): CascadeSeed {
  const v = face.vertexIds;
  const n = v.length;
  const edges = boundaryOfFace(shape, face);
  const opp = Math.floor(n / 2); // the opposite edge index (square: 2)
  const e0 = edges[0]; // (v[0], v[1])
  const eOpp = edges[opp]; // (v[opp], v[opp+1])
  const sign: 1 | -1 = mode === 'control' ? 1 : -1;
  // control = crossed (cylinder): v0 ↦ v[opp+1], v1 ↦ v[opp]  (antiparallel seam)
  // flip    = parallel (Möbius):  v0 ↦ v[opp],   v1 ↦ v[opp+1] (parallel seam)
  const boundary: Array<[string, string]> =
    mode === 'control'
      ? [
          [v[0], v[(opp + 1) % n]],
          [v[1], v[opp]],
        ]
      : [
          [v[0], v[opp]],
          [v[1], v[(opp + 1) % n]],
        ];
  return { matches: [{ dim: 1, a: e0.id, b: eOpp.id, boundary, sign }] };
}

// ---------------------------------------------------------------------------
// step 2b — the orientation overlay (Q2: the face-orientation 2-colouring of w₁)
// ---------------------------------------------------------------------------
// The cascade's w₁ is the FACE-ORIENTATION 2-COLOURING (a parity-union-find over the
// surviving faces via their shared interior edges, self-loops included) — NOT a
// boundary-cycle sign-product (Q2 ruled that degenerate for shared boundaries; this
// module never calls P8's surface-zoo sign-product certifier). Two faces meeting an
// interior edge in OPPOSITE induced directions are already consistent (the river-banks
// rule, parity 0);
// SAME direction means one must flip (parity 1). w₁ = 1 iff the colouring is forced
// into a contradiction — an odd cycle of constraints, OR a single face forced opposite
// to itself (a parity-1 self-loop, the Möbius signature). The induced direction is read
// off each face's oriented boundary (faceEdgePairs) mapped through the cascade
// partition (the partition carries the seed sign's effect).

export interface OrientationCert {
  w1: 0 | 1; // 0 = orientable (2-colouring consistent); 1 = non-orientable (a contradiction)
  nonOrientable: boolean; // === (w1 === 1)
  conflict: { edgeClass: string; faces: [string, string] } | null; // the first conflicting edge-class
}

// parity-union-find: each node carries a parity bit relative to its class root.
function makeParityUnionFind(nodes: string[]) {
  const parent = new Map<string, string>();
  const parity = new Map<string, 0 | 1>(); // parity from node to its parent
  for (const x of nodes) {
    parent.set(x, x);
    parity.set(x, 0);
  }
  const find = (x: string): { root: string; par: 0 | 1 } => {
    const p = parent.get(x) as string;
    if (p === x) return { root: x, par: 0 };
    const up = find(p);
    const composed = ((parity.get(x) as number) ^ up.par) as 0 | 1;
    parent.set(x, up.root);
    parity.set(x, composed);
    return { root: up.root, par: composed };
  };
  // union a,b with required relative parity `rel`. Returns false on contradiction.
  const union = (a: string, b: string, rel: 0 | 1): boolean => {
    const fa = find(a);
    const fb = find(b);
    if (fa.root === fb.root) {
      return ((fa.par ^ fb.par) as 0 | 1) === rel; // already related — must agree
    }
    parent.set(fa.root, fb.root);
    parity.set(fa.root, ((fa.par ^ rel ^ fb.par) as 0 | 1));
    return true;
  };
  return { find, union };
}

export function certifyCascadeOrientation(
  shape: Shape,
  seedFaces: Face[],
  trace: CascadeTrace,
): OrientationCert {
  // class representatives (sorted-first member) per dimension.
  const rootOf = (classes: string[][], id: string): string => {
    for (const cls of classes) if (cls.includes(id)) return cls[0];
    return id;
  };
  const vertexClassOf = (v: string): string => rootOf(trace.partition[0], v);
  const edgeClassOf = (e: string): string => rootOf(trace.partition[1], e);
  const faceClassOf = (f: string): string => rootOf(trace.partition[2], f);

  const edgeByKey = new Map<string, Edge>();
  for (const edge of shape.edges) edgeByKey.set(edgeKey(edge.vertexIds[0], edge.vertexIds[1]), edge);

  // gather, per edge-class, the (face, induced direction) traversals.
  const traversals = new Map<string, Array<{ face: string; dir: [string, string] }>>();
  for (const face of seedFaces) {
    const faceNode = faceClassOf(face.id);
    for (const [from, to] of faceEdgePairs(face)) {
      const realEdge = edgeByKey.get(edgeKey(from, to));
      if (!realEdge) continue;
      const eClass = edgeClassOf(realEdge.id);
      const dir: [string, string] = [vertexClassOf(from), vertexClassOf(to)];
      (traversals.get(eClass) ?? traversals.set(eClass, []).get(eClass)!).push({ face: faceNode, dir });
    }
  }

  const faceNodes = [...new Set(seedFaces.map((f) => faceClassOf(f.id)))];
  const puf = makeParityUnionFind(faceNodes);

  let w1: 0 | 1 = 0;
  let conflict: OrientationCert['conflict'] = null;
  for (const eClass of [...traversals.keys()].sort()) {
    const recs = traversals.get(eClass) as Array<{ face: string; dir: [string, string] }>;
    if (recs.length !== 2) continue; // boundary (1 traversal) — no orientation constraint
    const [r1, r2] = recs;
    const same = r1.dir[0] === r2.dir[0] && r1.dir[1] === r2.dir[1];
    const rel: 0 | 1 = same ? 1 : 0; // same induced direction → must flip (1); opposite → consistent (0)
    if (r1.face === r2.face) {
      // self-loop: a single face meeting the edge twice. parity-1 → Möbius (a face forced opposite to itself).
      if (rel === 1 && w1 === 0) {
        w1 = 1;
        conflict = { edgeClass: eClass, faces: [r1.face, r2.face] };
      }
    } else {
      const consistent = puf.union(r1.face, r2.face, rel);
      if (!consistent && w1 === 0) {
        w1 = 1;
        conflict = { edgeClass: eClass, faces: [r1.face, r2.face] };
      }
    }
  }

  return { w1, nonOrientable: w1 === 1, conflict };
}

// ---------------------------------------------------------------------------
// step 3 — the REMOVAL closure (∂ᵀ — strictly UPWARD, the dual of the 2a closure)
// ---------------------------------------------------------------------------
// The mirror image of the identification closure: a cut REMOVES a cell and FORCES the
// removal of every COFACE (a cell one dimension UP whose ∂ contains the cut cell) —
// cut an edge, its faces fall; cut a vertex, its edges fall. Strictly upward (d → d+1):
// a cut NEVER touches a cell's own boundary (cutting an edge keeps its endpoints).
// Faces have no coface in the universe → terminal. No cell is created; μ strictly
// decreases by exactly |removed|. The 2a `runCascade` is NOT reused — this is its dual.

export interface ForcedRemoval {
  dim: number; // dimension of the removed cell (2 = face, 1 = edge, 0 = vertex)
  cell: string; // the removed cell id
  path: string[]; // provenance: the chain of `d:cell` labels from a seed cut UP to here
}

export interface RemovalTrace {
  removed: Record<number, string[]>; // per-dimension removed cell ids (each list sorted)
  forcedRemovals: ForcedRemoval[]; // every removal (seed cuts + forced cofaces) with its path
  mu: { before: number; after: number };
  passes: number; // sweeps to the fixpoint (last sweep removes nothing new)
}

export function runCutCascade(shape: Shape, seedFaces: Face[], cuts: string[]): RemovalTrace {
  // Universe = the SAME subcomplex as runCascade (faces + boundary edges + vertices).
  const faceIds = new Set(seedFaces.map((f) => f.id));
  const edgeList = [...new Set(seedFaces.flatMap((f) => boundaryOfFace(shape, f).map((e) => e.id)))];
  const edgeIds = new Set(edgeList);
  const vertexIds = new Set(seedFaces.flatMap((f) => [...f.vertexIds]));
  const muBefore = faceIds.size + edgeIds.size + vertexIds.size;

  const dimOf = (id: string): number =>
    faceIds.has(id) ? 2 : edgeIds.has(id) ? 1 : vertexIds.has(id) ? 0 : -1;

  // coface maps (within the universe): edge → its faces; vertex → its edges.
  const edgeToFaces = new Map<string, string[]>();
  for (const f of seedFaces) {
    for (const e of boundaryOfFace(shape, f)) {
      (edgeToFaces.get(e.id) ?? edgeToFaces.set(e.id, []).get(e.id)!).push(f.id);
    }
  }
  const vertexToEdges = new Map<string, string[]>();
  for (const edgeId of edgeIds) {
    const [u, v] = boundaryOfEdge(shape, edgeId);
    if (vertexIds.has(u)) (vertexToEdges.get(u) ?? vertexToEdges.set(u, []).get(u)!).push(edgeId);
    if (vertexIds.has(v)) (vertexToEdges.get(v) ?? vertexToEdges.set(v, []).get(v)!).push(edgeId);
  }
  const cofaceOf = (id: string, d: number): string[] => {
    if (d === 1) return [...new Set(edgeToFaces.get(id) ?? [])]; // edge → faces
    if (d === 0) return [...new Set(vertexToEdges.get(id) ?? [])]; // vertex → edges
    return []; // face → no coface in this universe (terminal)
  };

  const label = (d: number, id: string): string => `${d}:${id}`;
  const removed = new Set<string>();
  const forcedRemovals: ForcedRemoval[] = [];
  interface QueuedRemoval {
    dim: number;
    cell: string;
    path: string[];
  }
  const seedQueue = (): QueuedRemoval[] =>
    cuts.map((c) => ({ dim: dimOf(c), cell: c, path: [label(dimOf(c), c)] }));
  const queue: QueuedRemoval[] = seedQueue();

  let passes = 0;
  let changed = true;
  while (changed) {
    passes += 1;
    changed = false;
    while (queue.length) {
      const item = queue.shift() as QueuedRemoval;
      if (removed.has(item.cell)) continue; // already removed — idempotent
      removed.add(item.cell);
      changed = true;
      forcedRemovals.push({ dim: item.dim, cell: item.cell, path: item.path });
      // FORCE every coface one dimension UP (strictly upward ∂ᵀ).
      for (const coface of cofaceOf(item.cell, item.dim)) {
        const cofaceDim = item.dim + 1;
        queue.push({
          dim: cofaceDim,
          cell: coface,
          path: [...item.path, label(cofaceDim, coface)],
        });
      }
    }
    if (changed) for (const q of seedQueue()) queue.push(q); // confirming re-sweep
  }

  const removedByDim: Record<number, string[]> = { 0: [], 1: [], 2: [] };
  for (const id of removed) {
    const d = dimOf(id);
    if (d >= 0) removedByDim[d].push(id);
  }
  for (const d of [0, 1, 2]) removedByDim[d].sort((a, b) => a.localeCompare(b));
  const muAfter =
    faceIds.size - removedByDim[2].length +
    (edgeIds.size - removedByDim[1].length) +
    (vertexIds.size - removedByDim[0].length);

  return { removed: removedByDim, forcedRemovals, mu: { before: muBefore, after: muAfter }, passes };
}

// ---------------------------------------------------------------------------
// step 3 — the OP-SET INVARIANT (Q4): classify by forcing-path dimension monotonicity
// ---------------------------------------------------------------------------
// Each forcing path moves by exactly ∓1 per hop. All paths strictly DECREASING →
// 'pure-∂' (the identification closure); all strictly INCREASING → 'pure-∂ᵀ' (the
// removal closure). Anything else — a hop ≠ ∓1, an internally mixed path, or both
// directions present across paths — is an UNCLASSIFIED op and THROWS. The
// dimension-disjoint hybrid (collapse) is DEFERRED; failing loudly is the sealed
// behaviour for now. Single-element paths (a seed cell, no hop) are vacuous.
export type OpClass = 'pure-∂' | 'pure-∂ᵀ';

export function assertOpSet(forcingPaths: number[][]): OpClass {
  const unclassified = 'op-set: unclassified op (neither pure-∂ nor pure-∂ᵀ)';
  let direction = 0; // -1 = decreasing (∂), +1 = increasing (∂ᵀ), 0 = unset
  for (const path of forcingPaths) {
    for (let i = 1; i < path.length; i += 1) {
      const hop = path[i] - path[i - 1];
      if (hop !== 1 && hop !== -1) throw new Error(unclassified); // not a unit hop
      const dir = hop > 0 ? 1 : -1;
      if (direction === 0) direction = dir;
      else if (direction !== dir) throw new Error(unclassified); // both directions present
    }
  }
  if (direction === 1) return 'pure-∂ᵀ';
  return 'pure-∂'; // direction === -1, or vacuous (all single-element paths) → the ∂ identity
}

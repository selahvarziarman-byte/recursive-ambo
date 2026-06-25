// THE FIFTH NECESSITY — the global w₁ class on an H₁ cycle basis of the SUBDIVIDED
// assembled complex (mothership necessity 5, ADR 0011, amended 2026-06-23 with the
// researcher's representation ruling).
//
// CERTIFIER-ONLY · DERIVE-ONLY. No operation is touched, no Shape is mutated; the
// barycentric subdivision below lives entirely on a working copy. This module imports
// NOTHING from the committed engine — it is a pure function of an `AssembledComplex`.
//
// THE TRAP IS THE REPRESENTATION, NOT THE OPERATOR (the researcher's ruling). On the
// committed single-face square, RP²'s two edge-classes share BOTH endpoints, so any
// equal-valued w₁ cochain on them is a Z/2 COBOUNDARY → RP² reads orientable (the
// "two-flips-in-one-cycle → 0" WRONG case sealed at diagnose-level2-zoo.cjs:263–266).
// A non-degenerate SUBDIVISION (each edge-class split by a fresh midpoint, met by ≥2
// distinct sub-corners) breaks the degeneracy: the 2-colouring frustration on the
// subdivided triangulation is the genuine w₁ (grounded on RP²₆). The §W-teeth seal
// reproduces the trap: the SAME pipeline on the RAW single face yields w1Class === [0].
//
// THREE THINGS DONE RIGHT (so we neither rebuild a degeneracy nor mis-size the basis):
//  (1) H₁, NOT the raw graph cycle space. b₁ = dim ker∂₁ − dim im∂₂ over Z/2 — the
//      face boundaries are quotiented out. The "spanning-forest + non-tree-edges"
//      shorthand computes Z₁ and OVER-COUNTS (cylinder/Möbius Z₁=2 but b₁=1; and on the
//      subdivision every surface's Z₁ is large). b₁ is sealed per surface — falsifiable.
//  (2) The cochain is the INDUCED-DIRECTION 2-colouring frustration (the IDEA of
//      `certifyCascadeOrientation`, generalised to the full cochain), NOT a per-pair OR
//      and NOT a seam pair-sign. `rel = 1` iff two 2-cells induce the SAME direction on
//      a shared edge (cannot be co-oriented — frustrated); `rel = 0` is the river-banks
//      (already coherent) case.
//  (3) The frustration is assembled into a genuine PRIMAL 1-COCYCLE φ via per-vertex
//      star transport of a local orientation (δφ vanishes on every triangle — see
//      `cochainPhi`), so `w₁(γ) = Σ_{e∈γ} φ(e) (mod 2)` is well-defined on H₁ (it
//      vanishes on boundaries). The raw frustration-relative-to-a-spanning-tree is only
//      a DUAL cocycle; pairing it directly against primal H₁ cycles would be the wrong
//      pairing. φ pairs correctly.
//
// THE DELIVERABLE — the SORTED multiset {w₁(basis cycle)}, presented in its CANONICAL
// (rank-revealing) form: w₁ ∈ H¹ is a SINGLE Z/2 functional on H₁, so as a functional
// it has rank 0 (orientable) or 1 (non-orientable). The sorted multiset on an arbitrary
// basis is NOT invariant (Klein could read [0,1] or [1,1]); reduced to the functional's
// rank it IS invariant: orientable → [0]×b₁; non-orientable → [0]×(b₁−1) ++ [1]. That
// canonical multiset is what necessity (5) seals.

// ---------------------------------------------------------------------------
// public surface
// ---------------------------------------------------------------------------

export interface AssembledComplex {
  vertices: string[]; // support ids (the 0-cells / vertex-classes)
  edges: Array<{ id: string; u: string; v: string }>; // edge-classes with endpoint supports
  faces: Array<{ boundary: Array<{ edge: string; dir: 1 | -1 }> }>; // each face's oriented boundary word over edge-classes
}

export interface GlobalW1Cert {
  b1: number; // dim H₁ of the assembled complex (= dim ker∂₁ − dim im∂₂ over Z/2)
  w1Class: number[]; // SORTED canonical multiset of per-H₁-basis-cycle w₁ ∈ {0,1}
  nonOrientable: boolean; // === w1Class.some(v => v === 1)
  nonDegenerate: boolean; // every original edge-class met by ≥2 distinct sub-corners on the subdivision
}

export interface GlobalW1Debug {
  cellCounts: { v: number; e: number; t: number }; // subdivision sub-vertices, sub-edges, 2-cells
  euler: number; // v − e + t of the working complex (χ — a structural cross-check)
  basisCycles: string[][]; // each H₁ basis cycle as its list of (sub-)edge ids
  perCycleW1: number[]; // w₁ per basis cycle BEFORE canonicalisation (for eyeballing)
  crossCheckOrientable: boolean; // independent global 2-colouring verdict (must agree with !nonOrientable)
}

export interface GlobalW1Options {
  subdivide?: boolean; // default true; false = run the SAME pipeline on the RAW complex (the §W-teeth trap)
}

export function globalW1Class(complex: AssembledComplex, options?: GlobalW1Options): GlobalW1Cert {
  return analyzeGlobalW1(complex, options).cert;
}

export function analyzeGlobalW1(
  complex: AssembledComplex,
  options?: GlobalW1Options,
): { cert: GlobalW1Cert; debug: GlobalW1Debug } {
  const subdivide = options?.subdivide ?? true;
  const working = subdivide ? barycentricSubdivision(complex) : rawWorking(complex);
  return analyzeWorking(working, complex, subdivide);
}

// ---------------------------------------------------------------------------
// the working complex (after the OPTIONAL subdivision) — a derive-only copy
// ---------------------------------------------------------------------------
// A 2-cell is its oriented boundary word over working-edge ids; a working-edge carries
// its canonical endpoints (u,v) so a traversal x→y reads as dir +1 (x==u) or −1.

interface WEdge {
  id: string;
  u: string;
  v: string;
}
interface WCell {
  id: string;
  word: Array<{ edge: string; dir: 1 | -1 }>;
}
interface Working {
  verts: string[];
  edges: WEdge[];
  cells: WCell[];
}

// A small edge registry: the FIRST traversal that touches an edge id fixes its canonical
// (u,v); later traversals read their direction relative to that.
class EdgeRegistry {
  private map = new Map<string, WEdge>();
  ensure(id: string, x: string, y: string): WEdge {
    let e = this.map.get(id);
    if (!e) {
      e = { id, u: x, v: y };
      this.map.set(id, e);
    }
    return e;
  }
  dir(id: string, x: string, y: string): 1 | -1 {
    const e = this.map.get(id) as WEdge;
    return e.u === x && e.v === y ? 1 : -1;
  }
  list(): WEdge[] {
    return [...this.map.values()];
  }
}

// (a) BARYCENTRIC SUBDIVISION (the load-bearing fix). Per face: one barycenter; per
// edge-class: one shared midpoint (the identification applied consistently — identified
// edge-classes ⇒ identified midpoints/half-edges); each n-gon → 2n triangles. The
// boundary half-edges are SHARED between the two faces meeting an edge-class (so the
// surface glues up), yet a self-loop's two halves stay DISTINCT (named by the edge's
// canonical endpoint u/v) — that distinction is exactly the non-degeneracy that breaks
// the single-face coboundary trap.
function barycentricSubdivision(complex: AssembledComplex): Working {
  const edgeOf = new Map(complex.edges.map((e) => [e.id, e]));
  const reg = new EdgeRegistry();
  const verts = new Set<string>();
  const cells: WCell[] = [];

  complex.faces.forEach((face, fi) => {
    const bar = `B:${fi}`;
    verts.add(bar);
    const n = face.boundary.length;
    face.boundary.forEach((slot, p) => {
      const e = edgeOf.get(slot.edge);
      if (!e) throw new Error(`globalW1: face ${fi} slot ${p} references unknown edge ${slot.edge}`);
      const tailSupport = slot.dir === 1 ? e.u : e.v;
      const headSupport = slot.dir === 1 ? e.v : e.u;
      const vTail = `V:${tailSupport}`;
      const vHead = `V:${headSupport}`;
      const mid = `M:${e.id}`;
      verts.add(vTail);
      verts.add(vHead);
      verts.add(mid);

      // the two boundary half-edges, named by the edge-class's CANONICAL endpoint so the
      // two faces meeting this edge share them, and a self-loop's halves stay distinct.
      const heTail = `HE:${e.id}:${slot.dir === 1 ? 'u' : 'v'}`; // half at the tail corner
      const heHead = `HE:${e.id}:${slot.dir === 1 ? 'v' : 'u'}`; // half at the head corner
      // radial-to-corner edges are shared between adjacent slots → id by CORNER position.
      const rcTail = `RC:${fi}:${p}`; // radial to corner p (this slot's tail)
      const rcHead = `RC:${fi}:${(p + 1) % n}`; // radial to corner p+1 (this slot's head)
      const rm = `RM:${fi}:${p}`; // radial to this slot's midpoint (shared by the slot's two triangles)

      // tail triangle (vTail, mid, bar): boundary vTail→mid→bar→vTail
      reg.ensure(heTail, vTail, mid);
      reg.ensure(rm, mid, bar);
      reg.ensure(rcTail, bar, vTail);
      cells.push({
        id: `T:${fi}:${p}:t`,
        word: [
          { edge: heTail, dir: reg.dir(heTail, vTail, mid) },
          { edge: rm, dir: reg.dir(rm, mid, bar) },
          { edge: rcTail, dir: reg.dir(rcTail, bar, vTail) },
        ],
      });

      // head triangle (mid, vHead, bar): boundary mid→vHead→bar→mid
      reg.ensure(heHead, vHead, mid);
      reg.ensure(rcHead, bar, vHead);
      cells.push({
        id: `T:${fi}:${p}:h`,
        word: [
          { edge: heHead, dir: reg.dir(heHead, mid, vHead) },
          { edge: rcHead, dir: reg.dir(rcHead, vHead, bar) },
          { edge: rm, dir: reg.dir(rm, bar, mid) },
        ],
      });
    });
  });

  return { verts: [...verts], edges: reg.list(), cells };
}

// the RAW (un-subdivided) working complex — the original faces ARE the 2-cells. Used by
// the §W-teeth trap to show the single-face representation reads orientable.
function rawWorking(complex: AssembledComplex): Working {
  const reg = new EdgeRegistry();
  const verts = new Set<string>();
  for (const v of complex.vertices) verts.add(`V:${v}`);
  for (const e of complex.edges) reg.ensure(e.id, `V:${e.u}`, `V:${e.v}`);
  const cells: WCell[] = complex.faces.map((face, fi) => ({
    id: `F:${fi}`,
    word: face.boundary.map((slot) => {
      const e = complex.edges.find((x) => x.id === slot.edge);
      if (!e) throw new Error(`globalW1: raw face ${fi} references unknown edge ${slot.edge}`);
      const x = `V:${e.u}`;
      const y = `V:${e.v}`;
      // slot.dir is relative to the edge-class canonical (u,v); the raw working-edge
      // shares that canonical, so the direction carries through unchanged.
      reg.ensure(e.id, x, y);
      return { edge: e.id, dir: slot.dir };
    }),
  }));
  return { verts: [...verts], edges: reg.list(), cells };
}

// ---------------------------------------------------------------------------
// GF(2) linear algebra (tiny dense — the complexes here are small)
// ---------------------------------------------------------------------------
function xorInto(a: Uint8Array, b: Uint8Array): void {
  for (let i = 0; i < a.length; i += 1) a[i] ^= b[i];
}
function leadCol(v: Uint8Array): number {
  for (let c = 0; c < v.length; c += 1) if (v[c]) return c;
  return -1;
}
// reduce v modulo a forward-echelon basis (each basis row owns a distinct pivot column).
function reduceMod(v: Uint8Array, basis: Uint8Array[], pivotOf: number[]): Uint8Array {
  const x = v.slice();
  for (let i = 0; i < basis.length; i += 1) if (x[pivotOf[i]]) xorInto(x, basis[i]);
  return x;
}
// row-reduce to RREF; return pivot columns and the reduced (non-zero) rows.
function rref(rows: Uint8Array[], nCols: number): { pivotCols: number[]; rows: Uint8Array[] } {
  const R = rows.map((r) => r.slice());
  const pivotCols: number[] = [];
  let pr = 0;
  for (let c = 0; c < nCols && pr < R.length; c += 1) {
    let piv = -1;
    for (let r = pr; r < R.length; r += 1)
      if (R[r][c]) {
        piv = r;
        break;
      }
    if (piv < 0) continue;
    const tmp = R[pr];
    R[pr] = R[piv];
    R[piv] = tmp;
    for (let r = 0; r < R.length; r += 1) if (r !== pr && R[r][c]) xorInto(R[r], R[pr]);
    pivotCols.push(c);
    pr += 1;
  }
  return { pivotCols, rows: R.slice(0, pr) };
}
// a basis of { x ∈ GF2^nCols : M x = 0 } from the V×nCols matrix M (given as rows).
function nullspace(rowsMatrix: Uint8Array[], nCols: number): Uint8Array[] {
  if (nCols === 0) return [];
  const { pivotCols, rows } = rref(rowsMatrix, nCols);
  const pivotSet = new Set(pivotCols);
  const basis: Uint8Array[] = [];
  for (let f = 0; f < nCols; f += 1) {
    if (pivotSet.has(f)) continue;
    const x = new Uint8Array(nCols);
    x[f] = 1;
    for (let i = 0; i < pivotCols.length; i += 1) if (rows[i][f]) x[pivotCols[i]] = 1;
    basis.push(x);
  }
  return basis;
}

// ---------------------------------------------------------------------------
// the analysis — H₁ basis, the φ cocycle, the canonical w₁ multiset
// ---------------------------------------------------------------------------
function analyzeWorking(
  working: Working,
  original: AssembledComplex,
  subdivided: boolean,
): { cert: GlobalW1Cert; debug: GlobalW1Debug } {
  const { verts, edges, cells } = working;
  const vIndex = new Map(verts.map((v, i) => [v, i]));
  const eIndex = new Map(edges.map((e, i) => [e.id, i]));
  const V = verts.length;
  const E = edges.length;
  const T = cells.length;

  // ∂₁ : edges → vertices. rows = vertices, cols = edges; row[v][e]=1 iff v ∈ ∂e.
  const d1rows: Uint8Array[] = verts.map(() => new Uint8Array(E));
  edges.forEach((e, j) => {
    const a = vIndex.get(e.u);
    const b = vIndex.get(e.v);
    if (a !== undefined) d1rows[a][j] ^= 1;
    if (b !== undefined && b !== a) d1rows[b][j] ^= 1;
  });

  // ∂₂ : 2-cells → edges. each cell's boundary vector = Σ (mod 2) of its word's edges.
  const cellVecs: Uint8Array[] = cells.map((cell) => {
    const v = new Uint8Array(E);
    for (const step of cell.word) {
      const j = eIndex.get(step.edge);
      if (j !== undefined) v[j] ^= 1;
    }
    return v;
  });

  // Z₁ = ker∂₁ (cycles); B₁ = im∂₂ (boundaries); H₁ = Z₁ / B₁; b₁ = dim Z₁ − dim B₁.
  const Z = nullspace(d1rows, E);
  const boundaryBasis: Uint8Array[] = [];
  const boundaryPivot: number[] = [];
  for (const bv of cellVecs) {
    const x = reduceMod(bv, boundaryBasis, boundaryPivot);
    const lc = leadCol(x);
    if (lc >= 0) {
      boundaryBasis.push(x);
      boundaryPivot.push(lc);
    }
  }
  const b1 = Z.length - boundaryBasis.length;

  // H₁ basis representatives: extend the boundary basis by cycles independent modulo it.
  const pivots = boundaryBasis.slice();
  const pivotOf = boundaryPivot.slice();
  const reps: Uint8Array[] = [];
  for (const z of Z) {
    if (reps.length >= b1) break;
    const x = reduceMod(z, pivots, pivotOf);
    const lc = leadCol(x);
    if (lc >= 0) {
      pivots.push(x);
      pivotOf.push(lc);
      reps.push(x); // the reduced cycle is still in Z₁ — a valid H₁ representative
    }
  }

  // the φ cocycle and the per-edge frustration analysis
  const { phi, crossCheckOrientable } = cochainPhi(working, vIndex);

  // w₁(cycle) = Σ_{e ∈ cycle} φ(e) (mod 2)
  const w1Of = (cycle: Uint8Array): 0 | 1 => {
    let acc = 0;
    for (let j = 0; j < E; j += 1) if (cycle[j]) acc ^= phi[j];
    return (acc & 1) as 0 | 1;
  };
  const perCycleW1 = reps.map((r) => w1Of(r));

  // canonicalise: w₁ is ONE Z/2 functional → reduce the basis so at most one cycle
  // pairs to 1 (its rank). Invariant; orientable → all 0, non-orientable → exactly one 1.
  const canon = perCycleW1.slice();
  const firstOne = canon.indexOf(1);
  if (firstOne >= 0) for (let i = 0; i < canon.length; i += 1) if (i !== firstOne) canon[i] = 0;
  const w1Class = canon.slice().sort((a, b) => a - b);
  const nonOrientable = perCycleW1.some((x) => x === 1);

  // non-degeneracy: every ORIGINAL edge-class is met by ≥2 distinct sub-corners on the
  // subdivision (its fresh midpoint is the second corner — that is what breaks the
  // single-face coboundary trap). Vacuously true with no edges (the collapse-sphere).
  let nonDegenerate: boolean;
  if (!subdivided) {
    nonDegenerate = false; // the raw representation holds NO subdivision — degeneracy unbroken
  } else if (original.edges.length === 0) {
    nonDegenerate = true;
  } else {
    nonDegenerate = original.edges.every(
      (e) => new Set([`V:${e.u}`, `V:${e.v}`, `M:${e.id}`]).size >= 2,
    );
  }

  const basisCycles = reps.map((r) => {
    const ids: string[] = [];
    for (let j = 0; j < E; j += 1) if (r[j]) ids.push(edges[j].id);
    return ids;
  });

  return {
    cert: { b1, w1Class, nonOrientable, nonDegenerate },
    debug: {
      cellCounts: { v: V, e: E, t: T },
      euler: V - E + T,
      basisCycles,
      perCycleW1,
      crossCheckOrientable,
    },
  };
}

// ---------------------------------------------------------------------------
// the orientation-frustration cochain φ — a PRIMAL 1-cocycle representing w₁
// ---------------------------------------------------------------------------
// `rel(e)` between the two 2-cells meeting an interior edge e = 1 iff they induce the
// SAME direction on e (the frustrated / cannot-co-orient case), else 0 (river-banks).
// This is the IDEA of `certifyCascadeOrientation`, generalised. To pair correctly with
// PRIMAL H₁ cycles, we assemble these rel's into a primal 1-cocycle φ:
//   • at each vertex v, transport a local orientation through star(v) (a disk, so this
//     is path-independent): A_v(t) ∈ Z/2 is t's flip relative to a base cell in star(v),
//     accumulating rel across the star's shared edges;
//   • φ(e=(x,y)) = A_x(t) ⊕ A_y(t) for any 2-cell t containing e — independent of which
//     t (the two cells of an interior edge agree by construction).
// δφ vanishes on every triangle (the three frame-comparisons telescope around it), so φ
// is a genuine cocycle and Σ_{e∈γ}φ(e) is well-defined on H₁. The per-vertex base choice
// only shifts φ by a coboundary (it vanishes on cycles) — so the H₁ pairing is invariant.
function cochainPhi(
  working: Working,
  _vIndex: Map<string, number>,
): { phi: Uint8Array; crossCheckOrientable: boolean } {
  const { edges, cells } = working;
  const E = edges.length;
  const cellIndex = new Map(cells.map((c, i) => [c.id, i]));

  // induced direction of each cell on each of its edges (from the boundary word).
  // incidences: edge id → list of { cell index, dir } (dir relative to the edge canonical).
  const incid = new Map<string, Array<{ cell: number; dir: 1 | -1 }>>();
  cells.forEach((cell, ci) => {
    for (const step of cell.word) {
      let list = incid.get(step.edge);
      if (!list) {
        list = [];
        incid.set(step.edge, list);
      }
      list.push({ cell: ci, dir: step.dir });
    }
  });

  // cells incident to each vertex (a vertex is a CORNER of a cell = the tail of some slot).
  const cellsAtVertex = new Map<string, number[]>();
  const addCellAt = (v: string, ci: number): void => {
    let list = cellsAtVertex.get(v);
    if (!list) {
      list = [];
      cellsAtVertex.set(v, list);
    }
    if (!list.includes(ci)) list.push(ci);
  };
  const edgeById = new Map(edges.map((e) => [e.id, e]));
  cells.forEach((cell, ci) => {
    for (const step of cell.word) {
      const e = edgeById.get(step.edge) as WEdge;
      const tail = step.dir === 1 ? e.u : e.v;
      const head = step.dir === 1 ? e.v : e.u;
      addCellAt(tail, ci);
      addCellAt(head, ci);
    }
  });

  // rel of an interior edge (exactly two DISTINCT-cell incidences): same induced
  // direction ⇒ 1 (frustrated), opposite ⇒ 0 (coherent).
  const interiorRel = new Map<string, { a: number; b: number; rel: 0 | 1 }>();
  let selfFrustration = false; // a single cell meeting an edge twice with the same direction (Möbius signature)
  for (const [eid, list] of incid) {
    if (list.length !== 2) continue;
    const [r1, r2] = list;
    const rel: 0 | 1 = r1.dir === r2.dir ? 1 : 0;
    if (r1.cell === r2.cell) {
      if (rel === 1) selfFrustration = true;
    } else {
      interiorRel.set(eid, { a: r1.cell, b: r2.cell, rel });
    }
  }

  // A_v over star(v): BFS the cells at v, connected by edges incident to v, accumulating
  // rel. Disconnected stars (non-manifold) are handled per component (each base 0).
  const A = new Map<string, Map<number, 0 | 1>>();
  for (const [v, cellList] of cellsAtVertex) {
    // adjacency restricted to star(v): interior edges that have v as an endpoint.
    const adj = new Map<number, Array<{ to: number; rel: 0 | 1 }>>();
    for (const ci of cellList) adj.set(ci, []);
    for (const [eid, rec] of interiorRel) {
      const e = edgeById.get(eid) as WEdge;
      if (e.u !== v && e.v !== v) continue;
      if (!adj.has(rec.a) || !adj.has(rec.b)) continue;
      adj.get(rec.a)!.push({ to: rec.b, rel: rec.rel });
      adj.get(rec.b)!.push({ to: rec.a, rel: rec.rel });
    }
    const flip = new Map<number, 0 | 1>();
    for (const start of cellList) {
      if (flip.has(start)) continue;
      flip.set(start, 0);
      const queue = [start];
      while (queue.length) {
        const cur = queue.shift() as number;
        for (const { to, rel } of adj.get(cur) ?? []) {
          if (flip.has(to)) continue;
          flip.set(to, ((flip.get(cur) as number) ^ rel) as 0 | 1);
          queue.push(to);
        }
      }
    }
    A.set(v, flip);
  }

  // φ(e=(x,y)) = A_x(t) ⊕ A_y(t) for a cell t containing e.
  const phi = new Uint8Array(E);
  edges.forEach((e, j) => {
    const list = incid.get(e.id);
    if (!list || list.length === 0) return; // an edge in no 2-cell carries no frustration
    const t = list[0].cell;
    const ax = A.get(e.u)?.get(t) ?? 0;
    const ay = A.get(e.v)?.get(t) ?? 0;
    phi[j] = (ax ^ ay) as 0 | 1;
  });

  // independent global cross-check: parity-union-find over ALL cells via ALL interior
  // edges (à la certifyCascadeOrientation). Orientable iff no contradiction and no
  // self-frustration. Must agree with !nonOrientable (asserted in the diagnostic).
  const crossCheckOrientable = !selfFrustration && globalTwoColourable(interiorRel, cells.length, cellIndex);

  return { phi, crossCheckOrientable };
}

// the global 2-colouring verdict: can every cell be assigned an orientation bit s.t.
// s_a ⊕ s_b === rel for every interior edge? (no contradiction ⇒ orientable.)
function globalTwoColourable(
  interiorRel: Map<string, { a: number; b: number; rel: 0 | 1 }>,
  nCells: number,
  _cellIndex: Map<string, number>,
): boolean {
  const parent = new Array(nCells).fill(0).map((_, i) => i);
  const parity = new Array<0 | 1>(nCells).fill(0);
  const find = (x: number): { root: number; par: 0 | 1 } => {
    if (parent[x] === x) return { root: x, par: 0 };
    const up = find(parent[x]);
    parity[x] = (parity[x] ^ up.par) as 0 | 1;
    parent[x] = up.root;
    return { root: up.root, par: parity[x] };
  };
  for (const { a, b, rel } of interiorRel.values()) {
    const fa = find(a);
    const fb = find(b);
    if (fa.root === fb.root) {
      if (((fa.par ^ fb.par) as 0 | 1) !== rel) return false; // contradiction → non-orientable
    } else {
      parent[fa.root] = fb.root;
      parity[fa.root] = ((fa.par ^ rel ^ fb.par) as 0 | 1);
    }
  }
  return true;
}

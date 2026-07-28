// laidBodyModel — CUT 1b, THE L (the general layout): lay a form's OWN cells
// on the canonical body. The cone family (CUT 1) drew the fan; this register
// extends the faithful render to the CLOSED genus ≤ 1 embeddables — the
// person who folded a segment, thickened the loop, and sewed the band holds a
// TORUS drawn from the cells they made, not a standard representative.
//
// THE PIPELINE (general — genus-agnostic in the cut; genus ≤ 1 delivered):
//   classifyForm (committed — CONSUMED, never recomputed)
//     → cut-to-disk: an Eppstein tree-cotree decomposition E = T ⊔ C ⊔ X on
//       the certified complex's INCIDENCE ONLY (endpoints + face slots; no
//       stored spelling, no birth record, no letters are ever read here) —
//       |X| = 2 − χ, the fundamental polygon's excess (2g on a closed
//       orientable surface);
//     → triangulate + parametrize: the polygon's faces (quads in the sewn
//       flow) are fan-triangulated for the solve; the layout is harmonic
//       (Tutte, uniform weights):
//         · genus 1 — the FLAT SQUARE: closed 1-cochains from the dual
//           fundamental cycles of the two X edges give unit periods (the
//           boundary of the cut disk lands on the canonical square's own
//           lattice — the two sides of every cut edge differ by an integer
//           translation, which is exactly the square's gluing); a harmonic
//           correction is solved per vertex class; NO FOLDOVER is enforced
//           (coherently-signed triangle areas, one sign, or the lay refuses);
//         · genus 0 — the CAPPED DISK: one face is the cap; the rest is a
//           disk, its boundary ring pinned convexly, the interior Tutte-solved,
//           then carried onto the sphere polar-wise; the cap is laid as the
//           polar patch behind its own ring. Same refusals.
//     → immersionPosition (committed — CONSUMED): every laid coordinate goes
//       through the frozen canonical body, so the drawn torus IS the committed
//       torus, wearing the person's cells.
//     → lay EVERY cell exactly once (LAW A): a dot per vertex class, a curve
//       per edge class, a region per face, and the rim register (LAW B) —
//       present and honestly EMPTY on a closed body.
//
// THE WALLS (doors, not theorems — never a fabricated body):
//   · genus ≥ 2 — the cut RUNS (it is genus-agnostic) but there is NO BODY:
//     the committed canonical bodies end at genus 1;
//   · bounded (b > 0) — the bounded lay is a later cut;
//   · closed non-orientable — cannot embed; the declared-crossing register
//     (CUT 2) owns it, and it is not built;
//   · any internal refusal (foldover, degenerate ring, disconnected cap
//     remainder) walls with its own sentence and the class body stands.
//
// DERIVE-ONLY · ADDITIVE: classifyForm, immersionPosition, readFormInvariants,
// classH1Label are consumed by import and stay byte-unchanged. Nothing here
// recomputes an invariant; this module only PLACES certified cells.

import type { Shape, Vec3 } from '../types/geometry';
import type { AssembledComplex } from '../lib/globalW1';
import { readFormInvariants, type FormInvariantsReadout } from '../playground/formInvariants';
import { classifyForm, classLabel, type SurfaceClass } from './surfaceClassifier';
import { classH1Label } from './classBodyModel';
import { immersionPosition, type ImmersedSurfaceKey } from '../lib/surfaceImmersion';

// ---------------------------------------------------------------------------
// the walls — true doors naming what is unbuilt (working text; the designer's
// craft-pass refines the phrasing, never the truth)
// ---------------------------------------------------------------------------

export const LAID_WALL_NO_BODY = (g: number): string =>
  `genus ${g} — no body: the committed canonical bodies end at genus 1; the cut ran, the layout exists, but there is nothing honest to lay it on (never a fabricated body).`;
export const LAID_WALL_BOUNDED = (b: number): string =>
  `bounded surface (${b} boundary circle${b === 1 ? '' : 's'}) — the bounded lay (cylinder / möbius / disk-family) is a later cut; the committed registers stand.`;
export const LAID_WALL_CROSSING =
  'closed non-orientable — this form cannot embed; it belongs to the declared-crossing register (CUT 2), not built yet.';
export const LAID_WALL_COMPONENTS = (n: number): string =>
  `the lay draws ONE connected body — this form has ${n} components; the class bodies stand.`;

// the designer's disclosure on a body whose sew needed rim refinement (the
// combine-prepare pattern equalized the rims before the committed sew ran)
export const RIM_REFINED_NOTE = 'rim refined to sew';

const rimRefinedForSew = new Set<string>();

// the view records the fact at the ONE moment it is measured — when the sew
// preparer reports prepared:true for the form this born shape came from
export function markRimRefinedForSew(bornShapeId: string): void {
  rimRefinedForSew.add(bornShapeId);
}

// ---------------------------------------------------------------------------
// the model
// ---------------------------------------------------------------------------

export interface LaidBodyModel {
  shape: Shape; // the person's own quotient shape (ids intact)
  surface: ImmersedSurfaceKey; // the canonical body laid on ('torus' | 'sphere')
  counts: { v: number; e: number; f: number }; // OF THE CERTIFIED COMPLEX — the caption's numbers
  boundaryCircles: number; // 0 here — the rim register is present and honestly empty
  classLabel: string; // the committed classifier's own label
  // THE FOUR COUNTABLE LOOKS (LAW A): one entry per cell class, exactly —
  // dots per vertex class · curves per edge class · regions per face · rims
  vertexDots: Array<{ id: string; position: Vec3 }>;
  edgeCurves: Array<{ id: string; points: Vec3[] }>;
  faceRegions: Array<{ id: string; positions: number[]; indices: number[] }>;
  rimArcs: Array<{ id: string; points: Vec3[] }>; // LAW B — empty on a closed body
  parametrization: {
    domain: 'flat-square' | 'capped-disk';
    classUV: Record<string, [number, number]>; // one (u,v) per vertex class
    cut: { treeEdgeIds: string[]; dualTreeEdgeIds: string[]; cutEdgeIds: string[] };
    foldover: { areas: number[]; oneSign: boolean }; // coherently-signed triangle areas
  };
  invariants: FormInvariantsReadout; // the tower's certificate (the card's rows)
  h1Label: string | null;
  note: string | null; // the designer's disclosure, or null
}

export type LaidVerdict = { ok: true; model: LaidBodyModel } | { ok: false; wall: string };

// ---------------------------------------------------------------------------
// the cut — tree-cotree on INCIDENCE ONLY (endpoints + face slots)
// ---------------------------------------------------------------------------

interface SlotRef {
  face: number;
  slot: number;
  dir: 1 | -1;
}

export interface TreeCotreeCut {
  treeEdgeIds: string[]; // T — a primal spanning tree
  dualTreeEdgeIds: string[]; // C — a spanning tree of the face-adjacency graph
  cutEdgeIds: string[]; // X — the excess; |X| = 2 − χ (2g closed orientable)
  faceFlips: number[]; // ±1 per face — the coherent orientation the dual walk found
  treeParent: Map<string, { vertex: string; edgeId: string }>; // child vertex → (parent, via)
  dualParent: Map<number, { face: number; edgeId: string }>; // child face → (parent, via)
  slotsOf: Map<string, SlotRef[]>; // edge id → its face slots
}

export function cutComplexToDisk(complex: AssembledComplex): TreeCotreeCut {
  const slotsOf = new Map<string, SlotRef[]>();
  for (const e of complex.edges) slotsOf.set(e.id, []);
  complex.faces.forEach((face, fi) => {
    face.boundary.forEach((slot, si) => {
      const refs = slotsOf.get(slot.edge);
      if (!refs) throw new Error(`laidBodyModel: face slot names an unknown edge class "${slot.edge}"`);
      refs.push({ face: fi, slot: si, dir: slot.dir });
    });
  });

  // T — BFS over endpoints (self-loops can never be tree edges)
  const incident = new Map<string, Array<{ id: string; u: string; v: string }>>();
  for (const v of complex.vertices) incident.set(v, []);
  for (const e of complex.edges) {
    if (e.u === e.v) continue;
    incident.get(e.u)?.push(e);
    incident.get(e.v)?.push(e);
  }
  const treeParent = new Map<string, { vertex: string; edgeId: string }>();
  const treeEdgeIds: string[] = [];
  const seenV = new Set<string>([complex.vertices[0]]);
  const queueV = [complex.vertices[0]];
  while (queueV.length > 0) {
    const at = queueV.shift() as string;
    for (const e of incident.get(at) ?? []) {
      const other = e.u === at ? e.v : e.u;
      if (seenV.has(other)) continue;
      seenV.add(other);
      treeParent.set(other, { vertex: at, edgeId: e.id });
      treeEdgeIds.push(e.id);
      queueV.push(other);
    }
  }
  if (seenV.size !== complex.vertices.length) {
    throw new Error('laidBodyModel: the complex is not connected — the cut takes one component');
  }
  const inT = new Set(treeEdgeIds);

  // C — BFS over face adjacency through interior edges (exactly two slots,
  // two distinct faces) not already in T
  const dualParent = new Map<number, { face: number; edgeId: string }>();
  const dualTreeEdgeIds: string[] = [];
  const faceFlips = new Array<number>(complex.faces.length).fill(0);
  if (complex.faces.length > 0) {
    faceFlips[0] = 1;
    const queueF = [0];
    const seenF = new Set<number>([0]);
    const interiorByFace = new Map<number, Array<{ edgeId: string; here: SlotRef; there: SlotRef }>>();
    for (const [edgeId, refs] of slotsOf) {
      if (refs.length !== 2 || inT.has(edgeId)) continue;
      const [a, b] = refs;
      if (a.face === b.face) continue; // a self-adjacency can never join two faces
      interiorByFace.set(a.face, [...(interiorByFace.get(a.face) ?? []), { edgeId, here: a, there: b }]);
      interiorByFace.set(b.face, [...(interiorByFace.get(b.face) ?? []), { edgeId, here: b, there: a }]);
    }
    while (queueF.length > 0) {
      const at = queueF.shift() as number;
      for (const cross of interiorByFace.get(at) ?? []) {
        const other = cross.there.face;
        if (seenF.has(other)) continue;
        seenF.add(other);
        dualParent.set(other, { face: at, edgeId: cross.edgeId });
        dualTreeEdgeIds.push(cross.edgeId);
        // coherent orientation: across a shared edge the two faces must run it
        // in OPPOSITE effective directions
        faceFlips[other] = -faceFlips[at] * cross.here.dir * cross.there.dir;
        queueF.push(other);
      }
    }
    if (seenF.size !== complex.faces.length) {
      throw new Error('laidBodyModel: the face-adjacency graph is not connected — no single disk');
    }
  }
  const inC = new Set(dualTreeEdgeIds);
  const cutEdgeIds = complex.edges.map((e) => e.id).filter((id) => !inT.has(id) && !inC.has(id));
  return { treeEdgeIds, dualTreeEdgeIds, cutEdgeIds, faceFlips, treeParent, dualParent, slotsOf };
}

// ---------------------------------------------------------------------------
// small dense linear algebra (the complexes here are tiny)
// ---------------------------------------------------------------------------

function solveDense(A: number[][], rhs: number[][]): number[][] {
  const n = A.length;
  const m = rhs[0]?.length ?? 0;
  const M = A.map((row, i) => [...row, ...rhs[i]]);
  for (let col = 0; col < n; col += 1) {
    let pivot = col;
    for (let r = col + 1; r < n; r += 1) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
    }
    if (Math.abs(M[pivot][col]) < 1e-12) {
      throw new Error('laidBodyModel: the harmonic system is singular — refusing to lay');
    }
    if (pivot !== col) {
      const t = M[pivot];
      M[pivot] = M[col];
      M[col] = t;
    }
    const p = M[col][col];
    for (let c = col; c < n + m; c += 1) M[col][c] /= p;
    for (let r = 0; r < n; r += 1) {
      if (r === col) continue;
      const f = M[r][col];
      if (f === 0) continue;
      for (let c = col; c < n + m; c += 1) M[r][c] -= f * M[col][c];
    }
  }
  return M.map((row) => row.slice(n));
}

type V2 = [number, number];
const add2 = (a: V2, b: V2): V2 => [a[0] + b[0], a[1] + b[1]];
const sub2 = (a: V2, b: V2): V2 => [a[0] - b[0], a[1] - b[1]];
const scale2 = (a: V2, s: number): V2 => [a[0] * s, a[1] * s];

// ---------------------------------------------------------------------------
// shared harmonic assembly: minimize Σ ‖jump + φ(b) − φ(a)‖² over the free
// classes (pinned classes contribute constants). One solve, two columns.
// ---------------------------------------------------------------------------

interface HarmonicTerm {
  a: string;
  b: string;
  jump: V2; // the prescribed cover translation along a→b (zero for plain Tutte)
}

function solveHarmonic(
  classes: string[],
  terms: HarmonicTerm[],
  pinned: Map<string, V2>,
): Map<string, V2> {
  const free = classes.filter((c) => !pinned.has(c));
  const index = new Map(free.map((c, i) => [c, i]));
  const out = new Map<string, V2>(pinned);
  if (free.length === 0) return out;
  const n = free.length;
  const L = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  const rhs = Array.from({ length: n }, () => [0, 0]);
  for (const t of terms) {
    if (t.a === t.b) continue; // a constant in the energy — no equation
    const ia = index.get(t.a);
    const ib = index.get(t.b);
    if (ia === undefined && ib === undefined) continue;
    if (ia !== undefined && ib !== undefined) {
      L[ia][ia] += 1;
      L[ib][ib] += 1;
      L[ia][ib] -= 1;
      L[ib][ia] -= 1;
      rhs[ia][0] += t.jump[0];
      rhs[ia][1] += t.jump[1];
      rhs[ib][0] -= t.jump[0];
      rhs[ib][1] -= t.jump[1];
    } else if (ib !== undefined) {
      const pa = pinned.get(t.a) as V2;
      L[ib][ib] += 1;
      rhs[ib][0] += pa[0] - t.jump[0];
      rhs[ib][1] += pa[1] - t.jump[1];
    } else if (ia !== undefined) {
      const pb = pinned.get(t.b) as V2;
      L[ia][ia] += 1;
      rhs[ia][0] += pb[0] + t.jump[0];
      rhs[ia][1] += pb[1] + t.jump[1];
    }
  }
  const solved = solveDense(L, rhs);
  free.forEach((c, i) => out.set(c, [solved[i][0], solved[i][1]]));
  return out;
}

// face corners as vertex classes, in walk order (slot k runs tail→head; the
// corner at position k is slot k's tail)
function faceCorners(
  face: AssembledComplex['faces'][number],
  edgeById: Map<string, AssembledComplex['edges'][number]>,
): string[] {
  return face.boundary.map((slot) => {
    const e = edgeById.get(slot.edge);
    if (!e) throw new Error(`laidBodyModel: face slot names an unknown edge class "${slot.edge}"`);
    return slot.dir === 1 ? e.u : e.v;
  });
}

// ---------------------------------------------------------------------------
// genus 1 — the flat square (closed 1-cochains with unit periods + harmonic)
// ---------------------------------------------------------------------------

interface Parametrized {
  domain: 'flat-square';
  cover: Map<string, V2>; // one cover position per vertex class
  jumpOf: Map<string, V2>; // per edge class: the cover translation tail→head
  faceRings: V2[][]; // each face's cover polygon (closed walk)
  foldover: { areas: number[]; oneSign: boolean };
  toBody: (p: V2) => Vec3;
}

function parametrizeFlatSquare(complex: AssembledComplex, cut: TreeCotreeCut): Parametrized {
  const edgeById = new Map(complex.edges.map((e) => [e.id, e]));
  if (cut.cutEdgeIds.length !== 2) {
    throw new Error(
      `laidBodyModel: the flat square needs exactly two excess edges (got ${cut.cutEdgeIds.length}) — the cut disagrees with genus 1`,
    );
  }
  const dirIn = (face: number, edgeId: string): 1 | -1 => {
    const ref = (cut.slotsOf.get(edgeId) ?? []).find((s) => s.face === face);
    if (!ref) throw new Error(`laidBodyModel: edge "${edgeId}" has no slot in face ${face}`);
    return ref.dir;
  };
  const dualDepth = (face: number): number => {
    let d = 0;
    let at = face;
    while (cut.dualParent.has(at)) {
      at = (cut.dualParent.get(at) as { face: number }).face;
      d += 1;
    }
    return d;
  };
  // the closed 1-cochain of one excess edge: its dual fundamental cycle —
  // the tree path between its two faces, closed through the edge itself;
  // each crossing contributes ± from the face it EXITS (coherent flips)
  const cochainOf = (edgeId: string): Map<string, number> => {
    const w = new Map<string, number>();
    const bump = (id: string, s: number): void => {
      w.set(id, (w.get(id) ?? 0) + s);
    };
    const refs = cut.slotsOf.get(edgeId) ?? [];
    if (refs.length !== 2) {
      throw new Error(`laidBodyModel: excess edge "${edgeId}" is not interior (${refs.length} slots)`);
    }
    const fA = refs[0].face;
    const fB = refs[1].face;
    if (fA !== fB) {
      let a = fA;
      let b = fB;
      let da = dualDepth(a);
      let db = dualDepth(b);
      const upA: number[] = [];
      const upB: number[] = [];
      while (da > db) {
        upA.push(a);
        a = (cut.dualParent.get(a) as { face: number }).face;
        da -= 1;
      }
      while (db > da) {
        upB.push(b);
        b = (cut.dualParent.get(b) as { face: number }).face;
        db -= 1;
      }
      while (a !== b) {
        upA.push(a);
        upB.push(b);
        a = (cut.dualParent.get(a) as { face: number }).face;
        b = (cut.dualParent.get(b) as { face: number }).face;
      }
      // fA-side steps exit the child; fB-side steps (walked downward) exit the parent
      for (const child of upA) {
        const via = (cut.dualParent.get(child) as { edgeId: string }).edgeId;
        bump(via, cut.faceFlips[child] * dirIn(child, via));
      }
      for (const child of upB) {
        const via = (cut.dualParent.get(child) as { face: number; edgeId: string }).edgeId;
        const parent = (cut.dualParent.get(child) as { face: number }).face;
        bump(via, cut.faceFlips[parent] * dirIn(parent, via));
      }
    }
    // the closing crossing through the excess edge itself, exiting fB
    bump(edgeId, cut.faceFlips[fB] * dirIn(fB, edgeId));
    return w;
  };
  const cochains = [cochainOf(cut.cutEdgeIds[0]), cochainOf(cut.cutEdgeIds[1])];
  // closedness — the construction's own invariant, asserted loudly
  complex.faces.forEach((face, fi) => {
    for (const w of cochains) {
      const sum = face.boundary.reduce((acc, slot) => acc + slot.dir * (w.get(slot.edge) ?? 0), 0);
      if (sum !== 0) {
        throw new Error(`laidBodyModel: cochain not closed on face ${fi} (sum ${sum}) — refusing to lay`);
      }
    }
  });
  // unit periods over the two fundamental cycles (excess edge + tree path back)
  const treePath = (from: string, to: string): Array<{ edgeId: string; sign: 1 | -1 }> => {
    const depth = (v: string): number => {
      let d = 0;
      let at = v;
      while (cut.treeParent.has(at)) {
        at = (cut.treeParent.get(at) as { vertex: string }).vertex;
        d += 1;
      }
      return d;
    };
    const stepUp = (v: string): { next: string; edgeId: string; sign: 1 | -1 } => {
      const p = cut.treeParent.get(v) as { vertex: string; edgeId: string };
      const e = edgeById.get(p.edgeId) as AssembledComplex['edges'][number];
      return { next: p.vertex, edgeId: p.edgeId, sign: e.u === v ? 1 : -1 };
    };
    let a = from;
    let b = to;
    let da = depth(a);
    let db = depth(b);
    const fromSide: Array<{ edgeId: string; sign: 1 | -1 }> = [];
    const toSide: Array<{ edgeId: string; sign: 1 | -1 }> = [];
    while (da > db) {
      const s = stepUp(a);
      fromSide.push({ edgeId: s.edgeId, sign: s.sign });
      a = s.next;
      da -= 1;
    }
    while (db > da) {
      const s = stepUp(b);
      toSide.push({ edgeId: s.edgeId, sign: s.sign === 1 ? -1 : 1 });
      b = s.next;
      db -= 1;
    }
    while (a !== b) {
      const sa = stepUp(a);
      fromSide.push({ edgeId: sa.edgeId, sign: sa.sign });
      a = sa.next;
      const sb = stepUp(b);
      toSide.push({ edgeId: sb.edgeId, sign: sb.sign === 1 ? -1 : 1 });
      b = sb.next;
    }
    return [...fromSide, ...toSide.reverse()];
  };
  const periodOver = (w: Map<string, number>, x: string): number => {
    const e = edgeById.get(x) as AssembledComplex['edges'][number];
    let sum = w.get(x) ?? 0; // the excess edge traversed tail→head
    for (const step of treePath(e.v, e.u)) sum += step.sign * (w.get(step.edgeId) ?? 0);
    return sum;
  };
  const P = [
    [periodOver(cochains[0], cut.cutEdgeIds[0]), periodOver(cochains[0], cut.cutEdgeIds[1])],
    [periodOver(cochains[1], cut.cutEdgeIds[0]), periodOver(cochains[1], cut.cutEdgeIds[1])],
  ];
  if (Math.abs(P[0][1]) !== 0 || Math.abs(P[1][0]) !== 0 || Math.abs(P[0][0]) !== 1 || Math.abs(P[1][1]) !== 1) {
    throw new Error(
      `laidBodyModel: the period matrix is not unimodular-diagonal ([[${P[0]}],[${P[1]}]]) — refusing to lay`,
    );
  }
  if (P[0][0] === -1) for (const [k, s] of cochains[0]) cochains[0].set(k, -s);
  if (P[1][1] === -1) for (const [k, s] of cochains[1]) cochains[1].set(k, -s);

  const omega = (edgeId: string): V2 => [cochains[0].get(edgeId) ?? 0, cochains[1].get(edgeId) ?? 0];

  // harmonic correction φ per class (root pinned), edges + fan diagonals
  const terms: HarmonicTerm[] = [];
  for (const e of complex.edges) terms.push({ a: e.u, b: e.v, jump: omega(e.id) });
  for (const face of complex.faces) {
    const corners = faceCorners(face, edgeById);
    let acc: V2 = [0, 0];
    for (let k = 0; k < corners.length - 1; k += 1) {
      const slot = face.boundary[k];
      acc = add2(acc, scale2(omega(slot.edge), slot.dir));
      if (k >= 1 && k <= corners.length - 2) {
        terms.push({ a: corners[0], b: corners[k + 1], jump: acc });
      }
    }
  }
  const root = complex.vertices[0];
  const phi = solveHarmonic(complex.vertices, terms, new Map([[root, [0, 0] as V2]]));
  const jumpOf = new Map<string, V2>();
  for (const e of complex.edges) {
    jumpOf.set(e.id, add2(omega(e.id), sub2(phi.get(e.v) as V2, phi.get(e.u) as V2)));
  }
  // integrate over the tree; every other edge must then close up to an
  // INTEGER translation — the canonical square's own lattice (the pinning)
  const cover = new Map<string, V2>([[root, [0, 0]]]);
  const pending = [...cut.treeParent.keys()];
  while (pending.length > 0) {
    const next = pending.findIndex((v) => cover.has((cut.treeParent.get(v) as { vertex: string }).vertex));
    if (next < 0) throw new Error('laidBodyModel: broken tree integration — refusing to lay');
    const v = pending.splice(next, 1)[0];
    const p = cut.treeParent.get(v) as { vertex: string; edgeId: string };
    const e = edgeById.get(p.edgeId) as AssembledComplex['edges'][number];
    const j = jumpOf.get(p.edgeId) as V2;
    const base = cover.get(p.vertex) as V2;
    cover.set(v, e.u === p.vertex ? add2(base, j) : sub2(base, j));
  }
  for (const e of complex.edges) {
    const resid = sub2(sub2(cover.get(e.v) as V2, cover.get(e.u) as V2), jumpOf.get(e.id) as V2);
    for (const r of resid) {
      if (Math.abs(r - Math.round(r)) > 1e-6) {
        throw new Error(
          `laidBodyModel: edge "${e.id}" does not close on the square's lattice (residual ${r}) — refusing to lay`,
        );
      }
    }
  }
  // face polygons in the cover + the no-foldover gate
  const faceRings: V2[][] = [];
  const areas: number[] = [];
  complex.faces.forEach((face, fi) => {
    const corners = faceCorners(face, edgeById);
    const ring: V2[] = [cover.get(corners[0]) as V2];
    face.boundary.forEach((slot, k) => {
      if (k === face.boundary.length - 1) return;
      ring.push(add2(ring[k], scale2(jumpOf.get(slot.edge) as V2, slot.dir)));
    });
    const last = face.boundary[face.boundary.length - 1];
    const closure = add2(ring[ring.length - 1], scale2(jumpOf.get(last.edge) as V2, last.dir));
    const gap = sub2(closure, ring[0]);
    if (Math.hypot(gap[0], gap[1]) > 1e-6) {
      throw new Error(`laidBodyModel: face ${fi} does not close in the cover — refusing to lay`);
    }
    faceRings.push(ring);
    for (let k = 1; k < ring.length - 1; k += 1) {
      const a = ring[0];
      const b = ring[k];
      const c = ring[k + 1];
      const area = 0.5 * ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));
      areas.push(area * cut.faceFlips[fi]);
    }
  });
  const oneSign = areas.every((a) => a > 1e-9) || areas.every((a) => a < -1e-9);
  if (!oneSign) {
    throw new Error('laidBodyModel: the layout folds over (mixed triangle signs) — refusing to lay a lie');
  }
  return {
    domain: 'flat-square',
    cover,
    jumpOf,
    faceRings,
    foldover: { areas, oneSign },
    toBody: (p) => immersionPosition('torus', p[0], p[1]),
  };
}

// ---------------------------------------------------------------------------
// genus 0 — the capped disk (one face is the polar cap; the rest Tutte)
// ---------------------------------------------------------------------------

const CAP_V = 0.72; // the ring's polar latitude — the cap fills v ∈ [CAP_V, 1]

interface ParametrizedSphere {
  domain: 'capped-disk';
  disk: Map<string, V2>; // one unit-disk position per vertex class
  capFace: number;
  ringCorners: string[]; // the cap's ring, walk order
  faceRings: V2[][]; // remainder faces' disk polygons (cap slot left empty)
  foldover: { areas: number[]; oneSign: boolean };
  toBody: (p: V2) => Vec3;
}

function parametrizeCappedDisk(complex: AssembledComplex, cut: TreeCotreeCut): ParametrizedSphere {
  const edgeById = new Map(complex.edges.map((e) => [e.id, e]));
  if (complex.faces.length < 2) {
    throw new Error('laidBodyModel: the capped disk needs at least two faces — refusing to lay');
  }
  // the cap: the longest ring (ties → lowest index) gets the polar patch
  let capFace = 0;
  complex.faces.forEach((face, fi) => {
    if (face.boundary.length > complex.faces[capFace].boundary.length) capFace = fi;
  });
  // the remainder must stay one disk: face adjacency through interior edges
  // with BOTH slots off the cap
  const seenF = new Set<number>();
  const start = capFace === 0 ? 1 : 0;
  seenF.add(start);
  const queueF = [start];
  while (queueF.length > 0) {
    const at = queueF.shift() as number;
    for (const refs of cut.slotsOf.values()) {
      if (refs.length !== 2) continue;
      const [a, b] = refs;
      if (a.face === capFace || b.face === capFace) continue;
      const other = a.face === at ? b.face : b.face === at ? a.face : null;
      if (other === null || seenF.has(other)) continue;
      seenF.add(other);
      queueF.push(other);
    }
  }
  if (seenF.size !== complex.faces.length - 1) {
    throw new Error('laidBodyModel: removing the cap disconnects the rest — this sphere complex has no capped-disk lay');
  }
  const capCorners = faceCorners(complex.faces[capFace], edgeById);
  if (new Set(capCorners).size !== capCorners.length) {
    throw new Error('laidBodyModel: the cap ring revisits a vertex class — one drawn position per class (LAW A), refusing');
  }
  const L = capCorners.length;
  const pinned = new Map<string, V2>();
  capCorners.forEach((c, k) => {
    const angle = Math.PI / 2 - (2 * Math.PI * k) / L;
    pinned.set(c, [Math.cos(angle), Math.sin(angle)]);
  });
  const terms: HarmonicTerm[] = [];
  for (const e of complex.edges) terms.push({ a: e.u, b: e.v, jump: [0, 0] });
  complex.faces.forEach((face, fi) => {
    if (fi === capFace) return;
    const corners = faceCorners(face, edgeById);
    for (let k = 2; k <= corners.length - 2; k += 1) {
      terms.push({ a: corners[0], b: corners[k], jump: [0, 0] });
    }
  });
  const disk = solveHarmonic(complex.vertices, terms, pinned);
  const faceRings: V2[][] = [];
  const areas: number[] = [];
  complex.faces.forEach((face, fi) => {
    if (fi === capFace) {
      faceRings.push([]);
      return;
    }
    const corners = faceCorners(face, edgeById);
    const ring = corners.map((c) => disk.get(c) as V2);
    faceRings.push(ring);
    for (let k = 1; k < ring.length - 1; k += 1) {
      const a = ring[0];
      const b = ring[k];
      const c = ring[k + 1];
      const area = 0.5 * ((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));
      areas.push(area * cut.faceFlips[fi]);
    }
  });
  const oneSign = areas.every((a) => a > 1e-9) || areas.every((a) => a < -1e-9);
  if (!oneSign) {
    throw new Error('laidBodyModel: the disk layout folds over (mixed triangle signs) — refusing to lay a lie');
  }
  return {
    domain: 'capped-disk',
    disk,
    capFace,
    ringCorners: capCorners,
    faceRings,
    foldover: { areas, oneSign },
    toBody: (p) => {
      const r = Math.min(1, Math.hypot(p[0], p[1]));
      const theta = Math.atan2(p[1], p[0]);
      const u = (Math.PI / 2 - theta) / (2 * Math.PI);
      return immersionPosition('sphere', u, r * CAP_V);
    },
  };
}

// ---------------------------------------------------------------------------
// laying the cells: dots, sampled curves, sub-triangulated regions
// ---------------------------------------------------------------------------

const CURVE_DENSITY = 48;
const REGION_DENSITY = 10;

function sampleCurve(a: V2, b: V2, toBody: (p: V2) => Vec3): Vec3[] {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const n = Math.max(8, Math.min(96, Math.round(len * CURVE_DENSITY) + 2));
  const points: Vec3[] = [];
  for (let s = 0; s <= n; s += 1) {
    const t = s / n;
    points.push(toBody([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]));
  }
  return points;
}

function meshTriangle(
  a: V2,
  b: V2,
  c: V2,
  toBody: (p: V2) => Vec3,
  out: { positions: number[]; indices: number[] },
): void {
  const side = Math.max(
    Math.hypot(b[0] - a[0], b[1] - a[1]),
    Math.hypot(c[0] - b[0], c[1] - b[1]),
    Math.hypot(a[0] - c[0], a[1] - c[1]),
  );
  const m = Math.max(2, Math.min(12, Math.ceil(side * REGION_DENSITY)));
  const base = out.positions.length / 3;
  const rowStart: number[] = [];
  let count = 0;
  for (let i = 0; i <= m; i += 1) {
    rowStart.push(count);
    for (let j = 0; j <= i; j += 1) {
      const wB = (i - j) / m;
      const wC = j / m;
      const wA = 1 - wB - wC;
      const p: V2 = [a[0] * wA + b[0] * wB + c[0] * wC, a[1] * wA + b[1] * wB + c[1] * wC];
      const q = toBody(p);
      out.positions.push(q[0], q[1], q[2]);
      count += 1;
    }
  }
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      out.indices.push(base + rowStart[i] + j, base + rowStart[i + 1] + j, base + rowStart[i + 1] + j + 1);
      if (j < i) {
        out.indices.push(base + rowStart[i] + j, base + rowStart[i + 1] + j + 1, base + rowStart[i] + j + 1);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// the verdict — classify (committed) → body lookup → cut → parametrize → lay
// ---------------------------------------------------------------------------

export function laidBodyVerdict(shape: Shape, lineage: Shape | Shape[] | null): LaidVerdict {
  let classification: ReturnType<typeof classifyForm>;
  try {
    classification = classifyForm(shape, lineage);
  } catch (error) {
    return { ok: false, wall: error instanceof Error ? error.message : String(error) };
  }
  if (!classification.ok) return { ok: false, wall: classification.reason };
  if (classification.components.length !== 1) {
    return { ok: false, wall: LAID_WALL_COMPONENTS(classification.components.length) };
  }
  const component = classification.components[0];
  const cls: SurfaceClass = component.class;
  if (cls.b > 0) return { ok: false, wall: LAID_WALL_BOUNDED(cls.b) };
  if (cls.kind === 'non-orientable') return { ok: false, wall: LAID_WALL_CROSSING };
  const g = cls.g as number;
  if (g >= 2) return { ok: false, wall: LAID_WALL_NO_BODY(g) };
  const complex = component.complex;
  try {
    const cut = cutComplexToDisk(complex);
    const surface: ImmersedSurfaceKey = g === 1 ? 'torus' : 'sphere';
    let toBody: (p: V2) => Vec3;
    let positionOfClass: (c: string) => V2;
    let faceRings: V2[][];
    let foldover: { areas: number[]; oneSign: boolean };
    let domain: 'flat-square' | 'capped-disk';
    let jumpOf: Map<string, V2> | null = null;
    let capFace = -1;
    let capRing: string[] = [];
    if (g === 1) {
      const p = parametrizeFlatSquare(complex, cut);
      toBody = p.toBody;
      positionOfClass = (c) => p.cover.get(c) as V2;
      faceRings = p.faceRings;
      foldover = p.foldover;
      domain = p.domain;
      jumpOf = p.jumpOf;
    } else {
      const p = parametrizeCappedDisk(complex, cut);
      toBody = p.toBody;
      positionOfClass = (c) => p.disk.get(c) as V2;
      faceRings = p.faceRings;
      foldover = p.foldover;
      domain = p.domain;
      capFace = p.capFace;
      capRing = p.ringCorners;
    }
    // LAW A — every class exactly once
    const vertexDots = complex.vertices.map((id) => ({ id, position: toBody(positionOfClass(id)) }));
    const edgeCurves = complex.edges.map((e) => {
      const a = positionOfClass(e.u);
      const b = jumpOf ? add2(a, jumpOf.get(e.id) as V2) : positionOfClass(e.v);
      return { id: e.id, points: sampleCurve(a, b, toBody) };
    });
    const faceRegions = complex.faces.map((face, fi) => {
      const id = shape.faces[fi]?.id ?? `face-class:${fi}`;
      const out = { positions: [] as number[], indices: [] as number[] };
      if (fi === capFace) {
        // the polar patch: each ring chord swept to the pole (v → 1); the
        // t=0 row IS the drawn chord, so the patch meets its own edges exactly
        const rows = 6;
        for (let k = 0; k < capRing.length; k += 1) {
          const a = positionOfClass(capRing[k]);
          const b = positionOfClass(capRing[(k + 1) % capRing.length]);
          const chord = Math.max(2, Math.min(12, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * REGION_DENSITY)));
          const base = out.positions.length / 3;
          for (let t = 0; t <= rows; t += 1) {
            for (let s = 0; s <= chord; s += 1) {
              const p: V2 = [a[0] + ((b[0] - a[0]) * s) / chord, a[1] + ((b[1] - a[1]) * s) / chord];
              const r = Math.min(1, Math.hypot(p[0], p[1]));
              const theta = Math.atan2(p[1], p[0]);
              const u = (Math.PI / 2 - theta) / (2 * Math.PI);
              const v = r * CAP_V + (1 - r * CAP_V) * (t / rows);
              const q = immersionPosition('sphere', u, v);
              out.positions.push(q[0], q[1], q[2]);
            }
          }
          for (let t = 0; t < rows; t += 1) {
            for (let s = 0; s < chord; s += 1) {
              const r0 = base + t * (chord + 1) + s;
              const r1 = base + (t + 1) * (chord + 1) + s;
              out.indices.push(r0, r1, r1 + 1, r0, r1 + 1, r0 + 1);
            }
          }
        }
        return { id, ...out };
      }
      const ring = faceRings[fi];
      for (let k = 1; k < ring.length - 1; k += 1) {
        meshTriangle(ring[0], ring[k], ring[k + 1], toBody, out);
      }
      return { id, ...out };
    });
    const classUV: Record<string, [number, number]> = {};
    for (const id of complex.vertices) {
      const p = positionOfClass(id);
      classUV[id] =
        domain === 'flat-square'
          ? [p[0] - Math.floor(p[0]), p[1] - Math.floor(p[1])]
          : [(Math.PI / 2 - Math.atan2(p[1], p[0])) / (2 * Math.PI), Math.min(1, Math.hypot(p[0], p[1])) * CAP_V];
    }
    const invariants = readFormInvariants(shape, lineage);
    const model: LaidBodyModel = {
      shape,
      surface,
      counts: { v: complex.vertices.length, e: complex.edges.length, f: complex.faces.length },
      boundaryCircles: cls.b,
      classLabel: classLabel(cls),
      vertexDots,
      edgeCurves,
      faceRegions,
      rimArcs: [], // LAW B — the register is present; a closed body has no rim
      parametrization: {
        domain,
        classUV,
        cut: { treeEdgeIds: cut.treeEdgeIds, dualTreeEdgeIds: cut.dualTreeEdgeIds, cutEdgeIds: cut.cutEdgeIds },
        foldover,
      },
      invariants,
      h1Label: classH1Label(cls),
      note: rimRefinedForSew.has(shape.id) ? RIM_REFINED_NOTE : null,
    };
    return { ok: true, model };
  } catch (error) {
    return { ok: false, wall: error instanceof Error ? error.message : String(error) };
  }
}

// the route's thin door: model-or-null (walls stay measurable through
// laidBodyVerdict; a null leaves the committed class body standing)
export function tryLaidBodyModel(shape: Shape, lineage: Shape | Shape[] | null): LaidBodyModel | null {
  const verdict = laidBodyVerdict(shape, lineage);
  return verdict.ok ? verdict.model : null;
}

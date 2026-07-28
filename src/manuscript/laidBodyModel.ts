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
// CUT 2 — the old non-orientable wall is DELETED: closed non-orientable forms
// route through the SAME L onto their committed self-crossing bodies. Beyond
// the cross-cap pair there is no committed body — that wall stays honest.
export const LAID_WALL_CROSSCAPS = (k: number): string =>
  `${k} cross-caps — no body: the committed canonical bodies end at the cross-cap pair (RP² k=1 · Klein k=2); the cut ran, but there is nothing honest to lay it on (never a fabricated body).`;
export const LAID_WALL_ALIGNED =
  'the lay rides the crossing — an edge or vertex sits along the double locus, the nudge could not move it off, and a ghost is never a cell (LAW C); the crossing register refuses this lay.';

// the crossing captions (working text; the designer's craft-pass refines the
// phrasing, never the truth): the caption declares the DRAWING's crossing —
// never a real edge of the form, never a cell of it.
export const CROSSING_CAPTIONS: Record<'klein' | 'rp2', string> = {
  klein:
    'the body passes through itself along this pale circle — a crossing of the drawing, never a real edge of the form',
  rp2: 'the body passes through itself along this pale thread — a crossing of the drawing, never a real edge of the form',
};
export const CROSSING_GHOST_FLOOR = 0.3; // the pale-broken ghost's opacity floor
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
    domain: 'flat-square' | 'capped-disk' | 'twisted-square';
    classUV: Record<string, [number, number]>; // one (u,v) per vertex class
    cut: { treeEdgeIds: string[]; dualTreeEdgeIds: string[]; cutEdgeIds: string[] };
    foldover: { areas: number[]; oneSign: boolean }; // coherently-signed triangle areas
  };
  // CUT 2 — the crossing register: present exactly on the self-crossing
  // bodies (klein · rp2); null on the embeddable ones. The crossing is the
  // DRAWING's, never a cell — it rides beside the four looks, not among them.
  crossing: CrossingModel | null;
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

// `seed` rotates the spanning-tree searches' edge orders (default 0 = the
// original deterministic cut, byte-stable). The twisted route enumerates a
// few seeds: WHICH interior edges join the dual tree decides which corner
// instances pre-merge in the disk, and a bad merge can make every seam pin
// itself impossible while a neighbouring cut is clean.
export function cutComplexToDisk(complex: AssembledComplex, seed = 0): TreeCotreeCut {
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
  const rotated = [...complex.edges.slice(seed % Math.max(1, complex.edges.length)), ...complex.edges.slice(0, seed % Math.max(1, complex.edges.length))];
  const incident = new Map<string, Array<{ id: string; u: string; v: string }>>();
  for (const v of complex.vertices) incident.set(v, []);
  for (const e of rotated) {
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
    for (const e of rotated) {
      const refs = slotsOf.get(e.id) as SlotRef[];
      if (refs.length !== 2 || inT.has(e.id)) continue;
      const [a, b] = refs;
      if (a.face === b.face) continue; // a self-adjacency can never join two faces
      interiorByFace.set(a.face, [...(interiorByFace.get(a.face) ?? []), { edgeId: e.id, here: a, there: b }]);
      interiorByFace.set(b.face, [...(interiorByFace.get(b.face) ?? []), { edgeId: e.id, here: b, there: a }]);
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
// CUT 2 — the crossing register: the TWISTED lay (Klein k=2 · RP² k=1)
//
// The SAME cut; the disk's corner instances are laid flat by one harmonic
// solve; each cut edge's two sides are related by the BODY'S OWN gluing map
// ("the flip is the body's" — the maps are exactly the committed
// applyIdentifications rules, as affine elements). A candidate layout ships
// ONLY through four gates: (1) every free seam translation is an integer of
// the right parity for the body's group; (2) every face lays one-sign;
// (3) every vertex class's instances agree in 3D; (4) every seam's two sides
// sample to the SAME 3D curve. A wrong pin pattern cannot ship — it walls.
// ---------------------------------------------------------------------------

type M2 = [number, number, number, number]; // row-major 2×2
const M_ID: M2 = [1, 0, 0, 1];
const M_FLIP_V: M2 = [1, 0, 0, -1]; // (u, v) ↦ (u, −v)
const M_FLIP_U: M2 = [-1, 0, 0, 1]; // (u, v) ↦ (−u, v)
const M_NEG: M2 = [-1, 0, 0, -1]; // (u, v) ↦ (−u, −v) — rp2's central reflection class
const mulM = (m: M2, p: V2): V2 => [m[0] * p[0] + m[1] * p[1], m[2] * p[0] + m[3] * p[1]];

// the committed bodies' own gluing groups, as reduction rules into [0,1]²:
//   klein: (u,0)~(u,1) straight · (0,v)~(1,1−v) — elements (u+m, (−1)^m v + n)
//   rp2:   (u,0)~(1−u,1) · (0,v)~(1,1−v)        — sign pattern tied to parity
export function reduceKlein(p: V2): V2 {
  let [u, v] = p;
  let guard = 0;
  while (u < 0 || u > 1 || v < 0 || v > 1) {
    if (u > 1) {
      u -= 1;
      v = -v;
    } else if (u < 0) {
      u += 1;
      v = -v;
    } else if (v > 1) {
      v -= 1;
    } else {
      v += 1;
    }
    if ((guard += 1) > 200) throw new Error('laidBodyModel: klein reduction diverged');
  }
  return [u, v];
}
export function reduceRp2(p: V2): V2 {
  let [u, v] = p;
  let guard = 0;
  while (u < 0 || u > 1 || v < 0 || v > 1) {
    if (u > 1) {
      u -= 1;
      v = 1 - v;
    } else if (u < 0) {
      u += 1;
      v = 1 - v;
    } else if (v > 1) {
      v -= 1;
      u = 1 - u;
    } else {
      v += 1;
      u = 1 - u;
    }
    if ((guard += 1) > 200) throw new Error('laidBodyModel: rp2 reduction diverged');
  }
  return [u, v];
}

interface TwistedParam {
  surface: 'klein' | 'rp2';
  classPos: Map<string, V2>; // one representative laid position per vertex class
  faceRings: V2[][]; // each face's laid corner polygon (instances, one chart)
  edgeEnds: Map<string, [V2, V2]>; // ONE side's laid endpoints per edge class (u-end, v-end)
  foldover: { areas: number[]; oneSign: boolean };
  toBody: (p: V2) => Vec3;
  reduce: (p: V2) => V2;
}

export function parametrizeTwisted(
  complex: AssembledComplex,
  cut: TreeCotreeCut,
  surface: 'klein' | 'rp2',
  jitter: number,
): TwistedParam {
  const edgeById = new Map(complex.edges.map((e) => [e.id, e]));
  const toBody: (p: V2) => Vec3 =
    surface === 'klein'
      ? (p) => immersionPosition('klein', p[0], p[1]) // Γ-equivariant on raw reals (probed below)
      : (p) => {
          const r = reduceRp2(p);
          return immersionPosition('rp2', r[0], r[1]);
        };
  if (surface === 'klein') {
    // the equivariance the drawing leans on, probed loudly: F(u+1, v) = F(u, −v)
    for (const [pu, pv] of [
      [0.23, 0.41],
      [0.77, 0.9],
    ] as V2[]) {
      const a = immersionPosition('klein', pu + 1, pv);
      const b = immersionPosition('klein', pu, -pv);
      if (Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) > 1e-9) {
        throw new Error('laidBodyModel: the klein body is not gluing-equivariant — refusing to lay');
      }
    }
  }

  // ── disk instances: (face, corner), glued along the dual tree ──
  const ringSize = complex.faces.map((f) => f.boundary.length);
  const bases: number[] = [];
  let total = 0;
  complex.faces.forEach((f, fi) => {
    bases.push(total);
    total += ringSize[fi];
  });
  const parent = Array.from({ length: total }, (_, i) => i);
  const find = (x: number): number => {
    let root = x;
    while (parent[root] !== root) root = parent[root];
    let at = x;
    while (parent[at] !== root) {
      const next = parent[at];
      parent[at] = root;
      at = next;
    }
    return root;
  };
  const union = (a: number, b: number): void => {
    parent[find(a)] = find(b);
  };
  const instOf = (fi: number, corner: number): number =>
    bases[fi] + ((corner % ringSize[fi]) + ringSize[fi]) % ringSize[fi];
  // a side (fi, slot s, dir d): the edge's u-end corner is s when d=1, s+1 when d=−1
  const uEnd = (fi: number, s: number, d: 1 | -1): number => instOf(fi, d === 1 ? s : s + 1);
  const vEnd = (fi: number, s: number, d: 1 | -1): number => instOf(fi, d === 1 ? s + 1 : s);
  const inC = new Set(cut.dualTreeEdgeIds);
  for (const id of cut.dualTreeEdgeIds) {
    const [r1, r2] = cut.slotsOf.get(id) as SlotRef[];
    union(uEnd(r1.face, r1.slot, r1.dir), uEnd(r2.face, r2.slot, r2.dir));
    union(vEnd(r1.face, r1.slot, r1.dir), vEnd(r2.face, r2.slot, r2.dir));
  }
  const rootIndex = new Map<number, number>();
  for (let i = 0; i < total; i += 1) {
    const r = find(i);
    if (!rootIndex.has(r)) rootIndex.set(r, rootIndex.size);
  }
  const nodeOf = (i: number): number => rootIndex.get(find(i)) as number;
  const nodes = rootIndex.size;
  const classOfCorner = (fi: number, k: number): string => {
    const slot = complex.faces[fi].boundary[k];
    const e = edgeById.get(slot.edge) as AssembledComplex['edges'][number];
    return slot.dir === 1 ? e.u : e.v;
  };

  // ── the energy (uniform weights + optional deterministic nudge jitter) ──
  const weightOf = (a: number, b: number): number =>
    1 + jitter * 0.002 * ((((a + 1) * 73856093) ^ ((b + 1) * 19349663)) % 97) / 97;
  const terms: Array<{ a: number; b: number; w: number }> = [];
  complex.faces.forEach((f, fi) => {
    const n = ringSize[fi];
    for (let k = 0; k < n; k += 1) {
      terms.push({ a: nodeOf(instOf(fi, k)), b: nodeOf(instOf(fi, k + 1)), w: weightOf(bases[fi] + k, 1) });
    }
    for (let k = 2; k <= n - 2; k += 1) {
      terms.push({ a: nodeOf(instOf(fi, 0)), b: nodeOf(instOf(fi, k)), w: weightOf(bases[fi], k) });
    }
  });

  // ── the seams (cut edges): reversing?, pin combos, constraints ──
  const seams = [...cut.treeEdgeIds, ...cut.cutEdgeIds].map((id) => {
    const [r1, r2] = cut.slotsOf.get(id) as SlotRef[];
    const reversing = cut.faceFlips[r1.face] * r1.dir * cut.faceFlips[r2.face] * r2.dir === 1;
    return {
      id,
      reversing,
      isX: cut.cutEdgeIds.includes(id),
      u1: nodeOf(uEnd(r1.face, r1.slot, r1.dir)),
      v1: nodeOf(vEnd(r1.face, r1.slot, r1.dir)),
      u2: nodeOf(uEnd(r2.face, r2.slot, r2.dir)),
      v2: nodeOf(vEnd(r2.face, r2.slot, r2.dir)),
    };
  });
  if (inC.size + seams.length !== complex.edges.length) {
    throw new Error('laidBodyModel: the cut does not partition the edges — refusing to lay');
  }
  const revSeams = seams.filter((s) => s.reversing);
  if (revSeams.length === 0) {
    throw new Error(
      'laidBodyModel: a non-orientable complex whose cut carries no reversing seam — the flip census disagrees; refusing to lay',
    );
  }
  type Pin = { M: M2; t: V2 };
  // A MARKING is an anchor generator (a reversing seam pinned to the body's
  // own gluing element — only its translation's PARITY class is gauge-free,
  // so both classes are tried) plus, when the relaxation needs the second
  // direction injected, one preserving seam pinned as the other generator.
  // Every OTHER seam's translation is found by SEQUENTIAL round-and-repin:
  // pin one, re-solve, pin the next — the surface group's own relations then
  // force the last ones exact (independent rounding would break them).
  // anchor enumeration: the census orders the candidates (reversing first,
  // excess before tree) but does not gate them — the true flip generator may
  // sit on a census-"preserving" seam in the disk's gauge
  const orderedSeams = [
    ...revSeams.filter((s) => s.isX),
    ...revSeams.filter((s) => !s.isX),
    ...seams.filter((s) => !s.reversing && s.isX),
    ...seams.filter((s) => !s.reversing && !s.isX),
  ];
  const combos: Array<Map<string, Pin>> = [];
  if (surface === 'klein') {
    const preserving = seams.filter((s) => !s.reversing);
    for (const anchor of orderedSeams.slice(0, 4)) {
      for (const tA of [
        [1, 0],
        [1, 1],
      ] as V2[]) {
        combos.push(new Map([[anchor.id, { M: M_FLIP_V, t: tA }]]));
        for (const s2 of preserving) {
          if (s2.id === anchor.id) continue;
          for (const tB of [
            [0, 1],
            [0, -1],
          ] as V2[]) {
            combos.push(
              new Map([
                [anchor.id, { M: M_FLIP_V, t: tA }],
                [s2.id, { M: M_ID, t: tB }],
              ]),
            );
          }
        }
      }
    }
  } else {
    for (const anchor of orderedSeams.slice(0, 4)) {
      combos.push(new Map([[anchor.id, { M: M_FLIP_V, t: [1, 1] }]]));
      combos.push(new Map([[anchor.id, { M: M_FLIP_U, t: [1, 1] }]]));
    }
  }

  // parity table: which affine elements the body's group actually contains.
  //   klein Γ = {(u+m, (−1)^m v + n)} — v-flip ⟺ odd u-translation;
  //   rp2  Γ = ⟨(1−u, v+1), (u+1, 1−v)⟩ — ONE axis flipped ⟺ odd/odd
  //   translations; zero or BOTH axes flipped ⟺ even/even.
  const flipCount = (m: M2): number => (m[0] < 0 ? 1 : 0) + (m[3] < 0 ? 1 : 0);
  const parityOk = (m: M2, t: V2): boolean => {
    const ti = [Math.round(t[0]), Math.round(t[1])];
    if (Math.abs(t[0] - ti[0]) > 1e-6 || Math.abs(t[1] - ti[1]) > 1e-6) return false;
    const uOdd = ((ti[0] % 2) + 2) % 2 === 1;
    const vOdd = ((ti[1] % 2) + 2) % 2 === 1;
    if (surface === 'klein') {
      if (flipCount(m) === 0) return !uOdd;
      return uOdd; // v-flip ⟺ odd u-translation
    }
    if (flipCount(m) === 1) return uOdd && vOdd;
    return !uOdd && !vOdd;
  };

  // one KKT solve for a given pin assignment (free seams carry difference
  // rows); constraint rows are rank-reduced first so a CONSISTENT redundant
  // system still solves and an inconsistent one refuses loudly
  const N = 2 * nodes;
  const A = Array.from({ length: N }, () => new Array<number>(N).fill(0));
  for (const t of terms) {
    if (t.a === t.b) continue;
    for (const c of [0, 1]) {
      A[2 * t.a + c][2 * t.a + c] += t.w;
      A[2 * t.b + c][2 * t.b + c] += t.w;
      A[2 * t.a + c][2 * t.b + c] -= t.w;
      A[2 * t.b + c][2 * t.a + c] -= t.w;
    }
  }
  let rootAt: V2 = [0.2027, 0.3211];
  const solveWith = (pinsAll: Map<string, Pin>): V2[] => {
    const C: number[][] = [];
    const d: number[] = [];
    const addRow = (coeffs: Array<[number, number, number]>, rhs: number): void => {
      const row = new Array<number>(N).fill(0);
      for (const [node, comp, val] of coeffs) row[2 * node + comp] += val;
      C.push(row);
      d.push(rhs);
    };
    for (const s of seams) {
      const pin = pinsAll.get(s.id);
      // an UNCHOSEN seam contributes NO equation — its linear class is still
      // a guess, and a guess must never be a hard constraint (the disk stays
      // coupled through its own faces; the greedy reads the relaxed layout)
      if (!pin) continue;
      const M = pin.M;
      // q(end₂) = M q(end₁) + t
      for (const [n2, n1] of [
        [s.u2, s.u1],
        [s.v2, s.v1],
      ]) {
        addRow([[n2, 0, 1], [n1, 0, -M[0]], [n1, 1, -M[1]]], pin.t[0]);
        addRow([[n2, 1, 1], [n1, 0, -M[2]], [n1, 1, -M[3]]], pin.t[1]);
      }
    }
    // the representative instance's pin: the CLEAN value sits off the locus
    // (a root parked on it would hand its vertex class to the ghost by
    // fiat); the LATTICE fallback lets a group-FORCED cone vertex sit where
    // the body demands (rp2's π-cones live on half-lattice points — such a
    // vertex can never satisfy an off-lattice root, and it gets ghosted)
    addRow([[0, 0, 1]], rootAt[0]);
    addRow([[0, 1, 1]], rootAt[1]);
    // rank-reduce [C | d]: drop dependent rows when consistent, refuse when not
    const rowsR = C.map((row, r) => [...row, d[r]]);
    const kept: number[][] = [];
    for (const row of rowsR) {
      const work = [...row];
      for (const lead of kept) {
        let pivotCol = -1;
        for (let j = 0; j < N; j += 1) {
          if (Math.abs(lead[j]) > 1e-9) {
            pivotCol = j;
            break;
          }
        }
        if (pivotCol < 0) continue;
        const f = work[pivotCol] / lead[pivotCol];
        if (f !== 0) for (let j = 0; j <= N; j += 1) work[j] -= f * lead[j];
      }
      const maxCoef = Math.max(...work.slice(0, N).map((x) => Math.abs(x)));
      if (maxCoef > 1e-9) {
        kept.push(work);
      } else if (Math.abs(work[N]) > 1e-7) {
        throw new Error('inconsistent seam pins');
      }
    }
    const K = N + kept.length;
    const KKT = Array.from({ length: K }, () => new Array<number>(K).fill(0));
    const rhs = Array.from({ length: K }, () => [0]);
    for (let i = 0; i < N; i += 1) for (let j = 0; j < N; j += 1) KKT[i][j] = A[i][j];
    kept.forEach((row, r) => {
      for (let j = 0; j < N; j += 1) {
        KKT[N + r][j] = row[j];
        KKT[j][N + r] = row[j];
      }
      rhs[N + r][0] = row[N];
    });
    if (jitter > 0) {
      // THE NUDGE (LAW C): a deterministic force bias, strong enough to move
      // a symmetric layout's cells VISIBLY off the locus; the seams stay
      // exact equations, so the same gates verify the nudged layout whole
      for (let k = 0; k < nodes; k += 1) {
        const h1 = ((((k + 3) * 2654435761) >>> 0) % 997) / 997 - 0.5;
        const h2 = ((((k + 11) * 1103515245) >>> 0) % 991) / 991 - 0.5;
        if (surface !== 'klein') rhs[2 * k][0] += jitter * 0.12 * h1;
        rhs[2 * k + 1][0] += jitter * 0.12 * h2;
      }
    }
    const solved = solveDense(KKT, rhs);
    const q: V2[] = Array.from({ length: nodes }, (_, k) => [solved[2 * k][0], solved[2 * k + 1][0]]);
    if (q.some((p) => !Number.isFinite(p[0]) || !Number.isFinite(p[1]))) throw new Error('non-finite layout');
    return q;
  };
  // the nearest translation the body's group actually contains
  const roundLegal = (m: M2, t: V2): V2 => {
    const out: V2 = [Math.round(t[0]), Math.round(t[1])];
    const fixToward = (k: 0 | 1): void => {
      out[k] += t[k] >= out[k] ? 1 : -1;
    };
    if (surface === 'klein') {
      const flip = m[3] === -1;
      const uOdd = ((out[0] % 2) + 2) % 2 === 1;
      if (flip !== uOdd) fixToward(0);
    } else {
      const wantOdd = flipCount(m) === 1;
      for (const k of [0, 1] as const) {
        const odd = ((out[k] % 2) + 2) % 2 === 1;
        if (odd !== wantOdd) fixToward(k);
      }
    }
    return out;
  };
  // the linear classes a seam may wear on this body. The flip census's
  // reversing/preserving label is GAUGE-RELATIVE (re-flipping a face moves
  // the label between cohomologous seam sets), so the census only ORDERS the
  // candidates — every legal class stays on offer; the greedy picks by
  // rounding residual and the parity/3D gates judge the truth.
  const seamMCandidates = (reversing: boolean): M2[] => {
    if (surface === 'klein') return reversing ? [M_FLIP_V, M_ID] : [M_ID, M_FLIP_V];
    return reversing ? [M_FLIP_V, M_FLIP_U, M_ID, M_NEG] : [M_ID, M_NEG, M_FLIP_V, M_FLIP_U];
  };

  const comboFailures: string[] = [];
  for (const rootCandidate of [
    [0.2027, 0.3211],
    [0, 0],
  ] as V2[]) {
  rootAt = rootCandidate;
  for (const combo of combos) {
    try {
      // SEQUENTIAL ROUND-AND-REPIN: relax, pin the next free seam at its
      // nearest legal group element (its linear class chosen GREEDILY by
      // rounding residual — rp2 seams may wear I, −I, or either flip),
      // re-solve, repeat — the surface group's own relations then force the
      // tail translations exact (rounding all seams independently would
      // break the relations). The gates judge only the final layout.
      const allPins = new Map(combo);
      let qCur = solveWith(allPins);
      for (const s of seams) {
        if (allPins.has(s.id)) continue;
        // candidate elements from BOTH endpoint pairs (at the relaxed stage
        // they may disagree — the u-pair can sit satisfied while the v-pair
        // names the true translation), then TRY-AND-VERIFY: the solver
        // itself adjudicates each candidate against the group's relations
        const candidates: Array<{ pin: Pin; score: number }> = [];
        for (const M of seamMCandidates(s.reversing)) {
          const tU = sub2(qCur[s.u2], mulM(M, qCur[s.u1]));
          const tV = sub2(qCur[s.v2], mulM(M, qCur[s.v1]));
          const mid: V2 = [(tU[0] + tV[0]) / 2, (tU[1] + tV[1]) / 2];
          for (const guess of [tU, tV, mid]) {
            const t = roundLegal(M, guess);
            if (candidates.some((c) => c.pin.M === M && c.pin.t[0] === t[0] && c.pin.t[1] === t[1])) continue;
            const score =
              Math.hypot(tU[0] - t[0], tU[1] - t[1]) + Math.hypot(tV[0] - t[0], tV[1] - t[1]);
            candidates.push({ pin: { M, t }, score });
          }
        }
        candidates.sort((a, b) => a.score - b.score);
        let solved: V2[] | null = null;
        let chosen: Pin | null = null;
        for (const c of candidates.slice(0, 8)) {
          try {
            allPins.set(s.id, c.pin);
            solved = solveWith(allPins);
            chosen = c.pin;
            break;
          } catch {
            allPins.delete(s.id);
          }
        }
        if (!solved || !chosen) {
          throw new Error(`seam "${s.id}" admits no legal gluing at this marking`);
        }
        qCur = solved;
      }
      const q = qCur;

      // gate 1 — every seam is EXACTLY a body gluing on the final layout
      for (const s of seams) {
        const M = (allPins.get(s.id) as Pin).M;
        const tU = sub2(q[s.u2], mulM(M, q[s.u1]));
        const tV = sub2(q[s.v2], mulM(M, q[s.v1]));
        if (Math.hypot(tU[0] - tV[0], tU[1] - tV[1]) > 1e-6) throw new Error(`seam "${s.id}" shears`);
        if (!parityOk(M, tU)) throw new Error(`seam "${s.id}" translation (${tU}) is not a body gluing`);
      }
      // gate 2 — faces lay one-sign
      const faceRings: V2[][] = complex.faces.map((f, fi) =>
        f.boundary.map((_, k) => q[nodeOf(instOf(fi, k))]),
      );
      const areas: number[] = [];
      faceRings.forEach((ring, fi) => {
        for (let k = 1; k < ring.length - 1; k += 1) {
          const area =
            0.5 *
            ((ring[k][0] - ring[0][0]) * (ring[k + 1][1] - ring[0][1]) -
              (ring[k][1] - ring[0][1]) * (ring[k + 1][0] - ring[0][0]));
          areas.push(area * cut.faceFlips[fi]);
        }
      });
      const oneSign = areas.every((a) => a > 1e-9) || areas.every((a) => a < -1e-9);
      if (!oneSign) throw new Error('the twisted layout folds over');
      // gate 3 — every vertex class agrees in 3D across its instances
      const classPos = new Map<string, V2>();
      complex.faces.forEach((f, fi) => {
        f.boundary.forEach((_, k) => {
          const cls = classOfCorner(fi, k);
          const p = q[nodeOf(instOf(fi, k))];
          const seen = classPos.get(cls);
          if (!seen) {
            classPos.set(cls, p);
          } else {
            const a = toBody(seen);
            const b = toBody(p);
            if (Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) > 1e-5) {
              throw new Error(`vertex class "${cls}" disagrees across sheets`);
            }
          }
        });
      });
      for (const v of complex.vertices) {
        if (!classPos.has(v)) throw new Error(`vertex class "${v}" never laid`);
      }
      // gate 4 — every seam's two sides draw the SAME 3D curve
      for (const s of seams) {
        for (let step = 0; step <= 8; step += 1) {
          const t = step / 8;
          const p1: V2 = [
            q[s.u1][0] + (q[s.v1][0] - q[s.u1][0]) * t,
            q[s.u1][1] + (q[s.v1][1] - q[s.u1][1]) * t,
          ];
          const p2: V2 = [
            q[s.u2][0] + (q[s.v2][0] - q[s.u2][0]) * t,
            q[s.u2][1] + (q[s.v2][1] - q[s.u2][1]) * t,
          ];
          const a = toBody(p1);
          const b = toBody(p2);
          if (Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) > 1e-5) {
            throw new Error(`seam "${s.id}" sides diverge in 3D`);
          }
        }
      }
      const edgeEnds = new Map<string, [V2, V2]>();
      for (const s of seams) edgeEnds.set(s.id, [q[s.u1], q[s.v1]]);
      for (const id of cut.dualTreeEdgeIds) {
        const [r1] = cut.slotsOf.get(id) as SlotRef[];
        edgeEnds.set(id, [q[nodeOf(uEnd(r1.face, r1.slot, r1.dir))], q[nodeOf(vEnd(r1.face, r1.slot, r1.dir))]]);
      }
      return {
        surface,
        classPos,
        faceRings,
        edgeEnds,
        foldover: { areas, oneSign },
        toBody,
        reduce: surface === 'klein' ? reduceKlein : reduceRp2,
      };
    } catch (error) {
      const pinned = [...combo.entries()]
        .map(([id, p]) => `${id.slice(0, 18)}→(${p.t})${p.M[3] < 0 ? 'v̄' : p.M[0] < 0 ? 'ū' : ''}`)
        .join(',');
      comboFailures.push(`{${pinned}}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  }
  throw new Error(
    `laidBodyModel: no gated twisted layout — ${comboFailures.slice(0, 10).join(' · ') || 'no candidate marking'} — the class body stands`,
  );
}

// ---------------------------------------------------------------------------
// the DOUBLE LOCUS — computed per body from the committed formulas, never a
// sampled search:
//   klein (figure-8): the cross-section curve (sin vv, sin 2vv) meets itself
//     exactly where BOTH vanish — vv ∈ {0, π}, i.e. v ≡ 0 and v ≡ ½ (mod 1),
//     every u; both circles land on the ONE central circle of radius S·C.
//     The sheet pairing is (u, 0) ↔ (u, ½).
//   rp2 (cross-cap): sin 2v_c ≥ 0 on the chart, so doubles need sin 2v_c = 0
//     — the chart's PERIMETER (ρ = 1), which maps 2:1 (beyond the gluing)
//     onto the Whitney segment x = y = 0, z ∈ [−½·S, 0]; the sheet pairing
//     is the mirror (u, v) ↔ (1−u, v), pinches at u = ½.
// ---------------------------------------------------------------------------

export interface CrossingModel {
  body: 'klein' | 'rp2';
  caption: string; // the designer's declaration — the MAP's crossing, never a cell
  count: number; // countable TRANSVERSAL crossings of laid edge curves
  locusCurves: Vec3[][]; // the pale-broken ghost's own polylines (computed)
  crossings: Array<{
    edgeId: string;
    t: number;
    uv: [number, number];
    point: Vec3;
    partnerUv: [number, number];
    partner: { kind: 'vertex' | 'face' | 'edge'; id: string };
  }>;
  // a PERSON'S OWN vertex whose (u,v) lands ON the locus is GHOSTED, never
  // refused and never re-minted: both sheets meet at one 3D point (on rp2
  // the two π-cone vertices are FORCED there by the chart group itself —
  // exactly the mandate's "two cells at one 3D point")
  vertexGhosts: Array<{
    vertexId: string;
    uv: [number, number];
    point: Vec3;
    partnerUv: [number, number];
    partner: { kind: 'vertex' | 'face' | 'edge'; id: string };
  }>;
  // an edge whose straight chart chord would LIE ALONG the locus is NUDGED
  // OFF as a drawn BOW (an arc into the chart's interior — a depiction
  // choice, like the fan's arcs; no metric claim): the ghost then never
  // runs along a cell edge, and the bow's endpoints stay declared ghosts
  bowedEdges: Array<{ edgeId: string; points: Vec3[] }>;
  brokenEdges: Array<{ edgeId: string; segments: Vec3[][]; stubs: Vec3[][] }>;
  ghostFloor: number;
}

const KLEIN_S = 1.4;
const KLEIN_C = 2;
const RP2_S = 5.5;

// exported since P4 FIX-FORWARD: the view's crossing hull ghosts against the
// same computed locus the register declares
export function locusCurves3(body: 'klein' | 'rp2'): Vec3[][] {
  if (body === 'klein') {
    const circle: Vec3[] = [];
    for (let k = 0; k <= 96; k += 1) {
      const theta = (2 * Math.PI * k) / 96;
      circle.push([KLEIN_S * KLEIN_C * Math.cos(theta), 0, KLEIN_S * KLEIN_C * Math.sin(theta)]);
    }
    return [circle];
  }
  const segment: Vec3[] = [];
  for (let k = 0; k <= 16; k += 1) {
    segment.push([0, RP2_S * (-0.5 + (0.5 * k) / 16), 0]);
  }
  return [segment];
}

// ---------------------------------------------------------------------------
// P4 FIX-FORWARD — the crossing hull (the self-crossing bodies' silhouette).
// An inverted hull needs a consistently wound mesh, and a NON-ORIENTABLE
// immersion cannot have one: the plain hull read as a black tangle (winding
// flips showed front-side hull patches, and the far sheet's displaced hull
// poked through the near sheet all along the crossing). The cure, two moves:
//   · the ORIENTED DOUBLE COVER — every triangle rides twice, displaced +n
//     and −n with opposite windings; back-face culling then behaves exactly
//     as on an orientable shell (the double cover of any surface IS
//     orientable), so the strong ink survives only past the true outer
//     silhouette;
//   · the LOCUS YIELDS — a hull triangle within ε of the computed double
//     locus joins the GHOST bucket (pale, the register's own convention):
//     the strong ink NEVER rides the crossing. A self-crossing is the
//     double locus, and it wears the ghost, never the black hull.
// Pure arrays in/out — headless-testable; the view only wraps the buckets.
// ---------------------------------------------------------------------------

export const CROSSING_HULL_EPSILON = 0.45; // world units — the locus's yield halo

export interface CrossingHull {
  positions: number[]; // the double cover: outer copies [0..n), inner copies [n..2n)
  strongIndices: number[]; // triangles wholly ≥ ε off the locus — the strong silhouette ink
  ghostIndices: number[]; // triangles touching the locus halo — the pale ghost ink
}

function pointSegmentDistance(p: Vec3, a: Vec3, b: Vec3): number {
  const abx = b[0] - a[0];
  const aby = b[1] - a[1];
  const abz = b[2] - a[2];
  const len2 = abx * abx + aby * aby + abz * abz;
  const t =
    len2 === 0
      ? 0
      : Math.max(0, Math.min(1, ((p[0] - a[0]) * abx + (p[1] - a[1]) * aby + (p[2] - a[2]) * abz) / len2));
  return Math.hypot(p[0] - a[0] - abx * t, p[1] - a[1] - aby * t, p[2] - a[2] - abz * t);
}

export function buildCrossingHull(
  positions: number[],
  indices: number[],
  weight: number,
  locusCurves: Vec3[][],
  epsilon = CROSSING_HULL_EPSILON,
): CrossingHull {
  const n = positions.length / 3;
  // per-vertex normals: accumulated triangle normals, normalized (plain JS)
  const normals = new Float64Array(positions.length);
  for (let t = 0; t < indices.length; t += 3) {
    const ia = indices[t];
    const ib = indices[t + 1];
    const ic = indices[t + 2];
    const ux = positions[3 * ib] - positions[3 * ia];
    const uy = positions[3 * ib + 1] - positions[3 * ia + 1];
    const uz = positions[3 * ib + 2] - positions[3 * ia + 2];
    const vx = positions[3 * ic] - positions[3 * ia];
    const vy = positions[3 * ic + 1] - positions[3 * ia + 1];
    const vz = positions[3 * ic + 2] - positions[3 * ia + 2];
    const cx = uy * vz - uz * vy;
    const cy = uz * vx - ux * vz;
    const cz = ux * vy - uy * vx;
    for (const i of [ia, ib, ic]) {
      normals[3 * i] += cx;
      normals[3 * i + 1] += cy;
      normals[3 * i + 2] += cz;
    }
  }
  for (let i = 0; i < n; i += 1) {
    const len = Math.hypot(normals[3 * i], normals[3 * i + 1], normals[3 * i + 2]);
    if (len > 1e-12) {
      normals[3 * i] /= len;
      normals[3 * i + 1] /= len;
      normals[3 * i + 2] /= len;
    }
  }
  // the locus halo, per vertex (distance to the computed curves' segments)
  const nearLocus = new Uint8Array(n);
  for (let i = 0; i < n; i += 1) {
    const p: Vec3 = [positions[3 * i], positions[3 * i + 1], positions[3 * i + 2]];
    let near = false;
    for (const curve of locusCurves) {
      for (let k = 0; k + 1 < curve.length && !near; k += 1) {
        if (pointSegmentDistance(p, curve[k], curve[k + 1]) <= epsilon) near = true;
      }
      if (near) break;
    }
    nearLocus[i] = near ? 1 : 0;
  }
  // the double cover: outer (+n·w, original winding) then inner (−n·w,
  // reversed winding) — one shared position array, per-bucket indices
  const doubled = new Array<number>(positions.length * 2);
  for (let i = 0; i < n; i += 1) {
    doubled[3 * i] = positions[3 * i] + normals[3 * i] * weight;
    doubled[3 * i + 1] = positions[3 * i + 1] + normals[3 * i + 1] * weight;
    doubled[3 * i + 2] = positions[3 * i + 2] + normals[3 * i + 2] * weight;
    doubled[3 * (n + i)] = positions[3 * i] - normals[3 * i] * weight;
    doubled[3 * (n + i) + 1] = positions[3 * i + 1] - normals[3 * i + 1] * weight;
    doubled[3 * (n + i) + 2] = positions[3 * i + 2] - normals[3 * i + 2] * weight;
  }
  const strongIndices: number[] = [];
  const ghostIndices: number[] = [];
  for (let t = 0; t < indices.length; t += 3) {
    const ia = indices[t];
    const ib = indices[t + 1];
    const ic = indices[t + 2];
    const bucket = nearLocus[ia] || nearLocus[ib] || nearLocus[ic] ? ghostIndices : strongIndices;
    bucket.push(ia, ib, ic); // the outer cover
    bucket.push(n + ia, n + ic, n + ib); // the inner cover, winding reversed
  }
  return { positions: doubled, strongIndices, ghostIndices };
}

function buildCrossingModel(
  complex: AssembledComplex,
  param: TwistedParam,
  shape: Shape,
): { model: CrossingModel; aligned: boolean } {
  const EPS_ALIGN = 1e-3;
  const body = param.surface;
  let aligned = false;
  // a vertex whose (u,v) LANDS on the locus is GHOSTED — both sheets named,
  // one 3D point — never refused and never re-minted (LAW C bars MINTING a
  // cell on the crossing; the person's own cell landing there is the very
  // case the register exists to declare). On rp2 this is forced: the chart
  // group puts its two π-cone vertices exactly on the Whitney segment.
  const vertexGhosts: CrossingModel['vertexGhosts'] = [];
  for (const [vertexId, p] of param.classPos) {
    if (body === 'klein') {
      const twice = p[1] * 2;
      if (Math.abs(twice - Math.round(twice)) < EPS_ALIGN) {
        const partnerUv: V2 = [p[0], p[1] + 0.5];
        vertexGhosts.push({
          vertexId,
          uv: [p[0], p[1]],
          point: param.toBody(p),
          partnerUv: [partnerUv[0], partnerUv[1]],
          partner: locatePartnerCell(partnerUv, null, vertexId),
        });
      }
    } else {
      const r = param.reduce(p);
      if (
        Math.min(Math.abs(r[0]), Math.abs(1 - r[0]), Math.abs(r[1]), Math.abs(1 - r[1])) < EPS_ALIGN
      ) {
        const partnerUv: V2 = [1 - r[0], r[1]];
        vertexGhosts.push({
          vertexId,
          uv: [r[0], r[1]],
          point: param.toBody(p),
          partnerUv: [partnerUv[0], partnerUv[1]],
          partner: locatePartnerCell(partnerUv, null, vertexId),
        });
      }
    }
  }
  for (const g of vertexGhosts) {
    const there = param.toBody(g.partnerUv);
    if (Math.hypot(g.point[0] - there[0], g.point[1] - there[1], g.point[2] - there[2]) > 1e-5) {
      throw new Error('laidBodyModel: a vertex ghost\'s sheet pairing disagrees with the body — refusing');
    }
  }
  const crossings: CrossingModel['crossings'] = [];
  const crossingsByEdge = new Map<string, number[]>();
  const alignedEdges: Array<{ edgeId: string; a: V2; b: V2 }> = [];
  for (const e of complex.edges) {
    const [a, b] = param.edgeEnds.get(e.id) as [V2, V2];
    const ts: number[] = [];
    const record = (t: number, uv: V2, partnerUv: V2): void => {
      ts.push(t);
      const point = param.toBody(uv);
      const partnerPoint = param.toBody(partnerUv);
      if (
        Math.hypot(point[0] - partnerPoint[0], point[1] - partnerPoint[1], point[2] - partnerPoint[2]) > 1e-5
      ) {
        throw new Error('laidBodyModel: the computed sheet pairing disagrees with the body — refusing');
      }
      crossings.push({
        edgeId: e.id,
        t,
        uv: [uv[0], uv[1]],
        point,
        partnerUv: [partnerUv[0], partnerUv[1]],
        partner: locatePartnerCell(partnerUv, e.id, null),
      });
    };
    if (body === 'klein') {
      const dv = b[1] - a[1];
      const onLocus = (v: number): boolean => Math.abs(v * 2 - Math.round(v * 2)) < EPS_ALIGN;
      if (Math.abs(dv) < EPS_ALIGN) {
        if (onLocus(a[1])) alignedEdges.push({ edgeId: e.id, a, b }); // runs ALONG a locus circle → bow
      } else {
        const lo = Math.min(a[1], b[1]);
        const hi = Math.max(a[1], b[1]);
        for (let k = Math.ceil(lo * 2 - 1e-9); k <= Math.floor(hi * 2 + 1e-9); k += 1) {
          const t = (k / 2 - a[1]) / dv;
          if (t <= 1e-4 || t >= 1 - 1e-4) continue;
          const uv: V2 = [a[0] + (b[0] - a[0]) * t, k / 2];
          record(t, uv, [uv[0], uv[1] + 0.5]);
        }
      }
    } else {
      for (const axis of [0, 1] as const) {
        const da = b[axis] - a[axis];
        const onInt = (x: number): boolean => Math.abs(x - Math.round(x)) < EPS_ALIGN;
        if (Math.abs(da) < EPS_ALIGN) {
          if (onInt(a[axis]) && !alignedEdges.some((x) => x.edgeId === e.id)) {
            alignedEdges.push({ edgeId: e.id, a, b }); // rides the perimeter → bow
          }
          continue;
        }
        const lo = Math.min(a[axis], b[axis]);
        const hi = Math.max(a[axis], b[axis]);
        for (let k = Math.ceil(lo - 1e-9); k <= Math.floor(hi + 1e-9); k += 1) {
          const t = (k - a[axis]) / da;
          if (t <= 1e-4 || t >= 1 - 1e-4) continue;
          const raw: V2 = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
          const at = param.reduce(raw);
          record(t, raw, mirrorRp2Partner(at, raw));
        }
      }
    }
    ts.sort((x, y) => x - y);
    crossingsByEdge.set(e.id, ts);
  }

  function mirrorRp2Partner(reduced: V2, raw: V2): V2 {
    // the crossing partner on the perimeter is the u-mirror (1−u, v); return
    // it in the RAW segment's own chart neighbourhood so toBody agrees
    void raw;
    return [1 - reduced[0], reduced[1]];
  }

  function locatePartnerCell(
    partnerUv: V2,
    selfEdgeId: string | null,
    selfVertexId: string | null,
  ): { kind: 'vertex' | 'face' | 'edge'; id: string } {
    // candidates: the partner and its nearby group images, tested against the
    // laid VERTICES first (a vertex ghost's other sheet is often the other
    // cone vertex), then the edges (edge×edge crossings name both edges),
    // then the faces
    const candidates: V2[] = [];
    const range = 3;
    for (let m = -range; m <= range; m += 1) {
      for (let n = -range; n <= range; n += 1) {
        if (param.surface === 'klein') {
          const sign = ((m % 2) + 2) % 2 === 1 ? -1 : 1;
          candidates.push([partnerUv[0] + m, sign * partnerUv[1] + n]);
        } else {
          for (const [su, sv] of [
            [1, 1],
            [1, -1],
            [-1, 1],
            [-1, -1],
          ]) {
            const uOdd = ((m % 2) + 2) % 2 === 1;
            const nOdd = ((n % 2) + 2) % 2 === 1;
            const legal =
              (su === 1 && sv === 1 && !uOdd && !nOdd) ||
              (su === 1 && sv === -1 && uOdd && nOdd) ||
              (su === -1 && sv === 1 && uOdd && nOdd) ||
              (su === -1 && sv === -1 && !uOdd && !nOdd);
            if (legal) candidates.push([su * partnerUv[0] + m, sv * partnerUv[1] + n]);
          }
        }
      }
    }
    const distToSegment = (p: V2, a: V2, b: V2): number => {
      const ab: V2 = [b[0] - a[0], b[1] - a[1]];
      const len2 = ab[0] * ab[0] + ab[1] * ab[1];
      const t = len2 < 1e-12 ? 0 : Math.max(0, Math.min(1, ((p[0] - a[0]) * ab[0] + (p[1] - a[1]) * ab[1]) / len2));
      return Math.hypot(p[0] - (a[0] + ab[0] * t), p[1] - (a[1] + ab[1] * t));
    };
    for (const [id, pos] of param.classPos) {
      if (id === selfVertexId) continue;
      for (const c of candidates) {
        if (Math.hypot(c[0] - pos[0], c[1] - pos[1]) < 2e-3) return { kind: 'vertex', id };
      }
    }
    for (const [id, [a, b]] of param.edgeEnds) {
      if (id === selfEdgeId) continue;
      for (const c of candidates) {
        if (distToSegment(c, a, b) < 2e-3) return { kind: 'edge', id };
      }
    }
    const inRing = (p: V2, ring: V2[]): boolean => {
      let inside = false;
      for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
        const yi = ring[i][1];
        const yj = ring[j][1];
        if (yi > p[1] !== yj > p[1]) {
          const x = ring[j][0] + ((p[1] - yj) / (yi - yj)) * (ring[i][0] - ring[j][0]);
          if (p[0] < x) inside = !inside;
        }
      }
      return inside;
    };
    for (let fi = 0; fi < param.faceRings.length; fi += 1) {
      for (const c of candidates) {
        if (inRing(c, param.faceRings[fi])) {
          return { kind: 'face', id: shape.faces[fi]?.id ?? `face-class:${fi}` };
        }
      }
    }
    // the locus point must sit ON the drawn surface somewhere — else refuse
    throw new Error('laidBodyModel: a crossing partner lands on no laid cell — refusing');
  }

  // THE BOW (the nudge for an edge lying ALONG the locus): the drawn curve
  // arcs into the chart's interior — off the locus everywhere except its
  // endpoints, which stay declared vertex ghosts. A zero-chord aligned edge
  // cannot bow; that one keeps the retry/wall path.
  const bowedIds = new Set(alignedEdges.map((x) => x.edgeId));
  const bowedEdges: CrossingModel['bowedEdges'] = [];
  for (const { edgeId, a, b } of alignedEdges) {
    const chord = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (chord < 1e-6) {
      aligned = true;
      continue;
    }
    const mid: V2 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    let inward: V2 = [0, 1];
    if (body === 'rp2') {
      const r = param.reduce(mid);
      const toCenter: V2 = [0.5 - r[0], 0.5 - r[1]];
      const len = Math.hypot(toCenter[0], toCenter[1]) || 1;
      inward = [toCenter[0] / len, toCenter[1] / len];
    }
    const sag = 0.16;
    const ctrl: V2 = [mid[0] + inward[0] * sag, mid[1] + inward[1] * sag];
    const points: Vec3[] = [];
    for (let s = 0; s <= 28; s += 1) {
      const t = s / 28;
      const w0 = (1 - t) * (1 - t);
      const w1 = 2 * (1 - t) * t;
      const w2 = t * t;
      points.push(
        param.toBody([w0 * a[0] + w1 * ctrl[0] + w2 * b[0], w0 * a[1] + w1 * ctrl[1] + w2 * b[1]]),
      );
    }
    bowedEdges.push({ edgeId, points });
  }
  const keptCrossings = crossings.filter((c) => !bowedIds.has(c.edgeId));

  // the pale-broken ink plan: split every crossed edge's curve at its crossings
  const brokenEdges: CrossingModel['brokenEdges'] = [];
  for (const e of complex.edges) {
    if (bowedIds.has(e.id)) continue;
    const ts = crossingsByEdge.get(e.id) ?? [];
    if (ts.length === 0) continue;
    const [a, b] = param.edgeEnds.get(e.id) as [V2, V2];
    const at = (t: number): V2 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const GAP = 0.055;
    const segments: Vec3[][] = [];
    const stubs: Vec3[][] = [];
    let cursor = 0;
    for (const t of ts) {
      const lo = Math.max(0, t - GAP);
      const hi = Math.min(1, t + GAP);
      if (lo > cursor + 1e-6) segments.push(sampleCurve(at(cursor), at(lo), param.toBody));
      stubs.push(sampleCurve(at(lo), at(hi), param.toBody));
      cursor = hi;
    }
    if (cursor < 1 - 1e-6) segments.push(sampleCurve(at(cursor), at(1), param.toBody));
    brokenEdges.push({ edgeId: e.id, segments, stubs });
  }

  return {
    model: {
      body,
      caption: CROSSING_CAPTIONS[body],
      count: keptCrossings.length,
      locusCurves: locusCurves3(body),
      crossings: keptCrossings,
      vertexGhosts,
      bowedEdges,
      brokenEdges,
      ghostFloor: CROSSING_GHOST_FLOOR,
    },
    aligned,
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
  // CUT 2: closed non-orientable ROUTES THROUGH THE L — RP² (k=1) and Klein
  // (k=2) lay onto their committed self-crossing bodies with the crossing
  // register riding the model; only k ≥ 3 walls (no committed body).
  const crosscaps = cls.kind === 'non-orientable' ? (cls.k as number) : null;
  if (crosscaps !== null && crosscaps >= 3) {
    return { ok: false, wall: LAID_WALL_CROSSCAPS(crosscaps) };
  }
  const g = cls.kind === 'orientable' ? (cls.g as number) : null;
  if (g !== null && g >= 2) return { ok: false, wall: LAID_WALL_NO_BODY(g) };
  const complex = component.complex;
  try {
    const cut = cutComplexToDisk(complex);
    let cutUsed = cut;
    const surface: ImmersedSurfaceKey =
      crosscaps !== null ? (crosscaps === 1 ? 'rp2' : 'klein') : g === 1 ? 'torus' : 'sphere';
    let toBody: (p: V2) => Vec3;
    let positionOfClass: (c: string) => V2;
    let faceRings: V2[][];
    let foldover: { areas: number[]; oneSign: boolean };
    let domain: 'flat-square' | 'capped-disk' | 'twisted-square';
    let jumpOf: Map<string, V2> | null = null;
    let capFace = -1;
    let capRing: string[] = [];
    let twisted: TwistedParam | null = null;
    let crossingBuilt: { model: CrossingModel; aligned: boolean } | null = null;
    if (crosscaps !== null) {
      // CUT 2 — the crossing register: lay, then check LAW C's transversality;
      // an aligned cell gets a deterministic nudge (a solve bias), a failed
      // or aligned cut tries its neighbouring cuts (the dual tree's choice of
      // interior gluings can poison every seam), and only when every road
      // ends aligned/refused does the register WALL — a ghost is never a
      // cell, and a cell never a ghost.
      let roadEnd: unknown = null;
      const seedMax = Math.min(complex.edges.length, 8);
      for (let seed = 0; seed <= seedMax && twisted === null; seed += 1) {
        try {
          const cutT = seed === 0 ? cut : cutComplexToDisk(complex, seed);
          let cand = parametrizeTwisted(complex, cutT, surface as 'klein' | 'rp2', 0);
          let cross = buildCrossingModel(complex, cand, shape);
          if (cross.aligned) {
            cand = parametrizeTwisted(complex, cutT, surface as 'klein' | 'rp2', 1);
            cross = buildCrossingModel(complex, cand, shape);
            if (cross.aligned) throw new Error(LAID_WALL_ALIGNED);
          }
          twisted = cand;
          crossingBuilt = cross;
          cutUsed = cutT;
        } catch (error) {
          roadEnd = error;
        }
      }
      if (twisted === null || crossingBuilt === null) {
        throw roadEnd instanceof Error ? roadEnd : new Error(String(roadEnd ?? 'no twisted lay'));
      }
      const t = twisted;
      toBody = t.toBody;
      positionOfClass = (c) => t.classPos.get(c) as V2;
      faceRings = t.faceRings;
      foldover = t.foldover;
      domain = 'twisted-square';
    } else if (g === 1) {
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
    const bowedByEdge = new Map(
      (crossingBuilt ? crossingBuilt.model.bowedEdges : []).map((bw) => [bw.edgeId, bw.points]),
    );
    const edgeCurves = complex.edges.map((e) => {
      const bowed = bowedByEdge.get(e.id);
      if (bowed) return { id: e.id, points: bowed };
      const ends = twisted ? (twisted.edgeEnds.get(e.id) as [V2, V2]) : null;
      const a = ends ? ends[0] : positionOfClass(e.u);
      const b = ends ? ends[1] : jumpOf ? add2(a, jumpOf.get(e.id) as V2) : positionOfClass(e.v);
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
      if (twisted) {
        const r = twisted.reduce(p);
        classUV[id] = [r[0], r[1]];
      } else {
        classUV[id] =
          domain === 'flat-square'
            ? [p[0] - Math.floor(p[0]), p[1] - Math.floor(p[1])]
            : [(Math.PI / 2 - Math.atan2(p[1], p[0])) / (2 * Math.PI), Math.min(1, Math.hypot(p[0], p[1])) * CAP_V];
      }
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
        cut: {
          treeEdgeIds: cutUsed.treeEdgeIds,
          dualTreeEdgeIds: cutUsed.dualTreeEdgeIds,
          cutEdgeIds: cutUsed.cutEdgeIds,
        },
        foldover,
      },
      crossing: crossingBuilt ? crossingBuilt.model : null,
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

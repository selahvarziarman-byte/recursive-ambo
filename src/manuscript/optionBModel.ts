// optionBModel — Manuscript follow-on: OPTION B, the certified generators of
// born/plain forms (researcher ruling Q-M1: CANONICAL barycentric placement;
// Q-M3: the ∂₂ representative-selection oracle). React-free; the acceptance
// diagnostic requires THIS module through the anti-mock hook; ManuscriptView /
// InkedPlainForm consume its polylines verbatim.
//
// THE RULING, held exactly (RESEARCHER_RULING_QM1_QM3_BASISCYCLE_TO_IMMERSION):
//   · every barycentric SUB-VERTEX has a CANONICAL position on the form —
//     original vertex → its own position; edge-class → that edge's midpoint;
//     face → its centroid. Nothing is chosen or fabricated.
//   · a certified basis cycle c ∈ analyzeGlobalW1(...).debug.basisCycles (a
//     Z/2 1-cycle of sub-edge ids) → decomposed into simple closed loops (an
//     even-degree subgraph splits into loops; the split is deterministic here:
//     smallest-id-first walks) → each loop drawn as the CLOSED POLYLINE through
//     its sub-vertices' positions. The drawn curve IS the geometric image of
//     the exact certified cycle; the count === certified b₁.
//   · Q-M3 (mothership-ratified): to draw a DIFFERENT cycle γ in c's class,
//     certify [γ]=[c] by the membership solve γ ⊕ c ∈ im ∂₂ over Z/2. Pass →
//     drawable via the same placement; fail → REJECTED, never hand-drawn.
//     (The default stays globalW1's own basis cycle.)
//
// REUSE, derive-only: the complex bridge is the committed-precedent
// `toAssembledComplex` (inkedFormModel, byte-unchanged); the certified cycles
// come from the committed `analyzeGlobalW1`. The subdivision's SUB-EDGE
// ENDPOINTS and TRIANGLE BOUNDARIES are re-expressed here from `globalW1.ts`'s
// documented, sealed naming (§a: `V:<v>` / `M:<edge>` / `B:<face>`;
// `HE:<edge>:u|v` half-edges; `RM:<f>:<p>` mid→bar; `RC:<f>:<p>` bar→corner;
// per slot two triangles [heTail, rm, rcTail] / [heHead, rcHead, rm]) — the
// module never touches globalW1, and the diagnostic TEETH verify the
// re-expression against the certifier itself (every certified basis cycle is
// ∂₁-closed under these endpoints; every reconstructed triangle is a 3-cycle;
// the torus ratification reproduces Option A through the oracle).
//
// DERIVE-ONLY · ADDITIVE: committed modules by import; engine + globalW1 +
// certifiers + prior manuscript models stay byte-unchanged.

import type { Shape, Vec3 } from '../types/geometry';
import { analyzeGlobalW1, type AssembledComplex, type GlobalW1Cert } from '../lib/globalW1';
import { toAssembledComplex } from './inkedFormModel';

// ---------------------------------------------------------------------------
// Q-M1 — the canonical barycentric position map (the ruling's three rules)
// ---------------------------------------------------------------------------

export interface SubdivisionGeometry {
  positions: Map<string, Vec3>; // sub-vertex id → its canonical position
  endpoints: Map<string, [string, string]>; // sub-edge id → its two sub-vertices
  triangles: string[][]; // each subdivision 2-cell as its 3 sub-edge ids (the ∂₂ rows)
}

const mid = (a: Vec3, b: Vec3): Vec3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];

export function buildSubdivisionGeometry(shape: Shape, complex: AssembledComplex): SubdivisionGeometry {
  const positions = new Map<string, Vec3>();
  const endpoints = new Map<string, [string, string]>();
  const triangles: string[][] = [];

  const vertexPos = (id: string): Vec3 => {
    const vertex = shape.vertices[id];
    if (!vertex) throw new Error(`optionBModel: complex vertex ${id} missing from the shape`);
    return vertex.position;
  };

  // rule 1 — original vertices at their own positions
  for (const v of complex.vertices) positions.set(`V:${v}`, vertexPos(v));
  // rule 2 — edge-classes at their edge midpoints
  const edgeOf = new Map(complex.edges.map((e) => [e.id, e]));
  for (const e of complex.edges) positions.set(`M:${e.id}`, mid(vertexPos(e.u), vertexPos(e.v)));
  // rule 3 — faces at their centroids (the bridge preserves shape.faces order)
  if (complex.faces.length !== shape.faces.length) {
    throw new Error('optionBModel: bridge face order broken — refusing the centroid map');
  }
  shape.faces.forEach((face, fi) => {
    const sum = face.vertexIds.reduce<Vec3>(
      (acc, id) => {
        const p = vertexPos(id);
        return [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]];
      },
      [0, 0, 0],
    );
    positions.set(`B:${fi}`, [sum[0] / face.vertexIds.length, sum[1] / face.vertexIds.length, sum[2] / face.vertexIds.length]);
  });

  // the documented sub-edge/triangle structure, re-expressed (set-once, like
  // the committed EdgeRegistry — first traversal fixes an edge)
  const ensure = (id: string, a: string, b: string): void => {
    if (!endpoints.has(id)) endpoints.set(id, [a, b]);
  };
  complex.faces.forEach((face, fi) => {
    const n = face.boundary.length;
    face.boundary.forEach((slot, p) => {
      const e = edgeOf.get(slot.edge);
      if (!e) throw new Error(`optionBModel: face ${fi} slot ${p} references unknown edge ${slot.edge}`);
      const tail = slot.dir === 1 ? e.u : e.v;
      const head = slot.dir === 1 ? e.v : e.u;
      const heTail = `HE:${e.id}:${slot.dir === 1 ? 'u' : 'v'}`;
      const heHead = `HE:${e.id}:${slot.dir === 1 ? 'v' : 'u'}`;
      const rm = `RM:${fi}:${p}`;
      const rcTail = `RC:${fi}:${p}`;
      const rcHead = `RC:${fi}:${(p + 1) % n}`;
      ensure(heTail, `V:${tail}`, `M:${e.id}`);
      ensure(heHead, `V:${head}`, `M:${e.id}`);
      ensure(rm, `M:${e.id}`, `B:${fi}`);
      ensure(rcTail, `B:${fi}`, `V:${tail}`);
      ensure(rcHead, `B:${fi}`, `V:${head}`);
      triangles.push([heTail, rm, rcTail]);
      triangles.push([heHead, rcHead, rm]);
    });
  });

  return { positions, endpoints, triangles };
}

// ---------------------------------------------------------------------------
// the loop decomposition (even-degree Z/2 cycle → simple closed loops)
// ---------------------------------------------------------------------------

export function decomposeIntoLoops(
  subEdges: readonly string[],
  endpoints: Map<string, [string, string]>,
): string[][] {
  // adjacency over sub-vertices; deterministic: sorted ids, smallest-first walks
  const incident = new Map<string, string[]>();
  for (const id of [...subEdges].sort()) {
    const pair = endpoints.get(id);
    if (!pair) throw new Error(`optionBModel: certified cycle names unknown sub-edge ${id}`);
    for (const v of pair) incident.set(v, [...(incident.get(v) ?? []), id]);
  }
  for (const [v, list] of incident) {
    if (list.length % 2 !== 0) {
      throw new Error(`optionBModel: cycle has odd degree at ${v} — not a Z/2 cycle, refusing to draw`);
    }
  }
  const used = new Set<string>();
  const loops: string[][] = [];
  const other = (edge: string, v: string): string => {
    const [a, b] = endpoints.get(edge) as [string, string];
    return a === v ? b : a;
  };
  for (const start of [...incident.keys()].sort()) {
    for (;;) {
      const firstEdge = (incident.get(start) ?? []).find((e) => !used.has(e));
      if (!firstEdge) break;
      // walk until the loop closes back at `start`
      const path: string[] = [start];
      let current = start;
      let edge = firstEdge;
      for (;;) {
        used.add(edge);
        current = other(edge, current);
        path.push(current);
        if (current === start) break;
        const next = (incident.get(current) ?? []).find((e) => !used.has(e));
        if (!next) throw new Error('optionBModel: cycle walk dead-ended — refusing to draw');
        edge = next;
      }
      loops.push(path);
    }
  }
  return loops;
}

// ---------------------------------------------------------------------------
// Option B — the certified generators of a positioned form
// ---------------------------------------------------------------------------

export interface CertifiedGenerator {
  label: string; // g₁, g₂, … (the certified class index; no letter fiction)
  subEdges: string[]; // the exact certified basis cycle (provenance)
  polylines: Vec3[][]; // its canonical geometric image (closed: first === last)
}

export interface OptionBReading {
  b1: number;
  cert: GlobalW1Cert;
  generators: CertifiedGenerator[]; // length === b1 — the full certified basis
}

export function deriveOptionBGenerators(shape: Shape): OptionBReading {
  const complex = toAssembledComplex(shape);
  const analysis = analyzeGlobalW1(complex); // ← the committed certifier, verbatim
  const geometry = buildSubdivisionGeometry(shape, complex);
  const cycles = analysis.debug.basisCycles;
  if (cycles.length !== analysis.cert.b1) {
    throw new Error('optionBModel: basis-cycle count differs from certified b₁ — refusing to draw');
  }
  const generators = cycles.map((subEdges, k) => ({
    label: `g${k + 1}`,
    subEdges: [...subEdges],
    polylines: decomposeIntoLoops(subEdges, geometry.endpoints).map((loop) =>
      loop.map((subVertex) => {
        const p = geometry.positions.get(subVertex);
        if (!p) throw new Error(`optionBModel: sub-vertex ${subVertex} has no canonical position`);
        return [...p] as Vec3;
      }),
    ),
  }));
  return { b1: analysis.cert.b1, cert: analysis.cert, generators };
}

// lift a REAL-edge cycle (an ordered closed vertex path on the shape) onto the
// subdivision: each real edge (u,v) = its two half-edges HE:<e>:u ⊕ HE:<e>:v.
// (The Option-A ↔ Option-B ratification instrument.)
export function liftRealCycleToSubdivision(vertexPath: readonly string[], complex: AssembledComplex): string[] {
  const byKey = new Map(complex.edges.map((e) => [e.u < e.v ? `${e.u}|${e.v}` : `${e.v}|${e.u}`, e]));
  const lifted = new Set<string>();
  for (let k = 0; k + 1 < vertexPath.length; k += 1) {
    const [x, y] = [vertexPath[k], vertexPath[k + 1]];
    const e = byKey.get(x < y ? `${x}|${y}` : `${y}|${x}`);
    if (!e) throw new Error(`optionBModel: lift — no edge class for ${x}→${y}`);
    // Z/2: a doubly-traversed edge cancels
    for (const half of [`HE:${e.id}:u`, `HE:${e.id}:v`]) {
      if (lifted.has(half)) lifted.delete(half);
      else lifted.add(half);
    }
  }
  return [...lifted].sort();
}

// ---------------------------------------------------------------------------
// Q-M3 — the certified representative-selection oracle: [γ] = [c] ⟺ γ⊕c ∈ im ∂₂
// ---------------------------------------------------------------------------

export type OracleVerdict = { homologous: true } | { homologous: false; reason: string };

export function certifyHomologous(
  gamma: readonly string[],
  c: readonly string[],
  geometry: SubdivisionGeometry,
): OracleVerdict {
  // index the sub-edge space
  const ids = [...geometry.endpoints.keys()].sort();
  const indexOf = new Map(ids.map((id, k) => [id, k]));
  const toVector = (edges: readonly string[], who: string): Uint8Array | string => {
    const v = new Uint8Array(ids.length);
    for (const id of edges) {
      const k = indexOf.get(id);
      if (k === undefined) return `${who} names unknown sub-edge ${id}`;
      v[k] ^= 1; // Z/2 multiset collapse
    }
    return v;
  };
  const isCycle = (v: Uint8Array): boolean => {
    const degree = new Map<string, number>();
    ids.forEach((id, k) => {
      if (!v[k]) return;
      for (const end of geometry.endpoints.get(id) as [string, string]) {
        degree.set(end, (degree.get(end) ?? 0) + 1);
      }
    });
    return [...degree.values()].every((d) => d % 2 === 0);
  };
  const g = toVector(gamma, 'γ');
  if (typeof g === 'string') return { homologous: false, reason: g };
  const base = toVector(c, 'c');
  if (typeof base === 'string') return { homologous: false, reason: base };
  if (!isCycle(g)) return { homologous: false, reason: 'γ is not a Z/2 cycle (odd sub-vertex degree)' };
  if (!isCycle(base)) return { homologous: false, reason: 'c is not a Z/2 cycle' };

  // target = γ ⊕ c ; member of im ∂₂ ⟺ eliminates to zero against the rows
  const target = new Uint8Array(ids.length);
  for (let k = 0; k < ids.length; k += 1) target[k] = (g[k] ^ base[k]) as 0 | 1;

  const basis: Uint8Array[] = [];
  const pivotOf: number[] = [];
  const reduce = (v: Uint8Array): Uint8Array => {
    const x = v.slice();
    for (let i = 0; i < basis.length; i += 1) {
      if (x[pivotOf[i]]) for (let k = 0; k < x.length; k += 1) x[k] ^= basis[i][k];
    }
    return x;
  };
  for (const triangle of geometry.triangles) {
    const rowOrError = toVector(triangle, '∂₂ row');
    if (typeof rowOrError === 'string') return { homologous: false, reason: rowOrError };
    const reduced = reduce(rowOrError);
    const lead = reduced.findIndex((x) => x === 1);
    if (lead >= 0) {
      basis.push(reduced);
      pivotOf.push(lead);
    }
  }
  const residue = reduce(target);
  return residue.every((x) => x === 0)
    ? { homologous: true }
    : { homologous: false, reason: 'γ ⊕ c is not a boundary — γ lies in a DIFFERENT class (rejected, never hand-drawn)' };
}

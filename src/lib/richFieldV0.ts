// richFieldV0 — L3b: the rich-field texture (+ defect) on the asymmetric form (ADR 0018).
//
// THE PAYOFF LAYER: the canonical `L_U` eigenmode's real spatial NODES and
// ANTINODES, plus its defect `Σ`, on the ONE family of forms where the texture
// is canonical — the ASYMMETRIC birth-path form (RICH_FIELD_RULING_V3). The
// symmetric R0 zoo is deliberately excluded: regular-grid tori/Klein/RP² have
// degenerate spectra → basis-dependent eigenmodes → un-renderable (V3's
// decoration bar). Enforced here as the SIMPLE-EIGENVALUE GATE.
//
// THE CANONICAL FORM (V3 §1): `ambo(tetra)` → two all-midpoint
// `dissection-core-face`s sharing exactly ONE vertex → BOTH flip-self-glued via
// the committed `buildSelfGlueSeed` + `runCascade` (the two seeds' matches
// composed into one cascade — the closure entangles at the shared vertex).
//
// THE COMMITTED PIPELINE (derive-only; nothing recomputed):
//   assembled complex  — the cascade partition read exactly as the committed
//                        diagnostics' `assembledFromCascade` path (generalised
//                        verbatim to the two-face universe);
//   `analyzeGlobalW1`  — the holonomy class (b₁=2, w1Class=[0,1]) + the
//                        subdivided complex's cellCounts (v=7, e=20, t=12);
//   `subdivide`        — the committed barycentric subdivision (s4FrameWitnessV0;
//                        its `verts` order IS the L_U site order);
//   `poincareDualClass`— Σ = PD(φ): the defect's RM-spoke chain + the φ flip
//                        support + the gauge-invariant [Σ] with its pairing;
//   `signedLaplacian`  — L_U over the subdivision 1-skeleton with edge signs
//                        −1 EXACTLY ON the committed Σ spokes (`sigmaChainEdges`)
//                        — the mandate's "poincareDualClass → Σ flip-support →
//                        L_U". (Measured equal-spectrum to lifting φ onto both
//                        HE halves of each flip edge; measured DIFFERENT from a
//                        spanning-tree flat gauge — the rich field lives on the
//                        seam-supported connection. Surfaced in the L3b report.)
//
// THE ONE NEW PIECE (sanctioned): eigenVECTOR emission — a cyclic Jacobi that
// accumulates the rotation matrix (the committed `symmetricEigenvalues` returns
// values only) — plus the simple-eigenvalue gate and the node/antinode readout.
// Declared constants only; nothing is fitted:
//   DEGENERACY_TOL   — two eigenvalues within this are one band (gate);
//   NODE_TOL_REL     — |ψ|² below this FRACTION of the form's max is a NODE;
//   ANTINODE_TOL_REL — |ψ|² within this fraction of the max is an ANTINODE.
//
// LABEL / THE GUARD (ADR 0017 Amd-2 / ADR 0018): this module computes the field;
// it asserts no verdict and draws nothing. The render (RichFieldOverlay) shows
// the texture and Σ BECAUSE THEY ARE THE FIELD — verification stays headless in
// scripts/diagnose-rich-field-l3b.cjs.

import type { Face, Shape, VertexId } from '../types/geometry';
import { createSeedShape } from '../data/seeds';
import { applyAmboDissection } from '../lib/ambo';
import { buildSelfGlueSeed, runCascade, certifyCascadeOrientation } from './cascadeDriver';
import { faceEdgePairs } from './surfaceOperations';
import { analyzeGlobalW1, type AssembledComplex, type GlobalW1Cert } from './globalW1';
import {
  poincareDualClass,
  subdivide,
  type PoincareDualResult,
  type SubdividedComplex,
} from './s4FrameWitnessV0';
import { signedLaplacian, type Graph, type Sign } from './connectionWaveInstrumentV0';
import { kerCount } from './spectralFlowV0';

// ---------------------------------------------------------------------------
// declared constants (never result-fitted)
// ---------------------------------------------------------------------------
export const DEGENERACY_TOL = 1e-6; // eigenvalues within this = one band (the gate reads multiplicity)
// THE RELATIVE CRITERION (R5a — the researcher's ruled form; the prose
// hypothesis made computable): a NODE is a site whose |ψ|² is negligible
// RELATIVE TO THE FORM'S OWN BRIGHTEST SITE — x < NODE_TOL_REL·max — never an
// absolute cut. The absolute 1e-4 was falsified on the born Klein body (504
// sites, max 1.3559e-2): it manufactured 62 of its 90 "nodes" out of the
// mode's CONTINUOUS dim tail. Measured on that counterexample: 28 true nodes,
// band top at 1.1358e-4 of max, dimmest NON-node at 1.4103e-3 of max — a
// 12.4× clean gap that τ = 1e-3 splits with 8.8× headroom below and 1.41×
// above. (The old "≥3 orders" prose holds for genus-2's machine-zero cliff,
// not for the Klein's tail.) The antinode cut is relative the same way:
// max − x ≤ ANTINODE_TOL_REL·max, nearest non-antinode measured at 14.8× the
// cut. Constants DERIVED from the counterexample's gap, never result-fitted.
export const NODE_TOL_REL = 1e-3; // a node: |ψ|² < NODE_TOL_REL · max (per-form relative cut)
export const ANTINODE_TOL_REL = 1e-3; // an antinode: max − |ψ|² ≤ ANTINODE_TOL_REL · max

// ---------------------------------------------------------------------------
// the eigenVECTOR emission — cyclic Jacobi WITH the accumulated rotation V
// (the committed `symmetricEigenvalues` emits values only; same sweep scheme)
// ---------------------------------------------------------------------------
export interface EigenPair {
  value: number;
  vector: number[]; // unit; sign convention: first non-zero component > 0
}

export function symmetricEigensystem(input: number[][]): EigenPair[] {
  const n = input.length;
  if (n === 0) return [];
  const a = input.map((row) => row.slice());
  const V: number[][] = Array.from({ length: n }, (_row, i) =>
    Array.from({ length: n }, (_col, j) => (i === j ? 1 : 0)),
  );
  for (let sweep = 0; sweep < 100; sweep += 1) {
    let off = 0;
    for (let p = 0; p < n; p += 1) for (let q = p + 1; q < n; q += 1) off += a[p][q] * a[p][q];
    if (off < 1e-24) break;
    for (let p = 0; p < n; p += 1) {
      for (let q = p + 1; q < n; q += 1) {
        if (Math.abs(a[p][q]) < 1e-18) continue;
        const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k += 1) {
          const akp = a[k][p];
          const akq = a[k][q];
          a[k][p] = c * akp - s * akq;
          a[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k += 1) {
          const apk = a[p][k];
          const aqk = a[q][k];
          a[p][k] = c * apk - s * aqk;
          a[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k += 1) {
          const vkp = V[k][p];
          const vkq = V[k][q];
          V[k][p] = c * vkp - s * vkq;
          V[k][q] = s * vkp + c * vkq;
        }
      }
    }
  }
  const pairs: EigenPair[] = Array.from({ length: n }, (_x, i) => {
    const vector = V.map((row) => row[i]);
    const norm = Math.sqrt(vector.reduce((acc, x) => acc + x * x, 0)) || 1;
    let unit = vector.map((x) => x / norm);
    const lead = unit.find((x) => Math.abs(x) > 1e-12) ?? 1;
    if (lead < 0) unit = unit.map((x) => -x);
    return { value: a[i][i], vector: unit };
  });
  pairs.sort((x, y) => x.value - y.value);
  return pairs;
}

// ---------------------------------------------------------------------------
// the canonical form — two one-vertex-adjacent all-midpoint core faces
// ---------------------------------------------------------------------------
export type RichFieldSeed = 'tetrahedron' | 'cube';

export interface RichFieldSpec {
  seed?: RichFieldSeed; // default 'tetrahedron' (the canonical example; cube reproduces it)
  partnerIndex?: number; // which one-vertex partner of core-face 0 (0..2; default 0)
}

export interface RichFieldForm {
  F0: Shape;
  faces: Face[]; // the flip-self-glued faces (2 canonical; 1 or 2 for the gate's test forms)
  pureCoreFaces: Face[]; // all all-midpoint dissection-core-faces (the selection pool)
  sharedVertexIds: VertexId[]; // the vertices the chosen faces share (canonical: exactly 1)
}

function sharedVertices(a: Face, b: Face): VertexId[] {
  const set = new Set(a.vertexIds);
  return b.vertexIds.filter((v) => set.has(v));
}

export function buildCanonicalForm(spec: RichFieldSpec = {}): RichFieldForm {
  const seed = spec.seed ?? 'tetrahedron';
  const partnerIndex = spec.partnerIndex ?? 0;
  const F0 = applyAmboDissection(createSeedShape(seed));
  const midpointSet = new Set(
    Object.values(F0.vertices)
      .filter(
        (v) =>
          v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2,
      )
      .map((v) => v.id),
  );
  const pureCoreFaces = F0.faces.filter(
    (f) =>
      f.role === 'dissection-core-face' &&
      f.vertexIds.length === 3 &&
      f.vertexIds.every((v) => midpointSet.has(v)),
  );
  if (pureCoreFaces.length === 0) {
    throw new Error('richFieldV0: no all-midpoint dissection-core-face found — form not buildable');
  }
  const faceA = pureCoreFaces[0];
  const partners = pureCoreFaces.filter(
    (f) => f !== faceA && sharedVertices(faceA, f).length === 1,
  );
  const faceB = partners[partnerIndex];
  if (!faceB) {
    throw new Error(
      `richFieldV0: no one-vertex partner #${partnerIndex} of core-face 0 (found ${partners.length})`,
    );
  }
  return {
    F0,
    faces: [faceA, faceB],
    pureCoreFaces,
    sharedVertexIds: sharedVertices(faceA, faceB),
  };
}

// The T1 symmetric control: two OPPOSITE core faces (sharing NO vertex) — the two
// self-glued seams never entangle, the quotient is two identical components, and
// every eigenvalue doubles: the degenerate lowest band the gate must REJECT.
export function buildSymmetricTwoSeamForm(seed: RichFieldSeed = 'tetrahedron'): RichFieldForm {
  const base = buildCanonicalForm({ seed });
  const faceA = base.pureCoreFaces[0];
  const opposite = base.pureCoreFaces.find(
    (f) => f !== faceA && sharedVertices(faceA, f).length === 0,
  );
  if (!opposite) throw new Error('richFieldV0: no opposite (0-shared-vertex) core face found');
  return { ...base, faces: [faceA, opposite], sharedVertexIds: [] };
}

// The single-seam witness form (b₁=1) — exposed so the diagnostic can MEASURE its
// band structure honestly (it measured SIMPLE, not degenerate — reported, not hidden).
export function buildSingleSeamForm(seed: RichFieldSeed = 'tetrahedron'): RichFieldForm {
  const base = buildCanonicalForm({ seed });
  return { ...base, faces: [base.pureCoreFaces[0]], sharedVertexIds: [] };
}

// ---------------------------------------------------------------------------
// the committed two-face cascade → AssembledComplex (the diagnostics'
// `assembledFromCascade` path, generalised verbatim to a face list)
// ---------------------------------------------------------------------------
const edgeKeyOf = (u: string, v: string): string =>
  [u, v].sort((a, b) => a.localeCompare(b)).join('|');

export interface GluedComplex {
  complex: AssembledComplex;
  cascadeW1: 0 | 1;
  vertexClassOf: Record<VertexId, string>; // original vertex id → its class representative
  edgeClassIdOf: Record<string, string>; // canonical edge key → its class's edge id
}

export function glueFacesFlip(F0: Shape, faces: Face[]): GluedComplex {
  const seed = { matches: faces.flatMap((f) => buildSelfGlueSeed(F0, f, 'flip').matches) };
  const trace = runCascade(F0, faces, seed);
  const cascadeW1 = certifyCascadeOrientation(F0, faces, trace).w1;

  const repOf = (classes: string[][], id: string): string => {
    for (const cls of classes) if (cls.includes(id)) return cls[0];
    return id;
  };
  const vClass = (v: string): string => repOf(trace.partition[0], v);
  const eClass = (e: string): string => repOf(trace.partition[1], e);

  const edgeByKey = new Map<string, { id: string; vertexIds: [string, string] }>();
  for (const e of F0.edges) edgeByKey.set(edgeKeyOf(e.vertexIds[0], e.vertexIds[1]), e);

  const edges = trace.partition[1].map((cls) => {
    const real = F0.edges.find((e) => e.id === cls[0]);
    if (!real) throw new Error(`richFieldV0: edge-class rep ${cls[0]} not in F0.edges`);
    return { id: cls[0], u: vClass(real.vertexIds[0]), v: vClass(real.vertexIds[1]) };
  });
  const facesOut = faces.map((face) => ({
    boundary: faceEdgePairs(face).map(([from, to]) => {
      const real = edgeByKey.get(edgeKeyOf(from, to));
      if (!real) throw new Error(`richFieldV0: no real edge for face pair ${from}..${to}`);
      const classId = eClass(real.id);
      const assembled = edges.find((e) => e.id === classId);
      if (!assembled) throw new Error(`richFieldV0: assembled edge-class ${classId} missing`);
      const dir: 1 | -1 = assembled.u === vClass(from) && assembled.v === vClass(to) ? 1 : -1;
      return { edge: classId, dir };
    }),
  }));
  const vertices = [...new Set(faces.flatMap((f) => f.vertexIds.map(vClass)))];

  const vertexClassOf: Record<VertexId, string> = {};
  for (const f of faces) for (const v of f.vertexIds) vertexClassOf[v] = vClass(v);
  const edgeClassIdOf: Record<string, string> = {};
  for (const f of faces) {
    for (const [from, to] of faceEdgePairs(f)) {
      const key = edgeKeyOf(from, to);
      const real = edgeByKey.get(key);
      if (real) edgeClassIdOf[key] = eClass(real.id);
    }
  }

  return { complex: { vertices, edges, faces: facesOut }, cascadeW1, vertexClassOf, edgeClassIdOf };
}

// ---------------------------------------------------------------------------
// the rich field — the full committed pipeline + the eigenmode readout
// ---------------------------------------------------------------------------
export interface SimpleEigenvalueGate {
  simple: boolean; // multiplicity === 1 → the eigenmode is canonical (renderable)
  multiplicity: number; // # eigenvalues within DEGENERACY_TOL of λ_min
}

export interface RichField {
  form: RichFieldForm;
  glued: GluedComplex;
  cert: GlobalW1Cert; // committed b₁ / w1Class / nonOrientable
  cellCounts: { v: number; e: number; t: number }; // committed subdivision counts
  euler: number;
  sub: SubdividedComplex; // committed subdivision — `sub.verts` IS the L_U site order
  siteIds: string[];
  graph: Graph;
  edgeSigns: Sign[]; // −1 exactly on the committed Σ spokes (sigmaChainEdges)
  LU: number[][]; // the committed signedLaplacian over (graph, edgeSigns)
  spectrum: EigenPair[]; // full eigensystem, ascending
  kernelDim: number; // committed kerCount over the eigenvalues
  lambdaMin: number;
  gate: SimpleEigenvalueGate;
  psi: number[]; // the λ_min eigenvector (unit) — null-free only when gate.simple
  intensity: number[]; // |ψ_x|² per site (the TEXTURE)
  nodes: number[]; // site indices with |ψ|² < NODE_TOL_REL · max (relative — R5a)
  antinodes: number[]; // site indices with max − |ψ|² ≤ ANTINODE_TOL_REL · max
  sigma: PoincareDualResult; // the committed Σ = PD(φ) (flip support + RM chain + [Σ])
}

// Run the committed pipeline over an already-glued form (no gate enforcement here —
// the gate is REPORTED; `buildRichField` enforces it for the canonical build).
export function analyzeRichField(form: RichFieldForm): RichField {
  const glued = glueFacesFlip(form.F0, form.faces);
  const w1Analysis = analyzeGlobalW1(glued.complex);
  const sigma = poincareDualClass(
    glued.complex,
    w1Analysis.debug.basisCycles,
    w1Analysis.debug.perCycleW1,
  );

  const sub = subdivide(glued.complex);
  const vIndex = new Map(sub.verts.map((v, i) => [v, i]));
  const graph: Graph = {
    n: sub.verts.length,
    edges: sub.edges.map((e) => ({ a: vIndex.get(e.u) as number, b: vIndex.get(e.v) as number })),
  };
  // the Σ flip-support connection: −1 exactly on the committed sigmaChainEdges.
  const sigmaSet = new Set(sigma.sigmaChainEdges);
  const edgeSigns: Sign[] = sub.edges.map((e) => (sigmaSet.has(e.id) ? -1 : 1));
  const LU = signedLaplacian(graph, edgeSigns);

  const spectrum = symmetricEigensystem(LU);
  const lambdaMin = spectrum[0]?.value ?? 0;
  const multiplicity = spectrum.filter((p) => Math.abs(p.value - lambdaMin) < DEGENERACY_TOL).length;
  const gate: SimpleEigenvalueGate = { simple: multiplicity === 1, multiplicity };

  const psi = spectrum[0]?.vector ?? [];
  const intensity = psi.map((x) => x * x);
  const max = intensity.reduce((acc, x) => Math.max(acc, x), 0);
  const nodes = intensity.map((x, i) => (x < NODE_TOL_REL * max ? i : -1)).filter((i) => i >= 0);
  const antinodes = intensity
    .map((x, i) => (max - x <= ANTINODE_TOL_REL * max ? i : -1))
    .filter((i) => i >= 0);

  return {
    form,
    glued,
    cert: w1Analysis.cert,
    cellCounts: w1Analysis.debug.cellCounts,
    euler: w1Analysis.debug.euler,
    sub,
    siteIds: [...sub.verts],
    graph,
    edgeSigns,
    LU,
    spectrum,
    kernelDim: kerCount(spectrum.map((p) => p.value)),
    lambdaMin,
    gate,
    psi,
    intensity,
    nodes,
    antinodes,
    sigma,
  };
}

// The canonical build: the asymmetric form, with the simple-eigenvalue gate ENFORCED —
// a degenerate lowest band is un-renderable (V3 decoration bar) and REJECTED loudly.
export function buildRichField(spec: RichFieldSpec = {}): RichField {
  const field = analyzeRichField(buildCanonicalForm(spec));
  if (!field.gate.simple) {
    throw new Error(
      `richFieldV0: the lowest band is DEGENERATE (multiplicity ${field.gate.multiplicity}) — the eigenmode is basis-dependent and un-renderable; no canonical texture`,
    );
  }
  return field;
}

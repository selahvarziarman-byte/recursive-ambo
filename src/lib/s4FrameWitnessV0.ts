// s4FrameWitnessV0 — Layer-1 items 4–5: the FORCED S₄-frame witness runner.
//
// Items 1–3 (the connection-wave instrument: U, holonomy, spectral gap) are committed in
// `connectionWaveInstrumentV0`; this module IMPORTS them and adds only the FORCED geometric
// frame and the two RAW observables. It is the same discipline one rung up:
//
//   IRON FILINGS, NEVER THE FIELD. The law is the committed holonomy class (`globalW1.
//   perCycleW1` / `certifyCascadeOrientation`). This module lays a forced, S₄-equivariant
//   geometric frame on the X_K octahedral axes and REALISES that law as a director that
//   physically winds — it never invents a winding. No law, verdict, or sealed prediction
//   is written in the frame (LABEL). The frame is FORCED, so it carries ZERO free knobs;
//   the only declared freedom is one S₄-equivariant field weight (honesty-budget §4).
//
// THE FORCED FRAME (zero knobs):
//   • Cell frame `q_v` — the tetra cell's 4 source-less primals → the regular simplex
//     (±1,±1,±1)/√3 with an EVEN sign-count, so `Σ q_v = 0`, every `|q_v|` equal, every
//     pairwise `q_i·q_j` equal. Each S₄ permutation of the primals is an `R_σ ∈ O(3)`.
//   • Site frame on X_K — `q_site = q_i + q_j` (the 2 parents); `n_site = q_site/|q_site|`.
//     The six edge-children come out as the signed axes of an internal octahedron
//     {±x,±y,±z}. The director is the headless `±n_site`.
//
// THE TWO RAW OBSERVABLES (measured blind; predicted nothing):
//   • item 4 — the director WINDING around a cycle: transport the oriented director
//     `σ·n` across each X_K edge applying the committed `U_e` (`σ ↦ U_e·σ`); around a
//     closed cycle the director returns as `(∏U)·n` — FLIPPED iff `∏U = −1`. The winding
//     is exactly the committed Wilson loop, now realised on a geometric director (a Z/2
//     half-twist). H₁ = 0 ⇒ no cycle ⇒ vacuous (never fabricated).
//   • item 5 — the SITE-WITNESS: which X_K sites carry the variation = the sites incident
//     to the `U_e = −1` edges in the committed flat gauge (where the director flips as it
//     goes round). Non-empty ⟺ the director winds — the holonomy is localised, never
//     free-floating.
//
// DERIVE-ONLY · ADDITIVE. The connection `U` is read through the committed
// `connectionWaveInstrumentV0` (`buildFlatConnection`, `wilsonLoop`,
// `holonomyFromPerCycleW1`) and the committed `seamSign`; Layer-0 is never redefined and
// the cuboctahedral VE-shell / Core geometry is never imported — the clean frame is
// reconstructed from the simplex + the edge-sum alone.

import {
  buildFlatConnection,
  wilsonLoop,
  holonomyFromPerCycleW1,
  type Graph,
  type Sign,
} from './connectionWaveInstrumentV0';
import { seamSign } from './genealogyDag';
// REUSED read-only (never edited): the committed surface type whose `basisCycles`/`perCycleW1`
// the Σ refinement reads. Importing a type is not an edit — Layer-0 stays untouched.
import type { AssembledComplex } from './globalW1';

// ---------------------------------------------------------------------------
// tiny ℝ³ vector helpers (the frame lives in ℝ³; the graphs are tiny)
// ---------------------------------------------------------------------------
export type Vec3 = [number, number, number];

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a: Vec3): number => Math.hypot(a[0], a[1], a[2]);
const scale = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
const normalize = (a: Vec3): Vec3 => {
  const n = norm(a);
  return n < 1e-12 ? [0, 0, 0] : [a[0] / n, a[1] / n, a[2] / n];
};
const GEOM_TOL = 1e-9;

// ---------------------------------------------------------------------------
// the FORCED cell frame — the regular simplex on the 4 source-less primals
// ---------------------------------------------------------------------------
// The 4 EVEN-sign-count cube corners. Σ = 0, every length = √3, every pairwise inner
// product = −1 — the regular simplex, fixed up to O(3). NO knob: the only freedom is the
// global O(3) frame (an S₄ permutation of the primals ↦ an R_σ ∈ O(3)), which cancels in
// every inner-product / winding observable.
export const SIMPLEX_FRAME: Vec3[] = [
  [1, 1, 1],
  [1, -1, -1],
  [-1, 1, -1],
  [-1, -1, 1],
];

export interface CellFrame {
  cornerIds: string[]; // the 4 source-less primals, sorted (deterministic assignment)
  qCorner: Record<string, Vec3>; // primal id → its forced simplex vector
  sumIsZero: boolean; // Σ q_v = 0
  equalLength: boolean; // all |q_v| equal
  equalInnerProducts: boolean; // all pairwise q_i·q_j equal
  commonLength: number; // the shared |q_v| (= √3)
  commonInnerProduct: number; // the shared q_i·q_j (= −1)
}

// Assign the 4 sorted primal ids to the 4 simplex vectors (forced, deterministic). Throws
// on ≠ 4 primals — the tetra cell has exactly 4 source-less corners.
export function buildCellFrame(cornerIds: string[]): CellFrame {
  if (cornerIds.length !== 4) {
    throw new Error(`buildCellFrame: expected 4 source-less primals, got ${cornerIds.length}`);
  }
  const sorted = [...cornerIds].sort((a, b) => a.localeCompare(b));
  const qCorner: Record<string, Vec3> = {};
  sorted.forEach((id, i) => (qCorner[id] = SIMPLEX_FRAME[i]));

  const vecs = sorted.map((id) => qCorner[id]);
  const sum = vecs.reduce(add, [0, 0, 0] as Vec3);
  const sumIsZero = norm(sum) < GEOM_TOL;

  const lengths = vecs.map(norm);
  const commonLength = lengths[0];
  const equalLength = lengths.every((l) => Math.abs(l - commonLength) < GEOM_TOL);

  const inner: number[] = [];
  for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) inner.push(dot(vecs[i], vecs[j]));
  const commonInnerProduct = inner[0];
  const equalInnerProducts = inner.every((p) => Math.abs(p - commonInnerProduct) < GEOM_TOL);

  return {
    cornerIds: sorted,
    qCorner,
    sumIsZero,
    equalLength,
    equalInnerProducts,
    commonLength,
    commonInnerProduct,
  };
}

// ---------------------------------------------------------------------------
// the FORCED site frame on X_K — q_site = q_i + q_j → the signed octahedral axes
// ---------------------------------------------------------------------------
export interface SiteInput {
  siteId: string;
  parents: [string, string]; // the 2 source-less primals (createdBy.sourceVertexIds)
}

export interface SiteFrame {
  siteId: string;
  parents: [string, string];
  qSite: Vec3; // q_i + q_j (the un-normalised edge-sum)
  nSite: Vec3; // q_site/|q_site| — the director axis (headless ±n_site)
  axisLabel: string; // '+x' | '-x' | '+y' | '-y' | '+z' | '-z' (a readout, never a law)
}

const AXIS_LABELS = ['x', 'y', 'z'];
function axisLabelOf(n: Vec3): string {
  for (let k = 0; k < 3; k += 1) {
    if (Math.abs(Math.abs(n[k]) - 1) < GEOM_TOL) return `${n[k] > 0 ? '+' : '-'}${AXIS_LABELS[k]}`;
  }
  return 'off-axis';
}

export function buildSiteFrames(sites: SiteInput[], cell: CellFrame): SiteFrame[] {
  return sites.map((s) => {
    const q0 = cell.qCorner[s.parents[0]];
    const q1 = cell.qCorner[s.parents[1]];
    if (!q0 || !q1) {
      throw new Error(`buildSiteFrames: site ${s.siteId} has a parent outside the cell frame`);
    }
    const qSite = add(q0, q1);
    const nSite = normalize(qSite);
    return { siteId: s.siteId, parents: s.parents, qSite, nSite, axisLabel: axisLabelOf(nSite) };
  });
}

// a vector is a signed coordinate axis iff exactly one component is ±1 and the rest 0.
export function isSignedAxis(v: Vec3): boolean {
  const nonzero = v.filter((x) => Math.abs(x) > GEOM_TOL);
  return nonzero.length === 1 && Math.abs(Math.abs(nonzero[0]) - 1) < GEOM_TOL;
}

// the six site directors are EXACTLY the octahedron's signed axes {±x,±y,±z} (all six,
// distinct). The forced frame's central claim — verified, not assumed.
export function sitesAreSignedOctahedron(frames: SiteFrame[]): boolean {
  if (frames.length !== 6) return false;
  if (!frames.every((f) => isSignedAxis(f.nSite))) return false;
  const labels = new Set(frames.map((f) => f.axisLabel));
  return ['+x', '-x', '+y', '-y', '+z', '-z'].every((l) => labels.has(l));
}

// ---------------------------------------------------------------------------
// S₄-equivariance — each primal permutation is an R_σ ∈ O(3) (the frame is forced)
// ---------------------------------------------------------------------------
// Given a permutation σ of the 4 sorted primals, the unique linear map with R q_i =
// q_{σ(i)} is orthogonal (∈ O(3)): the simplex is S₄-equivariant. We solve R on the basis
// {q_0,q_1,q_2} (the simplex spans ℝ³) and check R q_3 = q_{σ(3)} and RᵀR = I.
function mat3FromColumns(c0: Vec3, c1: Vec3, c2: Vec3): number[][] {
  return [
    [c0[0], c1[0], c2[0]],
    [c0[1], c1[1], c2[1]],
    [c0[2], c1[2], c2[2]],
  ];
}
function inverse3(m: number[][]): number[][] | null {
  const [a, b, c] = m[0];
  const [d, e, f] = m[1];
  const [g, h, i] = m[2];
  const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
  if (Math.abs(det) < GEOM_TOL) return null;
  const inv = 1 / det;
  return [
    [(e * i - f * h) * inv, (c * h - b * i) * inv, (b * f - c * e) * inv],
    [(f * g - d * i) * inv, (a * i - c * g) * inv, (c * d - a * f) * inv],
    [(d * h - e * g) * inv, (b * g - a * h) * inv, (a * e - b * d) * inv],
  ];
}
function mul3(a: number[][], b: number[][]): number[][] {
  const r = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  for (let i = 0; i < 3; i += 1)
    for (let j = 0; j < 3; j += 1) for (let k = 0; k < 3; k += 1) r[i][j] += a[i][k] * b[k][j];
  return r;
}
function applyMat(m: number[][], v: Vec3): Vec3 {
  return [
    m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
    m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
    m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
  ];
}

export interface EquivarianceCheck {
  perm: number[]; // σ as an array (σ[i] = image of corner i)
  isO3: boolean; // RᵀR = I (R is orthogonal)
  fixesSimplex: boolean; // R q_i = q_{σ(i)} for all 4 (including the off-basis q_3)
}

export function s4EquivariantO3(perm: number[]): EquivarianceCheck {
  const q = SIMPLEX_FRAME;
  // basis B = [q0 q1 q2]; target T = [q_{σ0} q_{σ1} q_{σ2}]; R = T B⁻¹.
  const Binv = inverse3(mat3FromColumns(q[0], q[1], q[2]));
  if (!Binv) return { perm, isO3: false, fixesSimplex: false };
  const T = mat3FromColumns(q[perm[0]], q[perm[1]], q[perm[2]]);
  const R = mul3(T, Binv);
  // RᵀR = I?
  const Rt = [0, 1, 2].map((i) => [0, 1, 2].map((j) => R[j][i]));
  const RtR = mul3(Rt, R);
  let isO3 = true;
  for (let i = 0; i < 3; i += 1)
    for (let j = 0; j < 3; j += 1)
      if (Math.abs(RtR[i][j] - (i === j ? 1 : 0)) > 1e-6) isO3 = false;
  // R q_3 = q_{σ3}? (the off-basis corner closes the equivariance)
  const image3 = applyMat(R, q[3]);
  const fixesSimplex = norm(add(image3, scale(q[perm[3]], -1))) < 1e-6;
  return { perm, isO3, fixesSimplex };
}

// ---------------------------------------------------------------------------
// the honesty-budget — #knobs ≤ #orbits (the hardest gate)
// ---------------------------------------------------------------------------
// The frame is FORCED → zero free frame knobs. The ONLY declared freedom is one
// S₄-equivariant field weight (a constant scaling of the director magnitude), counted
// against the #orbits of Aut(form): the octahedral vertex action is transitive ⇒ 1 orbit.
// A PER-SITE weight would be 6 knobs > 1 orbit ⇒ REJECT — equivariance is what keeps the
// budget. The weight enters NO topological observable (winding/witness ignore it) — it is
// the legitimate, F2-robust freedom.
export const DECLARED_FIELD_WEIGHT = 1;
export const FRAME_KNOB_COUNT = 0; // the geometry is forced — zero free frame knobs
export const FIELD_WEIGHT_KNOB_COUNT = 1; // the one equivariant field weight
export const AUT_FORM_VERTEX_ORBITS = 1; // octahedral vertex action ≈ 1 orbit (transitive)

export function knobsWithinBudget(nKnobs: number, nOrbits: number): boolean {
  return nKnobs <= nOrbits;
}

// ---------------------------------------------------------------------------
// graph helpers — the X_K edge a step crosses, and its committed sign
// ---------------------------------------------------------------------------
function edgeIndexBetween(graph: Graph, a: number, b: number): number {
  return graph.edges.findIndex((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a));
}

// ---------------------------------------------------------------------------
// item 4 — the director winding (the oriented director transported round the cycle)
// ---------------------------------------------------------------------------
export interface TransportReadout {
  orientations: number[]; // σ at each visited site (σ_0 = +1); length = loop.length + 1 (closes)
  edgeSignsCrossed: Sign[]; // the committed U_e crossed at each step
  fieldWeight: number; // the declared equivariant weight (scales magnitude only)
}

// Transport the oriented director σ·n around `loopVertices` (a closed walk), applying the
// committed sign at each crossed X_K edge: σ ↦ U_e·σ. `fieldWeight` scales the director's
// magnitude only (the declared equivariant freedom) — it does NOT enter σ or the winding.
export function transportDirector(
  graph: Graph,
  edgeSigns: Sign[],
  loopVertices: number[],
  fieldWeight: number = DECLARED_FIELD_WEIGHT,
): TransportReadout {
  const orientations: number[] = [1];
  const edgeSignsCrossed: Sign[] = [];
  let sigma = 1;
  for (let i = 0; i < loopVertices.length; i += 1) {
    const a = loopVertices[i];
    const b = loopVertices[(i + 1) % loopVertices.length];
    const idx = edgeIndexBetween(graph, a, b);
    if (idx < 0) throw new Error(`transportDirector: no X_K edge ${a}-${b}`);
    const s = edgeSigns[idx];
    sigma *= s;
    edgeSignsCrossed.push(s);
    orientations.push(sigma);
  }
  return { orientations, edgeSignsCrossed, fieldWeight };
}

export interface WindingReadout {
  windingSign: Sign | null; // ∏U around the cycle; null ⇔ vacuous (no H₁ generator)
  windingClass: 0 | 1 | null; // the Z/2 winding bit (1 = half-twist); null ⇔ vacuous
  directorReturn: 'flipped' | 'aligned' | 'vacuous'; // the geometric statement
  vacuous: boolean; // H₁ = 0 ⇒ no cycle to wind around
}

// item 4: the director winding = the σ the oriented director returns with after the cycle
// (= the committed Wilson loop). `vacuous` (H₁ = 0) ⇒ no winding — NEVER fabricated.
export function directorWinding(
  graph: Graph,
  edgeSigns: Sign[],
  loopVertices: number[],
  vacuous = false,
): WindingReadout {
  if (vacuous) {
    return { windingSign: null, windingClass: null, directorReturn: 'vacuous', vacuous: true };
  }
  const { orientations } = transportDirector(graph, edgeSigns, loopVertices);
  const windingSign = orientations[orientations.length - 1] as Sign;
  return {
    windingSign,
    windingClass: windingSign === -1 ? 1 : 0,
    directorReturn: windingSign === -1 ? 'flipped' : 'aligned',
    vacuous: false,
  };
}

// ---------------------------------------------------------------------------
// item 5 — the site-witness (which X_K sites carry the frame's variation)
// ---------------------------------------------------------------------------
export interface SiteWitness {
  flipEdges: Array<{ a: number; b: number }>; // loop edges carrying U_e = −1 (the director flips)
  witnessSites: number[]; // the X_K site indices incident to a flip edge, sorted/unique
  localized: boolean; // witnessSites.length > 0 (the holonomy is localised to specific sites)
}

// item 5: the sites where the director flips as it transports round the cycle = the
// endpoints of the committed `U_e = −1` edges (the seam location in the flat gauge). This
// LOCALISES the holonomy: non-empty ⟺ the director winds (no holonomy without a witness).
export function siteWitness(graph: Graph, edgeSigns: Sign[], loopVertices: number[]): SiteWitness {
  const flipEdges: Array<{ a: number; b: number }> = [];
  const witness = new Set<number>();
  for (let i = 0; i < loopVertices.length; i += 1) {
    const a = loopVertices[i];
    const b = loopVertices[(i + 1) % loopVertices.length];
    const idx = edgeIndexBetween(graph, a, b);
    if (idx < 0) throw new Error(`siteWitness: no X_K edge ${a}-${b}`);
    if (edgeSigns[idx] === -1) {
      flipEdges.push({ a, b });
      witness.add(a);
      witness.add(b);
    }
  }
  return {
    flipEdges,
    witnessSites: [...witness].sort((x, y) => x - y),
    localized: witness.size > 0,
  };
}

// ---------------------------------------------------------------------------
// the runner — read the committed U, realise the two observables on the frame
// ---------------------------------------------------------------------------
export interface FrameWitnessResult {
  vacuous: boolean;
  generators: Sign[]; // (−1)^perCycleW1 per committed H₁ generator (read, not invented)
  edgeSigns: Sign[]; // the committed flat-gauge U_e (from buildFlatConnection)
  nonTreeEdges: number[]; // where the flat gauge concentrates the holonomy
  winding: WindingReadout; // item 4
  witness: SiteWitness; // item 5
  wilsonCrossCheck: Sign | null; // the committed wilsonLoop — must equal winding.windingSign
}

// Read the committed holonomy class `perCycleW1`, build the committed flat gauge over the
// X_K `graph`, and realise the two raw observables on the director transported round
// `loopVertices`. Empty `perCycleW1` ⇒ H₁ = 0 ⇒ vacuous (item 4 no winding, item 5 empty).
export function runFrameWitness(
  graph: Graph,
  perCycleW1: number[],
  loopVertices: number[],
): FrameWitnessResult {
  const hol = holonomyFromPerCycleW1(perCycleW1);
  if (hol.vacuous) {
    return {
      vacuous: true,
      generators: [],
      edgeSigns: graph.edges.map(() => 1 as Sign),
      nonTreeEdges: [],
      winding: directorWinding(graph, [], loopVertices, true),
      witness: { flipEdges: [], witnessSites: [], localized: false },
      wilsonCrossCheck: null,
    };
  }
  const { edgeSigns, nonTreeEdges } = buildFlatConnection(graph, (k) => hol.generators[k]);
  const winding = directorWinding(graph, edgeSigns, loopVertices);
  const witness = siteWitness(graph, edgeSigns, loopVertices);
  const wilsonCrossCheck = wilsonLoop(graph, edgeSigns, loopVertices);
  return {
    vacuous: false,
    generators: hol.generators,
    edgeSigns,
    nonTreeEdges,
    winding,
    witness,
    wilsonCrossCheck,
  };
}

// The committed sign of a single intrinsic seam, read straight from the cascade's w₁ —
// `U = (−1)^{w1} = seamSign(w1)`. A re-export-as-helper so the runner can feed the
// committed `certifyCascadeOrientation` verdict without redefining Layer-0.
export function intrinsicSeamSign(w1: 0 | 1): Sign {
  return seamSign(w1);
}

// ===========================================================================
// item-5 REFINEMENT (ADR 0015) — the gauge-INVARIANT Poincaré-dual class Σ = PD(φ)
// ===========================================================================
// The BFS flip-support above (`siteWitness`) is a gauge-canonical REPRESENTATIVE — it
// moves with the spanning tree. Σ = PD(φ) ∈ H₁(form; ℤ/2) is the INVARIANT object: the
// Poincaré dual of the committed flip cochain φ (`U_e = −1` in the committed flat gauge),
// reduced to its H₁ class over `globalW1.basisCycles`. The cross-check `[Σ]·[γ] ===
// perCycleW1[γ]` reproduces the committed holonomy — and is NON-CIRCULAR:
//   • `Σ` is built FROM φ (allowed) as the RM-spoke dual chain on the barycentric
//     subdivision (which contains the dual cell structure as its RM/RC subcomplex), then
//     reduced to `[Σ]` over `basisCycles` by the BOUNDARY operator — never by a pairing.
//   • the pairing `[Σ]·[γ_j] = (M·[Σ])_j` uses the ℤ/2 INTERSECTION FORM `M[i][j] =
//     [γ_i]·[γ_j]`, computed from the SURFACE GEOMETRY ONLY (the subdivided face words):
//     the diagonal via Wu's frustration cochain (`γ·γ = ⟨w₁,γ⟩`), the off-diagonal via
//     rotation-system crossings. `M` never reads φ or perCycleW1; the pairing is never set
//     to `perCycleW1[j]` nor to `Σ_{e∈γ}φ(e)`. The Klein swap (`[Σ] ≠ perCycleW1`, `M`
//     off-diagonal does the work) is the empirical proof it is not a tautology.
// DERIVE-ONLY · ADDITIVE. `globalW1` is REUSED (its `basisCycles`/`perCycleW1`), never
// edited; the subdivision is rebuilt here to match its edge-ids (Layer-0 untouched).

export interface SubEdge {
  id: string;
  u: string;
  v: string;
}
export interface SubdividedComplex {
  verts: string[];
  edges: SubEdge[];
  cells: Array<{ id: string; word: Array<{ edge: string; dir: 1 | -1 }> }>;
}

export interface PoincareDualResult {
  vacuous: boolean; // H₁ = 0 ⇒ no basis cycle ⇒ no Σ (never fabricated)
  sigmaClass: number[] | null; // [Σ] coordinates over globalW1.basisCycles (ℤ/2); null if irreducible
  intersectionForm: number[][] | null; // M[i][j] = [γ_i]·[γ_j], from the surface geometry ONLY
  pairing: number[] | null; // [Σ]·[γ_j] = (M·[Σ])_j — compare to perCycleW1; NEVER set to it
  sigmaChainEdges: string[]; // the RM-spoke dual chain (a gauge representative; a readout)
  flipEdges: string[]; // the U_e=−1 ORIGINAL edges of φ feeding Σ (the gauge support)
}

// --- (1) barycentric subdivision — mirrors globalW1.barycentricSubdivision EXACTLY so the
// committed `basisCycles` reference these rebuilt edge-ids (verified: ids match per form). ---
export function subdivide(complex: AssembledComplex): SubdividedComplex {
  const edgeOf = new Map(complex.edges.map((e) => [e.id, e]));
  const reg = new Map<string, SubEdge>();
  const ensure = (id: string, x: string, y: string): SubEdge => {
    if (!reg.has(id)) reg.set(id, { id, u: x, v: y });
    return reg.get(id) as SubEdge;
  };
  const edir = (id: string, x: string, y: string): 1 | -1 => {
    const e = reg.get(id) as SubEdge;
    return e.u === x && e.v === y ? 1 : -1;
  };
  const verts = new Set<string>();
  const cells: SubdividedComplex['cells'] = [];
  complex.faces.forEach((face, fi) => {
    const bar = `B:${fi}`;
    verts.add(bar);
    const n = face.boundary.length;
    face.boundary.forEach((slot, p) => {
      const e = edgeOf.get(slot.edge);
      if (!e) throw new Error(`subdivide: face ${fi} slot ${p} references unknown edge ${slot.edge}`);
      const tailSupport = slot.dir === 1 ? e.u : e.v;
      const headSupport = slot.dir === 1 ? e.v : e.u;
      const vTail = `V:${tailSupport}`;
      const vHead = `V:${headSupport}`;
      const mid = `M:${e.id}`;
      verts.add(vTail);
      verts.add(vHead);
      verts.add(mid);
      const heTail = `HE:${e.id}:${slot.dir === 1 ? 'u' : 'v'}`;
      const heHead = `HE:${e.id}:${slot.dir === 1 ? 'v' : 'u'}`;
      const rcTail = `RC:${fi}:${p}`;
      const rcHead = `RC:${fi}:${(p + 1) % n}`;
      const rm = `RM:${fi}:${p}`;
      ensure(heTail, vTail, mid);
      ensure(rm, mid, bar);
      ensure(rcTail, bar, vTail);
      cells.push({
        id: `T:${fi}:${p}:t`,
        word: [
          { edge: heTail, dir: edir(heTail, vTail, mid) },
          { edge: rm, dir: edir(rm, mid, bar) },
          { edge: rcTail, dir: edir(rcTail, bar, vTail) },
        ],
      });
      ensure(heHead, vHead, mid);
      ensure(rcHead, bar, vHead);
      cells.push({
        id: `T:${fi}:${p}:h`,
        word: [
          { edge: heHead, dir: edir(heHead, mid, vHead) },
          { edge: rcHead, dir: edir(rcHead, vHead, bar) },
          { edge: rm, dir: edir(rm, bar, mid) },
        ],
      });
    });
  });
  return { verts: [...verts], edges: [...reg.values()], cells };
}

// --- (2) GF(2) chain algebra over the subdivided edge-index space ---
function makeEdgeIndex(sub: SubdividedComplex): Map<string, number> {
  const idx = new Map<string, number>();
  sub.edges.forEach((e, i) => idx.set(e.id, i));
  return idx;
}
function vecOfEdges(edgeIds: string[], idx: Map<string, number>): Uint8Array {
  const v = new Uint8Array(idx.size);
  for (const id of edgeIds) {
    const i = idx.get(id);
    if (i === undefined) throw new Error(`vecOfEdges: edge ${id} not in subdivision`);
    v[i] ^= 1;
  }
  return v;
}
function faceBoundaryVec(cell: SubdividedComplex['cells'][number], idx: Map<string, number>): Uint8Array {
  return vecOfEdges(
    cell.word.map((s) => s.edge),
    idx,
  );
}
// Solve Σ x_k cols[k] = target over GF(2); returns x (length = cols.length) or null if inconsistent.
function solveGF2(cols: Uint8Array[], target: Uint8Array): Uint8Array | null {
  const R = target.length;
  const C = cols.length;
  const A: Uint8Array[] = [];
  for (let r = 0; r < R; r += 1) {
    const row = new Uint8Array(C + 1);
    for (let c = 0; c < C; c += 1) row[c] = cols[c][r];
    row[C] = target[r];
    A.push(row);
  }
  const pivotCol: number[] = [];
  let pr = 0;
  for (let c = 0; c < C && pr < R; c += 1) {
    let piv = -1;
    for (let r = pr; r < R; r += 1)
      if (A[r][c]) {
        piv = r;
        break;
      }
    if (piv < 0) continue;
    const t = A[pr];
    A[pr] = A[piv];
    A[piv] = t;
    for (let r = 0; r < R; r += 1)
      if (r !== pr && A[r][c]) for (let cc = 0; cc <= C; cc += 1) A[r][cc] ^= A[pr][cc];
    pivotCol.push(c);
    pr += 1;
  }
  for (let r = pr; r < R; r += 1) if (A[r][C]) return null;
  const x = new Uint8Array(C);
  for (let i = 0; i < pivotCol.length; i += 1) x[pivotCol[i]] = A[i][C];
  return x;
}
// reduce a 1-cycle to its H₁ coordinates over basisCycles (modulo the face boundaries) — by
// BOUNDARY algebra, never by a pairing: this is what keeps [Σ] independent of perCycleW1.
function reduceToBasis(
  cycleVec: Uint8Array,
  basisVecs: Uint8Array[],
  boundaryVecs: Uint8Array[],
): number[] | null {
  const x = solveGF2([...basisVecs, ...boundaryVecs], cycleVec);
  return x ? Array.from(x.slice(0, basisVecs.length)) : null;
}

// --- (3) φ — the committed flat gauge on the ORIGINAL edges (φ from perCycleW1 is ALLOWED;
// only the PAIRING must stay independent). Each non-tree edge carries its fundamental
// cycle's w₁, read by lifting the cycle to the subdivision and reducing over basisCycles. ---
function liftEdgeIds(id: string): [string, string] {
  return [`HE:${id}:u`, `HE:${id}:v`];
}
function w1OfOrigCycle(
  origIds: string[],
  idx: Map<string, number>,
  basisVecs: Uint8Array[],
  boundaryVecs: Uint8Array[],
  perCycleW1: number[],
): 0 | 1 {
  const liftIds: string[] = [];
  for (const eid of origIds) liftIds.push(...liftEdgeIds(eid));
  const c = reduceToBasis(vecOfEdges(liftIds, idx), basisVecs, boundaryVecs);
  if (!c) throw new Error('w1OfOrigCycle: lifted cycle not reducible over basisCycles');
  let w = 0;
  for (let i = 0; i < c.length; i += 1) if (c[i]) w ^= perCycleW1[i] & 1;
  return (w & 1) as 0 | 1;
}
function buildPhiOriginal(
  complex: AssembledComplex,
  idx: Map<string, number>,
  basisVecs: Uint8Array[],
  boundaryVecs: Uint8Array[],
  perCycleW1: number[],
): Record<string, 0 | 1> {
  const vid = new Map(complex.vertices.map((v, i) => [v, i]));
  const graph: Graph = {
    n: complex.vertices.length,
    edges: complex.edges.map((e) => ({ a: vid.get(e.u) as number, b: vid.get(e.v) as number })),
  };
  const adj: Array<Array<{ to: number; edge: number }>> = Array.from({ length: graph.n }, () => []);
  graph.edges.forEach((e, i) => {
    adj[e.a].push({ to: e.b, edge: i });
    adj[e.b].push({ to: e.a, edge: i });
  });
  const seen = new Array<boolean>(graph.n).fill(false);
  const parent = new Array<number>(graph.n).fill(-1);
  const parentEdge = new Array<number>(graph.n).fill(-1);
  const treeEdge = new Set<number>();
  for (let s = 0; s < graph.n; s += 1) {
    if (seen[s]) continue;
    seen[s] = true;
    const q = [s];
    while (q.length) {
      const x = q.shift() as number;
      for (const { to, edge } of adj[x])
        if (!seen[to]) {
          seen[to] = true;
          parent[to] = x;
          parentEdge[to] = edge;
          treeEdge.add(edge);
          q.push(to);
        }
    }
  }
  const nonTree: number[] = [];
  graph.edges.forEach((_e, i) => {
    if (!treeEdge.has(i)) nonTree.push(i);
  });
  const pathEdges = (v: number): Set<number> => {
    const s = new Set<number>();
    let cur = v;
    while (parent[cur] !== -1) {
      s.add(parentEdge[cur]);
      cur = parent[cur];
    }
    return s;
  };
  const fundCycle = (ei: number): number[] => {
    const e = graph.edges[ei];
    const set = new Set<number>([ei]);
    for (const x of pathEdges(e.a)) (set.has(x) ? set.delete(x) : set.add(x));
    for (const x of pathEdges(e.b)) (set.has(x) ? set.delete(x) : set.add(x));
    return [...set];
  };
  const genHol = (k: number): Sign => {
    const ids = fundCycle(nonTree[k]).map((ei) => complex.edges[ei].id);
    return w1OfOrigCycle(ids, idx, basisVecs, boundaryVecs, perCycleW1) === 1 ? -1 : 1;
  };
  const flat = buildFlatConnection(graph, genHol);
  const phi: Record<string, 0 | 1> = {};
  complex.edges.forEach((e, i) => {
    phi[e.id] = flat.edgeSigns[i] === -1 ? 1 : 0;
  });
  return phi;
}

// --- (4) Σ = PD(φ): the RM-spoke dual chain. For each flip ORIGINAL edge e (φ(e)=1), add
// the radial spokes RM:fi:p at its midpoint M:e (the dual edge to the two adjacent faces).
// δφ=0 ⇒ this closes into a 1-cycle on the subdivision (a primal representative of PD(φ)). ---
function sigmaChain(complex: AssembledComplex, phi: Record<string, 0 | 1>): string[] {
  const set = new Set<string>();
  complex.faces.forEach((face, fi) => {
    face.boundary.forEach((slot, p) => {
      if (phi[slot.edge] === 1) {
        const id = `RM:${fi}:${p}`;
        if (set.has(id)) set.delete(id);
        else set.add(id);
      }
    });
  });
  return [...set];
}

// --- (5) the ℤ/2 INTERSECTION FORM — surface geometry ONLY (never reads φ / perCycleW1) ---
// diagonal via Wu: γ·γ = ⟨w₁,γ⟩, with w₁ the orientation-FRUSTRATION cochain of the
// subdivided faces (BFS-orient the dual graph from the triangle words; the residual
// frustration on non-tree dual edges is w₁). Pure face geometry.
function frustrationCochain(sub: SubdividedComplex): Record<string, 0 | 1> {
  const inc = new Map<string, Array<{ cell: number; dir: 1 | -1 }>>();
  sub.cells.forEach((c, ci) => {
    for (const s of c.word) (inc.get(s.edge) ?? inc.set(s.edge, []).get(s.edge)!).push({ cell: ci, dir: s.dir });
  });
  const adj: Array<Array<{ to: number; same: boolean }>> = Array.from({ length: sub.cells.length }, () => []);
  for (const [, list] of inc)
    if (list.length === 2) {
      const [a, b] = list;
      adj[a.cell].push({ to: b.cell, same: a.dir === b.dir });
      adj[b.cell].push({ to: a.cell, same: a.dir === b.dir });
    }
  const o = new Array<number>(sub.cells.length).fill(-1);
  for (let s = 0; s < sub.cells.length; s += 1) {
    if (o[s] !== -1) continue;
    o[s] = 0;
    const q = [s];
    while (q.length) {
      const x = q.shift() as number;
      for (const { to, same } of adj[x])
        if (o[to] === -1) {
          o[to] = o[x] ^ (same ? 1 : 0);
          q.push(to);
        }
    }
  }
  const frust: Record<string, 0 | 1> = {};
  for (const [eid, list] of inc) {
    if (list.length !== 2) {
      frust[eid] = 0;
      continue;
    }
    const [a, b] = list;
    frust[eid] = (((a.dir === b.dir ? 1 : 0) ^ o[a.cell] ^ o[b.cell]) & 1) as 0 | 1;
  }
  return frust;
}
function selfIntFrust(cycleSet: Set<string>, frust: Record<string, 0 | 1>): 0 | 1 {
  let s = 0;
  for (const e of cycleSet) s ^= frust[e] ?? 0;
  return (s & 1) as 0 | 1;
}
// the rotation system (cyclic dart order per vertex) from the subdivided triangle corners.
interface Rotation {
  rotation: Map<string, string[]>;
  eById: Map<string, SubEdge>;
  dartKey: (edgeId: string, from: string) => string;
}
function buildRotation(sub: SubdividedComplex): Rotation {
  const eById = new Map(sub.edges.map((e) => [e.id, e]));
  const dartKey = (edgeId: string, from: string): string => `${edgeId}@@${from}`;
  const adj = new Map<string, string[]>();
  const addAdj = (a: string, b: string): void => {
    (adj.get(a) ?? adj.set(a, []).get(a)!).push(b);
    (adj.get(b) ?? adj.set(b, []).get(b)!).push(a);
  };
  const vertOf = new Map<string, string>();
  for (const cell of sub.cells) {
    const steps = cell.word.map((s) => {
      const e = eById.get(s.edge) as SubEdge;
      const tail = s.dir === 1 ? e.u : e.v;
      const head = s.dir === 1 ? e.v : e.u;
      return { e, tail, head };
    });
    const n = steps.length;
    for (let k = 0; k < n; k += 1) {
      const cur = steps[k];
      const nxt = steps[(k + 1) % n];
      const w = cur.head; // == nxt.tail
      const da = dartKey(cur.e.id, w);
      const db = dartKey(nxt.e.id, w);
      vertOf.set(da, w);
      vertOf.set(db, w);
      addAdj(da, db);
    }
  }
  const rotation = new Map<string, string[]>();
  const dartsAtV = new Map<string, string[]>();
  for (const [d, w] of vertOf) (dartsAtV.get(w) ?? dartsAtV.set(w, []).get(w)!).push(d);
  for (const [w, darts] of dartsAtV) {
    const uniq = [...new Set(darts)];
    const seen = new Set<string>();
    const order: string[] = [];
    const start =
      uniq.find((d) => [...new Set(adj.get(d) ?? [])].length < 2) ?? uniq[0];
    let cur: string | undefined = start;
    let prev: string | null = null;
    while (cur && !seen.has(cur)) {
      const here: string = cur;
      seen.add(here);
      order.push(here);
      const nb: string[] = (adj.get(here) ?? []).filter((x: string) => x !== prev);
      const nx: string | undefined = nb.find((x: string) => !seen.has(x));
      prev = here;
      cur = nx;
    }
    rotation.set(w, order);
  }
  return { rotation, eById, dartKey };
}
function cycleDartsAt(cycleSet: Set<string>, w: string, eById: Map<string, SubEdge>, dartKey: Rotation['dartKey']): string[] {
  const out: string[] = [];
  for (const eid of cycleSet) {
    const e = eById.get(eid) as SubEdge;
    if (e.u === w || e.v === w) out.push(dartKey(eid, w));
  }
  return out;
}
// off-diagonal α·β (i≠j): Σ_v [the 2 α-darts and 2 β-darts interleave in the rotation] mod 2.
function crossIntersect(aSet: Set<string>, bSet: Set<string>, rot: Rotation): 0 | 1 {
  const { rotation, eById, dartKey } = rot;
  let total = 0;
  for (const [w, order] of rotation) {
    const ad = new Set(cycleDartsAt(aSet, w, eById, dartKey));
    const bd = new Set(cycleDartsAt(bSet, w, eById, dartKey));
    const seq = order.filter((d) => ad.has(d) || bd.has(d)).map((d) => (ad.has(d) ? 'a' : 'b'));
    if (seq.length === 4 && seq[0] !== seq[1] && seq[1] !== seq[2] && seq[2] !== seq[3]) total ^= 1;
  }
  return (total & 1) as 0 | 1;
}
// homologous perturbation: γ_b ~ γ_b' edge-disjoint from γ_a (XOR subdivided-triangle boundaries).
function makeDisjoint(aSet: Set<string>, bSet: Set<string>, sub: SubdividedComplex): Set<string> {
  const cellEdges = sub.cells.map((c) => c.word.map((s) => s.edge));
  const b = new Set<string>(bSet);
  let guard = 0;
  while (guard < 200) {
    guard += 1;
    const shared = [...b].find((e) => aSet.has(e));
    if (!shared) break;
    const tri = cellEdges.find((es) => es.includes(shared));
    if (!tri) break;
    for (const e of tri) (b.has(e) ? b.delete(e) : b.add(e));
  }
  return b;
}
export function intersectionForm(basisCycles: string[][], sub: SubdividedComplex): number[][] {
  const rot = buildRotation(sub);
  const frust = frustrationCochain(sub);
  const b = basisCycles.length;
  const M: number[][] = Array.from({ length: b }, () => new Array<number>(b).fill(0));
  const sets = basisCycles.map((c) => new Set(c));
  for (let i = 0; i < b; i += 1) {
    M[i][i] = selfIntFrust(sets[i], frust);
    for (let j = i + 1; j < b; j += 1) {
      const x = crossIntersect(sets[i], makeDisjoint(sets[i], sets[j], sub), rot);
      M[i][j] = x;
      M[j][i] = x;
    }
  }
  return M;
}

// --- (6) the pairing [Σ]·[γ_j] = (M·[Σ])_j — a pure ℤ/2 matrix product. NEVER perCycleW1[j],
// NEVER Σ_{e∈γ}φ(e). This is the function whose independence from the law is the whole gate. ---
export function intersectionPairing(sigmaClass: number[], M: number[][]): number[] {
  if (sigmaClass.length === 0) return [];
  return M[0].map((_col, j) => {
    let s = 0;
    for (let i = 0; i < sigmaClass.length; i += 1) if (sigmaClass[i] && M[i][j]) s ^= 1;
    return s & 1;
  });
}

// --- the runner: Σ = PD(φ) over a form, with the gauge-invariant cross-check value ---
// `phiGauge` (optional) applies a ℤ/2 gauge transform φ'(e)=φ(e)⊕g(u)⊕g(v) to feed Σ from a
// SECOND flat gauge — the `pairing` is invariant, the `flipEdges`/`sigmaChainEdges` move.
export function poincareDualClass(
  complex: AssembledComplex,
  basisCycles: string[][],
  perCycleW1: number[],
  phiGauge?: (vertexId: string) => 0 | 1,
): PoincareDualResult {
  if (basisCycles.length === 0) {
    return {
      vacuous: true,
      sigmaClass: null,
      intersectionForm: null,
      pairing: null,
      sigmaChainEdges: [],
      flipEdges: [],
    };
  }
  const sub = subdivide(complex);
  const idx = makeEdgeIndex(sub);
  const basisVecs = basisCycles.map((c) => vecOfEdges(c, idx));
  const boundaryVecs = sub.cells.map((c) => faceBoundaryVec(c, idx));
  const phi = buildPhiOriginal(complex, idx, basisVecs, boundaryVecs, perCycleW1);
  if (phiGauge) {
    const g = (vid: string): 0 | 1 => phiGauge(vid);
    for (const e of complex.edges) phi[e.id] = ((phi[e.id] ^ g(e.u) ^ g(e.v)) & 1) as 0 | 1;
  }
  const flipEdges = complex.edges.filter((e) => phi[e.id] === 1).map((e) => e.id);
  const sigmaChainEdges = sigmaChain(complex, phi);
  const sigmaClass = reduceToBasis(vecOfEdges(sigmaChainEdges, idx), basisVecs, boundaryVecs);
  const M = intersectionForm(basisCycles, sub);
  const pairing = sigmaClass ? intersectionPairing(sigmaClass, M) : null;
  return {
    vacuous: false,
    sigmaClass: sigmaClass ? [...sigmaClass] : null,
    intersectionForm: M,
    pairing,
    sigmaChainEdges,
    flipEdges,
  };
}

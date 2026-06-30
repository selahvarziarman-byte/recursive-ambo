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

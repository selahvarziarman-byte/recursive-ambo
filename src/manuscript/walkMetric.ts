// walkMetric — THE WALK'S OWN METRIC (STAMP K-1e + its addendum, 2026-09-16).
//
// One producer for everything the walk does WITH the room's metric rather than
// with the chart: the tangent inner product at a chart point, Gram–Schmidt in
// that metric, PARALLEL TRANSPORT of a tangent vector along a chart segment
// (a geodesic in the Klein / gnomonic charts), the carriage of points and
// directions through a door, the true distance between two chart points, and
// the angle between two frames at one point. The view (ExploreWindow) calls
// these; the witness RUNS the same functions against the same rooms — so the
// researcher's numbers (K-1d: 108.0258° for `a` in Seifert–Weber at their
// sample point, 36.0000° in the Poincaré cell at every point, 0° for `a·A`
// everywhere) are re-derived by the code the person's walk actually uses.
//
// ⛔ THE ADDENDUM'S BUILD FACT: along a leg (between folds) the frame must be
// parallel-transported in the room's own metric; at a fold the door's isometry
// carries it. A rule that merely keeps chart components is caught by the two
// exact witnesses (Poincaré 36.0000° at EVERY point; `a·A` = 0° everywhere).
// At E³ every function below is the identity or the chart's own Euclidean
// reading — the committed flat rooms are byte-unchanged in what they do.

import type { Vec3 } from '../types/geometry';
import { chartDistance, type Mat4 } from '../lib/noncubeDomain';

export type WalkModel = 'S3' | 'H3';

type Vec4 = [number, number, number, number];

const dot3 = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** the tangent-space inner product at chart point k, pulled back from the
 * quadric: a chart displacement `a` at k lifts to (a, 0) corrected by the
 * radial part — for the Klein/gnomonic charts
 *   H³: (a·b)/(1−k·k) + (k·a)(k·b)/(1−k·k)²
 *   S³: (a·b)/(1+k·k) − (k·a)(k·b)/(1+k·k)² */
export const modelIP = (model: WalkModel, k: Vec3, a: Vec3, b: Vec3): number => {
  const kk = dot3(k, k);
  const ab = dot3(a, b);
  const ka = dot3(k, a);
  const kb = dot3(k, b);
  if (model === 'H3') {
    const s = 1 - kk;
    if (s < 1e-9) return ab; // off the ball — no honest metric; the chart's own
    return ab / s + (ka * kb) / (s * s);
  }
  const s = 1 + kk;
  return ab / s - (ka * kb) / (s * s);
};

/** the inner product the walk reads at chart point k: the model's when the
 * room is sealed curved, the chart's own dot at E³ */
export const walkIP = (model: WalkModel | null | undefined, k: Vec3, a: Vec3, b: Vec3): number =>
  model ? modelIP(model, k, a, b) : dot3(a, b);

/** Gram–Schmidt in the model's metric, IN ORDER — rotates, never reflects. */
export const modelOrthonormalise = (model: WalkModel, k: Vec3, axes: Vec3[]): Vec3[] => {
  const out: Vec3[] = [];
  for (const raw of axes) {
    let v: Vec3 = [raw[0], raw[1], raw[2]];
    for (const done of out) {
      const c = modelIP(model, k, v, done);
      v = [v[0] - c * done[0], v[1] - c * done[1], v[2] - c * done[2]];
    }
    const nn = Math.sqrt(Math.max(1e-12, modelIP(model, k, v, v)));
    out.push([v[0] / nn, v[1] / nn, v[2] / nn]);
  }
  return out;
};

/** an orthonormal frame AT k in the walk's own metric: the given axes made
 * orthonormal in the model at k (the chart's own axes stay themselves at E³) */
export const frameAt = (model: WalkModel | null | undefined, k: Vec3, axes: Vec3[]): Vec3[] =>
  model ? modelOrthonormalise(model, k, axes) : axes.map((a) => [a[0], a[1], a[2]] as Vec3);

/** THE METRE at the seam — the true distance between two chart points */
export const walkDistance = (model: WalkModel | null | undefined, a: Vec3, b: Vec3): number =>
  chartDistance(model ?? 'E3', a, b);

// the quadric lift of a chart point and of a chart tangent at it —
//   H³ (Klein):    X = (k, 1)·s, s = 1/√(1−k·k), ⟨X,X⟩ = −1 (Minkowski, w time-like)
//   S³ (gnomonic): X = (k, 1)·s, s = 1/√(1+k·k), ⟨X,X⟩ = +1
// a chart tangent v lifts to dX·v = s(v, 0) + (ds)(k, 1), ds = ±s³(k·v)
const liftPoint = (model: WalkModel, k: Vec3): Vec4 => {
  const kk = dot3(k, k);
  const s = 1 / Math.sqrt(model === 'H3' ? Math.max(1e-12, 1 - kk) : 1 + kk);
  return [k[0] * s, k[1] * s, k[2] * s, s];
};
const liftTangent = (model: WalkModel, k: Vec3, v: Vec3): Vec4 => {
  const kk = dot3(k, k);
  const s = 1 / Math.sqrt(model === 'H3' ? Math.max(1e-12, 1 - kk) : 1 + kk);
  const ds = (model === 'H3' ? 1 : -1) * s * s * s * dot3(k, v);
  return [s * v[0] + ds * k[0], s * v[1] + ds * k[1], s * v[2] + ds * k[2], ds];
};
const quadricDot = (model: WalkModel, a: Vec4, b: Vec4): number =>
  a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + (model === 'H3' ? -1 : 1) * a[3] * b[3];
/** the chart tangent at the point Y whose lift is the (tangent) 4-vector W:
 * the derivative of X ↦ X_xyz / X_w at Y in the direction W */
const projectTangent = (Y: Vec4, W: Vec4): Vec3 => {
  const w = Y[3];
  return [(W[0] * w - Y[0] * W[3]) / (w * w), (W[1] * w - Y[1] * W[3]) / (w * w), (W[2] * w - Y[2] * W[3]) / (w * w)];
};

/** PARALLEL TRANSPORT of the chart tangent `v` at `from` to the chart point
 * `to`, along the chart segment between them — which IS the geodesic in the
 * Klein and gnomonic charts. In the quadric: the component of v along the
 * geodesic's unit tangent u at X is carried to the unit tangent u′ at Y that
 * points away from X, and the component orthogonal to the plane of X and Y is
 * the same 4-vector at both ends (it is tangent at both). E³: the identity. */
export const transportAlong = (model: WalkModel | null | undefined, from: Vec3, to: Vec3, v: Vec3): Vec3 => {
  if (!model) return [v[0], v[1], v[2]];
  const X = liftPoint(model, from);
  const Y = liftPoint(model, to);
  const V = liftTangent(model, from, v);
  const sgn = model === 'H3' ? -1 : 1; // ⟨X,X⟩
  const xy = quadricDot(model, X, Y);
  const u: Vec4 = [Y[0] - sgn * xy * X[0], Y[1] - sgn * xy * X[1], Y[2] - sgn * xy * X[2], Y[3] - sgn * xy * X[3]];
  const nu = Math.sqrt(Math.abs(quadricDot(model, u, u)));
  if (nu < 1e-12) return [v[0], v[1], v[2]]; // the same point — nothing to carry along
  const uu: Vec4 = [u[0] / nu, u[1] / nu, u[2] / nu, u[3] / nu];
  const back: Vec4 = [-(X[0] - sgn * xy * Y[0]), -(X[1] - sgn * xy * Y[1]), -(X[2] - sgn * xy * Y[2]), -(X[3] - sgn * xy * Y[3])];
  const nb = Math.sqrt(Math.abs(quadricDot(model, back, back)));
  const up: Vec4 = [back[0] / nb, back[1] / nb, back[2] / nb, back[3] / nb];
  const c = quadricDot(model, V, uu);
  const W: Vec4 = [V[0] - c * uu[0] + c * up[0], V[1] - c * uu[1] + c * up[1], V[2] - c * uu[2] + c * up[2], V[3] - c * uu[3] + c * up[3]];
  return projectTangent(Y, W);
};

/** a chart point carried through a projective door; null AT THE HORIZON —
 * the eye stops there, never a fabricated place (the transport's own law) */
export const projectivePoint = (g4: Mat4, k: Vec3): Vec3 | null => {
  const w = g4[12] * k[0] + g4[13] * k[1] + g4[14] * k[2] + g4[15];
  if (Math.abs(w) < 1e-9) return null;
  return [
    (g4[0] * k[0] + g4[1] * k[1] + g4[2] * k[2] + g4[3]) / w,
    (g4[4] * k[0] + g4[5] * k[1] + g4[6] * k[2] + g4[7]) / w,
    (g4[8] * k[0] + g4[9] * k[1] + g4[10] * k[2] + g4[11]) / w,
  ];
};

/** a chart DIRECTION at k carried through a projective door — the derivative
 * of σ ↦ chart(M·(K + σW)) at 0, W = (v, 0): (W′ₓᵧ_z·K′₃ − K′ₓᵧ_z·W′₃) — the
 * positive denominator dropped, so this is the direction (B-114's push) */
export const projectiveDirection = (g4: Mat4, k: Vec3, v: Vec3): Vec3 => {
  const K = [
    g4[0] * k[0] + g4[1] * k[1] + g4[2] * k[2] + g4[3],
    g4[4] * k[0] + g4[5] * k[1] + g4[6] * k[2] + g4[7],
    g4[8] * k[0] + g4[9] * k[1] + g4[10] * k[2] + g4[11],
    g4[12] * k[0] + g4[13] * k[1] + g4[14] * k[2] + g4[15],
  ];
  const W = [
    g4[0] * v[0] + g4[1] * v[1] + g4[2] * v[2],
    g4[4] * v[0] + g4[5] * v[1] + g4[6] * v[2],
    g4[8] * v[0] + g4[9] * v[1] + g4[10] * v[2],
    g4[12] * v[0] + g4[13] * v[1] + g4[14] * v[2],
  ];
  return [W[0] * K[3] - K[0] * W[3], W[1] * K[3] - K[1] * W[3], W[2] * K[3] - K[2] * W[3]];
};

/** the committed 12-float affine door on a point and on a direction */
export const affinePoint = (g: number[], p: Vec3): Vec3 => [
  g[0] * p[0] + g[1] * p[1] + g[2] * p[2] + g[9],
  g[3] * p[0] + g[4] * p[1] + g[5] * p[2] + g[10],
  g[6] * p[0] + g[7] * p[1] + g[8] * p[2] + g[11],
];
export const affineVector = (g: number[], v: Vec3): Vec3 => [
  g[0] * v[0] + g[1] * v[1] + g[2] * v[2],
  g[3] * v[0] + g[4] * v[1] + g[5] * v[2],
  g[6] * v[0] + g[7] * v[1] + g[8] * v[2],
];

/** the angle, in degrees, of the rotation carrying the frame `ref` onto the
 * frame `frame` — both orthonormal in the walk's metric AT k: θ from the trace
 * of R_ij = ⟨frame_i, ref_j⟩ (K-1d's `frameAngle`, verbatim in this metric) */
export const frameAngleDeg = (model: WalkModel | null | undefined, k: Vec3, frame: Vec3[], ref: Vec3[]): number => {
  let tr = 0;
  for (let i = 0; i < 3; i += 1) tr += walkIP(model, k, frame[i], ref[i]);
  return (Math.acos(Math.max(-1, Math.min(1, (tr - 1) / 2))) * 180) / Math.PI;
};

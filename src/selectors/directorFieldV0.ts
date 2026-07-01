// directorFieldV0 — the nematic director field sampler (DERIVE-ONLY · ADDITIVE).
//
// TWO LAYERS (ADR 0017):
//   • n₀ — the w₁-BLIND nematic FLOOR: the interpolated Q-tensor field of the 6 committed site
//     directors (`sampleDirectorQ` → `directorAt`). Correct, but provably independent of `w₁`
//     (the M1a-v1 finding — see `.handoff/REPORT_DIRECTOR_FIELD_RENDER_M1.md`). It is the floor,
//     not the answer.
//   • n = R(α)·n₀ — the CONNECTION-MODULATED director (M1a-v2, RESEARCHER-RULED): the committed
//     `w₁` lives in the CONNECTION, not the axis values, so we realize the ½ as a continuous
//     phase `α` that sweeps 0→π across a Σ-representative cut, with magnitude = the committed
//     holonomy (so it VANISHES on `w₁=0`). `R(α)` MODULATES the real `n₀` (never replaces it).
//
// DERIVE-ONLY. Everything is committed-derived: `n₀` from the committed site directors; the
// disclination MAGNITUDE from the committed `Σ = PD(φ)` / `windingSign` (the bridge exposes them,
// computed by the committed `poincareDualClass`); the core AXIS from the committed seam-site
// directors. The cut POSITION is a free representative (gauge). It recomputes NO `w₁`, NO flat
// gauge, NO director winding. The only maths is generic rendering linear-algebra (a 3×3
// eigensolver + Rodrigues rotation) — render infrastructure, exactly as `WitnessRenderV0` does
// its own quaternion maths.
//
// ── GATE STATUS ───────────────────────────────────────────────────────────────────────────
// Gated by `scripts/diagnose-director-field.cjs` (the refined v2 gate: linking-holonomy ===
// committed `w₁` measured from the field · strength ½ · absent on `w₁=0` · representative-
// invariant). The n₀ floor is correct (M1a-v1) but w₁-blind; the connection layer is what the
// ½ lives in. See `.handoff/REPORT_DIRECTOR_FIELD_M1a_V2.md`. Reusable at any 3D point (M2-ready).

import { buildKnownSeamRenderState, type RenderState } from './witnessBridge';
import type { Vec3 } from '../types/geometry';

// a symmetric 3×3 matrix (the Q-tensor lives here). Plain number[][] for transpile simplicity.
export type Mat3 = number[][];

const dot3 = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const len3 = (a: Vec3): number => Math.hypot(a[0], a[1], a[2]);
const cross3 = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export function normalize3(a: Vec3): Vec3 {
  const n = len3(a);
  return n < 1e-12 ? [0, 0, 0] : [a[0] / n, a[1] / n, a[2] / n];
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// LAYER 0 — n₀, the w₁-blind nematic floor (pure Q-tensor interpolation; M1a-v1, unchanged)
// ═══════════════════════════════════════════════════════════════════════════════════════════

// the nematic Q-tensor of a director line: Q = n⊗n − ⅓I (symmetric, traceless; Q(n)=Q(−n)).
export function qFromDirector(nRaw: Vec3): Mat3 {
  const n = normalize3(nRaw);
  return [
    [n[0] * n[0] - 1 / 3, n[0] * n[1], n[0] * n[2]],
    [n[1] * n[0], n[1] * n[1] - 1 / 3, n[1] * n[2]],
    [n[2] * n[0], n[2] * n[1], n[2] * n[2] - 1 / 3],
  ];
}

export interface DirectorSite {
  siteKey: string; // 'ab'…'bc' (a readout)
  siteId: string; // the committed F0 vertex id (join key)
  position: Vec3; // committed F0 octahedron-vertex position (the anchor point)
  director: Vec3; // committed n_site (directorAxis), normalised — NOT recomputed
  orientationSign: 1 | -1; // committed transported flat-gauge sign — NOT recomputed
  Q: Mat3; // Q_i = n_i⊗n_i − ⅓I (sign-free; built from director only)
}

export function directorSitesFromRenderState(rs: RenderState): DirectorSite[] {
  return rs.sites.map((s) => ({
    siteKey: s.siteKey,
    siteId: s.siteId,
    position: s.position,
    director: normalize3(s.directorAxis),
    orientationSign: s.orientationSign,
    Q: qFromDirector(s.directorAxis),
  }));
}

export function buildDirectorSites(): DirectorSite[] {
  return directorSitesFromRenderState(buildKnownSeamRenderState());
}

// THE n₀ SAMPLER — inverse-distance (Shepard) interpolation of the 6 site Q-tensors. Sign-free
// (nematic), exact at the nodes. Reusable for any 3D point. This is the w₁-blind FLOOR.
export interface SampleOpts {
  power?: number; // IDW exponent (default 2)
  eps?: number; // softening to keep the weight finite AT a node (default 1e-9)
}

export function sampleDirectorQ(p: Vec3, sites: DirectorSite[], opts: SampleOpts = {}): Mat3 {
  const power = opts.power ?? 2;
  const eps = opts.eps ?? 1e-9;
  const acc: Mat3 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  let wsum = 0;
  for (const s of sites) {
    const dx = p[0] - s.position[0];
    const dy = p[1] - s.position[1];
    const dz = p[2] - s.position[2];
    const d2 = dx * dx + dy * dy + dz * dz + eps;
    const w = 1 / Math.pow(d2, power / 2);
    for (let r = 0; r < 3; r += 1) for (let c = 0; c < 3; c += 1) acc[r][c] += w * s.Q[r][c];
    wsum += w;
  }
  if (wsum === 0) return acc;
  for (let r = 0; r < 3; r += 1) for (let c = 0; c < 3; c += 1) acc[r][c] /= wsum;
  return acc;
}

// a generic symmetric-3×3 eigensolver (cyclic Jacobi, values + vectors) — RENDER infrastructure.
export interface EigSym3 {
  values: [number, number, number]; // descending
  vectors: [Vec3, Vec3, Vec3]; // matching unit eigenvectors
}

export function eigSym3(min: Mat3): EigSym3 {
  const a = min.map((row) => row.slice());
  const v: number[][] = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  for (let sweep = 0; sweep < 100; sweep += 1) {
    const off = Math.abs(a[0][1]) + Math.abs(a[0][2]) + Math.abs(a[1][2]);
    if (off < 1e-15) break;
    for (let p = 0; p < 3; p += 1) {
      for (let q = p + 1; q < 3; q += 1) {
        if (Math.abs(a[p][q]) < 1e-18) continue;
        const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < 3; k += 1) {
          const akp = a[k][p];
          const akq = a[k][q];
          a[k][p] = c * akp - s * akq;
          a[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < 3; k += 1) {
          const apk = a[p][k];
          const aqk = a[q][k];
          a[p][k] = c * apk - s * aqk;
          a[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < 3; k += 1) {
          const vkp = v[k][p];
          const vkq = v[k][q];
          v[k][p] = c * vkp - s * vkq;
          v[k][q] = s * vkp + c * vkq;
        }
      }
    }
  }
  const diag: [number, number, number] = [a[0][0], a[1][1], a[2][2]];
  const order = [0, 1, 2].sort((i, j) => diag[j] - diag[i]);
  const col = (i: number): Vec3 => normalize3([v[0][i], v[1][i], v[2][i]]);
  return {
    values: [diag[order[0]], diag[order[1]], diag[order[2]]],
    vectors: [col(order[0]), col(order[1]), col(order[2])],
  };
}

export interface DirectorReadout {
  director: Vec3; // principal eigenvector (the line direction; headless) — this is n₀
  topGap: number; // λ₁ − λ₂ (→ 0 at an n₀ degeneracy)
  order: number; // λ₁
  values: [number, number, number];
}

// directorAt → n₀ (the floor). The connection layer below MODULATES this.
export function directorAt(p: Vec3, sites: DirectorSite[], opts?: SampleOpts): DirectorReadout {
  const e = eigSym3(sampleDirectorQ(p, sites, opts));
  return { director: e.vectors[0], topGap: e.values[0] - e.values[1], order: e.values[0], values: e.values };
}

// ═══════════════════════════════════════════════════════════════════════════════════════════
// LAYER 1 — n = R(α)·n₀, the CONNECTION-MODULATED director (M1a-v2, researcher-ruled)
// ═══════════════════════════════════════════════════════════════════════════════════════════

// Rodrigues rotation of v about a unit `axis` by `ang`.
function rodrigues(v: Vec3, axisRaw: Vec3, ang: number): Vec3 {
  const axis = normalize3(axisRaw);
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  const k = cross3(axis, v);
  const d = dot3(axis, v) * (1 - c);
  return [v[0] * c + k[0] * s + axis[0] * d, v[1] * c + k[1] * s + axis[1] * d, v[2] * c + k[2] * s + axis[2] * d];
}

// THE COMMITTED HOLONOMY (the disclination's magnitude). 1 iff Σ=PD(φ) is non-trivial (the
// flip), 0 iff vacuous (the control / orientable). Cross-checked against the committed
// `windingSign` (−1 ⟺ non-trivial). This is THE discriminator: on `w₁=0`, Σ vacuous ⇒ H=0 ⇒
// α≡0 ⇒ n≡n₀. Read from the committed bridge exposure; recomputed: nothing.
export function committedHolonomy(sigmaClass: number[] | null, windingSign: 1 | -1 | null): 0 | 1 {
  const sigmaNontrivial = sigmaClass != null && sigmaClass.some((x) => (x & 1) === 1);
  const connectionFlips = windingSign === -1;
  // both committed certificates must agree (Σ class ⟺ the connection's Wilson loop).
  return sigmaNontrivial && connectionFlips ? 1 : 0;
}

// THE CORE AXIS — committed-derived from the two seam-site directors: d = n_a × n_b. For the
// committed seam {bd(−y), cd(−x)} this is (0,0,∓1) = ±ẑ (⟂ both seam directors). NOT a free
// choice — it is fixed by the committed seam + directors. (The core POSITION is the free gauge.)
export function seamCoreAxis(sites: DirectorSite[], seamEdge: { a: string; b: string }): Vec3 {
  const a = sites.find((s) => s.siteId === seamEdge.a);
  const b = sites.find((s) => s.siteId === seamEdge.b);
  if (!a || !b) throw new Error('directorFieldV0.seamCoreAxis: seam endpoints not among sites');
  const axis = normalize3(cross3(a.director, b.director));
  if (len3(axis) < 1e-9) throw new Error('directorFieldV0.seamCoreAxis: seam directors are parallel (no core axis)');
  return axis;
}

// a deterministic orthonormal frame {u,v} ⟂ d (so the azimuth / branch-cut is well-defined).
function framePerp(d: Vec3): { u: Vec3; v: Vec3 } {
  const dn = normalize3(d);
  const t: Vec3 = Math.abs(dn[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  const u = normalize3(cross3(dn, t));
  const v = normalize3(cross3(dn, u));
  return { u, v };
}

export interface ConnectionFieldOpts {
  holonomy: 0 | 1; // the committed magnitude (committedHolonomy)
  coreAxis: Vec3; // committed (seamCoreAxis)
  corePoint?: Vec3; // the cut's free representative position (default = octahedron centre)
  cutPhase?: number; // the branch-cut azimuth — a free representative (default 0)
}

export interface ConnectionSample {
  director: Vec3; // n = R(α)·n₀ — the connection-modulated director (a line; headless)
  n0: Vec3; // the w₁-blind floor at p
  alpha: number; // the modulation angle (0 on control / far from cut)
  topGap: number; // n₀'s degeneracy signal at p
}

export interface ConnectionField {
  holonomy: 0 | 1;
  coreAxis: Vec3;
  corePoint: Vec3;
  cutPhase: number;
  sites: DirectorSite[];
  n0At(p: Vec3): Vec3;
  sampleDirector(p: Vec3): ConnectionSample;
}

// Build the connection-modulated field. `n(x) = R(α(x))·n₀(x)`:
//   • α(x) = holonomy · θ(x)/2, θ = azimuth around the core line (corePoint, coreAxis). θ sweeps
//     0→2π around the core ⇒ α sweeps 0→π·holonomy ⇒ on flip (H=1) the director makes a continuous
//     π half-turn and the VECTOR returns flipped after one loop (the ½-disclination); on control
//     (H=0) α≡0 ⇒ n≡n₀ (the discriminator). The branch cut (θ=cutPhase) is a free representative.
//   • R(α) about axis a = n₀ × coreAxis (⟂ n₀) ⇒ R(π)·n₀ = −n₀ ⇒ the director LINE is continuous
//     across the cut (nematic), only its orientation flips — the half-turn, never a tear.
export function buildConnectionField(sites: DirectorSite[], opts: ConnectionFieldOpts): ConnectionField {
  const holonomy = opts.holonomy;
  const coreAxis = normalize3(opts.coreAxis);
  const corePoint = opts.corePoint ?? [0, 0, 0];
  const cutPhase = opts.cutPhase ?? 0;
  const { u, v } = framePerp(coreAxis);

  const n0At = (p: Vec3): Vec3 => directorAt(p, sites).director;

  const azimuth = (p: Vec3): number => {
    const w: Vec3 = [p[0] - corePoint[0], p[1] - corePoint[1], p[2] - corePoint[2]];
    const proj = dot3(w, coreAxis);
    const wp: Vec3 = [w[0] - proj * coreAxis[0], w[1] - proj * coreAxis[1], w[2] - proj * coreAxis[2]];
    return Math.atan2(dot3(wp, v), dot3(wp, u));
  };

  const sampleDirector = (p: Vec3): ConnectionSample => {
    const r = directorAt(p, sites);
    const n0 = r.director;
    if (holonomy === 0) return { director: n0, n0, alpha: 0, topGap: r.topGap };
    let theta = azimuth(p) - cutPhase;
    while (theta < 0) theta += 2 * Math.PI;
    while (theta >= 2 * Math.PI) theta -= 2 * Math.PI;
    const alpha = (holonomy * theta) / 2; // 0 → π across one turn around the core
    let axis = cross3(n0, coreAxis);
    if (len3(axis) < 1e-6) axis = cross3(n0, u); // n₀ ∥ coreAxis fallback
    const director = normalize3(rodrigues(n0, axis, alpha));
    return { director, n0, alpha, topGap: r.topGap };
  };

  return { holonomy, coreAxis, corePoint, cutPhase, sites, n0At, sampleDirector };
}

// Convenience: build the flip field straight from a committed RenderState (the bridge exposure).
export function connectionFieldFromRenderState(
  rs: RenderState,
  opts?: { corePoint?: Vec3; cutPhase?: number },
): ConnectionField {
  const sites = directorSitesFromRenderState(rs);
  const holonomy = committedHolonomy(rs.sigmaClass, rs.windingSign);
  const coreAxis = seamCoreAxis(sites, rs.seamEdges[0]);
  return buildConnectionField(sites, {
    holonomy,
    coreAxis,
    corePoint: opts?.corePoint,
    cutPhase: opts?.cutPhase,
  });
}

export { dot3 as directorDot, cross3 as directorCross };

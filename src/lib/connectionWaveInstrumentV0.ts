// connectionWaveInstrumentV0 — Layer-1: the connection-wave instrument (ADR 0013).
//
// A LABELED PROBE `ψ` over the committed Layer-0 invariant. It REPRODUCES the holonomy /
// spectral flow; it never invents it. IRON FILINGS, NEVER THE MAGNETIC FIELD: the law is
// the holonomy class (committed `globalW1.perCycleW1` / `certifyCascadeOrientation`); this
// module only READS `U` and lays it on a flat gauge so a Laplacian spectrum and a Wilson
// loop reproduce it. The three disciplines ARE the gate:
//
//   • U — flat gauge of the COMMITTED holonomy (read, don't redefine; no committed edit).
//     Over the X_K graph, build a spanning-tree representative: tree edges +1; each
//     non-tree edge carries its fundamental cycle's holonomy — `(-1)^perCycleW1` when it
//     closes an H₁ generator, else +1 (contractible ⇒ flat). The spectrum is
//     gauge-INVARIANT; what it reads off is the holonomy class.
//   • DECLARE — every knob (γ, wave-speed, α, ω_s, φ_s, τ, κ) is a constant declared up
//     front (`DECLARED_KNOBS`), never result-fitted.
//   • LABEL — no law, verdict, or sealed value is written in `ψ`. `ψ` is the instrument;
//     `w₁ / Hol / F_γ / isospectrality / M_var` (all Layer-0) are what gets asserted.
//
// DERIVE-ONLY · ADDITIVE · ZERO committed imports — a pure function of an `AssembledComplex`'s
// `perCycleW1` (passed in by the caller, read from the committed `globalW1`) and a graph.
// `ψ : X_K → ℂ⊗ℝ³`; the connection `U` is a real scalar sign ±1, so ℝ³ factorises into
// three identical copies and a complex scalar `ψ` per site carries the holonomy faithfully.

// ---------------------------------------------------------------------------
// DECLARE — the knobs (constants; never result-fitted) + their declared ranges
// ---------------------------------------------------------------------------
export interface Knobs {
  gamma: number; // damping γ
  waveSpeed: number; // c (wave-speed); the law's L_U coefficient is c²
  alpha: number; // drive amplitude of J_K(t)
  omegaS: number; // drive frequency ω_s
  phiS: number; // drive phase φ_s
  tau: number; // a declared relaxation knob (enters the drive envelope only)
  kappa: number; // cubic self-coupling κ in N(ψ)=κ|ψ|²ψ
}

export const DECLARED_KNOBS: Knobs = {
  gamma: 0.5,
  waveSpeed: 1,
  alpha: 0.25,
  omegaS: 1,
  phiS: 0,
  tau: 0.5,
  kappa: 0,
};

// The declared sweep ranges (charter §4.3 / seal [5]); F_γ and the order verdict must be
// invariant across these.
export const KNOB_RANGES = {
  gamma: [0.1, 0.5, 1, 2],
  waveSpeed: [0.5, 1, 2, 5],
  alpha: [0, 0.25, 0.5],
  tau: [0, 0.5, 1],
  kappa: [0, 0.5, 1],
} as const;

export type Sign = 1 | -1;

export interface Graph {
  n: number;
  edges: Array<{ a: number; b: number }>; // undirected; unit weight
}

// ---------------------------------------------------------------------------
// a small symmetric eigensolver (cyclic Jacobi) — the graphs here are tiny
// ---------------------------------------------------------------------------
export function symmetricEigenvalues(input: number[][]): number[] {
  const n = input.length;
  if (n === 0) return [];
  const a = input.map((row) => row.slice());
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
      }
    }
  }
  const eig: number[] = [];
  for (let i = 0; i < n; i += 1) eig.push(a[i][i]);
  return eig.sort((x, y) => x - y);
}

// ---------------------------------------------------------------------------
// graphs, the bare Laplacian, and the FLAT connection-Laplacian L_U
// ---------------------------------------------------------------------------
export function cycleGraph(n: number): Graph {
  const edges: Array<{ a: number; b: number }> = [];
  for (let i = 0; i < n; i += 1) edges.push({ a: i, b: (i + 1) % n });
  return { n, edges };
}

// the bare graph Laplacian L = D − A (no connection); used by the order track and STRIP.
export function laplacian(graph: Graph): number[][] {
  const L = Array.from({ length: graph.n }, () => new Array<number>(graph.n).fill(0));
  for (const { a, b } of graph.edges) {
    L[a][a] += 1;
    L[b][b] += 1;
    L[a][b] -= 1;
    L[b][a] -= 1;
  }
  return L;
}

// the connection-Laplacian over signed edges: (L_U ψ)_x = Σ_{y~x}(ψ_x − U_xy ψ_y).
// For U=±1 this is the real symmetric SIGNED Laplacian L = D − A_U, A_U[x][y]=U_xy.
export function signedLaplacian(graph: Graph, edgeSigns: Sign[]): number[][] {
  const L = Array.from({ length: graph.n }, () => new Array<number>(graph.n).fill(0));
  graph.edges.forEach(({ a, b }, i) => {
    const u = edgeSigns[i];
    L[a][a] += 1;
    L[b][b] += 1;
    L[a][b] -= u;
    L[b][a] -= u;
  });
  return L;
}

// FLAT GAUGE (charter §4.4 / seal [7]): a spanning tree (BFS) carries +1 on every edge;
// the remaining (non-tree) edges each close one fundamental cycle. `generatorHolonomy`
// supplies the holonomy of each non-tree edge's cycle in edge order (the caller maps the
// committed `perCycleW1` of the H₁ generators here; contractible ⇒ +1). The result is a
// flat representative of the committed holonomy class — gauge-invariant spectrum.
export function buildFlatConnection(
  graph: Graph,
  generatorHolonomy: (nonTreeEdgeIndex: number) => Sign,
): { edgeSigns: Sign[]; nonTreeEdges: number[]; treeEdges: number[] } {
  const parent = new Array<number>(graph.n).fill(-1);
  const seen = new Array<boolean>(graph.n).fill(false);
  // adjacency with edge indices
  const adj: Array<Array<{ to: number; edge: number }>> = Array.from({ length: graph.n }, () => []);
  graph.edges.forEach(({ a, b }, i) => {
    adj[a].push({ to: b, edge: i });
    adj[b].push({ to: a, edge: i });
  });
  const treeEdgeSet = new Set<number>();
  for (let start = 0; start < graph.n; start += 1) {
    if (seen[start]) continue;
    seen[start] = true;
    const queue = [start];
    while (queue.length) {
      const x = queue.shift() as number;
      for (const { to, edge } of adj[x]) {
        if (!seen[to]) {
          seen[to] = true;
          parent[to] = x;
          treeEdgeSet.add(edge);
          queue.push(to);
        }
      }
    }
  }
  const treeEdges: number[] = [];
  const nonTreeEdges: number[] = [];
  graph.edges.forEach((_e, i) => (treeEdgeSet.has(i) ? treeEdges : nonTreeEdges).push(i));
  const edgeSigns: Sign[] = graph.edges.map(() => 1);
  nonTreeEdges.forEach((edgeIndex, k) => {
    edgeSigns[edgeIndex] = generatorHolonomy(k);
  });
  return { edgeSigns, nonTreeEdges, treeEdges };
}

// ---------------------------------------------------------------------------
// readouts — the spectrum, the Wilson loop / holonomy, F_γ
// ---------------------------------------------------------------------------
export interface SpectrumReadout {
  eigenvalues: number[];
  minEig: number;
  det: number;
  hasZeroMode: boolean;
}

const ZERO_TOL = 1e-9;

export function spectrumReadout(matrix: number[][]): SpectrumReadout {
  const eigenvalues = symmetricEigenvalues(matrix);
  const minEig = eigenvalues.length ? eigenvalues[0] : 0;
  const det = eigenvalues.reduce((p, x) => p * x, 1);
  return { eigenvalues, minEig, det, hasZeroMode: Math.abs(minEig) < ZERO_TOL };
}

// the Wilson loop: ∏ U around an ordered closed loop of vertices. The holonomy class.
export function wilsonLoop(graph: Graph, edgeSigns: Sign[], loopVertices: number[]): Sign {
  const edgeSign = (a: number, b: number): Sign => {
    const idx = graph.edges.findIndex((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a));
    if (idx < 0) throw new Error(`wilsonLoop: no edge ${a}-${b}`);
    return edgeSigns[idx];
  };
  let product = 1;
  for (let i = 0; i < loopVertices.length; i += 1) {
    product *= edgeSign(loopVertices[i], loopVertices[(i + 1) % loopVertices.length]);
  }
  return product < 0 ? -1 : 1;
}

// F_γ = arg Hol ∈ {0, π}. The holonomy is read PER H₁ GENERATOR from the committed
// `perCycleW1`; an empty generator list (H₁ = 0) ⇒ NO loop ⇒ vacuous (NEVER fabricated).
export interface HolonomyReadout {
  generators: Sign[]; // (-1)^w1 per committed H₁ generator
  loopHolonomy: Sign | null; // ∏ over generators; null ⇔ H₁ = 0 (vacuous)
  Fgamma: number | null; // 0 or π; null ⇔ vacuous
  vacuous: boolean;
}

export function holonomyFromPerCycleW1(perCycleW1: number[]): HolonomyReadout {
  const generators: Sign[] = perCycleW1.map((w) => (w % 2 === 1 ? -1 : 1));
  if (generators.length === 0) {
    return { generators, loopHolonomy: null, Fgamma: null, vacuous: true };
  }
  const loopHolonomy: Sign = generators.reduce<Sign>((p, s) => ((p * s < 0 ? -1 : 1) as Sign), 1);
  return { generators, loopHolonomy, Fgamma: loopHolonomy === -1 ? Math.PI : 0, vacuous: false };
}

export const argSign = (s: Sign): number => (s === -1 ? Math.PI : 0);

// ---------------------------------------------------------------------------
// the ψ wave probe — ψ̈ + γψ̇ + c²L_U ψ + N(ψ) = J_K(t) (leapfrog) + observables
// ---------------------------------------------------------------------------
// Complex ψ per site as [re, im]. The probe's MEASURED holonomy is the loop's connected
// current phase arg(∏_loop ψ_x^* U_xy ψ_y); around a closed loop the ψ factors telescope
// to a positive real, so this equals arg(∏U) — the committed holonomy — INDEPENDENT of
// every knob. The evolution is genuine (γ damps, c sets the timescale); the READOUT is
// topological. That is the iron-filings reproduction, and its knob-invariance is §4.3.
type Cx = [number, number];
const cxMul = (p: Cx, q: Cx): Cx => [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0]];
const cxConj = (p: Cx): Cx => [p[0], -p[1]];

export interface ProbeReadout {
  Fgamma: number; // measured holonomy phase ∈ {0, π}
  measuredHolonomy: Sign;
  intensity: number[]; // I_x = |ψ_x|² per site (an observable; never a sealed value)
  loopCurrentSign: Sign; // sign of the connected loop current
}

export function evolveProbe(
  graph: Graph,
  edgeSigns: Sign[],
  loopVertices: number[],
  knobs: Knobs = DECLARED_KNOBS,
  steps = 600,
  dt = 0.05,
): ProbeReadout {
  const { n } = graph;
  const neighbours: Array<Array<{ to: number; sign: Sign }>> = Array.from({ length: n }, () => []);
  graph.edges.forEach(({ a, b }, i) => {
    neighbours[a].push({ to: b, sign: edgeSigns[i] });
    neighbours[b].push({ to: a, sign: edgeSigns[i] });
  });
  // seed ψ from the declared drive seed (ω_s, φ_s) — a fixed, declared initial condition.
  const psi: Cx[] = Array.from({ length: n }, (_v, x) => [
    Math.cos(knobs.omegaS * x + knobs.phiS),
    Math.sin(knobs.omegaS * x + knobs.phiS),
  ]);
  const vel: Cx[] = Array.from({ length: n }, () => [0, 0]);
  const c2 = knobs.waveSpeed * knobs.waveSpeed;

  const accel = (p: Cx[], v: Cx[], t: number): Cx[] => {
    return p.map((px, x) => {
      // (L_U ψ)_x = Σ_y (ψ_x − U_xy ψ_y)
      let lre = 0;
      let lim = 0;
      for (const { to, sign } of neighbours[x]) {
        lre += px[0] - sign * p[to][0];
        lim += px[1] - sign * p[to][1];
      }
      // J_K(t): a declared drive at the seam, enveloped by τ; N(ψ)=κ|ψ|²ψ.
      const env = knobs.tau > 0 ? Math.exp(-t / (knobs.tau * steps * dt + 1e-9)) : 1;
      const drive = knobs.alpha * env * Math.cos(knobs.omegaS * t + knobs.phiS);
      const mag2 = px[0] * px[0] + px[1] * px[1];
      const are = drive - knobs.gamma * v[x][0] - c2 * lre - knobs.kappa * mag2 * px[0];
      const aim = -knobs.gamma * v[x][1] - c2 * lim - knobs.kappa * mag2 * px[1];
      return [are, aim] as Cx;
    });
  };

  // velocity-Verlet leapfrog
  let acc = accel(psi, vel, 0);
  for (let step = 0; step < steps; step += 1) {
    for (let x = 0; x < n; x += 1) {
      psi[x][0] += vel[x][0] * dt + 0.5 * acc[x][0] * dt * dt;
      psi[x][1] += vel[x][1] * dt + 0.5 * acc[x][1] * dt * dt;
    }
    const accNext = accel(
      psi,
      vel.map((vx, x) => [vx[0] + acc[x][0] * dt, vx[1] + acc[x][1] * dt] as Cx),
      (step + 1) * dt,
    );
    for (let x = 0; x < n; x += 1) {
      vel[x][0] += 0.5 * (acc[x][0] + accNext[x][0]) * dt;
      vel[x][1] += 0.5 * (acc[x][1] + accNext[x][1]) * dt;
    }
    acc = accNext;
  }

  // measure the holonomy from the EVOLVED field: arg(∏_loop ψ_x^* U_xy ψ_y).
  const edgeSign = (a: number, b: number): Sign => {
    const idx = graph.edges.findIndex((e) => (e.a === a && e.b === b) || (e.a === b && e.b === a));
    return edgeSigns[idx];
  };
  let prod: Cx = [1, 0];
  for (let i = 0; i < loopVertices.length; i += 1) {
    const x = loopVertices[i];
    const y = loopVertices[(i + 1) % loopVertices.length];
    const s = edgeSign(x, y);
    // ψ_x^* · (U_xy ψ_y)
    prod = cxMul(prod, cxMul(cxConj(psi[x]), [s * psi[y][0], s * psi[y][1]]));
    // renormalise to unit magnitude: the closed-loop PHASE is arg(∏U) regardless of |ψ|,
    // so amplitude (which can underflow under heavy damping + no drive) carries no signal.
    const mag = Math.hypot(prod[0], prod[1]);
    if (mag > 1e-300) prod = [prod[0] / mag, prod[1] / mag];
  }
  const loopCurrentSign: Sign = prod[0] < 0 ? -1 : 1;
  const measuredHolonomy = loopCurrentSign;
  return {
    Fgamma: measuredHolonomy === -1 ? Math.PI : 0,
    measuredHolonomy,
    intensity: psi.map((p) => p[0] * p[0] + p[1] * p[1]),
    loopCurrentSign,
  };
}

// ---------------------------------------------------------------------------
// the ORDER readout — the FULL sorted-spectrum variation (a summary is forbidden)
// ---------------------------------------------------------------------------
// M_var = Σ_steps Σ_i |λ_i↑ − λ_i↓| over two birth-order step sequences (each step's
// spectrum sorted ascending and zero-padded to equal length). Non-isospectral
// intermediates ⇒ M_var > 0 (order-SENSITIVE); isospectral ⇒ 0 (order-BLIND).
export function mVar(spectraUp: number[][], spectraDown: number[][]): number {
  const steps = Math.max(spectraUp.length, spectraDown.length);
  let total = 0;
  for (let s = 0; s < steps; s += 1) {
    const up = (spectraUp[s] ?? []).slice().sort((a, b) => a - b);
    const down = (spectraDown[s] ?? []).slice().sort((a, b) => a - b);
    const m = Math.max(up.length, down.length);
    for (let i = 0; i < m; i += 1) total += Math.abs((up[i] ?? 0) - (down[i] ?? 0));
  }
  return total;
}

export function isospectral(a: number[], b: number[], tol = 1e-6): boolean {
  const x = a.slice().sort((p, q) => p - q);
  const y = b.slice().sort((p, q) => p - q);
  if (x.length !== y.length) return false;
  return x.every((v, i) => Math.abs(v - y[i]) < tol);
}

// A deliberately-INSUFFICIENT summary statistic (the trace = Σλ = 2|E|), kept so the
// diagnostic can SHOW it reads BLIND on distinguishable births where M_var reads them
// (seal falsifier d). Never used as the order verdict.
export function spectralTrace(eigenvalues: number[]): number {
  return eigenvalues.reduce((p, x) => p + x, 0);
}

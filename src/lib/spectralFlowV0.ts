// spectralFlowV0 — the SECOND ARROW: the integer spectral flow SF of the genealogy.
//
// `w₁` (the first arrow) is the ℤ/2 shadow; `SF` is the integer it shadows. For one
// `OperationKind` birth:
//
//   SF(birth) = dim ker(L_U^parent) − dim ker(L_U^child)
//
// where `L_U = D − A_U` is the COMMITTED connection-Laplacian (`connectionWaveInstrumentV0.
// signedLaplacian`) and `dim ker = #{ eigenvalues < SF_ZERO_TOL }` (read via the committed
// `spectrumReadout`). `L_U = Σ(ψ_a − U_ab ψ_b)² ⪰ 0` is PSD, so the only flow through 0 is
// the kernel ⇒ the net flow is the ENDPOINT Δker — homotopy-invariant. Additive along a
// path: `SF(path) = Σ SF(births)`.
//
// IRON FILINGS, NEVER THE FIELD — one rung on from the witness. The law is the committed
// kernel count (`spectrumReadout` on the committed `L_U`) and the committed `perCycleW1`
// (the ℤ/2 shadow); SF is their INTEGER READOUT. No `ψ` instrument, no Poincaré duality,
// no new law/verdict is written here (LABEL). DERIVE-ONLY · ADDITIVE: `signedLaplacian` /
// `spectrumReadout` are REUSED, never edited.
//
// PARAMETER-FREE. The only constant is `SF_ZERO_TOL` — the committed value, reused, never
// re-tuned. The F3 homotopy below is a VERIFICATION device (a path-crossing count that must
// independently reproduce Δker), never a definitional knob.

import { signedLaplacian, spectrumReadout, type Graph, type Sign } from './connectionWaveInstrumentV0';

// `connectionWaveInstrumentV0`'s `ZERO_TOL` (1e-9) is FILE-LOCAL — not exported. Re-declared
// here as the committed VALUE reused (NOT re-tuned, NOT an edit to the committed file). The
// orientable-0 vs frustrated-0.268 spectral gap makes the exact threshold non-load-bearing.
export const SF_ZERO_TOL = 1e-9;

// dim ker = #{ eigenvalues below SF_ZERO_TOL } — the kernel dimension of a committed spectrum.
export function kerCount(eigenvalues: number[]): number {
  return eigenvalues.filter((lambda) => lambda < SF_ZERO_TOL).length;
}

// the kernel dimension of the COMMITTED connection-Laplacian L_U over (graph, edgeSigns).
export function kerCountOf(graph: Graph, edgeSigns: Sign[]): number {
  return kerCount(spectrumReadout(signedLaplacian(graph, edgeSigns)).eigenvalues);
}

// SF(birth) = dim ker(parent) − dim ker(child). A pure integer difference of committed
// kernel counts — the ENDPOINT reading (PSD ⇒ that IS the net flow). Additivity: sum these.
export function spectralFlow(parentKer: number, childKer: number): number {
  return parentKer - childKer;
}

// ---------------------------------------------------------------------------
// F3 — the coupling-in crossing count (a VERIFICATION device; never the SF value)
// ---------------------------------------------------------------------------
// The committed `signedLaplacian` is unit-weight; the homotopy needs to scale the
// frustrating seam edges' weights `t: 0 → 1`, so this is the SAME L_U = D − A_U formula
// with a per-edge weight `w_i` (the committed formula generalised, NOT an edit to it). At
// all weights = 1 it is byte-identical to the committed `signedLaplacian` (the diagnostic
// asserts this equivalence). The SF VALUE never uses weights — only the F3 cross-check does.
export function weightedSignedLaplacian(graph: Graph, edgeSigns: Sign[], weights: number[]): number[][] {
  const L = Array.from({ length: graph.n }, () => new Array<number>(graph.n).fill(0));
  graph.edges.forEach(({ a, b }, i) => {
    const u = edgeSigns[i];
    const w = weights[i];
    L[a][a] += w;
    L[b][b] += w;
    L[a][b] -= u * w;
    L[b][a] -= u * w;
  });
  return L;
}

export interface CrossingStep {
  t: number; // homotopy parameter
  ker: number; // kernel dimension at t (#eigenvalues < SF_ZERO_TOL)
  minEig: number; // the smallest eigenvalue at t (the mode entering/leaving the kernel)
}

export interface HomotopyCrossing {
  netCrossing: number; // net eigenvalues leaving the kernel across t:0→1 (from the TRAJECTORIES alone)
  t0Ker: number; // kernel dim at t=0 (the seam decoupled)
  t1Ker: number; // kernel dim at t=1 (the seam fully coupled)
  crossings: CrossingStep[]; // the steps where the kernel dimension changed (the crossing events)
}

// Scale the `seamEdgeIndices` weights from 0 to 1 in `steps` fine increments; at each `t`
// build L_U(t) and read its committed spectrum; COUNT the net eigenvalues crossing
// SF_ZERO_TOL from the eigenvalue TRAJECTORIES alone (each kernel-departure +1, each
// kernel-arrival −1). This function reads ONLY the homotopy spectra — it NEVER receives or
// reads Δker or `perCycleW1`. Its agreement with Δker (asserted by the caller) is the
// independent, non-circular F3 check; setting it to Δker would be the tautology the gate
// rejects. `netCrossing` is well-defined for a single representative homotopy (PSD ruling).
export function homotopyCrossing(
  graph: Graph,
  edgeSigns: Sign[],
  seamEdgeIndices: number[],
  steps = 200,
): HomotopyCrossing {
  const seam = new Set(seamEdgeIndices);
  const kerAt = (t: number): { ker: number; minEig: number } => {
    const weights = graph.edges.map((_e, i) => (seam.has(i) ? t : 1));
    const spec = spectrumReadout(weightedSignedLaplacian(graph, edgeSigns, weights));
    return { ker: kerCount(spec.eigenvalues), minEig: spec.minEig };
  };
  let prev = kerAt(0);
  const t0Ker = prev.ker;
  let netCrossing = 0;
  const crossings: CrossingStep[] = [];
  for (let s = 1; s <= steps; s += 1) {
    const t = s / steps;
    const cur = kerAt(t);
    if (cur.ker !== prev.ker) {
      netCrossing += prev.ker - cur.ker; // kernel-departure ⇒ +1 ; arrival ⇒ −1
      crossings.push({ t, ker: cur.ker, minEig: cur.minEig });
    }
    prev = cur;
  }
  return { netCrossing, t0Ker, t1Ker: prev.ker, crossings };
}

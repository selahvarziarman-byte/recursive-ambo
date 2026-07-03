// fieldForShape — Field integration: the field as a PROPERTY every form carries.
//
// L3b proved the eigenmode machinery on ONE hand-built form (richFieldV0). This
// module generalises that EXACT committed chain to any committed form: given a
// form's AssembledComplex, its orientation structure (w₁ / the flip seams / Σ)
// determines its connection, its L_U, and — where the texture band is SIMPLE —
// its canonical standing wave. Nothing is forked: the pipeline is the committed
// `analyzeGlobalW1` → `subdivide` → `poincareDualClass` (the Σ flip-support
// connection) → `signedLaplacian`, and the eigenvector emission + tolerances are
// IMPORTED from the committed L3b `richFieldV0` (`symmetricEigensystem`,
// DEGENERACY/NODE/ANTINODE tolerances). The ONLY change from L3b is the input.
//
// THE GATE, generalised (declared, grounded): the texture-bearing band is the
// lowest NON-KERNEL band — kernel modes (λ ≈ 0, covariant-constant sections on
// orientable material) are flat and carry no texture, so a form with a kernel is
// classified by its first excited band (the torus's λ_min = 0 is simple but
// empty; its first excited band is 4-fold degenerate → 'degenerate'). A
// frustrated form (ker 0) is classified by λ_min itself — exactly L3b's gate, so
// the V3 canonical form reproduces the L3b seal verbatim (asserted in the
// diagnostic against the committed seal oracle).
//
// MEASURED FINDING (surfaced in the field-integration report, not painted over):
// the R0 zoo's Klein/RP² grids measure a SIMPLE lowest band under this committed
// pipeline (R=6 and R=8), contradicting the V3 exclusion's expectation that the
// symmetric zoo is degenerate; only the torus's texture band measures degenerate.
// The gate follows the instrument; the ruling's zoo claim is the finding.
//
// Shape → complex: the committed bridge translate (`appShapeToAssembledComplex`).
// A shape carrying PARALLEL edge classes (same endpoints, distinct 1-cells — a
// route-B lift) cannot be endpoint-translated faithfully; such shapes carry their
// own faithful complex (patchLift emits it) and MUST pass it via
// `options.complex` — enforced loudly, never silently mistranslated.
//
// DERIVE-ONLY · ADDITIVE: committed engine + committed L3b reused by import; no
// invariant recomputed; no verdict written here (LABEL) — the render shows the
// field because it IS the field, verification stays headless.

import type { Shape } from '../types/geometry';
import { analyzeGlobalW1, type AssembledComplex, type GlobalW1Cert } from './globalW1';
import {
  poincareDualClass,
  subdivide,
  type PoincareDualResult,
  type SubdividedComplex,
} from './s4FrameWitnessV0';
import { signedLaplacian, type Graph, type Sign } from './connectionWaveInstrumentV0';
import { kerCount } from './spectralFlowV0';
import {
  ANTINODE_TOL,
  DEGENERACY_TOL,
  NODE_TOL,
  symmetricEigensystem,
  type EigenPair,
} from './richFieldV0';
import { appShapeToAssembledComplex } from '../selectors/witnessBridge';

export type FieldGate = 'simple' | 'degenerate';

export interface TextureBand {
  value: number; // the lowest NON-KERNEL eigenvalue (= λ_min when ker = 0)
  multiplicity: number; // # eigenvalues within DEGENERACY_TOL of it
  index: number; // its position in the ascending spectrum (= kernelDim)
}

export interface ShapeField {
  complex: AssembledComplex;
  cert: GlobalW1Cert; // committed b₁ / w1Class / nonOrientable
  cellCounts: { v: number; e: number; t: number };
  sub: SubdividedComplex; // committed subdivision — `sub.verts` IS the site order
  siteIds: string[];
  graph: Graph;
  edgeSigns: Sign[]; // −1 exactly on the committed Σ chain (all +1 when no defect)
  LU: number[][];
  spectrum: EigenPair[];
  kernelDim: number; // committed kerCount (covariant-constant sections)
  lambdaMin: number;
  textureBand: TextureBand;
  gate: FieldGate; // 'simple' ⟺ the texture band has multiplicity 1
  psi: number[] | null; // the canonical texture mode; null when the gate is 'degenerate'
  intensity: number[] | null; // |ψ_x|² per site; null when degenerate (decoration bar)
  nodes: number[] | null;
  antinodes: number[] | null;
  sigma: PoincareDualResult;
  hasDefect: boolean; // a real Σ support exists (non-vacuous AND flip edges present)
}

// The core: the L3b pipeline over ANY AssembledComplex (the one generalisation).
export function computeFieldForComplex(complex: AssembledComplex): ShapeField {
  const w1Analysis = analyzeGlobalW1(complex);
  const sigma = poincareDualClass(
    complex,
    w1Analysis.debug.basisCycles,
    w1Analysis.debug.perCycleW1,
  );
  const hasDefect = !sigma.vacuous && sigma.flipEdges.length > 0;

  const sub = subdivide(complex);
  const vIndex = new Map(sub.verts.map((v, i) => [v, i]));
  const graph: Graph = {
    n: sub.verts.length,
    edges: sub.edges.map((e) => ({ a: vIndex.get(e.u) as number, b: vIndex.get(e.v) as number })),
  };
  const sigmaSet = new Set(sigma.vacuous ? [] : sigma.sigmaChainEdges);
  const edgeSigns: Sign[] = sub.edges.map((e) => (sigmaSet.has(e.id) ? -1 : 1));
  const LU = signedLaplacian(graph, edgeSigns);

  const spectrum = symmetricEigensystem(LU);
  const values = spectrum.map((p) => p.value);
  const kernelDim = kerCount(values);
  const lambdaMin = values[0] ?? 0;

  // the texture-bearing band: the lowest NON-KERNEL eigenvalue (kernel modes are
  // flat sections — no texture); = λ_min itself on frustrated (ker 0) forms.
  const bandIndex = Math.min(kernelDim, Math.max(0, values.length - 1));
  const bandValue = values[bandIndex] ?? 0;
  const multiplicity = values.filter((v) => Math.abs(v - bandValue) < DEGENERACY_TOL).length;
  const textureBand: TextureBand = { value: bandValue, multiplicity, index: bandIndex };
  const gate: FieldGate = multiplicity === 1 && values.length > 0 ? 'simple' : 'degenerate';

  let psi: number[] | null = null;
  let intensity: number[] | null = null;
  let nodes: number[] | null = null;
  let antinodes: number[] | null = null;
  if (gate === 'simple') {
    psi = spectrum[bandIndex].vector;
    intensity = psi.map((x) => x * x);
    const max = intensity.reduce((acc, x) => Math.max(acc, x), 0);
    nodes = intensity.map((x, i) => (x < NODE_TOL ? i : -1)).filter((i) => i >= 0);
    antinodes = intensity.map((x, i) => (max - x <= ANTINODE_TOL ? i : -1)).filter((i) => i >= 0);
  }

  return {
    complex,
    cert: w1Analysis.cert,
    cellCounts: w1Analysis.debug.cellCounts,
    sub,
    siteIds: [...sub.verts],
    graph,
    edgeSigns,
    LU,
    spectrum,
    kernelDim,
    lambdaMin,
    textureBand,
    gate,
    psi,
    intensity,
    nodes,
    antinodes,
    sigma,
    hasDefect,
  };
}

export interface ComputeFieldOptions {
  // A faithful pre-built complex (REQUIRED for shapes carrying parallel edge
  // classes — e.g. a route-B lift, which emits its own `complex` precisely
  // because endpoint-keyed translation cannot represent parallel 1-cells).
  complex?: AssembledComplex;
}

const edgeKeyOf = (u: string, v: string): string =>
  [u, v].sort((a, b) => a.localeCompare(b)).join('|');

// The per-form entry: any committed form computes its own field.
export function computeFieldForShape(shape: Shape, options: ComputeFieldOptions = {}): ShapeField {
  if (options.complex) return computeFieldForComplex(options.complex);

  const seen = new Set<string>();
  for (const edge of shape.edges) {
    const key = edgeKeyOf(edge.vertexIds[0], edge.vertexIds[1]);
    if (seen.has(key)) {
      throw new Error(
        `fieldForShape: shape "${shape.id}" carries PARALLEL edge classes (duplicate endpoints ${key}) — ` +
          'endpoint-keyed translation would fuse them; pass the form\'s own faithful complex via options.complex ' +
          '(a route-B lift emits it as `lift.complex`)',
      );
    }
    seen.add(key);
  }
  return computeFieldForComplex(appShapeToAssembledComplex(shape));
}

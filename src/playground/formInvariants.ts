// formInvariants — E2: the per-form invariants READOUT (pure, react-free).
//
// Everything here is READ from the committed certifiers — nothing recomputed:
//   · χ — the shape's explicit cells (V−E+F) cross-checked against the committed
//     `analyzeGlobalW1(...).debug.euler` when a faithful complex exists;
//   · w₁ / orientability / b₁ — the committed `globalW1Class` certificate;
//   · genus / cross-caps — ARITHMETIC on (χ, orientability) for CLOSED certified
//     surfaces only (g = (2−χ)/2 orientable; k = 2−χ non-orientable); anything
//     open, non-manifold, or un-certified reads "open / n-a" — no fake closed
//     classification.
//
// The faithful complex is obtained honestly or not at all:
//   'direct'    — the shape's cells bridge-translate cleanly (unique endpoint
//                 keys, no parallel classes, no self-loops) — invoked forms,
//                 immersions, cut-born forms, the (as-represented) assemblies;
//   'recovered' — a born quotient form REPLAY-VERIFIED against its parent
//                 (committed `recoverBornSurface` — the G5.2 route); its
//                 fundamental-polygon cells cannot be endpoint-keyed;
//   null        — no faithful complex reachable → χ over explicit cells only,
//                 w₁/b₁/classification honestly "n-a".
//
// DERIVE-ONLY · read-only: committed modules by import; no Shape is mutated.

import type { Shape } from '../types/geometry';
import {
  analyzeGlobalW1,
  type AssembledComplex,
  type GlobalW1Cert,
} from '../lib/globalW1';
import { canonicalEdgeKey } from '../lib/ids';
import { recoverBornSurface } from './bornFormRouting';

export interface FormInvariantsReadout {
  cells: { v: number; e: number; f: number }; // the shape's explicit cells
  chi: number; // V − E + F over the explicit cells
  complexSource: 'direct' | 'recovered' | null; // how the faithful complex was obtained
  cert: GlobalW1Cert | null; // the committed globalW1Class certificate (null = un-certified)
  chiCertified: number | null; // the certifier's own euler (agrees with chi on faithful complexes)
  boundary: 'closed' | 'open' | 'non-manifold' | null; // slot-incidence over the complex
  classification: string; // honest — "open / n-a" where the closed classification does not apply
}

// The shape's cells → an AssembledComplex, ONLY when the translation is faithful:
// every face slot resolves to exactly one edge by endpoints, no two edges share
// an endpoint key (parallel classes), no self-loops. Quotient forms fail here by
// design (their faithful complex lives with the materializer) → null.
function tryDirectComplex(shape: Shape): AssembledComplex | null {
  const edgeByKey = new Map<string, { id: string; u: string; v: string }>();
  for (const edge of shape.edges) {
    const [u, v] = edge.vertexIds;
    if (u === v) return null; // self-loop — endpoint keys cannot orient it
    const key = canonicalEdgeKey(u, v);
    if (edgeByKey.has(key)) return null; // parallel edge classes — endpoint-keying would fuse them
    edgeByKey.set(key, { id: edge.id, u, v });
  }
  const faces: AssembledComplex['faces'] = [];
  for (const face of shape.faces) {
    const vs = face.vertexIds;
    const boundary: Array<{ edge: string; dir: 1 | -1 }> = [];
    for (let k = 0; k < vs.length; k += 1) {
      const x = vs[k];
      const y = vs[(k + 1) % vs.length];
      const edge = edgeByKey.get(canonicalEdgeKey(x, y));
      if (!edge) return null; // a slot with no explicit edge — not translatable
      boundary.push({ edge: edge.id, dir: edge.u === x && edge.v === y ? 1 : -1 });
    }
    faces.push({ boundary });
  }
  return {
    vertices: Object.keys(shape.vertices),
    edges: [...edgeByKey.values()],
    faces,
  };
}

// Boundary reading over the complex: an interior edge sits in exactly TWO face
// slots; one slot = a free (rim) edge; more than two = non-manifold incidence.
function boundaryOf(complex: AssembledComplex): 'closed' | 'open' | 'non-manifold' {
  const slotCount = new Map<string, number>();
  for (const edge of complex.edges) slotCount.set(edge.id, 0);
  for (const face of complex.faces) {
    for (const slot of face.boundary) {
      slotCount.set(slot.edge, (slotCount.get(slot.edge) ?? 0) + 1);
    }
  }
  let open = false;
  for (const count of slotCount.values()) {
    if (count > 2) return 'non-manifold';
    if (count !== 2) open = true;
  }
  return open ? 'open' : 'closed'; // edge-less complexes (the collapse sphere) read closed vacuously
}

export function readFormInvariants(shape: Shape, parent: Shape | null = null): FormInvariantsReadout {
  const cells = {
    v: Object.keys(shape.vertices).length,
    e: shape.edges.length,
    f: shape.faces.length,
  };
  const chi = cells.v - cells.e + cells.f;

  // the faithful complex: direct translation, else the replay-verified recovery.
  let complexSource: FormInvariantsReadout['complexSource'] = null;
  let complex: AssembledComplex | null = tryDirectComplex(shape);
  if (complex) {
    complexSource = 'direct';
  } else {
    const recovery = recoverBornSurface(shape, parent);
    if (recovery) {
      complex = recovery.materialized.complex;
      complexSource = 'recovered';
    }
  }

  if (!complex) {
    return {
      cells,
      chi,
      complexSource: null,
      cert: null,
      chiCertified: null,
      boundary: null,
      classification: 'n-a (no faithful complex — w₁/b₁ un-certified)',
    };
  }

  // DOMAIN GATE (measured, then scoped out): the committed w₁/H₁ certifier reads
  // SURFACE complexes — on a face-less 1-skeleton (e.g. a cut's rim, a 4-cycle
  // graph) it returns b₁=0, an out-of-domain value this panel must not display
  // as a certificate. χ over the explicit cells stays; the rest reads n-a.
  if (complex.faces.length === 0) {
    return {
      cells,
      chi,
      complexSource,
      cert: null,
      chiCertified: null,
      boundary: null,
      classification: 'n-a (no 2-cells — not a surface complex)',
    };
  }

  const { cert, debug } = analyzeGlobalW1(complex);
  const boundary = boundaryOf(complex);

  let classification: string;
  if (boundary === 'non-manifold') {
    classification = 'n-a (non-manifold edge incidence)';
  } else if (boundary === 'open') {
    classification = 'open / n-a'; // no fake closed classification
  } else if (!cert.nonOrientable) {
    const twoMinusChi = 2 - chi;
    classification =
      twoMinusChi >= 0 && twoMinusChi % 2 === 0
        ? `genus ${twoMinusChi / 2} (closed, orientable)`
        : 'n-a (χ inconsistent with a closed orientable surface)';
  } else {
    const crossCaps = 2 - chi;
    classification =
      crossCaps >= 1
        ? `cross-caps ${crossCaps} (closed, non-orientable)`
        : 'n-a (χ inconsistent with a closed non-orientable surface)';
  }

  return {
    cells,
    chi,
    complexSource,
    cert,
    chiCertified: debug.euler,
    boundary,
    classification,
  };
}

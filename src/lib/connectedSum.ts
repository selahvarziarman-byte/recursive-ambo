// connectedSum — P2: the connected-sum MACRO (no new primitive).
//
//   connectedSum(M₁, M₂) = cutCell(M₁, diskA) + cutCell(M₂, diskB)
//                          + the ENACTED assemble(∂A ↔ ∂B, matched, mode)
//
// Every step is a COMMITTED op reused verbatim: `cutCell` +
// `materializeCutResult` puncture each surface (the removed 2-cell leaves its
// boundary cycle free); the ENACTED `assemble` (P2, multiform.ts) sews the two
// rims with a full-boundary-cycle merge list — the generalization of the
// committed single-edge `edgeAssembleIdentification` to matched circles. The
// seam edges de-duplicate inside the enacted assemble; the committed link gate
// judges the result downstream (instruments, not guards).
//
// REFUSALS (honest, never silent — R5: the person's refusals are DOORS,
// designer-ratified; the dev refusals keep their mechanism/ADR text):
//   · a single-face form has no face to spare — cutting its only face leaves
//     no surface: dev-facing subdivide-first path (ADR 0018; only the engine's
//     internal callers reach it);
//   · mismatched rims (unequal boundary edge counts) — the person's door:
//     pick two faces with the same edge count (never silently mis-match);
//   · PARALLEL edges on a rim (two edge instances sharing the rim pair's
//     endpoints — e.g. a resolution-2 grid torus): the seam cannot tell which
//     joins to which (the same committed limitation as the Q-M2
//     parallel-classes deferral): the person's door — pick a different face;
//   · shared vertex ids across the inputs — invoke from distinct universes
//     (co-location ≠ identity); the committed assemble would fail loud anyway,
//     this refusal just says why first.
//
// ORIENTATION `mode`: 'preserving' pairs the rims ANTI-parallel in cycle index
// (a_i ↔ b_{(k−i) mod k}) and 'reversing' pairs them parallel (a_i ↔ b_i);
// the convention was fixed empirically against the committed certifier (w₁)
// in the P2 diagnostic.
//
// The seam mode is topologically INERT ON SURFACES (level-2). The connect-sum
// seam is a SEPARATING (2-sided) circle and cannot create a crosscap: the
// result is orientable iff both inputs are orientable, independent of seam
// mode (w₁-inertness holds in EVERY dimension — a separating seam can never
// be 1-sided). Beyond w₁, the two modes give HOMEOMORPHIC surfaces only
// because every closed surface admits an orientation-reversing
// self-homeomorphism — a 2-DIMENSIONAL theorem. The mode is RETAINED because
// at level-3 the seam is an S² and the mode is the MIRROR choice, which is
// load-bearing on CHIRAL summands (L(5,1)#L(5,1) ≇ L(5,1)#L(5,4)). On
// surfaces the two modes differ only in cell structure, not topology.
// Crosscaps / non-orientability enter ONLY from: a non-orientable input
// summand (Dyck: T²#RP²→N₃) or a self-gluing flipGlue (a non-separating,
// 1-sided-capable reversal) — never the connect-sum seam direction.
//
// ADDITIVE MACRO · DERIVE-ONLY: committed ops by import, nothing forked.

import type { Face, Shape, VertexId } from '../types/geometry';
import { assemble, type Assembly, type BoundaryIdentification } from './multiform';
import { cutCell } from './cutOperation';
import { materializeCutResult } from './materializeOperation';

export type ConnectedSumMode = 'preserving' | 'reversing';

export interface ConnectedSumOptions {
  faceA?: Face; // the disk cut from M₁ (default: its first face)
  faceB?: Face; // the disk cut from M₂ (default: its first face)
  mode?: ConnectedSumMode; // default 'preserving' (anti-parallel rim pairing; see the mode note above)
}

export interface ConnectedSumResult {
  shape: Shape; // the enacted sum
  ledger: Assembly['ledger'];
  puncturedA: Shape; // the committed cut results (the macro's middle state)
  puncturedB: Shape;
  seamMerges: BoundaryIdentification['merges'];
  mode: ConnectedSumMode;
}

function parallelRimEdges(shape: Shape, cycle: VertexId[]): boolean {
  for (let k = 0; k < cycle.length; k += 1) {
    const a = cycle[k];
    const b = cycle[(k + 1) % cycle.length];
    const instances = shape.edges.filter(
      (edge) =>
        (edge.vertexIds[0] === a && edge.vertexIds[1] === b) ||
        (edge.vertexIds[0] === b && edge.vertexIds[1] === a),
    );
    if (instances.length > 1) return true;
  }
  return false;
}

export function connectedSum(
  m1: Shape,
  m2: Shape,
  options: ConnectedSumOptions = {},
): ConnectedSumResult {
  const faceA = options.faceA ?? m1.faces[0];
  const faceB = options.faceB ?? m2.faces[0];
  const mode: ConnectedSumMode = options.mode ?? 'preserving';
  if (!faceA || !faceB) {
    throw new Error('connectedSum: both forms need a face to cut');
  }
  // R5: dev-facing (only the engine's internal standardBodies reaches these —
  // the person never does); the mechanism/ADR text stays inline for a developer.
  if (m1.faces.length < 2) {
    throw new Error(
      `connectedSum: "${m1.name}" has a single face — cutting its only face leaves no surface. Subdivide first (ADR 0018 — a higher-resolution immersion), then sum.`,
    );
  }
  if (m2.faces.length < 2) {
    throw new Error(
      `connectedSum: "${m2.name}" has a single face — cutting its only face leaves no surface. Subdivide first (ADR 0018 — a higher-resolution immersion), then sum.`,
    );
  }
  const vertexIds = new Set(Object.keys(m1.vertices));
  const edgeIds = new Set(m1.edges.map((edge) => edge.id));
  const faceIds = new Set(m1.faces.map((face) => face.id));
  if (
    Object.keys(m2.vertices).some((id) => vertexIds.has(id)) ||
    m2.edges.some((edge) => edgeIds.has(edge.id)) ||
    m2.faces.some((face) => faceIds.has(face.id))
  ) {
    throw new Error(
      'connectedSum: the forms share vertex/edge/face ids — invoke them from DISTINCT universes (co-location ≠ identity needs fully disjoint namespaces)',
    );
  }
  const cycleA = faceA.vertexIds;
  const cycleB = faceB.vertexIds;
  // R5 (designer-ratified, byte-exact): these three reach the PERSON raw — the
  // combine toast surfaces error.message verbatim. Person register: sentence
  // case, no prefix, and every refusal is a DOOR (what to pick instead).
  if (cycleA.length !== cycleB.length) {
    throw new Error(
      `These two faces have rims of different lengths — ${cycleA.length} edges and ${cycleB.length}. The rims join edge to edge, so pick two faces with the same edge count.`,
    );
  }
  if (new Set(cycleA).size !== cycleA.length || new Set(cycleB).size !== cycleB.length) {
    throw new Error(
      `One of these faces passes the same corner twice around its rim, so the rim isn't a clean loop. Pick a different face.`,
    );
  }
  if (parallelRimEdges(m1, cycleA) || parallelRimEdges(m2, cycleB)) {
    throw new Error(
      `One of these faces has two rim-edges between the same pair of corners, so the seam can't tell which joins to which. Pick a different face.`,
    );
  }

  // the committed cuts — each surface punctured, its rim now free
  const puncturedA = materializeCutResult(m1, cutCell(m1, faceA));
  const puncturedB = materializeCutResult(m2, cutCell(m2, faceB));

  // the matched-circle merge list — the full-boundary-cycle generalization of
  // the committed single-edge edgeAssembleIdentification (same endpoint-wise
  // merge shape, same `asm:`-style child ids under the csum: prefix)
  const k = cycleA.length;
  const partnerIndex = (i: number): number => (mode === 'preserving' ? (k - i) % k : i);
  const seamMerges: BoundaryIdentification['merges'] = cycleA.map((a, i) => {
    const b = cycleB[partnerIndex(i)];
    return { resultId: `csum:${a}+${b}`, sources: [a, b] };
  });

  // the ENACTED assemble (P2) — two rims become one seam; the result IS the sum
  const assembled = assemble([puncturedA, puncturedB], { merges: seamMerges });
  return {
    shape: assembled.shape,
    ledger: assembled.ledger,
    puncturedA,
    puncturedB,
    seamMerges,
    mode,
  };
}

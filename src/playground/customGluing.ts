// customGluing — C4: the interactive gluing-picker's PURE (react-free) layer.
//
// The playground turns from a named catalogue into OPEN-ENDED gluing: the user
// chooses the boundary-edge pairing (pairs + preserve/reverse per pair; unpaired
// edges stay FREE → an open surface) or which boundary edges of two forms an
// assemble merges. This module owns the CHOICE only — validation (bounded,
// throw-free reasons), an honest dry-run PREVIEW (the committed trace's own
// χ/w₁ + the v0 word class), and execution through the COMMITTED ops.
//
// THE GUARD (held): `glueFace`/`flipGlueFace`/`assemble`, `materializeOperation`
// and `bornFormRouting` are consumed BY IMPORT, byte-unchanged — arbitrary
// pairings were already proven faithful (invariant-matching, C2); this pass
// only exposes them. No new engine, no recomputed invariants (the preview
// values are the committed trace's own).

import type { Face, Shape, VertexId } from '../types/geometry';
import {
  flipGlueFace,
  glueFace,
  type BoundaryPairing,
  type SurfaceTrace,
} from '../lib/surfaceOperations';
import { materializeSurfaceResult } from '../lib/materializeOperation';
import { classifyGluingWord } from './bornFormRouting';
import type { ImmersedSurfaceKey } from '../lib/surfaceImmersion';
import { assemble, type BoundaryIdentification } from '../lib/multiform';
import { canAssemblePair, getAssemblePairDisabledReason } from './playgroundOperations';

// The materializer's pairing-reconstruction guard (committed): n <= 8 boundary
// edges — the custom picker gates it here so the Apply button is exactly honest.
const MAX_CUSTOM_EDGES = 8;

export interface FaceEdgeLabel {
  index: number;
  from: VertexId;
  to: VertexId;
}

// The face's boundary edges in slot order — the picker's vocabulary.
export function describeFaceEdges(face: Face): FaceEdgeLabel[] {
  const vs = face.vertexIds;
  return vs.map((from, index) => ({ index, from, to: vs[(index + 1) % vs.length] }));
}

// ---------------------------------------------------------------------------
// custom glue — validate / preview / execute
// ---------------------------------------------------------------------------

// Reason-or-null. Bounded and throw-free: every degenerate choice is a REASON
// (self-pair, reused edge, out-of-range, quotient face, un-searched n > 8).
export function validateCustomPairings(
  face: Face | null,
  pairings: BoundaryPairing[],
): string | null {
  if (!face) return 'Select a face to glue.';
  const n = face.vertexIds.length;
  if (new Set(face.vertexIds).size !== n) {
    return 'Face carries identified (repeated) corners — operating on quotient faces is not yet ruled.';
  }
  if (n > MAX_CUSTOM_EDGES) {
    return `Face has ${n} edges — pairing reconstruction is guarded to ${MAX_CUSTOM_EDGES} (un-searched territory).`;
  }
  if (pairings.length === 0) return 'Add at least one edge pair.';
  const used = new Set<number>();
  for (const { edgeA, edgeB, mode } of pairings) {
    if (!Number.isInteger(edgeA) || !Number.isInteger(edgeB) || edgeA < 0 || edgeB < 0 || edgeA >= n || edgeB >= n) {
      return `Edge indices must be integers in [0, ${n - 1}].`;
    }
    if (edgeA === edgeB) return `Edge e${edgeA} cannot pair with itself.`;
    if (used.has(edgeA) || used.has(edgeB)) {
      return 'Each edge can appear in at most ONE pair (unpaired edges stay free).';
    }
    used.add(edgeA);
    used.add(edgeB);
    if (mode !== 'preserving' && mode !== 'reversing') return 'Each pair needs a preserve/reverse mode.';
  }
  return null;
}

export interface GluingPreview {
  chi: number; // the committed trace's own χ
  w1: 0 | 1; // the committed trace's own w₁
  surface: ImmersedSurfaceKey | null; // the v0 word class (null → patch fallback render)
  freeEdges: number; // unpaired boundary edges (> 0 ⇒ an open surface)
  operation: 'glue' | 'flip-glue'; // which committed op the modes select
}

export type GluingPreviewResult = { ok: true; preview: GluingPreview } | { ok: false; reason: string };

// The committed op the chosen modes select: flipGlueFace iff ≥ 1 reversing pair
// (the committed docstring contracts — enforced downstream by the materializer).
function committedOpFor(pairings: BoundaryPairing[]): { run: typeof glueFace; operation: 'glue' | 'flip-glue' } {
  const reversing = pairings.some((p) => p.mode === 'reversing');
  return reversing ? { run: flipGlueFace, operation: 'flip-glue' } : { run: glueFace, operation: 'glue' };
}

// DRY-RUN the committed op — the preview is the trace's OWN certificate (χ, w₁),
// plus the v0 routing class. Anything the committed op refuses becomes a reason
// (never a throw at the UI), so Apply-enabled ⟺ the pipeline accepts.
export function previewCustomGlue(
  form: Shape,
  face: Face | null,
  pairings: BoundaryPairing[],
): GluingPreviewResult {
  const reason = validateCustomPairings(face, pairings);
  if (reason) return { ok: false, reason };
  const target = face as Face;
  const { run, operation } = committedOpFor(pairings);
  let trace: SurfaceTrace;
  try {
    trace = run(form, target, pairings);
  } catch (error) {
    return { ok: false, reason: `The committed op refuses this pairing: ${(error as Error).message}` };
  }
  return {
    ok: true,
    preview: {
      chi: trace.chi,
      w1: trace.w1,
      surface: classifyGluingWord(pairings, target.vertexIds.length),
      freeEdges: target.vertexIds.length - 2 * pairings.length,
      operation,
    },
  };
}

// Committed op + committed G5.0 materializer → the born form. Throws loudly on
// an invalid pairing (the UI gates via validate/preview first).
export function executeCustomGlue(form: Shape, face: Face, pairings: BoundaryPairing[]): Shape {
  const reason = validateCustomPairings(face, pairings);
  if (reason) {
    throw new Error(`customGluing: invalid pairing — ${reason}`);
  }
  const { run } = committedOpFor(pairings);
  const trace = run(form, face, pairings);
  return materializeSurfaceResult(form, face, trace).shape;
}

// ---------------------------------------------------------------------------
// custom assemble — pick WHICH boundary edge of A and of B the merge identifies
// ---------------------------------------------------------------------------

export interface AssembleEdgeChoice {
  edgeA: number; // boundary-edge index on A's faces[0]
  edgeB: number; // boundary-edge index on B's faces[0]
  reversed: boolean; // identify a0↔b1, a1↔b0 instead of endpoint-parallel
}

function boundaryEdgeOf(form: Shape, index: number): [VertexId, VertexId] {
  const face = form.faces[0];
  const n = face.vertexIds.length;
  return [face.vertexIds[index], face.vertexIds[(index + 1) % n]];
}

// Reason-or-null (extends the standing pair gate with the edge choice).
export function validateAssembleEdges(
  a: Shape | null,
  b: Shape | null,
  choice: AssembleEdgeChoice,
): string | null {
  const pairReason = getAssemblePairDisabledReason(a, b);
  if (pairReason) return pairReason;
  const formA = a as Shape;
  const formB = b as Shape;
  const nA = formA.faces[0].vertexIds.length;
  const nB = formB.faces[0].vertexIds.length;
  if (!Number.isInteger(choice.edgeA) || choice.edgeA < 0 || choice.edgeA >= nA) {
    return `Form A's edge index must be an integer in [0, ${nA - 1}].`;
  }
  if (!Number.isInteger(choice.edgeB) || choice.edgeB < 0 || choice.edgeB >= nB) {
    return `Form B's edge index must be an integer in [0, ${nB - 1}].`;
  }
  const [a0, a1] = boundaryEdgeOf(formA, choice.edgeA);
  const [b0, b1] = boundaryEdgeOf(formB, choice.edgeB);
  if (a0 === a1 || b0 === b1) {
    return 'The chosen edge repeats a corner (a quotient self-loop) — pick an edge with two distinct endpoints.';
  }
  return null;
}

// The chosen-edge identification: endpoint-wise merges (reversed flips B's
// endpoints). With edgeA = edgeB = 0 and reversed = false this IS the v0
// canonical identification — asserted by the diagnostic.
export function edgeAssembleIdentification(
  a: Shape,
  b: Shape,
  choice: AssembleEdgeChoice,
): BoundaryIdentification {
  const [a0, a1] = boundaryEdgeOf(a, choice.edgeA);
  const [eb0, eb1] = boundaryEdgeOf(b, choice.edgeB);
  const [b0, b1] = choice.reversed ? [eb1, eb0] : [eb0, eb1];
  return {
    merges: [
      { resultId: `asm:${a0}+${b0}`, sources: [a0, b0] },
      { resultId: `asm:${a1}+${b1}`, sources: [a1, b1] },
    ],
  };
}

// The committed `assemble` over the CHOSEN identification.
export function executeAssembleWithEdges(a: Shape, b: Shape, choice: AssembleEdgeChoice): Shape {
  if (!canAssemblePair(a, b)) {
    throw new Error('customGluing: assemble executed on an ineligible pair');
  }
  const reason = validateAssembleEdges(a, b, choice);
  if (reason) {
    throw new Error(`customGluing: invalid assemble edge choice — ${reason}`);
  }
  return assemble([a, b], edgeAssembleIdentification(a, b, choice)).shape;
}

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
import {
  canAssemblePair,
  classifyFaceChainPath,
  degenerateBoundaryReason,
  getAssemblePairDisabledReason,
  singleFaceGateReason,
  WORD_UNRECOVERABLE_REASON,
} from './playgroundOperations';

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
// (self-pair, reused edge, out-of-range, degenerate quotient boundary,
// un-searched n > 8).
//
// Q-M2 (sanctioned, 2026-07-09): a quotient face (repeated corner CLASSES in
// the cycle) is OPERABLE — the new word COMPOSES with the born form's
// replay-verified birth word and the committed gate judges the result. The
// chain classification (degenerate / junction / unrecoverable-word / parallel
// classes) lives in playgroundOperations.classifyFaceChainPath and needs the
// FORM (and its parent) — the committed two-argument call still works and
// stays exactly as strict: without the form a quotient face refuses honestly
// (the composition would need the birth word), never runs unfaithfully.
export function validateCustomPairings(
  face: Face | null,
  pairings: BoundaryPairing[],
  form?: Shape | null,
  parentShape?: Shape | null,
): string | null {
  // Word-op single-face gate (engineer-chartered, 2026-07-11): the custom glue
  // routes through the SAME fundamental-polygon materializer as the registry
  // word ops (one identified polygon out; every other face silently discarded)
  // — a multi-face form refuses with the identical family reason. The gate is
  // form-level; the committed two-argument (face, pairings) validation calls
  // cannot check it, but every LIVE seam (preview / execute / the picker UI)
  // passes the form and is gated here.
  // THE REFUSAL-ORDER LAW (2026-07-13, at singleFaceGateReason; applied to this
  // seam 2026-07-14, THE SMALL RUN): the gate is FORM-level — no face pick
  // cures it — so it fires BEFORE the curable 'Select a face…' prompt. On a
  // form the gate refuses for every face, that prompt was a false promise.
  // (Without the form — the committed two-argument calls — the gate cannot
  // speak and the face prompt stays first, exactly as before.)
  if (form && form.faces.length !== 1) {
    return singleFaceGateReason(form);
  }
  if (!face) return 'Select a face to glue.';
  const n = face.vertexIds.length;
  if (new Set(face.vertexIds).size !== n) {
    if (form) {
      const classified = classifyFaceChainPath(face, form, parentShape ?? null);
      if (classified.reason) return classified.reason;
    } else if (n > 1 && new Set(face.vertexIds).size === 1) {
      return degenerateBoundaryReason(face);
    } else {
      return WORD_UNRECOVERABLE_REASON;
    }
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

// The born form's birth word for composition (Q-M2): [] on a first-generation
// face; the replay-verified prior word on a generic quotient face. Callers gate
// via validateCustomPairings first, so a non-generic path never reaches this.
function priorWordFor(form: Shape, face: Face, parentShape?: Shape | null): BoundaryPairing[] {
  if (new Set(face.vertexIds).size === face.vertexIds.length) return [];
  const classified = classifyFaceChainPath(face, form, parentShape ?? null);
  if (classified.priorPairings === null) {
    throw new Error(`customGluing: chain path refuses this face — ${classified.reason}`);
  }
  return classified.priorPairings;
}

export interface GluingPreview {
  chi: number; // the committed trace's own χ
  w1: 0 | 1; // the committed trace's own w₁
  surface: ImmersedSurfaceKey | null; // the v0 word class (null → patch fallback render)
  // Boundary slots not engaged by the (COMPOSED) word — each is a free
  // edge-class occurrence (> 0 ⇒ an open surface). On a quotient face the
  // birth word's slots count as engaged (Q-M2), keeping the arithmetic exact:
  // a class the prior identification merged has all its slots in the prior word.
  freeEdges: number;
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
// (never a throw at the UI), so Apply-enabled ⟺ the pipeline accepts. On a
// quotient face (Q-M2) the run is the COMPOSED word — birth pairs + chosen
// pairs — so the certificate reads the real chained result.
export function previewCustomGlue(
  form: Shape,
  face: Face | null,
  pairings: BoundaryPairing[],
  parentShape?: Shape | null,
): GluingPreviewResult {
  const reason = validateCustomPairings(face, pairings, form, parentShape);
  if (reason) return { ok: false, reason };
  const target = face as Face;
  let composed: BoundaryPairing[];
  try {
    composed = [...priorWordFor(form, target, parentShape), ...pairings];
  } catch (error) {
    return { ok: false, reason: (error as Error).message };
  }
  const { run, operation } = committedOpFor(composed);
  let trace: SurfaceTrace;
  try {
    trace = run(form, target, composed);
  } catch (error) {
    return { ok: false, reason: `The committed op refuses this pairing: ${(error as Error).message}` };
  }
  return {
    ok: true,
    preview: {
      chi: trace.chi,
      w1: trace.w1,
      // Q-M2: the v0 word map presupposes a FIRST-GENERATION face — on a
      // quotient face the word composes with the prior identification and
      // names a different surface, so classification honestly abstains
      // (null → the patch fallback; the trace's χ/w₁ above still speak).
      surface:
        new Set(target.vertexIds).size === target.vertexIds.length
          ? classifyGluingWord(pairings, target.vertexIds.length)
          : null,
      // distinct slots engaged by the COMPOSED word (a re-glued slot counts
      // once) — on a first-generation face exactly the committed arithmetic.
      freeEdges:
        target.vertexIds.length - new Set(composed.flatMap((p) => [p.edgeA, p.edgeB])).size,
      operation,
    },
  };
}

// Committed op + committed G5.0 materializer → the born form. Throws loudly on
// an invalid pairing (the UI gates via validate/preview first). Q-M2: on a
// quotient face the COMPOSED word runs (birth pairs + chosen pairs), declared
// to the materializer, which replay-verifies it.
export function executeCustomGlue(
  form: Shape,
  face: Face,
  pairings: BoundaryPairing[],
  parentShape?: Shape | null,
): Shape {
  const reason = validateCustomPairings(face, pairings, form, parentShape);
  if (reason) {
    throw new Error(`customGluing: invalid pairing — ${reason}`);
  }
  const composed = [...priorWordFor(form, face, parentShape), ...pairings];
  const { run } = committedOpFor(composed);
  const trace = run(form, face, composed);
  return materializeSurfaceResult(form, face, trace, composed).shape;
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

// playgroundOperations — G5.1: the playground op registry (forms beget forms).
//
// The playground's operation set, mirroring the committed ambo-workspace pattern
// (`src/operations/types.ts` GeometryOperation: id / label / canApply /
// getDisabledReason / execute) — re-keyed from cell-selection to FACE-selection,
// the playground's op target. Each operation runs a COMMITTED op on the selected
// face and MATERIALIZES the certificate into a born form via the committed G5.0
// `materializeSurfaceResult` — the child carries its invariants, carried-not-
// minted lineage, and single-parent genealogy (parentShapeId = the source form),
// so `buildGenealogyDag` over the store's forms records the birth.
//
// v0 SCOPE: **flip-glue** end-to-end (the form-producing pipeline proven start
// to finish). The registry is data-driven so glue / collapse / cut slot in via
// the same G5.0 path; dual is a VIEW op (not a form) and route-B lift / assemble
// are the higher-arity births — they ride this registry next, not here.
//
// C2 — the registry COMPLETED: the full form-producing metabolism op-set as
// named entries with CANONICAL pairings (the interactive pairing-picker is C4).
// Word ops (opposite-edge structure, matching the render classifier exactly):
// Glue → Torus (both pairs preserving; EXACTLY 4 edges — on n > 4 two opposite
// pairs leave free rim, a different open surface, so the double-pair words gate
// to the full 4-gon) · Glue → Cylinder (single pair preserving; even n ≥ 4) ·
// Flip-glue → Klein (pres + rev; exactly 4) · Flip-glue → Möbius (single pair
// reversing; even n ≥ 4) · Flip-glue → RP² (antipodal — the original entry).
// Plus Collapse → Sphere (committed collapseFace, D²/∂D² = S²) and Cut
// (committed cutCell → materializeCutResult; the 2-cell is a logged loss).
//
// The flip-glue CANONICAL PAIRING (deterministic default, exposed for later
// refinement): each boundary edge k is glued to its OPPOSITE edge k + n/2,
// REVERSED — the antipodal identification of the face polygon (on a 4-gon:
// exactly the committed zoo's RP²). Needs an EVEN face of ≥ 4 edges; anything
// else is ineligible (canApply false — gated, never thrown at the UI).
//
// DERIVE-ONLY · ADDITIVE: committed ops + G5.0 consumed by import; no engine
// math recomputed here.

import type { Face, FaceId, Shape } from '../types/geometry';
import {
  collapseFace,
  flipGlueFace,
  glueFace,
  type BoundaryPairing,
} from '../lib/surfaceOperations';
import { cutCell } from '../lib/cutOperation';
import { materializeCutResult, materializeSurfaceResult } from '../lib/materializeOperation';
import { assemble, type BoundaryIdentification } from '../lib/multiform';
import { previewSurfaceDual, surfaceDual } from '../lib/surfaceDual';
import { sewBoundaryCircles, type IdentifyMode } from '../lib/complexIdentification';
import { recoverBornSurface } from './bornFormRouting';
import { acquireFaithfulComplex, readBoundary } from '../manuscript/surfaceClassifier';
import type { AssembledComplex } from '../lib/globalW1';

export interface PlaygroundSelection {
  faceId: FaceId | null;
}

export interface PlaygroundOperationContext {
  form: Shape;
  selectedFaceId: FaceId | null;
  selectedFace: Face | null;
  // Q6/dual (additive, optional): the form's parent when it is in the store —
  // a QUOTIENT born form's faithful complex is only reachable by replay
  // recovery against its parent (the G5.2 route). Face-targeted ops ignore it.
  parentShape?: Shape | null;
}

export interface PlaygroundOperation {
  id: string;
  label: string;
  description: string;
  canApply: (context: PlaygroundOperationContext) => boolean;
  getDisabledReason: (context: PlaygroundOperationContext) => string | null;
  execute: (context: PlaygroundOperationContext) => Shape; // → the born form
}

// the canonical antipodal pairing: edge k ~ edge k+n/2, reversed (deterministic).
export function canonicalFlipGluePairing(face: Face): BoundaryPairing[] {
  const n = face.vertexIds.length;
  const half = n / 2;
  return Array.from({ length: half }, (_x, k) => ({
    edgeA: k,
    edgeB: k + half,
    mode: 'reversing' as const,
  }));
}

// ---------------------------------------------------------------------------
// Q-M2 (sanctioned engine-faithfulness edit, 2026-07-09) — chaining onto a born
// quotient face is LEGAL (composition of identifications; researcher ruling,
// mothership-ratified). The old blanket "not yet ruled" refusal is replaced by
// three principled paths:
//   PATH 1 (generic)     — a sound born form with a non-degenerate face: ALLOW.
//                          The op composes the identification (the id-keyed
//                          union-find + the ledger's pull-back compose by
//                          construction); the committed GATE (decomposeLink in
//                          the trace/materializer) decides soundness — an
//                          instrument, not a guard (ADR 0004/0006).
//   PATH 2 (degenerate)  — the prior identification collapsed the face's OWN
//                          boundary to a wedge at ONE point (all corners one
//                          class — e.g. the minimal torus): the COARSE op is
//                          ill-posed; refuse WITH the path — subdivide first
//                          (ADR 0018 interior content), then operate.
//   PATH 3 (junction)    — the prior identification left a JUNCTION on this
//                          face (probed by the committed parent replay —
//                          recoverBornSurface — reading the birth trace's own
//                          link verdicts): threading an identification through
//                          a junction needs GSR / through-pairing (ADR 0007) —
//                          a principled DEFERRED refusal.
// ---------------------------------------------------------------------------

export type FaceChainPath =
  | { path: 'first-generation' | 'generic-quotient'; reason: null; priorPairings: BoundaryPairing[] }
  | {
      path: 'degenerate-boundary' | 'junction-crossing' | 'word-unrecoverable' | 'parallel-classes-deferred';
      reason: string;
      priorPairings: null;
    };

export function degenerateBoundaryReason(face: Face): string {
  return (
    `Face boundary is degenerate — the prior identification collapsed all ${face.vertexIds.length} corners to one point ` +
    '(a wedge of circles; no non-degenerate boundary cycle of edge-classes to operate on). ' +
    'Subdivide first (ADR 0018 — operate on the subdivided complex, e.g. the committed immersion at resolution ≥ 4), then apply the op to a subdivided face.'
  );
}

export const JUNCTION_CROSSING_REASON =
  'junction-crossing — GSR path deferred (ADR 0007: the prior identification left a junction on this face; threading a further identification through it needs the through-pairing machinery).';

export const WORD_UNRECOVERABLE_REASON =
  'Face carries identified (repeated) corners but its birth word is not replay-recoverable here — the chain composes the birth identification with the new one, which needs the parent form and a replay-verified glue/flip-glue birth (Q-M2). Provide the parent, or operate on a first-generation face.';

export const PARALLEL_CLASSES_REASON =
  'Face carries parallel identified edge-classes (distinct classes sharing both endpoints) — the carried-edge correspondence of a further identification is ambiguous on this cell structure; deferred (subdivide first, ADR 0018, or operate on a face without parallel classes).';

// ---------------------------------------------------------------------------
// The word-op SINGLE-FACE gate (engineer-chartered, 2026-07-11 — kills a live
// structural lie; message rerouted same day on the mothership's §2c ruling).
// Every op that routes through `materializeSurfaceResult` is
// FUNDAMENTAL-POLYGON-BOUND at every level: `identifyByPairs` addresses
// pairings by polygon slot index and computes cellCounts { v, e, f: 1 } (the
// single polygon — f = 1 hardcoded), and the materializer emits exactly ONE
// face ("repeats ARE the fundamental polygon"). On a multi-face form such an
// op would return a single-polygon quotient and SILENTLY DISCARD every other
// face — a child that claims to be the form's offspring but is a fragment of
// one of its faces (reachable today: the combine gate births a multi-face
// assemble child and the dock offers the word ops on it).
// THE GATE DOES NOT RETIRE now that the general complex-identification op
// exists (co-ratified): a polygon word (abAB) is SLOT-ADDRESSED to one
// polygon — on a 30-face genus-2 there is no polygon and the word DENOTES
// NOTHING. The gate is the word's honest scope, not an implementation gap;
// its refusal is a ROUTE to the ops that do act on complexes — `identify` /
// the `sew-boundary-*` registry entries (and `cut` / `assemble` /
// `connectedSum`, which were never gated: they carry the WHOLE complex).
// ---------------------------------------------------------------------------
export function singleFaceGateReason(form: Shape): string | null {
  if (form.faces.length === 1) return null;
  return (
    `A word (e.g. abAB) is addressed to the slots of ONE polygon — this form is a COMPLEX (${form.faces.length} faces), where the word denotes nothing. ` +
    'Sew its boundary instead: use identify / the sew-boundary-* ops, which act on the whole complex. (Or cut / combine.)'
  );
}

export function classifyFaceChainPath(
  face: Face,
  form: Shape,
  parentShape?: Shape | null,
): FaceChainPath {
  const vs = face.vertexIds;
  const distinct = new Set(vs);
  if (distinct.size === vs.length) return { path: 'first-generation', reason: null, priorPairings: [] };
  // PATH 2 — the boundary collapsed to a wedge at a single point
  if (distinct.size === 1) {
    return { path: 'degenerate-boundary', reason: degenerateBoundaryReason(face), priorPairings: null };
  }
  // The composition needs the born form's OWN birth word, replay-VERIFIED
  // (recoverBornSurface byte-compares the re-materialized shape) — identifying
  // ops compose it with the new word so the op acts on the quotient, not on
  // the polygon slots (Q-M2: quotient-of-a-quotient = one composed word).
  const recovery = recoverBornSurface(form, parentShape ?? null);
  if (!recovery) {
    return { path: 'word-unrecoverable', reason: WORD_UNRECOVERABLE_REASON, priorPairings: null };
  }
  // PATH 3 — the born form's OWN birth verdict: a junction/pinch link at a
  // support this face carries (minted-id reconstruction mirrors the
  // materializer's `mat:<sorted ~-joined>` exactly).
  const junctionOnFace = recovery.trace.links.some((link) => {
    if (link.valence !== 'junction' && !link.decomposition.pinch) return false;
    const mintedId = `mat:${[...link.corners].sort((a, b) => a.localeCompare(b)).join('~')}`;
    return vs.includes(mintedId);
  });
  if (junctionOnFace) {
    return { path: 'junction-crossing', reason: JUNCTION_CROSSING_REASON, priorPairings: null };
  }
  // PARALLEL CLASSES — two slots with the same endpoint key that the birth word
  // did NOT identify are distinct edge-classes sharing both endpoints; the
  // materializer's carried-edge lookup (endpoint-keyed) cannot tell them apart,
  // so a further identification on this face is deferred rather than mis-carried.
  const n = vs.length;
  const slotUF = new Map<number, number>();
  const findSlot = (x: number): number => {
    let root = x;
    while ((slotUF.get(root) ?? root) !== root) root = slotUF.get(root) as number;
    return root;
  };
  for (let k = 0; k < n; k += 1) slotUF.set(k, k);
  for (const { edgeA, edgeB } of recovery.pairings) {
    slotUF.set(findSlot(edgeA), findSlot(edgeB));
  }
  const slotsByKey = new Map<string, number[]>();
  for (let k = 0; k < n; k += 1) {
    const key = [vs[k], vs[(k + 1) % n]].sort((a, b) => a.localeCompare(b)).join('|');
    (slotsByKey.get(key) ?? slotsByKey.set(key, []).get(key)!).push(k);
  }
  for (const slots of slotsByKey.values()) {
    const roots = new Set(slots.map((k) => findSlot(k)));
    if (roots.size > 1) {
      return { path: 'parallel-classes-deferred', reason: PARALLEL_CLASSES_REASON, priorPairings: null };
    }
  }
  // PATH 1 — generic quotient: allow; the composed word is returned for the op
  // to prepend, and the gate judges the result.
  return { path: 'generic-quotient', reason: null, priorPairings: recovery.pairings };
}

// The chain gates per op family (null = the op may proceed):
// — IDENTIFYING ops (glue / flip-glue words) need the birth word to compose,
//   so every non-generic path refuses with its reason.
// — WHOLE-FACE ops (collapse / cut) are composition-immune (collapse crushes
//   the whole boundary to a point — any polygon/∂ is S² regardless of the prior
//   identification; cut removes the 2-cell and carries the 1-skeleton verbatim),
//   so they proceed even where the word is unrecoverable or classes run
//   parallel; only the two mandated refusals (degenerate wedge, junction) hold.
function wordChainGate(context: PlaygroundOperationContext): FaceChainPath | null {
  if (!context.selectedFace) return null;
  return classifyFaceChainPath(context.selectedFace, context.form, context.parentShape);
}

function wordChainReason(context: PlaygroundOperationContext): string | null {
  return wordChainGate(context)?.reason ?? null;
}

function wholeFaceChainReason(context: PlaygroundOperationContext): string | null {
  const classified = wordChainGate(context);
  if (!classified) return null;
  return classified.path === 'degenerate-boundary' || classified.path === 'junction-crossing'
    ? classified.reason
    : null;
}

// Eligible: an even n-gon (n ≥ 4) whose chain path allows operating (Q-M2:
// quotient faces are LEGAL on the generic path; the two exception paths carry
// their own principled reasons below).
const flipGlueShapeEligible = (face: Face | null): face is Face =>
  Boolean(face && face.vertexIds.length >= 4 && face.vertexIds.length % 2 === 0);

export const flipGlueOperation: PlaygroundOperation = {
  id: 'flip-glue',
  label: 'Flip-glue → RP² (antipodal)',
  description:
    'Self-glue the selected face: each boundary edge to its opposite, reversed — the committed flipGlueFace, materialized into a born form.',
  canApply: (context) =>
    singleFaceGateReason(context.form) === null &&
    flipGlueShapeEligible(context.selectedFace) &&
    wordChainReason(context) === null,
  getDisabledReason: (context) => {
    const { form, selectedFaceId, selectedFace } = context;
    if (!form) return 'No form selected.';
    if (!selectedFaceId || !selectedFace) return 'Select a face to operate on.';
    // the single-face gate is FORM-level and fires before any face-level path
    // (on single-face forms it is null — every existing reason is unchanged)
    const gateReason = singleFaceGateReason(form);
    if (gateReason) return gateReason;
    const chainReason = wordChainReason(context);
    if (chainReason) return chainReason;
    // captured BEFORE the type-guard check (its negative branch narrows to never)
    const edgeCount = selectedFace.vertexIds.length;
    if (!flipGlueShapeEligible(selectedFace)) {
      return `Face has ${edgeCount} edges — the antipodal pairing needs an even count ≥ 4.`;
    }
    return null;
  },
  execute: (context) => {
    const { form, selectedFace } = context;
    const classified = wordChainGate(context);
    if (
      singleFaceGateReason(form) !== null ||
      !flipGlueShapeEligible(selectedFace) ||
      !classified ||
      classified.reason !== null
    ) {
      throw new Error('playgroundOperations: flip-glue executed on an ineligible face');
    }
    // Q-M2: the born form's replay-verified birth word composes with the new
    // one (empty for a first-generation face — the committed path verbatim);
    // the wrapper is picked by the COMPOSED word's modes (the committed
    // flip-iff-reversing convention) and the materializer replay-verifies it.
    const composed = [...classified.priorPairings, ...canonicalFlipGluePairing(selectedFace)];
    const op = composed.some((p) => p.mode === 'reversing') ? flipGlueFace : glueFace;
    const trace = op(form, selectedFace, composed);
    return materializeSurfaceResult(form, selectedFace, trace, composed).shape;
  },
};

// ---------------------------------------------------------------------------
// C2 — the word ops (canonical opposite-edge pairings, one factory)
// ---------------------------------------------------------------------------

interface WordOperationSpec {
  id: string;
  label: string;
  description: string;
  kind: 'glue' | 'flip-glue';
  exactlyFour: boolean; // double-pair words need the FULL 4-gon (else free rim remains — a different surface)
  pairings: (face: Face) => BoundaryPairing[];
}

function makeWordOperation(spec: WordOperationSpec): PlaygroundOperation {
  const shapeEligible = (face: Face | null): face is Face =>
    flipGlueShapeEligible(face) && (!spec.exactlyFour || face.vertexIds.length === 4);
  return {
    id: spec.id,
    label: spec.label,
    description: spec.description,
    canApply: (context) =>
      singleFaceGateReason(context.form) === null &&
      shapeEligible(context.selectedFace) &&
      wordChainReason(context) === null,
    getDisabledReason: (context) => {
      const { form, selectedFaceId, selectedFace } = context;
      if (!form) return 'No form selected.';
      if (!selectedFaceId || !selectedFace) return 'Select a face to operate on.';
      // the single-face gate is FORM-level and fires before any face-level path
      const gateReason = singleFaceGateReason(form);
      if (gateReason) return gateReason;
      const chainReason = wordChainReason(context);
      if (chainReason) return chainReason;
      // captured BEFORE the type-guard check (its negative branch narrows to never)
      const edgeCount = selectedFace.vertexIds.length;
      if (shapeEligible(selectedFace)) return null;
      return spec.exactlyFour
        ? `Face has ${edgeCount} edges — this double-pair word needs exactly 4.`
        : `Face has ${edgeCount} edges — the single-pair word needs an even count ≥ 4.`;
    },
    execute: (context) => {
      const { form, selectedFace } = context;
      const classified = wordChainGate(context);
      if (
        singleFaceGateReason(form) !== null ||
        !shapeEligible(selectedFace) ||
        !classified ||
        classified.reason !== null
      ) {
        throw new Error(`playgroundOperations: ${spec.id} executed on an ineligible face`);
      }
      // Q-M2: compose the replay-verified birth word with this op's word (empty
      // prior on a first-generation face — the committed path verbatim); the
      // wrapper follows the COMPOSED word's modes (flip iff any reversing).
      const composed = [...classified.priorPairings, ...spec.pairings(selectedFace)];
      const op = composed.some((p) => p.mode === 'reversing') ? flipGlueFace : glueFace;
      const trace = op(form, selectedFace, composed);
      return materializeSurfaceResult(form, selectedFace, trace, composed).shape;
    },
  };
}

export const glueTorusOperation = makeWordOperation({
  id: 'glue-torus',
  label: 'Glue → Torus (abAB)',
  description:
    'Glue BOTH opposite edge pairs preserving — the committed glueFace torus word, materialized into a born form.',
  kind: 'glue',
  exactlyFour: true,
  pairings: () => [
    { edgeA: 0, edgeB: 2, mode: 'preserving' },
    { edgeA: 1, edgeB: 3, mode: 'preserving' },
  ],
});

export const glueCylinderOperation = makeWordOperation({
  id: 'glue-cylinder',
  label: 'Glue → Cylinder (single pair)',
  description:
    'Glue ONE opposite edge pair preserving — the open annulus (the remaining edges stay free rim).',
  kind: 'glue',
  exactlyFour: false,
  pairings: (face) => [{ edgeA: 0, edgeB: face.vertexIds.length / 2, mode: 'preserving' }],
});

export const flipGlueKleinOperation = makeWordOperation({
  id: 'flip-glue-klein',
  label: 'Flip-glue → Klein (abaB)',
  description:
    'Glue one opposite pair preserving and the other REVERSING — the committed flipGlueFace Klein word.',
  kind: 'flip-glue',
  exactlyFour: true,
  pairings: () => [
    { edgeA: 0, edgeB: 2, mode: 'preserving' },
    { edgeA: 1, edgeB: 3, mode: 'reversing' },
  ],
});

export const flipGlueMobiusOperation = makeWordOperation({
  id: 'flip-glue-mobius',
  label: 'Flip-glue → Möbius (single pair)',
  description:
    'Glue ONE opposite edge pair REVERSING — the half-twist band (the remaining edges stay free rim).',
  kind: 'flip-glue',
  exactlyFour: false,
  pairings: (face) => [{ edgeA: 0, edgeB: face.vertexIds.length / 2, mode: 'reversing' }],
});

// ---------------------------------------------------------------------------
// C2 — collapse (→ S²) and cut (the removal)
// ---------------------------------------------------------------------------

// Whole-face ops (collapse, cut) are n-free — the committed ops carry them. Q-M2:
// quotient faces operate on the generic path (these ops are composition-immune —
// see the chain-gate comment above); the degenerate / junction paths refuse
// with their principled reasons (classifyFaceChainPath above).
const wholeFaceShapeEligible = (face: Face | null): face is Face =>
  Boolean(face && face.vertexIds.length >= 2);

const wholeFaceReason = (context: PlaygroundOperationContext): string | null => {
  const { form, selectedFaceId, selectedFace } = context;
  if (!form) return 'No form selected.';
  if (!selectedFaceId || !selectedFace) return 'Select a face to operate on.';
  const chainReason = wholeFaceChainReason(context);
  if (chainReason) return chainReason;
  if (!wholeFaceShapeEligible(selectedFace)) return 'Face needs at least 2 boundary edges.';
  return null;
};

// collapse routes through `materializeSurfaceResult` (a word op in the gate's
// sense) — the single-face gate applies; `cut` below stays ungated (it carries
// the whole complex through `materializeCutResult`).
const collapseDisabledReason = (context: PlaygroundOperationContext): string | null => {
  const { form, selectedFaceId, selectedFace } = context;
  if (!form) return 'No form selected.';
  if (!selectedFaceId || !selectedFace) return 'Select a face to operate on.';
  const gateReason = singleFaceGateReason(form);
  if (gateReason) return gateReason;
  const chainReason = wholeFaceChainReason(context);
  if (chainReason) return chainReason;
  if (!wholeFaceShapeEligible(selectedFace)) return 'Face needs at least 2 boundary edges.';
  return null;
};

export const collapseSphereOperation: PlaygroundOperation = {
  id: 'collapse-sphere',
  label: 'Collapse → Sphere (D²/∂D²)',
  description:
    'Collapse the WHOLE face boundary to one apex — the committed collapseFace (χ=2, the manifold sphere), materialized into a born form.',
  canApply: (context) =>
    singleFaceGateReason(context.form) === null &&
    wholeFaceShapeEligible(context.selectedFace) &&
    wholeFaceChainReason(context) === null,
  getDisabledReason: collapseDisabledReason,
  execute: (context) => {
    const { form, selectedFace } = context;
    if (
      singleFaceGateReason(form) !== null ||
      !wholeFaceShapeEligible(selectedFace) ||
      wholeFaceChainReason(context) !== null
    ) {
      throw new Error('playgroundOperations: collapse-sphere executed on an ineligible face');
    }
    return materializeSurfaceResult(form, selectedFace, collapseFace(form, selectedFace)).shape;
  },
};

export const cutFaceOperation: PlaygroundOperation = {
  id: 'cut',
  label: 'Cut (remove the 2-cell)',
  description:
    'Remove the selected open 2-cell — the committed cutCell (a LOGGED loss; the boundary passes through, now free), materialized directly.',
  canApply: (context) =>
    wholeFaceShapeEligible(context.selectedFace) && wholeFaceChainReason(context) === null,
  getDisabledReason: wholeFaceReason,
  execute: (context) => {
    const { form, selectedFace } = context;
    if (!wholeFaceShapeEligible(selectedFace) || wholeFaceChainReason(context) !== null) {
      throw new Error('playgroundOperations: cut executed on an ineligible face');
    }
    return materializeCutResult(form, cutCell(form, selectedFace));
  },
};

// ---------------------------------------------------------------------------
// Q6 — the surface (Poincaré) dual: a WHOLE-FORM op (face selection ignored).
// Gated by the committed decomposeLink soundness inside `surfaceDual` (refuses
// bounded / non-manifold / pinched inputs with the reason). A quotient born
// form's faithful complex is recovered by replay against its parent.
// ---------------------------------------------------------------------------

function faithfulComplexFor(form: Shape, parentShape: Shape | null | undefined): AssembledComplex | undefined {
  const recovery = recoverBornSurface(form, parentShape ?? null);
  return recovery ? recovery.materialized.complex : undefined;
}

export const surfaceDualOperation: PlaygroundOperation = {
  id: 'dual',
  label: 'Dual (surface Poincaré)',
  description:
    'The n=2 Poincaré dual of a sound closed surface — faces↔vertices, edges self-paired; χ/w₁/genus preserved; M** = M. Refuses bounded/non-manifold forms.',
  canApply: (context) =>
    previewSurfaceDual(context.form, { complex: faithfulComplexFor(context.form, context.parentShape) }).ok,
  getDisabledReason: (context) => {
    const probe = previewSurfaceDual(context.form, {
      complex: faithfulComplexFor(context.form, context.parentShape),
    });
    return probe.ok ? null : probe.reason;
  },
  execute: (context) =>
    surfaceDual(context.form, { complex: faithfulComplexFor(context.form, context.parentShape) }).shape,
};

// ---------------------------------------------------------------------------
// the general complex-identification op's meaningful sub-family (sanctioned,
// 2026-07-11): SEW two boundary circles — the arity-1 self sibling of
// `connectedSum`. Eligibility reads the committed P-IMMERSE boundary-circle
// counter (`surfaceClassifier.readBoundary`) over the form's faithful DIRECT
// complex; the sew itself is `lib/complexIdentification` (enact → the
// committed gate judges — instruments, not guards). Whole-form, like dual
// (face selection ignored). The canonical v0 choice: the FIRST TWO circles in
// deterministic smallest-edge-id order — the interactive circle picker is a
// later refinement (the canonicalAssembleIdentification idiom). A
// single-face quotient refuses toward the committed word ops (its rims are
// sewn by the Q-M2 composed chain — glue/flip-glue on the face).
// ---------------------------------------------------------------------------

function sewEligibilityReason(form: Shape): string | null {
  const acquired = acquireFaithfulComplex(form, null);
  if (!acquired || acquired.source !== 'direct') {
    return 'Sewing reads the explicit complex — a single-face quotient sews its rims through the committed word ops (the composed chain).';
  }
  const boundary = readBoundary(acquired.complex);
  if (!boundary.circlesAreDisjoint) {
    return 'The free 1-skeleton is not a disjoint union of circles — nothing to sew.';
  }
  if (boundary.circles < 2) {
    return `The form has ${boundary.circles} boundary circle${boundary.circles === 1 ? '' : 's'} — sewing needs two.`;
  }
  return null;
}

function makeSewOperation(mode: IdentifyMode): PlaygroundOperation {
  return {
    id: `sew-boundary-${mode}`,
    label: mode === 'preserving' ? 'Sew rims (preserving)' : 'Sew rims (reversing)',
    description:
      mode === 'preserving'
        ? "Identify the form's first two boundary circles orientation-COMPATIBLY (opposite wedge directions on the merged seam) — the general complex identification; the committed gate judges."
        : "Identify the form's first two boundary circles orientation-INCOMPATIBLY (same wedge direction — the flip seam) — the general complex identification; the committed gate judges.",
    canApply: (context) => Boolean(context.form) && sewEligibilityReason(context.form) === null,
    getDisabledReason: (context) => {
      if (!context.form) return 'No form selected.';
      return sewEligibilityReason(context.form);
    },
    execute: (context) => {
      if (!context.form || sewEligibilityReason(context.form) !== null) {
        throw new Error(`playgroundOperations: sew-boundary-${mode} executed on an ineligible form`);
      }
      return sewBoundaryCircles(context.form, mode).shape;
    },
  };
}

export const sewBoundaryPreservingOperation = makeSewOperation('preserving');
export const sewBoundaryReversingOperation = makeSewOperation('reversing');

export const PLAYGROUND_OPERATIONS: PlaygroundOperation[] = [
  glueTorusOperation,
  glueCylinderOperation,
  flipGlueKleinOperation,
  flipGlueOperation, // → RP² (antipodal) — the original G5.1 entry
  flipGlueMobiusOperation,
  collapseSphereOperation,
  cutFaceOperation,
  surfaceDualOperation, // Q6 — the reflective axis
  sewBoundaryPreservingOperation, // the general complex identification (boundary sub-family)
  sewBoundaryReversingOperation,
];

export function getPlaygroundOperation(id: string): PlaygroundOperation {
  const operation = PLAYGROUND_OPERATIONS.find((op) => op.id === id);
  if (!operation) {
    throw new Error(`playgroundOperations: unknown operation "${id}"`);
  }
  return operation;
}

// ---------------------------------------------------------------------------
// G3 — the arity-2 birth: assemble (two forms in, one child out)
// ---------------------------------------------------------------------------
// The v0 CANONICAL boundary identification (deterministic default; the full
// interactive gluing-picker is a later refinement): identify form A's first face's
// FIRST boundary edge with form B's, endpoint-wise — two carried merges
// (asm:<a>+<b>), exactly the committed `assemble`'s explicit-identification shape.
export function canonicalAssembleIdentification(a: Shape, b: Shape): BoundaryIdentification {
  const edgeOf = (form: Shape): [string, string] => {
    const face = form.faces[0];
    if (!face || face.vertexIds.length < 2) {
      throw new Error(`playgroundOperations: form "${form.id}" has no identifiable boundary edge`);
    }
    return [face.vertexIds[0], face.vertexIds[1]];
  };
  const [a0, a1] = edgeOf(a);
  const [b0, b1] = edgeOf(b);
  return {
    merges: [
      { resultId: `asm:${a0}+${b0}`, sources: [a0, b0] },
      { resultId: `asm:${a1}+${b1}`, sources: [a1, b1] },
    ],
  };
}

const vertexIdsDisjoint = (a: Shape, b: Shape): boolean => {
  const ids = new Set(Object.keys(a.vertices));
  return Object.keys(b.vertices).every((id) => !ids.has(id));
};

export const ASSEMBLE_OPERATION_ID = 'assemble';

export function canAssemblePair(a: Shape | null, b: Shape | null): boolean {
  return Boolean(
    a &&
      b &&
      a.id !== b.id &&
      a.faces[0] &&
      a.faces[0].vertexIds.length >= 2 &&
      b.faces[0] &&
      b.faces[0].vertexIds.length >= 2 &&
      vertexIdsDisjoint(a, b),
  );
}

export function getAssemblePairDisabledReason(a: Shape | null, b: Shape | null): string | null {
  if (!a) return 'No form selected.';
  if (!b) return 'Pick a second form to assemble with.';
  if (a.id === b.id) return 'Pick a DIFFERENT form — assemble needs two.';
  if (!a.faces[0] || a.faces[0].vertexIds.length < 2 || !b.faces[0] || b.faces[0].vertexIds.length < 2) {
    return 'Both forms need a face with a boundary edge.';
  }
  if (!vertexIdsDisjoint(a, b)) {
    return 'The forms share vertex ids — invoke them with DISTINCT sources (co-location ≠ identity needs disjoint universes).';
  }
  return null;
}

// The committed `assemble` over the two forms with the canonical identification.
// The child is a multi-parent shape-ROOT (parentShapeId null — the committed
// assemble semantics per the route-B lineage ruling) whose shape-level
// sourceVertexIds pull back to BOTH parents in the committed DAG.
export function executeAssemblePair(a: Shape, b: Shape): Shape {
  if (!canAssemblePair(a, b)) {
    throw new Error('playgroundOperations: assemble executed on an ineligible pair');
  }
  return assemble([a, b], canonicalAssembleIdentification(a, b)).shape;
}

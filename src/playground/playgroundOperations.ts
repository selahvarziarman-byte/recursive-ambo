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

export interface PlaygroundSelection {
  faceId: FaceId | null;
}

export interface PlaygroundOperationContext {
  form: Shape;
  selectedFaceId: FaceId | null;
  selectedFace: Face | null;
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

// Eligible: an even n-gon (n ≥ 4) with DISTINCT corners. A repeated-vertex cycle
// (a materialized fundamental polygon) is excluded in v0 — the committed ops'
// corner union-find works over ids, and its semantics on repeated-vertex faces
// is un-ruled upstream territory (chaining onto quotient faces: flagged, not shipped).
const flipGlueEligible = (face: Face | null): face is Face =>
  Boolean(
    face &&
      face.vertexIds.length >= 4 &&
      face.vertexIds.length % 2 === 0 &&
      new Set(face.vertexIds).size === face.vertexIds.length,
  );

export const flipGlueOperation: PlaygroundOperation = {
  id: 'flip-glue',
  label: 'Flip-glue → RP² (antipodal)',
  description:
    'Self-glue the selected face: each boundary edge to its opposite, reversed — the committed flipGlueFace, materialized into a born form.',
  canApply: ({ selectedFace }) => flipGlueEligible(selectedFace),
  getDisabledReason: ({ form, selectedFaceId, selectedFace }) => {
    if (!form) return 'No form selected.';
    if (!selectedFaceId || !selectedFace) return 'Select a face to operate on.';
    const edgeCount = selectedFace.vertexIds.length;
    const distinct = new Set(selectedFace.vertexIds).size === edgeCount;
    if (!flipGlueEligible(selectedFace)) {
      return distinct
        ? `Face has ${edgeCount} edges — the antipodal pairing needs an even count ≥ 4.`
        : 'Face carries identified (repeated) corners — operating on quotient faces is not yet ruled.';
    }
    return null;
  },
  execute: ({ form, selectedFace }) => {
    if (!flipGlueEligible(selectedFace)) {
      throw new Error('playgroundOperations: flip-glue executed on an ineligible face');
    }
    const trace = flipGlueFace(form, selectedFace, canonicalFlipGluePairing(selectedFace));
    return materializeSurfaceResult(form, selectedFace, trace).shape;
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
  const eligible = (face: Face | null): face is Face =>
    flipGlueEligible(face) && (!spec.exactlyFour || face.vertexIds.length === 4);
  return {
    id: spec.id,
    label: spec.label,
    description: spec.description,
    canApply: ({ selectedFace }) => eligible(selectedFace),
    getDisabledReason: ({ form, selectedFaceId, selectedFace }) => {
      if (!form) return 'No form selected.';
      if (!selectedFaceId || !selectedFace) return 'Select a face to operate on.';
      // captured BEFORE the type-guard check (its negative branch narrows to never)
      const edgeCount = selectedFace.vertexIds.length;
      const distinct = new Set(selectedFace.vertexIds).size === edgeCount;
      if (eligible(selectedFace)) return null;
      if (!distinct) {
        return 'Face carries identified (repeated) corners — operating on quotient faces is not yet ruled.';
      }
      return spec.exactlyFour
        ? `Face has ${edgeCount} edges — this double-pair word needs exactly 4.`
        : `Face has ${edgeCount} edges — the single-pair word needs an even count ≥ 4.`;
    },
    execute: ({ form, selectedFace }) => {
      if (!eligible(selectedFace)) {
        throw new Error(`playgroundOperations: ${spec.id} executed on an ineligible face`);
      }
      const op = spec.kind === 'glue' ? glueFace : flipGlueFace;
      const trace = op(form, selectedFace, spec.pairings(selectedFace));
      return materializeSurfaceResult(form, selectedFace, trace).shape;
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

// Distinct corners required (the standing freeze: operating on quotient faces is
// un-ruled); collapse and cut are otherwise n-free — the committed ops carry them.
const wholeFaceEligible = (face: Face | null): face is Face =>
  Boolean(
    face &&
      face.vertexIds.length >= 2 &&
      new Set(face.vertexIds).size === face.vertexIds.length,
  );

const wholeFaceReason = ({ form, selectedFaceId, selectedFace }: PlaygroundOperationContext): string | null => {
  if (!form) return 'No form selected.';
  if (!selectedFaceId || !selectedFace) return 'Select a face to operate on.';
  if (wholeFaceEligible(selectedFace)) return null;
  return 'Face carries identified (repeated) corners — operating on quotient faces is not yet ruled.';
};

export const collapseSphereOperation: PlaygroundOperation = {
  id: 'collapse-sphere',
  label: 'Collapse → Sphere (D²/∂D²)',
  description:
    'Collapse the WHOLE face boundary to one apex — the committed collapseFace (χ=2, the manifold sphere), materialized into a born form.',
  canApply: ({ selectedFace }) => wholeFaceEligible(selectedFace),
  getDisabledReason: wholeFaceReason,
  execute: ({ form, selectedFace }) => {
    if (!wholeFaceEligible(selectedFace)) {
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
  canApply: ({ selectedFace }) => wholeFaceEligible(selectedFace),
  getDisabledReason: wholeFaceReason,
  execute: ({ form, selectedFace }) => {
    if (!wholeFaceEligible(selectedFace)) {
      throw new Error('playgroundOperations: cut executed on an ineligible face');
    }
    return materializeCutResult(form, cutCell(form, selectedFace));
  },
};

export const PLAYGROUND_OPERATIONS: PlaygroundOperation[] = [
  glueTorusOperation,
  glueCylinderOperation,
  flipGlueKleinOperation,
  flipGlueOperation, // → RP² (antipodal) — the original G5.1 entry
  flipGlueMobiusOperation,
  collapseSphereOperation,
  cutFaceOperation,
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

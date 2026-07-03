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
// The flip-glue CANONICAL PAIRING (deterministic default, exposed for later
// refinement): each boundary edge k is glued to its OPPOSITE edge k + n/2,
// REVERSED — the antipodal identification of the face polygon (on a 4-gon:
// exactly the committed zoo's RP²). Needs an EVEN face of ≥ 4 edges; anything
// else is ineligible (canApply false — gated, never thrown at the UI).
//
// DERIVE-ONLY · ADDITIVE: committed ops + G5.0 consumed by import; no engine
// math recomputed here.

import type { Face, FaceId, Shape } from '../types/geometry';
import { flipGlueFace, type BoundaryPairing } from '../lib/surfaceOperations';
import { materializeSurfaceResult } from '../lib/materializeOperation';

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
  label: 'Flip-glue (antipodal)',
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

export const PLAYGROUND_OPERATIONS: PlaygroundOperation[] = [flipGlueOperation];

export function getPlaygroundOperation(id: string): PlaygroundOperation {
  const operation = PLAYGROUND_OPERATIONS.find((op) => op.id === id);
  if (!operation) {
    throw new Error(`playgroundOperations: unknown operation "${id}"`);
  }
  return operation;
}

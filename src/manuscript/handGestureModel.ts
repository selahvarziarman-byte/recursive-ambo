// handGestureModel — H2, THE PERSON'S HANDS (the arc's closing cut): the
// react-free model of the two person gestures —
//   · THE FOLD (the 7th dock word): the person taps two EDGES of their form's
//     only face → they pair (a·a); the pair's mode is the arrow (→→ preserving
//     = glue · →⇄ reversing = flip-glue). The letters + arrows ARE the
//     fundamental-polygon word — not a picture OF the fold, the fold itself.
//   · THE AIMED CHORD (the subdivide): the person taps two non-adjacent
//     CORNERS of a face → a chord splits it :disk/:rest — as a general
//     reshape of a plain written form, and as the FORK the combine flow
//     offers on the rim-mismatch refusal (the lengths computed from the two
//     PICKED faces the caller already holds — the refusal string is never
//     parsed).
//
// DERIVE-ONLY · ADDITIVE: every verdict here is a committed module's own —
// validation/preview/execution of the fold are customGluing's committed
// validate/preview/execute (the six dock words stay presets over the SAME
// BoundaryPairing[] seam); the chord is the committed subdivideFace (refine,
// not a birth — the reshaped form keeps its id and genealogy); renders route
// through the committed routeWrittenRender. This module invents no operability
// and recomputes no invariant.
//
// The person-facing strings assembled here are the designer's plate wording
// (H2_AFFORDANCES_DESIGNER.png) as WORKING TEXT — his craft-pass refines them
// post-ratification.

import type { Face, Shape } from '../types/geometry';
import type { BoundaryPairing } from '../lib/surfaceOperations';
import {
  describeFaceEdges,
  executeCustomGlue,
  previewCustomGlue,
  type FaceEdgeLabel,
  type GluingPreviewResult,
} from '../playground/customGluing';
import { singleFaceGateReason } from '../playground/playgroundOperations';
import { subdivideFace } from '../lib/surfaceRefinement';
import { routeWrittenRender, type WrittenForm } from './writtenFormModel';

// ---------------------------------------------------------------------------
// THE FOLD — the 7th dock word (the six words are presets over this gesture)
// ---------------------------------------------------------------------------

// the committed pretty names for immersion-routed births (the same strings the
// committed dock path shows — mirrored verbatim from the frozen model's map)
const FOLD_IMMERSION_TITLES: Record<string, string> = {
  torus: 'Torus (T²)',
  klein: 'Klein bottle (K²)',
  rp2: 'RP² (cross-cap)',
  sphere: 'Sphere (S²)',
  cylinder: 'Cylinder',
  mobius: 'Möbius band',
};

// reason-or-null for the dock chip: the fold needs a form whose ONLY face is
// the rim — the committed form-level gate speaks for every other shape.
export function foldGateReason(shape: Shape | null): string | null {
  if (!shape) return 'Select a form first.';
  if (shape.faces.length !== 1) return singleFaceGateReason(shape);
  return null;
}

// the rim's edge vocabulary — the committed picker labels on the ONLY face
export function foldRimEdges(shape: Shape): FaceEdgeLabel[] {
  const [onlyFace] = shape.faces; // the ONLY face — not a choice, no array-order ambiguity
  return onlyFace ? describeFaceEdges(onlyFace) : [];
}

export interface FoldState {
  pairs: BoundaryPairing[];
  pending: number | null; // a tapped edge waiting for its partner (the open half-pair)
}

export const EMPTY_FOLD: FoldState = { pairs: [], pending: null };

// the tap reducer: tap a paired edge → its pair dissolves; tap the pending
// edge → the tap is withdrawn; tap a second edge → the pair closes (mode
// starts preserving — the arrow toggles it); else the edge waits as pending.
export function tapFoldEdge(state: FoldState, edgeIndex: number): FoldState {
  const holder = state.pairs.findIndex((p) => p.edgeA === edgeIndex || p.edgeB === edgeIndex);
  if (holder >= 0) {
    return { pairs: state.pairs.filter((_, k) => k !== holder), pending: state.pending };
  }
  if (state.pending === edgeIndex) return { pairs: state.pairs, pending: null };
  if (state.pending === null) return { pairs: state.pairs, pending: edgeIndex };
  return {
    pairs: [...state.pairs, { edgeA: state.pending, edgeB: edgeIndex, mode: 'preserving' }],
    pending: null,
  };
}

export function toggleFoldPairMode(state: FoldState, pairIndex: number): FoldState {
  return {
    pairs: state.pairs.map((p, k) =>
      k === pairIndex ? { ...p, mode: p.mode === 'preserving' ? 'reversing' : 'preserving' } : p,
    ),
    pending: state.pending,
  };
}

// the LIVE preview — the committed dry-run's own certificate (χ, w₁, free rim
// slots, which committed op the modes select); every degenerate choice is the
// committed reason, never a throw at the UI.
export function foldPreviewFor(
  shape: Shape,
  pairs: BoundaryPairing[],
  parentShape: Shape | null,
): GluingPreviewResult {
  const [onlyFace] = shape.faces; // the ONLY face — not a choice
  return previewCustomGlue(shape, onlyFace ?? null, pairs, parentShape);
}

// commit enables only when the gesture's rim-word CLOSES: no open half-pair,
// at least one pair, and the committed pipeline accepts the word (the plate's
// cone: ONE pair on a triangle commits with 1 rim edge honestly FREE — an
// open surface is a legal word; a dangling half-tap is not).
export function foldCommitEnabled(state: FoldState, preview: GluingPreviewResult | null): boolean {
  return state.pending === null && state.pairs.length >= 1 && preview !== null && preview.ok;
}

export type FoldApplyResult = { ok: true; born: WrittenForm } | { ok: false; reason: string };

// the committed execute → the committed render route → the written form. The
// same post-birth shape as the registry path: the child carries its real
// parent; the genealogy the materializer minted (glue / flip-glue) is what
// the record reads — the fold adds no fiction.
export function applyFoldTo(
  targetShape: Shape,
  targetParent: Shape | null,
  targetAncestry: Shape[] | undefined,
  pairs: BoundaryPairing[],
  seq: number,
  resolution: number,
): FoldApplyResult {
  const preview = foldPreviewFor(targetShape, pairs, targetParent);
  if (!preview.ok) return { ok: false, reason: preview.reason };
  const [onlyFace] = targetShape.faces; // gated non-null by the preview above
  let bornShape: Shape;
  let render: WrittenForm['render'];
  const bornAncestry = [targetShape, ...(targetAncestry ?? (targetParent ? [targetParent] : []))];
  try {
    bornShape = executeCustomGlue(targetShape, onlyFace as Face, pairs, targetParent);
    render = routeWrittenRender(bornShape, bornAncestry, resolution);
  } catch (error) {
    // a contract surprise surfaces verbatim — fail-honest, never a mock
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  }
  const title =
    render.mode === 'immersion'
      ? `${FOLD_IMMERSION_TITLES[render.model.surface] ?? render.model.surface} — born`
      : render.mode === 'skeleton'
        ? 'Skeleton — fold-born'
        : render.mode === 'classBody'
          ? `${render.model.components.map((c) => c.label).join(' + ')} — born`
          : 'fold — born';
  return {
    ok: true,
    born: {
      id: `w${seq}`,
      title,
      shape: bornShape,
      parentShape: targetShape,
      opId: preview.preview.operation, // the committed op the modes selected: glue | flip-glue
      provenance: `fold — the rim's own word (${pairs.length} pair${pairs.length === 1 ? '' : 's'} → the committed ${preview.preview.operation})`,
      render,
    },
  };
}

// ---------------------------------------------------------------------------
// THE AIMED CHORD — the subdivide gesture (refine, never a birth)
// ---------------------------------------------------------------------------

export interface ChordAim {
  faceId: string;
  cornerA: string;
  cornerB: string;
}

export type ChordSplit =
  | { ok: true; diskCorners: number; restCorners: number; shape: Shape }
  | { ok: false; reason: string };

// the live split readout — the committed subdivideFace dry-run: its walls
// (alien face · quotient face · corner off the face · adjacent corners — "a
// triangle has no chord" · duplicate endpoint pair) refuse BY NAME, verbatim.
export function chordSplitFor(shape: Shape, faceId: string, cornerA: string, cornerB: string): ChordSplit {
  const face = shape.faces.find((f) => f.id === faceId);
  if (!face) return { ok: false, reason: `the face "${faceId}" is not on this form` };
  try {
    const refined = subdivideFace(shape, face, cornerA, cornerB);
    const disk = refined.shape.faces.find((f) => f.id === `${faceId}:disk`);
    const rest = refined.shape.faces.find((f) => f.id === `${faceId}:rest`);
    return {
      ok: true,
      diskCorners: disk ? disk.vertexIds.length : 0,
      restCorners: rest ? rest.vertexIds.length : 0,
      shape: refined.shape,
    };
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  }
}

export type ChordReshapeResult = { ok: true; reshaped: WrittenForm } | { ok: false; reason: string };

// gesture (a) — reshape a face anytime: the chord applied IN PLACE to a
// written form. Refine is not a birth: the shape keeps its id and genealogy;
// only the cell structure gains the chord (+1 edge, +1 face, +0 vertices —
// LAW 16: no invariant may move), and the render re-derives through the
// committed route on the same lineage.
export function applyChordToWritten(
  form: WrittenForm,
  lineage: Shape[],
  aim: ChordAim,
  resolution: number,
): ChordReshapeResult {
  const split = chordSplitFor(form.shape, aim.faceId, aim.cornerA, aim.cornerB);
  if (!split.ok) return split;
  let render: WrittenForm['render'];
  try {
    render = routeWrittenRender(split.shape, lineage, resolution);
  } catch (error) {
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  }
  return { ok: true, reshaped: { ...form, shape: split.shape, render } };
}

// the fork's gate-side application: the person's aimed chords composed onto
// the gate's shape (the same pattern as the gate's committed 1-face refine —
// the page form is untouched; the birth receives the shape the panel shows).
// An aim the walls refuse on replay is dropped rather than crashing the gate
// — the panel's face list then simply lacks the split, and the person re-aims.
export function applyGateChords(shape: Shape, aims: ChordAim[]): Shape {
  let current = shape;
  for (const aim of aims) {
    const split = chordSplitFor(current, aim.faceId, aim.cornerA, aim.cornerB);
    if (split.ok) current = split.shape;
  }
  return current;
}

// ---------------------------------------------------------------------------
// THE FORK — the rim-mismatch refusal offers the aimed chord, pre-aimed
// ---------------------------------------------------------------------------

export interface ForkOffer {
  pageKey: string; // the longer side's page key (the gate side the chord acts on)
  faceId: string; // the longer PICKED face — the chord's subject
  faceCorners: number; // its rim length (read from the face, never a string)
  targetLen: number; // the shorter PICKED face's rim length — the aim
  formTitle: string; // the longer side's display title (for the offer's wording)
}

// null ⟺ no honest fork: the offer exists exactly when the two PICKED faces'
// rim lengths differ, the shorter is a real rim (≥ 3), a chord can carve the
// target from the longer (target < longer), and the longer face is
// distinct-cornered (a folded/quotient face refuses the chord by the
// committed wall — there the standing re-pick door remains the only cure).
export function combineForkFor(
  portFaceA: Face | null,
  portFaceB: Face | null,
  aKey: string,
  bKey: string,
  aTitle: string,
  bTitle: string,
): ForkOffer | null {
  if (!portFaceA || !portFaceB) return null;
  const lenA = portFaceA.vertexIds.length;
  const lenB = portFaceB.vertexIds.length;
  if (lenA === lenB) return null;
  const longer = lenA > lenB ? { face: portFaceA, key: aKey, title: aTitle, len: lenA, target: lenB } : { face: portFaceB, key: bKey, title: bTitle, len: lenB, target: lenA };
  if (longer.target < 3) return null;
  if (new Set(longer.face.vertexIds).size !== longer.face.vertexIds.length) return null;
  return {
    pageKey: longer.key,
    faceId: longer.face.id,
    faceCorners: longer.len,
    targetLen: longer.target,
    formTitle: longer.title,
  };
}

// the offer's wording — the designer's plate line, with the real values
// ("…or subdivide the square — draw a chord to split off a 3-edge face to
// match."), assembled here so the chrome stays presentation-only.
export function forkOfferLabel(fork: ForkOffer): string {
  return `…or subdivide ${fork.formTitle}'s ${fork.faceCorners}-corner face — draw a chord to split off a ${fork.targetLen}-edge face to match.`;
}

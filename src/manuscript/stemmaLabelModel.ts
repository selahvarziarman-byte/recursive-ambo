// stemmaLabelModel — B-120: the operation word on the stemma edge (E.1–E.7).
//
// THE SEAM THE DRAWING DECOMPOSES ALONG (the designer's derivation, ratified
// B-120): an edge's endpoints are FORMS, drawn and named already; the arrow
// is the LINE itself; `— invoked` / `— born` are endpoint status and travel
// with the forms. The operation is the only part the picture cannot show —
// "a line can say from this to that; it cannot say by what." So the edge
// carries the operation, ALONE — the same committed `GenealogyEdge.operation`
// the foot record prints (`footRecord` reads `edges[0].operation`): one
// field, two readers, never a second producer. Nothing else rides the edge —
// in particular NOT `GenealogyEdge.death`, whose sense predates ADR 0027 §4's
// split and is refused off the drawing (B-120 §2.3).
//
// This module is the PURE model of that drawing — midpoint, arrowhead, and
// the E.5 yield — so a witness can import the real functions without
// mounting the view.

export type PagePoint = readonly [number, number] | readonly [number, number, number];

// E.7 — R8 ported (the InkedSkeleton §8 mechanism): an INVISIBLE stroke this
// many PIXELS wide over the same segment widens the raycast target while the
// ink stays hairline. The ruled failure it kills: a hairline target and a
// broken door produce the same observation.
export const STEMMA_PICK_WIDTH_PX = 24;

// E.3 — the arrowhead's page-unit dimensions. `backoff` keeps the head out
// from under the child's own ink; a short edge backs off a fraction of
// itself instead so the head never crosses the midpoint's label ground.
export const STEMMA_ARROW = {
  length: 0.85,
  halfWidth: 0.3,
  backoff: 1.4,
  backoffFractionCap: 0.25,
} as const;

// E.1 — the verb belongs between its subject and object.
export function stemmaMidpoint(from: PagePoint, to: PagePoint): [number, number] {
  return [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
}

export interface StemmaArrowheadPlan {
  tip: [number, number]; // the triangle's point, ON the segment
  angleRad: number; // parent→child direction (atan2 in the page plane)
}

// E.3 — the head sits at the CHILD end (an arrow arrives), backed off along
// the edge so the child's ink does not swallow it. A zero-length edge (both
// endpoints dragged to one point) draws NO head rather than inventing a
// direction — a positive fact needs a positive mark, and here there is none.
export function stemmaArrowhead(from: PagePoint, to: PagePoint): StemmaArrowheadPlan | null {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const len = Math.hypot(dx, dy);
  if (len === 0) return null;
  const backoff = Math.min(STEMMA_ARROW.backoff, len * STEMMA_ARROW.backoffFractionCap);
  const t = (len - backoff) / len;
  return { tip: [from[0] + dx * t, from[1] + dy * t], angleRad: Math.atan2(dy, dx) };
}

// The label's world-unit footprint under the page's own label species (drei
// Html, distanceFactor 13, ui-monospace 9.5px — FormLabel's quiet register).
// Because every label shares one distanceFactor, two labels that overlap at
// one camera distance overlap at every distance, so the collision test lives
// in PAGE UNITS and needs no camera. MEASURED at the eye (B-120 drive, the
// rendered `glue` through the real camera at the page plane): rect 6.39 ×
// 4.36 px at 20.838 px/world → 0.0767 world/char, 0.209 world line height.
export const STEMMA_LABEL_FOOTPRINT = {
  charW: 0.077, // world units per monospace character (measured 0.0767)
  lineH: 0.21, // one line's world height (measured 0.209)
  clearance: 0.12, // breathing room — touching already reads as collision
} as const;

export interface StemmaLabelCandidate {
  key: string;
  word: string;
  mid: readonly [number, number];
}

// E.5 — WHEN LABELS WOULD COLLIDE, THE LABEL YIELDS — THE EDGE NEVER DOES.
// This function decides label VISIBILITY ONLY: no line, no arrowhead, no
// pick stroke rides on its answer — the view draws every edge
// unconditionally, so the yield has no channel through which to reach the
// ink (the rule is enforced by construction, not by discipline).
// Priority is the given order — the caller puts the pointer-hovered label
// first (the pointer is the strongest attention), the rest in the committed
// reduced-edge order — and a candidate whose box overlaps an already-kept
// box yields.
export function visibleStemmaLabels(candidates: readonly StemmaLabelCandidate[]): Set<string> {
  const kept: Array<{ mid: readonly [number, number]; halfW: number; halfH: number }> = [];
  const visible = new Set<string>();
  for (const candidate of candidates) {
    const halfW = (candidate.word.length * STEMMA_LABEL_FOOTPRINT.charW) / 2 + STEMMA_LABEL_FOOTPRINT.clearance;
    const halfH = STEMMA_LABEL_FOOTPRINT.lineH / 2 + STEMMA_LABEL_FOOTPRINT.clearance;
    const collides = kept.some(
      (box) =>
        Math.abs(candidate.mid[0] - box.mid[0]) < halfW + box.halfW &&
        Math.abs(candidate.mid[1] - box.mid[1]) < halfH + box.halfH,
    );
    if (collides) continue;
    kept.push({ mid: candidate.mid, halfW, halfH });
    visible.add(candidate.key);
  }
  return visible;
}

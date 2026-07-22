import type { DockGroupKey } from './writtenFormModel';

// OperationGlyphs — Manuscript craft round-2: the DESIGNER'S FINAL glyph set
// (RELAY_DESIGNER_TO_ENGINEER_MANUSCRIPT_CRAFT_2 §1 — drop-in, verbatim).
//
// CONTEXT ("the chrome & interaction"): each dock operation is an INFORMATIVE
// GLYPH — a small diagram of the move itself; the text label appears on hover.
// These finals read as the real moves: glue/flip-glue carry the fundamental-
// polygon notation (matching arrows vs one reversed + the crossing pair);
// collapse draws the boundary INWARD to the apex; cut lifts the 2-cell away
// as a dashed ghost (the boundary stays — the loss is logged); dualize swaps
// filled original vertices for ring dual-vertices under the dual diamond.
// A glyph is a DIAGRAM of the move; the operation it fires is the real
// committed one (writtenFormModel → PlaygroundOperation) — never a stand-in.
// (The dim-3 ORIENTED pairing glyph is the designer's next drop-in — noted.)

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const BOLD = { ...S, strokeWidth: 2.6 };
const FAINT = { ...S, strokeWidth: 1, opacity: 0.55 };

// glue — the two identified edges arrowed the SAME sense (they become one edge)
export function GlueGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <rect x="6" y="7" width="18" height="16" {...S} />
      <path d="M6 22 V9" {...BOLD} /><path d="M3.8 11.5 L6 9 L8.2 11.5" {...BOLD} />
      <path d="M24 22 V9" {...BOLD} /><path d="M21.8 11.5 L24 9 L26.2 11.5" {...BOLD} />
      <path d="M6 5 Q15 1.5 24 5" {...FAINT} />
    </svg>
  );
}

// flip-glue — the same pairing, one arrow REVERSED (the half-twist crosses above)
export function FlipGlueGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <rect x="6" y="7" width="18" height="16" {...S} />
      <path d="M6 22 V9" {...BOLD} /><path d="M3.8 11.5 L6 9 L8.2 11.5" {...BOLD} />
      <path d="M24 8 V21" {...BOLD} /><path d="M21.8 18.5 L24 21 L26.2 18.5" {...BOLD} />
      <path d="M6 4.5 C 12 1.5 18 7.5 24 4" {...FAINT} />
      <path d="M6 4 C 12 7.5 18 1.5 24 4.5" {...FAINT} />
    </svg>
  );
}

// collapse — the whole boundary drawn INWARD to one apex point
export function CollapseGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <circle cx="15" cy="15" r="10" {...S} />
      <circle cx="15" cy="15" r="2" fill="currentColor" stroke="none" />
      <path d="M15 6 V11" {...S} /><path d="M13 9 L15 11 L17 9" {...S} />
      <path d="M15 24 V19" {...S} /><path d="M13 21 L15 19 L17 21" {...S} />
      <path d="M6 15 H11" {...S} /><path d="M9 13 L11 15 L9 17" {...S} />
      <path d="M24 15 H19" {...S} /><path d="M21 13 L19 15 L21 17" {...S} />
    </svg>
  );
}

// cut — the 2-cell lifts away (dashed ghost); the boundary stays, the loss logged
export function CutGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <rect x="5" y="13" width="12" height="12" {...S} />
      <rect x="12" y="4" width="12" height="12" {...FAINT} strokeDasharray="2 2" />
      <path d="M11 15 L16 10" {...FAINT} /><path d="M14.4 10.4 L16 10 L15.4 11.6" {...FAINT} />
    </svg>
  );
}

// dualize — vertices ↔ faces: original vertices (filled) swap for dual vertices (rings) at the edge midpoints
export function DualizeGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <rect x="6" y="6" width="18" height="18" {...S} />
      <path d="M15 6 L24 15 L15 24 L6 15 Z" {...BOLD} opacity={0.85} />
      <circle cx="6" cy="6" r="1.6" fill="currentColor" stroke="none" /><circle cx="24" cy="6" r="1.6" fill="currentColor" stroke="none" /><circle cx="6" cy="24" r="1.6" fill="currentColor" stroke="none" /><circle cx="24" cy="24" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="15" cy="6" r="1.7" {...FAINT} /><circle cx="24" cy="15" r="1.7" {...FAINT} /><circle cx="15" cy="24" r="1.7" {...FAINT} /><circle cx="6" cy="15" r="1.7" {...FAINT} />
    </svg>
  );
}

// sew — the general complex identification's BOUNDARY sub-family: the form's
// TWO OWN RIMS (bold) become one seam. The word ops fold a POLYGON's own edges;
// sew acts on a COMPLEX WITH BOUNDARY — hence a tube, not a rect. That contrast
// IS the mark: it is a different KIND of act and it must not look like the five.
// The faint arc is the committed identification idiom (glue's arc: "these two
// become one"). ⛔ NO ARROWS — the group holds BOTH modes; an arrow would depict
// one and lie about the other. The mode is the submenu's to say, not the glyph's.
export function SewGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <path d="M8 8 H22" {...S} />
      <path d="M8 22 H22" {...S} />
      <ellipse cx="8" cy="15" rx="3.4" ry="7" {...BOLD} />
      <ellipse cx="22" cy="15" rx="3.4" ry="7" {...BOLD} />
      <path d="M8 5 Q15 1.5 22 5" {...FAINT} />
    </svg>
  );
}

// fold — H2 THE GENERAL FOLD (the 7th word): the hexagon with PAIRED ARROWED
// EDGES per the designer's plate (H2_AFFORDANCES_DESIGNER.png §1) — the
// letters + arrows ARE the fundamental-polygon word: not a picture OF the
// fold, the fold itself; the person writes the math on the rim. Two pairs
// shown (bold pair · plain pair), each arrowed with a SENSE — unlike sew,
// the arrows here do not pick a mode for the group: the fold's mode lives on
// EACH pair (→→ preserving · →⇄ reversing), which is exactly what paired
// arrows of differing weights depict. Structure faithful; the designer's ink
// craft-pass polishes later (his standing drop-in lane).
export function FoldGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <path d="M15 4 L5.5 9.5 L5.5 20.5 L15 26 L24.5 20.5 L24.5 9.5 Z" {...S} />
      <path d="M24.5 9.5 L15 4" {...BOLD} />
      <path d="M16.5 7.2 L15 4 L18.5 3.7" {...BOLD} />
      <path d="M5.5 20.5 L15 26" {...BOLD} />
      <path d="M13.5 22.9 L15 26 L11.5 26.3" {...BOLD} />
      <path d="M5.5 9.5 V20.5" {...S} />
      <path d="M3.6 18.2 L5.5 20.5 L7.4 18.2" {...S} />
      <path d="M24.5 9.5 V20.5" {...S} />
      <path d="M22.6 18.2 L24.5 20.5 L26.4 18.2" {...S} />
    </svg>
  );
}

// OPEN THE DOOR (2026-07-17): the sew entry closed the six-day black page —
// DOCK_OPERATION_GROUPS grew a sixth group (2026-07-11) and this map never
// learned it; DOCK_GLYPHS[key] rendered undefined and unmounted the app.
// THE UNION (sanctioned frozen edit, SEAL_THE_UNION): DockGroupKey now keys
// BOTH this map and the groups — a missing glyph is a COMPILE error (H2's
// widening to 'fold' proved it live: TS2741 fired on this map until FoldGlyph
// joined it).
export const DOCK_GLYPHS: Record<DockGroupKey, () => JSX.Element> = {
  glue: GlueGlyph,
  'flip-glue': FlipGlueGlyph,
  collapse: CollapseGlyph,
  cut: CutGlyph,
  dualize: DualizeGlyph,
  sew: SewGlyph,
  fold: FoldGlyph,
};

// OperationGlyphs — Manuscript Phase 3a: the STARTER operation-glyph set.
//
// CONTEXT ("the chrome & interaction"): each dock operation is an INFORMATIVE
// GLYPH — a small diagram of the move itself; the text label appears on hover.
// These are the coder's STARTER diagrams (clear, legible, ink-stroke idiom) —
// THE DESIGNER CRAFTS THE FINALS: the whole set lives in this one file, keyed
// by dock-group, drawn in currentColor strokes so the chrome tones them.
// A glyph is a DIAGRAM of the move; the operation it fires is the real
// committed one (writtenFormModel → PlaygroundOperation) — never a stand-in.

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const BOLD = { ...S, strokeWidth: 2.6 };
const FAINT = { ...S, strokeWidth: 1, opacity: 0.55 };

// glue — a square whose opposite edges pair, same sense (parallel ticks + arc)
export function GlueGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <rect x="6" y="8" width="18" height="16" {...S} />
      <path d="M6 10 v12" {...BOLD} />
      <path d="M24 10 v12" {...BOLD} />
      <path d="M8 5 C 12 1.5, 18 1.5, 22 5" {...S} />
      <path d="M22 5 l-2.6 -0.4 M22 5 l-0.6 -2.6" {...S} />
      <path d="M4.5 14 l3 2 -3 2 M25.5 14 l-3 2 3 2" {...FAINT} />
    </svg>
  );
}

// flip-glue — the same pairing but REVERSED: the arc crosses itself (the twist)
export function FlipGlueGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <rect x="6" y="8" width="18" height="16" {...S} />
      <path d="M6 10 v12" {...BOLD} />
      <path d="M24 10 v12" {...BOLD} />
      <path d="M8 5 C 14 0.5, 16 7, 22 3.5" {...S} />
      <path d="M22 3.5 l-2.7 0.2 M22 3.5 l-1.2 -2.3" {...S} />
      <path d="M4.5 14 l3 2 -3 2 M25.5 18 l-3 -2 3 -2" {...FAINT} />
    </svg>
  );
}

// collapse — the whole boundary drawn into one apex point
export function CollapseGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <circle cx="15" cy="15" r="10" strokeDasharray="2.6 2.6" {...S} />
      <circle cx="15" cy="15" r="1.9" fill="currentColor" stroke="none" />
      <path d="M15 6.5 v4 M15 23.5 v-4 M6.5 15 h4 M23.5 15 h-4" {...S} />
      <path d="M15 10.5 l-1.4 -1.8 M15 10.5 l1.4 -1.8" {...FAINT} />
    </svg>
  );
}

// cut — the 2-cell removed: the face lifts away along the dashed cut
export function CutGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <rect x="5" y="10" width="14" height="14" {...S} />
      <path d="M5 10 L19 24" strokeDasharray="2.2 2.2" {...S} />
      <path d="M14 4 l8 0 0 8" {...FAINT} />
      <path d="M12 6.5 l8 0 0 8 -3.5 0" {...FAINT} strokeDasharray="2 2" />
      <path d="M21 4.5 l3 -3" {...S} />
      <path d="M24 1.5 l-1 2.6 M24 1.5 l-2.6 1" {...S} />
    </svg>
  );
}

// dualize — vertices ↔ faces: the inner diamond meets the square at midpoints
export function DualizeGlyph() {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden>
      <rect x="6" y="6" width="18" height="18" {...S} />
      <path d="M15 6 L24 15 L15 24 L6 15 Z" {...BOLD} opacity={0.85} />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="24" cy="6" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="6" cy="24" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="24" cy="24" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="15" r="1.5" {...FAINT} />
    </svg>
  );
}

export const DOCK_GLYPHS: Record<string, () => JSX.Element> = {
  glue: GlueGlyph,
  'flip-glue': FlipGlueGlyph,
  collapse: CollapseGlyph,
  cut: CutGlyph,
  dualize: DualizeGlyph,
};

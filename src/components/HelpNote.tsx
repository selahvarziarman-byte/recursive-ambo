// ═══ HELP, TWO PLACES ONLY — LAYOUT-1 §6 (STAMP LAYOUT-1, 2026-09-29; the designer's spec, Arman's word 19:51: two ?s):
// no instruction sits on the page. How to do something shows in a ? note and in a hint, nowhere else.
//
//   THE ?      a small circled question mark at the top of an area. Clicking it opens a short note beside it — a short list,
//              one gesture per line, the spec's words verbatim. Clicking elsewhere, pressing Esc or clicking the ? again
//              closes it. One note is open at a time (the two areas that get one — the solid and the pairing — are never
//              on screen together, so each holds its own state). The ? sign is used for nothing else.
//   A HINT     one short line that shows near something after the pointer rests on it for a moment; it goes when the
//              pointer leaves or clicks. Keyboard focus shows the same line. Only where §6's table lists one.
// Hovering only lights things up: a hint never picks anything, and nothing moves or changes size under the pointer (the
// hint is positioned absolutely, over the page, never in the flow).

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

/** the ? and its note: `lines` are the note's lines, one gesture each, printed as given */
export function HelpNote({ area, lines, className = '' }: { area: string; lines: string[]; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);
  const id = useId();
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent): void => { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); } };
    const onClick = (e: MouseEvent): void => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    // Esc closes the smallest thing first (LAYOUT-1 §2): the note's listener runs in the capture phase, before the view's
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('mousedown', onClick);
    return () => { window.removeEventListener('keydown', onKey, true); window.removeEventListener('mousedown', onClick); };
  }, [open]);
  return (
    <span ref={ref} data-help={area} data-help-open={open ? 'true' : undefined} className={`relative inline-block ${className}`}>
      <button
        type="button"
        aria-label="?"
        aria-expanded={open}
        aria-controls={id}
        data-help-button={area}
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] leading-none transition focus:outline-none focus:ring-1 focus:ring-amber-300 ${open ? 'border-amber-300 text-amber-200' : 'border-stone-600 text-stone-400 hover:border-stone-300 hover:text-stone-100'}`}
      >
        ?
      </button>
      {open ? (
        <span id={id} role="note" data-help-note={area} className="absolute left-0 top-5 z-30 block w-max max-w-[26rem] whitespace-pre rounded border border-stone-700 bg-stone-950/95 px-2 py-1 text-xs leading-5 text-stone-200 shadow-lg">
          {lines.join('\n')}
        </span>
      ) : null}
    </span>
  );
}

/** a hint on the thing it wraps: shows after the pointer rests (or on keyboard focus), goes on leave, blur or click */
export function Hint({ text, children, className = '', delay = 450, placement = 'below' }: { text: string; children: ReactNode; className?: string; delay?: number; placement?: 'below' | 'left' }) {
  const [shown, setShown] = useState(false);
  const timer = useRef<number | null>(null);
  const arm = (): void => { if (timer.current !== null) window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setShown(true), delay); };
  const disarm = (): void => { if (timer.current !== null) { window.clearTimeout(timer.current); timer.current = null; } setShown(false); };
  useEffect(() => () => { if (timer.current !== null) window.clearTimeout(timer.current); }, []);
  return (
    <span
      data-hint={text}
      data-hint-shown={shown ? 'true' : undefined}
      className={`relative inline-block ${className}`}
      onPointerEnter={arm}
      onPointerLeave={disarm}
      onPointerDown={disarm}
      onFocusCapture={() => setShown(true)}
      onBlurCapture={disarm}
    >
      {children}
      {shown ? <span role="tooltip" data-hint-line="true" className={`pointer-events-none absolute z-30 block w-max max-w-[22rem] rounded border border-stone-700 bg-stone-950/95 px-2 py-0.5 text-xs text-stone-200 shadow-lg ${placement === 'left' ? 'right-full top-0 mr-1' : 'left-0 top-full mt-1'}`}>{text}</span> : null}
    </span>
  );
}

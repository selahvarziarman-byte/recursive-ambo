/**
 * THE ZOOM FRAME — STAMP ZOOM (the mothership's letter of 2026-10-19 10:23, on Arman's word Δ169: "one needs never sees it in its whole if it's big.
 * we need to address that. is it possible to have zoom out zoom in on the diagrams as well?"). Every diagram a person opens is seen whole, and zoomed in
 * and out, in ONE form — the form slice 2's H gave the point's cast (`8e1b484`): `whole · zoom in · zoom out` over the drawing's box.
 *
 * WHOLE IS A STATE (the designer's look of 10-19 11:59, her rider on the coder's §4): while the drawing is whole — as it opens, and after he presses
 * `whole` — it STAYS whole: when the drawing changes size (a light opened or closed, a role added or withdrawn) or its box changes size, it fits again.
 * Once he zooms (`zoom in`, `zoom out`, ctrl + wheel, a pinch) it keeps HIS scale through every such change, until he presses `whole`; zooming out to
 * the floor — the fit — is whole again, so the mark and the state agree. The state is the store's one slot (`zoomScales`, keyed by the diagram's name
 * and its site): no entry = whole; a number = his scale. A view, never a record: a reload, a new seed, an import forget it. The fit is the box over the
 * drawing both ways, never above natural size; the wheel alone scrolls, as everywhere; once zoomed past the box a drag pans it, and a drag never picks:
 * the click that ends a drag is stopped here, in the capture phase, before any drawing's own handler sees it — the one guard for every diagram.
 *
 * ONE MECHANISM FOR EVERY DIAGRAM, BY CONSTRUCTION: the drawing is handed its scale and draws at `natural × scale` with its natural viewBox, so nothing
 * inside it moves relative to anything else. The frame's marks carry the diagram's NAME — `data-<name>-box` (the scrolling box), `data-<name>-bar` (the row),
 * `data-<name>-zoom-bar`, `data-<name>-zoom="whole" | "in" | "out"`, `data-<name>-zoom-on` (the control, in the whole state) — and every frame
 * `data-zoom-frame="<name>"` with `data-zoom-frame-id`, so a census can find them all. The point's cast keeps the marks H gave it (`midpoint-child`); the
 * midpoint drawing is `midpoint-drawing`; a corner's drawing over the solid is `inside`.
 *
 * The box's cap is the diagram's to give, one of two ways: `maxHeight` caps the box itself (the point's cast: 46% of the window's height, H, measured);
 * `frameMaxHeight` caps the bar AND the box together (the midpoint drawing: its region's share, measured by the surface) — the box takes what the bar leaves.
 */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useGeometryStore } from '../store/geometryStore';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** the zoom's ceiling (H's) */
export const MAX_SCALE = 2;
/** the zoom's fit: the whole drawing in its box, never above natural size (the box's border out: 2) */
export const wholeScaleOf = (boxW: number, boxH: number, width: number, height: number): number => Math.min(1, (boxW - 2) / width, (boxH - 2) / height);
/** the view's key: the diagram's name and its site, so another site never inherits a zoom */
export const zoomKeyOf = (name: string, id: string): string => `${name}|${id}`;
/** the grid's gap between the bar and the box (gap-1) */
const GAP = 4;

export function ZoomFrame({ name, id, width, height, maxHeight, frameMaxHeight, fixedWidth, children }: {
  /** the diagram's name — its marks' family (`data-<name>-…`) and the view's key */
  name: string;
  /** which one: the site, the corner */
  id: string;
  /** the drawing's natural size (its viewBox) */
  width: number;
  height: number;
  /** the box's own cap (H's way); none: the box takes the drawing's natural height */
  maxHeight?: number | string;
  /** a cap on the bar and the box together, measured by the parent (null: none yet, or none at all) — the box takes what the bar leaves */
  frameMaxHeight?: number | null;
  /** in a panel that fits its content the box states its own width (the drawing's natural width, capped at the panel's) — else its fit would narrow
   *  the panel that narrows its fit */
  fixedWidth?: boolean;
  /** the drawing, handed its scale: drawn at `width × scale` by `height × scale` with the natural viewBox */
  children: (scale: number) => ReactNode;
}) {
  // subscribed with the hook (the page re-renders on each act), read through `getState()`: under node's render a hook reads the store's INITIAL
  // snapshot, so a witness setting a scale must see the live state (the rule MediumBlock and ChildCast read by)
  useGeometryStore((s) => s.zoomScales);
  const key = zoomKeyOf(name, id);
  const { zoomScales, setZoomScale } = useGeometryStore.getState();
  /** his scale, or undefined: the whole state */
  const held: number | undefined = zoomScales[key];

  const boxRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  /** the box's size, its border out and its scrollbars IN: a fit taken while zoomed (scrollbars showing) must be the fit with none (H measured: 0.90 for
   *  0.93); null while the diagram is hidden — a box not shown measures 0 × 0, and a fit taken then would be negative */
  const boxSizeOf = (el: HTMLDivElement): { w: number; h: number } | null => (el.offsetWidth === 0 || el.offsetHeight === 0 ? null : { w: el.offsetWidth - 2, h: el.offsetHeight - 2 });
  useIsoLayoutEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const measure = (): void => {
      // the frame's cap, when the parent gives one: the box takes what the bar leaves (set before the box is read, so the read sees it)
      if (frameMaxHeight !== undefined) el.style.maxHeight = frameMaxHeight === null ? '' : `${Math.max(0, frameMaxHeight - (barRef.current ? barRef.current.offsetHeight : 0) - GAP)}px`;
      const size = boxSizeOf(el);
      if (!size) return;
      setBox((prev) => (prev && prev.w === size.w && prev.h === size.h ? prev : size));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [frameMaxHeight]);
  // the fit, live: the box as it stands over the drawing as it stands — in the whole state this IS the scale, so a light opened, a role added or a box
  // grown re-fits by itself; once he has zoomed, his scale stands and the fit only bounds `zoom out`
  const whole = box ? wholeScaleOf(box.w, box.h, width, height) : 1;
  const scale = held ?? whole;
  const atWhole = held === undefined;
  const atLeast = scale <= whole + 0.001; // nothing to zoom out to: at whole, or below it (whole grew when the drawing got shorter — `zoom out` must never enlarge)
  const pending = useRef<{ ux: number; uy: number; px: number; py: number } | null>(null);
  const zoomTo = (next: number, px?: number, py?: number): void => {
    const el = boxRef.current;
    const s = Math.max(Math.min(whole, scale), Math.min(MAX_SCALE, next));
    if (el) {
      const x = px ?? el.clientWidth / 2;
      const y = py ?? el.clientHeight / 2;
      pending.current = { ux: (el.scrollLeft + x) / scale, uy: (el.scrollTop + y) / scale, px: x, py: y };
    }
    setZoomScale(key, s <= whole + 0.001 ? null : s); // zoomed out to the floor is whole again: the mark and the state agree
  };
  useIsoLayoutEffect(() => {
    const el = boxRef.current;
    const p = pending.current;
    if (!el || !p) return;
    pending.current = null;
    el.scrollLeft = p.ux * scale - p.px;
    el.scrollTop = p.uy * scale - p.py;
  }, [scale]);
  // ctrl + wheel (a trackpad's pinch) zooms at the pointer; the wheel alone scrolls, as everywhere — a listener that may prevent the page's own zoom
  const zoomRef = useRef(zoomTo);
  zoomRef.current = zoomTo;
  const scaleRef = useRef(scale);
  scaleRef.current = scale;
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const onWheel = (ev: WheelEvent): void => {
      if (!ev.ctrlKey) return;
      ev.preventDefault();
      const r = el.getBoundingClientRect();
      zoomRef.current(scaleRef.current * (ev.deltaY < 0 ? 1.12 : 1 / 1.12), ev.clientX - r.left, ev.clientY - r.top);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);
  // once zoomed past the box, a drag moves the drawing; a click without a drag still picks — and the click that ends a drag is stopped before the drawing sees it
  const drag = useRef<{ x: number; y: number; l: number; t: number; moved: boolean } | null>(null);
  const dragged = useRef(false);
  const [grabbing, setGrabbing] = useState(false);
  const scrollable = (el: HTMLDivElement): boolean => el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1;
  const zoomedPast = !!box && (width * scale > box.w + 1 || height * scale > box.h + 1); // the drawing larger than its box: a drag pans
  useEffect(() => {
    const move = (ev: MouseEvent): void => {
      const d = drag.current;
      const el = boxRef.current;
      if (!d || !el) return;
      const dx = ev.clientX - d.x;
      const dy = ev.clientY - d.y;
      if (!d.moved && Math.hypot(dx, dy) > 4) { d.moved = true; setGrabbing(true); }
      if (d.moved) { el.scrollLeft = d.l - dx; el.scrollTop = d.t - dy; }
    };
    const up = (): void => {
      const d = drag.current;
      if (!d) return;
      dragged.current = d.moved;
      drag.current = null;
      setGrabbing(false);
      setTimeout(() => { dragged.current = false; }, 0);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, []);
  const mark = (suffix: string, value: string | true | undefined): Record<string, string | undefined> => ({ [`data-${name}-${suffix}`]: value === true ? 'true' : value });

  return (
    <div data-zoom-frame={name} data-zoom-frame-id={id} className="grid min-w-0 gap-1">
      <div ref={barRef} {...mark('bar', true)} className="flex shrink-0 items-baseline justify-end gap-2 border-t border-stone-800 pt-1 text-stone-400">
        <span {...mark('zoom-bar', true)} className="whitespace-nowrap">
          <button type="button" {...mark('zoom', 'whole')} {...mark('zoom-on', atWhole ? true : undefined)} className={atWhole ? 'underline decoration-2 text-stone-100' : 'underline hover:text-stone-100'} onClick={() => setZoomScale(key, null)}>whole</button>
          {' · '}
          <button type="button" {...mark('zoom', 'in')} className="underline hover:text-stone-100" onClick={() => zoomTo(scale * 1.25)}>zoom in</button>
          {' · '}
          <button type="button" {...mark('zoom', 'out')} disabled={atLeast} className={atLeast ? 'cursor-default text-stone-400' : 'underline hover:text-stone-100'} onClick={() => zoomTo(scale * 0.8)}>zoom out</button>
        </span>
      </div>
      <div
        ref={boxRef}
        {...mark('box', true)}
        style={{ height: Math.round(height) + 4, maxHeight, ...(fixedWidth ? { width: Math.round(width) + 4, maxWidth: '100%' } : {}) }}
        className={`relative overflow-auto rounded border border-stone-800 bg-stone-950/60 ${grabbing ? 'cursor-grabbing' : zoomedPast ? 'cursor-grab' : ''}`}
        onMouseDown={(ev) => { const el = boxRef.current; if (!el || !scrollable(el)) return; drag.current = { x: ev.clientX, y: ev.clientY, l: el.scrollLeft, t: el.scrollTop, moved: false }; dragged.current = false; }}
        onClickCapture={(ev) => { if (dragged.current) { ev.stopPropagation(); ev.preventDefault(); } }}
      >
        {children(scale)}
      </div>
    </div>
  );
}

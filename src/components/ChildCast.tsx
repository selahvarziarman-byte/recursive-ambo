/**
 * STAMP THE-FINDINGS-BATCH · slice 2 (Arman's 11:00; the mothership's 11:06; the form Arman approved at 10:55 — the designer's 10:56 letter and her mock
 * `.handoff/DESIGN_THE-CHILDS-CAST/index.html`) — THE CHILD'S CAST in the point tab: the concept's drawing, one row per role, and the card of the role
 * chosen there.
 *
 * A · THE NAME AND THE CARD (ADR 0031 §9.38 (c) with its guard; claims §345, §352). A row reads the role's name where he gave one, with its sentence
 * always under it, or the sentence alone. Choosing a row opens its card below: the name or `name it` (the field opens empty; `rename` opens it with the
 * name, selected whole), the guard's refusal where the act was made (`not taken — "<name>" already names (<sentence>)`, nothing recorded, the field
 * keeping what he typed until he changes it), then the role's qualities, each named by its corner. The name is his act through the store
 * (`nameRole` · `withdrawRoleName`, logged, riding the file) and designates only.
 * H · THE ZOOM on the drawing: `whole · zoom in · zoom out`. The box takes the drawing's height up to 46% of the window's (the point tab's head
 * already stands above it, measured at 1689 × 897: a box of 46% of what was left fitted Culture at 0.51, too small to read). It opens whole (the
 * drawing fitted to its box, never above its natural size); ctrl + wheel
 * (a trackpad's pinch) zooms at the pointer; once zoomed past the box a drag moves it; a click without a drag still chooses. The scale is the page's
 * view (`childView`, keyed by the site): taken once when the box is first measured, it never changes by itself — only his `whole`, `zoom in`,
 * `zoom out` or wheel move it.
 * The child's relations (its filled loops, ADR 0031 §9.40–§9.42) are drawn by the slices that follow (B–E); D4's pulled-back record is READ, never drawn
 * here (the approved form draws none of it).
 */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Shape, VertexId } from '../types/geometry';
import { useGeometryStore } from '../store/geometryStore';
import { childSpaceOf, termWordsOf, wordWordsOf } from '../lib/instanceSpace';
import { edgeBetween } from '../lib/faceReading';

/** the child as its one reader hands it (`childSpaceOf`) — typed by that reader, never by the cast's own type (the concept-type census: the resolver
 *  and the child's reader are the readers of a cast; this file only draws what they hand it) */
type ChildSpace = NonNullable<ReturnType<typeof childSpaceOf>>;

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** the drawing's measures (the mock's): the points' column sits right of the band the child's relations will be drawn in; a named row is taller (its sentence under it) */
const DOT = 150;
const PITCH = 22;
const NAMED = 36;
const TOP = 14;
const MAX_SCALE = 2;

export interface ChildRow {
  key: string; // the role's key — the relating it is (`instanceKey`)
  sentence: string; // its sentence, through the one reader of a term's words (`(the price is the case as the instituted)`)
  name: string | null; // his name for it, a true absence until he gives one
  top: number;
  y: number; // the point's centre
  h: number;
}

/** the rows, laid out from the child's roles in their order (the edge's), and the drawing's natural size — one reader for the drawing and the zoom's fit */
export function childRowsOf(shape: Shape, siteId: VertexId, child: ChildSpace, nameOf: (key: string) => string | null): { rows: ChildRow[]; width: number; height: number } {
  let y = TOP;
  let widest = 0;
  const rows = child.roles.map((r) => {
    const name = nameOf(r.id);
    const sentence = termWordsOf(shape, siteId, r.id);
    const h = name ? NAMED : PITCH;
    const row: ChildRow = { key: r.id, sentence, name, top: y, y: y + 8, h };
    widest = Math.max(widest, 6.4 * sentence.length, name ? 7.4 * name.length : 0);
    y += h;
    return row;
  });
  return { rows, width: Math.ceil(DOT + 12 + widest + 16), height: y + TOP };
}

const bornOf = (shape: Shape, v: VertexId): boolean => { const x = shape.vertices[v]; return !!x && x.createdBy.operation !== 'seed' && x.createdBy.sourceVertexIds.length === 2; };
/** a key that names a relating's MODE — the role's own (`mode`), or, through a born corner (whose roles are relatings), that relating's mode pulled back
 *  (`A:mode`, `A:A:mode` …); a seed's quality that happens to be called `mode` is a quality and stays */
function isModeKey(shape: Shape, corner: VertexId, key: string): boolean {
  if (key === 'mode') return true;
  const m = /^([AB]):(.*)$/.exec(key);
  if (!m || !bornOf(shape, corner)) return false;
  const [p, q] = shape.vertices[corner].createdBy.sourceVertexIds as [VertexId, VertexId];
  const e = edgeBetween(shape.edges, p, q);
  const [e0, e1] = e ? (e.vertexIds as [VertexId, VertexId]) : [p, q];
  const side = m[1] === 'A' ? e0 : e1;
  if (m[2] === 'mode') return bornOf(shape, side);
  return /^[AB]:/.test(m[2]) ? isModeKey(shape, side, m[2]) : false;
}
/** A · THE ROLE'S QUALITIES, each named by its corner through the child's one reader of its word keys (`wordWordsOf`: `A:exists in time` → `Value's exists
 *  in time`; at generation ≥ 2 `A:A:sustains` → `A's sustains through AB`, never `AB's A:sustains`), the relatings' modes left off at every depth (the
 *  sentence already says them) */
export const qualitiesOf = (shape: Shape, siteId: VertexId, types: Record<string, string>): Array<[string, string]> =>
  Object.entries(types).filter(([k]) => !isModeKey(shape, siteId, k)).map(([k, v]) => [wordWordsOf(shape, siteId, k), v]);

/** the zoom's fit: the whole drawing in its box, never above natural size */
export const wholeScaleOf = (boxW: number, boxH: number, width: number, height: number): number => Math.min(1, (boxW - 2) / width, (boxH - 2) / height);

export function ChildCast({ shape, siteId, child, litOf, onHoverRow }: {
  shape: Shape;
  siteId: VertexId;
  child: ChildSpace;
  /** LAYOUT-1 §5's hover across the drawings: whether a row is lit, or dimmed, while something is hovered */
  litOf: (sentence: string) => { lit: boolean; dim: boolean };
  onHoverRow: (sentence: string | null) => void;
}) {
  // subscribed with the hook (the page re-renders on each act), read through `getState()`: under node's render a hook reads the store's INITIAL
  // snapshot, so a witness setting a name, a refusal or a view must see the live state (MediumBlock's rule for the lexicon and the rules)
  useGeometryStore((s) => s.roleNames);
  useGeometryStore((s) => s.roleNameRefusal);
  useGeometryStore((s) => s.childView);
  const { roleNames, roleNameRefusal: refusalHeld, childView: viewHeld, nameRole, withdrawRoleName, clearRoleNameRefusal, setChildView } = useGeometryStore.getState();
  const view = viewHeld && viewHeld.siteId === siteId ? viewHeld : { siteId, key: null, scale: null };
  // names are kept per shape, as the relatings they name are: this shape's record, at this site
  const nameOf = (key: string): string | null => roleNames.find(([sh, s, k]) => sh === shape.id && s === siteId && k === key)?.[3] ?? null;
  const { rows, width, height } = childRowsOf(shape, siteId, child, nameOf);
  const chosen = view.key !== null ? rows.find((r) => r.key === view.key) ?? null : null;

  // ── H · the zoom ──
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  useIsoLayoutEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    // the box's own size, its border out and its scrollbars IN: a fit taken while zoomed (scrollbars showing) must be the fit with none (measured: 0.90 for 0.93)
    // never while the tab is hidden: a box not shown measures 0 × 0, and a fit taken then would be negative and kept (the review's finding, 12:2x)
    const measure = (): void => { if (el.offsetWidth === 0 || el.offsetHeight === 0) return; const w = el.offsetWidth - 2; const h = el.offsetHeight - 2; setBox((prev) => (prev && prev.w === w && prev.h === h ? prev : { w, h })); };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const whole = box ? wholeScaleOf(box.w, box.h, width, height) : 1;
  // it opens whole: the fit is taken into the view once, when the box is first measured — after that only his acts move it
  useEffect(() => {
    if (box && view.scale === null) setChildView({ siteId, key: view.key, scale: whole });
  }, [box, view.scale, view.key, siteId, whole, setChildView]);
  const scale = view.scale ?? whole;
  const atWhole = Math.abs(scale - whole) < 0.001;
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
    setChildView({ siteId, key: view.key, scale: s });
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
  // once zoomed past the box, a drag moves the drawing; a click without a drag still chooses
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

  // ── A · the card's field: opens empty for a role never named; `rename` opens it with the name, selected whole ──
  // the refusal stands only while its holder still holds the name it cites (a holder's relating withdrawn takes the name, and the refusal with it)
  const refusal = refusalHeld && refusalHeld.siteId === siteId && chosen && refusalHeld.key === chosen.key && roleNames.some(([sh, s, k, n]) => sh === shape.id && s === siteId && k === refusalHeld.holder && n === refusalHeld.name) ? refusalHeld : null;
  const [renaming, setRenaming] = useState<string | null>(null); // the key whose name is being changed
  const [draft, setDraft] = useState<string>(refusal?.name ?? '');
  const choose = (key: string): void => {
    if (dragged.current) return;
    setRenaming(null);
    setDraft('');
    clearRoleNameRefusal();
    setChildView({ siteId, key: view.key === key ? null : key, scale: view.scale });
  };
  const chosenKey = chosen ? chosen.key : null;
  const chosenName = chosen ? chosen.name : null;
  useEffect(() => {
    if (chosenKey === null || chosenName === null) setRenaming(null);
    if (chosenKey === null) setDraft('');
  }, [chosenKey, chosenName]);
  const give = (): void => {
    if (!chosen) return;
    if (nameRole(siteId, chosen.key, draft) === null) { setRenaming(null); setDraft(''); }
  };
  // the card opens below the drawing: choosing a role brings it into view where the panel would hide it (the drawing's scale is untouched)
  const cardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (view.key !== null && cardRef.current && typeof cardRef.current.scrollIntoView === 'function') cardRef.current.scrollIntoView({ block: 'nearest' });
  }, [view.key]);
  const qualities = chosen ? qualitiesOf(shape, siteId, child.roles.find((r) => r.id === chosen.key)?.types ?? {}) : [];
  const fieldOpen = chosen !== null && (chosen.name === null || renaming === chosen.key);
  const offerOf = (key: string) => (ev: { key: string; preventDefault: () => void }): void => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); choose(key); } };

  return (
    <div data-midpoint-own="glued" data-midpoint-child-cast={siteId} className="grid gap-1">
      <div data-midpoint-child-bar="true" className="flex shrink-0 items-baseline justify-end gap-2 border-t border-stone-800 pt-1 text-stone-400">
        <span data-midpoint-child-zoom-bar="true" className="whitespace-nowrap">
          <button type="button" data-midpoint-child-zoom="whole" data-midpoint-child-zoom-on={atWhole ? 'true' : undefined} className={atWhole ? 'underline decoration-2 text-stone-100' : 'underline hover:text-stone-100'} onClick={() => setChildView({ siteId, key: view.key, scale: whole })}>whole</button>
          {' · '}
          <button type="button" data-midpoint-child-zoom="in" className="underline hover:text-stone-100" onClick={() => zoomTo(scale * 1.25)}>zoom in</button>
          {' · '}
          <button type="button" data-midpoint-child-zoom="out" disabled={atLeast} className={atLeast ? 'text-stone-600' : 'underline hover:text-stone-100'} onClick={() => zoomTo(scale * 0.8)}>zoom out</button>
        </span>
      </div>
      <div
        ref={boxRef}
        data-midpoint-child-box="true"
        style={{ height: height + 4, maxHeight: '46vh' }}
        className={`relative overflow-auto rounded border border-stone-800 bg-stone-950/60 ${grabbing ? 'cursor-grabbing' : zoomedPast ? 'cursor-grab' : ''}`}
        onMouseDown={(ev) => { const el = boxRef.current; if (!el || !scrollable(el)) return; drag.current = { x: ev.clientX, y: ev.clientY, l: el.scrollLeft, t: el.scrollTop, moved: false }; dragged.current = false; }}
      >
        <svg data-midpoint-own-drawing="true" data-midpoint-child-scale={scale.toFixed(3)} width={Math.round(width * scale)} height={Math.round(height * scale)} viewBox={`0 0 ${width} ${height}`} className="block">
          {rows.map((r) => {
            const on = chosen?.key === r.key;
            const { lit, dim } = litOf(r.sentence);
            return (
              <g
                key={r.key}
                data-midpoint-child-row={r.key}
                data-midpoint-child-point={r.sentence}
                data-midpoint-child-chosen={on ? 'true' : undefined}
                data-midpoint-child-named={r.name ? 'true' : undefined}
                className="cursor-pointer focus:outline-none"
                role="button"
                tabIndex={0}
                aria-label={r.name ? `${r.name} ${r.sentence}` : r.sentence}
                aria-pressed={on}
                opacity={dim && !on ? 0.25 : undefined}
                onClick={() => choose(r.key)}
                onKeyDown={offerOf(r.key)}
                onPointerEnter={() => onHoverRow(r.sentence)}
                onPointerLeave={() => onHoverRow(null)}
              >
                <rect x={DOT - 8} y={r.top + 1} width={width - DOT + 4} height={r.h - 2} rx={3} fill={on ? '#292524' : 'transparent'} stroke={on ? '#fcd34d' : 'transparent'} />
                <circle cx={DOT} cy={r.y} r={on ? 4 : 3} className={on ? 'fill-amber-300' : lit ? 'fill-stone-50' : 'fill-stone-500'} />
                {r.name ? (
                  <>
                    <text data-midpoint-child-name={r.name} x={DOT + 12} y={r.y + 4} fontSize={12.5} fontWeight={600} className="fill-amber-100 font-serif">{r.name}</text>
                    <text data-midpoint-child-sentence="true" x={DOT + 12} y={r.y + 18} fontSize={11} className="fill-stone-500">{r.sentence}</text>
                  </>
                ) : (
                  <text data-midpoint-child-sentence="true" x={DOT + 12} y={r.y + 4} fontSize={12} className={on || lit ? 'fill-stone-100' : 'fill-stone-300'}>{r.sentence}</text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div ref={cardRef} data-midpoint-child-card={chosen ? chosen.key : 'none'} className="pt-1">
        {chosen === null ? (
          <span data-midpoint-child-card-hint="true" className="text-stone-400">choose a role: its card opens below</span>
        ) : (
          <div className="grid gap-1">
            {chosen.name ? (
              <>
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span data-midpoint-child-card-name={chosen.name} className="font-serif text-[13px] font-semibold text-amber-100">{chosen.name}</span>
                  <span className="text-stone-400">·</span>
                  <button type="button" data-midpoint-child-rename="true" className="underline text-stone-300" onClick={() => { setRenaming(chosen.key); setDraft(chosen.name ?? ''); clearRoleNameRefusal(); }}>rename</button>
                  <span className="text-stone-400">·</span>
                  <button type="button" data-midpoint-child-withdraw-name="true" className="underline text-stone-300" onClick={() => { setRenaming(null); setDraft(''); withdrawRoleName(siteId, chosen.key); }}>withdraw</button>
                </span>
                <span data-midpoint-child-card-sentence="true" className="text-stone-300">{chosen.sentence}</span>
              </>
            ) : (
              <span data-midpoint-child-card-sentence="true" className="text-stone-100">{chosen.sentence}</span>
            )}
            {fieldOpen ? (
              <span className="flex items-center gap-2" data-midpoint-child-name-field="true">
                <input
                  data-midpoint-child-name-input="true"
                  aria-label={`a name for ${chosen.sentence}`}
                  value={draft}
                  autoFocus={renaming === chosen.key}
                  onFocus={(e) => { if (renaming === chosen.key) e.currentTarget.select(); }}
                  onChange={(e) => { setDraft(e.target.value); clearRoleNameRefusal(); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') give(); }}
                  autoComplete="off"
                  className="w-40 rounded border border-stone-600 bg-stone-900 px-1 py-0.5 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-300"
                />
                <button type="button" data-midpoint-child-name-it="true" className="underline text-amber-200" onClick={give}>name it</button>
              </span>
            ) : null}
            {refusal ? (
              // the guard (§9.38 (c)): the role holding the name is said by its sentence — its name is the very word in question; no button: that role stands in the drawing with its card's `withdraw`
              <span data-midpoint-child-name-refusal={refusal.holder} className="text-rose-200">{`not taken — "${refusal.name}" already names ${refusal.sentence}`}</span>
            ) : null}
            {qualities.length ? (
              <span data-midpoint-child-qualities="true" className="text-stone-400">{qualities.map(([k, v]) => `${k}: ${v}`).join(' · ')}</span>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

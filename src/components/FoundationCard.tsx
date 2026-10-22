// THE CARD BESIDE A MOMENT — Δ226 (Arman's "good. proceed"; the designer's 15:41: "A card beside the moment reads the wires, which carry no words … Nothing is
// written into the drawing"). Its lines are ADR 0031 §9.73 (5) in the designer's words: her 13:42 §1 for a moment of a cast (the direct dependence tuples, then one
// `through X:` line per moment reached through another, a denial struck where it stands, the dependents muted) and her 13:50 for a relating — a moment of the child —
// under Δ163 (the mothership's 13:48: a foundation shows as the parent's; `crossed as …` where he related it at this edge, `barred: …` where he barred it; NOTHING where
// he said nothing; the count counts the crossed and prints no zero). The same card at the lone drawing, at the edge's drawing (a hover card: its items show whole) and
// at the child's own card (pressable: `show`). The reader is `foundationOf` (src/lib/foundation.ts); nothing here derives.
import { useEffect, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import type { DependenceTuple } from '../lib/castInside';
import { foundationItemsOf, foundationOf, groupedItems, type FoundationGroup, type FoundationItem } from '../lib/foundation';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** a denial's word struck — one glyph for a denied dependence wherever a card writes one (the drawing's dashed wire is the same fact) */
const struck = (on: boolean): Record<string, unknown> => (on ? { style: { textDecoration: 'line-through' as const }, 'data-dependence-denied': 'true' } : {});
function Group({ g, nameOf }: { g: FoundationGroup; nameOf: (id: string) => string }): ReactElement {
  // ⟨G3⟩: a coordinate leg has no word (D14) — the tower's `cannot be without: the advance (Finance) · the capacity (Production)` (the designer's 16:48)
  return <span {...struck(!g.holds)}>{g.word ? `${g.word} ${g.to.map(nameOf).join(', ')}` : g.to.map(nameOf).join(' · ')}</span>;
}
function Groups({ items, nameOf }: { items: readonly FoundationItem[]; nameOf: (id: string) => string }): ReactElement {
  return <>{groupedItems(items).map((g, i) => <span key={`${g.word}|${g.holds}|${i}`}>{i ? <span className="text-stone-500">{' · '}</span> : null}<Group g={g} nameOf={nameOf} /></span>)}</>;
}

/** THE MOMENT CARD (the designer's 13:42 §1): the head; `cannot be without: …`; one `through X:` line per moment reached through another, nearest first; `what cannot
 *  be without it: …` muted. Nothing (null) for a moment with no dependence either way — the card reads the wires, and there are none */
export function momentCardOf({ head, tuples, id, nameOf, nameFrom }: { head: string; tuples: readonly DependenceTuple[]; id: string; nameOf: (id: string) => string; nameFrom?: (via: string, key: string) => string }): ReactElement | null {
  const r = foundationOf(tuples, id);
  if (r.direct.length === 0 && r.dependents.length === 0) return null;
  return (
    <div data-dependence-card="moment" data-dependence-card-of={id} data-dependence-rests={String(r.rests.length)} className="grid gap-0.5">
      <span data-dependence-card-head="true" className="text-stone-100">{head}</span>
      {r.direct.length ? <span data-dependence-card-line="direct" className="text-stone-300">{'cannot be without: '}<Groups items={r.direct} nameOf={nameOf} /></span> : null}
      {r.through.map((t) => (
        <span key={t.via} data-dependence-card-line="through" data-dependence-through={t.via} className="text-stone-300">{`through ${nameOf(t.via)}: `}<Groups items={t.items} nameOf={nameFrom ? (k) => nameFrom(t.via, k) : nameOf} /></span>
      ))}
      {r.dependents.length ? (
        <span data-dependence-card-line="dependents" className="text-stone-400">
          {'what cannot be without it: '}
          {r.dependents.map((d, i) => <span key={`${d.from}|${d.word}|${i}`}>{i ? ' · ' : ''}<span {...struck(!d.holds)}>{d.word ? `${nameOf(d.from)} ${d.word} it` : `${nameOf(d.from)} stands on it`}</span></span>)}
        </span>
      ) : null}
    </div>
  );
}

/** one parent's end of a relating: the parent's label, its cast's tuples, the moment, its names — and what he did at THIS edge on a foundation: the relatings that cross
 *  it (the page's words for a relating) and the bars he set on it (the page's words for a bar) */
export interface ParentEnd { label: string; tuples: readonly DependenceTuple[]; id: string; nameOf: (id: string) => string; nameFrom?: (via: string, key: string) => string; crossed: (foundation: string) => ReactNode[]; barred: (foundation: string) => ReactNode[] }

/** THE RELATING CARD (the designer's 13:50): the head (where the card has one), `stands on x (A) and y (B)` muted, and for each parent `x (A) rests on N · M crossed
 *  here · show` (the moment named as the `stands on` line names it — a label carries its article) — `show` listing the foundations as the parent's card has them, a tail only where he acted at this edge; a hover card that cannot be pressed shows the
 *  items whole. A parent moment that rests on nothing in its cast has no line (a born parent's moment rests on its coordinates, which the legs draw — §9.68 (2)) */
export function RelatingCard({ head, ends, pressable }: { head: string | null; ends: ParentEnd[]; pressable: boolean }): ReactElement {
  const [shown, setShown] = useState<Record<number, boolean>>({});
  const stands = ends.map((e) => `${e.nameOf(e.id)} (${e.label})`).join(' and ');
  return (
    <div data-dependence-card="relating" className="grid gap-0.5">
      {head !== null ? <span data-dependence-card-head="true" className="text-stone-100">{head}</span> : null}
      <span data-dependence-card-line="stands-on" className="text-stone-400">{`stands on ${stands}`}</span>
      {ends.map((e, k) => {
        const r = foundationOf(e.tuples, e.id);
        if (r.rests.length === 0) return null;
        const items = foundationItemsOf(e.tuples, e.id);
        const crossedCount = r.rests.filter((f) => e.crossed(f.id).length > 0).length;
        const open = !pressable || !!shown[k];
        return (
          <span key={`${k}|${e.id}`} data-dependence-rests-line={e.id} data-dependence-rests={String(r.rests.length)} data-dependence-crossed={crossedCount ? String(crossedCount) : undefined} className="block text-stone-400">
            <span className="flex flex-wrap items-center gap-x-2">
              <span>{`${e.nameOf(e.id)} (${e.label}) rests on ${r.rests.length}${crossedCount ? ` · ${crossedCount} crossed here` : ''}`}</span>
              {pressable ? (
                <>
                  {' · '}
                  <button type="button" data-dependence-show={e.id} data-dependence-shown={shown[k] ? 'true' : undefined} className="underline" onClick={() => setShown({ ...shown, [k]: !shown[k] })}>{shown[k] ? 'hide' : 'show'}</button>
                </>
              ) : null}
            </span>
            {open ? (
              <span className="block pl-3">
                {items.map(({ key, via, item }) => {
                  const crossed = item.holds ? e.crossed(item.to) : [];
                  const barred = item.holds ? e.barred(item.to) : [];
                  return (
                    <span key={key} data-dependence-item={`${via ?? ''}|${item.word}|${item.to}`} data-dependence-item-crossed={crossed.length ? String(crossed.length) : undefined} data-dependence-item-barred={barred.length ? String(barred.length) : undefined} className="block text-stone-300">
                      {via !== null ? <span className="text-stone-400">{`through ${e.nameOf(via)}: `}</span> : null}
                      <span {...struck(!item.holds)}>{`${item.word} ${via !== null && e.nameFrom ? e.nameFrom(via, item.to) : e.nameOf(item.to)}`}</span>
                      {crossed.length ? <span className="text-stone-400">{' · crossed as '}{crossed.map((c, i) => <span key={i}>{i ? ' · ' : ''}{c}</span>)}</span> : null}
                      {barred.length ? <span className="text-stone-400">{' · barred: '}{barred.map((b, i) => <span key={i}>{i ? ' · ' : ''}{b}</span>)}</span> : null}
                    </span>
                  );
                })}
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

/** THE CARD'S PLACE (the designer's 15:31, her form): OUTSIDE the drawing, just beyond its frame and level with the moment, kept on screen — never over the ways it lights
 *  (right of the frame where the window has room, else left of it, else over the frame's right edge). Its place is a function of the FRAME and the moment alone and its width is
 *  FIXED — measured 10-21 on her relating `(the share is drawn from the product)`: a card whose width followed its place (a placed box without a width shrinks to the room on its
 *  right) fed its place back to itself, the layout effect re-ran on every render, and React's update depth stormed: the root unmounted, the page blank, his unsaved acts gone.
 *  By construction now: the effect runs once per moment rested on (keyed by the anchor, never by its own state) and nothing it reads depends on what it sets. `position: fixed`,
 *  so no scrolling ancestor clips it; nothing to measure under node, where it stays hidden; the pointer passes through it */
export const CARD_WIDTH = 416;
/** THE CARD BELOW THE DRAWING (the designer's 19:36, for the merged point's drawing in its overlay): just below the frame, under the moment's column, inside the container;
 *  where no room is left below, beside the frame as the surface's card; over the drawing only where no room is left outside it — and then never over the moment's own
 *  column nor over what is lit (a lit seam pair's far end). The place reads the frame, the container, the column and the lit marks, none of which the card moves (it is
 *  fixed and lets the pointer through) — still once per moment rested on */
export interface BelowPlace { container: () => Element | null; column: () => Element | null; avoid?: () => Element[] }
type CardSide = 'right' | 'left' | 'over' | 'below';
const rectOf = (e: Element | null): DOMRect | null => (e && typeof e.getBoundingClientRect === 'function' ? e.getBoundingClientRect() : null);
function belowPlaceOf(below: BelowPlace, ar: DOMRect, fr: DOMRect, w: number, h: number, vw: number, vh: number): { left: number; top: number; side: CardSide } {
  const box = rectOf(below.container());
  const col = rectOf(below.column()) ?? ar;
  const lo = Math.max(8, box ? box.left + 8 : 8);
  const hi = Math.min(vw - 8, box ? box.right - 8 : vw - 8);
  const floor = Math.min(vh - 8, box ? box.bottom - 8 : vh - 8);
  if (hi - lo >= w && fr.bottom + 8 + h <= floor) return { left: Math.round(Math.max(lo, Math.min(col.left, hi - w))), top: Math.round(fr.bottom + 8), side: 'below' };
  const top = Math.round(Math.max(8, Math.min(ar.top - 6, vh - h - 8)));
  if (fr.right + 8 + w <= vw - 8) return { left: Math.round(fr.right + 8), top, side: 'right' };
  if (fr.left - 8 - w >= 8) return { left: Math.round(fr.left - 8 - w), top, side: 'left' };
  const keep = [col, ...(below.avoid ? below.avoid().map(rectOf).filter((r): r is DOMRect => r !== null) : [])];
  const clampX = (x: number): number => Math.max(8, Math.min(x, vw - w - 8));
  const candidates = [fr.right - w - 8, fr.left + 8, col.right + 8, col.left - 8 - w].map(clampX);
  const clear = (x: number): boolean => keep.every((r) => r.right <= x || r.left >= x + w || r.bottom <= top || r.top >= top + h);
  return { left: Math.round(candidates.find(clear) ?? candidates[0]), top, side: 'over' };
}
export function BesideCard({ anchor, frame, anchorKey, below, children }: { anchor: () => Element | null; frame: () => Element | null; anchorKey: string; below?: BelowPlace; children: ReactNode }): ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);
  const [at, setAt] = useState<{ left: number; top: number; side: CardSide } | null>(null);
  useIsoLayoutEffect(() => {
    const a = anchor();
    const f = frame();
    const card = ref.current;
    if (!a || !f || !card || typeof a.getBoundingClientRect !== 'function' || typeof window === 'undefined') { setAt(null); return; }
    const ar = a.getBoundingClientRect();
    const fr = f.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(CARD_WIDTH, vw - 16);
    const h = card.offsetHeight; // the content's own height at the fixed width — never a function of the place
    if (below) { const p = belowPlaceOf(below, ar, fr, w, h, vw, vh); setAt((cur) => (cur && cur.left === p.left && cur.top === p.top && cur.side === p.side ? cur : p)); return; }
    const side: 'right' | 'left' | 'over' = fr.right + 8 + w <= vw - 8 ? 'right' : fr.left - 8 - w >= 8 ? 'left' : 'over';
    const left = Math.round(side === 'right' ? fr.right + 8 : side === 'left' ? fr.left - 8 - w : Math.max(8, Math.min(fr.right - w - 8, vw - w - 8)));
    const top = Math.round(Math.max(8, Math.min(ar.top - 6, vh - h - 8)));
    setAt((cur) => (cur && cur.left === left && cur.top === top && cur.side === side ? cur : { left, top, side }));
  }, [anchorKey]); // eslint-disable-line react-hooks/exhaustive-deps -- once per moment rested on: the place reads the frame and the moment, never the card
  const width = Math.min(CARD_WIDTH, typeof window === 'undefined' ? CARD_WIDTH : window.innerWidth - 16);
  return (
    <div ref={ref} data-dependence-beside={at ? at.side : 'unplaced'} className="pointer-events-none fixed z-30 rounded border border-slate-600 bg-stone-900/95 px-2 py-1 text-xs leading-snug shadow" style={{ width, ...(at ? { left: at.left, top: at.top } : { left: 8, top: 8, visibility: 'hidden' as const }) }}>
      {children}
    </div>
  );
}

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
  return <span {...struck(!g.holds)}>{`${g.word} ${g.to.map(nameOf).join(', ')}`}</span>;
}
function Groups({ items, nameOf }: { items: readonly FoundationItem[]; nameOf: (id: string) => string }): ReactElement {
  return <>{groupedItems(items).map((g, i) => <span key={`${g.word}|${g.holds}|${i}`}>{i ? <span className="text-stone-500">{' · '}</span> : null}<Group g={g} nameOf={nameOf} /></span>)}</>;
}

/** THE MOMENT CARD (the designer's 13:42 §1): the head; `cannot be without: …`; one `through X:` line per moment reached through another, nearest first; `what cannot
 *  be without it: …` muted. Nothing (null) for a moment with no dependence either way — the card reads the wires, and there are none */
export function momentCardOf({ head, tuples, id, nameOf }: { head: string; tuples: readonly DependenceTuple[]; id: string; nameOf: (id: string) => string }): ReactElement | null {
  const r = foundationOf(tuples, id);
  if (r.direct.length === 0 && r.dependents.length === 0) return null;
  return (
    <div data-dependence-card="moment" data-dependence-card-of={id} data-dependence-rests={String(r.rests.length)} className="grid gap-0.5">
      <span data-dependence-card-head="true" className="text-stone-100">{head}</span>
      {r.direct.length ? <span data-dependence-card-line="direct" className="text-stone-300">{'cannot be without: '}<Groups items={r.direct} nameOf={nameOf} /></span> : null}
      {r.through.map((t) => (
        <span key={t.via} data-dependence-card-line="through" data-dependence-through={t.via} className="text-stone-300">{`through ${nameOf(t.via)}: `}<Groups items={t.items} nameOf={nameOf} /></span>
      ))}
      {r.dependents.length ? (
        <span data-dependence-card-line="dependents" className="text-stone-400">
          {'what cannot be without it: '}
          {r.dependents.map((d, i) => <span key={`${d.from}|${d.word}|${i}`}>{i ? ' · ' : ''}<span {...struck(!d.holds)}>{`${nameOf(d.from)} ${d.word} it`}</span></span>)}
        </span>
      ) : null}
    </div>
  );
}

/** one parent's end of a relating: the parent's label, its cast's tuples, the moment, its names — and what he did at THIS edge on a foundation: the relatings that cross
 *  it (the page's words for a relating) and the bars he set on it (the page's words for a bar) */
export interface ParentEnd { label: string; tuples: readonly DependenceTuple[]; id: string; nameOf: (id: string) => string; crossed: (foundation: string) => ReactNode[]; barred: (foundation: string) => ReactNode[] }

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
                      <span {...struck(!item.holds)}>{`${item.word} ${e.nameOf(item.to)}`}</span>
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

/** THE CARD'S PLACE: beside the moment it reads — right of the anchor where the pane has room, else left of it — measured after paint against the pane (nothing to
 *  measure under node, where it stays hidden); the pointer passes through it, so it never takes the hover it reads */
export function BesideCard({ pane, anchor, children }: { pane: HTMLElement | null; anchor: () => Element | null; children: ReactNode }): ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);
  const [at, setAt] = useState<{ left: number; top: number } | null>(null);
  useIsoLayoutEffect(() => {
    const el = anchor();
    const card = ref.current;
    if (!pane || !el || !card || typeof el.getBoundingClientRect !== 'function') { setAt(null); return; }
    const p = pane.getBoundingClientRect();
    const a = el.getBoundingClientRect();
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const rightRoom = p.right - a.right - 16;
    const left = Math.round(rightRoom >= Math.min(w, 240) ? a.right - p.left + 12 : Math.max(4, a.left - p.left - w - 12));
    const top = Math.round(Math.max(4, Math.min(a.top - p.top - 6, p.height - h - 4)));
    setAt((cur) => (cur && cur.left === left && cur.top === top ? cur : { left, top }));
  });
  return (
    <div ref={ref} data-dependence-beside={at ? 'placed' : 'unplaced'} className="pointer-events-none absolute z-10 max-w-[28rem] rounded border border-slate-600 bg-stone-900/95 px-2 py-1 text-xs leading-snug shadow" style={at ? { left: at.left, top: at.top } : { left: 8, top: 8, visibility: 'hidden' }}>
      {children}
    </div>
  );
}

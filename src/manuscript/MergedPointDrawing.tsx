// THE MERGED POINT'S DRAWING — GROUP 4 · slice 3 (2026-10-22; ADR 0031 §9.76 (3); the designer's 16:48: "the edge's drawing, made for N members — nothing new is invented:
// every mark is one the page already draws, in the place it already has"). Each MEMBER is its own column, side by side in the record's order, its moments in its caster's
// order and named as today (`InsideColumn`, the one column drawing); the members are joined by nothing but his seam pairs, drawn as the edge draws a pair — a line across
// between the two paired moments; nothing is merged by spelling. THE WAYS: a member's filled relations are the arcs of its own column (his names on them); a kind his τ
// joined across two members is said in the word-pair line under the drawing, never drawn as one arc. WHAT A MOMENT RESTS ON: a seed member draws its wiring in its outer
// channel (Δ226, the column's own); a born member none — what it rests on is its coordinates; the card beside each moment, headed `the capacity (Production)`, reads down
// the tower (src/lib/tower.ts). THE LIGHTS: on the same card beneath, in the muted ink — `said of it: … · holds, in Finance's light`; no line when nothing is said. The empty
// case: `0 words · 0 tuples` in the row; an older lift file says `ways: not carried by this lift`.
// GROUP 4 · slice 4 — THE DESIGNER'S 19:36 (her look at slice 3, THROUGH): (a) the card BELOW the drawing, inside the overlay, under the moment's column — over the drawing
// only where no room is left outside it, and then never over the moment's own column nor a lit pair (BesideCard's `below`); the hover lights the moment rested on, the moments
// his seam pairs make one with it and the pair lines between them, as the edge's drawing lights a point's relatings; (2) an EMPTY member keeps its head, with the page's own
// sentence for an empty site beneath it — one of the spaces the row counts, never drawn nowhere.
import { useMemo, useRef, useState, type ReactElement } from 'react';
import type { Shape, VertexId } from '../types/geometry';
import { InsideColumn, insideGeometry, type InsideGeometry } from '../components/CastInsideDiagram';
import { BesideCard, momentCardOf } from '../components/FoundationCard';
import { ZoomFrame } from '../components/ZoomFrame';
import { towerEndOf } from '../lib/tower';
import type { ChildRecords } from '../lib/childLoops';
import type { DoorTransport } from './apertureModel';
import type { ImageCorner } from './identificationImageModel';
import { lightsEndingAt, memberColumnsOf, momentWordsOf, type MemberColumn } from './pointContentModel';

const GAP = 56; // between two members' reaches
const TOP = 26; // the member's name above its column
/** the page's own sentence for a site that holds nothing yet (the card's row says it of an empty corner) */
const EMPTY_WORDS = 'nothing related here yet';
/** an empty member's slot: wide enough for its head and the sentence beneath it (the glyphs at 11 px, estimated as the column's own lane estimates them) */
const emptyWidthOf = (label: string): number => Math.max(label.length, EMPTY_WORDS.length) * 6.4 + 16;

/** one member's place on the drawing: its point line's x and its reaches either side; the column's geometry where it draws a column (an empty member draws none) */
interface Slot { px: number; left: number; right: number; height: number; g: InsideGeometry | null }

const keyOf = (member: VertexId, role: string): string => `${member}|${role}`;

/** the x of a column's point line and the y of its i-th point — the geometry the column itself was laid out with */
function placeOf(slots: Slot[], columns: MemberColumn[], ci: number, id: string): { x: number; y: number } | null {
  const g = slots[ci]?.g ?? null;
  const i = columns[ci].inside.points.findIndex((p) => p.id === id);
  return g && i >= 0 ? { x: g.px, y: g.yOf(i) } : null;
}

export function MergedPointDrawing({ record, corner, transports, records, fitHeight }: { record: Shape; corner: ImageCorner; transports: DoorTransport[]; records: ChildRecords | null; fitHeight?: number | null }): ReactElement {
  const { columns, pairs, joined } = useMemo(() => memberColumnsOf(record, corner, transports, records), [record, corner, transports, records]);
  // each column laid out by its own geometry, placed after the previous column's reach; the first column's wiring channel runs left of its names, the others' right; an empty
  // member a slot as wide as its head
  const slots = useMemo<Slot[]>(() => {
    let x = 20;
    return columns.map((c, i) => {
      if (c.empty) {
        const w = emptyWidthOf(c.label);
        const slot: Slot = { px: x + w / 2, left: w / 2, right: w / 2, height: 40, g: null };
        x += w + GAP;
        return slot;
      }
      const side: -1 | 1 = i === 0 ? -1 : 1;
      const probe = insideGeometry(c.inside, { channelSide: side, top: TOP });
      const g = insideGeometry(c.inside, { px: x + probe.leftReach + 8, top: TOP, channelSide: side });
      x = g.px + g.rightReach + GAP;
      return { px: g.px, left: g.leftReach, right: g.rightReach, height: g.height, g };
    });
  }, [columns]);
  const width = slots.length ? Math.max(...slots.map((s) => s.px + s.right)) + 24 : 240;
  const height = slots.length ? Math.max(...slots.map((s) => s.height + TOP)) + 24 : 80;
  const [hover, setHover] = useState<{ column: number; id: string } | null>(null);
  const hoverEl = useRef<Element | null>(null);
  const frameEl = useRef<HTMLDivElement | null>(null);
  const options = records ? { records } : {};
  const labelOf = (v: VertexId): string => record.vertices[v]?.data.label?.trim() || 'unnamed';
  const absent = columns.some((c) => !c.waysRead);
  // THE HOVER (the edge's drawing's own): the moment rested on and every moment one of his seam pairs makes one with it — lit; the rest dimmed
  const own = hover ? keyOf(columns[hover.column].id, hover.id) : null;
  const litKeys = useMemo(() => {
    const out = new Set<string>();
    if (own === null) return out;
    out.add(own);
    for (const p of pairs) { const a = keyOf(p.a.member, p.a.role); const b = keyOf(p.b.member, p.b.role); if (a === own) out.add(b); if (b === own) out.add(a); }
    return out;
  }, [own, pairs]);
  const columnEl = (id: VertexId): Element | null => [...(frameEl.current?.querySelectorAll('[data-merged-point-column]') ?? [])].find((e) => e.getAttribute('data-merged-point-column') === id) ?? null;
  const litEls = (): Element[] => [...(frameEl.current?.querySelectorAll('[data-merged-point-pair-lit="true"], [data-merged-point-moment-lit="true"]') ?? [])];
  return (
    <div ref={frameEl} data-merged-point-drawing={corner.id} data-merged-point-members={String(columns.length)} data-merged-point-pairs={String(pairs.length)} data-merged-point-joined={String(joined.length)} style={{ position: 'relative' }}>
      {/* the one ZoomFrame every diagram has (the zoom frame, 10-19): fit on the first frame, his scale kept; the overlay's measured height handed down as the fit (rider 3), the lines under the drawing left their room */}
      <ZoomFrame name="merged-point" id={corner.id} width={width} height={height} frameMaxHeight={fitHeight === undefined ? undefined : fitHeight === null ? null : Math.max(0, fitHeight - 48)} fixedWidth>
      {(scale) => (
      <svg data-merged-point-svg="true" data-merged-point-scale={scale.toFixed(3)} width={Math.round(width * scale)} height={Math.round(height * scale)} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
        {columns.map((c, i) => (
          <g key={c.id} data-merged-point-column={c.id} data-merged-point-column-ways={c.waysRead ? 'read' : 'not carried'} data-merged-point-column-seed={c.seed ? 'true' : 'false'} {...(c.empty ? { 'data-merged-point-column-empty': 'true' } : {})}>
            <text x={slots[i].px} y={14} textAnchor="middle" fontSize={11} fill="#d6d3d1" fontWeight={600}>{c.label}</text>
            {c.empty || !slots[i].g ? (
              <text data-merged-point-column-empty-words="true" x={slots[i].px} y={TOP + 14} textAnchor="middle" fontSize={11} fill="#a8a29e" fontStyle="italic">{EMPTY_WORDS}</text>
            ) : (
              <InsideColumn
                inside={c.inside}
                geometry={slots[i].g as InsideGeometry}
                idPrefix={`point-${i}`}
                who={c.label}
                pointExtra={(pt) => {
                  const k = keyOf(c.id, pt.id);
                  const lit = litKeys.has(k);
                  return {
                    lit,
                    dim: hover !== null && !lit,
                    onHover: (over, el) => { if (over) { hoverEl.current = el ?? null; setHover({ column: i, id: pt.id }); } else setHover((h) => (h && h.column === i && h.id === pt.id ? null : h)); },
                    attrs: { 'data-merged-point-moment': k, ...(lit ? { 'data-merged-point-moment-lit': 'true' } : {}) },
                  };
                }}
              />
            )}
          </g>
        ))}
        {/* his seam pairs, drawn across as the edge draws a pair: a line between the two paired moments — lit where the moment rested on is one of its ends */}
        {pairs.map((p, k) => {
          const ia = columns.findIndex((c) => c.id === p.a.member); const ib = columns.findIndex((c) => c.id === p.b.member);
          const A = ia >= 0 ? placeOf(slots, columns, ia, p.a.role) : null; const B = ib >= 0 ? placeOf(slots, columns, ib, p.b.role) : null;
          if (!A || !B) return null;
          const lit = own !== null && (own === keyOf(p.a.member, p.a.role) || own === keyOf(p.b.member, p.b.role));
          return <line key={`pair-${k}`} data-merged-point-pair={`${p.a.member}|${p.a.role}~${p.b.member}|${p.b.role}`} {...(lit ? { 'data-merged-point-pair-lit': 'true' } : {})} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#f5d0a9" strokeWidth={lit ? 2 : 1.2} strokeDasharray="4 3" opacity={hover === null ? 0.9 : lit ? 1 : 0.3} />;
        })}
      </svg>
      )}
      </ZoomFrame>
      {joined.length ? (
        <div data-merged-point-word-pairs={String(joined.length)} style={{ fontSize: 11, marginTop: 4, opacity: 0.9 }}>
          {`${joined.length} word pair${joined.length === 1 ? '' : 's'}: ${joined.map((j) => `${j.a.words} (${j.a.memberLabel}) ≡ ${j.b.words} (${j.b.memberLabel})`).join(' · ')}`}
        </div>
      ) : null}
      {absent ? <div data-merged-point-ways-absent="true" style={{ fontSize: 11, marginTop: 4, fontStyle: 'italic', opacity: 0.8 }}>ways: not carried by this lift</div> : null}
      {/* the card BELOW the drawing, under the moment's column, inside the overlay (the designer's 19:36): its head naming the member; what it rests on, down the tower, a
          concept named only where it changes; the lights beneath */}
      {hover ? (() => {
        const col = columns[hover.column];
        const E = towerEndOf(record, col.id, hover.id, col.id, options);
        const head = `${momentWordsOf(record, col.id, hover.id, options)} (${col.label})`;
        const card = momentCardOf({ head, tuples: E.tuples, id: E.id, nameOf: E.nameOf, nameFrom: E.nameFrom });
        const lights = lightsEndingAt(record, col.id, hover.id, options);
        if (!card && lights.length === 0) return null;
        return (
          <BesideCard anchor={() => hoverEl.current} frame={() => frameEl.current} anchorKey={`point|${col.id}|${hover.id}`} below={{ container: () => frameEl.current?.parentElement ?? null, column: () => columnEl(col.id), avoid: litEls }}>
            <div data-merged-point-card={`${col.id}|${hover.id}`} className="grid gap-0.5">
              {card ?? <span data-dependence-card-head="true" className="text-stone-100">{head}</span>}
              {lights.map((l, k) => (
                <span key={`${l.faceId}|${k}`} data-merged-point-light={l.apex} className="text-stone-400">{`said of it: ${l.words} · ${l.holds ? 'holds' : 'does not hold'}, in ${labelOf(l.apex)}'s light`}</span>
              ))}
            </div>
          </BesideCard>
        );
      })() : null}
    </div>
  );
}

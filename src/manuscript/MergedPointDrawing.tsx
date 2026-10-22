// THE MERGED POINT'S DRAWING — GROUP 4 · slice 3 (2026-10-22; ADR 0031 §9.76 (3); the designer's 16:48: "the edge's drawing, made for N members — nothing new is invented:
// every mark is one the page already draws, in the place it already has"). Each MEMBER is its own column, side by side in the record's order, its moments in its caster's
// order and named as today (`InsideColumn`, the one column drawing); the members are joined by nothing but his seam pairs, drawn as the edge draws a pair — a line across
// between the two paired moments; nothing is merged by spelling. THE WAYS: a member's filled relations are the arcs of its own column (his names on them); a kind his τ
// joined across two members is said in the word-pair line under the drawing, never drawn as one arc. THE DEPENDENCES: a seed member draws its wiring in its outer channel
// (Δ226, the column's own); a born member none — what it rests on is its coordinates; the card beside each moment, outside the drawing's frame, headed `the capacity
// (Production)`, reads down the tower (src/lib/tower.ts). THE LIGHTS: on the same card beneath, in the muted ink — `said of it: … · holds, in Finance's light`; no line when
// nothing is said. The empty case: `0 words · 0 tuples` in the row; an older lift file says `ways: not carried by this lift`.
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

/** the x of a column's point line and the y of its i-th point — the geometry the column itself was laid out with */
function placeOf(geoms: InsideGeometry[], columns: MemberColumn[], ci: number, id: string): { x: number; y: number } | null {
  const g = geoms[ci];
  const i = columns[ci].inside.points.findIndex((p) => p.id === id);
  return g && i >= 0 ? { x: g.px, y: g.yOf(i) } : null;
}

export function MergedPointDrawing({ record, corner, transports, records, fitHeight }: { record: Shape; corner: ImageCorner; transports: DoorTransport[]; records: ChildRecords | null; fitHeight?: number | null }): ReactElement {
  const { columns, pairs, joined } = useMemo(() => memberColumnsOf(record, corner, transports, records), [record, corner, transports, records]);
  // each column laid out by its own geometry, placed after the previous column's reach; the first column's wiring channel runs left of its names, the others' right
  const geoms = useMemo(() => {
    let x = 20;
    return columns.map((c, i) => {
      const side: -1 | 1 = i === 0 ? -1 : 1;
      const probe = insideGeometry(c.inside, { channelSide: side, top: TOP });
      const g = insideGeometry(c.inside, { px: x + probe.leftReach + 8, top: TOP, channelSide: side });
      x = g.px + g.rightReach + GAP;
      return g;
    });
  }, [columns]);
  const width = geoms.length ? Math.max(...geoms.map((g) => g.px + g.rightReach)) + 24 : 240;
  const height = geoms.length ? Math.max(...geoms.map((g) => g.height + TOP)) + 24 : 80;
  const [hover, setHover] = useState<{ column: number; id: string } | null>(null);
  const hoverEl = useRef<Element | null>(null);
  const frameEl = useRef<HTMLDivElement | null>(null);
  const options = records ? { records } : {};
  const labelOf = (v: VertexId): string => record.vertices[v]?.data.label?.trim() || 'unnamed';
  const absent = columns.some((c) => !c.waysRead);
  return (
    <div ref={frameEl} data-merged-point-drawing={corner.id} data-merged-point-members={String(columns.length)} data-merged-point-pairs={String(pairs.length)} data-merged-point-joined={String(joined.length)} style={{ position: 'relative' }}>
      {/* the one ZoomFrame every diagram has (the zoom frame, 10-19): fit on the first frame, his scale kept; the overlay's measured height handed down as the fit (rider 3), the lines under the drawing left their room */}
      <ZoomFrame name="merged-point" id={corner.id} width={width} height={height} frameMaxHeight={fitHeight === undefined ? undefined : fitHeight === null ? null : Math.max(0, fitHeight - 48)} fixedWidth>
      {(scale) => (
      <svg data-merged-point-svg="true" width={width * scale} height={height * scale} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
        {columns.map((c, i) => (
          <g key={c.id} data-merged-point-column={c.id} data-merged-point-column-ways={c.waysRead ? 'read' : 'not carried'} data-merged-point-column-seed={c.seed ? 'true' : 'false'}>
            <text x={geoms[i].px} y={14} textAnchor="middle" fontSize={11} fill="#d6d3d1" fontWeight={600}>{c.label}</text>
            <InsideColumn
              inside={c.inside}
              geometry={geoms[i]}
              idPrefix={`point-${i}`}
              who={c.label}
              pointExtra={(pt) => ({
                lit: hover !== null && hover.column === i && hover.id === pt.id,
                dim: hover !== null && !(hover.column === i && hover.id === pt.id),
                onHover: (over, el) => { if (over) { hoverEl.current = el ?? null; setHover({ column: i, id: pt.id }); } else setHover((h) => (h && h.column === i && h.id === pt.id ? null : h)); },
                attrs: { 'data-merged-point-moment': `${c.id}|${pt.id}` },
              })}
            />
          </g>
        ))}
        {/* his seam pairs, drawn across as the edge draws a pair: a line between the two paired moments */}
        {pairs.map((p, k) => {
          const ia = columns.findIndex((c) => c.id === p.a.member); const ib = columns.findIndex((c) => c.id === p.b.member);
          const A = ia >= 0 ? placeOf(geoms, columns, ia, p.a.role) : null; const B = ib >= 0 ? placeOf(geoms, columns, ib, p.b.role) : null;
          if (!A || !B) return null;
          return <line key={`pair-${k}`} data-merged-point-pair={`${p.a.member}|${p.a.role}~${p.b.member}|${p.b.role}`} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="#f5d0a9" strokeWidth={1.2} strokeDasharray="4 3" opacity={0.9} />;
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
      {/* the card beside the moment, outside the drawing's frame (the fix landing's place): its head naming the member; what it rests on, down the tower; the lights beneath */}
      {hover ? (() => {
        const col = columns[hover.column];
        const E = towerEndOf(record, col.id, hover.id, col.id, options);
        const head = `${momentWordsOf(record, col.id, hover.id, options)} (${col.label})`;
        const card = momentCardOf({ head, tuples: E.tuples, id: E.id, nameOf: E.nameOf });
        const lights = lightsEndingAt(record, col.id, hover.id, options);
        if (!card && lights.length === 0) return null;
        return (
          <BesideCard anchor={() => hoverEl.current} frame={() => frameEl.current} anchorKey={`point|${col.id}|${hover.id}`}>
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

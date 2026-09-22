// ═══ THE INSIDE, DRAWN — `STAMP C-7a`, 2026-09-22: a corner's concept-space as
// an ARC DIAGRAM on the CANVAS (the designer's form and siting, ratified
// §110.2: the world shows the thing, the column reads it — the module's own
// grammar; the diagram stays visible from every sidebar tab, so the act and
// its reading are never one tab apart). Pure presentation over
// `insideOf` (src/lib/castInside.ts): nothing here derives, sorts, ranks or
// proposes; positions carry nothing — the caster's own order top to bottom.
//
//   a role         a point; its label to the left (an id as an ADDRESS, marked)
//   a badge        the value in words, after the label — `member_status` and any
//                  caster key on the role; UNKNOWN only where written
//   an arc         an arc from t₁ to t₂ (a flattened half-ellipse, so a long span
//                  does not run off the frame) with its word RIDING THE ARC at its
//                  apex; the SIDE is the tuple's: `down` the caster's order on the
//                  RIGHT, `up` it on the LEFT (⚠ which side means which is the
//                  designer's first-run call at the eye — this build picks right =
//                  down, and says so). Found at the eye: words placed beside the
//                  apex piled up where apexes neighbour; a word on its own curve
//                  cannot pile on another's.
//   does-not-hold  a DISTINCT glyph: the stroke dashed and the word prefixed `¬`
//   a loop         a small ring at the point per loop, the words in one row after
//                  the rings in the same order (six at Φ1 — found at the eye: a word
//                  above each ring overlapped its neighbours)
//   arity ≥ 3      a tuple-node offset right of the column, legs numbered 1 … n at
//                  the node, the word on the node
//   axioms/warrant text beneath, carried
//   the unrecorded NOTHING
// THE TWO ABSENCES: no cast → the panel returns null (nothing, no frame); a
// cast of nothing → the card's own sentence `a cast of nothing — no roles`,
// never an empty column (which reads as *not loaded*).
// Labels and badges are drawn AFTER the arcs with a halo so an arc that passes
// behind a word leaves it legible; the arcs themselves are never moved for it.

import { useMemo } from 'react';
import type { Shape, VertexId } from '../types/geometry';
import { castSummaryLine } from '../lib/castLoader';
import { insideOf, type Inside, type InsideArc, type InsidePoint } from '../lib/castInside';

export interface InsideLayoutOptions {
  /** the row pitch — the column degrades by scrolling, never by shrinking below legibility */
  row?: number;
  /** the point column's x inside the group */
  px?: number;
  /** the group's top y */
  top?: number;
  compact?: boolean;
}

export interface InsideGeometry {
  row: number;
  px: number;
  top: number;
  height: number;
  leftReach: number; // how far the up-arcs and labels reach left of px
  rightReach: number; // how far the down-arcs and tuple-nodes reach right of px
  yOf: (index: number) => number;
}

const LABEL_LANE = 118;
const NODE_GAP = 46;
/** the arc's horizontal reach as a fraction of its half-span — a flattened half-ellipse; the side and the nesting are untouched by it */
const ARC_FLATTEN = 0.62;
const idSafe = (s: string): string => s.replace(/[^A-Za-z0-9_-]/g, '-');

/** the geometry the column occupies — computed from the inside alone, so a composite (the midpoint's unfolding) can place two columns without overlap */
export function insideGeometry(inside: Inside, options: InsideLayoutOptions = {}): InsideGeometry {
  const row = options.row ?? (options.compact ? 18 : 26);
  const px = options.px ?? 0;
  const top = options.top ?? 0;
  const yOf = (index: number): number => top + row * (index + 0.5);
  let maxDown = 0;
  let maxUp = 0;
  const multiplicity = new Map<string, number>();
  for (const a of inside.arcs) {
    const k = `${a.from}|${a.to}`;
    multiplicity.set(k, (multiplicity.get(k) ?? 0) + 1);
    const r = ((Math.abs(a.to - a.from) * row) / 2) * ARC_FLATTEN + 7 * ((multiplicity.get(k) as number) - 1);
    if (a.side === 'down') maxDown = Math.max(maxDown, r);
    else maxUp = Math.max(maxUp, r);
  }
  // the loop row's width is the rings plus the words in one row (found at the eye: Φ1's six words ran past the frame)
  const loopsWide = Math.max(0, ...inside.points.map((p) => {
    const loops = inside.loops.filter((l) => l.at === p.index);
    return loops.length === 0 ? 0 : loops.length * 14 + 5.4 * loops.map((l) => (l.polarity === 'does-not-hold' ? l.type.length + 2 : l.type.length)).reduce((a, b) => a + b + 3, 0) + 30;
  }));
  const rightReach = Math.max(maxDown + 40, loopsWide) + (inside.nodes.length ? NODE_GAP + 110 : 0);
  const leftReach = Math.max(maxUp + 40, LABEL_LANE + 12);
  return { row, px, top, height: row * Math.max(inside.points.length, 1) + (inside.axioms.length + (inside.warrantCarried ? 1 : 0) + inside.unplaced.length) * 16 + 12, leftReach, rightReach, yOf };
}

const wordOf = (type: string, polarity: 'holds' | 'does-not-hold'): string => (polarity === 'does-not-hold' ? `¬ ${type}` : type);

const arcPath = (arc: InsideArc, g: InsideGeometry, k: number): { d: string; apexX: number; apexY: number; rx: number } => {
  const y1 = g.yOf(arc.from);
  const y2 = g.yOf(arc.to);
  const ry = Math.abs(y2 - y1) / 2;
  const rx = ry * ARC_FLATTEN + 7 * k;
  // the same sweep for both: from an earlier point down to a later one the arc bows RIGHT; from a later point up to an earlier one it bows LEFT — the side is the tuple's
  const d = `M ${g.px} ${y1} A ${rx} ${ry} 0 0 1 ${g.px} ${y2}`;
  return { d, apexX: arc.side === 'down' ? g.px + rx : g.px - rx, apexY: (y1 + y2) / 2, rx };
};

/** ONE COLUMN, as SVG children — the midpoint's unfolding composes two of these in one drawing */
export function InsideColumn({ inside, geometry, idPrefix = 'inside', arcExtra, pointExtra }: {
  inside: Inside;
  geometry: InsideGeometry;
  /** distinct per column — the arc paths carry ids the words ride on */
  idPrefix?: string;
  /** the midpoint's origin colouring (C-7b) — a class and a glyph for an arc, by its key `type|from|to` */
  arcExtra?: (arc: InsideArc) => { className?: string; glyph?: string; attrs?: Record<string, string> } | null;
  /** C-7b — a point that can be pointed at */
  pointExtra?: (point: InsidePoint) => { onClick?: () => void; className?: string; attrs?: Record<string, string> } | null;
}) {
  const g = geometry;
  const seenPair = new Map<string, number>();
  const fontSize = g.row <= 18 ? 10 : 11;
  const nodeX = g.px + (g.rightReach - (inside.nodes.length ? 120 : 0)) - 20;
  return (
    <g data-inside-column="true">
      {inside.arcs.map((arc, i) => {
        const k = `${arc.from}|${arc.to}`;
        const n = seenPair.get(k) ?? 0;
        seenPair.set(k, n + 1);
        const p = arcPath(arc, g, n);
        const extra = arcExtra?.(arc) ?? null;
        const negative = arc.polarity === 'does-not-hold';
        const pathId = `${idSafe(idPrefix)}-a${i}`;
        return (
          <g key={`arc-${i}`} data-inside-arc={`${arc.type}|${inside.points[arc.from].id}|${inside.points[arc.to].id}|${arc.polarity}|${arc.side}`} {...(extra?.attrs ?? {})}>
            <path id={pathId} d={p.d} fill="none" className={extra?.className ?? (negative ? 'stroke-rose-300/80' : 'stroke-stone-400/80')} strokeWidth={extra?.className ? 2.2 : 1.2} strokeDasharray={negative ? '4 3' : undefined} />
            {/* the word RIDES its own arc, outward of the stroke: glyph tops face away from the column on both sides */}
            <text dy={-3} fontSize={fontSize - 1} className={extra?.className ? 'fill-amber-200' : negative ? 'fill-rose-300' : 'fill-stone-400'}>
              <textPath data-inside-arc-word="true" href={`#${pathId}`} startOffset="50%" textAnchor="middle">
                {`${extra?.glyph ? `${extra.glyph} ` : ''}${wordOf(arc.type, arc.polarity)}`}
              </textPath>
            </text>
          </g>
        );
      })}
      {inside.nodes.map((node, i) => {
        const ys = node.legs.map((leg) => g.yOf(leg));
        const ny = ys.reduce((a, b) => a + b, 0) / ys.length;
        const negative = node.polarity === 'does-not-hold';
        return (
          <g key={`node-${i}`} data-inside-node={`${node.type}|${node.legs.map((leg) => inside.points[leg].id).join(',')}|${node.polarity}`}>
            {node.legs.map((leg, li) => {
              const ly = g.yOf(leg);
              const tx = nodeX + (g.px - nodeX) * 0.22;
              const ty = ny + (ly - ny) * 0.22;
              return (
                <g key={`leg-${li}`}>
                  <line x1={nodeX} y1={ny} x2={g.px} y2={ly} className={negative ? 'stroke-rose-300/70' : 'stroke-stone-500/80'} strokeWidth={1} strokeDasharray={negative ? '4 3' : undefined} />
                  <text data-inside-leg={String(li + 1)} x={tx} y={ty - 3} fontSize={fontSize - 2} textAnchor="middle" className="fill-stone-300">{String(li + 1)}</text>
                </g>
              );
            })}
            <circle cx={nodeX} cy={ny} r={5} className={negative ? 'fill-stone-950 stroke-rose-300' : 'fill-stone-950 stroke-stone-300'} strokeWidth={1.2} />
            <text x={nodeX + 9} y={ny + 3.5} fontSize={fontSize - 1} className={negative ? 'fill-rose-300' : 'fill-stone-300'}>{wordOf(node.type, node.polarity)}</text>
          </g>
        );
      })}
      {inside.points.map((point) => {
        const y = g.yOf(point.index);
        const loops = inside.loops.filter((l) => l.at === point.index);
        const extra = pointExtra?.(point) ?? null;
        const labelText = point.label ?? point.id;
        const badgeText = point.badges.map((b) => (b.home === 'signature' ? `${b.key} ${b.value}` : b.value)).join(' · ');
        const w = Math.min(LABEL_LANE, 6.2 * (labelText.length + (badgeText ? badgeText.length + 3 : 0)) + 8);
        return (
          <g
            key={point.id}
            data-inside-point={point.id}
            data-inside-address={point.label ? undefined : 'true'}
            className={extra?.className ?? (extra?.onClick ? 'cursor-pointer' : undefined)}
            onClick={extra?.onClick}
            {...(extra?.attrs ?? {})}
          >
            <rect x={g.px - 10 - w} y={y - g.row / 2 + 2} width={w} height={g.row - 4} rx={3} className="fill-stone-950/85" />
            <text x={g.px - 10} y={y + 3.5} textAnchor="end" fontSize={fontSize} className={point.label ? 'fill-stone-100' : 'fill-stone-300'}>
              <tspan data-inside-label="true" className={point.label ? '' : 'font-mono'}>{labelText}</tspan>
              {point.badges.map((b, bi) => (
                <tspan key={`${b.key}-${bi}`} data-inside-badge={`${b.key}=${b.value}`} data-inside-mold={b.mold ? 'true' : undefined} className={b.value === 'UNKNOWN' ? 'fill-amber-200' : 'fill-stone-400'}>
                  {` · ${b.home === 'signature' ? `${b.key} ${b.value}` : b.value}`}
                </tspan>
              ))}
            </text>
            <circle cx={g.px} cy={y} r={3.2} className={extra?.className ? 'fill-amber-300 stroke-amber-100' : 'fill-stone-200 stroke-stone-950'} strokeWidth={1} />
            {loops.map((loop, li) => {
              const cx = g.px + 10 + li * 14;
              const negative = loop.polarity === 'does-not-hold';
              return (
                <g key={`loop-${li}`} data-inside-loop={`${loop.type}|${point.id}|${loop.polarity}`}>
                  <circle cx={cx} cy={y - 8} r={5} fill="none" className={negative ? 'stroke-rose-300' : 'stroke-stone-300'} strokeWidth={1.1} strokeDasharray={negative ? '3 2' : undefined} />
                </g>
              );
            })}
            {loops.length ? (
              <text data-inside-loop-words={point.id} x={g.px + 10 + loops.length * 14 + 2} y={y - 5} fontSize={fontSize - 2} className={loops.some((l) => l.polarity === 'does-not-hold') ? 'fill-rose-300' : 'fill-stone-400'}>
                {loops.map((l) => wordOf(l.type, l.polarity)).join(' · ')}
              </text>
            ) : null}
          </g>
        );
      })}
      {(() => {
        const base = g.top + g.row * Math.max(inside.points.length, 1) + 10;
        const lines: Array<{ key: string; text: string; attr: Record<string, string>; className: string }> = [];
        inside.unplaced.forEach((u, i) => lines.push({ key: `unplaced-${i}`, text: `${wordOf(u.type, u.polarity)}(${u.terms.join(', ')}) — not placed: ${u.reason}`, attr: { 'data-inside-unplaced': `${u.type}(${u.terms.join(', ')})` }, className: 'fill-amber-200' }));
        inside.axioms.forEach((a, i) => lines.push({ key: `axiom-${i}`, text: `axiom, carried never evaluated: ${a}`, attr: { 'data-inside-axiom': 'true' }, className: 'fill-stone-500' }));
        if (inside.warrantCarried) lines.push({ key: 'warrant', text: 'warrant carried, never read', attr: { 'data-inside-warrant': 'true' }, className: 'fill-stone-500' });
        return lines.map((l, i) => (
          <text key={l.key} x={g.px - 10 - LABEL_LANE} y={base + i * 16} fontSize={fontSize - 1} className={l.className} {...l.attr}>{l.text}</text>
        ));
      })()}
    </g>
  );
}

/** THE DIAGRAM — one cast, one SVG */
export function CastInsideDiagram({ inside, compact = false, id }: { inside: Inside; compact?: boolean; id?: string }) {
  const g = useMemo(() => insideGeometry(inside, { compact, px: 0, top: 0 }), [inside, compact]);
  const width = g.leftReach + g.rightReach;
  return (
    <svg
      data-inside={id ?? 'cast'}
      data-inside-points={String(inside.census.points)}
      data-inside-arrows={String(inside.census.arrows)}
      data-inside-loops={String(inside.census.loops)}
      data-inside-hyper={String(inside.census.hyper)}
      data-inside-negatives={String(inside.census.negatives)}
      data-inside-words={String(inside.census.words)}
      data-inside-marks={String(inside.census.marks)}
      width={width}
      height={g.height}
      viewBox={`${-g.leftReach} 0 ${width} ${g.height}`}
      className="block overflow-visible"
    >
      <InsideColumn inside={inside} geometry={g} idPrefix={id ?? 'cast'} />
    </svg>
  );
}

/**
 * THE PANEL ON THE CANVAS — the selected corner's inside. No cast → NULL (a true absence, no frame); a cast of
 * nothing → the card's own sentence; a cast → the diagram, headed by the corner's label in the person's register.
 */
export function CastInsidePanel({ shape, vertexId }: { shape: Shape; vertexId: VertexId }) {
  const vertex = shape.vertices[vertexId];
  const cast = vertex?.data.cast;
  const inside = useMemo(() => (cast ? insideOf(cast) : null), [cast]);
  if (!vertex || !cast || !inside) return null;
  const personLabel = vertex.data.label.trim() ? vertex.data.label : 'unnamed';
  return (
    <div
      data-inside-panel={vertexId}
      className="pointer-events-auto absolute bottom-20 left-3 top-14 max-w-[74%] overflow-auto rounded border border-stone-800 bg-stone-950/85 px-3 py-2 shadow-lg"
    >
      <div className="mb-1 text-xs text-stone-500">
        <span className="text-stone-300">{personLabel}</span>
        {' · the inside of the cast it holds'}
        {cast.subject ? <span className="block text-stone-500">{`of: ${cast.subject}`}</span> : null}
      </div>
      {cast.roles.length === 0 ? (
        <p data-inside-nothing="true" className="text-xs text-stone-300">{castSummaryLine(cast)}</p>
      ) : (
        <CastInsideDiagram inside={inside} id={vertexId} />
      )}
    </div>
  );
}

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
//   an arc         an arc from t₁ to t₂ (a flattened half-ellipse — the bulge a
//                  LINEAR function of the span in ROWS, ≈ 0.30: measured by the
//                  designer from this build's plate, span IS encoded; the height is
//                  the rows' own, which C-7g lets grow) with its word AT ITS FOOT,
//                  beside the point it leaves from (C-7f item 1, her cut from this
//                  build's own geometry: because bulge is a function of span and
//                  spans REPEAT, apexes CLUSTER into a band — and the word sat at
//                  the apex; FEET cannot cluster, a foot sits at a point and the
//                  points are the column's own rows); the SIDE is the tuple's:
//                  `down` the caster's order on the RIGHT, `up` it on the LEFT —
//                  ruled at her eye (the two sides read as two directions).
//                  C-7g item 1 (the designer's second cut, from her own ratified
//                  law — only arity 2 is an arrow; arity 1 is a mark on the node —
//                  applied to WORDS: a unary relation IS a property of the point,
//                  so its word belongs in the label lane; a binary relation's word
//                  is a property of its ARC): THE LABEL LANE IS ARITY-1'S. At the
//                  eye the up-feet, end-anchored above the row line in that lane,
//                  read as a CAPTION of the role below them (`F4 · has ·
//                  presupposes`, a role with two properties). So EVERY arc word
//                  stands to the RIGHT of the point, at its arc's foot, on the side
//                  of the row line its arc goes: the up-arcs' words in a block
//                  ABOVE the row line, the down-arcs' in a block BELOW it, each
//                  block read top to bottom and start-anchored at the point — never
//                  end-anchored, never left of the point, never on the row line
//                  where the label and its badges are. (The up-arc bows left, its
//                  word sits right of its foot: a default named for her eye.)
//   the width      C-7g item 2 (hers — the only option that bounds the width BY
//                  CONSTRUCTION; scrolling and a narrower fold ruled out by her
//                  measurement): a block of words WRAPS at `WRAP` px by the
//                  geometry's own estimate (≈ 30 characters at the dense size —
//                  a default, hers to move), the row GROWS by a line for each
//                  wrapped line on that side, and a line that continues ends with
//                  the separator. The column degrades by height, never by width.
//   does-not-hold  a DISTINCT glyph: the stroke dashed and the word prefixed `¬`
//   a loop         a small ring at the point per loop — below the row line, to the
//                  right, LEADING their words' block (the rings are the block's
//                  bullet, so a wrapped block hangs from them and reads top to
//                  bottom; C-7g item 2 — Φ1's six words fall under the wrap rule,
//                  her confirmation reopened); the words in the rings' order,
//                  indented past the rings; the down-arcs' block follows beneath
//                  (six at Φ1 — found at the eye at C-7c: a word above each ring
//                  overlapped its neighbours)
//   arity ≥ 3      a tuple-node offset right of the column, legs numbered 1 … n at
//                  the node, the word on the node
//   axioms/warrant text beneath, carried
//   the unrecorded NOTHING
// THE TWO ABSENCES: no cast → the panel returns null (nothing, no frame); a
// cast of nothing → the card's own sentence `a cast of nothing — no roles`,
// never an empty column (which reads as *not loaded*).
// THE COVERING (C-7d item 3, Arman's word: "diagrams being covered by the text
// layer") — MEASURED: every up-arc leaves its point HORIZONTALLY to the left,
// straight through the label lane, and the labels were drawn after the arcs
// with an OPAQUE RECT halo (painter's order inside the SVG: a later sibling
// covers an earlier one), so the rects hid the first segment of every arc that
// ended at that row. CURED: the halo is now the GLYPH'S OWN OUTLINE
// (`paint-order: stroke` with the ground colour), no rect — an arc is hidden
// only inside the letters, never in a box. The arc WORDS (the 1315 letter §2.1:
// "stacked in the same vertical band, crossing one another") were first spread
// along their own arcs (C-7d) — which moved the pile from beside the points to
// the APEX BAND; C-7f item 1 moves each word to its arc's FOOT instead (above).
// THE SIZES (C-7f item 7, hers): three sizes, each with a job — reading 14 px
// (the inspector's card, `text-sm`), label 12 px (the point labels; the canvas
// panel's sentences), dense-data 11 px (the arc, loop and node words, the leg
// numbers — up from 10: the most numerous, most collision-prone text no longer
// sits at the bottom of the scale). `compact` is RETIRED (item 6: a projection
// source is WHOLE, or WORDS — never a thumbnail).
// C-7d item 1 drew a single glued column with `both` alone glyphed and `from B`
// told apart by a quiet tint; C-7f item 4 (the designer): the glued column is
// the first place in this layer where a fact's ORIGIN is not visible from where
// it sits, so ORIGIN IS WRITTEN there, never shown by colour alone — every role
// and every tuple carries its origin in WORDS (`both` · `from A` · `from B`,
// through `MarkExtra.origin` / `PointExtra.origin`); the tint may stay as
// reinforcement. Her rider: a TRANSLATED word carries the mark (`s ≡ t` — the
// act, and the rare one); an untranslated word is the ground state and carries
// none — an alike spelling is shown plain (`MarkExtra.word`), its origin beside it.

import { type ReactElement, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Shape, VertexId } from '../types/geometry';
import { castSummaryLine } from '../lib/castLoader';
import { insideOf, type ArcSide, type Inside, type InsideArc, type InsideLoop, type InsidePoint, type InsideTupleNode } from '../lib/castInside';
import { spaceOf } from '../lib/spaceOf';

/** C-7b — what the midpoint's unfolding adds to a mark: the origin colouring (`both` alone gets a glyph) */
export interface MarkExtra {
  emphasis?: boolean; // the amber stroke — `both`, or a point in the person's map
  glyph?: string; // the glyph before the word (`≡` for both, in the unfolded columns)
  tint?: boolean; // C-7d: the quiet tint — a mark from the OTHER side in a single glued column (reinforcement, never the carrier)
  word?: string; // C-7f item 4: the word as displayed — an alike spelling shown plain, its origin written beside it
  origin?: string; // C-7f item 4: the origin in WORDS (`both` · `from A` · `from B`), written after the word
  solid?: boolean; // C-7h item 2: a tuple the SOLID composed — in the solid's grey, no glyph, no word (the site's sentence states the identity once)
  attrs?: Record<string, string>;
}

/** C-7b — a point that can be pointed at */
export interface PointExtra {
  onClick?: () => void;
  emphasis?: boolean; // a point the person has picked or paired
  tint?: boolean; // C-7d: a role from the other side in a single glued column
  origin?: string; // C-7f item 4: the role's origin in words, after its label
  solid?: boolean; // C-7h item 2 (the designer: do not mark the ordinary; the least mark that still separates composed from the person's act and from the untouched): a role the SOLID composed — its point a HOLLOW ring, its label in the solid's grey, no words; the site's sentence names the mark once
  attrs?: Record<string, string>;
}

/** the ground colour behind a glyph's outline (the canvas panel's ground) */
const GROUND = '#0c0a09';
/** the layer's sizes (C-7f item 7): the point labels; the dense data — arc, loop and node words, leg numbers */
const LABEL = 12;
const DENSE = 11;

export interface InsideLayoutOptions {
  /** the base row pitch — a row GROWS by a line per wrapped line on either side (C-7g); the column degrades by height, never by width or by shrinking below legibility */
  row?: number;
  /** the point column's x inside the group */
  px?: number;
  /** the group's top y */
  top?: number;
  /** characters a caller's extras add to every word (the glued column writes ` from A` after each) — for the wrap and the reach estimate */
  footExtra?: number;
  /** C-13d: a floor for the label lane from a MEASUREMENT of the rendered labels (the browser's pass) — never below the estimate */
  labelLane?: number;
}

/** C-7g — the words at one point, WRAPPED into lines by the geometry (the drawing reads them; it never re-wraps): ordinals into `inside.arcs` / the point's own loops */
export interface PointLines {
  up: number[][]; // the up-arcs' words — the block ABOVE the row line, right of the point
  loops: number[][]; // the loops' words — the block BELOW the row line, led by the rings, indented past them
  down: number[][]; // the down-arcs' words — the block beneath the loops'
  above: number; // lines above the row line
  below: number; // lines below it
}

export interface InsideGeometry {
  row: number;
  px: number;
  top: number;
  height: number;
  columnBottom: number; // the y where the last row ends — the text lines beneath start here
  leftReach: number; // how far the up-arcs and labels reach left of px
  labelLane: number; // C-13d: the lane the labels are laid in — the longest label's estimate, the floor, or a measured floor, whichever is widest
  rightReach: number; // how far the down-arcs, the word blocks and tuple-nodes reach right of px
  yOf: (index: number) => number;
  lines: (index: number) => PointLines;
}

/** C-13d: the label lane's FLOOR — the lane itself derives from the longest label (see `labelWide`); 118 was the whole rule once
 * and clipped the new seat's `the involuntary omission` at the drawing's left edge (Arman's names will often be long) */
const LABEL_LANE = 118;
/** a role's label with its badges, as the row prints it — an estimate at the label size (7.2 px a glyph, the mono ids wider): what the lane must hold */
const labelWide = (point: InsidePoint): number => {
  const text = point.label ?? point.id;
  const badges = point.badges.reduce((n, b) => n + 3 + (b.home === 'signature' ? `${b.key} ${b.value}` : b.value).length, 0);
  return (text.length + badges) * (point.label ? 7.2 : 7.6);
};
const NODE_GAP = 46;
/** the arc's horizontal reach as a fraction of its half-span — a flattened half-ellipse; the side and the nesting are untouched by it */
const ARC_FLATTEN = 0.62;
/** C-7g item 2 — the width a block of words takes before it WRAPS, by the geometry's own estimate (≈ 30 characters at the dense size): the column's width is bounded by construction. A default, the designer's to move. */
export const WRAP = 200;
/** the line pitch inside a wrapped block and between one row's down block and the next row's up block — HALF A ROW (15 px for the 11 px dense size; measured at the eye: at 12 and at 13 px the line boxes of the default sans, ≈ 14.2 px tall at 11 px, still touched by a pixel and the blind metric counted them though no glyph met another; at half a row the column's vertical grid is one pitch throughout) */
const LINE = 15;
const idSafe = (s: string): string => s.replace(/[^A-Za-z0-9_-]/g, '-');

const wordOf = (type: string, polarity: 'holds' | 'does-not-hold'): string => (polarity === 'does-not-hold' ? `¬ ${type}` : type);
/** one word's width in a row, by the estimate — the word, a caller's extra, the separator */
const wordWide = (word: string, extra: number): number => 6 * (word.length + extra + 3);
/** a line of words in one text — an estimate of its width at the dense size */
const lineWide = (words: string[], extra: number, lead = 0): number => (words.length === 0 ? 0 : lead + words.reduce((n, w) => n + wordWide(w, extra), 0) + 10);
/** greedy wrap at WRAP: items into lines, a line never wider than WRAP by the estimate unless one word alone exceeds it (a word is never broken); `lead` is what the first line already holds (the rings) */
function wrapItems<T>(items: T[], word: (item: T) => string, extra: number, lead = 0): T[][] {
  const lines: T[][] = [];
  let line: T[] = [];
  let width = lead;
  for (const item of items) {
    const w = wordWide(word(item), extra);
    if (line.length && width + w > WRAP) {
      lines.push(line);
      line = [];
      width = 0;
    }
    line.push(item);
    width += w;
  }
  if (line.length) lines.push(line);
  return lines;
}

/** the geometry the column occupies — computed from the inside alone, so a composite (the midpoint's unfolding) can place two columns without overlap */
export function insideGeometry(inside: Inside, options: InsideLayoutOptions = {}): InsideGeometry {
  const row = options.row ?? 30;
  const px = options.px ?? 0;
  const top = options.top ?? 0;
  const footExtra = options.footExtra ?? 0;
  const half = row / 2;
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
  // C-7g — the words at each point, WRAPPED: the up-arcs' block above the row line, the loops' (led by their rings) and then
  // the down-arcs' below it — all to the RIGHT of the point (item 1: the label lane is arity-1's); no line wider than WRAP
  // by the estimate (item 2: the width takes the next line, and the row grows)
  const arcWord = (i: number): string => wordOf(inside.arcs[i].type, inside.arcs[i].polarity);
  const linesAt: PointLines[] = inside.points.map((p) => {
    const ordinals = (side: ArcSide): number[] => inside.arcs.map((a, i) => ({ a, i })).filter(({ a }) => a.from === p.index && a.side === side).map(({ i }) => i);
    const loopsHere = inside.loops.map((l, i) => ({ l, i })).filter(({ l }) => l.at === p.index);
    const up = wrapItems(ordinals('up'), arcWord, footExtra);
    const down = wrapItems(ordinals('down'), arcWord, footExtra);
    const loops = wrapItems(loopsHere, ({ l }) => wordOf(l.type, l.polarity), footExtra, loopsHere.length * 14 + 2).map((line) => line.map(({ i }) => i));
    return { up, loops, down, above: up.length, below: loops.length + down.length };
  });
  // C-7h item 4 (the designer's live drive: Φ1's down block centred 74 px below its row and 31 px from another — a foot block
  // may not cross the MIDPOINT to the next row; where the wrap would, the rows OPEN to hold it): a row's extent on a side is
  // at least twice the depth of its last line there, less the neighbour's own half-row (the neighbour's extent is at least
  // that), rounded up to the half-row grid — so every line of a block is nearer its own row line than the next; a row with
  // one line a side keeps the base pitch. Above the line the block hangs at 3.5 px, below it starts at 11.5 (item 3: the
  // down-words FIRST, at the up-words' distance; the loops' block, led by its rings, beneath them)
  const onGrid = (need: number): number => half + LINE * Math.max(0, Math.ceil((need - half) / LINE));
  const topExtent = (l: PointLines): number => (l.above ? onGrid(2 * (3.5 + LINE * (l.above - 1)) - half) : half);
  const bottomExtent = (l: PointLines): number => (l.below ? onGrid(2 * (11.5 + LINE * (l.below - 1)) - half) : half);
  const ys: number[] = [];
  let y = top;
  for (const l of linesAt) {
    y += topExtent(l);
    ys.push(y);
    y += bottomExtent(l);
  }
  const columnBottom = inside.points.length ? y : top + row;
  const yOf = (index: number): number => ys[index];
  // the widest line by the estimate — bounded by WRAP unless one word alone exceeds it; the rings lead the loops' first line
  let widest = 0;
  linesAt.forEach((l, pi) => {
    for (const line of l.up) widest = Math.max(widest, lineWide(line.map(arcWord), footExtra));
    for (const line of l.down) widest = Math.max(widest, lineWide(line.map(arcWord), footExtra));
    const rings = inside.loops.filter((loop) => loop.at === pi).length;
    for (const line of l.loops) widest = Math.max(widest, lineWide(line.map((i) => wordOf(inside.loops[i].type, inside.loops[i].polarity)), footExtra, rings * 14 + 2));
  });
  const rightReach = Math.max(maxDown + 40, widest + 14) + (inside.nodes.length ? NODE_GAP + 110 : 0);
  // C-13d — EVERY NAME READ WHOLE: the lane holds the longest label with its badges (the estimate), never less than the floor;
  // a measured floor from the browser's pass overrides both when a rendered label still crossed the edge
  const labelLane = Math.max(LABEL_LANE, ...inside.points.map((p) => labelWide(p) + 8), options.labelLane ?? 0);
  const leftReach = Math.max(maxUp + 40, labelLane + 12);
  return {
    row,
    px,
    top,
    height: columnBottom - top + (inside.axioms.length + (inside.warrantCarried ? 1 : 0) + inside.unplaced.length) * 16 + 12,
    columnBottom,
    leftReach,
    labelLane,
    rightReach,
    yOf,
    lines: (index: number) => linesAt[index],
  };
}

const arcPath = (arc: InsideArc, g: InsideGeometry, k: number): string => {
  const y1 = g.yOf(arc.from);
  const y2 = g.yOf(arc.to);
  const ry = Math.abs(y2 - y1) / 2;
  // the bulge is a function of the SPAN IN ROWS (the designer measured span encoded), not of the pixels a grown row adds
  const rx = ((Math.abs(arc.to - arc.from) * g.row) / 2) * ARC_FLATTEN + 7 * k;
  // the same sweep for both: from an earlier point down to a later one the arc bows RIGHT; from a later point up to an earlier one it bows LEFT — the side is the tuple's
  return `M ${g.px} ${y1} A ${rx} ${ry} 0 0 1 ${g.px} ${y2}`;
};

/** ONE COLUMN, as SVG children — the midpoint's unfolding composes two of these in one drawing */
export function InsideColumn({ inside, geometry, idPrefix = 'inside', arcExtra, loopExtra, nodeExtra, pointExtra }: {
  inside: Inside;
  geometry: InsideGeometry;
  /** distinct per column — the arc paths carry ids */
  idPrefix?: string;
  /** the midpoint's origin colouring (C-7b) on an arc; C-7f — the word as displayed and its origin in words */
  arcExtra?: (arc: InsideArc) => MarkExtra | null;
  /** …on a loop */
  loopExtra?: (loop: InsideLoop) => MarkExtra | null;
  /** …on a tuple-node */
  nodeExtra?: (node: InsideTupleNode) => MarkExtra | null;
  /** C-7b — a point that can be pointed at; C-7f — its origin in words */
  pointExtra?: (point: InsidePoint) => PointExtra | null;
}) {
  const g = geometry;
  const seenPair = new Map<string, number>();
  const nodeX = g.px + (g.rightReach - (inside.nodes.length ? 120 : 0)) - 20;
  const halo = (width: number) => ({ paintOrder: 'stroke' as const, stroke: GROUND, strokeWidth: width, strokeLinejoin: 'round' as const });
  const arcExtras = inside.arcs.map((arc) => arcExtra?.(arc) ?? null);
  const markWord = (extra: MarkExtra | null, type: string, polarity: 'holds' | 'does-not-hold'): string =>
    `${extra?.glyph ? `${extra.glyph} ` : ''}${extra?.word !== undefined ? wordOf(extra.word, polarity) : wordOf(type, polarity)}`;
  const wordFill = (extra: MarkExtra | null, negative: boolean): string => (extra?.emphasis ? 'fill-amber-200' : negative ? 'fill-rose-300' : extra?.solid ? 'fill-stone-500' : extra?.tint ? 'fill-sky-200/90' : 'fill-stone-300');
  // C-7f item 1 — THE WORD AT THE FOOT: the words of the arcs leaving a point stand at that point (feet cannot cluster: a
  // foot sits at a point, and the points are the rows). C-7g item 1 — THE LABEL LANE IS ARITY-1'S: every word block stands
  // to the RIGHT of the point, start-anchored — the up-arcs' block above the row line, the loops' (led by the rings) and
  // the down-arcs' below it. C-7g item 2 — a block WRAPS at the geometry's width: one <text> per block, one positioned
  // tspan per line, read top to bottom; a line that continues ends with the separator.
  const arcWordSpan = (i: number) => {
    const arc = inside.arcs[i];
    const extra = arcExtras[i];
    const negative = arc.polarity === 'does-not-hold';
    return (
      <tspan key={`w-${i}`}>
        <tspan data-inside-arc-word={String(i)} className={wordFill(extra, negative)}>{markWord(extra, arc.type, arc.polarity)}</tspan>
        {extra?.origin ? <tspan data-inside-origin={extra.origin} className="fill-stone-400">{` ${extra.origin}`}</tspan> : null}
      </tspan>
    );
  };
  const wordBlock = (attrs: Record<string, string>, x: number, y0: number, lines: number[][], span: (ordinal: number) => ReactElement) => (
    <text {...attrs} x={x} y={y0} textAnchor="start" fontSize={DENSE} style={halo(2.5)}>
      {lines.map((line, li) => (
        <tspan key={`l-${li}`} data-inside-line={String(li)} x={x} y={y0 + LINE * li}>
          {line.map((ordinal, k) => (
            <tspan key={`k-${ordinal}`}>
              {k > 0 ? <tspan className="fill-stone-400">{' · '}</tspan> : null}
              {span(ordinal)}
            </tspan>
          ))}
          {li < lines.length - 1 ? <tspan className="fill-stone-400">{' · '}</tspan> : null}
        </tspan>
      ))}
    </text>
  );
  const footBlock = (point: InsidePoint, side: ArcSide) => {
    const L = g.lines(point.index);
    const lines = side === 'up' ? L.up : L.down;
    if (!lines.length) return null;
    const y = g.yOf(point.index);
    // ONE GRID: every baseline in the column is a half-row apart — the up block's LAST line 3.5 px above the row line, the
    // down block's FIRST line 11.5 px below it (C-7h item 3: the down-words hug their row as the up-words do — measured at
    // the eye by the designer, the down blocks sat 22 px from their row under the loops' line, a 1 px margin from the next);
    // the loops' block, led by its rings, follows beneath the down block (measured at C-7g: at −5 / +13 the blocks of
    // neighbouring rows were 12 px apart and the blind metric counted their boxes as touching)
    const y0 = side === 'up' ? y - 3.5 - LINE * (lines.length - 1) : y + 11.5;
    return wordBlock({ 'data-inside-foot-words': `${point.id}|${side}` }, g.px + 10, y0, lines, arcWordSpan);
  };
  return (
    <g data-inside-column="true">
      {inside.arcs.map((arc, i) => {
        const k = `${arc.from}|${arc.to}`;
        const n = seenPair.get(k) ?? 0;
        seenPair.set(k, n + 1);
        const extra = arcExtras[i];
        const negative = arc.polarity === 'does-not-hold';
        return (
          <g key={`arc-${i}`} data-inside-arc={`${arc.type}|${inside.points[arc.from].id}|${inside.points[arc.to].id}|${arc.polarity}|${arc.side}`} {...(extra?.attrs ?? {})}>
            <path id={`${idSafe(idPrefix)}-a${i}`} d={arcPath(arc, g, n)} fill="none" className={extra?.emphasis ? 'stroke-amber-300' : negative ? 'stroke-rose-300/80' : extra?.tint ? 'stroke-sky-300/70' : 'stroke-stone-400/80'} strokeWidth={extra?.emphasis ? 2.2 : 1.2} strokeDasharray={negative ? '4 3' : undefined} />
          </g>
        );
      })}
      {inside.nodes.map((node, i) => {
        const ys = node.legs.map((leg) => g.yOf(leg));
        const ny = ys.reduce((a, b) => a + b, 0) / ys.length;
        const negative = node.polarity === 'does-not-hold';
        const nx = nodeExtra?.(node) ?? null;
        return (
          <g key={`node-${i}`} data-inside-node={`${node.type}|${node.legs.map((leg) => inside.points[leg].id).join(',')}|${node.polarity}`} {...(nx?.attrs ?? {})}>
            {node.legs.map((leg, li) => {
              const ly = g.yOf(leg);
              const tx = nodeX + (g.px - nodeX) * 0.22;
              const ty = ny + (ly - ny) * 0.22;
              return (
                <g key={`leg-${li}`}>
                  <line x1={nodeX} y1={ny} x2={g.px} y2={ly} className={negative ? 'stroke-rose-300/70' : 'stroke-stone-500/80'} strokeWidth={1} strokeDasharray={negative ? '4 3' : undefined} />
                  <text data-inside-leg={String(li + 1)} x={tx} y={ty - 3} fontSize={DENSE} textAnchor="middle" className="fill-stone-300" style={halo(2.5)}>{String(li + 1)}</text>
                </g>
              );
            })}
            <circle cx={nodeX} cy={ny} r={5} className={nx?.emphasis ? 'fill-stone-950 stroke-amber-300' : negative ? 'fill-stone-950 stroke-rose-300' : nx?.tint ? 'fill-stone-950 stroke-sky-300' : 'fill-stone-950 stroke-stone-300'} strokeWidth={nx?.emphasis ? 2 : 1.2} />
            <text x={nodeX + 9} y={ny + 3.5} fontSize={DENSE} style={halo(2.5)}>
              <tspan data-inside-node-word="true" className={wordFill(nx, negative)}>{markWord(nx, node.type, node.polarity)}</tspan>
              {nx?.origin ? <tspan data-inside-origin={nx.origin} className="fill-stone-400">{` ${nx.origin}`}</tspan> : null}
            </text>
          </g>
        );
      })}
      {inside.points.map((point) => {
        const y = g.yOf(point.index);
        const loops = inside.loops.filter((l) => l.at === point.index);
        const extra = pointExtra?.(point) ?? null;
        const labelText = point.label ?? point.id;
        return (
          <g
            key={point.id}
            data-inside-point={point.id}
            data-inside-address={point.label ? undefined : 'true'}
            className={extra?.onClick ? 'cursor-pointer' : undefined}
            onClick={extra?.onClick}
            {...(extra?.attrs ?? {})}
          >
            {/* the halo is the glyphs' own outline — an arc passing the label lane stays visible between the letters */}
            <text x={g.px - 10} y={y + 3.5} textAnchor="end" fontSize={LABEL} className={extra?.solid ? 'fill-stone-500' : extra?.tint ? 'fill-sky-100' : point.label ? 'fill-stone-100' : 'fill-stone-300'} style={halo(3)}>
              <tspan data-inside-label="true" className={point.label ? '' : 'font-mono'}>{labelText}</tspan>
              {point.badges.map((b, bi) => (
                <tspan key={`${b.key}-${bi}`} data-inside-badge={`${b.key}=${b.value}`} data-inside-mold={b.mold ? 'true' : undefined} className={b.value === 'UNKNOWN' ? 'fill-amber-200' : 'fill-stone-400'}>
                  {` · ${b.home === 'signature' ? `${b.key} ${b.value}` : b.value}`}
                </tspan>
              ))}
              {extra?.origin ? <tspan data-inside-origin={extra.origin} className="fill-stone-400">{` · ${extra.origin}`}</tspan> : null}
            </text>
            {/* C-7h item 2: a role the solid composed is a HOLLOW ring — one glyph, one meaning, named once in the site's sentence */}
            <circle cx={g.px} cy={y} r={extra?.emphasis ? 4.2 : 3.2} fill={extra?.solid ? 'none' : undefined} data-inside-solid={extra?.solid ? 'true' : undefined} className={extra?.solid ? 'stroke-stone-400' : extra?.emphasis ? 'fill-amber-300 stroke-amber-100' : extra?.tint ? 'fill-sky-200 stroke-stone-950' : 'fill-stone-200 stroke-stone-950'} strokeWidth={extra?.solid ? 1.2 : 1} />
            {loops.map((loop, li) => {
              const cx = g.px + 10 + li * 14;
              const negative = loop.polarity === 'does-not-hold';
              const lx = loopExtra?.(loop) ?? null;
              return (
                <g key={`loop-${li}`} data-inside-loop={`${loop.type}|${point.id}|${loop.polarity}`} {...(lx?.attrs ?? {})}>
                  {/* the rings lead their words' block below the row line — a wrapped block hangs from them and reads top to bottom */}
                  <circle cx={cx} cy={y + 8 + LINE * g.lines(point.index).down.length} r={5} fill="none" className={lx?.emphasis ? 'stroke-amber-300' : negative ? 'stroke-rose-300' : lx?.solid ? 'stroke-stone-500' : lx?.tint ? 'stroke-sky-300' : 'stroke-stone-300'} strokeWidth={lx?.emphasis ? 2 : 1.1} strokeDasharray={negative ? '3 2' : undefined} />
                </g>
              );
            })}
            {loops.length
              ? wordBlock({ 'data-inside-loop-words': point.id }, g.px + 10 + loops.length * 14 + 2, y + 11.5 + LINE * g.lines(point.index).down.length, g.lines(point.index).loops.map((line) => line.map((i) => loops.indexOf(inside.loops[i]))), (li) => {
                  const l = loops[li];
                  const lx = loopExtra?.(l) ?? null;
                  const negative = l.polarity === 'does-not-hold';
                  return (
                    <tspan key={`lw-${li}`}>
                      <tspan data-inside-loop-word={String(li)} className={wordFill(lx, negative)}>{markWord(lx, l.type, l.polarity)}</tspan>
                      {lx?.origin ? <tspan data-inside-origin={lx.origin} className="fill-stone-400">{` ${lx.origin}`}</tspan> : null}
                    </tspan>
                  );
                })
              : null}
            {footBlock(point, 'up')}
            {footBlock(point, 'down')}
          </g>
        );
      })}
      {(() => {
        const base = g.columnBottom + 10;
        const lines: Array<{ key: string; text: string; attr: Record<string, string>; className: string }> = [];
        inside.unplaced.forEach((u, i) => lines.push({ key: `unplaced-${i}`, text: `${wordOf(u.type, u.polarity)}(${u.terms.join(', ')}) — not placed: ${u.reason}`, attr: { 'data-inside-unplaced': `${u.type}(${u.terms.join(', ')})` }, className: 'fill-amber-200' }));
        inside.axioms.forEach((a, i) => lines.push({ key: `axiom-${i}`, text: `axiom, carried never evaluated: ${a}`, attr: { 'data-inside-axiom': 'true' }, className: 'fill-stone-400' }));
        if (inside.warrantCarried) lines.push({ key: 'warrant', text: 'warrant carried, never read', attr: { 'data-inside-warrant': 'true' }, className: 'fill-stone-400' });
        return lines.map((l, i) => (
          <text key={l.key} x={g.px - 10 - g.labelLane} y={base + i * 16} fontSize={DENSE} className={l.className} style={halo(2.5)} {...l.attr}>{l.text}</text>
        ));
      })()}
    </g>
  );
}

/** THE DIAGRAM — one cast, one SVG */
export function CastInsideDiagram({ inside, id }: { inside: Inside; id?: string }) {
  // C-13d — THE MEASUREMENT PASS: after a paint, every label's rendered box is read (getBBox, in the drawing's own units); if one
  // still crosses the left edge the lane grows by exactly that much and the drawing lays out again — an estimate is never the
  // last word on a person's name. Grows only; settles in one pass; absent under a server render (no box to read).
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [laneFloor, setLaneFloor] = useState(0);
  const g = useMemo(() => insideGeometry(inside, { px: 0, top: 14, labelLane: laneFloor }), [inside, laneFloor]);
  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let need = 0;
    svg.querySelectorAll('tspan[data-inside-label]').forEach((tspan) => {
      const text = tspan.parentNode as SVGTextElement | null;
      if (!text || typeof text.getBBox !== 'function') return;
      const box = text.getBBox();
      const overflow = -g.leftReach + 4 - box.x;
      if (overflow > need) need = overflow;
    });
    if (need > 0.5) setLaneFloor(g.labelLane + need);
  }, [g]);
  const width = g.leftReach + g.rightReach;
  return (
    <svg
      ref={svgRef}
      data-inside={id ?? 'cast'}
      data-inside-label-lane={String(Math.round(g.labelLane))}
      data-inside-points={String(inside.census.points)}
      data-inside-arrows={String(inside.census.arrows)}
      data-inside-loops={String(inside.census.loops)}
      data-inside-hyper={String(inside.census.hyper)}
      data-inside-negatives={String(inside.census.negatives)}
      data-inside-words={String(inside.census.words)}
      data-inside-marks={String(inside.census.marks)}
      width={width}
      height={g.height + 14}
      viewBox={`${-g.leftReach} 0 ${width} ${g.height + 14}`}
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
// C-10 (2026-09-24): `inline` — the SAME panel through the SAME resolver, placed in the flow of the Manuscript's card
// (the lifted form's corner) instead of over the Ambo's canvas; the Ambo's mount passes nothing and is byte-as-before
export function CastInsidePanel({ shape, vertexId, inline = false }: { shape: Shape; vertexId: VertexId; inline?: boolean }) {
  const vertex = shape.vertices[vertexId];
  // C-8 item 1 — through the one resolver: a seed corner's cast; a born corner's space derived from its parents (never a loaded file on a midpoint, Δ86)
  const resolved = useMemo(() => spaceOf(shape, vertexId), [shape, vertexId]);
  const cast = resolved?.space;
  const inside = useMemo(() => (cast ? insideOf(cast) : null), [cast]);
  if (!vertex || !resolved || !cast || !inside) return null;
  const personLabel = vertex.data.label.trim() ? vertex.data.label : 'unnamed';
  return (
    <div
      data-inside-panel={vertexId}
      data-inside-origin-of-space={resolved.origin}
      data-inside-placement={inline ? 'inline' : 'overlay'}
      className={inline ? 'rounded border border-stone-800 bg-stone-950/85 px-3 py-2' : 'pointer-events-auto absolute bottom-20 left-3 top-14 max-w-[74%] overflow-auto rounded border border-stone-800 bg-stone-950/85 px-3 py-2 shadow-lg'}
    >
      <div className="mb-1 text-xs text-stone-400">
        <span className="text-stone-300">{personLabel}</span>
        {resolved.origin === 'seed' ? ' · the inside of the cast it holds' : ' · the inside of the space it holds, derived from its parents'}
        {cast.subject ? <span className="block text-stone-400">{`of: ${cast.subject}`}</span> : null}
      </div>
      {cast.roles.length === 0 ? (
        <p data-inside-nothing="true" className="text-xs text-stone-300">{castSummaryLine(cast)}</p>
      ) : (
        <CastInsideDiagram inside={inside} id={vertexId} />
      )}
    </div>
  );
}

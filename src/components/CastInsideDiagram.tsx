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
//                  LINEAR function of the span, ≈ 0.30: measured by the designer
//                  from this build's plate, span IS encoded) with its word AT ITS
//                  FOOT, beside the point it leaves from (C-7f item 1, her cut from
//                  this build's own geometry: because bulge is a function of span
//                  and spans REPEAT, apexes CLUSTER into a band — and the word sat
//                  at the apex; FEET cannot cluster, a foot sits at a point and the
//                  points are the column's own rows); the SIDE is the tuple's:
//                  `down` the caster's order on the RIGHT, `up` it on the LEFT —
//                  ruled at her eye (the two sides read as two directions). The
//                  words of the arcs leaving one point stand in ONE ROW on that
//                  side: the down-arcs' just below the row line to the right of the
//                  point, the up-arcs' just above it to the left (the label lane is
//                  on the row line; the up-feet ride above it).
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

import { useMemo } from 'react';
import type { Shape, VertexId } from '../types/geometry';
import { castSummaryLine } from '../lib/castLoader';
import { insideOf, type ArcSide, type Inside, type InsideArc, type InsideLoop, type InsidePoint, type InsideTupleNode } from '../lib/castInside';

/** C-7b — what the midpoint's unfolding adds to a mark: the origin colouring (`both` alone gets a glyph) */
export interface MarkExtra {
  emphasis?: boolean; // the amber stroke — `both`, or a point in the person's map
  glyph?: string; // the glyph before the word (`≡` for both, in the unfolded columns)
  tint?: boolean; // C-7d: the quiet tint — a mark from the OTHER side in a single glued column (reinforcement, never the carrier)
  word?: string; // C-7f item 4: the word as displayed — an alike spelling shown plain, its origin written beside it
  origin?: string; // C-7f item 4: the origin in WORDS (`both` · `from A` · `from B`), written after the word
  attrs?: Record<string, string>;
}

/** C-7b — a point that can be pointed at */
export interface PointExtra {
  onClick?: () => void;
  emphasis?: boolean; // a point the person has picked or paired
  tint?: boolean; // C-7d: a role from the other side in a single glued column
  origin?: string; // C-7f item 4: the role's origin in words, after its label
  attrs?: Record<string, string>;
}

/** the ground colour behind a glyph's outline (the canvas panel's ground) */
const GROUND = '#0c0a09';
/** the layer's sizes (C-7f item 7): the point labels; the dense data — arc, loop and node words, leg numbers */
const LABEL = 12;
const DENSE = 11;

export interface InsideLayoutOptions {
  /** the row pitch — the column degrades by scrolling, never by shrinking below legibility */
  row?: number;
  /** the point column's x inside the group */
  px?: number;
  /** the group's top y */
  top?: number;
  /** characters a caller's extras add to every foot word (the glued column writes ` from A` after each) — for the reach estimate */
  footExtra?: number;
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

const wordOf = (type: string, polarity: 'holds' | 'does-not-hold'): string => (polarity === 'does-not-hold' ? `¬ ${type}` : type);
/** a row of words in one text — the rings' words, the feet's words: an estimate of its width at the dense size */
const wordsWide = (words: string[], extra = 0): number => (words.length === 0 ? 0 : 6 * words.reduce((n, w) => n + w.length + extra + 3, 0) + 10);

/** the geometry the column occupies — computed from the inside alone, so a composite (the midpoint's unfolding) can place two columns without overlap */
export function insideGeometry(inside: Inside, options: InsideLayoutOptions = {}): InsideGeometry {
  const row = options.row ?? 30;
  const px = options.px ?? 0;
  const top = options.top ?? 0;
  const footExtra = options.footExtra ?? 0;
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
    return loops.length === 0 ? 0 : loops.length * 14 + wordsWide(loops.map((l) => wordOf(l.type, l.polarity)), footExtra) + 20;
  }));
  // C-7f item 1 — the feet: the words of the arcs leaving a point stand in one row on the arc's side
  const feetWide = (side: ArcSide): number => Math.max(0, ...inside.points.map((p) => wordsWide(inside.arcs.filter((a) => a.from === p.index && a.side === side).map((a) => wordOf(a.type, a.polarity)), footExtra)));
  const rightReach = Math.max(maxDown + 40, loopsWide, feetWide('down') + 14) + (inside.nodes.length ? NODE_GAP + 110 : 0);
  const leftReach = Math.max(maxUp + 40, LABEL_LANE + 12, feetWide('up') + 14);
  return { row, px, top, height: row * Math.max(inside.points.length, 1) + (inside.axioms.length + (inside.warrantCarried ? 1 : 0) + inside.unplaced.length) * 16 + 12, leftReach, rightReach, yOf };
}

const arcPath = (arc: InsideArc, g: InsideGeometry, k: number): string => {
  const y1 = g.yOf(arc.from);
  const y2 = g.yOf(arc.to);
  const ry = Math.abs(y2 - y1) / 2;
  const rx = ry * ARC_FLATTEN + 7 * k;
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
  const wordFill = (extra: MarkExtra | null, negative: boolean): string => (extra?.emphasis ? 'fill-amber-200' : negative ? 'fill-rose-300' : extra?.tint ? 'fill-sky-200/90' : 'fill-stone-300');
  // C-7f item 1 — THE WORD AT THE FOOT: the words of the arcs leaving a point stand in ONE ROW on the arc's own side — the
  // down-arcs' just below the row line to the right of the point, the up-arcs' just above it to the left (the label lane is
  // on the row line; the up-feet ride above it). Feet cannot cluster: a foot sits at a point, and the points are the rows.
  const footRow = (point: InsidePoint, side: ArcSide) => {
    const feet = inside.arcs.map((arc, i) => ({ arc, i })).filter(({ arc }) => arc.from === point.index && arc.side === side);
    if (!feet.length) return null;
    const y = g.yOf(point.index);
    return (
      <text data-inside-foot-words={`${point.id}|${side}`} x={side === 'down' ? g.px + 10 : g.px - 10} y={side === 'down' ? y + 13 : y - 11} textAnchor={side === 'down' ? 'start' : 'end'} fontSize={DENSE} style={halo(2.5)}>
        {feet.map(({ arc, i }, k) => {
          const extra = arcExtras[i];
          const negative = arc.polarity === 'does-not-hold';
          return (
            <tspan key={`w-${i}`}>
              {k > 0 ? <tspan className="fill-stone-400">{' · '}</tspan> : null}
              <tspan data-inside-arc-word={String(i)} className={wordFill(extra, negative)}>{markWord(extra, arc.type, arc.polarity)}</tspan>
              {extra?.origin ? <tspan data-inside-origin={extra.origin} className="fill-stone-400">{` ${extra.origin}`}</tspan> : null}
            </tspan>
          );
        })}
      </text>
    );
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
            <text x={g.px - 10} y={y + 3.5} textAnchor="end" fontSize={LABEL} className={extra?.tint ? 'fill-sky-100' : point.label ? 'fill-stone-100' : 'fill-stone-300'} style={halo(3)}>
              <tspan data-inside-label="true" className={point.label ? '' : 'font-mono'}>{labelText}</tspan>
              {point.badges.map((b, bi) => (
                <tspan key={`${b.key}-${bi}`} data-inside-badge={`${b.key}=${b.value}`} data-inside-mold={b.mold ? 'true' : undefined} className={b.value === 'UNKNOWN' ? 'fill-amber-200' : 'fill-stone-400'}>
                  {` · ${b.home === 'signature' ? `${b.key} ${b.value}` : b.value}`}
                </tspan>
              ))}
              {extra?.origin ? <tspan data-inside-origin={extra.origin} className="fill-stone-400">{` · ${extra.origin}`}</tspan> : null}
            </text>
            <circle cx={g.px} cy={y} r={extra?.emphasis ? 4.2 : 3.2} className={extra?.emphasis ? 'fill-amber-300 stroke-amber-100' : extra?.tint ? 'fill-sky-200 stroke-stone-950' : 'fill-stone-200 stroke-stone-950'} strokeWidth={1} />
            {loops.map((loop, li) => {
              const cx = g.px + 10 + li * 14;
              const negative = loop.polarity === 'does-not-hold';
              const lx = loopExtra?.(loop) ?? null;
              return (
                <g key={`loop-${li}`} data-inside-loop={`${loop.type}|${point.id}|${loop.polarity}`} {...(lx?.attrs ?? {})}>
                  <circle cx={cx} cy={y - 8} r={5} fill="none" className={lx?.emphasis ? 'stroke-amber-300' : negative ? 'stroke-rose-300' : lx?.tint ? 'stroke-sky-300' : 'stroke-stone-300'} strokeWidth={lx?.emphasis ? 2 : 1.1} strokeDasharray={negative ? '3 2' : undefined} />
                </g>
              );
            })}
            {loops.length ? (
              <text data-inside-loop-words={point.id} x={g.px + 10 + loops.length * 14 + 2} y={y - 5} fontSize={DENSE} style={halo(2.5)}>
                {loops.map((l, li) => {
                  const lx = loopExtra?.(l) ?? null;
                  const negative = l.polarity === 'does-not-hold';
                  return (
                    <tspan key={`lw-${li}`}>
                      {li > 0 ? <tspan className="fill-stone-400">{' · '}</tspan> : null}
                      <tspan data-inside-loop-word={String(li)} className={wordFill(lx, negative)}>{markWord(lx, l.type, l.polarity)}</tspan>
                      {lx?.origin ? <tspan data-inside-origin={lx.origin} className="fill-stone-400">{` ${lx.origin}`}</tspan> : null}
                    </tspan>
                  );
                })}
              </text>
            ) : null}
            {footRow(point, 'down')}
            {footRow(point, 'up')}
          </g>
        );
      })}
      {(() => {
        const base = g.top + g.row * Math.max(inside.points.length, 1) + 10;
        const lines: Array<{ key: string; text: string; attr: Record<string, string>; className: string }> = [];
        inside.unplaced.forEach((u, i) => lines.push({ key: `unplaced-${i}`, text: `${wordOf(u.type, u.polarity)}(${u.terms.join(', ')}) — not placed: ${u.reason}`, attr: { 'data-inside-unplaced': `${u.type}(${u.terms.join(', ')})` }, className: 'fill-amber-200' }));
        inside.axioms.forEach((a, i) => lines.push({ key: `axiom-${i}`, text: `axiom, carried never evaluated: ${a}`, attr: { 'data-inside-axiom': 'true' }, className: 'fill-stone-400' }));
        if (inside.warrantCarried) lines.push({ key: 'warrant', text: 'warrant carried, never read', attr: { 'data-inside-warrant': 'true' }, className: 'fill-stone-400' });
        return lines.map((l, i) => (
          <text key={l.key} x={g.px - 10 - LABEL_LANE} y={base + i * 16} fontSize={DENSE} className={l.className} style={halo(2.5)} {...l.attr}>{l.text}</text>
        ));
      })()}
    </g>
  );
}

/** THE DIAGRAM — one cast, one SVG */
export function CastInsideDiagram({ inside, id }: { inside: Inside; id?: string }) {
  const g = useMemo(() => insideGeometry(inside, { px: 0, top: 14 }), [inside]);
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
      <div className="mb-1 text-xs text-stone-400">
        <span className="text-stone-300">{personLabel}</span>
        {' · the inside of the cast it holds'}
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

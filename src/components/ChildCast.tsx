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
 * H · THE ZOOM on the drawing: `whole · zoom in · zoom out`. Since STAMP ZOOM (10-19) the drawing sits in the frame every diagram shares (`ZoomFrame`,
 * its marks `midpoint-child`): it opens whole, never changes size by itself, and moves only by his acts — the box takes the drawing's height up to 46%
 * of the window's (the point tab's head already stands above it, measured at 1689 × 897: a box of 46% of what was left fitted Culture at 0.51, too small
 * to read). The role chosen is the page's view (`childView`, keyed by the site); the zoom is the frame's (`zoomScales`).
 * The child's relations (its filled loops, ADR 0031 §9.40–§9.42) are drawn by the slices that follow (B–E); D4's pulled-back record is READ, never drawn
 * here (the approved form draws none of it).
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Shape, VertexId } from '../types/geometry';
import { childRecordsOf, useGeometryStore } from '../store/geometryStore';
import { childSpaceOf, columnSpaceOf, instancesFrom, sentenceWordsOf, termWordsOf, wordWordsOf } from '../lib/instanceSpace';
import { ALONG, IS, IS_GLYPH, barsOn, dirOf, instancesOn, type Relating } from '../lib/relatings';
import { dependenceTuplesOf } from '../lib/castInside'; // §9.73 — the one reader of a cast's second part
import { RelatingCard, type ParentEnd } from './FoundationCard'; // §9.73 (2) — what each parent's end rests on, at the child's card
import { isSeedVertex } from '../lib/spaceOf';
import { towerEndOf } from '../lib/tower'; // ⟨G3⟩ (Δ243) — a born parent's end reads the tower
import { edgeBetween } from '../lib/faceReading';
import { ChildLoopCard, loopWordsOf } from './ChildLoopCard';
import { ZoomFrame } from './ZoomFrame';
import { childArcDetailsOf, childLoopsCached, loopIdOf, loopReadingFor, loopRecordsFor, relationNameOf, roleIdOf, selfIdOf, selfKindKeyOf, type ChildLoop, type ChildRecords, type LoopReading } from '../lib/childLoops';

/** the child as its one reader hands it (`childSpaceOf`) — typed by that reader, never by the cast's own type (the concept-type census: the resolver
 *  and the child's reader are the readers of a cast; this file only draws what they hand it) */
type ChildSpace = NonNullable<ReturnType<typeof childSpaceOf>>;

/** the drawing's measures (the mock's): the points' column sits right of the band the child's relations will be drawn in; a named row is taller (its sentence under it) */
const DOT = 150;
const PITCH = 22;
const NAMED = 36;
const TOP = 14;

export interface ChildRow {
  key: string; // the role's key — the relating it is (`instanceKey`)
  sentence: string; // its sentence, through the one reader of a term's words (`(the price is the case as the instituted)`)
  name: string | null; // his name for it, a true absence until he gives one
  top: number;
  y: number; // the point's centre
  h: number;
}

/** the rows, laid out from the child's roles in their order (the edge's), and the drawing's natural size — one reader for the drawing and the zoom's fit */
export function childRowsOf(shape: Shape, siteId: VertexId, child: ChildSpace, nameOf: (key: string) => string | null, tailOf: (key: string) => string = () => '', records?: ChildRecords): { rows: ChildRow[]; width: number; height: number } {
  let y = TOP;
  let widest = 0;
  const rows = child.roles.map((r) => {
    const name = nameOf(r.id);
    const sentence = sentenceWordsOf(shape, siteId, r.id, records ? { records } : {}); // G: its terms by his names where he gave them
    const h = name ? NAMED : PITCH;
    const row: ChildRow = { key: r.id, sentence, name, top: y, y: y + 8, h };
    const tail = tailOf(r.id);
    widest = Math.max(widest, textWide(row) + (tail ? 10 + 5.6 * tail.length : 0), name ? 6.4 * sentence.length : 0);
    y += h;
    return row;
  });
  return { rows, width: Math.ceil(DOT + 12 + widest + 16), height: y + TOP };
}
const idSafe = (s: string): string => s.replace(/[^A-Za-z0-9_-]/g, '-');
/** a row's first line, by the estimate: its name in the serif, or its sentence */
const textWide = (r: ChildRow): number => (r.name ? 7.4 * r.name.length : 6.4 * r.sentence.length);
/** an arc between two rows, bowed left of the points' column — the further apart, the wider, never past the band (the mock's) */
const arcPath = (y1: number, y2: number): string => { const rx = Math.min(140, 14 + 0.5 * Math.abs(y2 - y1)); return `M${DOT},${y1} C${DOT - rx},${y1} ${DOT - rx},${y2} ${DOT},${y2}`; };

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

export function ChildCast({ shape, siteId, child, litOf, onHoverRow }: {
  shape: Shape;
  siteId: VertexId;
  child: ChildSpace;
  /** LAYOUT-1 §5's hover across the drawings: whether a row is lit, or dimmed, while something is hovered */
  litOf: (key: string, sentence: string) => { lit: boolean; dim: boolean };
  onHoverRow: (key: string | null, sentence: string) => void;
}) {
  // subscribed with the hook (the page re-renders on each act), read through `getState()`: under node's render a hook reads the store's INITIAL
  // snapshot, so a witness setting a name, a refusal or a view must see the live state (MediumBlock's rule for the lexicon and the rules)
  useGeometryStore((s) => s.roleNames);
  useGeometryStore((s) => s.roleNameRefusal);
  useGeometryStore((s) => s.childView);
  useGeometryStore((s) => s.loopAnswers);
  useGeometryStore((s) => s.loopRules);
  useGeometryStore((s) => s.relationNames);
  useGeometryStore((s) => s.relationView);
  useGeometryStore((s) => s.converses);
  useGeometryStore((s) => s.opaque);
  const { roleNames, roleNameRefusal: refusalHeld, childView: viewHeld, nameRole, withdrawRoleName, clearRoleNameRefusal, setChildView, loopAnswers, loopRules, relationNames, relationView: relHeld, setRelationView, converses, opaque } = useGeometryStore.getState();
  // F: his records, from the store's one source — a born parent's say is its filled loops; G: a parent's role by his name where he gave one
  const childRecords = childRecordsOf(useGeometryStore.getState());
  // ── E · the child's loops as the drawing reads them: every closed loop with what it comes to ──
  const L = childLoopsCached(shape, siteId, childRecords);
  const records = L ? loopRecordsFor(shape, siteId, L, loopAnswers, loopRules, { converses, opaque }) : null;
  const readings: Array<{ loop: ChildLoop; id: string; r: LoopReading }> = L && records ? L.loops.map((loop) => ({ loop, id: loopIdOf(L, loop), r: loopReadingFor(L, loop, records) })) : [];
  // his name for a filled loop's relation, kept on its KIND (§9.48 Q3), read as that loop sees it
  const relNameOf = (id: string): { name: string; from: string } | null => { const x = L ? L.loops.find((l) => loopIdOf(L, l) === id) : undefined; return L && x ? relationNameOf(relationNames, shape.id, siteId, L, x) : null; };
  const indexOf = (key: string): number => (L ? L.roles.findIndex((r) => r.key === key) : -1);
  const plural = (n: number, one: string, many = `${one}s`): string => `${n} ${n === 1 ? one : many}`;
  /** a row's count at its end (the designer's 10:56): its relations (filled loops), its holes, its loops waiting — the asked ones only */
  const tailOf = (key: string): string => {
    const k = indexOf(key);
    const mine = readings.filter((x) => (x.loop.i === k || x.loop.j === k) && !x.loop.form && x.loop.kind !== 'two' && (!x.loop.pair || x.loop.law)); // a loop filled by law counts (ITEM 2 · part 1)
    const n = (s: string): number => mine.filter((x) => x.r.state === s).length;
    const relations = n('filled') + (L ? L.selfs.filter((sl) => sl.i === k).length : 0); // and the role's loop with itself, as in the head
    return [relations ? plural(relations, 'relation') : null, n('hole') ? plural(n('hole'), 'hole') : null, n('waits') ? `${plural(n('waits'), 'loop')} waiting` : null].filter(Boolean).join(' · ');
  };
  const relView = relHeld && relHeld.siteId === siteId ? relHeld : null;
  const view = viewHeld && viewHeld.siteId === siteId ? viewHeld : { siteId, key: null };
  // names are kept per shape, as the relatings they name are: this shape's record, at this site
  const nameOf = (key: string): string | null => roleNames.find(([sh, s, k]) => sh === shape.id && s === siteId && k === key)?.[3] ?? null;
  const { rows, width, height } = childRowsOf(shape, siteId, child, nameOf, tailOf, childRecords);
  const chosen = view.key !== null ? rows.find((r) => r.key === view.key) ?? null : null;
  /** a role referred to: its name alone where he gave one, else its sentence (the designer's 09:18 §2) */
  const roleRefOf = (k: string): string => nameOf(k) ?? sentenceWordsOf(shape, siteId, k, { records: childRecords });
  // §9.73 (2) under Δ163 (the designer's 13:50; the mothership's 13:48): the chosen moment stands on its two coordinates (D14); what each of them rests on in its PARENT'S
  // cast is read by the one reader of foundation, with `crossed as (…)` where he related that foundation at this edge (the page's words for a relating) and `barred: (…)`
  // where he barred it (the word struck as the drawing strikes a bar's); NOTHING where he said nothing — the count counts the crossed and prints no zero. A born parent's
  // moment rests on its coordinates, which the edge's legs draw, and has no line here
  const standsOn = (key: string): ReactNode => {
    const v = shape.vertices[siteId];
    if (!v || v.createdBy.operation === 'seed' || v.createdBy.sourceVertexIds.length !== 2) return null;
    const edge = edgeBetween(shape.edges, v.createdBy.sourceVertexIds[0], v.createdBy.sourceVertexIds[1]);
    if (!edge) return null;
    const [P, Q] = edge.vertexIds as [VertexId, VertexId];
    const inst = instancesFrom(shape, P, Q, { records: childRecords }).find((i) => i.key === key);
    if (!inst) return null;
    const label = (c: VertexId): string => shape.vertices[c]?.data.label?.trim() || 'unnamed';
    const nameAt = (c: VertexId) => (id: string): string => termWordsOf(shape, c, id, { records: childRecords });
    const wordsOf = (r: Relating): string => { const w = r[0] === IS ? IS_GLYPH : r[0]; return dirOf(r) === ALONG ? `(${nameAt(P)(r[1])} ${w} ${nameAt(Q)(r[2])})` : `(${nameAt(Q)(r[2])} ${w} ${nameAt(P)(r[1])})`; };
    const barWordsOf = (r: Relating): ReactNode => (dirOf(r) === ALONG
      ? <>{`(${nameAt(P)(r[1])} `}<span data-dependence-bar-word={r[0]} style={{ textDecoration: 'line-through' }}>{r[0]}</span>{` ${nameAt(Q)(r[2])})`}</>
      : <>{`(${nameAt(Q)(r[2])} `}<span data-dependence-bar-word={r[0]} style={{ textDecoration: 'line-through' }}>{r[0]}</span>{` ${nameAt(P)(r[1])})`}</>);
    const end = (c: VertexId, id: string, side: 1 | 2): ParentEnd => {
      // ⟨G3⟩ of ADR 0031 §9.73 (2) (Arman's Δ243; GROUP 4 · slice 3): a BORN parent's end reads THE TOWER — its moment rests on its coordinates and on what those rest on, down to
      // the seeds (src/lib/tower.ts), each foundation named with its concept; `crossed as …` where a moment of THIS site reaches the foundation along its legs; `barred: …` where a
      // bar at this edge stands on such a moment. A seed parent's end reads as before (the ratified generation-1 reading, its count unchanged)
      if (!isSeedVertex(shape, c)) {
        const T = towerEndOf(shape, c, id, siteId, { records: childRecords });
        const endAt = (r: Relating): string => r[side];
        return { label: label(c), tuples: T.tuples, id: T.id, nameOf: T.nameOf, crossed: (f) => T.reached(f).map((m) => termWordsOf(shape, siteId, m, { records: childRecords })), barred: (f) => T.barsReaching(f, barsOn(edge), endAt).map(barWordsOf) };
      }
      return {
        label: label(c),
        tuples: dependenceTuplesOf(columnSpaceOf(shape, c, { records: childRecords })),
        id,
        nameOf: nameAt(c),
        crossed: (f) => instancesOn(edge).filter((r) => r[side] === f).map(wordsOf),
        barred: (f) => barsOn(edge).filter((r) => r[side] === f).map(barWordsOf),
      };
    };
    return <RelatingCard head={null} ends={[end(P, inst.p, 1), end(Q, inst.q, 2)]} pressable />;
  };

  // ── A · the card's field: opens empty for a role never named; `rename` opens it with the name, selected whole ──
  // the refusal stands only while its holder still holds the name it cites (a holder's relating withdrawn takes the name, and the refusal with it)
  const refusal = refusalHeld && refusalHeld.siteId === siteId && chosen && refusalHeld.key === chosen.key && roleNames.some(([sh, s, k, n]) => sh === shape.id && s === siteId && k === refusalHeld.holder && n === refusalHeld.name) ? refusalHeld : null;
  const [renaming, setRenaming] = useState<string | null>(null); // the key whose name is being changed
  const [draft, setDraft] = useState<string>(refusal?.name ?? '');
  const choose = (key: string): void => {
    setRenaming(null);
    setDraft('');
    clearRoleNameRefusal();
    setChildView({ siteId, key: view.key === key ? null : key });
    if (relView) setRelationView(null);
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
      {L ? (() => {
        // the concept's counts (the designer's 10:56 and 11:24): its relations — the filled loops — in pieces (roles joined by them), and its loops by state
        const asked = readings.filter((x) => !x.loop.form && x.loop.kind !== 'two' && !x.loop.pair);
        const throughPair = readings.filter((x) => !x.loop.form && x.loop.kind !== 'two' && x.loop.pair).length;
        const n = (s: string): number => asked.filter((x) => x.r.state === s).length;
        const parent = L.roles.map((_, k) => k);
        const find = (k: number): number => (parent[k] === k ? k : (parent[k] = find(parent[k])));
        for (const x of asked) if (x.r.state === 'filled') parent[find(x.loop.i)] = find(x.loop.j);
        // §9.46 (4), §9.48 (5): a loop between two pairs filled by law (his τ makes the two ways' words one) is a relation of the child too, and so is a pair's
        // loop with itself — one count with the traces' (`filledCountOf`)
        const byLaw = readings.filter((x) => x.loop.law && x.r.state === 'filled');
        for (const x of byLaw) parent[find(x.loop.i)] = find(x.loop.j);
        const relations = n('filled') + byLaw.length + L.selfs.length;
        const pieces = new Set(L.roles.map((_, k) => find(k))).size;
        const form = readings.filter((x) => x.loop.form).length;
        const two = readings.filter((x) => x.loop.kind === 'two').length;
        // his named relations, each pressable — drawing the pairs it covers
        // ITEM 2 · part 1's rider (the designer's look of 18:15; §9.46 (4), §9.48): a filled relation is listed like any other — the loop filled by law and the
        // role's loop with itself among them
        const words = new Map<string, string[]>();
        for (const x of [...asked, ...byLaw]) { const nm = x.r.state === 'filled' ? relNameOf(x.id) : null; if (nm) words.set(nm.name, [...(words.get(nm.name) ?? []), x.id]); }
        for (const sl of L.selfs) { const held = relationNames.find(([sh2, v, k]) => sh2 === shape.id && v === siteId && k === selfKindKeyOf(L, sl)); if (held) words.set(held[3], [...(words.get(held[3]) ?? []), selfIdOf(L, sl)]); }
        return (
          <>
            <span data-midpoint-child-counts={`${relations}|${pieces}|${n('waits')}|${n('hole')}|${n('settled')}|${form}|${two}`} className="text-stone-400">
              {(() => {
                // the designer's 17:46 and 17:55: every zero after `loops:` is left out (a missing count means none); the head keeps its relation count,
                // since the pieces need it
                const parts = [n('waits') ? `${n('waits')} waiting` : '', n('filled') ? `${n('filled')} filled` : '', n('hole') ? plural(n('hole'), 'hole') : '', n('settled') ? `${n('settled')} settled` : '', form ? `${form} across a refusal` : '', two ? `two words at one pair: ${two}` : '', throughPair ? `${throughPair} through a pair` : ''].filter(Boolean);
                return `${plural(relations, 'relation')}, in ${plural(pieces, 'piece')}${parts.length ? ` · loops: ${parts.join(' · ')}` : ''}`;
              })()}
            </span>
            <span data-midpoint-child-relations={String(words.size)} className="flex flex-wrap items-baseline gap-x-1 text-stone-400">
              {"the child's relations: "}
              {words.size === 0 ? <span>none named yet</span> : [...words.entries()].sort((p, q) => p[0].localeCompare(q[0])).map(([w, ids], k) => (
                <span key={w}>
                  {k ? ' · ' : ''}
                  <button type="button" data-midpoint-child-relation={w} data-midpoint-child-relation-on={relView?.word === w ? 'true' : undefined} className={relView?.word === w ? 'underline decoration-2 text-stone-100' : 'underline'} onClick={() => { setRelationView(relView?.word === w ? null : { siteId, word: w }); setChildView({ siteId, key: null }); }}>{w}</button>
                  {` ${plural(ids.length, 'loop')}`}
                </span>
              ))}
            </span>
          </>
        );
      })() : null}
      <ZoomFrame name="midpoint-child" id={siteId} width={width} height={height} maxHeight="46vh">{/* H, in the frame every diagram shares (STAMP ZOOM) */}
        {(scale) => (
        <svg data-midpoint-own-drawing="true" data-midpoint-child-scale={scale.toFixed(3)} width={Math.round(width * scale)} height={Math.round(height * scale)} viewBox={`0 0 ${width} ${height}`} className="block">
          <defs>
            <marker id={`child-filled-${idSafe(siteId)}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" className="fill-emerald-300" /></marker>
            <marker id={`child-lit-${idSafe(siteId)}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" className="fill-amber-300" /></marker>
          </defs>
          {/* E · THE CHILD'S RELATIONS (§9.40–§9.41): one arc per pair of roles — solid where a loop is filled, with its arrowhead (once named, the way he chose;
              before that at the role both parents' words run toward, or at both ends where they run opposite ways); dashed where a loop is a hole; the chosen
              role's loops still waiting dotted, only while it is chosen; every arc's hover says what it is */}
          {L ? (() => {
            const byPair = new Map<string, typeof readings>();
            for (const x of readings) { if (x.loop.form || x.loop.kind === 'two' || (x.loop.pair && !x.loop.law)) continue; const k = `${x.loop.i}|${x.loop.j}`; byPair.set(k, [...(byPair.get(k) ?? []), x]); } // a loop filled by law is drawn like any filled loop (the rider of 18:21)
            const words = loopWordsOf(shape, L, childRecords, useGeometryStore.getState().loopAnswers); // VL 42: the one reader for a word's way
            const lit = relView ? new Set(readings.filter((x) => x.r.state === 'filled' && relNameOf(x.id)?.name === relView.word).map((x) => x.id)) : null;
            const chosenIdx = chosen ? indexOf(chosen.key) : -1;
            // ITEM 2 · part 1's rider: a role's loop with ITSELF, filled by law, drawn on its row — a small loop at the row's point, its arrowhead, his name beside it
            const arcsHere = childArcDetailsOf(shape, siteId, { records: childRecords });
            const selfArcs = L.selfs.map((sl) => {
              const id = selfIdOf(L, sl); const r = rows[sl.i]; if (!r) return null;
              const held = relationNames.find(([sh2, v, k]) => sh2 === shape.id && v === siteId && k === selfKindKeyOf(L, sl));
              const on = !!relView && !!held && held[3] === relView.word;
              const through = (arcsHere.find((x) => x.loopId === id) || { through: [] as string[] }).through.join(' with ');
              const d = `M${DOT},${r.y} C${DOT - 22},${r.y - 14} ${DOT - 22},${r.y + 14} ${DOT},${r.y}`;
              return (
                <g key={`self|${id}`} data-midpoint-child-arc={`${L.roles[sl.i].key}|${L.roles[sl.i].key}`} data-midpoint-child-arc-self="true" data-midpoint-child-arc-state="filled" data-midpoint-child-arc-lit={on ? 'true' : undefined} data-midpoint-child-arc-heads="end">
                  <title>{`${roleRefOf(L.roles[sl.i].key)} with itself: filled through a pair of words, ${through}${held ? ` · ${held[3]}` : ''}`}</title>
                  <path d={d} fill="none" className={on ? 'stroke-amber-300' : 'stroke-emerald-300'} strokeWidth={on ? 2.4 : 1.6} markerEnd={`url(#child-${on ? 'lit' : 'filled'}-${idSafe(siteId)})`} />
                  {held ? <text data-midpoint-child-arc-name={held[3]} x={DOT - 26} y={r.y + 3} textAnchor="end" fontSize={10} className="fill-amber-100">{held[3]}</text> : null}
                  <path d={d} fill="none" stroke="transparent" strokeWidth={10} className="cursor-help" />
                </g>
              );
            });
            return [...selfArcs, ...[...byPair.entries()].map(([k, xs]) => {
              const [a, b] = k.split('|').map(Number);
              const filled = xs.filter((x) => x.r.state === 'filled');
              const hole = xs.some((x) => x.r.state === 'hole');
              const waiting = (a === chosenIdx || b === chosenIdx) && xs.some((x) => x.r.state === 'waits');
              if (!filled.length && !hole && !waiting) return null;
              const ra = rows[a]; const rb = rows[b];
              if (!ra || !rb) return null;
              const on = !!lit && xs.some((x) => lit.has(x.id));
              // the arrow: each filled loop's reading — his chosen role, else the parents' common direction (both says run from i: toward j; from j: toward i)
              const towards = filled.map((x) => { const nm = relNameOf(x.id); if (nm && nm.from) return nm.from === roleIdOf(L, x.loop.i) ? 'j' : 'i'; const runs = [x.loop.X, x.loop.Y].filter((s) => !s.same).map((s) => (s.same ? true : s.undirected ? null : s.fwd)); return runs.length && runs.every((f) => f === true) ? 'j' : runs.length && runs.every((f) => f === false) ? 'i' : 'both'; });
              const head = `url(#child-${on ? 'lit' : 'filled'}-${idSafe(siteId)})`;
              const toJ = towards.length > 0 && towards.every((t) => t === 'j');
              const toI = towards.length > 0 && towards.every((t) => t === 'i');
              const names = [...new Set(filled.map((x) => relNameOf(x.id)?.name).filter((x): x is string => !!x))];
              const hover = [`${roleRefOf(L.roles[a].key)} and ${roleRefOf(L.roles[b].key)}`, ...xs.map((x) => {
                if (x.r.state === 'filled') { const d = x.r.diagonals.find((dd) => dd.reading === 'agree'); const nm = relNameOf(x.id); return `filled: ${d ? `${words.fromTo(d)}, ` : ''}both ways come to “${d ? words.sentenceOf(d.diagonal.start, d.diagonal.end, d.word as string) : ''}”${nm ? ` · named ${nm.name}` : ''}`; }
                if (x.r.state === 'hole') return `a hole: ${x.r.diagonals.filter((d) => d.reading === 'differ').map(words.fromTo).join(' and ')}, the two ways round differ`;
                if (x.r.state === 'settled') return 'comes to nothing both ways · settled';
                return `a loop waiting: ${[x.loop.X, x.loop.Y].map((s) => (s.same ? 'the same role' : s.words ?? `${s.from} ${s.w} ${s.to}`)).join(' · ')}`; // §9.48: never a kind's key
              })].join('\n');
              const d = arcPath(ra.y, rb.y);
              const rx = Math.min(140, 14 + 0.5 * Math.abs(rb.y - ra.y));
              return (
                <g key={k} data-midpoint-child-arc={`${L.roles[a].key}|${L.roles[b].key}`} data-midpoint-child-arc-state={filled.length ? 'filled' : hole ? 'hole' : 'waiting'} data-midpoint-child-arc-lit={on ? 'true' : undefined} data-midpoint-child-arc-heads={filled.length ? (toJ ? 'end' : toI ? 'start' : 'both') : 'none'}>
                  <title>{hover}</title>
                  <path d={d} fill="none" className={on ? 'stroke-amber-300' : filled.length ? 'stroke-emerald-300' : hole ? 'stroke-rose-300' : 'stroke-stone-400'} strokeWidth={on ? 2.4 : filled.length ? 1.6 : 1.2} strokeDasharray={filled.length ? undefined : hole ? '5 3' : '1 3'}
                    markerEnd={filled.length && (toJ || !toI) ? head : undefined} markerStart={filled.length && (toI || !toJ) ? head : undefined} />
                  {names.length ? <text data-midpoint-child-arc-name={names.join(' · ')} x={DOT - rx * 0.75 - 3} y={(ra.y + rb.y) / 2 + 3} textAnchor="end" fontSize={10} className="fill-amber-100">{names.join(' · ')}</text> : null}
                  <path d={d} fill="none" stroke="transparent" strokeWidth={10} className="cursor-help" />
                </g>
              );
            })];
          })() : null}
          {rows.map((r) => {
            const on = chosen?.key === r.key;
            const { lit, dim } = litOf(r.key, r.sentence);
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
                onPointerEnter={() => onHoverRow(r.key, r.sentence)}
                onPointerLeave={() => onHoverRow(null, '')}
              >
                <rect x={DOT - 8} y={r.top + 1} width={width - DOT + 4} height={r.h - 2} rx={3} fill={on ? '#292524' : 'transparent'} stroke={on ? '#fcd34d' : 'transparent'} />
                <circle cx={DOT} cy={r.y} r={on ? 4 : 3} className={on ? 'fill-amber-300' : lit ? 'fill-stone-50' : 'fill-stone-500'} />
                {tailOf(r.key) ? <text data-midpoint-child-row-count={tailOf(r.key)} x={DOT + 12 + textWide(r) + 10} y={r.y + 4} fontSize={10.5} className="fill-stone-400">{tailOf(r.key)}</text> : null}
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
        )}
      </ZoomFrame>
      <div ref={cardRef} data-midpoint-child-card={chosen ? chosen.key : 'none'} className="pt-1">
        {chosen === null ? (
          relView ? (
            // a relation pressed in the strip: its loops, each read from his chosen role or waiting for it
            <div data-midpoint-child-relation-card={relView.word} className="grid gap-0.5">
              <span><span className="font-serif font-semibold text-amber-100">{relView.word}</span><span className="text-stone-400">{` · a relation of the child, on ${plural(readings.filter((x) => x.r.state === 'filled' && relNameOf(x.id)?.name === relView.word).length + (L ? L.selfs.filter((sl) => relationNames.some(([sh2, v, k, nm]) => sh2 === shape.id && v === siteId && k === selfKindKeyOf(L, sl) && nm === relView.word)).length : 0), 'loop')}`}</span></span>
              {L ? L.selfs.filter((sl) => relationNames.some(([sh2, v, k, nm]) => sh2 === shape.id && v === siteId && k === selfKindKeyOf(L, sl) && nm === relView.word)).map((sl) => <span key={`self|${selfIdOf(L, sl)}`} className="text-stone-300">{`${roleRefOf(L.roles[sl.i].key)} with itself`}</span>) : null}
              {readings.filter((x) => x.r.state === 'filled' && relNameOf(x.id)?.name === relView.word).map((x) => { const nm = relNameOf(x.id); const ki = L ? L.roles[x.loop.i].key : ''; const kj = L ? L.roles[x.loop.j].key : ''; const [p, q] = nm && L && nm.from === roleIdOf(L, x.loop.j) ? [kj, ki] : [ki, kj]; return (
                <span key={x.id} className="text-stone-300">{nm && nm.from ? `${roleRefOf(p)} ${relView.word} ${roleRefOf(q)}` : <>{`${roleRefOf(ki)} and ${roleRefOf(kj)}`}<span className="text-stone-400"> · which way it reads: not chosen yet</span></>}</span>
              ); })}
            </div>
          ) : <span data-midpoint-child-card-hint="true" className="text-stone-400">choose a role: its loops are drawn, and its card opens below</span>
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
            {/* §9.73 (2) — what the moment's two coordinates rest on in their parents' casts, with what he did at this edge on each (the designer's 13:50) */}
            {standsOn(chosen.key)}
            {/* slice 2 · C — the role's loops, one at a time; a role referred to by its name alone where he gave one, else its sentence */}
            <ChildLoopCard key={chosen.key} shape={shape} siteId={siteId} roleKey={chosen.key} roleRef={roleRefOf} />
          </div>
        )}
      </div>
    </div>
  );
}

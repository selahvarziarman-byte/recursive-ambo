/**
 * STAMP THE-FINDINGS-BATCH · SLICE 2 · C — THE CARD'S LOOPS (ADR 0031 §9.40–§9.44; the designer's 10:56, 11:17 and 11:24 forms with her 13:43 note; the
 * mothership's rulings on D, 13:41, with the researcher's §19.28). Under the chosen role's name and qualities: its closed loops that can be asked, one at a
 * time (`previous · next · k of N`), each read FROM THE ROLE HE STANDS AT — first the line that says what it asks, then the loop DRAWN (Value's roles on top,
 * Fact's below, the two relatings as uprights, the two diagonals faint across it), then one block per diagonal: each way round printed as it was said, and
 * what it comes to — his answer (`withdraw`), a rule's (`by rule`), or the modes tab's decide form (`comes to the price [a word] the obtaining · decide · comes
 * to nothing`, his own words offered as he types, a new word marked); the block's own reading; `say it for: this loop · every loop of this shape (N loops)`
 * (the shape's count across the solid when it stands elsewhere too) with `the modes too`; then the loop's state — a hole, waits, filled (a relation of the
 * child, nameable, `which way it reads`), or settled. Loops across a refusal, two words at one pair and the parents' relations of three places are listed
 * apart on `show`. Every act is the store's (src/store/geometryStore.ts, slice 2 · D); the reading is the lib's (src/lib/childLoops.ts).
 */
import { useMemo, useState, type ReactNode } from 'react';
import type { Shape, VertexId } from '../types/geometry';
import { childRecordsOf, useGeometryStore, type LaterLoss, type RuleMark } from '../store/geometryStore';
import { termWordsOf, wordWordsOf } from '../lib/instanceSpace';
import { AGAINST, barsOn, dirOf, instancesOn, relatingsHeld, type Dir, type Relating } from '../lib/relatings';
import { mediumOf } from '../lib/descent';
import { edgeBetween } from '../lib/faceReading';
import { cornersInEdgeOrder } from '../lib/christening'; // SLICE 3 · B: the one reader for a midpoint's corners, the edge's order
import { NewWordNorm, isNewWord } from './WordField';
import {
  childLoopsCached, diagonalsOf, kindKeyOf, loopIdOf, roleIdOf, loopReadingFor, loopRecordsFor, loopShapeOf, routeKeyOf, routeShapeOf, waysOfRoute, waysOfShapeAcross, relationNameOf,
  type Answer, type ChildLoop, type ChildLoops, type ChildRecords, type DiagonalState, type Leg, type LoopAnswerRow, type LoopRuleRow, type Say, type WaySide, type WayValue,
 filledWordsOf, childArcDetailsOf, selfIdOf, selfKindKeyOf } from '../lib/childLoops';

const plural = (n: number, one: string, many = `${one}s`): string => `${n} ${n === 1 ? one : many}`;

/** A LOOP'S WORDS, one reader for the card and the drawing: a parent's role by its label, an answer's sentence turned where its word reads from the
 *  second corner (D13: its own way on this edge — every relating in it so; else as typed, from the first corner's role), a relating as said, a diagonal's
 *  `from … to …` */
export function loopWordsOf(shape: Shape, L: ChildLoops, records?: ChildRecords) {
  // a parent's role by the term reader (a seed's label; a born parent's relating by his name where he gave one, else its sentence — slice 2 · G)
  const opts = records ? { records } : {};
  const lbl = (side: 'X' | 'Y', id: string): string => termWordsOf(shape, side === 'X' ? L.X : L.Y, id, opts);
  const edge = edgeBetween(shape.edges, L.X, L.Y);
  const held = edge ? relatingsHeld(edge) : [];
  const fromY = (w: string): boolean => { const rs = held.filter((r) => r[0] === w); return rs.length > 0 && rs.every((r) => r[4] === '←'); };
  const sentenceOf = (x: string, y: string, w: Answer): string => (w === 0 ? 'nothing' : fromY(w) ? `${lbl('Y', y)} ${w} ${lbl('X', x)}` : `${lbl('X', x)} ${w} ${lbl('Y', y)}`);
  const relatingWords = (k: number): string => { const r = L.roles[k]; return r.dir === '←' ? `${lbl('Y', r.y)} ${r.w} ${lbl('X', r.x)}` : `${lbl('X', r.x)} ${r.w} ${lbl('Y', r.y)}`; };
  const fromTo = (d: DiagonalState): string => `from ${lbl('X', d.diagonal.start)} to ${lbl('Y', d.diagonal.end)}`;
  return { lbl, fromY, sentenceOf, relatingWords, fromTo };
}

/** ITEM 2 · part 2 · P6 (ADR 0031 §9.49 (4); the designer's 13:19 §5 as appended 13:28; the mothership's 13:26): THE PARENTS' OWN LIGHTS at a midpoint — each answered
 *  way (his own answer or a rule's, in a word) whose word matches no relating at its cell, under his equations (D13), and is not barred there (a barred word is a
 *  tension, never a light). Counted by ROUTE (a way answered once), by the parent whose say the way runs through: way a the first corner's, way b the second's.
 *  The sentences are the card's own (`sentenceOf`). An answer of nothing is no light (13:26) */
export function parentsLightsOf(shape: Shape, siteId: VertexId, records: ChildRecords, loopAnswers: ReadonlyArray<LoopAnswerRow>, loopRules: ReadonlyArray<LoopRuleRow>, facts: { converses: ReadonlyArray<readonly [string, string]>; opaque: readonly string[] }): { X: string[]; Y: string[] } {
  const out = { X: [] as string[], Y: [] as string[] };
  const L = childLoopsCached(shape, siteId, records);
  if (!L) return out;
  const edge = edgeBetween(shape.edges, L.X, L.Y);
  if (!edge) return out;
  const R = loopRecordsFor(shape, siteId, L, loopAnswers, loopRules, { converses: facts.converses.map(([a, b]) => [a, b] as [string, string]), opaque: [...facts.opaque] });
  const { sentenceOf } = loopWordsOf(shape, L, records);
  const held = instancesOn(edge);
  const same = (w: string, r: Relating): boolean => w === r[0] || facts.converses.some(([a, b]) => (a === r[0] && b === w) || (b === r[0] && a === w));
  const seen = new Set<string>();
  for (const loop of L.loops) {
    if (loop.form || loop.kind === 'two' || loop.pair) continue;
    const reading = loopReadingFor(L, loop, R);
    for (const d of reading.diagonals) {
      for (const way of ['a', 'b'] as const) {
        const w = way === 'a' ? d.diagonal.a : d.diagonal.b;
        const v = way === 'a' ? d.a : d.b;
        if (w.itself || typeof v.value !== 'string') continue;
        const key = routeKeyOf(L, loop, d.diagonal, way);
        if (seen.has(key)) continue;
        seen.add(key);
        const [rx, ry] = L.flipped ? [d.diagonal.end, d.diagonal.start] : [d.diagonal.start, d.diagonal.end];
        const word = v.value;
        if (held.some((r) => r[1] === rx && r[2] === ry && same(word, r))) continue; // related directly: it composes, no light
        if (way === 'a' ? d.tension.a : d.tension.b) continue; // barred at the pair: a tension, not a light
        out[way === 'a' ? 'X' : 'Y'].push(sentenceOf(d.diagonal.start, d.diagonal.end, word));
      }
    }
  }
  return out;
}
const WAY_A = '#7dd3fc'; // the way by the first corner's side (the mock's blue)
const WAY_B = '#f9a8d4'; // the way by the second corner's side (the mock's pink)

/** §9.48 (Q3; the designer's 18:43 §2): WHAT AN ACT WOULD TAKE AWAY, listed under its refusal — each of his later answers, rules and names on its own line,
 *  in his terms, with `open`, which opens that midpoint's card at that loop; past 5 items the list closes to `show` */
export function LaterLosses({ shape, items, records }: { shape: Shape; items: LaterLoss[]; records: ChildRecords }) {
  const [all, setAll] = useState(false);
  const st = useGeometryStore.getState();
  const label = (v: VertexId): string => shape.vertices[v]?.data.label?.trim() || 'unnamed';
  // SLICE 3 · B: a midpoint by its corners in the EDGE'S order (D13), through the one reader — the same order the refusal's `at the midpoint of …` reads
  const mid = (site: VertexId): string => { const v = shape.vertices[site]; if (!v || v.createdBy.sourceVertexIds.length !== 2) return label(site); const [c0, c1] = cornersInEdgeOrder(shape, v.createdBy.sourceVertexIds[0], v.createdBy.sourceVertexIds[1]); return `${label(c0)} and ${label(c1)}`; };
  // `open`: that midpoint's card at that loop — the site chosen, the loop's first role's card open, the loop walked to
  const openAt = (site: VertexId, L2: ChildLoops, lp: ChildLoop) => () => {
    const me = lp.i;
    const key = L2.roles[me].key;
    const other = (l: ChildLoop): number => (l.i === me ? l.j : l.i);
    const asked = L2.loops.filter((l) => (l.i === me || l.j === me) && !l.form && l.kind !== 'two' && !l.pair).sort((a, b) => other(a) - other(b) || a.id - b.id);
    st.selectVertex(site);
    st.setChildView({ siteId: site, key });
    st.setLoopView({ siteId: site, key, at: Math.max(0, asked.indexOf(lp)), scope: 'loop', modes: false, shown: [] });
  };
  const lineOf = (it: LaterLoss): { text: string; open: (() => void) | null } => {
    if (it.kind === 'rule') {
      const first = waysOfShapeAcross(shape, it.key, it.modes === 1, records)[0];
      return { text: `the rule on every way round of its shape: comes to ${it.answer === 0 ? 'nothing' : `“${it.answer}”`}`, open: first ? openAt(first.siteId, first.L, first.loop) : null };
    }
    if (it.kind === 'translation') {
      // his τ pair, by the two children's filled words, at the midpoint it is made at (`open` selects it)
      const e = shape.edges.find((x) => x.id === it.edgeId);
      const w = (c: VertexId | undefined, t: string): string => (c === undefined ? t : filledWordsOf(shape, c, { records }).find((x) => x.type === t)?.words ?? wordWordsOf(shape, c, t));
      const site = it.site;
      return { text: `${site !== null ? `at ${mid(site)}` : `on ${e ? `${label(e.vertexIds[0])}–${label(e.vertexIds[1])}` : 'its edge'}`}, the translation ${w(e?.vertexIds[0], it.pair[0])} ≡ ${w(e?.vertexIds[1], it.pair[1])}`, open: site !== null ? () => st.selectVertex(site) : null };
    }
    const L2 = childLoopsCached(shape, it.site, records);
    if (it.kind === 'name') {
      const lp = L2 ? L2.loops.find((l) => kindKeyOf(L2, l) === it.key) : undefined;
      return { text: `at ${mid(it.site)}, the name “${it.name}” for a relation`, open: L2 && lp ? openAt(it.site, L2, lp) : null };
    }
    // §9.49 (1): the answer is a route's — read on the first loop the route is a way of here
    const wayAt = L2 ? waysOfRoute(L2, it.route)[0] : undefined;
    const lp = wayAt ? wayAt.loop : undefined;
    if (!L2 || !lp || !wayAt) return { text: `at ${mid(it.site)}, an answer`, open: null };
    const w2 = loopWordsOf(shape, L2, records);
    const d2 = wayAt.d;
    const ref = (k: number): string => termWordsOf(shape, it.site, L2.roles[k].key, { records });
    const side = wayAt.way === 'a' ? label(L2.X) : label(L2.Y);
    const comes = it.answer === 0 ? 'nothing' : `“${d2 ? w2.sentenceOf(d2.start, d2.end, it.answer) : it.answer}”`;
    return { text: `at ${mid(it.site)}, with ${ref(lp.i)} and ${ref(lp.j)}: ${d2 ? `from ${w2.lbl('X', d2.start)} to ${w2.lbl('Y', d2.end)}, ` : ''}by ${side}'s side, comes to ${comes}`, open: openAt(it.site, L2, lp) };
  };
  const shown = all ? items : items.slice(0, 5);
  return (
    <span data-later-losses={String(items.length)} className="grid pl-4 text-rose-200">
      {shown.map((it, n) => { const l = lineOf(it); return (
        <span key={n} data-later-loss={it.kind}>{l.text}{l.open ? <>{' · '}<button type="button" data-later-loss-open="true" className="underline" onClick={l.open}>open</button></> : null}</span>
      ); })}
      {items.length > 5 ? <span>{'· '}<button type="button" data-later-losses-show="true" className="underline" onClick={() => setAll(!all)}>{all ? 'hide' : 'show'}</button></span> : null}
    </span>
  );
}

export function ChildLoopCard({ shape, siteId, roleKey, roleRef }: {
  shape: Shape;
  siteId: VertexId;
  roleKey: string; // the role he stands at
  roleRef: (key: string) => string; // a role referred to: its name where he gave one, else its sentence
}) {
  // subscribed with the hook, read through `getState()` (node's render reads the store's initial snapshot through a hook)
  useGeometryStore((s) => s.loopAnswers);
  useGeometryStore((s) => s.loopRules);
  useGeometryStore((s) => s.relationNames);
  useGeometryStore((s) => s.loopView);
  useGeometryStore((s) => s.loopRefusal);
  useGeometryStore((s) => s.lexicon);
  useGeometryStore((s) => s.converses);
  useGeometryStore((s) => s.opaque);
  useGeometryStore((s) => s.roleNames);
  useGeometryStore((s) => s.rules);
  useGeometryStore((s) => s.bondRules);
  const st = useGeometryStore.getState();
  const childRecords = childRecordsOf(st); // F: his records, from the store's one source
  const L = childLoopsCached(shape, siteId, childRecords);
  // ITEM 2 · part 2 · P4+P5 (ADR 0031 §9.49 (2)–(4)): what stands at a diagonal's cell — his relatings and bars by the edge's one reader, the lights' decided
  // passages by the medium's sorting (the page's own reader of the altitudes, the same the point tab counts) — read once per record
  const edgeHere = L ? edgeBetween(shape.edges, L.X, L.Y) : undefined;
  const sorting = useMemo(() => (L && edgeHere ? mediumOf(shape, edgeHere, { records: childRecords }, st.rules, { converses: st.converses, opaque: st.opaque }, st.bondRules)?.sorting ?? null : null), [shape, edgeHere, childRecords, st.rules, st.converses, st.opaque, st.bondRules, L]);
  const [typed, setTyped] = useState<Record<string, string>>({});
  const [focus, setFocus] = useState<number | null>(null);
  const [relDrafts, setRelDrafts] = useState<Record<string, string>>({}); // per loop: a name typed for one loop never reaches another
  const [relRenamingId, setRelRenamingId] = useState<string | null>(null);
  const [relRefusal, setRelRefusal] = useState<{ loopId: string; why: string; items?: LaterLoss[] } | null>(null);
  if (!L) return null;
  const me = L.roles.findIndex((r) => r.key === roleKey);
  if (me < 0) return null;
  const { lbl, fromY, sentenceOf, relatingWords, fromTo } = loopWordsOf(shape, L, childRecords);
  const cornerName = (v: VertexId): string => shape.vertices[v]?.data.label?.trim() || 'unnamed';
  const nX = cornerName(L.X);
  const nY = cornerName(L.Y);
  // ═══ P4+P5 — the designer's 13:19 §3–§4 with her 13:31; the mothership's 13:26 (a passage decided to nothing is a refused route: shown as form, not counted) ═══
  const [SX, SY] = L.flipped ? (['Y', 'X'] as const) : (['X', 'Y'] as const); // the record's (x, y) against the reader's corners
  const saidRow = (r: Relating): string => (dirOf(r) === AGAINST ? `${lbl(SY, r[2])} ${r[0]} ${lbl(SX, r[1])}` : `${lbl(SX, r[1])} ${r[0]} ${lbl(SY, r[2])}`);
  const lightSentence = (x: string, y: string, w: string, dir: Dir | null): string => (dir === AGAINST ? `${lbl(SY, y)} ${w} ${lbl(SX, x)}` : `${lbl(SX, x)} ${w} ${lbl(SY, y)}`);
  type Passage = { who: string; word: string | 0; dir: Dir | null };
  const atCell = (start: string, end: string): { rel: Relating[]; bars: Relating[]; lights: Passage[]; rx: string; ry: string } => {
    const [rx, ry] = L.flipped ? [end, start] : [start, end];
    const rel = edgeHere ? instancesOn(edgeHere).filter((r) => r[1] === rx && r[2] === ry) : [];
    const bars = edgeHere ? barsOn(edgeHere).filter((r) => r[1] === rx && r[2] === ry) : [];
    const decided = (reading: string): boolean => reading === 'LIGHT' || reading === 'COMPOSED' || reading === 'NOT';
    const lights: Passage[] = [];
    for (const v of sorting?.views ?? []) {
      const who = cornerName(v.view);
      for (const b of v.altitude.bonds) if (b.bond.x === rx && b.bond.y === ry && decided(b.reading)) lights.push({ who, word: b.reading === 'NOT' || b.composite === null ? 0 : b.composite, dir: b.compositeDir });
      for (const p of v.paths) if (p.path.x === rx && p.path.y === ry && p.path.source !== 'coordinate' && decided(p.reading)) lights.push({ who, word: p.reading === 'NOT' || p.composite === null ? 0 : p.composite, dir: p.compositeDir });
    }
    return { rel, bars, lights, rx, ry };
  };
  // D13: a light or an answer in a relating's declared CONVERSE meets that relating — the sorting composes such a passage onto the direct (sorting.ts: spellingsOf), and the card must read the cell as the page counts it
  const sameWord = (w: string | 0, r: Relating): boolean => w !== 0 && (w === r[0] || st.converses.some(([a, b]) => (a === r[0] && b === w) || (b === r[0] && a === w)));
  const whose = (names: string[]): string => (names.length === 1 ? `${names[0]}'s light comes` : `${names.slice(0, -1).map((n) => `${n}'s`).join(', ')} and ${names[names.length - 1]}'s lights come`);
  // her 3: one line under the diagonal's head when anything stands at its pair — related, barred, then the lights; a light coming to a related word folds into it
  const farEndsLine = (d: DiagonalState, k: number): ReactNode => {
    const c = atCell(d.diagonal.start, d.diagonal.end);
    if (c.rel.length + c.bars.length + c.lights.length === 0) return null;
    const folded = new Set<number>();
    const related = c.rel.map((r) => { const names = [...new Set(c.lights.map((l, n) => (sameWord(l.word, r) ? (folded.add(n), l.who) : null)).filter((x): x is string => x !== null))]; return `“${saidRow(r)}”${names.length ? ` (${whose(names)} to it too)` : ''}`; });
    const parts: string[] = [];
    if (related.length) parts.push(`related, ${related.join(' and ')}`);
    if (c.bars.length) parts.push(`barred, ${c.bars.map((b) => `“${saidRow(b)}”`).join(' and ')}`);
    c.lights.forEach((l, n) => { if (folded.has(n)) return; parts.push(l.word === 0 ? `in ${l.who}'s light, it comes to nothing` : `in ${l.who}'s light, “${lightSentence(c.rx, c.ry, l.word, l.dir)}”`); });
    return <span data-child-loop-far-ends={k} data-child-loop-far-ends-related={String(c.rel.length)} data-child-loop-far-ends-barred={String(c.bars.length)} data-child-loop-far-ends-lights={String(c.lights.length)} className="pl-4 text-stone-400">{`already at this pair: ${parts.join(' · ')}`}</span>;
  };
  // her 4 (with 13:31): after `withdraw`, what his answer meets at the pair — related directly · barred (a tension; this replaces the old `in tension:` wording) · in the parent's light; then the lights' comparison, in muted ink
  const meetsLine = (d: DiagonalState, way: WaySide, k: number, v: WayValue): ReactNode => {
    if (v.value === undefined) return null;
    const c = atCell(d.diagonal.start, d.diagonal.end);
    const parent = way === 'a' ? nX : nY; // the parent whose say the way runs through: way a by the first corner's side, b by the second's
    const first: ReactNode = v.value === 0 ? null
      : c.rel.some((r) => sameWord(v.value as string, r)) ? <span data-child-loop-meets="related" className="text-stone-100">{' · related directly, so it composes'}</span>
      : (way === 'a' ? d.tension.a : d.tension.b) ? <span data-child-loop-meets="barred" data-child-loop-tension={`${k}|${way}`} className="text-amber-200">{' · barred at this pair: a tension, it fills nothing'}</span>
      : <span data-child-loop-meets="light" className="text-stone-400">{` · in ${parent}'s light`}</span>;
    // the designer's 21:16 (rider 1): the lights GROUPED BY WORD — agreement first, its corners joined; then each other word once, its corners joined, `also` where a corner has already agreed
    const agrees = (w: string | 0): boolean => (v.value === 0 ? w === 0 : w === v.value || (w !== 0 && st.converses.some(([a, b]) => (a === w && b === v.value) || (b === w && a === v.value))));
    const lightsOf = (names: string[]): string => `${names.slice(0, -1).map((n) => `${n}'s`).join(', ')}${names.length > 1 ? ' and ' : ''}${names[names.length - 1]}'s light${names.length > 1 ? 's' : ''}`;
    const agreed = [...new Set(c.lights.filter((l) => agrees(l.word)).map((l) => l.who))];
    const groups: Array<[string | 0, string[]]> = [];
    for (const l of c.lights) { if (agrees(l.word)) continue; const g = groups.find(([gw]) => gw === l.word); if (g) { if (!g[1].includes(l.who)) g[1].push(l.who); } else groups.push([l.word, [l.who]]); }
    const cmp: string[] = [];
    if (agreed.length) cmp.push(v.value === 0 ? `this and ${lightsOf(agreed)} ${agreed.length > 1 ? 'all' : 'both'} come to nothing` : `as in ${lightsOf(agreed)}`);
    for (const [gw, names] of groups) { const also = names.every((n) => agreed.includes(n)) ? ' also' : ''; const one = names.length === 1; cmp.push(gw === 0 ? `${lightsOf(names)}${also} come${one ? 's' : ''} to nothing` : `${lightsOf(names)}${also} say${one ? 's' : ''} “${gw}”`); }
    return <>{first}{cmp.length ? <span data-child-loop-meets-lights={String(c.lights.length)} className="text-stone-400">{` · ${cmp.join(' · ')}`}</span> : null}</>;
  };
  const records = loopRecordsFor(shape, siteId, L, st.loopAnswers, st.loopRules, { converses: st.converses, opaque: st.opaque });
  const other = (l: ChildLoop): number => (l.i === me ? l.j : l.i);
  const mine = L.loops.filter((l) => l.i === me || l.j === me);
  const asked = mine.filter((l) => !l.form && l.kind !== 'two' && !l.pair).sort((a, b) => other(a) - other(b) || a.id - b.id);
  const paired = mine.filter((l) => !l.form && l.kind !== 'two' && l.pair); // §9.45: through a pair — never asked, counted apart
  const forms = mine.filter((l) => l.form);
  const twos = mine.filter((l) => l.kind === 'two');
  const many = L.many.filter((m) => m.terms.includes(m.side === 'X' ? L.roles[me].x : L.roles[me].y));
  const vHeld = st.loopView && st.loopView.siteId === siteId && st.loopView.key === roleKey ? st.loopView : null;
  const view = vHeld ?? { siteId, key: roleKey, at: 0, scope: 'loop' as const, modes: false, shown: [] as string[] };
  const setView = (patch: Partial<typeof view>): void => st.setLoopView({ ...view, ...patch });
  const shown = (k: string): boolean => view.shown.includes(k);
  const toggle = (k: string): void => setView({ shown: shown(k) ? view.shown.filter((x) => x !== k) : [...view.shown, k] });

  // ── words ──
  const sayWords = (s: Say & { same: false }): string => s.words ?? `${s.from} ${s.w} ${s.to}`; // §9.48: a born parent's relation by its own words, never its key
  const legWords = (g: Leg): string => (g.kind === 'say' ? sayWords(g.say) : relatingWords(g.role));
  const hisWords = [...new Set([...st.lexicon, ...st.loopAnswers.map((r) => r[3]), ...st.loopRules.map((r) => r[2])].filter((w): w is string => typeof w === 'string' && w.length > 0))];
  const offersFor = (t: string): string[] => (t ? hisWords.filter((w) => w !== t && w.startsWith(t)).sort((p, q) => p.localeCompare(q)) : []);

  const loop = asked.length ? asked[Math.min(view.at, asked.length - 1)] : null;
  const at = loop ? asked.indexOf(loop) : 0;
  const reading = loop ? loopReadingFor(L, loop, records) : null;
  // the diagonals, read from the role he stands at: his own first
  const diags = reading ? [...reading.diagonals].sort((p, q) => (roleIdOf(L, me) === p.start ? -1 : 0) - (roleIdOf(L, me) === q.start ? -1 : 0)) : [];
  const loopId = loop ? loopIdOf(L, loop) : '';

  // ── the acts ──
  /** a way's draft, keyed by the loop, its diagonal and the way — a word typed on one loop never stands ready on another */
  const draftKey = (d: DiagonalState, way: WaySide): string => `${loopId}|${d.start}|${way}`;
  const say = (d: DiagonalState, way: WaySide, answer: Answer, scope: 'loop' | 'shape' = view.scope): void => {
    if (!loop) return;
    const refused = scope === 'shape' ? st.sayLoopRule(siteId, loopId, d.start, way, answer, view.modes) : st.sayLoop(siteId, loopId, d.start, way, answer);
    if (refused !== null) return; // refused (the store names why, where the act was made): the field keeps what he typed
    setTyped((t) => { const n = { ...t }; delete n[draftKey(d, way)]; return n; });
  };
  const giveNameFor = (id: string): void => {
    const why = st.nameRelation(siteId, id, relDrafts[id] ?? '');
    if (why === null) { setRelDrafts((t) => { const n = { ...t }; delete n[id]; return n; }); setRelRenamingId(null); setRelRefusal(null); }
    else setRelRefusal(typeof why === 'string' ? { loopId: id, why } : { loopId: id, why: why.why, items: why.items }); // §9.48's riders: a join or part refused, naming his τ pair
  };
  const giveName = (): void => giveNameFor(loopId);
  // ITEM 2 · part 1 (the mothership's 2026-10-17 12:56; the designer's 10-10 20:40 (1) and (2)): ONE naming for every filled relation — the asked loop filled, the
  // loop filled by law (through a pair), a role's loop with itself — `name it` with his words offered; named, `<name> · rename · withdraw · which way it
  // reads: …` (no way for a loop with itself: its two ends are one role). The name goes to the relation's KIND (§9.48)
  const arcsHere = childArcDetailsOf(shape, siteId, { records: childRecords });
  const relationNaming = (id: string, held: { name: string; from: string } | null, ends: [number, number] | null, lead: ReactNode): ReactNode => {
    const draft = relDrafts[id] ?? '';
    const renaming = relRenamingId === id;
    const fromKey = held && held.from ? held.from : null;
    return !held || renaming ? (
      <>
        {lead}
        <span className="flex items-center gap-2" data-child-relation-field="true">
          <input data-child-relation-input="true" aria-label="a name for this relation" value={draft} autoComplete="off" onChange={(e) => { setRelDrafts({ ...relDrafts, [id]: e.target.value }); setRelRefusal(null); }} onKeyDown={(e) => { if (e.key === 'Enter') giveNameFor(id); }}
            className="w-40 rounded border border-stone-600 bg-stone-900 px-1 py-0.5 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-300" />
          <button type="button" data-child-relation-name-it="true" className="underline text-amber-200" onClick={() => giveNameFor(id)}>name it</button>
        </span>
        {relRefusal && relRefusal.loopId === id ? <span data-child-relation-refusal="true" className="text-rose-200">{`not taken — ${relRefusal.why}`}</span> : null}
        {relRefusal && relRefusal.loopId === id && relRefusal.items?.length ? <LaterLosses shape={shape} items={relRefusal.items} records={childRecords} /> : null}
        {(() => { const theirs = [...new Set(st.relationNames.filter(([s, v]) => s === shape.id && v === siteId).map((r) => r[3]))].sort((p, q) => p.localeCompare(q)); return theirs.length ? (
          // his relation words, offered (the mock's `his words here`): one name may stand for several loops — his act, shown as such
          <span data-child-relation-his="true" className="text-stone-400">{'his words here: '}{theirs.map((w, n) => <span key={w}>{n ? ' · ' : ''}<button type="button" data-child-relation-his-word={w} className="underline text-stone-300" onClick={() => setRelDrafts({ ...relDrafts, [id]: w })}>{w}</button></span>)}</span>
        ) : null; })()}
      </>
    ) : (
      <>
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span data-child-relation-name={held.name} className="font-serif font-semibold text-amber-100">{held.name}</span>
          <span className="text-stone-400">·</span>
          <button type="button" data-child-relation-rename="true" className="underline text-stone-300" onClick={() => { setRelRenamingId(id); setRelDrafts({ ...relDrafts, [id]: held.name }); }}>rename</button>
          <span className="text-stone-400">·</span>
          <button type="button" data-child-relation-withdraw="true" className="underline text-stone-300" onClick={() => { const r = st.withdrawRelationName(siteId, id); setRelRefusal(r ? { loopId: id, why: r.why, items: r.items } : null); }}>withdraw</button>
        </span>
        {ends ? (
          <span data-child-relation-reads={fromKey ?? 'none'} className="text-stone-400">
            {/* VL 41 (the mothership's 14:54; the designer's 14:55): before a choice the question, both sentences buttons and `not chosen yet`; chosen, the question becomes the
                answer — `it reads:` the chosen sentence as plain text (a positive fact needs a positive mark, never a class alone), `or the other way:` the other sentence the one
                button, which swaps them. The choice is the record's (`relationNames`' fifth field, kept across export and import — measured 2026-10-19 on Virgin Land's own file) */}
            {fromKey ? 'it reads: ' : 'which way it reads: '}
            {(fromKey === roleIdOf(L, ends[1]) ? [[ends[1], ends[0]], [ends[0], ends[1]]] : [[ends[0], ends[1]], [ends[1], ends[0]]]).map(([p, q], n) => {
              const sentence = `${roleRef(L.roles[p].key)} ${held.name} ${roleRef(L.roles[q].key)}`;
              return (
                <span key={n}>
                  {n ? (fromKey ? ' · or the other way: ' : ' · ') : null}
                  {fromKey === roleIdOf(L, p)
                    ? <span data-child-relation-chosen={roleIdOf(L, p)} className="text-stone-100">{sentence}</span>
                    : <button type="button" data-child-relation-from={roleIdOf(L, p)} className="underline" onClick={() => { const r = st.readRelationFrom(siteId, id, roleIdOf(L, p)); setRelRefusal(r ? { loopId: id, why: r.why, items: r.items } : null); }}>{sentence}</button>}
                </span>
              );
            })}
            {fromKey ? null : <span> · not chosen yet</span>}
          </span>
        ) : null}
        {relRefusal && relRefusal.loopId === id ? <span data-child-relation-refusal="true" className="text-rose-200">{`not taken — ${relRefusal.why}`}</span> : null}
        {relRefusal && relRefusal.loopId === id && relRefusal.items?.length ? <LaterLosses shape={shape} items={relRefusal.items} records={childRecords} /> : null}
      </>
    );
  };
  const withdraw = (d: DiagonalState, way: WaySide): void => {
    if (!loop) return;
    const v = way === 'a' ? d.a : d.b;
    if (v.own !== undefined) st.withdrawLoopSay(siteId, loopId, d.start, way);
    else if (v.rule !== undefined) {
      // §9.49 (1): the rule is the ROUTE's shape's — the modes' first, being the narrower
      const rsM = routeShapeOf(L, loop, d.diagonal, way, true); const rsP = routeShapeOf(L, loop, d.diagonal, way, false);
      const at = { siteId, loopId, start: d.start, way }; // a refusal shows on this way's line (§9.48 Q3)
      if (st.loopRules.some(([k, mm]) => k === rsM && mm === 1)) st.withdrawLoopRule(rsM, true, at);
      else st.withdrawLoopRule(rsP, false, at);
    }
  };

  // ── one way's line ──
  // §9.49 (1) (the designer's 13:19 §1): a way's answer belongs to its ROUTE — where the route goes round more than one loop its line says so, before and after
  // the answer: `· one answer for 4 loops · show`, the loops one per line, `· three sides` for a three-sided one, `(this loop)` for this one; nothing where it goes
  // round this loop alone. Under `every way round of its shape` (her §2) each unanswered way shows the rule's reach instead: `· every way of this shape: 13 ways, round 29 loops · show`
  const reachOf = (d: DiagonalState, way: WaySide, k: number): ReactNode => {
    if (!loop) return null;
    const route = routeKeyOf(L, loop, d.diagonal, way);
    const shared = [...new Set(waysOfRoute(L, route).map((x) => x.loop))];
    if (shared.length < 2) return null;
    const showKey = `reach|${k}|${way}`;
    return (
      <span data-child-loop-reach={`${k}|${way}`} data-child-loop-reach-count={String(shared.length)} className="text-stone-400">
        {` · one answer for ${shared.length} loops · `}
        <button type="button" data-child-loop-reach-show={`${k}|${way}`} className="underline" onClick={() => toggle(showKey)}>{shown(showKey) ? 'hide' : 'show'}</button>
        {shown(showKey) ? <span data-child-loop-reach-list={`${k}|${way}`} className="block pl-4">{shared.map((lp) => <span key={lp.id} className="block">{`${roleRef(L.roles[lp.i].key)} and ${roleRef(L.roles[lp.j].key)}${lp.kind === 'three' ? ' · three sides' : ''}${lp === loop ? ' (this loop)' : ''}`}</span>)}</span> : null}
      </span>
    );
  };
  const shapeReachOf = (d: DiagonalState, way: WaySide, k: number): ReactNode => {
    if (!loop || view.scope !== 'shape') return null;
    const rs = routeShapeOf(L, loop, d.diagonal, way, view.modes);
    const all = waysOfShapeAcross(shape, rs, view.modes, childRecords);
    const loopsN = new Set(all.map((x) => `${x.siteId}|${loopIdOf(x.L, x.loop)}`)).size;
    const routesN = new Set(all.map((x) => routeKeyOf(x.L, x.loop, x.d, x.way))).size; // the designer's 17:18: the ways are the distinct ROUTES (65 of 71 loops share one), never one per loop
    const showKey = `shape|${k}|${way}`;
    const childName = (v: VertexId): string => shape.vertices[v]?.data.label?.trim() || 'unnamed';
    return (
      <span data-child-loop-shape-reach={`${k}|${way}`} data-child-loop-shape-ways={String(routesN)} data-child-loop-shape-loops={String(loopsN)} className="text-stone-400">
        {` · every way of this shape: ${plural(routesN, 'way')}, round ${plural(loopsN, 'loop')} · `}
        <button type="button" data-child-loop-shape-show={`${k}|${way}`} className="underline" onClick={() => toggle(showKey)}>{shown(showKey) ? 'hide' : 'show'}</button>
        {shown(showKey) ? (
          <span data-child-loop-shape-list={`${k}|${way}`} className="block pl-4">
            {[...new Set(all.map((x) => x.siteId))].map((v) => (
              <span key={v} className="block">
                {all.some((x) => x.siteId !== siteId) ? <span className="text-stone-300">{childName(v)}</span> : null}
                {all.filter((x) => x.siteId === v).map((x, n) => <span key={n} className="block">{`${x.siteId === siteId ? roleRef(x.L.roles[x.loop.i].key) : x.L.roles[x.loop.i].key} and ${x.siteId === siteId ? roleRef(x.L.roles[x.loop.j].key) : x.L.roles[x.loop.j].key}, by ${x.way === 'a' ? childName(x.L.X) : childName(x.L.Y)}'s side${x.siteId === siteId && x.loop === loop && x.way === way && x.d.start === d.start ? ' (this way)' : ''}`}</span>)}
              </span>
            ))}
          </span>
        ) : null}
      </span>
    );
  };
  // §9.49 and Δ85 — the designer's 10-18 10:30 (her 1): what an older file said twice of one way round stands on the way, in place of its answer, until he
  // keeps one: `two answers from an older file, each given on one of its loops: “x” · keep · “y” · keep` — `keep` keeps that one and withdraws the other;
  // until then the way reads as unsaid in every loop it goes round (whether unsaid or a hole is the mothership's, asked by her). Two RULES on one route
  // shape from an older file take the same form (the coder's words, marked)
  const conflictOf = (d: DiagonalState, way: WaySide, k: number): ReactNode => {
    if (!loop) return null;
    const route = routeKeyOf(L, loop, d.diagonal, way);
    let idx = st.routeConflicts.findIndex((c) => c.kind === 'answer' && c.shape === shape.id && c.site === siteId && c.key === route);
    if (idx < 0) idx = st.routeConflicts.findIndex((c) => c.kind === 'rule' && c.key === routeShapeOf(L, loop, d.diagonal, way, c.modes === 1));
    if (idx < 0) return null;
    const c = st.routeConflicts[idx];
    return (
      <span data-child-loop-conflict={`${k}|${way}`} data-child-loop-conflict-kind={c.kind} className="flex flex-wrap items-center gap-x-2 pl-4 text-amber-200">
        <span>{c.kind === 'answer' ? 'two answers from an older file, each given on one of its loops:' : 'two rules from an older file, each made for one shape of its loops:'}</span>
        {c.answers.map((a, n) => (
          <span key={String(a)} className="inline-flex items-center gap-x-2">
            {n > 0 ? <span>·</span> : null}
            <span>{a === 0 ? 'nothing' : `“${a}”`}</span><span>·</span>
            <button type="button" data-child-loop-keep={a === 0 ? 'nothing' : a} className="underline" onClick={() => st.keepRouteAnswer(idx, a)}>keep</button>
          </span>
        ))}
      </span>
    );
  };
  // the designer's 10-18 10:30 (her 2): a rule read from an older file under a new reach is MARKED on each way it answers, in place of `(by rule)`, until he
  // keeps it or withdraws it: `(by a rule from an older file, made for 6 loops of one shape; it now reaches 13 ways, round 29 loops) · keep it · withdraw`
  const ruleMarkOf = (d: DiagonalState, way: WaySide): { key: string; m: boolean; mark: RuleMark } | null => {
    if (!loop) return null;
    for (const m of [true, false]) {
      const key = routeShapeOf(L, loop, d.diagonal, way, m);
      if (!st.loopRules.some(([kk, x]) => kk === key && x === (m ? 1 : 0))) continue;
      const mark = st.ruleMarks.find((x) => x.key === key && x.modes === (m ? 1 : 0));
      return mark ? { key, m, mark } : null;
    }
    return null;
  };
  const ruleNoteOf = (d: DiagonalState, way: WaySide, k: number): ReactNode => {
    const rm = ruleMarkOf(d, way);
    if (!rm) return <span className="text-stone-400"> (by rule)</span>;
    const all = waysOfShapeAcross(shape, rm.key, rm.m, childRecords);
    const loopsN = new Set(all.map((x) => `${x.siteId}|${loopIdOf(x.L, x.loop)}`)).size;
    const routesN = new Set(all.map((x) => routeKeyOf(x.L, x.loop, x.d, x.way))).size; // the designer's 17:18: the ways are the distinct ROUTES (65 of 71 loops share one), never one per loop
    return (
      <span data-child-loop-rule-mark={`${k}|${way}`} data-child-loop-rule-mark-loops={String(rm.mark.loops)} className="text-amber-200">
        {` (by a rule from an older file, made for ${plural(rm.mark.loops, 'loop')} of one shape; it now reaches ${plural(routesN, 'way')}, round ${plural(loopsN, 'loop')}) · `}
        <button type="button" data-child-loop-rule-keep={`${k}|${way}`} className="underline" onClick={() => st.keepRuleMark(rm.key, rm.m)}>keep it</button>
        {' · '}
        <button type="button" data-child-loop-rule-mark-withdraw={`${k}|${way}`} className="underline" onClick={() => st.withdrawLoopRule(rm.key, rm.m, { siteId, loopId, start: d.start, way })}>withdraw</button>
      </span>
    );
  };
  const wayLine = (d: DiagonalState, way: WaySide, k: number) => {
    const w = way === 'a' ? d.diagonal.a : d.diagonal.b;
    const v = way === 'a' ? d.a : d.b;
    const side = way === 'a' ? nX : nY;
    const key = draftKey(d, way);
    const t = typed[key] ?? '';
    // the decide form: where nothing answers the way, and — under `this loop` — beside a rule's answer, so this loop can take its own (D6's exception)
    const decideOpen = v.value === undefined || (v.by === 'rule' && view.scope === 'loop');
    const refusal = st.loopRefusal && st.loopRefusal.siteId === siteId && st.loopRefusal.loopId === loopId && st.loopRefusal.start === d.start && st.loopRefusal.way === way ? st.loopRefusal.why : null;
    return (
      <div key={way} data-child-loop-way={`${k}|${way}`} className="grid gap-0.5">
        <span><span className="font-semibold" style={{ color: way === 'a' ? WAY_A : WAY_B }}>{`by ${side}'s side:`}</span>{` ${w.legs.map(legWords).join(', and ')}`}{w.itself ? <span className="text-stone-400"> (the relating itself)</span> : null}</span>
        {w.itself || v.value === undefined ? null : (
          <span data-child-loop-answer={`${k}|${way}`} data-child-loop-answer-by={v.by ?? undefined} className="pl-4 text-stone-300">
            {`comes to ${v.value === 0 ? 'nothing' : `“${sentenceOf(d.diagonal.start, d.diagonal.end, v.value)}”`}`}
            {v.by === 'rule' ? ruleNoteOf(d, way, k) : null}
            {ruleMarkOf(d, way) ? null : <>{' · '}<button type="button" data-child-loop-withdraw={`${k}|${way}`} data-child-loop-withdraw-rule-way={v.by === 'rule' ? 'true' : undefined} className="underline" onClick={() => withdraw(d, way)}>{v.by === 'rule' ? 'withdraw the rule' : 'withdraw'}</button></>}
            {v.by === 'loop' && v.rule !== undefined && v.rule !== v.own ? <span className="text-stone-400">{`, an exception to the rule, which says ${v.rule === 0 ? 'it comes to nothing' : `“${sentenceOf(d.diagonal.start, d.diagonal.end, v.rule)}”`}`}</span> : null}
            {meetsLine(d, way, k, v)}
            {reachOf(d, way, k)}
            {v.by === 'rule' ? shapeReachOf(d, way, k) : null}
          </span>
        )}
        {conflictOf(d, way, k)}
        {w.itself || !decideOpen ? null : (
          <span data-child-loop-decide={`${k}|${way}`} className="flex flex-wrap items-center gap-x-1 pl-4 text-stone-300">
            {v.by === 'rule' ? <span data-child-loop-own-lead="true" className="text-stone-400">{'for this loop only:'}</span> : null}
            {(() => { const turned = t ? fromY(t.trim()) : false; const [e1, e2] = turned ? [lbl('Y', d.diagonal.end), lbl('X', d.diagonal.start)] : [lbl('X', d.diagonal.start), lbl('Y', d.diagonal.end)]; return (
              <>
                <span>{`comes to ${e1}`}</span>
                <span className="relative inline-block">
                  <input data-child-loop-field={`${k}|${way}`} aria-label={`what the way by ${side}'s side comes to, ${fromTo(d)}`} value={t} placeholder="a word" autoComplete="off"
                    onFocus={() => setFocus(k)} onChange={(e) => { setTyped({ ...typed, [key]: e.target.value }); setFocus(k); st.clearLoopRefusal(); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && t.trim()) say(d, way, t.trim()); }}
                    className="w-32 rounded border border-stone-600 bg-stone-900 px-1 py-0.5 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-300" />
                  {offersFor(t).length ? (
                    <span data-child-loop-offers={`${k}|${way}`} className="absolute left-0 top-full z-20 mt-0.5 grid min-w-full rounded border border-stone-600 bg-stone-950 py-0.5 shadow">
                      {offersFor(t).map((o) => <button key={o} type="button" data-child-loop-offer={o} className="whitespace-nowrap px-2 text-left text-stone-300 hover:bg-stone-800" onClick={() => setTyped({ ...typed, [key]: o })}>{o}</button>)}
                    </span>
                  ) : null}
                </span>
                <span>{e2}</span>
              </>
            ); })()}
            {isNewWord(t, hisWords) ? <span data-child-loop-new-word="true" className="text-amber-200">· a new word</span> : null}
            {t.trim() ? <><span>·</span><button type="button" data-child-loop-decide-it={`${k}|${way}`} className="underline text-amber-200" onClick={() => say(d, way, t.trim())}>decide</button></> : null}
            <span>·</span><button type="button" data-child-loop-nothing={`${k}|${way}`} className="underline" onClick={() => say(d, way, 0)}>comes to nothing</button>
            {v.value === undefined ? reachOf(d, way, k) : null}
            {v.value === undefined ? shapeReachOf(d, way, k) : null}
            <NewWordNorm when={isNewWord(t, hisWords)} at={`${k}|${way}`} />{/* SLICE 3 · A: the norm's line under the field's line, once per new word */}
          </span>
        )}
        {refusal ? <span data-child-loop-refusal={`${k}|${way}`} className="pl-4 text-rose-200">{`not taken — ${refusal}`}</span> : null}
        {refusal && st.loopRefusal?.items?.length ? <LaterLosses shape={shape} items={st.loopRefusal.items} records={childRecords} /> : null}
      </div>
    );
  };
  // ── a diagonal's own reading, once both ways are said ──
  const readingLine = (d: DiagonalState): string | null => {
    if (d.reading === 'agree') return `· they agree: ${sentenceOf(d.diagonal.start, d.diagonal.end, d.word as string)}`;
    if (d.reading === 'differ') return '· they differ';
    if (d.reading === 'empty') return '· both come to nothing';
    if (d.reading === 'refused') { const it = d.diagonal.a.itself ? d.diagonal.a : d.diagonal.b; const leg = it.legs[0]; return `· the other way comes to nothing, so it refuses (${leg.kind === 'relating' ? relatingWords(leg.role) : ''})`; }
    if (d.reading === 'tension') { const w = typeof d.a.value === 'string' ? d.a.value : String(d.b.value); return `· both come to “${w}”, which is barred here: a tension, so it fills nothing`; }
    return null;
  };
  // ── the loop's state line ──
  const stateLine = () => {
    if (!reading || !loop) return null;
    const named = (r: string) => diags.filter((d) => d.reading === r);
    const ends = (ds: DiagonalState[]): string => ds.map(fromTo).join(' and ');
    if (reading.state === 'hole') return <span data-child-loop-state="hole" className="text-rose-200">{`a hole: ${ends(named('differ'))}, the two ways round differ. It stays as you said it.`}</span>;
    if (reading.state === 'waits') return <span data-child-loop-state="waits" className="text-stone-400">waits: say what each way comes to</span>;
    if (reading.state === 'settled') {
      const plain = diags.every((d) => d.reading === 'empty');
      return <span data-child-loop-state="settled" className="text-stone-400">{plain ? (diags.length > 1 ? `comes to nothing both ways, ${ends(diags)} · settled` : 'comes to nothing both ways · settled') : `settled: ${diags.map((d) => `${fromTo(d)}, ${d.reading === 'tension' ? 'a tension' : d.reading === 'refused' ? 'a refused route' : 'both come to nothing'}`).join('; ')}. It makes no relation.`}</span>;
    }
    // filled
    const agree = named('agree');
    const rest = diags.filter((d) => d.reading !== 'agree').map((d) => (d.reading === 'empty' ? `${fromTo(d)}, both come to nothing` : d.reading === 'refused' ? `${fromTo(d)}, a refused route` : d.reading === 'tension' ? `${fromTo(d)}, a tension` : '')).filter(Boolean);
    const relRow = relationNameOf(st.relationNames, shape.id, siteId, L, loop); // his name, kept on the loop's kind (§9.48 Q3), as this loop sees it
    const ri = loop.i; const rj = loop.j;
    // until named it reads as its loop: from the role both parents' words run from, else each side with its own arrow (§9.41 (1))
    const runs = [loop.X, loop.Y].filter((s): s is Say & { same: false } => !s.same).map((s) => (s.undirected ? null : s.fwd)); // an undirected say runs no way
    const common = runs.length && runs.every((x) => x === true) ? ri : runs.length && runs.every((x) => x === false) ? rj : null;
    return (
      <div data-child-loop-state="filled" className="grid gap-0.5">
        <span className="text-emerald-300">{`filled: ${[...agree.map((d) => `${fromTo(d)}, both ways come to “${sentenceOf(d.diagonal.start, d.diagonal.end, d.word as string)}”`), ...rest].join('; ')}. A relation of the child between ${roleRef(L.roles[ri].key)} and ${roleRef(L.roles[rj].key)}.`}</span>
        {relationNaming(loopId, relRow, [ri, rj], <span className="text-stone-400">{`until named, it reads as its loop${common !== null ? `, from ${roleRef(L.roles[common].key)}` : ', each side with its own arrow'}`}</span>)}
      </div>
    );
  };

  // ── the scope (the designer's 13:19 §2, under §9.49 (1)): this way round, or every way round of its shape (across the solid); the count leaves the line, each way has its own shape ──
  const scopeLine = () => {
    if (!loop) return null;
    const ruledWays = diags.flatMap((d) => (['a', 'b'] as const).filter((way) => !(way === 'a' ? d.diagonal.a : d.diagonal.b).itself).flatMap((way) => [true, false].filter((m) => { const k = routeShapeOf(L, loop, d.diagonal, way, m); return st.loopRules.some(([kk, mm]) => kk === k && mm === (m ? 1 : 0)); }).map((m) => ({ d, way, m }))));
    return (
      <span data-child-loop-scope={view.scope} className="text-stone-400">
        {'say it for: '}
        <button type="button" data-child-loop-scope-choice="loop" className={view.scope === 'loop' ? 'underline decoration-2 text-stone-100' : 'underline'} onClick={() => setView({ scope: 'loop' })}>this way round</button>
        {' · '}
        <button type="button" data-child-loop-scope-choice="shape" className={view.scope === 'shape' ? 'underline decoration-2 text-stone-100' : 'underline'} onClick={() => setView({ scope: 'shape' })}>every way round of its shape</button>
        {' · '}
        <label className="inline-flex items-center gap-1"><input type="checkbox" data-child-loop-modes="true" checked={view.modes} onChange={(e) => setView({ modes: e.target.checked })} />the modes too</label>
        {ruledWays.length ? <>{' · '}<button type="button" data-child-loop-withdraw-rule="true" className="underline" onClick={() => { for (const r of ruledWays) st.withdrawLoopRule(routeShapeOf(L, loop, r.d.diagonal, r.way, r.m), r.m, { siteId, loopId, start: r.d.start, way: r.way }); }}>withdraw the rule</button></> : null}
      </span>
    );
  };


  return (
    <div data-child-loops={roleKey} className="grid gap-1">
      {asked.length === 0 ? <span data-child-loops-head="none" className="text-stone-400">no closed loop to say</span> : (
        <span data-child-loops-head={String(asked.length)} className="text-stone-400">
          {`${plural(asked.length, 'closed loop')} with ${plural(new Set(asked.map(other)).size, 'role')}: `}
          <button type="button" data-child-loops-prev="true" disabled={at === 0} className={at === 0 ? 'cursor-default text-stone-400' : 'underline hover:text-stone-100'} onClick={() => setView({ at: Math.max(0, at - 1) })}>previous</button>
          {' · '}
          <button type="button" data-child-loops-next="true" disabled={at === asked.length - 1} className={at === asked.length - 1 ? 'cursor-default text-stone-400' : 'underline hover:text-stone-100'} onClick={() => setView({ at: Math.min(asked.length - 1, at + 1) })}>next</button>
          {` · ${at + 1} of ${asked.length}`}
        </span>
      )}
      {loop && reading ? (
        <div data-child-loop={loopId} data-child-loop-kind={loop.kind} data-child-loop-state-is={reading.state} className="grid gap-1 rounded border border-stone-700 px-2 py-1.5">
          <span className="text-stone-300">{`with ${roleRef(L.roles[other(loop)].key)} `}<span className="text-stone-400">{`· ${loop.kind === 'four' ? 'four sides' : 'three sides: one end shared'}`}</span></span>
          <span data-child-loop-asks="true" className="text-stone-200">{`are these two roles related? each way round comes to what, ${diags.map(fromTo).join(', and ')}?`}</span>
          <LoopDrawing L={L} loop={loop} lit={focus} diags={diags} lbl={lbl} nX={nX} nY={nY} />
          {diags.map((d, k) => (
            <div key={d.start} data-child-loop-diagonal={k} data-child-loop-reading={d.reading} className="grid gap-0.5 border-t border-stone-800 pt-1" onMouseEnter={() => setFocus(k)} onMouseLeave={() => setFocus(null)}>
              <span className="text-stone-200">{fromTo(d)}</span>
              {farEndsLine(d, k)}
              {wayLine(d, 'a', k)}
              {wayLine(d, 'b', k)}
              {readingLine(d) ? <span data-child-loop-diagonal-reading={d.reading} className="pl-4 text-stone-300">{readingLine(d)}</span> : null}
            </div>
          ))}
          {scopeLine()}
          <div className="border-t border-stone-800 pt-1">{stateLine()}</div>
        </div>
      ) : null}
      {L.selfs.filter((sl) => sl.i === me).map((sl) => {
        // ITEM 2 · part 1 (the designer's 20:40 (2)): a role's loop with ITSELF, filled by law (§9.46 (4); built at 2e56973) — a line of its own under its loops;
        // one more relation in the row's count, as in the head
        const id = selfIdOf(L, sl);
        const arc = arcsHere.find((x) => x.loopId === id);
        const held = st.relationNames.find(([sh2, v, k]) => sh2 === shape.id && v === siteId && k === selfKindKeyOf(L, sl));
        return (
          <span key={id} data-child-loop-self={id} className="grid gap-0.5 text-stone-400">
            <span>{`with itself: filled through a pair of words, ${arc ? arc.through.join(' with ') : '…'}`}</span>
            {relationNaming(id, held ? { name: held[3], from: '' } : null, null, null)}
          </span>
        );
      })}
      {forms.length ? (
        <>
          <span data-child-loops-form={String(forms.length)} className="text-stone-400">
            {`across a refusal: ${plural(forms.length, 'loop')} with ${plural(new Set(forms.map(other)).size, 'role')}, form, never filled · `}
            <button type="button" data-child-loops-form-show="true" className="underline" onClick={() => toggle('form')}>{shown('form') ? 'hide' : 'show'}</button>
          </span>
          {shown('form') ? forms.map((f) => (
            <span key={f.id} data-child-loops-form-item="true" className="pl-4 text-stone-400">
              {`with ${roleRef(L.roles[other(f)].key)}: `}{sayLine(f.X)}{' · '}{sayLine(f.Y)}
            </span>
          )) : null}
        </>
      ) : null}
      {paired.length ? (
        <>
          <span data-child-loops-pair={String(paired.length)} className="text-stone-400">
            {`through a pair: ${plural(paired.length, 'loop')} with ${plural(new Set(paired.map(other)).size, 'role')}, never asked · `}
            <button type="button" data-child-loops-pair-show="true" className="underline" onClick={() => toggle('pair')}>{shown('pair') ? 'hide' : 'show'}</button>
          </span>
          {shown('pair') ? paired.map((pl) => {
            const r = loopReadingFor(L, pl, records);
            if (pl.law) {
              // ITEM 2 · part 1 (the designer's 20:40 (1); §9.46 (4)): a loop FILLED BY LAW stays in this list and gets one line saying how, with the same naming as any filled relation
              const lawId = loopIdOf(L, pl);
              const arc = arcsHere.find((x) => x.loopId === lawId);
              return (
                <span key={pl.id} data-child-loops-pair-item="true" data-child-loop-law={lawId} className="grid gap-0.5 pl-4 text-stone-400">
                  <span>{`with ${roleRef(L.roles[other(pl)].key)}: filled through a pair of words, ${arc ? arc.through.join(' with ') : '…'}, so both ways read the same`}</span>
                  {relationNaming(lawId, relationNameOf(st.relationNames, shape.id, siteId, L, pl), [pl.i, pl.j], null)}
                </span>
              );
            }
            return (
              <span key={pl.id} data-child-loops-pair-item="true" className="grid pl-4 text-stone-400">
                <span>{`with ${roleRef(L.roles[other(pl)].key)}`}</span>
                {r.diagonals.map((d) => (
                  <span key={d.start} className="pl-4">
                    {`${fromTo(d)}: `}
                    {(['a', 'b'] as const).map((way, n) => { const v = way === 'a' ? d.a : d.b; const w = way === 'a' ? d.diagonal.a : d.diagonal.b; return (
                      <span key={way}>{n ? ' · ' : ''}{`by ${way === 'a' ? nX : nY}'s side ${v.by === 'itself' ? `is the relating itself (${w.legs.map(legWords).join('')})` : v.by === 'pair' && typeof v.value === 'string' ? `reads across the pair: ${sentenceOf(d.diagonal.start, d.diagonal.end, v.value)}` : 'is not asked'}`}</span>
                    ); })}
                  </span>
                ))}
              </span>
            );
          }) : null}
        </>
      ) : null}
      {twos.length ? (
        <>
          <span data-child-loops-two={String(twos.length)} className="text-stone-400">
            {`two words at one pair: ${twos.length}, counted apart · `}
            <button type="button" data-child-loops-two-show="true" className="underline" onClick={() => toggle('two')}>{shown('two') ? 'hide' : 'show'}</button>
          </span>
          {shown('two') ? twos.map((t2) => <span key={t2.id} className="pl-4 text-stone-400">{`with ${roleRef(L.roles[other(t2)].key)}: ${relatingWords(t2.i)} · ${relatingWords(t2.j)}`}</span>) : null}
        </>
      ) : null}
      {many.map((m, k) => (
        <span key={`${m.side}|${m.w}|${k}`} data-child-loops-many={`${m.side}|${m.w}`} className="text-stone-400">
          {`${m.side === 'X' ? nX : nY}'s ${m.w} holds among ${m.terms.length === 3 ? 'three' : m.terms.length} roles, so it makes no loop · `}
          <button type="button" className="underline" onClick={() => toggle(`many|${k}`)}>{shown(`many|${k}`) ? 'hide' : 'show'}</button>
          {shown(`many|${k}`) ? <span className="block pl-4">{`${m.w}(${m.terms.map((t) => lbl(m.side, t)).join(', ')})`}</span> : null}
        </span>
      ))}
    </div>
  );
}

const sayLine = (s: Say) => (s.same ? <span>the same role</span> : <span className={s.holds ? '' : 'line-through text-stone-400'}>{s.words ?? `${s.from} ${s.w} ${s.to}`}</span>); // §9.48: never a kind's key

/** THE LOOP, DRAWN (the designer's mock): the first corner's roles on top, the second's below; its say along the top and the other's along the bottom, each
 *  with its arrow as said (struck where it does not hold); the two relatings as the uprights; the two diagonals faint, the one being answered lit with its two
 *  ways round in their colours; the dot where a diagonal starts, the ring where it ends */
function LoopDrawing({ L, loop, lit, diags, lbl, nX, nY }: { L: ChildLoops; loop: ChildLoop; lit: number | null; diags: DiagonalState[]; lbl: (side: 'X' | 'Y', id: string) => string; nX: string; nY: string }) {
  const W = 640; const H = 150; const LEFT = 150; const RIGHT = W - 130; const T = 22; const B = H - 18; const M = (LEFT + RIGHT) / 2;
  const ri = L.roles[loop.i]; const rj = L.roles[loop.j];
  const xi = loop.X.same ? M : LEFT; const xj = loop.X.same ? M : RIGHT; const yi = loop.Y.same ? M : LEFT; const yj = loop.Y.same ? M : RIGHT;
  const pos = { xi: [xi, T], xj: [xj, T], yi: [yi, B], yj: [yj, B] } as const;
  const head = (id: string, col: string) => <marker id={id} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L8,4 L0,8 z" fill={col} /></marker>;
  const idp = `loop-${loop.id}`;
  const litD = lit !== null ? diags[lit] : null;
  const ends = (d: DiagonalState): [readonly number[], readonly number[]] => [d.diagonal.from === 'i' ? pos.xi : pos.xj, d.diagonal.from === 'i' ? pos.yj : pos.yi];
  const line = (x1: number, y1: number, x2: number, y2: number, col: string, mk: string, dash?: string, both?: boolean) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth={1.6} strokeDasharray={dash} markerEnd={`url(#${idp}-${mk})`} markerStart={both ? `url(#${idp}-${mk})` : undefined} />;
  const say = (s: Say, x1: number, x2: number, y: number, col: string, mk: string, ly: number) => {
    if (s.same) return null;
    const [a, b] = s.fwd ? [x1 + 50, x2 - 50] : [x2 - 50, x1 + 50];
    // §9.48 (the designer's 18:43 §1): a born parent's relation is drawn by his name, or with no label where it is unnamed; one with no direction of its own
    // wears an arrowhead at each end
    return <g>{line(a, y, b, y, s.holds ? col : '#78716c', s.holds ? mk : 'd', s.holds ? undefined : '4 3', !!s.undirected)}<text x={M} y={ly} textAnchor="middle" fontSize={11} fill={s.holds ? col : '#78716c'} textDecoration={s.holds ? undefined : 'line-through'}>{s.words ? (s.name ?? '') : s.w}</text></g>;
  };
  // a relating runs from its first-corner end (top) to its second-corner end (bottom), or the other way where it reads from the second (D13)
  const upright = (k: number, xTop: number, xBottom: number, col: string, mk: string, lx: number, anchor: 'start' | 'end') => { const r = L.roles[k]; const down = r.dir !== '←'; return <g>{down ? line(xTop, T + 9, xBottom, B - 9, col, mk) : line(xBottom, B - 9, xTop, T + 9, col, mk)}<text x={lx} y={H / 2 + 4} textAnchor={anchor} fontSize={11} fill={col}>{r.w}</text></g>; };
  const node = (x: number, y: number, t: string) => <g><circle cx={x} cy={y} r={2.5} fill="#d6d3d1" /><text x={x} y={y < H / 2 ? y - 8 : y + 16} textAnchor="middle" fontSize={12} fill="#f5f5f4">{t}</text></g>;
  return (
    <svg data-child-loop-drawing="true" width={W} height={H + 6} viewBox={`0 -4 ${W} ${H + 6}`} className="block max-w-full">
      <defs>{head(`${idp}-a`, WAY_A)}{head(`${idp}-b`, WAY_B)}{head(`${idp}-d`, '#78716c')}{head(`${idp}-i`, '#a8a29e')}</defs>
      <text x={4} y={T + 4} fontSize={10.5} fill="#a8a29e">{nX}</text>
      <text x={4} y={B + 4} fontSize={10.5} fill="#a8a29e">{nY}</text>
      {/* the two diagonals, faint; the one being answered lit, its ways in their colours */}
      {diags.map((d, k) => { const [s, e] = ends(d); const on = litD === d; return <line key={k} data-child-loop-diagonal-line={k} data-child-loop-diagonal-lit={on ? 'true' : undefined} x1={s[0]} y1={s[1] + 6} x2={e[0]} y2={e[1] - 6} stroke={on ? '#fcd34d' : '#57534e'} strokeWidth={on ? 1.6 : 1} strokeDasharray="4 4" />; })}
      {say(loop.X, xi, xj, T, litD ? WAY_A : '#a8a29e', litD ? 'a' : 'i', T - 6)}
      {say(loop.Y, yi, yj, B, litD ? WAY_B : '#a8a29e', litD ? 'b' : 'i', B + 14)}
      {loop.kind === 'four' || loop.kind === 'three' ? (
        <>
          {(() => { const fromI = !litD || litD.diagonal.from === 'i'; const iWay = fromI ? 'b' : 'a'; const jWay = fromI ? 'a' : 'b'; const col = (w: string) => (w === 'a' ? WAY_A : WAY_B); return (
            <>
              {upright(loop.i, xi, yi, litD ? col(iWay) : '#a8a29e', litD ? iWay : 'i', (xi + yi) / 2 - 8, 'end')}
              {upright(loop.j, xj, yj, litD ? col(jWay) : '#a8a29e', litD ? jWay : 'i', (xj + yj) / 2 + 8, 'start')}
            </>
          ); })()}
        </>
      ) : null}
      {node(xi, T, lbl('X', ri.x))}{loop.X.same ? null : node(xj, T, lbl('X', rj.x))}
      {node(yj, B, lbl('Y', rj.y))}{loop.Y.same ? null : node(yi, B, lbl('Y', ri.y))}
      {litD ? (() => { const [s, e] = ends(litD); return <g><circle cx={s[0]} cy={s[1]} r={4} fill="#fcd34d" /><circle cx={e[0]} cy={e[1]} r={6} fill="none" stroke="#fcd34d" /></g>; })() : null}
    </svg>
  );
}


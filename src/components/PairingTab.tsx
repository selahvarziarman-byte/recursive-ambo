// STAMP THE-FINDINGS-BATCH · SLICE 2b — THE PAIRING TAB (the mothership's letter of 2026-10-17 12:39; Arman's order Δ177 "right after it"; the form he
// approved at 10:55 on 10-10, Δ176: the designer's letter of 10:56, its section "The pairing tab", and the mock `.handoff/DESIGN_THE-CHILDS-CAST/pairs.html`).
//
// The opposite corner's light, measure for measure, for the two parents' roles, the text one step larger (his 10:55: "a little bit bigger/more readable" —
// body 13.5px/20px, the end gloss 12px, the field 24px high, the cards a little roomier). One of the first parent's roles at a time; each role of the second
// parent faces it in its own card: the relatings recorded between the two first, in amber, with `withdraw`; then `<role> [a word] ≡ <role> · holds · does
// not hold`; the end's gloss under the first line; `+ another`; the amber live line once ready. `≡` next to a field pairs the two roles as one point.
//
// THE ACT IS THE SAME ACT IN A NEW PLACE (the readings under Δ173 and Δ175): `record` gives each ready line to the store's one writer — a pair (`giveRolePair`),
// a relating in a word or a bar (`giveRelating`) — and the store checks membership against the CHILD at a born end (D-2), never the resolver. Direction is PER
// WORD as built at 4400618: a word used on this edge reads its way; a new word asks `which way it reads`, with neither way chosen, and does not count toward
// `record` until he chooses. The old click-to-pair on the drawing is REMOVED (the mothership's §354 (d), on Arman's 10:31 Δ173): relating happens in one place,
// here; a click on a role in the drawing opens its turn (the page's view, `pairsView`, never a record).
import { useState, type ReactNode } from 'react';
import type { ConceptSpace, Edge, Shape, VertexId } from '../types/geometry';
import { useGeometryStore } from '../store/geometryStore';
import { AGAINST, ALONG, IS, IS_GLYPH, dirOf, type Dir, type Relating, type Sign } from '../lib/relatings';
import { NewWordNorm, WordField, isNewWord } from './WordField';

export interface PairingTabProps {
  shape: Shape;
  siteId: VertexId;
  edgeId: Edge['id'];
  la: string; // the first parent's name (the edge's first corner: the roles walked)
  lb: string; // the second's (the cards)
  castA: ConceptSpace; // the two columns as the drawing draws them (`columnSpaceOf`: a seed corner its cast, a born corner its CHILD — one reader, MODES-3)
  castB: ConceptSpace;
  nA: (id: string) => string;
  nB: (id: string) => string;
  glossOf: (role: { marks?: unknown }) => string | null;
  recorded: ReadonlyArray<Relating>; // every relating held on the edge — the pairs, his words, his bars — in the record's order
  wordWay: (w: string) => Dir | null; // a word's own direction on this edge (4400618): the way his relatings in it all read, else none
  hisWords: readonly string[]; // his words, offered as he types (TAGS)
  carried: (x: string, y: string) => string | null; // MODES-4 · M1: at a corner edge the coordinate pair is not offered as ≡, by name (`holds F7 already`)
  a: VertexId; // the two parents, the edge's first and second corner
  b: VertexId;
  refusals: ReactNode; // SLICE 2b's riders (the mothership's 16:26, MISPLACED ruled): a refused `record` shows HERE, beside the `record` he pressed, once — the store's refusal in the house grammar
}

type Draft = { word: string; sign: Sign | null; way: Dir | null };
const EMPTY: Draft = { word: '', sign: null, way: null };
const fieldClass = 'h-6 w-32 rounded border border-stone-700 bg-stone-900 px-1 text-[13.5px] text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-300';

export function PairingTab({ shape, siteId, edgeId, la, lb, castA, castB, nA, nB, glossOf, recorded, wordWay, hisWords, carried, a, b, refusals }: PairingTabProps) {
  // the page's view: the role whose turn it is (a click on the drawing sets it), and the card a click on the other column lit — never a record
  useGeometryStore((s) => s.pairsView);
  const st = useGeometryStore.getState();
  const view = st.pairsView && st.pairsView.siteId === siteId ? st.pairsView : null;
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [extra, setExtra] = useState<Record<string, number>>({});
  const X = castA.roles;
  const Y = castB.roles;
  if (X.length === 0 || Y.length === 0) {
    // the designer's 16:18 (5): the line names the gesture, not only the cause — a seed corner's roles come with its cast; a born corner's with the relatings on its parents' edge (the coder's words for the latter, asked)
    const who = X.length === 0 ? a : b;
    const v = shape.vertices[who];
    const born = v && v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2;
    const parents = born ? v.createdBy.sourceVertexIds.map((p) => shape.vertices[p]?.data.label?.trim() || 'unnamed') : [];
    // the tab's quiet tone is stone-400, item 7c's floor (the eye at 1159db4 read stone-500 at 4.12:1 and the disabled stone-600 at 2.59:1 against the ground; C-7f item 7 lifted `fit selected` the same way)
    return <span data-pairs-empty={born ? 'born' : 'seed'} className="text-stone-400">{born ? `${X.length === 0 ? la : lb} has no roles yet: relate on ${parents[0]}–${parents[1]} first` : `${X.length === 0 ? la : lb} has no roles yet: load its cast in the casts drawer`}</span>;
  }
  const at = Math.max(0, view && view.at !== null ? X.findIndex((r) => r.id === view.at) : 0);
  const z = X[at];
  const setAt = (i: number): void => st.setPairsView({ siteId, at: X[Math.max(0, Math.min(X.length - 1, i))].id, lit: null });
  const key = (x: string, y: string, n: number): string => `${x}|${y}|${n}`;
  const draftOf = (k: string): Draft => drafts[k] ?? EMPTY;
  const setDraft = (k: string, patch: Partial<Draft>): void => setDrafts({ ...drafts, [k]: { ...draftOf(k), ...patch } });
  const wordOf = (d: Draft): string => (d.word.trim() === 'IS' ? IS : d.word.trim()); // typed `IS` is the glyph (the mock, line 128)
  // the way a line reads: the word's own on this edge, else the way he chose for this new word, else none — and then it is not ready (4400618; F5)
  // VL 42 (the designer's 15:05, item 4): a new word asks once per unrecorded batch — the way he chose for it on one card of this turn is the batch's; changing it there changes the batch
  const batchWay = (w: string): Dir | null => { for (const k of Object.keys(drafts)) { if (!k.startsWith(`${z.id}|`)) continue; const d = drafts[k]; if (wordOf(d) === w && d.way !== null) return d.way; } return null; };
  const wayOf = (d: Draft): Dir | null => (wordOf(d) === IS ? ALONG : wordWay(wordOf(d)) ?? d.way ?? batchWay(wordOf(d)));
  const isReady = (x: string, y: string, d: Draft): boolean => wordOf(d).length > 0 && d.sign !== null && wayOf(d) !== null && !(wordOf(d) === IS && carried(x, y) !== null);
  // the sentence as he said it (D13): a pair `x ≡ y`; a word along, `x w y`; against, `y w x`
  const said = (w: string, x: string, y: string, dir: Dir): string => (w === IS ? `${nA(x)} ≡ ${nB(y)}` : dir === AGAINST ? `${nB(y)} ${w} ${nA(x)}` : `${nA(x)} ${w} ${nB(y)}`);
  const turnKeys = Object.keys(drafts).filter((k) => k.startsWith(`${z.id}|`));
  const ready = turnKeys.filter((k) => isReady(k.split('|')[0], k.split('|')[1], drafts[k]));
  const record = (): void => {
    const next = { ...drafts };
    for (const k of ready) {
      const [x, y] = k.split('|');
      const d = drafts[k];
      const w = wordOf(d);
      const dir = wayOf(d) ?? ALONG;
      if (w === IS && d.sign === '+') st.giveRolePair(edgeId, x, y);
      else st.giveRelating(edgeId, w, x, y, d.sign as Sign, dir);
      delete next[k];
    }
    setDrafts(next);
    setExtra(Object.fromEntries(Object.entries(extra).filter(([k]) => !k.startsWith(`${z.id}|`))));
  };
  const withdraw = (r: Relating): void => {
    if (r[0] === IS && r[3] === '+') st.withdrawRolePair(edgeId, r[1], r[2]);
    else st.withdrawRelating(edgeId, r[0], r[1], r[2], dirOf(r));
  };
  const zGloss = glossOf(z);
  const walk = (label: string, to: number, disabled: boolean, attr: string): ReactNode => (
    <button type="button" {...{ [attr]: 'true' }} disabled={disabled} className={disabled ? 'text-stone-400' : 'underline hover:text-amber-100'} onClick={() => setAt(to)}>{label}</button>
  );
  return (
    <div data-pairs-box={`${at + 1}/${X.length}`} className="grid gap-2 text-[13.5px] leading-5 text-stone-300">
      {/* the head, pinned, with the act at its end: he works type → record → next, role after role */}
      <div data-pairs-head-line="true" className="sticky top-0 z-10 -mx-1 grid gap-0.5 bg-stone-950 px-1 py-1">
        <div className="flex flex-wrap items-center gap-x-2">
          <span data-pairs-head="true" className="text-stone-100">{`${nA(z.id)} · ${at + 1} of ${X.length}`}</span>
          <span className="text-stone-400">·</span>
          {walk('previous', at - 1, at === 0, 'data-pairs-previous')}
          <span className="text-stone-400">·</span>
          {walk('next', at + 1, at >= X.length - 1, 'data-pairs-next')}
          <span className="text-stone-400">·</span>
          <button type="button" data-pairs-record={String(ready.length)} disabled={ready.length === 0} className={ready.length === 0 ? 'rounded border border-stone-800 px-2 py-0.5 text-stone-400' : 'rounded border border-amber-700 px-2 py-0.5 text-amber-200 hover:bg-amber-950/40'} onClick={record}>{`record ${ready.length}`}</button>
        </div>
        {ready.length === 0 ? <span data-pairs-hint="true" className="text-stone-400">type a word and choose holds or does not hold</span> : null}
        {refusals ? <div data-pairs-refusal="true" className="grid gap-0.5">{refusals}</div> : null}
      </div>
      {zGloss ? <span data-pairs-gloss={z.id} className="text-stone-400">{zGloss}</span> : null}
      <div data-pairs-in={lb} className="grid gap-1">
        <span className="text-stone-100">{`in ${lb}`}</span>
        {Y.map((o) => {
          const here = recorded.filter((r) => r[1] === z.id && r[2] === o.id);
          const lines = (extra[`${z.id}|${o.id}`] ?? 0) + (here.length > 0 ? 0 : 1); // the designer's look (16:23): once a pair has a recorded relating, the empty row under it goes — `+ another` opens one
          const oGloss = glossOf(o);
          const note = carried(z.id, o.id);
          const lit = view !== null && view.lit === o.id;
          return (
            <div key={o.id} data-pairs-card={o.id} data-pairs-card-lit={lit ? 'true' : undefined} className={`grid gap-1 rounded border px-2.5 py-1.5 ${lit ? 'border-amber-700' : 'border-stone-800'}`}>
              {here.map((r) => (
                <span key={`${r[0]}|${r[3]}|${dirOf(r)}`} data-pairs-recorded={`${r[0]}|${r[1]}|${r[2]}|${dirOf(r)}`} data-pairs-recorded-sign={r[3]} className="text-amber-200">
                  {`${said(r[0], r[1], r[2], dirOf(r))} · ${r[3] === '+' ? 'holds' : 'does not hold'} · `}
                  <button type="button" data-pairs-withdraw={`${r[0]}|${r[1]}|${r[2]}|${dirOf(r)}`} className="underline" onClick={() => withdraw(r)}>withdraw</button>
                </span>
              ))}
              {lines === 0 && oGloss ? <span data-pairs-end-gloss={o.id} className="text-xs leading-[17px] text-stone-400">{oGloss}</span> : null}{/* the designer's look at 1159db4, her rider: a card with a recorded relating keeps the end's gloss under its recorded lines, so the role's determinacy stays in view */}
              {lines === 0 ? <span className="flex gap-x-2"><button type="button" data-pairs-another={`${z.id}|${o.id}`} className="text-stone-400 underline hover:text-stone-100" onClick={() => setExtra({ ...extra, [`${z.id}|${o.id}`]: 1 })}>+ another</button></span> : null}
              {Array.from({ length: lines }, (_, n) => {
                const k = key(z.id, o.id, n);
                const d = draftOf(k);
                const w = wordOf(d);
                const asks = w.length > 0 && w !== IS && wordWay(w) === null && (d.way !== null || batchWay(w) === null); // a new word on this edge: which way it reads, his choice — asked once per batch (VL 42 (4)): a card whose word another card of this turn already chose a way for does not ask
                const newWord = isNewWord(w, hisWords) && wordWay(w) === null; // SLICE 3 · A (the designer's 14:11): the one predicate for `· a new word` and for the norm's line
                const live = isReady(z.id, o.id, d);
                return (
                  <span key={k} data-pairs-cell={k} className="grid gap-0.5">
                    <span data-pairs-line={k} className="flex flex-wrap items-center gap-x-2">
                      <span className="text-stone-100">{nA(z.id)}</span>
                      <WordField value={d.word} onChange={(v) => setDraft(k, { word: v, way: null })} words={hisWords} field={{ 'data-pairs-word': k, type: 'text', spellCheck: false, placeholder: 'a word', className: fieldClass }} />
                      {note === null
                        ? <button type="button" data-pairs-is={k} title="IS: the two as one point" className={w === IS ? 'text-stone-100' : 'text-stone-400 hover:text-stone-100'} onClick={() => setDraft(k, { word: IS, way: null })}>{IS_GLYPH}</button>
                        : <span data-pairs-carried={o.id} className="text-stone-400">{note}</span>}
                      <span className="text-stone-100">{nB(o.id)}</span>
                      <span data-pairs-sign-pair="true" className="inline-flex items-center gap-x-2 whitespace-nowrap">
                        <button type="button" data-pairs-sign="+" data-pairs-sign-chosen={d.sign === '+' ? 'true' : undefined} className={d.sign === '+' ? 'underline text-stone-100' : 'text-stone-400 hover:text-stone-100'} onClick={() => setDraft(k, { sign: d.sign === '+' ? null : '+' })}>holds</button>
                        <span className="text-stone-400">·</span>
                        <button type="button" data-pairs-sign="-" data-pairs-sign-chosen={d.sign === '-' ? 'true' : undefined} className={d.sign === '-' ? 'underline text-stone-100' : 'text-stone-400 hover:text-stone-100'} onClick={() => setDraft(k, { sign: d.sign === '-' ? null : '-' })}>does not hold</button>
                      </span>
                    </span>
                    {oGloss && n === 0 ? <span data-pairs-end-gloss={o.id} className="text-xs leading-[17px] text-stone-400">{oGloss}</span> : null}
                    {asks ? (
                      <span data-pairs-reads={k} className="text-stone-400">
                        {'which way it reads: '}
                        <button type="button" data-pairs-way="→" data-pairs-way-chosen={d.way === ALONG ? 'true' : undefined} className={d.way === ALONG ? 'underline text-stone-100' : 'hover:text-stone-100'} onClick={() => setDraft(k, { way: ALONG })}>{`${nA(z.id)} ${w} ${nB(o.id)}`}</button>
                        <span className="text-stone-400">{' · '}</span>
                        <button type="button" data-pairs-way="←" data-pairs-way-chosen={d.way === AGAINST ? 'true' : undefined} className={d.way === AGAINST ? 'underline text-stone-100' : 'hover:text-stone-100'} onClick={() => setDraft(k, { way: AGAINST })}>{`${nB(o.id)} ${w} ${nA(z.id)}`}</button>
                      </span>
                    ) : null}
                    {live ? <span data-pairs-live={k} className="text-amber-200">{`${said(w, z.id, o.id, wayOf(d) ?? ALONG)} · ${d.sign === '+' ? 'holds' : 'does not hold'}${newWord ? ' · a new word' : ''}`}</span> : null}
                    <NewWordNorm when={newWord} at={k} />
                    {n === lines - 1 ? <span className="flex gap-x-2"><button type="button" data-pairs-another={`${z.id}|${o.id}`} className="text-stone-400 underline hover:text-stone-100" onClick={() => setExtra({ ...extra, [`${z.id}|${o.id}`]: lines })}>+ another</button></span> : null}{/* the designer's look of 10-19, rider 1 (with STAMP ZOOM): `+ another` stands under the norm's line, so the line is directly under the row being chosen — under its live line when there is one — as on the loop card */}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

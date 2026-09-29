// MediumBlock — STAMP MODES-1 · B5 (2026-09-26): THE MEDIUM IN THE DESIGNER'S WORDS (her letter of 17:15, ratified for meaning
// §207; the projection ruling D2–D11; ADR 0031 §9). Under the midpoint's own column: the medium between the two corners, its
// extent AS COUNTS, the person's modes, the passages through each opposite corner with his says and his rules, where each
// relating sits (theirs alone · the face's · only in a corner's light · against your pair · against your bar), the one-line
// state with its count, the name kept with the state it was given under, and the device's own lights at a deeper generation.
// HER THREE RULES: Arman's grill words are kept and the researcher's coinages never printed (the D-names live in the record and
// in data attributes — never in text); his acts read with `you` as subject and the device's sorting as where a thing sits; a
// state is one line with a count, a description, never a grade. `≡` is IS and nothing else — inside every sentence (the legs,
// the composite, the say-hand); the modes line keeps the mode's NAME, IS. Every line is the same weight; a light is never a
// control and never first in its block (Δ80). Nothing here glues, sorts or decides: the readers are B1–B4's, the words are hers.
// MARKER MODES-1 · M3 (2026-09-29; her eye of 10:16 in Arman's Chrome at 7c64c61 — eleven lines read wrong, one cut):
//   S1 a tension's line names WHAT PRESSES by its end — his pair (`against your pair — … — you paired Φ1 with F7`) or his bar
//      (`against your bar — … — which you barred`); never `which you barred` for a pair.
//   S3 `≡` for IS inside every sentence.  S4 each leg printed AS HE SAID IT, never mirrored (the sorting's `said`); a passage with
//      a directed leg against the walk reads `not yet said` and offers `that is not it` only (the mothership's interim ruling).
//   S5 no IS fallback in the say-hand: the `that is "…"` hand exists only where a rule or his say gives the word, and never on a
//      tension (a say against his own pair or bar is refused at the act — the hand is absent; the line names what presses).
//   S6 the exception line prints only against a rule HE named and quotes only a mode word; a not-it say prints once.
//   S7 `your modes: IS · carries`, the chosen one underlined; the polarity is on the act line, each state marked: `it holds ·
//      it does not hold`.  S8 the hand reads `add it` and is a hand only with a word in the field.  S9 the child line prints
//      from the first relating on.  S10 his relatings in other modes and his bars are listed UNDER THE DRAWING where the act is
//      made (the surface's listing); the block keeps them in its sorting.  S11 (with her §4) the deeper light: `only in A's
//      light: (r8 ≡ F7) with (F7 ≡ Φ1) — both hold F7 — no relating between AC and Honesty says so`; related, `in A's light too:
//      … — you related them`; no `~`, the device never the speaker; each light says what it goes through.
//   R1 a zero passage count gives its reason.  R2 `nothing against it — no passage through C or D yet` when every view is
//      silent.  R3 `since then, …` from the first move on.  R4 `its one relating is also said through C`.

import { Fragment, useState } from 'react';
import type { Edge, Shape, VertexId } from '../types/geometry';
import { useGeometryStore } from '../store/geometryStore';
import { childSpaceOf, termWordsOf } from '../lib/instanceSpace';
import { inheritedReadingOf, mediumOf, type DerivedLight } from '../lib/descent';
import { lexiconOf, IS, type Relating } from '../lib/relatings';
import { relKey, type ReadPath, type Sorting, type ViewSorting } from '../lib/sorting';
import type { SpaceOfOptions } from '../lib/spaceOf';

export interface NamedUnder {
  relatings: number;
  own: string[];
}
export const NAMED_UNDER_KEY = 'namedUnder';

/** the state the name was given under, as the vertex's packet holds it (role keys and counts only; nothing else is read) */
export function namedUnderOf(shape: Shape, siteId: VertexId | null): NamedUnder | null {
  if (!siteId) return null;
  const raw = shape.vertices[siteId]?.data.custom?.[NAMED_UNDER_KEY];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const o = raw as { relatings?: unknown; own?: unknown };
  if (typeof o.relatings !== 'number' || !Array.isArray(o.own) || !o.own.every((k) => typeof k === 'string')) return null;
  return { relatings: o.relatings, own: [...(o.own as string[])] };
}

const join = (xs: string[]): string => xs.join(' · ');
const plural = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`;
const modeWord = (w: string): string => (w === IS ? '≡' : w);

export function MediumBlock({ shape, edge, siteId, la, lb, options, mode, setMode, bar, setBar }: { shape: Shape; edge: Edge; siteId: VertexId | null; la: string; lb: string; options: SpaceOfOptions; mode: string; setMode: (w: string) => void; bar: boolean; setBar: (b: boolean) => void }) {
  // the block SUBSCRIBES to these three (a change re-renders it) and reads their LIVE value from the store: react-dom/server
  // hands a hook the store's INITIAL snapshot, so a witness rendering under node would read `rules: []` while the store held a
  // rule (measured); the page and the witness now read the same state
  useGeometryStore((s) => s.lexicon);
  useGeometryStore((s) => s.rules);
  useGeometryStore((s) => s.relatingRefusals);
  const { lexicon, rules, relatingRefusals } = useGeometryStore.getState();
  const declareMode = useGeometryStore((s) => s.declareMode);
  const nameRule = useGeometryStore((s) => s.nameRule);
  const withdrawRule = useGeometryStore((s) => s.withdrawRule);
  const giveVerdict = useGeometryStore((s) => s.giveVerdict);
  const withdrawVerdict = useGeometryStore((s) => s.withdrawVerdict);
  const withdrawRelatingAttempt = useGeometryStore((s) => s.withdrawRelatingAttempt);
  const [newMode, setNewMode] = useState('');
  const [ruleWords, setRuleWords] = useState<Record<string, string>>({});

  const medium = mediumOf(shape, edge, options, rules);
  if (!medium || !medium.child || !medium.sorting) return null;
  const { child, sorting, lights } = medium;
  const [X, Y] = edge.vertexIds;
  const spaceX = childSpaceOf(shape, X, options);
  const spaceY = childSpaceOf(shape, Y, options);
  const labelOf = (v: VertexId): string => shape.vertices[v]?.data.label || v;
  // every name in the block reads through ONE reader: a role by its name, a role that is itself a relating in parentheses (her §1)
  const nameZ = (z: VertexId, id: string): string => termWordsOf(shape, z, id, options);
  const nameA = (id: string): string => nameZ(X, id);
  const nameB = (id: string): string => nameZ(Y, id);
  const words = lexiconOf(shape, lexicon);
  const rolesA = spaceX ? spaceX.roles.length : 0;
  const rolesB = spaceY ? spaceY.roles.length : 0;
  const sentence = (r: Relating | [string, string, string]): string => `${nameA(r[1])} ${modeWord(r[0])} ${nameB(r[2])}`;
  const viewLabel = (v: ViewSorting): string => labelOf(v.view);
  const cornersWords = sorting.views.length === 0 ? '' : sorting.views.map(viewLabel).join(' or ');
  // S4 — each leg as he said it: the sorting hands the leg in the edge's stored order; its two terms are named at their own corners
  const legWords = (p: ReadPath, leg: 0 | 1): string => {
    const [s, w, o] = p.path.said[leg];
    const z = p.path.view;
    const ends: [VertexId, VertexId] = leg === 0 ? (s === p.path.x && o === p.path.z ? [X, z] : [z, X]) : (s === p.path.z && o === p.path.y ? [z, Y] : [Y, z]);
    return `${nameZ(ends[0], s)} ${modeWord(w)} ${nameZ(ends[1], o)}`;
  };
  const passageWords = (p: ReadPath): string => `${legWords(p, 0)} · ${legWords(p, 1)}`;
  // a mixed path composed by substitution whose directed leg ran against the walk reads its composite the other way round (y w x —
  // the direction carried through, the second resolution §1); never a word on swapped coordinates
  const compositeWords = (p: ReadPath): string => (p.path.reversed ? `${nameB(p.path.y)} ${p.composite === null ? '?' : modeWord(p.composite)} ${nameA(p.path.x)}` : `${nameA(p.path.x)} ${p.composite === null ? '?' : modeWord(p.composite)} ${nameB(p.path.y)}`);
  // S1 — a tension names what presses, by its end: his pair at the target, his pair at the source, or his own bar
  const pressWords = (p: ReadPath, lz: string): string => {
    const key = (p.direct ?? '').split('|');
    if (p.end === 'target' && key.length === 3) return `against your pair — through ${lz} it would say ${compositeWords(p)} — you paired ${nameB(p.path.y)} with ${nameA(key[1])}`;
    if (p.end === 'source' && key.length === 3) return `against your pair — through ${lz} it would say ${compositeWords(p)} — you paired ${nameA(p.path.x)} with ${nameB(key[2])}`;
    return `against your bar — through ${lz} it would say ${compositeWords(p)} — which you barred`;
  };
  const readingWords = (p: ReadPath, lz: string): string => {
    if (p.reading === 'COMPOSED') return `the face's — said between them and through ${lz} too: ${compositeWords(p)}`;
    if (p.reading === 'LIGHT') return `only in ${lz}'s light — through ${lz} it would read: ${compositeWords(p)} — no relating between ${la} and ${lb} says so`;
    if (p.reading === 'TENSION') return pressWords(p, lz);
    if (p.reading === 'NOT') return 'you said: that is not it';
    return 'not yet said';
  };
  // R1 — a zero passage count gives its reason: the empty leg named, or the two legs that do not meet
  const viewHead = (v: ViewSorting): string => {
    const lz = viewLabel(v);
    if (v.paths.length > 0) return `through ${lz}: ${plural(v.paths.length, 'passage', 'passages')}`;
    const empty = [!v.legs[0] ? `${la}–${lz}` : null, !v.legs[1] ? `${lz}–${lb}` : null].filter((s): s is string => s !== null);
    if (empty.length === 2) return `${lz} — no passage yet: nothing related on ${empty[0]} or ${empty[1]}`;
    if (empty.length === 1) return `${lz} — no passage yet: nothing related on ${empty[0]}`;
    return `through ${lz}: no passage — what you related on ${la}–${lz} and on ${lz}–${lb} does not meet`;
  };
  const related = sorting.instances.length;
  const alsoSaid = (): string => `nothing theirs alone — ${related === 1 ? 'its one relating is' : 'all ' + related + ' relatings are'} also said through ${cornersWords}`;
  // M4 §1 — VACUOUS in the undetected line's shape: he has related, no corner has seen it (`seen through` is the light's own sense)
  const vacuousLine = (): string => {
    const names = sorting.views.map(viewLabel);
    const through = names.length <= 1 ? names[0] ?? '' : names.length === 2 ? `${names[0]} or ${names[1]}` : `${names.slice(0, -1).join(', ')} or ${names[names.length - 1]}`;
    const which = names.length <= 1 ? 'it' : names.length === 2 ? 'either' : 'any';
    return `${la} and ${lb}, ${plural(related, 'relating', 'relatings')} — not yet seen through ${through}: no passage through ${which} yet`;
  };
  // M4 §2 — COHERENT names its two positive facts: the passages counted at the corners that hold them, none unsaid; then the negations
  const coherentLine = (): string => {
    const holding = sorting.views.filter((v) => v.paths.length > 0);
    const count = holding.reduce((n, v) => n + v.paths.length, 0);
    const corners = holding.map(viewLabel);
    const through = corners.length <= 1 ? corners[0] ?? '' : `${corners.slice(0, -1).join(', ')} and ${corners[corners.length - 1]}`;
    return `nothing against it — ${plural(count, 'passage', 'passages')} through ${through}, none unsaid; no bar pressed, no say differs, the views agree on what is theirs alone`;
  };
  // THE STATE LINE reads the sorting's ONE token at §8's precedence (MODES-2 (d)): UNDETECTED · VACUOUS · UNRULED (the counts; the
  // per-view line says which passage is unsaid — her §3) · POCKET · EXHAUSTED · CLOSED · COHERENT · otherwise the counts
  const countsLine = (): string => `${plural(sorting.own.length, 'relating', 'relatings')} theirs alone · ${plural(sorting.centroid.length, 'relating', 'relatings')} the face's`;
  const stateLine = (): string => {
    switch (sorting.state) {
      case 'UNDETECTED': return `${la} and ${lb} together, as two — not yet looked into: nothing related between them yet`;
      case 'VACUOUS': return vacuousLine();
      case 'UNRULED': return countsLine();
      case 'POCKET': return 'the views leave different things alone — nothing is theirs alone under every view'; // M1 (d): the head; one line per relating below, never a first
      case 'EXHAUSTED': return alsoSaid();
      case 'CLOSED': return `all the face's — nothing theirs alone, nothing only in a corner's light`;
      case 'COHERENT': return coherentLine();
      default: return countsLine();
    }
  };
  // M1 (d) — in a POCKET, one line per relating some view leaves alone: where it is theirs alone and where it is the face's, by corner
  const pocketLines = (): Array<[string, string]> => (sorting.state !== 'POCKET' ? [] : sorting.instances
    .map((r): [string, Relating] => [relKey(r), r])
    .filter(([k]) => sorting.views.some((v) => v.own.includes(k)))
    .map(([k, r]) => {
      const alone = sorting.views.filter((v) => v.own.includes(k)).map(viewLabel);
      const faces = sorting.views.filter((v) => v.centroid.includes(k)).map(viewLabel);
      const list = (xs: string[]): string => (xs.length <= 1 ? xs[0] ?? '' : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
      const facesPart = faces.length ? " · the face's through " + list(faces) : '';
      return [k, `${sentence(r)} — theirs alone through ${list(alone)}${facesPart}`];
    }));
  const named = namedUnderOf(shape, siteId);
  const siteName = siteId ? labelOf(siteId) : null;
  const left = named ? named.own.filter((k) => !sorting.own.includes(k)).length : 0;
  const entered = named ? sorting.own.filter((k) => !named.own.includes(k)).length : 0;
  const refusal = relatingRefusals[edge.id];
  const facePositions = (v: ViewSorting): [number, number] | null => {
    const f = shape.faces.find((x) => x.id === v.faceId);
    if (!f) return null;
    return [f.vertexIds.indexOf(X), f.vertexIds.indexOf(Y)];
  };
  // a `composed` say names the direct's mode (w3); a `not` say speaks of no direct and carries none
  const verdictRecord = (v: ViewSorting, p: ReadPath, verdict: 'composed' | 'not', w3?: string) => {
    const base = facePositions(v);
    if (!base) return null;
    return { base, x: p.path.x, w: p.path.w, z: p.path.z, w2: p.path.w2, y: p.path.y, ...(verdict === 'composed' && w3 ? { w3 } : {}), verdict };
  };
  // S11 with her §4 — a light through a relating of the third corner says what it goes through (the opposite-midpoint kind, a
  // light still); the shared-coordinate kind is NOT a light (the second resolution D14/D15, the mothership's amendment to M3): it is
  // the parent's passage INHERITED, read at the child's resolution with the EXISTING forms (the face's · the light · the tension ·
  // his say · not yet said) and no new copy until the designer's words; the coordinate kind on a corner edge is the child's
  // structure, shown by the surface (MODES-3), never a light — no line here
  const linkWords = (l: DerivedLight): string => ('role' in l.link ? `both hold ${nameZ(l.through, l.link.role)}` : `by ${nameZ(l.link.corners[0], l.link.relating[0])} ${modeWord(l.link.relating[1])} ${nameZ(l.link.corners[1], l.link.relating[2])}`);
  const inheritedWords = (l: DerivedLight): { text: string; reading: string } | null => {
    const got = inheritedReadingOf(shape, l, options, rules);
    if (!got) return null;
    const { path: rp, edge: [E0, E1] } = got;
    const lt = labelOf(l.through);
    const composite = `${nameA(l.x)} ≡ ${nameB(l.y)}`;
    const key = (rp.direct ?? '').split('|');
    const reading = rp.reading === 'COMPOSED' ? `the face's — said between them and through ${lt} too: ${composite}`
      : rp.reading === 'LIGHT' ? `only in ${lt}'s light — through ${lt} it would read: ${composite} — no relating between ${la} and ${lb} says so`
        : rp.reading === 'TENSION' ? (rp.end === 'target' && key.length === 3 ? `against your pair — through ${lt} it would say ${composite} — you paired ${nameZ(E1, rp.path.y)} with ${nameZ(E0, key[1])}`
          : rp.end === 'source' && key.length === 3 ? `against your pair — through ${lt} it would say ${composite} — you paired ${nameZ(E0, rp.path.x)} with ${nameZ(E1, key[2])}`
            : `against your bar — through ${lt} it would say ${composite} — which you barred`)
          : rp.reading === 'NOT' ? 'you said: that is not it' : 'not yet said';
    return { text: `${nameA(l.x)} · ${nameB(l.y)} — ${reading}`, reading: rp.reading };
  };
  const derivedWords = (l: DerivedLight): { text: string; inherited: string | null } | null => {
    if (l.kind === 'shared-coordinate') { const w = inheritedWords(l); return w ? { text: w.text, inherited: w.reading } : null; }
    if (l.kind === 'coordinate') return null;
    return { text: l.held ? `in ${labelOf(l.through)}'s light too: ${nameA(l.x)} with ${nameB(l.y)} — ${linkWords(l)} — you related them` : `only in ${labelOf(l.through)}'s light: ${nameA(l.x)} with ${nameB(l.y)} — ${linkWords(l)} — no relating between ${la} and ${lb} says so`, inherited: null };
  };
  const holdWord = mode === IS ? '≡' : mode;

  return (
    <div data-medium="true" data-medium-state={sorting.state} data-medium-coherent={String(sorting.coherent)} data-medium-closed={String(sorting.closed)} data-medium-rules={String(rules.length)} className="mt-2 grid gap-0.5 rounded border border-stone-800 bg-stone-950/60 px-2 py-1 text-stone-300">
      <span data-medium-head="true" className="text-stone-100">{`between ${la} and ${lb} — ${plural(words.length, 'mode', 'modes')} · ${rolesA} × ${rolesB} roles · ${words.length * rolesA * rolesB} could be related · ${sorting.instances.length} related · ${sorting.bars.length} barred`}</span>
      {/* the lines are flex rows; the SPACES between their items are real text nodes (a whitespace-only node is not laid out in a flex
          row, but it is the line's text — what a person copies, what a reader reads: `your modes: IS · carries`, never `your modes:IS·carries`);
          her ` · ` is text in the line's own colour, never a dimmer glyph (the eye's floor: every text node at ≥ 4.5:1) */}
      <span data-medium-modes="true" className="flex flex-wrap items-center gap-x-2">
        <span>your modes:</span>
        {words.map((w, i) => (
          <Fragment key={w}>
            {i > 0 ? ' · ' : ' '}
            <button type="button" data-medium-mode={w} data-medium-mode-chosen={w === mode ? 'true' : undefined} className={w === mode ? 'underline text-stone-100' : 'text-stone-300'} onClick={() => setMode(w)}>{w}</button>
          </Fragment>
        ))}
      </span>
      <span data-medium-gesture="true" className="flex flex-wrap items-center gap-x-2 text-stone-400">
        <span>{`a relating — pick a point in ${la} and one in ${lb}; it reads "${la}'s point ${holdWord} ${lb}'s point" —`}</span>
        {' '}
        <button type="button" data-medium-hold="+" data-medium-hold-chosen={bar ? undefined : 'true'} className={bar ? 'text-stone-400' : 'underline text-stone-100'} onClick={() => setBar(false)}>it holds</button>
        {' · '}
        <button type="button" data-medium-hold="-" data-medium-hold-chosen={bar ? 'true' : undefined} className={bar ? 'underline text-amber-200' : 'text-stone-400'} onClick={() => setBar(true)}>it does not hold</button>
      </span>
      <span data-medium-mode-gesture="true" className="flex flex-wrap items-center gap-x-2">
        <span>a mode — your word for how they relate:</span>
        {' '}
        <input data-medium-mode-input="true" value={newMode} onChange={(e) => setNewMode(e.target.value)} placeholder="a new one" className="h-5 w-28 rounded border border-stone-700 bg-stone-900 px-1 text-xs text-stone-100" />
        {newMode.trim() ? <>{' '}<button type="button" data-medium-mode-declare="true" className="underline" onClick={() => { declareMode(newMode); setNewMode(''); }}>add it</button></> : null}
      </span>
      {refusal ? (
        <span data-medium-refusal="true" className="text-amber-200">
          {`${refusal.why} · `}
          <button type="button" data-medium-withdraw-attempt="true" className="underline" onClick={() => withdrawRelatingAttempt(edge.id)}>withdraw this attempt</button>
        </span>
      ) : null}
      {child.instances.length > 0 ? <span data-medium-child="true">{`the concept between ${la} and ${lb} — made of your ${plural(child.instances.length, 'relating', 'relatings')}`}</span> : null}
      {child.discordances.map((d) => (
        <span key={`${d.word}|${d.terms.join('|')}`} data-medium-differ="true">{`the two sides differ: ${d.word.replace('≡', ' ≡ ')} on ${d.terms.join(', ')} — ${d.viaA === 'holds' ? 'holds' : 'does not'} by ${la} · ${d.viaB === 'holds' ? 'holds' : 'does not'} by ${lb} — both kept`}</span>
      ))}
      {sorting.views.map((v) => {
        const lz = viewLabel(v);
        // M6 (the designer's second eye, 12:44; the mothership 12:48): the rule gesture and the rule line exist only for the passages a
        // rule can READ — two mode legs (an IS leg composes by the transport's law, §9.12) and no directed leg against the walk (the
        // interim, S4: no rule keys on that pattern until D13's directed keys land) — never offered from a passage they cannot answer,
        // never claiming a hold on one that stays `not yet said`
        const readable = v.paths.filter((p) => p.path.w !== IS && p.path.w2 !== IS && !p.path.against);
        const pairsSeen = [...new Set(readable.map((p) => `${p.path.w}|${p.path.w2}`))];
        return (
          <div key={v.view} data-medium-view={lz} data-medium-view-vacuous={String(v.vacuous)} className="grid gap-0.5">
            <span data-medium-view-head="true" className="text-stone-100">{viewHead(v)}</span>
            {v.paths.map((p) => {
              // the `that is "…"` hand exists only where a rule, substitution or his say gives the word (S5 a), never on a tension
              // (S5 b — the say would set the barred entry by the back door; the line names what presses), never on a passage read
              // against the walk (S4, interim). `that is not it` stays on a MODE tension (an exception to his rule on this path —
              // the second resolution §6) and is absent on an IS tension (the one-to-one law, IS ; IS = IS, substitution are the
              // transport's, not his rules: no say at all; the route is the pairing)
              // M5 (the researcher's 12:21, ADR 0031 §9.12): the verdict hands of D6 live on paths of TWO MODE LEGS only — on every
              // path with an IS leg the composite is the transport's law (two IS legs compose to IS; one IS leg and a mode leg
              // compose by substitution), and a law is not his to except: an IS light, a mixed light, an IS or mixed tension carry
              // no hand; the store refuses a say there by name — the guard is the rule, the absence follows from it
              const twoModeLegs = p.path.w !== IS && p.path.w2 !== IS;
              const sayable = twoModeLegs && p.composite !== null && p.reading !== 'TENSION' && !p.path.against;
              const notSayable = twoModeLegs;
              return (
                <span key={`${p.path.x}|${p.path.w}|${p.path.z}|${p.path.w2}|${p.path.y}`} data-medium-passage={`${p.path.x}|${p.path.w}|${p.path.z}|${p.path.w2}|${p.path.y}`} data-medium-passage-reading={p.reading} data-medium-passage-by={p.by ?? undefined} data-medium-passage-end={p.end ?? undefined} data-medium-passage-against={p.path.against ? 'true' : undefined} className="flex flex-wrap gap-x-2">
                  <span>{`${passageWords(p)} — ${readingWords(p, lz)}`}</span>
                  {p.by === 'verdict' || p.recorded ? (
                    <>
                      {/* a composed say stored on an against-path before the interim ruling is read as `not yet said` but PRINTED with its
                          withdraw (12:19 (ii): a record he cannot see is a fact with no mark) */}
                      {p.reading === 'NOT' ? null : <span data-medium-said="true" data-medium-said-recorded={p.recorded ? 'true' : undefined}>{`you said: that is "${p.recorded ? `${nameA(p.path.x)} ${modeWord(p.recorded)} ${nameB(p.path.y)}` : compositeWords(p)}"`}</span>}
                      {p.exception && p.composite !== null ? <span data-medium-exception="true">{`except here — you said this passage is "${p.composite}"`}</span> : null}
                      <button type="button" data-medium-say-withdraw="true" className="underline" onClick={() => { const r = verdictRecord(v, p, 'not'); if (r) withdrawVerdict(v.faceId, r); }}>withdraw what you said</button>
                    </>
                  ) : (
                    <>
                      {sayable ? <button type="button" data-medium-say={`composed|${p.composite}`} className="underline" onClick={() => { const r = verdictRecord(v, p, 'composed', p.composite ?? undefined); if (r) giveVerdict(v.faceId, r); }}>{`that is "${compositeWords(p)}"`}</button> : null}
                      {notSayable ? <button type="button" data-medium-say="not" className="underline" onClick={() => { const r = verdictRecord(v, p, 'not'); if (r) giveVerdict(v.faceId, r); }}>that is not it</button> : null}
                    </>
                  )}
                </span>
              );
            })}
            {pairsSeen.map((pair) => {
              const [w, w2] = pair.split('|');
              const rule = rules.find((r) => r[0] === w && r[1] === w2);
              const builtIn = w === IS || w2 === IS; // M5: a word pair with an IS leg composes by the transport's law — no rule of his keys on it, no gesture offers one
              const exceptions = readable.filter((p) => p.path.w === w && p.path.w2 === w2 && p.exception).length;
              if (builtIn) return null;
              return rule ? (
                <span key={pair} data-medium-rule={`${w}|${w2}|${rule[2]}`}>
                  {`you named it: ${w}, then ${w2} = ${rule[2]} — your word for the two in a row; holds on every passage with those two${exceptions ? ` — yours, with ${plural(exceptions, 'exception', 'exceptions')}` : ''} · `}
                  <button type="button" data-medium-rule-withdraw={`${w}|${w2}`} className="underline" onClick={() => withdrawRule(w, w2)}>withdraw</button>
                </span>
              ) : (
                <span key={pair} data-medium-rule-gesture={`${w}|${w2}`} className="flex flex-wrap items-center gap-x-2">
                  <span>{`name the two in a row: ${w}, then ${w2} =`}</span>
                  <input data-medium-rule-input={`${w}|${w2}`} value={ruleWords[pair] ?? ''} onChange={(e) => setRuleWords({ ...ruleWords, [pair]: e.target.value })} placeholder="your word" className="h-5 w-24 rounded border border-stone-700 bg-stone-900 px-1 text-xs text-stone-100" />
                  <button type="button" data-medium-rule-name={`${w}|${w2}`} className="underline" onClick={() => { nameRule(w, w2, ruleWords[pair] ?? ''); setRuleWords({ ...ruleWords, [pair]: '' }); }}>name it</button>
                </span>
              );
            })}
            {v.unruled.length > 0 ? <span data-medium-unruled={String(v.unruled.length)}>{`${plural(v.unruled.length, 'passage', 'passages')} through ${lz} you have not said what ${v.unruled.length === 1 ? 'it comes' : 'they come'} to`}</span> : null}
          </div>
        );
      })}
      {(() => {
        const said = new Map<string, Array<[string, string]>>();
        for (const v of sorting.views) for (const p of v.paths) if (p.by === 'verdict' && p.composite !== null) { const k = `${p.path.w}|${p.path.w2}`; said.set(k, [...(said.get(k) ?? []), [viewLabel(v), p.composite]]); }
        const differ = [...said.entries()].filter(([, s]) => new Set(s.map(([, c]) => c)).size > 1);
        return differ.map(([k, s]) => <span key={k} data-medium-says-differ={k}>{`your says differ across the faces: ${s.map(([lz, c]) => `through ${lz} you said "${c}"`).join(', ')}`}</span>);
      })()}
      {sorting.instances.length > 0 && sorting.state !== 'VACUOUS' ? (
        <span data-medium-own={String(sorting.own.length)}>{sorting.own.length ? `${la} and ${lb}'s alone — no passage through ${cornersWords || 'any corner'} comes to it: ${join(sorting.own.map((k) => sentence(sorting.instances.find((r) => relKey(r) === k) as Relating)))}` : alsoSaid()}</span>
      ) : null}
      {sorting.views.filter((v) => v.centroid.length > 0).map((v) => (
        <span key={`c-${v.view}`} data-medium-faces={viewLabel(v)}>{`the face's — said between them and through ${viewLabel(v)} too: ${join(v.centroid.map((k) => sentence(sorting.instances.find((r) => relKey(r) === k) as Relating)))}`}</span>
      ))}
      <span data-medium-state-line="true" className="text-stone-400">{stateLine()}</span>
      {pocketLines().map(([k, text]) => <span key={`p-${k}`} data-medium-pocket-line={k} className="text-stone-400">{text}</span>)}
      {named && siteName ? <span data-medium-named-under="true">{`named when it was: ${siteName} — given when ${plural(named.relatings, 'relating was', 'relatings were')} said${left || entered ? `; since then, ${left} left what is theirs alone · ${entered} entered` : ''}`}</span> : null}
      {lights.map((l) => { const w = derivedWords(l); return w ? <span key={`${l.kind}|${l.x}|${l.y}|${l.through}|${l.via}`} data-medium-light-derived={l.kind} data-medium-light-held={l.held ? 'true' : undefined} data-medium-light-inherited={w.inherited ?? undefined}>{w.text}</span> : null; })}
    </div>
  );
}

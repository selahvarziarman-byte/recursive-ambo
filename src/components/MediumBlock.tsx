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
//   S3 `≡` for IS inside every sentence.  S4 each leg printed AS HE SAID IT, never mirrored (the sorting's `said`).
//   S5 no IS fallback in the say-hand; never a `that is` on a tension (a say against his own pair or bar is refused at the act —
//      the hand is absent; the line names what presses).
//   S6 the exception line prints only against a rule HE named and quotes only a mode word; a not-it say prints once.
//   S7 `your modes: IS · carries`, the chosen one underlined; the polarity is on the act line, each state marked: `it holds ·
//      it does not hold`.  S8 the hand reads `add it` and is a hand only with a word in the field.  S9 the child line prints
//      from the first relating on.  S10 his relatings in other modes and his bars are listed UNDER THE DRAWING where the act is
//      made (the surface's listing); the block keeps them in its sorting.  S11 (with her §4) the deeper light: `only in A's
//      light: (r8 ≡ F7) with (F7 ≡ Φ1) — both hold F7 — no relating between AC and Honesty says so`; related, `in A's light too:
//      … — you related them`; no `~`, the device never the speaker; each light says what it goes through.
//   R1 a zero passage count gives its reason.  R2 `nothing against it — no passage through C or D yet` when every view is
//   silent.  R3 `since then, …` from the first move on.  R4 `its one relating is also said through C`.
// MARKER MODES-4 · M2 and M3 (2026-09-29; the designer's forms of 17:32, ratified §231; the researcher's 17:37, ADR 0031 §9.14):
//   HER TWO REGISTERS — what he declares once about a WORD (its converse, whether a pair passes through it) sits with the MODES LINE
//   and holds everywhere; what he chooses for the NEXT ACT (the mode, the direction, holds or not) sits on the ACT LINE and resets
//   when he leaves the midpoint; each choice shows every state, the chosen one underlined. HIS SENTENCE PRINTS ONLY AS HE SAID IT —
//   the direction is never an arrow and never a rewriting; a passage's shape is said in words.
//   §1 the mode's declaration (the chosen mode, never IS): `carries the other way round: [your word] name it` → `… carried-by —
//      "y carried-by x" is "x carries y" · withdraw`; the opaque bit `a pair passes through carries · a pair stops at carries`.
//   §2 the direction, a choice on the act line: `it reads "A's point carries B's point" · "B's point carries A's point"`.
//   §3 the shape said before the legs when they do not run A → B: `from B to A: …` · `both from r3: …` · `both into r3: …`; an
//      opaque mode's mixed passage `— held apart: the pair F13 ≡ r0 stops at pictures` — no reading after it, no hand, no count.
//   §4 the rule gesture BY SHAPE (M3: a chain one key whichever way it crosses the edge, in the chain's own order; a fork and a
//      join their own keys): `name the two in a row: …` · `name the two from one point: … and … =` · `name the two into one point`.
//   §5 the per-passage word on a two-mode-leg passage, beside `that is not it`: `that is F2 [your word] Φ4 · say it`.
//   §6 the refused route on the instance wherever it is listed: `F2 carries Φ3 — not by way of C, you said`.
//   §8 `both relatings are also said through C or D` in the own line and EXHAUSTED's line alike.
// STAMP MODES-4 · rows 3–4 (D14, D15; the designer's 10:57 §3, ratified §218): THE INHERITED PASSAGE, placed where it lives. At
//   a generation-2 medial site the corner both sides hold is the coordinate view — two instances holding one role of A form a
//   passage through A that IS the generation-1 passage between their other terms, answered once, where it was made: the head
//   `through A — both sides hold A: 1 passage, answered on B–C`; each line names the two roles here, the role they share, the edge
//   where the passage lives and its reading there in the words already ratified for that edge — a tension `— on B–C, through A:
//   against your pair — you paired Φ1 with r1`; composed (an inherited ≡, the face's) `… your pair r0 ≡ Φ8 — so here (r0 ≡ F13) ≡
//   (F13 ≡ Φ8), the face's`, in the sorting's face's line `the face's — through A, your pair r0 ≡ Φ8 on B–C: (r0 ≡ F13) ≡ (F13 ≡ Φ8)`
//   (never *said between them*); a light `… only in A's light — r4 and Φ3 not paired there` (no tail inviting the act D15
//   refuses); said not-it `… you said: that is not it`; unsaid `… not yet said`. `holds` is structure, never a mode. NO HAND.

import { Fragment, useState } from 'react';
import type { Edge, Shape, VertexId } from '../types/geometry';
import { useGeometryStore } from '../store/geometryStore';
import { childSpaceOf, termWordsOf } from '../lib/instanceSpace';
import { mediumOf, type DerivedLight } from '../lib/descent';
import { nameStageOf, recordAtStage } from '../lib/stage';
import { AGAINST, ALONG, converseOf, dirOf, isOpaque, lexiconOf, IS, type Dir, type Relating } from '../lib/relatings';
import { relKey, type ReadPath, type RuleKey, type Sorting, type ViewSorting } from '../lib/sorting';
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
/** a list in words: `C` · `C or D` · `C, D or E` */
const orList = (xs: string[]): string => (xs.length <= 1 ? xs[0] ?? '' : xs.length === 2 ? `${xs[0]} or ${xs[1]}` : `${xs.slice(0, -1).join(', ')} or ${xs[xs.length - 1]}`);
const andList = (xs: string[]): string => (xs.length <= 1 ? xs[0] ?? '' : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

export function MediumBlock({ shape, edge, siteId, la, lb, options, mode, setMode, bar, setBar, dir, setDir }: { shape: Shape; edge: Edge; siteId: VertexId | null; la: string; lb: string; options: SpaceOfOptions; mode: string; setMode: (w: string) => void; bar: boolean; setBar: (b: boolean) => void; dir: Dir; setDir: (d: Dir) => void }) {
  // the block SUBSCRIBES to these (a change re-renders it) and reads their LIVE value from the store: react-dom/server
  // hands a hook the store's INITIAL snapshot, so a witness rendering under node would read `rules: []` while the store held a
  // rule (measured); the page and the witness now read the same state
  useGeometryStore((s) => s.lexicon);
  useGeometryStore((s) => s.rules);
  useGeometryStore((s) => s.relatingRefusals);
  useGeometryStore((s) => s.converses);
  useGeometryStore((s) => s.opaque);
  useGeometryStore((s) => s.log);
  useGeometryStore((s) => s.edgeTauDrafts);
  const { lexicon, rules, relatingRefusals, converses, opaque, log, edgeTauDrafts } = useGeometryStore.getState();
  const declareMode = useGeometryStore((s) => s.declareMode);
  const nameRule = useGeometryStore((s) => s.nameRule);
  const withdrawRule = useGeometryStore((s) => s.withdrawRule);
  const giveVerdict = useGeometryStore((s) => s.giveVerdict);
  const withdrawVerdict = useGeometryStore((s) => s.withdrawVerdict);
  const withdrawRelatingAttempt = useGeometryStore((s) => s.withdrawRelatingAttempt);
  const declareConverse = useGeometryStore((s) => s.declareConverse);
  const withdrawConverse = useGeometryStore((s) => s.withdrawConverse);
  const setOpaque = useGeometryStore((s) => s.setOpaque);
  const [newMode, setNewMode] = useState('');
  const [ruleWords, setRuleWords] = useState<Record<string, string>>({});
  const [sayWords, setSayWords] = useState<Record<string, string>>({});
  const [converseWord, setConverseWord] = useState('');

  const facts = { converses, opaque };
  const medium = mediumOf(shape, edge, options, rules, facts);
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
  // a relating AS HE SAID IT (D13): from the first corner `x w y`, from the second `y w x`; IS symmetric
  const sentence = (r: Relating): string => (dirOf(r) === ALONG ? `${nameA(r[1])} ${modeWord(r[0])} ${nameB(r[2])}` : `${nameB(r[2])} ${modeWord(r[0])} ${nameA(r[1])}`);
  const instanceOf = (k: string): Relating => sorting.instances.find((r) => relKey(r) === k) as Relating;
  const viewLabel = (v: ViewSorting): string => labelOf(v.view);
  const cornersWords = sorting.views.length === 0 ? '' : sorting.views.map(viewLabel).join(' or ');
  // MODES-4 · M5 (COPY-1 §11.1, the designer's 10:59; the mothership's 11:02): a line that says relatings come THROUGH corners names only
  // the corners whose passages come to at least one of them — the carrying corners (the predicate the christening line reads, D17); a
  // line that says relatings come through NO corner names every corner, because it speaks of all of them (`cornersWords` stays for it)
  const carryingWords = orList(sorting.views.filter((v) => v.centroid.length > 0).map(viewLabel));
  // §6 — the refused route is the instance's FORM wherever it is listed (D16): `F2 carries Φ3 — not by way of C, you said`
  const withForm = (k: string): string => { const vs = sorting.refused.get(k); return `${sentence(instanceOf(k))}${vs && vs.length ? ` — not by way of ${orList(vs.map(labelOf))}, you said` : ''}`; };
  // S4 — each leg as he said it: the sorting hands the leg as (subject, mode, object) with its sense along the walk; its two terms
  // are named at their own corners
  const legWords = (p: ReadPath, leg: 0 | 1): string => {
    const [s, w, o] = p.path.said[leg];
    const z = p.path.view;
    const along = p.path.dirs[leg] === ALONG;
    const ends: [VertexId, VertexId] = leg === 0 ? (along ? [X, z] : [z, X]) : (along ? [z, Y] : [Y, z]);
    return `${nameZ(ends[0], s)} ${modeWord(w)} ${nameZ(ends[1], o)}`;
  };
  // §3 — the passage's SHAPE said in words before its legs when they do not run from A to B: a chain from B to A, both from one
  // point, both into one point; a chain from A to B as today (nothing said)
  const shapeWords = (p: ReadPath): string => {
    if (p.path.source === 'triad' || p.path.mixed) return ''; // a mixed passage has no shape to say: its IS leg is symmetric
    if (p.path.shape === 'chain') return p.path.from === 'y' ? `from ${lb} to ${la}: ` : '';
    return p.path.shape === 'fork' ? `both from ${nameZ(p.path.view, p.path.z)}: ` : `both into ${nameZ(p.path.view, p.path.z)}: `;
  };
  // a chain from B to A prints its legs in the CHAIN's own order (B's leg first — her §3); every other shape as the walk meets them;
  // a coordinate path (D14) names the two roles here, the role they share and the edge where the passage lives (her 10:57 §3)
  const passageWords = (p: ReadPath): string => {
    if (p.path.source === 'coordinate' && p.inherited) return `${nameA(p.path.x)} · ${nameB(p.path.y)} — both hold ${nameZ(p.path.view, p.path.z)} — on ${labelOf(p.inherited.edge[0])}–${labelOf(p.inherited.edge[1])}, through ${labelOf(p.path.view)}`;
    return p.path.from === 'y' && p.path.source !== 'triad' ? `${shapeWords(p)}${legWords(p, 1)} · ${legWords(p, 0)}` : `${shapeWords(p)}${legWords(p, 0)} · ${legWords(p, 1)}`;
  };
  // D14/D15 — the inherited passage's reading, in the words ratified for the edge it lives on (her 10:57 §3): the generation-1
  // path's pair named at its own corners; an inherited ≡ `your pair q ≡ r — so here i ≡ j, the face's`; a light `q and r not
  // paired there` (no tail inviting the act refused at the child); a mode word carried across in the existing forms
  const inheritedWords = (p: ReadPath, lz: string): string => {
    const inh = p.inherited; const g = inh?.path;
    if (!inh || !g) return 'not yet said';
    const [E0, E1] = inh.edge; // the generation-1 path as stored: x of E0, y of E1
    const [Qc, Rc] = inh.corners; // the passage's own order: q of X's other parent, r of Y's (her §3: `your pair r0 ≡ Φ8`, `r4 and Φ3 not paired there`)
    const key = (g.direct ?? '').split('|');
    const pair = `${nameZ(Qc, inh.q)} ≡ ${nameZ(Rc, inh.r)}`;
    if (p.reading === 'TENSION') {
      if (g.reading === 'TENSION' && g.end === 'target' && key.length === 3) return `against your pair — you paired ${nameZ(E1, g.path.y)} with ${nameZ(E0, key[1])}`;
      if (g.reading === 'TENSION' && g.end === 'source' && key.length === 3) return `against your pair — you paired ${nameZ(E0, g.path.x)} with ${nameZ(E1, key[2])}`;
      if (g.reading === 'TENSION') return 'against your bar — which you barred';
      return `against your bar — through ${lz} it would say ${compositeWords(p)} — which you barred`;
    }
    if (p.reading === 'COMPOSED') return p.composite === IS ? `your pair ${pair} — so here ${nameA(p.path.x)} ≡ ${nameB(p.path.y)}, the face's` : `the face's — said between them and through ${lz} too: ${compositeWords(p)}`;
    if (p.reading === 'LIGHT') return p.composite === IS ? `only in ${lz}'s light — ${nameZ(Qc, inh.q)} and ${nameZ(Rc, inh.r)} not paired there` : `only in ${lz}'s light — through ${lz} it would read: ${compositeWords(p)} — no relating between ${la} and ${lb} says so`;
    if (p.reading === 'NOT') return 'you said: that is not it';
    if (p.reading === 'HELD') { const isLeg = g.path.w === IS ? `${nameZ(E0, g.path.x)} ≡ ${nameZ(p.path.view, g.path.z)}` : `${nameZ(p.path.view, g.path.z)} ≡ ${nameZ(E1, g.path.y)}`; return `held apart: the pair ${isLeg} stops at ${g.path.w === IS ? g.path.w2 : g.path.w}`; }
    return 'not yet said';
  };
  // the composite in ITS OWN direction (D13, §9.14): a chain's, the mode leg's under substitution, the rule's for a fork or a join —
  // never a word on swapped coordinates
  // M4 (§9.21): an undirected composite has no end first — printed symmetric, the word holding both ways (her words to come)
  const compositeWords = (p: ReadPath): string => (p.undirected ? `${nameA(p.path.x)} · ${nameB(p.path.y)} in ${p.composite === null ? '?' : modeWord(p.composite)}, both ways` : p.compositeDir === AGAINST ? `${nameB(p.path.y)} ${p.composite === null ? '?' : modeWord(p.composite)} ${nameA(p.path.x)}` : `${nameA(p.path.x)} ${p.composite === null ? '?' : modeWord(p.composite)} ${nameB(p.path.y)}`);
  // S1 — a tension names what presses, by its end: his pair at the target, his pair at the source, or his own bar
  const pressWords = (p: ReadPath, lz: string): string => {
    const key = (p.direct ?? '').split('|');
    if (p.end === 'target' && key.length === 3) return `against your pair — through ${lz} it would say ${compositeWords(p)} — you paired ${nameB(p.path.y)} with ${nameA(key[1])}`;
    if (p.end === 'source' && key.length === 3) return `against your pair — through ${lz} it would say ${compositeWords(p)} — you paired ${nameA(p.path.x)} with ${nameB(key[2])}`;
    return `against your bar — through ${lz} it would say ${compositeWords(p)} — which you barred`;
  };
  // §3 — held apart (§9.13): the pair named as he said it, the mode's declaration's own words
  const heldWords = (p: ReadPath): string => { const pair = p.path.w === IS ? legWords(p, 0) : legWords(p, 1); const w = p.path.w === IS ? p.path.w2 : p.path.w; return `held apart: the pair ${pair} stops at ${w}`; };
  const readingWords = (p: ReadPath, lz: string): string => {
    if (p.path.source === 'coordinate') return inheritedWords(p, lz);
    if (p.reading === 'COMPOSED') return `the face's — said between them and through ${lz} too: ${compositeWords(p)}`;
    if (p.reading === 'LIGHT') return `only in ${lz}'s light — through ${lz} it would read: ${compositeWords(p)} — no relating between ${la} and ${lb} says so`;
    if (p.reading === 'TENSION') return pressWords(p, lz);
    if (p.reading === 'NOT') return 'you said: that is not it';
    if (p.reading === 'HELD') return heldWords(p);
    return 'not yet said';
  };
  // §5 — the per-passage word's sentence, in the passage's own direction: `that is F2 [your word] Φ4` · from B to A `that is Φ4 [your word] F2`
  const sayEnds = (p: ReadPath): [string, string] => (p.path.from === 'y' ? [nameB(p.path.y), nameA(p.path.x)] : [nameA(p.path.x), nameB(p.path.y)]);
  // R1 — a zero passage count gives its reason: the empty leg named, or the two legs that do not meet
  const viewHead = (v: ViewSorting): string => {
    const lz = viewLabel(v);
    // D14 — the coordinate view (her 10:57 §3): its passages live on the parent edge; with none, the reason (R1) — no role of the corner held on both sides
    if (v.coordinate) return v.paths.length > 0 ? `through ${lz} — both sides hold ${lz}: ${plural(v.paths.length, 'passage', 'passages')}, answered on ${labelOf(v.coordinate.edge[0])}–${labelOf(v.coordinate.edge[1])}` : `${lz} — no passage yet: no role of ${lz} is held on both sides`;
    if (v.paths.length > 0) return `through ${lz}: ${plural(v.paths.length, 'passage', 'passages')}`;
    const empty = [!v.legs[0] ? `${la}–${lz}` : null, !v.legs[1] ? `${lz}–${lb}` : null].filter((s): s is string => s !== null);
    if (empty.length === 2) return `${lz} — no passage yet: nothing related on ${empty[0]} or ${empty[1]}`;
    if (empty.length === 1) return `${lz} — no passage yet: nothing related on ${empty[0]}`;
    return `through ${lz}: no passage — what you related on ${la}–${lz} and on ${lz}–${lb} does not meet`;
  };
  const related = sorting.instances.length;
  // R4 with her §8: one · both · all N
  const alsoSaid = (): string => `nothing theirs alone — ${related === 1 ? 'its one relating is' : related === 2 ? 'both relatings are' : 'all ' + related + ' relatings are'} also said through ${carryingWords}`; // M5: the carrying corners
  // M4 §1 — VACUOUS in the undetected line's shape: he has related, no corner has seen it (`seen through` is the light's own sense)
  const vacuousLine = (): string => {
    const names = sorting.views.map(viewLabel);
    const which = names.length <= 1 ? 'it' : names.length === 2 ? 'either' : 'any';
    return `${la} and ${lb}, ${plural(related, 'relating', 'relatings')} — not yet seen through ${orList(names)}: no passage through ${which} yet`;
  };
  // M4 §2 — COHERENT names its two positive facts: the passages counted at the corners that hold them, none unsaid; then the negations.
  // M5 (COPY-1 §11.2): its last clause was `the views agree on what is theirs alone` — FALSE whenever the views' own parts differ (one
  // corner composes a relating, the other composes nothing: a corner with no passage, the common case). COHERENT is reached only when
  // some relating comes through NO corner (else POCKET, EXHAUSTED or CLOSED, the sorting's order), so the clause states that fact with
  // its count, every corner named as the `not through` label does: `2 relatings come through neither C nor D` · `don't come through C`
  // · `come through none of C, D and E` — today's sentence otherwise, until COPY-1's words come with LAYOUT-1
  const throughNone = (): string => {
    const n = sorting.own.length; const names = sorting.views.map(viewLabel);
    const verb = (yes: string, no: string): string => (n === 1 ? yes : no);
    if (names.length === 1) return `${plural(n, 'relating', 'relatings')} ${verb("doesn't", "don't")} come through ${names[0]}`;
    if (names.length === 2) return `${plural(n, 'relating', 'relatings')} ${verb('comes', 'come')} through neither ${names[0]} nor ${names[1]}`;
    return `${plural(n, 'relating', 'relatings')} ${verb('comes', 'come')} through none of ${andList(names)}`;
  };
  const coherentLine = (): string => {
    const holding = sorting.views.filter((v) => v.paths.length > 0);
    const count = holding.reduce((n, v) => n + v.paths.length, 0);
    return `nothing against it — ${plural(count, 'passage', 'passages')} through ${andList(holding.map(viewLabel))}, none unsaid; no bar pressed, no say differs, ${throughNone()}`;
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
    .map(([k]) => {
      const alone = sorting.views.filter((v) => v.own.includes(k)).map(viewLabel);
      const faces = sorting.views.filter((v) => v.centroid.includes(k)).map(viewLabel);
      const facesPart = faces.length ? " · the face's through " + andList(faces) : '';
      return [k, `${withForm(k)} — theirs alone through ${andList(alone)}${facesPart}`];
    }));
  // MODES-4 · D17 (the second resolution §9; her 17:32 §7): the state the name was given under is RE-DERIVED at the name's stage of
  // the log — the record as it stood then (every later act unapplied), read by the same reader as now — in the state's own words;
  // *since then* is the difference of the two derived sortings' own keys (R3: nothing at the christening). A name given under a
  // snapshot before D17 keeps its snapshot's numbers, marked `(counted then)` — the one mark that they were kept, not re-read.
  const stageN = nameStageOf(shape, siteId);
  const snapshot = stageN === null ? namedUnderOf(shape, siteId) : null;
  const then = ((): Sorting | null => {
    if (stageN === null) return null;
    const rec = recordAtStage({ shape, rules, facts, lexicon, tauDrafts: edgeTauDrafts }, log, stageN);
    const e = rec.shape.edges.find((c) => c.id === edge.id);
    const m = e ? mediumOf(rec.shape, e, { ...options, tauDrafts: rec.tauDrafts }, rec.rules, rec.facts) : null;
    return m ? m.sorting : null;
  })();
  const siteName = siteId ? labelOf(siteId) : null;
  const ownThen = then ? then.own : snapshot ? snapshot.own : null;
  const left = ownThen ? ownThen.filter((k) => !sorting.own.includes(k)).length : 0;
  const entered = ownThen ? sorting.own.filter((k) => !ownThen.includes(k)).length : 0;
  const givenWhen = ((): string | null => {
    if (then) {
      const n = then.instances.length;
      const rel = plural(n, 'relating was', 'relatings were');
      switch (then.state) {
        case 'UNDETECTED': return 'given when nothing was related here yet';
        case 'VACUOUS': return `given before any corner had seen it (${plural(n, 'relating', 'relatings')}, no passage)`;
        case 'UNRULED': { const k = then.views.reduce((t, v) => t + v.unruled.length, 0); return `given when ${rel} said and ${plural(k, 'passage was', 'passages were')} not yet said`; }
        case 'POCKET': return 'given when the views left different things alone';
        case 'EXHAUSTED': { const through = orList(then.views.filter((v) => v.centroid.length > 0).map(viewLabel)); return `given when nothing was theirs alone (${n === 1 ? 'its one relating' : n === 2 ? 'both relatings' : `all ${n} relatings`} also said through ${through})`; }
        default: return `given when ${rel} said`;
      }
    }
    if (snapshot) return `given when ${plural(snapshot.relatings, 'relating was', 'relatings were')} said (counted then)`;
    return null;
  })();
  const refusal = relatingRefusals[edge.id];
  const facePositions = (v: ViewSorting): [number, number] | null => {
    const f = shape.faces.find((x) => x.id === v.faceId);
    if (!f) return null;
    return [f.vertexIds.indexOf(X), f.vertexIds.indexOf(Y)];
  };
  // a `composed` say names the direct's mode (w3); a `not` say speaks of no direct and carries none; the legs' senses ride the
  // record only where one runs against the walk (D13 — a record of two `→` legs reads as before)
  const verdictRecord = (v: ViewSorting, p: ReadPath, verdict: 'composed' | 'not', w3?: string) => {
    const base = facePositions(v);
    if (!base) return null;
    const dirs = p.path.dirs[0] === ALONG && p.path.dirs[1] === ALONG ? {} : { dirs: p.path.dirs };
    return { base, x: p.path.x, w: p.path.w, z: p.path.z, w2: p.path.w2, y: p.path.y, ...dirs, ...(verdict === 'composed' && w3 ? { w3 } : {}), verdict };
  };
  const passageKey = (p: ReadPath): string => { const { x, w, z, w2, y, dirs } = p.path; return `${x}|${w}|${z}|${w2}|${y}${dirs[0] === ALONG && dirs[1] === ALONG ? '' : `|${dirs.join('')}`}`; };
  // S11 with her §4 — a light through a relating of the third corner says what it goes through (the opposite-midpoint kind, a
  // light still); the shared-coordinate pairs are the seed corner's VIEW now (D14 — the sorting's coordinate view above, in her
  // 10:57 §3 words); the coordinate kind on a corner edge is the child's structure, shown by the surface (MODES-3), never a
  // light — no line here
  const linkWords = (l: DerivedLight): string => ('role' in l.link ? `both hold ${nameZ(l.through, l.link.role)}` : `by ${nameZ(l.link.corners[0], l.link.relating[0])} ${modeWord(l.link.relating[1])} ${nameZ(l.link.corners[1], l.link.relating[2])}`);
  const derivedWords = (l: DerivedLight): { text: string; inherited: string | null } | null => {
    if (l.kind === 'coordinate') return null;
    return { text: l.held ? `in ${labelOf(l.through)}'s light too: ${nameA(l.x)} with ${nameB(l.y)} — ${linkWords(l)} — you related them` : `only in ${labelOf(l.through)}'s light: ${nameA(l.x)} with ${nameB(l.y)} — ${linkWords(l)} — no relating between ${la} and ${lb} says so`, inherited: null };
  };
  const holdWord = mode === IS ? '≡' : mode;
  // §1 — the chosen mode's declaration (never IS): its converse, and the opaque bit
  const converse = mode === IS ? null : converseOf(facts, mode);
  const stops = mode !== IS && isOpaque(facts, mode);
  // §4 — the rule gesture by shape: the key a passage OFFERS (its own shape's, or the chain a converse and a rule already read it as)
  const ruleOf = (k: RuleKey) => rules.find((r) => (r.length === 4 ? r[3] : 'chain') === k.shape && ((r[0] === k.w && r[1] === k.w2) || (k.shape !== 'chain' && r[0] === k.w2 && r[1] === k.w)));
  const keyOffered = (p: ReadPath): RuleKey | null => { if (!p.path.readable || p.path.keys.length === 0) return null; return p.path.keys.find((k) => ruleOf(k)) ?? p.path.keys[0]; };
  const keyId = (k: RuleKey): string => `${k.w}|${k.w2}${k.shape === 'chain' ? '' : `|${k.shape}`}`;
  const gestureWords = (k: RuleKey): string => (k.shape === 'chain' ? `name the two in a row: ${k.w}, then ${k.w2} =` : k.shape === 'fork' ? `name the two from one point: ${k.w} and ${k.w2} =` : `name the two into one point: ${k.w} and ${k.w2} =`);
  const namedWords = (k: RuleKey, w3: string): string => (k.shape === 'chain' ? `you named it: ${k.w}, then ${k.w2} = ${w3} — your word for the two in a row; holds on every such passage` : k.shape === 'fork' ? `you named it: ${k.w} and ${k.w2} from one point = ${w3} — your word for the two from one point; holds on every such passage` : `you named it: ${k.w} and ${k.w2} into one point = ${w3} — your word for the two into one point; holds on every such passage`);

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
      {/* §1 — THE MODE'S DECLARATION (the lexicon register: declared once, where the mode lives, mesh-wide) — for the chosen mode, never
          for IS (symmetric, its law fixed): the converse, an equation of his; the opaque bit, `passes through` by default */}
      {mode !== IS ? (
        <>
          <span data-medium-converse={mode} data-medium-converse-word={converse ?? undefined} className="flex flex-wrap items-center gap-x-2">
            {converse !== null ? (
              <>
                <span>{`${mode} the other way round: ${converse} — "y ${converse} x" is "x ${mode} y"`}</span>
                {' · '}
                <button type="button" data-medium-converse-withdraw={mode} className="underline" onClick={() => withdrawConverse(mode)}>withdraw</button>
              </>
            ) : (
              <>
                <span>{`${mode} the other way round:`}</span>
                {' '}
                <input data-medium-converse-input={mode} value={converseWord} onChange={(e) => setConverseWord(e.target.value)} placeholder="your word" className="h-5 w-24 rounded border border-stone-700 bg-stone-900 px-1 text-xs text-stone-100" />
                {converseWord.trim() ? <>{' '}<button type="button" data-medium-converse-name={mode} className="underline" onClick={() => { declareConverse(mode, converseWord); setConverseWord(''); }}>name it</button></> : null}
              </>
            )}
          </span>
          <span data-medium-opaque-line={mode} className="flex flex-wrap items-center gap-x-2">
            <button type="button" data-medium-opaque="through" data-medium-opaque-chosen={stops ? undefined : 'true'} className={stops ? 'text-stone-300' : 'underline text-stone-100'} onClick={() => setOpaque(mode, false)}>{`a pair passes through ${mode}`}</button>
            {' · '}
            <button type="button" data-medium-opaque="stops" data-medium-opaque-chosen={stops ? 'true' : undefined} className={stops ? 'underline text-stone-100' : 'text-stone-300'} onClick={() => setOpaque(mode, true)}>{`a pair stops at ${mode}`}</button>
          </span>
        </>
      ) : null}
      {/* §2 — THE ACT LINE (the act register: resets on leaving the midpoint): the direction as a CHOICE, both sentence shapes written
          out and the chosen one underlined — never the order of the picks; absent for IS; then the polarity (S7) */}
      <span data-medium-gesture="true" className="flex flex-wrap items-center gap-x-2 text-stone-400">
        {mode === IS ? (
          <span>{`a relating — pick a point in ${la} and one in ${lb}; it reads "${la}'s point ${holdWord} ${lb}'s point" —`}</span>
        ) : (
          <>
            <span>{`a relating — pick a point in ${la} and one in ${lb}; it reads`}</span>
            {' '}
            <button type="button" data-medium-dir="→" data-medium-dir-chosen={dir === ALONG ? 'true' : undefined} className={dir === ALONG ? 'underline text-stone-100' : 'text-stone-400'} onClick={() => setDir(ALONG)}>{`"${la}'s point ${mode} ${lb}'s point"`}</button>
            {' · '}
            <button type="button" data-medium-dir="←" data-medium-dir-chosen={dir === AGAINST ? 'true' : undefined} className={dir === AGAINST ? 'underline text-stone-100' : 'text-stone-400'} onClick={() => setDir(AGAINST)}>{`"${lb}'s point ${mode} ${la}'s point"`}</button>
            {' —'}
          </>
        )}
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
        // M6 with §4 (M3): the rule gesture and the rule line exist only for the passages a rule can READ — two mode legs (an IS leg
        // composes by the transport's law, §9.12) — keyed BY SHAPE: the key each passage offers, grouped
        const offered: Array<[string, RuleKey]> = [];
        for (const p of v.paths) { const k = keyOffered(p); if (k && !offered.some(([id]) => id === keyId(k))) offered.push([keyId(k), k]); }
        return (
          <div key={v.view} data-medium-view={lz} data-medium-view-vacuous={String(v.vacuous)} className="grid gap-0.5">
            <span data-medium-view-head="true" className="text-stone-100">{viewHead(v)}</span>
            {v.paths.map((p) => {
              // THE HANDS (M5, ADR 0031 §9.12): the verdict hands of D6 live on paths of TWO MODE LEGS only — on every path with an IS
              // leg the composite is the transport's law (two IS legs compose to IS; one IS leg and a mode leg compose by substitution,
              // or are held apart by an opaque mode), and a law is not his to except: no hand; the store refuses a say there by name.
              // §5 — the per-passage word `that is F2 [your word] Φ4 · say it` beside `that is not it`, never on a TENSION (S5 b — the
              // say would set the barred entry by the back door; the line names what presses); `that is not it` stays on a MODE
              // tension (an exception to his rule on this path — the second resolution §6)
              const sayable = p.path.readable && p.reading !== 'TENSION';
              const notSayable = p.path.readable;
              const pk = passageKey(p);
              const [sx, sy] = sayEnds(p);
              return (
                <span key={pk} data-medium-passage={pk} data-medium-passage-reading={p.reading} data-medium-passage-by={p.by ?? undefined} data-medium-passage-end={p.end ?? undefined} data-medium-passage-against={p.path.against ? 'true' : undefined} data-medium-passage-shape={p.path.source === 'triad' || p.path.source === 'coordinate' ? undefined : p.path.shape} data-medium-passage-from={p.path.source === 'coordinate' ? undefined : p.path.from ?? undefined} data-medium-passage-inherited={p.inherited ? (p.inherited.path ? p.inherited.path.reading : 'none') : undefined} className="flex flex-wrap items-center gap-x-2">
                  <span>{`${passageWords(p)}${p.path.source === 'coordinate' ? ': ' : ' — '}${readingWords(p, lz)}`}</span>
                  {p.by === 'verdict' || p.recorded ? (
                    <>
                      {/* a composed say stored on a passage no hand of his reaches (a mixed path, before §9.12) is read as `not yet said` but
                          PRINTED with its withdraw (12:19 (ii): a record he cannot see is a fact with no mark) */}
                      {p.reading === 'NOT' ? null : <span data-medium-said="true" data-medium-said-recorded={p.recorded ? 'true' : undefined}>{`you said: that is "${p.recorded ? `${nameA(p.path.x)} ${modeWord(p.recorded)} ${nameB(p.path.y)}` : compositeWords(p)}"`}</span>}
                      {p.exception && p.composite !== null ? <span data-medium-exception="true">{`except here — you said this passage is "${p.composite}"`}</span> : null}
                      <button type="button" data-medium-say-withdraw="true" className="underline" onClick={() => { const r = verdictRecord(v, p, 'not'); if (r) withdrawVerdict(v.faceId, r); }}>withdraw what you said</button>
                    </>
                  ) : (
                    <>
                      {sayable ? (
                        <>
                          <span>{`that is ${sx}`}</span>
                          <input data-medium-say-input={pk} value={sayWords[pk] ?? ''} onChange={(e) => setSayWords({ ...sayWords, [pk]: e.target.value })} placeholder="your word" className="h-5 w-24 rounded border border-stone-700 bg-stone-900 px-1 text-xs text-stone-100" />
                          <span>{sy}</span>
                          {(sayWords[pk] ?? '').trim() ? <>{' · '}<button type="button" data-medium-say="composed" className="underline" onClick={() => { const r = verdictRecord(v, p, 'composed', (sayWords[pk] ?? '').trim()); if (r) giveVerdict(v.faceId, r); setSayWords({ ...sayWords, [pk]: '' }); }}>say it</button></> : null}
                        </>
                      ) : null}
                      {notSayable ? <button type="button" data-medium-say="not" className="underline" onClick={() => { const r = verdictRecord(v, p, 'not'); if (r) giveVerdict(v.faceId, r); }}>that is not it</button> : null}
                    </>
                  )}
                </span>
              );
            })}
            {offered.map(([id, k]) => {
              const rule = ruleOf(k);
              const exceptions = v.paths.filter((p) => { const kk = keyOffered(p); return kk !== null && keyId(kk) === id && p.exception; }).length;
              return rule ? (
                <span key={id} data-medium-rule={`${id}|${rule[2]}`}>
                  {`${namedWords(k, rule[2])}${exceptions ? ` — yours, with ${plural(exceptions, 'exception', 'exceptions')}` : ''} · `}
                  <button type="button" data-medium-rule-withdraw={id} className="underline" onClick={() => withdrawRule(k.w, k.w2, k.shape)}>withdraw</button>
                </span>
              ) : (
                <span key={id} data-medium-rule-gesture={id} className="flex flex-wrap items-center gap-x-2">
                  <span>{gestureWords(k)}</span>
                  <input data-medium-rule-input={id} value={ruleWords[id] ?? ''} onChange={(e) => setRuleWords({ ...ruleWords, [id]: e.target.value })} placeholder="your word" className="h-5 w-24 rounded border border-stone-700 bg-stone-900 px-1 text-xs text-stone-100" />
                  <button type="button" data-medium-rule-name={id} className="underline" onClick={() => { nameRule(k.w, k.w2, ruleWords[id] ?? '', k.shape); setRuleWords({ ...ruleWords, [id]: '' }); }}>name it</button>
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
        <span data-medium-own={String(sorting.own.length)}>{sorting.own.length ? `${la} and ${lb}'s alone — no passage through ${cornersWords || 'any corner'} comes to it: ${join(sorting.own.map(withForm))}` : alsoSaid()}</span>
      ) : null}
      {/* the face's, said between them — his own relatings composed through a view; an inherited ≡ is never "said between them" and takes its own line below */}
      {sorting.views.map((v) => ({ v, own: v.centroid.filter((k) => !sorting.inherited.some((h) => h.key === k)) })).filter(({ own }) => own.length > 0).map(({ v, own }) => (
        <span key={`c-${v.view}`} data-medium-faces={viewLabel(v)}>{`the face's — said between them and through ${viewLabel(v)} too: ${join(own.map(withForm))}`}</span>
      ))}
      {/* D15 — an inherited ≡ is the face's, never said between them (her 10:57 §3): one line per pairing read here */}
      {sorting.inherited.map((h) => (
        <span key={`i-${h.key}`} data-medium-faces-inherited={labelOf(h.through)}>{`the face's — through ${labelOf(h.through)}, your pair ${nameZ(h.corners[0], h.q)} ≡ ${nameZ(h.corners[1], h.r)} on ${labelOf(h.edge[0])}–${labelOf(h.edge[1])}: ${nameA(h.x)} ≡ ${nameB(h.y)}`}</span>
      ))}
      <span data-medium-state-line="true" className="text-stone-400">{stateLine()}</span>
      {pocketLines().map(([k, text]) => <span key={`p-${k}`} data-medium-pocket-line={k} className="text-stone-400">{text}</span>)}
      {givenWhen && siteName ? <span data-medium-named-under="true" data-medium-named-stage={stageN ?? undefined} data-medium-named-snapshot={snapshot ? 'true' : undefined}>{`named when it was: ${siteName} — ${givenWhen}${left || entered ? `; since then, ${left} left what is theirs alone · ${entered} entered` : ''}`}</span> : null}
      {lights.map((l) => { const w = derivedWords(l); return w ? <span key={`${l.kind}|${l.x}|${l.y}|${l.through}|${l.via}`} data-medium-light-derived={l.kind} data-medium-light-held={l.held ? 'true' : undefined} data-medium-light-inherited={w.inherited ?? undefined}>{w.text}</span> : null; })}
    </div>
  );
}

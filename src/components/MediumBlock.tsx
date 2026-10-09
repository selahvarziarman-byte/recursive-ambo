// MediumBlock — STAMP MODES-1 · B5 (2026-09-26): THE MEDIUM IN THE DESIGNER'S WORDS (her letter of 17:15, ratified for meaning
// §207; the projection ruling D2–D11; ADR 0031 §9), rewritten under THE CUT — STAMP LAYOUT-1 + MARKER LAYOUT-1 · M1–M5 (2026-09-30;
// Arman's Δ131 "layout and copy before release"): COPY-1, plain words for every line (`.handoff/DESIGN_COPY-1_plain-words-on-the-Ambo_spec.md`,
// blob 98e66735, §11 wins where it differs from §4), and LAYOUT-1's places for them (`.handoff/DESIGN_LAYOUT-1_the-Ambo-page_spec.md`, efef46bb).
//
// WHAT THE BLOCK IS: under the midpoint's own column, the medium between the two corners — the choices for the next act (the modes
// line, the direction and holds line, the chosen mode's converse and stand-in bit), the passages through each opposite corner with his
// decisions and his rules, where each relating sits (not through C or D · also through C · a corner's light · the tension it runs into),
// the one-line state with its count, the name kept with the state it was given under, and the device's own lights at a deeper generation.
// COPY-1's RULES held here: a line is a sentence, a label with its value, or a short list of facts joined by `·`; a reading states a fact
// about his record and never tells him what to do; nothing on the page is called his (no `your`, `yours`, `theirs`); he relates, pairs,
// bars, names and DECIDES — nothing is "said"; `≡` means "these two are one" everywhere and `↦` is off the page; a refusal opens
// `not taken —` and ends with the buttons that act on it; lowercase but proper names and what he typed; counts carry their nouns.
// HER WORDS KEPT: role · pair · relating · mode · barred · passage · comes to · light · not through C or D (OWN) · also through C (the
// centroid's) · decided (D6's verdict) · rule · not by way of C (D16) · stand in for each other (§9.13's bit) · the concept.
// THE PIECES (LAYOUT-1 §4): the CHOICES and the REFUSALS are the pairing pane's (its top); the point tab reads the HEAD, the STATE line and
// the NAME's record; the modes tab reads the rest — exported apart (`MediumChoices`, `MediumRefusals`, `MediumPoint`, `MediumModes`) and
// stacked by `MediumBlock` where the surface mounts it today. Every data attribute stays on the element that moves (the eye leg's arms
// follow it). Nothing here glues, sorts or decides: the readers are B1–B4's and the sorting's; the words are hers.
// THE RECORD BEHIND THE WORDS (unchanged): M3's eleven cures, MODES-4 rows 1–9 (direction in the record; the coordinate view; the inherited
// ≡; the transport; the per-passage word; the log and the stage), M4 (IS's name and glyph reserved), M5 (the carrying corners; COHERENT's
// count clause), MARKER LAYOUT-1 · M3 (a fork's or join's order chosen; a rule listed once; `name it` only with a word) and M4 (a
// same-word fork or join composes to one undirected relating, §9.21–§9.22).

import { Fragment, useState, type ReactNode } from 'react';
import type { Edge, Shape, VertexId } from '../types/geometry';
import { useGeometryStore, type SayRefusal } from '../store/geometryStore';
import { childSpaceOf, termWordsOf } from '../lib/instanceSpace';
import { altitudeOf, bondSayingsOf, cellKey, sayingsOf, type EndSlot } from '../lib/altitude';
import { configurationTotals } from '../lib/configuration';
import { mediumOf, type DerivedLight } from '../lib/descent';
import { WordField } from './WordField';
import { nameStageOf, recordAtStage } from '../lib/stage';
import { AGAINST, ALONG, converseOf, dirOf, isOpaque, lexiconOf, IS, IS_GLYPH, type Dir, type Relating } from '../lib/relatings';
import { relKey, ruleSubject, ruleUndirected, undecidedIn, type ReadBond, type ReadPath, type Rule, type RuleKey, type Sorting, type ViewSorting } from '../lib/sorting';
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
/** `the one relating` · `both relatings` · `all 4 relatings` (COPY-1 §4.5) */
const everyRelating = (n: number): string => (n === 1 ? 'the one relating' : n === 2 ? 'both relatings' : `all ${n} relatings`);
const inputClass = 'h-5 w-24 rounded border border-stone-700 bg-stone-900 px-1 text-xs text-stone-100';

/** the medium read once for the block's pieces */
export interface MediumProps { shape: Shape; edge: Edge; siteId: VertexId | null; la: string; lb: string; options: SpaceOfOptions; mode: string; setMode: (w: string) => void; bar: boolean; setBar: (b: boolean) => void; dir: Dir; setDir: (d: Dir) => void }

/** the readings of one medium — every sentence the block prints, built once from the store's live state (RECORD, NOT READING) */
function useMedium({ shape, edge, siteId, la, lb, options }: MediumProps) {
  // the block SUBSCRIBES to these (a change re-renders it) and reads their LIVE value from the store: react-dom/server hands a hook the
  // store's INITIAL snapshot, so a witness rendering under node would read `rules: []` while the store held a rule (measured)
  useGeometryStore((s) => s.lexicon);
  useGeometryStore((s) => s.rules);
  useGeometryStore((s) => s.bondRules); // THE-ALTITUDE · slice 2
  useGeometryStore((s) => s.relatingRefusals);
  useGeometryStore((s) => s.sayRefusals);
  useGeometryStore((s) => s.converses);
  useGeometryStore((s) => s.opaque);
  useGeometryStore((s) => s.log);
  useGeometryStore((s) => s.edgeTauDrafts);
  const { lexicon, rules, bondRules, relatingRefusals, sayRefusals, converses, opaque, log, edgeTauDrafts } = useGeometryStore.getState();
  const facts = { converses, opaque };
  const medium = mediumOf(shape, edge, options, rules, facts, bondRules);
  const [X, Y] = edge.vertexIds;
  const labelOf = (v: VertexId): string => shape.vertices[v]?.data.label || v;
  // every name in the block reads through ONE reader: a role by its name, a role that is itself a relating in parentheses (her §1)
  const nameZ = (z: VertexId, id: string): string => termWordsOf(shape, z, id, options);
  const nameA = (id: string): string => nameZ(X, id);
  const nameB = (id: string): string => nameZ(Y, id);
  const words = lexiconOf(shape, lexicon);
  return { medium, shape, edge, options, X, Y, labelOf, nameZ, nameA, nameB, words, rules, bondRules, facts, relatingRefusals, sayRefusals, log, edgeTauDrafts, lexicon, la, lb };
}
type Medium = ReturnType<typeof useMedium>;

/** the sentences over one sorting: a relating as he made it, a passage's legs and shape, its reading, the state, the name's record */
function wordsOf(m: Medium, sorting: Sorting) {
  const { nameA, nameB, nameZ, labelOf, la, lb, X, Y } = m;
  // a relating AS HE MADE IT (D13): from the first corner `x w y`, from the second `y w x`; IS symmetric
  const sentence = (r: Relating): string => (dirOf(r) === ALONG ? `${nameA(r[1])} ${modeWord(r[0])} ${nameB(r[2])}` : `${nameB(r[2])} ${modeWord(r[0])} ${nameA(r[1])}`);
  const instanceOf = (k: string): Relating => sorting.instances.find((r) => relKey(r) === k) as Relating;
  const viewLabel = (v: ViewSorting): string => labelOf(v.view);
  const cornersWords = orList(sorting.views.map(viewLabel));
  // M5 (COPY-1 §11.1): a line that says relatings come THROUGH corners names only the CARRYING corners; one that says through NO corner names every corner
  const carrying = sorting.views.filter((v) => v.centroid.length > 0).map(viewLabel);
  const carryingWords = orList(carrying);
  // D16 — the refused route is the instance's FORM wherever it is listed: `F2 carries Φ3, not by way of C (you decided)`
  const withForm = (k: string): string => { const vs = sorting.refused.get(k); return `${sentence(instanceOf(k))}${vs && vs.length ? `, not by way of ${orList(vs.map(labelOf))} (you decided)` : ''}`; };
  // each leg as he made it: the sorting hands the leg as (subject, mode, object) with its sense along the walk; its two terms named at their own corners
  const legWords = (p: ReadPath, leg: 0 | 1): string => {
    const [s, w, o] = p.path.said[leg];
    const z = p.path.view;
    const along = p.path.dirs[leg] === ALONG;
    const ends: [VertexId, VertexId] = leg === 0 ? (along ? [X, z] : [z, X]) : (along ? [z, Y] : [Y, z]);
    return `${nameZ(ends[0], s)} ${modeWord(w)} ${nameZ(ends[1], o)}`;
  };
  // the passage's SHAPE said in words before its legs when they do not run from A to B (her §3)
  const shapeWords = (p: ReadPath): string => {
    if (p.path.source === 'triad' || p.path.mixed) return '';
    if (p.path.shape === 'chain') return p.path.from === 'y' ? `from ${lb} to ${la}: ` : '';
    return p.path.shape === 'fork' ? `both from ${nameZ(p.path.view, p.path.z)}: ` : `both into ${nameZ(p.path.view, p.path.z)}: `;
  };
  // a chain from B to A prints its legs in the CHAIN's own order; a coordinate passage names the two roles here and the role they share (§4.6)
  const passageWords = (p: ReadPath): string => {
    if (p.path.source === 'coordinate' && p.inherited) return `${nameA(p.path.x)} · ${nameB(p.path.y)}, both holding ${nameZ(p.path.view, p.path.z)}`;
    return p.path.from === 'y' && p.path.source !== 'triad' ? `${shapeWords(p)}${legWords(p, 1)} · ${legWords(p, 0)}` : `${shapeWords(p)}${legWords(p, 0)} · ${legWords(p, 1)}`;
  };
  // the composite in ITS OWN direction (D13, §9.14); an undirected composite (§9.21) prints its two ends in one order that does not depend on
  // the edge — by name — with `both ways` saying neither comes first
  const directedWords = (w: string | null, d: Dir | null, x: string, y: string): string => (d === AGAINST ? `${nameB(y)} ${w === null ? '?' : modeWord(w)} ${nameA(x)}` : `${nameA(x)} ${w === null ? '?' : modeWord(w)} ${nameB(y)}`);
  const bothWaysEnds = (p: ReadPath): [string, string] => { const a = nameA(p.path.x); const b = nameB(p.path.y); return a.localeCompare(b) <= 0 ? [a, b] : [b, a]; };
  const compositeWords = (p: ReadPath): string => {
    if (p.undirected) { const [e1, e2] = bothWaysEnds(p); return `${e1} ${p.composite === null ? '?' : modeWord(p.composite)} ${e2}, both ways`; }
    return directedWords(p.composite, p.compositeDir, p.path.x, p.path.y);
  };
  /** a key's sentence: `w|x|y` or `w|x|y|←` in the passage's own names */
  const keyWords = (k: string): string => { const [w, x, y, d] = k.split('|'); return directedWords(w, d === '←' ? AGAINST : ALONG, x, y); };
  // the reading on the line under a passage (COPY-1 §4.6; §11.4 for an undirected composite)
  const readingWords = (p: ReadPath): string => {
    const lz = labelOf(p.path.view);
    if (p.path.source === 'coordinate') return inheritedWords(p);
    if (p.undirected && p.composite !== null) {
      const [e1, e2] = bothWaysEnds(p); const w = modeWord(p.composite);
      if (p.reading === 'COMPOSED') return `comes to ${e1} ${w} ${e2}, both ways, also related directly`;
      if (p.reading === 'TENSION' && p.pressing && p.direct) return `comes to ${e1} ${w} ${e2}, both ways: ${keyWords(p.direct)} is related directly, but ${keyWords(p.pressing)} is barred`;
      if (p.reading === 'TENSION' && p.direct) return `comes to ${e1} ${w} ${e2}, both ways, but ${keyWords(p.direct)} is barred`;
      if (p.reading === 'LIGHT') return `comes to ${e1} ${w} ${e2}, both ways, not related directly: ${lz}'s light`;
    }
    if (p.reading === 'COMPOSED') return `comes to ${compositeWords(p)}, also related directly`;
    if (p.reading === 'LIGHT') return `comes to ${compositeWords(p)}, not related directly: ${lz}'s light`;
    if (p.reading === 'TENSION') {
      const key = (p.direct ?? '').split('|');
      if (p.end === 'target' && key.length === 3) return `comes to ${compositeWords(p)}, but ${nameB(p.path.y)} is paired with ${nameA(key[1])}`;
      if (p.end === 'source' && key.length === 3) return `comes to ${compositeWords(p)}, but ${nameA(p.path.x)} is paired with ${nameB(key[2])}`;
      return `comes to ${compositeWords(p)}, which is barred`;
    }
    if (p.reading === 'NOT') return 'decided: comes to nothing';
    if (p.reading === 'HELD') { const w = p.path.w === IS ? p.path.w2 : p.path.w; const pair = p.path.w === IS ? p.path.said[0] : p.path.said[1]; return `comes to nothing: in ${w}, ${nameZ(p.path.w === IS ? X : p.path.view, pair[0])} doesn't stand in for ${nameZ(p.path.w === IS ? p.path.view : Y, pair[2])}`; }
    return 'not decided yet';
  };
  // D14/D15 — the inherited passage's reading, on the edge it lives on (COPY-1 §4.6's coordinate lines)
  const inheritedWords = (p: ReadPath): string => {
    const inh = p.inherited; const g = inh?.path;
    if (!inh || !g) return 'not decided yet';
    const [E0, E1] = inh.edge;
    const [Qc, Rc] = inh.corners;
    const on = `on ${labelOf(E0)}–${labelOf(E1)}`;
    const key = (g.direct ?? '').split('|');
    const lz = labelOf(p.path.view);
    // M8 (2): an undirected composite carried across prints its two ends by name with `both ways` (§11.4) — it has no direction to read
    const there = (): string => {
      if (p.composite === IS) return `${nameZ(Qc, inh.q)} ≡ ${nameZ(Rc, inh.r)}`;
      const w = modeWord(p.composite ?? '?');
      if (g.undirected) { const a = nameZ(E0, g.path.x); const b = nameZ(E1, g.path.y); const [e1, e2] = a.localeCompare(b) <= 0 ? [a, b] : [b, a]; return `${e1} ${w} ${e2}, both ways`; }
      return g.compositeDir === AGAINST ? `${nameZ(E1, g.path.y)} ${w} ${nameZ(E0, g.path.x)}` : `${nameZ(E0, g.path.x)} ${w} ${nameZ(E1, g.path.y)}`;
    };
    if (p.reading === 'TENSION') {
      if (g.reading === 'TENSION' && g.end === 'target' && key.length === 3) return `${on} it comes to ${there()}, but ${nameZ(E1, g.path.y)} is paired with ${nameZ(E0, key[1])}`;
      if (g.reading === 'TENSION' && g.end === 'source' && key.length === 3) return `${on} it comes to ${there()}, but ${nameZ(E0, g.path.x)} is paired with ${nameZ(E1, key[2])}`;
      if (g.reading === 'TENSION') return `${on} it runs into a bar`;
      return `${on} it comes to ${there()}, which is barred`;
    }
    if (p.reading === 'COMPOSED') return p.composite === IS ? `${nameZ(Qc, inh.q)} and ${nameZ(Rc, inh.r)} are paired ${on}, so these two are one here` : `${on} it comes to ${there()}, also related directly`;
    if (p.reading === 'LIGHT') return p.composite === IS ? `${nameZ(Qc, inh.q)} and ${nameZ(Rc, inh.r)} aren't paired ${on}: ${lz}'s light` : `${on} it comes to ${there()}, not related directly: ${lz}'s light`;
    if (p.reading === 'NOT') return 'decided: comes to nothing';
    if (p.reading === 'HELD') { const w = g.path.w === IS ? g.path.w2 : g.path.w; const [s, , o] = g.path.w === IS ? g.path.said[0] : g.path.said[1]; return `${on} it comes to nothing: in ${w}, ${nameZ(g.path.w === IS ? E0 : p.path.view, s)} doesn't stand in for ${nameZ(g.path.w === IS ? p.path.view : E1, o)}`; }
    return `${on} it isn't decided yet`;
  };
  // the decision's two ends in the passage's own direction (a chain); a fork or a join offers both orders (§11.4)
  const decideEnds = (p: ReadPath): [string, string] => (p.path.from === 'y' ? [nameB(p.path.y), nameA(p.path.x)] : [nameA(p.path.x), nameB(p.path.y)]);
  // a view's head (§4.6; §11.6 the empty coordinate view)
  const viewHead = (v: ViewSorting): string => {
    const lz = viewLabel(v);
    if (v.coordinate) return v.paths.length > 0 ? `through ${lz}, the corner both sides share: ${plural(v.paths.length, 'passage', 'passages')}, read from ${labelOf(v.coordinate.edge[0])}–${labelOf(v.coordinate.edge[1])}` : `through ${lz}: no passage yet (no role of ${lz} is on both sides)`;
    // THE-ALTITUDE (D24): this head is the EDGES' legs' — the altitude's passages have their own head beside it, never merged
    const legPaths = v.paths.filter((p) => p.path.source !== 'altitude');
    if (legPaths.length > 0) return `through ${lz}: ${plural(legPaths.length, 'passage', 'passages')}`;
    const empty = [!v.legs[0] ? `${la}–${lz}` : null, !v.legs[1] ? `${lz}–${lb}` : null].filter((s): s is string => s !== null);
    if (empty.length === 2) return `through ${lz}: no passage yet (nothing related on ${empty[0]} or ${empty[1]})`;
    if (empty.length === 1) return `through ${lz}: no passage yet (nothing related on ${empty[0]})`;
    return `through ${lz}: no passage (what you related on ${la}–${lz} and on ${lz}–${lb} doesn't meet)`;
  };
  const related = sorting.instances.length;
  // COPY-1 §11.8 — a zero `also through` part names no corner, so it does not print; the `not through` part prints at zero (§11.5)
  const alsoThroughPart = sorting.centroid.length === 0 ? '' : ` · ${sorting.centroid.length} also through ${carryingWords || orList(sorting.views.map(viewLabel))}`;
  const countsLine = (): string => `${plural(sorting.own.length, 'relating', 'relatings')} not through ${cornersWords || 'any corner'}${alsoThroughPart}`;
  // the state's line (COPY-1 §4.5, §11.1, §11.2): one line with its count, a description, never a grade
  const throughNone = (): string => {
    const n = sorting.own.length; const names = sorting.views.map(viewLabel);
    const verb = (yes: string, no: string): string => (n === 1 ? yes : no);
    if (names.length === 1) return `${plural(n, 'relating', 'relatings')} ${verb("doesn't", "don't")} come through ${names[0]}`;
    if (names.length === 2) return `${plural(n, 'relating', 'relatings')} ${verb('comes', 'come')} through neither ${names[0]} nor ${names[1]}`;
    return `${plural(n, 'relating', 'relatings')} ${verb('comes', 'come')} through none of ${andList(names)}`;
  };
  const stateLine = (): string => {
    switch (sorting.state) {
      case 'UNDETECTED': return `nothing related between ${la} and ${lb} yet`;
      case 'VACUOUS': return `${plural(related, 'relating', 'relatings')} · no passage through ${cornersWords} yet`;
      case 'UNRULED': return countsLine();
      case 'POCKET': return `${andList(sorting.views.map(viewLabel))} miss different relatings, and none is missed by both`;
      case 'EXHAUSTED': return `${everyRelating(related) === 'the one relating' ? 'the one relating also comes' : related === 2 ? 'both relatings also come' : 'every relating also comes'} through ${carryingWords}`;
      case 'CLOSED': return `${related === 1 ? 'the one relating also comes' : related === 2 ? 'both relatings also come' : 'every relating also comes'} through ${carryingWords}, and no passage comes to anything not related directly`;
      case 'COHERENT': {
        const holding = sorting.views.filter((v) => v.paths.length > 0);
        const count = holding.reduce((n, v) => n + v.paths.length, 0);
        return `nothing against it: ${count === 1 ? 'the one passage' : `all ${count} passages`} through ${andList(holding.map(viewLabel))} ${count === 1 ? 'is' : 'are'} decided, none runs into a bar or a pair, the decisions agree, and ${throughNone()}`;
      }
      default: return countsLine();
    }
  };
  // in a POCKET, one line per relating some view leaves alone (§4.6): `F2 carries Φ3: through D, not through C`
  const pocketLines = (): Array<[string, string]> => (sorting.state !== 'POCKET' ? [] : sorting.instances
    .map((r): [string, Relating] => [relKey(r), r])
    .filter(([k]) => sorting.views.some((v) => v.own.includes(k)))
    .map(([k]) => {
      const alone = sorting.views.filter((v) => v.own.includes(k)).map(viewLabel);
      const faces = sorting.views.filter((v) => v.centroid.includes(k)).map(viewLabel);
      return [k, `${withForm(k)}: ${faces.length ? `through ${andList(faces)}, ` : ''}not through ${andList(alone)}`];
    }));
  return { sentence, instanceOf, viewLabel, cornersWords, carrying, carryingWords, withForm, legWords, passageWords, compositeWords, readingWords, decideEnds, viewHead, related, countsLine, stateLine, pocketLines };
}

/** the name's record (COPY-1 §11.3): the state the name was given under, re-derived at the name's stage of the log (D17); a snapshot before D17 marked */
export interface SinceThen { started: number; withdrawn: number; stopped: number; added: number; entered: number | null } // M8 (3): four parts as data; `entered` the undivided count where the record cannot tell stopped from added (a B5 snapshot), else null
function namedLine(m: Medium, sorting: Sorting, siteId: VertexId | null, viewLabel: (v: ViewSorting) => string): { text: string; stage: number | null; snapshot: boolean; since: SinceThen } | null {
  const { shape, edge, options } = m;
  const stageN = nameStageOf(shape, siteId);
  const snapshot = stageN === null ? namedUnderOf(shape, siteId) : null;
  const recThen = stageN === null ? null : recordAtStage({ shape, rules: m.rules, facts: m.facts, lexicon: m.lexicon, tauDrafts: m.edgeTauDrafts }, m.log, stageN);
  const then = ((): Sorting | null => {
    if (!recThen) return null;
    const e = recThen.shape.edges.find((c) => c.id === edge.id);
    const med = e ? mediumOf(recThen.shape, e, { ...options, tauDrafts: recThen.tauDrafts }, recThen.rules, recThen.facts) : null;
    return med ? med.sorting : null;
  })();
  // THE-ALTITUDE · slice 3 (D27 · R4; the designer's §7, her 08:45 line): against each light THAT SPEAKS NOW, as it stood at the name's stage — the cells he
  // denied, then the bonds cut by his denial, in his words, never inflected; one that had not spoken then (the resolution was coarser than now): `before
  // T's roles were related here`; a light silent now says nothing here — a mark on the ordinary is none
  const speaksNow = (view: VertexId): boolean => (sorting.views.find((w) => w.view === view)?.altitude.sayings ?? 0) > 0;
  const against: string[] = recThen && then ? then.views.filter((v) => !v.coordinate && speaksNow(v.view)).map((v) => {
    const lz = viewLabel(v);
    const alt = altitudeOf(recThen.shape, v.faceId, v.view, options);
    const said = alt ? sayingsOf(alt.entries) : [];
    if (!alt || said.length === 0) return `before ${lz}'s roles were related here`;
    const endName = (e: EndSlot, x: string): string => { const c = alt.face.vertexIds[e]; return c ? m.nameZ(c, x) : x; };
    // ADR §9.33 (ratified, the mothership's 14:42): the name stands against what is at the END-ROLES OF THE CHILD'S INSTANCES at the name's stage — the edge's
    // positive relatings (D4); a denial at a role no instance touches is the altitude's, kept with the name entire (D27), never on this line
    const eXn = alt.face.vertexIds.indexOf(m.X); const eYn = alt.face.vertexIds.indexOf(m.Y);
    const instanceEnds = new Set(then.instances.flatMap((r) => [`${eXn}|${r[1]}`, `${eYn}|${r[2]}`]));
    const atInstanceEnd = (e: number, x: string): boolean => instanceEnds.has(`${e}|${x}`);
    const denied = said.filter((s) => s[5] === '-' && atInstanceEnd(s[3], s[4])).map((s) => `${m.nameZ(v.view, s[1])} ${s[2]} ${endName(s[3], s[4])}`);
    const cells = [...new Map(said.filter((s) => atInstanceEnd(s[3], s[4])).map((s) => [`${s[3]}|${s[4]}`, { e: s[3], x: s[4] }] as const)).values()];
    // `cut by them:` — the bonds cut because a role is DENIED at the end (his denied relatings are "them"); his denial of a RELATION is not one of them
    const cuts = configurationTotals(childSpaceOf(recThen.shape, v.view, options), alt.entries, cells).ends.flatMap((end) => end.cut.filter((c) => c.missing.some((mm) => mm.byDenial)).map((c) => `at ${endName(end.e, end.x)}, ${m.nameZ(v.view, c.relation.terms[0])} ${c.relation.w} ${m.nameZ(v.view, c.relation.terms[1] ?? c.relation.terms[0])}`));
    // RIDER R1×R2 (c), R1 with R4 (the mothership's 14:39; the designer's 14:43): his override at an instance's end is part of what the name stands against —
    // its own part, `cut by a denial:` (the routes head's phrase, for the same act), every denying bond saying at the name's stage, in the log's order
    const deniedBonds = bondSayingsOf(alt.entries).filter((b) => b[6] === '-' && atInstanceEnd(b[1], b[2])).map((b) => `at ${endName(b[1], b[2])}, ${m.nameZ(v.view, b[4])} ${b[3]} ${m.nameZ(v.view, b[5])}`);
    // the designer's 14:45 (2): with nothing denied or cut at the instances' ends the line has NO part for this light — `where nothing was denied` would read
    // as if he had denied nothing, while his denials off the line stand with the altitude
    if (denied.length === 0 && cuts.length === 0 && deniedBonds.length === 0) return null;
    const cutWords = cuts.length ? ' · cut by them: ' + cuts.join(' · ') : '';
    const relatingWords = denied.length ? "where these don't hold: " + denied.join(' · ') + cutWords : '';
    const denialWords = deniedBonds.length ? 'cut by a denial: ' + deniedBonds.join(' · ') : '';
    return `against ${lz}, ${[relatingWords, denialWords].filter((s) => s.length > 0).join(' · ')}`;
  }).filter((s): s is string => s !== null) : [];
  const siteName = siteId ? m.labelOf(siteId) : null;
  if (!siteName) return null;
  // since then (D17, R3; M8 (3)): FOUR PARTS AS DATA over what is outside every corner (the own set) — of what was own then and is not now:
  // STARTED coming through a corner (still related) or WITHDRAWN (related no more); of what is own now and was not then: STOPPED coming
  // through a corner (related then) or ADDED (not there then). A B5 snapshot keeps only what was own then, so there stopped and added are
  // one undivided count (`entered`) — never a guess. Each part prints only when it counts (rule 4); the words are interim until the
  // designer's (asked 13:16), the counts true
  const ownThen = then ? then.own : snapshot ? snapshot.own : null;
  const instancesThen = then ? then.instances.map(relKey) : null;
  const instancesNow = sorting.instances.map(relKey);
  const leftKeys = ownThen ? ownThen.filter((k) => !sorting.own.includes(k)) : [];
  const started = leftKeys.filter((k) => instancesNow.includes(k)).length;
  const withdrawn = leftKeys.length - started;
  const enteredKeys = ownThen ? sorting.own.filter((k) => !ownThen.includes(k)) : [];
  const stopped = instancesThen ? enteredKeys.filter((k) => instancesThen.includes(k)).length : 0;
  const added = instancesThen ? enteredKeys.length - stopped : 0;
  const entered = instancesThen ? null : enteredKeys.length;
  const since0: SinceThen = { started, withdrawn, stopped, added, entered };
  const when = ((): string | null => {
    if (then) {
      const n = then.instances.length;
      switch (then.state) {
        case 'UNDETECTED': return 'when nothing was related here yet';
        case 'VACUOUS': return `when there ${n === 1 ? 'was' : 'were'} ${plural(n, 'relating', 'relatings')} and no passage yet`;
        case 'UNRULED': { const k = then.views.reduce((t, v) => t + undecidedIn(v), 0); return `when there were ${plural(n, 'relating', 'relatings')} and ${plural(k, 'passage', 'passages')} not decided yet`; }
        case 'POCKET': return `when ${andList(then.views.map(viewLabel))} missed different relatings`;
        case 'EXHAUSTED': { const through = orList(then.views.filter((v) => v.centroid.length > 0).map(viewLabel)); return `when ${n === 1 ? 'the one relating also came' : n === 2 ? 'both relatings also came' : 'every relating also came'} through ${through}`; }
        default: return `when there ${n === 1 ? 'was' : 'were'} ${plural(n, 'relating', 'relatings')}`;
      }
    }
    if (snapshot) return `when there ${snapshot.relatings === 1 ? 'was' : 'were'} ${plural(snapshot.relatings, 'relating', 'relatings')} (counted then)`;
    return null;
  })();
  if (when === null) return null;
  // COPY-1 §11.7 (M9): each part in her words; the first part printed carries the noun and the rest drop it; commas, `and` before the last
  const one = (n: number): boolean => n === 1;
  const parts: Array<[number, (first: boolean) => string]> = [
    [started, (f) => `${started} ${f ? (one(started) ? 'relating ' : 'relatings ') : ''}now ${one(started) ? 'comes' : 'come'} through a corner`],
    [withdrawn, (f) => `${withdrawn} ${f ? (one(withdrawn) ? 'relating ' : 'relatings ') : ''}that came through no corner ${one(withdrawn) ? 'has' : 'have'} been withdrawn`],
    [stopped, (f) => `${stopped} ${f ? (one(stopped) ? 'relating ' : 'relatings ') : ''}no longer ${one(stopped) ? 'comes' : 'come'} through any corner`],
    [added, (f) => `${added} new ${f ? (one(added) ? 'relating' : 'relatings') : one(added) ? 'one' : 'ones'} ${one(added) ? 'comes' : 'come'} through no corner`],
    [entered ?? 0, (f) => `${entered} other${f ? (one(entered ?? 0) ? ' relating' : ' relatings') : one(entered ?? 0) ? '' : 's'} now ${one(entered ?? 0) ? 'comes' : 'come'} through no corner`],
  ];
  const bits = parts.filter(([n]) => n > 0).map(([, words], i) => words(i === 0));
  const since = bits.length === 0 ? '' : bits.length === 1 ? `; since then ${bits[0]}` : `; since then ${bits.slice(0, -1).join(', ')}, and ${bits[bits.length - 1]}`;
  const againstWords = against.map((a) => `, ${a}`).join('');
  return { text: `named ${siteName} ${when}${againstWords}${since}`, stage: stageN, snapshot: snapshot !== null, since: since0 };
}

/** THE CHOICES for the next act (LAYOUT-1 §4; COPY-1 §4.2): the modes line ending in `+ a mode`; the direction and holds line; the chosen mode's converse and stand-in bit */
/** THE-ALTITUDE · slice 2 (R2): the head's tail counting the passages by the light's relations — a helper, so the head's one template nests none (the words witness reads printed strings) */
const byRelationsWords = (n: number, lz: string): string => (n > 0 ? ' · ' + String(n) + ' by ' + lz + "'s relations" : '');
/** the designer's 13:40 (2): the routes across a relation the light refuses, counted apart — as §4's `1 that T refuses` */
const refusedRoutesWords = (n: number, lz: string): string => (n > 0 ? ' · ' + String(n) + ' that ' + lz + ' refuses' : '');
/** RIDER R1×R2 (§9.32; the designer's 14:30 (a)): the routes cut by his denial, after T's own refusals — `refuses` is T's word, `cut` is his */
const deniedRoutesWords = (n: number): string => (n > 0 ? ' · ' + String(n) + ' cut by a denial' : '');

export function MediumChoices(props: MediumProps) {
  const m = useMedium(props);
  const { mode, setMode, bar, setBar, dir, setDir, la, lb } = props;
  const declareMode = useGeometryStore((s) => s.declareMode);
  const declareConverse = useGeometryStore((s) => s.declareConverse);
  const withdrawConverse = useGeometryStore((s) => s.withdrawConverse);
  const setOpaque = useGeometryStore((s) => s.setOpaque);
  const [newMode, setNewMode] = useState<string | null>(null);
  const [converseWord, setConverseWord] = useState('');
  if (!m.medium || !m.medium.child || !m.medium.sorting) return null;
  const converse = mode === IS ? null : converseOf(m.facts, mode);
  const stops = mode !== IS && isOpaque(m.facts, mode);
  // the designer's 16:33 (3): a word picked or added in `+ a mode` that is ALREADY on the line is CHOSEN, exactly as clicking it on the line does
  // (the field used to close with nothing changed — the mode stayed IS and no line said why); a new word is declared, as before
  const addMode = (): void => {
    const w = (newMode ?? '').trim();
    if (w === IS || m.words.includes(w)) setMode(w); else declareMode(newMode ?? '');
    setNewMode(null);
  };
  return (
    <div data-medium-choices="true" className="grid gap-0.5">
      {/* the SPACES between a line's items are real text nodes (a whitespace-only node is not laid out in a flex row, but it is the line's text — what a person copies) */}
      <span data-medium-modes="true" className="flex flex-wrap items-center gap-x-2">
        <span>modes:</span>
        {/* the designer's 12:17 (7), on the mothership's 12:15 ruling (his lowercase `is` is his own word, not IS): IS FIRST with its glyph, in the pair's amber, then a
            drawn rule, then his words in ink — the two can't be read as one; the chosen one underlined on either side */}
        {' '}
        <span data-medium-modes-is="true" className="flex items-center gap-x-1 text-amber-200">
          <button type="button" data-medium-mode={IS} data-medium-mode-chosen={mode === IS ? 'true' : undefined} className={mode === IS ? 'underline text-amber-100' : 'text-amber-200'} onClick={() => setMode(IS)}>{IS}</button>
          {' '}
          <span data-medium-is-glyph="true" aria-hidden="true">{IS_GLYPH}</span>
        </span>
        <span data-medium-modes-rule="true" aria-hidden="true" className="inline-block h-3 w-px bg-stone-600" />
        {m.words.filter((w) => w !== IS).map((w, i) => (
          <Fragment key={w}>
            {i > 0 ? ' · ' : ' '}
            <button type="button" data-medium-mode={w} data-medium-mode-chosen={w === mode ? 'true' : undefined} className={w === mode ? 'underline text-stone-100' : 'text-stone-300'} onClick={() => setMode(w)}>{w}</button>
          </Fragment>
        ))}
        {m.words.some((w) => w !== IS) ? ' · ' : ' '}
        {newMode === null ? (
          <button type="button" data-medium-mode-add="true" className="underline text-stone-300" onClick={() => setNewMode('')}>+ a mode</button>
        ) : (
          <span data-medium-mode-gesture="true" className="flex flex-wrap items-center gap-x-2">
            {/* M12 (9): the field takes focus when it opens, and Enter adds (or chooses a word already on the line) */}
            <WordField value={newMode} onChange={setNewMode} words={m.words} field={{ 'data-medium-mode-input': 'true', autoFocus: true, onKeyDown: (e) => { if (e.key === 'Enter' && newMode.trim()) addMode(); }, placeholder: 'a word', className: 'h-5 w-28 rounded border border-stone-700 bg-stone-900 px-1 text-xs text-stone-100' }} />
            {newMode.trim() ? <button type="button" data-medium-mode-declare="true" className="underline" onClick={addMode}>add</button> : null}
          </span>
        )}
      </span>
      <span data-medium-gesture="true" className="flex flex-wrap items-center gap-x-2 text-stone-400">
        {mode === IS ? (
          <span>{`"${la}'s point ≡ ${lb}'s point"`}</span>
        ) : (
          <>
            <button type="button" data-medium-dir="→" data-medium-dir-chosen={dir === ALONG ? 'true' : undefined} className={dir === ALONG ? 'underline text-stone-100' : 'text-stone-400'} onClick={() => setDir(ALONG)}>{`"${la}'s point ${mode} ${lb}'s point"`}</button>
            {' · '}
            <button type="button" data-medium-dir="←" data-medium-dir-chosen={dir === AGAINST ? 'true' : undefined} className={dir === AGAINST ? 'underline text-stone-100' : 'text-stone-400'} onClick={() => setDir(AGAINST)}>{`"${lb}'s point ${mode} ${la}'s point"`}</button>
          </>
        )}
        {' — '}
        <button type="button" data-medium-hold="+" data-medium-hold-chosen={bar ? undefined : 'true'} className={bar ? 'text-stone-400' : 'underline text-stone-100'} onClick={() => setBar(false)}>it holds</button>
        {' · '}
        <button type="button" data-medium-hold="-" data-medium-hold-chosen={bar ? 'true' : undefined} className={bar ? 'underline text-amber-200' : 'text-stone-400'} onClick={() => setBar(true)}>it does not hold</button>
      </span>
      {mode !== IS ? (
        <>
          <span data-medium-converse={mode} data-medium-converse-word={converse ?? undefined} className="flex flex-wrap items-center gap-x-2">
            {converse !== null ? (
              <>
                <span>{`${mode} the other way round: ${converse}`}</span>
                {' · '}
                <button type="button" data-medium-converse-withdraw={mode} className="underline" onClick={() => withdrawConverse(mode)}>withdraw</button>
              </>
            ) : (
              <>
                <span>{`${mode} the other way round:`}</span>
                {' '}
                <input data-medium-converse-input={mode} value={converseWord} onChange={(e) => setConverseWord(e.target.value)} placeholder="a word" className={inputClass} />
                {converseWord.trim() ? <>{' '}<button type="button" data-medium-converse-name={mode} className="underline" onClick={() => { declareConverse(mode, converseWord); setConverseWord(''); }}>name it</button></> : null}
              </>
            )}
          </span>
          <span data-medium-opaque-line={mode} className="flex flex-wrap items-center gap-x-2">
            <span>{`in ${mode},`}</span>
            {' '}
            <button type="button" data-medium-opaque="through" data-medium-opaque-chosen={stops ? undefined : 'true'} className={stops ? 'text-stone-300' : 'underline text-stone-100'} onClick={() => setOpaque(mode, false)}>paired roles stand in for each other</button>
            {' · '}
            <button type="button" data-medium-opaque="stops" data-medium-opaque-chosen={stops ? 'true' : undefined} className={stops ? 'underline text-stone-100' : 'text-stone-300'} onClick={() => setOpaque(mode, true)}>{"they don't"}</button>
          </span>
        </>
      ) : null}
    </div>
  );
}

/** THE REFUSALS at the top of the pairing (LAYOUT-1 §4; COPY-1 §4.3): a relating's, and a decision's the store refused (§7.7), each `not taken —` with its buttons */
export function MediumRefusals(props: MediumProps) {
  const m = useMedium(props);
  const withdrawRelatingAttempt = useGeometryStore((s) => s.withdrawRelatingAttempt);
  const withdrawSayAttempt = useGeometryStore((s) => s.withdrawSayAttempt);
  const withdrawRolePair = useGeometryStore((s) => s.withdrawRolePair);
  const withdrawRelating = useGeometryStore((s) => s.withdrawRelating);
  const giveVerdict = useGeometryStore((s) => s.giveVerdict);
  if (!m.medium || !m.medium.sorting) return null;
  const refusal = m.relatingRefusals[props.edge.id];
  const says = Object.entries(m.sayRefusals).filter(([k]) => k.startsWith(`${props.edge.id}|`));
  const pairWords = (pair: [string, string]): string => `${m.nameA(pair[0])} ≡ ${m.nameB(pair[1])}`;
  return (
    <div data-medium-refusals="true" className="grid gap-0.5">
      {refusal ? (
        <span data-medium-refusal="true" className="text-amber-200">
          {`not taken — ${refusal.why} · `}
          <button type="button" data-medium-withdraw-attempt="true" className="underline" onClick={() => withdrawRelatingAttempt(props.edge.id)}>clear</button>
        </span>
      ) : null}
      {says.map(([k, r]: [string, SayRefusal]) => (
        <span key={k} data-medium-say-refusal={k.slice(props.edge.id.length + 1)} className="text-amber-200 flex flex-wrap items-center gap-x-2">
          <span>{`not taken — ${r.text}`}</span>
          {r.pair ? <>{' · '}<button type="button" data-medium-say-refusal-withdraw-pair={r.pair.join('|')} className="underline" onClick={() => { withdrawRolePair(props.edge.id, r.pair![0], r.pair![1]); withdrawSayAttempt(k); }}>{`withdraw ${pairWords(r.pair)}`}</button></> : null}
          {r.bar ? <>{' · '}<button type="button" data-medium-say-refusal-withdraw-bar={relKey(r.bar)} className="underline" onClick={() => { withdrawRelating(props.edge.id, r.bar![0], r.bar![1], r.bar![2], dirOf(r.bar!)); withdrawSayAttempt(k); }}>withdraw the bar</button></> : null}
          {r.notIt ? <>{' · '}<button type="button" data-medium-say-refusal-not-it="true" className="underline" onClick={() => { giveVerdict(r.notIt!.faceId, r.notIt!.record); withdrawSayAttempt(k); }}>comes to nothing</button></> : null}
          {' · '}
          <button type="button" data-medium-say-refusal-clear="true" className="underline" onClick={() => withdrawSayAttempt(k)}>clear</button>
        </span>
      ))}
    </div>
  );
}

/** LAYOUT-1 §4 — the medium's root attributes, for the view that carries the four pieces apart (the witnesses read them on the `data-medium` root) */
export function useMediumAttrs(props: MediumProps): Record<string, string> {
  const m = useMedium(props);
  const s = m.medium?.sorting;
  return s ? { 'data-medium-state': s.state, 'data-medium-coherent': String(s.coherent), 'data-medium-closed': String(s.closed), 'data-medium-rules': String(m.rules.length) } : {};
}

/** THE POINT (LAYOUT-1 §4's point tab; COPY-1 §4.5): the head, the state line, the name's record */
export function MediumPoint(props: MediumProps & { nameIt?: ReactNode }) {
  const m = useMedium(props);
  if (!m.medium || !m.medium.child || !m.medium.sorting) return null;
  const { child, sorting } = m.medium;
  const w = wordsOf(m, sorting);
  const named = namedLine(m, sorting, props.siteId, w.viewLabel);
  return (
    <div data-medium-point="true" className="grid gap-0.5">
      {/* LAYOUT-1 §4: the head — the concept's line with naming added (`· name it`, the view's control) */}
      {child.instances.length > 0 || props.nameIt ? (
        <span className="flex flex-wrap items-center gap-x-2">
          {/* the designer's 16:06 (1): with nothing related the count drops at zero and the head still names what `name it` points at —
              `the concept between A and B · name it`; the state line below says `nothing related between A and B yet` */}
          <span data-medium-child="true" className="text-stone-100">{child.instances.length > 0 ? `the concept between ${props.la} and ${props.lb}, made of ${plural(child.instances.length, 'relating', 'relatings')}` : `the concept between ${props.la} and ${props.lb}`}</span>
          {props.nameIt ? <><span className="text-stone-400">·</span>{props.nameIt}</> : null}
        </span>
      ) : null}
      <span data-medium-state-line="true" className="text-stone-400">{w.stateLine()}</span>
      {/* STAMP THE-ALTITUDE · slice 1 (the designer's §1, §5; D25): one line per opposite corner — its roles unrelated here (VACUOUS under it), or the child under it */}
      {sorting.views.filter((v) => !v.coordinate).map((v) => {
        const lz = w.viewLabel(v); const a = v.altitude;
        return a.sayings === 0
          ? <span key={`u-${v.view}`} data-medium-under={lz} data-medium-under-count="0" className="text-stone-400">{`${lz}'s roles: none related to ${props.la} or ${props.lb} here yet`}</span>
          : <span key={`u-${v.view}`} data-medium-under={lz} data-medium-under-count={String(a.sayings)} className="text-stone-400">{`under ${lz}: ${plural(a.sayings, 'relating', 'relatings')} from ${lz}'s roles · reaching ${plural(a.reach.length, 'role', 'roles')} of ${props.la} and ${props.lb} · ${a.refusals.length} ${a.refusals.length === 1 ? "doesn't" : "don't"} hold`}</span>;
      })}
      {named ? <span data-medium-named-under="true" data-medium-named-stage={named.stage ?? undefined} data-medium-named-snapshot={named.snapshot ? 'true' : undefined} data-medium-since-started={String(named.since.started)} data-medium-since-withdrawn={String(named.since.withdrawn)} data-medium-since-stopped={String(named.since.stopped)} data-medium-since-added={String(named.since.added)} data-medium-since-entered={named.since.entered === null ? undefined : String(named.since.entered)}>{named.text}</span> : null}
    </div>
  );
}

/** THE MODES (LAYOUT-1 §4's modes tab; COPY-1 §4.6, §11.4–§11.5): the counts, the passages through each corner with his decisions and rules, where each relating sits, the pocket's lines, the deeper lights */
export function MediumModes(props: MediumProps) {
  const m = useMedium(props);
  const { la, lb } = props;
  const nameRule = useGeometryStore((s) => s.nameRule);
  const withdrawRule = useGeometryStore((s) => s.withdrawRule);
  const giveVerdict = useGeometryStore((s) => s.giveVerdict);
  const withdrawVerdict = useGeometryStore((s) => s.withdrawVerdict);
  const [ruleWords, setRuleWords] = useState<Record<string, string>>({});
  const [ruleOrder, setRuleOrder] = useState<Record<string, 'first' | 'second'>>({});
  const [sayWords, setSayWords] = useState<Record<string, string>>({});
  const [sayOrder, setSayOrder] = useState<Record<string, Dir>>({});
  const [parShown, setParShown] = useState<Record<string, boolean>>({}); // THE-ALTITUDE · slice 2 (R3): the parallels, listed on demand
  const [bondRuleWords, setBondRuleWords] = useState<Record<string, string>>({});
  const [bondSayWords, setBondSayWords] = useState<Record<string, string>>({});
  const nameBondRule = useGeometryStore((s) => s.nameBondRule);
  const withdrawBondRule = useGeometryStore((s) => s.withdrawBondRule);
  useGeometryStore((s) => s.modesView); // STAMP THE-MODES-TAB: subscribed here; the value is read live where it is used
  const setModesView = useGeometryStore((s) => s.setModesView);
  const requestLight = useGeometryStore((s) => s.requestLight);
  const [gloss, setGloss] = useState<string | null>(null); // a pressed head's gloss (§1.4)
  if (!m.medium || !m.medium.child || !m.medium.sorting) return null;
  const { child, sorting, lights } = m.medium;
  const w = wordsOf(m, sorting);
  const { nameA, nameB, nameZ, labelOf, X, Y } = m;
  const spaceX = childSpaceOf(props.shape, X, props.options);
  const spaceY = childSpaceOf(props.shape, Y, props.options);
  const rolesA = spaceX ? spaceX.roles.length : 0;
  const rolesB = spaceY ? spaceY.roles.length : 0;
  const facePositions = (v: ViewSorting): [number, number] | null => {
    const f = props.shape.faces.find((x) => x.id === v.faceId);
    if (!f) return null;
    return [f.vertexIds.indexOf(X), f.vertexIds.indexOf(Y)];
  };
  // a `composed` decision names the direct's mode (w3) and, on a fork or a join, the direction he chose (w3dir — M3); a `not` speaks of no direct
  const verdictRecord = (v: ViewSorting, p: ReadPath, verdict: 'composed' | 'not', w3?: string, w3dir?: Dir) => {
    const base = facePositions(v);
    if (!base) return null;
    const dirs = p.path.dirs[0] === ALONG && p.path.dirs[1] === ALONG ? {} : { dirs: p.path.dirs };
    return { base, x: p.path.x, w: p.path.w, z: p.path.z, w2: p.path.w2, y: p.path.y, ...dirs, ...(verdict === 'composed' && w3 ? { w3 } : {}), ...(verdict === 'composed' && w3dir ? { w3dir } : {}), verdict };
  };
  const passageKey = (p: ReadPath): string => { const { x, w: pw, z, w2, y, dirs } = p.path; return `${x}|${pw}|${z}|${w2}|${y}${dirs[0] === ALONG && dirs[1] === ALONG ? '' : `|${dirs.join('')}`}`; };
  // the deeper light through a relating of the third corner (her §4; COPY-1 §4.6)
  const linkWords = (l: DerivedLight): string => ('role' in l.link ? `both hold ${nameZ(l.through, l.link.role)}` : `linked in ${labelOf(l.through)}'s light by ${nameZ(l.link.corners[0], l.link.relating[0])} ${modeWord(l.link.relating[1])} ${nameZ(l.link.corners[1], l.link.relating[2])}`);
  const derivedWords = (l: DerivedLight): string | null => (l.kind === 'coordinate' ? null : `${nameA(l.x)} with ${nameB(l.y)}, ${linkWords(l)}: ${l.held ? 'related here too' : 'not related here'}`);
  // §4 (M3): the rule gesture by shape — the key a passage OFFERS; a fork or a join listed ONCE whichever way its legs lie (MARKER LAYOUT-1 · M3)
  const ruleOf = (k: RuleKey): Rule | undefined => m.rules.find((r) => (r.length >= 4 ? r[3] : 'chain') === k.shape && ((r[0] === k.w && r[1] === k.w2) || (k.shape !== 'chain' && r[0] === k.w2 && r[1] === k.w)));
  const keyOffered = (p: ReadPath): RuleKey | null => { if (!p.path.readable || p.path.keys.length === 0) return null; return p.path.keys.find((k) => ruleOf(k)) ?? p.path.keys[0]; };
  const keyId = (k: RuleKey): string => (k.shape === 'chain' ? `${k.w}|${k.w2}` : `${[k.w, k.w2].sort().join('|')}|${k.shape}`);
  const shapeWords = (k: RuleKey): string => (k.shape === 'chain' ? `${k.w} then ${k.w2}` : `${k.w} and ${k.w2} ${k.shape === 'fork' ? 'from' : 'into'} one point`);
  // the two sentences a fork's or a join's order offers (COPY-1 §11.4): fork `"what it carries siblings what it grounds"`, join `"what carries it rivals what grounds it"`
  const endPhrase = (k: RuleKey, word: string): string => (k.shape === 'fork' ? `what it ${word}` : `what ${word} it`);
  const orderSentence = (k: RuleKey, word: string, first: string, second: string): string => `"${endPhrase(k, first)} ${word} ${endPhrase(k, second)}"`;
  const namedWords = (k: RuleKey, r: Rule): string => {
    const w3 = r[2];
    if (k.shape === 'chain') return `rule: ${r[0]} then ${r[1]} = ${w3}`;
    if (ruleUndirected(r)) return `rule: ${r[0]} and ${r[1]} ${k.shape === 'fork' ? 'from' : 'into'} one point = ${w3}, both ways`;
    const subjectWord = ruleSubject(r) === 'first' ? r[0] : r[1];
    return `rule: ${r[0]} and ${r[1]} ${k.shape === 'fork' ? 'from' : 'into'} one point = ${w3}, ${endPhrase(k, subjectWord)} comes first`;
  };
  const said = new Map<string, Array<[string, string]>>();
  for (const v of sorting.views) for (const p of v.paths) if (p.by === 'verdict' && p.composite !== null) { const k = `${p.path.w}|${p.path.w2}`; said.set(k, [...(said.get(k) ?? []), [w.viewLabel(v), p.composite]]); }
  const differ = [...said.entries()].filter(([, s]) => new Set(s.map(([, c]) => c)).size > 1);
  // a passage's line and its acts, as before — now on its cell's card (THE HANDS, M5 §9.12: the decision hands of D6 live on paths of TWO MODE LEGS
  // only; no decision on a TENSION (§6); `comes to nothing` stays on a MODE tension)
  const passageRow = (v: ViewSorting, p: ReadPath): ReactNode => {
    const decidable = p.path.readable && p.reading !== 'TENSION';
    const notDecidable = p.path.readable;
    const pk = passageKey(p);
    const [sx, sy] = w.decideEnds(p);
    const forkOrJoin = p.path.shape !== 'chain' && p.path.source === 'legs';
    const typed = (sayWords[pk] ?? '').trim();
    const chosen = sayOrder[pk] ?? ALONG;
    const decideWith = (): void => { const w3dir = forkOrJoin ? (chosen === ALONG ? (p.path.from === 'y' ? AGAINST : ALONG) : (p.path.from === 'y' ? ALONG : AGAINST)) : undefined; const r = verdictRecord(v, p, 'composed', typed, w3dir); if (r) giveVerdict(v.faceId, r); setSayWords({ ...sayWords, [pk]: '' }); };
    return (
      <span key={pk} data-medium-passage={pk} data-medium-passage-reading={p.reading} data-medium-passage-by={p.by ?? undefined} data-medium-passage-end={p.end ?? undefined} data-medium-passage-against={p.path.against ? 'true' : undefined} data-medium-passage-shape={p.path.source === 'triad' || p.path.source === 'coordinate' ? undefined : p.path.shape} data-medium-passage-from={p.path.source === 'coordinate' ? undefined : p.path.from ?? undefined} data-medium-passage-undirected={p.undirected ? 'true' : undefined} data-medium-passage-inherited={p.path.source === 'coordinate' && p.inherited && p.inherited.path ? p.inherited.path.reading : undefined} className="grid gap-0.5">
        <span data-medium-passage-legs="true">{w.passageWords(p)}</span>
        <span data-medium-passage-reading-line="true" className="flex flex-wrap items-center gap-x-2 text-stone-400">
          <span>{w.readingWords(p)}</span>
          {p.by === 'verdict' || p.recorded ? (
            <>
              {/* COPY-1 §11.7 (M9): the decision's own line names the relating and says once that it is an exception (the word alone would name a word the rule also names, M6/M8 (1)); no second line */}
              {p.reading === 'NOT' ? null : <span data-medium-said="true" data-medium-said-recorded={p.recorded ? 'true' : undefined} data-medium-exception={p.exception && p.composite !== null ? 'true' : undefined}>{`decided: ${p.recorded ? `${nameA(p.path.x)} ${modeWord(p.recorded)} ${nameB(p.path.y)}` : w.compositeWords(p)}${p.exception && p.composite !== null ? ', an exception to the rule' : ''}`}</span>}
              <button type="button" data-medium-say-withdraw="true" className="underline" onClick={() => { const r = verdictRecord(v, p, 'not'); if (r) withdrawVerdict(v.faceId, r); }}>withdraw</button>
            </>
          ) : (
            <>
              {decidable ? (
                <>
                  <span>{forkOrJoin && typed ? 'comes to' : `comes to ${sx}`}</span>
                  <WordField value={sayWords[pk] ?? ''} onChange={(nv) => setSayWords({ ...sayWords, [pk]: nv })} words={m.words} field={{ 'data-medium-say-input': pk, placeholder: 'a word', className: inputClass }} />
                  {forkOrJoin && typed ? (
                    <>
                      <button type="button" data-medium-say-order="→" data-medium-say-order-chosen={chosen === ALONG ? 'true' : undefined} className={chosen === ALONG ? 'underline text-stone-100' : 'text-stone-400'} onClick={() => setSayOrder({ ...sayOrder, [pk]: ALONG })}>{`"${sx} ${typed} ${sy}"`}</button>
                      {' · '}
                      <button type="button" data-medium-say-order="←" data-medium-say-order-chosen={chosen === AGAINST ? 'true' : undefined} className={chosen === AGAINST ? 'underline text-stone-100' : 'text-stone-400'} onClick={() => setSayOrder({ ...sayOrder, [pk]: AGAINST })}>{`"${sy} ${typed} ${sx}"`}</button>
                    </>
                  ) : <span>{sy}</span>}
                  {typed ? <>{' · '}<button type="button" data-medium-say="composed" className="underline" onClick={decideWith}>decide</button></> : null}
                </>
              ) : null}
              {notDecidable ? <button type="button" data-medium-say="not" className="underline" onClick={() => { const r = verdictRecord(v, p, 'not'); if (r) giveVerdict(v.faceId, r); }}>comes to nothing</button> : null}
            </>
          )}
        </span>
      </span>
    );
  };
  // a BOND as a passage (R2): its three legs as he and the cast said them; a refused relation of the light spans as a refused route, no hands
  const bondKeyOf = (b: ReadBond['bond']): string => `${b.x}|${b.w}|${b.z}|${b.S}|${b.z2}|${b.w2}|${b.y}|${b.zAt}`;
  const bondRow = (v: ViewSorting, rb: ReadBond): ReactNode => {
    const lz = w.viewLabel(v);
    const b = rb.bond;
    const key = bondKeyOf(b);
    const leg = (s: [string, string, string], ends: [VertexId, VertexId]): string => `${nameZ(ends[0], s[0])} ${modeWord(s[1])} ${nameZ(ends[1], s[2])}`;
    const legs = `${leg(b.said[0], [v.view, X])} · ${leg(b.said[1], [v.view, v.view])} · ${leg(b.said[2], [v.view, Y])}`;
    const base = facePositions(v);
    const rec = (verdict: 'composed' | 'not', w3?: string) => (base ? { base, x: b.x, w: b.w, z: b.z, w2: b.w2, y: b.y, S: b.S, z2: b.z2, ...(verdict === 'composed' && w3 ? { w3 } : {}), verdict } : null);
    const typed = (bondSayWords[key] ?? '').trim();
    const readingWords = rb.reading === 'REFUSED' ? (rb.refusal === 'denial' && rb.deniedAt ? 'cut: it does not hold at ' + (rb.deniedAt.end === 'x' ? nameA(rb.deniedAt.role) : nameB(rb.deniedAt.role)) : `${lz} refuses it`) : rb.reading === 'COMPOSED' ? `it comes to ${nameA(b.x)} ${rb.composite} ${nameB(b.y)}, also related directly` : rb.reading === 'LIGHT' ? `it comes to ${nameA(b.x)} ${rb.composite} ${nameB(b.y)}, not related directly: ${lz}'s light` : rb.reading === 'TENSION' ? `it comes to ${nameA(b.x)} ${rb.composite} ${nameB(b.y)}, which is barred` : rb.reading === 'NOT' ? 'decided: comes to nothing' : 'not decided yet';
    return (
      <span key={key} data-medium-bond={key} data-medium-bond-reading={rb.reading} data-medium-bond-refusal={rb.refusal ?? undefined} data-medium-bond-by={rb.by ?? undefined} className="grid gap-0.5">
        <span data-medium-bond-legs="true">{`across ${lz}'s relation: ${legs}`}</span>
        <span className="flex flex-wrap items-center gap-x-2 text-stone-400">
          <span>{readingWords}</span>
          {rb.by === 'verdict' ? <button type="button" data-medium-bond-say-withdraw="true" className="underline" onClick={() => { const r = rec('not'); if (r) withdrawVerdict(v.faceId, r); }}>withdraw</button> : rb.reading !== 'REFUSED' && rb.reading !== 'TENSION' ? (
            <>
              <span>{`comes to ${nameA(b.x)}`}</span>
              <WordField value={bondSayWords[key] ?? ''} onChange={(nv) => setBondSayWords({ ...bondSayWords, [key]: nv })} words={m.words} field={{ 'data-medium-bond-say-input': key, placeholder: 'a word', className: inputClass }} />
              <span>{nameB(b.y)}</span>
              {typed ? <>{' · '}<button type="button" data-medium-bond-say="composed" className="underline" onClick={() => { const r = rec('composed', typed); if (r) giveVerdict(v.faceId, r); setBondSayWords({ ...bondSayWords, [key]: '' }); }}>decide</button></> : null}
              <button type="button" data-medium-bond-say="not" className="underline" onClick={() => { const r = rec('not'); if (r) giveVerdict(v.faceId, r); }}>comes to nothing</button>
            </>
          ) : null}
        </span>
      </span>
    );
  };
  // the rule for a fork's, a join's or a chain's shape (§4, M3: the key a passage OFFERS), and for a bond's three words (R2) — once per shape on the card
  const forkRuleLine = (v: ViewSorting, k: RuleKey, count: number): ReactNode => {
    const id = keyId(k);
    const rule = ruleOf(k);
    const exceptions = v.paths.filter((p) => { const kk = keyOffered(p); return kk !== null && keyId(kk) === id && p.exception; }).length;
    const typed = (ruleWords[id] ?? '').trim();
    const sameWord = k.shape !== 'chain' && k.w === k.w2;
    const order = ruleOrder[id] ?? 'first';
    const here = `(${plural(count, 'passage', 'passages')} of this shape here; a rule holds across the solid)`;
    return rule ? (
      <span key={`r|${id}`} data-medium-rule={`${id}|${rule[2]}`}>
        {`${namedWords(k, rule)}, on every such passage${exceptions ? ` but ${exceptions}` : ''} · `}
        <button type="button" data-medium-rule-withdraw={id} className="underline" onClick={() => withdrawRule(rule[0], rule[1], k.shape)}>withdraw</button>
      </span>
    ) : (
      <span key={`r|${id}`} data-medium-rule-gesture={id} className="flex flex-wrap items-center gap-x-2">
        <span>{`one word for ${shapeWords(k)}:`}</span>
        <WordField value={ruleWords[id] ?? ''} onChange={(nv) => setRuleWords({ ...ruleWords, [id]: nv })} words={m.words} field={{ 'data-medium-rule-input': id, placeholder: 'a word', className: inputClass }} />
        {typed && k.shape !== 'chain' ? (sameWord ? <span data-medium-rule-both-ways="true">both ways</span> : (
          <>
            <button type="button" data-medium-rule-order="first" data-medium-rule-order-chosen={order === 'first' ? 'true' : undefined} className={order === 'first' ? 'underline text-stone-100' : 'text-stone-400'} onClick={() => setRuleOrder({ ...ruleOrder, [id]: 'first' })}>{orderSentence(k, typed, k.w, k.w2)}</button>
            {' · '}
            <button type="button" data-medium-rule-order="second" data-medium-rule-order-chosen={order === 'second' ? 'true' : undefined} className={order === 'second' ? 'underline text-stone-100' : 'text-stone-400'} onClick={() => setRuleOrder({ ...ruleOrder, [id]: 'second' })}>{orderSentence(k, typed, k.w2, k.w)}</button>
          </>
        )) : null}
        {typed ? <>{' · '}<button type="button" data-medium-rule-name={id} className="underline" onClick={() => { nameRule(k.w, k.w2, typed, k.shape, k.shape === 'chain' || sameWord ? undefined : order); setRuleWords({ ...ruleWords, [id]: '' }); }}>name it</button></> : null}
        <span data-medium-rule-here="true" className="text-stone-500">{here}</span>
      </span>
    );
  };
  const bondRuleLine = (v: ViewSorting, b: ReadBond['bond'], count: number): ReactNode => {
    const lz = w.viewLabel(v);
    const id = `${b.w}|${b.S}|${b.w2}`;
    const rule = m.bondRules.find((r) => r[0] === b.w && r[1] === b.S && r[2] === b.w2);
    const typed = (bondRuleWords[id] ?? '').trim();
    return rule ? (
      <span key={`b|${id}`} data-medium-bond-rule={`${id}|${rule[3]}`}>
        {`rule: ${b.w}, ${b.S} and ${b.w2} across ${lz}'s relation = ${rule[3]}, on every such passage · `}
        <button type="button" data-medium-bond-rule-withdraw={id} className="underline" onClick={() => withdrawBondRule(b.w, b.S, b.w2)}>withdraw</button>
      </span>
    ) : (
      <span key={`b|${id}`} data-medium-bond-rule-gesture={id} className="flex flex-wrap items-center gap-x-2">
        <span>{`one word for ${b.w}, ${b.S} and ${b.w2} across ${lz}'s relation:`}</span>
        <WordField value={bondRuleWords[id] ?? ''} onChange={(nv) => setBondRuleWords({ ...bondRuleWords, [id]: nv })} words={m.words} field={{ 'data-medium-bond-rule-input': id, placeholder: 'a word', className: inputClass }} />
        {typed ? <>{' · '}<button type="button" data-medium-bond-rule-name={id} className="underline" onClick={() => { nameBondRule(b.w, b.S, b.w2, typed); setBondRuleWords({ ...bondRuleWords, [id]: '' }); }}>name it</button></> : null}
        <span data-medium-rule-here="true" className="text-stone-500">{`(${plural(count, 'passage', 'passages')} of this shape here; a rule holds across the solid)`}</span>
      </span>
    );
  };
  // ─── STAMP THE-MODES-TAB · slice 1 (the designer's spec §1.2–§1.5, §1.7; Arman's 18:46: the matrix, its routes one at a time) ───
  // every route of every corner, each with its CELL (the row's role, the column's role), its KIND and its STATE — read, never stored
  type RouteKind = 'edges' | 'role' | 'relation';
  type RouteState = 'waiting' | 'decided' | 'refused' | 'cut';
  interface Route { key: string; v: ViewSorting; vi: number; kind: RouteKind; state: RouteState; cell: string; p: ReadPath | null; rb: ReadBond | null }
  const routes: Route[] = [];
  sorting.views.forEach((v, vi) => {
    for (const p of v.paths) routes.push({ key: `${v.view}|${passageKey(p)}`, v, vi, kind: p.path.source === 'altitude' ? 'role' : 'edges', state: p.reading === 'UNRULED' ? 'waiting' : 'decided', cell: `${p.path.x}|${p.path.y}`, p, rb: null });
    for (const rb of v.altitude.bonds) routes.push({ key: `${v.view}|${bondKeyOf(rb.bond)}`, v, vi, kind: 'relation', state: rb.reading === 'UNRULED' ? 'waiting' : rb.reading === 'REFUSED' ? (rb.refusal === 'denial' ? 'cut' : 'refused') : 'decided', cell: `${rb.bond.x}|${rb.bond.y}`, p: null, rb });
  });
  const kindRank: Record<RouteKind, number> = { edges: 0, role: 1, relation: 2 };
  const stateRank: Record<RouteState, number> = { waiting: 0, decided: 1, refused: 2, cut: 3 };
  // the order inside a cell (§1.5 (6)): corner by corner in the strip's order; by its edges, then by one role, then across its relations; within
  // each kind waiting, decided, refused, cut — never ranked
  const byCell = new Map<string, Array<{ r: Route; i: number }>>();
  routes.forEach((r, i) => { byCell.set(r.cell, [...(byCell.get(r.cell) ?? []), { r, i }]); });
  for (const list of byCell.values()) list.sort((a, b) => a.r.vi - b.r.vi || kindRank[a.r.kind] - kindRank[b.r.kind] || stateRank[a.r.state] - stateRank[b.r.state] || a.i - b.i);
  const routesIn = (cell: string): Route[] => (byCell.get(cell) ?? []).map(({ r }) => r);
  const rowRoles = spaceX ? spaceX.roles : [];
  const colRoles = spaceY ? spaceY.roles : [];
  const atCell = (rs: readonly Relating[], x: string, y: string): Relating[] => rs.filter((r) => r[1] === x && r[2] === y);
  const speaking = sorting.views.filter((v) => routes.some((r) => r.v === v));
  const marksIn = (cellRoutes: Route[]): Array<{ id: string; text: string; cls: string }> => {
    const out: Array<{ id: string; text: string; cls: string }> = [];
    for (const v of sorting.views) {
      const mine = cellRoutes.filter((r) => r.v === v);
      if (mine.length === 0) continue;
      const pre = speaking.length > 1 ? w.viewLabel(v) : ''; // with two corners speaking, each mark carries its corner's name (§1.4)
      const count = (f: (r: Route) => boolean): number => mine.filter(f).length;
      const edgesWaiting = count((r) => r.state === 'waiting' && r.kind === 'edges');
      const lightWaiting = count((r) => r.state === 'waiting' && r.kind !== 'edges');
      const decided = count((r) => r.state === 'decided');
      const refused = count((r) => r.state === 'refused' || r.state === 'cut');
      if (edgesWaiting) out.push({ id: `${v.view}|edges`, text: `${pre}▲${edgesWaiting}`, cls: 'text-stone-200' });
      if (lightWaiting) out.push({ id: `${v.view}|light`, text: `${pre}●${lightWaiting}`, cls: 'text-violet-300' });
      if (decided) out.push({ id: `${v.view}|decided`, text: `${pre}✓${decided}`, cls: 'text-amber-300' });
      if (refused) out.push({ id: `${v.view}|refused`, text: `${pre}✕${refused}`, cls: 'text-stone-500' });
    }
    return out;
  };
  // §1.2 the head: his relatings and bars on how many of the grid's pairs of roles (Virgin Land's 8 — `possible` goes)
  const cellsHeld = new Set([...sorting.instances, ...sorting.bars].map((r) => `${r[1]}|${r[2]}`)).size;
  const pairs = rowRoles.length * colRoles.length;
  const barsPart = sorting.bars.length ? ' · ' + plural(sorting.bars.length, 'bar', 'bars') : '';
  const headWords = sorting.instances.length + sorting.bars.length === 0
    ? `${la}–${lb}: nothing related yet · ${pairs} pairs of roles`
    : `${la}–${lb}: ${plural(sorting.instances.length, 'relating', 'relatings')}${barsPart}, on ${cellsHeld} of the ${pairs} pairs of roles`;
  // §1.3 one line per opposite corner: its edges and its light side by side, never merged (Virgin Land's 15); `refuses` the corner's, `cut` his
  const cornerLine = (v: ViewSorting): ReactNode => {
    const lz = w.viewLabel(v);
    if (v.coordinate) return <span key={v.view} data-medium-corner={lz} data-medium-corner-coordinate="true" data-medium-corner-edges={String(v.paths.length)} className="block">{w.viewHead(v)}</span>;
    const edges = v.paths.filter((p) => p.path.source !== 'altitude').length;
    const byRole = v.paths.filter((p) => p.path.source === 'altitude').length;
    const across = v.altitude.bonds.filter((b) => b.reading !== 'REFUSED').length;
    const cut = v.altitude.bonds.filter((b) => b.reading === 'REFUSED' && b.refusal === 'denial').length;
    const refuses = v.altitude.bonds.length - across - cut;
    const spoke = v.altitude.sayings > 0 || byRole > 0 || v.altitude.bonds.length > 0;
    const lightParts = [byRole > 0 ? `${byRole} by one role` : null, across > 0 ? `${across} across its relations` : null].filter((s): s is string => s !== null);
    const edgesPart = edges > 0 ? String(edges) + ' by its edges' : 'nothing on its edges';
    return (
      <span key={v.view} data-medium-corner={lz} data-medium-corner-edges={String(edges)} data-medium-corner-forks={String(byRole)} data-medium-corner-bonds={String(across)} data-medium-corner-refused={String(refuses)} data-medium-corner-denied={String(cut)} className="block">
        {`${lz} — ${edgesPart} · `}
        <span data-medium-corner-light={spoke ? 'spoken' : 'silent'} className={spoke ? 'text-violet-300' : undefined}>{spoke ? (lightParts.length ? lightParts.join(' · ') : 'no passage in its light yet') : 'nothing in its light yet'}</span>
        {refuses > 0 ? ` · ${refuses} that ${lz} refuses` : ''}
        {cut > 0 ? ` · ${cut} cut by a denial` : ''}
        {!spoke && props.siteId ? <>{' · '}<button type="button" data-medium-corner-open={lz} className="underline" onClick={() => { if (props.siteId) requestLight(props.siteId, v.view); }}>{`open ${lz}'s light`}</button></> : null}
      </span>
    );
  };
  // §1.5 the card: his relating(s) with their standing and the light's agreement at their two ends (Virgin Land's 16; a bar gets it too, her 13)
  // the standing (today's words); none at a VACUOUS site — §11.5: the naming clue is not offered where nothing has looked
  const standingOf = (k: string): string | null => { if (sorting.state === 'VACUOUS') return null; const V = sorting.values.get(k) ?? []; return V.length === 0 ? `not through ${w.cornersWords || 'any corner'}` : `also through ${andList(V.map(labelOf))}`; };
  const presentAt = (v: ViewSorting, slot: number, role: string): string[] => [...new Set((v.altitude.marks.get(cellKey(slot, role))?.present ?? []).map((mk) => mk.z))];
  const agreementsOf = (x: string, y: string): string[] => sorting.views.filter((v) => v.altitude.sayings > 0).map((v) => {
    const lz = w.viewLabel(v);
    const pos = facePositions(v);
    if (!pos) return `${lz} at neither end`;
    const zx = presentAt(v, pos[0], x); const zy = presentAt(v, pos[1], y);
    const both = zx.filter((z) => zy.includes(z));
    if (both.length > 0) return `${andList(both.map((z) => nameZ(v.view, z)))} at both ends`;
    if (zx.length > 0 && zy.length > 0) return `${lz} at both ends, by different roles`;
    if (zx.length > 0 || zy.length > 0) return `${lz} at one end`;
    return `${lz} at neither end`;
  });
  // the chosen pair, read LIVE from the store (react-dom/server hands a hook the store's initial snapshot); another midpoint's choice is not this one's
  const modes = (() => { const mv = useGeometryStore.getState().modesView; return mv && props.siteId && mv.siteId === props.siteId ? mv : null; })();
  const choose = (cell: string): void => { if (!props.siteId) return; setModesView(modes && modes.cell === cell ? null : { siteId: props.siteId, cell, all: false, at: 0 }); };
  const cellOf = (x: string, y: string): string => `${x}|${y}`;
  const chosenCell = modes ? modes.cell : null;
  const card = (cell: string): ReactNode => {
    const [x, y] = cell.split('|');
    const cellRoutes = routesIn(cell);
    const n = cellRoutes.length;
    const waiting = cellRoutes.filter((r) => r.state === 'waiting').length;
    const waitingPart = waiting ? ' · ' + String(waiting) + ' not decided yet' : '';
    const all = !!modes && modes.all;
    const at = Math.min(Math.max(modes ? modes.at : 0, 0), Math.max(n - 1, 0));
    const through = orList(sorting.views.filter((v) => cellRoutes.some((r) => r.v === v)).map(w.viewLabel));
    const agreement = agreementsOf(x, y).map((a) => ` · ${a}`).join('');
    const rels = atCell(sorting.instances, x, y);
    const bars = atCell(sorting.bars, x, y);
    const inherited = sorting.inherited.filter((h) => h.x === x && h.y === y);
    // the rule once per shape (§1.5 (5)): under the first WAITING route of its shape; a named rule under the first route of its shape
    const shapeOf = (r: Route): string | null => { if (r.p) { const k = keyOffered(r.p); return k ? `f|${keyId(k)}` : null; } return r.rb && r.rb.reading !== 'REFUSED' ? `b|${r.rb.bond.w}|${r.rb.bond.S}|${r.rb.bond.w2}` : null; };
    const anchors = new Map<string, string>();
    const perShape = new Map<string, number>();
    for (const r of cellRoutes) { const s = shapeOf(r); if (s) perShape.set(s, (perShape.get(s) ?? 0) + 1); }
    for (const s of perShape.keys()) {
      const ofShape = cellRoutes.filter((r) => shapeOf(r) === s);
      const named = s.startsWith('f|') ? (() => { const r0 = ofShape[0]; const k = r0.p ? keyOffered(r0.p) : null; return !!k && !!ruleOf(k); })() : m.bondRules.some((r) => `b|${r[0]}|${r[1]}|${r[2]}` === s);
      const anchor = named ? ofShape[0] : ofShape.find((r) => r.state === 'waiting');
      if (anchor) anchors.set(anchor.key, s);
    }
    const ruleUnder = (r: Route): ReactNode => {
      const s = anchors.get(r.key);
      if (!s) return null;
      const count = perShape.get(s) ?? 0;
      if (r.p) { const k = keyOffered(r.p); return k ? forkRuleLine(r.v, k, count) : null; }
      return r.rb ? bondRuleLine(r.v, r.rb.bond, count) : null;
    };
    const kindWords = (r: Route): string => (r.v.coordinate ? `the corner both sides share, read from ${labelOf(r.v.coordinate.edge[0])}–${labelOf(r.v.coordinate.edge[1])}` : r.kind === 'edges' ? `by ${w.viewLabel(r.v)}'s edges` : r.kind === 'role' ? 'by one role' : `across ${w.viewLabel(r.v)}'s relation`);
    const shown = all ? cellRoutes : n > 0 ? [cellRoutes[at]] : [];
    const walk = (patch: Partial<{ all: boolean; at: number }>): void => { if (modes) setModesView({ ...modes, ...patch }); };
    return (
      <div data-medium-card={cell} data-medium-card-routes={String(n)} data-medium-card-waiting={String(waiting)} className="grid gap-1 rounded border border-amber-300/40 p-2">
        <span data-medium-card-head="true" className="text-stone-100">{`${nameA(x)} · ${nameB(y)}`}</span>
        {rels.length + bars.length + inherited.length === 0 ? <span data-medium-card-relating="none">nothing related between these two yet</span> : null}
        {rels.map((r) => { const k = relKey(r); const st = standingOf(k); const stPart = st ? ' · ' + st : ''; return <span key={k} data-medium-card-relating={k}>{`${w.withForm(k)}${stPart}${agreement}`}</span>; })}
        {bars.map((r) => { const k = relKey(r); return <span key={`bar|${k}`} data-medium-card-bar={k}>{`${w.sentence(r)} · barred${agreement}`}</span>; })}
        {inherited.map((h) => <span key={`inh|${h.key}`} data-medium-card-inherited={labelOf(h.through)}>{`${nameA(h.x)} ≡ ${nameB(h.y)} · also through ${labelOf(h.through)}, from the pair ${nameZ(h.corners[0], h.q)} ≡ ${nameZ(h.corners[1], h.r)} on ${labelOf(h.edge[0])}–${labelOf(h.edge[1])}${agreement}`}</span>)}
        {n === 0 ? <span data-medium-card-walk="none">{`no passage through ${w.cornersWords || 'any corner'} reaches these two`}</span> : (
          <span data-medium-card-walk={all ? 'all' : String(at + 1)} className="block">
            {`${plural(n, 'route', 'routes')} through ${through} here${waitingPart} · `}
            {all ? <button type="button" data-medium-card-one="true" className="underline" onClick={() => walk({ all: false })}>one at a time</button> : (
              <>
                {`${at + 1} of ${n} · `}
                <button type="button" data-medium-card-previous="true" disabled={at === 0} className={at === 0 ? 'text-stone-600' : 'underline'} onClick={() => walk({ at: at - 1 })}>previous</button>
                {' · '}
                <button type="button" data-medium-card-next="true" disabled={at >= n - 1} className={at >= n - 1 ? 'text-stone-600' : 'underline'} onClick={() => walk({ at: at + 1 })}>next</button>
                {` · all ${n} · `}
                <button type="button" data-medium-card-all="true" className="underline" onClick={() => walk({ all: true })}>show</button>
              </>
            )}
          </span>
        )}
        {shown.map((r) => (
          <div key={r.key} data-medium-route={r.key} data-medium-route-corner={w.viewLabel(r.v)} data-medium-route-kind={r.kind} data-medium-route-state={r.state} className="grid gap-0.5 border-l border-stone-700 pl-2">
            <span data-medium-route-kind-line="true" className={r.kind === 'edges' ? 'text-stone-400' : 'text-violet-300'}>{kindWords(r)}</span>
            {r.p ? passageRow(r.v, r.p) : r.rb ? bondRow(r.v, r.rb) : null}
            {ruleUnder(r)}
          </div>
        ))}
      </div>
    );
  };
  // the legend names the corner whose routes the grid marks (§1.4: `▲ by T's edges, ● in T's light`); with two speaking, `a corner's` and `its`
  const oneCorner = speaking.length === 1 ? w.viewLabel(speaking[0]) : sorting.views.length === 1 ? w.viewLabel(sorting.views[0]) : null;
  const edgesOwner = oneCorner ? oneCorner + "'s" : "a corner's";
  const lightOwner = oneCorner ? oneCorner + "'s" : 'its';
  const glossOf = (role: { id: string; marks?: unknown }): string | null => { const g = (role.marks as Record<string, unknown> | undefined)?.gloss; return typeof g === 'string' && g.length > 0 ? g : null; };
  return (
    <div data-medium-modes-tab="true" data-medium-rules={String(m.rules.length)} className="grid gap-1 text-stone-300">
      <span data-medium-head="true" data-medium-head-cells={`${cellsHeld}|${pairs}`} className="text-stone-100">{headWords}</span>
      {child.discordances.map((d) => (
        <span key={`${d.word}|${d.terms.join('|')}`} data-medium-differ="true">{`${la} and ${lb} disagree on ${d.word.replace('≡', ' ≡ ')} for ${d.terms.map((t) => `(${t.replace('≡', ' ≡ ')})`).join(' and ')}: it ${d.viaA === 'holds' ? 'holds' : "doesn't hold"} by ${la}, ${d.viaB === 'holds' ? 'holds' : 'not'} by ${lb}; both are kept`}</span>
      ))}
      <div data-medium-corners="true" className="grid gap-0.5">{sorting.views.map(cornerLine)}</div>
      {rowRoles.length > 0 && colRoles.length > 0 ? (
        <div data-medium-grid={`${rowRoles.length}x${colRoles.length}`} className="grid gap-px text-[11px] leading-tight" style={{ gridTemplateColumns: `minmax(4.5rem, max-content) repeat(${colRoles.length}, minmax(0, 1fr))` }}>
          <span />
          {colRoles.map((c) => (
            <button key={`c|${c.id}`} type="button" data-medium-grid-col={c.id} data-medium-grid-gloss-open={gloss === `c|${c.id}` ? 'true' : undefined} className="break-words px-0.5 text-left text-stone-400 hover:text-stone-200" onClick={() => setGloss(gloss === `c|${c.id}` ? null : `c|${c.id}`)}>{nameB(c.id)}</button>
          ))}
          {rowRoles.map((rr) => (
            <Fragment key={`r|${rr.id}`}>
              <button type="button" data-medium-grid-row={rr.id} data-medium-grid-gloss-open={gloss === `r|${rr.id}` ? 'true' : undefined} className="break-words pr-1 text-left text-stone-400 hover:text-stone-200" onClick={() => setGloss(gloss === `r|${rr.id}` ? null : `r|${rr.id}`)}>{nameA(rr.id)}</button>
              {colRoles.map((c) => {
                const cell = cellOf(rr.id, c.id);
                const cellRoutes = routesIn(cell);
                const rels = atCell(sorting.instances, rr.id, c.id);
                const bars = atCell(sorting.bars, rr.id, c.id);
                const marks = marksIn(cellRoutes);
                const isChosen = chosenCell === cell;
                return (
                  <button key={cell} type="button" data-medium-cell={cell} data-medium-cell-chosen={isChosen ? 'true' : undefined} data-medium-cell-routes={String(cellRoutes.length)} title={`${nameA(rr.id)} · ${nameB(c.id)}`} className={`grid min-h-[1.5rem] content-start gap-0 break-words rounded-sm bg-stone-900/60 px-0.5 py-0.5 text-left ${isChosen ? 'outline outline-1 outline-amber-300' : 'hover:bg-stone-800'}`} onClick={() => choose(cell)}>
                    {rels.map((r) => <span key={relKey(r)} data-medium-cell-relating={relKey(r)} className={r[0] === IS ? 'text-amber-200' : 'text-stone-100'}>{r[0] === IS ? '≡' : `${dirOf(r) === AGAINST ? '↑' : '↓'} ${r[0]}`}</span>)}
                    {bars.map((r) => <span key={`bar|${relKey(r)}`} data-medium-cell-bar={relKey(r)} className="text-stone-400 line-through">{r[0] === IS ? '≡' : `${dirOf(r) === AGAINST ? '↑' : '↓'} ${r[0]}`}</span>)}
                    {marks.length ? <span data-medium-cell-marks={marks.map((mk) => mk.text).join(' ')}>{marks.map((mk, i) => <Fragment key={mk.id}>{i > 0 ? ' ' : ''}<span className={mk.cls}>{mk.text}</span></Fragment>)}</span> : null}
                  </button>
                );
              })}
            </Fragment>
          ))}
        </div>
      ) : null}
      {gloss ? (() => {
        const [side, id] = [gloss.slice(0, 1), gloss.slice(2)];
        const role = (side === 'r' ? rowRoles : colRoles).find((r) => r.id === id);
        const g = role ? glossOf(role) : null;
        return <span data-medium-grid-gloss={id} className="text-stone-400">{`${side === 'r' ? nameA(id) : nameB(id)}: ${g ?? 'no gloss in its cast'}`}</span>;
      })() : null}
      <span data-medium-legend="true" className="text-stone-500">{`a word with ↑ or ↓: a relating, read from the column's role or the row's · struck: a bar · waiting: ▲ by ${edgesOwner} edges, ● in ${lightOwner} light · ✓ decided · ✕ refused or cut`}</span>
      {chosenCell && rowRoles.some((rr) => colRoles.some((c) => cellOf(rr.id, c.id) === chosenCell)) ? card(chosenCell) : <span data-medium-card-none="true" className="text-stone-400">choose a pair of roles: its routes open below, each drawn</span>}
      {sorting.views.map((v) => {
        const lz = w.viewLabel(v);
        const undecided = undecidedIn(v); // the designer's 16:33 (1): the same count as the name's stage, by construction
        return (
          <Fragment key={`u|${v.view}`}>
            {v.altitude.parallels.length > 0 ? (() => {
              // R3 — PARALLELS by count, listed on demand, in three forms (§1.7): both hold · one refuses (a discordance, both kept) · both refuse (the
              // mothership's ruling: two refusals, shown and kept) — no rule gesture where a refusal stands
              const onX = v.altitude.parallels.filter((p) => spaceX && spaceX.roles.some((r) => r.id === p.x) && spaceX.roles.some((r) => r.id === p.x2));
              const onY = v.altitude.parallels.filter((p) => !onX.includes(p));
              const sentence = (end: VertexId, p: { x: string; x2: string; R: { w: string } }): string => `${nameZ(end, p.x)} ${p.R.w} ${nameZ(end, p.x2)}`;
              const zSentence = (p: { z: string; z2: string; S: { w: string } }): string => `${nameZ(v.view, p.z)} ${p.S.w} ${nameZ(v.view, p.z2)}`;
              const row = (end: VertexId, lab: string, p: typeof onX[number], i: number): ReactNode => (
                <span key={`${lab}|${i}`} data-medium-parallel={`${lab}|${p.R.w}|${p.x}|${p.x2}|${p.S.w}|${p.z}|${p.z2}`} data-medium-parallel-discordance={p.discordance ? 'true' : undefined} data-medium-parallel-refused={!p.R.holds && !p.S.holds ? 'both' : undefined} className="block pl-3 text-stone-300">
                  {p.discordance
                    ? (!p.R.holds ? `${lab} refuses "${sentence(end, p)}"; beside it, ${lz}'s "${zSentence(p)}" spans the same two roles; both are kept` : `${lz} refuses "${zSentence(p)}"; beside it, ${lab}'s "${sentence(end, p)}" spans the same two roles; both are kept`)
                    : !p.R.holds && !p.S.holds ? `${lab} refuses "${sentence(end, p)}", and beside it ${lz} refuses "${zSentence(p)}"` : `${lab}'s "${sentence(end, p)}" beside ${lz}'s "${zSentence(p)}"`}
                </span>
              );
              return (
                <>
                  <span data-medium-parallels-head={lz} data-medium-parallels={`${onX.length}|${onY.length}`} className="block text-stone-100">
                    {`parallels: ${onX.length} with ${la}'s relations · ${onY.length} with ${lb}'s · `}
                    <button type="button" data-medium-parallels-show={lz} data-medium-parallels-shown={parShown[lz] ? 'true' : undefined} className="underline text-stone-300" onClick={() => setParShown({ ...parShown, [lz]: !parShown[lz] })}>{parShown[lz] ? 'hide' : 'show'}</button>
                  </span>
                  {parShown[lz] ? onX.map((p, i) => row(X, la, p, i)) : null}
                  {parShown[lz] ? onY.map((p, i) => row(Y, lb, p, i)) : null}
                </>
              );
            })() : null}
            {undecided > 0 ? <span data-medium-unruled={String(undecided)}>{`${plural(undecided, 'passage', 'passages')} through ${lz} not decided yet`}</span> : null}
          </Fragment>
        );
      })}
      {differ.map(([k, s]) => <span key={k} data-medium-says-differ={k}>{`decisions differ: ${s.map(([lz, c]) => `${c} through ${lz}`).join(', ')}`}</span>)}
      {w.pocketLines().map(([k, text]) => <span key={`p-${k}`} data-medium-pocket-line={k} className="text-stone-400">{text}</span>)}
      {lights.map((l) => { const t = derivedWords(l); return t ? <span key={`${l.kind}|${l.x}|${l.y}|${l.through}|${l.via}`} data-medium-light-derived={l.kind} data-medium-light-held={l.held ? 'true' : undefined}>{t}</span> : null; })}
    </div>
  );
}

/** THE BLOCK as the surface mounts it today: the pieces stacked where the block stood (LAYOUT-1's tabs take them apart in the midpoint view) */
export function MediumBlock(props: MediumProps) {
  const m = useMedium(props);
  if (!m.medium || !m.medium.child || !m.medium.sorting) return null;
  const { sorting } = m.medium;
  return (
    <div data-medium="true" data-medium-state={sorting.state} data-medium-coherent={String(sorting.coherent)} data-medium-closed={String(sorting.closed)} data-medium-rules={String(m.rules.length)} className="mt-2 grid gap-0.5 rounded border border-stone-800 bg-stone-950/60 px-2 py-1 text-stone-300">
      <MediumChoices {...props} />
      <MediumRefusals {...props} />
      <MediumPoint {...props} />
      <MediumModes {...props} />
    </div>
  );
}

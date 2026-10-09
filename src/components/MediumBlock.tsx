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
import { mediumOf, type DerivedLight } from '../lib/descent';
import { nameStageOf, recordAtStage } from '../lib/stage';
import { AGAINST, ALONG, converseOf, dirOf, isOpaque, lexiconOf, IS, type Dir, type Relating } from '../lib/relatings';
import { relKey, ruleSubject, ruleUndirected, type ReadPath, type Rule, type RuleKey, type Sorting, type ViewSorting } from '../lib/sorting';
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
  useGeometryStore((s) => s.relatingRefusals);
  useGeometryStore((s) => s.sayRefusals);
  useGeometryStore((s) => s.converses);
  useGeometryStore((s) => s.opaque);
  useGeometryStore((s) => s.log);
  useGeometryStore((s) => s.edgeTauDrafts);
  const { lexicon, rules, relatingRefusals, sayRefusals, converses, opaque, log, edgeTauDrafts } = useGeometryStore.getState();
  const facts = { converses, opaque };
  const medium = mediumOf(shape, edge, options, rules, facts);
  const [X, Y] = edge.vertexIds;
  const labelOf = (v: VertexId): string => shape.vertices[v]?.data.label || v;
  // every name in the block reads through ONE reader: a role by its name, a role that is itself a relating in parentheses (her §1)
  const nameZ = (z: VertexId, id: string): string => termWordsOf(shape, z, id, options);
  const nameA = (id: string): string => nameZ(X, id);
  const nameB = (id: string): string => nameZ(Y, id);
  const words = lexiconOf(shape, lexicon);
  return { medium, shape, edge, options, X, Y, labelOf, nameZ, nameA, nameB, words, rules, facts, relatingRefusals, sayRefusals, log, edgeTauDrafts, lexicon, la, lb };
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
  const then = ((): Sorting | null => {
    if (stageN === null) return null;
    const rec = recordAtStage({ shape, rules: m.rules, facts: m.facts, lexicon: m.lexicon, tauDrafts: m.edgeTauDrafts }, m.log, stageN);
    const e = rec.shape.edges.find((c) => c.id === edge.id);
    const med = e ? mediumOf(rec.shape, e, { ...options, tauDrafts: rec.tauDrafts }, rec.rules, rec.facts) : null;
    return med ? med.sorting : null;
  })();
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
        case 'UNRULED': { const k = then.views.reduce((t, v) => t + v.unruled.length, 0); return `when there were ${plural(n, 'relating', 'relatings')} and ${plural(k, 'passage', 'passages')} not decided yet`; }
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
  return { text: `named ${siteName} ${when}${since}`, stage: stageN, snapshot: snapshot !== null, since: since0 };
}

/** THE CHOICES for the next act (LAYOUT-1 §4; COPY-1 §4.2): the modes line ending in `+ a mode`; the direction and holds line; the chosen mode's converse and stand-in bit */
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
  return (
    <div data-medium-choices="true" className="grid gap-0.5">
      {/* the SPACES between a line's items are real text nodes (a whitespace-only node is not laid out in a flex row, but it is the line's text — what a person copies) */}
      <span data-medium-modes="true" className="flex flex-wrap items-center gap-x-2">
        <span>modes:</span>
        {m.words.map((w, i) => (
          <Fragment key={w}>
            {i > 0 ? ' · ' : ' '}
            <button type="button" data-medium-mode={w} data-medium-mode-chosen={w === mode ? 'true' : undefined} className={w === mode ? 'underline text-stone-100' : 'text-stone-300'} onClick={() => setMode(w)}>{w}</button>
          </Fragment>
        ))}
        {' · '}
        {newMode === null ? (
          <button type="button" data-medium-mode-add="true" className="underline text-stone-300" onClick={() => setNewMode('')}>+ a mode</button>
        ) : (
          <span data-medium-mode-gesture="true" className="flex flex-wrap items-center gap-x-2">
            {/* M12 (9): the field takes focus when it opens, and Enter adds */}
            <input data-medium-mode-input="true" autoFocus value={newMode} onChange={(e) => setNewMode(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && newMode.trim()) { declareMode(newMode); setNewMode(null); } }} placeholder="a word" className="h-5 w-28 rounded border border-stone-700 bg-stone-900 px-1 text-xs text-stone-100" />
            {newMode.trim() ? <button type="button" data-medium-mode-declare="true" className="underline" onClick={() => { declareMode(newMode); setNewMode(null); }}>add</button> : null}
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
  const [altShown, setAltShown] = useState<Record<string, boolean>>({}); // THE-ALTITUDE (the designer's §6): the passages from the light's roles, listed on demand
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
  return (
    <div data-medium-modes-tab="true" data-medium-rules={String(m.rules.length)} className="grid gap-0.5 text-stone-300">
      <span data-medium-head="true" className="text-stone-100">{`${plural(m.words.length, 'mode', 'modes')} · ${rolesA} × ${rolesB} roles · ${m.words.length * rolesA * rolesB} possible · ${sorting.instances.length} related · ${sorting.bars.length} barred`}</span>
      {child.discordances.map((d) => (
        <span key={`${d.word}|${d.terms.join('|')}`} data-medium-differ="true">{`${la} and ${lb} disagree on ${d.word.replace('≡', ' ≡ ')} for ${d.terms.map((t) => `(${t.replace('≡', ' ≡ ')})`).join(' and ')}: it ${d.viaA === 'holds' ? 'holds' : "doesn't hold"} by ${la}, ${d.viaB === 'holds' ? 'holds' : 'not'} by ${lb}; both are kept`}</span>
      ))}
      {sorting.views.map((v) => {
        const lz = w.viewLabel(v);
        const offered: Array<[string, RuleKey]> = [];
        for (const p of v.paths) { const k = keyOffered(p); if (k && !offered.some(([id]) => id === keyId(k))) offered.push([keyId(k), k]); }
        // THE-ALTITUDE (D24; the designer's §6): the edges' legs' passages under the view's head as before; the altitude's passages — the forks
        // from the light's roles — under their own head, by count, listed on demand, never merged with the legs'
        const legPaths = v.paths.filter((p) => p.path.source !== 'altitude');
        const altPaths = v.paths.filter((p) => p.path.source === 'altitude');
        const passageRow = (p: ReadPath): ReactNode => {
              // THE HANDS (M5, §9.12): the decision hands of D6 live on paths of TWO MODE LEGS only; no decision on a TENSION (§6); `comes to nothing` stays on a MODE tension
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
                            <input data-medium-say-input={pk} value={sayWords[pk] ?? ''} onChange={(e) => setSayWords({ ...sayWords, [pk]: e.target.value })} placeholder="a word" className={inputClass} />
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
        return (
          <div key={v.view} data-medium-view={lz} data-medium-view-vacuous={String(v.vacuous)} className="grid gap-0.5">
            <span data-medium-view-head="true" className="text-stone-100">{w.viewHead(v)}</span>
            {legPaths.map(passageRow)}
            {v.altitude.sayings > 0 || altPaths.length > 0 ? (
              <span data-medium-altitude-head={lz} data-medium-altitude-forks={String(altPaths.length)} className="flex flex-wrap items-center gap-x-2 text-stone-100">
                <span>{`through ${lz}, from ${lz}'s roles: ${plural(altPaths.length, 'passage', 'passages')} by one role`}</span>
                {altPaths.length > 0 ? <button type="button" data-medium-altitude-show={lz} data-medium-altitude-shown={altShown[lz] ? 'true' : undefined} className="underline text-stone-300" onClick={() => setAltShown({ ...altShown, [lz]: !altShown[lz] })}>{altShown[lz] ? 'hide' : 'show'}</button> : null}
              </span>
            ) : null}
            {altShown[lz] ? altPaths.map(passageRow) : null}
            {offered.map(([id, k]) => {
              const rule = ruleOf(k);
              const exceptions = v.paths.filter((p) => { const kk = keyOffered(p); return kk !== null && keyId(kk) === id && p.exception; }).length;
              const typed = (ruleWords[id] ?? '').trim();
              const sameWord = k.shape !== 'chain' && k.w === k.w2;
              const order = ruleOrder[id] ?? 'first';
              return rule ? (
                <span key={id} data-medium-rule={`${id}|${rule[2]}`}>
                  {`${namedWords(k, rule)}, on every such passage${exceptions ? ` but ${exceptions}` : ''} · `}
                  <button type="button" data-medium-rule-withdraw={id} className="underline" onClick={() => withdrawRule(rule[0], rule[1], k.shape)}>withdraw</button>
                </span>
              ) : (
                <span key={id} data-medium-rule-gesture={id} className="flex flex-wrap items-center gap-x-2">
                  <span>{`one word for ${shapeWords(k)}:`}</span>
                  <input data-medium-rule-input={id} value={ruleWords[id] ?? ''} onChange={(e) => setRuleWords({ ...ruleWords, [id]: e.target.value })} placeholder="a word" className={inputClass} />
                  {typed && k.shape !== 'chain' ? (sameWord ? <span data-medium-rule-both-ways="true">both ways</span> : (
                    <>
                      <button type="button" data-medium-rule-order="first" data-medium-rule-order-chosen={order === 'first' ? 'true' : undefined} className={order === 'first' ? 'underline text-stone-100' : 'text-stone-400'} onClick={() => setRuleOrder({ ...ruleOrder, [id]: 'first' })}>{orderSentence(k, typed, k.w, k.w2)}</button>
                      {' · '}
                      <button type="button" data-medium-rule-order="second" data-medium-rule-order-chosen={order === 'second' ? 'true' : undefined} className={order === 'second' ? 'underline text-stone-100' : 'text-stone-400'} onClick={() => setRuleOrder({ ...ruleOrder, [id]: 'second' })}>{orderSentence(k, typed, k.w2, k.w)}</button>
                    </>
                  )) : null}
                  {typed ? <>{' · '}<button type="button" data-medium-rule-name={id} className="underline" onClick={() => { nameRule(k.w, k.w2, typed, k.shape, k.shape === 'chain' || sameWord ? undefined : order); setRuleWords({ ...ruleWords, [id]: '' }); }}>name it</button></> : null}
                </span>
              );
            })}
            {v.unruled.length > 0 ? <span data-medium-unruled={String(v.unruled.length)}>{`${plural(v.unruled.length, 'passage', 'passages')} through ${lz} not decided yet`}</span> : null}
          </div>
        );
      })}
      {differ.map(([k, s]) => <span key={k} data-medium-says-differ={k}>{`decisions differ: ${s.map(([lz, c]) => `${c} through ${lz}`).join(', ')}`}</span>)}
      {/* §11.5 — the `not through` line prints only with a relating to list; its other arm never (the state line says it) */}
      {sorting.own.length > 0 && sorting.state !== 'VACUOUS' ? <span data-medium-own={String(sorting.own.length)}>{`not through ${w.cornersWords || 'any corner'}: ${join(sorting.own.map(w.withForm))}`}</span> : null}
      {sorting.views.map((v) => ({ v, own: v.centroid.filter((k) => !sorting.inherited.some((h) => h.key === k)) })).filter(({ own }) => own.length > 0).map(({ v, own }) => (
        <span key={`c-${v.view}`} data-medium-faces={w.viewLabel(v)}>{`also through ${w.viewLabel(v)}: ${join(own.map(w.withForm))}`}</span>
      ))}
      {sorting.inherited.map((h) => (
        <span key={`i-${h.key}`} data-medium-faces-inherited={labelOf(h.through)}>{`also through ${labelOf(h.through)}, from the pair ${nameZ(h.corners[0], h.q)} ≡ ${nameZ(h.corners[1], h.r)} on ${labelOf(h.edge[0])}–${labelOf(h.edge[1])}: ${nameA(h.x)} ≡ ${nameB(h.y)}`}</span>
      ))}
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

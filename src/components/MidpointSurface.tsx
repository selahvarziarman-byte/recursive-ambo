// ═══ THE MIDPOINT VIEW — `STAMP LAYOUT-1` (2026-09-29, the designer's spec; Arman approved it 19:31/19:51) + `COPY-1` (its
// words, 21:14; §11 amended), built in THE CUT (Arman's Δ131: layout and copy before the release). The midpoint's view takes the
// solid's place when a midpoint is selected (App.tsx) and gives it back on × or Esc.
//
//   THE STRIP        the small solid (a midpoint clicked on it goes there) · `AB · between A and B` · one `C's light` button per
//                    opposite corner (in a light: `in C's light · close`) · × at the far right.
//   THE PAIRING      the left pane (~57%): the roles/words switch and the pane's ? (its note, LAYOUT-1 §6 verbatim) · the three
//                    choice lines (the medium's, COPY-1 §4.2) · the refusals at the top, `not taken — …` with their buttons
//                    (§4.3; the pair a button acts on travels as data, never a sentence parsed) · the reserved pick lines · THE
//                    DRAWING (§5): a pair a yellow numbered line with no head; a relating a thin ink line from subject to object
//                    with its word on a backing and an open head at the object; a bar the same line dashed and fainter, its word
//                    struck; hover lights a relation and dims the rest, a point's relations going out, then coming in (colour
//                    only — nothing moves); in a corner's light three columns A · C · B, the legs drawn as AB's, AB's own fainter ·
//                    under the drawing his acts, one per line, each with withdraw (§4.4).
//   THE POINT        the right pane, four tabs: the point (the head with `name it`, the state line, the name's record, the
//                    concept's diagram — his relatings as points with the arcs they carry) · modes (the medium's block whole) ·
//                    corners (each opposite corner: what it holds, what he paired on the two edges that reach it, how it sees the
//                    pairing, the face readings and born faces, the triads) · traces (where the record lives, the parents' traces,
//                    what both confirm, the role traces, the counts — the child's, never the pushout's).
//   ESC              closes the smallest thing first: a ? note, then a light, then the midpoint (§2).
//
// THE ONE STRUCTURAL LAW the witnesses hold this file to: they slice the medium's html from the `data-medium="true"` root to the
// traces' `data-midpoint-trace="true"` div — so the VIEW ROOT carries `data-medium` (first) with the medium's attributes, every
// tab's content renders (an inactive tab is hidden, never unmounted), and the traces tab is LAST in the DOM.
//
// What stands from the earlier cuts (C-7 to C-14, MODES-1 to MODES-4): the device says four things — the FORM, the RECORD, the
// REFUSAL (by name, at the act, with every withdrawal), the TRACE; it never proposes, grades, sorts or ranks; the picks are the
// person's, the two-pick act in the chosen mode (IS the pairing; a mode a relating; barred a bar), the triad in a corner's light;
// the resolver's one derivation (C-8) — the surface glues nothing; the record's own orientation (this cast the edge's first
// corner, that cast its second). Pure over its props — the store is reached only to act (a witness renders it under node with
// the record as props; the strip's small solid is a slot the page fills, never rendered here).

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ConceptSpace, Edge, EdgeIdentification, Shape, VertexId } from '../types/geometry';
import { altitudeRefusalKey, useGeometryStore, type MidpointRefusal, type MidpointRemade } from '../store/geometryStore';
import { buildGeneralSitePacketPresenterReport, type GeneralSitePacketTrace } from '../lib/generalSitePacketPresenterV0';
import { composeCornerCycleName, d14NameRotation } from '../lib/cornerCycleName';
import { edgeBetween, faceBy, undByStep, type FaceTuple } from '../lib/faceReading';
import { transportStepOf } from '../lib/transport';
import { ALONG, AGAINST, barsOn, dirOf, instancesOn, IS, lexiconOf, relatingsHeld, type Dir, type Relating, type Sign } from '../lib/relatings';
import { WordField } from './WordField';
import { relKey, sortingOf } from '../lib/sorting';
// STAMP THE-ALTITUDE · slice 1 — the opposite corner's record at a face, read for the line asked first, the box, the drawing's lines and the acts' `under`
import { altitudeOf, bondSayingsOf, cellKey as markKey, endSlotOf, meetOf, sayingsOf, signOf, whyOf, type AltitudeSaying, type EndSlot } from '../lib/altitude';
import { isChristened, isGeneratedMidpoint } from '../lib/christening';
import { configurationAt, cutByDenial, inducedHolds } from '../lib/configuration';
import { childSpaceOf, columnDisplayOf, columnSpaceOf, instancesFrom, termWordsOf, wordWordsOf } from '../lib/instanceSpace';
import { MediumChoices, MediumModes, MediumPoint, MediumRefusals, useMediumAttrs } from './MediumBlock';
import { HelpNote, Hint } from './HelpNote';

import { bornFaceOf, readAlike, type BornAct, type BornFaceResult } from '../lib/bornFace';
import { bornReadersOf } from '../lib/transport';
import { insideOf, type Inside, type InsideArc, type InsidePoint } from '../lib/castInside';
import { traceOf, type Midpoint, type ParentTrace, type Side } from '../lib/midpointGlue';
import { type Conflict } from '../lib/jRegister';
import { isMoldType } from '../lib/castLoader';
// C-8 — THE RESOLVER: the chooser and the surface read `spaceOf`, never `data.cast` (a seed corner's cast; a born corner's
// space derived from its parents over the J its edge's kind fixes); the record's home and the site by generation
import { generationOf, holdsLoadedCast, isSeedVertex, nameIn, spaceCounts, spaceOf, type Resolved, type SpaceOfOptions } from '../lib/spaceOf';
import type { RespectReading, RespectTuple } from '../lib/respects'; // C-14 f — the readings as the resolver hands them
import { ARC_FLATTEN, CastInsidePanel, InsideColumn, WRAP, columnObstacles, insideGeometry, type InsideGeometry, type MarkExtra, type ObstacleBox, type PointExtra } from './CastInsideDiagram';

export interface ProjectionSource {
  faceId: string; // C-9: the face record — the cells holding it name an interior face's two walks
  faceName: string; // composed from the face's corners (D14)
  apexes: VertexId[]; // the face's corners other than the two parents
  cycle: VertexId[]; // C-5: the face's corners in D14's order — the direction the face is walked (a rotation, never a reversal)
}

export interface MidpointSite {
  siteId: VertexId;
  edge: Edge; // the source edge in the CURRENT shape — the edge between the two parents (the record's home)
  a: VertexId; // the edge's first corner — `this cast`
  b: VertexId; // its second — `that cast`
  hostCellId: string;
  sources: ProjectionSource[]; // the faces of the host incident to the edge, each with its apexes — the projection sources
}

/**
 * THE MIDPOINT'S STRUCTURAL INPUTS — the presenter's TRACE consumed (parents · host · complement), never re-derived;
 * the two faces incident to the edge read from the host it names (on the tetrahedron their apexes ARE the
 * presenter's complement; on a later generation's octahedral host the complement is four and the incident faces
 * have two apexes among them — the unfolding needs the faces, which the trace does not carry).
 */
export function midpointSiteOf(shape: Shape, siteId: VertexId, trace: GeneralSitePacketTrace | null): MidpointSite | null {
  if (!trace) return null;
  const [p, q] = trace.parentIds;
  const edge = shape.edges.find((e) => (e.vertexIds[0] === p && e.vertexIds[1] === q) || (e.vertexIds[0] === q && e.vertexIds[1] === p));
  if (!edge) return null;
  const host = shape.cells.find((c) => c.id === trace.hostCellId);
  const faces = host ? shape.faces.filter((f) => host.faceIds.includes(f.id) && f.vertexIds.includes(p) && f.vertexIds.includes(q)) : [];
  const sources = faces.map((f) => {
    const labels = f.vertexIds.map((v) => labelOf(shape, v));
    const rot = d14NameRotation(labels);
    return {
      faceId: f.id,
      // COPY-1 P3 / §7.4: a face whose corner has no name reads `A·unnamed·C` — joined with `·`, never run together
      faceName: composeCornerCycleName(f.vertexIds.map((v) => shape.vertices[v]?.data.label ?? null)) ?? labels.join('·'),
      apexes: f.vertexIds.filter((v) => v !== p && v !== q),
      cycle: f.vertexIds.map((_, i) => f.vertexIds[(rot + i) % f.vertexIds.length]),
    };
  });
  return { siteId, edge, a: edge.vertexIds[0], b: edge.vertexIds[1], hostCellId: trace.hostCellId, sources };
}

export const labelOf = (shape: Shape, id: VertexId): string => {
  const label = shape.vertices[id]?.data.label ?? '';
  return label.trim() ? label : 'unnamed';
};

/** COPY-1 P2: a tuple's value in words */
const valueWords = (v: string): string => (v === 'does-not-hold' ? 'does not hold' : v);

/** a conflict in the person's words — both values, both parents named (COPY-1 §4.3: `part(F2, F4) holds in A, but part(Φ1, Φ2) does not hold in B`) */
export const conflictWords = (c: Conflict, la: string, lb: string): string => {
  if (c.arity === 1) {
    const yKey = c.yType === c.type ? '' : `${c.yType}: `;
    return `${c.type}: ${c.xTerms[0]} ${valueWords(c.xValue)} in ${la}, but ${yKey}${c.yTerms[0]} ${valueWords(c.yValue)} in ${lb}`;
  }
  return `${c.type}(${c.xTerms.join(', ')}) ${valueWords(c.xValue)} in ${la}, but ${c.yType}(${c.yTerms.join(', ')}) ${valueWords(c.yValue)} in ${lb}`;
};

/** §149 — what the feet contribute to the space's count, said in words beside it (kept for the witnesses' census; the pushout's counts leave the page under §9.15) */
export const cornersViewWords = (share: { words: number; tuples: number }, names: string[]): string => {
  if (share.words === 0) return '';
  const owners = names.map((n) => `${n}'s`);
  const who = owners.length <= 1 ? `the view of the opposite corner, ${owners[0] ?? ''}` : `the views of the opposite corners, ${owners.slice(0, -1).join(', ')} and ${owners[owners.length - 1]}`;
  const them = share.words === 1 ? 'it' : 'them';
  return share.tuples === 0
    ? `${share.words} of them ${who} — no tuple on ${them} yet`
    : `${share.words} of them ${who} — ${share.tuples} ${share.tuples === 1 ? 'tuple' : 'tuples'} on ${them}`;
};
/** a corner's own label, or `unnamed` (COPY-1 rule 5: no id reaches the page) */
export const cornerNameOf = (shape: Shape, id: VertexId): string => labelOf(shape, id);

/** the residual a parent still holds alone — the label of the parent→child line, never bare (COPY-1 §4.8) */
export const residualWords = (t: ParentTrace, label: string, other: string): string =>
  `${label}: ${t.unmatched} of its ${t.roles} roles ${t.unmatched === 1 ? 'has' : 'have'} no partner · ${t.onUnmatched} ${t.onUnmatched === 1 ? 'tuple' : 'tuples'} on those · ${t.untranslatedOnMapped} ${t.untranslatedOnMapped === 1 ? 'tuple' : 'tuples'} on paired roles in untranslated words · ${t.exposed} ${t.exposed === 1 ? 'tuple' : 'tuples'} in ${t.exposed === 1 ? 'a translated word' : 'translated words'} ${other} leaves unrecorded`;

/** C-7d item 2 — what the person has given on one neighbouring edge, as it stands: his own map, or a true absence */
/** COPY-1 P3 (the designer's 14:36 (1)): an edge BY NAME — its two corners' names in one order, so no line names one edge two ways (`F–T`, `T–Φ`, `F–Φ`) */
export const edgeByName = (shape: Shape, u: VertexId, v: VertexId): string => { const a = labelOf(shape, u); const b = labelOf(shape, v); return a.localeCompare(b) <= 0 ? `${a}–${b}` : `${b}–${a}`; };

export interface NeighbourActs {
  edgeLabel: string; // `A–C` in the edge's own corner order
  present: boolean;
  roles: EdgeIdentification['roles'];
  types: EdgeIdentification['types'];
  roleWords: Array<[string, string]>; // the role pairs as a person reads them — the spaces' labels, in the line's order (the edge by name)
  typeWords: Array<[string, string]>; // the word pairs in the line's order
  words: Array<[string, string, string]>; // THE-ALTITUDE · slice 4 (Virgin Land's finding 10): his relatings in a word on the edge, as he made them — `F2 sustains r1`
}

export const neighbourActsOn = (shape: Shape, x: VertexId, y: VertexId): NeighbourActs => {
  const edge = shape.edges.find((e) => (e.vertexIds[0] === x && e.vertexIds[1] === y) || (e.vertexIds[0] === y && e.vertexIds[1] === x));
  const rec = edge?.identification;
  const edgeLabel = edgeByName(shape, x, y); // the designer's 14:36 (1): by name, whatever the edge's own order
  // C-8: a born pair's record holds the endpoint spaces' own ids (a glued space's id is a local key) — the words are the spaces' labels
  const U = edge ? spaceOf(shape, edge.vertexIds[0]) : null;
  const V = edge ? spaceOf(shape, edge.vertexIds[1]) : null;
  const roles = rec?.roles ?? [];
  // finding 10: the relatings in a word the edge holds, as he made them (from the first corner `x w y`; made from the second, `y w x`), never only the ≡ pairs
  const words: Array<[string, string, string]> = edge ? relatingsHeld(edge).filter((r) => r[3] === '+' && r[0] !== IS).map((r) => (dirOf(r) === ALONG ? [U ? nameIn(U.space, r[1]) : r[1], r[0], V ? nameIn(V.space, r[2]) : r[2]] : [V ? nameIn(V.space, r[2]) : r[2], r[0], U ? nameIn(U.space, r[1]) : r[1]]) as [string, string, string]) : [];
  // the designer's 14:36 (1): the line names its edge by name, so its ≡ pairs read in that order too — the role of the corner named first, first (a pair is
  // symmetric: only the line's order changes); a relating in a word keeps the direction he made it
  const flip = !!edge && labelOf(shape, edge.vertexIds[0]).localeCompare(labelOf(shape, edge.vertexIds[1])) > 0;
  const inOrder = (p: [string, string]): [string, string] => (flip ? [p[1], p[0]] : p);
  return { edgeLabel, present: (!!rec && (rec.roles.length > 0 || rec.types.length > 0)) || words.length > 0, roles, types: rec?.types ?? [], roleWords: roles.map(([a, b]) => inOrder([U ? nameIn(U.space, a) : a, V ? nameIn(V.space, b) : b])), typeWords: (rec?.types ?? []).map(([s, u]) => inOrder([s, u])), words };
};

/** COPY-1 §4.7: `on A–C: F2 ≡ r0 · F4 ≡ r1 · F3 sustains r2 · part ≡ part` · `nothing paired or related on B–C yet` (finding 10: a relating in a word counts) */
export const neighbourActsWords = (n: NeighbourActs): string =>
  n.present ? `on ${n.edgeLabel}: ${[...n.roleWords.map(([x, y]) => `${x} ≡ ${y}`), ...n.words.map(([a, w, b]) => `${a} ${w} ${b}`), ...n.typeWords.map(([s, t]) => `${s} ≡ ${t}`)].join(' · ')}` : `nothing paired or related on ${n.edgeLabel} yet`;

/** the acts a refusal rests on — the attempt, then each prior act the conflicts name; every one withdrawable */
export function actsOfRefusal(refusal: MidpointRefusal, roles: EdgeIdentification['roles'], types: EdgeIdentification['types']): Array<{ kind: 'role' | 'word'; pair: [string, string]; attempt: boolean }> {
  const acts: Array<{ kind: 'role' | 'word'; pair: [string, string]; attempt: boolean }> = [{ ...refusal.act, attempt: true }];
  const seen = new Set([`${refusal.act.kind}|${refusal.act.pair.join('|')}`]);
  const add = (kind: 'role' | 'word', pair: [string, string]): void => {
    const k = `${kind}|${pair.join('|')}`;
    if (seen.has(k)) return;
    seen.add(k);
    acts.push({ kind, pair, attempt: false });
  };
  for (const c of refusal.conflicts) {
    for (const x of c.xTerms) {
      const y = roles.find(([a]) => a === x)?.[1];
      if (y !== undefined) add('role', [x, y]);
    }
    if (c.arity >= 2 || c.type !== c.yType) {
      if (types.some(([s, t]) => s === c.type && t === c.yType)) add('word', [c.type, c.yType]);
    }
  }
  // COPY-1 §7.1 — a refusal of the FORM carries the prior act it collides with AS DATA (`prior`); the button reads it, never a sentence
  if (refusal.prior) {
    const held = refusal.prior.kind === 'role' ? roles : types;
    const prior = held.find(([a, b]) => a === refusal.prior!.pair[0] && b === refusal.prior!.pair[1]);
    if (prior) add(refusal.prior.kind, prior);
  }
  return acts;
}

const FOLD = 150;
const LIGHT_GAP = 120;
const TOP = 26;

/** what the fit may narrow to: a block of words no narrower than one long word (the geometry's own floor), the fold and a light's
 * gaps no narrower than the word backing drawn at their middle */
const WRAP_MIN = 80;
const FOLD_MIN = 90;
const GAP_MIN = 80;
const BOW_MIN = ARC_FLATTEN / 2;

export interface InsideLayout {
  g0A: InsideGeometry;
  g0B: InsideGeometry;
  g0L: InsideGeometry | null;
  gA: InsideGeometry;
  gL: InsideGeometry | null;
  gB: InsideGeometry;
  width: number;
  wrap: number;
  fold: number;
  gap: number;
  /** null while the label lane keeps its legacy floor; 0 once the fit lowered it to the longest label */
  laneFloor: number | null;
  /** the arcs' bow the columns were laid out at — the geometry's own (0.62) until the fit's last stage flattens it */
  arcFlatten: number;
}

/** MARKER LAYOUT-1 · M12 (8) — THE DRAWING FITS ITS PANE, by construction. Two columns (three in a light) are laid out at the
 * geometry's own wrap and gaps first; where their width exceeds `avail` (the pane's, measured on the drawing's container), the word
 * blocks wrap at a narrower width derived from the pane and the columns grow BY HEIGHT (C-7g: by height, never by width) — up to
 * three passes, since the reaches move with the wrap; then the fold (two columns) or the gaps (three) give way, never below the word
 * backing at their middle; then the label lane's legacy floor gives way to the longest label itself; last, the arcs' bow flattens,
 * never below half. A word is never broken and a lane is never narrower than its longest label (C-13d), so a drawing of very long
 * names may still exceed the pane; then it scrolls. Exported for the midpoint witness, which RUNS it. */
export function fitInsideLayout(insideA: Inside, insideB: Inside, lightInside: Inside | null, avail: number | null): InsideLayout {
  const at = (wrap: number, fold: number, gap: number, laneFloor?: number, arcFlatten?: number): InsideLayout => {
    const opt = { top: TOP, wrap, ...(laneFloor === undefined ? {} : { laneFloor }), ...(arcFlatten === undefined ? {} : { arcFlatten }) };
    const g0A = insideGeometry(insideA, opt);
    const g0B = insideGeometry(insideB, opt);
    const g0L = lightInside ? insideGeometry(lightInside, opt) : null;
    const gA = insideGeometry(insideA, { ...opt, px: g0A.leftReach + 8 });
    const gL = lightInside && g0L ? insideGeometry(lightInside, { ...opt, px: gA.px + g0A.rightReach + gap + g0L.leftReach }) : null;
    const gB = insideGeometry(insideB, { ...opt, px: (gL && g0L ? gL.px + g0L.rightReach + gap : gA.px + g0A.rightReach + fold) + g0B.leftReach });
    return { g0A, g0B, g0L, gA, gL, gB, width: gB.px + g0B.rightReach + 8, wrap, fold, gap, laneFloor: laneFloor ?? null, arcFlatten: gA.arcFlatten };
  };
  let laid = at(WRAP, FOLD, LIGHT_GAP);
  if (avail === null || avail <= 0) return laid;
  for (let pass = 0; pass < 3 && laid.width > avail; pass += 1) {
    const narrower = Math.max(WRAP_MIN, Math.floor((laid.wrap * avail) / laid.width));
    if (narrower >= laid.wrap) break;
    laid = at(narrower, laid.fold, laid.gap);
  }
  if (laid.width > avail) {
    const over = laid.width - avail;
    const fold = lightInside ? laid.fold : Math.max(FOLD_MIN, laid.fold - over);
    const gap = lightInside ? Math.max(GAP_MIN, laid.gap - Math.ceil(over / 2)) : laid.gap;
    if (fold !== laid.fold || gap !== laid.gap) laid = at(laid.wrap, fold, gap);
  }
  if (laid.width > avail) laid = at(laid.wrap, laid.fold, laid.gap, 0);
  // the arcs' bow is the last to give: the columns' reaches are the arcs' where the words are narrow, so the bow scales by what is
  // over, pass by pass (a flatter bow moves every reach), never below half the geometry's own
  for (let pass = 0; pass < 12 && laid.width > avail && laid.arcFlatten > BOW_MIN; pass += 1) {
    const flatter = Math.max(BOW_MIN, laid.arcFlatten * (avail / laid.width) - 0.02); // the fixed parts do not scale, so each pass over-corrects a little
    if (flatter >= laid.arcFlatten) break;
    laid = at(laid.wrap, laid.fold, laid.gap, 0, flatter);
  }
  return laid;
}

/** THE-ALTITUDE · the designer's 13:40 (7) with her 13:41 clause — a line's WORD as the drawing lays it: its box at (x, y) — the text's baseline y,
 * centred on x at the drawing's 11 px, with its halo; the one rule the placement and its witness share */
export const wordBox = (x: number, y: number, word: string): ObstacleBox => { const half = (word.length * 6.4 + 6) / 2; return { x0: x - half, x1: x + half, y0: y - 10, y1: y + 3 }; };
const boxesMeet = (a: ObstacleBox, b: ObstacleBox): boolean => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
/** THE PLACEMENT: each line's word, in the drawing's order, at the first spot along ITS OWN LINE — the middle first (where it has always stood), then
 * outward, nearest the middle first — whose box meets no word already placed and no obstacle (the columns' role names and points, the pairs'
 * numbers); where no spot is free it keeps the middle. Greedy and deterministic. Exported for the altitude witness, which RUNS it on his sitting. */
export function placeLineWords(items: ReadonlyArray<{ key: string; x1: number; y1: number; x2: number; y2: number; word: string }>, obstacles: readonly ObstacleBox[]): Map<string, { x: number; y: number }> {
  const T = [0.5, 0.44, 0.56, 0.38, 0.62, 0.32, 0.68, 0.26, 0.74, 0.2, 0.8, 0.15, 0.85];
  const placed: ObstacleBox[] = [];
  const out = new Map<string, { x: number; y: number }>();
  for (const it of items) {
    let at: { x: number; y: number } | null = null;
    for (const s of T) {
      const x = it.x1 + s * (it.x2 - it.x1); const y = it.y1 + s * (it.y2 - it.y1) - 4;
      const b = wordBox(x, y, it.word);
      if (!placed.some((p) => boxesMeet(b, p)) && !obstacles.some((o) => boxesMeet(b, o))) { at = { x, y }; break; }
    }
    if (!at) at = { x: (it.x1 + it.x2) / 2, y: (it.y1 + it.y2) / 2 - 4 };
    placed.push(wordBox(at.x, at.y, it.word)); out.set(it.key, at);
  }
  return out;
}
/** the boxes' meetings among a set of words and against obstacles — what the placement's witness counts */
export function wordMeetings(words: ReadonlyArray<{ x: number; y: number; word: string }>, obstacles: readonly ObstacleBox[]): { wordWord: number; wordObstacle: number } {
  const bs = words.map((w) => wordBox(w.x, w.y, w.word));
  let wordWord = 0; let wordObstacle = 0;
  bs.forEach((b, i) => { for (let j = i + 1; j < bs.length; j += 1) if (boxesMeet(b, bs[j])) wordWord += 1; if (obstacles.some((o) => boxesMeet(b, o))) wordObstacle += 1; });
  return { wordWord, wordObstacle };
}

/** LAYOUT-1 §6 — the pairing's ? note, verbatim, with the corners' NAMES where the page has them (the designer's 12:12 (6): a page with F and Φ has no A and no B) */
export const pairingHelp = (la: string, lb: string): string[] => [
  `relate: choose the mode above, then click a point in ${la} and a point in ${lb}`,
  'translate: switch to words, then click a word in each row',
  `triad: open a corner's light, then click a point in ${la}, one in the corner and one in ${lb}`,
];

type Hover = { kind: 'point'; column: 'A' | 'B' | 'L'; id: string; name: string } | { kind: 'line'; key: string } | { kind: 'arc'; column: 'A' | 'B' | 'L'; i: number } | { kind: 'child'; label: string } | null;
type Tab = 'point' | 'modes' | 'corners' | 'traces' | 'light'; // THE-ALTITUDE (the designer's §2): `T's roles`, the first tab while a light is open
/** THE-ALTITUDE's box: one line of a cell as he types it — a word, a sign (neither chosen until he chooses), his why */
type BoxDraft = { word: string; sign: Sign | null; why: string; whyOpen: boolean };
const EMPTY_DRAFT: BoxDraft = { word: '', sign: null, why: '', whyOpen: false };
const boxInputClass = 'h-5 w-28 rounded border border-stone-700 bg-stone-900 px-1 text-xs text-stone-100';

/** a drawn line between two columns: a pair (IS), a relating in a mode, or a bar — LAYOUT-1 §5's glyphs */
interface DrawnLine {
  key: string;
  kind: 'pair' | 'relating' | 'bar' | 'altitude'; // THE-ALTITUDE: a saying in the light's colour, from the light's role to an end's role
  denied?: boolean; // an altitude saying that does not hold: dashed, its word struck
  from: { g: InsideGeometry; index: number; column: 'A' | 'B' | 'L'; id: string };
  to: { g: InsideGeometry; index: number; column: 'A' | 'B' | 'L'; id: string };
  word: string | null; // the mode's word (null on a pair)
  index?: number; // a pair's number
  faint?: boolean; // AB's own while a light is open
  refused?: boolean; // the refused pair, dashed rose
  attrs: Record<string, string>;
}

/** THE SURFACE — the midpoint view's body, pure over its props */
export function MidpointSurface({ shape, site, parents, resolved, refusal, remade, originTint = true, minimap, full = false }: {
  shape: Shape;
  site: MidpointSite;
  /** C-8: the two parents RESOLVED, in the edge's own orientation — a seed corner's cast, a born corner's space derived from its parents */
  parents: [Resolved, Resolved];
  /** C-8: this midpoint RESOLVED — the gluing over the J its edge's KIND fixes ∪ the record the edge lawfully carries; nothing here glues again */
  resolved: Resolved;
  refusal: MidpointRefusal | null;
  /** C-7f item 3: the pair the store re-made when the person withdrew a half — attributed on its line */
  remade: MidpointRemade | null;
  /** kept for the callers that pass it; the concept's diagram carries no origin tint under §9.15 */
  originTint?: boolean;
  /** LAYOUT-1 §4: the strip's small solid — a slot the page fills (a canvas needs a window; the witnesses pass nothing) */
  minimap?: ReactNode;
  /** the page's full view (the strip and two panes fill the module) — else the canvas overlay of the earlier cuts, as the witnesses render it */
  full?: boolean;
}) {
  void originTint;
  const giveRolePair = useGeometryStore((s) => s.giveRolePair);
  const giveWordPair = useGeometryStore((s) => s.giveWordPair);
  const withdrawRolePair = useGeometryStore((s) => s.withdrawRolePair);
  const withdrawWordPair = useGeometryStore((s) => s.withdrawWordPair);
  const withdrawMidpointAttempt = useGeometryStore((s) => s.withdrawMidpointAttempt);
  const selectFace = useGeometryStore((s) => s.selectFace); // C-10b: the route from the site to a born face's reading
  const selectVertex = useGeometryStore((s) => s.selectVertex); // LAYOUT-1 §2: × and Esc give the solid back; `open B–C` goes to that midpoint
  const updateSelectedVertexData = useGeometryStore((s) => s.updateSelectedVertexData); // LAYOUT-1 §4: naming happens at the point's head
  // C-14 f — THE TRIAD's hands: the act (three picks, one per corner, in the opened corner's light), its one hand back, the attempt's
  const giveTriad = useGeometryStore((s) => s.giveTriad);
  const giveRelating = useGeometryStore((s) => s.giveRelating); // B5 — the two-pick act in a chosen mode, or barred
  const withdrawRelating = useGeometryStore((s) => s.withdrawRelating); // M3 S10 — the hand on a relating or a bar listed under the drawing
  const withdrawTriad = useGeometryStore((s) => s.withdrawTriad);
  const withdrawTriadAttempt = useGeometryStore((s) => s.withdrawTriadAttempt);
  const triadRefusals = useGeometryStore((s) => s.triadRefusals);
  // STAMP THE-ALTITUDE · slice 1 — the saying in a light: the act, its hand back, its refusal by name
  const giveAltitudeSaying = useGeometryStore((s) => s.giveAltitudeSaying);
  const withdrawAltitudeSaying = useGeometryStore((s) => s.withdrawAltitudeSaying);
  const withdrawAltitudeAttempt = useGeometryStore((s) => s.withdrawAltitudeAttempt);
  const altitudeRefusals = useGeometryStore((s) => s.altitudeRefusals);
  // TAGS (Arman's word, 14:36–14:39; the designer's 14:40): his own words, offered back as he types in the box — read, never proposed
  const lexiconNow = useGeometryStore((s) => s.lexicon);
  const hisWords = useMemo(() => lexiconOf(shape, lexiconNow), [shape, lexiconNow]);
  // STAMP THE-ALTITUDE · slice 2 (§9.30 R1) — his saying about a bond at an end: the override of the induced configuration, and its hand back
  const giveBondSaying = useGeometryStore((s) => s.giveBondSaying);
  const withdrawBondSaying = useGeometryStore((s) => s.withdrawBondSaying);
  // STAMP MODES-3 — THE COLUMNS READ THE ONE READER (`columnSpaceOf`, §215/§285): a seed corner its cast, a born corner its CHILD (its
  // relatings as points, each labelled by its sentence). The resolver's merged space (`parents[i].space` — the shared corner composed on
  // both sides, the leftovers beside it: C-8's born room) is no column's source: it is read only to NAME an id an old record holds
  // that no column offers (a pair kept from before). A born corner whose child has no relating offers nothing (the view's gate).
  const EMPTY_SPACE: ConceptSpace = useMemo(() => ({ roles: [], signature: [], relations: [], axioms: [] }), []);
  const castA = useMemo(() => columnSpaceOf(shape, site.a) ?? EMPTY_SPACE, [shape, site.a, EMPTY_SPACE]);
  const castB = useMemo(() => columnSpaceOf(shape, site.b) ?? EMPTY_SPACE, [shape, site.b, EMPTY_SPACE]);
  // C-8: a glued space's role id is a LOCAL key (`A:r3`, `F1≡r0`) — a person reads the space's label for it, never the key
  const nameFrom = (col: ConceptSpace, merged: ConceptSpace, id: string): string => (col.roles.some((r) => r.id === id) ? nameIn(col, id) : nameIn(merged, id));
  const nA = (id: string): string => nameFrom(castA, parents[0].space, id);
  const nB = (id: string): string => nameFrom(castB, parents[1].space, id);
  const pairWords = (kind: 'role' | 'word', pair: [string, string]): string => (kind === 'role' ? `${nA(pair[0])} ≡ ${nB(pair[1])}` : `${pair[0]} ≡ ${pair[1]}`);
  const edgeInfo = resolved.edge;
  const kind = edgeInfo?.kind ?? 'seed';
  // C-8 — the identity the SOLID fixed on this seam (nothing on a seed edge), the person's record (a seed edge's whole
  // record; a medial edge's BORN pairs), and the amalgam over both — all the resolver's, read here
  const composed = useMemo(() => edgeInfo?.composed ?? { roles: [], words: [], conflicts: [], corners: new Map<string, VertexId[]>() }, [edgeInfo]);
  const roles = useMemo(() => edgeInfo?.born.roles ?? [], [edgeInfo]);
  const types = useMemo(() => edgeInfo?.born.types ?? [], [edgeInfo]);
  const refusedRecord = edgeInfo?.refused ?? null;
  const M: Midpoint | null = refusedRecord ? null : (edgeInfo?.midpoint ?? null);
  const trace = useMemo(() => (M ? traceOf(castA, castB, M) : null), [castA, castB, M]);
  // the drawing of a column prints its words (a word KEY of a child reads as words — `wordWordsOf`); the act keeps the keys
  const insideA = useMemo(() => insideOf(columnDisplayOf(shape, site.a, castA)), [shape, site.a, castA]);
  const insideB = useMemo(() => insideOf(columnDisplayOf(shape, site.b, castB)), [shape, site.b, castB]);
  const [pick, setPick] = useState<{ side: Side; role: string } | null>(null);
  const [wordPick, setWordPick] = useState<{ side: Side; word: string } | null>(null);
  // C-14 f — THE LIGHT: the opened corner's drawing (one at a time — opening D's closes C's: the face is chosen by opening its corner);
  // the triad's picks by corner, in any order — the act completes at the third
  const [light, setLight] = useState<VertexId | null>(null);
  // MODES-1 · B5 — the mode the next two picks relate in (IS: the pairing, as before), and whether they bar; chosen in the medium's block
  const [mode, setMode] = useState<string>(IS);
  const [barNext, setBarNext] = useState(false);
  // MODES-4 · D13 (the designer's §2): the DIRECTION the next relating reads in — a choice on the act line, never the order of the
  // picks; `→` A's point is the subject, `←` B's; absent for IS; resets with the mode when he leaves the midpoint (her register rule)
  const [dir, setDir] = useState<Dir>(ALONG);
  const [triadPicks, setTriadPicks] = useState<Record<VertexId, string>>({});
  const [wordTriadPicks, setWordTriadPicks] = useState<Record<VertexId, string>>({}); // C-14g — the word triad's picks, a word in each of the three rows
  // LAYOUT-1 §4 — the pairing's half (roles: the columns; words: the word rows), the point pane's tab, the hover (§5), naming at the head
  const [half, setHalf] = useState<'roles' | 'words'>('roles');
  const [tab, setTab] = useState<Tab>('point');
  const [hover, setHover] = useState<Hover>(null);
  const [hoverIn, setHoverIn] = useState(false); // a moment after a point is hovered, the relations coming in light up too
  const hoverTimer = useRef<number | null>(null);
  const [naming, setNaming] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [split, setSplit] = useState(0.57); // the divider between the panes: drags in a light, returns when it closes
  // THE-ALTITUDE's box (the designer's §3): the batch — which role of the light is open; the drafts per cell line; the extra lines he asked for; the acts' `under` shown
  const [batchIndex, setBatchIndex] = useState(0);
  const [boxDrafts, setBoxDrafts] = useState<Record<string, BoxDraft>>({});
  const [extraLines, setExtraLines] = useState<Record<string, number>>({});
  const [underShown, setUnderShown] = useState<Record<string, boolean>>({});
  const [relationsShown, setRelationsShown] = useState<Record<string, boolean>>({}); // THE-ALTITUDE · slice 2 (the designer's §4): the light's relations at an end, listed on demand
  const dragging = useRef(false);
  const la = labelOf(shape, site.a);
  const lb = labelOf(shape, site.b);
  const lm = labelOf(shape, site.siteId);
  const edgeId = site.edge.id;
  // C-14 f — the light's face and name; a corner's role read in that corner's own space (the resolver's), never by key
  const lightSource = light !== null ? (site.sources.find((s) => s.apexes.includes(light)) ?? null) : null;
  const lightFace = lightSource ? lightSource.faceId : null;
  const lightLabel = light !== null ? labelOf(shape, light) : '';
  // C-14g — the light's words (the designer's §4): its row opens WITH the light, in the caster's order, none lit, sorted or pre-paired
  const lightSpace = useMemo(() => (light === null ? null : (spaceOf(shape, light)?.space ?? null)), [shape, light]);
  const lightInside = useMemo(() => (lightSpace ? insideOf(lightSpace) : null), [lightSpace]);
  const nL = (id: string): string => (lightSpace ? nameIn(lightSpace, id) : id);
  const nX = (corner: VertexId, id: string): string => { const sp = spaceOf(shape, corner); return sp ? nameIn(sp.space, id) : id; };
  const core = resolved.core;
  const respectsAt = (corner: VertexId): RespectReading[] => resolved.respects.filter((r) => r.corner === corner);
  // MODES-1 · B3 — the sorting of the source edge (the paths through each opposite corner), read for the feet's silence alone here; its words are B5's
  const sourceEdge = site.edge;
  const sorting = useMemo(() => sortingOf(shape, sourceEdge, {}, []), [shape, sourceEdge]);
  // M3 S10 — his relatings in other modes and his bars on this edge: listed UNDER THE DRAWING, where the two picks are made (the
  // block below keeps them in its sorting); read through B1's one reader, IS excluded (the pairs have their numbered lines)
  const modeActs = useMemo(() => ({ relatings: instancesOn(sourceEdge).filter((r) => r[0] !== IS), bars: barsOn(sourceEdge) }), [sourceEdge]);
  // Arman's 19:27 (the designer's 19:30): the pairing column's body — the drawing first, its content's height up to three quarters of what is left under the
  // head lines; the list of acts the rest, scrolling inside itself, never under four lines; dynamic both ways. Measured in the browser (no layout under node:
  // there the body is unbounded, as before)
  const pairBodyRef = useRef<HTMLDivElement | null>(null);
  const drawRegionRef = useRef<HTMLDivElement | null>(null);
  const actsHeadRef = useRef<HTMLDivElement | null>(null);
  const actsScrollRef = useRef<HTMLDivElement | null>(null);
  const [drawMax, setDrawMax] = useState<number | null>(null);
  useLayoutEffect(() => {
    const body = pairBodyRef.current; const region = drawRegionRef.current; const list = actsScrollRef.current;
    if (!body || !region || !list || typeof ResizeObserver === 'undefined') return undefined;
    const measure = (): void => {
      const H = body.clientHeight;
      // each part's OWN height (its inner element's), never its container's — so a bounded region never feeds back into its own measure
      const content = (region.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0;
      const head = actsHeadRef.current ? actsHeadRef.current.offsetHeight : 0;
      const line = parseFloat(getComputedStyle(list).lineHeight) || 16;
      const inner = list.firstElementChild as HTMLElement | null;
      const listNeed = head + (inner ? inner.offsetHeight + 8 : 0);
      const listMin = head + 4 * line;
      let max: number | null = null;
      if (H > 0 && content + listNeed > H) max = Math.max(0, Math.min(content, Math.max(0.75 * H, H - listNeed), H - listMin));
      setDrawMax((prev) => (prev === max || (prev !== null && max !== null && Math.abs(prev - max) < 1) ? prev : max));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(body); ro.observe(list); if (region.firstElementChild) ro.observe(region.firstElementChild);
    const lc = list.firstElementChild; if (lc) ro.observe(lc);
    return () => ro.disconnect();
  });
  // the legs of an open light (the relatings on A–C and C–B, pairs included), drawn as AB's are (LAYOUT-1 §4)
  // THE-ALTITUDE · slice 3 (the designer's §8): a light asked for at this site from a face's three elsewhere — taken once, then the light opens
  const lightRequest = useGeometryStore((s) => s.lightRequest);
  const takeLightRequest = useGeometryStore((s) => s.takeLightRequest);
  const legEdges = useMemo(() => (light === null ? null : { ac: edgeBetween(shape.edges, site.a, light) ?? null, cb: edgeBetween(shape.edges, light, site.b) ?? null }), [shape, site.a, site.b, light]);
  const spokenLabels = core ? core.spoken.map((v) => labelOf(shape, v)) : [];
  const lightsWords = spokenLabels.length === 0 ? '' : spokenLabels.length === 1 ? `in ${spokenLabels[0]}'s light` : `in ${spokenLabels.slice(0, -1).map((l) => `${l}'s light`).join(', ')} and in ${spokenLabels[spokenLabels.length - 1]}'s`;
  const byLights = (kind2: 'role' | 'word', pair: [string, string]): boolean => !!core && (kind2 === 'role' ? core.meet.roles : core.meet.types).some((p) => p[0] === pair[0] && p[1] === pair[1]) && !(kind2 === 'role' ? core.unconditional.roles : core.unconditional.types).some((p) => p[0] === pair[0] && p[1] === pair[1]);
  const state = refusedRecord ? 'record-in-conflict' : roles.length === 0 && types.length === 0 ? 'unglued' : 'glued';
  // C-8 item 3 — the composed identity's roles in the unfolding (by side); the corners it shares
  // C-8 item 5 — the record's HOME (the edge, its kind, its generation) and the SITE (where the person stands), derived from what made them
  const edgeGen = Math.max(generationOf(shape, site.a), generationOf(shape, site.b));
  const siteGen = generationOf(shape, site.siteId);
  // MODES-2 (a): the born-room sentence counts what the columns hold — each corner's CHILD (its relatings, `childSpaceOf`: the same reader
  // the block's head counts with, so one card carries one count, §149) — and what is related here (every mode, the head's own word);
  // at a corner site the seed is the carried side, whichever corner is stored first
  // LAYOUT-1 §4 / §9.15 — THE CONCEPT'S DIAGRAM: the child (his relatings as its points, the relations of his casts they carry as its arcs)
  const child = useMemo(() => childSpaceOf(shape, site.siteId), [shape, site.siteId]);
  // each point labelled by its sentence (`(F5 ≡ Φ7)`), through the one reader of an instance's words — the key is never printed as a name;
  // the `mode` type leaves the point's types (the sentence already says it: `≡` is IS's one glyph, a mode its word — M12), and the
  // child's word keys read as words: `s≡t` → `s ≡ t`, a one-sided `A:s` → `A's s` by the corner's NAME (COPY-1 §4.5), never the key
  const childWordWords = useMemo(() => {
    const [e0, e1] = sourceEdge.vertexIds;
    const nameOfSide = (sideKey: 'A' | 'B'): string => cornerNameOf(shape, sideKey === 'A' ? e0 : e1) || 'unnamed';
    return (key: string): string => (key.startsWith('A:') ? `${nameOfSide('A')}'s ${key.slice(2)}` : key.startsWith('B:') ? `${nameOfSide('B')}'s ${key.slice(2)}` : key.includes('≡') ? key.split('≡').join(' ≡ ') : key);
  }, [shape, sourceEdge]);
  const childInside = useMemo(() => (child && child.roles.length > 0 ? insideOf({
    ...child,
    roles: child.roles.map((r) => { const types = { ...(r.types ?? {}) }; delete types.mode; return { ...r, label: termWordsOf(shape, site.siteId, r.id), ...(Object.keys(types).length ? { types } : { types: undefined }) }; }),
    signature: child.signature.map((s) => ({ ...s, type: childWordWords(s.type) })),
    relations: child.relations.map((rel) => ({ ...rel, type: childWordWords(rel.type) })),
  }) : null), [child, shape, site.siteId, childWordWords]);
  const childG = useMemo(() => (childInside ? insideGeometry(childInside, { px: 0, top: 14 }) : null), [childInside]);
  const childCounts2 = useMemo(() => (child ? spaceCounts(child) : null), [child]);
  // C-12b — THE FEET in the unfolding's order: the sources' apexes as the page stands them (C above, D below — the designer's 1939 §1)
  const feetInOrder = useMemo(() => {
    const order = [...new Set(site.sources.flatMap((s) => s.apexes))];
    const placed = order.flatMap((c) => resolved.feet.filter((f) => f.corner === c));
    return [...placed, ...resolved.feet.filter((f) => !order.includes(f.corner))];
  }, [resolved, site]);
  const apexesInOrder = useMemo(() => [...new Set(site.sources.flatMap((s) => s.apexes))], [site]);
  // C-7f item 3 — a pair the store RE-MADE when the person withdrew the half they judged wrong says so: the act being honoured is the person's earlier one
  const remadeNote = (kind2: 'role' | 'word', pair: [string, string]): string | null =>
    remade && remade.act.kind === kind2 && remade.act.pair[0] === pair[0] && remade.act.pair[1] === pair[1] ? `re-made when you withdrew ${remade.withdrawn.kind === 'role' ? `${nA(remade.withdrawn.pair[0])} ≡ ${nB(remade.withdrawn.pair[1])}` : `${remade.withdrawn.pair[0]} ≡ ${remade.withdrawn.pair[1]}`}` : null;

  // the geometry: two columns in one drawing, the fold between them; in a light, THREE — A · the corner · B (LAYOUT-1 §4)
  // MARKER LAYOUT-1 · M12 (8): THE DRAWING FITS ITS PANE — `fitInsideLayout` lays the columns out to the pane's width, measured here by a
  // ResizeObserver on the drawing's container (and once at mount), so the divider's move in a light and a window's resize both re-lay it.
  const [drawingWidth, setDrawingWidth] = useState<number | null>(null);
  const drawingObserver = useRef<ResizeObserver | null>(null);
  const observeDrawing = useCallback((el: HTMLDivElement | null): void => {
    drawingObserver.current?.disconnect();
    drawingObserver.current = null;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setDrawingWidth(el.clientWidth));
    ro.observe(el);
    drawingObserver.current = ro;
    setDrawingWidth(el.clientWidth);
  }, []);
  const layout = useMemo(() => fitInsideLayout(insideA, insideB, lightInside, drawingWidth !== null ? drawingWidth - 2 : null), [insideA, insideB, lightInside, drawingWidth]);
  const { g0A, g0L, gA, gL, gB, width } = layout;
  // the designer's 12:12 (3): where the layout's floors (a word never broken, a lane never narrower than its longest label) leave the drawing wider
  // than its pane — in a light, three columns of long names — it SCALES to the pane, uniformly, and never scrolls sideways; marked only when it does
  const fitScale = drawingWidth !== null && width > drawingWidth - 2 ? (drawingWidth - 2) / width : 1;
  const foldX = gL ? gL.px : gA.px + g0A.rightReach + layout.fold / 2;
  const columnsBottom = Math.max(gA.top + gA.height, gB.top + gB.height, gL ? gL.top + gL.height : 0);
  const height = columnsBottom + 64;
  const mY = columnsBottom + 30;

  const onPoint = (side: Side, role: string): void => {
    if (light !== null) { triadPickAt(side === 'A' ? site.a : site.b, role); return; } // in a light, a column pick is the triad's
    if (pick && pick.side === side && pick.role === role) {
      setPick(null);
      return;
    }
    if (pick && pick.side !== side) {
      const [x, y] = side === 'B' ? [pick.role, role] : [role, pick.role];
      // B5: in IS the two picks are the pairing (the typed record, as before); in another mode, or barred, they are a relating
      if (mode === IS && !barNext) giveRolePair(edgeId, x, y);
      else giveRelating(edgeId, mode, x, y, barNext ? '-' : '+', dir);
      setPick(null);
      return;
    }
    setPick({ side, role });
  };
  const onWord = (side: Side, word: string): void => {
    if (light !== null) { wordTriadPickAt(side === 'A' ? site.a : site.b, word); return; } // in a light, a row's word is the word triad's
    if (wordPick && wordPick.side === side && wordPick.word === word) {
      setWordPick(null);
      return;
    }
    if (wordPick && wordPick.side !== side) {
      if (side === 'B') giveWordPair(edgeId, wordPick.word, word);
      else giveWordPair(edgeId, word, wordPick.word);
      setWordPick(null);
      return;
    }
    setWordPick({ side, word });
  };
  // C-14 f — THE TRIAD: a pick in the opened corner's light — A's column, B's column, the corner's column, any order; the third pick
  // makes the act (the store's `giveTriad`, atomic); the same point again unpicks; the attempt withdrawn by its one hand
  const triadPickAt = (corner: VertexId, item: string): void => {
    if (lightFace === null || light === null) return;
    const next: Record<VertexId, string> = { ...triadPicks };
    if (next[corner] === item) delete next[corner];
    else next[corner] = item;
    const a = next[site.a]; const b = next[site.b]; const c = next[light];
    if (a !== undefined && b !== undefined && c !== undefined) {
      giveTriad(lightFace, 'role', [{ corner: site.a, item: a }, { corner: site.b, item: b }, { corner: light, item: c }]);
      setTriadPicks({});
      return;
    }
    setTriadPicks(next);
  };
  const wordTriadPickAt = (corner: VertexId, item: string): void => {
    if (lightFace === null || light === null) return;
    const next: Record<VertexId, string> = { ...wordTriadPicks };
    if (next[corner] === item) delete next[corner];
    else next[corner] = item;
    const a = next[site.a]; const b = next[site.b]; const c = next[light];
    if (a !== undefined && b !== undefined && c !== undefined) {
      giveTriad(lightFace, 'word', [{ corner: site.a, item: a }, { corner: site.b, item: b }, { corner: light, item: c }]);
      setWordTriadPicks({});
      return;
    }
    setWordTriadPicks(next);
  };
  const withdrawTriadOf = (corner: VertexId, kind2: 'role' | 'word', tuple: RespectTuple): void => {
    const src = site.sources.find((s) => s.apexes.includes(corner));
    if (!src) return;
    withdrawTriad(src.faceId, kind2, [{ corner: site.a, item: tuple[0] }, { corner: site.b, item: tuple[1] }, { corner, item: tuple[2] }]);
  };
  // LAYOUT-1 §4: in a light the pairing takes three columns and the point pane narrows (its diagram is one column: it needs height, not width);
  // the divider moves and goes back to its place when the light closes (measured at the eye: at 57% the third column ran off the pane's edge)
  const openLight = (apex: VertexId | null): void => { setLight(apex); setTriadPicks({}); setWordTriadPicks({}); setPick(null); setWordPick(null); setSplit(apex === null ? 0.57 : 0.74); setTab(apex === null ? 'point' : 'light'); setBatchIndex(0); setBoxDrafts({}); setExtraLines({}); }; // THE-ALTITUDE: the light opens on its roles' tab (the designer's §2) and closes back to the point
  // MODES-1 · M1 (the designer's §5.2, 2026-09-26): a light is opened AT a midpoint and FOR that midpoint — leaving the midpoint
  // closes it, with the picks made in it. The effect is keyed on the site alone.
  useEffect(() => {
    setLight(null);
    setTriadPicks({});
    setWordTriadPicks({});
    setPick(null);
    setWordPick(null);
    setMode(IS);
    setBarNext(false);
    setDir(ALONG);
    setHover(null);
    setNaming(false);
    setTab('point');
    setSplit(0.57);
  }, [site.siteId]);
  // THE-ALTITUDE · slice 3 (the designer's §8; her 14:36 (2)): a light asked for at this site (a face's `open`) is taken AFTER the reset above — both run in
  // the commit that brings a new site, in this order, so the light the request opens is the light that stays open, on its roles tab
  useEffect(() => { if (lightRequest && lightRequest.siteId === site.siteId) { takeLightRequest(); openLight(lightRequest.apex); } }, [lightRequest, site.siteId]); // eslint-disable-line react-hooks/exhaustive-deps -- openLight is this render's
  // LAYOUT-1 §2 — Esc closes the smallest thing first: a ? note takes it before this (capture); then a light; then the midpoint
  useEffect(() => {
    if (!full) return undefined;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key !== 'Escape') return;
      if (naming) { setNaming(false); return; }
      if (light !== null) { openLight(null); return; }
      selectVertex(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });
  // LAYOUT-1 §5 — the hover: a point lights its outgoing relations at once, the incoming ones a moment later; leaving restores everything
  useEffect(() => {
    if (hoverTimer.current !== null) { window.clearTimeout(hoverTimer.current); hoverTimer.current = null; }
    setHoverIn(false);
    if (hover && hover.kind === 'point') hoverTimer.current = window.setTimeout(() => setHoverIn(true), 600);
    return () => { if (hoverTimer.current !== null) window.clearTimeout(hoverTimer.current); };
  }, [hover]);
  // the divider drag (LAYOUT-1 §4): while a light is open the person may move it; it goes back when the light closes
  const paneRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!full) return undefined;
    const move = (e: MouseEvent): void => { if (!dragging.current || !paneRef.current) return; const r = paneRef.current.getBoundingClientRect(); setSplit(Math.min(0.8, Math.max(0.3, (e.clientX - r.left) / r.width))); };
    const up = (): void => { dragging.current = false; };
    window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  }, [full]);

  // ── THE DRAWING'S LINES (§5): the pairs, the relatings, the bars on A–B; in a light the legs' on A–C and C–B ──
  const pairedA = new Set(roles.map(([x]) => x));
  const pairedB = new Set(roles.map(([, y]) => y));
  const indexIn = (inside: Inside, id: string): number => inside.points.findIndex((p) => p.id === id);
  const drawn: DrawnLine[] = [];
  const pairLines = roles.map(([x, y]) => ({ x, y, iA: indexIn(insideA, x), iB: indexIn(insideB, y) }));
  // the numbers belong to DRAWN pairs (the designer's 16:26 §2); a pair kept from before — an old record's pair between roles no column
  // offers — is listed unnumbered with its withdraw, drawn nowhere, counted nowhere (the mothership's ruling 1, 16:18)
  const drawnIndex = new Map<string, number>();
  pairLines.forEach((l) => { if (l.iA >= 0 && l.iB >= 0) drawnIndex.set(`${l.x}|${l.y}`, drawnIndex.size + 1); });
  pairLines.forEach((l) => {
    if (l.iA < 0 || l.iB < 0) return;
    drawn.push({ key: `pair|${l.x}|${l.y}`, kind: 'pair', from: { g: gA, index: l.iA, column: 'A', id: l.x }, to: { g: gB, index: l.iB, column: 'B', id: l.y }, word: null, index: drawnIndex.get(`${l.x}|${l.y}`) as number, faint: light !== null, attrs: { 'data-midpoint-line': `${l.x}≡${l.y}`, ...(remadeNote('role', [l.x, l.y]) ? { 'data-midpoint-remade': remadeNote('role', [l.x, l.y]) as string } : {}) } });
  });
  const relatingKey = (r: Relating): string => `${r[0]}|${r[1]}|${r[2]}${dirOf(r) === ALONG ? '' : '|←'}`;
  const pushRelating = (r: Relating, bar: boolean, from: { g: InsideGeometry; inside: Inside; column: 'A' | 'B' | 'L' }, to: { g: InsideGeometry; inside: Inside; column: 'A' | 'B' | 'L' }, faint: boolean, attr: string): void => {
    const iX = indexIn(from.inside, r[1]); const iY = indexIn(to.inside, r[2]);
    if (iX < 0 || iY < 0) return;
    const subjectFirst = r[0] === IS || dirOf(r) === ALONG;
    const x = { g: from.g, index: iX, column: from.column, id: r[1] }; const y = { g: to.g, index: iY, column: to.column, id: r[2] };
    drawn.push({ key: `${bar ? 'bar' : 'rel'}|${attr}|${relatingKey(r)}`, kind: r[0] === IS ? (bar ? 'bar' : 'pair') : bar ? 'bar' : 'relating', from: subjectFirst ? x : y, to: subjectFirst ? y : x, word: r[0] === IS ? '≡' : r[0], faint, attrs: { [bar ? 'data-midpoint-bar-line' : 'data-midpoint-relating-line']: `${attr}|${relatingKey(r)}` } });
  };
  modeActs.relatings.forEach((r) => pushRelating(r, false, { g: gA, inside: insideA, column: 'A' }, { g: gB, inside: insideB, column: 'B' }, light !== null, 'AB'));
  modeActs.bars.forEach((b) => pushRelating(b, true, { g: gA, inside: insideA, column: 'A' }, { g: gB, inside: insideB, column: 'B' }, light !== null, 'AB'));
  if (light !== null && gL && lightInside && legEdges) {
    const leg = (e: Edge | null, tag: string, endpoints: (e2: Edge) => [{ g: InsideGeometry; inside: Inside; column: 'A' | 'B' | 'L' }, { g: InsideGeometry; inside: Inside; column: 'A' | 'B' | 'L' }]): void => {
      if (!e) return;
      const [u, v] = endpoints(e);
      for (const r of instancesOn(e)) pushRelating(r, false, u, v, false, tag);
      for (const b of barsOn(e)) pushRelating(b, true, u, v, false, tag);
    };
    const colA = { g: gA, inside: insideA, column: 'A' as const }; const colB = { g: gB, inside: insideB, column: 'B' as const }; const colL = { g: gL, inside: lightInside, column: 'L' as const };
    leg(legEdges.ac, 'AL', (e) => (e.vertexIds[0] === site.a ? [colA, colL] : [colL, colA]));
    leg(legEdges.cb, 'LB', (e) => (e.vertexIds[0] === light ? [colL, colB] : [colB, colL]));
    // STAMP THE-ALTITUDE · slice 1 (the designer's §2): each saying from a role of the light is drawn with §5's glyph in the light's own colour —
    // the head at the end's role, the word at the middle; one that does not hold dashed with its word struck; the lines appear as he records
    if (lightFace !== null) {
      const alt = altitudeOf(shape, lightFace, light);
      const eA = alt ? endSlotOf(alt.face, site.a) : -1; const eB = alt ? endSlotOf(alt.face, site.b) : -1;
      for (const s of alt ? sayingsOf(alt.entries) : []) {
        const iZ = indexIn(lightInside, s[1]);
        // M2 — the saying's END is in its record, by slot: the line runs to that end's column, never to a column guessed from the role's id
        const end = s[3] === eA ? { g: gA, index: indexIn(insideA, s[4]), column: 'A' as const } : s[3] === eB ? { g: gB, index: indexIn(insideB, s[4]), column: 'B' as const } : null;
        if (iZ < 0 || !end || end.index < 0) continue;
        drawn.push({ key: `alt|${s[1]}|${s[2]}|${s[3]}|${s[4]}`, kind: 'altitude', denied: signOf(s) === '-', from: { g: gL, index: iZ, column: 'L', id: s[1] }, to: { g: end.g, index: end.index, column: end.column, id: s[4] }, word: s[2], attrs: { 'data-altitude-drawn': `${s[1]}|${s[2]}|${s[3]}|${s[4]}`, 'data-altitude-drawn-sign': signOf(s) } });
      }
    }
  }
  const refusedLine = refusal && refusal.act.kind === 'role' ? (() => { const [x, y] = refusal.act.pair; const iA = indexIn(insideA, x); const iB = indexIn(insideB, y); return iA >= 0 && iB >= 0 ? { x, y, iA, iB } : null; })() : null;
  // the hover's reach (§5): a hovered line lights itself; a hovered point its lines going out (then, a moment later, coming in); a pair at once
  const lit = (l: DrawnLine): boolean => {
    if (!hover) return false;
    if (hover.kind === 'line') return hover.key === l.key;
    if (hover.kind === 'point') {
      const at = (end: DrawnLine['from']): boolean => end.column === hover.column && end.id === hover.id;
      return l.kind === 'pair' ? at(l.from) || at(l.to) : at(l.from) || (hoverIn && at(l.to));
    }
    if (hover.kind === 'child') { const names = [nA(l.from.id), nB(l.to.id), nA(l.to.id), nB(l.from.id)]; return names.some((n) => hover.label.includes(n)); }
    return false;
  };
  const insideOfColumn = (column: 'A' | 'B' | 'L'): Inside | null => (column === 'A' ? insideA : column === 'B' ? insideB : lightInside);
  // LAYOUT-1 §5 on a cast's own arcs: a hovered arc (or its word) lights itself and its two points; a hovered point lights the arcs going
  // out from it, a moment later the ones coming in — the same rule as the lines across the fold
  const arcLit = (column: 'A' | 'B' | 'L', i: number): boolean => {
    if (!hover) return false;
    const ins = insideOfColumn(column);
    if (!ins) return false;
    if (hover.kind === 'arc') return hover.column === column && hover.i === i;
    if (hover.kind === 'point') return hover.column === column && (ins.points[ins.arcs[i].from].id === hover.id || (hoverIn && ins.points[ins.arcs[i].to].id === hover.id));
    return false;
  };
  const litPoint = (column: 'A' | 'B' | 'L', id: string): boolean => {
    if (!hover) return false;
    if (hover.kind === 'arc') { const ins = insideOfColumn(hover.column); const a = ins ? ins.arcs[hover.i] : null; return hover.column === column && a !== null && ins !== null && (ins.points[a.from].id === id || ins.points[a.to].id === id); }
    if (hover.kind === 'point') return (hover.column === column && hover.id === id) || drawn.some((l) => lit(l) && ((l.from.column === column && l.from.id === id) || (l.to.column === column && l.to.id === id))) || (insideOfColumn(column)?.arcs.some((a, i) => arcLit(column, i) && (insideOfColumn(column)?.points[a.from].id === id || insideOfColumn(column)?.points[a.to].id === id)) ?? false);
    if (hover.kind === 'line') return drawn.some((l) => l.key === hover.key && ((l.from.column === column && l.from.id === id) || (l.to.column === column && l.to.id === id)));
    if (hover.kind === 'child') { const n = column === 'A' ? nA(id) : column === 'B' ? nB(id) : nL(id); return hover.label.includes(n); }
    return false;
  };
  // STAMP MODES-3 · M2 (the designer's 11:00 §2, ratified §219): in IS at a CORNER SITE — a seed corner and its child midpoint — while
  // the first pick stands, a point the act could only refuse is NOT OFFERED (no hand, no pointer) and says why beside its label: a role
  // picked first → every relating that holds it, `holds F7 already`; a relating picked first → each role it holds, `in it already`. ONE
  // predicate for both directions: the born corner's instance HOLDS a seed role when that role is its coordinate on the shared corner
  // (`instancesFrom`, D14). The notes leave with the pick; in any other mode the pair is an ordinary entry (§9.10).
  const cornerSite = useMemo(() => {
    const sa = shape.vertices[site.a]?.createdBy.operation === 'seed';
    const sb = shape.vertices[site.b]?.createdBy.operation === 'seed';
    return sa === sb ? null : sa ? { seed: 'A' as Side, born: 'B' as Side } : { seed: 'B' as Side, born: 'A' as Side };
  }, [shape, site.a, site.b]);
  const holdsOn = useMemo(() => {
    const m = new Map<string, string>(); // a born corner's instance key → the seed role it holds (its coordinate on the shared corner)
    if (!cornerSite) return m;
    const seedId = cornerSite.seed === 'A' ? site.a : site.b;
    const bornId = cornerSite.born === 'A' ? site.a : site.b;
    const bv = shape.vertices[bornId];
    if (!bv || bv.createdBy.sourceVertexIds.length !== 2) return m;
    const [P, Q] = bv.createdBy.sourceVertexIds;
    for (const i of instancesFrom(shape, P, Q)) { if (P === seedId) m.set(i.key, i.p); else if (Q === seedId) m.set(i.key, i.q); }
    return m;
  }, [shape, cornerSite, site.a, site.b]);
  const notOfferedNote = (side: Side, id: string): string | null => {
    if (!cornerSite || pick === null || pick.side === side || mode !== IS || barNext || light !== null) return null;
    if (pick.side === cornerSite.seed) return holdsOn.get(id) === pick.role ? `holds ${pick.side === 'A' ? nA(pick.role) : nB(pick.role)} already` : null;
    return holdsOn.get(pick.role) === id ? 'in it already' : null;
  };
  const pointExtra = (side: Side) => (point: { id: string }): PointExtra => {
    // the composed mark of C-8 item 3 is RETIRED with the born room (STAMP MODES-3): no point of a column is the solid's any more
    const column = side === 'A' ? 'A' : 'B';
    const dim = hover !== null && !litPoint(column, point.id);
    const note = notOfferedNote(side, point.id);
    if (note !== null) return { solid: true, dim, note, attrs: { 'data-midpoint-side': side, 'data-midpoint-not-offered': note } };
    return {
      onClick: () => onPoint(side, point.id),
      onHover: (over) => setHover(over ? { kind: 'point', column, id: point.id, name: side === 'A' ? nA(point.id) : nB(point.id) } : null),
      emphasis: (pick !== null && pick.side === side && pick.role === point.id) || (side === 'A' ? pairedA.has(point.id) : pairedB.has(point.id)) || (light !== null && triadPicks[side === 'A' ? site.a : site.b] === point.id),
      lit: hover !== null && litPoint(column, point.id),
      dim,
      attrs: {
        'data-midpoint-side': side,
        ...(pick && pick.side === side && pick.role === point.id ? { 'data-midpoint-picked': 'true' } : {}),
        ...(light !== null && triadPicks[side === 'A' ? site.a : site.b] === point.id ? { 'data-midpoint-triad-picked': 'true' } : {}),
        ...((side === 'A' ? pairedA.has(point.id) : pairedB.has(point.id)) ? { 'data-midpoint-paired': 'true' } : {}),
      },
    };
  };
  // C-7b / COPY-1 §5.3 (`≡` unchanged: the tuple is one in both) — a tuple in BOTH parents THROUGH THE PERSON'S ACT wears `≡` in both columns;
  // a tuple in both BECAUSE THE SOLID MADE IT SO (every term a composed role, its word composed or the mold's) is the solid's: no glyph, the grey
  // STAMP MODES-3: the `≡` both-mark (a tuple one in both THROUGH HIS ACT, C-7b) is the glue's reading over two seed casts — generation 1; at a
  // born corner's column the glue's keys coincide with the child's by accident and would mark the SOLID's identity under his act's glyph (one
  // glyph, one meaning; M5: what holds through the shared corner is never drawn) — so the mark is read only when both corners are seeds
  const bothCornersSeeds = shape.vertices[site.a]?.createdBy.operation === 'seed' && shape.vertices[site.b]?.createdBy.operation === 'seed';
  const bothExtra = (side: Side, inside: Inside) => {
    const column = side === 'A' ? 'A' : 'B';
    const dimArc = (terms: string[]): boolean => hover !== null && !(hover.kind === 'arc' ? false : terms.some((t) => litPoint(column, t)));
    const origin = (type: string, terms: string[]): MarkExtra | null => {
      const dim = dimArc(terms);
      if (bothCornersSeeds && M?.originOf[side].get(`${type}|${JSON.stringify(terms)}`) === 'both') {
        return { emphasis: true, glyph: '≡', dim, attrs: { 'data-midpoint-both': side } };
      }
      return dim ? { dim } : null;
    };
    return {
      arc: (arc: { type: string; from: number; to: number }): MarkExtra => {
        const i = inside.arcs.indexOf(arc as InsideArc);
        const on = arcLit(column, i);
        return { ...(origin(arc.type, [inside.points[arc.from].id, inside.points[arc.to].id]) ?? {}), lit: hover !== null && on, dim: hover !== null && !on, onHover: (over) => setHover(over ? { kind: 'arc', column, i } : null) };
      },
      loop: (loop: { type: string; at: number }) => origin(loop.type, [inside.points[loop.at].id, inside.points[loop.at].id]),
      node: (node: { type: string; legs: number[] }) => origin(node.type, node.legs.map((i) => inside.points[i].id)),
    };
  };
  const extraA = bothExtra('A', insideA);
  const extraB = bothExtra('B', insideB);
  const lightPointExtra = (point: { id: string }): PointExtra => ({
    onClick: () => { if (light !== null) triadPickAt(light, point.id); },
    onHover: (over) => setHover(over ? { kind: 'point', column: 'L', id: point.id, name: nL(point.id) } : null),
    emphasis: light !== null && triadPicks[light] === point.id,
    lit: hover !== null && litPoint('L', point.id),
    dim: hover !== null && !litPoint('L', point.id),
    attrs: { 'data-midpoint-light-point': light ?? '', ...(light !== null && triadPicks[light] === point.id ? { 'data-midpoint-light-picked': 'true' } : {}) },
  });
  const childPointExtra = (point: InsidePoint): PointExtra => {
    const label = point.label ?? point.id;
    const on = hover !== null && (hover.kind === 'child' ? hover.label === label : hover.kind === 'point' ? label.includes(hover.name) : false);
    return { onHover: (over) => setHover(over ? { kind: 'child', label } : null), lit: on, dim: hover !== null && !on, attrs: { 'data-midpoint-child-point': label } };
  };
  const acts = refusal ? actsOfRefusal(refusal, roles, types) : [];
  const withdrawAct = (kind2: 'role' | 'word', pair: [string, string]): void => {
    if (kind2 === 'role') withdrawRolePair(edgeId, pair[0], pair[1]);
    else withdrawWordPair(edgeId, pair[0], pair[1]);
  };
  const wordChip = (side: Side, w: string): string => {
    const picked = (wordPick?.side === side && wordPick.word === w) || (light !== null && wordTriadPicks[side === 'A' ? site.a : site.b] === w);
    const translated = side === 'A' ? types.some(([s]) => s === w) : types.some(([, t]) => t === w);
    return `rounded border px-1.5 py-0.5 text-xs transition hover:border-amber-300 hover:text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-300 ${picked ? 'border-amber-300 bg-amber-400/10 text-amber-200' : translated ? 'border-amber-700 text-amber-200' : 'border-stone-600 bg-stone-900 text-stone-200'}`;
  };
  // THE REFUSAL (COPY-1 §4.3): one grammar — `not taken —` then what is in the way, then the buttons; the pair a button acts on is data
  const dep = refusal?.dependency ?? null;
  const depSite = dep ? (dep.siteId !== null ? labelOf(shape, dep.siteId) : `the edge ${(() => { const e = shape.edges.find((x) => x.id === dep.edgeId); return e ? `${labelOf(shape, e.vertexIds[0])}–${labelOf(shape, e.vertexIds[1])}` : 'it comes from'; })()}`) : '';
  const depGens = dep ? (dep.generationsUp === 0 ? 'the same generation' : dep.generationsUp > 0 ? `${dep.generationsUp === 1 ? 'one generation' : `${dep.generationsUp} generations`} up` : `${-dep.generationsUp === 1 ? 'one generation' : `${-dep.generationsUp} generations`} down`) : '';
  const depAct = refusal && dep
    ? refusal.act.kind === 'role'
      ? refusal.act.withdrawal ? `withdrawing ${pairWords('role', refusal.act.pair)}` : `pairing ${nA(refusal.act.pair[0])} with ${nB(refusal.act.pair[1])}`
      : refusal.act.withdrawal ? `withdrawing ${pairWords('word', refusal.act.pair)}` : `translating ${refusal.act.pair[0]} as ${refusal.act.pair[1]}`
    : '';
  // the dependency's two names through the one reader of a term's words (a generation-2 point as its sentence, `(r2 ≡ F1)`); an id no
  // child holds (an old record's) keeps the resolver's name
  const depName = (i: 0 | 1): string => {
    if (!dep) return '';
    const e = shape.edges.find((x) => x.id === dep.edgeId);
    if (!e) return dep.names[i];
    const w = termWordsOf(shape, e.vertexIds[i], dep.act.pair[i]);
    return w === dep.act.pair[i] ? dep.names[i] : w;
  };
  // the dependency said as he said it: a pair `X ≡ Y`; a relating in a mode `X w Y` (`Y w X` from the second corner)
  const depSaid = (): string => (!dep ? '' : dep.mode && dep.mode !== IS ? (dep.reversed ? `${depName(1)} ${dep.mode} ${depName(0)}` : `${depName(0)} ${dep.mode} ${depName(1)}`) : `${depName(0)} ≡ ${depName(1)}`);
  const solidOpen = refusal?.solid?.open ?? null;
  const solidEdgeWords = refusal?.solid?.edge ? `${labelOf(shape, refusal.solid.edge[0])}–${labelOf(shape, refusal.solid.edge[1])}` : null;
  const refusalBox = refusal ? (
    <div data-midpoint-refusal={`${refusal.act.kind}|${refusal.act.pair[0]}|${refusal.act.pair[1]}`} data-midpoint-refusal-dependency={dep ? `${dep.edgeId}|${dep.act.pair[0]}|${dep.act.pair[1]}|${dep.generationsUp}` : undefined} data-midpoint-refusal-solid={refusal.solid ? `${refusal.solid.role}|${refusal.solid.others[0]}|${refusal.solid.others[1]}|${refusal.solid.paired ? 'paired' : 'unpaired'}` : undefined} className="my-1 rounded border border-rose-900 bg-rose-950/30 px-2 py-1 text-rose-200">
      {dep ? (
        <>
          <span data-midpoint-refusal-act="true" data-midpoint-refusal-collision="true" className="block">{refusal.act.withdrawal
            ? `not taken — ${pairWords(refusal.act.kind, refusal.act.pair)} is one end of ${depSaid()} at ${depSite}, ${depGens}`
            : `not taken — ${depAct} would break ${dep.mode && dep.mode !== IS ? 'the relating' : 'the pair'} ${depSaid()} at ${depSite}, ${depGens}: ${dep.why}`}</span>
          <span className="mt-1 block text-stone-300">
            <button type="button" data-midpoint-withdraw={`attempt|${refusal.act.pair[0]}|${refusal.act.pair[1]}`} data-midpoint-withdraw-attempt="true" className="mr-3 underline" onClick={() => withdrawMidpointAttempt(edgeId)}>clear</button>
            <button type="button" data-midpoint-dependency-withdraw={`${dep.edgeId}|${dep.act.kind}|${dep.act.pair[0]}|${dep.act.pair[1]}`} className="mr-3 underline" onClick={() => (dep.mode && dep.mode !== IS ? withdrawRelating(dep.edgeId, dep.mode, dep.act.pair[0], dep.act.pair[1], dep.reversed ? AGAINST : ALONG) : dep.act.kind === 'role' ? withdrawRolePair(dep.edgeId, dep.act.pair[0], dep.act.pair[1]) : withdrawWordPair(dep.edgeId, dep.act.pair[0], dep.act.pair[1]))}>
              {`withdraw ${depSaid()} at ${depSite} first`}
            </button>
          </span>
        </>
      ) : null}
      {dep ? null : refusal.form ? (
        <span data-midpoint-refusal-form="true" className="block">{`not taken — ${refusal.form}`}</span>
      ) : (
        <span data-midpoint-refusal-act="true" className="block">{`not taken — with ${pairWords(refusal.act.kind, refusal.act.pair)}, ${la}'s and ${lb}'s records contradict each other`}</span>
      )}
      {refusal.conflicts.map((c, i) => (
        <span key={i} data-midpoint-conflict={conflictWords(c, la, lb)} className="block">{`conflict: ${conflictWords(c, la, lb)}`}</span>
      ))}
      {dep ? null : (
        <span className="mt-1 block text-stone-300">
          {acts.map((act) => (
            <span key={`${act.kind}|${act.pair.join('|')}`} className="mr-3">
              <button
                type="button"
                data-midpoint-withdraw={act.attempt ? `attempt|${act.pair[0]}|${act.pair[1]}` : `${act.kind}|${act.pair[0]}|${act.pair[1]}`}
                data-midpoint-withdraw-attempt={act.attempt ? 'true' : undefined}
                className="underline"
                onClick={() => (act.attempt ? withdrawMidpointAttempt(edgeId) : withdrawAct(act.kind, act.pair))}
              >
                {act.attempt ? 'clear' : `withdraw ${pairWords(act.kind, act.pair)}`}
              </button>
            </span>
          ))}
          {solidOpen && solidEdgeWords ? (
            <button type="button" data-midpoint-open-site={solidOpen} className="mr-3 underline" onClick={() => selectVertex(solidOpen)}>{`open ${solidEdgeWords}`}</button>
          ) : null}
        </span>
      )}
    </div>
  ) : null;

  // ── the medium's pieces share these props (B5 — the mode, the bar, the direction chosen here) ──
  const mediumProps = { shape, edge: sourceEdge, siteId: site.siteId, la, lb, options: {}, mode, setMode, bar: barNext, setBar: setBarNext, dir, setDir };
  const mediumAttrs = useMediumAttrs(mediumProps);

  // ── THE §4.4 SENTENCE (COPY-1) under the acts ──
  // generation 1's form at every generation (the designer's 16:26 §1): the pairs DRAWN between the columns and the word pairs; the old
  // generation-2 sentences (`… composed by the solid …`) went with the born room
  const sentence = state === 'glued'
    ? `${drawnIndex.size} ${drawnIndex.size === 1 ? 'role pair' : 'role pairs'} · ${types.length} ${types.length === 1 ? 'word pair' : 'word pairs'}`
    : state === 'record-in-conflict'
      ? `this edge's record contradicts itself${kind === 'medial' ? " under the solid's identity" : ''}; withdraw one of the pairs below`
      : null;

  const siteVertex = shape.vertices[site.siteId];
  const namedNow = !!siteVertex && isGeneratedMidpoint(siteVertex) && isChristened(siteVertex.data); // a christened concept: `rename · withdraw` (26)
  const nameIt = (
    naming ? (
      <span className="inline-flex items-center gap-1" data-midpoint-name-field="true">
        <input
          autoFocus
          onFocus={(e) => e.currentTarget.select()} // the designer's 14:36 (3): a name he gave opens selected whole — typing replaces it
          value={nameDraft}
          onChange={(e) => setNameDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { updateSelectedVertexData({ label: nameDraft.trim() }); setNaming(false); } }}
          placeholder="a name"
          className="w-36 rounded border border-stone-600 bg-stone-900 px-1 py-0.5 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-300"
        />
        <button type="button" data-midpoint-name-save="true" className="underline" onClick={() => { updateSelectedVertexData({ label: nameDraft.trim() }); setNaming(false); }}>name it</button>
      </span>
    ) : namedNow ? (
      // Virgin Land's 26 (the mothership's 19:37; the designer's 19:39): a name can be withdrawn — `rename` opens the field with the name selected whole,
      // `withdraw` takes the name back (the act logged as every naming is; the born label returns)
      <span className="inline-flex items-center gap-x-2">
        <button type="button" data-midpoint-name-it="true" className="underline text-stone-300" onClick={() => { setNameDraft(lm); setNaming(true); }}>rename</button>
        <span className="text-stone-400">·</span>
        <button type="button" data-midpoint-name-withdraw="true" className="underline text-stone-300" onClick={() => updateSelectedVertexData({ label: '' })}>withdraw</button>
      </span>
    ) : (
      <button type="button" data-midpoint-name-it="true" className="underline text-stone-300" onClick={() => { /* the designer's 14:36 (3): born is unnamed — a concept never named opens EMPTY, never holding its composed letters */ const sv = shape.vertices[site.siteId]; setNameDraft(sv && (!isGeneratedMidpoint(sv) || isChristened(sv.data)) ? lm : ''); setNaming(true); }}>name it</button>
    )
  );

  // ── THE DRAWING ──
  const lineEnds = (l: DrawnLine): { x1: number; y1: number; x2: number; y2: number } => ({ x1: l.from.g.px, y1: l.from.g.yOf(l.from.index), x2: l.to.g.px, y2: l.to.g.yOf(l.to.index) });
  // the designer's 13:40 (7) with her 13:41 clause: each word placed along its own line, clear of every other word, of the columns' role names and
  // points, and of the pairs' numbers — the middle first, so a drawing where nothing meets is drawn exactly as before
  const lineWordAt = (() => {
    const obstacles: ObstacleBox[] = [...columnObstacles(insideA, gA), ...columnObstacles(insideB, gB), ...(lightInside && gL ? columnObstacles(lightInside, gL) : [])];
    for (const l of drawn) if (l.kind === 'pair') { const e = lineEnds(l); const x = gL ? (e.x1 + e.x2) / 2 : foldX; const y = (e.y1 + e.y2) / 2 + 4; obstacles.push({ x0: x - 9, y0: y - 10, x1: x + 9, y1: y + 3 }); }
    return placeLineWords(drawn.filter((l) => l.kind !== 'pair' && l.word).map((l) => ({ key: l.key, ...lineEnds(l), word: l.word as string })), obstacles);
  })();
  const drawing = (
    <div ref={observeDrawing} data-midpoint-drawing-pane={drawingWidth ?? undefined} className="overflow-x-hidden">
      <svg data-midpoint-drawing="true" data-midpoint-drawing-scale={fitScale < 1 ? fitScale.toFixed(3) : undefined} data-midpoint-hover={hover ? (hover.kind === 'line' ? hover.key : hover.kind === 'point' ? `${hover.column}|${hover.id}` : hover.kind === 'arc' ? `${hover.column}|arc ${hover.i}` : hover.label) : undefined} width={Math.round(width * fitScale)} height={Math.round(height * fitScale)} viewBox={`0 0 ${width} ${height}`} className="block overflow-visible">
        <defs>
          {/* LAYOUT-1 §5: the open arrowhead at the object — one meaning everywhere: a relation from here to there */}
          <marker id={`head-${site.siteId}-ink`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M1,1 L7,4 L1,7" fill="none" className="stroke-stone-300" strokeWidth="1.2" /></marker>
          <marker id={`head-${site.siteId}-faint`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M1,1 L7,4 L1,7" fill="none" className="stroke-stone-500" strokeWidth="1.2" /></marker>
          <marker id={`head-${site.siteId}-lit`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M1,1 L7,4 L1,7" fill="none" className="stroke-stone-50" strokeWidth="1.4" /></marker>
          {/* THE-ALTITUDE: the head in the light's colour, the one only a light uses (LAYOUT-1 §5) */}
          <marker id={`head-${site.siteId}-light`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M1,1 L7,4 L1,7" fill="none" className="stroke-violet-300" strokeWidth="1.2" /></marker>
        </defs>
        <text x={gA.px} y={14} textAnchor="middle" fontSize={12} className="fill-stone-100">{la}</text>
        {gL ? <text x={gL.px} y={14} textAnchor="middle" fontSize={12} className="fill-violet-200">{lightLabel}</text> : null}
        <text x={gB.px} y={14} textAnchor="middle" fontSize={12} className="fill-stone-100">{lb}</text>
        {gL ? null : <line x1={foldX} y1={TOP} x2={foldX} y2={columnsBottom} className="stroke-stone-800" strokeDasharray="2 4" />}
        <InsideColumn inside={insideA} geometry={gA} idPrefix={`m-${site.siteId}-a`} arcExtra={extraA.arc} loopExtra={extraA.loop} nodeExtra={extraA.node} pointExtra={pointExtra('A')} />
        {gL && lightInside ? (
          // LAYOUT-1 §5: a light's middle column in a colour used nowhere else on the page
          <g data-midpoint-light-column={light ?? undefined} className="[&_circle]:fill-violet-300 [&_circle]:stroke-violet-100 [&_.fill-stone-100]:fill-violet-100 [&_.fill-stone-300]:fill-violet-200 [&_path]:stroke-violet-300/70">
            <InsideColumn inside={lightInside} geometry={gL} idPrefix={`m-${site.siteId}-l`} arcExtra={(arc) => { const i = lightInside.arcs.indexOf(arc); const on = arcLit('L', i); return { lit: hover !== null && on, dim: hover !== null && !on, onHover: (over) => setHover(over ? { kind: 'arc', column: 'L', i } : null) }; }} pointExtra={lightPointExtra} />
          </g>
        ) : null}
        <InsideColumn inside={insideB} geometry={gB} idPrefix={`m-${site.siteId}-b`} arcExtra={extraB.arc} loopExtra={extraB.loop} nodeExtra={extraB.node} pointExtra={pointExtra('B')} />
        {drawn.map((l) => {
          const e = lineEnds(l);
          const isLit = lit(l);
          const dimmed = hover !== null && !isLit;
          const opacity = dimmed ? 0.2 : l.faint ? 0.45 : 1;
          const mx = (e.x1 + e.x2) / 2; const my = (e.y1 + e.y2) / 2;
          const head = l.kind === 'pair' ? undefined : l.kind === 'altitude' ? `url(#head-${site.siteId}-light)` : `url(#head-${site.siteId}-${isLit ? 'lit' : l.kind === 'bar' || l.faint ? 'faint' : 'ink'})`;
          return (
            <g key={l.key} {...l.attrs} data-midpoint-line-kind={l.kind} opacity={opacity} onPointerEnter={() => setHover({ kind: 'line', key: l.key })} onPointerLeave={() => setHover(null)}>
              <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} className={l.kind === 'pair' ? 'stroke-amber-300/90' : l.kind === 'altitude' ? (isLit ? 'stroke-violet-100' : 'stroke-violet-300') : isLit ? 'stroke-stone-50' : l.kind === 'bar' ? 'stroke-stone-500/70' : 'stroke-stone-300'} strokeWidth={l.kind === 'pair' ? 1.6 : isLit ? 1.6 : 1} strokeDasharray={l.kind === 'bar' || (l.kind === 'altitude' && l.denied) ? '5 4' : undefined} markerEnd={head} />
              {l.kind === 'pair' ? (
                // the pair's number at the fold's height, no head (a pair has no direction)
                <text data-midpoint-line-index={String(l.index)} x={gL ? mx : foldX} y={my + 4} textAnchor="middle" fontSize={11} className="fill-amber-200" style={{ paintOrder: 'stroke', stroke: '#0c0a09', strokeWidth: 2.5, strokeLinejoin: 'round' }}>{String(l.index)}</text>
              ) : (
                // the mode's word on a small backing at the middle; a bar's struck through
                <text data-midpoint-line-word={l.word ?? ''} x={lineWordAt.get(l.key)?.x ?? mx} y={lineWordAt.get(l.key)?.y ?? my - 4} textAnchor="middle" fontSize={11} className={l.kind === 'altitude' ? (isLit ? 'fill-violet-100' : 'fill-violet-200') : isLit ? 'fill-stone-50' : l.kind === 'bar' ? 'fill-stone-400' : 'fill-stone-200'} style={{ paintOrder: 'stroke', stroke: '#0c0a09', strokeWidth: 3, strokeLinejoin: 'round', textDecoration: l.kind === 'bar' || (l.kind === 'altitude' && l.denied) ? 'line-through' : undefined }}>{l.word}</text>
              )}
            </g>
          );
        })}
        {refusedLine ? (
          // the REFUSED pair, where it was made: a dashed rose line across the fold; its words in the listing below
          <g data-midpoint-refused-line={`${refusedLine.x}≡${refusedLine.y}`}>
            <line x1={gA.px} y1={gA.yOf(refusedLine.iA)} x2={gB.px} y2={gB.yOf(refusedLine.iB)} className="stroke-rose-400/90" strokeWidth={1.6} strokeDasharray="5 4" />
          </g>
        ) : null}
        {/* the midpoint on the fold, and the parent→child lines */}
        <circle cx={foldX} cy={mY} r={5} className="fill-amber-300 stroke-amber-100" />
        <text x={foldX} y={mY + 18} textAnchor="middle" fontSize={12} className="fill-stone-100">{lm}</text>
        <line x1={gA.px} y1={columnsBottom + 4} x2={foldX - 8} y2={mY - 2} className="stroke-stone-600" />
        <line x1={gB.px} y1={columnsBottom + 4} x2={foldX + 8} y2={mY - 2} className="stroke-stone-600" />
      </svg>
    </div>
  );

  // ── THE WORDS HALF: the two word rows (and the light's), the chips his picks; a chip never changes size when picked ──
  const wordRows = (
    <div data-midpoint-word-half="true" className="my-1 grid gap-1">
      <div data-midpoint-words="A" className="flex flex-wrap items-center gap-1">
        <span className="mr-1 text-stone-400">{`${la}'s words`}</span>
        {/* STAMP MODES-3: a chip carries the word's KEY (the act stores keys) and shows its WORDS (`wordWordsOf` — a child's `A:s` as `A's s`) */}
        {castA.signature.map((t) => t.type).map((w) => (
          <button key={w} type="button" data-midpoint-word={`A|${w}`} data-midpoint-word-translated={types.some(([s]) => s === w) ? 'true' : undefined} onClick={() => onWord('A', w)} className={wordChip('A', w)}>{wordWordsOf(shape, site.a, w)}</button>
        ))}
      </div>
      {light !== null && lightInside ? (
        <div data-midpoint-words="light" data-midpoint-light-words={lightLabel} className="flex flex-wrap items-center gap-1">
          <span className="mr-1 text-violet-200">{`${lightLabel}'s words`}</span>
          {lightInside.words.map((w) => (
            <button key={w} type="button" data-midpoint-light-word={w} data-midpoint-light-word-picked={wordTriadPicks[light] === w ? 'true' : undefined} onClick={() => wordTriadPickAt(light, w)} className={`rounded border px-1.5 py-0.5 text-xs transition hover:border-amber-300 hover:text-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-300 ${wordTriadPicks[light] === w ? 'border-amber-300 bg-amber-400/10 text-amber-200' : 'border-violet-800 bg-stone-900 text-violet-100'}`}>{w}</button>
          ))}
        </div>
      ) : null}
      <div data-midpoint-words="B" className="flex flex-wrap items-center gap-1">
        <span className="mr-1 text-stone-400">{`${lb}'s words`}</span>
        {castB.signature.map((t) => t.type).map((w) => (
          <button key={w} type="button" data-midpoint-word={`B|${w}`} data-midpoint-word-translated={types.some(([, t]) => t === w) ? 'true' : undefined} onClick={() => onWord('B', w)} className={wordChip('B', w)}>{wordWordsOf(shape, site.b, w)}</button>
        ))}
      </div>
    </div>
  );

  // ── HIS ACTS under the drawing (COPY-1 §4.4), one per line, each with its hand ──
  // STAMP THE-ALTITUDE · slice 1 (the designer's §5): each relating gains, on demand, `under T · show` — at each end the light's sayings there,
  // in full sentences, a denial as his sentence followed by `(doesn't hold)`, his words never inflected; nothing on the relating itself changes (D23).
  // The marks are read at each END by the role's id, so a pair kept from before — outside every reader of the child (MODES-3, ruling 1) — finds them too.
  // The hand stands only where the light's roles relate at one end at least (the designer's 12:12 (2): a hand that opens nothing marks the ordinary)
  const underHands = (r: Relating): ReactNode => (sorting ? sorting.views : []).filter((v) => !v.coordinate && v.altitude.sayings > 0).map((v) => {
    const lz = labelOf(shape, v.view);
    const k = `${relKey(r)}|${v.view}`;
    const vf = shape.faces.find((f) => f.id === v.faceId); const eA = vf ? endSlotOf(vf, site.a) : -1; const eB = vf ? endSlotOf(vf, site.b) : -1; // M2 — the cells are (end slot, role)
    const none = { present: [], denied: [] }; const mx = v.altitude.marks.get(markKey(eA, r[1])) ?? none; const my = v.altitude.marks.get(markKey(eB, r[2])) ?? none;
    if (mx.present.length + mx.denied.length + my.present.length + my.denied.length === 0) return null;
    const words = (end: VertexId, marks: { present: Array<{ z: string; w: string }>; denied: Array<{ z: string; w: string }> }): string => [...marks.present.map((mk) => `${nX(v.view, mk.z)} ${mk.w} ${nX(end, end === site.a ? r[1] : r[2])}`), ...marks.denied.map((mk) => `${nX(v.view, mk.z)} ${mk.w} ${nX(end, end === site.a ? r[1] : r[2])} (doesn't hold)`)].join(' · ');
    return (
      <span key={k} data-altitude-under={`${relKey(r)}|${lz}`} className="text-stone-400">
        {' · '}
        <span>{`under ${lz}`}</span>
        {' · '}
        <button type="button" data-altitude-under-show={`${relKey(r)}|${lz}`} data-altitude-under-shown={underShown[k] ? 'true' : undefined} className="underline" onClick={() => setUnderShown({ ...underShown, [k]: !underShown[k] })}>{underShown[k] ? 'hide' : 'show'}</button>
        {underShown[k] ? (
          <span data-altitude-under-lines={`${relKey(r)}|${lz}`} className="block pl-3 text-stone-300">
            <span className="block">{`at ${nA(r[1])}: ${words(site.a, mx) || 'nothing related yet'}`}</span>
            <span className="block">{`at ${nB(r[2])}: ${words(site.b, my) || 'nothing related yet'}`}</span>
          </span>
        ) : null}
      </span>
    );
  });
  // the list's head counts what it holds, as the state line counts them (the designer's 19:30): his relatings (the pairs drawn and kept, the relatings in a
  // mode) and his bars; with none, no head
  const actsRelatings = pairLines.length + modeActs.relatings.length;
  const actsBarsPart = modeActs.bars.length ? ' · ' + String(modeActs.bars.length) + (modeActs.bars.length === 1 ? ' bar' : ' bars') : '';
  const actsHead = actsRelatings + modeActs.bars.length === 0 ? null : String(actsRelatings) + (actsRelatings === 1 ? ' relating' : ' relatings') + actsBarsPart;
  const actsList = (
    <div data-midpoint-acts="true" className="my-1 grid gap-0.5 text-amber-200">
      {(state === 'glued' && pairLines.length > 0) || refusedLine || modeActs.relatings.length > 0 || modeActs.bars.length > 0 ? (
        <div data-midpoint-role-pairs="true" className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
          {pairLines.map((l) =>
            l.iA >= 0 && l.iB >= 0 ? (
              <span key={`${l.x}|${l.y}`} data-midpoint-line-listing={`${l.x}≡${l.y}`} data-midpoint-line-listing-index={String(drawnIndex.get(`${l.x}|${l.y}`))} data-midpoint-glued-by={byLights('role', [l.x, l.y]) ? 'lights' : 'plain'}>
                <span className="text-stone-400">{`${drawnIndex.get(`${l.x}|${l.y}`)} `}</span>
                {byLights('role', [l.x, l.y])
                  ? `${nA(l.x)} ≡ ${nB(l.y)} · glued: you gave it ${lightsWords}`
                  : (
                    <>
                      {`${nA(l.x)} ≡ ${nB(l.y)}${remadeNote('role', [l.x, l.y]) ? ` · ${remadeNote('role', [l.x, l.y])}` : ''} · `}
                      <button type="button" data-midpoint-withdraw={`role|${l.x}|${l.y}`} className="underline" onClick={() => withdrawRolePair(edgeId, l.x, l.y)}>withdraw</button>
                      {underHands([IS, l.x, l.y, '+'])}
                    </>
                  )}
              </span>
            ) : (
              // a pair kept from before (the mothership's ruling 1; the designer's 16:26 §2): his act, never erased, listed once with its hand — unnumbered, drawn nowhere
              <span key={`${l.x}|${l.y}`} data-midpoint-line-listing={`${l.x}≡${l.y}`} data-midpoint-kept="true">
                {`${nA(l.x)} ≡ ${nB(l.y)} · kept from before, not drawn · `}
                <button type="button" data-midpoint-withdraw={`role|${l.x}|${l.y}`} className="underline" onClick={() => withdrawRolePair(edgeId, l.x, l.y)}>withdraw</button>
                {underHands([IS, l.x, l.y, '+'])}
              </span>
            ),
          )}
          {refusedLine ? <span data-midpoint-refused-listing={`${refusedLine.x}≡${refusedLine.y}`} className="text-rose-300">{`${nA(refusedLine.x)} ≡ ${nB(refusedLine.y)} · not taken`}</span> : null}
          {/* MODES-4 · D13: each prints AS HE MADE IT — from A `x w y`, from B `y w x`; the entry's key carries `|←` where he made it from B */}
          {modeActs.relatings.map((r) => (
            <span key={relatingKey(r)} data-medium-relating={relatingKey(r)}>
              {`${dirOf(r) === ALONG ? `${nA(r[1])} ${r[0]} ${nB(r[2])}` : `${nB(r[2])} ${r[0]} ${nA(r[1])}`} · `}
              <button type="button" data-medium-withdraw={relatingKey(r)} className="underline" onClick={() => withdrawRelating(edgeId, r[0], r[1], r[2], dirOf(r))}>withdraw</button>
              {underHands(r)}
            </span>
          ))}
          {modeActs.bars.map((b) => (
            <span key={`${relatingKey(b)}|-`} data-medium-bar={relatingKey(b)}>
              {`${b[0] === IS ? `${nA(b[1])} ≡ ${nB(b[2])}` : dirOf(b) === ALONG ? `${nA(b[1])} ${b[0]} ${nB(b[2])}` : `${nB(b[2])} ${b[0]} ${nA(b[1])}`} · barred · `}
              <button type="button" data-medium-withdraw={relatingKey(b)} className="underline" onClick={() => withdrawRelating(edgeId, b[0], b[1], b[2], dirOf(b))}>withdraw</button>
            </span>
          ))}
        </div>
      ) : null}
      <div data-midpoint-word-pairs="true" className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
        {types.length ? types.map(([s, t]) => (
          <span key={`${s}|${t}`} data-midpoint-word-pair={`${s}≡${t}`} data-midpoint-remade={remadeNote('word', [s, t]) ?? undefined} data-midpoint-glued-by={byLights('word', [s, t]) ? 'lights' : 'plain'}>
            {byLights('word', [s, t]) ? `${s} ≡ ${t} · glued: you gave it ${lightsWords}` : (
              <>
                {`${s} ≡ ${t}${remadeNote('word', [s, t]) ? ` · ${remadeNote('word', [s, t])}` : ''} · `}
                <button type="button" data-midpoint-withdraw={`word|${s}|${t}`} className="underline" onClick={() => withdrawWordPair(edgeId, s, t)}>withdraw</button>
              </>
            )}
          </span>
        )) : <span data-midpoint-no-words="true" className="text-stone-400">no words translated yet (words spelled alike are still two words)</span>}
      </div>
      {/* the pairs naming a role a cast does not hold — marked, never erased */}
      {pairLines.some((l) => l.iA < 0 || l.iB < 0) ? (
        <div>
          {pairLines.filter((l) => l.iA < 0 || l.iB < 0).map((l) => (
            <span key={`${l.x}|${l.y}`} data-midpoint-unheld={`${l.x}≡${l.y}`} className="mr-3">
              {`${nA(l.x)} ≡ ${nB(l.y)} names a role that isn't in its cast · `}
              <button type="button" data-midpoint-withdraw={`role|${l.x}|${l.y}`} className="underline" onClick={() => withdrawRolePair(edgeId, l.x, l.y)}>withdraw</button>
            </span>
          ))}
        </div>
      ) : null}
      {/* C-14 f — the triad's pending line, one hand: `clear` */}
      {light !== null && (triadPicks[site.a] !== undefined || triadPicks[site.b] !== undefined || triadPicks[light] !== undefined) ? (
        <div data-midpoint-triad-pending={`${triadPicks[site.a] ?? ''}|${triadPicks[site.b] ?? ''}|${triadPicks[light] ?? ''}`}>
          {`triad in ${lightLabel}'s light: ${triadPicks[site.a] !== undefined ? nA(triadPicks[site.a]) : '—'} · ${triadPicks[site.b] !== undefined ? nB(triadPicks[site.b]) : '—'} · ${triadPicks[light] !== undefined ? nX(light, triadPicks[light]) : '—'} · `}
          <button type="button" data-midpoint-triad-withdraw-attempt="pending" className="underline" onClick={() => setTriadPicks({})}>clear</button>
        </div>
      ) : null}
      {light !== null && (wordTriadPicks[site.a] !== undefined || wordTriadPicks[site.b] !== undefined || wordTriadPicks[light] !== undefined) ? (
        <div data-midpoint-word-triad-pending={`${wordTriadPicks[site.a] ?? ''}|${wordTriadPicks[site.b] ?? ''}|${wordTriadPicks[light] ?? ''}`}>
          {`word triad in ${lightLabel}'s light: ${wordTriadPicks[site.a] ?? '—'} · ${wordTriadPicks[site.b] ?? '—'} · ${wordTriadPicks[light] ?? '—'} · `}
          <button type="button" data-midpoint-word-triad-withdraw-attempt="pending" className="underline" onClick={() => setWordTriadPicks({})}>clear</button>
        </div>
      ) : null}
      {/* C-14 f — THE GLUE SAYS BY WHICH LIGHTS (COPY-1 §4.7's words) */}
      {core && core.spoken.length > 0 ? (
        <div data-midpoint-lights="true" className="grid gap-0.5 text-stone-300">
          {core.spoken.length === 1 && core.lights.length > 1 ? (
            <span data-midpoint-light-line="one-spoken">{`only ${spokenLabels[0]}'s light has triads on ${la}–${lb}; nothing is glued until ${core.lights.filter((v) => !core.spoken.includes(v)).map((v) => `${labelOf(shape, v)}'s`).join(' and ')} light has some too`}</span>
          ) : null}
          {core.leftOut.map((o, i) => (
            <span key={`lo-${i}`} data-midpoint-light-line="left-out">
              {o.why === 'twice'
                ? `left out: ${o.kind === 'role' ? nA(o.pair[0]) : o.pair[0]} would be paired twice, with ${o.kind === 'role' ? nB(o.pair[1]) : o.pair[1]} and with ${o.kind === 'role' ? nB(o.with[1]) : o.with[1]} (both given ${lightsWords})`
                : `left out: ${o.kind === 'role' ? `${nA(o.pair[0])} ≡ ${nB(o.pair[1])}` : `${o.pair[0]} ≡ ${o.pair[1]}`}, given ${lightsWords}, goes against the pair ${o.kind === 'role' ? `${nA(o.with[0])} ≡ ${nB(o.with[1])}` : `${o.with[0]} ≡ ${o.with[1]}`}`}
            </span>
          ))}
          {core.heldBack.map((h, i) => {
            const site2 = h.bornAct.siteId !== null ? labelOf(shape, h.bornAct.siteId) : (() => { const e = shape.edges.find((x) => x.id === h.bornAct.edgeId); return e ? `${labelOf(shape, e.vertexIds[0])}–${labelOf(shape, e.vertexIds[1])}` : 'its edge'; })();
            const down = h.bornAct.siteId !== null ? generationOf(shape, h.bornAct.siteId) - siteGen : null;
            return (
              <span key={`hb-${i}`} data-midpoint-light-line="held-back">
                {`held back: ${h.kind === 'role' ? `${nA(h.pair[0])} ≡ ${nB(h.pair[1])}` : `${h.pair[0]} ≡ ${h.pair[1]}`} would break the pair ${h.bornAct.names[0]} ≡ ${h.bornAct.names[1]} at ${site2}${down === null ? '' : down === 0 ? ', the same generation' : down > 0 ? `, ${down === 1 ? 'one generation' : `${down} generations`} down` : `, ${-down === 1 ? 'one generation' : `${-down} generations`} up`}`}
              </span>
            );
          })}
          {(() => {
            if (core.spoken.length < 2) return null;
            const byRole = new Map<string, Array<{ light: VertexId; b: string }>>();
            for (const r of resolved.respects) { if (r.kind !== 'role') continue; const list = byRole.get(r.tuple[0]) ?? []; list.push({ light: r.corner, b: r.tuple[1] }); byRole.set(r.tuple[0], list); }
            const differing: string[] = [];
            for (const [a, list] of byRole) {
              const bs = [...new Set(list.map((x) => x.b))];
              const inMeet = core.meet.roles.some((p) => p[0] === a);
              if (bs.length > 1 && !inMeet && core.spoken.every((s) => list.some((x) => x.light === s))) differing.push(`${nA(a)} is ${nB(bs[0])} in one and ${nB(bs[1])} in the other`);
            }
            return differing.length ? <span data-midpoint-light-line="differ">{`${spokenLabels[0]}'s light and ${spokenLabels[1]}'s differ: ${differing.join('; ')}`}</span> : null;
          })()}
        </div>
      ) : null}
      {refusedRecord ? (
        <div data-midpoint-record-conflict="true" className="rounded border border-rose-900 bg-rose-950/30 px-2 py-1 text-rose-200">
          <span className="block">{sentence}</span>
          {refusedRecord.map((c, i) => (
            <span key={i} data-midpoint-conflict={conflictWords(c, la, lb)} className="block">{`conflict: ${conflictWords(c, la, lb)}`}</span>
          ))}
          <span className="mt-1 block text-stone-300">
            {roles.map(([x, y]) => (
              <span key={`${x}|${y}`} className="mr-3">
                <button type="button" data-midpoint-withdraw={`role|${x}|${y}`} className="underline" onClick={() => withdrawRolePair(edgeId, x, y)}>{`withdraw ${nA(x)} ≡ ${nB(y)}`}</button>
              </span>
            ))}
            {types.map(([s, t]) => (
              <span key={`${s}|${t}`} className="mr-3">
                <button type="button" data-midpoint-withdraw={`word|${s}|${t}`} className="underline" onClick={() => withdrawWordPair(edgeId, s, t)}>{`withdraw ${s} ≡ ${t}`}</button>
              </span>
            ))}
          </span>
        </div>
      ) : null}
      {sentence && !refusedRecord ? <span data-midpoint-sentence="true" className="text-stone-400">{sentence}</span> : null}
    </div>
  );

  // ── THE ALTITUDE'S BOX (STAMP THE-ALTITUDE · slice 1; the designer's 08:39 §3 with her 08:45 and 08:51; F5 throughout: no word offered while
  // he types, no sign pre-chosen, no box ordered, nothing lit by default) — one role of the light at a time, in the cast's order; two groups, the
  // roles of each end; a box per cell: his sentence with the word typed between the two labels, `holds · does not hold` neither chosen, `why`,
  // `+ another`; the live line once a word and a sign are given; `record N` counting the boxes ready; a recorded saying with its withdraw ──
  const lightAltitude = light !== null && lightFace !== null ? altitudeOf(shape, lightFace, light) : null;
  const lightSayings: AltitudeSaying[] = lightAltitude ? sayingsOf(lightAltitude.entries) : [];
  const zRoles = lightSpace ? lightSpace.roles : [];
  const zRole = zRoles.length > 0 ? zRoles[Math.min(batchIndex, zRoles.length - 1)] : null;
  const endRolesOf = (corner: VertexId): Array<{ id: string; label?: string; marks?: unknown }> => childSpaceOf(shape, corner)?.roles ?? [];
  // the cast's gloss, where the caster gave one (`marks.gloss` — read for the box's small line beside the label, never for a check)
  const glossOf = (role: { marks?: unknown }): string | null => { const mk = role.marks; const g = mk && typeof mk === 'object' ? (mk as Record<string, unknown>).gloss : null; return typeof g === 'string' && g.trim() ? g.trim() : null; };
  const eA = lightAltitude ? endSlotOf(lightAltitude.face, site.a) : -1; const eB = lightAltitude ? endSlotOf(lightAltitude.face, site.b) : -1; // M2 — the ends' slots in the light's face: a cell is (end, role)
  const cellKey = (z: string, e: number, x: string, n: number): string => `${z}|${e}|${x}|${n}`;
  const draftOf = (k: string): BoxDraft => boxDrafts[k] ?? EMPTY_DRAFT;
  const setDraft = (k: string, patch: Partial<BoxDraft>): void => setBoxDrafts({ ...boxDrafts, [k]: { ...draftOf(k), ...patch } });
  const linesAt = (z: string, e: number, x: string): number => 1 + (extraLines[`${z}|${e}|${x}`] ?? 0);
  const endRolesAll = [...endRolesOf(site.a).map((x) => ({ end: site.a, e: eA, x })), ...endRolesOf(site.b).map((x) => ({ end: site.b, e: eB, x }))];
  const readyDrafts = zRole ? endRolesAll.flatMap(({ end, e, x }) => Array.from({ length: linesAt(zRole.id, e, x.id) }, (_, n) => ({ end, e, x, n, d: draftOf(cellKey(zRole.id, e, x.id, n)) }))).filter(({ d }) => d.word.trim().length > 0 && d.sign !== null) : [];
  const recordBatch = (): void => {
    if (!zRole || lightFace === null || light === null) return;
    const next = { ...boxDrafts };
    for (const { end, e, x, n, d } of readyDrafts) {
      const refused = giveAltitudeSaying(lightFace, light, end, zRole.id, d.word.trim(), x.id, d.sign as Sign, d.why.trim() || undefined); // M2 — the end corner from the box's group
      if (refused === null) delete next[cellKey(zRole.id, e, x.id, n)];
    }
    setBoxDrafts(next);
    // the designer's 13:40 (6): a box whose lines were all recorded keeps ONE empty row (`+ another` adds more); a line refused keeps its row
    const nextExtra = { ...extraLines };
    for (const { e, x } of readyDrafts) if (!Object.keys(next).some((k) => k.startsWith(`${zRole.id}|${e}|${x.id}|`))) delete nextExtra[`${zRole.id}|${e}|${x.id}`];
    setExtraLines(nextExtra);
  };
  // ── THE LIGHT'S RELATIONS AT AN END (STAMP THE-ALTITUDE · slice 2; the designer's §4 with her 08:45): under a recorded saying that holds, one count
  // line — the relations of the light WITH this role at this end (the cell (end slot, role) — M2), induced among the roles present there, the cast's
  // refusals counted apart — and on `show` each as the cast has it with `holds · does not hold` (neither chosen; left alone it reads as the cast has
  // it; choosing one is his override, a bond saying, the end corner handed to the act), a recorded override with its hand, a bond cut by HIS denial
  // named `cut here: …`; a cut by silence shown nowhere (Arman's) ──
  const relationsAt = (z: string, e: EndSlot, x: string, end: VertexId): ReactNode => {
    if (light === null || lightFace === null || !lightAltitude) return null;
    const cfg = configurationAt(lightSpace, lightAltitude.entries, e, x);
    const withZ = cfg.induced.filter((r) => r.terms.includes(z));
    const refusedByCast = withZ.filter((r) => !r.holds).length;
    const cuts = cfg.cut.filter((c) => c.relation.terms.includes(z) && cutByDenial(c));
    if (withZ.length === 0 && cuts.length === 0) return null;
    const k = `${z}|${e}|${x}`;
    const words = (r: { w: string; terms: string[] }): string => `${nL(r.terms[0])} ${r.w} ${nL(r.terms[1] ?? r.terms[0])}`;
    const overrides = bondSayingsOf(lightAltitude.entries).filter((b) => b[1] === e && b[2] === x);
    return (
      <span data-altitude-relations={k} data-altitude-relations-count={String(withZ.length)} className="block text-stone-400">
        <span className="flex flex-wrap items-center gap-x-2">
          <span>{`${lightLabel}'s relations with ${nL(z)} at ${nX(end, x)}: ${withZ.length - refusedByCast}${refusedByCast ? ` · ${refusedByCast} that ${lightLabel} refuses` : ''}`}</span>
          {' · '}{/* the separators are TEXT, as the medium's lines have them — a person's copy reads `: 1 · show`, not `1·show` */}
          <button type="button" data-altitude-relations-show={k} data-altitude-relations-shown={relationsShown[k] ? 'true' : undefined} className="underline" onClick={() => setRelationsShown({ ...relationsShown, [k]: !relationsShown[k] })}>{relationsShown[k] ? 'hide' : 'show'}</button>
        </span>
        {relationsShown[k] ? (
          <span className="block pl-3">
            {withZ.map((r) => {
              const h = inducedHolds(cfg, r);
              const ov = overrides.find((b) => b[3] === r.w && b[4] === r.terms[0] && b[5] === r.terms[1]);
              const rk = `${r.w}|${r.terms[0]}|${r.terms[1]}`;
              return (
                <span key={rk} data-altitude-relation={rk} data-altitude-relation-holds={h.holds ? 'true' : 'false'} data-altitude-relation-overridden={h.overridden ? 'true' : undefined} className="flex flex-wrap items-center gap-x-2">
                  <span className="text-stone-300">{words(r)}</span>
                  {!r.holds ? <span data-altitude-relation-refused="true">{`· ${lightLabel} refuses it`}</span> : null}
                  {' · '}
                  <button type="button" data-altitude-bond-sign="+" data-altitude-bond-sign-chosen={ov && ov[6] === '+' ? 'true' : undefined} className={ov && ov[6] === '+' ? 'underline text-stone-100' : 'hover:text-stone-100'} onClick={() => giveBondSaying(lightFace, light, end, x, r.w, r.terms[0], r.terms[1], '+')}>holds</button>
                  {' · '}
                  <button type="button" data-altitude-bond-sign="-" data-altitude-bond-sign-chosen={ov && ov[6] === '-' ? 'true' : undefined} className={ov && ov[6] === '-' ? 'underline text-stone-100' : 'hover:text-stone-100'} onClick={() => giveBondSaying(lightFace, light, end, x, r.w, r.terms[0], r.terms[1], '-')}>does not hold</button>
                  {ov ? (
                    <span data-altitude-bond-recorded={`${x}|${rk}`} data-altitude-bond-recorded-sign={ov[6]} className="block w-full pl-3 text-amber-200">
                      {`at ${nX(end, x)}, ${words(r)} · ${ov[6] === '+' ? 'holds' : 'does not hold'} · `}
                      <button type="button" data-altitude-bond-withdraw={`${x}|${rk}`} className="underline" onClick={() => withdrawBondSaying(lightFace, light, end, x, r.w, r.terms[0], r.terms[1])}>withdraw</button>
                    </span>
                  ) : null}
                </span>
              );
            })}
            {cuts.map((c) => (
              <span key={`cut|${c.relation.w}|${c.relation.terms.join('|')}`} data-altitude-cut={`${c.relation.w}|${c.relation.terms.join('|')}`} className="block text-stone-300">
                {`${words(c.relation)} · cut here: ${c.deniedHere ? `it does not hold at ${nX(end, x)}` : `${c.missing.filter((m) => m.byDenial).map((m) => nL(m.role)).join(' and ')} ${c.missing.filter((m) => m.byDenial).length === 1 ? 'is' : 'are'} denied at ${nX(end, x)}`}`}
              </span>
            ))}
          </span>
        ) : null}
      </span>
    );
  };
  const altitudeBox: ReactNode = light !== null && lightFace !== null && lightSpace && zRole ? (
    <div data-altitude-batch={`${batchIndex + 1}/${zRoles.length}`} className="grid gap-2 text-xs text-stone-300">
      {/* the designer's 12:12 (4): the head line PINNED at the top of the tab with the act at its end — he works type → record → next, batch after batch */}
      <div data-altitude-head-line="true" className="sticky top-0 z-10 -mx-1 grid gap-0.5 bg-stone-950 px-1 py-1">
      <div className="flex flex-wrap items-center gap-x-2">
        <span data-altitude-batch-head="true" className="text-stone-100">{`${nL(zRole.id)} · ${batchIndex + 1} of ${zRoles.length}`}</span>
        <span className="text-stone-400">·</span>
        <button type="button" data-altitude-previous="true" disabled={batchIndex === 0} className={batchIndex === 0 ? 'text-stone-600' : 'underline hover:text-amber-100'} onClick={() => setBatchIndex(Math.max(0, batchIndex - 1))}>previous</button>
        <span className="text-stone-400">·</span>
        <button type="button" data-altitude-next="true" disabled={batchIndex >= zRoles.length - 1} className={batchIndex >= zRoles.length - 1 ? 'text-stone-600' : 'underline hover:text-amber-100'} onClick={() => setBatchIndex(Math.min(zRoles.length - 1, batchIndex + 1))}>next</button>
        <span className="text-stone-400">·</span>
        <button type="button" data-altitude-record={String(readyDrafts.length)} disabled={readyDrafts.length === 0} className={readyDrafts.length === 0 ? 'rounded border border-stone-800 px-2 py-0.5 text-stone-600' : 'rounded border border-amber-700 px-2 py-0.5 text-amber-200 hover:bg-amber-950/40'} onClick={recordBatch}>{`record ${readyDrafts.length}`}</button>
      </div>
      {readyDrafts.length === 0 ? <span data-altitude-record-hint="true" className="text-stone-500">type a word and choose holds or does not hold</span> : null}
      </div>
      {glossOf(zRole) ? <span data-altitude-gloss={zRole.id} className="text-stone-400">{glossOf(zRole)}</span> : null}
      {/* M2 — a relating of this role the reader does not read, by name: filed under the wrong end, or at a role its end no longer holds; his record, his hand */}
      {(lightAltitude ? lightAltitude.notRead : []).filter((m) => m.entry[0] === 'say' && m.entry[1] === zRole.id).map((m) => { const s = m.entry as AltitudeSaying; return (
        <span key={`nr|${s.join('|')}`} data-altitude-not-read={m.kind} className="text-rose-300">
          {`not read — ${m.why} · `}
          <button type="button" data-altitude-withdraw-not-read={s.join('|')} className="underline text-stone-300" onClick={() => withdrawAltitudeSaying(lightFace, light, lightAltitude ? lightAltitude.face.vertexIds[s[3]] ?? light : light, s[1], s[2], s[4])}>withdraw</button>
        </span>
      ); })}
      {[{ end: site.a, e: eA, lab: la }, { end: site.b, e: eB, lab: lb }].map(({ end, e, lab }) => (
        <div key={end} data-altitude-group={lab} className="grid gap-1">
          <span className="text-stone-100">{`in ${lab}`}</span>
          {endRolesOf(end).map((x) => {
            const recorded = lightSayings.filter((s) => s[1] === zRole.id && s[3] === e && s[4] === x.id);
            const lines = linesAt(zRole.id, e, x.id);
            const gloss = glossOf(x);
            return (
              <div key={x.id} data-altitude-cell-box={`${zRole.id}|${e}|${x.id}`} className="grid gap-0.5 rounded border border-stone-800 px-2 py-1">
                {recorded.map((s) => (
                  <span key={`${s[2]}`} data-altitude-recorded={`${s[1]}|${s[2]}|${s[3]}|${s[4]}`} data-altitude-recorded-sign={signOf(s)} className="text-amber-200">
                    {`${nL(s[1])} ${s[2]} ${nX(end, s[4])} · ${signOf(s) === '+' ? 'holds' : 'does not hold'} · `}
                    {/* D26 — THE MEET: the same relating stands on the edge between this end and the light too; shown as the edge's, merged with nothing (a mark only where it meets) */}
                    {(() => { const me = lightAltitude ? meetOf(shape, lightAltitude.face, light, s) : null; return me ? <span data-altitude-meet={me.id} className="text-stone-400">{`also on ${edgeByName(shape, me.vertexIds[0], me.vertexIds[1])} · `}</span> : null; })()}
                    <button type="button" data-altitude-withdraw={`${s[1]}|${s[2]}|${s[3]}|${s[4]}`} className="underline" onClick={() => withdrawAltitudeSaying(lightFace, light, end, s[1], s[2], s[4])}>withdraw</button>
                    {whyOf(s) ? <span data-altitude-recorded-why="true" className="block pl-3 text-stone-400">{`why: ${whyOf(s)}`}</span> : null}
                  </span>
                ))}
                {recorded.some((s) => signOf(s) === '+') ? relationsAt(zRole.id, e as EndSlot, x.id, end) : null}
                {Array.from({ length: lines }, (_, n) => {
                  const k = cellKey(zRole.id, e, x.id, n);
                  const d = draftOf(k);
                  const live = d.word.trim().length > 0 && d.sign !== null;
                  return (
                    <span key={k} data-altitude-cell={k} className="grid gap-0.5">
                      <span className="flex flex-wrap items-center gap-x-2">
                        <span className="text-stone-100">{nL(zRole.id)}</span>
                        <WordField value={d.word} onChange={(v) => setDraft(k, { word: v })} words={hisWords} field={{ 'data-altitude-word': k, type: 'text', spellCheck: false, placeholder: 'a word', className: boxInputClass }} />
                        <span className="text-stone-100">{nX(end, x.id)}</span>
                        <span data-altitude-sign-pair="true" className="inline-flex items-center gap-x-2 whitespace-nowrap">{/* the designer's 13:40 (5): the pair moves to the next line whole */}
                          <button type="button" data-altitude-sign="+" data-altitude-sign-chosen={d.sign === '+' ? 'true' : undefined} className={d.sign === '+' ? 'underline text-stone-100' : 'text-stone-400 hover:text-stone-100'} onClick={() => setDraft(k, { sign: d.sign === '+' ? null : '+' })}>holds</button>
                          <span className="text-stone-500">·</span>
                          <button type="button" data-altitude-sign="-" data-altitude-sign-chosen={d.sign === '-' ? 'true' : undefined} className={d.sign === '-' ? 'underline text-stone-100' : 'text-stone-400 hover:text-stone-100'} onClick={() => setDraft(k, { sign: d.sign === '-' ? null : '-' })}>does not hold</button>
                        </span>
                      </span>
                      {/* the designer's 12:12 (5): the object's gloss under the first sentence row (08:39 §3), one step lighter; then `why · + another` on its own row; then the why line; then the live line */}
                      {gloss && n === 0 ? <span data-altitude-end-gloss={x.id} className="text-[10px] text-stone-400">{gloss}</span> : null}
                      <span data-altitude-cell-hands={k} className="flex flex-wrap items-center gap-x-2">
                        <button type="button" data-altitude-why-open={k} className="text-stone-400 underline hover:text-stone-100" onClick={() => setDraft(k, { whyOpen: !d.whyOpen })}>why</button>
                        {n === lines - 1 ? (<><span className="text-stone-500">·</span><button type="button" data-altitude-another={`${zRole.id}|${e}|${x.id}`} className="text-stone-400 underline hover:text-stone-100" onClick={() => setExtraLines({ ...extraLines, [`${zRole.id}|${e}|${x.id}`]: lines })}>+ another</button></>) : null}
                      </span>
                      {d.whyOpen ? <input data-altitude-why={k} type="text" autoComplete="off" spellCheck={false} value={d.why} onChange={(e) => setDraft(k, { why: e.target.value })} placeholder="why" className={`${boxInputClass} w-72`} /> : null}
                      {live ? <span data-altitude-live={k} className="text-amber-200">{`${nL(zRole.id)} ${d.word.trim()} ${nX(end, x.id)} · ${d.sign === '+' ? 'holds' : 'does not hold'}`}{hisWords.includes(d.word.trim()) ? '' : ' · a new word'}</span> : null}{/* the designer's 14:40: a NEW word is marked, reuse is not (the ordinary is not marked); recorded, it is his and the mark goes */}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  ) : null;

  const tabButton = (t: Tab, label: string): ReactNode => (
    <button key={t} type="button" data-midpoint-tab={t} data-midpoint-tab-open={tab === t ? 'true' : undefined} className={`px-2 py-1 text-xs transition focus:outline-none focus:ring-1 focus:ring-amber-300 ${tab === t ? 'border-b border-amber-300 text-stone-100' : 'text-stone-400 hover:text-stone-100'}`} onClick={() => setTab(t)}>{label}</button>
  );

  return (
    <div
      data-medium="true"
      {...mediumAttrs}
      data-midpoint-surface={site.siteId}
      data-midpoint-state={state}
      data-midpoint-light={light ?? undefined}
      data-midpoint-half={half}
      data-midpoint-tab-active={tab}
      className={full ? 'flex h-full min-h-0 flex-col text-xs text-stone-300' : 'pointer-events-auto absolute bottom-20 left-3 right-3 top-14 flex flex-col overflow-auto rounded border border-stone-800 bg-stone-950/90 text-xs text-stone-300 shadow-lg'}
    >
      {/* ── THE STRIP (LAYOUT-1 §4) ── */}
      <div data-midpoint-strip="true" className="flex shrink-0 items-center gap-3 border-b border-stone-800 px-3 py-1">
        {minimap}
        <span data-midpoint-head="true" className="text-stone-100">{`${lm} · between ${la} and ${lb}`}</span>
        {light !== null && lightSource ? (
          <span data-midpoint-source={site.sources.indexOf(lightSource) === 0 ? 'above' : 'below'} data-midpoint-face={lightSource.faceName} className="flex items-center gap-1">
            <span data-midpoint-triad-head="true" className="text-violet-200">{`in ${lightLabel}'s light`}</span>
            <span className="text-stone-400">·</span>
            <button type="button" data-midpoint-source-open="open" data-midpoint-apex={light} className="underline" onClick={() => openLight(null)}>close</button>
          </span>
        ) : (
          apexesInOrder.map((apex) => {
            const src = site.sources.find((s) => s.apexes.includes(apex));
            const lx = labelOf(shape, apex);
            const holds = !!spaceOf(shape, apex);
            return (
              <span key={apex} data-midpoint-source={src && site.sources.indexOf(src) === 0 ? 'above' : 'below'} data-midpoint-face={src?.faceName}>
                {holds ? (
                  <Hint text={`show ${lx}'s roles between ${la} and ${lb}`}>
                    <button type="button" data-midpoint-source-open="closed" data-midpoint-apex={apex} className="underline hover:text-amber-100" onClick={() => openLight(apex)}>{`${lx}'s light`}</button>
                  </Hint>
                ) : null}
              </span>
            );
          })
        )}
        <span className="flex-1" />
        {full ? (
          <Hint text="back to the solid">
            <button type="button" data-midpoint-close="true" aria-label="back to the solid" className="px-2 text-base leading-none text-stone-400 hover:text-stone-100" onClick={() => selectVertex(null)}>×</button>
          </Hint>
        ) : null}
      </div>
      <div ref={paneRef} className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* ── THE PAIRING (LAYOUT-1 §4) ── */}
        <section data-midpoint-pairing="true" style={full ? { flexBasis: `${split * 100}%` } : undefined} className="flex min-h-0 flex-col overflow-auto px-3 py-2 lg:shrink-0">
          <div className="mb-1 flex items-center gap-3">
            <span data-midpoint-half-switch="true" className="flex items-center gap-1 text-stone-400">
              <button type="button" data-midpoint-half-choice="roles" data-midpoint-half-chosen={half === 'roles' ? 'true' : undefined} className={half === 'roles' ? 'underline text-stone-100' : 'hover:text-stone-100'} onClick={() => setHalf('roles')}>roles</button>
              <span>·</span>
              <button type="button" data-midpoint-half-choice="words" data-midpoint-half-chosen={half === 'words' ? 'true' : undefined} className={half === 'words' ? 'underline text-stone-100' : 'hover:text-stone-100'} onClick={() => setHalf('words')}>words</button>
            </span>
            <HelpNote area="pairing" lines={light !== null ? [...pairingHelp(la, lb), `in ${lightLabel}'s light, each relating runs from a role of ${lightLabel} to a role of ${la} or ${lb}`] : pairingHelp(la, lb)} />
          </div>
          {/* STAMP THE-ALTITUDE · slice 1 (the designer's §1; D25): one line per opposite corner — a fact and the place, asking nothing, locking nothing */}
          {apexesInOrder.map((apex) => {
            const src = site.sources.find((s) => s.apexes.includes(apex));
            if (!src || !spaceOf(shape, apex)) return null;
            const alt = altitudeOf(shape, src.faceId, apex);
            const n = alt ? sayingsOf(alt.entries).length : 0;
            const lx = labelOf(shape, apex);
            return (
              <span key={apex} data-altitude-line={apex} data-altitude-count={String(n)} className="text-stone-400">
                {n === 0 ? `${lx}'s roles: none related to ${la} or ${lb} here yet` : `${lx}'s roles: ${n === 1 ? '1 relating' : `${n} relatings`} to ${la} and ${lb} here`}
                {light === apex ? null : <>{' · '}<button type="button" data-altitude-open={apex} className="underline hover:text-amber-100" onClick={() => openLight(apex)}>{`open ${lx}'s light`}</button></>}
              </span>
            );
          })}
          <MediumChoices {...mediumProps} />
          <MediumRefusals {...mediumProps} />
          {light !== null && lightFace !== null && altitudeRefusals[altitudeRefusalKey(lightFace, light)] ? (
            // F2 — the direction law's refusal, by name, where the act was made (the designer's §3)
            <div data-altitude-refusal={altitudeRefusals[altitudeRefusalKey(lightFace, light)].why} className="my-1 rounded border border-rose-900 bg-rose-950/30 px-2 py-1 text-rose-200">
              <span>{`not taken — ${altitudeRefusals[altitudeRefusalKey(lightFace, light)].why} · `}</span>
              <button type="button" data-altitude-withdraw-attempt="refusal" className="underline text-stone-300" onClick={() => withdrawAltitudeAttempt(lightFace, light)}>clear</button>
            </div>
          ) : null}
          {refusalBox}
          {lightFace !== null && triadRefusals[lightFace] ? (
            <div data-midpoint-triad-refusal={triadRefusals[lightFace].why} className="my-1 rounded border border-rose-900 bg-rose-950/30 px-2 py-1 text-rose-200">
              <span>{`not taken — ${triadRefusals[lightFace].why} · `}</span>
              <button type="button" data-midpoint-triad-withdraw-attempt="refusal" className="underline text-stone-300" onClick={() => withdrawTriadAttempt(lightFace)}>clear</button>
            </div>
          ) : null}
          {/* §149 — the pick lines are RESERVED, one line high, never wrapping: a pick moves nothing (COPY-1 §4.1's words) */}
          <div data-midpoint-pick-line="role" className="h-4 truncate leading-4 text-amber-200">
            {pick ? <span data-midpoint-pick={`${pick.side}|${pick.role}`}>{`picked in ${pick.side === 'A' ? la : lb}: ${pick.side === 'A' ? nA(pick.role) : nB(pick.role)}`}</span> : null}
          </div>
          <div data-midpoint-pick-line="word" className="h-4 truncate leading-4 text-amber-200">
            {wordPick ? <span data-midpoint-word-pick={`${wordPick.side}|${wordPick.word}`}>{`picked in ${wordPick.side === 'A' ? la : lb}: ${wordPick.word}`}</span> : null}
          </div>
          {/* Arman's 19:27 (the designer's 19:30): the drawing first, its content's height up to three quarters of what is left; the list of acts takes the
              rest and scrolls inside itself — never under four lines, its head counting what it holds; `under … · show` opens inside the list */}
          <div ref={pairBodyRef} data-midpoint-pairing-body="true" className="flex min-h-[8rem] flex-1 flex-col">
            <div ref={drawRegionRef} data-midpoint-drawing-region="true" data-midpoint-drawing-max={drawMax === null ? undefined : String(Math.round(drawMax))} style={drawMax === null ? undefined : { maxHeight: drawMax }} className="min-h-0 shrink-0 overflow-y-auto">
              {half === 'roles' ? drawing : wordRows}
            </div>
            <div data-midpoint-acts-region="true" className="flex min-h-0 flex-1 flex-col">
              {actsHead ? <div ref={actsHeadRef} data-midpoint-acts-head={actsHead} className="shrink-0 text-stone-400">{actsHead}</div> : null}
              <div ref={actsScrollRef} data-midpoint-acts-scroll="true" className="min-h-0 flex-1 overflow-y-auto">{actsList}</div>
            </div>
          </div>
        </section>
        {full ? <div data-midpoint-divider="true" className={`hidden w-1 shrink-0 lg:block ${light !== null ? 'cursor-col-resize bg-stone-800 hover:bg-stone-600' : 'bg-stone-800'}`} onMouseDown={() => { if (light !== null) dragging.current = true; }} /> : <div className="hidden w-px shrink-0 bg-stone-800 lg:block" />}
        {/* ── THE POINT (LAYOUT-1 §4), four tabs — every tab renders; an inactive one is hidden, never unmounted; the traces last ── */}
        <section data-midpoint-point="true" className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div data-midpoint-tabs="true" className="flex shrink-0 items-center gap-1 border-b border-stone-800 px-2">
            {light !== null ? tabButton('light', `${lightLabel}'s roles`) : null}
            {tabButton('point', 'the point')}
            {tabButton('modes', 'modes')}
            {tabButton('corners', 'corners')}
            {tabButton('traces', 'traces')}
          </div>
          <div className="min-h-0 flex-1 overflow-auto px-3 py-2">
            {/* a tab's panel is hidden by the `hidden` UTILITY, never the attribute alone: a display utility on the same element would win over `[hidden]` (measured at the eye: all four panels showed) */}
            {light !== null && lightFace !== null && lightSpace ? (
              <div data-midpoint-panel="light" data-altitude-box={light} hidden={tab !== 'light'} className={tab === 'light' ? 'grid gap-2' : 'hidden'}>
                {altitudeBox}
              </div>
            ) : null}
            <div data-midpoint-panel="point" hidden={tab !== 'point'} className={tab === 'point' ? 'grid gap-1' : 'hidden'}>
              <MediumPoint {...mediumProps} nameIt={nameIt} />
              {/* LAYOUT-1 §4 / §9.15 — the concept's diagram: the child, his relatings as its points, the arcs of his casts they carry */}
              {childInside && childG ? (
                <div data-midpoint-own="glued" className="overflow-x-auto rounded border border-stone-800 bg-stone-950/60 px-2 py-1">
                  <svg data-midpoint-own-drawing="true" width={childG.leftReach + childG.rightReach} height={childG.height + 14} viewBox={`${-childG.leftReach} 0 ${childG.leftReach + childG.rightReach} ${childG.height + 14}`} className="block overflow-visible">
                    <InsideColumn inside={childInside} geometry={childG} idPrefix={`own-${site.siteId}`} pointExtra={childPointExtra} />
                  </svg>
                </div>
              ) : <div data-midpoint-own="unglued" />}
            </div>
            <div data-midpoint-panel="modes" hidden={tab !== 'modes'} className={tab === 'modes' ? undefined : 'hidden'}>
              <MediumModes {...mediumProps} />
            </div>
            <div data-midpoint-panel="corners" hidden={tab !== 'corners'} className={tab === 'corners' ? 'grid gap-2' : 'hidden'}>
              {site.sources.map((src, k) => (
                <div key={src.faceId} data-midpoint-source={k === 0 ? 'above' : 'below'} data-midpoint-face={src.faceName} className="grid gap-1">
                  {src.apexes.map((apex) => (
                    <CornerRecord key={apex} shape={shape} site={site} apex={apex} source={src} foot={feetInOrder.find((f) => f.corner === apex) ?? null} sorting={sorting} respects={respectsAt(apex)} nA={nA} nB={nB} nX={nX} la={la} lb={lb} withdrawTriadOf={withdrawTriadOf} />
                  ))}
                  {/* C-10b (§131 item 2): one line per BORN face through this site — its kind by the cells holding it — and the route to its reading */}
                  {src.cycle.length === 3 && !src.cycle.every((v) => isSeedVertex(shape, v)) ? (() => {
                    const words = faceCellsOf(shape, src.faceId, src.cycle);
                    return (
                      <span data-midpoint-born-face-at-site={src.faceName} data-midpoint-born-face-kind={words.cornerCellFace ? 'corner-cell' : words.other ? 'interior' : 'one-cell'} className="block text-stone-400">
                        {`face ${src.faceName}, ${words.kindWords}`}
                        {/* M1: the corner cell's own face reads like every born face (its old `every role returns to itself` was the leftovers' ordinary, not the transport's) */}
                        {' · '}
                        <button type="button" data-midpoint-select-face={src.faceId} className="underline hover:text-amber-100" onClick={() => selectFace(src.faceId)}>read it</button>
                      </span>
                    );
                  })() : null}
                </div>
              ))}
            </div>
            <div data-midpoint-trace="true" data-midpoint-panel="traces" hidden={tab !== 'traces'} className={tab === 'traces' ? 'grid gap-0.5 text-stone-300' : 'hidden'}>
              {/* C-8 item 5 — THE TRACE carries the record's HOME and the SITE (COPY-1 §4.8) */}
              <span data-midpoint-home={`${kind}|${edgeGen}|${siteGen}`} className="text-stone-400">
                {`recorded on ${la}–${lb}, a ${kind} edge (generation ${edgeGen}) · this site: ${lm}, generation ${siteGen}`}
              </span>
              {[[site.siteId, resolved, lm], [site.a, parents[0], la], [site.b, parents[1], lb]]
                .filter(([, r]) => (r as Resolved).loadedIgnored)
                .map(([id, , name]) => (
                  <span key={String(id)} data-midpoint-loaded-ignored={String(id)} className="text-amber-200">{`${String(name)} holds a loaded cast that isn't read: a midpoint's space comes from its parents`}</span>
                ))}
              {trace && state === 'glued' ? (
                <div data-midpoint-residuals="true" className="grid gap-0.5 text-stone-400">
                  <span data-midpoint-parent-trace="A">{residualWords(trace.parents[0], la, lb)}</span>
                  <span data-midpoint-parent-trace="B">{residualWords(trace.parents[1], lb, la)}</span>
                </div>
              ) : null}
              {M && trace && state === 'glued' ? (
                <>
                  <span data-midpoint-core="true" className="text-stone-400">{`what both confirm: ${M.core.roles} ${M.core.roles === 1 ? 'role' : 'roles'} · ${M.core.tuples} ${M.core.tuples === 1 ? 'tuple' : 'tuples'} · ${M.core.marks} ${M.core.marks === 1 ? 'mark' : 'marks'}`}</span>
                  {trace.glued.map((r) => (
                    <span key={r.key} data-midpoint-role-trace={r.key}>
                      {`${nA(r.a)} ≡ ${nB(r.b)} · ${r.about} ${r.about === 1 ? 'tuple' : 'tuples'}: ${r.both} from both, ${r.fromA} from ${la}, ${r.fromB} from ${lb}`}
                      {r.mark ? ` · ${r.mark.type} ${r.mark.value} (${r.mark.witnesses.map((w) => (w === 'A' ? la : lb)).join(', ')})` : ''}
                    </span>
                  ))}
                </>
              ) : null}
              {/* the COUNTS are the child's — never the pushout's (LAYOUT-1's ratification, §9.15) */}
              {child && childCounts2 ? <span data-midpoint-counts="true">{`${lm}: ${child.roles.length} ${child.roles.length === 1 ? 'relating' : 'relatings'} · ${childCounts2.words} ${childCounts2.words === 1 ? 'word' : 'words'} · ${childCounts2.tuples} ${childCounts2.tuples === 1 ? 'tuple' : 'tuples'}`}</span> : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * THE CORNERS TAB (LAYOUT-1 §4; COPY-1 §4.7) — one opposite corner through its face: WHAT IT HOLDS in words, what the person
 * has paired on the two edges that reach it, how it sees the pairing on A–B (the foot, C-12b: agreement leads; a would-pair is a
 * conditional sentence, never a control), the triads with their verdicts, and the seed face's reading. The device computes
 * nothing with the corner and joins nothing; its drawing is the light, opened from the strip.
 */
function CornerRecord({ shape, site, apex, source, foot, sorting, respects, nA, nB, nX, la, lb, withdrawTriadOf }: {
  shape: Shape; site: MidpointSite; apex: VertexId; source: ProjectionSource; foot: Resolved['feet'][number] | null; sorting: ReturnType<typeof sortingOf> | null; respects: RespectReading[];
  nA: (id: string) => string; nB: (id: string) => string; nX: (corner: VertexId, id: string) => string; la: string; lb: string; withdrawTriadOf: (corner: VertexId, kind: 'role' | 'word', tuple: RespectTuple) => void;
}) {
  // MARKER MODES-3 · M6 (the designer's gate, 2026-10-07 12:33; the mothership's 12:34): at generation ≥ 2 the opposite corner is a BORN
  // vertex and the corners tab counts it by its CHILD (`made of 5 relatings`), never the old merged space (`a concept-space of 14 roles …`
  // and `would pair … but you paired …` — pairings he never made); its pairing view does not print here, because the modes tab carries
  // that view in the child's terms. Generation 1 is unchanged: the opposite corner is a seed and its cast is the space.
  const bornApex = !isSeedVertex(shape, apex);
  const cast = useMemo(() => (bornApex ? undefined : spaceOf(shape, apex)?.space), [shape, apex, bornApex]);
  const inside = useMemo(() => (cast ? insideOf(cast) : null), [cast]);
  const child = useMemo(() => (bornApex ? childSpaceOf(shape, apex) : null), [shape, apex, bornApex]);
  const lx = labelOf(shape, apex);
  const acts = [neighbourActsOn(shape, site.a, apex), neighbourActsOn(shape, site.b, apex)];
  const raw = acts.every((n) => !n.present);
  const parentsOfApex = shape.vertices[apex]?.createdBy.sourceVertexIds ?? [];
  const holds = bornApex
    ? child
      ? child.roles.length === 0
        ? `nothing related between ${labelOf(shape, parentsOfApex[0])} and ${labelOf(shape, parentsOfApex[1])} yet`
        : `made of ${child.roles.length} ${child.roles.length === 1 ? 'relating' : 'relatings'}`
      : 'no space'
    : inside
    ? inside.census.points === 0
      ? 'a cast with no roles'
      : `a concept-space of ${inside.census.points} ${inside.census.points === 1 ? 'role' : 'roles'}, ${inside.census.arrows + inside.census.loops + inside.census.hyper} ${inside.census.arrows + inside.census.loops + inside.census.hyper === 1 ? 'relation' : 'relations'}, ${inside.census.words} ${inside.census.words === 1 ? 'word' : 'words'}`
    : 'no cast';
  const view = sorting ? sorting.views.find((v) => v.view === apex) ?? null : null;
  const hasPath = !!view && view.paths.length > 0;
  const legWords = (leg: [VertexId, VertexId]): string => `${labelOf(shape, leg[0])}–${labelOf(shape, leg[1])}`;
  const empty = foot ? [!foot.given[0] ? `${la}–${lx}` : null, !foot.given[1] ? `${lx}–${lb}` : null].filter((x): x is string => x !== null) : [];
  // STAMP MODES-3 (the ruling's 3): a foot with nothing to say — no agreement of his, no disagreement, no proposal — is SILENT; the composed
  // identity's own agreements are not said (the ordinary), so a corner site's foot through a light prints its silent line
  const silent = foot ? foot.fix.length + foot.disagreement.length + foot.proposal.length === 0 && !hasPath : !hasPath;
  const silentLine = empty.length === 2
    ? `nothing through ${lx} yet: nothing is paired on ${la}–${lx} or ${lx}–${lb}`
    : empty.length === 1
      ? `nothing through ${lx} yet: nothing is paired on ${empty[0]}`
      : `nothing through ${lx}: the pairs on ${la}–${lx} and ${lx}–${lb} don't meet`;
  return (
    <div data-midpoint-apex={apex} className="grid gap-0.5">
      <span data-midpoint-source-words="true" className="text-stone-400">
        <span className="text-stone-100">{lx}</span>
        {` · face ${source.faceName} · ${holds}`}
      </span>
      <span data-midpoint-source-acts={raw ? 'none' : 'given'} className={raw ? 'text-stone-400' : 'text-amber-200'}>
        {raw ? `nothing paired or related on ${acts[0].edgeLabel} or ${acts[1].edgeLabel} yet` : acts.map((n) => neighbourActsWords(n)).join(' · ')}
      </span>
      {!bornApex && (foot || respects.length > 0) ? (
        <div data-midpoint-foot={lx} data-midpoint-foot-state={silent ? 'silent' : 'read'} className="grid gap-0.5 text-stone-300">
          <span data-midpoint-foot-head="true">{`through ${lx}, from the pairs on ${la}–${lx} and ${lx}–${lb}`}</span>
          {respects.map((r) => {
            const verdict = r.verdict === 'HONORED'
              ? 'honored'
              : r.verdict === 'BROKEN' && r.brokenLeg && r.brokenPair
                ? `broken on ${legWords(r.brokenLeg)}, where you paired ${r.kind === 'role' ? nX(r.brokenLeg[0], r.brokenPair[0]) : r.brokenPair[0]} with ${r.kind === 'role' ? nX(r.brokenLeg[1], r.brokenPair[1]) : r.brokenPair[1]}`
                : `not yet: ${r.legs.filter((l) => l.reading === 'OPEN').map((l) => (l.given ? `${r.kind === 'role' ? nX(l.edge[0], l.edge[0] === apex ? r.tuple[2] : r.tuple[0]) : (l.edge[0] === apex ? r.tuple[2] : r.tuple[0])} isn't paired on ${legWords(l.edge)}` : `nothing is paired on ${legWords(l.edge)}`)).join(', and ')}`;
            return (
              <span key={`r-${r.kind}-${r.tuple.join('|')}`} data-midpoint-respect-line={r.verdict} data-midpoint-respect-kind={r.kind}>
                {`${r.kind === 'role' ? 'triad' : 'word triad'}: ${r.kind === 'role' ? nA(r.tuple[0]) : r.tuple[0]} is ${r.kind === 'role' ? nB(r.tuple[1]) : r.tuple[1]} as regards ${r.kind === 'role' ? nX(apex, r.tuple[2]) : r.tuple[2]} · ${verdict} · `}
                <button type="button" data-midpoint-triad-withdraw={`${r.kind}|${r.tuple[0]}|${r.tuple[1]}|${r.tuple[2]}`} className="underline" onClick={() => withdrawTriadOf(apex, r.kind, r.tuple)}>withdraw</button>
              </span>
            );
          })}
          {foot && foot.fix.length > 0 ? <span data-midpoint-foot-line="agrees">{`agrees with ${foot.fix.length} ${foot.fix.length === 1 ? 'pair' : 'pairs'}: ${foot.fix.map(([a, b]) => `${nA(a)} ≡ ${nB(b)}`).join(' · ')}`}</span> : null}
          {foot ? foot.disagreement.map(([a, b, p]) => (
            <span key={`d-${a}`} data-midpoint-foot-line="would-pair">{`would pair ${nA(a)} with ${nB(b)}, but you paired ${nA(a)} with ${nB(p)}`}</span>
          )) : null}
          {foot ? foot.proposal.map(([a, b]) => {
            // M3 S2 (the designer's eye; M2 §9.7): the view's sentence SPLITS BY END — a path onto a role his pair holds elsewhere takes the source end's form
            const path = view ? view.paths.find((p) => p.path.w === IS && p.path.w2 === IS && p.path.x === a && p.path.y === b) : undefined;
            const key = path && path.reading === 'TENSION' && path.end === 'target' && path.direct ? path.direct.split('|') : null;
            return key && key.length === 3
              ? <span key={`p-${a}`} data-midpoint-foot-line="would-pair">{`would pair ${nB(b)} with ${nA(a)}, but you paired ${nB(b)} with ${nA(key[1])}`}</span>
              : <span key={`p-${a}`} data-midpoint-foot-line="would-join">{`would pair ${nA(a)} with ${nB(b)}, which you haven't paired`}</span>;
          }) : null}
          {silent ? <span data-midpoint-foot-line="silent">{silentLine}</span> : null}
        </div>
      ) : null}
      {/* C-5 reads the face at generation 0 — the seed's own faces, whose edges hold the person's records */}
      {source.cycle.length === 3 && source.cycle.every((v) => isSeedVertex(shape, v)) ? (
        <FaceRecord shape={shape} cycle={source.cycle as [VertexId, VertexId, VertexId]} faceName={source.faceName} here={site.edge.id} faceId={source.faceId} />
      ) : null}
    </div>
  );
}

const tupleWords = (t: FaceTuple): string => `${t.type}(${t.terms.join(', ')}) ${valueWords(t.value)}`;

/** C-9 / C-10b — the cells holding a face BY VERTEX SET (each cell holds its own record of a shared face — C-7h's measurement), the
 * host (the core's or the parent's copy) and the other, and the corner cell's face (one residue, a seed corner — it returns all of
 * its corner to itself: the solid's ordinary, no reading to mark). One producer for the site's lines and the face's home. */
export function faceCellsOf(shape: Shape, faceId: string, cycle: VertexId[]): { cells: Shape['cells']; host: Shape['cells'][number] | null; other: Shape['cells'][number] | null; cornerCellFace: boolean; kindWords: string } {
  const own = shape.faces.find((f) => f.id === faceId);
  const set = new Set(own ? own.vertexIds : cycle);
  const same = (id: string): boolean => { const f = shape.faces.find((x) => x.id === id); return Boolean(f) && (f as { vertexIds: VertexId[] }).vertexIds.length === set.size && (f as { vertexIds: VertexId[] }).vertexIds.every((v) => set.has(v)); };
  const cells = shape.cells.filter((c) => c.faceIds.some(same));
  const host = cells.find((c) => c.kind === 'core' || c.kind === 'parent') ?? cells[0] ?? null;
  const other = cells.find((c) => c !== host) ?? null;
  const cornerCellFace = cells.length === 1 && cells[0].kind === 'residue' && cycle.some((v) => isSeedVertex(shape, v));
  const L = (v: VertexId): string => labelOf(shape, v);
  const cellWords = (c: Shape['cells'][number]): string => (c.kind === 'residue' ? `the residue ${c.topology ?? 'cell'} at ${L(c.vertexIds[0])}` : `the ${c.kind === 'parent' ? 'parent' : 'core'} ${c.topology ?? 'cell'}`);
  // COPY-1 §4.7: `face AB·AC·BC, the core octahedron's` · `face A·AB·AC, the corner cell's own` · `between the core octahedron and the residue tetrahedron at A`
  const kindWords = cornerCellFace ? `the corner cell's own` : other && host ? `between ${cellWords(host)} and ${cellWords(other)}` : host ? `${cellWords(host)}'s` : 'of no cell';
  return { cells, host, other, cornerCellFace, kindWords };
}

/**
 * C-9 — THE BORN FACE at its edge's site (the designer's §125.1 rulings): the SOLID part QUIET, stated once — it is the
 * ground, derived and never an act; the EXTENSION MARKED and ATTRIBUTED to the born pair that made each added route;
 * `Und`'s two hands in the one grammar, where first — a born pair on the born face's edge at its site · an act on the
 * descended-from seed edge at its midpoint — the device never chooses between them. An INTERIOR face lies between two
 * cells whose walks are opposite: ONE block when both read alike (saying so), BOTH blocks named by their cells, the host's
 * first, when they differ. The corner cell's face carries no block: it always returns all of its corner to itself.
 */
// C-10: EXPORTED for the Manuscript's card (the lifted face read on the record the lift carried) — `here` null there (no site
// is local to the page), `hands` 'words' there (the acts are the Ambo's, at the sites the words name; never an act on the copy)
export function BornFaceRecord({ shape, cycle, faceName, faceId, here, siteId, hands = 'act' }: { shape: Shape; cycle: [VertexId, VertexId, VertexId]; faceName: string; faceId: string; here: Edge['id'] | null; siteId?: VertexId; hands?: 'act' | 'words' }) {
  const withdrawRolePair = useGeometryStore((s) => s.withdrawRolePair);
  const withdraw = hands === 'act' ? withdrawRolePair : undefined;
  // the cells holding this face — by VERTEX SET (C-7h's measurement: one order written twice), the one producer (C-10b)
  const { cells, host, other } = useMemo(() => faceCellsOf(shape, faceId, cycle), [shape, faceId, cycle]);
  // M1 (THE-THIRD-RESOLUTION): the born face reads through the TRANSPORT's readers — a corner's space (a seed's cast, a born corner's child),
  // the step (his IS-instances and the inherited; the coordinate map on a corner edge) and its ground — handed in, as D20 hands the seed
  // face its step; the corner cell's own face reads like every born face (its `every role returns to itself` was the leftovers' ordinary)
  const readers = useMemo(() => bornReadersOf(shape), [shape]);
  const forward = useMemo(() => bornFaceOf(shape, cycle, readers), [shape, cycle, readers]);
  const reversed = useMemo(() => (other ? bornFaceOf(shape, [cycle[0], cycle[2], cycle[1]], readers) : null), [shape, cycle, other, readers]);
  const L = (v: VertexId): string => labelOf(shape, v);
  const cellWords = (c: (typeof cells)[number]): string => (c.kind === 'residue' ? `the residue ${c.topology ?? 'cell'} at ${L(c.vertexIds[0])}` : `the ${c.kind === 'parent' ? 'parent' : 'core'} ${c.topology ?? 'cell'}`);
  const alike = reversed ? readAlike(forward, reversed) : true;
  return (
    <div data-midpoint-born-face={faceName} data-midpoint-born-face-cells={String(cells.length)} data-midpoint-born-face-alike={other ? (alike ? 'true' : 'false') : undefined} className="grid gap-0.5">
      <BornFaceBlock shape={shape} result={forward} head={other && host ? `face ${faceName}, between ${cellWords(host)} and ${cellWords(other)}, walked as ${cellWords(host)}'s` : `face ${faceName}`} here={here} siteId={siteId} withdraw={withdraw} cycle={cycle} faceId={faceId} />
      {other && alike ? <span data-midpoint-born-face-alike-line="true" className="text-stone-500">{`walked the other way (as ${cellWords(other)}'s), it reads the same: one reading for both cells`}</span> : null}
      {other && !alike && reversed ? <BornFaceBlock shape={shape} result={reversed} head={`walked the other way, as ${cellWords(other)}'s`} here={here} siteId={siteId} withdraw={withdraw} cycle={cycle} faceId={faceId} /> : null}
    </div>
  );
}

function BornFaceBlock({ shape, result, head, here, withdraw, cycle, faceId }: { shape: Shape; result: BornFaceResult; head: string; here: Edge['id'] | null; siteId?: VertexId; withdraw?: (edgeId: Edge['id'], x: string, y: string) => void; cycle: [VertexId, VertexId, VertexId]; faceId: string }) {
  const L = (v: VertexId): string => labelOf(shape, v);
  const edgeWords = (from: VertexId, to: VertexId): string => `${L(from)}–${L(to)}`;
  // M1: a role by its corner's own name, from the cast the face READ (the walk's — the transport's: a born corner's roles by their sentences)
  const spaces = result.state === 'absent' ? new Map<VertexId, ConceptSpace>() : result.walk.casts;
  const nameAt = (v: VertexId, id: string): string => { const sp = spaces.get(v); return sp ? nameIn(sp, id) : id; };
  const where = (act: BornAct): string => (act.edge.id === here ? `here, on ${edgeWords(act.from, act.to)}` : `at ${act.siteId !== null ? L(act.siteId) : 'its midpoint'}, on ${edgeWords(act.from, act.to)}`);
  const pairWords = (act: BornAct): string => `${nameAt(act.from, act.pair[0])} ≡ ${nameAt(act.to, act.pair[1])}`;
  if (result.state === 'absent') {
    // COPY-1 §11.8: a face reads pairs — an edge the transport reads nothing across is named (a corner edge by the parent edge whose pairings would fill it)
    const unpairedWords = result.unpaired.map((u) => (u.kind === 'corner' && u.descent ? edgeByName(shape, u.descent.from, u.descent.to) : edgeByName(shape, u.from, u.to))).join(' or ');
    return (
      <span data-midpoint-born-face-state="absent" data-midpoint-born-face-absent={result.missing.length ? 'no-space' : 'unpaired'} className="grid gap-0.5 text-stone-400">
        <span>{result.missing.length ? `${head} · no reading: ${result.missing.map(L).join(' · ')} ${result.missing.length === 1 ? 'holds' : 'hold'} no space here` : `${head} · no reading yet: nothing paired on ${unpairedWords}${relatedInWordWords(shape, cycle)}`}</span>
        <FaceThree shape={shape} cycle={cycle} faceId={faceId} />
      </span>
    );
  }
  if (result.state === 'refused') {
    return (
      <div data-midpoint-born-face-state="refused" className="rounded border border-rose-900 bg-rose-950/30 px-2 py-1 text-rose-200">
        <span className="block">{`${head} · not a face: one of a corner's tuples would get two values (each edge keeps its own record)`}</span>
        {result.refusals.map((r, i) => (
          <span key={i} data-midpoint-born-face-refusal={`${L(r.corner)}|${r.kind}|${r.inherited ? 'inherited' : 'born'}`} className="block">
            {`${L(r.corner)}'s record: ${tupleWords(r.first)}, and also ${tupleWords(r.second)}, once ${r.merged.map(([x, y]) => `${nameAt(r.corner, x)} and ${nameAt(r.corner, y)}`).join(' · ')} are made one; `}
            {r.inherited ? (
              <span data-midpoint-born-face-inherited="true">this comes from the seed face: the solid's own, changed at the seed edges' midpoints</span>
            ) : (
              <>
                {'through the pair'}{r.through.length === 1 ? '' : 's'}{': '}
                {r.through.map((act, k) => (
                  withdraw ? (
                    <button key={k} type="button" data-midpoint-born-face-withdraw={`${act.edge.id}|${act.stored[0]}|${act.stored[1]}`} className="mr-2 underline" onClick={() => withdraw(act.edge.id, act.stored[0], act.stored[1])}>
                      {`withdraw ${pairWords(act)} ${where(act)}`}
                    </button>
                  ) : (
                    <span key={k} data-midpoint-born-face-hand-words={`${act.edge.id}|${act.stored[0]}|${act.stored[1]}`} className="mr-2">
                      {`withdraw ${pairWords(act)} ${where(act)}`}
                    </span>
                  )
                ))}
              </>
            )}
          </span>
        ))}
      </div>
    );
  }
  return (
    <div data-midpoint-born-face-state="read" className="grid gap-0.5 text-stone-400">
      <span>{head}</span>
      <FaceThree shape={shape} cycle={cycle} faceId={faceId} />
      {result.readings.map((r, k) => {
        const rot = [result.walk.steps[k], result.walk.steps[(k + 1) % 3], result.walk.steps[(k + 2) % 3]];
        const broken = rot.map((step) => ({ step, roles: r.und.filter((u) => u.brokeAt.from === step.from && u.brokeAt.to === step.to).map((u) => u.role) })).filter((b) => b.roles.length);
        return (
          <span key={r.corner} data-midpoint-born-face-corner={L(r.corner)} data-midpoint-born-face-news-count={String(r.news.length)} data-midpoint-born-face-und={String(r.und.length)} className="grid">
            <span className="text-stone-100">{`at ${L(r.corner)}`}</span>
            <span data-midpoint-born-face-line="ground" className="text-stone-500">{`from the solid alone: ${r.solid.fix.length} ${r.solid.fix.length === 1 ? 'returns' : 'return'} to ${r.solid.fix.length === 1 ? 'itself' : 'themselves'}, ${r.solid.mov.length} elsewhere, ${r.solid.und.length} ${r.solid.und.length === 1 ? "doesn't" : "don't"} return`}</span>
            {r.news.length ? r.news.map((n) => (
              <span key={n.role} data-midpoint-born-face-news={`${n.role}|${n.to}`} className="text-amber-200">
                {`+ ${nameAt(r.corner, n.role)} ${n.role === n.to ? 'returns to itself' : `returns as ${nameAt(r.corner, n.to)}`}, through the pair${n.through.length === 1 ? '' : 's'} ${n.through.map((act) => `${pairWords(act)} at ${act.siteId !== null ? L(act.siteId) : edgeWords(act.from, act.to)}`).join(' · ')}`}
              </span>
            )) : (
              <span data-midpoint-born-face-line="no-news">the pairs add nothing here yet</span>
            )}
            <span data-midpoint-born-face-line="und">{`${r.und.length} ${r.und.length === 1 ? "doesn't" : "don't"} return${broken.length ? `: ${broken.map((b) => `${b.roles.map((x) => nameAt(r.corner, x)).join(', ')} ${b.roles.length === 1 ? 'breaks' : 'break'} at ${edgeWords(b.step.from, b.step.to)}`).join(', ')}` : ''}`}</span>
            <span data-midpoint-born-face-line="core">{`the core of the face at ${L(r.corner)}: ${r.full.core.length} of its ${r.full.ambient.length} roles`}</span>
          </span>
        );
      })}
      {/* Und's two hands, ONCE per edge of the face, where first — the device never chooses between them */}
      {result.walk.steps.filter((step) => result.readings.some((r) => r.und.some((u) => u.brokeAt.from === step.from && u.brokeAt.to === step.to))).map((step) => (
        <span key={`${step.from}|${step.to}`} data-midpoint-born-face-hands={edgeWords(step.from, step.to)} className="text-stone-300">
          {`${step.edge.id === here ? `the pair here, on ${edgeWords(step.from, step.to)}` : `the pair at ${step.siteId !== null ? L(step.siteId) : 'its midpoint'}, on ${edgeWords(step.from, step.to)}`}`}
          {step.descent ? ` · or an act on ${edgeWords(step.descent.from, step.descent.to)}, the edge it comes from` : ''}
        </span>
      ))}
    </div>
  );
}

/**
 * C-5 — THE FACE'S READING, where the person reaches it: in the corners tab, beside the opposite corner seen through this
 * face. The three records around the face are walked in turn in D14's direction and read at each corner; the name already
 * gives the order (COPY-1 §4.7: the walk's arrows go). THE GUARD: the colimit is attempted, never assumed — a refusal names
 * the two tuples with their values, the corner, the merged pair, and offers the three acts as hands, each saying where.
 */
// C-10: EXPORTED for the Manuscript's card — see BornFaceRecord
/** THE-ALTITUDE · slice 4 (finding 10): the edges of a face's cycle that hold a relating in a word — named on the face's absent line, which reads pairs */
const relatedInWordWords = (shape: Shape, cycle: [VertexId, VertexId, VertexId]): string => {
  const L = (v: VertexId): string => labelOf(shape, v);
  const edges = cycle.map((v, k) => edgeBetween(shape.edges, v, cycle[(k + 1) % 3])).filter((e): e is Edge => !!e && relatingsHeld(e).some((r) => r[3] === '+' && r[0] !== IS));
  return edges.length ? `; related in a word on ${edges.map((e) => edgeByName(shape, e.vertexIds[0], e.vertexIds[1])).join(' and ')}` : '';
};
/** the midpoint the Ambo made on an edge, if the edge has one — by its making (two source corners), never by name */
const midpointVertexOf = (shape: Shape, e: Edge): VertexId | null => Object.values(shape.vertices).find((v) => v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(e.vertexIds[0]) && v.createdBy.sourceVertexIds.includes(e.vertexIds[1]))?.id ?? null;

/** THE-ALTITUDE · slice 3 (the designer's §8; §19.3: "the sitting opens on a face, its three shown as the given"): where a face is read, its THREE
 * lights — each corner's roles in the other two, by count — each with `open` where the edge has a midpoint: the midpoint is selected and the light
 * asked for through the store; the surface at that site (this one, when the edge is here) takes the request and opens the light */
export function FaceThree({ shape, cycle, faceId }: { shape: Shape; cycle: [VertexId, VertexId, VertexId]; faceId: string | null }) {
  const requestLight = useGeometryStore((s) => s.requestLight);
  const selectVertex = useGeometryStore((s) => s.selectVertex);
  if (!faceId) return null;
  const L = (v: VertexId): string => labelOf(shape, v);
  return (
    <span data-midpoint-face-three="true" className="grid gap-0.5">
      {cycle.map((z, k) => {
        const x = cycle[(k + 1) % 3]; const y = cycle[(k + 2) % 3];
        const alt = altitudeOf(shape, faceId, z);
        const n = alt ? sayingsOf(alt.entries).length : 0;
        const e = edgeBetween(shape.edges, x, y) ?? null;
        const mid = e ? midpointVertexOf(shape, e) : null;
        const open = mid ? () => { requestLight(mid, z); selectVertex(mid); } : null;
        return (
          <span key={z} data-midpoint-face-light={L(z)} data-midpoint-face-light-count={String(n)} className="text-stone-400">
            {`${L(z)}'s roles in ${L(x)} and ${L(y)}: ${n === 0 ? 'none yet' : `${n} ${n === 1 ? 'relating' : 'relatings'}`}`}
            {open ? <>{' · '}<button type="button" data-midpoint-face-open={L(z)} className="underline hover:text-amber-100" onClick={open}>open</button></> : null}
          </span>
        );
      })}
    </span>
  );
}

export function FaceRecord({ shape, cycle, faceName, here, hands = 'act', faceId: faceIdGiven }: { shape: Shape; cycle: [VertexId, VertexId, VertexId]; faceName: string; here: Edge['id'] | null; hands?: 'act' | 'words'; faceId?: string }) {
  const withdrawRolePair = useGeometryStore((s) => s.withdrawRolePair);
  // C-8: the three corners' spaces through the one resolver (a seed corner's cast — this block mounts on seed faces alone)
  const casts = useMemo(() => Object.fromEntries(cycle.map((v) => [v, spaceOf(shape, v)?.space])) as Record<VertexId, ConceptSpace | undefined>, [shape, cycle]);
  // D20 — the face's three steps are read through the TRANSPORT's step (`transportStepOf`: the cargo's J — his IS pairs on a seed edge, his and
  // the inherited on a medial one, the coordinate map on a corner edge), so the face reading and the cargo's walk read ONE structure by
  // construction; on a seed face (where this block mounts) the step is his IS pairs, as before
  const result = useMemo(() => (cycle.every((v) => casts[v]) ? faceBy(cycle, casts, shape.edges, (from, to) => transportStepOf(shape, from, to)) : null), [cycle, casts, shape]);
  // MODES-1 · B3 (defect 2): a role by its corner's own name, from the cast the face reads
  const nameAt = (v: VertexId, id: string): string => { const sp = casts[v]; return sp ? nameIn(sp, id) : id; };
  if (!result) return null; // a corner without a cast: the corner's line already says `no cast`
  const L = (v: VertexId): string => labelOf(shape, v);
  const walkWords = `${L(cycle[0])} → ${L(cycle[1])} → ${L(cycle[2])} → ${L(cycle[0])}`;
  const head = `face ${faceName}`;
  const edgeWords = (from: VertexId, to: VertexId): string => `${L(from)}–${L(to)}`;
  // the face's id from its SOURCE where the caller has it (the corners tab: the light's own face); else the triangle holding the three corners
  const faceId = faceIdGiven ?? shape.faces.find((f) => f.vertexIds.length === 3 && cycle.every((v) => f.vertexIds.includes(v)))?.id ?? null;
  const three = <FaceThree shape={shape} cycle={cycle} faceId={faceId} />;
  if (result.state === 'absent') {
    return (
      <span data-midpoint-face-reading={faceName} data-midpoint-face-state="absent" className="grid gap-0.5 text-stone-400">
        <span>{`${head} · no reading yet: nothing paired on ${result.missing.map((m) => edgeByName(shape, m.from, m.to)).join(' or ')}${relatedInWordWords(shape, cycle)}`}</span>{/* COPY-1 §11.8: a face reads pairs; finding 10: the edges related in a word are named */}
        {three}
      </span>
    );
  }
  if (result.state === 'refused') {
    return (
      <div data-midpoint-face-reading={faceName} data-midpoint-face-state="refused" className="rounded border border-rose-900 bg-rose-950/30 px-2 py-1 text-rose-200">
        <span className="block">{`${head} · not a face: walking the three edges around it gives one of a corner's tuples two values (each edge keeps its own record)`}</span>
        {result.refusals.map((r, i) => (
          <span key={i} data-midpoint-face-refusal={`${L(r.corner)}|${tupleWords(r.first)}|${tupleWords(r.second)}|${r.merged.map(([x, y]) => `${x}≡${y}`).join(',')}`} className="block">
            {`${L(r.corner)}'s record: ${tupleWords(r.first)}, and also ${tupleWords(r.second)}, once the walk through ${cycle.map((v, k) => edgeWords(v, cycle[(k + 1) % 3])).join(', ')} makes ${r.merged.map(([x, y]) => `${nameAt(r.corner, x)} and ${nameAt(r.corner, y)}`).join(' · ')} one. Withdraw one of the three: `}
            {r.hands.map((h, k) => (
              hands === 'act' ? (
                <button key={k} type="button" data-midpoint-face-withdraw={`${h.edge.id}|${h.pair[0]}|${h.pair[1]}`} data-midpoint-face-here={h.edge.id === here ? 'true' : undefined} className="mr-2 underline" onClick={() => withdrawRolePair(h.edge.id, h.pair[0], h.pair[1])}>
                  {`withdraw ${nameAt(h.from, h.pair[0])} ≡ ${nameAt(h.to, h.pair[1])} ${h.edge.id === here ? 'here' : `on ${edgeWords(h.from, h.to)}`}`}
                </button>
              ) : (
                <span key={k} data-midpoint-face-hand-words={`${h.edge.id}|${h.pair[0]}|${h.pair[1]}`} className="mr-2">
                  {`withdraw ${nameAt(h.from, h.pair[0])} ≡ ${nameAt(h.to, h.pair[1])} on ${edgeWords(h.from, h.to)}`}
                </span>
              )
            ))}
          </span>
        ))}
      </div>
    );
  }
  return (
    <div data-midpoint-face-reading={faceName} data-midpoint-face-state="read" data-midpoint-face-walk={walkWords} className="grid gap-0.5 text-stone-400">
      <span>{head}</span>
      {three}
      {result.readings.map((r) => {
        const by = undByStep(r).filter((s) => s.roles.length);
        return (
          <span key={r.corner} data-midpoint-face-corner={L(r.corner)} data-midpoint-face-fix={String(r.fix.length)} data-midpoint-face-mov={String(r.mov.length)} data-midpoint-face-und={String(r.und.length)} data-midpoint-face-core={String(r.core.length)} className="grid">
            <span className="text-stone-100">{`at ${L(r.corner)}`}</span>
            {r.fix.length === 0 && r.mov.length === 0 ? (
              <span data-midpoint-face-line="none">nothing returns</span>
            ) : (
              <>
                <span data-midpoint-face-line="fix">{`return to themselves: ${r.fix.length ? r.fix.map((x) => nameAt(r.corner, x)).join(' · ') : 'none'}`}</span>
                <span data-midpoint-face-line="mov">{`return elsewhere: ${r.mov.length ? r.mov.map(([x, y]) => `${nameAt(r.corner, x)} as ${nameAt(r.corner, y)}`).join(' · ') : 'none'}`}</span>
              </>
            )}
            <span data-midpoint-face-line="und">{`${r.und.length} ${r.und.length === 1 ? "doesn't" : "don't"} return${r.und.length ? `: ${by.map((s) => `${s.roles.map((x) => nameAt(r.corner, x)).join(', ')} ${s.roles.length === 1 ? 'breaks' : 'break'} at ${edgeWords(s.from, s.to)}`).join(', ')}` : ''}`}</span>
            <span data-midpoint-face-line="core">{`the core of the face at ${L(r.corner)}: ${r.core.length} of its ${r.ambient.length} roles`}</span>
          </span>
        );
      })}
    </div>
  );
}

/** LAYOUT-1 §2 — the midpoint view's inputs for a selected vertex: its site and the three resolved spaces, or null (a corner, or a midpoint whose parents hold no space) */
export function midpointViewOf(shape: Shape, vertexId: VertexId, options: SpaceOfOptions = {}): { site: MidpointSite; parents: [Resolved, Resolved]; resolved: Resolved } | null {
  const report = buildGeneralSitePacketPresenterReport(shape);
  const packet = report.packets.find((p) => p.trace.siteId === vertexId) ?? null;
  const site = midpointSiteOf(shape, vertexId, packet ? packet.trace : null);
  if (!site) return null;
  const memo = new Map<VertexId, Resolved | null>();
  const a = spaceOf(shape, site.a, options, memo);
  const b = spaceOf(shape, site.b, options, memo);
  const self = spaceOf(shape, vertexId, options, memo);
  // STAMP MODES-3: the view opens when both parents hold a COLUMN space — a seed corner's cast, a born corner's child with a relating
  // (M10, the designer's 16:26 §1b: a midpoint whose parent holds no relating says so before the click)
  const ca = columnSpaceOf(shape, site.a, options);
  const cb = columnSpaceOf(shape, site.b, options);
  return a && b && self && ca && cb ? { site, parents: [a, b], resolved: self } : null;
}

/** LAYOUT-1 §2 — THE MIDPOINT VIEW on the page: the surface, full, with the strip's small solid in its slot; the store is read here and passed down */
export function MidpointView({ view, minimap }: { view: { site: MidpointSite; parents: [Resolved, Resolved]; resolved: Resolved }; minimap?: ReactNode }) {
  const shape = useGeometryStore((s) => s.shapes[s.currentShapeId]);
  const refusals = useGeometryStore((s) => s.midpointRefusals);
  const remades = useGeometryStore((s) => s.midpointRemade);
  return <MidpointSurface shape={shape} site={view.site} parents={view.parents} resolved={view.resolved} refusal={refusals[view.site.edge.id] ?? null} remade={remades[view.site.edge.id] ?? null} minimap={minimap} full />;
}

/**
 * THE CONCEPT LAYER ON THE CANVAS — for the selected vertex: an ambo site whose parents BOTH hold a cast shows the
 * midpoint's surface; any other vertex shows its own inside (or nothing). The store is read here and passed down.
 * (On the page the midpoint view replaces the solid — App.tsx; this overlay stays for a corner's cast and for the witnesses.)
 */
export function ConceptSurface({ shape, vertexId }: { shape: Shape; vertexId: VertexId }) {
  const tauDrafts = useGeometryStore((s) => s.edgeTauDrafts);
  const refusals = useGeometryStore((s) => s.midpointRefusals);
  const remades = useGeometryStore((s) => s.midpointRemade);
  const view = useMemo(() => midpointViewOf(shape, vertexId, { tauDrafts }), [shape, vertexId, tauDrafts]);
  if (view) {
    return <MidpointSurface shape={shape} site={view.site} parents={view.parents} resolved={view.resolved} refusal={refusals[view.site.edge.id] ?? null} remade={remades[view.site.edge.id] ?? null} />;
  }
  // C-8 item 2 (Δ86): a born vertex holding a LOADED cast — a workspace saved before the loader's whitelist, or the old route — is SAID, never read and never silently preferred
  const loadedIgnored = holdsLoadedCast(shape, vertexId);
  return (
    <>
      {loadedIgnored ? (
        <div data-midpoint-loaded-ignored={vertexId} className="pointer-events-auto absolute left-3 top-14 rounded border border-amber-900 bg-stone-950/85 px-3 py-2 text-xs text-amber-200">
          {`${labelOf(shape, vertexId)} holds a loaded cast that isn't read: a midpoint's space comes from its parents`}
        </div>
      ) : null}
      <CastInsidePanel shape={shape} vertexId={vertexId} />
    </>
  );
}

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

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ConceptSpace, Edge, EdgeIdentification, Shape, VertexId } from '../types/geometry';
import { useGeometryStore, type MidpointRefusal, type MidpointRemade } from '../store/geometryStore';
import { buildGeneralSitePacketPresenterReport, type GeneralSitePacketTrace } from '../lib/generalSitePacketPresenterV0';
import { composeCornerCycleName, d14NameRotation } from '../lib/cornerCycleName';
import { edgeBetween, faceOf, undByStep, type FaceTuple } from '../lib/faceReading';
import { ALONG, AGAINST, barsOn, dirOf, instancesOn, IS, type Dir, type Relating } from '../lib/relatings';
import { sortingOf } from '../lib/sorting';
import { childSpaceOf, instancesWithInherited, termWordsOf } from '../lib/instanceSpace';
import { MediumChoices, MediumModes, MediumPoint, MediumRefusals, useMediumAttrs } from './MediumBlock';
import { HelpNote, Hint } from './HelpNote';

/** MODES-1 · B3 — the face reading reads the IS-instances through the one reader, never the plain record (defect 1) */
const readInstances = (e: Edge): Array<[string, string]> => instancesOn(e).filter((r) => r[0] === IS).map((r) => [r[1], r[2]] as [string, string]);
import { bornFaceOf, readAlike, type BornAct, type BornFaceResult } from '../lib/bornFace';
import { insideOf, type Inside, type InsidePoint } from '../lib/castInside';
import { traceOf, type Midpoint, type ParentTrace, type Side } from '../lib/midpointGlue';
import { type Conflict } from '../lib/jRegister';
import { isMoldType } from '../lib/castLoader';
// C-8 — THE RESOLVER: the chooser and the surface read `spaceOf`, never `data.cast` (a seed corner's cast; a born corner's
// space derived from its parents over the J its edge's kind fixes); the record's home and the site by generation
import { generationOf, holdsLoadedCast, isSeedVertex, nameIn, spaceCounts, spaceOf, type Resolved, type SpaceOfOptions } from '../lib/spaceOf';
import type { RespectReading, RespectTuple } from '../lib/respects'; // C-14 f — the readings as the resolver hands them
import { CastInsidePanel, InsideColumn, insideGeometry, type InsideGeometry, type MarkExtra, type PointExtra } from './CastInsideDiagram';

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
export interface NeighbourActs {
  edgeLabel: string; // `A–C` in the edge's own corner order
  present: boolean;
  roles: EdgeIdentification['roles'];
  types: EdgeIdentification['types'];
  roleWords: Array<[string, string]>; // the role pairs as a person reads them — the spaces' labels
}

export const neighbourActsOn = (shape: Shape, x: VertexId, y: VertexId): NeighbourActs => {
  const edge = shape.edges.find((e) => (e.vertexIds[0] === x && e.vertexIds[1] === y) || (e.vertexIds[0] === y && e.vertexIds[1] === x));
  const rec = edge?.identification;
  const edgeLabel = edge ? `${labelOf(shape, edge.vertexIds[0])}–${labelOf(shape, edge.vertexIds[1])}` : `${labelOf(shape, x)}–${labelOf(shape, y)}`;
  // C-8: a born pair's record holds the endpoint spaces' own ids (a glued space's id is a local key) — the words are the spaces' labels
  const U = edge ? spaceOf(shape, edge.vertexIds[0]) : null;
  const V = edge ? spaceOf(shape, edge.vertexIds[1]) : null;
  const roles = rec?.roles ?? [];
  return { edgeLabel, present: !!rec && (rec.roles.length > 0 || rec.types.length > 0), roles, types: rec?.types ?? [], roleWords: roles.map(([a, b]) => [U ? nameIn(U.space, a) : a, V ? nameIn(V.space, b) : b] as [string, string]) };
};

/** COPY-1 §4.7: `on A–C: F2 ≡ r0 · F4 ≡ r1 · part ≡ part` · `nothing paired on B–C yet` */
export const neighbourActsWords = (n: NeighbourActs): string =>
  n.present ? `on ${n.edgeLabel}: ${[...n.roleWords.map(([x, y]) => `${x} ≡ ${y}`), ...n.types.map(([s, t]) => `${s} ≡ ${t}`)].join(' · ')}` : `nothing paired on ${n.edgeLabel} yet`;

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

/** LAYOUT-1 §6 — the pairing's ? note, verbatim */
export const PAIRING_HELP = [
  'relate: choose the mode above, then click a point in A and a point in B',
  'translate: switch to words, then click a word in each row',
  'triad: open a corner\'s light, then click a point in A, one in the corner and one in B',
];

type Hover = { kind: 'point'; column: 'A' | 'B' | 'L'; id: string; name: string } | { kind: 'line'; key: string } | { kind: 'child'; label: string } | null;
type Tab = 'point' | 'modes' | 'corners' | 'traces';

/** a drawn line between two columns: a pair (IS), a relating in a mode, or a bar — LAYOUT-1 §5's glyphs */
interface DrawnLine {
  key: string;
  kind: 'pair' | 'relating' | 'bar';
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
  const castA = parents[0].space;
  const castB = parents[1].space;
  // C-8: a glued space's role id is a LOCAL key (`A:r3`, `F1≡r0`) — a person reads the space's label for it, never the key
  const nA = (id: string): string => nameIn(castA, id);
  const nB = (id: string): string => nameIn(castB, id);
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
  const insideA = useMemo(() => insideOf(castA), [castA]);
  const insideB = useMemo(() => insideOf(castB), [castB]);
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
  // the legs of an open light (the relatings on A–C and C–B, pairs included), drawn as AB's are (LAYOUT-1 §4)
  const legEdges = useMemo(() => (light === null ? null : { ac: edgeBetween(shape.edges, site.a, light) ?? null, cb: edgeBetween(shape.edges, light, site.b) ?? null }), [shape, site.a, site.b, light]);
  const spokenLabels = core ? core.spoken.map((v) => labelOf(shape, v)) : [];
  const lightsWords = spokenLabels.length === 0 ? '' : spokenLabels.length === 1 ? `in ${spokenLabels[0]}'s light` : `in ${spokenLabels.slice(0, -1).map((l) => `${l}'s light`).join(', ')} and in ${spokenLabels[spokenLabels.length - 1]}'s`;
  const byLights = (kind2: 'role' | 'word', pair: [string, string]): boolean => !!core && (kind2 === 'role' ? core.meet.roles : core.meet.types).some((p) => p[0] === pair[0] && p[1] === pair[1]) && !(kind2 === 'role' ? core.unconditional.roles : core.unconditional.types).some((p) => p[0] === pair[0] && p[1] === pair[1]);
  const state = refusedRecord ? 'record-in-conflict' : roles.length === 0 && types.length === 0 && composed.roles.length === 0 && composed.words.length === 0 ? 'unglued' : 'glued';
  // C-8 item 3 — the composed identity's roles in the unfolding (by side); the corners it shares
  const composedA = useMemo(() => new Map(composed.roles), [composed]);
  const composedB = useMemo(() => new Map(composed.roles.map(([a, b]) => [b, a] as [string, string])), [composed]);
  const composedWordsA = useMemo(() => new Set(composed.words.map(([a]) => a)), [composed]);
  const composedWordsB = useMemo(() => new Set(composed.words.map(([, b]) => b)), [composed]);
  const cornerWords = (key: string): string => (composed.corners.get(key) ?? []).map((id) => labelOf(shape, id)).join(' · ');
  const cornersAll = [...new Set([...composed.corners.values()].flat())].map((id) => labelOf(shape, id)).join(' · ');
  // C-8 item 5 — the record's HOME (the edge, its kind, its generation) and the SITE (where the person stands), derived from what made them
  const edgeGen = Math.max(generationOf(shape, site.a), generationOf(shape, site.b));
  const siteGen = generationOf(shape, site.siteId);
  // MODES-2 (a): the born-room sentence counts what the columns hold — each corner's CHILD (its relatings, `childSpaceOf`: the same reader
  // the block's head counts with, so one card carries one count, §149) — and what is related here (every mode, the head's own word);
  // at a corner site the seed is the carried side, whichever corner is stored first
  const childCounts = useMemo(() => ({ a: childSpaceOf(shape, site.a)?.roles.length ?? 0, b: childSpaceOf(shape, site.b)?.roles.length ?? 0 }), [shape, site.a, site.b]);
  const relatedHere = useMemo(() => instancesWithInherited(shape, sourceEdge).length, [shape, sourceEdge]); // D15: his relatings and the inherited ≡ — the head's own reader
  const seedFirst = shape.vertices[site.a]?.createdBy.operation === 'seed';
  // LAYOUT-1 §4 / §9.15 — THE CONCEPT'S DIAGRAM: the child (his relatings as its points, the relations of his casts they carry as its arcs)
  const child = useMemo(() => childSpaceOf(shape, site.siteId), [shape, site.siteId]);
  // each point labelled by its sentence (`(F5 ≡ Φ7)`), through the one reader of an instance's words — the key is never printed as a name
  const childInside = useMemo(() => (child && child.roles.length > 0 ? insideOf({ ...child, roles: child.roles.map((r) => ({ ...r, label: termWordsOf(shape, site.siteId, r.id) })) }) : null), [child, shape, site.siteId]);
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
  const g0A = useMemo(() => insideGeometry(insideA, { top: TOP }), [insideA]);
  const g0B = useMemo(() => insideGeometry(insideB, { top: TOP }), [insideB]);
  const g0L = useMemo(() => (lightInside ? insideGeometry(lightInside, { top: TOP }) : null), [lightInside]);
  const gA = useMemo(() => insideGeometry(insideA, { top: TOP, px: g0A.leftReach + 8 }), [insideA, g0A]);
  const gL = useMemo(() => (lightInside && g0L ? insideGeometry(lightInside, { top: TOP, px: gA.px + g0A.rightReach + LIGHT_GAP + g0L.leftReach }) : null), [lightInside, g0L, gA, g0A]);
  const gB = useMemo(() => insideGeometry(insideB, { top: TOP, px: (gL && g0L ? gL.px + g0L.rightReach + LIGHT_GAP : gA.px + g0A.rightReach + FOLD) + g0B.leftReach }), [insideB, gA, g0A, g0B, gL, g0L]);
  const foldX = gL ? gL.px : gA.px + g0A.rightReach + FOLD / 2;
  const width = gB.px + g0B.rightReach + 8;
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
  const openLight = (apex: VertexId | null): void => { setLight(apex); setTriadPicks({}); setWordTriadPicks({}); setPick(null); setWordPick(null); setSplit(apex === null ? 0.57 : 0.74); };
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
  pairLines.forEach((l, i) => {
    if (l.iA < 0 || l.iB < 0) return;
    drawn.push({ key: `pair|${l.x}|${l.y}`, kind: 'pair', from: { g: gA, index: l.iA, column: 'A', id: l.x }, to: { g: gB, index: l.iB, column: 'B', id: l.y }, word: null, index: i + 1, faint: light !== null, attrs: { 'data-midpoint-line': `${l.x}≡${l.y}`, ...(remadeNote('role', [l.x, l.y]) ? { 'data-midpoint-remade': remadeNote('role', [l.x, l.y]) as string } : {}) } });
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
  const litPoint = (column: 'A' | 'B' | 'L', id: string): boolean => {
    if (!hover) return false;
    if (hover.kind === 'point') return (hover.column === column && hover.id === id) || drawn.some((l) => lit(l) && ((l.from.column === column && l.from.id === id) || (l.to.column === column && l.to.id === id)));
    if (hover.kind === 'line') return drawn.some((l) => l.key === hover.key && ((l.from.column === column && l.from.id === id) || (l.to.column === column && l.to.id === id)));
    if (hover.kind === 'child') { const n = column === 'A' ? nA(id) : column === 'B' ? nB(id) : nL(id); return hover.label.includes(n); }
    return false;
  };
  const pointExtra = (side: Side) => (point: { id: string }): PointExtra => {
    // C-8 item 3 (the designer): the composed identity is NOT A PAIR and is never drawn as one — no stroke across the fold,
    // no control, never pickable; the mark shrinks to the least — a HOLLOW ring and the solid's grey; the sentence states the identity once
    const column = side === 'A' ? 'A' : 'B';
    const partner = side === 'A' ? composedA.get(point.id) : composedB.get(point.id);
    const dim = hover !== null && !litPoint(column, point.id);
    if (partner !== undefined) {
      const corners = cornerWords(`${side === 'A' ? 0 : 1}|${point.id}`);
      return { solid: true, dim, attrs: { 'data-midpoint-side': side, 'data-midpoint-composed': corners } };
    }
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
  const bothExtra = (side: Side, inside: Inside) => {
    const cmap = side === 'A' ? composedA : composedB;
    const cwords = side === 'A' ? composedWordsA : composedWordsB;
    const composedTuple = (type: string, terms: string[]): boolean => terms.length > 0 && terms.every((t) => cmap.has(t)) && (cwords.has(type) || isMoldType(type));
    const dimArc = (terms: string[]): boolean => hover !== null && !terms.some((t) => litPoint(side === 'A' ? 'A' : 'B', t));
    const origin = (type: string, terms: string[]): MarkExtra | null => {
      const dim = dimArc(terms);
      if (M?.originOf[side].get(`${type}|${JSON.stringify(terms)}`) === 'both') {
        return composedTuple(type, terms) ? { solid: true, dim, attrs: { 'data-midpoint-composed-tuple': side } } : { emphasis: true, glyph: '≡', dim, attrs: { 'data-midpoint-both': side } };
      }
      return dim ? { dim } : null;
    };
    return {
      arc: (arc: { type: string; from: number; to: number }) => origin(arc.type, [inside.points[arc.from].id, inside.points[arc.to].id]),
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
  const solidOpen = refusal?.solid?.open ?? null;
  const solidEdgeWords = refusal?.solid?.edge ? `${labelOf(shape, refusal.solid.edge[0])}–${labelOf(shape, refusal.solid.edge[1])}` : null;
  const refusalBox = refusal ? (
    <div data-midpoint-refusal={`${refusal.act.kind}|${refusal.act.pair[0]}|${refusal.act.pair[1]}`} data-midpoint-refusal-dependency={dep ? `${dep.edgeId}|${dep.act.pair[0]}|${dep.act.pair[1]}|${dep.generationsUp}` : undefined} data-midpoint-refusal-solid={refusal.solid ? `${refusal.solid.role}|${refusal.solid.others[0]}|${refusal.solid.others[1]}|${refusal.solid.paired ? 'paired' : 'unpaired'}` : undefined} className="my-1 rounded border border-rose-900 bg-rose-950/30 px-2 py-1 text-rose-200">
      {dep ? (
        <>
          <span data-midpoint-refusal-act="true" data-midpoint-refusal-collision="true" className="block">{`not taken — ${depAct} would break the pair ${dep.names[0]} ≡ ${dep.names[1]} at ${depSite}, ${depGens}: ${dep.why}`}</span>
          <span className="mt-1 block text-stone-300">
            <button type="button" data-midpoint-withdraw={`attempt|${refusal.act.pair[0]}|${refusal.act.pair[1]}`} data-midpoint-withdraw-attempt="true" className="mr-3 underline" onClick={() => withdrawMidpointAttempt(edgeId)}>clear</button>
            <button type="button" data-midpoint-dependency-withdraw={`${dep.edgeId}|${dep.act.kind}|${dep.act.pair[0]}|${dep.act.pair[1]}`} className="mr-3 underline" onClick={() => (dep.act.kind === 'role' ? withdrawRolePair(dep.edgeId, dep.act.pair[0], dep.act.pair[1]) : withdrawWordPair(dep.edgeId, dep.act.pair[0], dep.act.pair[1]))}>
              {`withdraw ${dep.names[0]} ≡ ${dep.names[1]} at ${depSite} first`}
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
  const sentence = state === 'glued'
    ? kind === 'seed'
      ? `${roles.length} ${roles.length === 1 ? 'role pair' : 'role pairs'} · ${types.length} ${types.length === 1 ? 'word pair' : 'word pairs'}`
      : kind === 'corner'
        ? `${seedFirst ? la : lb}'s ${composed.roles.length} roles and ${composed.words.length} words are carried into ${seedFirst ? lb : la} as one, composed by the solid`
        : `${cornersAll}'s ${composed.roles.length} roles and ${composed.words.length} words stand on both sides as one, composed by the solid · ${la}'s ${childCounts.a} relatings beside ${lb}'s ${childCounts.b} · ${relatedHere ? `${relatedHere} related` : 'none related yet'}`
    : state === 'record-in-conflict'
      ? `this edge's record contradicts itself${kind === 'medial' ? " under the solid's identity" : ''}; withdraw one of the pairs below`
      : null;

  const nameIt = (
    naming ? (
      <span className="inline-flex items-center gap-1" data-midpoint-name-field="true">
        <input
          autoFocus
          value={nameDraft}
          onChange={(e) => setNameDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { updateSelectedVertexData({ label: nameDraft.trim() }); setNaming(false); } }}
          placeholder="a name"
          className="w-36 rounded border border-stone-600 bg-stone-900 px-1 py-0.5 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-300"
        />
        <button type="button" data-midpoint-name-save="true" className="underline" onClick={() => { updateSelectedVertexData({ label: nameDraft.trim() }); setNaming(false); }}>name it</button>
      </span>
    ) : (
      <button type="button" data-midpoint-name-it="true" className="underline text-stone-300" onClick={() => { setNameDraft(lm === 'unnamed' ? '' : lm); setNaming(true); }}>name it</button>
    )
  );

  // ── THE DRAWING ──
  const lineEnds = (l: DrawnLine): { x1: number; y1: number; x2: number; y2: number } => ({ x1: l.from.g.px, y1: l.from.g.yOf(l.from.index), x2: l.to.g.px, y2: l.to.g.yOf(l.to.index) });
  const drawing = (
    <div className="overflow-x-auto">
      <svg data-midpoint-drawing="true" data-midpoint-hover={hover ? (hover.kind === 'line' ? hover.key : hover.kind === 'point' ? `${hover.column}|${hover.id}` : hover.label) : undefined} width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block overflow-visible">
        <defs>
          {/* LAYOUT-1 §5: the open arrowhead at the object — one meaning everywhere: a relation from here to there */}
          <marker id={`head-${site.siteId}-ink`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M1,1 L7,4 L1,7" fill="none" className="stroke-stone-300" strokeWidth="1.2" /></marker>
          <marker id={`head-${site.siteId}-faint`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M1,1 L7,4 L1,7" fill="none" className="stroke-stone-500" strokeWidth="1.2" /></marker>
          <marker id={`head-${site.siteId}-lit`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M1,1 L7,4 L1,7" fill="none" className="stroke-stone-50" strokeWidth="1.4" /></marker>
        </defs>
        <text x={gA.px} y={14} textAnchor="middle" fontSize={12} className="fill-stone-100">{la}</text>
        {gL ? <text x={gL.px} y={14} textAnchor="middle" fontSize={12} className="fill-violet-200">{lightLabel}</text> : null}
        <text x={gB.px} y={14} textAnchor="middle" fontSize={12} className="fill-stone-100">{lb}</text>
        {gL ? null : <line x1={foldX} y1={TOP} x2={foldX} y2={columnsBottom} className="stroke-stone-800" strokeDasharray="2 4" />}
        <InsideColumn inside={insideA} geometry={gA} idPrefix={`m-${site.siteId}-a`} arcExtra={extraA.arc} loopExtra={extraA.loop} nodeExtra={extraA.node} pointExtra={pointExtra('A')} />
        {gL && lightInside ? (
          // LAYOUT-1 §5: a light's middle column in a colour used nowhere else on the page
          <g data-midpoint-light-column={light ?? undefined} className="[&_circle]:fill-violet-300 [&_circle]:stroke-violet-100 [&_.fill-stone-100]:fill-violet-100 [&_.fill-stone-300]:fill-violet-200 [&_path]:stroke-violet-300/70">
            <InsideColumn inside={lightInside} geometry={gL} idPrefix={`m-${site.siteId}-l`} pointExtra={lightPointExtra} />
          </g>
        ) : null}
        <InsideColumn inside={insideB} geometry={gB} idPrefix={`m-${site.siteId}-b`} arcExtra={extraB.arc} loopExtra={extraB.loop} nodeExtra={extraB.node} pointExtra={pointExtra('B')} />
        {drawn.map((l) => {
          const e = lineEnds(l);
          const isLit = lit(l);
          const dimmed = hover !== null && !isLit;
          const opacity = dimmed ? 0.2 : l.faint ? 0.45 : 1;
          const mx = (e.x1 + e.x2) / 2; const my = (e.y1 + e.y2) / 2;
          const head = l.kind === 'pair' ? undefined : `url(#head-${site.siteId}-${isLit ? 'lit' : l.kind === 'bar' || l.faint ? 'faint' : 'ink'})`;
          return (
            <g key={l.key} {...l.attrs} data-midpoint-line-kind={l.kind} opacity={opacity} onPointerEnter={() => setHover({ kind: 'line', key: l.key })} onPointerLeave={() => setHover(null)}>
              <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} className={l.kind === 'pair' ? 'stroke-amber-300/90' : isLit ? 'stroke-stone-50' : l.kind === 'bar' ? 'stroke-stone-500/70' : 'stroke-stone-300'} strokeWidth={l.kind === 'pair' ? 1.6 : isLit ? 1.6 : 1} strokeDasharray={l.kind === 'bar' ? '5 4' : undefined} markerEnd={head} />
              {l.kind === 'pair' ? (
                // the pair's number at the fold's height, no head (a pair has no direction)
                <text data-midpoint-line-index={String(l.index)} x={gL ? mx : foldX} y={my + 4} textAnchor="middle" fontSize={11} className="fill-amber-200" style={{ paintOrder: 'stroke', stroke: '#0c0a09', strokeWidth: 2.5, strokeLinejoin: 'round' }}>{String(l.index)}</text>
              ) : (
                // the mode's word on a small backing at the middle; a bar's struck through
                <text data-midpoint-line-word={l.word ?? ''} x={mx} y={my - 4} textAnchor="middle" fontSize={11} className={isLit ? 'fill-stone-50' : l.kind === 'bar' ? 'fill-stone-400' : 'fill-stone-200'} style={{ paintOrder: 'stroke', stroke: '#0c0a09', strokeWidth: 3, strokeLinejoin: 'round', textDecoration: l.kind === 'bar' ? 'line-through' : undefined }}>{l.word}</text>
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
        {insideA.words.map((w) => (
          <button key={w} type="button" data-midpoint-word={`A|${w}`} data-midpoint-word-translated={types.some(([s]) => s === w) ? 'true' : undefined} onClick={() => onWord('A', w)} className={wordChip('A', w)}>{w}</button>
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
        {insideB.words.map((w) => (
          <button key={w} type="button" data-midpoint-word={`B|${w}`} data-midpoint-word-translated={types.some(([, t]) => t === w) ? 'true' : undefined} onClick={() => onWord('B', w)} className={wordChip('B', w)}>{w}</button>
        ))}
      </div>
    </div>
  );

  // ── HIS ACTS under the drawing (COPY-1 §4.4), one per line, each with its hand ──
  const actsList = (
    <div data-midpoint-acts="true" className="my-1 grid gap-0.5 text-amber-200">
      {(state === 'glued' && pairLines.some((l) => l.iA >= 0 && l.iB >= 0)) || refusedLine || modeActs.relatings.length > 0 || modeActs.bars.length > 0 ? (
        <div data-midpoint-role-pairs="true" className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
          {pairLines.map((l, i) =>
            l.iA >= 0 && l.iB >= 0 ? (
              <span key={`${l.x}|${l.y}`} data-midpoint-line-listing={`${l.x}≡${l.y}`} data-midpoint-line-listing-index={String(i + 1)} data-midpoint-glued-by={byLights('role', [l.x, l.y]) ? 'lights' : 'plain'}>
                <span className="text-stone-400">{`${i + 1} `}</span>
                {byLights('role', [l.x, l.y])
                  ? `${nA(l.x)} ≡ ${nB(l.y)} · glued: you gave it ${lightsWords}`
                  : (
                    <>
                      {`${nA(l.x)} ≡ ${nB(l.y)}${kind === 'medial' ? ' · born here' : ''}${remadeNote('role', [l.x, l.y]) ? ` · ${remadeNote('role', [l.x, l.y])}` : ''} · `}
                      <button type="button" data-midpoint-withdraw={`role|${l.x}|${l.y}`} className="underline" onClick={() => withdrawRolePair(edgeId, l.x, l.y)}>withdraw</button>
                    </>
                  )}
              </span>
            ) : null,
          )}
          {refusedLine ? <span data-midpoint-refused-listing={`${refusedLine.x}≡${refusedLine.y}`} className="text-rose-300">{`${nA(refusedLine.x)} ≡ ${nB(refusedLine.y)} · not taken`}</span> : null}
          {/* MODES-4 · D13: each prints AS HE MADE IT — from A `x w y`, from B `y w x`; the entry's key carries `|←` where he made it from B */}
          {modeActs.relatings.map((r) => (
            <span key={relatingKey(r)} data-medium-relating={relatingKey(r)}>
              {`${dirOf(r) === ALONG ? `${nA(r[1])} ${r[0]} ${nB(r[2])}` : `${nB(r[2])} ${r[0]} ${nA(r[1])}`} · `}
              <button type="button" data-medium-withdraw={relatingKey(r)} className="underline" onClick={() => withdrawRelating(edgeId, r[0], r[1], r[2], dirOf(r))}>withdraw</button>
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
            <span className="text-stone-500">·</span>
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
            <HelpNote area="pairing" lines={PAIRING_HELP} />
          </div>
          <MediumChoices {...mediumProps} />
          <MediumRefusals {...mediumProps} />
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
          {half === 'roles' ? drawing : wordRows}
          {actsList}
        </section>
        {full ? <div data-midpoint-divider="true" className={`hidden w-1 shrink-0 lg:block ${light !== null ? 'cursor-col-resize bg-stone-800 hover:bg-stone-600' : 'bg-stone-800'}`} onMouseDown={() => { if (light !== null) dragging.current = true; }} /> : <div className="hidden w-px shrink-0 bg-stone-800 lg:block" />}
        {/* ── THE POINT (LAYOUT-1 §4), four tabs — every tab renders; an inactive one is hidden, never unmounted; the traces last ── */}
        <section data-midpoint-point="true" className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div data-midpoint-tabs="true" className="flex shrink-0 items-center gap-1 border-b border-stone-800 px-2">
            {tabButton('point', 'the point')}
            {tabButton('modes', 'modes')}
            {tabButton('corners', 'corners')}
            {tabButton('traces', 'traces')}
          </div>
          <div className="min-h-0 flex-1 overflow-auto px-3 py-2">
            {/* a tab's panel is hidden by the `hidden` UTILITY, never the attribute alone: a display utility on the same element would win over `[hidden]` (measured at the eye: all four panels showed) */}
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
                        {words.cornerCellFace ? ' · every role at its corner returns to itself' : (
                          <>
                            {' · '}
                            <button type="button" data-midpoint-select-face={src.faceId} className="underline hover:text-amber-100" onClick={() => selectFace(src.faceId)}>read it</button>
                          </>
                        )}
                      </span>
                    );
                  })() : null}
                </div>
              ))}
            </div>
            <div data-midpoint-trace="true" data-midpoint-panel="traces" hidden={tab !== 'traces'} className={tab === 'traces' ? 'grid gap-0.5 text-stone-300' : 'hidden'}>
              {/* C-8 item 5 — THE TRACE carries the record's HOME and the SITE (COPY-1 §4.8) */}
              <span data-midpoint-home={`${kind}|${edgeGen}|${siteGen}`} className="text-stone-400">
                {`recorded on ${la}–${lb}, a ${kind} edge (generation ${edgeGen}) · this site: ${lm}, generation ${siteGen}${kind === 'medial' ? ' · pairs beyond the shared corner are born here' : ''}`}
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
  const cast = useMemo(() => spaceOf(shape, apex)?.space, [shape, apex]);
  const inside = useMemo(() => (cast ? insideOf(cast) : null), [cast]);
  const lx = labelOf(shape, apex);
  const acts = [neighbourActsOn(shape, site.a, apex), neighbourActsOn(shape, site.b, apex)];
  const raw = acts.every((n) => !n.present);
  const holds = inside
    ? inside.census.points === 0
      ? 'a cast with no roles'
      : `a concept-space of ${inside.census.points} ${inside.census.points === 1 ? 'role' : 'roles'}, ${inside.census.arrows + inside.census.loops + inside.census.hyper} ${inside.census.arrows + inside.census.loops + inside.census.hyper === 1 ? 'relation' : 'relations'}, ${inside.census.words} ${inside.census.words === 1 ? 'word' : 'words'}`
    : 'no cast';
  const view = sorting ? sorting.views.find((v) => v.view === apex) ?? null : null;
  const hasPath = !!view && view.paths.length > 0;
  const legWords = (leg: [VertexId, VertexId]): string => `${labelOf(shape, leg[0])}–${labelOf(shape, leg[1])}`;
  const empty = foot ? [!foot.given[0] ? `${la}–${lx}` : null, !foot.given[1] ? `${lx}–${lb}` : null].filter((x): x is string => x !== null) : [];
  const silent = foot ? foot.map.size === 0 && !hasPath : !hasPath;
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
        {raw ? `nothing paired on ${acts[0].edgeLabel} or ${acts[1].edgeLabel} yet` : acts.map((n) => neighbourActsWords(n)).join(' · ')}
      </span>
      {foot || respects.length > 0 ? (
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
        <FaceRecord shape={shape} cycle={source.cycle as [VertexId, VertexId, VertexId]} faceName={source.faceName} here={site.edge.id} />
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
  const { cells, host, other, cornerCellFace } = useMemo(() => faceCellsOf(shape, faceId, cycle), [shape, faceId, cycle]);
  const forward = useMemo(() => bornFaceOf(shape, cycle), [shape, cycle]);
  const reversed = useMemo(() => (other ? bornFaceOf(shape, [cycle[0], cycle[2], cycle[1]]) : null), [shape, cycle, other]);
  if (cornerCellFace) return null;
  const L = (v: VertexId): string => labelOf(shape, v);
  const cellWords = (c: (typeof cells)[number]): string => (c.kind === 'residue' ? `the residue ${c.topology ?? 'cell'} at ${L(c.vertexIds[0])}` : `the ${c.kind === 'parent' ? 'parent' : 'core'} ${c.topology ?? 'cell'}`);
  const alike = reversed ? readAlike(forward, reversed) : true;
  return (
    <div data-midpoint-born-face={faceName} data-midpoint-born-face-cells={String(cells.length)} data-midpoint-born-face-alike={other ? (alike ? 'true' : 'false') : undefined} className="grid gap-0.5">
      <BornFaceBlock shape={shape} result={forward} head={other && host ? `face ${faceName}, between ${cellWords(host)} and ${cellWords(other)}, walked as ${cellWords(host)}'s` : `face ${faceName}`} here={here} siteId={siteId} withdraw={withdraw} />
      {other && alike ? <span data-midpoint-born-face-alike-line="true" className="text-stone-500">{`walked the other way (as ${cellWords(other)}'s), it reads the same: one reading for both cells`}</span> : null}
      {other && !alike && reversed ? <BornFaceBlock shape={shape} result={reversed} head={`walked the other way, as ${cellWords(other)}'s`} here={here} siteId={siteId} withdraw={withdraw} /> : null}
    </div>
  );
}

function BornFaceBlock({ shape, result, head, here, withdraw }: { shape: Shape; result: BornFaceResult; head: string; here: Edge['id'] | null; siteId?: VertexId; withdraw?: (edgeId: Edge['id'], x: string, y: string) => void }) {
  const L = (v: VertexId): string => labelOf(shape, v);
  const edgeWords = (from: VertexId, to: VertexId): string => `${L(from)}–${L(to)}`;
  const spaces = useMemo(() => {
    const memo = new Map<VertexId, Resolved | null>();
    const out = new Map<VertexId, ConceptSpace>();
    if (result.state === 'absent') return out;
    for (const c of result.walk.corners) { const r = spaceOf(shape, c, {}, memo); if (r) out.set(c, r.space); }
    return out;
  }, [shape, result]);
  const nameAt = (v: VertexId, id: string): string => { const sp = spaces.get(v); return sp ? nameIn(sp, id) : id; };
  const where = (act: BornAct): string => (act.edge.id === here ? `here, on ${edgeWords(act.from, act.to)}` : `at ${act.siteId !== null ? L(act.siteId) : 'its midpoint'}, on ${edgeWords(act.from, act.to)}`);
  const pairWords = (act: BornAct): string => `${nameAt(act.from, act.pair[0])} ≡ ${nameAt(act.to, act.pair[1])}`;
  if (result.state === 'absent') {
    return <span data-midpoint-born-face-state="absent" className="text-stone-400">{`${head} · no reading: ${result.missing.map(L).join(' · ')} ${result.missing.length === 1 ? 'holds' : 'hold'} no space here`}</span>;
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
export function FaceRecord({ shape, cycle, faceName, here, hands = 'act' }: { shape: Shape; cycle: [VertexId, VertexId, VertexId]; faceName: string; here: Edge['id'] | null; hands?: 'act' | 'words' }) {
  const withdrawRolePair = useGeometryStore((s) => s.withdrawRolePair);
  // C-8: the three corners' spaces through the one resolver (a seed corner's cast — this block mounts on seed faces alone)
  const casts = useMemo(() => Object.fromEntries(cycle.map((v) => [v, spaceOf(shape, v)?.space])) as Record<VertexId, ConceptSpace | undefined>, [shape, cycle]);
  const result = useMemo(() => (cycle.every((v) => casts[v]) ? faceOf(cycle, casts, shape.edges, readInstances) : null), [cycle, casts, shape.edges]);
  // MODES-1 · B3 (defect 2): a role by its corner's own name, from the cast the face reads
  const nameAt = (v: VertexId, id: string): string => { const sp = casts[v]; return sp ? nameIn(sp, id) : id; };
  if (!result) return null; // a corner without a cast: the corner's line already says `no cast`
  const L = (v: VertexId): string => labelOf(shape, v);
  const walkWords = `${L(cycle[0])} → ${L(cycle[1])} → ${L(cycle[2])} → ${L(cycle[0])}`;
  const head = `face ${faceName}`;
  const edgeWords = (from: VertexId, to: VertexId): string => `${L(from)}–${L(to)}`;
  if (result.state === 'absent') {
    return (
      <span data-midpoint-face-reading={faceName} data-midpoint-face-state="absent" className="text-stone-400">
        {`${head} · no reading yet: nothing recorded on ${result.missing.map((m) => edgeWords(m.from, m.to)).join(' or ')}`}
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
  return a && b && self ? { site, parents: [a, b], resolved: self } : null;
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

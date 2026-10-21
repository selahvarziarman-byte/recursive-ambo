// cargoModel — STAMP C-11b (2026-09-24): THE CARGO ON THE WALK (§135; the ground ruling §23 ratified §132 and §24 ratified
// §134 option A; the surface the designer's 1500 §2 + 1508 and her 1520 §134 — the rod gesture).
//
// The person's sentence: he enters a room he built from a lifted form, carrying a ROLE of one of its corners; he crosses
// the doors he glued and, inside the cell, carries the cargo along the rods by his own hand; when the walk brings the
// cargo home he reads whether it returned to itself, as another role, or not at all — and away from home, WHERE it is and
// AS WHAT, by the route he took.
//
// THE GROUND (the researcher's cargo_in_the_room.py, cited not re-derived — its K1–K7 pinned by scripts/diagnose-the-cargo.cjs
// on the same fixtures, number for number):
//   D1 THE CARGO is a role at a corner, a point (v, r) of the family over the room's corners — UNTRUNCATED, never a class
//      (a class would pool exactly the Mov the walk exists to show).
//   D2 it sits AT A CORNER; it crosses a rod to the far corner iff that corner holds it (r ∈ dom J_e — the edge's J read in
//      the walk's direction, by its kind, on the carried record); a DOOR LINK — a corner of a door face and its paired
//      corner, one point of the glued form — has no length: the cargo crosses it by the door's transport at that corner
//      (C-11a's e_c; side b the inverse), or does not cross (a true absence). Never in a face or a cell: readings, not walked.
//   D3 A WALK is a path in the glued room's 1-skeleton — rods (J, backward J⁻¹) and door links (e_c, backward e_c⁻¹); its
//      transport is the composite partial map; the empty walk is the identity.
//   D4 HOME = the walk closes at its starting corner (the vertex itself): the reading is Fix · Mov · Und on that corner's
//      roles; an Und is a SPUR iff the free-reduced walk carries the cargo home. AWAY = the cargo elsewhere: identity and
//      presence by the route.
// THE RULING (§24, option A): at a door crossing the transport applies at ALL the door face's corners at once — the cargo
// at corner c crosses by e_c; a cargo at a corner NOT on the crossed face STAYS BEHIND in the cell left (a positive mark
// for a loss that is still a presence elsewhere). Inside a cell ONLY THE PERSON moves it: no rule computes an in-cell
// route (the cell's own matching, cargo_between_doors.py E2, refused). Carrying along a rod moves the CARGO, not the EYE
// (LAW 22's one producer of motion untouched): it is an act on the record, like the door act — a control, stated where the
// cargo is read; one press = one rod, corner to corner, never a partial step.
//
// THE WORDS (the designer's, verbatim where she wrote them): at home `returned to itself` · `returned as F1` · `did not
// return: lost around <reduced word>` · `did not return: a spur — the route reduces to nothing; lost at the door <X>, which
// does not carry it`; away `here … as F3, by <reduced word>` · `not here by <reduced word>` — presence as presence, identity
// as identity, both relative to the route PRINTED (never two routes side by side; never a turn or a twist: curvature stays in
// the return line's own angle); the stay-behind `carrying nothing — F7 stayed at A, in the cell you left: the face you left by,
// B·C·D, does not hold A`; the rod loss in the face block's own phrase `broke at the rod A–B: its J does not carry F7` with
// the one hand `here, on A–B: withdraw this step` (a loss found after the act must not cost the whole walk). Nothing lit
// beforehand: the rods are listed by their two corners, and no rod is marked as carrying or losing before it is pressed.
//
// RECORD, NOT READING: the room is DERIVED from the built record's seed, its rows (the doors' transports) and the carried
// record (the C-10 reader's), at every read, stored nowhere; the cargo's state is the walk's own seam (transient, like the
// trace). ADDITIVE · DERIVE-ONLY · react-free (the window draws what this returns; the witness runs this under node).

import type { Shape, VertexId } from '../types/geometry';
import { nameIn, type Resolved } from '../lib/spaceOf';
import { ALONG, IS, IS_GLYPH, NO_FACTS, type Dir, type LexiconFacts } from '../lib/relatings'; // D19 item 5 — the direction a born corner's instance carries
import { instanceSpaceOf } from '../lib/instanceSpace'; // D19 item 5 — a born corner's role read as its instance (mode · terms · direction)
import { COORDINATE, transportSpaceOf, transportStepOf, transportWaysOf, type Road, type WaysMap } from '../lib/transport';
import { compositeOfSteps, isNamedWords, wordsOf } from '../lib/walkRoutes'; // §9.57 (2): a route's word — by substitution, by his rule, else unruled
import type { Rule } from '../lib/sorting';
import { edgeBetween, type RoleMap } from '../lib/faceReading';
import { doorLetter } from './orderTrace';
import {
  cornerDisplayName,
  dihedralMapCandidates,
  faceReferenceName,
  type AbsentLabelResolver,
  type ApertureCellSurface,
  type AperturePairRow,
} from './apertureModel';
import { liftedConceptOf } from './liftedConceptModel';

/** a corner's space as the resolver hands it — this file reads resolved spaces, never a cast as held */
type CornerSpace = Resolved['space'];

export interface CargoRoom {
  corners: string[]; // the cell's corners (the seed's vertex ids)
  entry: string; // the entry corner — the cell's first corner in D14 order (the alphabetically-first label): where a cargo is picked
  label: (v: string) => string;
  rolesAt: (v: string) => Array<{ id: string; name: string }>; // the caster's order
  nameAt: (v: string, role: string) => string;
  J: (from: string, to: string) => RoleMap | null; // the rod's J in the walk's direction (null: the record cannot read it)
  ways: (from: string, to: string) => WaysMap | null; // §9.57: the step as a relation — every named way a road, his hands at a branching (null: the record cannot read it)
  rules: readonly Rule[]; // his chain rules (D6), for a route's composite word
  facts: LexiconFacts; // the lexicon's facts (his converses) — a leg walked against its way composes by the converse's chain rule (§9.65 (3))
  rods: Array<{ a: string; b: string }>; // the cell's rods, in the cell's own order (the walk window's rod order)
  faces: Array<{ corners: string[]; name: string } | null>; // by the walk window's face index — null where the surface holds no corners
  doors: Array<{ a: string[]; b: string[]; e: RoleMap[]; reversing: boolean } | null>; // by pairing index: faceA's corners in the candidate's order, their images on faceB, e_c per index, and the candidate's DERIVED mode (D19 item 5: a reversing door turns a directed instance round)
  glued: (v: string) => string; // the corner's class in the glued room (the doors' corner pairs, closed transitively)
  instanceOf: (v: string, role: string) => { mode: string; x: string; y: string; dir: Dir } | null; // D19 item 5 — a born corner's role IS an instance (a relating with a direction); a seed's role is none
}

export type CargoToken = { kind: 'rod'; from: string; to: string; road?: Road; fromRole?: string; toRole?: string } | { kind: 'door'; pair: number; side: 'a' | 'b' }; // §9.57: the road taken on a rod — its far role and its word (absent: the rod's J, IS); the roles left and landed on — the reduction's test (the mothership's 15:26 (1))

export type CargoLoss =
  | { kind: 'door'; pair: number; side: 'a' | 'b'; corner: string; role: string } // the door does not carry it at that corner
  | { kind: 'rod'; from: string; to: string; role: string } // the rod's J does not carry it — withdrawable
  | { kind: 'stayed'; corner: string; role: string; face: string }; // the face left by does not hold its corner

export interface CargoState {
  start: { corner: string; role: string };
  at: { corner: string; role: string; reversed: boolean } | null; // null = carrying nothing (see `loss`); `reversed` — D19 item 5: a directed instance carried across an odd number of reversing doors runs the other way
  loss: CargoLoss | null;
  route: CargoToken[]; // every step made, the losing one included — the walk's record gains the rod steps beside the door letters
  previous: { at: { corner: string; role: string; reversed: boolean }; route: CargoToken[] } | null; // the state before a rod loss — what the one hand restores
}

const inverse = (m: RoleMap): RoleMap => {
  const out: RoleMap = new Map();
  for (const [k, v] of m) out.set(v, k);
  return out;
};
const sameSet = (a: readonly string[], b: readonly string[]): boolean => a.length === b.length && a.every((v) => b.includes(v));

/** a room from parts already in hand (the witness's fixture prism); `J` answers every rod both ways */
export function cargoRoomFrom(spec: {
  corners: string[];
  entry?: string;
  label?: (v: string) => string;
  roles: Record<string, Array<{ id: string; name?: string }>>;
  J: (from: string, to: string) => RoleMap | null;
  ways?: (from: string, to: string) => WaysMap | null; // §9.57: every named way a road; absent, derived from J (one IS road per entry)
  rules?: readonly Rule[];
  facts?: LexiconFacts;
  rods: Array<{ a: string; b: string }>;
  faces: Array<{ corners: string[]; name: string } | null>;
  doors: Array<{ a: string[]; b: string[]; e: RoleMap[]; reversing?: boolean } | null>;
  instanceOf?: (v: string, role: string) => { mode: string; x: string; y: string; dir: Dir } | null;
}): CargoRoom {
  const label = spec.label ?? ((v: string) => v);
  const entry = spec.entry ?? [...spec.corners].sort((p, q) => (label(p) < label(q) ? -1 : label(p) > label(q) ? 1 : 0))[0];
  const nameAt = (v: string, role: string): string => spec.roles[v]?.find((r) => r.id === role)?.name ?? role;
  const doors = spec.doors.map((d) => (d ? { ...d, reversing: d.reversing ?? false } : null));
  return {
    corners: spec.corners,
    entry,
    label,
    rolesAt: (v) => (spec.roles[v] ?? []).map((r) => ({ id: r.id, name: r.name ?? r.id })),
    nameAt,
    J: spec.J,
    ways: spec.ways ?? ((from, to) => { const J = spec.J(from, to); return J ? new Map([...J].map(([x, y]) => [x, [{ to: y, word: IS, against: false }]])) : null; }),
    rules: spec.rules ?? [],
    facts: spec.facts ?? NO_FACTS,
    rods: spec.rods,
    faces: spec.faces,
    doors,
    glued: gluedOf(spec.corners, doors),
    instanceOf: spec.instanceOf ?? (() => null),
  };
}

function gluedOf(corners: string[], doors: CargoRoom['doors']): (v: string) => string {
  const parent = new Map<string, string>(corners.map((c) => [c, c]));
  const find = (v: string): string => {
    let x = v;
    while (parent.get(x) !== undefined && parent.get(x) !== x) x = parent.get(x) as string;
    return x;
  };
  for (const d of doors) if (d) d.a.forEach((x, i) => { const rx = find(x); const ry = find(d.b[i]); if (rx !== ry) parent.set(rx, ry); });
  return find;
}

/**
 * THE ROOM as the walk reads it — from the built record's seed (the lifted form, verbatim), its rows (the doors and their
 * transports, C-11a) and the carried record (the C-10 reader's — every corner's space through the one resolver, every rod's J
 * by its kind), in the walk window's own face and rod order. Null on a room the cargo cannot walk: a multi-cell seed (its
 * developed surface names no corners) or a seed the carried record does not hold.
 */
export function cargoRoomOf(seed: Shape, carried: Shape[], rows: AperturePairRow[], cellSurface: ApertureCellSurface, resolveAbsent?: AbsentLabelResolver, rules: readonly Rule[] = [], facts: LexiconFacts = NO_FACTS): CargoRoom | null {
  if (seed.cells.length !== 1) return null;
  const concept = liftedConceptOf({ shape: seed, opId: null, provenance: 'the room\'s seed' }, carried, resolveAbsent);
  if (concept.state !== 'read') return null;
  const record = concept.record;
  const memo = new Map<string, Resolved | null>();
  const corners = seed.cells[0].vertexIds;
  const label = (v: string): string => cornerDisplayName(seed, v, resolveAbsent) ?? (v.split(':').pop() ?? v);
  const childMemo: Parameters<typeof transportSpaceOf>[3] = new Map();
  const spaceAt = (v: string): CornerSpace | null => (record.vertices[v] ? transportSpaceOf(record, v, memo, childMemo)?.space ?? null : null); // MODES-4 · row 5 (D11): a born corner's space is its child
  const strip = (id: string): string => id.replace(/^c\d+:/, '');
  const roles: Record<string, Array<{ id: string; name: string }>> = {};
  for (const v of corners) { const s = spaceAt(v); roles[v] = s ? s.roles.map((r) => ({ id: r.id, name: nameIn(s, r.id) })) : []; }
  const faces = cellSurface.faces.map((f) => {
    if (!f.corners) return null;
    const face = seed.faces.find((x) => sameSet(x.vertexIds, f.corners as string[]));
    return { corners: f.corners, name: face ? faceReferenceName(seed, face, resolveAbsent) : f.corners.map(label).join('·') };
  });
  const complete = rows.filter((r) => r.faceA && r.faceB && r.candidateKey);
  const doors = complete.map((row) => {
    try {
      const chosen = dihedralMapCandidates(seed, row.faceA as string, row.faceB as string).find((c) => c.key === row.candidateKey);
      if (!chosen) return null;
      const a = chosen.correspondence.map(([x]) => strip(x));
      const b = chosen.correspondence.map(([, y]) => strip(y));
      const e = a.map((ac, i) => {
        const m: RoleMap = new Map();
        const t = (row.transports ?? []).find((x) => strip(x.corners[0]) === ac && strip(x.corners[1]) === b[i]);
        if (t) for (const [x, y] of t.roles) if (!m.has(x)) m.set(x, y);
        return m;
      });
      return { a, b, e, reversing: chosen.derivedMode === 'reversing' }; // the mode DERIVED from the witnessed fit, never chosen
    } catch {
      return null; // an unbuildable menu carries no door — the cargo cannot cross it (said by the reading, never a crash)
    }
  });
  return cargoRoomFrom({
    corners,
    label,
    roles,
    J: (from, to) => (record.vertices[from] && record.vertices[to] ? transportStepOf(record, from, to) : null), // D12 amended: IS (his and inherited) on a seed or medial edge; the coordinate map on a corner edge
    ways: (from, to) => (record.vertices[from] && record.vertices[to] ? transportWaysOf(record, from, to) : null), // §9.57: the step as a relation — every named way a road
    rules,
    facts, // §9.65 (3): his converses, for a leg walked against its way
    rods: cellSurface.rods.flatMap((r) => (r.ends ? [{ a: r.ends[0], b: r.ends[1] }] : [])),
    faces,
    doors,
    // D19 item 5 — a born corner's role is an instance of its parents' edge, with its mode and direction
    instanceOf: (v, role) => {
      const w = record.vertices[v];
      if (!w || w.createdBy.operation === 'seed' || w.createdBy.sourceVertexIds.length !== 2) return null;
      const child = instanceSpaceOf(record, edgeBetween(record.edges, w.createdBy.sourceVertexIds[0], w.createdBy.sourceVertexIds[1]), {}, childMemo);
      const i = child ? child.instances.find((x) => x.key === role) : undefined;
      return i ? { mode: i.mode, x: i.x, y: i.y, dir: i.dir } : null;
    },
  });
}

// ─── THE ACTS ───

export function pickCargo(room: CargoRoom, corner: string, role: string): CargoState {
  void room;
  return { start: { corner, role }, at: { corner, role, reversed: false }, loss: null, route: [], previous: null };
}

/** the rods leaving a corner, in the cell's own order — the far corner of each */
export function rodsFrom(room: CargoRoom, corner: string): string[] {
  return room.rods.flatMap((r) => (r.a === corner ? [r.b] : r.b === corner ? [r.a] : []));
}

/** THE PERSON'S PRESS: the cargo along ONE rod, corner to corner — arrives by the road taken, or breaks (withdrawable). §9.57 (4): where the role is held by several
 *  ways on the rod the roads are his HANDS — `via` names the far role of the road he chose; with none chosen nothing happens (nothing is chosen for him) */
export function stepRod(room: CargoRoom, state: CargoState, to: string, via?: string): CargoState {
  if (!state.at) return state;
  const from = state.at.corner;
  if (!rodsFrom(room, from).includes(to)) return state; // not a rod of the cell from this corner — nothing happens
  const ways = room.ways(from, to);
  const roads = ways ? ways.get(state.at.role) ?? [] : null;
  const road = roads === null ? null : roads.length > 1 ? roads.find((r) => r.to === via) ?? null : roads[0] ?? null;
  if (roads !== null && roads.length > 1 && road === null) return state; // a branching, his choice: the hands are the roads
  const J = room.J(from, to);
  const image = roads === null ? (J ? J.get(state.at.role) : undefined) : road ? road.to : undefined;
  const token: CargoToken = { kind: 'rod', from, to, ...(road ? { road } : {}), fromRole: state.at.role, ...(image !== undefined ? { toRole: image } : {}) }; // the roles left and landed on (the mothership's 15:26 (1))
  if (image === undefined) return { ...state, at: null, loss: { kind: 'rod', from, to, role: state.at.role }, route: [...state.route, token], previous: { at: state.at, route: state.route } };
  return { ...state, at: { corner: to, role: image, reversed: state.at.reversed }, loss: null, route: [...state.route, token], previous: null };
}

/** the one hand after a rod loss: the step undone — the cargo back where it was, the step struck from the route */
export function withdrawStep(state: CargoState): CargoState {
  if (!state.previous || !state.loss || state.loss.kind !== 'rod') return state;
  return { ...state, at: state.previous.at, loss: null, route: state.previous.route, previous: null };
}

/** THE WALK'S CROSSING (the window's two crossing sites): the door's transport at ALL the crossed face's corners at once */
export function crossDoor(room: CargoRoom, state: CargoState, faceIndex: number, door: { pair: number; side: 'a' | 'b' }): CargoState {
  const token: CargoToken = { kind: 'door', pair: door.pair, side: door.side };
  // carrying nothing — nothing crosses; the loss stands, and the WALK's word goes on (the route is what tells a spur from a
  // residue: the walker who went out and came back reads `the route reduces to nothing`)
  if (!state.at) return { ...state, route: [...state.route, token] };
  const face = room.faces[faceIndex] ?? null;
  const { corner, role } = state.at;
  if (!face || !face.corners.includes(corner)) {
    return { ...state, at: null, loss: { kind: 'stayed', corner, role, face: face ? face.name : '' }, route: [...state.route, token], previous: null };
  }
  const d = room.doors[door.pair] ?? null;
  const i = d ? (door.side === 'a' ? d.a.indexOf(corner) : d.b.indexOf(corner)) : -1;
  if (!d || i < 0) {
    return { ...state, at: null, loss: { kind: 'door', pair: door.pair, side: door.side, corner, role }, route: [...state.route, token], previous: null };
  }
  const map = door.side === 'a' ? d.e[i] : inverse(d.e[i]);
  const to = door.side === 'a' ? d.b[i] : d.a[i];
  const image = map.get(role);
  if (image === undefined) return { ...state, at: null, loss: { kind: 'door', pair: door.pair, side: door.side, corner, role }, route: [...state.route, token], previous: null };
  // D19 item 5 — across a REVERSING door a directed instance arrives as its counterpart in the other stored order: its direction turns; IS carries none
  const inst = room.instanceOf(corner, role);
  const turns = d.reversing && inst !== null && inst.mode !== IS;
  return { ...state, at: { corner: to, role: image, reversed: turns ? !state.at.reversed : state.at.reversed }, loss: null, route: [...state.route, token], previous: null };
}

// ─── THE ROUTE ───

const roadWord = (t: CargoToken): string => (t.kind === 'rod' ? t.road?.word ?? IS : IS); // a rod with no road named walked by its J (IS); a door's transport is IS
/** a step UNDOES the one before it when it walks the rod back and LANDS ON THE ROLE THAT STEP LEFT — whatever road entered (the mothership's 15:26 (1), after the designer's
 *  15:17): the coordinate from a child's instance back to the parent end it was entered from is the step in walked back; a relating walked back onto its own end likewise. A step
 *  back that lands on a DIFFERENT role does not cancel — the mixed route of §9.57 (1): out by `carries` to Φ1, back by `≡` to F7 (choice (c), as ruled). A door re-crossed the
 *  other way cancels. Two bare tokens (no roles) still compare by their words, the earlier rule. */
const undoes = (t: CargoToken, last: CargoToken): boolean =>
  t.kind === 'rod' && last.kind === 'rod'
    ? t.from === last.to && t.to === last.from && (t.toRole === undefined && last.fromRole === undefined ? roadWord(t) === roadWord(last) : t.toRole !== undefined && t.toRole === last.fromRole)
    : t.kind === 'door' && last.kind === 'door' ? t.pair === last.pair && t.side !== last.side : false;

/** the free reduction: a step followed by its own undoing cancels (a rod walked back onto the role left, a door re-crossed the other way) */
export function reduceRoute(route: CargoToken[]): CargoToken[] {
  const out: CargoToken[] = [];
  for (const t of route) {
    const last = out[out.length - 1];
    if (last && undoes(t, last)) out.pop();
    else out.push(t);
  }
  return out;
}

/** the rod leads to a CHILD when the ways back from its far corner are coordinates — there the far role is an instance that names its word, so the trailing word goes (the designer's 15:17 copy rider; the mothership's 15:26 (4)) */
const toChild = (room: CargoRoom, from: string, to: string): boolean => [...(room.ways(to, from)?.values() ?? [])].some((rs) => rs.some((r) => r.word === COORDINATE));
export const tokenWords = (room: CargoRoom, t: CargoToken): string => (t.kind === 'rod' ? `${room.label(t.from)}–${room.label(t.to)}${t.road && t.road.word !== IS && t.road.word !== COORDINATE && !toChild(room, t.from, t.to) ? ` (${t.road.word})` : ''}` : doorLetter({ pair: t.pair, side: t.side })); // §9.57, the designer's 16:44 §1: a named road adds its word; ≡ stays unmarked; at a corner edge the instance names it

/** the REDUCED route, printed — the walk's own word: rods by their corners, doors by their letters */
export function routeWords(room: CargoRoom, route: CargoToken[]): string {
  return reduceRoute(route).map((t) => tokenWords(room, t)).join(' · ');
}

/** every door's net count zero over the route — the walk back in its own cell copy (the trace's `cancelled` predicate, on the cargo's word) */
export function doorNetZero(route: CargoToken[]): boolean {
  const net = new Map<number, number>();
  for (const t of route) if (t.kind === 'door') net.set(t.pair, (net.get(t.pair) ?? 0) + (t.side === 'a' ? 1 : -1));
  return [...net.values()].every((n) => n === 0);
}

// ─── THE READING (one line beside trace · tally · sentence) ───

export type CargoReadingState = 'pick' | 'carrying' | 'home-fix' | 'home-mov' | 'home-converse' | 'home-way' | 'away' | 'lost-door' | 'lost-spur' | 'lost-rod' | 'stayed'; // `home-way`: §9.57 — back home by a route with a named leg, a light, never `returned`

export interface CargoReading {
  state: CargoReadingState;
  words: string; // the line's sentence ('' before a pick)
  hand: string | null; // the one hand (a rod loss)
  rods: Array<{ to: string; via?: string; words: string }>; // `carry it along:` — the rods from the cargo's corner, by their two corners; a rod whose role is held by several ways offers each road as its own hand (`via`: the road's far role)
  picks: Array<{ id: string; name: string }>; // the entry corner's roles when a cargo is to be picked
  pickWords: string | null;
  route: string; // the reduced route as printed
}

export function cargoReading(room: CargoRoom, state: CargoState | null): CargoReading {
  const L = room.label;
  if (!state) return { state: 'pick', words: '', hand: null, rods: [], picks: room.rolesAt(room.entry), pickWords: `carry from the corner ${L(room.entry)}:`, route: '' };
  // the designer's gate (12:32 §6; COPY-1): a carried RELATING goes in parentheses in every cargo sentence — `carrying (F5 ≡ Φ7) — at the
  // corner AC` — and a role stays bare (`carrying F13 — at the corner A`); the converse sentence was right, the others follow it
  const term = (corner: VertexId, role: string): string => { const name = room.nameAt(corner, role); return room.instanceOf(corner, role) ? `(${name})` : name; };
  const n0 = term(state.start.corner, state.start.role);
  const w = routeWords(room, state.route);
  const again = { picks: room.rolesAt(room.entry), pickWords: `carry again from the corner ${L(room.entry)}:` };
  if (!state.at) {
    const loss = state.loss as CargoLoss;
    if (loss.kind === 'rod') {
      return { state: 'lost-rod', words: `carrying nothing — ${n0} broke at the rod ${L(loss.from)}–${L(loss.to)}, which does not carry it`, hand: `here, on ${L(loss.from)}–${L(loss.to)}: withdraw this step`, rods: [], picks: [], pickWords: null, route: w };
    }
    if (loss.kind === 'stayed') {
      return { state: 'stayed', words: `carrying nothing — ${n0} stayed at ${L(loss.corner)}, in the cell you left: the face you left by, ${loss.face}, does not hold ${L(loss.corner)}`, hand: null, rods: [], ...again, route: w };
    }
    const letter = doorLetter({ pair: loss.pair, side: loss.side });
    if (w === '') {
      return { state: 'lost-spur', words: `carrying nothing — ${n0} did not return: a spur — the route reduces to nothing; lost at the door ${letter}, which does not carry it`, hand: null, rods: [], ...again, route: w };
    }
    // home or away for a lost cargo is the WALK's word: every door letter's net count zero is the walk back in its own cell
    // copy (the window's own `cancelled` reading — the same predicate the sentence fires on), a residue told by the word
    if (doorNetZero(state.route)) {
      return { state: 'lost-door', words: `carrying nothing — ${n0} did not return: lost around ${w}, at the door ${letter}, which does not carry it`, hand: null, rods: [], ...again, route: w };
    }
    return { state: 'lost-door', words: `carrying ${n0} — not here by ${w}: lost at the door ${letter}, which does not carry it`, hand: null, rods: [], ...again, route: w };
  }
  // §9.57 (4), the designer's 16:44 §1: where the role is held by more than one way on a rod, each road is its own choice before he presses —
  // `A–C as Φ7 (≡) · A–C as Φ1 (carries)`; a rod with one road stays as today; nothing is chosen for him
  const rods = rodsFrom(room, state.at.corner).flatMap((to) => {
    const roads = room.ways(state.at!.corner, to)?.get(state.at!.role) ?? [];
    if (roads.length <= 1) return [{ to, words: `${L(state.at!.corner)}–${L(to)}` }];
    return roads.map((road) => ({ to, via: road.to, words: `${L(state.at!.corner)}–${L(to)} as ${term(to, road.to)}${toChild(room, state.at!.corner, to) ? '' : ` (${road.word === IS ? IS_GLYPH : road.word})`}` })); // the copy rider: at a corner edge the instance names its word
  });
  const nameNow = term(state.at.corner, state.at.role);
  if (state.route.length === 0) return { state: 'carrying', words: `carrying ${n0} — at the corner ${L(state.at.corner)}`, hand: null, rods, picks: [], pickWords: null, route: w };
  const legWords = reduceRoute(state.route).map(roadWord); // the route REDUCED (the mothership's 15:26 (1)): a step undone leaves no word; a route reduced to nothing is no way
  if (state.at.corner === state.start.corner && legWords.length > 0 && isNamedWords(legWords)) {
    // §9.57 (1)–(3), the designer's 16:44 §2: a route with a named leg is a LIGHT and never says `returned` — `back at A by a way: F5 carries F7, by carries then ≡`;
    // the composite by substitution or by his rule (`(by rule)`); with none, the ends named and the words walked follow, `· unruled`
    const c = compositeOfSteps(reduceRoute(state.route).map((t) => ({ word: roadWord(t), against: t.kind === 'rod' && !!t.road?.against })), room.rules, room.facts); // §9.65 (3): a rod walked against its way is a JOIN step
    const by = wordsOf(legWords).join(' then ');
    const sentence = c.kind === 'word' ? `${n0} ${c.word} ${nameNow}` : `${n0} to ${nameNow}`;
    return { state: 'home-way', words: `carrying ${n0} — back at ${L(state.at.corner)} by a way: ${sentence}, by ${by}${c.kind === 'word' && c.by === 'rule' ? ' (by rule)' : ''}${c.kind === 'unruled' ? ' · unruled' : ''}`, hand: null, rods, picks: [], pickWords: null, route: w };
  }
  if (state.at.corner === state.start.corner) {
    const fix = state.at.role === state.start.role;
    const by = w === '' ? ' — the route reduces to nothing' : ` by ${w}`;
    // D19 item 5 — home as itself but RUN THE OTHER WAY (an odd number of reversing doors crossed): returned the other way round, the sentence read from its other end — the designer's words (08:19 §4; COPY-1 says `the other way round` for a converse, so `converse` does not reach the page; a relating used as a term in parentheses)
    if (fix && state.at.reversed) {
      const inst = room.instanceOf(state.at.corner, state.at.role);
      const converse = inst ? (inst.dir === ALONG ? `${inst.y} ${inst.mode} ${inst.x}` : `${inst.x} ${inst.mode} ${inst.y}`) : n0;
      return { state: 'home-converse', words: `carrying ${n0} — returned the other way round, as (${converse})${by}`, hand: null, rods, picks: [], pickWords: null, route: w };
    }
    return { state: fix ? 'home-fix' : 'home-mov', words: `carrying ${n0} — ${fix ? 'returned to itself' : `returned as ${nameNow}`}${by}`, hand: null, rods, picks: [], pickWords: null, route: w };
  }
  const reduced = reduceRoute(state.route);
  if (reduced.length === 1 && reduced[0].kind === 'rod' && reduced[0].from === state.start.corner) {
    // the designer's 16:44 §1: a named road taken reads `at the corner C as Φ1, by A–C (carries)`; by ≡ the words as before
    if (reduced[0].road && reduced[0].road.word !== IS && reduced[0].road.word !== COORDINATE) return { state: 'away', words: `carrying ${n0} — at the corner ${L(state.at.corner)} as ${nameNow}, by ${tokenWords(room, reduced[0])}`, hand: null, rods, picks: [], pickWords: null, route: w };
    return { state: 'away', words: `carrying ${n0} — at the corner ${L(state.at.corner)}, came along ${tokenWords(room, reduced[0])} as ${nameNow}`, hand: null, rods, picks: [], pickWords: null, route: w };
  }
  return { state: 'away', words: `carrying ${n0} — at the corner ${L(state.at.corner)} as ${nameNow}, by ${w}`, hand: null, rods, picks: [], pickWords: null, route: w };
}

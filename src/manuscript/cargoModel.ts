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

import type { Shape } from '../types/geometry';
import { nameIn, spaceOf, type Resolved } from '../lib/spaceOf';
import { bornStepOf } from '../lib/bornFace';
import type { RoleMap } from '../lib/faceReading';
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
  rods: Array<{ a: string; b: string }>; // the cell's rods, in the cell's own order (the walk window's rod order)
  faces: Array<{ corners: string[]; name: string } | null>; // by the walk window's face index — null where the surface holds no corners
  doors: Array<{ a: string[]; b: string[]; e: RoleMap[] } | null>; // by pairing index: faceA's corners in the candidate's order, their images on faceB, and e_c per index
  glued: (v: string) => string; // the corner's class in the glued room (the doors' corner pairs, closed transitively)
}

export type CargoToken = { kind: 'rod'; from: string; to: string } | { kind: 'door'; pair: number; side: 'a' | 'b' };

export type CargoLoss =
  | { kind: 'door'; pair: number; side: 'a' | 'b'; corner: string; role: string } // the door does not carry it at that corner
  | { kind: 'rod'; from: string; to: string; role: string } // the rod's J does not carry it — withdrawable
  | { kind: 'stayed'; corner: string; role: string; face: string }; // the face left by does not hold its corner

export interface CargoState {
  start: { corner: string; role: string };
  at: { corner: string; role: string } | null; // null = carrying nothing (see `loss`)
  loss: CargoLoss | null;
  route: CargoToken[]; // every step made, the losing one included — the walk's record gains the rod steps beside the door letters
  previous: { at: { corner: string; role: string }; route: CargoToken[] } | null; // the state before a rod loss — what the one hand restores
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
  rods: Array<{ a: string; b: string }>;
  faces: Array<{ corners: string[]; name: string } | null>;
  doors: Array<{ a: string[]; b: string[]; e: RoleMap[] } | null>;
}): CargoRoom {
  const label = spec.label ?? ((v: string) => v);
  const entry = spec.entry ?? [...spec.corners].sort((p, q) => (label(p) < label(q) ? -1 : label(p) > label(q) ? 1 : 0))[0];
  const nameAt = (v: string, role: string): string => spec.roles[v]?.find((r) => r.id === role)?.name ?? role;
  return {
    corners: spec.corners,
    entry,
    label,
    rolesAt: (v) => (spec.roles[v] ?? []).map((r) => ({ id: r.id, name: r.name ?? r.id })),
    nameAt,
    J: spec.J,
    rods: spec.rods,
    faces: spec.faces,
    doors: spec.doors,
    glued: gluedOf(spec.corners, spec.doors),
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
export function cargoRoomOf(seed: Shape, carried: Shape[], rows: AperturePairRow[], cellSurface: ApertureCellSurface, resolveAbsent?: AbsentLabelResolver): CargoRoom | null {
  if (seed.cells.length !== 1) return null;
  const concept = liftedConceptOf({ shape: seed, opId: null, provenance: 'the room\'s seed' }, carried, resolveAbsent);
  if (concept.state !== 'read') return null;
  const record = concept.record;
  const memo = new Map<string, Resolved | null>();
  const corners = seed.cells[0].vertexIds;
  const label = (v: string): string => cornerDisplayName(seed, v, resolveAbsent) ?? (v.split(':').pop() ?? v);
  const spaceAt = (v: string): CornerSpace | null => (record.vertices[v] ? spaceOf(record, v, {}, memo)?.space ?? null : null);
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
      return { a, b, e };
    } catch {
      return null; // an unbuildable menu carries no door — the cargo cannot cross it (said by the reading, never a crash)
    }
  });
  return cargoRoomFrom({
    corners,
    label,
    roles,
    J: (from, to) => (record.vertices[from] && record.vertices[to] ? bornStepOf(record, from, to, {}, memo)?.map ?? null : null),
    rods: cellSurface.rods.flatMap((r) => (r.ends ? [{ a: r.ends[0], b: r.ends[1] }] : [])),
    faces,
    doors,
  });
}

// ─── THE ACTS ───

export function pickCargo(room: CargoRoom, corner: string, role: string): CargoState {
  void room;
  return { start: { corner, role }, at: { corner, role }, loss: null, route: [], previous: null };
}

/** the rods leaving a corner, in the cell's own order — the far corner of each */
export function rodsFrom(room: CargoRoom, corner: string): string[] {
  return room.rods.flatMap((r) => (r.a === corner ? [r.b] : r.b === corner ? [r.a] : []));
}

/** THE PERSON'S PRESS: the cargo along ONE rod, corner to corner — arrives by the rod's J, or breaks (withdrawable) */
export function stepRod(room: CargoRoom, state: CargoState, to: string): CargoState {
  if (!state.at) return state;
  const from = state.at.corner;
  if (!rodsFrom(room, from).includes(to)) return state; // not a rod of the cell from this corner — nothing happens
  const token: CargoToken = { kind: 'rod', from, to };
  const J = room.J(from, to);
  const image = J ? J.get(state.at.role) : undefined;
  if (image === undefined) return { ...state, at: null, loss: { kind: 'rod', from, to, role: state.at.role }, route: [...state.route, token], previous: { at: state.at, route: state.route } };
  return { ...state, at: { corner: to, role: image }, loss: null, route: [...state.route, token], previous: null };
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
  return { ...state, at: { corner: to, role: image }, loss: null, route: [...state.route, token], previous: null };
}

// ─── THE ROUTE ───

const inverseToken = (t: CargoToken): CargoToken => (t.kind === 'rod' ? { kind: 'rod', from: t.to, to: t.from } : { kind: 'door', pair: t.pair, side: t.side === 'a' ? 'b' : 'a' });
const sameToken = (x: CargoToken, y: CargoToken): boolean =>
  x.kind === y.kind && (x.kind === 'rod' ? x.from === (y as { from: string }).from && x.to === (y as { to: string }).to : x.pair === (y as { pair: number }).pair && x.side === (y as { side: string }).side);

/** the free reduction: a step followed by its own undoing cancels (a rod walked back, a door re-crossed the other way) */
export function reduceRoute(route: CargoToken[]): CargoToken[] {
  const out: CargoToken[] = [];
  for (const t of route) {
    const last = out[out.length - 1];
    if (last && sameToken(last, inverseToken(t))) out.pop();
    else out.push(t);
  }
  return out;
}

export const tokenWords = (room: CargoRoom, t: CargoToken): string => (t.kind === 'rod' ? `${room.label(t.from)}–${room.label(t.to)}` : doorLetter({ pair: t.pair, side: t.side }));

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

export type CargoReadingState = 'pick' | 'carrying' | 'home-fix' | 'home-mov' | 'away' | 'lost-door' | 'lost-spur' | 'lost-rod' | 'stayed';

export interface CargoReading {
  state: CargoReadingState;
  words: string; // the line's sentence ('' before a pick)
  hand: string | null; // the one hand (a rod loss)
  rods: Array<{ to: string; words: string }>; // `carry it along:` — the rods from the cargo's corner, by their two corners
  picks: Array<{ id: string; name: string }>; // the entry corner's roles when a cargo is to be picked
  pickWords: string | null;
  route: string; // the reduced route as printed
}

export function cargoReading(room: CargoRoom, state: CargoState | null): CargoReading {
  const L = room.label;
  if (!state) return { state: 'pick', words: '', hand: null, rods: [], picks: room.rolesAt(room.entry), pickWords: `carry from the corner ${L(room.entry)}:`, route: '' };
  const n0 = room.nameAt(state.start.corner, state.start.role);
  const w = routeWords(room, state.route);
  const again = { picks: room.rolesAt(room.entry), pickWords: `carry again from the corner ${L(room.entry)}:` };
  if (!state.at) {
    const loss = state.loss as CargoLoss;
    if (loss.kind === 'rod') {
      return { state: 'lost-rod', words: `carrying nothing — ${n0} broke at the rod ${L(loss.from)}–${L(loss.to)}: its J does not carry ${room.nameAt(loss.from, loss.role)}`, hand: `here, on ${L(loss.from)}–${L(loss.to)}: withdraw this step`, rods: [], picks: [], pickWords: null, route: w };
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
  const rods = rodsFrom(room, state.at.corner).map((to) => ({ to, words: `${L(state.at!.corner)}–${L(to)}` }));
  const nameNow = room.nameAt(state.at.corner, state.at.role);
  if (state.route.length === 0) return { state: 'carrying', words: `carrying ${n0} — at the corner ${L(state.at.corner)}`, hand: null, rods, picks: [], pickWords: null, route: w };
  if (state.at.corner === state.start.corner) {
    const fix = state.at.role === state.start.role;
    const by = w === '' ? ' — the route reduces to nothing' : ` by ${w}`;
    return { state: fix ? 'home-fix' : 'home-mov', words: `carrying ${n0} — ${fix ? 'returned to itself' : `returned as ${nameNow}`}${by}`, hand: null, rods, picks: [], pickWords: null, route: w };
  }
  const reduced = reduceRoute(state.route);
  if (reduced.length === 1 && reduced[0].kind === 'rod' && reduced[0].from === state.start.corner) {
    return { state: 'away', words: `carrying ${n0} — at the corner ${L(state.at.corner)}, came along ${tokenWords(room, reduced[0])} as ${nameNow}`, hand: null, rods, picks: [], pickWords: null, route: w };
  }
  return { state: 'away', words: `carrying ${n0} — at the corner ${L(state.at.corner)} as ${nameNow}, by ${w}`, hand: null, rods, picks: [], pickWords: null, route: w };
}

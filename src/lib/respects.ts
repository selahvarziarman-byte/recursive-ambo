// respects — STAMP C-14 (Arman's Δ111 "yes, adopt it. go build"; ADR 0031 §3.11; the researcher's rulings §28–§31; the
// hermeneutic office's 1347 and 1355): THE RESPECT, THE TRIAD, THE MEET-CORE AND THE READINGS.
//
// THE RECORD (a). A second GIVEN kind beside the pairing. On an edge, keyed by the OPPOSITE CORNER (the face's third corner),
// tuples `a ↦ b ⟨c⟩` — a of the edge's first corner, b of its second (the record's own orientation, as `identification` reads),
// c a role of that corner, the WARRANT; words likewise. Holds-only; no one-to-one. It is INPUT.
// ITS HOME is the FACE the act was pointed at: `face.data.triads` — the person's triads (x, y, z), each item POSITIONAL in the
// face's own corner order, NO ID INSIDE (an open field of a frozen type, the C-13b precedent; no frozen edit). Measured at
// C-14's first cut: a record keyed by a corner's id inside an edge's packet does not cross the lift's namespace hop — the
// frozen loader re-roots only the ids it names, and the carried record read `⟨vertex:tetrahedron:c⟩` — so the record holds
// no id, and the RESPECTS an edge holds are READ from the faces holding it, at every read (`respectsOn`). The act's site IS
// the record (the meaning-trace law); the per-edge respect is its reading. It survives Export/Import and a reload with the
// shape, the dissection (ambo.ts carries a dissected cell's face record onto its parent-cell-face, the corner order kept;
// every other face is kept whole) and the lift (a face is copied whole; the loader re-roots its corners and leaves its
// packet verbatim — positional, the record needs nothing re-rooted).
// THE ACT (b). At a face X·Y·Z the person points (x, y, z) as ONE act — `x ↦ y ⟨z⟩` on X–Y, `x ↦ z ⟨y⟩` on X–Z, `y ↦ z ⟨x⟩`
// on Y–Z. ATOMIC: a leg that cannot be recorded (a corner holding no space; a pointed item not of its corner; no edge)
// refuses the whole act, and the leg is named. A respect never causes or answers a refusal elsewhere and binds no other face.
// THE MEET-CORE (c). An edge's core `J_e` = his unconditional pairs ∪ the MEET of the respect-pairs of every light through the
// edge (a pair counts iff given in every triangular face's light there). Re-derived at every read through the resolver's ONE
// reader (`recordOn`), never stored. (i) Conflicts left out and SAID — a meet pair pairing a role twice, or against an
// unconditional pair; (ii) the dependency reading — a meet pair that would break a born act is held back and SAID, naming the
// born act (C-8 item 4's machinery, evaluated one edge deep). One light only ⇒ the meet is empty.
// THE READINGS (d). Each respect read against the CORE, leg by leg — KEPT · BROKEN · OPEN ⇒ HONORED · BROKEN (the leg named) ·
// NOT YET. Marks, never demands; nothing here proposes a leg's repair.
// THE CARRY (e). The record rides the face; the born concept's `⟨X⟩` types (feet.ts) ride the next pushout as foreign words;
// a door preserves the tuples (holds-only); the cargo, a role moved by J and e, does not carry them.
//
// FENCES, by construction: one core per edge (this module reads no face into the core's identity — `meetCoreOf` takes the
// edge); the device names no respect (the only writer takes the person's three picks); never completes a triad from two legs
// and never synthesizes a respect from the legs (no code path derives a tuple; the record is the triad itself); a respect
// never glues on its own (the core alone glues) and never enters a door's lines (the door reads the core); `c` never enters
// the child (the space's tuple is on [a], [b]).

import type { Edge, Face, JsonValue, PacketData, Shape, VertexId, EdgeIdentification, ConceptSpace } from '../types/geometry';
import { edgeBetween } from './faceReading';
import { respectTypeName } from './feet';
import type { Midpoint } from './midpointGlue';
// the resolver — for the corners' spaces at the act and the born acts at the dependency reading; spaceOf imports this module
// for the core, and the cycle resolves at call time (nothing here runs at module scope)
import { brokenBornActs, spaceOf, type BrokenBornAct, type Resolved, type SpaceOfOptions } from './spaceOf';

export type RespectKind = 'role' | 'word';
/** `a ↦ b ⟨c⟩` as an edge reads it: a of the edge's first corner, b of its second, c of the opposite corner */
export type RespectTuple = [string, string, string];
export interface RespectRecord {
  roles: RespectTuple[];
  words: RespectTuple[];
}
/** the face's record: each triad's items positional in the face's own corner order (item k is of `face.vertexIds[k]`) */
export interface TriadRecord {
  roles: RespectTuple[];
  words: RespectTuple[];
}
export const TRIADS_KEY = 'triads';

const isTuple = (v: unknown): v is RespectTuple => Array.isArray(v) && v.length === 3 && v.every((x) => typeof x === 'string' && x.length > 0);
const sameTuple = (s: RespectTuple, t: RespectTuple): boolean => s[0] === t[0] && s[1] === t[1] && s[2] === t[2];
const samePair = (s: [string, string], t: [string, string]): boolean => s[0] === t[0] && s[1] === t[1];

// ─── THE RECORD ───

/** THE RECORD READ — the triads a face holds, positional; malformed entries are not read (never fabricated, never erased: the bytes stay in the packet) */
export function triadsOn(face: Face | undefined): TriadRecord {
  const raw = face?.data?.[TRIADS_KEY];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { roles: [], words: [] };
  const r = raw as Record<string, JsonValue>;
  return {
    roles: Array.isArray(r.roles) ? (r.roles as unknown[]).filter(isTuple) : [],
    words: Array.isArray(r.words) ? (r.words as unknown[]).filter(isTuple) : [],
  };
}

function writeTriads(face: Face, rec: TriadRecord): Face {
  const data: PacketData = { ...(face.data ?? {}) };
  if (rec.roles.length || rec.words.length) data[TRIADS_KEY] = { roles: rec.roles.map((t) => [t[0], t[1], t[2]]), words: rec.words.map((t) => [t[0], t[1], t[2]]) } as unknown as JsonValue;
  else delete data[TRIADS_KEY];
  if (Object.keys(data).length === 0) {
    const { data: _dropped, ...rest } = face;
    void _dropped;
    return rest as Face;
  }
  return { ...face, data };
}

/** the face with one triad added (an identical triad already held leaves the face as it is) */
export function withTriad(face: Face, kind: RespectKind, tuple: RespectTuple): Face {
  const rec = triadsOn(face);
  const list = kind === 'role' ? rec.roles : rec.words;
  if (list.some((s) => sameTuple(s, tuple))) return face;
  return writeTriads(face, kind === 'role' ? { roles: [...rec.roles, tuple], words: rec.words } : { roles: rec.roles, words: [...rec.words, tuple] });
}

/** the face with one triad removed (the person's withdrawal, the whole act); an empty record leaves no key behind */
export function withoutTriad(face: Face, kind: RespectKind, tuple: RespectTuple): Face {
  const rec = triadsOn(face);
  const next = kind === 'role' ? { roles: rec.roles.filter((s) => !sameTuple(s, tuple)), words: rec.words } : { roles: rec.roles, words: rec.words.filter((s) => !sameTuple(s, tuple)) };
  if (next.roles.length === rec.roles.length && next.words.length === rec.words.length) return face;
  return writeTriads(face, next);
}

export const hasTriad = (face: Face | undefined, kind: RespectKind, tuple: RespectTuple): boolean =>
  (kind === 'role' ? triadsOn(face).roles : triadsOn(face).words).some((s) => sameTuple(s, tuple));

/** THE CARRY at a dissection: the dissected cell's face record onto its parent-cell-face — the corner order is the source's (ambo keeps `vertexIds`), so the positional record rides as it is */
export function carriedTriads(data: PacketData | undefined): JsonValue | undefined {
  const raw = data?.[TRIADS_KEY];
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
  const r = raw as Record<string, JsonValue>;
  const roles = Array.isArray(r.roles) ? (r.roles as unknown[]).filter(isTuple) : [];
  const words = Array.isArray(r.words) ? (r.words as unknown[]).filter(isTuple) : [];
  return roles.length || words.length ? ({ roles, words } as unknown as JsonValue) : undefined;
}

/** the triangular faces holding both corners of an edge — the lights; several Face objects with one vertex set are one light */
export function facesThrough(shape: Shape, edge: Edge): Face[] {
  const [p, q] = edge.vertexIds;
  return shape.faces.filter((f) => f.vertexIds.length === 3 && f.vertexIds.includes(p) && f.vertexIds.includes(q));
}

/** THE RESPECTS AN EDGE HOLDS, read from the faces holding it: keyed by the opposite corner, each tuple `a ↦ b ⟨c⟩` oriented as the edge holds its corners */
export function respectsOn(shape: Shape, edge: Edge | undefined): Map<VertexId, RespectRecord> {
  const out = new Map<VertexId, RespectRecord>();
  if (!edge) return out;
  const [p, q] = edge.vertexIds;
  for (const face of facesThrough(shape, edge)) {
    const z = face.vertexIds.find((v) => v !== p && v !== q);
    if (z === undefined) continue;
    const rec = triadsOn(face);
    if (rec.roles.length === 0 && rec.words.length === 0) continue;
    const at = (t: RespectTuple, v: VertexId): string => t[face.vertexIds.indexOf(v)];
    const oriented = (t: RespectTuple): RespectTuple => [at(t, p), at(t, q), at(t, z)];
    const held = out.get(z) ?? { roles: [], words: [] };
    for (const t of rec.roles) { const o = oriented(t); if (!held.roles.some((s) => sameTuple(s, o))) held.roles.push(o); }
    for (const t of rec.words) { const o = oriented(t); if (!held.words.some((s) => sameTuple(s, o))) held.words.push(o); }
    out.set(z, held);
  }
  return out;
}

export const hasRespect = (shape: Shape, edge: Edge | undefined, corner: VertexId, kind: RespectKind, tuple: RespectTuple): boolean =>
  (respectsOn(shape, edge).get(corner)?.[kind === 'role' ? 'roles' : 'words'] ?? []).some((s) => sameTuple(s, tuple));

// ─── THE ACT ───

export interface TriadPick {
  corner: VertexId;
  item: string; // the role (or word) of that corner the person pointed
}
export interface TriadLeg {
  edge: Edge;
  corner: VertexId; // the opposite corner — the leg's light
  tuple: RespectTuple; // oriented as the edge holds its corners
}
export interface TriadRefusal {
  corner: VertexId | null; // the pick that could not be recorded, when one pick is the reason
  item: string | null;
  leg: [VertexId, VertexId] | null; // the leg, when the leg is the reason
  why: string;
}
export type Triad = { legs: TriadLeg[]; record: RespectTuple; refused: null } | { legs: []; record: null; refused: TriadRefusal };

const refuse = (corner: VertexId | null, item: string | null, leg: [VertexId, VertexId] | null, why: string): Triad => ({ legs: [], record: null, refused: { corner, item, leg, why } });

/** the three legs a triad names on a triangular face, and the record it writes (the picks in the face's corner order) — structure only; the checks on the picks are `triadOf`'s */
export function triadLegsOf(shape: Shape, faceId: string, picks: TriadPick[]): Triad {
  const label = (id: VertexId): string => shape.vertices[id]?.data.label || id;
  const face = shape.faces.find((f) => f.id === faceId);
  if (!face) return refuse(null, null, null, 'no such face on this solid');
  if (face.vertexIds.length !== 3) return refuse(null, null, null, `a triad is pointed on a triangle — this face has ${face.vertexIds.length} corners`);
  const corners = face.vertexIds;
  if (picks.length !== 3 || new Set(picks.map((p) => p.corner)).size !== 3 || picks.some((p) => !corners.includes(p.corner))) {
    return refuse(null, null, null, "one pick in each of the face's three corners makes the act");
  }
  const itemAt = new Map(picks.map((p) => [p.corner, p.item] as const));
  const legs: TriadLeg[] = [];
  for (let i = 0; i < 3; i += 1) {
    for (let j = i + 1; j < 3; j += 1) {
      const X = corners[i];
      const Y = corners[j];
      const Z = corners[3 - i - j];
      const e = edgeBetween(shape.edges, X, Y);
      if (!e) return refuse(null, null, [X, Y], `no edge ${label(X)}–${label(Y)} on this face`);
      const first = e.vertexIds[0];
      const second = e.vertexIds[1];
      legs.push({ edge: e, corner: Z, tuple: [itemAt.get(first) as string, itemAt.get(second) as string, itemAt.get(Z) as string] });
    }
  }
  return { legs, record: [itemAt.get(corners[0]) as string, itemAt.get(corners[1]) as string, itemAt.get(corners[2]) as string], refused: null };
}

/** THE TRIAD AS RESPECTS: the person's three picks at a face, one per corner, each a role (or word) that corner's SPACE holds — refused whole, with the leg or the pick named, else the three legs and the record to write */
export function triadOf(shape: Shape, faceId: string, kind: RespectKind, picks: TriadPick[], options: SpaceOfOptions = {}, memo: Map<VertexId, Resolved | null> = new Map()): Triad {
  const structural = triadLegsOf(shape, faceId, picks);
  if (structural.refused) return structural;
  const label = (id: VertexId): string => shape.vertices[id]?.data.label || id;
  for (const p of picks) {
    const R = spaceOf(shape, p.corner, options, memo);
    if (!R) return refuse(p.corner, p.item, null, `${label(p.corner)} holds no space — nothing to point there`);
    const held = kind === 'role' ? R.space.roles.some((r) => r.id === p.item) : R.space.signature.some((s) => s.type === p.item);
    if (!held) return refuse(p.corner, p.item, null, `${p.item} is not a ${kind === 'role' ? 'role' : 'word'} of ${label(p.corner)}`);
  }
  return structural;
}

// ─── THE MEET-CORE ───

/** the pairing in force on an edge BEFORE the meet — the candidate a read carries for this edge, else the record the edge holds (τ alone from the drafts) */
export function unconditionalOn(e: Edge, options: SpaceOfOptions): { roles: EdgeIdentification['roles']; types: EdgeIdentification['types'] } {
  if (options.candidate && options.candidate.edgeId === e.id) return { roles: options.candidate.roles, types: options.candidate.types };
  const record = e.identification;
  return { roles: record ? record.roles : [], types: record ? record.types : (options.tauDrafts?.[e.id] ?? []) };
}

/** THE LIGHTS of an edge: the opposite corners of the triangular faces through it (a face with more corners has no third corner and no light) */
export function lightsOf(shape: Shape, edge: Edge): VertexId[] {
  const [p, q] = edge.vertexIds;
  const out: VertexId[] = [];
  for (const f of facesThrough(shape, edge)) {
    const third = f.vertexIds.find((v) => v !== p && v !== q);
    if (third !== undefined && !out.includes(third)) out.push(third);
  }
  return out;
}

/** the MEET of the lights' pairs: a pair counts iff given in EVERY light; no light, or a light that has not spoken, gives an empty meet */
export function meetPairsOf(records: Map<VertexId, Array<[string, string]>>, lights: VertexId[]): Array<[string, string]> {
  if (lights.length === 0) return [];
  const lists = lights.map((l) => records.get(l) ?? []);
  if (lists.some((l) => l.length === 0)) return [];
  const out: Array<[string, string]> = [];
  for (const pair of lists[0]) {
    if (out.some((o) => samePair(o, pair))) continue;
    if (lists.every((l) => l.some((s) => samePair(s, pair)))) out.push(pair);
  }
  return out;
}

export interface LeftOut {
  kind: RespectKind;
  pair: [string, string];
  why: 'twice' | 'unconditional'; // pairs a role twice within the meet · against an unconditional pair
  with: [string, string]; // the other pair it collides with
}
export interface HeldBack {
  kind: RespectKind;
  pair: [string, string];
  bornAct: BrokenBornAct; // the born act it would break
}

/** condition (i): the meet's conflicts left out and said — a pair whose role the meet pairs twice; a pair against an unconditional one; a pair the unconditional record already holds is core already */
export function meetConflictsOf(kind: RespectKind, meet: Array<[string, string]>, unconditional: Array<[string, string]>): { kept: Array<[string, string]>; leftOut: LeftOut[] } {
  const leftOut: LeftOut[] = [];
  const kept: Array<[string, string]> = [];
  for (const pair of meet) {
    const twin = meet.find((o) => !samePair(o, pair) && (o[0] === pair[0] || o[1] === pair[1]));
    if (twin) {
      leftOut.push({ kind, pair, why: 'twice', with: twin });
      continue;
    }
    const against = unconditional.find((u) => !samePair(u, pair) && (u[0] === pair[0] || u[1] === pair[1]));
    if (against) {
      leftOut.push({ kind, pair, why: 'unconditional', with: against });
      continue;
    }
    if (unconditional.some((u) => samePair(u, pair))) continue;
    kept.push(pair);
  }
  return { kept, leftOut };
}

export interface MeetCore {
  roles: EdgeIdentification['roles']; // the core in force: the unconditional pairs ∪ the meet, conflicts out, held-back out
  types: EdgeIdentification['types'];
  unconditional: { roles: EdgeIdentification['roles']; types: EdgeIdentification['types'] };
  meet: { roles: Array<[string, string]>; types: Array<[string, string]> }; // the raw meet, before (i) and (ii)
  lights: VertexId[]; // the opposite corners of the triangular faces through the edge
  spoken: VertexId[]; // the lights holding a respect on this edge
  leftOut: LeftOut[];
  heldBack: HeldBack[];
}

/** THE MEET-CORE of an edge, re-derived at every read: his unconditional pairs, the meet of every light, conflicts left out and said, born acts guarded and said */
export function meetCoreOf(shape: Shape, edge: Edge, options: SpaceOfOptions = {}): MeetCore {
  const unconditional = unconditionalOn(edge, options);
  const records = options.respects === false ? new Map<VertexId, RespectRecord>() : respectsOn(shape, edge); // the control byte: the record unread
  if (records.size === 0) {
    return { roles: unconditional.roles, types: unconditional.types, unconditional, meet: { roles: [], types: [] }, lights: [], spoken: [], leftOut: [], heldBack: [] };
  }
  const lights = lightsOf(shape, edge);
  const spoken = lights.filter((l) => records.has(l));
  const pairsBy = (kind: RespectKind): Map<VertexId, Array<[string, string]>> => {
    const m = new Map<VertexId, Array<[string, string]>>();
    for (const [corner, rec] of records) m.set(corner, (kind === 'role' ? rec.roles : rec.words).map((t) => [t[0], t[1]] as [string, string]));
    return m;
  };
  const meet = { roles: meetPairsOf(pairsBy('role'), lights), types: meetPairsOf(pairsBy('word'), lights) };
  const rolesI = meetConflictsOf('role', meet.roles, unconditional.roles);
  const typesI = meetConflictsOf('word', meet.types, unconditional.types);
  const leftOut = [...rolesI.leftOut, ...typesI.leftOut];
  const heldBack: HeldBack[] = [];
  const guard = (kind: RespectKind, kept: Array<[string, string]>): Array<[string, string]> => {
    if (options.meetDependency === false || kept.length === 0) return kept;
    const out: Array<[string, string]> = [];
    for (const pair of kept) {
      // C-8 item 4's machinery, one edge deep: the shape as the core would leave it with this pair, every born act read again
      const candidate = { edgeId: edge.id, roles: kind === 'role' ? [...unconditional.roles, pair] : unconditional.roles, types: kind === 'word' ? [...unconditional.types, pair] : unconditional.types };
      const broken = brokenBornActs(shape, { ...options, candidate, meetDependency: false }, edge.id);
      if (broken.length > 0) heldBack.push({ kind, pair, bornAct: broken[0] });
      else out.push(pair);
    }
    return out;
  };
  const rolesKept = guard('role', rolesI.kept);
  const typesKept = guard('word', typesI.kept);
  return {
    roles: [...unconditional.roles, ...rolesKept],
    types: [...unconditional.types, ...typesKept],
    unconditional,
    meet,
    lights,
    spoken,
    leftOut,
    heldBack,
  };
}

// ─── THE READINGS ───

export type LegReading = 'KEPT' | 'BROKEN' | 'OPEN';
export type RespectVerdict = 'HONORED' | 'BROKEN' | 'NOT YET';

/** one leg against the core it crosses: KEPT when the core pairs `from` to `to`; BROKEN when either end is paired elsewhere there; OPEN otherwise */
export function legReading(core: Map<string, string>, from: string, to: string): LegReading {
  const got = core.get(from);
  if (got === to) return 'KEPT';
  if (got !== undefined) return 'BROKEN';
  for (const [x, y] of core) if (y === to && x !== from) return 'BROKEN';
  return 'OPEN';
}

export function verdictOf(first: LegReading, second: LegReading): { verdict: RespectVerdict; brokenLeg: 0 | 1 | null } {
  if (first === 'KEPT' && second === 'KEPT') return { verdict: 'HONORED', brokenLeg: null };
  if (first === 'BROKEN') return { verdict: 'BROKEN', brokenLeg: 0 };
  if (second === 'BROKEN') return { verdict: 'BROKEN', brokenLeg: 1 };
  return { verdict: 'NOT YET', brokenLeg: null };
}

/** the core of the edge between two corners, oriented from → to (null where the solid holds no such edge) */
export function coreMapOf(shape: Shape, from: VertexId, to: VertexId, kind: RespectKind, options: SpaceOfOptions = {}): Map<string, string> | null {
  const e = edgeBetween(shape.edges, from, to);
  if (!e) return null;
  const core = meetCoreOf(shape, e, options);
  const pairs = kind === 'role' ? core.roles : core.types;
  const reversed = e.vertexIds[0] !== from;
  const m = new Map<string, string>();
  for (const [x, y] of pairs) {
    if (reversed) m.set(y, x);
    else m.set(x, y);
  }
  return m;
}

export interface RespectReading {
  corner: VertexId; // the light
  kind: RespectKind;
  tuple: RespectTuple;
  legs: [{ edge: [VertexId, VertexId]; reading: LegReading }, { edge: [VertexId, VertexId]; reading: LegReading }]; // first: A → C · second: C → B
  verdict: RespectVerdict;
  brokenLeg: [VertexId, VertexId] | null; // the leg named, when BROKEN
}

/** THE READINGS of an edge's respects, each against the core of its two legs — marks, never demands */
export function readRespects(shape: Shape, edge: Edge, options: SpaceOfOptions = {}): RespectReading[] {
  const records = respectsOn(shape, edge);
  if (records.size === 0) return [];
  const [P, Q] = edge.vertexIds;
  const out: RespectReading[] = [];
  for (const [corner, rec] of records) {
    for (const kind of ['role', 'word'] as RespectKind[]) {
      const tuples = kind === 'role' ? rec.roles : rec.words;
      if (tuples.length === 0) continue;
      const J1 = coreMapOf(shape, P, corner, kind, options);
      const J2 = coreMapOf(shape, corner, Q, kind, options);
      for (const tuple of tuples) {
        const [a, b, c] = tuple;
        const first = J1 ? legReading(J1, a, c) : 'OPEN';
        const second = J2 ? legReading(J2, c, b) : 'OPEN';
        const v = verdictOf(first, second);
        out.push({
          corner,
          kind,
          tuple,
          legs: [{ edge: [P, corner], reading: first }, { edge: [corner, Q], reading: second }],
          verdict: v.verdict,
          brokenLeg: v.brokenLeg === null ? null : v.brokenLeg === 0 ? [P, corner] : [corner, Q],
        });
      }
    }
  }
  return out;
}

// ─── THE SPACE ───

export interface RespectLink {
  corner: VertexId;
  type: string; // `⟨X⟩`
  links: Array<[string, string]>; // on the born concept's points — [a]'s class, [b]'s class
}

/** the respects of an edge on its born concept's points: one relation-type per light, holds-only, `c` the record's warrant and never a term */
export function respectLinksOf(shape: Shape, edge: Edge, M: Midpoint): RespectLink[] {
  const records = respectsOn(shape, edge);
  if (records.size === 0) return [];
  const classOfA = new Map<string, string>();
  const classOfB = new Map<string, string>();
  for (const r of M.roles) {
    if (r.a !== null) classOfA.set(r.a, r.key);
    if (r.b !== null) classOfB.set(r.b, r.key);
  }
  const out: RespectLink[] = [];
  for (const [corner, rec] of records) {
    if (rec.roles.length === 0) continue;
    const links: Array<[string, string]> = [];
    for (const [a, b] of rec.roles) {
      const u = classOfA.get(a);
      const v = classOfB.get(b);
      if (u === undefined || v === undefined) continue;
      if (!links.some((l) => l[0] === u && l[1] === v)) links.push([u, v]);
    }
    out.push({ corner, type: respectTypeName(shape.vertices[corner]?.data.label || corner), links });
  }
  return out;
}

/** M⁺ with the respects' types and tuples — holds-only, added beside the feet; M's points untouched */
export function withRespects(space: ConceptSpace, links: RespectLink[]): ConceptSpace {
  if (links.length === 0) return space;
  return {
    ...space,
    signature: [...space.signature, ...links.map((l) => ({ type: l.type, arity: 2 }))],
    relations: [...space.relations, ...links.flatMap((l) => l.links.map(([u, v]) => ({ type: l.type, terms: [u, v], polarity: 'holds' as const })))],
  };
}

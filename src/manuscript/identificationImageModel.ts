// identificationImageModel — STAMP THE-THIRD-RESOLUTION · D19 (2026-10-06): THE IDENTIFICATION'S DIRECT IMAGE — the Manuscript's concept
// layer (the researcher's ruling §2, chartered by reference 09-30 10:49; ADR 0031 §9.19; R-D6 closed). A NOT_FROZEN sibling: nothing in
// the frozen identification is touched — its born form (the merged corners carrying their members; the operation's slot pairs) is READ.
//
// The person's sentence: he lifts a form that carries its record and identifies edges of it — a word on a face (a torus, a band, a twist),
// or a door between two faces — and finds the concepts the record held STILL THERE on the born form, met at the seams: two corners made
// one point hold their children side by side until he says, at the seam, which instance of one is which of the other — the door act the
// layer already has (C-11a). NOTHING IS MINTED: a seam with no act joins the geometry and nothing at the concept level — the door exists,
// its transport does not yet (§2 item 1; Δ80).
//
// THE MECHANISM — THE IMAGE RECORD: the carried record QUOTIENTED along the identification, built at every read and read by the readers
// that already exist (the resolver, the sorting, D18's values), stored nowhere (§2 item 6). A merged corner is a seed-like vertex holding
// the UNION of its members' children as its cast (every role keyed by its member, labelled by its sentence and its member's name), with
// the person's seam transports as the pushout over e (two roles one where e pairs them, §2 item 2). An identified edge pair is ONE edge:
// the first edge's relatings beside the second's, the second's re-keyed into the merged roles and read in the first's stored order —
// RUN THE OTHER WAY where the corner pairing crosses the ends (§2 item 3). Two records of one ordered pair in two words are a
// DISCORDANCE (D4, both kept); in one word running opposite ways a discordance of the DIRECTION — unless the word is IS (one spelling),
// symmetric, or the two are one through a declared converse (D13). The record the lift carried holds no lexicon, so a converse cannot be
// read on the Manuscript today: the reading says so rather than assume (`lexiconCarried: false`). SINCE M2 (the snapshot spend, e0dedd8) the
// lift file CARRIES the lexicon's facts and the caller hands them from it (`lexiconCarried: true`); a file saved before the spend carries
// none, and the reading says so (`lexiconCarried: false`) rather than assume. Every other medium the seams touch is
// re-read on the image by the same sorting; k — the instances whose VALUE (D18) went from empty to non-empty — is derived, never asserted
// (§2 item 4). The page's words are the designer's; the D-names live in this file and the data attributes.
//
// MEASURED before it was built (the committed torus, ta/saves/manuscript_torus_word.page.json): the born form of a single-face word carries
// its merged corner as `mat:<members joined by ~>` with `createdBy.sourceVertexIds` = the members (the general path mints `idn:…` the same
// way); the born edges keep ONE member edge's id each; the slot pairs with their modes ride the born shape's id as the materialize path's
// own trailing tokens (`0-2p:1-3p`) — an index of the operation, never a name; the general path's spec rides `idn[…]` and is parsed by the
// frozen module's own parser. The corner pairing of a slot pair is DERIVED from the members (the two matchings tested against the classes),
// the path's own convention deciding only where both fit (every corner one class).
//
// ADDITIVE · DERIVE-ONLY · react-free (the card draws what this returns; the witness runs this under node).

import type { ConceptRelation, ConceptRelationType, ConceptRole, ConceptSpace, Edge, Face, Shape, Vertex, VertexId } from '../types/geometry';
import { createDefaultVertexData } from '../lib/shape';
import { ALONG, AGAINST, converseOf, dirOf, IS, NO_FACTS, relating, relatingsOn, withRelating, type LexiconFacts, type Relating } from '../lib/relatings';
import { edgeBetween, type RoleMap } from '../lib/faceReading';
import { parseIdentificationSuffix } from '../lib/complexIdentification';
import { nameIn, type Resolved } from '../lib/spaceOf';
import { childSpaceOf, termWordsOf } from '../lib/instanceSpace';
import { transportSpaceOf, transportStepOf } from '../lib/transport';
import { relKey, sortingOf } from '../lib/sorting';
import type { DoorTransport } from './apertureModel';
import { actAt, sideFrom, withdrawLine, type DoorActResult, type DoorSide } from './doorTransportModel';

export type SeamMode = 'preserving' | 'reversing';

/** one side of a seam: a parent edge with its two corners in the seam's own order (a's stored order; b's as PAIRED with a's) */
export interface SeamSide {
  edge: Edge; // the parent form's edge (its id the record's)
  corners: [VertexId, VertexId];
}

export interface Seam {
  index: number;
  mode: SeamMode; // the identification's own mode (the frozen module's G3), carried
  a: SeamSide;
  b: SeamSide; // b.corners[i] ~ a.corners[i]
  crossed: boolean; // b's paired order runs against b's edge's stored order: b's relatings meet a's run the other way
  merged: [VertexId, VertexId]; // the born form's vertex holding each corner pair
}

/** THE PERSON'S RECORD at a seam (the page's; kept by the page store, persisted by the page file): the door act's transports, corners [a's, b's] by parent id */
export interface SeamRecord {
  formId: string;
  seam: number;
  transports: DoorTransport[];
}

export interface ImageMember {
  id: VertexId;
  label: string;
  roles: number; // the member's child's roles (0 when it holds no space)
  absence: string | null;
}

export interface ImageCorner {
  id: VertexId; // the born form's merged vertex
  label: string;
  members: ImageMember[];
  roles: number; // the union's roles after the pushout
  identities: number; // roles made one by the seam transports at this corner
  seams: number[]; // the seams whose corner pairs meet here
  space: ConceptSpace; // the union child (the image record's cast at this corner)
}

export type Discordance = { kind: 'word' | 'direction'; a: Relating; b: Relating };

export interface ImageMedium {
  seam: number;
  edgeId: string; // the image edge (a's id)
  relatings: Relating[]; // the joined medium's relatings, in a's stored order
  discordances: Discordance[];
  fromA: number;
  fromB: number;
  joined: number; // b's relatings that met a's as ONE
}

export interface KDetail { edge: string; key: string; before: VertexId[]; after: VertexId[] }

export interface IdentificationImage {
  state: 'identified';
  formId: string; // the born form's shape id — the seam records are keyed by it
  provenance: string;
  path: 'materialized' | 'identified';
  record: Shape; // the parent's carried record
  image: Shape; // THE IMAGE RECORD — the record quotiented along the identification (derived at every read)
  supportOf: Map<VertexId, VertexId>; // a record vertex → its image vertex
  seams: Seam[];
  corners: ImageCorner[];
  media: ImageMedium[];
  transportsGiven: number;
  k: number;
  kDetail: KDetail[];
  lexiconCarried: boolean; // M2: the lift file carried the lexicon's facts — false on a file saved before the spend: a converse cannot be read here, said, never assumed
}

export type IdentificationImageResult =
  | IdentificationImage
  | { state: 'not-an-identification'; reason: string }
  | { state: 'parent-without-record'; provenance: string };

const labelOf = (shape: Shape, id: VertexId): string => shape.vertices[id]?.data.label?.trim() || id;
const isMergedVertex = (v: Vertex): boolean => (v.id.startsWith('mat:') || v.id.startsWith('idn:')) && (v.createdBy.operation === 'glue' || v.createdBy.operation === 'flip-glue') && v.createdBy.sourceVertexIds.length >= 2;

/** the merged classes the born form carries: its minted vertices' members (carried-not-minted) */
export function classesOf(born: Shape): Map<VertexId, VertexId[]> {
  const out = new Map<VertexId, VertexId[]>();
  for (const v of Object.values(born.vertices)) if (isMergedVertex(v)) out.set(v.id, [...v.createdBy.sourceVertexIds]);
  return out;
}

const supportMap = (classes: Map<VertexId, VertexId[]>): Map<VertexId, VertexId> => {
  const s = new Map<VertexId, VertexId>();
  for (const [merged, members] of classes) for (const m of members) s.set(m, merged);
  return s;
};

interface SlotPair { edgeA: Edge; cornersA: [VertexId, VertexId]; edgeB: Edge; cornersB: [VertexId, VertexId]; mode: SeamMode }

/** the identification's pairs: the general path's spec (`idn[…]`, the frozen parser) or the materialize path's slot tokens on the identified face */
function pairsOf(born: Shape, parent: Shape): { pairs: SlotPair[]; path: 'materialized' | 'identified' } | { reason: string } {
  const spec = parseIdentificationSuffix(born.id);
  if (spec) {
    const pairs: SlotPair[] = [];
    for (let i = 0; i < spec.cycleA.length; i += 1) {
      const ea = parent.edges.find((e) => e.id === spec.cycleA[i]);
      const eb = parent.edges.find((e) => e.id === spec.cycleB[i]);
      if (!ea || !eb) return { reason: `the identification names an edge the parent does not hold (${spec.cycleA[i]} ~ ${spec.cycleB[i]})` };
      pairs.push({ edgeA: ea, cornersA: [ea.vertexIds[0], ea.vertexIds[1]], edgeB: eb, cornersB: [eb.vertexIds[0], eb.vertexIds[1]], mode: spec.modes[i] });
    }
    return { pairs, path: 'identified' };
  }
  const tokens = born.id.split(':');
  const slots: Array<[number, number, SeamMode]> = [];
  for (let i = tokens.length - 1; i >= 0; i -= 1) {
    const m = tokens[i].match(/^(\d+)-(\d+)([pr])$/);
    if (!m) break;
    slots.unshift([Number(m[1]), Number(m[2]), m[3] === 'p' ? 'preserving' : 'reversing']);
  }
  if (slots.length === 0) return { reason: 'the born form carries no identification (no slot pairs on its id, no spec)' };
  const face = parent.faces.find((f) => born.id.includes(`:${f.id}:`)) ?? (parent.faces.length === 1 ? parent.faces[0] : undefined);
  if (!face) return { reason: 'the identified face is not one of the parent form\'s' };
  const n = face.vertexIds.length;
  const slotOf = (s: number): { edge: Edge; corners: [VertexId, VertexId] } | null => {
    if (s < 0 || s >= n) return null;
    const from = face.vertexIds[s]; const to = face.vertexIds[(s + 1) % n];
    const edge = edgeBetween(parent.edges, from, to);
    return edge ? { edge, corners: [from, to] } : null;
  };
  const pairs: SlotPair[] = [];
  for (const [sa, sb, mode] of slots) {
    const A = slotOf(sa); const B = slotOf(sb);
    if (!A || !B) return { reason: `slot ${sa} ~ ${sb} is not on the identified face` };
    pairs.push({ edgeA: A.edge, cornersA: A.corners, edgeB: B.edge, cornersB: B.corners, mode });
  }
  return { pairs, path: 'materialized' };
}

/**
 * THE SEAMS of a born form over its parent: each slot pair with its corner pairing DERIVED from the members (the parallel and the crossed
 * matching tested against the born classes; where both fit — every corner one class — the path's own convention decides: the materialize
 * path pairs a preserving slot pair tail to head, the general path tail to tail) and its merged vertices.
 */
export function seamsOf(born: Shape, parent: Shape): { seams: Seam[]; classes: Map<VertexId, VertexId[]>; path: 'materialized' | 'identified' } | { reason: string } {
  const classes = classesOf(born);
  const support = supportMap(classes);
  const sup = (v: VertexId): VertexId => support.get(v) ?? v;
  const P = pairsOf(born, parent);
  if ('reason' in P) return P;
  const seams: Seam[] = [];
  P.pairs.forEach((p, index) => {
    const [a0, a1] = p.cornersA; const [b0, b1] = p.cornersB;
    const parallelFits = sup(a0) === sup(b0) && sup(a1) === sup(b1);
    const crossedFits = sup(a0) === sup(b1) && sup(a1) === sup(b0);
    let crossedPairing: boolean;
    if (parallelFits && !crossedFits) crossedPairing = false;
    else if (crossedFits && !parallelFits) crossedPairing = true;
    else if (parallelFits && crossedFits) crossedPairing = P.path === 'materialized' ? p.mode === 'preserving' : p.mode === 'reversing';
    else { seams.length = 0; return; }
    const bPaired: [VertexId, VertexId] = crossedPairing ? [b1, b0] : [b0, b1];
    // b's relatings are stored in b's edge's order; they meet a's run the other way iff the corner paired with a's first stored corner is not b's first stored corner
    const aStored = p.edgeA.vertexIds; const bStored = p.edgeB.vertexIds;
    const aFirstIdx = p.cornersA.indexOf(aStored[0]); // a's stored first corner in the pairing's a-order
    const bCornerMatchingAFirst = bPaired[aFirstIdx];
    const crossed = bCornerMatchingAFirst !== bStored[0];
    seams.push({ index, mode: p.mode, a: { edge: p.edgeA, corners: p.cornersA }, b: { edge: p.edgeB, corners: bPaired }, crossed, merged: [sup(a0), sup(a1)] });
  });
  if (seams.length !== P.pairs.length) return { reason: 'a slot pair matches neither way against the born form\'s merged corners — the born form is not this parent\'s identification by these pairs' };
  return { seams, classes, path: P.path };
}

const roleKey = (member: VertexId, id: string): string => `${id}@${member}`;

/** the union of the members' children as one cast, with the seam transports as the pushout over e; every role keyed by its member */
function unionChildOf(record: Shape, merged: VertexId, members: VertexId[], transports: DoorTransport[], memo: Map<VertexId, Resolved | null>, childMemo: Parameters<typeof transportSpaceOf>[3], spaceMemo: Map<VertexId, ConceptSpace | null>): { space: ConceptSpace; find: (k: string) => string; members: ImageMember[]; identities: number } {
  const parent = new Map<string, string>();
  const find = (k: string): string => { let r = k; while (parent.has(r) && parent.get(r) !== r) r = parent.get(r) as string; return r; };
  const union = (x: string, y: string): void => { const rx = find(x); const ry = find(y); if (rx !== ry) parent.set(ry, rx); };
  const roles: ConceptRole[] = [];
  const signature: ConceptRelationType[] = [];
  const relations: ConceptRelation[] = [];
  const axioms: string[] = [];
  const rows: ImageMember[] = [];
  const wordsOf = (m: VertexId, s: ConceptSpace, id: string): string => (record.vertices[m]?.createdBy.operation === 'seed' ? nameIn(s, id) : termWordsOf(record, m, id, {}, spaceMemo));
  for (const m of members) {
    const r = record.vertices[m] ? transportSpaceOf(record, m, memo, childMemo) : null;
    const s = r ? r.space : null;
    rows.push({ id: m, label: labelOf(record, m), roles: s ? s.roles.length : 0, absence: s ? null : record.vertices[m] ? 'holds no space' : 'not in the record the lift carried' });
    if (!s) continue;
    for (const role of s.roles) { roles.push({ ...role, id: roleKey(m, role.id), label: `${wordsOf(m, s, role.id)} of ${labelOf(record, m)}` }); parent.set(roleKey(m, role.id), roleKey(m, role.id)); }
    for (const t of s.signature) if (!signature.some((x) => x.type === t.type)) signature.push({ ...t });
    for (const rel of s.relations) relations.push({ ...rel, terms: rel.terms.map((x) => roleKey(m, x)) });
    axioms.push(...s.axioms);
  }
  // THE PUSHOUT over e (§2 item 2): the transports at this corner's pairs make two roles one — the a-side's key stands for both
  let identities = 0;
  for (const t of transports) {
    const [ca, cb] = t.corners;
    if (!members.includes(ca) || !members.includes(cb)) continue;
    for (const [x, y] of t.roles) { const kx = roleKey(ca, x); const ky = roleKey(cb, y); if (parent.has(kx) && parent.has(ky) && find(kx) !== find(ky)) { union(kx, ky); identities += 1; } }
  }
  const byRep = new Map<string, ConceptRole[]>();
  for (const role of roles) { const rep = find(role.id); byRep.set(rep, [...(byRep.get(rep) ?? []), role]); }
  const mergedRoles: ConceptRole[] = [...byRep.entries()].map(([rep, rs]) => ({ ...rs[0], id: rep, label: rs.map((r) => r.label ?? r.id).join(' ≡ ') }));
  const seen = new Set<string>();
  const mergedRelations: ConceptRelation[] = [];
  for (const rel of relations) { const terms = rel.terms.map(find); const k = `${rel.type}|${terms.join(',')}|${rel.polarity}`; if (seen.has(k)) continue; seen.add(k); mergedRelations.push({ ...rel, terms }); }
  void merged;
  return { space: { roles: mergedRoles, signature, relations: mergedRelations, axioms }, find, members: rows, identities };
}

/** THE PUSHOUT OVER e (§2 item 2; F-D19d's sub-case): the union of the members' children with the transports making two roles one — the merged corner's cast, exported for the witnesses */
export function pushoutChildOf(record: Shape, members: VertexId[], transports: DoorTransport[]): { space: ConceptSpace; members: ImageMember[]; identities: number } {
  const u = unionChildOf(record, members.join('~'), members, transports, new Map(), new Map(), new Map());
  return { space: u.space, members: u.members, identities: u.identities };
}

const flip = (r: Relating): Relating => relating(r[0], r[2], r[1], r[3], dirOf(r) === ALONG ? AGAINST : ALONG);
const sameRelating = (p: Relating, q: Relating): boolean => p[0] === q[0] && p[1] === q[1] && p[2] === q[2] && p[3] === q[3] && dirOf(p) === dirOf(q);

/**
 * THE IMAGE RECORD: the carried record quotiented along the seams — the merged corners seed-like with their union casts, every other vertex
 * kept (its lineage re-pointed), every edge's ends re-pointed and its relatings re-keyed into the merged roles, each identified pair ONE edge
 * holding both records (b's read in a's stored order, run the other way where the pairing crosses), degenerate faces dropped.
 */
export function imageRecordOf(record: Shape, bornId: string, seams: Seam[], classes: Map<VertexId, VertexId[]>, seamRecords: SeamRecord[], facts: LexiconFacts = NO_FACTS): { image: Shape; supportOf: Map<VertexId, VertexId>; corners: ImageCorner[]; media: ImageMedium[]; rekey: (edge: Edge, r: Relating) => Relating | null } {
  const support = supportMap(classes);
  const sup = (v: VertexId): VertexId => support.get(v) ?? v;
  const memo = new Map<VertexId, Resolved | null>();
  const childMemo: Parameters<typeof transportSpaceOf>[3] = new Map();
  const spaceMemo = new Map<VertexId, ConceptSpace | null>();
  const transportsAt = (merged: VertexId): DoorTransport[] => seamRecords.flatMap((sr) => sr.transports).filter((t) => sup(t.corners[0]) === merged && sup(t.corners[1]) === merged);
  const finds = new Map<VertexId, (k: string) => string>();
  const corners: ImageCorner[] = [];
  const vertices: Record<VertexId, Vertex> = {};
  for (const [merged, members] of classes) {
    const u = unionChildOf(record, merged, members, transportsAt(merged), memo, childMemo, spaceMemo);
    finds.set(merged, u.find);
    const positions = members.map((m) => record.vertices[m]?.position).filter(Boolean) as Array<[number, number, number]>;
    const n = positions.length || 1;
    const position: [number, number, number] = [positions.reduce((s, p) => s + p[0], 0) / n, positions.reduce((s, p) => s + p[1], 0) / n, positions.reduce((s, p) => s + p[2], 0) / n];
    const label = members.map((m) => labelOf(record, m)).join('·');
    vertices[merged] = { id: merged, position, data: { ...createDefaultVertexData(label), cast: u.space }, createdBy: { shapeId: `image:${bornId}`, operation: 'seed', sourceVertexIds: [] } };
    corners.push({ id: merged, label, members: u.members, roles: u.space.roles.length, identities: u.identities, seams: seams.filter((s) => s.merged.includes(merged)).map((s) => s.index), space: u.space });
  }
  for (const v of Object.values(record.vertices)) {
    if (support.has(v.id)) continue;
    vertices[v.id] = { ...v, createdBy: { ...v.createdBy, sourceVertexIds: v.createdBy.sourceVertexIds.map(sup) } };
  }
  /** a relating of an edge, re-keyed into the image's roles (a merged corner's role by its member, then through the pushout) */
  const rekeyOn = (edge: Edge, r: Relating): Relating => {
    const [c0, c1] = edge.vertexIds;
    const kx = support.has(c0) ? (finds.get(sup(c0)) as (k: string) => string)(roleKey(c0, r[1])) : r[1];
    const ky = support.has(c1) ? (finds.get(sup(c1)) as (k: string) => string)(roleKey(c1, r[2])) : r[2];
    return relating(r[0], kx, ky, r[3], dirOf(r));
  };
  const bEdgeIds = new Set(seams.map((s) => s.b.edge.id));
  const seamByA = new Map(seams.map((s) => [s.a.edge.id, s]));
  const media: ImageMedium[] = [];
  const edges: Edge[] = [];
  for (const e of record.edges) {
    if (bEdgeIds.has(e.id)) continue;
    const seam = seamByA.get(e.id) ?? null;
    const own = relatingsOn(e).map((r) => rekeyOn(e, r));
    let fromB: Relating[] = [];
    if (seam) {
      const eb = record.edges.find((x) => x.id === seam.b.edge.id) ?? seam.b.edge;
      fromB = relatingsOn(eb).map((r) => { const q = rekeyOn(eb, r); return seam.crossed ? flip(q) : q; });
    }
    const relatings: Relating[] = [];
    const discordances: Discordance[] = [];
    let joined = 0;
    const push = (r: Relating, fromSecond: boolean): void => {
      const same = relatings.find((p) => sameRelating(p, r));
      if (same) { if (fromSecond && own.some((p) => sameRelating(p, same))) joined += 1; return; }
      if (fromSecond) {
        // D13: one relating through a declared converse — `y w′ x ≡ x w y`: the other spelling keeps the terms' order, replaces the word and turns the direction (a symmetric word is its own converse)
        if (r[0] !== IS) {
          const c = converseOf(facts, r[0]);
          if (c !== null) { const alt = relating(c, r[1], r[2], r[3], dirOf(r) === ALONG ? AGAINST : ALONG); if (own.some((p) => sameRelating(p, alt))) { joined += 1; return; } }
        }
        // THE DISCORDANCES are read ACROSS the seam — a's record against b's (b's as flipped into a's stored order) — never one edge's own record against itself:
        // the same ordered pair in two words (D4, both kept); in one word running opposite ways, the direction's (§2 item 3)
        for (const p of own) {
          if (p[3] !== r[3] || p[1] !== r[1] || p[2] !== r[2]) continue;
          if (p[0] !== r[0]) discordances.push({ kind: 'word', a: p, b: r });
          else if (p[0] !== IS && dirOf(p) !== dirOf(r)) discordances.push({ kind: 'direction', a: p, b: r });
        }
      }
      relatings.push(r);
    };
    for (const r of own) push(r, false);
    for (const r of fromB) push(r, true);
    // the word pairs (τ) as the record holds them on each edge — carried beside each other (no reader of the respects: the Manuscript imports none, FENCE 5 · 6)
    const typesA = e.identification?.types ?? [];
    const typesB = seam ? (record.edges.find((x) => x.id === seam.b.edge.id) ?? seam.b.edge).identification?.types ?? [] : [];
    const { relatings: _dropped, ...packet } = e.data ?? {};
    void _dropped;
    let image: Edge = { ...e, vertexIds: [sup(e.vertexIds[0]), sup(e.vertexIds[1])], sourceVertexIds: [sup(e.sourceVertexIds[0]), sup(e.sourceVertexIds[1])], identification: { roles: [], types: [...typesA, ...typesB.filter((t) => !typesA.some((u) => u[0] === t[0] && u[1] === t[1]))] }, data: e.data ? packet : undefined };
    for (const r of relatings) image = withRelating(image, r);
    edges.push(image);
    if (seam) media.push({ seam: seam.index, edgeId: e.id, relatings, discordances, fromA: own.length, fromB: fromB.length, joined });
  }
  const faces: Face[] = record.faces.map((f) => ({ ...f, vertexIds: f.vertexIds.map(sup) })).filter((f) => new Set(f.vertexIds).size === f.vertexIds.length);
  const cells = record.cells.map((c) => ({ ...c, vertexIds: c.vertexIds.map(sup) }));
  const image: Shape = { ...record, id: `image:${bornId}`, name: `${record.name} — identified`, vertices, edges, faces, cells, genealogy: { ...record.genealogy, parentShapeId: record.id } };
  const rekey = (edge: Edge, r: Relating): Relating | null => {
    const seam = seams.find((s) => s.b.edge.id === edge.id) ?? null;
    const q = rekeyOn(edge, r);
    return seam ? (seam.crossed ? flip(q) : q) : q;
  };
  return { image, supportOf: support, corners, media, rekey };
}

/** THE SEAM'S TWO SIDES for the door act (C-11a): a's two corners and b's as paired, each corner's child on the record, each step the transport's, both ways round the two-corner cycle */
export function seamSidesOf(record: Shape, seam: Seam, memo: Map<VertexId, Resolved | null> = new Map()): { A: DoorSide; B: DoorSide } | { missing: string[] } {
  const childMemo: Parameters<typeof transportSpaceOf>[3] = new Map();
  const sideOf = (corners: [VertexId, VertexId], name: string): DoorSide | { missing: string[] } => {
    const spaces: ConceptSpace[] = [];
    const missing: string[] = [];
    for (const v of corners) { const r = record.vertices[v] ? transportSpaceOf(record, v, memo, childMemo) : null; if (r) spaces.push(r.space); else missing.push(labelOf(record, v)); }
    if (missing.length) return { missing };
    const J: RoleMap[] = [transportStepOf(record, corners[0], corners[1]) ?? new Map(), transportStepOf(record, corners[1], corners[0]) ?? new Map()];
    return sideFrom(corners, spaces, J, name);
  };
  const A = sideOf(seam.a.corners, `${labelOf(record, seam.a.corners[0])}–${labelOf(record, seam.a.corners[1])}`);
  if ('missing' in A) return A;
  const B = sideOf(seam.b.corners, `${labelOf(record, seam.b.corners[0])}–${labelOf(record, seam.b.corners[1])}`);
  if ('missing' in B) return B;
  return { A, B };
}

/** THE ACT at a seam: x of a's corner i paired with y of b's — the whole line-pair taken or the refusal named (the door model's own act) */
export function seamActAt(record: Shape, seam: Seam, standing: DoorTransport[], i: 0 | 1, x: string, y: string): DoorActResult | { taken: false; missing: string[] } {
  const S = seamSidesOf(record, seam);
  if ('missing' in S) return { taken: false, missing: S.missing };
  return actAt(S.A, S.B, standing, i, x, y);
}

/** the one hand a taken line has: the whole line-pair withdrawn */
export function seamWithdrawLine(record: Shape, seam: Seam, standing: DoorTransport[], corner: 0 | 1, role: string): DoorTransport[] {
  const S = seamSidesOf(record, seam);
  if ('missing' in S) return standing;
  return withdrawLine(S.A, S.B, standing, corner, role);
}

/**
 * THE DIRECT IMAGE of a born form: the parent's record quotiented along the identification and READ — the merged corners with their union
 * children, the joined media with their discordances, and k (D18's values before and after on every medium the seams touch).
 */
export function identificationImageOf(form: { shape: Shape; opId: string | null; provenance: string; parentShape: Shape | null }, record: Shape | null, seamRecords: SeamRecord[], facts: LexiconFacts | null = null): IdentificationImageResult {
  const F: LexiconFacts = facts ?? NO_FACTS; // M2: the file's facts when the lift carried them; none otherwise — and said
  if (form.opId === null || !form.parentShape) return { state: 'not-an-identification', reason: 'the form was not born by an act on a parent' };
  const S = seamsOf(form.shape, form.parentShape);
  if ('reason' in S) return { state: 'not-an-identification', reason: S.reason };
  if (!record) return { state: 'parent-without-record', provenance: form.provenance };
  const own = seamRecords.filter((r) => r.formId === form.shape.id);
  const { image, supportOf, corners, media, rekey } = imageRecordOf(record, form.shape.id, S.seams, S.classes, own, F);
  // k — D18's values on every medium a seam touches: an instance OWN before (an empty value) and the face's after
  const touched = record.edges.filter((e) => e.vertexIds.some((v) => supportOf.has(v)));
  const imageEdgeFor = (e: Edge): Edge | undefined => { const seam = S.seams.find((s) => s.b.edge.id === e.id); const id = seam ? seam.a.edge.id : e.id; return image.edges.find((x) => x.id === id); };
  const kDetail: KDetail[] = [];
  for (const e of touched) {
    const before = sortingOf(record, e, {}, [], F);
    const ie = imageEdgeFor(e);
    const after = ie ? sortingOf(image, ie, {}, [], F) : null;
    if (!before) continue;
    for (const r of before.instances) {
      const v0 = before.values.get(relKey(r)) ?? [];
      const q = rekey(e, r);
      const v1 = q && after ? after.values.get(relKey(q)) ?? [] : [];
      if (v0.length === 0 && v1.length > 0) kDetail.push({ edge: e.id, key: relKey(r), before: v0, after: v1 });
    }
  }
  return { state: 'identified', formId: form.shape.id, provenance: form.provenance, path: S.path, record, image, supportOf, seams: S.seams, corners, media, transportsGiven: own.reduce((n, r) => n + r.transports.length, 0), k: kDetail.length, kDetail, lexiconCarried: facts !== null };
}

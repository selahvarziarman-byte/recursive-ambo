// bornRecordModel — GROUP 4 · slice 1 (2026-10-22): THE PULLBACK CHAIN (ADR 0031 §9.76 (1); the mothership's 13:27 STAMP on Arman's Δ239 "no matter the price, this
// should be built" and Δ242 "the coder's order as given"; the researcher's 11:27, ratified — claims §512).
//
// The person's sentence (Arman, 10-22): when he lifts a square whose corners are four children and glues it into a torus, the point where the four corners are
// identified "now has actual content (four concept spaces and their eventual identification …)" — and so on through every operation the Manuscript offers.
//
// THE LAW: a form born on the page by an act carries its concept record DERIVED from its parent's record by the act, along the provenance the shape already holds —
// a merged class carrying all its absorbed corners (`createdBy.sourceVertexIds`), a copy its source, a midpoint its two parents, an edge its pre-merge endpoints
// (`sourceVertexIds`) or the edge it was cut from (`sourceEdgeId`), the genealogy's parent — at EVERY depth, stored nowhere, read by the next act. The built image
// record of one identification (D19, `imageRecordOf`) is made the law of every act: an identification derives its image by its seams (the pairs the frozen module
// wrote on the born id, read as before); every other act derives by its provenance alone — the parents' record at an element's sources, under his pairs where his
// (the seam records), under none where the construction merged. Copies read the same. An element with no source holds nothing. A dual corner's source is a FACE,
// which holds no cast (§9.76 (5), OPEN) — it holds nothing and says so. An act whose provenance this reader does not know yet is SAID, never guessed.
//
// The built clause *a form born on the page reads no record* (liftedConceptModel, C-10) falls: `liftedConceptOf` now takes the chain's record for a born form.
//
// RECORD, NOT READING: nothing here stores a derived record; the chain re-derives at every read from the lift's carried record and the shapes on the page.
// ADDITIVE · DERIVE-ONLY · react-free (the view hands the page's forms in; the witness runs this under node).

import type { Edge, Face, Shape, Vertex, VertexId } from '../types/geometry';
import { createDefaultVertexData } from '../lib/shape';
import { IS, NO_FACTS, relating, relatingsOn, withRelating, dirOf, type LexiconFacts, type Relating } from '../lib/relatings';
import { termWordsOf } from '../lib/instanceSpace';
import type { SpaceOfOptions } from '../lib/spaceOf';
import type { Resolved } from '../lib/spaceOf';
import { transportSpaceOf } from '../lib/transport';
import { edgeNameOf } from '../lib/faceReading';
import { levelMarkOf } from '../lib/spaceOf';
import { ALTITUDES_KEY, altitudeHeld, type AltitudeEntry } from '../lib/altitude';
import { FACE_SOURCED_KINDS, imageRecordOf, roleKey, seamsOf, sumSeamsOf, unionChildOf, type SeamRecord } from './identificationImageModel';
import type { ChildRecords } from '../lib/childLoops';
import type { Rule } from '../lib/sorting';

/** what the chain needs of a written form: its shape, how it was born, and its parent(s) on the page */
export interface ChainForm {
  shape: Shape;
  opId: string | null;
  provenance: string;
  title?: string; // the form's title as the page names it (`Cylinder — born`) — the born form's name in the chain line's act words (the designer's 15:35)
  parentShape: Shape | null;
  parentShapes?: Shape[];
}

export interface ChainContext {
  /** the lift's carried ancestors by a LIFTED form's shape id (the shelf entry's `loaded.ancestors`) */
  carriedOf: (shapeId: string) => Shape[];
  /** the written form on the page whose shape has this id — the parent of a born form */
  formOf: (shapeId: string) => ChainForm | null;
  /** the person's seam records (the page store's) */
  seamRecords: SeamRecord[];
  /** the lift file's lexicon by a LIFTED form's shape id (M2); null where the file carried none */
  factsOf: (shapeId: string) => LexiconFacts | null;
  /** Δ244 (GROUP 4 · slice 3): his records as the lift file carried them, by a LIFTED form's shape id, keyed to the loaded record's ids; null where the file carried none */
  recordsOf?: (shapeId: string) => ChildRecords | null;
  /** Δ245 (GROUP 4 · slice 4): his composition rules as the lift file carried them, by a LIFTED form's shape id; null where the file carried none (a file saved between the two spends) */
  rulesOf?: (shapeId: string) => readonly Rule[] | null;
  /** GROUP 4 · slice 5b: a LOADED form's source — the shelf file's `provenance.source`, the id the loader prefixed every carried id with (`snapshot:<source>:<id>`, D8) — so a
   *  band's copies and its genealogy's parent read back to the base form on the page; null where the form was not loaded from the shelf */
  sourceOf?: (shapeId: string) => string | null;
}

export type FormRecord =
  | { state: 'read'; record: Shape; via: 'carried' | 'identification' | 'provenance'; depth: number; chain: string[]; acts: string[]; rootName: string; facts: LexiconFacts | null; records: ChildRecords | null; rules: readonly Rule[] | null } // `acts`: the acts from the lift down, each in the record line's words; `rootName`: the record the lift carried, by name
  | { state: 'none'; reason: string; provenance: string; depth: number }; // `reason`: the absence as the card says it after `born on the page (…) — ` (the designer's 15:35: plain words, never the chain's)

/** THE LIFT'S RULE (C-10): the record a lifted form reads is the carried universe holding the most of its vertices by id */
export function carriedRecordOf(shape: Shape, carried: Shape[]): Shape | null {
  const ids = Object.keys(shape.vertices);
  let record: Shape | null = null;
  let best = 0;
  for (const a of carried) {
    const n = ids.filter((id) => Boolean(a.vertices[id])).length;
    if (n > best) { best = n; record = a; }
  }
  return best > 0 ? record : null;
}

/** the acts that MERGE their sources into one class (the union, his pairs as the pushout where he gave them) */
const MERGE_KINDS = new Set<string>(['glue', 'flip-glue', 'collapse', 'assemble']);
/** the births whose two sources are PARENTS — the corner reads its parents' edge's child on the record, as the Ambo's midpoints do */
const CHILD_KINDS = new Set<string>(['ambo', 'ambo-dissection', 'pyritohedral-diagonalization', 'refine']);
/** a copy: one source, read the same — kept as a copy on the image (`product`, its source), so the resolver reads its source and the segment leg between two copies is
 *  read by structure (GROUP 4 · slice 5b; `copySourceOf`, `segmentOf`) */
const COPY_KINDS = new Set<string>(['product']);
/** GROUP 4 · slice 5b (§9.76 (2), refine is carry) — a REFINED MIDPOINT: the corner refine stamped with the edge it subdivides (`sourceEdgeId`) and that edge's two ends; it
 *  reads the edge's child whatever birth word its form lent it (surfaceRefinement's disclosed inheritance — a bisected torus's midpoint carries `glue`, no merge). The
 *  two sources, or null */
const refineChildOf = (record: Shape, v: Vertex): [VertexId, VertexId] | null => {
  const src = v.createdBy.sourceVertexIds;
  return v.createdBy.sourceEdgeId !== undefined && src.length === 2 && src.every((x) => Boolean(record.vertices[x])) ? [src[0], src[1]] : null;
};
/** GROUP 4 · slice 5b — a split face's altitude records (D22, on a triangle): the parent's entries re-slotted to the part's corner order, kept where the apex and the end
 *  survive in the part, else unread (§9.76 (2), chord); a part that is not a triangle holds none (Δ250: a square has no altitude) */
function reslotFaceRecords(parent: Face, part: Face): Face['data'] {
  const { [ALTITUDES_KEY]: _slots, ...rest } = parent.data ?? {};
  void _slots;
  const slots: Record<string, AltitudeEntry[]> = {};
  if (part.vertexIds.length === 3) {
    parent.vertexIds.forEach((apex, k) => {
      const ak = part.vertexIds.indexOf(apex);
      if (ak < 0) return;
      for (const e of altitudeHeld(parent, k)) {
        const end = parent.vertexIds[e[0] === 'say' ? e[3] : e[1]];
        const ek = end === undefined ? -1 : part.vertexIds.indexOf(end);
        if (ek < 0 || ek > 2) continue;
        const moved = (e[0] === 'say' ? [e[0], e[1], e[2], ek, e[4], e[5], ...(e.length === 7 ? [e[6]] : [])] : [e[0], ek, e[2], e[3], e[4], e[5], e[6]]) as AltitudeEntry;
        (slots[String(ak)] ??= []).push(moved);
      }
    });
  }
  const data = { ...rest, ...(Object.keys(slots).length ? { [ALTITUDES_KEY]: slots } : {}) } as Face['data'];
  return Object.keys(data ?? {}).length ? data : undefined;
}
// a corner whose source is a FACE — no cast (§9.76 (5), the dual OPEN): FACE_SOURCED_KINDS lives in the image module, one rule read by both readers (GROUP 4 · slice 4)

export type ProvenanceReading =
  | { state: 'derived'; image: Shape; merged: number; copies: number; children: number; empty: number }
  | { state: 'unknown'; operation: string; vertex: VertexId };

/**
 * THE PROVENANCE DERIVATION — a born shape's record from its parent's record along `createdBy` and the edges' sources, for every act that is not an
 * identification by seams. Kept elements read the record's own; a merged class reads the union of its members' spaces (his seam pairs the pushout, none
 * where the construction merged); a copy its source's space; a two-parent birth its parents' edge's child (the resolver's own reading on the image); a
 * face-sourced corner nothing. Every record edge is carried with its ends re-pointed and its relatings re-keyed into merged roles (an identified pair stays
 * two edges here — the identification path joins them); a born edge the record lacks reads the edge it was cut from, else the record's edge between its
 * pre-merge endpoints, else nothing.
 */
export function provenanceRecordOf(record0: Shape, born: Shape, seamRecords: SeamRecord[] = [], operation: string = born.genealogy.operation, parent: Shape | null = null): ProvenanceReading {
  // GROUP 4 · slice 5b — THE INTERMEDIATES (§9.76 (2), refine is carry): a member the born form names that the record lacks, held by the PARENT shape as a refined midpoint
  // (the page's sew prepares a rim by bisection in the same act that merges it), joins the record as that edge's child before the act is read, its half-edges with it as
  // legs; nothing else of the parent enters
  const intermediates: Record<VertexId, Vertex> = {};
  if (parent) {
    for (const v of Object.values(born.vertices)) for (const s of v.createdBy.sourceVertexIds) {
      const held = parent.vertices[s];
      if (!held || record0.vertices[s] || intermediates[s] || !refineChildOf(record0, held)) continue;
      intermediates[s] = { ...held, createdBy: { ...held.createdBy, shapeId: `image:${born.id}` } };
    }
  }
  const record: Shape = Object.keys(intermediates).length && parent
    ? { ...record0, vertices: { ...record0.vertices, ...intermediates }, edges: [...record0.edges, ...parent.edges.filter((e) => (intermediates[e.vertexIds[0]] || intermediates[e.vertexIds[1]]) && !record0.edges.some((x) => x.id === e.id)).map((e) => ({ ...e, identification: undefined, data: undefined }))] }
    : record0;
  const memo = new Map<VertexId, Resolved | null>();
  const childMemo: Parameters<typeof transportSpaceOf>[3] = new Map();
  const spaceMemo = new Map<VertexId, import('../types/geometry').ConceptSpace | null>();
  const sup = new Map<VertexId, VertexId>(); // a record vertex absorbed into a born class → the class
  const finds = new Map<VertexId, (k: string) => string>();
  const vertices: Record<VertexId, Vertex> = {};
  let merged = 0; let copies = 0; let children = 0; let empty = 0;
  const bare = (v: Vertex, label: string): Vertex => ({ ...v, data: { ...createDefaultVertexData(label), cast: undefined }, createdBy: { shapeId: `image:${born.id}`, operation: 'seed', sourceVertexIds: [] } });
  const transportsAt = (classId: VertexId): import('./apertureModel').DoorTransport[] => seamRecords.filter((r) => r.formId === born.id).flatMap((r) => r.transports).filter((t) => (sup.get(t.corners[0]) ?? t.corners[0]) === classId && (sup.get(t.corners[1]) ?? t.corners[1]) === classId);
  for (const v of Object.values(born.vertices)) {
    if (record.vertices[v.id]) continue; // kept by id: the record's own, re-pointed below
    const op = v.createdBy.operation;
    const sources = v.createdBy.sourceVertexIds.filter((s) => Boolean(record.vertices[s]));
    const label = v.data.label?.trim() || sources.map((s) => record.vertices[s]?.data.label?.trim() || s).join('·');
    if (FACE_SOURCED_KINDS.has(op) || sources.length === 0) { vertices[v.id] = bare(v, label); empty += 1; continue; }
    // GROUP 4 · slice 5b: a refined midpoint reads the subdivided edge's child (its half-edges the coordinate legs, by structure) — before the merge rule, since its inherited word may be a merge's
    const refined = refineChildOf(record, v);
    if (refined) { vertices[v.id] = { ...v, data: { ...v.data, label: v.data.label?.trim() || label }, createdBy: { ...v.createdBy, shapeId: `image:${born.id}`, sourceVertexIds: [...refined] } }; children += 1; continue; }
    if (MERGE_KINDS.has(op) && sources.length >= 2) {
      for (const s of sources) sup.set(s, v.id);
      const u = unionChildOf(record, v.id, sources, transportsAt(v.id), memo, childMemo, spaceMemo);
      finds.set(v.id, u.find);
      vertices[v.id] = { ...v, data: { ...createDefaultVertexData(label), cast: u.space }, createdBy: { shapeId: `image:${born.id}`, operation: 'seed', sourceVertexIds: [] } };
      merged += 1; continue;
    }
    if (COPY_KINDS.has(op) && sources.length === 1) {
      // GROUP 4 · slice 5b: a copy stays a copy on the image — the resolver reads its source (`copySourceOf`), the segment leg between a corner's two copies is read by
      // structure (`segmentOf`); nothing poured, nothing stored (before: the copy was re-made a seed holding a poured cast, and the leg was no leg)
      // the designer's 12:45 (2c): a copy is named with its LEVEL (`Accumulation₀`), as the walk names it — so a leg between two levels never reads `<A>–<A>`
      vertices[v.id] = { ...v, data: createDefaultVertexData(`${label}${levelMarkOf(v.id)}`), createdBy: { shapeId: `image:${born.id}`, operation: 'product', sourceVertexIds: [sources[0]] } };
      copies += 1;
      continue;
    }
    if (CHILD_KINDS.has(op) && sources.length === 2) { vertices[v.id] = { ...v, createdBy: { ...v.createdBy, sourceVertexIds: [...sources] } }; children += 1; continue; }
    return { state: 'unknown', operation: op, vertex: v.id };
  }
  const supOf = (id: VertexId): VertexId => sup.get(id) ?? id;
  for (const v of Object.values(record.vertices)) {
    if (sup.has(v.id)) continue;
    vertices[v.id] = { ...v, createdBy: { ...v.createdBy, sourceVertexIds: v.createdBy.sourceVertexIds.map(supOf) } };
  }
  /** a relating of a record edge, re-keyed into the image's roles at a merged end (the member's role by its member, then through the pushout) */
  const rekeyOn = (edge: Edge, r: Relating): Relating => {
    const [c0, c1] = edge.vertexIds;
    const kx = sup.has(c0) ? (finds.get(supOf(c0)) as (k: string) => string)(roleKey(c0, r[1])) : r[1];
    const ky = sup.has(c1) ? (finds.get(supOf(c1)) as (k: string) => string)(roleKey(c1, r[2])) : r[2];
    return relating(r[0], kx, ky, r[3], dirOf(r));
  };
  const carryEdge = (from: Edge, into: Edge): Edge => {
    const { relatings: _dropped, ...packet } = from.data ?? {};
    void _dropped;
    let image: Edge = { ...from, ...into, identification: { roles: [], types: from.identification?.types ?? [] }, data: Object.keys(packet).length ? (packet as Edge['data']) : undefined };
    for (const r of relatingsOn(from)) image = withRelating(image, rekeyOn(from, r));
    return image;
  };
  const edges: Edge[] = [];
  const carried = new Set<string>();
  for (const e of record.edges) {
    edges.push(carryEdge(e, { ...e, vertexIds: [supOf(e.vertexIds[0]), supOf(e.vertexIds[1])], sourceVertexIds: [supOf(e.sourceVertexIds[0]), supOf(e.sourceVertexIds[1])] }));
    carried.add(e.id);
  }
  // GROUP 4 · slice 5b: a copied edge (both ends level copies of two corners) reads the record's edge between their sources — every edge becomes two copies, each reading
  // the edge's relatings and bars; the SEGMENT LEG (both ends copies of ONE corner) carries nothing — it is structure, read by `segmentOf`; a CHORD (an edge whose source is
  // the face it crosses) is a new edge with no edge behind it, a true absence
  const copySrc = (id: VertexId): VertexId => { const c = born.vertices[id]; return c && COPY_KINDS.has(c.createdBy.operation) && c.createdBy.sourceVertexIds.length === 1 ? c.createdBy.sourceVertexIds[0] : id; };
  const between = (a: VertexId, b: VertexId): Edge | undefined => record.edges.find((x) => (x.vertexIds[0] === a && x.vertexIds[1] === b) || (x.vertexIds[0] === b && x.vertexIds[1] === a));
  for (const e of born.edges) {
    if (carried.has(e.id)) continue;
    const [s0, s1] = [copySrc(e.vertexIds[0]), copySrc(e.vertexIds[1])];
    const segment = s0 === s1 && s0 !== e.vertexIds[0];
    const chord = e.sourceFaceId !== undefined;
    const from = segment || chord ? undefined : (e.sourceEdgeId && record.edges.find((x) => x.id === e.sourceEdgeId)) || between(e.sourceVertexIds[0], e.sourceVertexIds[1]) || (s0 !== e.vertexIds[0] || s1 !== e.vertexIds[1] ? between(s0, s1) : undefined);
    const ends: [VertexId, VertexId] = [supOf(e.vertexIds[0]), supOf(e.vertexIds[1])];
    edges.push(from ? carryEdge(from, { ...e, vertexIds: ends, sourceVertexIds: [supOf(e.sourceVertexIds[0]), supOf(e.sourceVertexIds[1])] }) : { ...e, vertexIds: ends, identification: undefined, data: undefined });
    carried.add(e.id);
  }
  const faceIds = new Set<string>();
  const faces: Face[] = [];
  for (const f of record.faces) { const ids = f.vertexIds.map(supOf); if (new Set(ids).size !== ids.length) continue; faces.push({ ...f, vertexIds: ids }); faceIds.add(f.id); }
  const carrier = born.genealogy.resolution?.carrier ?? {};
  for (const f of born.faces) {
    if (faceIds.has(f.id)) continue;
    const ids = f.vertexIds.map(supOf); if (new Set(ids).size !== ids.length) continue;
    // GROUP 4 · slice 5b (§9.76 (2), chord): a part of a split face reads the parent face's records where the apex and the end survive in it, else unread — never the parent's slots as they lie
    const parentFace = carrier[f.id] && carrier[f.id] !== f.id ? record.faces.find((x) => x.id === carrier[f.id]) : undefined;
    faces.push(parentFace ? { ...f, vertexIds: ids, data: reslotFaceRecords(parentFace, { ...f, vertexIds: ids }) } : { ...f, vertexIds: ids }); faceIds.add(f.id);
  }
  const cells = record.cells.map((c) => ({ ...c, vertexIds: c.vertexIds.map(supOf) }));
  const image: Shape = { ...record, id: `image:${born.id}`, name: `${record.name} — ${operation}`, vertices, edges, faces, cells, genealogy: { ...record.genealogy, parentShapeId: record.id } };
  return { state: 'derived', image, merged, copies, children, empty };
}

/** two (or more) records SIDE BY SIDE (§9.76 (2), the connected sum): one record holding each one's corners, edges, faces and cells, joined by nothing; null where two share
 *  an id — side by side they must be two (the sum refuses forms that share ids, so a sum's parents never do) */
export function sideBySideOf(records: readonly Shape[]): Shape | null {
  if (records.length === 0) return null;
  const seen = new Set<string>();
  for (const r of records) for (const id of [...Object.keys(r.vertices), ...r.edges.map((e) => e.id), ...r.faces.map((f) => f.id)]) { if (seen.has(id)) return null; seen.add(id); }
  const [first] = records;
  return { ...first, id: `side-by-side:${records.map((r) => r.id).join('+')}`, name: records.map((r) => r.name).join(' and '), vertices: Object.assign({}, ...records.map((r) => r.vertices)), edges: records.flatMap((r) => r.edges), faces: records.flatMap((r) => r.faces), cells: records.flatMap((r) => r.cells) };
}
/** §9.76 (2) — A SUM'S TWO RECORDS SIDE BY SIDE (GROUP 4 · slices 5a and 5a′): each summand's record read by the chain's own rule (its own `seen`: two summands may share an
 *  ancestor's chain without a cycle), joined by nothing; the chain's reason where a summand carries none or the two share a corner. One producer for the chain and the view */
export function summandsOf(parents: readonly Shape[], ctx: ChainContext, depth = 0, seen: Set<string> = new Set()): { reads: Array<Extract<FormRecord, { state: 'read' }>>; side: Shape } | { reason: string } {
  const Ps = parents.map((ps) => formRecordOf(ctx.formOf(ps.id) ?? { shape: ps, opId: null, provenance: 'the parent form', parentShape: null }, ctx, depth + 1, new Set(seen)));
  const lacking = Ps.find((P): P is Extract<FormRecord, { state: 'none' }> => P.state !== 'read');
  if (lacking) return { reason: `nothing to read: a parent of this sum carries no record — ${lacking.reason.replace(/^nothing to read( yet)?: /, '')}` };
  const reads = Ps as Array<Extract<FormRecord, { state: 'read' }>>;
  const side = sideBySideOf(reads.map((P) => P.record));
  return side ? { reads, side } : { reason: 'nothing to read: the two records share a corner, and side by side they must be two' };
}
/** the lift files' words side by side: his converses and opaque words from each file, once each; null where no file carried them */
function factsSideBySide(all: ReadonlyArray<LexiconFacts | null>): LexiconFacts | null {
  const held = all.filter((f): f is LexiconFacts => f !== null);
  if (held.length === 0) return null;
  const converses: Array<readonly [string, string]> = [];
  for (const f of held) for (const c of f.converses) if (!converses.some((x) => x[0] === c[0] && x[1] === c[1])) converses.push([c[0], c[1]]);
  return { converses, opaque: [...new Set(held.flatMap((f) => [...f.opaque]))] };
}
/** his records from each lift file side by side (each row keyed by its own shape, so two files' rows never meet); null where no file carried them */
function recordsSideBySide(all: ReadonlyArray<ChildRecords | null>): ChildRecords | null {
  const held = all.filter((r): r is ChildRecords => r !== null);
  if (held.length === 0) return null;
  return { roleNames: held.flatMap((r) => [...r.roleNames]), loopAnswers: held.flatMap((r) => [...r.loopAnswers]), loopRules: held.flatMap((r) => [...r.loopRules]), relationNames: held.flatMap((r) => [...r.relationNames]), facts: factsSideBySide(held.map((r) => r.facts)) ?? NO_FACTS };
}
/** his composition rules from each lift file side by side; null where no file carried them */
function rulesSideBySide(all: ReadonlyArray<readonly Rule[] | null>): readonly Rule[] | null {
  const held = all.filter((r): r is readonly Rule[] => r !== null);
  return held.length === 0 ? null : held.flatMap((r) => [...r]);
}

/**
 * THE CHAIN: the record a form reads — a lifted form the carried universe (the lift's rule); a form born by an act its parent's record DERIVED by the act —
 * an identification by its seams (D19's image, as built), any other act by its provenance — the parent's record being read by this same rule, at every depth.
 */
export function formRecordOf(form: ChainForm, ctx: ChainContext, depth = 0, seen: Set<string> = new Set()): FormRecord {
  if (seen.has(form.shape.id)) return { state: 'none', reason: 'nothing to read: the chain closes on itself', provenance: form.provenance, depth };
  seen.add(form.shape.id);
  if (form.opId === null) {
    // GROUP 4 · slice 5b (§9.76 (2), thicken) — THE BAND: a product rides the shelf and is placed as a loaded form, its file carrying the base shape alone; it reads its BASE
    // FORM's record derived by the product — the base found through the genealogy's parent, the copies' sources through the loader's own namespace (`snapshot:<source>:<id>`)
    if (form.shape.genealogy.operation === 'product') {
      // the file's source IS the base form's shape id (the store hands `shape.id` as the band file's source); the loader prefixed the band's ids with it (`<source>:<id>`, the
      // original surviving as the strict `:`-suffix — D8, measured), so a copy's source reads back by that one prefix
      const source = ctx.sourceOf?.(form.shape.id) ?? null;
      const strip = (id: string): string => (source && id.startsWith(`${source}:`) ? id.slice(source.length + 1) : source && id.startsWith(`snapshot:${source}:`) ? id.slice(source.length + 10) : id);
      const base = (source ? ctx.formOf(source) : null) ?? ctx.formOf(strip(form.shape.genealogy.parentShapeId ?? ''));
      if (!base) return { state: 'none', reason: 'nothing to read: the base this band thickens is not on the page', provenance: form.provenance, depth };
      const P = formRecordOf(base, ctx, depth + 1, seen);
      if (P.state !== 'read') return { state: 'none', reason: `nothing to read: the base this band thickens carries no record — ${P.reason.replace(/^nothing to read( yet)?: /, '')}`, provenance: form.provenance, depth };
      const shape: Shape = { ...form.shape, vertices: Object.fromEntries(Object.entries(form.shape.vertices).map(([id, v]) => [id, { ...v, createdBy: { ...v.createdBy, sourceVertexIds: v.createdBy.sourceVertexIds.map(strip) } }])), edges: form.shape.edges.map((e) => ({ ...e, sourceVertexIds: [strip(e.sourceVertexIds[0]), strip(e.sourceVertexIds[1])] as [VertexId, VertexId] })) };
      const D = provenanceRecordOf(P.record, shape, ctx.seamRecords, 'thicken', base.shape);
      if (D.state === 'unknown') return { state: 'none', reason: `nothing to read yet: the concept layer is not carried through ${D.operation} yet (${D.vertex})`, provenance: form.provenance, depth };
      const name = form.title ? form.title.replace(/ — loaded$/, '') : form.shape.name;
      return { state: 'read', record: D.image, via: 'provenance', depth, chain: [...P.chain, form.provenance], acts: [...P.acts, `thicken → ${name}`], rootName: P.rootName, facts: P.facts, records: P.records, rules: P.rules };
    }
    const record = carriedRecordOf(form.shape, ctx.carriedOf(form.shape.id));
    if (!record) return { state: 'none', reason: 'nothing to read: nothing carried — this form was not lifted from a universe', provenance: form.provenance, depth };
    const read = { state: 'read' as const, via: 'carried' as const, depth, chain: [form.provenance], acts: [] as string[], rootName: record.name, facts: ctx.factsOf(form.shape.id), records: ctx.recordsOf?.(form.shape.id) ?? null, rules: ctx.rulesOf?.(form.shape.id) ?? null };
    // GROUP 4 · slice 5b (§9.76 (2), refine is carry): a lift REFINED IN PLACE holds elements the record lacks — the midpoints of its subdivided edges, each reading the
    // edge's child, a chord with no edge behind it, the parts of a split face; the record is derived by the form's own provenance (refine is not a birth: the lift's record,
    // read through the subdivision)
    const refinedInPlace = Object.keys(form.shape.vertices).some((id) => !record.vertices[id]) || form.shape.edges.some((e) => !record.edges.some((x) => x.id === e.id)) || form.shape.faces.some((f) => !record.faces.some((x) => x.id === f.id));
    if (refinedInPlace) {
      const D = provenanceRecordOf(record, form.shape, [], 'refine');
      if (D.state === 'unknown') return { state: 'none', reason: `nothing to read yet: the concept layer is not carried through ${D.operation} yet (${D.vertex})`, provenance: form.provenance, depth };
      return { ...read, record: D.image, via: 'provenance', acts: ['refine — subdivided in place'] };
    }
    return { ...read, record };
  }
  const parents = form.parentShapes && form.parentShapes.length > 1 ? form.parentShapes : form.parentShape ? [form.parentShape] : [];
  if (parents.length === 0) return { state: 'none', reason: 'nothing to read: born by an act with no parent on the page', provenance: form.provenance, depth };
  // §9.76 (2) — CONNECTED SUM (GROUP 4 · slice 5a): BOTH RECORDS SIDE BY SIDE — each parent's record read by this same rule (its own `seen`: two parents may share an
  // ancestor's chain without a cycle), joined by nothing, read through the sum's provenance: a rim corner it merged reads its members' union under HIS seam transports
  // (given, never computed), every other corner its own parent's
  if (parents.length > 1) {
    const U = summandsOf(parents, ctx, depth, seen);
    if ('reason' in U) return { state: 'none', reason: U.reason, provenance: form.provenance, depth };
    const { reads, side } = U;
    const facts = factsSideBySide(reads.map((P) => P.facts)); const records = recordsSideBySide(reads.map((P) => P.records)); const rules = rulesSideBySide(reads.map((P) => P.rules));
    const chain = [...reads.flatMap((P) => P.chain), form.provenance]; const acts = [...reads.flatMap((P) => P.acts), actWords(form)]; const rootName = reads.map((P) => P.rootName).join(' and ');
    // GROUP 4 · slice 5a′ (Δ248): the RIM read as seams from the sum's own provenance — the image the identification section reads, his transports joining the rim corners'
    // members (given, never computed): one reading for the chain and the card, by construction; the provenance reading only where the rim cannot be read
    const rim = parents.length === 2 ? sumSeamsOf(form.shape, [parents[0], parents[1]], side) : { reason: 'more than two summands' };
    if (!('reason' in rim)) {
      const { image } = imageRecordOf(side, form.shape.id, rim.seams, rim.classes, ctx.seamRecords.filter((r) => r.formId === form.shape.id), facts ?? NO_FACTS, records);
      return { state: 'read', record: image, via: 'identification', depth, chain, acts, rootName, facts, records, rules };
    }
    const D = provenanceRecordOf(side, form.shape, ctx.seamRecords);
    if (D.state === 'unknown') return { state: 'none', reason: `nothing to read yet: the concept layer is not carried through ${D.operation} yet (${D.vertex})`, provenance: form.provenance, depth };
    return { state: 'read', record: D.image, via: 'provenance', depth, chain, acts, rootName, facts, records, rules };
  }
  const parentShape = parents[0];
  const parentForm = ctx.formOf(parentShape.id) ?? { shape: parentShape, opId: null, provenance: 'the parent form', parentShape: null };
  const P = formRecordOf(parentForm, ctx, depth + 1, seen);
  if (P.state !== 'read') return { state: 'none', reason: `nothing to read: the parent carries no record — ${P.reason.replace(/^nothing to read( yet)?: /, '')}`, provenance: form.provenance, depth };
  // §9.76 (5), the dual OPEN — the designer's 15:35 words for it: a face-sourced corner holds nothing to read
  if (FACE_SOURCED_KINDS.has(form.shape.genealogy.operation)) return { state: 'none', reason: "nothing to read: a dual's corners are the faces, and a face holds no space", provenance: form.provenance, depth };
  const S = seamsOf(form.shape, parentShape);
  if (!('reason' in S)) {
    const own = ctx.seamRecords.filter((r) => r.formId === form.shape.id);
    const { image } = imageRecordOf(P.record, form.shape.id, S.seams, S.classes, own, P.facts ?? NO_FACTS, P.records);
    return { state: 'read', record: image, via: 'identification', depth, chain: [...P.chain, form.provenance], acts: [...P.acts, actWords(form)], rootName: P.rootName, facts: P.facts, records: P.records, rules: P.rules };
  }
  const D = provenanceRecordOf(P.record, form.shape, ctx.seamRecords, undefined, parentShape); // GROUP 4 · slice 5b: the parent shape hands the refined midpoints the act consumed
  if (D.state === 'unknown') return { state: 'none', reason: `nothing to read yet: the concept layer is not carried through ${D.operation} yet (${D.vertex})`, provenance: form.provenance, depth };
  return { state: 'read', record: D.image, via: 'provenance', depth, chain: [...P.chain, form.provenance], acts: [...P.acts, actWords(form)], rootName: P.rootName, facts: P.facts, records: P.records, rules: P.rules };
}

/** an act's words in the chain line (the designer's 15:35) — the record line's own: the act's verb and the born form's name (`Glue → Cylinder`, `Glue → genus 1`); the
 *  provenance as the page holds it where the form has no title */
export function actWords(form: ChainForm): string {
  const head = form.provenance.includes(' → ') ? form.provenance.split(' → ')[0] : form.provenance;
  // the name without its born marker — ` — born`, ` — cut-born` (measured 10-22: `Cut (remove the 2-cell) → Skeleton — cut-born`), ` — enacted, bodiless`
  const name = form.title ? form.title.replace(/ — ([a-z]+-)?born$| — enacted, bodiless$/, '') : null;
  return name ? `${head} → ${name}` : form.provenance;
}

/**
 * §9.76 (2) — COLLAPSE, an identification by the construction with no pairs of his, REFUSED BY NAME while an IS relating stands on a collapsed edge: the collapse makes the
 * picked face's corners one, so an IS instance on a record edge between two of them would make two moments of one corner one (the stone). The first such edge, in the record's
 * order, with its pair's words; null where none stands. The view asks it at pick time (the dock's and the menu's row) and at the act (GROUP 4 · slice 5a).
 */
export function collapseRefusalOf(record: Shape, corners: readonly VertexId[], options: SpaceOfOptions = {}): { edge: Edge; pairs: Array<{ x: string; y: string }>; ends: [string, string]; words: string } | null {
  const merged = new Set(corners);
  const labelOf = (v: VertexId): string => record.vertices[v]?.data.label?.trim() || 'unnamed';
  for (const e of record.edges) {
    const [a, b] = e.vertexIds;
    if (a === b || !merged.has(a) || !merged.has(b)) continue;
    const held = relatingsOn(e, options).filter((x) => x[0] === IS && x[3] === '+');
    if (!held.length) continue;
    const pairs = held.map((r) => ({ x: termWordsOf(record, a, r[1], options), y: termWordsOf(record, b, r[2], options) }));
    const A = labelOf(a); const B = labelOf(b);
    // the designer's 21:41: what the collapse does, then the route — `… Withdraw it there first · open A–B` (the door the view adds where the site can be found)
    const named = pairs.map((p) => `${p.x} ≡ ${p.y}`);
    const list = named.length === 1 ? named[0] : `${named.slice(0, -1).join(', ')} and ${named[named.length - 1]}`;
    const AB = edgeNameOf(A, B); // the designer's 23:20 (2): the edge by its name, a spaced dash where a corner's name holds one
    const words = pairs.length === 1
      ? `not collapsed — ${list} stands on ${AB}, and collapsing ${AB} would leave ${pairs[0].x} and ${pairs[0].y} two moments of one corner. Withdraw it there first`
      : `not collapsed — ${list} stand on ${AB}, and collapsing ${AB} would leave each two moments of one corner. Withdraw them there first`;
    return { edge: e, pairs, ends: [A, B], words };
  }
  return null;
}

/** `N act(s) (A, then B)` — the acts from the lift down, counted and named; null for a lifted form */
export function throughWords(fr: FormRecord): string | null {
  if (fr.state !== 'read' || fr.acts.length === 0) return null;
  return `${fr.acts.length} act${fr.acts.length === 1 ? '' : 's'} (${fr.acts.join(', then ')})`;
}

/** the chain said in words, for the card (the designer's 15:35): his own line's head, then how far it came and every act on the way —
 *  `read from the record the lift carried, through 2 acts (Glue → Cylinder, then Glue → genus 1)` */
export function chainWords(fr: FormRecord): string {
  if (fr.state !== 'read') return fr.reason;
  const through = throughWords(fr);
  return `read from the record the lift carried${through ? `, through ${through}` : ''}`;
}

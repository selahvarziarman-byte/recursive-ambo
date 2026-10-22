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
import { NO_FACTS, relating, relatingsOn, withRelating, dirOf, type LexiconFacts, type Relating } from '../lib/relatings';
import type { Resolved } from '../lib/spaceOf';
import { transportSpaceOf } from '../lib/transport';
import { imageRecordOf, roleKey, seamsOf, unionChildOf, type SeamRecord } from './identificationImageModel';
import type { ChildRecords } from '../lib/childLoops';

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
  recordsOf: (shapeId: string) => ChildRecords | null;
}

export type FormRecord =
  | { state: 'read'; record: Shape; via: 'carried' | 'identification' | 'provenance'; depth: number; chain: string[]; acts: string[]; rootName: string; facts: LexiconFacts | null; records: ChildRecords | null } // `acts`: the acts from the lift down, each in the record line's words; `rootName`: the record the lift carried, by name
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
/** a copy: one source, read the same */
const COPY_KINDS = new Set<string>(['product']);
/** a corner whose source is a FACE — no cast (§9.76 (5), the dual OPEN) */
const FACE_SOURCED_KINDS = new Set<string>(['dualization']);

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
export function provenanceRecordOf(record: Shape, born: Shape, seamRecords: SeamRecord[] = [], operation: string = born.genealogy.operation): ProvenanceReading {
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
    if (MERGE_KINDS.has(op) && sources.length >= 2) {
      for (const s of sources) sup.set(s, v.id);
      const u = unionChildOf(record, v.id, sources, transportsAt(v.id), memo, childMemo, spaceMemo);
      finds.set(v.id, u.find);
      vertices[v.id] = { ...v, data: { ...createDefaultVertexData(label), cast: u.space }, createdBy: { shapeId: `image:${born.id}`, operation: 'seed', sourceVertexIds: [] } };
      merged += 1; continue;
    }
    if (COPY_KINDS.has(op) && sources.length === 1) {
      const r = transportSpaceOf(record, sources[0], memo, childMemo);
      vertices[v.id] = r ? { ...v, data: { ...createDefaultVertexData(label), cast: r.space }, createdBy: { shapeId: `image:${born.id}`, operation: 'seed', sourceVertexIds: [] } } : bare(v, label);
      if (r) copies += 1; else empty += 1;
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
  for (const e of born.edges) {
    if (carried.has(e.id)) continue;
    const from = (e.sourceEdgeId && record.edges.find((x) => x.id === e.sourceEdgeId)) || record.edges.find((x) => (x.vertexIds[0] === e.sourceVertexIds[0] && x.vertexIds[1] === e.sourceVertexIds[1]) || (x.vertexIds[0] === e.sourceVertexIds[1] && x.vertexIds[1] === e.sourceVertexIds[0])) || null;
    const ends: [VertexId, VertexId] = [supOf(e.vertexIds[0]), supOf(e.vertexIds[1])];
    edges.push(from ? carryEdge(from, { ...e, vertexIds: ends, sourceVertexIds: [supOf(e.sourceVertexIds[0]), supOf(e.sourceVertexIds[1])] }) : { ...e, vertexIds: ends, identification: undefined, data: undefined });
    carried.add(e.id);
  }
  const faceIds = new Set<string>();
  const faces: Face[] = [];
  for (const f of record.faces) { const ids = f.vertexIds.map(supOf); if (new Set(ids).size !== ids.length) continue; faces.push({ ...f, vertexIds: ids }); faceIds.add(f.id); }
  for (const f of born.faces) { if (faceIds.has(f.id)) continue; const ids = f.vertexIds.map(supOf); if (new Set(ids).size !== ids.length) continue; faces.push({ ...f, vertexIds: ids }); faceIds.add(f.id); }
  const cells = record.cells.map((c) => ({ ...c, vertexIds: c.vertexIds.map(supOf) }));
  const image: Shape = { ...record, id: `image:${born.id}`, name: `${record.name} — ${operation}`, vertices, edges, faces, cells, genealogy: { ...record.genealogy, parentShapeId: record.id } };
  return { state: 'derived', image, merged, copies, children, empty };
}

/**
 * THE CHAIN: the record a form reads — a lifted form the carried universe (the lift's rule); a form born by an act its parent's record DERIVED by the act —
 * an identification by its seams (D19's image, as built), any other act by its provenance — the parent's record being read by this same rule, at every depth.
 */
export function formRecordOf(form: ChainForm, ctx: ChainContext, depth = 0, seen: Set<string> = new Set()): FormRecord {
  if (seen.has(form.shape.id)) return { state: 'none', reason: 'nothing to read: the chain closes on itself', provenance: form.provenance, depth };
  seen.add(form.shape.id);
  if (form.opId === null) {
    const record = carriedRecordOf(form.shape, ctx.carriedOf(form.shape.id));
    return record ? { state: 'read', record, via: 'carried', depth, chain: [form.provenance], acts: [], rootName: record.name, facts: ctx.factsOf(form.shape.id), records: ctx.recordsOf(form.shape.id) } : { state: 'none', reason: 'nothing to read: nothing carried — this form was not lifted from a universe', provenance: form.provenance, depth };
  }
  const parents = form.parentShapes && form.parentShapes.length > 1 ? form.parentShapes : form.parentShape ? [form.parentShape] : [];
  if (parents.length === 0) return { state: 'none', reason: 'nothing to read: born by an act with no parent on the page', provenance: form.provenance, depth };
  // the designer's 15:35: an act not read yet, in plain words (the connected sum's reading is slice 5a's)
  if (parents.length > 1) return { state: 'none', reason: 'nothing to read yet: the concept layer is not carried through a connected sum yet', provenance: form.provenance, depth };
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
    return { state: 'read', record: image, via: 'identification', depth, chain: [...P.chain, form.provenance], acts: [...P.acts, actWords(form)], rootName: P.rootName, facts: P.facts, records: P.records };
  }
  const D = provenanceRecordOf(P.record, form.shape, ctx.seamRecords);
  if (D.state === 'unknown') return { state: 'none', reason: `nothing to read yet: the concept layer is not carried through ${D.operation} yet (${D.vertex})`, provenance: form.provenance, depth };
  return { state: 'read', record: D.image, via: 'provenance', depth, chain: [...P.chain, form.provenance], acts: [...P.acts, actWords(form)], rootName: P.rootName, facts: P.facts, records: P.records };
}

/** an act's words in the chain line (the designer's 15:35) — the record line's own: the act's verb and the born form's name (`Glue → Cylinder`, `Glue → genus 1`); the
 *  provenance as the page holds it where the form has no title */
export function actWords(form: ChainForm): string {
  const head = form.provenance.includes(' → ') ? form.provenance.split(' → ')[0] : form.provenance;
  const name = form.title ? form.title.replace(/ — (born|enacted, bodiless)$/, '') : null;
  return name ? `${head} → ${name}` : form.provenance;
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

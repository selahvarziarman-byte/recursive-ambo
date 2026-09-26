// liftedConceptModel — STAMP C-10 (2026-09-24): THE LIFT CARRIES (Station C, step 2).
//
// The person's sentence: he lifts a region he has given transports to, and finds the transports still there on the
// lifted form. The acceptance: what the substrate holds, the lift CARRIES — and where it cannot, it MARKS; a cell born
// after the lift has no transport — a TRUE ABSENCE, the person's to give, never minted.
//
// THE MECHANISM, measured before it was built (item 0, 2026-09-24, scripts/diagnose-the-lift-carries.cjs §1): the
// lift's file already carries the source universe WHOLE as its one ancestor — `liftSelectionToManuscript` hands the
// workspace population to `serializeSnapshot`, whose GAP2C chain walks from the lifted shape's parent pointer (the
// source) and stops at the first direct-readable link, which the source itself is (measured at gen 0, 1 and 2) — so the
// seed casts, the person's J records and the lineage ride VERBATIM, and the committed loader re-keys the ancestor with
// the SAME source prefix as the form, so a lifted vertex's id names the same vertex in the carried record. What was
// missing was a READER: on the lifted shape ALONE the resolver returns nothing for every born vertex whose parents lie
// outside the region (3 of 4 on a gen-1 corner cell, 6 of 6 on the core, 5 of 5 on a gen-2 residue — a FALSE absence),
// while on the carried record every lifted vertex resolves the SAME space as in the Ambo and every face reads
// byte-equal (0 changed — the falsifier). RECORD, NOT READING: nothing here stores a space; the ONE resolver (spaceOf)
// re-derives on the record at every read.
//
// THE RULE: the record a form reads is the carried universe that holds its vertices by id (the loader's namespacing
// makes a lifted vertex's id the record's own). A form BORN ON THE PAGE by an act (`opId` set) reads NO record — a cell
// born after the lift has no transport, and none is minted, whatever ids its birth kept. A form that carried no record
// (invoked here, or an old file) says so. A vertex the record holds but cannot resolve (a seed with no cast, or a born
// vertex descending from one) is said, per row — the no-cast control is a TRUE ABSENCE on every row, never a minted
// space.
//
// ADDITIVE · DERIVE-ONLY · react-free (the section draws what this returns; the witness runs this under node).

import type { Face, Shape, VertexId } from '../types/geometry';
import { isSeedVertex, spaceCounts, spaceOf, TRANSPORT_OPTIONS, type Resolved } from '../lib/spaceOf';
import { faceReferenceName } from './apertureModel';

export type AbsentResolver = Parameters<typeof faceReferenceName>[2];

export interface LiftedVertexRow {
  id: VertexId;
  label: string;
  held: boolean; // the carried record holds this vertex by id
  space: 'seed' | 'derived' | 'none'; // the resolver's origin on the record — or nothing
  roles: number;
  words: number;
  tuples: number; // C-10b: the card's words carry the space's three counts (the Ambo's own card line)
  absence: string | null; // the words for `none`: which seed corner holds no cast
}

export interface LiftedFaceRow {
  id: string;
  cycle: [VertexId, VertexId, VertexId];
  name: string; // D14, composed from the corners — never the id
  kind: 'seed' | 'born'; // every corner a seed (the gen-0 face) · a born corner (the born face, read through the resolver)
  held: boolean; // every corner held by the record
  cornerCell: boolean; // one residue cell's face with a seed corner — it returns all of its corner to itself; no block (C-9)
}

export type LiftedConcept =
  | { state: 'read'; record: Shape; source: string; vertices: LiftedVertexRow[]; faces: LiftedFaceRow[]; held: number; resolved: number }
  | { state: 'born-on-page'; provenance: string }
  | { state: 'no-record'; provenance: string };

/** the seed corners a vertex descends from (itself when a seed) — the lineage read off the record, never positions */
export function seedsUnder(shape: Shape, id: VertexId, seen: Set<VertexId> = new Set()): VertexId[] {
  if (seen.has(id)) return [];
  seen.add(id);
  const v = shape.vertices[id];
  if (!v) return [];
  if (v.createdBy.operation === 'seed' || v.createdBy.sourceVertexIds.length === 0) return [id];
  const out: VertexId[] = [];
  for (const p of v.createdBy.sourceVertexIds) for (const s of seedsUnder(shape, p, seen)) if (!out.includes(s)) out.push(s);
  return out;
}

const labelOf = (shape: Shape, id: VertexId): string => shape.vertices[id]?.data.label?.trim() || id;

const sameSet = (a: VertexId[], b: VertexId[]): boolean => a.length === b.length && a.every((v) => b.includes(v));

/** the cells of the record holding a face BY VERTEX SET (each cell holds its own record of a shared face — C-7h's measurement) */
export function cellsHolding(record: Shape, cycle: VertexId[]): Shape['cells'] {
  return record.cells.filter((c) => c.faceIds.some((fid) => { const f = record.faces.find((x) => x.id === fid); return Boolean(f) && sameSet((f as Face).vertexIds, cycle); }));
}

/**
 * The concept layer a written form carries — read from the record the lift carried, or the absence said.
 * `carried` is the form's OWN carried ancestry (the shelf entry's `loaded.ancestors`), never the page's lineage: a form
 * born on the page by an act has a parent on the page, and that parent's record is not the born form's.
 */
export function liftedConceptOf(form: { shape: Shape; opId: string | null; provenance: string }, carried: Shape[], resolveAbsent?: AbsentResolver): LiftedConcept {
  if (form.opId !== null) return { state: 'born-on-page', provenance: form.provenance };
  const ids = Object.keys(form.shape.vertices);
  let record: Shape | null = null;
  let best = 0;
  for (const a of carried) {
    const n = ids.filter((id) => Boolean(a.vertices[id])).length;
    if (n > best) { best = n; record = a; }
  }
  if (!record || best === 0) return { state: 'no-record', provenance: form.provenance };
  const memo = new Map<VertexId, Resolved | null>();
  const vertices: LiftedVertexRow[] = ids.map((id) => {
    const held = Boolean((record as Shape).vertices[id]);
    const r = held ? spaceOf(record as Shape, id, TRANSPORT_OPTIONS, memo) : null; // B6 (D12): the lift rides IS-instances only
    let absence: string | null = null;
    if (held && !r) {
      // through the ONE resolver: a seed resolves to nothing exactly when it holds no cast — this file reads no cast itself
      const bare = seedsUnder(record as Shape, id).filter((s) => spaceOf(record as Shape, s, TRANSPORT_OPTIONS, memo) === null);
      absence = isSeedVertex(record as Shape, id)
        ? 'holds no cast'
        : bare.length
          ? `holds no space — ${bare.map((s) => labelOf(record as Shape, s)).join(' and ')} ${bare.length === 1 ? 'holds' : 'hold'} no cast`
          : 'holds no space';
    }
    return {
      id,
      label: labelOf(form.shape, id),
      held,
      space: r ? r.origin : 'none',
      roles: r ? spaceCounts(r.space).roles : 0, // §149: the one count, the space's — the same helper the card and the surface print
      words: r ? spaceCounts(r.space).words : 0,
      tuples: r ? spaceCounts(r.space).tuples : 0,
      absence: held ? absence : 'not in the record the lift carried',
    };
  });
  const faces: LiftedFaceRow[] = form.shape.faces
    .filter((f) => f.vertexIds.length === 3)
    .map((f) => {
      const cycle = [f.vertexIds[0], f.vertexIds[1], f.vertexIds[2]] as [VertexId, VertexId, VertexId];
      const held = cycle.every((v) => Boolean((record as Shape).vertices[v]));
      const seeds = held && cycle.every((v) => isSeedVertex(record as Shape, v));
      const cells = held ? cellsHolding(record as Shape, cycle) : [];
      return {
        id: f.id,
        cycle,
        name: faceReferenceName(held ? (record as Shape) : form.shape, f, resolveAbsent),
        kind: seeds ? 'seed' : 'born',
        held,
        cornerCell: held && !seeds && cells.length === 1 && cells[0].kind === 'residue' && cycle.some((v) => isSeedVertex(record as Shape, v)),
      };
    });
  return {
    state: 'read',
    record,
    source: record.name,
    vertices,
    faces,
    held: vertices.filter((v) => v.held).length,
    resolved: vertices.filter((v) => v.space !== 'none').length,
  };
}

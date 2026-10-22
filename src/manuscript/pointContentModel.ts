// THE MERGED POINT'S CONTENT — GROUP 4 · slice 3 (2026-10-22; ADR 0031 §9.76 (3), the researcher's 11:27, ratified — claims §512; the designer's 16:48 geometry; Arman's
// Δ243 the tower and Δ244 the lift carrying his records). ONE PRODUCER of what the point's card and drawing read of each MEMBER:
//   · HIS RECORDS as the lift file carried them (Δ244), keyed to the loaded record's ids — the load namespaces a shape's id as `snapshot:<source>:<id>` and a vertex's as
//     `<source>:<id>`, so the rows are re-keyed the same way and then read by the one reader of records (`childRecordsOf`); null where the file carried none — a true
//     absence the card says (`ways: not carried by this lift`), never filled from the live Ambo (the cargo's defect, not repeated here).
//   · EACH MEMBER'S COLUMN — its space as the member itself reads it (a seed's cast; a born corner's child with its WAYS as arcs, his names on them through the records,
//     `columnDisplayOf`), drawn in its own column: nothing of two members is merged by spelling.
//   · THE PAIR LINES — his seam transports at this corner, drawn across the members as the edge draws a pair.
//   · A τ-JOINED KIND — two members' kinds his τ made one word, said once in the word-pair line under the drawing and counted once in the row.
//   · THE LIGHTS ending at a member's moment — each saying on a face of the record that has the member as an END, as the light says it (`z w x`), whether it holds, and
//     whose light; nothing where nothing is said (the designer's 16:48 (3)).
// What a member's moment RESTS ON is the tower's (src/lib/tower.ts). React-free; DOM-free; derived at every read.
import type { ConceptSpace, Shape, VertexId } from '../types/geometry';
import type { LoadedSnapshotForm } from '../playground/snapshot';
import { childRecordsOf } from '../store/geometryStore';
import type { ChildRecords } from '../lib/childLoops';
import { altitudeHeld, endRoleIn, endSlotIn, signOf } from '../lib/altitude';
import { insideOf, type Inside } from '../lib/castInside';
import { columnDisplayOf, columnSpaceOf, termWordsOf } from '../lib/instanceSpace';
import { isSeedVertex, nameIn, spaceOf, type SpaceOfOptions } from '../lib/spaceOf';
import type { DoorTransport } from './apertureModel';
import type { ImageCorner } from './identificationImageModel';

const labelOf = (shape: Shape, v: VertexId): string => shape.vertices[v]?.data.label?.trim() || 'unnamed';

/** Δ244 — HIS RECORDS AS THE LIFT CARRIED THEM, keyed to the loaded record's ids; null where the file carried none */
export function liftRecordsOf(loaded: Pick<LoadedSnapshotForm, 'records' | 'provenance' | 'lexicon' | 'shape' | 'ancestors'> | null | undefined): ChildRecords | null {
  if (!loaded || !loaded.records) return null;
  const source = loaded.provenance.source;
  const shapeOf = (id: string): string => `snapshot:${source}:${id}`;
  const vertexOf = (id: string): string => `${source}:${id}`;
  // a loop's identity, a route's key and a rule's shape embed the CORNERS' ids as the Ambo wrote them (`+vertex:mid:…|kind:[…vertex:tetrahedron:b…]`): every vertex id the
  // loaded record holds (its own and its ancestors', the prefix off) is rewritten inside those strings the way the load rewrote the vertex itself
  const prefix = `${source}:`;
  const originals = new Set<string>();
  for (const sh of [loaded.shape, ...(loaded.ancestors ?? [])]) for (const v of Object.keys(sh.vertices)) originals.add(v.startsWith(prefix) ? v.slice(prefix.length) : v);
  const inKeys = (text: string): string => text.replace(/vertex:[A-Za-z0-9_-]+(?::[A-Za-z0-9_-]+)*/g, (id) => (originals.has(id) ? vertexOf(id) : id));
  const r = loaded.records;
  type Rows = Parameters<typeof childRecordsOf>[0];
  const rows = {
    roleNames: r.roleNames.map(([s, c, role, name]) => [shapeOf(s), vertexOf(c), inKeys(role), name]),
    loopAnswers: r.loopAnswers.map((row) => (row.length === 5 ? [shapeOf(row[0]), vertexOf(row[1]), inKeys(row[2]), row[3], row[4]] : [shapeOf(row[0]), vertexOf(row[1]), inKeys(row[2]), row[3]])),
    loopRules: r.loopRules.map(([shape, modes, answer]) => [inKeys(shape), modes, answer]),
    relationNames: r.relationNames.map(([s, site, loop, name, role]) => [shapeOf(s), vertexOf(site), inKeys(loop), name, inKeys(role)]),
    converses: loaded.lexicon?.converses ?? [],
    opaque: loaded.lexicon?.opaque ?? [],
  } as unknown as Rows; // the file's rows are the store's own rows (Δ244's `wellFormedRecords` carries them in their own shape); a way's direction rides as the string the store wrote
  return childRecordsOf(rows);
}

/** the words of a corner's moment or role, as the page says them: a seed's role by its cast's label, a born corner's moment by its sentence (his name where he gave one) */
export function momentWordsOf(record: Shape, corner: VertexId, id: string, options: SpaceOfOptions = {}): string {
  if (isSeedVertex(record, corner)) { const r = spaceOf(record, corner, options); return r ? nameIn(r.space, id) : id; }
  return termWordsOf(record, corner, id, options);
}

/** a light ending at a member's moment: the saying's words (`z w x`, the light's subject first — one direction per light), whether it holds, and whose light */
export interface LightAtMoment { apex: VertexId; apexLabel: string; faceId: string; words: string; holds: boolean }
export function lightsEndingAt(record: Shape, corner: VertexId, id: string, options: SpaceOfOptions = {}): LightAtMoment[] {
  const out: LightAtMoment[] = [];
  for (const f of record.faces) {
    const endSlot = f.vertexIds.indexOf(corner);
    if (endSlot < 0) continue;
    for (let apexSlot = 0; apexSlot < f.vertexIds.length; apexSlot += 1) {
      if (apexSlot === endSlot) continue;
      const apex = f.vertexIds[apexSlot];
      for (const e of altitudeHeld(f, apexSlot)) {
        if (e[0] !== 'say' || endSlotIn(e) !== endSlot || endRoleIn(e) !== id) continue;
        out.push({ apex, apexLabel: labelOf(record, apex), faceId: f.id, words: `${momentWordsOf(record, apex, e[1], options)} ${e[2]} ${momentWordsOf(record, corner, id, options)}`, holds: signOf(e) === '+' });
      }
    }
  }
  return out;
}

/** one member's column of the point's drawing: its space as the member reads it (its ways as arcs, his names on them), the inside the column draws, whether it is a seed */
export interface MemberColumn { id: VertexId; label: string; seed: boolean; space: ConceptSpace; inside: Inside; waysRead: boolean }
/** a pair line across two members' columns — his seam pair at this corner */
export interface PointPair { a: { member: VertexId; role: string }; b: { member: VertexId; role: string } }
/** a kind his τ made one word across two members — said once under the drawing */
export interface JoinedKind { a: { member: VertexId; memberLabel: string; kind: string; words: string }; b: { member: VertexId; memberLabel: string; kind: string; words: string } }

/**
 * THE POINT'S DRAWING DATA (the designer's 16:48): each member its own column in the record's order — a seed's cast, a born corner's child with its WAYS through his
 * records (none without them, and `waysRead` says so) — the pair lines his seam transports draw across, and the kinds his τ joined, said once.
 */
export function memberColumnsOf(record: Shape, corner: ImageCorner, transports: DoorTransport[], records: ChildRecords | null): { columns: MemberColumn[]; pairs: PointPair[]; joined: JoinedKind[] } {
  const options: SpaceOfOptions = records ? { records } : {};
  const columns: MemberColumn[] = [];
  for (const m of corner.members) {
    if (!record.vertices[m.id]) continue;
    const seed = isSeedVertex(record, m.id);
    const space: ConceptSpace | null = seed ? (spaceOf(record, m.id, options)?.space ?? null) : (columnSpaceOf(record, m.id, options) ?? null);
    if (!space) continue;
    const display = seed ? space : columnDisplayOf(record, m.id, space, options);
    columns.push({ id: m.id, label: m.label, seed, space: display, inside: insideOf(display), waysRead: seed || records !== null });
  }
  const memberIds = new Set(columns.map((c) => c.id));
  const pairs: PointPair[] = [];
  const joined: JoinedKind[] = [];
  const kindWords = (m: VertexId, kind: string): string => { const col = columns.find((c) => c.id === m); const t = col?.space.signature.find((x) => x.type === kind); return t ? t.type : kind; };
  for (const t of transports) {
    const [ca, cb] = t.corners;
    if (!memberIds.has(ca) || !memberIds.has(cb)) continue;
    for (const [x, y] of t.roles) pairs.push({ a: { member: ca, role: x }, b: { member: cb, role: y } });
    for (const [ka, kb] of t.types) joined.push({ a: { member: ca, memberLabel: labelOf(record, ca), kind: ka, words: kindWords(ca, ka) }, b: { member: cb, memberLabel: labelOf(record, cb), kind: kb, words: kindWords(cb, kb) } });
  }
  return { columns, pairs, joined };
}

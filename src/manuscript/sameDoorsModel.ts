// LIFT AGAIN WITH THE SAME DOORS — ADR 0031 §9.61's open question, answered by Arman: "b", both gestures (Δ208; the designer's form of 10-19 16:15; the mothership's
// STAMP THE-RIDERS-AFTER-2.1, rider 2).
//
// A new lift of the same residue carries NOTHING silently (Δ80). Beside the bare `lift again` stands its own gesture, `lift again with the same doors`: the old form's
// doors — the faces he paired, the map he picked, the pairs he took at each door — applied to the new lift and glued, and then SAID: `glued with the same doors:
// a (A·AC·AB with A·AB·AD, preserving) · F13 ≡ F13`. A door whose pair no longer stands on the record is not carried: it is refused by name at that door
// (`not taken — door a: F13 ≡ F13 no longer stands on the seed`) and the rest of the doors are carried.
//
// THE CARRY IS BY THE ADDRESSES THE LIFT KEEPS, AND IT IS SAID BY NAME. A lift carries the seed's own faces and corners with their ids — MEASURED: two lifts of one
// region hold the same face id (`shape:…:face:1wsv0z9` on both forms) — so a door is found again by its face's address and its map by the corners' addresses it
// pairs: identity across the hop by the record the lift keeps, never by a name matched across it (the 08-22 ruling: an id is an address; a name matched across a
// hop is a reading). What is SAID is composed from the corners as they stand on the new form (§2.8: the face is what he glues, named from its corners, never the
// id). A pair he took is ONE ACT — the pair he pointed and the whole line it closed — so the old record is read first to find each line's HEAD among the pairs the
// transport holds, and that head alone is replayed through the door's own act on the new form's record (`actAt` — the lines, the record, the form): taken, the whole
// line stands again; refused, one refusal names it. React-free; nothing stored but what the glue records.
import type { Shape, VertexId } from '../types/geometry';
import { boundaryFacesOf, dihedralMapCandidates, faceReferenceName, type AperturePairRow, type DoorGiven, type DoorTransport } from './apertureModel';
import { actAt, rowInputsOf, sideOf, transportMaps, type DoorSide } from './doorTransportModel';
import { nameIn } from '../lib/spaceOf';

export interface CarriedDoor { letter: string; faces: [string, string]; mode: 'preserving' | 'reversing'; pairs: string[] }
export interface SameDoors { rows: AperturePairRow[]; carried: CarriedDoor[]; refused: string[]; words: string }

/** a shape-level id and its cell-prefixed copy inside one complex are that complex's own construction, not a hop (the 08-22 amendment) */
const strip = (id: string): string => id.replace(/^c\d+:/, '');
const letterOf = (i: number): string => String.fromCharCode(97 + (i % 26));
const labelOf = (shape: Shape, v: string): string => { const raw = shape.vertices[strip(v)]?.data.label; return typeof raw === 'string' && raw.trim() !== '' ? raw.trim() : strip(v); };
const samePairs = (a: Array<[string, string]>, b: Array<[string, string]>): boolean => a.length === b.length && a.every(([x, y]) => b.some(([p, q]) => p === x && q === y));
/** the face's name as it stands on this form — the words, never the key */
const nameOf = (shape: Shape, id: string): string | null => { const f = shape.faces.find((x) => x.id === strip(id)); return f ? faceReferenceName(shape, f) : null; };

/** the old form's doors applied to the new lift: the rows the glue takes, what each door carried, and what was refused by name */
export function carryDoors(oldShape: Shape, oldRows: AperturePairRow[], oldRecord: Shape, newShape: Shape, newRecord: Shape): SameDoors {
  const rows: AperturePairRow[] = [];
  const carried: CarriedDoor[] = [];
  const refused: string[] = [];
  const menu = boundaryFacesOf(newShape);
  // the address the lift keeps: the seed's own face, the same id on every lift of the region
  const sameFace = (oldId: string): string | null => menu.find((m) => strip(m.id) === strip(oldId))?.id ?? null;
  const doors = oldRows.filter((r) => r.faceA !== null && r.faceB !== null && r.candidateKey !== null);
  doors.forEach((row, i) => {
    const letter = letterOf(i);
    const oldNameA = nameOf(oldShape, row.faceA as string); const oldNameB = nameOf(oldShape, row.faceB as string);
    if (oldNameA === null || oldNameB === null) { refused.push(`not taken — door ${letter}: a face of it is not on the old form`); return; }
    const faceA = sameFace(row.faceA as string); const faceB = sameFace(row.faceB as string);
    if (faceA === null || faceB === null) { refused.push(`not taken — door ${letter}: ${faceA === null ? oldNameA : oldNameB} is not a face of the new form`); return; }
    const nameA = nameOf(newShape, faceA) as string; const nameB = nameOf(newShape, faceB) as string;
    const oldCandidate = dihedralMapCandidates(oldShape, row.faceA as string, row.faceB as string).find((c) => c.key === row.candidateKey);
    if (!oldCandidate) { refused.push(`not taken — door ${letter}: its map is not one of the old form's`); return; }
    const wanted: Array<[string, string]> = oldCandidate.correspondence.map(([a, b]) => [strip(a), strip(b)]);
    const candidate = dihedralMapCandidates(newShape, faceA, faceB).find((c) => samePairs(c.correspondence.map(([a, b]) => [strip(a), strip(b)]), wanted));
    if (!candidate) { refused.push(`not taken — door ${letter}: no map ${wanted.map(([a, b]) => `${labelOf(newShape, a)}→${labelOf(newShape, b)}`).join(' · ')} on the new form`); return; }
    // the door's two sides on the OLD record (to find each line's head among the pairs the transport holds) and on the NEW record (to replay the heads)
    const oldCycleA = oldCandidate.correspondence.map(([a]) => strip(a)) as VertexId[]; const oldCycleB = oldCandidate.correspondence.map(([, b]) => strip(b)) as VertexId[];
    const cycleA = candidate.correspondence.map(([a]) => strip(a)) as VertexId[]; const cycleB = candidate.correspondence.map(([, b]) => strip(b)) as VertexId[];
    const OA = sideOf(oldRecord, oldCycleA, new Map(), oldNameA); const OB = sideOf(oldRecord, oldCycleB, new Map(), oldNameB);
    const SA = sideOf(newRecord, cycleA, new Map(), nameA); const SB = sideOf(newRecord, cycleB, new Map(), nameB);
    const pairs: string[] = [];
    let standing: DoorTransport[] = [];
    // §9.69 (1): the old row's inputs — its lines recorded whole ride by their heads as before (and stay recorded whole: the lift never guesses which pair he pointed); the pairs he
    // GAVE ride as given, each at its corner's address on the new form (a lift carries the seed's addresses)
    const inputs = rowInputsOf(row);
    let wholeNew: DoorTransport[] = [];
    const givenNew: DoorGiven[] = [];
    // THE WORDS (the designer's 13:00, on the mothership's 12:57 (3)): a role by his NAME as the door says it (`nameIn` on the side's corner space), `↦` as the
    // door's row writes a pair, each pair AT ITS CORNER; where the door is glued, what fell is refused `not taken at door a: …` (a pair, or `its pairs`); a door
    // refused itself — its face or its map not on the new form — keeps `not taken — door a: …` (above)
    if (OA.state !== 'read' || OB.state !== 'read') {
      refused.push(`not taken at door ${letter}: its pairs — a corner of it holds no record on the old form`);
    } else if (SA.state !== 'read' || SB.state !== 'read') {
      refused.push(`not taken at door ${letter}: its pairs — a corner of it holds no record on the new form`);
    } else {
      const A: DoorSide = SA.side; const B: DoorSide = SB.side;
      let standingOld: DoorTransport[] = [];
      // the pairs in the old transport, corner by corner (the corner's address): a pair already on a line taken here is that line's follower, never a head
      const oldPairs: Array<{ c: number; nc: number; corner: string; x: string; y: string }> = [];
      for (const t of inputs.whole) {
        const corner = strip(t.corners[0]);
        const c = oldCandidate.correspondence.findIndex(([a]) => strip(a) === corner);
        const nc = candidate.correspondence.findIndex(([a]) => strip(a) === corner);
        for (const [x, y] of t.roles) oldPairs.push({ c, nc, corner, x, y });
      }
      for (const { c, nc, corner, x, y } of oldPairs) {
        if (c < 0) { refused.push(`not taken at door ${letter}: ${x} ↦ ${y} at ${labelOf(oldShape, corner)}, a corner the old form's map does not hold`); continue; } // no side space to name in: the address stands
        if (transportMaps(OA.side, OB.side, standingOld)[c].has(x)) continue; // a follower of a line whose head was taken already
        const head = actAt(OA.side, OB.side, standingOld, c, x, y);
        if (!head.taken) continue; // not a line the old record holds — nothing he took stands on it
        standingOld = head.transports;
        const saidOld = `${nameIn(OA.side.spaces[c], x)} ↦ ${nameIn(OB.side.spaces[c], y)} at ${labelOf(oldShape, corner)}`;
        if (nc < 0) { refused.push(`not taken at door ${letter}: ${saidOld}, a corner the new form does not hold`); continue; }
        const said = `${nameIn(A.spaces[nc], x)} ↦ ${nameIn(B.spaces[nc], y)} at ${labelOf(newShape, corner)}`;
        const act = actAt(A, B, standing, nc, x, y);
        if (act.taken) { standing = act.transports; pairs.push(said); }
        else refused.push(`not taken at door ${letter}: ${said} no longer stands on the seed`);
      }
      wholeNew = standing;
      // §9.69 (1): the pairs he GAVE, in his order, each re-pointed at its corner's address on the new form — taken as given there, or refused by name (2b's words)
      for (const g of inputs.given) {
        const corner = strip(g.corner); const [x, y] = g.roles;
        const c = oldCandidate.correspondence.findIndex(([a]) => strip(a) === corner);
        const nc = candidate.correspondence.findIndex(([a]) => strip(a) === corner);
        const saidOld = c < 0 ? `${x} ↦ ${y} at ${labelOf(oldShape, corner)}` : `${nameIn(OA.side.spaces[c], x)} ↦ ${nameIn(OB.side.spaces[c], y)} at ${labelOf(oldShape, corner)}`;
        if (nc < 0) { refused.push(`not taken at door ${letter}: ${saidOld}, a corner the new form does not hold`); continue; }
        const said = `${nameIn(A.spaces[nc], x)} ↦ ${nameIn(B.spaces[nc], y)} at ${labelOf(newShape, corner)}`;
        const act = actAt(A, B, standing, nc, x, y);
        if (act.taken) { standing = act.transports; pairs.push(said); givenNew.push({ corner: A.corners[nc], roles: [x, y] }); }
        else refused.push(`not taken at door ${letter}: ${said} no longer stands on the seed`);
      }
    }
    rows.push({ faceA, faceB, candidateKey: candidate.key, ...(standing.length ? { transports: standing } : {}), ...(givenNew.length ? { whole: wholeNew, given: givenNew } : {}) });
    carried.push({ letter, faces: [nameA, nameB], mode: candidate.derivedMode, pairs });
  });
  // every other row of the old form's panel was the open pair — the person's boundary; the new panel's rows beyond the carried doors stay open the same way
  for (let i = rows.length; i < oldRows.length; i += 1) rows.push({ faceA: null, faceB: null, candidateKey: null });
  const said = carried.map((d) => `${d.letter} (${d.faces[0]} with ${d.faces[1]}, ${d.mode})${d.pairs.length ? ` · ${d.pairs.join(' · ')}` : ''}`).join(' · ');
  const words = `glued with the same doors: ${said || 'none'}${refused.length ? ` · ${refused.join(' · ')}` : ''}`;
  return { rows, carried, refused, words };
}

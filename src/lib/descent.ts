// descent — STAMP MODES-1 · B4 (2026-09-26; the projection ruling D10; ADR 0031 §9.1 D10; Arman's Δ117 Q10–Q11, dissolved:
// inner edges and half-edges are ORDINARY MEDIA; the device has no reader): DESCENT.
//
// CHILDREN ARE CASTS (D4, D10). A born vertex's space, in the modes layer, is the INSTANCE SPACE of the edge between its two
// parents — the instances alone, typed by their modes, the record induced — read recursively through `childSpaceOf`
// (instanceSpace.ts): a seed corner's cast as held, a born corner's child, at every generation, stored nowhere.
// EVERY NEW EDGE IS A MEDIUM (D2), half-edges included: a medial edge between two born vertices, and a corner edge between a
// born vertex and its own parent, take the person's relatings by the same act as at generation 0 (`giveRelating` names the
// child's instance-roles, `x≡y` for IS, `x w y` otherwise); its sorting (B3) reads them as on any edge.
// THE DERIVABLE LINKS ARE LIGHT, NEVER RELATINGS (D10, as D14 corrects it — STAMP MODES-4 · row 3, the second resolution §2):
//   · THE COORDINATE MAP is not a light but the child's STRUCTURE (D14): on the medial edge XY with X = ⟨P, Q⟩ and Y = ⟨P, R⟩ two
//     instances holding one role of P form a PASSAGE through P — the seed corner's view, read by the SORTING from the coordinate map
//     with the generation-1 passage's verdict inherited (`sortingOf`, `source: 'coordinate'`); on a corner edge P–X the parent's role
//     p and every instance of X whose P-coordinate is p — the coordinate map itself, listed here as `coordinate` structure for the
//     corner site (MODES-3), never a light;
//   · THROUGH THE OPPOSITE MIDPOINT — X's instance (p, q) and Y's instance (p′, r) linked by an instance (q, r) of the opposite
//     midpoint Z = ⟨Q, R⟩ (the edge Q–R's own relatings): the passage AB → BC → AC — a LIGHT, shown with its passage named, never
//     an instance of the medium.
// An inner edge with only derivable links reads UNDETECTED with its light shown (the control), and a person's relating at the
// same endpoints is an instance beside the light (`held`), never made by it. THE DEVICE HAS NO READER: it lays the lights, the paths, the tensions and the
// disagreements side by side; facing them is the person's. Nothing here glues — the built resolver's composed classes on a
// medial edge (C-8b's structural meet, measured at ABAC: `Φ1≡F7≡F7≡r0` glued with no person's record) stand as the identity
// regime's built behaviour until B5 shows D10's reading and B6 measures the transport; this module reads beside them.
// React-free; DOM-free; no vertex id in any packet (this module writes nothing). Pinned by scripts/diagnose-modes1-the-descent.cjs.

import type { Edge, Shape, VertexId } from '../types/geometry';
import { edgeBetween } from './faceReading';
import { childSpaceOf, instanceSpaceOf, instancesFrom, instancesWithInherited, type InstanceSpace } from './instanceSpace';
import { ALONG, dirOf, instancesOn, IS, NO_FACTS, type LexiconFacts, type Relating } from './relatings';
import { relatingsFrom, sortingOf, type Rule, type Sorting } from './sorting';
import { edgeKind, type EdgeKind, type SpaceOfOptions } from './spaceOf';

export type LinkKind = 'opposite-midpoint' | 'coordinate';
export interface DerivedLight {
  kind: LinkKind;
  x: string; // the first corner's role (a parent's role on a corner edge; an instance key on a medial edge)
  y: string; // the second corner's role
  through: VertexId; // the shared parent, the opposite midpoint's edge's corners' … — the passage, named by its vertex
  via: string; // WHAT THE LINK GOES THROUGH, as a key: the role both hold (shared-coordinate · coordinate) or the opposite midpoint's instance key — two lights with one pair of ends and different links are two lights (M3 S11 with her §4; MODES-2 (b))
  link: { role: string } | { relating: [string, string, string]; corners: [VertexId, VertexId] }; // the same, for the words: the role of `through` (the coordinate structure on a corner edge) or the linking relating AS HE SAID IT (subject, mode, object) with its corners
  held: boolean; // a person's IS-instance stands at these endpoints on the medium (beside the light, never made by it)
}
export interface Medium {
  edge: [VertexId, VertexId];
  kind: EdgeKind;
  parents: { x: VertexId[]; y: VertexId[] }; // each end's parents (a seed has none)
  shared: VertexId | null; // the parent both ends share (a medial edge), or the parent end of a corner edge
  child: InstanceSpace | null; // the medium's own child (D4) — the person's relatings on it
  sorting: Sorting | null; // B3's sorting of the person's relatings on it (its views are the faces through it)
  lights: DerivedLight[]; // the derivable links, light never relatings
  state: Sorting['state'] | 'NO-SPACE'; // the sorting's state at §8's precedence, or NO-SPACE when a corner has no space
}

const parentsOf = (shape: Shape, v: VertexId): VertexId[] => {
  const x = shape.vertices[v];
  if (!x || x.createdBy.operation === 'seed') return [];
  return [...x.createdBy.sourceVertexIds];
};
/** THE DERIVABLE LINKS on a medium, as lights */
export function derivedLightsOf(shape: Shape, edge: Edge | undefined, options: SpaceOfOptions = {}): DerivedLight[] {
  if (!edge) return [];
  const [X, Y] = edge.vertexIds as [VertexId, VertexId];
  const px = parentsOf(shape, X);
  const py = parentsOf(shape, Y);
  const held = new Set(instancesWithInherited(shape, edge, options).filter((r) => r[0] === IS).map((r) => `${r[1]}|${r[2]}`)); // D15 (b): his pairings and the inherited ≡ alike stand at the endpoints
  const out: DerivedLight[] = [];
  const push = (kind: LinkKind, x: string, y: string, through: VertexId, via: string, link: DerivedLight['link']): void => {
    if (!out.some((l) => l.kind === kind && l.x === x && l.y === y && l.through === through && l.via === via)) out.push({ kind, x, y, through, via, link, held: held.has(`${x}|${y}`) });
  };
  // a corner edge: the parent P and its child X = ⟨P, Q⟩ — the coordinate map is the light
  const cornerLights = (P: VertexId, C: VertexId, parentFirst: boolean): void => {
    const Q = parentsOf(shape, C).find((v) => v !== P);
    if (Q === undefined) return;
    for (const i of instancesFrom(shape, P, Q, options)) {
      if (parentFirst) push('coordinate', i.p, i.key, P, i.p, { role: i.p });
      else push('coordinate', i.key, i.p, P, i.p, { role: i.p });
    }
  };
  if (px.length === 0 && py.length === 2 && py.includes(X)) { cornerLights(X, Y, true); return out; }
  if (py.length === 0 && px.length === 2 && px.includes(Y)) { cornerLights(Y, X, false); return out; }
  if (px.length !== 2 || py.length !== 2) return out;
  const shared = px.find((v) => py.includes(v));
  if (shared === undefined) return out;
  const Q = px.find((v) => v !== shared) as VertexId;
  const R = py.find((v) => v !== shared) as VertexId;
  const xs = instancesFrom(shape, shared, Q, options); // (w, p, q)
  const ys = instancesFrom(shape, shared, R, options); // (w′, p′, r)
  // (the shared-coordinate pairs are the seed corner's VIEW, read by the sorting from the coordinate map — D14; no light here)
  // through the opposite midpoint ⟨Q, R⟩ — an instance (q, r) on Q–R links (p, q) and (p′, r); the link is that relating, AS HE
  // SAID IT — `relatingsFrom` walks Q → R mirroring x ↔ y AND the direction where the stored order runs the other way (D13), so the
  // subject is read off the direction bit, never off the stored order; the key is the sentence he said (the instance's own key)
  const eQR = edgeBetween(shape.edges, Q, R);
  if (eQR) {
    const opposite = Object.values(shape.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(Q) && v.createdBy.sourceVertexIds.includes(R));
    const qr = relatingsFrom(shape, Q, R, options).filter((r: Relating) => r[3] === '+');
    for (const i of xs) for (const j of ys) for (const k of qr) if (k[1] === i.q && k[2] === j.q) {
      const along = dirOf(k) === ALONG;
      push('opposite-midpoint', i.key, j.key, opposite ? opposite.id : Q, k[0] === IS ? `${k[1]}≡${k[2]}` : along ? `${k[1]} ${k[0]} ${k[2]}` : `${k[2]} ${k[0]} ${k[1]}`, along ? { relating: [k[1], k[0], k[2]], corners: [Q, R] } : { relating: [k[2], k[0], k[1]], corners: [R, Q] });
    }
  }
  return out;
}

/** THE MEDIUM: the edge's own child and sorting (the person's relatings on it) beside its derivable lights — laid side by side, never merged */
export function mediumOf(shape: Shape, edge: Edge | undefined, options: SpaceOfOptions = {}, rules: readonly Rule[] = [], facts: LexiconFacts = NO_FACTS): Medium | null {
  if (!edge) return null;
  const [X, Y] = edge.vertexIds as [VertexId, VertexId];
  const px = parentsOf(shape, X);
  const py = parentsOf(shape, Y);
  const shared = px.length === 2 && py.length === 2 ? (px.find((v) => py.includes(v)) ?? null) : px.length === 0 && py.includes(X) ? X : py.length === 0 && px.includes(Y) ? Y : null;
  const child = instanceSpaceOf(shape, edge, options);
  const sorting = sortingOf(shape, edge, options, rules, facts);
  const lights = derivedLightsOf(shape, edge, options);
  const spaceX = childSpaceOf(shape, X, options);
  const spaceY = childSpaceOf(shape, Y, options);
  return {
    edge: [X, Y],
    kind: edgeKind(shape, X, Y),
    parents: { x: px, y: py },
    shared,
    child,
    sorting,
    lights,
    state: !spaceX || !spaceY ? 'NO-SPACE' : sorting ? sorting.state : 'UNDETECTED',
  };
}

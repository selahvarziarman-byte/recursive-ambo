// descent — STAMP MODES-1 · B4 (2026-09-26; the projection ruling D10; ADR 0031 §9.1 D10; Arman's Δ117 Q10–Q11, dissolved:
// inner edges and half-edges are ORDINARY MEDIA; the device has no reader): DESCENT.
//
// CHILDREN ARE CASTS (D4, D10). A born vertex's space, in the modes layer, is the INSTANCE SPACE of the edge between its two
// parents — the instances alone, typed by their modes, the record induced — read recursively through `childSpaceOf`
// (instanceSpace.ts): a seed corner's cast as held, a born corner's child, at every generation, stored nowhere.
// EVERY NEW EDGE IS A MEDIUM (D2), half-edges included: a medial edge between two born vertices, and a corner edge between a
// born vertex and its own parent, take the person's relatings by the same act as at generation 0 (`giveRelating` names the
// child's instance-roles, `x≡y` for IS, `x w y` otherwise); its sorting (B3) reads them as on any edge.
// THE DERIVABLE LINKS ARE LIGHT, NEVER RELATINGS (D10). On a medium the device can derive two kinds of link and derives them:
//   · SHARED COORDINATE — two instances sharing a coordinate: on the medial edge XY with X = ⟨P, Q⟩ and Y = ⟨P, R⟩, X's instance
//     (p, q) and Y's instance (p′, r) with p = p′ — the passage through the shared parent P; on a corner edge P–X, the parent's
//     role p and every instance of X whose P-coordinate is p — the coordinate map itself;
//   · THROUGH THE OPPOSITE MIDPOINT — X's instance (p, q) and Y's instance (p′, r) linked by an instance (q, r) of the opposite
//     midpoint Z = ⟨Q, R⟩ (the edge Q–R's own relatings): the passage AB → BC → AC.
// Each is shown as a LIGHT with its passage named, and is never an instance of the medium: an inner edge with only derivable
// links reads UNDETECTED with its lights shown (the control), and a person's relating at the same endpoints is an instance
// beside the light (`held`), never made by it. THE DEVICE HAS NO READER: it lays the lights, the paths, the tensions and the
// disagreements side by side; facing them is the person's. Nothing here glues — the built resolver's composed classes on a
// medial edge (C-8b's structural meet, measured at ABAC: `Φ1≡F7≡F7≡r0` glued with no person's record) stand as the identity
// regime's built behaviour until B5 shows D10's reading and B6 measures the transport; this module reads beside them.
// React-free; DOM-free; no vertex id in any packet (this module writes nothing). Pinned by scripts/diagnose-modes1-the-descent.cjs.

import type { Edge, Shape, VertexId } from '../types/geometry';
import { edgeBetween } from './faceReading';
import { childSpaceOf, instanceSpaceOf, type Instance, type InstanceSpace } from './instanceSpace';
import { ALONG, dirOf, instancesOn, IS, NO_FACTS, type LexiconFacts, type Relating } from './relatings';
import { relatingsFrom, sortingOf, type ReadPath, type Rule, type Sorting } from './sorting';
import { edgeKind, type EdgeKind, type SpaceOfOptions } from './spaceOf';

export type LinkKind = 'shared-coordinate' | 'opposite-midpoint' | 'coordinate';
export interface DerivedLight {
  kind: LinkKind;
  x: string; // the first corner's role (a parent's role on a corner edge; an instance key on a medial edge)
  y: string; // the second corner's role
  through: VertexId; // the shared parent, the opposite midpoint's edge's corners' … — the passage, named by its vertex
  via: string; // WHAT THE LINK GOES THROUGH, as a key: the role both hold (shared-coordinate · coordinate) or the opposite midpoint's instance key — two lights with one pair of ends and different links are two lights (M3 S11 with her §4; MODES-2 (b))
  link: { role: string; restates?: { edge: [VertexId, VertexId]; q: string; r: string } } | { relating: [string, string, string]; corners: [VertexId, VertexId] }; // the same, for the words: the role of `through` — on a medial edge with the generation-1 passage it RESTATES (q of Q, r of R, through P: the second resolution D14) — or the linking relating AS HE SAID IT (subject, mode, object) with its corners
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
/** the instances of the born vertex ⟨P, Q⟩ oriented from P to Q — (w, p, q) — as the child of the edge P–Q holds them */
function instancesFrom(shape: Shape, P: VertexId, Q: VertexId, options: SpaceOfOptions): Array<{ key: string; p: string; q: string; mode: string }> {
  const e = edgeBetween(shape.edges, P, Q);
  if (!e) return [];
  const child = instanceSpaceOf(shape, e, options);
  if (!child) return [];
  const flipped = e.vertexIds[0] !== P;
  return child.instances.map((i: Instance) => ({ key: i.key, p: flipped ? i.y : i.x, q: flipped ? i.x : i.y, mode: i.mode }));
}

/** THE DERIVABLE LINKS on a medium, as lights */
export function derivedLightsOf(shape: Shape, edge: Edge | undefined, options: SpaceOfOptions = {}): DerivedLight[] {
  if (!edge) return [];
  const [X, Y] = edge.vertexIds as [VertexId, VertexId];
  const px = parentsOf(shape, X);
  const py = parentsOf(shape, Y);
  const held = new Set(instancesOn(edge, options).filter((r) => r[0] === IS).map((r) => `${r[1]}|${r[2]}`));
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
  // shared coordinate — the passage through the shared parent: the link is the role both hold, and what it RESTATES is the
  // generation-1 passage from q (of Q) to r (of R) through P (the second resolution D14: read at the child's resolution, its
  // verdict inherited — never a light of its own, never an entry of the medium; the printing reads `inheritedReadingOf`)
  for (const i of xs) for (const j of ys) if (i.p === j.p) push('shared-coordinate', i.key, j.key, shared, i.p, { role: i.p, restates: { edge: [Q, R], q: i.q, r: j.q } });
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

/**
 * THE INHERITED READING of a shared-coordinate link (the second resolution D14, chartered for M3 by amendment): the passage from
 * q to r through P at generation n−1, read from the PARENT edge Q–R's own sorting — composed there (the person paired q ≡ r: an
 * inherited IS-instance, the face's), a light there (P's light — where the pairing would live), a tension there (his pair at q or
 * r presses), NOT if he said so there, UNRULED if unruled there. The person answers a passage once, at the generation it belongs
 * to. Null for a link that restates nothing (the opposite-midpoint kind, a corner edge's coordinate structure) or where the passage
 * is not found. A reader of the parent's sorting, never of this medium's: the lights and the medium's sorting stay side by side.
 */
export function inheritedReadingOf(shape: Shape, light: DerivedLight, options: SpaceOfOptions = {}, rules: readonly Rule[] = [], facts: LexiconFacts = NO_FACTS): { path: ReadPath; edge: [VertexId, VertexId] } | null {
  if (!('role' in light.link) || !light.link.restates) return null;
  const { edge: [Q, R], q, r } = light.link.restates;
  const e = edgeBetween(shape.edges, Q, R);
  if (!e) return null;
  const parent = sortingOf(shape, e, options, rules, facts);
  const view = parent ? parent.views.find((v) => v.view === light.through) : undefined;
  if (!view) return null;
  const qFirst = e.vertexIds[0] === Q;
  const [x, y] = qFirst ? [q, r] : [r, q];
  const path = view.paths.find((p) => p.path.x === x && p.path.y === y && p.path.w === IS && p.path.w2 === IS);
  return path ? { path, edge: [e.vertexIds[0] as VertexId, e.vertexIds[1] as VertexId] } : null;
}

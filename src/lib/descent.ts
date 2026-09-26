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
import { instancesOn, IS, type Relating } from './relatings';
import { relatingsFrom, sortingOf, type Rule, type Sorting } from './sorting';
import { edgeKind, type EdgeKind, type SpaceOfOptions } from './spaceOf';

export type LinkKind = 'shared-coordinate' | 'opposite-midpoint' | 'coordinate';
export interface DerivedLight {
  kind: LinkKind;
  x: string; // the first corner's role (a parent's role on a corner edge; an instance key on a medial edge)
  y: string; // the second corner's role
  through: VertexId; // the shared parent, the opposite midpoint's edge's corners' … — the passage, named by its vertex
  via: string | null; // the opposite midpoint's instance key that links them (opposite-midpoint), else null
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
  state: 'UNDETECTED' | 'EXHAUSTED' | 'POCKET' | 'OPEN' | 'NO-SPACE';
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
  const push = (kind: LinkKind, x: string, y: string, through: VertexId, via: string | null): void => {
    if (!out.some((l) => l.kind === kind && l.x === x && l.y === y && l.through === through && l.via === via)) out.push({ kind, x, y, through, via, held: held.has(`${x}|${y}`) });
  };
  // a corner edge: the parent P and its child X = ⟨P, Q⟩ — the coordinate map is the light
  const cornerLights = (P: VertexId, C: VertexId, parentFirst: boolean): void => {
    const Q = parentsOf(shape, C).find((v) => v !== P);
    if (Q === undefined) return;
    for (const i of instancesFrom(shape, P, Q, options)) {
      if (parentFirst) push('coordinate', i.p, i.key, P, null);
      else push('coordinate', i.key, i.p, P, null);
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
  // shared coordinate — the passage through the shared parent
  for (const i of xs) for (const j of ys) if (i.p === j.p) push('shared-coordinate', i.key, j.key, shared, null);
  // through the opposite midpoint ⟨Q, R⟩ — an instance (q, r) on Q–R links (p, q) and (p′, r)
  const eQR = edgeBetween(shape.edges, Q, R);
  if (eQR) {
    const opposite = Object.values(shape.vertices).find((v) => v.createdBy.operation !== 'seed' && v.createdBy.sourceVertexIds.length === 2 && v.createdBy.sourceVertexIds.includes(Q) && v.createdBy.sourceVertexIds.includes(R));
    const qr = relatingsFrom(shape, Q, R, options).filter((r: Relating) => r[3] === '+');
    for (const i of xs) for (const j of ys) for (const k of qr) if (k[1] === i.q && k[2] === j.q) push('opposite-midpoint', i.key, j.key, opposite ? opposite.id : Q, k[0] === IS ? `${k[1]}≡${k[2]}` : `${k[1]} ${k[0]} ${k[2]}`);
  }
  return out;
}

/** THE MEDIUM: the edge's own child and sorting (the person's relatings on it) beside its derivable lights — laid side by side, never merged */
export function mediumOf(shape: Shape, edge: Edge | undefined, options: SpaceOfOptions = {}, rules: readonly Rule[] = []): Medium | null {
  if (!edge) return null;
  const [X, Y] = edge.vertexIds as [VertexId, VertexId];
  const px = parentsOf(shape, X);
  const py = parentsOf(shape, Y);
  const shared = px.length === 2 && py.length === 2 ? (px.find((v) => py.includes(v)) ?? null) : px.length === 0 && py.includes(X) ? X : py.length === 0 && px.includes(Y) ? Y : null;
  const child = instanceSpaceOf(shape, edge, options);
  const sorting = sortingOf(shape, edge, options, rules);
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

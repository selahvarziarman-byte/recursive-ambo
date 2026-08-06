// ringAnchorResolver — THE TOTAL RING ANCHOR RESOLVER
// (SEAL_THE_RING_ANCHOR_RESOLVER): every WrittenRender mode RENDERS its ring
// anchors or DECLARES a refusal — never a silent bare (the M3 host's
// `else → null` dropped classBody/immersion/bodiless silently; Arman's torus
// and cylinder were bare). The readDeficitForRender pattern: a compile-time
// `: never` floor makes a NEW render mode unrepresentable until it chooses
// render-or-refuse.
//
//   · plain / skeleton — the form's own shape (direct anchors).
//   · faithful — the repositioned fan (id-preserved — the M3 cure, KEPT).
//   · immersion — the born form's cells anchor ON the immersion surface:
//     each concept/relation row's SOURCE corners (the host square's v0..v3)
//     resolve to fundamental-square (u,v) corners, then through the EXPORTED
//     `immersionPosition` to R³. THE CORNER ASSIGNMENT IS NOT ASSUMED: the
//     square's 8 dihedral corner→(u,v) images are tried and the one under
//     which every merged class is GLUING-CONSISTENT (all members land on ONE
//     R³ point — the immersion module's own exported invariant) is taken;
//     where it matters (cylinder / möbius / klein) consistency FORCES the
//     assignment, where it does not (torus — all corners one point) any
//     image agrees. MEASURED (probe 2026-08-06): glue-cylinder merges
//     {v0,v3}/{v1,v2}, which the naive cycle image fails and a dihedral
//     image satisfies — the search is load-bearing, not defensive.
//     A PER-CELL floor rides inside: a cell that cannot place (no corner
//     index · members disagree beyond ε) DECLARES itself in `unplaced` —
//     never a silent drop.
//   · classBody — REFUSE, declared: the drawn body is a chosen
//     REPRESENTATIVE (CLASS_BODY_FRAME) — anchoring the form's cells on it
//     would MINT positions. (The laid sub-route, whose cells ARE laid, is a
//     reported follow-up — not silently claimed here.)
//   · bodiless — REFUSE, declared with the committed reason.
//
// READS ONLY: the frozen immersion models are consumed through their exposed
// surfaces (`InkedFormModel.immersion`, exported `immersionPosition`) — no
// frozen file is edited.

import type { Shape, Vec3 } from '../types/geometry';
import type { WrittenForm } from '../manuscript/writtenFormModel';
import type { ArgumentReading } from '../manuscript/argumentReadingModel';
import { repositionShapeToFan } from '../manuscript/deficitRegisterModel';
import { immersionPosition, type ImmersedSurfaceKey } from '../lib/surfaceImmersion';
import type { InkedFormModel } from '../manuscript/inkedFormModel';
import { CLASS_BODY_FRAME } from '../manuscript/classBodyModel';

export type RingMount = 'dim1' | 'faithful' | 'dim2';

export interface RingUnplaced {
  id: string;
  reason: string;
}

export type RingAnchorResolution =
  | {
      kind: 'anchored';
      anchors: Map<string, Vec3>; // row resultId → the drawn place (mount-local)
      segments: Map<string, [Vec3, Vec3]>; // relation id → its endpoint pair (the world-side emphasis line)
      figurePoints: Vec3[]; // the drawn body's own points — the L1 silhouette bound
      mount: RingMount;
      unplaced: RingUnplaced[]; // per-cell declarations — never a silent drop
    }
  | { kind: 'refused'; refusal: string };

const mid3 = (a: Vec3, b: Vec3): Vec3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];

// ---------------------------------------------------------------------------
// the shape-borne modes (plain · skeleton · faithful): anchors off the host
// shape — the M2/M3 ring's own resolution, centralized here
// ---------------------------------------------------------------------------

function shapeAnchors(
  shape: Shape,
  reading: ArgumentReading,
  mount: RingMount,
): RingAnchorResolution {
  const anchors = new Map<string, Vec3>();
  const segments = new Map<string, [Vec3, Vec3]>();
  const unplaced: RingUnplaced[] = [];
  for (const row of reading.conceptRows) {
    const vertex = shape.vertices[row.resultId];
    if (vertex) anchors.set(row.resultId, vertex.position);
    else unplaced.push({ id: row.resultId, reason: 'no live vertex carries this concept' });
  }
  for (const row of reading.relationRows) {
    const edge = shape.edges.find((e) => e.id === row.resultId);
    const a = edge ? shape.vertices[edge.vertexIds[0]]?.position : undefined;
    const b = edge ? shape.vertices[edge.vertexIds[1]]?.position : undefined;
    if (a && b) {
      anchors.set(row.resultId, mid3(a, b));
      segments.set(row.resultId, [a, b]);
    } else unplaced.push({ id: row.resultId, reason: 'no live edge carries this relation' });
  }
  for (const row of reading.composedRelationRows) {
    // the drawn place: the path's own shared endpoint (points, never mints)
    const parts = row.pathIds
      .map((p) => shape.edges.find((e) => e.id === p))
      .filter((e): e is NonNullable<typeof e> => Boolean(e));
    if (parts.length === 0) {
      unplaced.push({ id: row.id, reason: 'no live edge carries the composed path' });
      continue;
    }
    const counts = new Map<string, number>();
    for (const e of parts) for (const vid of e.vertexIds) counts.set(vid, (counts.get(vid) ?? 0) + 1);
    const sharedId = [...counts.entries()].find(([, n]) => n >= 2)?.[0] ?? parts[0].vertexIds[0];
    const place = shape.vertices[sharedId]?.position;
    if (place) anchors.set(row.id, place);
    else unplaced.push({ id: row.id, reason: 'the composed path has no shared drawn vertex' });
  }
  return {
    kind: 'anchored',
    anchors,
    segments,
    figurePoints: Object.values(shape.vertices).map((v) => v.position),
    mount,
    unplaced,
  };
}

// ---------------------------------------------------------------------------
// the immersion mode: source corners → fundamental-square (u,v) → R³
// ---------------------------------------------------------------------------

// how far identified members' immersion positions may drift before the
// assignment is called inconsistent (mirrors the immersion module's own
// GLUING_EPSILON discipline; module-local there, so restated here)
const CONSISTENCY_EPSILON = 1e-6;

// the fundamental square's corner cycle and its 8 dihedral images (4
// rotations × optional reflection) — the assignment candidates
const CORNER_CYCLE: [number, number][] = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];
const DIHEDRAL_IMAGES: [number, number][][] = (() => {
  const images: [number, number][][] = [];
  for (let r = 0; r < 4; r += 1) {
    for (const flip of [false, true]) {
      const cycle = flip ? [...CORNER_CYCLE].reverse() : CORNER_CYCLE;
      images.push([0, 1, 2, 3].map((k) => cycle[(k + r) % 4]));
    }
  }
  return images;
})();

const cornerIndexOf = (sourceId: string): number | null => {
  const tail = sourceId.split(':').pop() ?? '';
  const m = /^v(\d+)$/.exec(tail);
  if (!m) return null;
  const k = Number(m[1]);
  return k >= 0 && k <= 3 ? k : null;
};

const dist3 = (a: Vec3, b: Vec3): number =>
  Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

function immersionAnchors(model: InkedFormModel, reading: ArgumentReading): RingAnchorResolution {
  const surface: ImmersedSurfaceKey = model.immersion.correspondence.surface;
  // each concept row's SOURCE corner set (self when it survived unmerged)
  const conceptCorners = reading.conceptRows.map((row) => ({
    row,
    corners: (row.sourceIds.length > 0 ? row.sourceIds : [row.resultId]).map(cornerIndexOf),
  }));
  // pick the dihedral corner assignment under which every resolvable
  // multi-member class is gluing-consistent (first with the maximum count)
  let best: { assignment: [number, number][]; consistent: number } | null = null;
  for (const assignment of DIHEDRAL_IMAGES) {
    let consistent = 0;
    for (const { corners } of conceptCorners) {
      const uvs = corners.filter((k): k is number => k !== null).map((k) => assignment[k]);
      if (uvs.length < 2) continue;
      const pts = uvs.map(([u, v]) => immersionPosition(surface, u, v));
      const closes = pts.every((p) => dist3(p, pts[0]) < CONSISTENCY_EPSILON);
      if (closes) consistent += 1;
    }
    if (!best || consistent > best.consistent) best = { assignment, consistent };
  }
  const assignment = best?.assignment ?? DIHEDRAL_IMAGES[0];
  const anchors = new Map<string, Vec3>();
  const segments = new Map<string, [Vec3, Vec3]>();
  const unplaced: RingUnplaced[] = [];
  const uvOf = (sourceId: string): [number, number] | null => {
    const k = cornerIndexOf(sourceId);
    return k === null ? null : assignment[k];
  };
  for (const { row, corners } of conceptCorners) {
    const sources = row.sourceIds.length > 0 ? row.sourceIds : [row.resultId];
    if (corners.some((k) => k === null)) {
      unplaced.push({ id: row.resultId, reason: 'a source is not a fundamental-square corner' });
      continue;
    }
    const pts = (corners as number[]).map((k) => assignment[k]).map(([u, v]) => immersionPosition(surface, u, v));
    if (!pts.every((p) => dist3(p, pts[0]) < CONSISTENCY_EPSILON)) {
      unplaced.push({
        id: row.resultId,
        reason: `the corner assignment does not close for {${sources.join(', ')}} — members disagree beyond ε`,
      });
      continue;
    }
    anchors.set(row.resultId, pts[0]);
  }
  for (const row of reading.relationRows) {
    // the relation's recorded source endpoints (two host corners) → the
    // fundamental-square midpoint → ON the surface (the curved edge's own
    // midpoint image, never a chord through the body)
    if (row.sourceIds.length !== 2) {
      unplaced.push({ id: row.resultId, reason: 'the relation does not record two source corners' });
      continue;
    }
    const uvA = uvOf(row.sourceIds[0]);
    const uvB = uvOf(row.sourceIds[1]);
    if (!uvA || !uvB) {
      unplaced.push({ id: row.resultId, reason: 'a relation endpoint is not a fundamental-square corner' });
      continue;
    }
    anchors.set(row.resultId, immersionPosition(surface, (uvA[0] + uvB[0]) / 2, (uvA[1] + uvB[1]) / 2));
    segments.set(row.resultId, [
      immersionPosition(surface, uvA[0], uvA[1]),
      immersionPosition(surface, uvB[0], uvB[1]),
    ]);
  }
  for (const row of reading.composedRelationRows) {
    // composed rows point at a shared LIVE vertex — anchor at its class point
    unplaced.push({ id: row.id, reason: 'composed paths are not laid on the immersion (no live path geometry)' });
  }
  return {
    kind: 'anchored',
    anchors,
    segments,
    // the immersion's OWN grid shape carries real surface points — the
    // honest silhouette bound (the class points alone under-bound the body)
    figurePoints: Object.values(model.immersion.shape.vertices).map((v) => v.position),
    mount: 'dim2',
    unplaced,
  };
}

// ---------------------------------------------------------------------------
// THE TOTAL RESOLVER — the `: never` floor forbids a silent bare
// ---------------------------------------------------------------------------

function unhandledRingMode(render: never): never {
  throw new Error(
    `ringAnchorResolver: unhandled render mode "${(render as { mode?: string }).mode}" — every mode must RENDER anchors or DECLARE a refusal (a silent bare is the mode-dispatch scar)`,
  );
}

export function resolveRingAnchors(form: WrittenForm, reading: ArgumentReading): RingAnchorResolution {
  const render = form.render;
  if (render.mode === 'plain') return shapeAnchors(form.shape, reading, 'dim1');
  if (render.mode === 'skeleton') return shapeAnchors(form.shape, reading, 'dim1');
  if (render.mode === 'faithful') {
    const fan = repositionShapeToFan(render.model);
    return fan
      ? shapeAnchors(fan, reading, 'faithful')
      : {
          kind: 'refused',
          refusal:
            'the key cannot anchor — a vertex class has no fan placement (the faithful body refused the mark the same way)',
        };
  }
  if (render.mode === 'immersion') return immersionAnchors(render.model, reading);
  if (render.mode === 'classBody') {
    return { kind: 'refused', refusal: `the key cannot anchor on this body — ${CLASS_BODY_FRAME}` };
  }
  if (render.mode === 'bodiless') {
    return { kind: 'refused', refusal: `the key cannot anchor — no faithful body (${render.reason})` };
  }
  return unhandledRingMode(render);
}

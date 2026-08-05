// faithfulInkedModel — THE FAITHFUL BODY UNIFICATION (the craft stack, third
// instance; seal SEAL_FAITHFUL_BODY_UNIFICATION, cut ebd05da): the thin
// adapter that hands the fold-born CONE to the ONE crafted renderer
// (InkedForm), killing the third un-unified renderer (the FaithfulBody wash —
// one unlit translucent fill, no silhouette, no hatching, no two-pass).
//
// THE MIRROR: `laidInkedModel.ts` verbatim in structure. THE MEASURED SEAM
// (the engineer's, on the frozen bytes): InkedForm renders from
// `model.immersion.shape` + `model.loops` and never reads `correspondence`
// or the surface key. So this adapter mints:
//   · immersion.shape — the apex + a rim RING densified from the frozen
//     FaithfulBodyModel's own `rimArcs` points; faces = the triangle FAN
//     (apex, rim[i], rim[i+1]) — the cone's LATERAL surface, so the hull
//     silhouette + key-light hatching + two-pass land ON THE CONE; edges =
//     the `seams` (the thin cell register) + the `rimArcs` as boundary
//     chains (LAW B's rim — the heavy weight itself stays on the overlay's
//     own rim Lines; here the boundary rides the construction register);
//   · the apex sits at `lift.apexHeight` — THE CONE IS PRESERVED, never
//     flattened (the apex-lift is not undone by the unification);
//   · loops — [] (the disk, χ=1 open orientable: no basis);
//   · correspondence — the typed stub (unused by the frozen renderer,
//     measured); `surface` — the field is DEAD on the renderer (measured);
//     the honest word is `disk`, confined-cast past the closed zoo union
//     and never read by anything (disclosed);
//   · invariants / h1Label — the faithful model's own, verbatim.
//
// ZERO FROZEN EDIT: InkedForm.tsx / inkedFormModel.ts / faithfulBodyModel.ts
// are imported (types) and consumed — never touched. The hard rail holds by
// construction.

import type { Edge, Face, Shape, Vec3, Vertex } from '../types/geometry';
import { createDefaultVertexData } from '../lib/shape';
import type { ImmersedSurfaceKey, QuotientCorrespondence } from '../lib/surfaceImmersion';
import type { GeneratorLoop, InkedFormModel } from './inkedFormModel';
import type { FaithfulBodyModel } from './faithfulBodyModel';

const near = (a: Vec3, b: Vec3): boolean =>
  Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9 && Math.abs(a[2] - b[2]) < 1e-9;

export function buildFaithfulInkedModel(faithful: FaithfulBodyModel): InkedFormModel {
  const shapeId = `shape:faithfulink:${faithful.shape.id}`;
  const vertices: Record<string, Vertex> = {};
  const addVertex = (id: string, position: Vec3): void => {
    vertices[id] = {
      id,
      position,
      data: createDefaultVertexData(id),
      createdBy: { shapeId, operation: 'seed', sourceVertexIds: [] },
    };
  };

  // the apex — at the LIFTED height (the frozen model's own placement)
  const apexId = 'faithfulink:apex';
  addVertex(apexId, faithful.apex.position);

  // the rim RING, densified from the frozen model's own rimArcs (the chain
  // closes: consecutive arcs share endpoints; the final point rejoins the
  // first)
  const ring: string[] = [];
  const ringChains: string[][] = [];
  faithful.rimArcs.forEach((arc, ai) => {
    const chain: string[] = [];
    arc.points.forEach((p, pi) => {
      if (ring.length > 0) {
        const prevId = ring[ring.length - 1];
        if (near(vertices[prevId].position, p)) {
          chain.push(prevId);
          return; // the shared arc endpoint — reuse, don't duplicate
        }
        if (ring.length > 1 && near(vertices[ring[0]].position, p)) {
          chain.push(ring[0]);
          return; // the closing point — rejoin the ring's start
        }
      }
      const id = `faithfulink:rim:${ai}:${pi}`;
      addVertex(id, p);
      ring.push(id);
      chain.push(id);
    });
    ringChains.push(chain);
  });

  // PHASE B — THE FLAT-BODY GUARD (SEAL_PHASE_B_MANIFOLD, the mothership's
  // ADAPTER-HELD verdict): a FLAT faithful subject (the δ=0 degenerate — the
  // apex lying ON the rim plane) would hand InkedForm a constant-normal body
  // whose hull displacement DEGENERATES (no silhouette — the pinch). The
  // DRAWN apex gets a minimal depicted lift along the rim plane's normal — a
  // shallow tent: depiction only, never the model's numbers (the model's
  // invariants/stance ride untouched; the designer gates the exact look).
  // InkedForm stays byte-untouched.
  if (ring.length >= 3) {
    const pts = ring.map((id) => vertices[id].position);
    let nx = 0;
    let ny = 0;
    let nz = 0;
    for (let i = 0; i < pts.length; i += 1) {
      const p = pts[i];
      const q = pts[(i + 1) % pts.length];
      nx += (p[1] - q[1]) * (p[2] + q[2]);
      ny += (p[2] - q[2]) * (p[0] + q[0]);
      nz += (p[0] - q[0]) * (p[1] + q[1]);
    }
    const nLen = Math.hypot(nx, ny, nz);
    if (nLen > 1e-12) {
      const n: Vec3 = [nx / nLen, ny / nLen, nz / nLen];
      const c: Vec3 = [
        pts.reduce((s, p) => s + p[0], 0) / pts.length,
        pts.reduce((s, p) => s + p[1], 0) / pts.length,
        pts.reduce((s, p) => s + p[2], 0) / pts.length,
      ];
      const radius = Math.max(...pts.map((p) => Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2])), 1e-9);
      const apex = vertices[apexId].position;
      const off = (apex[0] - c[0]) * n[0] + (apex[1] - c[1]) * n[1] + (apex[2] - c[2]) * n[2];
      if (Math.abs(off) < 1e-6 * radius) {
        const lift = 0.06 * radius;
        vertices[apexId] = {
          ...vertices[apexId],
          position: [apex[0] + n[0] * lift, apex[1] + n[1] * lift, apex[2] + n[2] * lift],
        };
      }
    }
  }

  // faces — the triangle FAN over the ring: the cone's lateral surface
  const faces: Face[] = ring.map((rimId, k) => ({
    id: `face:faithfulink:${k}`,
    vertexIds: [apexId, rimId, ring[(k + 1) % ring.length]],
    role: 'seed-face',
  }));

  // edges — the seams (apex ↔ the rim vertex at the seam's own endpoint) +
  // the rim chains (the boundary, LAW B)
  const edges: Edge[] = [];
  const ringIdAt = (p: Vec3): string | null => ring.find((id) => near(vertices[id].position, p)) ?? null;
  faithful.seams.forEach((seam, si) => {
    const rimEnd = ringIdAt(seam.to) ?? ringIdAt(seam.from);
    if (!rimEnd) return; // a seam without a ring landing cannot be drawn — nothing invented
    edges.push({
      id: `edge:faithfulink:seam:${si}`,
      vertexIds: [apexId, rimEnd],
      sourceVertexIds: [apexId, rimEnd],
    });
  });
  ringChains.forEach((chain, ci) => {
    for (let k = 0; k + 1 < chain.length; k += 1) {
      edges.push({
        id: `edge:faithfulink:rim:${ci}:${k}`,
        vertexIds: [chain[k], chain[k + 1]],
        sourceVertexIds: [chain[k], chain[k + 1]],
      });
    }
  });

  const shape: Shape = {
    id: shapeId,
    name: 'disk',
    vertices,
    edges,
    faces,
    cells: [],
    generations: [],
    genealogy: {
      parentShapeId: null,
      operation: 'seed', // a render substrate — no lineage claim (the faithful model carries the truth)
      generationDepth: 0,
      sourceVertexIds: [],
      createdVertexIds: Object.keys(vertices),
      createdAt: '',
    },
  };
  const loops: GeneratorLoop[] = []; // the disk — χ=1 open orientable, no basis
  // typed, empty, and — measured on the frozen bytes — never read
  const surface = 'disk' as unknown as ImmersedSurfaceKey;
  const correspondence: QuotientCorrespondence = {
    surface,
    resolution: 0,
    word: '',
    gridVertexTo: {},
    vertexClasses: {},
    faceCells: {},
  };
  return {
    surface,
    immersion: { shape, correspondence },
    loops,
    invariants: faithful.invariants,
    h1Label: faithful.h1Label,
  };
}

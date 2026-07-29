// laidInkedModel — CRAFT-PARITY-AS-UNIFICATION: the thin adapter that hands a
// LAID form to the ONE crafted renderer (InkedForm), killing the inversion
// where the person's own cells rendered worse than the zoo.
//
// THE MEASURED SEAM (engineer, on the frozen bytes): InkedForm renders from
// `model.immersion.shape` + `model.loops` — vertexPaths resolved through the
// shape's OWN vertices — and never reads `correspondence` or the surface key.
// So the adapter mints:
//   · immersion.shape — a Shape whose vertices are the laid samples (the
//     welded dense mesh + the person's cell-curve chains + the certified
//     basis-loop samples, all built by laidBodyModel where the cover frames
//     live), whose faces are the mesh triangles (body / prepass / hull /
//     hatching), and whose EDGES are the person's cell curves as chains —
//     the construction-line register draws exactly the person's cells, the
//     crossing register's breaks already honored;
//   · loops — the certified Option-B basis as GeneratorLoops (letters [], so
//     the committed craft draws every core in the primary generator ink);
//   · correspondence — a typed stub (unused by the frozen renderer, measured);
//   · invariants / h1Label / surface — the laid model's own, verbatim.
//
// ZERO FROZEN EDIT: InkedForm.tsx / inkedFormModel.ts are imported (types) and
// consumed — never touched. The hard rail holds by construction.
//
// DERIVE-ONLY · ADDITIVE: laidBodyModel builds the lay; this module only
// re-shapes it into the frozen renderer's own model contract.

import type { Edge, Face, Shape, Vertex } from '../types/geometry';
import { createDefaultVertexData } from '../lib/shape';
import type { QuotientCorrespondence } from '../lib/surfaceImmersion';
import type { GeneratorLoop, InkedFormModel } from './inkedFormModel';
import type { LaidBodyModel } from './laidBodyModel';

export function buildLaidInkedModel(laid: LaidBodyModel): InkedFormModel {
  const shapeId = `shape:laidink:${laid.shape.id}`;
  const vertices: Record<string, Vertex> = {};
  for (const sample of laid.inked.vertices) {
    vertices[sample.id] = {
      id: sample.id,
      position: sample.position,
      data: createDefaultVertexData(sample.id),
      createdBy: { shapeId, operation: 'seed', sourceVertexIds: [] },
    };
  }
  const faces: Face[] = laid.inked.triangles.map((tri, k) => ({
    id: `face:laidink:${k}`,
    vertexIds: tri,
    role: 'seed-face',
  }));
  const edges: Edge[] = [];
  laid.inked.edgeChains.forEach((chain, ci) => {
    for (let k = 0; k + 1 < chain.length; k += 1) {
      edges.push({
        id: `edge:laidink:${ci}:${k}`,
        vertexIds: [chain[k], chain[k + 1]],
        sourceVertexIds: [chain[k], chain[k + 1]],
      });
    }
  });
  const shape: Shape = {
    id: shapeId,
    name: laid.surface,
    vertices,
    edges,
    faces,
    cells: [],
    generations: [],
    genealogy: {
      parentShapeId: null,
      operation: 'seed', // a render substrate — no lineage claim (the laid model carries the truth)
      generationDepth: 0,
      sourceVertexIds: [],
      createdVertexIds: Object.keys(vertices),
      createdAt: '',
    },
  };
  const loops: GeneratorLoop[] = laid.inked.loops.map((loop) => ({
    letters: [], // a certified core — the committed craft draws it in ink a
    label: loop.label,
    vertexPath: loop.path,
    gridPath: [],
  }));
  // typed, empty, and — measured on the frozen bytes — never read
  const correspondence: QuotientCorrespondence = {
    surface: laid.surface,
    resolution: 0,
    word: '',
    gridVertexTo: {},
    vertexClasses: {},
    faceCells: {},
  };
  return {
    surface: laid.surface,
    immersion: { shape, correspondence },
    loops,
    invariants: laid.invariants,
    h1Label: laid.h1Label,
  };
}

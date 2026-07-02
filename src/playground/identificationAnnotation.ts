// identificationAnnotation — L2: the pure selectors of the identification layer
// (ADR 0018, level 2). Given an R0 `QuotientCorrespondence`, derive WHAT the
// annotation shows — nothing is invented that is not already in the
// correspondence (derive-only):
//
//   · the HISTORIED-MERGE POINTS — the merged vertices where the boundary
//     identification landed (`vertexClasses[v].length > 1`): each carries its
//     MULTIPLICITY and the distinct grid points it absorbed. Co-location ≠
//     identity, made visible: the torus's corner point IS four identified
//     corners.
//   · the IDENTIFIED LOOPS — the edge-classes the fundamental polygon's
//     boundary edges became: letter `a` = the horizontal boundary rows
//     (j = 0 / j = R), letter `b` = the vertical boundary columns (i = 0 /
//     i = R). Each quotient loop-edge records the (two) boundary grid edges
//     that landed on it. `closed` reports whether the letter's path returns to
//     its start class — true for the torus/Klein generators, FALSE for RP²'s
//     `a` and `b` individually (word abab: each letter is an arc between the
//     two corner classes; the closed generator is their concatenation).
//
// Kept react-free on purpose: the acceptance diagnostic requires THESE selectors
// through the anti-mock hook; the rendering lives in
// `src/components/SurfaceIdentificationOverlay.tsx` and consumes them verbatim.
// This module is presentation-selection only — L3 field content does not exist
// here. Route-B lifted surfaces will generalize the merge points to carry real
// ambo lineage (richer than grid refs); that arrives with its own charter, not
// built here.

import type { VertexId } from '../types/geometry';
import { canonicalEdgeKey } from '../lib/ids';
import type { GridPointRef, QuotientCorrespondence } from '../lib/surfaceImmersion';

export interface HistoriedMergePoint {
  vertexId: VertexId;
  multiplicity: number; // = vertexClasses[vertexId].length (> 1)
  members: GridPointRef[]; // the distinct pre-merge grid points it absorbed
}

// The merged vertices, straight off the correspondence — sorted for determinism.
export function selectHistoriedMerges(correspondence: QuotientCorrespondence): HistoriedMergePoint[] {
  return Object.entries(correspondence.vertexClasses)
    .filter(([, refs]) => refs.length > 1)
    .map(([vertexId, refs]) => ({ vertexId, multiplicity: refs.length, members: refs }))
    .sort((x, y) => x.vertexId.localeCompare(y.vertexId));
}

export interface LoopGridEdge {
  from: { i: number; j: number };
  to: { i: number; j: number };
}

export interface IdentifiedLoopEdge {
  endpoints: [VertexId, VertexId]; // the quotient edge's merged endpoints
  key: string; // committed canonicalEdgeKey of the endpoints (matches shape.edges)
  gridEdges: LoopGridEdge[]; // the boundary grid edges that landed on this class
}

export interface IdentifiedLoop {
  letter: 'a' | 'b';
  edges: IdentifiedLoopEdge[];
  closed: boolean; // the letter path returns to its start class
}

export interface IdentifiedLoops {
  a: IdentifiedLoop;
  b: IdentifiedLoop;
}

// The identified loops, derived ONLY from gridVertexTo + resolution. Letter `a`
// walks the horizontal boundary rows, letter `b` the vertical boundary columns;
// the two rows (resp. columns) land on the SAME quotient edge-classes — each
// loop edge records both grid edges it absorbed.
export function selectIdentifiedLoops(correspondence: QuotientCorrespondence): IdentifiedLoops {
  const R = correspondence.resolution;
  const at = (i: number, j: number): VertexId => {
    const vertexId = correspondence.gridVertexTo[`${i},${j}`];
    if (!vertexId) {
      throw new Error(`identificationAnnotation: grid point (${i},${j}) missing from the correspondence`);
    }
    return vertexId;
  };

  const buildLetter = (
    letter: 'a' | 'b',
    gridEdgesOf: () => LoopGridEdge[],
    pathStart: VertexId,
    pathEnd: VertexId,
  ): IdentifiedLoop => {
    const byKey = new Map<string, IdentifiedLoopEdge>();
    for (const gridEdge of gridEdgesOf()) {
      const u = at(gridEdge.from.i, gridEdge.from.j);
      const v = at(gridEdge.to.i, gridEdge.to.j);
      const key = canonicalEdgeKey(u, v);
      const existing = byKey.get(key);
      if (existing) {
        existing.gridEdges.push(gridEdge);
      } else {
        byKey.set(key, { endpoints: [u, v], key, gridEdges: [gridEdge] });
      }
    }
    const edges = [...byKey.values()].sort((x, y) => x.key.localeCompare(y.key));
    return { letter, edges, closed: pathStart === pathEnd };
  };

  const a = buildLetter(
    'a',
    () => {
      const gridEdges: LoopGridEdge[] = [];
      for (let i = 0; i < R; i += 1) {
        gridEdges.push({ from: { i, j: 0 }, to: { i: i + 1, j: 0 } });
        gridEdges.push({ from: { i, j: R }, to: { i: i + 1, j: R } });
      }
      return gridEdges;
    },
    at(0, 0),
    at(R, 0),
  );

  const b = buildLetter(
    'b',
    () => {
      const gridEdges: LoopGridEdge[] = [];
      for (let j = 0; j < R; j += 1) {
        gridEdges.push({ from: { i: 0, j }, to: { i: 0, j: j + 1 } });
        gridEdges.push({ from: { i: R, j }, to: { i: R, j: j + 1 } });
      }
      return gridEdges;
    },
    at(0, 0),
    at(0, R),
  );

  return { a, b };
}

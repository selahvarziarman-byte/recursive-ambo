// THE CONFORMAL ATOM (§2 first build, 2026-07-30) — own the per-corner angle;
// Gauss–Bonnet is the self-seal. OWN-ONLY: nothing here renders.
//
// The engine derives the per-corner angle everywhere and owned it nowhere
// (the dual computes faceAngle to SORT and discards it; the seed places
// corners latent in positions, unread). This module makes the engine
// REMEMBER one angle:
//   · the atom is COMBINATORIAL — a regular n-gon's corner is (n−2)π/n
//     (triangle 60°, square 90°), from the seed's n, NEVER render positions;
//   · the stamp lands on the NON-frozen invocation seams (the zoo store's
//     invokeForm; the manuscript view's invoke wrapper) — the frozen
//     constructors are untouched (geometry.ts's optional field is the ONE
//     sanctioned frozen edit, re-sealed in the same change);
//   · the per-vertex curvature DERIVES from the owned atoms through the
//     committed vertex-link idiom — INTERIOR (link a closed cycle) →
//     deficit 2π − Σθ_v; BOUNDARY (link an open arc) → turning π − Σθ_v;
//   · the SELF-SEAL is the general boundary-corrected Gauss–Bonnet:
//     Σ_interior(2π − Σθ) + Σ_boundary(π − Σθ) = 2πχ — the identity that
//     cannot be cheated (a single wrong corner breaks it).
//
// DERIVE-ONLY · ADDITIVE: committed modules by import (decomposeLink — the
// materializer's own link reader); no invariant recomputed, no mutation
// (every stamp returns a NEW shape).

import type { Shape, VertexId } from '../types/geometry';
import { decomposeLink, type LinkValence } from './incidenceTraceRegistry';

// the combinatorial atom: a regular n-gon's interior corner — (n−2)π/n
export function regularCornerAngle(n: number): number {
  return ((n - 2) * Math.PI) / n;
}

// THE STAMP — for an invoked regular-seed form: every face's every corner is
// (n−2)π/n (n = that face's vertex count), index-aligned to `vertexIds`.
// A face already carrying angles keeps them (the stamp never overwrites an
// owned atom); the shape is never mutated.
export function computeSeedCornerAngles(shape: Shape): Shape {
  return {
    ...shape,
    faces: shape.faces.map((face) =>
      face.cornerAngles
        ? face
        : { ...face, cornerAngles: face.vertexIds.map(() => regularCornerAngle(face.vertexIds.length)) },
    ),
  };
}

// ---------------------------------------------------------------------------
// P1 — THE SUBDIVIDE'S FORCED TRANSFORM (2026-07-30): the chord splits the
// parent corner at each endpoint (θ → α+β); every other corner RIDES
// byte-unchanged. α is the inscribed combinatorial split — the UNIQUE flat
// assignment: the disk spans d = j−i rim edges, so its (d+1)-gon owes
// Σ = (d−1)π; the d−1 riding middles carry (d−1)θ, leaving
// 2α = (d−1)(π−θ) = (d−1)·2π/n ⇒ α = (d−1)π/n; β = θ−α closes the rest
// identically. α+β = θ ⇒ every vertex angle-sum is UNCHANGED ⇒ Gauss–Bonnet
// holds through the reshape — the seal is AUTOMATIC, never re-checked in.
// ⛔ THE GATE — REGULAR parents only (all corners equal): the combinatorial
// split speaks only where the parent's corners are one θ. An IRREGULAR
// parent (unequal corners — an already-split or lifted face) returns null
// and the children stay UN-OWNED — nothing fabricated; the exact split
// needs source arc-geometry (deferred to P5/lift). Never reads positions.
// ---------------------------------------------------------------------------
export function splitCornerAngles(
  cornerAngles: number[],
  i: number,
  j: number,
): { disk: number[]; rest: number[] } | null {
  const n = cornerAngles.length;
  const d = (j - i + n) % n; // the chord's cyclic span (subdivideFace refuses d ∈ {0, 1, n−1})
  if (n < 3 || d < 2 || d > n - 2) return null;
  const theta = cornerAngles[0];
  const EPS = 1e-9;
  if (!cornerAngles.every((a) => Math.abs(a - theta) < EPS)) return null; // irregular — the honest deferral
  const alpha = ((d - 1) * Math.PI) / n;
  const beta = theta - alpha;
  const disk: number[] = [alpha];
  for (let k = 1; k < d; k += 1) disk.push(cornerAngles[(i + k) % n]); // the middles RIDE
  disk.push(alpha);
  const rest: number[] = [beta];
  for (let k = 1; k < n - d; k += 1) rest.push(cornerAngles[(j + k) % n]); // the middles RIDE
  rest.push(beta);
  return { disk, rest };
}

export interface VertexCurvatureReading {
  vertexId: VertexId;
  valence: 'interior' | 'boundary';
  angleSum: number; // Σθ_v — the owned corner angles at v over incident face slots
  curvature: number; // interior: 2π − Σθ_v · boundary: π − Σθ_v
}

// the vertex link, the committed idiom (cutOperation's buildVertexLink,
// end-to-end): each face incident to v contributes ONE corner-arc joining
// v's two cyclic neighbours in that face; decomposeLink then reads the
// valence (closed cycle = interior, open arc = boundary).
function vertexLinkOf(v: VertexId, shape: Shape): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();
  const ensure = (x: string): string[] => {
    let list = adjacency.get(x);
    if (!list) {
      list = [];
      adjacency.set(x, list);
    }
    return list;
  };
  for (const face of shape.faces) {
    const cycle = face.vertexIds;
    const n = cycle.length;
    for (let k = 0; k < n; k += 1) {
      if (cycle[k] !== v) continue;
      const prev = cycle[(k - 1 + n) % n];
      const next = cycle[(k + 1) % n];
      ensure(prev).push(next);
      ensure(next).push(prev);
    }
  }
  return adjacency;
}

// THE DERIVATION — per-vertex curvature from the OWNED atoms. Refuses
// honestly where it cannot speak: a face without its atoms (own it first —
// nothing is fabricated), or a vertex whose link is neither a closed cycle
// nor an open arc (a junction/pinch has no Gauss–Bonnet clause here).
export function readVertexCurvatures(shape: Shape): VertexCurvatureReading[] {
  for (const face of shape.faces) {
    if (!face.cornerAngles) {
      throw new Error(
        `conformalAtom: face "${face.id}" carries no cornerAngles — the atom is not owned yet (stamp at the invocation seam first; nothing is fabricated)`,
      );
    }
    if (face.cornerAngles.length !== face.vertexIds.length) {
      throw new Error(
        `conformalAtom: face "${face.id}" carries ${face.cornerAngles.length} angles for ${face.vertexIds.length} corners — the alignment law is broken`,
      );
    }
  }
  const readings: VertexCurvatureReading[] = [];
  for (const vertexId of Object.keys(shape.vertices)) {
    let angleSum = 0;
    for (const face of shape.faces) {
      const cycle = face.vertexIds;
      for (let k = 0; k < cycle.length; k += 1) {
        if (cycle[k] === vertexId) angleSum += (face.cornerAngles as number[])[k];
      }
    }
    const link = vertexLinkOf(vertexId, shape);
    if (link.size === 0) {
      throw new Error(
        `conformalAtom: vertex "${vertexId}" has no incident face corner — an isolated vertex carries no angle and no clause`,
      );
    }
    const valence: LinkValence = decomposeLink(link).valence;
    if (valence !== 'interior' && valence !== 'boundary') {
      throw new Error(
        `conformalAtom: vertex "${vertexId}" reads link valence "${valence}" — Gauss–Bonnet speaks only for interior (closed link) and boundary (open arc) vertices`,
      );
    }
    readings.push({
      vertexId,
      valence,
      angleSum,
      curvature: valence === 'interior' ? 2 * Math.PI - angleSum : Math.PI - angleSum,
    });
  }
  return readings;
}

// THE SELF-SEAL's left-hand side — the general boundary-corrected total:
// Σ_interior(2π − Σθ) + Σ_boundary(π − Σθ). Equals 2πχ or the atom lies.
export function gaussBonnetTotal(readings: VertexCurvatureReading[]): number {
  return readings.reduce((sum, r) => sum + r.curvature, 0);
}

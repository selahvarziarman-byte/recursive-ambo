// level3Subdivision — ARC 0.1: THE SUBDIVISION (engineer-chartered 2026-07-14,
// sealed 080adb52…2496; researcher-ruled · mothership-ratified — ADR 0022 §3
// restated). Make the wall's cure a door that exists.
//
// LAW 14 — A CURE MUST BE A DOOR, NOT A THEOREM. The folded-edge wall told the
// person "subdivide to resolve the fold, and the gate will read it" while no
// subdivision existed in the engine. This module is that door.
//
// WHY EDGE BISECTION SUFFICES — AND ⚠ THE PRECONDITION, BY LINE:
// The requirement (ADR 0022 §3): the identification's FIXED SET must be a
// SUBCOMPLEX — no cell identified with itself non-trivially. On the committed
// guards this specializes:
//   · no fixed point in the 3-cell's interior — face-pairings identify
//     boundary points with boundary points only;
//   · no fixed point in a face's interior — faceIdentification.ts:316
//     ("a face cannot pair with itself in Build 1") together with
//     assertWellFormed's perfect-matching guard make the face pairing a
//     FIXED-POINT-FREE INVOLUTION on the six faces;
//   ⇒ the fixed set lies ENTIRELY in the 1-SKELETON. The only fold is an edge
//     fold (e ≡ ē), and its fixed point is the edge's midpoint.
//     BISECT THE 1-SKELETON. KEEP ONE CELL.
//
// ⚠ THIS SPECIALIZATION IS VALID EXACTLY WHILE faceIdentification.ts:316 IS
// ENFORCED. Admit a MIRROR (self-paired) face — which is precisely how one
// generates a REFLECTION ORBIFOLD — and a FACE can fold: edge bisection no
// longer suffices, and the general (barycentric) cure returns. Check that line
// in one grep before relying on this op.
//
// ⚠ UNIFORM, NEVER PARTIAL: bisect ALL edges. Bisecting only the folded edges
// turns incident faces into pentagons/hexagons and breaks paired-face
// congruence (the validator throws on non-congruent cycles). Uniform bisection
// makes every face an 8-cycle, so paired faces stay congruent, and the pairing
// maps LIFT by the same cycle-preserving bijection the validator already
// checks: a midpoint maps to the midpoint of its edge's image.
//
// After the lift, a previously folded edge e resolves as e → e₁, m, e₂: the
// identification SWAPS e₁ ↔ e₂ and FIXES m pointwise. m is a genuine VERTEX of
// the finer complex; the fixed set {m} is a 0-dimensional subcomplex. Every
// chain group is free; the oriented chain computes.
//
// ⛔ CLAIM NOTHING ABOUT THE RESULT. Subdivision makes the orbifold LEGIBLE,
// not a manifold. Whatever the gate then says of the finer cell structure is
// the honest reading. The finer question — is the underlying space ALSO a
// manifold? — is ARC 0.3, its own seal.

import type { VertexId } from '../types/geometry';
import type { FacePairing, Level3SeedCell } from './faceIdentification';

// unordered-endpoint key (the faceIdentification pairKey idiom — the separator
// is U+0000 spelled as an ESCAPE, never a raw byte: NO FROZEN FILE MAY CONTAIN
// A NUL, and this module keeps the same hygiene)
const unorderedKey = (a: string, b: string): string => (a < b ? `${a}\u0000${b}` : `${b}\u0000${a}`);

// The midpoint vertex minted for an edge — deterministic from the UNORDERED
// endpoints, so the lift can name the image edge's midpoint without knowing
// which way the image runs in the partner's cycle.
export function midpointVertexId(a: VertexId, b: VertexId): VertexId {
  return a < b ? `mid:${a}~${b}` : `mid:${b}~${a}`;
}

/**
 * bisectEdges — the pure combinatorial rewrite. Every edge (a, b) becomes
 * (a, m) + (m, b) with m = midpointVertexId(a, b); every face cycle interleaves
 * its corners with the midpoints of its sides. On the seed cube:
 * 20 vertices (8 + 12 midpoints) · 24 half-edges · 6 OCTAGONAL faces · 1 cell.
 * (`faces.cycle` is already an arbitrary VertexId[] — the type carries an
 * 8-cycle without any new cell kind.)
 */
export function bisectEdges(seed: Level3SeedCell): Level3SeedCell {
  const midByPair = new Map<string, VertexId>();
  const edges: Level3SeedCell['edges'] = [];
  for (const edge of seed.edges) {
    const m = midpointVertexId(edge.a, edge.b);
    if (midByPair.has(unorderedKey(edge.a, edge.b))) {
      throw new Error(`level3Subdivision: duplicate edge endpoints ${edge.a} ~ ${edge.b}`);
    }
    midByPair.set(unorderedKey(edge.a, edge.b), m);
    edges.push({ id: `${edge.id}:h1`, a: edge.a, b: m }, { id: `${edge.id}:h2`, a: m, b: edge.b });
  }
  const midOf = (u: VertexId, w: VertexId): VertexId => {
    const m = midByPair.get(unorderedKey(u, w));
    if (!m) throw new Error(`level3Subdivision: face side ${u} ~ ${w} has no seed edge to bisect`);
    return m;
  };
  const faces = seed.faces.map((face) => ({
    id: face.id,
    cycle: face.cycle.flatMap((u, k) => [u, midOf(u, face.cycle[(k + 1) % face.cycle.length])]),
  }));
  return {
    cellId: seed.cellId,
    vertexIds: [...seed.vertexIds, ...seed.edges.map((edge) => midpointVertexId(edge.a, edge.b))],
    edges,
    faces,
  };
}

/**
 * liftPairingsToBisected — the pairing maps lift to the 8-cycles by the same
 * cycle-preserving bijection the validator already checks: every original
 * corner keeps its image, and the midpoint of side (u, next u) maps to the
 * midpoint of that side's image (map[u], map[next u]). Modes are unchanged —
 * the lift moves no topology; assertWellFormed re-validates the lifted maps
 * when the caller re-glues.
 */
export function liftPairingsToBisected(seed: Level3SeedCell, pairings: FacePairing[]): FacePairing[] {
  const faceById = new Map(seed.faces.map((face) => [face.id, face]));
  return pairings.map((pairing) => {
    const fA = faceById.get(pairing.faceA);
    if (!fA) throw new Error(`level3Subdivision: pairing names unknown face ${pairing.faceA}`);
    const map: Record<VertexId, VertexId> = { ...pairing.map };
    const n = fA.cycle.length;
    for (let k = 0; k < n; k += 1) {
      const u = fA.cycle[k];
      const w = fA.cycle[(k + 1) % n];
      const vU = pairing.map[u];
      const vW = pairing.map[w];
      if (!vU || !vW) throw new Error(`level3Subdivision: the map misses a corner of ${pairing.faceA}`);
      map[midpointVertexId(u, w)] = midpointVertexId(vU, vW);
    }
    return { ...pairing, map };
  });
}

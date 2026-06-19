// lineage — the CANONICAL, single-source definition of the lineage key.
//
// This module is the ONE home of the lineage primitive: the nested derivation
// tree of a vertex collapsed to its PRIMAL MULTISET (the multiset, with
// multiplicity, of its seed/source-less ancestors), keyed by a stable string
// (verified injective to its leaves — equal keys iff identical lineages). It is
// the foundational charge of BOTH halves of the system and is deliberately
// factored out so the two never drift (researcher/mothership ruling — single
// source of truth, reuse, never re-derive):
//   • the GENERATION-side carried invariant (`scope × lineage`) — the registry's
//     B-twin grouping key in `incidenceTraceRegistry.buildTargetTally`; and
//   • the TRANSFORMATION-side conserved charge — the ledger's homogeneity
//     criterion in `transformationLedger.certifyFaithfulness` (via `shapeLineageOf`).
// It belongs to NEITHER certifier; both import it, so the B-twin test and the
// homogeneity test compute one and the same lineage definition.
//
// Pure and read-only: it mutates nothing and depends only on the `Shape` TYPE.

import type { Shape } from '../types/geometry';

// PURE-LINEAGE B-twin key (spec §5 as ruled 2026-06-19). The lineage of a vertex
// is its PRIMAL MULTISET: the multiset (with multiplicity) of its seed/source-less
// ancestors, gathered by recursing createdBy.sourceVertexIds. A source-less vertex
// (a seed, or any vertex with no sources) is its own primal with multiplicity 1;
// otherwise the multiset-union over its sources. Position/coincidence is the §7
// heuristic and is deliberately NOT consulted here. Memoized over a shared map;
// lineage is a DAG so each vertex resolves once. Returned maps are never mutated
// by callers (parents union into a fresh map), so sharing the memo is safe.
export function primalMultiset(
  vertexId: string,
  shape: Shape,
  memo: Map<string, Map<string, number>>,
): Map<string, number> {
  const cached = memo.get(vertexId);
  if (cached) {
    return cached;
  }
  const vertex = shape.vertices[vertexId];
  const sources = vertex?.createdBy.sourceVertexIds ?? [];
  const result = new Map<string, number>();
  if (!vertex || sources.length === 0) {
    result.set(vertexId, 1); // a seed / source-less vertex is its own primal
  } else {
    for (const source of sources) {
      for (const [primal, count] of primalMultiset(source, shape, memo)) {
        result.set(primal, (result.get(primal) ?? 0) + count);
      }
    }
  }
  memo.set(vertexId, result);
  return result;
}

// Canonical, stable string key for a primal multiset: sorted `id×count` terms.
// Injective on distinct multisets (primal ids are unique by construction), so
// two scoped sites collide iff their lineages are identical.
export function primalMultisetKey(multiset: Map<string, number>): string {
  return [...multiset.entries()]
    .map(([primal, count]) => `${primal}×${count}`)
    .sort()
    .join('|');
}

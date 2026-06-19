// incidenceTraceRegistry — the Incidence Trace & Square-Coherence Registry v0.
//
// A pure, read-only function over a `Shape`, returning a typed report with an
// `issues[]` array. It mutates nothing, names nothing, and fabricates nothing —
// it CERTIFIES structure (incidence only); it asserts no semantic names and no
// truths. Built as a read-only sibling of `src/lib/siteWitnessCatalogueV0.ts`
// (see the authoritative spec:
// docs/governance/PLATONIC_ENGINE_INCIDENCE_TRACE_REGISTRY_SPEC.md).
//
// SCOPE OF THIS FILE (build prompt P1): ONLY the per-cell/body
// GlobalSquareResolution policy layer (spec §4 + the `per cell/body` rows of
// §5). The PER-SITE members (Trace△ / Trace□ / Coh□ / GlueCoh) and the
// per-target tally are LATER prompts; the report is shaped so they are added by
// ADDING fields, never by reshaping. Nothing is built for them here.
//
// RE-DERIVATION (spec §4 BINDING RULE): the coherent square-diagonal matching
// search is RE-DERIVED here read-only. We do NOT import or call the pyritohedral
// module (src/lib/pyritohedralDiagonalization.ts); the registry does NOT select
// a matching — pyritohedral's chirality does. `selectedMatching` therefore stays
// null in this layer.
//
// HONESTY (spec §3 / §4 BINDING RULE): "no perfect matching" means ONLY "this
// named policy does not apply" — NEVER "no coherence". Counts are never coerced:
// every cell is graded honestly, and a surprising count (e.g. a cuboctahedron
// yielding ≠ 2) is reported as the real number with an `issues[]` note.

import type { Cell, Face, Shape, VertexId } from '../types/geometry';
import { canonicalEdgeKey } from './ids';

export interface GlobalSquareResolution {
  // spec §4 + §5 "per cell/body"
  cellId: string;
  cellTopology: string;
  squareCount: number;
  vertexCount: number;
  resolutionPolicyId: string; // e.g. 'square-diagonal-perfect-matching'
  policyPrecheckStatus: 'applicable' | 'not-applicable-by-count';
  diagonalChoiceCount: number; // # squares = # binary diagonal choices (search = 2^this)
  matchingCount: number; // coherent perfect-matchings found
  selectedMatching: string[] | null; // null in P1 (registry does NOT select; pyritohedral's chirality does). Typed wide so P2+ need not reshape.
  status: 'not-run' | 'not-applicable-by-count' | 'absent' | 'unique' | 'multiple' | 'selected';
  // (per §5 traceSquareCount / allSquaresHaveTwoCandidateApexes depend on Trace□ — add in P3, omit now)
}

export interface IncidenceTraceRegistryReport {
  method: 'incidence-trace-registry-v0';
  scope: 'incidence-only';
  semanticStatus: 'not-semantic-naming';
  shapeMutationStatus: 'not-shape-mutation';
  packetWriteStatus: 'not-packet-writing';
  cellBodies: GlobalSquareResolution[]; // P1 populates this
  issues: string[];
}

const RESOLUTION_POLICY_ID = 'square-diagonal-perfect-matching';

// The two diagonals of a 4-cycle face [a, b, c, d]: {a, c} and {b, d}, keyed by
// canonicalEdgeKey. Mirrors pyritohedralDiagonalization.getSquareDiagonalChoices
// read-only (we derive the keys ourselves; we do NOT import it).
function squareDiagonalKeys(face: Face): [string, string] {
  const [a, b, c, d] = face.vertexIds;
  return [canonicalEdgeKey(a, c), canonicalEdgeKey(b, d)];
}

// Every chosen diagonal covers each cell vertex exactly once (a perfect vertex
// matching). Mirrors pyritohedralDiagonalization.isPerfectVertexMatching.
function isPerfectVertexMatching(vertexIds: VertexId[], chosen: [VertexId, VertexId][]): boolean {
  const counts = new Map<VertexId, number>(vertexIds.map((id) => [id, 0]));
  for (const [u, v] of chosen) {
    counts.set(u, (counts.get(u) ?? 0) + 1);
    counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return vertexIds.every((id) => counts.get(id) === 1);
}

// Canonical edge keys of all the cell's faces' SIDES (consecutive vertex pairs).
// Matches the reference's getCellEdgeMap/deriveEdges semantics read-only.
function cellEdgeKeys(faces: Face[]): Set<string> {
  const keys = new Set<string>();
  for (const face of faces) {
    const n = face.vertexIds.length;
    for (let i = 0; i < n; i += 1) {
      keys.add(canonicalEdgeKey(face.vertexIds[i], face.vertexIds[(i + 1) % n]));
    }
  }
  return keys;
}

// Enumerate all 2^squareCount diagonal assignments for one cell and count those
// that are (i) a perfect vertex matching AND (ii) collide with no existing
// cell-side edge key. RE-DERIVED read-only (no pyritohedral import/call).
function countCoherentMatchings(
  cellVertexIds: VertexId[],
  squareFaces: Face[],
  edgeKeys: Set<string>,
): number {
  // Stable square order (mirrors the reference's id sort) so the bit indices are
  // well-defined; the COUNT is order-independent regardless.
  const ordered = [...squareFaces].sort((a, b) => a.id.localeCompare(b.id));
  const choicesPerSquare = ordered.map((face): [[VertexId, VertexId], [VertexId, VertexId]] => {
    const [a, b, c, d] = face.vertexIds;
    return [
      [a, c],
      [b, d],
    ];
  });
  const diagonalKeysPerSquare = ordered.map(squareDiagonalKeys);

  const assignmentCount = 2 ** ordered.length;
  let matchingCount = 0;

  for (let mask = 0; mask < assignmentCount; mask += 1) {
    const chosen = choicesPerSquare.map((pair, index) => pair[(mask >> index) & 1]);
    if (!isPerfectVertexMatching(cellVertexIds, chosen)) {
      continue;
    }
    const chosenKeys = diagonalKeysPerSquare.map((pair, index) => pair[(mask >> index) & 1]);
    if (chosenKeys.some((key) => edgeKeys.has(key))) {
      continue;
    }
    matchingCount += 1;
  }

  return matchingCount;
}

export function buildIncidenceTraceRegistry(shape: Shape): IncidenceTraceRegistryReport {
  const issues: string[] = [];
  const faceById = new Map<string, Face>(shape.faces.map((face) => [face.id, face]));
  const cellBodies: GlobalSquareResolution[] = [];

  for (const cell of shape.cells) {
    const faces = cell.faceIds
      .map((id) => faceById.get(id))
      .filter((face): face is Face => Boolean(face));
    const squareFaces = faces.filter((face) => face.vertexIds.length === 4);

    // Cells with no square (4-vertex) face are omitted (spec §4).
    if (squareFaces.length === 0) {
      continue;
    }

    const squareCount = squareFaces.length;
    const vertexCount = cell.vertexIds.length;
    const cellTopology = cell.topology ?? '';

    // Precheck (spec §4): the named policy is applicable only when a perfect
    // square-diagonal matching is possible by count (2 vertices per square,
    // every cell vertex covered exactly once). NOT-applicable means ONLY "this
    // named policy does not apply" — NEVER "no coherence" (§4 BINDING RULE).
    const policyPrecheckStatus: GlobalSquareResolution['policyPrecheckStatus'] =
      2 * squareCount === vertexCount ? 'applicable' : 'not-applicable-by-count';

    if (policyPrecheckStatus === 'not-applicable-by-count') {
      cellBodies.push({
        cellId: cell.id,
        cellTopology,
        squareCount,
        vertexCount,
        resolutionPolicyId: RESOLUTION_POLICY_ID,
        policyPrecheckStatus,
        diagonalChoiceCount: squareCount,
        matchingCount: 0,
        selectedMatching: null,
        status: 'not-applicable-by-count',
      });
      continue;
    }

    const edgeKeys = cellEdgeKeys(faces);
    const matchingCount = countCoherentMatchings(cell.vertexIds, squareFaces, edgeKeys);

    const status: GlobalSquareResolution['status'] =
      matchingCount === 0 ? 'absent' : matchingCount === 1 ? 'unique' : 'multiple';

    // Honesty (spec §6): never coerce a count. A cuboctahedron is expected to
    // yield exactly 2 (the pyritohedral chiral pair); if it does not, report the
    // real number and surface it.
    if (cellTopology === 'cuboctahedron' && matchingCount !== 2) {
      issues.push(
        `cell ${cell.id} (cuboctahedron) yielded ${matchingCount} coherent square-diagonal matchings (expected 2)`,
      );
    }

    cellBodies.push({
      cellId: cell.id,
      cellTopology,
      squareCount,
      vertexCount,
      resolutionPolicyId: RESOLUTION_POLICY_ID,
      policyPrecheckStatus,
      diagonalChoiceCount: squareCount,
      matchingCount,
      selectedMatching: null,
      status,
    });
  }

  return {
    method: 'incidence-trace-registry-v0',
    scope: 'incidence-only',
    semanticStatus: 'not-semantic-naming',
    shapeMutationStatus: 'not-shape-mutation',
    packetWriteStatus: 'not-packet-writing',
    cellBodies,
    issues,
  };
}

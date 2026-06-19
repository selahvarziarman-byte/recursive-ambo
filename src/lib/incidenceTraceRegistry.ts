// incidenceTraceRegistry — the Incidence Trace & Square-Coherence Registry v0.
//
// A pure, read-only function over a `Shape`, returning a typed report with an
// `issues[]` array. It mutates nothing, names nothing, and fabricates nothing —
// it CERTIFIES structure (incidence only); it asserts no semantic names and no
// truths. Built as a read-only sibling of `src/lib/siteWitnessCatalogueV0.ts`
// (see the authoritative spec:
// docs/governance/PLATONIC_ENGINE_INCIDENCE_TRACE_REGISTRY_SPEC.md).
//
// SCOPE OF THIS FILE:
//   P1 — the per-cell/body GlobalSquareResolution policy layer (spec §4 + the
//        `per cell/body` rows of §5). UNCHANGED by P2.
//   P2 — the per-site relational-reading layer (`sites`), with the DERIVATION-
//        AWARE `contextKind` taxonomy (mothership ruling 2026-06-19) and the
//        face-mediation member (Trace△ = apex + medialCycle) FULLY populated.
//        The other three kinds (face-coherence / face-coherence-n / vertex-
//        figure) are RECORDED but their detail (candidateApexes, opposite,
//        degree, …) is DEFERRED to P3 — never silently dropped.
// The per-target tally is a LATER prompt; the report is shaped so it is added by
// ADDING a field, never by reshaping.
//
// DERIVATION-AWARE taxonomy (spec §3 as amended): a dissection-core-face is
// classified by WHICH CONSTRUCTOR made it, NOT by its own polygon size (size↔
// derivation is a per-body accident — it aligns on the octahedron, collides on
// the tetrahedron, inverts on the cube). Each core-face carries exactly one of
// sourceFaceId (source-face-medial) or sourceVertexId (vertex-ring):
//   sourceFaceId set -> classify by the RESOLVED SOURCE FACE's polygon size:
//        3-gon -> 'face-mediation' (Trace△, 1 apex)  [atomicRegistry counts EXACTLY these]
//        4-gon -> 'face-coherence' (Trace□, P3 detail)
//        n>4   -> 'face-coherence-n' (P3 detail)
//   sourceVertexId set -> 'vertex-figure' (P3 detail).
//
// REGRESSION ANCHOR: face-mediation is RE-DERIVED here independently. We do NOT
// import atomicRegistry.ts — it is imported ONLY by the diagnostic, where the
// per-midpoint Trace△ readings are checked one-for-one against its supported
// 'edge-mediation-with-face-local-projection' contexts. Source-face resolution
// mirrors atomicRegistry.findSourceFaceCandidates read-only: a core-face's
// sourceFaceId is a BACK-REFERENCE to a pre-dissection seed-face id, NOT a
// literal post-dissection face.id, so it is resolved cell-scoped first
// (sourceCellId -> parentCellId -> that cell's faces) then by a global fallback.
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

// P2 — per-site relational-reading layer. `contextKind` is the derivation-aware
// classification (spec §3 as amended); see the file header.
export type ContextKind = 'face-mediation' | 'face-coherence' | 'face-coherence-n' | 'vertex-figure';

export interface RelationalReading {
  support: string; // scoped midpoint id (M_AB)
  generatedFaceId: string; // the dissection-core-face this reading is read through
  sourceFaceId: string | null; // back-reference; set for face-* kinds
  sourceVertexId: string | null; // set for vertex-figure
  contextKind: ContextKind;
  // face-mediation (Trace△) — FULLY populated in P2:
  apex: string | null; // resolved source-triangle vertex NOT in the midpoint's parents {A,B}
  medialCycle: string[]; // the generated core-face's midpoint cycle (= its vertexIds)
  // face-coherence / vertex-figure detail (candidateApexes, opposite, degree, …) — P3
}

export interface SiteIncidenceReading {
  scopedVertexId: string; // = support (spec §2 scope: cell-keyed midpoint id)
  parents: [string, string]; // createdBy.sourceVertexIds (A, B)
  label: string;
  readings: RelationalReading[];
  triangleTraceCount: number; // # face-mediation (= atomicRegistry's count; one-for-one)
  squareTraceCount: number; // # face-coherence
  vertexFigureCount: number; // # vertex-figure
}

export interface IncidenceTraceRegistryReport {
  method: 'incidence-trace-registry-v0';
  scope: 'incidence-only';
  semanticStatus: 'not-semantic-naming';
  shapeMutationStatus: 'not-shape-mutation';
  packetWriteStatus: 'not-packet-writing';
  cellBodies: GlobalSquareResolution[]; // P1 populates this
  sites: SiteIncidenceReading[]; // P2 populates this
  // P4 adds targetTally — additive, do not add now
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

function compareById(a: Face, b: Face): number {
  return a.id.localeCompare(b.id);
}

// Cell-scoped source-face resolution: the core-face's sourceCellId -> that
// cell's parentCellId -> the parent cell's faces, matched by `id === sourceFaceId`
// OR `sourceFaceId === sourceFaceId`. Mirrors
// atomicRegistry.findScopedSourceFaceCandidates read-only.
function findScopedSourceFaceCandidates(
  generatedFace: Face,
  sourceFaceId: string,
  faceById: Map<string, Face>,
  cellById: Map<string, Cell>,
): Face[] {
  if (!generatedFace.sourceCellId) {
    return [];
  }
  const contextCell = cellById.get(generatedFace.sourceCellId);
  const parentCell = contextCell?.parentCellId ? cellById.get(contextCell.parentCellId) : undefined;
  if (!parentCell) {
    return [];
  }
  return parentCell.faceIds
    .map((faceId) => faceById.get(faceId))
    .filter(
      (face): face is Face =>
        Boolean(face) && (face!.id === sourceFaceId || face!.sourceFaceId === sourceFaceId),
    )
    .sort(compareById);
}

// Cell-scoped first, then a global fallback (any face with that literal id, or
// any `parent-cell-face` back-referencing it). Mirrors
// atomicRegistry.findSourceFaceCandidates read-only.
function findSourceFaceCandidates(
  shape: Shape,
  generatedFace: Face,
  sourceFaceId: string,
  faceById: Map<string, Face>,
  cellById: Map<string, Cell>,
): Face[] {
  const scoped = findScopedSourceFaceCandidates(generatedFace, sourceFaceId, faceById, cellById);
  if (scoped.length) {
    return scoped;
  }
  return shape.faces
    .filter(
      (face) =>
        face.id === sourceFaceId ||
        (face.role === 'parent-cell-face' && face.sourceFaceId === sourceFaceId),
    )
    .sort(compareById);
}

// The per-site relational-reading layer (P2). For each scoped midpoint, emit one
// RelationalReading per dissection-core-face containing it, classified by the
// derivation-aware taxonomy; the face-mediation (Trace△) member is fully
// populated. Honesty: every context is graded and counted; no context is
// silently dropped; an apex is never fabricated.
function buildSiteReadings(shape: Shape, issues: string[]): SiteIncidenceReading[] {
  const faceById = new Map<string, Face>(shape.faces.map((face) => [face.id, face]));
  const cellById = new Map<string, Cell>(shape.cells.map((cell) => [cell.id, cell]));

  // Scoped midpoints: ambo-dissection vertices with exactly two parents (A, B).
  const midpoints = Object.values(shape.vertices).filter(
    (vertex) =>
      vertex.createdBy.operation === 'ambo-dissection' &&
      vertex.createdBy.sourceVertexIds.length === 2,
  );

  const sites: SiteIncidenceReading[] = [];

  for (const midpoint of midpoints) {
    const parents: [string, string] = [
      midpoint.createdBy.sourceVertexIds[0],
      midpoint.createdBy.sourceVertexIds[1],
    ];
    const parentSet = new Set<string>(parents);

    const coreFaces = shape.faces
      .filter(
        (face) => face.role === 'dissection-core-face' && face.vertexIds.includes(midpoint.id),
      )
      .sort(compareById);

    const readings: RelationalReading[] = [];

    for (const face of coreFaces) {
      const hasSourceFace = Boolean(face.sourceFaceId);
      const hasSourceVertex = Boolean(face.sourceVertexId);
      const medialCycle = [...face.vertexIds];

      // Spec §3: a dissection-core-face carries EXACTLY ONE of the two refs.
      // Anything else is anomalous structure — surface it loudly, never guess
      // the derivation (size cannot disambiguate face vs vertex).
      if (hasSourceFace && hasSourceVertex) {
        issues.push(
          `dissection-core-face ${face.id} carries BOTH sourceFaceId and sourceVertexId (expected exactly one); not classified`,
        );
        continue;
      }
      if (!hasSourceFace && !hasSourceVertex) {
        issues.push(
          `dissection-core-face ${face.id} carries NEITHER sourceFaceId nor sourceVertexId (expected exactly one); not classified`,
        );
        continue;
      }

      if (hasSourceVertex) {
        readings.push({
          support: midpoint.id,
          generatedFaceId: face.id,
          sourceFaceId: null,
          sourceVertexId: face.sourceVertexId ?? null,
          contextKind: 'vertex-figure',
          apex: null,
          medialCycle,
        });
        continue;
      }

      // Source-face-medial: classify by the RESOLVED source face's polygon size.
      const sourceFaceId = face.sourceFaceId as string;
      const candidates = findSourceFaceCandidates(shape, face, sourceFaceId, faceById, cellById);
      const sourceFace = candidates.length === 1 ? candidates[0] : null;

      let sourceSize: number;
      if (sourceFace) {
        sourceSize = sourceFace.vertexIds.length;
      } else {
        // Unresolvable back-reference (0 or >1 candidates). Do not drop; surface
        // it, and fall back to the generated core-face's own size so the context
        // is still recorded. (Never observed on the seed g1 shapes.)
        issues.push(
          `dissection-core-face ${face.id}: source face ${sourceFaceId} unresolved (${candidates.length} candidates); contextKind classified by generated-face size as fallback`,
        );
        sourceSize = face.vertexIds.length;
      }

      const contextKind: ContextKind =
        sourceSize === 3 ? 'face-mediation' : sourceSize === 4 ? 'face-coherence' : 'face-coherence-n';

      let apex: string | null = null;
      if (contextKind === 'face-mediation') {
        if (sourceFace) {
          const apexCandidates = sourceFace.vertexIds.filter((vertexId) => !parentSet.has(vertexId));
          if (apexCandidates.length === 1) {
            apex = apexCandidates[0];
          } else {
            issues.push(
              `dissection-core-face ${face.id}: face-mediation source triangle ${sourceFaceId} has ${apexCandidates.length} vertices outside {A,B} (expected 1); apex=null`,
            );
          }
        } else {
          issues.push(
            `dissection-core-face ${face.id}: face-mediation apex unresolved (source face ${sourceFaceId} not resolved); apex=null`,
          );
        }
      }

      readings.push({
        support: midpoint.id,
        generatedFaceId: face.id,
        sourceFaceId,
        sourceVertexId: null,
        contextKind,
        apex,
        medialCycle,
      });
    }

    readings.sort((a, b) => a.generatedFaceId.localeCompare(b.generatedFaceId));

    sites.push({
      scopedVertexId: midpoint.id,
      parents,
      label: midpoint.data.label,
      readings,
      triangleTraceCount: readings.filter((r) => r.contextKind === 'face-mediation').length,
      squareTraceCount: readings.filter((r) => r.contextKind === 'face-coherence').length,
      vertexFigureCount: readings.filter((r) => r.contextKind === 'vertex-figure').length,
    });
  }

  sites.sort((a, b) => a.scopedVertexId.localeCompare(b.scopedVertexId));
  return sites;
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

  const sites = buildSiteReadings(shape, issues);

  return {
    method: 'incidence-trace-registry-v0',
    scope: 'incidence-only',
    semanticStatus: 'not-semantic-naming',
    shapeMutationStatus: 'not-shape-mutation',
    packetWriteStatus: 'not-packet-writing',
    cellBodies,
    sites,
    issues,
  };
}

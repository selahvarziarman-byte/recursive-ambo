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
//        face-mediation member (Trace△ = apex + medialCycle) fully populated.
//   P3 — the per-reading DETAIL for the two non-mediation families (researcher
//        ruling 2026-06-19): face-coherence (Trace□ candidateApexes / opposite /
//        routes + the Coh□ certificate — resolution DEFERRED one generation UP
//        to the SOURCE square's diagonalization, decoupled from this cell's GSR)
//        and vertex-figure (degree + the deg-4 link to this cell's
//        GlobalSquareResolution cellBody). GlueCoh (per-site manifold sanity)
//        and face-coherence-n (n>4) detail are still DEFERRED.
//   P4 — the per-target tally (`targetTally`, spec §5): an aggregate over all
//        sites[].readings (a generated-face-size histogram + the size tallies +
//        derivation-based candidate counts + the legacy-atomic-registry drop
//        count) PLUS the PURE-LINEAGE B-twin group count (primal-multiset key;
//        coincidence/position is the §7 heuristic, NOT the criterion). GlueCoh
//        (per-site manifold sanity) remains a separate later prompt.
// The report is shaped so each layer is added by ADDING a field, never by
// reshaping.
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

// P3 — Coh□ certificate (spec §3). The local square certificate is NEVER
// "incoherent"/"fail": it is `two-candidate-apexes` (normal — the two apexes are
// apex-symmetric; no edge-symmetric local rule prefers one) or `degenerate-square`
// (named; source not a clean 4-cycle / C==D — never observed). The apex-pair's
// resolution is DEFERRED one generation UP, to diagonalizing the SOURCE square
// (Trace□ → Trace△); it is decoupled from this cell's vertex-figure GSR.
export interface CohCertificate {
  status: 'two-candidate-apexes' | 'degenerate-square';
  resolution: 'deferred-to-source-square-diagonalization';
}

export interface RelationalReading {
  support: string; // scoped midpoint id (M_AB)
  generatedFaceId: string; // the dissection-core-face this reading is read through
  sourceFaceId: string | null; // back-reference; set for face-* kinds
  sourceVertexId: string | null; // set for vertex-figure
  contextKind: ContextKind;
  // face-mediation (Trace△) — FULLY populated in P2:
  apex: string | null; // resolved source-triangle vertex NOT in the midpoint's parents {A,B}
  medialCycle: string[]; // the generated core-face's midpoint cycle (= its vertexIds)
  // face-coherence (Trace□ + Coh□) — populated in P3 (null for all other kinds):
  candidateApexes: string[] | null; // {C,D} — the two source-square vertices NOT in {A,B}
  opposite: string | null; // generated midpoint of source edge C–D (∈ medialCycle)
  routes: [string[], string[]] | null; // boundary paths [[A,B,C],[A,D,C]] as source-vertex ids
  coh: CohCertificate | null; // the local square certificate
  // vertex-figure — populated in P3 (null for all other kinds):
  degree: number | null; // the vertex-figure face's vertex count (= source-vertex degree)
  globalSquareResolutionLink: string | null; // deg-4 only: host cell's GlobalSquareResolution cellId
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

// P4 — the per-target tally (spec §5). An aggregate over ALL sites[].readings,
// plus the pure-lineage B-twin count. The SIZE tallies (triangle/squareContext
// + the histogram) read the GENERATED-face size (medialCycle.length); the
// candidate*Readings count by DERIVATION (contextKind) and are intentionally
// distinct — they coincide on the octahedron, diverge on tetra/cube. The
// registry NEVER collapses B-twins (bTwinCollapsePolicy is the literal 'none').
export interface TargetTally {
  targetMidpointCount: number; // = sites.length
  triangleContextCount: number; // # readings with generated-face SIZE 3 (= contextsByGeneratedFaceSize[3])
  squareContextCount: number; // # readings with generated-face SIZE 4 (= contextsByGeneratedFaceSize[4])
  contextsByGeneratedFaceSize: Record<number, number>; // histogram: medialCycle.length -> # readings
  contextsDroppedByLegacyAtomicRegistry: number; // = #face-coherence + #vertex-figure readings (researcher ruling)
  candidateTriangleReadings: number; // # face-mediation readings (DERIVATION; 1-apex Trace△ each)
  candidateSquareReadings: number; // # face-coherence readings (DERIVATION; counted ONCE/reading — both apexes live in the single Coh□)
  bTwinGroupsSeen: number; // # lineage-classes with >=2 distinct scoped sites (PURE LINEAGE)
  bTwinCollapsePolicy: 'none'; // literal — the registry never collapses B-twins
}

export interface IncidenceTraceRegistryReport {
  method: 'incidence-trace-registry-v0';
  scope: 'incidence-only';
  semanticStatus: 'not-semantic-naming';
  shapeMutationStatus: 'not-shape-mutation';
  packetWriteStatus: 'not-packet-writing';
  cellBodies: GlobalSquareResolution[]; // P1 populates this
  sites: SiteIncidenceReading[]; // P2 populates this
  targetTally: TargetTally; // P4 populates this
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

// The researcher's ruled Coh□ resolution: the apex-pair resolves one generation
// UP, by diagonalizing the SOURCE square (Trace□ → Trace△). NOT this cell's GSR.
const COH_RESOLUTION = 'deferred-to-source-square-diagonalization' as const;

// P3 face-coherence (Trace□ + Coh□) detail. `sourceFace` is the RESOLVED source
// square (its vertexIds are the 4 corners in cyclic order); `parents` = {A,B},
// a cyclic-adjacent corner pair. Returns candidateApexes {C,D}, opposite =
// mid(C,D), routes [[A,B,C],[A,D,C]], and the Coh□ certificate. Any structural
// surprise (unresolved / non-4-cycle / parents not an edge / missing opposite)
// is surfaced via issues[] and graded `degenerate-square` — never fabricated.
function faceCoherenceDetail(
  sourceFace: Face | null,
  parents: [string, string],
  medialCycle: string[],
  shape: Shape,
  issues: string[],
  faceId: string,
): {
  candidateApexes: string[] | null;
  opposite: string | null;
  routes: [string[], string[]] | null;
  coh: CohCertificate;
} {
  const degenerate = (note: string) => {
    issues.push(`dissection-core-face ${faceId}: ${note}`);
    return {
      candidateApexes: null,
      opposite: null,
      routes: null,
      coh: { status: 'degenerate-square' as const, resolution: COH_RESOLUTION },
    };
  };

  if (!sourceFace || sourceFace.vertexIds.length !== 4) {
    return degenerate(
      `face-coherence source square ${sourceFace ? `${sourceFace.id} is a ${sourceFace.vertexIds.length}-gon` : 'did not resolve'} (expected a 4-cycle)`,
    );
  }
  const square = sourceFace.vertexIds;
  if (new Set(square).size !== 4) {
    return degenerate(`face-coherence source square ${sourceFace.id} is not a clean 4-cycle (repeated vertex)`);
  }

  const [a, b] = parents;
  const indexOfA = square.indexOf(a);
  if (indexOfA < 0) {
    return degenerate(`face-coherence parent ${a} is not a corner of source square ${sourceFace.id}`);
  }
  // Rotate the cycle to start at A; A's neighbours are square'[1] and square'[3].
  const rotated = [0, 1, 2, 3].map((k) => square[(indexOfA + k) % 4]);
  let c: string;
  let d: string;
  if (b === rotated[1]) {
    c = rotated[2]; // diagonal to A
    d = rotated[3];
  } else if (b === rotated[3]) {
    c = rotated[2];
    d = rotated[1];
  } else {
    return degenerate(
      `face-coherence parents {${a},${b}} are not a cyclic-adjacent edge of source square ${sourceFace.id}`,
    );
  }
  if (c === d) {
    return degenerate(`face-coherence candidate apexes collapsed (C==D) on source square ${sourceFace.id}`);
  }

  const candidateApexes = [c, d];
  // Cell-scoped: opposite = mid(C,D) drawn from THIS face's own medialCycle (the
  // four midpoints of this source square), so it can never resolve to another
  // cell's midpoint that shares the {C,D} parent-pair (engineer fix, finding #1).
  const cdKey = canonicalEdgeKey(c, d);
  const opposite =
    medialCycle.find((m) => {
      const sv = shape.vertices[m]?.createdBy.sourceVertexIds;
      return Array.isArray(sv) && sv.length === 2 && canonicalEdgeKey(sv[0], sv[1]) === cdKey;
    }) ?? null;
  if (!opposite) {
    issues.push(
      `dissection-core-face ${faceId}: face-coherence opposite mid(${c},${d}) not found in this face's medialCycle`,
    );
  }
  const routes: [string[], string[]] = [
    [a, b, c],
    [a, d, c],
  ];
  return {
    candidateApexes,
    opposite,
    routes,
    coh: { status: 'two-candidate-apexes', resolution: COH_RESOLUTION },
  };
}

// The per-site relational-reading layer (P2 spine + P3 detail). For each scoped
// midpoint, emit one RelationalReading per dissection-core-face containing it,
// classified by the derivation-aware taxonomy; face-mediation (Trace△),
// face-coherence (Trace□ + Coh□), and vertex-figure detail are populated.
// Honesty: every context is graded and counted; no context is silently dropped;
// nothing (apex, apex-pair, opposite) is fabricated.
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
        const degree = medialCycle.length; // = vertex-figure face vertex count = source-vertex degree
        readings.push({
          support: midpoint.id,
          generatedFaceId: face.id,
          sourceFaceId: null,
          sourceVertexId: face.sourceVertexId ?? null,
          contextKind: 'vertex-figure',
          apex: null,
          medialCycle,
          candidateApexes: null,
          opposite: null,
          routes: null,
          coh: null,
          degree,
          // deg-4 vertex-figure links to its host cell's GlobalSquareResolution
          // (P1 cellBody): the in-cell diagonal policy. The face's sourceCellId
          // is that core cell, == one of report.cellBodies[].cellId.
          globalSquareResolutionLink: degree === 4 ? (face.sourceCellId ?? null) : null,
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

      // P3 face-coherence (Trace□ + Coh□) detail; null for face-mediation and
      // face-coherence-n (n>4 detail deferred).
      let candidateApexes: string[] | null = null;
      let opposite: string | null = null;
      let routes: [string[], string[]] | null = null;
      let coh: CohCertificate | null = null;
      if (contextKind === 'face-coherence') {
        const detail = faceCoherenceDetail(sourceFace, parents, medialCycle, shape, issues, face.id);
        candidateApexes = detail.candidateApexes;
        opposite = detail.opposite;
        routes = detail.routes;
        coh = detail.coh;
      }

      readings.push({
        support: midpoint.id,
        generatedFaceId: face.id,
        sourceFaceId,
        sourceVertexId: null,
        contextKind,
        apex,
        medialCycle,
        candidateApexes,
        opposite,
        routes,
        coh,
        degree: null,
        globalSquareResolutionLink: null,
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

// PURE-LINEAGE B-twin key (spec §5 as ruled 2026-06-19). The lineage of a vertex
// is its PRIMAL MULTISET: the multiset (with multiplicity) of its seed/source-less
// ancestors, gathered by recursing createdBy.sourceVertexIds. A source-less vertex
// (a seed, or any vertex with no sources) is its own primal with multiplicity 1;
// otherwise the multiset-union over its sources. Position/coincidence is the §7
// heuristic and is deliberately NOT consulted here. Memoized over a shared map;
// lineage is a DAG so each vertex resolves once. Returned maps are never mutated
// by callers (parents union into a fresh map), so sharing the memo is safe.
function primalMultiset(
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
function primalMultisetKey(multiset: Map<string, number>): string {
  return [...multiset.entries()]
    .map(([primal, count]) => `${primal}×${count}`)
    .sort()
    .join('|');
}

// P4 — the per-target tally (spec §5). Aggregates over ALL sites[].readings: a
// generated-face-SIZE histogram (medialCycle.length) with its size tallies, the
// DERIVATION-based candidate counts (by contextKind), and the count the legacy
// atomic registry drops (face-coherence + vertex-figure). Plus the PURE-LINEAGE
// B-twin group count. Every reading is counted exactly once; an unknown
// contextKind is surfaced via issues[], never silently dropped.
function buildTargetTally(
  shape: Shape,
  sites: SiteIncidenceReading[],
  issues: string[],
): TargetTally {
  const contextsByGeneratedFaceSize: Record<number, number> = {};
  let faceMediation = 0;
  let faceCoherence = 0;
  let vertexFigure = 0;

  for (const site of sites) {
    for (const reading of site.readings) {
      const size = reading.medialCycle.length;
      contextsByGeneratedFaceSize[size] = (contextsByGeneratedFaceSize[size] ?? 0) + 1;
      switch (reading.contextKind) {
        case 'face-mediation':
          faceMediation += 1;
          break;
        case 'face-coherence':
          faceCoherence += 1;
          break;
        case 'vertex-figure':
          vertexFigure += 1;
          break;
        case 'face-coherence-n':
          break; // a valid family, but neither a candidate*Reading nor a legacy drop
        default:
          issues.push(
            `reading ${reading.support}/${reading.generatedFaceId}: unknown contextKind '${String(
              reading.contextKind,
            )}' (not one of the four); not tallied by derivation`,
          );
      }
    }
  }

  // PURE-LINEAGE B-twin grouping: group scoped sites by primal-multiset key; a
  // B-twin group is a lineage-class holding >= 2 distinct scoped site ids (sites
  // are already scope-distinct, so class size == # distinct site ids).
  const memo = new Map<string, Map<string, number>>();
  const sitesByLineage = new Map<string, Set<string>>();
  for (const site of sites) {
    const key = primalMultisetKey(primalMultiset(site.scopedVertexId, shape, memo));
    let bucket = sitesByLineage.get(key);
    if (!bucket) {
      bucket = new Set<string>();
      sitesByLineage.set(key, bucket);
    }
    bucket.add(site.scopedVertexId);
  }
  let bTwinGroupsSeen = 0;
  for (const ids of sitesByLineage.values()) {
    if (ids.size >= 2) {
      bTwinGroupsSeen += 1;
    }
  }

  return {
    targetMidpointCount: sites.length,
    triangleContextCount: contextsByGeneratedFaceSize[3] ?? 0,
    squareContextCount: contextsByGeneratedFaceSize[4] ?? 0,
    contextsByGeneratedFaceSize,
    contextsDroppedByLegacyAtomicRegistry: faceCoherence + vertexFigure,
    candidateTriangleReadings: faceMediation,
    candidateSquareReadings: faceCoherence,
    bTwinGroupsSeen,
    bTwinCollapsePolicy: 'none',
  };
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
  const targetTally = buildTargetTally(shape, sites, issues);

  return {
    method: 'incidence-trace-registry-v0',
    scope: 'incidence-only',
    semanticStatus: 'not-semantic-naming',
    shapeMutationStatus: 'not-shape-mutation',
    packetWriteStatus: 'not-packet-writing',
    cellBodies,
    sites,
    targetTally,
    issues,
  };
}

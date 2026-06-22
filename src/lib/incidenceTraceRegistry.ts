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
//        sites[].readings. As ruled 2026-06-19 (§A), SIZE and DERIVATION are
//        SEPARATE axes: `coreFaceSizeCensus` ("<n>gon" -> count) is the raw size
//        cross-check, while the authoritative DERIVATION triple is
//        candidateTriangleReadings + candidateSquareReadings + vertexFigureCount.
//        Also the PURE-LINEAGE B-twin group count (primal-multiset key;
//        coincidence/position is the §7 heuristic, NOT the criterion).
//   P5 — §A the `coreFaceSizeCensus` rename above (size tallies no longer
//        masquerade as derivation counts), and §B `glueCoh`: the per-site
//        MANIFOLD gate (researcher ruling — the broken §3 overlap clause is
//        replaced by the vertex-LINK-is-a-single-cycle test). With P5 the
//        registry covers spec §5 in full. face-coherence-n (n>4) detail is the
//        only remaining DEFERRED item.
//   P7 — charter layer (1): `glueCoh` is UPGRADED from a boolean manifold gate
//        into a DECOMPOSER (signed-pull-back junction charter §1/§2). The same
//        vertex-link adjacency is partitioned by the pure, exported
//        `decomposeLink` into strata (manifold pieces walled at junctions),
//        junction loci (degree>2 branches), and a `pinch` flag (>1 component),
//        yielding a FOUR-VALUED `valence` (no-context / boundary / interior /
//        junction). The old binary `non-manifold-overlap` status — which fused
//        valence-1 boundary (a legal bounded manifold) with valence->2 junction —
//        is RETIRED. A junction is a NORMAL RECORDED outcome
//        (instruments-not-guards), never an issues[] anomaly. The through-pairing
//        ACROSS a junction is DEFERRED (charter §4 — hook only, no policy).
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
// Lineage is the CANONICAL single-source primitive (src/lib/lineage.ts) — the
// registry's B-twin grouping key and the ledger's homogeneity criterion share it
// so the two never drift. Moved here, not re-derived.
import { primalMultiset, primalMultisetKey } from './lineage';

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

// P5 §B / P7 — GlueCoh, the per-site MANIFOLD gate, UPGRADED into a DECOMPOSER
// (signed-pull-back junction charter §1/§2). The original §3 clause
// `medial(R) ∩ medial(S) = {M_AB}` was BROKEN (adjacent faces in a manifold fan
// legitimately share the site + the next fan-vertex); the real test reads the
// site's vertex LINK. P7 generalizes the single boolean into a PARTITION of that
// link, read directly off the adjacency graph (policy-free):
//   - a STRATUM is a maximal connected manifold piece, walled off at junctions
//     (the link cut at its junction loci — a junction is a WALL; the stratum
//     stops there). `closed` = a single cycle (all internal degree 2); else a
//     bounded arc (degree-1 ends).
//   - a JUNCTION LOCUS is a degree>2 link-vertex (a branch); a PINCH is a link
//     with >1 connected component (a multi-sheet vertex-junction).
//   - `valence` is the FOUR-VALUED site classification (charter §2): no-context
//     (0 contexts) / boundary (a free arc, valence 1 — kept MANIFOLD) / interior
//     (one closed cycle, valence 2) / junction (any degree>2 locus OR pinch).
// `status` is NAMED, never a bare failure: 'no-core-context' is a retired
// midpoint (its core-faces consumed by a later generation — the gate does not
// apply). The old binary 'non-manifold-overlap' is RETIRED: it fused valence-1
// boundary (a legal bounded manifold) with valence->2 junction. A junction is a
// NORMAL RECORDED outcome (instruments-not-guards), NOT an issues[] anomaly.
export type LinkValence = 'no-context' | 'boundary' | 'interior' | 'junction';

export interface LinkStratum {
  vertices: string[]; // the stratum's link-vertices, sorted
  closed: boolean; // single cycle (all internal degree 2) vs bounded arc (degree-1 ends)
}

export interface JunctionLocus {
  at: string; // the degree>2 link-vertex (a branch junction)
  degree: number; // # sheets meeting there (= the link-vertex degree)
}

// The pure decomposition of a vertex link, read off the adjacency graph ALONE.
export interface LinkDecomposition {
  strata: LinkStratum[]; // connected manifold pieces, walled at the junction loci
  junctionLoci: JunctionLocus[]; // degree>2 link-vertices (branch junctions), sorted by `at`
  pinch: boolean; // the link has >1 connected component (a multi-sheet vertex-junction)
  valence: LinkValence; // four-valued site classification (charter §2)
  // THE HOOK (charter §4 — DEFERRED): threading sheets THROUGH a degree-d junction
  // is the (d−1)!! sheet-matching = GlobalSquareResolution one valence up, built
  // only on named-material pressure. Strata are WALLED, never threaded — no
  // pairing policy is authored here. See the charter §4 deferral.
  throughPairingStatus: 'deferred';
}

export interface SiteGlueCoh {
  contextCount: number; // # incident dissection-core-faces (= readings.length)
  linkVertexCount: number; // # distinct vertices in the link
  linkIsSingleCycle: boolean; // back-compat: === (valence === 'interior')
  strata: LinkStratum[]; // P7 — the link's manifold pieces (walled at junctions)
  junctionLoci: JunctionLocus[]; // P7 — degree>2 branch loci
  pinch: boolean; // P7 — >1 link component (a multi-sheet vertex-junction)
  valence: LinkValence; // P7 — four-valued (no-context/boundary/interior/junction)
  status: 'glued' | 'boundary' | 'junction' | 'no-core-context';
}

export interface SiteIncidenceReading {
  scopedVertexId: string; // = support (spec §2 scope: cell-keyed midpoint id)
  parents: [string, string]; // createdBy.sourceVertexIds (A, B)
  label: string;
  readings: RelationalReading[];
  triangleTraceCount: number; // # face-mediation (= atomicRegistry's count; one-for-one)
  squareTraceCount: number; // # face-coherence
  vertexFigureCount: number; // # vertex-figure
  glueCoh: SiteGlueCoh; // P5 §B — the per-site manifold (vertex-link-cycle) gate
}

// P4 — the per-target tally (spec §5), as RULED by the researcher 2026-06-19
// (§A size-census ruling): SIZE and DERIVATION are different axes and must not be
// conflated. `coreFaceSizeCensus` is a raw generated-face-SIZE cross-check
// (medialCycle.length). The AUTHORITATIVE accounting is the DERIVATION triple —
// candidateTriangleReadings (face-mediation) + candidateSquareReadings
// (face-coherence) + vertexFigureCount — which partitions the readings by which
// constructor made each context. Their divergence (e.g. s2
// coreFaceSizeCensus["4gon"]=24 vs candidateSquareReadings=0) is the intended
// self-test that the classifier is NOT silently falling back to polygon size.
// The registry NEVER collapses B-twins (bTwinCollapsePolicy is the literal 'none').
export interface TargetTally {
  targetMidpointCount: number; // = sites.length
  coreFaceSizeCensus: Record<string, number>; // SIZE cross-check: "<n>gon" -> # readings with medialCycle.length === n
  candidateTriangleReadings: number; // DERIVATION: # face-mediation readings (1-apex Trace△ each)
  candidateSquareReadings: number; // DERIVATION: # face-coherence readings (counted ONCE/reading — both apexes live in the single Coh□)
  vertexFigureCount: number; // DERIVATION: # vertex-figure readings (completes the triple)
  contextsDroppedByLegacyAtomicRegistry: number; // = candidateSquareReadings + vertexFigureCount (researcher ruling)
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

// P7 — the PURE decomposer (signed-pull-back junction charter §1). Operates on a
// vertex-link adjacency graph ALONE: no shape, no readings, no naming. Reads three
// things directly off the graph (policy-free) — per-vertex degree, the connected
// components, and the components AFTER cutting at junction loci — and emits the
// partition. A junction is a WALL: cutting removes the degree>2 loci (and their
// incident edges), so each remaining component is a stratum that stops at the
// wall. `closed` = a single cycle (every in-stratum degree 2); else a bounded arc.
// `pinch` is measured on the FULL graph (>1 component). The four-valued `valence`
// follows charter §2. Nothing is chosen; nothing throws.
//
// INTERIOR = the topological circle test: link `= S¹` ⟺ every link-vertex has
// degree exactly 2 AND there is one connected component — a single cycle at ANY
// length ≥ 1 (a self-loop S¹ length 1, a bigon length 2, a triangle/square length
// ≥ 3). The earlier `≥ 3`-vertex floor was a SIMPLICIAL ARTIFACT: a simplicial
// complex cannot realize a 2-cycle, so "≥ 3" was a correct proxy for "is a cycle"
// only on simplicial surfaces. This engine is a CW complex, and module quotients
// realize minimal cell structures whose links are bigons / self-loops — legitimate
// `S¹`s. Per the researcher's level-2 bigon ruling, the floor is retired in favour
// of the topological single-cycle test (this is the `S¹` member of the
// dimension-indexed classifier; the level-1 `classifyLevel1Link` already tests the
// `S⁰` degree directly with no count floor — the one uniform `Sⁿ⁻¹` principle).
export function decomposeLink(adjacency: Map<string, string[]>): LinkDecomposition {
  const vertices = [...adjacency.keys()];
  const n = vertices.length;
  const degreeOf = (v: string): number => (adjacency.get(v) ?? []).length;

  // Junction loci: degree>2 link-vertices (branch junctions), sorted by `at`.
  const junctionLoci: JunctionLocus[] = vertices
    .filter((v) => degreeOf(v) > 2)
    .map((v) => ({ at: v, degree: degreeOf(v) }))
    .sort((a, b) => a.at.localeCompare(b.at));
  const junctionSet = new Set<string>(junctionLoci.map((locus) => locus.at));

  // pinch: the FULL link (nothing cut) has >1 connected component.
  const pinch = connectedComponents(adjacency, vertices, new Set<string>()).length > 1;

  // Strata: connected components of the link CUT at its junction loci. Excluding
  // the junction vertices walls the strata; the within-cut degree ignores edges to
  // a junction, so a fan-arm that was degree 2 becomes a degree-1-ended arc.
  const cutDegreeOf = (v: string): number =>
    (adjacency.get(v) ?? []).filter((w) => !junctionSet.has(w)).length;
  const strata: LinkStratum[] = connectedComponents(adjacency, vertices, junctionSet)
    .map((comp) => ({
      vertices: [...comp].sort((a, b) => a.localeCompare(b)),
      closed: comp.length > 0 && comp.every((v) => cutDegreeOf(v) === 2),
    }))
    .sort((a, b) => (a.vertices[0] ?? '').localeCompare(b.vertices[0] ?? ''));

  const allDegree2 = n > 0 && vertices.every((v) => degreeOf(v) === 2);

  let valence: LinkValence;
  if (n === 0) {
    valence = 'no-context'; // 0 contexts — no link formed
  } else if (junctionLoci.length > 0 || pinch) {
    valence = 'junction'; // a degree>2 branch OR a multi-sheet pinch
  } else if (allDegree2) {
    valence = 'interior'; // a single cycle S¹ at ANY length (degree-2, one component) — NO simplicial floor
  } else {
    valence = 'boundary'; // one component, a degree-1 end, no degree>2 (a free arc)
  }

  return { strata, junctionLoci, pinch, valence, throughPairingStatus: 'deferred' };
}

// Connected components over the adjacency graph, optionally EXCLUDING a set of
// vertices (and every edge incident to them). Excluded vertices are never visited
// and never traversed through — this is how the strata are walled at the junction
// loci. Returns one vertex-id array per component.
function connectedComponents(
  adjacency: Map<string, string[]>,
  vertices: string[],
  exclude: Set<string>,
): string[][] {
  const seen = new Set<string>(exclude);
  const components: string[][] = [];
  for (const start of vertices) {
    if (seen.has(start)) {
      continue;
    }
    const comp: string[] = [];
    const stack = [start];
    seen.add(start);
    while (stack.length) {
      const vertex = stack.pop() as string;
      comp.push(vertex);
      for (const neighbour of adjacency.get(vertex) ?? []) {
        if (!seen.has(neighbour)) {
          seen.add(neighbour);
          stack.push(neighbour);
        }
      }
    }
    components.push(comp);
  }
  return components;
}

// P7 — build the site's vertex-link adjacency exactly as before, then DECOMPOSE
// it. For each incident core-face's medialCycle, take the site M's two cyclic-
// adjacent neighbours and add ONE undirected link-edge between them (the link edge
// opposite M). `decomposeLink` reads the partition off that graph. `status` maps
// the four-valued valence: 0 contexts -> 'no-core-context' (retired midpoint);
// interior -> 'glued'; boundary -> 'boundary'; junction -> 'junction'. A junction
// is RECORDED in the decomposition, never flagged as an issues[] anomaly
// (instruments-not-guards). `linkIsSingleCycle` is kept for back-compat
// (=== interior).
function buildSiteGlueCoh(siteVertexId: string, readings: RelationalReading[]): SiteGlueCoh {
  const contextCount = readings.length;
  const adjacency = buildVertexLinkAdjacency(siteVertexId, readings);

  const linkVertexCount = adjacency.size;
  const decomposition = decomposeLink(adjacency);

  let status: SiteGlueCoh['status'];
  if (contextCount === 0) {
    status = 'no-core-context';
  } else if (decomposition.valence === 'interior') {
    status = 'glued';
  } else if (decomposition.valence === 'boundary') {
    status = 'boundary';
  } else if (decomposition.valence === 'junction') {
    status = 'junction';
  } else {
    // valence 'no-context' with contextCount > 0: every reading was degenerate
    // (M absent / cycle < 3), so no link formed. Not an anomaly — record as no
    // core context (defensive; the rigid substrate never produces it).
    status = 'no-core-context';
  }

  return {
    contextCount,
    linkVertexCount,
    linkIsSingleCycle: decomposition.valence === 'interior',
    strata: decomposition.strata,
    junctionLoci: decomposition.junctionLoci,
    pinch: decomposition.pinch,
    valence: decomposition.valence,
    status,
  };
}

// Build the site's vertex-link adjacency from its relational readings (extracted
// from buildSiteGlueCoh, behaviour-preserving). For each reading, take the site M's
// two cyclic-adjacent neighbours in the medialCycle and add ONE undirected link-edge
// between them (pushed as BOTH half-edges `prev↔next`). Multiplicity is preserved, so
// a non-manifold double-edge shows up as a degree > 2; the skip (`index < 0 ||
// cycle.length < 3`) drops M-absent / degenerate faces. Exported so the cascade
// driver can rebuild links on post-cascade material from the same construction.
export function buildVertexLinkAdjacency(
  siteVertexId: string,
  readings: RelationalReading[],
): Map<string, string[]> {
  // Adjacency with multiplicity (each reading pushes one undirected edge as two
  // half-edges) so a non-manifold double-edge shows up as a degree > 2.
  const adjacency = new Map<string, string[]>();
  const addHalfEdge = (from: string, to: string) => {
    const list = adjacency.get(from);
    if (list) {
      list.push(to);
    } else {
      adjacency.set(from, [to]);
    }
  };

  for (const reading of readings) {
    const cycle = reading.medialCycle;
    const index = cycle.indexOf(siteVertexId);
    if (index < 0 || cycle.length < 3) {
      continue; // M absent / degenerate face — contributes no link edge
    }
    const prev = cycle[(index - 1 + cycle.length) % cycle.length];
    const next = cycle[(index + 1) % cycle.length];
    addHalfEdge(prev, next);
    addHalfEdge(next, prev);
  }

  return adjacency;
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
      glueCoh: buildSiteGlueCoh(midpoint.id, readings),
    });
  }

  sites.sort((a, b) => a.scopedVertexId.localeCompare(b.scopedVertexId));
  return sites;
}

// P4 — the per-target tally (spec §5, §A size-census ruling). Aggregates over
// ALL sites[].readings: the generated-face-SIZE census ("<n>gon" -> count), the
// DERIVATION triple (face-mediation / face-coherence / vertex-figure by
// contextKind), and the count the legacy atomic registry drops (= face-coherence
// + vertex-figure). Plus the PURE-LINEAGE B-twin group count. Every reading is
// counted exactly once; an unknown contextKind is surfaced via issues[], never
// silently dropped. The census is a SIZE cross-check; the candidate*/vertexFigure
// counts are the DERIVATION semantics — their divergence is the intended self-test.
function buildTargetTally(
  shape: Shape,
  sites: SiteIncidenceReading[],
  issues: string[],
): TargetTally {
  const coreFaceSizeCensus: Record<string, number> = {};
  let faceMediation = 0;
  let faceCoherence = 0;
  let vertexFigure = 0;

  for (const site of sites) {
    for (const reading of site.readings) {
      const sizeKey = `${reading.medialCycle.length}gon`;
      coreFaceSizeCensus[sizeKey] = (coreFaceSizeCensus[sizeKey] ?? 0) + 1;
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
    coreFaceSizeCensus,
    candidateTriangleReadings: faceMediation,
    candidateSquareReadings: faceCoherence,
    vertexFigureCount: vertexFigure,
    contextsDroppedByLegacyAtomicRegistry: faceCoherence + vertexFigure,
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

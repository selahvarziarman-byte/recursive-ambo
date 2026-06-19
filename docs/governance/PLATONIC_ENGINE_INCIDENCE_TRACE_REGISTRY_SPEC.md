# PlatonicEngine — Incidence Trace & Square-Coherence Registry v0 (Canonical Build Surface)

Authored by: the researcher seat. Ratified + recorded by: mothership, 2026-06-17 (re-validated 06-18/19). Branch `team-arman`. Status: **ratified spec, build-pending — this is the engineer's authoritative build surface for Target 1.** Incidence-only; structural; asserts no names and no truths; certifies structure, never fabricates identity.

Report these status lines; do NOT use metatheory vocabulary:

```txt
method               = incidence-trace-registry-v0
scope                = incidence-only
semanticStatus       = not-semantic-naming
shapeMutationStatus  = not-shape-mutation
packetWriteStatus    = not-packet-writing
```

## 1. Purpose
Certify, from a `Shape` alone, the structure around each generated site: its identity, and how it is read through each face it lies in — including the square-coherence readings the legacy atomic registry is structurally blind to. A pure, read-only function over a `Shape`, returning a typed report with an `issues[]` array. Mutates nothing; names nothing.

## 2. Carried identity
```txt
carried site identity = scope × lineage
  scope   = cell-keyed makeMidpointVertexId (parentCellId | midpoint | canonicalEdgeKey) — INDIVIDUATES
  lineage = primal multiset / nested derivation tree — CLASSIFIES "same derivation"
            (injective VERIFIED to 62 leaves, proof OPEN → working foundation, not theorem)
```

## 3. The four members (per scoped site-in-face)
Recovery is single-source: for a scoped generated midpoint `M_AB`, inspect each `dissection-core-face` containing it; classify by face size; never silently drop.

```txt
Trace△^inc  (mediation — one edge, one apex).  M_AB in a TRIANGLE A,B,C:
    support=M_AB, sourceEdge=A—B (=createdBy.sourceVertexIds), apex=C (the source-face vertex NOT on A—B),
    generatedFaceId, sourceFaceId, medialCycle=[mid(A,B),mid(B,C),mid(C,A)].
    MUST reproduce the legacy atomicRegistry's supported 'edge-mediation-with-face-local-projection' reading
    ONE-FOR-ONE (a tetra-g1 midpoint has exactly 2 triangle contexts).

Trace□^inc  (coherence — one edge, two candidate apexes).  M_AB in a SQUARE A,B,C,D:
    support=M_AB, sourceEdge=A—B, candidateApexes={C,D} (the two source vertices NOT on A—B),
    opposite=mid(C,D), routes=(A→B→C, A→D→C), medialCycle=[mid(A,B),mid(B,C),mid(C,D),mid(D,A)] (4-cycle).
    This is the square half the legacy atomic registry DROPS (it filters on sourceFaceId; square core-faces
    carry sourceVertexId). contextKind otherwise → 'unsupported-context-size' (named, never erased).

Coh□^inc  (the local square certificate).  status ∈ { two-candidate-apexes (normal; resolution DEFERRED to
    GlobalSquareResolution — the two apexes are apex-symmetric, no edge-symmetric local rule can prefer one),
    degenerate-square (named; C==D or not a 4-cycle; never observed) }.  NEVER "incoherent" / "fail".

GlueCoh^inc  (manifold sanity).  Per site across its face-contexts: contextCount,
    status ∈ { glued, non-manifold-overlap }, localStarDistinct. Confirmatory — clause 3 is
    medial(R) ∩ medial(S) = {M_AB}; fires only on a degenerate/non-manifold generation the engine doesn't produce.
```

## 4. GlobalSquareResolution^inc (per cell/body policy layer)
Enumerate the coherent square-diagonal matchings of a cell, read-only (RE-DERIVE the search; do NOT call the pyritohedral module). One diagonal per square; keep an assignment iff (i) every cell vertex is hit exactly once (perfect vertex matching) AND (ii) no chosen diagonal key equals an existing cell-edge key. Report **policy-relative**:

```txt
cuboctahedron (12 V, 6 sq):  matchingCount = 2 (the pyritohedral chiral pair) → status = multiple.
                             ⇒ pyritohedral = perfect-matching + a chirality selection, NOT "the" matching.
rhombicuboctahedron (24 V, 18 sq):  precheck 2·18 ≠ 24 → not-applicable-by-count.
BINDING RULE: "no perfect matching" means ONLY "this named policy does not apply" — NEVER "no coherence."
```

## 5. Report contract (the schema the build implements)
```txt
per relational reading :  support (scopedVertexId), generatedFaceId, sourceFaceId, contextKind
   Trace△ : apex, medialCycle
   Trace□ : candidateApexes {C,D}, opposite, routes, medialCycle
   Coh□   : status ∈ { two-candidate-apexes, degenerate-square }
per site (gluing)      :  GlueCoh : contextCount, status ∈ { glued, non-manifold-overlap }, localStarDistinct
per target tally       :  targetMidpointCount, triangleContextCount, squareContextCount,
                          contextsByGeneratedFaceSize, contextsDroppedByLegacyAtomicRegistry,
                          candidateTriangleReadings, candidateSquareReadings, bTwinGroupsSeen,
                          bTwinCollapsePolicy = "none"
per cell/body          :  cellId, cellTopology, squareCount, vertexCount, traceSquareCount,
                          allSquaresHaveTwoCandidateApexes, resolutionPolicyId, policyPrecheckStatus,
                          diagonalChoiceCount, matchingCount, selectedMatching,
                          status ∈ { not-run, not-applicable-by-count, absent, unique, multiple, selected }
ordering               :  PER-SITE members are primary; GlobalSquareResolution is the per-cell/body policy layer.
```

## 6. Numbers the diagnostic must reproduce
```txt
- cuboctahedron core: 12 V, 6 squares, 8 triangles, 24 edges; coherent square-diagonal matchings = 2.
- Trace△ ONE-FOR-ONE with buildAtomicRegistryReport's supported reading on tetra-g1 midpoints (2 triangle contexts each).
- square-blindness = contextsDroppedByLegacyAtomicRegistry: the square contexts the atomic registry rejects as
  'non-triangular-context' are exactly the set Trace□ serves. (Report the scalar by computation; do not seal it against a guess.)
```

## 7. Open / bounded (do not inflate)
```txt
- multiset-injectivity general proof OPEN (working foundation; the certificate is operationally sound via
  decidable nested-tree comparison regardless — the open proof only bears on whether lineage-equality is the
  COMPLETE identity check).
- consistent-diagonal-assignment policy UNDEFINED (a named gap; not asserted).
- coincidence is a lineage-certified HEURISTIC, never the criterion (carries into the transformation-ledger law).
```

## 8. Build notes (mothership)
Ratified clean (no content corrections; the discipline — incidence-only, vocabulary-clean, honestly-graded — is part of the ratification). Build as a pure read-only sibling of `src/lib/siteWitnessCatalogueV0.ts`; the diagnostic copies `scripts/diagnose-site-witness-catalogue-v0.cjs` and requires the REAL module (anti-mock guard). The transformation operations are NOT part of this target.

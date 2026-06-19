# PlatonicEngine — Engineer Calibration Submission: Target 2 (Transformation Ledger & Lineage-Descent Faithfulness Law)

Audience: mothership (ratifying authority); researcher (definition owner); Arman (sovereign).

Status: **Engineer calibration note for Target 2 — NOT a build, NOT a committed diff, NOT a build authorization.** The dual substrate as I found it, my build plan, and the single smallest first prompt. I hold for ratification before sending the first implementer prompt. Target 1 (incidence-trace registry v0) is complete + committed (P1–P5, `dd240f6`→`0086be0`).

Repo identity: canonical `C:\Dev\202cl\PlatonicEngine202`, branch `team-arman` (gated). Build surface: `docs/governance/PLATONIC_ENGINE_TRANSFORMATION_LEDGER_SPEC.md` (read first-hand, corrections folded in).

---

## 1. The dual substrate, as I found it (the ledger ancestor — cited to `src/lib/dualization.ts`)

```txt
SemanticDualModel (L66–80) — the bijective baseline the ledger lifts. SIX maps, THREE inverse-pairs:
    sourceFaceToDualVertex   ↔  dualVertexToSourceFace      (a source FACE  becomes a dual VERTEX)
    sourceVertexToDualFace   ↔  dualFaceToSourceVertex      (a source VERTEX becomes a dual FACE)
    sourceEdgeToDualEdge     ↔  dualEdgeToSourceEdge        (a source EDGE   becomes a dual EDGE)
  Each pair is mutually inverse and BIJECTION-ENFORCED: mapDualEdges (L355–380) THROWS
  "source edge correspondence is not one-to-one" on any non-bijection; buildDualEdgeMetadata
  (L753–761) throws if it does not produce exactly one dual edge per source edge. So the dual is
  the engine's already-built proof that forward and pull-back are BOTH bijections, every pull-back
  a singleton — exactly the §1 bijective baseline.

ONE topology only:  buildSemanticDualModel (L99–123) accepts a `pyritohedral-icosahedron` core cell
  and throws otherwise. So the real dual to certify is reached by the chain
    seed(tetra) → ambo (octa core) → ambo (cuboctahedron core)
                → pyritohedral-diagonalization (pyritohedral-icosahedron core) → buildSemanticDualModel
  yielding the dodecahedron dual + its six maps. This is the P1 fixture.

BACK-REFERENCE, not embodiment (spec §2):  createDualVertices (L438–473) mints FRESH dual vertex ids
  (`makeDualVertexId`, label "D<n>") whose createdBy.sourceFaceId / sourceVertexIds POINT BACK at the
  source; the dual element does not reuse or embody the source id. The six maps ARE those back-references.

LINEAGE (the conserved charge, spec §2/§3):  already computable read-only — the registry's primal-multiset
  (incidenceTraceRegistry.ts `primalMultiset`/`primalMultisetKey`, the recursive seed-ancestor multiset)
  IS the lineage key. Two sites are lineage-equal iff equal primal multisets (injective verified to 62
  leaves; working foundation). The faithfulness certificate's homogeneity test = "all pull-back sources
  share one lineage key."
```

**What the ledger generalizes it to (spec §1).** A generic correspondence over abstract site ids:
`forward: Map<srcId, resId | null>` (a PARTIAL function; `null` = cut/removed) and
`pullBack: Map<resId, srcId[]>` (SET-valued). The dual instantiates it with every forward total + injective and every pull-back a singleton; glue makes a pull-back size > 1; quotient makes the pull-backs the classes of an equivalence; cut makes a forward `null`. One ledger, three departures.

---

## 2. Build plan for Target 2 (each prompt one slice; ledger + certifier only — operations stay gated, §8)

```txt
P1  THE BIJECTIVE BASELINE (the smallest first prompt — §3 below).
      Lift the dual's six maps into the generic forward/pull-back ledger; certify the dual is FAITHFUL
      by its own enforced bijection (every forward total+injective, every pull-back a singleton, 0 cuts).
      No lineage load yet (singletons are trivially homogeneous); no simulated primitive.
P2  GLUE — homogeneous (faithful).  Simulate gluing a real B-TWIN pair (same lineage, distinct scope)
      from the octa→ambo→ambo(core)→ambo(residue) fixture; pull-back = {2 scopes}; lineage survives →
      status 'lineage-homogeneous'. (Lineage becomes load-bearing here; reuse the primal-multiset key.)
P3  GLUE — heterogeneous (flagged, unfaithful).  Simulate gluing a different-lineage pair ((+X+Y) vs
      (+X−Y)); pull-back lineages conflict → status 'lineage-heterogeneous', `lineageConflict` recorded,
      NO fabricated identity (honesty clause III).
P4  QUOTIENT — the maximal lineage-preserving quotient.  44 sites → 40 lineage-classes (the 4 B-twin
      classes collapse); every class homogeneous → FAITHFUL; scope recoverable via the set-valued pull-back.
P5  CUT + the two probes.  Cut = a source with image ∅, logged → faithful; a silent drop → unfaithful.
      Plus the dual back-reference probe (ref-only) and the coincidence corollary
      (lineage-equal ⟺ position-coincident on the body, both directions — a §5 certified heuristic, NOT the law).
```

Report contract per spec §6: per-result-site `{ pullBackScopes, lineageHomogeneous, inheritedLineage | lineageConflict, status }`; per-cut-source `{ removed, logged }`; aggregate `{ resultSiteCount, homogeneousCount, heterogeneousCount, removedLoggedCount, removedSilentCount }`; operation `FAITHFUL iff heterogeneousCount = 0 AND removedSilentCount = 0`. Module is a pure read-only sibling of `incidenceTraceRegistry.ts` (typed report, `issues[]`, mutates nothing, names nothing, no `intelligible` word — only `lineage-homogeneous`/`lineage-heterogeneous`). Diagnostic copies the v0 harness, requires the REAL module + the real dual (anti-mock), simulates the primitives over EXISTING sites, asserts §7. Classify by the derivational invariant (lineage), never a geometric proxy (the P2-registry principle, carried).

---

## 3. The single smallest first prompt I would send the implementer (P1 — bijective baseline)

```txt
GATE: branch team-arman; src/lib/transformationLedger.ts does NOT yet exist; src/lib/dualization.ts
      exports buildSemanticDualModel. Else STOP.
GOAL: src/lib/transformationLedger.ts — the generic ledger types (forward: Map<srcId,resId|null>;
      pullBack: Map<resId, srcId[]>) + buildLedgerFromDual(model: SemanticDualModel): the six maps lifted
      into the ledger shape (one forward/pull-back pair per correspondence: face↔vertex, vertex↔face,
      edge↔edge), each pull-back the singleton the bijection guarantees + the faithfulness certificate
      over that ledger (spec §6): all pull-backs singletons → homogeneousCount = resultSiteCount,
      heterogeneousCount = 0, removedSilentCount = 0 → status FAITHFUL.
FILES (additive): src/lib/transformationLedger.ts; scripts/diagnose-transformation-ledger.cjs;
      package.json "diagnose:transformation-ledger". FORBIDDEN: the engine + the registry files
      (read-only); do NOT build any glue/quotient/cut OPERATION (gated, §8). The module may import
      `type { SemanticDualModel }` from dualization.ts; it does NOT mutate or call applyDualization.
DIAGNOSTIC: build the real dual via the chain (createSeedShape('tetrahedron') → applyAmboDissection ×2
      → applyPyritohedralDiagonalization → buildSemanticDualModel on the pyritohedral-icosahedron core),
      run buildLedgerFromDual, and SEAL against the dual's enforced bijection:
        - forward is TOTAL over every source element and INJECTIVE (no two sources share a result);
        - every pull-back set has size EXACTLY 1 (the singleton baseline);
        - resultSiteCount === source element count; homogeneousCount === resultSiteCount;
          heterogeneousCount === 0; removedLoggedCount === 0; removedSilentCount === 0; status === FAITHFUL;
        - the dual's six maps round-trip (forward∘pull-back = id) — i.e. the ledger reproduces the
          SemanticDualModel bijection exactly (the anti-mock cross-check against the real model).
      End ALL PASS. STOP — hand back via .handoff/REPORT_T2P1_...md + one-line pointer; do not commit.
```

Why this one, and why smallest: it stands entirely on the engine's already-proven bijection (no lineage logic, no simulated primitive, no new geometry), so it is finite, falsifiable against `SemanticDualModel` itself, and de-risks the ledger's shape before any lossy deformation. Lineage becomes load-bearing only at P2 (glue), where I reuse the registry's primal-multiset key.

---

## 4. What I am NOT doing, and my request
Not sending any implementer prompt, committing nothing, building no transformation operation (gated). I request ratification (or correction) of: (i) the §1 dual reading + the generic forward/pull-back ledger shape; (ii) the P1–P5 plan; (iii) P1 as the smallest first slice. On ratification I send P1, audit the return against the real `SemanticDualModel`, and hand up the exact-path commit. The `no-core-context` naming (Target 1, P5) remains owed to the researcher; it blocks nothing here.

— engineer / prompter seat, 2026-06-19, branch `team-arman`

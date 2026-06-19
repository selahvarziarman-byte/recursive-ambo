# PlatonicEngine — Major Campaign Nested Map (zoom): the Topological Module

Author: mothership, 2026-06-16, branch `team-arman`. This is the detailed zoom into the MAJOR campaign — the live frontier we are about to enter. It is the **forward-equivalent** of, and replaces, `PLATONIC_ENGINE_MINOR_CAMPAIGN_NESTED_MAP.md` (commit `60606a4`, 2026-06-14), whose subject — the Trisonized Midwife excavation prompt — was killed by experiment the same evening it was written (the method is DECORATION; bare structure is the lift). That zoom is retired; the minor campaign it detailed is built (see `PLATONIC_ENGINE_NESTED_TARGET_MAP_V2.md` §4). A campaign deserves a live zoom only while it is live; the live one is this.

Audience: the researcher and engineer who will work the major campaign, and the mothership who rules it. Grounded in the sovereign's canonical `PLATONIC_ENGINE_TOPOLOGICAL_MODULE_SPECIFICATION.md`, the engine code, the Ground Plan, and the closed verdicts. Nothing here authorizes a build: the **anti-monster gate (T0) still holds**. `[GATED]` = blocked behind T0; `[OPEN]` = unhit; `[OPEN-DESIGN]` = needed, mechanism unspecified; `[ANCESTOR]` = a working precedent exists in the engine to lift from.

---

## 0. The subject, in one sentence, and the cardinal law

> When named ambo/dual material is topologically transformed, what happens to the names, sites, dwellings, and concepts carried by that material?

The module is the **middle layer**: `ambo/dual universe (produces named material) -> TOPOLOGICAL MODULE (transforms it, with a ledger) -> semantic layer (interprets the consequences)`. It is **label-preserving** in one exact sense: it preserves a **correspondence/trace** of names through operations that may merge, duplicate, collapse, or destroy the underlying sites. "Preservation" = the ledger, **not** invariance of the labels — the whole value is recording *how* they change.

```txt
CARDINAL LAW (Ground Plan §4.5; Topo spec §6; Charter-adjacent):  CO-LOCATION IS NOT IDENTITY.
If four named vertices become one quotient support, the TOPOLOGY may say "one support," but the
SEMANTICS must still independently say whether the names are co-located, identified, fused, constrained,
conflicted, or rejected. The module records the structural EVENT first; meaning is INDUCED later, never guessed.
```

---

## 1. T0 — THE ENTRY GATE (anti-monster)   [GATED — this is the load-bearing discipline of the whole campaign]

```txt
RULE (Charter §9; Topo spec §11):  No topology branch may begin from general capability. It begins ONLY
  from a named-material PRESSURE produced by an intelligible generated event — i.e. on M7's importable object.
WHY IT IS THE HARDEST RULE HERE:  topology is the project's most seductive layer ("the real mathematics");
  the pull to just START is strong, and this campaign is the one nobody is above. An operation invented
  without a named site demanding it is a MONSTER; the ledger is meaningless if the operations are not forced
  by the material.
ENTRY CONDITIONS (all must hold):
  - the minor campaign has produced clean, named, honestly-signed material (M5 named workflow output);
  - that material is selectable & liftable as a named subcomplex with provenance (M7, the bridge);
  - the two sealed input-verifications are audited & disposed (composition engine-realization; confluence);
  - a CONCRETE topological question is raised BY the named material — not by the desire to do topology.
OPEN ON THE BRIDGE, NOT BEFORE IT — however much you want to begin.
```

---

## 2. T1 — IMPORT → LABELLED CELL COMPLEX   [OPEN] · [ANCESTOR]

```txt
WHAT (spec §3, §8 req 1-2):  imported ambo/dual material becomes a labelled cell complex — vertices=0-cells,
  edges=1-cells, faces=2-cells, higher cells when relevant. Each cell may carry names, concepts, dwellings,
  source-signatures, inherited relations. NAMED, not anonymous: a square is a SPECIFIC square from a specific
  ambo/dual object, carrying its vertices/edges/face-name/source-context/concepts.
ANCESTOR TO LIFT FROM (do not invent):
  - the Shape model already IS a labelled complex: cells carry kind/topology/generationDepth/lineage;
    vertices carry createdBy(parents,edge)+label+composite lineage; faces carry role+lineage. (types/geometry.ts)
  - the read-only DUAL CORRESPONDENCE (dualView.ts) is named in Ground Plan §3.2 as the designated IMPORT
    SOURCE for this workspace, and "imports begin as snapshots/provenance records" (Ground Plan §5.3).
IMPORT DISCIPLINE (Ground Plan §5.3, §3.2):  snapshot + provenance FIRST; no live link to the source Shape;
  topology state stays INDEPENDENT of Shape state (Ground Plan §6.3); do not mutate the source by default.
```

---

## 3. T2 — THE TOPOLOGICAL OPERATION SET   [OPEN]

```txt
THE SET (spec §4):  glue · cut · identify · fold · quotient · thicken · puncture · collapse · subdivide ·
  cylinder · torus · cover · boundary-extract · seam — each a transform of the labelled complex.
GROUNDING DISCIPLINE:  every operation must be FORCED by the named material (T0). The engine already shows
  two precedents of "transform structure while keeping a typed trace" — pyritohedral diagonalization (re-faces
  without birth) and dualization (rebuilds as the dual with a full correspondence). The topological operations
  are NEW, but the pattern (structure-transform + recorded correspondence) is native to this codebase.
DO NOT:  build a freeform topology UI before the semantics are clear (Charter §9; Ground Plan §6.3);
  add an operation no named site demands.
```

---

## 4. T3 — THE CORRESPONDENCE / TRANSFORMATION LEDGER   [OPEN] · [ANCESTOR] · the central artifact

```txt
WHAT (spec §5, §6.3):  the important output is NOT "a torus" — it is the BEFORE/AFTER ledger recording, for
  each named item, which cells:  survived · were identified · were duplicated · became boundaries · became
  seams · collapsed · became loops · reversed orientation · changed adjacency.
STATUS VOCABULARY (adopt from Ground Plan §5.4 for downstream semantic reads):  confirmed / candidate /
  unsupported / conflicted.
ANCESTOR — this is the campaign's biggest unclaimed asset:
  src/lib/dualization.ts already builds a COMPLETE BIDIRECTIONAL correspondence between two labelled complexes —
  the SemanticDualModel: sourceFace<->dualVertex, sourceVertex<->dualFace, sourceEdge<->dualEdge, with
  one-to-one-ness ENFORCED (it throws if the correspondence is not a bijection). That is a working, tested
  ledger for ONE operation (dualization). The major campaign generalizes it from a bijection to a
  MANY-TO-MANY transformation ledger (merge/duplicate/collapse) over the §4 operation set. Lift the data
  shape and the one-to-one-enforcement discipline; extend the relation type. Do not start from a blank page.
WHY IT IS THE HEART:  the ledger IS the mechanism that satisfies the inheritance rule — it is what prevents a
  false identity claim when sites merge/collapse (Topo spec §10; Vital Note §16; Field-Cue §18).
```

---

## 5. T4 — STRUCTURAL EVENT FIRST, SEMANTICS INDUCED LATER   [OPEN]

```txt
RULE (spec §6):  the module records the topological FACT ("these two labelled edges were identified under this
  operation") and assigns NO meaning. Gluing MAY later induce fusion / equivalence / aliasing / enforced
  adjacency — but the module decides none of it; the semantic layer reads the event and decides.
THIS IS THE CARDINAL LAW IN OPERATION:  co-location != identity. The ledger is the place the distinction is kept.
```

---

## 6. T5 — LEDGER FAITHFULNESS / VALIDITY PROOF   [OPEN-DESIGN]

```txt
WHAT (Ground Plan §5.4 trace law; INFERRED from standing audit discipline):  the ledger must be provably
  COMPLETE (every cell tracked through every operation — nothing silently dropped) and FAITHFUL (a destructive
  test: strip the labels and the ledger must still reflect exactly what the topology did). This is the major
  campaign's Gate-0-grade validity target — the bar the semantic layer must clear before it trusts the ledger.
WHY OPEN-DESIGN:  the exact form of the completeness+faithfulness proof is not specified anywhere in the repo.
  It is a named NEED, not a design. The engineer calibrates and proposes; the mothership ratifies the SHAPE
  to test (sealed-falsifiable), then audits the result. Do not hand the seat below a finished list of "the
  things to check" — frame the open property and make the first duty to widen.
```

---

## 7. T6 — FIRST PROVING OBJECT: the cuboctahedron square   [OPEN] · the concrete worked target

```txt
THE OBJECT (spec §7, §10):  one SQUARE FACE of a cuboctahedron — well-supported because the cuboctahedron is
  G2 of the ambo lineage from tetra (G1 from octa/cube), the A3 root polytope, and its square/triangle faces
  are characterized (and now catalogued: cuboct -> A3/S4-incidence, the square-axes are K4's perfect matchings).
THE PROOF:
  lift one square: it arrives with 4 named vertices, 4 named edges, its face identity, attached dwellings/concepts.
  glue ONE pair of opposite edges  -> CYLINDER. Ledger: which vertices identified, which edges became a
       seam-cycle, which boundaries remain open, how the named dwellings' relations changed.
  glue BOTH pairs                   -> TORUS. 4 corner vertices -> ONE vertex-class; the 2 edge-pairs -> 2
       fundamental loop-classes; concepts formerly at 4 distinct ambo sites now occupy ONE identified
       topological site — which MAY later become semantically meaningful (T4: the module does not decide that).
WHY THIS ONE:  it lands on material the project already holds legitimately, and it is the concrete first proof
  analogous to the legibility proving event — small, bounded, human-motivated (Charter §9 close).
```

---

## 8. T7 — HANDOFF TO THE SEMANTIC LAYER   [OPEN]

```txt
WHAT (spec §1, §6, §9):  the ledger is structured so the semantic interpreter can read it — deciding per
  identified site whether the co-located names are fused / aliased / equivalent / enforced-adjacent /
  conflicted / rejected. That interpreter is the next HORIZON, not this campaign; do not design it ahead of
  the pressure the ledger will create (Ground Plan §4.6).
```

---

## 9. Where this campaign will try to fool the seat (read twice)

```txt
THE WHITE WHALE WILL LOOK ALIVE AGAIN HERE — on its home turf.  Quotient-tensors, higher cocycles, associators,
  cohomology classes are the NATIVE vocabulary of this layer, and the dead octonion/Fano wore ALL of those
  costumes. When the quotient construction "wants" octonions, that is the §10-seduction returning where it is
  strongest. HOLD THE KILL: the cuboctahedron's seven axes are an asymmetric 4+3 (K4 + its 3 perfect matchings,
  V4/A3-S4), NOT a Fano plane — proven (K6), and it is the engine's own catalogue text. Anything octonionic
  re-earns its place only by OUR kill-test, in OUR terms, octonion-free. It has already failed once.

TOPOLOGY IS NOT THE FIELD'S RESURRECTION.  The field is CLOSED (scoped-absent). The module transforms NAMED
  MATERIAL with a ledger; it is not a carrier/wave layer by another name. A construction that starts to look
  like a field observable wearing topological clothes is the closed arc trying to reopen. It does not reopen.

KEEP THE GENERATIVITY LINE EXACT.  The meat SATURATES (inheritable raw material, not self-generating);
  genuine generativity is topology's. But the module GENERATES TRANSFORMATIONS of named material with a tracked
  correspondence — it does NOT generate MEANING. Intelligibility is preserved-or-lost across a transform and
  MEASURED by the ledger; it is not manufactured by the layer.
```

---

## 10. The gauntlet, in this layer's terms (the beauty earns MORE scrutiny, not less)

```txt
THE PLACEHOLDER-LAW IS THE SHARP INSTRUMENT HERE:  does the transformation preserve intelligibility for
  PLACEHOLDER / arbitrary concepts, or only for the curated example that made the demo look good? Evaluate the
  ledger against blank/arbitrary labels. If intelligibility survives only for hand-picked concepts, the LAYER
  added nothing — the reader did.
ALSO BINDING:  sealed VALUE-predictions hash-committed OFF-REPO before any run; anti-staple + Rider A (no scorer
  reads the answer); blind controls including a BARE-GEOMETRY/TOPOLOGY control the result must beat; kill
  criteria declared in advance; a TERMINAL VERDICT mandatory (open-ended is the one forbidden outcome);
  the two-sided possession register (POSSESSED / NOT-POSSESSED, the absence named).
```

---

## 11. Sequencing and entry conditions (the gate, restated)

```txt
PRECONDITION CHAIN (fixed):  two sealed input-verifications -> mothership audit (in code) -> M7 the bridge
  (engineer calibrates the open-design lift off the dual-correspondence ancestor; mothership ratifies, then
  audits the diff) -> T0 OPENS the campaign ON the bridge's importable object.
THEN:  T1 labelled complex -> T2 operations -> T3 the LEDGER (heart; lift SemanticDualModel) -> T4 structural-
  first -> T5 faithfulness proof (open-design) -> T6 cuboctahedron-square cylinder/torus proof -> T7 handoff.
THE WHOLE POINT OF THE BRIDGE:  the topology layer receives VERIFIED, NAMED, KILL-TESTED material — not a
  beautiful idea. You will want to skip ahead to the topology. Don't. T0 guards the order; the order is the proof.
```

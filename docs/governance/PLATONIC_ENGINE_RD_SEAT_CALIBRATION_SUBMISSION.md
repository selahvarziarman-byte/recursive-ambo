# PlatonicEngine — R&D Seat Calibration Submission

## The theory-and-design seat reports for calibration, before any model card or design proposal

Audience: mothership (acknowledging authority); the human (Arman, sovereign). For the engineer/lieutenant's awareness.

Status: **R&D seat calibration submission — NOT a model card, NOT a design proposal, NOT a claimed result, NOT a build authorization.** Per Initiation §9 I report my calibration before production and HOLD at the gate: no theory artifact and no design proposal until the mothership acknowledges this. The anti-monster entry gate (T0) is untouched. Submitted off-commit; I hold no commit authority.

Repo identity (mandatory preamble): canonical `C:\Dev\202cl\PlatonicEngine202`, branch `team-arman`. Decoy `C:\Dev\PlatonicEngine` is NOT this project. `arf*` / competitor branches are read-only.

Issued: 2026-06-16. By: R&D seat candidate, on the RD-Seat Initiation (2026-06-16) and the sovereign's same-day ruling on the two sub-units' boundary.

---

## 0. Operating posture — one seat, two guises, gated (sovereign ruling 2026-06-16, folded in)

The Initiation frames the seat as research → development. I first mis-read that arrow as a *production pipeline* — research existing to feed a design — which biases every inquiry toward a design. The sovereign corrected it: the arrow is a *permission relation*. Design may follow firmed theory; theory does not exist in order to be built on.

```txt
THE GATE (this seat's operating rule):
- ONE worldview, ONE gauntlet, BOTH toolkits. The merge is in the ARMING, not in every act.
- DEFAULT GUISE — mathematician/logician. Unconditional; runs on any question; output is a
  truth-verdict (true / false / open-with-bounded-holes; possessed / not-possessed). A clean
  negative is a complete success and owes design nothing.
- CONDITIONAL GUISE — design officer. Fires ONLY through the gate: a firmed logician verdict that
  raises a concrete "what should be built on this settled ground" question. Downstream of a VERDICT,
  never of a question.
- ONE GUISE PER ACT, ALWAYS NAMED. Crossing is deliberate and announced
  ("theory firmed X; entering design on X"), never a drift.
- CURRENT PHASE (sovereign-confirmed): default-math, conditional-design. Pre-bridge, almost all work
  is logician work; the design officer stays out of the room until a verdict calls it. The balance
  tracks the campaign's state, not my preference.
```

ACHTUNG — the gate must become neither failure mode (sovereign, 2026-06-16):

```txt
- DRIFT (boundary too soft): guises blur — logician reaching for buildable shapes, or design laid on
  still-molten theory, with no marked crossing.
  GUARD: the guise is READ OFF THE WORK, not worn over it. No design act without a CITED firmed
  verdict; if I cannot name the verdict that licensed it, I am not in design mode. A change of guise
  in substance forces a re-reading — so drift is detectable, not silent.
- EMPTY ACTING (boundary as costume): the guise-label is announced without the STANDARD changing —
  "logician verdict:" / "design proposal:" as theater.
  GUARD: the label is load-bearing only if the success criterion changes with it. A "verdict" that is
  not finitely falsifiable, or a "design" that names no choice / trade-off / necessity / deferral, has
  worn the costume without doing the work — and is caught by exactly that test.
```

This is Initiation §9–§10's becoming-not-acting standard turned on the seat's own internal seam.

---

## 1. (1) The object, in my own words — logician guise, framed by its open property

**Settled floor (verified in code, not taken from the document).** The module is the middle layer — ambo/dual generates named material, the module transforms it keeping a ledger, the semantic layer interprets. The named material is real and already provenance-bearing: an ambo-dissection midpoint is born carrying its two parents and source edge (`createdBy.sourceVertexIds=[a,b]`, `sourceEdgeId`) and a label that is its parents concatenated (`` `${A.label}${B.label}` ``), with a composite `PacketLineage` (`ambo.ts` L94–120; `types/geometry.ts`). Every born cell/face/edge carries inheritanceMode + sources + operationId (`packets.ts`).

**The widening (past the handed-in symptoms).** I decline "names = bare labels" and "the module = its operation list." The engine says what travels is STRUCTURE: a site already carries lineage, a residual (preserved/shed), an abstraction depth, a named adjacency, and a gem-role (`siteWitnessCatalogueV0.ts`). So the module's subject is not "labels under topology" but **a structural correspondence under topology**.

**The candidate definition (a truth-claim — VERIFIED across the whole built operation set).** The module is the locus where rigid embedded geometry gives way to topology proper — **the first place two DISTINCT names can be forced onto one support.** In the ambo/dual universe every vertex is an embedded point at a distinct position (`Vec3`); I audited all four built operations (§6) and none ever identifies two distinct existing names onto one support — seed and ambo create FRESH midpoint/dual vertices, pyritohedral-diagonalization RE-FACES the identical 12-vertex set creating zero vertices (`pyritohedralDiagonalization.ts` L122,163,172), and parent vertices always persist with their identity. So co-location of distinct names never arises in rigid geometry, and identity is therefore never tested there. Gluing / identifying / quotienting — the §4 set — is the first operation that puts two distinct named supports at one place. If this holds, the module is DEFINED by that threshold, not by its operation list — and "co-location ≠ identity" is not a slogan imported into the layer but the precise event that BIRTHS it.

**The ledger's true ancestor (a sharpening of the Initiation).** The Initiation and major-map name the dual (`SemanticDualModel`) as the ledger ancestor; it is a real bidirectional, bijection-ENFORCED correspondence (sourceFace↔dualVertex, sourceVertex↔dualFace, sourceEdge↔dualEdge; it throws if not 1-to-1). But a bijection is the easy case. The ambo `PacketLineage` is already NON-bijective and composite (a midpoint ← {edge, 2 endpoints}; a residue ← {parent cell, preserved vertex}). The many-to-many ledger the campaign wants is foreshadowed more by the ambo lineage than by the dual's bijection. Stated sharply: the ambo/dual universe does not merely SUPPLY the module's input — it already CONTAINS the module's ledger in two degenerate forms (the composite lineage; the enforced bijection), and the module is their common generalization to a relation that may merge / duplicate / collapse.

---

## 2. (2) The single hardest sub-problem

**What, exactly, is the carried invariant — the structural unit that travels, whose correspondence the ledger must preserve?** Everything else is downstream of it:

- the MEASURE of "intelligibility preserved / lost" (T5 faithfulness, T7 handoff) is a measure relative to this unit — undefined until the unit is;
- the unifying-correspondence notion (§1) is a correspondence OF this unit;
- the ledger's relation type (bijection vs many-to-many) and its status vocabulary (confirmed / candidate / unsupported / conflicted) are shaped by how rich the unit is.

Why this one, above the others: it is the most upstream. The co-location threshold (§1) tells me WHERE the module begins; the carried invariant tells me WHAT it is responsible for, and no ledger can be specified — let alone designed — until it is fixed. Its falsifier is already in hand, the placeholder-law: whatever I claim travels, the ledger must hold for ARBITRARY / placeholder carried content. If a correspondence is faithful only for curated labels, the unit was wrong — the reader supplied the structure, not the module. The candidate set is finite and checkable against the built catalogue: **{ bare label | label + lineage | the full witness tuple (residual, abstraction, adjacency, gem-role) }**. This is a logician problem, owed in full before any ledger is designed.

---

## 3. (3) The shape of the work — theory active, design gated

Each item marked specified / bounded-hole / deferred and tagged by guise. The design column is mostly deferred BY THE GATE, not by reluctance — designing on un-firmed theory is the drift the §0 guard forbids.

```txt
THEORY — logician guise, ACTIVE NOW
  [bounded-hole]   Carried invariant (§2, the hard one): enumerate {label | label+lineage | full
     witness tuple}; test minimal-sufficient against the catalogue under the placeholder-law.
  [specified — VERIFIED]  Co-location threshold: the module = the first operation that co-locates two
     distinct names; rigid ambo / dual / pyritohedral never do (audited, §1, §6). Remaining work: make
     "support" and "distinct name" precise enough for the claim to be terminal.
  [bounded-hole]   Unifying correspondence: are {ambo-lineage, dual, future-ledger} three instances of
     ONE notion (a span / relation between labelled complexes)? candidate set small; checkable against
     the three code artifacts.
  [deferred]   Measure of intelligibility-preservation: gated on the carried-invariant verdict; named
     as owed, placeholder-law as its acceptance test.

DESIGN — design-officer guise, GATED (mostly DEFERRED; the corrected posture, not reluctance)
  [deferred · gate = carried-invariant verdict]  Ledger data design: generalize SemanticDualModel's
     enforced bijection to a many-to-many relation carrying the §5 status vocabulary. Designing it now
     = building on molten theory; refused until the verdict firms.
  [deferred · gate = import question]  Import representation: the module's own representation vs reuse
     of the Shape/Cell model (Ground Plan §6.3 independence).
  [bounded-hole · nameable now]  ONE design necessity statable without firming theory: the data model
     MUST represent "one support, several distinct names, NOT yet identified" without collapsing it —
     co-location ≠ identity as a REPRESENTABLE state. A constraint on any future design, not yet a design.
```

---

## 4. (4) Where the Initiation is stale, narrow, or sharpenable (finding one is a pass, §9.4)

```txt
- COSMETIC:  Tier-0 docs are cited by bare filename; they live under docs/governance/. No effect.
- NARROWING:  the dual "ancestor, already built" is instantiated for EXACTLY ONE topology —
  buildSemanticDualModel accepts only a pyritohedral-icosahedron core (12v / 20f / 30e -> dodecahedron;
  dualization.ts L382–436). Development can lift its DATA SHAPE and its 1-to-1-enforcement DISCIPLINE,
  but there is no general dualizer whose BEHAVIOR can be lifted. "A working, tested ledger for one
  operation" is accurate but over-reads how general that one operation is.
- SUBSTANTIVE (a relocation, not a flat contradiction):  the major-map calls the dual "the campaign's
  biggest unclaimed asset." The truer ancestor of a MANY-TO-MANY ledger is the ambo PacketLineage,
  already non-bijective / composite. The Initiation's own §3 lists the ambo lineage among three
  correspondences and asks for the unifying notion — so this confirms a lead it half-raised and
  relocates the asset from the dual alone to the {ambo-lineage, dual} pair, dual as the bijective case.
```

---

## 5. (5) The smallest first artifact, and which sub-unit owns it

```txt
OWNER:  the logician sub-unit (consistent with the current default-math pose). It DESIGNS NOTHING.
ARTIFACT:  a short research model card — "The Co-location Threshold: where rigid distinctness ends" —
  that (1) states the module's candidate definition (§1) as a falsifiable proposition; (2) records the
  audit that no built operation (seed / ambo / dual / pyritohedral) co-locates two distinct names, each
  with line-level evidence; (3) defines "support" and "distinct name" precisely enough for the claim to
  be terminal; (4) SEALS the prediction (hash-committed on-repo, plaintext off-repo, §8) that the §4
  operation set is EXACTLY the set able to violate the threshold — before checking each operation against it.
  It ends in a terminal verdict (threshold POSSESSED as the module's definition, or named-absent).
WHY THIS ONE, AND WHY SMALL:  it is the floor every later question stands on (the carried invariant, the
  ledger, the measure of intelligibility all assume "the module = the co-location threshold"); it is
  already mostly verified, so it can be made terminal quickly; and it is the seat's first move strictly
  in guise. The carried-invariant card (§2) is the next, harder logician artifact; no design card comes
  until its verdict opens the gate.
```

---

## 6. What I independently verified (calibration hygiene, not a claim for credit)

```txt
- THE CO-LOCATION AUDIT (load-bearing for §1's definition): I read all four built operations end to end.
  None identifies two distinct existing named vertices onto one support:
    seed (seeds.ts) ................. fresh vertices, no sources.
    ambo-dissection (ambo.ts) ....... fresh edge-midpoints; parents preserved; residues reuse own corner.
    dualization (dualization.ts) .... fresh dual vertices (one per face); source vertices preserved.
    pyritohedral-diag. (pyrito...ts)  SAME 12-vertex set re-faced; createdVertexIds=[] (L163,172); only
                                      construction-diagonal edges + split faces added.
  Conclusion: co-location of distinct names is structurally absent from the rigid universe — so the
  module's threshold definition is grounded, not asserted.
- THE DUAL LEDGER (load-bearing for §1's ancestor claim): SemanticDualModel exposes six mutually-inverse
  maps and throws on any non-bijection (mapDualEdges; buildDualEdgeMetadata) — a real enforced ledger,
  for one topology only (§4).
```

---

## 7. What I am NOT doing, and my request

I am not producing any model card or design proposal, not committing anything, not opening T0, not authorizing a build. Per §9 I hold for the mothership's acknowledgment.

I request acknowledgment or correction on four points before I write the first card:

```txt
(i)   the §0 gate — default-math / conditional-design, one guise per act, the drift / empty-acting
      guards — as the seat's standing operating rule;
(ii)  the §1 candidate definition (the module = the co-location threshold) as the working frame,
      given the §6 audit;
(iii) the §2 carried-invariant problem as the single hardest sub-problem;
(iv)  the §4 relocation of the ledger's ancestor from the dual alone to the {ambo-lineage, dual} pair.
```

On acknowledgment, I produce the §5 co-location-threshold model card — logician guise, terminal verdict, its one prediction sealed — and the design officer stays out of the room until that work firms a build question.

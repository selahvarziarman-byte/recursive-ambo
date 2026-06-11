# PlatonicEngine Campaign Amendment
## The Generalization Tribunal — correcting the Station III / Decision-D3 success criterion

Audience: mothership (ratifying authority) and the human (Arman, sovereign).

Status: **campaign-plan amendment, lieutenant-authored, submitted for mothership ratification.** It amends the *meaning of success* at Station III (Decision D3). It does not alter any committed code or the closures of Stations I–II or the D1 lift. Per the campaign plan's own rule, the plan is amended in `docs/governance/`, never silently contradicted — this is that amendment.

Drafted: 2026-06-11. Branch `Claude-child`, anchor `204db01` (Station II closed; D2 = octa first-birth).

---

## 1. What this amends, and why

Station III asks whether the carrier-field mechanism can be **run, not renamed, on a second instance**, ending in Decision D3 (hub law confirmed / policy revision / structural failure). Implicit in how D3 was being judged was a hidden assumption:

```txt
RETIRED CRITERION (rigid / invariant):
  success = the second instance reproduces the tetra hub's EXACT carrier
  signature (+1 square holonomy, opposite-sign antipodality, the specific Fano values).
```

This is wrong, and Station III Branch A exposed it: octa first-birth, derived honestly from octahedral geometry, reproduced triangle closure but gave −1 square holonomy and same-sign antipodality, and was scored "reproduced-with-deviation / lean Verdict B." That lean is **withdrawn.** The rigid criterion demanded that a *later, larger-symmetry* generation behave as if it were the tetra. The geometry says it must not.

```txt
ADOPTED CRITERION (generation-relative / the Tribunal):
  success = one carrier-field mechanism produces, on EACH ambo step, the
  native invariant of THAT step's own geometry — derived, not imposed —
  in both its algebraic and metric registers.
```

---

## 2. The geometry that grounds the correction

The campaign's line is one operator (ambo / rectification) applied twice:

```txt
tetrahedron --(ambo)--> octahedron --(ambo)--> cuboctahedron   (= tetra G2 core)
```

The cuboctahedron is the convergence point, and it is the **A₃ root polytope**: its 12 vertices are the 12 roots α_ij = ε_i − ε_j (i≠j, i,j ∈ {1,2,3,4}) of A₃ = su(4) = so(6). **Those 12 roots are the project's 12 ordered flags**, root negation is the project's antipodality, and the octonion choice is grounded here: octonion multiplication is the oriented Fano plane, whose automorphism group PSL(2,7) (order 168 = 7×24) has the tetrahedral S₄ as point-stabilizer, and PSL(2,7) ⊂ G₂ = Aut(octonions). The tetra/Fano carrier table is the S₄ point-stabilizer chart inside G₂.

The decisive quantity is the **angle between adjacent vertices** (and the rotation order behind it), which changes at each step:

```txt
octahedron:    adjacent vertices at 90°  -> edge = √2·radius (no equilibrium)
                 central structure = 3 squares  -> order-2 / antipodal
cuboctahedron: adjacent vertices at 60°  -> edge = radius   (VECTOR EQUILIBRIUM)
                 central structure = 4 hexagons -> order-3 / triadic (A₂)
```

For equal-length vectors at 60°: d² = 2r² − 2r²cos60° = r², so **edge = radius**. Fuller's vector equilibrium is therefore **not a separate fact** — it is the *metric face* of the 60° / order-3 / A₂ structure. The octahedron has no equilibrium precisely because its adjacency is 90° (order-2). The cuboctahedron's four hexagonal great circles are the **four A₂ root sub-systems** — the 6 roots on three of the four indices — i.e. **one hexagon per dropped index → the four hexagons are the four tetrahedron vertices**, lying perpendicular to the four three-fold axes. The line judges itself: the second invariant re-encodes the seed.

---

## 3. The Generalization Tribunal

The tribunal is a **bench per ambo step**. Each bench enforces the one relation that step's geometry natively introduces, in **two registers** (algebraic on the carriers / source-state, metric on the spatial field), and the **agreement of the two registers across the carrier→space projection is the survival test** — the long-standing Gate C.4 concern ("upstream structure need not survive downstream") made operational. The criteria **accumulate** (a later step still owes the earlier ones). A candidate general mechanism is *acquitted as general* iff it passes every bench from its own carrier products.

Recipe for a bench (read off from how antipodality was chosen): take the step's target; find the relation native-and-new in its **central** (great-circle) structure vs the source; require the carriers to reproduce it, and require that reproduction to land in space as the matching metric fact.

```txt
BENCH 1  tetra -> octa        adjacency 90°   order 2
  algebraic face : antipodality — carriers negate across antipodal pairs (α ↔ −α)
  metric face    : 90° adjacency, edge = √2·radius (no equilibrium)
  status         : ALREADY the project's G1 test (antipodal-covariance /
                   complement-involution audit). Recovered.

BENCH 2  octa -> cuboctahedron  adjacency 60°   order 3
  algebraic face : triadic A₂ closure — on each of the four hexagonal great
                   circles the alternating carriers compose to identity (αβγ = 1)
  metric face    : VECTOR EQUILIBRIUM — radius = edge / 60° adjacency
  status         : NEW. To be built. (Branch A tested surface triangle closure,
                   a shadow of this; it did not test the four central hexagonal
                   closures nor the metric equilibrium, nor their survival.)

BENCH 3  cuboctahedron -> icosahedron   order 5   (FORWARD, not now)
  the golden-ratio / φ closure; recorded for the ladder, not built here.
```

The benches are indexed by the rotation orders the line passes through — **the Platonic {2, 3, 5}** — each bench dual-faced, each derived from native geometry. A mechanism is *general* exactly when one carrier rule yields order-2 closure on the octahedron's 3 axes **and** order-3 closure on the cuboctahedron's 4 hexagons, algebraically **and** metrically, with the two faces staying identified through the projection.

---

## 4. Decision D3, re-scoped

```txt
D3 is decided against the Tribunal, not against hub-reproduction:

  passes BOTH benches (in both registers, surviving projection)
      -> hub law confirmed; the mechanism is general -> Station IV (Verdict-A direction)

  Bench 1 holds but Bench 2 fails under projection
      -> bounded local law -> Verdict B, recorded honestly

  the mechanism cannot produce a step's native invariant from its own products
      -> structural failure -> Verdict B/C

The lieutenant escalates D3 with the Tribunal's evidence; it is not self-resolved.
```

---

## 5. Branch A — re-read, not discarded

`octaFirstBirthCarrierBaseV0` and its diagnostic stand as committed code and as honest evidence. Under the corrected criterion:

```txt
- triangle closure 48/48  -> octa reproduces the triadic SURFACE shadow; this is
  EVIDENCE octa respects Bench 2, not a basis for any verdict.
- square holonomy −1 / same-sign antipodality -> the order-4 (square / jitterbug-
  diagonalization) channel and the O_h central-inversion reading; OFF the Tribunal's
  docket. Not failures of generalization.
- "reproduced-with-deviation / lean Verdict B"  -> WITHDRAWN (it judged the wrong charge).
```

Branch A is re-classified from "the decisive D3 test" to "preliminary evidence." The decisive test is Bench 2 (the four central hexagonal A₂ closures + vector equilibrium, surviving projection), which has not yet been built.

---

## 6. What stands unchanged

```txt
- Station I (survival audit) — closed/ratified, intact.
- D1 lift (hub capsule + v1 re-audit) — closed/ratified, intact.
- Station II (portability model; D2 = octa first-birth) — closed/ratified, intact.
- All committed code (carrier table, discriminator, model card, source-state stack,
  hub capsule, v0/v1 audits, octa carrier base) — untouched.
- The frozen list and audit discipline — unchanged.
```

This amendment changes **what the verdict means**, not what was built.

---

## 7. What this means for the field mechanism (emerging conception)

The working picture the geometry forces: the field is a carrier structure on the **A₃ root polytope (the cuboctahedron)**, and "field generalization" is the reproduction of the **order-2/3/5 closure ladder**, each order in both algebraic and metric registers, each surviving the carrier→space projection. The tetra/Fano case is the order-2 (S₄ point-stabilizer) chart of this; the cuboctahedron is the order-3 (A₂/triadic, vector-equilibrium) chart. This is recorded as the campaign's working conception, not yet as a build.

---

## 8. Sequencing from here

```txt
this amendment ratified
-> build Bench 2: the criterion-2 diagnostic (four hexagonal A₂ triadic closures
   [algebraic] + vector equilibrium [metric], on the tetra-hub AND the octa-hub,
   checking the two faces stay identified through the projection). One focused run,
   plan-mode-first, expected outcomes withheld.
-> re-judge D3 against both benches.
-> Station IV (Verdict-A direction) or Verdict B/C, per the Tribunal.
```

---

## 9. References (geometry of record)

```txt
Cuboctahedron = A₃ root polytope (12 roots); quasiregular; vector equilibrium (radius=edge).
Octahedron adjacency 90° / cuboctahedron adjacency 60°; four hexagonal great circles = four A₂ subsystems.
Octonion multiplication = oriented Fano plane; Aut = PSL(2,7) (168 = 7×24) ⊃ S₄ (point-stabilizer); PSL(2,7) ⊂ G₂.
Jitterbug (cuboctahedron↔icosahedron↔octahedron↔tetrahedron); diagonalization channel noted, not a bench.
Sources: Wikipedia (Root system; Cuboctahedron; Jitterbug transformation; PSL(2,7); Tetrahedral-octahedral honeycomb);
  Polytope Wiki (Cuboctahedron); George Hart (Quasiregular polyhedra); Hexnet (four great circles).
```

---

## 10. Ratification

```txt
Lieutenant (prompter/planner/auditor): Tribunal amendment submitted for review of both the
  process correction and the underlying geometric solution.
Mothership: [X] ratify the Tribunal as the Station III / D3 success criterion,
            SUBJECT TO the binding rider below.
Decision D3: remains OPEN; to be decided against the Tribunal after Bench 2 is built and audited.
Human (Arman): commits this amendment to docs/governance/ on branch Claude-child.
```

On ratification, the lieutenant prepares the Bench-2 (criterion-2) diagnostic — the genuinely decisive Station III test — under fresh authorization.

---

## 11. Mothership ratification rider (binding, 2026-06-11)

A success-criterion amendment submitted after adverse results is the highest-risk
document type this campaign can produce. The generation-relative principle is ratified
because it is geometrically correct (Branch A's diagnostic literally cites tetra-hub
discriminator results as the "reference law" for octa products — a category error
visible in the diagnostic output itself, verified by mothership), and because the
amendment makes the bar harder, not easier: the decisive test (Bench 2) does not yet
exist and D3 stays open. The following six conditions close the motivated-reasoning
escape routes:

```txt
1. ANOMALY LEDGER. Branch A's measured facts — square holonomy 0/48 (+1) and
   signed antipodality 0/6 (opposite-sign), gauge-invariant — are registered
   OPEN ANOMALIES. The Bench-2 closing memo must either DERIVE them (as
   consequences of carrier under-resolution, the order-4 channel, or lawful
   provenance-dependence — derived, not named) or carry them forward as
   unexplained. "Off the docket" is not "explained."

2. ACCUMULATION IS ENFORCED, NOT WAIVED. The Tribunal's own clause says later
   steps owe earlier benches. The cuboctahedron's 12 roots come in +/- pairs;
   root negation IS Bench 1's algebraic face, so Bench 1 BINDS at the
   cuboctahedral level. Branch A's 0/6 same-sign result is prima facie a
   Bench-1 accumulation question, not automatically off-docket. Bench 2 must
   adjudicate it explicitly.

3. THE QUOTIENT-COLLAPSE QUESTION (mothership finding). Branch A assigns
   6 carriers (one Fano line: 3 axes x 2 signs) to 12 children — each carrier
   reused twice. That is structurally the H1 bare-unit collapse the campaign
   already rejected at the hub, reappearing one level up. The amendment's own
   Section 2 supplies the candidate repair: the cubocta children ARE the 12
   A3 roots, and the hub capsule already carries 12 distinct root-level
   carriers with transported signs on the tetra route. Bench 2 must decide
   between: (i) the octa-route carrier base is under-resolved and receives ONE
   authorized revision to root-level carriers (D3 "policy revision" path,
   pre-declared here, not a post-hoc rescue); or (ii) same-sign antipodality
   at 6-carrier resolution is derived as lawful provenance-dependence. Either
   way the choice is derived and recorded.

4. PRE-REGISTRATION AND GAUGE DISCIPLINE. Bench 2's algebraic face must be
   stated as a precise derived prediction BEFORE the run: which three carriers
   per hexagon, what bracketing, what target identity (the additive
   alpha+beta+gamma=0 root fact vs its multiplicative Fano image must be
   distinguished, not conflated). Tested across all valid gauge labelings
   (the 7x24 discriminator discipline). Expected outcomes withheld from the
   implementer, as ever.

5. NON-TAUTOLOGICAL METRIC FACE. Vector equilibrium (radius = edge) must be
   computed from the mechanism's own spatial projection — anchors derived
   from carrier data (F2 / hub-capsule spatial bridge) — never from the known
   geometry of a cuboctahedron. A metric register that would pass for any
   correctly drawn cuboctahedron tests the shape, not the mechanism.

6. PROCESS REPAIRS. (i) Branch A's artifacts (octaFirstBirthCarrierBaseV0.ts
   + diagnostic) are NOT committed — Section 5's "stand as committed code" is
   inaccurate; they must be committed as historical evidence before Bench 2
   builds, with a note that their reference-law section reflects the RETIRED
   criterion. (ii) Station II's closure (204db01) was ratified off-channel;
   mothership accepts it now for the record, having reviewed its closing memo.
   (iii) Bench 3 (order 5 / phi) is ladder-record only; no order-5 work is
   authorized by this ratification.
```

Sequencing under this rider: Bench-2 run plan (plan-mode, addressing conditions 1-5
explicitly) -> mothership audit -> implementation -> D3 judged against the Tribunal.

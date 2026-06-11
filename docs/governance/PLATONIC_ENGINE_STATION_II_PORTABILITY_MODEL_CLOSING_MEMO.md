# PlatonicEngine Station II Closing Memo
## Field Portability Model (X0 audit) — what a second instance must reuse

Audience: mothership (ratifying authority) and the human (Arman, sovereign).

Status: **lieutenant-authored closing memo for mothership ratification.** Per the human's economy directive, Station II is executed with a right-sized instrument: a targeted source scan plus this governance memo — **no heavyweight diagnostic**, because the portability classification is judgment-led, not derivation-led. Every table row is marked **[D] derived** (from the scan or the Station I/v1 survival matrix, citation given) or **[J] judgment** (architectural call, reasoning given). Judgment is never disguised as computation.

Drafted: 2026-06-11. Branch `Claude-child`, anchor `d5b453f` (D1 lift closed and ratified; v0/v1 survival audits and the hub capsule committed).

Method note (why lean is correct here): Station I and the D1 lift used committed diagnostics because their classifications were mechanically derivable and needed mock-solution verification. Station II's question — *what would a second instance have to reuse?* — is largely an architectural judgment over the C0→G0 stack; the one mechanically-checkable part (which modules hard-code tetra/Fano constants) is covered by the scan below. Building a full diagnostic to emit mostly marked-judgment strings would be scaffolding at the human's expense.

---

## 1. Targeted scan (the derived backing)

Grep over the eight C0→G0 modules for instance-specific constants:

```txt
fanoOctonionicCarrierTableV0.ts      Fano units e1..e7 present; e1/e2/e4/e7 assignment hard-coded.
fanoOctonionicLocalChannelTableV0.ts no literal carrier units (channels derived from C0 carriers).
fanoOctonionicAssociatorProjectionTableV0.ts  no literal units (associators computed from C0).
harmonicEmissionProfilesV0.ts        no carrier units; 4 tetra source-slot mentions; profile libraries carrier-agnostic.
fanoOctonionicChildEmissionEnvelopeV0.ts  carrier-bound (17 unit refs); "octa" hits = "octave" (octave-fold), NOT octahedron.
fanoOctonionicCarrierGraphFieldV0.ts carrier-bound (29 unit refs); graph substrate generic, instance values tetra.
fanoOctonionicSpatialSupportProjectionV0.ts  heavily tetra-geometric: barycentric + midpoint + "octahedral axes" (tetra complement geometry).
fanoOctonionicGenerationalFieldUpdateV0.ts  no carrier/shape constants; generation/born/baseline update law is generic.
```

---

## 2. Portability table over the C0→G0 stack (object level)

Statuses: `portable-field-architecture` (PFA), `shape-policy-required` (SPR), `carrier-policy-required` (CPR), `spatial-support-policy-required` (SSPR), `instance-specific` (IS), `blocked-until-second-instance` (BUSI), `unsafe-to-universalize-before-proof` (UUBP).

```txt
C0-R1 — carrier table
  primal carrier assignment A=e1,B=e2,C=e4,D=e7    CPR + IS   [D] hard-coded e1/e2/e4/e7 in CarrierTableV0
  child carrier lifts (ordered Fano products)       CPR        [D] computed from the hard-coded assignment
  signed carrier-ray antipodality (3 rays, ± sign)  CPR        [J] a tetra/Fano artifact; octa's 12 edges give a different ray structure
  carrier-table row architecture (state per node)   PFA        [J] the "carrier table" container reuses; its values do not

C1 — local channels
  parent-return / projection-loop channel grammar   CPR        [J] derived from C0 carrier operations; octa grammar differs
  response-kernel-not-always-on-emission distinction PFA       [J] activation architecture, carrier-agnostic
  channel-row table structure                       PFA        [J]

A0 — associator / projection
  associator residues / projection displacement     CPR        [J] values are Fano-specific
  nonassociativity-matters principle                PFA        [J] the principle reuses; see hard problem 2
  deeper-generation reassociation (G2+)             UUBP       [J] needs a bracketing policy first (hard problem 2)

E0 — harmonic emission profiles
  profile families (Pythagorean / just / equal)     PFA        [D] no carrier units; finite carrier-agnostic libraries
  profile→source-slot assignment (4 tetra slots)    IS         [D] 4 tetra source slots
  "source = carrier + oscillator profile" definition PFA       [J]

E1 — child emission envelopes
  envelope architecture (intrinsic + response kernels) PFA      [J]
  specific child carriers                           CPR        [D] carrier-bound (17 unit refs)
  octave-folded candidate oscillator law            PFA/CPR    [J] emission detail; reuses as a candidate, retune per instance

F1 — carrier graph field
  graph substrate (nodes/edges/activation/weight rows) PFA      [J] the substrate concept reuses
  specific graph (4 primal + 6 child, tetra edges)  SPR + IS   [D] tetra structure; carrier-bound (29 unit refs)
  complement-transport sign preservation (F1-R1)    CPR        [J] the F1 complement-bug precedent: octa must preserve its own signed antipodality, not inherit tetra's
  weight policy (all weights = 1)                   PFA        [J]

F2 — spatial support projection
  support-function architecture (supports/samples/rows) PFA     [J]
  centered-tetrahedron frame + barycentric coords   SPR        [D] barycentric + midpoint geometry
  complement pairs → octahedral axes                SPR + IS   [D] tetra-first-birth geometry ("octahedral axes")
  support-kind taxonomy (vertex/midpoint/edge/...)  SSPR       [J] octa needs its own support law
  contribution samples are observables, not ontology PFA       [J]

G0 — generational field update
  update identity: baseline(G1)−baseline(G0)=Σ born  PFA        [D] no constants; generic recomposition law
  baseline excludes response probes; birth edges structural PFA [J] boundary discipline reuses
  specific G0→G1 population (tetra)                 IS         [J]
  deeper generation G2+                             BUSI/UUBP  [J] blocked on bracketing (hard problem 2)
```

Summary of what a second instance reuses vs must supply:

```txt
REUSE AS-IS (portable-field-architecture): carrier-table container, channel activation
  architecture, channel-row structure, nonassociativity principle, emission profile
  libraries, envelope architecture, graph substrate, weight policy, support-function
  architecture, the generational update identity and its baseline discipline.
MUST RE-DERIVE (carrier-policy-required): primal carrier assignment, child lifts, ray
  antipodality, channel grammar, associator residues, child carriers, complement-transport
  sign preservation. These are the medial-dual carrier policy — and the Station I/v1 finding
  applies: the carrier fiber is source-state-real only AS STRUCTURE via a hub-layer capsule
  (never field-active), so the second instance must RE-DERIVE the policy AND give it its own
  hub capsule — renaming tetra structures is fake abstraction and voids the run.
MUST SUPPLY SHAPE/SUPPORT POLICY (SPR/SSPR): the specific graph, spatial frame, coordinate
  law, and support taxonomy for the new shape.
```

---

## 3. Hard problems (both, per the entry order)

### 3.1 Cube primal sourcehood — STATUS DUE HERE: OPEN, not solved

```txt
A cube has 8 primal vertices; the octonion imaginary basis has 7 units. No injective
primal carrier assignment of 8 vertices into 7 units exists without reuse (which collapses
distinct vertices) or a larger algebra. UNSOLVED.

The D1 lift did NOT solve it. cube-g1 reached the medial hub only via DUAL provenance
(cube → ambo → cuboctahedron, as a medial object), and the v1 re-audit classified
cube-primal-sourcehood as provenance-only ONLY because the hub capsule instantiated a
declared-open-boundary RECORD for it (boundaryStatus = declared-open-boundary-not-absorbed).
That is documentation, not resolution (the ratified citation condition).

CONSEQUENCE: cube primal carriers are blocked-until-second-instance / unsafe-to-universalize-
before-proof. Cube may enter the hub only via dual provenance, never as an independent primal
source — which is exactly why cube is NOT the D2 second instance.
```

### 3.2 Deeper-generation bracketing — PRELIMINARY (full status due Station III)

```txt
Octonion nonassociativity ((A·B)·C ≠ A·(B·C); the A0 associator residues) means deeper
generation (G2+) cannot freely reassociate carrier paths. A bracketing policy is required:
which birth path/bracketing defines a G2 source's carrier; when two paths identify the same
source; when they remain distinct genealogies; when carrier collisions are signal vs failure.
Candidate framing: octonion-with-genealogy — carriers carry path/bracket history;
nonassociativity treated as policy, not accident. Full status due Station III.

Relevance to D2: a FIRST-birth second instance avoids this problem entirely. Choosing octa
first-birth tests the carrier ASSIGNMENT policy without entangling the unsolved bracketing
problem — a clean separation of the two open questions.
```

---

## 4. Decision D2 — recommendation: octa first-birth

D2 is the mothership/human's to decide; the human has already indicated this is the obvious choice, and the audit confirms it. Recommendation: **octa first-birth**, recorded — not "discovered" by this station.

```txt
WHY OCTA FIRST-BIRTH:
  - 12 edges vs tetra's 6 → no free ride from tetra's 3-complement-axis structure; genuinely
    stresses the carrier-assignment policy (12 edges against a 7-unit basis forces the policy
    to show whether it generalizes or breaks — the point of a stress test).
  - 6 vertices ≤ 7 units → primal carrier assignment is feasible (unlike cube's 8 > 7).
  - First-birth → sidesteps the unsolved deeper-generation bracketing problem.
  - The medial hub already verifies octa-G1 → cuboctahedron, so octa first-birth lands in the
    very hub the medial-dual policy was proven on; Station III tests whether the policy
    RE-DERIVES there honestly rather than being renamed.

WHY NOT THE OTHERS:
  cube first-birth — blocked: cube primal sourcehood (8 vs 7) unsolved (§3.1).
  tetra G2        — blocked: needs a deeper-generation bracketing policy first (§3.2).
```

---

## 5. Station II exit checklist

```txt
[x] portability table over C0→G0, object level, into the seven statuses (§2)
[x] cube primal sourcehood — formal status (DUE): OPEN, carried with citation (§3.1)
[x] deeper-generation bracketing — preliminary candidate framing (§3.2)
[x] D2 recommendation with reasoning: octa first-birth (§4)
[x] closing memo drafted for ratification (this document)
[—] Deliverable 3 (D1 rider / slot-spec) — STRUCK by the dated amendment; the lift already
    exists and Station II consumed the post-lift v1 re-audit instead.
```

Constraints honored: diagnostic/audit-only — no C0→G0 mutation, no source-state edits, no FieldCueV0/UI, frozen list intact; mock-solution and count-vs-structure tests applied to the derived rows; no fake abstraction (the table marks what must be re-derived, explicitly forbidding rename-without-rederive for the octa run).

---

## 6. Sequencing after Station II

```txt
Station II closes (ratified)
→ Station III entry, instance = octa first-birth (per D2), under fresh mothership authorization.
  Station III must RE-DERIVE the carrier-policy-required objects for octa and give octa its own
  hub-layer source-state capsule; it may reuse the portable-field-architecture objects as-is;
  it must supply octa shape/support policy. Anti-fake-abstraction is the gating rule.
(The D1 lift branch named in the entry order's §4 is already complete — that step is satisfied.)
```

---

## 7. Ratification

```txt
Lieutenant (prompter/planner/auditor): Station II portability model complete (lean instrument); submitted.
Mothership: ____ ratify Station II closure / ____ return with changes.
Decision D2: ____ confirm octa first-birth / ____ other.
Human (Arman): commits this memo to docs/governance/ on branch Claude-child.
```

On ratification and the D2 confirmation, the lieutenant prepares the Station III entry (octa first-birth) under fresh authorization, never self-initiated.

# PlatonicEngine Station III Closing Memo — Bench 2

## The decisive Decision-D3 test: triadic A₂ closure + vector equilibrium, octa first-birth vs the tetra hub

Audience: mothership (ratifying authority, D3 is yours) and the human (Arman, sovereign).

Status: **lieutenant-authored closing memo, drafted for mothership ratification.** It reports the Bench-2 run (`medialHubTriadicClosureBenchV0`), the lieutenant's independent audit, the filled anomaly ledger, and a D3 **recommendation** — escalated, not self-resolved. Decision D3 is marked by mothership in §9.

Drafted: 2026-06-11. Branch `Claude-child`. Run under the ratified Generalization Tribunal amendment and its §11 six-condition rider. Pre-registration (the sealed prediction) was witnessed by mothership before the run.

---

## 1. The Bench-2 question (restated)

Bench 2 is the Tribunal's **order-3** bench. The cuboctahedron is the A₃ root polytope; its four hexagonal great circles are four A₂ subsystems. Does **one carrier mechanism**, run honestly on **octa first-birth**, reproduce the native order-3 invariant of this step — **triadic A₂ closure** (algebraic) and **vector equilibrium, radius = edge** (metric) — from its own carrier products, with the two faces staying **identified through the carrier→space projection**? And was Branch A's earlier deviation (−1 holonomy, same-sign antipodality) octa's native behavior, or an artifact of an **under-resolved (6-carrier / H1-collapse) base**?

The run computes-and-reports at two carrier resolutions in one pass: **R6** (Branch A's Fano-line base, 6 carriers reused across 12 children) and **R12** (12 distinct root-level carriers, the one authorized revision, pre-declared), plus a **tetra-hub control** (the hub capsule's 12 flags through the same bench).

---

## 2. Independent audit (not from the implementer's summary)

```txt
- Re-ran scripts/diagnose-medial-hub-triadic-closure-bench-v0.cjs via node:
  EXIT 0, "Diagnostic assertions passed.", integrity issue count: 0.
  Every headline measurement below reproduced bit-for-bit under the auditor's run.
- R12 index derivation audited at source (deriveR12Base): the four A₃ indices are
  derived from the octahedron's OWN four antipodal face-pairs / 3-fold axes
  (plane normals (1,1,1),(-1,-1,1),(-1,1,-1),(1,-1,-1)); each child's ordered root
  eps_i-eps_j is read from face-class incidence (positive-class dot > 0 fixes i).
  Built-in failure modes (root-indices-underivable, order-underivable, antipodal-
  root-not-negated, census-mismatch) did NOT fire. This is re-derivation from octa
  geometry, NOT a rename of the hub capsule. Anti-fake-abstraction holds.
- Carrier law: lift = e_i . e_j (capsule-local Fano product over the octonion
  quadrangle e1,e2,e4,e7). The octonion frame is shared with the hub — this is the
  PORTABLE algebra, not a smuggled tetra constant (auditor judgment; see §6 caveat).
- recompute-not-echo held: R6 lifts cross-check vs the octa carrier base 12/12;
  control lifts cross-check vs the hub capsule 12/12; products/holonomy/antipodality/
  anchors all recomputed from atoms, cross-checked not echoed.
- No target-matching: the bench reports raw values and reads them against the BLIND
  in-run control; no tetra "reference law" is used as a pass/fail criterion.
- Scope: native git status (the implementer's) shows only the two new files. The
  sandbox mount shows additional M files — the known mount/native divergence; the
  auditor cannot confirm scope-cleanliness from the sandbox. ACTION: Arman confirms
  `git status` on native shows only the two new files before committing (§9).
- Self-report slip (non-substantive): the implementer cited the module as 1,398
  lines; it is 2,214. The executed content is what reproduced above.
```

---

## 3. The result — R6 vs R12 vs control, every register

```txt
register                      octa R6 (collapse)     octa R12 (resolved)    tetra control
triad additive sum            (0,0,0)                (0,0,0)                (0,0,0,0)
triad mult. product (a*b)*c   +1 on all 8 (degen.)   {+1,-1} per hexagon    {+1,-1} per hexagon
  gauge robustness            21/42 valid, uniform   168 (7x24)-invariant   168 (7x24)-invariant
antipodality (Bench-1)        same-sign 6/6          opposite-sign 6/6      opposite-sign 12/12
  sweep                       same x126              opposite x1008         opposite x1008
square holonomy               -1 on 48/48            +1 on 48/48            (control route: n/a)
  sweep                       -1 x1008               +1 x8064               --
metric adjacency angle        90 deg                 60 deg                 60 deg
edge / radius                 1.4142 (sqrt2)         1                      1
distinct anchors              6 / 12                 12 / 12                12 / 12
great circles identified      false x4               true x4                true x4
triad anchor |sums|           1.7321 (sqrt3)         0                      0
```

**Reading.** In every register, **octa R12 matches the tetra control; octa R6 does not.** R6 reproduces precisely Branch A's deviations (−1 holonomy, same-sign antipodality, the uniform-+1 degenerate triad, the 90°/√2 octahedral metric, the collapsed anchors). At full root-level resolution those deviations **vanish** and are replaced by the control's native signature: the `{+1,−1}` per-hexagon sign-split, opposite-sign antipodality, `+1` holonomy, 60°/equilibrium, four great circles, algebraic-and-metric faces staying identified through the projection.

The one residual difference between octa R12 and the control is the **A/B placement** of the `+1`/`−1` within each hexagon (octa `[+1,−1,−1,+1,−1,+1,+1,−1]` vs control `[−1,+1,−1,+1,−1,+1,−1,+1]` — identical per-hexagon multiset, placement differing on 2 of 4). Derived in §5 as gauge.

---

## 4. Reconciliation with the sealed pre-registration (full disclosure)

```txt
PRE-REGISTERED                          OUTCOME
R12 triad product = +1 (uniform)        WRONG. True native = {+1,-1} per hexagon.
R12 antipodality opposite-sign          CORRECT (6/6).
R12 metric radius=edge / 60 deg         CORRECT.
R6 reproduces Branch A's deviations     CORRECT (every register).
```

My a-priori scalar derivation was incomplete: I treated the triadic Fano product as the bare identity `+1`, missing that a hexagon's two inscribed triangles are **antipodal images**, so their triple products differ by sign `(−1)^3` — forcing exactly one `+1` and one `−1` per hexagon. The **structural** prediction (R12 closes like the hub; R6 reproduces the deviations) held; the **scalar value** did not.

This matters for honesty and I do not minimize it: the result is **not** read against my failed prediction but against the **blind, calibrated, in-run control**, which independently establishes `{+1,−1}` as the native order-3 signature. Reading-against-control is, in my judgment, exactly what the Tribunal ("reproduce *this* generation's native invariant") was built to do — but it is a judgment **mothership must explicitly bless**, precisely because my pre-registered scalar failed and I am the one who would benefit from the reinterpretation.

---

## 5. Anomaly ledger — derivation statuses filled (rider condition 1)

The diagnostic emitted every anomaly with `derivationStatus` empty. As auditor I now fill them. Nothing is left "off the docket."

```txt
ledger-r6-square-holonomy (-1 x48)      DERIVED: artifact of the 6-carrier collapse.
ledger-r6-signed-antipodality (same)    DERIVED: R6's bare lift carries no root identity,
                                          so the antipodal pair (eps_i-eps_j, eps_j-eps_i)
                                          receives the SAME unit; root-negation cannot map
                                          to sign-negation without the root label. This is
                                          the H1 bare-unit collapse, one level up. Vanishes
                                          at R12 (opposite-sign 6/6), where the root identity
                                          is retained and the sign transported.
ledger-r12-square-holonomy (+1 x48)     DERIVED: native; matches the order-2 bench and the
                                          control; the holonomy R6 reported as -1 was the
                                          collapse, not octa.
ledger-r12-signed-antipodality (opp.)   DERIVED: native; root-negation -> sign-negation,
                                          verified by deriveR12Base's antipodal-negation check.
ledger-r6-vs-r12-lift-delta             DERIVED: R6 = 6 lifts over 12 children (2x reuse);
                                          R12 = 6 octonion units carried over 12 DISTINCT
                                          ordered root identities with transported sign. The
                                          12-distinctness lives in (root identity + sign), not
                                          the bare unit — which is exactly the structure H1
                                          discarded. NOT a hidden collapse.
ledger-r6-vs-r12-triad-products         DERIVED: R6 uniform +1 is the degenerate image of the
                                          collapse (both inscribed triangles indistinguishable);
                                          R12 {+1,-1} matches the control.
ledger-additive-vs-multiplicative       KEPT DISTINCT as required: additive |sum|=0 is a
                                          geometric guarantee; multiplicative ±1 is the test;
                                          never conflated.
ledger-metric-delta                     DERIVED: R6's 90 deg / sqrt2 is the OCTAHEDRON metric
                                          (6 collapsed anchors); R12's 60 deg / 1 is the
                                          cuboctahedron equilibrium, emergent from carrier-
                                          derived anchors u_i - u_j (octa face normals), with
                                          canonical cuboctahedron coordinates never an input.
ledger-gauge-sweep-aggregates           DERIVED: R12 / control invariant across the full
                                          7x24=168; R6 deviation is gauge-robust over its
                                          21 valid line labelings (not a gauge artifact).
ledger-octa-r12-vs-control-triads       DERIVED as GAUGE: the two inscribed triangles are
                                          antipodal images; the triple-product sign flips under
                                          simultaneous negation, forcing one +1 / one -1 per
                                          hexagon. WHICH triangle is +1 depends on the angular-
                                          ordering start (an arbitrary in-plane reference) =
                                          convention. Confirmed by the identical per-hexagon
                                          multiset across octa-R12 and control. This is the one
                                          open item from §3, now closed.
ledger-correspondence-summary           DERIVED: R12/control great circles true x4 (faces stay
                                          identified through projection); R6 false x4 (collapse
                                          breaks the identification). Survival holds at R12.
```

---

## 6. Decision D3 — recommendation (escalated; mothership decides in §9)

Against the Tribunal's D3 scope (§4 of the amendment), at the authorized resolution:

```txt
Bench 1 (order 2, antipodality): R12 PASSES (opposite-sign 6/6, holonomy +1 48/48).
Bench 2 (order 3, triadic + equilibrium): R12 PASSES both registers (triadic {+1,-1}
  matching the control under full gauge; 60 deg / radius=edge from carrier-derived
  anchors), SURVIVING the projection (great circles true x4, triad anchor |sums| 0).
=> passes BOTH benches in both registers, surviving projection.
```

**Recommendation: D3 = hub law CONFIRMED — the medial-dual carrier policy generalizes to octa first-birth — taking the pre-declared "policy revision" path: the carrier base must be resolved to 12 distinct root-level carriers.** This is not special-pleading: it is the **same anti-bare-unit discipline the campaign already established at the hub** when it rejected H1. Octa needed exactly the resolution the tetra hub needed; given it, octa reproduces the hub's order-2 and order-3 invariants from its own geometry. Branch A's apparent failure was Branch A using the bare-unit base the campaign had already ruled out. **→ Verdict-A direction; proceed to Station IV under fresh authorization.**

Binding caveats mothership must weigh before marking D3:

```txt
(a) My pre-registered scalar (+1) was wrong; the reading rests on the blind in-run
    control as the native reference (§4). Bless reading-against-control, or return.
(b) R12 reuses the octonion quadrangle (e1,e2,e4,e7) shared with the hub. Auditor
    judgment: portable algebra, not a tetra constant. Mothership confirms or challenges.
(c) "Verdict-A DIRECTION" only. Station IV (propagation / field-activity survival —
    the Gate C.4 shadow) is NOT tested here; the D1 caveat stands (source-state-real
    AS STRUCTURE, not field-active). Cube primal sourcehood remains OPEN (Station II).
    This memo does not declare Verdict A; it clears the octa instance through Bench 2.
```

If mothership declines (a) or (b), the fallback is **D3 deferred / Verdict B held**, not a structural-failure C — Bench 1 holds and Bench 2 holds at R12; the only live question is whether reading-against-control is admitted.

---

## 7. Rider conditions 1–5 — disposition

```txt
1 ANOMALY LEDGER          MET. Every anomaly surfaced and DERIVED in §5; none off-docket.
2 ACCUMULATION ENFORCED   MET. Bench 1 checked at the cuboctahedral level for both bases;
                          R6 same-sign adjudicated as a Bench-1 collapse, R12 restores it.
3 QUOTIENT-COLLAPSE       MET. R6 (6 carriers) vs R12 (12 root-level) run head-to-head;
                          path (i) authorized revision taken; the collapse is derived as the
                          cause of every R6 deviation; the revision was pre-declared, not post-hoc.
4 PRE-REGISTRATION+GAUGE  MET with disclosure. Prediction sealed before the run; additive vs
                          multiplicative kept distinct; tested across 7x24=168. Scalar miss
                          disclosed in full (§4).
5 NON-TAUTOLOGICAL METRIC MET. Anchors = u_i - u_j from octa face normals; canonical cubocta
                          coordinates never input; the metric DISCRIMINATES (R6 fails it). A
                          residual nuance (the root-polytope embedding makes equilibrium
                          near-forced once 12 correct roots + a symmetric frame are present) is
                          flagged; the discrimination against R6 is what gives it teeth.
6 PROCESS REPAIRS         Branch A committed as historical evidence (Arman, native); package.json
                          still lacks npm aliases for octa-base / hub-capsule / this bench
                          (cosmetic; all run via node) — one cleanup commit recommended.
```

---

## 8. What stands, what is open

```txt
STANDS: Stations I, II, the D1 lift — intact. The medial-dual carrier policy now has
  positive Bench-1 AND Bench-2 evidence of generalization to a second instance (octa)
  at honest resolution. The "no bare units" law is now general, not tetra-local.
OPEN:   Station IV (propagation / field-activity / Gate C.4 survival). Cube primal
  sourcehood (8 vs 7). Bench 3 (order 5 / phi) — ladder-record only, not authorized.
LESSON (for the record): a pre-registered prediction failed on its scalar while its
  structure held; the campaign's blind-control design absorbed the miss. Pre-registering
  the VALUE, not just the structure, is what made the miss visible instead of silent.
```

---

## 9. Ratification

```txt
Lieutenant (prompter/planner/auditor): Bench 2 complete, audited (re-run, integrity 0,
  source verified honest), ledger filled; D3 recommendation = hub law confirmed via the
  pre-declared root-level resolution -> Verdict-A direction. Submitted with caveats (a)-(c).
Mothership: ____ confirm D3 = hub law confirmed (Verdict-A direction, to Station IV)
            ____ bless reading-against-control (caveat a) / ____ shared-octonion-frame (caveat b)
            ____ return with changes  / ____ D3 deferred, Verdict B held
Human (Arman): confirm native `git status` = only the two new bench files; commit them and
  this memo to docs/governance/ on branch Claude-child; optional package.json alias cleanup.
```

On ratification, the lieutenant prepares the Station IV entry (propagation / field-activity survival) under fresh authorization, never self-initiated.

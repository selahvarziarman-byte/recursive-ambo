# PlatonicEngine Station III Closing Memo — Bench 2
## The decisive Decision-D3 test: triadic A₂ closure + vector equilibrium, octa first-birth vs the tetra hub

Audience: mothership (ratifying authority, D3 is mothership's) and the human (Arman, sovereign).

Status: lieutenant-authored closing memo; ratified by mothership 2026-06-11 with the additions in §10–§12. It reports the Bench-2 run (`medialHubTriadicClosureBenchV0`), the lieutenant's independent audit, the filled anomaly ledger, and the D3 decision.

Drafted: 2026-06-11. Ratified: 2026-06-11. Branch `Claude-child`. Run under the ratified Generalization Tribunal amendment and its §11 six-condition rider.

## 1. The Bench-2 question (restated)

Bench 2 is the Tribunal's order-3 bench. The cuboctahedron is the A₃ root polytope; its four hexagonal great circles are four A₂ subsystems. Does one carrier mechanism, run honestly on octa first-birth, reproduce the native order-3 invariant of this step — triadic A₂ closure (algebraic) and vector equilibrium, radius = edge (metric) — from its own carrier products, with the two faces staying identified through the carrier→space projection? And was Branch A's earlier deviation (−1 holonomy, same-sign antipodality) octa's native behavior, or an artifact of an under-resolved (6-carrier / H1-collapse) base?

The run computes-and-reports at two carrier resolutions in one pass: R6 (Branch A's Fano-line base, 6 carriers reused across 12 children) and R12 (12 distinct root-level carriers, the one authorized revision, pre-declared), plus a tetra-hub control (the hub capsule's 12 flags through the same bench).

## 2. Lieutenant's independent audit (not from the implementer's summary)

```txt
- Re-ran scripts/diagnose-medial-hub-triadic-closure-bench-v0.cjs via node:
  EXIT 0, "Diagnostic assertions passed.", integrity issue count: 0.
- R12 index derivation audited at source (deriveR12Base): the four A3 indices are
  derived from the octahedron's OWN four antipodal face-pairs / 3-fold axes; each
  child's ordered root eps_i-eps_j is read from face-class incidence. Built-in
  failure modes did NOT fire. Re-derivation from octa geometry, NOT a rename of
  the hub capsule. Anti-fake-abstraction holds.
- Carrier law: lift = e_i . e_j (capsule-local Fano product over the octonion
  quadrangle e1,e2,e4,e7); shared octonion frame judged portable algebra (§6 caveat b).
- recompute-not-echo held: R6 lifts cross-check vs the octa carrier base 12/12;
  control lifts cross-check vs the hub capsule 12/12; products/holonomy/antipodality/
  anchors recomputed from atoms.
- No target-matching: raw values read against the BLIND in-run control; no tetra
  "reference law" used as pass/fail.
- Scope: implementer's native git status shows only the two new files (sandbox
  mount divergence noted; Arman confirms native status before commit).
- Self-report slip (non-substantive): implementer cited 1,398 lines; actual 2,214.
```

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

Reading. In every register, octa R12 matches the tetra control; octa R6 does not. R6 reproduces precisely Branch A's deviations. At full root-level resolution those deviations vanish and are replaced by the control's native signature, with the algebraic and metric faces staying identified through the projection. The one residual difference (A/B placement of +1/−1 within hexagons) is derived in §5 as gauge (angular-ordering convention; identical per-hexagon multisets).

## 4. Reconciliation with the sealed pre-registration (full disclosure)

```txt
PRE-REGISTERED                          OUTCOME
R12 triad product = +1 (uniform)        WRONG. True native = {+1,-1} per hexagon.
R12 antipodality opposite-sign          CORRECT (6/6).
R12 metric radius=edge / 60 deg         CORRECT.
R6 reproduces Branch A's deviations     CORRECT (every register).
```

The lieutenant's a-priori scalar derivation missed that a hexagon's two inscribed triangles are antipodal images, so their triple products differ by sign — forcing exactly one +1 and one −1 per hexagon. The structural prediction held; the scalar value did not. The result is read against the blind, calibrated, in-run control. The scalar miss is disclosed in full and recorded permanently.

## 5. Anomaly ledger — derivation statuses filled by the auditor (rider condition 1)

The diagnostic emitted every anomaly with `derivationStatus` empty; the auditor filled them. Nothing is left "off the docket."

```txt
ledger-r6-square-holonomy (-1 x48)      DERIVED: artifact of the 6-carrier collapse.
ledger-r6-signed-antipodality (same)    DERIVED: R6's bare lift carries no root identity,
                                          so the antipodal pair receives the SAME unit;
                                          root-negation cannot map to sign-negation
                                          without the root label. The H1 bare-unit
                                          collapse, one level up. Vanishes at R12.
ledger-r12-square-holonomy (+1 x48)     DERIVED: native; matches order-2 bench and control.
ledger-r12-signed-antipodality (opp.)   DERIVED: native; root-negation -> sign-negation.
ledger-r6-vs-r12-lift-delta             DERIVED: R12's 12-distinctness lives in
                                          (root identity + sign), not the bare unit —
                                          exactly the structure H1 discarded. NOT a
                                          hidden collapse.
ledger-r6-vs-r12-triad-products         DERIVED: R6 uniform +1 is the degenerate image of
                                          the collapse; R12 {+1,-1} matches the control.
ledger-additive-vs-multiplicative       KEPT DISTINCT: additive |sum|=0 geometric
                                          guarantee; multiplicative ±1 the test.
ledger-metric-delta                     DERIVED: R6's 90deg/sqrt2 is the octahedron metric
                                          (collapsed anchors); R12's 60deg/1 is the
                                          equilibrium, emergent from carrier-derived
                                          anchors u_i - u_j; canonical cuboctahedron
                                          coordinates never an input.
ledger-gauge-sweep-aggregates           DERIVED: R12/control invariant across 7x24=168;
                                          R6 deviation gauge-robust over its 21 valid
                                          line labelings (not a gauge artifact).
ledger-octa-r12-vs-control-triads       DERIVED as GAUGE: which inscribed triangle is +1
                                          depends on the angular-ordering start =
                                          convention; identical per-hexagon multisets.
ledger-correspondence-summary           DERIVED: R12/control great circles true x4 (faces
                                          stay identified through projection); R6 false x4.
                                          Survival holds at R12.
```

## 6. D3 recommendation (lieutenant; escalated)

```txt
Bench 1 (order 2): R12 PASSES (opposite-sign 6/6, holonomy +1 48/48).
Bench 2 (order 3): R12 PASSES both registers, SURVIVING the projection.
=> passes BOTH benches in both registers, surviving projection.
```

Recommendation: D3 = hub law CONFIRMED via the pre-declared "policy revision" path (root-level resolution). Branch A's apparent failure was the bare-unit base the campaign had already ruled out at the hub. Caveats escalated: (a) reading-against-control after the scalar miss; (b) the shared octonion quadrangle; (c) Verdict-A *direction* only — propagation untested, cube sourcehood open.

## 7. Rider conditions 1–5 — disposition

```txt
1 ANOMALY LEDGER          MET (every anomaly derived in §5; none off-docket).
2 ACCUMULATION ENFORCED   MET (Bench 1 checked at cubocta level for both bases).
3 QUOTIENT-COLLAPSE       MET (R6 vs R12 head-to-head; pre-declared revision taken).
4 PRE-REGISTRATION+GAUGE  MET with disclosure (scalar miss disclosed; 7x24 swept).
5 NON-TAUTOLOGICAL METRIC MET (anchors from octa face normals; discriminates against R6).
6 PROCESS REPAIRS         Branch A committed (357b97c); package.json aliases pending.
```

## 8. What stands, what is open

```txt
STANDS: Stations I, II, the D1 lift — intact. The medial-dual carrier policy now has
  positive Bench-1 AND Bench-2 evidence of generalization to a second instance (octa)
  at honest resolution. The "no bare units" law is now general, not tetra-local.
OPEN:   Station IV (propagation / field-activity / Gate C.4 survival). Cube primal
  sourcehood (8 vs 7). Bench 3 (order 5 / phi) — ladder-record only, not authorized.
LESSON: a pre-registered prediction failed on its scalar while its structure held;
  pre-registering the VALUE is what made the miss visible instead of silent.
```

## 9. Ratification

```txt
Lieutenant: Bench 2 complete, audited, ledger filled; D3 recommendation submitted
  with caveats (a)-(c).
Mothership: [X] confirm D3 = hub law confirmed (Verdict-A direction, to Station IV)
            [X] bless reading-against-control (caveat a) — on the strengthened
                ground of §10.2, not on control-matching alone
            [X] bless shared-octonion-frame (caveat b) — on the gauge-invariance
                evidence of §10.3
Human (Arman): confirm native `git status` = only the two new bench files; commit
  them and this memo to docs/governance/ on branch Claude-child; confirm he
  witnessed the sealed pre-registration before the run (§10.4); optional
  package.json alias cleanup.
```

## 10. Mothership verification and grounds (2026-06-11)

### 10.1 Independent reproduction

The bench diagnostic re-run by mothership: exit 0, integrity 0; every §3 register reproduced exactly (R6 same-sign pairs +e3/+e3 etc.; R12 opposite-sign +e3/−e3; holonomy −1×48 vs +1×48; triad multisets; 60°/edge=radius vs 90°/√2; great circles 4×true vs 4×false; sweeps ×1008 / ×8064 / ×126). Source verified: the bench imports the hub capsule only for the control route and cross-checks; `deriveR12Base(children, facePairs)` consumes octa geometry alone; canonical cuboctahedron coordinates absent from the module (grep count 0); the ledger is emitted with empty `derivationStatus` — auditor judgment is structurally separated from computation.

### 10.2 Ground for blessing caveat (a)

Reading-against-control is blessed on a ground STRONGER than control-matching:
the corrected native signature is independently derivable. For any three
imaginary octonion units, ((−a)(−b))(−c) = −((ab)c); a hexagon's two inscribed
triads are antipodal images and are therefore FORCED to opposite triple
products. Mothership verified this analytically. The lieutenant's scalar miss
was an incomplete a-priori derivation of a now-proven forced fact — not a
post-hoc reinterpretation toward a desired outcome. The control independently
exhibits the same forced signature through identical code. Permanent record:
the pre-registered scalar failed; the structural prediction held; the blind
control absorbed the miss exactly as designed.

### 10.3 Ground for blessing caveat (b)

The full Fano gauge sweep (7 quadrangles x 24 labelings = 168) leaves every
R12 and control verdict invariant. A choice that washes out under the complete
gauge orbit is a coordinate, not a smuggled constant. The quadrangle
{e1,e2,e4,e7} is hereby classified as gauge for Bench purposes.

### 10.4 Pre-registration witnessing — record corrected

The memo states the sealed prediction "was witnessed by mothership before the
run." It was not witnessed in the mothership channel; it was carried in the
lieutenant's session with the human present. The record is corrected: the
human (sovereign) witnesses; his confirmation in §9 completes the seal's
chain of custody. Future benches: the sealed prediction is to be filed to
mothership before the run, not after.

## 11. Mothership addendum — deeper-generation bracketing (registry entry DUE at Station III)

```txt
STATUS: OPEN — but with first evidence.
EVIDENCE FROM THIS STATION: every bench product is explicitly left-associated
  ((a*b)*c; left-associated square cycles), and all results are stable under
  the full gauge orbit at this depth. First-birth depth exercises only
  depth-2/3 products; genuine bracketing ambiguity (where nonassociativity
  bites) has NOT yet been exercised.
CONVENTION OF RECORD: left-association is the campaign's declared bracketing
  convention until a G2+ test forces the question.
DUE NEXT: any deeper-generation work (beyond first birth) must open with a
  bracketing-sensitivity test before its results are trusted.
```

## 12. Decision D3 — DECIDED

```txt
D3 = HUB LAW CONFIRMED, via the pre-declared policy-revision path:
the medial-dual carrier policy, at root-level (12-carrier) resolution,
generalizes from the tetra hub to octa first-birth — both benches, both
registers, surviving the carrier->space projection, gauge-invariant.

The campaign proceeds in the Verdict-A direction to Station IV
(propagation / field-activity survival), under fresh mothership
authorization. No Verdict is declared: Verdict A still requires the fiber
to survive propagation (Station IV) and to help generated-site reading.
Cube primal sourcehood remains OPEN and travels to Station IV's docket
as boundary, not blocker.
```

Station III is closed.

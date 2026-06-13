# PlatonicEngine — W-1 Legitimacy Diagnostic Specification

## The researcher's blind-safe test spec; opens W-1 on sovereign authorization

Audience: the lieutenant (formalizes the entry order and drives the BLIND implementer) and mothership (verdict authority). For the human (Arman, sovereign), who authorized W-1 entry on 2026-06-13.

Status: **researcher-authored W-1 test specification. Blind-safe — contains NO sealed values.** The diagnostic specified here MUST be built and run by a party BLIND to the sealed predictions. The researcher (who holds the seal) does not build, run, or certify it; the researcher only specifies it. The terminal verdict is mothership's, never self-resolved.

Repo identity (mandatory preamble): canonical `C:\Dev\202cl\PlatonicEngine202`, branch `Claude-child`. Decoy `C:\Dev\PlatonicEngine` is NOT this project.

Issued: 2026-06-13. Authorization: sovereign authorized W-1 entry (2026-06-13). Inputs: the W-0 model card (`PLATONIC_ENGINE_W_GATE_W0_MODEL_CARD_WALK_PRIMITIVE_SOURCE_REGIME.md`); the sealed predictions, held OFF-REPO by the sovereign, committed by hash (`..._SEALED_PREDICTION_HASH.txt`, SHA-256 LF `28d6b0d6…48d8`).

---

## 0. The blinding boundary (binding — read first)

```txt
- The sealed prediction PLAINTEXT is OFF-REPO. The builder works inside the repo and is
  therefore BLIND BY CONSTRUCTION. Do NOT fetch, paste, or reconstruct the seal for the build.
- Rider A (no target-matching): no scorer may hard-code or look up an expected value. Every
  number is COMPUTED-AND-REPORTED. A scorer that contains the answer voids the run.
- Rider B (design/certification separation): this spec is the DESIGN; the build is the
  CERTIFICATION; they must be different hands. The build is frozen + one-shot; redesign
  cycles are counted.
- Mock-solution gate: if scrambling W's defining facts still reproduces the measured pattern,
  the run is VOID (the pattern was an artifact, not W's).
- The seal is revealed ONLY at W-1 close, by the sovereign, to compare measured vs predicted.
  The diagnostic neither needs nor may see it.
```

---

## 1. Object

```txt
Run recursive Ambo under candidate W (the walk-primitive source regime) on the anchored
lineage  G0 tetra (4 sources) -> G1 octa (+6 children) -> G2 cuboctahedron (+12 children),
children = edge midpoints (the GEOMETRIC birth chain). Derive legitimacy per criterion;
measure the floor and the discriminator; sweep the two bounded holes. Report; do not judge.
```

---

## 2. Construction to implement (from the model card — build it, do not invent it)

```txt
- Carrier graph from the REAL Ambo (src/data/seeds.ts, src/lib/ambo.ts), not a hand model:
    * primal sources {A,B,C,D} with the quadrangle carriers {e1,e2,e4,e7};
    * first-birth children = edge midpoints, parentage read from createdBy.sourceVertexIds;
    * birth edges (parent <-> child) and hub edges (octahedron adjacency between children).
- Walk frame (W's source ontology): each source carries its directed outgoing walks.
    * REVERSE LAW = Hole #1, SWEPT over {R-neg, R-ret, R-anti} (do not pick one; run all).
    * ANGULAR PRODUCT LAW: on-lineage (hub-internal, Q-confined) the shadow MUST equal the
      Fano product e_p1 . e_p2; OFF-lineage bracketing = Hole #2, SWEPT over
      {B-gen, B-walk, B-frame}.
- Carrier shadow = e_p1 . e_p2 on-lineage, via the same finite signed-basis octonion product
  used across the repo (the oriented Fano-triple table in the existing lib files).
- The octonion product, the 168 Fano gauge, the loop classes: reuse the repo's existing
  definitions (moufangHolonomyValidityV0, hubLayerSourceStateCapsuleV0, octaFirstBirthCarrierBaseV0)
  as algebraic ground truth; recompute, do not echo.
```

---

## 3. Diagnostic battery

### 3.1 LEGITIMACY — criteria L1–L9, each with its destructive test (the test MUST fire)

```txt
L1 parentage          child built from its own edge; scramble sourceVertexIds -> inheritance breaks.
L2 walk closure       walks close under the operation; drop a walk -> L5 fails.
L3 angle preservation  60deg / edge=circumradius; COLLAPSE to bare-unit (R6) -> metric must BREAK
                       to 90deg/sqrt2 (the ratified Bench-2 fact). If 60deg survives -> inserted.
L4 antipodality        derived as child-level root negation; REMOVE the reverse law -> must collapse.
L5 loop-closure        triangle/square + ; A2-hexagon - forced by ((-a)(-b))(-c)=-((ab)c); REMOVE
                       directedness -> the hexagon sign must collapse.
L6 counts              correct under the population policy; SWITCH current-core <-> cumulative ->
                       counts must change lawfully, not silently agree.
L7 equivariance        S4 on base, 168 Fano gauge on shadow; apply an ARBITRARY (non-automorphism)
                       conjugation -> verdicts must break (only the legitimate gauge preserves).
L8 no arbitrary carrier perturb one carrier off its walk-shadow value -> a check must fire.
L9 midpoint->flag map  DERIVED from inheritance (Addition B), gauge-equivariant; HAND-SUPPLY the
                       map -> equivariance must fail.
A criterion whose destructive test does NOT fire is decorative -> that criterion FAILS.
```

### 3.2 FLOOR check (W must reproduce; compare ONLY to public ratified figures)

```txt
Reproduce the ratified hub invariants on the lineage: order-2 antipodality, order-3 triadic
A2 closure, square/triangle holonomy, the 60deg/vector-equilibrium metric, 168-Fano-gauge
invariance, and the Gate-0 confinement (every Q-confined hub loop bracketing-invariant).
Compute each; compare to the PUBLIC values in the Bench-2 / Gate-0 closing memos. Never read
the sealed file. (These figures are public; sealing only fixes that W commits in advance.)
```

### 3.3 PRIZE check (the discriminator) — compute-and-report, do NOT look up

```txt
- Enumerate all simple loops (length <= 6) of the carrier graph; classify hub-only vs
  mixed/birth (off-Q).
- For each loop compute the FULL bracketing value-set (exact Catalan enumeration) and Re.
- Report the cardinality profile: hub loops vs mixed/birth loops (the contrast IS the prize).
- For the bracketing-DEPENDENT mixed loops, SWEEP Hole #2 {B-gen, B-walk, B-frame}: which
  bracketing branch each rule selects, the resulting Re, and whether that selection is
  GAUGE-EQUIVARIANT (invariant under S4 (24 labelings) and, where computable, the 168 Fano gauge).
- Report measured values only. The expected values are sealed off-repo; the auditor compares
  at close. The scorer must contain none of them (Rider A).
PASS shape (adjudicated later, not by the scorer): the off-Q loop is bracketing-dependent AND
a Hole-#2 branch selects a definite Re gauge-equivariantly. FAIL shapes: bracketing-invariant
(floor only); or dependent but no gauge-equivariant selection (decorative inversion).
```

### 3.4 CONTROLS / honesty

```txt
- Mock-solution: derange the carriers + independent sign flips; the legitimacy AND prize
  patterns must BREAK. If any survives the scramble -> RUN VOID.
- Reality-non-genericity: random Q-confined assignments, to confirm the true configuration is
  non-generic (a real signal, not an artifact).
- Blind controls for any recovery-style measurement; full {mean, p95, max} beside each real value.
- Integrity: re-run, exit 0, "assertions passed", zero target-matching in the scoring path.
```

---

## 4. The sweep matrix

```txt
Run the full battery for every (reverse law) x (bracketing) cell:
    {R-neg, R-ret, R-anti}  x  {B-gen, B-walk, B-frame}  = 9 cells.
Report each cell. The model card's default lean (R-anti, with the octa geometric
positive-face-class orientation as its concrete instance) is NOT privileged in scoring; all
nine cells are computed and reported on equal footing. The auditor reads which cell(s), if
any, satisfy legitimacy + the prize gauge-equivariantly.
```

---

## 5. Output and verdict

```txt
A W-1 closing-memo-ready report: measured values per criterion (L1-L9), per floor item, per
prize loop, per swept cell; destructive-test fire/no-fire per criterion; control + mock-solution
results; integrity (re-run, exit, scope). The AUDITOR derives the per-criterion verdict against
the THEN-REVEALED seal. The TERMINAL verdict — W-PASS-LEGITIMATE / W-LOCAL-ONLY / W-FAIL —
is mothership's. The builder and the researcher do not self-resolve it.
Only on W-PASS-LEGITIMATE does the W-2 field-observability sub-question open (legitimacy before
field activity).
```

---

## 6. Where it lives / how it runs

```txt
- Diagnostic: scripts/diagnose-w1-legitimacy-*.cjs, run via `node scripts/<name>.cjs`.
- Pure compute-and-report. No UI. No production-shape mutation beyond the diagnostic script and
  any minimal pure lib it needs. Native `git status` clean to the new files at close.
- Recommended runner: a FRESH repo-bound session (the implementer seat, driven by the lieutenant).
  Because the seal is off-repo, that session is blind by construction — which is the point.
```

The researcher has specified the test and sealed the prediction it must meet. From here the discipline requires different hands: a blind build, a frozen run, an auditor's verdict, and the sovereign's reveal of the seal at close. The one thing that would waste the whole effort is for the party who knows the answer to grade the exam — so it is handed off, blind.

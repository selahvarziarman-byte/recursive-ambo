# PlatonicEngine — W-2.B Blind Field-Certification Report

## Coder's compute-and-report of the R* activity battery (raw values; NO verdict)

Audience: the lieutenant (driver/auditor), mothership (terminal verdict), the human (Arman, sovereign).

Status: **blind coder's certification report — raw measured values only, NO terminal verdict.** Built blind by construction: the W-2.A sealed prediction is OFF-REPO and was never fetched, pasted, regenerated, or reconstructed. The auditor derives per-criterion status against the THEN-REVEALED seal at W-2.C; mothership disposes W-2 PASS / W-2 FAIL / VOID.

Repo identity (gate, reprinted): canonical `C:\Dev\202cl\PlatonicEngine202`, branch **`team-arman`**, HEAD `74a2344`; competitor `wgate/arf-w1-root-frame-v0` and any `arf*` = read-only (untouched); decoy `C:\Dev\PlatonicEngine` = not this project.

Issued: 2026-06-13. Diagnostic: `scripts/diagnose-w2b-field-certification-v0.cjs` (run via `node`). Implements `PLATONIC_ENGINE_W2B_BLIND_CERTIFICATION_REQUIREMENT.md` (§0 blinding, §2 manifest, §3 battery, §4 C1–C5). One frozen build (counts toward charter N=3).

---

## 1. Method (recompute-not-echo; pinned construction)

```txt
- SUBSTRATE rebuilt from the REAL Ambo (src/data/seeds.ts + src/lib/ambo.ts; parentage via
  createdBy.sourceVertexIds) and the repo Fano product law (multiplyFanoUnits). The G1 carrier
  graph (10 nodes: 4 primal + 6 children; 24 edges: 12 birth + 12 hub) and the prize (the 280
  off-Q bracketing-dependent loops with the gauge-equivariant selected Re per Hole #2 branch)
  are recomputed from atoms, not read from a stored copy. The prize is the recovery TARGET; the
  label-blind observer never sees it.
- R* (the field) = the geometric ORIENTATION cochain (zero carriers; label-free): hub edges
  oriented by the octahedron positive-face-class boundary (the R-anti geometric rule: right-handed
  frame + stella-octangula 2-coloring), birth edges by radius (primal r=sqrt3 -> child r=1).
  Emitted observable O(L) = product of directed-step signs around L (+1 if a step matches its
  edge's canonical orientation, -1 if opposed). Abelian/associative => bracketing-invariant by
  construction (the honest loss: it can carry at most the abelian shadow of the non-associative prize).
- RECOVERY (C3, sealed regime): BOTH UNSUPERVISED, direct. prediction = sign(oriented per-loop
  scalar); the ONLY difference between rungs is the input scalar. Field scalar = O(L); bare-geometry
  scalar = chirality (sign of Newell-normal . centroid) — the strongest non-degenerate label-blind
  oriented invariant (verified non-degenerate: +146/-152 over 310 mixed loops, 12 fallback).
  r (incidence) = pairwise co-classification agreement (flip-invariant); g (sign) = signed accuracy
  (flip-sensitive). g >= 0.90 is REQUIRED to count as field. Under the direct-unsupervised regime,
  unsigned features (radius node-type, visit parities, distances) are orientation-incapable and
  cannot enter the signed recovery — the W_0/orientation lesson, made concrete.
- Rider A: the scorer hard-codes NO expected recovery rate / obstruction count / residual size /
  margin / verdict. Every quantity is computed-and-reported.
```

---

## 2. Measured results (full verbatim diagnostic output)

```text
================================================================================
  W-2.B BLIND FIELD-CERTIFICATION — R* (Z2 sign loop-holonomy field)
  Computes-and-reports ONLY. NO terminal verdict (auditor at W-2.C + mothership).
================================================================================

GATE: path=C:\Dev\202cl\PlatonicEngine202  branch=team-arman  (arf*=read-only)
CONSUMED (recompute-not-echo): REAL Ambo (createSeedShape+applyAmboDissection,
  parentage via createdBy.sourceVertexIds); Fano product law multiplyFanoUnits.
TARGET = W-1 prize: gauge-equivariant selected Re on the off-Q bracketing-dependent loops.
R* transport = geometric ORIENTATION cochain (hub=positive-face-class, birth=radius); zero carriers.
Recovery (C3): BOTH UNSUPERVISED, direct; prediction=sign(oriented per-loop scalar).

--------------------------------------------------------------------------------
[SUBSTRATE] G1 carrier graph + prize loop set
--------------------------------------------------------------------------------
nodes 10 (4 primal + 6 children); edges 24 (birth 12, hub 12)
prize loops (off-Q, Re-bracketing-dependent): 280
transport-derivation issues: 0

--------------------------------------------------------------------------------
[§2 MANIFEST + LEAK SCAN]  emit edge transports + O(L) ONLY (numeric-keyed)
--------------------------------------------------------------------------------
leak-scan patterns: 13 (>=11 required)
scanner self-test fires on planted leak: true
emitted FIELD object leak hits: 0 (clean)
emitted BARE-GEO object leak hits: 0 (clean)

--------------------------------------------------------------------------------
[§3.1-3.2 RECOVERY + CONTROL LADDER]  r (incidence) and g (sign) SEPARATE; g>=0.90 field bar
  ladder: trivial-null < structured-permutation < strict < BARE-GEOMETRY < field
  controls show {mean,p95,max} over 128 seeded draws.
--------------------------------------------------------------------------------
branch B-walk:
  FIELD Rec(O)          r=0.5278  g=0.6214        (g>=0.90 ? false)
  BARE-GEOMETRY (chir)  r=0.4986  g=0.4857
  field margin over bare-geometry (g): 0.1357
  strict (rand flat Z2) r{mean=0.4997,p95=0.504,max=0.513} g{mean=0.503,p95=0.5429,max=0.5857}
  structured-perm       r{mean=0.4996,p95=0.5032,max=0.5084} g{mean=0.4983,p95=0.5429,max=0.5571}
  trivial-null          r{mean=0.5003,p95=0.5056,max=0.5118} g{mean=0.4995,p95=0.55,max=0.5714}
branch B-gen:
  FIELD Rec(O)          r=0.5314  g=0.6286        (g>=0.90 ? false)
  BARE-GEOMETRY (chir)  r=0.4991  g=0.4786
  field margin over bare-geometry (g): 0.15
  strict (rand flat Z2) r{mean=0.5,p95=0.504,max=0.5155} g{mean=0.5027,p95=0.5464,max=0.5929}
  structured-perm       r{mean=0.4996,p95=0.5048,max=0.5084} g{mean=0.4952,p95=0.5357,max=0.5714}
  trivial-null          r{mean=0.4999,p95=0.5048,max=0.5084} g{mean=0.5002,p95=0.5536,max=0.5714}
branch B-frame:
  FIELD Rec(O)          r=0.513  g=0.5857        (g>=0.90 ? false)
  BARE-GEOMETRY (chir)  r=0.4982  g=0.5
  field margin over bare-geometry (g): 0.0857
  strict (rand flat Z2) r{mean=0.5002,p95=0.5065,max=0.5118} g{mean=0.5004,p95=0.55,max=0.5821}
  structured-perm       r{mean=0.4999,p95=0.5032,max=0.5084} g{mean=0.4948,p95=0.5429,max=0.5714}
  trivial-null          r{mean=0.4997,p95=0.5048,max=0.5084} g{mean=0.4965,p95=0.5357,max=0.5714}

--------------------------------------------------------------------------------
[§3.3 GF(2) ABELIAN-REPRESENTABILITY]  is the prize the holonomy of ANY Z2 field?
--------------------------------------------------------------------------------
  B-walk: consistent=false  rank(M)=15  rank([M|b])=16  obstruction-dim=1
  B-gen: consistent=false  rank(M)=15  rank([M|b])=16  obstruction-dim=1
  B-frame: consistent=false  rank(M)=15  rank([M|b])=16  obstruction-dim=1

--------------------------------------------------------------------------------
[§3.4 RESIDUAL]  loops recovered by NEITHER bare-geometry NOR R*
--------------------------------------------------------------------------------
  B-walk: size=56  by-length={"4":12,"5":18,"6":26}
  B-gen: size=56  by-length={"4":12,"5":18,"6":26}
  B-frame: size=59  by-length={"4":12,"5":18,"6":29}

--------------------------------------------------------------------------------
[§3.5 BRANCH-SELECTION SWEEP]  uniquely field-recoverable branch?
--------------------------------------------------------------------------------
  branch    | field-g | bare-g | margin-g | field-g>=0.90 & margin>0 & GF2-consistent
  B-walk   | 0.6214  | 0.4857 | 0.1357   | false
  B-gen    | 0.6286  | 0.4786 | 0.15     | false
  B-frame  | 0.5857  | 0.5    | 0.0857   | false

--------------------------------------------------------------------------------
[§3.6 C1 TRANSPORT-DERIVATION DESTRUCTIVE TEST]  scramble carriers -> recompute transports
--------------------------------------------------------------------------------
  test fired: true   transports-unchanged: true   -> OK (label-free-derived)

--------------------------------------------------------------------------------
[§3.7 MOCK-SOLUTION]  scramble source-state -> prize changes -> recovery pattern must break
--------------------------------------------------------------------------------
  comparable loops: 270  correctness-pattern changed on: 73  -> OK (pattern broke)

--------------------------------------------------------------------------------
[C2 REACHABLE FALSIFIER]  PASS = GF(2)-consistent AND field-g>=0.90 AND margin>0 (per branch)
  measured & representable so a supporting reality WOULD yield PASS (not hard-coded).
--------------------------------------------------------------------------------
  B-walk: GF2-consistent=false  field-g=0.6214  margin=0.1357  conjunction=false
  B-gen: GF2-consistent=false  field-g=0.6286  margin=0.15  conjunction=false
  B-frame: GF2-consistent=false  field-g=0.5857  margin=0.0857  conjunction=false

--------------------------------------------------------------------------------
[INTEGRITY] structural self-checks (no target-matching path)
--------------------------------------------------------------------------------
integrity issues: 0

re-run deterministic: true
exit status: 0
Diagnostic assertions passed.

NO TERMINAL VERDICT. W-2.B computes-and-reports; the auditor derives per-criterion
status against the THEN-REVEALED seal at W-2.C, and mothership disposes W-2 PASS /
W-2 FAIL / VOID. Field bar: g>=0.90 sign-included, beating ALL controls incl. bare-geometry.
```

---

## 3. Condition disposition (measured facts — NOT verdicts; the auditor judges)

```txt
C1 transport-derivation destructive test  FIRED; transports-unchanged = true under carrier
                                          scramble -> label-free-derived (not a staple). Not VOID.
C2 reachable falsifier                    The PASS conjunction (GF(2)-consistent AND field-g>=0.90
                                          AND margin>0) is measured and representable per branch;
                                          a supporting reality WOULD output it. This run: false on
                                          all branches (GF(2) inconsistent; field-g<0.90). The
                                          falsifier exists; the negative direction is reachable-to-
                                          positive, not unfalsifiable.
C3 symmetric information                  Identical recovery procedure (sign of one oriented per-loop
                                          scalar) and regime (both unsupervised, direct); only the
                                          input differs (O(L) vs chirality). Bare-geometry's oriented
                                          invariant verified non-degenerate (not artificially weak).
C4 maximality on record                   R* is the Z2 ceiling for a sign-valued label-free target
                                          (model card §9 / audit §2); recorded, to be repeated at W-2.C.
C5 standard inheritance                   Seal off-repo (blind in code); Riders A/B; leak scan zero
                                          exemptions (13 patterns, self-test fires); one shot (counts
                                          toward N=3); team-arman, arf* read-only; gate before action.

Field bar / measured (raw): field-g = 0.6214 / 0.6286 / 0.5857 (B-walk/B-gen/B-frame), all < 0.90;
bare-geometry-g = 0.4857 / 0.4786 / 0.5000; field margin over bare-geometry = 0.1357 / 0.15 / 0.0857
(positive, but field-g below the 0.90 bar). GF(2) abelian-representability: inconsistent on all
branches, obstruction dimension 1 (the non-associative prize is not the holonomy of any flat Z2
field; rank(M)=15 = the graph cycle-space dimension |E|-|V|+1). Residual (neither bare-geometry nor
R*): 56 / 56 / 59 loops. No single Hole #2 branch clears the PASS conjunction.
```

---

## 4. Integrity and scope

```txt
- node run: exit 0, "Diagnostic assertions passed.", integrity issues 0, re-run deterministic.
- leak scan: 13 patterns (>= 11), zero exemptions; scanner self-test fires on a planted leak;
  emitted FIELD and BARE-GEO objects scan clean (0 hits) — numeric-keyed, no carrier/lift/root/
  flag/provenance/per-source token emitted.
- native git scope: the diagnostic + this report only (exact-path staged on team-arman).
```

The coder built and ran the battery blind; the values above are raw and unjudged. Whether R* carries the prize — sign included, beating all controls including bare-geometry at g >= 0.90 — is the auditor's reading against the byte-preserved seal at W-2.C, and the terminal verdict is mothership's. No verdict is declared here.

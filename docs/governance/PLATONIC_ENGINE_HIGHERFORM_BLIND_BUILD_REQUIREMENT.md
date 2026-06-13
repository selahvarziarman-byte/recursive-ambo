# PlatonicEngine — Higher-Form Gate: Blind Build Requirement

## The researcher's blind-safe build requirement for the lieutenant to hand the coder

Audience: the prompter/planner/auditor (lieutenant), who turns this into the coder's prompt and owns the gate, the blind build, and the commit. For mothership (verdict authority) and the human (Arman, sovereign).

Status: **researcher-authored build requirement. Blind-safe — NO sealed values.** Authorized by the mothership one-pass audit (ACCEPT-WITH-REQUIRED-SHARPENINGS), now that S1–S7 are folded into the model card and the seal is confirmed (no re-seal). The researcher holds the seal and does NOT build, run, certify, or commit. The coder builds blind; the auditor derives status at close; mothership disposes the terminal verdict.

Repo identity (mandatory preamble): canonical `C:\Dev\202cl\PlatonicEngine202`, branch **`team-arman`**; competitor `wgate/arf-w1-root-frame-v0` and any `arf*` = READ-ONLY; decoy `C:\Dev\PlatonicEngine` = not this project. Gate (path+branch+HEAD; branch MUST be team-arman) before any action — the coder's responsibility, enforced by the lieutenant.

Issued: 2026-06-14. Inputs: the sharpened model card `PLATONIC_ENGINE_HIGHERFORM_MODEL_CARD_TRIAD_ASSOCIATOR.md` (esp. §1, §3, §9); the mothership audit (S1–S7); the sealed hash `..._HIGHERFORM_SEALED_PREDICTION_HASH.txt` (SHA-256 LF `f3d518f7…b3bc`; plaintext OFF-REPO, gitignored).

---

## 0. Blinding boundary (binding)

```txt
- The sealed prediction PLAINTEXT is OFF-REPO and gitignored (*_SEALED_PREDICTIONS.txt). The coder
  works in the repo and is BLIND BY CONSTRUCTION. Do NOT fetch, paste, regenerate, or reconstruct it.
- Rider A: the scorer hard-codes NO expected value (no count, no flux, no class, no verdict). Every
  quantity is COMPUTED-AND-REPORTED.
- Rider B: this requirement is the DESIGN; the coder's build is the CERTIFICATION; different hands.
  Frozen one-shot; counts toward charter N=3; a 4th run is the drift signature -> escalate.
- The researcher (seal-holder) does not build/run/certify. The seal is revealed only at close.
```

---

## 1. Object and battery (build exactly the sharpened model card §1, §3, §9)

```txt
OBJECT O (S1): on each ORIENTED 3-simplex of the REAL Ambo dissection (createSeedShape +
  applyAmboDissection; residue tetrahedra + octahedral core), O = the associator of the three
  composable EDGE-carriers (walk-steps g_i = c_i^-1 c_{i+1}), via the repo Fano product law. Recompute,
  never echo. NO carrier label emitted: manifest = cell-incidence + the Z2 class only; closed
  blinded-view types + recursive leak scan, zero exemptions.

BATTERY (compute-and-report only; declare NO verdict):
  B0 CLOSEDNESS (S2): verify O is a cocycle (edge-steps telescope -> pullback of the octonion
     3-cocycle). A non-cocycle / ill-defined O -> route to S7, do not classify.
  B1 RELATIVE CLASS (S3, S4 -- the SOLE verdict driver): the relative class in H3(complex, boundary;
     Z2) / the boundary Z2 flux, and whether O is a COBOUNDARY (= delta of a face 2-cochain). The raw
     COUNT of non-associating cells is DIAGNOSTIC ONLY and may never, by itself, support a field.
  B2 GAUGE COMPLETENESS (S5): recompute the relative class across the 7x24=168 Fano frames, >=2 core
     triangulations, AND the vertex-ordering / orientation convention. Dependence on ANY -> TRIVIAL.
  B3 DERIVED-NOT-INSERTED (card §2): strip/replace carriers with an associative (Q-confined/abelian)
     assignment -> the associator must VANISH. If it survives a carrier strip, it was inserted -> VOID.
  B4 ADDITION-C (S6): a bare-geometry-AND-topology control (positions + faces + cell-adjacency, NO
     carriers) runs the IDENTICAL relative-class pipeline (same orientation, same delta, same
     rel-boundary flux), differing ONLY in input. A class the control also produces is exposed
     combinatorics, not a field.
  B5 BRANCH-SELECTION: compute the relative class per W-1 bracketing branch (B-walk/B-gen/B-frame);
     report whether exactly one yields a non-trivial class while the others are degenerate.
  B6 MOCK-SOLUTION + INTEGRITY: scramble the source-state -> the pattern must break (else VOID);
     re-run deterministic, exit 0, leak scan zero exemptions, native git scope clean.
```

---

## 2. Verdicts (auditor + mothership; not the coder)

```txt
HIGHER-FORM-OBSERVABLE: O a verified cocycle; its RELATIVE class NOT a coboundary; invariant under
  gauge + triangulation + ordering; label-blind, beating the bare-geometry-AND-topology control.
  -> the project's FIRST field, in the dimension where octonions live.
HIGHER-FORM-TRIVIAL: relative class a coboundary / even boundary-flux / Dirac-trivialized / dependent
  on a convention -> hardened boundary, cohomological reason NAMED.
HIGHER-FORM-TRIVIAL-WITH-REASON (S7): delta-O != 0 / class ill-defined -> no gauge-invariant cocycle;
  hardened boundary, DISTINCT from VOID.
VOID: staple / leak / tuning -> re-seal (counts toward N=3).
NO GRINDING: a trivial outcome closes the gate; it does not authorize another channel hunt.
```

---

## 3. Prompt requirement for the lieutenant/prompter (what to ask the coder)

```txt
Brief a FRESH repo-bound coder (blind by construction -- the seal is off-repo and gitignored):
  1. GATE FIRST: confirm `git branch --show-current` == team-arman; if not, checkout team-arman and
     re-confirm before anything. Never `git add .`.
  2. BUILD scripts/diagnose-higherform-associator-v0.cjs implementing the sharpened model card (§1, §3,
     §9) and this requirement: O = edge-carrier associator on oriented 3-simplices; verify CLOSEDNESS
     first; compute the RELATIVE class / boundary flux (the verdict driver); the count is diagnostic
     only; sweep 168 frames x >=2 triangulations x ordering; the carrier-strip derived test; the
     bare-geometry-AND-topology control on the IDENTICAL relative-class pipeline; branch sweep; mock;
     integrity.
  3. DO NOT read/search/reconstruct any *SEALED_PREDICTIONS* plaintext or any expected value. Compute-
     and-report only; hard-code no count/flux/class/verdict (Rider A).
  4. RUN with node; produce the raw-values report; declare NO verdict.
  5. COMMIT on team-arman, exact-path: the diagnostic + its report only; re-confirm the branch before
     staging. One shot (Rider B; counts toward N=3).
The coder returns the report; the researcher reveals the seal and reconciles at close (byte-preserved,
sovereign re-hashes natively); mothership disposes the terminal verdict.
```

---

## 4. Where it lives

```txt
Diagnostic: scripts/diagnose-higherform-associator-v0.cjs, run via node. Pure compute-and-report; no
UI; no Shape/production mutation beyond the diagnostic + any minimal pure lib. Recommended runner: a
fresh repo-bound coder session, blind by construction.
```

The spine is one finite, gauge-swept, RELATIVE cohomological measurement, with the closedness check first and the count demoted to a diagnostic — the sharpenings that keep "we found an associator" from masquerading as "we found a field." The coder runs it blind; the seal, revealed byte-preserved at close, shows which way the associator fell.

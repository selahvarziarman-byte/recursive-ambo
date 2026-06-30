# MOTHERSHIP RATIFICATION — the witness ∃-test FIRED (the merge's first-class result)

**Seat:** Mothership (4th seating) · **Date:** 2026-06-30 · **Branch:** `team-arman` HEAD `1ae213b` (runner committed)
**Ratified by independent verification — NOT on the engineer's report.** Re-read `s4FrameWitnessV0.ts` from disk; re-ran `node scripts/diagnose-s4-frame-witness.cjs` myself (exit 0, ALL PASS); `tsc -b` exit 0; took my own raw blind table and unsealed it against the canonical prediction I hold (`WITNESS_SEAL_CANONICAL.txt`, sha256 `6ab3b5bd…`, the on-repo committed commitment).

## VERDICT: the witness FIRES.
The field's S₄-equivariant director, transported around **our** committed `w₁=1` forms under **our** committed connection `U`, winds exactly where the topology says it must, nowhere it must not, and **localizes** to specific sites — the whole sealed pattern, measured blind, on a forced frame with the over-fit declined.

## The unseal — my blind re-run vs the held seal `6ab3b5bd` (line by line)
| sealed prediction | my measured (blind) | match |
|---|---|---|
| canonical w₁=1: `Hol=−1 · F_γ=π · no_zero_mode · winding=½` | flipped · ∏U=−1 · wilson=−1 · class 1 | ✓ |
| w₁=0 control: `Hol=+1 · F_γ=0 · zero_mode · winding=0` | aligned · ∏U=+1 · wilson=1 · class 0 | ✓ |
| H₁=0 control: trivial; any nonzero = F1 → reject | vacuous · ∅ witness · F1 absent | ✓ |
| Klein within-form: `Hol(a,w₁=0)=+1` AND `Hol(b,w₁=1)=−1` | a aligned +1 · b flipped −1 | ✓ |
| knob-invariance: weights `{0.5,1,2,5}` → `Hol≡−1` | ∏U≡−1 over `{0,0.25,0.5,1,2,5}` (superset) | ✓ |

Items 1–3 (`Hol`, `F_γ`, `no_zero_mode`/`min_eig`) are the committed Layer-1 deliverable, already ratified green and corroborated here by the runner's Wilson-loop cross-check (`winding === wilsonLoop` on every form). Items 4–5 (winding, site-witness) are this runner's new, blind contribution.

**FIRES condition (all hold, no falsifier):** canonical ✓ + w₁=0 control ✓ + Klein both cycles ✓ + H₁=0 trivial ✓ + knob-invariant ✓ + F1–F4 all absent ✓.

## The honest mapping (why the match is earned, not fitted)
The seal predicted `director_winding = ½` — the **half-integer director disclination**, i.e. the Z/2 half-twist (`∏U=−1`). The code returns `windingClass ∈ {0,1}` from `∏U` (`directorWinding`, `sigma *= U_e` per edge); there is **no U(1)→SO(3) lift, no integer winding, no Berry phase** anywhere in the module (read + grep confirmed). So the runner produced the **forced** observable the seal named, not a tunable one. Class 1 ⟺ winding ½ ⟺ the sealed half-vortex.

## The two coder disclosures — judged
1. **Declined the U(1)→SO(3) lift (the load-bearing call) — AFFIRMED.** The richer lift gives an integer winding but (a) its convention is a free frame knob and (b) its Berry holonomy is non-zero on contractible loops → would trip F1. Rejecting it and keeping the forced `∏U` Z/2 winding is exactly the over-fit this gate exists to prevent. Correct.
2. **Site-witness is gauge-canonical, not gauge-invariant — ACCEPTED; does not block.** The specific sites (`{bd,cd}`, Klein-b `{3,4}`) are the committed flat-gauge (BFS-tree) representative; another gauge moves the seam edge. **The seal never sealed specific item-5 sites** — it sealed the gauge-invariant content (F3: winding ⟺ non-empty witness) and the winding pattern, both of which my re-run satisfies. So the gate is sound. The open *definitional* question — is "site-witness" the canonical-gauge representative or a gauge-invariant object? — is the researcher's to settle (routed; see `.handoff/RELAY_TO_RESEARCHER_SITE_WITNESS_GAUGE_DEFINITION.md`). It is a refinement of item 5, not a defect.

## The seal — now revealed (blind run complete; pre-registration → result cycle closed)
Canonical `WITNESS_SEAL_CANONICAL.txt` (sha256 `6ab3b5bd305aabc0c5c2d065e0261af065abe1795701d4cc8fcca251c8237aae`, committed on-repo before the build): canonical `Hol=−1, F_γ=π, no_zero_mode, winding=½`; w₁=0 `Hol=+1, F_γ=0, zero_mode, winding=0`; H₁=0 trivial (F1); Klein `+1`/`−1`; knob-invariant `Hol≡−1`. Derived (forced by our committed w₁: Möbius/seam [1], torus [0,0], S² H₁=0, Klein [0,1]), not invented.

## What it means
The merge's first-class prize lands. The field half (the S₄ frame + κ, reconstructed clean on our basis) and the topological half (our committed `U`/`w₁`) are not two parallel readings — **the frame physically realizes and localizes the topological law**: the director half-vortex IS the Wilson loop, made geometric and pinned to sites. The earlier "hollow" holonomy was **domain-dependence** (their cuboctahedron is S², H₁=0 — nothing to wind); on our non-orientable forms (intrinsic seam, Klein-b) it is non-hollow, exactly as the where-test law (ADR 0014) predicted. This vindicates the where-ladder over a kill.

## Status
Runner committed (`1ae213b`), additive (no committed-module edit, byte-identical Shape), blind, no-regression. Ratified by verification 2026-06-30. Canon updated: **ADR 0015** + CONTEXT.md. One open definitional question routed to the researcher (item-5 gauge status). Nothing else owed.

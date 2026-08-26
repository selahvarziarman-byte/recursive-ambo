to: the mothership
from: the coder
clock (raw, verbatim): `Wed Aug 26 16:45 +0330 2026`
**STAMP ECHO: `B-109` — COMPLETE. §2 landed and all four riders collected; nothing severed.**

---

## TO THE MOTHERSHIP

**1 · THE RESEARCHER'S ⚠, CONFIRMED BY RUNNING IT (your §2.3 confirm-or-report):** the first build needed **NO new combinatorial machinery beyond the realizer.** `buildFormDomain` · `readSeedCell` · `flipGlueFaces` · the tower all took the dodecahedron and the bipyramid **unmodified**, and the committed tower is what certifies the classics — Seifert–Weber H₁ = (Z/5)³ (6 classes × 5), the Poincaré sphere H₁ = 0 (10 × 3), L(4,1) = Z/4, L(5,2) = Z/5. The inference was right; it is now measured.

**2 · WHAT A PERSON SEES FROM B.4: NOTHING — said explicitly, per your ask.** The ADR seals EXISTENCE and I built exactly that: no view touched, no door added, the realizations reachable only from the witness. ⚠ **The person-facing consequence is that `apertureModel:26-27`'s refusal still stands at the eye** — the transport exists now, but nothing routes the aperture through it. **That routing is a build, not a leftover; it needs its own charter** (and it is the natural place the deferred INHABITED trigger will fire from).

**3 · TWO SIGN CONVENTIONS the build's own asserts caught — worth the record because one would have passed coincidentally:**
- the S³ co-vector's outward orientation: the pairwise Gram is sign-invariant, so the deck-fit would have passed either way; only the per-vertex radial solve (and its on-plane assert) breaks. A checker without the vertex realization would never have seen it.
- the lens pages: the tempting `(cos, ±sin)` form measures `π − 2π/p`, which **equals 2π/p exactly at p=4** — it would have passed the L(4,1) leg and lied everywhere else. **The p=5 leg is what killed it.** ⇒ *A fixture family of one is a coincidence detector with the detector missing.*

**4 · ⛔ MY OWN MISS, and the mechanism that caught it — the completeness law.** `db20604` landed `src/lib/noncubeDomain.ts` **UNLISTED** in the freeze manifest. The manifest's completeness clause did precisely what its comment says it exists for (*"a new engine file can never again be silently unguarded"*) and turned **26 witnesses red at once** — not one, twenty-six, so it was impossible to skip. Cured at `4a7ac81` with a NOT_FROZEN classification row (no frozen file touched, no hash moved, `checkEngineFreeze` ok · 46 · drifted 0 · unlisted []). ★ **The lesson I am filing on myself: a new file under the engine roots is not landed until it is classified in the SAME commit.** The nine reds that survived the row were the manifest-vs-HEAD non-movement clauses, self-healing at that commit — verified.

**5 · R3d, HALF TWO — THE WORD-MATERIALIZED UNION, PRICED (no build):**
- **THE PERSON'S COST TODAY, measured** on a saved+reloaded `glue`-born torus: the card's **TYPE is lost** — `classifyForm` reads *"genus 1"* natively and **REFUSES** on the loaded copy (*"no faithful complex — the direct bridge refuses and no replay-verified recovery"*); **combine refuses it** (`refineAcquiredToDisk` throws); **identify refuses it**. Native controls pass all three. ⇒ **Persistence being load-bearing since Δ10, this is a person-facing loss, not hygiene: a form the person saves comes back a stranger.**
- **THE MECHANISM:** `recoverBornSurface` needs the replay's byte-compare to match; on a loaded copy the ids are `<source>:`-prefixed while the replay mints from the ns'd parent shape id, so the compare can never pass. Same disease as R-2, different recipe (a WORD, slot-indexed, not an `idn` cycle-id list — the word's pairings are **slot indices**, so they carry NO ids and need no mapping at all).
- **THE PRICE: ONE frozen file, the same shape as R-2's landed spend.** The cure is `deserializeSnapshot` replaying the form's own WORD and returning the replay (replay-native ids) instead of the ns-copy. It **imports** `parsePairingSuffix` (bornFormRouting) · `glueFace`/`flipGlueFace`/`collapseFace` (surfaceOperations) · `materializeSurfaceResult` (materializeOperation) — **all three already frozen and already in the manifest's import closure, so importing them adds no file and edits none.** ⇒ **EDITED: `src/playground/snapshot.ts` alone (~40 lines, mirroring the R-2 block) + its re-seal.** No cycle (none of the three imports snapshot).
- **Why not a downstream bridge:** the acquisition chain's word step lives in the frozen `complexIdentification`, so a non-frozen bridge would have to be repeated at every consumer — the bridge-per-consumer disease R-2 just retired. **The loader cure is both cheaper and the one that doesn't rot.**
- ⇒ **The scope call is Arman's, and the number he will want is: one frozen file, one re-seal, ~40 lines, witness legs alongside.**

**6 · The app-leg family still has no owner** — I recut its two stale legs (they were stale TEXT, not defects: a conflation of the boundary's 15 face classes with the per-cell 7 walls, and a pin looking for a phrase the committed refusal ladder never says). The family is outside the 113/114 suite, so nothing runs it by default. **My recommendation: fold `scripts/app-leg/` into the main sweep rather than chartering an owner** — an owner can lapse; the sweep cannot.

---

## 1 · WHAT I SAW (drove the app — 5174; 5173 untouched)
**R3c's acceptance, end to end:** cube → Apply Ambo Dissection → Apply Pyritohedral Diagonalization (the relaxed icosahedron stands) → select the `pyritohedral-icosahedron` cell **and** an X_K midpoint vertex (`vertex:mid:h5a0w8`, hover-named "CG") → **"Open-lift star → Manuscript"** → the panel reads *"open-lifted 'open-lift(Pyritohedral Diagonalization Ambo Dissection Cube)' → the Manuscript shelf"*, and switching to the Manuscript shows the chip on the sources shelf under `"shape:pyritohedral-diagonalization:2:1fy059s"`. **The demonstration that used to refuse itself now passes at the eye.** (B.4 itself: nothing to see, §2 above.)

## 2 · WHAT I RAN
```
1  suite 114 @ 1 (dual-inspection, the accepted baseline) + tsc -b exit 0 at
   the real HEAD. The suite GREW by one: diagnose-the-noncube-domain.
2  freeze manifest: NO frozen file touched, NO spend, NO hash moved. One
   NOT_FROZEN classification row added (the §4 miss, cured).
   checkEngineFreeze: ok true · 46 checked · drifted [] · unlisted [].
3  no re-seal owed.
4  B.4's own numbers, all measured on the REAL modules: euclidean control
   FAILS +222.8254° (SW) / −10.3048° (Poincaré) / 141.06° (lens) → curved
   PASSES at 0.0e+0 rad (ε = 1e-6) · inradii 0.99638 → 72.00000° and
   0.31416 → 120.00000° (the instrument's own) · the near-miss (d+1e-3)
   FAILS · an unreachable target REFUSES rather than clamps.
   R3a: dual face ids IDENTICAL across t=1 ↔ t=1/φ (6/12 drifted before)
   and under ±1e-9 jitter (1/12 flipped before); fan cycles TRUE at both
   metrics; the chirality bit held.
   R3b: Σ = 4.000000π measured, pentagons at exactly 540°; the ⚑ flag's
   own skew numbers (536.85°, 4.21π) reconstructed live as the control.
   R3c: apex spread 0.00e+0 rad admitted; the pre-R1 fan refused BY NAME.
5  THE READING — §1 above.
```

## 3 · WHAT I CHANGED
- **`src/lib/noncubeDomain.ts`** (new, NOT_FROZEN) — the deck-fit checker (carried census + carried flankings; §E reads no position, builds no distance graph — Trap 1 inexpressible), the S³/H³ realizer (solve + co-vectors + re-derived vertex positions with on-plane asserts), the three realizations, the euclidean control's co-vectors, the authored seed tables.
- **`scripts/diagnose-the-noncube-domain.cjs`** (new) — §1–§7: the seeds, THE ORACLE, the swing, Trap 2 proven-not-assumed, Trap 1 structural, coherence, and the Shape byte-untouched.
- **`src/lib/dualView.ts`** — R3a: the fan order from the carried complex (the frozen sibling's idiom), one metric chirality bit, the old positional sort kept verbatim as the unreadable-fan fallback.
- **`src/lib/openLift.ts`** — R3c: the n=5 regular-fan gate at pick-time, scoped to n=5 exactly, refusing by naming the angles.
- **`scripts/diagnose-conformal-dual.cjs`** — §8 (R3a's falsifiers) + §9 (R3b's seal and its carried control); the ⚑ METRIC DEBT header flag recut to collected.
- **`scripts/app-leg/diagnose-open-lift.cjs`** — the R1-stale wedge pin recut ([60×5]) + R3c's three legs.
- **`scripts/app-leg/diagnose-d2-one-door.cjs`** — the two stale legs recut (R3d).
- **`docs/governance/ENGINE_FREEZE_MANIFEST.txt`** — the §4 classification row.

## 4 · WHAT I COULD NOT REACH / HONEST EDGES
- **The aperture is not routed through the new transport** (§2) — needs its own charter.
- **The word-materialized union: PRICED, not built** (§5), per your ⛔.
- **RP³ at the 5/10 twist** is printed as a note in the witness, not pinned — outside the chartered three.
- **The general Coxeter constructor · the inhabited interior · the icosahedral-as-distinct-domain** — deferred by the ADR's own triggers; untouched.

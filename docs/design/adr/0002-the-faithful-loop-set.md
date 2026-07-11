# 0002 — The faithful loop-set: a certified H₁ basis (class certified, representative craft)

Status: **accepted** — researcher-ruled (`RESEARCHER_RULING_FAITHFUL_LOOP_SET.md`), engineer-built + verified (Manuscript Phase 1/1.5 PASS), mothership-ratified + recorded 2026-07-08 (`basisCycles` grounding checked in `globalW1.ts`).
Date: 2026-07-08 · Seats: researcher (definition) · engineer (build) · mothership (canon)

## The definition (this is what "faithful" MEANS for the drawn loops)
A form's drawn loop-set is **faithful** iff **every drawn loop is a certified H₁ generator, and the drawn set is a full basis** — `b₁` free generators **plus** the torsion generators. Every real generator, all of them, and no fictions. This is the spine of the loop audits.

## The two layers
- **The CLASS — is a loop a genuine H₁ generator?** Certified, not eyeballed: the committed `analyzeGlobalW1(...).debug.basisCycles` **is** the certified basis (each cycle as its edge-id list; `cert.b1` the free rank; over Z/2 it carries the ℤ/2 torsion generators too). A loop enters the drawing only if it is in a certified class.
- **The REPRESENTATIVE — which homologous cycle to draw?** Designer **craft**. All cycles in a class are equally faithful (the class is the invariant; the representative is realization — same distinction as ADR 0018's Σ-support). Craft chooses the legible/beautiful representative — but the cycle must be **`globalW1`-certified, never hand-drawn**.

## The realizations
- **Option A — boundary-identification generators.** For a **single-polygon CLOSED surface** (torus / Klein / RP² / genus-g / N_k), the identified boundary edge-classes ARE a full H₁ basis. Proof: one 2-cell ⇒ the 1-cells (the identified boundary edge-classes) generate H₁. **Complete and faithful** for this family. Verified: Phase 1 (torus 2 / sphere 0 / RP² 1) + the **anti-hardcode probe** (blank the gluing word → 0 loops — the loops come from the structure, not a lookup).
- **Open surfaces draw their interior core.** An open surface (cylinder, Möbius) has a real `b₁≥1` generator that is **not** a boundary-identification edge — drawing 0 loops would **partially erase** it. Draw the core from the certified `globalW1.basisCycles`. Verified: Phase 1.5 (cylinder / Möbius cores; the bridge-tooth `=== readFormInvariants`; raw and subdivided agree).
- **RP²'s torsion generator is drawn.** The ℤ/2 shows as the pinch-mark (faithful — do not let the immersion's awkwardness erase it). A rounder representative is craft, provided the cycle is `globalW1`-certified.

## The honest residual (and a live flag for Phase 2/3)
**Option B — certified basis → immersion.** A **non-single-polygon closed form** (assembled / ambo'd / subdivided) can carry H₁ generators the boundary word does not reach — **intrinsic interior cycles**. Option A misses these; they must be drawn from the certified `globalW1.basisCycles` (Option B). This **bites the moment the manuscript renders born / assembled forms (Phase 2/3)** — until then, Phase-1 single-polygon forms are fully covered by Option A. **Disk patch-lifts are safe** (contractible interior — no intrinsic cycle). **Flag:** when Phase 2/3 renders born forms, the loop-drawing must switch to Option B for them; that is a future engineer charter, gated on the mothership when born-form rendering starts.

## Consequence
"Faithful loops" now has a precise, certified, falsifiable definition — the class is `globalW1`-certified, the representative is craft. Loop audits check against this. The Option-A canon covers the current (Phase 1) manuscript; Option B is the known extension for born forms.

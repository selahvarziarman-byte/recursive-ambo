# Charter — Enabler 1: Multi-form Load-and-Assemble + Source-Namespaced Cell Ids

**From:** Mothership (4th seating) · **To:** the Engineer office (senior + operating) · **cc:** Researcher (two grounding items, §6), Sovereign · **Date:** 2026-06-25 · HEAD `e775ce3`

The **first** enabler of the generative build-out — the foundation the genealogy DAG (Enabler 2) and product (Enabler 3) sit on. Runs as the engineer office's supervised teaching cycle. Mothership seals the acceptance **shape** below; the **operating engineer seals exact values** (off-repo hash) before the coder builds.

## §1 Target

One mechanism delivering **both** halves of multi-universe birth, because each makes the other honest:

1. **Source-namespaced primals.** Every lineage root carries its provenance — `(source, primalKey)`, where `source` is a universe-id (a loaded snapshot) or an invocation-id (a from-scratch form). Universe-1's primal `A` and universe-2's primal `A` become **distinct keys**.
2. **Arity-≥2 assemble.** Combine two-or-more loaded forms into a child by the **same boundary-identification on the disjoint union** that the unary ops already use — the child's sites pull back into **all** parents; its lineage carries **all** parents' (namespaced) roots.

The single law the pair secures: **co-location ≠ identity across universes** — two cells sharing a plain name across universes are NOT auto-identified; only a glue the user explicitly performs identifies anything.

## §2 Grounding (why this is real, not appetite)

Verified present in the committed substrate (mothership becoming-pass, this HEAD):

- **Assembly** — `cascadeDriver.buildJoinSeed` JOINs disjoint faces by a boundary correspondence; `runCascade` closes it to a fixpoint with faces surviving. Arity-≥2 assembly is this, applied to the disjoint union (ADR 0008: "the SAME boundary-identification… + product"). Built; verified green.
- **The charge** — `lineage.ts` is the single home of the primal multiset and **already treats a source-less vertex as its own primal** (CONTEXT, Invocation). It is the **sanctioned extension point**: tagging the source-less primal with its `source` is the designated change, not a violation of "committed modules byte-unchanged."
- **Descent** — `transformationLedger` pull-back *is* the parent-pointer; `certifyFaithfulness` reads `shapeLineageOf → primalMultisetKey`. Namespaced keys flow through unchanged in shape.
- **The concept is firm** — `(source, primalKey)` is sovereign-endorsed in CONTEXT/ADR 0008 as "the ONLY structural extension the multi-universe feature needs."

## §3 Scope

**IN:** load ≥2 forms each carrying a `source` provenance tag on its source-less primals; namespaced `primalMultisetKey`; assemble ≥2 forms via the existing boundary-identification on the disjoint union; the child's pull-back into all parents; lineage carrying all parents' namespaced roots; the co-location-≠-identity acceptance test + its tooth; the namespaced-injectivity re-confirm (§4.6).

**DEFERRED (later enablers — do NOT build here):** the persistent genealogy DAG (Enabler 2 — only the per-operation pull-back is committed; the standing object is next). **Product** (Enabler 3 — its lineage rule, carried-vs-minted, is the researcher's call at that time). Any UI; any full ambo-universe serialization beyond the minimal provenance-tagged form (confirm the minimal "load" in §6).

## §4 Acceptance — the sealed SHAPE (engineer seals exact values against §6's canonical example)

1. **Namespaced keys distinct:** u1's primal `A` and u2's primal `A` yield **different** `primalMultisetKey` values.
2. **Assembly pulls back to all parents:** the assembled child's `pullBack` contains sources from every parent form; `forward` is total over the union.
3. **Lineage carries all roots:** the child's primal multiset is the (namespaced) union of its parents' roots — carried, not minted.
4. **Co-location ≠ identity:** same-named cells across universes are NOT identified by assembly; the certifier reports the user-glued seam's cross-universe merges as **lineage-heterogeneous** (distinct provenance), exactly as the level-2 zoo reports distinct-lineage corners today.
5. **TOOTH (the seal must bite):** under the un-namespaced baseline the same two primals share one key → would falsely read homogeneous/identifiable; the namespaced result must **differ** from that baseline. (Pattern: the global-w₁ `§W-teeth` and the collapseFace χ regression guard — a seal that fails the bug it fixes.)
6. **Namespaced injectivity re-confirmed:** `primalMultisetKey` stays **injective** over namespaced cross-universe multisets (equal keys iff identical namespaced multisets) — discharges the board's OWED injectivity item at the point namespaced multisets first exist.
7. **No regression:** every existing diagnostic stays green (five necessities, cascade, zoo, ledger, registry); with **no** provenance present, behaviour is byte-identical to today.

## §5 Disciplines

- **Derive-only / additive-first.** Prefer additive layers; `lineage.ts` may be extended (it is the sanctioned locus) but **minimally**, with the no-provenance path provably unchanged and regression-guarded.
- **Seal before build.** The operating engineer seals the exact expected values (off-repo plaintext, committed hash, per the seal convention) **before** the build-prompt reaches the coder; the senior reviews prompt + seal before it goes down. The seal is not retro-fitted to a returned diff.
- **Cross-office audit, one voice.** Coder builds; the engineer office audits the diff; the office returns **one** verdict + exact-path commit. The mothership ratifies that verdict by **verification**.
- **No `git add -A`** (the CRLF phantom wall) — exact paths only. Commits/pushes are Arman's native call.

## §6 Routing

- **→ Researcher (ground BEFORE the engineer seals):**
  - **R1 — namespacing grain.** Confirm the `source` tag attaches to the **source-less primal** (lineage root) and flows through `primalMultiset` so derived cells inherit `(source, primalKey)` multisets; confirm "co-location ≠ identity across universes" reduces exactly to: equal plain-name + distinct source ⇒ distinct key ⇒ not identified. Ground that this is the complete extension (CONTEXT says it is the only one — confirm against the substrate).
  - **R2 — pin the canonical example with numbers.** Two square forms tagged `u1`/`u2` with deliberately identical corner names, assembled by one explicit boundary-identification; pin the expected namespaced keys, pull-back sets, faithfulness/lineage verdict, and the un-namespaced tooth value. This is the spec the engineer seals.
- **→ Engineer office:** seal exact values against R2 → write the build-prompt → coder builds → audit the diff line-by-line → draft the verdict + exact-path commit.
- **→ Sovereign:** fires the commit natively.

## §7 Done (falsifiable)

A new diagnostic (e.g. `scripts/diagnose-multiform-assemble.cjs`) is **green** asserting §4.1–4.6 on R2's canonical example **including the tooth**, run through the real committed modules (anti-mock); **all** existing diagnostics green (§4.7); and the engineer office returns **one** relayable verdict to the mothership, exact-path commit drafted for Arman. I ratify that verdict by verification — which doubles as proof the apprentice's first cycle landed.

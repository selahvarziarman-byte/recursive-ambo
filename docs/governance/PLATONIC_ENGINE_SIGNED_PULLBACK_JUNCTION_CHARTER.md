# Charter — Signed Pull-Back + Junction Decomposer (one build)

**From:** mothership · **To:** engineer/prompter · **Status:** chartered, gate fully closed
**Authority:** ADR 0006 (manifold-strata factory; junctions recorded; GlueCoh = decomposer) · ADR 0007 (stratum = canonical component; three layers; through-pairing deferred) · the clash-vs-level ruling (researcher, banked below)
**Substrate:** `src/lib/incidenceTraceRegistry.ts` (`buildSiteGlueCoh`) · `src/lib/transformationLedger.ts` (the set-valued pull-back) · `src/lib/lineage.ts` (the carried charge)

This is the first theory-layer-to-code crossing of the spiral. It is **one** build: a junction is a `>2`-valent pull-back — set-valued at the vertex, signed-non-manifold at the edge.

---

## 1. The build — two layers, one policy-free stroke

**(1) Canonical strata.** `GlueCoh` already constructs the vertex-link adjacency graph, reads each link-vertex's degree, and runs a connected-component traversal. It currently **collapses these into one boolean** (`glued` vs `non-manifold-overlap`). Generalize the same three reads to **emit a partition**:
- a **stratum** = a maximal connected manifold piece, walled off by junctions (the link cut at its junction loci). The junction is a **wall**; the stratum stops there.
- a **junction locus** = a degree-`d` (`d>2`) link-vertex (or a multi-component pinch).
- **Policy-free** — nothing is *chosen* here; it is read directly off the graph.

**(2) Signed pull-back.** The set-valued pull-back gains a **per-element sign** (`+`/`−` relative to the result orientation), read off the substrate's oriented boundaries (edge `sourceVertexIds`, face vertex-cycles). This is **faithful data**, not a flag.
- Orientation content (`w₁` / non-orientability) is a **cocycle computation over cycles** — *not* a per-set "inconsistency" check. A single pull-back set is never "inconsistent"; each element's sign is well-defined. (In)consistency is a global cycle property only.

Run **only on the post-identification (quotient) link**, never the rigid link (the rigid link is always one closed cycle, valence 2 — boundary and junctions don't exist there).

---

## 2. The valence axis (four-valued, per locus)

```
valence 1  = boundary (a free edge, from a cut)  — MANIFOLD  (keep on the manifold side)
valence 2  = interior (two sheets meet)          — MANIFOLD
valence >2 = JUNCTION  (d sheets meet)            — non-manifold, RECORDED (strata + locus)
```

The committed `non-manifold-overlap` bucket fuses valence-1 (boundary) with valence->2 (junction). **Split it** — boundary is a legal bounded manifold, not a junction.

---

## 3. The clash taxonomy is RULED — do not build a sign-clash

The certifier's **clash-set = lineage-heterogeneity + silent-loss, ONLY.** Build no third clash class.

**Sign-inconsistency is never a clash.** Every twisted cycle reduces to one of two, both recorded:
- **non-contractible twisted cycle** → legal **non-orientability** (Möbius/Klein/RPⁿ); the `−1` is the shape's orientation content — **faithful data**, recorded on the shape (`w₁`).
- **contractible twisted cycle** → impossible on a manifold → a **junction** (already handled by layer 1).

*Principle (banked):* identity collapses → clash; data records → not a clash. Lineage is a single-valued **charge** (merge distinct lineages → identity destroyed → clash). Orientation is set-valued **data** (a conflict is recorded, never destroyed). There is no orientation analogue of lineage-heterogeneity.

---

## 4. Deferred — do NOT build now

**(3) The through-pairing.** Threading sheets *through* a degree-`d` junction is the `(d−1)!!` sheet-matching, which the sign leaves **genuinely open** (verified by enumeration: matchings 3/15/105, preserving-only `(d/2)! ` 2/6/24 for d=4/6/8). This **is `GlobalSquareResolution` one valence up** — the *same* named-policy architecture, **not a new family**. Built only when named material demands a specific pairing (anti-monster). Leave the hook; do not author the policy.

---

## 5. Standing gates & discipline

- **Operations stay GATED.** This is a certifier/decomposer upgrade — *not* the shape-mutating ops.
- **Instruments, not guards / rows-first.** Per-step annotations; end-state verdict; a clash *annotates*, it never aborts and never forces a merge.
- **Lineage check** rides on `multiset = lineage` (verified to 62 leaves, proof open): operationally sound (decidable tree-comparison); completeness inherits the open obligation. Use it as committed.
- **Seat process.** Write the build prompt; **seal the expected values** so the audit is falsifiable; prompt the implementer; **audit the diff before any commit.** The commit is Arman's to fire natively.
- **Seal discipline.** Nothing unrevealed or in-flight goes on the branch.

---

## 6. Done = (falsifiable)

- `GlueCoh` emits a **partition** (strata + junction loci) on the post-identification link; the four-valued valence split is live (boundary kept manifold).
- The pull-back carries **per-element signs**; `w₁` is computed over cycles; non-orientable shapes are recorded as faithful data.
- The certifier's clash-set is **exactly** lineage-heterogeneity + silent-loss (no sign-clash).
- The through-pairing is **deferred** (hook only, no policy authored).
- Shape-mutating operations **untouched**; the registry diagnostic stays green.

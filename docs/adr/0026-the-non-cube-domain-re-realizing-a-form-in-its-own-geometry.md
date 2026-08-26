# ADR 0026 — The non-cube domain: re-realizing a form in its own geometry (S³ / H³), where the euclidean deck-deficit vanishes

- **Status:** Accepted — mothership-ratified 2026-08-26 at `8fd771a` (letter `2026-08-26_1550_mothership_ADR-0026-RATIFIED…`); B.4's first build landed + ratified `B-109` at `7878bcf`. The definitional half of **B.4**.
- **Date:** 2026-08-26
- **Author:** the researcher
- **Context SHA:** `8fd771a` (R1 landed `74be04c`, ratified `026d499`; the regular icosahedron/dodecahedron now realize via `t=1/φ` — see `SEAL_R1_THE_METRIC_RELAXATION_t_equals_one_over_phi.md`).
- **Grounding instrument:** `.handoff/instruments/noncube_domain_reference/dodecahedral_realization.py` — every number in §3–§4 is printed by it, not asserted here.
- **Prior:** ADR 0025 (the 2-D precursor — the surface deck-tiling: vertex/edge deficit determines the geometry, one dimension down) · ADR 0021 (generative closure) · `PLAN_THE_RENDER_GATE.md` bound 3.

---

## 0 · WHY THIS ADR, AND WHY NOW

R1 has landed, so the regular dodecahedron and icosahedron are real forms the engine can seed. Arman's ordering `R1 → B.4 → P5` made R1 B.4's **prerequisite** for a reason now on the record: **the regular dodecahedron and icosahedron are the seeds a non-cube S³/H³ domain is built from.** The plans carry a *reading* of B.4 (*"the non-cube domain constructor; the engine is euclidean and every form it builds is a euclidean cone-manifold; B.2 provably needs it"*) but a reading is not a spec, and a deep build must not rest on one. This ADR fixes the five things only a definitions chair can fix, and answers the one reuse question the coder would otherwise decide silently.

★ **The seam already exists in the substrate, half-built.** `apertureModel.ts:24-27` already computes, for every interior edge of a form, its **carried** edge-link `n = tower.gate.edgeLinks[].memberEdgeIds.length` and *classifies the geometry from the deficit*: **`n=4 ⇒ E³ · n<4 ⇒ S³ (deficit) · n>4 ⇒ H³ (excess)`** — but the comment finishes: ⛔ ***"Only the E³ transport is built — S³/H³ are the same loop with a different (ray, transport) and REFUSE."*** So the engine already **diagnoses** the non-euclidean deficit and **refuses to realize it.** **B.4 is building the transport that refusal stands in for.** This ADR says what that transport must mean, preserve, and prove.

---

## 1 · WHAT A NON-CUBE DOMAIN IS — so a builder can recognise one

A **domain** in this engine is already class-agnostic: `buildFormDomain(seedShape, pairings, key, title)` (`formDomainModel.ts:62`) takes **any** solid seed Shape and **any** well-formed face-pairing and returns a `DomainModel` — a fundamental polytope plus a gluing, rendered as `InkedDomain`, read by `readDomainSpecimen`. The cube-with-T³-pairing (`buildThreeTorusDomain`) is one instance; the constructor itself never assumed a cube. So a **non-cube domain** is not a new kind of object — **it is the existing `DomainModel` on a non-cube seed whose euclidean realization carries a non-zero edge-deficit, re-realized in the geometry that annuls it.**

**A polytope-plus-gluing is a *legitimate* fundamental domain — not merely a shape we like — iff it satisfies Poincaré's fundamental-polyhedron condition:**

1. **The face-pairings are isometries of the ambient geometry X ∈ {S³, E³, H³}** (they already are, combinatorially; here they must be realized as isometries of the *curved* X, not just of R³).
2. **The images of the polytope under the group the pairings generate tile X** — fill it, no gaps, no overlaps.
3. ⛔ **THE DECK-FIT (the load-bearing clause): every edge-cycle closes with total dihedral angle exactly 2π** (for a manifold; 2π/k, k∈ℤ, for an orbifold). This is condition 2 made checkable, and it is §3's invariant.

⇒ **Legitimacy is the deck-fit, nothing softer.** A shape is a domain because its edges close, not because it is regular or pretty. Regularity (R1) matters only because it is what lets the dodecahedron's edges *reach* a closing size in S³ and H³ at all (§3).

**Scope of the shapes in the first build** (and whether the list is closed):
- **The lens** — a bipyramid/lens polytope glued by a rotation; realizes the **lens spaces L(p,q)** in **S³**.
- **The dodecahedron** — glued opposite-face with a turn; realizes **two** manifolds: the **Seifert–Weber space** (**H³**, 3/10-turn, 5 cells per edge) and the **Poincaré homology sphere** (**S³**, 1/10-turn, 3 cells per edge).

⚠ **The list is NOT closed as a matter of geometry.** The true family is *"fundamental polytopes of the constant-curvature 3-manifolds"* — unbounded (every hyperbolic Coxeter polytope is a candidate). **What is closed is the FIRST BUILD'S scope: the lens (S³) and the dodecahedron (H³ + S³)** — exactly the shapes R1's seeds unlock — with the general constructor deferred under §5's trigger. **Say "these three realizations," never "the non-cube domains."**

---

## 2 · WHAT "RE-REALIZE IN ITS OWN GEOMETRY" MEANS OPERATIONALLY

The engine is euclidean: every form it builds is assembled from **R³** cells, so around an interior edge the realized dihedral angles sum to whatever the euclidean cells give — generally **not** 2π. That surplus/deficit is a **cone-singularity along the edge**: the form is a **euclidean cone-manifold**, a genuine manifold everywhere except that its edges are cone-lines. This is precisely what the aperture **marks** (LAW 20: the room returns early, counted in doors).

**To re-realize a form in its own geometry is to replace the euclidean cells with S³ or H³ cells of the one size at which the edge-cycles close with no deficit — turning the cone-manifold into a *smooth* (locally homogeneous) spherical or hyperbolic manifold.** The aperture **diagnoses** the deficit; B.4 is the **cure** — the same edge-cycle, realized where its dihedral sum is exactly 2π.

**The R1 shape — what may move, what may not, what marks itself** (this is the discipline R1 bought, carried up one dimension):

| | at re-realization |
|---|---|
| **MOVES** (re-derived) | the **cell geometry** — vertex positions, edge lengths, the dihedral angle itself. A hyperbolic dodecahedron's cells are *not* the euclidean ones; positions are recomputed at the deck-fit size. |
| **MUST NOT MOVE** (carried, byte-stable) | the **combinatorics** (V/E/F, the cell/face/edge incidence), the **face-pairings and the lineage** (what glues to what, and every name that resolves through it), the **edge-cycle classes** (`tower.gate.edgeLinks` — §3's trap turns on this). |
| **MARKS ITSELF** (a positive, new mark) | the **geometry class** `S³ / E³ / H³` — a positive fact needing a positive mark (never inferred from "not flat"; `unmarked ⇏ euclidean`). The **inradius / curvature** at which the deck fits is the mark's content. |

⚠ **This preserves the meaning-trace law:** re-realization **carries** the person's gluing untouched (their act's trace stands) and **re-derives** only the geometry the machine can always compute (positions). It **fabricates nothing** (no cell is invented) and **erases nothing** (no pairing is dropped). Positions were never the person's to give; the geometry class is a new positive mark the re-realization earns.

---

## 3 · THE INVARIANT THAT PROVES IT LANDED — with ε and the two traps

**INVARIANT (machine-checkable).** For every edge-cycle `c` of the carried complex, let `Θ(c) = Σ_{cells at c} δ_realized` be the sum of the **realized** (S³/H³) dihedral angles of the cells meeting around `c`, the cells enumerated from `tower.gate.edgeLinks[c].memberEdgeIds` (edge **ids**, grouped by `edgeClass` — `level3LinkExtractor.ts:92`, `level3SoundnessGate.ts:139`). **The form landed in geometry X iff `|Θ(c) − 2π| ≤ ε` for every interior edge-cycle `c`.**

- **ε = 1e-6 rad**, **bounded from both sides** exactly as R1's was: **above the float floor** (the solve reproduces the target dihedral to `~1e-14 rad`) and **below a meaningful deficit** (a real geometry-mismatch is an order of *degrees* — the controls in §4 miss by 222.83° and 10.30°). ε is a tolerance **on the angle sum**, never on positions or on the inradius — the same clause that stopped R1's ε being loosened in the wrong units.

⛔ **TRAP 1 — the position-keyed adjacency (this is R1's trap, a third row over; DUAL's `dualView:991` is the second).** If the set of cells "meeting at an edge" is read from the **realized distances** (a nearest-neighbour / min-distance adjacency), the adjacency **re-selects with the realization** and `Θ` reads 2π for *any* size — a test that cannot fail wearing a measurement's clothes. ✔ **The census already avoids this:** `extractEdgeLinks(complex)` keys on carried edge ids, not positions. **B.4 must keep it that way — the realizer computes *angles* from positions, but must draw *which cells* from the carried `edgeLinks`, never from a distance graph it builds itself.** The mothership's warning holds: a curved realization has more places to hide one, and this is the place.

⛔ **TRAP 2 — the size-blind dihedral (curvature's own vacuity, the analogue of 0025's 79.47°-vs-72° trap).** Unlike a euclidean polytope, a hyperbolic or spherical polytope's dihedral angle **depends on its size** (inradius). "The dodecahedron" is therefore an **under-specified** realization: reading the *euclidean* dihedral **116.565°** and declaring the deck fits is vacuous — it never fits (§4). The realizer must **solve** `δ(inradius) = 2π/k` for the inradius, and prove it *reached* the target, not assumed it. Grounded (`dodecahedral_realization.py`):
  - **H³ (Seifert–Weber, k=5, target 72°):** `δ(inradius)` solved → **inradius 0.99638**, `δ = 72.00000°`, deficit 0. Reachable: H³ dihedral runs `116.565° (small) → 60° (ideal, {5,3,6})`; **72° lies strictly inside**, at a *compact* size (0.996 < ideal).
  - **S³ (Poincaré, k=3, target 120°):** solved → **inradius 0.31416**, `δ = 120.00000°`, deficit 0. Reachable: S³ dihedral runs `116.565° → 180°`; **120° lies inside.**

---

## 4 · THE LAW-24 CONTROL — the case that must FAIL, and by how much

**The negative control is the *euclidean* realization of the very same combinatorics** (cells left as R³ dodecahedra — the unrelaxed geometry). It must fail the §3 invariant, and by a margin no ε could swallow (grounded, `dodecahedral_realization.py`):

- **Seifert–Weber / H³ control:** `5 × 116.5651° = 582.8254°` vs 2π=360° ⇒ **deficit +222.8254°.** FAILS.
- **Poincaré / S³ control:** `3 × 116.5651° = 349.6952°` vs 360° ⇒ **deficit −10.3048°.** FAILS.

**The positive control is the re-realization itself** (§3): the H³/S³ cells at the solved inradius close every edge-cycle to 2π (deficit 0 to `~1e-14`). ⇒ **The acceptance's first leg is `euclidean FAILS → curved PASSES` on one fixed combinatorics** — the witness must show the swing, or a passing deck-fit is vacuous. (Mirror of R1's *"unrelaxed cuboctahedron fails by 30°"*: here the unrealized dodecahedron fails by 222.83° / 10.30°.)

⚠ **Do not read the small Poincaré miss (10.30°) as "nearly euclidean, ship it."** 10.30° is ~180× ε and is exactly the cone-singularity a person would *see* as the room returning early. Small deficit is still a lie about smoothness.

---

## 5 · THE BOUND — first-build scope, and what is deferred with its trigger

**Plan bound 3 stands and this ADR does not soften it:** *no non-E³ interior ships until its deck fit is sealed; derivable ≠ derived.* A geometry the engine *could* compute is not one it *has* computed; only a passed §3 invariant on the committed realization seals a form.

**IN SCOPE for the FIRST B.4 build:**
1. **The deck-fit checker** — §3's invariant over `tower.gate.edgeLinks`, ε as specified, with the §4 control wired as its first leg (`euclidean FAILS → curved PASSES`).
2. **The S³/H³ cell realizer** — solves `δ(inradius)=2π/k` (the transcendental §3 grounds) and re-realizes the seed's cells at that size; **carries** combinatorics + pairings + lineage, **re-derives** positions, **marks** the geometry class.
3. **The three target realizations:** the **dodecahedron → Seifert–Weber (H³)** and **→ Poincaré (S³)**, and the **lens → L(p,q) (S³)**. This *builds the transport `apertureModel.ts:26-27` refuses.*

**DEFERRED, each with its trigger:**
- **The general (non-dodecahedral / arbitrary Coxeter) domain constructor** — trigger: a fourth domain shape is actually requested. (Non-foreclosing: the checker in §3 is already general over any seed; only the *realizer's* size-solve is specialized per shape.)
- **The INHABITED interior** — *walking inside* the re-realized S³/H³ form (the curved analogue of rung 1's interior transport). This ADR seals the form's **existence and correctness**, not its **habitation**; inhabiting is a later rung, exactly as ADR 0025 §7.2 ported rung-1's *"back where you started · N doors"* forward rather than claiming the felt experience. **Trigger: the deck-fit is sealed and the render gate asks what the inhabitant sees.**
- **The icosahedral seed as a distinct domain** — folded in only if the Poincaré sphere is realized via its **dodecahedral** domain (its dual) in the first cut; else deferred.

---

## 6 · THE REUSE QUESTION — analogous in argument, a NEW instrument in code

The mothership asked, correctly, whether rung 2's tiling machinery is **reused** or merely **analogous**, so the coder does not decide it silently. Ruled:

**REUSED (the substrate already holds these — build *onto* them, do not re-invent):**
- **The carried edge-cycle census** — `tower.gate.edgeLinks[].memberEdgeIds`. B.4 keys its deck-fit here; Trap 1 is already avoided in it.
- **The deficit → geometry classification** — `apertureModel.ts:24-27`'s `n=4⇒E³ · n<4⇒S³ · n>4⇒H³`. B.4 **generalizes** it from the cube's `n`-vs-`4` to the general `Σδ`-vs-`2π` (the cube case is `4×90°=360°`; the dodecahedron case is `k×116.565°`). Same law, seed-independent form.
- **The per-edge dihedral aggregation** — the aperture's MEASURED branch already sums member dihedrals around a merged edge class (`apertureModel.ts:1165-1168`). B.4's `Θ(c)` is that sum with the **curved** dihedral substituted for the euclidean one.

**ANALOGOUS ONLY (the shape of argument carries; the code does not):**
- Rung 2's `deckTilingModel` / tiling generator computes a **2-D vertex-figure** condition `cosh R = cot(π/p)·cot(π/q)`. B.4 is a **3-D edge-figure** condition and a **different transcendental** — `δ(inradius) = 2π/k`, solved via the Minkowski/spherical Gram relation grounded in the instrument. **The 2-D generator's code does not compute the 3-D dihedral.** ⇒ **B.4 needs its OWN instrument — the 3-D fundamental-polytope realizer — the way 0025 had `tiling_reference`.** `.handoff/instruments/noncube_domain_reference/` is that instrument's seed.

⇒ **The argument descends one dimension unchanged (deficit determines geometry; solve the size for zero deficit; key the cycle on the carried complex). The machinery does not: the vertex-figure solver is replaced by an edge-figure solver. Build the second; reuse the census and the classifier.**

---

## 7 · CONSEQUENCES

- **The coder gets a falsifiable target:** a deck-fit checker with a control that must swing `FAIL → PASS`, a size-solve that must *reach* its target (not assume it), and two named traps to route around — the definitional half rung 2 had before its build, now B.4's.
- **The aperture's `S³/H³ … REFUSE` (`apertureModel.ts:26-27`) becomes the build site,** not a permanent wall. The refusal was honest (the transport was never built); B.4 discharges it.
- **DUAL is untouched by this ADR** and remains undischarged — its `dualView:991` position-keyed precondition is a *separate* row of the same trap (`B-108` measures it). Naming it here only to say: this ADR does not close it.
- ⚠ **Marked for the record:** §1–§2 (what a domain is, what re-realization means, the R1 carry table) are **definitional rulings** ✔ grounded in the cited source at `8fd771a`; §3–§4's **numbers** are ✔ printed by the instrument, not asserted; the **existence** of the Seifert–Weber and Poincaré manifolds is a ✔ classical result (cited, not re-derived); the claim that the first build needs **no** new combinatorial machinery beyond the realizer is ⚠ inferred from `buildFormDomain` being class-agnostic and should be confirmed by the coder against the seed the realizer emits.

---

## 8 · THE AMBIENT-MODEL HAND-OFF — the routing's definitional half

- **Chartered** 2026-08-26 (mothership letter `2026-08-26_1800…§8-IS-CHARTERED`), after B.4's first build landed: existence sealed, but *"from B.4 a person sees nothing"* — the transport at `apertureModel.ts:26-27` still refuses S³/H³. This section specifies the object that discharges that refusal.
- **§8 is the MECHANISM only** (the curved interior made *reachable and readable*). The **INHABITED WALK** — the person-driven walk-and-return, rung 3's acceptance, the curved analogue of rung 1's *"back where you started · N doors"* — stays deferred to its **own ADR 0027**, chartered when *its* trigger fires (the render gate live and asking for the walk's certificate). §8 does not build habitation.

**The render half is already ruled, in `docs/design/adr/0004`** — so §8 is narrow. 0004 §3 rules **the mark** (the recession law: *in H³ the copies shrink exponentially and crowd; in S³ they close up and come back; a euclidean-recession render of a hyperbolic interior is a lie*) and 0004:196-203 commits **the ray and transport** (*"no new ray law is needed… the committed `p ← g(p), v ← R·v` already carries it; what blocks the body is a DOOR (`apertureModel:446`), not the tracer"*). 0004 also fixed the obligation §8 answers: ***"when the engine hands the first non-E³ manifold, it must hand the AMBIENT MODEL with it."*** **0026 sealed the manifold and never specified that object. §8 specifies its emission — a thing already sealed, not a new ruling.**

### 8.1 · What the realizer must EMIT (the ambient model), beside the sealed domain
Three fields, each DERIVABLE from the realization §2 sealed + the instrument's model formulas — no new measurement:
1. **The MODEL tag** `S³ | E³ | H³` — §2's already-self-marked geometry class — selecting the inner product the render's ray law uses: E³ the euclidean dot · S³ the R⁴ dot · **H³ the Minkowski form ⟨,⟩, signature (−,+,+,+)**.
2. **The face normals in that model** — each face-plane's outward normal as a vector of the model's space: the instrument's `e_i` = **`(sinh d, cosh d·û)` for H³**, **`(sin d, cos d·û)` for S³**, `û` for E³ — `d` the deck-fit inradius §3 solved, `û` the euclidean face-normal direction. These are what 0004's hit `tan t = −⟨p,n⟩/⟨v,n⟩` and the paired-face test consume.
3. **The pairing isometries as in-model maps** — each face-pairing `g`, which §1's legitimacy clause ALREADY required to be an isometry of the ambient geometry, written in the model's coordinates as 0004's committed transport `p ← g(p), v ← R·v`. §8 does not INVENT them (legitimacy sealed their existence); it expresses them in-model.

⇒ **The consumer (0004's ray-transport) is UNCHANGED.** §8 hands it the model it was promised; the coder opens the door (`apertureModel:446`) that has been refusing. The mechanism then shows the **see-through-doors recession** (0004 §3's mark) — the readable phenomenon, not a rate a person must be told to read.

### 8.2 · THE TRAP (the standing question, asked of §8: what is this measured ON, and is that structure derived from the quantity under test?)
The quantity under test is the angle/isometry relation the render draws (the recession). Two places a vacuity hides — this is the R1/DUAL/B.4-Trap-1 shape, now a **fourth row**, with a model change in it:
- ⛔ **The model tag must be the SEALED geometry class (§2's self-mark), never re-inferred from the emitted positions.** A tag re-derived from *"do the cells look spherical?"* reads the model off the very positions whose curvature it is meant to certify. **Carry the tag; do not re-measure it.**
- ⛔ **The normals and the `g` must be built on the CARRIED complex** (face ids, the pairing map §2 sealed), **never on a distance graph over the emitted positions.** A position-keyed *"which faces are paired / which way is out"* re-selects with the realization and the transport closes trivially — a door that always has a partner because proximity chose it. **Key on the carried pairing; the render is honest only if the transport CAN fail to close on a wrong emission.**

### 8.3 · THE LAW-24 CONTROL for the hand-off itself (a wrong emission must fail LOUDLY, never draw a plausible lie)
0004's own words are the reason: *a euclidean-recession render of a hyperbolic interior is a lie that looks like a picture.* So the control is not optional. **Emit an H³ (or S³) form carrying the E³ model tag and euclidean normals, and feed it to the unchanged consumer.** The witness: **the copies must FAIL to close around an interior edge — a visible seam or overlap of exactly §4's deficit (`+222.83°` H³ / `−10.30°` S³)** — where the correct model closes them cleanly to 2π. ⇒ **The render's own `wrong-model FAILS → right-model PASSES` swing is §8's acceptance first leg, the exact shape §4 used for existence.** If a wrong model draws a picture indistinguishable from the right one, the emission is not carrying the geometry — and that is the only way §8 is vacuous.

⚠ **Marked:** 8.1's three fields are ✔ derivable (the `e_i` formulas are the instrument's, grounded §3); 8.2's trap and 8.3's control are ⛔ definitional constraints on the build, witnessed by the coder (the render's closure swing). The INHABITED walk is **not** in §8.

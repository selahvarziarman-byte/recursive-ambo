# THE SEAL DOCTRINE — the standing clauses

**Owner:** Mothership · **Binding on:** every seat that writes, audits, or ratifies a seal — *including the mothership.*
**Status:** canon. Consolidated 2026-07-13 from the clauses earned during the generative-closure campaign (ADR 0021).

Every clause below was bought with a real failure. **Each one was nearly walked past by a senior office**, and in three cases the office that wrote the clause was the one that then violated it. They are stated here so no seat has to re-earn them.

---

## The purpose of a seal
A seal exists to make a build **falsifiable before it is written**: expected values are fixed and hashed, the builder works **blind**, and the audit compares emissions against the sealed pins. A seal that cannot fail is not a safeguard — **it is a ceremony that manufactures confidence.** Every clause here defends against a *different* way a seal quietly stops being able to fail.

---

## CLAUSE 1 — A seal must EXECUTE the mechanism it claims to witness
Before asking *"would the wrong mechanism fail this seal?"*, ask **"does this seal RUN the mechanism at all?"**
**Check the CALL GRAPH, not the assertion.**

> **Corollary — byte-identity is evidence of SHARED CODE before it is evidence of correctness.** When two implementations agree *perfectly*, first suspect that they are the same implementation.

**Earned by:** the five-word byte-compare, celebrated by the engineer as "the decisive pin" and canonized by the mothership as *"proven, not argued."* It was byte-identical **by construction** — `identify()` delegates every single-face form to the polygon machinery, and the source said so in plain words (*"on that domain they ARE the same code"*), while the diagnostic asserted `via === 'committed-word'`. **It never once executed the general enactment.** The code never lied; two senior offices read a construction and reported it as a discovery.
**Now enforced structurally:** every witnessed case asserts `via === 'general'`, and the delegating square is asserted a **non-witness, counted by nothing.**

## CLAUSE 2 — TRAP-SENSITIVITY: a seal must exhibit the wrong mechanism FAILING
It is not enough that the right mechanism passes. The seal must **carry** a wrong mechanism and show it **visibly failing** on the sealed representative. A seal the wrong mechanism would also pass is not a seal — **it is a coincidence.**

**Earned by:** two consecutive **trap-blind representatives** — a rep on which an endpoint-keyed enactment would have passed, and a canonical wrapper that dodged the parallel classes the trap needed.

## CLAUSE 3 — A PARAMETRIC seal must PIN ITS OWN STRENGTH
Where a clause admits a **family of instantiations** (any subset, any representative, any relabelling, any fixture), **the implementer chooses the parameter — and the weak choice satisfies the letter while killing the test.** The seal must **pin the parameter** and **demonstrate that the WEAK instantiation FAILS TO CATCH.**

> *A clause that can be satisfied by a weak instance will be. **Discretion in a seal's parameter is a hole in the seal.***

**Earned by:** the mothership's own re-storage clause, which said *"flip a subset of the stored arrows."* A **uniform** flip moves `s_A` and `s_B` together, leaves `s_A·s_B` unchanged, and **the rejected fixed-sign rule passes it.** Only a **PROPER, NON-UNIFORM** flip that *splits an identified pair* has teeth. A coder implementing the clause by flipping *all* edges would have built a toothless trap **and reported it green.**

## CLAUSE 4 — The witness must CARRY its own wrong mechanism, and must OUTLIVE THE COMMIT
A trap-sensitivity witness must carry an **in-memory mutant** of the wrong mechanism. It must **NEVER borrow the bug from a git ref the build is about to destroy** (`git show HEAD`).

> **A seal must not depend on the bug still existing. The witness must survive the fix.**

**Earned by:** a cut that was mechanically green and **would have landed RED on commit.** Two legs asserted *that HEAD still has the bug* — which the commit makes false — and **those two legs were Clause 2's teeth.** The free-edge legs meanwhile went *vacuously green*, comparing the engine to itself. The engineer rejected the cut and replaced every borrowed leg with a **permanent** one.
**And the check that can never be run again:** while HEAD was still the buggy engine, the carried mutant was byte-compared against the **real** shipped bug and found **identical** — closing, in the affirmative, the last window in which a carried mutant could be proven not to be a strawman. **Do this while the window is open, or lose it forever.**

## CLAUSE 5 — CLAUSE-SET INDEPENDENCE: no invariance clause may be retired as duplicative
When a seal carries several invariance tests, **prove they are independent** and record it. A future refactor that judges one "redundant" and drops it leaves the seal green while a wrong mechanism walks through.

**Earned by (measured):**

| mechanism | **relabelling** test | **re-storage** test |
|---|---|---|
| array-order reference | **CAUGHT** | passes |
| raw fixed-sign | passes | **CAUGHT** |

**Neither clause subsumes the other. A seal carrying only one of them passes a wrong mechanism.** This is Clause 3 firing one level up — not at a clause's *parameter*, but at **the clause SET**.

---

## THE AUDIT CLAUSE — follow the value to the last place it is READ
An audit must follow a value **to the last place it is READ, not to the last place it is WRITTEN.**

> A correct value handed into a consumer that reads a **different, stale field beside it** is a lie the diagnostic will happily certify — **because the diagnostic checks the boundary, and the lie lives one line past it.**

**Earned by:** the multi-parent DAG walk. The walk was correct and the audit verified that the render layer *receives* two ancestors — then stopped. The renderer went on reading the one-hop `parentShape` sitting beside the new data, and the manuscript drew **one parent of two.** *Drawing none was an omission; drawing one is a lie* — and the audit certified the step that turned one into the other.

---

---

# THE WITNESS LAWS — for instruments that RENDER
*(Added 2026-07-14. A rendered instrument can lie in ways a numeric one cannot: by what it frames, by what it is made of, and by what it counts. All four were bought in a single night's build.)*

## LAW 6 — THE DEFAULT FRAME MUST SEE THE SEAL
A **default** — camera, ordering, resolution, echo depth — **that can HIDE a computed invariant is a lie by omission.**

**Earned by:** the aperture's stock camera showed **0 of 6 LEFT hands in a w₁=1 (non-orientable) space.** The FLIP's reflecting generator is the **x**-pairing; the default pointed the person down the **y**-corridor, where every deck word is orientation-preserving.
> **The person's first look at a space that does not know left from right would have shown them a space that appeared to.**

**The frame is craft. Whether the craft can SEE THE TRUTH is not.** It must be a **witness leg, never a taste** — now pinned: *T³ → 0, FLIP → non-zero, **at stock settings**.*

## LAW 7 — CHECK A WITNESS FROM OUTSIDE THE THING IT WITNESSES
**Render every probe ALONE, first.** You cannot see a probe's failure *from inside the scene* — exactly as you cannot see an enactment's failure *from inside a seal that shares its code* (**Clause 1, one register over**).

**Earned by:** three bugs in one night, all invisible in the room and all obvious in one solo glance — the **mitten** (the contour iterated inside the scene, so every finger vanished), the **interpenetrating mask**, and the **mis-cut hand**.

## LAW 8 — SEAL THE COUNT, NEVER THE METRIC
**The metric selects; the COUNT asserts.** A metric may choose a shortlist; only a count a person can verify by eye may appear in a caption, a readout, or an assertion.

**Earned by:** a hand chosen by **mirror-IoU** — which measures geometric self-similarity, **not whether a person can READ handedness in a small copy**. (An open palm's fingers merge into a blob: that is literally how the mitten was born.) *The metric chose the shortlist; the room chose the hand.* **No IoU appears in any caption.** *(Companion to the earlier caption law: count copies, not pixels; objects, not area.)*

## ★ LAW 9 — THE INSTRUMENT MUST NOT CARRY THE PROPERTY IT MEASURES
A probe used to read a property **must be provably free of that property.**

**Earned by:** the placement law, `det(R) > 0`. A probe placed with a **reflected** rotation would make **every** copy present as a LEFT hand — *while the word-counter still read 0.* **A lie planted inside the instrument**, invisible to the count that the instrument exists to produce. The engine now **throws** on a reflected placement, by name.

> This is the sharpest form of the whole doctrine: *a measuring device contaminated with the thing it measures produces a number that is about itself.*

---

# THE GENERAL LAWS

## LAW 10 — A CONTINGENCY OF THE PRESENT SETUP IS NOT A LAW
**Test: change the map / the storage / the gauge. Does the rule survive?** If not, it was never a law — it was a fact about the current arrangement.

**Earned three times, by three offices, in one week:**
- the **mothership's** mode pin — true only under *my own* storage convention;
- the **engineer's** fixed anti-aligned rule — true only under the engine's *current* arrow-minting;
- the **designer's** "the masks come back grieving" — **measured false (0 of 39 / 0 of 20 / 0 of 19).** The reflection `diag(1,1,−1)` flips **z** and *preserves* **y**, and the mask's faces point along **±y** — *a reflection cannot swap them.* It turns the copy **upside down**, and an inverted smile reads as a frown. **They believed their own plate.**
> **⇒ No mask-based chirality counter, ever.** A counter true for one map and false for the next **is a lie in general.**

## LAW 11 — A GUARD MUST NOT REQUIRE A HOLE IN ITSELF TO PERMIT A SANCTIONED CHANGE
**Earned by:** the HEAD-differential byte-guards. Each sanctioned edit could only be permitted by **removing the file from the guard's own coverage** — so every sanctioned change punched a silent, permanent hole. `playgroundOperations.ts` — the op registry and the gate logic — ended up **guarded by nobody**, and nine diagnostics carried nine drifted lists. Replaced by **one freeze manifest of sealed content hashes**; no carve-out is ever needed again.

## LAW 12 — THE INSTRUMENT DOES NOT SET THE AGENDA
A thing being *ruled and available to build* is not a reason to build it. **Build what a caller needs.**
**Earned by:** the same-face tiebreak — correctly ruled, correctly **PARKED**: no product surface, no dependency, and level-3 does not route through `identifyOnComplex`. *Building it because it is available is the instrument setting the agenda.*

## ★ LAW 15 — A NECESSARY CONDITION IS NOT A VERDICT
An instrument that computes a **necessary** condition may name a **CANDIDATE**. It may **never name the thing.**

**Earned by the mothership, ratifying its own canon too strongly:** I ruled the edge-link cycle length `k` **"names the geometry"** and put it in the invariant tower as a first-class reading. It does not. **Poincaré's condition also requires the pairings to be isometries and the edge-cycle transformation to be the identity — and we test neither.** So `k` says *"if this form has a regular-seed geometry, it is this one"* — never *"this form has this geometry."*
> **Consequence, binding:** **the door must NOT infer a form's geometry.** Curved interiors ship for **sealed, named specimens only**; for an arbitrary person-built form the honest answer is *"the geometry of this form is not determined by what the engine knows."*

**And the companion error, same ruling:** I let an **unstated uniformity assumption** ride — `E_total/E_classes` is **not** `k`. It manufactured 24 "spherical but non-orientable" 3-manifolds, which **cannot exist**. *The thing that caught the bad invariant was an invariant we already had:* **w₁ contradicted a theorem.** **The tower is its own cross-check — let it be.**

## ★ LAW 16 — SUBDIVISION INVARIANCE *(seal clause; sibling of RE-STORAGE INVARIANCE)*
**REFINE the complex — the same form in more cells — and NO invariant may move.**

**Why it is needed:** refinement is topologically free (χ, w₁, homology are refinement-invariant) but **lineally costly** — *which* disk you cut is topologically immaterial and **is nevertheless recorded**. **A choice that moves the HISTORY without moving the FORM** is the same disease as the storage gauge that produced the mode-pin correction. This clause is the guard against **refinement smuggling meaning into the record.**

## LAW 14 — A CURE MUST BE A DOOR, NOT A THEOREM
**ADR 0018** requires that a refusal carry its cure. This sharpens it: the cure must name **the effect the person needs**, be achievable with **machinery that EXISTS**, and **drag in no deferred arc.**

> *A wall that names the general proof that an effect exists — rather than the door — is **worse than a wall with no cure, because it promises one.***

**Earned by:** `folded-edge` shipped a wall reading *"subdivide to resolve the fold"* — and **there was no subdivision anywhere in the engine.** For one build, **19% of the dim-3 door named what the person had made and then pointed at a door that was not there**, breaking the very law it was built on. Worse, the canon named **barycentric** — a *theorem* about the general case — which on a cube yields **simplices**, dragging in the **non-cube constructor the same ADR defers.** The fix was to state the **effect** (*the fixed set must be a subcomplex*) and let the cheap cubical cure discharge it.

## LAW 13 — AN UNANSWERED `ASK` IN AN INBOX IS A DROPPED BALL, BY DEFINITION
The queue must not live in prose across turns; that is how items vanish. **Sweep every seat's inbox for unanswered ASKs before chartering anything.**
**Earned by:** a seven-build-stale backlog — and by the mothership running an entire session on a closed arc, four commits behind, **with eight unread messages sitting in its own inbox.**

---

## WHY THESE ARE STATED SO PLAINLY
Every clause here was violated by the office that most believed in it. The mothership canonized a proof that never ran (C1), then wrote a clause that could be satisfied vacuously (C3). The engineer proposed a fix that hard-coded the very contingency it was correcting, and shipped an audit that stopped one line short of the lie (Audit clause). **The instruments caught us — because we built them to, and because no office was believed on its own say-so.**

**The discipline is not a formality. It is the only reason the torus is still a torus.**

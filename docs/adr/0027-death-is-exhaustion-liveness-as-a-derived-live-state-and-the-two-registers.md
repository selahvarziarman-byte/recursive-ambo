# ADR 0027 — Death is exhaustion: liveness as a derived live-state, and the two registers

- **Status:** Proposed — mothership-chartered 2026-08-27 (letter `2026-08-27_0828…ADR-CHARTERED`). Awaiting ratification.
- **Date:** 2026-08-27 · **Context SHA:** `cfb039a` · **Author:** the researcher.
- **Occasion — Arman, in-terminal, verbatim:** *"to let the shape that is a parent remain alive (operable). from 1 square all its 'unique' children should be obtainable exactly once! the parent will 'die' only if all it's possible children are on the page. so for example if a child is deleted a dead parent should come back to life."* And, the same session: *"remove and undo does not need be recorded as geneology."*
- **Scope (charter):** this ADR records the MODEL, not the surface words. The page's word for a sense (the designer's `spent`/`exhausted`) may change without amending this ADR — the ADR fixes the SENSES and their structure; the surface word is the designer's.
- **Durable companion:** `.handoff/RULING_DEATH_IS_EXHAUSTION_the-two-registers.md` (the ruling this ADR promotes to the record). **Prior:** P5 (`.handoff/…P5…`, the removal/undo ruling this extends).

---

## 0 · THE TWO REGISTERS — the organizing law

| | THE RECORD | THE LIVE STATE (the page) |
|---|---|---|
| **holds** | what happened — irreversibly | what currently IS |
| **direction** | RATCHETS — only grows | DERIVED — recomputed from the page; moves both ways |
| **reversible?** | NO (a past fact) | YES (remove a child → the obtained-set shrinks) |
| **who lives here** | **two record surfaces:** the GENEALOGY (begetting · `died`(op-internal)) **and the ACTS LEDGER** (removal/undo traces — out of the *genealogy* per Δ23, still a *record*) | **liveness / exhaustion** · arrangement |

> ⛔ **THE CRITERION (amended 2026-08-27, the ratification's one returned row): a register is decided by DIRECTION (does it ratchet?), never by SUBJECT (what it is about).** The acts ledger's *subject* is the live page, and it is still a RECORD: it ratchets — undo APPENDS a revert, it does not pop (P5) — and it is not recomputed from the page. An earlier draft rowed it under live state by its subject; by this table's own direction row that was wrong, and §6 bites only because it is wrong: **a record may not hold a reference into live state — two live-state things could share objects freely.** Δ23 keeps removal out of the GENEALOGY (which records what operations MADE); the acts ledger is the OTHER record surface (what the person DID). Two record surfaces, two meanings, one direction.

✔ **Measured, not prescribed:** the substrate already renders the two RECORD surfaces as two producers — `entries ← footRecord(genesis, …)` over the DAG and `acts ← the append-only ledger` — two props, two lines, 46 px apart (coder `B-117`/`A1`, `08:12`), each independent of the live page. **This ADR describes what the engine already does; it is not a split the build must be brought to.**

⇒ **`alive/exhausted` is a LIVE-STATE property — a function of the current obtained-set — never a genealogy death.** That single placement settles Q1, Q4, and grounds Q3.

## 1 · Q1 — the redefinition does NOT contradict begetting's irreversibility (the load-bearing sentence)

**Begetting is a RECORD fact and irreversible; liveness is a DERIVED state; removing a child recomputes liveness and un-begets nothing.** The feared contradiction was two registers being read as one. Removing a child shrinks the obtained-set, so the parent's liveness re-derives to *alive* (revival) — while the record still holds the child's birth AND its removal, both standing. Reviving recomputes a derived value; it un-makes nothing.

⛔ **Therefore: liveness is DERIVED, never STORED.** A parent's `alive/exhausted` is a READING recomputed from (its total unique-child set) − (children currently on the page). A stored copy would drift from the page that defines it — this is the RECORD-NOT-READING law, and the coder's leaf catch is its live proof (*a record computed from the page's population dropped a leaf's own birth line when the leaf was removed*).

## 2 · Q2 — a UNIQUE CHILD is a distinct RESULT-FORM (up to homeomorphism), one generation

The generating operation is the ROUTE; the child is the RESULT. The map is part of a child's identity **only through the result**: `glue→torus` and `glue→Klein` are two children (distinct forms); two maps that both yield a torus are ONE child. Grounds: (1) *"unique children"* individuates the child, and a child is a form — the meaning-trace law, *the name is the RESULT, the index of the operation*; (2) Arman's *torus AND Klein from one square* requires exactly this grain, and the failure he named (*could never make both*) is what an operation-grained set would cause; (3) an (operation, map)-input grain would let a parent be exhausted by isomorphic DUPLICATES — making the same thing twice, not spending new potential.

⚠ **ONE generation (direct children), never the transitive closure** — forms beget forms without bound, so *"all its children"* is the set obtainable by a single operation, or `exhausted` is undecidable.

### 2.1 · THE GRAIN EXTENDS TO INVOCATION — form · instance · address (amended 2026-08-27, on the six-squares question)

- **A second invoked square is the SAME FORM.** Invocation is an operation (∅ → square) and its result individuates like every other: **one square-FORM; each invocation mints a new INSTANCE, in its own universe (`w1:4-gon`, `w2:4-gon`, …).** *"Which one is THE square?"* — **the FORM is; every drawn square is an instance of it.**
- **The committed co-location ≠ identity discipline (`writtenFormModel:165-167`) is about ADDRESSES and stands untouched:** instances stay distinct universes so the person's acts attach to the instance he touched. An address is not an identity — the `v${index}` law, one level up.
- **Liveness, exhaustion, and revival attach to the FORM, over the page-global obtained-set** — every instance of one form shows one liveness. (Per-instance liveness would let six squares yield six toruses — exactly what *"obtainable exactly once"* forbids.)
- ⛔ **AND IDS ARE ROUTES, NEVER THE CHILD-SET'S GRAIN.** Measured: shape ids are route-grained addresses (`shape:materialized:glue:<parent-id>:<face>:<pairing>`) — a different pairing yielding the same torus mints a second id. **The id scheme is CORRECT as an address scheme, and it is not the identity relation: identity is never a string relation on ids, in either direction** (same id ⇒ same route, not "different id ⇒ different form"). **Exhaustion computes over RESULT-classes (§3), never over ids** — the apparent substrate/§2 contradiction dissolves: the substrate implements ADDRESSES; §2 defines IDENTITY.

### 2.2 · THE MEANING GRAIN (amended 2026-08-30, STAMP R-1 — a refinement this ADR owed, found by pressure-testing the meaning-surfacing frame against §2)

⛔ **The child-set, the obtained-set (§3), and exactly-once run at MEANING grain — the form's CLASS plus its CONSTITUTIVE TRACE (which concepts it identifies, by whose names, by what word) — not at bare class grain.** The case that breaks the bare-class statement: a fresh square and a lifted face with GIVEN corner names are the same CLASS; under class-grain exactly-once, a standing anonymous torus would block the named face's torus — making *"one torus from square 1 and a torus from a completely different square"* (Arman's own coexistence case) impossible. **For fresh/unnamed parents the meaning collapses to the class, so every consequence ruled in §§2–3 stands where it was ruled:** six anonymous squares still cannot yield six toruses; a same-meaning repeat still selects the standing child (obtaining-is-not-making). **Named consequence, so it is built knowingly: giving names changes a form's meaning, so a named parent's child-set SEPARATES from the anonymous one's — naming can restore generative potential.** Full ruling: `.handoff/RULING_STAMP_R-1_…md` (Q2).

## 3 · Q3 — enumerable and `exhausted`-assertable for SURFACES now; DEFERRED for 3-manifold parents

Exhaustion needs the child-set answered TOTALLY (*"what can I still beget?"*), or only *"nothing I can currently offer"* is assertable — which cannot carry a death. There is a buildability boundary:
- ✔ **The menu is finite and total** — the op-set is finite; each op's legal parameters are finitely enumerated (a square's identification maps are the 8 `dihedralMapCandidates`; `cut`/`collapse`/`identify` range over finite walks/faces/pairs).
- ✔ **Dedup-up-to-homeomorphism is DECIDABLE for surfaces NOW** — closed surfaces are classified completely by **χ + orientability (+ boundary components)**, all computed (`level3Invariants` χ; the window already distinguishes torus/Klein/RP²). So *new unique child vs already-obtained duplicate* is decidable, and `exhausted` = *every distinct (χ, orientability, boundary) result is on the page* is assertable. **The square is exactly the decidable case Arman named.**
- ⛔ **For a 3-MANIFOLD parent, DEFERRED** — general form-sameness (homeomorphy) is *"the tower's later business"* (`level3SoundnessGate.ts:11`), not built. Until it lands, a 3-manifold parent can assert only *"nothing I can currently offer,"* not `exhausted`. **Trigger: a form-sameness predicate for 3-manifolds lands.**

⚠ I did not find a general form-sameness predicate at HEAD; the surface case needs only χ/orientability (present), the 3-manifold case needs what is not yet built.

**THE OBTAINED-SET, precisely (amended 2026-08-27):** the obtained-set of a parent-form P = **the distinct result-forms BEGOTTEN FROM P currently on the page.** Three consequences, each from Arman's own sentence: (1) **begetting is what spends a slot** — a loaded form, or a homeomorphic result begotten from a *different* parent, does not spend P's slot (*"from 1 square"* scopes the exactly-once to the parent); (2) **removal restores the slot** (*"if a child is deleted a dead parent should come back to life"* — the revival clause); (3) ***"exactly once"* = at most ONE living instance per (P → child-form) begetting at a time** — and a repeat begetting while the first stands is **NOT A REFUSAL** (the designer's ruling from Arman's own word, superseding this clause's earlier refuse-or-focus fork): *his act is "give me the torus from this square"; the child already stands, so he already HAS what he asked for — **obtaining is not making** — the act SUCCEEDS by selecting and marking the standing child*; **re-begetting after removal is legal**, and the registers keep it honest: the genealogy edge (P begat C), once written, stands — the new instance is a page fact and an acts-ledger entry, not a second genealogy edge.

## 4 · Q4 — THREE distinct senses; the TYPE SPLITS; one glyph, one meaning

| sense | what it is | register | reversible |
|---|---|---|---|
| **`died`** (existing) | a part/concept absent from a child, one generation up, INSIDE an op (`argumentReadingModel:24-26`, M3) | record | no |
| **`removed`** (P5) | the person's page removal act (NOT genealogy — Δ23) | effect: the live page · trace: the acts ledger (a record) | its own undo |
| **`exhausted`** (this ADR) | a form with no unobtained unique child | **derived live-state** | **YES (revival)** |

⚠ **Which mechanism (footnote, 2026-08-27):** the `died` row's mechanism is `argumentReadingModel:24-26`'s `diedConcepts`/memorial rows (M3) — concept/vertex grain, read one generation up. **`GenealogyEdge.death` (`genealogyDag.ts:206`) is NOT this sense** — it is a pre-split op-kind fact (*"this birth's operation kind is consuming"*), measured as a falsified liveness model (the page kept a "consumed" square standing and operable) and chartered for rename. A later reader must not take the nearest death-shaped field for the named sense.

⛔ **`exhausted` may NOT reuse `died`'s type or mark** — different register, different reversibility, different subject. Conflating them re-buys *one glyph, two meanings*. **Division of authority (per the M.3 precedent): the researcher rules the SENSES; the designer rules the SURFACE WORD.** `exhausted` is the sense's name in the model; the page's word for it is the designer's, and may change without amending this ADR.

## 5 · Q5 — moving is NOT an act (for the undo chain)

An **act** (what undo's *"last act"* ranges over) changes CONTENT (a form's existence or identity) or the RECORD. **Moving changes only ARRANGEMENT (position)** — the non-act baseline (LAW 20: a view/camera move is invisible from inside; and P5's own constraint, *the person must tell a removal from the world merely having moved*, makes moving the explicit non-act). ⇒ **Undo skips moves; the chain is content-acts only.** Arrangement, if it wants reversal, is a SEPARATE register from the content-act chain — never mixed in.

## 6 · THE OBJECT-LEVEL RULE — the two registers may not SHARE OBJECTS ★ (this is the half a correct implementation of §0 can still miss)

§0 states the registers; a build that honours §0 in the model can still fail in the OBJECT, and did — measured (coder, `B-119`): the acts ledger stores `home: entry.home` — **a reference into live state, not a copy.** So *"removed Torus from H1"* silently becomes *"…from H2"* the moment the person drags the restored Torus, with no write to the ledger at all. ⇒

> ### ⛔ **A record that holds a REFERENCE into live state is a record that can be rewritten without being written to.** *Append-only is a property of the WRITES; immutability is a property of the CONTENTS — witnessing the first does not secure the second.*

**THE UNIFIED DISCRIMINATOR (the same law that §1 states in the other direction):**
- **A fact that is ABOUT the live state** (liveness, exhaustion) → **DERIVE it** — recompute from the page; never store the derived value.
- **A fact that is a RECORD OF the live state at a moment** (a name, a removal's site/`home`, a birth line) → **COPY it as-of that moment** — never look it up through, or alias it into, live state.

⛔ **Both failures are the SAME failure: ALIASING — the two registers sharing an object.** Storing a derived value aliases the record to stale live-state; holding a reference (or a live-population lookup) aliases the record to *current* live-state. The invariant that prevents both: **the record and the live state may not share objects.** ✔ **This is one mechanism seen in four cycles** — the leaf's birth line · the label on selection · a removed form's name (`nameOfShapeId` falling back to a raw id for a form no longer in `written` — *a name looked up from the live population dies with the population*) · the acts ledger's `home`. **An ADR that named the registers without this clause would be correctly implementable and still wrong here.**

## 7 · THE READING REQUIRES A BRANCHING DISPLAY — and it EXISTS, but is DRAG-GATED (amended 2026-08-27: the requirement stands; the subject was wrong)

Liveness, exhaustion, and revival are all statements about **one parent and its many children** — a DAG. **A form that cannot express one-parent-many-children cannot show a parent's remaining life, cannot show exhaustion, and cannot show a revival** (the designer's clause — the REQUIREMENT, which stands).

⚠ **AMENDED (2026-08-27):** this section originally claimed *the only genealogy display flattens one-parent-many-children*. **Measured false of the STEMMA and true of the BAND**, on one square worked to six children (coder's drive, `17:23`): the stemma draws **six edges from ONE diamond** (`distinctParents: 1`; *"six arrows radiate from one point … reads as ONE parent's six begettings at a glance"*) — **the branching display exists**; the BAND is what flattens (it prints `Square — invoked` once per child — *a linear band spends one full parent-print per child, while the stemma spends one point for the same six begettings*). §7's original evidence was taken on the reference zoo — **six REAL squares (six universes, §2.1's instances), where six prints were CORRECT** — the count asked the wrong question of the number. **The display prerequisite of the parent-life build is therefore DISCHARGED.**

✅ **HISTORICAL (swept 2026-08-28): the drag-gate below is CURED.** `B-124` built the at-rest fan (a parent's children fanned countable at rest — true at the coder's count for N=2 and N=6), and Arman accepted: *"fan worked. all is well."* ⚠ Recorded honestly: **he gave a VERDICT, not a count** — the acceptance question asked for a measurement and was answered with judgement, which is the person's job (the Δ19/Δ27/Δ31 law); the count is the coder's, the acceptance his. The clause below stands as the record of WHY the at-rest fan is mandatory, not as a live gate.

⛔⛔ **AND THE CLAUSE THAT DECIDES WHETHER THE MODEL IS READABLE — THE READING IS DRAG-GATED.** Measured, same page: *at rest, the one-parent-six-children page shows NO fan at all — all six children settle into ONE slot, six edges coincide into one visible line, and the six captions overprint into an unreadable smear. The fan — and with it the whole "one parent's remaining life" reading — exists only after the person drags the pile apart.* ⇒ **`exhausted`, the remaining-child count, and the revival are readings of a FAN; at rest there is no fan.** The cause is the SETTLE law (form, the designer's — nothing chartered by this ADR); **the ADR records the gate** so a later seat does not find the model unreadable a second time: **the display exists, and its reading is gated on a gesture** — an affordance that was optional-for-meaning (D.6, *arranging the page is arranging the argument*) has become mandatory-for-reading, and that transition is now on the record.

## 8 · CONSEQUENCES & scope

- **Builds now (surfaces):** the parent-life reading (liveness/exhaustion/revival) is well-defined and decidable for the square's surface children (§3), pending the object-level discipline (§6). §7's display prerequisite is **DISCHARGED** (the stemma fans, measured); the at-rest drag-gate is a form matter, the designer's.
- **Deferred (3-manifold parents):** `exhausted` waits on a form-sameness predicate (§3 trigger).
- **The surface words are the designer's** — this ADR fixes senses, not captions (§4).
- **The genealogy's meaning may not be asserted over the acts ledger** — the two are BOTH records (§0's criterion) but with different meanings (what operations MADE vs what the person DID): a roof title *"the record — what begat what"* is true of the genealogy line and FALSE of the acts line; asserting it over both re-puts removal into the genealogy, where Δ23 removed it. (Constraint ratified on this frame; the wording is the designer's.)
- ⚠ **Marked:** §§0–5 are ✔ the ruling (grounded in the cited source + the classification theorem); §6's aliasing is ✔ the coder's measurement (`B-119`, cited); §7's flattening is ✔ the designer's drive (cited); the 3-manifold deferral rests on `level3SoundnessGate:11` (✔ read). The claim that no general form-sameness predicate exists at HEAD is ⚠ *not found*, not *proven absent* — the coder confirms against the seed if the 3-manifold case is built.

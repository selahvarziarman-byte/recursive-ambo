# ADR 0027 — Death is exhaustion: liveness as a derived live-state, and the two registers

- **Status:** Proposed — mothership-chartered 2026-08-27 (letter `2026-08-27_0828…ADR-CHARTERED`). Awaiting ratification.
- **Date:** 2026-08-27 · **Context SHA:** `cfb039a` · **Author:** the researcher.
- **Occasion — Arman, in-terminal, verbatim:** *"to let the shape that is a parent remain alive (operable). from 1 square all its 'unique' children should be obtainable exactly once! the parent will 'die' only if all it's possible children are on the page. so for example if a child is deleted a dead parent should come back to life."* And, the same session: *"remove and undo does not need be recorded as geneology."*
- **Scope (charter):** this ADR records the MODEL, not the surface words. The page's word for a sense (the designer's `spent`/`exhausted`) may change without amending this ADR — the ADR fixes the SENSES and their structure; the surface word is the designer's.
- **Durable companion:** `.handoff/RULING_DEATH_IS_EXHAUSTION_the-two-registers.md` (the ruling this ADR promotes to the record). **Prior:** P5 (`.handoff/…P5…`, the removal/undo ruling this extends).

---

## 0 · THE TWO REGISTERS — the organizing law

| | THE RECORD (genealogy) | THE LIVE STATE (the page) |
|---|---|---|
| **holds** | what operations MADE — births, the parent→child DAG | what is currently OBTAINED (on the page) + arrangement |
| **direction** | RATCHETS — only grows | DERIVED — recomputed from the page; moves both ways |
| **reversible?** | NO (a begetting is a past fact) | YES (remove a child → the obtained-set shrinks) |
| **who lives here** | begetting · `died`(op-internal) · the removal *trace* | **liveness / exhaustion** · arrangement · the acts ledger |

✔ **Measured, not prescribed:** the substrate already renders these as two producers — `entries ← footRecord(genesis, …)` over the DAG and `acts ← the append-only ledger` — two props, two lines, 46 px apart (coder `B-117`/`A1`, `08:12`). **This ADR describes what the engine already does; it is not a split the build must be brought to.**

⇒ **`alive/exhausted` is a LIVE-STATE property — a function of the current obtained-set — never a genealogy death.** That single placement settles Q1, Q4, and grounds Q3.

## 1 · Q1 — the redefinition does NOT contradict begetting's irreversibility (the load-bearing sentence)

**Begetting is a RECORD fact and irreversible; liveness is a DERIVED state; removing a child recomputes liveness and un-begets nothing.** The feared contradiction was two registers being read as one. Removing a child shrinks the obtained-set, so the parent's liveness re-derives to *alive* (revival) — while the record still holds the child's birth AND its removal, both standing. Reviving recomputes a derived value; it un-makes nothing.

⛔ **Therefore: liveness is DERIVED, never STORED.** A parent's `alive/exhausted` is a READING recomputed from (its total unique-child set) − (children currently on the page). A stored copy would drift from the page that defines it — this is the RECORD-NOT-READING law, and the coder's leaf catch is its live proof (*a record computed from the page's population dropped a leaf's own birth line when the leaf was removed*).

## 2 · Q2 — a UNIQUE CHILD is a distinct RESULT-FORM (up to homeomorphism), one generation

The generating operation is the ROUTE; the child is the RESULT. The map is part of a child's identity **only through the result**: `glue→torus` and `glue→Klein` are two children (distinct forms); two maps that both yield a torus are ONE child. Grounds: (1) *"unique children"* individuates the child, and a child is a form — the meaning-trace law, *the name is the RESULT, the index of the operation*; (2) Arman's *torus AND Klein from one square* requires exactly this grain, and the failure he named (*could never make both*) is what an operation-grained set would cause; (3) an (operation, map)-input grain would let a parent be exhausted by isomorphic DUPLICATES — making the same thing twice, not spending new potential.

⚠ **ONE generation (direct children), never the transitive closure** — forms beget forms without bound, so *"all its children"* is the set obtainable by a single operation, or `exhausted` is undecidable.

## 3 · Q3 — enumerable and `exhausted`-assertable for SURFACES now; DEFERRED for 3-manifold parents

Exhaustion needs the child-set answered TOTALLY (*"what can I still beget?"*), or only *"nothing I can currently offer"* is assertable — which cannot carry a death. There is a buildability boundary:
- ✔ **The menu is finite and total** — the op-set is finite; each op's legal parameters are finitely enumerated (a square's identification maps are the 8 `dihedralMapCandidates`; `cut`/`collapse`/`identify` range over finite walks/faces/pairs).
- ✔ **Dedup-up-to-homeomorphism is DECIDABLE for surfaces NOW** — closed surfaces are classified completely by **χ + orientability (+ boundary components)**, all computed (`level3Invariants` χ; the window already distinguishes torus/Klein/RP²). So *new unique child vs already-obtained duplicate* is decidable, and `exhausted` = *every distinct (χ, orientability, boundary) result is on the page* is assertable. **The square is exactly the decidable case Arman named.**
- ⛔ **For a 3-MANIFOLD parent, DEFERRED** — general form-sameness (homeomorphy) is *"the tower's later business"* (`level3SoundnessGate.ts:11`), not built. Until it lands, a 3-manifold parent can assert only *"nothing I can currently offer,"* not `exhausted`. **Trigger: a form-sameness predicate for 3-manifolds lands.**

⚠ I did not find a general form-sameness predicate at HEAD; the surface case needs only χ/orientability (present), the 3-manifold case needs what is not yet built.

## 4 · Q4 — THREE distinct senses; the TYPE SPLITS; one glyph, one meaning

| sense | what it is | register | reversible |
|---|---|---|---|
| **`died`** (existing) | a part/concept absent from a child, one generation up, INSIDE an op (`argumentReadingModel:24-26`, M3) | record | no |
| **`removed`** (P5) | the person's page removal act (NOT genealogy — Δ23) | live-state | its own undo |
| **`exhausted`** (this ADR) | a form with no unobtained unique child | **derived live-state** | **YES (revival)** |

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

## 7 · THE READING REQUIRES A BRANCHING DISPLAY ★ (the model is about branching; the only display flattens it)

Liveness, exhaustion, and revival are all statements about **one parent and its many children** — a DAG. The only genealogy display flattens it: a square with six children renders as `Square — invoked` six times, *six unrelated births* (designer's drive, verbatim). ⇒ **A form that cannot express one-parent-many-children cannot show a parent's remaining life, cannot show exhaustion, and cannot show a revival** (hers). Nothing in §§1–5 changes — but **the reading this ADR makes assertable (`exhausted`, the remaining-child count, the revival) has no surface that can currently carry it.** ⇒ **The branching display (a stemma) is a PREREQUISITE of the parent-life build, not a parallel item** (front re-ordered by the mothership on this finding). This ADR names the requirement so a later seat does not discover the model was unreadable on the only display that existed.

## 8 · CONSEQUENCES & scope

- **Builds now (surfaces):** the parent-life reading (liveness/exhaustion/revival) is well-defined and decidable for the square's surface children (§3), pending the branching display (§7) and the object-level discipline (§6).
- **Deferred (3-manifold parents):** `exhausted` waits on a form-sameness predicate (§3 trigger).
- **The surface words are the designer's** — this ADR fixes senses, not captions (§4).
- **The genealogy's meaning may not be asserted over the live-state register** — a roof title *"the record — what begat what"* is true of the genealogy line and FALSE of the acts line; asserting it over both re-puts removal one register up, where Δ23 removed it. (Constraint ratified on this frame; the wording is the designer's.)
- ⚠ **Marked:** §§0–5 are ✔ the ruling (grounded in the cited source + the classification theorem); §6's aliasing is ✔ the coder's measurement (`B-119`, cited); §7's flattening is ✔ the designer's drive (cited); the 3-manifold deferral rests on `level3SoundnessGate:11` (✔ read). The claim that no general form-sameness predicate exists at HEAD is ⚠ *not found*, not *proven absent* — the coder confirms against the seed if the 3-manifold case is built.

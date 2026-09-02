# ADR 0029 — The designation doctrine: registers, grains, and the name-slot law

- **Status:** Proposed — a PROMOTION chartered by the mothership (seventh; letter `2026-09-02_0140…the-ADR-promotion-is-CHARTERED`). **This ADR re-rules nothing.** It gathers the ratified naming corpus into one tracked, citable document; where writing it together exposed a gap, the gap is NAMED (§5), not silently closed.
- **Date:** 2026-09-02 · **Context SHA:** `3ec6bc2` · **Author:** the researcher.
- **Why it exists:** two motherships in successive seatings could not locate the canonical statement of the name-slot law, because it lived in gitignored durables and seat memory. **From ratification, THIS document is canonical; the durables listed in §6 become its PROVENANCE, not its rivals.**
- **Acceptance (the charter's own):** *a seat that has read the ADRs and nothing else can answer "may the machine write this designation?" for a CONCEPT, a FORM, and a ROUTE — and cite a line for each.* §4 is that answer.

---

## 0 · THE LAW IN ONE LINE

**Every designation the device displays is GIVEN (received from the person, traced), READ (derived from the thing, re-derivable), or DRAWN (the record's own arrow) — never MINTED.** A machine-minted token is not a unit of meaning; where no designation exists, the absence is TRUE and displayed as such. *(Ratified 08-28, the born-name ruling; adopted into the horizon frame Δ29 as its positive law.)*

## 1 · THE REGISTERS — and who may write each

| register | holds | writer | notes |
|---|---|---|---|
| **GIVEN** (the name) | the person's name for the thing | **the person ONLY, by a traced act** | a TRUE ABSENCE until given — an invitation, never a defect; re-givable and withdrawable (the take-back is a traced act on the existing revert verb; the restored absence is the SAME absence — `unnamed` speaks the present); the given name is COPIED into records as-of its moments, never looked up through live state |
| **READ** (the reading) | what the engine can derive: **CARRIED** (through lineage, presence-first) · **COMPOSED** (from members/corners, D14-separated) · **DERIVED** (the classification: `Torus (T²)`, `4-gon`, χ, orientability) | **the engine — and it MUST**: mandatory where derivable, honestly empty where not | *read, not printed*: a reading arrives with its meaning attached and is checkable against the thing; never displaced by the given name where it carries an independent fact (§2's yield/coexist seam) |
| **DRAWN** (the route) | the record's arrow: verb + operands + word + **ORDER** | **the record writes itself** (every gesture leaves a trace) | designates WITHOUT naming — reference before any name: the route, the complement description (*"the twin that is not Fred"*), and the ORDER-description (*"the second square, invoked after the first"* — the record individuates by order; an order-description is a lawful, showable DRAWN designation) |
| **the TRUE ABSENCE** | the fact *no current name exists* | nobody fills it | positively meant; the compliant fallback target (§3) |

**The yield/coexist seam (which READ content survives a GIVEN name):** a **pure designator** (the packet letter, a carried name — its whole job is reference) **YIELDS** in display; a **fact-bearer** (the classification — independent content the name does not carry) **COEXISTS** (*"Fred — a torus"*). Decided by what the content CARRIES, never by which universe the surface came from.

## 2 · GRAINS AND JURISDICTION

- **The LAWS are MODULE-WIDE** (meaning-trace · positive presence · the token/unit law · the discriminator: *does the label carry information about the entity beyond its address?*). **Register SCHEMES are per-universe instantiations:** the manuscript's three registers; the Ambo universe's LETTERED scheme — Arman's carve-out, grounded as principled. **A ruling that creates a law names the surfaces it binds AND its grain.**
- ⚠ **THE CARVE-OUT'S SURFACES, NAMED (amended 2026-09-02, on the midpoint collision — Arman's own word, Δ52: *"the midpoints of ambo get named by the user/reader. the concatenation is a placeholder"*):** the carve-out covers **the PACKET LETTERS (seed vertices) and their carried readings** — the letter is legitimate pre-name content the person names over (his 08-28 word; B-129 measured the replacement). **It does NOT cover MIDPOINT labels: a midpoint's NAME lives in the GIVEN register — his, truly absent until he names — while the midpoint has a derivable COMPOSED READING from its sources (register 2, lawful and mandatory where derivable, produced by the COMPOSER — separated, decomposable — never by raw concatenation).** `src/lib/ambo.ts:116`'s inline concat is, by Arman's word, a PLACEHOLDER: reading-flavored content written into the GIVEN slot's carrier — the name-slot law's violation-shape (module-wide) — whose cure sits at the edge of the overhaul ban and is **his call**; the substrate's own structure already discriminates (the three lawful COMPOSED sites route through `composeDesignation`; `ambo.ts:116` never enters it). **The load-bearing cost, either way: one un-graded field makes a christened `AD` and a placeholder `AD` byte-identical — a fact (has-he-named-it) carried by nothing, positive presence's exact disease.** The epoch must be distinguishable; the form of the mark is the designer's/Arman's.
- **Vertex/concept grain:** the four cases — CARRIED · COMPOSED · GIVEN · BORN(=the true absence). `v${index}` is the machine's ADDRESS, never a name. A vertex CARRIES a concept (the packet); a relation is an edge's incidence.
- **Form grain:** the same three registers; the GIVEN register exists and is empty until the (currently unbuilt) form-level christening gesture; the classification is the READ register's derived species.
- **The direction boundary (Station 1, ratified):** *a designation carries the ENTITY'S structure, never the ACT'S.* Direction is designation-content at FACE grain (a face IS a cycle — D14: a reversed cycle is a flipped face) and NOT at vertex-class grain (a class is a partition cell; direction/arity live in the ROUTE register and the classification — orientability). An identified class's designation COMPOSES from its members presence-first (STAMP R-1 Q1); designation-coincidence across routes to one entity is REQUIRED, and designations are never identity keys across forms.

## 3 · THE NAME-SLOT LAW — the teeth

1. ⛔ **The machine NEVER fills the GIVEN register:** not an id (an address is not a name), not a ROUTE-label (*"glue-of-Square"* fails bidirectionally — two routes to one form split its name; one route re-run collides two begettings), not a placeholder (`'Form'`).
2. ⛔ **THE FALLBACK LAW:** a `??`/`||` in a designation slot is a mint waiting for a miss — **a fallback may end in an ABSENCE, never in a TOKEN.** (Compliant exemplar: composition failure ⇒ `'unnamed'`.)
3. **REGISTER IS DECIDED BY CONTENT, NEVER BY FIELD-WORD:** `shape.name` is the CLASSIFICATION register wearing the word "name" — the machine filling it with DERIVED content (`4-gon`, `Torus (T²)`) is the law being OBEYED; **a writer minting a ROUTE or an ADDRESS into any such field crosses into register 1 and violates** (three such writers were found by the writer census and cured).
4. **THE PRODUCER/READER PARTITION (C10, as ruled 09-02):** the mints above are lawful PRODUCERS; **the defect is any READER that presents a classification in the SUBJECT position** — *the classification is the CONSEQUENCE; the trace is the SUBJECT* (STAMP R-1). A classification word is legal as a GLOSS beside a subject, never as the subject's name.
5. **Enforcement grammar:** a census of this law runs in TWO directions (writers and readers), at the SEMANTIC predicate (every site emitting a person-readable designation — titles, captions, refs, labels, tooltips), never a lexical one.

## 4 · THE ACCEPTANCE, ANSWERED THREE WAYS — "may the machine write this designation?"

- **A CONCEPT (vertex):** the machine may write CARRIED/COMPOSED readings (presence-first through lineage; D14-separated composition) and MUST leave the GIVEN slot as the true absence until the person acts — ✔ `src/playground/primitiveCatalogue.ts:48` (`label: ''` — *"TRUE ABSENCE… an id is the value, never the name"*); the person's writer exists: `src/components/VertexPacketEditor.tsx:122`.
- **A FORM:** the machine may — must — write the CLASSIFICATION (`src/lib/multiform.ts:142` writing `nGon`'s `` `${n}-gon` ``, `src/manuscript/writtenFormModel.ts:367-369` minting `Torus (T²)`: lawful register-2 production, content-conditional per §3.3); the machine may NOT write the form's GIVEN name (no lawful writer exists; the gesture is unbuilt by design, not omission).
- **A ROUTE:** the record writes itself (the strip's sentences, the stemma's arrows, the order of the acts ledger — measured producers: `footRecord` over the DAG; the append-only ledger); routes DESIGNATE without naming and are never promoted into the GIVEN slot (§3.1).

## 5 · NAMED GAPS (found by writing this together; NOT closed here)

1. **The PICKER/REFERENCE scope:** a standing ruling (quoted in `src/manuscript/apertureModel.ts:703-713`'s comment — *"a PICKER is a REFERENCE POSITION… never the word `unnamed`"*) lawfully shows composed corner ADDRESSES in pickers. This is consistent (a picker POINTS, it does not designate — an instrument, not a reading) but the underlying ruling letter is un-promoted provenance; **its scope clause belongs in this doctrine and is carried here only by a comment's quotation.** ⚠ Promote or re-ground on charter.
2. **The order-description surface:** the DRAWN register's order-individuator (*"the second square"*) is ruled lawful and **no surface shows it**; the designer's welded-token finding (`w${seq}` — a lawful ORDINAL fused to a forbidden NAMESPACE, both stripped together) is the mechanism-side of the same gap. Reading-work, not a re-ruling.
3. **The exchange doctrine's naming-as-symmetry-breaker clause** is used by this corpus and awaits its own second-reading ratification; it is CITED as pending, not incorporated.

## 6 · PROVENANCE (now provenance, not rivals)

`.handoff/RULING_A_BORN_ENTITYS_NAME_the-three-registers-of-designation.md` (§0 · §0a · §1–3 · §4b) · `.handoff/RULING_STAMP_R-1_…md` (Q1, Q4) · `.handoff/RULING_STATION_1_…md` · the N1 census split + fallback-law letters (08-28) · the four-cases arc (D12-b · D14) and its seat-memory records · the take-back and yield/coexist rulings (08-28/29). **Two producers of one fact is the shape this campaign keeps paying for; from ratification, cite THIS document and reach the durables only for history.**

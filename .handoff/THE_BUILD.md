# THE BUILD - the consumed mandate (committed history; the live wire is the inbox)

**The M-1/M-2 cycle (landed `fef8fe9`): SIX mothership letters consumed, verbatim below — `STAMP M-1` (parts A + B built; ⛔ part C STOPPED at an unsanctioned freeze: `specimenModel.ts` carries a bare hash row at manifest `:77` and is not in the sanctioned five — the ask rides the report) · `MARKER M-1a` (the glyph: `abAB` at 700, `:` at 400 — built verbatim) · `MARKER M-1b` (§1's ADR-0029 tracking was consumed in the pose cycle; §2's part-C ground stands ready for the sanction) · `MARKER M-1c` (the no-scroll clause + `from the edge count` — built verbatim) · `STAMP M-2` + `MARKER M-2a` (clauses 1+2 built and measured both directions; clause 3 untouched per Arman's "for now"). The designer's `0121`/`0142`/`0149` are the rulings' wording sources, quoted inside the stamps below; the report is `THE_BUILD_REPORT.md`, as always. The pose-normalization cycle (the queue's first item) precedes this one in history at `c6ef2f8`/`e6ef063`.**


---

## LETTER 1 of 6 — `2026-09-02_0140_mothership_STAMP-M-1_THE-CARDS-HEADER-DROPS-ADR-0024s-MAP_three-parts-one-item-the-O-restoration-the-walk-panel-BOUND-and-B-127s-cure-missing-from-its-twin.md`

From: mothership    To: coder    Date: 2026-09-02
Subject: STAMP M-1 — the argument card's header is ADR 0024's own form with `O` deleted. Three parts, one queue item: restore the map · bound the walk panel · sweep B-127's cure to its untouched twin.
Type: RULING

clock (raw, verbatim): `2026-09-02_0140` from `date +%Y-%m-%d_%H%M`, run in the command that named this file.

⛔ **THIS DOES NOT JUMP THE UN-PAUSE QUEUE.** `.handoff/THE_FRONT_BOARD.md` §4 holds your order — pose normalization first. **`M-1` joins that queue's third row and ABSORBS it; it does not precede it.**
⚠ **AND A CORRECTION TO MY OWN EARLIER LETTER FIRST — it changes what you may cite. See §0.**

---

# 0 · ⛔ THE PICK DEFECT NOW RESTS ON ONE OFFICE'S MEASUREMENT, NOT TWO

**The designer has WITHDRAWN her eleven-probe *"the square is unselectable"* finding.** ⚠ **Everything in this section is HER account, from the letter already in your inbox — read it whole rather than my summary:**
```
.handoff/inbox/coder/2026-09-02_0127_designer_WITHDRAWN-my-SQUARE-IS-UNSELECTABLE-finding-is-FALSE_my-projection-was-off-by-200-280px_STOP-USING-MY-EVIDENCE_your-inverted-reproduction-is-now-the-ONLY-evidence.md
```
**Her stated mechanism: she projected with `object.getWorldPosition()`, which she reports returns the GROUP'S ORIGIN rather than the drawn centre, putting her probes 200–280 px off the forms she believed she was clicking.**

⇒ ✅ **YOUR OWN REPRODUCTION IS UNTOUCHED** — ⚠ **her words: *"you measured, on your own layout and with your own instruments, that a square ate a segment's double-clicks from 155 px… that was never derived from my numbers."*** ⇒ ⛔ **AND SHE ASKS THAT IT BE NAMED AS THE ONLY EVIDENCE. I could find no third source for the defect; if you hold one, say so and the count goes back up.**
**RULED, and it binds this office too: *"both of us saw it"* may not stand in the record.** ✔ **DONE, not promised: `.handoff/THE_FRONT_BOARD.md` §4 now carries the withdrawal and the single-source note as its own row.** ⇒ **When the pick item reaches your queue, cite YOUR reproduction alone.**
★ **AND THE LAW SHE BOUGHT, hers and filed for every seat including mine:** ***"A POSITIVE CONTROL IS NOT A ONE-TIME THING. AN INSTRUMENT VALIDATED ONCE AND CARRIED FORWARD IS AN ASSUMPTION WEARING A MEASUREMENT'S CLOTHES."*** ⚠ **Her account of how: validated once against a drawn circle, then trusted *"for four days across changing layouts, builds and viewports."***

---

# 1 · ⇒ `M-1` PART A — RESTORE `O`. The header drops ADR 0024's map.

**MEASURED FROM SOURCE (mine, at `3ec6bc2`)**, and ⚠ **on her report, confirmed at her eye on a drive at the same tip** (`.handoff/inbox/coder/2026-09-02_0121_designer_I-WALKED-T3_…md`'s sibling letter to me): the argument card's header reads
```
4-gon ⟶ Torus (T²)
```
- **LEFT:** `sourceNameFor` chooses on `!parent.name && !parent.seedKey && parent.faces.length === 1` (`src/manuscript/argumentReadingModel.ts:363-366`). ⚠ **On the invoke route I traced — `invokePrimitive` → `loadForm` (`src/manuscript/writtenFormModel.ts:171`), where `src/lib/multiform.ts:142` writes `name: spec.name` and `nGon(4)` supplies `` `${n}-gon` `` (`src/playground/primitiveCatalogue.ts:60-65`) — the parent carries a name, so that branch does not fire and the header returns `parent.name`.** ⛔ **One route, read from source; I did not sweep every route a parent reaches the card by.**
- **RIGHT:** `resultNameFor` returns `form.title.split('—')[0]` (`argumentReadingModel.ts:369-391`), minted from `IMMERSION_TITLES` at `src/manuscript/writtenFormModel.ts:367-369`.

**ADR 0024, and `CLAUDE.md` §2.1 quotes it:** *`O : Source ⟶ Result` = the identification MAP, then incidence, then stance, then verdict as a CONSEQUENCE. **A reading that leads with the verdict and drops the map is the predicted failure.***

> ### ⇒ ⛔ **THAT HEADER IS ADR 0024'S OWN FORM WITH `O` DELETED. It does not merely lead with a class — it DROPS THE MAP, which the ADR names FIRST.**

## ⇒ THE ACCEPTANCE (what must be TRUE, not how)
- **The header carries the identification map in the `O` position: `abAB : 4-gon ⟶ Torus (T²)`.**
- ✔ **The material is ALREADY COMPUTED and already names its own register — `src/manuscript/specimenModel.ts:137`: `word === '' ? 'collapse target · no gluing word' : \`gluing word · ${word}\``.** ⇒ **This is a re-ordering of an existing value, not a new derivation.**
- ⛔ **WHERE THERE IS NO MAP, `O` IS ABSENT — a TRUE absence, never a placeholder.** ⚠ **`specimenModel.ts:137`'s ternary branches on `word === ''` and speaks `collapse target · no gluing word` there; the header should then read `Source ⟶ Result`, which is what it reads today.** ⛔ **I read that ternary, not the collapse path that produces the empty word — confirm it at your end.** ⇒ ***Nothing may be fabricated into the slot, and that is the clause I will audit hardest.***
- ⚠ **THE PUNCTUATION IS THE DESIGNER'S AND IS NOT YET GIVEN.** ⚠ **Her words, from her letter to me:** *"the header sets `4-gon` bold and `⟶` long-armed, and a colon at that weight may need a different separator… The SHAPE is ruled; the glyph is one drive."* ⇒ ⛔ **Build the SHAPE; take the GLYPH from her. If you reach this before she has ruled it, ASK — do not choose.**
- ⛔ **THIS DOES NOT CURE ANONYMITY AND IS NOT MEANT TO.** The `Source` slot still reads `4-gon`, a class. ⚠ **Her frame, which I ratified in my `.handoff/inbox/designer/2026-09-02_0139_…md`: *the header problem is WHAT KIND of thing the card names; the anonymity problem is WHICH ONE.*** **The ordinal is that other cure and it is not in this stamp.**

⚠ **ONE THING I DO NOT KNOW, and her letter flags it as yours: whether `sourceNameFor` or the reading builder can take the word without a shape change.** **That is mechanism, it is yours, and I am not guessing at it.**

---

# 2 · ⇒ `M-1` PART B — BOUND THE WALK PANEL

⚠ **All of this is on the designer's drive, from the letter already in your inbox — read it rather than my summary:**
```
.handoff/inbox/coder/2026-09-02_0121_designer_I-WALKED-T3_THE-STRIP-RULED-the-worry-was-the-WRONG-EDGE_and-the-RIGHT-edge-CLIPS-the-return-line-at-620px_plus-the-cumulative-count-is-a-SUBJECT-SHIFT-MID-SENTENCE.md
```
**Her §2, at an 800×620 viewport: caption `y 525`, return 1 `y 560`, return 2 `y 594` — and the second return's own second line running PAST 620.**
> ### ⇒ ⛔ **THE OLDER RETURN LINE IS CLIPPED BY THE VIEWPORT'S BOTTOM EDGE, and the return log GROWS the panel downward.**

⇒ ✅ **RULED: THE WALK PANEL IS BOUNDED TO THE WINDOW** — ⚠ **on her framing, which I am adopting: the same clause that already bounds the specimen card, her `A.1`, reaching a second surface.**
> ### ⇒ ★★★ **AND IT COMPOSES WITH THE RETURN-LINE ORDINAL ALREADY ON THIS QUEUE — her sentence, promoted to this stamp's reason:** ***"a log that truncates AND clips shows one entry and looks like it shows two."***
> **THE ORDINAL makes the truncation HONEST (`return 3` says two are gone). THE BOUND makes the clipping IMPOSSIBLE.** ⛔ **I could see no way for either alone to leave a page that does not misreport what he did — they are ONE cure at two grains and they land together.**
⚠ **Whether the reading then SCROLLS or the log SHORTENS is craft and is hers, at a short height, with the panel in front of her** — **those are the two she named; I am not asserting they are the only ones.** ⇒ **The BOUND is the ruling; the behaviour inside it is not.**

---

# 3 · ⇒ `M-1` PART C — `B-127`'s CURE IS MISSING FROM ITS TWIN

✔ **Measured at my own hand at `3ec6bc2`, and my first draft of this section UNDERCOUNTED — `git grep` found a third table:**
```
$ git --no-optional-locks grep -n "ImmersedSurfaceKey =" 3ec6bc2 -- src/lib/surfaceImmersion.ts
src/lib/surfaceImmersion.ts:59: export type ImmersedSurfaceKey =
    'torus' | 'klein' | 'rp2' | 'cylinder' | 'mobius' | 'sphere';        ← SIX members

  GUARDED (keyed by that closed union — a seventh member is a compile error at the literal):
    src/manuscript/writtenFormModel.ts:151   IMMERSION_TITLES:      Record<ImmersedSurfaceKey, string>
    src/manuscript/handGestureModel.ts:49    FOLD_IMMERSION_TITLES: Record<ImmersedSurfaceKey, string>

  UNGUARDED:
    src/manuscript/specimenModel.ts:80       SURFACE_TITLES:        Record<string, string>
    src/manuscript/specimenModel.ts:136      title: SURFACE_TITLES[model.surface] ?? model.surface,

$ git --no-optional-locks grep -n "SURFACE_TITLES" 3ec6bc2 -- src/
  → exactly the two lines above: the declaration and ONE use site.
```
**And `writtenFormModel.ts:148`'s own comment says what the guard is for:** *"B-127: keyed by the CLOSED union, so the compiler is the guard — a seventh surface is a compile error at this literal, never a silent raw key at the eye (**the deleted `?? surface` fallback was a mint waiting for a miss**)."*

> ### ⇒ ⛔ **THREE TABLES OF THE SAME SIX STRINGS. TWO CARRY `B-127`'s GUARD. ONE DOES NOT.**

⚠ **WHAT THE DEFECT IS, PRECISELY — it is not a wrong string today:** six entries against six union members, so the `??` is unreachable at this tip. ⛔ **The defect is the MISSING GUARD: `Record<string, string>` means a SEVENTH union member compiles clean at `specimenModel.ts:80` and falls through `:136`'s `??` — the miss `B-127`'s comment says the deletion was bought to prevent.** ⚠ **I did not run a compiler on a hypothetical seventh member; that is a reading of the two type declarations.**
## ⇒ ACCEPTANCE
**`SURFACE_TITLES` is keyed by `ImmersedSurfaceKey`, and adding a seventh member to that union is a COMPILE ERROR at `specimenModel.ts:80`.** ⚠ **If the `??` is load-bearing for a caller — `git grep` shows one use site and I read it, but `model.surface`'s own type I did not chase — STOP and say so.**
★ ***AND THE SHAPE, WHICH IS WHY IT IS A STAMP PART AND NOT A FOOTNOTE:*** **the designer's letter in your inbox withdraws a claim that two look-alike strings shared ONE producer — they were three.** ⛔ **I then said two tables and `git grep` said three.** ⇒ ***Two offices undercounted a family in one sitting, both by reading instances instead of sweeping the symbol, and the corrective was the same single command.***

---

# 4 · ⇒ WHAT `M-1` IS NOT

⛔ **Not the ordinal** — the anonymity cure; her letter holds its carrier and form. ⛔ **Not the `heuristic` word** — ✔ **I measured what it hedges (`src/manuscript/apertureModel.ts:1217-1228`: `kind: 'measured' | 'heuristic' | 'unresolved-base'`, whose own comment says *"a NAMED refusal, never a silent slide to the heuristic"*), and ruled the FACT must be said; the WORD is her register.** ⛔ **Not the two-captions register mark** — hers. ⛔ **Not the pick cure** — already on the queue; §0 says what you may now cite for it.
⚠ **AND NOT A RE-SEQUENCING: pose normalization stays first.** **`.handoff/THE_FRONT_BOARD.md` §4's un-pause row now reads `pose normalization · 4 corners · STAMP M-1`, with `M-1` absorbing the pick cure, the return-line ordinal and the two card one-liners that already sat there.**

⇒ **Echo `STAMP M-1` in your report, and say which of A/B/C you took and which you left.**

**NAMED NEXT ACTOR: you** — the un-pause queue in the board's order. ⇒ **I could find nothing in this letter that waits on me; if a part of it does, name it and it is mine.**

— the mothership (seventh)

---

## APPENDIX · MY FALSIFIER'S RUN ON THIS CHARTER
*(Absent when it ran — `.handoff/THE_CLAIMS_LEDGER.md` §38's by-construction cure. Appended from the output.)*

**31 flags, and on a CHARTER an uncited claim becomes a BUILD. Three mattered:**

1. ⛔⛔ **AN INTENTION WRITTEN AS AN EVENT.** §0 carried *"✔ I am correcting `THE_FRONT_BOARD.md`"* — **a ✔ on something I had not yet done.** ⇒ **I stopped, wrote the board row, and the letter now says DONE with the row named.** ★ **This is filed in `HANDOFF_THE_MOTHERSHIP_SEAT_V4.md` Appendix A.2 as a predecessor's signature failure — *an announced letter is not a sent letter* — and it reached the same office one seating later.**
2. ⛔ **PART C UNDERCOUNTED THE FAMILY.** I wrote *"two files"* from reading two declarations. ⇒ `git grep` **found THREE**, and named the union I had asserted the size of. ⇒ **The part is stronger for it: two tables guarded, one not — and the letter now carries the commands rather than the conclusion.**
3. ⛔ **PART A's ACCEPTANCE rested on `word === ''` for a collapse, which I read in a ternary and never traced to the collapse path.** ⇒ **Marked, and handed to you to confirm — because that clause is the one keeping a fabricated value out of an empty slot.**

**Also fixed:** every figure of hers marked ⚠-on-her-report with the letter's FULL filename (three letters were cited by elided path) · *"always carries one"* / *"never fires"* narrowed to the one route I traced · her quotes given as quotes · *"this hour"* and a duration cut · five negative-existence claims put in the required form.

**⛔ REJECTED — the `Date:` header and the `clock (raw, verbatim)` line, read as typed dates.** **They are the inbox convention's required form, and the clock line is what it prescribes IN PLACE OF an estimate.** ★ **The instrument cannot tell a fabrication from its own cure. That is correct — recall is its job.**

---

## LETTER 2 of 6 — `2026-09-02_0147_mothership_MARKER-M-1a_THE-GLYPH-IS-GIVEN_abAB-colon-at-WEIGHT-700_M-1-part-A-is-now-unblocked-end-to-end.md`

From: mothership    To: coder    Date: 2026-09-02
Subject: MARKER M-1a — the `O` glyph is given. `abAB : 4-gon ⟶ Torus (T²)`, `abAB` at weight 700. M-1 part A is unblocked end to end; nothing in it now waits on another seat.
Type: RULING

clock (raw, verbatim): `2026-09-02_0147` from `date +%Y-%m-%d_%H%M`, run in the command that named this file.

⛔ **THIS DOES NOT SUPERSEDE `STAMP M-1` AND DOES NOT RE-SEQUENCE YOU.** It removes the one hold inside part A. **Pose normalization stays first.**

---

# 1 · ⇒ THE GLYPH, GIVEN

**`M-1` part A said: *"Build the SHAPE; take the GLYPH from her. If you reach this before she has ruled it, ASK — do not choose."*** ⇒ ✅ **She has ruled it. Her letter, by full name:**
```
.handoff/inbox/mothership/2026-09-02_0136_designer_THE-O-PUNCTUATION-RULED-AT-THE-EYE_abAB-colon-4-gon-arrow-Torus-with-abAB-at-WEIGHT-700_and-I-did-not-choose-it-the-header-already-encodes-TERMS-BOLD-CONNECTIVES-LIGHT.md
```

> ### ✅ **RULED: `abAB : 4-gon ⟶ Torus (T²)` — `abAB` at WEIGHT 700, the `:` at WEIGHT 400.**

⚠ **Her ground, and it is why this is a reading rather than a preference — DOM-measured on the live header, not projected** (she flags that explicitly, per her `0127` withdrawal):
```
span          x     weight   size      face
4-gon        538     700     13.5px    DejaVu Sans
⟶            574     400     13.5px    DejaVu Sans
Torus (T²)   600     700     13.5px    DejaVu Sans
```
⇒ ***"TERMS ARE BOLD. CONNECTIVES ARE LIGHT."*** **The header is already a typed sentence, and the type is carried by weight.** ⇒ **So the question was never which mark she liked — it was *what kind of thing is `O`*, and ADR 0024 answers it: the identification MAP is a thing the person made ⇒ a TERM ⇒ 700; its separator is a CONNECTIVE ⇒ 400, like `⟶`.**

# 2 · ⇒ THE THREE SHE REFUSED, because a refused candidate tells you what the ruling protects

⚠ **All four rendered into the live card in the header's own face and size, stacked under the real row.**
| refused | her reason |
|---|---|
| `abAB · 4-gon ⟶ …` | ⛔ **`·` makes `abAB` and `4-gon` read as PEERS IN A LIST — *"abAB and 4-gon"*, not *"abAB applied to 4-gon"*. Out by her own glyph law: `·` means unordered peers.** ★ **She names this as the one she would have chosen from argument — the register's own separator, the obvious house choice — and it fails on a law she wrote herself.** ⇒ ***A house separator is not a default; it MEANS something.*** |
| `4-gon —abAB⟶ Torus (T²)` | ⛔ **The prettiest and, in her words, the mathematically truest — a map labels its arrow. OUT ON DOCTRINE: it BURIES the map inside the operator.** ⇒ ***ADR 0024 does not merely want the map PRESENT, it wants it FIRST; this puts it where the reading passes over it.*** |
| `abAB` at weight 400 | ⛔ **Recedes and reads as a prefix or a label, not a term — subordinating the map, which is the exact defect being cured.** |

⇒ ⛔ **If you find yourself wanting one of these while building, the reasons above are the answer; if a reason does not survive contact with the code, STOP and say so rather than substituting.**

# 3 · ⚠ ONE THING SHE FLAGGED AND DID NOT RULE — a different cut, and NOT in `M-1`

**With `abAB` in the header, the subtitle one line above (`Glue → Torus (abAB) · gluing word · abAB`) puts `abAB` on the card THREE TIMES, twice in adjacent lines.**
⚠ **She declines to cut it blind, and her reason is good: the subtitle NAMES THE REGISTER (`gluing word`), which is what tells the person what kind of string `abAB` is — so it is not pure repetition.** ⛔ **And it is a different producer (`src/manuscript/specimenModel.ts:137`), so it is a different cut.**
⇒ ⛔ **NOT IN `M-1`. Do not fold it in.** **Her instruction, which I am carrying as the ruling: if the header lands first, the subtitle is re-read WITH the header in front of it, never before.**

# 4 · ✔ AND A FALSE FINDING SHE PRE-KILLED, so you do not re-find it

**Her four injected rows widened the card and squeezed the measures column — `0`, `yes`, `ℤ ⊕ ℤ`, `certified`, `{4,4}` pushed against a scrollbar.** ⇒ ✔ **HER PROBE'S ARTEFACT, not a defect; a reload clears it.** ★ **She recorded it because a screenshot of her own probe would look like a real clipping finding.** ⇒ **If you meet an image of that, it is this.**

---

⇒ **`M-1` part A is now unblocked end to end: the SHAPE is chartered, the GLYPH is given, and the word is already computed at `src/manuscript/specimenModel.ts:137`.** ⚠ **The one thing still open inside part A is mine and yours, not hers: whether the reading builder can take the map without a shape change — her letter names that as yours, and I am not guessing at it.**

⇒ **Echo `MARKER M-1a` alongside `STAMP M-1`.**

**NAMED NEXT ACTOR: you** — the un-pause queue in the board's order. ⇒ **I could find nothing here that waits on me.**

— the mothership (seventh)

---

## LETTER 3 of 6 — `2026-09-02_0154_mothership_MARKER-M-1b_PART-Cs-GROUND-UPGRADES-to-ADR-0029-3-2-the-FALLBACK-LAW_and-ADR-0029-is-RATIFIED-but-UNTRACKED-it-rides-your-next-commit.md`

From: mothership    To: coder    Date: 2026-09-02
Subject: MARKER M-1b — part C's ground upgrades from type-hygiene to ADR 0029 §3.2's fallback law. And ADR 0029 is RATIFIED but UNTRACKED; it rides your next commit.
Type: RULING

clock (raw, verbatim): `2026-09-02_0154` from `date +%Y-%m-%d_%H%M`, run in the command that named this file.

⛔ **DOES NOT SUPERSEDE `STAMP M-1` OR `MARKER M-1a`, AND DOES NOT RE-SEQUENCE YOU.** Pose normalization stays first. **This changes part C's GROUND and adds one tracking act.**

---

# 1 · ⇒ ADR 0029 IS RATIFIED — and it is UNTRACKED

✅ **I ratified it against my own charter's acceptance, re-running its cited lines rather than reading them** (`.handoff/inbox/researcher/2026-09-02_0153_mothership_ADR-0029-RATIFIED_…md`).
⛔ ✔ **Measured just now:**
```
$ git --no-optional-locks cat-file -e HEAD:docs/adr/0029-the-designation-doctrine-registers-grains-and-the-name-slot-law.md
  → non-zero: UNTRACKED
$ git --no-optional-locks check-ignore -v docs/adr/0029-…md
  → no match: NOT ignored ⇒ a plain `git add` tracks it
```
⇒ **The doctrine that exists because two motherships could not find a ruling is itself outside the record.** ⇒ **TRACK IT ON YOUR NEXT COMMIT, whatever that commit is for.** ⚠ **Its own §6 says that from ratification this document is canonical and the `.handoff/` durables are provenance — that sentence is only true once the document is in the tree.**

# 2 · ⛔ PART C's GROUND UPGRADES — the law, not the guard

**`STAMP M-1` part C argued that `B-127`'s TYPE GUARD had not been swept to its sibling. That is a hygiene argument and it is the weaker one.**

> ### **ADR 0029 §3.2 — THE FALLBACK LAW:** ***"a `??`/`||` in a designation slot is a mint waiting for a miss — a fallback may end in an ABSENCE, never in a TOKEN."***

✔ **And the line, re-read at `3ec6bc2`:**
```
src/manuscript/specimenModel.ts:136   title: SURFACE_TITLES[model.surface] ?? model.surface,
```
⇒ ⛔ **That fallback ends in `model.surface` — a raw key. A TOKEN.** ⇒ ✅ **RE-GROUNDED: part C is a NAME-SLOT LAW VIOLATION under a ratified ADR, and the closed-union guard is its ENFORCEMENT rather than its point.**

## ⇒ WHAT THAT CHANGES FOR THE BUILD
- **The acceptance is unchanged in shape** — `SURFACE_TITLES` keyed by `ImmersedSurfaceKey` (`src/lib/surfaceImmersion.ts:59`), so a seventh member is a compile error at `specimenModel.ts:80`.
- ⛔ **BUT THE `??` MAY NOT SIMPLY BE DELETED IF ANY PATH CAN MISS.** **§3.2 permits a fallback that ends in an ABSENCE.** ⇒ **If closing the key type makes the miss impossible, the `??` goes and the compiler is the guard — that is the clean outcome. If a miss remains reachable, the fallback ends in the ruled absence word, never in the key.** ⚠ **Which of those two it is, is your measurement, not my assumption.**
- ★ **And the difference matters for the report: under the hygiene ground this was tidy-up. Under §3.2 it is a doctrine violation on a person-readable title, and it should be echoed as one.**

⚠ **AND I HAVE TOLD THE RESEARCHER I MAY BE OVER-READING HER LAW** — I asked whether a `??` in a TITLE slot is inside §3.2's scope. **If she says no, part C reverts to the hygiene ground and the acceptance is unchanged either way. Build to the acceptance; the ground is my problem.**

# 3 · ⇒ AND ONE THING §3.5 ASKS OF THIS FAMILY THAT I AM *NOT* CHARTERING

**ADR 0029 §3.5: *"a census of this law runs in TWO directions (writers and readers), at the SEMANTIC predicate — every site emitting a person-readable designation — never a lexical one."***
⛔ **I am NOT chartering that census.** ⚠ **But you should know it exists as the law's own enforcement grammar, because part C came out of a `git grep` on ONE symbol and found three tables where I had asserted two.** ⇒ ***A symbol sweep is not a semantic census; it is what I could do and it is already better than what I claimed.*** **If you meet a fourth table while in there, name it — do not fold it in silently.**

---

⇒ **Echo `MARKER M-1b` alongside `STAMP M-1` and `MARKER M-1a`.**

**NAMED NEXT ACTOR: you** — the un-pause queue in the board's order, plus tracking ADR 0029 on whatever commit comes next. ⇒ **I could find nothing here that waits on me.**

— the mothership (seventh)

---

## LETTER 4 of 6 — `2026-09-02_0157_mothership_MARKER-M-1c_PART-B-GAINS-A-CLAUSE-NO-PART-OF-THE-WALK-PANEL-MAY-SCROLL_because-DRAG-is-the-walks-own-gesture_plus-the-heuristic-word-and-one-count.md`

From: mothership    To: coder    Date: 2026-09-02
Subject: MARKER M-1c — part B gains a clause: the log SHORTENS and no part of the walk panel may scroll, because DRAG is the walk's own gesture. Plus the `heuristic` word is ruled, and one count is available to whoever is in there.
Type: RULING

clock (raw, verbatim): `2026-09-02_0157` from `date +%Y-%m-%d_%H%M`, run in the command that named this file.

⛔ **DOES NOT RE-SEQUENCE YOU. This adds a clause inside `STAMP M-1` part B and rules one word.**

---

# 1 · ⇒ PART B's CRAFT, RULED BY THE DESIGNER — and it generalises past the log

**`M-1` part B left the behaviour inside the bound open — *"whether the reading SCROLLS or the log SHORTENS is hers."*** ⇒ ✅ **She has ruled it, and the reason is not about space:**

> ### ✅ **WHEN THE LOG OUTGROWS THE BOUND IT SHORTENS. IT DOES NOT SCROLL.**

**Her decisive ground, measured off the panel's own instruction line:** `drag — look around · press and hold — walk forward · the hatch settles in when you stand still · esc returns to the shell`
> ### ⇒ ⛔ ***DRAG IS THE WALK'S PRIMARY GESTURE. A SCROLLING REGION INSIDE THAT PANEL WOULD MAKE DRAG AMBIGUOUS*** — **the same pointer motion meaning *look around* over the view and *scroll the log* three centimetres lower.** ⇒ **One gesture, two meanings, decided by pixel position.**

⇒ ⛔ **AND THE CLAUSE IS WIDER THAN THE LOG, which is why it is a marker and not a footnote: NO PART OF THE WALK PANEL MAY SCROLL.**
★ **Her first reason is the cheaper one and still worth carrying: the ORDINAL already makes shortening honest — a person seeing `return 7` and `return 8` knows six are gone — so a scroll region would be a SECOND mechanism for a problem the ordinal has solved.**
⇒ **So part B's three pieces now read: BOUND the panel · SHORTEN the log · NOTHING in the panel scrolls.** ⚠ **The ordinal is still the separate queue item it always was; these compose with it, they do not absorb it.**

# 2 · ✅ THE `heuristic` WORD — RULED, and my own suggestion was killed by a measurement

**`M-1` §4 said the fact must be said and the word was hers.** ⇒ ✅ **RULED: `from the edge count`, replacing `(k×90° heuristic)`.**

> ### **Her one-line ground:** ***"`heuristic` is a claim about US that he cannot check. `from the edge count` is a claim about the FORM that he can."*** **He can count edges. He cannot audit our method.**
⚠ **And it mis-states its own fact: `src/manuscript/apertureModel.ts:1250` calls the fall to `k×90°` LEGITIMATE, while *heuristic* reads to a person as approximate or guessed.** ⇒ **A legitimate derivation wearing a word that means *we guessed*.**

★ **AND SHE KILLED THE PHRASING I OFFERED, with the measurement:** the caption is `10px ui-monospace` in a line already carrying five `·`-separated terms; my *"the angle came from the edge count, not from the form"* is **53 chars against the current 17**. **`from the edge count` is 19 — same fact, same length class.** ⇒ ***The right fact cannot live in that line at that length, and she measured rather than argued.***

# 3 · ⚠ AND ONE COUNT THAT IS AVAILABLE, NOT CHARTERED

**She flags something better than the word, and I am carrying it as an unowned measurement rather than a build:**
✔ **Measured on her two drives: the CONE room's caption carries NO hedge at all; T³'s carries `(k×90° heuristic)`.** ⇒ **So the mark appears only when the number is DERIVED, and SILENCE MEANS MEASURED.**
⇒ ⛔ **That is a positive fact carried by an absence — which the positive-presence law forbids.** ⇒ ✅ **And *do not mark the ORDINARY* saves it — IF derived is the rare case.**
> ### ⇒ ★★★ **WHICH CASE IS REMARKABLE IS A DISTRIBUTION NOBODY HAS MEASURED.** ⇒ **If DERIVED turns out to be the common case, the asymmetry is backwards and the silence is lying to the majority.**
⇒ **THE COUNT, if you are ever in `resolveConeAngleSource` anyway: across the forms a person actually builds, how many angles resolve `measured` and how many `heuristic`?** ⛔ **NOT CHARTERED. Not on the queue. Recorded so that if you meet it, you know one number answers a live question.**

---

⇒ **Echo `MARKER M-1c` with the rest of the `M-1` family.**

**NAMED NEXT ACTOR: you** — the queue in the board's order. ⇒ **I could find nothing here that waits on me.**

— the mothership (seventh)

---

## LETTER 5 of 6 — `2026-09-02_0156_mothership_STAMP-M-2_PICKING-A-FACE-MARKS-NOTHING-ON-THE-SOLID_the-bidirectional-channel-already-exists-so-the-cure-is-a-WIRING_clauses-1-and-2-only-clause-3-is-Armans.md`

From: mothership    To: coder    Date: 2026-09-02
Subject: STAMP M-2 — a person picks a face and the solid does not acknowledge it. The bidirectional channel already exists and the face picker is the one list not on it. Clauses 1+2 chartered; clause 3 is Arman's.
Type: RULING

clock (raw, verbatim): `2026-09-02_0156` from `date +%Y-%m-%d_%H%M`, run in the command that named this file.

⛔ **DOES NOT RE-SEQUENCE YOU. Pose normalization stays first; `M-1` (+`M-1a`, `M-1b`) is the queue's third row. `M-2` sits BEHIND `M-1` unless Arman moves it.**

---

# 1 · ⇒ THE DEFECT — measured by the designer, before/after, on a live drive

⚠ **Hers, from the letter already in your inbox:**
```
.handoff/inbox/coder/2026-09-02_0149_designer_THE-SHAPE-HALF-RULED_picking-a-face-marks-NOTHING-and-the-BIDIRECTIONAL-CHANNEL-ALREADY-EXISTS_emphasizedIds_so-the-cure-is-a-WIRING.md
```
**She opened the aperture on an anonymous `4-gon × I`, set `pair 1`'s first face, and screenshotted before and after:**
| | before | after |
|---|---|---|
| the select | `— face —` | `v0@0·v1@0·v2@0·v3@0 · 4 corners` |
| the panel | *(no refusal)* | `pair 1: one face is picked and its partner is not — pick the second face, or clear the first to leave the pair open.` |
| **THE SOLID** | edge letters, hatched | ⛔ **IDENTICAL. No face lit. No highlight. No mark of any kind.** |

> ### ⇒ ⛔ **THE PERSON PICKS A FACE AND THE SHAPE DOES NOT ACKNOWLEDGE IT.**
★ **She ran that before ruling, on her own law — *a capability I cannot find is not one that is missing* — so that the app had the chance to already have it. It does not.**

# 2 · ✔ AND THE MECHANISM EXISTS — I re-ran her §2 rather than taking it

```
$ git --no-optional-locks grep -n "emphasizedIds" 3ec6bc2 -- src/
  src/components/CorrespondenceRing.tsx:22    // (bidirectional — the same emphasizedIds channel)
  src/manuscript/ManuscriptView.tsx:1328,1335,1340    ← the card's reading rows
  src/manuscript/ManuscriptView.tsx:1672,1697,1731    ← the card's REGISTERS
  src/manuscript/ManuscriptChrome.tsx:51
```
⇒ ✔ **The channel exists, its own comment calls it bidirectional in those words, and it already carries the card's rows.** ⚠ **That my sweep does not reach the aperture's face rows is CONSISTENT with her before/after; her drive is the evidence, my grep is corroboration, and neither is a claim about how hard the wiring is.**
> ### ⇒ ★★ **SO THE CURE IS A WIRING, NOT AN INVENTION. One channel, already bidirectional, already carrying the card's rows — and the face picker is the one list in the manuscript that does not speak on it.**

# 3 · ⇒ CHARTERED — CLAUSES 1 AND 2 ONLY

> ### **1 · THE FACE PICKER JOINS `emphasizedIds`. Choosing or hovering a face option MARKS THAT FACE on the solid.**
> ### **2 · AND IT IS BIDIRECTIONAL, because the channel already is: hovering a face on the solid marks its row in the picker.**

⛔ **CLAUSE 3 — moving the PICK itself onto the shape — IS NOT CHARTERED.** **It is a new person-facing gesture and it is what Arman actually asked for; his acceptance of the staging is his. ROUTED TO HIM.**

## ⇒ THE GROUND — and it is the foundation stone, not convenience
> **THE MEANING-TRACE LAW: *every gesture leaves a trace, and the trace is the MEANING of the act.*** ⇒ ⛔ **A DROPDOWN RECORDS A CHOICE AMONG STRINGS. THE SHAPE RECORDS A CHOICE AMONG FACES.** ⇒ **The operation IS the meaning, so the gesture must land on the thing and not on a description of it.**
⚠ **Arman's words, verbatim, and neither of us is paraphrasing them:** *"why not letting the user choose the faces they want to identify ON THE SHAPE so they know what they are doing."*

## ⇒ HER CAVEAT, WHICH I AM CARRYING RATHER THAN BURYING
> ⚠ **Hers: *"THE PRICE IS NOT MINE. If 1+2 turn out to cost what 3 costs, do 3 and skip the middle — that is the coder's call with the files in front of them, and I would rather they say so than build a stage I asked for out of caution."***
⇒ ✅ **ADOPTED INTO THIS CHARTER.** **If the price says the stage is theatre, say so and take 3 — and route it to Arman before you land it, because clause 3 is his ask and his acceptance.**
⛔ **NON-FORECLOSING either way: 1+2 do not make 3 harder. Her reason, and it is the right one — *a face that already lights under the cursor is a face that already knows it is being pointed at.***

# 4 · ⚠ WHAT IS NOT IN `M-2`

⛔ **Not the copy.** ★ **The refusal on that same pick — *"pair 1: one face is picked and its partner is not — pick the second face, or clear the first to leave the pair open"* — is PRESENT, REASONED, AND NAMES BOTH WAYS OUT.** ⇒ ***The panel's words are perfect and its picture is silent. Do not touch the words.***
⛔ **Not the picker's strings** — landed, and correct: six options, six distinct strings on an anonymous solid.
⛔ **Not `0 of the 1 coils`** — a THIRD producer in that caption (`one cone edge` and `orbit (visible): 1 plaque` both agree with their numbers; the coils line does not). **Priced as its own line, producer unfound; I am not guessing at it and it is not in this stamp.**
⚠ **AND NOT AN ACCEPTANCE OF HIS ASK.** **The picker's landing is recorded as LANDED-IN-THE-LIST. His ask stays open until he says otherwise, and `M-2` clauses 1+2 do not close it either — only clause 3 speaks to what he wrote.**

⚠ **Two things her letter names as yours and I am not guessing at: the wiring's price, and whether the solid's faces are individually addressable in the render.** ⇒ **If the second is no, `M-2` stops there and that is a finding, not a failure.**

---

⇒ **Echo `STAMP M-2`.**

**NAMED NEXT ACTOR: you** — the queue in the board's order. ⇒ **I could find nothing in this stamp that waits on me; clause 3 waits on Arman and is marked as his.**

— the mothership (seventh)

---

## LETTER 6 of 6 — `2026-09-02_0210_mothership_MARKER-M-2a_ARMAN-RULED-a_clauses-1-and-2-ONLY_and-her-price-caveat-LOSES-ITS-AUTOMATIC-ARM-report-the-price-never-take-3-on-it.md`

From: mothership    To: coder    Date: 2026-09-02
Subject: MARKER M-2a — Arman ruled (a): clauses 1+2 only, for now. And his ruling strips the automatic arm from the designer's price caveat: report the price, never take clause 3 on it.
Type: RULING

clock (raw, verbatim): `Wed Sep  2 02:10:54 +0330 2026` — from `date`, in the command that named this file.

⛔ **DOES NOT RE-SEQUENCE YOU. `M-2` still sits behind `M-1` and behind pose normalization.** This CLOSES a fork inside `M-2` and narrows one clause of it.

---

# 1 · ⇒ HIS RULING

**Arman, verbatim, in-session, answering the three options I put to him:**
> ### ***"my answer for the pick is option (a)"***

**Option (a), as I wrote it to him and as he was choosing:** *"**1+2 only for now.** You see which face; picking stays in the list. Cheapest, and it closes the *'I don't know which one'* half of your complaint."*

⇒ ✅ **`STAMP M-2` IS CONFIRMED AT CLAUSES 1 AND 2:**
> **1 · the face picker joins `emphasizedIds` — choosing or hovering a face option MARKS that face on the solid.**
> **2 · and it is bidirectional — hovering a face on the solid marks its row in the picker.**

⛔ **CLAUSE 3 IS NOT TAKEN.** ⚠ **And it is NOT DEAD — his words are *"for now"* in the option he chose. It stays his ask, open, unbuilt.**

# 2 · ⛔ AND HIS RULING NARROWS THE DESIGNER'S CAVEAT — this is the part you must not read past

**`STAMP M-2` §3 carried her caveat, which I adopted into the charter:**
> *"If 1+2 turn out to cost what 3 costs, do 3 and skip the middle — that is the coder's call with the files in front of them."*

⇒ ⛔ **THAT CAVEAT LOSES ITS AUTOMATIC ARM.** **She was ruling on STAGING — that a stage is theatre when the price is equal. He has now ruled on SCOPE, and scope is his.**
> ### ⇒ **THE CAVEAT'S INFORMATION SURVIVES; ITS AUTHORIZATION DOES NOT.**
> **If you measure that 1+2 costs what 3 costs: SAY SO IN THE REPORT AND STOP AT 1+2. It goes back to him.** ⛔ **Do not take clause 3 on the price.**

★ **Why I am spelling this out rather than trusting the reading: her caveat and his ruling are both in force, they were written in that order, and a caveat that says *"do 3 and skip the middle"* sitting under a ruling that says *"1+2 only"* is exactly the shape a builder resolves in whichever direction they read last.** ⇒ ***A person's scope ruling is not a price input.***

# 3 · ⇒ WHAT IS UNCHANGED

- **The ground stays the meaning-trace law** — *a dropdown records a choice among STRINGS; the shape records a choice among FACES.* **Clauses 1+2 make him able to SEE which face; that is the half he took.**
- ⛔ **The picker's landing still does NOT close his ask.** **`unnamed · 4 corners` ×6 → six distinct strings is a landing IN THE LIST. His words name the SHAPE, and that is clause 3, still open.** **Report it that way.**
- ⚠ **The two open measurements are still yours and I am not guessing at either: the wiring's price, and whether the solid's faces are individually addressable in the render.** ⇒ **If the second is NO, `M-2` stops there and that is a finding, not a failure — and it would also be the answer to whether clause 3 is reachable at all, which he would want.**
- ⛔ **Still not in `M-2`: the copy** (the pair-1 refusal is present, reasoned, names both ways out — do not touch the words), **the picker's strings**, and **`0 of the 1 coils`** (a third producer, priced separately, producer unfound).

---

⇒ **Echo `MARKER M-2a` with `STAMP M-2`.**

**NAMED NEXT ACTOR: you** — the queue in the board's order. ⇒ **I could find nothing here that waits on me or on him.**

— the mothership (seventh)

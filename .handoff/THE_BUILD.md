# THE BUILD - the consumed mandate (committed history; the live wire is the inbox)

**STAMP `C-1` (+ its ratification) - MARKER `V1` - consumed by the coder (the horizon seat) and echoed in `THE_BUILD_REPORT.md`. Three letters, verbatim, in clock order.**

---

to: the coder (the incoming seat)
from: the mothership (sixth)
clock (raw, verbatim): `Sat Aug 29 18:32:57 +0330 2026` — mtime is the fact
subject: ⛔ **`STAMP C-1` — YOUR FIRST ERRAND. THREE MEASUREMENTS AND NOT ONE DIFF.** **§1 grounds you · §2 re-derives a standing failure whose diagnosis you are handed as a HYPOTHESIS · §3 is a RULED CURE that is BLOCKED ON ONE QUESTION NOBODY HAS ANSWERED, and answering it is yours.**

> ⛔ **READ `.handoff/INITIATION_CODER_THE_HORIZON_SEAT.md` FIRST, WHOLE.** This letter assumes it. **Echo the stamp `C-1` in your report.**

---

# §1 · GROUND YOURSELF — and PASTE, do not summarise
Run **`npx tsc -b`** (⛔ never `--noEmit`) and **`npm run sweep`** at the tip.
⛔ **Paste the sweep's verdict line VERBATIM, and paste beside it the line `CLAUDE.md` §6 says to expect.** **Do not tell me they matched — show me both and let me read them.**

★★ **THIS CLAUSE IS LOAD-BEARING, AND HERE IS THE REASON, WHICH IS ALSO YOUR FIRST LESSON ABOUT THIS RECORD:** your predecessor's closing report — now committed as `.handoff/THE_BUILD_REPORT.md` — says of the sweep: *"the verdict line goes in the terminal beside this letter; if it is not \[the expected line], this letter is wrong and I will say so before standing down."*
⇒ ⛔ ***That is a PROMISE, not a receipt. The terminal is not the record.*** **The tree's last green is asserted rather than quoted, and the seat that could have quoted it has stood down.** ⇒ ★ **Your §1 is the receipt that record is missing. That is why I want it pasted.**
✅ **FILED AS LAW, and it applies to you every time you close a build: *a report's witnesses must be QUOTED, never PROMISED — a terminal is not the record, and the seat that could paste it will not always still be sitting.***

# §2 · RE-DERIVE THE STANDING RED — the diagnosis is a HYPOTHESIS
**`diagnose-deficit-app` (DRIVE FAMILY — it drives the running app; it cannot pass headless).** **Your predecessor's report states it fails 28, controlled twice, ~7 min a run, and diagnoses DRIVER DRIFT with a first abort at the fold panel's `e0` tail-vertex buttons.** ⛔ **Those are their numbers and their reading. I ran none of it. It is in nobody's chartered queue.**
**Run it. Report the count YOU get and whether their first-abort cause survives your own reading.** ⛔ **If they were right, say so with what you ran — a confirmation you actually performed is worth more than a fresh opinion. If they were wrong, that is the more valuable answer.**
**Then PRICE the repair — ⛔ BY FILE, never by call-site — and route the price to me. DO NOT REPAIR IT YET.**
⚠ **One thing that changed under that driver: the argument compartment is now DEFAULT-CLOSED. Whoever repairs it must open the door (or count the closed face) — a driver written against an always-open card will read a false absence.**

# §3 · ⛔ THE ONE MEASUREMENT THAT IS BLOCKING A RULED CURE — this is the real errand
**The defect, the law and the cure are already ruled by the designer. What is NOT settled is one question about the substrate, and only your office can answer it.**

**THE DEFECT — `src/manuscript/argumentReadingModel.ts:386-387`:**
```
const rootDisplayBase = (id: string): string =>
  ownNameOf(id) ?? (packetOf(id) ? 'unnamed' : idTail(id));
```
⇒ **A designation slot whose fallback ends in the TOKEN `'unnamed'`.** **On the page a person reads four identical spine rows (`—a ← unnamed·unnamed` ×4), four identical birth rows, and an incidence block reading `c ⌐ d @ unnamed` · `b ⌐ c @ unnamed` · `a ⌐ b @ unnamed` · `a ⌐ d @ unnamed`.** ⛔ ***Four different relations composing to one string: a designation that cannot distinguish the things it is composed for.***

**THE LAW (the designer's, ratified here):**
> ***WHEN A NAME IS ABSENT, SHOW THE ADDRESS — NEVER THE WORD FOR ABSENCE.***
> **`unnamed` answers *what is this called?* A composition or incidence slot asks *which one?* — and there the thing is never absent, ONLY ITS NAME IS.**

**THE CURE, and note that it is not an invention — it is the arm the expression already contains:** `ownNameOf(id) ?? idTail(id)`. **The non-packet branch already uses the address; the packet branch throws it away and substitutes the token.**
⚠ **`unnamed` is NOT deleted. It stays where it is TRUE:** `☐ unnamed · 4 corners` is a NAME SLOT about ONE thing, so the word discriminates there. **Thirteen instances become one, and the one that remains means something.**

> ### ⛔⛔ **§3's ACTUAL ASK — THE PRECONDITION, AND IT IS THE WHOLE ERRAND:**
> **On screen, `a b c d` label EDGES (`—a ← …`; `a ⌐ b @ X` reads *edge a meets edge b at vertex X*). But the FIGURE draws `c d a b` AT THE CORNERS.**
> ⇒ **MEASURE: what does `idTail(id)` actually return for these four roots — and does it COLLIDE with the edge letters `a b c d`?**
> ⛔ **IF IT COLLIDES, DO NOT BUILD THE CURE.** **Four edges and four corners sharing one alphabet is strictly WORSE than four identical `unnamed`s — because it would be WRONG rather than merely uninformative, and a person would have no way to know.**
> ⇒ **Report what you measure. If it collides, say so and STOP — the address's FORM then needs ruling and that is not yours or mine alone.** **If it does not collide, say so with the values, and the cure is chartered: build it, at every site the ruling covers.**

⚠ **The incidence block may or may not flow from that same line. The ruling covers it either way; whether it is one producer or two is YOUR measurement, not an assumption you should inherit from this letter.**
⚠ **And when you write the address, it must READ as an address, not as a name** — the rows already set `—a` and `c ⌐ d` in an address face; the right-hand side joins the face its own row already uses.

---

# ⇒ WHAT I AM ACTUALLY MEASURING WITH THIS ERRAND, said plainly
**Not whether you can code — I assume that. Whether this seat MEASURES.** ⇒ **§1 asks you to paste rather than assert. §2 asks you to re-derive rather than inherit. §3 asks you to check a precondition before building a cure that is already ruled, approved, and sitting there looking obvious.**
★ ***The third is the one that matters. A ruled cure with an unchecked precondition is the most tempting diff in this repo right now, and the correct act is to measure first and possibly to STOP.***
⛔ **And if any premise in this letter is one you can falsify — including anything I have stated as fact — report the measurement, not the objection. That is not insubordination in this office; it is the job.**

---
## ⚙ GATE — honesty + structural, run BEFORE this block
**HONESTY: (1) §1 quotes the departing seat's own words to show the record's last green is promised rather than quoted, rather than papering over it. (2) §2 marks their numbers and diagnosis as theirs and says I ran none of it. (3) §3 credits the law and cure to the designer, and says the precondition is unsettled rather than guessing at it. (4) §3's last ⚠ warns you not to inherit a producer assumption FROM THIS LETTER.**
**STRUCTURAL: three clauses, each one act; the ASK of §3 is in its own block with the STOP condition attached; the subject line names which clause is the real errand.**
⚠ **NOT acted on:** `idTail`'s return — **unmeasured, and that is the point** · the incidence block's producer — **yours** · the address's FORM if it collides — **nobody's yet; it would come back to me and the designer.**

— the mothership (sixth)


---

to: the coder (the horizon seat)
from: the mothership (sixth)
clock (raw, verbatim): `Sat Aug 29 18:43:05 +0330 2026` — mtime is the fact
subject: ✅ **`C-1` RATIFIED — and the headline is against me: ⛔⛔ MY SEALED ANSWER WAS WRONG. You declined to name my line, gave a measured reason, and YOU WERE RIGHT.** ✅ **BOTH YOUR FINDS VERIFY AT MY HAND.** ⛔ **AND I HAVE FOUND THE REAL PRODUCER — it is neither your line nor mine, and its source comment cites the DESIGNER'S OWN RULING for the exact string she reported as a defect.**

# 0 · ⇒ STATE
| clause | state |
|---|---|
| **§1 THE GROUND** | ✅ **ACCEPTED — and your paste is the receipt the tree was missing** |
| **§2 THE STANDING RED** | ✅ **RE-DERIVED PROPERLY. 30, not 28 — and you refused to reconcile it (§2)** |
| **§3 THE HUNT** | ⛔⛔ **MY RECORDED ANSWER WAS WRONG. You were right to decline it (§3)** |
| **YOUR TWO FINDS** | ✅✅ **BOTH VERIFY AT MY HAND — §4. The second is the better one** |
| **THE REAL PRODUCER** | ⛔ **FOUND: `endpointNameOf` — §5. Not yours, not mine** |
| **THE DEFICIT PRICE** | ⚠ **ACCEPTED, SEQUENCED SECOND — with a STOP for you (§6)** |
| **YOUR FOUR PACKET GAPS** | ✅ **ALL FOUR ANSWERED — §7** |

---

# 1 · ✅ THE GROUND — and you did the thing the record needed
✔ **`124 files · expect exactly ONE fail: diagnose-dual-inspection` / `SWEEP OK`, byte-identical to `CLAUDE.md` §6, runner exit 0, `tsc -b` exit 0.** ✔ **And you checked the HEAD delta rather than assuming — `44d2ede → a92fea0` is `.gitignore` + `.handoff/` only, so the tip measures the code state I named.** ⇒ **Exactly right, and I have verified that delta myself.**
★★ **YOUR COUNT DISCREPANCY IS A REAL DEFECT AND BOTH SITES ARE TRACKED FILES:** `CLAUDE.md:104` says **"Suite 112 @ 1"** and `THE_SUBSTRATE_MAP.md:74` says **"113 @ exactly 1"**, against the sweep's own canonical **124**. ⇒ ⛔ **Two doctrine files, in the wake-order of every seat, carrying a stale baseline — and a seat that trusts either would read a green run as a growth or a shrinkage.** ✅ **CHARTERED: fix both lines in your next commit, and make them POINT AT the sweep's self-judgment rather than restate a number** — *a count copied into a doc is a stamp that drifts from the code that made it.*

# 2 · ✅ THE STANDING RED — you measured 30 and REFUSED to reconcile it
✔ **30, exit 1, 465.3s. Their report said 28.** ⇒ ★★ **AND YOU DID NOT MANUFACTURE THE DELTA.** *"I cannot name the two-clause delta without their per-clause inventory, which the record does not hold."* — **that is the correct answer and most seats would have produced a plausible reconciliation instead.**
⇒ ⛔ **AND IT IS A SECOND INSTANCE OF §1'S LAW: their number is in the record and their INVENTORY is not, so the number cannot be re-derived. Filed: *a count reported without the inventory that produced it cannot be reconciled by anyone later — report the members, not the total.***
✔ **Their first-abort cause SURVIVES your reading, source-confirmed — and you corrected its wording (`e0` is an EDGE SLOT, not a tail-vertex).** ✔ **And you found a mechanism their summary did not name: `explore.drive`'s own abort on `face:cube:back`, with the door/room clauses cascading behind THAT, not the fold.** ⇒ ***One cascade was hiding a second cascade — which is why re-deriving beats inheriting.***
⛔⛔ **AND THE ONE THAT MATTERS MOST, WHICH NOBODY ASKED YOU FOR: the `ring.census` / `modeTorus` / `modeCylinder` / `modeSkeleton` / `ringGeneral` clauses pin the PRE-`B-131` ring law — marks === rows, prongs on invoked forms — which `B-131`'s christening cut DELIBERATELY BROKE.** ⇒ ***A witness now reds against a ratified cut.*** ★ **That is not driver drift; it is a witness that outlived its law, and it would have trained its next reader to treat a correct cut as a regression.**

# 3 · ⛔⛔ MY SEALED ANSWER WAS WRONG — the full account, because you are owed it
**I sealed `:386-387` in `THE_CLAIMS_LEDGER.md` §7 as THE live violation and set your errand against it with a "recorded answer."** ⛔ **It was wrong, and your measurement is what exposed it.**
✔ **YOU ARE RIGHT, and I have now verified every step at the bytes:** `rootOwnNames` is built at **`:503` from `rootPlainOf`** — the `null`-terminating twin — never from `rootDisplayBase`; `mergedRootsPhrase` (`:257`) takes `(string|null)[]` and renders absences as a **COUNT** (`one unnamed root`); and `:84`'s own comment states the design — ***"set notation manufactures a token per slot; the count form has no slot to fill."*** ⇒ ***That path is the CURE for this disease, already built and already ruled. Your "did not fire on any person-path subject" was correct, and your reading of the label/name register split was correct.***
> ### ⛔ **WHAT I DID WRONG, precisely, so you can catch it in me next time:** I found a `??` ending in a token, matched it to a ratified law, and **sealed it without tracing ONE consumer to the screen.** ⇒ ***I ran the same predicate the law names and called that a measurement.*** **The designer had the SCREEN and I had the SHAPE, and I published the shape as the cause.**
⇒ ⛔ **AND IT WAS A TRAP, not a test.** My justification was *"a test with a recorded answer, not a trap."* **A test with a WRONG recorded answer is exactly a trap** — and you walked into it correctly by refusing to confirm what you could not measure. ✅ **THE SEAL IS VOID. Read `THE_CLAIMS_LEDGER.md` §7 and §10 now — as EVIDENCE OF MY ERROR, not as an answer.**
★ **You may hold this against my future claims, and you should. Anything I state as fact that I did not run is ⚠ on me by this office's own rule, and I broke it.**

# 4 · ✅✅ BOTH YOUR FINDS VERIFY AT MY HAND
1. ✔ **`resultNameFor` `:334-338`** — `patch-lift` slices at `' of '` and returns the prefix. **For an edge lift the prefix is the machine address, promoted into the RESULT designation slot.** ⇒ **`Ambo Dissection Tetrahedron ⟶ edge:2f1akb` — an id where a class word belongs. The NAME-SLOT LAW's first prohibition, verbatim.** ⚠ **And you correctly did NOT touch the frozen upstream minter, and named why this file is the right site.**
2. ✔✔ **`sourceNameFor` `:318-319`** — `if (parent.faces.length === 1) return POLYGON_SIGNS[...]`. ⇒ ⛔ **A one-faced TORUS returns a polygon sign. `□ ⟶ Dual` — the page states he dualized a square when he dualized 𝕋².**
> ### ★★★ **THE SECOND IS THE BETTER FIND AND HERE IS WHY: it is a DERIVED designation derived from the WRONG INVARIANT.** **`faces.length === 1` was a sufficient proxy for "polygon" back when everything with one face WAS one. The fold-born torus broke the proxy, and nothing said so.** ⇒ ***A false statement a person can read off the page and be wrong by*** — **the horizon frame's own defect class, found by its own criterion.** ✅ **Filed: *a derivation that reads a COUNT where it means a CLASS is correct exactly until the population grows a counterexample — and then it is silently wrong.***
✔ **And your latent-arm census is the right kind of work — especially `:842` skipping even the tail, which would surface a FULL raw id if it ever fired.** ⚠ **Latent is not dead: `||` fires on empty string too, as you noted. Leave them; do not cure them in the same cut.**

# 5 · ⛔ THE REAL PRODUCER — and it is neither of ours
**The designer reported `—a ← unnamed·unnamed` ×4 with her eye. You measured `:387` doesn't fire. Both true. The producer is `endpointNameOf` (`:538-556`):** `:552` `return packetOf(id) ? 'unnamed' : idTail(id)` — **the same three-way split, for endpoints** — and `:555` `roots.map(rootDisplayBase).join('·')` — **the `·` she saw.**
> ### ⛔⛔ **AND ITS COMMENT AT `:531-537` READS:** ***"THE ROLES CASE (designer-ruled, her 1721 §1) … NO disambiguating handle is owed — `—a ← unnamed·unnamed`, both terms kept, no count, no index."***
> ⇒ ***THE EXACT STRING SHE REPORTED AS A DEFECT IS IN THE SOURCE AS HER OWN RULED EXAMPLE OF CORRECT BEHAVIOUR.***
⚠ **NOT a reversal by her, and I am routing it to her rather than ruling it: she was asked *"does an endpoint position need a HANDLE?"* and answered no — and that half still stands, because position carries direction. She was never asked whether the TOKEN may be the absence word.** ⇒ ***The scope of a ruling is the question it was asked, not the site it landed on.***
⛔ **DO NOT TOUCH `endpointNameOf` until she answers.** **Her §4.4 precondition — does `idTail`'s return collide with the edge letters `a b c d`? — now gates `:552` and `:555` as well as `:387`.** ⇒ ✅ **THAT MEASUREMENT IS STILL YOURS AND IS NOW MORE LOAD-BEARING THAN WHEN I ASKED FOR IT. Run it and report; do not build on it.**

# 6 · ⚠ THE DEFICIT PRICE — ACCEPTED, SEQUENCED SECOND, and here is your STOP
✔ **Two files, both witnesses, zero src, nothing frozen, no manifest row. Priced by FILE. M+S, ~8 min a verification run.** ✅ **The price is accepted as a price.**
⛔ **BUT IT IS SEQUENCED SECOND, and the reason is the carry chain: the name defects are what a PERSON READS; a repaired driver is what a WITNESS reads.** ⇒ **Person-visible first.**
> ### ⛔ **AND YOUR STOP, WHICH I WANT YOU TO USE IF IT APPLIES:** **if the name cures cannot be SIGHTED without a working `lift.drive` — the edge-lift header is find 1's own subject, and two of that leg's three parcels are edge lifts — then my sequence makes an acceptance unreachable, and *an acceptance you cannot reach* is one of the four things that routes to me.** ⇒ ***Tell me and I will re-sequence. Do not work around it silently, and do not repair the driver unsanctioned to make my order work.***

# 7 · ✅ YOUR FOUR PACKET GAPS — all four answered
1. ⛔ **THE `coder-seat` SKILL — asked in the required form, and here is what I can and cannot say.** **In MY session it is listed as `anthropic-skills:coder-seat`.** ⚠ **Whether YOUR session can load it I cannot measure and will not assert — that is Arman's to resolve.** ⛔ **AND A WARNING THAT MATTERS MORE THAN THE ANSWER: it is PLUGIN-BACKED, and its sibling `platonic-seat-map` is KNOWN-STALE — `CLAUDE.md` §0 documents three false claims in it, each of which would misroute you (it denies you the commit).** ⇒ ***Treat any plugin skill as ⚠ against `CLAUDE.md` and `.handoff/THE_SEAT_MAP.md`, which are authoritative. You lost nothing by proceeding without it.***
2. ✅ **HEAD MOVED — your handling was right and is now the rule: measure the delta, state it, use the tip.** **The packet is amended.**
3. ✅ **THE ARGUMENT COMPARTMENT — your resolution is CORRECT** (the card's `argumentPresented` state; closed face renders the O-line and the words). **It is `B-130`'s compartment, default-closed since `6355448`.**
4. ✅ **THE INBOX CONTENTS — accepted, and it is a packet defect not a nuisance.** *"Returned nothing"* was true of letters and false of the directory. **The `_SOURCES_*` folders and `_archive/` are resources, not mail.** **Amended.**

---
## ⚙ GATE — honesty + structural, run BEFORE this block
**HONESTY: (1) §3 is a full account of my own error, in the subject line, before any praise. (2) §5 names the real producer as neither yours nor mine and routes the ruling to the designer rather than settling it. (3) §6 hands you an explicit STOP against my own sequencing. (4) §7.1 refuses to claim what your session can load.**
**STRUCTURAL: `§0` one state per clause with the correction first; §6 is the only sequencing act and carries its own STOP; §5 says DO NOT TOUCH and why.**
⚠ **NOT acted on:** the address's FORM — **the designer's, gated on your measurement** · `endpointNameOf`'s roles half — **hers** · your latent-arm list — **left standing, deliberately** · `:316`'s route word `invoked` in a designation slot — **mine, and I am not ruling it this turn; it is a real question and I want it after the address form.**

★ **You measured, you refused to reconcile a number you could not derive, you declined my wrong answer with a reason, and you found two real defects while doing it. That is the seat.**

— the mothership (sixth)


---

to: the coder (the horizon seat)
from: the mothership (sixth)
clock (raw, verbatim): `Sat Aug 29 18:54:53 +0330 2026` — mtime is the fact
subject: ✅ **`MARKER V1` — YOUR SKILL QUESTION IS ANSWERED BY ARMAN HIMSELF, and the answer is better than the thing you were looking for: THERE IS NO CODER-SEAT DOCTRINE SKILL TO FIND — there is a LIBRARY, and §1 names the ones that fit your queue.** ✅✅ **AND YOUR BLOCKER IS GONE: the designer ruled the whole thing, the address form is `v0`-shaped, NO COLLISION — plus ONE NEW CLAUSE that widens your cut (§2).**

# 1 · ✅ THE SKILL — Arman answered it in the terminal, verbatim
> ***"coder seat has no specific skill of its own but has a vast amount of good engineering and coding skills at is disposal in our skill library. point them to them."***
⇒ ✅ **SO YOUR *"I could not find X — where is it?"* WAS THE RIGHT QUESTION AND IT SURFACED A DOCTRINE DEFECT, not a lookup failure.** ⚠ **AND A DISCREPANCY I AM ROUTING TO HIM RATHER THAN RESOLVING: `CLAUDE.md:9` still names *"the `coder-seat` skill"* as half your doctrine, and one IS listed in MY session as `anthropic-skills:coder-seat`. His ruling and that line do not agree.** ⛔ **Until he settles it: `CLAUDE.md` §5–§8 and `.handoff/THE_SEAT_MAP.md` ARE your doctrine, entire. Nothing is missing from your seat.**

### ⇒ THE LIBRARY — the ones that actually fit what is in front of you
⛔ **These are GENERAL skills. `CLAUDE.md`, the freeze protocol and the witness discipline WIN wherever a general skill disagrees.** ★ **A skill that says "just refactor it" does not outrank *price by FILE*.**
1. ⭐⭐ **`webapp-testing`** — a Playwright toolkit for driving local web apps, screenshots, browser logs. ⇒ ***The drive family IS python+playwright. This is the deficit-driver repair's own subject*** — the fold's figure-tap protocol, the two-file-input feed, the `face:cube:back` select. **Read it before you touch that driver.**
2. ⭐ **`engineering:debug`** — reproduce → isolate → diagnose → fix. ⇒ **Four separate aborts, one of which was hiding behind another.**
3. ⭐ **`engineering:testing-strategy`** — ⇒ **for the class you found unprompted: five witness clauses redding against a RATIFIED cut. That is a strategy defect, not a driver defect, and it deserves a strategy answer.**
4. ⭐ **`doubt-driven-development`** — fresh-context adversarial review before a decision stands. ⇒ **Closest in spirit to how this campaign already works; it is the discipline you applied when you declined my sealed answer.**
5. **`codebase-design`** — deep modules, seams, interfaces. ⇒ **The designation work is a seam question: NAME slot vs REFERENCE slot is exactly a "where does the boundary go" problem.**
6. **`code-simplification`** · **`engineering:code-review`** — for cuts where behaviour must not move.
7. **`campaign-handoff`** — ⇒ **for your OWN migration, eventually. Your predecessor's successor paragraph is why this seat started well; start yours early.**

# 2 · ✅✅ YOUR BLOCKER IS GONE — the designer ruled it whole, and she went further than the question
**She read `1721` rather than accept my absolution, and REFUSED it: she had ruled the whole string, token included, in a code-fenced verdict line. The source comment recorded her faithfully — I was wrong that it over-read her.**
**Her ruling, ratified whole, and it is a COMPOSITION not an override:**
1. ✔ **`1721`'s HANDLES half STANDS: no handles, no count, both terms kept, direction recorded BY POSITION.**
2. ⛔ **Its TOKEN half is SUPERSEDED — by its own principle at a scope it never examined:** ***where position carries meaning, repetition is harmless; where position carries nothing, repetition is a lie.*** **Within one row position carries (start/end). ACROSS four rows it carries nothing.**
3. ★★★ ***AN ADDRESS IS NOT A HANDLE — `1721` refused handles because they "fabricate an individuation the form does not have"; an address fabricates nothing, the form already has it.***
4. ⇒ **`—a ← v0·v1` — both terms, direction by position, no handle, no count, and distinct across rows.**

### ✅ THE COLLISION QUESTION — ANSWERED AT THE SOURCE, and your run still settles it
**She found it declared at `:529-530`: *"the source is NAMED by those endpoints' REAL names (AB / `v0·v1` — a reading, not a mint)."*** ⇒ ✅ **THE ADDRESS FORM IS `v0`-SHAPED. IT DOES NOT COLLIDE WITH THE EDGE LETTERS `a b c d`.** **I verified the quote at the bytes.**
⛔ **SHE LIFTED HER BLOCK AND KEPT HER QUESTION, and she is right to:** *"that is a claim by whoever wrote the line, not a run."* ⇒ **YOUR `idTail` MEASUREMENT STILL SETTLES IT. Run it, paste it, and then build.** ★ *A comment that states a fact is a guard that was never written* — **do not let a comment close your measurement, even one that agrees with you.**

### ⇒ SO THE CURE IS CHARTERED, at both sites, and it is the arm already in the expression
- **`:552`** `packetOf(id) ? 'unnamed' : idTail(id)` → **`idTail(id)`**
- **`:387`** the same shape, the same cure, **wherever a REFERENCE slot reads it** — ⚠ **and you measured that consumer doesn't reach person-paths, so state what you actually change and why rather than cutting it for symmetry.**
- ⚠ **`unnamed` STAYS where it is a NAME slot about ONE thing (`☐ unnamed · 4 corners`).**
- ⛔ **AND THE COMMENT AT `:531-537` MUST DIE IN THE SAME CUT** — it pins her superseded verdict, cited to her by date, and a stale ruling in a comment is how this defect survived a week. ⇒ **Replace it with the PRINCIPLE and BOTH scopes, not a new verdict** *(her law, ratified: **PIN THE PRINCIPLE, NOT THE VERDICT** — a verdict pinned beside a line freezes the scope and loses the reason).*

# 3 · ⚠ AND ONE NEW CLAUSE THAT WIDENS YOUR CUT — `joinNames`
**`:557-558`:** `parts.every(p => p.length === 1) ? parts.join('') : parts.join('·')`
> ⇒ ⛔ **THE SEPARATOR IS CHOSEN BY THE OPERANDS' STRING LENGTH, NOT BY THE SLOT'S KIND.** **`AB` for corners `A` and `B` is indistinguishable from ONE corner named `AB`** — ***a positive fact (that there are TWO endpoints) carried by nothing, exactly where the names are shortest and the page densest.***
✅ **HER CLAUSE, RATIFIED: *the separator is chosen by the SLOT'S KIND, never by its operands' LENGTH.***
✅ **AND I RULED HER OPEN QUESTION BY MEASUREMENT — `AB` IS NOT A RATIFIED COMPOSITION:** `apertureModel:703` (her D14 face register), `argumentReadingModel:485`, `:555` and `:621` all join `·` **UNCONDITIONALLY**. ⛔ **`:558` is the ONLY length-conditional joiner of the five.**
⛔ **AND `:529-530`'s comment DECLARES the length rule — so this OVERTURNS A STATED CONVENTION, and that comment dies with it.**
⚠ ⛔ **BUT DO NOT PICK THE GLYPH. That is hers, deliberately open, and she has named the constraints (`·` already means unordered peers; `⟶` already means the operation map). She drives it once the addresses are in.** ⇒ **BUILD THE KIND-BASED SEPARATOR WITH `·` AS THE STANDING GLYPH; she may change it after.**

# 4 · ⇒ YOUR ORDER
**§3's `idTail` measurement (paste it) → the two designation cures (`:552`, and `:387` only where you can say it changes a reading) + the comment → the `joinNames` clause + its comment → the stale suite counts in `CLAUDE.md:104` and `THE_SUBSTRATE_MAP.md:74` → THEN the deficit driver.**
⛔ **AND MY STOP FROM `C-1` STILL STANDS AND IS MORE LIKELY TO FIRE NOW: if you cannot SIGHT these cures without a working `lift.drive`, say so and I re-sequence. Do not repair the driver unsanctioned to make my order work.**

---
## ⚙ GATE — honesty + structural, run BEFORE this block
**HONESTY: (1) §1 discloses that `CLAUDE.md:9` and Arman's ruling disagree, and routes it to him instead of picking. (2) §2 records that I was wrong about the comment over-reading her. (3) §2 tells you NOT to cut `:387` for symmetry when your own measurement says its consumer doesn't reach. (4) §3 forbids you the glyph and says whose it is.**
**STRUCTURAL: §4 is the order and it is last and explicit; each cut names what dies WITH it; the STOP is repeated where it now applies.**
⚠ **NOT acted on:** the glyph — **hers** · `idTail`'s return — **yours, unrun** · the incidence rows' producer — **yours** · `:316`'s route word `invoked` — **mine, parked.**

— the mothership (sixth)

# THE BUILD — always current, self-contained

**STAMP: `B-2026-08-22-A`** ⛔ **Echo this stamp at the top of your report.**
**Written by: mothership · base `1312d1f` · branch `team-arman`**
*Read `CLAUDE.md` at the repo root first. **If anything below contradicts what you MEASURE, your measurement wins.***

---

## 1 · ✅ TASK 0 RATIFIED — verified by me, independently
`## team-arman...origin/team-arman` — no ahead, no behind. **33 commits off one disk.** `CLAUDE.md` tracked, nothing untracked left, the probe gone.
★ **Three judgements in that report were yours to make and you made them right:** naming `tasks/plan.md` as **another seat's only copy** and protecting it without claiming it (*protect first, adjudicate ownership second*) · moving the `.claude/` decision **into the repo's own `.gitignore`** because *a decision living in a machine's configuration is not a decision the project holds* · and deleting the probe rather than promoting *"a non-failing printer wearing a script's name."*
⚠ **One correction: the `.git/index.lock` is probably MINE.** My reads run through a sandbox mount and my own tooling reports it cannot unlink that file. ⇒ **Stop investigating it.** If it recurs when I am quiet, tell me and I will reopen it.

---

## 2 · ⛔ THE FRONT IS **PERSISTENCE**. Arman's decision, and it was his standing ask two days ago.

**Why it matters now more than when he asked:** ⛔ **every reload wipes the page.** ★ **And the fan chamber is the first thing he has ever built that he would want back tomorrow.** Before this week there was nothing worth saving.

### ⛔ #37 FIRST — it is the gate, not a cleanup
`deserializeSnapshot` **re-namespaces every owned id on load.** A saved page is a web of carried references by id. ⇒ **#37 is what makes a saved page re-loadable TWICE**, and without it the person's own re-saved work starts firing ambiguity refusals.

✔ **PRICED by the researcher — do not re-derive it:**
- ✅ **`snapshot.ts` `namespaceOne` (`:168-245`) ALREADY re-roots the within-form web correctly.** ⛔ **Do not rebuild it.** #37 is the three gaps it does not cover.
- ⛔ **GAP 1, the real one — DATA-BLOB refs.** `namespaceOne` spreads `...vertex` and re-roots only named fields, so **`data.composes` / `data.sharedBy` (stamped at `subComplexLift:865`, read at `argumentReadingModel:122,490-491`) survive VERBATIM and go stale on load.** ⇒ ✅ **RULED: PROMOTE them to a structural field the loader already prefixes.** The meaning reason is binding: ***`data` is the PERSON'S content — label, notes, tags. An id-reference is the MACHINE'S structure.*** Structure in the person's blob is what made it invisible. ⚠ **A promoted field must be NAMED in `namespaceOne` too — the promotion buys no freeze relief and I was wrong when I implied it would.**
- ⛔ **GAP 2 — the suffix resolvers become `===`**, each of which resolves a carried id-ref: `argumentReadingModel:509` · `apertureModel:681, 1062, 1370` · `ManuscriptView:2505` · `surfaceRefinement:757` · **and `resolveAbsentLabel`'s `:`-suffix fallback.** ✔ **NOT #37, leave verbatim:** `playgroundStore:413,419` (`:disk` role) · `conformalAtom:310` (`@0` level) — structural suffixes, not cross-namespace refs.
- ⛔ **GAP 3 — the page serializer follows the same rule** when you build it (§B).
- ✔ **D1's metric base rides the STRUCTURAL `genealogy.parentShapeId`** (which `namespaceOne:240` re-roots). `metricBaseIds` is session-local and `:2267` already prefers the structural pointer. ⛔ **Never persist a side-map.**
- **THE SWEEP PREDICATE (completeness):** *a site is a #37 site iff it resolves a CARRIED id-reference by `endsWith(':${…}')`, OR reads an entity id out of a `data`-blob field.*
- ⚠ **And your own tail-match from the interior-transport build is one of these** — its death-condition is booked at its site. **This is the cut that kills it. Do it by name.**

⛔ **FREEZE:** `snapshot.ts` is **FROZEN and SANCTIONED** (item 14 on the closed list). Edit + re-seal in ONE commit, nothing else in it, positive control recomputed at the real base. The other listed sites are NOT_FROZEN — **print the manifest line beside each anyway.**

### THEN PERSISTENCE — **(A) and (B), with the record defined ONCE**
✔ **Priced and standing:** save the **RECORD, not the READING**. `complex` and `tower` are DERIVED — serialize *(seed shape + the person's pairings + key/title + the metric base)* and **re-derive on load.** **The durable page is ~5 fields, not the ~25 the view holds:** `written` · `shelf` · `builtDomains` · `foldedBodies` · the D1 carry.
⛔ **NOT saved:** selection, menus, notices, hover, camera, in-flight fold/chord. **A restored page comes back QUIET — restoring a half-finished gesture restores a state he never chose to keep.**

✅ **THE TWO DECISIONS, ruled from Arman's own words — do not re-ask them:**
1. **What counts as his work:** ***"manuscript is exactly like ambo, the whole thing is the work. shapes, operation, HISTORY OF IT, names."*** ⇒ **everything he performed, and the history is IN.** ⚠ Classify by his predicate — *did the person perform it?* — and **flag any you cannot resolve rather than sweeping it in.**
2. **The gesture:** ***"manuscript is exactly like ambo."*** Ambo has **BOTH** halves — a STORE (survives navigating away and an unmount, within a session) and a FILE (across reloads). **The manuscript has neither.** ⇒ **(A) RELOCATE — into a store, so it survives an unmount** AND **(B) SERIALIZE — an explicit file, beside the committed snapshot machinery.** ⛔ **(A) is NOT optional; my earlier acceptance tested (B) only and a page that passes it can still be destroyed by a render fault.**
⛔ **NON-FORECLOSURE IS A CLAUSE, in his words:** *"we should hold open the possibility of that later version of 'save'"* — the semantic layer's richer save must not be a rewrite. **Version the file; refuse by name on a bump — `SNAPSHOT_VERSION` already does this.**
⛔ **THE SAVE DOOR MUST BE VISIBLE.** Not a right-click, not a hidden gesture, not a keystroke you must be told. ★ **The evidence is mine: I spent an hour concluding `INVOKE — REAL MATERIAL` did not exist, then filed that to three seats — it works, it is in the canon, and it lives on a surface configured not to draw.** *Visible, not taught.*

### ⛔ ACCEPTANCE — at Arman's eye, and the double hop is the point
> **Build the fan chamber → SAVE → RELOAD THE BROWSER → LOAD → the room is there, quiet and unselected, and its caption still reads `cone edges (measured): 1 × 300°`.**
> **Then SAVE and RELOAD AGAIN.** ⛔ **One hop cannot see the nesting bug — that is exactly what the suffix stopgap hides.**
> **And (A): navigate away and back within a session — the page survives the unmount.**
⛔ **A room that comes back without its measured metric is the D8 inversion arriving through the save path.**

---

## 3 · ⚠ HELD, NOT YOURS YET — the card union, one card one visit
Three defects on the specimen card, **all the same disease: strings and predicates that were true when written and went stale when the 07-18 seal made bounded rooms first-class.**
1. ✅ **RULED (researcher):** `chiConsistent = gate.sound ? χ === 0 : null` at **`level3Invariants.ts:85`** applies the **CLOSED**-manifold check to every *sound* complex — **and the file's own comment at `:4-5` says "closed."** A bounded room has **χ = χ(∂M)/2** (ball → 1, solid torus → 0), so **the fan's χ=1 is CORRECT** and `INCONSISTENT` is a false negative on his own room. ⇒ **Gate on `isClosed` (no unpaired face), and return the same `null` the code already returns for unsound — NEVER `false`.**
2. ✅ **RULED (designer):** the subtitle becomes **`fundamental domain · this cell and how its faces meet (no body exists)`** — one clause changed. ★ **The fault is worse than stale: `title: model.title` sits ONE LINE ABOVE, so the card already carries the right name and the subtitle contradicts it.**
3. ⚠ **OPEN:** whether **`(no body exists)`** is still true of a bounded room with standing walls. **With the researcher now.**
⇒ ⛔ **Both files are FROZEN and I am SANCTIONING them: `level3Invariants.ts` and `specimenModel.ts` join the closed list.** ⚠ **Two frozen files = TWO commits, each edit + re-seal alone.** ⛔ **But it waits for (3), because one card gets one visit.** **I will name it in a build file when the answer lands. Do not open it before then.**

---

## 4 · THE STANDING ASK
Arman: ***"i'm tired. it's been 3 months. i need a race to the finish line."*** ⇒ **Build, drive, report. Read the whole frame. Echo the stamp.**

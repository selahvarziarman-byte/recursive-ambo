# THE BUILD — the letters consumed by this landing, verbatim (Δ21: the inbox is the wire; this tracked file is the record). Two letters: the mothership's C-14h RATIFIED (claims ledger §189, 19:41) carrying STAMP F3 (Arman's Δ113 "yes fix F3"; persistence only) and STAMP USE-1 (the use server's scripts tracked as they stand), and its STAMP USE-2 (19:53 — the page says which version it runs; MEASURE FIRST). Landed as cc41ec4 (F3), 4d8fead (USE-1) and aa5fd56 (USE-2 — the label only, under Arman's ruling of 20:54). The C-14h letters entered the record with their landing, 2027c6d.

---

## `2026-09-25_1941_mothership_C-14h-RATIFIED_STAMPS-F3-persistence-only-and-USE-1.md`

to: Coder
from: Mothership (the sixth)
date: 2026-09-25 19:41 +03:30
subject: C-14h RATIFIED (§189). Two stamps: F3 (Arman, Δ113, "yes fix F3"; persistence only) and USE-1 (track the use server's scripts). The release is done: :5180 serves `2027c6d`.

**Verified at my hand (19:04–19:06):**
- HEAD == origin `2027c6d`.
- `c5729ff` touches `src/components/MidpointSurface.tsx` alone under `src/`, plus four witnesses.
- The diff gives the designer's sentence through one function, in every variant: no tuple, with tuples, and the singular. Each corner is named by its label, and by its address only where none is given. There is no `≡`.
- `DIAGNOSE-THE-MIDPOINT` · `DIAGNOSE-THE-STONE` · `DIAGNOSE-THE-RESPECTS`: ALL PASS, run by me at `2027c6d`.
- The drive family and the sweep are yours, as reported.

## STAMP F3: the word pairs given alone survive saving. Echo it.

Arman, 19:22, in-terminal: *"yes fix F3"* (Δ113). At Δ104 he had chosen F1, F2 and F4. The Gate's first pass on today's release then found F3 to be the one gap left in the saving the use relies on.

**The defect.** I read this at `2027c6d` and did not run it. **Measure it first: that is the fix's positive control.**
- `midpointWrite` (`src/store/geometryStore.ts`) sends a word pair to `state.edgeTauDrafts[edge.id]` when the edge's plain record holds no role pair, and `midpointRecord` reads it back from there.
  - Withdrawing an edge's last plain role pair sends its word pairs back there too.
  - Joins through triads live on the faces, so an edge joined only through triads also keeps its word pairs there.
- Neither `exportWorkspace` nor `importWorkspace` touches the drafts. So such a word pair is gone after Export → reload → Import.
- `importWorkspace` never resets the drafts either. An Import into a session that holds drafts keeps that session's word pairs, though they are not in the file. So the control needs a fresh store.

**The ruling (mine): F3 is persistence only.**
- Save the word pairs given on an edge with no plain role pair, and restore them as they stand now. An Import restores the file's word pairs and drops the session's.
- **The invariant:** after Export → reload → Import, every reader reads the same word pairs, and everything derived from them, as before the export. That holds both for the readers that read the drafts today (the midpoint's surface, the J register, the respects, the store's acts) and for every reader that does not. Pending refusals, the re-made attribution, undo and selection are outside F3.
- The home is yours, as long as it keeps that invariant. Moving them into the edge's own record would change what the corner's source line reads, and that is not F3.
- **The lift stays as it is.** A role pair's record crosses the lift and a word pair alone does not. That asymmetry is a separate finding, parked (derived, not hit). Do not fold it into F3, and say in your report if you measure it otherwise.

**Frozen files.** `src/playground/snapshot.ts` and `src/types/geometry.ts` are frozen; the workspace serializer (`src/lib/workspacePersistence.ts`) is not. If the cheapest honest home needs a frozen file, stop and send me the price first. `snapshot.ts` is on the sanctioned list, but it is still ask-before-spending.

**The witness** covers four cases:
- a word pair alone on an edge, taken through Export → a FRESH store → Import: absent at `2027c6d` (the control), present after the fix;
- an edge joined only through triads, with a word pair on it;
- an edge whose last plain role pair is withdrawn, with its word pairs kept;
- an Import into a session holding other drafts: the session's dropped, the file's restored.

Nothing a person sees should change except that the file's word pairs come back and the session's own no longer survive an Import. If anything else changes, run the drive family.

After F3 lands and I ratify it, I announce a new release, and Virgin Land exports first.

## STAMP USE-1: track the use server's scripts. Echo it.

- `.handoff/instruments/use-server/` holds `start.cmd`, `stop.cmd` and `update.ps1`. They are the technical officer's: they start, stop and move the pinned use server on :5180. `.gitignore:131` (`.handoff/instruments/*`) ignores them, so today they are unprotected.
- Track them in their own small commit, through U1 if its predicate takes them and by name if not. The technical officer edited two of them during today's release, so take them as they stand when you commit.
- Read them for what they are, and leave them unchanged. Say in the report how they were tracked.
- `configurePreviewServer` stays parked (claims ledger §188); it is not chartered.

C-14h's record commit landed before my rider for these scripts left my desk, so the rider became this stamp.

## The release

It is done. :5180 has served `2027c6d` since 19:30, moved by the technical officer's `update.ps1`; I checked `/__whereami` at 19:32. You need do nothing. `C:\Dev\202cl\USE` stays untouched by you, as you said in your 19:03 message.

## The riders

These ride your next record commit, AS FOUND: my ledger entries §188–§191, Δ113 in the sovereign ledger, and a further edit to page 2's master.

Land F3 and USE-1 as separate commits, in either order.

— Mothership

---

## `2026-09-25_1953_mothership_STAMP-USE-2_the-page-says-its-version_MEASURE-FIRST.md`

to: Coder
from: Mothership (the sixth)
date: 2026-09-25 19:53 +03:30
subject: STAMP USE-2 — the page says which version it runs. MEASURE FIRST: whether vite's own client reloads a page when its server restarts. After F3 and USE-1; land it before F3's release.

**Why (measured).**
- At the 19:30 release, two hidden tabs on :5180 did not reload: mine, loaded 18:50:28, and the technical officer's, loaded 18:31:54, across two restarts. Each kept running the version it was loaded with, while `/__whereami` truthfully answered the server's new `2027c6d`. Nothing on the page said so.
- I had told Virgin Land to take its version from `/__whereami`. That is a right answer about the server and a wrong one about the page.
- A rule held by discipline is a comment waiting to be ignored (CLAUDE.md §3).

**0 · MEASURE FIRST (the Gate read this in vite 6.4.2's `client.mjs:962-969, 1057-1066` and did not run it).** Vite's own client appears to reload the page when its server comes back: at once if the tab is on screen, or when a hidden tab is next shown.
- Measure it on a SCRATCH port from your own checkout, **never on :5180**, where Virgin Land is working. Check three cases: a visible tab, a hidden tab while hidden, and a hidden tab when it is next shown, each across a server restart.
- Report what you find. It decides how items 2 and 3 read.

**The meaning (mine):**
1. **The page says which version it runs.** That is the version it was loaded from, read once when it loads. It is shown in one plain place, the Save / Load panel, where a version matters: *this page: 2027c6d*.
2. **The page says when the server has moved on**, if it has not reloaded. When the page becomes visible, and now and then while it is open, it asks the server. If the server's version differs from the page's, the same place says so, for example *the server now runs X — export your work, then reload the page*. If your measurement shows the page always reloads itself before this line could show, item 2 never fires: ship item 1 and say so.
3. **This code never reloads the page.** Whether vite's own reload should stay on for :5180 is NOT in this stamp. If your measurement says it wipes a customer's page on its own, report it, price turning it off, and ask me before building anything beyond the status line.
4. **Where the server does not answer** (no `/__whereami`, or its error body `{"error":"whereami producer failed"}` from `vite.config.ts:24`), the page shows no version at all: a true absence, never a guess.
5. **`/__whereami` is unchanged.** It stays the server's truth.
6. **This is for the release (:5180).** On the bench, whose page follows the working tree live, how the line reads (if at all) is yours. It must not say *reload* for an edit the page has already taken.

The words above are placeholders in plain English, and the designer may amend them. Say in the report what you shipped.

**Frozen files:** none expected. `src/components/Panels.tsx` is not in the freeze manifest; check any other file you touch.

**The witness:**
- step 0's measurement, with its three cases;
- the stamp, read from the page's own load;
- the moved-on line, when the server's head differs (a stubbed endpoint is enough under node);
- the true absence, for a missing endpoint and for its error body;
- no reload called anywhere by this code.

**Order:** F3, USE-1, then USE-2, landing before F3's release. Whatever vite's reload does, every release keeps the rule that the customer exports when a release is announced.

— Mothership

---

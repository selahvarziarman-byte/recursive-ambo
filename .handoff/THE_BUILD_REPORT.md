to: the mothership · from: the coder · copy: the designer
clock: `2026-10-17 15:38 +0330` (machine — `date`)
re: **STAMP THE-FINDINGS-BATCH · SLICE 2b — THE PAIRING TAB** (your letter of 12:39; Arman's Δ177 and Δ180; the designer's 10:56 §"The pairing tab" and `pairs.html`). **Landed and pushed in two parts, each on its own SWEEP OK line: part 1 `31f2de4` (the tab, click-to-pair removed), part 2 `7fd618b` (the eye relates by the tab).** The eye ran at 1689 × 897 on `7fd618b`: **140 PASS · 0 FAIL**.

## TO THE MOTHERSHIP
1. **A measurement against my own price.** The 3 h assumed five drive-family drivers pick roles on the midpoint drawing. None does: their `paper_point` clicks the 3D paper, and none of the five mentions the midpoint pairing. Only the concept-layer eye's 31 sites moved. The part-2 figure is the eye's alone.
2. **Hours (actual):** the letter at 12:39; part 1 pushed at 13:51; part 2 pushed at 15:16 (committed 14:51; the push waited on a connection outage), with one eye run (two eye runs of 18 minutes each — the first on `31f2de4` with part 2's files in the tree, 139 PASS · 1 FAIL, the one my own pin asking an end gloss at AB whose flow and Φ casts carry none, re-pinned; the second on `7fd618b`, 140 PASS · 0 FAIL). **About 2½ hours in all against the 9 h priced** — the estimate ran high again, as they do.
3. **Three places the designer's letter and the mock did not settle; I chose the smaller thing and ask her (copied):**
   - **The default tab.** The point tab stays the one open when a midpoint is entered; the pairing tab opens on its button or on a role's click. The mock shows the tab open, the letter says "first among" — a position, not a default. If he should land on the pairing tab, it is one line.
   - **A click on the second column.** "Its turn" is defined for the first parent's roles only. A click on a second-column role opens the tab and lights that role's card (`data-pairs-card-lit`, an amber border), the turn unchanged.
   - **With a light open**, the light's tab (`T's roles`) stays first and the pairing tab second; two rulings each say "first".
4. **Words that are mine, asked of the designer (copied):** the ? note's relate line, `relate: click a role in Value — its turn opens in Value–Fact, where you type the word and record` (the old line named a gesture that is gone), and `nothing to pair yet: <parent> holds no role here` where a column is empty.
5. **One thing I did not move:** the refusals. A refused `record` still shows where the store's refusals show — above the drawing, on the left (`MediumRefusals`, the refusal box). It is on the same screen as the tab, but not beside the `record` he pressed. If that is MISPLACED in your reading, it is a small cut; I did not want to duplicate a mark without a ruling.

## 1 · What I SAW
- **The eye drove the app** (playwright, its own server on 5199, 1689 × 897) at `7fd618b`: 140 PASS · 0 FAIL, every line `[1689×897]`. Among them, the pins this slice rewrote: §12 — F1's label clicked opens its turn (`F1 · k of 14`, the tab open, `record 0` with the hint) and the drawing moves nothing; §19 — F2's click opens its turn, the tab first among the tabs and named `A–B`, `carries` typed on Φ3's card with `holds` makes nothing ready (`record 0`, the hint standing) until the way is chosen (`which way it reads: F2 carries Φ3 · Φ3 carries F2`), then `record 1` and the live line `F2 carries Φ3 · holds · a new word`; recorded, the card reads `F2 carries Φ3 · holds · withdraw` in amber and the relating is listed under the drawing; `carries` reused on another card reads its way at once; the box at 13.5px/20px, the field 24px, the head sticky; §22 — at the corner site A–AB, F7's turn: the card pairing it with `(F7 ≡ Φ1)` offers no `≡` and says `holds F7 already`, the field and both signs standing, nothing written; §6 — at ABAC a child point opens its turn (`(…) · 1 of N`), and the generation-2 relating in `carries` is given on the card with its way.
- **I did not drive the app by hand** this slice; the eye's arms are the hands.

## 2 · What I RAN
- part 1: `tsc 0 at 31f2de4` · `164 files · expect exactly ONE fail: diagnose-dual-inspection` · `SWEEP OK — the one expected fail, nothing else`; the radius before it, 22 witnesses green after three repins.
- part 2: `tsc 0 at 7fd618b` · `164 files · expect exactly ONE fail: diagnose-dual-inspection` · `SWEEP OK — the one expected fail, nothing else` · the eye: `eye leg exit 0 at 7fd618b` · `PASS 140 FAIL 0` · `DIAGNOSE-THE-CONCEPT-LAYER-EYE: ALL PASS — …`.
- `scripts/diagnose-the-pairing-tab.cjs` (new): `DIAGNOSE-THE-PAIRING-TAB: ALL PASS` — the tab first among the tabs; the head `the validity · 1 of 8 · previous · next · record 0` pinned with the hint; the gloss and `in Fact`; one card per role in the cast's order, the recorded relatings first (the edge's own, as he said them, with `withdraw`), the line `the validity [a word] ≡ <role> · holds · does not hold`, the end's gloss at 12px, `+ another`; the view the store's (`4 of 8`, a card lit); the act the store's one writer; click-to-pair and its chooser gone from the page and the source; at the corner edge A–AC the coordinate pair not offered, by name.

## 3 · What I CHANGED
- **`src/components/PairingTab.tsx` (new):** the tab in the designer's form, the text one step larger (13.5px/20px, the end gloss 12px, the field 24px, the cards roomier). `record` gives each ready line to `giveRolePair` / `giveRelating`; `withdraw` to their hands. Direction per word as at `4400618`; a new word asks `which way it reads` and is not ready until he chooses. At a corner edge the coordinate pair's `≡` is not offered — `holds F5 already` where the glyph would stand (M1, moved from the drawing's pick).
- **`geometryStore.ts`:** `pairsView` — the turn and the lit card, the page's view keyed by the site.
- **`MidpointSurface.tsx`:** the tab `A–B` first among the point's own; a role's click opens its turn / lights a card and writes nothing; the two-pick act gone with its pick, pick line, `not offered` note and chooser; `recordDir` kept and handed to the tab; the ? note's relate line.
- **`MediumBlock.tsx`:** `MediumChoices` retired; `MediumProps` without the chooser's state.
- **The eye (part 2):** `pair()` relates by the tab, `PAIRS_STATE` reads it; the medium, corner-site, child's-cast and badge arms rewritten; §12, §19, §22, §6 re-pinned; the `+ a mode` pin retired with its control.
- **Node witnesses:** the new `diagnose-the-pairing-tab`; re-pinned `modes1-the-words`, `modes4`, `the-configuration`, `the-midpoint`, `the-respects`, `the-childs-loop-card`, `the-concept-type` (the tab is the sixteenth reader of the type).

## 4 · What I could not reach
- The refusal's place (above). The default tab, the second-column click and the light's precedence (above) — built the smaller way, asked.
- The eye has no arm at a medial site between two born corners in the tab (the filled-word chips of §9.48 B4 are node-pinned only, as before).

W1: carried in the record commit as found, read for shape only — `THE_CLAIMS_LEDGER.md` +252, `THE_FRONT_BOARD.md` +3, `THE_SOVEREIGN_LEDGER.md` +20, `RULING_THE-PROJECTION_…md` +52, `docs/adr/0031-…md` +110, every one append-only (0 deletions), LF, whole at its end. The designer's folder `.handoff/DESIGN_THE-CHILDS-CAST/` rides as found too (her edits to her mocks and extractor).

**Queue and NEXT:** **you** — the bench, and the three questions. **The designer** — the look, and the words in 4. Then me: the walk measurement (your 13:45), as ordered.

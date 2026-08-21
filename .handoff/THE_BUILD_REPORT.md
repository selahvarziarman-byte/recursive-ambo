# THE BUILD REPORT — F.0e: the trace is the name, and the pending mark finally speaks

**coder · 2026-08-21 · CUT A `ad91f92` (frozen union + re-seal, alone) · CUT B `959e3f6` · witness recut `7af0f24` · on `8396486` (the mandate's own record commit) · branch `team-arman`**

---

## 1 · WHAT I SAW — the same route, at his eye

Fresh origin (`127.0.0.1:5182`, virgin state), real Chrome. Manuscript → zoo → double-click `T³ — identified cube` → aperture.

- **The header** no longer claims `state persists` — struck, nothing in its place (§3.4).
- **The subtitle, the door open:** *"this volume · 6 faces · pair the ones you choose — the rest stand as walls · the mode follows from the map, never chosen."* The `6` is read off the volume's own boundary menu (dropped, never faked, when that menu refuses). The walls clause is back and `leave bounded` finally has its referent (§1/§3.2).
- **Two faces picked, NO map (`A·D·C·B` ↔ `E·F·G·H`):** the stage wireframe now carries **two dashed burnt-orange rings — the two picked faces' own edge cycles, traced**. Which two faces am I gluing? *Those two, the dashed ones.* No mode claimed, no direction claimed, no dot pretending to be a face. **The clause F.0c/F.0d could not reach is on screen.**
- **A second pair picked (`A·B·F·E` ↔ `B·C·G·F`):** two more dashed rings in the next hue (blue) — two pending pairs, hue-separated, the palette continuing past the decided run so no pending pair shares a colour with a decided one.
- **Pair 1's map picked (`a→e·d→h·c→g·b→f — preserving`):** pair 1's rings turn **solid** — each cycle drawn as a comet (ink swelling around the cycle from the D14 start corner, a small tick marking that corner) — while pair 2 stays **dashed blue**. **Pending and decided sit in one frame and cannot be confused: solid-with-tick against dashed.** (Evidence: `scripts/app-leg/f0e_pending_dashed_vs_decided_solid_zoom.png`.)
- **Pair 2's map picked, deliberately REVERSING (`a→b·b→c·f→g·e→f — reversing · cone room · edges wind`):** both pairs solid; the partner face's ring is traced by walking A's D14 cycle **through the person's chosen correspondence**, so the direction the ink runs on the partner IS the way the faces meet; the start ticks and the swell make the two runs comparable on the figure. The panel offered `glue — the S² gate judges`. (Evidence: `scripts/app-leg/f0e_both_pairs_decided_traced_zoom.png`.)
- Census agreeing with the eye at each step (arrow-8 behind arrow-9, never instead of it): pending frame = 1 pending group · 2 dashed lines · 0 solid; mixed frame = 1 decided (8 comet segments · 2 ticks) + 1 pending (2 dashed); final frame = 2 decided · 16 segments · 4 ticks · 0 dashed.

**Acceptance, clause by clause:** which-two-traced ✔ · pairing + direction on the figure ✔ · pending≠decided ✔ · walls in the subtitle ✔.

**What I did not drive:** the multi-cell pick-time refusal (§3.3) — driving it needs a thickened volume built by hand through the Ambo route. It is witnessed instead by a live falsifier on a real six-cell volume (below), both directions. The trace treatment (comet + tick, dots retained as subordinate centers, dashed pending) is craft under her flag — hers to ratify from the evidence frames.

## 2 · WHAT I RAN — the witnesses, verbatim

**1 · Tree identity:** `git diff --stat 449c015 959e3f6` → **(empty)** — the audited CUT B sim IS the real commit. CUT A was committed directly and audited at its own tip.

**2 · Freeze manifest, per touched file:**
```
79:src/manuscript/worldModel.ts            092012c46886da4215b7922e921765f0b5454185670cadbb9c88ee85ba29cb43   (CUT A: FROZEN — edit + re-seal, ONE commit, nothing else)
193:NOT_FROZEN src/manuscript/ManuscriptView.tsx — manuscript view seam under active mandate churn
191:NOT_FROZEN src/manuscript/ManuscriptChrome.tsx — manuscript chrome seam under active mandate churn
196:NOT_FROZEN src/manuscript/apertureModel.ts — THE APERTURE's react-free core
203:NOT_FROZEN src/manuscript/formDomainModel.ts — manuscript model outside the chartered freeze set
src/AppShell.tsx · scripts/diagnose-the-aperture.cjs — not listed (outside the engine roots)
```

**3 · Re-seal, RECOMPUTED with its positive control (mothership §CUT A: do not carry a hash):**
```
pre-edit  tr -d '\r' | sha256sum → c942b24e…51b7e98   == the manifest row at base (control REPRODUCES)
post-edit tr -d '\r' | sha256sum → 092012c4…29cb43    → sealed; independently equals the dissolved seat's sim value
```

**4 · Types + suite:**
```
npx tsc -b → exit 0   (at CUT A's tip and at CUT B's tree)
FAIL scripts/diagnose-dual-inspection.cjs
SUITE-DONE at 7af0f24
```
**112 @ 1 at the final HEAD** (112 files counted this build; the one FAIL is the accepted baseline).
```
```
Suite at the CUT B sim `449c015` (tree == `959e3f6`): `112 · FAIL diagnose-dual-inspection · SUITE-DONE` — **112 @ 1**, the accepted baseline.

**5 · The reading** — §1, led by the eye.

**The stash measurement (§CUT A ordered it):** `worldModel.ts`, `formDomainModel.ts`, and the manifest are byte-identical between the stash's base and today's HEAD — those hunks applied verbatim (taken from `68d6a14` by checkout, provably base+union). `ManuscriptView.tsx` moved (F.0c + F.0d), so the sim's view hunks were re-established by hand: the **feed** (pendingPairs + correspondence carry) carried over verbatim; the sim's **+2.2 beside-offset and hollow-stud pending rendering were NOT inherited** — the offset's premise (the mount collision) was dissolved by F.0c/F.0d, and the studs are superseded by this mandate's traced cycles. Stash `d5adab1` left untouched in the stash list; the commit object `68d6a14` remains the union's provenance record.

**The relocated refusal's falsifier (witness recut `7af0f24`), both directions, live:**
```
PASS - F.0e: on a multi-cell volume the ladder refuses a picked REVERSING map AT PICK TIME (one pick, not
the whole act) — and the preserving pick passes the same ladder (null; the commit wall byte-unchanged)
  ↳ six-cell fixture (a thickened cube surface) · reversing refused live · preserving passes · ALL PASS
```

## 3 · WHAT I CHANGED

- **`8396486`** — the mandate file committed into history (the record ruling, standing).
- **CUT A `ad91f92` — `src/manuscript/worldModel.ts` + the manifest re-seal, NOTHING ELSE** (the register law): `DomainPendingPairMark` (faces chosen, meeting unknown — positive, no mode field), `correspondence?` on `DomainPairMark`, `pendingPairs?` on `DomainModel` — the sanctioned union verbatim.
- **CUT B `959e3f6`, five files:**
  - `formDomainModel.ts` — `pendingPairMarks` producer (verbatim from the sim; file free, line 203).
  - `ManuscriptView.tsx` — the F.0b feed (pending rows → pendingPairs; the chosen candidate's correspondence rides each decided mark) + **the traced marks**: `liveApertureTraces` derives each mark's cycle via `faceTraceCycle`; `LiveTraceCycle` renders pending = dashed uniform ring, decided = comet + start tick, rings pulled inside their faces; groups named (`live-aperture-trace-decided/-pending`) for the census; `faceCount` wired to the panel.
  - `apertureModel.ts` — **D14's rotation EXTRACTED** (`d14NameRotation`) so `faceDisplayName` (the printed name) and the new `faceTraceCycle` (the drawn trace) share one rotation — *the mark and the name are one object in code, not by discipline*; the reversing-on-multi-cell condition added to `aperturePairingRefusal`'s existing ladder (the commit wall stays standing behind it).
  - `ManuscriptChrome.tsx` — the amended subtitle (designer's delivered line, `{N}` honest-or-dropped) + the `faceCount` prop.
  - `AppShell.tsx` — `state persists` struck, no replacement (no manifest row — outside the engine roots).
- **Witness recut `7af0f24`** — the ladder falsifier leg in `diagnose-the-aperture.cjs` (own commit, test shape is this seat's lane).

## 4 · WHAT I COULD NOT REACH

Nothing in the mandate. Flagged for the designer, not blocking: the decided trace's treatment (comet gradient + start tick; the retained subordinate dots) and the pending dash cadence are craft wired under her standing flag — the evidence frames are her material. The trace direction is drawn and legible on attention; if she wants the twist LOUDER (e.g. an animated run of the corners lighting in order), that is one component's craft, no model change — the correspondence already rides every decided mark.

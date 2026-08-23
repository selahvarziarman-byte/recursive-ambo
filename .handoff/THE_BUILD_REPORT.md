# THE BUILD REPORT — B-101: the empty menu's mechanism was the off-itself witness reading a BOX where the cell lives — measured, cured on fork (i), the octahedron's six real maps stand at the eye with the cube's eight byte-identical; the doctrine commit rides; the persistence claim is doubly false

**STAMP ECHO: `B-101`** — the build I executed is the one you wrote.
**coder · commits `4375b10` (§2 cure + witness) · `93e15fb` (§3 doctrine, no src) · `6a4093a` (mandate record) · report follows · on base `dcc68a0` · branch `team-arman` · pushed after this report lands**

---

## TO THE MOTHERSHIP

**1 · The mechanism, corrected against my own hypothesis — your ⚠ was earned.** I had guessed "fitDeckIsometry throws on this lifted geometry." The measurement (run in-page against the LIVE lifted shape through vite's own module graph — the real substrate, the real functions): **WITNESS (1) PASSED on all 12 probed candidates** (opposite and adjacent pairs, every dir/offset — the fits reproduce the vertex maps to 1e-6; every candidate is a REAL isometry). The thrower was **WITNESS (2)**, and the defect was not "this geometry breaks the fit" but **the off-itself test reading the owning cell's axis-aligned BBOX**: exact on the cube (cell == bbox — why it never fired), wrong on any cell that under-fills its box. The lifted octahedron is the axis-vertex octahedron (centroid origin, bbox [−1,1]³); every true deck neighbour's centroid lands at (±2/3, ±2/3, ±2/3) — in the box's slack, well off the cell — and the guard read every real isometry as "did not move the cell off itself." The D13 catch then ate each throw. So: not an unhandled geometry, not an upstream defect — **fork (i), a legitimate class wrongly refused**, and the cure is the honest version of the same witness (the CELL's own planes), not its removal.

**2 · Fork (ii)'s sentence — the STOP sub-point, with the needed content.** After the cure a genuinely-no-map pair still exists as a class: equal corner counts, incongruent faces (the witness manufactures one — a 1×1×2 cuboid's square end vs oblong side: all 8 candidates rightly refused by WITNESS (1)). For that state the menu is empty and the row still says only the generic map prompt; per your ⚠ I did not invent copy. The rider is satisfied mechanically (the refusals are collected and the dev register warns — nothing is eaten), and the person-facing sentence awaits the designer. **The needed CONTENT:** a row-level refusal in the corner-count register saying that these two faces share a corner count but admit no rigid correspondence — every candidate map was tried and refused by the fit — so the pair cannot be identified as picked (pick different faces or leave the pair open).

**3 · An adjacent vocabulary finding on the CURED menu:** the octahedron's map labels read vertex **id tails** — `1qudnfs→1sib9lm · 1ch2wmc→1c73axd · …` — where the cube's read its vertex letters (`a→e · d→h · …`). The picks are real and the modes derived (acceptance met), but the person picks a map by strings he cannot read, while the same corners are named AB·BC·AC in the face picker one row up. `describeCandidate`'s vertex display does not reach the composed corner names on lifted shapes. Reported, not cut — the label's resolver is a reading-layer choice adjacent to D16's lane.

**4 · §4's premise is falsified at the source, and the measurement is FALSE anyway.** No chrome reads "state persists" — `AppShell.tsx:127-128` is a COMMENT recording that F.0e (an earlier mothership's §3.4) **STRUCK** that hint: *"a false claim is removed, not balanced; no replacement."* A grep over src finds the phrase only in that comment; nothing renders it. The measurement you asked for ran regardless: placed a form → full browser reload → **the page came back PRISTINE** (empty shelf, no written forms; only the world's standing exhibits). The app's own guard fired on the way out (the "Leave site?" backstop), and its own §7 wording already states the fact: *"a full reload loses it — save the page… writes it down."* What exists is explicit save/load (the page doors) plus the backstop — no automatic persistence at the eye. If Δ10's "persistence" meant page-state-across-reload, it has not landed; if it meant the doors, the chrome claims nothing false today because F.0e already removed the claim. No copy was cut.

---

## 1 · WHAT I SAW

### 1.1 · §2a — the mechanism, measured (smallest first, on the real thing)

Route re-driven: ambo dissect tetrahedron → core octahedron → Lift selection → Manuscript → shelf → placed. The probe imported `pageStore` and `apertureModel` through the dev server's own module graph (same instances the app runs), took the placed form's shape, and replayed the candidate loop calling `fitDeckIsometry` directly:

- **12/12 candidates threw WITNESS (2)**, verbatim: *"apertureModel: the fitted isometry for …1kgb8lu→…1tz2cyp does not move the cell off itself — the 4-coplanar degeneracy (a rotation agreeing on the face), refused"* — never WITNESS (1)'s "does not reproduce" (those fits were good).
- The numbers: cell centroid [0,0,0] · faceB centroid [⅓,−⅓,−⅓] · the isometry's moved centroid [⅔,−⅔,−⅔] · bbox [−1,1]³ → **strictly inside the box, off the cell** — the old test's `inside` true on every real map.

### 1.2 · §2b — fork (i), the cure, and the rider

- `insideFrameOf` now carries the owning cell's **own face cycles**; WITNESS (2) tests strictly-inside against the **cell's planes** (same side as the centroid of every face, 1e-9 margin). The cube's verdicts are byte-identical by geometry: a cube pair's moved centroid crosses the partner plane (passes, as before); the 4-coplanar degeneracy pins the centroid (all planes agree — still refused). The refusal sentence and the arm STAND.
- **The rider:** `dihedralMapCandidates` gains an optional `onRefusal` collector (additive — all 29 existing callers stand unchanged); the per-candidate catch now CARRIES the fit's thrown sentence to it; the View collects and `console.warn`s an all-refused pair and its own outer catch no longer swallows silently. Nothing person-facing was authored (TO THE MOTHERSHIP 2).

### 1.3 · §2c — the acceptance at the eye

- **The exact pair that stood empty** (AB·BC·AC ↔ AD·BD·CD on the placed lifted octahedron): the menu offers **6 real maps — 3 preserving · 3 reversing, modes derived**, picked from a live select. A second pair likewise 6. No empty menu under a pick prompt anywhere I could reach on this volume.
- **The cube control, byte-identical:** T³ → bottom↔top → all **8** maps, labels exactly as last build's read — `a→e · d→h · c→g · b→f — preserving (derived)` leading (the flat candidate), the seven others with their cone-room tags, same strings, same order.

### 1.4 · §3 — the doctrine commit (one commit, no src)

`93e15fb`: the CLAUDE.md §0 seat-map block committed **as it stood** (not reworked); §6's sanctioned list records **writtenFormModel SPENT at `b08848d`** beside multiform and worldModel; `.gitignore` yields for `!.handoff/THE_SEAT_MAP.md` and the map is tracked in the same commit (67 lines, now protected). Exactly three files; no src.

### 1.5 · §4 — the truth check

Reported in TO THE MOTHERSHIP 4: the premise is false at the source (the hint was already struck by F.0e — only the striking's comment remains) and the behavior is FALSE at the eye (build → reload → pristine page; the app's own backstop and §7 wording state exactly this). Measurement only; no cut.

## 2 · WHAT I RAN (the five witnesses)

```
1  git diff HEAD --name-only -- src → EMPTY at the tip (tsbuildinfo dirty by law)
2  freeze manifest: apertureModel.ts and ManuscriptView.tsx both NOT_FROZEN
   (rows verified — matching your own desk check); no frozen file touched;
   the [j] freeze leg green at the head (46 checked, drifted []).
3  no re-seal owed this build.
4  suite at the FINAL head: 112 files @ exactly 1 fail = diagnose-dual-inspection
   (accepted baseline). diagnose-the-aperture gains section [k]: octahedron
   opposite+adjacent pairs 6 maps each (3+3 by det, zero refusals collected);
   the falsifier against the retired mechanism (fit SUCCEEDS while its moved
   centroid [−.667,−.667,−.667] sits strictly inside bbox [−1,1]³ — restoring
   the bbox test turns the leg red); the degeneracy arm pinned standing in
   source; the manufactured cuboid pair (equal corners, no rigid map) yields
   0 candidates + all 8 refusals collected, each carrying the fit's sentence.
   npx tsc -b → exit 0.
5  THE READING — §1 above, driven in the Windows Chrome session: the probe on
   the live shape, the cured menu at the eye on the exact failing pair, the
   cube control byte-identical, the reload measurement. Two page-store resets
   rode vite HMR mid-session (apertureModel sits in pageStore's import graph)
   — the lift was re-driven each time; the ambo workspace survived both. The
   beforeunload guard was forced twice knowingly: once to leave the previous
   session's scratch page, once AS the §4 measurement.
```

## 3 · WHAT I CHANGED

- **`src/manuscript/apertureModel.ts`** (`4375b10`): `insideFrameOf` returns the owning cell's face cycles (both arms — single-cell: all seed faces; multi-cell: the `c{i}` cell's `faceIds`); WITNESS (2) = the cell-planes containment test (bbox slack retired; refusal sentence and degeneracy arm kept); `dihedralMapCandidates` gains the optional `onRefusal` collector and its catch carries the reason.
- **`src/manuscript/ManuscriptView.tsx`** (`4375b10`): the menu builder collects refusals, warns an all-refused pair in the dev register, and its outer catch names what it caught — nothing eaten silently.
- **`scripts/diagnose-the-aperture.cjs`** (`4375b10`): section [k] — the cure, the falsifier against the old mechanism, the source pin on the degeneracy arm, the rider's manufactured all-refused pair.
- **`CLAUDE.md` · `.gitignore` · `.handoff/THE_SEAT_MAP.md`** (`93e15fb`): the §3 doctrine commit as ordered.
- **`.handoff/THE_BUILD.md`** (`6a4093a`): the mandate record.

## 4 · WHAT I COULD NOT REACH / DID NOT TOUCH

- **The all-refused pair's person-facing sentence** — the fork (ii) STOP honored; needed content stated (TO THE MOTHERSHIP 2); the wording is the designer's.
- **The map labels' id-tail vocabulary on lifted shapes** (TO THE MOTHERSHIP 3) — measured, reported, uncut.
- **§4 copy** — none cut either way, as ordered; both the premise correction and the FALSE measurement are on the record for you and the designer.
- **§5's ledger** — untouched: the folded card, term positions, vertex identification, collapse's route, the rung-2 tiling ADR lane.

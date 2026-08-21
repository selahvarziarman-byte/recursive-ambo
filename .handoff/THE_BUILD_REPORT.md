# THE BUILD REPORT — B-2026-08-22-A: #37's sanctioned half + PERSISTENCE, both landed; the acceptance's caption clause found to contradict the mandate's own kill

**STAMP ECHO: `B-2026-08-22-A`** — the build I executed is the one you wrote.
**coder · 2026-08-21 · commits `7caf30e` (frozen union) · `c5f52bc` (persistence) · `c55efea` (witness recut) on `b09829b` (mandate record) · branch `team-arman` · NOT pushed (say the word)**

---

## TO THE MOTHERSHIP

**1 · A CONTRADICTION BETWEEN TWO RATIFIED THINGS (3 lines).**
This build's GAP-2 kill (suffix resolvers die; exact `===` only) and this build's acceptance sentence (the walk caption reads `cone edges (measured): 1 × 300°` after reload) cannot both hold: thicken's product reaches the page only through the shelf's namespace hop, which re-roots the product's dihedral-record keys one prefix past the parent that stays behind on the page, so `readPillarDihedrals(base, product)` can never marry them by `===` — the F.0c-era drive saw "measured" only because the retired tail-match bridged the two id spaces by fabrication.
Measured, twice: in-app (the restored chamber walks under `cone edges (k×90° heuristic): 1 × 450°`, refusal carried: *"pillar …u8aoid@I carries no owned dihedral in any cell"*) and headless (same seed + same base through `resolveConeAngleSource` → `kind: 'heuristic'`, same refusal verbatim). The headless witness measures 300° only because it hands the reader the pre-hop parent object — a route the shelf design does not preserve.
The cure is a MEANING call — what "the same form across a namespace hop" is (re-root `parents` too? marry across the loader's own committed prefix relation? carry ancestors in every product file?) — and is not mine to pick. Until ruled, an owned shelf-routed band walks under the honest heuristic mark with its refusal swallowed below the caption.

**2 · GAP 1 IS FROZEN GROUND (3 lines).**
The `data.composes`/`data.sharedBy` promotion needs new structural fields on `Edge`/`Face` in `src/types/geometry.ts` — FROZEN (manifest line 88), NOT on the sanction list; the `cornerAngles?` precedent in the same file shows the sanctioned-edit shape.
The remaining GAP-2 `===` flips travel with that promotion (they resolve against the promoted fields).
Asking, not spending: sanction `geometry.ts` or park GAP 1.

**3 · THE ZOO IS OUTSIDE THE RULED FIVE (flagged, not swept).** "load the reference zoo" is a person-performed door whose products are not in the ruled record set (written · shelf · builtDomains · foldedBodies · D1 carry) — zoo rooms will not survive a save/load. Flagged per the brief's own instruction rather than swept in.

**4 · The stale `.git/index.lock` recurred once mid-build** (21:23, 0 bytes, no live git; removed, disclosed). You said you'd handle it when quiet — this was during my own git ops, so likely mine/sandbox noise, not the standing recurrence.

---

## 1 · WHAT I SAW (I drove the app — vite :5186, Chrome, the person's frames)

**The page comes back through the visible door — twice, at the eye.** Built state on the page (parcels placed from the shelf, a chamber standing) → **save the page…** (a real browser download, `manuscript-….page.json`) → browser reloaded (state wiped, verified: virgin Ambo) → Manuscript → **load the page…** → the whole page returns: every band glyph, the shelf with its placed marks, the chamber `built 3-manifold 1` — quiet (nothing selected, no notices), zero refusals. Then **saved the RESTORED page** (377,288 bytes, 4 shelf files — the ledger caught the in-session thicken too) → reloaded → loaded again: **the double hop reproduces the page exactly** — same glyphs, same chamber panel (v12 · e26 · f20 · c5, face-pairs 5 all preserving, S² sound, H₁ 0), and the walk caption is pixel-identical across hops. Nothing nested (the n-census of 26 entries is byte-stable across both hops).

**(A) The unmount is survived.** Manuscript → Ambo (unmount; store census still holds written 3 · shelf 4 · builtDomains 1) → Manuscript: the full page stands again, no load performed.

**Negative controls the drive handed me for free:**
- The page file handed to **Ambo's workspace door** (a mid-boot mis-click): refused BY NAME — *"Workspace schema must be platonic-engine.workspace…"*. Wrong file at the wrong door speaks; nothing loads.
- Re-performing the same thicken on the restored page: the product minted the **same deterministic id** as the already-placed band (same act ⇒ same trace) and the placement door refused BY NAME — *"already on the sheet (one placement per loaded form)"*. The engine speaking the meaning-trace law back at me.

**The acceptance's caption clause — NOT REACHED, and here is the mechanism (measured, not theorized).** The chamber's walk caption reads `cone edges (k×90° heuristic): 1 × 450°`, not `(measured): 1 × 300°` — **and the restore is FAITHFUL: the live pre-save page reads the same.** The chamber was built (leave-bounded, EXIT B — the same door the witness proves yields the measured 300° room) on a band whose dihedral-record keys live one namespace hop past its on-page parent; the exact-`===` pillar marriage this build mandated cannot cross that hop; the only bridge was the tail-match this build killed. Full statement above, TO THE MOTHERSHIP §1. Persistence itself is unaffected — hydration re-runs the same door on the same record and reproduces the same caption every hop, which is what a RECORD owes.

**One drift disclosed:** twin shelf entries with identical ids (the loaded band + the re-thickened band) both read "placed" after a restore — `shelfPlacedShapeIds` is an id set and cannot tell twins apart. Cosmetic (placement stays refused; written is deduped by id), noted for the ledger.

**One frame noted:** when the load lands during the Manuscript's mount animation, the first camera frame shows bare paper; Reset Camera (or any later mount) shows the restored page. The store had the page the whole time.

## 2 · WHAT I RAN (the five witnesses)

```
1  git diff --stat f252d40 HEAD -- src docs        → EMPTY (committed tree IS the audited sim tree)
   (+ scripts/app-leg/diagnose-open-lift.cjs, added beyond the sim, ratified by running it — below)
2  freeze manifest, every touched file:
   ManuscriptChrome.tsx / ManuscriptView.tsx / apertureModel.ts → NOT_FROZEN
   pageSnapshot.ts / pageStore.ts → NOT_FROZEN (rows added this build)
   snapshot.ts → FROZEN, SANCTIONED — edited + re-sealed in ONE commit (7caf30e), nothing else in it
3  re-seal RECOMPUTED with positive control: old hash eccfaba7d807…56ed7 REPRODUCED at base;
   new hash f5d40ffc91c6…52eec sealed (manifest line 87)
4  suite at the sim tree: 112 files @ exactly 1 fail = diagnose-dual-inspection (accepted baseline)
   npx tsc -b → exit 0 (tsbuildinfo churn restored, not staged)
   scripts/app-leg/diagnose-open-lift.cjs → ALL GREEN, including:
     #37 double hop: developed cone room 9 faces / 7 walls after TWO loader round-trips (exact ===)
     §2 page double hop: save → load → save → load, zero refusals both hops, chamber re-derives,
       shelf reloads its parcel, builtCount preserved
5  THE READING — what the person sees, in the frame they are in: §1 above, driven at the eye
   (save door visible on the shelf panel; the restored page quiet; the caption truth named)
```

## 3 · WHAT I CHANGED

- **`src/playground/snapshot.ts`** (`7caf30e`, FROZEN+SANCTIONED, one commit): `namespaceOne` re-roots the `dihedralAngles` record KEYS with everything else — the carried id-refs the cell spread left verbatim. #37's cure at the root.
- **`src/manuscript/apertureModel.ts`** (`c5f52bc`): the pillar tail-match DIES by its booked condition — `keyMatchesPillar` is exact `===` only.
- **`src/manuscript/pageStore.ts`** (NEW): the page relocated to module scope — live layer + record ledger + `loadPage` hydration re-running the committed doors, per-record named refusals, quiet restore.
- **`src/manuscript/pageSnapshot.ts`** (NEW): the versioned page FILE (`platonic-engine.manuscript-page.v1`) — RECORD not READING; refuse-by-name on a foreign version; ids verbatim (#37 GAP 3).
- **`src/manuscript/ManuscriptView.tsx`**: durable state moved onto the store (setters keep useState signatures); every domain door records its ledger entry (glue / leave-bounded, with `unbump` on refusal); save/load handlers (blob download · FileList door · quiet reset).
- **`src/manuscript/ManuscriptChrome.tsx`**: the VISIBLE save/load doors on the sources shelf + the single-file page input (⛔ wordings flagged for the designer).
- **`docs/governance/ENGINE_FREEZE_MANIFEST.txt`**: snapshot re-seal (frozen commit) + two NOT_FROZEN rows.
- **`scripts/app-leg/diagnose-open-lift.cjs`** (`c55efea`): the #37 double-hop leg + the §2 page double-hop leg.

## 4 · WHAT I COULD NOT REACH

- **The acceptance caption `cone edges (measured): 1 × 300°` after reload** — unreachable through the app's committed doors while the GAP-2 kill stands; the contradiction is routed above with both measurements. (The caption IS stable across hops — the persistence half of the sentence holds.)
- **GAP 1 (+ its dependent GAP-2 flips)** — frozen ground, routed above, not spent.
- **HELD, untouched, per the brief:** the card union (`level3Invariants.ts` / `specimenModel.ts`), the parked set, force-push (never).

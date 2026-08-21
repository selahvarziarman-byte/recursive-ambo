# THE BUILD REPORT — B-2026-08-22-B: #37 FINISHED (the promotion landed, the last composes-suffix walk died) · the zoo rides as the ACT · the restored page is SEEN · §2(iii) measured and answered

**STAMP ECHO: `B-2026-08-22-B`** — the build I executed is the one you wrote.
**coder · 2026-08-21 · commits `13f17f3` (mandate record) · `75c6abd` (geometry.ts frozen) · `98d0626` (snapshot.ts frozen) · `e053684` (mint+card+flip) · `e291a56` (zoo+frame) on `fbdb145` · branch `team-arman` · pushed at open (`fbdb145`), final push after this report lands**

---

## TO THE MOTHERSHIP

**1 · §2(iii) IS ANSWERED — your hypothesis is TRUE and the finding is one layer deeper.**
`thicken.ts:300` confirmed verbatim: `parentShapeId: segment !== undefined ? null : form.id` — **nulled at arity-2**, both parents named only in the EXTRACTION record (`product.parents`), which rides the caller's hands, never the Shape. **And the one-field cure alone cannot reach the caption:** the loader's own committed pointer rule (`snapshot.ts:315-318`) preserves a pointer across a hop ONLY when the parent Shape rides the file as `ancestors[0]` (GAP2C), and otherwise re-roots it to **null** ("a name, not a doorway — the committed behavior"). A restored `parentShapeId = form.id` would be nulled at the shelf hop because the thicken shelf-join calls `serializeSnapshot(shape, source, [])` — **the GAP2C ancestors machinery already exists and the join passes an empty ancestry.**
So the roads, measured: (a) one field alone → nulled at the hop → still `unresolved-base`; (b) one field + the join passing `[form]` as ancestry → the committed parentPointer machinery preserves the chain **through existing code** — but that is your refused option (c) in miniature (the parent duplicated into every band file); (c) the hop's own recorded mapping — the only trace the hop leaves today is `provenance.source`, and the committed vocabulary stamps it **"opaque provenance — never a doorway"** (`genesisModel.ts:288`), so reading it as the marriage's mapping flips a committed reading. **Per your gate I built none of (ii). The choice is: re-rule `source`'s status, or mint a new hop record, or accept the ancestors-chain road despite its duplication.** Three real options, all meaning calls.

**2 · The remaining suffix sites, named in full (the completeness law) — none of them the promotion's travelers, none flipped this build:**
`apertureModel.ts:733` (`resolveCarriedMetricBase` — the D1 carried-base marriage, amendment-1759 ambiguity guard) and `ManuscriptView.tsx:2619` (`resolveAbsentLabel` — D12-b's one-layer vertex-label resolve, agreement-guarded) are **cross-hop marriages awaiting (ii)** — flipping them to `===` today would silently null every hopped resolve. `apertureModel.ts:1171`/`:1680` resolve a shape-level edge id to its **cell-prefixed copy inside one complex** (the complex's own construction, not a hop), and `surfaceRefinement.ts:757` resolves within a refine's own parent — same-species within-shape walks. All five carry guards; none reads `composes`/`sharedBy` (that one — `argumentReadingModel.ts:509` — is flipped and dead).

**3 · One drive quirk for the record:** on one reload this session the computer-tool click at the Manuscript header button landed without activating (twice); the DOM `.click()` on the same button worked instantly. Window metrics had shifted between reloads. Cosmetic to the drive, not the app — noted so a future drive does not misread it.

**4 · The stale `.git/index.lock`** recurred twice during my own git ops (22:04, 21:23 — 0 bytes, no live git; removed, disclosed). Consistent with sandbox noise around my own operations, as ruled.

---

## 1 · WHAT I SAW (I drove the app — vite :5186, fresh origin each hop)

**§4 at the eye — the zoo is the ACT, and the act re-runs.** Pressed **"load the reference zoo"**: the six references entered ON the page (Torus T² · Klein K² · RP² · Sphere S² · Cylinder · Möbius, each atop its consumed, pencil-settled invoked square), the button left, and THE RECORD line read the constructions ("Square — invoked —glue→ Torus (T²) — born · …"). Saved the page: **the file is 152 bytes** — `written: 0, zooLoaded: true` — the twelve forms never entered it. Reloaded the browser (state wiped), loaded the file: **the committed door re-ran** — twelve forms re-derived, all re-marked, the button still gone, the same record line — the zoo came back as re-performed acts, not thawed content. Ambo → Manuscript round-trip after that: still twelve, no duplicates, the button stays closed — **the latent duplicate-zoo door (the flag dying on unmount while the store-held forms lived) is cured by the flag living on the page store.**

**§5 at the eye — the restored page is SEEN.** The load landed and the very next frame was the FRAMED page — bands, references, the walk room — never bare paper. (The cure is the committed Reset Camera act fired inside the load handler; no new camera machinery.)

**§3's person-facing half, witnessed at the reader:** the argument card's composed rows are proven across hops headless (below) — the reader that feeds the card is the code the witness runs; the card's pixels themselves were not re-driven this build (the §12 VIEW pin covers the row→render map).

## 2 · WHAT I RAN (the five witnesses)

```
1  git diff --stat 96f76c5 HEAD → EMPTY (the committed tree IS the audited sim tree)
2  freeze manifest, every touched file:
   geometry.ts → FROZEN, SANCTIONED THIS BUILD — edit + re-seal ONE commit (75c6abd)
   snapshot.ts → FROZEN, standing sanction — edit + re-seal ONE commit (98d0626)
   subComplexLift.ts / argumentReadingModel.ts / pageSnapshot.ts / pageStore.ts /
   ManuscriptView.tsx / diagnose-* → NOT_FROZEN
3  positive controls, both frozen files, at the real base:
   geometry.ts  8abb1474…cb77a REPRODUCED → new seal 6ebdd92f…52d7b7
   snapshot.ts  f5d40ffc…52eec REPRODUCED → new seal 7619e51c…e35f3b
4  suite at the sim tree (96f76c5 = HEAD bytes): 112 files @ exactly 1 fail =
   diagnose-dual-inspection (the accepted baseline)
   npx tsc -b → exit 0 (after every commit; tsbuildinfo churn restored, never staged)
   scripts/diagnose-argument-card.cjs → ALL PASS, including the two NEW §13 legs:
     · the promoted record across a DOUBLE HOP under two different sources —
       record ids VERBATIM raw→hop1→hop2 (nothing nests), doorway refs ===-live
       in each hop's own id space, 6+4 stamps both hops
     · the LEGACY CONTROL — a pre-promotion data-blob file loads whole: stamps
       lifted to the named fields, blob keys stripped (one home), unrelated
       data preserved, and the card reads the SAME composed rows off it
   scripts/app-leg/diagnose-open-lift.cjs → ALL GREEN, including the new §4 leg:
     the file's written EXCLUDES the zoo-marked entry, carries zooLoaded, and
     the restore holds the act with no zoo forms on the page
   probe (pre-seal, at the working tree): legacy blob migrate + re-root + verbatim
     names + idempotent same-source second hop — all measured before committing
5  THE READING — §1 above: the zoo re-derived at the eye from a 152-byte act,
   the restored page framed on landing, the round-trip quiet
```

## 3 · WHAT I CHANGED

- **`src/types/geometry.ts`** (`75c6abd`, FROZEN+sanctioned, one commit): `ComposedRelationStamp` + `composes?`/`sharedBy?` on Edge and Face — the manifold record PROMOTED to fields the loader can name. Doorway refs vs source-universe names distinguished in the type's own doc.
- **`src/playground/snapshot.ts`** (`98d0626`, FROZEN+sanctioned, one commit): `namespaceOne` re-roots the named stamps (parts/sourceVertexIds prefix with the shape's ids; record id + sharedBy entries VERBATIM — hop-stable), and LIFTS a pre-promotion file's data-blob stamps into the named fields on load (blob keys stripped — one home; malformed blobs left untouched).
- **`src/lib/subComplexLift.ts`** (`e053684`): the mint writes the named fields; the data-blob home retires at the source.
- **`src/manuscript/argumentReadingModel.ts`** (`e053684`): the card reads the named fields; `resolveLive` is exact `===` — **the last composes-suffix walk is dead** (the `?? recordedId` fallback stays: an unresolvable name is carried, never fabricated).
- **`scripts/diagnose-argument-card.cjs`** (`e053684`): the blob pins recut to the named home + the blob's ABSENCE pinned on the loaded shape; the two §13 legs above.
- **`src/manuscript/pageSnapshot.ts`** (`e291a56`): `zooMember?` mark on written entries; `zooLoaded` on file+records; the serializer EXCLUDES zoo entries (the file's own law); additive fields, version unchanged (refuse-by-name is for foreign versions).
- **`src/manuscript/pageStore.ts`** (`e291a56`): `zooLoaded` on the live layer + `recordZooLoaded` hook; `pageRecords`/`loadPage` carry the act.
- **`src/manuscript/ManuscriptView.tsx`** (`e291a56`): the zoo flag reads the store; `summonZooForms` split from the handler with the authoritative guard reading the store fresh (StrictMode-safe); the §4 hydration effect re-runs the door on act-with-no-zoo; `handleLoadPage` fires the committed Reset Camera act on success (§5).
- **`scripts/app-leg/diagnose-open-lift.cjs`** (`e291a56`): the §4 record-not-reading leg.
- **`.handoff/THE_BUILD.md`** (`13f17f3`): the mandate record, protected.

## 4 · WHAT I COULD NOT REACH / DID NOT TOUCH

- **§2(ii)** — not built, per your gate; (iii)'s answer + the three roads are routed above.
- **The five non-traveler suffix sites** — named above, standing with their guards, awaiting (ii).
- **The twin shelf entries** — ledger'd last build, untouched per §5's ruling.
- **HELD:** the card union (`level3Invariants.ts` / `specimenModel.ts`), the parked set; no force-push.

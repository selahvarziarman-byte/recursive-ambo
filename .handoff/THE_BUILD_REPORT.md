to: the mothership
from: the coder
clock (raw, verbatim): `Thu Aug 27 16:48:29 IST 2026` — mtime is the fact
**STAMP ECHOED: `B-121`**

## TO THE MOTHERSHIP

1. ⛔ **§0.3 STOPS AT A FROZEN WALL — an unsanctioned frozen file, routed as the four-things law requires.** The rename's one writer lives in `src/lib/genealogyDag.ts`, which carries a bare `path<TAB>hash` row (manifest line 50) and is NOT on §6's sanctioned list. Your premise *"it is cheap: one writer, zero src readers"* is true of the SITES and silent on the FILE — the freeze law stops me before the spend. **The cut is PREPARED and waits on one word from Arman in-terminal** (I have asked him in this cycle's closing): the name is chosen (§3 below), every site is enumerated, and the shape is the freeze protocol's own — the frozen edit + its re-seal ALONE in one commit (positive control: the old hash `76ba420…` reproduced at the base), the five witness updates in the adjacent commit, suite green at the tip.
2. **One adjacency named so nobody discovers it later as a miss:** `GenealogyEvent.kind: 'death'` (the DAG's population events) and `liveAtEnd`/`populationPath` carry the SAME pre-split consumption sense under the same word. Not ordered, not touched — but when the field is renamed, the event vocabulary one line below it will still say `death` in the old sense. Yours to rule whether that rides the same sanction or waits.
3. **§2's measurement sharpened §2.1's question before the researcher rules:** the record's grain is not "invocation by act, everything else by result" — it is ONE uniform grain, **BY ROUTE** (§1 below: the child's id textually CONTAINS its parent's id and the map's own pairing). Note what that pairing-in-the-id implies for ADR 0027 §2's sentence "two maps that both yield a torus are ONE child": at HEAD, two maps are one child only when they are the SAME map on the same parent — a *different* pairing that still yields a torus would mint a SECOND id. The substrate is route-grained where §2's words are result-grained. His lane; my mechanism, handed over.

---

## 1 · §0.1 — THE MEASUREMENT: SIX SQUARES, SIX IDS — your hypothesis is RIGHT, and the substrate declares it on purpose

**One line, as offered: the six drawn squares carry SIX distinct shape ids.** And the better answer underneath, because the source says it in its own voice:

- **The mechanism is a committed DISCIPLINE, not an accident** — `invokePrimitive` (`writtenFormModel.ts:165-167`): *"unique source namespace per invocation — two invoked squares stay DISTINCT universes (the committed co-location ≠ identity discipline)"* → `loadForm(entry.build, \`w${seq}\`)`. The act's serial is IN the name.
- **Run, not inferred** (node, through the committed doors): `invokePrimitive('square',1).shape.id = shape:multiform:w1:4-gon` · `('square',2) → shape:multiform:w2:4-gon` — distinct.
- **The zoo's own recipe** (six invocations + the six `REFERENCE_OPS` preset words, the exact `summonZooForms` construction): **6 reduced edges · 6 distinct parent ids (`w11…w21`) · 6 distinct child ids · 6 record lines** — her ×12 (six stemma captions + six record lines) reproduced structurally at the substrate; her count was the screen half, this is the id half, and they agree.
- ★ **THE GRAIN, whole — ids are ROUTES:** a born child's id is `shape:materialized:glue:<THE PARENT'S FULL ID>:<face>:<pairing>` — measured: `torus-of-w1 = shape:materialized:glue:shape:multiform:w1:4-gon:face:…:0-2p:1-3p`. So **same-parent same-map twins COLLAPSE to one id** (my B-120 item 1: two glues on one square, one child) and **cross-parent copies SPLIT** (torus-of-w1 ≠ torus-of-w2 — measured false on equality). Invocation is the route's ROOT ATOM (individuated by act); every birth is deterministic in (op · parent-route · face · pairing). One law, both ends of the page.
- **And her sentence lands exactly where she aimed it:** *"which one is THE square?"* has no referent in the zoo AS BUILT — each reference child's parent is its OWN square (w11's torus, w13's Klein…), six one-child parents, no six-child parent anywhere. The page Arman's model describes — one square, all its children — exists only when a person invokes ONE square and works it (my B-120 drives were exactly that page). Whether the ZOO should be six universes or one is the meaning half, not mine.

## 2 · §0.3 — THE RENAME, PREPARED TO THE WALL (nothing spent)

- **The name I pick: `consuming`.** One line, as asked: the field then says exactly what its one writer computes — `consuming = !NON_CONSUMING.has(node.birthOperation)` — an op-kind fact named as one, sharing its word with the very set that produces it, and no liveness claim survives in the name.
- **Every site, measured:** `genealogyDag.ts:79` (the field + its comment) · `:206` (the local) · `:210` (the edge literal) — the ONE frozen file. Witness follow-throughs (all NOT-frozen): `diagnose-patch-lift.cjs:161` · `diagnose-playground-operations.cjs:94-95` · `diagnose-refine-word.cjs:96,305` · `diagnose-the-page-subdivide.cjs:88,146,183,186` · `diagnose-genealogy-dag.cjs:194` · plus the stale mention in my own `stemmaLabelModel.ts` header comment. `tsc` then proves the type-shape change reached every consumer (the frozen `genesisModel` imports the TYPE and touches no field — its bytes hold).
- ⛔ **Held at the freeze law: ask, never spend.** Routed above; asked in-terminal.

## 3 · §0.2 — THE SWEEP RUNNER: BUILT, MEASURED, AND IT JUDGES ITSELF

- **`npm run sweep` → `scripts/sweep.cjs`** — the three ratified steps: per-leg wall time printed BESIDE each leg; sharded (workers = cpus−1, measured against cpus/2 below); ONE command ending with the canonical line **byte-kept**: `123 files · expect exactly ONE fail: diagnose-dual-inspection`, then the verdict.
- ★ **It cannot read all-green as OK:** exit 0 iff the failure set is EXACTLY the accepted one; the standing red is the runner's own positive control, and *"the accepted fail PASSED"* prints as its own loud RED (*the baseline moved — the positive control is gone*), never a silent pass. A sweep that lost the ability to see failure cannot report success.
- **Classification byte-carried:** the same B-111 §2 fold — `scripts/diagnose-*.cjs` plus every app-leg `.cjs` WITHOUT a `DRIVE FAMILY` banner, read from the files' own declarations, no list kept anywhere else.
- **Measured, three full runs, identical failure set each time (123 @ 1):** hand-split serial baseline ~614s → sharded at cpus/2 (2 workers on this 4-core box) **337.9s** → at cpus−1 (3 workers) **271.5s, and the wall IS the one heavy leg** (`the-field-in-the-specimen` 232-272s — two-thirds of the whole sweep's cost in one leg; the expense now has a face and a name). Longest-first scheduling rides a local ignored times cache (`scripts/.sweep-times.json`, gitignored — a scheduling hint, never a record; losing it costs one slower schedule).
- **The doctrine points at it:** CLAUDE.md §6's command block now says `npm run sweep — run it WHOLE, never by hand-split halves` where the for-loop stood (the stale `121 files` count died with it). Flagged here because CLAUDE.md is the shared page: the edit mirrors your charter and nothing else.

## 4 · WHAT I RAN

- `npx tsc -b` — exit 0.
- **The sweep, three times, through its own new runner: 123 @ 1 each run** (the one accepted red; sharded result identical to B-120's serial baseline at this same HEAD — concurrency moved nothing).
- The node probes of §1 (the committed doors via the transpile hook — no fixtures).
- **The DRIVE FAMILY: trigger NOT fired** — this build changes no behaviour a person sees (`src/**` untouched; the runner, `package.json`, `.gitignore`, `CLAUDE.md`, and measurements only). The fifth witness's own rule: the family runs when the READING touches its subject; nothing here does.
- **Freeze:** every touched file outside the census (`scripts/sweep.cjs` · `package.json` · `.gitignore` · `CLAUDE.md`); ZERO frozen files touched, zero hash lines moved, zero census rows needed.

## 5 · WHAT I CHANGED

- **`scripts/sweep.cjs` (NEW)** — the runner (§3).
- **`package.json`** — the `sweep` script (step 3's one command).
- **`.gitignore`** — the times cache.
- **`CLAUDE.md` §6** — the command block only, for-loop → `npm run sweep`.
- **`.handoff/THE_BUILD.md` / `THE_BUILD_REPORT.md`** — the record pair.
- **NOT changed:** `GenealogyEdge.death` (held at the wall, §2) · anything in `src/` · the band · the zoo.

## 6 · WHAT I COULD NOT REACH

- **The rename itself** — the frozen wall (§2, routed, asked). Everything short of the spend is done.

`B-121` §0's order: (1) measured — six ids, hypothesis right, grain named; (2) built — the runner, three green runs, doctrine pointed; (3) prepared to the wall and STOPPED, name chosen. ⛔ Nothing further started. Arman's walks — P5, the drag, and now the label — are still owed, and his word on the frozen spend is the one thing this cycle waits on.

— the coder

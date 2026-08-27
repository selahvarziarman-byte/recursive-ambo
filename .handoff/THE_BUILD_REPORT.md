to: the mothership
from: the coder
clock (raw, verbatim): `Thu Aug 27 17:43:03 IST 2026` — mtime is the fact
**STAMP ECHOED: `B-122` · MARKER ECHOED: `F1` — the spend executed on Arman's second word**

## TO THE MOTHERSHIP

1. ✅ **THE SPEND IS COMPLETE, WHOLE, TWO FILES.** Arman, in-terminal, verbatim: **"the second file too."** That word plus F1's covered exactly what was executed: the coherent consumption vocabulary across `genealogyDag.ts` AND `genesisModel.ts`, nothing further. For the ledger: the sanction chain is F1's *"spend it, whole"* (one file) + this second word (the second file), each consumed at its own boundary and neither stretched.
2. ⚠ **A CENSUS MISS, CAUGHT BY THE INSTRUMENT WE BUILT LAST CYCLE — filed against me:** my witness-site grep (`\.death\b|death:|liveAtEnd|populationPath|'death'`) missed two BARE-IDENTIFIER uses of a variable I renamed at its declaration (`deaths.length`, `deaths.map` in `diagnose-genealogy-dag.cjs`) and one prose note. The RUNNER went RED, named the leg, and the miss cost one minute instead of a shipped break. *A grep census is a hypothesis about spelling; the runner is the measurement.* Also three legs (`the-ink` · `the-aperture` · `the-folded-edge`) carry a working-tree-vs-HEAD sanctioned-surface pin my B-121 enumeration did not know about — they went red exactly while Commit B's cargo sat uncommitted and green at the committed tip, the same correct-transient class as B-120's manifest pins.

---

## 1 · WHAT WAS RENAMED (the vocabulary, coherent, and only it)

**`src/lib/genealogyDag.ts`** — `GenealogyEdge.death` → **`consuming`** (the field now says exactly what its one writer computes: `consuming = !NON_CONSUMING.has(op)`; its comment names the boundary: an op-kind fact, never page liveness, ADR 0027 §4) · `GenealogyEvent.kind: 'death'` → **`'consumption'`** · `liveAtEnd` → **`unconsumedAtEnd`** · `populationPath` → **`unconsumedPath`** · the local census `alive` → `unconsumed` · every comment asserting "live"/"death" in the walk-census sense follows (22 substitutions, each verified unique before applying); **quoted mothership rulings byte-kept** ("Route-B patch-lift RATIFIED; NON-CONSUMING" etc.).
**`src/manuscript/genesisModel.ts`** — the one functional reader (`readGenesis`'s `new Set(dag.unconsumedAtEnd)` + the `pentimentoIds` filter) and the two comment mentions (4 substitutions).
**No values changed, no behaviour** — `pentimentoIds` computes identically; the falsifiers: `tsc` exit 0 (the compiler is the census for a type claim — no other consumer existed, as measured), the DAG leg's own deep-equality clauses green under the new names, and the sweep whole.

## 2 · THE PROTOCOL, AS PRESCRIBED AND AS RUN

- **Positive controls FIRST:** both old hashes reproduced at the base before any edit (`76ba4203…` genealogyDag, `3b6bde07…` genesisModel — computed `tr -d '\r' | sha256sum`, matched the manifest rows).
- **Commit `02bf432` — the frozen edits + BOTH re-seals ALONE**: exactly three files (the two sources + the manifest), and the manifest's diff is exactly the two sanctioned hash rows (`76ba4203… → c8b6f219…`, `3b6bde07… → 357e1682…`) — the audit rule satisfied in one glance.
- **Commit `7d61be9` — the adjacent witness follow-throughs**: eight legs (`genealogy-dag` incl. the two runner-caught sites · `manuscript-genesis` · `patch-lift` · `playground-operations` · `refine-word` · `the-page-subdivide` · `the-rim` · `thicken`) + `stemmaLabelModel.ts`'s header comment (the B-120 boundary now names `consuming`). No clause semantics moved — the same facts under the honest name.
- **Suite green at the tip:** `npm run sweep` → `123 files · expect exactly ONE fail: diagnose-dual-inspection` → **SWEEP OK** · `tsc` 0.
- **DRIVE FAMILY: trigger not fired** — a pure rename; nothing a person sees changes (the strip prints `edge.operation`; pentimento values identical).

## 3 · WHAT I RAN

`tsc` (twice: after each frozen file and at the tip) · the nine affected legs individually · the full sweep twice (once RED mid-flight — the §TO-THE-MOTHERSHIP item 2 catch — once OK at the tip) · the residual grep for every retired word across `src/` and `scripts/` (one hit remains, by design: the new field's own comment saying "renamed from `death`").

## 4 · WHAT I CHANGED

`src/lib/genealogyDag.ts` · `src/manuscript/genesisModel.ts` · `docs/governance/ENGINE_FREEZE_MANIFEST.txt` (two rows) — the sanctioned commit. Eight witness legs + `src/manuscript/stemmaLabelModel.ts` (comment) — the adjacent commit. `.handoff/THE_BUILD_REPORT.md` — this letter.

## 5 · WHAT I COULD NOT REACH

Nothing. The vocabulary is coherent at HEAD: one sense, one word, in the record's own file and its one reader — and `death` now appears in the engine only as the provenance note on the field that replaced it.

The rename `B-121` prepared, `B-122` held twice at two walls, and Arman sanctioned in two words, is landed. ⛔ Nothing further started.

— the coder

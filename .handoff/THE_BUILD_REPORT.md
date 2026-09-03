# REPORT — STAMP C-2 LANDED: the source speaks the ACT's word, carried from the record — echo of the 2359 ruling

## TO THE MOTHERSHIP

1. **ECHO `STAMP C-2` — both acceptance halves SIGHTED AT THE EYE:** the two-tori case reads *"abAB : the Square you made first ⟶ Torus (T²)"* and *"…you made second…"* — your ruling's phrase verbatim, no designer refinement needed to meet it — and the fallback stood in the same session: the dual of torus #1 (a glue-born parent, no palette provenance) reads *"the glue(4-gon) you made first ⟶ Dual"* — the gate handed null and the carried name stayed.
2. **The measurement came before the cure, per your constraint 1 — and no STOP was needed: the record CARRIES the act's word.** `invokePrimitive` mints `title: "⟨palette word⟩ — invoked"` **and** its own provenance sentence (`'invoked primitive (right-click on paper)'`) on the written entry, and `pageSnapshot` serializes the form VERBATIM (its header's own words) — so the act-word survives save/load. The carry reads that mint off the PARENT ENTRY, gated on the provenance sentence — never a class→word table, never a mint.
3. **One vocabulary observation from the fallback sighting, no action:** a glue-born source's carried name is the producer's own mint string (*"glue(4-gon)"* — frozen `writtenFormModel` vocabulary). The reader carries it honestly; this is the same already-routed producer class `resultNameFor`'s B-133 comment names (the IMMERSION_TITLES mint). Nothing new — named so the sighting is on the record.
4. **The researcher's one-cycle veto window is open per your note** — the cut stands on the ruling as it stands; the registers are untouched (constraint 2 honoured: the act-word rides the PHRASE slot only; ADR 0029's registers never see it).

## 1 · WHAT I SAW (drove the app on 5174 — 5173 was another's serve, left alone; served HEAD fingerprinted 061faef + this cut's dirty paths)

- Square #1 → Glue → Torus: the bare single-source card reads *"abAB : Square ⟶ Torus (T²)"* — the act's word on the ordinary case too (no ordinal, census 1).
- Square #2 → Glue → Torus: torus #2's card *"abAB : the Square you made second ⟶ Torus (T²)"*; torus #1 re-selected: *"…you made first…"*.
- Dualize torus #1: *"the glue(4-gon) you made first ⟶ Dual"* — the provenance gate's null branch live (and the C-1 ordinal composing over the two same-shape tori, unchanged).

## 2 · WHAT I RAN

- `npx tsc -b` — exit 0.
- `node scripts/diagnose-argument-card.cjs` — **ALL PASS**, including three NEW C-2 clauses at the model grain: (bare) act-word rides the source slot verbatim; (ordinal) *"the Square you made first"* composes with C-1's ordinal; (fallback+ordinal) a null act-word keeps *"the 4-gon you made second"*. The B-133 clause-B pin (source === '4-gon' with no act-word) now reads as the ruled FALLBACK's own pin — its label says so.
- **Drive family, the C-2 trigger (card copy ⇒ the three card legs; d8+winding untouched — no shelf/walk change):**
  - **d12b-carried-names: 1 red = (f2)** — the vs-HEAD byte-pin of `argumentReadingModel.ts`, the in-flight class again (the C-2 charter names this exact file; the pin self-heals at this landing; f1, its HELD scaffold subject, PASSED untouched). · **d13-the-door-speaks: ALL GREEN.** · **deficit-app: 1 red = the queued pre-existing `conePairs`+`coneFormBuilt` pair ONLY** (the era-controlled remainder, rungs 3–4) — every card arm GREEN with the new noun riding, runtime 229s.
- `npm run sweep` at the landed HEAD `3a354e0` — VERBATIM: `127 files · expect exactly ONE fail: diagnose-dual-inspection` → `SWEEP OK — the one expected fail, nothing else` (the f2 in-flight pin healed at the landing as predicted).

## 3 · WHAT I CHANGED (files, and why each)

- `src/manuscript/argumentReadingModel.ts` — `buildArgumentReading` gains the optional `sourceActWord` input (the model never derives it — your named fabrication, refused in the signature's own comment); the header's source slot prefers it in both branches (bare + ordinal). NOT_FROZEN.
- `src/manuscript/ManuscriptView.tsx` — the view-side carry (the C-1 division again: view owns the lookup, model composes): finds the parent ENTRY by shape id, reads the act-word off the invoke mint's title, **gated on the provenance sentence** — every non-invoked parent hands null.
- `scripts/diagnose-argument-card.cjs` — the three C-2 clauses + the B-133 pin's label extended to name its new double duty.
- No frozen file touched (`writtenFormModel` stays byte-identical — the carrier was already on the record; that is why no field, no spend, no STOP).
- **W1 courier:** riders as found, if any at the landing.

## 4 · WHAT I COULD NOT REACH

- Nothing. The remainders stand queued as you filed them (conePairs+coneFormBuilt and E.circuit with rungs 3–4).

*Your 2359 letter archives with this landing.*

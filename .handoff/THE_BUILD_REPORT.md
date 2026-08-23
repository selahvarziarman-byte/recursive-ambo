# THE BUILD REPORT — B-102: the menu speaks the picker's own vocabulary (two naming paths found, one producer now; a mid-mandate contradiction on the cube ruled by Arman — names everywhere), the ADR is protected, and rung 2's three unknowns carry numbers

**STAMP ECHO: `B-102`** — the build I executed is the one you wrote.
**coder · commits `0191dde` (§2 cure + witness) · `c7cd138` (§3 ADR, docs only) · `c7fc8d6` (mandate record) · report follows · on base `de31263` · branch `team-arman` · pushed after this report lands**

---

## TO THE MOTHERSHIP

**1 · A contradiction between two of B-102's own clauses, found by the 2a measurement and ruled in-terminal.** The cube's map labels `a→e · d→h · …` were never names: they are vertex-id KEY tails (`vertex:cube:a`, measured at `src/data/seeds.ts` — the seed table gives those vertices the NAMES `'A'…'H'`, which its own face picker prints one row up as `A·D·C·B · 4 corners`). So §2's law line (F.4 — an id never stands where a name is owed) condemned the cube's strings exactly as much as the octahedron's, while §2c ordered the cube's 8 held byte-identical. I routed it to Arman with the measurement; **his ruling: names everywhere** — the cube's control is recut FROM THE RULE (still 8 candidates, same order, modes derived; the tokens become its corners' names `A→E · D→H · C→G · B→F`), and the witness pins the recut string verbatim. The byte-identity clause died of a false premise the way §4's did last build — the control's PURPOSE (no regression on the cube) holds.

**2 · The BORN-absence sub-point did not need the STOP.** A corner the reach cannot name displays the honest address tail — which is the pre-existing ruled honest-id arm (the ×I band's term positions already read it), and is byte-what-the-menu-did-before for unnamed corners. No new person-facing form was needed, so nothing waits on the designer from this cut. (Fork (ii)'s all-refused sentence from B-101 still does — unchanged, §5's queue.)

**3 · §4's numbers are in §1.4 below — the one framing note:** the {4,5} probe measures GENERATION (the reflect-BFS + dedup, the ADR's flagged unknown); the drawing cost of ~2k arc-bounded cells is the render layer's own question and belongs to B-103's build, not to this probe. Stated so the number is not read as more than it is.

---

## 1 · WHAT I SAW / MEASURED

### 1.1 · §2a — the seam: TWO naming paths, and the divergence point named

- **Path 1 (the face picker):** `boundaryFacesOf(volume, resolveAbsentLabel)` → `faceDisplayName` → per corner: `data.label.trim().toUpperCase()` when positively present, else `lineageCornerDisplay(sources, vertexId, resolveAbsent)` (the D16 reach, level marks riding), else the face reads `unnamed`. This is why the picker says `AB·BC·AC` on the lifted octahedron and `A·D·C·B` on the cube.
- **Path 2 (the map menu):** `describeCandidate(candidate)` printed `shortId(vertexId)` — the id's last `:`-segment — with **no resolver in its signature at all** (`apertureModel.ts`, the correspondence join). Not one-resolver-with-a-bug: a second path that never had the reach.
- The cube's coincidence, named: its id KEYS (`a…h`) are its NAMES (`A…H`) case-flipped, so the address tail LOOKED like vocabulary. The lifted octahedron's tails (`1qudnfs`) broke the illusion — the defect was always F.4, on both volumes.

### 1.2 · §2b — the cure: one corner-name producer

`cornerDisplayName(shape, vertexId, resolveAbsent?)` extracted from the picker's own per-corner loop — THE producer (positively-present label uppercased → lineage reach → null on true absence; total over raw and `c{i}:`-prefixed ids). `faceDisplayName` consumes it byte-identically; `describeCandidate` takes the optional `cornerName` reach and falls to the honest address tail only where the reach returns null (or for a caller with no page — the witnesses' direct reads keep tails). The View threads **the same producer instance-for-instance** the picker composes with. Nothing minted; the absence arm IS the ruled honest-id arm.

### 1.3 · §2c — the acceptance, at the eye, usability bar met

- **Lifted octahedron** (route re-driven: ambo dissect → lift core → shelf → placed): picker `AB·BC·AC · 3 corners`; the map menu for the opposite pair reads **`AB→AD · BC→BD · AC→CD — preserving (derived) · cone room · edges wind`** … all 6 — the person can say, in corner letters, which map they picked and what it does. The id tails are gone.
- **The cube control (recut per the ruling):** all **8** candidates, flat leading — **`A→E · D→H · C→G · B→F — preserving (derived)`** — same candidates, same order, same mode and cone-room tags; the tokens are its corners' names, the same vocabulary as its own picker.
- Witness [l] pins both from the rule plus the label-less fallback (the cuboid reads tails).

### 1.4 · §4 — the rung-2 unknowns, measured

**(a) The {4,5} reflect-BFS at interactive rates** — probe ported VERBATIM from the designer reference (`tiling_generators.py`: ortho-circle inversion, frontier BFS, the `(1−|c|²)`-scaled dedup with the 0.05 spatial hash, the 0.998 rim drop, the min-edge LOD stop), node on this machine:

```
{4,5} · cosh R = 1.3764 (cot·cot ✓) · R = 0.8425 · base radius tanh(R/2) = 0.3980
depth 4:  109 cells   1.93 ms      depth 7: 1365 cells  13.48 ms
depth 5:  257 cells   1.92 ms      depth 8: 2241 cells  14.93 ms
depth 6:  597 cells   4.15 ms
⇒ throughput ≈ 950–2500 cells per 16.7 ms frame budget; the ENTIRE depth-8
  tiling (2241 cells, LOD-stopped, rim-clipped) generates inside ONE frame.
  Generation is once-per-surface, not per-frame — the budget question is
  effectively closed for generation. (Drawing ~2k arc-bounded cells is the
  render layer's cost — B-103's own measurement.)
dedup control (LAW 24): WITHOUT the (1−|c|²) dedup depth 6 unrolls to 5461
  (the tree) vs 597 closed — the reference's trap BITES in the port too.
```

**(b) Where the window reads a surface's {p,q}** — it is STORED NOWHERE (record-not-reading holds; nothing to flip). It derives, and every piece has an owner:
- the complex: `acquireComplex(shape, ancestry)` — `src/lib/complexIdentification.ts:840` (frozen; consumer access) — **p** = the faces' cycle length;
- **q** = the interior vertex-link length: `extractVertexLinks(complex)` — `src/lib/level3SoundnessGate.ts:158` (readings typed at `:81`), or per-vertex `vertexLinkOf(v, shape)` — `src/lib/conformalAtom.ts:106` (Gauss–Bonnet's own walker);
- the MOUNT SEAM: the explore threshold's surface arm — `ManuscriptView.tsx:3136`, where `EXPLORE_SURFACE_LATER` ("the inside of a surface is not walkable yet — this door opens in a later chapter of the instrument.", `:238`) stands today with `targetFor`'s shape + ancestry in scope. The tiling layer reads {p,q} by two calls it can already reach from there.

**(c) Stereographic far-side-shows-through vs the pass structure** — the reasoned read: there is NO composer/postprocessing anywhere in src — one forward pass, default renderer; the ink pipeline is a **renderOrder + `depthWrite:false` layer stack** (InkedForm's documented −2 depth-prepass … 10 stroke passes; the trace overlay's 13/14). A far-side layer is exactly one more co-planar transparent layer in that stack. **The kill-probe, run in the app's own three** (offscreen renderer, readPixels):
- the idiom (co-planar far-red under 50%-blue, `depthWrite:false` + renderOrder): **rgb 128,0,127** — the correct show-through blend — and **identical under reversed add order** (deterministic);
- the wrong mechanism (co-planar, `depthWrite:true`, no renderOrder): **order-DEPENDENT** — one add order blends, the other reads pure red (the far side punches the near layer out via the depth buffer). The control bites, so the probe is real.
⇒ far-side-shows-through composits correctly **iff it rides the codebase's own established idiom**, which is the default way ink layers are already written. No pass-structure obstacle.

### 1.5 · §3 — ADR 0025 protected

Committed byte-as-it-stands (`c7cd138`, docs only, its own commit — 91 lines, `create mode`). Its Status line already read **Accepted** at the researcher's own hand — nothing flipped, per your ⚠.

## 2 · WHAT I RAN (the five witnesses)

```
1  git diff HEAD --name-only -- src → EMPTY at the tip (tsbuildinfo dirty by law)
2  freeze manifest: apertureModel.ts / ManuscriptView.tsx NOT_FROZEN (standing
   rows); complexIdentification touched READ-ONLY (a locate, no edit); no
   frozen file spent. The [j] freeze leg green in the same suite pass.
3  no re-seal owed.
4  suite at the FINAL head: 112 files @ exactly 1 fail = diagnose-dual-inspection
   (accepted baseline) — the faceDisplayName extraction is behavior-neutral
   under the whole standing suite. diagnose-the-aperture gains [l]: the recut
   cube control pinned verbatim from the rule; all-8-tokens-are-names; the
   octahedron through the SAME producer faceDisplayName uses; the label-less
   fallback. npx tsc -b → exit 0.
5  THE READING — §1.3 at the eye in the WINDOWS Chrome (mid-drive the session
   had landed on a second, macOS browser — Arman's standing rule re-applied on
   his word; the drive restarted in the right one). One stale 0-byte
   .git/index.lock (~25 min old, no live git) removed and disclosed.
```

## 3 · WHAT I CHANGED

- **`src/manuscript/apertureModel.ts`** (`0191dde`): `cornerDisplayName` extracted (the one producer); `faceDisplayName` consumes it; `describeCandidate` gains the optional `cornerName` reach with the honest-tail fallback.
- **`src/manuscript/ManuscriptView.tsx`** (`0191dde`): the map-label site threads the picker's own producer (`resolveAbsentLabel` reach; memo deps carry it).
- **`scripts/diagnose-the-aperture.cjs`** (`0191dde`): section [l] — the ruled recut control, the names-everywhere pins, the same-producer pin, the absence fallback.
- **`docs/adr/0025-…md`** (`c7cd138`): tracked byte-as-it-stands.
- **`.handoff/THE_BUILD.md`** (`c7fc8d6`): the mandate record.
- *(scratchpad, not repo: the {4,5} probe — an instrument; its method and numbers are recorded in §1.4.)*

## 4 · WHAT I COULD NOT REACH / DID NOT TOUCH

- **Fork (ii)'s person-facing sentence** — with the designer, unchanged.
- **§5's ledger** — untouched: the folded card, term positions, Δ11's presentation, vertex identification, collapse's route, auto-persistence, and the rung-2 BUILD itself (B-103 — its three unknowns now carry numbers and locations instead of flags).

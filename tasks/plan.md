# PLAN — THE INSIDE-VIEW GATE (surfaces: local flatness vs global curvature)

**Owner:** designer seat · **Opened:** 2026-08-09 · **Scope:** THE LOOK ONLY. Implementation is not mine and is not planned here.

## The premise I am correcting

The rung-2 reading said *"a surface has no interior volume, so it is a picture you look AT, not a room you walk."* **I accepted that and it dragged me to a textbook globe.** It is the wrong premise for this gate.

**A surface has an inside view.** You are not inside a volume — you are a flatlander living ON the surface, looking ALONG it. Light runs along geodesics and returns; you see copies of your own world receding in every direction. **It is the 3-D walk, one dimension down: a landscape instead of a corridor.**

## What the gate is actually about

★ **Locally, all three geometries look identical.** Flat at your feet, every time — that is what "locally flat" means and the picture must show it.
★ **Globally they differ ONLY in HOW THE COPIES RECEDE.** That is the drawable difference, and it is the whole gate.

| geometry | the recession law | what the eye sees |
|---|---|---|
| **EUCLIDEAN** (Σδ=0) | copies shrink ~1/d | a regular lattice receding to a vanishing point, evenly |
| **SPHERICAL** (Σδ>0) | geodesics CONVERGE | the world CLOSES — copies shrink, then **grow again**; the antipodal copy lenses and swells to fill the field |
| **HYPERBOLIC** (Σδ<0) | copies shrink ~e^(−d) | copies shrink violently; **infinitely many crowd the last few degrees** before the horizon. The world is far bigger than it should be |

⚠ The spherical lensing and the RP²-specific case are **my reasoning, not verified** — T1/T2 exist to ground them before anything is drawn as fact.

## ⛔ SUPERSEDED — the horizon-landscape was a LIE, and here is exactly how

Arman: *"you see what you have designed is a lie right now. that is why people try 'tiling' to relay the idea."* **Correct, and the fault is nameable:**

★ **I drew the surface as a blank ground with objects standing on it. The surface IS the tiling.** Its cells are what carry the curvature, and my picture had no cells at all — so it was decoration laid over the structure, which is the exact thing the one law forbids. The recession reasoning was right; the object I applied it to was empty.

★★ **THE STANDARD, ADOPTED AS OURS:** spherical as a **stereographic projection**, euclidean as the **plane tiling**, hyperbolic in the **Poincaré disk**. All three are conformal, so angles are true and geodesics are arcs, and one Schläfli symbol `{p,q}` runs across all three. Apply it wherever it reaches; only where it cannot do we reach for an about-image.

★★★ **AND IT HANDS US THE ARGUMENT, prose-free.** Hold the cell fixed — a square — and change only how many meet at a vertex:

| | `{4,3}` | `{4,4}` | `{4,5}` |
|---|---|---|---|
| flat squares at a vertex | 3 | 4 | 5 |
| their angles | 3×90 = **270°** | 4×90 = **360°** | 5×90 = **450°** |
| | a 90° **GAP** — must close up | **closes exactly** | 90° **OVERLAP** — must ruffle open |
| `(p−2)(q−2)` | 2 **< 4** | 4 **= 4** | 6 **> 4** |
| cosh R = cot(π/p)cot(π/q) | **< 1** | **= 1** | **> 1** |

**Every cell stays flat — that is local flatness. They do not fit — that is global curvature.** And this is not a new instrument: it is the engine's own angle deficit, the same three states already ruled for cone edges — **DEFICIT / FLAT / EXCESS**. One instrument, both rungs.

**Delivered:** `.handoff/assets/THE_TILING_GATE_DESIGNER.png`.

**Two errors caught by measuring rather than looking** — both would have shipped a wrong picture:
1. I used `cosh R = cos(π/p)/sin(π/q)`. **Wrong** — it is `cot(π/p)cot(π/q)`. My squares came out too small, hence too nearly Euclidean, and the corner measured 79.47° instead of 72°.
2. Dedup by exact rounding **never fired** — repeated circle-inversions drift, so the walk unrolled into a tree. The tell: the tile count was exactly `1+4+12+36+… = 4373`, the tree count. Cure: a tolerance scaled to `(1−|c|²)`, since hyperbolic tiles shrink with it.

The plate now asserts before it draws: corner angle `= 72.000°`, every interior vertex valence `= 5`, and cells emphasised at the marked vertex `= 3 / 4 / 5`. It fails loudly rather than drawing something false.

## Architecture decisions

1. **One picture-kind for all three geometries** — a horizon landscape from an eye ON the surface. Not three different diagram types. **The comparison IS the argument**, so the frame must be identical and only the recession may differ.
2. **The inhabitants are settled and reused unchanged** — the happy/sad plaque + the coil, already authored. Nothing new to invent; the gate is about the space, not the furniture.
3. **The dim-3 walk's craft carries down verbatim** — hatch for tone, nib for depth, silhouette out-weighs interior, horizon by weight, LOD ladder. **No new ink language.**
4. ⛔ **CORRECTED (Arman, mid-build).** My original decision 4 read *"no textbook fundamental-polygon picture anywhere."* **That was overreach and it is withdrawn.** The two picture-kinds carry different information and the choice between them is decidable on Arman's criterion — **which carries more with no prose attached:**

   | | about-image (outside / arrowed polygon) | inside view |
   |---|---|---|
   | global shape, at a glance | **yes** | no |
   | the identification, **and its orientation** | **yes** — the arrowhead | no, not without an imported device |
   | needs a taught convention? | **yes** — arrows mean nothing untaught | **no** — everyone knows things shrink with distance |
   | what the curvature does to an INHABITANT | no | **yes** |
   | exists honestly at all? | **NOT for hyperbolic** — Hilbert 1901 | always |

   **THE RULE: about-image for questions of IDENTITY (what is this, how is it glued, with what twist). Inside view for questions of INHABITING (what does living here do to you) — and always, when no honest about-image exists.**
   - **RP² → the about-image wins, and I concede it.** RP² is locally isometric to S², so its inside view is nearly the same picture as S²'s; the distinguishing facts (you meet your MIRRORED self, at half the distance) need prose to notice. The hemisphere with arrowed rim shows the defining content in one glance.
   - **The flat torus → about-image wins** for the same reason: its inside view is indistinguishable from ordinary flat space until you notice the repetition.
   - **Hyperbolic → inside view wins, and this one is a theorem, not a taste.** Hilbert (1901): the hyperbolic plane admits no complete isometric immersion in ℝ³. Every "about" picture of it is a distorting model and a taught convention. The inside view is the only honest one.
   - **This gate is an INHABITING question** — "local flatness versus global curvature" is a claim about an inhabitant's epistemic situation. So the inside view is right *here* while the about-image stays right for RP²'s identity. The engine carries both, with this rule stated.

## Task list

### Phase 1 — GROUND THE RECESSION (so the look is not my physics)
- [ ] **T1** the three recession laws, from the researcher
- [ ] **T2** the RP² inside view specifically (it is non-orientable — the returning image is mirrored)

### Checkpoint A
- [ ] Each of the three laws is a researcher ruling, not my inference.

### Phase 2 — DRAW THE LOOK (the deliverable)
- [ ] **T3** the EUCLIDEAN landscape — the control
- [ ] **T4** the HYPERBOLIC landscape — the gate's real target, and the hardest
- [ ] **T5** the SPHERICAL landscape — the closing world
- [ ] **T6** THE COMPARISON PLATE — the three side by side, one eye, same inhabitants

### Checkpoint B
- [ ] A person seeing T6 can say which world is which **without reading the captions.** If they cannot, the look has failed and no amount of ink fixes it.

### Phase 3 — THE MARKS THAT RIDE ON IT
- [ ] **T7** the identification mark — what tells you a copy is a copy, and whether it came back mirrored
- [ ] **T8** the horizon, per geometry — three different horizons, one law

### Checkpoint C
- [ ] All three read at two attitudes. Ruled, routed, ready to build.

## Risks

| risk | impact | mitigation |
|---|---|---|
| I draw my own physics instead of the engine's | High | T1/T2 gate every recession law before it is drawn |
| The three landscapes look the same | Fatal — it is the whole gate | Checkpoint B: identify-without-captions |
| I reach for a textbook diagram again | High | Decision 4, stated; and the gate is "inside", never "about" |
| Hyperbolic is genuinely hard to draw legibly | High | T4 early (fail fast), not last |

## Open questions for Arman

- Is the eye **on** the surface (a flatlander, seeing a horizon band) or **just above** it (an oblique view of the tiled plane)? The first is truer to "inside"; the second is easier to read. **I lean flatlander and will draw that first.**

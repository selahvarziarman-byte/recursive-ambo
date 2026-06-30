# Topological Module — Context

The Topological Module is a **generative playground**: a standalone structural space where **forms** (labelled cell-complexes) are **born from forms** — the engine's identity calculus run *generatively*. Two or more forms combine into a child that carries a lineage from its parents; one form transformed in place is the *unary* sub-case (the reductive "transformer" we first built). The metric is stripped below it and **meaning is left to the user's mind above it** — the engine delivers honest structure; the human reads it. Material enters by **invocation** (a primitive shape from scratch) or by **loading** a saved snapshot of an entity from an ambo **universe**; many universes can meet here, each piece still tracing home.

This file is a glossary — the language of the module's picture, not its implementation. Status: **redrafted to the generative picture 2026-06-23 (sovereign-grilled), ratified, extended 2026-06-27 with the spectral column — the second arrow and the law-vs-instrument field (ADRs 0008–0013), and confirmed 2026-06-30 by the witness firing — the field frame realizes the topological law on our w₁=1 forms (ADRs 0014–0015) — with the second arrow then built, the spectral flow SF realized in code (ADR 0016).** Terms _(firm)_ are sovereign-endorsed. ADRs 0001–0007 are **re-situated** (their structural mechanics stand; the reductive framing becomes the unary sub-case — ADR 0008).

## Language

### The playground and its sources

**Playground** _(firm)_:
The module itself — a **standalone** structural space, independent of any one ambo universe (Ground Plan §4.5), where forms live, combine, and are recorded. It holds **snapshots**, not live links.

**Form** _(firm)_:
The unit that lives in the playground — a labelled **cell-complex** (a life-shape: line, circle, square, Möbius, torus, Klein, …). The manifold zoo (ADR 0001/0002/0006) is the catalogue of possible forms.

**Invocation** _(firm)_:
Introducing a primitive form **from scratch** (a line, a square — dim-1 up) and labelling its vertices. Its vertices are **source-less primals** — the engine's seed mechanism generalised below the 3D seeds (`lineage.ts` already treats a source-less vertex as its own primal). The genealogy roots at the invocation.

**Load / Snapshot** _(firm)_:
Importing a saved entity (a face, cell, or edge) from an ambo universe as a **self-contained snapshot** — its structure, its inert labels, and its lineage roots all travel with it. Snapshot, never live link (Ground Plan §5.3).

**Universe** _(firm)_:
A saved ambo run — a "naming-process" — and a source of loadable material. Identified by an **opaque id** (pure provenance, a name not a doorway). Many universes can be loaded into one playground; they stay **sealed from each other except by a glue the user performs** (recorded with both provenances).

**Provenance / namespaced primal** _(firm)_:
Every lineage root is tagged by its source — `(universe-id, primalKey)` or `(invocation-id, …)`. This is the **only** structural extension the multi-universe feature needs: it keeps sources distinct (universe-1's "A" ≠ universe-2's "A"), so **co-location ≠ identity holds across universes**.

### Birth and the operations

**Birth** _(firm)_:
A combination of **two or more** forms into a **new** form; the parents are consumed. (Two Möbius → a Klein.) The child's sites pull back into all parents; its lineage traces to all their roots.

**Operation** _(firm)_:
The move that builds or alters a form — **the built set, reused, with no new family**. *Within* one form (unary): glue / flip-glue / collapse / cut. *Between* forms (arity ≥ 2): birth = the same boundary-identification applied to the disjoint union, plus **product**. The **boundary-matching** (the GSR machinery) is the only compatibility gate. (ADR 0008.)

**Metabolism** _(firm)_:
A **unary** operation — one form changed in place (square → Möbius); the form keeps its identity. This is the reductive "transformer," now the unary sub-case of the playground.

**Parent / pull-back** _(firm)_:
A child site's **pull-back set is its parents** — the source sites it came from. The committed ledger's pull-back *is* the parent-pointer; the genealogy is that ledger read forwards.

**Lineage** _(firm)_:
The carried **charge** — a form's primal multiset (its source-less roots, now `(source, primalKey)`). **Carried, not minted**: a born form inherits its parents' lineage (unlike an ambo midpoint, which mints a fresh one).

### The genealogy — the standing object

**Genealogy / DAG** _(firm)_:
The record of who-was-born-from-whom and who-died — the playground's **persistent state and real product**. Forms are transient; the genealogy is what lasts and what the user reads.

**Population vs record** _(firm)_:
The live **population** (cast) is **non-monotone** — consumptive, it shrinks on each birth (parents don't survive). The **genealogy** (record) is strictly **monotone-growing** — every birth and death adds a node.

**Depth (the arrow)** _(firm)_:
The only monotone — every operation makes a child deeper than its inputs; descent is irreversible (the engine's `generationDepth`, lifted to forms). **Complexity/level is free** — combine and product raise it, collapse and cut lower it; ascent is a choice, not a law.

**A form's life** _(firm)_:
Its arc through the DAG: born (a frontier form) → consumed into a child, or cut (it dies) — its descent recorded forever. "The life of concepts."

### The forms (the zoo) — re-situated, structural mechanics intact

**Manifold-strata factory** _(firm)_:
Forms are manifolds (classifiable); relations may include junctions, recorded as strata + loci (ADR 0006). `GlueCoh` is a decomposer, not a gate. Principle: **instruments, not guards** (ADR 0004/0006).

**Ladder / Level** _(firm)_:
The complexity coordinate — the sphere ladder Sⁿ, level n = dimension (ADR 0001). A coordinate forms **move along, not the spine**: births can raise it, collapses lower it.

**Valence / Stratum / Through-pairing** _(firm)_:
Per-locus valence {1 boundary · 2 interior · >2 junction}; a stratum = the canonical component; the through-pairing = `GlobalSquareResolution` generalised (ADR 0006/0007). Unchanged.

### The reading, and the wall

**Structural semantics / the Mirror** _(firm)_:
The engine produces **structural content, which *is* the semantics**; **meaning** is its reflection in the user's mind (ADR 0005). The framework's sole end is a **prosthesis for thinking**. Names are the user's mirror, never minted by the engine.

**The five structural necessities** _(firm)_:
What the structure must carry **completely and honestly** so the reading is possible — all structural, meaning rides on top: (1) **descent** recoverable (the pull-back); (2) each identification carries its **orientation/sign** (w₁); (3) **incidence** preserved (local links); (4) **invariants** computable (orientability, genus); (5) the **whole assembled complex** with its signed loops.

**Contradictory constellation = a signed loop** _(firm — the locked reading)_:
Operationally, a **signed loop in the assembled complex** (a closed walk whose edge-signs multiply to −1). On the reading side, the human's mirror reads it as "a contradictory system of propositions tied together." The reading word **never crosses** to an operation.

**Intelligible (the north star)** _(firm)_:
"Intelligible after transformation" = the delivered structure is honest and legible enough that the user's mirror forms cleanly. **Mirror-ability**, never a meaning the engine outputs.

**The wall** _(firm)_:
Meaning-words (argument, contradiction, proposition, …) live on the **reading** side and **never enter an operation's definition**. Operations use only the structural column below. Building meaning into operations is forbidden — the lesson behind dropping "resolution."

### The spectral reading — the second arrow and the field _(firm — ADR 0012/0013)_

**The spectral column** _(firm)_:
A **second reading** of the one assembled complex, on the **same incidence** the topological reading already uses — no new substrate. It reads the **complex, never the form**: the response spectrum `γ` distinguishes complexes that are the *same form* (tetra, octa, cube are all S² yet give `2/3, 1/2, 4/9`), so the spectral data is **never a form-invariant**, and the honest datum is the eigenvalue *set*, not a single `γ`.

**The connection `U` — the law** _(firm)_:
The **orientation–genealogy connection**: the committed signed pull-back / orientation sign (`U ∈ {±1}`, lifting to `U(1)×SO(3)` along the genealogy). Derived, parameter-free. Its two **complementary** invariants are the law — **holonomy** `Hol = ∏U` around a loop (needs `H₁≠0`; `Hol = −1` is exactly `w₁ = 1`) and **spectral flow** `SF` along the genealogy (needs a birth; the eigenvalues flow irreversibly as a form is born). `w₁` is the **Z/2 shadow** of both.

**The second arrow** _(firm)_:
Not a new arrow — **genealogical depth (the one arrow) read spectrally**. Frozen, the spectral column is a static complex-level reading; read *along* the genealogy it is the **field**. The topological arrow *is* the time; the spectral reading along it *is* the field; `w₁` is its shadow.

**Built (firm — ADR 0016):** `SF` is realized in code — `SF(birth) = dim ker(L_U^parent) − dim ker(L_U^child)` on the committed connection-Laplacian (PSD ⇒ the only flow through 0 is the kernel, so `SF` is the endpoint `Δker`, homotopy-invariant). It reads `0` on orientable site-adds (the dimension jump is not flow), `1` on the frustrated `w₁=1` close, additive along a birth-path, and `SF mod 2 = w₁` (the integer the shadow shadows). Ratified blind 2026-06-30. So both of the connection's invariants — holonomy (the witness) and spectral flow (this) — are now built; the spectral half of the picture is closed.

**Law vs instrument — the wall, again** _(firm)_:
The "field" is two layers that must never be confused. **Layer 0** — the invariant above (connection, holonomy, spectral flow) — is the **law**, derived, and the *only* thing written into canon. **Layer 1** — the connection-wave field `ψ` — is a **measurement instrument** (iron filings): declared, labelled, admitted only if it **tracks** the invariant (reproduces it, invents nothing, survives stripping). **No canonical clause is ever written in terms of `ψ`.** The instrument reveals the law; it is never mistaken for it — the same discipline as the meaning-wall.

**The witness — the frame realizes the law** _(firm — ADR 0015)_:
The instrument is not merely consistent with the law; it **realizes** it. A forced S₄-equivariant director frame, transported around our committed `w₁=1` forms under the committed `U`, **winds exactly where the topology says** (`∏U=−1`, a Z/2 half-twist on the intrinsic seam and Klein's b-cycle), is trivial on the orientable / contractible / `w₁=0` loops, vacuous on H₁=0, and `winding === ` the committed Wilson loop everywhere — measured **blind** against a pre-registered seal (`6ab3b5bd`) and ratified by unseal 2026-06-30. The director half-vortex **is** the Wilson loop, made geometric and carried by the orientation-reversing dual `Σ = PD(φ)` — the *site-witness* (item 5). Its **invariant is the intersection pairing** `[Σ]·[γ] = w₁(γ)` (the committed `perCycleW1`), well-defined on every form — **not** the absolute class: `Σ` lands in `H₁(M)` on closed forms but in `H₁(M, ∂M)` (relative, no canonical absolute representative) on bounded ones, so one **pairs, never compares absolute `[Σ]`**, across forms with boundary. It is a homology pairing, **not a site-set** (no nonempty gauge-invariant site-set exists; the BFS flip-support is the labeled gauge representative). _(researcher-ruled, mothership-ratified 2026-06-30 — ADR 0015 Resolution.)_ The earlier *hollow* holonomy was domain-dependence (their cuboctahedron is S², H₁=0), not a dead field — the where-test law (ADR 0014) made flesh.

## Reading ↔ structure — the translation table

Left is the *reading* (the mirror — fine in examples). Right is the *only* thing an operation ever touches.

| reading (the mirror) | structure (the operations) |
|---|---|
| argument | a **form** (a labelled cell-complex) |
| proposition | a **vertex** (0-cell) |
| inference | an **edge** (1-cell) |
| coherent / consistent inference | orientation-**preserving** identification (sign +1, w₁=0) |
| contradiction / "the twist" | orientation-**reversing** identification (sign −1, flip-glue, w₁=1) |
| "a contradictory constellation" | a **signed loop in the assembled complex** |
| dialectical moment ("ready to be solved") | a **non-orientable form** (a stabilised w₁=1 complex) |
| "solving" / resolution | **— nothing**; reading-only, no operation |
| birth / "combine up" / composing arguments | a **combination operation** between forms (boundary-glue / product) |
| parents / "remembers its parents" | the **pull-back set** |
| genealogy / decoder | the **lineage DAG** (transitive descent to the roots) |
| "the life of concepts" | a form's **arc through the DAG** |

## Example dialogue

— "Load a face from universe-1 and a face from universe-2, then glue them."
— "Two forms, two provenances. The child's sites pull back into both — its lineage carries `(u1,…)` and `(u2,…)` roots. They never auto-identified; *you* glued them, and the record keeps both."
— "And if a loop in the result comes back flipped?"
— "Structurally, a signed loop with product −1. You may read that as a contradiction tying the two worlds' propositions together — but the operation only ever saw a signed loop. The reading is yours; the structure is ours."

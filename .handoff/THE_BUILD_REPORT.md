to: the mothership
from: the coder
clock (raw, verbatim): `Wed Aug 26 14:43 +0330 2026`
**STAMP ECHO: `B-108` — STOPPED AT 2a, per §4's own conditional.** *(The ordering measurement turned up the position-keyed hazard; 2b and 2c ride the next build, as you ordered. Σ = 4π is NOT sealed as measured.)*

---

## TO THE MOTHERSHIP

**1 · THE VERDICT: the sort at `dualView:991` IS position-keyed — and the hazard is ACTIVE, at the ADDRESS layer, measured across the relaxation.**
- **The mechanism, read:** `orderIncidentFaces` sorts a vertex's incident faces by `atan2` of each face's CENTROID projected on a tangent basis of the normal `sourceVertex.position − sourceCentroid` — positions through and through; the `id.localeCompare` tiebreak fires only within 1e-6 rad of angle.
- **Measured across t = 1 → 1/φ (the same diagonalized shape, positions swapped — byte-identical combinatorics by R1-d):**
  - **6 of 12 dual FACE ids DRIFT.** `makeDualViewFaceId` hashes the LINEAR emitted order (`cellId|sourceVertexId|orderedVertexIds`), and the linear order moved at 6 of the 12 source vertices. Dual VERTEX ids (0/20) and EDGE ids (0/30) hold — they hash source ids only.
  - **The CYCLES survive whole:** 0/12 cyclic orders moved (rotation/reflection-invariant), and BOTH metrics produce TRUE fan cycles — every consecutive pair of faces in every dual cycle shares exactly one edge through the vertex, verified against the CARRIED complex (the frozen dualization op's own ground-truth definition). So the dual complex the person gets is CORRECT at both metrics; what re-shapes with positions is the linear presentation and therefore the face IDENTITIES.
  - **Float-fragile:** a ±1e-9 jitter flips the linear order at 1/12 vertices (the atan2 starting-point cliff) while every cyclic order holds. **A position-keyed ADDRESS — the B-105 §9 key-drift family exactly: the id is an address that moves; the carried complex is the invariant.**
- **Σ→4π's own exposure, bounded precisely:** the stamp is count-only (`regularCornerAngle(sideCount)` — measured: all 12 faces carry the side-5 constant regardless of order), so **the SEAL cannot be numerically corrupted by the ordering — but it would be sealed over position-keyed face addresses**, and any consumer keying on dual face ids (the model's own correspondence maps, persistence, the render seam) inherits the drift. That is your "read off the wrong complex" warning located to its true layer: the sum is safe; the IDENTITIES are not.

**2 · THE CURE IS NOT A UNION — your hedge dissolves, and the cure's idiom already exists in the frozen sibling.**
- `src/lib/dualView.ts` is **NOT_FROZEN** (its own manifest row). No spend, no sanction.
- **The frozen `dualization.ts` already orders the SAME fan on the carried complex:** `buildIncidentFaceCycleAdjacency` (faces adjacent iff they share an edge through the vertex — combinatorial) + `walkFaceCycle` (both directions) + `chooseOutwardFaceOrder` (positions consumed ONLY for the orientation bit). **The cure = port that idiom to `orderIncidentFaces`:** the cycle from edge-adjacency, a deterministic id-keyed starting face, positions only for the one outward/chirality bit. My probe's fan-correctness check is the acceptance's ready-made shape (it already verifies the combinatorial ground truth), and the probe measured the positional cycles ALREADY AGREE with the combinatorial fan at both metrics — so the port is behavior-neutral at the cycle level and kills the id drift whole.
- **Price: small.** One non-frozen file (~40 lines), witness legs (fan correctness + id stability across the relaxation + the jitter control), no `src` neighbors. Chartered whenever you want it; not built here, per your ⛔.

**3 · NOT DONE THIS BUILD, by §4's conditional:** 2b (the n=5 regular-fan gate) · 2c (the word-union price · the app-leg legs). All ride the next build.

**4 · A correction to my own record:** the `B-107` record commit's message (026d499) cites the R1 build as `74be04c` — the real sha is `0dfc52a`. The pushed history stands (never rewritten); this letter is the correction.

---

## 1 · WHAT I SAW
Nothing driven — 2a is a substrate measurement (the mandate's own charter: measure, report, stop). No server started; 5173 untouched.

## 2 · WHAT I RAN
```
The 2a probe (scratchpad, throwaway): the live chain cube → ambo →
diagonalize → buildDualCorrespondenceModel at t=1/φ AND at t=1 (positions
swapped back to the parent ambo's — the pre-R1 output reconstructed on
byte-identical combinatorics), plus a ±1e-9 jitter build.
  face-id drift 6/12 · vertex ids 0/20 · edge ids 0/30 · cyclic order moved
  0/12 · linear order moved 6/12 · fan correctness TRUE at both metrics
  (every consecutive pair shares exactly one edge at the vertex) · jitter
  flips linear 1/12, cyclic 0/12 · all 12 stamps the side-5 constant.
No src touched; suite/tsc unchanged from 026d499 (113 @ 1 · tsc 0).
```

## 3 · WHAT I CHANGED
Nothing in `src/` or `scripts/` — the stop fired before any cut. This letter + the tracked-pair record are the cycle's writes.

## 4 · WHAT I COULD NOT REACH
- **Σ = 4π as MEASURED** — gated behind the ordering cure by your own clause; not sealed.
- **2b · 2c** — unstarted per §4.

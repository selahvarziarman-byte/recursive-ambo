# MOTHERSHIP RATIFICATION — the SECOND ARROW is BUILT (spectral flow SF realized in code)

**Seat:** Mothership (4th seating) · **Date:** 2026-06-30 · **Branch:** `team-arman` HEAD `8781847`.
**Ratified by independent verification** — re-read `spectralFlowV0.ts`, re-ran `node scripts/diagnose-spectral-flow.cjs` myself (exit 0, ALL PASS), `tsc -b` exit 0, reproduced the representative-independence, and unsealed my own blind SF table against the held prediction (`88759ebe…` / `SF_SEAL_CANONICAL.txt` — custody intact: on-repo hash === held plaintext sha256).

## VERDICT: the SF seal FIRES — the second arrow is real.
The integer spectral flow of the genealogy, measured blind on the committed connection-Laplacian, matches the sealed pattern on every line.

## The unseal — my blind re-run vs the held seal `88759ebe` (line by line)
| sealed | my measured (blind) | match |
|---|---|---|
| `SF_A=0` — orientable site-add does not flow | ambo (ambo-dissection) SF=0 (ker 1→1) | ✓ |
| `SF_B=1` — frustrated close lifts one zero mode | flip-glue SF=1 (ker 1→0) | ✓ |
| `PATH=1` — additive | Σ SF = 1 = endpoint `ker(tree)−ker(flip)` | ✓ |
| `CONTROL B'=0` — orientable close | glue SF=0 | ✓ |
| `IDENTITY=0` — non-birth | identity SF=0 | ✓ |
| Z/2 shadow `SF mod 2 = w₁` | flip 1=w₁1; glue 0=w₁0 (vs committed `perCycleW1`) | ✓ |
| convention-independence `SF=Δker=`crossing-count | F3 `netCrossing=1` (trajectories) === `Δker=1` (endpoints) | ✓ |

**FIRES iff all hold → ALL HOLD.** The integer SF is 0 on the orientable site-add (the dimension jump is not flow), 1 on the frustrated `w₁=1` close, additive (path=1), 0 on the orientable close and the identity, and reduces mod 2 to the committed `w₁`.

## The representative basis (engineer surfaced; I verified it does not matter)
The seal's illustrative example was a **5-cycle** (frustrated `minEig=0.382`); the build measures on the real **6-site X_K loop** (frustrated `minEig=2−√3=0.2679`). I reproduced both: the SF **integers are identical** (orientable ker=1, frustrated ker=0 → SF=1) — `SF=Δker` reads connectivity/orientability, not cycle length, so it is **representative-independent**. Only the descriptive `minEig` differs (length-dependent), and `minEig` is not the sealed observable. The build used the *more faithful* representative (the committed grounding's loop); the match is on the sealed SF pattern. The representative-independence is a robustness property, not a mismatch.

## Non-circularity (F3) + no-spurious-flow (F5) — verified in code + re-run
- **F3 non-circular:** `homotopyCrossing(graph, edgeSigns, seamEdgeIndices, steps)` takes **no** `Δker`, **no** `perCycleW1`; `netCrossing` is counted from the `spectrumReadout` eigenvalue **trajectories alone** (seam weight `0→1`); `Δker` is computed **separately** from the committed endpoint forms; they agree by **PSD homotopy-invariance**, not by assignment. The device `weightedSignedLaplacian` is byte-identical to the committed `signedLaplacian` at weights=1 and never enters the SF value. Pinned to the frustration-close (`#newSites=0`), not a site-add.
- **F5 no spurious flow:** the orientable `ambo` site-add jumps `4→6` sites but ker stays `1→1` → SF=0. The dimension jump is not flow.

## Additive + custody
The SF build added two **new** files (`spectralFlowV0.ts` +114, `diagnose-spectral-flow.cjs` +269); no committed module changed; `SF_ZERO_TOL=1e-9` (the committed value, zero knobs); ambo Shape byte-identical; `tsc -b` exit 0; no regression. My prediction-seal custody intact (`88759ebe`); the engineer's build-integrity seal (`a07c5424`) held.

## The seal — revealed (blind run complete; pre-registration → result closed)
`SF_SEAL_CANONICAL.txt` (sha256 `88759ebe…`, derived `/tmp/sf` on the committed `signedLaplacian`): `SF = dim ker(L_U^parent) − dim ker(L_U^child)`; stage0 tree ker=1; BIRTH A (orientable site-add) SF=0; BIRTH B (frustrated close) ker=0, SF=1; PATH=1; CONTROL B′=0; IDENTITY=0; Z/2 shadow `SF mod 2 = w₁`; convention-independence (one lift).

## What it means
Both of the connection's invariants are now **built**: holonomy (the witness — the loop/`w₁` reading, ADR 0015) **and** spectral flow (the second arrow — the integer SF along births, this). The spectral picture (ADR 0012/0013) is fully realized in code: the topological arrow is the time, the spectral reading along it is the field, `w₁` is the Z/2 shadow, and SF is the integer it shadows — all on the committed operator, parameter-free, no `ψ` instrument, no new law (LABEL). **The merge's spectral half is closed.**

## Status
Built + ratified 2026-06-30 (commit `8781847`). Canon: **ADR 0016** + CONTEXT. The merge's two arrows — holonomy and spectral flow — are both built.

# 0016 — The second arrow is built: the spectral flow SF of the genealogy, realized in code

Status: **Accepted** — ratified by mothership unseal, 2026-06-30. Realizes ADR 0012/0013 (the spectral column; the second arrow = spectral flow of the genealogy); parallel to ADR 0015 (the witness fired).

## Context
ADR 0013 identified the second arrow as the **spectral flow of the genealogy** — the integer the Z/2 `w₁` shadows — but canonized it, did not build it. The connection `U` has two complementary law-invariants: **holonomy** (the loop / `w₁` reading, built as the witness — ADR 0015) and **spectral flow `SF`** (the open-path / integer reading along births). This ADR records `SF` realized in code, blind against a researcher-sealed prediction.

## Decision (the result)
**The second arrow is built.** `SF(birth) = dim ker(L_U^parent) − dim ker(L_U^child)` on the committed `signedLaplacian` (`src/lib/spectralFlowV0.ts`, committed `8781847`). The blind runner was re-run and unsealed by the mothership against the held prediction (`88759ebe`); the whole pattern matched:
- `SF=0` on the orientable site-add (the dimension jump is not flow — **F5**);
- `SF=1` on the frustrated `w₁=1` close (one covariant-constant zero mode lifts);
- additive along the path (`Σ SF = ` endpoint `Δker`);
- `SF=0` on the orientable close and the identity (non-birth);
- `SF mod 2 === ` the committed `w₁` (the second arrow shadows the first — **F2**);
- convention-independent: `SF = Δker = ` the coupling-in crossing count, by PSD homotopy-invariance (**F3, non-circular** — the crossing count reads the eigenvalue trajectories, never `Δker` or `perCycleW1`).

**PSD is the lever:** `L_U ⪰ 0`, so the only flow through 0 is the kernel, and the net flow is the endpoint `Δker` — well-posed across a dimension-changing birth.

## Consequence
Both of the connection's invariants are now built — holonomy (ADR 0015) and spectral flow (this). The spectral picture (ADR 0012/0013) is fully realized: the topological arrow is the time, the spectral reading along it is the field, `w₁` is the Z/2 shadow, and `SF` is the integer it shadows — all on the committed operator, parameter-free, no `ψ` instrument, no new law (LABEL). The merge's spectral half is closed.

## Notes (not open issues)
- **Representative basis:** the build measures `SF` on the real 6-site `X_K` loop (frustrated `minEig = 2−√3`); the seal's illustrative example was a 5-cycle (`minEig = 0.382`). The SF integers are identical — `SF=Δker` is representative-independent (connectivity/orientability, not length), verified by the mothership. Only the descriptive `minEig` differs. A robustness property.

## Provenance
Seal-before-build (off-repo `SF_SEAL_CANONICAL.txt`, on-repo hash `88759ebe`), blind run, cross-office audit (engineer PASS; F3/F5 verified by module-read), mothership ratification by independent re-run + line-by-line unseal + representative-independence check. Additive: two new files, no committed-module edit, `tsc -b` clean. Full record: `docs/governance/PLATONIC_ENGINE_MOTHERSHIP_RATIFICATION_SECOND_ARROW_BUILT.md`.

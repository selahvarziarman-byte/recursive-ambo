# 0007 — A stratum is the canonical component; the through-pairing is a deferred named policy (GSR generalized)

Resolves the open question of ADR 0006. **Does the orientation sign fix the through-pairing at a junction? No — never.** Because flip-glue is legal, every one of the `(d−1)!!` sheet-matchings is a legal threading; the sign only stamps each pair preserving/reversing (its fold-count), it never selects. Even demanding every crossing orientation-preserving leaves `(d/2)! > 1` for d ≥ 4, and `0` when the signs are unbalanced.

Verified independently (enumeration): perfect matchings `(d−1)!!` = 3 / 15 / 105 for d = 4 / 6 / 8; preserving-only `(d/2)!` = 2 / 6 / 24; the d=4 fold-distributions are `{0 folds: 2, 2 folds: 1}` for signs (+,+,−,−) and `{1 fold: 3}` for (+,+,+,−). The sign settles **faithfulness**, never the **choice**.

## Decision

```txt
A STRATUM = a canonical component — a maximal connected MANIFOLD piece, walled off by junctions
            (the post-identification link cut at its junction loci). GlueCoh delivers it directly:
            POLICY-FREE, free at the base. The junction is a WALL; a stratum stops there.
THREADING a stratum THROUGH a junction = a separate, OPTIONAL re-assembly carrying a real policy:
            the (d−1)!! sheet-matching, which the sign leaves genuinely open.
```

## The three layers (and the literal mirror)

```txt
(1) canonical strata      — walled manifold pieces            — GlueCoh, policy-FREE        [mirrors atomic incidence]
(2) orientation sign      — w₁ on strata, fold-sign on pairs  — the signed pull-back, FAITHFUL DATA
(3) named through-pairing  — the (d−1)!! sheet-matching         — DEFERRED named policy        [= GlobalSquareResolution, generalized]
```

The through-pairing **is** `GlobalSquareResolution`, one valence up: the square's diagonal-choice is a named global matching policy (pyritohedral = 2 matchings); the junction's through-pairing is a `(d−1)!!`-way sheet-matching by the **same** named-policy architecture — **not new code**, GSR reused at valence d. The sign rides on layer (1) as faithful data; it does not dissolve layer (3). The two are orthogonal — exactly as `Coh□`'s candidate-apexes are local data and `GlobalSquareResolution` is the named choice.

## Charter shape (unblocks the build the mothership was holding)

```txt
- Build GlueCoh strata (1) + the signed pull-back (2) in ONE stroke — both faithful, both policy-free (nothing chosen).
- Defer the through-pairing (3) as a named policy, built as GlobalSquareResolution reused at valence d — not a new family.
- Operations stay GATED — this is a certifier / decomposer upgrade, not the shape-mutating ops.
```

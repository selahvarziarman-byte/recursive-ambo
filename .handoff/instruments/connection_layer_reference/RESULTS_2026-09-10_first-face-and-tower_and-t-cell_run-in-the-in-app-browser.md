# RESULTS — `first_face_and_tower` and `t_cell_derived_check`, first run (2026-09-10)

**Run of record:** a line-by-line JavaScript port of both instruments, executed in the in-app browser pane (`javascript_tool`, origin `https://example.com`), because the sandbox shell failed to mount identically on every attempt of the day (Plan9 share `c`), before and after Arman's app restart. **The Python files remain the instruments; they are still owed a sandbox run. The port is an independent implementation, which is worth more than a re-run: every number below was reached by a second hand.** Raw tool returns are quoted; nothing is transcribed by memory.

## 1 · The hand candidates under the three-valued rule
```
A : ADMISSIBLE weight 4 exposure 2 tau {sustains→presupposes, outlasts→exceeds-in-speed}
B : ADMISSIBLE weight 2 exposure 3 tau {sustains→releases, answers-to→presupposes}      ← the role-map survives at weight 2 under ANOTHER translation;
                                                                                        the hand pairing (sustains→generates) is refused by ¬sustains(r8,r0) vs generates(F2,F5)
B': ADMISSIBLE weight 4 exposure 2 tau {sustains→generates, answers-to→presupposes}
C : ADMISSIBLE weight 4 exposure 3     D : ADMISSIBLE weight 4 exposure 2     E : ADMISSIBLE weight 4 exposure 3
P : ADMISSIBLE weight 4 exposure 1 tau {sustains→specifies, outlasts→component-of, individuates→displaces, starts→transmits}
P5: REFUSED weight 0 (member-status: r7 has vs Φ9 none-by-nature)
Q : ADMISSIBLE weight 4 exposure 2     R : ADMISSIBLE weight 4 exposure 5
```

## 2 · The exhaustive candidate search (bound-pruned where marked; pruning never excludes a combo that could reach the recorded maximum)
```
T–Φ :  |J|=2 best 1 · |J|=3 best 2 · |J|=4 best 3 (635,040 injections) · |J|=5 best 4 (3,810,240) · |J|=6 best 4 (bound≥5 combos only) · |J|=7: no weight ≥5 in the combos examined (28 of 120; stopped) ⇒ MAX 4, and a hand proof that 5 is unreachable (r0≡Φ1 forces the chain to fail; other anchors admit ≤2 in-edges).
T–Flow: |J|=2 best 1 · |J|=3 best 2 · |J|=4 best 3 (5,045,040, exhaustive) · |J|=5 best 4 (exhaustive for ≥4) ·
        |J|=6 best 5 — FOUR candidates (exhaustive over the 11 combos with bound ≥5):
   S1  r0≡F13 r1≡F9 r2≡F1 r4≡F12 r6≡F3 r8≡F7   τ sustains→presupposes · outlasts→exceeds-in-speed · individuates→generates · starts→releases   exposure 6
   S4  r0≡F13 r1≡F9 r2≡F1 r6≡F3 r7≡F5 r8≡F7   τ sustains→presupposes · outlasts→exceeds-in-speed · starts→releases · answers-to→generates      exposure 4
   S2  r0≡F9 r1≡F3 r2≡F13 r6≡F10 r7≡F5 r8≡F12  τ sustains→generates · outlasts→releases · starts→presupposes · answers-to→precedes           exposure 6
   S3  = S2 with r6≡F11  — F10/F11 are Flow's automorphic twins: S2 ≡ S3 under Aut(Flow). ONE candidate up to gauge.
        |J|=7, weight ≥6: brute force started (2 of 70 slices, none found) and stopped for time; weight 6 EXCLUDED by case analysis
        (the only Flow role with three distinct-typed in-edges from three distinct sources is F13; with r0≡F13 the seventh instance
        — sustains(r9,r1) or answers-to(r1,r7) — has no image; with two in-edges the total is ≤4). ⇒ MAX 5.
```
**⇒ The hand search's "maximum weight 4" on T–Flow was WRONG (it never tried F13 as the anchor of r0). The instrument's maximum is 5, in two families — the F13 family (S1, S4) and the F9 family (S2 ≡ S3) — three candidates up to gauge.** The T–Φ and Flow–Φ maxima (4) stand.

## 3 · Residues at base Flow (Flow → T → Φ → Flow), Fix · Mov · Und, cycle–path type — the seven hand combinations
```
(i)+A+P : Fix [] Mov [F7→F8, F1→F7, F12→F5] Und [F8, F13]        type cycles [] paths [0,1,2]
(i)+A+Q : Fix [F7] Mov []               Und [F8, F1, F12, F13]  type cycles [1] paths [0,0,0,0]
(i)+A+R : Fix [] Mov [F1→F7, F12→F5]    Und [F8, F7, F13]       paths [0,0,1,1]
(ii)+A+P: Fix [] Mov [F7→F2, F1→F5]     Und [F8, F12, F13]      paths [0,0,0,1,1]
(i)+D+P : Fix [F5] Mov [F1→F8, F2→F7]   Und [F12, F7]           cycles [1] paths [0,1,1]
(i)+C+P : Fix [] Mov [F13→F8, F9→F7, F3→F5] Und [F12, F1]       paths [0,0,1,1,1]
(i)+B'+P: Fix [] Mov [F9→F8, F5→F7, F7→F5] Und [F3, F13, F1]    cycles [2] paths [0,0,0,1]
MEET over the seven: {}   (= 0)
```
**All seven agree with the hand table exactly.**

## 4 · Residues under the weight-5 candidates (18 triples)
```
(i)+S1+P : Mov [F13→F7, F9→F8, F1→F5]  Und [F12, F3, F7]  paths [0,0,1,1,1]  cone-deficit 3
(i)+S1+Q : Mov [F9→F7, F3→F8]          Und [F13, F1, F12, F7]                cone-deficit 2
(i)+S1+R : Mov [F13→F7, F1→F5]         Und [F9, F12, F3, F7]                 cone-deficit 2
(ii)+S1+P: Mov [F13→F5, F9→F2, F3→F1]  Und [F1, F12, F7]                     cone-deficit 3
(ii)+S1+Q: Mov [F9→F5, F3→F2]          … cone-deficit 2      (ii)+S1+R: Mov [F13→F5] … cone-deficit 1
(i)+S4+P : Mov [F13→F7, F9→F8, F1→F5]  Und [F3, F5, F7]   cone-deficit 3      (the S4 rows otherwise as S1 with F5 in place of F12)
(i)+S2+P : Mov [F9→F7, F3→F8, F13→F5]  Und [F10, F5, F12] cone-deficit 3      (ii)+S2+R: Mov [F9→F5] … cone-deficit 1
MEET over the 18: {}   (= 0)
```
No cycles anywhere in the S-family; every residue is paths only; no fixed points.

## 5 · The tower at generation 1, branch (i)
For all 25 triples: **corner triangle flat: true · medial triangle = h: true (exact)**. Face colimit sizes 19–21; **cone-deficit at Flow = |R_Flow| − |R_Flow / ∼| = 3 under (i)+A+P and (i)+S1+P**, 0 under (i)+A+Q, 1–3 elsewhere as listed.
⚠ Correction to the Python file's tower check: it walked the medial triangle `M_AB → M_CA → M_BC → M_AB`, which yields `h⁻¹`; the port walks `M_AB → M_BC → M_CA → M_AB` and reproduces `h`. The Python is amended to match. ⚠ The cone-deficit is **per corner: `|R_v| − |image of R_v in the face colimit|`**, not `|edge-amalgam| − |face colimit|` (which is 0 whenever no role returns unchanged — the loop's transitive identifications are already counted in the independent tally); ADR 0031 §3.3 and the fork ruling are amended.

## 6 · The T cell's derived check
```
closed-world |Aut| = 1                                   (the caster's "rigid")
open-world admissible envelope = 1,947,624 of 3,628,800  (53.7 %); every role, r0 and r1 included, is moved by some admissible permutation
   examples: r8↔r9 · r7↔r9 · r6↔r7 · (r6 r7)(r8 r9) · r6→r7→r9→r8→r6
envelope with `universality: n-substrate` read as a TYPE = 13,440   (a 145× shrinkage — individuation by how much was READ)
```
**All sealed expectations met.**

## 7 · What this changes
- **ADR 0031 §4 reopens at one clause** (per the mothership's kill-condition): T–Flow's maximum candidate weight is **5**, not 4, at `|J| = 6`, in two families, three candidates up to gauge. The seven hand combinations, the meet (`0`), the tower check, and the T-cell numbers are confirmed. The weight-favoured triple is now `(i)+S1+P` (or its family), whose residue is `(F13→F7→⊥)(F9→F8→⊥)(F1→F5→⊥)(F12→⊥)(F3→⊥)` — three 1-paths, no cycle — with cone-deficit 3 at Flow. *(What those identifications SAY about flows is the person's reading, printed by the device in the casts' own labels; it is not this seat's finding and is not recorded here.)*
- The structural claim of §3.6 sharpens rather than weakens: on T–Flow, structure DOES separate a top family (weight 5 over weight 4), though not to one candidate; the meet across all admissible triples remains `0`.

## 8 · SECOND RUN — the Python files themselves, natively on Arman's machine (Desktop Commander, PowerShell; Python 3.12.10; `git rev-parse --short HEAD` = `1b24e7f`; clock `Thu Sep 10 12:51:53 +03:30 2026`)
`first_face_and_tower.py` → `RESULTS_2026-09-10_first_face_and_tower_PYTHON-on-Armans-machine.txt`; `t_cell_derived_check.py` → `RESULTS_2026-09-10_t_cell_derived_check_PYTHON-on-Armans-machine.txt` (both beside this file, verbatim stdout). **Every number agrees with §§1–6 above:** the thirteen hand candidates (S1/S4/S2 at weight 5); all 25 residues, cycle–path types and the meet `{}`; the tower — corner flat, medial = `h` — in all 25; the cone-deficits; the searches to `|J| ≤ 4` exhaustive (1 · 2 · 3) and `|J| = 5` sampled (4) on both edges; the T cell — closed-world `|Aut| = 1`, open-world envelope `1,947,624`, the same movers and examples, the envelope `13,440` with the substrate-count as a type. **The Python additionally lists the unrecorded slots the envelope relies on most — all `sustains` pairs involving `r8` (`sustains(r0,r8)`: 93,336 permutations; `sustains(r6,r8)`: 81,312; `sustains(r0,r6)`: 79,992; …) — the mold's promised reading of which declarations would gauge-fix the corner; carried to the T seat as structure, not as advice about T.**

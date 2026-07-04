// level3Homology — Build 2 Tier-3: integer homology with torsion (Smith normal form).
//
// GENUINELY NEW integer machinery (grep-confirmed by the engineer: no committed
// Smith-normal-form / integer homology exists; the committed `globalW1` is
// GF(2)-only — its b₁ is a Z/2 Betti number and torsion is invisible to it).
//
//   smithNormalForm — exact integer SNF with the divisibility normalization
//   (d₁ | d₂ | … — the canonical invariant factors). Plain JS numbers ARE exact
//   integers below 2^53; the complexes here are tiny (≤ dozens of cells with
//   entries in {−2…2}), so overflow is out of reach — asserted by a magnitude
//   guard rather than hoped.
//
//   computeIntegerHomology — Hₖ = Z^{bₖ} ⊕ ⊕ᵢ Z/dᵢ with
//     bₖ = dim ker ∂ₖ − rank ∂ₖ₊₁ = (nₖ − rank ∂ₖ) − rank ∂ₖ₊₁,
//     torsion(Hₖ) = the invariant factors of ∂ₖ₊₁ that exceed 1.
//
// π₁ is NOT computed (undecidable) — callers expose H₁ as its abelianization,
// honestly labelled (the façade does).

const OVERFLOW_GUARD = Number.MAX_SAFE_INTEGER / 4;

export interface SmithNormalFormResult {
  diagonal: number[]; // the invariant factors d₁ | d₂ | … (positive), zeros excluded
  rank: number;
}

export function smithNormalForm(matrix: number[][]): SmithNormalFormResult {
  const rows = matrix.length;
  const cols = rows > 0 ? matrix[0].length : 0;
  const a = matrix.map((row) => [...row]);
  const guard = (): void => {
    for (const row of a) {
      for (const value of row) {
        if (!Number.isInteger(value)) throw new Error('smithNormalForm: non-integer entry');
        if (Math.abs(value) > OVERFLOW_GUARD) throw new Error('smithNormalForm: entry magnitude beyond the exact-integer guard');
      }
    }
  };
  guard();

  const swapRows = (i: number, j: number): void => {
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  };
  const swapCols = (i: number, j: number): void => {
    for (const row of a) {
      const t = row[i];
      row[i] = row[j];
      row[j] = t;
    }
  };

  let t = 0;
  while (t < rows && t < cols) {
    // pivot: the smallest nonzero |entry| in the trailing block
    let pi = -1;
    let pj = -1;
    for (let i = t; i < rows; i += 1) {
      for (let j = t; j < cols; j += 1) {
        if (a[i][j] !== 0 && (pi === -1 || Math.abs(a[i][j]) < Math.abs(a[pi][pj]))) {
          pi = i;
          pj = j;
        }
      }
    }
    if (pi === -1) break; // trailing block all zero
    swapRows(t, pi);
    swapCols(t, pj);

    let dirty = true;
    while (dirty) {
      dirty = false;
      // clear the pivot column
      for (let i = t + 1; i < rows; i += 1) {
        if (a[i][t] === 0) continue;
        const q = Math.trunc(a[i][t] / a[t][t]);
        for (let j = t; j < cols; j += 1) a[i][j] -= q * a[t][j];
        if (a[i][t] !== 0) {
          swapRows(t, i); // strictly smaller remainder becomes the pivot
          dirty = true;
        }
      }
      // clear the pivot row
      for (let j = t + 1; j < cols; j += 1) {
        if (a[t][j] === 0) continue;
        const q = Math.trunc(a[t][j] / a[t][t]);
        for (let i = t; i < rows; i += 1) a[i][j] -= q * a[i][t];
        if (a[t][j] !== 0) {
          swapCols(t, j);
          dirty = true;
        }
      }
      if (dirty) continue;
      // divisibility normalization: the pivot must divide every trailing entry
      let done = true;
      for (let i = t + 1; i < rows && done; i += 1) {
        for (let j = t + 1; j < cols && done; j += 1) {
          if (a[i][j] % a[t][t] !== 0) {
            for (let jj = t; jj < cols; jj += 1) a[t][jj] += a[i][jj]; // fold the offending row in
            done = false;
            dirty = true;
          }
        }
      }
    }
    if (a[t][t] < 0) {
      for (let j = t; j < cols; j += 1) a[t][j] = -a[t][j];
    }
    guard();
    t += 1;
  }

  const diagonal: number[] = [];
  for (let i = 0; i < Math.min(rows, cols); i += 1) {
    if (a[i][i] !== 0) diagonal.push(Math.abs(a[i][i]));
  }
  return { diagonal, rank: diagonal.length };
}

export interface HomologyGroup {
  free: number; // the Z-rank
  torsion: number[]; // the Z/dᵢ summands (each dᵢ > 1), in invariant-factor order
  pretty: string; // e.g. "Z^3", "Z ⊕ Z/2", "0"
}

export interface IntegerHomology {
  H0: HomologyGroup;
  H1: HomologyGroup;
  H2: HomologyGroup;
  H3: HomologyGroup;
  ranks: { d1: number; d2: number; d3: number };
  torsionFree: boolean;
}

function group(free: number, torsion: number[]): HomologyGroup {
  const parts: string[] = [];
  if (free === 1) parts.push('Z');
  else if (free > 1) parts.push(`Z^${free}`);
  for (const d of torsion) parts.push(`Z/${d}`);
  return { free, torsion, pretty: parts.length ? parts.join(' ⊕ ') : '0' };
}

// Chain ranks nₖ and the boundary matrices ∂ₖ: Cₖ → Cₖ₋₁ (rows = (k−1)-classes).
export function computeIntegerHomology(
  n: { n0: number; n1: number; n2: number; n3: number },
  d1: number[][],
  d2: number[][],
  d3: number[][],
): IntegerHomology {
  const s1 = smithNormalForm(d1);
  const s2 = smithNormalForm(d2);
  const s3 = smithNormalForm(d3);
  const torsionOf = (s: SmithNormalFormResult): number[] => s.diagonal.filter((d) => d > 1);

  const H0 = group(n.n0 - s1.rank, torsionOf(s1));
  const H1 = group(n.n1 - s1.rank - s2.rank, torsionOf(s2));
  const H2 = group(n.n2 - s2.rank - s3.rank, torsionOf(s3));
  const H3 = group(n.n3 - s3.rank, []); // no ∂₄
  const torsionFree = [H0, H1, H2, H3].every((h) => h.torsion.length === 0);
  return { H0, H1, H2, H3, ranks: { d1: s1.rank, d2: s2.rank, d3: s3.rank }, torsionFree };
}

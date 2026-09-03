// cornerCycleName — THE ONE COMPOSER of a corner cycle's name (D14: start at
// the alphabetically-first corner, run in the cycle's own direction — a
// ROTATION, never a reversal; a reversed cycle is a flipped face), lifted
// into the FROZEN lib layer so a frozen producer may compose at the act.
//
// WHY THIS FILE EXISTS (A-3b, 2026-09-03): the dualization mint must write a
// dual vertex's derived reading — the primal face's COMPOSED name — and the
// composer lived in the unfrozen manuscript layer. A frozen file importing an
// unfrozen one breaks the freeze's IMPORT CLOSURE (§8's falsifier, caught by
// diagnose-the-small-run at e330084 — and pushed past by a broken gate, the
// confession is in the record). The rotation + join now live HERE, frozen;
// apertureModel's faceDisplayName / faceReferenceName delegate to it, so
// there is still exactly ONE composer — two readers cannot disagree.
//
// THE CONTRACT: labels are the cycle's corner names in cycle order; a null
// (or empty) entry is an ABSENT corner. The composer returns null for any
// absence — never a word for it — and each register wraps that its own way:
// the name slot prints its lawful absence word ('unnamed', apertureModel);
// a record mint writes TRUE ABSENCE ('', the sibling mints' idiom). The
// 1555 split, honoured by construction: one composer, two wrappers.

export function d14NameRotation(labels: string[]): number {
  let best = 0;
  for (let k = 1; k < labels.length; k += 1) {
    for (let i = 0; i < labels.length; i += 1) {
      const a = labels[(best + i) % labels.length];
      const b = labels[(k + i) % labels.length];
      if (b < a) {
        best = k;
        break;
      }
      if (a < b) break;
    }
  }
  return best;
}

export function composeCornerCycleName(labels: ReadonlyArray<string | null>): string | null {
  const present: string[] = [];
  for (const label of labels) {
    const trimmed = typeof label === 'string' ? label.trim() : '';
    if (trimmed.length === 0) return null;
    present.push(trimmed);
  }
  if (present.length === 0) return null;
  const best = d14NameRotation(present);
  return present.map((_, i) => present[(best + i) % present.length]).join('·');
}

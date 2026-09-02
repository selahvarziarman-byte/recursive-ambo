// refusalCopy — STAMP C-1 item 3: THE ESCAPED-FIELD CLASS, cured as a class.
//
// Her law, bought at three sites in two days: *the field is the draft, the
// sentence is the cure, and both shipped* — a lib reader's refusal sentence
// carries a machine half (the module's own prefix, `entity "namespaced:id"`
// dress, stray quotes) beside genuinely person-shaped copy ("an isolated
// vertex carries no angle and no clause"), and the card printed BOTH. The
// lib sentences are correct AS LIB ERRORS (throws, logs — provenance for a
// debugger); the violation is the card seam that forwards them verbatim
// into a person's VALUE column. So the cure lives HERE, at the seam — the
// frozen producers stay byte-untouched — and it cures the CLASS: every
// refusal that reaches a card row passes through this one filter.
//
//   · the module prefix (`conformalAtom: `) is dropped — provenance belongs
//     to the log, never to the person's sentence;
//   · `entity "ns:…:tail"` reads as `the entity tail` when the tail is an
//     address a person can use (v0, p1 — the reference law's honest address
//     grain), and as the bare entity word when the tail is positional junk
//     (`…:4-gon:0` → "the face") — individuation where it exists, never a
//     namespace in prose, never a stray quote;
//   · everything after the machine half — the copy the designer praised —
//     rides through untouched.

/** the card-grade reading of a lib refusal — the sentence, without the field. */
export function personReadableRefusal(refusal: string): string {
  let s = refusal.trim();
  // (a) the leading module prefix (one word + colon + space)
  s = s.replace(/^[a-z][a-zA-Z0-9]*:\s+/, '');
  // (b) the quoted-id dress on a named entity
  s = s.replace(/\b(vertex|face|edge|corner|cell|atom)\s+"([^"]*)"/g, (_whole, entity: string, id: string) => {
    const tail = id.split(':').pop() ?? '';
    return /^[a-zA-Z]/.test(tail) && tail.length <= 12 ? `the ${entity} ${tail}` : `the ${entity}`;
  });
  return s;
}

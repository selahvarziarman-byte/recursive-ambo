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

// STAMP A-4 item 2 — THE SEAM CARRIES CHECKED SENTENCES (the fourth
// designer's law: filtering a machine prefix does not make the remainder
// copy). The three conformalAtom refusals a card can meet are mapped, whole,
// to their researcher-checked forms — OWNED kept (the metric arc's
// load-bearing word), the reroute tail dropped (B-103 §2b), and the
// isolated-vertex sentence obeying the QUANTIFIER law: it names NONE (the
// lib throws at the first vertex it meets; a Segment has two — an address
// would individuate what the fact does not). Anything unmatched falls to
// the generic field-strip below. The frozen throws stay byte-untouched.
const CHECKED_SENTENCES: ReadonlyArray<[RegExp, string]> = [
  [/^conformalAtom: face "[^"]*" carries no cornerAngles — the atom is not owned yet \(stamp at the invocation seam first; nothing is fabricated\)$/,
    "this face's corner angles are not owned yet — nothing is fabricated"],
  [/^conformalAtom: pillar "[^"]*" carries no owned dihedral in any cell — the atom is not owned yet \(stamp at the thicken seam first; nothing is fabricated\)$/,
    "this edge's dihedral is not owned yet — nothing is fabricated"],
  [/^conformalAtom: vertex "[^"]*" has no incident face corner — an isolated vertex carries no angle and no clause$/,
    'there is a vertex here with no face corner — an isolated vertex carries no angle and no clause'],
];

/** the card-grade reading of a lib refusal — the sentence, without the field. */
export function personReadableRefusal(refusal: string): string {
  const trimmed = refusal.trim();
  for (const [pattern, sentence] of CHECKED_SENTENCES) {
    if (pattern.test(trimmed)) return sentence;
  }
  let s = trimmed;
  // (a) the leading module prefix (one word + colon + space)
  s = s.replace(/^[a-z][a-zA-Z0-9]*:\s+/, '');
  // (b) the quoted-id dress on a named entity
  s = s.replace(/\b(vertex|face|edge|corner|cell|atom)\s+"([^"]*)"/g, (_whole, entity: string, id: string) => {
    const tail = id.split(':').pop() ?? '';
    return /^[a-zA-Z]/.test(tail) && tail.length <= 12 ? `the ${entity} ${tail}` : `the ${entity}`;
  });
  return s;
}

// STAMP A-4 item 3 — THE FOURTH FIELD SITE: the loaded form's provenance
// subtitle is minted in the frozen genesisModel as
// `loaded — universe “shape:multiform:w2:6-gon” (source-tagged, not a doorway)`
// — a raw namespaced id at the SUBTITLE seam, which the refusal filter never
// covers. Same law, same cure: the id stays a machine handle; the person
// hears a sentence. The invoked form's own subtitle (`invoked primitive
// (right-click on paper)`) is the model. The designation comes from the
// shelf's S2 split (source → sourceName) when the file carried one; an
// address never enters prose. Anything unmatched rides through verbatim.
const LOADED_PROVENANCE = /^loaded — universe “([^”]*)” \(source-tagged, not a doorway\)$/;

/** the card-grade reading of a form's provenance line — a sentence, never an address. */
export function personReadableProvenance(provenance: string, sourceNameBySource: ReadonlyMap<string, string>): string {
  const m = LOADED_PROVENANCE.exec(provenance.trim());
  if (!m) return provenance;
  const name = sourceNameBySource.get(m[1]);
  return name ? `loaded from the universe “${name}”` : 'loaded from a universe file';
}

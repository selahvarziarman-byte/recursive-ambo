// feet — C-12b (§145; the mothership's §147 MARKER; ADR 0031 §3.10): THE NAME OF A FOOT'S RELATION-TYPE.
//
// A born concept M⁺_AB carries, per opposite corner X of a face holding the edge A–B, one binary relation-type `≡_X`
// on its points — "named by its warrant" (§147). This leaf holds the one spelling of that name and its test, so the
// resolver (which composes the feet) and the inside builder (which keeps them out of the drawing's glyphs — the
// designer's 1939: the foot is WORDS) agree by construction and neither imports the other. The name reads in the word
// rows at the next generation as a foreign word (`≡_D [AB]` beside `≡_D [AC]` under the lone-name bracket rule).

export const FOOT_PREFIX = '≡_';

/** the relation-type's name for the foot warranted by the corner with this label */
export const footTypeName = (cornerLabel: string): string => `${FOOT_PREFIX}${cornerLabel}`;

/** whether a signature type is a foot's (a caster's own word never begins `≡_` — said in the report, not enforced) */
export const isFootType = (type: string): boolean => type.startsWith(FOOT_PREFIX);

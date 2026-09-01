// designation — THE DESIGNATION COMPOSER (B-133 clause A; researcher ruling
// STAMP R-1 Q1: the identification of N named things is an IDENTIFIED CLASS
// whose designation is COMPOSED from its members' designations, presence-first,
// through the carried lineage — "the machine composes addresses and forgot to
// compose designations"). ONE composer for every quotient mint
// (materializeOperation · complexIdentification · patchLift): the same walk as
// the minted id's `~`-join, resolving designations instead of addresses, in
// the SAME member order — the k-th designation names the k-th member of the
// id's own join, so the composition is decomposable AND attributable.
//
// PRESENCE-FIRST (the ratified producer law, B-133): the composition exists
// exactly when EVERY member carries a positive name; any unnamed member ⇒
// TRUE ABSENCE ('' — the packet's ruled absence value, B-2026-08-23-A), with
// the full membership still carried on `createdBy.sourceVertexIds` for
// whatever display ruling the partial case receives. A BARE partial (an
// unmarked hole) is forbidden — D14's guard — and a hole-MARKED partial would
// mint a hole glyph, which is a display call, not a producer's.
//
// D14-SEPARATED: `·` joins members — a composed designation must be
// DECOMPOSABLE by its reader; the separator is what makes a composition
// readable as one (the Ambo's bare join is the ruled counter-example).

export function composeDesignation(memberLabels: readonly (string | undefined)[]): string {
  const trimmed = memberLabels.map((label) => (typeof label === 'string' ? label.trim() : ''));
  return trimmed.every((label) => label.length > 0) ? trimmed.join('·') : '';
}

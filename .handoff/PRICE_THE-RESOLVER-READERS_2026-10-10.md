# THE PRICE — the resolver's remaining born-corner readers (ADR 0031 §9.46; the mothership's letter of 17:46, "PRICE, not build")

Surveyed read-only by seven readers, one per group, at HEAD `4f69d69`/`d16d76c` (src unchanged between them); each site cited by file and line, its kind under §9.46, and a recommendation: MOVE to the child (which reader) or RETIRE by name. Every behavioural claim is marked by the reader as run (a node probe in the scratchpad, nothing written to the repo) or inferred from source. Hours are the readers' estimates; the coder's estimates have run high (F and G: 2 h of 4).


## THE NEXT PUSHOUT: the resolver gluing a generation-2 (and later) born vertex from its two parents' resolved spaces (spaceOf's born branch recursing into born parents), plus every reader of that glued space at generation ≥ 2: the midpoint surface's parents and resolved props, parents[i].space, the nameFrom/nA/nB/nX fallbacks to the merged space, the composed J (composedOn) and the checks built on it.

**Estimate: about 18 h.**

This was a read-only survey at HEAD 4f69d69. I read the source and ran nothing, so every behavioural claim is ⚠ inferred, not run.

**What the group covers.** The next pushout is spaceOf's born branch (src/lib/spaceOf.ts:561-620) recursing into born parents at 565-566. Around it sit the composed J on every non-seed edge (composedOn and its arms, 343-490; every such J belongs to a midpoint of generation 2 or later), namingOf (505-547) and brokenBornActs (698-753). I found 28 src sites that read it, in 8 files:
- spaceOf.ts, relatings.ts, bornFace.ts and respects.ts are NOT_FROZEN (rows 219, 241, 220, 239).
- geometryStore.ts, MidpointSurface.tsx, CastInsideDiagram.tsx, Panels.tsx and App.tsx are outside the manifest's engine roots.
- No frozen file is touched.

D19's surviving pushout is identificationImageModel.ts's own: it imports only nameIn and the Resolved type from spaceOf.ts, and no src caller passes spaceOf an image record. So nothing ruled still needs spaceOf at a vertex with a born parent.

**Order, in three slices:**
- **(A) Move the consumers off the pushout (about 5 h).** Most of this is value-identical:
  - the surface's kind (to edgeKind), roles/types (to recordOn, empty on a corner edge), loadedIgnored (to holdsLoadedCast), and the trace gate (no longer M);
  - the dead binding `composed` (MidpointSurface.tsx:418) is retired;
  - the merged-space name fallbacks (nameFrom/nA/nB, nX, neighbourActsOn, and the store's nameIn(A, …)) move to termWordsOf plus a decoder for leftover keys;
  - the gates move to the child: midpointViewOf, CastInsidePanel, SpaceCardRow, the store's resolvedEnds, and the light buttons;
  - the store's vertex-edit comparison (1229) runs at seeds only.
- **(B) Re-read the store's identity checks on the child (about 7 h; roughly 3 h of it is blocked on questions 1-3):**
  - the composed-pair refusal triggers on solidRefusal (coordinates);
  - the stone reads seed content by coordinate descent;
  - wordPairForm reads READ's words with their real arity;
  - refusalOf and the surface's record-in-conflict read the IS-part;
  - brokenBornActs is split by arm: membership is retired in favour of orphanedRelatings, the composed arm is retired, and the stone and contradiction arms move.
- **(C) Retire the recursion last (about 6 h).** spaceOf returns null at a vertex with a born parent. The gluing and composedOn are kept only as a named witness control that no src caller passes, pinned by a census of src. MidpointSurface's parents/resolved props are dropped, which means re-pinning the 13 witness files (about 18 mounts) that build them by hand. The-born-room §1-§3b is re-pointed to the control. The header comments and manifest row 219's text are corrected, since they still describe the gen-≥2 gluing as the vertex's space.

Slice C depends on the respects/feet group having moved or retired its gen-≥2 readings (resolved.core, respects and feet), because they ride on Resolved. It also depends on question 2: retiring the pushout without moving the stone would make gen-2 IS pairs between instances holding different roles of the shared corner takeable. The drive family's concept-layer eye is part of every slice that changes what a person sees.

**Findings ⚠ (read from source, not run):**
1. The word act at every gen-≥2 site is refused by its form check. The chips carry READ keys ('A:sustains'), but wordPairForm reads the pushout's display words. No witness exercises a word act at gen 2. Smallest falsifier: giveWordPair on AB–AC with 'A:sustains', then read the refusal's form.
2. The inspector card's M10 row 'none yet: AB holds no relating' cannot be reached at gen ≥ 2, because the resolver always resolves there; the card prints 'made of 0 relatings' while the view refuses to open.
3. The light buttons are gated on the pushout, so a born apex whose child holds nothing still offers a light that opens empty.
4. The store's '?? A' column fallback (geometryStore.ts:2308-2309) reads the glued space exactly when a born end's child is empty. A pair naming a leftover could then pass membership by a store call; only the view's gate prevents it by hand.
5. At gen 2 every lawful IS pair is refused before the J check is reached: the solid form takes pairs whose ends share a coordinate, and the stone takes the rest. So that check matters only from gen 3 on.

About 18 h in total.

### Sites

- **src/lib/spaceOf.ts:553-625: spaceOf's born branch (561-620), recursing into born parents at 565-566** — reads: The two parents through spaceOf. At a gen-2 vertex these are the gen-1 pushouts, and the read recurses at every generation. Then: composedOn (569), meetCoreOf (571), glue(U.space, V.space, composed ∪ born) with the disjoint-union fallback (573-577), namingOf (581), seed content (585-588), feetOf (594), respectLinksOf (602), the edge record {kind, parents, composed, born, refused, midpoint, wordName, glued} (614), and readRespects (617).
  - seen: Nothing directly. Every consumer below reads it: the midpoint view's gate and props, the inspector card, the inside panel, the store's act, and the names.
  - kind: Neither. This is the next generation's pushout as a space, which §9.46 (3) retires at born corners.
  - recommendation: RETIRE at any vertex with a born parent, and do it LAST, after sites 4-26 have moved. spaceOf should return null (a typed absence) there. Keep the gluing reachable only as a named witness control: an explicit option that no src caller passes, pinned by a census of src, the way meet:'content' is kept. Then the C-8/C-8b seal and the over-composition controls can still measure the identity regime against the child. The pushout that survives under D19 is identificationImageModel.ts's own: that file imports only nameIn and the Resolved type from spaceOf.ts, and grep finds no src caller that passes spaceOf an image record. Nothing visible disappears once the consumers have moved. The gen-≥2 respects and feet that ride on Resolved go with it, so their group must move or retire them first (site 23). In the same cut, correct the header (10-58) and the text of manifest row 219, which still describe the gen-≥2 gluing as the vertex's space. Pinned by: the-born-room §1-§3b and §5 L797 (import purity), the-midpoint L545-547, the-lift-carries L199/L218, the-stone L219.
  - freeze: NOT_FROZEN (manifest row 219)
- **src/lib/spaceOf.ts:343-490: composedOn and its arms (meetOf 343, cornersOf 361, contentMeet 379, coprojectionOf 390, carriedOn 406, remainingMeet 422, anchoredPairs 444, anchoredOn 471, composedOn 486)** — reads: The composed J on a non-seed edge, built from the ends' glued spaces. A corner edge takes the born end's coprojection, read off U/V.edge.midpoint. A medial edge takes the anchored meet over the shared parent's coprojections, then seed content. A corner edge's midpoint and a medial edge's midpoint are both gen ≥ 2, so every non-seed composed J belongs to a next pushout.
  - seen: Only through its readers: the glue (site 1), the store's act (sites 7, 8, 10), brokenBornActs (site 4), bornStepOf (site 27), and a dead binding in the surface (site 15).
  - kind: IDENTITY regime: the solid's over-composition beyond his pairings, which D12 amended forbids at a born corner.
  - recommendation: RETIRE from every src reader. Keep it exported only as the witness control behind site 1's option. modes1-the-descent §a L88-89, modes4 §h L530-586, the-doors-act L57, the-found-bugs L47, the-lift-carries L42 and the-born-room §2-§3b all import it as the over-composition control. Its gen-≥2 face that §9.46 keeps is D15's inherited IS, which is already a child instance (instanceSpace.ts inheritedISOn).
  - freeze: NOT_FROZEN (row 219)
- **src/lib/spaceOf.ts:505-547: namingOf (the names of the gen-≥2 glued roles and words)** — reads: U/V.roleSegs and wordSegs: the ≡-chains, the [corner] brackets, '(through AB)' for a doubled class, and '· <key>' as the last resort.
  - seen: Every name that sites 6, 13, 19 and 22 print at a born corner when they fall back to the merged space.
  - kind: Neither: these are names inside the retired space.
  - recommendation: RETIRE with site 1. Names at gen ≥ 2 come from termWordsOf: the child's sentence, or his name when his records are passed. Pinned by: the-born-room §4 L494 ('≡ is the person's act' at ABAC).
  - freeze: NOT_FROZEN (row 219)
- **src/lib/spaceOf.ts:698-753: brokenBornActs (called at geometryStore.ts:2383 and 2403, and in respects.ts:308's meet guard)** — reads: For every medial edge holding a born record: U and V via spaceOf at its born ends (the next pushout's parents); composedOn 'medial' (718: the gen-2 composed J); stoneOn (731, 743); refusalOf over the glued spaces (748); names via shownName and nameIn on the glued spaces.
  - seen: The dependency refusal box (MidpointSurface.tsx:893-903, data-midpoint-refusal-dependency): 'not taken — … would break the pair X ≡ Y at ABAC, one generation up: it needs … as its own role / it needs p apart from q, and this would make them one / it would then make c1 and c3 one … / it would then contradict itself: …'. Also the respects' 'held back' lines.
  - kind: IDENTITY (the dependency of IS acts: membership, composed identity, the stone, the J check).
  - recommendation: Split it by arm. Membership arm: RETIRE. orphanedRelatings (instanceSpace.ts:471) is child-based and already runs right after it in both store paths (2386, 2410). Composed-identity arm: RETIRE with the composed J; at the act, solidRefusal refuses the same pair from the child's coordinates. Stone arm: MOVE to an instance's seed content read by coordinate descent (see site 8); whether the stone stands at all is open in §9.46 (6). Contradiction arm: MOVE to the J check over the child's IS-part (blocked on question 1). Disappears: the 'would be one with … by the solid' reason. Pinned by: the-born-room §3b L378, L415 and §4b L771, L778; modes4 L587-588; the-midpoint §5 L556 (counts its calls in the store source); the-respects (meet guard).
  - freeze: NOT_FROZEN (row 219)
- **src/store/geometryStore.ts:2228-2234 resolvedEnds, the gate at 2255-2256, and A/B at 2258-2259; also the column fallback '?? A' / '?? B' at 2308-2309** — reads: spaceOf at both ends of the edge being acted on. At a gen-2 site these are the gen-1 pushouts; at gen ≥ 3, deeper ones.
  - seen: Whether any act happens on the edge at all: 'if (!ends) return' does nothing silently. The '?? A' fallback means that where a born end's child holds no relating, membership is read against the glued space. A pair naming a parent's leftover (e.g. 'A:F2') would then pass membership. This is reachable by a store call, not by hand, because the view does not open there. So MODES-3 ruling 1 (no new born pair) is held by the view's gate, not by the act (⚠ inferred, not run).
  - kind: Neither: a gate.
  - recommendation: MOVE the gate to columnSpaceOf at both ends: one gate for the view (midpointViewOf's ca/cb) and the act. RETIRE the '?? A' fallback and refuse in M10's words ('AB holds no relating yet'). Pinned by: the-born-room §4 L517 and §4b L681/L701; modes1-the-transport §D2.
  - freeze: outside the manifest roots (src/store is not an engine root)
- **src/store/geometryStore.ts:2311-2312, 2337 and 2282 (solidRefusal's name()): fallbacks to the merged space for names** — reads: nameIn(A, x) / nameIn(B, y) on the glued spaces for a term no column offers. nameIn(parentFirst ? A : B, a) at a corner edge whose parent is born. spaceOf(P/Qu/Qv).space: seeds at a gen-2 site, glued spaces at gen ≥ 3.
  - seen: The names inside refusals: '<F2> isn't a role of AC'; '(…) already holds <F7>, so it's carried there' at a gen-≥3 corner site; 'both hold <F7>, so this means pairing <r8> with <Φ1>, which you do on B–C'. At a born corner an IS key gets the glued label, and a mode-instance key prints raw.
  - kind: Neither: naming.
  - recommendation: MOVE to termWordsOf(shape, corner, id, opts). For a leftover's glued key (a term no column offers), use a key decoder that reads the A:/B: prefix through the edge's stored corners, as wordWordsOf does for word keys, so no id reaches the page (COPY-1 rule 5). Pinned by: the-born-room §4 L517 ('named as the resolver names it'), §4 L508, §4 L602; modes1-the-transport §D2.
  - freeze: outside the manifest roots
- **src/store/geometryStore.ts:2298-2300 (composedOn at the acted edge), 2339-2351 (the composed-pair refusal), 2365-2369 (the composed word pair)** — reads: The composed J at gen ≥ 2: the anchored meet of the two ends' glued spaces on a medial edge, and the coprojection on a corner edge. Its pairs trigger the refusal; composed.corners names the corner (2348); composed.words feeds the word refusal.
  - seen: 'not taken — both hold F7, so this means pairing r8 with Φ1, which you do on B–C' / 'these are already one: …' / 'the solid already makes (F7 ≡ Φ1) and (F7 ≡ r0) one, through A; you can't pair or withdraw that'. Also 'the solid already makes s and t one word …'. The word refusal is never reached at gen ≥ 2, because the child's word keys ('A:s', 's≡t') never equal the pushout's display words ('s', 's ≡ t') (⚠ inferred).
  - kind: IDENTITY (the IS act's coordinate identity, D15).
  - recommendation: MOVE the trigger to the child: solidRefusal(x, y) non-null, which is already the test 'iu.p === iv.p', read off instancesFrom. RETIRE the else-branch ('the solid already makes … through <corner>', 2348-2349), cornerWords, and the composed word refusal (2365-2369). Their only gen-≥2 meaning, the shared corner's word made one, waits on question 4. Pinned by: the-born-room §4 L508 and L602; modes1-the-descent ('the solid already makes').
  - freeze: outside the manifest roots
- **src/store/geometryStore.ts:2358 and 2375: stoneOn(RA, RB, …)** — reads: roleContent / wordContent (seed tags) of the ends' glued spaces, keyed by glued key. For an IS instance 'x≡y' at a gen-1 corner the key matches the glued key. A mode instance has no content. Word keys never match, so the word stone never fires at gen ≥ 2 (⚠ inferred).
  - seen: 'not taken — this pair would make F1 and F5 one, and they are two roles of A'. At gen 2 this is what refuses an IS pair between instances holding DIFFERENT roles of the shared corner (the-born-room §4 L602). If the pushout retires without a replacement, those pairs would be TAKEN.
  - kind: IDENTITY (the stone, §6 invariant 3).
  - recommendation: MOVE before site 1 retires. Read an instance's seed content by coordinate descent (the union of its coordinates' contents, recursively through instancesFrom). For IS instances this is equal to today's glued roleContent, so the move is behaviour-neutral. Whether the stone stands at born corners against D15 (a)'s dark pairs stays the open §9.46 (6) ruling. Pinned by: the-born-room §4 L602 and §4b L681, L687, L701.
  - freeze: outside the manifest roots
- **src/store/geometryStore.ts:2363: wordPairForm(A, B, s, w)** — reads: The arity of s and w in the glued spaces' signatures (display words). The chips at a born row carry childSidesOf's READ keys (MidpointSurface.tsx:402-403, 1052-1067).
  - seen: ⚠ Inferred from source, not run: at every gen-≥2 site, every chip from a born row is refused with 'not taken — AB's cast has no word "A:sustains"', so the word act cannot be reached there. Smallest falsifier: S().giveWordPair on the AB–AC edge with 'A:sustains', then read midpointRefusals[edge].form.
  - kind: IDENTITY-adjacent: the τ act's form check.
  - recommendation: MOVE to wordPairForm over READ's words, with their real arity. childSidesOf hard-codes arity 2 (instanceSpace.ts:270), while instanceSpaceFromCasts computes the true arity and then discards it (211, 216). Which words a born corner's word act translates (READ's keys or FILLED's named relations) is question 3, already asked. No witness exercises a word act at gen ≥ 2.
  - freeze: outside the manifest roots
- **src/store/geometryStore.ts:2379: refusalOf(A, B, composed ∪ nextRoles, composed.words ∪ nextTypes)** — reads: The J register's check over the two glued spaces plus the composed J.
  - seen: 'not taken — with X ≡ Y, AB's and AC's records contradict each other' and the 'conflict: …' lines. At gen 2 no lawful IS pair reaches it, because the solid form and the stone refuse them all first, and word pairs are refused by the form (site 9). It matters at gen ≥ 3.
  - kind: IDENTITY (the J register's check, §9.46 (3)).
  - recommendation: MOVE to refusalOf over the child's IS-part on each side, with READ restricted to its points (isPartOf-shaped spaces). This is blocked on question 1. Pinned by: the-midpoint §5 L556, a source regex on this exact line.
  - freeze: outside the manifest roots
- **src/store/geometryStore.ts:1229: rulesAfter (spaceOf before and after a vertex-data edit)** — reads: JSON of spaceOf(shape, v).space against spaceOf(edited, v).space. At a born vertex this computes two full pushouts of generation N.
  - seen: Nothing. At a born vertex the two are equal, so the loop rules are kept.
  - kind: Neither.
  - recommendation: RETIRE the born branch: compare only when isSeedVertex(shape, v), since a cast lives only at a seed (Δ86). Pinned by: modes4 and the-childs-loop-card (loopRules), seed paths only.
  - freeze: outside the manifest roots
- **src/components/MidpointSurface.tsx:1958-1972: midpointViewOf (spaceOf at 1964-1966; gate at 1971); consumed by App.tsx:21 and MidpointSurface.tsx:1991-1996** — reads: spaceOf(site.a), spaceOf(site.b) and spaceOf(site). At a gen-2 site these are the two gen-1 pushouts and the gen-2 pushout. They are handed down as the props parents and resolved.
  - seen: Whether the midpoint view replaces the solid at all, and every surface reading in sites 13-23.
  - kind: Neither: a gate plus props.
  - recommendation: MOVE the gate to ca && cb (already computed at 1969-1970) && childSpaceOf(shape, vertexId) !== null. Drop parents and resolved once sites 13-23 have moved; they must be gone before site 1 retires, or every gen-≥2 mount crashes on resolved.edge. There is no witness of midpointViewOf, but 13 witness files build these props by hand (see witnesses).
  - freeze: outside the manifest roots (src/components)
- **src/components/MidpointSurface.tsx:410-413: nameFrom / nA / nB** — reads: For an id no column holds: nameIn(parents[i].space, id), the merged space of the gen-1 pushout at a gen-2 site.
  - seen: The line 'X ≡ Y · kept from before, not drawn' (1126, data-midpoint-kept); 'names a role that isn't in its cast' (1166, data-midpoint-unheld); the refused listing (1132); the remade note (551); the dependency act words (875). Also the respects and foot lines (1194-1215, 1675-1690), which belong to site 23. A leftover prints by its merged label (e.g. 'F2'); an id absent from both prints raw.
  - kind: Neither: naming of strays and kept pairs.
  - recommendation: MOVE the fallback to termWordsOf(shape, site.a/b, id, {records}), plus site 6's key decoder for a leftover's glued key. Strays are carried and marked (MODES-3 ruling 1); only the words change. Pinned by: concept_layer_eye_driver.py (data-midpoint-kept, drive family) and the-road (data-midpoint-refused-listing).
  - freeze: outside the manifest roots
- **src/components/MidpointSurface.tsx:414-415: kind = resolved.edge.kind** — reads: The edge kind off the gen-≥2 pushout's edge record.
  - seen: The trace's home line 'recorded on AC–AB, a medial edge (generation 1) · this site: ABAC, generation 2' (1568-1569, data-midpoint-home), and the 'under the solid's identity' clause (947).
  - kind: Neither.
  - recommendation: MOVE to edgeKind(shape, site.a, site.b). The value is identical. Pinned by: modes2-the-five-defects L85; the-born-room §4 L481; the-midpoint L546; the concept-layer eye driver (data-midpoint-home).
  - freeze: outside the manifest roots
- **src/components/MidpointSurface.tsx:418: composed = resolved.edge.composed** — reads: The gen-≥2 composed J.
  - seen: Nothing: the binding is never read (grep -w finds only its declaration and comments).
  - kind: Neither.
  - recommendation: RETIRE. Nothing leaves the page.
  - freeze: outside the manifest roots
- **src/components/MidpointSurface.tsx:419-420: roles / types = resolved.edge.born** — reads: The meet-core in force on the source edge, which the resolver read through meetCoreOf, plus the empty record it reads on a corner edge (spaceOf.ts:571-572).
  - seen: The numbered pair lines (697-705), the acts list (1109-1131), the translated chips (866, 1053, 1067), the word-pair line (1150-1159), the refusal hands (859), and data-midpoint-state.
  - kind: Neither: this is his record. The meet part belongs to the respects group.
  - recommendation: MOVE to edgeKind(...) !== 'corner' ? recordOn(shape, site.edge, {tauDrafts}) : empty. This is the same function with no glue in the path, so the value is identical. Pinned by: the-midpoint, the-respects, the-road (data-midpoint-line-listing, data-midpoint-word-pair).
  - freeze: outside the manifest roots
- **src/components/MidpointSurface.tsx:421 (refusedRecord = resolved.edge.refused), with 528, 947 and 1221-1241** — reads: Whether the gen-≥2 pushout's glue refused: refusalOf over the glued parents ∪ composed ∪ born.
  - seen: data-midpoint-state='record-in-conflict'; the sentence 'this edge's record contradicts itself under the solid's identity; withdraw one of the pairs below', where the clause is printed only on medial edges, i.e. at gen-≥2 sites; the box with 'conflict: …' lines and a withdraw per pair (data-midpoint-record-conflict). The trace is suppressed while it holds.
  - kind: IDENTITY (the J register's check).
  - recommendation: MOVE to refusalOf over the source edge's child IS-part (blocked on question 1), or RETIRE at gen ≥ 2 if the act-time check at site 10, moved the same way, is held sufficient. The words 'under the solid's identity' retire with the composed J either way. Pinned by: the-midpoint §4 L458-459; concept_layer_eye_driver.py (data-midpoint-state).
  - freeze: outside the manifest roots
- **src/components/MidpointSurface.tsx:422 (M = resolved.edge.midpoint), with 426 and 1582** — reads: The gen-≥2 pushout itself, used only as a non-null gate. Its originOf use at 828 is gated to two seed corners and never fires at gen ≥ 2.
  - seen: Whether the traces show the residual lines, 'what both confirm' and the role traces (data-midpoint-residuals, data-midpoint-core, data-midpoint-role-trace).
  - kind: Neither: a gate. The traces themselves already read isPartOf after D-5.
  - recommendation: MOVE the gate to !refusedRecord && isPart. Pinned by: the-midpoint §4; the concept-layer eye driver.
  - freeze: outside the manifest roots
- **src/components/MidpointSurface.tsx:476: nX(corner, id) = nameIn(spaceOf(shape, corner).space, id)** — reads: The pushout of any corner: the light's, the ends' (site.a/b), a broken leg's.
  - seen: The box's sentences '<z> <word> <x>' (1365, 1382, 1396); the light's relations at an end (1294, 1314, 1323); the 'under T · show' lines (1084); the triad pending line (1175); the respects lines (1671-1675). At a born corner an IS key gets the glued label (not the column's '(F5 ≡ Φ7)'), and a mode instance prints its raw key.
  - kind: Neither: naming.
  - recommendation: MOVE to termWordsOf(shape, corner, id, {records}). D-4 already moved the light's own names (nL); nX is its leftover twin. Pinned by: concept_layer_eye_driver.py (data-altitude-recorded, -live, -under-lines; drive family); the-configuration (data-altitude-relations); the-altitude.
  - freeze: outside the manifest roots
- **src/components/MidpointSurface.tsx:1437 and 1470: the gates !!spaceOf(shape, apex)** — reads: Whether a born apex's pushout exists. It exists even when the apex's child holds no relating.
  - seen: The strip's 'X's light' button (data-midpoint-source-open), and the line 'X's roles: …' with 'open X's light' (data-altitude-line, data-altitude-open). ⚠ Inferred: at a born apex whose child is empty the light opens with lightSpace null, so there is no third column and no box. The light is offered where it holds nothing (MISPLACED).
  - kind: MODES (the altitude's light; its own reader is the column).
  - recommendation: MOVE to columnSpaceOf(shape, apex, {records}) !== null, the light's own reader (472). Pinned by: the-midpoint (data-midpoint-source-open); the-altitude (data-altitude-line); concept_layer_eye_driver.py.
  - freeze: outside the manifest roots
- **src/components/MidpointSurface.tsx:1571-1575: loadedIgnored on resolved, parents[0] and parents[1]** — reads: Resolved.loadedIgnored, i.e. v.data.cast !== undefined, which rides on the pushout.
  - seen: '<X> holds a loaded cast that isn't read: a midpoint's space comes from its parents' (data-midpoint-loaded-ignored).
  - kind: Neither.
  - recommendation: MOVE to holdsLoadedCast(shape, id), already used at 1999. The value is identical. Pinned by: the-midpoint L547; concept_layer_eye_driver.py.
  - freeze: outside the manifest roots
- **src/components/MidpointSurface.tsx:156-171: neighbourActsOn (spaceOf at 161-162, names at 165 and 170)** — reads: The pushouts of the neighbouring edge's two ends (site.a–apex, site.b–apex), born at gen ≥ 2.
  - seen: In the corners tab: 'on AB–BC: <x> ≡ <y> · <a> <w> <b> · …' (data-midpoint-source-acts). IS keys get glued labels; mode instances and inherited IS keys print raw.
  - kind: Neither: naming.
  - recommendation: MOVE to termWordsOf(shape, end, id). Pinned by: the-born-face, the-born-room, the-face, the-midpoint, the-respects (data-midpoint-source-acts); concept_layer_eye_driver.py.
  - freeze: outside the manifest roots
- **src/components/MidpointSurface.tsx:477-478, 543-547, 1186-1218, 1549, 1664-1693: resolved.core, resolved.respects and resolved.feet at gen ≥ 2 (cross-reference; priced in the respects/feet group)** — reads: The gen-≥2 pushout's feet (M⁺) and the edge's core and respects, which ride on Resolved.
  - seen: The lights lines ('glued: you gave it in C's light', 'left out', 'held back', 'differ'). Also the corners-tab foot block through a SEED apex: ⚠ inferred, it mounts at a gen-2 medial site hosted by a corner cell (face A·AB·AC, apex A, bornApex false), with pairs named via nA/nB's fallback, leftovers included.
  - kind: Superseded (§9.46 (3): the respects and the feet have no reader at a born corner).
  - recommendation: RETIRE by name in the respects/feet group, or read meetCoreOf/readRespects directly, BEFORE site 1 retires, because they disappear with Resolved at gen ≥ 2. Pinned by: the-stone (footAt L79, mounts), the-respects, the-midpoint (data-midpoint-foot-line).
  - freeze: outside the manifest roots
- **src/components/CastInsideDiagram.tsx:637-655: CastInsidePanel (spaceOf at 637; origin at 641-643, 649, 655)** — reads: The selected vertex's pushout at a born vertex, used only as the gate (!resolved → null) and for resolved.origin.
  - seen: The head '· the concept it holds' and data-inside-origin-of-space='derived', on the Ambo overlay (ConceptSurface, MidpointSurface.tsx:2007) and the Manuscript's lifted corner (inline).
  - kind: Neither: a gate.
  - recommendation: MOVE: origin by isSeedVertex; the gate by columnSpaceOf / liftedColumnOf (instanceSpaceOf null when a seed under it holds no cast). The seed branch keeps spaceOf, which is a cast there. Visible: unchanged. Pinned by: the-inside, the-lift-carries, the-midpoint (data-inside-panel); the-born-room §4 L641; concept_layer_eye_driver.py.
  - freeze: outside the manifest roots
- **src/components/Panels.tsx:2572-2598: SpaceCardRow (spaceOf at 2573; resolved.edge.parents at 2590)** — reads: The selected born vertex's pushout, as the gate and for the parents' order on its edge.
  - seen: The inspector's row 'space · the concept between AB and AC, made of N relatings' (data-space-card-row='derived') and the row 'none yet: …' (='none-yet'). ⚠ Inferred: at gen ≥ 2 the resolver resolves even when a parent's child holds no relating, so the card prints 'made of 0 relatings' and M10's 'none yet: AB holds no relating' is unreachable, while the view refuses to open (MISPLACED gate).
  - kind: Neither: a gate.
  - recommendation: MOVE the gate to parentsWithoutSpace(shape, v).length === 0 (the same columnSpaceOf reader the view uses), with the parents' order from edgeBetween over the sources. Pinned by: the-cast-loader §7 L268 (source strings 'data-space-card-row="derived"' and 'childSpaceOf(shape, vertexId)?.roles.length'); concept_layer_eye_driver.py.
  - freeze: outside the manifest roots
- **src/lib/relatings.ts:179-181: resolverRoles, the default roleSource of relatingOf** — reads: spaceOf(shape, corner).space as the corner's roles for checking a relating act.
  - seen: Nothing in the app: the store passes childSpaceOf (geometryStore.ts:1379). Only a caller that omits the argument reads the pushout.
  - kind: MODES (the relating act's membership).
  - recommendation: RETIRE the default and make roleSource required. Defaulting to childSpaceOf would close an import cycle, since instanceSpace imports relatings. Pinned by: modes1-the-descent §h L165, which pins the literal 'roleSource: RoleSource = resolverRoles' and the import count of 3.
  - freeze: NOT_FROZEN (row 241)
- **src/lib/bornFace.ts:131-158: bornStepOf (cross-reference: the feet)** — reads: spaceOf at both ends plus composedOn by kind plus his record: the identity regime's one-step J. Since M1 its only src reader is spaceOf's feetOf (spaceOf.ts:284-285).
  - seen: Only through the feet (site 23).
  - kind: Superseded (the feet, §9.4).
  - recommendation: RETIRE with the feet, as a witness control if kept. Pinned by: modes1-the-transport, the-born-room, the-cargo, the-lift-carries, the-respects, the-stone. The comments at doorTransportModel.ts:35 and 139 still name bornStepOf as the door's step; the door reads transportStepOf.
  - freeze: NOT_FROZEN (row 220)
- **src/lib/respects.ts:192-203: triadOf (spaceOf at 198), and 308 (brokenBornActs in the meet guard) (cross-reference)** — reads: The pushout of each corner of a triad for membership. At a born corner it is the glued space, while the picks come from the columns (the child).
  - seen: 'not taken — <item> isn't a role of <corner>' for a mode-instance pick, the same mixing D-2 fixed for pairs. Also the 'held back' lines via site 4.
  - kind: Superseded (the respects, §9.4).
  - recommendation: Priced in the respects group. Listed because it reads the next pushout's parents and must move or retire before site 1 retires.
  - freeze: NOT_FROZEN (row 239)

### Witnesses that pin it

- scripts/diagnose-the-born-room.cjs: the resolver's C-8/C-8b seal, which pins the next pushout as a space. §1-§3b, 17 checks: the station, ABAC's 28 roles, T1/T6/T2/inv9, the gen-4 station, the anchored meet and the tripwire (coprojectionOf, contentMeet, duplicatedSeeds, pooledRoles). §4 L481 (home line), L494 (namingOf), L508 (composed-pair refusal words), L517 (term named as the resolver names it), L602 (IS at gen 2: solid form or stone), L624, L641. §4b L681/L687/L701 (the stone at gen 3 through the store), L771/L778 (the stone in brokenBornActs). §3b L378/L415. §5 L797 (spaceOf.ts import purity). Its MidpointSurface mount at L475.
- scripts/diagnose-the-midpoint.cjs: §4 L458-459 (record-in-conflict, data-midpoint-record-conflict); L545-547 (RM.edge.kind==='medial', RM.edge.composed.roles.length===flow.roles.length, RABs.loadedIgnored, data-midpoint-loaded-ignored); §5 L556 (source regex on the store's refusalOf line and on the brokenBornActs call count); mount at L373.
- scripts/diagnose-modes1-the-descent.cjs: §a L88-89 (composedOn as the over-composition control); §h L165 (the literal default 'roleSource: RoleSource = resolverRoles' and relatings.ts's import count).
- scripts/diagnose-modes4-the-record-and-the-sorting.cjs: §h L530-588 (composedOn controls; brokenBornActs(G2, …)); mount at L156.
- scripts/diagnose-the-lift-carries.cjs: L42 (composedOn import), L199 (cd.edge.born), L218 (ABAC's glued roles note).
- scripts/diagnose-the-doors-act.cjs L57 and scripts/diagnose-the-found-bugs.cjs L47: import composedOn as a control.
- scripts/diagnose-the-stone.cjs: L79 footAt (spaceOf(...).feet); L212 (its own nA/nB through spaceOf(R.edge.parents)); L219 (R.edge.midpoint.pairs); mounts at L261, L319, L335.
- scripts/diagnose-the-cast-loader.cjs §7 L268: Panels.tsx source strings of SpaceCardRow.
- scripts/diagnose-modes1-the-transport.cjs §D2: the act's term naming and the mode-instance refusal, touched if the store's name fallbacks change.
- scripts/diagnose-the-respects.cjs: brokenBornActs in the meet guard; data-midpoint-triad-pending, -source-acts, -line-listing; mount at L450 (overlaps the respects group).
- scripts/diagnose-the-configuration.cjs: data-altitude-relations (nX names at an end); mounts at L242, L259, L291.
- MidpointSurface mounts that build parents/resolved by hand with spaceOf (13 files, about 18 mounts; all re-pinned if the props are dropped): diagnose-modes1-the-sorting L311, diagnose-modes1-the-words L101, diagnose-modes2-the-five-defects L80 (plus data-midpoint-home L85), diagnose-modes4 L156, diagnose-the-altitude L235/L273, diagnose-the-born-room L475, diagnose-the-childs-cast L69, diagnose-the-childs-loop-card L59/L457, diagnose-the-configuration L242/L259/L291, diagnose-the-midpoint L373, diagnose-the-respects L450, diagnose-the-road L282, diagnose-the-stone L261/L319/L335.
- DRIVE FAMILY (must run, because the reading changes what a person sees at gen-≥2 sites): scripts/app-leg/diagnose-the-concept-layer-eye.cjs with concept_layer_eye_driver.py. They read data-midpoint-home, data-midpoint-kept, data-midpoint-state, data-midpoint-source-open, data-midpoint-source-acts, data-midpoint-loaded-ignored, data-space-card-row, data-inside-origin-of-space, and data-altitude-line/-open/-recorded/-live/-under-lines.
- Unpinned: data-midpoint-unheld, data-midpoint-refusal-solid, midpointViewOf, the word act at a gen-≥2 site (no witness calls giveWordPair with a child word key), and the store's '?? A' column fallback.

### Open questions (not decided here)

- 1. READ AT GENERATION ≥ 2 FOR THE IDENTITY CHECK. §9.46 (3) gives the identity readers 'READ restricted to those points: the parents' relations read through the pairs (§9.45 (3))'. At gen ≥ 2, is that READ the induced record from the parents' FILLED relations? That is what isPartOf, childSidesOf and the D-5 traces compute at gen 2 when handed his records, and they compute nothing without them. Or is it the parents' relations substituted through the pairs all the way down to the seeds, §9.45 (3)'s 'IS-only sub-case'? Today only the retired pushout carries the latter, together with leftovers and over-composition. Nothing else in src computes it. The J register's check at gen ≥ 2 cannot move until this is ruled: geometryStore.ts:2379, the surface's record-in-conflict (MidpointSurface.tsx:421/947/1221-1240), and brokenBornActs's contradiction arm (spaceOf.ts:748).
- 2. THE STONE AT BORN CORNERS (already open, §9.46 (6), first bullet). With the pushout retired, the stone (geometryStore.ts:2358; spaceOf.ts:731) can be read on an instance's coordinates down to the seeds. That keeps today's behaviour, under which the stone is what refuses an IS pair at gen 2 between instances holding different roles of the shared corner. Whether the stone stands there at all, against D15 (a)'s dark pairs, is the open ruling. If the pushout retires before this is decided, those pairs become TAKEN.
- 3. WHAT A WORD PAIR TRANSLATES AT A BORN CORNER (already asked; the comment at MidpointSurface.tsx:400-401): READ's pulled-back keys, which the chips carry now, or FILLED's named relations (§9.40's vocabulary)? Until it is ruled, the act's form check reads the pushout's display words. So, ⚠ inferred and not run, every born-row chip is refused at every gen-≥2 site ('AB's cast has no word "A:…"').
- 4. THE SHARED CORNER'S WORD THROUGH BOTH CHILDREN AT GENERATION 2 (already open, §9.46 (6), third bullet): one word or two? The next pushout's anchored meet on words makes them ONE, and the store refuses translating them ('the solid already makes s and t one word', geometryStore.ts:2365-2369, though unreachable by key mismatch). The child keeps two. Retiring the pushout removes the only reader that joins them.

## THE FEET: src/lib/feet.ts, feetOf/withFeet, Resolved.feet, feetShareOf, the corners tab's foot blocks (data-midpoint-foot*), M⁺, TRANSPORT_OPTIONS {feet:false}, the isFootType filter, and bornStepOf, whose only src caller is feetOf

**Estimate: about 6.5 h.**

Survey at HEAD 4f69d69 (the D-2..D-6 commit has landed): read source only, ran nothing. Feet exist ONLY at born vertices: spaceOf.ts:594 composes them into every default spaceOf read of a born vertex (M⁺ = the glued amalgam plus ≡_X), and seedResolved holds feet: []. So §9.46 (3), 'no reader at a born corner', means no reader anywhere, and the whole C-12b mechanism retires by name: Foot, Resolved.feet, facesHolding/feetOf/withFeet, feetShareOf, SpaceOfOptions.feet and TRANSPORT_OPTIONS.feet, feet.ts's three foot exports, castInside's isFootType skip and census.feet, MidpointSurface's cornersViewWords, and bornStepOf (feetOf is its only src caller). Exactly ONE place on the page reads the feet: the corners tab's foot block at a generation-1 site (MidpointSurface.tsx:542-546, 1549, 1616-1692; resolved comes from midpointViewOf:1966, the born site's M⁺). It shows the head `through C, from the pairs on A–C and C–B` and the agrees / would-pair / would-join lines, an IDENTITY reading whose fact (the IS∘IS passage through X) survives in the modes tab's passage lines. Two things need care. (1) The silent line in that block is R1's zero-count reason, a MODES purpose fed by foot.given; it must move to the sorting's ViewSorting.legs and paths, with a copy question, or retire. (2) The block's element also carries the respects' triad lines and their withdraw hands, which the drive leg locates through data-midpoint-foot; price it as one union with the respects group. TRANSPORT_OPTIONS is inert at both its callers: transport.ts:44 and liftedConceptModel.ts:104 call spaceOf only at seeds, and the seed branch ignores options (⚠ from reading the source). ViewSorting.feet (sorting.ts) is not the resolver's space: it is §9.2's sub-case reading of paths in the form, so the recommendation is KEEP. The ≡_X words also ride, invisibly, into the gen ≥ 2 act guard (geometryStore resolvedEnds → refusalOf, wordPairForm, stoneOn), brokenBornActs and triadOf. Their share in refusalOf is null (diagnose-the-stone §4), so retiring the feet changes nothing there; moving those readers to the IS-part belongs to the glued-space and J-register groups. Freeze: every engine file named is NOT_FROZEN (spaceOf 219, feet 228, bornFace 220, castInside 216, sorting 243, transport 244, liftedConceptModel 221, respects 239, instanceSpace 242, relatings 241, midpointGlue 217, jRegister 215, doorTransportModel 223). MidpointSurface.tsx, CastInsideDiagram.tsx, Panels.tsx and geometryStore.ts sit outside the manifest's engine roots, so no frozen spend is needed. Manifest row 228 must be updated or removed in the same commit: the checker does not flag a stale NOT_FROZEN row. Estimate 6.5 h: code about 1.75 h (spaceOf 0.5; MidpointSurface including moving the R1 line 0.75; castInside, feet.ts and the manifest row 0.25; comment sweep 0.25). Sweep witness re-pins about 3.25 h (diagnose-the-stone rewritten as a retirement witness about 1.25; transport, sorting, respects and words about 0.4 each; midpoint 0.25; f3, descent, inside and born-room together about 0.15). Drive family re-pin plus one run at 1689 × 897 and the eye about 1.5 h.

### Sites

- **src/lib/spaceOf.ts:589-598, 608, 615 (the born-vertex branch: feetOf(...), the f.type wordContent/wordSegs, withFeet(g.space, feet), Resolved.feet) and :238 (seedResolved feet: [])** — reads: the born vertex's glued amalgam (result.midpoint), plus the two other edges of every triangular face holding A–B, read through bornStepOf. It writes one ≡_X relation-type per opposite corner and its links into the born vertex's space (M⁺) and into Resolved.feet. Composed on EVERY spaceOf call that does not pass feet:false.
  - seen: Only through Resolved.feet in the corners tab's foot block (the MidpointSurface site below). The ≡_X words also ride every default read at a born vertex, and the next generation's pushout carries them as foreign words (≡_D [AB]). Since MODES-3 no page prints them: the columns and word rows read the child and READ.
  - kind: neither: this is the producer, the identity regime's §3.10 artifact that §9.4 superseded. Feet exist only at born vertices, so 'no reader at a born corner' means no reader anywhere.
  - recommendation: RETIRE by name. Delete the feet composition at 589-598, drop withFeet at 608 (the space becomes withRespects(g.space, respectLinks) until the respects group decides), and drop feet at 615 and 238. Nothing disappears from the page except through the foot block below.
  - freeze: NOT_FROZEN (manifest row 219)
- **src/lib/spaceOf.ts:110-130 (interface Foot), :140 (Resolved.feet), :245-325 (facesHolding, feetOf, withFeet), :65 (import footTypeName), :66-69 (import bornStepOf, the bornFace cycle)** — reads: facesHolding is called only by feetOf. feetOf reads bornStepOf(p,X) and bornStepOf(X,q), plus recordOn on A–B and the two legs (the foot's given).
  - seen: nothing directly
  - kind: neither: the foot's own mechanism
  - recommendation: RETIRE whole. That removes both imports, and with them the spaceOf↔bornFace call-time cycle. The compiler is the census for Resolved.feet; its only src consumers are MidpointSurface.tsx:545-546 and :1617.
  - freeze: NOT_FROZEN (manifest row 219)
- **src/lib/spaceOf.ts:154 (TRANSPORT_OPTIONS = { respects: false, feet: false }) and :172-173 (SpaceOfOptions.feet); its callers src/lib/transport.ts:44 and src/manuscript/liftedConceptModel.ts:104** — reads: the switch that turns the feet off. Both callers call spaceOf only at SEED vertices (transport.ts inside isSeedVertex; liftedConceptModel over seedsUnder), and the seed branch (spaceOf.ts:559-560, seedResolved) never reads options. So the flag is inert at both callers. ⚠ This comes from reading the source, not from running it.
  - seen: nothing
  - kind: neither
  - recommendation: RETIRE `feet` from SpaceOfOptions and from TRANSPORT_OPTIONS. Whether TRANSPORT_OPTIONS retires whole depends on the respects group: it is inert at both callers. Its witness names the respects half too.
  - freeze: spaceOf.ts NOT_FROZEN (row 219); transport.ts NOT_FROZEN (row 244); liftedConceptModel.ts NOT_FROZEN (row 221)
- **src/lib/spaceOf.ts:327-336 (spaceCounts' doc 'A born space is M⁺ — the amalgam plus its feet'; feetShareOf)** — reads: Foot[] → {words, tuples}
  - seen: nothing: no src consumer. Witnesses only (diagnose-the-stone 278/296; diagnose-the-midpoint 361-366).
  - kind: neither
  - recommendation: RETIRE feetShareOf by name, and correct the spaceCounts comment in the same cut.
  - freeze: NOT_FROZEN (manifest row 219)
- **src/components/MidpointSurface.tsx:542-546 (feetInOrder from resolved.feet), :1549 (foot={feetInOrder.find(...)}), :1616-1617 (CornerRecord's `foot: Resolved['feet'][number]`), :1664-1691 (the foot block's head and lines)** — reads: resolved.feet, where resolved = spaceOf(shape, siteId, {tauDrafts}) from midpointViewOf:1966. That is the born SITE's M⁺, i.e. the resolver's glued space at a born corner. The target-end split (:1684-1690) also reads the sorting view's paths.
  - seen: In the corners tab, at a generation-1 site, one block per SEED opposite corner (it renders only when !bornApex): the head `through C, from the pairs on A–C and C–B`; `agrees with N pairs: F9 ≡ r1`; `would pair F13 with r0, but you paired F13 with r8`; `would pair r5 with F3, but you paired r5 with F1`; `would pair F13 with Φ8, which you haven't paired`.
  - kind: IDENTITY reader: the stone's FIX/DISAGREEMENT/PROPOSAL of foot_X = J_XB∘J_AX against J_AB
  - recommendation: RETIRE by name: the head and the agrees / would-pair / would-join lines. The same fact, the IS∘IS passage through X, stays on the page in the modes tab's passage lines (MediumBlock.tsx:152-199: `… comes to F3 ≡ r5, but r5 is paired with F1`, `… not related directly: C's light`). Pinned by diagnose-the-stone §5 (324-325, 337); diagnose-modes1-the-words §a (141) and §b S2 (180-181); diagnose-modes1-the-sorting §h (312-313); diagnose-the-concept-layer-eye §14 (283-285 fw===2; 764-768); concept_layer_eye_driver.py 1995-1996, 2081, 2101, 2460.
  - freeze: not in the manifest: src/components is outside the engine roots (src/lib, src/playground, src/manuscript, src/types)
- **src/components/MidpointSurface.tsx:1646-1654 and :1692 (the silent line), with :1643-1645 (view/hasPath) and :479-481 (sortingOf, whose comment says 'read for the feet's silence alone here')** — reads: foot.given, his IS core on A–X and X–B via recordOn (meet pairs included), plus hasPath from the sorting view
  - seen: `nothing through C yet: nothing is paired on C–B` · `nothing through C yet: nothing is paired on A–C or C–B` · `nothing through C: the pairs on A–C and C–B don't meet`. This is R1's zero-count reason, which STAMP THE-MODES-TAB moved into the corners tab.
  - kind: MODES reader in purpose (R1 of the sorting's passages through a corner), but fed by the foot
  - recommendation: MOVE its predicate off the foot to the sorting's own view: ViewSorting.legs for which leg is empty, view.paths for 'don't meet' (sortingOf at :481). Not to the child: the apex is a seed wherever this renders. The sentence's 'paired' must follow the new predicate (legs counts every mode), so that is a copy question (below). Alternatively RETIRE it; then R1's distinction (one leg empty vs legs that don't meet) leaves the page, because the modes tab's corner line says only `nothing on its edges` (MediumBlock.tsx:842). Pinned by diagnose-modes1-the-words §d R1 (114, 349) and diagnose-modes1-the-sorting §h ('no foot says the legs do not meet'). Fix the :479 comment in the same cut.
  - freeze: not in the manifest: outside the engine roots
- **src/components/MidpointSurface.tsx:1664-1665 (the container: `!bornApex && (foot || respects.length > 0)`, data-midpoint-foot / data-midpoint-foot-state / data-midpoint-foot-head)** — reads: the foot OR the respects. The same element wraps the respects' triad lines and their withdraw hands (:1667-1679).
  - seen: the block's frame and head, also shown when only respects exist
  - kind: shared with the respects group (both are superseded under §9.46 (3))
  - recommendation: RETIRE the foot attributes by name, as ONE union with the respects group's decision: one file, one element. If the respects lines or the moved R1 line stay, rename the container in the same cut, or a name of intent survives. Re-pin the drive leg: it locates the triad hands through this container (concept_layer_eye_driver.py 1174, 1247 `[data-midpoint-foot="C"] [data-midpoint-triad-withdraw]`, 1259, 1298).
  - freeze: not in the manifest: outside the engine roots
- **src/components/MidpointSurface.tsx:125-135 (export cornersViewWords, '§149 — what the feet contribute')** — reads: a feet share {words, tuples} and corner names
  - seen: nothing: no src consumer. Pinned only by diagnose-the-stone 254; diagnose-the-midpoint 365 keeps its own copy.
  - kind: neither
  - recommendation: RETIRE by name
  - freeze: not in the manifest: outside the engine roots
- **src/lib/castInside.ts:44 (import isFootType), :101 (InsideCensus.feet), :139-146 (the isFootType skip), :187** — reads: the relations of whatever space insideOf is handed. In the app it gets only seed casts and child column spaces (CastInsideDiagram.tsx:643; MidpointSurface.tsx:428, 429, 473, 1626), so no ≡_ type ever arrives. census.feet has no src reader.
  - seen: nothing today. Latent defect: a caster's own word beginning `≡_` would be silently dropped from the drawing ('said, not enforced').
  - kind: neither: a filter for M⁺ that is no longer reached
  - recommendation: RETIRE by name: the skip and census.feet. Witnesses: diagnose-the-inside 329 (pins the import line and an import count of 3); diagnose-the-stone §3 222-224; diagnose-the-respects 423.
  - freeze: NOT_FROZEN (manifest row 216)
- **src/lib/feet.ts:9-15 (FOOT_PREFIX, footTypeName, isFootType)** — reads: nothing (a leaf). Consumers: spaceOf.ts:65 and :304; castInside.ts:44 and :146.
  - seen: nothing directly
  - kind: neither
  - recommendation: RETIRE the three exports. The file would then hold only the respect names (respectTypeName and isRespectType, used by respects.ts:37 and castInside.ts:44), so it should be renamed, or deleted with the respects group. Update or remove manifest row 228 in the same commit: engineFreeze.cjs checks existence only for FROZEN rows, so a stale NOT_FROZEN row would sit there silently (⚠ from reading the code). diagnose-the-stone §5 342 pins that row.
  - freeze: NOT_FROZEN (manifest row 228)
- **src/lib/bornFace.ts:131-158 (bornStepOf) and its comments at :3, :25-26, :128-129 ('stays for the stone's feet')** — reads: spaceOf at both ends of an edge (born ends included: the glued space), composedOn, recordOn. This is the identity regime's one-step J.
  - seen: nothing: its only src caller is spaceOf.feetOf (284-285)
  - kind: IDENTITY reader that only feeds the feet
  - recommendation: Once the feet go it has no src reader: RETIRE by name, or keep it as a witness-only instrument and say so in its comment. Either way the 'stays for the stone's feet' comments become false and are fixed in the same cut. Witness users: diagnose-the-cargo 370-387; diagnose-the-lift-carries 46 and 209-228; diagnose-the-respects 56 and 415; diagnose-modes1-the-transport 45 and 85 (which pins 0 uses in the manuscript bodies). Note: doorTransportModel.ts:35 and :139 already name bornStepOf in comments while the code reads transportStepOf. That comment drift predates this cut.
  - freeze: bornFace.ts NOT_FROZEN (row 220); doorTransportModel.ts NOT_FROZEN (row 223)
- **src/lib/sorting.ts:183 (FootKind), :196 (ViewSorting.feet), :579-588** — reads: the sorting's own read paths (xzIn, triads). It does NOT read the resolver's space.
  - seen: nothing: no src consumer
  - kind: MODES reader (the sorting) carrying §9.2's identity sub-case as a reading of paths in the form
  - recommendation: KEEP: neither move nor retire. §9.4 replaced §3.10's ≡_X in the signature with exactly this, 'paths in the form'. Retire only its agreement check against the resolver's feet (diagnose-modes1-the-sorting §e 247-252), because its partner goes. §a (92, 122-126) against the reference and §e 241-242 stay.
  - freeze: NOT_FROZEN (manifest row 243)
- **Indirect M⁺ riders at generation ≥ 2: src/store/geometryStore.ts:2231-2232 (resolvedEnds) feeding :2358/:2375 stoneOn, :2363 wordPairForm and :2379 refusalOf on RA.space/RB.space; src/lib/spaceOf.ts:707-708 (brokenBornActs) feeding :738-739 signature membership and :748 refusalOf; src/lib/respects.ts:198-200 (triadOf word-pick membership); geometryStore.ts:1229 (JSON compare of spaceOf before and after a cast edit)** — reads: born ends' M⁺, whose signature and relations include the ≡_X words and tuples
  - seen: refusals and dependency sentences, none of which names a foot. The feet's share in refusalOf is null: diagnose-the-stone §4 249 found the same conflicts with and without the feet over 360 pointed pairs. At :1229 a born vertex's own data edit does not change its feet.
  - kind: IDENTITY readers (the J register's check, the dependency refusal, the triad's pick check), owned by the glued-space and J-register groups
  - recommendation: No feet-specific change: they lose ≡_X automatically when feetOf retires, and moving them to the IS-part belongs to their own groups. Risk (unmeasured): a τ on a foot word saved before MODES-3 would afterwards read as broken at spaceOf.ts:738 ('it needs ≡_C as its own word').
  - freeze: geometryStore.ts not in the manifest (src/store is outside the engine roots); spaceOf.ts NOT_FROZEN (219); respects.ts NOT_FROZEN (239)
- **Callers that compose feet and read none: src/components/CastInsideDiagram.tsx:637; src/components/Panels.tsx:2573; src/components/MidpointSurface.tsx:161-162, 476, 1437, 1470, 1885** — reads: default spaceOf at born vertices (feet composed: bornStepOf for every face), then only origin, edge, existence or role names (feet add no roles), or seed casts (1885 FaceRecord mounts on seed faces only)
  - seen: nothing of the feet
  - kind: neither
  - recommendation: No change for this group. The wasted feetOf work per read disappears with the retirement.
  - freeze: not in the manifest: src/components is outside the engine roots
- **Comment sweep: src/lib/transport.ts:12, 16, 37 ('no foot composed', 'the stone's feet's'); src/lib/instanceSpace.ts:26; src/lib/relatings.ts:33; src/lib/respects.ts:26 and 444 ('beside the feet'); src/lib/spaceOf.ts:66-73, 147-152, 589-593** — reads: nothing
  - seen: nothing
  - kind: neither
  - recommendation: Correct these in the same cut: each states a fact about the feet that becomes false.
  - freeze: all NOT_FROZEN (transport 244, instanceSpace 242, relatings 241, respects 239, spaceOf 219)

### Witnesses that pin it

- scripts/diagnose-the-stone.cjs: the C-12b witness, nearly whole. §1 (149-154, a pure port of the reference, no app reader) can stay or move to the instruments folder. §2 R4 (190, the resolver's feet over 42 triples) retires. §3 (204, 214, 218, 222: ≡_C/≡_D in M⁺, the feet:false control, census.feet) retires. §4 (235 the lift carries the feet; 243 the next pushout's ≡_D [AB]; 249 refusalOf with/without the feet) retires. §5 (324 the foot blocks; 327 the drawing free of `≡_`; 337 the agrees/would-pair lines; 342 manifest row 228 plus the import pins `footTypeName`, `bornStepOf`, `isFootType`) retires. §6 282 and 297 (feetShareOf) retire. §6 285 and 301 (the child's counts) stay or are re-homed. Imports at 50, 53, 254.
- scripts/diagnose-modes1-the-transport.cjs: §0 74 (J(TRANSPORT_OPTIONS) === {respects:false, feet:false}); §a 109 with foreign() at 70 and 107 (isFootType; the feet's words rode); §e 230 (full.feet.length === 2); bytes() 69 includes feet; bornStepOf at 45 and 85.
- scripts/diagnose-modes1-the-sorting.cjs: §e 247-252 (the resolver's feet agree with the view's kinds) retires. §h 312-313 (data-midpoint-foot blocks, `Fact`'s foot `read`, 'no foot says the legs do not meet') is re-pinned. §a 92 and 122-126 and §e 241-242 (ViewSorting.feet) stay.
- scripts/diagnose-modes1-the-words.cjs: §a 141 (`data-midpoint-foot=` inside the view root); §b S2 180-181 (the foot lines); §d R1 114 and 349 (footSilent, the R1 reason).
- scripts/diagnose-the-respects.cjs: 51 (imports isFootType); 423 (census.feet); 439 (source pin `space: withRespects(withFeet(g.space, feet), respectLinks),`); 508 (readingOf includes feet); 534-537 (feetTypes === ['≡_C','≡_D']); bornStepOf at 56 and 415.
- scripts/diagnose-the-midpoint.cjs: 361-366 (feetShareOf, its own copy of cornersViewWords, sizesAt over r.feet); the §4 checks at about 379 (zAB.words === 25 + share.words) and about 411 (gAB share).
- scripts/diagnose-f3-the-drafts-persist.cjs:74 (readersAt's canon includes R.feet)
- scripts/diagnose-modes1-the-descent.cjs:154 (readBuilt includes r.feet)
- scripts/diagnose-the-inside.cjs:329 (castInside imports `{ isFootType, isRespectType } from './feet'`; import count 3; feet.ts has no import)
- scripts/diagnose-the-born-room.cjs:797-798 (spaceOf has exactly 8 imports, feet.ts and bornFace among them, so this changes to 6). 634-639 is an absence fence (data-midpoint-foot === 0 at the gen-2 corner site) that stays true: leave it standing.
- scripts/diagnose-the-born-face.cjs:262-264: absence fence (foot blocks === 0 at ABAC). Stays true; leave it standing.
- scripts/diagnose-the-lift-carries.cjs:42 (imports TRANSPORT_OPTIONS; survives while the constant exists); 46 and 209-228 (bornStepOf, only if bornStepOf retires)
- scripts/diagnose-the-cargo.cjs:370-387 (bornStepOf, only if bornStepOf retires)
- scripts/diagnose-modes4-the-record-and-the-sorting.cjs:589: a note that prints res.feet.length, not a check (it will print '?')
- DRIVE FAMILY (not in the sweep; it runs because this cut's reading touches the corners tab) scripts/app-leg/concept_layer_eye_driver.py: 1174, 1247, 1259, 1298 (the respects' hands located inside [data-midpoint-foot]); 1995-1996, 2081, 2101, 2460 (foot blocks, head font, scroll into the foot)
- DRIVE FAMILY scripts/app-leg/diagnose-the-concept-layer-eye.cjs: §14 ONE COUNT 279-285 (fw === 2 foot blocks, which would go red); §14 764-768 (the corners' views as words) retires; §22 601-603 (b.foot === 0 at the corner site) stays.

### Open questions (not decided here)

- R1's zero-count reason, the corners tab's silent line (MidpointSurface.tsx:1646-1654, 1692): `nothing through C yet: nothing is paired on C–B` / `… the pairs on A–C and C–B don't meet`. It is computed from the foot's `given`. Once the foot retires, two options. (a) Keep it in the corners tab, re-derived from the sorting's ViewSorting.legs and paths; legs counts a relating in ANY mode, so 'nothing is paired' must change words. (b) Retire it; the modes tab's corner line says only `nothing on its edges` and cannot tell one empty leg from legs that don't meet. Which, and in what words? (designer / mothership; COPY-1)
- The block's head `through C, from the pairs on A–C and C–B` names the foot's warrant, and it also heads the respects' triad lines in the same element. If the respects stay at generation-1 sites after the feet go, does that head stay as theirs, change, or go? I am leaving this undecided: the respects group's ruling and this one share one element, so they should be one union.
- sorting.ts ViewSorting.feet (:196) holds the identity regime's FIX/DIS/PRO/UND as a reading of the sorting's own paths (§9.2's sub-case, F4's gate). I read it as the 'paths in the form' that §9.4 put in place of §3.10's ≡_X, so I recommend keeping it, not retiring it. Is that the ruling's reading, and should the word 'feet' stay on it once the resolver's feet are gone?
- COULD NOT REACH: whether any workspace he saved before MODES-3 holds a τ or a born word pair on a foot word (`≡_C`, `≡_D [AB]`) at generation ≥ 2, back when the word rows offered M⁺'s words. After the retirement, brokenBornActs (spaceOf.ts:738) would read such a pair as broken ('it needs ≡_C as its own word'). This needs a measurement on his saves before landing.

## THE MEET-CORE AND THE TRIAD: meetCore / core / unconditional (spaceOf.ts, respects.ts); the triad readers (giveTriad, triad records, data-midpoint-triad*, the light triads); the respects (respects.ts) at born corners. Surveyed at HEAD 4f69d69 (D-2..D-6 landed). src/ is clean against HEAD.

**Estimate: about 6.5 h.**

This group's sites read the resolver at a born vertex, not the child, and most of what they read is §3.11 (superseded whole by §9.4), so it is NEITHER an identity nor a modes reading. Everything here is RETIRE except three MOVEs (the triad act's check, the light-pick name, the light gate), all modes readers.

**What I measured** (scratchpad probes against HEAD 4f69d69; I did not drive the app; the page texts below are read from the code):
- **The meet glues a pair the child doesn't have.** Both lights give F7↦r0 on A–B and he gives no pair. After a dissection, AB's `edge.born` is [[F7,r0]] and its glued space carries `⟨C⟩` and `⟨D⟩`, but AB's child has no relating. So the midpoint view draws F7≡r0 as numbered pair line 1, lists it as `glued: you gave it in C's light and in D's`, and says `1 role pair` beside `AB: 0 relatings`.
- **The triad act refuses what its own column offers.** At the face A·AB·AC, `triadOf` refuses AB's column point `F2 sustains r1` with `F2 sustains r1 isn't a role of AB`, because it checks picks against the glued space. The IS pick `F5≡r0` passes only because the glue spells its key the same way. Glued leftovers like `A:F1`, which no column offers, would pass.

**Recommendation:**
- **RETIRE the meet-core:**
  - the resolver glues `born = unconditionalOn(...)`, and `recordOn` reads only his pairs;
  - in `respects.ts`, `meetCoreOf` with its conflict and held-back guards (the held-back guard itself reads the glued spaces at born corners);
  - `Resolved.core` and `Resolved.respects`, with the readings (`readRespects`, `coreMapOf`, verdicts);
  - the `⟨X⟩` types and their counters (`respectLinksOf`, `withRespects`, `census.respects`, the `feet.ts` names);
  - the `respects` and `meetDependency` options.
  
  What leaves the page: the `glued: you gave it in …` lines, the lights block (one-spoken, left-out, held-back, differ), and the corners-tab respect lines.
- **MOVE three modes readers** (only if the triad act survives — question 1):
  - `triadOf` to `columnSpaceOf` for roles and `childSidesOf(...).signature` for words;
  - the triad pending line from `nX` to the existing `nL`;
  - the light gate at MidpointSurface:1437/1470 to `columnSpaceOf`. Today it can open an empty light at a born apex. This gate is shared with the light/altitude group.
- **KEEP:** the triad record and its writers (`triadsOn`, `withTriad`, `withoutTriad`, `carriedTriads`, `stage.ts`), `triadLegsOf` and `withdrawTriad`, the sorting's reading of a triad as a path through the light, and `unconditionalOn` (B1's base read; moving it to `relatings.ts` avoids an import cycle the `triadOf` move would create).

**Other groups:** retiring the meet from `recordOn` also removes meet pairs from `feetOf`, `bornStepOf` and `brokenBornActs`, so the feet and acts groups should be told.

**Frozen files:** every engine file named is NOT_FROZEN. `MidpointSurface.tsx` and `geometryStore.ts` are outside the engine roots, and `geometry.ts` (FROZEN) is untouched because triads live in an open packet field. No frozen spend is needed.

**Effort, about 6.5 h:**
- code about 2.5 h: `spaceOf.ts` 0.5, `respects.ts` 0.75, `MidpointSurface.tsx` 1, `castInside`/`feet` 0.25;
- witnesses about 3.25 h: `diagnose-the-respects` rewrite 2, `modes1-the-transport` 0.5, the small import and attribute pins 0.75;
- a new born-corner triad arm about 0.25–0.5 h if the act stays;
- the drive-family triad arms re-run about 0.5 h.

No witness pins a triad at a born corner today; every triad in `scripts/` is on seed faces.

### Sites

- **src/lib/spaceOf.ts:571-573 (born-vertex branch: `core = meetCoreOf(shape, e, options)`; `born = core`; `glue(U.space, V.space, [...composed.roles, ...born.roles], …)`; and :614 `edge.born`)** — reads: The parents' edge's meet-core: his unconditional pairs plus the pairs given in every light's triads. (i) conflicts are left out, (ii) held-back pairs are left out. This core is glued into the born vertex's space as its J, and Resolved.edge.born = the core. Every consumer of the core is a born vertex's glue, so at born corners means everywhere.
  - seen: MEASURED (scratchpad probe P2, flow/t-cell/phi/triangle on a tetrahedron). Triads (F7,r0,Φ1) were given at A·B·C and (F7,r0,x) at A·B·D, with no pair of his, then one dissection. Result: AB's edge.born.roles = [[F7,r0]], core.unconditional = [], core.meet = [[F7,r0]], AB's child roles = [] (no instance). From the code (not driven): MidpointSurface draws F7≡r0 as numbered pair line 1. It lists it as `1 F7 ≡ r0 · glued: you gave it in C's light and in D's`, with no withdraw. It sets data-midpoint-state="glued" and the sentence `1 role pair · 0 word pairs`, while the counts line reads `AB: 0 relatings`.
  - kind: NEITHER: a §3.11 reading, superseded whole by §9.4. D7/B6: a triad's meet pair is a light, never an IS-instance, so it belongs to neither the IS-part nor FILLED/READ.
  - recommendation: RETIRE the meet from the glue: `born = unconditionalOn(e, options)` (his pairs and τ, the drafts where no record stands). Two things leave the page: the `glued: you gave it in …` pair lines and listings, and the state/sentence that the meet alone made `glued`.
  - freeze: NOT_FROZEN src/lib/spaceOf.ts (C-8 row)
- **src/lib/spaceOf.ts:188-192 `recordOn` → meetCoreOf (the 'one reader of an edge's record')** — reads: The meet-core, for every caller. feetOf :279-280 (`own`, `given`) is the feet group. bornStepOf bornFace.ts:139 is the feet/born-face group. brokenBornActs spaceOf.ts:703 is the acts group: the store's dependency refusal at geometryStore.ts:2383 and :2403, and the meet's own guard (ii) at respects.ts:308.
  - seen: From the code, not run: a meet pair on a medial edge is treated as a 'born act'. A later act can therefore be refused with `your pair at …` naming a pair the person never made. The feet would count it as a pair he gave on that edge.
  - kind: NEITHER (the meet part). Its callers are identity-regime readers already superseded at born corners (feet, bornStepOf) or the acts' check.
  - recommendation: RETIRE the meet: `recordOn(shape, e, options)` returns `unconditionalOn(e, options)`, or recordOn is deleted and the three callers call unconditionalOn. Tell the feet and acts groups that their record loses the meet pairs.
  - freeze: NOT_FROZEN src/lib/spaceOf.ts; NOT_FROZEN src/lib/bornFace.ts; src/store/geometryStore.ts is outside the engine roots (no manifest row)
- **src/lib/spaceOf.ts:599-608 (respectLinksOf + withRespects into M⁺; ⟨X⟩ word content and segments :603-606) and respects.ts:413-452** — reads: One holds-only relation-type `⟨X⟩` per light that has spoken, with tuples on the glued midpoint's points ([a],[b]). The next generation's glue carries them as foreign words (wordContent/wordSegs), and they enter the glued space's signature and relations at every born vertex.
  - seen: MEASURED in probe P2: AB's glued signature carries `⟨C⟩` and `⟨D⟩`. Nothing on the page shows them: no surface hands a born glued space to insideOf (CastInsideDiagram and the columns read columnSpaceOf, CornerRecord draws seed casts only), and the word rows read childSidesOf.
  - kind: NEITHER: §9.46 (3) says the respects are superseded (§9.4) and have no reader at a born corner.
  - recommendation: RETIRE `respectLinksOf`, `withRespects` and the `⟨X⟩` word content and segments. No visible text leaves the page; the glued space only loses words that nobody reads.
  - freeze: NOT_FROZEN src/lib/spaceOf.ts; NOT_FROZEN src/lib/respects.ts (C-14 row)
- **src/lib/spaceOf.ts:617 and :141-142 (`Resolved.respects = readRespects(...)`, `Resolved.core`); respects.ts:330-409 (readRespects, coreMapOf, legReading(With), verdictOf, RespectReading)** — reads: Each respect a↦b⟨c⟩ on the parents' edge, read against the meet-core of its two legs (P–light, light–Q) through coreMapOf. The result is attached to the born vertex's resolution. At generation ≥2, when the light is the shared parent P (a seed apex), both legs are CORNER edges. Their 'core' is then his record there (normally none). It is never D14's coordinate map and never the carried coprojection.
  - seen: MEASURED in P2: AB's readings are [(F7,r0,Φ1) NOT YET, (F7,r0,x) NOT YET]. The corners tab prints `triad: F7 is r0 as regards Φ1 · not yet: nothing is paired on A–C … · withdraw` (MidpointSurface:1664-1679, seed apex only) and the `differ` line (L1207-1218). From the code, not driven: at a gen-2 site whose light is P, the legs read 'nothing is paired on AB–A' across a coordinate link.
  - kind: NEITHER: superseded reading.
  - recommendation: RETIRE `Resolved.respects`, `Resolved.core`, readRespects, coreMapOf, legReading(With), verdictOf and the RespectReading/MeetCore types. The corners tab's respect lines and the `… differ:` line leave the page (see the CornerRecord site for the withdraw hand).
  - freeze: NOT_FROZEN src/lib/spaceOf.ts; NOT_FROZEN src/lib/respects.ts
- **src/lib/respects.ts:206-326 (unconditionalOn :209, lightsOf :216, meetPairsOf :227, meetConflictsOf :252, meetCoreOf :284; guard (ii) :302-313 → brokenBornActs, which reads spaceOf at both born ends of every medial edge (spaceOf.ts:707-708), composedOn's anchored meet and stoneOn)** — reads: The meet-core itself. Guard (ii) checks a candidate meet pair against every born act through the identity regime's glued spaces at born corners (an anchored meet, the stone and the register on the pushout).
  - seen: `left out: …` lines (MidpointSurface:1191-1197) and `held back: F7 ≡ r0 would break the pair … at AB·AC, one generation up` lines (L1198-1206), under the acts list.
  - kind: NEITHER: a superseded reading guarded by the glued space, which is no reader's space at a born corner.
  - recommendation: RETIRE meetCoreOf, meetPairsOf, meetConflictsOf, lightsOf, LeftOut, HeldBack and MeetCore. KEEP unconditionalOn: it is B1's base read for relatings.ts:129 and instanceSpace.ts:356, and could move to relatings.ts, which would also break the respects↔instanceSpace cycle the triadOf move creates. Disappears: the left-out and held-back lines.
  - freeze: NOT_FROZEN src/lib/respects.ts
- **src/lib/respects.ts:193-204 `triadOf`: each pick checked as `spaceOf(shape, p.corner).space.roles` (or `.signature`); caller geometryStore.ts:1306-1322 giveTriad; refusal shown at MidpointSurface:1491-1496 (data-midpoint-triad-refusal)** — reads: At a born corner (site.a/site.b at generation ≥2, or a born light), the resolver's glued space. The picks come from the columns: columnSpaceOf, the child, at MidpointSurface:397-398, 472, 578, 846. Word picks come from the word rows, which offer READ's words (childSidesOf) at :402-403, 474, 595, 1060.
  - seen: MEASURED (probe P1). A–B holds F5≡r0 and `F2 sustains r1`, A–C holds F7≡Φ1, then one dissection, at face A·AB·AC. AB's column offers [`F5≡r0`, `F2 sustains r1`]; AB's glued space has 23 roles (`A:F1`, `A:F2`, …, `F5≡r0`, …). triadOf(A:F1, AB:`F5≡r0`, AC:`Φ1≡F7`) is TAKEN. triadOf(A:F1, AB:`F2 sustains r1`, AC:`Φ1≡F7`) is REFUSED with `F2 sustains r1 isn't a role of AB`: the act refuses a point the column draws and offers, in words that deny the column. The IS pick passes only because the glue's key `x≡y` happens to be spelled like the instance key. Glued leftovers such as `A:F1`, which no column offers, would be accepted.
  - kind: MODES. The triad record is read by the modes layer as a path through the light (sorting.ts:722, 759-761, 492, 540-542; §9.4 'kept as record'), and a pick is a point of what the corner holds as a cast, i.e. the columns.
  - recommendation: MOVE (if the act survives; see questions). Roles → `columnSpaceOf(shape, corner, options)`: a seed gives its cast, a born corner its child roles, and null keeps the refusal `<X> holds no space yet`. Records do not change role ids. Words → `childSidesOf(shape, corner, options).signature`, exactly what the word rows offer. The store keeps passing `{ tauDrafts }`. Cycle: instanceSpace imports respects (unconditionalOn); move unconditionalOn to relatings.ts, or resolve the cycle at call time as spaceOf↔respects already does. If the act is retired instead, giveTriad, the light's pick routing (:578, :595, :846, :1060) and the pending lines leave the page, and withdrawTriad stays.
  - freeze: NOT_FROZEN src/lib/respects.ts; geometryStore.ts and MidpointSurface.tsx are outside the engine roots
- **src/components/MidpointSurface.tsx:476 `nX(corner,id) = nameIn(spaceOf(shape, corner).space, id)`, as the triad pending line uses it at :1175 (`nX(light, triadPicks[light])`)** — reads: The glued space at a born light, used to name a child key picked from the light's column.
  - seen: Text of the pending line, data-midpoint-triad-pending. From the code: a mode-instance key is not in the glued space and prints as the raw key; an IS key prints the glue's label rather than the column's sentence or his given name. nX is also used by the respect lines (:1671-1675, retired above) and the altitude's underHands (:1084, another group).
  - kind: MODES (a light pick is a column point)
  - recommendation: MOVE the pending line to the existing `nL` (:475: nameIn(lightSpace, id), where lightSpace = columnSpaceOf with his records), so the line names the point the way the light's column labels it.
  - freeze: outside the engine roots (no manifest row)
- **src/components/MidpointSurface.tsx:1437 and :1470 `!!spaceOf(shape, apex)` gate the strip's `C's light` button and the `open C's light` line, the route to the triad and to the altitude** — reads: Whether the glued space at a (born) apex resolves.
  - seen: From the code, not driven: at a born apex whose child has no relating, spaceOf is non-null while columnSpaceOf is null (M10, the 16:26 1b rule). The button shows anyway. Opening it gives no third column (lightInside null), no light panel (:1529 needs lightSpace), and nothing to pick.
  - kind: MODES (D-4: the light IS the child; :469-472)
  - recommendation: MOVE to `columnSpaceOf(shape, apex, { records: childRecords })`, the lightSpace reader. Shared with the light/altitude group; say so to them.
  - freeze: outside the engine roots
- **src/components/MidpointSurface.tsx:477-478, 525-527, 1186-1219 (`core = resolved.core`, `respectsAt`, `spokenLabels`, `lightsWords`, `byLights`; the lights block)** — reads: Resolved.core (spoken, lights, leftOut, heldBack, meet, unconditional) and Resolved.respects at the midpoint, a born vertex, at every generation.
  - seen: data-midpoint-lights with data-midpoint-light-line = one-spoken (`only C's light has triads on A–B; nothing is glued until D's light has some too`), left-out, held-back and differ.
  - kind: NEITHER
  - recommendation: RETIRE by name: the whole data-midpoint-lights block and its derivations.
  - freeze: outside the engine roots
- **src/components/MidpointSurface.tsx:1111-1114 and 1151-1152 (`byLights` branch: data-midpoint-glued-by="lights"); :419-420 `roles`/`types` = edgeInfo.born, feeding pairLines :697, state :528, sentence :944, the word-pairs list :1150, isPartOf's τ :425 and the conflict box's withdraw list :1228-1237** — reads: Resolved.edge.born (the core) and core.meet vs core.unconditional.
  - seen: Numbered pair lines and listings `· glued: you gave it in C's light and in D's` with no hand, and word pairs likewise. From the code, not measured: if the register ever refused a meet pair, the conflict box would list it with a withdraw that acts only on his record (4,329 two-pair tries on flow×t-cell found no refused pair, so this is not established either way).
  - kind: NEITHER (the meet part; the rest of roles/types is the pairing group's)
  - recommendation: RETIRE the meet branch. Once born = unconditional (first site), byLights is always false, so delete it and its `glued-by` attribute. pairLines, state and sentence then read only his pairs.
  - freeze: outside the engine roots
- **src/components/MidpointSurface.tsx:1616-1679 CornerRecord `respects` prop and its lines (data-midpoint-respect-line, data-midpoint-respect-kind, data-midpoint-triad-withdraw), printed only for a seed apex (`!bornApex`): every gen-1 site, and gen-≥2 sites whose light is the shared parent** — reads: Resolved.respects (readings on the born midpoint's resolution); names through nA/nB (column first, glued fallback) and nX.
  - seen: `triad: F7 is r0 as regards Φ1 · honored | broken on C–B, where you paired … | not yet: … · withdraw`; `word triad: …` likewise.
  - kind: NEITHER (the reading). The withdraw hand is the triad RECORD's.
  - recommendation: RETIRE the reading lines by name. The withdraw hand (data-midpoint-triad-withdraw → withdrawTriadOf :636) is the triad record's only hand on the page, so it must be re-homed if the triad stays as act or record (question). The foot lines in the same block are the feet group's.
  - freeze: outside the engine roots
- **src/lib/castInside.ts:102, 140, 147, 188 (InsideCensus.respects; skip of isRespectType tuples) and src/lib/feet.ts:17-29 (RESPECT_OPEN/CLOSE, respectTypeName, isRespectType)** — reads: `⟨X⟩` tuples in whatever cast insideOf is handed; respectTypeName is used only by respectLinksOf.
  - seen: Nothing in the app: no surface passes a born glued space to insideOf. Only the witness diagnose-the-respects §e passes spaceOf(...).space.
  - kind: NEITHER
  - recommendation: RETIRE with the ⟨X⟩ site above: census.respects, respectTypeName, and isRespectType or its castInside skip. The guard law allows the skip to stand, but no producer of ⟨X⟩ remains and none is stored, while the skip would hide a caster's word beginning `⟨`. Disappears: nothing visible.
  - freeze: NOT_FROZEN src/lib/castInside.ts (C-7a row); NOT_FROZEN src/lib/feet.ts (C-12b row)
- **src/lib/spaceOf.ts:154 TRANSPORT_OPTIONS {respects:false, feet:false}; SpaceOfOptions.respects :174 and meetDependency :179; callers transport.ts:44 and liftedConceptModel.ts:104** — reads: The switch that turns the respects off on a read.
  - seen: Nothing. Both callers hand it only for SEED vertices, where seedResolved ignores options, so it is already inert: a name of intent protecting code that no longer fulfils it.
  - kind: NEITHER
  - recommendation: RETIRE the `respects` key and `meetDependency` together with the meet-core. Whether TRANSPORT_OPTIONS survives as a `feet:false`-only no-op is for the feet group to say.
  - freeze: NOT_FROZEN src/lib/spaceOf.ts; NOT_FROZEN src/lib/transport.ts; NOT_FROZEN src/manuscript/liftedConceptModel.ts

### Witnesses that pin it

- scripts/diagnose-the-respects.cjs (574 lines, ~45 checks). §0 purity pins the five import lines of respects.ts. §a/§b (the record, the act, the atomic refusals by name) are all at seed corners and stand. §c is the meet-core: one light gives an empty meet; both lights glue it (Rm.edge.born, 23 vs 24 roles); FENCE 1; FENCE 6 (⟨C⟩/⟨D⟩ on M's points); (i) twice/unconditional; (ii) held back at gen 2 through brokenBornActs; the P6 reproduction over scripts/fixtures/meet_core_P6_configs.json (4,000 draws). §d is the readings, incl. the P2d census by the port and through the app (2,106 triads), and 'the readings ride the resolution'. §e covers the next pushout's ⟨C⟩/⟨B⟩ at ABAC, the drawing's census.respects, the door and the cargo. §f has FENCE 5·6 source pins on spaceOf.ts's `const core = … meetCoreOf` and `born` lines. §g has the respect lines first in C's block, honored/broken, and `glued: you gave it in …` (data-midpoint-glued-by="lights", data-midpoint-lights, data-midpoint-light-line). §h has withdraw-all byte-equal (counted by ⟨C⟩ words) and the word-triad grammar. §c/§d/§e(part)/§f/§g/§h are re-pinned to the retirement, with the old behaviour as the positive control at the base.
- scripts/diagnose-modes1-the-transport.cjs §0 (`J(TRANSPORT_OPTIONS) === {respects:false, feet:false}`), §a (the full reading at AB carries the meet pair and ⟨C⟩/⟨D⟩, triads at :97-98, R.meetCoreOf :104), §e :230 (`spaceOf(shape, AB)` still reads the respects, full.respects.length === 2 — it pins the very thing §9.46 retires) and :232.
- scripts/diagnose-the-born-room.cjs:798 pins spaceOf.ts's import line `import { meetCoreOf, readRespects, respectLinksOf, withRespects, type MeetCore, type RespectReading } from './respects';` and the import count 8.
- scripts/diagnose-modes1-the-edge-in-modes.cjs:186 (readAll: recordOn, R.meetCoreOf, R.readRespects), :190 (a triad at A·B·C), :65 and :197 (unconditionalOn stays).
- scripts/diagnose-f3-the-drafts-persist.cjs:44, 74 (readersAt reads R.edge.born, R.core, readRespects), :110-117 (§b: an edge joined only through triads, round trip). Once the meet retires, that edge holds no pair; the case is re-read.
- scripts/diagnose-the-stone.cjs:53 (imports respectTypeName and isRespectType) and :343 (pins castInside's `import { isFootType, isRespectType } from './feet';`).
- scripts/diagnose-the-inside.cjs:329 (pins the same castInside import line and the import count 3).
- scripts/diagnose-modes1-the-sorting.cjs:313 §h (at Value–Action 'its respect line is there': data-midpoint-respect-line).
- scripts/diagnose-the-midpoint.cjs:562 (counts 17 store give/withdraw hooks in MidpointSurface). Changes only if giveTriad, withdrawTriad or withdrawTriadAttempt leave the surface.
- scripts/diagnose-the-lift-carries.cjs:42 imports TRANSPORT_OPTIONS (keep the export or re-pin).
- DRIVE FAMILY: scripts/app-leg/concept_layer_eye_driver.py triad_arm (:1156-1282: data-midpoint-triad-head/-pending/-picked/-refusal/-withdraw/-withdraw-attempt, data-midpoint-respect-line, data-midpoint-glued-by, data-midpoint-light-line) and word_triad_arm (:1284-1305, :1554-1590, data-midpoint-word-triad-pending, data-midpoint-respect-kind="word"); scripts/app-leg/diagnose-the-concept-layer-eye.cjs:508, 552 (st.respects lines). Both arms are at gen 1, AB, with seed lights C and D. They run with this build because what the person sees in the triad and its lines changes.
- NONE pins a triad at a BORN corner. Every giveTriad/triad() in scripts/ is on seed faces (A·B·C, A·B·D). The triadOf move needs a new arm at A·AB·AC (probe P1's case: a mode instance taken, a glued leftover refused) with its positive control at the base.

### Open questions (not decided here)

- Does the TRIAD ACT survive §9.4 ('§3.11 whole (kept as record)') and §9.46? Today a column click in an open light makes a triad (MidpointSurface:578, 595, 846, 1060), and the pairing's ? note still teaches it (pairingHelp :310). If it stays, triadOf moves to the columns' reader. If 'kept as record' means only the triads already given are carried (ambo carriedTriads, the lift verbatim, export), read by the sorting as paths, and withdrawable, then giveTriad, the light's pick routing and the pending lines retire.
- Where does a given triad's withdraw hand live once the respect lines retire? CornerRecord :1676 is its only hand on the page. The candidates are the modes tab's passages, where the sorting already reads the triad (`by: 'triad'`), or the list of his acts under the drawing.
- Confirm that retiring the meet-core ends the only way triads ever glued anything. An edge 'joined only through triads' (diagnose-f3 §b; probe P2) would then hold no pair and draw no line. Every consumer of the core is a born vertex's glue or a line on a born vertex's page, so 'no reader at a born corner' amounts to retiring it everywhere, while the triad record on the face stays.
- Triads already recorded at born corners were validated against the glued space and may name keys like `A:F1` that no child holds. Are they carried and marked like 'a pair kept from before' (MODES-3 ruling 1), or treated some other way? The sorting would read them as paths between non-roles.
- A word triad at a born corner can only pick READ's pulled-back keys (childSidesOf), since that is what the word rows offer. Under §9.46 (3) READ is 'shown beneath only' for modes readers. Is a READ word a lawful pick? This is the same question the code already flags open for his word act (MidpointSurface:400-401).

## THE STONE AND THE DEPENDENCY GUARDS: the stone at the act (C-8c), the dependency guard (C-8 item 4, MidpointDependency, data-midpoint-dependency*), and midpointAct's composed refusals with their reads of RA/RB and composedOn

**Estimate: about 5 h.**

This group has 14 sites. None is in a frozen file: geometryStore.ts and MidpointSurface.tsx are outside the manifest's roots (no row), and spaceOf, instanceSpace, respects and jRegister are NOT_FROZEN. All the run results below come from a headless probe in the scratchpad, driving the store's own acts and writing nothing to the repo. No eye saw any of it.

What I ran:
- **The fallback lets a leftover pair in.** The `columnSpaceOf(...) ?? A` line in midpointAct (geometryStore.ts:2308) falls back to the resolver's glued space when a born end's child holds no relating. On the respects witness's fixture it took and wrote A:Φ1 ≡ B:r0, a pair between two parents' leftovers that MODES-3 ruling 1 forbids. That witness's held-back arm only works because of this path.
- **The composed refusal is D15 under another name.** composedOn feeds it, but the composed pairs on column points equal D15's shared-coordinate pairs read off the child: 2 of 14 at ABAC, 1 of 29 at generation 3. On corner edges the composed branch never fires, because M1 catches both of its pairs first.
- **The generation-3 sentence sends him to a refused act.** It says `…which you do on AC–AB`, but that pair is inherited there and is refused as `these are already one`. The cause: `paired` reads only his pairs (instancesOn), not the inherited ones, and the names come from the resolver.
- **The role stone can move to the child unchanged.** The resolver's seed content equals the content read off the child's coordinates on every key the act can reach.
- **No IS pair lands on any born edge.** Through the store, 0 of 6 pairs were taken at ABAC, 0 of 42 at A–AB and 0 of 1 at generation 3.
- **The word guards are dead.** wordPairForm checks the resolver's signature and refuses every word chip at a born corner (36 of 36 at each edge), printing keys to him. So the composed word refusal and the word stone are never reached, and the word stone is reachable nowhere. This belongs to the §9.48 Q4 build.
- **brokenBornActs has almost nothing to guard.** No medial edge holds a born record on the fixture. Its only inputs are pairs made through the `?? A` path, the respects' meet on medial edges, and legacy records.
- **A gap in the child's guard.** orphansAmong skips edges with a seed end, so a relating on the corner edge A–AB was silently orphaned when the generation-0 pair it rests on was withdrawn.
- **One witness passes on nothing.** The stone-in-dependency arm of born-room §4b matches a phrase src no longer prints, and passes only because both sides count 0.
- **A dead binding.** MidpointSurface.tsx:418 binds the resolver's composed identity and never reads it.

What I recommend:
- MOVE the end gate and the fallback to the child; a born end with no relating is refused with `AB holds no relating yet`.
- MOVE the composed refusal to the D15 predicate read off the child, with `paired` reading his and the inherited pairs and names through termWordsOf. RETIRE the fallback sentence and cornerWords by name.
- MOVE the role stone to a seed-content-by-coordinates reader. It needs a manufactured falsifier, since it changes no behaviour on these fixtures.
- RETIRE both brokenBornActs calls from the store; orphanedRelatings is the model §9.48 Q3 names.
- Extend orphansAmong to edges with one born end.
- RETIRE the dead binding and the discarded stone pairText.

Adjacent and not counted: refusalOf (the J register), the word act (§9.48 Q4), and the held-back reading (respects).

Five hours, covering code, re-pins and new arms, plus one run of the drive-family eye leg. The open questions are §9.46 (6) on dark pairs and which reason speaks on a corner edge. Two retirements need the mothership: brokenBornActs' resolver arms and C-14 (ii). The generation-3 inherited sentence needs the designer's words.

### Sites

- **src/store/geometryStore.ts:2228-2234 resolvedEnds, consumed at midpointAct :2255-2259 (RA, RB, A = RA.space, B = RB.space)** — reads: spaceOf at both ends of the acted edge, with {tauDrafts} only (respects and feet on, not TRANSPORT_OPTIONS). At a born end this is the resolver's glued M+. It feeds every site below. `if (!ends) return` does nothing and says nothing.
  - seen: Nothing directly. A seam at a seed corner with no cast does nothing silently (pinned by diagnose-the-midpoint.cjs §3).
  - kind: neither: it is the source of RA/RB for both regimes
  - recommendation: MOVE the gate to columnSpaceOf at both ends. A born end whose child holds no relating is refused in M10's words (`AB holds no relating yet`, holdNoSpaceWords). A seed with no cast stays silent. RA/RB cannot leave midpointAct inside this group alone: wordPairForm (:2363, the §9.48 Q4 build) and refusalOf (:2379, the J register) still read them. They retire when those move.
  - freeze: no manifest row: src/store is outside the engine roots (src/lib, src/playground, src/manuscript, src/types), so it is free to edit
- **src/store/geometryStore.ts:2308-2309 `columnSpaceOf(...) ?? A` and `?? B` (the membership gate D-2 left in)** — reads: When a born end's child holds no relating, its column is null and the act falls back to the resolver's glued space: the parents' disjoint union, all leftovers.
  - seen: RUN (scratchpad probe through the store, headless, not seen by an eye). I used the respects witness's §c(ii) fixture: one triad, no pairs, two dissections. Both columns at AB–AC are null. The pair A:Φ1 ≡ B:r0, between two parents' leftovers, was TAKEN and written: {"roles":[["A:Φ1","B:r0"]]}. MODES-3 ruling 1 forbids such a new born pair, and §9.46 (1) makes it no reader's. The page offers no point there (the view's gate), so it cannot be reached by hand, but every store caller of giveRolePair or giveRelating(IS) can reach it.
  - kind: neither: a membership gate, which lets a pushout leftover into the record
  - recommendation: MOVE: drop the fallback. A null column refuses with `<corner> holds no relating yet` (M10). This breaks diagnose-the-respects.cjs §c(ii), whose born pair on AB–AC is made through this path. It re-pins diagnose-the-midpoint.cjs §3 (`/^x isn't a role of /` at a born seam). It may move the share/disjoint tallies of born-room §4b :681 on the synthetic tower.
  - freeze: no manifest row (outside the roots), free
- **src/store/geometryStore.ts:2311-2312 `nameIn(A|B, x)` in the not-a-role refusal; :2359 stoneWords' pairText `${nameIn(A,x)} ↦ ${nameIn(B,y)}`; src/components/MidpointSurface.tsx:410-413 nameFrom falling back to parents[i].space for nA/nB in the refusal box** — reads: The resolver's label for a key no column offers. pairText is computed and then thrown away: stoneWords does `void pairText` (spaceOf.ts:673).
  - seen: `not taken — r3 isn't a role of AC` (born-room §4 :517 pins `/isn't a role of A[BC]$/` and no `A:` prefix). On the box, a kept stray's name, e.g. `… names a role that isn't in its cast`.
  - kind: neither: it names an old record's key
  - recommendation: MOVE the leftover's name to the parent's own name (strip the glue's side prefix and read it at that parent's column, the rule of spaceOf.ts shownName). Or RETIRE it once site 2 refuses null columns, because then such a key can only come from a stale caller. RETIRE the discarded pairText argument now: nothing on the page changes.
  - freeze: geometryStore.ts and MidpointSurface.tsx: no manifest row (outside the roots); spaceOf.ts: NOT_FROZEN
- **src/store/geometryStore.ts:2329-2338, the M1 refusal on a CORNER edge, name at :2337 `nameIn(parentFirst ? A : B, a)`** — reads: The check itself reads the child (instancesFrom, inst.p === a). The parent role's NAME comes from the resolver's space of the parent end.
  - seen: `not taken — (F7 ≡ r0) already holds F7, so it's carried there`. RUN: 2 of 42 pairs at A–AB. Where the parent is born (corner edges at generation ≥ 2) the name would be the resolver's chain label (`F7 ≡ r0`), not the child's `(F7 ≡ r0)`. This is inferred from the generation-3 run under site 6; I did not run it here.
  - kind: identity (D14, the coordinate map)
  - recommendation: MOVE the name to termWordsOf(shape, P, a). modes4 §e pins the sentence at a seed parent, and that sentence does not change.
  - freeze: no manifest row (outside the roots), free
- **src/store/geometryStore.ts:2299-2300 `composedOn(shape, RA, RB, [...], kind)` and cornerWords** — reads: The resolver's composed identity: on a corner edge the carried coprojection, on a medial edge the anchored meet over glued keys.
  - seen: Nothing directly; it gates sites 6, 7 and 12. RUN: at ABAC, 14 pairs, 2 of them on column points, exactly equal to D15's 2 shared-coordinate IS pairs read off the child. On the gen-3 edge ABBC–ACBC, 29 pairs, 1 on column points, equal to D15's 1. On corner A–AB, 14 carried pairs, 2 on column points, both caught first by M1, so the composed branch never fires on a corner edge (0 of 42). The other 12 and 28 pairs are on leftovers, which D-2's column check already refuses.
  - kind: identity: the pushout, which §9.46 (3) retires at born corners. modes4 §h measures it composing the PROPOSAL pair where D15 inherits the FIX alone.
  - recommendation: RETIRE composedOn from midpointAct's role arm; site 6's D15 predicate replaces it. It stays only for refusalOf (:2379) and the word arm (:2365) until those move.
  - freeze: geometryStore.ts: no manifest row; spaceOf.ts: NOT_FROZEN
- **src/store/geometryStore.ts:2339-2353 the composed ROLE refusal → solidRefusal (:2269-2286, names at :2282 through spaceOf + nameIn) / solidWords (:2287-2294) / the fallback :2348-2349** — reads: The gate is the resolver: composed.roles holds (x, y). solidRefusal then reads the child (instancesFrom shared-parent coordinate; `paired` from instancesOn on Qu–Qv, his pairs only). It names P's, Qu's and Qv's roles from the resolver.
  - seen: `not taken — these are already one: both hold F7, and you paired r0 with Φ1 on B–C`, or `not taken — both hold F13, so this means pairing r8 with Φ8, which you do on B–C`, with the hand `open B–C` (data-midpoint-open-site) and the attribute data-midpoint-refusal-solid. The fallback `the solid already makes … one, through …; you can't pair or withdraw that` fired 0 times in what I ran. RUN DEFECT at generation 3 (ABBC–ACBC): the act says `both hold r0 ≡ Φ1, so this means pairing F7 ≡ r0 with Φ1 ≡ F7, which you do on AC–AB`. But on AC–AB that pair is INHERITED (instancesWithInherited holds ["Φ1≡F7","F7≡r0"]; his own IS there: none), and the act there refuses it as `these are already one`. The gen-3 pair itself is also inherited (inheritedISOn holds it). So the sentence and its `open AC–AB` hand send him to an act that is refused. The names are resolver labels (`r0 ≡ Φ1`) where the child reads `(r0 ≡ Φ1)`.
  - kind: identity (D15: pairing two instances through a shared coordinate is refused at every such pair, §210 generalized)
  - recommendation: MOVE to the child. Gate on solidRefusal's own predicate: two IS-instances of sibling children with an equal shared-parent coordinate (instancesFrom), not composed.roles. Read `paired` from instancesWithInherited, his and inherited, since D15 inherits twice. Name through termWordsOf. RETIRE by name the fallback sentence and cornerWords: they speak only for a pair the resolver composed beyond D15.
  - freeze: no manifest row (outside the roots), free
- **src/store/geometryStore.ts:2363 wordPairForm(A, B, …), which precedes :2364-2368 the composed WORD refusal and :2374-2376 the word stone `stoneOn(RA, RB, s, w, 'word')`** — reads: The resolver's glued signature (display words) for the form check; composed.words; RA/RB.wordContent keyed by display word.
  - seen: RUN: every word act at a born corner is refused at the form check, before either guard is reached. The row's chips carry READ's keys, and 0 of 25 and 0 of 17 are in the resolver's signature. At ABAC 36 of 36: `not taken — neither "A:component-of" nor "B:…" is a word of these casts`. At A–AB 36 of 36: `AB's cast has no word "A:…"`. Keys are printed to him. So the composed word refusal and the word stone are dead at born corners. At seed edges the word stone cannot fire (two different seed corners), so it is reachable nowhere.
  - kind: identity (seed-word pooling; the shared corner's words composed by the device, Δ85)
  - recommendation: This belongs to the §9.48 (Q4) build: τ on the children's FILLED words (childSpaceOf with records); on a corner edge, no word act, refused in its own words. In that build, RETIRE the word stone by name (`this pair would make s and t one, and they are two words of A`), because FILLED kinds carry no seed-word content. No witness pins `two words of`. The composed word refusal waits on §9.46 (6) (one word or two). Not counted in this group's hours.
  - freeze: geometryStore.ts: no manifest row; jRegister.ts (wordPairForm): NOT_FROZEN
- **src/store/geometryStore.ts:2356-2359 the ROLE stone `stoneOn(RA, RB, x, y, 'role')` (src/lib/spaceOf.ts:659-673)** — reads: RA/RB.roleContent, the resolver's seed tags for the two keys.
  - seen: `not taken — this pair would make F1 and F7 one, and they are two roles of A` (data-midpoint-refusal-form, one hand `clear`). RUN: 2 of 6 pairs at ABAC (the different-coordinate pairs) and 26 of 42 at A–AB. The resolver holds every column key the act can reach; the keys it lacks are mode instances, which D-2's §9.46 (6) refusal stops first. On every key it holds, its content equals the content read off the child's coordinates (2/2 and 2/3; 2/3 and 14/14; 1/1 and 1/1). So the move changes nothing on these fixtures.
  - kind: identity (§6 invariant 3, read through the IS-instances and the coordinate maps)
  - recommendation: MOVE to the child with a new seed-content-by-coordinates reader in instanceSpace.ts: a seed role gives its tag; an IS-instance (his or inherited) gives the union of its two coordinates' contents, recursively through instancesFrom; a mode instance gives none. stoneOn then runs over those contents, and the stoneClause words stay. Because the cut changes no behaviour it needs a manufactured falsifier. Whether it should still fire at medial edges is §9.46 (6)'s open question.
  - freeze: geometryStore.ts: no manifest row; spaceOf.ts and instanceSpace.ts: NOT_FROZEN
- **src/store/geometryStore.ts:2383-2384 (midpointAct) and :2403-2407 (midpointWithdraw): brokenBornActs (src/lib/spaceOf.ts:698-753) → dependencyOf (:2241) → MidpointRefusal.dependency** — reads: For each medial edge holding a born record (recordOn = the meet-core): spaceOf at both ends (:707-708), composedOn (:718), membership in U/V.space (:726-727), stoneOn (:731, :743), refusalOf (:748).
  - seen: The box: `not taken — pairing X with Y would break the pair A ≡ B at <site>, one generation up: <why>`, with hands `clear` and `withdraw A ≡ B at <site> first` (data-midpoint-refusal-dependency, data-midpoint-dependency-withdraw). RUN: on the gen-2 fixture no medial edge holds any born record (0), and 0 are broken. By construction no IS pair lands on any born edge (D15 + stone + M1 + §9.46 (6), RUN: 0 taken at ABAC, A–AB and the gen-3 edge), and no word pair lands at a born corner (site 7). So its only inputs are pairs made through the `?? A` path (site 2), the respects' meet on medial edges, and legacy records. The relating dependency the eye drives (`… is one end of … carries … at ABAC, one generation up`) comes from orphanedRelatings, the child's reader, and is not this call.
  - kind: identity (born IS pairs re-read against the pushout)
  - recommendation: RETIRE both store calls: the pair-dependency box from brokenBornActs disappears, and the orphan box stays. §9.48 (Q3) names orphanedRelatings as the guard's model. Keep brokenBornActs in spaceOf.ts only while respects.ts:308 reads it. Re-pin diagnose-the-midpoint.cjs §5, which counts exactly 2 brokenBornActs calls in the store source.
  - freeze: geometryStore.ts: no manifest row; spaceOf.ts: NOT_FROZEN
- **src/lib/instanceSpace.ts:471-520 orphanedRelatings / orphanedByKeys / orphansAmong, with the skip at :493; called at geometryStore.ts:2386, :2410 and :1402** — reads: childSpaceOf now and then, i.e. the child; this guard already reads the right space. RUN GAP: `continue; // both ends born: generation ≥ 2` skips every edge with a seed end, and brokenBornActs covers medial edges only. So a relating on a CORNER edge at generation 1 has no guard. I made `F2 carries (F7 ≡ r0)` on A–AB, then withdrew F7 ≡ r0 on A–B: TAKEN. The relating stays held, with an end AB's child no longer holds, a silent stray.
  - seen: Nothing: the withdrawal goes through silently. That is against Δ85's ruled line and §9.48 (Q3), `nothing he said at a later generation is ever dropped silently`.
  - kind: the dependency guard in the child's terms (C-8 item 4); it guards both regimes' records
  - recommendation: MOVE (extend) orphansAmong to every edge with at least one born end, reading a seed end as its cast (childSpaceOf already does). Add a new witness arm at the corner edge.
  - freeze: NOT_FROZEN src/lib/instanceSpace.ts; geometryStore.ts: no manifest row
- **src/lib/respects.ts:302-312, meetCoreOf's guard (condition ii) → brokenBornActs, shown at src/components/MidpointSurface.tsx:1198-1206** — reads: brokenBornActs (resolver) for each kept meet pair, one edge deep; on the page, resolved.core at the site.
  - seen: `held back: F7 ≡ r0 would break the pair … at …, one generation down` (data-midpoint-light-line="held-back").
  - kind: identity (the core of J, the respects)
  - recommendation: ADJACENT (the respects group). §9.46 (3) gives the respects no reader at a born corner. With no born pair lawfully standing on a medial edge, (ii) protects only legacy pairs and `?? A` pairs, so RETIRE it by name with the respects: the `held back:` line disappears. diagnose-the-respects.cjs §c(ii) pins it, and its fixture already depends on the `?? A` path. Not counted in this group's hours.
  - freeze: NOT_FROZEN src/lib/respects.ts; MidpointSurface.tsx: no manifest row (outside the roots)
- **src/store/geometryStore.ts:2379 `refusalOf(A, B, [...composed.roles, ...nextRoles], [...composed.words, ...nextTypes])`** — reads: The resolver ends' records (M+, including the feet `≡_X`, the `⟨X⟩` tuples and the leftovers) plus the composed identity.
  - seen: `not taken — with F1 ≡ Φ9, A's and B's records contradict each other` and `conflict: …` lines (the eye leg pins it at :165).
  - kind: identity (the J register's check, §9.46 (3))
  - recommendation: ADJACENT (J-register group): MOVE to the child's IS-part with READ restricted to its points (isPartOf / instanceSpaceOf IS-part), and drop composed from its arguments. diagnose-the-midpoint.cjs §5 pins this exact source line, so it re-pins. Not counted here.
  - freeze: no manifest row (outside the roots); jRegister.ts: NOT_FROZEN
- **src/components/MidpointSurface.tsx:418 `const composed = useMemo(() => edgeInfo?.composed ?? …)`** — reads: Resolved.edge.composed at the (born) site. It is bound and never read: no consumer, and tsconfig does not set noUnusedLocals.
  - seen: nothing
  - kind: neither
  - recommendation: RETIRE (delete the binding). Nothing on the page changes and no witness pins it.
  - freeze: no manifest row (src/components is outside the roots)
- **src/lib/spaceOf.ts:627-646 duplicatedSeeds / pooledRoles** — reads: Resolved.roleContent: the stone's census taken on the resolver
  - seen: Nothing. No src consumer; only the witness born-room §3 uses it (:298, :358).
  - kind: identity-regime census, used by a witness only
  - recommendation: Leave it in this cut. Retire it with born-room §3 when the resolver's born branch is retired.
  - freeze: NOT_FROZEN src/lib/spaceOf.ts

### Witnesses that pin it

- scripts/diagnose-the-born-room.cjs §3b :378 and :415: brokenBornActs controls and the withdrawal-guard falsifier, called directly at library level. Unaffected unless brokenBornActs is deleted.
- scripts/diagnose-the-born-room.cjs §4 :508: the composed-pair refusal through the store. It picks RABAC.edge.composed.roles[0] from the resolver, so re-pin it to pick by the child's D15 predicate.
- scripts/diagnose-the-born-room.cjs §4 :517: no new born pair, `/isn't a role of A[BC]$/`, no `A:` prefix.
- scripts/diagnose-the-born-room.cjs §4 :530 and :566: the orphan dependency in the child's terms and its positive control. These are the path that stays.
- scripts/diagnose-the-born-room.cjs §4 :602: IS at a generation-2 site is inherited or refused (the D15 words plus the stone's words). Unchanged at generation 2 once names are read through termWordsOf; verify.
- scripts/diagnose-the-born-room.cjs §4b :681 (the stone behind the columns, through the store, on the gen-3 synthetic tower), :687 (the stone's box) and :701 (the gen-2 census via composedOn). :681's share/disjoint tallies are at risk from the `?? A` move.
- scripts/diagnose-the-born-room.cjs §4b :771 and :778, the stone in the dependency reading: VACUOUS today. Its matcher /which the corner keeps apart/ (:751, :761) matches no sentence src prints, since brokenBornActs now says `it would then make … two roles of A`. The check passes only because the witness's own reading also finds 0. Re-pin it to the current words, or retire it with brokenBornActs leaving the store.
- scripts/diagnose-the-midpoint.cjs §3 :303: a born seam's `/^x isn't a role of /` (re-pins with the `?? A` move) and the silent seed seam (stays).
- scripts/diagnose-the-midpoint.cjs §5 :555: a source pin of the exact refusalOf line with composed, and exactly 2 brokenBornActs calls in the store.
- scripts/diagnose-modes4-the-record-and-the-sorting.cjs §e :347-361: the M1 words and the corner-edge stone `/^this pair would make .+ and .+ one, and they are two roles of A$/`.
- scripts/diagnose-modes4-the-record-and-the-sorting.cjs §h :575-592: composedOn against D15, a measurement only. It calls brokenBornActs(G2, ABAC2.id), passing an id where the options go; it only prints.
- scripts/diagnose-modes1-the-descent.cjs §c :109: the D15 refusal words `both hold F7, so this means pairing Φ1 with r0, which you do on B–C`.
- scripts/diagnose-modes1-the-transport.cjs §D2 :178-196: the act reads the child; the mode-end refusal in §9.46 (6)'s words.
- scripts/diagnose-the-respects.cjs §c(ii) :229-268: held back. Its born pair on AB–AC is made through the `?? A` fallback, so it breaks when that fallback moves.
- DRIVE FAMILY: scripts/app-leg/concept_layer_eye_driver.py :137-138 and :2573-2600, with scripts/app-leg/diagnose-the-concept-layer-eye.cjs :787-792 (the orphan dependency at the eye: the box and its two hands) and :165 (the contradiction box). The trigger holds because the refusal box is in the reading, so this leg runs with the build.

### Open questions (not decided here)

- §9.46 (6), open: the stone at medial edges against D15 (a)'s dark pairs. RUN: today no dark pair can be made at any medial edge. At ABAC, 2 pairs are refused in D15's words, 2 by the stone and 2 at the mode-end check; at the gen-3 edge, 1 is refused in D15's words. Counting the corner edges too (A–AB: 26 refused by the stone, 2 by M1, 14 at the mode-end check), no IS pair lands on any born edge at all. Does a dark pair i ≡ j with π_P(i) ≠ π_P(j) make two roles of P one through the coordinate maps (the IS-part's transitivity)? That answer decides whether the moved stone keeps firing at medial edges. The ruling seat's to rule, not mine.
- The corner-edge stone: on a corner edge, a ≡ i with a ≠ π_P(i) is refused in the stone's words (`this pair would make F1 and F7 one, two roles of A`; RUN 26 of 42 at A–AB). Is that the IS-part's own reason, pooling through the D14 coordinate map? Or is it D14's rule that a corner edge takes no IS entry beyond the map, in which case the refusal should say that instead? The outcome is the same; only which reason speaks differs.
- The dependency guard under the child: if a point's content is read off its coordinates, it is a function of its key. Then the stone-in-dependency arm is vacuous by construction (the born-room witness measured the same mechanism: 0 changed under the kept keys). The D15 arm cannot arise for dark pairs, since their coordinates differ. What remains is orphaning (orphanedRelatings) and the J register's contradiction arm. Does the mothership accept retiring brokenBornActs' resolver arms from the store on that ground?
- C-14 (c)(ii), the meet-core's held-back reading, is ratified. With no born pair able to stand lawfully on a medial edge (only the `?? A` path, legacy records, or meet pairs put one there), it protects nothing a lawful act makes. Retire it, or keep it for legacy records? Retiring a ratified mechanism is the mothership's call (the respects group).
- Copy, for the designer: at generation 3 the D15 sentence must say the pair is already one where the pair it names one generation down is INHERITED, not his. The current form `…and you paired X with Y on E` would be false there. Her words are needed for `inherited there`.

## THE VIEW GATES: midpointViewOf, the App.tsx and ConceptSurface gates, the canvas panel and the inspector card gates, the corners tab and strip light gates, and every "no space" text

**Estimate: about 3 h.**

I looked at every view gate that reads the resolver at a born corner. Read only, at HEAD d16d76c; src is unchanged since 4f69d69. I measured with a node probe in my scratchpad (nothing written to the repo). These are counts and renders under node; nothing was seen at the eye.

**The midpoint view's gate is already decided by the child.** In midpointViewOf (MidpointSurface.tsx:1958) the three spaceOf reads cannot change the verdict, by construction: a non-null column space means every seed under it holds a cast, so the resolver returns too; and the site resolves exactly when its two parents do. App.tsx and ConceptSurface inherit this gate. Moving the predicate to `ca && cb` alone changes nothing on the page. The three reads then only fill the `parents`/`resolved` props, which the names, feet, respects and J-register groups retire.

**Two gates disagree with the reader they open (measured).** At ABAC, with records only on A–B and A–C, the strip offers `BC's light` and `AD's light`, and the altitude lines offer `open BC's light`. Both gates use `!!spaceOf(shape, apex)` (lines 1437 and 1470). But the light's own reader, columnSpaceOf, returns null for BC and AD: each child has 0 relatings. From the code, a click opens an empty light with no third column and an empty tab; node cannot click, so that part is inferred. Fix: MOVE both gates to the light's reader, columnSpaceOf with the records options, through one shared helper. The two ungated openers (the modes tab's `open X's light` and FaceThree's `open`) should take the same helper.

**The canvas panel and the inspector card use the resolver to decide whether to show.** CastInsidePanel (CastInsideDiagram.tsx:637) and SpaceCardRow (Panels.tsx:2572) open on spaceOf. Measured at ABBC, one vertex gets three different sentences:
- card: `the concept between AB and BC, made of 0 relatings`
- canvas panel: `this cast has no roles`
- hover: `holds no space yet: BC holds no relating yet`

Fix: MOVE both gates to childSpaceOf, and take seed vs born from isSeedVertex. This keeps today's behaviour except for a no-edge case I could not reach. It also removes the card's `?? 0`, which prints a count when there is nothing to count.

**Two trivial moves:**
- The traces tab's loaded-cast lines read `.loadedIgnored` off the resolver; holdsLoadedCast gives the identical answer.
- relatings.ts:179 defaults to the resolver. The app's one caller already passes the child, so the default should become the child.

Every other "no space" text already reads the child. Adjacent born-corner resolver reads that are not gates (nX, neighbourActsOn, the foot block, record-in-conflict, triadOf) are listed for their own groups and not priced here.

**Files and effort.** None of the files I name is frozen: src/components and src/App.tsx sit outside the manifest's engine roots, and the src/lib and src/manuscript files are NOT_FROZEN. The estimate is about 3 hours: roughly 1.5 h of code, 1 h for re-pins plus two new falsifiers (the gen-2 light gate with a positive control, and the ABBC card/panel case), and 0.5 h for the drive-family eye run, since what the strip shows changes.

Four questions are open: whether a born corner with no relating should be silent or say M10's sentence; which sentence ABBC should show; whether the feet retire at generation 1 too; and whether a born site can still read `record-in-conflict`.

The probe scripts are in the scratchpad: probe_view_gates.cjs and probe_card.cjs.

### Sites

- **src/components/MidpointSurface.tsx:1958-1971 (midpointViewOf)** — reads: spaceOf(site.a), spaceOf(site.b), spaceOf(vertexId). vertexId is always a born vertex; site.a and site.b are born at generation 2 and above. It also reads columnSpaceOf(site.a) and columnSpaceOf(site.b). The gate is `a && b && self && ca && cb`. By construction the three resolver reads cannot change the verdict. First, ca implies a: a non-null childSpaceOf at a born vertex needs both parents' childSpaceOf non-null, all the way down to seeds that hold casts, and that is exactly what spaceOf needs. Second, self holds exactly when a and b hold, because trace.parentIds = createdBy.sourceVertexIds = the site edge's two ends (generalSitePacketPresenterV0.ts:242). So the gate is already decided by the child.
  - seen: Whether the page shows the midpoint view (App.tsx `data-ambo-page="midpoint"`, MidpointView) or the solid view with the canvas panel. The three Resolved objects are then handed to MidpointSurface as the props `parents` and `resolved`.
  - kind: neither (a view gate; the columns it tests are already the child, MODES-3)
  - recommendation: MOVE the predicate to `ca && cb` alone, and return null before any resolver read. This needs no falsifier change: the verdict is identical by construction. After that, the three spaceOf reads exist only to fill the props, and other groups retire them. The prop consumers: parents[i].space in nameFrom/nA/nB at 410-412; resolved.edge (kind, born, refused, midpoint, composed) at 414-422, which feed the home line, the pair lists, `state`/record-in-conflict and the traces gate; resolved.core at 477 and 525-527; resolved.respects at 478 and 1210; resolved.feet at 545-546; .loadedIgnored at 1571. When the last of these goes, drop `parents`/`resolved` from the return type and drop the three reads. At that point 13 witness files that build MidpointSurface props with spaceOf have to be re-pinned. That cost belongs to those groups, not this one.
  - freeze: no manifest row; src/components is outside the manifest's engine roots (src/lib, src/playground, src/manuscript, src/types), so it is not frozen
- **src/App.tsx:21** — reads: midpointViewOf(shape, selectedVertexId, {tauDrafts}). It has no read of its own.
  - seen: `data-ambo-page` midpoint vs solid; MidpointView vs AmboSolidView
  - kind: neither
  - recommendation: Nothing of its own. It moves with midpointViewOf.
  - freeze: no manifest row; outside the engine roots, not frozen
- **src/components/MidpointSurface.tsx:1987-2009 (ConceptSurface)** — reads: midpointViewOf (the same gate). When that returns null: holdsLoadedCast(shape, v), which reads vertex.data.cast and not the resolver; then CastInsidePanel.
  - seen: The midpoint surface, or the loaded-cast note `X holds a loaded cast that isn't read: a midpoint's space comes from its parents` and the canvas panel
  - kind: neither
  - recommendation: It moves with midpointViewOf. holdsLoadedCast stays: it is not a resolver read, and its sentence is still true of the child.
  - freeze: no manifest row; outside the engine roots, not frozen
- **src/components/MidpointSurface.tsx:1437 (the strip's light button, `const holds = !!spaceOf(shape, apex)`)** — reads: Whether the resolver returns anything at the opposite corner. At generation 2 and above that corner is often born (BC or AD at ABAC; every apex at the corner site A–AB).
  - seen: `X's light` button (data-midpoint-source-open="closed"). MEASURED with a read-only node probe in the scratchpad at d16d76c (src identical to 4f69d69): core dissected, records on A–B and A–C only. At ABAC the strip offers ["BC","AD"], while columnSpaceOf(BC) and columnSpaceOf(AD) are both null (each child has 0 relatings; spaceOf gives BC 19 roles and AD 23). The light's own content reader, lightSpace at :472 (D-4), is columnSpaceOf(light, {records}), which is null. So after the click there is no third column, a `BC's roles` tab whose panel never renders (:1529 needs lightSpace) and no light word row (:1056). That after-click part is INFERRED from the code: node cannot click. This is a MISPLACED refusal.
  - kind: gate of a MODES reader (the light: the configuration and the altitude, §9.46 (3); D-4 already moved its content to the child)
  - recommendation: MOVE to the light's own reader: `columnSpaceOf(shape, apex, mediumOptions) !== null`, as one helper shared with :1470. His records do not change whether it is null, because childArcsOf adds only signature and relations. What the person sees changes: at generation 2 and above, no button appears for a born corner that holds no relating. The same helper should also gate the two light openers that read no space at all: MediumBlock.tsx:849 (`open X's light` for every view in the sorting, and sorting.ts:754 builds views from facesThrough with no space check) and MidpointSurface.tsx:1866-1870 (FaceThree `open`, no gate).
  - freeze: no manifest row; outside the engine roots, not frozen
- **src/components/MidpointSurface.tsx:1470 (the altitude line, `if (!src || !spaceOf(shape, apex)) return null`)** — reads: Same as :1437: whether the resolver returns anything at the opposite corner
  - seen: `X's roles: none related to A or B here yet · open X's light`. MEASURED at ABAC: lines [["BC",0],["AD",0]], each offering to open a light whose reader is null.
  - kind: gate of a MODES reader (the altitude)
  - recommendation: MOVE to the same `lightable(apex)` helper (columnSpaceOf with mediumOptions)
  - freeze: no manifest row; outside the engine roots, not frozen
- **src/components/CastInsideDiagram.tsx:637-644 (CastInsidePanel)** — reads: `resolved = spaceOf(shape, vertexId)`. Whether it is non-null decides if the panel renders at all; `resolved.origin` chooses between seed and born. At a born vertex the content is already the child (columnSpaceOf, or liftedColumnOf when inline).
  - seen: The canvas overlay (ConceptSurface via Workspace3D.tsx:132) and the Manuscript inline drawings (ManuscriptView.tsx:7043 on the lift record, :7055 on the identification image). The head reads `· the cast it holds` / `· the concept it holds`, plus data-inside-origin-of-space. MEASURED: at ABBC and ACBC (their view is closed because BC holds no relating) the panel renders with origin "derived" and the line `this cast has no roles`. On the image, the D19 merged corner is minted as a seed holding its cast (identificationImageModel.ts:316), so spaceOf there is D19's lawful pushout.
  - kind: neither (a panel gate). The inline mount's CONTENT, READ vs IS-part, belongs to the lift group (identity).
  - recommendation: MOVE the gate to `isSeedVertex(shape,v) ? spaceOf(shape,v) : childSpaceOf(shape,v)`, testing only whether each is non-null, and derive origin from isSeedVertex. Keep the attribute values 'seed' and 'derived'. Null in exactly the same cases, except one: a born vertex whose parents have no edge between them in the shape. There childSpaceOf is null and spaceOf is not. I could not find a path that produces it; not measured.
  - freeze: no manifest row; outside the engine roots, not frozen. ManuscriptView.tsx (the mount) is NOT_FROZEN, line 196.
- **src/components/Panels.tsx:2572-2602 (SpaceCardRow, the inspector card's `space` row; mounted only at a born vertex, :2550)** — reads: spaceOf(vertexId). `resolved && resolved.edge` gates the 'derived' row; `resolved.edge.parents` gives the two parents' names in edge order; `!resolved` gates the 'none-yet' row (bare = parentsWithoutSpace, which uses columnSpaceOf). The count is already the child's, but written `childSpaceOf(...)?.roles.length ?? 0`: when the child is null the card prints 0, a count read off an absence.
  - seen: MEASURED (probe, the component made reachable inside the probe's own transpile hook; no repo file touched): at ABBC the card says `the concept between AB and BC, made of 0 relatings`, while parentsWithoutSpace(ABBC) = [BC, 'relating']. So the hover readout (Workspace3D.tsx:2598-2599, same reader) says `holds no space yet: BC holds no relating yet` and the canvas panel says `this cast has no roles`: one vertex, three sentences. At ABAC: `the concept between AC and AB, made of 0 relatings`.
  - kind: neither
  - recommendation: MOVE. Parents from `edgeBetween(shape.edges, ...sourceVertexIds)?.vertexIds ?? sourceVertexIds`. Gate the 'derived' row on whether childSpaceOf(shape, v) is non-null; that is the behaviour-neutral form, and it removes the `?? 0` count-from-absence by construction. The alternative, gating 'none-yet' on parentsWithoutSpace so the card agrees with the hover, changes copy, so it is listed as a question.
  - freeze: no manifest row; outside the engine roots, not frozen
- **src/components/MidpointSurface.tsx:1571-1575 (the traces tab's loaded-cast lines)** — reads: `resolved.loadedIgnored`, `parents[0].loadedIgnored`, `parents[1].loadedIgnored`: Resolved fields at born vertices
  - seen: `X holds a loaded cast that isn't read: a midpoint's space comes from its parents`
  - kind: neither
  - recommendation: MOVE to holdsLoadedCast(shape, id). The predicate is identical for these vertices: Resolved.loadedIgnored is v.data.cast !== undefined on a derived space, and holdsLoadedCast is non-seed && cast !== undefined. This also removes one consumer of the `parents`/`resolved` props.
  - freeze: no manifest row; outside the engine roots, not frozen
- **src/lib/relatings.ts:179 and :195 (relatingOf's default RoleSource `resolverRoles`)** — reads: spaceOf(shape, corner).space, the resolver at a born corner at generation 2 and above, for the act's membership check and for the refusal text
  - seen: `X holds no space yet, so there's nothing to relate` (and `x isn't a role of X`), but only on a call without roleSource. The one caller, geometryStore.ts:1379, passes childSpaceOf; no script calls relatingOf. The app never reaches the default.
  - kind: MODES (the relating act)
  - recommendation: MOVE the default to childSpaceOf, or make roleSource required, so the rule is enforced by construction rather than by its single caller
  - freeze: NOT_FROZEN src/lib/relatings.ts (manifest line 241)
- **ALREADY THE CHILD, checked, no move: MidpointSurface.tsx:1624-1642 (CornerRecord: `no space` / `made of N relatings` / `nothing related between …`, via childSpaceOf; the spaceOf at :1625 runs only for a seed apex) · :1769 (born face `… hold no space here`, via bornReadersOf → transportSpaceOf → childSidesOf) · Panels.tsx:2607-2617 parentsWithoutSpace and Workspace3D.tsx:2598 hover (columnSpaceOf) · liftedConceptModel.ts:99-109 `holds no space` (transportSpaceOf; spaceOf on seeds only) · identificationImageModel.ts:261, doorTransportModel.ts:145, ManuscriptView.tsx:3516 and :4072 (transportSpaceOf) · descent.ts:114-124 NO-SPACE (childSpaceOf)** — reads: the child (childSpaceOf, columnSpaceOf or transportSpaceOf), never the glued space at a born corner
  - seen: the various `no space` / `holds no space` / `holds no relating yet` sentences
  - kind: neither, or already moved
  - recommendation: none
  - freeze: MidpointSurface.tsx, Panels.tsx, Workspace3D.tsx: no row (outside the roots). NOT_FROZEN: liftedConceptModel.ts (221), identificationImageModel.ts (248), doorTransportModel.ts (223), ManuscriptView.tsx (196), descent.ts (246), transport.ts (244), instanceSpace.ts (242)
- **ADJACENT, not gates; for other groups, not priced here: MidpointSurface.tsx:476 nX (names an id through the glued space at a born end or apex, used in the altitude box `nX(end, x.id)` and the corners tab's respect lines) · :161-162 neighbourActsOn (names on the corners tab's acts line) · :1664 the foot block's open-gate `!bornApex && (foot || respects.length > 0)`, reading resolved.feet and resolved.respects at the born site · :528/:947/:1221 `state` = record-in-conflict, from resolved.edge.refused, the glue's refusal over the glued space (`… under the solid's identity`) · respects.ts:198-199 triadOf `holds no space yet`, which checks membership against R.space at born corners · :1885 FaceRecord casts (seed faces only, but the guard sits in its three callers, not in the component: a comment stating its precondition)** — reads: the resolver's glued space, its feet, respects or refusal at a born vertex
  - seen: names in the corners tab and altitude box, the foot block, the record-in-conflict box, the triad's refusal
  - kind: names / feet and respects (superseded at born corners per §9.46 (3)) / the J register's check (identity)
  - recommendation: For the names, feet, respects and J-register groups; listed so nothing falls between groups
  - freeze: MidpointSurface.tsx: no row (outside the roots); NOT_FROZEN src/lib/respects.ts (239)

### Witnesses that pin it

- scripts/diagnose-the-midpoint.cjs:497-501 §4 THE CHOOSER: ConceptSurface renders '' when a midpoint's parents are not both cast, the corner panel count is 1, the AB surface count is 1. Holds under every MOVE above.
- scripts/diagnose-the-midpoint.cjs:503-518 ONE CODE PATH, TWO SITES: ConceptSurface at a generation-1 site after a second dissection. Unchanged.
- scripts/diagnose-the-midpoint.cjs:524-547 C-8 ITEM 0: countOf(htmlS,'data-midpoint-loaded-ignored') >= 1 holds after the traces line moves to holdsLoadedCast. RAB/RAC/RM/RABs.loadedIgnored pin the resolver itself, not the gate.
- scripts/diagnose-the-midpoint.cjs:390-392: the strip's data-midpoint-source-open and source words at generation 1. Unchanged by the light-gate MOVE.
- scripts/diagnose-the-altitude.cjs:239-240 §10 THE LINE ASKED FIRST: data-altitude-line for T and U at generation 1. Unchanged.
- scripts/diagnose-the-born-room.cjs:479-492: the ABAC surface opens and its columns are the children (countOf data-midpoint-surface === 1)
- scripts/diagnose-the-born-room.cjs:607-621 M10 readout: holdNoSpaceWords plus parentsWithoutSpace at A–AD and A–AB
- scripts/diagnose-the-born-room.cjs:622-640 MODES-3·M6 corners tab: expects `no space` / `made of N` / `nothing related between` from childSpaceOf
- scripts/diagnose-the-born-room.cjs:641-650: CastInsidePanel inline at AB2 (`AB · the concept it holds`, points = columnSpaceOf) and at A2 (`A · the cast it holds`). Keep origin derived from isSeedVertex and it holds.
- scripts/diagnose-the-born-face.cjs:260: corners-tab expected words from childSpaceOf, including `no space`
- scripts/diagnose-the-inside.cjs:286-287: data-inside-nothing `this cast has no roles` and seed panel `A · the cast it holds`
- scripts/diagnose-the-cast-loader.cjs:268 §7 SURFACE 2, a SOURCE PIN on Panels.tsx: the SpaceCardRow mount line, 'data-space-card-row="derived"', "loaded but not read (a midpoint's space comes from its parents)", 'childSpaceOf(shape, vertexId)?.roles.length'. Re-pin if SpaceCardRow's text changes shape.
- scripts/diagnose-the-born-room.cjs:800: SOURCE PIN of MidpointSurface's spaceOf import line (`generationOf, holdsLoadedCast, isSeedVertex, nameIn, spaceCounts, spaceOf, type Resolved, type SpaceOfOptions`). Re-pin if that import changes, which it will once the props retire.
- 13 witness files build MidpointSurface props with spaceOf (parents/resolved): diagnose-modes1-the-sorting, diagnose-modes1-the-words, diagnose-modes2-the-five-defects, diagnose-modes4-the-record-and-the-sorting, diagnose-the-altitude, diagnose-the-born-room, diagnose-the-childs-cast, diagnose-the-childs-loop-card, diagnose-the-configuration, diagnose-the-midpoint, diagnose-the-respects, diagnose-the-road, diagnose-the-stone. They re-pin only when the props are retired (other groups), not for this group's predicate moves.
- DRIVE FAMILY (runs because the strip's reading changes): scripts/app-leg/concept_layer_eye_driver.py:87, 270, 278, 1168, 1267, 1584 click or read data-midpoint-source-open; :900, 953 ALTITUDE_LINES and data-altitude-open; :136 loaded-ignored; :219-222 and 2472 CARD_BORN (the data-space-card-row text at AB); :392-406, 2237 the inside panel and its origin attribute. Consumed by scripts/app-leg/diagnose-the-concept-layer-eye.cjs:275-285 (cardAB), :326-337 (`AB · the concept it holds`).
- NEW FALSIFIER NEEDED for the light gates. At ABAC with nothing on B–C and A–D: no `BC's light` / `AD's light` button and no BC/AD altitude line. Positive control: with one relating on B–C, BC's button and line return. A good home is diagnose-the-born-room.cjs, which already builds G2 through the store. My scratch probe measured the current values: buttons [BC, AD], lines [[BC,0],[AD,0]], columnSpaceOf null for both.
- NEW FALSIFIER suggested for the panel and card gates: a source pin that CastInsidePanel and SpaceCardRow read no spaceOf at a born vertex, plus the ABBC case (measured now: card `made of 0 relatings`, panel `this cast has no roles`).

### Open questions (not decided here)

- Designer's words. At generation 2 and above, a born opposite corner can hold no relating (BC at ABAC with nothing on B–C). After the MOVE its light button and altitude line vanish. Should the strip and the altitude line be silent there, as they are for a seed that holds no cast, or say M10's sentence, `BC holds no relating yet`?
- Meaning (mothership), then words (designer). At a born vertex whose parent holds no relating (measured at ABBC), three readers say three things. The inspector card says `the concept between AB and BC, made of 0 relatings`. The canvas panel says `· the concept it holds` and `this cast has no roles` (it calls a child a cast). The hover says `holds no space yet: BC holds no relating yet`. The child exists, thin, with 0 relatings, while M10 says the vertex holds no space for the act. Which one is the truth §9.46 wants on the card and the panel? The behaviour-neutral MOVE keeps the card's `made of 0`; taking the hover's reader changes the card's copy.
- Feet group, but it decides how long the view's `resolved` prop lives. §9.46 (3) says the respects and the feet have no reader at a born corner. A generation-1 midpoint (M_AB) is itself a born vertex, and the feet are composed on it. Read literally, the corners tab's foot block (MidpointSurface.tsx:1664) retires at every generation, not only at 2 and above. Is that the ruling's reach?
- J-register group, adjacent. The midpoint's `record-in-conflict` state at a born site comes from the glue's refusal over the glued space (`… under the solid's identity`). The child keeps a disagreement as a discordance, `never a refusal` (D4 Q4), and §9.46 lists the J register's check among the identity readers on the IS-part. Can a born site's record still read `in conflict`, and on which record?

## THE NAMES: the resolver's naming rule (namingOf / gluedSpace names, NameSeg, roleSegs, wordSegs, display words), the nameIn(spaceOf(born).space) and nameIn(parents[i].space) fallbacks on the surface and in the store (refusal texts through RA/RB), and the christening (namedUnder / namedAt)

**Estimate: about 6.5 h.**

Read-only survey at HEAD 4f69d69. Measurements are scratch node scripts outside the repo (scratchpad/names_probe.cjs, names_probe2.cjs, names_probe3.cjs). They run the repo's own modules and store on the Virgin Land Value–Fact fixture, then on the same fixture with the triad paired and the core dissected to reach gen 2. No repo file was touched; no sweep or dev server was run.

FOUR RESULTS, ✔ RAN:
(a) At Culture (gen 1), all 18 of 18 child points fall back to the raw key under nameIn(spaceOf(born).space). The column says '(the price is the case as the instituted)'; the resolver path says 'price is the case as instituted'. IS points come out without parentheses. At ABAC (gen 2) the resolver merges the shared seed: 'the background ≡ the price ≡ the possible state' against the child's '((the background ≡ the price) ≡ (the price ≡ the possible state))'.
(b) The store's M1 refusal at the gen-2 corner edge Culture–ABAC names one point two ways in one sentence: \"((…) ≡ (the price ≡ the possible state)) already holds the price ≡ the possible state, so it's carried there\".
(c) The store's `columnSpaceOf(...) ?? A` fallback at geometryStore.ts:2308-2309 WROTE a resolver leftover key (Value price ≡ Value–Meaning's A:background) into his record, at a corner whose child holds no relating. That is an act through the glued space.
(d) The word act at any born end is refused against the resolver's display words with a raw READ key: \"Culture's cast has no word \\\"A:passes into\\\"\".
Positive control: termWordsOf equals nameIn(spaceOf) on 29 of 29 seed roles, so every MOVE to the child's term reader is neutral at seed corners and changes only born-corner text.

WHAT TO DO:
- MOVE to termWordsOf (with his records where the caller holds them): the surface's nX (the altitude box, the under-lines, the triad pending, the corners tab respect lines), neighbourActsOn (the corners-tab acts line), and the store's solidRefusal names (gen ≥ 3) and M1 :2337.
- RETIRE the resolver from the nameFrom fallback and the store's 'isn't a role of' :2311-2312. Name ids no child holds by their key's grammar (a role analogue of wordWordsOf), wording pending Q1.
- RETIRE the `?? A/?? B` membership fallback, refusing in M10's words.
- RETIRE the dead pairText at :2359 and the reader-less ResolvedEdge.glued.
- MOVE the word act's form check to READ's words, carrying READ's arity, which childSidesOf hard-codes to 2. This is coordinated with the J register / stone group and waits on Q3.
- MOVE brokenBornActs' why/names out of the resolver; this re-pins born-room §5 if spaceOf.ts gains an import.
- namingOf, NameSeg, roleSegs/wordSegs and the GluedNaming hook RETIRE only with the resolver's born branch (they key wordContent and composedOn's word pairs), taking born-room §4 :494 with them. That is the Q2 contradiction.
- The christening (namedUnder / namedAt / stage / christening.ts) does not read the resolver; no change.

ESTIMATE 6.5 h: code about 4.5 h (nX and neighbourActs 0.75; key-grammar reader plus fallbacks 1.0; `?? A` 0.5; store names and dead argument 0.4; word act 1.25; brokenBornActs words 0.5; glued 0.1), witnesses about 2 h (gen-2 falsifiers for the measured four, the §5 re-pin, a check of :525). Not included: about 1 h for a gen-2 drive-family sighting of the altitude box, and about 1.5 h when namingOf retires with the born branch.

OUTSIDE THIS GROUP (named, not priced):
- MidpointSurface.tsx:117-123 conflictWords prints the J register check's raw resolver ids at born ends (J register group).
- respects.ts:198-201 triadOf checks membership against the resolver and prints the raw item (respects group).
- MidpointSurface.tsx:1437 and :1470 gate the light button on spaceOf, so a born apex with an empty child still offers a light (light group).
- CastInsideDiagram.tsx:637 and Panels.tsx:2573 use spaceOf only as a gate.
- relatings.ts:179 resolverRoles is a default the app never uses (the store passes childSpaceOf at :1379).
- transport.ts:51 labels born corners with termWordsOf(…, {}) and no records, so his given names never reach the door, cargo or born face (transport group, not the resolver).

CHECKED, NOT RESOLVER READERS: cargoModel.ts:158, doorTransportModel.ts:308, identificationImageModel.ts:257, IdentificationImageSection.tsx:59, BornFaceBlock :1761 (all transport casts); FaceRecord :1885/:1891 (guarded to seed faces at all three mounts); CornerRecord :1625 (seed apex only); JRegisterPanel (held casts).

### Sites

- **src/lib/spaceOf.ts:494-547 namingOf (with NameSeg :104-108, Resolved.roleSegs/wordSegs :136-137, :234-235, :581-584, :597, :605, :611-612) and src/lib/midpointGlue.ts:239-279 (the GluedNaming hook in gluedSpace)** — reads: At a born vertex it builds the glued space's role labels and display words from U/V's segments and composedOn's pairs. The same display words key the resolver's wordContent (:588) and, through wordName, coprojectionOf's word pairs (:396), so composed.words and the J register's check use them too.
  - seen: Nothing directly. It reaches the page only through rows 3-12. ✔ ran at ABAC (gen 2, Virgin Land fixture, triad paired then core dissected): for the same point, key background≡price≡price≡possible, the resolver says 'the background ≡ the price ≡ the possible state' and the child says '((the background ≡ the price) ≡ (the price ≡ the possible state))'. At Culture (gen 1), key price≡possible: resolver 'the price ≡ the possible state', child '(the price ≡ the possible state)'.
  - kind: neither (the pushout's own naming)
  - recommendation: RETIRE together with the resolver's born-vertex branch (§9.46 (3): the next generation's pushout is retired at born corners), not on its own: wordContent and composedOn's word pairs are keyed by its display words until the identity group moves. Once rows 3-12 move, no page reader is left and nothing disappears from the page. Witness that retires with it: diagnose-the-born-room.cjs §4 :494-506 (C-7h item 1 chains at ABAC via R.roleSegs and nameIn). See question 2.
  - freeze: spaceOf.ts NOT_FROZEN · midpointGlue.ts NOT_FROZEN
- **src/lib/spaceOf.ts:101 and :614 ResolvedEdge.glued (wordName :100)** — reads: The GluedSpace object stored on the resolution.
  - seen: Nothing. `glued` has no reader anywhere in src/ or scripts/ (grep). wordName is read only by coprojectionOf :396.
  - kind: neither
  - recommendation: RETIRE `glued` by name now. Nothing on the page changes. No witness pins it: diagnose-the-lift-carries.cjs :149 only checks that it is absent from the file and stays green. Keep wordName while coprojectionOf reads it (identity group).
  - freeze: spaceOf.ts NOT_FROZEN
- **src/components/MidpointSurface.tsx:476 nX = nameIn(spaceOf(shape, corner).space, id). Consumers: :1084 (the 'under T' lines, the light's role and the end's role), :1175 (the pending triad, the light's pick), :1294, :1314, :1323, :1365, :1382, :1396 (THE ALTITUDE's box: the end's role in every cell, the live line, the recorded saying, the relations count, the override, the cut), :1671-1675 (corners tab triad/respect lines)** — reads: The resolver's glued space, as names for the end's and the light's points.
  - seen: Wherever an end (site.a/site.b, so every gen-2 site) or the light is born, the end's relating prints through the resolver. ✔ ran at Culture: all 18 of 18 child keys fall back to the raw id, e.g. 'price is the case as instituted' where the column draws '(the price is the case as the instituted)'. IS relatings print without parentheses, and at gen 2 the shared seed is merged. The resolver's name stands beside nA/nB's column name in the same line (:1093-1094 vs :1084). His given names (G) never appear. ⚠ The reader's output was run; the screen was not seen.
  - kind: MODES (the configuration / the altitude's box; the sorting's passages through a born corner). The triad/respect lines belong to the respects group (superseded at born corners).
  - recommendation: MOVE nX to termWordsOf(shape, corner, id, { records: childRecords }), the reader the column labels already use (columnSpaceOf). Neutral at seed corners: ✔ termWordsOf === nameIn(spaceOf) on 29 of 29 seed roles. The respect/triad uses retire with that group.
  - freeze: no manifest row (src/components is outside the engine roots src/lib, src/playground, src/manuscript, src/types): not frozen
- **src/components/MidpointSurface.tsx:156-171 neighbourActsOn (U/V = spaceOf at both ends :161-162; nameIn at :165 and :170), shown by CornerRecord :1629 and :1662 (data-midpoint-source-acts)** — reads: The resolver's glued space at each end of the two edges reaching the opposite corner, used to name his pairs and relatings.
  - seen: The corners tab line 'on X–Y: a ≡ b · c w d'. At a corner site A–AB and at every gen-2 site an end is born: mode relatings print as raw keys (✔ the same reader as row 3, measured 18/18 at Culture) and IS pairs print as resolver chains.
  - kind: neither: a plain view of his record, naming the child's points
  - recommendation: MOVE to termWordsOf(shape, end, id, options). Add an options parameter so CornerRecord can pass his records (his names first, per G). Gen-1 text is unchanged (diagnose-the-midpoint.cjs :478-489).
  - freeze: no manifest row (not frozen)
- **src/components/MidpointSurface.tsx:410-412 nameFrom(col, parents[i].space, id), the fallback for ids no column holds. Consumers: :1126 (kept from before), :1132 (refused listing), :1166 (names a role that isn't in its cast), :551, :875, :896, :909, :925 (refusal/withdraw words on old pairs), :1194-1195 (left out), :1203 (held back), :1215 (differ), :1230, :1680-1690 (foot lines)** — reads: The resolver's glued space at a born parent, used to name parents' leftover keys (A:x / B:y).
  - seen: A pair kept from before, or a meet/foot line, names a leftover by the resolver's label (with bracket or 'through' suffixes when names collide). ✔ ran: at ABAC, 7 of 8 foot-map keys are resolver leftovers (e.g. B:validity) outside both columns.
  - kind: neither: naming of ids outside the child. The foot/meet consumers belong to the feet/respects group (superseded at born corners).
  - recommendation: RETIRE the resolver from the fallback. Name an id no child holds by its key's grammar: A:x / B:y is role x of the born corner's first/second stored parent, read at that parent through termWordsOf, recursively for A:A:x at gen 2. This is the role analogue of wordWordsOf (instanceSpace.ts:406-421) and needs no glued space. The foot/meet lines go when the feet group retires them at born sites. Wording: question 1.
  - freeze: MidpointSurface.tsx no row (not frozen) · new helper in instanceSpace.ts NOT_FROZEN
- **src/store/geometryStore.ts:2308-2309 `columnSpaceOf(...) ?? A` / `?? B` (A, B = RA.space, RB.space from resolvedEnds :2228-2234)** — reads: The resolver's glued space, used as the act's membership set whenever a born end's child holds no relating.
  - seen: ✔ ran: on the Virgin Land fixture, at the corner edge Value–(Value–Meaning), where Value–Meaning holds no relating (no column; the view does not open), giveRolePair(Value 'price', Value–Meaning's resolver leftover 'A:background') was WRITTEN to the record with no refusal. A resolver key enters his record and then reads as a stray / 'kept from before'.
  - kind: IDENTITY (the act's IS check, membership)
  - recommendation: RETIRE the fallback. A born corner whose child holds no relating holds no column (M10), so refuse by name in M10's words ('<corner> holds no relating yet') and never fall back to the glued space. Falsifier: the write above, red today.
  - freeze: geometryStore.ts no manifest row (src/store outside the roots): not frozen
- **src/store/geometryStore.ts:2311-2312 `${nameIn(A, x)} isn't a role of ${la}` / `${nameIn(B, y)} …`** — reads: The resolver's label for a term no column offers.
  - seen: ✔ ran: Culture's resolver key A:price is refused as 'the price isn't a role of Culture'. A key that neither space holds prints raw: 'A:price isn't a role of Value–Meaning'.
  - kind: neither: refusal text
  - recommendation: RETIRE the resolver here: name through row 5's key-grammar reader. diagnose-the-born-room.cjs :525 (`^.+ isn't a role of A[BC]$`, never `^[AB]:`) stays green if leftovers are named by their parent's label.
  - freeze: no manifest row (not frozen)
- **src/store/geometryStore.ts:2282-2283 solidRefusal's name(c, id) = nameIn(spaceOf(shape, c, opts).space, id) for P, Qu, Qv → MidpointSolidRefusal.role/others → solidWords :2289-2291 and the surface attribute data-midpoint-refusal-solid (MidpointSurface.tsx:892)** — reads: The resolver at the parents of the edge's two ends.
  - seen: At a gen-2 site P, Qu and Qv are seeds (cast), so nothing changes there. At a generation-3 site they are born, and 'both hold X, so this means pairing Y with Z, which you do on …' names X/Y/Z by the resolver's label or raw key. ⚠ inferred: not run at gen 3.
  - kind: IDENTITY (the coordinate identity's refusal, D15): its words
  - recommendation: MOVE to termWordsOf(shape, c, id, opts). The regex witnesses (born-room :508-515, :602-605; modes4 §h :543; descent :109) stay green.
  - freeze: no manifest row (not frozen)
- **src/store/geometryStore.ts:2337 `${termWordsOf(C, i)} already holds ${nameIn(parentFirst ? A : B, a)}, so it's carried there`** — reads: The resolver's glued space at a born parent P on a corner edge (generation ≥ 2).
  - seen: ✔ ran at the gen-2 corner edge Culture–ABAC: "((the background ≡ the price) ≡ (the price ≡ the possible state)) already holds the price ≡ the possible state, so it's carried there". One point is named two ways in one sentence; the child's word for it is '(the price ≡ the possible state)'.
  - kind: IDENTITY (M1, the coordinate map D14)
  - recommendation: MOVE to termWordsOf(shape, P, a, opts). modes4 §e :354 (gen 1, seed P, "(F7 ≡ r0) already holds F7 …") is unchanged (29/29 control).
  - freeze: no manifest row (not frozen)
- **src/store/geometryStore.ts:2359 stoneWords(shape, stone, `${nameIn(A, x)} ↦ ${nameIn(B, y)}`), where stoneWords voids pairText (src/lib/spaceOf.ts:673); also the word call at :2376** — reads: Resolver names that are computed and then discarded.
  - seen: Nothing (dead text).
  - kind: neither
  - recommendation: RETIRE the pairText parameter by name, from stoneWords and both callers. Nothing on the page changes. The stone itself (stoneOn over the resolver's seed content) belongs to the identity group (§9.46 (6), open).
  - freeze: geometryStore no row · spaceOf.ts NOT_FROZEN
- **src/store/geometryStore.ts:2363 wordPairForm(A, B, s, w, …) (src/lib/jRegister.ts:299-309) at a born end. Same key space: :2365-2369 composed-word refusal, :2375 stoneOn words, :2379 refusalOf(A, B, …, nextTypes)** — reads: The resolver's signature, i.e. namingOf's display words ('passes into [Value]'), while the column offers READ's keys ('A:passes into'; MidpointSurface.tsx:402-403, :1067).
  - seen: ✔ ran: on Value–Culture, the word act Value 'passes into' ↔ Culture 'A:passes into' is refused "Culture's cast has no word \"A:passes into\"". The sentence prints a raw key, names a cast Culture does not hold, and denies a word the column offers. Nothing is written. The word act cannot land at any born end. :2368's text is unreachable there (⚠ inferred: a READ key never equals a display word).
  - kind: IDENTITY (his τ feeds READ and the J register's check)
  - recommendation: MOVE the form check to READ's words: childSidesOf(shape, corner, opts), with each word's arity taken from its witness side. childSidesOf hard-codes arity 2 (instanceSpace.ts:270); instanceSpaceFromCasts computes the arity at :211 and drops it at :216, so the arity must be carried first. The composed-word, stone and refusalOf lines must then read the same keys: coordinate with the J register / stone group. See question 3.
  - freeze: geometryStore no row · jRegister.ts NOT_FROZEN · instanceSpace.ts NOT_FROZEN
- **src/lib/spaceOf.ts:698-753 brokenBornActs, its words: :710 names via shownName (:690) on U.space/V.space; :726-727 'it needs … as its own role'; :728-729 oneWith(nameIn(U.space, x), nameIn(V.space, …)). Flows through the store's dependencyOf :2245; the surface prints dep.why raw at MidpointSurface.tsx:897 (depName :880-886 already re-names `names` via termWordsOf and falls back to these)** — reads: The resolver at both ends of a gen ≥ 2 medial edge, used to name the born pair the act would break.
  - seen: 'not taken — … would break the pair … at <site>, <gen>: <why>'. The why names the ends by the resolver. ⚠ inferred: not run.
  - kind: IDENTITY (C-8 item 4, the dependency reading over the pushout): its words. The membership logic belongs to that group.
  - recommendation: MOVE the words to termWordsOf. Either compose `why` in the store from structured slots, or import termWordsOf into spaceOf.ts; the import creates a call-time cycle with instanceSpace.ts and turns born-room §5 red (import count 8) until re-pinned. If the identity group replaces brokenBornActs at born corners with orphanedRelatings (already in the child's terms), these words retire with it.
  - freeze: spaceOf.ts NOT_FROZEN
- **src/store/geometryStore.ts:1229 rulesAfter: JSON of spaceOf(shape, v).space before vs after a data patch** — reads: The whole resolver space, names included.
  - seen: Nothing at a born vertex. The resolver ignores a born vertex's data (Δ86), and label patches return earlier (:1191-1222), so the comparison is constant there. ⚠ inferred.
  - kind: neither (in effect a seed-cast change reader)
  - recommendation: Leave it: no effect at born corners. Optionally compare childSpaceOf for uniformity; no page change.
  - freeze: no manifest row (not frozen)
- **THE CHRISTENING: src/components/MediumBlock.tsx:46-53 namedUnderOf and :254-358 namedLine; src/lib/stage.ts (namedAt, D17); src/lib/christening.ts** — reads: The vertex packet, the log and vertex labels. Names come from m.nameZ = termWordsOf (MediumBlock.tsx:93); the stage is replayed through recordAtStage + mediumOf (the child).
  - seen: The 'named X when …; since then …' line, which never goes through the resolver.
  - kind: neither
  - recommendation: No change: not a resolver reader. stage.ts and christening.ts import nothing from spaceOf; MediumBlock imports only the SpaceOfOptions type.
  - freeze: MediumBlock.tsx no row (not frozen) · stage.ts NOT_FROZEN · christening.ts NOT_FROZEN

### Witnesses that pin it

- scripts/diagnose-the-born-room.cjs §4 :494-506 pins the resolver's naming rule at ABAC via R.roleSegs/R.wordSegs/nameIn (C-7h item 1: 'no seed printed twice'). It retires with namingOf (question 2).
- scripts/diagnose-the-born-room.cjs §4 :525 pins `^.+ isn't a role of A[BC]$` and never `^[AB]:`, i.e. the resolver's label for a leftover key. Keep it green through the key-grammar reader.
- scripts/diagnose-the-born-room.cjs §4 :508-515 and :602-605 pin solidRefusal words by regex `.+`; :665 and :711 pin 'isn't a role of'. Unaffected by the moves.
- scripts/diagnose-the-born-room.cjs §5 :788-797 (THE RESOLVER IS PURE) pins spaceOf.ts's import count (8) and the surface's spaceOf import line verbatim (`import { generationOf, holdsLoadedCast, isSeedVertex, nameIn, spaceCounts, spaceOf, type Resolved, type SpaceOfOptions } from '../lib/spaceOf';`). Re-pin if row 12 imports termWordsOf or the surface drops nameIn/spaceOf.
- scripts/diagnose-modes4-the-record-and-the-sorting.cjs §e :354 pins "(F7 ≡ r0) already holds F7, so it's carried there" (gen 1, seed P). Unchanged by the 29/29 seed control. §h :543 pins solid refusal words by regex.
- scripts/diagnose-modes1-the-descent.cjs :109 pins solid refusal words by regex.
- scripts/diagnose-modes1-the-transport.cjs §D2 :178-197 (the act reads the child; the mode-end words) and §D4 :206-222 (the light is the child). These are the D-2/D-4 neighbours of rows 6-7.
- scripts/diagnose-the-midpoint.cjs :123-124 (wordPairForm on seed casts only), :321 (`^x isn't a role of`), :478-489 (corners-tab acts line at gen 1, `on <AC>: <pair> · sustains ≡ sustains`).
- scripts/diagnose-the-configuration.cjs :409 builds its own nX through termWordsOf, so the witness-side reader already matches row 3's move.
- scripts/diagnose-the-born-face.cjs :259-264 and scripts/diagnose-the-born-room.cjs :632-639 count data-midpoint-source-acts at born sites but do not pin the names.
- scripts/diagnose-the-respects.cjs :515 (acts lines) and the triad-pending attribute, at gen 1 (⚠ by reading).
- scripts/diagnose-the-road.cjs :308 checks that a pair kept from before is listed.
- scripts/diagnose-the-lift-carries.cjs :149 is an absence pin (no roleSegs/wordSegs/glued in the lifted file). Stays green.
- DRIVE FAMILY: scripts/app-leg/concept_layer_eye_driver.py :905-1027 with scripts/app-leg/diagnose-the-concept-layer-eye.cjs read the altitude box (data-altitude-cell, -live, -recorded, -under-lines) at generation 1 through C's light (⚠ read, not run). Gen-1 text is unchanged by construction. A gen-2 sighting of the altitude box would be a new arm, and per §6 the leg runs with any build whose reading touches it.
- NO WITNESS today: the gen-2 names (rows 3, 4, 9), the `?? A` write (row 6) and the word act at a born end (row 11). The measurements in the summary are the falsifiers to pin.

### Open questions (not decided here)

- Q1 (meaning/copy, designer): once the glued space is no reader's space, how is a term no child holds named? This is a parent's leftover key in an old record (A:price, A:A:use), printed in the 'kept from before' and 'names a role that isn't in its cast' lines and in the store's 'isn't a role of' refusal. Today the resolver gives 'the price isn't a role of Culture' (✔ measured). It can be derived from the key's grammar alone: bare by the parent's label ('the price'), or with its parent, as wordWordsOf does for words ('Value's the price'). Which words? The reader is the coder's; the wording is not.
- Q2 (a contradiction between two ratified things, mothership): at generation ≥ 2 the two naming rules give one point two different names. C-7h item 1 / §125.1, the resolver's namingOf ('≡ is the person's act; a seed reached through two parents printed once', pinned by born-room §4 :494), gives 'the background ≡ the price ≡ the possible state'. The designer's §1 / §215 sentence of sentences (termWordsOf) gives '((the background ≡ the price) ≡ (the price ≡ the possible state))', printing the shared seed twice. ✔ measured on the same key at ABAC. §9.46 (1) suggests the child's rule governs and C-7h item 1 retires with the pushout. That is the mothership's call, not this seat's.
- Q3 (meaning, already asked per MidpointSurface.tsx:400-401): which words does his τ take at a born end, READ's pulled-back keys (what the column offers) or the child's named relations (§9.40's vocabulary)? ✔ measured: today the word act never lands at a born end. It is refused "Culture's cast has no word \"A:passes into\"", a sentence false on two counts. Row 11's move waits on this answer.

## THE AMBO CARD: the vertex card (src/components/Panels.tsx SpaceCardRow), the Ambo canvas panel (CastInsidePanel through ConceptSurface), and the midpoint view it opens into (MidpointSurface's gate, drawing marks and trace fields)

**Estimate: about 3.5 h.**

I read the source at HEAD 4f69d69, where src matches HEAD. I ran nothing and drove nothing, so every behavioural claim below is ⚠ inferred from source.

**Main finding: Arman's question rests on a stale premise.** The Ambo card no longer shows a born vertex's merged amalgam. There is no roles · words · tuples line, no cardLineOf in src (it exists only as a helper in scripts/diagnose-the-stone.cjs:260), and no glued drawing.
- **Vertex card** (Panels.tsx:2590): has printed the child's count since 95dc82d.
- **Canvas panel** (CastInsideDiagram.tsx:640-643): has drawn columnSpaceOf / liftedColumnOf since MODES-3.
- **Midpoint view's point tab:** is ChildCast.
- **Traces' counts and role lines:** have been the child's since D-5.
- **ResolvedEdge.glued** (spaceOf.ts:101/614): produced on every born resolution and read by nothing in src.

**What still reads the resolver here.** Ten sites, all reads of gates, labels, flags or dead fields: two presence gates (SpaceCardRow at Panels.tsx:2573, CastInsidePanel at CastInsideDiagram.tsx:637), the view's gate and props (midpointViewOf, MidpointSurface.tsx:1964-1966), the naming fallback (410-412), the generation-1 `≡` both-mark (822-829, an identity reader, to move to the already-computed isPartOf), a dead `composed` read (418), the edge kind (415), loadedIgnored (1571-1575), M used as a refusal gate (422/426/1582), and the dead glued field.

**A likely live defect from the resolver-as-gate (⚠ inferred).** At a generation-2 vertex whose born parent has no relating (G2c, the A–AD site):
- the resolver resolves, so the vertex card prints `made of 0 relatings`;
- the canvas panel prints `this cast has no roles`;
- the hover readout says `holds no space yet: AD holds no relating yet`.

That is three different readings of one state. The card's 'relating' arm can never print, and the zero is not dropped. The cheapest measurement: render CastInsidePanel on the born-room's G2c at A–AD and look for `this cast has no roles`, then read the card's row after selecting that vertex.

**Recommendation: finish the move to the child, about 3.5 h** (code, witness re-pins and one run of the concept-layer eye):
- gate the card and panel on the child (parentsWithoutSpace / childSpaceOf), parents by edgeBetween, origin by isSeedVertex: 1.25 h;
- move the ≡ mark to isPartOf, with the 4 + 4 count in diagnose-the-midpoint §4 as the falsifier: 1 h;
- cleanups (edgeKind, holdsLoadedCast, !refusedRecord, nameFrom, delete composed and glued) plus the stale comments: 0.75 h;
- the eye run: 0.5 h.

The `resolved` and `parents` props that midpointViewOf feeds into MidpointSurface must stay until the respects/feet, J-register, lights and pairing-record groups retire their reads. Retiring those props is priced in those groups.

**The alternative is to bring the amalgam back as a labelled 'identity regime's reading', about 3.25 h** including the same gate fixes. It needs §9.46 (1) amended by the mothership, the designer's words, and a choice between M and M⁺. It would also have to go in the traces tab, because the card is off screen whenever the midpoint view opens.

**Freeze status.** No file named here is frozen. src/components and src/App.tsx are outside the freeze roots (src/lib, src/playground, src/manuscript, src/types, per scripts/lib/engineFreeze.cjs:33) and have no manifest rows; spaceOf.ts, instanceSpace.ts and midpointGlue.ts are NOT_FROZEN rows (manifest lines 219, 242, 217).

**Checked and outside this group.** These cards already read the child, not the resolver at a born corner: the lifted card (liftedConceptModel.ts:116-118 via transportSpaceOf) and the identification image card (IdentificationImageSection.tsx:94 via the union child). The corners tab's nX / respects / feet reads (MidpointSurface.tsx:476-478, 543-546) belong to the respects/feet group.

### Sites

- **src/components/Panels.tsx:2573 (SpaceCardRow; also lines 2585, 2590, 2594)** — reads: spaceOf(shape, vertexId) at the born vertex. It is used only as a presence gate: if resolved, the 'derived' row prints; if not resolved and bare.length, the 'none-yet' row prints. It also reads resolved.edge.parents for the two names. The count itself already comes from childSpaceOf(shape, vertexId).roles.length (line 2590). Since 95dc82d (THE CUT) the card prints none of the amalgam's roles · words · tuples.
  - seen: The vertex card's space row, either `the concept between A and B, made of N relatings` or `none yet: A and B hold no cast`. The row is on screen at a born vertex only when the midpoint view does not open (App.tsx:21-26 swaps the whole page). ⚠ Inferred from source, not run: at a generation-2 vertex whose born parent has no relating (born-room's G2c, the A–AD site, where nothing is paired on A–D), the resolver still resolves. So the card prints `the concept between A and AD, made of 0 relatings`, while the hover readout (Workspace3D.tsx:2598, same parentsWithoutSpace reader) says `holds no space yet: AD holds no relating yet`. The card's 'relating' arm can never print while the resolver resolves, and the zero is not dropped (the rule pinned in diagnose-modes1-the-words §d). The comment at Panels.tsx:2604-2606 ('the one reader the hover readout and the card use') describes behaviour the card's gate does not deliver.
  - kind: NEITHER (a presence gate plus two labels). The words it prints count the child's points, the child as a parent.
  - recommendation: MOVE to the child. Gate the derived and none-yet rows on parentsWithoutSpace(shape, vertexId) (columnSpaceOf, the reader the hover uses) together with childSpaceOf. Take the parents from vertex.createdBy.sourceVertexIds, ordered by edgeBetween (the edge's own orientation). Drop the spaceOf import from Panels. In the same cut, fix the two comments that state the resolver is the vertex's space: 2506-2508 and 2566-2569 ('its own counts derived at every read through the resolver … its space is its parents' gluing'), which §9.46 (1) contradicts.
  - freeze: NOT FROZEN. No manifest row, because src/components is outside the freeze roots (scripts/lib/engineFreeze.cjs:33 ROOTS = src/lib, src/playground, src/manuscript, src/types).
- **src/components/CastInsideDiagram.tsx:637 (CastInsidePanel; also lines 640-643, 648-649)** — reads: spaceOf(shape, vertexId) as a gate (if not resolved, the panel returns null). It also reads resolved.origin: seed means the cast, born means columnSpaceOf with records on the Ambo or liftedColumnOf inline. The origin also picks the head words `· the cast it holds` / `· the concept it holds` and sets data-inside-origin-of-space. Since MODES-3 the drawing itself is the child, never the amalgam.
  - seen: The canvas overlay of a born vertex on the Ambo when the view does not open (ConceptSurface at MidpointSurface.tsx:2007, mounted at Workspace3D.tsx:132). The same gate serves the Manuscript's inline mounts at ManuscriptView.tsx:7043 (the lifted corner) and 7055 (the identification image). ⚠ Inferred: in the same G2c A–AD state the column is null, so the panel draws `<label> · the concept it holds` followed by `this cast has no roles`. That is a cast's sentence on a born concept, where MODES-3/M10 say such a corner 'holds no space here'.
  - kind: MODES on the Ambo mount (the columns' reader). On the inline mount it is the lift's READ (liftedColumnOf, flagged open), which belongs to another group.
  - recommendation: MOVE the gate to childSpaceOf (a seed still goes through the resolver's seed branch, which §9.46 does not touch) and the origin to isSeedVertex. The attributes come out byte-identical. The wording for the zero-relating born corner is a question for the designer (listed below). The lift-carries and identification-image witnesses must re-run because the inline mounts share this gate.
  - freeze: NOT FROZEN (outside the freeze roots, no row).
- **src/components/MidpointSurface.tsx:1964-1966 (midpointViewOf), consumed by src/App.tsx:21 and ConceptSurface at MidpointSurface.tsx:1992** — reads: spaceOf at site.a, site.b and the born site itself. These are both the gate that opens the view and the producers of the `parents` and `resolved` props that MidpointSurface reads. ⚠ By source, as a gate they are redundant: columnSpaceOf(a) and columnSpaceOf(b) are already required; a non-null column implies a child, which implies every seed below holds a cast, which implies the resolver resolves.
  - seen: Whether the midpoint view opens at all (data-ambo-page = midpoint or solid), and therefore whether the person sees the view or the vertex card.
  - kind: NEITHER (a gate). The props feed identity-regime readers that belong to other groups: resolved.core (the lights), resolved.respects, resolved.feet, resolved.edge.refused (the J register), resolved.edge.born (his record).
  - recommendation: MOVE the gate to the child now: keep the columnSpaceOf checks on a and b, and add childSpaceOf(site). Keep computing the Resolved props only until the respects/feet, J-register, lights and pairing-record groups retire their reads. Then RETIRE the props as the last cut; that work is priced in those groups.
  - freeze: NOT FROZEN (MidpointSurface.tsx and App.tsx have no rows; both are outside the roots).
- **src/components/MidpointSurface.tsx:410-412 (nameFrom / nA / nB)** — reads: parents[i].space: the resolver's glued space at a born parent (generation ≥ 2), read as the fallback name for an id an old record holds that no column offers.
  - seen: Role names in the pair listings, refusal lines, re-made notes, the traces' role lines, the lights' left-out lines and the foot/triad lines, wherever such an id occurs.
  - kind: NEITHER (naming).
  - recommendation: MOVE the fallback to the child's sentence reader, sentenceWordsOf(shape, corner, id, {records: childRecords}), which ends in nameIn(child, id) || id. Or RETIRE it to the raw id with the A:/B: prefix stripped, as spaceOf.ts shownName does. Since D-2 the act refuses ids no column offers, and since D-3 unglued pairs are named. No witness pins it, so a falsifier has to be manufactured: an old generation-2 record holding a pair the column does not offer.
  - freeze: NOT FROZEN.
- **src/components/MidpointSurface.tsx:422 together with 822-829 (bothExtra: `bothCornersSeeds && M?.originOf[side].get(type|terms) === 'both'`)** — reads: resolved.edge.midpoint.originOf, the resolver's amalgam at the born site AB. It is read only when both corners are seeds (generation 1).
  - seen: The `≡` glyph and amber stroke on a parent column's tuple that both parents confirm through his pairs (data-midpoint-both) in the pairing drawing. This is the last remnant of the glued drawing on the Ambo.
  - kind: IDENTITY (the IS-part's record, READ restricted to IS points).
  - recommendation: MOVE to isPartOf, which is already computed at line 425. Mark a column tuple when isPart.tuples has an entry with origin 'both' whose terms are the instance keys over that tuple's terms and whose word is the τ key of its word. Keep the bothCornersSeeds guard: the eye pins 0 marks at ABAC, and one glyph has one meaning. ⚠ It should be behaviour-neutral at generation 1 on D-5's receipt ("what both confirm" unchanged there), which is the receipt's claim, not my run. Falsifier: diagnose-the-midpoint §4's 4 + 4 marks.
  - freeze: NOT FROZEN.
- **src/components/MidpointSurface.tsx:418 (`const composed = … edgeInfo?.composed …`)** — reads: resolved.edge.composed (the identity the solid fixed on the seam). It is read and then used nowhere: the composed mark was retired at line 798 and the generation-2 sentences at 943.
  - seen: Nothing.
  - kind: NEITHER (dead read).
  - recommendation: RETIRE by name. Nothing disappears from the page, and no witness pins it.
  - freeze: NOT FROZEN.
- **src/components/MidpointSurface.tsx:415 (kind = resolved.edge.kind), feeding lines 1568 and 947** — reads: resolved.edge.kind: seed, corner or medial.
  - seen: The traces tab's home line `recorded on A–B, a <kind> edge (generation g) · this site: …` (data-midpoint-home), and ` under the solid's identity` in the record-in-conflict sentence for a medial edge.
  - kind: NEITHER (a structural fact, not a space).
  - recommendation: MOVE to edgeKind(shape, site.a, site.b), which spaceOf.ts:203 already exports. This changes the surface's spaceOf import line, which born-room §5 pins verbatim, so that pin must be re-pinned.
  - freeze: NOT FROZEN.
- **src/components/MidpointSurface.tsx:1571-1575 (`(r as Resolved).loadedIgnored` for the site, parents[0] and parents[1])** — reads: Resolved.loadedIgnored (for a derived vertex, v.data.cast !== undefined).
  - seen: `<X> holds a loaded cast that isn't read: a midpoint's space comes from its parents` (data-midpoint-loaded-ignored).
  - kind: NEITHER (the Δ86 flag).
  - recommendation: MOVE to holdsLoadedCast(shape, id). It is the same predicate and is already imported, so the change is byte-neutral.
  - freeze: NOT FROZEN.
- **src/components/MidpointSurface.tsx:422/426/1582 (M as the gate of the traces' role lines and 'what both confirm')** — reads: resolved.edge.midpoint, used only for non-nullness. M is null exactly when the record is refused, so the gate equals !refusedRecord.
  - seen: Whether the traces tab shows `what both confirm …` and the per-pair trace lines. Since D-5 their content is isPartOf's.
  - kind: NEITHER (gate). The refusal it stands for is the J register's check, which belongs to another group.
  - recommendation: MOVE: gate on isPart && !refusedRecord, and stop reading .midpoint.
  - freeze: NOT FROZEN.
- **src/lib/spaceOf.ts:101 and 614 (ResolvedEdge.glued, 'the amalgam as the surface draws it')** — reads: Produced on every born resolution and read by no consumer in src. A grep for .glued finds only RichFieldOverlay's unrelated field.glued and traceOf's own .glued.
  - seen: Nothing. The glued drawing left the page at MODES-3 and THE CUT.
  - kind: NEITHER (a dead field).
  - recommendation: RETIRE the field by name (and the type GluedSpace import if it becomes unused). Nothing on the page changes. born-room §5 pins the glue import line verbatim, so it must be re-pinned if the type import goes.
  - freeze: NOT FROZEN (manifest line 219: `NOT_FROZEN src/lib/spaceOf.ts — STAMP C-8 …`).

### Witnesses that pin it

- scripts/diagnose-the-cast-loader.cjs §7 (lines 267-268): source-text pins on Panels.tsx: `<SpaceCardRow shape={shape} vertexId={vertex.id} />`, `data-space-card-row="derived"`, `loaded but not read (a midpoint's space comes from its parents)`, `childSpaceOf(shape, vertexId)?.roles.length`
- scripts/diagnose-the-stone.cjs §6 (lines 252-288): Panels includes `childSpaceOf(shape, vertexId)?.roles.length` and excludes `spaceCounts(resolved.space)`; the amalgam's 20·27·57 is measured and claimed 'printed nowhere'; cardLineOf (line 260) appears only in a J() payload, and its comment 'Panels.tsx prints spaceCounts thrice' is stale
- scripts/diagnose-the-born-room.cjs: MODES-3 readout (lines ~607-620, parentsWithoutSpace on G2c, AD 'relating'); M6 corner site (ConceptSurface render, which goes through midpointViewOf, data-midpoint-surface === 1); MODES-3 lifted drawing (lines 641-649, CastInsidePanel inline, `AB · the concept it holds`, pts < RAB2.space.roles.length); §5 purity (lines 797-799), which pins verbatim spaceOf.ts's glue import line and MidpointSurface's `import { generationOf, holdsLoadedCast, isSeedVertex, nameIn, spaceCounts, spaceOf, type Resolved, type SpaceOfOptions } from '../lib/spaceOf';`
- scripts/diagnose-the-inside.cjs §4 (lines 285-287): CastInsidePanel's two absences
- scripts/diagnose-the-midpoint.cjs §4 (lines 408-409): exactly 4 + 4 data-midpoint-both when glued and 0 when unglued, which is the both-mark's falsifier; lines 545-547: loadedIgnored read from spaceOf plus data-midpoint-loaded-ignored ≥ 1
- scripts/diagnose-modes2-the-five-defects.cjs:85: the data-midpoint-home line
- scripts/diagnose-the-lift-carries.cjs, scripts/diagnose-the-identification-image.cjs, scripts/diagnose-the-childs-loop-card.cjs: render CastInsidePanel (shared gate)
- scripts/diagnose-the-face.cjs, scripts/diagnose-the-born-face.cjs: render ConceptSurface (the midpointViewOf gate)
- scripts/diagnose-modes1-the-words.cjs §a/§d (lines 150, 315): the child line `the concept between A and B, made of 3 relatings` and its zero form `the concept between A and B`. This pins MediumBlock, not the card, but it is the zero rule the card breaks
- DRIVE FAMILY: scripts/app-leg/diagnose-the-concept-layer-eye.cjs with scripts/app-leg/concept_layer_eye_driver.py. CARD_BORN (driver lines 219-222; leg §6 lines 292-293, cardAB), bothMarks (driver line 110; leg line 256, bothMarks === 0 at ABAC), home (driver line 135; leg lines 251-254), loadedIgnored (driver line 136), insidePanel (driver lines 392-400; leg line 326, noted only). This leg runs with any cut here, because what a person sees at a born vertex is its subject

### Open questions (not decided here)

- ARMAN'S QUESTION, PREMISE CORRECTED: by a source read at HEAD 4f69d69 (⚠ not driven), nothing on the Ambo card or panel shows a born vertex's merged amalgam any more. The card's space row has printed the child's count since 95dc82d. The canvas panel has drawn columnSpaceOf since MODES-3. The traces' counts have been the child's since 95dc82d and D-5. ResolvedEdge.glued has no reader in src. So 'keep showing it' really means 'bring it back'. Bringing it back as a labelled line costs about 2 h (the line, the designer's words, re-pins of stone §6, midpoint §4 and the eye, one eye run), plus about 1.25 h for the gate fixes, which are needed either way, for about 3.25 h in all. Finishing the move costs about 3.5 h in three slices: the card and panel gates (1.25 h), the ≡ mark to isPartOf (1 h), and cleanups plus stale comments (0.75 h), plus the eye run (0.5 h). Bringing it back would also need a mothership ruling: §9.46 (1) says the glued space is no reader's space at a born corner, and §9.47 places the identity regime's pushout reading at D19's identified corner, over children. It also has a placement problem: the card is off screen whenever the midpoint view opens, so a brought-back line would have to go in the traces tab that D-5 just emptied.
- If it is brought back: which space would the label count? M (the plain amalgam) or M⁺ (with the feet and respects, which §9.46 (3) says have been superseded)? And at generation ≥ 2 the amalgam holds classes composed beyond his pairings (D12 amended). How would the label keep those from reading as his?
- The designer's words: what does the Ambo canvas panel (CastInsidePanel) say at a born corner whose child holds no relating? Today it says `this cast has no roles`, a cast's sentence on a concept. The options are a true absence (null, no frame) or the hover's own sentence `holds no space yet: AD holds no relating yet`.
- nameFrom's fallback for an id an old record holds that no column offers: should it be named through the child's sentence reader, shown as the raw id with the A:/B: prefix stripped, or not shown? This is copy for the designer or the mothership. Since D-2 the act can no longer create such a pair; it survives only in old records.

---

**Sum of the readers' estimates: about 49 h** (overlapping: the next pushout's retirement comes last, after its consumers have moved).

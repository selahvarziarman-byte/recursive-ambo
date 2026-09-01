// deckAbelianModel — STATION 2 of STAMP O-1 (ORDER IS THE UNREAD STRATUM):
// ONE derivable bit. The certificate's every line factors through
// abelianization, and abelianization is exactly forgetting the order of the
// route — so `H₁ = 0` printed alone for the Poincaré sphere states 120 rooms
// of commutator content BY SILENCE (a positive fact carried by nothing being
// there). This reader does not say what the certificate cannot see; it says
// THAT it cannot see: `deck abelian — yes/no`, computed from the twelve
// witnessed 4×4s the engine already holds (B-112's in-model deck — the
// entries plus their inverses, the same construction as ADR 0028 Appendix
// B's probe).
//
// THE READ (all committed machinery, nothing new): sealDomainRealization
// hands the ModeledDeck whose every map was already witnessed at birth
// (corner-exact, inner-product-preserving); the bit is pairwise commutation
// over those maps. TRUE ABSENCE (null — no row) where the seal refuses: a
// bounded room or an unsound gate has no deck group to speak of, and a
// placeholder row would mark the ordinary.
//
// THE TOLERANCE: the measured gulf is wide open — commuting decks sit at
// float-noise (the researcher's controls: 1e-15) and non-commuting ones at
// O(1)–O(100) entry deviations — so 1e-6 stands far from both shores; the
// max deviation rides the reading so any future ruling can re-judge the raw
// number rather than trust the threshold.
//
// The row's KIND is declared at this producer (B-132's law): 'measure' —
// commutativity is what the deck IS, not a verdict about a gate.

import type { SpecimenRow } from './specimenModel';
import type { DomainModel } from './worldModel';
import { matrixInverse4, mat4Mul, sealDomainRealization, type Mat4 } from '../lib/noncubeDomain';

export const DECK_ABELIAN_EPSILON = 1e-6;

export interface DeckAbelianReading {
  abelian: boolean;
  maxDeviation: number; // the largest |gh − hg| entry over every tested pair
  mapsTested: number; // the deck's entries plus their inverses
  row: SpecimenRow;
}

export function readDeckAbelian(model: DomainModel): DeckAbelianReading | null {
  const sealed = sealDomainRealization(model);
  if (!sealed.sealed) return null; // no deck group — a true absence, never a placeholder
  const maps: Mat4[] = [];
  for (const entry of sealed.seal.deck.entries) {
    maps.push(entry.m);
    maps.push(matrixInverse4(entry.m));
  }
  let maxDeviation = 0;
  for (let i = 0; i < maps.length; i += 1) {
    for (let j = i + 1; j < maps.length; j += 1) {
      const gh = mat4Mul(maps[i], maps[j]);
      const hg = mat4Mul(maps[j], maps[i]);
      for (let k = 0; k < 16; k += 1) {
        const d = Math.abs(gh[k] - hg[k]);
        if (d > maxDeviation) maxDeviation = d;
      }
    }
  }
  const abelian = maxDeviation <= DECK_ABELIAN_EPSILON;
  return {
    abelian,
    maxDeviation,
    mapsTested: maps.length,
    row: { label: 'deck abelian', value: abelian ? 'yes' : 'no', kind: 'measure' },
  };
}

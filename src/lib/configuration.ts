// configuration — STAMP THE-ALTITUDE · slice 2 (2026-10-09; ADR 0031 §9.30 R1–R3; the ruling THE PROJECTION §19.10–§19.11; MARKER
// THE-ALTITUDE · M1, the mothership's 10-08 19:43; its 10-09 09:09 BUILD, slice 2): THE CONFIGURATION — the third's own structure
// RESTRICTED to the roles the person placed and TRANSPORTED along his marks, as FORM.
//
// THE HOLE (Arman 19:07: "what happens to the relations btw, no mapping for them?"). A cast is roles in relations under axioms, and a role
// is what its relations make it. The altitude as first ruled placed the third's ROLES at the ends' roles and said nothing of its RELATIONS
// among them. The repair is one operation the record already named in pieces: restrict and transport. The device cuts nothing, composes
// nothing, identifies no word; the person cuts by denial, composes by rule, names.
// R1 · THE CONFIGURATION AT AN END-ROLE x (D23 extended): the roles of Z present at x and denied of x; Z's own relations INDUCED among the
// present roles — its refusals included, a cast's refusals being part of its configuration; and Z's CUT BONDS at x: its relations from a
// present role to a role absent or denied there. A cut is read in two strengths: CUT BY DENIAL — the absent role denied at x in some word,
// or the bond itself denied there by his saying — is the vault's switched-off trait, by his act; CUT BY SILENCE is dangling, never
// inferred: computed here (the witness agrees with the instrument's 58), shown nowhere until Arman decides (the mothership's 19:43).
// The person's OVERRIDE is the altitude's second entry kind, a bond saying `at x, S(z, z′) holds / does not hold` (altitude.ts).
// R2 · BONDS ACROSS THE MIDPOINT (D24 extended): a relation S(z, z′) of Z with z present at x and z′ at y spans the cell (x, y) with Z's own
// word, in either order (a reflexive relation spans twice, once each way, as the instrument counts it); a refused relation of Z spans as a
// REFUSED ROUTE (D16's kind, form). Forks and bonds are distinguished; the surface reads them by count and lists on demand, because bonds
// multiply. Verdicts and rules (D6) apply to a bond as to a fork — the sorting reads them (sorting.ts).
// R3 · PARALLELS (D4 extended; τ dissolved into D6): where an end's own relation R(x, x′) stands and z at x, z′ at x′ carry S(z, z′) of Z, the
// two run PARALLEL along the marks — shown as form, judged by no device; composed only by the person's rule (slice 2 shows; the rule over a
// parallel is where new words are born, unexercised — the ruling's open item). A parallel across a refusal — R refused and S holding, or
// the reverse — is a DISCORDANCE in D4's sense, shown and never resolved.
// RECORD, NOT READING: the casts and the altitude are the inputs; everything here is re-derived at every read. React-free; DOM-free.
// Pinned by scripts/diagnose-the-configuration.cjs against `the_configuration.cjs` on ARMAN-2 (34 induced · 58 cut · cells 41 by bonds,
// 27 by forks · 134 bond-instances · parallels 23 on F and 27 on Φ), on its no-hold run, and on its two sealed controls.

import type { ConceptSpace } from '../types/geometry';
import { bondSayingsOf, marksAt, type AltitudeEntry } from './altitude';

/** a relation of a cast as the configuration reads it: its word (the cast's `type`), its terms (role ids), whether the cast says it holds */
export interface CastRelation { w: string; terms: string[]; holds: boolean }
export const relationsOf = (space: ConceptSpace | null | undefined): CastRelation[] => (space?.relations ?? []).map((r) => ({ w: r.type, terms: [...r.terms], holds: r.polarity === 'holds' }));
const binary = (r: CastRelation): boolean => r.terms.length === 2;
const presentAt = (entries: readonly AltitudeEntry[], role: string): Set<string> => new Set(marksAt(entries, role).present.map((m) => m.z));
const deniedAt = (entries: readonly AltitudeEntry[], role: string): Set<string> => new Set(marksAt(entries, role).denied.map((m) => m.z));

// ─── R1 — the configuration at an end-role ───
/** his override at an end: a bond saying `at x, S(z, z′) holds / does not hold` */
export interface BondOverride { S: string; z: string; z2: string; holds: boolean }
/** a cut bond at x: Z's relation from a present role to a role absent or denied there; `missing` names each absent term and whether it is denied at x */
export interface CutBond { relation: CastRelation; missing: Array<{ role: string; byDenial: boolean }>; deniedHere: boolean }
export interface EndConfiguration {
  x: string;
  present: string[]; // Z's roles present at x, in the record's order
  denied: string[]; // Z's roles denied of x
  induced: CastRelation[]; // Z's relations among the present roles (refusals included)
  cut: CutBond[]; // Z's positive relations from a present role to a role not present here
  overrides: BondOverride[]; // his bond sayings at x
}
export function configurationAt(Z: ConceptSpace | null | undefined, entries: readonly AltitudeEntry[], x: string): EndConfiguration {
  const P = presentAt(entries, x); const D = deniedAt(entries, x);
  const rels = relationsOf(Z);
  const overrides: BondOverride[] = bondSayingsOf(entries).filter((b) => b[1] === x).map((b) => ({ S: b[2], z: b[3], z2: b[4], holds: b[5] === '+' }));
  const induced = rels.filter((r) => r.terms.length > 0 && r.terms.every((t) => P.has(t)));
  const cut: CutBond[] = rels
    .filter((r) => r.holds && r.terms.some((t) => P.has(t)) && !r.terms.every((t) => P.has(t)))
    .map((r) => ({ relation: r, missing: r.terms.filter((t) => !P.has(t)).map((t) => ({ role: t, byDenial: D.has(t) })), deniedHere: overrides.some((o) => o.S === r.w && o.z === r.terms[0] && o.z2 === r.terms[1] && !o.holds) }));
  return { x, present: [...P], denied: [...D], induced, cut, overrides };
}
/** CUT BY DENIAL — the person's act (an absent role denied at x in some word, or the bond itself denied there); else the cut dangles by silence */
export const cutByDenial = (c: CutBond): boolean => c.deniedHere || c.missing.some((m) => m.byDenial);
/** an induced relation as he overrode it at x, or as the cast has it: his bond saying wins where one stands */
export function inducedHolds(cfg: EndConfiguration, r: CastRelation): { holds: boolean; overridden: boolean } {
  const o = cfg.overrides.find((v) => v.S === r.w && v.z === r.terms[0] && v.z2 === r.terms[1]);
  return o ? { holds: o.holds, overridden: true } : { holds: r.holds, overridden: false };
}

// ─── R2 — bonds across the midpoint ───
/** a bond spanning the cell (x, y): Z's relation S(z, z′) with z present at x and z′ at y (`zAt: 'x'`), or z′ at x and z at y (`zAt: 'y'`) */
export interface Bond { x: string; y: string; S: string; z: string; z2: string; holds: boolean; zAt: 'x' | 'y' }
export function bondsAcross(Z: ConceptSpace | null | undefined, entries: readonly AltitudeEntry[], rolesX: readonly string[], rolesY: readonly string[]): Bond[] {
  const out: Bond[] = [];
  const PX = new Map(rolesX.map((x) => [x, presentAt(entries, x)] as const));
  const PY = new Map(rolesY.map((y) => [y, presentAt(entries, y)] as const));
  const rels = relationsOf(Z).filter(binary);
  for (const x of rolesX) for (const y of rolesY) {
    const Px = PX.get(x) as Set<string>; const Py = PY.get(y) as Set<string>;
    if (Px.size === 0 || Py.size === 0) continue;
    for (const r of rels) {
      const [a, b] = r.terms;
      if (Px.has(a) && Py.has(b)) out.push({ x, y, S: r.w, z: a, z2: b, holds: r.holds, zAt: 'x' });
      if (Px.has(b) && Py.has(a)) out.push({ x, y, S: r.w, z: a, z2: b, holds: r.holds, zAt: 'y' });
    }
  }
  return out;
}
/** the forks of the same grid, for the counts beside the bonds: the roles of Z present at both ends of a cell */
export function forkCells(entries: readonly AltitudeEntry[], rolesX: readonly string[], rolesY: readonly string[]): Array<{ x: string; y: string; zs: string[] }> {
  const out: Array<{ x: string; y: string; zs: string[] }> = [];
  for (const x of rolesX) { const Px = presentAt(entries, x); if (Px.size === 0) continue; for (const y of rolesY) { const zs = [...presentAt(entries, y)].filter((z) => Px.has(z)); if (zs.length) out.push({ x, y, zs }); } }
  return out;
}
/** the counts the surface prints by count (R2): cells lit by bonds, by forks, by either; bond-instances (the holding relations, as the instrument counts them) */
export function bondCounts(Z: ConceptSpace | null | undefined, entries: readonly AltitudeEntry[], rolesX: readonly string[], rolesY: readonly string[]): { cellsByBonds: number; cellsByForks: number; cellsByEither: number; bondInstances: number; refusedRoutes: number } {
  const bonds = bondsAcross(Z, entries, rolesX, rolesY);
  const holding = bonds.filter((b) => b.holds);
  const byBonds = new Set(holding.map((b) => `${b.x}|${b.y}`));
  const byForks = new Set(forkCells(entries, rolesX, rolesY).map((f) => `${f.x}|${f.y}`));
  return { cellsByBonds: byBonds.size, cellsByForks: byForks.size, cellsByEither: new Set([...byBonds, ...byForks]).size, bondInstances: holding.length, refusedRoutes: bonds.length - holding.length };
}

// ─── R3 — parallels and discordances ───
/** an end's own relation R(x, x′) beside Z's S(z, z′) along the marks (z at x, z′ at x′); across a refusal, a discordance */
export interface Parallel { R: CastRelation; S: CastRelation; x: string; x2: string; z: string; z2: string; discordance: boolean }
export function parallelsOn(end: ConceptSpace | null | undefined, Z: ConceptSpace | null | undefined, entries: readonly AltitudeEntry[]): Parallel[] {
  const out: Parallel[] = [];
  const ZR = relationsOf(Z).filter(binary);
  for (const R of relationsOf(end).filter(binary)) {
    const [x, x2] = R.terms;
    const Px = presentAt(entries, x); const Px2 = presentAt(entries, x2);
    if (Px.size === 0 || Px2.size === 0) continue;
    for (const S of ZR) { const [z, z2] = S.terms; if (Px.has(z) && Px2.has(z2)) out.push({ R, S, x, x2, z, z2, discordance: R.holds !== S.holds }); }
  }
  return out;
}

/** the configuration's totals over the ends, as the instrument prints them: induced relation-instances and cut bonds across every end-role */
export function configurationTotals(Z: ConceptSpace | null | undefined, entries: readonly AltitudeEntry[], endRoles: readonly string[]): { induced: number; cut: number; cutByDenial: number; ends: EndConfiguration[] } {
  const ends = endRoles.map((x) => configurationAt(Z, entries, x));
  return { induced: ends.reduce((n, e) => n + e.induced.length, 0), cut: ends.reduce((n, e) => n + e.cut.length, 0), cutByDenial: ends.reduce((n, e) => n + e.cut.filter(cutByDenial).length, 0), ends };
}

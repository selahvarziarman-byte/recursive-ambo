// ═══ THE CAST LOADER — `STAMP C-6c` (ii), 2026-09-19: a `.cast.json` file
// becomes the `cast` a CORNER holds (ADR 0031 §1.1, §5; the type landed at
// 7bd9cbc as STAMP C-6TYPE). NOT_FROZEN while only components and the store
// import it.
//
// THE RANGE IS THE TYPE (the researcher, 2026-09-19): roles · a signature of
// any arity · relations with polarity · axioms carried · warrant carried. MOLD
// v4 §5 is ONE PROFILE of it — read here as one file-shape mapping onto the
// type — and a bare relational structure (three roles, one binary type, three
// tuples) loads exactly as well. Everything the file has that the type lacks
// (concept · subject_matter · premises · gloss · source · reason · annotations ·
// derived_check · open_forks · did_not_fit …) is CARRIED UNREAD under the
// roles' `marks` and the space's `warrant` — never checked, never displayed as
// a verdict. The device checks what is true of a STRUCTURE, never of a
// PRACTICE.
//
// THREE STRUCTURAL CHECKS, and only these:
//   CLOSURE      every term resolves to a role id; every relation's type
//                resolves to the signature (an unresolved type has no arity,
//                so arity presupposes closure);
//   ARITY        `terms.length === arity`;
//   CONSISTENCY  the record is a FUNCTION — no `(type, terms)` with both
//                polarities; no duplicate role id; no signature name with two
//                arities.
// TWO REFUSALS, BY NAME — nothing else refuses:
//   (1) NOT A CAST   unparseable, or no `roles` / `signature` / `relations`;
//   (2) A CONTRADICTORY RECORD   refused at the CAST, and NAMED at the tuple
//       (C-6c (vi), the researcher's line): ONE refusal listing every offending
//       tuple, role id, signature name and both-homes name; a repetition with
//       identical content is redundancy, read once.
// CLOSURE and ARITY breaks are LOCAL → TAKEN AND MARKED, never refused: carry
// what the substrate holds · mark what it does not · erase neither. The marks
// are COUNTS and NAMES, never verdicts.
// ⛔ THE DEVICE NEVER GRADES: no tick, no `valid`, no `ok` shown, no green.
// THE FIVE PROMISES (MOLD v4 §7) are its acceptance test, discharged by
// behaviour: never fill `label` from the file · never write `identification` ·
// read `relations` and nothing else · unlisted tuples UNRECORDED (never
// does-not-hold) · load state PER CORNER (the caller writes the selected
// corner's `cast` and nothing else).

import type { ConceptRelation, ConceptRelationType, ConceptRole, ConceptSpace, JsonValue, PacketData } from '../types/geometry';

export type CastLoad =
  | { taken: true; cast: ConceptSpace; marks: string[] }
  | { taken: false; refusal: string };

export const NOT_A_CAST = 'this file is not a cast';

type JsonObject = Record<string, JsonValue>;

const isObject = (v: unknown): v is JsonObject => typeof v === 'object' && v !== null && !Array.isArray(v);
const isString = (v: unknown): v is string => typeof v === 'string';

/** the file's keys the type has no field for — carried, never read */
const rest = (o: JsonObject, taken: string[]): PacketData => {
  const out: PacketData = {};
  for (const k of Object.keys(o)) if (!taken.includes(k)) out[k] = o[k];
  return out;
};

const polarityOf = (v: unknown): ConceptRelation['polarity'] | null =>
  v === 'holds' || v === 'does-not-hold' ? v : null;

const tupleKey = (r: { type: string; terms: string[] }): string => `${r.type}(${r.terms.join(', ')})`;

/** the refusal's head: `one tuple` · `one name` · `2 tuples and 1 type` — what the record states two things about */
function contradictionHead(items: Array<{ kind: 'tuple' | 'role' | 'type' | 'name' }>): string {
  const counts = new Map<string, number>();
  for (const c of items) counts.set(c.kind, (counts.get(c.kind) ?? 0) + 1);
  const parts = [...counts.entries()].map(([kind, n]) => (n === 1 && items.length === 1 ? `one ${kind}` : `${n} ${kind}${n === 1 ? '' : 's'}`));
  return parts.length <= 1 ? parts.join('') : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
}

/** THE READ — text in, a cast (taken, with its marks) or a refusal (by name) out. */
export function readCastFile(text: string): CastLoad {
  let parsed: JsonValue;
  try {
    parsed = JSON.parse(text) as JsonValue;
  } catch {
    return { taken: false, refusal: NOT_A_CAST };
  }
  if (!isObject(parsed) || !Array.isArray(parsed.roles) || !Array.isArray(parsed.signature) || !Array.isArray(parsed.relations)) {
    return { taken: false, refusal: NOT_A_CAST };
  }
  const marks: string[] = [];
  // rider (b) on (vi), the researcher's line: a malformed item is not an item OF the
  // structure, but it is bytes the person wrote — CARRIED on the warrant, keyed
  // by its home and index, beside the mark that names it (never erased)
  const malformed: PacketData = {};

  // ── roles: id (required — a role without one is not a role), label (the CASTER's word), types, the rest carried ──
  const rolesRead: ConceptRole[] = [];
  parsed.roles.forEach((raw, i) => {
    if (!isObject(raw) || !isString(raw.id) || raw.id.length === 0) {
      if (isString(raw) && raw.length > 0) {
        rolesRead.push({ id: raw }); // a bare id is a role — the thin cast
        return;
      }
      marks.push(`role ${i}: has no id — not taken`);
      malformed[`roles.${i}`] = raw;
      return;
    }
    const role: ConceptRole = { id: raw.id };
    if (isString(raw.label) && raw.label.length > 0) role.label = raw.label;
    if (isObject(raw.types)) {
      const types: Record<string, string | 'UNKNOWN'> = {};
      for (const [k, v] of Object.entries(raw.types)) if (isString(v)) types[k] = v;
      if (Object.keys(types).length > 0) role.types = types;
    }
    const carried = rest(raw, ['id', 'label', 'types']);
    if (Object.keys(carried).length > 0) role.marks = carried;
    rolesRead.push(role);
  });

  // ── the signature: type · arity; the rest (meaning · properties · subtypes) carried on the warrant ──
  const signatureRead: ConceptRelationType[] = [];
  const signatureCarried: PacketData = {};
  parsed.signature.forEach((raw, i) => {
    if (!isObject(raw) || !isString(raw.type) || raw.type.length === 0 || typeof raw.arity !== 'number' || !Number.isInteger(raw.arity) || raw.arity < 1) {
      marks.push(`signature ${i}: has no type or no whole arity — not taken`);
      malformed[`signature.${i}`] = raw;
      return;
    }
    signatureRead.push({ type: raw.type, arity: raw.arity });
    const carried = rest(raw, ['type', 'arity']);
    if (Object.keys(carried).length > 0) signatureCarried[raw.type] = carried;
  });

  // ── relations: type · terms · polarity; reason/annotations carried on the warrant by index ──
  const relationsRead: ConceptRelation[] = [];
  const relationCarried: PacketData = {};
  parsed.relations.forEach((raw, i) => {
    if (!isObject(raw) || !isString(raw.type) || !Array.isArray(raw.terms) || !raw.terms.every(isString)) {
      marks.push(`relation ${i}: has no type or no terms — not taken`);
      malformed[`relations.${i}`] = raw;
      return;
    }
    const polarity = polarityOf(raw.polarity);
    if (polarity === null) {
      marks.push(`relation ${i}: polarity "${String(raw.polarity)}" is neither holds nor does-not-hold — not taken`);
      malformed[`relations.${i}`] = raw;
      return;
    }
    relationsRead.push({ type: raw.type, terms: raw.terms as string[], polarity });
    const carried = rest(raw, ['type', 'terms', 'polarity']);
    if (Object.keys(carried).length > 0) relationCarried[String(i)] = carried;
  });

  // ── axioms: sentences carried, never evaluated; their hypothesis/source/status carried beside ──
  const axioms: string[] = [];
  const axiomCarried: PacketData = {};
  if (Array.isArray(parsed.axioms)) {
    parsed.axioms.forEach((raw, i) => {
      if (isString(raw)) axioms.push(raw);
      else if (isObject(raw) && isString(raw.sentence)) {
        axioms.push(raw.sentence);
        const carried = rest(raw, ['sentence']);
        if (Object.keys(carried).length > 0) axiomCarried[String(i)] = carried;
      } else {
        marks.push(`axiom ${i}: has no sentence — not taken`);
        malformed[`axioms.${i}`] = raw;
      }
    });
  }

  // ── CONSISTENCY (C-6c (vi), the researcher's line, ratified §98.1) — the record is a
  // FUNCTION. Every contradiction is COLLECTED and the CAST refused ONCE, the
  // refusal naming each at its address (effect at the cast, address at the tuple).
  // A repetition with IDENTICAL content is REDUNDANCY — a relation is a set, a
  // signature is a set, a role is one: read once, nothing erased, no mark. And
  // one name has ONE home (δ3 as amended): a type-name declared in the signature
  // that also appears as a key in any role's `types` is itself the contradiction —
  // the roles' home is categorical (`K: v` denies every other value; its negative
  // is another value, never a polarity; UNKNOWN is unrecorded), so no negative is
  // needed and none is invented. ──
  const contradictions: Array<{ kind: 'tuple' | 'role' | 'type' | 'name'; line: string }> = [];
  const roleById = new Map<string, ConceptRole>();
  const roleSet: ConceptRole[] = [];
  const contradictedRoles = new Set<string>();
  for (const role of rolesRead) {
    const prior = roleById.get(role.id);
    if (prior === undefined) {
      roleById.set(role.id, role);
      roleSet.push(role);
    } else if (JSON.stringify(prior) !== JSON.stringify(role) && !contradictedRoles.has(role.id)) {
      contradictedRoles.add(role.id);
      contradictions.push({ kind: 'role', line: `role id "${role.id}" is declared twice` });
    }
  }
  const arityOf = new Map<string, number>();
  const signatureSet: ConceptRelationType[] = [];
  const contradictedTypes = new Set<string>();
  for (const s of signatureRead) {
    const prior = arityOf.get(s.type);
    if (prior === undefined) {
      arityOf.set(s.type, s.arity);
      signatureSet.push(s);
    } else if (prior !== s.arity && !contradictedTypes.has(s.type)) {
      contradictedTypes.add(s.type);
      contradictions.push({ kind: 'type', line: `type "${s.type}" is declared with arity ${prior} and arity ${s.arity}` });
    }
  }
  const roleTypeKeys = new Set<string>();
  for (const role of roleSet) for (const k of Object.keys(role.types ?? {})) roleTypeKeys.add(k);
  for (const name of arityOf.keys()) {
    if (roleTypeKeys.has(name)) contradictions.push({ kind: 'name', line: `"${name}" is declared in the signature and on the roles` });
  }
  const polarityByTuple = new Map<string, ConceptRelation['polarity']>();
  const relationSet: ConceptRelation[] = [];
  const contradictedTuples = new Set<string>();
  for (const r of relationsRead) {
    const key = tupleKey(r);
    const prior = polarityByTuple.get(key);
    if (prior === undefined) {
      polarityByTuple.set(key, r.polarity);
      relationSet.push(r);
    } else if (prior !== r.polarity && !contradictedTuples.has(key)) {
      contradictedTuples.add(key);
      contradictions.push({ kind: 'tuple', line: `${key} is listed both holds and does-not-hold` });
    }
  }
  if (contradictions.length > 0) {
    // the addresses in the order the researcher's line names them: tuples, then roles, types, names
    const rank = { tuple: 0, role: 1, type: 2, name: 3 } as const;
    contradictions.sort((a, b) => rank[a.kind] - rank[b.kind]);
    return { taken: false, refusal: `not taken — the record states two things about ${contradictionHead(contradictions)} · ${contradictions.map((c) => c.line).join(' · ')}` };
  }
  const roles = roleSet;
  const signature = signatureSet;
  const relations = relationSet;

  // ── C-6c (i)'s rider: the SUBJECT MATTER has a typed home (sanctioned, Δ79) — a
  // string, read on the card beside the person's label in the caster's register;
  // MOLD v4 §5 names it `subject_matter`, a bare cast may say `subject`. Absent =
  // absent (never filled); anything but a non-empty string is carried unread as
  // before. It enters no structural check and no refusal.
  const subjectRaw = parsed.subject_matter !== undefined ? parsed.subject_matter : parsed.subject;
  const subject = isString(subjectRaw) && subjectRaw.trim().length > 0 ? subjectRaw : undefined;
  // ── the rest of the file — carried on the warrant, never read ──
  const fileCarried = rest(parsed, ['roles', 'signature', 'relations', 'axioms', 'warrant', ...(subject !== undefined ? ['subject_matter', 'subject'] : [])]);
  const warrant: PacketData = {};
  if (isObject(parsed.warrant)) warrant.warrant = parsed.warrant;
  if (Object.keys(fileCarried).length > 0) warrant.file = fileCarried;
  if (Object.keys(signatureCarried).length > 0) warrant.signature = signatureCarried;
  if (Object.keys(relationCarried).length > 0) warrant.relations = relationCarried;
  if (Object.keys(axiomCarried).length > 0) warrant.axioms = axiomCarried;
  if (Object.keys(malformed).length > 0) warrant.malformed = malformed;

  const cast: ConceptSpace = { roles, signature, relations, axioms };
  if (subject !== undefined) cast.subject = subject;
  if (Object.keys(warrant).length > 0) cast.warrant = warrant;
  return { taken: true, cast, marks: [...marks, ...castMarks(cast)] };
}

/**
 * THE ITEMS NOT TAKEN (C-6e, ruled): the addresses under `warrant.malformed` — the device's OWN record of what it
 * declined, read by KEY only (never a value: the warrant's content stays the caster's, unread). `relations.3` → `relation 3`,
 * `roles.1` → `role 1`, `signature.2` → `signature entry 2`, `axioms.1` → `axiom 1` — in the file's order.
 */
export function notTakenAddresses(cast: ConceptSpace): string[] {
  const malformed = cast.warrant?.malformed;
  if (!malformed || typeof malformed !== 'object' || Array.isArray(malformed)) return [];
  const noun: Record<string, string> = { roles: 'role', signature: 'signature entry', relations: 'relation', axioms: 'axiom' };
  return Object.keys(malformed).map((k) => {
    const [home, index] = k.split('.');
    return `${noun[home] ?? home} ${index}`;
  });
}

/** the clause the card prints beside the closure/arity marks — never folded into their count (one glyph, one meaning) */
export function notTakenLine(addresses: string[]): string | null {
  if (addresses.length === 0) return null;
  return `${addresses.length} ${addresses.length === 1 ? 'item' : 'items'} not taken: ${addresses.join(' · ')}`;
}

/** CLOSURE and ARITY, re-derived from a held cast (RECORD, NOT READING): counts and names, never verdicts. */
export function castMarks(cast: ConceptSpace): string[] {
  const marks: string[] = [];
  const roleIds = new Set(cast.roles.map((r) => r.id));
  const arityOf = new Map(cast.signature.map((s) => [s.type, s.arity] as const));
  let wrongArity = 0;
  cast.relations.forEach((r, i) => {
    for (const term of r.terms) if (!roleIds.has(term)) marks.push(`relation ${i}: "${term}" is not among your roles`);
    const arity = arityOf.get(r.type);
    if (arity === undefined) {
      marks.push(`relation ${i}: type "${r.type}" is not in your signature`);
      return; // arity presupposes closure
    }
    if (r.terms.length !== arity) wrongArity += 1;
  });
  if (wrongArity > 0) marks.push(`${wrongArity} ${wrongArity === 1 ? 'tuple' : 'tuples'} with the wrong arity`);
  return marks;
}

export interface CastOrdering {
  type: string;
  tuples: number;
  reversed: number; // tuples whose terms appear, in another order, as another listed tuple of the same type and polarity
  // arity 2: `symmetric` iff every listed tuple is reversed; arity ≥ 3: `symmetric` ONLY when every permutation of
  // every listed tuple is listed (a weaker `every one reversed` reads `directed`); null when nothing is listed
  reading: OrderingReading | null;
}

// ═══ THE MOLD'S OWN TYPES — `STAMP C-6d (γ)` §1.2 (the researcher's line): types the MOLD
// DEFINES are shared BY DEFINITION, without τ — `member_status` is the device's contract
// with casters (MOLD v4 §2.1), not a caster's word; every cast's `member_status` IS that
// type, compared by name, and the first face's refusal fires by name. Caster-defined
// types — everything in `signature` or invented as a `types` key — are shared only by τ.
// ONE constant, here, read by the register (src/lib/jRegister.ts) — never a second list.
//
// `STAMP C-7pre` (2026-09-22, the researcher's finding §108.1.2, MOLD v4 §2.1 amended): the
// mold's values are compared as the ROLE-FACT they assert, never as bare tokens. `unrecorded`
// was DEFINED as "members EXIST, none on record" — so `has` and `unrecorded` assert ONE
// role-fact (members exist) and differ only in a RECORD-fact the device never reads; a
// refusal of `has × unrecorded` named a contradiction that was not one (a fabricated
// refusal, found by the researcher's own seal firing). The glued value is the UNION
// record's — the union of two records lists members iff one of them does: `has ⊔
// unrecorded = has`. Only `none-by-nature` against either contradicts. UNKNOWN and
// omission stay absence (never a value). The role-facts live ON the constant — one place.
export interface MoldType {
  readonly name: string;
  readonly arity: 1;
  readonly values: readonly string[];
  /** the ROLE-FACT each value asserts — two values with one role-fact agree */
  readonly roleFact: Readonly<Record<string, string>>;
  /** the UNION record's value for a role-fact two different values assert */
  readonly union: Readonly<Record<string, string>>;
}
export const MOLD_TYPES: ReadonlyArray<MoldType> = [
  {
    name: 'member_status',
    arity: 1,
    values: ['has', 'unrecorded', 'none-by-nature'],
    roleFact: { has: 'members exist', unrecorded: 'members exist', 'none-by-nature': 'no members' },
    union: { 'members exist': 'has' },
  },
];
export const isMoldType = (name: string): boolean => MOLD_TYPES.some((mold) => mold.name === name);

/**
 * C-7pre — two KNOWN values of a mold type at the glue: the same value, or two values asserting ONE role-fact, give the
 * glued value (`has ⊔ unrecorded = has`; `unrecorded ⊔ unrecorded = unrecorded`); anything else is a CONTRADICTION (null).
 * A name the mold does not define agrees by bare value only.
 */
export function moldJoin(name: string, u: string, v: string): string | null {
  if (u === v) return u;
  const mold = MOLD_TYPES.find((m) => m.name === name);
  if (!mold) return null;
  const fu = mold.roleFact[u];
  const fv = mold.roleFact[v];
  if (fu === undefined || fv === undefined || fu !== fv) return null;
  return mold.union[fu] ?? null;
}

/** the device's READING of a relation-type's term order — disclosed, never posited (C-6d (γ) §3.1, the designer's ruling) */
export type OrderingReading = 'directed' | 'symmetric';

export interface CastCounts {
  roles: number;
  relationTypes: number; // BOTH homes: the signature's types + the arity-1 types declared on roles
  relations: number; // BOTH homes: the listed tuples + every (role, type) entry — each is an arity-1 relation
  axioms: number;
  unknownTypes: number; // the entries written UNKNOWN — shown where written; omission is silent
  orderings: CastOrdering[]; // per relation-type of arity ≥ 2 — term order is content
}

/** THE CARD'S NUMBERS — derived from the held cast, never stored. */
export function castCounts(cast: ConceptSpace): CastCounts {
  const roleTypeKeys = new Set<string>();
  let roleTypeEntries = 0;
  let unknownTypes = 0;
  for (const role of cast.roles) {
    for (const [k, v] of Object.entries(role.types ?? {})) {
      roleTypeKeys.add(k);
      roleTypeEntries += 1;
      if (v === 'UNKNOWN') unknownTypes += 1;
    }
  }
  const signatureTypes = new Set(cast.signature.map((s) => s.type));
  const orderings: CastOrdering[] = [];
  for (const s of cast.signature) {
    if (s.arity < 2) continue;
    const listed = cast.relations.filter((r) => r.type === s.type);
    const keyOf = (r: ConceptRelation): string => `${r.polarity}|${JSON.stringify(r.terms)}`;
    let reversed = 0;
    for (const r of listed) {
      const sorted = JSON.stringify([...r.terms].sort());
      const sameMultiset = listed.filter((o) => o !== r && o.polarity === r.polarity && JSON.stringify([...o.terms].sort()) === sorted && keyOf(o) !== keyOf(r));
      if (sameMultiset.length > 0) reversed += 1;
    }
    const keys = new Set(listed.map(keyOf));
    const everyPermutationListed = listed.every((r) => permutations(r.terms).every((terms) => keys.has(`${r.polarity}|${JSON.stringify(terms)}`)));
    const reading: OrderingReading | null = listed.length === 0 ? null : s.arity === 2 ? (reversed === listed.length ? 'symmetric' : 'directed') : everyPermutationListed ? 'symmetric' : 'directed';
    orderings.push({ type: s.type, tuples: listed.length, reversed, reading });
  }
  const bothHomesTypes = new Set([...signatureTypes, ...roleTypeKeys]);
  return {
    roles: cast.roles.length,
    relationTypes: bothHomesTypes.size,
    relations: cast.relations.length + roleTypeEntries,
    axioms: cast.axioms.length,
    unknownTypes,
    orderings,
  };
}

/** every distinct ordering of a tuple's terms (the arity is small; a repeated term yields no duplicate) */
function permutations(terms: string[]): string[][] {
  if (terms.length <= 1) return [terms];
  const out: string[][] = [];
  const seen = new Set<string>();
  terms.forEach((head, i) => {
    for (const rest of permutations([...terms.slice(0, i), ...terms.slice(i + 1)])) {
      const p = [head, ...rest];
      const k = JSON.stringify(p);
      if (!seen.has(k)) { seen.add(k); out.push(p); }
    }
  });
  return out;
}

/**
 * the orderings line, the READING stated beside the evidence (C-6d (γ) §3.1): `r · 3 tuples · none reversed — read as
 * directed` · `r · 6 tuples · every one reversed — read as symmetric` · `r · 5 tuples · 2 reversed — read as directed`;
 * a type with nothing listed has no reading to state.
 */
export function orderingLine(o: CastOrdering): string {
  const tuples = `${o.tuples} ${o.tuples === 1 ? 'tuple' : 'tuples'}`;
  const reversed = o.tuples === 0 ? 'none listed' : o.reversed === 0 ? 'none reversed' : o.reversed === o.tuples ? 'every one reversed' : `${o.reversed} reversed`;
  return `${o.type} · ${tuples} · ${reversed}${o.reading ? ` — read as ${o.reading}` : ''}`;
}

/** the cast's ONE reading clause (C-6d (γ) §3.2): `directed` if any relation-type reads directed, `symmetric` only if every one does, absent when nothing of arity ≥ 2 is listed */
export function castReading(counts: CastCounts): OrderingReading | null {
  const readings = counts.orderings.map((o) => o.reading).filter((r): r is OrderingReading => r !== null);
  if (readings.length === 0) return null;
  return readings.every((r) => r === 'symmetric') ? 'symmetric' : 'directed';
}

/** THE CARD'S FIRST LINE — three states: no cast → NO ROW (the caller renders nothing); a cast of nothing; a cast with content. */
export function castSummaryLine(cast: ConceptSpace): string {
  if (cast.roles.length === 0) return 'a cast of nothing — no roles';
  const c = castCounts(cast);
  const parts = [
    `${c.roles} ${c.roles === 1 ? 'role' : 'roles'}`,
    `${c.relationTypes} relation-${c.relationTypes === 1 ? 'type' : 'types'}`,
    `${c.relations} ${c.relations === 1 ? 'relation' : 'relations'}`,
  ];
  // C-6d (γ) §3.2 (the designer's ruling): the ACT's line carries the device's reading of term order;
  // the card's rows keep the evidence per type — summary and detail, nothing printed twice
  const reading = castReading(c);
  if (reading) parts.push(`read as ${reading}`);
  // C-6d rider 1 (the designer's own correction of her template, 2137 §5b): the axioms
  // clause is CONDITIONAL, exactly as the warrant clause — `0 axioms carried` marked the
  // ordinary and claimed a carry that did not happen
  if (c.axioms > 0) parts.push(`${c.axioms} ${c.axioms === 1 ? 'axiom' : 'axioms'} carried, never evaluated`);
  if (cast.warrant !== undefined) parts.push('warrant carried, never read');
  return `taken — ${parts.join(' · ')}`;
}

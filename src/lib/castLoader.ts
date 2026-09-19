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
//   (2) A CONTRADICTORY RECORD   refused at the CAST (the designer's ruling;
//       one line with the researcher — a tuple-level answer is a one-line
//       change), pointing at the line.
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

  // ── roles: id (required — a role without one is not a role), label (the CASTER's word), types, the rest carried ──
  const roles: ConceptRole[] = [];
  parsed.roles.forEach((raw, i) => {
    if (!isObject(raw) || !isString(raw.id) || raw.id.length === 0) {
      if (isString(raw) && raw.length > 0) {
        roles.push({ id: raw }); // a bare id is a role — the thin cast
        return;
      }
      marks.push(`role ${i}: has no id — not taken`);
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
    roles.push(role);
  });

  // ── the signature: type · arity; the rest (meaning · properties · subtypes) carried on the warrant ──
  const signature: ConceptRelationType[] = [];
  const signatureCarried: PacketData = {};
  parsed.signature.forEach((raw, i) => {
    if (!isObject(raw) || !isString(raw.type) || raw.type.length === 0 || typeof raw.arity !== 'number' || !Number.isInteger(raw.arity) || raw.arity < 1) {
      marks.push(`signature ${i}: has no type or no whole arity — not taken`);
      return;
    }
    signature.push({ type: raw.type, arity: raw.arity });
    const carried = rest(raw, ['type', 'arity']);
    if (Object.keys(carried).length > 0) signatureCarried[raw.type] = carried;
  });

  // ── relations: type · terms · polarity; reason/annotations carried on the warrant by index ──
  const relations: ConceptRelation[] = [];
  const relationCarried: PacketData = {};
  parsed.relations.forEach((raw, i) => {
    if (!isObject(raw) || !isString(raw.type) || !Array.isArray(raw.terms) || !raw.terms.every(isString)) {
      marks.push(`relation ${i}: has no type or no terms — not taken`);
      return;
    }
    const polarity = polarityOf(raw.polarity);
    if (polarity === null) {
      marks.push(`relation ${i}: polarity "${String(raw.polarity)}" is neither holds nor does-not-hold — not taken`);
      return;
    }
    relations.push({ type: raw.type, terms: raw.terms as string[], polarity });
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
      } else marks.push(`axiom ${i}: has no sentence — not taken`);
    });
  }

  // ── CONSISTENCY — the record is a function; a contradiction refuses the CAST, pointing at the line ──
  const seenRole = new Set<string>();
  for (const role of roles) {
    if (seenRole.has(role.id)) return { taken: false, refusal: `not taken — the record states two things about one role · role id "${role.id}" is declared twice` };
    seenRole.add(role.id);
  }
  const arityOf = new Map<string, number>();
  for (const s of signature) {
    const prior = arityOf.get(s.type);
    if (prior !== undefined && prior !== s.arity) {
      return { taken: false, refusal: `not taken — the record states two things about one type · type "${s.type}" is declared with arity ${prior} and arity ${s.arity}` };
    }
    arityOf.set(s.type, s.arity);
  }
  const polarityByTuple = new Map<string, ConceptRelation['polarity']>();
  for (const r of relations) {
    const key = tupleKey(r);
    const prior = polarityByTuple.get(key);
    if (prior !== undefined && prior !== r.polarity) {
      return { taken: false, refusal: `not taken — the record states two things about one tuple · ${key} is listed both holds and does-not-hold` };
    }
    polarityByTuple.set(key, r.polarity);
  }

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

  const cast: ConceptSpace = { roles, signature, relations, axioms };
  if (subject !== undefined) cast.subject = subject;
  if (Object.keys(warrant).length > 0) cast.warrant = warrant;
  return { taken: true, cast, marks: [...marks, ...castMarks(cast)] };
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
}

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
    orderings.push({ type: s.type, tuples: listed.length, reversed });
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

/** the orderings line: `r · 3 tuples · none reversed` · `r · 6 tuples · every one reversed` · `r · 5 tuples · 2 reversed` */
export function orderingLine(o: CastOrdering): string {
  const tuples = `${o.tuples} ${o.tuples === 1 ? 'tuple' : 'tuples'}`;
  const reversed = o.tuples === 0 ? 'none listed' : o.reversed === 0 ? 'none reversed' : o.reversed === o.tuples ? 'every one reversed' : `${o.reversed} reversed`;
  return `${o.type} · ${tuples} · ${reversed}`;
}

/** THE CARD'S FIRST LINE — three states: no cast → NO ROW (the caller renders nothing); a cast of nothing; a cast with content. */
export function castSummaryLine(cast: ConceptSpace): string {
  if (cast.roles.length === 0) return 'a cast of nothing — no roles';
  const c = castCounts(cast);
  const parts = [
    `${c.roles} ${c.roles === 1 ? 'role' : 'roles'}`,
    `${c.relationTypes} relation-${c.relationTypes === 1 ? 'type' : 'types'}`,
    `${c.relations} ${c.relations === 1 ? 'relation' : 'relations'}`,
    `${c.axioms} ${c.axioms === 1 ? 'axiom' : 'axioms'} carried, never evaluated`,
  ];
  if (cast.warrant !== undefined) parts.push('warrant carried, never read');
  return `taken — ${parts.join(' · ')}`;
}

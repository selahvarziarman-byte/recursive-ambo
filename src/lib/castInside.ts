// ═══ THE INSIDE of a corner's concept-space — `STAMP C-7a`, 2026-09-22: the
// INCIDENCE PRESENTATION of a cast, computed on the TYPE. NOT_FROZEN while only
// components and witnesses import it.
//
// THE SECOND IMPLEMENTATION of the researcher's `inside(X)` (.handoff/instruments/
// connection_layer_reference/inside_midpoint_trace.py, ratified §108) — the ADR
// 0031 kill-condition pattern: a disagreement between the two implementations
// reopens the DEFINITION, never tunes the code to the number. The seal it must
// reproduce: triangle 3 · 3 arrows · 0 loops · 0 hyper · 0 neg · 1 word · 0 marks;
// t-cell 10 · 10 · 0 · 1 hyper removes(r8, r3, r2) · 3 neg · 6 words · 10 marks;
// flow 14 · 31 · 3 loops · 0 · 0 · 11 words · 14 marks; phi 9 · 15 · 7 loops (six on
// Φ1) · 0 · 0 · 14 words · 9 marks.
//
// THE RECORD → THE MARK (the designer's FORM, ratified §110.2 — an ARC DIAGRAM,
// not a ring: on a circle the eye reads CROSSINGS as structure; a layout may add
// no meaning, and a column is already a list):
//   a role                       a POINT in a COLUMN, in the CASTER'S OWN ORDER;
//                                the caster's `label` if given, else the id AS AN
//                                ADDRESS (marked as one — never as a name)
//   `member_status` / a unary    a BADGE ON the point, its value in words; UNKNOWN
//   key on the role              only where the caster wrote it
//   an arity-1 type in the       a badge on the point too, carrying the tuple's
//   signature                    polarity as its value
//   arity 2, t₁ ≠ t₂             an ARC from t₁ to t₂ with its word on it; the SIDE
//                                is a FUNCTION OF THE TUPLE — `down` the caster's
//                                order or `up` it — never a choice of layout
//   arity 2, t₁ = t₂             a LOOP at the point (Φ1 carries six, Flow three)
//   arity ≥ 3                    a TUPLE-NODE offset from the column, its legs
//                                NUMBERED in the tuple's own order (removes(r8, r3, r2))
//   `does-not-hold`              a DISTINCT GLYPH on the mark — it is a VALUE; the T
//                                cell's three negatives are three drawn arcs
//   the unrecorded               ⛔ NOTHING — absence is the background (Flow: 2,156
//                                binary places against 34 filled)
//   axioms · warrant             TEXT beside, carried — never arrows
// ⛔ NO DERIVED ARROWS: no closure, no lattice, no transitivity, no orbits. The
// acceptance is FAITHFULNESS — the cast is RECOVERABLE from the presentation
// (every point, every tuple with its word and polarity, nothing else).
// A tuple whose term is not among the roles (a closure-broken cast, taken and
// marked by the loader) is UNPLACED: carried in its own list with the loader's
// own reason, never drawn as if it resolved and never erased.

import type { ConceptSpace } from '../types/geometry';
import { isMoldType } from './castLoader';

export type Polarity = 'holds' | 'does-not-hold';
/** the side an arc is drawn on — a function of the tuple: `down` the caster's order (from an earlier point to a later one) or `up` it */
export type ArcSide = 'down' | 'up';

export interface InsideBadge {
  key: string;
  value: string; // the value in words — `has` · `unrecorded` · `none-by-nature` · UNKNOWN where written · a polarity for an arity-1 signature type
  mold: boolean; // the mold's own type (shared by definition)
  home: 'roles' | 'signature';
}

export interface InsidePoint {
  index: number; // the caster's order
  id: string;
  label: string | null; // the caster's word, or null — then the id stands as an ADDRESS
  badges: InsideBadge[];
}

export interface InsideArc {
  type: string;
  from: number; // index of t₁
  to: number; // index of t₂
  polarity: Polarity;
  side: ArcSide;
}

export interface InsideLoop {
  type: string;
  at: number;
  polarity: Polarity;
}

export interface InsideTupleNode {
  type: string;
  legs: number[]; // point indices in the tuple's own order — leg k is numbered k + 1
  polarity: Polarity;
}

export interface InsideUnplaced {
  type: string;
  terms: string[];
  polarity: Polarity;
  reason: string;
}

export interface InsideCensus {
  points: number;
  arrows: number; // arity-2 tuples with two distinct terms
  loops: number;
  hyper: number; // arity ≥ 3 tuples
  negatives: number; // tuples of any arity known does-not-hold
  words: number; // the signature's types — the caster's words
  marks: number; // every (role, key) entry of the roles' `types`, UNKNOWN included (the caster wrote it)
  unknown: number; // the entries written UNKNOWN
  unplaced: number;
}

export interface Inside {
  points: InsidePoint[];
  arcs: InsideArc[];
  loops: InsideLoop[];
  nodes: InsideTupleNode[];
  unplaced: InsideUnplaced[];
  words: string[]; // the signature's types, in the caster's order
  axioms: string[]; // carried, never evaluated
  warrantCarried: boolean;
  census: InsideCensus;
}

/** THE INSIDE — the incidence presentation of a cast, re-derived at every read (RECORD, NOT READING). */
export function insideOf(cast: ConceptSpace): Inside {
  const points: InsidePoint[] = [];
  const indexOf = new Map<string, number>();
  let marks = 0;
  let unknown = 0;
  for (const role of cast.roles) {
    if (indexOf.has(role.id)) continue; // a role is one — read once
    const badges: InsideBadge[] = [];
    for (const [key, value] of Object.entries(role.types ?? {})) {
      marks += 1;
      if (value === 'UNKNOWN') unknown += 1;
      badges.push({ key, value, mold: isMoldType(key), home: 'roles' });
    }
    indexOf.set(role.id, points.length);
    points.push({ index: points.length, id: role.id, label: role.label && role.label.length > 0 ? role.label : null, badges });
  }
  const arcs: InsideArc[] = [];
  const loops: InsideLoop[] = [];
  const nodes: InsideTupleNode[] = [];
  const unplaced: InsideUnplaced[] = [];
  let negatives = 0;
  const seen = new Set<string>();
  for (const r of cast.relations) {
    const k = `${r.type}|${JSON.stringify(r.terms)}`;
    if (seen.has(k)) continue; // a relation is a set — a repetition is read once
    seen.add(k);
    const missing = r.terms.filter((t) => !indexOf.has(t));
    if (missing.length > 0) {
      unplaced.push({ type: r.type, terms: [...r.terms], polarity: r.polarity, reason: missing.map((t) => `"${t}" is not among your roles`).join(' · ') });
      continue;
    }
    if (r.polarity === 'does-not-hold') negatives += 1;
    const idx = r.terms.map((t) => indexOf.get(t) as number);
    if (idx.length === 1) {
      points[idx[0]].badges.push({ key: r.type, value: r.polarity, mold: false, home: 'signature' });
    } else if (idx.length === 2) {
      if (idx[0] === idx[1]) loops.push({ type: r.type, at: idx[0], polarity: r.polarity });
      else arcs.push({ type: r.type, from: idx[0], to: idx[1], polarity: r.polarity, side: idx[0] < idx[1] ? 'down' : 'up' });
    } else {
      nodes.push({ type: r.type, legs: idx, polarity: r.polarity });
    }
  }
  const words: string[] = [];
  for (const s of cast.signature) if (!words.includes(s.type)) words.push(s.type);
  return {
    points,
    arcs,
    loops,
    nodes,
    unplaced,
    words,
    axioms: [...cast.axioms],
    warrantCarried: cast.warrant !== undefined,
    census: {
      points: points.length,
      arrows: arcs.length,
      loops: loops.length,
      hyper: nodes.length,
      negatives,
      words: words.length,
      marks,
      unknown,
      unplaced: unplaced.length,
    },
  };
}

/** the census in one line, for a witness's note — never printed on the canvas (the card in the column reads the counts) */
export function insideCensusLine(c: InsideCensus): string {
  return `${c.points} points · ${c.arrows} arrows · ${c.loops} loops · ${c.hyper} hyper · ${c.negatives} neg · ${c.words} ${c.words === 1 ? 'word' : 'words'} · ${c.marks} marks`;
}

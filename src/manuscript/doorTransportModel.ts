// doorTransportModel — STAMP C-11a (2026-09-24): THE DOOR's ACT (§133 — Option R: the ROOM's door, the aperture's
// pairing row; the ground 0031 §3.9 / ruling §18, descent; the surface the designer's 1500 §1, placed at the row).
//
// The person's sentence: he has glued two faces of a lifted form into a door, and he gives the door a CONCEPT — which
// role of one side's corner crosses to which role of the other's. The door TRANSPORTS (0030 §0: the layer transports, it
// never pools): in the glued form the two boundary edges of a strip ARE one edge, so the two ways across each strip must
// be one transport — DESCENT, in this layer's form, read from EITHER face (the two-way strip condition):
//        (N_i)   e_{i+1} ∘ J_i = K_i ∘ e_i        and        (N_i′)   e_{i+1}⁻¹ ∘ K_i = J_i ∘ e_i⁻¹
// as PARTIAL maps, values and domains (in a groupoid the two are one equation; in an inverse category they are not —
// the partiality lives exactly in the difference; the one-way reading depends on which face is called A — D10).
//
// THE REFERENCE, cited not re-derived: the researcher's descent_at_the_door.py (.handoff/instruments/
// connection_layer_reference, 2026-09-23, RESULTS_2026-09-23_descent_at_the_door.txt, (N) two-way as amended). Its
// seal, in this file's terms: a LINE of a face is a component of the graph its boundary's J's draw on the roles of its
// corners — each role has at most one successor and one predecessor, so a line is a PATH (starting at corner s, running
// l edges) or a CYCLE (closing after m rounds of the face); D1: e descends ⇔ e is a union of WHOLE LINE-PAIRS of EQUAL
// SHAPE, each role paired at its own place; D2: ONE POINTED PAIR x ↦ y at corner i has a least lawful extension ⇔ the
// two lines have equal shape and x, y the same place — and it is exactly the whole line-pair; D3: the EMPTY transport
// always descends (the true absence of 0030 §1.2 is always lawful). This file is THE SECOND IMPLEMENTATION; a
// disagreement between the two reopens the DEFINITION, never tunes a number (scripts/diagnose-the-doors-act.cjs pins
// the reference's fixture census — 42 × 42 doors of the prism of two first faces — number for number).
//
// THE ACT (the designer's grammar, one for every distant hand — C-7h): point a role at one side's corner, then a role
// at the other's; nothing offered, nothing lit, the caster's order. TAKEN — the WHOLE line-pair, one hand for the line
// (the edges force the line; a per-pair hand would offer an undo the structure does not have). REFUSED BY THE LINES at
// the edge where they part. REFUSED BY THE RECORD at a corner, the tuple named — the glue of the two corners' spaces
// under the whole e at that corner would say two things about one tuple (the one register, jRegister's refusalOf — the
// same reader every midpoint act answers to). A role that can never cross (its line has no equal-shape line opposite) is
// said ONCE for the door, quietly. The empty state is a positive mark: the door exists, its transport does not yet.
//
// THE RECORD: `AperturePairRow.transports` — per corner pair of the picked candidate `{ corners, roles, types }`, the
// person's INPUT beside `FacePairing` (never inside the frozen type), persisted by the page file as it stands (the
// built record keeps its rows verbatim; hydration re-runs the same door). The J's of the door's boundary edges are
// READ on the carried record through the C-10 reader's record and the one resolver (a seed edge the person's record,
// a corner edge the carried coprojection, a medial edge the anchored meet ∪ his born pairs — bornStepOf, by kind), at
// every read, stored nowhere. RECORD, NOT READING: this file stores no line, no space, no verdict.
//
// ADDITIVE · DERIVE-ONLY · react-free (the section draws what this returns; the witness runs this under node).

import type { Shape, VertexId } from '../types/geometry';
import { nameIn, spaceOf, TRANSPORT_OPTIONS, type Resolved } from '../lib/spaceOf';
import { bornStepOf } from '../lib/bornFace';
import type { RoleMap } from '../lib/faceReading';
import { refusalOf, type Conflict } from '../lib/jRegister';
import type { DoorTransport } from './apertureModel';

/** a corner's space AS THE RESOLVER HANDS IT — this file reads resolved spaces, never a cast as held (C-8's law: the resolver is the one reader of a seed corner's cast; the ten readers of the type stand as ratified) */
export type CornerSpace = Resolved['space'];

export interface DoorLine {
  kind: 'path' | 'cycle';
  nodes: Array<[number, string]>; // [corner index, role id], in the line's own order (a path from its start; a cycle from its node at corner 0)
  shape: string; // `path:${start}:${length}` · `cycle:${rounds}` — equal shapes may pair
}

/** one face of the door: its corners in the door's order, the space at each (resolved on the record), the J of each boundary edge read in that direction, and the lines they draw */
export interface DoorSide {
  name: string; // the face's OWN name (D14 — composed from its corners in the face's own direction, never the door's order, which may run the other way)
  corners: VertexId[];
  spaces: CornerSpace[];
  J: RoleMap[]; // J[i]: corner i's roles ⇀ corner i+1's
  lines: DoorLine[];
  place: Map<string, { line: number; idx: number }>; // by `${corner}|${role}`
}

export type DoorSideResult = { state: 'read'; side: DoorSide } | { state: 'absent'; missing: string[] };

const inverse = (m: RoleMap): RoleMap => {
  const out: RoleMap = new Map();
  for (const [k, v] of m) out.set(v, k);
  return out;
};
const compose = (g: RoleMap, f: RoleMap): RoleMap => {
  const out: RoleMap = new Map();
  for (const [x, y] of f) if (g.has(y)) out.set(x, g.get(y) as string);
  return out;
};
const sameMap = (a: RoleMap, b: RoleMap): boolean => a.size === b.size && [...a].every(([k, v]) => b.get(k) === v);
const at = (c: number, r: string): string => `${c}|${r}`;

/** the LINES of a face: paths from every role with no predecessor, then the cycles, anchored at corner 0 (the reference's line_structure) */
export function linesOf(J: RoleMap[], corners: string[][]): { lines: DoorLine[]; place: Map<string, { line: number; idx: number }> } {
  const k = J.length;
  const Ji = J.map(inverse);
  const lines: DoorLine[] = [];
  for (let i = 0; i < k; i += 1) {
    for (const r of corners[i]) {
      if (Ji[(i - 1 + k) % k].has(r)) continue;
      const nodes: Array<[number, string]> = [[i, r]];
      let c = i;
      let x = r;
      while (J[c].has(x)) {
        x = J[c].get(x) as string;
        c = (c + 1) % k;
        nodes.push([c, x]);
      }
      lines.push({ kind: 'path', nodes, shape: `path:${i}:${nodes.length - 1}` });
    }
  }
  const covered = new Set(lines.flatMap((l) => l.nodes.map(([c, x]) => at(c, x))));
  for (const r of [...corners[0]].sort()) {
    if (covered.has(at(0, r))) continue;
    const nodes: Array<[number, string]> = [[0, r]];
    let c = 0;
    let x = r;
    for (;;) {
      const next = J[c].get(x);
      if (next === undefined) throw new Error(`doorTransportModel: a role with a predecessor and no successor — ${at(c, x)} is on no line`);
      x = next;
      c = (c + 1) % k;
      if (c === 0 && x === r) break;
      nodes.push([c, x]);
      if (nodes.length > 100_000) throw new Error('doorTransportModel: a line that never closes');
    }
    lines.push({ kind: 'cycle', nodes, shape: `cycle:${nodes.length / k}` });
    for (const [c2, x2] of nodes) covered.add(at(c2, x2));
  }
  const missing = corners.flatMap((rs, i) => rs.map((r) => at(i, r))).filter((t) => !covered.has(t));
  if (missing.length) throw new Error(`doorTransportModel: roles on no line — ${missing.slice(0, 4).join(', ')}`);
  const place = new Map<string, { line: number; idx: number }>();
  lines.forEach((l, line) => l.nodes.forEach(([c, x], idx) => place.set(at(c, x), { line, idx })));
  return { lines, place };
}

/** a side from spaces and J's already in hand (the witness's fixture door; the app reads them off the record through `sideOf`) */
export function sideFrom(corners: VertexId[], spaces: CornerSpace[], J: RoleMap[], name: string = corners.join('·')): DoorSide {
  const ids = spaces.map((s) => s.roles.map((r) => r.id));
  return { name, corners, spaces, J, ...linesOf(J, ids) };
}

/** a side read on the RECORD: each corner's space through the one resolver; each boundary edge's J by its kind (bornStepOf), in the door's direction */
export function sideOf(record: Shape, cycle: VertexId[], memo: Map<VertexId, Resolved | null> = new Map(), name?: string): DoorSideResult {
  const k = cycle.length;
  const spaces: CornerSpace[] = [];
  const missing: string[] = [];
  for (const v of cycle) {
    const r = record.vertices[v] ? spaceOf(record, v, TRANSPORT_OPTIONS, memo) : null; // B6 (D12): the door rides IS-instances only
    if (r) spaces.push(r.space);
    else missing.push(v);
  }
  if (missing.length) return { state: 'absent', missing };
  const J: RoleMap[] = [];
  for (let i = 0; i < k; i += 1) {
    const step = bornStepOf(record, cycle[i], cycle[(i + 1) % k], TRANSPORT_OPTIONS, memo);
    if (!step) return { state: 'absent', missing: [`${cycle[i]}→${cycle[(i + 1) % k]}`] };
    J.push(step.map);
  }
  return { state: 'read', side: sideFrom(cycle, spaces, J, name) };
}

export type DoorRefusal =
  | { kind: 'along'; corner: number; next: number; a: string; b: string; aRuns: boolean } // the lines part along corner→next: one continues and the other stops
  | { kind: 'into'; corner: number; prev: number; a: string; b: string; aHas: boolean } // into corner from prev: one has a predecessor and the other has none
  | { kind: 'rounds'; corner: number; a: string; b: string } // the lines close after different rounds
  | { kind: 'record'; corner: number; conflicts: Conflict[] } // at a corner, the record would say two things about one tuple
  | { kind: 'form'; corner: number; side: 'A' | 'B'; role: string; head: [string, string] }; // a role already on a line of the person's

export type DoorExtension = { taken: true; e: RoleMap[] } | { taken: false; refusal: DoorRefusal };

/** the least lawful e containing x ↦ y at corner i, or the first place the two lines part (the reference's `extend` — propagated BOTH ways, so (N) holds read from either face) */
export function extendPair(i: number, x: string, y: string, J: RoleMap[], K: RoleMap[]): DoorExtension {
  const k = J.length;
  const Ji = J.map(inverse);
  const Ki = K.map(inverse);
  const e: RoleMap[] = Array.from({ length: k }, () => new Map());
  const er: RoleMap[] = Array.from({ length: k }, () => new Map());
  const stack: Array<[number, string, string]> = [[i, x, y]];
  while (stack.length) {
    const [c, a, b] = stack.pop() as [number, string, string];
    if (e[c].has(a) || er[c].has(b)) {
      if (e[c].get(a) !== b || er[c].get(b) !== a) return { taken: false, refusal: { kind: 'rounds', corner: c, a, b } };
      continue;
    }
    e[c].set(a, b);
    er[c].set(b, a);
    const n = (c + 1) % k;
    const p = (c - 1 + k) % k;
    if (J[c].has(a) !== K[c].has(b)) return { taken: false, refusal: { kind: 'along', corner: c, next: n, a, b, aRuns: J[c].has(a) } };
    if (J[c].has(a)) stack.push([n, J[c].get(a) as string, K[c].get(b) as string]);
    if (Ji[p].has(a) !== Ki[p].has(b)) return { taken: false, refusal: { kind: 'into', corner: c, prev: p, a, b, aHas: Ji[p].has(a) } };
    if (Ji[p].has(a)) stack.push([p, Ji[p].get(a) as string, Ki[p].get(b) as string]);
  }
  return { taken: true, e };
}

/** (N) on every strip, BOTH diagonals — the door read from either face */
export function lawful(e: RoleMap[], J: RoleMap[], K: RoleMap[]): boolean {
  const k = J.length;
  for (let i = 0; i < k; i += 1) {
    const n = (i + 1) % k;
    if (!sameMap(compose(e[n], J[i]), compose(K[i], e[i]))) return false;
    if (!sameMap(compose(inverse(e[n]), K[i]), compose(J[i], inverse(e[i])))) return false;
  }
  return true;
}

/** the standing transport as maps per corner index (the record keys its entries by the corner PAIR — read back by A's corner) */
export function transportMaps(A: DoorSide, B: DoorSide, transports: DoorTransport[]): RoleMap[] {
  const e: RoleMap[] = A.corners.map(() => new Map());
  for (const t of transports) {
    const c = A.corners.findIndex((v, i) => v === t.corners[0] && B.corners[i] === t.corners[1]);
    if (c < 0) continue; // an entry of another door's corners — not this door's, never read into it
    for (const [x, y] of t.roles) if (!e[c].has(x)) e[c].set(x, y);
  }
  return e;
}

/** the record from the maps: one entry per corner pair with a non-empty map, roles in the line's own order, the word pairs kept as they stand */
export function transportsFrom(A: DoorSide, B: DoorSide, e: RoleMap[], standing: DoorTransport[] = []): DoorTransport[] {
  const out: DoorTransport[] = [];
  A.corners.forEach((a, c) => {
    if (e[c].size === 0) return;
    const prior = standing.find((t) => t.corners[0] === a && t.corners[1] === B.corners[c]);
    out.push({ corners: [a, B.corners[c]], roles: [...e[c]].map(([x, y]) => [x, y] as [string, string]), types: prior ? prior.types.map((p) => [p[0], p[1]] as [string, string]) : [] });
  });
  return out;
}

export type DoorActResult = { taken: true; e: RoleMap[]; transports: DoorTransport[] } | { taken: false; refusal: DoorRefusal };

/** THE ACT: the pointed pair x ↦ y at corner i on the standing transport — the whole line-pair taken, or the refusal named (the lines · the record · the form) */
export function actAt(A: DoorSide, B: DoorSide, standing: DoorTransport[], i: number, x: string, y: string): DoorActResult {
  const s = transportMaps(A, B, standing);
  // the FORM: a role already on a line of the person's is not pointed again — the line is withdrawn whole or stands whole
  if (s[i].has(x)) return { taken: false, refusal: { kind: 'form', corner: i, side: 'A', role: x, head: lineHead(A, B, s, i, x) } };
  const si = inverse(s[i]);
  if (si.has(y)) return { taken: false, refusal: { kind: 'form', corner: i, side: 'B', role: y, head: lineHead(A, B, s, i, si.get(y) as string) } };
  const ext = extendPair(i, x, y, A.J, B.J);
  if (!ext.taken) return ext;
  // the union with what stands (whole line-pairs on untaken lines — lawful by D1; pinned by the witness on every taken act)
  const e: RoleMap[] = s.map((m) => new Map(m));
  ext.e.forEach((m, c) => { for (const [a, b] of m) e[c].set(a, b); });
  // THE RECORD, at every corner the extension touches: the glue of the two corners' spaces under the WHOLE e there
  for (let c = 0; c < A.corners.length; c += 1) {
    if (ext.e[c].size === 0) continue;
    const conflicts = refusalOf(A.spaces[c], B.spaces[c], [...e[c]], typesAt(standing, A, B, c));
    if (conflicts.length) return { taken: false, refusal: { kind: 'record', corner: c, conflicts } };
  }
  return { taken: true, e, transports: transportsFrom(A, B, e, standing) };
}

const typesAt = (standing: DoorTransport[], A: DoorSide, B: DoorSide, c: number): Array<[string, string]> =>
  standing.find((t) => t.corners[0] === A.corners[c] && t.corners[1] === B.corners[c])?.types ?? [];

/** the head of the line-pair a standing pair (c, x) belongs to — the pair at A's line's first node */
function lineHead(A: DoorSide, B: DoorSide, s: RoleMap[], c: number, x: string): [string, string] {
  const p = A.place.get(at(c, x));
  if (!p) return [x, s[c].get(x) as string];
  const [hc, hx] = A.lines[p.line].nodes[0];
  return [hx, s[hc].get(hx) ?? (s[c].get(x) as string)];
}

/** withdraw the WHOLE line-pair holding the pair at (corner, role) on A's side — the one hand a taken line has */
export function withdrawLine(A: DoorSide, B: DoorSide, standing: DoorTransport[], corner: number, role: string): DoorTransport[] {
  const p = A.place.get(at(corner, role));
  const e = transportMaps(A, B, standing);
  if (!p) return standing;
  for (const [c, x] of A.lines[p.line].nodes) e[c].delete(x);
  return transportsFrom(A, B, e, standing);
}

// ─── THE READING ───

export interface DoorRoleView {
  id: string;
  name: string;
  partner: string | null; // the name it crosses to (A's side) or from (B's side) when on a taken line
  crosses: boolean; // its line has an equal-shape line opposite — it CAN cross this door
}

export interface DoorCornerView {
  index: number;
  a: VertexId;
  b: VertexId;
  aLabel: string;
  bLabel: string;
  aRoles: DoorRoleView[];
  bRoles: DoorRoleView[];
}

export interface DoorLineView {
  key: string; // `${corner}|${role}` — the head node on A's side (what a withdrawal names)
  kind: 'path' | 'cycle';
  along: string; // the corners the line runs through, `A→AC→AB→A`
  head: string; // `F1 ↦ F1`
  pairs: string[]; // `F1 ↦ F1 at A` …
  words: string; // `yours · a whole line along …: …`
  hand: string; // `withdraw the line F1 ↦ F1`
}

export interface DoorReading {
  corners: DoorCornerView[];
  lines: DoorLineView[];
  pairs: number; // the standing pairs, all lines
  cannotCross: string | null; // the quiet line, once per door — null when every role has a line opposite
  lawful: boolean; // the standing transport passes (N) on this record, both diagonals
}

const roleName = (S: DoorSide, c: number, r: string): string => nameIn(S.spaces[c], r);

/** the corners a line runs through, in its order — a cycle returns to its head */
export function alongWords(S: DoorSide, line: DoorLine, label: (v: VertexId) => string): string {
  const stops = line.nodes.map(([c]) => label(S.corners[c]));
  if (line.kind === 'cycle') stops.push(label(S.corners[line.nodes[0][0]]));
  return stops.join('→');
}

export function doorReadingOf(A: DoorSide, B: DoorSide, transports: DoorTransport[], label: (v: VertexId) => string): DoorReading {
  const e = transportMaps(A, B, transports);
  const er = e.map(inverse);
  const shapesA = new Set(A.lines.map((l) => l.shape));
  const shapesB = new Set(B.lines.map((l) => l.shape));
  const crossesA = (c: number, r: string): boolean => { const p = A.place.get(at(c, r)); return Boolean(p) && shapesB.has(A.lines[(p as { line: number }).line].shape); };
  const crossesB = (c: number, r: string): boolean => { const p = B.place.get(at(c, r)); return Boolean(p) && shapesA.has(B.lines[(p as { line: number }).line].shape); };
  const corners: DoorCornerView[] = A.corners.map((a, c) => ({
    index: c,
    a,
    b: B.corners[c],
    aLabel: label(a),
    bLabel: label(B.corners[c]),
    aRoles: A.spaces[c].roles.map((r) => ({ id: r.id, name: roleName(A, c, r.id), partner: e[c].has(r.id) ? roleName(B, c, e[c].get(r.id) as string) : null, crosses: crossesA(c, r.id) })),
    bRoles: B.spaces[c].roles.map((r) => ({ id: r.id, name: roleName(B, c, r.id), partner: er[c].has(r.id) ? roleName(A, c, er[c].get(r.id) as string) : null, crosses: crossesB(c, r.id) })),
  }));
  // the taken lines: the standing pairs grouped by A's line, each a whole line-pair with one hand
  const byLine = new Map<number, Array<[number, string, string]>>();
  e.forEach((m, c) => { for (const [x, y] of m) { const p = A.place.get(at(c, x)); if (!p) continue; (byLine.get(p.line) ?? byLine.set(p.line, []).get(p.line)!).push([c, x, y]); } });
  const lines: DoorLineView[] = [...byLine.keys()].sort((p, q) => p - q).map((li) => {
    const line = A.lines[li];
    const m = new Map(byLine.get(li)!.map(([c, x, y]) => [at(c, x), y] as [string, string]));
    const ordered = line.nodes.filter(([c, x]) => m.has(at(c, x))).map(([c, x]) => ({ c, x, y: m.get(at(c, x)) as string }));
    const pairs = ordered.map(({ c, x, y }) => `${roleName(A, c, x)} ↦ ${roleName(B, c, y)} at ${label(A.corners[c])}`);
    const head = ordered.length ? `${roleName(A, ordered[0].c, ordered[0].x)} ↦ ${roleName(B, ordered[0].c, ordered[0].y)}` : '';
    const along = alongWords(A, line, label);
    // C-12a item 1 — each pair on the line NAMES ITS CORNER (`at A F1 ↦ F1 · at AC F1 ↦ F1 · at AB F1 ↦ F1`): three pairs
    // spelled alike were three corners untold apart
    const words = ordered.length === 1 ? `yours · a line of one at ${label(A.corners[ordered[0].c])}: ${pairs[0].replace(/ at [^ ]+$/, '')}` : `yours · a whole line along ${along}: ${ordered.map(({ c, x, y }) => `at ${label(A.corners[c])} ${roleName(A, c, x)} ↦ ${roleName(B, c, y)}`).join(' · ')}`;
    return { key: ordered.length ? at(ordered[0].c, ordered[0].x) : at(line.nodes[0][0], line.nodes[0][1]), kind: line.kind, along, head, pairs, words, hand: `withdraw the line ${head}` };
  });
  const stuckA = A.lines.filter((l) => !shapesB.has(l.shape)).flatMap((l) => l.nodes.map(([c, x]) => `${roleName(A, c, x)} at ${label(A.corners[c])}`));
  const stuckB = B.lines.filter((l) => !shapesA.has(l.shape)).flatMap((l) => l.nodes.map(([c, x]) => `${roleName(B, c, x)} at ${label(B.corners[c])}`));
  const cannotCross = stuckA.length || stuckB.length
    ? `cannot cross this door — no line opposite: ${[stuckA.length ? `on ${A.name} ${stuckA.join(' · ')}` : null, stuckB.length ? `on ${B.name} ${stuckB.join(' · ')}` : null].filter(Boolean).join(' · ')}`
    : null;
  return { corners, lines, pairs: e.reduce((n, m) => n + m.size, 0), cannotCross, lawful: lawful(e, A.J, B.J) };
}

// ─── THE WORDS (the designer's 1500 §1, verbatim where she wrote them; the one refusal grammar of C-7h) ───

export const emptyDoorWords = (nameA: string, nameB: string): string =>
  `the door ${nameA} → ${nameB} — glued by you · carries no concept yet: a cargo crossing it arrives did not return`;

export const doorHandWords = 'here, at the door: withdraw this attempt';

/** the tuple the record would say two things about, in the corners' own names */
function tupleWords(A: DoorSide, B: DoorSide, c: number, k: Conflict): string {
  const xs = k.xTerms.map((t) => roleName(A, c, t)).join(', ');
  const ys = k.yTerms.map((t) => roleName(B, c, t)).join(', ');
  if (k.arity === 1) return `${k.type}(${xs}): ${k.xValue} here, ${k.yType === k.type ? '' : `${k.yType}: `}${k.yValue} there`;
  return `${k.type}(${xs}): ${k.xValue} here, ${k.yType}(${ys}) ${k.yValue} there`;
}

export function refusalWords(A: DoorSide, B: DoorSide, r: DoorRefusal, label: (v: VertexId) => string): string {
  const L = (c: number): string => label(A.corners[c]);
  // the two roles by name — and, when the names coincide (a hinge corner the two faces share, or two casts spelled alike),
  // each with the face it is read on, so the sentence never says `r1 has a predecessor and r1 has none` of one name
  const named = (c: number, a: string, b: string): [string, string] => {
    const na = roleName(A, c, a);
    const nb = roleName(B, c, b);
    return na === nb ? [`${na} (on ${A.name})`, `${nb} (on ${B.name})`] : [na, nb];
  };
  switch (r.kind) {
    case 'along': {
      const [na, nb] = named(r.corner, r.a, r.b);
      const [runs, stops] = r.aRuns ? [na, nb] : [nb, na];
      return `not taken — along ${L(r.corner)}→${L(r.next)}, ${runs}'s line runs on and ${stops}'s stops`;
    }
    case 'into': {
      const [na, nb] = named(r.corner, r.a, r.b);
      const [has, none] = r.aHas ? [na, nb] : [nb, na];
      return `not taken — into ${L(r.corner)} from ${L(r.prev)}, ${has} has a predecessor and ${none} has none`;
    }
    case 'rounds': {
      const [na, nb] = named(r.corner, r.a, r.b);
      return `not taken — at ${L(r.corner)}, ${na}'s line and ${nb}'s close after different rounds`;
    }
    case 'record':
      return `not taken — at ${L(r.corner)}, the record would say two things about ${tupleWords(A, B, r.corner, r.conflicts[0])}`;
    case 'form':
      return `not taken — ${r.side === 'A' ? roleName(A, r.corner, r.role) : roleName(B, r.corner, r.role)} is already on a line of yours (${roleName(A, r.corner, r.head[0])} ↦ ${roleName(B, r.corner, r.head[1])} — withdraw that line to point it again)`;
    default:
      return 'not taken';
  }
}

/** the TAKEN sentence: the pointed pair and, with it, the whole line */
export function takenWords(A: DoorSide, B: DoorSide, e: RoleMap[], i: number, x: string, y: string, label: (v: VertexId) => string): string {
  const p = A.place.get(at(i, x));
  const line = p ? A.lines[p.line] : null;
  const head = `${roleName(A, i, x)} ↦ ${roleName(B, i, y)} at ${label(A.corners[i])}`;
  if (!line || line.nodes.length === 1) return `taken — ${head}, a line of one: nothing else rides with it`;
  // C-12a item 1 — the taken sentence names each pair's corner likewise
  const pairs = line.nodes.map(([c, a]) => `at ${label(A.corners[c])} ${roleName(A, c, a)} ↦ ${roleName(B, c, e[c].get(a) as string)}`);
  return `taken — ${head}, and with it the whole line along ${alongWords(A, line, label)}: ${pairs.join(' · ')}`;
}

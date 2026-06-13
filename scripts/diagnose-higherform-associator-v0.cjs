#!/usr/bin/env node
/*
 * HIGHER-FORM GATE — the octonion ASSOCIATOR as a Z2 3-cocycle on the Ambo triads
 * ==============================================================================
 * Reads the W-1 prize where it lives: not as a loop holonomy (W-2 proved it cannot
 * be one) but as the associator of composable EDGE-carriers on the ORIENTED 3-simplices
 * of the real Ambo dissection. Computes the RELATIVE class in H3(complex, boundary; Z2)
 * — the SOLE verdict driver — with the closedness check first and the raw count demoted
 * to a diagnostic. "We found an associator" is trivially true; only a non-trivial,
 * gauge/triangulation/ordering-invariant relative class that beats a bare-geometry-AND-
 * topology control through the IDENTICAL pipeline could be a field.
 *
 * Computes-and-reports ONLY. Declares NO terminal verdict (auditor + mothership).
 * Blind by construction: the sealed prediction is OFF-REPO + gitignored; never fetched,
 * pasted, regenerated, or reconstructed.
 *
 * Repo identity: C:\Dev\202cl\PlatonicEngine202, branch team-arman. arf* = read-only.
 *
 * REQUIREMENT: docs/governance/PLATONIC_ENGINE_HIGHERFORM_BLIND_BUILD_REQUIREMENT.md
 * MODEL CARD:  docs/governance/PLATONIC_ENGINE_HIGHERFORM_MODEL_CARD_TRIAD_ASSOCIATOR.md (§1,§3,§9; S1-S7)
 *
 * BINDING DISCIPLINE (in code):
 *  - Rider A: hard-code NO expected value (no count, flux, class, verdict). All computed-and-reported.
 *  - MANIFEST: emit cell-incidence + the Z2 class ONLY; never a carrier unit/lift/root/flag/
 *    provenance token. Recursive leak scan (>=11 patterns) over every emitted string/key (O AND
 *    O_geo), zero exemptions; self-tested on a planted leak.
 *  - S1 OBJECT: O = associator of the three composable EDGE-carriers g_i = c_i^-1 c_{i+1}
 *    (edge-steps), NOT the four vertex carriers.
 *  - S2 B0 CLOSEDNESS FIRST: verify the octonion associator 3-cocycle identity (delta-alpha = 0);
 *    a non-cocycle / ill-defined O routes to S7 (HIGHER-FORM-TRIVIAL-WITH-REASON), never classified.
 *  - S3/S4 B1 RELATIVE CLASS = boundary Z2 flux = sum over oriented 3-cells of O mod 2, and whether
 *    O is a COBOUNDARY (delta of a face 2-cochain). The raw COUNT is DIAGNOSTIC ONLY.
 *  - S5 B2 GAUGE COMPLETENESS: relative class across 168 Fano frames x >=2 triangulations x ordering;
 *    dependence on ANY -> TRIVIAL.
 *  - B3 DERIVED-NOT-INSERTED: strip carriers to a Q-confined/abelian (associative) assignment ->
 *    the associator MUST vanish; survives -> VOID.
 *  - S6 B4 ADDITION-C: a bare-geometry-AND-topology control (oriented-volume sign AND adjacency/
 *    incidence parity, NO carriers) runs the IDENTICAL relative-class pipeline; only the per-cell
 *    Z2 source differs. Non-degeneracy of the control verified + split reported.
 *  - B5 BRANCH: O_branch per W-1 branch (B-walk/B-gen/B-frame) = the triple-FORMATION (per-cell
 *    ordered walk) only; the associator + pipeline are byte-identical across branches.
 *  - B6 MOCK: scramble the source-state -> the pattern must break, else VOID.
 *
 * ONE SHARED PIPELINE: relativeClassPipeline(cells, interiorFaces, perCellBit). O, O_geo (vol/topo/
 * combined), and the three O_branch ALL flow through it; the sole difference is perCellBit.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
    fileName: filename,
  }).outputText;
  module._compile(output, filename);
};

const repoRoot = path.resolve(__dirname, '..');
const { createSeedShape } = require(path.join(repoRoot, 'src/data/seeds.ts'));
const { applyAmboDissection, canApplyAmboDissection } = require(path.join(repoRoot, 'src/lib/ambo.ts'));
const { multiplyFanoUnits } = require(path.join(repoRoot, 'src/lib/fanoOctonionicCarrierTableV0.ts'));

// ===========================================================================
// 0. Octonion algebra on the repo Fano product LAW. OctValue {s:+-1, u:0..7}.
// ===========================================================================
function octMul(a, b) {
  if (a.u === 0) return { s: a.s * b.s, u: b.u };
  if (b.u === 0) return { s: a.s * b.s, u: a.u };
  if (a.u === b.u) return { s: -a.s * b.s, u: 0 };
  const p = multiplyFanoUnits('e' + a.u, 'e' + b.u);
  return { s: a.s * b.s * (p.sign === '+' ? 1 : -1), u: Number(p.productUnit.slice(1)) };
}
const octConj = (a) => (a.u === 0 ? { ...a } : { s: -a.s, u: a.u }); // inverse for unit octonions
const octEq = (a, b) => a.s === b.s && a.u === b.u;
const E = (u) => ({ s: 1, u });
const ANCHORED_PRIMAL = { A: 1, B: 2, C: 4, D: 7 };
const PRIMAL4 = ['A', 'B', 'C', 'D'];
const Q_UNITS = [3, 5, 6];

// associator Z2 bit of three composable unit octonions: 0 if (g1 g2) g3 == g1 (g2 g3), else 1.
function associatorBit(g1, g2, g3) {
  const L = octMul(octMul(g1, g2), g3);
  const R = octMul(g1, octMul(g2, g3));
  if (L.u !== R.u) return { bit: 1, illDefined: true }; // units: should never differ in unit
  return { bit: L.s === R.s ? 0 : 1, illDefined: false };
}

// ===========================================================================
// 1. Deterministic seeded stream.
// ===========================================================================
function mulberry32(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const SEED = 20260614;

// ===========================================================================
// 2. The real Ambo 3-cell complex: 4 residue tetrahedra + octahedral core.
// ===========================================================================
function buildAmbo() {
  const tetra = createSeedShape('tetrahedron');
  if (!canApplyAmboDissection(tetra)) throw new Error('Ambo not applicable to tetra seed.');
  const g1 = applyAmboDissection(tetra);
  const labelById = {};
  const parentageById = {};
  const posById = {};
  for (const id of Object.keys(g1.vertices)) {
    const v = g1.vertices[id];
    posById[id] = v.position;
    if (v.createdBy.operation === 'seed') labelById[id] = v.data.label;
    else {
      const par = v.createdBy.sourceVertexIds.map((p) => g1.vertices[p].data.label);
      labelById[id] = [...par].sort().join('');
      parentageById[id] = [...par].sort();
    }
  }
  const residues = g1.cells.filter((c) => c.kind === 'residue').map((c) => c.vertexIds.slice());
  const core = g1.cells.find((c) => c.kind === 'core').vertexIds.slice();
  return { g1, labelById, parentageById, posById, residues, core };
}

// triangulate the octahedral core by an antipodal axis -> 4 tets (apex pair + equatorial edges).
function triangulateCore(core, posById, axisIndex) {
  const approx = (a, b) => Math.abs(a - b) < 1e-9;
  const isAxis = (p) => approx(Math.abs(p[axisIndex]), 1) && p.every((x, k) => k === axisIndex || approx(x, 0));
  const apexes = core.filter((id) => isAxis(posById[id]));
  const equ = core.filter((id) => !apexes.includes(id));
  // cyclic order of the 4 equatorial vertices by angle in the plane orthogonal to the axis
  const ax = [(axisIndex + 1) % 3, (axisIndex + 2) % 3];
  const ang = (id) => Math.atan2(posById[id][ax[1]], posById[id][ax[0]]);
  equ.sort((p, q) => ang(p) - ang(q));
  const tets = [];
  for (let i = 0; i < 4; i += 1) tets.push([apexes[0], apexes[1], equ[i], equ[(i + 1) % 4]]);
  return tets;
}

// assemble the complex for a given core-triangulation axis: 8 oriented 3-cells +
// face structure (interior faces shared by 2 cells; boundary faces on 1).
function buildComplex(ambo, axisIndex) {
  const cells = [...ambo.residues.map((v) => v.slice()), ...triangulateCore(ambo.core, ambo.posById, axisIndex)];
  const faceKey = (ids) => [...ids].sort().join('|');
  const faceCells = new Map(); // faceKey -> [cellIndex...]
  const cellFaces = cells.map(() => []);
  cells.forEach((c, ci) => {
    for (let a = 0; a < 4; a += 1) {
      const face = c.filter((_v, k) => k !== a); // 3 of the 4 vertices
      const fk = faceKey(face);
      if (!faceCells.has(fk)) faceCells.set(fk, []);
      faceCells.get(fk).push(ci);
      cellFaces[ci].push(fk);
    }
  });
  const interiorFaces = [...faceCells.keys()].filter((fk) => faceCells.get(fk).length === 2);
  const boundaryFaces = [...faceCells.keys()].filter((fk) => faceCells.get(fk).length === 1);
  const interiorIndex = Object.fromEntries(interiorFaces.map((fk, i) => [fk, i]));
  // cell adjacency: cells sharing an interior face
  const adjacency = cells.map(() => new Set());
  for (const fk of interiorFaces) {
    const [a, b] = faceCells.get(fk);
    adjacency[a].add(b);
    adjacency[b].add(a);
  }
  return { cells, faceCells, cellFaces, interiorFaces, boundaryFaces, interiorIndex, adjacency, axisIndex };
}

// ===========================================================================
// 3. Carriers + Hole #1-free vertex carrier map (W-1 carriers).
// ===========================================================================
function vertexCarriers(ambo, primalUnits) {
  const carrier = {};
  for (const id of Object.keys(ambo.labelById)) {
    const lbl = ambo.labelById[id];
    if (PRIMAL4.includes(lbl)) carrier[id] = E(primalUnits[lbl]);
  }
  for (const id of Object.keys(ambo.parentageById)) {
    const [p0, p1] = ambo.parentageById[id];
    const pid0 = Object.keys(ambo.labelById).find((k) => ambo.labelById[k] === p0 && PRIMAL4.includes(p0));
    const pid1 = Object.keys(ambo.labelById).find((k) => ambo.labelById[k] === p1 && PRIMAL4.includes(p1));
    carrier[id] = octMul(carrier[pid0], carrier[pid1]);
  }
  return carrier;
}

// ===========================================================================
// 4. ORDERED WALK per (orientation convention) x (branch triple-formation).
//    Orthogonal axes: baseConvention sets the reference vertex order; the branch
//    walk-rule reorders into the directed walk that forms the edge-step triple.
// ===========================================================================
function baseOrder(cell, ambo, convention) {
  const byKey = [...cell].sort((a, b) => (ambo.labelById[a] < ambo.labelById[b] ? -1 : 1));
  if (convention === 'key-asc') return byKey;
  if (convention === 'key-desc') return byKey.slice().reverse();
  // 'pos': order by position lexicographically (a distinct geometric convention)
  return [...cell].sort((a, b) => {
    const pa = ambo.posById[a], pb = ambo.posById[b];
    return pa[0] - pb[0] || pa[1] - pb[1] || pa[2] - pb[2];
  });
}
function branchWalk(base, ambo, branch) {
  if (branch === 'B-walk') return base; // walk-continuation: the base directed order
  if (branch === 'B-gen') {
    // birth-genealogy: primal (seed, oldest) first, then midpoints by sorted parent labels
    return [...base].sort((a, b) => {
      const am = ambo.parentageById[a] ? 1 : 0, bm = ambo.parentageById[b] ? 1 : 0;
      if (am !== bm) return am - bm; // primals (0) before mids (1)
      const ka = ambo.labelById[a], kb = ambo.labelById[b];
      return ka < kb ? -1 : ka > kb ? 1 : 0;
    });
  }
  // B-frame: angular bearing of the vertex position in a fixed plane (x-y), tie-break by key
  return [...base].sort((a, b) => {
    const aa = Math.atan2(ambo.posById[a][1], ambo.posById[a][0]);
    const bb = Math.atan2(ambo.posById[b][1], ambo.posById[b][0]);
    if (Math.abs(aa - bb) > 1e-9) return aa - bb;
    return ambo.labelById[a] < ambo.labelById[b] ? -1 : 1;
  });
}
// edge-step triple from an ordered 4-vertex walk + carriers
function edgeStepTriple(walk, carrier) {
  const c = walk.map((id) => carrier[id]);
  return [octMul(octConj(c[0]), c[1]), octMul(octConj(c[1]), c[2]), octMul(octConj(c[2]), c[3])];
}

// ===========================================================================
// 5. THE SHARED RELATIVE-CLASS PIPELINE. perCellBit: (cellIndex) -> 0|1.
//    relative class = boundary Z2 flux = sum_cells bit mod 2; coboundary via GF(2)
//    delta beta = O on interior faces; count = sum bit (DIAGNOSTIC ONLY).
// ===========================================================================
function relativeClassPipeline(complex, perCellBit) {
  const bits = complex.cells.map((_c, ci) => perCellBit(ci));
  const count = bits.reduce((a, b) => a + b, 0);
  const flux = bits.reduce((a, b) => a ^ b, 0); // sum mod 2 = relative class
  // coboundary: solve delta beta = bits, beta on interior faces. delta beta(cell) =
  // XOR over the cell's interior faces of beta(face). Solvable over GF(2) iff O is a
  // relative coboundary iff flux == 0.
  const M = complex.cells.map((_c, ci) =>
    complex.interiorFaces.map((fk) => (complex.cellFaces[ci].includes(fk) ? 1 : 0)),
  );
  const solvable = gf2Solvable(M, bits);
  return { count, flux, isCoboundary: solvable, classNonTrivial: flux === 1, cellBits: bits };
}
// GF(2): is M x = b solvable? rank(M) == rank([M|b]).
function gf2Rank(rowsIn) {
  const rows = rowsIn.map((r) => r.slice());
  const m = rows.length, n = rows[0] ? rows[0].length : 0;
  let rank = 0;
  for (let col = 0; col < n && rank < m; col += 1) {
    let piv = -1;
    for (let i = rank; i < m; i += 1) if (rows[i][col]) { piv = i; break; }
    if (piv === -1) continue;
    [rows[rank], rows[piv]] = [rows[piv], rows[rank]];
    for (let i = 0; i < m; i += 1) if (i !== rank && rows[i][col]) for (let cc = col; cc < n; cc += 1) rows[i][cc] ^= rows[rank][cc];
    rank += 1;
  }
  return rank;
}
function gf2Solvable(M, b) {
  if (M.length === 0 || M[0].length === 0) return b.every((x) => x === 0);
  const rank = gf2Rank(M);
  const aug = M.map((row, i) => row.concat([b[i]]));
  return gf2Rank(aug) === rank;
}

// ===========================================================================
// 6. PER-CELL Z2 SOURCES (the SOLE thing that differs between O / O_geo / branches).
// ===========================================================================
// (a) O: the edge-carrier associator, with a fixed branch (B-walk) for B0/B1/B2.
function makeAssocBit(complex, ambo, carrier, convention, branch) {
  let illDefinedCount = 0;
  const fn = (ci) => {
    const walk = branchWalk(baseOrder(complex.cells[ci], ambo, convention), ambo, branch);
    const [g1, g2, g3] = edgeStepTriple(walk, carrier);
    const r = associatorBit(g1, g2, g3);
    if (r.illDefined) illDefinedCount += 1;
    return r.bit;
  };
  fn.illDefined = () => illDefinedCount;
  return fn;
}
// (b) O_geo geometric: sign of the signed volume det[v1-v0,v2-v0,v3-v0] under the SAME
//     base ordering (label-free; carriers stripped -> unchanged).
function makeGeomVolBit(complex, ambo, convention) {
  return (ci) => {
    const ord = baseOrder(complex.cells[ci], ambo, convention);
    const p = ord.map((id) => ambo.posById[id]);
    const v1 = sub(p[1], p[0]), v2 = sub(p[2], p[0]), v3 = sub(p[3], p[0]);
    const det = dot(v1, cross(v2, v3));
    return det < 0 ? 1 : 0; // Z2: negatively oriented cell
  };
}
// (c) O_geo topological: parity of the cell's interior-face count (adjacency/incidence).
function makeTopoBit(complex) {
  return (ci) => {
    const interior = complex.cellFaces[ci].filter((fk) => complex.interiorFaces.includes(fk)).length;
    return interior % 2;
  };
}
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// ===========================================================================
// 7. Fano gauge orbit (168 = 7 quadrangles x 24 orderings), derived from the law.
// ===========================================================================
function fanoLines() {
  const lines = [], seen = new Set();
  for (let i = 1; i <= 7; i += 1) for (let j = i + 1; j <= 7; j += 1) {
    const u = octMul(E(i), E(j)).u;
    const key = [i, j, u].sort((a, b) => a - b).join(',');
    if (!seen.has(key)) { seen.add(key); lines.push([i, j, u].sort((a, b) => a - b)); }
  }
  return lines;
}
function quadrangles() {
  const lk = new Set(fanoLines().map((l) => l.join(',')));
  const q = [];
  for (let a = 1; a <= 7; a += 1) for (let b = a + 1; b <= 7; b += 1) for (let c = b + 1; c <= 7; c += 1) for (let d = c + 1; d <= 7; d += 1) {
    if (![[a, b, c], [a, b, d], [a, c, d], [b, c, d]].some((t) => lk.has(t.join(',')))) q.push([a, b, c, d]);
  }
  return q;
}
function permutations4() {
  return (function perm(xs) { return xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perm(xs.filter((_v, k) => k !== i)).map((t) => [x, ...t])); })([0, 1, 2, 3]);
}
function fanoFrames() {
  const out = [];
  for (const q of quadrangles()) for (const ord of permutations4()) {
    const a = {}; PRIMAL4.forEach((p, k) => { a[p] = q[ord[k]]; }); out.push(a);
  }
  return out;
}

// ===========================================================================
// 8. Manifest leak scan (>=11 patterns; covers O AND O_geo emitted objects).
// ===========================================================================
const LEAK_PATTERNS = [
  /e[1-7]\b/i, /carrier/i, /signed.?lift|(^|[^a-z])lift/i, /\broot\b|epsilon|eps_/i,
  /\bflag\b/i, /provenance/i, /sourcevertex|createdby/i, /[+-]e[0-7]/i,
  /quadrangle/i, /octonion|moufang|associator/i, /\bvertex:/i, /fano/i, /\b[ABCD]\b(?![-)\w])/,
];
function leakScan(obj) {
  const hits = [];
  const visit = (value, keyPath) => {
    if (value === null || value === undefined) return;
    if (typeof value === 'string') { for (const p of LEAK_PATTERNS) if (p.test(value)) hits.push(`${keyPath}="${value}"`); return; }
    if (typeof value === 'number' || typeof value === 'boolean') return;
    if (Array.isArray(value)) { value.forEach((v, i) => visit(v, `${keyPath}[${i}]`)); return; }
    for (const k of Object.keys(value)) { for (const p of LEAK_PATTERNS) if (p.test(k)) hits.push(`key ${keyPath}.${k}`); visit(value[k], `${keyPath}.${k}`); }
  };
  visit(obj, '$');
  return hits;
}

// ===========================================================================
// MAIN
// ===========================================================================
const out = [];
const P = (s) => out.push(s);
const TRI_AXES = [2, 1, 0]; // z, y, x (>=2 triangulations)
const AXIS_NAME = { 2: 'z', 1: 'y', 0: 'x' };
const CONVENTIONS = ['key-asc', 'key-desc', 'pos'];
const BRANCHES = ['B-walk', 'B-gen', 'B-frame'];

function main() {
  // ---- gate echo + in-code BLINDING SELF-CHECK ----
  const sealedTracked = cp.execSync('git ls-files "*SEALED_PREDICTIONS*"', { cwd: repoRoot }).toString().trim();
  const branch = cp.execSync('git branch --show-current', { cwd: repoRoot }).toString().trim();
  const head = cp.execSync('git rev-parse --short HEAD', { cwd: repoRoot }).toString().trim();
  const sealPlaintextPresent = sealedTracked.length > 0;

  P('================================================================================');
  P('  HIGHER-FORM GATE — octonion associator Z2 3-cocycle on the Ambo triads');
  P('  Computes-and-reports ONLY. NO terminal verdict (auditor + mothership).');
  P('================================================================================');
  P('');
  P(`GATE: path=C:\\Dev\\202cl\\PlatonicEngine202  branch=${branch}  HEAD=${head}  (arf*=read-only)`);
  P('BLINDING SELF-CHECK (verified in code):');
  P(`  git ls-files "*SEALED_PREDICTIONS*" -> ${sealPlaintextPresent ? 'NON-EMPTY (seal plaintext present!)' : 'EMPTY (no seal plaintext tracked)'}`);
  P(`  seal plaintext in tree: ${sealPlaintextPresent} (only the HIGHERFORM hash may exist; never opened/inverted)`);
  P('CONSUMED (recompute-not-echo): REAL Ambo (createSeedShape+applyAmboDissection); Fano product law.');
  P('OBJECT O (S1): associator of edge-carrier steps g_i=c_i^-1 c_{i+1} on oriented 3-simplices.');
  P('ONE SHARED relative-class pipeline; O / O_geo / O_branch differ ONLY in the per-cell Z2 source.');
  P('');

  const ambo = buildAmbo();
  const carrierTrue = vertexCarriers(ambo, ANCHORED_PRIMAL);
  const complexZ = buildComplex(ambo, 2);

  P('--------------------------------------------------------------------------------');
  P('[COMPLEX] real Ambo dissection (a 3-ball)');
  P('--------------------------------------------------------------------------------');
  P(`3-cells: ${complexZ.cells.length} (4 residue tetrahedra + 4 core tets per triangulation)`);
  P(`interior faces: ${complexZ.interiorFaces.length}; boundary faces: ${complexZ.boundaryFaces.length}`);
  P('');

  // ---- B0 CLOSEDNESS (S2): octonion associator 3-cocycle identity delta-alpha = 0 ----
  // alpha(a,b,c) = associatorBit; delta-alpha(a,b,c,d) = a(b,c,d)+a(ab,c,d)+a(a,bc,d)+a(a,b,cd)+a(a,b,c) mod 2.
  const units = [];
  for (let s of [1, -1]) for (let u = 0; u <= 7; u += 1) units.push({ s, u });
  let cocycleViolations = 0, cocycleChecked = 0;
  for (const a of units) for (const b of units) for (const c of units) for (const d of units) {
    if (a.u === 0 || b.u === 0 || c.u === 0 || d.u === 0) continue; // imaginary units (the carrier alphabet)
    cocycleChecked += 1;
    const ab = octMul(a, b), bc = octMul(b, c), cd = octMul(c, d);
    const da =
      associatorBit(b, c, d).bit ^ associatorBit(ab, c, d).bit ^ associatorBit(a, bc, d).bit ^
      associatorBit(a, b, cd).bit ^ associatorBit(a, b, c).bit;
    if (da !== 0) cocycleViolations += 1;
  }
  const isCocycle = cocycleViolations === 0;
  const assocBitTrue = makeAssocBit(complexZ, ambo, carrierTrue, 'key-asc', 'B-walk');
  // evaluate to populate ill-defined counter
  complexZ.cells.forEach((_c, ci) => assocBitTrue(ci));
  const illDefined = assocBitTrue.illDefined();
  P('--------------------------------------------------------------------------------');
  P('[B0 CLOSEDNESS (S2)] verify O is a cocycle BEFORE classifying');
  P('--------------------------------------------------------------------------------');
  P(`octonion associator 3-cocycle identity delta-alpha=0: checked ${cocycleChecked} imaginary-unit tuples, violations ${cocycleViolations} -> cocycle=${isCocycle}`);
  P(`per-cell associator ill-defined (unit mismatch) count: ${illDefined}`);
  const routeS7 = !isCocycle || illDefined > 0;
  P(`closedness disposition: ${routeS7 ? 'NON-COCYCLE / ILL-DEFINED -> routes to S7 (HIGHER-FORM-TRIVIAL-WITH-REASON); class NOT asserted' : 'genuine cocycle -> proceed to relative class'}`);
  P('');

  // ---- B1 RELATIVE CLASS (S3/S4): the SOLE verdict driver ----
  const base = relativeClassPipeline(complexZ, assocBitTrue);
  P('--------------------------------------------------------------------------------');
  P('[B1 RELATIVE CLASS (S3/S4)] boundary Z2 flux + coboundary  (SOLE verdict driver)');
  P('--------------------------------------------------------------------------------');
  P(`relative class (boundary Z2 flux, sum over cells mod 2): ${base.flux}  -> ${base.classNonTrivial ? 'NON-TRIVIAL (not a coboundary)' : 'TRIVIAL (coboundary / even flux)'}`);
  P(`O is a coboundary (delta of a face 2-cochain, GF(2) solvable on interior faces): ${base.isCoboundary}`);
  P(`[DIAGNOSTIC ONLY -- may NOT by itself support a field] non-associating cell COUNT: ${base.count} / ${complexZ.cells.length}`);
  P('');

  // ---- B2 GAUGE COMPLETENESS (S5): 168 frames x >=2 triangulations x ordering ----
  const frames = fanoFrames();
  const sweep = { byFrame: new Set(), byTri: {}, byOrdering: {} };
  // frames (fix tri=z, ordering=key-asc, branch=B-walk)
  for (const fr of frames) {
    const carrier = vertexCarriers(ambo, fr);
    const bit = makeAssocBit(complexZ, ambo, carrier, 'key-asc', 'B-walk');
    sweep.byFrame.add(relativeClassPipeline(complexZ, bit).flux);
  }
  // triangulations (true carriers, ordering key-asc)
  for (const axis of TRI_AXES) {
    const cx = buildComplex(ambo, axis);
    const bit = makeAssocBit(cx, ambo, carrierTrue, 'key-asc', 'B-walk');
    sweep.byTri[AXIS_NAME[axis]] = relativeClassPipeline(cx, bit).flux;
  }
  // ordering conventions (true carriers, tri=z)
  for (const conv of CONVENTIONS) {
    const bit = makeAssocBit(complexZ, ambo, carrierTrue, conv, 'B-walk');
    sweep.byOrdering[conv] = relativeClassPipeline(complexZ, bit).flux;
  }
  const frameInvariant = sweep.byFrame.size === 1;
  const triInvariant = new Set(Object.values(sweep.byTri)).size === 1;
  const orderInvariant = new Set(Object.values(sweep.byOrdering)).size === 1;
  const gaugeComplete = frameInvariant && triInvariant && orderInvariant;
  P('--------------------------------------------------------------------------------');
  P('[B2 GAUGE COMPLETENESS (S5)] dependence on ANY axis -> TRIVIAL');
  P('--------------------------------------------------------------------------------');
  P(`168 Fano frames: distinct relative classes = {${[...sweep.byFrame].join(',')}} -> invariant=${frameInvariant}`);
  P(`>=2 triangulations: ${Object.entries(sweep.byTri).map(([k, v]) => `${k}=${v}`).join(' ')} -> invariant=${triInvariant}`);
  P(`vertex-ordering conventions: ${Object.entries(sweep.byOrdering).map(([k, v]) => `${k}=${v}`).join(' ')} -> invariant=${orderInvariant}`);
  P(`gauge-complete (class invariant under ALL axes): ${gaugeComplete}${gaugeComplete ? '' : ' -> TRIVIAL (convention-dependent)'}`);
  P('');

  // ---- B3 DERIVED-NOT-INSERTED: Q-confined (associative) carriers -> associator vanishes ----
  const qUnits = { A: 3, B: 5, C: 6, D: 3 }; // Q-confined assignment (quaternion subalgebra, associative)
  const carrierQ = vertexCarriers(ambo, qUnits);
  const bitQ = makeAssocBit(complexZ, ambo, carrierQ, 'key-asc', 'B-walk');
  const qResult = relativeClassPipeline(complexZ, bitQ);
  const qVanishes = qResult.count === 0;
  // also an abelian assignment (all same unit) as a second strip
  const carrierAbelian = vertexCarriers(ambo, { A: 3, B: 3, C: 3, D: 3 });
  const bitAb = makeAssocBit(complexZ, ambo, carrierAbelian, 'key-asc', 'B-walk');
  const abVanishes = relativeClassPipeline(complexZ, bitAb).count === 0;
  P('--------------------------------------------------------------------------------');
  P('[B3 DERIVED-NOT-INSERTED] strip carriers to associative -> associator MUST vanish');
  P('--------------------------------------------------------------------------------');
  P(`Q-confined carriers (quaternion subalgebra {e3,e5,e6}): non-associating count ${qResult.count} -> vanishes=${qVanishes}`);
  P(`abelian carriers (single unit): vanishes=${abVanishes}`);
  P(`derived-not-inserted: ${qVanishes && abVanishes ? 'OK (associator vanishes under carrier strip)' : 'VOID (associator survived a carrier strip -> inserted)'}`);
  P('');

  // ---- B4 ADDITION-C: bare-geometry-AND-topology control through the IDENTICAL pipeline ----
  const geomVol = makeGeomVolBit(complexZ, ambo, 'key-asc');
  const topo = makeTopoBit(complexZ);
  const combined = (ci) => geomVol(ci) ^ topo(ci);
  const ctlVol = relativeClassPipeline(complexZ, geomVol);
  const ctlTopo = relativeClassPipeline(complexZ, topo);
  const ctlComb = relativeClassPipeline(complexZ, combined);
  const splitOf = (r) => `${r.count}+/${complexZ.cells.length - r.count}-`; // non-degeneracy split
  const volNonDegenerate = ctlVol.count > 0 && ctlVol.count < complexZ.cells.length;
  const topoNonDegenerate = ctlTopo.count > 0 && ctlTopo.count < complexZ.cells.length;
  P('--------------------------------------------------------------------------------');
  P('[B4 ADDITION-C (S6)] bare-geometry-AND-topology control, IDENTICAL pipeline, input-only diff');
  P('--------------------------------------------------------------------------------');
  P(`control bit = geometry (signed-volume sign) AND topology (interior-face parity); NO carriers.`);
  P(`  geom-vol  : relative class ${ctlVol.flux} coboundary=${ctlVol.isCoboundary}  split(set/unset)=${splitOf(ctlVol)} non-degenerate=${volNonDegenerate}`);
  P(`  topo-parity: relative class ${ctlTopo.flux} coboundary=${ctlTopo.isCoboundary}  split=${splitOf(ctlTopo)} non-degenerate=${topoNonDegenerate}`);
  P(`  combined   : relative class ${ctlComb.flux} coboundary=${ctlComb.isCoboundary}  split=${splitOf(ctlComb)}`);
  P(`field O relative class ${base.flux} vs control classes {vol ${ctlVol.flux}, topo ${ctlTopo.flux}, combined ${ctlComb.flux}}`);
  P(`control reproduces field class? vol=${ctlVol.flux === base.flux} topo=${ctlTopo.flux === base.flux} combined=${ctlComb.flux === base.flux}  (a class the control also produces = exposed combinatorics)`);
  P('');

  // ---- B5 BRANCH-SELECTION: triple-formation per branch, identical pipeline ----
  P('--------------------------------------------------------------------------------');
  P('[B5 BRANCH-SELECTION] relative class per W-1 branch (triple-formation only)');
  P('--------------------------------------------------------------------------------');
  const branchClass = {};
  for (const br of BRANCHES) {
    const bit = makeAssocBit(complexZ, ambo, carrierTrue, 'key-asc', br);
    const r = relativeClassPipeline(complexZ, bit);
    branchClass[br] = r;
    P(`  ${br.padEnd(8)}: relative class ${r.flux} coboundary=${r.isCoboundary} non-trivial=${r.classNonTrivial} [diag count ${r.count}]`);
  }
  const branchClasses = new Set(BRANCHES.map((br) => branchClass[br].flux));
  const nonTrivialBranches = BRANCHES.filter((br) => branchClass[br].classNonTrivial);
  P(`branch classes distinct: ${branchClasses.size > 1}; non-trivial branches: ${nonTrivialBranches.length ? nonTrivialBranches.join(',') : 'none'}`);
  P(`uniquely-selecting branch (exactly one non-trivial, others degenerate): ${nonTrivialBranches.length === 1}`);
  P('');

  // ---- B6 MOCK + INTEGRITY ----
  const mockRng = mulberry32(SEED ^ 0x5bd1e995);
  const mockUnits = {}; for (const lbl of PRIMAL4) mockUnits[lbl] = 1 + Math.floor(mockRng() * 7);
  const carrierMock = vertexCarriers(ambo, mockUnits);
  const bitMock = makeAssocBit(complexZ, ambo, carrierMock, 'key-asc', 'B-walk');
  const mockResult = relativeClassPipeline(complexZ, bitMock);
  const truePattern = base.cellBits.join('');
  const mockPattern = mockResult.cellBits.join('');
  const mockBroke = truePattern !== mockPattern;
  P('--------------------------------------------------------------------------------');
  P('[B6 MOCK-SOLUTION] scramble source-state -> per-cell pattern must break');
  P('--------------------------------------------------------------------------------');
  P(`true pattern vs scrambled-carrier pattern differ: ${mockBroke}  -> ${mockBroke ? 'OK (pattern broke)' : 'VOID (pattern survived scramble)'}`);
  P('');

  // ---- MANIFEST + LEAK SCAN (covers O AND O_geo emitted objects) ----
  const emittedField = { cellIncidence: complexZ.cells.map((_c, ci) => complexZ.cellFaces[ci].map((fk) => complexZ.interiorIndex[fk] ?? -1)), classBits: base.cellBits.slice(), relativeClass: base.flux };
  const emittedControl = { cellIncidence: complexZ.cells.map((_c, ci) => complexZ.cellFaces[ci].map((fk) => complexZ.interiorIndex[fk] ?? -1)), classBits: ctlVol.cellBits.slice(), relativeClass: ctlVol.flux };
  const fieldLeaks = leakScan(emittedField);
  const controlLeaks = leakScan(emittedControl);
  const scannerFires = leakScan({ carrierUnit: 'e3', flagId: 'A->B', signedLift: '+e5' }).length > 0;
  P('--------------------------------------------------------------------------------');
  P('[MANIFEST + LEAK SCAN] emit cell-incidence + Z2 class ONLY (O and O_geo)');
  P('--------------------------------------------------------------------------------');
  P(`leak-scan patterns: ${LEAK_PATTERNS.length} (>=11); scanner self-test fires: ${scannerFires}`);
  P(`emitted FIELD object leak hits: ${fieldLeaks.length}${fieldLeaks.length ? ' -> ' + fieldLeaks.join('; ') : ' (clean)'}`);
  P(`emitted CONTROL object leak hits: ${controlLeaks.length}${controlLeaks.length ? ' -> ' + controlLeaks.join('; ') : ' (clean)'}`);
  P('');

  // ---- INTEGRITY ----
  P('--------------------------------------------------------------------------------');
  P('[INTEGRITY] structural self-checks (no target-matching path)');
  P('--------------------------------------------------------------------------------');
  const integrity = [];
  const expect = (cond, msg) => { if (!cond) integrity.push(msg); };
  expect(branch === 'team-arman', 'branch must be team-arman');
  expect(!sealPlaintextPresent, 'no seal plaintext may be tracked (blinding self-check)');
  expect(complexZ.cells.length === 8, 'complex must have 8 three-cells (4 residue + 4 core)');
  expect(frames.length === 168, '168 Fano frames (7 quadrangles x 24)');
  expect(scannerFires, 'leak scanner must fire on a planted leak');
  expect(fieldLeaks.length === 0 && controlLeaks.length === 0, 'emitted objects must be leak-free');
  expect(qVanishes && abVanishes, 'B3: associator must vanish under carrier strip');
  expect(mockBroke, 'B6: mock pattern must break under source-state scramble');
  expect(volNonDegenerate || topoNonDegenerate, 'B4 control must be non-degenerate (geom or topo)');
  // re-run determinism
  const rerun = (() => {
    const a2 = buildAmbo();
    const cx2 = buildComplex(a2, 2);
    const c2 = vertexCarriers(a2, ANCHORED_PRIMAL);
    const b2 = makeAssocBit(cx2, a2, c2, 'key-asc', 'B-walk');
    const r2 = relativeClassPipeline(cx2, b2);
    return JSON.stringify({ flux: r2.flux, count: r2.count, cocycle: isCocycle });
  })();
  const firstSig = JSON.stringify({ flux: base.flux, count: base.count, cocycle: isCocycle });
  const deterministic = rerun === firstSig;
  expect(deterministic, 're-run must be deterministic');

  P(`integrity issues: ${integrity.length}`);
  for (const m of integrity) P('  - ' + m);
  const ok = integrity.length === 0;
  P('');
  P(`re-run deterministic: ${deterministic}`);
  P(`exit status: ${ok ? 0 : 1}`);
  P(ok ? 'Diagnostic assertions passed.' : 'Diagnostic assertions FAILED.');
  P('');
  P('NO TERMINAL VERDICT. The Higher-Form construction computes-and-reports; the auditor derives');
  P('status (HIGHER-FORM-OBSERVABLE / -TRIVIAL / -TRIVIAL-WITH-REASON / VOID) against the THEN-');
  P('REVEALED seal at close, and mothership disposes the terminal verdict. The relative class is');
  P('the SOLE driver; the count is diagnostic-only; a class the bare-geometry+topology control also');
  P('produces is exposed combinatorics, not a field.');

  process.stdout.write(out.join('\n') + '\n');
  process.exit(ok ? 0 : 1);
}

main();

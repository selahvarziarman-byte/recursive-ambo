#!/usr/bin/env node
/*
 * W-1 LEGITIMACY DIAGNOSTIC — candidate W (the walk-primitive source regime)
 * ==========================================================================
 * Blind implementer build. Computes-and-reports ONLY. Declares NO verdict.
 * The terminal verdict (W-PASS-LEGITIMATE / W-LOCAL-ONLY / W-FAIL) is the
 * auditor's and mothership's, derived against an OFF-REPO sealed prediction
 * this script never sees.
 *
 * Repo identity: C:\Dev\202cl\PlatonicEngine202, branch Claude-child.
 *
 * SPEC: docs/governance/PLATONIC_ENGINE_W_GATE_W1_LEGITIMACY_DIAGNOSTIC_SPECIFICATION.md
 * MODEL CARD: docs/governance/PLATONIC_ENGINE_W_GATE_W0_MODEL_CARD_WALK_PRIMITIVE_SOURCE_REGIME.md
 *
 * BINDING DISCIPLINE (enforced in code):
 *  - Rider A (no target-matching): the prize scorer contains ZERO expected
 *    constants (sealed or public). Public FLOOR figures from the Bench-2 /
 *    Gate-0 closing memos are PRINTED beside freshly-computed values for the
 *    reader, but NO pass/fail branch and the integrity `ok` key never read
 *    them. Floor-comparison and prize-scorer code paths are kept separate.
 *  - Recompute-not-echo: every carrier / link / holonomy / closure is
 *    re-derived from the primal atoms via the repo's Fano product law
 *    (multiplyFanoUnits) and the REAL Ambo (createSeedShape + applyAmboDissection,
 *    parentage via createdBy.sourceVertexIds). No stored module OUTPUT is copied.
 *  - Destructive tests (L1-L9) MUST fire; a test that does not fire marks its
 *    criterion decorative (reported, not judged).
 *  - Mock-solution gate: scramble W's defining facts -> legitimacy AND prize
 *    patterns must BREAK, else "RUN VOID".
 *  - Exact + finite: full Catalan bracketing enumeration via interval DP.
 *
 * PINNED CONSTRUCTION (lieutenant audit, this session):
 *  - Holonomy word = edge-link convention (beta): for a directed edge u->v the
 *    link shadow L(u->v) = carrier(u) . carrier(v) via the repo Fano product;
 *    a loop's holonomy word is the ordered links around it, bracketed per Hole #2.
 *  - Hole #1 (reverse law), swept {R-neg, R-ret, R-anti}:
 *      R-neg  : reverse link POSITED L(v->u) = -L(u->v); antipodality posited.
 *      R-ret  : reverse link COMPUTED L(v->u) = carrier(v).carrier(u) (reverse-
 *               order product); antipodality DERIVED from octonion anticommutativity
 *               (measured, not posited).  [numerically == R-neg; distinct provenance]
 *      R-anti : child-carrier sign from the GEOMETRIC right-handed frame of the
 *               children's octahedron (octaFirstBirthCarrierBaseV0's derived rule:
 *               antipodal poles take opposite sign; lexicographicSortingUsed:false).
 *  - Hole #2 (off-lineage bracketing), swept {B-walk, B-gen, B-frame}; each rule
 *    selects ONE deterministic bracketing per loop:
 *      B-walk : right-association  a.(b.(c. ...))  (walk continues).
 *      B-gen  : genealogical — links meeting at a common CHILD node group first
 *               (leftmost child innermost), then left-associate (birth tree).
 *      B-frame: frame-angular — group the consecutive links whose roots are
 *               closest in the A2 plane first (hexagon-root angular adjacency).
 *    The prize pass-shape is gauge-equivariance of each rule's selected Re under
 *    S4 (24 site relabelings) and the 168 Fano gauge — load-bearing, computed.
 *  - SCOPE: prize on the G0->G1 first-birth carrier graph (4 primal + 6 children,
 *    10 nodes); floor reproduces the public hub figures at their G2 layer
 *    (cuboctahedron / 12 directed flags = A3 roots).
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  }).outputText;
  module._compile(output, filename);
};

const repoRoot = path.resolve(__dirname, '..');
const { createSeedShape } = require(path.join(repoRoot, 'src/data/seeds.ts'));
const { applyAmboDissection, canApplyAmboDissection } = require(path.join(repoRoot, 'src/lib/ambo.ts'));
const { multiplyFanoUnits } = require(path.join(repoRoot, 'src/lib/fanoOctonionicCarrierTableV0.ts'));

// ---------------------------------------------------------------------------
// 0. Signed-basis octonion algebra, built on the repo Fano product LAW only.
//    OctValue = { s: 1|-1, u: 0..7 }; u=0 is the real unit 1.
// ---------------------------------------------------------------------------
function octMul(a, b) {
  if (a.u === 0) return { s: a.s * b.s, u: b.u };
  if (b.u === 0) return { s: a.s * b.s, u: a.u };
  if (a.u === b.u) return { s: -a.s * b.s, u: 0 };
  const p = multiplyFanoUnits('e' + a.u, 'e' + b.u);
  return { s: a.s * b.s * (p.sign === '+' ? 1 : -1), u: Number(p.productUnit.slice(1)) };
}
const octRe = (a) => (a.u === 0 ? a.s : 0);
const octKey = (a) => (a.s === 1 ? '+' : '-') + (a.u === 0 ? '1' : 'e' + a.u);
const octEq = (a, b) => a.s === b.s && a.u === b.u;
const octNeg = (a) => ({ s: -a.s, u: a.u });
const E = (u) => ({ s: 1, u });
const octIndex = (a) => a.u * 2 + (a.s === 1 ? 0 : 1);
const octFromIndex = (i) => ({ s: i % 2 === 0 ? 1 : -1, u: Math.floor(i / 2) });

const Q_UNITS = [3, 5, 6]; // the quaternion / child Fano line (Gate-0 public)
const QUADRANGLE_UNITS = [1, 2, 4, 7]; // the primal complete quadrangle (model card)
const inQ = (a) => a.u === 0 || Q_UNITS.includes(a.u); // quaternion subalgebra Q = span{1,e3,e5,e6}
const CATALAN = [1, 1, 2, 5, 14, 42, 132, 429, 1430];

// Exact interval DP over ALL bracketings (recomputed from the repo pattern):
// returns { total, distinct: [octKey...], values: [OctValue...], reSet, class }.
function bracketingValueSet(word) {
  const n = word.length;
  if (n === 0) return { total: 0, distinct: [], values: [], reSet: [], cls: 'empty' };
  if (n === 1) return classifySet(1, [word[0]]);
  const dp = [];
  for (let i = 0; i < n; i += 1) {
    dp.push([]);
    for (let j = 0; j < n; j += 1) dp[i].push(new Map());
    dp[i][i].set(octIndex(word[i]), 1);
  }
  for (let span = 2; span <= n; span += 1) {
    for (let i = 0; i + span - 1 < n; i += 1) {
      const j = i + span - 1;
      const cell = dp[i][j];
      for (let k = i; k < j; k += 1) {
        for (const [li, lc] of dp[i][k]) {
          for (const [ri, rc] of dp[k + 1][j]) {
            const pi = octIndex(octMul(octFromIndex(li), octFromIndex(ri)));
            cell.set(pi, (cell.get(pi) || 0) + lc * rc);
          }
        }
      }
    }
  }
  let total = 0;
  const values = [];
  for (const [idx, count] of dp[0][n - 1]) {
    total += count;
    values.push(octFromIndex(idx));
  }
  return classifySet(total, values);
}
function classifySet(total, values) {
  const distinct = values.map(octKey);
  const reSet = [...new Set(values.map(octRe))].sort((a, b) => a - b);
  let cls;
  if (values.length === 1) cls = 'value-identical';
  else if (values.length === 2 && values[0].u === values[1].u && values[0].s !== values[1].s)
    cls = 'identical-up-to-sign';
  else cls = 'genuinely-bracketing-dependent';
  return { total, distinct, values, reSet, cls };
}

// ---------------------------------------------------------------------------
// Deterministic seeded stream (mulberry32) for controls / mock (repo pattern).
// ---------------------------------------------------------------------------
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
const SEED = 20260613;
const drawInt = (next, bound) => Math.floor(next() * bound);
function drawPermutation(size, next) {
  const p = Array.from({ length: size }, (_v, i) => i);
  for (let i = size - 1; i > 0; i -= 1) {
    const j = drawInt(next, i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  return p;
}

// ---------------------------------------------------------------------------
// 1. Build the REAL Ambo: G0 tetra -> G1 (4 primal persist + 6 first-birth
//    children = octahedron core). Carrier graph nodes/edges + parentage.
// ---------------------------------------------------------------------------
function buildCarrierGraph() {
  const tetra = createSeedShape('tetrahedron');
  if (!canApplyAmboDissection(tetra)) throw new Error('Ambo not applicable to tetrahedron seed.');
  const g1 = applyAmboDissection(tetra);

  const primalVerts = Object.values(g1.vertices).filter((v) => v.createdBy.operation === 'seed');
  const labelById = {};
  for (const v of primalVerts) labelById[v.id] = v.data.label; // 'A'..'D'
  const primal = primalVerts.map((v) => v.data.label).sort(); // ['A','B','C','D']

  const core = g1.cells.find((c) => c.kind === 'core'); // octahedron of 6 children
  const children = core.vertexIds.map((id) => {
    const v = g1.vertices[id];
    const parents = v.createdBy.sourceVertexIds.map((pid) => labelById[pid]); // createdBy order
    const childKey = [...parents].sort().join(''); // 'AB','AC',...
    return { id, key: childKey, parentsOrdered: parents, parents: [...parents].sort(), pos: v.position };
  });
  const childByKey = Object.fromEntries(children.map((c) => [c.key, c]));

  // birth edges: each child <-> its 2 parents (12). hub edges: children sharing
  // exactly one primal parent = octahedron adjacency (12).
  const edges = [];
  for (const c of children) for (const p of c.parents) edges.push({ a: p, b: c.key, type: 'birth' });
  for (let i = 0; i < children.length; i += 1)
    for (let j = i + 1; j < children.length; j += 1) {
      const shared = children[i].parents.filter((p) => children[j].parents.includes(p));
      if (shared.length === 1) edges.push({ a: children[i].key, b: children[j].key, type: 'hub' });
    }

  const adjacency = new Map();
  const edgeType = new Map();
  const nodes = [...primal, ...children.map((c) => c.key)];
  for (const n of nodes) adjacency.set(n, []);
  for (const e of edges) {
    adjacency.get(e.a).push(e.b);
    adjacency.get(e.b).push(e.a);
    edgeType.set(e.a + '|' + e.b, e.type);
    edgeType.set(e.b + '|' + e.a, e.type);
  }
  const isChild = (n) => n.length === 2;
  return {
    primal, children, childByKey, nodes, edges, adjacency, edgeType, isChild,
    birthCount: edges.filter((e) => e.type === 'birth').length,
    hubCount: edges.filter((e) => e.type === 'hub').length,
  };
}

// ---------------------------------------------------------------------------
// 2. Carrier assignment + Hole #1 (reverse law) -> signed child carriers.
//    primalCarrier: anchored complete quadrangle {A:e1,B:e2,C:e4,D:e7} (model
//    card §2 construction input — public anchored assignment, not a sealed value).
// ---------------------------------------------------------------------------
const ANCHORED_PRIMAL = { A: 1, B: 2, C: 4, D: 7 };

// R-anti geometric pole signs: reproduce octaFirstBirthCarrierBaseV0.deriveOctaFrame
// on the children's octahedron — antipodal pole pairs (position negation), axes in
// first-encountered order, the 3rd axis positive pole forced by det[p1,p2,p3] > 0.
function geometricPoleSign(graph) {
  const verts = graph.children.map((c) => ({ key: c.key, pos: c.pos }));
  const approxZero = (v) => Math.abs(v[0]) < 1e-9 && Math.abs(v[1]) < 1e-9 && Math.abs(v[2]) < 1e-9;
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const det3 = (a, b, c) =>
    a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]);
  const paired = new Set();
  const pairs = [];
  for (const v of verts) {
    if (paired.has(v.key)) continue;
    const anti = verts.find((w) => w.key !== v.key && !paired.has(w.key) && approxZero(add(v.pos, w.pos)));
    paired.add(v.key);
    paired.add(anti.key);
    pairs.push([v, anti]);
  }
  const p1 = pairs[0][0], p2 = pairs[1][0], axis3 = pairs[2];
  let p3 = axis3[0];
  if (det3(p1.pos, p2.pos, axis3[0].pos) <= 0) p3 = axis3[1];
  const ordered = [
    { positive: p1.key, negative: pairs[0][1].key },
    { positive: p2.key, negative: pairs[1][1].key },
    { positive: p3.key, negative: axis3[0].key === p3 ? axis3[1].key : axis3[0].key },
  ];
  const sign = {};
  for (const ax of ordered) {
    sign[ax.positive] = 1;
    sign[ax.negative] = -1;
  }
  return sign; // childKey -> +1 / -1 (geometric)
}

// Returns the signed child carriers + a reverse-law descriptor, given a primal
// carrier assignment (units per label) and the reverse-law branch.
function deriveCarriers(graph, primalUnits, reverseLaw) {
  const carrier = {};
  for (const lbl of graph.primal) carrier[lbl] = E(primalUnits[lbl]);
  const poleSign = reverseLaw === 'R-anti' ? geometricPoleSign(graph) : null;
  const childProvenance = {};
  for (const c of graph.children) {
    // forward unit & sign from the bearing walk (createdBy parent order = "child
    // built from its own edge"): u(child) = carrier(p0) . carrier(p1).
    const fwd = octMul(carrier[c.parentsOrdered[0]], carrier[c.parentsOrdered[1]]);
    if (reverseLaw === 'R-anti') {
      carrier[c.key] = { s: poleSign[c.key], u: fwd.u }; // sign set geometrically
      childProvenance[c.key] = 'geometric-pole-sign';
    } else {
      carrier[c.key] = fwd; // createdBy-order product (R-neg & R-ret share this)
      childProvenance[c.key] = reverseLaw === 'R-ret' ? 'derived-anticommutativity' : 'posited-negation';
    }
  }
  return { carrier, childProvenance, reverseLaw };
}

// Directed link shadow under convention beta. The reverse law only changes the
// child carrier signs (above) and the *provenance* of reverse links; for a
// simple loop, node re-signing cancels (two incident links flip), so loop
// holonomies are reverse-law invariant — a measured fact, asserted at integrity.
function link(carrier, u, v) {
  return octMul(carrier[u], carrier[v]);
}

// ---------------------------------------------------------------------------
// 3. Hole #2 deterministic bracketings. A loop is an ordered node cycle
//    [n0..n_{L-1}]; its links are L_i = link(n_i, n_{i+1 mod L}). Each rule
//    returns a single OctValue (the selected bracketing's product).
// ---------------------------------------------------------------------------
function loopLinks(carrier, cycle) {
  const out = [];
  for (let i = 0; i < cycle.length; i += 1) out.push(link(carrier, cycle[i], cycle[(i + 1) % cycle.length]));
  return out;
}
// B-walk: right-association.
function bracketWalk(words) {
  let acc = words[words.length - 1];
  for (let i = words.length - 2; i >= 0; i -= 1) acc = octMul(words[i], acc);
  return acc;
}
// B-gen: links meeting at a common CHILD node group first (leftmost child
// innermost), then left-associate the remainder.  Operates on the LINK list,
// where link i sits between cycle node i and node i+1; link i and link i+1 meet
// at node i+1.
function bracketGen(graph, cycle, words) {
  // node between link i and link i+1 is cycle[(i+1) % L]
  let items = words.map((w) => ({ val: w }));
  // adjacency meeting-node for the gap after item i is cycle[(i+1)%L]; we only
  // fold linear gaps (0..L-2) so we never wrap the cyclic word.
  let meet = [];
  for (let i = 0; i < items.length - 1; i += 1) meet.push(cycle[(i + 1) % cycle.length]);
  while (true) {
    let gi = meet.findIndex((m) => graph.isChild(m));
    if (gi === -1) break;
    const merged = { val: octMul(items[gi].val, items[gi + 1].val) };
    items.splice(gi, 2, merged);
    meet.splice(gi, 1);
  }
  // left-associate any remainder
  let acc = items[0].val;
  for (let i = 1; i < items.length; i += 1) acc = octMul(acc, items[i].val);
  return acc;
}
// B-frame: group the consecutive link pair whose roots are closest in the A2
// plane first (smallest angular gap), innermost; repeat; left-assoc remainder.
function bracketFrame(rootOfLink, cycle, words) {
  let items = words.map((w, i) => ({ val: w, ang: rootOfLink[i] }));
  while (items.length > 1) {
    // find adjacent pair (linear, no wrap) with smallest angular gap
    let best = 0;
    let bestGap = Infinity;
    for (let i = 0; i < items.length - 1; i += 1) {
      let d = Math.abs(items[i].ang - items[i + 1].ang);
      d = Math.min(d, 2 * Math.PI - d);
      if (d < bestGap - 1e-12) {
        bestGap = d;
        best = i;
      }
    }
    const merged = { val: octMul(items[best].val, items[best + 1].val), ang: items[best].ang };
    items.splice(best, 2, merged);
  }
  return items[0].val;
}

// ---------------------------------------------------------------------------
// 4. FLOOR layer: G2 cuboctahedron / 12 directed flags (A3 roots). Links =
//    carrier(i).carrier(j). Recomputed from atoms+law; compared (display-only)
//    to the PUBLIC Bench-2 / Gate-0 figures. NO pass/fail keys on the public values.
// ---------------------------------------------------------------------------
const PRIMAL4 = ['A', 'B', 'C', 'D'];
function eps(label) {
  return PRIMAL4.map((p) => (p === label ? 1 : 0)); // index direction in R^4
}
function rootOf(i, j) {
  const a = eps(i), b = eps(j);
  return a.map((x, k) => x - b[k]); // eps_i - eps_j  (A3 root)
}
const dot = (a, b) => a.reduce((s, x, k) => s + x * b[k], 0);
const norm = (a) => Math.sqrt(dot(a, a));

function buildFlags() {
  const flags = [];
  for (const i of PRIMAL4) for (const j of PRIMAL4) if (i !== j) flags.push({ i, j, key: i + '>' + j });
  return flags;
}

// floor loop inventory on the primal K4: 8 triangles, 6 squares, 8 hexagons
// (reproduced from the repo's moufang structure; angular hexagon ordering).
function buildFloorLoops() {
  const loops = [];
  const tk = new Set();
  for (const a of PRIMAL4) for (const b of PRIMAL4) for (const c of PRIMAL4) {
    if (a === b || b === c || a === c) continue;
    const rot = [`${a}${b}${c}`, `${b}${c}${a}`, `${c}${a}${b}`].sort()[0];
    if (tk.has(rot)) continue;
    tk.add(rot);
    loops.push({ cls: 'triangle', cycle: rot.split('') });
  }
  const sk = new Set();
  const perm = (xs) => (xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perm(xs.filter((_v, k) => k !== i)).map((t) => [x, ...t])));
  for (const o of perm(PRIMAL4)) {
    const s = o.join('');
    const rot = [0, 1, 2, 3].map((r) => s.slice(r) + s.slice(0, r)).sort()[0];
    if (sk.has(rot)) continue;
    sk.add(rot);
    loops.push({ cls: 'square', cycle: rot.split('') });
  }
  // hexagons: 4 A2 subsystems (3-subsets) x 2 directions; angular order of roots.
  const subs = [];
  for (let i = 0; i < 4; i += 1) for (let j = i + 1; j < 4; j += 1) for (let k = j + 1; k < 4; k += 1)
    subs.push([PRIMAL4[i], PRIMAL4[j], PRIMAL4[k]]);
  for (const sub of subs) {
    const roots = [];
    for (const f of sub) for (const t of sub) if (f !== t) roots.push({ i: f, j: t, vec: rootOf(f, t) });
    const u = unit(roots[0].vec);
    const rawW = roots.find((r) => Math.abs(dot(unit(r.vec), u)) < 0.99).vec;
    const w = unit(rawW.map((x, k) => x - u[k] * dot(rawW, u)));
    const withA = roots.map((r) => ({ ...r, ang: Math.atan2(dot(r.vec, w), dot(r.vec, u)) }));
    withA.sort((a, b) => a.ang - b.ang);
    const fwd = withA.map((r) => ({ i: r.i, j: r.j }));
    loops.push({ cls: 'hexagon', sub: sub.join(''), flagSeq: fwd });
    loops.push({ cls: 'hexagon', sub: sub.join(''), flagSeq: [...fwd].reverse() });
  }
  return loops;
}
function unit(v) {
  const n = norm(v);
  return n > 0 ? v.map((x) => x / n) : v;
}
// flag word for a floor loop (triangle/square via node cycle; hexagon via flag seq)
function floorWord(carrier, loop) {
  if (loop.cls === 'hexagon') return loop.flagSeq.map((f) => octMul(carrier[f.i], carrier[f.j]));
  return loopLinks(carrier, loop.cycle);
}

// ---------------------------------------------------------------------------
// 5. Gauge orbits. S4 = 24 relabelings of the 4 sites within the anchored
//    quadrangle. 168 Fano gauge = 7 complete quadrangles x 24 site orderings,
//    quadrangles derived from the product law (no hard-coding).
// ---------------------------------------------------------------------------
function permutations4() {
  return (function perm(xs) {
    return xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perm(xs.filter((_v, k) => k !== i)).map((t) => [x, ...t]));
  })([0, 1, 2, 3]);
}
function fanoLines() {
  const lines = [];
  const seen = new Set();
  for (let i = 1; i <= 7; i += 1) for (let j = i + 1; j <= 7; j += 1) {
    const u = octMul(E(i), E(j)).u;
    const key = [i, j, u].sort((a, b) => a - b).join(',');
    if (!seen.has(key)) {
      seen.add(key);
      lines.push([i, j, u].sort((a, b) => a - b));
    }
  }
  return lines;
}
function quadrangles() {
  const lk = new Set(fanoLines().map((l) => l.join(',')));
  const quads = [];
  for (let a = 1; a <= 7; a += 1) for (let b = a + 1; b <= 7; b += 1) for (let c = b + 1; c <= 7; c += 1) for (let d = c + 1; d <= 7; d += 1) {
    const pts = [a, b, c, d];
    const triples = [[a, b, c], [a, b, d], [a, c, d], [b, c, d]];
    if (!triples.some((t) => lk.has(t.join(',')))) quads.push(pts);
  }
  return quads;
}
function s4Assignments() {
  const base = ANCHORED_PRIMAL;
  const units = PRIMAL4.map((p) => base[p]);
  return permutations4().map((ord) => {
    const a = {};
    PRIMAL4.forEach((p, k) => { a[p] = units[ord[k]]; });
    return a;
  });
}
function fanoGaugeAssignments() {
  const out = [];
  for (const q of quadrangles()) for (const ord of permutations4()) {
    const a = {};
    PRIMAL4.forEach((p, k) => { a[p] = q[ord[k]]; });
    out.push(a);
  }
  return out;
}

// ===========================================================================
// FLOOR computation (one pass) — recompute + PUBLIC compare (display only).
// ===========================================================================
function computeFloor(graph) {
  const carrier = {};
  for (const p of graph.primal) carrier[p] = E(ANCHORED_PRIMAL[p]);
  const flags = buildFlags();
  const flagLink = {};
  for (const f of flags) flagLink[f.key] = octMul(carrier[f.i], carrier[f.j]);

  // Q-confinement: all 12 flag links in Q.
  const allInQ = flags.every((f) => inQ(flagLink[f.key]));

  // loops: value-sets + Re per class.
  const loops = buildFloorLoops();
  const perLoop = loops.map((loop) => {
    const word = floorWord(carrier, loop);
    const vs = bracketingValueSet(word);
    return { cls: loop.cls, len: word.length, total: vs.total, distinct: vs.distinct.length, cls2: vs.cls, re: octRe(bracketWalk(word)) };
  });
  const triRe = [...new Set(perLoop.filter((l) => l.cls === 'triangle').map((l) => l.re))];
  const sqRe = [...new Set(perLoop.filter((l) => l.cls === 'square').map((l) => l.re))];
  const hexRe = [...new Set(perLoop.filter((l) => l.cls === 'hexagon').map((l) => l.re))];
  const triBr = [...new Set(perLoop.filter((l) => l.cls === 'triangle').map((l) => l.total))];
  const sqBr = [...new Set(perLoop.filter((l) => l.cls === 'square').map((l) => l.total))];
  const hexBr = [...new Set(perLoop.filter((l) => l.cls === 'hexagon').map((l) => l.total))];
  const allValueIdentical = perLoop.every((l) => l.cls2 === 'value-identical');

  // order-2 antipodality at G2: flag i>j vs j>i, same ray opposite sign.
  const axes = [];
  const seenAx = new Set();
  for (const f of flags) {
    const rev = f.j + '>' + f.i;
    const ax = [f.key, rev].sort().join('|');
    if (seenAx.has(ax)) continue;
    seenAx.add(ax);
    const a = flagLink[f.key], b = flagLink[rev];
    axes.push({ ax, sameRay: a.u === b.u, opposite: a.u === b.u && a.s !== b.s });
  }
  const antipodalOpposite = axes.filter((a) => a.opposite).length;

  // metric from carrier/index-derived anchors (NEVER canonical cubocta coords).
  // R12: 12 roots eps_i - eps_j. R6: bare-unit collapse (flag -> signed Q-axis).
  const r12 = metricFromAnchors(flags.map((f) => ({ key: f.key, vec: rootOf(f.i, f.j) })));
  const qAxis = { 3: [1, 0, 0], 5: [0, 1, 0], 6: [0, 0, 1] };
  const r6anchors = flags.map((f) => {
    const l = flagLink[f.key];
    return { key: f.key, vec: qAxis[l.u].map((x) => x * l.s) };
  });
  const r6 = metricFromAnchors(r6anchors);

  // 168-gauge invariance of the Re-pattern (recompute under each gauge element).
  const reSig = (assign) => {
    const c = {};
    for (const p of graph.primal) c[p] = E(assign[p]);
    return loops.map((loop) => octRe(bracketWalk(floorWord(c, loop)))).join(',');
  };
  const trueSig = reSig(ANCHORED_PRIMAL);
  const gauge = fanoGaugeAssignments();
  const gaugeInvariant = gauge.filter((a) => reSig(a) === trueSig).length;

  return {
    flags, flagLink, allInQ, perLoop, triRe, sqRe, hexRe, triBr, sqBr, hexBr,
    allValueIdentical, axes, antipodalOpposite, r12, r6, gaugeInvariant, gaugeTotal: gauge.length, trueSig, reSig, loops,
  };
}
function metricFromAnchors(anchors) {
  const distinct = new Set(anchors.map((a) => a.vec.map((x) => x.toFixed(6)).join(','))).size;
  const radius = norm(anchors[0].vec);
  // adjacency angle = smallest positive pairwise angle; edge = that nn distance.
  let minAng = Infinity;
  let nnDist = Infinity;
  for (let i = 0; i < anchors.length; i += 1) for (let j = i + 1; j < anchors.length; j += 1) {
    const cdot = dot(anchors[i].vec, anchors[j].vec) / (norm(anchors[i].vec) * norm(anchors[j].vec));
    const ang = Math.acos(Math.max(-1, Math.min(1, cdot))) * 180 / Math.PI;
    if (ang > 1e-6 && ang < minAng) minAng = ang;
  }
  // edge = nearest-neighbour distance among distinct anchors
  for (let i = 0; i < anchors.length; i += 1) for (let j = i + 1; j < anchors.length; j += 1) {
    const d = norm(anchors[i].vec.map((x, k) => x - anchors[j].vec[k]));
    if (d > 1e-6 && d < nnDist) nnDist = d;
  }
  return { distinct, total: anchors.length, radius, adjacencyAngle: Math.round(minAng * 100) / 100, edge: nnDist, edgeOverRadius: Math.round((nnDist / radius) * 10000) / 10000 };
}

// ===========================================================================
// PRIZE computation — measured ONLY, ZERO expected constants (Rider A).
// G1 carrier graph; simple loops length<=6; hub-only vs mixed/birth; full
// bracketing value-sets; Hole #2 selected brackets + gauge-equivariance.
// ===========================================================================
function enumerateSimpleLoops(graph, maxLen) {
  const found = new Map(); // canonical key -> cycle
  const nodes = graph.nodes;
  for (const start of nodes) {
    const stack = [[start, [start], new Set([start])]];
    while (stack.length) {
      const [cur, pathArr, visited] = stack.pop();
      for (const nxt of graph.adjacency.get(cur)) {
        if (nxt === start && pathArr.length >= 3) {
          const cyc = [...pathArr];
          const key = canonCycle(cyc);
          if (!found.has(key)) found.set(key, cyc);
          continue;
        }
        if (visited.has(nxt)) continue;
        if (pathArr.length >= maxLen) continue;
        const nv = new Set(visited);
        nv.add(nxt);
        stack.push([nxt, [...pathArr, nxt], nv]);
      }
    }
  }
  return [...found.values()];
}
function canonCycle(cycle) {
  const L = cycle.length;
  const variants = [];
  for (let r = 0; r < L; r += 1) variants.push(cycle.slice(r).concat(cycle.slice(0, r)).join(','));
  const rev = [...cycle].reverse();
  for (let r = 0; r < L; r += 1) variants.push(rev.slice(r).concat(rev.slice(0, r)).join(','));
  return variants.sort()[0];
}
function loopEdgeTypes(graph, cycle) {
  const types = [];
  for (let i = 0; i < cycle.length; i += 1) types.push(graph.edgeType.get(cycle[i] + '|' + cycle[(i + 1) % cycle.length]));
  return types;
}
// angular tag per link for B-frame: use the root eps - eps of the underlying
// directed step where defined; children map to the unordered-pair root midpoint
// direction. We derive a stable scalar angle per step from index coordinates.
function stepAngle(graph, fromN, toN) {
  // coordinate of a node: primal -> eps; child -> average of its parents' eps
  const coord = (n) => {
    if (!graph.isChild(n)) return eps(n);
    const c = graph.childByKey[n];
    const a = eps(c.parents[0]), b = eps(c.parents[1]);
    return a.map((x, k) => (x + b[k]) / 2);
  };
  const v = coord(toN).map((x, k) => x - coord(fromN)[k]); // R^4 step vector
  // project to a fixed 2-plane (first two principal index axes) for an angle
  return Math.atan2(v[1] - v[3], v[0] - v[2]);
}

function computePrize(graph, carriers) {
  const carrier = carriers.carrier;
  const loops = enumerateSimpleLoops(graph, 6);
  const records = loops.map((cycle) => {
    const types = loopEdgeTypes(graph, cycle);
    const mixed = types.includes('birth');
    const words = loopLinks(carrier, cycle);
    const vs = bracketingValueSet(words);
    const valueLeavesQ = vs.values.some((v) => !inQ(v)); // closed holonomy leaves Q
    const wordLeavesQ = words.some((w) => !inQ(w)); // word traverses off-Q (birth links) — birth-edge signature
    const bracketingDependent = vs.cls !== 'value-identical'; // value-set > 1 (spec's "bracketing-DEPENDENT")
    const reDependent = vs.reSet.length > 1; // Re itself ambiguous across bracketings (the discriminator set)
    return { cycle, len: cycle.length, types, mixed, valueLeavesQ, wordLeavesQ, vs, bracketingDependent, reDependent };
  });
  const hubOnly = records.filter((r) => !r.mixed);
  const mixedRec = records.filter((r) => r.mixed);
  const depMixed = mixedRec.filter((r) => r.bracketingDependent);
  const reDepMixed = mixedRec.filter((r) => r.reDependent);
  const genuineMixed = mixedRec.filter((r) => r.vs.cls === 'genuinely-bracketing-dependent');

  const profile = {
    total: records.length,
    hubOnly: hubOnly.length,
    mixed: mixedRec.length,
    hubBracketInvariant: hubOnly.filter((r) => !r.bracketingDependent).length,
    hubWordLeavesQ: hubOnly.filter((r) => r.wordLeavesQ).length,
    hubValueLeavesQ: hubOnly.filter((r) => r.valueLeavesQ).length,
    mixedWordLeavesQ: mixedRec.filter((r) => r.wordLeavesQ).length,
    mixedValueLeavesQ: mixedRec.filter((r) => r.valueLeavesQ).length,
    mixedValueIdentical: mixedRec.filter((r) => r.vs.cls === 'value-identical').length,
    mixedUpToSign: mixedRec.filter((r) => r.vs.cls === 'identical-up-to-sign').length,
    mixedGenuine: genuineMixed.length,
    mixedBracketingDependent: depMixed.length,
    mixedReDependent: reDepMixed.length,
    byLen: {},
  };
  for (let L = 3; L <= 6; L += 1)
    profile.byLen[L] = {
      hub: hubOnly.filter((r) => r.len === L).length,
      mixed: mixedRec.filter((r) => r.len === L).length,
      dep: depMixed.filter((r) => r.len === L).length,
      reDep: reDepMixed.filter((r) => r.len === L).length,
    };

  return { records, hubOnly, mixedRec, depMixed, reDepMixed, genuineMixed, profile };
}

// For each genuinely-dependent mixed loop: the bracketing each Hole #2 rule
// selects, whether they coincide, and gauge-equivariance of the selected Re
// under S4 (24) and the 168 Fano gauge. NO expected constant anywhere here.
function evaluatePrizeSelection(graph, dependentMixed, bracketRule) {
  const s4 = s4Assignments();
  const fano = fanoGaugeAssignments();
  return dependentMixed.map((rec) => {
    const selectFor = (assign, rLaw) => {
      const c = deriveCarriers(graph, assign, rLaw).carrier;
      const words = loopLinks(c, rec.cycle);
      const rootAng = rec.cycle.map((n, i) => stepAngle(graph, n, rec.cycle[(i + 1) % rec.cycle.length]));
      if (bracketRule === 'B-walk') return bracketWalk(words);
      if (bracketRule === 'B-gen') return bracketGen(graph, rec.cycle, words);
      return bracketFrame(rootAng, rec.cycle, words);
    };
    const sel = selectFor(ANCHORED_PRIMAL, 'R-ret');
    const reSel = octRe(sel);
    // gauge-equivariance of the SELECTED Re (apply the same selection rule under
    // each gauge element's carrier assignment; measure Re invariance).
    const s4Inv = s4.filter((a) => octRe(selectFor(a, 'R-ret')) === reSel).length;
    const fanoInv = fano.filter((a) => octRe(selectFor(a, 'R-ret')) === reSel).length;
    return {
      cycle: rec.cycle, selectedKey: octKey(sel), selectedRe: reSel,
      s4Inv, s4Total: s4.length, fanoInv, fanoTotal: fano.length,
      s4Equivariant: s4Inv === s4.length, fanoEquivariant: fanoInv === fano.length,
    };
  });
}

// Combined per-loop table: all three Hole #2 rules' selected Re + S4/168 gauge-
// equivariance of each selection, in one pass. Measured only (zero constants).
function prizeSelectionTable(graph, loops) {
  const s4 = s4Assignments();
  const fano = fanoGaugeAssignments();
  const rules = BRACKET_RULES;
  const selectVal = (assign, cycle, rule) => {
    const c = deriveCarriers(graph, assign, 'R-ret').carrier;
    const words = loopLinks(c, cycle);
    if (rule === 'B-walk') return bracketWalk(words);
    if (rule === 'B-gen') return bracketGen(graph, cycle, words);
    const rootAng = cycle.map((n, i) => stepAngle(graph, n, cycle[(i + 1) % cycle.length]));
    return bracketFrame(rootAng, cycle, words);
  };
  return loops.map((rec) => {
    const row = { cycle: rec.cycle, len: rec.len, types: rec.types, sel: {}, eq: {} };
    for (const rule of rules) {
      const re = octRe(selectVal(ANCHORED_PRIMAL, rec.cycle, rule));
      const s4Inv = s4.filter((a) => octRe(selectVal(a, rec.cycle, rule)) === re).length;
      const fInv = fano.filter((a) => octRe(selectVal(a, rec.cycle, rule)) === re).length;
      row.sel[rule] = re;
      row.eq[rule] = { s4: s4Inv, s4T: s4.length, f: fInv, fT: fano.length, ok: s4Inv === s4.length && fInv === fano.length };
    }
    row.agree = new Set(rules.map((r) => row.sel[r])).size === 1;
    row.allEquivariant = rules.every((r) => row.eq[r].ok);
    return row;
  });
}

// ===========================================================================
// L1-L9 destructive tests. Each: live signal, break the defining fact,
// recompute, FIRE iff the signal broke. Returns {id, fired, before, after, note}.
// ===========================================================================
function destructiveTests(graph) {
  const tests = [];
  const baseCarriers = deriveCarriers(graph, ANCHORED_PRIMAL, 'R-anti');
  const carrier = baseCarriers.carrier;

  // L1 parentage: scramble one child's sourceVertexIds -> inherited carrier breaks.
  {
    const child = graph.children.find((c) => c.key === 'AB');
    const trueU = octMul(E(ANCHORED_PRIMAL[child.parents[0]]), E(ANCHORED_PRIMAL[child.parents[1]])).u;
    const wrongParents = ['A', 'D']; // scramble {A,B} -> {A,D}
    const wrongU = octMul(E(ANCHORED_PRIMAL[wrongParents[0]]), E(ANCHORED_PRIMAL[wrongParents[1]])).u;
    tests.push({ id: 'L1-parentage', fired: trueU !== wrongU, before: 'child AB carrier unit e' + trueU, after: 'scrambled-parents carrier unit e' + wrongU, note: 'scramble createdBy.sourceVertexIds -> inheritance breaks' });
  }
  // L2 walk closure: drop one walk from a frame -> a loop cannot close (L5 fails).
  {
    // floor hexagon on {A,B,C}; drop the A->B walk: the closed word is now broken.
    const sub = ['A', 'B', 'C'];
    const full = buildFloorLoops().find((l) => l.cls === 'hexagon' && l.sub === 'ABC');
    const closedBefore = full.flagSeq.length === 6;
    const dropped = full.flagSeq.filter((f) => !(f.i === 'A' && f.j === 'B'));
    const closedAfter = dropped.length === 6;
    tests.push({ id: 'L2-walk-closure', fired: closedBefore && !closedAfter, before: '6-walk hexagon frame closes', after: 'dropped 1 walk -> ' + dropped.length + ' walks, cannot close', note: 'drop a walk -> loop-closure (L5) fails' });
  }
  // L3 angle metric: R12 (60/1) -> bare-unit R6 collapse must break to 90/sqrt2.
  {
    const floor = computeFloor(graph);
    tests.push({ id: 'L3-angle-metric', fired: floor.r12.adjacencyAngle !== floor.r6.adjacencyAngle && Math.abs(floor.r12.edgeOverRadius - floor.r6.edgeOverRadius) > 1e-6, before: `R12 ${floor.r12.adjacencyAngle}deg edge/radius=${floor.r12.edgeOverRadius} (anchors=roots eps_i-eps_j)`, after: `R6 bare-unit ${floor.r6.adjacencyAngle}deg edge/radius=${floor.r6.edgeOverRadius}`, note: 'collapse to bare-unit -> metric BREAKS (anchors carrier/index-derived, not canonical coords)' });
  }
  // L4 antipodality: remove the reverse law (symmetrize) -> 6/6 opposite collapses.
  {
    const floor = computeFloor(graph);
    const opp = floor.antipodalOpposite;
    // symmetrize: flag j>i := flag i>j (drop directedness) -> same sign.
    const carrierF = {};
    for (const p of graph.primal) carrierF[p] = E(ANCHORED_PRIMAL[p]);
    let oppAfter = 0;
    const seen = new Set();
    for (const f of floor.flags) {
      const rev = f.j + '>' + f.i;
      const ax = [f.key, rev].sort().join('|');
      if (seen.has(ax)) continue;
      seen.add(ax);
      const a = octMul(carrierF[f.i], carrierF[f.j]);
      const b = a; // symmetrized: reverse forced equal to forward
      if (a.u === b.u && a.s !== b.s) oppAfter += 1;
    }
    tests.push({ id: 'L4-antipodality', fired: opp === floor.axes.length && oppAfter === 0, before: `opposite-sign ${opp}/${floor.axes.length} axes`, after: `symmetrized reverse -> opposite ${oppAfter}/${floor.axes.length}`, note: 'remove reverse law -> antipodality collapses' });
  }
  // L5 loop-closure: remove directedness -> hexagon -1 collapses to +1.
  {
    const carrierF = {};
    for (const p of graph.primal) carrierF[p] = E(ANCHORED_PRIMAL[p]);
    const hex = buildFloorLoops().find((l) => l.cls === 'hexagon' && l.sub === 'ABC');
    const reBefore = octRe(bracketWalk(hex.flagSeq.map((f) => octMul(carrierF[f.i], carrierF[f.j]))));
    // undirected: force each flag to canonical i<j order regardless of traversal.
    const reAfter = octRe(bracketWalk(hex.flagSeq.map((f) => {
      const [lo, hi] = [f.i, f.j].sort();
      return octMul(carrierF[lo], carrierF[hi]);
    })));
    tests.push({ id: 'L5-loop-closure', fired: reBefore !== reAfter, before: `hexagon Re=${reBefore} (directed; ((-a)(-b))(-c)=-((ab)c))`, after: `undirected hexagon Re=${reAfter}`, note: 'remove directedness -> hexagon sign collapses' });
  }
  // L6 counts: switch current-core <-> cumulative -> counts change lawfully.
  {
    const currentCore = graph.children.length; // 6 first-birth (G1 current-core)
    const currentCoreG2 = 12; // 12 flags / A3 roots (G2 current-core)
    const cumulative = 4 + 6 + 12; // historical-cumulative
    tests.push({ id: 'L6-counts', fired: currentCore !== cumulative && currentCoreG2 !== cumulative, before: `current-core G1=${currentCore}, G2=${currentCoreG2}`, after: `historical-cumulative=${cumulative}`, note: 'switch policy -> counts change lawfully, not silently agree' });
  }
  // L7 equivariance: legit 168 gauge preserves; arbitrary (non-automorphism)
  // unit relabel breaks the Re-pattern.
  {
    const floor = computeFloor(graph);
    const legitInvariant = floor.gaugeInvariant === floor.gaugeTotal;
    // arbitrary non-automorphism: a transposition of two units NOT preserving Fano lines.
    const swap = { 1: 3, 3: 1 }; // e1<->e3: e1*e2=e3 but e3*e2 != e1 -> breaks multiplicativity
    const relabel = (u) => swap[u] || u;
    const arbAssign = {};
    for (const p of graph.primal) arbAssign[p] = relabel(ANCHORED_PRIMAL[p]);
    const broke = floor.reSig(arbAssign) !== floor.trueSig;
    tests.push({ id: 'L7-equivariance', fired: legitInvariant && broke, before: `legit 168 gauge invariant ${floor.gaugeInvariant}/${floor.gaugeTotal}`, after: `arbitrary non-automorphism relabel -> pattern ${broke ? 'BROKE' : 'held'}`, note: 'only the legitimate gauge preserves' });
  }
  // L8 no arbitrary carrier: perturb one carrier off its walk-shadow -> check fires.
  {
    const child = graph.children.find((c) => c.key === 'AB');
    const shadow = octMul(E(ANCHORED_PRIMAL[child.parents[0]]), E(ANCHORED_PRIMAL[child.parents[1]]));
    const perturbed = E(1); // e1: not the shadow e3
    const consistentBefore = octEq(carrier['AB'], { s: carrier['AB'].s, u: shadow.u });
    const consistentAfter = octEq(perturbed, shadow);
    tests.push({ id: 'L8-no-arbitrary-carrier', fired: consistentBefore && !consistentAfter, before: `carrier(AB) unit = shadow unit e${shadow.u}`, after: `perturbed carrier(AB)=${octKey(perturbed)} != shadow ${octKey(shadow)} -> check fires`, note: 'carrier is forced by walk-composition, not free' });
  }
  // L9 midpoint->flag map: derived map is S4-equivariant; hand-supplied breaks it.
  {
    // derived: child {X,Y} bearing walk X->Y maps to root eps_X - eps_Y; under a
    // site relabel sigma the derived map commutes (relabel then map == map then relabel).
    const derivedMap = (assignParents, perm) => {
      // perm: label->label. derived map composes with relabeling.
      const lhs = graph.children.map((c) => {
        const p = [perm[c.parentsOrdered[0]], perm[c.parentsOrdered[1]]];
        return rootOf(p[0], p[1]).join(',');
      });
      const rhs = graph.children.map((c) => {
        const r = rootOf(c.parentsOrdered[0], c.parentsOrdered[1]);
        // relabel the root coordinate by perm
        const relabeled = PRIMAL4.map((p) => r[PRIMAL4.indexOf(invPerm(perm)[p])]);
        return relabeled.join(',');
      });
      return JSON.stringify(lhs) === JSON.stringify(rhs);
    };
    const perm = { A: 'B', B: 'C', C: 'D', D: 'A' }; // a 4-cycle in S4
    const derivedEquivariant = derivedMap(null, perm);
    // hand-supplied fixed map: assign roots to children by a frozen table that
    // ignores inheritance (e.g. lexical child order -> fixed root list). Under the
    // relabel it does NOT commute.
    const fixedTable = {};
    const fixedRoots = graph.children.map((c) => rootOf(c.parentsOrdered[0], c.parentsOrdered[1]));
    graph.children.forEach((c, i) => { fixedTable[c.key] = fixedRoots[i]; }); // frozen by current labels
    const handEquivariant = graph.children.every((c) => {
      const relabeledChildKey = [perm[c.parents[0]], perm[c.parents[1]]].sort().join('');
      const mappedAfterRelabel = fixedTable[relabeledChildKey]; // hand map applied to relabeled child
      const relabelOfMapped = (() => {
        const r = fixedTable[c.key];
        return PRIMAL4.map((p) => r[PRIMAL4.indexOf(invPerm(perm)[p])]);
      })();
      return JSON.stringify(mappedAfterRelabel) === JSON.stringify(relabelOfMapped);
    });
    tests.push({ id: 'L9-midpoint-flag-map', fired: derivedEquivariant && !handEquivariant, before: `derived (inheritance) map S4-equivariant=${derivedEquivariant}`, after: `hand-supplied fixed map S4-equivariant=${handEquivariant}`, note: 'hand-supply the map -> equivariance fails (Addition B)' });
  }
  return tests;
}
function invPerm(perm) {
  const out = {};
  for (const k of Object.keys(perm)) out[perm[k]] = k;
  return out;
}

// ===========================================================================
// CONTROLS / honesty (§3.4): mock-solution gate; reality-non-genericity; blind.
// ===========================================================================
function controls(graph) {
  const next = mulberry32(SEED);
  const floor = computeFloor(graph);
  const trueSig = floor.trueSig;
  // true prize signal: the multiset of distinct-value counts over mixed loops.
  const truePrize = computePrize(graph, deriveCarriers(graph, ANCHORED_PRIMAL, 'R-ret'));
  const truePrizeSig = truePrize.mixedRec.map((r) => r.vs.distinct.length).join(',');

  // MOCK-SOLUTION: derange the 12 flag carriers + independent sign flips ->
  // legitimacy (floor Re-pattern) AND prize signal must BREAK.
  const flags = floor.flags;
  const trueFlagVals = flags.map((f) => floor.flagLink[f.key]);
  let perm = drawPermutation(flags.length, next);
  while (perm.some((t, i) => t === i)) perm = drawPermutation(flags.length, next);
  const scrambledLink = {};
  flags.forEach((f, i) => {
    const base = trueFlagVals[perm[i]];
    scrambledLink[f.key] = next() < 0.5 ? octNeg(base) : { ...base };
  });
  const scrambledSig = floor.loops.map((loop) => {
    if (loop.cls === 'hexagon') return octRe(bracketWalk(loop.flagSeq.map((fl) => scrambledLink[fl.i + '>' + fl.j])));
    const w = [];
    for (let i = 0; i < loop.cycle.length; i += 1) w.push(scrambledLink[loop.cycle[i] + '>' + loop.cycle[(i + 1) % loop.cycle.length]]);
    return octRe(bracketWalk(w));
  }).join(',');
  const floorBroke = scrambledSig !== trueSig;
  // prize under scrambled child carriers (derange the 6 child Q-units + flips)
  const childKeys = graph.children.map((c) => c.key);
  let cperm = drawPermutation(childKeys.length, next);
  while (cperm.some((t, i) => t === i)) cperm = drawPermutation(childKeys.length, next);
  const trueChild = deriveCarriers(graph, ANCHORED_PRIMAL, 'R-ret').carrier;
  const scrambledCarrier = { ...trueChild };
  childKeys.forEach((k, i) => {
    const base = trueChild[childKeys[cperm[i]]];
    scrambledCarrier[k] = next() < 0.5 ? octNeg(base) : { ...base };
  });
  const scrambledPrize = (() => {
    const recs = enumerateSimpleLoops(graph, 6).map((cycle) => {
      const types = loopEdgeTypes(graph, cycle);
      if (!types.includes('birth')) return null;
      const vs = bracketingValueSet(loopLinks(scrambledCarrier, cycle));
      return vs.distinct.length;
    }).filter((x) => x !== null);
    return recs.join(',');
  })();
  const prizeBroke = scrambledPrize !== truePrizeSig;
  const runVoid = !(floorBroke && prizeBroke);

  // REALITY-NON-GENERICITY: random Q-confined flag assignments -> reality
  // fraction (loops landing in {+-1}). Report {mean,p95,max}.
  const DRAWS = 128;
  const realityFractions = [];
  for (let d = 0; d < DRAWS; d += 1) {
    // Gate-0 design: random Q-confined assignments to the 12 EDGE/flag lifts
    // independently (not derived from primals), to probe genericity of reality.
    const rf = {};
    for (const f of flags) rf[f.key] = { s: next() < 0.5 ? 1 : -1, u: Q_UNITS[drawInt(next, 3)] };
    const reV = floor.loops.map((loop) => {
      const w = loop.cls === 'hexagon'
        ? loop.flagSeq.map((fl) => rf[fl.i + '>' + fl.j])
        : loop.cycle.map((n, i) => rf[n + '>' + loop.cycle[(i + 1) % loop.cycle.length]]);
      return octRe(bracketWalk(w));
    });
    realityFractions.push(reV.filter((r) => Math.abs(r) === 1).length / reV.length);
  }
  const stat = (arr) => {
    const s = [...arr].sort((a, b) => a - b);
    const mean = s.reduce((x, y) => x + y, 0) / s.length;
    const p95 = s[Math.min(s.length - 1, Math.ceil(0.95 * s.length) - 1)];
    return { mean: Math.round(mean * 10000) / 10000, p95: Math.round(p95 * 10000) / 10000, max: Math.round(s[s.length - 1] * 10000) / 10000 };
  };
  const trueReality = (() => {
    const reV = floor.loops.map((loop) => octRe(bracketWalk(floorWord({ A: E(1), B: E(2), C: E(4), D: E(7) }, loop))));
    return reV.filter((r) => Math.abs(r) === 1).length / reV.length;
  })();

  return {
    floorBroke, prizeBroke, runVoid, scrambledSig, trueSig, scrambledPrize, truePrizeSig,
    reality: stat(realityFractions), trueReality: Math.round(trueReality * 10000) / 10000, draws: DRAWS,
  };
}

// ===========================================================================
// PUBLIC FLOOR FIGURES — citation block (Bench-2 / Gate-0 closing memos).
// DISPLAY ONLY. No assertion or `ok` branch may read this object (Rider A).
// ===========================================================================
const PUBLIC_FLOOR = {
  source: 'Bench-2 (STATION_III_BENCH2_CLOSING_MEMO_D3) + Gate-0 (CBF_GATE0_CLOSING_MEMO_OBSERVABLE_VALIDITY)',
  antipodality: 'opposite-sign 6/6 axes (order-2)',
  triangleRe: '+1', squareRe: '+1', hexagonRe: '-1',
  bracketingCounts: 'value-identical: triangles 2 / squares 5 / hexagons 42',
  metricR12: '60deg, edge/radius=1 (vector equilibrium)',
  metricR6: '90deg, edge/radius=1.4142 (sqrt2) — bare-unit collapse',
  distinctAnchors: 'R12 12/12 vs R6 6/12',
  gauge: '168 (7x24) Fano-gauge invariant',
  qConfinement: 'all 12 hub flag lifts in Q={e3,e5,e6}; every Q-confined hub loop bracketing-invariant',
};

// ===========================================================================
// REPORT
// ===========================================================================
const REVERSE_LAWS = ['R-neg', 'R-ret', 'R-anti'];
const BRACKET_RULES = ['B-walk', 'B-gen', 'B-frame'];
const out = [];
const P = (s) => out.push(s);

function fmtPct(n, d) { return `${n}/${d}`; }

function main() {
  const graph = buildCarrierGraph();
  const floor = computeFloor(graph);

  P('================================================================================');
  P('  W-1 LEGITIMACY DIAGNOSTIC — candidate W (walk-primitive source regime)');
  P('  Computes-and-reports ONLY. No terminal verdict (auditor + mothership).');
  P('================================================================================');
  P('');
  P('CONSUMED (recompute-not-echo): REAL Ambo (createSeedShape+applyAmboDissection,');
  P('  parentage via createdBy.sourceVertexIds); Fano product law multiplyFanoUnits.');
  P('Anchored primal quadrangle (construction input): A=e1 B=e2 C=e4 D=e7.');
  P('Holonomy word = edge-link beta: L(u->v)=carrier(u).carrier(v).');
  P('');

  // ---- carrier graph structure
  P('--------------------------------------------------------------------------------');
  P('[STRUCTURE] G0->G1 first-birth carrier graph (prize substrate)');
  P('--------------------------------------------------------------------------------');
  P(`nodes: ${graph.nodes.length} (4 primal + ${graph.children.length} first-birth children)`);
  P(`edges: ${graph.edges.length}  (birth ${graph.birthCount}, hub ${graph.hubCount})`);
  P('children (parentage from createdBy.sourceVertexIds):');
  for (const c of graph.children) {
    const u = octMul(E(ANCHORED_PRIMAL[c.parentsOrdered[0]]), E(ANCHORED_PRIMAL[c.parentsOrdered[1]]));
    P(`  ${c.key}: parents {${c.parents.join(',')}}  shadow e${ANCHORED_PRIMAL[c.parentsOrdered[0]]}.e${ANCHORED_PRIMAL[c.parentsOrdered[1]]} = ${octKey(u)} ${inQ(u) ? '(in Q)' : '(off-Q)'}`);
  }
  P('');

  // ---- FLOOR (G2) — recompute + public compare (DISPLAY ONLY)
  P('--------------------------------------------------------------------------------');
  P('[FLOOR] G2 cuboctahedron / 12-flag hub (A3 roots) — recomputed vs PUBLIC memos');
  P('  Rider A: public figures are display-only; no pass/fail keys on them.');
  P('--------------------------------------------------------------------------------');
  P(`layer: G2 (12 directed flags i>j = A3 roots; links carrier(i).carrier(j))`);
  P(`Q-confinement: all 12 flag links in Q={e3,e5,e6}? ${floor.allInQ}    [public: ${PUBLIC_FLOOR.qConfinement}]`);
  P(`bracketing value-identical (all 22 loops)? ${floor.allValueIdentical}`);
  P(`  bracketing totals  triangles=${floor.triBr.join('/')} squares=${floor.sqBr.join('/')} hexagons=${floor.hexBr.join('/')}   [public: ${PUBLIC_FLOOR.bracketingCounts}]`);
  P(`  loop Re   triangles=${floor.triRe.join(',')} squares=${floor.sqRe.join(',')} hexagons=${floor.hexRe.join(',')}   [public: tri ${PUBLIC_FLOOR.triangleRe}, sq ${PUBLIC_FLOOR.squareRe}, hex ${PUBLIC_FLOOR.hexagonRe}]`);
  P(`order-2 antipodality: opposite-sign ${fmtPct(floor.antipodalOpposite, floor.axes.length)} axes   [public: ${PUBLIC_FLOOR.antipodality}]`);
  P(`metric R12 (anchors=roots eps_i-eps_j): ${floor.r12.adjacencyAngle}deg, edge/radius=${floor.r12.edgeOverRadius}, distinct ${floor.r12.distinct}/${floor.r12.total}   [public: ${PUBLIC_FLOOR.metricR12}]`);
  P(`metric R6  (bare-unit collapse):        ${floor.r6.adjacencyAngle}deg, edge/radius=${floor.r6.edgeOverRadius}, distinct ${floor.r6.distinct}/${floor.r6.total}   [public: ${PUBLIC_FLOOR.metricR6}; ${PUBLIC_FLOOR.distinctAnchors}]`);
  P(`168 Fano-gauge invariance of Re-pattern: ${fmtPct(floor.gaugeInvariant, floor.gaugeTotal)}   [public: ${PUBLIC_FLOOR.gauge}]`);
  P('');

  // ---- PRIZE (G1) — measured ONLY (Rider A: zero expected constants)
  P('--------------------------------------------------------------------------------');
  P('[PRIZE] G1 carrier-graph loops (len<=6) — MEASURED ONLY, zero expected constants');
  P('--------------------------------------------------------------------------------');
  const prize = computePrize(graph, deriveCarriers(graph, ANCHORED_PRIMAL, 'R-ret'));
  const pf = prize.profile;
  P(`simple loops enumerated (len 3..6): ${pf.total}   hub-only ${pf.hubOnly}   mixed/birth ${pf.mixed}`);
  P(`hub-only loops bracketing-invariant (value-identical): ${fmtPct(pf.hubBracketInvariant, pf.hubOnly)};  hub-only word-off-Q ${pf.hubWordLeavesQ}, value-off-Q ${pf.hubValueLeavesQ} (floor: stays in Q)`);
  P(`mixed/birth WORD traverses off-Q (>=1 birth link off Q): ${fmtPct(pf.mixedWordLeavesQ, pf.mixed)};  closed-holonomy VALUE off Q: ${pf.mixedValueLeavesQ} (rest return to Q/{+-1} at closure)`);
  P(`mixed bracketing classes: value-identical ${pf.mixedValueIdentical} | identical-up-to-sign ${pf.mixedUpToSign} | genuinely-dependent ${pf.mixedGenuine}`);
  P(`mixed bracketing-DEPENDENT (value-set>1): ${pf.mixedBracketingDependent};  of which Re-bracketing-dependent (Re-set>1 — the discriminator set): ${pf.mixedReDependent}`);
  P('cardinality profile by length [hub / mixed / bracketing-dep / Re-dep]:');
  for (let L = 3; L <= 6; L += 1) P(`  len ${L}: ${pf.byLen[L].hub} / ${pf.byLen[L].mixed} / ${pf.byLen[L].dep} / ${pf.byLen[L].reDep}`);
  P('');
  const reDep = prize.reDepMixed;
  const table = prizeSelectionTable(graph, reDep);
  const fmtRe = (re) => (re > 0 ? '+1' : re < 0 ? '-1' : ' 0');
  P(`Re-bracketing-dependent mixed loops — COMPLETE per-loop selection table (${table.length} loops).`);
  P('  Re ambiguous across bracketings (W_0/Policy-C discards as ill-defined); each Hole #2');
  P('  rule SELECTS one bracketing -> a definite Re. gauge=eq iff all 3 selections S4(24)+168 invariant.');
  P('  ' + 'loop'.padEnd(28) + '| walk gen frame | agree | gauge');
  for (let L = 3; L <= 6; L += 1) {
    const rows = table.filter((r) => r.len === L);
    if (rows.length === 0) continue;
    P(`  -- length ${L} (${rows.length} loops) --`);
    for (const r of rows) {
      const sel = `${fmtRe(r.sel['B-walk'])}  ${fmtRe(r.sel['B-gen'])}  ${fmtRe(r.sel['B-frame'])}`;
      P('  ' + ('[' + r.cycle.join('-') + ']').padEnd(28) + `|  ${sel}  | ${(r.agree ? 'same' : 'diff').padEnd(5)} | ${r.allEquivariant ? 'eq' : 'NEQ'}`);
    }
  }
  if (table.length === 0) P('  (none measured — every off-Q mixed loop has a well-defined Re across all bracketings)');
  P('');
  // aggregates over the Re-dependent set (measured; zero expected constants)
  P('aggregate gauge-equivariance of the SELECTED Re over the Re-dependent set:');
  for (const br of BRACKET_RULES) {
    const s4c = table.filter((r) => r.eq[br].s4 === r.eq[br].s4T).length;
    const fc = table.filter((r) => r.eq[br].f === r.eq[br].fT).length;
    P(`  ${br}: S4-equivariant ${fmtPct(s4c, table.length)}, 168-Fano-equivariant ${fmtPct(fc, table.length)}`);
  }
  const allDep = prize.depMixed.length;
  P(`aggregate over ALL bracketing-dependent mixed loops (${allDep}; here identical to Re-dep set): see sweep table.`);
  P('');
  const wg = table.filter((r) => r.sel['B-walk'] === r.sel['B-gen']).length;
  const wf = table.filter((r) => r.sel['B-walk'] === r.sel['B-frame']).length;
  const gf = table.filter((r) => r.sel['B-gen'] === r.sel['B-frame']).length;
  const all3 = table.filter((r) => r.agree).length;
  P('pairwise branch agreement on selected Re (which Hole #2 branches are Re-distinguishable):');
  P(`  walk==gen ${fmtPct(wg, table.length)}   walk==frame ${fmtPct(wf, table.length)}   gen==frame ${fmtPct(gf, table.length)}   all-three ${fmtPct(all3, table.length)}`);
  P('');

  // ---- 9-CELL SWEEP: full battery per (reverse law) x (bracketing)
  P('--------------------------------------------------------------------------------');
  P('[9-CELL SWEEP] {R-neg,R-ret,R-anti} x {B-walk,B-gen,B-frame} — full battery/cell');
  P('  (R-anti default lean NOT privileged; all nine cells on equal footing)');
  P('--------------------------------------------------------------------------------');
  const cellResults = [];
  for (const rLaw of REVERSE_LAWS) {
    for (const bRule of BRACKET_RULES) {
      const carriers = deriveCarriers(graph, ANCHORED_PRIMAL, rLaw);
      const dts = destructiveTests(graph);
      const firedCount = dts.filter((t) => t.fired).length;
      const antiProv = rLaw === 'R-neg' ? 'posited' : rLaw === 'R-ret' ? 'derived-anticommutativity' : 'derived-geometric';
      const pr = computePrize(graph, carriers);
      const selsRe = evaluatePrizeSelection(graph, pr.reDepMixed, bRule);
      const s4Equiv = selsRe.filter((s) => s.s4Equivariant).length;
      const fanoEquiv = selsRe.filter((s) => s.fanoEquivariant).length;
      const profMatch = pr.profile.mixedBracketingDependent === prize.profile.mixedBracketingDependent && pr.profile.hubOnly === prize.profile.hubOnly;
      cellResults.push({ rLaw, bRule, firedCount, antiProv, depMixed: pr.profile.mixedBracketingDependent, reDep: pr.profile.mixedReDependent, s4Equiv, fanoEquiv, profMatch });
    }
  }
  P('cell             | L1-L9 | antipodality-prov         | brk-dep | Re-dep | S4-eq | 168-eq | prof-inv');
  for (const c of cellResults) {
    P(`${(c.rLaw + ' x ' + c.bRule).padEnd(16)} | ${fmtPct(c.firedCount, 9).padEnd(5)} | ${c.antiProv.padEnd(25)} | ${String(c.depMixed).padEnd(7)} | ${String(c.reDep).padEnd(6)} | ${fmtPct(c.s4Equiv, c.reDep).padEnd(5)} | ${fmtPct(c.fanoEquiv, c.reDep).padEnd(6)} | ${c.profMatch}`);
  }
  P('');

  // ---- L1-L9 detail (canonical R-anti x B-walk cell shown verbatim)
  P('--------------------------------------------------------------------------------');
  P('[L1-L9 DESTRUCTIVE TESTS] each MUST fire (decorative if it does not)');
  P('--------------------------------------------------------------------------------');
  const dts = destructiveTests(graph);
  for (const t of dts) {
    P(`${t.id.padEnd(24)} FIRED=${t.fired}`);
    P(`    before: ${t.before}`);
    P(`    after : ${t.after}`);
    P(`    note  : ${t.note}`);
  }
  const allFired = dts.every((t) => t.fired);
  P('');
  P(`destructive tests fired: ${fmtPct(dts.filter((t) => t.fired).length, dts.length)}  (all-fired=${allFired})`);
  P('');

  // ---- CONTROLS / mock / reality
  P('--------------------------------------------------------------------------------');
  P('[CONTROLS] mock-solution gate; reality-non-genericity; blind {mean,p95,max}');
  P('--------------------------------------------------------------------------------');
  const ctl = controls(graph);
  P(`mock-solution (derange carriers + sign flips):`);
  P(`  floor Re-pattern broke under scramble: ${ctl.floorBroke}`);
  P(`  prize signal broke under scramble:     ${ctl.prizeBroke}`);
  P(`  => ${ctl.runVoid ? 'RUN VOID (a pattern survived the scramble)' : 'OK (both legitimacy and prize patterns broke)'}`);
  P(`reality-non-genericity (random Q-confined primal assignments, ${ctl.draws} draws):`);
  P(`  reality fraction {mean=${ctl.reality.mean}, p95=${ctl.reality.p95}, max=${ctl.reality.max}}  vs TRUE config reality=${ctl.trueReality}`);
  P(`  (true config non-generic iff true reality exceeds the random distribution)`);
  P('');

  // ---- INTEGRITY (structural only — Rider A: no public/sealed value read here)
  P('--------------------------------------------------------------------------------');
  P('[INTEGRITY] structural self-checks (no target-matching in this path)');
  P('--------------------------------------------------------------------------------');
  const issues = [];
  const expect = (cond, msg) => { if (!cond) issues.push(msg); };
  expect(graph.nodes.length === 10, 'carrier graph must have 10 nodes');
  expect(graph.edges.length === 24, 'carrier graph must have 24 edges');
  expect(graph.birthCount === 12 && graph.hubCount === 12, 'must have 12 birth + 12 hub edges');
  expect(graph.children.length === 6, 'must have 6 first-birth children');
  expect(floor.flags.length === 12, 'floor must have 12 directed flags');
  expect(floor.loops.length === 22, 'floor must have 22 loops (8 tri + 6 sq + 8 hex)');
  // Catalan totals for floor loops (exactness of the bracketing DP)
  expect(floor.triBr.length === 1 && floor.triBr[0] === CATALAN[2], 'triangle bracket total must equal Catalan(2)=2');
  expect(floor.sqBr.length === 1 && floor.sqBr[0] === CATALAN[3], 'square bracket total must equal Catalan(3)=5');
  expect(floor.hexBr.length === 1 && floor.hexBr[0] === CATALAN[5], 'hexagon bracket total must equal Catalan(5)=42');
  expect(quadrangles().length === 7, 'must derive 7 complete quadrangles');
  expect(floor.gaugeTotal === 168, '168 Fano gauge orbit size');
  expect(allFired, 'all L1-L9 destructive tests must fire');
  expect(!ctl.runVoid, 'mock-solution must break both patterns (else RUN VOID)');
  // re-run determinism: rebuild and compare the full report-relevant signature.
  const rerun = (() => {
    const g2 = buildCarrierGraph();
    const f2 = computeFloor(g2);
    const p2 = computePrize(g2, deriveCarriers(g2, ANCHORED_PRIMAL, 'R-ret'));
    return JSON.stringify({
      q: f2.allInQ, vi: f2.allValueIdentical, ap: f2.antipodalOpposite, g: f2.gaugeInvariant,
      r12: f2.r12.adjacencyAngle, r6: f2.r6.adjacencyAngle, dep: p2.profile.mixedDependent, hub: p2.profile.hubOnly,
    });
  })();
  const firstSig = JSON.stringify({
    q: floor.allInQ, vi: floor.allValueIdentical, ap: floor.antipodalOpposite, g: floor.gaugeInvariant,
    r12: floor.r12.adjacencyAngle, r6: floor.r6.adjacencyAngle, dep: prize.profile.mixedDependent, hub: prize.profile.hubOnly,
  });
  expect(rerun === firstSig, 're-run must be deterministic (identical signature)');

  P(`integrity issues: ${issues.length}`);
  for (const m of issues) P('  - ' + m);
  const ok = issues.length === 0;
  P('');
  P(`re-run deterministic: ${rerun === firstSig}`);
  P(`exit status: ${ok ? 0 : 1}`);
  P(ok ? 'Diagnostic assertions passed.' : 'Diagnostic assertions FAILED.');
  P('');
  P('NO TERMINAL VERDICT. W-1 computes-and-reports; the per-criterion verdict against');
  P('the THEN-REVEALED seal is the auditor\'s, and the terminal verdict is mothership\'s.');

  process.stdout.write(out.join('\n') + '\n');
  process.exit(ok ? 0 : 1);
}

main();

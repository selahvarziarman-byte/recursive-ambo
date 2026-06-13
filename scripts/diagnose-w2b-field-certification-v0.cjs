#!/usr/bin/env node
/*
 * W-2.B BLIND FIELD-CERTIFICATION BATTERY
 * =======================================
 * Tests whether the W-2.A reduction R* (the Z2 / sign loop-holonomy field) lets a
 * LABEL-BLIND observer RECOVER OR MEDIATE the W-1 prize (the gauge-equivariant
 * selected Re on the 280 off-Q bracketing-dependent loops of the G1 carrier graph),
 * beating ALL controls incl. bare-geometry, sign included, without label leakage.
 *
 * Computes-and-reports ONLY. Declares NO terminal verdict (auditor at W-2.C +
 * mothership). Blind by construction: the sealed prediction is OFF-REPO and is never
 * fetched, pasted, regenerated, or reconstructed.
 *
 * Repo identity: C:\Dev\202cl\PlatonicEngine202, branch team-arman. arf* = read-only.
 *
 * REQUIREMENT: docs/governance/PLATONIC_ENGINE_W2B_BLIND_CERTIFICATION_REQUIREMENT.md
 * MODEL CARD:  docs/governance/PLATONIC_ENGINE_W2A_MODEL_CARD_FIELD_REDUCTION.md
 * AUDIT C1-C5: docs/governance/PLATONIC_ENGINE_W2A_MODEL_CARD_MOTHERSHIP_AUDIT.md
 *
 * BINDING DISCIPLINE (in code):
 *  - Rider A: the scorer hard-codes NO expected recovery rate / obstruction count /
 *    residual size / margin / verdict. Every quantity is COMPUTED-AND-REPORTED.
 *  - §2 MANIFEST: emit edge transports + loop-holonomies O(L) ONLY, keyed by numeric
 *    index; NEVER a carrier unit, signed lift, root id, flag id, provenance token, or
 *    per-source coefficient. Recursive leak scan (>=11 patterns) over every emitted
 *    string/key, ZERO exemptions; a hit VOIDS the affected cell by code.
 *  - C1 (§3.6): strip/scramble carriers, RECOMPUTE transports -> MUST be unchanged
 *    (label-free-derived); if they move with carriers -> VOID.
 *  - C2 (reachable falsifier): the three PASS quantities — GF(2) CONSISTENT, field
 *    g>=0.90, field beats bare-geometry by a margin — are all measured & representable,
 *    so a supporting reality WOULD yield PASS. Not hard-coded.
 *  - C3 (§3.2): Rec(O) and the bare-geometry control use the IDENTICAL recovery
 *    procedure + supervision regime (BOTH UNSUPERVISED, direct: prediction = sign of a
 *    per-loop oriented scalar); the ONLY difference is the input scalar.
 *  - FIELD BAR: score r (incidence) and g (sign) SEPARATELY; g>=0.90 required to count
 *    as field (unsigned geometry is not the field — the W_0/orientation lesson).
 *  - MOCK (§3.7): scramble the source-state; the recovery pattern MUST break, else VOID.
 *
 * PINNED CONSTRUCTION (lieutenant audit, this session):
 *  - R* transport = geometric ORIENTATION cochain (zero carriers): hub edges oriented by
 *    the octahedron positive-face-class boundary (R-anti geometric rule); birth edges by
 *    radius (primal r=sqrt3 -> child r=1). O(L) = product of directed-step signs
 *    (+1 if a step matches its edge's canonical orientation, -1 if opposed).
 *  - Recovery (C3): BOTH UNSUPERVISED, direct. prediction = sign(oriented per-loop
 *    scalar); field scalar = O(L), bare-geometry scalar = chirality (sign of
 *    Newell-normal . centroid). r = pairwise co-classification (flip-invariant);
 *    g = signed accuracy (flip-sensitive).
 *  - Strict control = a random flat Z2 field (random per-edge canonical orientation).
 *  - SUBSTRATE: prize on the G1 (10-node) carrier graph, recomputed from the REAL Ambo
 *    + the repo Fano product law; 280 off-Q Re-bracketing-dependent loops; per Hole #2
 *    branch B-walk/B-gen/B-frame.
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

// ===========================================================================
// 0. Octonion algebra on the repo Fano product LAW (recompute, not echo).
// ===========================================================================
function octMul(a, b) {
  if (a.u === 0) return { s: a.s * b.s, u: b.u };
  if (b.u === 0) return { s: a.s * b.s, u: a.u };
  if (a.u === b.u) return { s: -a.s * b.s, u: 0 };
  const p = multiplyFanoUnits('e' + a.u, 'e' + b.u);
  return { s: a.s * b.s * (p.sign === '+' ? 1 : -1), u: Number(p.productUnit.slice(1)) };
}
const octRe = (a) => (a.u === 0 ? a.s : 0);
const octIndex = (a) => a.u * 2 + (a.s === 1 ? 0 : 1);
const octFromIndex = (i) => ({ s: i % 2 === 0 ? 1 : -1, u: Math.floor(i / 2) });
const E = (u) => ({ s: 1, u });
const Q_UNITS = [3, 5, 6];
const inQ = (a) => a.u === 0 || Q_UNITS.includes(a.u);
const ANCHORED_PRIMAL = { A: 1, B: 2, C: 4, D: 7 };
const PRIMAL4 = ['A', 'B', 'C', 'D'];

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
const SEED = 20260613;
const stat = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  const mean = s.reduce((x, y) => x + y, 0) / s.length;
  const p95 = s[Math.min(s.length - 1, Math.ceil(0.95 * s.length) - 1)];
  return { mean: round4(mean), p95: round4(p95), max: round4(s[s.length - 1]) };
};
const round4 = (x) => Math.round(x * 10000) / 10000;

// ===========================================================================
// 2. Rebuild the G1 carrier graph from the REAL Ambo (parentage via createdBy).
// ===========================================================================
function buildGraph() {
  const tetra = createSeedShape('tetrahedron');
  if (!canApplyAmboDissection(tetra)) throw new Error('Ambo not applicable to tetra seed.');
  const g1 = applyAmboDissection(tetra);
  const primalVerts = Object.values(g1.vertices).filter((v) => v.createdBy.operation === 'seed');
  const labelById = {};
  for (const v of primalVerts) labelById[v.id] = v.data.label;
  const primal = primalVerts.map((v) => v.data.label).sort();
  const core = g1.cells.find((c) => c.kind === 'core');
  const children = core.vertexIds.map((id) => {
    const v = g1.vertices[id];
    const parents = v.createdBy.sourceVertexIds.map((pid) => labelById[pid]);
    return { id, key: [...parents].sort().join(''), parentsOrdered: parents, parents: [...parents].sort(), pos: v.position };
  });
  const childByKey = Object.fromEntries(children.map((c) => [c.key, c]));
  const primalPos = Object.fromEntries(primalVerts.map((v) => [v.data.label, v.position]));

  const edges = [];
  for (const c of children) for (const p of c.parents) edges.push({ a: p, b: c.key, type: 'birth' });
  for (let i = 0; i < children.length; i += 1)
    for (let j = i + 1; j < children.length; j += 1) {
      const shared = children[i].parents.filter((p) => children[j].parents.includes(p));
      if (shared.length === 1) edges.push({ a: children[i].key, b: children[j].key, type: 'hub' });
    }
  const nodes = [...primal, ...children.map((c) => c.key)];
  const nodeIndex = Object.fromEntries(nodes.map((n, i) => [n, i]));
  const adjacency = new Map(nodes.map((n) => [n, []]));
  const edgeType = new Map();
  const edgeKeyOf = (x, y) => [x, y].sort().join('|');
  const edgeIndex = {};
  edges.forEach((e, i) => {
    adjacency.get(e.a).push(e.b);
    adjacency.get(e.b).push(e.a);
    edgeType.set(edgeKeyOf(e.a, e.b), e.type);
    edgeIndex[edgeKeyOf(e.a, e.b)] = i;
  });
  const isChild = (n) => n.length === 2;
  const posOf = (n) => (isChild(n) ? childByKey[n].pos : primalPos[n]);
  return {
    primal, children, childByKey, nodes, nodeIndex, edges, adjacency, edgeType, edgeKeyOf,
    edgeIndex, isChild, posOf,
    birthCount: edges.filter((e) => e.type === 'birth').length,
    hubCount: edges.filter((e) => e.type === 'hub').length,
  };
}

// carriers per Hole #1 reverse law (prize target uses R-ret, matching W-1 public figures)
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
  for (const ax of ordered) { sign[ax.positive] = 1; sign[ax.negative] = -1; }
  return sign;
}
function deriveCarriers(graph, primalUnits) {
  const carrier = {};
  for (const lbl of graph.primal) carrier[lbl] = E(primalUnits[lbl]);
  for (const c of graph.children) carrier[c.key] = octMul(carrier[c.parentsOrdered[0]], carrier[c.parentsOrdered[1]]);
  return carrier;
}

// ===========================================================================
// 3. Loops + the W-1 prize: 280 off-Q Re-bracketing-dependent loops + selected Re
//    per Hole #2 branch (recomputed from atoms; the recovery TARGET, not an input).
// ===========================================================================
function loopLinks(carrier, cycle) {
  const out = [];
  for (let i = 0; i < cycle.length; i += 1) out.push(octMul(carrier[cycle[i]], carrier[cycle[(i + 1) % cycle.length]]));
  return out;
}
function bracketingValueSet(word) {
  const n = word.length;
  const dp = [];
  for (let i = 0; i < n; i += 1) {
    dp.push([]);
    for (let j = 0; j < n; j += 1) dp[i].push(new Map());
    dp[i][i].set(octIndex(word[i]), 1);
  }
  for (let span = 2; span <= n; span += 1)
    for (let i = 0; i + span - 1 < n; i += 1) {
      const j = i + span - 1, cell = dp[i][j];
      for (let k = i; k < j; k += 1)
        for (const [li] of dp[i][k]) for (const [ri] of dp[k + 1][j]) {
          const pi = octIndex(octMul(octFromIndex(li), octFromIndex(ri)));
          cell.set(pi, (cell.get(pi) || 0) + 1);
        }
    }
  const values = [...dp[0][n - 1].keys()].map(octFromIndex);
  const reSet = [...new Set(values.map(octRe))].sort((a, b) => a - b);
  return { values, reSet, distinctCount: values.length };
}
function bracketWalk(words) {
  let acc = words[words.length - 1];
  for (let i = words.length - 2; i >= 0; i -= 1) acc = octMul(words[i], acc);
  return acc;
}
function bracketGen(graph, cycle, words) {
  let items = words.map((w) => ({ val: w }));
  let meet = [];
  for (let i = 0; i < items.length - 1; i += 1) meet.push(cycle[(i + 1) % cycle.length]);
  while (true) {
    const gi = meet.findIndex((m) => graph.isChild(m));
    if (gi === -1) break;
    items.splice(gi, 2, { val: octMul(items[gi].val, items[gi + 1].val) });
    meet.splice(gi, 1);
  }
  let acc = items[0].val;
  for (let i = 1; i < items.length; i += 1) acc = octMul(acc, items[i].val);
  return acc;
}
function stepAngle(graph, fromN, toN) {
  const eps = (lbl) => PRIMAL4.map((p) => (p === lbl ? 1 : 0));
  const coord = (n) => {
    if (!graph.isChild(n)) return eps(n);
    const c = graph.childByKey[n], a = eps(c.parents[0]), b = eps(c.parents[1]);
    return a.map((x, k) => (x + b[k]) / 2);
  };
  const v = coord(toN).map((x, k) => x - coord(fromN)[k]);
  return Math.atan2(v[1] - v[3], v[0] - v[2]);
}
function bracketFrame(rootOfLink, cycle, words) {
  let items = words.map((w, i) => ({ val: w, ang: rootOfLink[i] }));
  while (items.length > 1) {
    let best = 0, bestGap = Infinity;
    for (let i = 0; i < items.length - 1; i += 1) {
      let d = Math.abs(items[i].ang - items[i + 1].ang);
      d = Math.min(d, 2 * Math.PI - d);
      if (d < bestGap - 1e-12) { bestGap = d; best = i; }
    }
    items.splice(best, 2, { val: octMul(items[best].val, items[best + 1].val), ang: items[best].ang });
  }
  return items[0].val;
}
function enumerateSimpleLoops(graph, maxLen) {
  const found = new Map();
  for (const start of graph.nodes) {
    const stack = [[start, [start], new Set([start])]];
    while (stack.length) {
      const [cur, pathArr, visited] = stack.pop();
      for (const nxt of graph.adjacency.get(cur)) {
        if (nxt === start && pathArr.length >= 3) {
          const key = canonCycle(pathArr);
          if (!found.has(key)) found.set(key, [...pathArr]);
          continue;
        }
        if (visited.has(nxt) || pathArr.length >= maxLen) continue;
        const nv = new Set(visited); nv.add(nxt);
        stack.push([nxt, [...pathArr, nxt], nv]);
      }
    }
  }
  return [...found.values()];
}
function canonCycle(cycle) {
  const L = cycle.length, variants = [];
  for (let r = 0; r < L; r += 1) variants.push(cycle.slice(r).concat(cycle.slice(0, r)).join(','));
  const rev = [...cycle].reverse();
  for (let r = 0; r < L; r += 1) variants.push(rev.slice(r).concat(rev.slice(0, r)).join(','));
  return variants.sort()[0];
}
function loopEdgeTypes(graph, cycle) {
  const t = [];
  for (let i = 0; i < cycle.length; i += 1) t.push(graph.edgeType.get(graph.edgeKeyOf(cycle[i], cycle[(i + 1) % cycle.length])));
  return t;
}
const BRANCHES = ['B-walk', 'B-gen', 'B-frame'];
function selectedRe(graph, carrier, cycle, branch) {
  const words = loopLinks(carrier, cycle);
  if (branch === 'B-walk') return octRe(bracketWalk(words));
  if (branch === 'B-gen') return octRe(bracketGen(graph, cycle, words));
  const ang = cycle.map((n, i) => stepAngle(graph, n, cycle[(i + 1) % cycle.length]));
  return octRe(bracketFrame(ang, cycle, words));
}
// the 280 off-Q Re-bracketing-dependent loops (mixed AND reSet>1), with prize Re per branch
function buildPrize(graph, primalUnits) {
  const carrier = deriveCarriers(graph, primalUnits);
  const all = enumerateSimpleLoops(graph, 6);
  const prizeLoops = [];
  for (const cycle of all) {
    const types = loopEdgeTypes(graph, cycle);
    if (!types.includes('birth')) continue; // mixed only
    const vs = bracketingValueSet(loopLinks(carrier, cycle));
    if (vs.reSet.length <= 1) continue; // Re-bracketing-dependent only
    const re = {};
    for (const br of BRANCHES) re[br] = selectedRe(graph, carrier, cycle, br);
    prizeLoops.push({ cycle, len: cycle.length, types, re });
  }
  return prizeLoops;
}

// ===========================================================================
// 4. R* — the geometric ORIENTATION cochain (zero carriers; C1-safe).
//    canonical edge orientation: hub = octahedron positive-face-class boundary;
//    birth = radius (primal -> child). O(L) = product of directed-step signs.
// ===========================================================================
function deriveTransports(graph, sourceState) {
  // sourceState carries carriers etc. but THIS function reads only geometry
  // (positions, antipodal pairing, chirality). C1 scrambles sourceState.carriers
  // and asserts the output is unchanged.
  void sourceState; // explicitly unused — label-free by construction
  const poleSign = geometricPoleSign(graph);
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const radius = (p) => Math.sqrt(dot(p, p));

  // octahedron faces of the 6 children: one child per axis (8 octant triples)
  const byAxisSign = {};
  for (const c of graph.children) {
    const axis = c.pos.findIndex((x) => Math.abs(x) > 1e-9);
    const sgn = c.pos[axis] > 0 ? '+' : '-';
    byAxisSign[`${axis}${sgn}`] = c.key;
  }
  const faces = [];
  for (const sx of ['+', '-']) for (const sy of ['+', '-']) for (const sz of ['+', '-'])
    faces.push([byAxisSign[`0${sx}`], byAxisSign[`1${sy}`], byAxisSign[`2${sz}`]]);

  // outward cycle + positive-class membership per face
  const faceRecords = faces.map((f) => {
    const ps = f.map((k) => graph.childByKey[k].pos);
    let normal = [0, 0, 0];
    for (let i = 0; i < ps.length; i += 1) normal = add(normal, cross(ps[i], ps[(i + 1) % ps.length]));
    const centroid = ps.reduce((acc, p) => add(acc, p), [0, 0, 0]).map((x) => x / ps.length);
    const cycle = dot(normal, centroid) >= 0 ? f : [...f].reverse();
    const signProduct = f.reduce((acc, k) => acc * poleSign[k], 1);
    return { cycle, faceClass: signProduct > 0 ? 'positive' : 'negative' };
  });

  // canonical orientation per edge
  const canonical = {}; // edgeKey -> [from, to]
  const issues = [];
  for (const e of graph.edges) {
    if (e.type === 'birth') {
      const pr = radius(graph.posOf(e.a)) > radius(graph.posOf(e.b)) ? e.a : e.b; // primal r=sqrt3
      const ch = pr === e.a ? e.b : e.a;
      canonical[graph.edgeKeyOf(e.a, e.b)] = [pr, ch];
    } else {
      const incident = faceRecords.filter((fr) => fr.cycle.includes(e.a) && fr.cycle.includes(e.b));
      const pos = incident.filter((fr) => fr.faceClass === 'positive');
      if (pos.length !== 1) { issues.push(`hub edge ${e.a}|${e.b} has ${pos.length} positive-class faces`); }
      const fr = pos[0] || incident[0];
      let dir = null;
      const cyc = fr.cycle;
      for (let i = 0; i < cyc.length; i += 1) {
        const u = cyc[i], v = cyc[(i + 1) % cyc.length];
        if ((u === e.a && v === e.b)) { dir = [e.a, e.b]; break; }
        if ((u === e.b && v === e.a)) { dir = [e.b, e.a]; break; }
      }
      canonical[graph.edgeKeyOf(e.a, e.b)] = dir || [e.a, e.b];
    }
  }
  // transport sign per directed step, encoded per edge index for the manifest:
  // transport[edgeIndex] = +1 if canonical goes lower-nodeIndex -> higher, else -1.
  const transportByEdgeIndex = graph.edges.map((e) => {
    const [from, to] = canonical[graph.edgeKeyOf(e.a, e.b)];
    return graph.nodeIndex[from] < graph.nodeIndex[to] ? 1 : -1;
  });
  return { canonical, transportByEdgeIndex, issues };
}
function fieldHolonomy(graph, canonical, cycle) {
  let prod = 1;
  for (let i = 0; i < cycle.length; i += 1) {
    const a = cycle[i], b = cycle[(i + 1) % cycle.length];
    const [from] = canonical[graph.edgeKeyOf(a, b)];
    prod *= a === from ? 1 : -1; // +1 if step matches canonical orientation
  }
  return prod;
}
// random flat Z2 field (strict control): random canonical orientation per edge
function randomFieldHolonomy(graph, randDir, cycle) {
  let prod = 1;
  for (let i = 0; i < cycle.length; i += 1) {
    const a = cycle[i], b = cycle[(i + 1) % cycle.length];
    const [from] = randDir[graph.edgeKeyOf(a, b)];
    prod *= a === from ? 1 : -1;
  }
  return prod;
}

// ===========================================================================
// 5. Bare-geometry oriented invariant (chirality) + unsigned features.
// ===========================================================================
function chirality(graph, cycle) {
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const ps = cycle.map((n) => graph.posOf(n));
  let normal = [0, 0, 0];
  for (let i = 0; i < ps.length; i += 1) {
    const c = cross(ps[i], ps[(i + 1) % ps.length]);
    normal = [normal[0] + c[0], normal[1] + c[1], normal[2] + c[2]];
  }
  const centroid = ps.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0]).map((x) => x / ps.length);
  const d = dot(normal, centroid);
  return d > 1e-9 ? 1 : d < -1e-9 ? -1 : 1; // oriented +-1 (degenerate -> +1)
}

// ===========================================================================
// 6. Recovery scoring: r (pairwise incidence, flip-invariant) and g (signed).
// ===========================================================================
function scoreRG(prediction, target) {
  const n = prediction.length;
  let gCount = 0;
  for (let i = 0; i < n; i += 1) if (prediction[i] === target[i]) gCount += 1;
  const g = gCount / n;
  // pairwise co-classification (incidence): fraction of pairs that agree on same/diff
  let pairAgree = 0, pairs = 0;
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) {
    pairs += 1;
    if ((prediction[i] === prediction[j]) === (target[i] === target[j])) pairAgree += 1;
  }
  const r = pairs ? pairAgree / pairs : 1;
  return { r: round4(r), g: round4(g) };
}

// ===========================================================================
// 7. GF(2) abelian-representability: solvable? + obstruction dimension.
// ===========================================================================
function gf2RankAug(matrix, rhs) {
  // matrix: rows of bit-arrays (length = #edges); rhs: bit per row. Returns
  // { rank, rankAug } via Gaussian elimination over GF(2).
  const rows = matrix.map((row, i) => ({ bits: row.slice(), b: rhs[i] }));
  const cols = matrix[0] ? matrix[0].length : 0;
  let rank = 0, rankAug = 0;
  // rank of [M | b]
  const augRows = rows.map((r) => r.bits.concat([r.b]));
  rankAug = gf2Rank(augRows);
  // rank of M
  const mRows = rows.map((r) => r.bits.slice());
  rank = gf2Rank(mRows);
  void cols;
  return { rank, rankAug, consistent: rank === rankAug, obstructionDim: rankAug - rank };
}
function gf2Rank(rowsIn) {
  const rows = rowsIn.map((r) => r.slice());
  const m = rows.length, n = rows[0] ? rows[0].length : 0;
  let rank = 0;
  for (let col = 0; col < n && rank < m; col += 1) {
    let pivot = -1;
    for (let i = rank; i < m; i += 1) if (rows[i][col]) { pivot = i; break; }
    if (pivot === -1) continue;
    [rows[rank], rows[pivot]] = [rows[pivot], rows[rank]];
    for (let i = 0; i < m; i += 1) if (i !== rank && rows[i][col]) for (let c = col; c < n; c += 1) rows[i][c] ^= rows[rank][c];
    rank += 1;
  }
  return rank;
}

// ===========================================================================
// 8. Manifest leak scan: >=11 patterns over every emitted string/key. Zero
//    exemptions; a hit voids the cell. Self-tested against a planted leak.
// ===========================================================================
const LEAK_PATTERNS = [
  /e[1-7]\b/i, /carrier/i, /signed.?lift|(^|[^a-z])lift/i, /\broot\b|epsilon|eps_/i,
  /\bflag\b/i, /provenance/i, /sourcevertex|createdby/i, /[+-]e[0-7]/i,
  /quadrangle/i, /octonion|moufang/i, /\bvertex:/i, /\b[ABCD]\b(?!-)/, /fano/i,
];
function leakScan(obj) {
  const hits = [];
  const visit = (value, keyPath) => {
    if (value === null || value === undefined) return;
    if (typeof value === 'string') {
      for (const p of LEAK_PATTERNS) if (p.test(value)) hits.push(`${keyPath}="${value}" ~ ${p}`);
      return;
    }
    if (typeof value === 'number' || typeof value === 'boolean') return;
    if (Array.isArray(value)) { value.forEach((v, i) => visit(v, `${keyPath}[${i}]`)); return; }
    for (const k of Object.keys(value)) {
      for (const p of LEAK_PATTERNS) if (p.test(k)) hits.push(`key ${keyPath}.${k} ~ ${p}`);
      visit(value[k], `${keyPath}.${k}`);
    }
  };
  visit(obj, '$');
  return hits;
}

// ===========================================================================
// MAIN
// ===========================================================================
const out = [];
const P = (s) => out.push(s);
const fmtPct = (n, d) => `${n}/${d}`;

function main() {
  const graph = buildGraph();
  const carrierTrue = deriveCarriers(graph, ANCHORED_PRIMAL);
  const prize = buildPrize(graph, ANCHORED_PRIMAL);
  const N = prize.length;
  const cycles = prize.map((p) => p.cycle);

  // R* field transports + holonomies (label-free)
  const sourceStateTrue = { carriers: carrierTrue, note: 'true source-state' };
  const { canonical, transportByEdgeIndex, issues: transportIssues } = deriveTransports(graph, sourceStateTrue);
  const O = cycles.map((c) => fieldHolonomy(graph, canonical, c));
  const chir = cycles.map((c) => chirality(graph, c));

  // ---- §2 MANIFEST: emit transports + O(L) ONLY, numeric-keyed; leak-scan ----
  const emittedField = {
    transportByEdgeIndex,                       // 24 numbers in {-1,1}
    holonomyByLoopIndex: O.slice(),             // N numbers in {-1,1}
  };
  const emittedBareGeo = {
    orientedScalarByLoopIndex: chir.slice(),    // N numbers in {-1,1}
    positionByNodeIndex: graph.nodes.map((n) => graph.posOf(n)), // geometry only
  };
  const fieldLeaks = leakScan(emittedField);
  const bareLeaks = leakScan(emittedBareGeo);
  // self-test: the scanner MUST fire on a planted leak (non-vacuous)
  const plantedLeak = { carrierUnit: 'e3', flagId: 'A->B', signedLift: '+e5' };
  const scannerFires = leakScan(plantedLeak).length > 0;

  // ---- recovery: prediction = sign(oriented scalar); per branch target ----
  const targetByBranch = {};
  for (const br of BRANCHES) targetByBranch[br] = prize.map((p) => p.re[br]);

  const rng = mulberry32(SEED);
  const DRAWS = 128;

  function ladderForBranch(br) {
    const target = targetByBranch[br];
    // field
    const field = scoreRG(O, target);
    // bare-geometry (oriented chirality) — identical procedure, only input differs (C3)
    const bare = scoreRG(chir, target);
    // trivial-null: random +-1 predictions
    const tnR = [], tnG = [];
    for (let d = 0; d < DRAWS; d += 1) {
      const pred = target.map(() => (rng() < 0.5 ? 1 : -1));
      const s = scoreRG(pred, target); tnR.push(s.r); tnG.push(s.g);
    }
    // structured-permutation: field O permuted across loops
    const spR = [], spG = [];
    for (let d = 0; d < DRAWS; d += 1) {
      const perm = O.slice();
      for (let i = perm.length - 1; i > 0; i -= 1) { const j = Math.floor(rng() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
      const s = scoreRG(perm, target); spR.push(s.r); spG.push(s.g);
    }
    // strict: random flat Z2 field (random per-edge canonical orientation)
    const stR = [], stG = [];
    for (let d = 0; d < DRAWS; d += 1) {
      const randDir = {};
      for (const e of graph.edges) { const k = graph.edgeKeyOf(e.a, e.b); randDir[k] = rng() < 0.5 ? [e.a, e.b] : [e.b, e.a]; }
      const pred = cycles.map((c) => randomFieldHolonomy(graph, randDir, c));
      const s = scoreRG(pred, target); stR.push(s.r); stG.push(s.g);
    }
    return {
      field, bare,
      trivialNull: { r: stat(tnR), g: stat(tnG) },
      structuredPerm: { r: stat(spR), g: stat(spG) },
      strict: { r: stat(stR), g: stat(stG) },
      marginG: round4(field.g - bare.g),
    };
  }
  const ladder = {};
  for (const br of BRANCHES) ladder[br] = ladderForBranch(br);

  // ---- §3.3 GF(2) abelian-representability per branch ----
  const incidence = cycles.map((c) => {
    const row = new Array(graph.edges.length).fill(0);
    for (let i = 0; i < c.length; i += 1) row[graph.edgeIndex[graph.edgeKeyOf(c[i], c[(i + 1) % c.length])]] = 1;
    return row;
  });
  const gf2 = {};
  for (const br of BRANCHES) {
    const rhs = targetByBranch[br].map((re) => (re === -1 ? 1 : 0));
    gf2[br] = gf2RankAug(incidence, rhs);
  }

  // ---- §3.4 residual: loops mispredicted by BOTH bare-geometry AND field ----
  const residual = {};
  for (const br of BRANCHES) {
    const target = targetByBranch[br];
    const idx = [];
    for (let i = 0; i < N; i += 1) if (O[i] !== target[i] && chir[i] !== target[i]) idx.push(i);
    const byLen = {};
    for (const i of idx) byLen[prize[i].len] = (byLen[prize[i].len] || 0) + 1;
    residual[br] = { size: idx.length, byLen };
  }

  // ---- §3.6 C1 destructive: scramble carriers, recompute transports, unchanged? ----
  const scrambleRng = mulberry32(SEED ^ 0x9e3779b9);
  const scrambledCarrier = {};
  for (const lbl of graph.primal) scrambledCarrier[lbl] = { s: scrambleRng() < 0.5 ? 1 : -1, u: 1 + Math.floor(scrambleRng() * 7) };
  for (const c of graph.children) scrambledCarrier[c.key] = octMul(scrambledCarrier[c.parentsOrdered[0]], scrambledCarrier[c.parentsOrdered[1]]);
  const scrambledSource = { carriers: scrambledCarrier, note: 'carriers scrambled' };
  const t2 = deriveTransports(graph, scrambledSource);
  const transportsUnchanged = JSON.stringify(t2.transportByEdgeIndex) === JSON.stringify(transportByEdgeIndex);
  const c1Void = !transportsUnchanged;

  // ---- §3.7 mock: scramble source-state -> prize changes -> pattern must break ----
  const mockRng = mulberry32(SEED ^ 0x5bd1e995);
  const mockUnits = {};
  for (const lbl of graph.primal) mockUnits[lbl] = 1 + Math.floor(mockRng() * 7); // non-gauge scramble
  const mockPrize = buildPrize(graph, mockUnits);
  // align mock prize to the same cycles where present; recompute field correctness on shared cycles
  const mockTargetByCycle = new Map(mockPrize.map((p) => [canonCycle(p.cycle), p.re['B-walk']]));
  let mockComparable = 0, mockChanged = 0;
  const trueCorrect = [];
  for (let i = 0; i < N; i += 1) {
    const key = canonCycle(cycles[i]);
    if (!mockTargetByCycle.has(key)) continue;
    mockComparable += 1;
    const trueOk = O[i] === targetByBranch['B-walk'][i];
    const mockOk = O[i] === mockTargetByCycle.get(key);
    trueCorrect.push(trueOk);
    if (trueOk !== mockOk) mockChanged += 1;
  }
  const mockBroke = mockChanged > 0;
  const mockVoid = !mockBroke;

  // ===========================================================================
  // REPORT (§6) — raw values only; NO verdict.
  // ===========================================================================
  P('================================================================================');
  P('  W-2.B BLIND FIELD-CERTIFICATION — R* (Z2 sign loop-holonomy field)');
  P('  Computes-and-reports ONLY. NO terminal verdict (auditor at W-2.C + mothership).');
  P('================================================================================');
  P('');
  P(`GATE: path=C:\\Dev\\202cl\\PlatonicEngine202  branch=team-arman  (arf*=read-only)`);
  P('CONSUMED (recompute-not-echo): REAL Ambo (createSeedShape+applyAmboDissection,');
  P('  parentage via createdBy.sourceVertexIds); Fano product law multiplyFanoUnits.');
  P('TARGET = W-1 prize: gauge-equivariant selected Re on the off-Q bracketing-dependent loops.');
  P('R* transport = geometric ORIENTATION cochain (hub=positive-face-class, birth=radius); zero carriers.');
  P('Recovery (C3): BOTH UNSUPERVISED, direct; prediction=sign(oriented per-loop scalar).');
  P('');
  P('--------------------------------------------------------------------------------');
  P('[SUBSTRATE] G1 carrier graph + prize loop set');
  P('--------------------------------------------------------------------------------');
  P(`nodes ${graph.nodes.length} (4 primal + 6 children); edges ${graph.edges.length} (birth ${graph.birthCount}, hub ${graph.hubCount})`);
  P(`prize loops (off-Q, Re-bracketing-dependent): ${N}`);
  P(`transport-derivation issues: ${transportIssues.length}${transportIssues.length ? ' -> ' + transportIssues.join('; ') : ''}`);
  P('');
  P('--------------------------------------------------------------------------------');
  P('[§2 MANIFEST + LEAK SCAN]  emit edge transports + O(L) ONLY (numeric-keyed)');
  P('--------------------------------------------------------------------------------');
  P(`leak-scan patterns: ${LEAK_PATTERNS.length} (>=11 required)`);
  P(`scanner self-test fires on planted leak: ${scannerFires}`);
  P(`emitted FIELD object leak hits: ${fieldLeaks.length}${fieldLeaks.length ? ' -> ' + fieldLeaks.join('; ') : ' (clean)'}`);
  P(`emitted BARE-GEO object leak hits: ${bareLeaks.length}${bareLeaks.length ? ' -> ' + bareLeaks.join('; ') : ' (clean)'}`);
  P('');
  P('--------------------------------------------------------------------------------');
  P('[§3.1-3.2 RECOVERY + CONTROL LADDER]  r (incidence) and g (sign) SEPARATE; g>=0.90 field bar');
  P('  ladder: trivial-null < structured-permutation < strict < BARE-GEOMETRY < field');
  P('  controls show {mean,p95,max} over ' + DRAWS + ' seeded draws.');
  P('--------------------------------------------------------------------------------');
  for (const br of BRANCHES) {
    const L = ladder[br];
    P(`branch ${br}:`);
    P(`  FIELD Rec(O)          r=${L.field.r}  g=${L.field.g}        (g>=0.90 ? ${L.field.g >= 0.9})`);
    P(`  BARE-GEOMETRY (chir)  r=${L.bare.r}  g=${L.bare.g}`);
    P(`  field margin over bare-geometry (g): ${L.marginG}`);
    P(`  strict (rand flat Z2) r{mean=${L.strict.r.mean},p95=${L.strict.r.p95},max=${L.strict.r.max}} g{mean=${L.strict.g.mean},p95=${L.strict.g.p95},max=${L.strict.g.max}}`);
    P(`  structured-perm       r{mean=${L.structuredPerm.r.mean},p95=${L.structuredPerm.r.p95},max=${L.structuredPerm.r.max}} g{mean=${L.structuredPerm.g.mean},p95=${L.structuredPerm.g.p95},max=${L.structuredPerm.g.max}}`);
    P(`  trivial-null          r{mean=${L.trivialNull.r.mean},p95=${L.trivialNull.r.p95},max=${L.trivialNull.r.max}} g{mean=${L.trivialNull.g.mean},p95=${L.trivialNull.g.p95},max=${L.trivialNull.g.max}}`);
  }
  P('');
  P('--------------------------------------------------------------------------------');
  P('[§3.3 GF(2) ABELIAN-REPRESENTABILITY]  is the prize the holonomy of ANY Z2 field?');
  P('--------------------------------------------------------------------------------');
  for (const br of BRANCHES) {
    const G = gf2[br];
    P(`  ${br}: consistent=${G.consistent}  rank(M)=${G.rank}  rank([M|b])=${G.rankAug}  obstruction-dim=${G.obstructionDim}`);
  }
  P('');
  P('--------------------------------------------------------------------------------');
  P('[§3.4 RESIDUAL]  loops recovered by NEITHER bare-geometry NOR R*');
  P('--------------------------------------------------------------------------------');
  for (const br of BRANCHES) P(`  ${br}: size=${residual[br].size}  by-length=${JSON.stringify(residual[br].byLen)}`);
  P('');
  P('--------------------------------------------------------------------------------');
  P('[§3.5 BRANCH-SELECTION SWEEP]  uniquely field-recoverable branch?');
  P('--------------------------------------------------------------------------------');
  P('  branch    | field-g | bare-g | margin-g | field-g>=0.90 & margin>0 & GF2-consistent');
  for (const br of BRANCHES) {
    const L = ladder[br], G = gf2[br];
    const reachPass = L.field.g >= 0.9 && L.marginG > 0 && G.consistent;
    P(`  ${br.padEnd(8)} | ${String(L.field.g).padEnd(7)} | ${String(L.bare.g).padEnd(6)} | ${String(L.marginG).padEnd(8)} | ${reachPass}`);
  }
  P('');
  P('--------------------------------------------------------------------------------');
  P('[§3.6 C1 TRANSPORT-DERIVATION DESTRUCTIVE TEST]  scramble carriers -> recompute transports');
  P('--------------------------------------------------------------------------------');
  P(`  test fired: true   transports-unchanged: ${transportsUnchanged}   -> ${c1Void ? 'VOID (transports moved with carriers = staple)' : 'OK (label-free-derived)'}`);
  P('');
  P('--------------------------------------------------------------------------------');
  P('[§3.7 MOCK-SOLUTION]  scramble source-state -> prize changes -> recovery pattern must break');
  P('--------------------------------------------------------------------------------');
  P(`  comparable loops: ${mockComparable}  correctness-pattern changed on: ${mockChanged}  -> ${mockVoid ? 'VOID (pattern survived scramble)' : 'OK (pattern broke)'}`);
  P('');
  P('--------------------------------------------------------------------------------');
  P('[C2 REACHABLE FALSIFIER]  PASS = GF(2)-consistent AND field-g>=0.90 AND margin>0 (per branch)');
  P('  measured & representable so a supporting reality WOULD yield PASS (not hard-coded).');
  P('--------------------------------------------------------------------------------');
  for (const br of BRANCHES) {
    const L = ladder[br], G = gf2[br];
    P(`  ${br}: GF2-consistent=${G.consistent}  field-g=${L.field.g}  margin=${L.marginG}  conjunction=${G.consistent && L.field.g >= 0.9 && L.marginG > 0}`);
  }
  P('');

  // ---- INTEGRITY ----
  P('--------------------------------------------------------------------------------');
  P('[INTEGRITY] structural self-checks (no target-matching path)');
  P('--------------------------------------------------------------------------------');
  const integrity = [];
  const expect = (cond, msg) => { if (!cond) integrity.push(msg); };
  expect(graph.nodes.length === 10, 'graph must have 10 nodes');
  expect(graph.edges.length === 24 && graph.birthCount === 12 && graph.hubCount === 12, 'graph must have 12 birth + 12 hub edges');
  expect(N > 0, 'prize loop set must be non-empty');
  expect(LEAK_PATTERNS.length >= 11, 'leak scan must have >=11 patterns');
  expect(scannerFires, 'leak scanner must fire on a planted leak (non-vacuous)');
  expect(fieldLeaks.length === 0 && bareLeaks.length === 0, 'emitted objects must be leak-free');
  expect(transportIssues.length === 0, 'transport derivation must be well-defined (every hub edge one positive-class face)');
  expect(!c1Void, 'C1: transports must be unchanged under carrier scramble (else VOID)');
  expect(!mockVoid, 'MOCK: recovery pattern must break under source-state scramble (else VOID)');
  // re-run determinism (recompute the report-relevant signature)
  const rerunSig = (() => {
    const g2 = buildGraph();
    const p2 = buildPrize(g2, ANCHORED_PRIMAL);
    const { canonical: can2 } = deriveTransports(g2, { carriers: deriveCarriers(g2, ANCHORED_PRIMAL) });
    const O2 = p2.map((p) => fieldHolonomy(g2, can2, p.cycle));
    const tgt = p2.map((p) => p.re['B-walk']);
    return JSON.stringify({ n: p2.length, g: scoreRG(O2, tgt).g, gf2: gf2RankAug(p2.map((p) => {
      const row = new Array(g2.edges.length).fill(0);
      for (let i = 0; i < p.cycle.length; i += 1) row[g2.edgeIndex[g2.edgeKeyOf(p.cycle[i], p.cycle[(i + 1) % p.cycle.length])]] = 1;
      return row;
    }), tgt.map((re) => (re === -1 ? 1 : 0))).consistent });
  })();
  const firstSig = JSON.stringify({ n: N, g: ladder['B-walk'].field.g, gf2: gf2['B-walk'].consistent });
  const deterministic = rerunSig === firstSig;
  expect(deterministic, 're-run must be deterministic');

  P(`integrity issues: ${integrity.length}`);
  for (const m of integrity) P('  - ' + m);
  const ok = integrity.length === 0;
  P('');
  P(`re-run deterministic: ${deterministic}`);
  P(`exit status: ${ok ? 0 : 1}`);
  P(ok ? 'Diagnostic assertions passed.' : 'Diagnostic assertions FAILED.');
  P('');
  P('NO TERMINAL VERDICT. W-2.B computes-and-reports; the auditor derives per-criterion');
  P('status against the THEN-REVEALED seal at W-2.C, and mothership disposes W-2 PASS /');
  P('W-2 FAIL / VOID. Field bar: g>=0.90 sign-included, beating ALL controls incl. bare-geometry.');

  process.stdout.write(out.join('\n') + '\n');
  process.exit(ok ? 0 : 1);
}

main();

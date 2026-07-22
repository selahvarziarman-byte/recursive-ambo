#!/usr/bin/env node

// DIAGNOSTIC — P2: assemble-of-borns WITH D3-enactment + the connectedSum
// macro. BUILT BLIND to `.handoff/SEAL_CONNECTSUM_P2.md` — every expected
// value below is the BUILDER'S OWN emitted concrete, measured off the enacted
// engine; the engineer unseals and audits these pins against the seal.
//
//   §a THE ENACTMENT FIRES — connectedSum(T², T²) on ≥2-face torus reps → the
//      genus-2 surface: {V:28, E:60, F:30}, χ = −2 (explicit AND certified),
//      CONNECTED (b₀ = 1), CLOSED (0 free edges), the committed gate reads
//      every edge-class INTERIOR (2 face-wedges) and every vertex link ONE
//      circle (decomposeLink 'interior'), certifier: b₁ = 4, orientable,
//      classification "genus 2 (closed, orientable)".
//   §b THE D3 CONTRAST — the pre-glue union is NOT the same surface, and χ /
//      F / b₁ CANNOT tell them apart (they coincide: −2 / 30 / 4). The
//      invariants that separate them: CONNECTIVITY (b₀ 2 vs 1), BOUNDARY
//      (8 free rim edges vs 0), and b₂ (0 vs 1). That is the discovery.
//   §c EXCEPTIONS — the minimal single-face torus refuses with the
//      subdivide-first path (never cut the only face); a rim with PARALLEL
//      edge instances refuses (endpoint-keyed seam honesty); mismatched rims
//      refuse; id collisions refuse. The REVERSING mode: measured, BOTH modes
//      yield the ORIENTABLE genus-2 — gluing two orientable pieces along a
//      circle cannot create a crosscap (the seam always has an annulus
//      neighbourhood); the mode changes the seam's matching sense only. The
//      certifier is the arbiter and it reads w₁ = 0 both ways.
//   §d THE MACRO IS cutCell + cutCell + the enacted assemble — byte-compared
//      against running the committed ops directly. No new primitive.
//   §e the enacted v0 assemble (two squares, one seam edge): the child IS the
//      quotient — χ = 1 (V6−E7+F2), explicit === certified.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        esModuleInterop: true,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
      fileName: filename,
    }).outputText,
    filename,
  );
};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { assemble, loadForm } = req('src/lib/multiform.ts');
const { connectedSum } = req('src/lib/connectedSum.ts');
const { cutCell } = req('src/lib/cutOperation.ts');
const { materializeCutResult } = req('src/lib/materializeOperation.ts');
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { serializeSnapshot, deserializeSnapshot } = req('src/playground/snapshot.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');
const { decomposeLink } = req('src/lib/incidenceTraceRegistry.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { executeCustomGlue } = req('src/playground/customGluing.ts');
const { canonicalAssembleIdentification } = req('src/playground/playgroundOperations.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const PAIR = (a, b, m) => ({ edgeA: a, edgeB: b, mode: m });
const ekey = (u, v) => (u < v ? `${u} ${v}` : `${v} ${u}`);

// the discriminator instruments (§4 of the mandate — added FOR the ratification)
function measure(shape) {
  const V = Object.keys(shape.vertices).length;
  const E = shape.edges.length;
  const F = shape.faces.length;
  const chi = V - E + F;
  // b0: union-find over the 1-skeleton
  const parent = new Map();
  const find = (x) => {
    if (!parent.has(x)) parent.set(x, x);
    let r = x;
    while (parent.get(r) !== r) r = parent.get(r);
    let c = x;
    while (parent.get(c) !== r) { const n = parent.get(c); parent.set(c, r); c = n; }
    return r;
  };
  for (const v of Object.keys(shape.vertices)) find(v);
  for (const e of shape.edges) parent.set(find(e.vertexIds[0]), find(e.vertexIds[1]));
  const b0 = new Set(Object.keys(shape.vertices).map((v) => find(v))).size;
  // per-edge-class face-wedge counts (free = <2, interior = 2, junction = >2)
  const sides = new Map();
  for (const f of shape.faces) {
    const c = f.vertexIds;
    for (let k = 0; k < c.length; k += 1) {
      const kk = ekey(c[k], c[(k + 1) % c.length]);
      sides.set(kk, (sides.get(kk) ?? 0) + 1);
    }
  }
  let free = 0, interior = 0, junction = 0;
  for (const e of shape.edges) {
    const s = sides.get(ekey(e.vertexIds[0], e.vertexIds[1])) ?? 0;
    if (s < 2) free += 1;
    else if (s === 2) interior += 1;
    else junction += 1;
  }
  return { V, E, F, chi, b0, free, interior, junction };
}

// the committed GATE at every vertex: link adjacency → decomposeLink
function vertexGateVerdicts(shape) {
  const verdicts = new Map();
  for (const v of Object.keys(shape.vertices)) {
    const adjacency = new Map();
    const push = (a, b) => {
      if (!adjacency.has(a)) adjacency.set(a, []);
      adjacency.get(a).push(b);
    };
    for (const f of shape.faces) {
      const c = f.vertexIds;
      for (let k = 0; k < c.length; k += 1) {
        if (c[k] !== v) continue;
        const inEnd = ekey(c[(k - 1 + c.length) % c.length], v);
        const outEnd = ekey(v, c[(k + 1) % c.length]);
        push(inEnd, outEnd);
        push(outEnd, inEnd);
      }
    }
    verdicts.set(v, decomposeLink(adjacency).valence);
  }
  return verdicts;
}

console.log('P2 connectedSum: the enacted assemble + the macro — blind concretes\n');

// ===== the ≥2-face torus reps (committed immersion + the committed loader) ====
const t1 = deserializeSnapshot(serializeSnapshot(immerseSurface({ surface: 'torus', resolution: 4 }).shape, 'csA')).shape;
const t2 = deserializeSnapshot(serializeSnapshot(immerseSurface({ surface: 'torus', resolution: 4 }).shape, 'csB')).shape;
const t1Bytes = JSON.stringify(t1);
const t2Bytes = JSON.stringify(t2);
const mT = measure(t1);
check('fixture: each torus rep is a closed connected χ=0 complex with 16 faces (a face to spare)',
  eq(measure(t1), { V: 16, E: 32, F: 16, chi: 0, b0: 1, free: 0, interior: 32, junction: 0 }) && eq(measure(t2), mT));

// ===== [a] the enactment fires: T² # T² = the genus-2 =========================
console.log('\n----- [a] connectedSum(T², T²) → the genus-2 surface (my emitted concretes) -----');
const cs = connectedSum(t1, t2, { mode: 'preserving' });
const m = measure(cs.shape);
check('§a {V, E, F} = {28, 60, 30} and χ = −2 — the two punctured tori sewn along ONE enacted seam (4 seam classes de-duplicated)',
  eq(m, { V: 28, E: 60, F: 30, chi: -2, b0: 1, free: 0, interior: 60, junction: 0 }));
check('§a CONNECTED: b₀ = 1 (one component — the enactment joined the pieces)', m.b0 === 1);
check('§a CLOSED: 0 free edges (every rim edge became an interior seam class)', m.free === 0);
check('§a the GATE (edge level): every one of the 60 edge-classes carries exactly 2 face-wedges — interior everywhere', m.interior === 60 && m.junction === 0);
const gate = vertexGateVerdicts(cs.shape);
check("§a the GATE (committed decomposeLink at every vertex): all 28 links are single circles — 'interior', manifold everywhere",
  gate.size === 28 && [...gate.values()].every((v) => v === 'interior'));
const inv = readFormInvariants(cs.shape);
check('§a the committed certifier agrees: χ certified −2, b₁ = 4, orientable, and the classifier NAMES it: "genus 2 (closed, orientable)"',
  inv.chiCertified === -2 && inv.cert.b1 === 4 && inv.cert.nonOrientable === false &&
  inv.boundary === 'closed' && inv.classification === 'genus 2 (closed, orientable)');
note(`emitted: {V:${m.V}, E:${m.E}, F:${m.F}} χ=${m.chi} b₀=${m.b0} free=${m.free} gate=interior×${m.interior} · cert: b₁=${inv.cert.b1}, ${inv.classification}`);
check('§a derive-only: both source tori are byte-identical after the sum',
  JSON.stringify(t1) === t1Bytes && JSON.stringify(t2) === t2Bytes);

// ===== [b] the D3 contrast: the pre-glue union ================================
console.log('\n----- [b] the pre-glue union vs the enacted quotient — what separates them -----');
const union = {
  ...cs.shape,
  vertices: { ...cs.puncturedA.vertices, ...cs.puncturedB.vertices },
  edges: [...cs.puncturedA.edges, ...cs.puncturedB.edges],
  faces: [...cs.puncturedA.faces, ...cs.puncturedB.faces],
};
const mu = measure(union);
const b1Of = (shape) => readFormInvariants(shape).cert?.b1 ?? null;
const unionB1 = b1Of(cs.puncturedA) + b1Of(cs.puncturedB);
check('§b THE DISCOVERY: χ and F COINCIDE (−2 = −2; 30 = 30) — they cannot distinguish the union from the quotient',
  mu.chi === m.chi && mu.F === m.F);
check('§b b₁ COINCIDES too: the union carries 2+2 = 4 and the genus-2 carries 4',
  unionB1 === 4 && inv.cert.b1 === 4);
check('§b what separates them — CONNECTIVITY: the union is TWO components, the quotient is ONE',
  mu.b0 === 2 && m.b0 === 1);
check('§b what separates them — BOUNDARY: the union has 8 free rim edges (bounded), the quotient has 0 (closed)',
  mu.free === 8 && m.free === 0);
const b2 = (mm, b1) => mm.chi - mm.b0 + b1; // χ = b0 − b1 + b2
check('§b what separates them — b₂: the union has 0 (no closed sheet), the quotient has 1 (one fundamental class)',
  b2(mu, unionB1) === 0 && b2(m, inv.cert.b1) === 1);
note(`union: b₀=${mu.b0}, free=${mu.free}, b₂=${b2(mu, unionB1)} · quotient: b₀=${m.b0}, free=${m.free}, b₂=${b2(m, inv.cert.b1)} — χ/F/b₁ identical (${m.chi}/${m.F}/4)`);

// ===== [c] exceptions + the mode, measured ====================================
console.log('\n----- [c] exceptions (refusals with the path) + the orientation mode, measured -----');
const sqT = loadForm(nGon(4), 'p2m');
const minimalTorus = executeCustomGlue(sqT, sqT.faces[0], [PAIR(0, 2, 'preserving'), PAIR(1, 3, 'preserving')]);
let singleFaceRefused = false;
try {
  connectedSum(minimalTorus, t2, {});
} catch (error) {
  singleFaceRefused = /single face/.test(String(error.message)) && /Subdivide first/.test(String(error.message)) && /ADR 0018/.test(String(error.message));
}
check('§c the minimal single-face torus (V1 E2 F1) REFUSES with the subdivide-first path (ADR 0018) — never cut the only face', singleFaceRefused);
// parallel rim instances: fixture-inject a duplicate rim edge and expect the honest refusal
const tDup = JSON.parse(t1Bytes);
tDup.edges = [...tDup.edges, { ...tDup.edges.find((e) => {
  const c = tDup.faces[0].vertexIds;
  return (e.vertexIds[0] === c[0] && e.vertexIds[1] === c[1]) || (e.vertexIds[0] === c[1] && e.vertexIds[1] === c[0]);
}), id: 'p2:duplicate-rim-edge' }];
let parallelRefused = false;
try {
  connectedSum(tDup, t2, {});
} catch (error) {
  parallelRefused = /two rim-edges between the same pair of corners/.test(String(error.message)); // R5: the designer's door
}
check('§c a rim carrying PARALLEL edge instances REFUSES — the person\'s door: the seam can\'t tell which joins to which, pick a different face (R5)', parallelRefused);
// mismatched rims: cut faces of unequal cycle length
const t2b = deserializeSnapshot(serializeSnapshot(immerseSurface({ surface: 'torus', resolution: 4 }).shape, 'csC')).shape;
const fakePentagonFace = { ...t2b.faces[0], vertexIds: [...t2b.faces[0].vertexIds, Object.keys(t2b.vertices)[9]] };
let mismatchRefused = false;
try {
  connectedSum(t1, t2b, { faceB: fakePentagonFace });
} catch (error) {
  mismatchRefused = /rims of different lengths — 4 edges and 5\./.test(String(error.message)); // R5: the designer's door
}
check('§c mismatched rims (4 vs 5) REFUSE with the subdivide-to-equalize reason — never silently mis-matched', mismatchRefused);
// id collisions: two loads of one source under DIFFERENT names are now fully
// disjoint (the P2 loader completion) — craft a collision to prove the guard
let collisionRefused = false;
try {
  assemble([t1, JSON.parse(t1Bytes)], { merges: [{ resultId: 'x*', sources: [Object.keys(t1.vertices)[0], Object.keys(t1.vertices)[1]] }] });
} catch (error) {
  collisionRefused = /id collision/.test(String(error.message));
}
check('§c the enacted assemble FAIL-LOUDS on any cross-form id collision (vertex/edge/face — the completed disjointness guard)', collisionRefused);
// the mode, measured: BOTH senses give the orientable genus-2 (a circle seam
// between two pieces always has an annulus neighbourhood — no crosscap is
// possible from orientable inputs; the certifier is the arbiter).
// Mothership-ratified scope (2026-07-10): this inertness is LEVEL-2-SCOPED —
// beyond w₁ it rides on every closed surface admitting an orientation-
// reversing self-homeomorphism (a 2-D theorem). The mode parameter is
// RETAINED: at level-3 the seam is an S² and the mode is the MIRROR choice,
// load-bearing on chiral summands (L(5,1)#L(5,1) ≇ L(5,1)#L(5,4)).
const csR = connectedSum(t1, t2, { mode: 'reversing' });
const mR = measure(csR.shape);
const invR = readFormInvariants(csR.shape);
check('§c the REVERSING mode, measured: the same closed connected χ=−2 manifold, and the certifier reads it ORIENTABLE too — "genus 2 (closed, orientable)" (no crosscap from a circle seam between orientable pieces)',
  eq(mR, m) && invR.cert.nonOrientable === false && invR.classification === 'genus 2 (closed, orientable)');
check('§c the two modes are DIFFERENT enacted seams (different merge lists), not one op twice',
  !eq(cs.seamMerges, csR.seamMerges));

// ===== [d] the macro composes the committed ops ===============================
console.log('\n----- [d] connectedSum = cutCell + cutCell + the enacted assemble (no new primitive) -----');
const directCutA = materializeCutResult(t1, cutCell(t1, t1.faces[0]));
const directCutB = materializeCutResult(t2, cutCell(t2, t2.faces[0]));
check('§d the punctured middles ARE the committed cut results, byte-identical',
  JSON.stringify(cs.puncturedA) === JSON.stringify(directCutA) &&
  JSON.stringify(cs.puncturedB) === JSON.stringify(directCutB));
const directAssembly = assemble([directCutA, directCutB], { merges: cs.seamMerges });
check('§d the sum IS the committed (enacted) assemble over those cuts with the matched-circle merge list, byte-identical',
  JSON.stringify(cs.shape) === JSON.stringify(directAssembly.shape));
check('§d the ledger is the committed multi-parent pull-back: every seam child descends to exactly its two rim parents',
  cs.seamMerges.every((mg) => eq([...directAssembly.ledger.pullBack[mg.resultId]].sort(), [...mg.sources].sort())));

// ===== [e] the enacted v0 assemble =============================================
console.log('\n----- [e] the enacted v0 assemble (the D3 fix at its smallest) -----');
const sqA = loadForm(nGon(4), 'p2a');
const sqB = loadForm(nGon(4), 'p2b');
const v0 = assemble([sqA, sqB], canonicalAssembleIdentification(sqA, sqB)).shape;
const mv0 = measure(v0);
const invV0 = readFormInvariants(v0);
check('§e two squares, one enacted seam: {V:6, E:7, F:2} → χ = 1 — the quotient, with faces REWRITTEN through the children and the seam edge de-duplicated',
  eq(mv0, { V: 6, E: 7, F: 2, chi: 1, b0: 1, free: 6, interior: 1, junction: 0 }) &&
  v0.faces.every((f) => f.vertexIds.some((id) => id.startsWith('asm:'))));
check('§e explicit === certified (χ 1 = 1) — the P3b assemble-child mismatch is resolved by the enactment',
  invV0.chi === 1 && invV0.chiCertified === 1);

console.log(
  failures === 0
    ? '\n--- P2 connectedSum (the enactment is real, and χ could never have proved it — b₀/boundary/b₂ did): no failures ---\n\nALL PASS'
    : `\n--- P2 connectedSum: ${failures} FAILURE(S) ---`,
);
process.exitCode = failures === 0 ? 0 : 1;

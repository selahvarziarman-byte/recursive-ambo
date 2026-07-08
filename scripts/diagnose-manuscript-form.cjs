#!/usr/bin/env node

// DIAGNOSTIC — Manuscript Phase 1: the faithful inked form (design ADR 0001).
//
// Structural acceptance over the REAL committed modules (anti-mock: transpile-
// hook require of the .ts sources): the generator loops the `?manuscript` view
// draws are DERIVED from the R0 `QuotientCorrespondence` (word + gridVertexTo),
// never hardcoded, and are drawn ONLY where a real generator exists —
//   · TORUS  (abAB): TWO loops (a, b), each a CLOSED cycle of real committed
//     edges, exactly the L2 identified edge-classes, provenance = the walked
//     boundary grid points;
//   · SPHERE (no word): ZERO loops — the null case (H₁ = 0; no fiction);
//   · RP²    (abab): ONE loop — the closed concatenation a·b (the ℤ/2
//     generator), while a and b are individually OPEN arcs (the L2 selectors'
//     own `closed:false` reading) — the cross-cap does not erase it;
//   · klein  (abaB): two closed loops (selector totality beyond the trio);
//   · cylinder / mobius (open): ZERO loops — the single glued letter is an arc
//     between distinct rim classes and free letters are never marks (their real
//     core-circle generator is NOT an identified-boundary curve — the honest gap
//     is noted, not painted over).
// Plus: the caption invariants are the COMMITTED certifiers' values verbatim
// (readFormInvariants → χ / w₁ certificate / b₁ / classification), and the H₁
// label is classification arithmetic on certified values, 𝔽₂-consistent with
// cert.b1. A word-blanking probe proves the selector reads the WORD, not the
// surface name. Run at R=8 and R=16 — lengths scale with the correspondence.

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

const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { selectIdentifiedLoops } = req('src/playground/identificationAnnotation.ts');
const { canonicalEdgeKey } = req('src/lib/ids.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');
const {
  buildInkedFormModel,
  deriveGeneratorLoops,
  h1LabelFromCertified,
} = req('src/manuscript/inkedFormModel.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);

const setEq = (x, y) => x.size === y.size && [...x].every((k) => y.has(k));
const loopEdgeKeys = (loop) => {
  const keys = new Set();
  for (let k = 0; k + 1 < loop.vertexPath.length; k += 1) {
    keys.add(canonicalEdgeKey(loop.vertexPath[k], loop.vertexPath[k + 1]));
  }
  return keys;
};

function shapeEdgeKeys(shape) {
  return new Set(shape.edges.map((e) => canonicalEdgeKey(e.vertexIds[0], e.vertexIds[1])));
}

function closedOnRealEdges(loop, shape) {
  const keys = shapeEdgeKeys(shape);
  if (loop.vertexPath[0] !== loop.vertexPath[loop.vertexPath.length - 1]) return false;
  for (let k = 0; k + 1 < loop.vertexPath.length; k += 1) {
    const u = loop.vertexPath[k];
    const v = loop.vertexPath[k + 1];
    if (u === v) return false;
    if (!keys.has(canonicalEdgeKey(u, v))) return false;
  }
  return true;
}

console.log('manuscript Phase 1: generator loops derived from the correspondence — drawn only where real\n');

for (const R of [8, 16]) {
  // ----- TORUS: two closed generators (a, b) --------------------------------
  {
    console.log(`----- [torus] R=${R} -----`);
    const model = buildInkedFormModel({ surface: 'torus', resolution: R });
    const { shape, correspondence } = model.immersion;
    const l2 = selectIdentifiedLoops(correspondence);
    check('§5 torus: exactly TWO generator loops', model.loops.length === 2);
    const [a, b] = model.loops;
    check('§5 torus: loop letters are a and b', a && b && a.label === 'a' && b.label === 'b');
    check('§5 torus: a is a CLOSED cycle of real committed edges', a && closedOnRealEdges(a, shape));
    check('§5 torus: b is a CLOSED cycle of real committed edges', b && closedOnRealEdges(b, shape));
    check(`§5 torus: path lengths scale with the correspondence (R+1 = ${R + 1})`,
      a && b && a.vertexPath.length === R + 1 && b.vertexPath.length === R + 1);
    const aProv = a && a.vertexPath.every((v, k) => v === correspondence.gridVertexTo[`${k},0`]);
    const bProv = b && b.vertexPath.every((v, k) => v === correspondence.gridVertexTo[`0,${k}`]);
    check('§5 torus: provenance — a walks gridVertexTo along the j=0 row, b along the i=0 column', Boolean(aProv && bProv));
    check('§5 torus: loop edges === the L2 identified a/b edge-classes exactly',
      a && b && setEq(loopEdgeKeys(a), new Set(l2.a.edges.map((e) => e.key))) &&
      setEq(loopEdgeKeys(b), new Set(l2.b.edges.map((e) => e.key))));
    check('§5 torus: L2 corroborates — letters a and b both read closed', l2.a.closed && l2.b.closed);
    const inv = model.invariants;
    check('§5 torus: certifier — χ=0 (measured AND certified), closed, direct complex',
      inv.chi === 0 && inv.chiCertified === 0 && inv.boundary === 'closed' && inv.complexSource === 'direct');
    check('§5 torus: certifier — orientable, b₁=2, w₁Class=[0,0]',
      Boolean(inv.cert && !inv.cert.nonOrientable && inv.cert.b1 === 2 && JSON.stringify(inv.cert.w1Class) === '[0,0]'));
    check('§5 torus: drawn loop count === certified b₁ (2 = dim H₁(T²;F₂))', inv.cert && model.loops.length === inv.cert.b1);
    check("§5 torus: caption H₁ = 'ℤ ⊕ ℤ' from certified (χ, orientability) arithmetic", model.h1Label === 'ℤ ⊕ ℤ');
    note(`a: ${a ? a.vertexPath.length : '?'} pts (${a ? a.vertexPath[0] : '?'} → … → ${a ? a.vertexPath[a.vertexPath.length - 1] : '?'}) | b: ${b ? b.vertexPath.length : '?'} pts | classification: ${inv.classification}`);
  }

  // ----- SPHERE: the null case — zero loops ---------------------------------
  {
    console.log(`----- [sphere] R=${R} -----`);
    const model = buildInkedFormModel({ surface: 'sphere', resolution: R });
    const inv = model.invariants;
    check('§5 sphere: NO gluing word on the correspondence', model.immersion.correspondence.word === '');
    check('§5 sphere: ZERO generator loops drawn (H₁=0 — no fiction)', model.loops.length === 0);
    check('§5 sphere: certifier — χ=2 (measured AND certified), closed, orientable, b₁=0',
      inv.chi === 2 && inv.chiCertified === 2 && inv.boundary === 'closed' &&
      Boolean(inv.cert && !inv.cert.nonOrientable && inv.cert.b1 === 0 && inv.cert.w1Class.length === 0));
    check("§5 sphere: caption H₁ = '0'", model.h1Label === '0');
    check('§5 sphere: drawn loop count === certified b₁ (0)', inv.cert && model.loops.length === inv.cert.b1);
    note(`classification: ${inv.classification}`);
  }

  // ----- RP²: the correction case — ONE closed a·b (ℤ/2) --------------------
  {
    console.log(`----- [rp2] R=${R} -----`);
    const model = buildInkedFormModel({ surface: 'rp2', resolution: R });
    const { shape, correspondence } = model.immersion;
    const l2 = selectIdentifiedLoops(correspondence);
    check('§5 rp2: exactly ONE generator loop (the ℤ/2 class — not erased)', model.loops.length === 1);
    const loop = model.loops[0];
    check("§5 rp2: the loop is the concatenation a·b (letters ['a','b'])",
      Boolean(loop && loop.label === 'a·b' && JSON.stringify(loop.letters) === '["a","b"]'));
    check('§5 rp2: a·b is a CLOSED cycle of real committed edges', loop && closedOnRealEdges(loop, shape));
    check(`§5 rp2: path length scales with the correspondence (2R+1 = ${2 * R + 1})`,
      loop && loop.vertexPath.length === 2 * R + 1);
    check('§5 rp2: HONESTY PIN — a and b are individually OPEN arcs (L2 closed:false both)',
      !l2.a.closed && !l2.b.closed);
    const aKeys = new Set(l2.a.edges.map((e) => e.key));
    const bKeys = new Set(l2.b.edges.map((e) => e.key));
    const union = new Set([...aKeys, ...bKeys]);
    check('§5 rp2: loop edges === the DISJOINT union of the L2 a-arc + b-arc classes',
      Boolean(loop && aKeys.size === R && bKeys.size === R && union.size === 2 * R &&
        setEq(loopEdgeKeys(loop), union)));
    const P = correspondence.gridVertexTo['0,0'];
    const Q = correspondence.gridVertexTo[`${R},0`];
    check('§5 rp2: the loop turns at the TWO corner classes (P=(0,0)~(R,R), Q=(R,0)~(0,R))',
      Boolean(loop && loop.vertexPath[0] === P && loop.vertexPath[R] === Q && P !== Q &&
        Q === correspondence.gridVertexTo[`0,${R}`] &&
        correspondence.vertexClasses[P].length === 2 && correspondence.vertexClasses[Q].length === 2));
    const inv = model.invariants;
    check('§5 rp2: certifier — χ=1 (measured AND certified), closed, direct complex',
      inv.chi === 1 && inv.chiCertified === 1 && inv.boundary === 'closed' && inv.complexSource === 'direct');
    check('§5 rp2: certifier — NON-orientable, b₁=1, w₁Class=[1]',
      Boolean(inv.cert && inv.cert.nonOrientable && inv.cert.b1 === 1 && JSON.stringify(inv.cert.w1Class) === '[1]'));
    check('§5 rp2: drawn loop count === certified b₁ (1 = dim H₁(RP²;F₂) — ℤ/2 consistent)',
      inv.cert && model.loops.length === inv.cert.b1);
    check("§5 rp2: caption H₁ = 'ℤ/2' from certified (χ, orientability) arithmetic", model.h1Label === 'ℤ/2');
    note(`a·b: ${loop ? loop.vertexPath.length : '?'} pts through P=${P}, Q=${Q} | classification: ${inv.classification}`);
  }
}

// ----- klein (totality beyond the trio): two closed generators --------------
{
  const R = 8;
  console.log(`----- [klein] R=${R} (totality) -----`);
  const model = buildInkedFormModel({ surface: 'klein', resolution: R });
  const { shape } = model.immersion;
  const inv = model.invariants;
  check('klein: TWO closed generator loops (a, b)',
    model.loops.length === 2 && model.loops.every((l) => closedOnRealEdges(l, shape)));
  check('klein: certifier — χ=0, NON-orientable, b₁=2, w₁Class=[0,1]',
    Boolean(inv.chi === 0 && inv.cert && inv.cert.nonOrientable && inv.cert.b1 === 2 &&
      JSON.stringify(inv.cert.w1Class) === '[0,1]'));
  check("klein: caption H₁ = 'ℤ ⊕ ℤ/2'", model.h1Label === 'ℤ ⊕ ℤ/2');
}

// ----- open surfaces: no identified closed generator → NONE drawn -----------
for (const surface of ['cylinder', 'mobius']) {
  const R = 8;
  console.log(`----- [${surface}] R=${R} (open — honest none) -----`);
  const model = buildInkedFormModel({ surface, resolution: R });
  const inv = model.invariants;
  check(`${surface}: ZERO loops (glued letter is an arc between distinct rim classes; free letters are never marks)`,
    model.loops.length === 0);
  check(`${surface}: boundary reads open → caption H₁ label honestly n-a`,
    inv.boundary === 'open' && model.h1Label === null);
  note(`the real core-circle generator (b₁=${inv.cert ? inv.cert.b1 : 'n-a'}) is NOT an identified-boundary curve — not drawable from this correspondence, so not drawn`);
}

// ----- the anti-hardcode probe: the selector reads the WORD ------------------
{
  console.log('----- [probe] word-blanking (derivation, not surface-name dispatch) -----');
  const { correspondence } = immerseSurface({ surface: 'torus', resolution: 8 });
  const blanked = { ...correspondence, word: '' };
  check('probe: torus correspondence with word blanked → ZERO loops (the selector derives from the word)',
    deriveGeneratorLoops(blanked).length === 0);
}

// ----- the caption chain: shown invariants ARE the certifiers' ---------------
{
  console.log('----- [caption] the shown invariants are the committed certifiers, verbatim -----');
  let verbatim = true;
  for (const surface of ['torus', 'sphere', 'rp2']) {
    const model = buildInkedFormModel({ surface, resolution: 16 });
    const fresh = readFormInvariants(model.immersion.shape);
    verbatim = verbatim &&
      model.invariants.chi === fresh.chi &&
      model.invariants.chiCertified === fresh.chiCertified &&
      model.invariants.classification === fresh.classification &&
      JSON.stringify(model.invariants.cert && model.invariants.cert.w1Class) ===
        JSON.stringify(fresh.cert && fresh.cert.w1Class) &&
      (model.invariants.cert && model.invariants.cert.b1) === (fresh.cert && fresh.cert.b1) &&
      model.h1Label === h1LabelFromCertified(fresh);
  }
  check('caption: model invariants + H₁ label === an independent readFormInvariants pass', verbatim);
}

console.log(
  failures === 0
    ? '\n--- manuscript form (§5 trio + totality + probes): no failures ---\n\nALL PASS'
    : `\n--- manuscript form: ${failures} FAILURE(S) ---`,
);
process.exitCode = failures === 0 ? 0 : 1;

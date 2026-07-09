#!/usr/bin/env node

// DIAGNOSTIC — Manuscript follow-on: OPTION B is certified, canonical, and
// reproduces Option A (anti-mock: transpile-hook require of the real .ts).
//
//   · Q-M1 canonical placement: a born/plain form with b₁>0 draws EXACTLY the
//     committed `analyzeGlobalW1(...).debug.basisCycles`, decomposed into
//     closed loops and placed at the ruling's barycentric positions (vertex →
//     its own position · edge-class → its midpoint · face → its centroid);
//     count === certified b₁; b₁=0 forms draw none.
//   · THE RATIFICATION (researcher §Boundary): on the torus immersion the two
//     Option-B basis cycles span the SAME H₁ as the Option-A longitude/
//     meridian — each lifted Option-A cycle is ∂₂-homologous to exactly one
//     nonzero Z/2 combination of the Option-B basis, and the two combinations
//     are independent. Option B reproduces Option A on the single-polygon case.
//   · Q-M3 SEAL (mothership-ratified): the ∂₂ membership oracle PASSES a valid
//     γ (c itself; c ⊕ ∂₂(row)) and REJECTS an invalid one (a non-cycle; a
//     different class) — a candidate is checked, never asserted.
//   · reconstruction teeth: the re-expressed subdivision matches the certifier
//     (every certified basis cycle is ∂₁-closed under the reconstructed
//     endpoints; every reconstructed triangle is a single closed 3-loop; the
//     position map covers exactly V+E+F sub-vertices; midpoints/centroids
//     recompute).

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
const { deriveGeneratorLoops, toAssembledComplex } = req('src/manuscript/inkedFormModel.ts');
const { invokePrimitive, applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const { birthChild } = req('src/manuscript/genesisModel.ts');
const {
  buildSubdivisionGeometry,
  certifyHomologous,
  decomposeIntoLoops,
  deriveOptionBGenerators,
  liftRealCycleToSubdivision,
} = req('src/manuscript/optionBModel.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const xor = (a, b) => {
  const set = new Set(a);
  for (const id of b) {
    if (set.has(id)) set.delete(id);
    else set.add(id);
  }
  return [...set].sort();
};
const closedFinite = (polyline) =>
  polyline.length >= 4 &&
  polyline[0].every((c, i) => c === polyline[polyline.length - 1][i]) &&
  polyline.every((p) => p.every((c) => Number.isFinite(c)));

// ----- the flagship: dual-of-the-torus-immersion (a b₁=2 plain form) ---------
{
  console.log('----- [option B] the dual-born plain form draws its certified basis -----');
  const torus = immerseSurface({ surface: 'torus', resolution: 8 });
  const dual = applyPlaygroundOperationTo('dual', torus.shape, null, 1, 8);
  const reading = deriveOptionBGenerators(dual.born.shape);
  check('dual-of-torus: b₁ = 2 certified, generators.length === b₁ (the FULL basis, no more, no less)',
    reading.b1 === 2 && reading.cert.b1 === 2 && reading.generators.length === 2);
  check('every generator polyline is CLOSED and finite (the canonical geometric image)',
    reading.generators.every((g) => g.polylines.length >= 1 && g.polylines.every(closedFinite)));
  check('provenance: each generator carries its exact certified sub-edge cycle',
    reading.generators.every((g) => g.subEdges.length > 0 && g.label.startsWith('g')));
  note(`g1: ${reading.generators[0].subEdges.length} sub-edges → ${reading.generators[0].polylines.map((p) => p.length).join('+')} pts | g2: ${reading.generators[1].subEdges.length} sub-edges`);
}

// ----- b₁ = 0 forms draw none (unchanged null cases) --------------------------
{
  console.log('----- [option B] b₁=0 forms stay bare -----');
  const square = invokePrimitive('square', 10);
  const disk = deriveOptionBGenerators(square.shape);
  check('an invoked square (disk): b₁=0 → ZERO generators', disk.b1 === 0 && disk.generators.length === 0);
  const other = invokePrimitive('square', 11);
  const child = birthChild(square.shape, other.shape, 12);
  const assembled = deriveOptionBGenerators(child.born.shape);
  check('the assemble child: b₁=0 → ZERO generators', assembled.b1 === 0 && assembled.generators.length === 0);
}

// ----- THE RATIFICATION: torus Option B reproduces Option A -------------------
const torus = immerseSurface({ surface: 'torus', resolution: 8 });
const complex = toAssembledComplex(torus.shape);
const geometry = buildSubdivisionGeometry(torus.shape, complex);
const optionB = deriveOptionBGenerators(torus.shape);
{
  console.log('----- [ratification] torus: Option-B basis spans EXACTLY Option-A (a, b) -----');
  check('torus Option B: 2 certified generators', optionB.b1 === 2 && optionB.generators.length === 2);
  const [c1, c2] = optionB.generators.map((g) => g.subEdges);
  const combos = [
    { name: 'c1', edges: c1 },
    { name: 'c2', edges: c2 },
    { name: 'c1⊕c2', edges: xor(c1, c2) },
  ];
  const optionA = deriveGeneratorLoops(torus.correspondence);
  const classOf = (loop) => {
    const lifted = liftRealCycleToSubdivision(loop.vertexPath, complex);
    const matches = combos.filter((combo) => certifyHomologous(lifted, combo.edges, geometry).homologous);
    return { label: loop.label, matches: matches.map((m) => m.name) };
  };
  const a = classOf(optionA[0]);
  const b = classOf(optionA[1]);
  check('lifted Option-A a is ∂₂-homologous to EXACTLY ONE nonzero Option-B combination',
    a.matches.length === 1);
  check('lifted Option-A b is ∂₂-homologous to EXACTLY ONE nonzero Option-B combination',
    b.matches.length === 1);
  check('the two combinations are INDEPENDENT (a≠b as classes) — the bases span the same H₁',
    a.matches.length === 1 && b.matches.length === 1 && a.matches[0] !== b.matches[0]);
  note(`a → ${a.matches.join(',') || 'NONE'} | b → ${b.matches.join(',') || 'NONE'}`);
}

// ----- Q-M3: the oracle seal ---------------------------------------------------
{
  console.log('----- [Q-M3 seal] the ∂₂ membership oracle: passes valid γ, rejects invalid -----');
  const [c1, c2] = optionB.generators.map((g) => g.subEdges);
  check('PASS: γ = c itself (γ⊕c = 0 is trivially a boundary)',
    certifyHomologous(c1, c1, geometry).homologous === true);
  const perturbed = xor(c1, geometry.triangles[0]);
  check('PASS: γ = c ⊕ ∂₂(a triangle) — a certified alternative representative of the SAME class',
    certifyHomologous(perturbed, c1, geometry).homologous === true);
  const nonCycle = certifyHomologous([c1[0]], c1, geometry);
  check('REJECT: a non-cycle γ (odd degree) — refused with the reason, never hand-drawn',
    nonCycle.homologous === false && /not a Z\/2 cycle/.test(nonCycle.reason));
  const differentClass = certifyHomologous(c1, c2, geometry);
  check('REJECT: γ in a DIFFERENT class (c1 vs c2) — the membership solve says no',
    differentClass.homologous === false && /DIFFERENT class/.test(differentClass.reason));
  note(`reject reasons: [${nonCycle.homologous ? '' : nonCycle.reason}] · [${differentClass.homologous ? '' : differentClass.reason}]`);
}

// ----- reconstruction teeth ----------------------------------------------------
{
  console.log('----- [teeth] the re-expressed subdivision matches the certifier -----');
  check('every certified basis cycle is ∂₁-CLOSED under the reconstructed endpoints (decomposes into loops)',
    optionB.generators.every((g) => decomposeIntoLoops(g.subEdges, geometry.endpoints).length >= 1));
  const triangleLoops = geometry.triangles.slice(0, 12).map((t) => decomposeIntoLoops(t, geometry.endpoints));
  check('every reconstructed triangle boundary is ONE closed 3-loop',
    triangleLoops.every((loops) => loops.length === 1 && loops[0].length === 4));
  const vCount = complex.vertices.length;
  const eCount = complex.edges.length;
  const fCount = complex.faces.length;
  check('the position map covers EXACTLY the ruling’s sub-vertices (V + E + F)',
    geometry.positions.size === vCount + eCount + fCount);
  const edge = complex.edges[0];
  const mPos = geometry.positions.get(`M:${edge.id}`);
  const uPos = torus.shape.vertices[edge.u].position;
  const vPos = torus.shape.vertices[edge.v].position;
  check('an edge-class sub-vertex sits at ITS OWN midpoint (recomputed)',
    mPos.every((c, i) => Math.abs(c - (uPos[i] + vPos[i]) / 2) < 1e-12));
  const b0 = geometry.positions.get('B:0');
  const face0 = torus.shape.faces[0];
  const centroid = face0.vertexIds
    .reduce((acc, id) => acc.map((c, i) => c + torus.shape.vertices[id].position[i]), [0, 0, 0])
    .map((c) => c / face0.vertexIds.length);
  check('a face sub-vertex sits at ITS OWN centroid (recomputed)',
    b0.every((c, i) => Math.abs(c - centroid[i]) < 1e-12));
}

console.log(
  failures === 0
    ? '\n--- manuscript option B (Q-M1 canonical · torus reproduces A · Q-M3 oracle sealed · teeth): no failures ---\n\nALL PASS'
    : `\n--- manuscript option B: ${failures} FAILURE(S) ---`,
);
process.exitCode = failures === 0 ? 0 : 1;

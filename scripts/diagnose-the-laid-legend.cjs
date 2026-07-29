#!/usr/bin/env node

// DIAGNOSTIC — UNIFICATION: THE CONTRADICTION INSTRUMENT (LAW 14's teeth).
//
// The tourniquet (878b735) stopped the laid card's empty-legend fallback from
// asserting H₁ = 0 over a correct H₁ row. Unification DRAWS the basis — so
// this instrument now holds the stronger law and BITES on any contradiction:
// for every laid subject, the number of drawn certified generators must EQUAL
// the number of summands in the card's own H₁ row (both flow from the one
// certifier). A card whose legend says N loops while its H₁ row says M ≠ N
// summands FAILS here — the contradiction can never again print silently.
//
// Anti-mock: the REAL TS modules through the transpile hook.

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
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { thicken } = req('src/lib/thicken.ts');
const { identify } = req('src/lib/complexIdentification.ts');
const { subdivideFace } = req('src/lib/surfaceRefinement.ts');
const { applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const { tryLaidBodyModel } = req('src/manuscript/laidBodyModel.ts');
const { buildLaidInkedModel } = req('src/manuscript/laidInkedModel.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('UNIFICATION contradiction instrument: the legend and the H₁ row may never disagree\n');

let seq = 750;
const ringSpec = (name) => () => ({
  name,
  vertices: [
    { id: 'r0', position: [1.5, 0, 0] },
    { id: 'r1', position: [-0.75, 1.3, 0] },
    { id: 'r2', position: [-0.75, -1.3, 0] },
  ],
  edges: [
    { vertexIds: ['r0', 'r1'] },
    { vertexIds: ['r1', 'r2'] },
    { vertexIds: ['r2', 'r0'] },
  ],
});
const laidVia = (op, name) => {
  const ring = loadForm(ringSpec(name));
  const band = thicken(ring).shape;
  const born = applyPlaygroundOperationTo(op, band, null, (seq += 1), 24, [ring]);
  if (!born.ok) return null;
  return tryLaidBodyModel(born.born.shape, [band, ring]);
};
const laidRp2 = () => {
  const sq2 = loadForm(nGon(4));
  const cs = subdivideFace(sq2, sq2.faces[0], 'v0', 'v2').shape;
  const ring = ['v0', 'v1', 'v2', 'v3'].map((a, k, ids) => {
    const b = ids[(k + 1) % 4];
    const e = cs.edges.find(
      (e2) => (e2.vertexIds[0] === a && e2.vertexIds[1] === b) || (e2.vertexIds[0] === b && e2.vertexIds[1] === a),
    );
    return e ? e.id : '';
  });
  const z = identify(cs, [ring[0], ring[1]], [ring[2], ring[3]], 'reversing', null);
  return tryLaidBodyModel(z.shape, [cs, sq2]);
};

// the H₁ row's own summand count (the card prints h1Label verbatim)
const summandsOf = (h1Label) => {
  if (h1Label === null) return null;
  if (h1Label.trim() === '0') return 0;
  return h1Label.split('⊕').length;
};

const subjects = [
  { key: 'torus (sew-preserving)', laid: laidVia('sew-boundary-preserving', 'legend-t') },
  { key: 'klein (sew-reversing)', laid: laidVia('sew-boundary-reversing', 'legend-k') },
  { key: 'rp2 (chorded-square identify)', laid: laidRp2() },
];

console.log('----- [1] drawn generators === H₁ summands, per laid subject -----');
for (const subject of subjects) {
  check(`§1 ${subject.key}: lays`, subject.laid !== null);
  if (!subject.laid) continue;
  const inked = buildLaidInkedModel(subject.laid);
  const generatorCount = new Set(inked.loops.map((l) => l.label.split('·')[0])).size;
  const summands = summandsOf(subject.laid.h1Label);
  note(`${subject.key}: H₁ = "${subject.laid.h1Label}" (${summands} summand${summands === 1 ? '' : 's'}) · drawn generators ${generatorCount} · certified b₁ ${subject.laid.inked.b1}`);
  check(
    `§1 ${subject.key}: NO CONTRADICTION — drawn generators (${generatorCount}) === H₁ summands (${summands}) === certified b₁ (${subject.laid.inked.b1})`,
    summands !== null && generatorCount === summands && subject.laid.inked.b1 === summands,
  );
}

// ---------------------------------------------------------------------------
// [2] the card's legend is WIRED to the drawn loops (no hand count anywhere)
// ---------------------------------------------------------------------------
console.log('\n----- [2] the card legend maps the drawn loops verbatim -----');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check("§2 the laid card's legend maps the adapter's own loops (never a hand-typed count)",
  viewSrc.includes('legend: (laidInked?.loops ?? []).map'));
check('§2 the legend entry names the certified provenance and the ink it wears',
  viewSrc.includes('certified H₁ generator (globalW1 basis), drawn on the body'));
check("§2 the tourniquet fallback ('no generator loops drawn') SURVIVES for the honest empty case — and only fires when the legend is empty",
  viewSrc.includes('no generator loops drawn') && viewSrc.includes('reading.legend.length'));

console.log(
  `\n--- UNIFICATION contradiction instrument (legend ⇄ H₁ ⇄ b₁): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

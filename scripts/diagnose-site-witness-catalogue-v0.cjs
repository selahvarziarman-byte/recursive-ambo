#!/usr/bin/env node

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
// Requiring the real catalogue module is the mock-solution guard: delete
// siteWitnessCatalogueV0.ts and this require throws.
const { buildSiteWitnessCatalogueV0 } = require(
  path.join(repoRoot, 'src/lib/siteWitnessCatalogueV0.ts'),
);
const { createSeedShape } = require(path.join(repoRoot, 'src/data/seeds.ts'));
const { applyAmboDissection } = require(path.join(repoRoot, 'src/lib/ambo.ts'));

let failures = 0;
function check(label, condition) {
  if (condition) {
    console.log(`PASS - ${label}`);
  } else {
    console.log(`FAIL - ${label}`);
    failures += 1;
  }
}
function eq(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

// ---- fixtures: tetra g1 (dissect seed) + g2 (dissect the gen-1 octa core) ----
const shape1 = applyAmboDissection(createSeedShape('tetrahedron'));
const octaCoreId = shape1.generations[shape1.generations.length - 1].createdCellIds[0];
const shape2 = applyAmboDissection(shape1, octaCoreId);

const cat1 = buildSiteWitnessCatalogueV0(shape1); // octahedron gem + gen-1 sites
const cat2 = buildSiteWitnessCatalogueV0(shape2); // cuboctahedron gem + gen-1 & gen-2 sites

const siteByLabel = (cat, label) => cat.sites.find((s) => s.label === label);

// ===================== RESIDUAL (tetra primals A,B,C,D) =====================
const AB = siteByLabel(cat2, 'AB');
const ABAC = siteByLabel(cat2, 'ABAC');
const BCBD = siteByLabel(cat2, 'BCBD');

check('residual gen-1 AB: preserved=[] shed=[A,B]',
  AB && eq(AB.residual.preserved, []) && eq(AB.residual.shed, ['A', 'B']));
check('residual gen-2 ABAC: preserved=[A] shed=[B,C]',
  ABAC && eq(ABAC.residual.preserved, ['A']) && eq(ABAC.residual.shed, ['B', 'C']));
check('residual gen-2 BCBD: preserved=[B] shed=[C,D]',
  BCBD && eq(BCBD.residual.preserved, ['B']) && eq(BCBD.residual.shed, ['C', 'D']));

// ===================== ABSTRACTION ==========================================
const gen1sites = cat2.sites.filter((s) => s.abstraction.generationDepth === 1);
check('abstraction gen-1 sites: depth=1 and preservedCount=0 (all)',
  gen1sites.length === 6 && gen1sites.every((s) => s.abstraction.preservedCount === 0));
check('abstraction ABAC: depth=2, preservedCount=1, shedCount=2',
  ABAC && ABAC.abstraction.generationDepth === 2 &&
    ABAC.abstraction.preservedCount === 1 && ABAC.abstraction.shedCount === 2);

// ===================== ADJACENCY (ABAC) — §4d literal/global, Option A ======
const adjTally = ABAC
  ? ABAC.adjacency.reduce((acc, a) => ((acc[a.type] = (acc[a.type] || 0) + 1), acc), {})
  : {};
const realLabels = new Set(Object.values(shape2.vertices).map((v) => v.data.label));
const allMembersReal =
  ABAC &&
  ABAC.adjacency.length > 0 &&
  ABAC.adjacency.every((a) => a.members.length > 0 && a.members.every((m) => realLabels.has(m)));

check('adjacency ABAC: >=1 object AND >=1 relation face',
  (adjTally.object || 0) >= 1 && (adjTally.relation || 0) >= 1);
check('adjacency ABAC: members are all real labels (no empties)', Boolean(allMembersReal));
// Option A honesty: under §4d global scope ABAC carries 4 'unclassified' faces =
// the square-pyramid residue side-faces (both source-vertex AND source-face set).
// (See .handoff/REPORT_site-witness-catalogue-v0-STOP-adjacency-contradiction.md.)
check('adjacency ABAC: global tally object=4 relation=2 unclassified=4 (residue side-faces honest)',
  (adjTally.object || 0) === 4 && (adjTally.relation || 0) === 2 && (adjTally.unclassified || 0) === 4);

// ===================== SHAPE GEM — octahedron (gen-1 core) ==================
const octaGem = cat1.shapeGems.find((g) => g.topology === 'octahedron');
const octaPairKeys = octaGem
  ? new Set(octaGem.gem.axes.map((ax) => ax.members.join('|')))
  : new Set();
check('octahedron gem present + gemName=antipodality + 3 antipodal axes',
  octaGem && octaGem.gem.gemName === 'antipodality' && octaGem.gem.axes.length === 3 &&
    octaGem.gem.axes.every((ax) => ax.kind === 'antipodal-pair'));
check('octahedron gem axes = {AB|CD, AC|BD, AD|BC}',
  octaPairKeys.size === 3 && ['AB|CD', 'AC|BD', 'AD|BC'].every((k) => octaPairKeys.has(k)));

// ===================== SHAPE GEM — cuboctahedron (gen-2 core) ===============
const cuboctGem = cat2.shapeGems.find((g) => g.topology === 'cuboctahedron');
const triAxes = cuboctGem ? cuboctGem.gem.axes.filter((a) => a.kind === 'triangle-face').length : 0;
const sqAxes = cuboctGem ? cuboctGem.gem.axes.filter((a) => a.kind === 'square-face').length : 0;
check('cuboctahedron gem present + gemName=A3/S4-incidence',
  cuboctGem && cuboctGem.gem.gemName === 'A3/S4-incidence');
check('cuboctahedron gem: 4 triangle-face axes + 3 square-face axes (7 total)',
  triAxes === 4 && sqAxes === 3 && cuboctGem.gem.axes.length === 7);

// ===================== GENERAL =============================================
check('methodId exact', cat2.methodId === 'site-witness-catalogue-v0');
check('issues empty on clean tetra g1+g2 shape', Array.isArray(cat2.issues) && cat2.issues.length === 0);
check('every site has a residual (all are 2-parent ambo sites)',
  cat2.sites.length === 18 && cat2.sites.every((s) => s.residual !== null));

// ===================== eyeball: one fully-rendered record (ABAC) ============
console.log('\n--- fully-rendered site-witness record: ABAC (gen-2, cuboctahedron core) ---');
console.log(JSON.stringify(ABAC, null, 2));
console.log('\n--- shape gems present on shape2 ---');
for (const g of cat2.shapeGems) {
  console.log(`  ${g.topology}: ${g.gem.gemName} (${g.gem.axes.length} axes)`);
}

console.log(`\n${failures === 0 ? 'ALL PASS' : failures + ' FAILURE(S)'}`);
process.exit(failures === 0 ? 0 : 1);

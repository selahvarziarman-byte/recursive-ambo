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
// Requiring the real registry module is the mock-solution guard: delete
// incidenceTraceRegistry.ts and this require throws.
const { buildIncidenceTraceRegistry } = require(
  path.join(repoRoot, 'src/lib/incidenceTraceRegistry.ts'),
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

// ---- fixtures: tetra g1 (dissect seed) + g2 (dissect the gen-1 octa core) ----
const s1 = applyAmboDissection(createSeedShape('tetrahedron'));
const octaCoreId = s1.generations[s1.generations.length - 1].createdCellIds[0];
const s2 = applyAmboDissection(s1, octaCoreId);
const report = buildIncidenceTraceRegistry(s2);
const cubo = report.cellBodies.find((b) => b.cellTopology === 'cuboctahedron');

// ===================== STATUS LINES (spec preamble literals) ================
check('method exact = incidence-trace-registry-v0', report.method === 'incidence-trace-registry-v0');
check('scope exact = incidence-only', report.scope === 'incidence-only');
check('semanticStatus exact = not-semantic-naming', report.semanticStatus === 'not-semantic-naming');
check('shapeMutationStatus exact = not-shape-mutation', report.shapeMutationStatus === 'not-shape-mutation');
check('packetWriteStatus exact = not-packet-writing', report.packetWriteStatus === 'not-packet-writing');

// ===================== CUBOCTAHEDRON BODY (spec §4 numbers) =================
check('a cuboctahedron cellBody is present', Boolean(cubo));
check('cubo.squareCount === 6', cubo && cubo.squareCount === 6);
check('cubo.vertexCount === 12', cubo && cubo.vertexCount === 12);
check('cubo.policyPrecheckStatus === applicable', cubo && cubo.policyPrecheckStatus === 'applicable');
check('cubo.matchingCount === 2 (the pyritohedral chiral pair)', cubo && cubo.matchingCount === 2);
check('cubo.status === multiple', cubo && cubo.status === 'multiple');
check('cubo.selectedMatching === null (registry does NOT select)', cubo && cubo.selectedMatching === null);

// ===================== SQUARE-PYRAMID RESIDUE BODIES (§4 BINDING RULE) =======
const squarePyramidBodies = report.cellBodies.filter((b) =>
  String(b.cellTopology).includes('square-pyramid'),
);
check('square-pyramid residue cellBodies are present (>=1)', squarePyramidBodies.length >= 1);
check('every square-pyramid residue cellBody has status === not-applicable-by-count',
  squarePyramidBodies.length >= 1 &&
    squarePyramidBodies.every((b) => b.status === 'not-applicable-by-count'));

// ===================== HONESTY / GENERAL ====================================
check('report.issues is empty on clean tetra g1+g2 shape',
  Array.isArray(report.issues) && report.issues.length === 0);

// ===================== eyeball: the full cuboctahedron cellBody =============
console.log('\n--- full cuboctahedron cellBody (GlobalSquareResolution) ---');
console.log(JSON.stringify(cubo, null, 2));

console.log(`\n${failures === 0 ? 'ALL PASS' : failures + ' FAILURE(S)'}`);
process.exit(failures === 0 ? 0 : 1);

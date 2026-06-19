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
// Requiring the real ledger module is the mock-solution guard: delete
// transformationLedger.ts and this require throws.
const { buildTransformationLedgerReport, buildLedgerFromDual } = require(
  path.join(repoRoot, 'src/lib/transformationLedger.ts'),
);
const { createSeedShape } = require(path.join(repoRoot, 'src/data/seeds.ts'));
const { applyAmboDissection } = require(path.join(repoRoot, 'src/lib/ambo.ts'));
const { applyPyritohedralDiagonalization } = require(
  path.join(repoRoot, 'src/lib/pyritohedralDiagonalization.ts'),
);
// buildSemanticDualModel is the REAL dual builder — the ledger module imports only
// its TYPE; the diagnostic builds the actual model and cross-checks the ledger
// against the model's OWN enforced bijection (anti-mock).
const { buildSemanticDualModel } = require(path.join(repoRoot, 'src/lib/dualization.ts'));

let failures = 0;
function check(label, condition) {
  if (condition) {
    console.log(`PASS - ${label}`);
  } else {
    console.log(`FAIL - ${label}`);
    failures += 1;
  }
}

// ---- build the REAL dual via the ratified chain (spec §4) ----
const s0 = createSeedShape('tetrahedron');
const s1 = applyAmboDissection(s0); // gen-1: octahedron core
const octaCore = s1.cells.find((c) => c.topology === 'octahedron' && c.kind === 'core');
const s2 = applyAmboDissection(s1, octaCore.id); // gen-2: cuboctahedron core
const cuboCore = s2.cells.find((c) => c.topology === 'cuboctahedron');
const s3 = applyPyritohedralDiagonalization(s2, cuboCore.id); // gen-3: pyritohedral-icosahedron core
const pyritoCore = s3.cells.find((c) => c.topology === 'pyritohedral-icosahedron');
const model = buildSemanticDualModel(s3, pyritoCore.id); // the dodecahedron dual + six maps
const report = buildTransformationLedgerReport(model);

const ledger = report.ledger;
const cert = report.certificate;
const forwardKeys = Object.keys(ledger.forward);
const forwardValues = forwardKeys.map((k) => ledger.forward[k]);
const pullBackKeys = Object.keys(ledger.pullBack);
const sourceMaps = [
  model.sourceFaceToDualVertex,
  model.sourceVertexToDualFace,
  model.sourceEdgeToDualEdge,
];
const sourceCount = sourceMaps.reduce((sum, m) => sum + Object.keys(m).length, 0);

// ===================== STATUS LINES (spec preamble literals) ================
check('method exact = transformation-ledger-v0', report.method === 'transformation-ledger-v0');
check('scope exact = transformation-only', report.scope === 'transformation-only');
check('semanticStatus exact = not-semantic-naming', report.semanticStatus === 'not-semantic-naming');
check('shapeMutationStatus exact = not-shape-mutation', report.shapeMutationStatus === 'not-shape-mutation');

// ===================== FORWARD = TOTAL over every source element =============
check('forward has one entry per source element (face + vertex + edge)', forwardKeys.length === sourceCount);
check('forward is TOTAL: no forward value is null (no cut in the dual)', forwardValues.every((v) => v !== null));

// ===================== FORWARD = INJECTIVE ==================================
check('forward is INJECTIVE: distinct results === forward entry count',
  new Set(forwardValues).size === forwardKeys.length);

// ===================== PULL-BACK = SINGLETON BASELINE =======================
check('every pullBack set has size EXACTLY 1',
  pullBackKeys.length > 0 && pullBackKeys.every((k) => Array.isArray(ledger.pullBack[k]) && ledger.pullBack[k].length === 1));
check('pullBack key count === forward entry count', pullBackKeys.length === forwardKeys.length);

// ===================== RESULT SITE COUNT (12V/20F/30E pyrito-icosa) =========
// 20 dual-vertices (from 20 source faces) + 12 dual-faces (from 12 source vertices)
// + 30 dual-edges (from 30 source edges) = 62.
check('resultSiteCount === 62', cert.resultSiteCount === 62);
check('source map sizes are 20 faces / 12 vertices / 30 edges',
  Object.keys(model.sourceFaceToDualVertex).length === 20 &&
    Object.keys(model.sourceVertexToDualFace).length === 12 &&
    Object.keys(model.sourceEdgeToDualEdge).length === 30);

// ===================== CERTIFICATE = FAITHFUL (bijective baseline) ==========
check('homogeneousCount === resultSiteCount', cert.homogeneousCount === cert.resultSiteCount);
check('heterogeneousCount === 0', cert.heterogeneousCount === 0);
check('removedLoggedCount === 0', cert.removedLoggedCount === 0);
check('removedSilentCount === 0', cert.removedSilentCount === 0);
check('perCutSource is empty (no cuts)', cert.perCutSource.length === 0);
check("operationStatus === 'FAITHFUL'", cert.operationStatus === 'FAITHFUL');
check('every result-site status === lineage-homogeneous',
  cert.perResultSite.every((c) => c.status === 'lineage-homogeneous'));
check('every result-site inheritedLineage non-null, lineageConflict null (singleton baseline)',
  cert.perResultSite.every((c) => c.inheritedLineage !== null && c.lineageConflict === null));

// ===================== ROUND-TRIP anti-mock cross-check =====================
// For every source s: pullBack[forward[s]] === [s].
check('ROUND-TRIP: for every source s, pullBack[forward[s]] === [s]',
  forwardKeys.every((s) => {
    const r = ledger.forward[s];
    const pb = ledger.pullBack[r];
    return Array.isArray(pb) && pb.length === 1 && pb[0] === s;
  }));
// The ledger's forward equals the UNION of the model's three source->dual maps
// (the ledger reproduces the model's bijection exactly; not a re-derivation).
check("ledger.forward === union of the model's three source->dual maps",
  forwardKeys.length === sourceCount &&
    sourceMaps.every((m) => Object.entries(m).every(([k, v]) => ledger.forward[k] === v)));

// ===================== BACK-REFERENCE (spec §2) =============================
// Every result id is a freshly minted dual id that points BACK to its source; it
// never IS the source id.
check('BACK-REFERENCE: every result id !== its pulled-back source id',
  pullBackKeys.every((r) => ledger.pullBack[r][0] !== r));

// ===================== HONESTY =============================================
check('report.issues empty', Array.isArray(report.issues) && report.issues.length === 0);

// ===================== eyeball: aggregate certificate + one result site =====
console.log('\n--- aggregate FaithfulnessCertificate (counts) ---');
console.log(
  JSON.stringify(
    {
      resultSiteCount: cert.resultSiteCount,
      homogeneousCount: cert.homogeneousCount,
      heterogeneousCount: cert.heterogeneousCount,
      removedLoggedCount: cert.removedLoggedCount,
      removedSilentCount: cert.removedSilentCount,
      operationStatus: cert.operationStatus,
    },
    null,
    2,
  ),
);
console.log('\n--- one example ResultSiteCertificate ---');
console.log(JSON.stringify(cert.perResultSite[0], null, 2));

// Touch buildLedgerFromDual directly so the diagnostic exercises the exported
// lifter (not only the report wrapper).
const directLedger = buildLedgerFromDual(model);
check('buildLedgerFromDual (direct) matches the report ledger forward entry count',
  Object.keys(directLedger.forward).length === forwardKeys.length);

console.log(`\n${failures === 0 ? 'ALL PASS' : failures + ' FAILURE(S)'}`);
process.exit(failures === 0 ? 0 : 1);

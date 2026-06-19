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
const {
  buildTransformationLedgerReport,
  buildLedgerFromDual,
  buildLedgerFromIdentification,
  certifyFaithfulness,
  shapeLineageOf,
} = require(path.join(repoRoot, 'src/lib/transformationLedger.ts'));
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

// ===================== P2: the glue (B-twin) simulation =====================
// Spec §7: "glue, B-twin pair: same lineage, different scope -> lineage-
// homogeneous; lineage survives, scope -> 2-set." Build the registry's verified
// B-twin fixture (4 B-twin groups), simulate gluing one real B-twin pair, and
// certify with the SHARED shapeLineageOf — the multi-source pull-back is where
// the certificate first becomes load-bearing.
{
  const o0 = createSeedShape('octahedron');
  const o1 = applyAmboDissection(o0, o0.cells.find((c) => c.kind === 'seed').id);
  const core1 = o1.cells.find((c) => c.topology === 'cuboctahedron');
  const o2 = applyAmboDissection(o1, core1.id);
  const res1 = o1.cells
    .filter((c) => c.kind === 'residue')
    .sort((a, b) => a.id.localeCompare(b.id))[0];
  const o3 = applyAmboDissection(o2, res1.id);
  const midIds = Object.values(o3.vertices)
    .filter((v) => v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2)
    .map((v) => v.id);
  const lineageOf = shapeLineageOf(o3);

  // Group midpoints by lineage key; a class of size >= 2 is a B-twin group.
  const byLineage = new Map();
  for (const id of midIds) {
    const key = lineageOf(id);
    if (!byLineage.has(key)) byLineage.set(key, []);
    byLineage.get(key).push(id);
  }
  const bTwinClasses = [...byLineage.values()].filter((ids) => ids.length >= 2);
  // Deterministic pick: first B-twin class (by sorted lineage key), first two sorted members.
  const sortedClasses = [...byLineage.entries()].sort((x, y) => x[0].localeCompare(y[0]));
  const firstBTwin = sortedClasses.find(([, ids]) => ids.length >= 2);
  const pair = firstBTwin ? [...firstBTwin[1]].sort() : [];
  const a = pair[0];
  const b = pair[1];

  const gluedResultId = `glued:${[a, b].sort().join('|')}`;
  const ledger = buildLedgerFromIdentification(midIds, (s) => (s === a || s === b ? gluedResultId : s));
  const gluedCert = certifyFaithfulness(ledger, lineageOf);
  const gluedSite = gluedCert.perResultSite.find((c) => c.resultSiteId === gluedResultId);

  const sameSet = (arr, set) => {
    const sa = new Set(arr);
    return sa.size === set.length && set.every((x) => sa.has(x));
  };

  check('GLUE fixture: midIds.length === 44', midIds.length === 44);
  check('GLUE fixture: >= 4 lineage classes of size >= 2 (the 4 B-twin groups)', bTwinClasses.length >= 4);
  check('GLUE pair: a !== b (DIFFERENT scope)', Boolean(a) && Boolean(b) && a !== b);
  check('GLUE pair: lineageOf(a) === lineageOf(b) (SAME lineage — a real B-twin)',
    Boolean(a) && Boolean(b) && lineageOf(a) === lineageOf(b));
  check('GLUE: pullBack[gluedResultId] is exactly the 2-set {a, b}',
    Array.isArray(ledger.pullBack[gluedResultId]) && sameSet(ledger.pullBack[gluedResultId], [a, b]));
  check('GLUE: glued result lineageHomogeneous === true', Boolean(gluedSite) && gluedSite.lineageHomogeneous === true);
  check('GLUE: glued result inheritedLineage === lineageOf(a)',
    Boolean(gluedSite) && gluedSite.inheritedLineage === lineageOf(a));
  check('GLUE: glued result lineageConflict === null', Boolean(gluedSite) && gluedSite.lineageConflict === null);
  check("GLUE: glued result status === 'lineage-homogeneous'",
    Boolean(gluedSite) && gluedSite.status === 'lineage-homogeneous');
  check('GLUE: cert.resultSiteCount === 43 (44 sources, one pair glued)', gluedCert.resultSiteCount === 43);
  check('GLUE: cert.heterogeneousCount === 0', gluedCert.heterogeneousCount === 0);
  check('GLUE: cert.removedSilentCount === 0', gluedCert.removedSilentCount === 0);
  check("GLUE: cert.operationStatus === 'FAITHFUL'", gluedCert.operationStatus === 'FAITHFUL');

  console.log('\n--- glued B-twin ResultSiteCertificate ---');
  console.log(JSON.stringify(gluedSite, null, 2));

  // =================== P3: glue a DIFFERENT-lineage pair =====================
  // Spec §7 + clause III (no fabricated identity): gluing two sites of DISTINCT
  // lineage is lineage-heterogeneous — the conflict is RECORDED, no identity is
  // invented, and the operation is flagged UNFAITHFUL. This is the load-bearing
  // certificate firing in the OTHER direction, on the same fixture/machinery.
  const sortedKeys = [...byLineage.keys()].sort(); // distinct lineage keys
  const x = [...byLineage.get(sortedKeys[0])].sort()[0]; // a site of the first lineage
  const y = [...byLineage.get(sortedKeys[1])].sort()[0]; // a site of a DIFFERENT lineage
  const hetResultId = `glued-het:${[x, y].sort().join('|')}`;
  const hetLedger = buildLedgerFromIdentification(midIds, (s) => (s === x || s === y ? hetResultId : s));
  const hetCert = certifyFaithfulness(hetLedger, lineageOf);
  const hetSite = hetCert.perResultSite.find((c) => c.resultSiteId === hetResultId);

  check('P3 het: >= 2 distinct lineage keys exist', sortedKeys.length >= 2);
  check('P3 het: x !== y AND lineageOf(x) !== lineageOf(y) (genuinely different lineage)',
    Boolean(x) && Boolean(y) && x !== y && lineageOf(x) !== lineageOf(y));
  check('P3 het: pullBack[hetResultId] is exactly the 2-set {x, y}',
    Array.isArray(hetLedger.pullBack[hetResultId]) && sameSet(hetLedger.pullBack[hetResultId], [x, y]));
  check('P3 het: hetSite.lineageHomogeneous === false', Boolean(hetSite) && hetSite.lineageHomogeneous === false);
  check('P3 het: hetSite.inheritedLineage === null (NO fabricated identity — clause III)',
    Boolean(hetSite) && hetSite.inheritedLineage === null);
  check('P3 het: hetSite.lineageConflict is the 2-set { lineageOf(x), lineageOf(y) } (conflict RECORDED)',
    Boolean(hetSite) && Array.isArray(hetSite.lineageConflict) &&
      sameSet(hetSite.lineageConflict, [lineageOf(x), lineageOf(y)]));
  check("P3 het: hetSite.status === 'lineage-heterogeneous' (NEVER 'unintelligible')",
    Boolean(hetSite) && hetSite.status === 'lineage-heterogeneous');
  check('P3 het: hetCert.heterogeneousCount === 1', hetCert.heterogeneousCount === 1);
  check('P3 het: hetCert.resultSiteCount === 43', hetCert.resultSiteCount === 43);
  check("P3 het: hetCert.operationStatus === 'UNFAITHFUL'", hetCert.operationStatus === 'UNFAITHFUL');

  console.log('\n--- heterogeneous glue ResultSiteCertificate (conflict populated, inheritedLineage null) ---');
  console.log(JSON.stringify(hetSite, null, 2));

  // =================== P4: quotient by LINEAGE-EQUALITY ======================
  // Spec §4 + §7: collapse every lineage-class to ONE site (resultOf = the
  // lineage key) — the MAXIMAL faithful quotient. 44 sites -> 40 lineage-classes
  // (the 4 B-twin doubletons collapse); scope survives as the set-valued
  // pull-back, projecting scope × lineage |-> lineage.
  const quotientLedger = buildLedgerFromIdentification(midIds, (s) => lineageOf(s)); // resultOf = the lineage key
  const quotientCert = certifyFaithfulness(quotientLedger, lineageOf);
  const quotientSets = Object.values(quotientLedger.pullBack);
  const doubletons = quotientSets.filter((set) => set.length === 2);
  const singletons = quotientSets.filter((set) => set.length === 1);

  check('P4 quotient: resultSiteCount === 40 (44 sites -> 40 lineage-classes)', quotientCert.resultSiteCount === 40);
  check("P4 quotient: every result-site status === 'lineage-homogeneous'",
    quotientCert.perResultSite.every((c) => c.status === 'lineage-homogeneous'));
  check('P4 quotient: heterogeneousCount === 0', quotientCert.heterogeneousCount === 0);
  check("P4 quotient: operationStatus === 'FAITHFUL' (lineage-equality is the MAXIMAL faithful quotient)",
    quotientCert.operationStatus === 'FAITHFUL');
  check('P4 quotient: exactly 4 result classes have a 2-set pull-back (the 4 B-twin groups)',
    doubletons.length === 4);
  check('P4 quotient: the other 36 result classes are singletons (4*2 + 36 = 44)',
    singletons.length === 36 && quotientSets.every((set) => set.length === 1 || set.length === 2));
  check('P4 quotient: for every result, inheritedLineage === its resultSiteId (result id IS the lineage key)',
    quotientCert.perResultSite.every((c) => c.inheritedLineage === c.resultSiteId));
  check('P4 quotient: removedSilentCount === 0', quotientCert.removedSilentCount === 0);
  check('P4 quotient: report.issues empty', Array.isArray(report.issues) && report.issues.length === 0);

  console.log('\n--- lineage-quotient aggregate (resultSiteCount 40, 4 doubletons, FAITHFUL) ---');
  console.log(
    JSON.stringify(
      {
        resultSiteCount: quotientCert.resultSiteCount,
        homogeneousCount: quotientCert.homogeneousCount,
        heterogeneousCount: quotientCert.heterogeneousCount,
        doubletonClasses: doubletons.length,
        singletonClasses: singletons.length,
        removedSilentCount: quotientCert.removedSilentCount,
        operationStatus: quotientCert.operationStatus,
      },
      null,
      2,
    ),
  );

  // =================== P5 §A: CUT — logged loss is FAITHFUL, silent is not ====
  // Spec §3 clause II: a cut source (image ∅) is always RECORDED in perCutSource;
  // it is then GRADED — a LOGGED removal (in removedLog) is faithful, a SILENT
  // drop (absent from removedLog) is UNFAITHFUL. The source NEVER silently
  // vanishes from the ledger. Same cut ledger, certified twice.
  const cutSite = [...midIds].sort()[0]; // deterministic
  const cutLedger = buildLedgerFromIdentification(midIds, (s) => (s === cutSite ? null : s)); // s -> null is the CUT
  const loggedCert = certifyFaithfulness(cutLedger, lineageOf, [cutSite]); // removal LOGGED
  const silentCert = certifyFaithfulness(cutLedger, lineageOf, []); // removal NOT logged

  check('P5 §A cut: cutLedger.forward[cutSite] === null', cutLedger.forward[cutSite] === null);
  check('P5 §A cut: cutSite is NOT a key of cutLedger.pullBack (it has no result)',
    !Object.prototype.hasOwnProperty.call(cutLedger.pullBack, cutSite));
  check('P5 §A cut: loggedCert RECORDS the cut source (one perCutSource entry, removed:true)',
    loggedCert.perCutSource.length === 1 &&
      loggedCert.perCutSource[0].sourceSiteId === cutSite &&
      loggedCert.perCutSource[0].removed === true);
  check('P5 §A cut: silentCert RECORDS the cut source too (recorded either way — never a silent vanish)',
    silentCert.perCutSource.length === 1 &&
      silentCert.perCutSource[0].sourceSiteId === cutSite &&
      silentCert.perCutSource[0].removed === true);
  check("P5 §A cut: LOGGED removal -> removedLoggedCount 1 / removedSilentCount 0 / operationStatus 'FAITHFUL'",
    loggedCert.removedLoggedCount === 1 &&
      loggedCert.removedSilentCount === 0 &&
      loggedCert.perCutSource[0].logged === true &&
      loggedCert.operationStatus === 'FAITHFUL');
  check("P5 §A cut: SILENT drop -> removedSilentCount 1 / removedLoggedCount 0 / operationStatus 'UNFAITHFUL'",
    silentCert.removedSilentCount === 1 &&
      silentCert.removedLoggedCount === 0 &&
      silentCert.perCutSource[0].logged === false &&
      silentCert.operationStatus === 'UNFAITHFUL');
  check('P5 §A cut: both certs resultSiteCount === 43 (44 sources, one cut -> 43 mapped results)',
    loggedCert.resultSiteCount === 43 && silentCert.resultSiteCount === 43);
  check('P5 §A cut: both certs heterogeneousCount === 0',
    loggedCert.heterogeneousCount === 0 && silentCert.heterogeneousCount === 0);

  console.log('\n--- cut perCutSource: logged vs silent (same removed source, differ only in `logged`) ---');
  console.log(JSON.stringify({ logged: loggedCert.perCutSource[0], silent: silentCert.perCutSource[0] }, null, 2));

  // =================== P5 §B: the COINCIDENCE COROLLARY ======================
  // Spec §5/§7 — a CERTIFIED HEURISTIC, NEVER the law. On THIS body, B-twins
  // (the same edge amboed in two cells) land at the IDENTICAL midpoint position,
  // so the lineage partition and the position partition coincide. We MEASURE this
  // equivalence; we do NOT use coincidence as a criterion. It is a MEASURED,
  // geometry-dependent corollary (verified, not proven): coincidence PROPOSES
  // identifications, the lineage-homogeneity certificate RATIFIES them. Under a
  // degenerate seed where distinct lineages share a point, the coincidence
  // shortcut would fail but the LAW survives — it flags the heterogeneous class.
  const posKey = (id) => o3.vertices[id].position.map((n) => n.toFixed(9)).join(','); // exact: B-twin midpoints are equal
  const classOf = (keyFn) => {
    const m = new Map();
    for (const id of midIds) {
      const k = keyFn(id);
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(id);
    }
    return m;
  };
  const lineageClasses = classOf(lineageOf);
  const positionClasses = classOf(posKey);
  const sortedClass = (id, m, keyFn) => [...m.get(keyFn(id))].sort();
  const arrEq = (p, q) => p.length === q.length && p.every((v, i) => v === q[i]);

  let partitionsCoincide = midIds.length > 0;
  for (const id of midIds) {
    if (!arrEq(sortedClass(id, lineageClasses, lineageOf), sortedClass(id, positionClasses, posKey))) {
      partitionsCoincide = false;
    }
  }
  check('P5 §B coincidence: lineage-class === position-class for EVERY site (lineage-equal <=> position-coincident, both directions)',
    partitionsCoincide);
  check('P5 §B: lineageClasses.size === positionClasses.size === 40 (the 4 B-twin classes are the 4 coincident pairs)',
    lineageClasses.size === 40 && positionClasses.size === 40);

  // PROPOSAL -> RATIFICATION: the position-PROPOSED glue is FAITHFUL and equals
  // the lineage quotient (40 classes) — coincidence proposes, the law ratifies.
  const posQuotient = certifyFaithfulness(buildLedgerFromIdentification(midIds, posKey), lineageOf);
  check('P5 §B PROPOSAL->RATIFICATION: position-proposed quotient resultSiteCount === 40',
    posQuotient.resultSiteCount === 40);
  check("P5 §B: position-proposed quotient operationStatus === 'FAITHFUL' (the law RATIFIES the coincidence proposal)",
    posQuotient.operationStatus === 'FAITHFUL');
  check('P5 §B: position-proposed quotient heterogeneousCount === 0', posQuotient.heterogeneousCount === 0);

  console.log('\n--- coincidence corollary: lineage vs position partitions + position-quotient ---');
  console.log(
    JSON.stringify(
      {
        lineageClasses: lineageClasses.size,
        positionClasses: positionClasses.size,
        partitionsCoincide,
        posQuotientResultSiteCount: posQuotient.resultSiteCount,
        posQuotientOperationStatus: posQuotient.operationStatus,
      },
      null,
      2,
    ),
  );
}

console.log(`\n${failures === 0 ? 'ALL PASS' : failures + ' FAILURE(S)'}`);
process.exit(failures === 0 ? 0 : 1);

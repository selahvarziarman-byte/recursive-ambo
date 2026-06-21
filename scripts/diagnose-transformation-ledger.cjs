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
  buildSignedIdentification,
  boundarySign,
  certifyOrientation,
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

  // =================== P6 §A: MIXED operation (glue + cut at once) ===========
  // Spec §3/§6: one ledger can carry BOTH a glue AND a cut. operationStatus must
  // be the AND of clause I (no heterogeneity) and clause II (no silent drop) —
  // faithful only when BOTH hold; either alone fails it. Three cases isolate the
  // clauses. Cut site `c` is chosen distinct from every glued site.
  const c = [...midIds].sort().find((s) => s !== a && s !== b && s !== x && s !== y);

  // (1) homogeneous glue (a,b) + LOGGED cut (c) -> FAITHFUL (both clauses satisfied)
  const mix1 = buildLedgerFromIdentification(midIds, (s) => (s === a || s === b ? `g:${a}` : s === c ? null : s));
  const mix1Cert = certifyFaithfulness(mix1, lineageOf, [c]);
  // (2) homogeneous glue (a,b) + SILENT cut (c) -> UNFAITHFUL by clause II ALONE (same ledger, cut not logged)
  const mix2Cert = certifyFaithfulness(mix1, lineageOf, []);
  // (3) heterogeneous glue (x,y) + LOGGED cut (c) -> UNFAITHFUL by clause I ALONE (cut is logged)
  const mix3 = buildLedgerFromIdentification(midIds, (s) => (s === x || s === y ? `g:${x}` : s === c ? null : s));
  const mix3Cert = certifyFaithfulness(mix3, lineageOf, [c]);

  check('P6 §A mixed: cut site c is distinct from every glued site (a,b,x,y)',
    Boolean(c) && c !== a && c !== b && c !== x && c !== y);
  check('P6 §A mixed: mix1 carries BOTH — pullBack[g:a] is the 2-set {a,b} AND forward[c] === null',
    Array.isArray(mix1.pullBack[`g:${a}`]) && sameSet(mix1.pullBack[`g:${a}`], [a, b]) &&
      mix1.forward[c] === null);
  check('P6 §A mixed: the cut c is RECORDED in mix1Cert.perCutSource (removed:true)',
    mix1Cert.perCutSource.some((e) => e.sourceSiteId === c && e.removed === true));
  check("P6 §A (1) glue+LOGGED-cut -> FAITHFUL (het 0, silent 0, logged 1)",
    mix1Cert.heterogeneousCount === 0 && mix1Cert.removedSilentCount === 0 &&
      mix1Cert.removedLoggedCount === 1 && mix1Cert.operationStatus === 'FAITHFUL');
  check("P6 §A (2) glue+SILENT-cut -> UNFAITHFUL by clause II ALONE (het 0, silent 1)",
    mix2Cert.heterogeneousCount === 0 && mix2Cert.removedSilentCount === 1 &&
      mix2Cert.operationStatus === 'UNFAITHFUL');
  check("P6 §A (3) HET-glue+LOGGED-cut -> UNFAITHFUL by clause I ALONE (het 1, silent 0)",
    mix3Cert.heterogeneousCount === 1 && mix3Cert.removedSilentCount === 0 &&
      mix3Cert.operationStatus === 'UNFAITHFUL');
  check('P6 §A mixed: all three resultSiteCount === 42 (44; one pair glued -1; one cut -1)',
    mix1Cert.resultSiteCount === 42 && mix2Cert.resultSiteCount === 42 && mix3Cert.resultSiteCount === 42);
  // The failing clause DIFFERS between (2) and (3): (2) fails clause II (silent cut),
  // (3) fails clause I (heterogeneous glue) — operationStatus is exactly het===0 AND silent===0.
  check('P6 §A mixed: mix2 fails via clause II while mix3 fails via clause I (different clause each)',
    mix2Cert.removedSilentCount === 1 && mix2Cert.heterogeneousCount === 0 &&
      mix3Cert.heterogeneousCount === 1 && mix3Cert.removedSilentCount === 0);

  console.log('\n--- mixed operation: three certs {het, silent, status} ---');
  console.log(
    JSON.stringify(
      {
        mix1_glue_loggedCut: { het: mix1Cert.heterogeneousCount, silent: mix1Cert.removedSilentCount, status: mix1Cert.operationStatus },
        mix2_glue_silentCut: { het: mix2Cert.heterogeneousCount, silent: mix2Cert.removedSilentCount, status: mix2Cert.operationStatus },
        mix3_hetGlue_loggedCut: { het: mix3Cert.heterogeneousCount, silent: mix3Cert.removedSilentCount, status: mix3Cert.operationStatus },
      },
      null,
      2,
    ),
  );

  // =================== P6 §B: heterogeneous pull-back of size 3 ==============
  // Spec §3/§6: the homogeneity check generalizes beyond a pair. Glue three sites
  // of THREE distinct lineages into one result -> a 3-way conflict that is
  // RECORDED in full (size-3 lineageConflict), not silently collapsed to 2, and
  // still no fabricated identity (inheritedLineage null).
  const keys3 = [...byLineage.keys()].sort();
  const x3 = [...byLineage.get(keys3[0])].sort()[0];
  const y3 = [...byLineage.get(keys3[1])].sort()[0];
  const z3 = [...byLineage.get(keys3[2])].sort()[0];
  const het3Id = `g3:${[x3, y3, z3].sort().join('|')}`;
  const het3Ledger = buildLedgerFromIdentification(midIds, (s) => (s === x3 || s === y3 || s === z3 ? het3Id : s));
  const het3Cert = certifyFaithfulness(het3Ledger, lineageOf);
  const het3Site = het3Cert.perResultSite.find((cc) => cc.resultSiteId === het3Id);

  check('P6 §B het3: >= 3 distinct lineage keys; lineageOf(x3),lineageOf(y3),lineageOf(z3) are 3 DISTINCT keys',
    keys3.length >= 3 && new Set([lineageOf(x3), lineageOf(y3), lineageOf(z3)]).size === 3);
  check('P6 §B het3: pullBack[het3Id] is exactly the 3-set {x3, y3, z3}',
    Array.isArray(het3Ledger.pullBack[het3Id]) && sameSet(het3Ledger.pullBack[het3Id], [x3, y3, z3]));
  check('P6 §B het3: het3Site.lineageHomogeneous === false', Boolean(het3Site) && het3Site.lineageHomogeneous === false);
  check('P6 §B het3: het3Site.inheritedLineage === null (no fabricated identity)',
    Boolean(het3Site) && het3Site.inheritedLineage === null);
  check('P6 §B het3: lineageConflict is the 3-set { lineageOf(x3),lineageOf(y3),lineageOf(z3) } (>2-way conflict, not collapsed)',
    Boolean(het3Site) && Array.isArray(het3Site.lineageConflict) && het3Site.lineageConflict.length === 3 &&
      sameSet(het3Site.lineageConflict, [lineageOf(x3), lineageOf(y3), lineageOf(z3)]));
  check("P6 §B het3: heterogeneousCount === 1; operationStatus === 'UNFAITHFUL'",
    het3Cert.heterogeneousCount === 1 && het3Cert.operationStatus === 'UNFAITHFUL');
  check('P6 §B het3: resultSiteCount === 42 (44 sources, three glued into one -> -2)',
    het3Cert.resultSiteCount === 42);

  console.log('\n--- size-3 heterogeneous ResultSiteCertificate (3-key lineageConflict) ---');
  console.log(JSON.stringify(het3Site, null, 2));

  // =================== P8 §A: the SIGNED pull-back (a per-element sign) =======
  // charter §1.2 / ADR 0001. The signed ledger's UNSIGNED projection is identical
  // to the committed builder's — the sign is purely ADDITIONAL. Reuse the B-twin
  // homogeneous glue (a,b -> one result) with signOf injecting a SIMULATED flip on
  // b, so the signed view is non-trivial while pullBack stays byte-identical.
  const sg = `sg:${a}`;
  const signedResultOf = (s) => (s === a || s === b ? sg : s);
  const signA = (s) => (s === b ? -1 : 1); // simulated flip on b (the gated flip-glue)
  const signedLedger = buildSignedIdentification(midIds, signedResultOf, signA);
  const unsignedLedger = buildLedgerFromIdentification(midIds, signedResultOf);
  const deepEq = (p, q) => JSON.stringify(p) === JSON.stringify(q);

  check('P8 §A: signed.pullBack DEEP-EQUALS buildLedgerFromIdentification().pullBack (unsigned projection identical)',
    deepEq(signedLedger.pullBack, unsignedLedger.pullBack));
  check('P8 §A: signed.forward DEEP-EQUALS the unsigned forward', deepEq(signedLedger.forward, unsignedLedger.forward));
  check('P8 §A: signedPullBack[r] sources (ignoring sign) === pullBack[r] for EVERY result r (views agree on membership)',
    Object.keys(signedLedger.pullBack).every((r) =>
      signedLedger.signedPullBack[r].length === signedLedger.pullBack[r].length &&
      sameSet(signedLedger.signedPullBack[r].map((e) => e.source), signedLedger.pullBack[r])));
  check('P8 §A: signedPullBack[sg] is the 2-set {a,b}; b carries the simulated flip (-1), a is +1',
    Array.isArray(signedLedger.signedPullBack[sg]) &&
      sameSet(signedLedger.signedPullBack[sg].map((e) => e.source), [a, b]) &&
      signedLedger.signedPullBack[sg].find((e) => e.source === b).sign === -1 &&
      signedLedger.signedPullBack[sg].find((e) => e.source === a).sign === 1);
  const signedProjCert = certifyFaithfulness({ forward: signedLedger.forward, pullBack: signedLedger.pullBack }, lineageOf);
  const unsignedCert = certifyFaithfulness(unsignedLedger, lineageOf);
  check('P8 §A: certifyFaithfulness on the signed projection === the unsigned build cert (sign-agnostic, committed fn reused)',
    deepEq(signedProjCert, unsignedCert));

  // =================== P8 §B: the sign is READ OFF the substrate ==============
  // charter §1.2. B-twins a,b share the SAME oriented source edge -> +1
  // (orientation-PRESERVING, the substrate-derived case). The reversal branch is
  // exercised on a SYNTHETIC reversed edge (the engine produces no [B,A]).
  const edgeA = o3.vertices[a].createdBy.sourceVertexIds;
  const edgeB = o3.vertices[b].createdBy.sourceVertexIds;
  check('P8 §B: a,b createdBy.sourceVertexIds are the SAME source edge (same 2-set)',
    edgeA.length === 2 && edgeB.length === 2 && sameSet(edgeA, edgeB));
  check('P8 §B: boundarySign(a, b, o3) === +1 (B-twins share [A,B] order -> orientation-PRESERVING)',
    boundarySign(a, b, o3) === 1);
  const synthShape = {
    vertices: {
      p: { createdBy: { sourceVertexIds: [edgeA[0], edgeA[1]] } },
      q: { createdBy: { sourceVertexIds: [edgeA[1], edgeA[0]] } }, // REVERSED order [B,A]
    },
  };
  check('P8 §B: boundarySign detects reversal -> -1 (same edge, reversed reference order — the simulated flip-glue)',
    boundarySign('p', 'q', synthShape) === -1);
  check('P8 §B: boundarySign(p, p, synth) === +1 (same order — sanity, the preserving default)',
    boundarySign('p', 'p', synthShape) === 1);

  // =================== P8 §C: w₁ over CYCLES (signs COMPOSE) =================
  // charter §1.2/§3. Build a signed ledger over a handful of real sites with
  // signOf injecting the simulated flips, then certify orientation over SYNTHETIC
  // cycles. netSign = PRODUCT of the cycle's signs; w1 = 1 iff ANY cycle is -1; a
  // two-flip cycle COMPOSES to +1 (the Klein-vs-Möbius distinction). NO pull-back
  // SET is ever flagged inconsistent — only whole cycles carry a verdict.
  const cSources = [...midIds].sort().slice(0, 5); // 5 real sites
  const flipSet = new Set([cSources[1], cSources[3]]); // simulate flips on two
  const signC = (s) => (flipSet.has(s) ? -1 : 1);
  const signedC = buildSignedIdentification(cSources, (s) => `r:${s}`, signC);

  const allPlus = certifyOrientation(signedC, [[cSources[0], cSources[2], cSources[4]]]);
  const oneMinus = certifyOrientation(signedC, [[cSources[0], cSources[1], cSources[2]]]); // one flip (cSources[1])
  const twoMinus = certifyOrientation(signedC, [[cSources[1], cSources[3]]]); // two flips -> compose
  const mixedCycles = certifyOrientation(signedC, [
    [cSources[0], cSources[2]], // +1
    [cSources[0], cSources[1], cSources[2]], // -1 -> drives w1
  ]);

  check('P8 §C all-+1 cycle: netSign +1, orientable true, w1 0 (an orientable loop — cylinder/torus)',
    allPlus.perCycle[0].netSign === 1 && allPlus.perCycle[0].orientable === true &&
      allPlus.w1 === 0 && allPlus.nonOrientable === false);
  check('P8 §C ONE -1 cycle: netSign -1, orientable false, w1 1, nonOrientable true (Möbius/Klein/RPn — FAITHFUL DATA)',
    oneMinus.perCycle[0].netSign === -1 && oneMinus.perCycle[0].orientable === false &&
      oneMinus.w1 === 1 && oneMinus.nonOrientable === true);
  check('P8 §C TWO -1 cycle: netSign +1, orientable true, w1 0 (the two flips COMPOSE/cancel — signs compose)',
    twoMinus.perCycle[0].netSign === 1 && twoMinus.perCycle[0].orientable === true && twoMinus.w1 === 0);
  check('P8 §C: w1 === 1 iff ANY cycle is -1 (mixed: one +1 cycle and one -1 cycle -> w1 1)',
    mixedCycles.w1 === 1 && mixedCycles.perCycle[0].netSign === 1 && mixedCycles.perCycle[1].netSign === -1);
  check('P8 §C: certifyOrientation flags NO pull-back set inconsistent — keys are exactly {perCycle,w1,nonOrientable}',
    sameSet(Object.keys(oneMinus), ['perCycle', 'w1', 'nonOrientable']));

  // =================== P8 §D: orientation is DATA, not a clash ===============
  // charter §3 (RULED). A NON-ORIENTABLE (w1=1) but lineage-HOMOGENEOUS glue stays
  // FAITHFUL — orientation never enters the clash accounting. The two certificates
  // are ORTHOGONAL: faithfulness reads pullBack, certifyOrientation reads
  // signedPullBack; neither reads the other. The committed cert fields are unchanged.
  const dGlue = buildSignedIdentification(midIds, signedResultOf, signA); // a:+1, b:-1 (simulated flip)
  const dFaith = certifyFaithfulness({ forward: dGlue.forward, pullBack: dGlue.pullBack }, lineageOf);
  const dOrient = certifyOrientation(dGlue, [[a, b]]); // a:+1 * b:-1 -> netSign -1 -> non-orientable

  check('P8 §D: the glue is NON-ORIENTABLE (w1 === 1) — a is +1, b is the simulated flip',
    dOrient.w1 === 1 && dOrient.nonOrientable === true);
  check("P8 §D: yet operationStatus === 'FAITHFUL' (orientation is faithful DATA; w1!=0 does NOT make it unfaithful)",
    dFaith.operationStatus === 'FAITHFUL' && dFaith.heterogeneousCount === 0 && dFaith.removedSilentCount === 0);
  const dGlueFlipped = buildSignedIdentification(midIds, signedResultOf, () => -1); // flip EVERY sign
  const dFaithFlipped = certifyFaithfulness({ forward: dGlueFlipped.forward, pullBack: dGlueFlipped.pullBack }, lineageOf);
  check('P8 §D: faithfulness is sign-AGNOSTIC (flipping every sign yields the IDENTICAL FaithfulnessCertificate)',
    deepEq(dFaith, dFaithFlipped));
  check('P8 §D: operationStatus is EXACTLY (heterogeneousCount===0 AND removedSilentCount===0) — no sign term enters',
    dFaith.operationStatus === (dFaith.heterogeneousCount === 0 && dFaith.removedSilentCount === 0 ? 'FAITHFUL' : 'UNFAITHFUL'));
  check('P8 §D: FaithfulnessCertificate keys are the committed 8 (NO sign/orientation/w1 field added to the clash layer)',
    sameSet(Object.keys(dFaith), ['perResultSite', 'perCutSource', 'resultSiteCount', 'homogeneousCount',
      'heterogeneousCount', 'removedLoggedCount', 'removedSilentCount', 'operationStatus']));
  check('P8 §D: OrientationCertificate is key-DISJOINT from FaithfulnessCertificate (orthogonal layers)',
    Object.keys(dOrient).every((k) => !Object.keys(dFaith).includes(k)));

  console.log('\n--- P8 signed pull-back + w1 (orientation as faithful data) ---');
  console.log(
    JSON.stringify(
      {
        signedPullBack_sg: signedLedger.signedPullBack[sg],
        boundarySign_ab: boundarySign(a, b, o3),
        cycleW1: { allPlus: allPlus.w1, oneMinus: oneMinus.w1, twoMinus: twoMinus.w1, mixed: mixedCycles.w1 },
        nonOrientable_but_faithful: { w1: dOrient.w1, operationStatus: dFaith.operationStatus },
      },
      null,
      2,
    ),
  );
}

console.log(`\n${failures === 0 ? 'ALL PASS' : failures + ' FAILURE(S)'}`);
process.exit(failures === 0 ? 0 : 1);

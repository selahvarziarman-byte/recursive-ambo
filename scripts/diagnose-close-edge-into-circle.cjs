#!/usr/bin/env node

// DIAGNOSTIC — The First Loop: closeEdgeIntoCircle on REAL input.
// Seals §A (operation + ledger) · §B (faithfulness: co-location ≠ identity) ·
// §C (orientation trivially zero at level 1) · §D (the ruled level-1 valence +
// the dimension-mismatch demonstration) · §E (the loop closes in one pass).
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard —
// delete closeEdgeIntoCircle.ts (or any committed certifier) and these requires throw.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
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
const req = (p) => require(path.join(repoRoot, p));

// The NEW operation module (the only new TS file) + the committed substrate it wires.
const { closeEdgeIntoCircle, classifyLevel1Link } = req('src/lib/closeEdgeIntoCircle.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { shapeLineageOf, boundarySign, certifyFaithfulness, certifyOrientation } = req(
  'src/lib/transformationLedger.ts',
);
// decomposeLink is the COMMITTED level-2 (S¹) member — imported here to demonstrate the
// dimension mismatch (it is NOT modified; the level-1 member lives in the new module).
const { decomposeLink } = req('src/lib/incidenceTraceRegistry.ts');

let failures = 0;
function check(label, condition) {
  if (condition) {
    console.log(`PASS - ${label}`);
  } else {
    console.log(`FAIL - ${label}`);
    failures += 1;
  }
}
const deepEq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const asSet = (arr) => [...arr].slice().sort();

// ---- the one deterministic real edge (spec §5) ----
const shape = createSeedShape('tetrahedron');
const shapeSnapshot = JSON.stringify(shape); // for the DERIVE-ONLY deep-equal
const edge = shape.edges[0];
const [x, y] = edge.vertexIds;
const lineageOf = shapeLineageOf(shape);
const trace = closeEdgeIntoCircle(shape, edge);

// ===================== §A — operation + ledger =====================
check('§A x !== y (two distinct seed endpoints)', x !== y);
check('§A trace.identified === [x, y]', deepEq(trace.identified, [x, y]));
check(
  '§A trace.support is a single NEW id (not x, not y)',
  typeof trace.support === 'string' && trace.support !== x && trace.support !== y,
);
check(
  '§A pullBack[support] is EXACTLY the 2-set {x, y}',
  deepEq(asSet(trace.ledger.pullBack[trace.support]), asSet([x, y])) &&
    trace.ledger.pullBack[trace.support].length === 2,
);
check(
  '§A forward[x] === support === forward[y]',
  trace.ledger.forward[x] === trace.support && trace.ledger.forward[y] === trace.support,
);
check(
  '§A no other forward entry maps to support',
  Object.keys(trace.ledger.forward).filter((k) => trace.ledger.forward[k] === trace.support)
    .length === 2,
);
check(
  '§A DERIVE-ONLY: input shape is byte-unchanged by the call (deep-equal before/after)',
  JSON.stringify(shape) === shapeSnapshot,
);
check(
  '§A DERIVE-ONLY: vertex/edge/face counts unchanged',
  Object.keys(shape.vertices).length === 4 && shape.edges.length === 6 && shape.faces.length === 4,
);

// ===================== §B — faithfulness (co-location ≠ identity) =====================
const supportCert = trace.faithfulness.perResultSite.find((c) => c.resultSiteId === trace.support);
const lx = lineageOf(x);
const ly = lineageOf(y);
// The STRUCTURAL law (always true, regardless of which seed edge): homogeneity ⟺ lineage equality.
check(
  '§B supportCert.lineageHomogeneous === (lineageOf(x) === lineageOf(y))',
  supportCert.lineageHomogeneous === (lx === ly),
);
check(
  '§B faithfulness === certifyFaithfulness(unsigned projection, lineageOf) reused verbatim',
  deepEq(
    trace.faithfulness,
    certifyFaithfulness(
      { forward: trace.ledger.forward, pullBack: trace.ledger.pullBack },
      lineageOf,
    ),
  ),
);
// The READ ACTUALS for this distinct-endpoint seed edge: HETEROGENEOUS / UNFAITHFUL.
check('§B (actual) lineageOf(x) !== lineageOf(y) — distinct seed lineages', lx !== ly);
check('§B (actual) support status === lineage-heterogeneous', supportCert.status === 'lineage-heterogeneous');
check('§B (actual) inheritedLineage === null (NO fabricated identity)', supportCert.inheritedLineage === null);
check(
  '§B (actual) lineageConflict === the 2-set {lineageOf(x), lineageOf(y)}',
  deepEq(asSet(supportCert.lineageConflict), asSet([lx, ly])),
);
check('§B (actual) heterogeneousCount === 1', trace.faithfulness.heterogeneousCount === 1);
check('§B (actual) operationStatus === UNFAITHFUL', trace.faithfulness.operationStatus === 'UNFAITHFUL');
console.log(
  `  ↳ READ-ACTUALS: edge ${edge.id} [${x}, ${y}] | lineageOf(x)=${lx} | lineageOf(y)=${ly} | verdict=${trace.faithfulness.operationStatus} (co-location ≠ identity — the ledger refuses to fabricate identity)`,
);

// ===================== §C — orientation (trivially zero at level 1) =====================
check(
  '§C trace.orientation === certifyOrientation(ledger, [[x, y]]) reused verbatim',
  deepEq(trace.orientation, certifyOrientation(trace.ledger, [[x, y]])),
);
check('§C w1 === 0 (S¹ is always orientable — a 1-cell carries no flip)', trace.orientation.w1 === 0);
check('§C nonOrientable === false', trace.orientation.nonOrientable === false);
check('§C the circle cycle netSign === +1', trace.orientation.perCycle[0].netSign === 1);
check(
  '§C boundarySign(y, x, shape) === +1 (endpoints share no source-edge -> the +1 default)',
  boundarySign(y, x, shape) === 1,
);
console.log(
  `  ↳ RECORD: the sign machinery is the 2-cell flip-glue instrument; NOT load-bearing at level 1 (w1=${trace.orientation.w1}).`,
);

// ===================== §D — the ruled level-1 valence + dimension mismatch =====================
check('§D trace.supportDegree === 2', trace.supportDegree === 2);
check('§D classifyLevel1Link(2) === interior (a closed 1-manifold point)', classifyLevel1Link(2) === 'interior');
check('§D classifyLevel1Link(1) === boundary (a free end D⁰)', classifyLevel1Link(1) === 'boundary');
check('§D classifyLevel1Link(3) === junction (a Y, degree ≥3)', classifyLevel1Link(3) === 'junction');
check('§D trace.level1Valence === interior', trace.level1Valence === 'interior');
// DIMENSION-MISMATCH demonstrated: decomposeLink (the S¹/level-2 instrument) fed the
// support's S⁰ link (two arc-ends, no link-edges) returns 'junction' (a 2-component
// pinch) — that is decomposeLink applied BELOW its dimension, NOT the support's class.
const s0Link = new Map([
  [x, []],
  [y, []],
]);
const s0Decomp = decomposeLink(s0Link);
check(
  '§D decomposeLink(S⁰ link).valence === junction (level-2 instrument below its dimension — a 2-component pinch)',
  s0Decomp.valence === 'junction',
);
check('§D and classifyLevel1Link(2) === interior — the support IS level-1 interior via degree-count', classifyLevel1Link(2) === 'interior');
console.log(
  `  ↳ DIMENSION-INDEXED FAMILY: level-1 member classifyLevel1Link(2)=interior (the support); level-2 member decomposeLink(S⁰)=${s0Decomp.valence} (mismatch — applied below its dimension). decomposeLink UNCHANGED.`,
);

// ===================== §E — the loop closes =====================
check('§E trace.passes === 1 (the single identification reaches fixpoint in one pass)', trace.passes === 1);
check(
  '§E the trace assembles all four: ledger {x↔y} + faithfulness + orientation + level-1 valence',
  Boolean(trace.ledger.pullBack[trace.support]) &&
    trace.faithfulness.operationStatus === 'UNFAITHFUL' &&
    trace.orientation.w1 === 0 &&
    trace.level1Valence === 'interior',
);
check(
  '§E the standalone line forces no further identification (forward is exactly {x, y})',
  asSet(Object.keys(trace.ledger.forward)).join(',') === asSet([x, y]).join(','),
);

// ===================== SUMMARY =====================
const total = failures;
console.log('');
console.log(`--- close-edge-into-circle: ${total === 0 ? 'no failures' : total + ' FAIL'} ---`);
console.log('');
if (total === 0) {
  console.log('ALL PASS');
} else {
  console.log(`${total} FAIL`);
  process.exitCode = 1;
}

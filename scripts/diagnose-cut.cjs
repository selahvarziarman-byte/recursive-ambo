#!/usr/bin/env node

// DIAGNOSTIC — `cut`: the removal operation (completes the atomic set).
// §A the loss clause on real material (FAITHFUL by logging — the first faithful real
// result; SILENT → UNFAITHFUL — the clause's other side, the watch-item).
// §B the boundary valence on real material (an arc — valence-1, first-fired) + the
// CONTRAST (the same vertex's link WITH the cut face is a closed cycle → interior).
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

const { cutCell } = req('src/lib/cutOperation.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { shapeLineageOf, certifyFaithfulness } = req('src/lib/transformationLedger.ts');
const { decomposeLink } = req('src/lib/incidenceTraceRegistry.ts');
const { faceEdgePairs } = req('src/lib/surfaceOperations.ts');

let failures = 0;
function check(label, condition) {
  if (condition) {
    console.log(`PASS - ${label}`);
  } else {
    console.log(`FAIL - ${label}`);
    failures += 1;
  }
}
const note = (msg) => console.log(`  ↳ ${msg}`);

// ---- the one deterministic real 2-cell ----
const shape = createSeedShape('cube');
const shapeSnapshot = JSON.stringify(shape);
const face = shape.faces[0]; // the `bottom` square
const trace = cutCell(shape, face);

// ===================== §A — the loss clause (FAITHFUL by logging) =====================
console.log('----- §A loss clause -----');
check('§A forward[face.id] === null (the removed 2-cell)', trace.ledger.forward[face.id] === null);
check(
  '§A face.id is NOT a key of pullBack (a cut has no result)',
  !Object.prototype.hasOwnProperty.call(trace.ledger.pullBack, face.id),
);
check(
  '§A the boundary vertices pass through (forward[v] === v)',
  face.vertexIds.every((v) => trace.ledger.forward[v] === v),
);

// LOGGED -> FAITHFUL (the FIRST faithful real result)
const logged = trace.faithfulnessLogged;
check('§A LOGGED -> operationStatus === FAITHFUL (the first faithful real result)', logged.operationStatus === 'FAITHFUL');
check('§A LOGGED -> removedLoggedCount === 1', logged.removedLoggedCount === 1);
check('§A LOGGED -> removedSilentCount === 0', logged.removedSilentCount === 0);
check('§A LOGGED -> heterogeneousCount === 0 (no merge — a pure removal)', logged.heterogeneousCount === 0);

// SILENT -> UNFAITHFUL (the clause is real, not assumed — the watch-item)
const silent = trace.faithfulnessSilent;
check('§A SILENT -> operationStatus === UNFAITHFUL', silent.operationStatus === 'UNFAITHFUL');
check('§A SILENT -> removedSilentCount === 1', silent.removedSilentCount === 1);

// the log is GENUINELY WRITTEN: the verdict depends on the removedLog carrying face.id.
check(
  '§A the log is LOAD-BEARING: logged===FAITHFUL XOR silent===FAITHFUL (the only difference is removedLog=[face.id])',
  logged.operationStatus === 'FAITHFUL' && silent.operationStatus === 'UNFAITHFUL',
);

// certifyFaithfulness must NEVER ask for lineageOf(face.id) (face.id has no pull-back).
let faceIdQueried = false;
const guardedLineage = (id) => {
  if (id === face.id) faceIdQueried = true;
  return shapeLineageOf(shape)(id);
};
const guardedCert = certifyFaithfulness(trace.ledger, guardedLineage, [face.id]);
check(
  '§A certifyFaithfulness NEVER queries lineageOf(face.id) (the loss clause is lineage-independent)',
  faceIdQueried === false && guardedCert.operationStatus === 'FAITHFUL',
);

// DERIVE-ONLY
check('§A DERIVE-ONLY: JSON.stringify(shape) byte-identical before/after the call', JSON.stringify(shape) === shapeSnapshot);
note(`READ-ACTUALS: removed=${trace.removed} | LOGGED verdict=${logged.operationStatus} (loggedCount=${logged.removedLoggedCount}) | SILENT verdict=${silent.operationStatus} (silentCount=${silent.removedSilentCount})`);

// ===================== §B — the boundary valence (an arc, valence-1) =====================
console.log('\n----- §B boundary valence -----');
check('§B boundaryVertex is on the cut face (∈ face.vertexIds)', face.vertexIds.includes(trace.boundaryVertex));
check("§B decomposeLink(postCutLink).valence === 'boundary' (the free edge — valence-1)", trace.valence === 'boundary');

// the post-cut link IS an arc — rebuild the adjacency from the exposed Record and decompose.
const postCutAdj = new Map(Object.entries(trace.postCutLink));
const postDecomp = decomposeLink(postCutAdj);
const postDegrees = [...postCutAdj.values()].map((ns) => ns.length);
check('§B post-cut link: junctionLoci empty AND pinch false (one component)', postDecomp.junctionLoci.length === 0 && postDecomp.pinch === false);
check('§B post-cut link: a degree-1 endpoint EXISTS (an open arc end)', postDegrees.some((d) => d === 1));
check('§B post-cut link: NOT allDegree2 (so NOT a closed cycle)', postDegrees.some((d) => d !== 2));
check('§B post-cut link: exactly one stratum, open (closed === false)', postDecomp.strata.length === 1 && postDecomp.strata[0].closed === false);

// CONTRAST — the SAME vertex's link WITH the cut face included is a closed cycle -> interior.
const fullAdj = new Map();
const ensure = (x) => {
  let l = fullAdj.get(x);
  if (!l) {
    l = [];
    fullAdj.set(x, l);
  }
  return l;
};
for (const f of shape.faces) {
  if (!f.vertexIds.includes(trace.boundaryVertex)) continue;
  const edges = faceEdgePairs(f);
  const incoming = edges.find((e) => e[1] === trace.boundaryVertex);
  const outgoing = edges.find((e) => e[0] === trace.boundaryVertex);
  if (!incoming || !outgoing) continue;
  ensure(incoming[0]).push(outgoing[1]);
  ensure(outgoing[1]).push(incoming[0]);
}
const fullDecomp = decomposeLink(fullAdj);
check(
  "§B CONTRAST: the SAME vertex's link WITH the cut face is a closed cycle -> 'interior'",
  fullDecomp.valence === 'interior' && [...fullAdj.values()].every((ns) => ns.length === 2),
);
note(`THE CUT OPENS INTERIOR -> BOUNDARY: with the cut face the link of ${trace.boundaryVertex} is a closed cycle (interior); remove it and the link is an arc (boundary).`);
note(`EXPOSED post-cut link adjacency: ${JSON.stringify(trace.postCutLink)}`);

// ===================== §C — milestone =====================
console.log('\n----- §C milestone -----');
note('With the zoo + cut: BOTH faithfulness clauses (heterogeneous-merge [zoo, UNFAITHFUL] + logged/silent-loss [cut, FAITHFUL/UNFAITHFUL]) AND both manifold valences (interior [zoo] + boundary [cut]) are exercised on real material. The atomic operation set is complete — glue / flip-glue / collapse / cut. Only junction remains (it needs the cascade).');

// ===================== SUMMARY =====================
console.log('');
console.log(`--- cut: ${failures === 0 ? 'no failures' : failures + ' FAIL'} ---`);
console.log('');
if (failures === 0) {
  console.log('ALL PASS');
} else {
  console.log(`${failures} FAIL`);
  process.exitCode = 1;
}

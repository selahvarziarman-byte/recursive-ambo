#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
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
const carrierTablePath = path.join(
  repoRoot,
  'src/lib/fanoOctonionicCarrierTableV0.ts',
);
const packagePath = path.join(repoRoot, 'package.json');
const {
  buildFanoOctonionicCarrierTableV0Report,
} = require(carrierTablePath);

const EXPECTED_CANDIDATE_LIFT_PAIRS = [
  'A·B/D·C',
  'C·D/B·A',
  'A·C/B·D',
  'D·B/C·A',
  'A·D/C·B',
  'B·C/D·A',
];
const EXPECTED_ORIENTED_LIFT_PAIRS = [
  'A·B/D·C',
  'A·C/B·D',
  'A·D/C·B',
];
const EXPECTED_FAMILIAR_TOKEN_PAIRS = [
  'M_AB/M_CD',
  'M_AC/M_BD',
  'M_AD/M_BC',
];
const ROOT_A_FILTER_PATTERNS = [
  "orderedParents[0] === 'A'",
  "orderedParents[0]==='A'",
  "orderedParents[0] == 'A'",
  "orderedParents[0]=='A'",
];
const FORBIDDEN_COMPLEMENT_SOURCE_NAMES = [
  'COMPLEMENT_MAP',
  'HARDCODED_COMPLEMENT',
  'MANUAL_COMPLEMENT',
];

const failures = [];
const report = buildFanoOctonionicCarrierTableV0Report();
const carrierTableSource = readRequiredFile(
  carrierTablePath,
  'Fano octonionic carrier table source',
);
const packageSource = readRequiredFile(packagePath, 'package.json');

runAssertions(report, { carrierTableSource, packageSource });
printTables(report);
printCompactReport(report);

if (failures.length) {
  console.error('');
  console.error('Diagnostics failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log('');
  console.log('Diagnostics passed.');
}

function runAssertions(report, sources) {
  expectEqual(report.ok, true, 'report ok');
  expectEqual(report.method, 'fano-octonionic-carrier-table-v0', 'method');
  expectEqual(report.summary.primalCarrierCount, 4, 'primal carrier count');
  expectEqual(report.summary.pairTokenCount, 6, 'pair token count');
  expectEqual(report.summary.orderedLiftCount, 12, 'ordered lift count');
  expectEqual(report.summary.carrierRayCount, 3, 'carrier ray count');
  expectEqual(
    report.summary.antipodalLiftCandidateCount,
    6,
    'antipodal lift candidate count',
  );
  expectEqual(
    report.summary.antipodalQuotientGroupCount,
    3,
    'antipodal quotient group count',
  );
  expectEqual(
    report.summary.antipodalQuotientCount,
    3,
    'antipodal quotient count',
  );
  expectArrayEqual(
    report.summary.candidateLiftPairs,
    EXPECTED_CANDIDATE_LIFT_PAIRS,
    'candidate lift pairs',
  );
  expectArrayEqual(
    report.summary.orientedLiftPairs,
    EXPECTED_ORIENTED_LIFT_PAIRS,
    'oriented lift pairs',
  );
  expectArrayEqual(
    report.summary.familiarTokenPairs,
    EXPECTED_FAMILIAR_TOKEN_PAIRS,
    'familiar token pairs',
  );
  expectEqual(
    report.antipodalQuotientGroupRows.every((row) => row.candidateCount === 2),
    true,
    'quotient groups contain exactly two candidates',
  );
  expectEqual(
    report.antipodalLiftCandidateRows.every(
      (row) => row.derivationStatus === 'derived-from-ordered-lift-table',
    ),
    true,
    'candidate rows are derived from ordered lift table',
  );
  expectEqual(
    report.summary.candidateDerivationStatus,
    'all-antipodal-lift-candidates-derived-from-ordered-lift-table',
    'candidate derivation status',
  );
  expectEqual(
    report.summary.quotientGroupingStatus,
    'grouped-from-derived-antipodal-lift-candidates',
    'quotient grouping status',
  );
  expectEqual(
    report.summary.representativeSelectionStatus,
    'selected-from-derived-candidate-groups',
    'representative selection status',
  );
  expectEqual(
    report.summary.representativeSelectionRule,
    'lexicographic-token-first-positive-lift-after-derived-candidates',
    'representative selection rule',
  );
  expectEqual(report.summary.rootAFilterStatus, 'not-used', 'root-A filter status');
  expectEqual(
    report.summary.complementDerivationStatus,
    'derived-from-lift-table',
    'complement derivation status',
  );
  expectEqual(
    report.summary.hardCodedComplementMapStatus,
    'not-used-as-source-of-truth',
    'hard-coded complement map status',
  );
  expectEqual(
    report.summary.spinorBridgeStatus,
    'signed-lift-data-ready-not-spinor-representation',
    'spinor bridge status',
  );
  expectEqual(report.summary.emissionStatus, 'not-attached-in-c0', 'emission status');
  expectEqual(report.summary.uiStatus, 'no-ui', 'UI status');
  expectEqual(
    report.summary.recommendedNextGate,
    'C1 - Fano-Octonionic Local Channel Table Prototype',
    'recommended next gate',
  );
  expectEqual(
    report.orderedLiftRows.every((row) => Boolean(row.spinorBridgeData)),
    true,
    'spinor bridge data is present on all ordered lifts',
  );
  expectEqual(
    report.antipodalLiftCandidateRows.every(
      (row) =>
        row.distinctSourceTokens &&
        row.disjointParentSets &&
        row.sameCarrierRay &&
        row.oppositeSign,
    ),
    true,
    'antipodal candidate predicates',
  );
  expectEqual(
    /from\s+['"][^'"]*react['"]|require\(\s*['"]react['"]\s*\)/i.test(
      sources.carrierTableSource,
    ),
    false,
    'no React import',
  );
  expectEqual(
    /from\s+['"][^'"]*(?:[/\\]store[/\\]|geometryStore)|require\(\s*['"][^'"]*(?:[/\\]store[/\\]|geometryStore)/i.test(
      sources.carrierTableSource,
    ),
    false,
    'no store import',
  );
  expectEqual(
    /from\s+['"][^'"]*fieldAtlas|require\(\s*['"][^'"]*fieldAtlas/i.test(
      sources.carrierTableSource,
    ),
    false,
    'no fieldAtlas import',
  );
  expectEqual(
    /from\s+['"][^'"]*fieldCue|require\(\s*['"][^'"]*fieldCue/i.test(
      sources.carrierTableSource,
    ),
    false,
    'no FieldCue import',
  );
  expectEqual(
    /from\s+['"][^'"]*generatedSiteReading|require\(\s*['"][^'"]*generatedSiteReading/i.test(
      sources.carrierTableSource,
    ),
    false,
    'no GeneratedSiteReading import',
  );
  for (const pattern of ROOT_A_FILTER_PATTERNS) {
    expectEqual(
      sources.carrierTableSource.includes(pattern),
      false,
      `source avoids root-A filter ${pattern}`,
    );
  }
  for (const sourceName of FORBIDDEN_COMPLEMENT_SOURCE_NAMES) {
    expectEqual(
      sources.carrierTableSource.includes(sourceName),
      false,
      `source avoids complement source map name ${sourceName}`,
    );
  }
  // THE SMALL RUN (2026-07-14, sealed 2eb45568…9060): §2's sanctioned panel
  // seam (the wall before the door — PlaygroundOperationsPanel.tsx, ratified
  // in diagnose-the-small-run.cjs) rides this working tree until Arman's
  // commit. A status-clean guard cannot tell a sanctioned mandate from drift
  // (the freeze-law lesson, one directory over) — pre-commit exactly that one
  // file may be dirty; post-commit the tree is clean and this allowance is
  // inert.
  expectEqual(
    getChangedPaths(['src/components']).filter(
      (line) => !line.endsWith('src/components/PlaygroundOperationsPanel.tsx'),
    ).length,
    0,
    'no component file changed (beyond the small run’s sanctioned panel seam)',
  );
  expectEqual(
    hasPackageScript(
      sources.packageSource,
      'diagnose:fano-octonionic-carrier-table-v0',
    ),
    true,
    'package script exists',
  );
}

function printTables(report) {
  console.log('FanoOctonionicCarrierTableV0 diagnostics');
  console.log('');
  console.log('primal carriers');
  for (const row of report.primalCarrierRows) {
    console.log(`${row.sourceId}: ${row.carrierUnit}`);
  }

  console.log('');
  console.log('pair source-tokens');
  for (const row of report.pairTokenRows) {
    console.log(`${row.tokenId}: ${row.unorderedParentSet.join('/')}`);
  }

  console.log('');
  console.log('ordered carrier lifts');
  for (const row of report.orderedLiftRows) {
    console.log(
      `${row.liftId}: ${row.tokenId} | ${row.signedLift} | ${row.carrierRay}`,
    );
  }

  console.log('');
  console.log('antipodal lift candidates');
  for (const row of report.antipodalLiftCandidateRows) {
    console.log(
      `${row.orientedLiftPair}: ${row.familiarTokenPair} | ${row.positiveSignedLift}/${row.negativeSignedLift} | ${row.carrierRay}`,
    );
  }

  console.log('');
  console.log('quotient groups');
  for (const row of report.antipodalQuotientGroupRows) {
    console.log(
      `${row.groupId}: ${row.tokenPairKey} | ${row.carrierRay} | ${row.candidateCount} | ${row.candidateLiftPairs.join(', ')} | canonical ${row.canonicalLiftPair}`,
    );
  }

  console.log('');
  console.log('canonical antipodal quotient rows');
  for (const row of report.antipodalQuotientRows) {
    console.log(
      `${row.positiveLiftId}/${row.negativeLiftId}: ${row.positiveTokenId}/${row.negativeTokenId} | ${row.positiveSignedLift}/${row.negativeSignedLift} | ${row.carrierRay}`,
    );
  }

  console.log('');
  console.log('summary');
}

function printCompactReport(report) {
  const summary = report.summary;

  console.log(`primalCarrierCount: ${summary.primalCarrierCount}`);
  console.log(`pairTokenCount: ${summary.pairTokenCount}`);
  console.log(`orderedLiftCount: ${summary.orderedLiftCount}`);
  console.log(`carrierRayCount: ${summary.carrierRayCount}`);
  console.log(
    `antipodalLiftCandidateCount: ${summary.antipodalLiftCandidateCount}`,
  );
  console.log(
    `antipodalQuotientGroupCount: ${summary.antipodalQuotientGroupCount}`,
  );
  console.log(`antipodalQuotientCount: ${summary.antipodalQuotientCount}`);
  console.log(`candidateLiftPairs: ${summary.candidateLiftPairs.join(', ')}`);
  console.log(`orientedLiftPairs: ${summary.orientedLiftPairs.join(', ')}`);
  console.log(`familiarTokenPairs: ${summary.familiarTokenPairs.join(', ')}`);
  console.log(
    `candidateDerivationStatus: ${summary.candidateDerivationStatus}`,
  );
  console.log(`quotientGroupingStatus: ${summary.quotientGroupingStatus}`);
  console.log(
    `representativeSelectionStatus: ${summary.representativeSelectionStatus}`,
  );
  console.log(
    `representativeSelectionRule: ${summary.representativeSelectionRule}`,
  );
  console.log(`rootAFilterStatus: ${summary.rootAFilterStatus}`);
  console.log(
    `complementDerivationStatus: ${summary.complementDerivationStatus}`,
  );
  console.log(
    `hardCodedComplementMapStatus: ${summary.hardCodedComplementMapStatus}`,
  );
  console.log(`spinorBridgeStatus: ${summary.spinorBridgeStatus}`);
  console.log(`emissionStatus: ${summary.emissionStatus}`);
  console.log(`uiStatus: ${summary.uiStatus}`);
  console.log(`recommendedNextGate: ${summary.recommendedNextGate}`);
  console.log(`issue count: ${report.issues.length}`);
}

function readRequiredFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    failures.push(`${label} missing at ${path.relative(repoRoot, filePath)}`);
    return '';
  }

  return fs.readFileSync(filePath, 'utf8');
}

function hasPackageScript(source, scriptName) {
  try {
    const packageJson = JSON.parse(source);

    return Object.prototype.hasOwnProperty.call(
      packageJson.scripts ?? {},
      scriptName,
    );
  } catch (error) {
    failures.push(`package.json parse failed: ${formatError(error)}`);
    return false;
  }
}

function getChangedPaths(paths) {
  const result = spawnSync('git', ['status', '--short', '--', ...paths], {
    cwd: repoRoot,
    encoding: 'utf8',
  });

  if (result.error) {
    failures.push(`git status failed: ${formatError(result.error)}`);
    return [];
  }

  if (result.status !== 0) {
    failures.push(`git status failed: ${result.stderr.trim()}`);
    return [];
  }

  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function expectArrayEqual(actual, expected, label) {
  expectEqual(
    actual.length === expected.length &&
      actual.every((value, index) => value === expected[index]),
    true,
    label,
  );
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    failures.push(`${label}: expected ${formatValue(expected)}, got ${formatValue(actual)}`);
  }
}

function formatValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
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
const modulePath = path.join(repoRoot, 'src/lib/moufangAutomorphismGaugeV0.ts');
const {
  buildMoufangAutomorphismGaugeV0Report,
  AUTOMORPHISM_SITE_LOCAL_DRAWS,
} = require(modulePath);

// Forbidden verdict labels (the auditor classifies against the sealed rule).
const FORBIDDEN_LABEL_TOKENS = ['well-defined', 'gauge-invariant', 'informative'];

const failures = [];
const report = buildMoufangAutomorphismGaugeV0Report();

runAssertions(report);
printReport(report);

if (failures.length) {
  console.error('');
  console.error(`Diagnostic failures (${failures.length}):`);

  for (const failure of failures) {
    console.error(`  - ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log('');
  console.log('Diagnostic assertions passed.');
}

function bestEffortGitEcho() {
  const echo = { branch: 'unavailable', head: 'unavailable' };

  try {
    echo.branch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    echo.head = execSync('git rev-parse --short HEAD', {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    // best-effort only
  }

  return echo;
}

function runAssertions(reportValue) {
  if (!reportValue.ok || reportValue.integrityIssueCount !== 0) {
    failures.push(
      `Report integrity issues present (${reportValue.integrityIssueCount}): ${reportValue.integrityIssues
        .map((issue) => issue.code)
        .join(', ')}`,
    );
  }

  if (
    reportValue.verdictStatus !==
    'no-gate0-verdict-auditor-classifies-against-hash-committed-sealed-rule'
  ) {
    failures.push(`Unexpected verdictStatus: ${reportValue.verdictStatus}`);
  }

  const group = reportValue.automorphismGroup;

  if (group.candidateCount !== 645120) {
    failures.push(`Census candidate count mismatch: ${group.candidateCount}`);
  }

  if (
    group.distinctCollineationCount !== 168 ||
    group.canonicalLiftCount !== 168 ||
    !group.allCanonicalLiftsMultiplicative ||
    group.linePreservingCollineationCount !== group.canonicalLiftCount
  ) {
    failures.push(
      `Automorphism group shape mismatch: collineations ${group.distinctCollineationCount}, canonical lifts ${group.canonicalLiftCount}, multiplicative ${group.allCanonicalLiftsMultiplicative}, line-preserving ${group.linePreservingCollineationCount}.`,
    );
  }

  if (group.productLawCheckTotal !== group.canonicalLiftCount * 49) {
    failures.push(`Product-law check total mismatch: ${group.productLawCheckTotal}`);
  }

  if (!reportValue.run2OrbitCorrespondence.bijectionHolds) {
    failures.push('Run-2 orbit correspondence bijection does not hold.');
  }

  if (
    reportValue.globalGauge.pairCount !==
    reportValue.globalGauge.automorphismCount * reportValue.globalGauge.loopCount
  ) {
    failures.push('Global gauge pair count mismatch.');
  }

  if (reportValue.siteLocalDraws.draws !== AUTOMORPHISM_SITE_LOCAL_DRAWS) {
    failures.push(`Site-local draw count mismatch: ${reportValue.siteLocalDraws.draws}`);
  }

  for (const probe of reportValue.siteLocalProbes) {
    if (probe.comboCount !== 168 * 168) {
      failures.push(`Probe ${probe.familyId} combo count mismatch: ${probe.comboCount}`);
    }
  }

  // The one mandated void condition.
  if (!reportValue.mockSolution.patternBroke) {
    failures.push(
      'MOCK-SOLUTION VOID: the scrambled carrier assignment reproduced the true Re-pattern; the diagnostic is reading constants, not carrier facts.',
    );
  }

  for (const row of reportValue.anomalyLedger) {
    if (row.derivationStatus !== '') {
      failures.push(`Ledger row ${row.ledgerId} has non-empty derivationStatus.`);
    }
  }

  const serialized = JSON.stringify(reportValue).toLowerCase();

  for (const token of FORBIDDEN_LABEL_TOKENS) {
    if (serialized.includes(token)) {
      failures.push(`Forbidden verdict-label token present in report: ${token}`);
    }
  }

  const packageSource = fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8');

  if (packageSource.includes('moufang')) {
    failures.push('package.json gained a moufang entry; it must stay untouched.');
  }
}

function printReport(reportValue) {
  const gitEcho = bestEffortGitEcho();

  console.log('=== moufang-automorphism-gauge-v0 (CBF Gate 0, Run 3; the one bounded repair) ===');
  console.log('');
  console.log('--- REPO-IDENTITY GATE ECHO ---');
  console.log(`declared path:   ${reportValue.declaredGate.declaredPath}`);
  console.log(`declared branch: ${reportValue.declaredGate.declaredBranch}`);
  console.log(`declared HEAD at authoring: ${reportValue.declaredGate.declaredHeadAtAuthoring}`);
  console.log(`seal note: ${reportValue.declaredGate.sealNote}`);
  console.log(`ruling: ${reportValue.declaredGate.rulingNote}`);
  console.log(`live git echo (best-effort): branch=${gitEcho.branch} head=${gitEcho.head}`);
  console.log('');
  console.log(`reportId:      ${reportValue.reportId}`);
  console.log(`scope:         ${reportValue.diagnosticScope}`);
  console.log(`verdictStatus: ${reportValue.verdictStatus}`);
  console.log(`run-2 standing: ${reportValue.run2Standing}`);
  console.log(`seed:          ${reportValue.seed}`);
  console.log('consumed substrates (READ-ONLY):');

  for (const entry of reportValue.consumedSubstrates) {
    console.log(`  - ${entry}`);
  }

  console.log('stream consumption order:');

  for (const entry of reportValue.streamConsumptionOrder) {
    console.log(`  ${entry}`);
  }

  console.log('');
  console.log('--- TRUE CONFIGURATION (consumed from Run 2, recomputed fresh) ---');
  console.log(
    `links: ${reportValue.trueLinkAssignment
      .map((entry) => `${entry.edge}=${entry.valueKey}`)
      .join('  ')}`,
  );
  console.log(`true Re vector (22 loops): [${reportValue.trueReVector.join(', ')}]`);
  console.log(`anti-staple alarms: ${reportValue.antiStapleAlarms.length}`);

  for (const alarm of reportValue.antiStapleAlarms) {
    console.log(`  ALARM ${alarm.alarmId} [${alarm.context}] ${alarm.detail}`);
    console.log(`    escalation: ${alarm.escalationNote}`);
  }

  console.log('');
  console.log('--- AUTOMORPHISM GROUP (derived from the consumed product law) ---');
  const group = reportValue.automorphismGroup;
  console.log(
    `exhaustive monomial census: ${group.candidateCount} candidates (7! x 2^7) -> ${group.monomialAutomorphismCount} signed-unit automorphisms`,
  );
  console.log(
    `distinct collineations: ${group.distinctCollineationCount}; sign-lifts per collineation: min ${group.liftsPerCollineationMin} / max ${group.liftsPerCollineationMax}`,
  );
  console.log(
    `canonical lifts (gauge set): ${group.canonicalLiftCount} (${group.canonicalLiftSelectionRule})`,
  );
  console.log(
    `product-law preservation: ${group.productLawCheckTotal} checks (${group.productLawChecksPerLift} per lift); all canonical lifts multiplicative: ${group.allCanonicalLiftsMultiplicative}`,
  );
  console.log(
    `line preservation: ${group.linePreservingCollineationCount}/${group.canonicalLiftCount} canonical lifts permute the 7 derived lines among themselves`,
  );
  console.log(
    `derived Fano lines: ${group.derivedFanoLines.map((line) => `{${line.join(',')}}`).join(' ')}`,
  );
  console.log('');
  console.log('--- RUN-2 ORBIT CORRESPONDENCE ---');
  const orbit = reportValue.run2OrbitCorrespondence;
  console.log(
    `Run-2 quadrangle labelings: ${orbit.run2LabelingCount}; matched to collineations: ${orbit.matchedLabelingCount}; distinct collineations covered: ${orbit.distinctCollineationsCovered}; bijection holds: ${orbit.bijectionHolds}`,
  );
  console.log(`note: ${orbit.note}`);

  console.log('');
  console.log('--- TEST 1: GLOBAL AUTOMORPHISM GAUGE ---');
  const globalGauge = reportValue.globalGauge;
  console.log(
    `automorphisms ${globalGauge.automorphismCount} x loops ${globalGauge.loopCount} = ${globalGauge.pairCount} pairs`,
  );
  console.log(
    `full Re-pattern match: ${globalGauge.fullPatternMatchCount}/${globalGauge.automorphismCount} automorphisms (fraction ${globalGauge.fullPatternMatchFraction.toFixed(4)})`,
  );
  console.log(
    `holonomy covariance H' = phi(H): ${globalGauge.covarianceEqualCount}/${globalGauge.pairCount} pairs; Re fixed: ${globalGauge.reFixedCount}/${globalGauge.pairCount} pairs`,
  );
  console.log('per-loop Re across the group:');

  for (const row of globalGauge.perLoopRows) {
    console.log(
      `  ${row.loopId}: Re values {${row.distinctReValuesAcrossGroup.join(', ')}}, identical across group: ${row.reIdenticalAcrossGroup}`,
    );
  }

  console.log('raw covariance samples:');

  for (const sample of globalGauge.samples) {
    console.log(
      `  ${sample.autId} :: ${sample.loopId}: H=${sample.holonomy} H'=${sample.transformedHolonomy} phi(H)=${sample.phiOfHolonomy} Re ${sample.reBefore} -> ${sample.reAfter}`,
    );
  }

  console.log('');
  console.log('--- TEST 2: SITE-LOCAL AUTOMORPHISM GAUGE ---');
  const relationSet = reportValue.siteLocalRelationSet;
  console.log(
    `carrier composition law derived from the ORIGINAL links: pair relations U(i->j)*U(j->i)=+1 held ${relationSet.pairRelationsHeld}/${relationSet.pairRelationCandidateCount}; triple relations U(i->j)*U(j->k)=U(i->k) held ${relationSet.tripleRelationsHeld}/${relationSet.tripleRelationCandidateCount}; excluded ${relationSet.excludedRelations.length}`,
  );
  const draws = reportValue.siteLocalDraws;
  console.log(
    `random draws K=${draws.draws} (global draws among them: ${draws.globalDrawCount}):`,
  );
  console.log(
    `  structure-consistent: ${draws.consistentCount}/${draws.draws}; consistent AND non-global: ${draws.consistentNonGlobalCount}`,
  );
  console.log(
    `  Re full-pattern match: ${draws.reFullMatchCount}/${draws.draws}; full-match among consistent: ${draws.reFullMatchAmongConsistentCount}`,
  );
  console.log(
    `  pattern match (of 22): mean ${draws.patternMatchMean.toFixed(3)} | p95 ${draws.patternMatchP95} | max ${draws.patternMatchMax}`,
  );
  console.log('  per-loop Re invariance fractions:');
  console.log(
    `    ${draws.perLoopReInvariantFraction
      .map((entry) => `${entry.loopId}=${entry.fraction.toFixed(3)}`)
      .join('  ')}`,
  );
  console.log('bounded deterministic probes (declared families; not a nonexistence proof):');

  for (const probe of reportValue.siteLocalProbes) {
    console.log(
      `  [${probe.familyId}] combos ${probe.comboCount}: consistent ${probe.consistentCount}; consistent non-global ${probe.consistentNonGlobalCount}; of those, Re full-match ${probe.consistentNonGlobalReFullMatchCount}`,
    );

    for (const example of probe.exampleConsistentNonGlobal) {
      console.log(`    example: ${example}`);
    }
  }

  const joint = reportValue.siteLocalJointResult;
  console.log(
    `JOINT RESULT: structure-consistent non-global gauges found: ${joint.structureConsistentNonGlobalFound} (total ${joint.totalConsistentNonGlobalAcrossDrawsAndProbes}); preserving the full Re-pattern: ${joint.consistentNonGlobalPreservingReCount}; breaking it: ${joint.consistentNonGlobalBreakingReCount}`,
  );

  console.log('');
  console.log('--- MOCK-SOLUTION TEST (anti-staple, carry-over) ---');
  console.log(`scramble: ${reportValue.mockSolution.scrambleDescription}`);
  console.log('scrambled assignment (edge: true -> scrambled):');
  console.log(
    `  ${reportValue.mockSolution.scrambledAssignment
      .map((entry) => `${entry.edge}: ${entry.trueValueKey}->${entry.scrambledValueKey}`)
      .join('  ')}`,
  );
  console.log(`true Re vector:      [${reportValue.mockSolution.trueReVector.join(', ')}]`);
  console.log(`scrambled Re vector: [${reportValue.mockSolution.scrambledReVector.join(', ')}]`);
  console.log(
    `loops equal: ${reportValue.mockSolution.loopsEqualCount}/${reportValue.mockSolution.loopCount}; pattern broke: ${reportValue.mockSolution.patternBroke}`,
  );

  console.log('');
  console.log('--- ANOMALY LEDGER (derivationStatus left empty for the auditor) ---');

  for (const row of reportValue.anomalyLedger) {
    console.log(`  ${row.ledgerId} [${row.context}] derivationStatus=''`);
    console.log(`    ${row.measurement}`);
  }

  console.log('');
  console.log('--- INTEGRITY (well-formedness only; no outcome assertions) ---');
  console.log(`integrity issues: ${reportValue.integrityIssueCount}`);

  for (const issue of reportValue.integrityIssues) {
    console.log(`  - ${issue.code}: ${issue.message}`);
  }

  console.log(`ok: ${reportValue.ok}`);
}

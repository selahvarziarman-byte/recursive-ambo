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
const modulePath = path.join(repoRoot, 'src/lib/mixedLoopValidityGauntletV0.ts');
const {
  buildMixedLoopValidityGauntletV0Report,
  GAUNTLET_CONTROL_DRAWS,
} = require(modulePath);

// The four per-class verdict labels the auditor owns. The caveat text is
// stripped before scanning (it legitimately contains 'ill-definedness').
const FORBIDDEN_VERDICT_TOKENS = ['validated', 'ill-defined', 'uninformative', 'gauge-variant'];

const failures = [];
const report = buildMixedLoopValidityGauntletV0Report();

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
    'no-validity-verdict-auditor-classifies-against-hash-committed-sealed-rule'
  ) {
    failures.push(`Unexpected verdictStatus: ${reportValue.verdictStatus}`);
  }

  if (reportValue.scope.classCount !== 10) {
    failures.push(`Expected 10 scope classes, got ${reportValue.scope.classCount}`);
  }

  if (!reportValue.scope.inventoryVerified) {
    failures.push('Consumed inventory verification failed.');
  }

  if (
    reportValue.consistencyCondition.cyclesChecked !==
    reportValue.consistencyCondition.cyclesConsistent
  ) {
    failures.push('Binding consistency condition failed on at least one cycle.');
  }

  if (
    reportValue.consistencyCondition.expressionsVerified !==
    reportValue.consistencyCondition.expressionsReproducedStored
  ) {
    failures.push('At least one derivation expression failed to reproduce its stored link.');
  }

  if (!reportValue.censusCrossCheck.matches) {
    failures.push('Automorphism census cross-check against the consumed Run-3 report failed.');
  }

  if (!reportValue.siteLocal.globalCoincidenceVerified) {
    failures.push('Global coincidence of the two action forms failed.');
  }

  for (const control of reportValue.controls) {
    if (control.eligible && control.draws !== GAUNTLET_CONTROL_DRAWS) {
      failures.push(`Control draw count mismatch at ${control.classSignature}/${control.controlId}`);
    }
  }

  if (!reportValue.mock.voidGuardPassed) {
    failures.push(
      'MOCK VOID-GUARD: the scrambled links changed neither any Re-pattern nor any classification.',
    );
  }

  for (const row of reportValue.anomalyLedger) {
    if (row.derivationStatus !== '') {
      failures.push(`Ledger row ${row.ledgerId} has non-empty derivationStatus.`);
    }
  }

  let serialized = JSON.stringify(reportValue).toLowerCase();
  serialized = serialized
    .split(JSON.stringify(reportValue.governingQuaternionicCaveat).toLowerCase())
    .join('');

  for (const token of FORBIDDEN_VERDICT_TOKENS) {
    if (serialized.includes(token)) {
      failures.push(`Forbidden per-class verdict token present in report: ${token}`);
    }
  }

  const packageSource = fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8');

  if (packageSource.includes('gauntlet')) {
    failures.push('package.json gained a gauntlet entry; it must stay untouched.');
  }
}

function printReport(reportValue) {
  const gitEcho = bestEffortGitEcho();

  console.log('=== mixed-loop-validity-gauntlet-v0 (CBF F-I Phase-1, Run 2) ===');
  console.log('');
  console.log('--- GOVERNING CONSTRAINT (verbatim) ---');
  console.log(reportValue.governingQuaternionicCaveat);
  console.log('');
  console.log(reportValue.yellowFlag);
  console.log('');
  console.log('--- REPO-IDENTITY GATE ECHO ---');
  console.log(`declared path:   ${reportValue.declaredGate.declaredPath}`);
  console.log(`declared branch: ${reportValue.declaredGate.declaredBranch}`);
  console.log(`declared HEAD at authoring: ${reportValue.declaredGate.declaredHeadAtAuthoring}`);
  console.log(`seal note: ${reportValue.declaredGate.sealNote}`);
  console.log(`live git echo (best-effort): branch=${gitEcho.branch} head=${gitEcho.head}`);
  console.log('');
  console.log(`reportId:      ${reportValue.reportId}`);
  console.log(`scope:         ${reportValue.diagnosticScope}`);
  console.log(`verdictStatus: ${reportValue.verdictStatus}`);
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
  console.log('--- THE HOLONOMY DEFINITION (the load-bearing decision; declared in the audited plan) ---');

  for (const line of reportValue.holonomyDefinition) {
    console.log(`  ${line}`);
  }

  console.log('');
  console.log('--- SCOPE / CONSISTENCY / CENSUS ---');
  console.log(
    `scope: ${reportValue.scope.classCount} leaving-Q classes, ${reportValue.scope.cycleCount} cycles; excluded: ${reportValue.scope.excludedClassSignatures.join(', ')} (hub-grade); consumed inventory verified: ${reportValue.scope.inventoryVerified}`,
  );
  console.log(
    `binding consistency condition: ${reportValue.consistencyCondition.cyclesConsistent}/${reportValue.consistencyCondition.cyclesChecked} cycles (word closure == gate closure); derivation expressions reproduce stored links: ${reportValue.consistencyCondition.expressionsReproducedStored}/${reportValue.consistencyCondition.expressionsVerified}`,
  );
  console.log(
    `automorphism census cross-check: local ${reportValue.censusCrossCheck.localMonomialCount}/${reportValue.censusCrossCheck.localCollineationCount} vs consumed ${reportValue.censusCrossCheck.consumedMonomialCount}/${reportValue.censusCrossCheck.consumedCollineationCount} -> matches: ${reportValue.censusCrossCheck.matches}`,
  );

  console.log('');
  console.log('--- PART 1: WELL-DEFINED (exact DP over all parenthesizations x response choices) ---');

  for (const classRow of reportValue.classRows) {
    console.log('');
    console.log(
      `[${classRow.classSignature}] cycles ${classRow.cycleCount}; uniform: ${classRow.uniformAcrossCycles}; battery-eligible: ${classRow.batteryEligible}; 2-generation cross-check violations: ${classRow.twoGenerationCrossCheckViolations}`,
    );

    for (const outcome of classRow.outcomes) {
      console.log(
        `  outcome x${outcome.cycleCount}: word length ${outcome.wordLength}, ${outcome.bracketingsPerChoice} bracketings x ${outcome.responseChoiceCount} response choices = ${outcome.totalEvaluations} evaluations`,
      );
      console.log(
        `    merged value census: ${outcome.valueCensus
          .map((entry) => `${entry.valueKey} x${entry.count}`)
          .join('  ')}`,
      );
      console.log(
        `    per-choice values: [${outcome.perChoiceValueKeys.join(' ; ')}]`,
      );
      console.log(
        `    parenthesization class (per fixed choice): ${outcome.parenthesizationClass} | merged class (incl. choice axis): ${outcome.mergedClass}`,
      );
      console.log(
        `    gate closure dimension: ${outcome.gateClosureDimension} | mechanism: ${outcome.mechanism}`,
      );
      console.log(`    witness: ${outcome.witnessCycleId}`);
    }
  }

  console.log('');
  console.log('--- PART 2: GAUGE (the ruled automorphism gauge) ---');
  console.log(
    `global: ${reportValue.globalGauge.automorphismCount} automorphisms; scope: ${reportValue.globalGauge.measurementScopeNote}`,
  );

  for (const row of reportValue.globalGauge.rows) {
    if (!row.eligible) {
      console.log(`  ${row.classSignature}: moot (not battery-eligible)`);
      continue;
    }

    console.log(
      `  ${row.classSignature}: canonical-Re invariant on ${(row.canonicalReInvariantPairFraction * 100).toFixed(2)}% of (automorphism, cycle) pairs; covariance H'=phi(H) on ${(row.covarianceEqualPairFraction * 100).toFixed(2)}%; witness Re-set identical across orbit: ${row.witnessReSetIdenticalAcrossOrbit}`,
    );
  }

  console.log('');
  console.log('site-local:');
  console.log(`  ${reportValue.siteLocal.actionNote}`);
  console.log(`  global coincidence verified: ${reportValue.siteLocal.globalCoincidenceVerified}`);

  for (const family of reportValue.siteLocal.families) {
    console.log(
      `  [${family.familyId}] combos ${family.comboCount}: consistent ${family.consistentCount} (non-global ${family.consistentNonGlobalCount}); ${family.run3ComparisonNote}`,
    );
  }

  for (const row of reportValue.siteLocal.perClass) {
    if (!row.eligible) {
      console.log(`  ${row.classSignature}: moot (not battery-eligible)`);
      continue;
    }

    console.log(
      `  ${row.classSignature}: canonical-Re invariant over ${(row.canonicalReInvariantFractionOverConsistent * 100).toFixed(2)}% of (consistent gauge, cycle) pairs; witness Re-set identical over the declared sample (${row.sampleSize} gauges): ${(row.witnessReSetIdenticalFractionOverSample * 100).toFixed(2)}%`,
    );
  }

  console.log('');
  console.log('--- PART 3: INFORMATIVE (control ladder, K=128; no pass/fail decided) ---');

  for (const control of reportValue.controls) {
    if (!control.eligible) {
      console.log(`[${control.classSignature} x ${control.controlId}] ${control.adaptationNote}`);
      continue;
    }

    console.log(
      `[${control.classSignature} x ${control.controlId}] K=${control.draws}${control.degenerateControl ? '  ** DEGENERATE CONTROL (never varied) **' : ''}`,
    );
    console.log(
      `  reality fraction: mean ${control.realityFractionMean.toFixed(4)} | p95 ${control.realityFractionP95.toFixed(4)} | max ${control.realityFractionMax.toFixed(4)}`,
    );
    console.log(
      `  pattern match: mean ${control.patternMatchMean.toFixed(3)} | p95 ${control.patternMatchP95} | max ${control.patternMatchMax} | full-pattern fraction ${control.fullPatternFraction.toFixed(4)} | distinct patterns ${control.distinctPatternCount}`,
    );

    if (control.adaptationNote) {
      console.log(`  adaptation: ${control.adaptationNote}`);
    }
  }

  console.log('');
  console.log('--- PART 4: MOCK / ANTI-STAPLE (before/after; void-guard) ---');
  console.log(`scramble: ${reportValue.mock.scrambleDescription}`);
  console.log(`slots: ${reportValue.mock.slotCount}`);

  for (const row of reportValue.mock.rows) {
    console.log(
      `  ${row.classSignature}: pattern ${row.patternChanged ? 'CHANGED' : 'unchanged'}; classification ${row.classificationChanged ? 'CHANGED' : 'unchanged'}`,
    );
    console.log(`    true pattern: [${row.truePatternKey}]`);
    console.log(`    mock pattern: [${row.mockPatternKey}]`);
    console.log(`    true classes: ${row.trueClassificationSummary}`);
    console.log(`    mock classes: ${row.mockClassificationSummary}`);
  }

  console.log(
    `changed classes: ${reportValue.mock.changedClassCount}/${reportValue.mock.rows.length}; void-guard passed: ${reportValue.mock.voidGuardPassed}`,
  );

  console.log('');
  console.log('--- ESCALATIONS ---');
  console.log(`count: ${reportValue.escalations.length}`);

  for (const escalation of reportValue.escalations) {
    console.log(`  ${escalation.escalationId} [${escalation.context}] ${escalation.detail}`);
    console.log(`    note: ${escalation.escalationNote}`);
  }

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

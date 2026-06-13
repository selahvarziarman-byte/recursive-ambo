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
const modulePath = path.join(repoRoot, 'src/lib/mixedLoopLeavesQGateV0.ts');
const {
  buildMixedLoopLeavesQGateV0Report,
  GOVERNING_QUATERNIONIC_CAVEAT,
  SECTION_6_YELLOW_FLAG,
} = require(modulePath);

// Verdict-shaped tokens that may not appear: the auditor owns enter/exclude.
// (The bare words would false-positive on the prompt-mandated scope field
// pureHubExcludedCount, which records the out-of-scope filter, not a verdict.)
const FORBIDDEN_VERDICT_TOKENS = [
  'class-entered',
  'class-excluded',
  'sector-entered',
  'sector-excluded',
  'sector-member',
  'enters-the-octonionic-sector',
  'field-active',
];

const failures = [];
const report = buildMixedLoopLeavesQGateV0Report();

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
    'no-enter-exclude-verdict-auditor-classifies-against-hash-committed-sealed-rule'
  ) {
    failures.push(`Unexpected verdictStatus: ${reportValue.verdictStatus}`);
  }

  if (
    reportValue.run2AuthorizationStatus !==
    'run-2-unauthorized-until-this-gating-proof-is-audited'
  ) {
    failures.push(`Unexpected run2AuthorizationStatus: ${reportValue.run2AuthorizationStatus}`);
  }

  if (
    reportValue.governingQuaternionicCaveat !== GOVERNING_QUATERNIONIC_CAVEAT ||
    reportValue.yellowFlag !== SECTION_6_YELLOW_FLAG
  ) {
    failures.push('Caveat or yellow flag not carried verbatim in the report.');
  }

  const counts = reportValue.edgeCounts;

  if (
    counts.hub !== 12 ||
    counts.birth !== 12 ||
    counts.responseParentReturn !== 12 ||
    counts.responseProjectionLoop !== 12 ||
    counts.complement !== 6 ||
    counts.total !== 54
  ) {
    failures.push(
      `Edge counts mismatch: ${counts.hub}/${counts.birth}/${counts.responseParentReturn}/${counts.responseProjectionLoop}/${counts.complement} (total ${counts.total}).`,
    );
  }

  if (reportValue.derivationManifest.length !== counts.total) {
    failures.push('Derivation manifest is incomplete.');
  }

  for (const edge of reportValue.derivationManifest) {
    if (!edge.sourceRows.length) {
      failures.push(`Manifest entry ${edge.edgeId} names no source row.`);
    }
  }

  if (reportValue.classRows.length !== reportValue.inventory.classCount) {
    failures.push('Class table incomplete.');
  }

  // The one mandated void condition.
  if (!reportValue.mock.determinationChanged) {
    failures.push(
      'MOCK VOID: the scrambled link assignment left every per-class generated-subalgebra determination unchanged; the computation is reading constants.',
    );
  }

  for (const row of reportValue.anomalyLedger) {
    if (row.derivationStatus !== '') {
      failures.push(`Ledger row ${row.ledgerId} has non-empty derivationStatus.`);
    }
  }

  const serialized = JSON.stringify(reportValue).toLowerCase();

  for (const token of FORBIDDEN_VERDICT_TOKENS) {
    if (serialized.includes(token)) {
      failures.push(`Forbidden verdict-shaped token present in report: ${token}`);
    }
  }

  const packageSource = fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8');

  if (packageSource.includes('leaves-q') || packageSource.includes('mixed-loop')) {
    failures.push('package.json gained a leaves-q/mixed-loop entry; it must stay untouched.');
  }
}

function printReport(reportValue) {
  const gitEcho = bestEffortGitEcho();

  console.log('=== mixed-loop-leaves-q-gate-v0 (CBF F-I Phase-1, Run 1.5: the leaves-Q gating proof) ===');
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
  console.log(`run-2:         ${reportValue.run2AuthorizationStatus}`);
  console.log(`seed:          ${reportValue.seed}`);
  console.log(`Q (signed set): [${reportValue.qSignedSetKeys.join(', ')}]`);
  console.log('consumed substrates (READ-ONLY):');

  for (const entry of reportValue.consumedSubstrates) {
    console.log(`  - ${entry}`);
  }

  console.log('stream consumption order:');

  for (const entry of reportValue.streamConsumptionOrder) {
    console.log(`  ${entry}`);
  }

  console.log('');
  console.log('--- PART 0: DERIVATION MANIFEST (links DERIVED, never chosen; every value traces to a named row) ---');
  console.log(
    `edge counts: hub ${reportValue.edgeCounts.hub} | birth ${reportValue.edgeCounts.birth} | response-parent-return ${reportValue.edgeCounts.responseParentReturn} | response-projection-loop ${reportValue.edgeCounts.responseProjectionLoop} | complement ${reportValue.edgeCounts.complement} | total ${reportValue.edgeCounts.total}`,
  );

  for (const edge of reportValue.derivationManifest) {
    console.log(
      `  ${edge.edgeId}${edge.viaActionSource ? ` (via action ${edge.viaActionSource})` : ''}: links [${edge.linkUnitKeys.join(', ')}]${edge.underdetermined ? '  ** UNDERDETERMINED -> HELD **' : ''}`,
    );

    for (const sourceRow of edge.sourceRows) {
      console.log(`      <- ${sourceRow}`);
    }
  }

  console.log('');
  console.log('--- PART 1: CANDIDATE MIXED LOOP-CLASS INVENTORY ---');
  console.log(
    `cycle bound: edge length <= ${reportValue.cycleBound.edgeLengthBound} (declared; rationale: ${reportValue.cycleBound.rationale})`,
  );
  console.log(
    `simple directed cycles within bound: ${reportValue.inventory.totalSimpleCyclesWithinBound}; purely hub-internal excluded (Gate 0 covered them): ${reportValue.inventory.pureHubExcludedCount}; candidates: ${reportValue.inventory.candidateCycleCount}; classes: ${reportValue.inventory.classCount}`,
  );

  for (const classRow of reportValue.classRows) {
    console.log(
      `  class ${classRow.classSignature}: ${classRow.cycleCount} cycles${classRow.responseFamilies.length ? ` | response families: ${classRow.responseFamilies.join(', ')}` : ''}${classRow.held ? '  ** HELD (underdetermined link) **' : ''}`,
    );
  }

  console.log('');
  console.log('--- PART 2: THE LEAVES-Q PROOF (generated subalgebra per class; exact closure) ---');

  for (const classRow of reportValue.classRows) {
    console.log('');
    console.log(
      `[${classRow.classSignature}] cycles ${classRow.cycleCount}; uniform across cycles: ${classRow.uniformAcrossCycles}${classRow.held ? '  ** HELD -- not computed **' : ''}`,
    );

    for (const outcome of classRow.outcomes) {
      console.log(
        `  outcome x${outcome.cycleCount}: generators [${outcome.seedUnitKeys.join(', ')}] (${outcome.generatorUnitCount} distinct units)`,
      );
      console.log(
        `    closed set (${outcome.closedSetSize} signed elements, dimension ${outcome.dimension}): [${outcome.closedSetKeys.join(', ')}]`,
      );
      console.log(
        `    subset of Q: ${outcome.subsetOfQ} | closure kind: ${outcome.closureKind}`,
      );
      console.log(`    witness cycle: ${outcome.witnessCycleId}`);
    }
  }

  console.log('');
  console.log('--- PART 3: STRUCTURE FLAGS (raw, for the auditor; feeds the Phase-1 2-generation split) ---');

  for (const classRow of reportValue.classRows) {
    if (classRow.held) {
      continue;
    }

    for (const outcome of classRow.outcomes) {
      if (outcome.subsetOfQ) {
        continue;
      }

      console.log(
        `  ${classRow.classSignature}: generators ${outcome.generatorUnitCount}; a 2-element generator pair reproduces the full closure: ${outcome.twoGeneratedPairExists}; response families: ${classRow.responseFamilies.join(', ') || 'none'}`,
      );
    }
  }

  console.log('');
  console.log('--- PART 4: ANTI-STAPLE / MOCK (before/after) ---');
  console.log(`scramble: ${reportValue.mock.scrambleDescription}`);
  console.log(`slots scrambled: ${reportValue.mock.slotCount}`);

  for (const row of reportValue.mock.classRows) {
    console.log(`  ${row.classSignature}: ${row.changed ? 'CHANGED' : 'unchanged'}`);
    console.log(`    before: ${row.beforeOutcomeSummary}`);
    console.log(`    after:  ${row.afterOutcomeSummary}`);
  }

  console.log(
    `changed classes: ${reportValue.mock.changedClassCount}/${reportValue.mock.classRows.length}; determination changed: ${reportValue.mock.determinationChanged}`,
  );

  console.log('');
  console.log('--- ESCALATIONS ---');
  console.log(`count: ${reportValue.escalations.length}`);

  for (const escalation of reportValue.escalations) {
    console.log(`  ${escalation.escalationId} [${escalation.context}] ${escalation.detail}`);
    console.log(`    held classes: ${escalation.heldClassSignatures.join(', ') || 'none'}`);
    console.log(`    note: ${escalation.escalationNote}`);
  }

  console.log('');
  console.log('--- ANOMALY LEDGER (derivationStatus left empty for the auditor) ---');

  if (!reportValue.anomalyLedger.length) {
    console.log('  (no rows: no unexpected measurements beyond the reported tables)');
  }

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

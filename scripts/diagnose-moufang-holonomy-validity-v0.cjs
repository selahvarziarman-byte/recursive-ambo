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
const modulePath = path.join(repoRoot, 'src/lib/moufangHolonomyValidityV0.ts');
const {
  buildMoufangHolonomyValidityV0Report,
  MOUFANG_POLICY_IDS,
  MOUFANG_CONTROL_DRAWS,
  MOUFANG_CONJUGATION_DRAWS,
} = require(modulePath);

// Forbidden verdict labels: this run computes and reports; the auditor
// classifies against the hash-committed sealed rule.
const FORBIDDEN_LABEL_TOKENS = ['well-defined', 'gauge-invariant', 'informative'];

const failures = [];
const report = buildMoufangHolonomyValidityV0Report();

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

  if (reportValue.loopInventory.batteryLoopCount !== 22) {
    failures.push(`Expected 22 battery loops, got ${reportValue.loopInventory.batteryLoopCount}`);
  }

  if (
    reportValue.loopInventory.triangles !== 8 ||
    reportValue.loopInventory.squares !== 6 ||
    reportValue.loopInventory.hexagonSubsystems !== 4 ||
    reportValue.loopInventory.directedHexagons !== 8
  ) {
    failures.push('Loop inventory counts do not match the geometric enumeration (8/6/4/8).');
  }

  if (reportValue.batteryRows.length !== 22 * 3) {
    failures.push(`Expected 66 battery rows, got ${reportValue.batteryRows.length}`);
  }

  if (
    reportValue.gauge.quadrangleCount !== 7 ||
    reportValue.gauge.labelingsPerQuadrangle !== 24 ||
    reportValue.gauge.orbitSize !== 168 ||
    !reportValue.gauge.trueLabelingInOrbit
  ) {
    failures.push('Gauge orbit shape mismatch (expected 7 x 24 = 168, true labeling a member).');
  }

  if (reportValue.controls.length !== 12) {
    failures.push(`Expected 12 control cells, got ${reportValue.controls.length}`);
  }

  for (const control of reportValue.controls) {
    if (control.draws !== MOUFANG_CONTROL_DRAWS) {
      failures.push(`Control draw count mismatch at ${control.policyId}/${control.controlId}`);
    }
  }

  if (reportValue.conjugation.draws !== MOUFANG_CONJUGATION_DRAWS) {
    failures.push(`Conjugation draw count mismatch: ${reportValue.conjugation.draws}`);
  }

  // The one mandated void condition: the mock-solution scramble must break the
  // true Re-pattern; a diagnostic that survives it is reading constants.
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

  // No verdict labels anywhere in the serialized report.
  const serialized = JSON.stringify(reportValue).toLowerCase();

  for (const token of FORBIDDEN_LABEL_TOKENS) {
    if (serialized.includes(token)) {
      failures.push(`Forbidden verdict-label token present in report: ${token}`);
    }
  }

  // package.json untouched (runs via node).
  const packageSource = fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8');

  if (packageSource.includes('moufang')) {
    failures.push('package.json gained a moufang entry; it must stay untouched.');
  }
}

function formatControl(control) {
  return [
    `[${control.policyId} x ${control.controlId}] K=${control.draws}${control.degenerateControl ? '  ** DEGENERATE CONTROL (never varied) **' : ''}`,
    `  reality fraction: mean ${control.realityFractionMean.toFixed(4)} | p95 ${control.realityFractionP95.toFixed(4)} | max ${control.realityFractionMax.toFixed(4)}`,
    `  pattern match (of 22): mean ${control.patternMatchMean.toFixed(3)} | p95 ${control.patternMatchP95} | max ${control.patternMatchMax} | full-pattern fraction ${control.fullPatternFraction.toFixed(4)}`,
    `  distinct Re-patterns across draws: ${control.distinctRePatternCount}`,
    ...(control.adaptationNote ? [`  adaptation: ${control.adaptationNote}`] : []),
  ].join('\n');
}

function printReport(reportValue) {
  const gitEcho = bestEffortGitEcho();

  console.log('=== moufang-holonomy-validity-v0 (CBF Gate 0, Run 2; link-policy fork) ===');
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
  console.log('--- CARRIER FACTS (consumed, cross-checked) ---');
  console.log(
    `derived Fano lines (from the consumed product law): ${reportValue.derivedFanoLines
      .map((line) => `{${line.join(',')}}`)
      .join(' ')}`,
  );
  console.log(
    `primal atoms: ${reportValue.primalAtomAssignment
      .map((entry) => `${entry.site}=${entry.atom}`)
      .join('  ')}`,
  );
  console.log('stored links U(i->j) (capsule flag states, cross-checked vs carrier table + F1):');
  console.log(
    `  ${reportValue.storedLinkAssignment
      .map((entry) => `${entry.edge}=${entry.valueKey}`)
      .join('  ')}`,
  );
  console.log(`all 12 lifts inside Q={e3,e5,e6}: ${reportValue.liftsAllInQ}`);
  console.log(`anti-staple alarms: ${reportValue.antiStapleAlarms.length}`);

  for (const alarm of reportValue.antiStapleAlarms) {
    console.log(`  ALARM ${alarm.alarmId} [${alarm.context}] ${alarm.detail}`);
    console.log(`    escalation: ${alarm.escalationNote}`);
  }

  console.log('');
  console.log('--- LOOP-CLASS INVENTORY (enumerated from geometry) ---');
  console.log(
    `triangles (directed 3-cycles of K4): ${reportValue.loopInventory.triangles}`,
  );
  console.log(
    `squares (directed Hamiltonian 4-cycles of K4): ${reportValue.loopInventory.squares}`,
  );
  console.log(
    `hexagonal great circles (A2 subsystems, from root coordinates): ${reportValue.loopInventory.hexagonSubsystems} subsystems, ${reportValue.loopInventory.directedHexagons} directed traversals`,
  );
  console.log(`battery loop count: ${reportValue.loopInventory.batteryLoopCount}`);

  for (const loop of reportValue.loopInventory.loops) {
    console.log(
      `  ${loop.loopId}: ${loop.linkSequence
        .map((link) => `${link.from}->${link.to}`)
        .join(', ')}  (${loop.orientationNote})`,
    );
  }

  for (const policyId of MOUFANG_POLICY_IDS) {
    console.log('');
    console.log(`--- PER-POLICY BATTERY: ${policyId} ---`);

    for (const row of reportValue.batteryRows.filter((entry) => entry.policyId === policyId)) {
      console.log(
        `  ${row.loopId}: word length ${row.wordLength}, bracketings ${row.totalBracketings}, class ${row.bracketingClass}`,
      );
      console.log(
        `    canonical left-assoc = ${row.canonicalLeftAssocValueKey}  Re = ${row.canonicalRe}`,
      );
      console.log(
        `    value census: ${row.valueCensus
          .map((entry) => `${entry.valueKey} x${entry.bracketingCount} (Re ${entry.re})`)
          .join('  ')}`,
      );

      if (row.bracketingClass !== 'value-identical' && row.dependenceWitnessPair) {
        console.log(`    witness 1: ${row.dependenceWitnessPair[0]}`);
        console.log(`    witness 2: ${row.dependenceWitnessPair[1]}`);
      }
    }
  }

  console.log('');
  console.log('--- TRUE Re VECTORS (canonical left-assoc; loop order as inventory) ---');

  for (const entry of reportValue.trueReVectorByPolicy) {
    console.log(
      `  ${entry.policyId}: [${entry.reVector.join(', ')}]  reality fraction ${entry.realityFraction.toFixed(4)}`,
    );
  }

  console.log('');
  console.log('--- GAUGE: 7x24 = 168 FANO QUADRANGLE-LABELING ORBIT ---');
  console.log(
    `quadrangles ${reportValue.gauge.quadrangleCount} x labelings ${reportValue.gauge.labelingsPerQuadrangle} = orbit ${reportValue.gauge.orbitSize}; true labeling in orbit: ${reportValue.gauge.trueLabelingInOrbit}`,
  );
  console.log(`note: ${reportValue.gauge.orbitNote}`);
  console.log('recomputed-link policy across orbit (A and B coincide across the orbit by construction):');

  for (const row of reportValue.gauge.linkPolicyRows) {
    console.log(
      `  ${row.loopId}: Re values {${row.distinctReValuesAcrossOrbit.join(', ')}}, Re identical across orbit: ${row.reIdenticalAcrossOrbit}; bracketing classes {${row.distinctBracketingClassesAcrossOrbit.join(', ')}}, class stable: ${row.bracketingClassStableAcrossOrbit}; raw sample [${row.rawValueKeysSample.join(', ')}]`,
    );
  }

  console.log('policy C across orbit:');

  for (const row of reportValue.gauge.cPolicyRows) {
    console.log(
      `  ${row.loopId}: Re values {${row.distinctReValuesAcrossOrbit.join(', ')}}, Re identical across orbit: ${row.reIdenticalAcrossOrbit}; bracketing classes {${row.distinctBracketingClassesAcrossOrbit.join(', ')}}, class stable: ${row.bracketingClassStableAcrossOrbit}; raw sample [${row.rawValueKeysSample.join(', ')}]`,
    );
  }

  console.log('');
  console.log('--- GAUGE: SITE-LOCAL CONJUGATION SAMPLE ---');
  console.log(`note: ${reportValue.conjugation.note}`);
  console.log(
    `draws ${reportValue.conjugation.draws}; pattern match (of 22): mean ${reportValue.conjugation.patternMatchMean.toFixed(3)} | p95 ${reportValue.conjugation.patternMatchP95} | max ${reportValue.conjugation.patternMatchMax}; full-pattern match fraction ${reportValue.conjugation.fullPatternMatchFraction.toFixed(4)}`,
  );
  console.log('per-loop Re invariance fractions:');
  console.log(
    `  ${reportValue.conjugation.perLoopReInvariantFraction
      .map((entry) => `${entry.loopId}=${entry.fraction.toFixed(3)}`)
      .join('  ')}`,
  );

  console.log('');
  console.log('--- CONTROL ADEQUACY LADDER (K=128 each; no pass/fail decided) ---');

  for (const control of reportValue.controls) {
    console.log(formatControl(control));
  }

  console.log('');
  console.log('--- MOCK-SOLUTION TEST (anti-staple) ---');
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
  console.log('--- CLASSIFICATION DATA (raw; the auditor applies the sealed rule) ---');
  console.log(`note: ${reportValue.classificationData.note}`);
  console.log(
    `A/B per-edge identical: ${reportValue.classificationData.abPerEdgeIdentical}`,
  );
  console.log(
    `A bracketing classes: ${JSON.stringify(reportValue.classificationData.aBracketingClassCounts)}`,
  );
  console.log(
    `B bracketing classes: ${JSON.stringify(reportValue.classificationData.bBracketingClassCounts)}`,
  );
  console.log(
    `C bracketing classes: ${JSON.stringify(reportValue.classificationData.cBracketingClassCounts)}`,
  );
  console.log(
    `C value-identical loop count: ${reportValue.classificationData.cValueIdenticalLoopCount}`,
  );
  console.log(
    `C canonical differs from A canonical (value): ${reportValue.classificationData.cCanonicalDiffersFromACanonicalCount}/22; (Re): ${reportValue.classificationData.cCanonicalReDiffersFromACanonicalReCount}/22`,
  );
  console.log(
    `link policy Re identical across orbit: ${reportValue.classificationData.linkPolicyReIdenticalAcrossOrbitLoopCount}/22 loops; policy C: ${reportValue.classificationData.cReIdenticalAcrossOrbitLoopCount}/22 loops`,
  );
  console.log(
    `conjugation full-pattern match fraction: ${reportValue.classificationData.conjugationFullPatternMatchFraction.toFixed(4)}`,
  );
  console.log('control full-pattern fractions:');

  for (const entry of reportValue.classificationData.controlFullPatternFractions) {
    console.log(
      `  ${entry.policyId} x ${entry.controlId}: ${entry.fullPatternFraction.toFixed(4)}`,
    );
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

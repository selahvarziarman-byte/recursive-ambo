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
const tablePath = path.join(
  repoRoot,
  'src/lib/propagationFieldActivitySurvivalAuditV0.ts',
);
const packagePath = path.join(repoRoot, 'package.json');
const {
  buildPropagationFieldActivitySurvivalAuditV0Report,
  PROPAGATION_AUDIT_RELATION_IDS,
  PROPAGATION_AUDIT_BASIS_IDS,
  PROPAGATION_AUDIT_CONTROL_DRAWS,
  SEALED_DEPROPAGATION_TRANSFORMS,
} = require(tablePath);

// Gate C.5 status vocabulary must NOT appear anywhere in this run's report:
// this run computes and reports; the auditor classifies against the
// hash-committed sealed rule.
const FORBIDDEN_C5_STATUS_TOKENS = [
  'raw-visible',
  'raw-field-visible',
  'propagation-transformed',
  'depropagation-recoverable',
  'structural-channel-visible',
  'source-state-only',
  'tuple-projection-lost',
  'misleading-if-read-as-raw-field',
  'unsupported',
];

// Mock-solution guard: the module must not import any source-state report
// module (Basis-S is recomputed from F1/F2 field data).
const FORBIDDEN_IMPORT_PATTERNS = [
  {
    label: 'source-state report import',
    pattern:
      /(?:from\s+['"]|require\(\s*['"])[^'"]*(?:structuredSourceState|medialDualEquivariant|hubLayerSourceState|medialCarrierSourceState)/i,
  },
  {
    label: 'React import',
    pattern: /from\s+['"][^'"]*react['"]|require\(\s*['"]react['"]\s*\)/i,
  },
  {
    label: 'store import',
    pattern:
      /from\s+['"][^'"]*(?:[/\\]store[/\\]|geometryStore)|require\(\s*['"][^'"]*(?:[/\\]store[/\\]|geometryStore)/i,
  },
  {
    label: 'components import',
    pattern:
      /from\s+['"][^'"]*[/\\]components[/\\]|require\(\s*['"][^'"]*[/\\]components[/\\]/i,
  },
];

const failures = [];
const report = buildPropagationFieldActivitySurvivalAuditV0Report();
const tableSource = readRequiredFile(tablePath, 'propagation audit source');
const packageSource = readRequiredFile(packagePath, 'package.json');

runAssertions(report, { tableSource, packageSource });
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

function readRequiredFile(filePath, label) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    failures.push(`Could not read ${label} at ${filePath}: ${error.message}`);

    return '';
  }
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
    // best-effort only; the declared gate is authoritative in the report
  }

  return echo;
}

function runAssertions(reportValue, sources) {
  // Integrity (well-formedness only; NO assertion on any r/g value,
  // control gap, or recovery outcome).
  if (!reportValue.ok || reportValue.integrityIssueCount !== 0) {
    failures.push(
      `Report integrity issues present (${reportValue.integrityIssueCount}): ${reportValue.integrityIssues
        .map((issue) => issue.code)
        .join(', ')}`,
    );
  }

  if (
    reportValue.verdictStatus !==
    'no-status-assigned-auditor-classifies-against-hash-committed-rule'
  ) {
    failures.push(`Unexpected verdictStatus: ${reportValue.verdictStatus}`);
  }

  if (reportValue.octaFieldActivityStatus !== 'blocked-until-octa-field-stack') {
    failures.push(
      `Unexpected octaFieldActivityStatus: ${reportValue.octaFieldActivityStatus}`,
    );
  }

  if (reportValue.manifests.length !== 3) {
    failures.push(`Expected 3 basis manifests, got ${reportValue.manifests.length}`);
  }

  for (const manifest of reportValue.manifests) {
    if (manifest.leakScan.hitCount !== 0) {
      failures.push(
        `Leak scan hits in ${manifest.basisId}: ${manifest.leakScan.hits.join(' | ')}`,
      );
    }
  }

  const expectedCellCount =
    PROPAGATION_AUDIT_RELATION_IDS.length * PROPAGATION_AUDIT_BASIS_IDS.length;

  if (reportValue.grid.length !== expectedCellCount) {
    failures.push(
      `Expected ${expectedCellCount} grid cells, got ${reportValue.grid.length}`,
    );
  }

  for (const relationId of PROPAGATION_AUDIT_RELATION_IDS) {
    for (const basisId of PROPAGATION_AUDIT_BASIS_IDS) {
      if (
        !reportValue.grid.some(
          (cell) => cell.relationId === relationId && cell.basisId === basisId,
        )
      ) {
        failures.push(`Missing grid cell ${relationId} x ${basisId}`);
      }
    }
  }

  for (const cell of reportValue.grid) {
    for (const measurement of cell.measurements) {
      if (!Number.isFinite(measurement.real)) {
        failures.push(`Non-finite measurement ${cell.cellId}:${measurement.measurementKey}`);
      }

      if (
        measurement.structuredControl &&
        measurement.structuredControl.draws !== PROPAGATION_AUDIT_CONTROL_DRAWS
      ) {
        failures.push(
          `Structured control draw count mismatch at ${cell.cellId}:${measurement.measurementKey}`,
        );
      }

      if (
        measurement.allControl &&
        measurement.allControl.draws !== PROPAGATION_AUDIT_CONTROL_DRAWS
      ) {
        failures.push(
          `All-control draw count mismatch at ${cell.cellId}:${measurement.measurementKey}`,
        );
      }
    }

    if (cell.voidedByLeak) {
      failures.push(`Cell voided by leak scan: ${cell.cellId}`);
    }
  }

  if (reportValue.sealedTransformOutcomes.length !== 6) {
    failures.push(
      `Expected 6 sealed transform outcomes, got ${reportValue.sealedTransformOutcomes.length}`,
    );
  }

  const expectedTransformOrder = ['T_axis', 'T_lift', 'T_flag', 'T_clo', 'T_hol', 'T_ori'];
  const actualTransformOrder = reportValue.sealedTransformOutcomes.map(
    (outcome) => outcome.transformId,
  );

  if (actualTransformOrder.join(',') !== expectedTransformOrder.join(',')) {
    failures.push(
      `Sealed transform outcome order mismatch: ${actualTransformOrder.join(',')}`,
    );
  }

  for (const [transformId, definition] of Object.entries({
    T_axis: SEALED_DEPROPAGATION_TRANSFORMS.tAxis,
    T_lift: SEALED_DEPROPAGATION_TRANSFORMS.tLift,
    T_flag: SEALED_DEPROPAGATION_TRANSFORMS.tFlag,
    T_clo: SEALED_DEPROPAGATION_TRANSFORMS.tClo,
    T_hol: SEALED_DEPROPAGATION_TRANSFORMS.tHol,
    T_ori: SEALED_DEPROPAGATION_TRANSFORMS.tOri,
  })) {
    const outcome = reportValue.sealedTransformOutcomes.find(
      (entry) => entry.transformId === transformId,
    );

    if (!outcome || outcome.definitionVerbatim !== definition) {
      failures.push(`Sealed transform definition not carried verbatim: ${transformId}`);
    }
  }

  if (reportValue.anomalyLedger.length === 0) {
    failures.push('Anomaly ledger is empty; expected at least the inventory rows.');
  }

  for (const row of reportValue.anomalyLedger) {
    if (row.derivationStatus !== '') {
      failures.push(`Ledger row ${row.ledgerId} has non-empty derivationStatus.`);
    }
  }

  if (
    reportValue.g0Cell.cautionVerbatim !==
    'aggregate identities can cancel exactly the sign structure under test'
  ) {
    failures.push('G0 cell caution wording not carried verbatim.');
  }

  // No C.5 status vocabulary anywhere in the report.
  const serializedReport = JSON.stringify(reportValue);

  for (const token of FORBIDDEN_C5_STATUS_TOKENS) {
    if (serializedReport.includes(`"${token}"`) || serializedReport.includes(token)) {
      failures.push(`Forbidden Gate C.5 status token present in report: ${token}`);
    }
  }

  // Mock-solution and scope guards on the module source.
  for (const { label, pattern } of FORBIDDEN_IMPORT_PATTERNS) {
    if (pattern.test(sources.tableSource)) {
      failures.push(`Forbidden import in module source: ${label}`);
    }
  }

  // package.json untouched: this diagnostic runs via node, no script entry.
  if (sources.packageSource.includes('propagation-field-activity')) {
    failures.push('package.json gained a propagation-field-activity entry; it must stay untouched.');
  }

  // Blind protocol shape.
  if (reportValue.blindProtocol.seed !== 20260611) {
    failures.push(`Blind protocol seed mismatch: ${reportValue.blindProtocol.seed}`);
  }

  if (reportValue.blindProtocol.basisSNodeMap.length !== 10) {
    failures.push(
      `Expected 10 basis-s node map entries, got ${reportValue.blindProtocol.basisSNodeMap.length}`,
    );
  }

  if (reportValue.blindProtocol.basisSEdgeMap.length !== 36) {
    failures.push(
      `Expected 36 basis-s edge map entries, got ${reportValue.blindProtocol.basisSEdgeMap.length}`,
    );
  }

  if (reportValue.blindProtocol.basisRSiteMap.length !== 10) {
    failures.push(
      `Expected 10 basis-r site map entries, got ${reportValue.blindProtocol.basisRSiteMap.length}`,
    );
  }
}

function formatMeasurement(measurement) {
  const realPart = `real ${measurement.numerator}/${measurement.denominator} = ${measurement.real.toFixed(4)}`;
  const structuredPart = measurement.structuredControl
    ? `structured{mean ${measurement.structuredControl.mean.toFixed(4)}, p95 ${measurement.structuredControl.p95.toFixed(4)}, max ${measurement.structuredControl.max.toFixed(4)}, K=${measurement.structuredControl.draws}}`
    : 'structured{n/a}';
  const allPart = measurement.allControl
    ? `all-control{mean ${measurement.allControl.mean.toFixed(4)}, K=${measurement.allControl.draws}}`
    : 'all-control{n/a}';

  return `${measurement.measurementKey} [${measurement.kind}]: ${realPart} | ${structuredPart} | ${allPart}\n        note: ${measurement.note}`;
}

function printReport(reportValue) {
  const gitEcho = bestEffortGitEcho();

  console.log('=== propagation-field-activity-survival-audit-v0 (Station IV-A, Run 2) ===');
  console.log('');
  console.log('--- REPO-IDENTITY GATE ECHO ---');
  console.log(`declared path:   ${reportValue.declaredGate.declaredPath}`);
  console.log(`declared branch: ${reportValue.declaredGate.declaredBranch}`);
  console.log(
    `declared HEAD at authoring: ${reportValue.declaredGate.declaredHeadAtAuthoring} (anchor ${reportValue.declaredGate.anchorHead})`,
  );
  console.log(
    `decoy (NOT the campaign tree): ${reportValue.declaredGate.decoyPathNotCampaignTree}`,
  );
  console.log(`live git echo (best-effort): branch=${gitEcho.branch} head=${gitEcho.head}`);
  console.log('');
  console.log(`reportId:        ${reportValue.reportId}`);
  console.log(`diagnosticScope: ${reportValue.diagnosticScope}`);
  console.log(`routeScope:      ${reportValue.routeScope}`);
  console.log(`octa field activity: ${reportValue.octaFieldActivityStatus}`);
  console.log(`verdictStatus:   ${reportValue.verdictStatus}`);
  console.log(`audit graph:     ${reportValue.auditGraphId}`);
  console.log(`non-audited graphs (same carrier structure, different emission profiles): ${reportValue.nonAuditedGraphIds.join(', ')}`);
  console.log('');
  console.log('consumed substrates (READ-ONLY):');

  for (const entry of reportValue.consumedSubstrates) {
    console.log(`  - ${entry}`);
  }

  console.log('NOT consumed (mock-solution rule of this station):');

  for (const entry of reportValue.notConsumedSourceStateReports) {
    console.log(`  - ${entry}`);
  }

  for (const manifest of reportValue.manifests) {
    console.log('');
    console.log(`--- VISIBLE-FIELD MANIFEST: ${manifest.basisId} ---`);
    console.log(`note: ${manifest.basisNote}`);
    console.log('visible fields:');

    for (const field of manifest.visibleFields) {
      console.log(`  + ${field.fieldPath} -- ${field.description}`);
    }

    console.log('stripped fields:');

    for (const field of manifest.strippedFields) {
      console.log(`  - ${field}`);
    }

    console.log(
      `row counts: ${Object.entries(manifest.rowCounts)
        .map(([key, value]) => `${key}=${value}`)
        .join(', ')}`,
    );
    console.log(
      `absence inventory: unit-indexed coefficient vector present=${manifest.unitIndexedCoefficientVectorPresent}; orientation-bearing observable present=${manifest.orientationBearingObservablePresent}; flag-identity observable present=${manifest.flagIdentityObservablePresent}`,
    );
    console.log(
      `leak scan: patterns [${manifest.leakScan.patternsApplied.join(', ')}], stripped key names checked ${manifest.leakScan.strippedKeyNamesChecked}, string values scanned ${manifest.leakScan.stringValuesScanned}, object keys scanned ${manifest.leakScan.objectKeysScanned}, declared exemptions [${manifest.leakScan.declaredExemptions.join(', ') || 'none'}], hits ${manifest.leakScan.hitCount}`,
    );

    for (const hit of manifest.leakScan.hits) {
      console.log(`    LEAK HIT: ${hit}`);
    }
  }

  console.log('');
  console.log('--- BLIND PROTOCOL ---');
  console.log(`seed: ${reportValue.blindProtocol.seed} (${reportValue.blindProtocol.rngLaw})`);
  console.log('stream consumption order:');

  for (const entry of reportValue.blindProtocol.streamConsumptionOrder) {
    console.log(`  ${entry}`);
  }

  console.log(`scorer-side note: ${reportValue.blindProtocol.scorerSideNote}`);
  console.log('');
  console.log('[SCORER-SIDE ONLY] basis-s node map:');
  console.log(
    `  ${reportValue.blindProtocol.basisSNodeMap
      .map((entry) => `${entry.anonId}=${entry.trueId.split(':').slice(-2).join(':')}`)
      .join('  ')}`,
  );
  console.log('[SCORER-SIDE ONLY] basis-s edge map:');

  for (const entry of reportValue.blindProtocol.basisSEdgeMap) {
    console.log(`  ${entry.anonId} = ${entry.trueId.split(':').slice(2).join(':')}`);
  }

  console.log('[SCORER-SIDE ONLY] basis-s sample map:');
  console.log(
    `  ${reportValue.blindProtocol.basisSSampleMap
      .map((entry) => `${entry.anonId}=${entry.trueId.split(':').slice(-1)[0]}`)
      .join('  ')}`,
  );
  console.log('[SCORER-SIDE ONLY] basis-r site map:');
  console.log(
    `  ${reportValue.blindProtocol.basisRSiteMap
      .map((entry) => `${entry.anonId}=${entry.trueId}`)
      .join('  ')}`,
  );
  console.log('[SCORER-SIDE ONLY] basis-r lattice map:');
  console.log(
    `  ${reportValue.blindProtocol.basisRLatticeMap
      .map((entry) => `${entry.anonId}=${entry.trueId.replace('lattice:', '')}`)
      .join('  ')}`,
  );

  console.log('');
  console.log('--- RELATIONS x BASES GRID (raw numbers; no C.5 status assigned) ---');

  for (const relationId of PROPAGATION_AUDIT_RELATION_IDS) {
    for (const basisId of PROPAGATION_AUDIT_BASIS_IDS) {
      const cell = reportValue.grid.find(
        (candidate) =>
          candidate.relationId === relationId && candidate.basisId === basisId,
      );

      if (!cell) {
        continue;
      }

      console.log('');
      console.log(`[${cell.relationId} x ${shortBasisLabel(cell.basisId)}]`);
      console.log(`  status: ${cell.statusNote}${cell.voidedByLeak ? '  ** VOIDED BY LEAK SCAN **' : ''}`);
      console.log(`  attempted: ${cell.attempted}`);
      console.log(`  procedure: ${cell.procedureNote}`);

      for (const measurement of cell.measurements) {
        console.log(`      ${formatMeasurement(measurement)}`);
      }
    }
  }

  console.log('');
  console.log('--- SEALED DEPROPAGATION TRANSFORM OUTCOMES (one shot each, no shopping) ---');

  for (const outcome of reportValue.sealedTransformOutcomes) {
    console.log('');
    console.log(`${outcome.transformId}: ${outcome.definitionVerbatim}`);
    console.log(`  applied: ${outcome.applied}`);
    console.log(`  outcome: ${outcome.outcomeNote}`);

    for (const censusLine of outcome.perItemCensus) {
      console.log(`    ${censusLine}`);
    }
  }

  console.log('');
  console.log('--- G0 EXPLORATORY CELL (no sealed prediction) ---');
  console.log(`note: ${reportValue.g0Cell.cellNote}`);
  console.log(`audit graph: ${reportValue.g0Cell.auditGraphId}`);
  console.log(
    `delta rows: ${reportValue.g0Cell.deltaRowCount}; max |delta - bornSum| residual: ${reportValue.g0Cell.maxAbsDeltaMinusBornSumResidual.toExponential(6)}`,
  );
  console.log(
    `antipodal sample-point pairs: ${reportValue.g0Cell.antipodalSamplePairCount}; phase-opposed: ${reportValue.g0Cell.phaseOpposedPairCount}`,
  );

  for (const line of reportValue.g0Cell.pairCensus) {
    console.log(`  ${line}`);
  }

  console.log(`caution (verbatim): ${reportValue.g0Cell.cautionVerbatim}`);
  console.log(reportValue.g0Cell.mayNotClaimNote);

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

function shortBasisLabel(basisId) {
  if (basisId.startsWith('basis-s')) {
    return 'basis-s';
  }

  if (basisId.startsWith('basis-r')) {
    return 'basis-r';
  }

  return 'basis-d';
}

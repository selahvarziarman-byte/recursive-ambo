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
const registryPath = path.join(repoRoot, 'src/operations/registry.ts');
const fieldCuePath = path.join(repoRoot, 'src/lib/fieldCueV0.ts');
const generatedSiteReadingPath = path.join(
  repoRoot,
  'src/lib/generatedSiteReadingV0.ts',
);
const componentPaths = [
  path.join(repoRoot, 'src/components/GeneratedSiteReadingV0Panel.tsx'),
  path.join(repoRoot, 'src/components/FieldCueV0Panel.tsx'),
  path.join(repoRoot, 'src/components/FieldAtlasInspector.tsx'),
];
const {
  buildSourceSignatureContractAuditV0ComparisonReport,
  buildSourceSignatureContractAuditV0Report,
} = require(path.join(repoRoot, 'src/lib/sourceSignatureContractAuditV0.ts'));

const failures = [];
const uniformReport = buildSourceSignatureContractAuditV0Report();
const comparisonReport = buildSourceSignatureContractAuditV0ComparisonReport();
const provingReport = comparisonReport.provingCandidateRegime.report;
const registrySource = readIfExists(registryPath);
const fieldCueSource = readIfExists(fieldCuePath);
const generatedSiteReadingSource = readIfExists(generatedSiteReadingPath);
const componentSources = componentPaths.map(readIfExists);

runAssertions({
  uniformReport,
  provingReport,
  comparisonReport,
  registrySource,
  fieldCueSource,
  generatedSiteReadingSource,
  componentSources,
});
printCompactSummary({
  uniformReport,
  provingReport,
  comparisonReport,
});

if (failures.length) {
  console.error('');
  console.error('Diagnostics failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log('');
  console.log('Diagnostic assertions passed.');
}

function runAssertions(args) {
  const { uniformReport, provingReport, comparisonReport } = args;
  const calibration = provingReport.baseWaveNumberCalibration;
  const shell = provingReport.eventShellProvenance;

  expectTruthy(uniformReport, 'uniform control report built');
  expectEqual(
    uniformReport.method,
    'source-signature-contract-audit-v0',
    'uniform report method',
  );
  expectEqual(
    uniformReport.diagnosticScope,
    'one-ambo-tetrahedron-source-signature-audit',
    'uniform diagnostic scope',
  );
  expectEqual(uniformReport.diagnosticOk, true, 'uniform diagnostic ok');
  expectEqual(
    uniformReport.structuralContractStatus,
    'pass',
    'uniform structural contract status',
  );
  expectEqual(
    uniformReport.provingFixtureUsefulnessStatus,
    'fail',
    'uniform control proving fixture usefulness status',
  );
  expectEqual(
    uniformReport.provingEventSignatureStatus,
    'fail',
    'uniform control proving event signature status',
  );
  expectEqual(
    uniformReport.humanLegibilityStatus,
    'misleading',
    'uniform control human legibility status',
  );
  expectIssueCode(uniformReport, 'primal-scalar-invariance');
  expectIssueCode(uniformReport, 'phase-circular-mean-cancellation');

  expectTruthy(provingReport, 'Pythagorean proving report built');
  expectEqual(
    provingReport.provingRegimeId,
    'pythagorean-tetrachord-quark-regime-v0',
    'Pythagorean proving regime id',
  );
  expectEqual(
    provingReport.sourceProfileSystemId,
    'pythagorean-tetrachord-primal-profile-system-v0',
    'Pythagorean source profile system id',
  );
  expectEqual(
    provingReport.childInheritanceGrammarId,
    'tetrahedral-quark-log-wave-number-inheritance-v0',
    'Pythagorean child inheritance grammar id',
  );
  expectEqual(
    provingReport.sourcePolicyId,
    'pythagorean-tetrachord-quark-proving-policy-v0',
    'Pythagorean source policy id',
  );
  expectEqual(
    provingReport.structuralContractStatus,
    'pass',
    'Pythagorean structural contract status',
  );
  expectEqual(
    provingReport.provingFixtureUsefulnessStatus,
    'pass',
    'Pythagorean proving fixture usefulness status',
  );
  expectEqual(
    provingReport.provingEventSignatureStatus,
    'pass',
    'Pythagorean proving event signature status',
  );
  expectEqual(
    provingReport.pairSumUniquenessAudit.pairSumUniquenessStatus,
    'pass',
    'Pythagorean pair-sum uniqueness status',
  );
  expectEqual(
    provingReport.eventShellProvenance.eventShellProvenanceStatus,
    'pass',
    'Pythagorean event shell provenance status',
  );
  expectEqual(
    provingReport.childReadinessAudit.fieldReadyChildCount,
    6,
    'Pythagorean field-ready child count',
  );
  expectEqual(
    provingReport.childReadinessAudit.fallbackChildCount,
    0,
    'Pythagorean fallback child count',
  );
  expectEqual(
    provingReport.childReadinessAudit.unresolvedChildCount,
    0,
    'Pythagorean unresolved child count',
  );
  expectEqual(
    calibration.baseWaveNumberCalibrationStatus,
    'human-specified-v0',
    'base wave-number calibration status',
  );
  expectApprox(
    calibration.wavelengthToEdgeRatio,
    1 / 8,
    'wavelength to edge ratio',
  );
  expectEqual(
    calibration.edgeToWavelengthRatio,
    8,
    'edge to wavelength ratio',
  );
  expectApprox(
    calibration.referenceWavelength,
    calibration.referenceEdgeLengthValue / 8,
    'reference wavelength',
  );
  expectApprox(
    calibration.baseWaveNumber,
    (16 * Math.PI) / calibration.referenceEdgeLengthValue,
    'base wave-number 16*pi/E',
  );
  expectNotApprox(
    calibration.baseWaveNumber,
    Math.PI,
    'base wave-number is not inherited Math.PI',
  );
  expectApprox(shell.parentShellRatio, 3, 'event shell parent shell ratio');
  expectApprox(
    shell.childShellRatio,
    Math.sqrt(3),
    'event shell child shell ratio',
  );
  expectApprox(
    shell.circumradiusContraction,
    Math.sqrt(3),
    'event shell circumradius contraction',
  );
  expectEqual(shell.inradiusPreserved, true, 'event shell inradius preserved');
  expectEqual(
    shell.shellScalingApplication,
    'record-only-v0',
    'event shell scaling application',
  );
  expectEqual(
    provingReport.shellScalingApplication,
    'record-only-v0',
    'Pythagorean shell scaling application',
  );

  for (const child of provingReport.childDerivationTable) {
    expectEqual(
      child.childWaveNumberShellScalingApplied,
      false,
      `${child.childId} wave-number shell scaling flag`,
    );
    expectEqual(
      child.childAttenuationShellScalingApplied,
      false,
      `${child.childId} attenuation shell scaling flag`,
    );
    expectApprox(
      child.childWaveNumber,
      calibration.baseWaveNumber * child.childRatio,
      `${child.childId} child wave-number from log-ratio only`,
    );
    expectNotApprox(
      child.childWaveNumber,
      calibration.baseWaveNumber * child.childRatio * Math.sqrt(3),
      `${child.childId} child wave-number has no extra shell sqrt3 multiplier`,
    );

    if (child.derivedTuple) {
      expectApprox(
        child.derivedTuple.waveNumber,
        calibration.baseWaveNumber * child.childRatio,
        `${child.childId} emitted wave-number from log-ratio only`,
      );
      expectApprox(
        child.derivedTuple.attenuation,
        provingReport.primalSourceTable[0].attenuation,
        `${child.childId} emitted attenuation remains neutral`,
      );
      expectNotApprox(
        child.derivedTuple.attenuation,
        provingReport.primalSourceTable[0].attenuation * Math.sqrt(3),
        `${child.childId} attenuation has no extra shell sqrt3 multiplier`,
      );
    }
  }

  expectIncludes(
    provingReport.activeDifferentiatingAxes,
    'waveNumber',
    'active differentiating axes include waveNumber',
  );
  expectIncludes(
    provingReport.activeDifferentiatingAxes,
    'phase',
    'active differentiating axes include phase',
  );
  expectIncludes(
    provingReport.neutralAxes,
    'amplitude',
    'neutral axes include amplitude',
  );
  expectIncludes(
    provingReport.neutralAxes,
    'attenuation',
    'neutral axes include attenuation',
  );
  expectEqual(
    provingReport.packetWriteStatus,
    'not-packet-writing',
    'Pythagorean packet write status',
  );
  expectEqual(
    provingReport.shapeMutationStatus,
    'not-shape-mutation',
    'Pythagorean shape mutation status',
  );
  expectEqual(
    provingReport.topologyStatus,
    'not-topology-workspace',
    'Pythagorean topology status',
  );
  expectEqual(
    provingReport.operationRegistryStatus,
    'not-operation-registry-work',
    'Pythagorean operation registry status',
  );

  expectEqual(
    comparisonReport.controlRegime.controlRole,
    'bad-control',
    'comparison control role',
  );
  expectEqual(
    comparisonReport.controlRegime.expectedFailureStatus,
    'failed-as-expected',
    'comparison control failure status',
  );
  expectEqual(
    comparisonReport.provingCandidateRegime.candidateStatus,
    'pass',
    'comparison proving candidate status',
  );
  expectEqual(
    comparisonReport.comparisonStatus,
    'pass',
    'comparison status',
  );
  expectEqual(
    comparisonReport.gate1SourceSignatureProvingStatus,
    'pass',
    'Gate 1 source-signature proving status',
  );
  expectEqual(
    comparisonReport.gate2DownstreamSourceIntegrationStatus,
    'pass',
    'Gate 2 downstream source integration status',
  );
  expectEqual(
    comparisonReport.downstreamSwitchStatus,
    'field-cue-switched-generated-reading-inherits-v0',
    'downstream switch status',
  );
  expectEqual(
    /pythagorean|tetrachord/i.test(args.fieldCueSource),
    true,
    'FieldCueV0 source calls Pythagorean proving regime',
  );
  expectEqual(
    /sourceRegimeId|sourceSignatureStatus|childInheritanceGrammarId/i.test(
      args.generatedSiteReadingSource,
    ),
    true,
    'GeneratedSiteReadingV0 propagates source-regime provenance',
  );
  expectEqual(
    /pythagorean|tetrachord|source[-_ ]?signature[-_ ]?contract|sourceSignatureContractAudit/i.test(
      args.registrySource,
    ),
    false,
    'operation registry has no proving regime registration',
  );
  for (const [index, source] of args.componentSources.entries()) {
    expectEqual(
      /pythagorean|tetrachord|sourceRegimeId|sourceSignatureProvenance/i.test(
        source,
      ),
      false,
      `UI component ${index + 1} has no Gate 2 source-regime rendering changes`,
    );
  }
}

function printCompactSummary(args) {
  const { uniformReport, provingReport, comparisonReport } = args;
  const calibration = provingReport.baseWaveNumberCalibration;
  const shell = provingReport.eventShellProvenance;

  console.log('SourceSignatureContractAuditV0 diagnostics');
  console.log('');
  console.log('A. Uniform control summary');
  console.log(`structural status: ${uniformReport.structuralContractStatus}`);
  console.log(
    `proving fixture usefulness status: ${uniformReport.provingFixtureUsefulnessStatus}`,
  );
  console.log(
    `proving event signature status: ${uniformReport.provingEventSignatureStatus}`,
  );
  console.log(`human legibility status: ${uniformReport.humanLegibilityStatus}`);
  console.log(
    `scalar invariance: primal ${uniformReport.primalScalarVariationAudit.scalarVariationStatus}, children ${uniformReport.childScalarDistinctivenessAudit.childScalarDistinctivenessStatus}`,
  );
  console.log(`fallback children: ${formatFallbackChildren(uniformReport)}`);
  console.log(`issues: ${formatIssueCounts(uniformReport)}`);

  console.log('');
  console.log('B. Pythagorean proving candidate summary');
  console.log('profile slots / assignments');
  for (const slot of provingReport.profileSlots) {
    console.log(
      `${slot.assignedVertexId}: ${slot.slotId} | harmonic slot ${slot.ratioLabel} | ratio ${formatNumber(
        slot.ratio,
      )} | logRatio ${formatNumber(slot.logRatio)} | ${slot.assignmentMode}`,
    );
  }

  console.log('');
  console.log('base wave-number calibration');
  console.log(
    `status ${calibration.baseWaveNumberCalibrationStatus} / audit ${calibration.baseWaveNumberCalibrationAuditStatus}`,
  );
  console.log(
    `edge ${calibration.referenceEdgeLengthValue} | wavelength-edge ${calibration.wavelengthToEdgeRatioLabel} | reference wavelength ${formatNumber(
      calibration.referenceWavelength,
    )}`,
  );
  console.log(`baseWaveNumber ${formatNumber(calibration.baseWaveNumber)}`);

  console.log('');
  console.log('Keplerian event-shell provenance');
  console.log(
    `parent shell ${formatNumber(shell.parentShellRatio)} | child shell ${formatNumber(
      shell.childShellRatio,
    )} | circumradius contraction ${formatNumber(
      shell.circumradiusContraction,
    )} | inradius preserved ${shell.inradiusPreserved}`,
  );
  console.log(
    `event shell status ${shell.eventShellProvenanceStatus} | shell scaling ${shell.shellScalingApplication}`,
  );

  console.log('');
  console.log('pair-sum uniqueness');
  console.log(
    `status ${provingReport.pairSumUniquenessAudit.pairSumUniquenessStatus} | unique ${provingReport.pairSumUniquenessAudit.uniquePairSumCount}/${provingReport.pairSumUniquenessAudit.edgeCount}`,
  );
  for (const row of provingReport.pairSumUniquenessAudit.rows) {
    console.log(
      `${row.edgeId}: ${row.vertexIds.join('/')} | product ${
        row.ratioProductLabel
      } | log sum ${formatNumber(row.pairLogRatioSum)}`,
    );
  }

  console.log('');
  console.log('child readiness table');
  for (const row of provingReport.childDerivationTable) {
    console.log(
      `${row.childId}: ${row.sourceEdgeId} -> complement ${
        row.complementEdgeId
      } | channels ${row.channelPairs.join(', ')} | logRatio ${formatNumber(
        row.childLogRatio,
      )} | ratio ${formatNumber(row.childRatio)} | wave ${formatNumber(
        row.childWaveNumber,
      )} | wavelength ${formatNumber(row.childWavelength)} | phase ${formatNumber(
        row.derivedTuple?.phase,
      )} | field-ready ${row.fieldReady ? 'yes' : 'no'}`,
    );
  }

  console.log('');
  console.log(`fallback children: ${formatPythagoreanFallbackChildren(provingReport)}`);
  console.log(
    `active axes: ${provingReport.activeDifferentiatingAxes.join(', ')}`,
  );
  console.log(`neutral axes: ${provingReport.neutralAxes.join(', ')}`);
  console.log(`structural status: ${provingReport.structuralContractStatus}`);
  console.log(
    `proving fixture usefulness status: ${provingReport.provingFixtureUsefulnessStatus}`,
  );
  console.log(
    `proving event signature status: ${provingReport.provingEventSignatureStatus}`,
  );
  console.log(`human legibility status: ${provingReport.humanLegibilityStatus}`);
  console.log(`issue count: ${provingReport.issueCount}`);

  console.log('');
  console.log('C. Gate summary');
  console.log(
    `control classified as bad control: ${comparisonReport.controlRegime.controlRole}`,
  );
  console.log(
    `control failure status: ${comparisonReport.controlRegime.expectedFailureStatus}`,
  );
  console.log(
    `Pythagorean candidate status: ${comparisonReport.provingCandidateRegime.candidateStatus}`,
  );
  console.log(
    `Gate 1 source-signature proving status: ${comparisonReport.gate1SourceSignatureProvingStatus}`,
  );
  console.log(
    `Gate 2 downstream source integration status: ${comparisonReport.gate2DownstreamSourceIntegrationStatus}`,
  );
  console.log(`downstream switch: ${comparisonReport.downstreamSwitchStatus}`);
  console.log(`comparison issue count: ${comparisonReport.issueCount}`);
}

function expectIssueCode(report, code) {
  expectEqual(
    report.issues.some((issue) => issue.code === code),
    true,
    `issue code ${code}`,
  );
}

function formatFallbackChildren(report) {
  const fallbackRows = report.childDerivationTable.filter((row) => row.fallbackKind);

  return fallbackRows.length
    ? fallbackRows
        .map(
          (row) =>
            `${row.childId}:${row.fallbackKind}:${row.fallbackReason ?? 'no reason'}`,
        )
        .join(', ')
    : 'none';
}

function formatPythagoreanFallbackChildren(report) {
  const fallbackRows = report.childDerivationTable.filter((row) => row.fallbackKind);

  return fallbackRows.length
    ? fallbackRows
        .map(
          (row) =>
            `${row.childId}:${row.fallbackKind}:${row.fallbackReason ?? 'no reason'}`,
        )
        .join(', ')
    : 'none';
}

function formatIssueCounts(report) {
  const counts = new Map();

  for (const issue of report.issues) {
    counts.set(issue.code, (counts.get(issue.code) ?? 0) + 1);
  }

  return (
    Array.from(counts)
      .map(([code, count]) => `${code}=${count}`)
      .join(', ') || 'none'
  );
}

function formatNumber(value) {
  return Number.isFinite(value) ? value.toFixed(6) : String(value);
}

function expectIncludes(values, expected, label) {
  if (!Array.isArray(values) || !values.includes(expected)) {
    failures.push(`${label}: expected ${formatValue(values)} to include ${expected}`);
  }
}

function expectTruthy(value, label) {
  if (!value) {
    failures.push(`${label}: expected truthy value`);
  }
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    failures.push(`${label}: expected ${formatValue(expected)}, got ${formatValue(actual)}`);
  }
}

function expectApprox(actual, expected, label, tolerance = 1e-9) {
  if (
    !Number.isFinite(actual) ||
    !Number.isFinite(expected) ||
    Math.abs(actual - expected) > tolerance
  ) {
    failures.push(
      `${label}: expected approximately ${formatValue(expected)}, got ${formatValue(actual)}`,
    );
  }
}

function expectNotApprox(actual, unexpected, label, tolerance = 1e-9) {
  if (
    Number.isFinite(actual) &&
    Number.isFinite(unexpected) &&
    Math.abs(actual - unexpected) <= tolerance
  ) {
    failures.push(
      `${label}: expected not approximately ${formatValue(unexpected)}, got ${formatValue(actual)}`,
    );
  }
}

function formatValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

function readIfExists(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

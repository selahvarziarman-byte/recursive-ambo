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
const boundarySourcePath = path.join(
  repoRoot,
  'src/lib/fieldCueV0MultiProjectionUiBoundary.ts',
);
const panelPath = path.join(repoRoot, 'src/components/FieldCueV0Panel.tsx');
const inspectorPath = path.join(repoRoot, 'src/components/FieldAtlasInspector.tsx');
const registryPath = path.join(repoRoot, 'src/operations/registry.ts');
const storePath = path.join(repoRoot, 'src/store/geometryStore.ts');
const packagePath = path.join(repoRoot, 'package.json');
const {
  buildFieldCueV0MultiProjectionUiBoundaryReport,
} = require(boundarySourcePath);

const failures = [];
const passes = [];

const boundarySource = readRequiredFile(
  boundarySourcePath,
  'FieldCueV0 multi-projection UI boundary source',
);
const panelSource = readRequiredFile(panelPath, 'FieldCueV0Panel component');
const inspectorSource = readRequiredFile(
  inspectorPath,
  'FieldAtlasInspector component',
);
const registrySource = readRequiredFile(registryPath, 'operation registry');
const storeSource = readRequiredFile(storePath, 'geometry store');
const packageSource = readRequiredFile(packagePath, 'package.json');
const runnerSource = fs.readFileSync(__filename, 'utf8');
const boundaryReport = buildFieldCueV0MultiProjectionUiBoundaryReport();

if (
  boundarySource &&
  panelSource &&
  inspectorSource &&
  registrySource &&
  storeSource &&
  packageSource
) {
  runUiBoundaryReportDiagnostic(boundaryReport, {
    boundarySource,
    panelSource,
    runnerSource,
    registrySource,
  });
  expect(
    hasPackageScript(packageSource, 'diagnose:field-cue-v0-ui'),
    'package script',
    'diagnose:field-cue-v0-ui script exists',
  );
  expect(
    /FieldCueV0Panel/.test(inspectorSource) &&
      /<FieldCueV0Panel[\s\S]*?shape=\{shape\}[\s\S]*?hoveredProbeRef=\{hoveredFieldAtlasSampleId\}[\s\S]*?pinnedProbeRef=\{pinnedFieldAtlasProbeRef\}[\s\S]*?onHoverStart=\{setHoveredFieldAtlasSampleId\}[\s\S]*?onHoverEnd=\{clearHoveredFieldAtlasSampleId\}[\s\S]*?onTogglePinnedProbe=\{togglePinnedFieldAtlasProbeRef\}[\s\S]*?\/>/.test(
        inspectorSource,
      ),
    'inspector render',
    'FieldAtlasInspector renders FieldCueV0Panel with existing hover/pin props',
  );
  expect(
    /from\s+['"]\.\/FieldCueV0Panel['"]/.test(inspectorSource),
    'inspector import',
    'FieldAtlasInspector imports FieldCueV0Panel',
  );
  expect(
    /buildFieldCueV0Report/.test(panelSource),
    'report source',
    'panel uses buildFieldCueV0Report',
  );
  for (const propName of [
    'hoveredProbeRef',
    'pinnedProbeRef',
    'onHoverStart',
    'onHoverEnd',
    'onTogglePinnedProbe',
  ]) {
    expect(
      panelSource.includes(propName),
      'probe prop boundary',
      `FieldCueV0Panel accepts ${propName}`,
    );
  }
  for (const phrase of [
    'sourceProbeRef',
    'relation.probeRef',
    'sampleProbeRefs?.[0]',
    'onHoverStart(probeRef)',
    'onHoverEnd(probeRef)',
    'onTogglePinnedProbe(probeRef)',
  ]) {
    expect(
      panelSource.includes(phrase),
      'probe interaction boundary',
      `FieldCueV0Panel uses ${phrase}`,
    );
  }
  expect(
    !/useGeometryStore/.test(panelSource),
    'store boundary',
    'FieldCueV0Panel does not read or add store fields',
  );
  expect(
    !/fieldCueV0|FieldCueV0/.test(storeSource),
    'store boundary',
    'geometry store has no FieldCueV0 store fields',
  );
  expect(
    /import\s+type\s+\{\s*Shape\s*\}\s+from\s+['"]\.\.\/types\/geometry['"]/.test(
      panelSource,
    ) || /shape:\s*Shape/.test(panelSource),
    'shape prop boundary',
    'FieldCueV0Panel imports or accepts Shape type',
  );
  expect(
    panelSource.includes("shape.seedKey === 'tetrahedron'"),
    'support seed boundary',
    "FieldCueV0Panel checks seedKey === 'tetrahedron'",
  );
  expect(
    panelSource.includes("shape.genealogy.operation === 'ambo-dissection'"),
    'support operation boundary',
    "FieldCueV0Panel checks genealogy.operation === 'ambo-dissection'",
  );
  expect(
    panelSource.includes('shape.genealogy.generationDepth === 1'),
    'support generation boundary',
    'FieldCueV0Panel checks genealogy.generationDepth === 1',
  );
  expect(
    !/generationDepth\s*>=\s*1/.test(panelSource),
    'support generation boundary',
    'FieldCueV0Panel does not use generationDepth >= 1',
  );

  for (const phrase of [
    'FieldCueV0 unavailable',
    'one-Ambo tetrahedron only',
    'not general',
    'not semantic naming',
    'not topology',
    'not packet writing',
  ]) {
    expect(
      panelSource.includes(phrase),
      'unsupported language',
      `panel unsupported state contains "${phrase}"`,
    );
  }

  for (const phrase of [
    'FieldCueV0',
    'not semantic naming',
    'not topology',
    'not packet writing',
    'not general',
    'candidate',
  ]) {
    expect(
      panelSource.includes(phrase),
      'boundary language',
      `panel contains "${phrase}"`,
    );
  }

  for (const phrase of [
    'Source signature',
    'strength',
    'frequency',
    'phase',
    'decay',
    'what these numbers mean',
  ]) {
    expect(
      panelSource.includes(phrase),
      'source signature language',
      `panel contains source-signature translation "${phrase}"`,
    );
  }

  for (const phrase of [
    'Signature birth',
    'Quark channels',
    'merged',
  ]) {
    expect(
      panelSource.includes(phrase),
      'signature birth language',
      `panel contains signature-birth language "${phrase}"`,
    );
  }

  for (const phrase of [
    'unconfirmed cue',
    'unstable evidence',
    'read cautiously',
    'weak field pressure',
  ]) {
    expect(
      panelSource.includes(phrase),
      'human warning language',
      `panel contains human warning translation "${phrase}"`,
    );
  }

  for (const pattern of [
    /rule\s+\{relation\.meaningfulContributionRule\}/,
    /reliability\s+\{relation\.reliability\}/,
    /\{relation\.relationMaturity\}/,
    /candidate probe ref/,
    /source probe\s+\$\{shortenId\(sourceProbeRef\)\}/,
  ]) {
    expect(
      !pattern.test(panelSource),
      'diagnostic label boundary',
      `panel avoids prominent raw diagnostic label pattern ${pattern}`,
    );
  }

  expect(
    !panelSource.includes('candidate-relation'),
    'diagnostic label boundary',
    'panel source avoids candidate-relation as rendered copy',
  );
  expect(
    !panelSource.includes('reliability sensitive'),
    'diagnostic label boundary',
    'panel source avoids reliability sensitive as rendered copy',
  );

  for (const phrase of [
    'confirmed gate',
    'confirmed route',
    'confirmed region',
    'confirmed loop',
    'confirmed vortex',
    'route carries',
    'gate blocks',
    'region governs',
    'vortex organizes',
    'phase corridor',
    'topology import',
    'packet write',
  ]) {
    expect(
      !containsForbiddenMatureClaim(panelSource, phrase),
      'mature claim boundary',
      `panel source avoids "${phrase}" as a positive claim`,
    );
  }

  expect(
    !/fieldcue|field-cue|field cue/i.test(registrySource),
    'operation registry boundary',
    'operation registry has no field-cue registration',
  );
}

console.log('FieldCueV0 UI diagnostics');
printCompactBoundaryReport(boundaryReport);
for (const pass of passes) {
  console.log(`${pass}: PASS`);
}

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

function runUiBoundaryReportDiagnostic(report, sources) {
  expectEqual(
    report.diagnosticIntegrityStatus,
    'pass',
    'diagnostic integrity status',
  );
  expectEqual(
    report.fieldCueV0UiBoundaryStatus,
    'multi-projection-fieldcue-boundary-ready',
    'FieldCueV0 UI boundary status',
  );
  expectEqual(
    report.fieldCueV0RenderStatus,
    'not-rendered-this-branch',
    'FieldCueV0 render status',
  );
  expectEqual(
    report.generatedSiteReadingBoundaryStatus,
    'blocked-not-consuming-fieldcue-yet',
    'GeneratedSiteReading boundary status',
  );
  expectEqual(
    report.sourceReportStatus,
    'fieldcue-v0-d1-report-consumed',
    'FieldCueV0 D1 report consumed',
  );
  expectEqual(
    report.acceptedSourceStateRegimeId,
    'multi-projection-source-state-v0',
    'accepted source-state regime',
  );
  expectEqual(
    report.rawFieldWitnessStatus,
    'failed-insufficient-not-source-signature',
    'raw field witness status',
  );
  expectEqual(
    report.structuralWitnessStatus,
    'consumed-under-declared-basis',
    'structural witness status',
  );
  expectEqual(
    report.reductionLawAdoptionStatus,
    'not-adopted',
    'reduction law adoption status',
  );
  expectEqual(
    report.runtimePromotionStatus,
    'not-promoted',
    'runtime promotion status',
  );
  expectEqual(report.semanticStatus, 'not-semantic-naming', 'semantic status');
  expectEqual(report.topologyStatus, 'not-topology-workspace', 'topology status');
  expectEqual(report.packetWriteStatus, 'not-packet-writing', 'packet write status');
  expectEqual(
    report.operationRegistryStatus,
    'not-operation-registry-work',
    'operation registry status',
  );
  expectEqual(
    report.recommendedNextGate,
    'Gate D3 - FieldCueV0 Multi-Projection Display Adapter',
    'recommended next gate',
  );

  expectEqual(
    report.childBoundaryRows.length,
    6,
    'child boundary row count',
  );
  expectEqual(
    report.relationBoundaryRows.length,
    3,
    'relation boundary row count',
  );
  expectEqual(
    report.uiBoundarySummary.childBoundaryRowCount,
    6,
    'summary child boundary row count',
  );
  expectEqual(
    report.uiBoundarySummary.relationBoundaryRowCount,
    3,
    'summary relation boundary row count',
  );
  expectEqual(
    report.uiBoundarySummary.rawFieldVisibleClaimCount,
    0,
    'rawFieldVisibleClaimCount',
  );
  expectEqual(
    report.uiBoundarySummary.misleadingRiskRowCount,
    3,
    'misleading-risk row count',
  );
  expectEqual(
    report.uiBoundarySummary.structuralChannelVisibleRowCount,
    3,
    'structural-channel-visible row count',
  );
  expectEqual(
    report.uiBoundarySummary.tupleLossWarningCount,
    6,
    'tuple loss warning count',
  );
  expectEqual(report.uiBoundarySummary.boundaryReady, true, 'boundary ready');
  expectEqual(report.issueCount, 0, 'UI boundary issue count');
  expectEqual(report.ok, true, 'UI boundary report ok');

  expectEqual(
    report.childBoundaryRows.every(
      (row) =>
        row.propagationSummary.interpretation ===
          'ordinary-propagation-witness-not-full-source-signature' &&
        row.structuralSummary.interpretation ===
          'structural-relation-witness-under-declared-basis',
    ),
    true,
    'child boundary rows preserve projection interpretations',
  );
  expectEqual(
    report.childBoundaryRows.every(
      (row) =>
        row.reductionHonesty.emittedTupleStatus ===
          'propagation-facing-reduction-only' &&
        row.reductionHonesty.sourceSignatureStatus ===
          'structured-source-state-not-scalar-tuple' &&
        row.reductionHonesty.tupleLossWarning === true,
    ),
    true,
    'scalar tuple is not source signature',
  );

  for (const row of report.relationBoundaryRows) {
    expectTruthy(row.relationId, 'relation boundary row relation id');
    expectTruthy(row.leftChildSiteId, `${row.relationId} left child site id`);
    expectTruthy(row.rightChildSiteId, `${row.relationId} right child site id`);
    expectEqual(
      row.sourceStateRelation,
      'antipodal-opposition',
      `${row.relationId} source-state relation`,
    );
    expectEqual(
      row.rawFieldCueStatus,
      'misleading-if-read-as-raw-field',
      `${row.relationId} raw field cue status`,
    );
    expectEqual(
      row.structuralChannelCueStatus,
      'structural-channel-visible',
      `${row.relationId} structural channel cue status`,
    );
    expectEqual(
      row.depropagationCueStatus,
      'depropagation-recoverable',
      `${row.relationId} depropagation cue status`,
    );
    expectEqual(
      row.relationVisibilityStatuses.includes('raw-field-visible'),
      false,
      `${row.relationId} raw-field-visible is not claimed`,
    );
    expectEqual(
      row.relationVisibilityStatuses.includes(
        'misleading-if-read-as-raw-field',
      ),
      true,
      `${row.relationId} misleading warning status`,
    );
    expectEqual(row.misleadingRisk, true, `${row.relationId} misleading risk`);
    expectTruthy(
      row.cueWarning.includes('misleading-if-read-as-raw-field'),
      `${row.relationId} misleading warning copy`,
    );
    expectTruthy(
      row.cueWarning.includes('declared basis'),
      `${row.relationId} declared basis warning copy`,
    );
    expectEqual(row.uiWarningLevel, 'warning', `${row.relationId} warning level`);
    expectEqual(
      row.displayEligibility,
      'diagnostic-display-only-not-generated-site-reading',
      `${row.relationId} display eligibility`,
    );
  }

  expectEqual(
    report.generatedSiteBoundary.generatedSiteReadingV0Status,
    'blocked',
    'GeneratedSiteReadingV0 status',
  );
  expectEqual(
    report.generatedSiteBoundary.generatedSiteReadingConsumptionStatus,
    'not-authorized',
    'GeneratedSiteReading consumption status',
  );
  expectEqual(
    report.generatedSiteBoundary.generatedSiteReadingReason,
    'FieldCueV0 boundary is prepared but GeneratedSiteReadingV0 has not been adapted.',
    'GeneratedSiteReading boundary reason',
  );

  expectEqual(
    containsGeneratedSiteReadingV0Import(sources.boundarySource),
    false,
    'boundary source does not import GeneratedSiteReadingV0',
  );
  expectEqual(
    containsGeneratedSiteReadingV0Import(sources.runnerSource),
    false,
    'UI diagnostic script does not import GeneratedSiteReadingV0',
  );
  expectEqual(
    containsReactUiImport(sources.boundarySource),
    false,
    'boundary source does not import React UI components',
  );
  expectEqual(
    containsReactUiImport(sources.runnerSource),
    false,
    'UI diagnostic script does not import React UI components',
  );
  expectEqual(
    Object.keys(require.cache).some((modulePath) =>
      /generatedSiteReadingV0/i.test(modulePath),
    ),
    false,
    'runtime cache did not load GeneratedSiteReadingV0',
  );
  expectEqual(
    Object.keys(require.cache).some((modulePath) =>
      /src[\\/]components[\\/]|FieldCueV0Panel|GeneratedSiteReadingV0Panel/i.test(
        modulePath,
      ),
    ),
    false,
    'runtime cache did not load React UI components',
  );
  expectEqual(
    /fieldCueV0MultiProjectionUiBoundary|multi[-_ ]?projection[-_ ]?ui[-_ ]?boundary|Gate D2|Gate D3/i.test(
      sources.registrySource,
    ),
    false,
    'operation registry is not contaminated by D2 work',
  );
  expectEqual(
    /fieldCueV0MultiProjectionUiBoundary|multiProjection|relationBoundaryRows/.test(
      sources.panelSource,
    ),
    false,
    'React UI rendering did not change for D2 boundary payload',
  );

  passes.push('FieldCueV0 UI multi-projection boundary report');
}

function printCompactBoundaryReport(report) {
  console.log('FieldCueV0 UI boundary compact summary');
  console.log(`diagnosticIntegrityStatus: ${report.diagnosticIntegrityStatus}`);
  console.log(
    `fieldCueV0UiBoundaryStatus: ${report.fieldCueV0UiBoundaryStatus}`,
  );
  console.log(`fieldCueV0RenderStatus: ${report.fieldCueV0RenderStatus}`);
  console.log(
    `generatedSiteReadingBoundaryStatus: ${report.generatedSiteReadingBoundaryStatus}`,
  );
  console.log(`acceptedSourceStateRegimeId: ${report.acceptedSourceStateRegimeId}`);
  console.log(
    `childBoundaryRowCount: ${report.uiBoundarySummary.childBoundaryRowCount}`,
  );
  console.log(
    `relationBoundaryRowCount: ${report.uiBoundarySummary.relationBoundaryRowCount}`,
  );
  console.log(
    `rawFieldVisibleClaimCount: ${report.uiBoundarySummary.rawFieldVisibleClaimCount}`,
  );
  console.log(
    `misleadingRiskRowCount: ${report.uiBoundarySummary.misleadingRiskRowCount}`,
  );
  console.log(`runtimePromotionStatus: ${report.runtimePromotionStatus}`);
  console.log(`recommendedNextGate: ${report.recommendedNextGate}`);
  console.log('');
}

function readRequiredFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    failures.push(`${label} missing at ${path.relative(repoRoot, filePath)}`);
    return '';
  }

  passes.push(`${label} exists`);
  return fs.readFileSync(filePath, 'utf8');
}

function hasPackageScript(source, scriptName) {
  try {
    const packageJson = JSON.parse(source);
    return Object.prototype.hasOwnProperty.call(packageJson.scripts ?? {}, scriptName);
  } catch (error) {
    failures.push(`package.json parse failed: ${formatError(error)}`);
    return false;
  }
}

function containsForbiddenMatureClaim(source, phrase) {
  const lowerSource = source.toLowerCase();
  const lowerPhrase = phrase.toLowerCase();
  let searchIndex = lowerSource.indexOf(lowerPhrase);

  while (searchIndex !== -1) {
    if (!isAllowedNegatedPacketWrite(lowerSource, lowerPhrase, searchIndex)) {
      return true;
    }

    searchIndex = lowerSource.indexOf(lowerPhrase, searchIndex + lowerPhrase.length);
  }

  return false;
}

function isAllowedNegatedPacketWrite(source, phrase, index) {
  if (phrase !== 'packet write') {
    return false;
  }

  const prefix = source.slice(Math.max(0, index - 4), index);

  return prefix.endsWith('no ');
}

function expect(condition, label, message) {
  if (condition) {
    passes.push(label);
    return;
  }

  failures.push(message);
}

function expectEqual(actual, expected, label) {
  expect(
    actual === expected,
    label,
    `${label}: expected ${formatValue(expected)}, got ${formatValue(actual)}`,
  );
}

function expectTruthy(value, label) {
  expect(Boolean(value), label, `${label}: expected truthy value`);
}

function containsGeneratedSiteReadingV0Import(source) {
  return /from\s+['"][^'"]*generatedSiteReadingV0|require\([^)]*generatedSiteReadingV0/i.test(
    source,
  );
}

function containsReactUiImport(source) {
  return /from\s+['"][^'"]*(?:components|FieldCueV0Panel|GeneratedSiteReadingV0Panel|\.tsx)|require\([^)]*(?:components|FieldCueV0Panel|GeneratedSiteReadingV0Panel|\.tsx)/i.test(
    source,
  );
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

function formatValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

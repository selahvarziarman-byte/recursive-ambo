#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');
const policyPanelPath = path.join(
  repoRoot,
  'src/components/FieldSourcePolicyV0Panel.tsx',
);
const generatedPanelPath = path.join(
  repoRoot,
  'src/components/GeneratedSiteReadingV0Panel.tsx',
);
const displayAdapterPath = path.join(
  repoRoot,
  'src/lib/generatedSiteReadingV0FieldCueDisplayAdapter.ts',
);
const inspectorPath = path.join(repoRoot, 'src/components/FieldAtlasInspector.tsx');
const packagePath = path.join(repoRoot, 'package.json');

const REQUIRED_POLICY_PANEL_TEXT = [
  'Field / Source Policy V0',
  'Current seed key',
  'Current operation',
  'Current generation depth',
  'Tetrahedron seed',
  'One Ambo dissection',
  'Generation depth 1',
  'Six generated midpoint children',
  'AB ↔ CD',
  'AC ↔ BD',
  'AD ↔ BC',
  'Structured source state uses two projections',
  'Propagation projection',
  'amplitude',
  'wave number',
  'phase',
  'attenuation',
  'Structural projection',
  'edge state',
  'complement edge',
  'antipodal child',
  'axis pair',
  'relation visibility',
  'emitted tuple',
  'propagation-facing projection',
  'full source state',
  'Raw field behavior did not recover structural relations by itself',
  'declared structural source-state projection',
  'This panel states the current field/source configuration',
  'It does not assign generated-site interpretations',
  'Manual labels and packets remain user-authored',
  'Field topology is not being displayed as product structure',
  'Next product task: First-Stone Field Statement',
];

const FORBIDDEN_POLICY_PANEL_TEXT = [
  ['Naming', 'is', 'disabled'].join(' '),
  'GeneratedSiteReadingV0 FieldCue Evidence',
  'Carrier wave number',
  'Carrier phase',
  'Attenuation as row display',
  'Feature observations as row display',
  'Route/gate candidates as row display',
  'Support/region candidates as row display',
  'Forbidden Interpretations',
  'What concept could inhabit',
  'What, if anything, can dwell',
];

const REQUIRED_INTERNAL_ADAPTER_STATUSES = [
  'internal-diagnostic-adapter-available',
  'hidden-in-internal-diagnostics',
  'diagnostic-ui-quarantined-not-product-surface',
  'not-product-rendered',
  'product-boundary-restored',
  'hidden-from-product-ui',
  'missing-next',
  'Gate F0 - First-Stone Field Statement',
];

const FORBIDDEN_ADAPTER_STATUS_TEXT = [
  "'disabled'",
  'mounted-display-adapter-ready',
  'mounted-in-generated-site-reading-panel',
  'diagnostic-library-display-mounted',
  'Gate E0 - Field Layer Generalization Gap Review',
];

const FORBIDDEN_WORKTREE_PATHS = [
  'package.json',
  'docs',
  'src/operations/registry.ts',
  'src/lib/fieldAtlas.ts',
  'src/store',
];

const LABEL_PACKET_EDITING_PATHS = [
  'src/components/VertexPacketEditor.tsx',
  'src/components/Panels.tsx',
  'src/lib/packets.ts',
];

const failures = [];

const policyPanelSource = readRequiredFile(
  policyPanelPath,
  'FieldSourcePolicyV0Panel component',
);
const generatedPanelSource = readRequiredFile(
  generatedPanelPath,
  'GeneratedSiteReadingV0Panel component',
);
const displayAdapterSource = readRequiredFile(
  displayAdapterPath,
  'GeneratedSiteReadingV0 FieldCue display adapter',
);
const inspectorSource = readRequiredFile(
  inspectorPath,
  'FieldAtlasInspector component',
);
const packageSource = readRequiredFile(packagePath, 'package.json');

const policyPanelExists = Boolean(policyPanelSource);
const policyPanelImported = importsPolicyPanel(generatedPanelSource);
const policyPanelReceivesShape = passesShapeToPolicyPanel(generatedPanelSource);
const policyPanelShapeAware = [
  'shape.seedKey',
  'shape.genealogy.operation',
  'shape.genealogy.generationDepth',
].every((text) => policyPanelSource.includes(text));
const generatedSiteDiagnosticHidden =
  !rendersGeneratedSiteReadingFieldCueDisplay(generatedPanelSource) ||
  hasClosedInternalGeneratedSiteDiagnosticDisclosure(generatedPanelSource);
const fieldCueDiagnosticHidden =
  hasClosedInternalFieldCueDiagnosticDisclosure(inspectorSource);
const fieldPolicyVisible = [
  'The current field layer is diagnostic/prototype-only',
  'Raw field behavior did not recover structural relations by itself',
  'declared structural source-state projection',
  'Route/gate/support/region data remains internal candidate diagnostics',
].every((text) => containsVisibleText(policyPanelSource, text));
const sourcePolicyVisible = [
  'Structured source state uses two projections',
  'Propagation projection',
  'Structural projection',
  'propagation-facing projection',
  'full source state',
].every((text) => containsVisibleText(policyPanelSource, text));
const productBoundaryRestored = [
  'This panel states the current field/source configuration',
  'It does not assign generated-site interpretations',
  'Manual labels and packets remain user-authored',
  'Field topology is not being displayed as product structure',
  'Next product task: First-Stone Field Statement',
].every((text) => containsVisibleText(policyPanelSource, text));
const firstStoneFieldStatementMissing = containsVisibleText(
  policyPanelSource,
  'Next product task: First-Stone Field Statement',
);
const manualLabelEditingPreserved =
  getChangedPaths(LABEL_PACKET_EDITING_PATHS).length === 0 &&
  getChangedPaths(['src/store']).length === 0;
const packetEditingPreserved =
  getChangedPaths(LABEL_PACKET_EDITING_PATHS).length === 0 &&
  getChangedPaths(['src/store']).length === 0;

if (
  policyPanelSource &&
  generatedPanelSource &&
  displayAdapterSource &&
  inspectorSource &&
  packageSource
) {
  runD11R1Diagnostic();
}

const status = {
  policyPanelStatus:
    policyPanelExists && policyPanelImported
      ? 'field-source-policy-visible'
      : 'field-source-policy-missing',
  shapeAwarenessStatus:
    policyPanelReceivesShape && policyPanelShapeAware
      ? 'current-shape-visible'
      : 'missing',
  generatedSiteDiagnosticDisplayStatus: generatedSiteDiagnosticHidden
    ? 'hidden-from-product-ui'
    : 'visible-in-product-ui',
  fieldCueDiagnosticDisplayStatus: fieldCueDiagnosticHidden
    ? 'hidden-from-product-ui'
    : 'visible-in-product-ui',
  manualLabelEditingStatus: manualLabelEditingPreserved
    ? 'preserved'
    : 'changed',
  packetEditingStatus: packetEditingPreserved ? 'preserved' : 'changed',
  productBoundaryStatus: productBoundaryRestored ? 'restored' : 'missing',
  firstStoneFieldStatementStatus: firstStoneFieldStatementMissing
    ? 'missing-next'
    : 'missing',
  recommendedNextGate: 'Gate F0 - First-Stone Field Statement',
};

printCompactReport(status);

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

function runD11R1Diagnostic() {
  expectEqual(policyPanelExists, true, 'FieldSourcePolicyV0Panel exists');
  expectEqual(
    policyPanelImported,
    true,
    'GeneratedSiteReadingV0Panel imports FieldSourcePolicyV0Panel',
  );
  expectEqual(
    policyPanelReceivesShape,
    true,
    'GeneratedSiteReadingV0Panel passes shape into FieldSourcePolicyV0Panel',
  );
  expectEqual(
    policyPanelShapeAware,
    true,
    'FieldSourcePolicyV0Panel displays current shape seed/operation/generation',
  );
  expectEqual(
    /<GeneratedSiteReadingV0Panel\s+shape=\{shape\}\s*\/>/.test(
      inspectorSource,
    ),
    true,
    'FieldAtlasInspector still renders GeneratedSiteReadingV0Panel as before',
  );
  expectEqual(
    hasPackageScript(packageSource, 'diagnose:generated-site-reading-v0-ui'),
    true,
    'diagnose:generated-site-reading-v0-ui package script exists',
  );
  expectEqual(
    isDirectDefaultGeneratedSiteDisplayMount(generatedPanelSource),
    false,
    'GeneratedSiteReadingV0FieldCueDisplay is not visible by default',
  );
  expectEqual(
    generatedSiteDiagnosticHidden,
    true,
    'GeneratedSiteReadingV0 diagnostics are hidden from product UI',
  );
  expectEqual(
    fieldCueDiagnosticHidden,
    true,
    'FieldCueV0 diagnostic wall is hidden from default UI',
  );

  for (const text of REQUIRED_POLICY_PANEL_TEXT) {
    expectEqual(
      containsVisibleText(policyPanelSource, text),
      true,
      `visible policy panel contains "${text}"`,
    );
  }

  for (const text of FORBIDDEN_POLICY_PANEL_TEXT) {
    expectEqual(
      containsVisibleText(policyPanelSource, text),
      false,
      `visible policy panel omits "${text}"`,
    );
  }

  for (const statusText of REQUIRED_INTERNAL_ADAPTER_STATUSES) {
    expectEqual(
      displayAdapterSource.includes(statusText),
      true,
      `display adapter contains status "${statusText}"`,
    );
  }

  for (const statusText of FORBIDDEN_ADAPTER_STATUS_TEXT) {
    expectEqual(
      displayAdapterSource.includes(statusText),
      false,
      `display adapter avoids stale status "${statusText}"`,
    );
  }

  expectEqual(
    containsFieldAtlasImport(policyPanelSource),
    false,
    'policy panel has no fieldAtlas import',
  );
  expectEqual(
    containsStoreImport(policyPanelSource),
    false,
    'policy panel has no store import',
  );
  expectEqual(
    containsOperationRegistryImport(policyPanelSource),
    false,
    'policy panel has no operation registry import',
  );
  expectEqual(
    getChangedPaths(FORBIDDEN_WORKTREE_PATHS).length,
    0,
    'no package/docs/registry/fieldAtlas/store changes',
  );
  expectEqual(
    getChangedPaths(LABEL_PACKET_EDITING_PATHS).length,
    0,
    'no label/packet editing files changed',
  );
  expectEqual(manualLabelEditingPreserved, true, 'manual label editing preserved');
  expectEqual(packetEditingPreserved, true, 'packet editing preserved');
}

function printCompactReport(reportStatus) {
  console.log('GeneratedSiteReadingV0 D11-R1 UI diagnostics');
  console.log(`policyPanelStatus = ${reportStatus.policyPanelStatus}`);
  console.log(`shapeAwarenessStatus = ${reportStatus.shapeAwarenessStatus}`);
  console.log(
    `generatedSiteDiagnosticDisplayStatus = ${reportStatus.generatedSiteDiagnosticDisplayStatus}`,
  );
  console.log(
    `fieldCueDiagnosticDisplayStatus = ${reportStatus.fieldCueDiagnosticDisplayStatus}`,
  );
  console.log(
    `manualLabelEditingStatus = ${reportStatus.manualLabelEditingStatus}`,
  );
  console.log(`packetEditingStatus = ${reportStatus.packetEditingStatus}`);
  console.log(`productBoundaryStatus = ${reportStatus.productBoundaryStatus}`);
  console.log(
    `firstStoneFieldStatementStatus = ${reportStatus.firstStoneFieldStatementStatus}`,
  );
  console.log(`recommendedNextGate = ${reportStatus.recommendedNextGate}`);
  console.log(`issue count = ${failures.length}`);
}

function readRequiredFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    failures.push(`${label} missing at ${path.relative(repoRoot, filePath)}`);
    return '';
  }

  return fs.readFileSync(filePath, 'utf8');
}

function importsPolicyPanel(source) {
  return /from\s+['"]\.\/FieldSourcePolicyV0Panel['"]/.test(source);
}

function passesShapeToPolicyPanel(source) {
  return /<FieldSourcePolicyV0Panel\s+shape=\{shape\}\s*\/>/.test(source);
}

function rendersGeneratedSiteReadingFieldCueDisplay(source) {
  return /<GeneratedSiteReadingV0FieldCueDisplay[\s/>]/.test(source);
}

function isDirectDefaultGeneratedSiteDisplayMount(source) {
  return (
    rendersGeneratedSiteReadingFieldCueDisplay(source) &&
    !hasClosedInternalGeneratedSiteDiagnosticDisclosure(source)
  );
}

function hasClosedInternalGeneratedSiteDiagnosticDisclosure(source) {
  return (
    /<details\b(?![^>]*\bopen\b)[^>]*>[\s\S]*?<summary[\s\S]*?Internal GeneratedSiteReadingV0 FieldCue diagnostics[\s\S]*?hidden from product UI[\s\S]*?<\/summary>[\s\S]*?<GeneratedSiteReadingV0FieldCueDisplay[\s/>]/.test(
      source,
    ) &&
    !/<details[^>]*\sopen(?:\s|>|=)/.test(source)
  );
}

function hasClosedInternalFieldCueDiagnosticDisclosure(source) {
  const summaryIndex = source.indexOf('Internal FieldCueV0 diagnostics');
  const fieldCuePanelIndex = source.indexOf('<FieldCueV0Panel', summaryIndex);
  const detailsIndex = source.lastIndexOf('<details', summaryIndex);

  if (summaryIndex === -1 || fieldCuePanelIndex === -1 || detailsIndex === -1) {
    return false;
  }

  const detailsTagEnd = source.indexOf('>', detailsIndex);
  const detailsTag = source.slice(detailsIndex, detailsTagEnd + 1);

  return !/\bopen\b/.test(detailsTag);
}

function containsVisibleText(source, text) {
  return normalizeText(source).includes(normalizeText(text));
}

function normalizeText(value) {
  return value.replace(/\s+/g, ' ').trim();
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

function containsFieldAtlasImport(source) {
  return /from\s+['"][^'"]*fieldAtlas(?:\.[cm]?[tj]s)?['"]|require\(\s*['"][^'"]*fieldAtlas(?:\.[cm]?[tj]s)?['"]\s*\)/i.test(
    source,
  );
}

function containsStoreImport(source) {
  return /from\s+['"][^'"]*(?:[/\\]store[/\\]|geometryStore)(?:\.[cm]?[tj]sx?)?['"]|require\(\s*['"][^'"]*(?:[/\\]store[/\\]|geometryStore)(?:\.[cm]?[tj]sx?)?['"]\s*\)/i.test(
    source,
  );
}

function containsOperationRegistryImport(source) {
  return /from\s+['"][^'"]*operations[/\\]registry(?:\.[cm]?[tj]s)?['"]|require\(\s*['"][^'"]*operations[/\\]registry(?:\.[cm]?[tj]s)?['"]\s*\)/i.test(
    source,
  );
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

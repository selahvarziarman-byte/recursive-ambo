#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const panelPath = path.join(
  repoRoot,
  'src/components/GeneratedSiteReadingV0Panel.tsx',
);
const inspectorPath = path.join(repoRoot, 'src/components/FieldAtlasInspector.tsx');
const registryPath = path.join(repoRoot, 'src/operations/registry.ts');
const storePath = path.join(repoRoot, 'src/store/geometryStore.ts');
const packagePath = path.join(repoRoot, 'package.json');

const failures = [];
const passes = [];

const panelSource = readRequiredFile(
  panelPath,
  'GeneratedSiteReadingV0Panel component',
);
const inspectorSource = readRequiredFile(
  inspectorPath,
  'FieldAtlasInspector component',
);
const registrySource = readRequiredFile(registryPath, 'operation registry');
const storeSource = readRequiredFile(storePath, 'geometry store');
const packageSource = readRequiredFile(packagePath, 'package.json');

if (panelSource && inspectorSource && registrySource && storeSource && packageSource) {
  expect(
    hasPackageScript(packageSource, 'diagnose:generated-site-reading-v0-ui'),
    'package script',
    'diagnose:generated-site-reading-v0-ui script exists',
  );
  expect(
    /from\s+['"]\.\/GeneratedSiteReadingV0Panel['"]/.test(inspectorSource),
    'inspector import',
    'FieldAtlasInspector imports GeneratedSiteReadingV0Panel',
  );
  expect(
    /<GeneratedSiteReadingV0Panel\s+shape=\{shape\}\s*\/>/.test(
      inspectorSource,
    ),
    'inspector render',
    'FieldAtlasInspector renders GeneratedSiteReadingV0Panel with shape prop',
  );
  expect(
    /<details[\s\S]*?<summary[\s\S]*?Field witness details[\s\S]*?<FieldCueV0Panel[\s\S]*?\/>[\s\S]*?<\/details>/.test(
      inspectorSource,
    ),
    'field witness demotion',
    'FieldCueV0Panel is demoted inside Field witness details',
  );
  expect(
    inspectorSource.includes('FieldCueV0 source-signature and candidate details'),
    'field witness demotion',
    'FieldAtlasInspector includes FieldCueV0 source-signature detail text',
  );
  expect(
    /buildGeneratedSiteReadingV0Report/.test(panelSource),
    'report source',
    'panel uses buildGeneratedSiteReadingV0Report',
  );
  expect(
    panelSource.includes("shape.seedKey === 'tetrahedron'"),
    'support seed boundary',
    "GeneratedSiteReadingV0Panel checks seedKey === 'tetrahedron'",
  );
  expect(
    panelSource.includes("shape.genealogy.operation === 'ambo-dissection'"),
    'support operation boundary',
    "GeneratedSiteReadingV0Panel checks genealogy.operation === 'ambo-dissection'",
  );
  expect(
    panelSource.includes('shape.genealogy.generationDepth === 1'),
    'support generation boundary',
    'GeneratedSiteReadingV0Panel checks genealogy.generationDepth === 1',
  );
  expect(
    !/generationDepth\s*>=\s*1/.test(panelSource),
    'support generation boundary',
    'GeneratedSiteReadingV0Panel does not use generationDepth >= 1',
  );

  for (const phrase of [
    'GeneratedSiteReadingV0 unavailable',
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

  const lowerPanelSource = panelSource.toLowerCase();
  for (const phrase of [
    'geometry witness',
    'birth-law witness',
    'field witness',
    'human names',
    'question only',
  ]) {
    expect(
      lowerPanelSource.includes(phrase),
      'central witness language',
      `panel contains central witness language "${phrase}"`,
    );
  }

  for (const phrase of [
    'derived source signature',
    'fallback source signature',
    'unresolved source signature',
    'collapsed source signature',
    'source signature unavailable',
  ]) {
    expect(
      panelSource.includes(phrase),
      'inheritance translation language',
      `panel contains inheritance translation "${phrase}"`,
    );
  }

  expect(
    !/generated[-_ ]?site[-_ ]?reading|GeneratedSiteReadingV0|reading[-_ ]?v0/i.test(
      registrySource,
    ),
    'operation registry boundary',
    'operation registry has no generated-site reading registration',
  );
  expect(
    !/GeneratedSiteReadingV0|generatedSiteReading|generated[-_ ]site[-_ ]reading/i.test(
      storeSource,
    ),
    'geometry store boundary',
    'geometry store has no GeneratedSiteReadingV0 store fields',
  );

  for (const phrase of [
    'confirmed gate',
    'confirmed route',
    'confirmed region',
    'gate blocks',
    'route carries',
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
}

console.log('GeneratedSiteReadingV0 UI diagnostics');
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
    return Object.prototype.hasOwnProperty.call(
      packageJson.scripts ?? {},
      scriptName,
    );
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

    searchIndex = lowerSource.indexOf(
      lowerPhrase,
      searchIndex + lowerPhrase.length,
    );
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

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

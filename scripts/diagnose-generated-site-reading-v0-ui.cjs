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
  const generatedPanelRenderIndex = inspectorSource.indexOf(
    '<GeneratedSiteReadingV0Panel',
  );
  const fieldCuePanelRenderIndex = inspectorSource.indexOf('<FieldCueV0Panel');

  expect(
    generatedPanelRenderIndex !== -1 &&
      fieldCuePanelRenderIndex !== -1 &&
      generatedPanelRenderIndex < fieldCuePanelRenderIndex,
    'inspector render order',
    'GeneratedSiteReadingV0Panel renders before FieldCueV0Panel',
  );
  expect(
    /<details[\s\S]*?<summary[\s\S]*?Field witness details[\s\S]*?<FieldCueV0Panel[\s\S]*?\/>[\s\S]*?<\/details>/.test(
      inspectorSource,
    ),
    'field witness demotion',
    'FieldCueV0Panel is demoted inside Field witness details',
  );
  expect(
    inspectorSource.includes('source signature, candidate links, probe highlighting'),
    'field witness demotion',
    'FieldAtlasInspector includes FieldCueV0 collapsed summary detail text',
  );
  expect(
    /<details[\s\S]*?<summary[\s\S]*?(Technical field diagnostics|Internal field diagnostics)[\s\S]*?<ProfileAwareFieldModeRuntimeSection[\s\S]*?\/>[\s\S]*?<\/details>/.test(
      inspectorSource,
    ),
    'technical diagnostics demotion',
    'ProfileAwareFieldModeRuntimeSection is demoted inside technical diagnostics details',
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

  for (const phrase of [
    'Source signature',
    'How the signature was derived',
    'derivation details',
    'Field contact',
    'Naming pressure',
    'field touchpoint',
    'strength',
    'frequency',
    'phase',
    'decay',
  ]) {
    expect(
      panelSource.includes(phrase),
      'generated-site reading flow language',
      `panel contains generated-site reading flow language "${phrase}"`,
    );
  }

  for (const phrase of [
    'human names',
    'question only',
  ]) {
    expect(
      panelSource.toLowerCase().includes(phrase),
      'human naming boundary language',
      `panel contains human naming boundary language "${phrase}"`,
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
    /function\s+buildSiteSpecificNamingPrompt/.test(panelSource),
    'site-specific naming prompt',
    'panel contains buildSiteSpecificNamingPrompt helper',
  );
  expect(
    !/humanNamingPrompt\.primaryNamingQuestion/.test(panelSource),
    'site-specific naming prompt',
    'panel does not render generic report primary naming question directly',
  );
  expect(
    countOccurrences(
      panelSource,
      'What, if anything, can dwell at this generated site?',
    ) <= 1,
    'site-specific naming prompt',
    'generic naming question appears only as fallback text',
  );

  for (const phrase of [
    'candidate-relation',
    'dominant-source-contribution',
    'reliability sensitive',
    'feature observation',
    'handoff pressure',
    'misleading-risk',
  ]) {
    expect(
      !panelSource.toLowerCase().includes(phrase),
      'primary diagnostic language boundary',
      `panel avoids primary rendered diagnostic term "${phrase}"`,
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

function countOccurrences(source, phrase) {
  let count = 0;
  let searchIndex = source.indexOf(phrase);

  while (searchIndex !== -1) {
    count += 1;
    searchIndex = source.indexOf(phrase, searchIndex + phrase.length);
  }

  return count;
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

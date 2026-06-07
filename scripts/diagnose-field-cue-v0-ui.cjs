#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const panelPath = path.join(repoRoot, 'src/components/FieldCueV0Panel.tsx');
const inspectorPath = path.join(repoRoot, 'src/components/FieldAtlasInspector.tsx');
const registryPath = path.join(repoRoot, 'src/operations/registry.ts');
const storePath = path.join(repoRoot, 'src/store/geometryStore.ts');
const packagePath = path.join(repoRoot, 'package.json');

const failures = [];
const passes = [];

const panelSource = readRequiredFile(panelPath, 'FieldCueV0Panel component');
const inspectorSource = readRequiredFile(
  inspectorPath,
  'FieldAtlasInspector component',
);
const registrySource = readRequiredFile(registryPath, 'operation registry');
const storeSource = readRequiredFile(storePath, 'geometry store');
const packageSource = readRequiredFile(packagePath, 'package.json');

if (panelSource && inspectorSource && registrySource && storeSource && packageSource) {
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

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

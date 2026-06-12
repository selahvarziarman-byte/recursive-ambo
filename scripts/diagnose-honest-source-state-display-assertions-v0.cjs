#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
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
const modulePath = path.join(repoRoot, 'src/lib/honestSourceStateReadingV0.ts');
const {
  buildHonestSourceStateReadingV0Report,
  buildRevisedCardBodyLines,
  renderReadingCard,
  splitBaselineArtifact,
  HONEST_READING_SITE_IDS,
  HONEST_RELATION_DISPLAY_ORDER,
  IV_B_HONESTY_CONTRACT_STATUSES,
  IV_B_BINDING_RAW_FIELD_WARNING,
  IV_B_CONTRACT_HASH_ECHO,
  CUBE_DUAL_PROVENANCE_ONLY_WORDING,
} = require(modulePath);

const BASELINE_SCRIPT = path.join(
  repoRoot,
  'scripts/preview-generated-site-reading-v0.cjs',
);
const BASELINE_LABEL = 'BASELINE pre-campaign scalar reading';
const REVISED_LABEL = 'REVISED honest source-state reading';

// Gate-C.5 claim-positive statuses + field-activity claim strings. None may
// appear in the revised rendered reading (c-technical; IV-A classified no
// relation as field-active).
const FORBIDDEN_FIELD_ACTIVITY_CLAIMS = [
  'field-active',
  'field-witnessed',
  'field-confirmed',
  'raw-field-visible',
  'structural-channel-visible',
  'depropagation-recoverable',
  'propagation-transformed',
  'field pressure',
  'field candidates',
  'participation available',
  'field witness:',
];

// Exact negated disclosures that are allowed (removed before scanning).
const ALLOWED_NEGATED_PHRASES = [
  'nothing-field-active',
  'nothing presented as field-active',
];

// Historical no-S0 lexicon (from the pre-campaign preview), kept binding on
// the revised reading.
const FORBIDDEN_MATURE_CLAIMS = [
  'confirmed gate',
  'confirmed route',
  'confirmed region',
  'confirmed loop',
  'confirmed vortex',
  'gate blocks',
  'route carries',
  'region governs',
  'vortex organizes',
  'phase corridor',
  'topology import',
  'packet write',
];

const ALLOWED_DISPLAY_STATUSES = new Set([
  'tuple-projection-lost',
  'source-state-only',
  'unsupported',
]);

const NULL_ROW_PATTERNS = [
  /^provenance tetra-G2-core: \[status: unsupported\] \(empty\)$/,
  /^provenance octa-G1: \[status: unsupported\] \(empty\)$/,
  new RegExp(
    `^provenance cube-G1-dual: \\[status: unsupported\\] \\(empty; ${CUBE_DUAL_PROVENANCE_ONLY_WORDING}\\)$`,
  ),
  new RegExp(
    `^cube-primal-sourcehood boundary: \\[status: unsupported\\] \\(empty; ${CUBE_DUAL_PROVENANCE_ONLY_WORDING}\\)$`,
  ),
];

const failures = [];
const passes = [];

function assertOk(condition, label, detail) {
  if (condition) {
    passes.push(label);
  } else {
    failures.push(detail ? `${label} -- ${detail}` : label);
  }
}

console.log('=== honest source-state reading: display-assertion diagnostic (Station IV-B, Run 2) ===');
console.log('');

// ---------------------------------------------------------------------------
// Build both readings through the SAME channel used by the preview.
// ---------------------------------------------------------------------------
const baselineCaptureA = execFileSync(process.execPath, [BASELINE_SCRIPT], {
  encoding: 'utf8',
});
const baselineCaptureB = execFileSync(process.execPath, [BASELINE_SCRIPT], {
  encoding: 'utf8',
});
const partsA = splitBaselineArtifact(baselineCaptureA);
const partsB = splitBaselineArtifact(baselineCaptureB);
const report = buildHonestSourceStateReadingV0Report();

assertOk(
  report.ok && report.integrityIssueCount === 0,
  'module integrity: honest reading report ok with 0 integrity issues',
  `${report.integrityIssueCount} issues: ${report.integrityIssues.map((issue) => issue.code).join(', ')}`,
);
assertOk(
  baselineCaptureA === baselineCaptureB,
  'baseline determinism: two live captures of the unmodified historical script are byte-identical',
);

const baselineCards = {};
const revisedCards = {};
const revisedBodies = {};

for (const siteId of HONEST_READING_SITE_IDS) {
  const baselineBody = partsA.siteBlocks[siteId];
  assertOk(
    Boolean(baselineBody && baselineBody.length > 0),
    `baseline artifact block present: ${siteId}`,
  );
  const reading = report.readings.find((entry) => entry.siteId === siteId);
  assertOk(Boolean(reading), `revised reading present: ${siteId}`);
  const revisedBody = reading ? buildRevisedCardBodyLines(reading) : [];
  baselineCards[siteId] = renderReadingCard(BASELINE_LABEL, siteId, baselineBody ?? []);
  revisedCards[siteId] = renderReadingCard(REVISED_LABEL, siteId, revisedBody);
  revisedBodies[siteId] = revisedBody;
}

const revisedFullText = Object.values(revisedCards)
  .map((card) => card.join('\n'))
  .join('\n');

// ---------------------------------------------------------------------------
// C1 -- every displayed relation carries a visible C.5 status; allowed set only
// ---------------------------------------------------------------------------
for (const siteId of HONEST_READING_SITE_IDS) {
  const statusLines = revisedBodies[siteId].filter((line) => /\[status: /.test(line));
  assertOk(
    statusLines.length === HONEST_RELATION_DISPLAY_ORDER.length,
    `C1 status visibility: ${siteId} has ${HONEST_RELATION_DISPLAY_ORDER.length} relation rows with visible [status: ...]`,
    `found ${statusLines.length}`,
  );

  for (const line of statusLines) {
    const match = /\[status: ([a-z-]+)\]/.exec(line);
    assertOk(
      Boolean(match && ALLOWED_DISPLAY_STATUSES.has(match[1])),
      `C1 status token allowed: ${siteId} :: ${match ? match[1] : 'unparsed'}`,
      line,
    );
  }
}

const expectedStatusBag = Object.values(IV_B_HONESTY_CONTRACT_STATUSES);
const lostCount = expectedStatusBag.filter((status) => status === 'tuple-projection-lost').length;
const onlyCount = expectedStatusBag.filter((status) => status === 'source-state-only').length;
const unsupportedCount = expectedStatusBag.filter((status) => status === 'unsupported').length;

for (const siteId of HONEST_READING_SITE_IDS) {
  const text = revisedBodies[siteId].join('\n');
  const counts = {
    'tuple-projection-lost': (text.match(/\[status: tuple-projection-lost\]/g) || []).length,
    'source-state-only': (text.match(/\[status: source-state-only\]/g) || []).length,
    unsupported: (text.match(/\[status: unsupported\]/g) || []).length,
  };
  assertOk(
    counts['tuple-projection-lost'] === lostCount &&
      counts['source-state-only'] === onlyCount &&
      counts.unsupported === unsupportedCount,
    `C1 ratified status distribution: ${siteId} = ${lostCount} tuple-projection-lost / ${onlyCount} source-state-only / ${unsupportedCount} unsupported`,
    JSON.stringify(counts),
  );
}

// ---------------------------------------------------------------------------
// c-technical -- NO field-activity claim string in the revised reading
// ---------------------------------------------------------------------------
let scrubbedRevised = revisedFullText.toLowerCase();

for (const allowed of ALLOWED_NEGATED_PHRASES) {
  scrubbedRevised = scrubbedRevised.split(allowed.toLowerCase()).join('');
}

for (const claim of FORBIDDEN_FIELD_ACTIVITY_CLAIMS) {
  assertOk(
    !scrubbedRevised.includes(claim.toLowerCase()),
    `c-technical: forbidden claim "${claim}" absent from the revised reading`,
  );
}

// ---------------------------------------------------------------------------
// C2 -- the binding warning, prominent, on the axis row of all six cards
// ---------------------------------------------------------------------------
for (const siteId of HONEST_READING_SITE_IDS) {
  const body = revisedBodies[siteId];
  const axisIndex = body.findIndex((line) =>
    line.startsWith('carrier-ray / antipodal axis:'),
  );
  assertOk(axisIndex >= 0, `C2 axis row present: ${siteId}`);
  const axisLine = axisIndex >= 0 ? body[axisIndex] : '';
  assertOk(
    axisLine.includes('[status: source-state-only]'),
    `C2 axis row carries source-state-only status: ${siteId}`,
    axisLine,
  );
  const warningLine = axisIndex >= 0 ? body[axisIndex + 1] ?? '' : '';
  assertOk(
    warningLine.startsWith('WARNING (binding): ') &&
      warningLine.includes(IV_B_BINDING_RAW_FIELD_WARNING),
    `C2 binding misleading-raw-field warning on its own prominent line: ${siteId}`,
    warningLine,
  );
}

// ---------------------------------------------------------------------------
// C3 -- null content renders visibly EMPTY, not padded (anti-halo)
// ---------------------------------------------------------------------------
for (const siteId of HONEST_READING_SITE_IDS) {
  const body = revisedBodies[siteId];
  const unsupportedLines = body.filter((line) => line.includes('[status: unsupported]'));
  assertOk(
    unsupportedLines.length === NULL_ROW_PATTERNS.length,
    `C3 null rows count: ${siteId} has ${NULL_ROW_PATTERNS.length} unsupported rows`,
    `found ${unsupportedLines.length}`,
  );

  NULL_ROW_PATTERNS.forEach((pattern, index) => {
    assertOk(
      unsupportedLines.some((line) => pattern.test(line)),
      `C3 null row ${index + 1} matches the exact empty grammar (no padding): ${siteId}`,
      unsupportedLines.join(' | '),
    );
  });
}

// ---------------------------------------------------------------------------
// F1/F2 -- same-channel fairness, structural parity, baseline unaltered
// ---------------------------------------------------------------------------
for (const siteId of HONEST_READING_SITE_IDS) {
  for (const [label, card] of [
    [BASELINE_LABEL, baselineCards[siteId]],
    [REVISED_LABEL, revisedCards[siteId]],
  ]) {
    const headerOk = card[0] === `>>> [${label}] ${siteId}`;
    const footerOk = card[card.length - 1] === `<<< end [${label}] ${siteId}`;
    const bodyIndentOk = card
      .slice(1, -1)
      .every((line) => line.startsWith('  '));
    assertOk(
      headerOk && footerOk && bodyIndentOk,
      `F1 frame parity (same renderReadingCard channel): ${siteId} :: ${label}`,
    );
  }

  const renderedBaselineBody = baselineCards[siteId]
    .slice(1, -1)
    .map((line) => line.slice(2));
  const freshBlock = partsB.siteBlocks[siteId] ?? [];
  assertOk(
    renderedBaselineBody.join('\n') === freshBlock.join('\n'),
    `F2 baseline unaltered + not crippled: ${siteId} card body byte-equals the live artifact block (${freshBlock.length} lines preserved)`,
  );
}

const partitionCoverage =
  partsA.headerLines.length +
  partsA.footerLines.length +
  HONEST_READING_SITE_IDS.reduce(
    (sum, siteId) => sum + (partsA.siteBlocks[siteId]?.length ?? 0),
    0,
  );
const nonBlankCaptureLines = partsA.allLines.filter((line) => line.trim() !== '').length;
assertOk(
  partitionCoverage === nonBlankCaptureLines,
  `F2 artifact fully partitioned: header + 6 blocks + footer cover all ${nonBlankCaptureLines} non-blank artifact lines (nothing dropped)`,
  `covered ${partitionCoverage}`,
);

// ---------------------------------------------------------------------------
// C4 -- no S0 / naming / packet writing language in the revised reading
// ---------------------------------------------------------------------------
for (const phrase of FORBIDDEN_MATURE_CLAIMS) {
  let found = false;
  const lowerSource = revisedFullText.toLowerCase();
  const lowerPhrase = phrase.toLowerCase();
  let searchIndex = lowerSource.indexOf(lowerPhrase);

  while (searchIndex !== -1) {
    const negated =
      phrase === 'packet write' &&
      lowerSource.slice(Math.max(0, searchIndex - 4), searchIndex).endsWith('no ');

    if (!negated) {
      found = true;
      break;
    }

    searchIndex = lowerSource.indexOf(lowerPhrase, searchIndex + lowerPhrase.length);
  }

  assertOk(!found, `C4 no-S0 lexicon: "${phrase}" absent (or only negated) in the revised reading`);
}

for (const siteId of HONEST_READING_SITE_IDS) {
  assertOk(
    revisedBodies[siteId].some((line) => line.startsWith('naming: ')) &&
      revisedBodies[siteId].some((line) => line.startsWith('forbidden: no auto-name')),
    `C4 naming remains question-only with the forbidden-conclusions line: ${siteId}`,
  );
}

// ---------------------------------------------------------------------------
// Module-source guard + contract anchoring
// ---------------------------------------------------------------------------
const moduleSource = fs.readFileSync(modulePath, 'utf8');
const importPaths = [...moduleSource.matchAll(/from\s+'([^']+)'/g)].map(
  (match) => match[1],
);
const allowedImports = new Set(['./hubLayerSourceStateCapsuleV0', './generatedSiteReadingV0']);
assertOk(
  importPaths.length > 0 && importPaths.every((importPath) => allowedImports.has(importPath)),
  'module-source guard: honestSourceStateReadingV0 imports ONLY the hub capsule + generatedSiteReadingV0',
  importPaths.join(', '),
);

const hashFileText = fs.readFileSync(
  path.join(repoRoot, 'docs/governance/IV_B_HONESTY_CONTRACT_HASH.txt'),
  'utf8',
);
assertOk(
  hashFileText.includes(IV_B_CONTRACT_HASH_ECHO),
  'contract anchoring: the module contract-hash echo matches the committed IV-B honesty contract hash',
);

const packageSource = fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8');
assertOk(
  !packageSource.includes('honest-source-state'),
  'package.json untouched: no new script entry (runs via node)',
);

// ---------------------------------------------------------------------------
// Result
// ---------------------------------------------------------------------------
console.log(`assertions passed: ${passes.length}`);

for (const pass of passes) {
  console.log(`  PASS ${pass}`);
}

if (failures.length) {
  console.error('');
  console.error(`Diagnostic failures (${failures.length}):`);

  for (const failure of failures) {
    console.error(`  FAIL ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log('');
  console.log('c-technical is proven mechanically: no field-activity claim string for any IV-A-non-active relation.');
  console.log('Diagnostic assertions passed.');
}

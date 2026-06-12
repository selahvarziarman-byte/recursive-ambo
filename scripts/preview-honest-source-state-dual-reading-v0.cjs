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
const {
  buildHonestSourceStateReadingV0Report,
  buildRevisedCardBodyLines,
  renderReadingCard,
  splitBaselineArtifact,
  HONEST_READING_SITE_IDS,
} = require(path.join(repoRoot, 'src/lib/honestSourceStateReadingV0.ts'));

const BASELINE_SCRIPT = path.join(
  repoRoot,
  'scripts/preview-generated-site-reading-v0.cjs',
);
const BASELINE_LABEL = 'BASELINE pre-campaign scalar reading';
const REVISED_LABEL = 'REVISED honest source-state reading';

const failures = [];
const lines = [];

try {
  // The auditor-provided artifact: the live output of the UNMODIFIED
  // historical script. Captured, never reconstructed, tuned, or altered.
  const baselineCapture = execFileSync(process.execPath, [BASELINE_SCRIPT], {
    encoding: 'utf8',
  });
  const baselineParts = splitBaselineArtifact(baselineCapture);
  const report = buildHonestSourceStateReadingV0Report();

  if (!report.ok) {
    failures.push(
      `honest source-state reading report not ok (${report.integrityIssueCount} integrity issues): ${report.integrityIssues
        .map((issue) => issue.code)
        .join(', ')}`,
    );
  }

  for (const siteId of HONEST_READING_SITE_IDS) {
    if (!baselineParts.siteBlocks[siteId]) {
      failures.push(`baseline artifact has no block for ${siteId}`);
    }
  }

  if (report.readings.length !== 6) {
    failures.push(`expected 6 revised readings, got ${report.readings.length}`);
  }

  lines.push(
    '=== Station IV-B dual-reading preview: the six generated midpoints, BOTH readings, same channel ===',
    '',
    `honest reading method: ${report.method}`,
    `unblock authority: ${report.unblockAuthority}`,
    `contract hash echo: ${report.contractHashEcho}`,
    `disclosure: ${report.fieldActiveStatus}`,
    `verdict status: ${report.verdictStatus}`,
    'baseline artifact: live output of the unmodified scripts/preview-generated-site-reading-v0.cjs (auditor-provided; captured, not reconstructed)',
    '',
    '--- BASELINE GLOBAL FRAME (artifact lines, verbatim) ---',
    ...baselineParts.headerLines,
  );

  for (const siteId of HONEST_READING_SITE_IDS) {
    const baselineBody = baselineParts.siteBlocks[siteId] ?? ['(missing)'];
    const reading = report.readings.find((entry) => entry.siteId === siteId);
    const revisedBody = reading
      ? buildRevisedCardBodyLines(reading)
      : ['(missing)'];

    lines.push('');
    lines.push(...renderReadingCard(BASELINE_LABEL, siteId, baselineBody));
    lines.push('');
    lines.push(...renderReadingCard(REVISED_LABEL, siteId, revisedBody));
  }

  lines.push(
    '',
    '--- BASELINE GLOBAL FOOTER (artifact lines, verbatim) ---',
    ...baselineParts.footerLines,
    '',
    '--- D4 SITTING INSTRUMENT (prepared by the lieutenant; the lieutenant does NOT vote; the human judges) ---',
    'Q-a (per site): does the REVISED reading make the site MORE legible than the BASELINE - easier to read, distinguish, and (eventually) name?',
  );

  for (const siteId of HONEST_READING_SITE_IDS) {
    lines.push(`  ${siteId}: { improves / no improvement / worse }   ____________`);
  }

  lines.push(
    '  halo rule: an all-"improves" sweep (including the null provenance content) is recorded as a HALO-EFFECT FLAG, not a clean pass.',
    'Q-b (honesty): are the statuses visible, with nothing presented as field-active? { yes / no }   ____________',
    'Q-c-technical: proven mechanically by scripts/diagnose-honest-source-state-display-assertions-v0.cjs (no field-activity claim string for any IV-A-non-active relation; run it and record exit 0).',
    'Q-c-human: "did any part lead you to believe something the statuses say is not established?" { yes / no + which part }   ____________',
  );
} catch (error) {
  failures.push(`preview render failed: ${error.message}`);
}

if (failures.length) {
  console.error('Dual-reading preview failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log(lines.join('\n'));
}

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
const {
  buildGeneratedSiteReadingV0Report,
} = require(path.join(repoRoot, 'src/lib/generatedSiteReadingV0.ts'));

const EXPECTED_READING_COUNT = 6;
const EXPECTED_SITE_IDS = ['M_AB', 'M_AC', 'M_AD', 'M_BC', 'M_BD', 'M_CD'];
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
const failures = [];

const report = buildGeneratedSiteReadingV0Report();
const previewLines = buildPreviewLines(report);

validateReport(report, previewLines.join('\n'));

if (failures.length) {
  console.error('GeneratedSiteReadingV0 preview validation failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log(previewLines.join('\n'));
}

function buildPreviewLines(report) {
  const lines = [
    'GeneratedSiteReadingV0 preview diagnostic',
    `scope ${shortStatus(report.eventScopeStatus)} | ${shortStatus(
      report.generalityStatus,
    )} | not semantic naming | not topology | not packet writing | human names`,
  ];

  for (const reading of report.readings) {
    lines.push('', ...buildReadingCardLines(reading));
  }

  lines.push('', ...buildFooterLines(report));

  return lines;
}

function buildReadingCardLines(reading) {
  const geometry = reading.geometryWitness;
  const field = reading.fieldWitness;
  const birthLaw = reading.atomicWitness;
  const ambiguity = reading.ambiguityWitness;
  const naming = reading.humanNamingPrompt;
  const usefulness = reading.readingUsefulness;
  const candidateCounts = field.fieldCandidateReferenceCounts;

  return [
    `== ${reading.siteId} | ${usefulness.readingUsefulnessStatus} | ${ambiguity.ambiguityStatus} | ${shortStatus(
      reading.eventScopeStatus,
    )} / ${shortStatus(reading.generalityStatus)}`,
    `geometry witness: ${geometry.birthOperation} depth ${geometry.generationDepth} | edge ${
      geometry.sourceEdgeId ?? 'n/a'
    } | parents ${formatList(geometry.parentVertexIds)} | complement ${
      geometry.complementEdgeId ?? 'n/a'
    } | complement vertices ${formatList(
      geometry.complementEdgeVertexIds,
    )} | antipode ${geometry.antipodalChildSiteId ?? 'n/a'} | status ${
      geometry.geometryWitnessStatus
    }`,
    `geometry role: ${geometry.structuralRoleSummary}`,
    `birth-law witness: ${birthLaw.atomicWitnessStatus} | role ${
      birthLaw.childRole ?? 'n/a'
    } | grammar ${birthLaw.inheritanceGrammarId ?? 'n/a'} | merge ${
      birthLaw.mergeKind ?? 'n/a'
    } | projections ${formatList(birthLaw.projectionVertexIds)}`,
    `birth-law summary: ${birthLaw.birthLawSummary}`,
    `field witness: ${field.fieldCueStatus} | participation ${
      field.fieldParticipationStatus ?? 'n/a'
    } | inheritance ${field.fieldInheritanceStatus ?? 'n/a'}`,
    `field pressure: ${field.fieldPressureSummary ?? 'n/a'}`,
    `field candidates: feature ${candidateCounts.feature} | candidate route/gate ${candidateCounts.routeGate} | candidate support/region ${candidateCounts.supportRegion} | warnings ${formatList(
      field.fieldWarningStatuses,
      'none',
    )}`,
    `field caveats: ${formatList(field.fieldWitnessCaveats.slice(0, 3), 'none')}`,
    `ambiguity: ${ambiguity.ambiguityStatus} | warnings ${formatList(
      ambiguity.ambiguityWarnings.slice(0, 4),
      'none',
    )}`,
    `unsupported caveats: ${formatList(
      ambiguity.unsupportedCaveats.slice(0, 3),
      'none',
    )}`,
    `naming: ${naming.primaryNamingQuestion}`,
    `secondary: ${formatList(naming.secondaryNamingQuestions.slice(0, 3), 'none')}`,
    'forbidden: no auto-name; no packet write; no topology; no final semantic assignment',
    `usefulness: ${usefulness.readingUsefulnessStatus} | ${usefulness.usefulnessSummary}`,
  ];
}

function buildFooterLines(report) {
  return [
    'GeneratedSiteReadingV0 report footer',
    `ok ${report.ok} | issues ${report.issueCount} | readings ${report.readingCount}`,
    `usefulness: ${formatCountRecord(report.summary.readingsByUsefulnessStatus)}`,
    `ambiguity: ${formatCountRecord(report.summary.readingsByAmbiguityStatus)}`,
    `field cue available ${report.summary.fieldCueAvailableCount}`,
    `weak/degenerate/unsupported ${report.summary.weakFieldPressureReadingCount}/${report.summary.degenerateReadingCount}/${report.summary.unsupportedReadingCount}`,
  ];
}

function validateReport(report, previewText) {
  expectEqual(report.ok, true, 'report ok');
  expectEqual(report.readingCount, EXPECTED_READING_COUNT, 'reading count');
  expectEqual(report.readings.length, EXPECTED_READING_COUNT, 'reading array count');
  expectArrayEqual(
    report.readings.map((reading) => reading.siteId).sort(),
    [...EXPECTED_SITE_IDS].sort(),
    'reading site ids',
  );

  for (const reading of report.readings) {
    expectTruthy(reading.geometryWitness, `${reading.siteId} geometry witness`);
    expectTruthy(reading.fieldWitness, `${reading.siteId} field witness`);
    expectTruthy(reading.atomicWitness, `${reading.siteId} birth-law witness`);
    expectTruthy(reading.humanNamingPrompt, `${reading.siteId} human naming prompt`);
    expectAtLeast(countNamingQuestions(reading), 1, `${reading.siteId} naming questions`);
    expectEqual(
      reading.semanticStatus,
      'not-semantic-naming',
      `${reading.siteId} semantic status`,
    );
    expectEqual(
      reading.topologyStatus,
      'not-topology-workspace',
      `${reading.siteId} topology status`,
    );
    expectEqual(
      reading.packetWriteStatus,
      'not-packet-writing',
      `${reading.siteId} packet write status`,
    );
    expectEqual(
      reading.shapeMutationStatus,
      'not-shape-mutation',
      `${reading.siteId} shape mutation status`,
    );
    expectEqual(
      reading.namingStateStatus,
      'not-implemented',
      `${reading.siteId} naming state status`,
    );
    expectEqual(
      reading.humanNamingAuthorityStatus,
      'human-names',
      `${reading.siteId} human naming authority`,
    );
  }

  const combinedText = `${JSON.stringify(report)}\n${previewText}`;

  for (const phrase of FORBIDDEN_MATURE_CLAIMS) {
    if (containsForbiddenPositiveClaim(combinedText, phrase)) {
      failures.push(`forbidden mature claim language: ${phrase}`);
    }
  }
}

function containsForbiddenPositiveClaim(source, phrase) {
  const lowerSource = source.toLowerCase();
  const lowerPhrase = phrase.toLowerCase();
  let searchIndex = lowerSource.indexOf(lowerPhrase);

  while (searchIndex !== -1) {
    if (!isAllowedNegatedPhrase(lowerSource, lowerPhrase, searchIndex)) {
      return true;
    }

    searchIndex = lowerSource.indexOf(lowerPhrase, searchIndex + lowerPhrase.length);
  }

  return false;
}

function isAllowedNegatedPhrase(source, phrase, index) {
  if (phrase !== 'packet write') {
    return false;
  }

  const prefix = source.slice(Math.max(0, index - 4), index);

  return prefix.endsWith('no ');
}

function countNamingQuestions(reading) {
  return [
    reading.humanNamingPrompt.primaryNamingQuestion,
    ...reading.humanNamingPrompt.secondaryNamingQuestions,
  ].filter(Boolean).length;
}

function formatList(values, emptyLabel = 'n/a') {
  return values && values.length ? values.join(', ') : emptyLabel;
}

function formatCountRecord(counts) {
  return Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => `${status}=${count}`)
    .join(', ') || 'none';
}

function shortStatus(status) {
  return String(status)
    .replace('one-ambo-tetrahedron-proving-event', 'one-Ambo event')
    .replace('not-general-reading-layer', 'not-general')
    .replace('event-bound-profile-aware-prototype', 'event-bound');
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    failures.push(`${label}: expected ${formatValue(expected)}, got ${formatValue(actual)}`);
  }
}

function expectTruthy(value, label) {
  if (!value) {
    failures.push(`${label}: expected truthy value, got ${formatValue(value)}`);
  }
}

function expectAtLeast(actual, expectedMinimum, label) {
  if (actual < expectedMinimum) {
    failures.push(
      `${label}: expected at least ${expectedMinimum}, got ${formatValue(actual)}`,
    );
  }
}

function expectArrayEqual(actual, expected, label) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);

  if (actualJson !== expectedJson) {
    failures.push(`${label}: expected ${expectedJson}, got ${actualJson}`);
  }
}

function formatValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

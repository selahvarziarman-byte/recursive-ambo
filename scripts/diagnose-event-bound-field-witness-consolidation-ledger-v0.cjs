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
const expectedSourcePaths = [
  'src/lib/fieldAtlas.ts',
  'src/lib/fieldAtlasRouteGateCandidates.ts',
  'src/lib/fieldSourceProfileAwareRouteGateCandidates.ts',
  'src/lib/structuredSourceStateDiagnosticV0.ts',
  'src/lib/structuredSourceStateMultiProjectionStructuralChannelV0.ts',
  'src/lib/pSimplexVectorOrderParameterDiagnosticV0.ts',
  'src/lib/pSimplexVectorOrderParameterLocalityDiagnosticV0.ts',
  'src/lib/pSimplexRelationAuditedSamplingDiagnosticV0.ts',
  'src/lib/pSimplexGeometryGraphSamplingGateK3V0.ts',
  'src/lib/pSimplexP2OneThirdNonlinearAxisBranchContinuationAuditT27.ts',
  'src/lib/pSimplexP2OneThirdSixSiteConvention2GermPressureWitnessMapT28A.ts',
];

const {
  buildEventBoundFieldWitnessConsolidationLedgerV0Report,
} = require(path.join(repoRoot, 'src/lib/eventBoundFieldWitnessConsolidationLedgerV0.ts'));
const {
  buildPSimplexAxisTransverseDiscriminationSurvivalMetricT28C1ReportFromInputs,
} = require(path.join(repoRoot, 'src/lib/pSimplexAxisTransverseDiscriminationSurvivalMetricT28C1.ts'));
const {
  buildPSimplexK3LocalAtdDecompositionVBlindnessAuditT28DReportFromInputs,
} = require(path.join(repoRoot, 'src/lib/pSimplexK3LocalAtdDecompositionVBlindnessAuditT28D.ts'));
const {
  buildPSimplexK3SamplingFamilyAsymmetryControlAuditT28EReportFromInputs,
} = require(path.join(repoRoot, 'src/lib/pSimplexK3SamplingFamilyAsymmetryControlAuditT28E.ts'));

const packageJson = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
const packageScripts = packageJson.scripts ?? {};
const sourceFiles = {
  'src/lib/fieldAtlas.ts': readSourceFile('src/lib/fieldAtlas.ts'),
};

const t28c0Input = buildT28C0ParentInput();
const t28c0Report = t28c0Input.report;
const k3Input = buildReportInput(
  'buildPSimplexGeometryGraphSamplingGateK3V0Report',
  'src/lib/pSimplexGeometryGraphSamplingGateK3V0.ts',
);
const vInput = buildReportInput(
  'buildPSimplexVectorOrderParameterDiagnosticV0Report',
  'src/lib/pSimplexVectorOrderParameterDiagnosticV0.ts',
);
const vLocalityInput = buildReportInput(
  'buildPSimplexVectorOrderParameterLocalityDiagnosticV0Report',
  'src/lib/pSimplexVectorOrderParameterLocalityDiagnosticV0.ts',
  { optional: true },
);
const t28c1Report = buildPSimplexAxisTransverseDiscriminationSurvivalMetricT28C1ReportFromInputs({
  t28c0Parent: t28c0Input,
  sParent: buildParentInput(
    'buildStructuredSourceStateDiagnosticV0Report',
    'src/lib/structuredSourceStateDiagnosticV0.ts',
  ),
  optionalSStructuralChannelParent: buildParentInput(
    'buildStructuredSourceStateMultiProjectionStructuralChannelV0Report',
    'src/lib/structuredSourceStateMultiProjectionStructuralChannelV0.ts',
    { optional: true },
  ),
  vParent: vInput,
  kParent: k3Input,
  gParent: buildParentInput(
    'buildPSimplexP2OneThirdSixSiteConvention2GermPressureWitnessMapT28AReport',
    'src/lib/pSimplexP2OneThirdSixSiteConvention2GermPressureWitnessMapT28A.ts',
  ),
});
const t28dReport = buildPSimplexK3LocalAtdDecompositionVBlindnessAuditT28DReportFromInputs({
  t28c0Report,
  t28c1Report,
  k3Report: k3Input.report,
  vReport: vInput.report,
  vLocalityReport: vLocalityInput.report,
});
const t28eReport = buildPSimplexK3SamplingFamilyAsymmetryControlAuditT28EReportFromInputs({
  t28c0Report,
  t28c1Report,
  t28dReport,
  k3Report: k3Input.report,
  vReport: vInput.report,
  vLocalityReport: vLocalityInput.report,
});

const optionalInputs = {
  profileAwareStackSummaryReport: buildReportInput(
    'buildProfileAwareFieldStackSummaryReport',
    'src/lib/fieldSourceProfileAwareStackSummary.ts',
    { optional: true },
  ),
  profileAwareEvidenceStabilityReport: buildReportInput(
    'buildProfileAwareEvidenceStabilityReport',
    'src/lib/fieldSourceProfileAwareEvidenceStability.ts',
    { optional: true },
  ),
  structuredSourceStateReport: buildReportInput(
    'buildStructuredSourceStateDiagnosticV0Report',
    'src/lib/structuredSourceStateDiagnosticV0.ts',
    { optional: true },
  ),
  sourceSignatureContractReport: buildReportInput(
    'buildSourceSignatureContractAuditV0Report',
    'src/lib/sourceSignatureContractAuditV0.ts',
    { optional: true },
  ),
  fanoCarrierGraphReport: buildReportInput(
    'buildFanoOctonionicCarrierGraphFieldV0Report',
    'src/lib/fanoOctonionicCarrierGraphFieldV0.ts',
    { optional: true },
  ),
  fanoSpatialSupportReport: buildReportInput(
    'buildFanoOctonionicSpatialSupportProjectionV0Report',
    'src/lib/fanoOctonionicSpatialSupportProjectionV0.ts',
    { optional: true },
  ),
  fanoGenerationalReport: buildReportInput(
    'buildFanoOctonionicGenerationalFieldUpdateV0Report',
    'src/lib/fanoOctonionicGenerationalFieldUpdateV0.ts',
    { optional: true },
  ),
  fieldCueReport: buildReportInput(
    'buildFieldCueV0Report',
    'src/lib/fieldCueV0.ts',
    { optional: true },
  ),
  generatedSiteReadingReport: buildReportInput(
    'buildGeneratedSiteReadingV0Report',
    'src/lib/generatedSiteReadingV0.ts',
    { optional: true },
  ),
};

const reportInputs = {
  packageScripts,
  sourceFiles,
  reports: {
    t28c0Report,
    t28c1Report,
    t28dReport,
    t28eReport,
    k3Report: k3Input.report,
    vReport: vInput.report,
    vLocalityReport: vLocalityInput.report,
    ...Object.fromEntries(Object.entries(optionalInputs).map(([key, input]) => [key, input.report])),
  },
  importStatuses: {
    t28c0Report: t28c0Input.importStatus,
    t28c1Report: 'imported',
    t28dReport: 'imported',
    t28eReport: 'imported',
    k3Report: k3Input.importStatus,
    vReport: vInput.importStatus,
    vLocalityReport: vLocalityInput.importStatus,
    ...Object.fromEntries(Object.entries(optionalInputs).map(([key, input]) => [key, input.importStatus])),
  },
};

const report = buildEventBoundFieldWitnessConsolidationLedgerV0Report(reportInputs);

console.log(JSON.stringify(report, null, 2));

if (!report.ok || report.integrityIssueCount > 0) {
  process.exitCode = 1;
}

function buildT28C0ParentInput() {
  return buildParentInput(
    'buildPSimplexCrossProjectionProvenanceEligibilityPreflightT28C0Report',
    'src/lib/pSimplexCrossProjectionProvenanceEligibilityPreflightT28C0.ts',
    { args: [buildT28C0Probe()] },
  );
}

function buildReportInput(builderName, sourcePath, options = {}) {
  return buildParentInput(builderName, sourcePath, options);
}

function buildParentInput(builderName, sourcePath, options = {}) {
  try {
    const mod = require(path.join(repoRoot, sourcePath));
    const builder = mod[builderName];

    if (typeof builder !== 'function') {
      return {
        builderName,
        importStatus: options.optional ? 'builder-missing' : 'failed',
        errorMessage: `Missing export ${builderName}.`,
      };
    }

    return {
      builderName,
      importStatus: 'imported',
      report: builder(...(options.args ?? [])),
    };
  } catch (error) {
    return {
      builderName,
      importStatus: options.optional ? 'not-imported' : 'failed',
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }
}

function buildT28C0Probe() {
  const sourceFiles = Object.fromEntries(
    expectedSourcePaths.map((repoPath) => {
      const absolutePath = path.join(repoRoot, repoPath);
      const exists = fs.existsSync(absolutePath);

      return [
        repoPath,
        {
          exists,
          text: exists ? fs.readFileSync(absolutePath, 'utf8') : '',
        },
      ];
    }),
  );

  return {
    branchRef: 'wgate/arf-w1-root-frame-v0',
    currentBranchRef: readCurrentBranchRef(repoRoot),
    packageScripts,
    sourceFiles,
  };
}

function readSourceFile(repoPath) {
  const absolutePath = path.join(repoRoot, repoPath);
  const exists = fs.existsSync(absolutePath);

  return {
    exists,
    text: exists ? fs.readFileSync(absolutePath, 'utf8') : '',
  };
}

function readCurrentBranchRef(root) {
  const gitDir = resolveGitDir(root);
  const headPath = path.join(gitDir, 'HEAD');

  if (!fs.existsSync(headPath)) {
    return null;
  }

  const head = fs.readFileSync(headPath, 'utf8').trim();

  if (head.startsWith('ref: refs/heads/')) {
    return head.slice('ref: refs/heads/'.length);
  }

  return head.length > 0 ? 'detached-head' : null;
}

function resolveGitDir(root) {
  const dotGitPath = path.join(root, '.git');

  if (fs.existsSync(dotGitPath) && fs.statSync(dotGitPath).isFile()) {
    const dotGit = fs.readFileSync(dotGitPath, 'utf8').trim();
    const match = /^gitdir:\s*(.+)$/u.exec(dotGit);

    if (match) {
      return path.resolve(root, match[1]);
    }
  }

  return dotGitPath;
}

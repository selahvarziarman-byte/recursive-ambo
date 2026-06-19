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
  buildPSimplexAxisTransverseDiscriminationSurvivalMetricT28C1ReportFromInputs,
} = require(path.join(repoRoot, 'src/lib/pSimplexAxisTransverseDiscriminationSurvivalMetricT28C1.ts'));

const report = buildPSimplexAxisTransverseDiscriminationSurvivalMetricT28C1ReportFromInputs({
  t28c0Parent: buildT28C0ParentInput(),
  sParent: buildParentInput(
    'buildStructuredSourceStateDiagnosticV0Report',
    'src/lib/structuredSourceStateDiagnosticV0.ts',
  ),
  optionalSStructuralChannelParent: buildParentInput(
    'buildStructuredSourceStateMultiProjectionStructuralChannelV0Report',
    'src/lib/structuredSourceStateMultiProjectionStructuralChannelV0.ts',
    { optional: true },
  ),
  vParent: buildParentInput(
    'buildPSimplexVectorOrderParameterDiagnosticV0Report',
    'src/lib/pSimplexVectorOrderParameterDiagnosticV0.ts',
  ),
  kParent: buildParentInput(
    'buildPSimplexGeometryGraphSamplingGateK3V0Report',
    'src/lib/pSimplexGeometryGraphSamplingGateK3V0.ts',
  ),
  gParent: buildParentInput(
    'buildPSimplexP2OneThirdSixSiteConvention2GermPressureWitnessMapT28AReport',
    'src/lib/pSimplexP2OneThirdSixSiteConvention2GermPressureWitnessMapT28A.ts',
  ),
});

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

function buildParentInput(builderName, sourcePath, options = {}) {
  try {
    const mod = require(path.join(repoRoot, sourcePath));
    const builder = mod[builderName];

    if (typeof builder !== 'function') {
      return {
        builderName,
        importStatus: options.optional ? 'optional-not-imported' : 'failed',
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
      importStatus: options.optional ? 'optional-not-imported' : 'failed',
      errorMessage: error instanceof Error ? error.message : String(error),
    };
  }
}

function buildT28C0Probe() {
  const packageJsonPath = path.join(repoRoot, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
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
    packageScripts: packageJson.scripts ?? {},
    sourceFiles,
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

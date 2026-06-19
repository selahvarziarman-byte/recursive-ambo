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
  buildPSimplexCrossProjectionProvenanceEligibilityPreflightT28C0Report,
} = require(path.join(repoRoot, 'src/lib/pSimplexCrossProjectionProvenanceEligibilityPreflightT28C0.ts'));

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
const probe = {
  branchRef: 'wgate/arf-w1-root-frame-v0',
  currentBranchRef: readCurrentBranchRef(repoRoot),
  packageScripts: packageJson.scripts ?? {},
  sourceFiles,
};
const report = buildPSimplexCrossProjectionProvenanceEligibilityPreflightT28C0Report(probe);

console.log(JSON.stringify(report, null, 2));

if (!report.ok || report.integrityIssueCount > 0) {
  process.exitCode = 1;
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

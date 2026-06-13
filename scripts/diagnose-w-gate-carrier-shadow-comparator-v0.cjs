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
  buildWGateCarrierShadowComparatorV0Report,
} = require(path.join(repoRoot, 'src/lib/wGateCarrierShadowComparatorV0.ts'));

const report = buildWGateCarrierShadowComparatorV0Report({
  competitorContextSummary: collectCompetitorContextSummary(),
});

console.log(JSON.stringify(report, null, 2));

if (!report.ok || report.integrityIssueCount > 0) {
  process.exitCode = 1;
}

function collectCompetitorContextSummary() {
  const workspacePath = 'C:\\Dev\\202cl\\PlatonicEngine202';

  try {
    const branch = git(workspacePath, ['branch', '--show-current']).trim();
    const head = git(workspacePath, ['rev-parse', 'HEAD']).trim();
    const dirtyStatus = git(workspacePath, ['status', '--short', '--untracked-files=all'])
      .split(/\r?\n/)
      .filter(Boolean);
    const trackedFiles = git(workspacePath, ['ls-files'])
      .split(/\r?\n/)
      .filter(Boolean);
    const untrackedFiles = dirtyStatus
      .filter((line) => line.startsWith('?? '))
      .map((line) => line.slice(3));
    const relevantArtifacts = [...trackedFiles, ...untrackedFiles].filter((filePath) =>
      /W2|seal|blind|certification|carrier-shadow|field-reduction|remote-exposure|w0|rfe15/i.test(filePath),
    );

    return {
      status: 'provided-by-caller',
      workspacePath,
      branch,
      head,
      dirtyStatus,
      relevantArtifacts,
      notes: [
        'Shared worktree inspected read-only by the diagnostic script.',
        relevantArtifacts.length
          ? 'Relevant artifact names are reported for context only; W2/shared material is not implementation authority for W-1C.'
          : 'No shared-worktree filenames matched the W-1C context patterns.',
      ],
    };
  } catch (error) {
    return {
      status: 'provided-by-caller',
      workspacePath,
      branch: null,
      head: null,
      dirtyStatus: [],
      relevantArtifacts: [],
      notes: [
        `Shared worktree context unavailable: ${error instanceof Error ? error.message : String(error)}`,
      ],
    };
  }
}

function git(cwd, args) {
  return execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8' });
}

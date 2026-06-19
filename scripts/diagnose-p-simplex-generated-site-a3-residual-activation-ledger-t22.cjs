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
  buildPSimplexGeneratedSiteA3ResidualActivationLedgerT22Report,
} = require(path.join(repoRoot, 'src/lib/pSimplexGeneratedSiteA3ResidualActivationLedgerT22.ts'));

const report = buildPSimplexGeneratedSiteA3ResidualActivationLedgerT22Report();

console.log(JSON.stringify(report, null, 2));

if (!report.ok || report.integrityIssueCount > 0) {
  process.exitCode = 1;
}

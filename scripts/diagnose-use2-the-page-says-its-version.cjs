#!/usr/bin/env node

// DIAGNOSTIC — STAMP USE-2 (2026-09-25, the mothership): THE PAGE SAYS WHICH VERSION IT RUNS. The reader of
// /__whereami's body, the one ask of the server through a STUBBED endpoint (the stamp: "a stubbed endpoint is enough
// under node"), the line's words, the true absence for a missing endpoint and for the producer's own error body, and
// the SOURCE PINS: the panel asks ONCE at mount, renders nothing without a head, and NOTHING in this code polls,
// listens or reloads — the stamp's item 2 (a "the server moved on" line) was cut before landing on Arman's ruling
// (2026-09-25 20:54: a page in use across a release is scaffolding; the use is halted while the coder works), and its
// absence is pinned here so the scaffolding cannot creep back unnoticed.
//
// Run: node scripts/diagnose-use2-the-page-says-its-version.cjs

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
};
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const readLf = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').split('\r\n').join('\n');
const J = (x) => JSON.stringify(x);

let failures = 0;
const check = (name, ok, detail) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `\n        ${detail}` : ''}`);
  if (!ok) failures += 1;
};

const { readWhereamiHead, askServerHead, pageVersionLine, WHEREAMI_PATH } = req('src/lib/pageVersion.ts');

const HEAD = '2027c6d0f1e2d3c4b5a6978877665544332211aa';
const ERROR_BODY = '{"error":"whereami producer failed"}'; // vite.config.ts — the producer's failure, verbatim

(async () => {
  // §a — the reader: a head, or a TRUE ABSENCE
  check('§a a real /__whereami body reads as its 7-character head', readWhereamiHead({ head: HEAD, branch: 'team-arman', checkout: 'main', dirtyPaths: 0, at: 'now' }) === '2027c6d');
  check("§a the producer's error body reads as NO version (null — never a placeholder)", readWhereamiHead(JSON.parse(ERROR_BODY)) === null);
  for (const [name, body] of [['an empty object', {}], ['null', null], ['a string', 'head'], ['a number head', { head: 42 }], ['a non-hex head', { head: 'zzzzzzz' }], ['a 6-character head', { head: 'abcdef' }], ['an array', [HEAD]]]) {
    check(`§a ${name} reads as null`, readWhereamiHead(body) === null, J(body));
  }

  // §b — the one ask of the server, through a stubbed fetch
  const stub = (status, body, opts = {}) => async (input) => {
    if (opts.expect && input !== opts.expect) throw new Error(`asked ${input}`);
    if (opts.throwOnFetch) throw new TypeError('Failed to fetch');
    return { ok: status >= 200 && status < 300, json: async () => { if (opts.jsonThrows) throw new SyntaxError('not JSON'); return body; } };
  };
  check(`§b the page asks exactly \`${WHEREAMI_PATH}\` and reads the head`, (await askServerHead(stub(200, { head: HEAD }, { expect: '/__whereami' }))) === '2027c6d');
  check('§b no endpoint (a 404) → null, the true absence', (await askServerHead(stub(404, '<html>not found</html>'))) === null);
  check("§b the producer's error body (a 200) → null", (await askServerHead(stub(200, JSON.parse(ERROR_BODY)))) === null);
  check('§b a non-JSON answer → null', (await askServerHead(stub(200, null, { jsonThrows: true }))) === null);
  check('§b a network failure (fetch throws) → null', (await askServerHead(stub(200, { head: HEAD }, { throwOnFetch: true }))) === null);

  // §c — the line
  check('§c `this page: 2027c6d`', pageVersionLine('2027c6d') === 'this page: 2027c6d');

  // §d — THE SOURCE PINS (the panel asks once; nothing polls, listens or reloads)
  const panel = readLf('src/components/Panels.tsx');
  const lib = readLf('src/lib/pageVersion.ts');
  const start = panel.indexOf('function usePageHead(');
  const end = panel.indexOf('function WorkspacePersistenceControls(');
  const block = start >= 0 && end > start ? panel.slice(start, end) : '';
  check('§d the panel carries the hook and the line component', block.length > 0 && block.includes('function PageVersionLine(') && panel.includes('<PageVersionLine />'));
  check('§d the page asks ONCE at mount for its own version (askServerHead → setPageHead, in the mount effect, nothing else in it)', /useEffect\(\(\) => \{\s*let alive = true;\s*void askServerHead\(\)\.then\(\(head\) => \{\s*if \(alive\) setPageHead\(head\);\s*\}\);\s*return \(\) => \{\s*alive = false;\s*\};\s*\}, \[\]\);/.test(block));
  check('§d the TRUE ABSENCE — no head → nothing rendered (no placeholder, no empty line)', /if \(pageHead === null\) \{\s*return null;/.test(block));
  check('§d the line carries its mark (data-page-version) and the reader\'s words', block.includes('data-page-version="true"') && block.includes('{pageVersionLine(pageHead)}'));
  check('§d the line sits in the Save / Load panel, under its heading', /Save \/ Load\n\s*<\/h3>\n\s*<PageVersionLine \/>/.test(panel));
  const reloads = (src) => (src.match(/\breload\s*\(|location\.reload|window\.location\s*=|location\.href\s*=|location\.assign|location\.replace/g) || []).length;
  check('§d NO RELOAD CALLED ANYWHERE BY THIS CODE (the panel and the lib)', reloads(panel) === 0 && reloads(lib) === 0, `panel ${reloads(panel)} · lib ${reloads(lib)}`);
  check("§d NO POLLING, NO LISTENING — the cut item 2's scaffolding is absent (no setInterval, no visibilitychange, no vite:ws:disconnect, no moved-on line) in the panel", !/setInterval|visibilitychange|vite:ws:|movedOn|data-page-moved-on/.test(panel) && !/movedOn|POLL/.test(lib));
  check('§d the lib never touches `location`, `document` or `window` (react-free, DOM-free — the panel does the one ask)', !/\b(location|document|window)\b/.test(lib.replace(/\/\*\*[\s\S]*?\*\/|\/\/.*$/gm, '')));

  // §e — /__whereami is unchanged: the server's truth (vite.config.ts as it stands)
  const cfg = readLf('vite.config.ts');
  check('§e vite.config.ts still serves /__whereami through the one producer and still answers the error body verbatim', cfg.includes("server.middlewares.use('/__whereami', (_req, res) => {") && cfg.includes("spawnProducer(server.config.root, '--whereami-json')") && cfg.includes("res.end(body ?? JSON.stringify({ error: 'whereami producer failed' }));"));
  check('§e the error body this witness stubs is the one the config writes', JSON.stringify({ error: 'whereami producer failed' }) === ERROR_BODY);

  console.log(`\n${failures === 0 ? 'DIAGNOSE-USE2-THE-PAGE-SAYS-ITS-VERSION: ALL PASS — the page says the version it was loaded from, says nothing where the server does not answer, and never polls, listens or reloads' : `DIAGNOSE-USE2-THE-PAGE-SAYS-ITS-VERSION: ${failures} FAILED`}`);
  process.exit(failures === 0 ? 0 : 1);
})();

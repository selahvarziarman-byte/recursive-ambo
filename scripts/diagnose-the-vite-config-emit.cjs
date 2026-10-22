#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════
// THE COMPILED VITE CONFIG IS THE EMIT OF ITS SOURCE — the debt named in the Δ237 letter (10-22): the Vite CLI (dev, build, preview) loads the TRACKED compiled
// `vite.config.js` — Vite's config search prefers .js over .ts — and `tsc -b` does not re-emit it; two probe previews ran a stale .js until `npx tsc -p tsconfig.node.json`
// emitted it. An edit to the .ts that never reaches the .js changes nothing the CLI runs. This witness emits the .ts to a scratch directory and compares, byte for byte
// (line endings aside), with the tracked .js; and pins the one search order that makes the .js the one that counts.
// ═══════════════════════════════════════════════════════════════════════════════
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const repoRoot = path.resolve(__dirname, '..');
let failures = 0;
const check = (name, cond, detail) => { console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : JSON.stringify(detail)}` : ''}`); if (!cond) failures += 1; };
const note = (s) => console.log(`      ${s}`);
console.log('THE COMPILED VITE CONFIG IS THE EMIT OF ITS SOURCE — vite.config.js == tsc(vite.config.ts)\n');
const out = fs.mkdtempSync(path.join(os.tmpdir(), 'vite-config-emit-'));
const r = spawnSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['tsc', '-p', 'tsconfig.node.json', '--outDir', out, '--tsBuildInfoFile', path.join(out, 'node.tsbuildinfo')], { cwd: repoRoot, encoding: 'utf8', timeout: 180000, shell: process.platform === 'win32' });
note(`tsc -p tsconfig.node.json --outDir <scratch>: exit ${r.status}${(r.stdout || '').trim() ? ' · ' + (r.stdout || '').trim().slice(0, 200) : ''}`);
const emitted = fs.existsSync(path.join(out, 'vite.config.js')) ? fs.readFileSync(path.join(out, 'vite.config.js'), 'utf8').replace(/\r\n/g, '\n') : null;
const tracked = fs.readFileSync(path.join(repoRoot, 'vite.config.js'), 'utf8').replace(/\r\n/g, '\n');
const firstDiff = emitted === null ? -1 : [...emitted].findIndex((ch, i) => ch !== tracked[i]);
check('§1 ★★ THE TRACKED vite.config.js IS WHAT tsc EMITS FROM vite.config.ts — byte for byte (CRLF aside): an edit to the source that was not re-emitted (`npx tsc -p tsconfig.node.json`) turns this red, since the CLI runs the .js',
  r.status === 0 && emitted !== null && emitted === tracked, { status: r.status, emittedLength: emitted && emitted.length, trackedLength: tracked.length, firstDiff, around: firstDiff >= 0 ? { emitted: emitted.slice(Math.max(0, firstDiff - 40), firstDiff + 60), tracked: tracked.slice(Math.max(0, firstDiff - 40), firstDiff + 60) } : null });
const viteNode = path.join(repoRoot, 'node_modules/vite/dist/node');
const viteFile = [...fs.readdirSync(viteNode).map((f) => path.join(viteNode, f)), ...fs.readdirSync(path.join(viteNode, 'chunks')).map((f) => path.join(viteNode, 'chunks', f))].filter((f) => f.endsWith('.js')).find((f) => /DEFAULT_CONFIG_FILES\s*=\s*\[/.test(fs.readFileSync(f, 'utf8')));
const vite = viteFile ? fs.readFileSync(viteFile, 'utf8') : '';
const order = (vite.match(/DEFAULT_CONFIG_FILES\s*=\s*\[([\s\S]*?)\]/) || [, ''])[1].replace(/\s+/g, '');
check('§2 ★ WHY THE .js COUNTS: Vite\'s config search tries `vite.config.js` before `vite.config.ts` (the installed Vite\'s own list), and both are tracked — so the .js is the one the CLI runs',
  /^"vite\.config\.js","vite\.config\.mjs","vite\.config\.ts"/.test(order) && fs.existsSync(path.join(repoRoot, 'vite.config.js')) && fs.existsSync(path.join(repoRoot, 'vite.config.ts')), order.slice(0, 80));
check('§3 ★ the preview hook rides both (Δ237): `configurePreviewServer` in the .ts and in the .js', /configurePreviewServer/.test(tracked) && /configurePreviewServer/.test(fs.readFileSync(path.join(repoRoot, 'vite.config.ts'), 'utf8')));
try { fs.rmSync(out, { recursive: true, force: true }); } catch { /* scratch */ }
console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-VITE-CONFIG-EMIT: ALL PASS — the compiled config is the emit of its source' : `DIAGNOSE-THE-VITE-CONFIG-EMIT: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);

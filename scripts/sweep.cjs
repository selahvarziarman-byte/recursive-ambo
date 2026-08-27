#!/usr/bin/env node

// THE SWEEP RUNNER — B-121 §4, chartered as INTEGRITY, not tidiness:
// *a pre-commit gate that must be hand-split is a gate that will be half-run.*
//
// ONE command runs the WHOLE folded sweep (B-111 §2's classification, byte-
// carried: the main family PLUS every app-leg .cjs that is a witness,
// classified BY ITS OWN DECLARATION — a `DRIVE FAMILY` banner — never by a
// directory or a list kept somewhere else), sharded across workers so the
// ten-minute wall that forced the hand-split dies with the habit, and each
// leg's wall time prints BESIDE it — a check that is expensive gets run
// less, so the expense gets a face.
//
// THE CLOSING LINE IS CANONICAL and must not move (B-121 §4's constraint —
// the one thing a reader looks for must not move in the same cut that
// changes what produces it):
//     `<N> files · expect exactly ONE fail: diagnose-dual-inspection`
// followed by the verdict. Exit 0 iff the failure set is EXACTLY the one
// accepted red — the standing baseline is itself the runner's positive
// control: a sweep that reported zero failures could not tell a broken
// runner from a green tree.

'use strict';
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const repoRoot = path.resolve(__dirname, '..');
const rel = (p) => p.split(path.sep).join('/');

const legs = [];
for (const f of fs.readdirSync(path.join(repoRoot, 'scripts'))) {
  if (/^diagnose-.*\.cjs$/.test(f)) legs.push(rel(path.join('scripts', f)));
}
for (const f of fs.readdirSync(path.join(repoRoot, 'scripts', 'app-leg'))) {
  if (!/^diagnose-.*\.cjs$/.test(f)) continue;
  const p = path.join('scripts', 'app-leg', f);
  if (!fs.readFileSync(path.join(repoRoot, p), 'utf8').includes('DRIVE FAMILY')) legs.push(rel(p));
}
legs.sort();

// longest-first scheduling off LAST run's times (an ignored local cache —
// a scheduling hint, never a record): without it the 200s+ leg lands late
// and anchors the wall alone. Missing/stale cache degrades to alphabetical.
const TIMES_CACHE = path.join(repoRoot, 'scripts', '.sweep-times.json');
let lastTimes = {};
try {
  lastTimes = JSON.parse(fs.readFileSync(TIMES_CACHE, 'utf8'));
} catch {
  lastTimes = {};
}
legs.sort((a, b) => (lastTimes[b] ?? 0) - (lastTimes[a] ?? 0) || (a < b ? -1 : 1));

// the ONE accepted red (the suite's committed baseline)
const ACCEPTED_FAILURES = new Set(['scripts/diagnose-dual-inspection.cjs']);
// generous ceiling per leg — far above the slowest measured leg, well under
// the old ten-minute wall; a TIMEOUT prints as its own word, never a bare FAIL
const LEG_TIMEOUT_MS = 420_000;
// cpus−1 (one core left for the OS): measured on this 4-core box — at
// cpus/2 (=2 workers) the wall was ~340s because everything that is not the
// one 233s leg ran serially beside it; at 3 workers the 233s leg IS the wall.
const WORKERS = Math.max(2, os.cpus().length - 1);

function runLeg(leg) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(process.execPath, [path.join(repoRoot, leg)], {
      cwd: repoRoot,
      stdio: ['ignore', 'ignore', 'ignore'],
    });
    let timedOut = false;
    const killer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, LEG_TIMEOUT_MS);
    child.on('close', (code) => {
      clearTimeout(killer);
      resolve({ leg, ok: code === 0 && !timedOut, timedOut, seconds: (Date.now() - started) / 1000 });
    });
    child.on('error', () => {
      clearTimeout(killer);
      resolve({ leg, ok: false, timedOut: false, seconds: (Date.now() - started) / 1000 });
    });
  });
}

async function main() {
  const started = Date.now();
  console.log(`THE SWEEP — ${legs.length} legs · ${WORKERS} workers · per-leg ceiling ${LEG_TIMEOUT_MS / 1000}s\n`);
  const queue = [...legs];
  const results = [];
  const worker = async () => {
    for (;;) {
      const leg = queue.shift();
      if (!leg) return;
      const r = await runLeg(leg);
      results.push(r);
      const word = r.timedOut ? 'TIMEOUT' : r.ok ? 'PASS' : 'FAIL';
      console.log(`${word.padEnd(7)} ${r.leg}  ${r.seconds.toFixed(1)}s`);
    }
  };
  await Promise.all(Array.from({ length: WORKERS }, worker));

  try {
    fs.writeFileSync(TIMES_CACHE, JSON.stringify(Object.fromEntries(results.map((r) => [r.leg, +r.seconds.toFixed(1)])), null, 1));
  } catch {
    /* a lost cache costs one slower schedule, nothing else */
  }
  const slowest = [...results].sort((a, b) => b.seconds - a.seconds).slice(0, 5);
  console.log(`\nslowest: ${slowest.map((r) => `${r.leg.replace(/^scripts\/(app-leg\/)?diagnose-/, '')} ${r.seconds.toFixed(0)}s`).join(' · ')}`);
  console.log(`wall: ${((Date.now() - started) / 1000).toFixed(1)}s (sum of legs ${results.reduce((s, r) => s + r.seconds, 0).toFixed(0)}s)`);

  const failed = results.filter((r) => !r.ok).map((r) => r.leg).sort();
  const unexpectedFails = failed.filter((leg) => !ACCEPTED_FAILURES.has(leg));
  const missingAccepted = [...ACCEPTED_FAILURES].filter((leg) => !failed.includes(leg));

  console.log(`\n${legs.length} files · expect exactly ONE fail: diagnose-dual-inspection`);
  if (unexpectedFails.length === 0 && missingAccepted.length === 0) {
    console.log('SWEEP OK — the one expected fail, nothing else');
    process.exit(0);
  }
  if (unexpectedFails.length) console.log(`SWEEP RED — unexpected fail(s): ${unexpectedFails.join(' · ')}`);
  if (missingAccepted.length) {
    console.log(`SWEEP RED — the accepted fail PASSED: ${missingAccepted.join(' · ')} (the baseline moved — do not wave this through; the positive control is gone)`);
  }
  process.exit(1);
}

main();

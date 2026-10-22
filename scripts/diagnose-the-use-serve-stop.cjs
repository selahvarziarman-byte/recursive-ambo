#!/usr/bin/env node
'use strict';
// ═══════════════════════════════════════════════════════════════════════════════
// THE USE SERVE STOPS WHOLE AND WAITS FOR ITS LOG — GROUP 4 · slice 1's rider (the mothership's 13:27 STAMP: at release 3 `update.ps1 3a88a0f` built, stopped the old
// server and `FAILED to restart`: nothing listened and use-server.log held the old dev server's lines). MEASURED 10-22 on the coder's probe port, twice: the serve is a
// CHAIN — the window's cmd → npx's node → an inner cmd → vite's node (the listener) — and the window's cmd holds the log through `> log`; `Stop-Process` on the listener
// alone leaves the window alive at 0 ms with the log held, free only after 73–102 ms; update.ps1 started the new window at once, so its `> use-server.log` met the held
// file and the new cmd never ran. THE CURE (stop-serve.ps1, the one stop update.ps1 and stop.cmd use): every process carrying the port stopped, then a wait for the port
// and the log before anything starts. This witness pins the scripts' text and EXERCISES the mechanism on a probe port (5187), a window-like chain spawned as the
// scripts spawn it. Windows only (the release runs there); elsewhere it says so and passes nothing.
// ═══════════════════════════════════════════════════════════════════════════════
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawn, spawnSync } = require('node:child_process');
const repoRoot = path.resolve(__dirname, '..');
const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => { console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`); if (!cond) failures += 1; };
const note = (s) => console.log(`      ${s}`);
const readLf = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n');
console.log('THE USE SERVE STOPS WHOLE AND WAITS FOR ITS LOG — the restart failure of release 3 measured and cured by construction\n');
// ═══ §1 THE TEXT ═══
const upd = readLf('.handoff/instruments/use-server/update.ps1'); const stopCmd = readLf('.handoff/instruments/use-server/stop.cmd'); const stopPs = readLf('.handoff/instruments/use-server/stop-serve.ps1'); const startCmd = readLf('.handoff/instruments/use-server/start.cmd');
const stopAt = upd.indexOf("Stop-Serve -Port 5180 -Log 'C:\\Dev\\202cl\\use-server.log'"); const startAt = upd.indexOf("cmd /c 'start \"USE server");
check('§1 ★★ update.ps1 stops the serve WHOLE and waits for its log BEFORE it starts the new window: it dot-sources stop-serve.ps1 and refuses when the port or the log does not free; no `Stop-Process` on the listener alone remains; the build still runs before the stop (a failed build strands nothing)',
  /\. \(Join-Path \$PSScriptRoot 'stop-serve\.ps1'\)/.test(upd) && stopAt > 0 && startAt > stopAt && /if \(-not \(Stop-Serve -Port 5180 -Log 'C:\\Dev\\202cl\\use-server\.log'\)\) \{ Fail /.test(upd) && !/Stop-Process -Id \$c\[0\]\.OwningProcess/.test(upd) && upd.indexOf('npx vite build') < stopAt && /npx vite preview --port 5180 --strictPort > C:\\Dev\\202cl\\use-server\.log 2>&1/.test(upd),
  { stopAt, startAt, buildAt: upd.indexOf('npx vite build') });
check('§1 ★ stop.cmd stops by the same script (never the listener alone); stop-serve.ps1 stops every process carrying `--port N` and the port\'s owner, then waits for the port and the log (50 ms steps, 10 s), refusing loudly after',
  /stop-serve\.ps1" -Port 5180 -Log C:\\Dev\\202cl\\use-server\.log/.test(stopCmd) && !/Stop-Process -Id \$id -Force; Write-Host \('STOPPED/.test(stopCmd) && /\$pat = "\*--port \$Port\*"/.test(stopPs) && /Get-NetTCPConnection -LocalPort \$Port -State Listen/.test(stopPs) && /Test-LogFree/.test(stopPs) && /Start-Sleep -Milliseconds 50/.test(stopPs) && /REFUSED: after/.test(stopPs) && /\[IO\.File\]::Open\(\$path, 'Open', 'Write', 'None'\)/.test(stopPs),
  { stopCmdHasScript: /stop-serve\.ps1/.test(stopCmd) });
check('§1 ★ start.cmd starts the same form update.ps1 restarts (a /MIN window, `npx vite preview --port 5180 --strictPort > C:\\Dev\\202cl\\use-server.log 2>&1`), building first only when no build is there',
  /start "USE server  \(pinned release -- close this window to stop\)" \/MIN cmd \/c "cd \/d C:\\Dev\\202cl\\USE && npx vite preview --port 5180 --strictPort > C:\\Dev\\202cl\\use-server\.log 2>&1"/.test(startCmd) && /if not exist C:\\Dev\\202cl\\USE\\dist\\index\.html/.test(startCmd) && /call npx vite build/.test(startCmd));
// ═══ §2 THE MECHANISM on the probe port ═══
if (process.platform !== 'win32') {
  note('not Windows — the mechanism is the release machine\'s; §2 not run here');
} else {
  const PORT = 5187;
  const log = path.join(os.tmpdir(), `use-serve-witness-${process.pid}.log`);
  const ps = (cmd) => spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', cmd], { encoding: 'utf8', timeout: 60000 });
  const listening = () => /:5187\s.*LISTENING/.test(spawnSync('netstat', ['-ano'], { encoding: 'utf8' }).stdout || '');
  const waitFor = (pred, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (pred()) return true; spawnSync('powershell', ['-NoProfile', '-Command', 'Start-Sleep -Milliseconds 250']); } return pred(); };
  const logFree = () => ps(`try { $fs = [IO.File]::Open('${log}', 'Open', 'Write', 'None'); $fs.Close(); 'FREE' } catch { 'HELD' }`).stdout.includes('FREE');
  const spawnChain = () => { const child = spawn('cmd.exe', ['/c', `cd /d ${repoRoot} && npx vite preview --port ${PORT} --strictPort > ${log} 2>&1`], { detached: true, stdio: 'ignore', windowsHide: true }); child.unref(); return child; };
  const killTree = () => ps(`Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*--port ${PORT}*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }`);
  killTree();
  try { fs.unlinkSync(log); } catch { /* none */ }
  // THE CONTROL — the defect as measured: the listener stopped alone, the log still held at 0 ms
  spawnChain();
  const up1 = waitFor(listening, 25000);
  const heldWhileUp = up1 ? !logFree() : null;
  const r = up1 ? ps(`$c = Get-NetTCPConnection -LocalPort ${PORT} -State Listen; Stop-Process -Id $c[0].OwningProcess -Force; try { $fs = [IO.File]::Open('${log}', 'Open', 'Write', 'None'); $fs.Close(); 'FREE-AT-0' } catch { 'HELD-AT-0' }`) : null;
  const at0 = r ? (r.stdout || '').trim() : null;
  note(`the control: listening ${up1} · the log held while up ${heldWhileUp} · right after Stop-Process of the listener alone: ${at0}`);
  check('§2 ★★ THE DEFECT, REPRODUCED (the control): the serve\'s chain up on the probe port holds its log; the listener stopped ALONE, the log is STILL HELD at 0 ms — the moment update.ps1 started the new window', up1 && heldWhileUp === true && at0 === 'HELD-AT-0', { up1, heldWhileUp, at0 });
  killTree(); waitFor(() => !listening(), 5000); waitFor(logFree, 5000);
  // THE CURE — stop-serve.ps1: after it returns, the port and the log are free at once, and a new start takes
  spawnChain();
  const up2 = waitFor(listening, 25000);
  const t0 = Date.now();
  const stop = up2 ? spawnSync('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(repoRoot, '.handoff/instruments/use-server/stop-serve.ps1'), '-Port', String(PORT), '-Log', log], { encoding: 'utf8', timeout: 60000 }) : null;
  const stopMs = Date.now() - t0;
  const freeAfter = up2 ? logFree() : null; const downAfter = up2 ? !listening() : null;
  note(`the cure: listening ${up2} · stop-serve exit ${stop && stop.status} in ${stopMs} ms — ${(stop && (stop.stdout || '').trim().split('\n').map((l) => l.trim()).join(' / ')) || ''} · after it: the log free ${freeAfter} · the port down ${downAfter}`);
  spawnChain();
  const up3 = waitFor(listening, 25000);
  check('§2 ★★ THE CURE: stop-serve.ps1 stops the whole chain and returns only when the port and the log are free (said with the wait in ms); right after it a new start of the same form LISTENS — the sequence update.ps1 now runs', up2 && stop && stop.status === 0 && /the port is free and the log is free after \d+ ms/.test(stop.stdout || '') && freeAfter === true && downAfter === true && up3, { up2, status: stop && stop.status, stopMs, freeAfter, downAfter, up3 });
  killTree(); waitFor(() => !listening(), 5000);
  try { fs.unlinkSync(log); } catch { /* held or gone */ }
}
console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-USE-SERVE-STOP: ALL PASS — the serve stops whole and waits for its log; a new start takes' : `DIAGNOSE-THE-USE-SERVE-STOP: ${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);

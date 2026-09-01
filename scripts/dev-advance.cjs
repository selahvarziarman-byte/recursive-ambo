// THE SERVE IS THE ADVANCE (the mothership's 1829 charter, un-suspended at
// 1849 after the coder's harness measurement killed era 1): `npm run dev` in
// the MAIN checkout advances `team-arman` by FAST-FORWARD from the newest
// `wt/*` branch BEFORE vite serves, and REFUSES TO START when the advance is
// not clean — never start stale, never merge non-ff; a server that starts
// anyway is the green that stops the looking. INSIDE-OUT is the only legal
// direction (git refuses outside-in ref writes to a checked-out branch, and
// the coder's session harness forbids the coder's git from touching the main
// checkout at all — measured, three refusals, 1846), so this module runs as
// ARMAN'S OWN PROCESS, which is the one place the advance can live.
//
// THE REFUSAL PATH IS PART OF THE CUT: on a blocked fast-forward every
// blocking path is NAMED, and dirt that is BYTE-IDENTICAL to the target's
// version (the trap that stalled the 09-01 checkout: git compares to HEAD,
// not the target) is distinguished from a real live edit — the safe clear
// command is printed for the identical class ONLY; a differing file is
// someone's work and this script never touches it. NOTHING here writes the
// working tree; the only mutation is the ff ref move itself.
//
// `whereamiPayload` is the /__whereami endpoint's producer (vite.config
// consumes it): the served HEAD/branch read FRESH per call — a cached SHA is
// a stamp that drifts from the tree that made it.
//
// Witness: scripts/diagnose-dev-advance.cjs (a scratch-repo harness driving
// every arm — advanced · current · skipped-worktree · refused-dirty with
// both dirt classes · refused-diverged · refused-ambiguous).

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const BRANCH = 'team-arman';

function git(cwd, args) {
  const out = spawnSync('git', args, { cwd, encoding: 'utf8' });
  return {
    status: out.status ?? -1,
    stdout: (out.stdout ?? '').trim(),
    stderr: (out.stderr ?? '').trim(),
  };
}

function isLinkedWorktree(cwd) {
  const dir = git(cwd, ['rev-parse', '--git-dir']).stdout;
  return /[\\/]worktrees[\\/]/.test(dir);
}

function currentBranch(cwd) {
  return git(cwd, ['rev-parse', '--abbrev-ref', 'HEAD']).stdout;
}

function headOf(cwd, ref) {
  const r = git(cwd, ['rev-parse', ref]);
  return r.status === 0 ? r.stdout : null;
}

function isAncestor(cwd, maybeAncestor, ref) {
  return git(cwd, ['merge-base', '--is-ancestor', maybeAncestor, ref]).status === 0;
}

// the advance target: the wt/* branch strictly ahead of HEAD. With several,
// the one containing all the others wins (the true tip); with none
// containing the rest the state is AMBIGUOUS and the script refuses — a
// guess here would silently serve somebody's older line.
function findAdvanceTarget(cwd) {
  const list = git(cwd, ['branch', '--list', 'wt/*', '--format=%(refname:short)']);
  const names = list.stdout === '' ? [] : list.stdout.split('\n').map((s) => s.trim()).filter(Boolean);
  const ahead = names.filter((n) => isAncestor(cwd, 'HEAD', n) && headOf(cwd, n) !== headOf(cwd, 'HEAD'));
  // a DIVERGED wt line (neither ancestor nor descendant) means committed work
  // exists that the serve would silently omit — the witness's arm (f) caught
  // this reading as "current" in the first cut, which was exactly the
  // never-start-stale hazard wearing a green
  const diverged = names.filter((n) => !isAncestor(cwd, 'HEAD', n) && !isAncestor(cwd, n, 'HEAD'));
  if (diverged.length > 0) return { kind: 'diverged', branches: diverged };
  if (ahead.length === 0) return { kind: 'none' };
  const maxima = ahead.filter((a) => ahead.every((b) => a === b || isAncestor(cwd, b, a)));
  if (maxima.length === 0) return { kind: 'ambiguous', candidates: ahead };
  const tips = new Set(maxima.map((m) => headOf(cwd, m)));
  if (tips.size > 1) return { kind: 'ambiguous', candidates: maxima };
  return { kind: 'target', branch: maxima[0], tip: headOf(cwd, maxima[0]) };
}

function classifyBlockedPaths(cwd, targetRef, stderrText) {
  const lines = stderrText.split('\n').map((s) => s.trim());
  const start = lines.findIndex((l) => l.includes('would be overwritten by merge'));
  const paths = [];
  if (start >= 0) {
    for (let i = start + 1; i < lines.length; i += 1) {
      const l = lines[i];
      if (l === '' || /^Please commit|^Aborting|^Merge with|^error:/.test(l)) break;
      paths.push(l);
    }
  }
  return paths.map((p) => {
    const show = spawnSync('git', ['show', `${targetRef}:${p.replace(/\\/g, '/')}`], { cwd, encoding: 'buffer' });
    let verdict = 'DIFFERS from the target — someone\'s live edit; do not clear blindly';
    let identical = false;
    if (show.status === 0) {
      try {
        const working = fs.readFileSync(path.join(cwd, p));
        identical = Buffer.compare(working, show.stdout) === 0;
        if (identical) {
          verdict = `byte-identical to the target — safe to clear: git checkout ${targetRef} -- "${p}"`;
        }
      } catch {
        verdict = 'unreadable in the working tree — inspect by hand';
      }
    }
    return { path: p, identical, verdict };
  });
}

// the one advance. Returns a verdict object; never throws for a state a
// person can reach.
function advance(cwd) {
  if (isLinkedWorktree(cwd)) {
    return {
      kind: 'skipped-worktree',
      detail: 'a linked worktree serve is a probe — the advance is the MAIN checkout\'s act; serving as-is (fingerprint the tree before believing an eye-run)',
    };
  }
  const branch = currentBranch(cwd);
  if (branch !== BRANCH) {
    return {
      kind: 'refused',
      reason: `the main checkout is on "${branch}", not ${BRANCH} — the advance only serves the ${BRANCH} flow; serve bare vite deliberately if this is intentional`,
    };
  }
  const target = findAdvanceTarget(cwd);
  if (target.kind === 'diverged') {
    return {
      kind: 'refused',
      reason: `${BRANCH} and ${target.branches.join(', ')} have DIVERGED — committed work exists that a fast-forward cannot carry and this serve would silently omit; resolve by hand, never here`,
    };
  }
  if (target.kind === 'none') {
    return { kind: 'current', detail: `${BRANCH} already at the newest wt tip (${(headOf(cwd, 'HEAD') ?? '').slice(0, 7)})` };
  }
  if (target.kind === 'ambiguous') {
    return {
      kind: 'refused',
      reason: `two or more wt/* branches are ahead and none contains the others — refusing to guess which line to serve: ${target.candidates.join(', ')}`,
    };
  }
  const merge = git(cwd, ['merge', '--ff-only', target.branch]);
  if (merge.status === 0) {
    return { kind: 'advanced', detail: `${BRANCH} fast-forwarded to ${target.branch} (${target.tip.slice(0, 7)})` };
  }
  const text = `${merge.stderr}\n${merge.stdout}`;
  if (/not possible to fast-forward|Not possible to fast-forward|diverg/i.test(text)) {
    return {
      kind: 'refused',
      reason: `${BRANCH} and ${target.branch} have DIVERGED — a fast-forward cannot say which history is true; resolve by hand, never here`,
    };
  }
  const blocked = classifyBlockedPaths(cwd, target.branch, text);
  if (blocked.length > 0) {
    return {
      kind: 'refused',
      reason: 'the fast-forward would overwrite local changes — the server refuses to start',
      blocked,
    };
  }
  return { kind: 'refused', reason: `git refused the fast-forward: ${text.trim().slice(0, 300)}` };
}

// /__whereami's producer — FRESH per call, never cached.
function whereamiPayload(cwd) {
  const dirty = git(cwd, ['status', '--porcelain']);
  return {
    head: headOf(cwd, 'HEAD'),
    branch: currentBranch(cwd),
    checkout: isLinkedWorktree(cwd) ? 'linked-worktree' : 'main',
    dirtyPaths: dirty.stdout === '' ? 0 : dirty.stdout.split('\n').length,
    at: new Date().toISOString(),
  };
}

// STAMP P-1 (the GO-stale mark): the LAG producer — while a server runs, is
// the served tree behind the wt/* line? Read FRESH per call, same finder as
// the advance (one producer, one truth). `behind` is true for a clean
// fast-forwardable gap AND for diverged/ambiguous states — those are also
// go-stale states (committed work exists that this serve is not showing);
// `kind` says which. A linked-worktree serve is never behind its own line.
function lagPayload(cwd) {
  const base = whereamiPayload(cwd);
  if (base.checkout !== 'main' || base.branch !== BRANCH) {
    return { behind: false, kind: 'not-the-main-serve', ...base };
  }
  const target = findAdvanceTarget(cwd);
  if (target.kind === 'none') return { behind: false, kind: 'current', ...base };
  if (target.kind === 'target') {
    return { behind: true, kind: 'behind', target: { branch: target.branch, tip: target.tip }, ...base };
  }
  return { behind: true, kind: target.kind, branches: target.branches ?? target.candidates, ...base };
}

module.exports = { advance, whereamiPayload, lagPayload, findAdvanceTarget, BRANCH };

if (require.main === module && process.argv.includes('--lag-json')) {
  // STAMP P-1's transport arm (the vite watcher spawns this, same idiom as
  // --whereami-json — the ESM config bundle cannot require CJS)
  process.stdout.write(JSON.stringify(lagPayload(process.cwd())));
  process.exit(0);
}

if (require.main === module && process.argv.includes('--whereami-json')) {
  // the /__whereami transport arm: vite.config spawns this (ONE producer —
  // the ESM config bundle cannot require a CJS module, measured: esbuild
  // inlines it and 'Dynamic require of node:child_process' refuses at boot)
  process.stdout.write(JSON.stringify(whereamiPayload(process.cwd())));
  process.exit(0);
}

if (require.main === module && process.argv.includes('--advance')) {
  const verdict = advance(process.cwd());
  if (verdict.kind === 'advanced' || verdict.kind === 'current') {
    console.log(`[dev-advance] ${verdict.detail}`);
    process.exit(0);
  }
  if (verdict.kind === 'skipped-worktree') {
    console.log(`[dev-advance] ${verdict.detail}`);
    process.exit(0);
  }
  console.error(`[dev-advance] REFUSED — ${verdict.reason}`);
  for (const b of verdict.blocked ?? []) {
    console.error(`[dev-advance]   ${b.path} — ${b.verdict}`);
  }
  console.error('[dev-advance] never start stale, never merge non-ff — the server does not start until this is resolved.');
  process.exit(1);
}

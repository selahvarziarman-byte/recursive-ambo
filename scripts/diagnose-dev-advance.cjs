#!/usr/bin/env node
// THE SERVE-IS-THE-ADVANCE WITNESS (the 1829/1849 cut): a SCRATCH-REPO
// harness — every arm of scripts/dev-advance.cjs driven on a temp repo the
// witness builds and deletes (a witness may never write into the tracked
// tree; the temp repo lives under the OS tmpdir). Arms: advanced · current ·
// skipped-worktree · refused-on-foreign-branch · refused-dirty with BOTH
// dirt classes (a DIFFERING live edit named as such; BYTE-IDENTICAL dirt —
// the trap that stalled the 09-01 checkout — named safe with its exact
// clear command) · refused-diverged · refused-ambiguous (two wt tips,
// neither containing the other) · the whereami payload fresh and honest in
// both checkout kinds.
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const { advance, whereamiPayload, lagPayload, BRANCH } = require(path.join(repoRoot, 'scripts', 'dev-advance.cjs'));

let failures = 0;
const check = (label, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${label}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

const g = (cwd, ...args) => {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`git ${args.join(' ')} failed in ${cwd}: ${r.stderr}`);
  return r.stdout.trim();
};
const writeFile = (dir, rel, text) => fs.writeFileSync(path.join(dir, rel), text);

const base = fs.mkdtempSync(path.join(os.tmpdir(), 'dev-advance-witness-'));
const main = path.join(base, 'main');
const wt = path.join(base, 'wt');
fs.mkdirSync(main);

console.log('THE SERVE IS THE ADVANCE — the scratch-repo harness\n');
try {
  // ---- the scratch world: main checkout on team-arman + one linked worktree
  g(main, 'init', '-b', BRANCH);
  g(main, 'config', 'user.email', 'witness@local');
  g(main, 'config', 'user.name', 'witness');
  writeFile(main, 'a.txt', 'one\n');
  writeFile(main, 'ledger.md', 'ledger v1\n');
  g(main, 'add', '.');
  g(main, 'commit', '-m', 'c1');
  g(main, 'worktree', 'add', '-b', 'wt/test', wt);
  writeFile(wt, 'a.txt', 'two\n');
  g(wt, 'add', '.');
  g(wt, 'commit', '-m', 'c2');

  // (a) clean ahead → advanced, HEAD moves to the wt tip
  const a = advance(main);
  note(`(a) ${a.kind}: ${a.detail ?? a.reason ?? ''}`);
  check('(a) CLEAN AHEAD ADVANCES: the main checkout fast-forwards to the wt tip before serving',
    a.kind === 'advanced' && g(main, 'rev-parse', 'HEAD') === g(wt, 'rev-parse', 'HEAD'));

  // (b) run again → current (idempotent; the serve proceeds)
  const b = advance(main);
  check('(b) ALREADY CURRENT PROCEEDS: a second advance reports current, never errors, never re-merges',
    b.kind === 'current');

  // (c) inside the linked worktree → skipped by name (a worktree serve is a probe)
  const c = advance(wt);
  check('(c) A WORKTREE SERVE SKIPS ITSELF BY NAME: the advance is the MAIN checkout\'s act and says so',
    c.kind === 'skipped-worktree' && /probe/.test(c.detail));

  // (d) dirty DIFFERING file blocking the ff → refused, path named, DIFFERS named
  writeFile(wt, 'ledger.md', 'ledger v2\n');
  g(wt, 'add', '.');
  g(wt, 'commit', '-m', 'c3');
  writeFile(main, 'ledger.md', 'somebody\'s live edit\n');
  const d = advance(main);
  note(`(d) ${d.kind}: ${(d.blocked ?? []).map((x) => `${x.path} — ${x.verdict.slice(0, 40)}`).join(' | ')}`);
  check('(d) A DIFFERING LIVE EDIT REFUSES BY NAME: the blocking path is listed, judged DIFFERS, and nothing is cleared — the server does not start',
    d.kind === 'refused' && (d.blocked ?? []).some((x) => x.path === 'ledger.md' && !x.identical && /DIFFERS/.test(x.verdict)) &&
    fs.readFileSync(path.join(main, 'ledger.md'), 'utf8') === 'somebody\'s live edit\n');

  // (e) dirt BYTE-IDENTICAL to the target (the 09-01 trap) → refused with the safe clear command
  writeFile(main, 'ledger.md', 'ledger v2\n');
  const e = advance(main);
  note(`(e) ${e.kind}: ${(e.blocked ?? []).map((x) => x.verdict.slice(0, 70)).join(' | ')}`);
  check('(e) BYTE-IDENTICAL DIRT IS DISTINGUISHED (the trap that stalled the 09-01 checkout — git compares to HEAD, not the target): the path is judged identical and the exact safe clear command is printed; the script still refuses rather than clearing on its own',
    e.kind === 'refused' && (e.blocked ?? []).some((x) => x.path === 'ledger.md' && x.identical && /git checkout .* -- "ledger.md"/.test(x.verdict)));
  g(main, 'checkout', 'wt/test', '--', 'ledger.md');
  g(main, 'merge', '--ff-only', 'wt/test');

  // (f) divergence → refused with the diverged sentence
  writeFile(main, 'main-only.txt', 'x\n');
  g(main, 'add', '.');
  g(main, 'commit', '-m', 'c4-main');
  writeFile(wt, 'wt-only.txt', 'y\n');
  g(wt, 'add', '.');
  g(wt, 'commit', '-m', 'c5-wt');
  const f = advance(main);
  note(`(f) ${f.kind}: ${(f.reason ?? '').slice(0, 90)}`);
  check('(f) DIVERGENCE REFUSES — a fast-forward cannot say which history is true, and the script never resolves it',
    f.kind === 'refused' && /DIVERGED/i.test(f.reason ?? ''));
  g(wt, 'merge', BRANCH);
  const f2 = advance(main);
  check('(f2) …and once the worktree line CONTAINS the main line again, the advance resumes',
    f2.kind === 'advanced');

  // (g) two wt branches ahead, neither containing the other → refused ambiguous
  const wt2 = path.join(base, 'wt2');
  g(main, 'worktree', 'add', '-b', 'wt/other', wt2);
  writeFile(wt, 'p.txt', 'p\n');
  g(wt, 'add', '.');
  g(wt, 'commit', '-m', 'c6');
  writeFile(wt2, 'q.txt', 'q\n');
  g(wt2, 'add', '.');
  g(wt2, 'commit', '-m', 'c7');
  const gv = advance(main);
  note(`(g) ${gv.kind}: ${(gv.reason ?? '').slice(0, 100)}`);
  check('(g) TWO INDEPENDENT wt TIPS REFUSE AS AMBIGUOUS, both named — the script never guesses whose line to serve',
    gv.kind === 'refused' && /wt\/test/.test(gv.reason ?? '') && /wt\/other/.test(gv.reason ?? ''));

  // (h) whereami: fresh, honest, in both checkout kinds
  const wm = whereamiPayload(main);
  const ww = whereamiPayload(wt);
  note(`(h) main: ${JSON.stringify({ branch: wm.branch, checkout: wm.checkout })} · wt: ${JSON.stringify({ branch: ww.branch, checkout: ww.checkout })}`);
  check('(h) /__whereami\'s producer answers FRESH per call and names the checkout kind: the main checkout reads main + its branch + its HEAD; the linked worktree reads linked-worktree — the detector behind the prevention',
    wm.checkout === 'main' && wm.branch === BRANCH && wm.head === g(main, 'rev-parse', 'HEAD') &&
    ww.checkout === 'linked-worktree' && typeof wm.at === 'string');

  // (i) STAMP P-1 — the GO-stale producer: behind/diverged/ambiguous are all
  // go-stale states; current and a worktree serve are quiet
  const lagAmbiguous = lagPayload(main);
  note(`(i) ambiguous state: ${JSON.stringify({ behind: lagAmbiguous.behind, kind: lagAmbiguous.kind })}`);
  const lagWt = lagPayload(wt);
  g(main, 'worktree', 'remove', '--force', wt2);
  g(main, 'branch', '-D', 'wt/other');
  const lagBehind = lagPayload(main);
  note(`(i) behind state: ${JSON.stringify({ behind: lagBehind.behind, kind: lagBehind.kind, target: lagBehind.target })}`);
  const adv = advance(main);
  const lagCurrent = lagPayload(main);
  check('(i) STAMP P-1 — THE GO-STALE PRODUCER TELLS EVERY TRUTH IN ITS KIND: two independent wt tips read behind:true kind ambiguous (committed work this serve is not showing); one clean gap reads behind:true kind behind WITH the target branch and tip; the advanced state reads behind:false current; and a linked-worktree serve is never behind its own line (not-the-main-serve) — the mark\'s one producer, the same finder as the advance',
    lagAmbiguous.behind === true && lagAmbiguous.kind === 'ambiguous' &&
    lagWt.behind === false && lagWt.kind === 'not-the-main-serve' &&
    lagBehind.behind === true && lagBehind.kind === 'behind' &&
    lagBehind.target && lagBehind.target.branch === 'wt/test' && lagBehind.target.tip === g(wt, 'rev-parse', 'HEAD') &&
    adv.kind === 'advanced' && lagCurrent.behind === false && lagCurrent.kind === 'current');
} finally {
  try {
    fs.rmSync(base, { recursive: true, force: true });
  } catch {
    // a held handle on Windows — the tmpdir reaps it; nothing tracked is touched
  }
}

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`} — the serve is the advance`);
process.exit(failures === 0 ? 0 : 1);

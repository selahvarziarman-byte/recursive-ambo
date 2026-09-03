#!/usr/bin/env node

// RIDER R-1 — THE INBOX GATE, BY CONSTRUCTION (chartered in the mothership's
// 0910 ruling, riding beside the card cycle's first commit; the law it
// enforces is claims §48, bought with a real breach: the 0723 SUPERSEDE sat
// unread across two commits because the inbox was read at WAKE and never
// again — "a queue read at wake is a snapshot; only a queue re-read at the
// commit is a state").
//
// WHAT IT DOES: refuses `git commit` while `.handoff/inbox/coder/` holds a
// letter the coder has not marked reviewed since it arrived. The refusal
// NAMES each unconsumed letter. It guards the CODER's inbox only — no other
// seat's queue is its business — and it NEVER moves, archives, or edits
// mail: read-only, refuse-or-pass, nothing else (the charter's "MARK never
// move").
//
// THE GESTURE: after actually reading the letters, touch the marker —
//     node scripts/hooks/check-coder-inbox.cjs --mark-reviewed --expect <N>
// where N is the count of letters READ IN FULL (the gate refuses any other N).
// The marker (.handoff/inbox/coder/.reviewed) lives inside the gitignored
// inbox; letters are *.md so the dotfile is never counted as mail. A letter
// that arrives AFTER the touch is newer than the marker and refuses the next
// commit — which is exactly the 0723 class.
//
// THE OVERRIDE (explicit, loud, never silent):
//     CODER_INBOX_OVERRIDE=1 git commit ...
// prints what it is skipping and why that is on the committer.
//
// WORKTREES: the mail lives only in the MAIN checkout (the inbox is
// gitignored, so a worktree has no copy). The hook resolves the true queue
// through `git rev-parse --git-common-dir` — a commit fired from any
// worktree is guarded against the same one queue.

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const commonDir = execFileSync('git', ['rev-parse', '--git-common-dir'], { encoding: 'utf8' }).trim();
const mainRoot = path.dirname(path.resolve(commonDir));
const inboxDir = path.join(mainRoot, '.handoff', 'inbox', 'coder');
const markerPath = path.join(inboxDir, '.reviewed');

if (process.argv.includes('--mark-reviewed')) {
  // The consumption gesture — a deliberate act, never automatic — and it
  // REQUIRES `--expect <N>`: the number of letters the reader has READ IN
  // FULL. The gate refuses to set the marker when the inbox holds a different
  // count, so a chain that lists and marks in one breath FAILS BY
  // CONSTRUCTION: the number it carries was typed before the listing ran.
  // (Bought 2026-09-03, twice in one hour: MARKER W-4 at 23:19 and the
  // researcher's 23:26 notice were both marked read by a landing chain that
  // had only printed their names — a listing is not a reading.)
  const present = fs.existsSync(inboxDir)
    ? fs.readdirSync(inboxDir).filter((n) => n.endsWith('.md')).sort()
    : [];
  const naming = present.map((n) => `  · ${n}`).join(String.fromCharCode(10));
  const expectAt = process.argv.indexOf('--expect');
  const expected = expectAt >= 0 ? Number(process.argv[expectAt + 1]) : NaN;
  if (!Number.isInteger(expected)) {
    console.error(
      `inbox gate — REFUSED to mark: --expect <N> is required (N = the letters you have read in full). The inbox holds ${present.length}:
${naming}`,
    );
    process.exit(1);
  }
  if (expected !== present.length) {
    console.error(
      `inbox gate — REFUSED to mark: you declared ${expected} letter(s) read; the inbox holds ${present.length}. Read what is there, then declare its count:
${naming}`,
    );
    process.exit(1);
  }
  fs.mkdirSync(inboxDir, { recursive: true });
  fs.closeSync(fs.openSync(markerPath, 'a'));
  const now = new Date();
  fs.utimesSync(markerPath, now, now);
  console.log(`inbox gate — marked reviewed at ${now.toISOString()} — ${present.length} letter(s) declared read in full (${markerPath})`);
  process.exit(0);
}

if (!fs.existsSync(inboxDir)) {
  // No inbox directory at the main checkout: an empty queue passes, but say
  // so — an inbox that VANISHED would otherwise wear innocence.
  console.log(`inbox gate — no inbox at ${inboxDir}; nothing to consume.`);
  process.exit(0);
}

const letters = fs
  .readdirSync(inboxDir)
  .filter((f) => f.toLowerCase().endsWith('.md'))
  .map((f) => ({ name: f, mtime: fs.statSync(path.join(inboxDir, f)).mtimeMs }));

const markerMtime = fs.existsSync(markerPath) ? fs.statSync(markerPath).mtimeMs : null;

const unconsumed = letters.filter((l) => markerMtime === null || l.mtime > markerMtime);

if (unconsumed.length === 0) {
  console.log(
    letters.length === 0
      ? 'inbox gate — the coder inbox is empty; commit proceeds.'
      : `inbox gate — ${letters.length} letter(s), all reviewed since arrival; commit proceeds.`,
  );
  process.exit(0);
}

const naming = unconsumed
  .map((l) => `    ${l.name} (arrived ${new Date(l.mtime).toISOString()})`)
  .join('\n');

if (process.env.CODER_INBOX_OVERRIDE === '1') {
  console.log(
    `inbox gate — OVERRIDDEN (CODER_INBOX_OVERRIDE=1). Committing OVER ${unconsumed.length} unconsumed letter(s):\n${naming}\n  The §48 law stands; this commit's report must say why the queue was jumped.`,
  );
  process.exit(0);
}

console.error(
  `inbox gate — COMMIT REFUSED. ${unconsumed.length} letter(s) in .handoff/inbox/coder/ ${
    markerMtime === null ? 'have never been marked reviewed' : 'arrived after the last review mark'
  }:\n${naming}\n\n  A queue read at wake is a snapshot; only a queue re-read at the commit is a state (claims §48 — the 0723 breach).\n  READ the letters, then mark the review:\n      node scripts/hooks/check-coder-inbox.cjs --mark-reviewed\n  Explicit override (loud, on you):  CODER_INBOX_OVERRIDE=1 git commit ...`,
);
process.exit(1);

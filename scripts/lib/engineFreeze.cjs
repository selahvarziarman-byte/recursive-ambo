// THE ENGINE FREEZE MANIFEST — the shared checker (engineer-chartered
// 2026-07-12, built 2026-07-13).
//
// THE LAW: A GUARD MUST NOT REQUIRE A HOLE IN ITSELF TO PERMIT A SANCTIONED
// CHANGE. A guard's job is not to prevent change — it is to make change
// VISIBLE and DELIBERATE. The old per-diagnostic HEAD-differential guards
// could permit a mandated edit only by REMOVING the file from their own
// lists — a silent, permanent hole (`playgroundOperations.ts` ended up
// guarded by NOBODY, and nothing went red). This module checks the engine
// against ONE on-repo manifest of content hashes instead: a sanctioned
// change updates the file's hash line in the SAME commit — one loud,
// reviewable diff line — and coverage never lapses. No carve-outs, ever.
//
// ⛔ ANTI-NEUTERING: this module READS the manifest and MUST NEVER write it.
// No auto-regeneration, no --update, no fix mode — a hash update is a
// deliberate human act, reviewed in the diff. (diagnose-engine-freeze.cjs
// grep-proves that no script under scripts/ can write the manifest.)
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const MANIFEST_REL = 'docs/governance/ENGINE_FREEZE_MANIFEST.txt';
const MANIFEST_PATH = path.join(REPO_ROOT, MANIFEST_REL);
// COMPLETENESS ROOTS: every .ts/.tsx under these must appear in the manifest —
// FROZEN (hashed) or NOT_FROZEN (named, with a reason). A new engine file can
// never again be silently unguarded: it surfaces in `unlisted` and FAILS.
const ROOTS = ['src/lib', 'src/playground', 'src/manuscript'];

// CR-INSENSITIVE hashing (mothership-ruled comparison doctrine, 2026-07-11):
// strip \r before hashing so CRLF-drifted checkouts never cry wolf; the
// witnesses' bite self-tests prove the strip is not itself a hole.
const sha256OfCrStripped = (content) =>
  crypto.createHash('sha256').update(content.replace(/\r/g, ''), 'utf8').digest('hex');

function parseManifest() {
  const raw = fs.readFileSync(MANIFEST_PATH, 'utf8');
  const frozen = new Map(); // repo-relative path -> expected sha256 of CR-stripped content
  const notFrozen = new Set();
  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line === '' || line.startsWith('#')) continue;
    if (line.startsWith('NOT_FROZEN ')) {
      const m = line.match(/^NOT_FROZEN\s+(\S+)/);
      if (!m) throw new Error(`engineFreeze: malformed NOT_FROZEN line: ${rawLine}`);
      notFrozen.add(m[1]);
      continue;
    }
    const m = line.match(/^(\S+)\s+([0-9a-f]{64})$/);
    if (!m) throw new Error(`engineFreeze: malformed manifest line (want "<path>  <sha256>"): ${rawLine}`);
    frozen.set(m[1], m[2]);
  }
  return { frozen, notFrozen };
}

function listSourceFiles() {
  const out = [];
  const walk = (rel) => {
    for (const entry of fs.readdirSync(path.join(REPO_ROOT, rel), { withFileTypes: true })) {
      const childRel = `${rel}/${entry.name}`;
      if (entry.isDirectory()) walk(childRel);
      else if (/\.tsx?$/.test(entry.name)) out.push(childRel);
    }
  };
  for (const root of ROOTS) walk(root);
  return out.sort();
}

// checkEngineFreeze(options?) → { ok, drifted, missing, unlisted, checked, frozen, manifestPath }
//   drifted  — frozen files whose CR-stripped content hash ≠ the manifest hash
//   missing  — frozen files absent from the working tree
//   unlisted — .ts/.tsx under the roots that are in NEITHER list (completeness)
//   checked  — number of frozen entries verified (the witnesses pin 27)
//   ok       — drifted, missing and unlisted all empty
// options.overrides (test-only): { [repoRelativePath]: content } substitutes
// IN-MEMORY content for a file before hashing — the witnesses' bite self-tests
// and the carried-mutant demonstrations use it. It never touches the disk and
// never touches the manifest.
function checkEngineFreeze(options = {}) {
  const overrides = options.overrides ?? {};
  const { frozen, notFrozen } = parseManifest();
  const drifted = [];
  const missing = [];
  for (const [file, expected] of frozen) {
    let content;
    if (Object.prototype.hasOwnProperty.call(overrides, file)) {
      content = overrides[file];
    } else {
      const abs = path.join(REPO_ROOT, file);
      if (!fs.existsSync(abs)) {
        missing.push(file);
        continue;
      }
      content = fs.readFileSync(abs, 'utf8');
    }
    if (sha256OfCrStripped(content) !== expected) drifted.push(file);
  }
  const unlisted = listSourceFiles().filter((f) => !frozen.has(f) && !notFrozen.has(f));
  return {
    ok: drifted.length === 0 && missing.length === 0 && unlisted.length === 0,
    drifted,
    missing,
    unlisted,
    checked: frozen.size,
    frozen: [...frozen.keys()],
    manifestPath: MANIFEST_REL,
  };
}

module.exports = { checkEngineFreeze, sha256OfCrStripped, MANIFEST_PATH, MANIFEST_REL, REPO_ROOT, ROOTS };

"""U1 (§125.3, ratified 2026-09-23; first carried at e293e45) — THE CODER'S CITATION SWEEP, tracked so the rule has its
mechanism. The rule: a tracked file may not cite an untracked one. The scope, as ruled: RULING files under .handoff and
INSTRUMENTS under .handoff/instruments that a TRACKED file cites — a citation matched as the TAIL of a filename (its
basename, its bare stem of ≥ 12 chars, or a truncated head of ≥ 12 chars ending at `_`/`-` followed by an ellipsis);
a generic basename (README.md) only with its directory; the cited instruments' import closure (local modules of the same
directory). A path too long for a Windows tree (over 259 chars with the repo root) is REPORTED and left ignored — git
refuses the add without core.longpaths, and a tracked path over the limit would break every Windows clone without it.

⚠ The rule is TRANSITIVE: files tracked by one run cite further untracked ones, so a second run finds a second wave.
Each run reports the wave it finds; whether a wave is tracked is the mothership's to rule, never applied by the sweep
on its own. Mail (.handoff/inbox), archives and the retired codex are never candidates.

  python scripts/u1-citation-sweep.py            # dry run: the wave, its bytes, the .gitignore block
  python scripts/u1-citation-sweep.py --apply    # regenerate the U1 block of .gitignore whole and print the files to `git add`
                                                # (a `# ── STANDING BY NAME` section after the block is preserved whole — USE-1)
"""
import io, json, os, re, subprocess, sys

R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(R)
ROOT_LEN = len(R.replace('\\', '/')) + 1
WINDOWS_LIMIT = 259

tracked = [t for t in subprocess.run(['git', 'ls-files'], capture_output=True, text=True, encoding='utf-8').stdout.split('\n') if t]
tracked_set = set(tracked)
texts = {}
for t in tracked:
    if t.endswith(('.obj', '.png', '.jpg', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.glb', '.bin', '.mp4', '.pdf', '.tsbuildinfo', '.lock')):
        continue
    if t == '.gitignore':
        continue  # the ignore file names things to ignore, never to cite
    try:
        texts[t] = io.open(t, encoding='utf-8', errors='replace').read()
    except Exception:
        pass

cands = []
for root, dirs, files in os.walk('.handoff'):
    rel = root.replace('\\', '/')
    if rel.startswith('.handoff/inbox') or '/_archive' in rel or '/archive' in rel or '__pycache__' in rel or '_retired' in rel:
        continue
    for f in files:
        p = f'{rel}/{f}'
        if p in tracked_set:
            continue
        is_ruling = rel == '.handoff' and 'RULING' in f and f.endswith('.md')
        is_instrument = rel.startswith('.handoff/instruments') and f.endswith(('.py', '.cjs', '.mjs', '.txt', '.md', '.json'))
        if is_ruling or is_instrument:
            cands.append(p)

GENERIC = {'README.md', 'index.md', 'results.txt'}
# every ruling and instrument on disk, tracked or not — a truncated head must name exactly ONE of them to count as a citation
family = []
for root, dirs, files in os.walk('.handoff'):
    rel = root.replace('\\', '/')
    if rel.startswith('.handoff/inbox') or '/_archive' in rel or '/archive' in rel or '__pycache__' in rel or '_retired' in rel:
        continue
    for f in files:
        if (rel == '.handoff' and 'RULING' in f and f.endswith('.md')) or rel.startswith('.handoff/instruments'):
            family.append(f.rsplit('.', 1)[0])
ambiguous = {}  # head → the files it could name (reported, never resolved by the sweep)


def cited_by(p):
    base = os.path.basename(p)
    if base in GENERIC:
        needle = '/'.join(p.split('/')[-2:])
        return sorted(t for t, txt in texts.items() if needle in txt)
    hits = set(t for t, txt in texts.items() if base in txt)
    stem = base.rsplit('.', 1)[0]
    if len(stem) >= 12:
        hits |= set(t for t, txt in texts.items() if stem in txt)
    for n in range(len(stem) - 1, 11, -1):  # a truncated citation: a head ending at a word boundary, followed by an ellipsis
        h = stem[:n]
        if not h.endswith(('_', '-')):
            continue
        citing = [t for t, txt in texts.items() if (h + '…') in txt or (h + '...') in txt]
        if not citing:
            continue
        named = [g for g in family if g.startswith(h)]
        if len(named) == 1:
            hits.update(citing)
        else:
            ambiguous[h] = sorted(set(named))
    return sorted(hits)


cited = {p: cited_by(p) for p in cands}
cited = {p: v for p, v in cited.items() if v}
closure = dict(cited)
changed = True
while changed:
    changed = False
    for p in list(closure):
        if not p.endswith('.py'):
            continue
        try:
            src = io.open(p, encoding='utf-8', errors='replace').read()
        except Exception:
            continue
        d = os.path.dirname(p)
        for m in re.finditer(r'^\s*(?:from\s+([A-Za-z_]\w*)\s+import|import\s+([A-Za-z_]\w*))', src, re.M):
            mod = m.group(1) or m.group(2)
            q = f'{d}/{mod}.py'
            if os.path.exists(q) and q not in tracked_set and q not in closure:
                closure[q] = [f'(imported by {os.path.basename(p)})']
                changed = True

too_long = sorted(p for p in closure if len(p) + ROOT_LEN > WINDOWS_LIMIT)
for p in too_long:
    closure.pop(p)
rulings = sorted(p for p in closure if p.startswith('.handoff/R') and p.count('/') == 1)
instruments = sorted(p for p in closure if p.startswith('.handoff/instruments/'))
results = [p for p in instruments if os.path.basename(p).startswith('RESULTS')]


def size(p):
    return os.path.getsize(p)


if ambiguous:
    print(f'AMBIGUOUS truncated citations — a head naming several files counts for none; reported: {json.dumps(ambiguous, ensure_ascii=False)}')
print(f'TOO LONG for this tree (over {WINDOWS_LIMIT} chars with the repo root; git refuses the add without core.longpaths) — cited but left ignored, reported: {too_long}')
print(f'candidates {len(cands)} · cited rulings {len(rulings)} ({sum(size(p) for p in rulings)} B) · cited instruments {len(instruments)} ({sum(size(p) for p in instruments)} B; of which RESULTS files, dated events cited by tracked files: {len(results)}; imported by a cited instrument: {sum(1 for p in instruments if closure[p][0].startswith("(imported"))}) · longest path {max((len(p) for p in closure), default=0)} chars')
for p in rulings + instruments:
    print(f'  {size(p):7d} B  {len(p):3d}  {p}  ← {closure[p][:3]}')

# the .gitignore block: every parent directory un-ignored and its children re-ignored before the file itself is negated —
# `.handoff/*` does not descend (the file's own warning), so a bare negation of a nested path would silently fail
lines = ['', '# ── U1 RECORD RIDER (§125.3, ratified 2026-09-23): a tracked file may not cite an untracked one. Every RULING file and every',
         '# INSTRUMENT a tracked file CITES (a citation matched as the tail of a filename — its basename, its stem, or a truncated head',
         '# followed by an ellipsis), with the cited instruments\' import closure, is tracked; uncited ones stay ignored until a tracked',
         '# file cites them; a RESULTS file (a dated event) only when cited. `.handoff/*` above does not descend, so each parent directory',
         '# is un-ignored and its children re-ignored before the file itself is negated. Generated by the coder\'s sweep,',
         '# scripts/u1-citation-sweep.py (`--apply` regenerates this block whole and prints the files to add); re-run it when a',
         '# tracked file cites a new one. First generated at the record commit of 2026-09-23 (e293e45).']
# the block carries EVERY tracked ruling and instrument as well, so a regeneration never drops what an earlier wave tracked
already = sorted(t for t in tracked if (t.startswith('.handoff/R') and t.count('/') == 1 and 'RULING' in t) or t.startswith('.handoff/instruments/'))
dirs_done = set()
for p in sorted(set(already) | set(closure)):
    parts = p.split('/')
    for depth in range(2, len(parts)):
        d = '/'.join(parts[:depth])
        if d in dirs_done:
            continue
        dirs_done.add(d)
        lines.append(f'!{d}/')
        lines.append(f'{d}/*')
    lines.append(f'!{p}')
block = '\n'.join(lines) + '\n'
if '--apply' in sys.argv:
    gi = io.open('.gitignore', encoding='utf-8', newline='').read()
    marker = '\n# ── U1 RECORD RIDER'
    # USE-1 (2026-09-25): a STANDING BY NAME section after this block — files tracked by a RULING, never by a citation (this sweep's
    # candidate predicate takes no .cmd/.ps1) — is carried whole across every regeneration; without it a by-name negation after the
    # block would be dropped at the next apply, and one before it re-ignored by the block's own `.handoff/instruments/*`
    standing_marker = '\n# ── STANDING BY NAME'
    standing = ''
    if standing_marker in gi:
        standing = gi[gi.index(standing_marker):]
        gi = gi[:gi.index(standing_marker)]
    if marker in gi:
        gi = gi[:gi.index(marker)]
    io.open('.gitignore', 'w', encoding='utf-8', newline='').write(gi.rstrip('\n') + '\n' + block + standing)
    print('.gitignore regenerated; the files to `git add`:')
    print(json.dumps(sorted(closure), ensure_ascii=False, indent=1))
else:
    print('--- the .gitignore block (dry run; the tracked ones kept, the new wave added):')
    print(block)

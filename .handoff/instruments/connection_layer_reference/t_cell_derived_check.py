"""
THE T CELL (E1, 2026-09-09) — the device's derived check, run by the mold-builder.

What is computed (and nothing about the subject matter):
  1. closure — every term of every relation and axiom is a role;
  2. declared properties against the cast's own instances (asymmetry, irreflexivity, per argument pair);
  3. the degree table (does it reproduce the caster's?);
  4. the automorphism reading, THREE-VALUED: a relation instance is KNOWN-TRUE, KNOWN-FALSE (the cast's
     ¬ rows) or UNRECORDED.  Closed-world (unrecorded = false) gives one number; open-world gives the
     envelope of permutations no known fact contradicts (an upper bound on Aut of every completion);
  5. the same with the `universality: n-substrate` field included as a TYPE, to show what reading a
     record-fact as a type does to the structure.
Sealed before the run:
  closure holds; every declared property holds; degrees reproduce; closed-world |Aut| = 1 (the caster's
  "rigid"); open-world envelope > 1 (the record is too partial to fix the group); including the
  substrate-count as a type SHRINKS the envelope (individuation on the record, which must not happen).
"""
import itertools, collections

R = [f"r{i}" for i in range(10)]
# unary types actually about the role (member-status omitted: identical 'has' on all ten, carries nothing)
TYPES = {
    "windowed": {"r1": True},                                   # others UNKNOWN
    "self-set": {"r7": True, "r8": False, "r0": False},         # r0 'not-applicable' read as ¬P (see letter)
}
WARRANT_AS_TYPE = {"universality": {"r0": 2, "r1": 2, "r2": 2, "r3": 2, "r4": 1, "r5": 1, "r6": 2, "r7": 1, "r8": 2, "r9": 1}}
ARITY = {"sustains": 2, "individuates": 2, "answers-to": 2, "outlasts": 2, "starts": 2, "removes": 3}
PROPS = {"sustains": ["asym"], "individuates": ["asym"], "answers-to": ["asym"], "outlasts": ["asym", "irrefl"],
         "starts": ["asym"], "removes": ["asym12"]}
# (type, tuple, polarity)
INST = [("sustains", ("r1", "r0"), True), ("sustains", ("r8", "r0"), False), ("sustains", ("r8", "r2"), True),
        ("outlasts", ("r2", "r0"), True), ("individuates", ("r4", "r0"), True), ("removes", ("r8", "r3", "r2"), True),
        ("starts", ("r6", "r1"), True), ("sustains", ("r6", "r0"), False), ("sustains", ("r9", "r1"), True),
        ("answers-to", ("r1", "r7"), True), ("starts", ("r5", "r1"), False)]
KNOWN = {(t, tup): pol for t, tup, pol in INST}

# 1 closure
terms = {x for _, tup, _ in INST for x in tup}
print(f"1. closure: every term a role -> {terms <= set(R)}   (terms: {sorted(terms)})")

# 2 declared properties on own instances
ok = True
for t, props in PROPS.items():
    pos = [tup for (tt, tup), pol in KNOWN.items() if tt == t and pol]
    if "asym" in props:
        for a, b in pos:
            if (b, a) in pos: ok = False; print(f"   asymmetry violated: {t}({a},{b}) and ({b},{a})")
    if "irrefl" in props:
        for a, b in pos:
            if a == b: ok = False; print(f"   irreflexivity violated: {t}({a},{a})")
    if "asym12" in props:
        for a, b, c in pos:
            if any(x == (b, a, c) for x in pos): ok = False; print(f"   asymmetry(1,2) violated in {t}")
print(f"2. declared properties hold on the cast's own instances -> {ok}")

# 3 degrees
deg = collections.Counter(x for _, tup, _ in INST for x in set(tup))
print("3. degrees:", dict(sorted(deg.items(), key=lambda kv: -kv[1])))

# 4 automorphism reading, three-valued
def value(t, tup, closed):
    v = KNOWN.get((t, tup))
    return (False if v is None else v) if closed else v
def tval(types, name, x, closed):
    v = types[name].get(x)
    return (False if v is None else v) if closed else v
def admissible(sigma, closed, types):
    s = dict(zip(R, sigma))
    for (t, tup), pol in KNOWN.items():
        img = value(t, tuple(s[x] for x in tup), closed)
        if img is not None and img != pol: return False
    if closed:   # closed world must also preserve absences: check every tuple both ways
        for t, ar in ARITY.items():
            for tup in itertools.product(R, repeat=ar):
                if value(t, tup, True) != value(t, tuple(s[x] for x in tup), True): return False
    for name in types:
        for x, v in types[name].items():
            img = tval(types, name, s[x], closed)
            if img is not None and img != v: return False
        if closed:
            for x in R:
                if tval(types, name, x, True) != tval(types, name, s[x], True): return False
    return True
def count(closed, types):
    n = 0; movers = collections.Counter(); examples = []
    for sigma in itertools.permutations(R):
        if admissible(sigma, closed, types):
            n += 1
            moved = tuple(sorted((x, y) for x, y in zip(R, sigma) if x != y))
            if moved and len(examples) < 6: examples.append(moved)
            for x, y in zip(R, sigma):
                if x != y: movers[x] += 1
    return n, movers, examples
n_closed, _, _ = count(True, TYPES)
n_open, movers, ex = count(False, TYPES)
print(f"4. |Aut| closed-world (unrecorded = false): {n_closed}")
print(f"   admissible permutations open-world (unrecorded = unknown): {n_open}")
print(f"   roles that some admissible permutation moves: {dict(movers)}")
print(f"   examples of admissible non-identity permutations (as moved pairs): {ex[:4]}")
# which single declarations would shrink the envelope most: for each admissible σ≠id, the known facts it
# carries onto UNRECORDED slots — declaring any of those slots (either way, if it contradicts) kills σ
slot_hits = collections.Counter()
for sigma in itertools.permutations(R):
    if sigma == tuple(R) or not admissible(sigma, False, TYPES): continue
    s = dict(zip(R, sigma))
    for (t, tup), pol in KNOWN.items():
        img = tuple(s[x] for x in tup)
        if (t, img) not in KNOWN: slot_hits[(t, img, "would need", not pol)] += 1
print("   the unrecorded slots most often relied on (declare these and the envelope collapses):")
for (t, img, _, needed), c in slot_hits.most_common(8):
    print(f"      {t}{img} — {c} permutations survive only because it is unrecorded (killed if declared {needed})")

# 5 the record-fact read as a type
n_open_w, _, _ = count(False, {**TYPES, **WARRANT_AS_TYPE})
n_closed_w, _, _ = count(True, {**TYPES, **WARRANT_AS_TYPE})
print(f"5. with `universality: n-substrate` read as a TYPE: open-world envelope {n_open} -> {n_open_w}; closed-world {n_closed} -> {n_closed_w}")
print("   (a smaller number here is individuation on how much was READ, not on the subject matter)")

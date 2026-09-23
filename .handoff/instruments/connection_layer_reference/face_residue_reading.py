"""THE FACE'S READING — the two definitions that gate C-5 (the mothership's 1529 §2), and the gen-2 question (§3).
Falsify, never confirm. SEALED BEFORE THE RUN; a seal that fires is kept in the results file.

A · THE STRUCTURE OF `Fix · Mov · Und` (random partial injections + the record's own first face)
  A1  dom h_A ⊆ dom J_AB                                              0 failures (the chain's first step — a theorem)
  A2  Fix ⊔ Mov = dom h_A  and  Und = R_A ∖ dom h_A                   0 failures (the decomposition IS a partition)
  A3  a role in NO edge's dom is never in Fix ∪ Mov                   0 failures
  A4  every Und role has EXACTLY ONE first-break edge                 0 failures (the address is well defined)
  A5  Und(h) ≠ Und(h⁻¹) on some triples                              > 0  — orientation is CONTENT, not convention
  A6  the person spoke on BOTH routes, they differ, and the role      > 0  — so Und is NOT "the person has not said"
      is still Und
B · DOES THE FACE COLIMIT EXIST?  It merges a ∼ h(a); if a corner's OWN record then says two things about one
    tuple, the colimit's record is not a function and THE FACE DOES NOT EXIST — though every edge was accepted.
    (Corner-local: both tuples are that corner's own, in that corner's own word, so no τ can rescue them. A
    SUFFICIENT condition for refusal, not a necessary one — a cross-corner contradiction needs the full colimit.)
  B1  on random casts carrying declared negatives: refusals occur     > 0  — the hazard is real
  B2  the record's own first face at base FLOW: refusals              0    — by construction: flow declares NO
                                                                           negative and every mark is `has`, so a
                                                                           merge can only ever add `holds`
  B3  at base T (3 declared negatives, 10 roles): NOT SEALED — I have no derivation either way; the run rules.
C · GEN-2: IS THE COLIMIT ASSOCIATIVE ACROSS GENERATIONS?
  C1  diagram FIXED (the three gen-0 acts): the two orders agree      0 failures — both are colimits of ONE diagram
  C2  a FRESH act given at gen 1: the two orders differ               > 0  — and that is not non-associativity;
                                                                           it is two different acts
"""
import os, random, itertools, collections
from inside_midpoint_trace import load, MOLD_TYPE, mold_join

def inv(f): return {v: k for k, v in f.items()}
def comp(g, f): return {x: g[y] for x, y in f.items() if y in g}     # (g∘f)(x) = g(f(x)) — f first (0031 §1.4)

def residue(J_AB, J_BC, J_CA): return comp(J_CA, comp(J_BC, J_AB))   # the loop A→B→C→A, based at A
def decompose(h, R):
    return (sorted(x for x, y in h.items() if x == y), sorted(x for x, y in h.items() if x != y), sorted(set(R) - set(h)))
def first_break(a, J_AB, J_BC, J_CA):
    """the ONE edge at which a's own circuit ran out — or None if it returned"""
    if a not in J_AB: return "A–B"
    b = J_AB[a]
    if b not in J_BC: return "B–C"
    if J_BC[b] not in J_CA: return "C–A"
    return None

# ─── A · the structure ────────────────────────────────────────────────────────────────────────────────────
def part_A(trials=20000, seed=220):
    rng = random.Random(seed); R_A, R_B, R_C = [f"a{i}" for i in range(6)], [f"b{i}" for i in range(6)], [f"c{i}" for i in range(6)]
    def rnd(s, d):
        xs = rng.sample(s, rng.randint(0, len(s))); return dict(zip(xs, rng.sample(d, len(xs))))
    bad = collections.Counter(); hit = collections.Counter()
    for _ in range(trials):
        J_AB, J_BC, J_CA = rnd(R_A, R_B), rnd(R_B, R_C), rnd(R_C, R_A)
        h = residue(J_AB, J_BC, J_CA); fix, mov, und = decompose(h, R_A)
        if not set(h) <= set(J_AB): bad["A1"] += 1
        if set(fix) | set(mov) != set(h) or set(und) != set(R_A) - set(h): bad["A2"] += 1
        touched = set(J_AB) | set(inv(J_CA))
        if any(a not in touched for a in fix + mov): bad["A3"] += 1
        if any(first_break(a, J_AB, J_BC, J_CA) is None for a in und) or any(first_break(a, J_AB, J_BC, J_CA) is not None for a in h): bad["A4"] += 1
        hi = inv(h)                                                   # the same face walked the other way
        if set(R_A) - set(hi) != set(und): hit["A5"] += 1
        proj = comp(inv(J_BC), inv(J_CA))                             # A→C→B, the route through C
        for a in und:
            if a in proj and a in J_AB and proj[a] != J_AB[a]: hit["A6"] += 1; break
    print(f"A · {trials} random triples of partial injections (6+6+6 roles)")
    for k, sealed in (("A1", 0), ("A2", 0), ("A3", 0), ("A4", 0)):
        print(f"   {k}: failures {bad[k]:6d}   sealed {sealed}   {'✔' if bad[k] == sealed else '⛔ SEAL FIRED'}")
    for k in ("A5", "A6"):
        print(f"   {k}: occurrences {hit[k]:6d}   sealed > 0   {'✔' if hit[k] > 0 else '⛔ SEAL FIRED'}")

# ─── B · does the face colimit exist? ─────────────────────────────────────────────────────────────────────
def corner_local_refusals(X, h):
    """merge a ∼ h(a) inside X's OWN record; list every tuple the merge makes say two things"""
    par = {r: r for r in X["roles"]}
    def find(x):
        while par[x] != x: par[x] = par[par[x]]; x = par[x]
        return x
    for a, b in h.items():
        ra, rb = find(a), find(b)
        if ra != rb: par[ra] = rb
    seen, out = {}, []
    def culprit(t1, t2):   # the merged pair(s) that collapsed two distinct tuples into one
        return " · ".join(f"{x}≡{y}" for x, y in zip(t1, t2) if x != y) or "the same tuple"
    for (t, tup), v in X["rec"].items():
        k = (t, tuple(find(x) for x in tup))
        if k in seen and seen[k][0] != v:
            out.append(f"{t}{tup}={v} against {t}{seen[k][1]}={seen[k][0]} — once {culprit(tup, seen[k][1])}, one tuple with two values")
        else: seen[k] = (v, tup)
    for (k, x), v in X["marks"].items():
        if v == "UNKNOWN": continue
        key = ("MARK", k, find(x))
        if key in seen:
            # AMENDED 2026-09-23 (the coder's line 6, relayed in the mothership's 1008 §2.1): this compared RAW (`v != seen`),
            # which refuses `has × unrecorded` — the very fabricated refusal I found on 09-22 and ruled away (MOLD v4 §2.1;
            # castLoader `valuesAgree`), re-committed in my own next instrument. The mold's type goes through the join.
            joined = mold_join(seen[key][0], v) if k == MOLD_TYPE else (v if v == seen[key][0] else None)
            if joined is None: out.append(f"{k}({x})={v} against {seen[key][1]}={seen[key][0]} on one merged role")
            else: seen[key] = (joined, x)
        else: seen[key] = (v, x)
    return out

def part_B_random(trials=4000, seed=221):
    rng = random.Random(seed); R = [f"x{i}" for i in range(6)]; hits = 0; example = None
    for _ in range(trials):
        rec = {}
        for _ in range(8):
            t = rng.choice(["p", "q"]); tup = (rng.choice(R), rng.choice(R))
            rec[(t, tup)] = rng.choice(["holds", "does-not-hold"])
        X = {"name": "rnd", "roles": R, "sig": {"p": 2, "q": 2}, "rec": rec, "marks": {}, "axioms": 0, "warrant": False}
        moved = rng.sample(R, 2); h = {moved[0]: moved[1]}
        r = corner_local_refusals(X, h)
        if r:
            hits += 1
            if example is None: example = (dict(rec), h, r[0])
    print(f"\nB1 · {trials} random corners carrying declared negatives, one Mov pair each: refusals {hits}   sealed > 0   {'✔' if hits else '⛔ SEAL FIRED'}")
    if example: print(f"     one instance: merging {example[1]} makes the corner's own record say — {example[2]}")

def part_B_first_face(C):
    """the record's own first face: Flow · Φ · T, the hand triples, at all three bases"""
    HAND_TF = {"A": {"r9":"F8","r1":"F7","r0":"F1","r2":"F12","r8":"F13"}, "B'": {"r9":"F3","r1":"F9","r0":"F5","r7":"F13","r8":"F1","r2":"F7"},
               "C": {"r9":"F12","r1":"F13","r0":"F9","r6":"F1","r2":"F3"}, "D": {"r9":"F12","r1":"F1","r0":"F2","r7":"F7","r2":"F5"},
               "S1": {"r0":"F13","r1":"F9","r2":"F1","r4":"F12","r6":"F3","r8":"F7"}, "S4": {"r0":"F13","r1":"F9","r2":"F1","r6":"F3","r7":"F5","r8":"F7"},
               "S2": {"r0":"F9","r1":"F3","r2":"F13","r6":"F10","r7":"F5","r8":"F12"}}
    HAND_TP = {"P": {"r0":"Φ1","r1":"Φ2","r2":"Φ7","r4":"Φ5","r6":"Φ3"}, "Q": {"r9":"Φ6","r1":"Φ1","r0":"Φ8","r7":"Φ5","r6":"Φ2"},
               "R": {"r0":"Φ1","r1":"Φ6","r7":"Φ5","r2":"Φ7","r4":"Φ8"}}
    J_FP = {"(i)": {"F7":"Φ1","F8":"Φ2","F5":"Φ7"}, "(ii)": {"F1":"Φ3","F2":"Φ2","F3":"Φ4","F5":"Φ1"}}
    print("\nB2/B3 · the record's own first face (Flow · Φ · T) — the corner-local check at all three bases")
    tot = collections.Counter(); movs = collections.Counter()
    for fp, tf, tp in itertools.product(J_FP, HAND_TF, HAND_TP):
        J_FT, J_TP, J_PF = inv(HAND_TF[tf]), HAND_TP[tp], inv(J_FP[fp])
        bases = {"flow": (C["flow"], residue(J_FT, J_TP, J_PF)),                     # F→T→Φ→F
                 "t-cell": (C["t-cell"], residue(J_TP, J_PF, J_FT)),                 # T→Φ→F→T
                 "phi": (C["phi"], residue(J_PF, J_FT, J_TP))}                       # Φ→F→T→Φ
        for nm, (X, h) in bases.items():
            mov = [ (a,b) for a,b in h.items() if a != b ]
            movs[nm] += len(mov)
            r = corner_local_refusals(X, h)
            tot[nm] += len(r)
            if r: print(f"     ⇒ {nm} under ({fp}+{tf}+{tp}): Mov {mov} → {len(r)} refusal(s): {r[0]}")
    for nm in ("flow", "t-cell", "phi"):
        print(f"     {nm:7s}: {movs[nm]} Mov pairs over {2*len(HAND_TF)*len(HAND_TP)} triples → {tot[nm]} corner-local refusals"
              + ("   sealed 0 ✔" if nm == "flow" and tot[nm] == 0 else ("   ⛔ SEAL FIRED" if nm == "flow" else "   (not sealed — the run rules)")))
    print(f"     flow declares {sum(1 for v in C['flow']['rec'].values() if v=='does-not-hold')} negatives and "
          f"{len({v for v in C['flow']['marks'].values()})} distinct mark value(s) — the reason B2 could not have fired")
    print(f"     t-cell declares {sum(1 for v in C['t-cell']['rec'].values() if v=='does-not-hold')} negatives; "
          f"phi declares {sum(1 for v in C['phi']['rec'].values() if v=='does-not-hold')}")

# ─── C · gen-2: two orders, one diagram ───────────────────────────────────────────────────────────────────
def glue_classes(carrier, pairs):
    """one honest pushout step: `carrier` = a list of current classes (frozensets of tagged roles);
    `pairs` = (tagged, tagged) to identify. Returns the new class list."""
    par = {}
    def find(x):
        par.setdefault(x, x)
        while par[x] != x: par[x] = par[par[x]]; x = par[x]
        return x
    rep = {}
    for cls in carrier:
        r = None
        for m in cls: r = find(m) if r is None else (par.__setitem__(find(m), r) or r)
        for m in cls: rep[m] = r
    for x, y in pairs:
        rx, ry = find(x), find(y)
        if rx != ry: par[rx] = ry
    out = collections.defaultdict(set)
    for m in list(par): out[find(m)].add(m)
    return [frozenset(v) for v in out.values()]

def classes_of(tagged_sets): return frozenset(tagged_sets)

def part_C(trials=3000, seed=222):
    """TWO GENUINELY DIFFERENT CONSTRUCTIONS, not one expression compared to itself:
       ORDER 1  M_AB first, then C glued onto it along J_BC   (the child of A—B meets C)
       ORDER 2  M_BC first, then A glued onto it along J_AB   (the child of B—C meets A)
       CONTROL  order 2 built with the second step's induced map taken WRONG (the raw role, not its class'
                member) — if even that agrees, the comparison cannot detect a difference and proves nothing."""
    rng = random.Random(seed); R_A, R_B, R_C = [f"a{i}" for i in range(5)], [f"b{i}" for i in range(5)], [f"c{i}" for i in range(5)]
    def rnd(s, d):
        xs = rng.sample(s, rng.randint(0, len(s))); return dict(zip(xs, rng.sample(d, len(xs))))
    singles = lambda: [frozenset({("A", r)}) for r in R_A] + [frozenset({("B", r)}) for r in R_B] + [frozenset({("C", r)}) for r in R_C]
    diff_fixed = diff_fresh = diff_control = 0
    for _ in range(trials):
        J_AB, J_BC = rnd(R_A, R_B), rnd(R_B, R_C)
        one = glue_classes(glue_classes(singles(), [(("A", a), ("B", b)) for a, b in J_AB.items()]),
                           [(("B", b), ("C", c)) for b, c in J_BC.items()])
        two = glue_classes(glue_classes(singles(), [(("B", b), ("C", c)) for b, c in J_BC.items()]),
                           [(("A", a), ("B", b)) for a, b in J_AB.items()])
        if classes_of(one) != classes_of(two): diff_fixed += 1
        ctrl = glue_classes(glue_classes(singles(), [(("B", b), ("C", c)) for b, c in J_BC.items()]),
                            [(("A", a), ("C", J_BC[b])) for a, b in J_AB.items() if b in J_BC][:1])  # a mis-induced second step
        if classes_of(one) != classes_of(ctrl): diff_control += 1
        # a FRESH act given at gen 1 — a pair on the A—M_BC edge that the gen-0 acts do not induce
        fresh = [(("A", rng.choice(R_A)), ("C", rng.choice(R_C)))]
        if classes_of(glue_classes(one, fresh)) != classes_of(one): diff_fresh += 1
    print(f"\nC · {trials} random spans, two constructions built separately")
    print(f"   C1: ORDER 1 ≠ ORDER 2 with the diagram FIXED:     {diff_fixed}   sealed 0   {'✔' if diff_fixed == 0 else '⛔ SEAL FIRED'}")
    print(f"   control: a MIS-INDUCED second step differs:        {diff_control}   sealed > 0   {'✔' if diff_control else '⛔ the comparison is blind — C1 proves nothing'}")
    print(f"   C2: a FRESH gen-1 act changes the result:          {diff_fresh}   sealed > 0   {'✔' if diff_fresh else '⛔ SEAL FIRED'}")

if __name__ == "__main__":
    C = {n: load(n) for n in ["flow", "phi", "t-cell"]}
    part_A(); part_B_random(); part_B_first_face(C); part_C()

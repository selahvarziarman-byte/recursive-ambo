"""
THE FIRST FACE AND THE TOWER — Flow · Φ · T — the instrument behind ADR 0031 §4 and §3.5.
Self-standing (loads hinge_data.py beside it; T's cast is embedded). Three-valued record throughout:
  a T negative CONFLICTS with a listed Flow/Φ tuple; silence is exposure; weight counts known agreements.

What it computes, with the sealed expectations (hand-derived 2026-09-10; a disagreement is a finding):
  1. candidate identifications T–Flow and T–Φ (exhaustive |J| <= 4; |J| = 5 sampled)      sealed: max weight 4 on both;
     the hand candidates A–E, P–R admissible; B (r8≡F2, r0≡F5) REFUSED by ¬sustains(r8,r0) vs generates(F2,F5);
     r7≡Φ9 refused by member-status.
  2. the seven combinations' residues at base Flow, as Fix · Mov · Und and cycle–path type    sealed: (i)+A+P gives
     paths F1→F7→F8→⊥, F12→F5→⊥, F13→⊥; (i)+A+Q gives 1_{F7}; (i)+B'+P contains the 2-cycle (F5 F7).
  3. the MEET of the residues over the admissible triples                                    sealed: 0.
  4. the tower at generation 1 (branch (i)): corner triangles flat; the medial triangle's holonomy = h   sealed: exact.
  5. the face's cone-deficit under (i)+A+P                                                 sealed: 3 extra gluings? (see note)
"""
import os, itertools, collections, random, time
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, "hinge_data.py"), encoding="utf-8").read())   # F, FR, PHI, PR

# ---------------- corners as three-valued records ----------------
def rel_index(R):
    d = collections.defaultdict(set)
    for t, a, b in R: d[t].add((a, b))
    return d
FLOW = {"roles": F, "rel": rel_index(FR), "neg": collections.defaultdict(set),
        "types": {"member-status": {r: "has" for r in F}}}
PHIC = {"roles": PHI, "rel": rel_index(PR), "neg": collections.defaultdict(set),
        "types": {"member-status": {**{f"Φ{i}": "has" for i in range(1, 9)}, "Φ9": "none-by-nature"}}}
T_ROLES = [f"r{i}" for i in range(10)]
T_INST = [("sustains", ("r1", "r0"), True), ("sustains", ("r8", "r0"), False), ("sustains", ("r8", "r2"), True),
          ("outlasts", ("r2", "r0"), True), ("individuates", ("r4", "r0"), True), ("removes", ("r8", "r3", "r2"), True),
          ("starts", ("r6", "r1"), True), ("sustains", ("r6", "r0"), False), ("sustains", ("r9", "r1"), True),
          ("answers-to", ("r1", "r7"), True), ("starts", ("r5", "r1"), False)]
TC = {"roles": T_ROLES, "rel": collections.defaultdict(set), "neg": collections.defaultdict(set),
      "types": {"member-status": {r: "has" for r in T_ROLES}}}
for t, tup, pol in T_INST:
    (TC["rel"] if pol else TC["neg"])[t].add(tup)

# ---------------- candidate identifications (three-valued) ----------------
def best_translation(p, X):
    """p: dict T-role -> X-role (partial injection). Returns (weight, tau, conflict_free, exposure)."""
    D = set(p)
    cand = {}
    for sigma in set(TC["rel"]) | set(TC["neg"]):
        pos = [tup for tup in TC["rel"].get(sigma, ()) if set(tup) <= D]
        neg = [tup for tup in TC["neg"].get(sigma, ()) if set(tup) <= D]
        if not pos and not neg: continue
        for rho, Xt in X["rel"].items():
            if any(len(tup) != 2 for tup in pos + neg): continue        # no 3-place types on the other side
            if any(tuple(p[x] for x in tup) in Xt for tup in neg): continue   # a T negative against a listed tuple: CONFLICT
            m = sum(1 for tup in pos if tuple(p[x] for x in tup) in Xt)
            if m > 0: cand.setdefault(sigma, []).append((rho, m))
    sigmas = sorted(cand, key=lambda s: -max(m for _, m in cand[s]))
    best = [0, {}]
    def rec(i, used, w, m):
        if w + sum(max(mm for _, mm in cand[s]) for s in sigmas[i:]) <= best[0]: return
        if i == len(sigmas):
            if w > best[0]: best[0], best[1] = w, dict(m)
            return
        s = sigmas[i]
        for rho, mm in cand[s]:
            if rho not in used:
                m[s] = rho; used.add(rho); rec(i + 1, used, w + mm, m); used.discard(rho); del m[s]
        rec(i + 1, used, w, m)
    rec(0, set(), 0, {})
    tau = best[1]
    # exposure: X-listed tuples among the image in translated types that T does not assert
    img = set(p.values()); inv = {v: k for k, v in p.items()}
    exposure = 0
    for sigma, rho in tau.items():
        for (x, y) in X["rel"][rho]:
            if x in img and y in img and (inv[x], inv[y]) not in TC["rel"].get(sigma, ()): exposure += 1
    # types: member-status must agree where both known
    for r, x in p.items():
        if TC["types"]["member-status"][r] != X["types"]["member-status"].get(x, TC["types"]["member-status"][r]):
            return 0, {}, False, exposure
    return best[0], tau, True, exposure

def search(X, name, kmax=4, sample_seconds=45):
    print(f"\n=== candidates T – {name} ===")
    best = {}
    t0 = time.time()
    for k in range(2, kmax + 1):
        for D in itertools.combinations(T_ROLES, k):
            for img in itertools.permutations(X["roles"], k):
                p = dict(zip(D, img)); w, tau, ok, ex = best_translation(p, X)
                if ok and w > 0 and (k not in best or w > best[k][0]): best[k] = (w, p, tau, ex)
        print(f"  |J| = {k}: exhaustive, best weight {best.get(k, (0,))[0]}   ({time.time()-t0:.0f}s)")
    rng = random.Random(1); n = 0; t1 = time.time()
    while time.time() - t1 < sample_seconds:
        D = rng.sample(T_ROLES, 5); img = rng.sample(X["roles"], 5); p = dict(zip(D, img)); n += 1
        w, tau, ok, ex = best_translation(p, X)
        if ok and w > 0 and (5 not in best or w > best[5][0]): best[5] = (w, p, tau, ex)
    print(f"  |J| = 5: SAMPLED {n}; best weight {best.get(5, (0,))[0]}")
    for k in sorted(best):
        w, p, tau, ex = best[k]; print(f"  size {k}: weight {w} exposure {ex} pairs {p} tau {tau}")
    return best

# the hand candidates (T-role -> other role) and their translations
HAND = {
 "A":  ({"r9": "F8", "r1": "F7", "r0": "F1", "r2": "F12", "r8": "F13"}, FLOW),
 "B":  ({"r9": "F3", "r1": "F9", "r0": "F5", "r7": "F13", "r8": "F2", "r2": "F4"}, FLOW),     # expected REFUSED
 "B'": ({"r9": "F3", "r1": "F9", "r0": "F5", "r7": "F13", "r8": "F1", "r2": "F7"}, FLOW),
 "C":  ({"r9": "F12", "r1": "F13", "r0": "F9", "r6": "F1", "r2": "F3"}, FLOW),
 "D":  ({"r9": "F12", "r1": "F1", "r0": "F2", "r7": "F7", "r2": "F5"}, FLOW),
 "E":  ({"r9": "F9", "r1": "F13", "r0": "F12", "r6": "F1", "r8": "F8", "r2": "F7"}, FLOW),
 "P":  ({"r0": "Φ1", "r1": "Φ2", "r2": "Φ7", "r4": "Φ5", "r6": "Φ3"}, PHIC),
 "P5": ({"r0": "Φ1", "r1": "Φ2", "r2": "Φ7", "r4": "Φ5", "r6": "Φ3", "r7": "Φ9"}, PHIC),        # expected REFUSED (member-status)
 "Q":  ({"r9": "Φ6", "r1": "Φ1", "r0": "Φ8", "r7": "Φ5", "r6": "Φ2"}, PHIC),
 "R":  ({"r0": "Φ1", "r1": "Φ6", "r7": "Φ5", "r2": "Φ7", "r4": "Φ8"}, PHIC),
 # the weight-5 T–Flow candidates the exhaustive search found (2026-09-10, browser port) — the hand search had missed F13 as r0's anchor
 "S1": ({"r0": "F13", "r1": "F9", "r2": "F1", "r4": "F12", "r6": "F3", "r8": "F7"}, FLOW),
 "S4": ({"r0": "F13", "r1": "F9", "r2": "F1", "r6": "F3", "r7": "F5", "r8": "F7"}, FLOW),
 "S2": ({"r0": "F9", "r1": "F3", "r2": "F13", "r6": "F10", "r7": "F5", "r8": "F12"}, FLOW),   # S3 = S2 with r6≡F11: the F10/F11 twins, one candidate up to Aut(Flow)
}
print("=== the hand candidates, re-evaluated under the three-valued rule ===")
for name, (p, X) in HAND.items():
    w, tau, ok, ex = best_translation(p, X)
    print(f"  {name:3s}: {'ADMISSIBLE' if ok and w > 0 else 'REFUSED   '} weight {w} exposure {ex} tau {tau}")

# ---------------- residues at base Flow ----------------
def inv(d): return {v: k for k, v in d.items()}
def comp(f, g): return {x: g[y] for x, y in f.items() if y in g}          # f then g
J_FPHI = {"(i)": {"F7": "Φ1", "F8": "Φ2", "F5": "Φ7"}, "(ii)": {"F1": "Φ3", "F2": "Φ2", "F3": "Φ4", "F5": "Φ1"}}
def decompose(h, X):
    fix = sorted(x for x, y in h.items() if x == y); mov = sorted(x for x, y in h.items() if x != y)
    und = sorted(set(X) - set(h)); return fix, mov, und
def cycle_path_type(h, X):
    seen = set(); cycles = []; paths = []
    for x in X:
        if x in seen or x in h.values() and x not in h: continue
        if x in seen: continue
        if x not in h.values():              # a path starts outside the image
            chain = [x]
            while chain[-1] in h: chain.append(h[chain[-1]])
            for c in chain: seen.add(c)
            paths.append(len(chain) - 1)
    for x in X:
        if x in seen or x not in h: continue
        c = [x]; y = h[x]
        while y != x: c.append(y); y = h[y]
        for z in c: seen.add(z)
        cycles.append(len(c))
    return sorted(cycles), sorted(paths)
COMBOS = [("(i)", "A", "P"), ("(i)", "A", "Q"), ("(i)", "A", "R"), ("(ii)", "A", "P"), ("(i)", "D", "P"), ("(i)", "C", "P"), ("(i)", "B'", "P")] + \
         [(fphi, ft, tphi) for ft in ("S1", "S4", "S2") for fphi in ("(i)", "(ii)") for tphi in ("P", "Q", "R")]
print("\n=== residues at base Flow (Flow -> T -> Φ -> Flow) ===")
residues = {}
for fphi, ft, tphi in COMBOS:
    j_ft = inv(HAND[ft][0])                       # Flow -> T
    j_tphi = HAND[tphi][0]                        # T -> Φ
    j_phif = inv(J_FPHI[fphi])                    # Φ -> Flow
    h = comp(comp(j_ft, j_tphi), j_phif)
    residues[(fphi, ft, tphi)] = h
    fix, mov, und = decompose(h, F)
    print(f"  {fphi}+{ft}+{tphi}: Fix {fix} Mov {[(x, h[x]) for x in mov]} Und(of those that set out) {sorted(set(j_ft) - set(h))}  cycle/path type {cycle_path_type(h, sorted(set(j_ft)))}")
# the meet over the combos
meet = None
for h in residues.values():
    meet = dict(h) if meet is None else {x: y for x, y in meet.items() if h.get(x) == y}
print(f"  MEET over the seven combinations: {meet}   (sealed: {{}} i.e. 0)")

# ---------------- the tower at generation 1, branch (i) ----------------
def pushout(A, B, J):
    """A, B: role lists; J: dict A-role -> B-role. Returns (classes, iA, iB) with classes as frozensets of tagged roles."""
    parent = {}
    def find(x):
        while parent.get(x, x) != x: x = parent[x]
        return x
    def union(x, y):
        rx, ry = find(x), find(y)
        if rx != ry: parent[rx] = ry
    for a in A: parent[("A", a)] = ("A", a)
    for b in B: parent[("B", b)] = ("B", b)
    for a, b in J.items(): union(("A", a), ("B", b))
    iA = {a: find(("A", a)) for a in A}; iB = {b: find(("B", b)) for b in B}
    return set(iA.values()) | set(iB.values()), iA, iB
def check_tower(fphi, ft, tphi):
    A, B, C = F, T_ROLES, PHI
    J_AB = inv(HAND[ft][0]); J_BC = HAND[tphi][0]; J_CA = inv(J_FPHI[fphi])
    M_AB, a_in_AB, b_in_AB = pushout(A, B, J_AB)
    M_BC, b_in_BC, c_in_BC = pushout(B, C, J_BC)
    M_CA, c_in_CA, a_in_CA = pushout(C, A, J_CA)
    # corner triangle at A: A -> M_AB -> M_CA -> A, medial edge = identity on A's classes
    def partial_inverse(m): return inv(m)
    corner = {}
    for a in A:
        x = a_in_AB[a]                                   # in M_AB
        # medial edge M_AB -> M_CA carries 1_A: defined iff x is the class of an A-role
        pre = [aa for aa in A if a_in_AB[aa] == x]
        if not pre: continue
        y = a_in_CA[pre[0]]
        back = [aa for aa in A if a_in_CA[aa] == y]
        if back: corner[a] = back[0]
    flat = all(corner.get(a) == a for a in A)
    # medial triangle M_AB -> M_BC -> M_CA -> M_AB (the orientation of h = J_CA J_BC J_AB; the reverse order yields h⁻¹ —
    # corrected 2026-09-10 after the browser port caught it), each edge the identity on the shared corner's classes; read on A
    med = {}
    for a in A:
        x = a_in_AB[a]
        # M_AB -> M_BC (shared B): x must be the class of a B-role in M_AB
        preB = [b for b in B if b_in_AB[b] == x]
        if not preB: continue
        z = b_in_BC[preB[0]]
        # M_BC -> M_CA (shared C): z must be the class of a C-role in M_BC
        preC = [c for c in C if c_in_BC[c] == z]
        if not preC: continue
        y = c_in_CA[preC[0]]
        # M_CA -> M_AB (shared A): y must be the class of an A-role in M_CA
        preA = [aa for aa in A if a_in_CA[aa] == y]
        if preA: med[a] = preA[0]
    h = residues[(fphi, ft, tphi)]
    # compare on A: the medial triangle should reproduce h (up to the classes' representatives)
    same = all(med.get(a) == h.get(a) for a in set(h) | set(med))
    # the face colimit and the cone-deficit
    parent = {}
    def find(x):
        while parent.get(x, x) != x: x = parent[x]
        return x
    def union(x, y):
        rx, ry = find(x), find(y)
        if rx != ry: parent[rx] = ry
    for a in A: parent[("A", a)] = ("A", a)
    for b in B: parent[("B", b)] = ("B", b)
    for c in C: parent[("C", c)] = ("C", c)
    for a, b in J_AB.items(): union(("A", a), ("B", b))
    for b, c in J_BC.items(): union(("B", b), ("C", c))
    for c, a in J_CA.items(): union(("C", c), ("A", a))
    colim = len({find(x) for x in parent})
    # the cone-deficit is PER CORNER: |R_A| - |image of R_A in the face colimit| — the number of A's roles the face merges
    # into others. (The earlier "independent tally - |colimit|" was wrong: the loop's transitive identifications are already
    # in the tally; that difference counts roles returning UNCHANGED, not the gluings. Corrected 2026-09-10.)
    classes_A = len({find(("A", a)) for a in A})
    print(f"  {fphi}+{ft}+{tphi}: corner triangle flat: {flat}; medial triangle = h: {same}; |face colimit| = {colim}; "
          f"cone-deficit at A = {len(A) - classes_A}")
print("\n=== the tower at generation 1, branch (i) ===")
for combo in COMBOS: check_tower(*combo)

if __name__ == "__main__":
    search(FLOW, "Flow"); search(PHIC, "Φ")

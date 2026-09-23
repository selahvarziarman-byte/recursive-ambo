"""§3.5 against ADR 0028 — is the derivation rule LOAD-BEARING? (the mothership's 1705 §3, asked before it rules)
ADR 0028 §1 (ratified 2026-09-01) sorts every cell a gesture mints: CARRIED (the refined path's composite is FORCED equal
to the old transport; old loops' residues invariant) · COMPOSED (born of an old incidence with a determinate birth-
correspondence) · BORN (no determining correspondence — a TRUE ABSENCE, the person's to give, never the machine's).
0031 §3.5 (mine, 2026-09-10) says "No identification is given above generation 0" — every gen-1 J composed. This file
measures, at gen 1 of one face A, B, C, which part of which edge is which. SEALED BEFORE THE RUN:

  G1  CORNER edge (A — M_AB) carries ι_A, and the refined composite ι_B⁻¹∘ι_A = J_AB            0 failures (CARRIED)
  G2  a corner edge has NO free slot: ι_A is total on A and onto its image, so every            0 survivors
      candidate fresh pair collides with it (an act there can only be an act on J_AB itself)
      CONTROL: a MEDIAL edge (M_AB — M_CA) HAS free slots                                        > 0
  G3  the medial edge's identity on the SHARED corner A cannot be withdrawn: it is A's own       0 failures (COMPOSED)
      role on both sides (both midpoints are born of edges containing A)
  G4  the tower with the born room EMPTY: the medial residue on M_AB's A-part = ι_A∘h_A∘ι_A⁻¹   0 failures
  G5  ANOMALY MATCHING (0028 §1.1): the refined boundary, composed from CORNER edges only,       0 failures
      equals h_A — CONTROL: a mis-refined corner edge breaks it                                  > 0
      (the born act lives on a MEDIAL edge and is not an argument of the boundary: structural, stated not measured)
      a BORN act (a pair beyond the shared corner) moves the MEDIAL residue                      > 0 (the born room)
  G6  where the born act has a gen-0 TWIN (the same pair made on B — C is a partial injection
      there), the FACE's glued world (the partition of A ⊔ B ⊔ C) is the same                   0 differ
      … and a born act that MOVES a residue never has a gen-0 twin                               0 failures
      [REVISED BEFORE THE FIRST RUN: my first draft sealed "the medial residues of born act vs twin differ > 0" — my own
       analysis says the born pair enters the medial circuit at M_AB only when c ∈ im J_BC, exactly when the twin is
       NOT a partial injection; so the two never meet on that residue, and that seal would have compared two nothings]
  G7  ORDER IS CONTENT, BY DEPENDENCY: a born act is made on spaces gen-0 acts define —
      (a) born act first, then a gen-0 act on J_AB: the medial J stops being a partial          > 0
          injection (the later act BREAKS the earlier one)
      (b) the same gen-0 act first: the born act has no free slot any more (it is REFUSED)       > 0
"""
import random, collections

def midpoint(X, Y, tx, ty, J):
    """the pushout of role sets over J : X ⇀ Y — classes of tagged roles; ι maps into them (total)"""
    par = {}
    def find(z):
        par.setdefault(z, z)
        while par[z] != z: par[z] = par[par[z]]; z = par[z]
        return z
    for x in X: find((tx, x))
    for y in Y: find((ty, y))
    for x, y in J.items():
        a, b = find((tx, x)), find((ty, y))
        if a != b: par[a] = b
    cls = collections.defaultdict(set)
    for z in list(par): cls[find(z)].add(z)
    of = {z: frozenset(cls[find(z)]) for z in par}
    return {"roles": set(of.values()), "iota": {tx: {x: of[(tx, x)] for x in X}, ty: {y: of[(ty, y)] for y in Y}}}

def inv(f): return {v: k for k, v in f.items()}
def comp(g, f): return {x: g[y] for x, y in f.items() if y in g}                 # g∘f, f first
def is_pinj(pairs):
    """a list of (x, y) pairs is a partial injection iff no x twice and no y twice"""
    xs = [x for x, _ in pairs]; ys = [y for _, y in pairs]
    return len(set(xs)) == len(xs) and len(set(ys)) == len(ys)

def medial(M1, M2, shared):
    """the COMPOSED part of the medial edge M1 — M2: the identity on the shared corner's roles (its own, both sides)"""
    return {M1["iota"][shared][x]: M2["iota"][shared][x] for x in M1["iota"][shared]}

def run(trials=4000, seed=231, n=5):
    rng = random.Random(seed); A, B, C = [f"a{i}" for i in range(n)], [f"b{i}" for i in range(n)], [f"c{i}" for i in range(n)]
    def rnd(s, d):
        xs = rng.sample(s, rng.randint(0, len(s))); return dict(zip(xs, rng.sample(d, len(xs))))
    bad = collections.Counter(); hit = collections.Counter(); tried = collections.Counter()
    for _ in range(trials):
        J_AB, J_BC, J_CA = rnd(A, B), rnd(B, C), rnd(C, A)
        M_AB, M_BC, M_CA = midpoint(A, B, "A", "B", J_AB), midpoint(B, C, "B", "C", J_BC), midpoint(C, A, "C", "A", J_CA)
        iA, iB = M_AB["iota"]["A"], M_AB["iota"]["B"]
        # G1 — CARRIED: the refined path A → M_AB → B composes to J_AB
        if comp(inv(iB), iA) != J_AB: bad["G1"] += 1
        # G2 — the corner edge has no free slot; the medial edge does (control)
        survivors = sum(1 for a in A for m in M_AB["roles"] if m != iA[a] and is_pinj(list(iA.items()) + [(a, m)]))
        survivors += sum(1 for m in M_AB["roles"] - set(iA.values()) for a in A if is_pinj(list(iA.items()) + [(a, m)]))
        if survivors: bad["G2"] += 1
        med = medial(M_AB, M_CA, "A")                                           # M_AB — M_CA, shared corner A
        free = [(m1, m2) for m1 in M_AB["roles"] - set(med) for m2 in M_CA["roles"] - set(med.values())]
        if free: hit["G2ctl"] += 1
        # G3 — COMPOSED: withdrawing any shared-corner pair leaves a role of A that is no longer itself on both sides
        for a in A:
            if med.get(iA[a]) != M_CA["iota"]["A"][a]: bad["G3"] += 1; break
        # G4 — the tower with the born room EMPTY
        h_A = comp(J_CA, comp(J_BC, J_AB))
        m_ab_bc, m_bc_ca = medial(M_AB, M_BC, "B"), medial(M_BC, M_CA, "C")
        h_med = comp(inv(med), comp(m_bc_ca, m_ab_bc))                          # M_AB → M_BC → M_CA → M_AB
        want = {iA[a]: iA[b] for a, b in h_A.items()}
        got = {m: h_med[m] for m in h_med if m in set(iA.values())}
        if got != want: bad["G4"] += 1
        # a BORN act: pair a B-only role of M_AB with a C-only role of M_CA across the medial edge (beyond the shared corner)
        b_only = [b for b in B if b not in J_AB.values()]; c_only = [c for c in C if c not in J_CA]
        if not b_only or not c_only: continue
        b, c = rng.choice(b_only), rng.choice(c_only); tried["born"] += 1
        born = dict(med); born[iB[b]] = M_CA["iota"]["C"][c]
        # G5 — ANOMALY MATCHING (0028 §1.1): the refined boundary A→M_AB→B→M_BC→C→M_CA→A, composed from CORNER edges
        # only, equals the gen-0 residue h_A. The born act lives on a MEDIAL edge and is not an argument of this
        # composite — that part is structural, stated, not measured. CONTROL: a mis-refined corner edge must break it.
        def refined_boundary(iota_A_ab):
            s1 = comp(inv(iB), iota_A_ab)                                       # A → M_AB → B
            s2 = comp(inv(M_BC["iota"]["C"]), comp(M_BC["iota"]["B"], s1))     # → M_BC → C
            return comp(inv(M_CA["iota"]["A"]), comp(M_CA["iota"]["C"], s2))   # → M_CA → A
        if refined_boundary(iA) != h_A: bad["G5b"] += 1
        sigma = A[:]; rng.shuffle(sigma)
        if sigma != A:
            tried["G5ctl"] += 1
            if refined_boundary({a: iA[s] for a, s in zip(A, sigma)}) != h_A: hit["G5ctl"] += 1
        h_med_born = comp(inv(born), comp(m_bc_ca, m_ab_bc))
        moved = h_med_born != h_med
        if moved: hit["G5m"] += 1
        # G6 — the gen-0 TWIN of the born act: the same pair (b, c) made on B — C, where it is a partial injection
        twin = b not in J_BC and c not in J_BC.values()
        if moved and twin: bad["G6r"] += 1          # sealed 0: a born act that MOVES a residue has no gen-0 twin
        if twin:
            tried["G6"] += 1
            J_BC2 = dict(J_BC); J_BC2[b] = c
            def world(pairs):
                par = {}
                def f(z):
                    par.setdefault(z, z)
                    while par[z] != z: par[z] = par[par[z]]; z = par[z]
                    return z
                for t, R in (("A", A), ("B", B), ("C", C)):
                    for r in R: f((t, r))
                for x, y in pairs:
                    p, q = f(x), f(y)
                    if p != q: par[p] = q
                g = collections.defaultdict(set)
                for z in list(par): g[f(z)].add(z)
                return frozenset(frozenset(v) for v in g.values())
            base = [(("A", a), ("B", bb)) for a, bb in J_AB.items()] + [(("C", cc), ("A", a)) for cc, a in J_CA.items()]
            w_born = world(base + [(("B", x), ("C", y)) for x, y in J_BC.items()] + [(("B", b), ("C", c))])
            w_amend = world(base + [(("B", x), ("C", y)) for x, y in J_BC2.items()])
            if w_born != w_amend: bad["G6w"] += 1
        # G7 — dependency: a gen-0 act on J_AB that glues b to some a after the born act was made on b
        a_free = [a for a in A if a not in J_AB]
        if a_free:
            a = rng.choice(a_free); tried["G7"] += 1
            J_AB2 = dict(J_AB); J_AB2[a] = b
            M_AB2 = midpoint(A, B, "A", "B", J_AB2)
            # (a) born act first: re-read it on the new M_AB — the role it named is now glued to a, and a's shared-corner pair also leaves it
            m_new = M_AB2["iota"]["B"][b]
            pairs_after = [(M_AB2["iota"]["A"][x], M_CA["iota"]["A"][x]) for x in A] + [(m_new, M_CA["iota"]["C"][c])]
            if not is_pinj(pairs_after): hit["G7a"] += 1
            # (b) the gen-0 act first: is there still a free slot for the born act on b?
            med2 = medial(M_AB2, M_CA, "A")
            if m_new in med2: hit["G7b"] += 1
    print(f"{trials} random faces (A, B, C of {n} roles each, random partial injections); born acts tried {tried['born']}, "
          f"G6 {tried['G6']}, G7 {tried['G7']}")
    for k, s in (("G1", 0), ("G2", 0), ("G3", 0), ("G4", 0), ("G5b", 0), ("G6w", 0), ("G6r", 0)):
        print(f"   {k:5s} failures    {bad[k]:5d}   sealed 0     {'✔' if bad[k] == s else '⛔ SEAL FIRED'}")
    for k in ("G2ctl", "G5ctl", "G5m", "G7a", "G7b"):
        print(f"   {k:5s} occurrences {hit[k]:5d}   sealed > 0   {'✔' if hit[k] else '⛔ SEAL FIRED'}")
    print(f"   (control denominators: G5ctl of {tried['G5ctl']} mis-refinements; G7 of {tried['G7']} eligible)")

if __name__ == "__main__":
    run()

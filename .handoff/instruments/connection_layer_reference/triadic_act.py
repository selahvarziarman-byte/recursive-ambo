"""THE TRIADIC ACT (Δ108; the mothership's 2026-09-25 1337 letter). At a face X·Y·Z the person picks one role in each corner,
(x, y, z), as ONE act: it enters x↦y on X–Y, y↦z on Y–Z, x↦z on X–Z. Each pair is checked exactly as today (one-to-one on
its edge: a role already paired to another partner refuses); the act is ATOMIC (if any of its three pairs is refused,
none is entered — otherwise the device would be choosing which of his pairs to keep). One J per edge, shared by both of
the edge's faces. Tetrahedron A B C D, n roles a corner, random acts on random faces.
SEALED BEFORE THE RUN
 T1 a face whose three J's hold ONLY pairs from triads made on THAT face reads no Mov at any corner          0 faces with Mov
 T2 triads made on different faces DO produce Mov (curvature is not abolished, it comes from the other faces)  > 0
 T3 a triad on ABD through a role a already paired on A–B to b is refused unless it names b              0 exceptions
    (the other face is bound by the pairs already made — one J per edge)
 T4 every pair a triad-only configuration holds lies in a closed trio of SOME face                        0 exceptions
    CONTROL: single-pair configurations (today's act) hold pairs in no closed trio                          > 0
    ⇒ what triads alone cannot say: "A and B share this, and no third corner does"
 T5 the stone on the triad's own face: every link of ≡_C at a role entered by an ABC triad is a loop       0 failures
"""
import random, itertools, collections
def inv(f): return {v: k for k, v in f.items()}
def comp(g, f): return {x: g[y] for x, y in f.items() if y in g}
C4 = "ABCD"; FACES = ["ABC", "ABD", "ACD", "BCD"]

def J(E, x, y): return E[(x, y)] if (x, y) in E else inv(E[(y, x)])
def put(E, x, y, a, b):
    """can the pair a↦b go on edge x–y? (one-to-one) — True, or False"""
    m = J(E, x, y)
    if a in m: return m[a] == b
    return b not in m.values()
def enter(E, x, y, a, b):
    if (x, y) in E: E[(x, y)][a] = b
    else: E[(y, x)][b] = a

def triad(E, face, roles, rng, src):
    x, y, z = face; t = {c: rng.choice(roles) for c in face}
    legs = [(x, y), (y, z), (x, z)]
    if not all(put(E, p, q, t[p], t[q]) for p, q in legs): return None
    for p, q in legs:
        if J(E, p, q).get(t[p]) != t[q]: src[(p, q, t[p], t[q])] = face
        enter(E, p, q, t[p], t[q])
    return t

def mov_at(E, face):
    out = 0
    for s in itertools.permutations(face):
        h = comp(J(E, s[2], s[0]), comp(J(E, s[1], s[2]), J(E, s[0], s[1])))
        out += sum(1 for a, b in h.items() if a != b)
    return out

def in_trio(E, x, y, a, b):
    for z in C4:
        if z in (x, y): continue
        c = J(E, x, z).get(a)
        if c is not None and J(E, z, y).get(c) == b: return True
    return False

def run(seed=381, trials=4000, n=6):
    rng = random.Random(seed); R = list(range(n)); bad, hit = collections.Counter(), collections.Counter()
    for _ in range(trials):
        E = {(x, y): {} for x, y in itertools.combinations(C4, 2)}; src = {}
        for _ in range(rng.randint(1, 8)):
            face = rng.choice(FACES)
            # T3 probe: a triad on ABD through an A-role already paired on A–B, naming a different B-role
            if face == "ABD":
                ab = J(E, "A", "B")
                if ab:
                    a = rng.choice(list(ab)); bb = rng.choice([b for b in R if b != ab[a]])
                    if put(E, "A", "B", a, bb): bad["T3"] += 1
                    hit["T3probes"] += 1
            triad(E, face, R, rng, src)
        faces_of = collections.defaultdict(set)
        for (p, q, a, b), f in src.items(): faces_of[f].add((p, q))
        for f in FACES:
            edges = {(f[0], f[1]), (f[1], f[2]), (f[0], f[2])}
            pure = all(src.get((p, q, a, b), f) == f and src.get((q, p, b, a), f) == f
                       for p, q in edges for a, b in J(E, p, q).items())
            m = mov_at(E, f)
            if pure and m: bad["T1"] += 1
            if not pure and m: hit["T2"] += 1
        for x, y in itertools.combinations(C4, 2):
            for a, b in J(E, x, y).items():
                if not in_trio(E, x, y, a, b): bad["T4"] += 1
        # T5 — the stone on ABC at roles an ABC triad entered
        fC = comp(J(E, "C", "B"), J(E, "A", "C")); ab = J(E, "A", "B")
        for (p, q, a, b), f in src.items():
            if f == "ABC" and (p, q) == ("A", "B") and fC.get(a) != ab.get(a): bad["T5"] += 1
    # T4 control: today's single pairs
    for _ in range(trials):
        E = {(x, y): {} for x, y in itertools.combinations(C4, 2)}
        for _ in range(rng.randint(1, 10)):
            x, y = rng.choice(list(E)); a, b = rng.choice(R), rng.choice(R)
            if put(E, x, y, a, b): enter(E, x, y, a, b)
        hit["T4ctl"] += any(not in_trio(E, x, y, a, b) for x, y in itertools.combinations(C4, 2) for a, b in J(E, x, y).items())
    print(f"THE TRIADIC ACT — {trials} random tetrahedra ({n} roles a corner, 1–8 triads on random faces)")
    print(f" T1  a face holding only its own triads' pairs reads Mov: {bad['T1']}   (sealed 0)")
    print(f" T2  faces with Mov, their pairs from triads on other faces: {hit['T2']}   (sealed > 0)")
    print(f" T3  an ABD triad naming a different partner for an already-paired A-role was taken: {bad['T3']} of {hit['T3probes']} probes   (sealed 0)")
    print(f" T4  triad-made pairs in no closed trio: {bad['T4']}   (sealed 0) · CONTROL single pairs: tetrahedra with such a pair {hit['T4ctl']} of {trials}   (sealed > 0)")
    print(f" T5  the stone at a role an ABC triad entered, not a loop: {bad['T5']}   (sealed 0)")

if __name__ == "__main__":
    run()

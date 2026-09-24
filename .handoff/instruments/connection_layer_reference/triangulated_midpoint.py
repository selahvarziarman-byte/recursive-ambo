"""THE TRIANGULATED MIDPOINT — Arman: "the midpoint of a relation must depend on the opposite vertex" (a one-off, exhaustive
on tiny faces, before the proposal is put to him)
CANDIDATE: the midpoint of AB = A and B glued over EVERYTHING the face says about which of their items are the same —
the direct pairing J_AB together with C's testimony proj_C = J_CB∘J_AC (C's items never enter; C's pairings do).
SEALED BEFORE THE RUN:
 P1  the AB midpoint glued this way merges no two items of A and none of B  ⇔  no item of A or of B comes back as another
     around the face                                                                                  0 disagreements
 P2  all three triangulated midpoints of the face exist  ⇔  Arman's norm, conflicts only, at every corner      0 disagreements
 P3  it DEPENDS on C: configurations with the same A, B, J_AB whose triangulated AB midpoint differs           > 0
 P4  tetrahedron — both witnesses: all four faces conflict-free, yet C's and D's testimony about A and B conflict  > 0
     (so the norm must be read on every closed walk, not faces alone)
 P5  tetrahedron, the norm on EVERY closed walk (the whole solid glued along all pairings merges no two items of one
     corner): the AB midpoint glued over direct + C + D testimony exists                                         0 exceptions
"""
import itertools, collections
def inv(f): return {v: k for k, v in f.items()}
def comp(g, f): return {x: g[y] for x, y in f.items() if y in g}
def pinjs(n):
    R = range(n); out = []
    for j in range(n + 1):
        for xs in itertools.combinations(R, j):
            for ys in itertools.permutations(R, j): out.append(dict(zip(xs, ys)))
    return out
def J(E, X, Y): return E[(X, Y)] if (X, Y) in E else inv(E[(Y, X)])
def injective(pairs):
    a = collections.Counter(x for x, _ in pairs); b = collections.Counter(y for _, y in pairs)
    return all(v == 1 for v in a.values()) and all(v == 1 for v in b.values())
def no_mov_at(E, face, X):
    Y, Z = [c for c in face if c != X]
    for s in ((X, Y, Z), (X, Z, Y)):
        h = comp(J(E, s[2], s[0]), comp(J(E, s[1], s[2]), J(E, s[0], s[1])))
        if any(a != b for a, b in h.items()): return False
    return True
def tri_mid(E, X, Y, witnesses):
    pairs = set(J(E, X, Y).items())
    for W in witnesses: pairs |= set(comp(J(E, W, Y), J(E, X, W)).items())
    return frozenset(pairs)
def total_ok(E, corners, n):
    par = {}
    def f(z):
        par.setdefault(z, z)
        while par[z] != z: par[z] = par[par[z]]; z = par[z]
        return z
    for (X, Y), m in E.items():
        for a, b in m.items(): par[f((X, a))] = f((Y, b))
    cls = collections.defaultdict(list)
    for X in corners:
        for r in range(n): cls[f((X, r))].append(X)
    return all(len(v) == len(set(v)) for v in cls.values())
bad, hit = collections.Counter(), collections.Counter()
# triangle, 3 items a corner, every configuration
P = pinjs(3); seen = collections.defaultdict(set)
for jab, jbc, jca in itertools.product(P, repeat=3):
    E = {("A", "B"): jab, ("B", "C"): jbc, ("C", "A"): jca}
    ok_ab = injective(tri_mid(E, "A", "B", ["C"]))
    if ok_ab != (no_mov_at(E, "ABC", "A") and no_mov_at(E, "ABC", "B")): bad["P1"] += 1
    all3 = all(injective(tri_mid(E, X, Y, [Z])) for X, Y, Z in (("A", "B", "C"), ("B", "C", "A"), ("C", "A", "B")))
    if all3 != all(no_mov_at(E, "ABC", X) for X in "ABC"): bad["P2"] += 1
    seen[tuple(sorted(jab.items()))].add(tri_mid(E, "A", "B", ["C"]))
hit["P3"] = sum(1 for v in seen.values() if len(v) > 1)
# tetrahedron, 2 items a corner, every configuration
P2_ = pinjs(2); corners = "ABCD"; edges = list(itertools.combinations(corners, 2)); faces = ["ABC", "ABD", "ACD", "BCD"]
for combo in itertools.product(P2_, repeat=6):
    E = dict(zip(edges, combo))
    faces_ok = all(no_mov_at(E, f, X) for f in faces for X in f)
    wit_ok = injective(tri_mid(E, "A", "B", ["C", "D"]))
    if faces_ok and not wit_ok: hit["P4"] += 1
    if total_ok(E, corners, 2):
        hit["P5n"] += 1
        if not wit_ok: bad["P5"] += 1
print(f"P1  AB midpoint (direct + C's testimony) merges nothing ⇔ no conflict at A or B: disagreements {bad['P1']} of {len(P)**3}   (sealed 0)")
print(f"P2  all three triangulated midpoints exist ⇔ conflicts only at every corner: disagreements {bad['P2']}   (sealed 0)")
print(f"P3  same A, B and AB pairing, different triangulated midpoint as C's pairings vary: {hit['P3']} of {len(seen)} AB pairings   (sealed > 0)")
print(f"P4  tetrahedron: four faces conflict-free, C's and D's testimony still conflict: {hit['P4']} configurations   (sealed > 0)")
print(f"P5  tetrahedron, the whole solid merges nothing ({hit['P5n']} configurations): the AB midpoint with both witnesses fails in {bad['P5']}   (sealed 0)")

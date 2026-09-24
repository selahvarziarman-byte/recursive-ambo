"""what each form of the flatness norm FORCES — exhaustive on tiny faces (a one-off for Arman's question, 20.4)
SEALED BEFORE THE RUN:
 T1 triangle, 'gaps too' (on every edge the direct pairing EQUALS the route through the third corner):
    every pair made on any edge belongs to a closed trio x~y~z                                 0 exceptions
 T2 triangle, 'conflicts only' (nothing comes back as something else): pairs OUTSIDE any trio exist  > 0
 T3 tetrahedron, 'gaps too' on all four faces: every pair belongs to a closed FOUR (a~b~c~d)     0 exceptions
 T4 tetrahedron, 'conflicts only' on all four faces: pairs outside any four exist                > 0
 (and both forms admit more than the empty configuration — neither is vacuous)                   > 1 each
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
def gaps_too(E, face):
    return all(J(E, x, y) == comp(J(E, z, y), J(E, x, z)) for x, y, z in itertools.permutations(face, 3))
def conflicts_only(E, face):
    for s in itertools.permutations(face, 3):
        h = comp(J(E, s[2], s[0]), comp(J(E, s[1], s[2]), J(E, s[0], s[1])))
        if any(a != b for a, b in h.items()): return False
    return True
def in_clique(E, corners, X, x, Y, y):
    # is there a choice of one role per other corner, all mutually paired with x and y?
    others = [Z for Z in corners if Z not in (X, Y)]
    for zs in itertools.product(*[[J(E, X, Z).get(x)] for Z in others]):
        if None in zs: return False
        pts = dict(zip(others, zs)); pts[X] = x; pts[Y] = y
        return all(J(E, P, Q).get(pts[P]) == pts[Q] for P, Q in itertools.permutations(corners, 2))
    return False
def run(corners, faces, n):
    edges = list(itertools.combinations(corners, 2)); P = pinjs(n); res = collections.Counter()
    for combo in itertools.product(P, repeat=len(edges)):
        E = dict(zip(edges, combo))
        for form, test in (("gaps too", gaps_too), ("conflicts only", conflicts_only)):
            if all(test(E, f) for f in faces):
                res[(form, "configurations")] += 1
                loose = any(not in_clique(E, corners, X, x, Y, y) for (X, Y) in edges for x, y in E[(X, Y)].items())
                res[(form, "with a pair outside a closed group")] += loose
    return res
for name, corners, faces, n in (("triangle", "ABC", ["ABC"], 3), ("tetrahedron", "ABCD", ["ABC", "ABD", "ACD", "BCD"], 2)):
    r = run(corners, faces, n)
    print(f"{name} (roles per corner {n}, every configuration of pairings):",
          " · ".join(f"{f}: {r[(f,'configurations')]} lawful, {r[(f,'with a pair outside a closed group')]} with a pair outside a closed {len(corners)}-group" for f in ("gaps too", "conflicts only")))

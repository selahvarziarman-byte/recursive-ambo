"""spaceOf(vertex) — the mothership's chartered resolver (1047 §3), checked BEFORE it is built. One face A, B, C, seeds cast;
gen 1 = M_AB, M_BC, M_CA; gen 2 = a STATION on a corner edge (A — M_AB) and ABAC on the medial edge M_AB — M_CA.
Roles and words carry their SEED content, and every space carries its parents' injections, so duplication is visible
(a set of seed-classes would silently merge equal classes — the very thing under test — so ids are side-tagged).

Two resolvers, identical except for WHICH J each edge contributes:
  RECORD-ONLY  every edge glues over ITS OWN RECORD (the charter's wording: "over its edge's record")
  KIND-AWARE   the J the edge's KIND fixes (0028 · 0031 §3.5 restored, §120.2): a SEED edge → the person's record;
               a CORNER edge → the CARRIED injection (derived, total; no record is read); a MEDIAL edge → the COMPOSED
               identity on the shared corner's roles AND words, traced through each parent's injection, ∪ the person's
               BORN pairs (the record, extension only)

SEALED BEFORE THE RUN:
 S1  spaceOf(M_AB) holds nothing of C (either resolver: a seed edge's record IS its J)              0 failures
 S2  STATIONS (Arman's): the station on A — M_AB is M_AB's own space
       KIND-AWARE: same role count, no seed role duplicated                                        0 failures
       RECORD-ONLY: A duplicated in it                                                              > 0
 S3  ABAC (gen 2, medial): no seed role and no seed word duplicated
       KIND-AWARE                                                                                   0 failures
       RECORD-ONLY: A's roles and words duplicated                                                  > 0
 S4  INVARIANT 9 at gen 2: vary J_BC (BC is ABAC's opposite vertex in the medial triangle) — ABAC   0 changes
     unchanged. CONTROL: vary J_AB (AB is a PARENT) — ABAC changes                                  > 0
     (A is ALSO an opposite vertex of AB—AC — the apex of the corner triangle — but it is an ANCESTOR of both
      endpoints, inside each; it cannot be re-cast without changing the endpoints, so the byte-identical falsifier
      applies only to non-ancestor opposite vertices. Stated, not measured.)
 S5  (b)'s trap: the composed identity found by MATCHING NAMES in the glued spaces (a glued A-role is labelled
     `a≡b` in AB and `a≡c` in AC) instead of TRACING ORIGINS misses A-roles and duplicates them in ABAC       > 0
"""
import random, collections

def seed(X, n_roles, n_words):
    return {"name": X, "roles": {(X, f"{X.lower()}{i}"): frozenset({(X, f"{X.lower()}{i}")}) for i in range(n_roles)},
            "words": {(X, f"w{X.lower()}{i}"): frozenset({(X, f"w{X.lower()}{i}")}) for i in range(n_words)},
            "inj": {}, "winj": {}, "parents": ()}

def _classes(ids_L, ids_R, pairs):
    par = {}
    def find(z):
        par.setdefault(z, z)
        while par[z] != z: par[z] = par[par[z]]; z = par[z]
        return z
    for i in ids_L: find(("L", i))
    for i in ids_R: find(("R", i))
    for x, y in pairs:
        p, q = find(("L", x)), find(("R", y))
        if p != q: par[p] = q
    groups = collections.defaultdict(set)
    for z in list(par): groups[find(z)].add(z)
    of = {z: frozenset(groups[find(z)]) for z in par}
    return of

def glue(S1, S2, Jr, Jw, name):
    """the pushout of S1 and S2 over role-pairs Jr and word-pairs Jw; returns a space carrying both injections"""
    of_r = _classes(S1["roles"], S2["roles"], Jr); of_w = _classes(S1["words"], S2["words"], Jw)
    roles, words = {}, {}
    for (side, rid), cls in of_r.items():
        src = S1 if side == "L" else S2
        roles[cls] = roles.get(cls, frozenset()) | src["roles"][rid]
    for (side, wid), cls in of_w.items():
        src = S1 if side == "L" else S2
        words[cls] = words.get(cls, frozenset()) | src["words"][wid]
    return {"name": name, "roles": roles, "words": words, "parents": (S1["name"], S2["name"]),
            "inj": {S1["name"]: {r: of_r[("L", r)] for r in S1["roles"]}, S2["name"]: {r: of_r[("R", r)] for r in S2["roles"]}},
            "winj": {S1["name"]: {w: of_w[("L", w)] for w in S1["words"]}, S2["name"]: {w: of_w[("R", w)] for w in S2["words"]}}}

def duplicated(S):
    """seed roles / seed words appearing in two or more roles / words of S — lawful only as gen-3 doubling, never below"""
    cr, cw = collections.Counter(), collections.Counter()
    for c in S["roles"].values():
        for s in c: cr[s] += 1
    for c in S["words"].values():
        for s in c: cw[s] += 1
    return sum(1 for v in cr.values() if v > 1), sum(1 for v in cw.values() if v > 1)

def composed_by_origin(U, V, shared):
    """the medial edge's COMPOSED identity: the shared corner's roles and words, traced through each parent's injection"""
    return ([(U["inj"][shared][r], V["inj"][shared][r]) for r in U["inj"][shared]],
            [(U["winj"][shared][w], V["winj"][shared][w]) for w in U["winj"][shared]])

def label(cls_content): return " ≡ ".join(sorted(r for _, r in cls_content))
def composed_by_name(U, V):
    """(b)'s TRAP: identify roles of U and V whose glued LABELS are equal (what a name-matcher would do)"""
    lu = {label(c): rid for rid, c in U["roles"].items()}; lv = {label(c): rid for rid, c in V["roles"].items()}
    wu = {label(c): wid for wid, c in U["words"].items()}; wv = {label(c): wid for wid, c in V["words"].items()}
    return [(lu[k], lv[k]) for k in lu if k in lv], [(wu[k], wv[k]) for k in wu if k in wv]

def rnd_pinj(src, dst, rng):
    xs = rng.sample(list(src), rng.randint(0, len(src))); return list(zip(xs, rng.sample(list(dst), len(xs))))

def build(rng, A, B, C, J_AB=None, J_BC=None, J_CA=None):
    J_AB = J_AB if J_AB is not None else (rnd_pinj(A["roles"], B["roles"], rng), rnd_pinj(A["words"], B["words"], rng))
    J_BC = J_BC if J_BC is not None else (rnd_pinj(B["roles"], C["roles"], rng), rnd_pinj(B["words"], C["words"], rng))
    J_CA = J_CA if J_CA is not None else (rnd_pinj(C["roles"], A["roles"], rng), rnd_pinj(C["words"], A["words"], rng))
    M_AB = glue(A, B, J_AB[0], J_AB[1], "M_AB"); M_BC = glue(B, C, J_BC[0], J_BC[1], "M_BC"); M_CA = glue(C, A, J_CA[0], J_CA[1], "M_CA")
    return M_AB, M_BC, M_CA, J_AB, J_BC, J_CA

def born_pairs(M_AB, M_CA, rng):
    """the person's BORN pairs on M_AB — M_CA: roles beyond the shared corner A (a B-only role ↦ a C-only role)"""
    b_only = [r for r, c in M_AB["roles"].items() if all(s[0] == "B" for s in c)]
    c_only = [r for r, c in M_CA["roles"].items() if all(s[0] == "C" for s in c)]
    k = rng.randint(0, min(len(b_only), len(c_only), 2))
    return list(zip(rng.sample(b_only, k), rng.sample(c_only, k)))

def abac(M_AB, M_CA, born, kind_aware, by_name=False):
    if not kind_aware: return glue(M_AB, M_CA, born, [], "ABAC")
    cr, cw = composed_by_name(M_AB, M_CA) if by_name else composed_by_origin(M_AB, M_CA, "A")
    return glue(M_AB, M_CA, cr + born, cw, "ABAC")

def fingerprint(S):
    return (frozenset(S["roles"].values()), frozenset(S["words"].values()))

def run(trials=3000, seed_=241):
    rng = random.Random(seed_); bad = collections.Counter(); hit = collections.Counter(); n = collections.Counter()
    A, B, C = seed("A", 5, 3), seed("B", 5, 3), seed("C", 5, 3)
    for _ in range(trials):
        M_AB, M_BC, M_CA, J_AB, J_BC, J_CA = build(rng, A, B, C)
        # S1 — a gen-1 midpoint on a seed edge holds nothing of C
        if any(s[0] == "C" for c in M_AB["roles"].values() for s in c): bad["S1"] += 1
        # S2 — the station on the corner edge A — M_AB
        ka = glue(A, M_AB, list(M_AB["inj"]["A"].items()), list(M_AB["winj"]["A"].items()), "P")
        ro = glue(A, M_AB, [], [], "P'")
        if len(ka["roles"]) != len(M_AB["roles"]) or duplicated(ka) != (0, 0): bad["S2"] += 1
        if duplicated(ro)[0] > 0: hit["S2ro"] += 1
        # S3 — ABAC on the medial edge, with the person's born pairs
        born = born_pairs(M_AB, M_CA, rng)
        K = abac(M_AB, M_CA, born, kind_aware=True); R = abac(M_AB, M_CA, born, kind_aware=False)
        if duplicated(K) != (0, 0): bad["S3"] += 1
        if duplicated(R) != (0, 0): hit["S3ro"] += 1
        # S4 — invariant 9 at gen 2: J_BC is not an argument of ABAC; J_AB is
        _, _, M_CA2, *_ = build(rng, A, B, C, J_AB=J_AB, J_CA=J_CA)                   # a fresh random J_BC only
        if fingerprint(abac(M_AB, M_CA2, born, True)) != fingerprint(K): bad["S4"] += 1
        M_AB3, _, _, *_ = build(rng, A, B, C, J_BC=J_BC, J_CA=J_CA)                   # a fresh random J_AB (control)
        born3 = [p for p in born if p[0] in M_AB3["roles"]]
        n["S4ctl"] += 1
        if fingerprint(abac(M_AB3, M_CA, born3, True)) != fingerprint(K): hit["S4ctl"] += 1
        # S5 — (b)'s trap: the composed identity by NAME instead of by ORIGIN
        N = abac(M_AB, M_CA, born, kind_aware=True, by_name=True)
        if duplicated(N)[0] > 0: hit["S5"] += 1
    print(f"{trials} random faces (A, B, C: 5 roles, 3 words each; random partial role- and word-maps; 0–2 born pairs)")
    for k in ("S1", "S2", "S3", "S4"):
        tag = "   ← STRUCTURAL in this model (the resolver takes only the two parents); the falsifier that matters is the BUILD's resolver" \
              if k in ("S1", "S4") else ""
        print(f"   {k:4s} failures    {bad[k]:5d}   sealed 0     {'✔' if bad[k] == 0 else '⛔ SEAL FIRED'}{tag}")
    for k, lbl in (("S2ro", "RECORD-ONLY station duplicates A"), ("S3ro", "RECORD-ONLY ABAC duplicates A"),
                   ("S4ctl", "CONTROL: a parent's J_AB changes ABAC"), ("S5", "NAME-MATCHED identity duplicates an A-role")):
        print(f"   {k:5s} occurrences {hit[k]:5d}   sealed > 0   {'✔' if hit[k] else '⛔ SEAL FIRED'}   ({lbl})")
    # one instance, printed as description
    rng2 = random.Random(7); M_AB, M_BC, M_CA, *_ = build(rng2, A, B, C)
    ka = glue(A, M_AB, list(M_AB["inj"]["A"].items()), list(M_AB["winj"]["A"].items()), "P"); ro = glue(A, M_AB, [], [], "P'")
    K = abac(M_AB, M_CA, [], True); R = abac(M_AB, M_CA, [], False); N = abac(M_AB, M_CA, [], True, by_name=True)
    print(f"\n   one face: |A|=5 |M_AB|={len(M_AB['roles'])} |M_CA|={len(M_CA['roles'])}")
    print(f"     station on A—M_AB   kind-aware {len(ka['roles'])} roles, duplicated {duplicated(ka)}  |  record-only {len(ro['roles'])} roles, duplicated {duplicated(ro)}")
    print(f"     ABAC (no born pair) kind-aware {len(K['roles'])} roles, duplicated {duplicated(K)}  |  record-only {len(R['roles'])} roles, duplicated {duplicated(R)}"
          f"  |  name-matched {len(N['roles'])} roles, duplicated {duplicated(N)}")
    want = len(M_AB['roles']) + len(M_CA['roles']) - 5
    print(f"     sealed by hand: kind-aware ABAC = |M_AB| + |M_CA| − |A| = {len(M_AB['roles'])} + {len(M_CA['roles'])} − 5 = {want}"
          f"   → measured {len(K['roles'])}  {'✔' if len(K['roles']) == want else '⛔ SEAL FIRED'}")
    print(f"     sealed by hand: record-only ABAC = |M_AB| + |M_CA| = {len(M_AB['roles']) + len(M_CA['roles'])}"
          f"   → measured {len(R['roles'])}  {'✔' if len(R['roles']) == len(M_AB['roles']) + len(M_CA['roles']) else '⛔ SEAL FIRED'}")

if __name__ == "__main__":
    run()

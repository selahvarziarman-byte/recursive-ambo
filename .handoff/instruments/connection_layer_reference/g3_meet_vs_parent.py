"""GEN 3 — which identification does a MEDIAL edge compose once its endpoints share MORE than their parent?
(The gen-3 doubling set owed since §3.5 was restored, and a check on my own §11 rule sent at 10:55.)

  P_A = mid(M_CA, M_AB) and P_B = mid(M_AB, M_BC) share the PARENT M_AB — and ALSO C, which P_A reaches through M_CA
  and P_B through M_BC. Two candidate rules for the gen-2 medial edge P_A — P_B:
    RULE P   the identity on the shared PARENT's roles, traced through each endpoint's injection   (my §11, 10:55)
    RULE M   the MEET over EVERYTHING both endpoints hold — a class of P_A is paired with the one class of P_B holding
             all of its seed roles; a class spread over two (or two onto one) is a CONFLICT and is left out, and the
             pushout then HOUSES it twice                                                           (0031 §3.5 as
             ratified: "take the meet of the shared identification and house the disagreement as two roles";
             g3_doubled_roles.py, 09-16)
  At gen 2 (M_AB — M_CA) the two coincide: the only thing both endpoints hold is A.

SEALED BEFORE THE RUN (empty born rooms):
  T1  at gen 2 RULE M = RULE P (the identity on A)                                               0 differences
  T2  RULE M reproduces the ratified doubling set: the doubled A-roles at Q_AB = mid(P_A, P_B)
      == (im J_CA ∖ Fix h_A) ∪ (dom(J_BC∘J_AB) ∖ dom h_A)                                          0 failures
  T3  RULE P doubles MORE — every C-role both endpoints hold that neither route ties to M_AB
      (nothing disagrees about it) stands twice                                                   > 0
  T4  RULE M doubles nothing on a FLAT face with total maps (h = 1, every J total) — the classical
      sub-case is silent                                                                          0 failures
  T6  [ADDED BEFORE THE SECOND RUN — the first run's T3 metric could not see it] POOLING: a class of Q_AB holding two
      seed roles of ONE corner (a corner coarsened at a vertex — 0031 §6 invariant 3, the stone)
        RULE M                                                                                    0 faces
        RULE P — wherever the routes disagree, pairing through the parent drags both targets in   > 0 faces
THEN, with BORN acts on the gen-1 medial edges (not sealed as a formula — the run shows what the set becomes):
  T5  RULE M's doubling with born acts vs the empty-room formula: how often, and which way, it moves
"""
import random, collections
from space_of_resolver import seed, glue, duplicated

def meet(P1, P2):
    """pairs (class of P1, class of P2) by shared SEED content; conflicts left out (0031 §3.5, the ratified meet)"""
    where2 = {}
    for rid, cont in P2["roles"].items():
        for s in cont: where2.setdefault(s, set()).add(rid)
    image, conflicts = {}, set()
    for rid, cont in P1["roles"].items():
        t = set()
        for s in cont: t |= where2.get(s, set())
        if len(t) == 1: image[rid] = next(iter(t))
        elif len(t) > 1: conflicts.add(rid)
    back = collections.defaultdict(list)
    for r1, r2 in image.items(): back[r2].append(r1)
    for r2, srcs in back.items():
        if len(srcs) > 1: conflicts.update(srcs)
    pairs = [(r1, r2) for r1, r2 in image.items() if r1 not in conflicts]
    # words, the same way
    wwhere2 = {}
    for wid, cont in P2["words"].items():
        for s in cont: wwhere2.setdefault(s, set()).add(wid)
    wimage = {}
    for wid, cont in P1["words"].items():
        t = set()
        for s in cont: t |= wwhere2.get(s, set())
        if len(t) == 1: wimage[wid] = next(iter(t))
    wback = collections.Counter(wimage.values())
    wpairs = [(a, b) for a, b in wimage.items() if wback[b] == 1]
    return pairs, wpairs, conflicts

def parent_identity(U, V, parent):
    return ([(U["inj"][parent][r], V["inj"][parent][r]) for r in U["inj"][parent]],
            [(U["winj"][parent][w], V["winj"][parent][w]) for w in U["winj"][parent]])

def rnd_pinj(src, dst, rng, total=False):
    src, dst = list(src), list(dst)
    k = min(len(src), len(dst)) if total else rng.randint(0, min(len(src), len(dst)))
    xs = rng.sample(src, k); return list(zip(xs, rng.sample(dst, k)))

def born(M1, M2, a_corner, b_corner, rng):
    """born pairs on medial edge M1 — M2 beyond the shared corner: a role of M1 holding only `a_corner` seeds ↦ a role of
    M2 holding only `b_corner` seeds"""
    o1 = [r for r, c in M1["roles"].items() if all(s[0] == a_corner for s in c)]
    o2 = [r for r, c in M2["roles"].items() if all(s[0] == b_corner for s in c)]
    k = rng.randint(0, min(len(o1), len(o2), 2)); return list(zip(rng.sample(o1, k), rng.sample(o2, k)))

def tower(rng, n=5, total=False, with_born=False, flat=False):
    A, B, C = seed("A", n, 2), seed("B", n, 2), seed("C", n, 2)
    J_AB = rnd_pinj(A["roles"], B["roles"], rng, total); J_BC = rnd_pinj(B["roles"], C["roles"], rng, total)
    J_CA = rnd_pinj(C["roles"], A["roles"], rng, total)
    if flat:                                   # force h = 1: J_CA := (J_BC ∘ J_AB)⁻¹ on its domain
        jab, jbc = dict(J_AB), dict(J_BC)
        J_CA = [(jbc[jab[a]], a) for a in jab if jab[a] in jbc]
    M_AB, M_BC, M_CA = glue(A, B, J_AB, [], "M_AB"), glue(B, C, J_BC, [], "M_BC"), glue(C, A, J_CA, [], "M_CA")
    bCA = born(M_CA, M_AB, "C", "B", rng) if with_born else []       # on M_CA — M_AB, beyond A
    bAB = born(M_AB, M_BC, "A", "C", rng) if with_born else []       # on M_AB — M_BC, beyond B
    iA = parent_identity(M_CA, M_AB, "A"); iB = parent_identity(M_AB, M_BC, "B")
    P_A = glue(M_CA, M_AB, iA[0] + bCA, iA[1], "P_A"); P_B = glue(M_AB, M_BC, iB[0] + bAB, iB[1], "P_B")
    return dict(A=A, B=B, C=C, J_AB=dict(J_AB), J_BC=dict(J_BC), J_CA=dict(J_CA), M_AB=M_AB, M_BC=M_BC, M_CA=M_CA,
                P_A=P_A, P_B=P_B, iA=iA, bCA=bCA, bAB=bAB)

def doubled_A(Q):
    cnt = collections.Counter(s for c in Q["roles"].values() for s in c)
    return {s[1] for s, k in cnt.items() if k > 1 and s[0] == "A"}

def formula(t):
    """the ratified 09-16 set, in seed-role names: (im J_CA ∖ Fix h_A) ∪ (dom(J_BC∘J_AB) ∖ dom h_A)"""
    JAB = {a[1]: b[1] for a, b in t["J_AB"].items()}; JBC = {b[1]: c[1] for b, c in t["J_BC"].items()}
    JCA = {c[1]: a[1] for c, a in t["J_CA"].items()}
    h = {a: JCA[JBC[JAB[a]]] for a in JAB if JAB[a] in JBC and JBC[JAB[a]] in JCA}
    reach = {a for a in JAB if JAB[a] in JBC}
    return {a for a in JCA.values() if h.get(a) != a} | (reach - set(h))

def run(trials=3000, seed_=251):
    rng = random.Random(seed_); bad = collections.Counter(); hit = collections.Counter(); moved = collections.Counter()
    for _ in range(trials):
        t = tower(rng)
        # T1 — at gen 2 the meet IS the identity on A
        mp, mw, mc = meet(t["M_CA"], t["M_AB"])
        if set(mp) != set(t["iA"][0]) or mc: bad["T1"] += 1
        # gen 3 — Q_AB on the medial edge P_A — P_B, under each rule
        pM, wM, conf = meet(t["P_A"], t["P_B"]); QM = glue(t["P_A"], t["P_B"], pM, wM, "Q_AB")
        pP, wP = parent_identity(t["P_A"], t["P_B"], "M_AB"); QP = glue(t["P_A"], t["P_B"], pP, wP, "Q_AB'")
        f = formula(t)
        if doubled_A(QM) != f: bad["T2"] += 1
        if duplicated(QP)[0] > duplicated(QM)[0]: hit["T3"] += 1
        # T6 — POOLING (0031 §6 invariant 3, the stone): a class holding TWO seed roles of ONE corner is a corner coarsened
        # at a vertex. Sealed: RULE M never (0); RULE P wherever the routes disagree (> 0) — it pairs through the parent
        # and drags the two routes' different targets into one class.
        def pooled(Q): return sum(1 for c in Q["roles"].values() if any(k > 1 for k in collections.Counter(s[0] for s in c).values()))
        if pooled(QM): bad["T6M"] += 1
        if pooled(QP): hit["T6P"] += 1
        if pooled(QP) and not t["bCA"] and hit["T6ex"] == 0:
            hit["T6ex"] = 1
            ex = next(c for c in QP["roles"].values() if any(k > 1 for k in collections.Counter(s[0] for s in c).values()))
            print(f"   one pooled class under RULE P: {sorted(s[0] + ':' + s[1] for s in ex)}")
    # T4 — the classical sub-case: total maps around a flat face
    for _ in range(500):
        t = tower(rng, total=True, flat=True)
        JAB = {a[1]: b[1] for a, b in t["J_AB"].items()}; JBC = {b[1]: c[1] for b, c in t["J_BC"].items()}
        JCA = {c[1]: a[1] for c, a in t["J_CA"].items()}
        if all(JCA[JBC[JAB[a]]] == a for a in JAB) and len(JAB) == 5:      # flat AND total (the classical sub-case)
            hit["T4n"] += 1
            pM, wM, _ = meet(t["P_A"], t["P_B"])
            if duplicated(glue(t["P_A"], t["P_B"], pM, wM, "Q"))[0]: bad["T4"] += 1
    # T5 — born acts on the gen-1 medial edges
    for _ in range(trials):
        t = tower(rng, with_born=True)
        if not (t["bCA"] or t["bAB"]): continue
        hit["T5n"] += 1
        pM, wM, _ = meet(t["P_A"], t["P_B"]); d = doubled_A(glue(t["P_A"], t["P_B"], pM, wM, "Q"))
        f = formula(t)
        if d != f:
            moved["differs"] += 1
            if d > f: moved["grows"] += 1
            elif d < f: moved["shrinks"] += 1
            else: moved["other"] += 1
    print(f"{trials} random faces (A, B, C: 5 roles, 2 words), empty born rooms unless stated")
    for k in ("T1", "T2", "T4"):
        print(f"   {k}  failures {bad[k]:5d}   sealed 0     {'✔' if bad[k] == 0 else '⛔ SEAL FIRED'}" + (f"   (over {hit['T4n']} flat total faces)" if k == "T4" else ""))
    print(f"   T3  RULE P doubles more than RULE M in {hit['T3']:5d} faces   sealed > 0   {'✔' if hit['T3'] else '⛔ SEAL FIRED'}")
    print(f"   T6  POOLING — RULE M: {bad['T6M']} faces (sealed 0 {'✔' if bad['T6M'] == 0 else '⛔ SEAL FIRED'})  ·  "
          f"RULE P: {hit['T6P']} faces (sealed > 0 {'✔' if hit['T6P'] else '⛔ SEAL FIRED'})")
    print(f"   T5  with born acts ({hit['T5n']} faces carrying at least one): the doubling differs from the empty-room formula in "
          f"{moved['differs']}  — grows {moved['grows']} · shrinks {moved['shrinks']} · neither-contains {moved['other']}")

if __name__ == "__main__":
    run()

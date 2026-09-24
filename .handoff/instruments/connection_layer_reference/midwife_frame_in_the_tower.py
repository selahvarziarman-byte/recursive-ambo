"""THE PROJECTED VERTEX — what does the opposite vertex do at an edge's midpoint? (Arman, 2026-09-23, via the terminal:
"what is the role of the projected vertex/concept into the amalgam/midpoint? does that do any work? do we have a theory
for it? it is the airiest part of the layer right now.")

WHAT THE RECORD HOLDS (ratified): the midpoint M_AB = A ⊔_{J_AB} B is a functor of the span alone — the opposite vertex C
never enters it (0031 §8(a), invariant 9); the route through C, proj_C = J_CB ∘ J_AC, compared with J_AB IS the face's
residue, h_A = proj_C⁻¹ ∘ J_AB (0031 §8(b); measured 0/20,000, control 8,266); at the edge C's space may only be SHOWN
(clueing, §8(c)). My ruling §7 relocated the Midwife frame to a naming companion: "⊕/⊖ have no shadow on spaces".
THE CANDIDATE under test: the Midwife's objects (docs/governance/PLATONIC_ENGINE_TRISONIZED_MIDWIFE_SEMANTIC_CLUEING_METHOD.md
§0, §5) are built by the ambo tower itself —
   Ω_A = J ⊕ A   is the gen-1 midpoint M_CA        (⊕ = the amalgam over the person's identification)
   Ω_B = J ⊕ B   is the gen-1 midpoint M_BC
   Ω_A ↔ Ω_B     is the medial edge M_BC — M_CA (it composes the meet on C)
   Λ             is that edge's gen-2 midpoint — "a completion of J holding both without collapsing into either"
   X = Λ ⊖ J     is what Λ glues of A and B once C's own roles are set aside
— so "C projected onto AB" would be a SECOND gluing of A with B, through C, one generation up from M_AB.

SEALED BEFORE THE RUN
 W1  (geometry — exact, structural) Λ's vertex = mid(M_BC, M_CA) = (C + M_AB)/2: halfway down C's median to AB   0 failures
 W2  Λ (born room empty) glues a ∈ A with b ∈ B exactly when b = proj_C(a) = J_CB(J_AC(a))                       0 disagreements
     CONTROL: M_AB glues along J_AB, and the two gluings of A with B differ                                       > 0 faces
 W3  Λ keeps the stone: no seed role of A, B or C in two roles of Λ, no role of Λ holding two of one corner       0 failures
 W4  M_AB and Λ agree on a (J_AB(a) = proj_C(a), both defined) ⇔ a ∈ Fix(h_A)                                     0 disagreements
     (0031 §8(b), read as two CHILDREN of A and B instead of two maps)
 W5  C's two projections INTO M_AB — ι_A ∘ J_CA and ι_B ∘ J_CB — land on one role ⇔ c ∈ Fix(h_C)                  0 disagreements
 W6  invariant 9 stands: re-casting C's two edges leaves M_AB unchanged (structural) and moves Λ                  > 0 faces
 W7  Λ's BORN ROOM (the medial edge's free slots) is exactly: B's roles outside dom J_BC and A's roles outside
     im J_CA — a born pair there identifies A with B where the route through C leaves them apart                 0 failures
 REPORTED on the fixtures (A = flow · B = t-cell · C = phi, the 42 hand triples of the first face):
     the sizes of the two gluings, their agreement, W5's four ways, and the ⊖ FORK — how many of C's own tuples
     land wholly on roles of A and B in Λ (what X would carry if "⊖ J" kept the opposite vertex's relations)
"""
import os, sys, random, itertools, collections
from fractions import Fraction as Fr
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from born_face_reading import build, medial_map, free_born_slots, inv, comp, HAND_TF, HAND_TP, J_FP
from space_of_resolver import glue

def route_space(M):
    """Λ = the gen-2 midpoint of the medial edge M_BC — M_CA, born room empty (the resolver's medial rule: the meet)"""
    return glue(M["BC"], M["CA"], list(medial_map(M["BC"], M["CA"]).items()), [], "L_C")

def ab_gluing(S):
    """the pairs (a, b) of seed roles of A and B that S holds in one role"""
    out = set()
    for cont in S["roles"].values():
        As = [r for X, r in cont if X == "A"]; Bs = [r for X, r in cont if X == "B"]
        out |= {(a, b) for a in As for b in Bs}
    return out

def stone_ok(S):
    seen = collections.Counter(s for cont in S["roles"].values() for s in cont)
    if any(v > 1 for v in seen.values()): return False
    return all(max(collections.Counter(X for X, _ in cont).values()) <= 1 for cont in S["roles"].values())

def classify_C(M, J_AB, J_BC, J_CA, C_roles):
    """W5: C's two projections into M_AB — through A and through B"""
    iA, iB = M["AB"]["inj"]["A"], M["AB"]["inj"]["B"]; J_CB = inv(J_BC)
    h_C = {c: J_BC[J_AB[J_CA[c]]] for c in J_CA if J_CA[c] in J_AB and J_AB[J_CA[c]] in J_BC}
    out = collections.Counter(); bad = 0
    for c in C_roles:
        pa = iA[("A", J_CA[c])] if c in J_CA else None
        pb = iB[("B", J_CB[c])] if c in J_CB else None
        one = pa is not None and pa == pb
        if one != (h_C.get(c) == c): bad += 1
        out["one image" if one else "two images" if (pa is not None and pb is not None) else
            "one route only" if (pa is not None or pb is not None) else "does not reach"] += 1
    return out, bad

def face(J_AB, J_BC, J_CA, casts, bad, hit, recs=None, report=None):
    S, M = build(casts, J_AB, J_BC, J_CA); L = route_space(M)
    proj = comp(inv(J_BC), inv(J_CA))                                     # J_CB ∘ J_AC : A → B
    gL, gM = ab_gluing(L), ab_gluing(M["AB"])
    if gL != set(proj.items()): bad["W2"] += 1
    if gM != set(J_AB.items()): bad["W2ctl"] += 1
    hit["W2differ"] += gL != gM
    if not stone_ok(L): bad["W3"] += 1
    h_A = comp(J_CA, comp(J_BC, J_AB))
    for a in casts["A"]["roles"]:
        agree = a in J_AB and a in proj and J_AB[a] == proj[a]
        if agree != (h_A.get(a) == a): bad["W4"] += 1
    cl, b5 = classify_C(M, J_AB, J_BC, J_CA, casts["C"]["roles"]); bad["W5"] += b5
    lu, lv = free_born_slots(M["BC"], M["CA"])                            # roles of M_BC / M_CA outside the meet
    seeds_u = {s for r in lu for s in M["BC"]["roles"][r]}; seeds_v = {s for r in lv for s in M["CA"]["roles"][r]}
    want_u = {("B", b) for b in casts["B"]["roles"] if b not in J_BC}; want_v = {("A", a) for a in casts["A"]["roles"] if a not in set(J_CA.values())}
    if seeds_u != want_u or seeds_v != want_v: bad["W7"] += 1
    if report is not None:
        where = {s: cid for cid, cont in L["roles"].items() for s in cont}
        ab_cls = {cid for cid, cont in L["roles"].items() if any(X in "AB" for X, _ in cont)}
        carried = sum(1 for (t, tup) in recs["C"]["rec"] if all(where[("C", x)] in ab_cls for x in tup))
        report.append((len(gM), len(gL), len(gM & gL), len(h_A), sum(1 for a in h_A if h_A[a] == a), cl, carried,
                       len(recs["C"]["rec"])))
    return S, M, L

def rnd_pinj(X, Y, rng):
    k = rng.randint(0, min(len(X), len(Y))); xs = rng.sample(list(X), k); return dict(zip(xs, rng.sample(list(Y), k)))

def run(seed_=311, trials=4000):
    rng = random.Random(seed_); bad, hit = collections.Counter(), collections.Counter()
    # W1 — exact geometry
    for _ in range(200):
        A, B, C = ([Fr(rng.randint(-99, 99), rng.randint(1, 9)) for _ in range(3)] for _ in range(3))
        mid = lambda P, Q: [(p + q) / 2 for p, q in zip(P, Q)]
        if mid(mid(B, C), mid(C, A)) != mid(C, mid(A, B)): bad["W1"] += 1
    # random faces
    R = {X: [f"{X.lower()}{i}" for i in range(5)] for X in "ABCD"}; casts = {X: {"roles": R[X]} for X in "ABCD"}
    for _ in range(trials):
        J_AB, J_BC, J_CA = rnd_pinj(R["A"], R["B"], rng), rnd_pinj(R["B"], R["C"], rng), rnd_pinj(R["C"], R["A"], rng)
        _, M, L = face(J_AB, J_BC, J_CA, casts, bad, hit)
        _, M2, L2 = face(J_AB, rnd_pinj(R["B"], R["C"], rng), rnd_pinj(R["C"], R["A"], rng), casts, collections.Counter(), collections.Counter())
        if set(M2["AB"]["roles"].values()) != set(M["AB"]["roles"].values()): bad["W6"] += 1
        hit["W6moved"] += set(L2["roles"].values()) != set(L["roles"].values())
    print(f"THE PROJECTED VERTEX — {trials} random faces (5 roles a corner, random partial J's) + the 42 hand triples")
    print(f" W1  mid(M_BC, M_CA) = (C + M_AB)/2 exactly, 200 random rational triangles: failures {bad['W1']}   (sealed 0)")
    print(f" W2  Λ glues A with B exactly along proj_C = J_CB∘J_AC: disagreements {bad['W2']}   (sealed 0) · M_AB along J_AB: "
          f"{bad['W2ctl']} · the two gluings differ in {hit['W2differ']} of {trials}   (sealed > 0)")
    print(f" W3  the stone in Λ: failures {bad['W3']}   (sealed 0)")
    print(f" W4  M_AB and Λ agree on a ⇔ a ∈ Fix(h_A): disagreements {bad['W4']}   (sealed 0)")
    print(f" W5  C's two projections into M_AB land on one role ⇔ c ∈ Fix(h_C): disagreements {bad['W5']}   (sealed 0)")
    print(f" W6  re-cast C's two edges: M_AB moved in {bad['W6']} (structural 0) · Λ moved in {hit['W6moved']} of {trials}   (sealed > 0)")
    print(f" W7  Λ's born room = B ∖ dom J_BC and A ∖ im J_CA: failures {bad['W7']}   (sealed 0)")
    # the fixtures
    from inside_midpoint_trace import load
    recs = {"A": load("flow"), "B": load("t-cell"), "C": load("phi"), "D": load("triangle")}
    fx = {X: {"roles": recs[X]["roles"]} for X in "ABCD"}; rep = []; fbad = collections.Counter()
    for fp, tf, tp in itertools.product(J_FP, HAND_TF, HAND_TP):
        face(inv(HAND_TF[tf]), HAND_TP[tp], inv(J_FP[fp]), fx, fbad, collections.Counter(), recs, rep)
    print(f"\n FIXTURES (A = flow · B = t-cell · C = phi): W2 {fbad['W2']} · W2ctl {fbad['W2ctl']} · W3 {fbad['W3']} · W4 {fbad['W4']} · "
          f"W5 {fbad['W5']} · W7 {fbad['W7']}   (sealed 0 each)")
    col = lambda i: [r[i] for r in rep]
    print(f"   A–B pairs the person's midpoint M_AB glues (|J_AB|): {sorted(collections.Counter(col(0)).items())}")
    print(f"   A–B pairs the route child Λ glues (|proj_C|):         {sorted(collections.Counter(col(1)).items())}")
    print(f"   pairs the two children agree on (= Fix h_A):           {sorted(collections.Counter(col(2)).items())} — "
          f"triples where they agree on nothing: {sum(1 for x in col(2) if x == 0)} of 42")
    tot = collections.Counter()
    for r in rep: tot.update(r[5])
    print(f"   W5 — phi's 9 roles projected into M_AB, summed over the 42 triples: {dict(tot)}")
    print(f"   the ⊖ FORK — phi's tuples landing wholly on A–B roles of Λ: {sorted(collections.Counter(col(6)).items())} "
          f"(of {rep[0][7]} tuples in phi's record) — in {sum(1 for x in col(6) if x)} of 42 triples X would carry the opposite vertex's own relations if '⊖ J' kept them")

if __name__ == "__main__":
    run()

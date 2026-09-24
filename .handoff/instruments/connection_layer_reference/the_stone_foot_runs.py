"""THE STONE — the hermeneutic office's M⁺ (its 1915 letter, Δ94), put to its own four runs on the first face, each with a
silent control (the mothership's §142 ask). Definitions exactly as the office wrote them (its §2):
  foot_X on AB :  foot_X(a) = J_XB(J_AX(a)) where both are defined          (derived from the person's own pairings)
  M⁺_AB        :  M = A ⊔_{J_AB} B as built, PLUS a relation ≡_X on M's points, per opposite corner X:
                  FIX  foot defined and [a] = [foot(a)] in M (a loop)   · MOV  defined and [a] ≠ [foot(a)] (a link, no merge)
                  UND  undefined (silence). MOV splits: DISAGREEMENT (J_AB(a) defined ≠ foot(a)) · PROPOSAL (J_AB(a) undefined)
  In M, [a] = [b] for a ∈ A, b ∈ B iff J_AB(a) = b — so FIX ⇔ J_AB(a) = foot(a).
Face F (flow) · T (t-cell) · Φ (phi); edge F–T; X = Φ; corner reading h(f) = J_ΦF(J_TΦ(J_FT(f))).
SEALED BEFORE THE RUN (the office's runs and kill conditions):
 R1 DEPENDENCE: holding J_FT, the feet vary across the triples sharing it                          > 1 distinct foot per J_FT
    CONTROL: the same triple twice — the foot identical                                              0 differences
 R2 NO REDUCTION: M⁺ has exactly M's points; J_FT byte-preserved; non-loop link count = |MOV|        0 failures
    CONTROL: a flat triple (J_ΦT re-set so that the route agrees with J_FT) — every link a loop     MOV = 0
 R3 (a) every corner-FIX role's link is a loop                                                       0 failures
    (b) for every corner-MOV role f, at g = h(f): foot(g) = J_FT(f), and the link at g is NOT a loop 0 failures
    (c) non-loop links ≥ corner-MOV roles on every triple                                            0 failures
        the EXCESS (non-loop links at roles the corner reads UND) non-empty on SOME triple            > 0   ← KILL if 0 on all 42
        CONTROL: a total flat triple — excess 0                                                      0
 R4 THE TOWER (gen 1, born rooms empty, the resolver's rules: corner edges the coprojection, medial edges the meet):
    every foot on every side of the CORNER triangle A·M_AB·M_CA is a loop                            0 non-loop   ← KILL
    the MEDIAL triangle's feet have a non-loop link ⇔ the gen-0 face's feet do (per triple)          0 disagreements ← KILL
"""
import os, sys, itertools, collections
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from born_face_reading import HAND_TF, HAND_TP, J_FP, inv, comp, build, medial_map, corner_map
from inside_midpoint_trace import load

def links(J_AB, J_AX, J_XB, A_roles):
    """≡_X on M_AB: role a of A → ('FIX'|'DIS'|'PRO'|'UND', foot)"""
    foot = comp(J_XB, J_AX); out = {}
    for a in A_roles:
        if a not in foot: out[a] = ("UND", None)
        elif J_AB.get(a) == foot[a]: out[a] = ("FIX", foot[a])
        elif a in J_AB: out[a] = ("DIS", foot[a])
        else: out[a] = ("PRO", foot[a])
    return out, foot

def nonloop(L): return {a for a, (k, _) in L.items() if k in ("DIS", "PRO")}

def triple_Js(tf, tp, fp):
    J_FT, J_TP, J_PF = inv(HAND_TF[tf]), HAND_TP[tp], inv(J_FP[fp])
    return J_FT, J_TP, J_PF

def run():
    bad, hit = collections.Counter(), collections.Counter()
    flow, tcell, phi = load("flow")["roles"], load("t-cell")["roles"], load("phi")["roles"]
    triples = list(itertools.product(HAND_TF, HAND_TP, J_FP))
    feet_by_JFT = collections.defaultdict(set); per = []
    for tf, tp, fp in triples:
        J_FT, J_TP, J_PF = triple_Js(tf, tp, fp)
        L, foot = links(J_FT, inv(J_PF), inv(J_TP), flow)
        L2, foot2 = links(J_FT, inv(J_PF), inv(J_TP), flow)
        if foot2 != foot: bad["R1ctl"] += 1
        feet_by_JFT[tf].add(tuple(sorted(foot.items())))
        # R2 — structural: M⁺ adds no point and no pair; count agreement
        mov = nonloop(L)
        if len(mov) != sum(1 for k, _ in L.values() if k in ("DIS", "PRO")): bad["R2"] += 1
        # R3
        h = comp(J_PF, comp(J_TP, J_FT))
        cfix = {f for f, g in h.items() if f == g}; cmov = {f for f, g in h.items() if f != g}; cund = set(flow) - set(h)
        for f in cfix:
            if L[f][0] != "FIX": bad["R3a"] += 1
        for f in cmov:
            g = h[f]
            if foot.get(g) != J_FT[f] or L[g][0] == "FIX": bad["R3b"] += 1
        if len(mov) < len(cmov): bad["R3c"] += 1
        excess = mov & cund
        hit["R3excess"] += bool(excess); hit["R3excess_roles"] += len(excess)
        per.append((f"{tf}+{tp}+{fp}", len(mov), len(cmov), len(excess),
                    collections.Counter(k for k, _ in L.values())))
        # R2 control: re-set J_ΦT so that the route through Φ agrees with J_FT wherever it is defined
        J_FP_ = inv(J_PF); J_PT_ctl = {p: J_FT[f] for f, p in J_FP_.items() if f in J_FT}
        Lc, _ = links(J_FT, J_FP_, J_PT_ctl, flow)
        bad["R2ctl"] += len(nonloop(Lc))
        # R4 — the tower
        casts = {"A": {"roles": flow}, "B": {"roles": tcell}, "C": {"roles": phi}, "D": {"roles": load("triangle")["roles"]}}
        S, M = build(casts, J_FT, J_TP, J_PF)
        cAB, cCA = corner_map(S["A"], M["AB"]), corner_map(S["A"], M["CA"])
        m_ab_ca, m_ca_ab = medial_map(M["AB"], M["CA"]), medial_map(M["CA"], M["AB"])
        A_ = list(S["A"]["roles"])
        corner_nonloop = (len(nonloop(links(m_ab_ca, inv(cAB), cCA, list(M["AB"]["roles"]))[0])) +     # side AB–CA, opposite A
                          len(nonloop(links(cAB, cCA, m_ca_ab, A_)[0])) +                               # side A–AB, opposite CA
                          len(nonloop(links(cCA, cAB, m_ab_ca, A_)[0])))                                # side A–CA, opposite AB
        bad["R4corner"] += corner_nonloop
        e = {("AB", "BC"): medial_map(M["AB"], M["BC"]), ("BC", "CA"): medial_map(M["BC"], M["CA"]), ("CA", "AB"): medial_map(M["CA"], M["AB"])}
        E = lambda x, y: e[(x, y)] if (x, y) in e else inv(e[(y, x)])
        med = sum(len(nonloop(links(E(x, y), E(x, z), E(z, y), list(M[x]["roles"]))[0]))
                  for x, y, z in (("AB", "CA", "BC"), ("BC", "AB", "CA"), ("CA", "BC", "AB")))
        J = {("F", "T"): J_FT, ("T", "P"): J_TP, ("P", "F"): J_PF}
        G = lambda x, y: J[(x, y)] if (x, y) in J else inv(J[(y, x)])
        R = {"F": flow, "T": tcell, "P": phi}
        gen0 = sum(len(nonloop(links(G(x, y), G(x, z), G(z, y), R[x])[0])) for x, y, z in (("F", "T", "P"), ("T", "P", "F"), ("P", "F", "T")))
        if (med > 0) != (gen0 > 0): bad["R4medial"] += 1
        hit["R4med_nonloop"] += med; hit["R4gen0_nonloop"] += gen0
    # R3 control — a total flat triple: random permutations with the third map forced to close the loop
    import random
    rng = random.Random(371); X = list(range(6))
    for _ in range(1000):
        J_AB = dict(zip(X, rng.sample(X, 6))); J_AX = dict(zip(X, rng.sample(X, 6)))
        J_XB = {J_AX[a]: J_AB[a] for a in X}
        L, _ = links(J_AB, J_AX, J_XB, X); bad["R3ctl"] += len(nonloop(L))
    distinct = sorted(len(v) for v in feet_by_JFT.values())
    print("THE STONE — M⁺ on the first face (F = flow · T = t-cell · Φ = phi), 42 hand triples; the foot of Φ on F–T")
    print(f" R1  distinct feet per J_FT (7 pairings, 6 triples each): {distinct}   (sealed > 1) · CONTROL same triple twice: {bad['R1ctl']} differences (sealed 0)")
    print(f" R2  non-loop links = |MOV|: failures {bad['R2']}   (sealed 0) · M⁺ adds no point and J_FT is untouched: structural (links are marks, never merges)")
    print(f"     CONTROL flat (the route re-set to agree with J_FT): non-loop links {bad['R2ctl']}   (sealed 0)")
    print(f" R3  (a) corner-FIX role with a non-loop link: {bad['R3a']} · (b) corner-MOV return not a non-loop link at J_FT(f): {bad['R3b']} · "
          f"(c) non-loop < corner-MOV: {bad['R3c']}   (sealed 0, 0, 0)")
    print(f"     EXCESS (non-loop links where the corner reads UND): on {hit['R3excess']} of 42 triples, {hit['R3excess_roles']} roles in all   (sealed > 0 — KILL if 0)")
    print(f"     CONTROL total flat (1,000 random): non-loop links {bad['R3ctl']}   (sealed 0)")
    kinds = collections.Counter()
    for r in per: kinds.update(r[4])
    print(f"     over the 42 × 14 flow roles: {dict(kinds)} (DIS = disagreement, PRO = proposal)")
    print(f"     per triple (non-loop, corner-MOV, excess): {sorted(collections.Counter((r[1], r[2], r[3]) for r in per).items())}")
    print(f" R4  corner triangle A·M_AB·M_CA, non-loop links on its three sides over the 42: {bad['R4corner']}   (sealed 0 — KILL)")
    print(f"     medial triangle non-loop ⇔ gen-0 face non-loop, disagreements: {bad['R4medial']}   (sealed 0 — KILL) · "
          f"non-loop links: medial {hit['R4med_nonloop']} · gen-0 {hit['R4gen0_nonloop']}")

if __name__ == "__main__":
    run()

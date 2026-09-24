"""THE STONE'S FIFTH RUN — the hermeneutic office's 1915 §6.2 (the mothership's §146). P_AB = the gen-2 born vertex on the
medial edge M_BC–M_CA (= §19's Λ_C: halfway down C's median, glues A to B exactly along proj_C — W2, 0 disagreements).
CLAIMS, sealed before the run:
 F1 (the office's) the non-loop links of ≡_C on M⁺_AB correspond ONE-TO-ONE with the differences between M_AB's A–B
    relation (J_AB) and P_AB's (read from P_AB's own space) — the SYMMETRIC difference of the two pair sets
    MY EXPECTATION, stated before the run: it holds for ONE HALF only — every link is a pair of P_AB not of M_AB
    (foot ∖ J_AB, exactly), but the pairs of M_AB that P_AB lacks (J_AB ∖ foot) carry no link:
      links ↔ (P_AB ∖ M_AB): bijection failures                                                       0
      links ↔ (P_AB △ M_AB): triples where the counts differ                                          > 0
 F2 CONTROL — a flat face (the route re-set to agree with J_AB where defined): P_AB ∖ M_AB empty, 0 links   0 and 0
 F3 (the office's) R4's medial excess over the seed is exactly the medial links at roles holding a seed role of the
    corner the medial side shares: medial total − shared-corner links = gen-0 total, per triple             0 failures
"""
import os, sys, itertools, collections
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from born_face_reading import HAND_TF, HAND_TP, J_FP, inv, comp, build, medial_map
from midwife_frame_in_the_tower import route_space, ab_gluing
from the_stone_foot_runs import links, nonloop
from inside_midpoint_trace import load

def run():
    bad, hit = collections.Counter(), collections.Counter()
    R = {"A": load("flow")["roles"], "B": load("t-cell")["roles"], "C": load("phi")["roles"], "D": load("triangle")["roles"]}
    casts = {X: {"roles": R[X]} for X in "ABCD"}
    for tf, tp, fp in itertools.product(HAND_TF, HAND_TP, J_FP):
        J_AB, J_BC, J_CA = inv(HAND_TF[tf]), HAND_TP[tp], inv(J_FP[fp])
        S, M = build(casts, J_AB, J_BC, J_CA)
        P = route_space(M)
        pM, pP = set(J_AB.items()), ab_gluing(P)
        L, foot = links(J_AB, inv(J_CA), inv(J_BC), R["A"])
        lk = {(a, foot[a]) for a in nonloop(L)}
        if lk != pP - pM: bad["F1half"] += 1
        hit["F1sym_differs"] += len(lk) != len(pP ^ pM)
        hit["only_M"] += len(pM - pP); hit["only_P"] += len(pP - pM); hit["links"] += len(lk)
        # F2 control
        J_AC = inv(J_CA); J_CB_ctl = {J_AC[a]: J_AB[a] for a in J_AC if a in J_AB}
        Sc, Mc = build(casts, J_AB, inv(J_CB_ctl), J_CA); Pc = route_space(Mc)
        Lc, _ = links(J_AB, J_AC, J_CB_ctl, R["A"])
        bad["F2diff"] += len(ab_gluing(Pc) - set(J_AB.items())); bad["F2links"] += len(nonloop(Lc))
        # F3 — medial links by the shared corner
        e = {("AB", "BC"): medial_map(M["AB"], M["BC"]), ("BC", "CA"): medial_map(M["BC"], M["CA"]), ("CA", "AB"): medial_map(M["CA"], M["AB"])}
        E = lambda x, y: e[(x, y)] if (x, y) in e else inv(e[(y, x)])
        shared = {("AB", "CA"): "A", ("BC", "AB"): "B", ("CA", "BC"): "C"}
        med = sh = 0
        for x, y, z in (("AB", "CA", "BC"), ("BC", "AB", "CA"), ("CA", "BC", "AB")):
            Lm, _ = links(E(x, y), E(x, z), E(z, y), list(M[x]["roles"]))
            nl = nonloop(Lm); med += len(nl)
            sh += sum(1 for u in nl if any(X == shared[(x, y)] for X, _ in M[x]["roles"][u]))
        J = {("A", "B"): J_AB, ("B", "C"): J_BC, ("C", "A"): J_CA}
        G = lambda x, y: J[(x, y)] if (x, y) in J else inv(J[(y, x)])
        gen0 = sum(len(nonloop(links(G(x, y), G(x, z), G(z, y), R[x])[0])) for x, y, z in (("A", "B", "C"), ("B", "C", "A"), ("C", "A", "B")))
        if med - sh != gen0: bad["F3"] += 1
        hit["med"] += med; hit["sh"] += sh; hit["gen0"] += gen0
    print("THE STONE'S FIFTH RUN — M_AB against P_AB (A and B through C alone), 42 hand triples")
    print(f" F1  links = P_AB ∖ M_AB exactly: failures {bad['F1half']}   (sealed 0)")
    print(f"     links against the SYMMETRIC difference: counts differ on {hit['F1sym_differs']} of 42   (my expectation > 0) · "
          f"pairs only in M_AB {hit['only_M']} · only in P_AB {hit['only_P']} · links {hit['links']}")
    print(f" F2  CONTROL flat: P_AB ∖ M_AB {bad['F2diff']} · links {bad['F2links']}   (sealed 0, 0)")
    print(f" F3  medial − shared-corner links = gen-0: failures {bad['F3']} of 42   (sealed 0) · medial {hit['med']} · at shared-corner roles {hit['sh']} · gen-0 {hit['gen0']}")

if __name__ == "__main__":
    run()

"""THE RESPECT-PAIRING — the hermeneutic office's 2026-09-25 1347 letter §2, its P2 (the mothership's 1349 ask). Face
A = flow · B = t-cell · C = phi, the 42 hand triples; edge A–B; respect corner C.
A respect-pair a ↦ b ⟨c⟩ is GIVEN; the face reads it against the person's two legs. The office's words ("both legs given,
and they carry a, or c, elsewhere") leave one case open — a leg missing at one end while its other end is taken elsewhere —
so the reading is fixed LEG BY LEG before the run:
  leg A–C: KEPT if J_AC(a) = c · BROKEN if J_AC(a) is defined and ≠ c, or c is paired on A–C to another role · else OPEN
  leg C–B: KEPT if J_CB(c) = b · BROKEN if J_CB(c) is defined and ≠ b, or b is paired on C–B to another role · else OPEN
  HONORED = both KEPT · BROKEN = either BROKEN (the leg named) · NOT YET = otherwise
SEALED BEFORE THE RUN — P2 as the office wrote it, with my expectation where I disagree:
 P2a respects synthesized from the legs (c = J_AC(a), b = J_CB(c)) all read HONORED                    0 exceptions
     ⚠ VACUOUS BY CONSTRUCTION: they are made from the very legs they are read against — an implementation check
 P2b … and "the derived foot at a is a loop": the office says 0 exceptions. MY EXPECTATION: FALSE — the stone's
     loop is J_AB(a) = foot(a), and the synthesized b is the foot, so it is a loop exactly where the CORE agrees      > 0 exceptions
 P2c a wrong respect (c′ ≠ J_AC(a), c′ a role of C) never reads HONORED                                  0
     ⚠ VACUOUS BY CONSTRUCTION, as P2a
 P2d NON-VACUOUS reading: respects the person could plausibly give — every (a, b) with J_AB(a) = b and every
     c of C — fall into all three readings on the fixtures                                                HONORED, BROKEN, NOT YET all > 0
 P2e CONTROL: a respect-pair enters no gluing — M_AB's partition with respects equals it without            0 differences (structural)
"""
import os, sys, itertools, collections
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from born_face_reading import HAND_TF, HAND_TP, J_FP, inv, comp
from inside_midpoint_trace import load

def leg(J, x, y):
    if J.get(x) == y: return "KEPT"
    if x in J or y in inv(J): return "BROKEN"
    return "OPEN"

def reading(J_AC, J_CB, a, b, c):
    l1, l2 = leg(J_AC, a, c), leg(J_CB, c, b)
    if l1 == "KEPT" and l2 == "KEPT": return "HONORED", None
    if "BROKEN" in (l1, l2): return "BROKEN", "A–C" if l1 == "BROKEN" else "C–B"
    return "NOT YET", None

def run():
    flow, tcell, phi = load("flow")["roles"], load("t-cell")["roles"], load("phi")["roles"]
    bad, hit = collections.Counter(), collections.Counter(); P2d = collections.Counter(); broken_leg = collections.Counter()
    for tf, tp, fp in itertools.product(HAND_TF, HAND_TP, J_FP):
        J_AB, J_AC, J_CB = inv(HAND_TF[tf]), J_FP[fp], inv(HAND_TP[tp])
        foot = comp(J_CB, J_AC)
        for a in flow:
            if a in J_AC and J_AC[a] in J_CB:
                c = J_AC[a]; b = J_CB[c]; hit["P2a_n"] += 1
                if reading(J_AC, J_CB, a, b, c)[0] != "HONORED": bad["P2a"] += 1
                if J_AB.get(a) != foot[a]: hit["P2b_notloop"] += 1
                for c2 in phi:
                    if c2 == c: continue
                    hit["P2c_n"] += 1
                    if reading(J_AC, J_CB, a, b, c2)[0] == "HONORED": bad["P2c"] += 1
        for a, b in J_AB.items():
            for c in phi:
                r, l = reading(J_AC, J_CB, a, b, c); P2d[r] += 1
                if l: broken_leg[l] += 1
    print("THE RESPECT-PAIRING, P2 — face flow · t-cell · phi (respect corner phi), 42 hand triples")
    print(f" P2a synthesized respects read HONORED: exceptions {bad['P2a']} of {hit['P2a_n']}   (sealed 0 — vacuous by construction)")
    print(f" P2b the foot at a is a loop (the core agrees): NOT a loop in {hit['P2b_notloop']} of {hit['P2a_n']}   "
          f"(office: 0 · mine: > 0)")
    print(f" P2c a wrong respect read HONORED: {bad['P2c']} of {hit['P2c_n']}   (sealed 0 — vacuous by construction)")
    print(f" P2d every core pair × every role of phi as its respect: {dict(P2d)} · the broken leg: {dict(broken_leg)}   (all three > 0)")
    print(" P2e a respect-pair enters no gluing: structural — the pushout reads only J_AB (no instrument can fail it)")

if __name__ == "__main__":
    run()

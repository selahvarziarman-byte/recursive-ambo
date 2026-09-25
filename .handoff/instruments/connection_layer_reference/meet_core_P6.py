"""THE MEET-CORE and P6 (the hermeneutic office's 2026-09-25 1355 letter; the mothership's 1356 ask).
The act: the triad AS RESPECTS at a face X·Y·Z — (x, y, z) records x↦y⟨z⟩, y↦z⟨x⟩, x↦z⟨y⟩, merging nothing.
The meet-core (the office's §3): the core on an edge = the pairs given as respects in BOTH faces through it, plus any
unconditional pair. SEALED BEFORE THE RUN:
 P6a a face-section read against itself (each respect against the section's own other two legs) is HONORED   every time
     (VACUOUS by construction — the control that shows it)
 P6b the section's respect a↦b⟨c⟩ read against the CORE: BROKEN (J_AB(a) ≠ b) count = the foot's non-loop links at a,
     WHEN the section is synthesized from the core's legs (c = J_AC(a), b = J_CB(c)) — an identity: b IS the foot  0 disagreements
     … and for sections he could give independently (random triads on the face), the two counts are NOT the same   > 0
 M1  the meet of two faces' respect-pairs is not always one-to-one (respects are not): pools unless conflicts are
     left out                                                                                                     > 0
 M2  an edge whose second face has given no respect has an EMPTY meet (the core = his unconditional pairs alone)   0 exceptions
 M3  "no core byte moves" (the office's P6) CONTRADICTS the meet-core: a second face's respects change the core    > 0
"""
import random, itertools, collections, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from born_face_reading import HAND_TF, HAND_TP, J_FP, inv, comp
from inside_midpoint_trace import load
from the_stone_foot_runs import links, nonloop

def injective(pairs):
    a = collections.Counter(x for x, _ in pairs); b = collections.Counter(y for _, y in pairs)
    return all(v == 1 for v in a.values()) and all(v == 1 for v in b.values())

def run(seed=391):
    rng = random.Random(seed); bad, hit = collections.Counter(), collections.Counter()
    flow, tcell, phi = load("flow")["roles"], load("t-cell")["roles"], load("phi")["roles"]
    for tf, tp, fp in itertools.product(HAND_TF, HAND_TP, J_FP):
        J_AB, J_AC, J_CB = inv(HAND_TF[tf]), J_FP[fp], inv(HAND_TP[tp])
        L, foot = links(J_AB, J_AC, J_CB, flow); nl = nonloop(L)
        # P6a / P6b-identity: sections synthesized from the core's legs
        sec = [(a, J_AC[a], J_CB[J_AC[a]]) for a in flow if a in J_AC and J_AC[a] in J_CB]
        for a, c, b in sec:
            hit["P6a_n"] += 1                                   # against itself: x↦z⟨y⟩ vs x↦y, y↦z of the same triad
        broken = {a for a, c, b in sec if J_AB.get(a) != b}
        if broken != nl & {a for a, _, _ in sec}: bad["P6b_identity"] += 1
        # P6b-independent: random triads on the face, read against the core
        rsec = [(rng.choice(flow), rng.choice(phi), rng.choice(tcell)) for _ in range(len(sec) or 3)]
        rb = sum(1 for a, c, b in rsec if J_AB.get(a) != b)
        fl = sum(1 for a, c, b in rsec if a in nl)
        hit["P6b_indep_differs"] += rb != fl
    # M1–M3 on random tetrahedra: respects from triads on faces ABC and ABD, meet on A–B
    R = list(range(5))
    for _ in range(4000):
        t1 = [(rng.choice(R), rng.choice(R), rng.choice(R)) for _ in range(rng.randint(1, 5))]   # (a, c, b) on ABC
        t2 = [(rng.choice(R), rng.choice(R), rng.choice(R)) for _ in range(rng.randint(0, 5))]   # (a, d, b) on ABD
        p1 = {(a, b) for a, _, b in t1}; p2 = {(a, b) for a, _, b in t2}
        meet = p1 & p2
        hit["M1"] += not injective(meet)
        if not t2 and meet: bad["M2"] += 1
        hit["M3"] += bool(meet)                             # the core moved when the second face spoke
    print("THE MEET-CORE and P6")
    print(f" P6a a section read against itself: HONORED in {hit['P6a_n']} of {hit['P6a_n']} — vacuous by construction (the control)")
    print(f" P6b synthesized sections, BROKEN vs the foot's non-loop links: disagreements {bad['P6b_identity']} of 42 — an IDENTITY (b is the foot)")
    print(f"     independent sections (random triads), the two counts differ on {hit['P6b_indep_differs']} of 42   (sealed > 0)")
    print(f" M1  the meet of two faces' respects not one-to-one: {hit['M1']} of 4000   (sealed > 0 — conflicts must be left out, or it pools)")
    print(f" M2  a second face with no respects, meet non-empty: {bad['M2']}   (sealed 0 — the core is his unconditional pairs alone)")
    print(f" M3  the second face's respects moved the core: {hit['M3']} of 4000   (sealed > 0 — contradicts 'no core byte moves')")

if __name__ == "__main__":
    run()

"""THE CONCEPTUAL ANGLE — the hermeneutic office's candidate (its 2149, §2), made computable and put to its own tests P1–P3.
Arman chose ANGULAR flatness ("yes lets go with the angels"): a face is flat when its three angles close as a Euclidean
triangle's do, and an angle is triadic. The concept layer has no angle yet; the office offered one "to be killed".

THE CANDIDATE, AS WRITTEN: at C, read J_CA and J_CB from C — which roles of C each touches, and C's own tuples between the
A-ward and the B-ward roles; holds → SHARP (C's two relations nearly coincide), unrecorded → RIGHT (independent),
does-not-hold → STRAIGHT (opposed) (ADR 0023's glosses). The projection of C onto AB = the correspondence the SHARED roles
induce (the FOOT); the unshared roles are the HEIGHT.
MADE COMPUTABLE (my choices, each forced by an ambiguity in the words, stated before the run):
  at a corner X with neighbours Y, Z:  W_Y = the roles of X paired toward Y · W_Z = those paired toward Z
  BETWEEN = X's own tuples of arity ≥ 2 with a term in W_Y and a term, at ANOTHER position, in W_Z
  ANGLE   = the polarities found BETWEEN:  none → RIGHT · only holds → SHARP · only does-not-hold → STRAIGHT ·
            both → MIXED (the words give one class per corner; a corner whose record says both gets its own name)
  FOOT of X on YZ = the pairs (Y-role, Z-role) that X's SHARED roles (paired toward both) induce;
  it CENTRES iff it is non-empty and every one of its pairs is a pair of the direct edge YZ (it lands on the midpoint)

THE OFFICE'S TESTS (its §3), what can run:
  P1  the gate: on a regular face the projection must land at the midpoint; on a 45-45-90 atomic triangle, at the right-
      angle vertex. ⚠ NOT RUNNABLE as a whole: the record holds casts on the tetrahedron's first face only (no square
      face is cast), and the candidate has no position for a foot other than "centred / not" — it cannot say "at the
      vertex". Its regular-face half is P3 below.
  P2  the mirror on the seed: a regular face needs its three conceptual angles EQUAL (at this resolution, all SHARP —
      60° is sharp). Reported beside the Mov population (the holonomic breaches of §20.3), not sealed.
  P3  the foot centres ⇔ the angles at its edge's two ends are equal (the trigonometric fact, mirrored)

SEALED BEFORE THE RUN
 S0  (implementation) flow and phi declare no negatives ⇒ their corners are never STRAIGHT or MIXED             0
 S1  P3 on the 42 hand triples, all three edges: I expect the candidate NOT to mirror the fact — nothing in it ties
     an angle read from a cast's record to a foot read from the pairings                                   disagreements > 0
 S2  P3 on random faces (random casts with records of both polarities, random pairings): the same               disagreements > 0
 S3  re-casting C's two pairings moves C's foot (the span pushout M_AB, by construction, never moves)             > 0
 S4  the angular breaches (three angles not all equal) and the Mov breaches are DIFFERENT populations
     (some triple in one and not the other)                                                                      > 0
"""
import os, sys, random, itertools, collections
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from born_face_reading import HAND_TF, HAND_TP, J_FP, inv, comp
from inside_midpoint_trace import load

def angle(rec, W_Y, W_Z):
    pol = set()
    for (t, tup), v in rec.items():
        if len(tup) < 2: continue
        if any(tup[i] in W_Y and tup[j] in W_Z for i in range(len(tup)) for j in range(len(tup)) if i != j): pol.add(v)
    if not pol: return "right"
    if pol == {"holds"}: return "sharp"
    if pol == {"does-not-hold"}: return "straight"
    return "mixed"

def face_angles(recs, J_AB, J_BC, J_CA):
    """corners A, B, C; each corner's two pairings read from the corner"""
    J_AC, J_BA, J_CB = inv(J_CA), inv(J_AB), inv(J_BC)
    W = {"A": (set(J_AB), set(J_AC)), "B": (set(J_BA), set(J_BC)), "C": (set(J_CA), set(J_CB))}
    return {X: angle(recs[X], *W[X]) for X in "ABC"}

def foot(J_XY, J_XZ, J_YZ):
    """X's foot on YZ: the (Y-role, Z-role) pairs X's shared roles induce; centred iff non-empty and on the edge YZ"""
    F = {(J_XY[x], J_XZ[x]) for x in set(J_XY) & set(J_XZ)}
    return F, bool(F) and all(J_YZ.get(y) == z for y, z in F)

def feet(J_AB, J_BC, J_CA):
    J_AC, J_BA, J_CB = inv(J_CA), inv(J_AB), inv(J_BC)
    return {"C on AB": (foot(J_CA, J_CB, J_AB), ("A", "B")),
            "A on BC": (foot(J_AB, J_AC, J_BC), ("B", "C")),
            "B on CA": (foot(J_BC, J_BA, J_CA), ("C", "A"))}

def mov_breach(J_AB, J_BC, J_CA):
    hs = [comp(J_CA, comp(J_BC, J_AB)), comp(J_AB, comp(J_CA, J_BC)), comp(J_BC, comp(J_AB, J_CA))]
    return any(a != b for h in hs for a, b in h.items())

def rnd_pinj(X, Y, rng):
    k = rng.randint(0, min(len(X), len(Y))); xs = rng.sample(list(X), k); return dict(zip(xs, rng.sample(list(Y), k)))

def rnd_record(roles, rng, n_tuples=8):
    rec = {}
    for i in range(n_tuples):
        a, b = rng.sample(roles, 2); rec[(f"R{i % 3}", (a, b))] = rng.choice(["holds", "holds", "does-not-hold"])
    return rec

def run(seed_=331):
    bad, hit = collections.Counter(), collections.Counter()
    recs = {"A": load("flow")["rec"], "B": load("t-cell")["rec"], "C": load("phi")["rec"]}
    triples = list(itertools.product(J_FP, HAND_TF, HAND_TP)); rows = []
    for fp, tf, tp in triples:
        J_AB, J_BC, J_CA = inv(HAND_TF[tf]), HAND_TP[tp], inv(J_FP[fp])
        ang = face_angles(recs, J_AB, J_BC, J_CA)
        if ang["A"] in ("straight", "mixed") or ang["C"] in ("straight", "mixed"): bad["S0"] += 1
        ft = feet(J_AB, J_BC, J_CA)
        for name, ((F, centred), (Y, Z)) in ft.items():
            eq = ang[Y] == ang[Z]
            hit[("P3", centred, eq)] += 1
            if not F: hit["foot empty"] += 1
        rows.append((f"{fp}+{tf}+{tp}", ang, ft, mov_breach(J_AB, J_BC, J_CA)))
    # S3 — re-cast C's two pairings on the fixtures' casts
    rng = random.Random(seed_)
    phi_roles, flow_roles, t_roles = load("phi")["roles"], load("flow")["roles"], load("t-cell")["roles"]
    for fp, tf, tp in triples:
        J_AB, J_BC, J_CA = inv(HAND_TF[tf]), HAND_TP[tp], inv(J_FP[fp])
        (F0, _), _ = feet(J_AB, J_BC, J_CA)["C on AB"]
        for _ in range(20):
            J_BC2, J_CA2 = rnd_pinj(t_roles, phi_roles, rng), rnd_pinj(phi_roles, flow_roles, rng)
            (F1, _), _ = feet(J_AB, J_BC2, J_CA2)["C on AB"]
            hit["S3moved"] += F1 != F0; hit["S3tried"] += 1
    # S2 — random faces
    R = {X: [f"{X.lower()}{i}" for i in range(6)] for X in "ABC"}
    for _ in range(5000):
        rr = {X: rnd_record(R[X], rng) for X in "ABC"}
        J_AB, J_BC, J_CA = rnd_pinj(R["A"], R["B"], rng), rnd_pinj(R["B"], R["C"], rng), rnd_pinj(R["C"], R["A"], rng)
        ang = face_angles(rr, J_AB, J_BC, J_CA)
        for name, ((F, centred), (Y, Z)) in feet(J_AB, J_BC, J_CA).items():
            hit[("S2", centred, ang[Y] == ang[Z])] += 1
    # ── report ──
    dis = hit[("P3", True, False)] + hit[("P3", False, True)]
    print("THE CONCEPTUAL ANGLE — the office's candidate on the first face (A = flow · B = t-cell · C = phi), 42 hand triples")
    print(f" S0  flow or phi corner STRAIGHT or MIXED: {bad['S0']}   (sealed 0)")
    dist = collections.Counter(tuple(r[1][X] for X in "ABC") for r in rows)
    print(f" the three angles (flow, t-cell, phi) over the 42: {dict(sorted(dist.items()))}")
    allsharp = sum(1 for r in rows if all(r[1][X] == "sharp" for X in "ABC"))
    alleq = sum(1 for r in rows if len(set(r[1].values())) == 1)
    print(f" P2  all three EQUAL in {alleq} of 42 (all SHARP — the 60° mirror — in {allsharp})")
    ang_breach = {r[0] for r in rows if len(set(r[1].values())) > 1}; mov = {r[0] for r in rows if r[3]}
    print(f"     angular breaches {len(ang_breach)} · Mov breaches {len(mov)} · both {len(ang_breach & mov)} · angular only "
          f"{len(ang_breach - mov)} · Mov only {len(mov - ang_breach)} · neither {42 - len(ang_breach | mov)}   "
          f"S4 (different populations, sealed > 0): {len(ang_breach ^ mov)}")
    print(f" P3  the foot centres ⇔ equal angles at its edge's ends, 126 feet (42 × 3): centred & equal {hit[('P3', True, True)]} · "
          f"centred & unequal {hit[('P3', True, False)]} · off & equal {hit[('P3', False, True)]} · off & unequal {hit[('P3', False, False)]} "
          f"— disagreements {dis}   (S1 sealed > 0) · feet EMPTY (no shared role) {hit['foot empty']} of 126")
    d2 = hit[("S2", True, False)] + hit[("S2", False, True)]; n2 = sum(v for k, v in hit.items() if isinstance(k, tuple) and k[0] == "S2")
    print(f" S2  random faces (5,000 × 3 feet): disagreements {d2} of {n2}   (sealed > 0) · centred feet {hit[('S2', True, True)] + hit[('S2', True, False)]}")
    print(f" S3  re-cast C's two pairings: C's foot moved in {hit['S3moved']} of {hit['S3tried']}   (sealed > 0)")
    ex = rows[0]
    print(f" e.g. {ex[0]}: angles {ex[1]} · C's foot on AB {sorted(ex[2]['C on AB'][0][0])} centred {ex[2]['C on AB'][0][1]}")

if __name__ == "__main__":
    run()

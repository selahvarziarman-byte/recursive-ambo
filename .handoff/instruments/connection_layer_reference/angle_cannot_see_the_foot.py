"""WHY P3 CANNOT PASS for any angle read at a corner (a one-off beside conceptual_angle_candidate.py).
CLAIM (sealed before the run): a corner's angle read from WHICH roles its two pairings touch (and the corner's own record)
is unchanged when a pairing is permuted inside its own domain and image — but the opposite corner's FOOT is not: it
depends on WHICH role goes to WHICH. So a centred foot can be un-centred with every angle unchanged.
 Q1  permuting J_AB inside its domain and image never changes the three candidate angles           0 changes
 Q2  among faces whose foot of C on AB centres, some permutation of J_AB un-centres it              > 0 (all, if |J_AB| ≥ 2)
"""
import random, collections, itertools
from conceptual_angle_candidate import face_angles, feet, rnd_pinj, rnd_record
rng = random.Random(341); bad = collections.Counter(); hit = collections.Counter()
R = {X: [f"{X.lower()}{i}" for i in range(6)] for X in "ABC"}
while hit["centred faces"] < 2000:
    rr = {X: rnd_record(R[X], rng) for X in "ABC"}
    J_AB, J_BC, J_CA = rnd_pinj(R["A"], R["B"], rng), rnd_pinj(R["B"], R["C"], rng), rnd_pinj(R["C"], R["A"], rng)
    (F, centred), _ = feet(J_AB, J_BC, J_CA)["C on AB"]
    if not centred or len(J_AB) < 2: continue
    hit["centred faces"] += 1
    a0 = face_angles(rr, J_AB, J_BC, J_CA); broke = False
    keys = list(J_AB); vals = [J_AB[k] for k in keys]
    for perm in itertools.permutations(vals):
        if list(perm) == vals: continue
        J2 = dict(zip(keys, perm))
        if face_angles(rr, J2, J_BC, J_CA) != a0: bad["Q1"] += 1
        (_, c2), _ = feet(J2, J_BC, J_CA)["C on AB"]
        if not c2: broke = True
    hit["Q2"] += broke
print(f"Q1  angles changed by a permutation of J_AB inside its domain and image: {bad['Q1']}   (sealed 0)")
print(f"Q2  centred feet (|J_AB| ≥ 2) that some such permutation un-centres: {hit['Q2']} of {hit['centred faces']}   (sealed > 0)")

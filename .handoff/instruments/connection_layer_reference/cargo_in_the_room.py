"""THE CARGO — what the walker carries through a glued room (the mothership's 1102 §126.2, LEG 3; minimal, only what C-11
must build). Definitions fixed BEFORE the run:
  D1 THE CARGO is a role at a corner: a point (v, r), r ∈ R_v, of the family over the room's corners, UNTRUNCATED (§17.2 —
     never a class: a class would pool exactly the Mov the walk exists to show).
  D2 WHERE IT SITS: at a corner, or ON AN EDGE between two corners — there it is its image in the edge's midpoint concept
     M_e (both corners embed, §3.1, so it always has one) and it ARRIVES at the far corner iff that corner holds it
     (r ∈ dom J_e). Never in a face or a cell: those are readings, never walked (0031 §3.3). A DOOR LINK — a corner of a
     door face and its paired corner, one point of the glued form — has no length; the cargo crosses it by the door's
     transport at that corner (§18's descent datum e_c), or does not cross (a true absence, 0030 §1.2).
  D3 A WALK is a path in the GLUED ROOM'S 1-SKELETON: lifted edges (each read by its J, walked backward by J⁻¹) and door
     links (e_c, backward e_c⁻¹). Its transport is the composite partial map; the empty walk is the identity (1, never 0).
  D4 HOME = the walk closes at its starting corner; the reading is Fix · Mov · Und on that corner's roles; an Und is a
     SPUR iff the free-reduced walk carries the cargo home (0030 §2 rider). AWAY = two walks to one corner: they disagree
     in IDENTITY (both deliver, different roles) or in PRESENCE (one delivers, one loses).
THE ROOM (fixtures; mine — the record holds one face, a room needs a door): the §18 prism — the first face twice, bottom
  with hand triple X and top with hand triple Y (flow F · t-cell T · phi P), vertical edges the lifted copies (identity),
  and ONE door, top face → bottom face (F'↦F, T'↦T, P'↦P): the glued room is the triangle × a circle. The door's
  transport e is GIVEN; standing in for the person the instrument gives the largest lawful one it can build line by line
  (§18: equal-shape line pairs, lines taken in order) — ⚠ one lawful choice among many, marked.
SEALED BEFORE THE RUN
 K1 composition is a functor on the walk: a walk and its reverse compose to inverse maps                     0 failures
 K2 CURVATURE through the door — the door loop at F (F → F' → door → F) brings a cargo home MOVED
    in some rooms                                                                                                     > 0
 K3 PRESENCE route-dependent — the door loop at F and the loop round the side (F → T → T' → door → T → F), both once
    round the room, disagree on which cargos arrive, in some rooms                                                     > 0
 K4 IDENTITY route-dependent — the same two loops both deliver a cargo, as different roles, in some rooms               > 0
 K5 a spur never moves a cargo: inserting F → T → F into a loop only restricts it                                0 failures
 K6 CONTROL (the room's T³): X = Y, the door the identity — the door loop returns every role of F unchanged       0 moved 0 lost
 K7 CONTROL (total, flat): random bijections, X = Y, door the identity — nothing moved, nothing lost, the two loops
    never disagree                                                                                                  0, 0, 0
"""
import os, sys, random, itertools, collections
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from born_face_reading import HAND_TF, HAND_TP, J_FP, inv, comp
from descent_at_the_door import line_structure, line_pair_map, lawful
from inside_midpoint_trace import load

def face_Js(tf, tp, fp):
    return [inv(HAND_TF[tf]), HAND_TP[tp], inv(J_FP[fp])]              # F→T, T→P, P→F

def given_door(JY, JX, corners):
    """largest lawful door transport built line by line: equal-shape lines paired in order (a stand-in for the person)"""
    LY, _ = line_structure(JY, corners); LX, _ = line_structure(JX, corners)
    e = [dict() for _ in range(3)]; used = set()
    for i, ly in enumerate(LY):
        for j, lx in enumerate(LX):
            if j in used or lx["shape"] != ly["shape"]: continue
            for c, d in line_pair_map(ly, lx, 0, 3).items(): e[c].update(d)
            used.add(j); break
    assert lawful(e, JY, JX)
    return e

def room(JX, JY, e, corners):
    """the glued room's 1-skeleton: node → {neighbour: partial map}"""
    names = ["F", "T", "P"]; G = collections.defaultdict(dict)
    def link(a, b, m): G[a][b] = m; G[b][a] = inv(m)
    for i in range(3):
        a, b = names[i], names[(i + 1) % 3]
        link(a, b, JX[i]); link(a + "'", b + "'", JY[i])
        link(a, a + "'", {r: r for r in corners[i]})               # the vertical edge: the lifted copy
    for i in range(3):
        G[names[i] + "'"][names[i] + "*"] = e[i]                   # the door link, top → bottom (kept apart from the edge)
        G[names[i] + "*"][names[i] + "'"] = inv(e[i])
    return G

def walk(G, path, start_roles):
    h = {r: r for r in start_roles}                               # the empty walk is the identity
    for a, b in zip(path, path[1:]): h = comp(G[a][b], h)
    return h

def door_home(G, corners):
    """the door link lands on the bottom corner itself: 'X*' IS the corner X, reached across the door. The door link and the
    vertical edge both join X and X' — parallel edges, kept apart by naming the door's end 'X*', which walks on as X."""
    # ⛔ AMENDED AFTER THE FIRST RUN (2026-09-24 15:02; kept: RESULTS_2026-09-24_cargo_in_the_room_run1_K2-K4-fired.txt):
    # the first version assigned G[m][n] = G[m][base] for EVERY neighbour m of the base corner — including the top corner
    # X', whose link to X* IS the door — so the door link was overwritten by the vertical identity, every door loop read
    # the identity, and K2 and K4 fired at 0 of 1,764. The door is never overwritten now (setdefault).
    for n in [n for n in G if n.endswith("*")]:
        base = n[:-1]
        for m, mp in list(G[base].items()):
            G[n].setdefault(m, mp); G[m].setdefault(n, G[m][base])
    return G

def run(seed_=351):
    bad, hit = collections.Counter(), collections.Counter()
    casts = [load("flow")["roles"], load("t-cell")["roles"], load("phi")["roles"]]
    triples = list(itertools.product(HAND_TF, HAND_TP, J_FP))
    DOOR = ["F", "F'", "F*"]; SIDE = ["F", "T", "T'", "T*", "F"]; SPURRED = ["F", "T", "F", "F'", "F*"]
    ex = {}
    for (tf, tp, fp), (tf2, tp2, fp2) in itertools.product(triples, triples):
        JX, JY = face_Js(tf, tp, fp), face_Js(tf2, tp2, fp2)
        e = given_door(JY, JX, casts)
        G = door_home(room(JX, JY, e, casts), casts)
        F = casts[0]
        hd, hs = walk(G, DOOR, F), walk(G, SIDE, F)
        for p in (DOOR, SIDE, ["F", "T", "P", "F"], ["F", "F'", "P'", "P*", "F"]):
            h, hr = walk(G, p, F), walk(G, p[::-1], F)
            if inv({a: b for a, b in h.items()}) != {a: b for a, b in hr.items() if a in h.values()} or \
               any(hr.get(b) != a for a, b in h.items()): bad["K1"] += 1
        mov = any(a != b for a, b in hd.items())
        hit["K2"] += mov
        pres = set(hd) != set(hs); ident = any(hd[a] != hs[a] for a in set(hd) & set(hs))
        hit["K3"] += pres; hit["K4"] += ident
        hsp = walk(G, SPURRED, F)
        if any(hd.get(a) != b for a, b in hsp.items()): bad["K5"] += 1
        hit["spur-lost"] += bool(set(hd) - set(hsp))
        hit["door-empty-at-F"] += not e[0]
        if (tf, tp, fp) == (tf2, tp2, fp2):
            hit["K6n"] += 1
            if mov: bad["K6moved"] += 1
            if len(hd) != len(F): bad["K6lost"] += 1
        for k, flag in (("K2", mov), ("K3", pres), ("K4", ident)):
            if flag and k not in ex:
                ex[k] = (f"{tf}+{tp}+{fp}", f"{tf2}+{tp2}+{fp2}", sorted((a, b) for a, b in hd.items() if a != b)[:3] if k == "K2"
                         else (sorted(set(hd) ^ set(hs))[:4] if k == "K3" else sorted((a, hd[a], hs[a]) for a in set(hd) & set(hs) if hd[a] != hs[a])[:2]))
    # K7 — total flat control
    rng = random.Random(seed_); R = [list(range(5))] * 3
    for _ in range(2000):
        JX = [dict(zip(range(5), rng.sample(range(5), 5))) for _ in range(3)]
        e = given_door(JX, JX, R); G = door_home(room(JX, JX, e, R), R)
        hd, hs = walk(G, DOOR, R[0]), walk(G, SIDE, R[0])
        bad["K7moved"] += any(a != b for a, b in hd.items()); bad["K7lost"] += len(hd) != 5; bad["K7disagree"] += hd != hs
    n = len(triples) ** 2
    print(f"THE CARGO IN A GLUED ROOM — {n} rooms (bottom triple X × top triple Y over the 42 hand triples), one door")
    print(f" K1  reverse walk = inverse map: failures {bad['K1']}   (sealed 0)")
    print(f" K2  the door loop brings a cargo home MOVED: {hit['K2']} of {n} rooms   (sealed > 0) · e.g. {ex.get('K2')}")
    print(f" K3  PRESENCE differs between the door loop and the side loop: {hit['K3']} of {n}   (sealed > 0) · e.g. {ex.get('K3')}")
    print(f" K4  IDENTITY differs (both deliver, different roles): {hit['K4']} of {n}   (sealed > 0) · e.g. {ex.get('K4')}")
    print(f" K5  a spur moved a cargo: {bad['K5']}   (sealed 0) · rooms where the spur loses a cargo the door loop delivers: {hit['spur-lost']}")
    print(f" K6  CONTROL X = Y, door the identity ({hit['K6n']} rooms): moved {bad['K6moved']} · lost {bad['K6lost']}   (sealed 0, 0)")
    print(f" K7  CONTROL total and flat (2,000 rooms): moved {bad['K7moved']} · lost {bad['K7lost']} · loops disagree {bad['K7disagree']}   (sealed 0, 0, 0)")
    print(f"     rooms whose given door carries nothing at F (every cargo crossing there arrives Und): {hit['door-empty-at-F']} of {n}")

if __name__ == "__main__":
    run()

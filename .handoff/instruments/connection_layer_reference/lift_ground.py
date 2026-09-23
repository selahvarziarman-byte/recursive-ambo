"""THE LIFT's GROUND (the mothership's 1535 §4 item 3; claims §111.4) — two definitional questions, grounded.

PART L · CONTEXT.md's collision — when a cast is lifted into the playground, where "a vertex IS a proposition":
  COLLAPSE the cast's roles into one proposition, or REFINE the playground's grain (roles become 0-cells)?
  My reading: NEITHER — CARRY. 0030 §1.1 (ratified): "A vertex CARRIES a concept; it is not one." The space rides as the
  FIBER over one base vertex; the base grain is untouched (0031's boundary: the op-set does not bend); nothing is erased
  (the lift law). This part measures what COLLAPSE would erase on the record's own first face (Flow · T · Φ, 42 triples).
  Collapse has two honest forms, and both are measured: the record DROPPED (one proposition, no inside) or KEPT (every
  tuple folds onto the one point).
  SEALED:  L1  collapsed (record dropped), every triple reads the same one residue                     distinct readings → 1
           L2  collapsed (record dropped), no refusal can exist                                        refusals 6 → 0
           L2' collapsed (record KEPT): T's own record folds into contradictions — T refused as a cast   > 0 contradictions
               (added before the run: the first draft modelled only the dropped record)
           L3  uncollapsed (the carried space), the 42 triples' residues are many and distinct          > 1

PART R · THE 0030 §2 RIDER — the two cargo readings re-derived for PARTIAL symmetries (mechanism-agnostic: a WORD of
  transports composed; its reduced form in the free group). The cargo is a role; it arrives Fix · Mov · Und.
  SEALED (random P-connections on a graph with cycles; words with spurs inserted):
           R1  J(w) is a RESTRICTION of J(w_reduced) (spurs only lose; they never move)                 0 failures
           R2  a word trivial in the free group composes to a PARTIAL IDENTITY — Mov empty              0 failures
               ⇒ at HOME, MOV is never a spur: it is the loop's residue (0030's curvature)
           R3  some cargo is LOST TO A SPUR — in dom J(w_reduced) but not in dom J(w)                    > 0
               ⇒ at HOME, UND is the loop's residue OR a spur — told apart by the reduced word
           R4  "DIAGONAL" (every J a partial identity on one role set): no word ever MOVES a cargo       0 failures
           R5  … yet two words to one endpoint can disagree on whether the cargo ARRIVES                 > 0
               ⇒ 0030's scope clause holds for the identity of the cargo and FAILS for its presence
           R6  CONTROL — total J's (the classical sub-case): nothing is ever lost, presence never
               route-dependent                                                                           0 and 0
"""
import random, itertools, collections

def inv(f): return {v: k for k, v in f.items()}
def comp(g, f): return {x: g[y] for x, y in f.items() if y in g}                  # g∘f, f first

# ─── PART L ──────────────────────────────────────────────────────────────────────────────────────────────
HAND_TF = {"A": {"r9":"F8","r1":"F7","r0":"F1","r2":"F12","r8":"F13"}, "B'": {"r9":"F3","r1":"F9","r0":"F5","r7":"F13","r8":"F1","r2":"F7"},
           "C": {"r9":"F12","r1":"F13","r0":"F9","r6":"F1","r2":"F3"}, "D": {"r9":"F12","r1":"F1","r0":"F2","r7":"F7","r2":"F5"},
           "S1": {"r0":"F13","r1":"F9","r2":"F1","r4":"F12","r6":"F3","r8":"F7"}, "S4": {"r0":"F13","r1":"F9","r2":"F1","r6":"F3","r7":"F5","r8":"F7"},
           "S2": {"r0":"F9","r1":"F3","r2":"F13","r6":"F10","r7":"F5","r8":"F12"}}
HAND_TP = {"P": {"r0":"Φ1","r1":"Φ2","r2":"Φ7","r4":"Φ5","r6":"Φ3"}, "Q": {"r9":"Φ6","r1":"Φ1","r0":"Φ8","r7":"Φ5","r6":"Φ2"},
           "R": {"r0":"Φ1","r1":"Φ6","r7":"Φ5","r2":"Φ7","r4":"Φ8"}}
J_FP = {"(i)": {"F7":"Φ1","F8":"Φ2","F5":"Φ7"}, "(ii)": {"F1":"Φ3","F2":"Φ2","F3":"Φ4","F5":"Φ1"}}

def part_L():
    from face_residue_reading import corner_local_refusals
    from inside_midpoint_trace import load
    T = load("t-cell")
    readings_carried, readings_collapsed, ref_carried, ref_collapsed = set(), set(), 0, 0
    for fp, tf, tp in itertools.product(J_FP, HAND_TF, HAND_TP):
        J_FT, J_TP, J_PF = inv(HAND_TF[tf]), HAND_TP[tp], inv(J_FP[fp])
        h = comp(J_PF, comp(J_TP, J_FT))                                            # base Flow: F → T → Φ → F
        readings_carried.add(tuple(sorted(h.items())))
        hT = comp(J_FT, comp(J_PF, J_TP))                                            # base T
        ref_carried += bool(corner_local_refusals(T, hT))
        # COLLAPSE: each cast is ONE point; an edge holds the point-pair iff its J held any pair
        one = lambda J: {"•": "•"} if J else {}
        hc = comp(one(J_PF), comp(one(J_TP), one(J_FT)))
        readings_collapsed.add(tuple(sorted(hc.items())))
        Tc = {"roles": ["•"], "rec": {}, "marks": {}}                               # collapse that DROPS the record
        ref_collapsed += bool(corner_local_refusals(Tc, hc))
    # collapse that KEEPS the record: every tuple folds onto (•, …, •) — does the cast stay a function?
    folded = {}
    for nm in ("flow", "t-cell", "phi"):
        X = load(nm); seen, contra = {}, 0
        for (t, tup), v in X["rec"].items():
            k = (t, len(tup))
            if k in seen and seen[k] != v: contra += 1
            else: seen[k] = v
        folded[nm] = (len(X["rec"]), len(seen), contra)
    print("PART L · the collision, on the first face (42 hand triples)")
    print(f"   CARRIED (the space as fiber): {len(readings_carried)} distinct residues at base Flow · triples refused at T: {ref_carried}")
    print(f"   COLLAPSED, record DROPPED: {len(readings_collapsed)} distinct residue(s) {sorted(readings_collapsed)} · refused: {ref_collapsed}")
    for nm, (n, m, c) in folded.items():
        print(f"   COLLAPSED, record KEPT — {nm:6s}: {n} tuples fold to {m}; contradictions inside the cast itself: {c}"
              + ("  ⇒ the cast is REFUSED at the cast" if c else ""))
    print(f"   L1 {'✔' if len(readings_collapsed) == 1 else '⛔'}   L2 {'✔' if ref_collapsed == 0 else '⛔'} (6 → {ref_collapsed})   "
          f"L2' T self-contradicts when its record is kept: {'✔' if folded['t-cell'][2] > 0 else '⛔'}   L3 {'✔' if len(readings_carried) > 1 else '⛔'}")

# ─── PART R ──────────────────────────────────────────────────────────────────────────────────────────────
def random_graph(rng, nv=5, extra=3):
    E = [(i, (i + 1) % nv) for i in range(nv)]                                    # a cycle …
    while len(E) < nv + extra:                                                     # … plus chords (more independent cycles)
        a, b = rng.sample(range(nv), 2)
        if (a, b) not in E and (b, a) not in E: E.append((a, b))
    return E

def connection(rng, E, roles, kind):
    J = {}
    for e in E:
        if kind == "partial":
            xs = rng.sample(roles, rng.randint(0, len(roles))); J[e] = dict(zip(xs, rng.sample(roles, len(xs))))
        elif kind == "diagonal":
            xs = rng.sample(roles, rng.randint(0, len(roles))); J[e] = {x: x for x in xs}
        else:                                                                       # total: a permutation
            ys = roles[:]; rng.shuffle(ys); J[e] = dict(zip(roles, ys))
    return J

def step_map(J, a, b):
    return J[(a, b)] if (a, b) in J else inv(J[(b, a)])

ROLES = [f"r{i}" for i in range(5)]
def walk(J, path):
    """AMENDED after the first run: the EMPTY word's transport is the IDENTITY (1), never the empty map (0) — the first run
    returned {} for a one-vertex path, and R1 fired 302 times on exactly those words (0031 §6 invariant 4, the vacuity
    pair, committed in this instrument). Run kept: RESULTS_2026-09-23_lift_ground_run1_empty-word-read-as-0.txt"""
    h = {r: r for r in ROLES}
    for a, b in zip(path, path[1:]):
        h = comp(step_map(J, a, b), h)
    return h

def reduce_path(path):
    """free reduction of a vertex path: drop every immediate back-track a → b → a"""
    out = []
    for v in path:
        if len(out) >= 2 and out[-2] == v: out.pop()
        else: out.append(v)
    return out

def random_closed_walk(rng, E, start, length):
    adj = collections.defaultdict(list)
    for a, b in E: adj[a].append(b); adj[b].append(a)
    p = [start]
    while len(p) < length or p[-1] != start:
        p.append(rng.choice(adj[p[-1]]))
        if len(p) > length + 30: break
    return p if p[-1] == start else None

def with_spurs(rng, path, E):
    adj = collections.defaultdict(list)
    for a, b in E: adj[a].append(b); adj[b].append(a)
    out = [path[0]]
    for v in path[1:]:
        if rng.random() < 0.4:
            u = rng.choice(adj[out[-1]]); out += [u, out[-1]]                      # an out-and-back excursion
        out.append(v)
    return out

def part_R(trials=4000, seed_=281):
    rng = random.Random(seed_); roles = ROLES
    bad, hit = collections.Counter(), collections.Counter()
    for kind in ("partial", "diagonal", "total"):
        for _ in range(trials):
            E = random_graph(rng); J = connection(rng, E, roles, kind)
            p = random_closed_walk(rng, E, 0, rng.randint(3, 9))
            if not p: continue
            w = with_spurs(rng, p, E); wr = reduce_path(w)
            hw, hr = walk(J, w), walk(J, wr)
            if kind == "partial":
                if any(hr.get(x) != y for x, y in hw.items()): bad["R1"] += 1        # hw must be a restriction of hr
                if len(wr) == 1 and any(x != y for x, y in hw.items()): bad["R2"] += 1   # null-homotopic → partial identity
                if len(wr) == 1: hit["R2n"] += 1
                if set(hr) - set(hw): hit["R3"] += 1
            if kind == "diagonal":
                if any(x != y for x, y in hw.items()): bad["R4"] += 1
                q = random_closed_walk(rng, E, 0, rng.randint(3, 9))                    # a second route home
                if q:
                    hq = walk(J, q)
                    if set(hw) != set(hq): hit["R5"] += 1
            if kind == "total":
                if len(hw) != len(roles): bad["R6lost"] += 1
                q = random_closed_walk(rng, E, 0, rng.randint(3, 9))
                if q and set(walk(J, q)) != set(hw): bad["R6pres"] += 1
    print(f"\nPART R · the 0030 §2 rider — {trials} random connections per kind (5 vertices, 8 edges, 5 roles), closed words with spurs")
    for k in ("R1", "R2", "R4"):
        print(f"   {k}  failures {bad[k]:5d}   sealed 0   {'✔' if bad[k] == 0 else '⛔ SEAL FIRED'}" + (f"   (over {hit['R2n']} null-homotopic words)" if k == "R2" else ""))
    for k in ("R3", "R5"):
        print(f"   {k}  occurrences {hit[k]:5d}   sealed > 0   {'✔' if hit[k] else '⛔ SEAL FIRED'}")
    print(f"   R6  CONTROL (total): lost {bad['R6lost']} · presence route-dependent {bad['R6pres']}   sealed 0 and 0   "
          f"{'✔' if bad['R6lost'] == 0 and bad['R6pres'] == 0 else '⛔ SEAL FIRED'}")

if __name__ == "__main__":
    part_L(); part_R()

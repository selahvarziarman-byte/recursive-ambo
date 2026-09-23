"""THE FACE AT GEN ≥ 1 — five definitions the next front needs (the mothership's 1327 §5), on the fixtures, vacuity-checked.
Seeds: A = flow (14 roles) · B = t-cell (10) · C = phi (9) · D = triangle (3). Seed edges: A–B, B–C, C–A from the first
face's hand triples (42 = 2 × 7 × 3); A–D, B–D, C–D EMPTY (unmapped — the disjoint union, lawful). One dissection:
M_AB, M_BC, M_CA, M_AD. Three kinds of born face (all computed by the resolver's rule — CORNER edge: the gluing's own
coprojection; MEDIAL edge: the MEET over everything both endpoints hold ∪ born pairs):
  MEDIAL triangle     M_AB · M_BC · M_CA   — inside the seed face ABC (a boundary face; one cell)
  INTERIOR triangle   M_AB · M_CA · M_AD   — around A, between the corner cell at A and the core (TWO cells)
  CORNER-CELL face    A · M_AB · M_CA      — in the seed face ABC, the corner cell's (a boundary face; one cell)

SEALED BEFORE THE RUN — the mothership's disclosed expectation (a) is the thing to kill:
 (a1) INTERIOR triangle, born rooms empty: holonomy at M_AB = the identity on M_AB's A-part, undefined elsewhere   0 fail
 (a2) CORNER-CELL face, born rooms empty: holonomy at A = 1 on ALL of A (flat and total)                         0 fail
 (a3) MEDIAL triangle, born rooms empty: holonomy at M_AB = ι_A ∘ (J_CA ∘ J_BC) ∘ ι_B⁻¹ — determined by gen 0     0 fail
      … on the GLUED part it is h_A transported (ι_A ∘ h_A ∘ ι_A⁻¹)                                                 0 fail
      … and it ALSO MOVES B-only roles into A-roles, which no reading based at A mentions        > 0 on the fixtures
      (my derivation, and the amendment to the expectation's "the seed face's own h, transported" if it holds)
 (a4) MONOTONE: every face's holonomy with born pairs EXTENDS its born-room-empty holonomy                    0 fail
      … and every added route uses at least one born pair (the news IS the born pairs' contribution)          0 fail
 (b1) MEDIAL triangle, born room empty: its world (the partition of seed roles) = the seed face's world         0 diff
      ⇒ its corner-local refusals are the seed face's — on the fixtures, T in 6 of 42, flow 0, phi 0 (inherited)
 (b2) INTERIOR triangle and CORNER-CELL face, born rooms empty: 0 refusals (a star and a path: no cycle)        0
 (b3) with born pairs, refusals only GROW (solid ⊆ born)                                                        0 fail
      [FIRED on the first run, 5 of 1,680 — kept: RESULTS_…_run1_b3-at-the-named-grain.txt. The seal compared the
       tuple the check happened to MEET FIRST; extra merges change which tuple is met first. Re-stated at the grains the
       claim is about: the FACE still refuses (0 failures) and every contradicted PAIR of tuples stays contradicted
       (0 failures). Lesson for the build: a refusal names PAIRS, or its naming shifts though nothing un-contradicted.]
 (d1) every Und role at a born face has EXACTLY ONE first-break edge                                            0 fail
 (d2) born rooms empty: a break at the edge LEAVING a born vertex M_XY descends from the silence of its own
      parent edge X–Y (the role's X-seed unpaired there)                                                         0 fail
 (e1) INTERIOR triangle walked both ways, with born pairs: the Und sets differ                                  > 0
Not sealed (reported): (b3)'s NEW refusals, (c)'s domain sizes, (d3) whether a born slot is free at a break.
"""
import os, sys, json, random, itertools, collections
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from space_of_resolver import glue
from g3_meet_vs_parent import meet
from inside_midpoint_trace import load, MOLD_TYPE, mold_join

def seed_space(X, cast):
    return {"name": X, "roles": {(X, r): frozenset({(X, r)}) for r in cast["roles"]}, "words": {}, "inj": {}, "winj": {}, "parents": ()}

def inv(f): return {v: k for k, v in f.items()}
def comp(g, f): return {x: g[y] for x, y in f.items() if y in g}          # g∘f, f first

HAND_TF = {"A": {"r9":"F8","r1":"F7","r0":"F1","r2":"F12","r8":"F13"}, "B'": {"r9":"F3","r1":"F9","r0":"F5","r7":"F13","r8":"F1","r2":"F7"},
           "C": {"r9":"F12","r1":"F13","r0":"F9","r6":"F1","r2":"F3"}, "D": {"r9":"F12","r1":"F1","r0":"F2","r7":"F7","r2":"F5"},
           "S1": {"r0":"F13","r1":"F9","r2":"F1","r4":"F12","r6":"F3","r8":"F7"}, "S4": {"r0":"F13","r1":"F9","r2":"F1","r6":"F3","r7":"F5","r8":"F7"},
           "S2": {"r0":"F9","r1":"F3","r2":"F13","r6":"F10","r7":"F5","r8":"F12"}}
HAND_TP = {"P": {"r0":"Φ1","r1":"Φ2","r2":"Φ7","r4":"Φ5","r6":"Φ3"}, "Q": {"r9":"Φ6","r1":"Φ1","r0":"Φ8","r7":"Φ5","r6":"Φ2"},
           "R": {"r0":"Φ1","r1":"Φ6","r7":"Φ5","r2":"Φ7","r4":"Φ8"}}
J_FP = {"(i)": {"F7":"Φ1","F8":"Φ2","F5":"Φ7"}, "(ii)": {"F1":"Φ3","F2":"Φ2","F3":"Φ4","F5":"Φ1"}}

def tagged(J, X, Y): return [((X, a), (Y, b)) for a, b in J.items()]

def build(casts, J_AB, J_BC, J_CA):
    """gen 0 → gen 1 through the resolver: seeds, their midpoints, and the edge maps of the three born faces"""
    S = {X: seed_space(X, casts[X]) for X in "ABCD"}
    M = {"AB": glue(S["A"], S["B"], tagged(J_AB, "A", "B"), [], "M_AB"),
         "BC": glue(S["B"], S["C"], tagged(J_BC, "B", "C"), [], "M_BC"),
         "CA": glue(S["C"], S["A"], tagged(J_CA, "C", "A"), [], "M_CA"),
         "AD": glue(S["A"], S["D"], [], [], "M_AD")}                            # unmapped: the disjoint union
    return S, M

def medial_map(U, V, born_pairs=()):
    """the medial edge U → V: the MEET (composed) ∪ the person's born pairs — as a partial injection U-ids → V-ids"""
    pairs, _, _ = meet(U, V)
    f = dict(pairs)
    for x, y in born_pairs: f[x] = y
    return f

def corner_map(Xseed, Mid):                                                   # the gluing's own coprojection X → M
    return dict(Mid["inj"][Xseed["name"]])

def loop(maps):
    """compose a closed walk's edge maps in order (the first map applied first)"""
    h = dict(maps[0])
    for f in maps[1:]: h = comp(f, h)
    return h

def first_break(x, maps, labels):
    cur = x
    for f, lab in zip(maps, labels):
        if cur not in f: return lab
        cur = f[cur]
    return None

def free_born_slots(U, V):
    """roles of U outside the meet's domain and roles of V outside its image (where a born pair may land)"""
    pairs, _, _ = meet(U, V)
    dom, im = {a for a, _ in pairs}, {b for _, b in pairs}
    return [r for r in U["roles"] if r not in dom], [r for r in V["roles"] if r not in im]

def rnd_born(U, V, rng, k_max=2):
    lu, lv = free_born_slots(U, V)
    k = rng.randint(0, min(len(lu), len(lv), k_max))
    return list(zip(rng.sample(lu, k), rng.sample(lv, k)))

def world(spaces, edge_pairs):
    """the face's glued world: union-find over every role of its vertices' spaces and every edge pair; returns the
    partition of SEED roles it induces (seed tag → class id)"""
    par = {}
    def f(z):
        par.setdefault(z, z)
        while par[z] != z: par[z] = par[par[z]]; z = par[z]
        return z
    for nm, sp in spaces.items():
        for r in sp["roles"]: f((nm, r))
    for (u, x), (v, y) in edge_pairs:
        p, q = f((u, x)), f((v, y))
        if p != q: par[p] = q
    seedcls = {}
    for (nm, r) in list(par):
        for s in spaces[nm]["roles"][r]: seedcls.setdefault(s, set()).add(f((nm, r)))
    return seedcls

def corner_refusals(seedcls, recs):
    """corner-local refusals: a seed corner's OWN record under the merges the world makes (the mold's type through its
    join) — sufficient for refusal, not necessary"""
    out = []
    for X, rec in recs.items():
        par = {}
        def f(z):
            par.setdefault(z, z)
            while par[z] != z: par[z] = par[par[z]]; z = par[z]
            return z
        by_cls = collections.defaultdict(list)
        for s, cls in seedcls.items():
            if s[0] != X: continue
            for c in cls: by_cls[c].append(s[1])
        for rs in by_cls.values():
            for r in rs[1:]:
                p, q = f(rs[0]), f(r)
                if p != q: par[p] = q
        seen = {}
        for (t, tup), v in rec["rec"].items():
            k = (t, tuple(f(x) for x in tup))
            if k in seen and seen[k] != v: out.append((X, t, tup))
            else: seen[k] = v
        mseen = {}
        for (k, x), v in rec["marks"].items():
            if v == "UNKNOWN": continue
            key = (k, f(x))
            if key in mseen:
                j = mold_join(mseen[key], v) if k == MOLD_TYPE else (v if v == mseen[key] else None)
                if j is None: out.append((X, k, (x,)))
                else: mseen[key] = j
            else: mseen[key] = v
    return out

def contradicted_pairs(seedcls, recs):
    """the grain monotonicity is about: PAIRS of one corner's original tuples, with different values, that the merges collapse"""
    out = set()
    for X, rec in recs.items():
        par = {}
        def f(z):
            par.setdefault(z, z)
            while par[z] != z: par[z] = par[par[z]]; z = par[z]
            return z
        by = collections.defaultdict(list)
        for s_, cls in seedcls.items():
            if s_[0] == X:
                for c in cls: by[c].append(s_[1])
        for rs in by.values():
            for r in rs[1:]:
                p, q = f(rs[0]), f(r)
                if p != q: par[p] = q
        keyed = collections.defaultdict(list)
        for (t, tup), v in rec["rec"].items(): keyed[(t, tuple(f(x) for x in tup))].append(((t, tup), v))
        for items in keyed.values():
            for (k1, v1), (k2, v2) in itertools.combinations(items, 2):
                if v1 != v2: out.add((X, tuple(sorted([k1, k2]))))
    return out

def seed_world(J_AB, J_BC, J_CA):
    par = {}
    def f(z):
        par.setdefault(z, z)
        while par[z] != z: par[z] = par[par[z]]; z = par[z]
        return z
    for (x, y) in tagged(J_AB, "A", "B") + tagged(J_BC, "B", "C") + tagged(J_CA, "C", "A"):
        p, q = f(x), f(y)
        if p != q: par[p] = q
    return f

def run(seed_=261, born_draws=40):
    recs = {"A": load("flow"), "B": load("t-cell"), "C": load("phi"), "D": load("triangle")}
    casts = {X: {"roles": recs[X]["roles"]} for X in "ABCD"}
    rng = random.Random(seed_)
    bad = collections.Counter(); hit = collections.Counter(); stat = collections.Counter()
    ref_solid = collections.Counter(); ref_gen0 = collections.Counter(); ref_born_new = collections.Counter()
    triples = list(itertools.product(J_FP, HAND_TF, HAND_TP))
    for fp, tf, tp in triples:
        J_AB, J_BC, J_CA = inv(HAND_TF[tf]), HAND_TP[tp], inv(J_FP[fp])            # flow→T · T→Φ · Φ→flow
        S, M = build(casts, J_AB, J_BC, J_CA)
        iA, iB = M["AB"]["inj"]["A"], M["AB"]["inj"]["B"]
        # ── the three born faces, born rooms EMPTY ──
        e1, e2, e3 = medial_map(M["AB"], M["BC"]), medial_map(M["BC"], M["CA"]), medial_map(M["CA"], M["AB"])
        h_med = loop([e1, e2, e3])
        f1, f2, f3 = medial_map(M["AB"], M["CA"]), medial_map(M["CA"], M["AD"]), medial_map(M["AD"], M["AB"])
        h_int = loop([f1, f2, f3])
        c1, c3 = corner_map(S["A"], M["AB"]), inv(corner_map(S["A"], M["CA"]))
        h_cc = loop([c1, f1, c3])                                                # A → M_AB → M_CA → A
        # (a1) interior triangle: the identity on M_AB's A-part
        a_part = set(iA.values())
        if h_int != {m: m for m in a_part}: bad["a1"] += 1
        # (a2) corner-cell face: 1 on ALL of A
        if h_cc != {(("A", r)): ("A", r) for r in casts["A"]["roles"]}: bad["a2"] += 1
        # (a3) medial triangle: ι_A ∘ (J_CA ∘ J_BC) ∘ ι_B⁻¹
        route = comp({("C", c): ("A", a) for c, a in J_CA.items()}, {("B", b): ("C", c) for b, c in J_BC.items()})   # B → C → A
        want = {m: iA[route[b]] for b, m in iB.items() if b in route}
        if h_med != want: bad["a3"] += 1
        h_A = {("A", a): ("A", J_CA[J_BC[J_AB[a]]]) for a in J_AB if J_AB[a] in J_BC and J_BC[J_AB[a]] in J_CA}
        glued = {iA[("A", a)] for a in J_AB}
        on_glued = {m: h_med[m] for m in h_med if m in glued}
        if on_glued != {iA[a]: iA[b] for a, b in h_A.items()}: bad["a3g"] += 1
        b_only_moved = [m for m in h_med if m not in glued]
        stat["a3_b_only_moved"] += len(b_only_moved); hit["a3more"] += bool(b_only_moved)
        stat["glued"] += len(glued); stat["dom_hA"] += len(h_A); stat["dom_med"] += len(h_med)
        stat["fix_med"] += sum(1 for m, n in h_med.items() if m == n)
        # (b1) medial triangle's world = the seed face's world; (b2) interior & corner-cell: no refusal
        sp_med = {"AB": M["AB"], "BC": M["BC"], "CA": M["CA"]}
        w_med = world(sp_med, [(("AB", x), ("BC", y)) for x, y in e1.items()] + [(("BC", x), ("CA", y)) for x, y in e2.items()]
                      + [(("CA", x), ("AB", y)) for x, y in e3.items()])
        fs = seed_world(J_AB, J_BC, J_CA)
        # compare as partitions of seed roles of A ⊔ B ⊔ C
        def as_partition(assign):
            g = collections.defaultdict(set)
            for s, key in assign.items(): g[key].add(s)
            return frozenset(frozenset(v) for v in g.values())
        seeds_abc = [(X, r) for X in "ABC" for r in casts[X]["roles"]]
        p1 = as_partition({s: frozenset(w_med[s]) for s in seeds_abc})
        p0 = as_partition({s: fs(s) for s in seeds_abc})
        if p1 != p0: bad["b1"] += 1
        if any(len(v) != 1 for v in w_med.values()): bad["one_class"] += 1       # the refusal check assumes it; counted, not assumed
        r_med = corner_refusals(w_med, {X: recs[X] for X in "ABC"})
        for X, *_ in r_med: ref_solid[X] += 1
        if r_med: ref_solid["triples"] += 1
        sp_int = {"AB": M["AB"], "CA": M["CA"], "AD": M["AD"]}
        w_int = world(sp_int, [(("AB", x), ("CA", y)) for x, y in f1.items()] + [(("CA", x), ("AD", y)) for x, y in f2.items()]
                      + [(("AD", x), ("AB", y)) for x, y in f3.items()])
        if corner_refusals(w_int, recs): bad["b2"] += 1
        # (d1)(d2) the medial triangle's Und addresses, born room empty
        labels = ["M_AB→M_BC", "M_BC→M_CA", "M_CA→M_AB"]
        for m in M["AB"]["roles"]:
            if m in h_med: continue
            fb = first_break(m, [e1, e2, e3], labels)
            if fb is None: bad["d1"] += 1; continue
            stat["und_med"] += 1; stat["und@" + fb] += 1
            # descent: leaving M_AB the role is not in the B-part ⇔ its A-seed is unpaired on A–B (or it is B-only and
            # the route breaks later) — check the rule "a break leaving M_XY descends from the silence of X–Y"
            if fb == "M_AB→M_BC":
                if any(s[0] == "B" for s in M["AB"]["roles"][m]): bad["d2"] += 1                # it holds a B-seed: not a silence of A–B
            if fb == "M_BC→M_CA":
                y = e1[m]
                if any(s[0] == "C" for s in M["BC"]["roles"][y]): bad["d2"] += 1
            if fb == "M_CA→M_AB":
                y = e2[e1[m]]
                if any(s[0] == "A" for s in M["CA"]["roles"][y]): bad["d2"] += 1
        # (d3) at a break on the edge leaving M_AB, is a born slot free for that role there?
        lu, lv = free_born_slots(M["AB"], M["BC"])
        for m in M["AB"]["roles"]:
            if m not in h_med and first_break(m, [e1, e2, e3], labels) == "M_AB→M_BC":
                stat["d3_breaks"] += 1; stat["d3_free"] += (m in lu and len(lv) > 0)
        # ── with BORN pairs: several random draws on the fixture spaces ──
        for _ in range(born_draws):
            b1, b2, b3 = rnd_born(M["AB"], M["BC"], rng), rnd_born(M["BC"], M["CA"], rng), rnd_born(M["CA"], M["AB"], rng)
            g1, g2, g3 = medial_map(M["AB"], M["BC"], b1), medial_map(M["BC"], M["CA"], b2), medial_map(M["CA"], M["AB"], b3)
            hb = loop([g1, g2, g3])
            # (a4) monotone, and every added route uses a born pair
            if any(hb.get(m) != n for m, n in h_med.items()): bad["a4"] += 1
            for m in hb:
                if m in h_med: continue
                hit["news"] += 1
                x1 = m; used = (x1, g1[x1]) in set(b1); x2 = g1[x1]; used |= (x2, g2[x2]) in set(b2); x3 = g2[x2]; used |= (x3, g3[x3]) in set(b3)
                if not used: bad["a4news"] += 1
            wb = world(sp_med, [(("AB", x), ("BC", y)) for x, y in g1.items()] + [(("BC", x), ("CA", y)) for x, y in g2.items()]
                       + [(("CA", x), ("AB", y)) for x, y in g3.items()])
            rb = corner_refusals(wb, {X: recs[X] for X in "ABC"})
            if not set(map(tuple, r_med)) <= set(map(tuple, rb)): stat["b3_named_grain"] += 1       # the run-1 seal's grain, kept as a count
            if r_med and not rb: bad["b3"] += 1                                                    # the FACE stopped refusing
            if not contradicted_pairs(w_med, {X: recs[X] for X in "ABC"}) <= contradicted_pairs(wb, {X: recs[X] for X in "ABC"}): bad["b3pair"] += 1
            if len(rb) > len(r_med): ref_born_new["draws"] += 1
            stat["draws"] += 1
            # (e1) the INTERIOR triangle with born pairs, both directions
            i1, i2, i3 = rnd_born(M["AB"], M["CA"], rng), rnd_born(M["CA"], M["AD"], rng), rnd_born(M["AD"], M["AB"], rng)
            k1, k2, k3 = medial_map(M["AB"], M["CA"], i1), medial_map(M["CA"], M["AD"], i2), medial_map(M["AD"], M["AB"], i3)
            fwd = loop([k1, k2, k3]); bwd = loop([inv(k3), inv(k2), inv(k1)])
            und_f = set(M["AB"]["roles"]) - set(fwd); und_b = set(M["AB"]["roles"]) - set(bwd)
            if und_f != und_b: hit["e1"] += 1
            stat["int_moves"] += sum(1 for m, n in fwd.items() if m != n)
    n = len(triples)
    print(f"THE FACE AT GEN ≥ 1 — the fixtures: A=flow B=t-cell C=phi D=triangle; {n} hand triples on A–B–C; D's edges unmapped; "
          f"{born_draws} born-pair draws per triple")
    for k in ("a1", "a2", "a3", "a3g", "a4", "a4news", "b1", "b2", "b3", "b3pair", "d1", "d2", "one_class"):
        print(f"   {k:6s} failures {bad[k]:5d}   sealed 0     {'✔' if bad[k] == 0 else '⛔ SEAL FIRED'}")
    print(f"   a3more  triples where the medial loop MOVES a B-only role into an A-role: {hit['a3more']} of {n}   sealed > 0   {'✔' if hit['a3more'] else '⛔ SEAL FIRED'}")
    print(f"   e1      interior triangle, both ways, Und sets differ: {hit['e1']} of {stat['draws']} draws   sealed > 0   {'✔' if hit['e1'] else '⛔ SEAL FIRED'}")
    print(f"   VACUITY (sums over the {n} triples): glued roles at M_AB {stat['glued']} · dom h_A {stat['dom_hA']} · dom of the medial loop {stat['dom_med']} "
          f"(of which Fix {stat['fix_med']}) · B-only roles the medial loop moves {stat['a3_b_only_moved']}")
    print(f"   (b1) inherited refusals, born room empty — triples refusing: {ref_solid['triples']} of {n} · refusals by corner: "
          f"flow {ref_solid['A']} · T {ref_solid['B']} · phi {ref_solid['C']}")
    print(f"   (b3) born draws that add a refusal: {ref_born_new['draws']} of {stat['draws']} · (the run-1 NAMED-grain count, an artifact of first-met naming: {stat['b3_named_grain']})")
    print(f"   (d)  Und at M_AB on the medial triangle (sum over triples): {stat['und_med']} — first break "
          f"M_AB→M_BC {stat['und@M_AB→M_BC']} · M_BC→M_CA {stat['und@M_BC→M_CA']} · M_CA→M_AB {stat['und@M_CA→M_AB']}")
    print(f"   (d3) breaks at M_AB→M_BC with a FREE born slot for that role: {stat['d3_free']} of {stat['d3_breaks']}")
    print(f"   (a4) news: routes that exist only through a born pair: {hit['news']} over {stat['draws']} draws; interior-triangle moves (born only): {stat['int_moves']}")

if __name__ == "__main__":
    run()

"""DESCENT AT THE DOOR — do the lifted edges' J's DETERMINE a door's transport? (the mothership's 1643 §3; ADR 0028 §1.4 in
the concept layer's form; my §16.3 named the question, my §17.4 answered it for TOTAL corner maps — this file tests that
answer where the device lives: PARTIAL maps.)

THE SETTING — definitions, fixed before the run
  A DOOR pairs face A with face B, both k-gons: corner i of A ↦ corner i of B (the door's corner map; a reversing door is the
  same with B's boundary read the other way, so its edge maps are the inverses — the random doors below cover both).
  The lifted layer rides along: a cast at every corner; on A's boundary edge i → i+1 a partial iso J_i; on B's, K_i.
  The door's concept TRANSPORT is e = (e_0 … e_{k-1}), e_i : P(a_i) ⇀ P(b_i) a partial iso — ADR 0030 §1.2 at the corner
  grain, ADR 0031's type (roles here; words obey the same algebra; the record is checked as for any J).
  DESCENT (0028 §1.4: "descends iff equivariant along the identification"), in this layer's form. In the glued form the two
  boundary edges ARE one edge, so the two ways across each STRIP (the door's identification over edge i) must be one
  transport:
                 (N_i)    e_{i+1} ∘ J_i  =  K_i ∘ e_i        as PARTIAL maps — values AND domains.
  (The homotopy quotient keeps a_i and b_i apart, joined by the door — 0030 §0: the layer TRANSPORTS, it does not pool; the
  strip between two edges the form makes ONE has no width, so it is FILLED. Faces and edge-cycles are not filled: they stay
  READINGS — 0031 §3.3, 0030 §1.4.)
  ⛔ AMENDED AFTER THE FIRST RUN (2026-09-23 17:23; its RESULTS kept: RESULTS_2026-09-23_descent_at_the_door_run1_N-read-one-way.txt).
  D1 fired (414 of 445 doors; fold 256 of 300) and D5's brute half with it (93; fold 66): the brute force checked (N_i) as
  written above — ONE diagonal of the strip, the door read from A to B — and it admits e's the line characterization does not:
  a pair x ↦ y where A's line runs on and B's stops is lawful A → B (both routes lose the cargo) — but a walker crossing the
  other way, B → A, finds its presence depending on WHERE it crosses (measured on the first failing door: walk B's edge,
  then cross back — it arrives; cross back first, then walk A's edge — it is lost). A door is crossed both ways (0030 §1.3:
  capitals for inverses, τ(g⁻¹) = τ(g)⁻¹), so descent must hold for the door read from EITHER face:
                 (N_i)    e_{i+1} ∘ J_i  =  K_i ∘ e_i         and        (N_i′)   e_{i+1}⁻¹ ∘ K_i  =  J_i ∘ e_i⁻¹
  (in a groupoid the two are one equation; in an inverse category they are not — the partiality lives exactly in the
  difference). The line characterization I sealed was the TWO-WAY reading's all along (D2's propagation is lockstep both
  ways — it held); my (N) was written one-way. Re-run below against the two-way (N), nothing else changed except:
 D10 (NEW, sealed before the re-run) the ONE-WAY reading depends on which face is called A: e lawful for A → B while e⁻¹ is
     NOT lawful for the same door read B → A                                                                     > 0
     (the two-way reading is symmetric by its form — structural, not a measurement)
  A LINE of a face: a component of the graph its boundary's J's draw on the roles of its corners. Each role has at most one
  successor and one predecessor, so a line is a PATH (it starts at corner s and runs l edges) or a CYCLE (it closes after m
  rounds of the face). Its SHAPE: ('path', s, l) or ('cycle', m). A role's PLACE: its distance from its path's start (on a
  cycle the roles at one corner are alike up to the phase).
  REJECTED READING, measured so the choice is not idle (D9): the JOIN — the glued corner's space is the amalgam
  P(a_i) ⊔_{e_i} P(b_i), the glued edge carries J_i ∨ K_i, lawful iff that is a partial iso on the amalgams. It POOLS the
  carriers' concepts at the glued corner — the op-set's quotient, which 0030 §0 names this layer's opposite.

SEALED BEFORE THE RUN
 D1  (N) on every strip ⇔ e is a union of WHOLE LINE-PAIRS of EQUAL SHAPE, each role paired at its own place
     (exhaustive — every e — on small random doors: k = 3 and 4, and a FOLD door that shares an edge)      0 disagreements
     … and the number of lawful e's = ∏ over shapes of Σ_j C(a,j) C(b,j) j! m^j   (m = 1 for paths)       0 disagreements
 D2  ONE POINTED PAIR (x ↦ y at corner i): its least lawful extension exists ⇔ x's and y's lines have equal shape
     and x, y the same place; and it is exactly the whole line-pair                                            0 disagreements
 D3  the EMPTY transport always descends — the TRUE ABSENCE of 0030 §1.2 is always lawful                        0 failures
     CONTROL: most e's do not                                                                                   refused > 0
 D4  TOTAL sub-case (every J, K a bijection): a transport total at every corner exists ⇔ the two residues are
     conjugate (same cycle type) — §17.4's criterion, exact here                                                0 disagreements
 D5  PARTIAL: a lawful transport TOTAL AT THE BASE exists ⇔ the lines touching the base have equal shape
     multisets (against the exhaustive set)                                                                     0 disagreements
     … ⇒ §17.4's criterion (same cycle–path type of the residues at the base)                                   0 failures
     … ⇐ FAILS: §17.4's criterion holds and no lawful transport total at the base exists                          > 0
 D6  every lawful e makes the glued face read ONE residue: e_0 ∘ h_A = h_B ∘ e_0                                  0 failures
 D7  CURVATURE IS NOT A DESCENT FAILURE: on the fold door (ABC ↦ ABD about AB) lawful e's that MOVE a role at the
     hinge corner A exist                                                                                        > 0
 D9  (doors whose two faces share no corner — the join is modelled there only) the JOIN accepts every lawful e    0 failures
     … and accepts e's that (N) refuses                                                                          > 0
 D8  ON THE FIXTURES — the room a prism: two copies of the first face (F · T · Φ, the corners flow · t-cell · phi), the
     translation door F ↦ F, T ↦ T, Φ ↦ Φ; the 42 × 42 ordered pairs of hand triples. Reported, not sealed, except:
        a door between two copies of ONE triple descends with e = the identity, record included                   42 of 42
        every gift taken by (shape, place) completes to a lawful e                                                0 failures
        a transport total at F by (N) ⇒ §17.4's criterion at F                                                    0 failures
"""
import os, sys, itertools, collections, random, math
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
from lift_in_type_theory import cycle_path_type

def inv(f): return {v: k for k, v in f.items()}
def comp(g, f): return {x: g[y] for x, y in f.items() if y in g}                  # g∘f, f first
def key(e): return tuple(tuple(sorted(d.items(), key=repr)) for d in e)

# ─── the objects ─────────────────────────────────────────────────────────────────────────────────────────────
def lawful_one_way(e, J, K):
    """the FIRST run's (N): one diagonal of each strip — the door read from A to B only"""
    k = len(J)
    return all(comp(e[(i + 1) % k], J[i]) == comp(K[i], e[i]) for i in range(k))

def lawful(e, J, K):
    """(N) AMENDED: both diagonals — the door read from either face"""
    k = len(J)
    return all(comp(e[(i + 1) % k], J[i]) == comp(K[i], e[i]) and
               comp(inv(e[(i + 1) % k]), K[i]) == comp(J[i], inv(e[i])) for i in range(k))

def line_structure(J, corners):
    """the LINES of a face: paths from every role with no predecessor, then cycles anchored at corner 0"""
    k = len(J); Jinv = [inv(j) for j in J]; L = []
    for i in range(k):
        for r in corners[i]:
            if r in Jinv[(i - 1) % k]: continue
            nodes, c, x = [(i, r)], i, r
            while x in J[c]:
                x = J[c][x]; c = (c + 1) % k; nodes.append((c, x))
            L.append({"kind": "path", "nodes": nodes, "shape": ("path", i, len(nodes) - 1)})
    covered = {n for ln in L for n in ln["nodes"]}
    for r in sorted(corners[0], key=repr):
        if (0, r) in covered: continue
        nodes, c, x = [(0, r)], 0, r
        while True:
            x = J[c][x]; c = (c + 1) % k
            if (c, x) == (0, r): break
            nodes.append((c, x))
        L.append({"kind": "cycle", "nodes": nodes, "shape": ("cycle", len(nodes) // k)})
        covered.update(nodes)
    assert covered == {(i, r) for i in range(k) for r in corners[i]}, "a role on no line"
    place = {n: (lid, idx) for lid, ln in enumerate(L) for idx, n in enumerate(ln["nodes"])}
    return L, place

def line_pair_map(la, lb, q, k):
    na, nb = la["nodes"], lb["nodes"]; e = collections.defaultdict(dict)
    for p, (c, x) in enumerate(na):
        c2, y = nb[p] if la["kind"] == "path" else nb[(p + q * k) % len(nb)]
        assert c == c2; e[c][x] = y
    return e

def all_lawful_by_lines(LA, LB, k):
    shapes = sorted(set(l["shape"] for l in LA) & set(l["shape"] for l in LB))
    per = []
    for s in shapes:
        a = [i for i, l in enumerate(LA) if l["shape"] == s]; b = [i for i, l in enumerate(LB) if l["shape"] == s]
        m = s[1] if s[0] == "cycle" else 1; opts = []
        for j in range(min(len(a), len(b)) + 1):
            for xs in itertools.combinations(a, j):
                for ys in itertools.permutations(b, j):
                    for qs in itertools.product(range(m), repeat=j):
                        opts.append(list(zip(xs, ys, qs)))
        per.append(opts)
    for choice in itertools.product(*per):
        e = [dict() for _ in range(k)]
        for opts in choice:
            for la, lb, q in opts:
                for c, d in line_pair_map(LA[la], LB[lb], q, k).items(): e[c].update(d)
        yield e

def count_formula(LA, LB):
    ca = collections.Counter(l["shape"] for l in LA); cb = collections.Counter(l["shape"] for l in LB); n = 1
    for s in set(ca) & set(cb):
        a, b, m = ca[s], cb[s], (s[1] if s[0] == "cycle" else 1)
        n *= sum(math.comb(a, j) * math.comb(b, j) * math.factorial(j) * m ** j for j in range(min(a, b) + 1))
    return n

def extend(i, x, y, J, K):
    """the least lawful e containing x ↦ y at corner i, or (None, the first place the two lines part)"""
    k = len(J); Ji = [inv(j) for j in J]; Ki = [inv(j) for j in K]
    e = [dict() for _ in range(k)]; er = [dict() for _ in range(k)]; stack = [(i, x, y)]
    while stack:
        c, a, b = stack.pop()
        if a in e[c] or b in er[c]:
            if e[c].get(a) != b or er[c].get(b) != a: return None, ("the lines close after different rounds", c, a, b)
            continue
        e[c][a] = b; er[c][b] = a; n, p = (c + 1) % k, (c - 1) % k
        if (a in J[c]) != (b in K[c]): return None, (f"along {c}→{n} one continues and the other stops", c, a, b)
        if a in J[c]: stack.append((n, J[c][a], K[c][b]))
        if (a in Ji[p]) != (b in Ki[p]): return None, (f"into {c} from {p} one has a predecessor and the other has none", c, a, b)
        if a in Ji[p]: stack.append((p, Ji[p][a], Ki[p][b]))
    return e, None

def gift_lawful_by_lines(i, x, y, SA, SB):
    (LA, pa), (LB, pb) = SA, SB
    la, ia = pa[(i, x)]; lb, ib = pb[(i, y)]
    if LA[la]["shape"] != LB[lb]["shape"]: return False, None
    if LA[la]["kind"] == "path": return ia == ib, (la, lb, 0)
    return True, (la, lb, ia, ib)

def join_ok(e, J, K):
    """the REJECTED reading: glued corner = the amalgam over e_i; glued edge = J_i ∨ K_i; lawful iff a partial iso there"""
    k = len(J)
    def cls(c, side, r):
        if side == "A": return ("pair", r) if r in e[c] else ("A", r)
        er = inv(e[c]); return ("pair", er[r]) if r in er else ("B", r)
    for i in range(k):
        j = (i + 1) % k; par = {}
        def f(u):
            par.setdefault(u, u)
            while par[u] != u: par[u] = par[par[u]]; u = par[u]
            return u
        def un(u, v): par[f(u)] = f(v)
        for a, b in J[i].items(): un(("A", i, a), ("A", j, b))
        for a, b in K[i].items(): un(("B", i, a), ("B", j, b))
        for c in (i, j):
            for a, b in e[c].items(): un(("A", c, a), ("B", c, b))
        at_i, at_j = collections.defaultdict(set), collections.defaultdict(set)
        for (side, c, r) in list(par):
            (at_i if c == i else at_j)[f((side, c, r))].add(cls(c, side, r))
        if any(len(s) > 1 for s in at_i.values()) or any(len(s) > 1 for s in at_j.values()): return False
    return True

def pinjs(X, Y):
    out = []
    for j in range(min(len(X), len(Y)) + 1):
        for xs in itertools.combinations(X, j):
            for ys in itertools.permutations(Y, j): out.append(dict(zip(xs, ys)))
    return out

def residue(J):
    """the face's residue at corner 0, walking 0 → 1 → … → 0"""
    h = J[0]
    for j in J[1:]: h = comp(j, h)
    return h

def rnd_pinj(X, Y, rng):
    k = rng.randint(0, min(len(X), len(Y))); xs = rng.sample(list(X), k); return dict(zip(xs, rng.sample(list(Y), k)))

def touching_base(L):
    return collections.Counter(l["shape"] for l in L if any(c == 0 for c, _ in l["nodes"]))

# ─── D1–D3, D5 (brute), D6, D9 on exhaustive small doors; D7 on fold doors ───────────────────────────────────
def exhaustive(rng, bad, hit, k, n, trials, fold=False):
    R = list(range(n))
    for _ in range(trials):
        if fold:   # corners A, B, C, D; face A = (A, B, C), face B = (A, B, D); the door A↦A, B↦B, C↦D
            J_AB, J_BC, J_CA, J_BD, J_DA = (rnd_pinj(R, R, rng) for _ in range(5))
            J, K = [J_AB, J_BC, J_CA], [J_AB, J_BD, J_DA]
        else:
            J = [rnd_pinj(R, R, rng) for _ in range(k)]; K = [rnd_pinj(R, R, rng) for _ in range(k)]
        cA = cB = [R] * len(J); SA, SB = line_structure(J, cA), line_structure(K, cB)
        S1 = set(); tot0 = False; total = 0
        for combo in itertools.product(*[pinjs(R, R) for _ in range(len(J))]):
            e = list(combo); total += 1; ok = lawful(e, J, K)
            one = lawful_one_way(e, J, K)
            if one and not ok: hit["D10oneonly"] += 1
            if one and not lawful_one_way([inv(d) for d in e], K, J): hit["D10"] += 1
            if ok:
                S1.add(key(e))
                if len(e[0]) == n: tot0 = True
                if comp(e[0], residue(J)) != comp(residue(K), e[0]): bad["D6"] += 1
                if fold and any(x != y for x, y in e[0].items()): hit["D7"] += 1
                if not fold and not join_ok(e, J, K): bad["D9"] += 1       # the join is modelled for disjoint faces only
            else:
                hit["D3ctl"] += 1
                if not fold and n == 2 and join_ok(e, J, K): hit["D9"] += 1
            if not any(e) and not ok: bad["D3"] += 1
        S2 = {key(e) for e in all_lawful_by_lines(SA[0], SB[0], len(J))}
        if S1 != S2: bad["D1"] += 1
        if len(S1) != count_formula(SA[0], SB[0]): bad["D1count"] += 1
        hit["D1lawful"] += len(S1); hit["D1all"] += total
        if tot0 != (touching_base(SA[0]) == touching_base(SB[0])): bad["D5brute"] += 1
        # D2 — every single pointed pair
        for i in range(len(J)):
            for x in R:
                for y in R:
                    ext, why = extend(i, x, y, J, K)
                    ok, how = gift_lawful_by_lines(i, x, y, SA, SB)
                    if (ext is not None) != ok: bad["D2"] += 1; continue
                    if ext is None: hit["D2refused"] += 1; continue
                    hit["D2taken"] += 1
                    if not lawful(ext, J, K): bad["D2law"] += 1
                    la, lb = how[0], how[1]
                    if len(how) == 3: want = line_pair_map(SA[0][la], SB[0][lb], 0, len(J))
                    else:
                        L = len(SA[0][la]["nodes"]); q = ((how[3] - how[2]) % L) // len(J)
                        want = line_pair_map(SA[0][la], SB[0][lb], q, len(J))
                    if key(ext) != key([dict(want.get(c, {})) for c in range(len(J))]): bad["D2whole"] += 1

def total_case(rng, bad, hit, k, n, trials):
    R = list(range(n)); perms = [dict(zip(R, p)) for p in itertools.permutations(R)]
    for _ in range(trials):
        J = [rng.choice(perms) for _ in range(k)]; K = [rng.choice(perms) for _ in range(k)]
        exists = any(lawful(list(c), J, K) for c in itertools.product(perms, repeat=k))
        conj = cycle_path_type(residue(J), R) == cycle_path_type(residue(K), R)
        if exists != conj: bad["D4"] += 1
        hit["D4exists"] += exists

def partial_base(rng, bad, hit, k, n, trials):
    R = list(range(n))
    for _ in range(trials):
        J = [rnd_pinj(R, R, rng) for _ in range(k)]; K = [rnd_pinj(R, R, rng) for _ in range(k)]
        LA, LB = line_structure(J, [R] * k)[0], line_structure(K, [R] * k)[0]
        strict = touching_base(LA) == touching_base(LB)
        t4 = cycle_path_type(residue(J), R) == cycle_path_type(residue(K), R)
        if strict and not t4: bad["D5dir"] += 1
        if t4 and not strict: hit["D5gap"] += 1
        hit["D5t4"] += t4; hit["D5strict"] += strict

# ─── D8 — the fixtures ─────────────────────────────────────────────────────────────────────────────────────
def fixtures():
    from inside_midpoint_trace import load, glue
    from born_face_reading import HAND_TF, HAND_TP, J_FP
    casts = [load("flow"), load("t-cell"), load("phi")]; NAMES = ["F", "T", "Φ"]
    corners = [c["roles"] for c in casts]; tau = [{t: t for t in c["sig"]} for c in casts]
    faces = {f"{fp}+{tf}+{tp}": [inv(HAND_TF[tf]), HAND_TP[tp], inv(J_FP[fp])]
             for fp, tf, tp in itertools.product(J_FP, HAND_TF, HAND_TP)}
    S = {nm: line_structure(J, corners) for nm, J in faces.items()}
    cache = {}
    def record_refusal(c, pairs):
        kk = (c, frozenset(pairs.items()))
        if kk not in cache:
            st, out = glue(casts[c], casts[c], dict(pairs), tau[c])
            cache[kk] = out if st == "refused" else None
        return cache[kk]
    out = collections.Counter(); ex = {}
    # line census
    kinds, sizes = collections.Counter(), collections.Counter()
    for nm, (L, _) in S.items():
        for l in L: kinds[l["kind"]] += 1; sizes[len(l["nodes"])] += 1
    print(f"   the 42 faces' LINES: {sum(kinds.values())} ({kinds['path']} paths, {kinds['cycle']} cycles); roles on a line "
          f"(= what ONE gift carries; the forced part is one fewer): {dict(sorted(sizes.items()))}")
    full = collections.defaultdict(list); atF = collections.defaultdict(list); t5 = collections.defaultdict(list)
    for nm, (L, _) in S.items():
        full[frozenset(collections.Counter(l["shape"] for l in L).items())].append(nm)
        atF[frozenset(touching_base(L).items())].append(nm)
        t5[cycle_path_type(residue(faces[nm]), corners[0])].append(nm)
    for lab, cl in (("§17.4's criterion at F (the cycle–path type of h at F)", t5), ("(N), a transport TOTAL AT F", atF),
                    ("(N), a transport TOTAL AT EVERY CORNER", full)):
        sz = sorted((len(v) for v in cl.values()), reverse=True)
        print(f"   classes by {lab}: {len(cl)} — sizes {sz} — ordered door pairs inside a class: {sum(s * s for s in sz)}")
    # identity control on the diagonal
    ident_ok = 0
    for nm, J in faces.items():
        e = [{r: r for r in corners[c]} for c in range(3)]
        if lawful(e, J, J) and all(record_refusal(c, e[c]) is None for c in range(3)): ident_ok += 1
    print(f"   CONTROL — a door between two copies of ONE triple, e = the identity: descends, record included, in {ident_ok} of 42   (sealed 42)")
    # doors
    names = list(faces); carri = [[0, 0] for _ in range(3)]; t4_not_strict = 0; strict_not_t4 = 0; uniq = 0
    for a, b in itertools.product(names, names):
        J, K = faces[a], faces[b]; SA, SB = S[a], S[b]
        ta, tb = touching_base(SA[0]), touching_base(SB[0])
        c5a = cycle_path_type(residue(J), corners[0]); c5b = cycle_path_type(residue(K), corners[0])
        if (ta == tb) and c5a != c5b: strict_not_t4 += 1
        if c5a == c5b and ta != tb: t4_not_strict += 1
        shapesB = {l["shape"] for l in SB[0]}
        for (c, r), (lid, _) in SA[1].items():
            carri[c][1] += 1; carri[c][0] += SA[0][lid]["shape"] in shapesB
        ca = collections.Counter(l["shape"] for l in SA[0]); cb = collections.Counter(l["shape"] for l in SB[0])
        nmax = 1
        for s in set(ca) & set(cb):
            lo, hi = sorted((ca[s], cb[s])); m = s[1] if s[0] == "cycle" else 1
            nmax *= math.perm(hi, lo) * m ** lo
        uniq += nmax == 1
        for c in range(3):
            for x in corners[c]:
                for y in corners[c]:
                    ext, why = extend(c, x, y, J, K)
                    ok, _ = gift_lawful_by_lines(c, x, y, SA, SB)
                    if (ext is not None) != ok: out["D8disagree"] += 1
                    if ext is None:
                        out[(c, "shape")] += 1; out[(c, why[0].split(" ")[0])] += 1
                        ex.setdefault((c, why[0].split(" ")[0]), (a, b, NAMES[c], x, y, why))
                        continue
                    if not lawful(ext, J, K): out["D8law"] += 1
                    out[(c, "taken")] += 1
                    ref = [(NAMES[d], record_refusal(d, ext[d])) for d in range(3) if ext[d]]
                    ref = [(d, r) for d, r in ref if r]
                    if ref:
                        out[(c, "record")] += 1
                        ex.setdefault((c, "record"), (a, b, NAMES[c], x, y, (ref[0][0], ref[0][1][0])))
    print(f"   door pairs: 1764 ordered · §17.4's criterion holds and (N) allows no transport total at F: {t4_not_strict} · "
          f"(N) allows one and the criterion fails: {strict_not_t4}   (sealed 0)")
    print(f"   roles a door CAN carry (their line has an equal-shape line on the other face), over the 1764 doors: " +
          " · ".join(f"{NAMES[c]} {carri[c][0]} of {carri[c][1]} ({100 * carri[c][0] / carri[c][1]:.1f}%)" for c in range(3)))
    print(f"   doors whose LARGEST lawful transport is unique (the J's force 'carry all that can be carried'): {uniq} of 1764")
    for c in range(3):
        n = len(corners[c]) ** 2 * 1764
        print(f"   ONE POINTED PAIR at {NAMES[c]} ({n} = {len(corners[c])}² × 1764): taken {out[(c, 'taken')]} · refused by the lines "
              f"{out[(c, 'shape')]} (one continues/stops {out[(c, 'along')]} · one has a predecessor {out[(c, 'into')]} · "
              f"different rounds {out[(c, 'the')]}) · of the taken, refused by the RECORD {out[(c, 'record')]}")
    for kk in sorted(ex, key=repr):
        print(f"      e.g. {kk[1]:6s} at {NAMES[kk[0]]}: door {ex[kk][0]} → {ex[kk][1]}, {ex[kk][3]} ↦ {ex[kk][4]}: {ex[kk][5]}")
    print(f"   D8 checks: (shape, place) vs the propagation {out['D8disagree']} disagreements · a taken gift not lawful {out['D8law']}   (sealed 0, 0)")
    return ident_ok, out

def run(seed_=301):
    rng = random.Random(seed_); bad, hit = collections.Counter(), collections.Counter()
    exhaustive(rng, bad, hit, 3, 2, 300); exhaustive(rng, bad, hit, 4, 2, 120); exhaustive(rng, bad, hit, 3, 3, 25)
    fold_bad, fold_hit = collections.Counter(), collections.Counter()
    exhaustive(rng, fold_bad, fold_hit, 3, 2, 300, fold=True)
    total_case(rng, bad, hit, 3, 3, 1000); total_case(rng, bad, hit, 3, 4, 40)
    partial_base(rng, bad, hit, 3, 3, 20000); partial_base(rng, bad, hit, 4, 4, 20000)
    print("RANDOM DOORS — exhaustive over every e: 300 doors k=3 n=2 · 120 doors k=4 n=2 · 25 doors k=3 n=3; fold doors: 300, n=2")
    print(f" D1  (N) ⇔ whole line-pairs of equal shape at their places: disagreements {bad['D1']} (fold {fold_bad['D1']})   (sealed 0) — "
          f"lawful {hit['D1lawful']} of {hit['D1all']} e's (fold {fold_hit['D1lawful']} of {fold_hit['D1all']})")
    print(f"     the count formula: disagreements {bad['D1count']} (fold {fold_bad['D1count']})   (sealed 0)")
    print(f" D2  one pointed pair — extension exists ⇔ equal shape and place: disagreements {bad['D2']} (fold {fold_bad['D2']}) · "
          f"the extension lawful: failures {bad['D2law']} · it is the whole line-pair: failures {bad['D2whole']} (fold {fold_bad['D2whole']})   (sealed 0)")
    print(f"     taken {hit['D2taken']} · refused {hit['D2refused']} (fold: taken {fold_hit['D2taken']} · refused {fold_hit['D2refused']})")
    print(f" D3  the EMPTY transport refused: {bad['D3'] + fold_bad['D3']}   (sealed 0) · CONTROL, e's refused by (N): {hit['D3ctl'] + fold_hit['D3ctl']}   (sealed > 0)")
    print(f" D4  TOTAL sub-case — a transport total at every corner exists ⇔ conjugate residues: disagreements {bad['D4']}   (sealed 0) "
          f"— exists in {hit['D4exists']} of 1040")
    print(f" D5  total at the base ⇔ the lines touching the base alike (against the exhaustive set): disagreements {bad['D5brute']} (fold {fold_bad['D5brute']})   (sealed 0)")
    print(f"     over 40,000 random partial doors: (N) allows total-at-base in {hit['D5strict']} · §17.4's criterion holds in {hit['D5t4']}")
    print(f"     … (N) ⇒ the criterion: failures {bad['D5dir']}   (sealed 0) · the criterion holds and (N) allows none: {hit['D5gap']}   (sealed > 0)")
    print(f" D6  one residue on the glued face, e_0 h_A = h_B e_0 on every lawful e: failures {bad['D6'] + fold_bad['D6']}   (sealed 0)")
    print(f" D7  fold door — lawful e's that MOVE a role at the hinge corner A: {fold_hit['D7']}   (sealed > 0)")
    print(f" D9  (the disjoint-face doors) the JOIN refuses a lawful e: {bad['D9']}   (sealed 0) · accepts an e that (N) refuses "
          f"(n = 2): {hit['D9']}   (sealed > 0)")
    print(f" D10 the ONE-WAY reading: e lawful A → B with e⁻¹ not lawful B → A: {hit['D10'] + fold_hit['D10']}   (sealed > 0) · "
          f"e's the one-way reading admits and the two-way refuses: {hit['D10oneonly'] + fold_hit['D10oneonly']}")
    print("\nD8  THE FIXTURES — a prism of two first faces (F · T · Φ = flow · t-cell · phi), the translation door, 42 × 42 triple pairs")
    fixtures()

if __name__ == "__main__":
    run()

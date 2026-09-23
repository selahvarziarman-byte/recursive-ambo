"""GEN 4 — is the compounding lawful? (the mothership's 1327 §4; its probe reproduced at my hand: at R = mid(Q, Q2) a seed
role held by 3+ roles in 2,983 of 3,000 faces, max 4; at Q, max 2.)

R's ancestry offers a seed at most THREE distinct lineages — via P_A, via P_B, via P_C — because the two P_B routes (through
Q and through Q2) reach the SAME class of P_B, the shared parent of the medial edge Q — Q2. A fourth copy therefore means a
class of P_B was split in R. Two readings:
  GENUINE  Q and Q2 hold that P_B class with DIFFERENT companions (a real disagreement between P_A's and P_C's routes)
  SPURIOUS Q and Q2 hold it IDENTICALLY, and the content meet refused only because a seed of it has ANOTHER copy in Q2 (the
           P_C lineage, already housed) — content cannot tell which copy is which: §2's corner blindness, in the medial meet.
Candidate repair — the ANCHORED meet: first pair each shared-parent class's two images (ι_Q(w) ↔ ι_Q2(w)) wherever their
contents are CONSISTENT (neither holds a seed the other side keeps elsewhere); then the content meet on what remains.
SEALED BEFORE THE RUN (my own tower, 3,000 faces, 5 roles, empty born rooms):
  G1  the content meet (as built) reproduces the shape: 3+ copies at R in most faces, max 4                        > 0, max 4
  G2  among P_B classes split in R, SPURIOUS ones exist (identical in Q and Q2, still split)                          > 0
  G3  the ANCHORED meet: at gen 3 (Q) it equals the content meet exactly — nothing is doubled in P_A, P_B yet     0 differences
  G4  the ANCHORED meet at R: max multiplicity ≤ 3 (one per lineage)                                              0 faces above 3
  G5  the ANCHORED meet never pools, at Q or at R                                                                   0 faces
  G6  the ANCHORED meet splits no P_B class that Q and Q2 hold identically                                          0
"""
import random, collections
from space_of_resolver import seed, glue
from g3_meet_vs_parent import meet, parent_identity, rnd_pinj

def remaining_content_meet(U, V, skip_u, skip_v):
    """the content meet on the classes not already paired: a U class's seeds must all land in ONE remaining V class"""
    where = {}
    for rid, cont in V["roles"].items():
        if rid in skip_v: continue
        for s in cont: where.setdefault(s, set()).add(rid)
    V_all = set().union(*V["roles"].values())
    image, conflict = {}, set()
    for rid, cont in U["roles"].items():
        if rid in skip_u: continue
        t = set()
        for s in cont: t |= where.get(s, set())
        held_elsewhere = any(s in V_all and not where.get(s) for s in cont)       # a seed V holds ONLY in an already-paired class
        if len(t) == 1 and not held_elsewhere: image[rid] = next(iter(t))
        elif t or held_elsewhere: conflict.add(rid)
    back = collections.Counter(image.values())
    return [(a, b) for a, b in image.items() if back[b] == 1 and a not in conflict]

def anchored_meet(U, V, W):
    """pair the shared parent W's two images where consistent; then the content meet on the rest"""
    U_all, V_all = set().union(*U["roles"].values()), set().union(*V["roles"].values())
    anchor = collections.defaultdict(set)
    for w in U["inj"][W]:
        anchor[U["inj"][W][w]].add(V["inj"][W][w])
    pairs, back = [], collections.defaultdict(list)
    for u, vs in anchor.items():
        if len(vs) != 1: continue
        v = next(iter(vs)); cu, cv = U["roles"][u], V["roles"][v]
        if (cu & V_all) <= cv and (cv & U_all) <= cu: back[v].append(u)
    for v, us in back.items():
        if len(us) == 1: pairs.append((us[0], v))
    su, sv = {a for a, _ in pairs}, {b for _, b in pairs}
    return pairs + remaining_content_meet(U, V, su, sv)

def mult(S):
    c = collections.Counter(s for cont in S["roles"].values() for s in cont); return max(c.values()) if c else 0

def pooled(S):
    return sum(1 for cont in S["roles"].values() if any(k > 1 for k in collections.Counter(s[0] for s in cont).values()))

def tower(rng, rule):
    A, B, C = seed("A", 5, 0), seed("B", 5, 0), seed("C", 5, 0)
    J_AB, J_BC, J_CA = rnd_pinj(A["roles"], B["roles"], rng), rnd_pinj(B["roles"], C["roles"], rng), rnd_pinj(C["roles"], A["roles"], rng)
    M_AB, M_BC, M_CA = glue(A, B, J_AB, [], "M_AB"), glue(B, C, J_BC, [], "M_BC"), glue(C, A, J_CA, [], "M_CA")
    iA, iB, iC = parent_identity(M_CA, M_AB, "A"), parent_identity(M_AB, M_BC, "B"), parent_identity(M_BC, M_CA, "C")
    P_A = glue(M_CA, M_AB, iA[0], [], "P_A"); P_B = glue(M_AB, M_BC, iB[0], [], "P_B"); P_C = glue(M_BC, M_CA, iC[0], [], "P_C")
    pick = (lambda U, V, W: meet(U, V)[0]) if rule == "content" else anchored_meet
    Q = glue(P_A, P_B, pick(P_A, P_B, "M_AB"), [], "Q")
    Q2 = glue(P_B, P_C, pick(P_B, P_C, "M_BC"), [], "Q2")
    R = glue(Q, Q2, pick(Q, Q2, "P_B"), [], "R")
    return dict(P_B=P_B, Q=Q, Q2=Q2, R=R)

def split_classes(t):
    """P_B classes whose two images (through Q and through Q2) stand apart in R; SPURIOUS = Q and Q2 hold them identically"""
    out = collections.Counter()
    for p in t["P_B"]["roles"]:
        xq, xq2 = t["Q"]["inj"]["P_B"][p], t["Q2"]["inj"]["P_B"][p]
        if t["R"]["inj"]["Q"][xq] != t["R"]["inj"]["Q2"][xq2]:
            out["split"] += 1
            if t["Q"]["roles"][xq] == t["Q2"]["roles"][xq2]: out["spurious"] += 1
    return out

def run(N=3000, seed_=271):
    res = {}
    for rule in ("content", "anchored"):
        rng = random.Random(seed_); st = collections.Counter(); Qs = []
        for _ in range(N):
            t = tower(rng, rule); Qs.append(frozenset(t["Q"]["roles"].values()))
            m = mult(t["R"]); st["max"] = max(st["max"], m); st["ge3"] += m >= 3; st["gt3"] += m > 3
            st["poolQ"] += pooled(t["Q"]) > 0; st["poolR"] += pooled(t["R"]) > 0
            sc = split_classes(t); st["split_faces"] += sc["split"] > 0; st["spurious_faces"] += sc["spurious"] > 0
            st["split"] += sc["split"]; st["spurious"] += sc["spurious"]
        res[rule] = (st, Qs)
    c, a = res["content"][0], res["anchored"][0]
    gen3_diff = sum(1 for x, y in zip(res["content"][1], res["anchored"][1]) if x != y)
    print(f"{N} faces (A, B, C: 5 roles; random partial maps; empty born rooms) — the same towers under both rules")
    print(f"   CONTENT meet (as built): 3+ copies at R in {c['ge3']} faces · max {c['max']} · above 3 in {c['gt3']} · pools Q {c['poolQ']} R {c['poolR']}")
    print(f"      P_B classes split in R: {c['split']} ({c['split_faces']} faces) — SPURIOUS (held identically by Q and Q2): {c['spurious']} ({c['spurious_faces']} faces)")
    print(f"   ANCHORED meet:           3+ copies at R in {a['ge3']} faces · max {a['max']} · above 3 in {a['gt3']} · pools Q {a['poolQ']} R {a['poolR']}")
    print(f"      P_B classes split in R: {a['split']} ({a['split_faces']} faces) — SPURIOUS: {a['spurious']}")
    print(f"   G1 content shape (3+ in most, max 4): {'✔' if c['ge3'] > N // 2 and c['max'] == 4 else '⛔ SEAL FIRED'}   "
          f"G2 spurious splits exist: {'✔' if c['spurious'] else '⛔ SEAL FIRED'}")
    print(f"   G3 gen 3 identical under both rules: {gen3_diff} differ {'✔' if gen3_diff == 0 else '⛔ SEAL FIRED'}   "
          f"G4 anchored max ≤ 3: {'✔' if a['gt3'] == 0 else '⛔ SEAL FIRED'}   G5 anchored never pools: {'✔' if a['poolQ'] + a['poolR'] == 0 else '⛔ SEAL FIRED'}   "
          f"G6 anchored splits nothing held identically: {'✔' if a['spurious'] == 0 else '⛔ SEAL FIRED'}")

if __name__ == "__main__":
    run()

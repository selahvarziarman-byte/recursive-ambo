"""
EDGE CANDIDATES AS PARTIAL ISOMORPHISMS — the falsifier the amalgam never got.

The pushout instrument (amalgam_pushout_flow_phi.py) took the hinge's "maximal carried core"
(4 role-pairs + a type-translation tau) as J and claimed "none lost, none fabricated".
The hinge's core was scored by FORWARD preservation only (Flow's relations land in Phi) —
a partial HOMOMORPHISM, directional.  An amalgam over a J that is not a partial ISOMORPHISM
imports the other parent's relations into a parent's own image: the parent's embedding
preserves but does not REFLECT.

Sealed before the run (2026-09-08):
  A. the 4-pair J is NOT a partial isomorphism on the shared signature (expected: >= 1
     shared-type relation present on one side and absent on the other);
  B. the pushout over it carries relations among Flow-image roles, in Flow's OWN translated
     types, that Flow never asserted (expected: > 0 — fabrication into a parent);
  C. under the corrected definition (exact agreement in every TRANSLATED type, both ways;
     untranslated types impose nothing; weight = relations in agreement, must be > 0 — the
     empty-core rule), the legal candidates are recomputed and the pushout over the best
     one shows ZERO shared-type relations fabricated into either parent (the falsifier).
Coverage: exhaustive for |J| <= 4; |J| = 5 sampled under a time budget and reported as such.
"""
import os, sys, itertools, collections, time, random
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, "hinge_data.py"), encoding="utf-8").read())   # F, FR, PHI, PR

def rels_by_type(R):
    d = collections.defaultdict(set)
    for t, a, b in R: d[t].add((a, b))
    return d
FT, PT = rels_by_type(FR), rels_by_type(PR)

def exact_assignment(p):
    """Best injective tau (Flow types -> Phi types) with EXACT agreement inside dom p / img p.
    Returns (weight, tau).  weight = number of relation-instances in agreement (>0 required)."""
    D = set(p); I = set(p.values())
    S = {t: {(p[a], p[b]) for a, b in prs if a in D and b in D} for t, prs in FT.items()}
    T = {tt: {(x, y) for x, y in prs if x in I and y in I} for tt, prs in PT.items()}
    cand = {t: [tt for tt in T if T[tt] == S[t]] for t in S if S[t]}      # exact match, non-empty
    ts = sorted(cand, key=lambda t: -len(S[t]))
    best = [0, {}]
    def rec(i, used, w, m):
        if w + sum(len(S[t]) for t in ts[i:]) <= best[0]: return
        if i == len(ts):
            if w > best[0]: best[0], best[1] = w, dict(m)
            return
        t = ts[i]
        for tt in cand[t]:
            if tt not in used:
                m[t] = tt; used.add(tt); rec(i + 1, used, w + len(S[t]), m); used.discard(tt); del m[t]
        rec(i + 1, used, w, m)
    rec(0, set(), 0, {})
    return best[0], best[1]

def shared_type_conflicts(p, tau):
    """Relations in a TRANSLATED type present on one side of J and absent on the other."""
    D = set(p); inv = {v: k for k, v in tau.items()}
    out = []
    for t, tt in tau.items():
        for a, b in FT[t]:
            if a in D and b in D and (p[a], p[b]) not in PT[tt]: out.append(("Flow-only", t, a, b))
        for x, y in PT[tt]:
            if x in p.values() and y in p.values():
                a = next(k for k in p if p[k] == x); b = next(k for k in p if p[k] == y)
                if (a, b) not in FT[t]: out.append(("Phi-only", tt, x, y))
    return out

# ---------- A + B : the J the pushout used ----------
J4 = {'F1': 'Φ2', 'F2': 'Φ1', 'F4': 'Φ7', 'F6': 'Φ4'}
tau4 = {'exceeds-in-speed': 'specifies', 'presupposes': 'component-of', 'generates': 'presupposes', 'disjoins': 'descends-from'}
conf = shared_type_conflicts(J4, tau4)
print("A. the pushout's J (4 pairs) tested as a partial isomorphism on the shared signature:")
print(f"   shared-type conflicts: {len(conf)}")
for c in conf: print("     ", c)
print(f"   => partial isomorphism: {len(conf) == 0}   (sealed: False)")
w4, tau4x = exact_assignment(J4)
print(f"   best EXACT translation for these 4 pairs: weight {w4}, tau {tau4x}")

# ---------- C : recompute legal candidates ----------
print("\nC. legal candidates = partial injections with an exact translation of weight > 0")
best_by_size = {}
t0 = time.time()
for k in (2, 3, 4):
    for D in itertools.combinations(F, k):
        for img in itertools.permutations(PHI, k):
            p = dict(zip(D, img)); w, tau = exact_assignment(p)
            if w > 0:
                cur = best_by_size.get(k)
                if cur is None or w > cur[0]: best_by_size[k] = (w, p, tau)
    print(f"   |J| = {k}: exhaustive; best weight {best_by_size.get(k, (0,))[0]}   ({time.time()-t0:.0f}s)")
# |J| = 5: sampled
rng = random.Random(0); n5 = 0; t1 = time.time()
while time.time() - t1 < 60:
    D = rng.sample(F, 5); img = rng.sample(PHI, 5); p = dict(zip(D, img)); n5 += 1
    w, tau = exact_assignment(p)
    if w > 0 and (5 not in best_by_size or w > best_by_size[5][0]): best_by_size[5] = (w, p, tau)
print(f"   |J| = 5: SAMPLED {n5} of {2002*15120} injections in 60s; best weight {best_by_size.get(5, (0,))[0]}")
for k in sorted(best_by_size):
    w, p, tau = best_by_size[k]
    print(f"   best legal J of size {k}: weight {w}  pairs {p}  tau {tau}")

# ---------- the falsifier: pushout over the best legal J of the largest size with weight>0 ----------
def pushout(J, tau):
    rep = {}
    for a in F: rep[('A', a)] = ('J', a) if a in J else ('A', a)
    for b in PHI:
        pre = [a for a, bb in J.items() if bb == b]; rep[('B', b)] = ('J', pre[0]) if pre else ('B', b)
    trep = {}
    for t, _, _ in FR: trep[('A', t)] = ('J', t) if t in tau else ('A', t)
    for t, _, _ in PR:
        pre = [s for s, tt in tau.items() if tt == t]; trep[('B', t)] = ('J', pre[0]) if pre else ('B', t)
    MR = {(trep[('A', t)], rep[('A', a)], rep[('A', b)]) for t, a, b in FR} | \
         {(trep[('B', t)], rep[('B', a)], rep[('B', b)]) for t, a, b in PR}
    iA = {a: rep[('A', a)] for a in F}; iB = {b: rep[('B', b)] for b in PHI}
    return set(rep.values()), set(trep.values()), MR, iA, iB, trep
def fabricated_into_parents(J, tau):
    M, MT, MR, iA, iB, trep = pushout(J, tau)
    FRm = {(trep[('A', t)], iA[a], iA[b]) for t, a, b in FR}; PRm = {(trep[('B', t)], iB[a], iB[b]) for t, a, b in PR}
    imA, imB = set(iA.values()), set(iB.values())
    xA = [r for r in MR if r[1] in imA and r[2] in imA and r not in FRm]
    xB = [r for r in MR if r[1] in imB and r[2] in imB and r not in PRm]
    sharedA = [r for r in xA if r[0][0] == 'J']; sharedB = [r for r in xB if r[0][0] == 'J']
    return M, MT, MR, xA, xB, sharedA, sharedB
print("\nB. the pushout over the 4-pair J, at the parents' images:")
M, MT, MR, xA, xB, sA, sB = fabricated_into_parents(J4, tau4)
print(f"   |M|={len(M)} types={len(MT)} relations={len(MR)}")
print(f"   relations among Flow-image roles not in Flow: {len(xA)}, of which in Flow's OWN translated types: {len(sA)} {sA}")
print(f"   relations among Phi-image roles not in Phi:   {len(xB)}, of which in Phi's OWN translated types:   {len(sB)} {sB}")
kmax = max(k for k in best_by_size)
w, p, tau = best_by_size[kmax]
print(f"\nD. the pushout over the best LEGAL J (size {kmax}, weight {w}):")
M, MT, MR, xA, xB, sA, sB = fabricated_into_parents(p, tau)
print(f"   |M|={len(M)} types={len(MT)} relations={len(MR)}")
print(f"   shared-type relations fabricated into Flow: {len(sA)}  into Phi: {len(sB)}   (sealed: 0 and 0)")
print(f"   foreign-vocabulary relations on merged roles (the midpoint's imported content, marked by origin): Flow-image {len(xA)-len(sA)}, Phi-image {len(xB)-len(sB)}")

"""
THE COUNT OF DISTINCT OFFERS (the mothership's 1641) — and the hole it found in the pin.

Under the pin as ruled (1602 §2: "a shared unary value IS an agreement"; 1632: "an offer = a maximal conflict-free
candidate whose EVERY pair is SUPPORTED"), the fixture t-cell carries `member_status: "has"` on all ten roles, so EVERY
pair (x ↦ y) is supported by that one unary agreement — and every conflict-free full injection is a maximal supported
core: 3,104,904 offers. A value every role shares backs every pair equally, i.e. backs none. So SUPPORT is corrected:

  SUPPORT of a pair = the agreements of ARITY ≥ 2 whose X-tuple contains the pair's role — structure BETWEEN identified
  roles. Unary agreements still COUNT in the weight and still REFUSE on conflict (the first face's member-status refusal);
  they do not support a pair on their own. (This is exactly how the first face used them.)

An OFFER = an inclusion-maximal conflict-free partial injection whose every pair is supported (arity ≥ 2).
Enumeration: every offer is the role-map induced by a set of tuple matchings (X-tuple ↦ Y-tuple, same type, same value);
enumerate all such matchings, keep the induced maps that are injective, functional and conflict-free, then the
inclusion-maximal ones. Exact, no sampling.
Sealed: triangle × triangle-symmetric → 6 offers, all weight 3, one gauge orbit;  triangle × triangle → 3 offers, weight 3,
one orbit;  t-cell × t-cell → the identity (weight 21) at the top and a number of lower-weight offers I do NOT know in
advance — this is the count that can fail the designer's problem either way, and it is not forced by the fixture.
"""
import os, json, itertools, collections
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
FIX = os.path.join(REPO, "scripts", "fixtures", "casts")

def load(name):
    with open(os.path.join(FIX, name + ".cast.json"), encoding="utf-8") as f: d = json.load(f)
    roles = [r["id"] for r in d["roles"]]
    sig = {s["type"]: s["arity"] for s in d["signature"]}
    rec = {(r["type"], tuple(r["terms"])): r["polarity"] for r in d["relations"]}
    unary = {}
    for r in d["roles"]:
        for k, v in (r.get("types") or {}).items():
            if v != "UNKNOWN": rec[(k, (r["id"],))] = v; unary[k] = 1
    return {"name": name, "roles": roles, "sig": sig, "unary": unary, "rec": rec}

def shared_types(X, Y):
    t = {k: a for k, a in X["sig"].items() if Y["sig"].get(k) == a}
    t.update({k: 1 for k in X["unary"] if k in Y["unary"]})
    return t

def conflict_free_and_weight(X, Y, j, types):
    RX, RY = X["rec"], Y["rec"]; dom = set(j)
    w = 0; sup = {x: 0 for x in j}
    for (t, tup), vx in RX.items():
        if t not in types or not set(tup) <= dom: continue
        vy = RY.get((t, tuple(j[x] for x in tup)))
        if vy is None: continue
        if vy != vx: return None, None
        w += 1
        if len(tup) >= 2:
            for x in set(tup): sup[x] += 1
    return w, sup

def offers(X, Y):
    types = shared_types(X, Y)
    xt = [(t, tup, v) for (t, tup), v in X["rec"].items() if t in types and len(tup) >= 2]
    options = []
    for t, tup, v in xt:
        opts = [tup2 for (t2, tup2), v2 in Y["rec"].items() if t2 == t and v2 == v and len(tup2) == len(tup)]
        options.append([None] + opts)
    cores = set()
    for choice in itertools.product(*options):
        j = {}; ok = True; used = {}
        for (t, tup, v), tup2 in zip(xt, choice):
            if tup2 is None: continue
            for x, y in zip(tup, tup2):
                if j.get(x, y) != y or used.get(y, x) != x: ok = False; break
                j[x] = y; used[y] = x
            if not ok: break
        if not ok or not j: continue
        w, sup = conflict_free_and_weight(X, Y, j, types)
        if w is None: continue
        if min(sup.values()) == 0: continue          # every pair must be supported by an arity ≥ 2 agreement
        cores.add(frozenset(j.items()))
    # inclusion-maximal
    cores = list(cores)
    maximal = [c for c in cores if not any(c < d for d in cores)]
    return maximal, types

def aut(X):
    R = X["roles"]; out = []
    for perm in itertools.permutations(R):
        s = dict(zip(R, perm))
        if all(X["rec"].get((t, tuple(s[x] for x in tup))) == v for (t, tup), v in X["rec"].items()): out.append(s)
    return out

def orbits(offs, AX, AY):
    seen = set(); n = 0
    for c in offs:
        if c in seen: continue
        n += 1
        j = dict(c)
        for a in AX:
            for b in AY: seen.add(frozenset((a[x], b[y]) for x, y in j.items()))
    return n

if __name__ == "__main__":
    casts = {n: load(n) for n in ["triangle", "triangle-symmetric", "t-cell"]}
    for a, b in [("triangle", "triangle-symmetric"), ("triangle", "triangle"), ("t-cell", "t-cell")]:
        X, Y = casts[a], casts[b]
        offs, types = offers(X, Y)
        AX, AY = aut(X), aut(Y)
        byw = collections.defaultdict(list)
        for c in offs:
            w, _ = conflict_free_and_weight(X, Y, dict(c), types); byw[w].append(c)
        print(f"=== {a} × {b} ===  distinct OFFERS: {len(offs)}   |Aut| {len(AX)} / {len(AY)}")
        for w in sorted(byw, reverse=True):
            sizes = collections.Counter(len(c) for c in byw[w])
            print(f"  weight {w:2d}: {len(byw[w]):5d} offers · sizes {dict(sizes)} · gauge orbits {orbits(byw[w], AX, AY)}")
        top = max(byw); print(f"  top offer(s) at weight {top}: {[sorted(dict(c).items()) for c in byw[top]][:3]}")

"""
THE WILD SEAL — Flow × Φ offers under each 09-08 τ, both homes, the corrected clause (support = arity ≥ 2), and the
ruling on weight (the mothership's 1835 §1): WEIGHT = agreements of arity ≥ 2, exactly as support; a unary key REFUSES on
conflict and is printed as its own count, never orders. Both readings are printed so the coder can see the difference.

Fixtures: scripts/fixtures/casts/flow.cast.json (14 roles, 34 relations, all member-status has) and phi.cast.json
(9 roles, 22 relations; member-status: 8 has, Φ9 none-by-nature).
τ₃ = the 09-08 size-3 core's translation   {sustains→descends-from, presupposes→specifies, exceeds-in-size→lodges-in}
τ₄ = the 09-08 size-4 rival's translation  {generates→specifies, sustains→descends-from, exceeds-in-speed→transmits, precedes→component-of}
τ_name = the shared signature by name       {disjoins→disjoins, presupposes→presupposes}
An OFFER = an inclusion-maximal conflict-free partial injection whose every pair is supported by an arity ≥ 2 agreement;
enumerated exactly as the role-maps induced by tuple matchings (X-tuple ↦ Y-tuple, same τ-type, same polarity).
Sealed: under τ₃ the size-3 core {F5↦Φ7, F7↦Φ1, F8↦Φ2} is an offer of relational weight 4; under τ₄ the size-4 core
{F1↦Φ3, F2↦Φ2, F3↦Φ4, F5↦Φ1} is an offer of relational weight 4; no offer maps any role onto Φ9 (member-status refuses);
|Aut(Flow)| = 2 (F10/F11), |Aut(Φ)| = 1. The (a)-weights (with unary) would read 7 and 8 — the size bias the ruling refuses.
"""
import os, json, itertools, collections, time
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
FIX = os.path.join(REPO, "scripts", "fixtures", "casts")

def load(name):
    d = json.load(open(os.path.join(FIX, name + ".cast.json"), encoding="utf-8"))
    roles = [r["id"] for r in d["roles"]]
    sig = {s["type"]: s["arity"] for s in d["signature"]}
    rec = {(r["type"], tuple(r["terms"])): r["polarity"] for r in d["relations"]}
    unary = {}
    for r in d["roles"]:
        for k, v in (r.get("types") or {}).items():
            if v != "UNKNOWN": rec[(k, (r["id"],))] = v; unary[k] = 1
    return {"name": name, "roles": roles, "sig": sig, "unary": unary, "rec": rec}

def evaluate(X, Y, j, tau):
    """relational weight (arity ≥ 2 agreements), unary agreements, support; None on any known conflict (both homes)."""
    RX, RY = X["rec"], Y["rec"]; dom = set(j)
    w_rel = 0; w_un = 0; sup = {x: 0 for x in j}
    for (t, tup), vx in RX.items():
        if not set(tup) <= dom: continue
        if len(tup) == 1:
            if t not in X["unary"] or t not in Y["unary"]: continue
            vy = RY.get((t, (j[tup[0]],)))
            if vy is None: continue
            if vy != vx: return None
            w_un += 1; continue
        if t not in tau: continue
        vy = RY.get((tau[t], tuple(j[x] for x in tup)))
        if vy is None: continue
        if vy != vx: return None
        w_rel += 1
        for x in set(tup): sup[x] += 1
    return w_rel, w_un, sup

def offers(X, Y, tau):
    """DFS over X-tuples: each is matched to a compatible Y-tuple or left unmatched; the induced role-map is kept
    injective and functional as it grows, so only consistent matchings are ever visited."""
    xt = [(t, tup, v) for (t, tup), v in X["rec"].items() if t in tau and len(tup) >= 2]
    options = [[tup2 for (t2, tup2), v2 in Y["rec"].items() if t2 == tau[t] and v2 == v and len(tup2) == len(tup)] for t, tup, v in xt]
    cores = set(); refused = [0]; leaves = [0]
    def dfs(i, j, used):
        if i == len(xt):
            leaves[0] += 1
            if not j: return
            key = frozenset(j.items())
            if key in cores: return
            ev = evaluate(X, Y, j, tau)
            if ev is None:
                if evaluate({**X, "unary": {}}, {**Y, "unary": {}}, j, tau) is not None: refused[0] += 1
                return
            if min(ev[2].values()) == 0: return
            cores.add(key); return
        t, tup, v = xt[i]
        dfs(i + 1, j, used)                                  # unmatched
        for tup2 in options[i]:
            added = []; ok = True
            for x, y in zip(tup, tup2):
                if j.get(x, y) != y or used.get(y, x) != x: ok = False; break
                if x not in j: j[x] = y; used[y] = x; added.append((x, y))
            if ok: dfs(i + 1, j, used)
            for x, y in added: del j[x]; del used[y]
    dfs(0, {}, {})
    cores = list(cores)
    maximal = [c for c in cores if not any(c < d for d in cores)]
    return maximal, refused[0], leaves[0]

def aut(X):
    """automorphisms of the full record by backtracking (14! is not enumerable): assign roles in order; after each
    assignment every known tuple among assigned roles must map to a known tuple with the same value, and every
    known tuple among the images must pull back to a known tuple — unrecorded ↦ unrecorded both ways."""
    R = X["roles"]; rec = X["rec"]; out = []
    by_role = collections.defaultdict(list)
    for (t, tup), v in rec.items():
        for x in set(tup): by_role[x].append((t, tup, v))
    def consistent(s, x):
        inv = {v: k for k, v in s.items()}
        for t, tup, v in by_role[x]:
            if all(r in s for r in tup):
                if rec.get((t, tuple(s[r] for r in tup))) != v: return False
        for t, tup, v in by_role[s[x]]:
            if all(r in inv for r in tup):
                if rec.get((t, tuple(inv[r] for r in tup))) != v: return False
        return True
    def bt(i, s, used):
        if i == len(R): out.append(dict(s)); return
        x = R[i]
        for y in R:
            if y in used: continue
            s[x] = y; used.add(y)
            if consistent(s, x): bt(i + 1, s, used)
            del s[x]; used.discard(y)
    bt(0, {}, set())
    return out

def orbits(offs, AX, AY):
    seen = set(); n = 0
    for c in offs:
        if c in seen: continue
        n += 1
        for a in AX:
            for b in AY: seen.add(frozenset((a[x], b[y]) for x, y in dict(c).items()))
    return n

if __name__ == "__main__":
    F, P = load("flow"), load("phi")
    AF, AP = aut(F), aut(P)
    print(f"|Aut(Flow)| = {len(AF)} ({[ {k:v for k,v in a.items() if k!=v} for a in AF if any(k!=v for k,v in a.items())]}) · |Aut(Φ)| = {len(AP)}")
    TAUS = {
        "τ₃ (09-08 size-3 core)": {"sustains": "descends-from", "presupposes": "specifies", "exceeds-in-size": "lodges-in"},
        "τ₄ (09-08 size-4 rival)": {"generates": "specifies", "sustains": "descends-from", "exceeds-in-speed": "transmits", "precedes": "component-of"},
        "τ_name (shared by name)": {"disjoins": "disjoins", "presupposes": "presupposes"},
    }
    for label, tau in TAUS.items():
        t0 = time.time()
        offs, refused, n = offers(F, P, tau)
        byw = collections.defaultdict(list)
        for c in offs:
            ev = evaluate(F, P, dict(c), tau); byw[ev[0]].append((c, ev))
        print(f"\n=== Flow × Φ under {label}: {tau} ===   matchings examined {n} · refused by member-status (relations fine, unary conflict) {refused} · {time.time()-t0:.0f}s")
        print(f"  distinct OFFERS: {len(offs)}   (none may touch Φ9: {all('Φ9' not in dict(c).values() for c in offs)})")
        for w in sorted(byw, reverse=True):
            group = byw[w]
            sizes = collections.Counter(len(c) for c, _ in group)
            a_weights = sorted({ev[0] + ev[1] for _, ev in group})
            print(f"  relational weight {w}: {len(group)} offers · sizes {dict(sizes)} · orbits {orbits([c for c, _ in group], AF, AP)} · (a)-weight rel+unary would be {a_weights}")
            for c, ev in sorted(group, key=lambda ce: -len(ce[0]))[:4]:
                print(f"      {dict(sorted(dict(c).items()))} · support {ev[2]} · types agree {ev[1]}")

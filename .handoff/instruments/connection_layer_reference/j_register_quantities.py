"""
THE J REGISTER'S QUANTITIES, DEFINED ON THE TYPE AND COMPUTED ON THE LANDED FIXTURES (the pin for C-6d, 2026-09-19).

Reads `scripts/fixtures/casts/*.cast.json` exactly as `ConceptSpace` holds them (roles: id + types; signature: type + arity;
relations: type + terms + polarity). Everything else in a file is ignored here, as the loader carries it unread.

DEFINITIONS (each a function below; the letter cites them by name and line):
  record(X)        the KNOWN tuples of X: (σ, terms) ↦ polarity from `relations`, plus each role's categorical unary
                   keys as (K, (x,)) ↦ value — 'UNKNOWN' is unrecorded. Two homes, one record.
  tau_by_name      the SHARED SIGNATURE: type-names present in both casts with the SAME arity (a name with two arities
                   across the casts is NOT the same type — named, not shared); unary keys present on roles of both.
                   A translation between differently-named types is the person's (fiat τ), not offered here.
  consistent(j)    no KNOWN CONFLICT: for every shared type σ and tuple t over dom j, if X knows (σ,t) and Y knows
                   (σ, j·t), their values agree. (Opposite polarity / different unary value = a conflict = not a candidate.)
  weight(j)        the number of AGREEMENTS: tuples over dom j known on BOTH sides with the same value — a shared
                   does-not-hold counts; a shared unary value counts.
  support(j, x)    the agreements whose X-tuple contains x; a pair with support 0 is UNSUPPORTED (offered marked).
  exposure(j)      tuples over dom j (shared types) known on exactly ONE side.   unrecorded(j): known on neither.
  aut(X)           permutations of X's roles preserving X's WHOLE record exactly (known ↦ known with the same value,
                   unrecorded ↦ unrecorded) — the cast's symmetries; two candidates β∘j∘α (α ∈ Aut X, β ∈ Aut Y) are ONE
                   candidate (a gauge orbit).
  top candidates   among consistent injections of full size (min |R_X|, |R_Y|) with weight > 0, those of maximum weight;
                   ties are counted, and grouped into gauge orbits. (Restrictions of a candidate have ≤ weight; among
                   equal weights only the inclusion-maximal are offered — a dropped unsupported pair is marked, not a
                   new candidate.)
  EMPTY CORE       (a) no shared type by name → "no relation-type in common — a translation is yours to give";
                   (b) shared types, every injection of weight 0 → "no relation to agree on".
SEALED before the run:
  triangle × triangle-symmetric : top weight 3 · 6 tied · 1 gauge orbit · |Aut| 3 and 6 · exposure 3 · unrecorded 3
  triangle × triangle           : top weight 3 · 3 tied · 1 orbit · |Aut| 3 · exposure 0 · unrecorded 6
  t-cell × t-cell               : top weight 21 (11 tuples + 10 unary) · 1 tied · |Aut| 1 · exposure 0 · unrecorded = 1510 − 21 = 1489
                                  (5 binary types ×100 + 1 ternary ×1000 + 1 unary ×10 = 1510 tuples over dom j; my first arithmetic
                                   wrote 1589 by counting six binary types — the instrument's 1489 is the number, kept as the record)
  triangle × t-cell             : EMPTY CORE (a) — no type shared by name
VACUITY: |Aut| = 6 for triangle-symmetric and "6 tied" are FORCED by its full symmetry; the number that can fail on these
fixtures is t-cell × t-cell's "1 tied / |Aut| 1" (a second automorphism would make it 2) and triangle × triangle's "3 tied".
"""
import os, json, itertools, glob
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
FIX = os.path.join(REPO, "scripts", "fixtures", "casts")

def load(name):
    with open(os.path.join(FIX, name + ".cast.json"), encoding="utf-8") as f: d = json.load(f)
    roles = [r["id"] for r in d["roles"]]
    sig = {}
    for s in d["signature"]:
        if s["type"] in sig and sig[s["type"]] != s["arity"]: raise ValueError(f"{name}: type {s['type']} declared with two arities")
        sig[s["type"]] = s["arity"]
    rec = {}
    for r in d["relations"]:
        key = (r["type"], tuple(r["terms"]))
        if key in rec and rec[key] != r["polarity"]: raise ValueError(f"{name}: contradictory record at {key}")
        rec[key] = r["polarity"]
    unary = {}
    for r in d["roles"]:
        for k, v in (r.get("types") or {}).items():
            if k in sig: raise ValueError(f"{name}: unary key {k} is also a signature type — one home per type")
            if v != "UNKNOWN": rec[(k, (r["id"],))] = v
            unary[k] = 1
    return {"name": name, "roles": roles, "sig": sig, "unary": unary, "rec": rec}

def record(X): return X["rec"]                                   # the KNOWN tuples, both homes

def tau_by_name(X, Y):
    shared = {t: a for t, a in X["sig"].items() if t in Y["sig"] and Y["sig"][t] == a}
    not_same = [t for t in X["sig"] if t in Y["sig"] and Y["sig"][t] != X["sig"][t]]
    shared_unary = [k for k in X["unary"] if k in Y["unary"]]
    return shared, shared_unary, not_same

def tuples_over(dom, arity): return itertools.product(dom, repeat=arity)

def evaluate(X, Y, j, shared, shared_unary):
    """agreements · exposure · unrecorded over dom j in the shared types; None if a known conflict exists.
    Sparse: walks only the KNOWN tuples of each side (the record), never the tuple space; unrecorded is arithmetic."""
    RX, RY = X["rec"], Y["rec"]
    dom = set(j); img = set(j.values()); jinv = {v: k for k, v in j.items()}
    types = dict(shared); types.update({k: 1 for k in shared_unary})
    agree = 0; exposed = 0; support = {x: 0 for x in j}
    for (t, tup), vx in RX.items():                         # X-known tuples over dom j
        if t not in types or not set(tup) <= dom: continue
        vy = RY.get((t, tuple(j[x] for x in tup)))
        if vy is None: exposed += 1
        elif vy != vx: return None
        else:
            agree += 1
            for x in set(tup): support[x] += 1
    for (t, tup), vy in RY.items():                         # Y-known tuples over im j whose preimage is unrecorded
        if t not in types or not set(tup) <= img: continue
        if RX.get((t, tuple(jinv[y] for y in tup))) is None: exposed += 1
    total = sum(len(j) ** a for a in types.values())
    return agree, exposed, total - agree - exposed, support

def aut(X):
    R = X["roles"]; out = []
    for perm in itertools.permutations(R):
        s = dict(zip(R, perm))
        ok = True
        for (t, tup), v in X["rec"].items():
            if X["rec"].get((t, tuple(s[x] for x in tup))) != v: ok = False; break
        if ok: out.append(s)
    return out

def top_candidates(X, Y):
    shared, shared_unary, not_same = tau_by_name(X, Y)
    if not shared and not shared_unary:
        return {"state": "EMPTY CORE (a): no relation-type in common — a translation is yours to give", "not_same": not_same}
    k = min(len(X["roles"]), len(Y["roles"]))
    best = 0; tops = []; consistent_full = 0
    for D in itertools.combinations(X["roles"], k):
        for img in itertools.permutations(Y["roles"], k):
            j = dict(zip(D, img))
            ev = evaluate(X, Y, j, shared, shared_unary)
            if ev is None: continue
            consistent_full += 1
            w = ev[0]
            if w > best: best = w; tops = [(j, ev)]
            elif w == best and w > 0: tops.append((j, ev))
    if best == 0:
        return {"state": "EMPTY CORE (b): no relation to agree on", "shared": shared, "consistent_full": consistent_full, "not_same": not_same}
    # gauge orbits among the top candidates
    AX, AY = aut(X), aut(Y)
    canon = set(); orbits = 0
    for j, _ in tops:
        key = tuple(sorted(j.items()))
        if key in canon: continue
        orbits += 1
        for a in AX:
            ainv = {v: kk for kk, v in a.items()}
            for b in AY:
                # β∘j∘α⁻¹, defined on α(dom j): x ↦ β(j(α⁻¹ x)) — the same candidate up to the two casts' own symmetries
                jj = {a[x]: b[j[x]] for x in j}
                canon.add(tuple(sorted(jj.items())))
    j0, ev0 = tops[0]
    # THE CORRECTED OFFER (K-1621's line): an offer is a maximal conflict-free candidate whose EVERY pair is SUPPORTED —
    # size follows from support, never from |X| or |Y|. Check that every top candidate found at full size is such a core.
    all_supported = all(min(ev[3].values()) > 0 for _, ev in tops)
    return {"state": "candidates", "shared": shared, "shared_unary": shared_unary, "not_same": not_same, "top_weight": best,
            "tied": len(tops), "orbits": orbits, "aut": (len(AX), len(AY)), "consistent_full": consistent_full,
            "top": j0, "exposure": ev0[1], "unrecorded": ev0[2], "support": ev0[3], "all_top_supported": all_supported}

if __name__ == "__main__":
    casts = {n: load(n) for n in ["triangle", "triangle-symmetric", "t-cell"]}
    pairs = [("triangle", "triangle-symmetric"), ("triangle", "triangle"), ("t-cell", "t-cell"), ("triangle", "t-cell")]
    for a, b in pairs:
        X, Y = casts[a], casts[b]
        print(f"=== {a} × {b} ===   |Aut| {len(aut(X))} and {len(aut(Y))}")
        r = top_candidates(X, Y)
        if r["state"] != "candidates":
            print(f"  {r['state']}" + (f" · names shared with a different arity: {r['not_same']}" if r.get('not_same') else ""))
            if "consistent_full" in r: print(f"  consistent full injections (all weight 0): {r['consistent_full']}")
            continue
        print(f"  shared types by name: {r['shared']} + unary {r['shared_unary']}" + (f" · NOT the same type (two arities): {r['not_same']}" if r['not_same'] else ""))
        print(f"  top weight {r['top_weight']} · {r['tied']} tied · {r['orbits']} gauge orbit(s) · consistent full injections {r['consistent_full']}")
        print(f"  top candidate {r['top']} · support {r['support']} · exposure {r['exposure']} · unrecorded {r['unrecorded']}")
        print(f"  every top candidate is a SUPPORTED CORE (all pairs support > 0): {r['all_top_supported']}")

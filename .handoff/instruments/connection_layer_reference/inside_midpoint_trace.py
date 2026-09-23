"""
THE INSIDE, THE MIDPOINT, THE REFUSAL, THE TRACE — grounded on the landed fixtures (Δ80 re-anchor, the mothership's
1243 §3). No candidates, no weights, no offering: the device says four things — FORM · RECORD · REFUSAL · TRACE.

  inside(X)          the census of a cast's diagram as the type holds it: points (roles) · arrows (arity-2 tuples with two
                     distinct terms, typed, polarity) · loops (a tuple whose terms repeat) · hyperedges (arity ≥ 3 tuples:
                     one node with ORDERED spokes) · marks on points (the mold's own unary type `member_status`, a value per
                     role; UNKNOWN only where the caster wrote it) · carried (axioms, warrant, marks — present, unread).
                     The UNRECORDED is absence: nothing is drawn for it.
  glue(A, B, J, tau) the midpoint: the pushout of the two records over the person's role-map J (one-to-one, partial) and
                     word-map tau (one-to-one, arity-preserving, partial). The glued record is the UNION relabelled; a tuple
                     known on both sides with different values is a CONTRADICTION → the act is REFUSED, by name (every
                     offending tuple listed). Words outside tau stay FOREIGN to each other even when spelled alike (the
                     same-name proposal is retired, Δ80); the mold's own type is ONE type on both sides by definition.
                     J = tau = ∅ → the disjoint union: the parents side by side, unglued.
  trace(M)           what the act did to the record, as description: for each glued role, the tuples now about it by ORIGIN
                     (A · B · both — 'both' = one tuple, two witnesses); for each parent, what met no partner: roles outside
                     the map, tuples on them, tuples on mapped roles in untranslated words, tuples in translated words the
                     other side has UNRECORDED (the exposure). A partition of the glued record — never an order on acts.

SEALED BY HAND from the fixture files at 10ccb00 before the run (the run must reproduce these or the definition is wrong):
  triangle   3 points · 3 arrows · 0 loops · 0 hyper · 0 neg · 1 word · 0 marks
  t-cell    10 points · 10 arrows · 0 loops · 1 hyper removes(r8,r3,r2) · 3 neg · 6 words · 10 marks
  flow      14 points · 31 arrows · 3 loops (disjoins F4, sustains F5, sustains F7) · 0 hyper · 0 neg · 11 words · 14 marks
  phi        9 points · 15 arrows · 7 loops (6 on Φ1, 1 on Φ7: descends-from) · 0 hyper · 0 neg · 14 words · 9 marks
  flow ⊔_∅ phi        glued: 23 roles · 25 words · 56 relation tuples · 23 marks
  flow × phi, J3/τ3   glued: 20 roles · 22 words · 52 relation tuples (4 'both') · 20 marks
      [F5≡Φ7]  7 rel tuples: both 1 · flow 4 · phi 2        [F7≡Φ1] 24: both 3 · flow 7 · phi 14        [F8≡Φ2] 7: both 2 · flow 3 · phi 2
      flow alone: 11 roles · 27 tuples on them · 3 untranslated on mapped · 0 exposed
      phi  alone:  6 roles · 11 tuples on them · 7 untranslated on mapped · 0 exposed
  t-cell × phi, r8↦Φ6 r0↦Φ1, sustains↦descends-from   REFUSED, exactly 1 name: sustains(r8,r0)=does-not-hold vs descends-from(Φ6,Φ1)=holds
  t-cell × phi, r7↦Φ9, τ=∅                            REFUSED, exactly 1 name: member_status(r7)=has vs member_status(Φ9)=none-by-nature
  flow × phi, F2↦Φ1, disjoins↦descends-from            glued: [F2≡Φ1] 23 rel tuples: both 0 · flow 6 · phi 17;
      flow alone: 13 roles · 34 on them · 0 untranslated · 0 exposed;  phi alone: 8 roles · 16 on them · 5 untranslated · 1 exposed
      (the 09-08 case where a homomorphism-core amalgam FABRICATED into Flow: here the one tuple is an exposure, an absence shown)
"""
import os, json, collections
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
FIX = os.path.join(REPO, "scripts", "fixtures", "casts")
MOLD_TYPE = "member_status"          # the mold's own unary type — one type on every cast by the device's contract, not a caster's word
# FINDING on the run (2026-09-22): `member_status` has three values {has · unrecorded · none-by-nature}, but `unrecorded` was DEFINED
# (REPLY_TO_THE_U_SEAT_89 :9) as "the honest value when the members EXIST and the record has none" — so `has` and `unrecorded` assert
# the same ROLE-fact (members exist) and differ only in a RECORD-fact the device never reads. Compared by bare value-equality (the
# landed jRegister.ts:231 rule, and this file's first run — kept in the RESULTS) `has` vs `unrecorded` REFUSED: a fabricated refusal.
# Ruled: the mold's type is compared as the role-fact; the glued value is the union record's — `has ⊔ unrecorded = has` (the union of
# the two records lists members iff one of them does), derived from record = union, not invented. Only `none-by-nature` against
# {has, unrecorded} contradicts. UNKNOWN / omitted stay absence (never a value).
MOLD_JOIN = {frozenset({"has", "unrecorded"}): "has"}
def mold_join(u, v):
    if u == v: return u
    return MOLD_JOIN.get(frozenset({u, v}))          # None = contradiction
# AMENDED 2026-09-22 (the mothership's 1210 §2, confirmed against `src/lib/midpointGlue.ts:145-149`): this file keyed EVERY
# mark as ('M', k) — side-less — which shares a CASTER unary key by NAME, the very by-name sharing Δ80 retired. Only the
# MOLD's keys are one type by definition; a caster key is one type only where τ pairs it, exactly like a relation-word.
# The landed build was already right; the instrument was written before the words' rule. No landed fixture carries a caster
# unary key, so no measured number moves — `caster_key_case()` below is the falsifier that WOULD have moved.
def mark_type(side, k, tau_key):
    if k == MOLD_TYPE: return ("M", k)                                   # the device's own contract — one type, both sides
    if side == "A" and k in tau_key: return ("M", ("T", k))              # paired by the person
    if side == "B" and k in {v for v in tau_key.values()}:
        return ("M", ("T", {v: kk for kk, v in tau_key.items()}[k]))
    return ("M", (side, k))                                              # foreign, even when spelled alike

def load(name):
    d = json.load(open(os.path.join(FIX, name + ".cast.json"), encoding="utf-8"))
    roles = [r["id"] for r in d["roles"]]
    sig = {s["type"]: s["arity"] for s in d["signature"]}
    rec = {(r["type"], tuple(r["terms"])): r["polarity"] for r in d["relations"]}
    marks = {}                                                # (K, role) -> value, UNKNOWN kept as the caster's own mark
    for r in d["roles"]:
        for k, v in (r.get("types") or {}).items():
            marks[(k, r["id"])] = v
    return {"name": name, "roles": roles, "sig": sig, "rec": rec, "marks": marks,
            "axioms": len(d.get("axioms") or []), "warrant": "warrant" in d}

def inside(X):
    arrows = [(t, tup, v) for (t, tup), v in X["rec"].items() if len(tup) == 2 and tup[0] != tup[1]]
    loops = [(t, tup, v) for (t, tup), v in X["rec"].items() if len(tup) == 2 and tup[0] == tup[1]]
    hyper = [(t, tup, v) for (t, tup), v in X["rec"].items() if len(tup) >= 3]
    neg = sum(1 for v in X["rec"].values() if v == "does-not-hold")
    unknown = sum(1 for v in X["marks"].values() if v == "UNKNOWN")
    print(f"  {X['name']:9s} points {len(X['roles'])} · arrows {len(arrows)} · loops {len(loops)} {[(t,tup[0]) for t,tup,_ in loops]} · "
          f"hyper {len(hyper)} {[(t,tup) for t,tup,_ in hyper]} · neg {neg} · words {len(X['sig'])} · "
          f"marks {len(X['marks'])} (UNKNOWN by the caster: {unknown}) · carried unread: axioms {X['axioms']}, warrant {X['warrant']}")

def glue(A, B, J, tau, tau_key=None):
    """('refused', [names]) or ('glued', M). Roles: ('J',a) for a glued pair, ('A',x)/('B',y) otherwise.
    Words: ('T',t) for a translated pair, ('A',t)/('B',t) otherwise — alike spellings outside tau stay foreign.
    Marks: the mold's type is ('M', K) on both sides — one type by definition."""
    tau_key = tau_key or {}                          # the person's pairing of CASTER unary keys (the mold's needs none)
    inv = {b: a for a, b in J.items()}; tinv = {v: k for k, v in tau.items()}
    rep = lambda side, x: ("J", x) if (side == "A" and x in J) else (("J", inv[x]) if (side == "B" and x in inv) else (side, x))
    trep = lambda side, t: ("T", t) if (side == "A" and t in tau) else (("T", tinv[t]) if (side == "B" and t in tinv) else (side, t))
    record = {}; origin = collections.defaultdict(set); refusals = []
    def put(key, val, side, name):
        if key in record and record[key] != val:
            if is_mark(key) and key[0][1] == MOLD_TYPE and mold_join(record[key], val) is not None:
                record[key] = mold_join(record[key], val); origin[key].add(side); return      # one role-fact, two record-facts
            refusals.append(f"{name} against the other side's {record[key]} on the same glued tuple"); return
        record[key] = val; origin[key].add(side)
    for side, X in (("A", A), ("B", B)):
        for (t, tup), v in X["rec"].items():
            put((trep(side, t), tuple(rep(side, x) for x in tup)), v, side, f"{t}({', '.join(tup)})={v} [{X['name']}]")
        for (k, x), v in X["marks"].items():
            if v != "UNKNOWN": put((mark_type(side, k, tau_key), (rep(side, x),)), v, side, f"{k}({x})={v} [{X['name']}]")
    if refusals: return "refused", refusals
    roles = {rep("A", a) for a in A["roles"]} | {rep("B", b) for b in B["roles"]}
    words = {trep("A", t) for t in A["sig"]} | {trep("B", t) for t in B["sig"]}
    return "glued", {"roles": roles, "words": words, "record": record, "origin": origin, "J": J, "tau": tau, "A": A, "B": B}

def is_mark(key): return key[0][0] == "M"

def trace(M):
    A, B, J, tau = M["A"], M["B"], M["J"], M["tau"]; inv = {b: a for a, b in J.items()}; tinv = {v: k for k, v in tau.items()}
    rels = {k: v for k, v in M["record"].items() if not is_mark(k)}; marks = {k: v for k, v in M["record"].items() if is_mark(k)}
    both_rel = sum(1 for k in rels if M["origin"][k] == {"A", "B"})
    print(f"  glued: {len(M['roles'])} roles (= {len(A['roles'])} + {len(B['roles'])} − {len(J)}) · {len(M['words'])} words · "
          f"{len(rels)} relation tuples ({both_rel} 'both') · {len(marks)} marks")
    print("  WHAT NOW SITS ON ONE ROLE (relation tuples about each glued role, by origin):")
    for a, b in sorted(J.items()):
        m = ("J", a)
        about = [sorted(M["origin"][k]) for k in rels if m in k[1]]
        print(f"    [{a} ≡ {b}] {len(about)}: both {about.count(['A','B'])} · {A['name']} {about.count(['A'])} · {B['name']} {about.count(['B'])}"
              f"   mark {MOLD_TYPE}: {marks.get((('M', MOLD_TYPE), (m,)), '—')} ({'/'.join(sorted(M['origin'][(('M', MOLD_TYPE), (m,))]))})")
    for side, X, Y, dom, tdom in (("A", A, B, set(J), set(tau)), ("B", B, A, set(J.values()), set(tau.values()))):
        unmatched = [r for r in X["roles"] if r not in dom]
        on_unmatched = untranslated = exposed = 0
        for (t, tup), v in X["rec"].items():
            if any(x not in dom for x in tup): on_unmatched += 1; continue
            if t not in tdom: untranslated += 1; continue
            other = (tau[t] if side == "A" else tinv[t], tuple((J[x] if side == "A" else inv[x]) for x in tup))
            if Y["rec"].get(other) is None: exposed += 1
        print(f"  WHAT {X['name']} STILL HOLDS ALONE: {len(unmatched)} roles met no partner · {on_unmatched} tuples on them · "
              f"{untranslated} on mapped roles in untranslated words · {exposed} in translated words the other side has UNRECORDED")

def gaifman(X):
    """the Gaifman graph: an edge between two DISTINCT roles that co-occur in some tuple — forgets word, order, polarity, arity, loops"""
    E = set()
    for (t, tup) in X["rec"]:
        for i in range(len(tup)):
            for j in range(i + 1, len(tup)):
                if tup[i] != tup[j]: E.add(frozenset({tup[i], tup[j]}))
    return E

def pullback_core(M):
    """K = A ×_M B: the roles glued and the tuples recorded on BOTH sides with one value — the 'both' partition, as a structure"""
    rels = [k for k, v in M["record"].items() if not is_mark(k) and M["origin"][k] == {"A", "B"}]
    marks = [k for k, v in M["record"].items() if is_mark(k) and M["origin"][k] == {"A", "B"}]
    return {"roles": len(M["J"]), "rels": len(rels), "marks": len(marks)}

if __name__ == "__main__":
    C = {n: load(n) for n in ["triangle", "triangle-symmetric", "t-cell", "flow", "phi"]}
    print("=== THE INSIDE — what the type holds, drawn ===")
    for n in C: inside(C[n])
    print("  — against the Gaifman graph (lossy): tuples → edges")
    for n in C: print(f"    {n:9s} {len(C[n]['rec'])} tuples → {len(gaifman(C[n]))} Gaifman edges")
    print("\n=== THE MOLD'S TYPE at the glue — has · unrecorded · none-by-nature (minimal casts) ===")
    mk = lambda nm, r, v: {"name": nm, "roles": [r], "sig": {}, "rec": {}, "marks": {(MOLD_TYPE, r): v}, "axioms": 0, "warrant": False}
    for u, v in (("has", "unrecorded"), ("unrecorded", "unrecorded"), ("has", "has"), ("unrecorded", "none-by-nature"),
                 ("has", "none-by-nature"), ("UNKNOWN", "has"), ("UNKNOWN", "none-by-nature"), ("UNKNOWN", "UNKNOWN")):
        st, R = glue(mk("a", "x", u), mk("b", "y", v), {"x": "y"}, {})
        cell = (("M", MOLD_TYPE), (("J", "x"),))
        print(f"  {u:10s} × {v:15s} → {st}" + (f", glued value {R['record'].get(cell, '— (no value: both absent)')}"
              f" witnesses {sorted(R['origin'][cell]) if cell in R['record'] else '[]'}" if st == 'glued' else f" {R}"))
    print("\n=== A CASTER unary key spelled alike on both casts — FOREIGN unless τ pairs it (the falsifier for the amendment) ===")
    ck = lambda nm, r, v: {"name": nm, "roles": [r], "sig": {}, "rec": {}, "marks": {("colour", r): v}, "axioms": 0, "warrant": False}
    for lbl, tk in (("τ_key = ∅ (foreign)", {}), ("τ_key = {colour ↦ colour} (paired)", {"colour": "colour"})):
        st, R = glue(ck("a", "x", "red"), ck("b", "y", "blue"), {"x": "y"}, {}, tau_key=tk)
        print(f"  colour=red × colour=blue, {lbl:34s} → {st}" +
              (f": {len([k for k in R['record'] if is_mark(k)])} marks on the one glued role — two records, side by side" if st == "glued" else f": {R}"))
    print("\n=== THE UNMAPPED MIDPOINT — flow ⊔_∅ phi (J = τ = ∅) ===")
    st, M = glue(C["flow"], C["phi"], {}, {}); print(f"  {st}"); trace(M)
    print("\n=== A GIVEN MAP — flow × phi, the 09-08 size-3 map under τ₃ (the PERSON's, here; nothing is offered) ===")
    J3 = {"F5": "Φ7", "F7": "Φ1", "F8": "Φ2"}; T3 = {"sustains": "descends-from", "presupposes": "specifies", "exceeds-in-size": "lodges-in"}
    st, M = glue(C["flow"], C["phi"], J3, T3); print(f"  {st}"); trace(M) if st == "glued" else print(M)
    K = pullback_core(M); print(f"  the core K = flow ×_M phi: {K['roles']} roles · {K['rels']} relation tuples · {K['marks']} marks;  "
          f"M = flow ⊔_K phi: {len(C['flow']['roles'])} + {len(C['phi']['roles'])} − {K['roles']} = {len(M['roles'])} roles ✔" if len(M['roles']) == 14 + 9 - K['roles'] else "  ✘ |M| ≠ |A| + |B| − |K|")
    print("\n=== THE REFUSAL — t-cell × phi, r8↦Φ6 · r0↦Φ1 under sustains↦descends-from ===")
    st, R = glue(C["t-cell"], C["phi"], {"r8": "Φ6", "r0": "Φ1"}, {"sustains": "descends-from"}); print(f"  {st}: {R if st == 'refused' else 'GLUED — seal broken'}")
    print("\n=== THE REFUSAL on the mold's type — t-cell × phi, r7↦Φ9, τ = ∅ ===")
    st, R = glue(C["t-cell"], C["phi"], {"r7": "Φ9"}, {}); print(f"  {st}: {R if st == 'refused' else 'GLUED — seal broken'}")
    print("\n=== NOT A REFUSAL — flow × phi, F2↦Φ1 under disjoins↦descends-from (the 09-08 fabrication site) ===")
    st, M = glue(C["flow"], C["phi"], {"F2": "Φ1"}, {"disjoins": "descends-from"}); print(f"  {st}"); trace(M) if st == "glued" else print(M)

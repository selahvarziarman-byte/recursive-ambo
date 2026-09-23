"""
THIN CAST READINGS — what the device READS from a minimal cast (the designer's question, 2026-09-19):
Arman's example — "a concept-space expressed as a triangulation itself: three instances with three relations" —
cast three ways, each a lawful finite relational structure, each with NO axioms, NO warrant, NO reasons, NO sources:
  T-cyc   roles x y z; ONE relation-type r (arity 2), instances r(x,y) r(y,z) r(z,x)         — a directed 3-cycle
  T-sym   the same with r symmetric: both directions listed                                    — an undirected triangle
  T-3typ  three DIFFERENT relation-types p q s, one instance each: p(x,y) q(y,z) s(z,x)        — an articulated triangle
  T-face  T-cyc plus the 2-simplex as an arity-3 relation f(x,y,z)                             — the triangulation with its face
What the device reads (never grades): the automorphism group (gauge freedom), and the identification candidates
against a COPY of itself (weight = known agreements; a tie among candidates is gauge; the meet across candidates is
what structure alone fixes). Sealed: T-cyc |Aut| = 3, three tied full candidates, meet = ∅ · T-sym |Aut| = 6, six tied,
meet = ∅ · T-3typ |Aut| = 1, ONE full candidate, meet = everything · T-face as T-cyc (the face does not break the rotation).
Nothing here is a defect of any cast: it is the reading a thin structure yields, and a thick one does not.
"""
import itertools

def make(roles, sig, rels):
    return {"roles": roles, "sig": sig, "rels": set(rels)}

def automorphisms(S):
    R = S["roles"]; out = []
    for perm in itertools.permutations(R):
        s = dict(zip(R, perm))
        img = {(t, tuple(s[x] for x in tup)) for t, tup in S["rels"]}
        if img == S["rels"]: out.append(s)
    return out

def candidates(A, B, k):
    """partial isomorphisms of size k with the IDENTITY type translation (a copy shares the signature): exact agreement
    on listed tuples inside the domain, both ways; weight = agreeing instances."""
    out = []
    for D in itertools.combinations(A["roles"], k):
        for img in itertools.permutations(B["roles"], k):
            p = dict(zip(D, img)); Ds = set(D); Is = set(img)
            a_in = {(t, tuple(p[x] for x in tup)) for t, tup in A["rels"] if set(tup) <= Ds}
            b_in = {(t, tup) for t, tup in B["rels"] if set(tup) <= Is}
            if a_in == b_in and a_in:
                out.append((len(a_in), p))
    return out

def report(name, S):
    auts = automorphisms(S)
    full = candidates(S, S, len(S["roles"]))
    w = max((x[0] for x in full), default=0)
    top = [p for ww, p in full if ww == w]
    meet = None
    for p in top:
        meet = dict(p) if meet is None else {x: y for x, y in meet.items() if p.get(x) == y}
    print(f"  {name:7s} |Aut| = {len(auts)} · full candidates against a copy: {len(full)} (top weight {w}, {len(top)} tied) · "
          f"meet across the tied = {meet if meet else '∅'}")

T_cyc  = make(["x", "y", "z"], {"r": 2}, [("r", ("x", "y")), ("r", ("y", "z")), ("r", ("z", "x"))])
T_sym  = make(["x", "y", "z"], {"r": 2}, [("r", ("x", "y")), ("r", ("y", "x")), ("r", ("y", "z")), ("r", ("z", "y")), ("r", ("z", "x")), ("r", ("x", "z"))])
T_3typ = make(["x", "y", "z"], {"p": 2, "q": 2, "s": 2}, [("p", ("x", "y")), ("q", ("y", "z")), ("s", ("z", "x"))])
T_face = make(["x", "y", "z"], {"r": 2, "f": 3}, [("r", ("x", "y")), ("r", ("y", "z")), ("r", ("z", "x")), ("f", ("x", "y", "z"))])
print("=== what the device reads from a minimal cast (no axioms, no warrant, no reasons) ===")
for n, S in [("T-cyc", T_cyc), ("T-sym", T_sym), ("T-3typ", T_3typ), ("T-face", T_face)]: report(n, S)
# the bare set: three roles, no relations
bare = make(["x", "y", "z"], {}, [])
print(f"  bare    |Aut| = {len(automorphisms(bare))} · candidates against a copy with weight > 0: {len(candidates(bare, bare, 3)) + len(candidates(bare, bare, 2))} — the EMPTY CORE: offered as a state, never as a blank")

"""§8(b)'s identity, FALSIFIED not confirmed: h_A = proj_C^{-1} o J_AB, where h_A = J_CA o J_BC o J_AB (0031 §1.4's
composition order) and proj_C = J_CB o J_AC.  Seal before running: (1) the identity holds for EVERY triple of partial
injections (it is the inverse-category axioms + symmetry J_e-bar = J_e^{-1}, nothing about the data); (2) the POSITIVE
CONTROL — the same expression with the composition order reversed (proj = J_AC o J_CB, the wrong reading) must FAIL on
some triple, or the test cannot tell a right convention from a wrong one."""
import random
def comp(g, f):                       # (g o f)(x) = g(f(x)) — apply f first
    return {x: g[y] for x, y in f.items() if y in g}
def inv(f):  return {v: k for k, v in f.items()}
def rnd(src, dst, rng):               # a random partial injection src -> dst
    s = rng.sample(src, rng.randint(0, len(src))); d = rng.sample(dst, len(s))
    return dict(zip(s, d))
A, B, C = [f"a{i}" for i in range(6)], [f"b{i}" for i in range(6)], [f"c{i}" for i in range(6)]
rng = random.Random(202); bad_right = bad_wrong = 0
for _ in range(20000):
    J_AB, J_AC, J_BC = rnd(A, B, rng), rnd(A, C, rng), rnd(B, C, rng)
    J_CA, J_CB = inv(J_AC), inv(J_BC)
    h_A = comp(J_CA, comp(J_BC, J_AB))            # A -> B -> C -> A
    proj_C = comp(J_CB, J_AC)                     # A -> C -> B
    if comp(inv(proj_C), J_AB) != h_A: bad_right += 1
    wrong = comp(J_AC, J_CB)                      # the reversed convention — the positive control
    if comp(inv(wrong), J_AB) != h_A: bad_wrong += 1
print(f"20000 random triples of partial injections on 6+6+6 roles")
print(f"  h_A == proj_C^-1 o J_AB          : failures {bad_right}   (sealed: 0 — an identity)")
print(f"  h_A == wrong_order^-1 o J_AB     : failures {bad_wrong}   (sealed: > 0 — the control; a test that cannot fail proves nothing)")
# the reading of the identity, on one instance, in the vocabulary of the ruling
J_AB = {"a0":"b0","a1":"b1","a2":"b2"}; J_AC = {"a0":"c0","a1":"c9","a3":"c3"}; J_BC = {"b0":"c0","b1":"c1","b4":"c4"}
J_CA, J_CB = inv(J_AC), inv(J_BC); proj_C = comp(J_CB, J_AC)
h = comp(J_CA, comp(J_BC, J_AB))
print(f"\none instance — J_AB {J_AB}\n  proj_C (the route through C) {proj_C}\n  h_A {h}")
print(f"  Fix {sorted(x for x,y in h.items() if x==y)}  Mov {sorted(x for x,y in h.items() if x!=y)}")
print(f"  where the direct J_AB AGREES with the projection: {sorted(x for x in J_AB if x in proj_C and proj_C[x]==J_AB[x])} -> these are exactly Fix(h)")

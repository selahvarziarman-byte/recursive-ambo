"""
BIANCHI FOR PARTIAL IDENTIFICATIONS — the chair's §7 prediction (1644), run to kill it.

The prediction: "six independently-posited J's on the tetrahedron will generically FAIL the
Bianchi relation (the ordered product of the four face-holonomies = identity), and the failure
is a computable inconsistency in the person's own identifications."

Ruling sealed before the run (2026-09-08):
  Bianchi is an IDENTITY, not a constraint.  In the free group on the six edges the cell's
  boundary word  W = ∂ABC · ∂ACD · (ad·∂DCB·da) · ∂ABD⁻¹  reduces to the empty word.  With J's as
  PARTIAL bijections, composition is monotone under inclusion of graphs and J;J⁻¹ ⊆ id, so
  value(W) ⊆ value(reduced W) = id:  the cell's holonomy is a PARTIAL IDENTITY for ANY six J's.
  ⇒ no six identifications can fail it.  Expected: 0 failures in N random trials.
  Positive controls (the instrument can see a change): a single face's holonomy, and a
  quadrilateral loop's, are generically NOT partial identities.
  Also measured: how often the cell's holonomy is EMPTY (Bianchi vacuous), and whether the
  quadrilateral loop's holonomy exceeds the product of the two faces it spans (faces do not
  generate the cell's gluing under partiality).
"""
import random, itertools

def compose(f, g):                      # f then g, as partial bijections (dicts)
    return {x: g[y] for x, y in f.items() if y in g}
def inverse(f): return {y: x for x, y in f.items()}
def word(J, letters):                   # letters like 'ab','bc'... ; 'ba' = inverse of 'ab'
    h = None
    for L in letters:
        f = J[L] if L in J else inverse(J[L[::-1]])
        h = f if h is None else compose(h, f)
    return h
def is_partial_identity(h): return all(x == y for x, y in h.items())
def random_partial_bijection(X, Y, rng, p_defined=0.6):
    xs = [x for x in X if rng.random() < p_defined]; ys = rng.sample(Y, min(len(xs), len(Y)))
    return dict(zip(xs, ys))

W        = "ab bc ca  ac cd da  ad dc cb bd da  ad db ba".split()   # the cell's boundary word (reduces to empty)
FACE     = "ab bc ca".split()                                        # ∂ABC at A
QUAD     = "ab bd dc ca".split()                                     # A→B→D→C→A, spans faces ABD and ADC
QUAD_VIA = "ab bd da  ad dc ca".split()                              # the same loop as ∂ABD · ∂ADC (detour through A)

rng = random.Random(2026); N = 20000; n = 7
fail_W = 0; empty_W = 0; face_changed = 0; quad_changed = 0; quad_exceeds = 0; dom_sizes = []
for _ in range(N):
    corners = {c: [f"{c}{i}" for i in range(n)] for c in "abcd"}
    J = {}
    for e in ("ab", "ac", "ad", "bc", "bd", "cd"):
        J[e] = random_partial_bijection(corners[e[0]], corners[e[1]], rng)
    hW = word(J, W); hF = word(J, FACE); hQ = word(J, QUAD); hQv = word(J, QUAD_VIA)
    if not is_partial_identity(hW): fail_W += 1
    if not hW: empty_W += 1
    dom_sizes.append(len(hW))
    if not is_partial_identity(hF): face_changed += 1
    if not is_partial_identity(hQ): quad_changed += 1
    assert all(hQ.get(x) == y for x, y in hQv.items()), "monotonicity violated"   # via ⊆ direct, always
    if len(hQ) > len(hQv): quad_exceeds += 1

print(f"N = {N} random tetrahedra, {n} roles per corner, six independent partial J's (p_defined 0.6)")
print(f"  cell word W: NOT a partial identity in {fail_W} trials      (sealed: 0)")
print(f"  cell word W: EMPTY (Bianchi vacuous) in {empty_W} trials  ({100*empty_W/N:.1f}%); mean |dom| = {sum(dom_sizes)/N:.2f} of {n}")
print(f"  control — one face returns some role CHANGED in {face_changed} trials ({100*face_changed/N:.1f}%)")
print(f"  control — the quadrilateral loop returns some role changed in {quad_changed} trials ({100*quad_changed/N:.1f}%)")
print(f"  quadrilateral holonomy strictly EXCEEDS the product of its two faces (defined where the detour through A is not) in {quad_exceeds} trials ({100*quad_exceeds/N:.1f}%)")

# the proof, exhibited once: free reduction of W
def reduce(ws):
    out = []
    for L in ws:
        if out and out[-1] == L[::-1]: out.pop()
        else: out.append(L)
    return out
print(f"\n  free reduction of W: {' '.join(W)}  ->  {reduce(W) or '(empty)'}")

"""
G3 DOUBLED ROLES — fork falsifier (c) (RULING_THE_FORK_… §4; ADR 0031 §3.5), branch (i), on the first face Flow · T · Φ.

The tower under branch (i):
  gen 0  corners A, B, C with the person's J_AB, J_BC, J_CA (symmetric partial bijections).
  gen 1  midpoints M_AB = A ⊔_J B etc.; corner edges carry the parent's injection; medial edges (two midpoints sharing a
         corner) carry the identity on the shared corner's classes.
  gen 2  the midpoint of a medial edge M_XY — M_YZ is P_Y = M_XY ⊔_Y M_YZ = X ⊔ Y ⊔ Z over J_XY and J_YZ only.
  gen 3  the medial triangle's medial edges join P_A — P_B (sharing M_AB's classes AND C's roles), etc. Their shared
         identification is the MEET of "identity on M_AB" and "identity on C": a class of P_A whose roles would have to go to
         two different classes of P_B (or two classes to one) is a CONFLICT and falls into Und; the pushout over the meet
         then HOUSES that class twice — once as P_A holds it, once as P_B does.
Sealed before the run (derived: a role c of C has two routes into A — J_CA(c) directly, and J_AB⁻¹(J_BC⁻¹(c)) through B —
which disagree exactly when the A-role a = J_AB⁻¹ J_BC⁻¹ (c) is MOVED by the face holonomy h = J_CA ∘ J_BC ∘ J_AB):
  S1  the number of conflicting (doubled) classes at the gen-3 midpoint of P_A — P_B equals |Mov(h_A)|, and the doubled
      classes are exactly the classes of the roles h moves;
  S2  where h is a partial identity (no Mov), NO class doubles — the stone's tower is silent exactly when the face is flat;
  S3  the same holds on the other two gen-3 medial midpoints with the holonomy read at their own shared corner.
Run on the seven hand triples of the first face and the eighteen weight-5 triples (RESULTS_2026-09-10_…).
"""
import os, collections
HERE = os.path.dirname(os.path.abspath(__file__))
exec(open(os.path.join(HERE, "hinge_data.py"), encoding="utf-8").read())   # F, PHI
T_ROLES = [f"r{i}" for i in range(10)]

HAND = {
 "A":  {"r9": "F8", "r1": "F7", "r0": "F1", "r2": "F12", "r8": "F13"},
 "B'": {"r9": "F3", "r1": "F9", "r0": "F5", "r7": "F13", "r8": "F1", "r2": "F7"},
 "C":  {"r9": "F12", "r1": "F13", "r0": "F9", "r6": "F1", "r2": "F3"},
 "D":  {"r9": "F12", "r1": "F1", "r0": "F2", "r7": "F7", "r2": "F5"},
 "S1": {"r0": "F13", "r1": "F9", "r2": "F1", "r4": "F12", "r6": "F3", "r8": "F7"},
 "S4": {"r0": "F13", "r1": "F9", "r2": "F1", "r6": "F3", "r7": "F5", "r8": "F7"},
 "S2": {"r0": "F9", "r1": "F3", "r2": "F13", "r6": "F10", "r7": "F5", "r8": "F12"},
 "P":  {"r0": "Φ1", "r1": "Φ2", "r2": "Φ7", "r4": "Φ5", "r6": "Φ3"},
 "Q":  {"r9": "Φ6", "r1": "Φ1", "r0": "Φ8", "r7": "Φ5", "r6": "Φ2"},
 "R":  {"r0": "Φ1", "r1": "Φ6", "r7": "Φ5", "r2": "Φ7", "r4": "Φ8"},
}
J_FPHI = {"(i)": {"F7": "Φ1", "F8": "Φ2", "F5": "Φ7"}, "(ii)": {"F1": "Φ3", "F2": "Φ2", "F3": "Φ4", "F5": "Φ1"}}
inv = lambda d: {v: k for k, v in d.items()}
comp = lambda f, g: {x: g[y] for x, y in f.items() if y in g}

class UF:
    def __init__(self, items): self.p = {x: x for x in items}
    def find(self, x):
        while self.p[x] != x: x = self.p[x]
        return x
    def union(self, x, y):
        rx, ry = self.find(x), self.find(y)
        if rx != ry: self.p[rx] = ry
    def classes(self):
        d = collections.defaultdict(set)
        for x in self.p: d[self.find(x)].add(x)
        return d

def P_cell(A, B, C, J_AB, J_BC):
    """P_B = A ⊔ B ⊔ C over J_AB and J_BC (tagged roles)."""
    uf = UF([("A", a) for a in A] + [("B", b) for b in B] + [("C", c) for c in C])
    for a, b in J_AB.items(): uf.union(("A", a), ("B", b))
    for b, c in J_BC.items(): uf.union(("B", b), ("C", c))
    return uf

def meet_identification(P1, P2):
    """The shared identification between two gen-2 cells: identity on every common role; a class of P1 whose roles land in
    two classes of P2 (or two classes of P1 onto one of P2) is a conflict. Returns (identified pairs, conflicting classes)."""
    c1, c2 = P1.classes(), P2.classes()
    image = {}
    for r1, cls in c1.items():
        targets = {P2.find(x) for x in cls}
        image[r1] = targets
    conflicts = {r1 for r1, t in image.items() if len(t) != 1}
    # injectivity: two P1 classes onto one P2 class
    by_target = collections.defaultdict(list)
    for r1, t in image.items():
        if len(t) == 1: by_target[next(iter(t))].append(r1)
    for t, srcs in by_target.items():
        if len(srcs) > 1: conflicts.update(srcs)
    ident = {r1: next(iter(t)) for r1, t in image.items() if r1 not in conflicts}
    return ident, conflicts, c1, c2

def run(label, J_AB, J_BC, J_CA, A, B, C):
    # the face holonomy at A: A -> B -> C -> A
    h = comp(comp(J_AB, J_BC), J_CA)
    mov = sorted(a for a, b in h.items() if a != b)
    # P_A = A ⊔ B ⊔ C over J_CA and J_AB (the cell sharing corner A)
    P_A = UF([("A", a) for a in A] + [("B", b) for b in B] + [("C", c) for c in C])
    for c, a in J_CA.items(): P_A.union(("C", c), ("A", a))
    for a, b in J_AB.items(): P_A.union(("A", a), ("B", b))
    P_B = P_cell(A, B, C, J_AB, J_BC)                     # over J_AB and J_BC
    ident, conflicts, c1, c2 = meet_identification(P_A, P_B)
    doubled_roles = sorted({x for r in conflicts for x in c1[r]})
    doubled_A = sorted(x[1] for x in doubled_roles if x[0] == "A")
    # FIRST SEAL (WRONG, kept as the record): doubled == Mov(h_A). It fired in every triple.
    ok_first = set(doubled_A) == set(mov)
    # CORRECTED SEAL: a class doubles iff an identification one gen-2 cell holds is NOT CONFIRMED by the other cell's route —
    # P_A's J_CA-pairs whose circuit through B does not return them unchanged (Mov OR Und of h_A, restricted to im J_CA), and
    # P_B's J_BC-pairs whose circuit through A does not return them (Mov or Und of h_B, restricted to dom J_BC), read on A.
    # SECOND SEAL (also wrong — it counted the moved role at its ORIGIN and the B-side pairs twice): kept in the record.
    h_B = comp(comp(J_BC, J_CA), J_AB)                    # B -> C -> A -> B
    second = {a for a in J_CA.values() if h.get(a) != a} | {a for a, b in J_AB.items() if b in J_BC and h_B.get(b) != b}
    # THIRD SEAL (read off the classes): a class of P_A doubles iff (1) it is a J_CA-class {a′, c} whose circuit does not
    # confirm it — a′ ∈ im J_CA with h(a′) ≠ a′ or h undefined at a′ (for a moved role a this is the class of its TARGET
    # h(a), where the two routes collide) — or (2) it is a role stranded at C: the route a → b → c exists but c has no
    # J_CA-partner, so P_B glues {a, b, c} while P_A keeps c apart (an injectivity conflict).
    reach_C = {a for a, b in J_AB.items() if b in J_BC}                 # dom(J_BC ∘ J_AB)
    predicted = {a for a in J_CA.values() if h.get(a) != a} | (reach_C - set(h))
    ok = set(doubled_A) == predicted
    ok_second = set(doubled_A) == second
    n_Q = len(c1) + len(c2) - len(ident)                 # |pushout over the meet| = |P_A| + |P_B| − |identified|
    print(f"  {label}: Mov(h_A) {mov} · doubled classes {len(conflicts)} · doubled A-roles {doubled_A} · seal1 (== Mov) {ok_first} · "
          f"seal2 {ok_second} · seal3 (== (im J_CA ∖ Fix h) ∪ (reach-C ∖ dom h)) {ok} {sorted(predicted)} · |P_A| {len(c1)} |P_B| {len(c2)} |Q_AB| {n_Q}")
    return ok, len(mov), len(conflicts)

if __name__ == "__main__":
    A, B, C = F, T_ROLES, PHI
    combos = [("(i)", "A", "P"), ("(i)", "A", "Q"), ("(i)", "A", "R"), ("(ii)", "A", "P"), ("(i)", "D", "P"), ("(i)", "C", "P"), ("(i)", "B'", "P")] + \
             [(f, t, p) for t in ("S1", "S4", "S2") for f in ("(i)", "(ii)") for p in ("P", "Q", "R")]
    print("=== gen-3 doubled roles at the midpoint of P_A — P_B (A = Flow, B = T, C = Φ) ===")
    allok = True; flat = 0
    for fphi, ft, tphi in combos:
        J_AB = inv(HAND[ft]); J_BC = HAND[tphi]; J_CA = inv(J_FPHI[fphi])
        ok, nmov, nconf = run(f"{fphi}+{ft}+{tphi}", J_AB, J_BC, J_CA, A, B, C)
        allok &= ok
        if nmov == 0: flat += 1
    print(f"\nSEAL 3 — doubled A-roles == (im J_CA ∖ Fix h_A) ∪ (dom(J_BC∘J_AB) ∖ dom h_A), in every triple: {allok}   (triples with Mov(h_A) = ∅: {flat})")
    # S3: the other two medial midpoints, holonomy read at their own shared corner
    print("\n=== the other gen-3 midpoints (Q_BC with holonomy at B; Q_CA with holonomy at C) for the first triple ===")
    J_AB = inv(HAND["A"]); J_BC = HAND["P"]; J_CA = inv(J_FPHI["(i)"])
    # relabel so the shared corner is 'A' of the routine: for Q_BC, roles (B, C, A) with J_BC, J_CA, J_AB
    ok1, m1, c1n = run("(i)+A+P at Q_BC (base B)", J_BC, J_CA, J_AB, B, C, A)
    ok2, m2, c2n = run("(i)+A+P at Q_CA (base C)", J_CA, J_AB, J_BC, C, A, B)
    print(f"S3: {ok1 and ok2}")

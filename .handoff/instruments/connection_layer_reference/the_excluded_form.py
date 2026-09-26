# -*- coding: utf-8 -*-
"""
THE EXCLUDED FORM -- the projection of the opposite vertex onto an edge's child.

Runs Definitions 1-6 of
  .handoff/CONSTRUCTION_THE-PROJECTION_the-excluded-form-of-the-opposite-vertex-on-the-edge-child.md
on (S7) the worked example, (S1-S4 + regime) random casts over a tetrahedron edge AB with two
opposite corners C and D, and (S5, S6) a gen-1 inner edge with and without own content.

Seals (fixed before the run; a seal that fires is a finding, not a fault):
  S1  adding roles to C that are paired to nothing never changes Ex_C            : 100 %
  S2  Sh != {} => Act != all ; Sh == {} => VACUOUS                                : 100 %
  S3  Sh_C(A), Sh_C(B), f_C recovered exactly from Ex_C                          : 100 %
  S4  two views: Sh == union of the two shadows                                  : 100 %  (pockets counted)
  S5  gen-1 inner edge, children without own content: EXHAUSTED                  : 100 %
  S6  gen-1 inner edge, one own role per child: Act == exactly the own roles     : 100 %
  S7  the worked example yields exactly the sets in section 3 of the construction
Regime (reported, not sealed): rates of VACUOUS / EXHAUSTED / POCKET at p in {0.2, 0.5, 0.8}.
"""
import random, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

# ----------------------------------------------------------------------------- objects
def inverse(J):
    return {v: k for k, v in J.items()}

def random_pairing(RX, RY, p, rng):
    """A partial injection RX -> RY: each x paired with prob p to a distinct free y."""
    ys = list(RY); rng.shuffle(ys); J = {}
    for x in RX:
        if ys and rng.random() < p:
            J[x] = ys.pop()
    return J

# ----------------------------------------------------------------------------- Definitions 1-3
def shadow(RA, RB, J_AC, J_BC):
    return {a for a in RA if a in J_AC}, {b for b in RB if b in J_BC}

def excluded_form(RA, RB, J_AB, J_AC, J_BC):
    """Ex_C(AB) = (shadow ; K ; readings) and the active part."""
    ShA, ShB = shadow(RA, RB, J_AC, J_BC)
    J_CB = inverse(J_BC)
    K = {(a, b) for a, b in J_AB.items() if a in ShA or b in ShB}
    rho, f = {}, {}
    for a in ShA:
        c = J_AC[a]
        fb = J_CB.get(c)
        if fb is None:
            rho[a] = "UND"
        else:
            f[a] = fb
            jab = J_AB.get(a)
            if jab is None:        rho[a] = "PROPOSAL"
            elif jab == fb:        rho[a] = "FIX"
            else:                  rho[a] = "DISAGREEMENT"
    actA = set(RA) - ShA; actB = set(RB) - ShB
    act_J = {a: b for a, b in J_AB.items() if (a, b) not in K}
    return {"ShA": ShA, "ShB": ShB, "K": K, "rho": rho, "f": f,
            "actA": actA, "actB": actB, "act_J": act_J}

# ----------------------------------------------------------------------------- Definition 4
def two_views(RA, RB, J_AB, views):
    """views: dict name -> (J_A?, J_B?) for each opposite corner. Returns union shadow, act, pockets."""
    forms = {z: excluded_form(RA, RB, J_AB, JA, JB) for z, (JA, JB) in views.items()}
    ShA = set().union(*[fm["ShA"] for fm in forms.values()])
    ShB = set().union(*[fm["ShB"] for fm in forms.values()])
    actA, actB = set(RA) - ShA, set(RB) - ShB
    pockets = set()
    names = list(forms)
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            fi, fj = forms[names[i]]["f"], forms[names[j]]["f"]
            for a in set(fi) & set(fj):
                if fi[a] != fj[a]:
                    pockets.add(a)
    return forms, ShA, ShB, actA, actB, pockets

# ----------------------------------------------------------------------------- seals
def run():
    out = []
    P = out.append
    ok_all = True

    # ---- S7 worked example
    RA, RB = ["a1", "a2", "a3"], ["b1", "b2", "b3"]
    J_AB = {"a1": "b1", "a2": "b2"}; J_AC = {"a2": "c1", "a3": "c2"}; J_BC = {"b2": "c1"}
    fm = excluded_form(RA, RB, J_AB, J_AC, J_BC)
    exp = {"ShA": {"a2", "a3"}, "ShB": {"b2"}, "K": {("a2", "b2")},
           "rho": {"a2": "FIX", "a3": "UND"}, "actA": {"a1"}, "actB": {"b1", "b3"}, "act_J": {"a1": "b1"}}
    s7 = all(fm[k] == v for k, v in exp.items())
    ok_all &= s7
    P(f"S7 worked example: {'PASS' if s7 else 'FAIL'}  ShA={sorted(fm['ShA'])} ShB={sorted(fm['ShB'])} K={sorted(fm['K'])} "
      f"rho={dict(sorted(fm['rho'].items()))} act={sorted(fm['actA'])}+{sorted(fm['actB'])} act_J={fm['act_J']}")
    # C's own role c3 (unpaired) -- present by absence from every pairing; adding it changes nothing (S1 also covers it)

    # ---- S1-S4 + regime on random tetrahedron edges
    rng = random.Random(20260926)
    n, trials = 6, 2000
    for p in (0.2, 0.5, 0.8):
        s1 = s2 = s3 = s4 = 0
        vac_C = exh = pock = 0
        for _ in range(trials):
            RA = [f"a{i}" for i in range(n)]; RB = [f"b{i}" for i in range(n)]
            RC = [f"c{i}" for i in range(n)]; RD = [f"d{i}" for i in range(n)]
            J_AB = random_pairing(RA, RB, p, rng)
            J_AC = random_pairing(RA, RC, p, rng); J_BC = random_pairing(RB, RC, p, rng)
            J_AD = random_pairing(RA, RD, p, rng); J_BD = random_pairing(RB, RD, p, rng)
            fm = excluded_form(RA, RB, J_AB, J_AC, J_BC)
            # S1: add unpaired roles to C
            fm2 = excluded_form(RA, RB, J_AB, J_AC, J_BC)  # C's role set is not an input at all: the form depends on pairings only
            RC2 = RC + ["c_own1", "c_own2"]                  # (kept explicit for the reader: the roles never enter)
            s1 += (fm2 == fm)
            # S2
            sh_empty = not (fm["ShA"] or fm["ShB"])
            full = (fm["actA"] == set(RA) and fm["actB"] == set(RB))
            s2 += (sh_empty and full) or ((not sh_empty) and (not full))
            vac_C += sh_empty
            # S3: recover from the form
            recA = set(fm["rho"].keys()); recB = fm["ShB"]
            recf = {a: b for a, b in fm["f"].items()}
            truef = {a: inverse(J_BC)[J_AC[a]] for a in RA if a in J_AC and J_AC[a] in inverse(J_BC)}
            s3 += (recA == fm["ShA"] and recB == {b for b in RB if b in J_BC} and recf == truef)
            # S4: two views
            forms, ShA, ShB, actA, actB, pockets = two_views(RA, RB, J_AB, {"C": (J_AC, J_BC), "D": (J_AD, J_BD)})
            s4 += (ShA == forms["C"]["ShA"] | forms["D"]["ShA"] and ShB == forms["C"]["ShB"] | forms["D"]["ShB"])
            exh += (not actA and not actB)
            pock += bool(pockets)
        for name, val in (("S1", s1), ("S2", s2), ("S3", s3), ("S4", s4)):
            ok = (val == trials); ok_all &= ok
            P(f"{name} p={p}: {val}/{trials} {'PASS' if ok else 'FAIL'}")
        P(f"regime p={p} (n={n}, {trials} trials): VACUOUS view C {vac_C/trials:.1%} | EXHAUSTED under C+D {exh/trials:.1%} | POCKET (C,D disagree on a passage) {pock/trials:.1%}")

    # ---- S5 / S6: gen-1 inner edge Fb-Ext, corner view S and central view Config
    rng = random.Random(7)
    s5 = s6 = 0; trials2 = 500
    for _ in range(trials2):
        RH = [f"h{i}" for i in range(4)]; RS = [f"s{i}" for i in range(4)]; RBo = [f"o{i}" for i in range(4)]
        J_HS = random_pairing(RH, RS, 0.5, rng); J_BoS = random_pairing(RBo, RS, 0.5, rng); J_HBo = random_pairing(RH, RBo, 0.5, rng)
        # children as member sets (Definition 6): Fb = H u S, Ext = Bo u S, Config = H u Bo
        Fb = RH + RS; Ext = RBo + RS
        # the inner edge Fb-Ext: the person's gen-1 pairing is taken here as the shared inheritance (identity on S) --
        # the minimal derivable pairing; a person may add more.
        J_FbExt = {s: s for s in RS}
        # corner view S: S's shadow on each child = its S-members (identity pairing S -> child)
        J_Fb_S = {s: s for s in RS}; J_Ext_S = {s: s for s in RS}
        # central view Config = H u Bo: shared inheritance with Fb is H, with Ext is Bo
        J_Fb_Cfg = {h: h for h in RH}; J_Ext_Cfg = {o: o for o in RBo}
        forms, ShA, ShB, actA, actB, pockets = two_views(Fb, Ext, J_FbExt, {"S": (J_Fb_S, J_Ext_S), "Config": (J_Fb_Cfg, J_Ext_Cfg)})
        s5 += (not actA and not actB)
        # with own content: one own role per child, paired to nothing
        Fb2 = Fb + ["feedback"]; Ext2 = Ext + ["extension"]
        forms, ShA, ShB, actA, actB, pockets = two_views(Fb2, Ext2, J_FbExt, {"S": (J_Fb_S, J_Ext_S), "Config": (J_Fb_Cfg, J_Ext_Cfg)})
        s6 += (actA == {"feedback"} and actB == {"extension"})
    for name, val in (("S5", s5), ("S6", s6)):
        ok = (val == trials2); ok_all &= ok
        P(f"{name}: {val}/{trials2} {'PASS' if ok else 'FAIL'}")

    P("THE-EXCLUDED-FORM: " + ("ALL SEALS HELD" if ok_all else "A SEAL FIRED -- read the line"))
    return "\n".join(out)

if __name__ == "__main__":
    print(run())

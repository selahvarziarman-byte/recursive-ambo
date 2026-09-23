import numpy as np, itertools
np.set_printoptions(suppress=True)
phi=(1+5**0.5)/2; TOL=1e-9
def sec(t): print("\n"+"="*72+"\n"+t+"\n"+"="*72)

# ---------- helpers ----------
def comm(A,B): return A@B@np.linalg.inv(A)@np.linalg.inv(B)
def dev(M): return np.max(np.abs(M-np.eye(M.shape[0])))

sec("[1] FLAT WORLDS — T3/T2: translation transports COMMUTE EXACTLY (abelian)")
def T3(v):
    M=np.eye(4); M[:3,3]=v; return M
a,b=T3([1,0,0]),T3([0,1,0])
print(f"T3 commutator deviation ||[Tx,Ty]-I|| = {dev(comm(a,b)):.2e}  -> abelian (exact)")
print("marks available: early return + door COUNT (H1=Z^3). commutator walk (4 doors) comes HOME.")

sec("[2] RP2 — THE NAIVE-HYPOTHESIS FALSIFIER: abelian deck, RICH mark")
I3=np.eye(3); A=-I3   # deck {I,-I} on S^2
print(f"deck = {{I, -I}}, commutator deviation = {dev(comm(A,A)):.2e} -> ABELIAN (Z2)")
print(f"det(-I) = {np.linalg.det(A):+.0f}  -> ORIENTATION-REVERSING => the DOUBLED IMAGE mark (rung-2 certified)")
print(">>> NAIVE H (non-abelian <=> rich mark) is FALSIFIED: the doubling needs only 2-torsion (w1), not non-commutativity.")

sec("[3] KLEIN BOTTLE — non-abelian, and its doubling is STILL the abelian-visible part")
def aff(L,t): M=np.eye(3); M[:2,:2]=L; M[:2,2]=t; return M
Ka=aff(np.diag([1,-1]),[1,0])   # glide: (x,y)->(x+1,-y)
Kb=aff(np.eye(2),[0,1])         # (x,y)->(x,y+1)
c=comm(Ka,Kb)
print(f"[glide, translation] deviation = {dev(c):.3f}  (commutator = translation by (0,{c[1,2]:+.0f})) -> NON-ABELIAN")
print(f"det(glide linear part) = {np.linalg.det(Ka[:2,:2]):+.0f} -> w1 != 0 (doubling).  H1 = Z + Z2 (classical).")
print("the doubling factors through H1 (abelian-visible); the NON-abelian content is the glide-vs-translation ROUTE-DEPENDENCE.")

sec("[4] LENS L(5,2) — abelian spherical: counts only, no doubling, no route-dependence")
z=np.exp(2j*np.pi/5)
def lens(k):
    M=np.zeros((4,4))
    for (i,w) in ((0,z**k),(1,z**(2*k))):
        M[2*i,2*i]=w.real; M[2*i,2*i+1]=-w.imag; M[2*i+1,2*i]=w.imag; M[2*i+1,2*i+1]=w.real
    return M
g=lens(1); print(f"cyclic Z/5 on S^3; ||[g,g^2]-I|| = {dev(comm(g,lens(2))):.2e} -> abelian; det = {np.linalg.det(g):+.3f} (orientable)")
print("H1 = Z/5 = the WHOLE group: every mark is a COUNT (5 doors home). refined-H predicts: poor-but-counted. consistent.")

sec("[5] HYPERBOLIC TRANSLATIONS — curvature FORCES non-commutativity (Preissman's shadow)")
J=np.diag([-1.,1,1,1])
def unit(v): v=np.array(v,float); return v/np.linalg.norm(v)
def Htrans(u,t):
    u=unit(u); M=np.eye(4)
    P=np.zeros((4,4)); P[0,0]=1
    # basis: e0 and u
    M=np.eye(4)
    # act on span{e0,u}: boost; identity on orthogonal complement of u in R^3
    B=np.array([[np.cosh(t),np.sinh(t)],[np.sinh(t),np.cosh(t)]])
    # build full matrix
    M=np.eye(4)
    M[0,0]=B[0,0]
    M[0,1:]=B[0,1]*u
    M[1:,0]=B[1,0]*u
    M[1:,1:]=np.eye(3)+ (B[1,1]-1)*np.outer(u,u)
    return M
u1,u2=unit([0,1,phi]),unit([0,1,-phi])
H1t,H2t=Htrans(u1,1.0),Htrans(u2,1.0)
print(f"isometry check ||G^T J G - J|| = {np.max(np.abs(H1t.T@J@H1t-J)):.2e} (positive control: the matrices are real isometries)")
print(f"||[T_u1, T_u2] - I|| = {dev(comm(H1t,H2t)):.3f}  -> in H^3 even pure translations DO NOT commute.")
print("=> in flat worlds translation transport commutes; in curved it CANNOT — crowding-richness and route-dependence are one fact.")

sec("[6] SEIFERT-WEBER at MY instrument's inradius d=0.99638 — the real deck generators")
d=0.99638; axes=[unit(v) for v in ([0,1,phi],[0,1,-phi],[1,phi,0],[1,-phi,0],[phi,0,1],[-phi,0,1])]
def rot(u,th):
    u=unit(u); K=np.array([[0,-u[2],u[1]],[u[2],0,-u[0]],[-u[1],u[0],0]])
    R3=np.eye(3)+np.sin(th)*K+(1-np.cos(th))*K@K
    M=np.eye(4); M[1:,1:]=R3; return M
def sw(u): return Htrans(u,2*d)@rot(u,3*np.pi/5)   # translate 2d along axis, twist 3/10 turn
G=[sw(u) for u in axes]
e_plus =np.concatenate(([np.sinh(d)], np.cosh(d)*axes[0]))
e_minus=np.concatenate(([np.sinh(d)],-np.cosh(d)*axes[0]))
pair_err=np.max(np.abs(G[0]@e_minus-(-e_plus)))
iso_err=max(np.max(np.abs(g.T@J@g-J)) for g in G)
dets=[np.linalg.det(g) for g in G]
print(f"positive controls: pairing e_- -> -e_+ error = {pair_err:.2e} · isometry error = {iso_err:.2e} · det = {dets[0]:+.3f} (orientable: NO doubling — consistent, SW's richness is crowding+route)")
cmax=max(dev(comm(G[i],G[j])) for i,j in itertools.combinations(range(6),2))
cmin=min(dev(comm(G[i],G[j])) for i,j in itertools.combinations(range(6),2))
print(f"commutator deviations over all 15 generator pairs: min {cmin:.3f} · max {cmax:.3f}  (vs controls ~1e-12)")
print(">>> NON-ABELIAN at O(1), nine orders above the noise floor. THE WALKABLE MARK: the 4-door commutator loop a·b·a''·b'' does NOT come home (LAW-23 countable; LAW-20 legal: doors, not felt rotation).")

sec("[7] POINCARE SPHERE — the MAXIMAL GAP: H1=0 (abelian eyes read NOTHING), 120 rooms")
def qmul(p,q):
    a,b,c,dd=p; e,f,g,h=q
    return (a*e-b*f-c*g-dd*h, a*f+b*e+c*h-dd*g, a*g-b*h+c*e+dd*f, a*h+b*g-c*f+dd*e)
def qinv(p): a,b,c,dd=p; return (a,-b,-c,-dd)
def key(p):
    r=tuple(round(x,6) for x in p); rn=tuple(round(-x,6) for x in p)
    return r  # keep both signs distinct: SU(2) elements, 120 of them
q1=(phi/2, 1/(2*phi), 0.5, 0.0)      # order 10
q2=(0.5, 0.5, 0.5, 0.5)             # order 6
seen={key(q1):q1, key(q2):q2, key((1,0,0,0)):(1,0,0,0)}
frontier=list(seen.values())
while frontier:
    nf=[]
    for p in frontier:
        for g in (q1,q2,qinv(q1),qinv(q2)):
            w=qmul(p,g); k=key(w)
            if k not in seen: seen[k]=w; nf.append(w)
    frontier=nf
Gq=list(seen.values()); n=len(Gq)
print(f"closure of <q1(order10), q2(order6)> in SU(2): |G| = {n}  (binary icosahedral = 120)")
# commutator subgroup
comms={}
for p in Gq[:60]:
    for q in Gq[:60]:
        w=qmul(qmul(p,q),qmul(qinv(p),qinv(q))); comms[key(w)]=w
frontier=list(comms.values())
while frontier:
    nf=[]
    for p in frontier:
        for g in list(comms.values())[:24]:
            w=qmul(p,g); k=key(w)
            if k not in comms: comms[k]=w; nf.append(w)
    frontier=nf
print(f"commutator subgroup size = {len(comms)}  -> abelianization order = {n//len(comms)}  => H1 = 0  (PERFECT group)")
print("matches the tower's CERTIFIED H1 = 0 (B-109). every commuting observable reads ZERO; the walker meets 120 rooms.")
print(">>> the extreme case: a form whose ENTIRE interior meaning lives in the commutator — invisible to any abelian reading.")

sec("VERDICT")
print("""NAIVE CANDIDATE (mine, as commissioned): 'non-abelian => rich marks; abelian => poor'  --  DEAD.
  killed by [2]: RP2 is ABELIAN and carries the certified doubled-image mark. (my own Appendix A predicted the killer:
  the half-turn/2-torsion family is the abelian world's one rich residue.)

THE CORRECTED LAW (what the probe leaves standing, part theorem, part measured):
  1. THE ABELIAN-READABLE MEANING OF A FORM IS EXACTLY H1 — winding COUNTS, torsion counts, and the
     half-turn family (w1: the doubled image factors through H1). RP2[2], Klein-doubling[3], L(5,2)[4] all land here.
  2. EVERYTHING BEYOND H1 — the commutator content — is INVISIBLE to every commuting instrument and readable
     ONLY through ROUTE-DEPENDENCE. (theorem-grade: route-dependence <=> non-commutativity, by definition of [a,b].)
     THE WALKABLE WITNESS: the 4-door commutator loop — home in T3 [1], NOT home in SW [6]. doors counted: 4.
  3. CURVATURE FORCES THE COMMUTATOR: in H3 even pure translations fail to commute [5] (Preissman's shadow:
     closed hyperbolic forms CANNOT have abelian deck groups) — crowding and route-dependence are one fact.
  4. THE GAP H1 -> pi1 measures how much of a form's meaning no abelian eye can see.
     Extremes measured: L(5,2) gap ZERO (all meaning countable) [4]; Poincare gap TOTAL (H1=0, |G|=120) [7].""")

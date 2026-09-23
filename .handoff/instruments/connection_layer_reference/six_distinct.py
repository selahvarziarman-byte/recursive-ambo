import numpy as np, itertools
np.set_printoptions(precision=4, suppress=True)
# SIX DISTINCT QUALITIES: fiber = R^6, one axis per passage of K4.
V='ABCD'; E=[u+v for u,v in itertools.combinations(V,2)]           # 6 passages
qi={e:i for i,e in enumerate(E)}                                    # each passage's OWN quality axis
lam={'AB':1.30,'AC':0.75,'AD':1.10,'BC':0.90,'BD':1.45,'CD':0.60}   # his 6 given eigenvalues
def tau(e, inv=False):
    T=np.eye(6); T[qi[e],qi[e]] = (1/lam[e]) if inv else lam[e]; return T
def edge(u,v):  # transport u->v (orientation: forward if u<v)
    return tau(u+v) if u+v in lam else tau(v+u, inv=True)
print("=== 1. IS THERE CURVATURE? residue around each face (diagonal gains per quality) ===")
faces=[('A','B','C'),('A','B','D'),('A','C','D'),('B','C','D')]
res={}
for f in faces:
    a,b,c=f; R=edge(c,a)@edge(b,c)@edge(a,b); res[f]=R
    gains={E[i]:round(R[i,i],4) for i in range(6) if abs(R[i,i]-1)>1e-12}
    print(f"  around {a}·{b}·{c}: ", gains if gains else "identity")
print("\n=== 2. BIANCHI: the four face-residues compose to the identity ===")
P=np.eye(6)
for f in faces: P=P@res[f]
print("  max |prod - I| =", f"{np.max(np.abs(P-np.eye(6))):.2e}", " (each quality appears in exactly 2 faces, opposite orientation)")
print("\n=== 3. ROUTE-DEPENDENCE? the 4-door commutator on the cargo ===")
c1=edge('A','B')@edge('B','C'); c2=edge('B','C')@edge('A','B')
print("  ||tau_BC.tau_AB - tau_AB.tau_BC|| =", f"{np.max(np.abs(c1-c2)):.2e}", " -> diagonal maps COMMUTE")
K=edge('B','A')@edge('C','B')@edge('A','B')@edge('B','C')   # a b a^-1 b^-1
print("  commutator word a·b·a⁻¹·b⁻¹ on the cargo: max|K - I| =", f"{np.max(np.abs(K-np.eye(6))):.2e}",
      " -> THE CARGO COMES HOME")
print("\n=== 4. THE 8-STEP SERIES along one passage (his earth->sky) ===")
l=lam['AB']; step=l**(1/8)
print(f"  lambda_AB={l}, per-step={step:.6f}; the nine stations' transcendence factor:")
print("   ", [round(step**k,4) for k in range(9)], " <- station 8 = lambda exactly:", round(step**8,10)==round(l,10))
print("\n=== 5. MIXING makes the cargo route-dependent (the later gift) ===")
M=np.eye(6); th=0.6; i,j=qi['AB'],qi['BC']
M[i,i]=M[j,j]=np.cos(th); M[i,j]=-np.sin(th); M[j,i]=np.sin(th)   # AB rotates transcendence into BC's quality
K2=np.linalg.inv(M)@np.linalg.inv(edge('B','C'))@M@edge('B','C')
print("  if one passage MIXES two qualities: commutator max|K-I| =", f"{np.max(np.abs(K2-np.eye(6))):.4f}",
      " -> cargo does NOT come home")

print("\n=== 2-CORRECTED. My first run composed all four faces with the SAME cyclic order.")
print("    The boundary of a 3-simplex ALTERNATES: d[ABCD] = [BCD] - [ACD] + [ABD] - [ABC].")
def R(f):
    a,b,c=f; return edge(c,a)@edge(b,c)@edge(a,b)
P = R(('B','C','D')) @ np.linalg.inv(R(('A','C','D'))) @ R(('A','B','D')) @ np.linalg.inv(R(('A','B','C')))
print("    with correct alternating orientation: max |prod - I| =", f"{np.max(np.abs(P-np.eye(6))):.2e}")
print("    -> BIANCHI HOLDS. Every quality appears in exactly two faces with opposite orientation and cancels.")
print("    -> AND THE FIRST RUN'S FAILURE IS THE POINT: Bianchi caught a real orientation bug in seconds.")

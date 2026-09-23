import numpy as np, itertools
phi=(1+5**0.5)/2
# --- regular dodecahedron vertices (standard) ---
V=[]
for s in itertools.product([-1,1],repeat=3): V.append(s)
for s in itertools.product([-1,1],repeat=2):
    V.append((0, s[0]/phi, s[1]*phi)); V.append((s[0]/phi, s[1]*phi, 0)); V.append((s[0]*phi, 0, s[1]/phi))
V=np.array(V,float)
# face normals = icosahedron vertices (12 directions), dot of ADJACENT face normals:
ico=[]
for s in itertools.product([-1,1],repeat=2):
    ico.append((0,s[0],s[1]*phi)); ico.append((s[0],s[1]*phi,0)); ico.append((s[0]*phi,0,s[1]))
ico=np.array(ico,float); ico=ico/np.linalg.norm(ico,axis=1,keepdims=True)
# adjacent face normals: the smallest positive dot among distinct pairs
dots=sorted({round(float(a@b),6) for i,a in enumerate(ico) for b in ico[i+1:]})
adj=[d for d in dots if d>0][0]   # nearest-neighbour normal dot
dih_E=np.degrees(np.pi-np.arccos(adj))
print(f"[EUCLIDEAN] adjacent face-normal dot = {adj:.6f}  (1/sqrt5={1/5**0.5:.6f})")
print(f"[EUCLIDEAN] regular dodecahedron dihedral = {dih_E:.4f}  deg")
print()
# --- the two targets (definitional: 360/k cells around an edge) ---
for k,name,geo in [(5,"Seifert-Weber","H3"),(3,"Poincare","S3")]:
    tgt=360.0/k
    defc=k*dih_E-360.0
    print(f"[{name} / {geo}] {k} cells per edge -> target dihedral {tgt:.3f} ; EUCLIDEAN deck-fit = {k}x{dih_E:.4f} = {k*dih_E:.4f} -> deficit {defc:+.4f} deg  (control: must FAIL)")
print()
c=adj  # cos(normal angle)=1/sqrt5 ; used below as u_i.u_j for adjacent faces
# --- solve the realization SIZE where the curved dihedral hits the target ---
def dih_H3(d):  # inradius d in hyperboloid model: cos(dih)=sinh^2 d - cosh^2 d * c
    return np.degrees(np.arccos(np.sinh(d)**2 - np.cosh(d)**2*c))
def dih_S3(d):  # inradius d on 3-sphere: cos(dih) = -(sin^2 d + cos^2 d * c)
    return np.degrees(np.arccos(-(np.sin(d)**2 + np.cos(d)**2*c)))
from scipy.optimize import brentq
dH=brentq(lambda d: dih_H3(d)-72.0, 1e-6, 1.09)
dS=brentq(lambda d: dih_S3(d)-120.0, 1e-6, np.pi/2-1e-6)
print(f"[H3] solve dihedral(inradius)=72 -> inradius {dH:.5f} ; check dihedral={dih_H3(dH):.5f} deg  (EXISTS, deficit 0)")
print(f"[S3] solve dihedral(inradius)=120-> inradius {dS:.5f} ; check dihedral={dih_S3(dS):.5f} deg  (EXISTS, deficit 0)")
print(f"[bounds] H3 dihedral range: euclidean-small {dih_H3(1e-4):.3f} -> ideal {dih_H3(1.0986):.3f} deg  (72 lies inside -> reachable)")
print(f"[bounds] S3 dihedral range: euclidean-small {dih_S3(1e-4):.3f} -> {dih_S3(1.2):.3f} deg  (120 lies inside -> reachable)")
print()
print("[TRAP grounding] a distance-keyed edge-adjacency (which cells touch, read from realized positions)")
print("   re-selects with the realization -> reads 2pi for ANY size. Edge-cycles MUST come from the CARRIED pairing.")

exec(open("/tmp/hinge_data.py").read())
import collections
# the computed maximal core (the SPAN): J -> Flow, J -> Φ, with the type identification τ
J_roles={'F1':'Φ2','F2':'Φ1','F4':'Φ7','F6':'Φ4'}
tau={'exceeds-in-speed':'specifies','presupposes':'component-of','generates':'presupposes','disjoins':'descends-from'}
def pushout(A_roles,AR,B_roles,BR,J,tau):
    """M = (A ⊔ B)/(a ~ J(a)), types (TA ⊔ TB)/(t ~ tau(t)); relations = union, relabelled."""
    rep={}                                   # canonical representative of each identified role
    for a in A_roles: rep[('A',a)]=('J',a) if a in J else ('A',a)
    for b in B_roles:
        pre=[a for a,bb in J.items() if bb==b]
        rep[('B',b)]=('J',pre[0]) if pre else ('B',b)
    trep={}
    for t,_,_ in AR: trep[('A',t)]=('J',t) if t in tau else ('A',t)
    for t,_,_ in BR:
        pre=[s for s,tt in tau.items() if tt==t]
        trep[('B',t)]=('J',pre[0]) if pre else ('B',t)
    M=set(rep.values()); MT=set(trep.values())
    MR=set()
    for t,a,b in AR: MR.add((trep[('A',t)],rep[('A',a)],rep[('A',b)]))
    for t,a,b in BR: MR.add((trep[('B',t)],rep[('B',a)],rep[('B',b)]))
    inj_A={a:rep[('A',a)] for a in A_roles}; inj_B={b:rep[('B',b)] for b in B_roles}
    return M,MT,MR,inj_A,inj_B
M,MT,MR,iA,iB=pushout(F,FR,PHI,PR,J_roles,tau)
print("=== THE AMALGAM  M = Flow ⊔_J Φ  over the computed core ===")
print(f"  |Flow| = {len(F)}, |Φ| = {len(PHI)}, |J| = {len(J_roles)}  ->  |M| = {len(M)}  (= 14 + 9 − 4)")
print(f"  types: Flow {len({t for t,_,_ in FR})} + Φ {len({t for t,_,_ in PR})} − identified {len(tau)} = {len(MT)}")
print(f"  relations in M: {len(MR)}  (Flow {len(FR)} + Φ {len(PR)}, none lost, none fabricated; overlapping ones on J coincide)")
# both parents embed TOTALLY and INJECTIVELY, and every parent relation is preserved
def preserved(R,inj,trep_side):
    return all((trep_side(t),inj[a],inj[b]) in MR for t,a,b in R)
tA=lambda t: ('J',t) if t in tau else ('A',t)
tB=lambda t: (('J',[s for s,tt in tau.items() if tt==t][0]) if any(tt==t for tt in tau.values()) else ('B',t))
print(f"  Flow → M total: {len(iA)==14}, injective: {len(set(iA.values()))==14}, all 34 relations preserved: {preserved(FR,iA,tA)}")
print(f"  Φ    → M total: {len(iB)==9},  injective: {len(set(iB.values()))==9},  all 22 relations preserved: {preserved(PR,iB,tB)}")
shared=[m for m in M if m[0]=='J']; onlyA=[m for m in M if m[0]=='A']; onlyB=[m for m in M if m[0]=='B']
print(f"\n  M's population: {len(shared)} roles that are BOTH Flow and Φ  ·  {len(onlyA)} Flow-only  ·  {len(onlyB)} Φ-only")
print(f"    the four that are both: {[(a,J_roles[a]) for a in J_roles]}")
print(f"    Flow-only (would have been 'did not carry'; here they are M's own content): {sorted(m[1] for m in onlyA)}")
print(f"    Φ-only: {sorted(m[1] for m in onlyB)}")
# the two limits of the gradient
M0,_,_,_,_=pushout(F,FR,PHI,PR,{},{}); print(f"\n  J = ∅ (nothing identified): |M| = {len(M0)} — the disjoint union, 'Flow beside Φ'")
print(f"  J = core: |M| = {len(M)} — the amalgam. The midpoint's size measures how disparate the parents are: {len(M)-max(14,9)} roles beyond the larger parent.")

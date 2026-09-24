import itertools, collections, time
exec(open("/tmp/hinge_data.py").read())
def types_at(R):
    d=collections.defaultdict(set)
    for t,a,b in R: d[(a,b)].add(t)
    return d
def best_core(R_src,U_src,R_tgt,U_tgt,kmax,budget_s):
    Rs=list(R_src); TA=types_at(R_tgt); t0=time.time()
    best=(-1,None); seen=0
    def score(p):
        D=set(p); pairs=collections.defaultdict(list)
        for t,a,b in Rs:
            if a in D and b in D: pairs[t].append((a,b))
        cand={}
        for t,pr in pairs.items():
            c=None
            for a,b in pr:
                s=TA.get((p[a],p[b]),set()); c=s if c is None else c&s
                if not c: break
            if c: cand[t]=(c,len(pr))
        # max-weight injective assignment types->target types
        ts=list(cand); bestw=0; bestm={}
        def rec(i,used,w,m):
            nonlocal bestw,bestm
            if w+sum(cand[t][1] for t in ts[i:])<=bestw: return
            if i==len(ts):
                if w>bestw: bestw=w; bestm=dict(m)
                return
            t=ts[i]
            for tt in cand[t][0]:
                if tt not in used:
                    m[t]=tt; used.add(tt); rec(i+1,used,w+cand[t][1],m); used.discard(tt); del m[t]
            rec(i+1,used,w,m)
        rec(0,set(),0,{})
        return bestw,bestm
    for k in range(2,kmax+1):
        for D in itertools.combinations(U_src,k):
            for img in itertools.permutations(U_tgt,k):
                p=dict(zip(D,img)); seen+=1
                w,m=score(p)
                if w>best[0]: best=(w,(dict(p),m))
                if time.time()-t0>budget_s: return best,seen,k,True
    return best,seen,kmax,False
for label,(Rs,Us,Rt,Ut) in (("Flow → Φ",(FR,F,PR,PHI)),("Φ → Flow",(PR,PHI,FR,F))):
    best,seen,k,cut=best_core(Rs,Us,Rt,Ut,kmax=4,budget_s=50)
    w,(p,m)=best
    print(f"=== {label} · maximum carried core, injective on roles AND on types (exhaustive to k={k}{', budget cut' if cut else ''}; {seen} maps scored) ===")
    print(f"  most relations carried: {w}  of {len(Rs)}")
    print(f"  roles carried: {p}")
    print(f"  type-map: {m}")
    print(f"  the carried relations: {[(t,a,b) for t,a,b in Rs if a in p and b in p and t in m and (m[t],p[a],p[b]) in set(Rt)]}")

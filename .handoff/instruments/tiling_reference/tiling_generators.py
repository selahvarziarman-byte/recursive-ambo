"""THE TILING GATE — one cell, three worlds. {4,3} / {4,4} / {4,5}.

THE FIELD'S CONVENTION, ADOPTED: spherical as a STEREOGRAPHIC projection, euclidean
as the plane tiling, hyperbolic in the POINCARE DISK. One Schlafli symbol runs across
all three; all three models are CONFORMAL, so angles are true and geodesics are arcs.

THE ARGUMENT, needing no prose:
    the CELL never changes. only how many meet at a vertex: 3, 4, 5.
    three FLAT squares round a point leave a 90 deg GAP     -> it must close up
    four                              CLOSE EXACTLY         -> it stays flat
    five                              OVERLAP by 90 deg     -> it must ruffle open
  That mismatch IS the curvature -- and it is the engine's own angle-deficit
  instrument, the same three states already ruled for cone edges: DEFICIT/FLAT/EXCESS.

VERIFIED, not assumed:
  cosh(R) = cot(pi/p) cot(pi/q)   -- <1 spherical, =1 euclidean, >1 hyperbolic.
  (my first pass used cos(pi/p)/sin(pi/q), which made the squares too small and the
   corner came out 79.47 deg instead of 72 -- caught by measuring, not by looking.)
  Dedup must be TOLERANT: repeated circle-inversions drift, so exact rounding never
  matches and the walk unrolls into a TREE (1+4+12+36+... = 4373) instead of closing
  the cycles. Caught by noticing the tile count was exactly the tree count.
"""
from PIL import Image, ImageDraw, ImageFont
from collections import Counter
import math

W,H = 2520, 1712
PAPER=(233,226,207); PAPER2=(228,221,202); INK=(38,32,20)
CELL=(107,96,71); FAINT=(163,153,129); RULE=(203,194,172)
VERD=(47,107,107); SANG=(150,60,44); PLUM=(94,42,99)

F="/usr/share/fonts/truetype/dejavu/"
fo=lambda n,s: ImageFont.truetype(F+n,s)
word=lambda s: fo("DejaVuSerif.ttf",s); wordb=lambda s: fo("DejaVuSerif-Bold.ttf",s)
wordi=lambda s: fo("DejaVuSerif-Italic.ttf",s); mono=lambda s: fo("DejaVuSansMono.ttf",s)
monob=lambda s: fo("DejaVuSansMono-Bold.ttf",s)

img=Image.new("RGB",(W,H),PAPER); d=ImageDraw.Draw(img)
def mix(a,b,t): return tuple(int(a[i]+(b[i]-a[i])*t) for i in range(3))

def hatch_poly(dr,poly,ang,step,col,w=1):
    xs=[p[0] for p in poly]; ys=[p[1] for p in poly]
    x0,x1,y0,y1=min(xs),max(xs),min(ys),max(ys)
    ca,sa=math.cos(ang),math.sin(ang)
    diag=math.hypot(x1-x0,y1-y0); cx,cy=(x0+x1)/2,(y0+y1)/2
    def inside(x,y):
        c=False; n=len(poly); j=n-1
        for i in range(n):
            xi,yi=poly[i]; xj,yj=poly[j]
            if ((yi>y)!=(yj>y)) and (x<(xj-xi)*(y-yi)/((yj-yi) or 1e-9)+xi): c=not c
            j=i
        return c
    n=int(diag/max(2.0,step))+2
    for i in range(-n,n+1):
        s=i*max(2.0,step); run=None; M=int(diag/1.4)+2
        for k in range(M+1):
            u=(k/M*2-1)*diag*0.62
            X=cx+ca*u-sa*s; Y=cy+sa*u+ca*s
            if inside(X,Y):
                if run is None: run=(X,Y)
            else:
                if run is not None: dr.line([run[0],run[1],X,Y],fill=col,width=w); run=None
        if run is not None: dr.line([run[0],run[1],X,Y],fill=col,width=w)

# ============================================================ {4,3} SPHERICAL (cube)
S3=1/math.sqrt(3)
CV={}
for sx in(1,-1):
    for sy in(1,-1):
        for sz in(1,-1): CV[(sx,sy,sz)]=(sx*S3,sy*S3,sz*S3)
CF=[[( 1, 1, 1),(-1, 1, 1),(-1,-1, 1),( 1,-1, 1)],   # +z: contains the pole -> the EXTERIOR
    [( 1, 1,-1),( 1,-1,-1),(-1,-1,-1),(-1, 1,-1)],
    [( 1, 1, 1),( 1,-1, 1),( 1,-1,-1),( 1, 1,-1)],
    [(-1, 1, 1),(-1, 1,-1),(-1,-1,-1),(-1,-1, 1)],
    [( 1, 1, 1),( 1, 1,-1),(-1, 1,-1),(-1, 1, 1)],
    [( 1,-1, 1),(-1,-1, 1),(-1,-1,-1),( 1,-1,-1)]]
def n3(v):
    m=math.sqrt(sum(c*c for c in v)) or 1e-9; return (v[0]/m,v[1]/m,v[2]/m)
def slerp3(a,b,t): return n3(tuple(a[i]+(b[i]-a[i])*t for i in range(3)))
def stereo(p):
    den=1.0-p[2]
    return None if den<1e-6 else (p[0]/den, p[1]/den)
def tiling_spherical():
    """returns (arc_points, true_corner_points) per cell; the +z cell is the exterior."""
    out=[]
    for f in CF:
        vs=[CV[k] for k in f]; arc=[]; ok=True
        for i in range(4):
            a,b=vs[i],vs[(i+1)%4]
            for t in range(20):
                q=stereo(slerp3(a,b,t/20))
                if q is None: ok=False; break
                arc.append(q)
            if not ok: break
        if ok:
            corners=[stereo(v) for v in vs]
            if all(c is not None for c in corners): out.append((arc,corners))
    return out

# ============================================================ {4,5} HYPERBOLIC (Poincare)
P,Q = 4,5
COSH_R = 1.0/(math.tan(math.pi/P)*math.tan(math.pi/Q))   # cot(pi/p)cot(pi/q)
R_HYP  = math.acosh(COSH_R)
R_EUC  = math.tanh(R_HYP/2.0)

def ortho_circle(v1,v2):
    a1,b1=2*v1[0],2*v1[1]; c1=v1[0]**2+v1[1]**2+1
    a2,b2=2*v2[0],2*v2[1]; c2=v2[0]**2+v2[1]**2+1
    det=a1*b2-a2*b1
    if abs(det)<1e-12: return None
    Cx=(c1*b2-c2*b1)/det; Cy=(a1*c2-a2*c1)/det
    r2=Cx*Cx+Cy*Cy-1.0
    return None if r2<=1e-12 else (Cx,Cy,math.sqrt(r2))
def invert(p,c):
    Cx,Cy,rho=c; dx,dy=p[0]-Cx,p[1]-Cy; dd=dx*dx+dy*dy
    if dd<1e-15: return p
    k=rho*rho/dd; return (Cx+dx*k,Cy+dy*k)
def reflect_across(poly,i):
    v1,v2=poly[i],poly[(i+1)%len(poly)]; c=ortho_circle(v1,v2)
    if c is None:
        ax,ay=v2[0]-v1[0],v2[1]-v1[1]; L=math.hypot(ax,ay) or 1e-9; ax,ay=ax/L,ay/L
        out=[]
        for (px,py) in poly:
            wx,wy=px-v1[0],py-v1[1]; dot=wx*ax+wy*ay
            out.append((v1[0]+2*dot*ax-wx, v1[1]+2*dot*ay-wy))
        return out
    return [invert(p,c) for p in poly]
class _Hash:
    def __init__(s): s.g={}
    def seen(s,cx,cy):
        tol=max(2e-4,0.06*(1-(cx*cx+cy*cy))); step=0.05
        i,j=int(math.floor(cx/step)),int(math.floor(cy/step))
        for di in(-1,0,1):
            for dj in(-1,0,1):
                for (ox,oy) in s.g.get((i+di,j+dj),()):
                    if math.hypot(ox-cx,oy-cy)<tol: return True
        s.g.setdefault((i,j),[]).append((cx,cy)); return False
def tiling_hyperbolic(depth=6,min_edge=0.010):
    base=[(R_EUC*math.cos(math.pi/2*k+math.pi/4),R_EUC*math.sin(math.pi/2*k+math.pi/4))
          for k in range(4)]
    h=_Hash(); out=[base]; h.seen(sum(p[0] for p in base)/4,sum(p[1] for p in base)/4)
    frontier=[base]
    for _ in range(depth):
        nxt=[]
        for poly in frontier:
            for i in range(4):
                np_=reflect_across(poly,i)
                if any(p[0]**2+p[1]**2>0.998 for p in np_): continue
                per=sum(math.hypot(np_[j][0]-np_[(j+1)%4][0],np_[j][1]-np_[(j+1)%4][1]) for j in range(4))
                if per<min_edge: continue          # LOD: the mark STOPS, never degrades
                cx=sum(p[0] for p in np_)/4; cy=sum(p[1] for p in np_)/4
                if h.seen(cx,cy): continue
                out.append(np_); nxt.append(np_)
        frontier=nxt
        if not frontier: break
    return out
def geo_arc(v1,v2,n=16):
    c=ortho_circle(v1,v2)
    if c is None: return [v1,v2]
    Cx,Cy,rho=c
    a1=math.atan2(v1[1]-Cy,v1[0]-Cx); a2=math.atan2(v2[1]-Cy,v2[0]-Cx)
    da=(a2-a1+math.pi)%(2*math.pi)-math.pi
    return [(Cx+rho*math.cos(a1+da*t/n),Cy+rho*math.sin(a1+da*t/n)) for t in range(n+1)]

# ============================================================ verify before drawing
HYP=tiling_hyperbolic()
print(f"{{4,5}} cosh R={COSH_R:.5f}  R={R_HYP:.5f}  r_euc={R_EUC:.5f}  tiles={len(HYP)}")
vs=[p for poly in HYP for p in poly]; vs.sort(); used=[False]*len(vs); cnt=[]
for i,p in enumerate(vs):
    if used[i]: continue
    tol=max(3e-4,0.05*(1-(p[0]**2+p[1]**2))); n=1; used[i]=True
    for j in range(i+1,len(vs)):
        if used[j]: continue
        if vs[j][0]-p[0]>tol: break
        if abs(vs[j][1]-p[1])<=tol: used[j]=True; n+=1
    cnt.append((math.hypot(*p),n))
deep=[n for r,n in cnt if r<0.86]
print(f"{{4,5}} interior vertex valences: {Counter(deep).most_common()}   (want ONLY 5)")
assert set(deep)=={5}, f"TILING WRONG: {Counter(deep)}"
def corner_angle():
    b=[(R_EUC*math.cos(math.pi/2*k+math.pi/4),R_EUC*math.sin(math.pi/2*k+math.pi/4)) for k in range(4)]
    def tang(v,o):
        c=ortho_circle(v,o)
        if c is None:
            dx,dy=o[0]-v[0],o[1]-v[1]; L=math.hypot(dx,dy); return (dx/L,dy/L)
        Cx,Cy,rho=c; rx,ry=v[0]-Cx,v[1]-Cy
        for t in ((-ry,rx),(ry,-rx)):
            if t[0]*(o[0]-v[0])+t[1]*(o[1]-v[1])>0: return (t[0]/rho,t[1]/rho)
        return (-ry/rho,rx/rho)
    ta,tb=tang(b[0],b[3]),tang(b[0],b[1])
    return math.degrees(math.acos(max(-1,min(1,(ta[0]*tb[0]+ta[1]*tb[1])/(math.hypot(*ta)*math.hypot(*tb))))))
CA=corner_angle(); print(f"{{4,5}} corner angle = {CA:.3f} deg (want {360/Q:.0f})")
assert abs(CA-360/Q)<0.01

# ============================================================ panels
PWID,PHT = 776, 872
PY = 250; GAP = 28
PX0 = (W-(3*PWID+2*GAP))//2
HEAD = 66

def render(kind):
    pan=Image.new("RGB",(PWID,PHT),PAPER2); dr=ImageDraw.Draw(pan)
    cx,cy = PWID/2, HEAD+(PHT-HEAD)/2
    S = min(PWID,PHT-HEAD)*0.435
    cells=[]      # (screen arc points, true corner points in screen coords)

    if kind=='hyp':
        for a in range(0,360,4):     # the circle at INFINITY: addressed, not drawn as solid
            a0,a1=math.radians(a),math.radians(a+2.4)
            dr.line([cx+S*math.cos(a0),cy+S*math.sin(a0),cx+S*math.cos(a1),cy+S*math.sin(a1)],
                    fill=mix(PAPER2,CELL,0.55),width=2)
        for poly in HYP:
            pts=[]
            for i in range(4):
                for q in geo_arc(poly[i],poly[(i+1)%4],14): pts.append((cx+S*q[0],cy+S*q[1]))
            per=sum(math.hypot(pts[j][0]-pts[j-1][0],pts[j][1]-pts[j-1][1]) for j in range(1,len(pts)))
            if per<9: continue
            cells.append((pts,[(cx+S*v[0],cy+S*v[1]) for v in poly],per))
        markv=(cx+S*HYP[0][0][0], cy+S*HYP[0][0][1])
    elif kind=='euc':
        u=S/4.6
        for i in range(-6,6):
            for j in range(-6,6):
                cor=[(cx+u*i,cy+u*j),(cx+u*(i+1),cy+u*j),(cx+u*(i+1),cy+u*(j+1)),(cx+u*i,cy+u*(j+1))]
                if all(abs(p[0]-cx)>S*1.02 or abs(p[1]-cy)>S*1.02 for p in cor): continue
                cells.append((cor,cor,4*u))
        markv=(cx,cy)
    else:
        polys=tiling_spherical()
        rad=max(math.hypot(*q) for arc,_ in polys for q in arc)
        u=S/rad*0.97
        for arc,cor in polys:
            cells.append(([(cx+u*q[0],cy+u*q[1]) for q in arc],
                          [(cx+u*q[0],cy+u*q[1]) for q in cor], 4*u))
        markv=cells[1][1][0]

    # --- every cell, light
    for idx,(pts,cor,per) in enumerate(cells):
        if kind=='sph' and idx==0: continue        # the +z cell: it IS the rim, drawn below
        dr.line(pts+[pts[0]],fill=mix(PAPER2,INK,0.92 if per>60 else 0.66),
                width=2 if per>150 else 1,joint="curve")
    # --- THE CELLS AT THE MARKED VERTEX, emphasised so the count is invited
    inc=[]
    for pts,cor,per in cells:
        tol=max(6.0,per*0.10)
        if any(math.hypot(v[0]-markv[0],v[1]-markv[1])<tol for v in cor): inc.append((pts,per))
    for pts,per in inc:
        hatch_poly(dr,pts,math.radians(-58),10,mix(PAPER2,VERD,0.30),1)
        dr.line(pts+[pts[0]],fill=INK,width=4,joint="curve")
    # --- the SIXTH cell of the cube: it IS the whole exterior. give the claim its mark.
    #     drawn LAST: the emphasised cells share these edges and would overdraw it.
    if kind=='sph':
        rim=cells[0][0]
        dr.line(rim+[rim[0]],fill=PLUM,width=5,joint="curve")
    dr.ellipse([markv[0]-17,markv[1]-17,markv[0]+17,markv[1]+17],outline=VERD,width=5)
    dr.ellipse([markv[0]-5,markv[1]-5,markv[0]+5,markv[1]+5],fill=VERD)
    return pan, len(inc)

# ============================================================ the fan: q FLAT squares at a point
def draw_fan(cxx,cyy,s,q):
    """take the FLAT square you already know and set q of them round one point.
       the q-th is drawn where it FALLS -- short of the circle, on it, or lapping the first."""
    col = VERD if q*90<360 else (SANG if q*90>360 else INK)
    for k in range(q):
        a=math.radians(-90+k*90)
        lap = (k*90+90 > 360)
        ink = SANG if lap else INK
        off = 0.055*s if lap else 0.0          # lift the lapping cell so the overlap SHOWS
        ca,sa=math.cos(a),math.sin(a)
        pts=[]
        for (ux,uy) in ((0,0),(1,0),(1,1),(0,1)):
            X,Y=ux*s,uy*s
            pts.append((cxx+X*ca-Y*sa+off, cyy+X*sa+Y*ca-off))
        if lap:
            d.polygon(pts,fill=mix(PAPER2,SANG,0.22))
            hatch_poly(d,pts,math.radians(34),8,mix(PAPER2,SANG,0.55),1)
        else:
            hatch_poly(d,pts,math.radians(-58),9,mix(PAPER2,INK,0.20),1)
        d.line(pts+[pts[0]],fill=ink,width=4 if lap else 2)
    if q*90<360:                                # the GAP: draw the empty wedge
        a0,a1=math.radians(-90+q*90),math.radians(270)
        wedge=[(cxx,cyy)]+[ (cxx+s*0.97*math.cos(a0+(a1-a0)*t/20),
                             cyy+s*0.97*math.sin(a0+(a1-a0)*t/20)) for t in range(21)]
        d.polygon(wedge,fill=mix(PAPER2,VERD,0.20))
        d.line(wedge+[wedge[0]],fill=VERD,width=4)
    d.ellipse([cxx-7,cyy-7,cxx+7,cyy+7],fill=VERD)

KINDS=[('sph','SPHERICAL','{4,3}',3,'the cube — a FINITE world, six cells'),
       ('euc','EUCLIDEAN','{4,4}',4,'the square tiling — it just goes on'),
       ('hyp','HYPERBOLIC','{4,5}',5,'the order-5 square tiling, in the Poincare disk')]

for i,(kind,title,sym,q,sub) in enumerate(KINDS):
    px=PX0+i*(PWID+GAP)
    pan,ninc=render(kind)
    print(f"  {kind}: cells emphasised at the marked vertex = {ninc}  (want {q})")
    assert ninc==q, f"{kind}: {ninc} cells at the vertex, expected {q}"
    img.paste(pan,(px,PY))
    d.rounded_rectangle([px,PY,px+PWID,PY+PHT],8,outline=RULE)
    d.rectangle([px+1,PY+1,px+PWID-1,PY+HEAD],fill=mix(PAPER2,PAPER,0.55))
    d.line([px,PY+HEAD,px+PWID,PY+HEAD],fill=RULE,width=1)
    d.text((px+20,PY+9),title,font=wordb(29),fill=INK)
    d.text((px+20,PY+43),sub,font=wordi(15),fill=CELL)
    sw=d.textlength(sym,font=monob(34)); d.text((px+PWID-20-sw,PY+16),sym,font=monob(34),fill=VERD)
    note={'sph':"the PLUM rim is the sixth cell — it is everything outside. a finite world, drawn one cell inside-out",
          'euc':"the same cell for ever; no vertex anywhere differs from this one",
          'hyp':"the rim is INFINITY, not an edge — the cells never reach it"}[kind]
    d.text((px+20,PY+PHT-30),note,font=word(14),fill=mix(PAPER,INK,0.66))

# ============================================================ the strip
SY=PY+PHT+26; SH=372
d.rounded_rectangle([PX0,SY,PX0+3*PWID+2*GAP,SY+SH],8,fill=PAPER2,outline=RULE)
d.text((PX0+22,SY+14),"THE WHOLE DIFFERENCE, AT ONE VERTEX — take the flat square you already know, and set q of them round a point",
       font=wordb(24),fill=INK)
d.text((PX0+22,SY+48),"every cell stays FLAT — that is local flatness. they do not fit — that is global curvature. the surface bends to absorb exactly the mismatch.",
       font=word(16),fill=mix(PAPER2,INK,0.82))
for i,(kind,title,sym,q,sub) in enumerate(KINDS):
    bx=PX0+30+i*(PWID+GAP); by=SY+94
    draw_fan(bx+118, by+118, 104, q)
    tx=bx+252
    col = VERD if q*90<360 else (SANG if q*90>360 else INK)
    d.text((tx,by+6),f"{q} squares",font=wordb(27),fill=INK)
    d.text((tx,by+44),f"{q} x 90 = {q*90} deg",font=monob(21),fill=CELL)
    verdict=(f"a {360-q*90} deg GAP — it must close up" if q*90<360 else
             ("CLOSES EXACTLY — nothing to absorb" if q*90==360 else
              f"{q*90-360} deg OVERLAP — it must ruffle open"))
    d.text((tx,by+78),verdict,font=wordb(19),fill=col)
    d.text((tx,by+112),f"(p-2)(q-2) = {(4-2)*(q-2)}  {'<' if (q-2)*2<4 else ('=' if (q-2)*2==4 else '>')}  4",
           font=mono(17),fill=mix(PAPER2,INK,0.85))
    d.text((tx,by+142),f"so a cell's corner here is {360//q} deg",font=word(16),fill=mix(PAPER2,INK,0.85))
    d.text((tx,by+172),f"cosh R = cot(pi/4)cot(pi/{q})  {'<' if q<4 else ('=' if q==4 else '>')} 1",
           font=mono(15),fill=mix(PAPER2,CELL,0.95))

# ============================================================ header / footer
d.text((60,44),"ONE CELL, THREE WORLDS — {4,3} · {4,4} · {4,5}",font=wordb(46),fill=INK)
d.text((60,106),"the cell never changes. only how many meet at a vertex: 3, 4, 5. the ringed vertex is inked heavy — count them.",
       font=word(23),fill=VERD)
d.text((60,146),"designer seat · the field's convention adopted — spherical as a stereographic projection, euclidean in the plane, hyperbolic in the Poincare disk · one Schlafli symbol across all three",
       font=wordi(16),fill=CELL)
d.line([60,192,W-60,192],fill=RULE,width=2)
d.text((60,H-44),"the one law — beauty is the revelation of true structure. the structure is the vertex; every other difference is a consequence of it.",
       font=wordi(17),fill=CELL)
d.text((W-450,H-30),"designer seat · computed and checked, not imagined",font=mono(13),fill=FAINT)

out="/sessions/inspiring-hopeful-brown/mnt/PlatonicEngine202/.handoff/assets/THE_TILING_GATE_DESIGNER.png"
img.save(out); print("saved",out,img.size)

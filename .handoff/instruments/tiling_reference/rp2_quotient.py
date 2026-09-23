"""RP2 UNDER THE TILING STANDARD — it is {4,3}/2, the HEMICUBE.

THE FINDING, computed not assumed:
  RP2 is NOT a fourth geometry. It is the SPHERICAL panel with an identification
  laid on it. The antipodal map is a symmetry of the cube tiling (checked), so the
  tiling descends:   cube 8,12,6 chi=2   ->   hemicube 4,6,3 chi=1.
  THE VERTEX IS UNTOUCHED: still 3 squares, still 270 deg, still a 90 deg deficit.
  Locally indistinguishable from the sphere; globally not. That is the gate's own
  local/global distinction, now TOPOLOGICAL instead of metric.

  total deficit = 2 pi chi, both sides:  cube 8x90 = 720 = 4pi (chi 2)
                                      hemicube 4x90 = 360 = 2pi (chi 1)

WHERE THE PAIRS LAND, in the stereographic picture (from the north pole):
  the antipodal map is  z -> -1/conj(z)  : radius r -> 1/r, angle th -> th+pi.
  so   -z centre (0,0)  <->  +z  (the whole EXTERIOR)
       +x (1,0) <-> -x (-1,0)          +y (0,1) <-> -y (0,-1)
  and the UNIT CIRCLE is the EQUATOR, fixed as a set, each point sent straight across.
  => the southern hemisphere is a fundamental DISK whose rim is glued antipodally.
  The classic "disk with antipodal boundary" picture ARISES here. It is not imported.
"""
from PIL import Image, ImageDraw, ImageFont
import math

W,H = 2460, 1330
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

# ============================================================ the cube, and the quotient
S3=1/math.sqrt(3)
CF=[[( 1, 1, 1),(-1, 1, 1),(-1,-1, 1),( 1,-1, 1)],   # 0  +z  -> the EXTERIOR
    [( 1, 1,-1),( 1,-1,-1),(-1,-1,-1),(-1, 1,-1)],   # 1  -z  -> the centre
    [( 1, 1, 1),( 1,-1, 1),( 1,-1,-1),( 1, 1,-1)],   # 2  +x  -> right
    [(-1, 1, 1),(-1, 1,-1),(-1,-1,-1),(-1,-1, 1)],   # 3  -x  -> left
    [( 1, 1, 1),( 1, 1,-1),(-1, 1,-1),(-1, 1, 1)],   # 4  +y  -> top
    [( 1,-1, 1),(-1,-1, 1),(-1,-1,-1),( 1,-1,-1)]]   # 5  -y  -> bottom
PAIRS=[(0,1,'a',VERD),(2,3,'b',SANG),(4,5,'c',PLUM)]
FUND=[1,2,4]                    # centre + right + top: 3 cells, one from each pair

V=set(); E=set()
for f in CF:
    for i in range(4): V.add(f[i]); E.add(frozenset((f[i],f[(i+1)%4])))
anti=lambda v:tuple(-c for c in v)
assert all(frozenset(map(anti,f)) in {frozenset(x) for x in CF} for f in CF), \
       "the antipodal map is NOT a symmetry -> the tiling would not descend"
qV={frozenset((v,anti(v))) for v in V}
qE={frozenset((e,frozenset(map(anti,e)))) for e in E}
CHI_S2 = len(V)-len(E)+len(CF); CHI_RP2 = len(qV)-len(qE)+3
assert (CHI_S2,CHI_RP2)==(2,1)
assert len(V)*90/180==2*CHI_S2 and len(qV)*90/180==2*CHI_RP2   # total deficit = 2 pi chi
print(f"cube      V,E,F = {len(V)},{len(E)},{len(CF)}  chi={CHI_S2}   deficit {len(V)*90} deg = {len(V)*90//180}pi = 2pi*chi")
print(f"hemicube  V,E,F = {len(qV)},{len(qE)},3  chi={CHI_RP2}   deficit {len(qV)*90} deg = {len(qV)*90//180}pi = 2pi*chi")

def n3(v):
    m=math.sqrt(sum(c*c for c in v)) or 1e-9; return (v[0]/m,v[1]/m,v[2]/m)
def slerp3(a,b,t): return n3(tuple(a[i]+(b[i]-a[i])*t for i in range(3)))
def stereo(p):
    den=1.0-p[2]
    return None if den<1e-6 else (p[0]/den,p[1]/den)
def cell_arcs():
    out={}
    for idx,f in enumerate(CF):
        vs=[n3(v) for v in f]; arc=[]; ok=True
        for i in range(4):
            for t in range(20):
                q=stereo(slerp3(vs[i],vs[(i+1)%4],t/20))
                if q is None: ok=False; break
                arc.append(q)
            if not ok: break
        if ok: out[idx]=arc
    return out
ARCS=cell_arcs()
RAD=max(math.hypot(*q) for a in ARCS.values() for q in a)
print(f"projected extent = {RAD:.3f}   (the equator sits at radius 1.0)")

# ============================================================ panels
def draw_cover(px,py,pw,ph,mode):
    """mode 'pairs'  -> all six cells, the three antipodal pairs in three registers
       mode 'fund'   -> the three cells of a fundamental domain solid, the rest recessed"""
    pan=Image.new("RGB",(pw,ph),PAPER2); dr=ImageDraw.Draw(pan)
    HD=58; cx,cy=pw/2, HD+(ph-HD)/2
    S=min(pw,ph-HD)*0.415; u=S/RAD*0.97
    scr=lambda q:(cx+u*q[0], cy+u*q[1])

    for a,b,letter,col in PAIRS:
        for idx in (a,b):
            pts=[scr(q) for q in ARCS[idx]]
            solid = (mode=='pairs') or (idx in FUND)
            hatch_poly(dr,pts,math.radians(-58 if solid else 34),
                       9 if solid else 15, mix(PAPER2,col,0.34 if solid else 0.12),1)
    for a,b,letter,col in PAIRS:
        for idx in (a,b):
            if idx==0: continue                    # the exterior cell: its rim is drawn last
            pts=[scr(q) for q in ARCS[idx]]
            solid=(mode=='pairs') or (idx in FUND)
            dr.line(pts+[pts[0]],fill=col if solid else mix(PAPER2,col,0.45),
                    width=4 if solid else 2,joint="curve")
    # the EQUATOR: the unit circle. inside it is a fundamental DISK.
    er=u*1.0
    for ang in range(0,360,3):
        a0,a1=math.radians(ang),math.radians(ang+1.7)
        dr.line([cx+er*math.cos(a0),cy+er*math.sin(a0),cx+er*math.cos(a1),cy+er*math.sin(a1)],
                fill=INK,width=3)
    # the identification, in the field's own device: matching letters, ARROWHEADS, straight across
    for k,(ang,lab) in enumerate(((28,'p'),(88,'q'),(148,'r'))):
        for s in (0,180):
            th=math.radians(ang+s)
            X,Y=cx+er*math.cos(th), cy+er*math.sin(th)
            tx,ty=-math.sin(th),math.cos(th)       # along the circle: the SENSE of the gluing
            dr.polygon([(X+tx*17,Y+ty*17),(X-ty*7-tx*4,Y+tx*7-ty*4),(X+ty*7-tx*4,Y-tx*7-ty*4)],
                       fill=INK)
            dr.ellipse([X-6,Y-6,X+6,Y+6],fill=PAPER2,outline=INK,width=3)
            lx,ly=X+22*math.cos(th),Y+22*math.sin(th)
            dr.text((lx-6,ly-11),lab,font=wordb(21),fill=INK)
    # the exterior cell's rim, last (the others share these edges and would overdraw it)
    pts=[scr(q) for q in ARCS[0]]
    solid=(mode=='pairs')
    dr.line(pts+[pts[0]],fill=VERD if solid else mix(PAPER2,VERD,0.45),
            width=5 if solid else 2,joint="curve")
    # cell letters
    for a,b,letter,col in PAIRS:
        for idx,anchor in ((a,None),(b,None)):
            if idx==0: continue
            qs=ARCS[idx]; mx=sum(q[0] for q in qs)/len(qs); my=sum(q[1] for q in qs)/len(qs)
            X,Y=scr((mx,my))
            on = (mode=='pairs') or (idx in FUND)
            dr.text((X-9,Y-18),letter,font=wordb(38),fill=col if on else mix(PAPER2,col,0.40))
    # the EXTERIOR cell's label. the rim bulges to 2.414 on the axes but only 1.932 on the
    # diagonals, so the only clear ground is a diagonal -- an axis placement lands INSIDE a cell.
    th=math.radians(135); rr=2.16
    X,Y=scr((rr*math.cos(th), rr*math.sin(th)))
    on=(mode=='pairs') or (0 in FUND)
    ink=VERD if on else mix(PAPER2,VERD,0.40)
    dr.text((X-11,Y-20),'a',font=wordb(38),fill=ink)
    dr.text((X-72,Y+22),"the whole outside",font=wordi(15),fill=ink)
    img.paste(pan,(px,py))
    return HD

# ---- left: the cover
LX,LY,LW,LH = 60, 236, 1096, 1010
draw_cover(LX,LY,LW,LH,'pairs')
d.rounded_rectangle([LX,LY,LX+LW,LY+LH],8,outline=RULE)
d.rectangle([LX+1,LY+1,LX+LW-1,LY+58],fill=mix(PAPER2,PAPER,0.55))
d.line([LX,LY+58,LX+LW,LY+58],fill=RULE,width=1)
d.text((LX+20,LY+12),"THE COVER — the cube {4,3} on the sphere, six cells, three antipodal PAIRS",
       font=wordb(25),fill=INK)
d.text((LX+20,LY+LH-58),"a is the CENTRE and the whole EXTERIOR — one cell of RP2, drawn twice. b is left with right. c is top with bottom.",
       font=word(16),fill=mix(PAPER,INK,0.78))
d.text((LX+20,LY+LH-32),"the heavy circle is the EQUATOR. every point on it is glued to the point straight across — p to p, q to q, r to r.",
       font=word(16),fill=mix(PAPER,INK,0.78))

# ---- right top: the fundamental domain
RX,RY,RW,RH = LX+LW+26, 236, 1218, 604
draw_cover(RX,RY,RW,RH,'fund')
d.rounded_rectangle([RX,RY,RX+RW,RY+RH],8,outline=RULE)
d.rectangle([RX+1,RY+1,RX+RW-1,RY+58],fill=mix(PAPER2,PAPER,0.55))
d.line([RX,RY+58,RX+RW,RY+58],fill=RULE,width=1)
d.text((RX+20,RY+12),"RP2 ITSELF — take ONE cell from each pair. three cells, and nothing is missing.",
       font=wordb(24),fill=INK)
d.text((RX+20,RY+RH-32),"the recessed cells are not other cells. they are these same three, seen a second time.",
       font=word(16),fill=mix(PAPER,INK,0.78))

# ---- right bottom: the census
CX2,CY2,CW,CH = RX, RY+RH+26, RW, 388
d.rounded_rectangle([CX2,CY2,CX2+CW,CY2+CH],8,fill=PAPER2,outline=RULE)
d.text((CX2+20,CY2+14),"WHAT ACTUALLY CHANGED — and what did not",font=wordb(24),fill=INK)
rows=[("",                       "SPHERE  {4,3}",  "RP2  {4,3}/2"),
      ("cells / edges / vertices","6  ·  12  ·  8", "3  ·  6  ·  4"),
      ("Euler characteristic",    "chi = 2",        "chi = 1"),
      ("squares at every vertex", "3",              "3"),
      ("their angles",            "270 deg",        "270 deg"),
      ("deficit at a vertex",     "90 deg",         "90 deg"),
      ("total deficit",           "720 deg = 4 pi", "360 deg = 2 pi"),
      ("= 2 pi chi ?",            "yes",            "yes")]
y=CY2+56
for i,(a,b,c) in enumerate(rows):
    same = (b==c)
    f1 = wordb(17) if i==0 else word(17)
    d.text((CX2+22,y),a,font=f1,fill=mix(PAPER2,INK,0.86))
    col = VERD if (same and i>0) else INK
    d.text((CX2+470,y),b,font=monob(17) if i==0 else mono(17),fill=col)
    d.text((CX2+800,y),c,font=monob(17) if i==0 else mono(17),fill=col)
    if i==0: d.line([CX2+22,y+26,CX2+CW-22,y+26],fill=RULE,width=1)
    y+= 38 if i==0 else 36
d.text((CX2+22,CY2+CH-56),"the vertex is UNTOUCHED. RP2 is not a fourth geometry —",font=wordb(19),fill=VERD)
d.text((CX2+22,CY2+CH-30),"it is the spherical picture with an identification laid on it.",font=wordb(19),fill=VERD)

# ---- header / footer
d.text((60,42),"RP2 UNDER THE STANDARD — it is {4,3}/2, the HEMICUBE",font=wordb(44),fill=INK)
d.text((60,102),"not a fourth geometry. the same cell, the same three-at-a-vertex, the same 90 deg deficit — with the antipodal identification laid on top.",
       font=word(22),fill=VERD)
d.text((60,140),"designer seat · the antipodal map is a symmetry of the cube tiling, so the tiling DESCENDS · computed and asserted, not assumed",
       font=wordi(16),fill=CELL)
d.line([60,182,W-60,182],fill=RULE,width=2)
d.text((60,H-40),"the one law — beauty is the revelation of true structure. here the structure is that nothing local changed at all.",
       font=wordi(17),fill=CELL)
d.text((W-450,H-26),"designer seat · computed and checked, not imagined",font=mono(13),fill=FAINT)

out="/sessions/inspiring-hopeful-brown/mnt/PlatonicEngine202/.handoff/assets/THE_RP2_UNDER_THE_STANDARD_DESIGNER.png"
img.save(out); print("saved",out,img.size)

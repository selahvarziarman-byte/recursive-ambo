// ExploreWindow — THE GPU EXPLORE WINDOW (rung-1 RESET, engineer-chartered
// 2026-08-08; mothership 2020; ADR 0004 Amdt 7 "the aperture is a PLACE, not
// a picture"). The CPU worker tracer is RETIRED — this component hosts the
// INSTRUMENT's WebGL2 fragment shader (.handoff/instruments/
// aperture_instrument.html), ported in technique verbatim:
//   · the TRANSPORT LOOP — exit the cell (|p|∞=1), sphere-march inside; on
//     miss TRANSPORT by the engine's gluing isometry (p←g·p, v←mat3(g)·v,
//     acc←mat3(g)·acc) up to uLevel. ⛔ never churn this math (ratified).
//   · THE VOID IS PAPER · depth by FADE exp(−echo/2.4) (paleness = weight).
//   · GEOMETRY-ANCHORED CONTOUR (fwd(n)=|dFdx(n)|+|dFdy(n)| + fwidth(dep))
//     — lines ride the geometry and do NOT crawl under motion.
//   · HATCH screen-space on the SETTLE dial (it crawls; that is why it
//     settles in only when the hand stops).
//   · CONE EDGES HEAVY — rod radius from the engine's k (k≠4 ⇒ thick) +
//     tone boost; rod colour from the engine's edge class.
//   · CHIRALITY BY THE LIGHT — mirrored = det(acc) < 0; a mirrored copy
//     SHOWS itself (a right-handed coil returns left-handed); NEVER inked.
//
// ⭐ THE INHABITANTS — ARMAN'S RULE: the a207c44 AUTHORED Janus plaque +
// right-handed coil, expressed as SDFs at their authored stations (the
// happy/sad one-arc mouths per side, the asymmetric eyes as real cut
// openings, stems + contact dashes at the common base). ⛔ The watermarked
// scans are never re-introduced.
//
// ★★ THE CARRIED FRAME (the instrument's hard-won lesson, ported whole):
// the observer carries camF/camR/camU and the space is allowed to TAKE the
// frame's handedness — every door transports the eye AND all three axes.
// Deriving forward from yaw/pitch would silently re-impose a right-handed
// frame each frame and deny the mirror. The RUNG-1 walk model retires with
// its CPU tracer.
//
// TWO GESTURES (the ratified rung-1 law): drag = look (rotate the carried
// frame) · press-and-hold = advance along forward. No strafe, no roll.

import { useEffect, useMemo, useRef } from 'react';
import type { Vec3 } from '../types/geometry';
import type { ApertureCellSurface } from './apertureModel';

interface ExploreSeam {
  open: string | null;
  title: string | null;
  gpu: boolean; // WebGL2 context up + program linked
  eye: Vec3 | null;
  forward: Vec3 | null;
  doors: number; // transports the WALK has taken
  frameHanded: number; // det of the carried frame (−1 after an odd mirror word)
  settle: number; // the live hatch settle value 0..1
  renderFrames: number;
  looks: number;
  advances: number;
  caption: string | null;
  rodK: number[] | null; // the engine's k per rod — declared cone edges draw HEAVY
  walls: number; // the room's boundary faces — the manifold's own edge (DOOR-FEED partial)
  // THE WINDING ROUTE (engineer 0930, designer W.1–W.6): the return line —
  // what just HAPPENED, beside the standing description. Persists; never
  // flashes. Null until the first position-return.
  returnLine: string | null;
  // W.7 (designer-ruled, mothership 2026-08-21): the PREVIOUS return, kept
  // beside the current one — the mark is the COMPARISON (`2 doors · turned`
  // means something only against `4 doors · the same way up`; without this
  // the display hands the comparison back to memory, one layer below where
  // W.3 caught it). Shifted on EVERY circuit close — the honest duplicate:
  // the same reading twice means he walked it twice, and a silent de-dup
  // would lie about what he did. Null until the second position-return.
  previousReturnLine: string | null;
  // the walk leg's THROTTLE (an ungated window seam, the committed
  // __manuscriptScene idiom): nothing in the app sets it — the headless
  // driver's pointer pulses have a ~2u floor at the default pace under the
  // software renderer, and the leg slows the walk to sample the return ball
  // the way a person's 60fps hand does for free. Null = the person's pace.
  paceOverride: number | null;
}

const seamOf = (): ExploreSeam => {
  const host = window as unknown as { __exploreWindow?: ExploreSeam };
  if (!host.__exploreWindow) {
    host.__exploreWindow = {
      open: null,
      title: null,
      gpu: false,
      eye: null,
      forward: null,
      doors: 0,
      frameHanded: 1,
      settle: 0,
      renderFrames: 0,
      looks: 0,
      advances: 0,
      caption: null,
      rodK: null,
      walls: 0,
      returnLine: null,
      previousReturnLine: null,
      paceOverride: null,
    };
  }
  return host.__exploreWindow;
};

const LOOK_SLOP_PX = 7;
const ADVANCE_HOLD_MS = 260;
// THE WINDING ROUTE — the position-return eye (Q1: POSITION, not the frame;
// the announcement fires when the person could not tell this view's PLACE
// from the entry's). The ball is sized to a hand's walk at the default pace
// (the cell spans [-1,1]³): fire inside 0.35 u of the entry point; re-arm
// only after walking OUT past 1.75× that (hysteresis — standing at the
// start never re-fires). ⚠ the number is the coder's grounded choice; the
// binding gate is Arman's own hand-walk (the mandate's Q1), not this text.
const RETURN_EPS = 0.35;
const RETURN_ARM = RETURN_EPS * 1.75;
// deck-frame identity test: the frame is transported by exact face
// isometries only (never the look gesture), so drift is numerical — a real
// turn moves the trace by ≥ 1 (a 90° class); 1e-3 is three orders inside.
const FRAME_EPS = 1e-3;

const VS = `#version 300 es
in vec2 p; void main(){ gl_Position=vec4(p,0.,1.); }`;

// the instrument's fragment shader, ported: the scene is the AUTHORED
// plaque + coil + stands + the 12 class-coloured rods
const FS = `#version 300 es
precision highp float;
out vec4 o;
uniform vec2  uRes;
uniform vec3  uEye, uFwd, uRight, uUp;
// ── THE CELL SURFACE (DOOR-FEED partial, 2026-08-13): the room's OWN
// fundamental cell — per-face outward plane (n·p = d), each face a PORTAL
// (its deck transform) or a WALL (the person's boundary: the manifold ends
// there — never an escape to the void). The cube degenerates exactly to the
// instrument's old 3-axis frame; the isometry application is untouched.
uniform int   uFaceCount;               // ≤ 16 (the multi-cell cut: a fan room carries 15 boundary walls)
uniform vec3  uFaceN[16];
uniform float uFaceD[16];
uniform float uFaceWall[16];            // 1 = wall
uniform mat4  uFaceG[16];               // portal transform (identity on walls)
uniform float uSpan;                    // the cell's max extent (cube: 2) — the horizon unit
// the seed's own edges as rods (≤ 32), each with its engine class
uniform int   uRodCount;
uniform vec3  uRodA[32];
uniform vec3  uRodB[32];
uniform float uRodK[32];
uniform float uRodClass[32];
uniform float uRodHeavy[32];            // 1 ⇔ the census DECLARED cone edges and this class is k≠4 — never fabricated
uniform int   uLevel;
uniform float uHatch;      // the SETTLE dial
// ── PART A (RUNG-1 legibility, 2026-08-11 seal): the designer's dials ──────
// DIAL-AXIS (2026-08-12): the LOD thresholds read the ECHO axis — the
// content horizon IS the echo fade exp(−echo/2.4), visually extinct by
// echo ≈ 6–7, so depth-unit gates were inert out there (the mis-spec).
uniform float uSmoothRecede; // smooth-rod (k=4) WEIGHT recede — the class COLOR survives
uniform float uDepthRatio;   // focal hierarchy: nearest:furthest contour ratio
uniform float uLodMid;       // LOD ladder ECHO thresholds — a mark STOPS below its resolving size:
uniform float uLodSmall;     //   beyond mid → hatch DROPS · beyond small → flat wash (the one mark)
uniform float uLodTiny;      //   beyond tiny → contour only; all sit below the ~echo-6 extinction

const vec3 PAPER = vec3(0.914,0.886,0.812);   // the page (#e9e2cf)
const vec3 INK   = vec3(0.165,0.145,0.110);   // the line (#2a251c)
vec3 classInk(float c){
  if(c<0.5) return vec3(0.133,0.157,0.235);
  if(c<1.5) return vec3(0.620,0.212,0.149);
  if(c<2.5) return vec3(0.173,0.369,0.306);
  if(c<3.5) return vec3(0.588,0.431,0.157);
  return vec3(0.376,0.275,0.470);
}
float sdCap(vec3 p, vec3 a, vec3 b, float r){
  vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
  return length(pa-ba*h)-r;
}
// the smooth-rod radius under the recede dial — LOG-SPACE interpolation
// (equal dial steps = equal RATIO steps; the linear mix crammed the visible
// thinning into the dial's top ~20% — the designer's finding); endpoints
// exact (0.016 → 0.007). Set ONCE per fragment in main.
float gSmoothR = 0.016;
// ── THE AUTHORED JANUS PLAQUE (a207c44), as an SDF ─────────────────────────
// a thin standing lens at the authored station; the features are REAL CUT
// openings: one round eye, one stroke eye (the asymmetry), and per side ONE
// MOUTH ARC whose curvature is the whole happy/sad difference (happy on the
// −y face, sad on the +y face — the same one-arc law as the mesh).
float sdPlaque(vec3 p){
  vec3 q = p - vec3(0.22, 0.0, 0.10);
  // the lens: a y-thin ellipsoid (approximate SDF, exact enough at scale)
  vec3 r = vec3(0.20, 0.055, 0.26);
  float lens = (length(q/r) - 1.0) * min(r.x, min(r.y, r.z));
  // the ROUND eye — a through tunnel
  float eyeR = length(vec2(q.x + 0.064, q.z - 0.078)) - 0.024;
  // the STROKE eye — a through slot
  vec2 sd2 = abs(vec2(q.x - 0.064, q.z - 0.078)) - vec2(0.037, 0.011);
  float slot = length(max(sd2, 0.0)) + min(max(sd2.x, sd2.y), 0.0);
  // the MOUTHS — one arc each, half-depth (per face): a band around a
  // circle in the x–z plane; HAPPY's circle sits ABOVE (the low arc smiles),
  // SAD's sits BELOW (the high arc frowns)
  float happyBand = abs(length(vec2(q.x, q.z - 0.052)) - 0.127) - 0.014;
  float happyCut = max(max(happyBand, q.z + 0.031), max(abs(q.x) - 0.078, q.y));       // y ≤ 0: the −y face
  float sadBand = abs(length(vec2(q.x, q.z + 0.195)) - 0.127) - 0.014;
  float sadCut = max(max(sadBand, -(q.z + 0.031)), max(abs(q.x) - 0.078, -q.y));       // y ≥ 0: the +y face
  float d = lens;
  d = max(d, -eyeR);
  d = max(d, -slot);
  d = max(d, -happyCut);
  d = max(d, -sadCut);
  return d;
}
// ── THE AUTHORED RIGHT-HANDED COIL (a207c44 station + proportions) ─────────
float sdCoil(vec3 p){
  vec3 c = vec3(0.34, -0.17, 0.0);
  float d = 1e9;
  const int N = 26;
  for(int i=0;i<N;i++){
    float t0=float(i)/float(N), t1=float(i+1)/float(N);
    float a0=6.28318*2.75*t0, a1=6.28318*2.75*t1;
    vec3 q0=vec3(c.x+0.07*cos(a0), c.y+0.07*sin(a0), mix(-0.20,0.07,t0));
    vec3 q1=vec3(c.x+0.07*cos(a1), c.y+0.07*sin(a1), mix(-0.20,0.07,t1));
    d=min(d, sdCap(p,q0,q1,0.020));
  }
  return d;
}
// the stands: stems + CONTACT DASHES at the common base (the ground is
// implied by the row, never drawn — no floor surface exists)
float sdStands(vec3 p){
  float d = sdCap(p, vec3(0.22,0.,-0.155), vec3(0.22,0.,-0.242), 0.008);
  d = min(d, sdCap(p, vec3(0.17,0.,-0.25), vec3(0.27,0.,-0.25), 0.007));
  d = min(d, sdCap(p, vec3(0.41,-0.17,-0.205), vec3(0.41,-0.17,-0.242), 0.008));
  d = min(d, sdCap(p, vec3(0.36,-0.17,-0.25), vec3(0.46,-0.17,-0.25), 0.007));
  return d;
}
// scene ids: 100 = plaque · 101 = coil · 102 = stands · 1..uRodCount = the
// rods (the seed's OWN edges) · 99 = a WALL 2-cell (set in the transport)
float map(vec3 p, out float id){
  float d=sdPlaque(p); id=100.;
  float dc=sdCoil(p); if(dc<d){ d=dc; id=101.; }
  float ds=sdStands(p); if(ds<d){ d=ds; id=102.; }
  for(int i=0;i<32;i++){
    if(i>=uRodCount) break;
    // a declared CONE edge is MUCH thicker — k is metric, and visible; a
    // smooth rod thins toward a guide as the recede dial rises (gSmoothR —
    // hoisted to ONE pow per fragment: a pow in this loop ran per rod per
    // march step, ~630M/frame, and blew the software rasterizer's windows).
    float r = (uRodHeavy[i]>0.5) ? 0.042 : gSmoothR;
    float dd=sdCap(p, uRodA[i], uRodB[i], r);
    if(dd<d){ d=dd; id=float(i+1); }
  }
  return d;
}
vec3 nrm(vec3 p){ float id; vec2 e=vec2(1e-3,0);
  return normalize(vec3(map(p+e.xyy,id)-map(p-e.xyy,id),
                        map(p+e.yxy,id)-map(p-e.yxy,id),
                        map(p+e.yyx,id)-map(p-e.yyx,id))); }
vec3 fwdD(vec3 n){ return abs(dFdx(n))+abs(dFdy(n)); }

void main(){
  gSmoothR = 0.016*pow(0.4375, uSmoothRecede);
  vec2 uv=(gl_FragCoord.xy - 0.5*uRes)/uRes.y;
  vec3 v=normalize(uFwd + uRight*uv.x*1.25 + uUp*uv.y*1.25);
  vec3 p=uEye;
  mat3 acc=mat3(1.0);              // the accumulated deck word — its det tells MIRRORED
  float travel=0., echo=0.;
  bool hit=false; vec3 nrmOut=vec3(0); float idOut=-1.; float dep=0.;

  for(int b=0;b<12;b++){
    if(b>uLevel) break;
    // the cell exit: the nearest of the room's OWN face planes (the cube
    // degenerates to the instrument's exact 3-axis test)
    float tE=1e9; int fE=0;
    for(int f=0;f<16;f++){
      if(f>=uFaceCount) break;
      float dn=dot(v,uFaceN[f]); if(dn<1e-6) continue;
      float t=(uFaceD[f]-dot(p,uFaceN[f]))/dn;
      if(t>1e-5 && t<tE){ tE=t; fE=f; }
    }
    float t=1e-3, id=-1.;
    for(int i=0;i<160;i++){
      if(t>tE) break;
      float d=map(p+v*t, id);
      if(d<8e-4){ hit=true; break; }
      t += max(d*0.9, 4e-4);
    }
    if(hit){ vec3 q=p+v*t; nrmOut=nrm(q); idOut=id; dep=travel+t; break; }
    if(uFaceWall[fE]>0.5){
      // ★ THE WALL — the person's boundary face IS a 2-cell: the room's
      // edge, drawn (the manifold ends here) — NEVER an escape to the void.
      hit=true; nrmOut=-uFaceN[fE]; idOut=99.; dep=travel+tE;
      break;
    }
    // TRANSPORT — the engine's own gluing isometry (ratified; never churned)
    travel += tE; echo += 1.;
    vec3 q=p+v*tE;
    mat4 g = uFaceG[fE];
    p = (g*vec4(q,1.)).xyz;
    v = normalize(mat3(g)*v);
    acc = mat3(g)*acc;
    p += v*2e-4;
  }

  if(!hit){ o=vec4(PAPER,1.); return; }                 // THE VOID IS PAPER

  float fade=exp(-echo/2.4);
  vec3 key=normalize(vec3(-0.45,-0.30,0.84));
  float lam=abs(dot(nrmOut,key));
  float tone=clamp(1.0-(0.12+0.88*lam),0.,1.);

  // THE FOCAL HIERARCHY (Part A, E6-recut): the depth weight rides the ECHO
  // axis — "the room you are in (echo 0) carries the frame" is
  // CONSTRUCTIONAL, never by luck of world-travel (a near recurrence-rib
  // used to outweigh the occupied room's far rib — the E6 defect). LOG-SPACE
  // (equal steps = ratio steps); endpoints exact: rank 0 → 1, the level
  // horizon → 1/uDepthRatio.
  float wDepth = pow(1.0/max(uDepthRatio,1.0), sqrt(clamp(echo/max(float(uLevel),1.0),0.,1.)));

  // PART A · THE SMOOTH-ROD RECEDE, GRADED ON RANK (E6): the base recede is
  // the dial (log-space, endpoints exact 1.0 → 0.35); wDepth FOLDS IN so the
  // occupied room's smooth rods stay present while distant recurrences
  // recede harder — one dial, rank-graded. Cone rods untouched. The heavy
  // flag is the census's own declaration (k≠4 under DECLARED cone edges).
  // THE WALL (id 99): a flat quiet plate — visibly a SURFACE (not the paper
  // void, not an object): fixed mid tone, no hatch, rim contours free from
  // the depth break at its edges.
  float weightScale = 1.0;
  bool isWall = (idOut==99.);
  bool isRod = (idOut>=0.5 && idOut<=32.5);
  vec3 base;
  if(isWall){ base=INK; tone=0.30; }
  else if(!isRod){ base=INK; }
  else { int ei=int(idOut)-1; base=classInk(uRodClass[ei]);
         if(uRodHeavy[ei]>0.5) tone=clamp(tone*1.35,0.,1.);            // DECLARED cone edges HEAVY
         else weightScale = pow(0.35, uSmoothRecede) * wDepth; }       // smooth rods QUIET, receding harder by rank
  // mirrored = det(acc) < 0 — a mirrored copy SHOWS itself; it is NEVER
  // ink-marked (chirality by the light: the coil reads left-handed)

  // CONTOUR — geometry-anchored (screen derivatives of n and depth): the
  // lines do NOT crawl when the camera moves. E6 · THE ONE-SIDED DEPTH
  // BREAK: fwidth(dep) is inherently two-sided — both fragments straddling
  // a break light up, so a rod BEHIND a body drew a false line AT the
  // body's silhouette. The quad-parity sign recovers neighbor−self per
  // axis; the line fires ONLY where the jump goes AWAY (this fragment is
  // the near/occluder side). The crease stays two-sided — it IS the
  // geometry silhouette.
  float crease = length(fwdD(nrmOut));
  float sqx = (mod(floor(gl_FragCoord.x), 2.0) < 0.5) ? 1.0 : -1.0;
  float sqy = (mod(floor(gl_FragCoord.y), 2.0) < 0.5) ? 1.0 : -1.0;
  float dbreak = max(sqx*dFdx(dep), 0.0) + max(sqy*dFdy(dep), 0.0);
  float line = clamp(max(crease*0.9, dbreak*9.0), 0., 1.);
  line = smoothstep(0.25, 0.75, line) * wDepth;

  // HATCH — screen-space, ~22% duty, gated by tone and the SETTLE dial
  // (a wall's fixed 0.30 tone sits under the gate: walls never hatch)
  float a1=0.593;
  float h = fract((gl_FragCoord.x*cos(a1) + gl_FragCoord.y*sin(a1))/6.0);
  float hatch = (tone>0.52 && h<0.22) ? 1.0 : 0.0;
  hatch *= fade*0.55*uHatch;

  // PART A · THE LOD LADDER: a mark STOPS below its resolving size — hard
  // steps, never a fade to mush (sub-resolution hatch is noise, a
  // fabrication under the one law): full → the hatch DROPS (mid) → flat
  // wash, the one distinguishing mark (small) → contour only (tiny).
  // DIAL-AXIS: the gates read ECHO (the fade's own axis — the content
  // horizon), not world travel; a rank is a transport count, and the
  // thresholds sit below the ~echo-6 extinction where dep-gates were inert.
  if(echo > uLodMid)   hatch = 0.0;
  if(echo > uLodSmall) tone  = 0.0;
  float body = clamp(0.26+0.55*tone,0.,1.)*fade;
  if(echo > uLodTiny)  body  = 0.0;

  body  *= weightScale;
  hatch *= weightScale;
  line  *= weightScale;
  vec3 col = mix(PAPER, base, body*0.85);
  col = mix(col, INK, max(hatch, line*0.92));
  o=vec4(col,1.);
}`;

// DeckTransform layout [r00..r22, tx,ty,tz] → column-major mat4 (the
// instrument's m4, verbatim)
const m4 = (g: number[]): Float32Array =>
  new Float32Array([g[0], g[3], g[6], 0, g[1], g[4], g[7], 0, g[2], g[5], g[8], 0, g[9], g[10], g[11], 1]);

const rot3 = (v: Vec3, ax: Vec3, th: number): Vec3 => {
  const c = Math.cos(th);
  const s = Math.sin(th);
  return [
    (c + ax[0] * ax[0] * (1 - c)) * v[0] + (ax[0] * ax[1] * (1 - c) - ax[2] * s) * v[1] + (ax[0] * ax[2] * (1 - c) + ax[1] * s) * v[2],
    (ax[1] * ax[0] * (1 - c) + ax[2] * s) * v[0] + (c + ax[1] * ax[1] * (1 - c)) * v[1] + (ax[1] * ax[2] * (1 - c) - ax[0] * s) * v[2],
    (ax[2] * ax[0] * (1 - c) - ax[1] * s) * v[0] + (ax[2] * ax[1] * (1 - c) + ax[0] * s) * v[1] + (c + ax[2] * ax[2] * (1 - c)) * v[2],
  ];
};
const nrm3 = (v: Vec3): Vec3 => {
  const L = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / L, v[1] / L, v[2] / L];
};
const applyM = (g: number[], p: Vec3): Vec3 => [
  g[0] * p[0] + g[1] * p[1] + g[2] * p[2] + g[9],
  g[3] * p[0] + g[4] * p[1] + g[5] * p[2] + g[10],
  g[6] * p[0] + g[7] * p[1] + g[8] * p[2] + g[11],
];
const applyRot = (g: number[], v: Vec3): Vec3 => [
  g[0] * v[0] + g[1] * v[1] + g[2] * v[2],
  g[3] * v[0] + g[4] * v[1] + g[5] * v[2],
  g[6] * v[0] + g[7] * v[1] + g[8] * v[2],
];
const det3of = (g: number[]): number =>
  g[0] * (g[4] * g[8] - g[5] * g[7]) - g[1] * (g[3] * g[8] - g[5] * g[6]) + g[2] * (g[3] * g[7] - g[4] * g[6]);

/** THE CELL PACK (DOOR-FEED partial): the room's own surface → the shader's
 * uniform arrays — per-face plane + wall flag + portal transform (exiting
 * face f applies uFaceG[f]; a wall face draws the 2-cell instead), and the
 * seed's edges as rods. The cube degenerates to the instrument's old frame. */
const IDENTITY_G: number[] = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
function packCell(surface: ApertureCellSurface): {
  faceN: Float32Array; faceD: Float32Array; faceWall: Float32Array; faceG: Float32Array; faceCount: number;
  rodA: Float32Array; rodB: Float32Array; rodK: Float32Array; rodClass: Float32Array; rodHeavy: Float32Array; rodCount: number;
  span: number;
} | null {
  if (surface.faces.length === 0 || surface.faces.length > 16 || surface.rods.length > 32) return null;
  const faceN = new Float32Array(48);
  const faceD = new Float32Array(16);
  const faceWall = new Float32Array(16);
  const faceG = new Float32Array(256);
  surface.faces.forEach((f, i) => {
    faceN.set(f.n, i * 3);
    faceD[i] = f.d;
    faceWall[i] = f.wall ? 1 : 0;
    faceG.set(m4(f.g ?? IDENTITY_G), i * 16);
  });
  const rodA = new Float32Array(96);
  const rodB = new Float32Array(96);
  const rodK = new Float32Array(32);
  const rodClass = new Float32Array(32);
  const rodHeavy = new Float32Array(32);
  surface.rods.forEach((r, i) => {
    rodA.set(r.a, i * 3);
    rodB.set(r.b, i * 3);
    rodK[i] = r.k;
    rodClass[i] = r.cls;
    rodHeavy[i] = r.heavy ? 1 : 0;
  });
  return {
    faceN, faceD, faceWall, faceG, faceCount: surface.faces.length,
    rodA, rodB, rodK, rodClass, rodHeavy, rodCount: surface.rods.length,
    span: surface.span,
  };
}

let nextSession = 1;

export interface ExploreWindowProps {
  openKey: string;
  title: string;
  cellSurface: ApertureCellSurface; // the room's own faces (portal/wall) + rods
  deckLine: string; // the caption's geometry line (the gate's own label words)
  level: number;
  pace: number; // advance, world units / s (the cell spans 2)
  lookSensitivity: number; // rad / px
  // PART A (2026-08-11 seal): the legibility dials — structure here, the
  // designer's eye gates the values. DIAL-AXIS (2026-08-12): the LOD dials
  // read ECHO (transport count — the fade's own axis), not world travel.
  smoothRodRecede: number; // 0..1 — smooth-rod (k=4) weight recede (log-space response)
  depthWeightRatio: number; // nearest:furthest contour ratio
  lodMidEcho: number; // beyond this echo: the hatch DROPS
  lodSmallEcho: number; // beyond: flat wash — the one mark
  lodTinyEcho: number; // beyond: contour only (below the ~echo-6 extinction)
  paper: { cardBackground: string; cardBorder: string; cardInk: string; background: string };
  accent: string;
  onClose: () => void;
}

export function ExploreWindow({
  openKey,
  title,
  cellSurface,
  deckLine,
  level,
  pace,
  lookSensitivity,
  smoothRodRecede,
  depthWeightRatio,
  lodMidEcho,
  lodSmallEcho,
  lodTinyEcho,
  paper,
  accent,
  onClose,
}: ExploreWindowProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);
  const returnRef = useRef<HTMLDivElement | null>(null);
  const prevReturnRef = useRef<HTMLDivElement | null>(null);
  const liveRef = useRef({ level, pace, lookSensitivity, smoothRodRecede, depthWeightRatio, lodMidEcho, lodSmallEcho, lodTinyEcho });
  liveRef.current = { level, pace, lookSensitivity, smoothRodRecede, depthWeightRatio, lodMidEcho, lodSmallEcho, lodTinyEcho };

  const packed = useMemo(() => packCell(cellSurface), [cellSurface]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const seam = seamOf();
    seam.open = openKey;
    seam.title = title;
    seam.gpu = false;
    seam.doors = 0;
    seam.frameHanded = 1;
    seam.renderFrames = 0;
    seam.looks = 0;
    seam.advances = 0;
    seam.rodK = cellSurface.rods.map((r) => r.k);
    seam.walls = cellSurface.wallCount;
    seam.returnLine = null;
    seam.previousReturnLine = null;
    seam.paceOverride = null;
    nextSession += 1;
    if (!canvas || !packed) return undefined;
    // alpha:false — the window is a SOLID PLATE by charter (the page never
    // shows through the backbuffer, even before the first frame)
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false });
    if (!gl) {
      seam.caption = 'WebGL2 unavailable — the walk needs the GPU (ADR 0004 Amdt 7)';
      if (captionRef.current) captionRef.current.textContent = seam.caption;
      return undefined;
    }
    const sh = (type: number, src: string): WebGLShader | null => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        // the compile log is a build-time truth — surface it, never swallow
        // eslint-disable-next-line no-console
        console.error('explore shader:', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const vs = sh(gl.VERTEX_SHADER, VS);
    const fs = sh(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return undefined;
    const pr = gl.createProgram();
    if (!pr) return undefined;
    gl.attachShader(pr, vs);
    gl.attachShader(pr, fs);
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
      // eslint-disable-next-line no-console
      console.error('explore program:', gl.getProgramInfoLog(pr));
      return undefined;
    }
    gl.useProgram(pr);
    seam.gpu = true;
    const vb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = (n: string): WebGLUniformLocation | null => gl.getUniformLocation(pr, n);
    gl.uniform1i(U('uFaceCount'), packed.faceCount);
    gl.uniform3fv(U('uFaceN[0]'), packed.faceN);
    gl.uniform1fv(U('uFaceD[0]'), packed.faceD);
    gl.uniform1fv(U('uFaceWall[0]'), packed.faceWall);
    gl.uniformMatrix4fv(U('uFaceG[0]'), false, packed.faceG);
    gl.uniform1f(U('uSpan'), packed.span);
    gl.uniform1i(U('uRodCount'), packed.rodCount);
    gl.uniform3fv(U('uRodA[0]'), packed.rodA);
    gl.uniform3fv(U('uRodB[0]'), packed.rodB);
    gl.uniform1fv(U('uRodK[0]'), packed.rodK);
    gl.uniform1fv(U('uRodClass[0]'), packed.rodClass);
    gl.uniform1fv(U('uRodHeavy[0]'), packed.rodHeavy);

    // ★★ THE CARRIED FRAME — the observer's handedness is the space's to take
    let eye: Vec3 = [-0.35, -0.55, 0.1];
    let camF: Vec3 = nrm3([Math.cos(1.2), Math.sin(1.2), 0]);
    let camR: Vec3 = nrm3([-Math.sin(1.2), Math.cos(1.2), 0]);
    let camU: Vec3 = [0, 0, 1];
    // THE WINDING ROUTE — THE DECK FRAME (engineer 0930, the one trap): a
    // frame rotated ONLY by the portal transports (`face.g`), NEVER by the
    // look gesture — so frame-equality ⟺ the walk's W = identity EXACTLY
    // (nothing else acts on it; no matrix is accumulated, no identity test
    // on a product). Initialised at entry to the standard basis; the entry
    // value IS that basis, so the return test reads the frame directly.
    let deckF: Vec3 = [1, 0, 0];
    let deckR: Vec3 = [0, 1, 0];
    let deckU: Vec3 = [0, 0, 1];
    // the entry POSITION + the return hysteresis: the announcement arms only
    // after the person walks OUT of the entry ball (else standing at the
    // start would fire it at once), and fires on each re-entry (position-
    // return ALONE — what the frame did is REPORTED, never a gate).
    const entryEye: Vec3 = [eye[0], eye[1], eye[2]];
    let awayFromEntry = false;
    let lastMove = performance.now();
    let raf = 0;
    let disposed = false;

    // the JS-side walk transport over the room's OWN faces: a portal applies
    // its deck transform (the same isometry law); a WALL stops the eye AT the
    // room's edge — the manifold ends there, the person never escapes
    const transportWalk = (): void => {
      for (let guard = 0; guard < 8; guard += 1) {
        let exited = -1;
        for (let f = 0; f < cellSurface.faces.length; f += 1) {
          const face = cellSurface.faces[f];
          const s = eye[0] * face.n[0] + eye[1] * face.n[1] + eye[2] * face.n[2] - face.d;
          if (s > 0) { exited = f; break; }
        }
        if (exited < 0) break;
        const face = cellSurface.faces[exited];
        if (face.wall || !face.g) {
          const s = eye[0] * face.n[0] + eye[1] * face.n[1] + eye[2] * face.n[2] - face.d;
          eye = [eye[0] - face.n[0] * (s + 1e-4), eye[1] - face.n[1] * (s + 1e-4), eye[2] - face.n[2] * (s + 1e-4)];
          continue;
        }
        eye = applyM(face.g, eye);
        camF = applyRot(face.g, camF);
        camR = applyRot(face.g, camR);
        camU = applyRot(face.g, camU);
        deckF = applyRot(face.g, deckF);
        deckR = applyRot(face.g, deckR);
        deckU = applyRot(face.g, deckU);
        seam.doors += 1;
        seam.frameHanded *= det3of(face.g) < 0 ? -1 : 1;
      }
    };

    // gestures — one press locks into look OR advance. Every decision reads
    // INPUT time (event timeStamps — the performance.now() domain), never
    // delivery time: under a starved main thread (software rendering,
    // seconds-per-frame RAF) pointermoves coalesce and can deliver AFTER the
    // discrete pointerup, and the hold timer races delivery. So: a move that
    // arrives in time settles the mode; a mis-fired advance is reclaimed when
    // the samples prove the finger beat the hold; and the UP is the gesture's
    // court of last resort — it carries the final position and true end time,
    // so an undelivered drag still turns (full-delta) and a held advance
    // still walks (input-clock integral) even if zero frames landed inside.
    let pressed = false;
    let mode: 'undecided' | 'look' | 'advance' = 'undecided';
    let sx = 0;
    let sy = 0;
    let lx = 0;
    let ly = 0;
    let downT = 0;
    let advClock = 0; // ms, event-timeStamp domain — the walk's integrator
    let holdTimer: number | null = null;
    let advancing = false;
    const turnBy = (dxPx: number, dyPx: number): void => {
      const s = liveRef.current.lookSensitivity;
      const dx = -dxPx * s;
      const dy = -dyPx * s;
      camF = nrm3(rot3(camF, camU, dx));
      camR = nrm3(rot3(camR, camU, dx));
      camF = nrm3(rot3(camF, camR, dy));
      camU = nrm3(rot3(camU, camR, dy));
      lastMove = performance.now();
    };
    const advanceBy = (ms: number): void => {
      const step = (seam.paceOverride ?? liveRef.current.pace) * Math.max(0, ms) / 1000;
      eye = [eye[0] + camF[0] * step, eye[1] + camF[1] * step, eye[2] + camF[2] * step];
      lastMove = performance.now();
    };
    const onDown = (ev: PointerEvent): void => {
      ev.preventDefault();
      try { canvas.setPointerCapture(ev.pointerId); } catch { /* no active pointer to capture (synthetic or already-lifted) — the gesture still runs */ }
      pressed = true;
      mode = 'undecided';
      sx = ev.clientX; sy = ev.clientY; lx = sx; ly = sy;
      downT = ev.timeStamp;
      holdTimer = window.setTimeout(() => {
        if (!pressed || mode !== 'undecided') return;
        mode = 'advance';
        advancing = true;
        seam.advances += 1;
        // the hold's input truth: the advance began one hold-window after
        // the press, even when this timer itself fired late
        advClock = downT + ADVANCE_HOLD_MS;
        lastMove = performance.now();
      }, ADVANCE_HOLD_MS);
    };
    const dragBeatTheHold = (ev: PointerEvent): boolean => {
      const samples = typeof ev.getCoalescedEvents === 'function' && ev.getCoalescedEvents().length > 0
        ? ev.getCoalescedEvents()
        : [ev];
      for (const s of samples) {
        if (Math.hypot(s.clientX - sx, s.clientY - sy) > LOOK_SLOP_PX) return s.timeStamp - downT < ADVANCE_HOLD_MS;
      }
      return false;
    };
    const onMove = (ev: PointerEvent): void => {
      if (!pressed) return;
      if (mode === 'undecided' && Math.hypot(ev.clientX - sx, ev.clientY - sy) > LOOK_SLOP_PX) {
        mode = 'look';
        seam.looks += 1;
        if (holdTimer !== null) window.clearTimeout(holdTimer);
        holdTimer = null;
      } else if (mode === 'advance' && dragBeatTheHold(ev)) {
        mode = 'look';
        advancing = false;
        seam.advances -= 1;
        seam.looks += 1;
      }
      if (mode === 'look') turnBy(ev.clientX - lx, ev.clientY - ly);
      lx = ev.clientX; ly = ev.clientY;
    };
    const onUp = (ev: PointerEvent): void => {
      if (pressed) {
        if (mode === 'undecided' && Math.hypot(ev.clientX - sx, ev.clientY - sy) > LOOK_SLOP_PX) {
          // the drag's moves never delivered (coalesced past the up) — the
          // up's own coordinates settle it: one full-delta turn
          seam.looks += 1;
          turnBy(ev.clientX - sx, ev.clientY - sy);
        } else if (mode === 'advance' && dragBeatTheHold(ev)) {
          seam.advances -= 1;
          seam.looks += 1;
          advancing = false;
          turnBy(ev.clientX - sx, ev.clientY - sy);
        } else if (mode === 'advance' && advancing) {
          // close the walk's integral at the up's true time and transport
          // NOW — a starved RAF may not tick for seconds
          advanceBy(ev.timeStamp - advClock);
          transportWalk();
        }
      }
      pressed = false;
      mode = 'undecided';
      advancing = false;
      if (holdTimer !== null) window.clearTimeout(holdTimer);
      holdTimer = null;
      try { canvas.releasePointerCapture(ev.pointerId); } catch { /* released */ }
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);

    const frame = (now: number): void => {
      if (disposed) return;
      // the walk integrates INPUT-CLOCK time (advClock, the event-timeStamp
      // domain), uncapped: under a starved RAF (software rendering, seconds
      // per frame) a per-frame capped dt froze the person mid-stride — a 6 s
      // hold measured 0.036 units. The transport while-loop absorbs
      // multi-door steps; the up handler closes the integral when no frame
      // lands inside the hold at all.
      if (advancing) {
        advanceBy(now - advClock);
        advClock = Math.max(advClock, now); // a RAF stamp may predate the timer's engage — never rewind the integrator
      }
      transportWalk();
      const still = (now - lastMove) / 1000;
      const settle = Math.max(0, Math.min(1, (still - 0.12) / 0.45));
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U('uRes'), canvas.width, canvas.height);
      gl.uniform3f(U('uEye'), eye[0], eye[1], eye[2]);
      gl.uniform3f(U('uFwd'), camF[0], camF[1], camF[2]);
      gl.uniform3f(U('uRight'), camR[0], camR[1], camR[2]);
      gl.uniform3f(U('uUp'), camU[0], camU[1], camU[2]);
      gl.uniform1i(U('uLevel'), Math.max(0, Math.round(liveRef.current.level)));
      gl.uniform1f(U('uHatch'), settle);
      gl.uniform1f(U('uSmoothRecede'), liveRef.current.smoothRodRecede);
      gl.uniform1f(U('uDepthRatio'), liveRef.current.depthWeightRatio);
      gl.uniform1f(U('uLodMid'), liveRef.current.lodMidEcho);
      gl.uniform1f(U('uLodSmall'), liveRef.current.lodSmallEcho);
      gl.uniform1f(U('uLodTiny'), liveRef.current.lodTinyEcho);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      seam.renderFrames += 1;
      seam.eye = [...eye] as Vec3;
      seam.forward = [...camF] as Vec3;
      seam.settle = settle;
      // the boundary is SPOKEN, fresh (never the winding-tag's wording): a
      // room with walls AND corridors says how its orbit still recurs; a
      // DECKLESS bounded chamber (the multi-cell fan) says nothing recurs
      const portalCount = cellSurface.faces.length - cellSurface.wallCount;
      const boundaryLine = cellSurface.wallCount > 0
        ? portalCount > 0
          ? ' · the manifold ends here; the orbit recurs only through the glued corridors'
          : ' · the manifold ends here — a bounded chamber; nothing recurs'
        : '';
      const caption = `${deckLine}${boundaryLine} · copies shown to depth ${Math.max(0, Math.round(liveRef.current.level))}`;
      if (seam.caption !== caption) {
        seam.caption = caption;
        if (captionRef.current) captionRef.current.textContent = caption;
      }
      // THE WINDING ROUTE — the position-return test (fires on POSITION
      // ALONE; hazard 1: never gated on W ≠ identity — the flat control's
      // four quarter-turns compose to the identity and MUST still announce).
      // The clause reads the DECK frame: `mirrored` on det −1 (frameHanded,
      // already the pure product of det signs); else `turned` iff the deck
      // frame moved (det +1 — a fold is never named a rotation); else the
      // same way up. Subject THE ROOM, never the person (LAW 20). The line
      // PERSISTS on its own surface line (W.4/Q2) and never resets (W.5).
      // ⛔ the three strings are the designer's ratified wording, verbatim;
      // the door count is a plain numeral (W.6 HELD — flagged, not styled).
      const dEntry = Math.hypot(eye[0] - entryEye[0], eye[1] - entryEye[1], eye[2] - entryEye[2]);
      if (!awayFromEntry && dEntry > RETURN_ARM) {
        awayFromEntry = true;
      } else if (awayFromEntry && dEntry <= RETURN_EPS) {
        awayFromEntry = false;
        const deckTrace = deckF[0] + deckR[1] + deckU[2];
        const clause =
          seam.frameHanded < 0
            ? 'the room came back mirrored'
            : deckTrace >= 3 - FRAME_EPS
              ? 'the room came back the same way up'
              : 'the room came back turned';
        // the ratified final strings: `1 door` singular, `N doors` otherwise
        // (`0 doors` stays plural) — W.7 recut; the three clauses verbatim.
        const returnLine = `back where you started · ${seam.doors === 1 ? '1 door' : `${seam.doors} doors`} · ${clause}`;
        // W.7 — the comparison is the mark: the line just standing shifts to
        // the PREVIOUS slot on EVERY circuit close, never gated on the string
        // having changed — an equal reading is a circuit he genuinely walked
        // twice, and a display that silently de-dups is a display lying about
        // what he did. Both lines persist (W.5); the new reading takes the
        // familiar current slot so the full-ink line is always the one he
        // just closed.
        if (seam.returnLine !== null) {
          seam.previousReturnLine = seam.returnLine;
          if (prevReturnRef.current) prevReturnRef.current.textContent = seam.previousReturnLine;
        }
        seam.returnLine = returnLine;
        if (returnRef.current) returnRef.current.textContent = returnLine;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
      const closing = seamOf();
      closing.open = null;
      closing.title = null;
      closing.gpu = false;
    };
    // one GL session per opened room
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openKey, packed, cellSurface]);

  return (
    <div
      data-explore-window
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        left: '50%',
        top: 54,
        transform: 'translateX(-50%)',
        width: 'min(64vh, 700px)',
        padding: '10px 12px 8px',
        borderRadius: 3,
        background: paper.cardBackground,
        border: `1px solid ${paper.cardBorder}`,
        boxShadow: '0 3px 14px rgba(58, 51, 38, 0.28)',
        color: paper.cardInk,
        fontFamily: 'Georgia, "Times New Roman", serif',
        zIndex: 60,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div>
          <span style={{ fontSize: 11, letterSpacing: 1.2, opacity: 0.6, fontVariant: 'small-caps' }}>inside — </span>
          <span style={{ fontSize: 14.5, fontWeight: 700 }}>{title}</span>
        </div>
        <button
          type="button"
          aria-label="close — return to the shell"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onClose}
          style={{
            border: `1px solid ${paper.cardBorder}`,
            borderRadius: 3,
            background: 'transparent',
            color: accent,
            cursor: 'pointer',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 12,
            padding: '2px 8px',
          }}
        >
          close — return to the shell
        </button>
      </div>
      <canvas
        ref={canvasRef}
        data-explore-canvas
        style={{
          display: 'block',
          width: '100%',
          aspectRatio: '1 / 1',
          background: paper.background,
          cursor: 'crosshair',
          touchAction: 'none',
        }}
      />
      <div
        ref={captionRef}
        data-explore-caption
        style={{ marginTop: 6, fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: 0.78, minHeight: 15 }}
      />
      {/* THE WINDING ROUTE (Q2): the return line — same surface, same ink,
          its OWN line. The caption above says what the room IS; this line
          says what just HAPPENED. It appears on the first position-return
          and PERSISTS (a transient line would be timed to arrive while the
          person is looking at the room, not the caption). Empty until then
          (minHeight holds the slot so the plate never jumps). */}
      <div
        ref={returnRef}
        data-explore-return
        style={{ marginTop: 2, fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: 0.78, minHeight: 15 }}
      />
      {/* W.7 — the previous return, kept beside the current one: the mark is
          the COMPARISON. RECESSED register, same ink family — the full-ink
          line above, in the slot returns have always used, is the one he
          just closed; this fainter echo is the circuit before it. Its own
          held slot (the plate never jumps; two lines is the named cost);
          empty until the second circuit. The honest duplicate arrives from
          upstream unfiltered. */}
      <div
        ref={prevReturnRef}
        data-explore-return-previous
        style={{ marginTop: 1, fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: 0.45, minHeight: 15 }}
      />
      <div style={{ marginTop: 3, fontSize: 10.5, opacity: 0.55 }}>
        drag — look around · press and hold — walk forward · the hatch settles in when you stand still · esc returns to the shell
      </div>
    </div>
  );
}

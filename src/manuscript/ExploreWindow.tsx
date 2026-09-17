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
import { type ApertureCellSurface, scaleToRoom } from './apertureModel';
// B-114 — the orientation of a projective door is its 4×4 determinant
import { mat4Det } from '../lib/noncubeDomain';
// K-1e — the walk's own metric: transport along a leg, carriage through a door,
// the true distance, the frame angle. One producer, run by the witness too.
import {
  affinePoint,
  affineVector,
  expMap,
  frameAngleDeg,
  frameAt,
  modelIP,
  modelOrthonormalise,
  perpendicularToward,
  projectiveDirection,
  projectivePoint,
  transportAlong,
  walkDistance,
} from './walkMetric';
import {
  LONGEST_CANCEL_SENTENCE,
  TRACE_WINDOW,
  cancelSentence,
  doorLetter,
  elisionMark,
  faceForLetter,
  letterForKey,
  walkKeyAct,
  windowTrace,
} from './orderTrace';
import type { WalkAct } from './orderTrace';

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
  // M-1 part B (her ruling, from the sentence's own grammar): the RETURN
  // ORDINAL — `return 3 · after 21 doors` — the count of circuit closes this
  // session. It makes the two-slot log's truncation HONEST (a person seeing
  // `return 7` and `return 8` knows six are gone) and it is why the log may
  // SHORTEN under the bound instead of scrolling.
  returnCount: number;
  // B-2 item 0 (the designer's sighting: she walked 4 then 3; the panel said
  // 4 then 7): `after K doors` is PER-CIRCUIT — doors since the PREVIOUS
  // return, never since window-open. This is the door count at the last
  // return; K = doors − doorsAtLastReturn. Completes M-1c's one-subject cure.
  doorsAtLastReturn: number;
  // B-2 THE ORDER-READING SURFACE (the designer's 1726/1752 rulings): the
  // TRACE — the room's door letters written at each crossing, capitals for
  // inverses (the gluing-word vocabulary he has already read), RATCHETING —
  // a back-crossing writes `A`, never deletes the `a`. The tally, the
  // sentence, and the way-back room-marks are all DERIVED from this one
  // string — one producer, several views, no second memory.
  trace: string;
  traceHidden: number; // B-3: letters older than the trace line's window — the elision's count
  // the way-back marks as uploaded (16 faces: 1 = the door just crossed's
  // way back, 0.5 = the one before, 0 = none) — a view of the trace
  faceMark: number[];
  // the sentence as printed (null = silent), for the seam's own witnesses
  sentence: string | null;
  // K-1e — THE LAST PRESS: the letter pressed (the ACT), the letters actually
  // crossed (the trace's own word for it), the true length of the period
  // d(p, g·p) (the currency, LAW 23) and the true length the integrator walked
  press: { letter: string; word: string; length: number; walked: number } | null;
  // K-1e addendum — the last return's frame holonomy in degrees (null when the
  // frame came back mirrored — a fold is never named a rotation)
  returnTurnDeg: number | null;
  // K-2c — the last snap taken ('faceDoor' | 'entryLook'), and the door it faced
  snap: { act: string; letter: string | null } | null;
  // the camera frame's other two axes (beside `forward`) and the room's faces
  // with their door letters — witness seams for a driver that must aim
  right: Vec3 | null;
  up: Vec3 | null;
  uniformProbe: ((name: string) => unknown) | null;
  faceMarkBuffer: Float32Array | null;
  faces: Array<{ n: Vec3; d: number; wall: boolean; door: { pair: number; side: 'a' | 'b' } | null }>;
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
      returnCount: 0,
      doorsAtLastReturn: 0,
      trace: '',
      traceHidden: 0,
      faceMark: new Array<number>(16).fill(0),
      sentence: null,
      press: null,
      returnTurnDeg: null,
      snap: null,
      right: null,
      up: null,
      faces: [],
      uniformProbe: null,
      faceMarkBuffer: null,
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
// K-2a — THE HELD TURN KEY'S RATE: a quarter turn per second of hold, stated
// once. The drag's angle is the person's pixels × lookSensitivity; a key has
// no pixels, so its angle is TIME × this rate — and both land in the one
// frame writer below, so a key and a drag write the same heading.
const KEY_TURN_RATE = Math.PI / 2;
// K-2c — THE TAP WINDOW: a walk or turn key released inside it is a TAP — ONE
// counted step of the stated unit, ONE counted fraction of a turn — and held
// past it is the glide or the sweep, unchanged. Stated once.
const TAP_MS = 200;

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
uniform float uFaceMark[16];            // B-2 way-back marks: 1 = the door just crossed (its way back), .5 = the one before
uniform mat4  uFaceG[16];               // portal transform (identity on walls)
// INTERIOR TRANSPORT (2026-08-21): a BOUNDED face is a real quad, not a
// whole plane — the developed cone room's seam planes cut through material
// far from the seam, so a plane-only exit would transport rays that never
// touched the seam. A bounded face is skipped where the crossing lands
// outside its quad (|dot(q−c,u)| ≤ ‖u‖², both axes); unbounded faces keep
// the convex-cell law byte-identically.
// ═══ B-114 — THE MODEL THE ROOM IS DRAWN IN ═════════════════════════════════
// 0 = E³ (affine doors; the committed arm, byte-untouched) · 1 = S³ · 2 = H³.
// ⛔ WHAT MAKES THIS FOUR LINES RATHER THAN A NEW TRACER: the exit test above
// is ALREADY the projective chart's form (a plane is a plane and a ray is a
// ray in the Klein/gnomonic chart, in every model), and uFaceG is ALREADY a
// mat4. Only the TRANSPORT and the METRE differ — a projective door does not
// divide by 1, and chart length is not distance.
uniform int   uModel;
uniform float uFaceBounded[16];         // 1 = quad-bounded (the seam pair)
uniform vec3  uFaceC[16];               // quad centre
uniform vec3  uFaceU[16];               // quad half-axis 1 (length = half-extent)
uniform vec3  uFaceW[16];               // quad half-axis 2
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

// ═══ B-114 — THE METRE. The one quantity the projective chart cannot carry:
// chart length saturates at the Klein boundary while true hyperbolic distance
// runs to infinity, and distance is what the echo fade and the LOD ladder ride.
// E³'s answer is the chart length itself, which is why the committed arm is
// untouched. (Lift (k,1) onto the quadric, normalise, read the inner product.)
float modelDist(vec3 a, vec3 b){
  if(uModel==2){                                  // H³ — Klein ball, Minkowski form
    float qa = 1.0 - dot(a,a);                    // −⟨X,X⟩ for X=(a,1)
    float qb = 1.0 - dot(b,b);
    if(qa<1e-9 || qb<1e-9) return distance(a,b);  // outside the ball: no honest answer, say the chart's
    float ip = (1.0 - dot(a,b)) / sqrt(qa*qb);    // −⟨Â,B̂⟩
    return acosh(max(1.0, ip));
  }
  if(uModel==1){                                  // S³ — gnomonic chart, the R⁴ dot
    float na = sqrt(dot(a,a)+1.0);
    float nb = sqrt(dot(b,b)+1.0);
    return acos(clamp((dot(a,b)+1.0)/(na*nb), -1.0, 1.0));
  }
  return distance(a,b);
}

void main(){
  gSmoothR = 0.016*pow(0.4375, uSmoothRecede);
  vec2 uv=(gl_FragCoord.xy - 0.5*uRes)/uRes.y;
  vec3 v=normalize(uFwd + uRight*uv.x*1.25 + uUp*uv.y*1.25);
  vec3 p=uEye;
  mat3 acc=mat3(1.0);              // the accumulated deck word — its det tells MIRRORED
  float travel=0., echo=0.;
  float mark=0.; // B-2 way-back veil, accumulated at marked-door crossings
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
      if(t>1e-5 && t<tE){
        if(uFaceBounded[f]>0.5){
          vec3 q=p+v*t-uFaceC[f];
          if(abs(dot(q,uFaceU[f]))>dot(uFaceU[f],uFaceU[f]) ||
             abs(dot(q,uFaceW[f]))>dot(uFaceW[f],uFaceW[f])) continue;
        }
        tE=t; fE=f;
      }
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
    echo += 1.;
    // B-2 way-back marks: a ray that passes through a MARKED door carries a
    // faint veil — INK, not camera (§62.1): the room shows the door you came
    // through (full) and the one before (half), read off the trace's own
    // last two letters. Plain first form; the designer refines on sighting.
    if(uFaceMark[fE]>0.25) mark=max(mark,uFaceMark[fE]);
    vec3 q=p+v*tE;
    mat4 g = uFaceG[fE];
    if(uModel==0){
      // ⛔ THE COMMITTED ARM, BYTE-UNTOUCHED. An affine door's bottom row is
      // (0,0,0,1), so the projective branch below would reduce to exactly
      // this — and reducing to it is not the same as BEING it. This arm stays
      // the arithmetic every euclidean witness was measured against.
      travel += tE;
      p = (g*vec4(q,1.)).xyz;
      v = normalize(mat3(g)*v);
      acc = mat3(g)*acc;
    } else {
      // THE PROJECTIVE DOOR: the ray is the line spanned by K=(q,1) and
      // W=(v,0); the door carries it to M·K and M·W, and the chart curve's
      // derivative at the landing is (W′ₓᵧ_z·K′₃ − K′ₓᵧ_z·W′₃) — the
      // denominator K′₃² is positive, so the numerator IS the new direction.
      travel += modelDist(p, q);
      vec4 K = g*vec4(q,1.0);
      vec4 W = g*vec4(v,0.0);
      p = K.xyz/K.w;
      v = normalize(W.xyz*K.w - K.xyz*W.w);
      // ⚠ acc rides here for symmetry ONLY, and must stay unread: on a
      // PROJECTIVE door the 3x3 block is not the orientation (the 4x4
      // determinant is). Nothing in this fragment shader reads det(acc) —
      // the mirror the person is told about is the JS CARRIED FRAME's
      // (seam.frameHanded), which B-114 carries in the model. If anything
      // here ever starts reading it, it must read the 4x4.
      acc = mat3(g)*acc;
    }
    p += v*2e-4;
  }

  // THE VOID IS PAPER — and B-2's way-back veil rides the paper too: a ray
  // that left through a MARKED door and met nothing still carries the mark
  // (without this the veil showed only on inhabitants, invisible at a door)
  if(!hit){ o=vec4(mix(PAPER, vec3(0.17,0.15,0.12), 0.35*mark),1.); return; }

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
  // B-2 way-back marks — a faint graphite veil on rays that passed through a
  // marked door (full for the door just crossed, half for the one before)
  col = mix(col, vec3(0.17,0.15,0.12), 0.35*mark);
  o=vec4(col,1.);
}`;

// DeckTransform layout [r00..r22, tx,ty,tz] → column-major mat4 (the
// instrument's m4, verbatim)
const m4 = (g: number[]): Float32Array =>
  new Float32Array([g[0], g[3], g[6], 0, g[1], g[4], g[7], 0, g[2], g[5], g[8], 0, g[9], g[10], g[11], 1]);

const nrm3 = (v: Vec3): Vec3 => {
  const L = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / L, v[1] / L, v[2] / L];
};
const neg3 = (v: Vec3): Vec3 => [-v[0], -v[1], -v[2]];
const det3of = (g: number[]): number =>
  g[0] * (g[4] * g[8] - g[5] * g[7]) - g[1] * (g[3] * g[8] - g[5] * g[6]) + g[2] * (g[3] * g[7] - g[4] * g[6]);

/** THE CELL PACK (DOOR-FEED partial): the room's own surface → the shader's
 * uniform arrays — per-face plane + wall flag + portal transform (exiting
 * face f applies uFaceG[f]; a wall face draws the 2-cell instead), and the
 * seed's edges as rods. The cube degenerates to the instrument's old frame. */
const IDENTITY_G: number[] = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
function packCell(surface: ApertureCellSurface): {
  faceN: Float32Array; faceD: Float32Array; faceWall: Float32Array; faceG: Float32Array; faceCount: number;
  faceBounded: Float32Array; faceC: Float32Array; faceU: Float32Array; faceW: Float32Array;
  rodA: Float32Array; rodB: Float32Array; rodK: Float32Array; rodClass: Float32Array; rodHeavy: Float32Array; rodCount: number;
  span: number;
  model: number; // B-114: 0 = E³ · 1 = S³ · 2 = H³ — the shader's uModel
} | null {
  if (surface.faces.length === 0 || surface.faces.length > 16 || surface.rods.length > 32) return null;
  const faceN = new Float32Array(48);
  const faceD = new Float32Array(16);
  const faceWall = new Float32Array(16);
  const faceG = new Float32Array(256);
  const faceBounded = new Float32Array(16);
  const faceC = new Float32Array(48);
  const faceU = new Float32Array(48);
  const faceW = new Float32Array(48);
  surface.faces.forEach((f, i) => {
    faceN.set(f.n, i * 3);
    faceD[i] = f.d;
    faceWall[i] = f.wall ? 1 : 0;
    // B-114: a sealed room's door carries its in-model 4×4 DIRECTLY (`g4`);
    // the euclidean room's 12-float affine goes through `m4` exactly as it
    // always did. A wall carries neither and gets the identity, unread.
    faceG.set(f.g4 ?? m4(f.g ?? IDENTITY_G), i * 16);
    if (f.bounds) {
      faceBounded[i] = 1;
      faceC.set(f.bounds.c, i * 3);
      faceU.set(f.bounds.u, i * 3);
      faceW.set(f.bounds.w, i * 3);
    }
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
    faceBounded, faceC, faceU, faceW,
    rodA, rodB, rodK, rodClass, rodHeavy, rodCount: surface.rods.length,
    span: surface.span,
    model: surface.model === 'H3' ? 2 : surface.model === 'S3' ? 1 : 0,
  };
}

let nextSession = 1;

export interface ExploreWindowProps {
  openKey: string;
  title: string;
  cellSurface: ApertureCellSurface; // the room's own faces (portal/wall) + rods
  deckLine: string; // the caption's geometry line (the gate's own label words)
  deckNote?: string | null; // B-114 §0 — the instrument's register, ITS OWN LINE
  level: number;
  pace: number; // advance, world units / s (the cell spans 2)
  lookSensitivity: number; // rad / px
  stepUnit: number; // K-2c: one counted step (a tap of ↑/↓), true distance
  turnFraction: number; // K-2c: one counted turn (a tap of ←/→ · PgUp/PgDn) is 1/this of a full turn
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
  deckNote,
  level,
  pace,
  lookSensitivity,
  stepUnit,
  turnFraction,
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
  const pressRef = useRef<HTMLDivElement | null>(null); // K-1e
  // B-2 THE ORDER-READING SURFACE — the three lines' DOM handles (written
  // imperatively like the return line: no re-render per crossing) and the
  // way-back marks as the shader receives them (uploaded per frame)
  const elisionRef = useRef<HTMLSpanElement | null>(null);
  const traceHeadRef = useRef<HTMLSpanElement | null>(null);
  const traceLastRef = useRef<HTMLSpanElement | null>(null);
  const tallyRef = useRef<HTMLDivElement | null>(null);
  const sentenceRef = useRef<HTMLSpanElement | null>(null);
  const faceMarkArray = useRef<Float32Array>(new Float32Array(16));
  const liveRef = useRef({ level, pace, lookSensitivity, stepUnit, turnFraction, smoothRodRecede, depthWeightRatio, lodMidEcho, lodSmallEcho, lodTinyEcho });
  liveRef.current = { level, pace, lookSensitivity, stepUnit, turnFraction, smoothRodRecede, depthWeightRatio, lodMidEcho, lodSmallEcho, lodTinyEcho };

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
    seam.returnCount = 0;
    seam.doorsAtLastReturn = 0;
    seam.trace = '';
    seam.traceHidden = 0;
    seam.faceMark = new Array<number>(16).fill(0);
    seam.sentence = null;
    seam.press = null;
    seam.returnTurnDeg = null;
    seam.snap = null;
    // B-2 (a witness seam, the drive family's idiom): the room's faces with
    // their door letters, so a headless driver can AIM at a marked door the
    // way a person does by sight — nothing in the app reads this
    seam.faces = cellSurface.faces.map((f) => ({ n: [...f.n] as Vec3, d: f.d, wall: f.wall, door: f.door ? { ...f.door } : null }));
    faceMarkArray.current.fill(0);
    // B-2: the crossing's LETTER — side a (the pairing's forward map) writes
    // the lowercase letter, side b (the inverse map) the capital: the
    // K-1: the gluing-word letter (one per pairing in the room's own order) is
    // minted in `orderTrace` now — ONE producer for what the trace spells and
    // what a keystroke addresses, so a key can never name a door by a spelling
    // the trace does not use.
    // B-2: EVERY order-reading view is derived from the trace here — the tally,
    // the sentence, the two panel spans, and the way-back marks. One producer.
    const refreshOrderSurface = () => {
      const trace = seam.trace;
      const net = new Map<number, number>();
      for (const ch of trace) {
        const code = ch.charCodeAt(0);
        const lower = code >= 97;
        const pair = lower ? code - 97 : code - 65;
        net.set(pair, (net.get(pair) ?? 0) + (lower ? 1 : -1));
      }
      const pairs = [...net.keys()].sort((x, y) => x - y);
      const tally = pairs.map((k) => `${String.fromCharCode(97 + k)} ${net.get(k)}`).join(' · ');
      // the sentence fires ONLY when every count is 0, however reached; its
      // second clause is licensed by the position-return machinery alone
      // (a return fired at THIS door count) — never by anything felt (LAW 20)
      const cancelled = trace.length > 0 && pairs.every((k) => net.get(k) === 0);
      const home = seam.returnCount > 0 && seam.doorsAtLastReturn === seam.doors;
      seam.sentence = cancelled ? cancelSentence(home) : null;
      // B-3 (items 1–3): the trace LINE is a WINDOW of the newest TRACE_WINDOW
      // letters while the tally counts the whole trace, so the elision STATES
      // ITS COUNT — the tally knows more than this line shows, and the number
      // says how much (LAW 23: hidden + shown = the trace, checkable). The
      // mark is ON the line, in its own span with its own tracking — never a
      // letter IN the run. One producer: orderTrace.
      const { hidden, shown } = windowTrace(trace, TRACE_WINDOW);
      seam.traceHidden = hidden;
      if (elisionRef.current) elisionRef.current.textContent = elisionMark(hidden);
      if (traceHeadRef.current) traceHeadRef.current.textContent = shown.slice(0, Math.max(0, shown.length - 1));
      if (traceLastRef.current) traceLastRef.current.textContent = shown.slice(-1);
      if (tallyRef.current) tallyRef.current.textContent = tally;
      if (sentenceRef.current) sentenceRef.current.textContent = seam.sentence ?? '';
      // the way-back marks: the way BACK through a crossed door is its PARTNER
      // face — came through side a (letter `a`), go back through side b
      const marks = new Array<number>(16).fill(0);
      const wayBack = (ch: string): number => {
        const code = ch.charCodeAt(0);
        const lower = code >= 97;
        const pair = lower ? code - 97 : code - 65;
        const side: 'a' | 'b' = lower ? 'b' : 'a';
        return cellSurface.faces.findIndex((f) => f.door !== undefined && f.door.pair === pair && f.door.side === side);
      };
      if (trace.length >= 2) {
        const i = wayBack(trace[trace.length - 2]);
        if (i >= 0) marks[i] = 0.5;
      }
      if (trace.length >= 1) {
        const i = wayBack(trace[trace.length - 1]);
        if (i >= 0) marks[i] = 1;
      }
      seam.faceMark = marks;
      faceMarkArray.current.set(marks);
    };
    refreshOrderSurface();
    // INTERIOR TRANSPORT drive find (2026-08-21): the caption was the one
    // session fact the open-reset missed — on RE-OPENING the same room the
    // freshly computed caption equals the seam's stale copy, the change-gated
    // DOM write never fires, and the standing line renders BLANK. Reset it
    // with the rest so the first frame always writes.
    seam.caption = null;
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
    // B-2 witness seam (drive-family idiom, nothing in the app reads it): read a
    // uniform's LIVE value back from the program, and the mark buffer as uploaded
    seam.uniformProbe = (name: string) => {
      const loc = U(name);
      return loc ? (gl.getUniform(pr, loc) as unknown) : null;
    };
    seam.faceMarkBuffer = faceMarkArray.current;
    gl.uniform1i(U('uFaceCount'), packed.faceCount);
    gl.uniform1i(U('uModel'), packed.model); // B-114 — the room's own geometry
    gl.uniform3fv(U('uFaceN[0]'), packed.faceN);
    gl.uniform1fv(U('uFaceD[0]'), packed.faceD);
    gl.uniform1fv(U('uFaceWall[0]'), packed.faceWall);
    gl.uniformMatrix4fv(U('uFaceG[0]'), false, packed.faceG);
    gl.uniform1fv(U('uFaceBounded[0]'), packed.faceBounded);
    gl.uniform3fv(U('uFaceC[0]'), packed.faceC);
    gl.uniform3fv(U('uFaceU[0]'), packed.faceU);
    gl.uniform3fv(U('uFaceW[0]'), packed.faceW);
    gl.uniform1f(U('uSpan'), packed.span);
    gl.uniform1i(U('uRodCount'), packed.rodCount);
    gl.uniform3fv(U('uRodA[0]'), packed.rodA);
    gl.uniform3fv(U('uRodB[0]'), packed.rodB);
    gl.uniform1fv(U('uRodK[0]'), packed.rodK);
    gl.uniform1fv(U('uRodClass[0]'), packed.rodClass);
    gl.uniform1fv(U('uRodHeavy[0]'), packed.rodHeavy);

    // ★★ THE CARRIED FRAME — the observer's handedness is the space's to take
    // K-2d: the entry is the SEED's euclidean coordinate; a sealed room is a
    // different size, and the plate already stands its eye at the same
    // RELATIVE place by the deck's sceneScale (apertureEyeFor) — the walk takes
    // that one rule (scaleToRoom), so it never starts outside its own cell
    // (measured: the Poincaré trace read `acD` at open, before any act — the
    // raw entry stood 0.262 outside the cell). Euclidean rooms scale by 1, so
    // their entry is byte-identical to what it always was.
    const ENTRY_SEED: Vec3 = [-0.35, -0.55, 0.1];
    let eye: Vec3 = scaleToRoom(cellSurface.sceneScale, ENTRY_SEED);
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
    // K-1e addendum: in a sealed curved room both frames are orthonormal in
    // the ROOM'S metric from the first frame (at E³ this is the identity), so
    // the first door does not change what "unit" means and the deck frame's
    // return comparison is a comparison of two frames of the same metric.
    if (cellSurface.model) {
      [camF, camR, camU] = frameAt(cellSurface.model, eye, [camF, camR, camU]);
      [deckF, deckR, deckU] = frameAt(cellSurface.model, eye, [deckF, deckR, deckU]);
    }
    // the deck frame's ENTRY value — the reference every return is read against,
    // parallel-transported to wherever the return fires (K-1e addendum)
    const entryDeck: Vec3[] = [[...deckF] as Vec3, [...deckR] as Vec3, [...deckU] as Vec3];
    // the entry POSITION + the return hysteresis: the announcement arms only
    // after the person walks OUT of the entry ball (else standing at the
    // start would fire it at once), and fires on each re-entry (position-
    // return ALONE — what the frame did is REPORTED, never a gate).
    const entryEye: Vec3 = [eye[0], eye[1], eye[2]];
    let awayFromEntry = false;
    let lastMove = performance.now();
    let raf = 0;
    let disposed = false;

    // K-1e — THE PRESS IN FLIGHT: one period of the named door's deck element,
    // walked by the one integrator toward `target` = g·p, the target CARRIED
    // through every fold exactly as the eye is (after the last fold it is p
    // itself), the letters crossed collected as the press's own word.
    let press: { letter: string; target: Vec3; word: string; length: number; walked: number; clock: number | null } | null = null;
    // K-2a — THE HELD KEYS: which walk acts are down right now, the SIGN the
    // walk hands the one integrator (+1 forward · −1 back · 0 none), the two
    // turn signs, and the input clocks their integrals run on (the
    // event-timeStamp domain, exactly as the pointer's advClock).
    const heldActs = new Set<WalkAct>();
    const heldSince = new Map<WalkAct, number>(); // K-2c: the input time each act went down — a tap is read at its release
    // K-2c: a walk key that went down while a counted step in its direction was
    // still walking waits behind it — this is its hold window, a TIMER on the
    // input clock (the pointer's own hold law, holdTimer), never a frame's
    // reading of the two clocks: exact under a starved frame, and the frame's
    // stamp is not the input's (measured in the in-app pane: a frame-clock
    // reading of the window took the wheel 1.2 s late)
    const deferTimers = new Map<WalkAct, number>();
    let keyWalk = 0;
    let keyWalkClock = 0;
    // ⚠ THE SIGN IS MEASURED, not assumed (2026-09-16, at the eye): the frame
    // writer's POSITIVE yaw swings forward onto the carried RIGHT — the view
    // turns right — and its positive pitch looks DOWN; so LEFT and UP are the
    // NEGATIVE angles, applied where the rate is spent (the two rotateFrame
    // calls below), never re-derived from the frame.
    let keyYaw = 0; // +1 left · −1 right (the person's words; the writer's sign is applied at the call)
    let keyPitch = 0; // +1 up · −1 down
    let keyLookClock = 0;

    // the JS-side walk transport over the room's OWN faces: a portal applies
    // its deck transform (the same isometry law); a WALL stops the eye AT the
    // room's edge — the manifold ends there, the person never escapes
    const transportWalk = (prevEye: Vec3): void => {
      let prev: Vec3 = prevEye;
      for (let guard = 0; guard < 8; guard += 1) {
        let exited = -1;
        for (let f = 0; f < cellSurface.faces.length; f += 1) {
          const face = cellSurface.faces[f];
          const s = eye[0] * face.n[0] + eye[1] * face.n[1] + eye[2] * face.n[2] - face.d;
          if (s > 0) {
            // INTERIOR TRANSPORT (2026-08-21): a BOUNDED face (the developed
            // cone room's seam) fires only on a genuine CROSSING — the
            // segment walked this frame pierces the plane (before ≤ 0 < after)
            // AND the pierce point lies inside the seam's quad. A point-only
            // test is not enough: the seam plane cuts through distant
            // material, and an eye deep past it can still PROJECT into the
            // quad (measured: the probe's circuit fired 60° early on exactly
            // that). Unbounded faces keep the convex-cell law byte-identically.
            if (face.bounds) {
              const sPrev = prev[0] * face.n[0] + prev[1] * face.n[1] + prev[2] * face.n[2] - face.d;
              if (sPrev > 0) continue; // no crossing this frame — material on the far side
              const t = sPrev / (sPrev - s);
              const hit: Vec3 = [
                prev[0] + (eye[0] - prev[0]) * t,
                prev[1] + (eye[1] - prev[1]) * t,
                prev[2] + (eye[2] - prev[2]) * t,
              ];
              const q: Vec3 = [hit[0] - face.bounds.c[0], hit[1] - face.bounds.c[1], hit[2] - face.bounds.c[2]];
              const u = face.bounds.u;
              const w = face.bounds.w;
              const du = q[0] * u[0] + q[1] * u[1] + q[2] * u[2];
              const dw = q[0] * w[0] + q[1] * w[1] + q[2] * w[2];
              if (Math.abs(du) > u[0] * u[0] + u[1] * u[1] + u[2] * u[2]) continue;
              if (Math.abs(dw) > w[0] * w[0] + w[1] * w[1] + w[2] * w[2]) continue;
            }
            exited = f;
            break;
          }
        }
        if (exited < 0) break;
        const face = cellSurface.faces[exited];
        if (face.wall || (!face.g && !face.g4)) {
          const s = eye[0] * face.n[0] + eye[1] * face.n[1] + eye[2] * face.n[2] - face.d;
          eye = [eye[0] - face.n[0] * (s + 1e-4), eye[1] - face.n[1] * (s + 1e-4), eye[2] - face.n[2] * (s + 1e-4)];
          prev = eye;
          continue;
        }
        if (cellSurface.model && face.g4) {
          // ═══ B-114 — THE PROJECTIVE DOOR, on the eye AND all six axes ═════
          const model = cellSurface.model;
          const g4 = face.g4;
          const K = [
            g4[0] * eye[0] + g4[1] * eye[1] + g4[2] * eye[2] + g4[3],
            g4[4] * eye[0] + g4[5] * eye[1] + g4[6] * eye[2] + g4[7],
            g4[8] * eye[0] + g4[9] * eye[1] + g4[10] * eye[2] + g4[11],
            g4[12] * eye[0] + g4[13] * eye[1] + g4[14] * eye[2] + g4[15],
          ];
          if (Math.abs(K[3]) < 1e-9) break; // the chart horizon — the eye stops, never a fabricated place
          const at: Vec3 = [eye[0], eye[1], eye[2]];
          const push = (v: Vec3): Vec3 => projectiveDirection(g4, at, v);
          const pushedCam = [push(camF), push(camR), push(camU)];
          const pushedDeck = [push(deckF), push(deckR), push(deckU)];
          eye = [K[0] / K[3], K[1] / K[3], K[2] / K[3]];
          // re-orthonormalised AT THE LANDED POINT, in the model's metric —
          // the frames are two independent triples and each keeps its own
          // order, so neither can borrow the other's handedness
          const camN = modelOrthonormalise(model, eye, pushedCam);
          const deckN = modelOrthonormalise(model, eye, pushedDeck);
          camF = camN[0]; camR = camN[1]; camU = camN[2];
          // K-1e: the press's TARGET folds with the eye — the same door, the
          // same map — so after the last fold it is the point the press began
          // at, and the straight chart line to it is still the geodesic.
          if (press) {
            const carried = projectivePoint(g4, press.target);
            if (carried) press.target = carried;
            else press = null; // the horizon — the press stops, never a fabricated place
          }
          deckF = deckN[0]; deckR = deckN[1]; deckU = deckN[2];
          prev = eye;
          seam.doors += 1;
          if (face.door) seam.trace += doorLetter(face.door);
          refreshOrderSurface();
          // the orientation of a PROJECTIVE door is its 4×4 determinant — the
          // 3×3 block is not it. Same reading, same meaning, read correctly.
          seam.frameHanded *= mat4Det(g4) < 0 ? -1 : 1;
          continue;
        }
        // the wall test above already proved a portal carries one map or the
        // other, and the model branch consumed g4 — so this is the affine one
        const g = face.g;
        if (!g) break;
        eye = affinePoint(g, eye);
        camF = affineVector(g, camF);
        camR = affineVector(g, camR);
        camU = affineVector(g, camU);
        deckF = affineVector(g, deckF);
        deckR = affineVector(g, deckR);
        deckU = affineVector(g, deckU);
        if (press) press.target = affinePoint(g, press.target); // K-1e: the target folds with the eye
        // the next guard iteration's segment starts at the LANDED point —
        // with prev == eye a bounded face cannot re-fire without a real move
        prev = eye;
        seam.doors += 1;
        if (face.door) seam.trace += doorLetter(face.door);
        refreshOrderSurface();
        seam.frameHanded *= det3of(g) < 0 ? -1 : 1;
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
    // K-2a — THE ONE FRAME WRITER (LAW 22: a heading is state the observer
    // CARRIES, and one producer writes it). Every look — the drag's pixel
    // deltas and a held turn key's swept angle — rotates the carried frame
    // HERE, about its own up (yaw) and then its own right (pitch). There is no
    // second heading anywhere for a key to write.
    // ⛔ MEASURED 2026-09-16 (K-2a's LAW-22 witness in Seifert–Weber): after a
    // PROJECTIVE door the carried frame is unit in the ROOM'S metric, not the
    // chart's (chart norms 0.51 · 0.32 · 0.48 at one landing), and the old
    // writer rotated with Rodrigues' formula about that non-unit axis and then
    // renormalised in the chart — not a rotation there: a π drag turned 119°,
    // a π key-hold 120°, the two 11.8° apart, and the up axis was rescaled.
    // So the writer rotates WITHIN the frame's own planes — yaw in F–R, pitch
    // in F–U — which is exact in every metric because the frame is orthonormal
    // in the room's own metric, needs no unit axis and no renormalisation, and
    // is the same map as before at E³ (where the frame is chart-orthonormal).
    // The frame's handedness is untouched: nothing is re-derived, the three
    // carried axes are only recombined in their own planes.
    const rotateFrame = (yaw: number, pitch: number): void => {
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const f1: Vec3 = [camF[0] * cy + camR[0] * sy, camF[1] * cy + camR[1] * sy, camF[2] * cy + camR[2] * sy];
      const r1: Vec3 = [camR[0] * cy - camF[0] * sy, camR[1] * cy - camF[1] * sy, camR[2] * cy - camF[2] * sy];
      camF = f1;
      camR = r1;
      const cp = Math.cos(pitch);
      const sp = Math.sin(pitch);
      const f2: Vec3 = [camF[0] * cp - camU[0] * sp, camF[1] * cp - camU[1] * sp, camF[2] * cp - camU[2] * sp];
      const u2: Vec3 = [camU[0] * cp + camF[0] * sp, camU[1] * cp + camF[1] * sp, camU[2] * cp + camF[2] * sp];
      camF = f2;
      camU = u2;
      lastMove = performance.now();
    };
    const turnBy = (dxPx: number, dyPx: number): void => {
      const s = liveRef.current.lookSensitivity;
      rotateFrame(-dxPx * s, -dyPx * s);
    };
    // K-1 — THE ONE PRODUCER OF MOTION. The direction and a chart bound are
    // INPUTS now (the pointer hands `camF` and no bound — byte-identical to
    // the committed line); a keyed crossing hands the door's own normal and
    // the room's width across that pairing. There is no second integrator and
    // no second transport: whoever asked, the eye moves HERE and is carried
    // through a door by `transportWalk` alone (LAW 22 — the record cannot tell
    // which instrument walked). Returns the CHART magnitude actually applied,
    // which is what a bounded walk decrements.
    const advanceBy = (ms: number, dir: Vec3 = camF, maxChart = Infinity): number => {
      const step = (seam.paceOverride ?? liveRef.current.pace) * Math.max(0, ms) / 1000;
      // ⚠ B-114 — THE PACE IS A DISTANCE, so in a sealed room the step is
      // taken along the model's own geodesic, not along a chart line by a
      // chart amount. `camF` is unit IN THE MODEL (the frame is orthonormal
      // there), so the chart displacement that covers `step` of true distance
      // is step/‖camF‖_chart — the two agree exactly at E³, where the chart
      // IS the metric and this reduces to the committed line.
      const model = cellSurface.model;
      const raw = model ? step / Math.sqrt(Math.max(1e-12, modelIP(model, eye, dir, dir))) : step;
      const s = Math.min(raw, maxChart);
      const from: Vec3 = [eye[0], eye[1], eye[2]];
      eye = [eye[0] + dir[0] * s, eye[1] + dir[1] * s, eye[2] + dir[2] * s];
      // K-1e addendum — ALONG A LEG THE FRAMES ARE PARALLEL-TRANSPORTED in the
      // room's own metric, here, at the one motion site, so every instrument's
      // walk carries them the same way (at E³ the transport is the identity).
      if (model && s > 0) {
        camF = transportAlong(model, from, eye, camF);
        camR = transportAlong(model, from, eye, camR);
        camU = transportAlong(model, from, eye, camU);
        deckF = transportAlong(model, from, eye, deckF);
        deckR = transportAlong(model, from, eye, deckR);
        deckU = transportAlong(model, from, eye, deckU);
      }
      lastMove = performance.now();
      return s;
    };
    // K-2a — THE WALK'S CLOSE, shared by the pointer's up and a key's up: the
    // integral is closed at the input's own TRUE time and the eye transported
    // NOW — a starved RAF may not tick for seconds, and a release is where a
    // walk ends whoever asked for it. The two instruments stop the same way
    // because they stop HERE.
    const closeWalk = (from: number, at: number, dir: Vec3 = camF): void => {
      const before: Vec3 = [eye[0], eye[1], eye[2]];
      advanceBy(at - from, dir);
      transportWalk(before);
    };
    // === K-2a — THE HELD KEYS (Arman, verbatim: "we meant for the keyboard
    // control to be the complete control") ===
    // A held walk key IS the pointer's press-and-hold: it hands the one
    // integrator a SIGN (forward +1, back −1 — the same call with the direction
    // negated, never a second path) and its input clock; the frame below
    // advances it exactly as it advances the pointer's hold, and the release
    // closes it through the same closeWalk. Opposite keys held together cancel
    // to a stop, honestly: the person is asking for both and gets neither.
    const resolveKeyWalk = (at: number): void => {
      const want = heldActs.has('forward') === heldActs.has('back') ? 0 : heldActs.has('forward') ? 1 : -1;
      if (want === keyWalk) return;
      if (keyWalk !== 0) closeWalk(keyWalkClock, at, keyWalk > 0 ? camF : neg3(camF));
      keyWalk = want;
      if (want !== 0) {
        keyWalkClock = at;
        press = null; // the hand took the wheel — the same law as the pointer's hold
        seam.advances += 1; // an advance is an advance, whoever asked for it
        lastMove = performance.now();
      }
    };
    // A held turn key is the drag: the SAME frame writer, its angle the stated
    // rate × input-clock time, closed at the release's true time like the walk.
    const resolveKeyLook = (at: number): void => {
      const yaw = heldActs.has('left') === heldActs.has('right') ? 0 : heldActs.has('left') ? 1 : -1;
      const pitch = heldActs.has('up') === heldActs.has('down') ? 0 : heldActs.has('up') ? 1 : -1;
      if (yaw === keyYaw && pitch === keyPitch) return;
      const wasLooking = keyYaw !== 0 || keyPitch !== 0;
      if (wasLooking) {
        const dt = Math.max(0, at - keyLookClock) / 1000;
        rotateFrame(-keyYaw * KEY_TURN_RATE * dt, -keyPitch * KEY_TURN_RATE * dt);
      }
      keyYaw = yaw;
      keyPitch = pitch;
      keyLookClock = at;
      if (!wasLooking && (yaw !== 0 || pitch !== 0)) seam.looks += 1; // a look is a look, whoever asked
    };
    // A key released while the window has no focus never sends its keyup — so
    // losing focus, or the pointer taking the wheel, RELEASES every held key at
    // one true time, through the same two resolvers a keyup runs.
    const releaseKeys = (at: number = performance.now()): void => {
      if (heldActs.size === 0) return;
      heldActs.clear();
      heldSince.clear();
      for (const id of deferTimers.values()) window.clearTimeout(id);
      deferTimers.clear();
      resolveKeyWalk(at);
      resolveKeyLook(at);
    };
    // K-2c — THE TWO SNAPS, ruled lawful on their face. FACE THE NEAREST DOOR
    // SQUARELY: the door whose plane is nearest the eye, faced along the
    // geodesic that meets it at right angles (the plane's covector projected
    // to the eye's tangent space — the chart normal at E³), written by the one
    // frame writer in the frame's own planes (yaw, then pitch — no roll, so
    // the up stays as level as the look was). FACE AS YOU ENTERED: the looked
    // frame becomes the DECK frame — the entry frame carried along the
    // walker's own path by the doors' isometries and the legs' transport
    // (K-1e addendum) — a recorded landmark, never re-derived. Both count as
    // a look. ⛔ "level the horizon" is not here (a meaning question, K-1d §2).
    const snapTo = (act: 'faceDoor' | 'entryLook'): void => {
      if (act === 'entryLook') {
        camF = [deckF[0], deckF[1], deckF[2]];
        camR = [deckR[0], deckR[1], deckR[2]];
        camU = [deckU[0], deckU[1], deckU[2]];
        seam.snap = { act, letter: null };
        seam.looks += 1;
        lastMove = performance.now();
        return;
      }
      let nearest = -1;
      let nearestGap = Infinity;
      cellSurface.faces.forEach((f, i) => {
        if (f.wall || !f.door) return;
        const gap = f.d - (eye[0] * f.n[0] + eye[1] * f.n[1] + eye[2] * f.n[2]);
        if (gap < nearestGap) { nearestGap = gap; nearest = i; }
      });
      if (nearest < 0) return; // a room of walls has no door to face
      const face = cellSurface.faces[nearest];
      const toward = perpendicularToward(cellSurface.model, eye, face.n, face.d);
      const ip = (a: Vec3, b: Vec3): number => (cellSurface.model ? modelIP(cellSurface.model, eye, a, b) : a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
      const dF = ip(toward, camF);
      const dR = ip(toward, camR);
      const dU = ip(toward, camU);
      // the aim in the frame's own planes: yaw brings F onto the F–R shadow of
      // the direction, then pitch lifts it out of that plane — the writer's
      // own sign (a +pitch looks down)
      rotateFrame(Math.atan2(dR, dF), -Math.atan2(dU, Math.hypot(dF, dR)));
      seam.snap = { act, letter: face.door ? doorLetter(face.door) : null };
      seam.looks += 1;
      lastMove = performance.now();
    };
    // === K-1 — THE KEYBOARD WALK (Arman, 15:38, a pocket out of any queue) ===
    // The doors already know their own names. `KeyboardEvent.key` IS the trace
    // letter — 'a'…'f' for a door's own side, and shift already yields the
    // 'A'…'F' the trace writes for the inverse — so a press addresses a door
    // by the spelling the person is reading, with no key table between them.
    // The press moves NOTHING itself: it hands the walk's own integrator a
    // direction (the door's outward normal) and a distance (the room's width
    // across that pairing), and the frame below advances and transports it by
    // the same two calls a held pointer uses. So a keyed circuit and a walked
    // one leave byte-identical seam state — no instrument tag exists to leave.
    const onKey = (ev: KeyboardEvent): void => {
      // the browser's own chords are the browser's; one press is one crossing
      if (ev.ctrlKey || ev.altKey || ev.metaKey || ev.repeat) return;
      const el = ev.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
      // K-2a — THE WALK KEYS. A bound key (never a single character — the doors
      // own the alphabet; see walkKeyAct) records a held act and lets the two
      // resolvers hand the integrator its sign and the frame writer its rate.
      // The press moves nothing itself; the frame below moves the eye, exactly
      // as it does for the pointer's hold. Auto-repeats returned above.
      const act = walkKeyAct(ev.key);
      if (act) {
        ev.preventDefault(); // the page never scrolls under a walk
        if (act === 'faceDoor' || act === 'entryLook') {
          snapTo(act);
          return;
        }
        if (heldActs.has(act)) return;
        heldActs.add(act);
        heldSince.set(act, ev.timeStamp);
        // K-2c: while a counted STEP in the same direction is still walking, the
        // key does not take the wheel yet — released inside the tap window it
        // ADDS a unit to that step; held past it, the frame lets the hold take
        // the wheel (the glide) at that moment.
        if ((act === 'forward' || act === 'back') && press && press.letter === (act === 'forward' ? '↑' : '↓')) {
          const since = ev.timeStamp;
          deferTimers.set(act, window.setTimeout(() => {
            deferTimers.delete(act);
            if (!heldActs.has(act)) return;
            press = null; // the hand took the wheel — the step's remainder is not resumed (the pointer's law)
            // the hold's input truth: the glide began one tap-window after the
            // key went down, even when this timer itself fired late
            resolveKeyWalk(since + TAP_MS);
          }, TAP_MS));
          return;
        }
        resolveKeyWalk(ev.timeStamp);
        resolveKeyLook(ev.timeStamp);
        return;
      }
      // ═══ K-1e — THE LETTER-PRESS IS ONE PERIOD (the researcher's ruling K-1d,
      // on 1,476 periods in the engine's own chart; the mothership's stamp).
      // A press of door X at p traverses the geodesic p → g·p, g the deck
      // element ENTERED through X — which is the PARTNER face's own map (the
      // face carries M, its partner M⁻¹; crossing X applies M, so the cell
      // beyond X is M⁻¹·D). The target is CARRIED through every fold exactly
      // as the eye is, so after the last fold it is p itself; the walk is the
      // one integrator, bounded by the chart distance to the target (a straight
      // chart line is the geodesic in the Klein and gnomonic charts); the trace
      // is the doors actually crossed; the currency is d(p, g·p), true. In a
      // box this IS the normal (K-1's T³ seal stands, byte-identical); in
      // Seifert–Weber the period leaves through the named face from every
      // point; in the Poincaré cell it may write a word of 2–3 letters —
      // written honestly, never refused, never re-aimed. The curved-room REST
      // of K-1 is lifted: the letters work in every room.
      const at = faceForLetter(cellSurface.faces, letterForKey(ev.key, ev.shiftKey));
      if (at < 0) return; // an unbound key does nothing and mints nothing — esc keeps its meaning
      if (press || advancing || keyWalk !== 0) return; // one period at a time; a walk in flight is never queued behind
      const named = cellSurface.faces[at];
      const partner = named.door
        ? cellSurface.faces.find((f) => f.door && f.door.pair === named.door!.pair && f.door.side !== named.door!.side)
        : undefined;
      if (!partner) return; // a door without a partner has no deck element — nothing to traverse
      const target = cellSurface.model && partner.g4 ? projectivePoint(partner.g4, eye) : partner.g ? affinePoint(partner.g, eye) : null;
      if (!target) return; // the horizon, or a face with no map — nothing is minted
      if (Math.hypot(target[0] - eye[0], target[1] - eye[1], target[2] - eye[2]) < 1e-9) return; // a fixed point — no period to walk
      ev.preventDefault();
      press = {
        letter: letterForKey(ev.key, ev.shiftKey),
        target,
        word: '',
        length: walkDistance(cellSurface.model, eye, target),
        walked: 0,
        clock: null, // the walk's clock starts at the frame that carries it
      };
      seam.advances += 1; // an advance is an advance, whoever asked for it
      lastMove = performance.now();
    };
    const onKeyUp = (ev: KeyboardEvent): void => {
      const act = walkKeyAct(ev.key);
      if (!act || !heldActs.has(act)) return;
      heldActs.delete(act);
      const since = heldSince.get(act);
      heldSince.delete(act);
      const deferred = deferTimers.get(act);
      if (deferred !== undefined) { window.clearTimeout(deferred); deferTimers.delete(act); } // released inside its window: a tap, counted below
      const wasWalking = keyWalk;
      const wasYaw = keyYaw;
      const wasPitch = keyPitch;
      const stepSign = act === 'forward' ? 1 : act === 'back' ? -1 : 0;
      resolveKeyWalk(ev.timeStamp);
      resolveKeyLook(ev.timeStamp);
      // K-2c — A TAP: released inside the window, the act is COUNTED. The glide
      // or sweep it already spent (exact to the input clock) is topped up to
      // exactly one unit — a step walks its remainder by the same bounded
      // walk a letter-press uses (the one integrator, folding at the doors);
      // a turn's remainder is written by the one frame writer.
      if (since !== undefined && ev.timeStamp - since < TAP_MS) {
        const held = Math.max(0, ev.timeStamp - since) / 1000;
        if (stepSign !== 0 && keyWalk === 0 && !advancing) {
          const unit = liveRef.current.stepUnit;
          const spent = wasWalking !== 0 ? (seam.paceOverride ?? liveRef.current.pace) * held : 0;
          const remainder = Math.max(0, unit - spent);
          const dir = stepSign > 0 ? camF : neg3(camF);
          const arrow = stepSign > 0 ? '↑' : '↓';
          if (press && press.letter === arrow) {
            // a tap landing while the previous step still walks ADDS its unit to
            // the step in flight — along the same line, from the carried target —
            // so N taps are N units however fast the hand (measured: one of five
            // taps at 1.5 s spacing fell through while a step was still walking)
            const gap: Vec3 = [press.target[0] - eye[0], press.target[1] - eye[1], press.target[2] - eye[2]];
            press.target = expMap(cellSurface.model, press.target, gap, unit);
            press.length += unit;
          } else if (!press && remainder > 1e-9) {
            press = {
              letter: arrow,
              target: expMap(cellSurface.model, eye, dir, remainder),
              word: '',
              length: unit,
              walked: spent,
              clock: null,
            };
          }
        } else if ((act === 'left' || act === 'right' || act === 'up' || act === 'down') && (wasYaw !== 0 || wasPitch !== 0)) {
          const fraction = (2 * Math.PI) / liveRef.current.turnFraction;
          const swept = KEY_TURN_RATE * held;
          const remainder = Math.max(0, fraction - swept);
          if (act === 'left' || act === 'right') rotateFrame(-wasYaw * remainder, 0);
          else rotateFrame(0, -wasPitch * remainder);
        }
      }
    };
    const onBlur = (): void => releaseKeys();
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
        press = null; // K-1: the hand took the wheel — the period's remainder is not resumed
        releaseKeys(downT + ADVANCE_HOLD_MS); // K-2a: and the held keys close at the same true time — one wheel
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
          closeWalk(advClock, ev.timeStamp);
        }
      }
      pressed = false;
      mode = 'undecided';
      advancing = false;
      if (holdTimer !== null) window.clearTimeout(holdTimer);
      holdTimer = null;
      try { canvas.releasePointerCapture(ev.pointerId); } catch { /* released */ }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
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
      // K-2a: a held turn key sweeps the carried frame at the stated rate over
      // input-clock time — through the ONE frame writer the drag uses — before
      // this frame's advance, so a walk follows the heading it is being turned to
      if (keyYaw !== 0 || keyPitch !== 0) {
        const dt = Math.max(0, now - keyLookClock) / 1000;
        rotateFrame(-keyYaw * KEY_TURN_RATE * dt, -keyPitch * KEY_TURN_RATE * dt);
        keyLookClock = Math.max(keyLookClock, now);
      }
      const beforeAdvance: Vec3 = [eye[0], eye[1], eye[2]];
      if (advancing) {
        advanceBy(now - advClock);
        advClock = Math.max(advClock, now); // a RAF stamp may predate the timer's engage — never rewind the integrator
      } else if (keyWalk !== 0) {
        // K-2a: a held walk key IS the pointer's hold — the same integrator, the
        // same pace, the same clock law; BACK is the same call with the
        // direction negated, never a second motion path (LAW 22)
        advanceBy(now - keyWalkClock, keyWalk > 0 ? camF : neg3(camF));
        keyWalkClock = Math.max(keyWalkClock, now);
      } else if (press) {
        // K-1e: the same integrator, the same pace, bounded by the chart
        // distance to the carried target — the last step lands ON it. The
        // clock starts at the frame that carries the walk, so a starved first
        // frame cannot spend the whole period in one step.
        if (press.clock === null) press.clock = now;
        const gap: Vec3 = [press.target[0] - eye[0], press.target[1] - eye[1], press.target[2] - eye[2]];
        const left = Math.hypot(gap[0], gap[1], gap[2]);
        if (left > 1e-9) {
          const dir = nrm3(gap);
          const here: Vec3 = [eye[0], eye[1], eye[2]];
          const s = advanceBy(now - press.clock, dir, left);
          // the true length this step spent — the chart step read in the
          // room's metric at the point it left (LAW 23: the sum is checkable
          // against d(p, g·p))
          press.walked += s * Math.sqrt(cellSurface.model ? modelIP(cellSurface.model, here, dir, dir) : 1);
        }
        press.clock = now;
      }
      // K-1e: THE ARMING IS READ AT THE FOLD TOO. A period's excursion from the
      // entry is at least half its length, but it may all lie BEFORE the fold
      // (the far face) or all AFTER it (the near face) — and under a starved
      // frame one step carries the outbound leg, folds, and lands most of the
      // way home, so a read at the frame's end alone never sees it (measured
      // 2026-09-16: `A` in Seifert–Weber came home to the digit unannounced).
      // The same position-alone rule, read at the pre-fold position as well.
      if (!awayFromEntry && walkDistance(cellSurface.model, eye, entryEye) > RETURN_ARM) awayFromEntry = true;
      const doorsBeforeTransport = seam.doors;
      const traceBeforeTransport = seam.trace.length;
      transportWalk(beforeAdvance);
      if (press) {
        // the press's own word: the letters the transport wrote this frame
        if (seam.trace.length > traceBeforeTransport) press.word += seam.trace.slice(traceBeforeTransport);
        const d = Math.hypot(press.target[0] - eye[0], press.target[1] - eye[1], press.target[2] - eye[2]);
        if (d <= 1e-6) {
          seam.press = { letter: press.letter, word: press.word, length: press.length, walked: press.walked };
          if (pressRef.current) {
            pressRef.current.textContent = press.letter === '↑' || press.letter === '↓'
              ? `stepped ${press.letter} · ${press.length.toFixed(2)}${press.word ? ` · crossed ${press.word}` : ''}`
              : `pressed ${press.letter} · crossed ${press.word || 'nothing'} · walked ${press.length.toFixed(2)}`;
          }
          press = null;
        }
      }
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
      gl.uniform1fv(U('uFaceMark[0]'), faceMarkArray.current);
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
      seam.right = [...camR] as Vec3;
      seam.up = [...camU] as Vec3;
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
      const geometryLine = `${deckLine}${boundaryLine} · copies shown to depth ${Math.max(0, Math.round(liveRef.current.level))}`;
      // B-114 §0: the note is a line ABOUT the reading, so it gets a line —
      // the div below is `pre-line`, which honours this newline and nothing else
      const caption = deckNote ? [geometryLine, deckNote].join('\n') : geometryLine;
      if (seam.caption !== caption) {
        seam.caption = caption;
        if (captionRef.current) captionRef.current.textContent = caption;
        fitLog(); // the caption's height just changed — re-fit the bound
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
      // K-1e: THE RETURN BALL IS READ IN THE ROOM'S OWN METRIC (at E³ the chart's
      // own hypot, byte-unchanged). Measured 2026-09-16 in Seifert–Weber: a press
      // of `A` from the entry walked its whole period (2.41 true) and came home
      // to the digit, yet its CHART excursion never left the arming radius —
      // near the Klein boundary a true metre is a chart inch — so no return
      // fired and the sentence said "not home" of a walk that was home. The
      // ball keeps its size (0.35, a hand's walk at the default pace) in TRUE
      // distance, where every period's excursion is at least half its length.
      const dEntry = walkDistance(cellSurface.model, eye, entryEye);
      if (!awayFromEntry && dEntry > RETURN_ARM) {
        awayFromEntry = true;
      } else if (awayFromEntry && dEntry <= RETURN_EPS) {
        awayFromEntry = false;
        // K-1e addendum: the deck frame is compared with its ENTRY value carried
        // to this point by the room's own transport (at E³ the entry frame
        // itself), and the angle of the rotation between them is the
        // covariant number the line prints (LAW 23). `mirrored` on det −1 as
        // before; `the same way up` when the trace is within FRAME_EPS of 3.
        const ref = entryDeck.map((v) => transportAlong(cellSurface.model, entryEye, eye, v));
        const deckTrace = [deckF, deckR, deckU].reduce(
          (acc, v, i) => acc + (cellSurface.model ? modelIP(cellSurface.model, eye, v, ref[i]) : v[0] * ref[i][0] + v[1] * ref[i][1] + v[2] * ref[i][2]),
          0,
        );
        const turnDeg = frameAngleDeg(cellSurface.model, eye, [deckF, deckR, deckU], ref);
        seam.returnTurnDeg = seam.frameHanded < 0 ? null : turnDeg;
        const clause =
          seam.frameHanded < 0
            ? 'the room came back mirrored'
            : deckTrace >= 3 - FRAME_EPS
              ? 'the room came back the same way up'
              : `the room came back turned by ${Math.round(turnDeg)}°`;
        // M-1 part B (her 0121 §3 ruling, superseding the middle term of the
        // W.7 strings): `back where you started` is about THIS return, the
        // clause is about THIS return, and the bare door count was CUMULATIVE
        // — a subject shift mid-sentence that argued for the false reading
        // ("this return took 21 doors"). `after N doors` restores the one
        // subject; `return N ·` is the ordinal that keeps the two-slot log
        // honest about what it dropped. Door-count agreement unchanged
        // (`1 door` singular, `0 doors` plural).
        seam.returnCount += 1;
        // B-2 item 0 — the LEG, not the session: doors since the previous return
        const legDoors = seam.doors - seam.doorsAtLastReturn;
        seam.doorsAtLastReturn = seam.doors;
        // B-2 item 3: `home` is licensed ONLY here — by the position-return
        // machinery, never by anything felt (LAW 20). The sentence re-reads.
        refreshOrderSurface();
        const returnLine = `return ${seam.returnCount} · back where you started · after ${legDoors === 1 ? '1 door' : `${legDoors} doors`} · ${clause}`;
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
        fitLog(); // a second slot may have just filled — re-fit under the bound
      }
      raf = requestAnimationFrame(frame);
    };
    // M-1 part B + M-1c — THE BOUND'S MECHANISM, measured off real rects
    // (this panel is absolute inside the app region, so its viewport top is
    // not its style's `top`, and the caption's height varies by room — no
    // calc() constant can know either): (1) the CANVAS YIELDS — its width
    // clamps to the height budget the window leaves after the panel's real
    // top and real chrome, so the square walk view shrinks uniformly (the
    // buffer follows client size per frame — crisp at any size, floor
    // 140px); (2) then the LOG SHORTENS — at extreme shortness the PREVIOUS
    // return drops, and the ordinal keeps the drop honest (`return 8`
    // beside a lone slot says seven came before; 24px hysteresis so the
    // slot does not flicker). NOTHING here scrolls — drag is the walk's own
    // gesture (M-1c), and a scroll region would give one pointer motion two
    // meanings decided by pixel position.
    let logHiddenAtH = 0;
    const fitLog = () => {
      const panelEl = canvas.parentElement;
      if (!panelEl) return;
      const panelTop = panelEl.getBoundingClientRect().top;
      const chrome = panelEl.scrollHeight - canvas.clientHeight;
      const budget = Math.max(140, window.innerHeight - panelTop - chrome - 10);
      const width = Math.min(panelEl.clientWidth - 24, budget);
      const wanted = `${Math.round(width)}px`;
      if (canvas.style.width !== wanted) canvas.style.width = wanted;
      const prevEl = prevReturnRef.current;
      if (!prevEl) return;
      if (prevEl.style.display === 'none') {
        if (window.innerHeight < logHiddenAtH + 24) return;
        prevEl.style.display = '';
        logHiddenAtH = 0;
      }
      if (
        seamOf().previousReturnLine !== null &&
        panelTop + panelEl.scrollHeight > window.innerHeight - 4
      ) {
        prevEl.style.display = 'none';
        logHiddenAtH = window.innerHeight;
      }
    };
    window.addEventListener('resize', fitLog);
    fitLog();
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      for (const id of deferTimers.values()) window.clearTimeout(id);
      deferTimers.clear();
      window.removeEventListener('resize', fitLog);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
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
        // M-1 part B — THE WALK PANEL IS BOUNDED TO THE WINDOW (her A.1
        // reaching a second surface: a content-dependent column may not run
        // past the frame — at 800×620 the older return line clipped at the
        // viewport's bottom edge, and a log that truncates AND clips shows
        // one entry and looks like it shows two). The bound's MECHANISM is
        // fitLog, measured off real rects (a calc() constant cannot know
        // this panel's true viewport offset — it is absolute inside the app
        // region, not the window — nor the caption's per-room line count):
        // the CANVAS yields first, then the log SHORTENS. NOTHING here
        // scrolls — drag is the walk's own gesture (M-1c).
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
          // M-1 part B — the canvas yields to the bound: fitLog clamps this
          // width to the measured height budget (viewport minus the panel's
          // real top and its real chrome), so the square walk view shrinks
          // uniformly instead of pushing the reading past the window. The
          // buffer syncs from client size per frame, so a smaller view
          // stays crisp — nothing distorts, nothing scrolls, nothing clips.
          width: '100%',
          marginInline: 'auto',
          aspectRatio: '1 / 1',
          background: paper.background,
          cursor: 'crosshair',
          touchAction: 'none',
        }}
      />
      <div
        ref={captionRef}
        data-explore-caption
        style={{ marginTop: 6, fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: 0.78, minHeight: 15, whiteSpace: 'pre-line' }}
      />
      {/* B-2 THE ORDER-READING SURFACE (the designer's 1726/1752): three lines
          under the room description, each its own line, one separator one
          job. THE TRACE — door letters at each crossing, capitals for
          inverses, ratcheting; the most recent letter alone at full ink (one
          glyph, one meaning: full ink = the crossing you just made); elides
          from the LEFT when long behind a plain mark (⚠ the elision glyph is
          hers, deferred to a long-walk sighting). THE TALLY — net count per
          letter used. THE SENTENCE — fires only when every count is 0,
          immediately under the tally as its evidence, NEVER in a return slot
          (a return line means the eye stands at its start again; the sentence
          means the WORD cancelled — collapsing them collapses the arc's own
          distinction); its second clause is licensed by the position-return
          machinery alone. */}
      <div
        data-explore-trace
        style={{ marginTop: 4, fontFamily: 'ui-monospace, monospace', fontSize: 11, minHeight: 15, letterSpacing: 1 }}
      >
        {/* B-3 item 3 — the elision is a MARK on the line, not a letter in the
            run: its own span, its own tracking (the run's letterSpacing is
            the word's; the count is not a word), its own register. Empty —
            nothing rendered — while nothing is hidden. */}
        <span ref={elisionRef} data-explore-elision style={{ letterSpacing: 0, fontStyle: 'italic', opacity: 0.6 }} />
        <span ref={traceHeadRef} style={{ opacity: 0.78 }} />
        <span ref={traceLastRef} style={{ opacity: 1 }} />
      </div>
      <div
        ref={tallyRef}
        data-explore-tally
        style={{ marginTop: 1, fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: 0.78, minHeight: 15 }}
      />
      {/* B-3 item 4 — THE DOING/HAPPENED BOUNDARY IS A CONSTANT: trace + tally
          are what you are DOING, sentence + return what HAPPENED. The gap
          between the groups is this margin, held whether the sentence slot
          is empty or fired — the designer measured the old grouping living on
          the sentence's EMPTY height, which collapsed at the design's most
          important instant. The reserved blank (minHeight) STAYS: an empty
          slot is a true absence and a strip that jumps under a walking eye
          is worse. */}
      <div
        data-explore-sentence
        style={{ marginTop: 9, position: 'relative', fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: 1, minHeight: 15 }}
      >
        {/* the reserved blank is SIZED BY THE PRODUCER'S OWN LONGEST SENTENCE —
            an invisible copy holds the slot at whatever width the panel has,
            so the return line below never moves when the sentence fires
            (measured: at a narrow panel the fired sentence wrapped and the
            return line jumped 18px). Invisible, never read: the live text
            lies over it. */}
        <span aria-hidden data-explore-sentence-ghost style={{ visibility: 'hidden' }}>
          {LONGEST_CANCEL_SENTENCE}
        </span>
        <span ref={sentenceRef} data-explore-sentence-text style={{ position: 'absolute', left: 0, top: 0, right: 0 }} />
      </div>
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
      {/* K-1e — THE PRESS LINE: the letter pressed (the act), the letters the
          transport actually wrote for it, and the true length of the period
          as a number the person can read (LAW 23). Empty until the first
          press; the wording is the designer's to refine at K-2b. */}
      <div
        ref={pressRef}
        data-explore-press
        style={{ marginTop: 1, fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: 0.78, minHeight: 15 }}
      />
      <div style={{ marginTop: 3, fontSize: 10.5, opacity: 0.55 }}>
        {/* K-2a: the gesture line states EVERY act the window offers — the
            keyboard's acts first, the pointer's beside them. K-1e lifted the
            curved-room rest of the letters, so the line is ONE line in every
            room. */}
        {`↑/↓ — walk (tap: one step of ${stepUnit.toFixed(2)} · hold: glide) · ←/→ — turn (tap: 1/${turnFraction} turn · hold: sweep) · PgUp/PgDn — look up and down (the same) · End — face the nearest door · Home — face as you entered · a door's letter — cross it, shift for the other way · drag — look around · press and hold — walk forward · the hatch settles in when you stand still · esc returns to the shell`}
      </div>
    </div>
  );
}

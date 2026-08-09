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
import type { ApertureRodData, DeckEntry } from './apertureModel';

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
  rodK: number[] | null; // the engine's k per rod — the cone edges the shader draws HEAVY
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
    };
  }
  return host.__exploreWindow;
};

const LOOK_SLOP_PX = 7;
const ADVANCE_HOLD_MS = 260;

const VS = `#version 300 es
in vec2 p; void main(){ gl_Position=vec4(p,0.,1.); }`;

// the instrument's fragment shader, ported: the scene is the AUTHORED
// plaque + coil + stands + the 12 class-coloured rods
const FS = `#version 300 es
precision highp float;
out vec4 o;
uniform vec2  uRes;
uniform vec3  uEye, uFwd, uRight, uUp;
uniform mat4  uG[3], uGi[3];
uniform float uRodK[12];
uniform float uRodClass[12];
uniform int   uLevel;
uniform float uHatch;      // the SETTLE dial

const vec3 PAPER = vec3(0.914,0.886,0.812);   // the page (#e9e2cf)
const vec3 INK   = vec3(0.165,0.145,0.110);   // the line (#2a251c)
vec3 classInk(float c){
  if(c<0.5) return vec3(0.133,0.157,0.235);
  if(c<1.5) return vec3(0.620,0.212,0.149);
  if(c<2.5) return vec3(0.173,0.369,0.306);
  if(c<3.5) return vec3(0.588,0.431,0.157);
  return vec3(0.376,0.275,0.470);
}
const vec3 CN[8] = vec3[8](vec3(-1,-1,-1),vec3(1,-1,-1),vec3(1,1,-1),vec3(-1,1,-1),
                           vec3(-1,-1,1), vec3(1,-1,1), vec3(1,1,1), vec3(-1,1,1));
const ivec2 CE[12]= ivec2[12](ivec2(0,1),ivec2(1,2),ivec2(2,3),ivec2(3,0),
                              ivec2(4,5),ivec2(5,6),ivec2(6,7),ivec2(7,4),
                              ivec2(0,4),ivec2(1,5),ivec2(2,6),ivec2(3,7));
float sdCap(vec3 p, vec3 a, vec3 b, float r){
  vec3 pa=p-a, ba=b-a; float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
  return length(pa-ba*h)-r;
}
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
// scene ids: 0 = plaque · 13 = coil · 14 = stands · 1..12 = the rods
float map(vec3 p, out float id){
  float d=sdPlaque(p); id=0.;
  float dc=sdCoil(p); if(dc<d){ d=dc; id=13.; }
  float ds=sdStands(p); if(ds<d){ d=ds; id=14.; }
  for(int i=0;i<12;i++){
    float r = (uRodK[i]==4.0) ? 0.016 : 0.042;   // a CONE edge is MUCH thicker — k is metric, and visible
    float dd=sdCap(p, CN[CE[i].x], CN[CE[i].y], r);
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
  vec2 uv=(gl_FragCoord.xy - 0.5*uRes)/uRes.y;
  vec3 v=normalize(uFwd + uRight*uv.x*1.25 + uUp*uv.y*1.25);
  vec3 p=uEye;
  mat3 acc=mat3(1.0);              // the accumulated deck word — its det tells MIRRORED
  float travel=0., echo=0.;
  bool hit=false; vec3 nrmOut=vec3(0); float idOut=-1.; float dep=0.;

  for(int b=0;b<12;b++){
    if(b>uLevel) break;
    float tE=1e9; int ax=0; float sgn=1.;
    for(int a=0;a<3;a++){
      float va=v[a]; if(abs(va)<1e-6) continue;
      float s=sign(va);
      float t=(s - p[a])/va;
      if(t>1e-5 && t<tE){ tE=t; ax=a; sgn=s; }
    }
    float t=1e-3, id=-1.;
    for(int i=0;i<160;i++){
      if(t>tE) break;
      float d=map(p+v*t, id);
      if(d<8e-4){ hit=true; break; }
      t += max(d*0.9, 4e-4);
    }
    if(hit){ vec3 q=p+v*t; nrmOut=nrm(q); idOut=id; dep=travel+t; break; }
    // TRANSPORT — the engine's own gluing isometry (ratified; never churned)
    travel += tE; echo += 1.;
    vec3 q=p+v*tE;
    mat4 g = (sgn>0.) ? uGi[ax] : uG[ax];
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

  vec3 base;
  if(idOut<0.5 || idOut>12.5){ base=INK; }
  else { int ei=int(idOut)-1; base=classInk(uRodClass[ei]);
         if(uRodK[ei]!=4.0) tone=clamp(tone*1.35,0.,1.); }   // cone edges HEAVY
  // mirrored = det(acc) < 0 — a mirrored copy SHOWS itself; it is NEVER
  // ink-marked (chirality by the light: the coil reads left-handed)

  // CONTOUR — geometry-anchored (screen derivatives of n and depth): the
  // lines do NOT crawl when the camera moves
  float crease = length(fwdD(nrmOut));
  float dbreak = fwidth(dep);
  float line = clamp(max(crease*0.9, dbreak*9.0), 0., 1.);
  line = smoothstep(0.25, 0.75, line) * exp(-echo/2.8);

  // HATCH — screen-space, ~22% duty, gated by tone and the SETTLE dial
  float a1=0.593;
  float h = fract((gl_FragCoord.x*cos(a1) + gl_FragCoord.y*sin(a1))/6.0);
  float hatch = (tone>0.52 && h<0.22) ? 1.0 : 0.0;
  hatch *= fade*0.55*uHatch;

  float body = clamp(0.26+0.55*tone,0.,1.)*fade;
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

/** the deck by AXIS SLOT: the shader's exit test picks axis a and applies
 * uGi[a] (exiting +a) or uG[a] (exiting −a); slot a must carry the pairing
 * whose faces are the ±a pair, oriented so g maps the −a face to the +a
 * face (swap when the pattern's faceA sits on +a). */
function packDeck(deck: DeckEntry[]): { G: Float32Array; Gi: Float32Array } | null {
  const G = new Float32Array(48);
  const Gi = new Float32Array(48);
  const seen = [false, false, false];
  for (const entry of deck) {
    const axis = [0, 1, 2].reduce((best, a) => (Math.abs(entry.nA[a]) > Math.abs(entry.nA[best]) ? a : best), 0);
    if (seen[axis]) return null;
    seen[axis] = true;
    const aFaceOnMinus = entry.nA[axis] < 0;
    const g = aFaceOnMinus ? entry.g : entry.gi;
    const gi = aFaceOnMinus ? entry.gi : entry.g;
    G.set(m4(g), axis * 16);
    Gi.set(m4(gi), axis * 16);
  }
  if (!seen.every(Boolean)) return null;
  return { G, Gi };
}

let nextSession = 1;

export interface ExploreWindowProps {
  openKey: string;
  title: string;
  deck: DeckEntry[];
  rodData: ApertureRodData;
  deckLine: string; // the caption's geometry line (the gate's own label words)
  level: number;
  pace: number; // advance, world units / s (the cell spans 2)
  lookSensitivity: number; // rad / px
  paper: { cardBackground: string; cardBorder: string; cardInk: string; background: string };
  accent: string;
  onClose: () => void;
}

export function ExploreWindow({
  openKey,
  title,
  deck,
  rodData,
  deckLine,
  level,
  pace,
  lookSensitivity,
  paper,
  accent,
  onClose,
}: ExploreWindowProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);
  const liveRef = useRef({ level, pace, lookSensitivity });
  liveRef.current = { level, pace, lookSensitivity };

  const packed = useMemo(() => packDeck(deck), [deck]);

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
    seam.rodK = [...rodData.rodK];
    nextSession += 1;
    if (!canvas || !packed) return undefined;
    const gl = canvas.getContext('webgl2', { antialias: false });
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
    gl.uniformMatrix4fv(U('uG[0]'), false, packed.G);
    gl.uniformMatrix4fv(U('uGi[0]'), false, packed.Gi);
    gl.uniform1fv(U('uRodK[0]'), new Float32Array(rodData.rodK));
    gl.uniform1fv(U('uRodClass[0]'), new Float32Array(rodData.rodClass));

    // ★★ THE CARRIED FRAME — the observer's handedness is the space's to take
    let eye: Vec3 = [-0.35, -0.55, 0.1];
    let camF: Vec3 = nrm3([Math.cos(1.2), Math.sin(1.2), 0]);
    let camR: Vec3 = nrm3([-Math.sin(1.2), Math.cos(1.2), 0]);
    let camU: Vec3 = [0, 0, 1];
    // the deck's raw 12-layouts by axis slot, for the JS-side walk transport
    const slotG: number[][] = [[], [], []];
    const slotGi: number[][] = [[], [], []];
    for (const entry of deck) {
      const axis = [0, 1, 2].reduce((best, a) => (Math.abs(entry.nA[a]) > Math.abs(entry.nA[best]) ? a : best), 0);
      const aFaceOnMinus = entry.nA[axis] < 0;
      slotG[axis] = aFaceOnMinus ? entry.g : entry.gi;
      slotGi[axis] = aFaceOnMinus ? entry.gi : entry.g;
    }
    let lastMove = performance.now();
    let raf = 0;
    let disposed = false;

    const transportWalk = (): void => {
      for (let guard = 0; guard < 8; guard += 1) {
        let a = -1;
        let s = 1;
        for (let k = 0; k < 3; k += 1) {
          if (eye[k] > 1) { a = k; s = 1; break; }
          if (eye[k] < -1) { a = k; s = -1; break; }
        }
        if (a < 0) break;
        const g = s > 0 ? slotGi[a] : slotG[a];
        if (!g.length) { eye[a] = Math.max(-1, Math.min(1, eye[a])); break; }
        eye = applyM(g, eye);
        camF = applyRot(g, camF);
        camR = applyRot(g, camR);
        camU = applyRot(g, camU);
        seam.doors += 1;
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
      const step = liveRef.current.pace * Math.max(0, ms) / 1000;
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
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      seam.renderFrames += 1;
      seam.eye = [...eye] as Vec3;
      seam.forward = [...camF] as Vec3;
      seam.settle = settle;
      const caption = `${deckLine} · copies shown to depth ${Math.max(0, Math.round(liveRef.current.level))}`;
      if (seam.caption !== caption) {
        seam.caption = caption;
        if (captionRef.current) captionRef.current.textContent = caption;
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
  }, [openKey, packed, rodData]);

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
      <div style={{ marginTop: 3, fontSize: 10.5, opacity: 0.55 }}>
        drag — look around · press and hold — walk forward · the hatch settles in when you stand still · esc returns to the shell
      </div>
    </div>
  );
}

// DirectorFieldRenderV0 — the living director field on the FACETED octahedron (ADR 0017, M1b-v2).
//
// The product is the PHENOMENON, not the proof: a crystalline octahedron carrying a continuous,
// animated nematic director-LIC of the RATIFIED field `n = R(α)·n₀`, where the committed `w₁`
// twist is FELT in the flow — the striations comb, twist, and return inverted across the seam
// (a continuous phase inversion, never a tear). No rings, no markers, no ghosts, no instrument on
// screen — the loop-reversal verification lives HEADLESS in scripts/diagnose-director-field-
// loop-reversal.cjs. "Experienced, not marked."
//
// DERIVE-ONLY. This DRAWS the committed field; it recomputes no w₁/gauge/director/Σ. `n₀` (the
// expensive floor) is baked by CALLING the ratified sampler `field.sampleDirector(p).n0`; the
// cheap connection modulation `α = H·θ/2` + `R(α)` is re-expressed in GLSL (prompt-sanctioned),
// reading the COMMITTED `holonomy`/`coreAxis`/`corePoint`/`cutPhase` off the ConnectionField. The
// twist is connection-carried (never from the w₁-blind Q-floor). Surface = the skin of the same
// field the interior (M2) will raymarch — the `sampleDirector` call stays factored.

import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { buildKnownSeamRenderState } from '../selectors/witnessBridge';
import { connectionFieldFromRenderState, type ConnectionField } from '../selectors/directorFieldV0';
import type { Vec3 } from '../types/geometry';

// ---------------------------------------------------------------------------
// the director-LIC shaders — noise convolved + advected ALONG the director, in WORLD space so the
// flow crosses facet edges continuously (the striations bend over the crystal edges, never tear).
// ---------------------------------------------------------------------------
const VERT = /* glsl */ `
  attribute vec3 aDir;   // baked n₀ (the committed floor), globally sign-aligned across the facets
  varying vec3 vWorldPos;
  varying vec3 vNormal;  // the FLAT face normal (⇒ faceted shading, visible edges)
  varying vec3 vDir;
  void main() {
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vDir = aDir;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uH;          // committed holonomy (1 flip / 0 control) — the modulation magnitude
  uniform vec3  uCoreAxis;   // committed seam axis dir(bd)×dir(cd)
  uniform vec3  uCorePoint;  // the (free-representative) cut position
  uniform float uCutPhase;   // the (free-representative) branch-cut azimuth
  uniform vec3  uColLo;      // striation valley
  uniform vec3  uColAligned; // striation crest where the director is aligned (α≈0)
  uniform vec3  uColReversed;// striation crest where the director is reversed (α≈π) — the felt seam
  varying vec3 vWorldPos;
  varying vec3 vNormal;
  varying vec3 vDir;

  float hash(vec3 p){ p = fract(p*0.3183099 + 0.1); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
  float noise(vec3 x){
    vec3 i = floor(x); vec3 f = fract(x); f = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x), mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x), mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y), f.z);
  }
  vec3 rodrigues(vec3 v, vec3 axis, float a){
    axis = normalize(axis); float c = cos(a), s = sin(a);
    return v*c + cross(axis,v)*s + axis*dot(axis,v)*(1.0-c);
  }

  void main(){
    vec3 N  = normalize(vNormal);
    vec3 n0 = normalize(vDir);

    // connection modulation (re-expressed in GLSL; reads committed H/axis/point/phase):
    // α = H·θ/2, θ = azimuth around the core; n = R(α)·n₀ about n₀×axis (⇒ R(π)n₀ = −n₀, continuous).
    vec3 axisN = normalize(uCoreAxis);
    vec3 refv  = abs(axisN.x) < 0.9 ? vec3(1.0,0.0,0.0) : vec3(0.0,1.0,0.0);
    vec3 fu = normalize(cross(axisN, refv));
    vec3 fv = normalize(cross(axisN, fu));
    vec3 w  = vWorldPos - uCorePoint;
    vec3 wp = w - dot(w, axisN)*axisN;
    float theta = mod(atan(dot(wp, fv), dot(wp, fu)) - uCutPhase, 6.28318530718);
    float alpha = uH * theta * 0.5;
    vec3 rotAxis = cross(n0, axisN);
    if (length(rotAxis) < 1e-4) rotAxis = cross(n0, fu);
    vec3 n = normalize(rodrigues(n0, rotAxis, alpha));

    // project the director onto the facet; the striations run ALONG it and BEND over the edges.
    vec3 t = n - dot(n, N)*N;
    float tl = length(t);
    t = (tl < 1e-3) ? normalize(cross(N, fu)) : t / tl;

    // director-LIC in WORLD space: convolve noise along t (symmetric = nematic/unsigned) and advect
    // along the director over time → flowing striations, continuous across facet edges.
    const int SAMPLES = 23;
    float lic = 0.0, wsum = 0.0;
    vec3 flow = t * (uTime * 0.16);
    for (int k = 0; k < SAMPLES; k++){
      float kk = float(k) - 11.0;
      float s = kk * 0.05;
      vec3 sp = (vWorldPos + t*s) * 6.0 - flow*6.0;
      float wk = 1.0 - abs(kk) / 12.0;
      lic += wk * noise(sp);
      wsum += wk;
    }
    lic /= wsum;
    float striate = smoothstep(0.36, 0.64, lic);

    // the FELT reversal: the crest hue shifts with the modulation phase — aligned (α≈0) reads cool,
    // reversed (α≈π) reads warm; the shift wraps once around the core = the half-turn, seen in the flow.
    float rev = (1.0 - cos(alpha)) * 0.5; // 0 aligned … 1 reversed
    vec3 crest = mix(uColAligned, uColReversed, rev);
    vec3 col = mix(uColLo, crest, striate);
    // a restrained, non-diagnostic seam glow where the orientation is most inverted
    col += smoothstep(0.86, 1.0, rev) * 0.10 * uColReversed;

    // faceted lighting (flat face normal ⇒ each facet uniformly lit; the 12 edges read as the crystal)
    vec3 L1 = normalize(vec3(0.5, 0.85, 0.6));
    vec3 L2 = normalize(vec3(-0.5, -0.2, -0.45));
    float diff = 0.34 + 0.5*max(dot(N, L1), 0.0) + 0.16*max(dot(N, L2), 0.0);
    float rim = pow(1.0 - abs(dot(N, normalize(cameraPosition - vWorldPos))), 3.0);
    col = col * diff + rim * 0.14 * crest;
    gl_FragColor = vec4(col, 1.0);
  }
`;

// ---------------------------------------------------------------------------
// build a FACETED octahedron (8 flat triangular faces, sharp edges), each face subdivided
// in-plane for a dense per-fragment director, with n₀ baked by CALLING the sampler and globally
// sign-aligned (within-face grid + cross-face shared-edge links) so the flow does not tear.
// ---------------------------------------------------------------------------
function buildFacetedOctahedron(field: ConnectionField, subdiv: number): THREE.BufferGeometry {
  const AX: Vec3[] = [
    [1, 0, 0], [-1, 0, 0],
    [0, 1, 0], [0, -1, 0],
    [0, 0, 1], [0, 0, -1],
  ];
  const nrm = (v: Vec3): Vec3 => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  // the 8 faces (one vertex from each axis pair), wound so the geometric normal points outward.
  const faces: [Vec3, Vec3, Vec3][] = [];
  for (const ix of [0, 1]) for (const iy of [0, 1]) for (const iz of [0, 1]) {
    let A = AX[ix]; let B = AX[2 + iy]; let C = AX[4 + iz];
    const centroid: Vec3 = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3, (A[2] + B[2] + C[2]) / 3];
    if (dot(nrm(cross(sub(B, A), sub(C, A))), centroid) < 0) { const tmp = B; B = C; C = tmp; }
    faces.push([A, B, C]);
  }

  const positions: number[] = [];
  const normals: number[] = [];
  const n0: Vec3[] = [];
  const posKey: string[] = [];
  const tris: number[] = [];
  const N = subdiv;
  const keyOf = (v: Vec3): string => `${Math.round(v[0] * 1e4)},${Math.round(v[1] * 1e4)},${Math.round(v[2] * 1e4)}`;

  for (const [A, B, C] of faces) {
    const fn = nrm([A[0] + B[0] + C[0], A[1] + B[1] + C[1], A[2] + B[2] + C[2]]); // outward face normal
    const idx: number[][] = [];
    for (let i = 0; i <= N; i += 1) {
      idx[i] = [];
      for (let j = 0; j <= N - i; j += 1) {
        const k = N - i - j;
        const P: Vec3 = [
          (i * A[0] + j * B[0] + k * C[0]) / N,
          (i * A[1] + j * B[1] + k * C[1]) / N,
          (i * A[2] + j * B[2] + k * C[2]) / N,
        ];
        idx[i][j] = n0.length;
        positions.push(P[0], P[1], P[2]);
        normals.push(fn[0], fn[1], fn[2]);
        n0.push(nrm(field.sampleDirector(P).n0)); // CALL the ratified sampler (bake the floor)
        posKey.push(keyOf(P));
      }
    }
    for (let i = 0; i < N; i += 1) {
      for (let j = 0; j < N - i; j += 1) {
        tris.push(idx[i][j], idx[i + 1][j], idx[i][j + 1]); // up-triangle
        if (j < N - i - 1) tris.push(idx[i + 1][j], idx[i + 1][j + 1], idx[i][j + 1]); // down-triangle
      }
    }
  }

  // global sign-alignment (nematic): adjacency = triangle edges (within-face) + shared-edge links
  // (cross-face, same world position). A residual seam only where the floor cannot be combed.
  const adj: Set<number>[] = n0.map(() => new Set<number>());
  const link = (a: number, b: number): void => { adj[a].add(b); adj[b].add(a); };
  for (let t = 0; t < tris.length; t += 3) {
    link(tris[t], tris[t + 1]); link(tris[t + 1], tris[t + 2]); link(tris[t + 2], tris[t]);
  }
  const byKey = new Map<string, number[]>();
  for (let i = 0; i < posKey.length; i += 1) {
    const list = byKey.get(posKey[i]);
    if (list) { for (const j of list) link(i, j); list.push(i); } else byKey.set(posKey[i], [i]);
  }
  const seen = new Array<boolean>(n0.length).fill(false);
  for (let start = 0; start < n0.length; start += 1) {
    if (seen[start]) continue;
    seen[start] = true;
    const q = [start];
    while (q.length) {
      const u = q.shift() as number;
      for (const v of adj[u]) {
        if (!seen[v]) {
          seen[v] = true;
          if (dot(n0[u], n0[v]) < 0) n0[v] = [-n0[v][0], -n0[v][1], -n0[v][2]];
          q.push(v);
        }
      }
    }
  }

  const dirs = new Float32Array(n0.length * 3);
  for (let i = 0; i < n0.length; i += 1) dirs.set(n0[i], i * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
  geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
  geo.setAttribute('aDir', new THREE.BufferAttribute(dirs, 3));
  geo.setIndex(tris);
  return geo;
}

function FieldBody({ field }: { field: ConnectionField }) {
  const { geometry, material } = useMemo(() => {
    const geometry = buildFacetedOctahedron(field, 28);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uH: { value: field.holonomy },
        uCoreAxis: { value: new THREE.Vector3(field.coreAxis[0], field.coreAxis[1], field.coreAxis[2]) },
        uCorePoint: { value: new THREE.Vector3(field.corePoint[0], field.corePoint[1], field.corePoint[2]) },
        uCutPhase: { value: field.cutPhase },
        uColLo: { value: new THREE.Color('#0a1230') },
        uColAligned: { value: new THREE.Color('#5eead4') }, // cool teal (aligned)
        uColReversed: { value: new THREE.Color('#c084fc') }, // warm violet (reversed) — the felt seam
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      side: THREE.DoubleSide,
    });
    return { geometry, material };
  }, [field]);
  useFrame((_, delta) => {
    material.uniforms.uTime.value += delta;
  });
  return <mesh geometry={geometry} material={material} />;
}

export function DirectorFieldRenderV0() {
  const field = useMemo(() => connectionFieldFromRenderState(buildKnownSeamRenderState()), []);
  return (
    <div className="relative h-screen w-screen bg-neutral-950 text-stone-100">
      <Canvas camera={{ position: [2.6, 1.8, 3.0], fov: 42 }}>
        <color attach="background" args={['#05050b']} />
        <FieldBody field={field} />
        <OrbitControls makeDefault enableDamping dampingFactor={0.08} enablePan enableRotate enableZoom maxDistance={40} minDistance={0.9} autoRotate autoRotateSpeed={0.35} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-3 text-[11px] font-light tracking-wide text-stone-500">
        n = R(α)·n₀ — the living w₁ director field on the octahedron
      </div>
    </div>
  );
}

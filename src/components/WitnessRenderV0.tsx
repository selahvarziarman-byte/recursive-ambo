// WitnessRenderV0 — the first VISIBLE render of the committed engine's known w₁=1 seam.
//
// A STANDALONE R3F view (its own <Canvas>, mirroring Workspace3D's patterns) of the
// `RenderState` the witnessBridge joins from the committed engine. It DRAWS, it does not
// compute: every site position, orientation colour, and the highlighted seam come from
// `buildKnownSeamRenderState()` (the committed engine, joined to F0 positions). The view never
// touches the engine math.
//
// WHAT IS ON SCREEN (the known w₁=1 intrinsic form — F0 = ambo-dissect(tetrahedron), the
// pure-X_K flip self-glue):
//   • the 6 X_K sites as spheres at their F0 positions, COLOURED BY ORIENTATION (the committed
//     flat-gauge sign): +1 sites cyan, −1 sites amber — the 2-colouring the seam splits;
//   • the SEAM (the committed U_e=−1 flip edge) drawn as a bold red tube between its two X_K
//     sites, which are haloed — this is the falsifiable known truth: site-witness {bd, cd}.
// The HUD prints the known seam ({bd, cd}, ∏U=−1) so the render can be checked by eye against
// the committed engine's reported flip edges. (The S₄-frame director axis n_site is NOT drawn
// here — senior ruling: its proper geometric rendering is the next queued piece, done right
// there, not as a non-aligned placeholder on this first falsifiable look.)

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import {
  buildKnownSeamRenderState,
  type RenderState,
  type RenderStateSite,
} from '../selectors/witnessBridge';
import type { Vec3 } from '../types/geometry';

const COLOR_ORIENT_POS = '#22d3ee'; // orientationSign +1 (cyan)
const COLOR_ORIENT_NEG = '#f59e0b'; // orientationSign −1 (amber)
const COLOR_SEAM = '#f43f5e'; // the w₁=1 flip seam (rose-red highlight)
const COLOR_SEAM_HALO = '#fb7185';

// the cylinder transform between two points (mirrors Workspace3D's DualEdgeInspectionTarget,
// using fresh clones so no source vector is mutated).
function tubeTransform(a: Vec3, b: Vec3): { position: THREE.Vector3; quaternion: THREE.Quaternion; length: number } | null {
  const start = new THREE.Vector3(a[0], a[1], a[2]);
  const end = new THREE.Vector3(b[0], b[1], b[2]);
  const direction = end.clone().sub(start);
  const length = direction.length();
  if (length < 1e-6) return null;
  return {
    position: start.clone().add(end).multiplyScalar(0.5),
    quaternion: new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize(),
    ),
    length,
  };
}

function SiteMarker({ site, isSeam }: { site: RenderStateSite; isSeam: boolean }) {
  const color = site.orientationSign > 0 ? COLOR_ORIENT_POS : COLOR_ORIENT_NEG;
  return (
    <group position={site.position}>
      {isSeam ? (
        <mesh raycast={() => null}>
          <sphereGeometry args={[0.16, 24, 16]} />
          <meshBasicMaterial color={COLOR_SEAM_HALO} opacity={0.22} transparent depthWrite={false} />
        </mesh>
      ) : null}
      <mesh>
        <sphereGeometry args={[0.092, 28, 18]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSeam ? 0.5 : 0.28}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}

function SeamEdge({ a, b }: { a: Vec3; b: Vec3 }) {
  const t = tubeTransform(a, b);
  if (!t) return null;
  return (
    <mesh position={t.position} quaternion={t.quaternion} raycast={() => null}>
      <cylinderGeometry args={[0.03, 0.03, t.length, 12, 1]} />
      <meshStandardMaterial color={COLOR_SEAM} emissive={COLOR_SEAM} emissiveIntensity={0.6} roughness={0.35} />
    </mesh>
  );
}

export function WitnessRenderV0() {
  const render = useMemo<RenderState>(() => buildKnownSeamRenderState(), []);
  const positionById = useMemo(() => {
    const m = new Map<string, Vec3>();
    for (const s of render.sites) m.set(s.siteId, s.position);
    return m;
  }, [render]);
  const seamSiteIds = useMemo(
    () => new Set(render.seamEdges.flatMap((e) => [e.a, e.b])),
    [render],
  );
  const seamKeys = useMemo(
    () =>
      render.seamEdges.map((e) => {
        const ka = render.sites.find((s) => s.siteId === e.a)?.siteKey ?? '?';
        const kb = render.sites.find((s) => s.siteId === e.b)?.siteKey ?? '?';
        return `${ka}–${kb}`;
      }),
    [render],
  );

  return (
    <div className="relative h-screen w-screen bg-neutral-950 text-stone-100">
      <Canvas camera={{ position: [3.4, 2.6, 3.8], fov: 45 }}>
        <color attach="background" args={['#0c0a09']} />
        <ambientLight intensity={0.68} />
        <directionalLight position={[4, 5, 3]} intensity={1.7} />
        <directionalLight position={[-3, -2, -4]} intensity={0.45} color="#67e8f9" />
        <gridHelper args={[6, 12, '#57534e', '#292524']} position={[0, -1.35, 0]} />

        {render.sites.map((site) => (
          <SiteMarker key={site.siteId} site={site} isSeam={seamSiteIds.has(site.siteId)} />
        ))}
        {render.seamEdges.map((edge, i) => {
          const a = positionById.get(edge.a);
          const b = positionById.get(edge.b);
          return a && b ? <SeamEdge key={`seam:${i}`} a={a} b={b} /> : null;
        })}

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          enablePan
          enableRotate
          enableZoom
          maxDistance={40}
          minDistance={0.5}
        />
      </Canvas>

      <div className="pointer-events-none absolute left-3 top-3 max-w-sm rounded border border-stone-800 bg-stone-950/85 px-3 py-2 text-xs text-stone-300 shadow-lg">
        <div className="font-semibold text-stone-100">Engine→UI witness — known w₁=1 seam</div>
        <div className="mt-1 text-stone-400">
          F0 = ambo-dissect(tetrahedron), pure-X_K flip self-glue (committed engine).
        </div>
        <div className="mt-1">
          w₁ (perCycleW1): <span className="font-mono text-rose-300">[{render.w1.join(', ')}]</span>
          {'  '}∏U ={' '}
          <span className="font-mono text-rose-300">{render.windingSign ?? 'vacuous'}</span>
        </div>
        <div>
          seam (U_e=−1 flip edge):{' '}
          <span className="font-mono text-rose-300">{seamKeys.join(', ') || '∅'}</span>{' '}
          <span className="text-stone-500">(known site-witness: bd, cd)</span>
        </div>
        <div className="mt-1 text-stone-400">
          spheres = 6 X_K sites at F0 positions, coloured by orientation (
          <span className="text-cyan-300">+1 cyan</span> /{' '}
          <span className="text-amber-300">−1 amber</span>); red tube = the highlighted seam.
        </div>
        <ul className="mt-1 space-y-0.5 font-mono text-[11px] text-stone-400">
          {render.sites.map((s) => (
            <li key={`hud:${s.siteId}`}>
              {s.siteKey} σ={s.orientationSign > 0 ? '+1' : '−1'}
              {seamSiteIds.has(s.siteId) ? <span className="text-rose-300"> ◀ seam</span> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

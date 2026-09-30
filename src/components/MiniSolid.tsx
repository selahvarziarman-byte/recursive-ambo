// ═══ THE STRIP'S SMALL SOLID — LAYOUT-1 §4 (STAMP LAYOUT-1, 2026-09-29): "a small copy of the solid with this midpoint lit
// (click another midpoint on it to go there)". The SAME meshes as the solid view (`Polyhedron` — its vertex meshes select
// through the store, so a midpoint clicked here opens its view; the selected midpoint is lit by the meshes' own selected
// emissive), the same camera rig, in a small canvas; no overlay, no buttons, no readout. Its one hint: `click a midpoint
// to go there` (§6's table). Mounted by the page only — never under a server render (the witnesses render the surface
// without it: a Canvas needs a window).

import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import { SceneCameraControls } from './SceneCameraRig';
import { Polyhedron, computeVisibleSceneBounds } from './Workspace3D';
import { useGeometryStore } from '../store/geometryStore';
import { Hint } from './HelpNote';

export function MiniSolid() {
  const shape = useGeometryStore((s) => s.shapes[s.currentShapeId]);
  const cellVisibility = useGeometryStore((s) => s.cellVisibility);
  const explodeAmount = useGeometryStore((s) => s.viewLayout.explodeAmount);
  const dualViewEnabled = useGeometryStore((s) => s.viewLayout.dualViewEnabled);
  const isolateSelectedCell = useGeometryStore((s) => s.viewLayout.isolateSelectedCell);
  const selectedCellId = useGeometryStore((s) => s.selectedCellId);
  const hoverTarget = useGeometryStore((s) => s.hoverTarget);
  const setHoverTarget = useGeometryStore((s) => s.setHoverTarget);
  const sceneBounds = useMemo(() => computeVisibleSceneBounds(shape, cellVisibility, explodeAmount, dualViewEnabled), [shape, cellVisibility, explodeAmount, dualViewEnabled]);
  return (
    <Hint text="click a midpoint to go there">
      <div data-midpoint-minimap="true" className="h-28 w-40 overflow-hidden rounded border border-stone-800 bg-neutral-950">
        <Canvas camera={{ position: [3.2, 2.4, 3.8], fov: 45 }} onPointerMissed={() => setHoverTarget(null)}>
          <color attach="background" args={['#0c0a09']} />
          <ambientLight intensity={0.62} />
          <directionalLight position={[4, 5, 3]} intensity={1.7} />
          <directionalLight position={[-3, -2, -4]} intensity={0.45} color="#67e8f9" />
          <Polyhedron
            shape={shape}
            cellVisibility={cellVisibility}
            explodeAmount={explodeAmount}
            dualViewEnabled={dualViewEnabled}
            isolateSelectedCell={isolateSelectedCell}
            selectedCellId={selectedCellId}
            hoverTarget={hoverTarget}
            onHoverTarget={setHoverTarget}
          />
          <SceneCameraControls sceneBounds={sceneBounds} selectedSceneBounds={null} fitViewRequest={1} fitSelectedRequest={0} resetCameraRequest={0} />
        </Canvas>
      </div>
    </Hint>
  );
}

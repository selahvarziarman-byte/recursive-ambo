// ═══ THE AMBO PAGE — LAYOUT-1 §2 (STAMP LAYOUT-1, 2026-09-29; the designer's spec, Arman's word 19:31/19:51): TWO VIEWS.
// The SOLID VIEW (the making column · the solid · the rail of drawers — AmboSolidView, LAYOUT-1 §3) and the MIDPOINT VIEW, which
// takes the solid view's place when a midpoint is selected — its point on the solid or its row in a drawer — and gives it back
// on × or Esc. The header (Ambo Universe ⇄ Manuscript) is the shell's and stays in both.
// Esc closes one thing at a time, smallest first: a ? note, then a drawer, then a light, then the midpoint (each holder
// listens in the capture phase and stops the key when it took it).
//
// A selected CORNER keeps the solid view (its cast drawn over the solid, as before); a selected midpoint whose parents both
// hold a space opens the midpoint view — the same test the canvas's ConceptSurface made (one code path, two sites).

import { useMemo } from 'react';
import { AmboSolidView } from './components/AmboSolidView';
import { MidpointView, midpointViewOf } from './components/MidpointSurface';
import { MiniSolid } from './components/MiniSolid';
import { useGeometryStore } from './store/geometryStore';

export default function App() {
  const shape = useGeometryStore((s) => s.shapes[s.currentShapeId]);
  const selectedVertexId = useGeometryStore((s) => s.selectedVertexId);
  const tauDrafts = useGeometryStore((s) => s.edgeTauDrafts);
  const view = useMemo(() => (selectedVertexId ? midpointViewOf(shape, selectedVertexId, { tauDrafts }) : null), [shape, selectedVertexId, tauDrafts]);
  return (
    // P1a-craft: header-less module — the shared shell bar carries the title;
    // App fills its container (the shell's content area).
    <div data-ambo-page={view ? 'midpoint' : 'solid'} className="h-full overflow-hidden bg-stone-950 text-stone-100">
      {view ? <MidpointView view={view} minimap={<MiniSolid />} /> : <AmboSolidView />}
    </div>
  );
}

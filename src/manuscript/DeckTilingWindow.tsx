// B-104 — RUNG 2's WINDOW: the deck-tiling drawn in the conformal model of
// its curvature (Poincaré disk / plane / stereographic plate). A 2D canvas
// overlay in the ink idiom.
// B-105 (ADR 0025 §7, the B-104 amendment — ratified): THE WINDOW STOPS
// NARRATING THE PHENOMENON. The ring mark, the vertex-count caption, the
// angle-sum arithmetic, the rim-infinity sentence, the pole-exterior
// sentence and the descent prose are OUT — `{p,q}`, the count and the
// descent check DEMOTE TO THE RECORD (the specimen card's business). The
// window NAMES what it is (the geometry and its model — a label, not a
// claim about what he will see) and SHOWS what the cells do: repeat
// unchanged · crowd and shrink toward a rim that never arrives · close into
// finitely many cells with the far side showing through. §7.1: the visible
// mark of a DESCENT is the INHABITANT — the chiral coil drawn in one cell,
// its computed antipodal image in the partner (far side faint); the LAW-24
// control is the plain cube's single image. The LOD line stays — it is the
// DRAWING's own honesty about itself (ADR §5: the mark stops, never
// degrades), not a narration of the phenomenon.
import { useEffect, useRef } from 'react';
import type { DeckTiling } from './deckTilingModel';

const GEOMETRY_WORD: Record<DeckTiling['geometry'], string> = {
  spherical: 'spherical — a stereographic plate',
  euclidean: 'euclidean — the plane',
  hyperbolic: 'hyperbolic — the Poincaré disk',
};

export function DeckTilingWindow({
  tiling,
  title,
  paper,
  accent,
  onClose,
}: {
  tiling: DeckTiling;
  title: string;
  paper: { cardBackground: string; cardBorder: string; cardInk: string };
  accent: string;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const SIZE = 440;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, SIZE, SIZE);

    // the fit: hyperbolic is the unit disk; the others fit their drawn
    // extent — INCLUDING the inhabitant's images (the doubled mark may sit
    // in the exterior cell, and a mark off-canvas is a mark that was not
    // shown)
    const half = SIZE / 2;
    let scale: number;
    if (tiling.geometry === 'hyperbolic') {
      scale = half - 14;
    } else {
      let extent = 0;
      for (const cell of tiling.cells) {
        if (cell.exterior) continue;
        for (const [x, y] of cell.corners) extent = Math.max(extent, Math.abs(x), Math.abs(y));
      }
      for (const image of tiling.inhabitant?.images ?? []) {
        for (const [x, y] of image.outline) extent = Math.max(extent, Math.abs(x), Math.abs(y));
      }
      scale = (half - 18) / Math.max(extent, 1e-6);
    }
    const X = (p: readonly [number, number]): [number, number] => [half + p[0] * scale, half - p[1] * scale];

    const drawCell = (cellIndex: number): void => {
      const cell = tiling.cells[cellIndex];
      if (cell.exterior || cell.outline.length === 0) return;
      const faint = cell.farSide === true;
      ctx.beginPath();
      const [x0, y0] = X(cell.outline[0]);
      ctx.moveTo(x0, y0);
      for (let i = 1; i < cell.outline.length; i += 1) {
        const [x, y] = X(cell.outline[i]);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      if (cell.depth === 0 && tiling.geometry !== 'spherical') {
        ctx.fillStyle = paper.cardInk + '14';
        ctx.fill();
      }
      ctx.strokeStyle = faint ? paper.cardInk + '55' : paper.cardInk;
      ctx.lineWidth = faint ? 0.7 : cell.depth === 0 ? 1.4 : 0.9;
      ctx.stroke();
    };

    // the far side first — it shows THROUGH; the near side draws over it
    tiling.cells.forEach((cell, k) => {
      if (cell.farSide) drawCell(k);
    });
    tiling.cells.forEach((cell, k) => {
      if (!cell.farSide) drawCell(k);
    });

    // the rim — INFINITY, addressed as a horizon, never a wall (drawn, not
    // narrated)
    if (tiling.rim) {
      ctx.beginPath();
      ctx.setLineDash([3, 5]);
      ctx.arc(half, half, scale, 0, 2 * Math.PI);
      ctx.strokeStyle = paper.cardInk + '66';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // ADR §7.1 — THE INHABITANT: the chiral coil, drawn last (the mark rides
    // the tiling). One image = no identification; the antipodal double =
    // the descent, SHOWN — the far-side image wears the faint register.
    for (const image of tiling.inhabitant?.images ?? []) {
      if (image.outline.length < 2) continue;
      ctx.beginPath();
      const [ix0, iy0] = X(image.outline[0]);
      ctx.moveTo(ix0, iy0);
      for (let i = 1; i < image.outline.length; i += 1) {
        const [x, y] = X(image.outline[i]);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = image.farSide ? accent + '88' : accent;
      ctx.lineWidth = image.farSide ? 1.2 : 1.9;
      ctx.stroke();
    }
  }, [tiling, paper, accent]);

  return (
    <div
      data-deck-tiling-window
      style={{
        position: 'absolute',
        left: '50%',
        top: 54,
        transform: 'translateX(-50%)',
        width: SIZE + 26,
        padding: '11px 13px 13px',
        borderRadius: 3,
        background: paper.cardBackground,
        border: `1px solid ${paper.cardBorder}`,
        boxShadow: '0 3px 12px rgba(58, 51, 38, 0.28)',
        color: paper.cardInk,
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 12.5,
        lineHeight: 1.45,
        zIndex: 30,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <span style={{ fontSize: 11, letterSpacing: 1.2, opacity: 0.6, fontVariant: 'small-caps' }}>
            the deck-tiling
          </span>
          <span style={{ fontWeight: 700, marginLeft: 8 }}>{title}</span>
        </div>
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            onClose();
          }}
          style={{
            border: 'none',
            background: 'transparent',
            color: paper.cardInk,
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          ×
        </button>
      </div>
      {/* the NAME — the geometry and its model, a label (ADR §7's surviving
          words: the existing line minus the {p,q} symbol, which is the
          record's now) */}
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: 0.75 }}>
        {GEOMETRY_WORD[tiling.geometry]}
      </div>
      <canvas ref={canvasRef} style={{ width: SIZE, height: SIZE, marginTop: 6 }} />
      {tiling.dropped > 0 ? (
        <div data-tiling-lod style={{ marginTop: 4, fontSize: 11, opacity: 0.6 }}>
          {`${tiling.dropped} cells below the floor — dropped, never drawn wrong`}
        </div>
      ) : null}
    </div>
  );
}

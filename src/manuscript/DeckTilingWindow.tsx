// B-104 — RUNG 2's WINDOW: the deck-tiling drawn in the conformal model of
// its curvature (Poincaré disk / plane / stereographic plate). A 2D canvas
// overlay in the ink idiom — the conformal models are drawings, and the
// countable captions are the ADR's own: q is a COUNT the eye checks (ring
// the vertex, count the cells); the verdict words are the ADR table's
// (GAP — it must close up · CLOSES EXACTLY · OVERLAP — it must ruffle open);
// the rim is INFINITY, addressed never walled; the far side SHOWS THROUGH
// the stereographic plate, drawn faint (the ink stack's own layering law in
// its 2D register); a DESCENT-checked identification is marked cell-to-cell.
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

    // the fit: hyperbolic is the unit disk; the others fit their drawn extent
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
      scale = (half - 18) / Math.max(extent, 1e-6);
    }
    const X = (p: readonly [number, number]): [number, number] => [half + p[0] * scale, half - p[1] * scale];

    const ringSet = new Set(tiling.ring?.cellIndices ?? []);
    // descent registers: pair index per cell (marked identifications)
    const pairOf = new Map<number, number>();
    tiling.descent?.pairs.forEach(([a, b], k) => {
      pairOf.set(a, k);
      pairOf.set(b, k);
    });
    const descentInks = ['#2f6b6b', '#963c2c', '#5e2a63', '#6b6247'];

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
      const pairIndex = pairOf.get(cellIndex);
      if (pairIndex !== undefined) {
        ctx.fillStyle = descentInks[pairIndex % descentInks.length] + (faint ? '22' : '3a');
        ctx.fill();
      } else if (ringSet.has(cellIndex)) {
        ctx.fillStyle = accent + '2e';
        ctx.fill();
      } else if (cell.depth === 0 && tiling.geometry !== 'spherical') {
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

    // the rim — INFINITY, addressed as a horizon, never a wall
    if (tiling.rim) {
      ctx.beginPath();
      ctx.setLineDash([3, 5]);
      ctx.arc(half, half, scale, 0, 2 * Math.PI);
      ctx.strokeStyle = paper.cardInk + '66';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // the countable vertex: the ring mark
    if (tiling.ring) {
      const [rx, ry] = X(tiling.ring.at);
      ctx.beginPath();
      ctx.arc(rx, ry, 4.5, 0, 2 * Math.PI);
      ctx.fillStyle = accent;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(rx, ry, 9, 0, 2 * Math.PI);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }, [tiling, paper, accent]);

  const gap = 360 - tiling.angleSumDeg;
  const verdict =
    gap > 1e-9
      ? `a ${gap}° GAP — it must close up`
      : gap < -1e-9
        ? `a ${-gap}° OVERLAP — it must ruffle open`
        : 'CLOSES EXACTLY — it stays flat';
  const q = tiling.q;
  const ringCount = tiling.ring?.cellIndices.length ?? null;

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
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: 0.75 }}>
        {`{${tiling.p},${tiling.q}} · ${GEOMETRY_WORD[tiling.geometry]}`}
      </div>
      <canvas ref={canvasRef} style={{ width: SIZE, height: SIZE, marginTop: 6 }} />
      <div data-tiling-captions style={{ marginTop: 4 }}>
        <div>
          {`${q} flat ${tiling.p}-gons at a vertex: ${q} × ${tiling.flatCornerDeg}° = ${tiling.angleSumDeg}° — ${verdict}`}
        </div>
        <div style={{ color: accent }}>
          {`ring the marked vertex — count the cells: ${ringCount ?? '—'}`}
        </div>
        {tiling.rim ? (
          <div style={{ fontStyle: 'italic', opacity: 0.75 }}>
            the boundary circle is INFINITY — the cells shrink toward it and never reach it
          </div>
        ) : null}
        {tiling.cells.some((c) => c.exterior) ? (
          <div style={{ fontStyle: 'italic', opacity: 0.75 }}>
            the pole cell is the whole EXTERIOR of the plate — its edges are the outermost arcs
          </div>
        ) : null}
        {tiling.descent ? (
          <div style={{ fontStyle: 'italic', opacity: 0.85 }}>
            {`the antipodal map is a symmetry of this tiling — CHECKED, and it is free: the tiling DESCENDS. ${tiling.descent.pairs.length} cell pair${tiling.descent.pairs.length === 1 ? '' : 's'} identified — each ink is one pair; the local picture is unchanged`}
          </div>
        ) : null}
        {tiling.dropped > 0 ? (
          <div style={{ fontSize: 11, opacity: 0.6 }}>
            {`${tiling.dropped} cells below the floor — dropped, never drawn wrong`}
          </div>
        ) : null}
      </div>
    </div>
  );
}

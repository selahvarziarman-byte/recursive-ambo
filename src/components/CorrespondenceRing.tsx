// CorrespondenceRing — M2, THE CALLOUT RING (SEAL_THE_MARKED_SPECIMEN — THE
// CARD'S CLOSE). The successor of CorrespondenceMarkLayer's on-figure marks
// (the D2 heap, superseded whole): the KEY lives in the PAGE MARGIN now.
//
//   · L1 — NOTHING lettered inside the silhouette: every key label sits on a
//     margin RING around the figure's projected extent (the figure stays a
//     drawing; body-intrinsic marks — deficit wedge, seam letters — are not
//     this layer's and may still scale with the body).
//   · L2 — the ring is ordered by the ANGULAR BEARING of each entity's
//     projected anchor, and each label holds ITS OWN bearing — every leader
//     lies on its own ray from the figure's centre, so leaders are
//     NON-CROSSING BY CONSTRUCTION. Angularly-coincident anchors STACK
//     RADIALLY OUTWARD (never re-order; the stack walks the label's own ray).
//   · L3 — the type is PAGE-FIXED (RING_FONT_PX — a reading size that never
//     scales with the figure or the camera), and the margin is RESERVED
//     BEFORE the figure is sized: the specimen fit reserves the ring band
//     via SPECIMEN_FIT_MARGIN (exported from HERE — the view's camera fit
//     and this ring read the ONE constant; the fit sizes the figure into
//     the remainder).
//   · L4 — the ring holds ALL entities, RECESSED by default (weight + hue —
//     the D2b recession, never opacity); at most the emphasized ~3 PROMOTE
//     (bidirectional — the same emphasizedIds channel); a LEADER on EVERY
//     mark, pointing at the drawn place.
//   · ⛔ HALO ON THE EMPHASIS STATE ONLY — a recessed ring mark carries NO
//     paper halo (the 18-halo heap erased the specimen); only the promoted
//     wear the 1h unhatched-paper suppressor.
//
// The marks are DOM (one screen-space overlay via drei Html pinned at the
// canvas origin), pointer-inert throughout; positions ride per-frame
// imperative writes (the D2 CSS-var precedent — no React churn per frame).
// Every world-side decoration is raycast-inert (the D2 doctrine: a
// decoration must never steal a hover from D1's pick layer).

import { useMemo, useRef } from 'react';
import { Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Vec3 } from '../types/geometry';

export interface CorrespondenceMarkRow {
  id: string; // the live resultId (D1's one id-space — matched ===, never re-resolved)
  label: string; // the packet's real name / the relation letter (the card's own)
  kind: 'concept' | 'relation';
}

export interface CorrespondenceComposedMark {
  id: string; // the recorded coarse id (the row's value)
  label: string;
  pathIds: string[]; // the drawn place — live part ids (points, never mints)
}

// the seam's ring half (the dev test-seam pattern): what the app-path
// witnesses read — label boxes, anchors, promotion, halo presence, and the
// figure's projected disc for the L1/L2 assertions
export interface CorrespondenceRingSeamMark {
  id: string;
  kind: 'concept' | 'relation' | 'composed';
  labelX: number;
  labelY: number;
  labelW: number;
  labelH: number;
  anchorX: number;
  anchorY: number;
  promoted: boolean;
  halo: boolean;
}

// L3 — THE ONE RESERVATION CONSTANT: the specimen fit margin. The view's
// camera fit (SceneCameraControls fitMargin) imports THIS value, so the
// margin band exists BEFORE the figure is sized — the ring then lays its
// labels into the reserved band. 1.8 = the Phase-A plate margin (the
// specimen sits at a legible fraction; the band is the remainder).
export const SPECIMEN_FIT_MARGIN = 1.8;
// L3 — the key's PAGE-FIXED reading size (px). Never scales with the figure,
// the camera, or the census — the card's own reading register.
export const RING_FONT_PX = 12.5;
// the gap between the figure's projected extent and the label ring
export const RING_GAP_PX = 30;
// M3-CLEANUP-1 (designer 1852): the radial step for angularly-coincident
// (stacked) labels is 1.5 × CAP-HEIGHT (capPx = 4h) — the fixed 22px step
// let co-bearing labels fuse into a fabricated name (`A·D`/`AD` read as
// `A·DAD`); a half-cap of clear paper now rides between stacked labels.
// Derived per instance from h inside the component — no bare literal.

export function CorrespondenceRing({
  anchors,
  segments,
  figurePoints,
  concepts,
  relations,
  composed,
  h = 9,
  ink,
  faintInk,
  paperColor,
  emphasizedIds,
}: {
  // THE RING ANCHOR RESOLVER (SEAL_THE_RING_ANCHOR_RESOLVER): the ring no
  // longer resolves geometry itself — the TOTAL resolver hands it per-row
  // anchors (any mode that renders), endpoint segments (the world-side
  // emphasis), and the drawn body's own figure points (the L1 silhouette
  // bound — on an immersion the class points alone under-bound the body).
  anchors: ReadonlyMap<string, Vec3>;
  segments: ReadonlyMap<string, readonly [Vec3, Vec3]>;
  figurePoints: readonly Vec3[];
  concepts: CorrespondenceMarkRow[];
  relations: CorrespondenceMarkRow[];
  composed: CorrespondenceComposedMark[];
  // the halo module's unit (= the hatch legible band, bandPx): the promoted
  // mark's paper suppressor is 1h of paper beneath the glyph (the ratified
  // D2 halo law — now worn by the EMPHASIS STATE ONLY)
  h?: number;
  ink: string; // the specimen register's own ink (promoted marks + leaders)
  faintInk: string; // the recessed HUE (weight+hue recession — never opacity)
  paperColor: string; // the promoted halo's paper
  emphasizedIds: readonly string[];
}) {
  const haloPx = 1 * h;
  // M3-CLEANUP-1 — the co-bearing radial step: 1.5 × cap-height (capPx = 4h,
  // the D2 key's ratified cap unit), so stacked labels wear a half-cap of
  // clear paper and read as TWO labels, never a fused string
  const capPx = 4 * h;
  const ringStackPx = 1.5 * capPx;

  // ---- the marks: every card row the resolver anchored (a row it could
  // not place was DECLARED in `unplaced` — the card speaks it, never a
  // silent drop here) ----
  const marks = useMemo(() => {
    const all: { id: string; kind: 'concept' | 'relation' | 'composed'; label: string; anchor: Vec3 }[] = [];
    for (const row of concepts) {
      const anchor = anchors.get(row.id);
      if (anchor) all.push({ id: row.id, kind: 'concept', label: row.label, anchor });
    }
    for (const row of relations) {
      const anchor = anchors.get(row.id);
      if (anchor) all.push({ id: row.id, kind: 'relation', label: row.label, anchor });
    }
    for (const row of composed) {
      const anchor = anchors.get(row.id);
      if (anchor) all.push({ id: row.id, kind: 'composed', label: row.label, anchor });
    }
    return all;
  }, [concepts, relations, composed, anchors]);

  const emphasized = (id: string): boolean => emphasizedIds.includes(id);

  // ---- the per-frame layout: project → bearing-order → ring + leaders ----
  const groupRef = useRef<THREE.Group>(null);
  const markRefs = useRef(new Map<string, HTMLDivElement>());
  const leaderRefs = useRef(new Map<string, SVGLineElement>());
  const overlayRef = useRef<HTMLDivElement>(null);
  useFrame(({ camera, size }) => {
    const group = groupRef.current;
    if (!group) return;
    const v = new THREE.Vector3();
    const toScreen = (p: Vec3): { x: number; y: number; on: boolean } => {
      v.set(p[0], p[1], p[2]);
      group.localToWorld(v);
      v.project(camera);
      return {
        x: ((v.x + 1) / 2) * size.width,
        y: ((1 - v.y) / 2) * size.height,
        on: Math.abs(v.x) <= 1.2 && Math.abs(v.y) <= 1.2 && v.z >= -1 && v.z <= 1,
      };
    };
    // the FIGURE's projected disc: centre + max radius over the DRAWN
    // body's own points (the resolver's figurePoints — the vertex hull on a
    // shape mode, the immersion grid's surface points on an immersion; the
    // L1 reference the labels stay outside of)
    let cx = 0;
    let cy = 0;
    const projected = figurePoints.map((p) => toScreen(p));
    for (const p of projected) {
      cx += p.x / projected.length;
      cy += p.y / projected.length;
    }
    let figureR = 0;
    for (const p of projected) figureR = Math.max(figureR, Math.hypot(p.x - cx, p.y - cy));
    const ringR = figureR + RING_GAP_PX;
    // bearings + the L2 stack: sorted by bearing, coincident neighbours step
    // OUTWARD along their own ray (never re-ordered). (The wrap-around pair
    // across ±π is left unstacked — bearings there differ by ~2π in sort
    // space; acceptable for the drawn censuses.)
    const placed = marks
      .map((mark) => {
        const a = toScreen(mark.anchor);
        return { mark, a, bearing: Math.atan2(a.y - cy, a.x - cx) };
      })
      .sort((p, q) => (p.bearing === q.bearing ? (p.mark.id < q.mark.id ? -1 : 1) : p.bearing - q.bearing));
    const seamMarks: CorrespondenceRingSeamMark[] = [];
    let lastBearing = Number.NEGATIVE_INFINITY;
    let lastLevel = 0;
    for (const p of placed) {
      const el = markRefs.current.get(p.mark.id);
      const line = leaderRefs.current.get(p.mark.id);
      if (!el || !line) continue;
      const labelW = el.offsetWidth;
      const labelH = el.offsetHeight;
      const minSepRad = (labelH + 6) / ringR;
      const level = p.bearing - lastBearing < minSepRad ? lastLevel + 1 : 0;
      lastBearing = p.bearing;
      lastLevel = level;
      const dirx = Math.cos(p.bearing);
      const diry = Math.sin(p.bearing);
      // L1 — the label box's INNER EDGE must clear the ring radius, not its
      // centre: shift the box outward by its own half-extent along its ray
      // (a wide concept word must never lean back into the figure)
      const rayHalf = Math.min(
        Math.abs(dirx) > 1e-6 ? labelW / 2 / Math.abs(dirx) : Number.POSITIVE_INFINITY,
        Math.abs(diry) > 1e-6 ? labelH / 2 / Math.abs(diry) : Number.POSITIVE_INFINITY,
      );
      const r = ringR + level * ringStackPx + rayHalf + 2;
      const lx = cx + r * dirx;
      const ly = cy + r * diry;
      el.style.display = p.a.on ? '' : 'none';
      line.style.display = p.a.on ? '' : 'none';
      el.style.transform = `translate(${lx.toFixed(1)}px, ${ly.toFixed(1)}px) translate(-50%, -50%)`;
      // the leader stops at the label box's edge (the box radius along the
      // anchor→label direction), so the line points and the word sits
      let dx = lx - p.a.x;
      let dy = ly - p.a.y;
      const len = Math.hypot(dx, dy);
      if (len > 1e-6) {
        dx /= len;
        dy /= len;
      }
      const halfAlong = Math.min(
        Math.abs(dx) > 1e-6 ? labelW / 2 / Math.abs(dx) : Number.POSITIVE_INFINITY,
        Math.abs(dy) > 1e-6 ? labelH / 2 / Math.abs(dy) : Number.POSITIVE_INFINITY,
      );
      line.setAttribute('x1', p.a.x.toFixed(1));
      line.setAttribute('y1', p.a.y.toFixed(1));
      line.setAttribute('x2', (lx - dx * (halfAlong + 2)).toFixed(1));
      line.setAttribute('y2', (ly - dy * (halfAlong + 2)).toFixed(1));
      seamMarks.push({
        id: p.mark.id,
        kind: p.mark.kind,
        labelX: lx,
        labelY: ly,
        labelW,
        labelH,
        anchorX: p.a.x,
        anchorY: p.a.y,
        promoted: emphasized(p.mark.id),
        halo: emphasized(p.mark.id),
      });
    }
    if (overlayRef.current) {
      overlayRef.current.style.width = `${size.width}px`;
      overlayRef.current.style.height = `${size.height}px`;
    }
    const host = window as unknown as {
      __manuscriptCorrespondence?: { ring?: CorrespondenceRingSeamMark[]; figure?: { cx: number; cy: number; radiusPx: number } };
    };
    const seam = host.__manuscriptCorrespondence ?? (host.__manuscriptCorrespondence = {});
    seam.ring = seamMarks;
    seam.figure = { cx, cy, radiusPx: figureR };
  });

  // ---- the styles: recessed default · promoted ≤3 (halo on emphasis ONLY) ----
  const glyphStyle = (id: string, kind: 'concept' | 'relation' | 'composed'): React.CSSProperties => {
    const lit = emphasized(id);
    return {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: RING_FONT_PX, // L3 — page-fixed, never shrunk
      lineHeight: 1,
      whiteSpace: 'nowrap',
      color: lit ? ink : faintInk, // recession by HUE…
      fontWeight: lit ? 700 : 300, // …and WEIGHT — never opacity
      fontStyle: kind === 'concept' ? 'normal' : 'italic', // the relation letter leans
      // ⛔ THE HALO — EMPHASIS STATE ONLY: the promoted mark sits on 1h of
      // paper (the hatch suppressor); a recessed mark carries NO halo (the
      // 18-halo heap is deleted)
      ...(lit
        ? { background: paperColor, padding: `${haloPx}px ${haloPx + 2}px`, borderRadius: haloPx * 2 }
        : {}),
      pointerEvents: 'none' as const,
    };
  };

  return (
    <group name="correspondence-ring" ref={groupRef}>
      {/* the ONE screen-space overlay: pinned at the canvas origin; labels +
          leaders live in page coordinates (the margin is a PAGE fact) */}
      <Html
        calculatePosition={() => [0, 0]}
        zIndexRange={[30, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          ref={overlayRef}
          style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}
        >
          <svg
            width="100%"
            height="100%"
            style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}
          >
            {marks.map((mark) => (
              // the LEADER — on EVERY mark (L4): the specimen register's own
              // ink; recessed leaders hairline in the faint hue, promoted
              // heavier in the full ink. Solid always (no dash — the crossing
              // register owns the broken line; no opacity).
              <line
                key={mark.id}
                ref={(el) => {
                  if (el) leaderRefs.current.set(mark.id, el);
                  else leaderRefs.current.delete(mark.id);
                }}
                stroke={emphasized(mark.id) ? ink : faintInk}
                strokeWidth={emphasized(mark.id) ? 1.6 : 0.8}
              />
            ))}
          </svg>
          {marks.map((mark) => (
            <div
              key={mark.id}
              className="corr-mark"
              data-mark-id={mark.id}
              data-mark-kind={mark.kind}
              ref={(el) => {
                if (el) markRefs.current.set(mark.id, el);
                else markRefs.current.delete(mark.id);
              }}
              style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
            >
              <span className="corr-halo" style={glyphStyle(mark.id, mark.kind)}>
                {mark.label}
              </span>
            </div>
          ))}
        </div>
      </Html>
      {/* the WORLD half of the emphasis — the entity itself lights on the
          body (body-intrinsic, not lettering). Raycast-INERT (the D2
          doctrine: decorations never steal D1's hover). The resolver's
          segments/anchors carry the drawn places; a degenerate segment (a
          glued class whose endpoints image to one point) draws nothing. */}
      {relations
        .filter((row) => emphasized(row.id))
        .map((row) => {
          const segment = segments.get(row.id);
          if (!segment) return null;
          const [a, b] = segment;
          const degenerate =
            Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < 1e-6;
          return degenerate ? null : (
            <Line key={`emph:${row.id}`} points={[[...a], [...b]]} color={ink} lineWidth={3} raycast={() => null} />
          );
        })}
      {concepts
        .filter((row) => emphasized(row.id))
        .map((row) => {
          const anchor = anchors.get(row.id);
          return anchor ? (
            <mesh key={`emph:${row.id}`} position={anchor} raycast={() => null}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshBasicMaterial color={ink} />
            </mesh>
          ) : null;
        })}
    </group>
  );
}

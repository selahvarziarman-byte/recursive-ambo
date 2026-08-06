// CorrespondenceMarkLayer — D2, THE CORRESPONDENCE MARKS (THE CARD'S CLOSE;
// SEAL_D2_CORRESPONDENCE_MARKS). The VISIBLE half over D1's invisible engine:
//
//   · CONCEPT → the packet's real WORD (`row.label` — the identity law) at
//     its vertex; RELATION → the LETTER at the edge midpoint, offset 1.5h px
//     perpendicular OUTBOARD on screen (a per-frame projected direction via
//     CSS vars — px-true at any camera); COMPOSED → the letter held farther
//     outboard with a LEADER LINE to the drawn place (the path's own
//     midpoint vertex — POINTS, never mints a position).
//   · THE KEY RESOLVES VIA h (= the hatch band, 9): relation letter
//     cap-height 4h · concept word = the letter (peers) · offset 1.5h ·
//     ⛔ the 1h UNHATCHED HALO beneath every glyph — a PAPER SUPPRESSOR
//     (the hatch ground is covered by paper under the glyph, not merely
//     out-contrasted) · leader weight < cell-edge, > hatch, the specimen
//     register's own ink.
//   · PERSISTENT — mounts with the SELECTED specimen (never hover-only).
//     TWO-REGISTER — the caller mounts it for the specimen only; the world
//     stays unlettered.
//   · THE EMPHASIS (D2b): everything reads `emphasizedIds` — emphasized
//     marks go full weight on their halo; when an emphasis is active the
//     rest RECEDE BY WEIGHT + HUE, never opacity (the hatch owns the
//     low-contrast band); emphasized entities additionally light in the
//     world (an overlay Line on an edge, a ring on a vertex).
//
// The marks are `pointerEvents: none` throughout — D1's invisible pick layer
// beneath keeps owning hover/pick, and orbit/sheet gestures pass through.

import { useMemo, useRef } from 'react';
import { Html, Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Shape, Vec3 } from '../types/geometry';

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

const mid3 = (a: Vec3, b: Vec3): Vec3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];

export function CorrespondenceMarkLayer({
  shape,
  concepts,
  relations,
  composed,
  h = 9,
  ink,
  faintInk,
  paperColor,
  emphasizedIds,
}: {
  shape: Shape;
  concepts: CorrespondenceMarkRow[];
  relations: CorrespondenceMarkRow[];
  composed: CorrespondenceComposedMark[];
  // the D2 key's module: h = the hatch legible band (bandPx) — every px
  // value below derives from it (the seal's resolution, never bare literals)
  h?: number;
  ink: string; // the specimen register's own ink
  faintInk: string; // the recessed HUE (weight+hue recession — never opacity)
  paperColor: string; // the halo's paper (the hatch suppressor)
  emphasizedIds: readonly string[];
}) {
  const capPx = 4 * h; // relation letter cap-height (the concept word is its peer)
  const offsetPx = 1.5 * h; // the outboard offset
  const haloPx = 1 * h; // the unhatched-paper halo beneath every glyph
  const fontPx = Math.round(capPx / 0.7); // Georgia cap-height ≈ 0.7em

  const centroid = useMemo<Vec3>(() => {
    const ids = Object.keys(shape.vertices);
    const c: Vec3 = [0, 0, 0];
    for (const id of ids) {
      const p = shape.vertices[id].position;
      c[0] += p[0] / ids.length;
      c[1] += p[1] / ids.length;
      c[2] += p[2] / ids.length;
    }
    return c;
  }, [shape]);

  const conceptMarks = useMemo(
    () =>
      concepts.flatMap((row) => {
        const v = shape.vertices[row.id];
        return v ? [{ ...row, position: v.position }] : [];
      }),
    [concepts, shape],
  );
  const relationMarks = useMemo(
    () =>
      relations.flatMap((row) => {
        const edge = shape.edges.find((e) => e.id === row.id);
        if (!edge) return [];
        const a = shape.vertices[edge.vertexIds[0]]?.position;
        const b = shape.vertices[edge.vertexIds[1]]?.position;
        if (!a || !b) return [];
        const mid = mid3(a, b);
        const out: Vec3 = [mid[0] - centroid[0], mid[1] - centroid[1], mid[2] - centroid[2]];
        const len = Math.hypot(out[0], out[1], out[2]);
        const outboard: Vec3 = len > 1e-9 ? [out[0] / len, out[1] / len, out[2] / len] : [0, 1, 0];
        return [{ ...row, position: mid, outboard }];
      }),
    [relations, shape, centroid],
  );
  const composedMarks = useMemo(
    () =>
      composed.flatMap((row) => {
        // the drawn place: the path's own midpoint vertex (the live parts'
        // shared endpoint) — POINTED at, never minted
        const parts = row.pathIds
          .map((p) => shape.edges.find((e) => e.id === p))
          .filter((e): e is NonNullable<typeof e> => Boolean(e));
        if (parts.length === 0) return [];
        const counts = new Map<string, number>();
        for (const e of parts) for (const vid of e.vertexIds) counts.set(vid, (counts.get(vid) ?? 0) + 1);
        const sharedId = [...counts.entries()].find(([, n]) => n >= 2)?.[0] ?? parts[0].vertexIds[0];
        const place = shape.vertices[sharedId]?.position;
        if (!place) return [];
        const out: Vec3 = [place[0] - centroid[0], place[1] - centroid[1], place[2] - centroid[2]];
        const len = Math.hypot(out[0], out[1], out[2]);
        const outboard: Vec3 = len > 1e-9 ? [out[0] / len, out[1] / len, out[2] / len] : [0, 1, 0];
        // the letter holds off the body (a world offset so the leader has a
        // visible run back to the place it points at)
        const anchor: Vec3 = [
          place[0] + outboard[0] * 0.55,
          place[1] + outboard[1] * 0.55,
          place[2] + outboard[2] * 0.55,
        ];
        return [{ ...row, place, anchor }];
      }),
    [composed, shape, centroid],
  );

  // the per-frame OUTBOARD → SCREEN direction for the relation letters (two
  // world points project → a normalized screen delta → CSS vars; the px
  // offset stays exact at any camera)
  const relationRefs = useRef(new Map<string, HTMLDivElement>());
  useFrame(({ camera, size }) => {
    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    for (const mark of relationMarks) {
      const el = relationRefs.current.get(mark.id);
      if (!el) continue;
      a.set(...mark.position).project(camera);
      b.set(
        mark.position[0] + mark.outboard[0],
        mark.position[1] + mark.outboard[1],
        mark.position[2] + mark.outboard[2],
      ).project(camera);
      let dx = ((b.x - a.x) / 2) * size.width;
      let dy = ((a.y - b.y) / 2) * size.height;
      const len = Math.hypot(dx, dy);
      if (len > 1e-6) {
        dx /= len;
        dy /= len;
      } else {
        dx = 0;
        dy = -1;
      }
      el.style.setProperty('--obx', dx.toFixed(4));
      el.style.setProperty('--oby', dy.toFixed(4));
    }
  });

  const anyEmphasis = emphasizedIds.length > 0;
  const emphasized = (id: string): boolean => emphasizedIds.includes(id);
  const glyphStyle = (id: string, isWord: boolean): React.CSSProperties => ({
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: fontPx,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    color: anyEmphasis && !emphasized(id) ? faintInk : ink, // recession by HUE…
    fontWeight: anyEmphasis ? (emphasized(id) ? 700 : 300) : 400, // …and WEIGHT — never opacity
    fontStyle: isWord ? 'normal' : 'italic', // the relation letter leans (a letter, not a word)
    // ⛔ THE HALO: 1h of PAPER beneath the glyph — the hatch ground is
    // SUPPRESSED under the mark, not merely out-contrasted
    background: paperColor,
    padding: `${haloPx}px ${haloPx + 2}px`,
    borderRadius: haloPx * 2,
    pointerEvents: 'none' as const,
  });

  return (
    <group name="correspondence-marks">
      {conceptMarks.map((mark) => (
        <Html key={mark.id} position={mark.position} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
          <div className="corr-mark" data-mark-id={mark.id} data-mark-kind="concept" style={{ pointerEvents: 'none' }}>
            <div className="corr-halo" style={glyphStyle(mark.id, true)}>
              {mark.label}
            </div>
          </div>
        </Html>
      ))}
      {relationMarks.map((mark) => (
        <Html key={mark.id} position={mark.position} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
          <div
            className="corr-mark"
            data-mark-id={mark.id}
            data-mark-kind="relation"
            ref={(el) => {
              if (el) relationRefs.current.set(mark.id, el);
              else relationRefs.current.delete(mark.id);
            }}
            style={{
              pointerEvents: 'none',
              transform: `translate(calc(var(--obx, 0) * ${offsetPx}px), calc(var(--oby, -1) * ${offsetPx}px))`,
            }}
          >
            <div className="corr-halo" style={glyphStyle(mark.id, false)}>
              {mark.label}
            </div>
          </div>
        </Html>
      ))}
      {composedMarks.map((mark) => (
        <group key={mark.id}>
          {/* the LEADER — the specimen register's own ink, weight between the
              cell edge and the hatch; it POINTS to the drawn place. Raycast-
              INERT (a decoration must never steal a hover from D1's pick
              layer — the measured closest-hit theft). */}
          <Line
            points={[mark.anchor, mark.place]}
            color={anyEmphasis && !emphasized(mark.id) ? faintInk : ink}
            lineWidth={1.4}
            transparent={false}
            raycast={() => null}
          />
          <Html position={mark.anchor} center zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
            <div className="corr-mark" data-mark-id={mark.id} data-mark-kind="composed" style={{ pointerEvents: 'none' }}>
              <div className="corr-halo" style={glyphStyle(mark.id, false)}>
                {mark.label}
              </div>
            </div>
          </Html>
        </group>
      ))}
      {/* the WORLD half of the emphasis — the entity itself lights */}
      {relationMarks
        .filter((mark) => emphasized(mark.id))
        .map((mark) => {
          const edge = shape.edges.find((e) => e.id === mark.id);
          const a = edge ? shape.vertices[edge.vertexIds[0]]?.position : undefined;
          const b = edge ? shape.vertices[edge.vertexIds[1]]?.position : undefined;
          return a && b ? (
            <Line key={`emph:${mark.id}`} points={[a, b]} color={ink} lineWidth={3} raycast={() => null} />
          ) : null;
        })}
      {conceptMarks
        .filter((mark) => emphasized(mark.id))
        .map((mark) => (
          <mesh key={`emph:${mark.id}`} position={mark.position} raycast={() => null}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color={ink} />
          </mesh>
        ))}
    </group>
  );
}

#!/usr/bin/env node

// DIAGNOSTIC — THE POSE NORMALIZATION (the un-pause queue's first item;
// Arman's ruling: *no appearance angle should exist* for lifted forms).
//
// THE CLAUSES:
//   P1 ★★ THE FIXED POINTS — an INVOKED primitive (square · segment) is
//        already the page's pose and derivePagePose returns NULL for it:
//        nothing healthy moves, byte-verbatim, by construction.
//   P2 ★★ THE DISEASE RIDES THE REAL WIRE AND THE CURE LANDS AT ITS END —
//        a square under a known rigid motion (the manufactured tilt; LAW 24's
//        falsifier) rides serializeSnapshot → loadUniverseSnapshot exactly as
//        a lifted form rides the shelf, and the pose derived on the LOADED
//        render.shape brings it: flat (z ≈ 0) · centred · D14 anchor edge on
//        +x · face-front (Newell → +z).
//   P3 ★  THE RIGID CONTROL — every edge length under the pose equals its
//        pre-pose length (a rotation fabricates and erases nothing; the
//        anti-fabrication arm).
//   P4    DETERMINISM — the same shape derives the same pose, twice.
//   P5 ★  THE SCOPE FENCES — a 3-dimensional body rules NULL (no face-on
//        exists; untouched this cut) · a flat-but-OFFSET plane IS the
//        disease (centred by the cure) · a tilted segment lands on +x · the
//        collinear invoked segment stays NULL.
//
// Anti-mock: the REAL modules through the transpile hook; the tilted
// specimen rides the REAL shelf wire (serializeSnapshot → the committed
// loadUniverseSnapshot), so the pose is derived on the exact object the
// ManuscriptView mount receives.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        esModuleInterop: true,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
      fileName: filename,
    }).outputText,
    filename,
  );
};
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { derivePagePose, applyPagePose } = req('src/manuscript/pagePoseModel.ts');
const { invokePrimitive } = req('src/manuscript/writtenFormModel.ts');
const { serializeSnapshot } = req('src/playground/snapshot.ts');
const { loadUniverseSnapshot } = req('src/manuscript/genesisModel.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const near = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;

console.log('THE POSE NORMALIZATION — no appearance angle for lifted forms\n');

// --- the rigid motion of the manufactured tilt (axis [1,2,3]/|·|, 67°, then
// --- a translation): exact inputs, so every assertion is sharp -------------
const AXIS = (() => {
  const n = Math.hypot(1, 2, 3);
  return [1 / n, 2 / n, 3 / n];
})();
const ANGLE = (67 * Math.PI) / 180;
const TILT_Q = [
  AXIS[0] * Math.sin(ANGLE / 2),
  AXIS[1] * Math.sin(ANGLE / 2),
  AXIS[2] * Math.sin(ANGLE / 2),
  Math.cos(ANGLE / 2),
];
const TILT_T = [2.5, -1.25, 4.75];
const rot = (q, v) => {
  const [x, y, z, w] = q;
  const [vx, vy, vz] = v;
  const tx = 2 * (y * vz - z * vy);
  const ty = 2 * (z * vx - x * vz);
  const tz = 2 * (x * vy - y * vx);
  return [vx + w * tx + (y * tz - z * ty), vy + w * ty + (z * tx - x * tz), vz + w * tz + (x * ty - y * tx)];
};
const tiltShape = (shape) => {
  const vertices = {};
  for (const [id, v] of Object.entries(shape.vertices)) {
    const r = rot(TILT_Q, v.position);
    vertices[id] = { ...v, position: [r[0] + TILT_T[0], r[1] + TILT_T[1], r[2] + TILT_T[2]] };
  }
  return { ...shape, vertices };
};
const centroidOf = (shape, map) => {
  const ids = Object.keys(shape.vertices).sort();
  const c = [0, 0, 0];
  for (const id of ids) {
    const p = map(shape.vertices[id].position);
    c[0] += p[0];
    c[1] += p[1];
    c[2] += p[2];
  }
  return c.map((x) => x / ids.length);
};

// ---------------------------------------------------------------------------
console.log('----- §1 (P1) ★★ the fixed points — invoked forms rule NULL, nothing healthy moves -----');
const square = invokePrimitive('square', 900);
const squareShape = square.render.mode === 'plain' ? square.render.shape : square.shape;
check('P1a — the invoked square derives NULL (already the page pose)', derivePagePose(squareShape) === null);
const segment = invokePrimitive('segment', 901);
const segmentShape = segment.render.mode === 'plain' ? segment.render.shape : segment.shape;
check('P1b — the invoked segment derives NULL (already along the axis, centred)', derivePagePose(segmentShape) === null);

// ---------------------------------------------------------------------------
console.log('\n----- §2 (P2) ★★ the tilted lift, through the REAL shelf wire -----');
const tilted = tiltShape(squareShape);
const file = serializeSnapshot(tilted, 'pose-leg');
const entry = loadUniverseSnapshot(file);
check('P2a — the tilted square loads placeable, render plain (the shelf route)', entry.placeable && entry.render && entry.render.mode === 'plain');
const loadedShape = entry.render.shape;
const pose = derivePagePose(loadedShape);
check('P2b — the loaded tilt derives a pose (the disease is seen)', pose !== null);
if (pose) {
  const ids = Object.keys(loadedShape.vertices).sort();
  const posed = new Map(ids.map((id) => [id, applyPagePose(pose, loadedShape.vertices[id].position)]));
  const maxZ = Math.max(...ids.map((id) => Math.abs(posed.get(id)[2])));
  check('P2c — flat: every posed vertex sits on the page plane', maxZ < 1e-5);
  note(`max |z| after the pose: ${maxZ.toExponential(2)}`);
  const c = centroidOf(loadedShape, (p) => applyPagePose(pose, p));
  check('P2d — centred: the posed centroid is the origin', Math.hypot(...c) < 1e-5);
  // the D14 anchor: face[0]'s alphabetically-first corner → its successor
  const face = loadedShape.faces[0];
  const idsInFace = face.vertexIds;
  let s = 0;
  for (let k = 1; k < idsInFace.length; k += 1) if (idsInFace[k].localeCompare(idsInFace[s]) < 0) s = k;
  const a = posed.get(idsInFace[s]);
  const b = posed.get(idsInFace[(s + 1) % idsInFace.length]);
  const e = [b[0] - a[0], b[1] - a[1]];
  check('P2e — the D14 anchor edge runs along +x', e[0] > 0 && near(e[1], 0, 1e-5));
  note(`anchor edge after the pose: [${e[0].toFixed(6)}, ${e[1].toFixed(6)}]`);
  // face-front: the posed Newell normal points at the reader
  let nz = 0;
  const cyc = idsInFace.map((id) => posed.get(id));
  for (let k = 0; k < cyc.length; k += 1) {
    const p = cyc[k];
    const q = cyc[(k + 1) % cyc.length];
    nz += (p[0] - q[0]) * (p[1] + q[1]);
  }
  check('P2f — face-front: the posed cycle normal points +z', nz > 0);

  console.log('\n----- §3 (P3) ★ the rigid control — nothing fabricated, nothing erased -----');
  let maxDrift = 0;
  for (const edge of loadedShape.edges) {
    const u0 = loadedShape.vertices[edge.vertexIds[0]].position;
    const v0 = loadedShape.vertices[edge.vertexIds[1]].position;
    const u1 = posed.get(edge.vertexIds[0]);
    const v1 = posed.get(edge.vertexIds[1]);
    const before = Math.hypot(u0[0] - v0[0], u0[1] - v0[1], u0[2] - v0[2]);
    const after = Math.hypot(u1[0] - v1[0], u1[1] - v1[1], u1[2] - v1[2]);
    maxDrift = Math.max(maxDrift, Math.abs(before - after));
  }
  check('P3 — every edge length survives the pose (rotation only)', maxDrift < 1e-9);
  note(`max edge-length drift: ${maxDrift.toExponential(2)}`);

  console.log('\n----- §4 (P4) determinism -----');
  const again = derivePagePose(loadedShape);
  check('P4 — the same shape derives the same pose, twice', JSON.stringify(pose) === JSON.stringify(again));
}

// ---------------------------------------------------------------------------
console.log('\n----- §5 (P5) ★ the scope fences -----');
// a 3-dimensional body: a unit cube, hand-built (exact) — no face-on exists
const cubeVerts = {};
const cubeIds = [];
for (let k = 0; k < 8; k += 1) {
  const id = `c${k}`;
  cubeIds.push(id);
  cubeVerts[id] = {
    id,
    position: [k & 1 ? 1 : -1, k & 2 ? 1 : -1, k & 4 ? 1 : -1],
    data: { conceptId: null, label: '' },
    createdBy: { shapeId: 'pose-leg-cube', operation: 'seed', sourceVertexIds: [] },
  };
}
const cube = {
  id: 'pose-leg-cube',
  name: 'pose-leg cube',
  vertices: cubeVerts,
  edges: [],
  faces: [
    { id: 'f0', vertexIds: ['c0', 'c1', 'c3', 'c2'] },
    { id: 'f1', vertexIds: ['c4', 'c6', 'c7', 'c5'] },
  ],
  genealogy: { operation: 'seed', parentShapeId: null },
};
check('P5a — a 3-dimensional body rules NULL (untouched this cut)', derivePagePose(cube) === null);
// flat but OFFSET — the disease without the tilt: normalized (centred)
const offsetFlat = (() => {
  const vertices = {};
  for (const [id, v] of Object.entries(squareShape.vertices)) {
    vertices[id] = { ...v, position: [v.position[0] + 3, v.position[1] + 2, v.position[2] + 5] };
  }
  return { ...squareShape, vertices };
})();
const offsetPose = derivePagePose(offsetFlat);
check('P5b — a flat-but-offset plane IS the disease (a pose derives)', offsetPose !== null);
if (offsetPose) {
  const c = centroidOf(offsetFlat, (p) => applyPagePose(offsetPose, p));
  check('P5c — …and the cure centres it', Math.hypot(...c) < 1e-5);
}
// a tilted segment lands on +x, centred
const tiltedSegment = tiltShape(segmentShape);
const segPose = derivePagePose(tiltedSegment);
check('P5d — a tilted segment derives a pose', segPose !== null);
if (segPose) {
  const sids = Object.keys(tiltedSegment.vertices).sort();
  const p0 = applyPagePose(segPose, tiltedSegment.vertices[sids[0]].position);
  const p1 = applyPagePose(segPose, tiltedSegment.vertices[sids[1]].position);
  const d = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
  check('P5e — …and lands along +x, flat', d[0] > 0 && near(d[1], 0, 1e-6) && near(d[2], 0, 1e-6));
  const c = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2, (p0[2] + p1[2]) / 2];
  check('P5f — …centred', Math.hypot(...c) < 1e-6);
}

console.log(`\n${failures === 0 ? 'ALL CLAUSES PASS — the pose normalization holds' : `${failures} CLAUSE(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);

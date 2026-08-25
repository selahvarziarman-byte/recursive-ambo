#!/usr/bin/env node

// DIAGNOSTIC — B-104 RUNG 2: THE SURFACE DECK-TILING (ADR 0025, Accepted at
// c7cd138). The invariants, each a leg with its own falsifier (ADR §4/§5):
//   · cosh R = cot(π/p)·cot(π/q) — the naive form cos(π/p)/sin(π/q) BITES
//     (the corner would read 79.47° where 72° is owed);
//   · the DRAWN conformal corner = 360/q to 0.01° (measured off the
//     generated base cell's own arcs, never off the formula that made it);
//   · dedup (1−|c|²)-scaled: tile count = the CLOSED-cycle count, never the
//     tree (the same walk without dedup unrolls — pinned side by side);
//   · interior vertex valence set = {q} (the ring is countable);
//   · THE DESCENT LAW: σ ∈ Sym(tiling) ∧ free — cube ✔ · octa ✔ · tetra ✘
//     (the LAW-24 control that must fail, with its reason in words);
//   · the rim ADDRESSED never walled (no drawn corner beyond the clip);
//     LOD: a cell below the floor is DROPPED, never drawn wrong;
//   · {p,q} read off REAL acquired complexes (record-not-reading): the
//     torus {4,4} euclidean · RP² {4,2} spherical with the descent pair ·
//     the cube surface {4,3} with exactly one EXTERIOR pole cell · the
//     hexagon aabbcc fold {6,6} hyperbolic (the page's reachable case) ·
//     honest refusals on the faceless cut, the bounded cylinder, and the
//     irregular connected sum.
// Anti-mock: requiring the REAL TS modules through the transpile hook.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
};
require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText,
    filename,
  );
};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const M = req('src/manuscript/deckTilingModel.ts');
const { invokePrimitive, applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const { acquireComplex } = req('src/lib/complexIdentification.ts');
const { executeCustomGlue } = req('src/playground/customGluing.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { connectedSum } = req('src/lib/connectedSum.ts');

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('the deck-tiling: one cell, three worlds — the method anchors in the hyperbolic\n');

// ═════ [a] the size law + the naive-form trap ═══════════════════════════════
const P = 4, Q = 5;
const coshR = M.coshROf(P, Q);
const naive = Math.cos(Math.PI / P) / Math.sin(Math.PI / Q);
check('cosh R = cot(π/4)·cot(π/5) = 1.3764 — and the naive form cos/sin DIFFERS (the trap the reference caught at 79.47°)',
  Math.abs(coshR - 1.3763819) < 1e-6 && Math.abs(naive - coshR) > 0.1);
note(`cot·cot ${coshR.toFixed(6)} · naive ${naive.toFixed(6)}`);

// ═════ [b] the drawn corner = 360/q to 0.01°, measured off the base cell ═══
const hyp = M.hyperbolicTiling(P, Q);
const base = hyp.cells[0];
// the TRUE tangent at a base corner: the geodesic to a neighbour is an arc of
// the circle orthogonal to the unit circle through both points — recomputed
// INDEPENDENTLY here (the same construction, a second pen), tangent ⟂ radius
const orthoC = (v1, v2) => {
  const a1 = 2 * v1[0], b1 = 2 * v1[1], c1 = v1[0] ** 2 + v1[1] ** 2 + 1;
  const a2 = 2 * v2[0], b2 = 2 * v2[1], c2 = v2[0] ** 2 + v2[1] ** 2 + 1;
  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < 1e-12) return null;
  const Cx = (c1 * b2 - c2 * b1) / det, Cy = (a1 * c2 - a2 * c1) / det;
  return Cx * Cx + Cy * Cy - 1 <= 1e-12 ? null : [Cx, Cy];
};
const tangentToward = (v, o) => {
  const c = orthoC(v, o);
  if (c === null) {
    const L = Math.hypot(o[0] - v[0], o[1] - v[1]) || 1e-12;
    return [(o[0] - v[0]) / L, (o[1] - v[1]) / L];
  }
  const rx = v[0] - c[0], ry = v[1] - c[1];
  const L = Math.hypot(rx, ry) || 1e-12;
  let t = [-ry / L, rx / L];
  if (t[0] * (o[0] - v[0]) + t[1] * (o[1] - v[1]) < 0) t = [-t[0], -t[1]];
  return t;
};
const corners = base.corners.map((v, k) => {
  const n = base.corners.length;
  const t1 = tangentToward(v, base.corners[(k + 1) % n]);
  const t2 = tangentToward(v, base.corners[(k - 1 + n) % n]);
  return (Math.acos(Math.max(-1, Math.min(1, t1[0] * t2[0] + t1[1] * t2[1]))) * 180) / Math.PI;
});
check('THE DRAWN CORNER: every base-cell corner measures 360/q = 72° to 0.01° — computed from the arcs\' true tangents, an independent second pen over the same construction',
  corners.every((c) => Math.abs(c - 72) < 0.01));
note(`corners: ${corners.map((c) => c.toFixed(4)).join(' · ')}`);

// ═════ [c] the dedup law: closed cycles, never the tree ═════════════════════
const closed6 = M.hyperbolicTiling(P, Q, 6).cells.length;
const again6 = M.hyperbolicTiling(P, Q, 6).cells.length;
check('the (1−|c|²)-scaled dedup closes the cycles: the depth-6 count is DETERMINISTIC and far below the reflection tree (1+4·Σ3^k = 5461)',
  closed6 === again6 && closed6 < 1500 && closed6 > 100);
note(`closed ${closed6} · the tree would be 5461`);

// ═════ [d] interior valence = {q}: the ring is countable ════════════════════
check('the ringed vertex counts its cells: {4,5} → 5 · {4,4} → 4 · {6,3} → 3 · {4,3} → 3 (the curvature read off a countable vertex)',
  M.hyperbolicTiling(4, 5).ring.cellIndices.length === 5 &&
  M.euclideanTiling(4, 4).ring.cellIndices.length === 4 &&
  M.euclideanTiling(6, 3).ring.cellIndices.length === 3 &&
  M.sphericalTiling(4, 3, false).ring.cellIndices.length === 3);

// ═════ [e] the rim + LOD laws ═══════════════════════════════════════════════
const deep = M.hyperbolicTiling(P, Q, 8);
const maxR = Math.max(...deep.cells.flatMap((c) => c.corners.map(([x, y]) => Math.hypot(x, y))));
check('the rim is INFINITY, addressed never walled: no drawn corner crosses the clip (r² ≤ 0.998 — the reference\'s own bound, so r ≤ 0.9990), and the LOD drops (never draws wrong) — dropped > 0 at depth 8',
  maxR <= Math.sqrt(0.998) + 1e-9 && deep.dropped > 0);
note(`max |corner| ${maxR.toFixed(4)} (bound ${Math.sqrt(0.998).toFixed(4)}) · dropped ${deep.dropped} · cells ${deep.cells.length}`);

// ═════ [f] THE DESCENT LAW — cube ✔ · octa ✔ · tetra ✘ (LAW 24) ════════════
const norm3 = (v) => { const m = Math.hypot(v[0], v[1], v[2]) || 1e-9; return [v[0] / m, v[1] / m, v[2] / m]; };
const descentOf = (seed) => {
  const shape = createSeedShape(seed);
  const verts = new Map(Object.values(shape.vertices).map((v) => [v.id, norm3(v.position)]));
  const faces = shape.faces.map((f) => {
    const vs = f.vertexIds.map((id) => verts.get(id));
    return {
      key: f.id,
      vertexKeys: f.vertexIds,
      centroid: norm3([vs.reduce((s, v) => s + v[0], 0), vs.reduce((s, v) => s + v[1], 0), vs.reduce((s, v) => s + v[2], 0)]),
    };
  });
  return M.tilingDescends(faces, verts);
};
const dc = descentOf('cube');
const doc = descentOf('octahedron');
const dt = descentOf('tetrahedron');
check('σ ∈ Sym(tiling) ∧ free — CHECKED never assumed: cube DESCENDS (3 antipodal pairs) · octahedron DESCENDS (4 pairs)',
  dc.descends && dc.pairs.length === 3 && doc.descends && doc.pairs.length === 4);
check('…and the LAW-24 control FAILS where it must: the tetrahedron is not centrally symmetric — σ carries a corner to no corner, and the check says so in words',
  dt.descends === false && typeof dt.reason === 'string' && dt.reason.includes('not a symmetry'));
note(`tetra: ${dt.reason}`);

// ═════ [g] {p,q} off REAL complexes — record-not-reading ════════════════════
const R = 8;
const sq1 = invokePrimitive('square', 901).shape;
const torus = applyPlaygroundOperationTo('glue-torus', sq1, null, 902, R);
const torusRead = M.readSchlafli(acquireComplex(torus.born.shape, sq1).complex);
check('the abAB torus reads {4,4} — EUCLIDEAN (the flat sheet: 4 × 90° closes exactly)',
  torusRead.ok && torusRead.p === 4 && torusRead.q === 4 && M.geometryOf(4, 4) === 'euclidean');
const sq2 = invokePrimitive('square', 903).shape;
const rp2 = applyPlaygroundOperationTo('flip-glue', sq2, null, 904, R);
const rp2Complex = acquireComplex(rp2.born.shape, sq2).complex;
const rp2Read = M.readSchlafli(rp2Complex);
const rp2Resolve = M.resolveDeckTiling(rp2Complex, true);
check('the abab RP² reads {4,2} — SPHERICAL — and its double cover DESCENDS: the antipodal check passes and the two cap cells pair (the identification ARISES, checked)',
  rp2Read.ok && rp2Read.p === 4 && rp2Read.q === 2 &&
  rp2Resolve.ok && rp2Resolve.tiling.descent !== null && rp2Resolve.tiling.descent.pairs.length === 1);
const cubeResolve = M.resolveDeckTiling(acquireComplex(createSeedShape('cube'), null).complex, false);
check('the cube surface reads {4,3} — SPHERICAL — six cells with EXACTLY ONE the exterior pole cell (the stereographic plate\'s outside)',
  cubeResolve.ok && cubeResolve.tiling.p === 4 && cubeResolve.tiling.q === 3 &&
  cubeResolve.tiling.cells.length === 6 && cubeResolve.tiling.cells.filter((c) => c.exterior).length === 1);
const hex = invokePrimitive('hexagon', 905).shape;
const n3fold = executeCustomGlue(hex, hex.faces[0], [
  { edgeA: 0, edgeB: 1, mode: 'reversing' },
  { edgeA: 2, edgeB: 3, mode: 'reversing' },
  { edgeA: 4, edgeB: 5, mode: 'reversing' },
], null);
const hexRead = M.readSchlafli(acquireComplex(n3fold, hex).complex);
check('the hexagon aabbcc fold (three adjacent reversing pairs — the page\'s own reachable route) reads {6,6} — HYPERBOLIC: the person can build a surface whose window is the Poincaré disk',
  hexRead.ok && hexRead.p === 6 && hexRead.q === 6 && M.geometryOf(6, 6) === 'hyperbolic');
note(`hex {${hexRead.ok ? hexRead.p : '-'},${hexRead.ok ? hexRead.q : '-'}} · cosh R = ${M.coshROf(6, 6).toFixed(4)}`);

// ═════ [h] the honest refusals — counted facts, never silence ═══════════════
const sq3 = invokePrimitive('square', 906).shape;
const cut = applyPlaygroundOperationTo('cut', sq3, null, 907, R, [], sq3.faces[0].id);
const cutRead = M.readSchlafli(acquireComplex(cut.born.shape, sq3).complex);
check('the cut square (no 2-cells left) refuses by name',
  !cutRead.ok && cutRead.reason.includes('no 2-cells'));
const sq4 = invokePrimitive('square', 908).shape;
const cyl = applyPlaygroundOperationTo('glue-cylinder', sq4, null, 909, R);
const cylRead = M.readSchlafli(acquireComplex(cyl.born.shape, sq4).complex);
check('the cylinder (a bounded surface) refuses with its counted boundary — the deck-tiling reads a CLOSED surface',
  !cylRead.ok && cylRead.reason.includes('CLOSED surface') && /\d+ free edge/.test(cylRead.reason));
// the multi-face torus representative (the word-op gate witness's own build)
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { serializeSnapshot, deserializeSnapshot } = req('src/playground/snapshot.ts');
const torusRep = (prefix) =>
  deserializeSnapshot(serializeSnapshot(immerseSurface({ surface: 'torus', resolution: 4 }).shape, prefix)).shape;
const torusA = torusRep('dtA');
const torusB = torusRep('dtB');
const genus2 = connectedSum(torusA, torusB).shape;
const g2Acq = acquireComplex(genus2, [torusA, torusB]);
const g2Read = g2Acq ? M.readSchlafli(g2Acq.complex) : null;
check('the genus-2 connected sum (no regular symbol) refuses with the COUNTED facts — face sizes and valence set named, never a silent degrade',
  g2Read !== null && !g2Read.ok && g2Read.reason.includes('no single {p,q}'));
note(`genus-2: ${g2Read ? g2Read.reason : '(unacquired)'}`);

// ═════ [i] the window is MOUNTED at the located seam ════════════════════════
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check('the surface arm OPENS the rung-2 window (the later-chapter door retires at its own seam): the View resolves the tiling for w: selections, eligibility is the resolution (true-predictive), and the greyed chip speaks the counted facts',
  viewSrc.includes('DeckTilingWindow') &&
  viewSrc.includes('deckTilingFor?.ok === true') &&
  viewSrc.includes("setTilingOpen((cur) => (cur === selected ? null : selected))") &&
  viewSrc.includes('deckTilingFor !== null && !deckTilingFor.ok'));

// ═════ [j] B-105 — ADR §7/§7.1: THE INHABITANT + the demoted captions ═══════
console.log('\n----- [j] B-105 ADR §7.1 — the inhabitant (chiral, doubled ⟺ descent) + §7 the window stops narrating -----');
// the LAW-24 pair, at the model: the plain cube (no identification) carries
// the mark ONCE; the {4,2} dihedron under the CHECKED descent carries it
// TWICE, the second image on the far side (the shows-through register)
const cubeTiling = M.sphericalTiling(4, 3, false);
check('[j] the NON-descended {4,3} plate carries the inhabitant ONCE (the LAW-24 control: no identification, no double)',
  cubeTiling !== null && cubeTiling.inhabitant !== null && cubeTiling.inhabitant.images.length === 1 &&
  cubeTiling.inhabitant.images[0].farSide === false && cubeTiling.inhabitant.images[0].outline.length > 50);
const dihedron = M.sphericalTiling(4, 2, true);
check('[j] the {4,2} dihedron under the CHECKED descent carries the mark in TWO places — the antipodal image joins, on the far side (faint register)',
  dihedron !== null && dihedron.descent !== null && dihedron.inhabitant !== null &&
  dihedron.inhabitant.images.length === 2 &&
  dihedron.inhabitant.images[0].farSide === false && dihedron.inhabitant.images[1].farSide === true);
// the CHIRALITY is the math's, never authored: the antipodal map on S² is
// orientation-reversing, so the projected doubles WIND OPPOSITE ways —
// measured as the signed total turning of each projected polyline
const turningOf = (outline) => {
  let total = 0;
  for (let i = 2; i < outline.length; i += 1) {
    const ax = outline[i - 1][0] - outline[i - 2][0];
    const ay = outline[i - 1][1] - outline[i - 2][1];
    const bx = outline[i][0] - outline[i - 1][0];
    const by = outline[i][1] - outline[i - 1][1];
    total += Math.atan2(ax * by - ay * bx, ax * bx + ay * by);
  }
  return total;
};
const turn0 = turningOf(dihedron.inhabitant.images[0].outline);
const turn1 = turningOf(dihedron.inhabitant.images[1].outline);
check('[j] THE FLIP IS THE MATH\'S: the two images wind OPPOSITE ways (signed turning > 1.5 full turns each, opposite signs — a symmetric figure could not carry this)',
  Math.abs(turn0) > 3 * Math.PI && Math.abs(turn1) > 3 * Math.PI && Math.sign(turn0) === -Math.sign(turn1));
note(`turning: image0 ${(turn0 / (2 * Math.PI)).toFixed(2)} turns · image1 ${(turn1 / (2 * Math.PI)).toFixed(2)} turns`);
// the anchor stays INSIDE its one cell: every image-0 point of the cube's
// coil lies strictly inside the anti-pole cell's plate radius (the cell
// spans to its corners; the coil was budgeted to half the inradius + 38%)
check('[j] the mark sits in ONE cell: the cube coil\'s plate radii all fall inside the central cell\'s corner radius',
  (() => {
    const central = cubeTiling.cells.filter((c) => !c.exterior && c.farSide !== true)
      .reduce((best, c) => {
        const r = Math.hypot(c.center[0], c.center[1]);
        return best === null || r < Math.hypot(best.center[0], best.center[1]) ? c : best;
      }, null);
    if (!central) return false;
    const cornerR = Math.max(...central.corners.map(([x, y]) => Math.hypot(x, y)));
    return cubeTiling.inhabitant.images[0].outline.every(([x, y]) => Math.hypot(x, y) < cornerR);
  })());
// non-spherical tilings carry NONE (no antipodal question stands there)
check('[j] absence stays absent: the euclidean and hyperbolic tilings carry no inhabitant',
  M.euclideanTiling(4, 4).inhabitant === null && M.hyperbolicTiling(6, 6, 5).inhabitant === null);
// §7 — the window's demotion, source-asserted: the narrating captions are
// GONE (ring/count/arithmetic/rim/pole/descent prose), the {p,q} header
// symbol is the record's now, the inhabitant draw loop exists, and the
// card carries the demoted record rows
const windowSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/DeckTilingWindow.tsx'), 'utf8');
check('[j] ADR §7: the window stops NARRATING — no ring caption, no count, no GAP/OVERLAP arithmetic, no rim/pole/descent prose; the geometry NAME stays; the inhabitant is drawn',
  !windowSrc.includes('ring the marked vertex') &&
  !windowSrc.includes('count the cells') &&
  !windowSrc.includes('must ruffle open') &&
  !windowSrc.includes('CLOSES EXACTLY') &&
  !windowSrc.includes('the boundary circle is INFINITY') &&
  !windowSrc.includes('the pole cell is the whole EXTERIOR') &&
  !windowSrc.includes('the antipodal map is a symmetry') &&
  !windowSrc.includes('{${tiling.p},${tiling.q}}') &&
  windowSrc.includes('GEOMETRY_WORD[tiling.geometry]') &&
  windowSrc.includes('tiling.inhabitant?.images'));
check('[j] ADR §7: {p,q} · the vertex count · the descent check DEMOTE to the card (data-deck-record rows, present exactly when the tiling resolves; descent row iff checked)',
  viewSrc.includes('data-deck-record') &&
  viewSrc.includes("label: 'deck-tiling', value: `{${t.p},${t.q}}`") &&
  viewSrc.includes("label: 'cells at a vertex'") &&
  viewSrc.includes('−I ∈ Sym ∧ free'));

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

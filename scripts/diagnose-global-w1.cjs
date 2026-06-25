#!/usr/bin/env node

// DIAGNOSTIC — The Fifth Necessity: the global w₁ class on an H₁ cycle basis of the
// SUBDIVIDED assembled complex (mothership necessity 5, ADR 0011, amended 2026-06-23).
//
// CERTIFIER-ONLY · DERIVE-ONLY. Builds each zoo surface's assembled complex from the
// REAL committed operations (glueFace / flipGlueFace / collapseFace on the cube's first
// face), then seals globalW1Class's b₁, canonical w₁ multiset, non-orientability,
// non-degeneracy — and the discriminator Klein ≠ RP² that necessity (4)'s single
// orientability bit cannot make. §W-teeth reproduces the single-face coboundary trap.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

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

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { globalW1Class, analyzeGlobalW1 } = req('src/lib/globalW1.ts');
const { glueFace, flipGlueFace, collapseFace } = req('src/lib/surfaceOperations.ts');
const { createSeedShape } = req('src/data/seeds.ts');

let failures = 0;
function check(label, condition) {
  if (condition) {
    console.log(`PASS - ${label}`);
  } else {
    console.log(`FAIL - ${label}`);
    failures += 1;
  }
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---- the fixture: the cube's first face (the level-2 zoo's polygon) ----
const shape = createSeedShape('cube');
const shapeSnapshot = JSON.stringify(shape);
const face = shape.faces[0];
const vs = face.vertexIds;
const n = vs.length;
const P = (edgeA, edgeB, mode) => ({ edgeA, edgeB, mode });

// Build the AssembledComplex from a gluing: vertex-classes from the real trace's
// `identified` (corner → support); edge-classes by unioning paired boundary-edge
// indices; the face boundary word's direction from the seam mode (preserving = the
// edge recurs REVERSED, a…a⁻¹; reversing = SAME direction, a…a) — the fundamental
// polygon words. Derive-only: nothing here mutates the Shape.
function buildAssembled(useFlip, pairings) {
  const trace = (useFlip ? flipGlueFace : glueFace)(shape, face, pairings);
  const supportOf = (corner) => trace.identified[corner];

  // edge-class union-find over the n boundary-edge indices.
  const parent = {};
  const find = (x) => {
    if (parent[x] === undefined) parent[x] = x;
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const union = (a, b) => {
    parent[find(a)] = find(b);
  };
  for (let k = 0; k < n; k += 1) find(String(k));
  for (const { edgeA, edgeB } of pairings) union(String(edgeA), String(edgeB));

  // per-slot direction relative to the edge-class canonical (the lowest member index).
  const dir = {};
  for (let k = 0; k < n; k += 1) dir[k] = 1;
  for (const { edgeA, edgeB, mode } of pairings) {
    const lo = Math.min(edgeA, edgeB);
    const hi = Math.max(edgeA, edgeB);
    dir[lo] = 1;
    dir[hi] = mode === 'preserving' ? -1 : 1; // crossed → reversed; parallel → same
  }

  // one edge-class per root; endpoints = the canonical slot's corner supports.
  const slotsByRoot = {};
  for (let k = 0; k < n; k += 1) (slotsByRoot[find(String(k))] ||= []).push(k);
  const edgeIdOfSlot = {};
  const edges = [];
  for (const root of Object.keys(slotsByRoot)) {
    const slots = slotsByRoot[root].sort((a, b) => a - b);
    const k0 = slots[0];
    const id = `E${k0}`;
    const u = supportOf(vs[k0]);
    const v = supportOf(vs[(k0 + 1) % n]);
    edges.push({ id, u, v });
    for (const k of slots) edgeIdOfSlot[k] = id;
  }

  const boundary = [];
  for (let k = 0; k < n; k += 1) boundary.push({ edge: edgeIdOfSlot[k], dir: dir[k] });
  const vertices = [...new Set(vs.map((v) => supportOf(v)))];
  return { vertices, edges, faces: [{ boundary }] };
}

// the collapse-sphere: the boundary-quotient D²/∂D² = S² — V=1, E=0, F=1. A single
// 2-cell on a single 0-cell with no 1-cells (b₁ = 0).
function buildSphere() {
  const trace = collapseFace(shape, face);
  const support = trace.identified[vs[0]];
  return { vertices: [support], edges: [], faces: [{ boundary: [] }] };
}

function report(name, complex) {
  const { cert, debug } = analyzeGlobalW1(complex);
  note(
    `${name}: supports=${complex.vertices.length} edge-classes=${complex.edges.length} | ` +
      `subdivision v${debug.cellCounts.v}/e${debug.cellCounts.e}/t${debug.cellCounts.t} χ=${debug.euler} | ` +
      `b₁=${cert.b1} perCycleW1=${JSON.stringify(debug.perCycleW1)} → w1Class=${JSON.stringify(cert.w1Class)} ` +
      `nonOrientable=${cert.nonOrientable} nonDegenerate=${cert.nonDegenerate}`,
  );
  for (let i = 0; i < debug.basisCycles.length; i += 1)
    note(`   H₁ basis cycle ${i}: ${JSON.stringify(debug.basisCycles[i])}`);
  // independent cross-check: the global 2-colouring verdict must agree with !nonOrientable.
  check(
    `${name} cross-check: global 2-colouring orientable === !nonOrientable`,
    debug.crossCheckOrientable === !cert.nonOrientable,
  );
  return cert;
}

// ===================== the six zoo surfaces =====================
console.log('\n----- §W: the global w₁ class per zoo surface (subdivided) -----');

const cyl = buildAssembled(false, [P(0, 2, 'preserving')]);
const torus = buildAssembled(false, [P(0, 2, 'preserving'), P(1, 3, 'preserving')]);
const mobius = buildAssembled(true, [P(0, 2, 'reversing')]);
const klein = buildAssembled(true, [P(0, 2, 'preserving'), P(1, 3, 'reversing')]);
const rp2 = buildAssembled(true, [P(0, 2, 'reversing'), P(1, 3, 'reversing')]);
const sphere = buildSphere();

const cCyl = report('cylinder', cyl);
const cTorus = report('torus', torus);
const cMobius = report('Möbius', mobius);
const cKlein = report('Klein', klein);
const cRp2 = report('RP²', rp2);
const cSphere = report('sphere', sphere);

// §W-cyl
check('§W-cyl cylinder b₁ === 1', cCyl.b1 === 1);
check('§W-cyl cylinder w1Class === [0]', eq(cCyl.w1Class, [0]));
check('§W-cyl cylinder nonOrientable === false', cCyl.nonOrientable === false);

// §W-torus
check('§W-torus torus b₁ === 2', cTorus.b1 === 2);
check('§W-torus torus w1Class === [0,0]', eq(cTorus.w1Class, [0, 0]));
check('§W-torus torus nonOrientable === false', cTorus.nonOrientable === false);

// §W-mobius
check('§W-mobius Möbius b₁ === 1', cMobius.b1 === 1);
check('§W-mobius Möbius w1Class === [1]', eq(cMobius.w1Class, [1]));
check('§W-mobius Möbius nonOrientable === true', cMobius.nonOrientable === true);

// §W-klein
check('§W-klein Klein b₁ === 2', cKlein.b1 === 2);
check('§W-klein Klein w1Class === [0,1]', eq(cKlein.w1Class, [0, 1]));
check('§W-klein Klein nonOrientable === true', cKlein.nonOrientable === true);

// §W-rp2
check('§W-rp2 RP² b₁ === 1', cRp2.b1 === 1);
check('§W-rp2 RP² w1Class === [1]', eq(cRp2.w1Class, [1]));
check('§W-rp2 RP² nonOrientable === true', cRp2.nonOrientable === true);

// §W-sphere
check('§W-sphere sphere b₁ === 0', cSphere.b1 === 0);
check('§W-sphere sphere w1Class === []', eq(cSphere.w1Class, []));
check('§W-sphere sphere nonOrientable === false', cSphere.nonOrientable === false);

// §W-disc — the falsifiable core: Klein ≠ RP², differing in LENGTH (b₁ 2 vs 1) AND
// content ([0,1] vs [1]). Necessity (4)'s orientability BIT calls both "non-orientable";
// necessity (5) separates them.
console.log('\n----- §W-disc: Klein ≠ RP² (necessity 5 separates what necessity 4 conflates) -----');
note(`Klein b₁=${cKlein.b1} w1Class=${JSON.stringify(cKlein.w1Class)} | RP² b₁=${cRp2.b1} w1Class=${JSON.stringify(cRp2.w1Class)}`);
check('§W-disc Klein and RP² are BOTH non-orientable (necessity 4 cannot tell them apart)', cKlein.nonOrientable && cRp2.nonOrientable);
check('§W-disc length differs: Klein.w1Class.length !== RP².w1Class.length (2 vs 1)', cKlein.w1Class.length !== cRp2.w1Class.length);
check('§W-disc content differs: Klein.w1Class !== RP².w1Class ([0,1] vs [1])', !eq(cKlein.w1Class, cRp2.w1Class));

// §W-ndg — non-degeneracy: every surface WITH edges holds ≥2 distinct sub-corners per
// edge-class on the subdivision.
console.log('\n----- §W-ndg: non-degeneracy (subdivision ≥2 distinct sub-corners per edge-class) -----');
check('§W-ndg cylinder nonDegenerate === true', cCyl.nonDegenerate === true);
check('§W-ndg torus nonDegenerate === true', cTorus.nonDegenerate === true);
check('§W-ndg Möbius nonDegenerate === true', cMobius.nonDegenerate === true);
check('§W-ndg Klein nonDegenerate === true', cKlein.nonDegenerate === true);
check('§W-ndg RP² nonDegenerate === true', cRp2.nonDegenerate === true);

// §W-teeth — the subdivision is LOAD-BEARING: the SAME pipeline on the RAW single-face
// RP² (no subdivision) yields the WRONG w1Class === [0] (the coboundary trap of
// level2-zoo §6). torus/Klein generators are single self-loops one rung coarser, so the
// teeth target RP² where the two edge-classes share both endpoints.
console.log('\n----- §W-teeth: the trap the subdivision fixes (raw RP² → [0]) -----');
const rawRp2 = globalW1Class(rp2, { subdivide: false });
const subRp2 = globalW1Class(rp2, { subdivide: true });
note(`raw RP²: b₁=${rawRp2.b1} w1Class=${JSON.stringify(rawRp2.w1Class)} nonOrientable=${rawRp2.nonOrientable} nonDegenerate=${rawRp2.nonDegenerate}`);
note(`subdivided RP²: b₁=${subRp2.b1} w1Class=${JSON.stringify(subRp2.w1Class)} nonOrientable=${subRp2.nonOrientable} nonDegenerate=${subRp2.nonDegenerate}`);
check('§W-teeth raw RP² b₁ === 1 (same first Betti number)', rawRp2.b1 === 1);
check('§W-teeth raw RP² w1Class === [0] (the coboundary degeneracy — WRONG)', eq(rawRp2.w1Class, [0]));
check('§W-teeth raw RP² reads orientable (nonOrientable === false) — the trap', rawRp2.nonOrientable === false);
check('§W-teeth subdivided RP² w1Class === [1] (the genuine w₁ — the fix)', eq(subRp2.w1Class, [1]));
check('§W-teeth the subdivision FLIPS the verdict: raw [0] ≠ subdivided [1]', !eq(rawRp2.w1Class, subRp2.w1Class));

// ===================== discipline guard =====================
console.log('\n----- discipline: derive-only, Shape unmutated -----');
check('Shape byte-unchanged (no mutation by any certifier call)', JSON.stringify(shape) === shapeSnapshot);

// ===================== summary =====================
console.log('');
if (failures === 0) {
  console.log('ALL PASS');
} else {
  console.log(`${failures} FAIL`);
  process.exit(1);
}

#!/usr/bin/env node

// DIAGNOSTIC — D1: THE MEASURED METRIC BASE REACHES THE CAPTION (2026-08-14
// mandate, mothership nod 1535 — the first complete end-to-end carry:
// positions → angle → dihedral → cone angle → caption).
//
// ★ THE CARRY DECLARATION (the standing carry-chain law): I hand in a placed
// arity-2 thicken product and read the resolved cone-source / caption; I do
// NOT walk or render. The live window is the mothership's drive.
//
// ⛔ THE NON-NEGOTIABLE PROPERTY THIS BITES: every arity-2 product either
// resolves its base → the SEALED metric, or the caption REFUSES BY NAME —
// NEVER a silent k×90° heuristic in measured clothing. (A cube / non-owned
// seed stays heuristic legitimately.)
//
// THE FOUR CASES (the mandate's acceptance):
//   a  a thicken product WITH its base handed in → measured 300° (the door-3
//      terrain fan — the shelf-routed shape of the person's flow);
//   b  the PAGE-NATIVE coverage: the view's thread is source-pinned — the
//      base id is carried at BOTH mint branches + the panel glue, the model
//      resolve reads the carried id, and thickenManuscript returns the
//      product record's parents (thicken:305). The model seam (a) is the
//      same seam page-native rooms hit — by construction.
//   c  an OWNED product whose base does NOT resolve → 'unresolved-base',
//      refusal BY NAME (both the named-missing and the no-record shapes);
//   d  a cube-seeded room (the committed T³) → heuristic, positively marked.
//
// Placed in scripts/app-leg/ (the non-suite diagnostics home) — the flat
// suite glob stays at its 112 @ 1 baseline.

const fs = require('node:fs');
const path = require('node:path');
const repoRoot = path.resolve(__dirname, '..', '..');
const ts = require(path.join(repoRoot, 'node_modules', 'typescript'));
require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
      fileName: filename,
    }).outputText,
    filename,
  );
};
require.extensions['.tsx'] = require.extensions['.ts'];
const req = (p) => require(path.join(repoRoot, p));

const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { applyPyritohedralDiagonalization } = req('src/lib/pyritohedralDiagonalization.ts');
const { openLift } = req('src/lib/openLift.ts');
const { thicken } = req('src/lib/thicken.ts');
const { buildFormDomain } = req('src/manuscript/formDomainModel.ts');
const A = req('src/manuscript/apertureModel.ts');
const { buildThreeTorusDomain } = req('src/manuscript/worldModel.ts');

console.log('I hand in a placed arity-2 thicken product and read the resolved cone-source / caption; I do NOT walk or render.');

let failures = 0;
const check = (label, pass, detail = '') => {
  console.log(`${pass ? 'PASS' : 'FAIL'} - ${label}${detail ? ` — ${detail}` : ''}`);
  if (!pass) failures += 1;
};

// ---- the arity-2 product (the door-3 terrain fan × segment) ----------------
const cube1 = applyAmboDissection(createSeedShape('cube'));
const cubocta = cube1.cells.find((c) => c.topology === 'cuboctahedron' && c.kind !== 'parent');
const terrain = applyPyritohedralDiagonalization(cube1, cubocta.id);
const coreCell = terrain.cells.find((c) => c.kind === 'core' && c.sourceOperation === 'pyritohedral-diagonalization');
const mid = Object.values(terrain.vertices).find(
  (v) => v.createdBy && v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2,
).id;
const lift = openLift(terrain, mid, coreCell.id);
const segment = {
  id: 'shape:d1-seg',
  name: 'd1 segment',
  vertices: {
    s0: { id: 's0', position: [0, 0, 0], data: { label: 's0' }, createdBy: { shapeId: 'shape:d1-seg', operation: 'seed', sourceVertexIds: [] } },
    s1: { id: 's1', position: [0, 0, 1], data: { label: 's1' }, createdBy: { shapeId: 'shape:d1-seg', operation: 'seed', sourceVertexIds: [] } },
  },
  edges: [{ id: 'e:s0-s1', vertexIds: ['s0', 's1'] }],
  faces: [],
  cells: [],
  generations: [],
  genealogy: { parentShapeId: null, operation: 'seed', generationDepth: 0, sourceVertexIds: [], createdVertexIds: [], createdAt: '' },
};
const band = thicken(lift.shape, segment);
const product = band.shape;
check(
  'the arity-2 record (2(b) recut, B-2026-08-22-C): parentShapeId NAMES THE BASE — the pointer is the record at both arities (the band\'s meaning IS shape × segment, and the metric operand must be findable across a hop) · product.parents still names both parents (thicken)',
  product.genealogy.parentShapeId === lift.shape.id && band.product.parents?.shapeId === lift.shape.id,
  `parentShapeId===base: ${product.genealogy.parentShapeId === lift.shape.id} · parents.shapeId=${band.product.parents?.shapeId?.slice(0, 40)}`,
);
const domain = buildFormDomain(product, [], 'd1-room', 'the d1 fan room');

// ---- (a) the base handed in → SEALED measured 300° -------------------------
console.log('\n— (a) the base resolves → measured —');
const gateA = A.buildAperture(domain, { base: lift.shape });
check(
  '(a) metricSource MEASURED and the label reads the sealed 1 × 300°',
  gateA.ok === true &&
    gateA.geometry.metricSource === 'measured' &&
    gateA.geometry.label.includes('cone edges (measured): 1 × 300°'),
  gateA.ok ? gateA.geometry.label.slice(0, 90) : String(gateA.reason).slice(0, 90),
);

// ---- (c) owned + unresolved → REFUSE BY NAME (both shapes) -----------------
console.log('\n— (c) owned + unresolved → refuse BY NAME, never silent 450° —');
const gateNamed = A.buildAperture(domain, { baseMissing: 'the recorded metric base "shape:test" is no longer on the page' });
check(
  '(c1) a NAMED-missing base: kind unresolved-base · the label speaks the reason · NO k×90° numbers claimed',
  gateNamed.ok === true &&
    gateNamed.geometry.metricSource === 'unresolved-base' &&
    gateNamed.geometry.label.includes('sealed metric UNRESOLVED') &&
    gateNamed.geometry.label.includes('no longer on the page') &&
    gateNamed.geometry.coneEdges === null,
  gateNamed.ok ? gateNamed.geometry.label.slice(0, 110) : '',
);
const gateBare = A.buildAperture(domain);
check(
  '(c2) the FLOOR even when a path escapes the thread: NO lineage at all on an owned product → unresolved-base with the default sentence — never HEURISTIC',
  gateBare.ok === true &&
    gateBare.geometry.metricSource === 'unresolved-base' &&
    gateBare.geometry.coneEdges === null &&
    /could not be resolved/.test(gateBare.geometry.label),
  gateBare.ok ? gateBare.geometry.label.slice(0, 110) : '',
);

// ---- (d) the cube stays heuristic, positively marked -----------------------
console.log('\n— (d) a cube-seeded room → heuristic, legitimately —');
const t3 = buildThreeTorusDomain();
const gateT3 = A.buildAperture(t3);
check(
  '(d) the committed T³ (cube-seeded, no owned dihedrals) reads HEURISTIC — not a refusal (that is not the defect) — and the fact is positive on the geometry',
  gateT3.ok === true && gateT3.geometry.metricSource === 'heuristic',
  gateT3.ok ? `metricSource=${gateT3.geometry.metricSource} · ${gateT3.geometry.label.slice(0, 60)}` : '',
);

// ---- (b) the page-native coverage: the view thread, source-pinned ----------
console.log('\n— (b) the view thread (page-native + shelf-routed alike), source-pinned —');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
const storeSrc = fs.readFileSync(path.join(repoRoot, 'src/store/geometryStore.ts'), 'utf8');
// D8+D9 recut (2026-08-15 engineer 1629, disclosed) + amendment 1759: the
// door resolves the CARRIED PRODUCT-RECORD base — `productMetricBasesRef`,
// written at the thicken mint keyed by the product's MINT id — through the
// model's `resolveCarriedMetricBase` (the loaded id is RE-NAMESPACED; the
// mint id survives as its strict `:`-suffix; ambiguity REFUSES BY NAME,
// case (e) below) — never the crowned pointer, and never the dead
// `parent?.id` fallback (placeShelfEntry sets parentShape null by
// construction). The D9 deletion removed the auto-build's direct write; the
// door's BOTH-exit writes are the only carriers onto built rooms.
const modelSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureModel.ts'), 'utf8');
check(
  '(b) the thread stations all present (2(b) recut): the join hands the OPERAND (`[shape]` rides the file); the POINTER is read FIRST when it resolves on the page (a record read — never a string marriage); the D8 carried map is the mint-time EXACT fallback (the suffix walk + its ambiguity guard are DEAD in the model); base OR refusal still written at BOTH exits; the reader hands either to the D1 floor; the caption slot table holds all three positive marks',
  storeSrc.includes('metricBaseId: band.product.parents?.shapeId ?? null') &&
    storeSrc.includes('shapeId: band.shape.id') &&
    // S2 recut: the call gained the designation 4th arg (sourceName — the
    // split's cargo); the OPERAND pin's meaning is untouched — `[shape]`
    // still rides the file as the join's operand
    storeSrc.includes('serializeSnapshot(band.shape, shape.id, [shape], shape.name)') &&
    viewSrc.includes('productMetricBasesRef.current.set(shapeId, metricBaseId)') &&
    viewSrc.includes('if (pointer && shapeById.has(pointer)) return { baseId: pointer, ambiguity: null };') &&
    viewSrc.includes('resolveCarriedMetricBase(apertureVolume.id, productMetricBasesRef.current)') &&
    !modelSrc.includes('volumeId.endsWith(`:${mintId}`)') &&
    !modelSrc.includes('if (matches.length > 1)') &&
    !viewSrc.includes('apertureTarget?.parent?.id ?? null') &&
    !viewSrc.includes('[`built-${n}`]: metricBaseId') &&
    (viewSrc.match(/\[`built-\$\{n\}`\]: apertureVolumeBase\.baseId as string/g) ?? []).length === 2 &&
    (viewSrc.match(/\[`built-\$\{n\}`\]: apertureVolumeBase\.ambiguity as string/g) ?? []).length === 2 &&
    viewSrc.includes('metricBaseIds[model.key]') &&
    viewSrc.includes('metricBaseRefusals[model.key]') &&
    viewSrc.includes('baseMissing: metricAmbiguity') &&
    viewSrc.includes('baseMissing: `the recorded metric base') &&
    viewSrc.includes("'unresolved-base': 'sealed metric UNRESOLVED'") &&
    viewSrc.includes('METRIC_MARK[metricSource]'),
  'the pins (pointer-first + operand-riding join + dead suffix walk; both-exit writes; the D1 floor + slot table)',
);

// ---- (e) 2(b) recut — THE SUFFIX WALK IS DEAD (ruling (i)): the resolver
// is exact-only; a hopped id resolves through the POINTER road, never here
console.log('\n— (e) the resolve is exact-only: the suffix class is dead, nothing is guessed —');
{
  const carried = new Map([
    ['shape:thicken:inner', 'base-A'],
    ['nest:shape:thicken:inner', 'base-B'], // its mint id ENDS WITH the first's — the old planted nesting
  ]);
  const hopped = A.resolveCarriedMetricBase('snapshot:src:nest:shape:thicken:inner', carried);
  check(
    '(e1) a HOPPED id (the old two-suffix-match plant) resolves NOTHING here — no pick, no sentence: the walk that needed the ambiguity guard is dead, and the pointer road owns the hopped case',
    hopped.baseId === null && hopped.ambiguity === null,
  );
  const wouldBeSuffix = A.resolveCarriedMetricBase(
    'snapshot:src:shape:thicken:solo',
    new Map([['shape:thicken:solo', 'base-C']]),
  );
  check(
    '(e2) the old one-suffix-match case resolves NOTHING here either — identity across a hop is a RECORD, never a string relation',
    wouldBeSuffix.baseId === null && wouldBeSuffix.ambiguity === null,
  );
  const exact = A.resolveCarriedMetricBase('nest:shape:thicken:inner', carried);
  check(
    '(e3) an EXACT id match is the identity and wins outright — the un-hopped mint-time case, unchanged',
    exact.baseId === 'base-B' && exact.ambiguity === null,
  );
  const none = A.resolveCarriedMetricBase('snapshot:src:shape:other', carried);
  check('(e4) ZERO matches ⇒ nothing (the caller\'s pointer road stands)', none.baseId === null && none.ambiguity === null);
}

console.log(failures === 0 ? '\nDIAGNOSE-D1-METRIC-THREAD: ALL GREEN' : `\nDIAGNOSE-D1-METRIC-THREAD: ${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);

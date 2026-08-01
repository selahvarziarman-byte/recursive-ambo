#!/usr/bin/env node

// DIAGNOSTIC — R1, THE DEFICIT REGISTER: the per-vertex deficit drawn as the
// HOLONOMY WEDGE (the first render phase). The witness asserts on the
// TESTABLE MODEL (deficitRegisterModel), never pixels.
//
// THE CLAUSES:
//   E1 — the wedge READS the owned curvature (readVertexCurvatures), never
//        recomputes it; a perturbed datum CHANGES the wedge (in-witness
//        plant, every run).
//   E2 ★★ THE SIGN IS TWO MARKS: +δ and −δ of equal |δ| land the return on
//        OPPOSITE sides of a COMMON departure — coordinates differ, not a
//        label (the designer's pixel-identical bug is the scar this catches).
//   E3 — SILENT AT ZERO: the flat torus (all δ=0) emits NO mark; mark count
//        == non-zero-δ vertex count everywhere.
//   E4 — the BOUNDARY sibling wears the rim turn (π−Σθ, open circuit); a
//        JUNCTION/pinch refuses the whole register (bodiless — no mark).
//   E5 — the ink is verdigris #2f6b6b (≠ Σ's #5e2a63); the WORLD layer
//        prints NO numerals; the SPECIMEN card says "cone point · deficit N°".
//   E6 — the frozen render set (InkedForm/InkedDomain/inkedFormModel) is
//        BYTE-IDENTICAL to HEAD.
//
// Anti-mock: the REAL TS modules through the transpile hook.

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
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

const { usePlaygroundStore } = req('src/store/playgroundStore.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { applyPlaygroundOperationTo, invokePrimitive } = req('src/manuscript/writtenFormModel.ts');
const { acquireComplex, identify } = req('src/lib/complexIdentification.ts');
const { subdivideFace } = req('src/lib/surfaceRefinement.ts');
const { computeSeedCornerAngles, readVertexCurvatures, gaussBonnetTotal } = req('src/lib/conformalAtom.ts');
const { buildDeficitRegisterModel, buildDeficitMarkGeometry, deficitCardRows, DEFICIT_RADIUS_FRACTION } = req(
  'src/manuscript/deficitRegisterModel.ts',
);

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const near = (a, b, eps = 1e-9) => Math.abs(a - b) < eps;
const P = Math.PI;
let seq = 500;

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

console.log('R1 — THE DEFICIT REGISTER: the holonomy wedge reads the owned deficit\n');

const G = () => usePlaygroundStore.getState();
G().resetPlayground();

// ---------------------------------------------------------------------------
// §1 (E1) the wedge reads the REAL deficit — and tracks a perturbed datum
// ---------------------------------------------------------------------------
console.log('----- §1 (E1) the wedge angle IS the owned curvature; the plant bends it -----');
const cube = computeSeedCornerAngles(createSeedShape('cube'));
const cubeReadings = readVertexCurvatures(cube);
const cubeModel = buildDeficitRegisterModel(cube);
const byVertex = new Map(cubeModel.marks.map((m) => [m.vertexId, m]));
note(`cube: ${cubeModel.marks.length} marks · wedges {${[...new Set(cubeModel.marks.map((m) => ((m.wedgeAngle * 180) / P).toFixed(1)))].join(',')}}° · sides {${[...new Set(cubeModel.marks.map((m) => m.side))].join(',')}}`);
check('§1 (E1) every cube mark\'s wedgeAngle == its vertex\'s readVertexCurvatures curvature VERBATIM (8 interior cones, δ = π/2 — drawn, never recomputed)',
  cubeModel.marked &&
    cubeModel.marks.length === 8 &&
    cubeReadings.every((r) => {
      const mark = byVertex.get(r.vertexId);
      return mark && near(mark.wedgeAngle, r.curvature) && near(r.curvature, P / 2);
    }));
check('§1 (E1) the mark\'s GEOMETRY carries the same angle: acos(departure·return) == |δ| and the swing side matches sign(δ) ((dep×ret)·normal > 0 for +δ) — the wedge IS the reading, in coordinates',
  cubeModel.marks.every((m) => {
    const geometricAngle = Math.acos(Math.max(-1, Math.min(1, dot(m.departure, m.returnDir))));
    const sideSign = dot(cross(m.departure, m.returnDir), m.normal);
    return near(geometricAngle, Math.abs(m.curvature), 1e-6) && sideSign > 0 === m.curvature > 0;
  }));
// THE PLANT (runs every time): perturb the DATUM (one face's atoms +0.01) —
// the wedge at that face's vertices MUST change (the mark tracks the datum)
const biased = {
  ...cube,
  faces: cube.faces.map((f, i) =>
    i === 0 ? { ...f, cornerAngles: f.cornerAngles.map((a) => a + 0.01) } : f,
  ),
};
const biasedModel = buildDeficitRegisterModel(biased);
const biasedByVertex = new Map(biasedModel.marks.map((m) => [m.vertexId, m]));
const touched = new Set(cube.faces[0].vertexIds);
check('§1 (E1) THE PLANT BITES: a +0.01 datum perturbation moves EXACTLY the touched vertices\' wedges by −0.01 (the mark invents nothing; untouched wedges byte-equal)',
  cubeModel.marks.every((m) => {
    const b = biasedByVertex.get(m.vertexId);
    if (!b) return false;
    return touched.has(m.vertexId)
      ? near(b.wedgeAngle, m.wedgeAngle - 0.01, 1e-9)
      : near(b.wedgeAngle, m.wedgeAngle);
  }));

// ---------------------------------------------------------------------------
// §2 (E2) ★★ THE SIGN IS TWO MARKS — opposite sides, in coordinates
// ---------------------------------------------------------------------------
console.log('\n----- §2 (E2) ★★ cone vs saddle of equal |δ|: geometrically distinct, never a label -----');
const normal = [0, 0, 1];
const ref = [1, 0, 0];
const conePlus = buildDeficitMarkGeometry(normal, ref, 0.4);
const saddleMinus = buildDeficitMarkGeometry(normal, ref, -0.4);
const radius = 0.2;
const tip = (g) => [g.returnDir[0] * radius * 1.35, g.returnDir[1] * radius * 1.35, g.returnDir[2] * radius * 1.35];
const tipPlus = tip(conePlus);
const tipMinus = tip(saddleMinus);
note(`+0.4 return tip [${tipPlus.map((x) => x.toFixed(4)).join(', ')}] · −0.4 return tip [${tipMinus.map((x) => x.toFixed(4)).join(', ')}]`);
check('§2 (E2) ★★ +δ and −δ of EQUAL |δ| share the departure but land the return-stroke tips at DIFFERENT COORDINATES on OPPOSITE sides ((dep×ret)·n flips sign) — two marks, structurally never one-mark-plus-caption',
  conePlus !== null &&
    saddleMinus !== null &&
    conePlus.departure.every((x, k) => near(x, saddleMinus.departure[k])) &&
    tipPlus.some((x, k) => !near(x, tipMinus[k], 1e-12)) &&
    dot(cross(conePlus.departure, conePlus.returnDir), normal) > 0 &&
    dot(cross(saddleMinus.departure, saddleMinus.returnDir), normal) < 0 &&
    conePlus.side === 'cone' &&
    saddleMinus.side === 'saddle');

// ---------------------------------------------------------------------------
// §3 (E3) SILENT AT ZERO — the flat torus draws NOTHING
// ---------------------------------------------------------------------------
console.log('\n----- §3 (E3) the silence law: δ=0 is no mark, and counts match everywhere -----');
const host = G().invokeForm(nGon(4), 'r1T');
const torusBorn = applyPlaygroundOperationTo('glue-torus', host, null, (seq += 1), 8, [], null);
const torusShape = torusBorn.born.shape;
const torusAcq = acquireComplex(torusShape, [host]);
const torusModel = buildDeficitRegisterModel(torusShape, torusAcq ? torusAcq.complex : undefined);
note(`flat torus: marked=${torusModel.marked} · marks=${torusModel.marks.length} (every Σθ = 2π — silence is the value)`);
check('§3 (E3) THE FLAT TORUS IS SILENT: the read succeeds (marked, no refusal) and emits ZERO marks — δ=0 draws nothing (no badge, no "0°")',
  torusModel.marked && torusModel.refusal === null && torusModel.marks.length === 0);
check('§3 (E3) the count law on every subject: marks == non-zero-δ readings (cube 8/8 · torus 0/1-vertex-flat)',
  cubeModel.marks.length === cubeReadings.filter((r) => Math.abs(r.curvature) > 1e-9).length &&
    torusModel.marks.length ===
      readVertexCurvatures(torusShape, torusAcq ? torusAcq.complex : undefined).filter(
        (r) => Math.abs(r.curvature) > 1e-9,
      ).length);

// ---------------------------------------------------------------------------
// §4 (E4) the boundary sibling + the junction refusal
// ---------------------------------------------------------------------------
console.log('\n----- §4 (E4) boundary wears the rim turn; the junction refuses whole -----');
const sq = G().invokeForm(nGon(4), 'r1B');
const f = sq.faces[0];
const sub = subdivideFace(sq, f, f.vertexIds[0], f.vertexIds[2]).shape;
const subReadings = readVertexCurvatures(sub);
const subModel = buildDeficitRegisterModel(sub);
note(`subdivided square: ${subModel.marks.length} marks · valences {${[...new Set(subModel.marks.map((m) => m.valence))].join(',')}} · circuits {${[...new Set(subModel.marks.map((m) => m.circuit))].join(',')}} · wedges {${[...new Set(subModel.marks.map((m) => ((m.wedgeAngle * 180) / P).toFixed(1)))].join(',')}}°`);
check('§4 (E4) BOUNDARY vertices wear the RIM TURN: all 4 marks valence \'boundary\', circuit OPEN (no closed frame on the rim), wedge == π−Σθ verbatim (π/2 at every rim vertex of the subdivided square)',
  subModel.marked &&
    subModel.marks.length === 4 &&
    subModel.marks.every(
      (m) =>
        m.valence === 'boundary' &&
        m.circuit === 'open' &&
        near(m.wedgeAngle, P / 2) &&
        near(
          m.wedgeAngle,
          subReadings.find((r) => r.vertexId === m.vertexId).curvature,
        ),
    ));
const rim = sub.edges.find((e) => !e.id.includes(':chord'));
const chord = sub.edges.find((e) => e.id.includes(':chord'));
const pinch = identify(sub, [rim.id], [chord.id], 'preserving', null);
const pinchModel = buildDeficitRegisterModel(pinch.shape, pinch.complex);
note(`pinch: marked=${pinchModel.marked} · refusal="${String(pinchModel.refusal).slice(0, 80)}…"`);
check('§4 (E4) THE JUNCTION REFUSES WHOLE: the rim⊕chord pinch reads marked=false with the reader\'s own junction sentence and ZERO marks (a pinched form is bodiless — no body, no mark; never a false wedge)',
  pinchModel.marked === false &&
    String(pinchModel.refusal).includes('link valence "junction"') &&
    pinchModel.marks.length === 0);

// ---------------------------------------------------------------------------
// §4-FIX-A (R1-FIX E1) ★ THE SQUARE IS WIRED — the manuscript invoke owns
// ---------------------------------------------------------------------------
console.log('\n----- §4-FIX-A (E1) ★ the wired square: the manuscript invoke path owns the atom -----');
const invoked = invokePrimitive('square', 900);
const wired = { ...invoked, shape: computeSeedCornerAngles(invoked.shape) }; // the view's exact stamp
const wiredReadings = readVertexCurvatures(wired.shape);
const wiredModel = buildDeficitRegisterModel(wired.shape);
note(`invoked square (wired): ${wiredModel.marks.length} marks · valences {${[...new Set(wiredModel.marks.map((m) => m.valence))].join(',')}} · wedges {${[...new Set(wiredModel.marks.map((m) => ((m.wedgeAngle * 180) / P).toFixed(1)))].join(',')}}° · Σ = ${((gaussBonnetTotal(wiredReadings) * 180) / P).toFixed(1)}°`);
check('§4-FIX-A (E1) ★ THE SQUARE IS WIRED: the manuscript-invoked square through the view\'s stamp reads OWNED — 4 boundary marks at 90° (rim turns), Σ = 360° = 2πχ (χ=1 disk) — was: throws/blank',
  wiredModel.marked &&
    wiredModel.marks.length === 4 &&
    wiredModel.marks.every((m) => m.valence === 'boundary' && near(m.wedgeAngle, P / 2)) &&
    near(gaussBonnetTotal(wiredReadings), 2 * P));
check('§4-FIX-A (E1) …and the card reads `rim turn · 90° ×4` (the designer\'s boundary wording — "deficit" dropped on the rim row)',
  (() => {
    const rows = deficitCardRows(wiredModel);
    return rows.length === 1 && rows[0].label === 'deficit' && rows[0].value === 'rim turn · 90° ×4';
  })());
const viewSrcWire = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check('§4-FIX-A (E1) the WIRING is at BOTH manuscript invoke sites (handleInvoke stamps `invoked.shape`; the zoo host stamps `invokedHost.shape`) — no un-owned invoke path remains in the view',
  viewSrcWire.includes('computeSeedCornerAngles(invoked.shape)') &&
    viewSrcWire.includes('computeSeedCornerAngles(invokedHost.shape)') &&
    (viewSrcWire.match(/invokePrimitive\(/g) ?? []).length === 2);

// ---------------------------------------------------------------------------
// §4-FIX-B (R1-FIX E2/E3) ★★ THE SILENCE SPLITS — refused ≠ flat
// ---------------------------------------------------------------------------
console.log('\n----- §4-FIX-B (E2/E3) ★★ the silence splits: a refusal SPEAKS, genuine flatness stays silent -----');
const pinchRows = deficitCardRows(pinchModel);
const torusRows = deficitCardRows(torusModel);
note(`pinch rows: ${JSON.stringify(pinchRows.map((r) => `${r.label}: ${r.value.slice(0, 60)}…`))}`);
note(`flat-torus rows: ${JSON.stringify(torusRows)} (genuine silence)`);
check('§4-FIX-B (E2) ★★ THE REFUSED FORM SPEAKS: the junction/pinch model yields ONE refusal row — `not measured · <the reader\'s own sentence>` — while the genuinely FLAT torus yields NO row (different facts, different branches)',
  pinchRows.length === 1 &&
    pinchRows[0].label === 'deficit' &&
    pinchRows[0].value.startsWith('not measured · ') &&
    pinchRows[0].value.includes('link valence "junction"') &&
    torusRows.length === 0);
check('§4-FIX-B (E3) THE REFUSAL IS HONEST: the row prints the reader\'s sentence VERBATIM and carries NO degree glyph, NO number-with-°, NO "flat"/"0°" (not-measured is never zero)',
  pinchRows[0].value.includes(String(pinchModel.refusal)) &&
    !pinchRows[0].value.includes('°') &&
    !pinchRows[0].value.toLowerCase().includes('flat'));
// THE PLANT (runs every time): force a MEASURED-flat model into the refused
// branch — a row MUST appear (the split is real, not cosmetic)
const plantedSwap = deficitCardRows({ ...torusModel, marked: false, refusal: 'PLANTED-REFUSAL sentence' });
check('§4-FIX-B (E2) THE PLANT BITES: the same flat model FORCED to marked:false flips from silence to a refusal row carrying the planted sentence — the branch split is real',
  plantedSwap.length === 1 && plantedSwap[0].value === 'not measured · PLANTED-REFUSAL sentence');

// ---------------------------------------------------------------------------
// §4-FIX-C (R1-FIX E4) the two deltas landed; the fill UNTOUCHED
// ---------------------------------------------------------------------------
console.log('\n----- §4-FIX-C (E4) the deltas: circuit ON the surface · radius/reach floored · fill untouched -----');
const cubeShortest = Math.min(
  ...cube.edges.map((e) => {
    const a = cube.vertices[e.vertexIds[0]].position;
    const b = cube.vertices[e.vertexIds[1]].position;
    return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  }),
);
const onSurface = cubeModel.marks.every((m) =>
  m.circuitArcs.length > 0 &&
  m.circuitArcs.every((arc) =>
    arc.length >= 2 &&
    arc.every((p) => {
      const d = [p[0] - m.center[0], p[1] - m.center[1], p[2] - m.center[2]];
      const r = Math.hypot(d[0], d[1], d[2]);
      if (Math.abs(r - m.radius) > 1e-9) return false;
      // the point must lie in the plane of SOME face incident to the vertex
      return cube.faces.some((face) => {
        if (!face.vertexIds.includes(m.vertexId)) return false;
        const [i0, i1, i2] = face.vertexIds;
        const p0 = cube.vertices[i0].position;
        const p1 = cube.vertices[i1].position;
        const p2 = cube.vertices[i2].position;
        const u = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
        const v = [p2[0] - p0[0], p2[1] - p0[1], p2[2] - p0[2]];
        const n = cross(u, v);
        const nl = Math.hypot(n[0], n[1], n[2]);
        if (nl < 1e-12) return false;
        const off = ((p[0] - p0[0]) * n[0] + (p[1] - p0[1]) * n[1] + (p[2] - p0[2]) * n[2]) / nl;
        return Math.abs(off) < 1e-9;
      });
    }),
  ),
);
check('§4-FIX-C (E4) delta #1 LANDED: every cube circuit point lies ON the surface — in the plane of an incident face, at exactly the mark\'s radius (3 arcs per corner; never a detached tangent-plane hoop)',
  onSurface && cubeModel.marks.every((m) => m.circuitArcs.length === 3));
const layerSrcDelta = fs.readFileSync(path.join(repoRoot, 'src/manuscript/InkedDeficitLayer.tsx'), 'utf8');
check('§4-FIX-C (E4) delta #2 LANDED (the floor): DEFICIT_RADIUS_FRACTION = 0.12 (measured on the model: radius = 0.12 × shortest incident edge) · DEFICIT_REACH = 1.15 — and the marks CANNOT obscure: 2·radius·reach < the shortest edge',
  DEFICIT_RADIUS_FRACTION === 0.12 &&
    cubeModel.marks.every((m) => near(m.radius, 0.12 * cubeShortest, 1e-9)) &&
    layerSrcDelta.includes('export const DEFICIT_REACH = 1.15;') &&
    2 * 0.12 * cubeShortest * 1.15 < cubeShortest);
check('§4-FIX-C (E4) delta #3 RETRACTED — the wedge fill is UNTOUCHED: DEFICIT_WEDGE_OPACITY = 0.2 verbatim in the layer',
  layerSrcDelta.includes('export const DEFICIT_WEDGE_OPACITY = 0.2;'));

// ---------------------------------------------------------------------------
// §5 (E5) the ink + the two registers (source reads, code-only)
// ---------------------------------------------------------------------------
console.log('\n----- §5 (E5) verdigris ≠ Σ-violet; the WORLD carries no numerals; the SPECIMEN card speaks -----');
const stripComments = (src) => src.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
const layerSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/InkedDeficitLayer.tsx'), 'utf8');
const fieldSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/InkedFieldLayer.tsx'), 'utf8');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
const layerCode = stripComments(layerSrc);
const deficitInk = (layerSrc.match(/DEFICIT_INK = '(#[0-9a-f]{6})'/) ?? [])[1];
const sigmaInk = (fieldSrc.match(/SIGMA_INK = '(#[0-9a-f]{6})'/) ?? [])[1];
note(`deficit ink ${deficitInk} · sigma ink ${sigmaInk}`);
check('§5 (E5) THE INK IS RESERVED: the layer\'s verdigris is #2f6b6b, Σ\'s iron-gall violet is #5e2a63, and they differ (a VERTEX species vs an EDGE species — never shared)',
  deficitInk === '#2f6b6b' && sigmaInk === '#5e2a63' && deficitInk !== sigmaInk);
check('§5 (E5) THE WORLD PRINTS NO NUMERALS: the layer\'s CODE renders no text at all — no Html, no drei Text, no toFixed, no degree glyph (the number lives on the specimen card only)',
  !layerCode.includes('Html') &&
    !layerCode.includes('Text') &&
    !layerCode.includes('toFixed') &&
    !layerCode.includes('°'));
// R1-FIX ruled recut: the row builder MOVED into the testable model
// (deficitCardRows) — the phrase greps follow the true fact to its new home;
// the view now consumes the model's rows (the split lives where the witness
// can drive it).
const modelSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/deficitRegisterModel.ts'), 'utf8');
check('§5 (E5) THE SPECIMEN CARD SPEAKS THE RESEARCHER\'S PHRASE from the TESTABLE model: deficitCardRows phrases "cone point · deficit N°", the boundary row "rim turn · N°" (the designer\'s wording — no "deficit" on the rim row), and the view consumes deficitCardRows (never "holonomy" in card code)',
  modelSrc.includes('`cone point · deficit ${degrees}°`') &&
    modelSrc.includes('`rim turn · ${degrees}°`') &&
    !modelSrc.includes('rim turn · deficit') &&
    viewSrc.includes('deficitCardRows(buildDeficitRegisterModel(body))') &&
    !stripComments(viewSrc).toLowerCase().includes('holonomy'));

// ---------------------------------------------------------------------------
// §6 (E6) the frozen boundary
// ---------------------------------------------------------------------------
console.log('\n----- §6 (E6) the frozen render set is untouched -----');
const headEq = (p) => {
  const working = fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r/g, '');
  const head = execFileSync('git', ['show', `HEAD:${p}`], { cwd: repoRoot, encoding: 'utf8' }).replace(/\r/g, '');
  return working === head;
};
check('§6 (E6) FROZEN HELD: InkedForm.tsx · InkedDomain.tsx · inkedFormModel.ts BYTE-IDENTICAL to HEAD (the register composed as a sibling — no union owed)',
  ['src/manuscript/InkedForm.tsx', 'src/manuscript/InkedDomain.tsx', 'src/manuscript/inkedFormModel.ts'].every(headEq));
check('§6 (E5-FIX) THE FROZEN INVOKE SEAM HELD: writtenFormModel.ts · multiform.ts · primitiveCatalogue.ts · worldModel.ts · geometry.ts · the manifest BYTE-IDENTICAL to HEAD — the wire stamps at the NOT_FROZEN call site only',
  [
    'src/manuscript/writtenFormModel.ts',
    'src/lib/multiform.ts',
    'src/playground/primitiveCatalogue.ts',
    'src/manuscript/worldModel.ts',
    'src/types/geometry.ts',
    'docs/governance/ENGINE_FREEZE_MANIFEST.txt',
  ].every(headEq));

console.log(
  `\n--- R1 THE DEFICIT REGISTER — the holonomy wedge (the owned deficit drawn, the sign two marks, silence at zero, the rim turn on the boundary, the junction refused): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

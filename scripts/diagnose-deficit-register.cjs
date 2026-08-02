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
// R1-REBUILD (2026-08-02, the re-opened defect — Arman-caught): the reader
// covered only plain+classBody; `faithful` fell through to a silent null and
// the fold-born CONE was never drawn. The recut §4-R exercises the APP path
// end-to-end (invokePrimitive → the handleInvoke stamp → applyFoldTo → the
// faithful render → the view's own dispatch):
//   §4-R E1 ★★ the fold-born cone SEALS on the substrate (apex interior 300°
//        + rim boundary 60°, Σ = 360° = 2πχ, source `recovered`), the marks
//        land ON the fan's real placements (reposition load-bearing), the
//        apex circuit CLOSES (the 2π wrap ring), the card reads the cone —
//        with the DROP FALSIFIER (the pre-fix two-mode selection yields null
//        on the same render) biting every run.
//   §4-R E2 ★★ the square fold: 0°(b) · 270°(i) · 90°(b), Σ = 2πχ; the 0°
//        boundary vertex stays silent (2 marks for 3 readings).
//   §4-R E3 ★★ the complex is LOAD-BEARING: the complex-less read turns the
//        rim false-interior and Σ = 540° ≠ 2πχ — no seal without the gate.
//   §4-R E4 ★★ EVERY mode resolves REASONED (N-A ≠ dropped): plain and
//        classBody byte-equal to the pre-recut reads · immersion a typed
//        declared-drop N-A over the MEASURED census (five flat; flip-glue/
//        RP² carries two real 180° cones, drawn nowhere on the smooth
//        surface) · skeleton a typed no-faces N-A · bodiless refuses and
//        SPEAKS · the dispatch source names every union arm + a never-floor.
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
const { applyPlaygroundOperationTo, invokePrimitive, buildBodilessWrittenForm } = req(
  'src/manuscript/writtenFormModel.ts',
);
const { applyFoldTo } = req('src/manuscript/handGestureModel.ts');
const { acquireComplex, identify } = req('src/lib/complexIdentification.ts');
const { acquireFaithfulComplex } = req('src/manuscript/surfaceClassifier.ts');
const { subdivideFace } = req('src/lib/surfaceRefinement.ts');
const { computeSeedCornerAngles, readVertexCurvatures, gaussBonnetTotal } = req('src/lib/conformalAtom.ts');
const {
  buildDeficitRegisterModel,
  buildDeficitMarkGeometry,
  deficitCardRows,
  faithfulDeficitDatum,
  readDeficitForRender,
  DEFICIT_RADIUS_FRACTION,
} = req('src/manuscript/deficitRegisterModel.ts');

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
// §4-FIX-A (R1-FIX2 E1/E2/E3) ★★ THE APP PATH IS OWNED — end-to-end on the
// EXACT object the app reads (`form.render.shape`), with the leak falsifier.
// R1-FIX2 ruled recut: the old clause tested a hand-stamped shape — it proved
// the STAMP works, never that the app CALLS it on the shape it reads (the
// 3rd model-vs-app miss: the ledger stamp was INERT for the register).
// ---------------------------------------------------------------------------
console.log('\n----- §4-FIX-A (E1/E2) ★★ the APP path: form.render.shape owned end-to-end + the leak falsifier -----');
const invoked = invokePrimitive('square', 900);
// the handleInvoke stamp logic, VERBATIM (the fix): ledger AND drawn body
const ownedShape = computeSeedCornerAngles(invoked.shape);
const wired = {
  ...invoked,
  shape: ownedShape,
  render: invoked.render.mode === 'plain' ? { ...invoked.render, shape: ownedShape } : invoked.render,
};
const appModel = buildDeficitRegisterModel(wired.render.shape); // THE APP'S READ TARGET
const appRows = deficitCardRows(appModel);
const appReadings = readVertexCurvatures(wired.render.shape);
const ownedAll = (s) => s.faces.every((f) => Array.isArray(f.cornerAngles));
note(`app path: render.mode=${wired.render.mode} · render.shape ${ownedAll(wired.render.shape) ? 'OWNED' : 'UN-OWNED'} · ${appModel.marks.length} marks · card ${JSON.stringify(appRows.map((r) => r.value))} · Σ = ${((gaussBonnetTotal(appReadings) * 180) / P).toFixed(1)}°`);
check('§4-FIX-A (E1) ★★ THE APP PATH IS OWNED end-to-end: invokePrimitive → the handleInvoke stamp → form.render.shape (the EXACT object InkedPlainForm and the card read) — 4 boundary marks at 90°, Σ = 360° = 2πχ, card `rim turn · 90° ×4`, NOT `not measured`',
  wired.render.mode === 'plain' &&
    appModel.marked &&
    appModel.marks.length === 4 &&
    appModel.marks.every((m) => m.valence === 'boundary' && near(m.wedgeAngle, P / 2)) &&
    near(gaussBonnetTotal(appReadings), 2 * P) &&
    appRows.length === 1 &&
    appRows[0].value === 'rim turn · 90° ×4');
check('§4-FIX-A (E1) THE INVARIANT: render.shape ownership == form.shape ownership (the ledger and the drawn body AGREE — the leak was exactly their disagreement)',
  ownedAll(wired.shape) === ownedAll(wired.render.shape) && ownedAll(wired.render.shape) === true);
// THE FALSIFIER (runs every time): the PRE-FIX state — the ledger-only stamp
// (render left un-stamped). The clause that would have caught the bug: the
// app's read target stays un-owned and the card says `not measured`.
const leak = { ...invoked, shape: ownedShape, render: invoked.render };
const leakModel = buildDeficitRegisterModel(leak.render.shape);
const leakRows = deficitCardRows(leakModel);
note(`the leak (ledger-only): render.shape ${ownedAll(leak.render.shape) ? 'OWNED' : 'UN-OWNED'} · card ${JSON.stringify(leakRows.map((r) => r.value.slice(0, 40)))}`);
check('§4-FIX-A (E2) ★★ THE LEAK FALSIFIER BITES every run: the ledger-only stamp (the pre-fix state) leaves form.render.shape UN-OWNED — the register refuses and the card reads `not measured · …` (this clause reads the APP\'s target; it would have caught the bug)',
  ownedAll(leak.shape) &&
    !ownedAll(leak.render.shape) &&
    leakModel.marked === false &&
    leakRows.length === 1 &&
    leakRows[0].value.startsWith('not measured · '));
// the zoo host, same end-to-end (E3)
const invokedZoo = invokePrimitive('square', 901);
const ownedZooShape = computeSeedCornerAngles(invokedZoo.shape);
const zooHost = {
  ...invokedZoo,
  shape: ownedZooShape,
  render: invokedZoo.render.mode === 'plain' ? { ...invokedZoo.render, shape: ownedZooShape } : invokedZoo.render,
};
check('§4-FIX-A (E3) the ZOO HOST\'s drawn body is owned too: the same carry at handleSummonZoo — host.render.shape reads 4 × 90° rim turns',
  (() => {
    const m = buildDeficitRegisterModel(zooHost.render.shape);
    return m.marked && m.marks.length === 4 && m.marks.every((x) => near(x.wedgeAngle, P / 2));
  })());
const viewSrcWire = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check('§4-FIX-A (E3) the CARRY is at BOTH manuscript invoke sites in the VIEW: each site stamps its shape AND patches its plain render body (`{ ...invoked.render, shape: ownedShape }` · `{ ...invokedHost.render, shape: ownedHostShape }`); exactly 2 invokePrimitive callers',
  viewSrcWire.includes('computeSeedCornerAngles(invoked.shape)') &&
    viewSrcWire.includes('computeSeedCornerAngles(invokedHost.shape)') &&
    viewSrcWire.includes('{ ...invoked.render, shape: ownedShape }') &&
    viewSrcWire.includes('{ ...invokedHost.render, shape: ownedHostShape }') &&
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
// §4-R (R1-REBUILD E1) ★★ THE FOLD-BORN CONE READS FAITHFUL — end-to-end on
// the APP path: invokePrimitive → the handleInvoke stamp VERBATIM → the fold
// panel's applyFoldTo (the app's own executor) → the faithful render → the
// view's own dispatch + lineage expression. Verified ON THE SUBSTRATE
// (readVertexCurvatures over the acquired complex), never off the card.
// ---------------------------------------------------------------------------
console.log('\n----- §4-R (E1) ★★ R1-REBUILD: the fold-born cone reads FAITHFUL end-to-end (the re-opened defect) -----');
const wireForm = (form) => {
  // the handleInvoke stamp logic, VERBATIM (the R1-FIX2 carry)
  const owned = computeSeedCornerAngles(form.shape);
  return {
    ...form,
    shape: owned,
    render: form.render.mode === 'plain' ? { ...form.render, shape: owned } : form.render,
  };
};
// the view's own lineage expression, verbatim (the resolution rows' chain)
const lineageOf = (form) => [form.shape, form.parentShape, ...(form.parentShapes ?? [])].filter(Boolean);
const vEq = (a, b) => Boolean(a) && Boolean(b) && a.every((x, i) => near(x, b[i], 1e-9));

const triInvoked = wireForm(invokePrimitive('triangle', 910));
const triFold = applyFoldTo(triInvoked.shape, triInvoked.parentShape, [], [{ edgeA: 0, edgeB: 1, mode: 'preserving' }], 911, 8);
check('§4-R (E1) the APP fold (invokePrimitive → the handleInvoke stamp → applyFoldTo, one preserving pair) routes FAITHFUL — the exact mode the defect dropped',
  triFold.ok && triFold.born.render.mode === 'faithful');
const tri = triFold.born;
const triRender = tri.render;
const triDatum = faithfulDeficitDatum(triRender.model, lineageOf(tri));
note(`datum ${triDatum.kind}${triDatum.kind === 'read' ? ` · source ${triDatum.source}` : ` · ${String(triDatum.refusal).slice(0, 60)}`}`);
check('§4-R (E1) ★ the datum ACQUIRES through the committed chain on the ORIGINAL quotient shape (source `recovered` — the load-bearing branch for quotient forms) and the app\'s ONE object is read (render.model.shape === form.shape)',
  triDatum.kind === 'read' && triDatum.source === 'recovered' && triRender.model.shape === tri.shape);
const triReadings = readVertexCurvatures(triRender.model.shape, triDatum.complex);
const triApexReading = triReadings.find((r) => r.valence === 'interior');
const triRimReading = triReadings.find((r) => r.valence === 'boundary');
note(`substrate: ${triReadings.map((r) => `${r.valence} ${((r.curvature * 180) / P).toFixed(1)}°`).join(' · ')} · Σ = ${((gaussBonnetTotal(triReadings) * 180) / P).toFixed(1)}° · complex χ = ${triDatum.complex.vertices.length - triDatum.complex.edges.length + triDatum.complex.faces.length}`);
check('§4-R (E1) ★★ THE SEALED SPECIMEN ON THE SUBSTRATE (never off the card): apex interior 300° + rim boundary 60°, Σ = 360° = 2πχ (χ = 1 from the acquired complex, V−E+F = 2−2+1)',
  triReadings.length === 2 &&
    triApexReading !== undefined &&
    triRimReading !== undefined &&
    near(triApexReading.curvature, (5 * P) / 3) &&
    near(triRimReading.curvature, P / 3) &&
    near(gaussBonnetTotal(triReadings), 2 * P) &&
    triDatum.complex.vertices.length - triDatum.complex.edges.length + triDatum.complex.faces.length === 1);
const triModel = buildDeficitRegisterModel(triDatum.shape, triDatum.complex);
const triApexMark = triModel.marks.find((m) => m.valence === 'interior');
const triRimMark = triModel.marks.find((m) => m.valence === 'boundary');
note(`marks: ${triModel.marks.map((m) => `${m.valence} ${((m.wedgeAngle * 180) / P).toFixed(1)}° @[${m.center.map((n) => +n.toFixed(2)).join(',')}] r=${m.radius.toFixed(3)} arcs=${m.circuitArcs.length}`).join(' · ')}`);
check('§4-R (E1) ★★ THE MARKS LAND ON THE FAN\'s REAL 3D PLACEMENTS (the cube delta-#1 lesson): apex mark at model.apex.position, rim mark at its own rimVertices position — and the REPOSITION IS LOAD-BEARING (both fan placements differ from the quotient\'s stored positions)',
  triModel.marked &&
    triModel.marks.length === 2 &&
    triApexMark !== undefined &&
    triRimMark !== undefined &&
    vEq(triApexMark.center, triRender.model.apex.position) &&
    vEq(triRimMark.center, (triRender.model.rimVertices.find((r) => r.id === triRimMark.vertexId) ?? { position: null }).position) &&
    !vEq(triRender.model.apex.position, triRender.model.shape.vertices[triApexMark.vertexId].position) &&
    !vEq(
      (triRender.model.rimVertices.find((r) => r.id === triRimMark.vertexId) ?? { position: null }).position,
      triRender.model.shape.vertices[triRimMark.vertexId].position,
    ));
check('§4-R (E1) THE APEX CIRCUIT CLOSES ON THE FAN (the wrap corner): one arc, ends coincident — the full 2π ring at the mark\'s radius on the disk; the rim wears the OPEN turn (no closed circuit, and the self-loop rim edge donates no zero radius — r = 0.12 × the seam span)',
  triApexMark.circuitArcs.length === 1 &&
    (() => {
      const arc = triApexMark.circuitArcs[0];
      const gap = Math.hypot(
        arc[0][0] - arc[arc.length - 1][0],
        arc[0][1] - arc[arc.length - 1][1],
        arc[0][2] - arc[arc.length - 1][2],
      );
      return (
        gap < 1e-9 &&
        arc.every((p) =>
          near(
            Math.hypot(p[0] - triApexMark.center[0], p[1] - triApexMark.center[1], p[2] - triApexMark.center[2]),
            triApexMark.radius,
            1e-9,
          ),
        )
      );
    })() &&
    triRimMark.circuit === 'open' &&
    near(triRimMark.radius, 0.12, 1e-9));
const triDispatch = readDeficitForRender(triRender, lineageOf(tri));
const triRows = triDispatch.kind === 'measured' ? deficitCardRows(triDispatch.model) : null;
note(`card: ${triRows ? JSON.stringify(triRows.map((r) => r.value)) : triDispatch.kind}`);
check('§4-R (E1) ★★ THE CARD READS THE CONE through the view\'s own dispatch: exactly {`cone point · deficit 300°`, `rim turn · 60°`}',
  triRows !== null &&
    triRows.length === 2 &&
    triRows.some((r) => r.value === 'cone point · deficit 300°') &&
    triRows.some((r) => r.value === 'rim turn · 60°'));
// THE DROP FALSIFIER (runs every time): the PRE-FIX dispatch — the two-mode
// body selection — on the SAME faithful render yields NULL → zero rows,
// indistinguishable from N-A. The clause that detects the exact shipped hole.
const preFixBody =
  triRender.mode === 'plain'
    ? triRender.shape
    : triRender.mode === 'classBody'
      ? (triRender.model.components?.[0]?.body ?? null)
      : null;
check('§4-R (E1) ★★ THE DROP FALSIFIER BITES every run: the pre-fix two-mode selection yields NULL for the faithful render (the silent drop) while the recut dispatch reads the cone — the hole is structurally detected, not assumed away',
  preFixBody === null && triRows !== null && triRows.length === 2);

// ---------------------------------------------------------------------------
// §4-R (E2) ★★ THE SQUARE FOLD — the mothership's corrected three-vertex
// reading, and the silence law riding the fan
// ---------------------------------------------------------------------------
console.log('\n----- §4-R (E2) ★★ the square fold: 0°(b) · 270°(i) · 90°(b), Σ = 2πχ; the 0° vertex stays silent -----');
const sqInvoked = wireForm(invokePrimitive('square', 912));
const sqFold = applyFoldTo(sqInvoked.shape, sqInvoked.parentShape, [], [{ edgeA: 0, edgeB: 1, mode: 'preserving' }], 913, 8);
const sqRender = sqFold.born.render;
const sqDatum = faithfulDeficitDatum(sqRender.model, lineageOf(sqFold.born));
const sqReadings = readVertexCurvatures(sqRender.model.shape, sqDatum.complex);
const sqSignature = sqReadings.map((r) => `${r.valence}:${Math.round((r.curvature * 180) / P)}`).sort();
note(`substrate: ${sqSignature.join(' · ')} · Σ = ${((gaussBonnetTotal(sqReadings) * 180) / P).toFixed(1)}°`);
check('§4-R (E2) ★★ THE SQUARE FOLD SEALS: faithful route, three vertex classes 0°(boundary) · 270°(interior) · 90°(boundary), Σ = 360° = 2πχ — the corrected reading, verbatim',
  sqFold.ok &&
    sqRender.mode === 'faithful' &&
    sqDatum.kind === 'read' &&
    sqReadings.length === 3 &&
    JSON.stringify(sqSignature) === JSON.stringify(['boundary:0', 'boundary:90', 'interior:270']) &&
    near(gaussBonnetTotal(sqReadings), 2 * P));
const sqModel = buildDeficitRegisterModel(sqDatum.shape, sqDatum.complex);
const sqDispatch = readDeficitForRender(sqRender, lineageOf(sqFold.born));
const sqRows = sqDispatch.kind === 'measured' ? deficitCardRows(sqDispatch.model) : null;
note(`marks ${sqModel.marks.length}/3 readings · card ${sqRows ? JSON.stringify(sqRows.map((r) => r.value)) : sqDispatch.kind}`);
check('§4-R (E2) THE SILENCE RIDES THE FAN: the 0° boundary vertex draws NOTHING (2 marks for 3 readings — δ=0 is silence, never a faint mark); card = {`cone point · deficit 270°`, `rim turn · 90°`}',
  sqModel.marks.length === 2 &&
    sqModel.marks.every((m) => Math.abs(m.wedgeAngle) > 1e-9) &&
    sqRows !== null &&
    sqRows.length === 2 &&
    sqRows.some((r) => r.value === 'cone point · deficit 270°') &&
    sqRows.some((r) => r.value === 'rim turn · 90°'));

// ---------------------------------------------------------------------------
// §4-R (E3) ★★ THE COMPLEX IS LOAD-BEARING — the no-complex plant
// ---------------------------------------------------------------------------
console.log('\n----- §4-R (E3) ★★ the complex plant: without the gate the rim reads false-interior and nothing seals -----');
const bareTri = readVertexCurvatures(triRender.model.shape); // NO complex — the plant
const bareSum = gaussBonnetTotal(bareTri);
note(`no-complex: ${bareTri.map((r) => `${r.valence} ${((r.curvature * 180) / P).toFixed(1)}°`).join(' · ')} · Σ = ${((bareSum * 180) / P).toFixed(1)}° (the seal needs 360°)`);
check('§4-R (E3) ★★ THE PLANT BITES: WITHOUT the acquired complex the fold-born rim reads FALSE-INTERIOR (no boundary valence survives) and Σ = 540° ≠ 2πχ — no seal; WITH the complex (E1) the same shape seals at 360°. The complex is load-bearing, measured',
  bareTri.every((r) => r.valence === 'interior') &&
    !near(bareSum, 2 * P) &&
    near(bareSum, 3 * P) &&
    near(gaussBonnetTotal(triReadings), 2 * P));

// ---------------------------------------------------------------------------
// §4-R (E4) ★★ EVERY MODE RESOLVES REASONED — N-A ≠ DROPPED (the scar's cure)
// ---------------------------------------------------------------------------
console.log('\n----- §4-R (E4) ★★ every render mode reasoned: plain · classBody · faithful · immersion · skeleton · bodiless -----');
// plain — byte-equal to the pre-recut read (the shipped behavior preserved)
const plainDispatch = readDeficitForRender(wired.render, lineageOf(wired));
check('§4-R (E4) PLAIN through the dispatch is BYTE-EQUAL to the direct register read: measured, 4 rim turns at 90° (nothing weakened by the recut)',
  plainDispatch.kind === 'measured' &&
    plainDispatch.model.marked &&
    plainDispatch.model.marks.length === 4 &&
    JSON.stringify(deficitCardRows(plainDispatch.model)) ===
      JSON.stringify(deficitCardRows(buildDeficitRegisterModel(wired.render.shape))));
// classBody — the REVERSING fold routes it (the seal's own discriminator)
const revInvoked = wireForm(invokePrimitive('triangle', 914));
const revFold = applyFoldTo(revInvoked.shape, revInvoked.parentShape, [], [{ edgeA: 0, edgeB: 1, mode: 'reversing' }], 915, 8);
const revRender = revFold.born.render;
const revDispatch = readDeficitForRender(revRender, lineageOf(revFold.born));
check('§4-R (E4) CLASSBODY still reads: the reversing fold routes classBody and the dispatch\'s rows are BYTE-EQUAL to the pre-recut selection\'s (components[0].body) — same read, same rows, nothing changed',
  revFold.ok &&
    revRender.mode === 'classBody' &&
    revDispatch.kind === 'measured' &&
    JSON.stringify(revDispatch.kind === 'measured' ? deficitCardRows(revDispatch.model) : null) ===
      JSON.stringify(deficitCardRows(buildDeficitRegisterModel(revRender.model.components[0].body))));
// immersion — the reachable population, census MEASURED on each cell body
const census = [];
let censusSeq = 916;
for (const op of ['glue-torus', 'glue-cylinder', 'flip-glue-klein', 'flip-glue', 'flip-glue-mobius', 'collapse-sphere']) {
  const host = wireForm(invokePrimitive('square', (censusSeq += 1)));
  const applied = applyPlaygroundOperationTo(op, host.shape, null, (censusSeq += 1), 8, [], null);
  const acq = acquireFaithfulComplex(applied.born.shape, [host.shape]);
  const readings = readVertexCurvatures(applied.born.shape, acq.complex);
  census.push({
    op,
    mode: applied.born.render.mode,
    flat: readings.every((x) => Math.abs(x.curvature) < 1e-9),
    sum: gaussBonnetTotal(readings),
    dispatch: readDeficitForRender(applied.born.render, lineageOf(applied.born)),
  });
}
note(census.map((c) => `${c.op}:${c.mode}:${c.flat ? 'flat' : `Σ=${((c.sum * 180) / P).toFixed(0)}°`}`).join(' · '));
check('§4-R (E4) IMMERSION is a REASONED, TYPED N-A for the whole reachable population (kind not-applicable + the declared-drop reason — never a silent null), and the census is MEASURED on the cell bodies: five gluings flat',
  census.every(
    (c) =>
      c.mode === 'immersion' &&
      c.dispatch.kind === 'not-applicable' &&
      c.dispatch.mode === 'immersion' &&
      c.dispatch.reason.includes('DECLARED dropped'),
  ) && census.filter((c) => c.flat).length === 5);
check('§4-R (E4) ★ THE DECLARED DROP IS REAL, NOT VACUOUS: flip-glue (RP²) carries TWO real 180° cone points on its cell body (Σ = 360° = 2πχ — the substrate seals) and the register rightly draws NONE of them on the smooth immersion — the seal\'s own latitude, exercised and recorded (a "reachable gluings are flat" claim would be FALSE here)',
  (() => {
    const rp2 = census.find((c) => c.op === 'flip-glue');
    return rp2 !== undefined && !rp2.flat && near(rp2.sum, 2 * P) && rp2.dispatch.kind === 'not-applicable';
  })());
// skeleton — the cut-born 1-complex
const cutHost = wireForm(invokePrimitive('square', 930));
const cutApplied = applyPlaygroundOperationTo('cut', cutHost.shape, null, 931, 8, [], null);
const cutDispatch = readDeficitForRender(cutApplied.born.render, lineageOf(cutApplied.born));
check('§4-R (E4) SKELETON is a REASONED, TYPED N-A: the cut-born 1-complex routes skeleton (0 faces) and the dispatch types it not-applicable with the no-faces reason — never a silent null',
  cutApplied.ok &&
    cutApplied.born.render.mode === 'skeleton' &&
    cutApplied.born.shape.faces.length === 0 &&
    cutDispatch.kind === 'not-applicable' &&
    cutDispatch.mode === 'skeleton' &&
    cutDispatch.reason.includes('no faces'));
// bodiless — the app's own constructor on the real pinch (§4's subject)
const bodilessForm = buildBodilessWrittenForm(pinch.shape, [sub], 'the render refused (witness)', 'w-bl', 'glue', 'witness', sub);
const bodilessDispatch = readDeficitForRender(bodilessForm.render, lineageOf(bodilessForm));
check('§4-R (E4) BODILESS REFUSES and the refusal SPEAKS: the app\'s own bodiless constructor on the real pinch → measured, marked:false, the reader\'s junction sentence riding (refused ≠ silent — the card carries the row)',
  bodilessForm.render.mode === 'bodiless' &&
    bodilessDispatch.kind === 'measured' &&
    bodilessDispatch.model.marked === false &&
    String(bodilessDispatch.model.refusal).includes('link valence "junction"'));
// the coverage floor — the dispatch source names every union arm
const dispatchSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/deficitRegisterModel.ts'), 'utf8');
check('§4-R (E4) THE COVERAGE FLOOR: the dispatch source enumerates EVERY WrittenRender arm by name (plain · classBody · faithful · bodiless · immersion · skeleton) and carries the never-floor (unhandledRenderMode) — a new mode cannot silently fall through; a plate testing only plain+classBody is the forbidden hole',
  ['plain', 'classBody', 'faithful', 'bodiless', 'immersion', 'skeleton'].every((m) =>
    dispatchSrc.includes(`render.mode === '${m}'`),
  ) && dispatchSrc.includes('unhandledRenderMode'));

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
check('§5 (E5) THE SPECIMEN CARD SPEAKS THE RESEARCHER\'S PHRASE from the TESTABLE model: deficitCardRows phrases "cone point · deficit N°", the boundary row "rim turn · N°" (the designer\'s wording — no "deficit" on the rim row); the view consumes the model DISPATCH (readDeficitForRender — R1-REBUILD: the dispatch is the defect site, so it lives where the witness drives it) and mounts the world layer on the faithful fan (InkedDeficitLayer with the datum\'s repositioned shape + complex); never "holonomy" in card code',
  modelSrc.includes('`cone point · deficit ${degrees}°`') &&
    modelSrc.includes('`rim turn · ${degrees}°`') &&
    !modelSrc.includes('rim turn · deficit') &&
    viewSrc.includes('readDeficitForRender(render, lineage)') &&
    viewSrc.includes('<InkedDeficitLayer shape={datum.shape} complex={datum.complex} />') &&
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
check('§6 (E5-R) R1-REBUILD\'s READ SURFACES HELD: the FROZEN surfaceClassifier.ts (acquireFaithfulComplex is CALLED, never edited) + faithfulBodyModel.ts (FaithfulBodyModel is READ, never edited), and the NOT_FROZEN-but-untouched handGestureModel.ts (the committed fold executor the witness drives) — all BYTE-IDENTICAL to HEAD; no union owed',
  ['src/manuscript/surfaceClassifier.ts', 'src/manuscript/faithfulBodyModel.ts', 'src/manuscript/handGestureModel.ts'].every(
    headEq,
  ));

console.log(
  `\n--- R1 THE DEFICIT REGISTER — the holonomy wedge (the owned deficit drawn, the sign two marks, silence at zero, the rim turn on the boundary, the junction refused; R1-REBUILD: the fold-born cone reads FAITHFUL on the fan with its complex, and every mode resolves reasoned — N-A ≠ dropped): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

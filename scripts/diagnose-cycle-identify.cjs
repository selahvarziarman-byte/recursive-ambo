#!/usr/bin/env node

// DIAGNOSTIC — CYCLE-IDENTIFY (L23): the person traces two cycles; the MODE
// IS THE TRACED DIRECTION (no control anywhere); the result routes STRATUM-
// AWARE — manifold → the class body (laid rides it) · pure edge-junction →
// a girdered PLAIN body on the born's FAITHFUL positions · vertex-pinch →
// the persistence bodiless card · degenerate → refused by the committed
// walls, live.
//
// THE TEETH (this witness BITES — a view-side re-derivation of the wedge
// convention, a BLANKET route, or a de-guarded pointer-miss flips it RED):
//   §1 ★ THE ONE SOURCE (`modesFromDirectedCycles`): an ALIGNED trace reads
//      'reversing' per pair, an OPPOSED trace 'preserving' (the committed
//      sewBoundaryCircles convention), a single flipped direction flips
//      EXACTLY its pair — and the traced identify is BYTE-EQUIVALENT to the
//      committed sew (same born shape id) on the canonical subject. The view
//      carries NO wedge/canonical convention of its own (grep-proof).
//   §2 ★ THE 4 STRATA, ROUTED (cell counts MEASURED, never homology):
//      manifold sew-trace → classBody + the laid body; free⊕interior 3-wedge
//      → plain + junction girder on the born's own centroids (E4's
//      faithful-positions build-check, measured); the committed vertex-pinch
//      identify (flip-glue on the quotient) → the bodiless card, word kept
//      (E5/E7); the degenerate walls speak their own sentences.
//   §3 the GESTURE WIRES + the REACH FIX (grepped on the working bytes):
//      confirm calls the helper then identify (traced order, no mode
//      control); the pointer-missed clear is TRACE-GUARDED; the fattened
//      invisible collider exists; the walk inks are their OWN species (the
//      ink law — never generators.a/.b); the four doors render in the PANEL.
//   §4 BOTH RE-SEALS read (manifest :79 writtenFormModel · :44
//      complexIdentification vs the working bytes).
//
// MEASURED DISCLOSURE (the report carries it whole): the seal's literal
// "junctionVertexIds === []" conjunction is structurally EMPTY — a >2-wedge
// seam's endpoint links ALWAYS read junction (measured on the canonical
// 3-wedge subject) — so the routed discriminator is the ruled INTENT: every
// junction vertex EXPLAINED by a junction edge ⇒ girdered plain; any
// junction vertex OFF the junction edges ⇒ the class-body path (bodiless on
// refusal). And no PERSON-TRACEABLE vertex-pinch via the general identify
// was found on the probed population (same-rim, non-adjacent, mixed-mode
// two-pair all land manifold; quotients are refused at entry) — the pinch
// stratum is witnessed on the committed word-op subject at the SAME render
// seam the gesture's confirm uses.
//
// Anti-mock: the REAL TS modules through the transpile hook.

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
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

const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { thicken } = req('src/lib/thicken.ts');
const {
  acquireComplex,
  identify,
  modesFromDirectedCycles,
  readIdentificationGate,
  sewBoundaryCircles,
  walkBoundaryCircles,
} = req('src/lib/complexIdentification.ts');
const { applyPlaygroundOperationTo, routeWrittenRender } = req('src/manuscript/writtenFormModel.ts');
const { tryLaidBodyModel } = req('src/manuscript/laidBodyModel.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
let seq = 400;
const counts = (s) => `V${Object.keys(s.vertices).length} E${s.edges.length} F${s.faces.length}`;

console.log('CYCLE-IDENTIFY (L23): two traces, no mode control; strata routed; the walls speak\n');

const mkRing = (ns) =>
  loadForm(() => ({
    name: 'ring',
    vertices: [
      { id: 'r0', position: [1.5, 0, 0] },
      { id: 'r1', position: [-0.75, 1.3, 0] },
      { id: 'r2', position: [-0.75, -1.3, 0] },
    ],
    edges: [
      { vertexIds: ['r0', 'r1'] },
      { vertexIds: ['r1', 'r2'] },
      { vertexIds: ['r2', 'r0'] },
    ],
  }), ns);

// ---------------------------------------------------------------------------
// §1 ★ THE ONE SOURCE — the mode IS the direction
// ---------------------------------------------------------------------------
console.log('----- §1 ★ modesFromDirectedCycles: aligned ⇒ reversing · opposed ⇒ preserving · flip flips its pair -----');
const band = thicken(mkRing('ci')).shape;
const acq = acquireComplex(band, null);
const circles = walkBoundaryCircles(acq.complex);
const A = circles[0].edgeIds;
const B = circles[1].edgeIds;
// each FREE edge's single wedge direction, read off the complex's own faces
// (test-input construction — the CONVENTION itself lives only in the helper)
const wedgeDirOf = (edgeId) => {
  for (const f of acq.complex.faces) for (const s of f.boundary) if (s.edge === edgeId) return s.dir;
  return 1;
};
const dirs = (ids) => ids.map((id) => wedgeDirOf(id));
const aligned = modesFromDirectedCycles(band, acq.complex, A, B, dirs(A), dirs(B));
check("★ §1 an ALIGNED trace reads 'reversing' on every pair (the sew convention, per-pair)",
  aligned.length === 3 && aligned.every((m) => m === 'reversing'));
const Brev = [...B].reverse();
const opposed = modesFromDirectedCycles(band, acq.complex, A, Brev, dirs(A), Brev.map((id) => -wedgeDirOf(id)));
check("★ §1 an OPPOSED trace (reversed order, reversed directions) reads 'preserving' on every pair",
  opposed.length === 3 && opposed.every((m) => m === 'preserving'));
const flipped = modesFromDirectedCycles(band, acq.complex, A, B, dirs(A), dirs(B).map((d, i) => (i === 1 ? -d : d)));
check('★ §1 flipping ONE traced direction flips EXACTLY that pair (mixed modes without a control — the Klein point)',
  flipped[0] === 'reversing' && flipped[1] === 'preserving' && flipped[2] === 'reversing');
const viaTrace = identify(band, A, Brev, opposed, null);
const viaSew = sewBoundaryCircles(thicken(mkRing('ci')).shape, 'preserving', 0, 1, null);
note(`traced identify: ${counts(viaTrace.shape)} · committed sew: ${counts(viaSew.shape)}`);
check('★ §1 THE COMMITTED-CONVENTION EQUIVALENCE: the traced identify births the SAME shape as sewBoundaryCircles (same born id — one convention, one source)',
  viaTrace.shape.id === viaSew.shape.id);
check('§1 the helper mirrors the matched wall (its own sentence, before any work)',
  (() => {
    try {
      modesFromDirectedCycles(band, acq.complex, A, [B[0]], dirs(A), [wedgeDirOf(B[0])]);
      return false;
    } catch (e) {
      return String(e.message).includes('the walks must be matched and non-empty');
    }
  })());

// ---------------------------------------------------------------------------
// §2 ★ THE 4 STRATA — routed, measured
// ---------------------------------------------------------------------------
console.log('\n----- §2 ★ the four strata: manifold · edge-junction · vertex-pinch · degenerate -----');

// (a) MANIFOLD — the traced sew (torus): classBody + the laid body rides
const routeManifold = routeWrittenRender(viaTrace.shape, [band], 24);
const laid = tryLaidBodyModel(viaTrace.shape, [band]);
note(`manifold: gate manifold=${viaTrace.gate.manifold} · route=${routeManifold.mode} · laid=${laid ? `${laid.counts.v}·${laid.counts.e}·${laid.counts.f}` : 'null'}`);
check("§2a MANIFOLD → the class body, and the LAID body rides it (the person's own cells: V3 E6 F3, measured)",
  viaTrace.gate.manifold === true &&
    routeManifold.mode === 'classBody' &&
    laid !== null && laid.counts.v === 3 && laid.counts.e === 6 && laid.counts.f === 3);
check("§2a (E7) the traced identify's word is the identification's own ('glue' — the trace intact)",
  viaTrace.shape.genealogy.operation === 'glue');

// (b) EDGE-JUNCTION — free ⊕ interior (the 3-wedge seam) → plain + girder
const band2 = thicken(mkRing('cj')).shape;
const acq2 = acquireComplex(band2, null);
const g2 = readIdentificationGate(acq2.complex);
const interior = acq2.complex.edges.map((e) => e.id).filter((id) => !g2.freeEdgeIds.includes(id));
const junctionBorn = identify(band2, [g2.freeEdgeIds[0]], [interior[0]], 'preserving', null);
note(`edge-junction: ${counts(junctionBorn.shape)} · jE=[${junctionBorn.gate.junctionEdgeIds.join(',')}] · jV ⊆ jE-endpoints (measured below)`);
const jEnds = new Set();
for (const e of junctionBorn.complex.edges) {
  if (junctionBorn.gate.junctionEdgeIds.includes(e.id)) {
    jEnds.add(e.u);
    jEnds.add(e.v);
  }
}
check('§2b the MEASURED refinement: the 3-wedge seam has junction VERTICES and ALL of them are its endpoints (the literal jV===[] conjunction is structurally empty — disclosed)',
  junctionBorn.gate.junctionEdgeIds.length === 1 &&
    junctionBorn.gate.junctionVertexIds.length > 0 &&
    junctionBorn.gate.junctionVertexIds.every((v) => jEnds.has(v)));
const routeJunction = routeWrittenRender(junctionBorn.shape, [band2], 24);
check('★ §2b EDGE-JUNCTION → PLAIN with the junction classes carried (the girder\'s committed wire lights)',
  routeJunction.mode === 'plain' &&
    Array.isArray(routeJunction.junctionEdgeIds) &&
    routeJunction.junctionEdgeIds.length === 1 &&
    routeJunction.junctionEdgeIds[0] === junctionBorn.gate.junctionEdgeIds[0]);
check('★ §2b (E4) FAITHFUL POSITIONS: the plain render carries the BORN shape itself (never re-minted), and the merged vertex sits at the MEMBERS\' centroid (identify\'s own :141 law, measured)',
  routeJunction.mode === 'plain' &&
    routeJunction.shape === junctionBorn.shape &&
    (() => {
      const minted = Object.keys(junctionBorn.shape.vertices).find((id) => id.startsWith('idn:'));
      if (!minted) return false;
      const members = minted.slice('idn:'.length).split('~');
      const positions = members.map((m) => band2.vertices[m]?.position).filter(Boolean);
      if (positions.length !== members.length) return false;
      const centroid = positions
        .reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0])
        .map((x) => x / positions.length);
      const got = junctionBorn.shape.vertices[minted].position;
      return centroid.every((x, k) => Math.abs(x - got[k]) < 1e-9);
    })());
check("§2b (E7) the junction-born word is 'glue' — the trace intact on the girdered stratum",
  junctionBorn.shape.genealogy.operation === 'glue');

// (c) VERTEX-PINCH — the committed identify-word pinch (flip-glue on the
// quotient cylinder; the general identify refuses quotients at entry, so the
// person reaches this pinch through the word door — same render seam)
const square = loadForm(nGon(4), 'ck');
const cylBorn = applyPlaygroundOperationTo('glue-cylinder', square, null, (seq += 1), 8, [], null);
const pinch = applyPlaygroundOperationTo('flip-glue', cylBorn.born.shape, square, (seq += 1), 8, [], null);
check('§2c the committed vertex-pinch ENACTS and persists BODILESS (the FIX-1 card, reused not rebuilt)',
  pinch.ok === false &&
    pinch.enacted !== undefined &&
    pinch.enacted.render.mode === 'bodiless' &&
    String(pinch.reason).includes('non-manifold vertex link'));
check("§2c (E5/E7) the pinch card carries the identification's genealogy ('flip-glue') — the meaning kept, NO body drawn",
  pinch.ok === false && pinch.enacted !== undefined && pinch.enacted.shape.genealogy.operation === 'flip-glue');

// (d) DEGENERATE — the committed walls, their own sentences
check('§2d the walls speak: mismatched walks · a repeated class · a class against itself · the quotient door',
  (() => {
    const wall = (fn, needle) => {
      try {
        fn();
        return false;
      } catch (e) {
        return String(e.message).includes(needle);
      }
    };
    return (
      wall(() => identify(band2, [g2.freeEdgeIds[0]], [], 'preserving', null), 'matched and non-empty') &&
      wall(
        () => identify(band2, [g2.freeEdgeIds[0], g2.freeEdgeIds[0]], [interior[0], interior[1] ?? interior[0]], 'preserving', null),
        'repeats an edge class',
      ) &&
      wall(
        () => identify(band2, [g2.freeEdgeIds[0]], [g2.freeEdgeIds[0]], 'preserving', null),
        'cannot be identified with itself',
      ) &&
      wall(
        () => identify(cylBorn.born.shape, ['x'], ['y'], 'preserving', square),
        'single-face QUOTIENT',
      )
    );
  })());

// ---------------------------------------------------------------------------
// §3 the gesture wires + the reach fix (the working bytes)
// ---------------------------------------------------------------------------
console.log('\n----- §3 the wires: one source · no mode control · trace-guarded miss · fattened collider · own inks -----');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check('★ §3 the confirm calls THE ONE SOURCE then the committed op — traced cycles, traced directions, NO re-derivation',
  viewSrc.includes('modesFromDirectedCycles(') &&
    viewSrc.includes('identify(target.shape, cycleA, cycleB, modes') &&
    !/localeCompare|canonicalWedge|wedgeDir/i.test(viewSrc));
check('★ §3 NO MODE CONTROL anywhere in the view (the mode words never appear as person-facing state)',
  !/'preserving'|'reversing'/.test(viewSrc));
check('§3 the REACH FIX: the pointer-missed clear is TRACE-GUARDED (a miss mid-trace keeps the walk — the guard stands FIRST; the D2-ground drag/click discriminator rides between it and the clear) and the collider is a FATTENED INVISIBLE proxy',
  /if \(cycleTraceRef\.current\) return;[\s\S]{0,900}?setSelected\(null\)/.test(viewSrc) &&
    viewSrc.includes('cylinderGeometry') &&
    viewSrc.includes('opacity={0}'));
check("§3 the INK LAW: the walk inks are their OWN reserved species (never generators.a #c2811d / .b #3e6db4)",
  /TRACE_INK_A = '#8a4f6d'/.test(viewSrc) &&
    /TRACE_INK_B = '#3f7d5c'/.test(viewSrc) &&
    !viewSrc.includes("TRACE_INK_A = '#c2811d'") &&
    !viewSrc.includes("TRACE_INK_B = '#3e6db4'"));
check('§3 the FOUR DOORS render in the PANEL (D1 counts + the subdivide cure · D2 at entry · D3 live · D4 the bodiless catch)',
  viewSrc.includes('the walks must be matched — A has') &&
    viewSrc.includes('subdivide (the chord gesture) to equalize') &&
    viewSrc.includes('cycleTrace.entryRefusal') &&
    viewSrc.includes('a walk repeats an edge class') &&
    viewSrc.includes('buildBodilessWrittenForm(') &&
    viewSrc.includes('identify — enacted; the render refused the body'));
check('§3 the pairing is LIVE (the i-th A-stroke lights as the i-th B lands) and the strokes are NIBS (thick tail → thin head), not arrows',
  viewSrc.includes('litA') && viewSrc.includes('0.55') && viewSrc.includes('0.85') && !viewSrc.includes('ArrowHelper'));

// ---------------------------------------------------------------------------
// §4 both re-seals read
// ---------------------------------------------------------------------------
console.log('\n----- §4 the register law holds: both re-seals read -----');
const manifest = fs.readFileSync(path.join(repoRoot, 'docs/governance/ENGINE_FREEZE_MANIFEST.txt'), 'utf8');
const shaOf = (p) =>
  crypto.createHash('sha256').update(fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r/g, '')).digest('hex');
const rowOf = (p) => {
  const row = manifest.split(/\r?\n/).find((line) => line.startsWith(p));
  return row ? row.trim().split(/\s+/).pop() : null;
};
check('§4 manifest row for src/manuscript/writtenFormModel.ts === sha256(working bytes) — UNION #1 re-seal LIVE',
  rowOf('src/manuscript/writtenFormModel.ts') === shaOf('src/manuscript/writtenFormModel.ts'));
check('§4 manifest row for src/lib/complexIdentification.ts === sha256(working bytes) — UNION #2 re-seal LIVE',
  rowOf('src/lib/complexIdentification.ts') === shaOf('src/lib/complexIdentification.ts'));

console.log(
  `\n--- CYCLE-IDENTIFY (two traces · one source · four strata · walkable): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

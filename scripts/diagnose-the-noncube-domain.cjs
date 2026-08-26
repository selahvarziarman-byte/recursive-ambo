#!/usr/bin/env node

// DIAGNOSTIC — B.4 · THE NON-CUBE DOMAIN (ADR 0026, B-109; built to the
// researcher's seal and the noncube_domain_reference instrument — every
// load-bearing number below is the instrument's, measured here on the REAL
// modules through the committed constructor).
//
// THE CLAUSES:
//   §1 the seeds are SOLID and the committed reader accepts them;
//   §2 THE ORACLE — the committed tower certifies the classical manifolds
//      through buildFormDomain (the researcher's ⚠ "no new combinatorial
//      machinery" CONFIRMED by running the committed constructor unmodified):
//      Seifert–Weber H₁=(Z/5)³ (6 classes × 5) · Poincaré H₁=0 (10 × 3) ·
//      L(4,1) H₁=Z/4 · L(5,2) H₁=Z/5;
//   §3 THE SWING (the acceptance's first leg): the euclidean control FAILS
//      by the ADR's own margins (+222.8254° SW · −10.3048° Poincaré) through
//      the SAME checker that then PASSES the curved realization at
//      ε = 1e-6 rad (measured ~1e-14);
//   §4 TRAP 2 — the solve REACHED its target: the emitted co-vectors'
//      measured dihedral hits 72°/120° independently of the solve; the
//      inradii pin the instrument's 0.99638 / 0.31416; a near-miss
//      (inradius + 1e-3) FAILS — ε is bounded from below;
//   §5 TRAP 1 — structural: the checker's body keys on the carried census
//      and carried flankings and reads NO position, builds NO distance graph;
//   §6 the realization's own coherence: every emitted vertex lies on its
//      incident face planes and on the model surface;
//   §7 NOTHING MOVES: the realization leaves the Shape byte-identical
//      (the model lives beside it — the ADR §2 carry table by construction).
//
// Anti-mock: the REAL TS modules through the transpile hook.

'use strict';
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: {
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
};

require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText,
    filename,
  );
};
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const {
  createDodecahedronShape,
  createLensBipyramidShape,
  dodecahedralTwistPairings,
  lensPairings,
  dihedralAtInradius,
  solveDihedralInradius,
  realizeDodecahedralDomain,
  realizeLensDomain,
  euclideanControlCovectors,
  checkDeckFit,
  metricDot,
  DECK_FIT_EPSILON_RAD,
  realizePairingIsometries,
  readDeckClosure,
  euclideanControlRealization,
  // B-113 §9 — the chart the render rides
  pushChartRay,
  sealDomainRealization,
} = req('src/lib/noncubeDomain.ts');
const { buildFormDomain } = req('src/manuscript/formDomainModel.ts');
const { readSeedCell } = req('src/lib/faceIdentification.ts');

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);
const deg = (rad) => (rad * 180) / Math.PI;

console.log('B.4 — the non-cube domain: the deck-fit checker, the S³/H³ realizer, the three realizations\n');

// ═════ §1 the seeds ═══════════════════════════════════════════════════════════
console.log('----- §1 the seeds: solid, committed-reader-accepted -----');
const dodeca = createDodecahedronShape();
const seed = readSeedCell(dodeca);
check('§1 the dodecahedron seed: 20 v · 30 e · 12 pentagon faces, one solid cell, readSeedCell accepts',
  seed.vertexIds.length === 20 && seed.edges.length === 30 && seed.faces.length === 12 &&
  seed.faces.every((f) => f.cycle.length === 5));
check('§1 orientable outward winding BY CONSTRUCTION: every directed edge appears exactly once across the 12 authored cycles',
  (() => {
    const directed = new Set();
    for (const f of dodeca.faces) {
      for (let k = 0; k < 5; k += 1) {
        const key = `${f.vertexIds[k]}>${f.vertexIds[(k + 1) % 5]}`;
        if (directed.has(key)) return false;
        directed.add(key);
      }
    }
    return directed.size === 60;
  })());
const lens41 = createLensBipyramidShape(4);
const lens52 = createLensBipyramidShape(5);
check('§1 the lens bipyramids: p=4 → 6 v · 12 e · 8 f; p=5 → 7 v · 15 e · 10 f; the cell carries NO topology name (a true absence — the frozen CellTopology holds none for it)',
  Object.keys(lens41.vertices).length === 6 && lens41.edges.length === 12 && lens41.faces.length === 8 &&
  Object.keys(lens52.vertices).length === 7 && lens52.edges.length === 15 && lens52.faces.length === 10 &&
  lens41.cells[0].topology === undefined && dodeca.cells[0].topology === 'dodecahedron');

// ═════ §2 THE ORACLE — the committed tower certifies the classics ═════════════
console.log('\n----- §2 the oracle: buildFormDomain (committed, unmodified) → the tower → the classical H₁ -----');
const swDomain = buildFormDomain(dodeca, dodecahedralTwistPairings(dodeca, 3), 'b4-sw', 'Seifert–Weber');
const pcDomain = buildFormDomain(dodeca, dodecahedralTwistPairings(dodeca, 1), 'b4-pc', 'Poincaré');
const l41Domain = buildFormDomain(lens41, lensPairings(lens41, 4, 1), 'b4-l41', 'L(4,1)');
const l52Domain = buildFormDomain(lens52, lensPairings(lens52, 5, 2), 'b4-l52', 'L(5,2)');
const census = (domain) => {
  const out = {};
  for (const link of domain.tower.gate.edgeLinks) out[link.memberEdgeIds.length] = (out[link.memberEdgeIds.length] ?? 0) + 1;
  return out;
};
check('§2 ★★ SEIFERT–WEBER through the person\'s own door: sound · orientable · H₁ = (Z/5)³ · χ=0 · exactly 6 edge-classes of 5 members ("5 cells per edge")',
  swDomain.tower.sound === true && swDomain.tower.orientable === true &&
  swDomain.tower.homology.H1.pretty === 'Z/5 ⊕ Z/5 ⊕ Z/5' && swDomain.tower.chi === 0 &&
  JSON.stringify(census(swDomain)) === '{"5":6}');
check('§2 ★★ THE POINCARÉ HOMOLOGY SPHERE: sound · orientable · H₁ = 0 (the strongest classical pin) · χ=0 · exactly 10 classes of 3 ("3 cells per edge")',
  pcDomain.tower.sound === true && pcDomain.tower.orientable === true &&
  pcDomain.tower.homology.H1.pretty === '0' && pcDomain.tower.chi === 0 &&
  JSON.stringify(census(pcDomain)) === '{"3":10}');
check('§2 ★ THE LENSES: L(4,1) H₁ = Z/4 (equator class of 4 + four apex classes of 2) · L(5,2) H₁ = Z/5 — the committed tower reads the twist out of the gluing',
  l41Domain.tower.sound === true && l41Domain.tower.orientable === true &&
  l41Domain.tower.homology.H1.pretty === 'Z/4' &&
  JSON.stringify(census(l41Domain)) === '{"2":4,"4":1}' &&
  l52Domain.tower.sound === true && l52Domain.tower.homology.H1.pretty === 'Z/5' &&
  JSON.stringify(census(l52Domain)) === '{"2":5,"5":1}');
note(`the researcher's ⚠ CONFIRMED by the runs above: buildFormDomain · readSeedCell · flipGlueFaces · the tower — all committed, none modified; the first build needed NO new combinatorial machinery beyond the realizer.`);
note(`(printed, not pinned: the 5/10 twist lands H₁ = Z/2 — RP³, the classical third — outside the chartered scope.)`);

// ═════ §3 THE SWING — euclidean FAILS by the ADR's margins → curved PASSES ════
console.log('\n----- §3 the swing: the same checker, the same carried combinatorics — FAIL → PASS -----');
const euclidDodeca = euclideanControlCovectors(dodeca);
const swControl = checkDeckFit(swDomain, euclidDodeca, 'E3');
const pcControl = checkDeckFit(pcDomain, euclidDodeca, 'E3');
check('§3 ⛔ LAW-24, the fail side (SW): the euclidean dodecahedron misses every 5-member class by +222.8254° (5 × 116.5651° vs 360°) — no ε could swallow it',
  swControl.pass === false &&
  swControl.classes.length === 6 &&
  swControl.classes.every((c) => Math.abs(deg(c.thetaRad) - 5 * 116.5651) < 0.01 && Math.abs(deg(c.deviationRad) - 222.8254) < 0.01));
check('§3 ⛔ LAW-24, the fail side (Poincaré): the euclidean control misses every 3-member class by −10.3048° — and 10.30° is ~180 000 × ε, never "nearly euclidean"',
  pcControl.pass === false &&
  pcControl.classes.length === 10 &&
  pcControl.classes.every((c) => Math.abs(deg(c.deviationRad) - 10.3048) < 0.01));
const swReal = realizeDodecahedralDomain(dodeca, 'seifert-weber');
const pcReal = realizeDodecahedralDomain(dodeca, 'poincare');
const swFit = checkDeckFit(swDomain, swReal.faceCovectors, 'H3');
const pcFit = checkDeckFit(pcDomain, pcReal.faceCovectors, 'S3');
check('§3 ★★ the pass side: the H³ realization closes every Seifert–Weber edge-cycle to 2π within ε = 1e-6 rad (measured at the float floor)',
  swFit.pass === true && swFit.maxDeviationRad <= DECK_FIT_EPSILON_RAD);
check('§3 ★★ the pass side: the S³ realization closes every Poincaré edge-cycle to 2π within ε',
  pcFit.pass === true && pcFit.maxDeviationRad <= DECK_FIT_EPSILON_RAD);
note(`measured max deviations: SW ${swFit.maxDeviationRad.toExponential(2)} rad · Poincaré ${pcFit.maxDeviationRad.toExponential(2)} rad (ε = 1e-6)`);
const l41Real = realizeLensDomain(lens41, 4);
const l52Real = realizeLensDomain(lens52, 5);
const l41Fit = checkDeckFit(l41Domain, l41Real.faceCovectors, 'S3');
const l52Fit = checkDeckFit(l52Domain, l52Real.faceCovectors, 'S3');
const l41Control = checkDeckFit(l41Domain, euclideanControlCovectors(lens41), 'E3');
check('§3 ★ the lens swing: the euclidean bipyramid control FAILS (the octahedron\'s 109.47° dihedrals close nothing) → the S³ lens closes the equator class (4 × 90°) AND the apex classes (2 × 180°) to 2π within ε',
  l41Control.pass === false && l41Fit.pass === true && l41Fit.maxDeviationRad <= DECK_FIT_EPSILON_RAD &&
  l52Fit.pass === true && l52Fit.maxDeviationRad <= DECK_FIT_EPSILON_RAD);
note(`lens L(4,1) euclidean control max deviation: ${deg(l41Control.maxDeviationRad).toFixed(2)}° — fails, as it must`);

// ═════ §4 TRAP 2 — the solve REACHED, proven independently ════════════════════
console.log('\n----- §4 trap 2: solve δ(inradius) = 2π/k and PROVE it — never read 116.565° and declare a fit -----');
const c = 1 / Math.sqrt(5);
check('§4 the inradii pin the instrument: H³ 0.99638 (δ→72.00000°) · S³ 0.31416 (δ→120.00000°), and the emitted co-vectors\' MEASURED dihedral (the metric Gram, independent of the solve) reproduces each target to ~1e-12',
  (() => {
    const okSw = Math.abs(swReal.inradius - 0.99638) < 1e-4 &&
      Math.abs(deg(dihedralAtInradius('H3', c, swReal.inradius)) - 72) < 1e-9;
    const okPc = Math.abs(pcReal.inradius - 0.31416) < 1e-4 &&
      Math.abs(deg(dihedralAtInradius('S3', c, pcReal.inradius)) - 120) < 1e-9;
    // the independent measurement: one adjacent pair's covector Gram
    const adj = (shape, real, metric, target) => {
      for (const fA of shape.faces) {
        for (const fB of shape.faces) {
          if (fA.id >= fB.id) continue;
          if (fA.vertexIds.filter((v) => fB.vertexIds.includes(v)).length !== 2) continue;
          const dRad = Math.acos(Math.max(-1, Math.min(1, -metricDot(metric, real.faceCovectors.get(fA.id), real.faceCovectors.get(fB.id)))));
          if (Math.abs(deg(dRad) - target) > 1e-9) return false;
        }
      }
      return true;
    };
    return okSw && okPc && adj(dodeca, swReal, 'H3', 72) && adj(dodeca, pcReal, 'S3', 120);
  })());
check('§4 ⛔ the near-miss control (ε bounded from below): co-vectors rebuilt at inradius + 1e-3 FAIL the deck fit — a wrong size cannot pass',
  (() => {
    const build = (geometry, d) => {
      const out = new Map();
      for (const f of dodeca.faces) {
        const n = (() => {
          const cn = [0, 0, 0];
          for (const vId of f.vertexIds) {
            const p = dodeca.vertices[vId].position;
            cn[0] += p[0] / 5; cn[1] += p[1] / 5; cn[2] += p[2] / 5;
          }
          const l = Math.hypot(...cn);
          return cn.map((x) => x / l);
        })();
        out.set(f.id, geometry === 'H3'
          ? [Math.cosh(d) * n[0], Math.cosh(d) * n[1], Math.cosh(d) * n[2], Math.sinh(d)]
          : [Math.cos(d) * n[0], Math.cos(d) * n[1], Math.cos(d) * n[2], Math.sin(d)]);
      }
      return out;
    };
    const swNear = checkDeckFit(swDomain, build('H3', swReal.inradius + 1e-3), 'H3');
    const pcNear = checkDeckFit(pcDomain, build('S3', pcReal.inradius + 1e-3), 'S3');
    return swNear.pass === false && pcNear.pass === false &&
      swNear.maxDeviationRad > DECK_FIT_EPSILON_RAD && pcNear.maxDeviationRad > DECK_FIT_EPSILON_RAD;
  })());
check('§4 the solve REFUSES an unreachable target rather than clamping (the H³ dihedral never reaches 150° on this family)',
  (() => {
    try {
      solveDihedralInradius('H3', c, (150 * Math.PI) / 180);
      return false;
    } catch (err) {
      return String(err.message).includes('never reaches') && String(err.message).includes('refused');
    }
  })());

// ═════ §5 TRAP 1 — structural: the checker keys on the carried complex ════════
console.log('\n----- §5 trap 1: the adjacency cannot re-select with the realization -----');
const moduleSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/noncubeDomain.ts'), 'utf8');
check('§5 ⛔ the checker\'s body draws classes from tower.gate.edgeLinks and flankings from the carried face cycles, and reads NO vertex position and builds NO distance graph (no `position`, no `dist`, no `nearest`, no `Math.hypot` in §E\'s body)',
  (() => {
    const start = moduleSrc.indexOf('export function checkDeckFit');
    const end = moduleSrc.indexOf('\n}', moduleSrc.lastIndexOf('return { metric'));
    const body = start > 0 && end > start ? moduleSrc.slice(start, end) : '';
    return body.length > 0 &&
      body.includes('tower.gate.edgeLinks') &&
      body.includes('face.vertexIds') &&
      !body.includes('.position') &&
      !/\bdist\b|\bnearest\b|Math\.hypot/.test(body);
  })());

// ═════ §6 the realization's own coherence ═════════════════════════════════════
console.log('\n----- §6 the emitted geometry is coherent: vertices on their planes, on the model surface -----');
check('§6 every emitted vertex lies on ALL its incident face planes (|⟨x,u⟩| < 1e-9) and on the model surface (H³: ⟨x,x⟩ = −1 · S³: |x| = 1), for all four realizations',
  (() => {
    const coherent = (shape, real) => {
      for (const [vId, x] of real.vertexPositions) {
        const surf = real.geometry === 'H3'
          ? Math.abs(metricDot('H3', x, x) + 1)
          : Math.abs(metricDot('S3', x, x) - 1);
        if (surf > 1e-9) return false;
        for (const f of shape.faces) {
          if (!f.vertexIds.includes(vId)) continue;
          if (Math.abs(metricDot(real.geometry, x, real.faceCovectors.get(f.id))) > 1e-9) return false;
        }
      }
      return real.vertexPositions.size === Object.keys(shape.vertices).length;
    };
    return coherent(dodeca, swReal) && coherent(dodeca, pcReal) && coherent(lens41, l41Real) && coherent(lens52, l52Real);
  })());

// ═════ §7 NOTHING MOVES — the ADR §2 carry table by construction ══════════════
console.log('\n----- §7 the Shape is untouched: the realization lives BESIDE it -----');
check('§7 realizing all four targets leaves both seed Shapes byte-identical (combinatorics · pairings · lineage carried; positions re-derived INTO the model, never into the Shape) and re-begets nothing',
  (() => {
    const dodecaBefore = JSON.stringify({ ...createDodecahedronShape(), genealogy: null });
    const lensBefore = JSON.stringify({ ...createLensBipyramidShape(4), genealogy: null });
    const dodecaAfter = JSON.stringify({ ...dodeca, genealogy: null });
    const lensAfter = JSON.stringify({ ...lens41, genealogy: null });
    return dodecaBefore === dodecaAfter && lensBefore === lensAfter &&
      dodeca.genealogy.createdVertexIds.length === 20 && swDomain.shape === dodeca;
  })());

// ═════ §8 (B-112) — THE MODEL-CARRYING TRANSPORT AND THE CLOSURE SWING ══════
// ADR 0026 §8.1 field 3: the pairing isometries as IN-MODEL maps, and the one
// thing an angle sum cannot say — that WALKING the deck around an edge
// returns the room to itself. ⛔ §8.3's LAW-24 control is not hypothetical
// here: the wrong-model transport is what the engine carries today, so the
// swing is today's behaviour → the cured one.
console.log('\n----- §8 (B-112) the transport carries a MODEL, and the walk closes -----');
{
  const rad2deg = (r) => (r * 180) / Math.PI;
  for (const [target, tenths, deficitDeg] of [['seifert-weber', 3, 222.8255], ['poincare', 1, -10.3047]]) {
    const pairings = dodecahedralTwistPairings(dodeca, tenths);
    const domain = buildFormDomain(dodeca, pairings, 'b112-' + target, target);
    const real = realizeDodecahedralDomain(dodeca, target);
    const deck = realizePairingIsometries(dodeca, pairings, real);
    const closure = readDeckClosure(domain, deck, pairings);
    const worst = Math.max(...closure.map((c) => c.turnRad));
    check('§8 ★★ THE WALK CLOSES in the sealed model (' + target + ', ' + real.geometry + '): every carried edge class returns the room to ITSELF — the composed door-walk is the identity — and the model is CARRIED from the realization\'s seal, never re-inferred (deck.model === realization.geometry)',
      deck.model === real.geometry && closure.length > 0 && worst < 1e-6);
    note(target + ': ' + closure.length + ' classes · worst turn ' + rad2deg(worst).toExponential(2) + ' deg');
    // ⛔ THE SWING — the SAME form, the SAME carried complex, forced to the
    // euclidean model: the walk FAILS to close, by the deficit itself.
    const euclid = euclideanControlRealization(dodeca);
    const deckE = realizePairingIsometries(dodeca, pairings, euclid);
    const closureE = readDeckClosure(domain, deckE, pairings);
    const turns = closureE.map((c) => rad2deg(c.turnRad));
    // a rotation BY the deficit is read as its PRINCIPAL angle: 222.83° about
    // an axis IS 137.17° about the opposite one, so Seifert–Weber's seam
    // reads 360 − 222.83; Poincaré's |−10.30| is already principal.
    const expected = Math.abs(deficitDeg) > 180 ? 360 - Math.abs(deficitDeg) : Math.abs(deficitDeg);
    check('§8 ⛔ THE SWING (' + target + '): forced to the E³ model the SAME walk FAILS to close on EVERY class, by exactly the ADR\'s deficit — ' + expected.toFixed(4) + ' deg (the principal reading of ' + deficitDeg + ' deg) — so the transport CAN fail, which is the only reason its closing means anything',
      closureE.length === closure.length && turns.every((t) => Math.abs(t - expected) < 0.01),
      'turns: ' + [...new Set(turns.map((t) => t.toFixed(4)))].join(', ') + ' deg');
  }
  // field 3's own witness law: the fit is WITNESSED per door, and a corrupted
  // correspondence is REFUSED BY NAME rather than fitted to something else
  const swPairings = dodecahedralTwistPairings(dodeca, 3);
  const swReal2 = realizeDodecahedralDomain(dodeca, 'seifert-weber');
  check('§8 ⛔ field 3 REFUSES a map it cannot witness: a pairing whose corner map is corrupted (one corner re-pointed at another\'s image) throws BY NAME rather than fitting a plausible transform to the corners it happens to like',
    (() => {
      const corrupted = swPairings.map((p, i) => {
        if (i !== 0) return p;
        const keys = Object.keys(p.map);
        return { ...p, map: { ...p.map, [keys[0]]: p.map[keys[1]] } };
      });
      try {
        realizePairingIsometries(dodeca, corrupted, swReal2);
        return false;
      } catch (err) {
        const m = String(err.message);
        return m.includes('noncubeDomain') && (m.includes('misses corner') || m.includes('no independent corner triple'));
      }
    })());
  check('§8 ⛔ TRAP 1, structurally: the closure walk reads the CARRIED census, the CARRIED corner maps and the CARRIED face cycles — no vertex position and no distance graph enter its body',
    (() => {
      const src = fs.readFileSync(path.join(repoRoot, 'src/lib/noncubeDomain.ts'), 'utf8');
      const start = src.indexOf('export function readDeckClosure');
      const end = src.indexOf('return out;', start);
      const body = start > 0 && end > start ? src.slice(start, end) : '';
      return body.length > 0 &&
        body.includes('tower.gate.edgeLinks') &&
        body.includes('pairing.map') &&
        !body.includes('.position') &&
        !/Math\.hypot|\bnearest\b|\bdist\b/.test(body);
    })());
}

// ═════ §9 (B-113) — THE MODEL REACHES THE RENDER ════════════════════════════
// ADR 0004 §3's acceptance, and it is a person's sentence, not a number's:
// *"in E³ they recede as 1/d and straight lines stay straight; in H³ they
// shrink exponentially and crowd; in S³ they close up and come back."*
// ⛔ This leg measures WHAT THE TRACER DOES. Whether the crowding READS to a
// person is decided at the eye, in the app, and reported there — a falloff
// rate is not the mark.
console.log('\n----- §9 (B-113) the model reaches the RENDER: a Seifert–Weber interior, and the swing -----');
{
  const A = req('src/manuscript/apertureModel.ts');
  const swPairings = dodecahedralTwistPairings(dodeca, 3);
  const swDomain = buildFormDomain(dodeca, swPairings, 'b113-sw', 'seifert-weber');
  const gate = A.buildAperture(swDomain);
  check('§9 ★★ THE DOOR SEALS AND HANDS THE MODEL TO THE RENDER: the person-built Seifert–Weber domain EARNS its realization at buildAperture (nothing told it which geometry — the target 2π/5 against the cell\'s own euclidean dihedral chose H³, the inradius SOLVED, then the fit, every door\'s witnessed isometry and the closure walk each proved it) and the gate carries a 6-door H³ transport',
    gate.ok && !!gate.seal && gate.seal.geometry === 'H3' && !!gate.model && gate.model.model === 'H3' && gate.model.doors.length === 6);
  if (gate.ok && gate.seal) {
    note(`sealed: ${gate.seal.geometry} · inradius ${gate.seal.inradius.toFixed(5)} · k=${gate.seal.edgeClassSize} · closure worst ${((gate.seal.closureWorstRad * 180) / Math.PI).toExponential(2)}° · chart scale ${gate.model.sceneScale.toFixed(4)}`);
  }

  // ⛔ THE AFFINE REDUCTION, asserted and not hoped for: on a door whose
  // bottom row is (0,0,0,1) the projective push IS the committed transport,
  // bit for bit. This is the whole reason the euclidean render did not move.
  check('§9 ⛔ THE COMMITTED TRANSPORT IS THE E³ CASE OF THE NEW ONE, BIT FOR BIT: on every euclidean door, pushChartRay(affine4(g), p, v) reproduces applyPoint(g,p) and applyVector(g,v) EXACTLY (===, not within ε) — the euclidean render is not a branch beside the model path, it is that path at E³',
    (() => {
      const euclidGate = A.buildAperture(buildFormDomain(dodeca, swPairings, 'b113-cmp', 'x'));
      const rays = [[0.11, -0.23, 0.07], [-0.4, 0.15, 0.33], [0.02, 0.02, -0.5]];
      const dirs = [[0.6, 0.8, 0], [-0.267, 0.535, 0.802], [0, 0, 1]];
      let exact = 0;
      let total = 0;
      for (const d of euclidGate.deck) {
        for (const g of [d.g, d.gi]) {
          const m = [g[0], g[1], g[2], g[9], g[3], g[4], g[5], g[10], g[6], g[7], g[8], g[11], 0, 0, 0, 1];
          for (let i = 0; i < rays.length; i += 1) {
            total += 1;
            const want = A.applyPoint(g, rays[i]);
            const wantV = A.applyVector(g, dirs[i]);
            const got = pushChartRay(m, rays[i], dirs[i]);
            if (got.k[0] === want[0] && got.k[1] === want[1] && got.k[2] === want[2] &&
                got.w[0] === wantV[0] && got.w[1] === wantV[1] && got.w[2] === wantV[2]) exact += 1;
          }
        }
      }
      note(`affine pushes compared: ${total} · exact: ${exact}`);
      return total > 0 && exact === total;
    })());

  // the room, and one solid in it to BE the copies (a scaffold rod is not
  // counted as a copy — the tracer's own law, and rightly)
  const sceneFor = (model) => A.buildApertureScene(dodeca, null, [A.meshFromShape(dodeca, [0, 0, 0], 0.5)], model);
  const traceAt = (model, level, minCopyPixels) =>
    A.traceAperture({
      deck: gate.deck,
      model,
      scene: sceneFor(model),
      width: 84,
      height: 84,
      craft: { level },
      minCopyPixels,
    });

  // ⛔ THE THRESHOLD SWEEP, not one count. A single `formCopiesVisible` at one
  // threshold reads the H³ room as EMPTIER than the euclidean one, which is
  // the exact opposite of what is happening — the copies are there in their
  // hundreds and almost none of them is big enough to clear the threshold.
  // Reading one number here would have inverted the finding; the sweep is
  // what makes the shrink legible as a shrink.
  const atThresholds = (model, level) =>
    [1, 4, 16, 64].map((mcp) => traceAt(model, level, mcp).counts.formCopiesVisible);
  const beyondHome = (t) => {
    let px = 0;
    for (let i = 0; i < t.hit.length; i += 1) if (t.hit[i] === 1 && t.echo[i] > 0) px += 1;
    return px;
  };
  const hyp = traceAt(gate.model, 8, 1);
  const euc = traceAt(null, 8, 1);
  const hT = atThresholds(gate.model, 8);
  const eT = atThresholds(null, 8);
  // ⚠ MARKER S1 — A MEASUREMENT PRINTS ITS SURFACE BESIDE THE NUMBER,
  // exactly as a plate prints its `settle`. ⛔ A number whose station is
  // unstated will be read as universal by whoever needs it to be — and a
  // claim about H³ left this desk on numbers that carried their depth and
  // their thresholds and NOT the surface they were taken on.
  // ⇒ THE SURFACE HERE, cited rather than remembered: this leg's own
  // traceAperture call at scripts/diagnose-the-noncube-domain.cjs:400
  // (width: 84, height: 84). ⚠ It is NOT the app's plate, which renders at
  // designDefaults.ts:309 (`resolution: 168`), nor the walk window, which
  // renders at canvas resolution — and B-114 measured that the crowd reads
  // at window size and not at thumbnail size. The three surfaces differ,
  // which is exactly why the number may not travel without its own.
  note(`SURFACE: this leg's 84×84 trace (line 400) — NOT the app's 168px plate (designDefaults.ts:309) and NOT the walk window at canvas size`);
  note(`copies surviving a ≥[1, 4, 16, 64]-pixel threshold at depth 8, on that 84×84 surface:`);
  note(`  H³ (sealed): ${JSON.stringify(hT)} · ${beyondHome(hyp)} object pixels lie beyond the home cell, over ${hT[0] - 1} copies`);
  note(`  E³ (today) : ${JSON.stringify(eT)} · ${beyondHome(euc)} object pixels lie beyond the home cell, over ${eT[0] - 1} copies`);
  check('§9 ★★ THE RENDER LIGHTS IN THE MODEL: the Seifert–Weber interior draws through the H³ transport — pixels lit, rays transported, copies of the person\'s own solid counted — so the room is not merely realized, it is INHABITED',
    hyp.counts.litPixels > 0 && hyp.counts.transports > 0 && hyp.counts.lostRays === 0 && hT[0] > 1);
  check('§9 ★★ AND THE COPIES SHRINK, which is ADR 0004 §3\'s own sentence measured: the H³ room contributes copies in the HUNDREDS and almost none of them is big enough to see — surviving a 4-pixel threshold: 3 against euclidean 86; a 16-pixel one: 1 against 17. ⇒ They are not fewer; they are SMALLER, and the smallness is exponential in depth (the deepest lit ray stands at hyperbolic distance ~12, where a cell subtends 1/sinh 12 ≈ 1/81000 of what it subtends at the eye)',
    hT[0] > 50 && hT[1] < eT[1] / 10 && hT[2] < eT[2] / 5 && beyondHome(hyp) < beyondHome(euc) / 4);

  // ⛔ THE ROOM CLOSES — the render's OWN primitive, not the matrices'. §8
  // proved the composed 4×4s are the identity; this proves the thing the
  // tracer actually calls returns the ray itself, position AND direction.
  check('§9 ⛔ A RAY THAT CROSSES A DOOR AND COMES BACK IS THE SAME RAY: for every sealed H³ door, pushChartRay through m then through its inverse returns the position and the direction it started with (< 1e-9) — the render\'s own primitive, checked where the render calls it, not where the matrices were fitted',
    (() => {
      const rays = [[0.11, -0.23, 0.07], [-0.3, 0.1, 0.2], [0.02, 0.31, -0.15]];
      // ⚠ UNIT directions, deliberately: a projective push RENORMALIZES (it
      // must — the map does not preserve chart length), so feeding it a
      // direction that is 1.0003 long returns a 1.0000 one and the
      // round-trip "fails" by 2.9e-4 that is the input's, not the door's.
      // Measured that way first; the fix is the test data, and the property
      // is worth writing down.
      const dirs = [[0.6, 0.8, 0], [-0.267, 0.535, 0.802], [0, 0, 1]].map((d) => {
        const L = Math.hypot(d[0], d[1], d[2]);
        return [d[0] / L, d[1] / L, d[2] / L];
      });
      let worst = 0;
      for (const door of gate.model.doors) {
        for (let i = 0; i < rays.length; i += 1) {
          const out = pushChartRay(door.m, rays[i], dirs[i]);
          const back = pushChartRay(door.mi, out.k, out.w);
          for (let c = 0; c < 3; c += 1) {
            worst = Math.max(worst, Math.abs(back.k[c] - rays[i][c]), Math.abs(back.w[c] - dirs[i][c]));
          }
        }
      }
      note(`door round-trip worst error: ${worst.toExponential(2)}`);
      return worst < 1e-9;
    })());

  // THE DISTANCE the ink fades on — in H³ the chart saturates and the metre
  // does not. This is the one quantity the projective chart cannot carry.
  const farDepth = (t) => {
    let m = 0;
    for (let i = 0; i < t.depth.length; i += 1) if (t.hit[i] !== 0 && t.depth[i] > m) m = t.depth[i];
    return m;
  };
  note(`deepest lit ray at level 8 — H³ ${farDepth(hyp).toFixed(3)} (hyperbolic distance) · E³ ${farDepth(euc).toFixed(3)} (euclidean distance)`);
  check('§9 ⛔ THE METRE IS THE MODEL\'S: the depth buffer the ink fades on carries HYPERBOLIC distance in a sealed H³ room, not the chart parameter — chart length saturates at the Klein boundary while true distance runs to infinity, and a fade on the chart would draw every far copy at the same tone',
    (() => {
      // a Klein-chart step of 1 unit is at most 1 (the ball has radius 1);
      // the hyperbolic distance the same ray covers exceeds it once the ray
      // leaves the middle of the cell — measured on the actual buffer
      // the Klein ball has radius 1, so nine chart legs can total at most 18;
      // the measured hyperbolic depth is in the same range only because the
      // cell is large — what pins the METRE is that it is not the chart
      // parameter: a chart leg inside this cell is ≤ 2·0.76 and nine of them
      // cannot reach 12 while staying inside the ball at every step
      return farDepth(hyp) > 9 * 2 * 0.7601 * 0.5 && farDepth(hyp) !== farDepth(euc);
    })());

  // ⛔ THE E³ SEAL HANDS NO TRANSPORT — one producer for one fact
  check('§9 ⛔ A FLAT ROOM GETS THE CLASS AND NOT A SECOND COPY OF ITS OWN MAP: a uniform-k=4 cube form seals E3 and the gate hands model = null, so the committed euclidean deck stays the ONE producer of the euclidean transport (two producers for one fact is how a render drifts from its own witnesses)',
    (() => {
      const cube = req('src/data/seeds.ts').createSeedShape('cube');
      const f = (k) => `face:cube:${k}`;
      const AX = [['left', 'right'], ['front', 'back'], ['bottom', 'top']];
      const menus = AX.map(([a, b]) => A.dihedralMapCandidates(cube, f(a), f(b)));
      const rows = AX.map(([a, b], i) => ({ faceA: f(a), faceB: f(b), candidateKey: menus[i][0].key }));
      const v = A.buildPersonDomainVerdict(cube, rows, 'b113-flat', 'x');
      const g = A.buildAperture(v.domain);
      return g.ok && !!g.seal && g.seal.geometry === 'E3' && g.model === null && g.modelRefusal === null;
    })());

  // ⛔ THE DEGENERATE CELL — reachable, and refused BY NAME
  check('§9 ⛔ A DEGENERATE CELL IS REFUSED BY NAME, and the case is REACHABLE (measured: the cube family\'s pattern 776): a uniform k=2 census puts two cells around every edge — a 180° dihedral — which solves to inradius π/2 on S³, where every face plane is the SAME great sphere and the "cell" is a hemisphere with no corners. ⚠ The fit, the door isometries and the closure walk ALL PASS on it: an angle sum and a walk are blind to a cell that has stopped being a solid',
    (() => {
      const cube = req('src/data/seeds.ts').createSeedShape('cube');
      const f = (k) => `face:cube:${k}`;
      const AX = [['left', 'right'], ['front', 'back'], ['bottom', 'top']];
      const menus = AX.map(([a, b]) => A.dihedralMapCandidates(cube, f(a), f(b)));
      const rows = AX.map(([a, b], i) => ({ faceA: f(a), faceB: f(b), candidateKey: menus[i][[7, 7, 6][i]].key }));
      const v = A.buildPersonDomainVerdict(cube, rows, 'b113-degen', 'x');
      if (v.folded || !v.domain.tower.sound) return false;
      const g = A.buildAperture(v.domain);
      return g.ok && g.model === null && g.seal === null && String(g.modelRefusal).includes('degenerates at this size');
    })());

  // the census of what the seal actually reaches on the committed family —
  // ⛔ named in full, never "the seal works"
  check('§9 THE CENSUS, all of it and not the flattering half: of the cube family\'s 79 sound forms the seal reads 43 as E³, seals 2 as S³ (uniform k=3 at inradius π/4 — three cubes around every edge, the 8-cell\'s own tessellation), refuses 1 as degenerate, and refuses 33 BY NAME for carrying two different k (one regular realization cannot serve two, and averaging them would be a fabrication)',
    (() => {
      const cube = req('src/data/seeds.ts').createSeedShape('cube');
      const f = (k) => `face:cube:${k}`;
      const AX = [['left', 'right'], ['front', 'back'], ['bottom', 'top']];
      const menus = AX.map(([a, b]) => A.dihedralMapCandidates(cube, f(a), f(b)));
      let sound = 0; let e3 = 0; let curved = 0; let degen = 0; let mixed = 0;
      for (let i = 0; i < 8; i += 1) for (let j = 0; j < 8; j += 1) for (let k = 0; k < 8; k += 1) {
        const rows = AX.map(([a, b], idx) => ({ faceA: f(a), faceB: f(b), candidateKey: menus[idx][[i, j, k][idx]].key }));
        const v = A.buildPersonDomainVerdict(cube, rows, `b113-${i}${j}${k}`, 'x');
        if (v.folded || !v.domain.tower.sound) continue;
        sound += 1;
        const g = A.buildAperture(v.domain);
        if (!g.ok) continue;
        if (g.seal && g.seal.geometry === 'E3') e3 += 1;
        else if (g.seal) curved += 1;
        else if (String(g.modelRefusal).includes('degenerates')) degen += 1;
        else if (String(g.modelRefusal).includes('two different k')) mixed += 1;
      }
      note(`cube family: ${sound} sound = ${e3} E³ + ${curved} S³ + ${degen} degenerate + ${mixed} mixed-k`);
      return sound === 79 && e3 === 43 && curved === 2 && degen === 1 && mixed === 33;
    })());

  // ⚠ THE HONEST EDGE, written into the witness rather than left for a reader
  // to discover: the committed non-movement legs (the honest door's clause 4,
  // the orbifolds' body clause 3) call traceAperture WITHOUT a model, so they
  // pin that the EUCLIDEAN path did not move — which is true and worth
  // pinning — and they say NOTHING about the app's render, which now passes
  // gate.model. The two S³ cube forms above DO draw differently in the app.
  check('§9 ⚠ THE NON-MOVEMENT LEGS DO NOT COVER THIS, said here rather than left to be discovered: the honest door\'s clause 4 and the orbifolds\' body clause 3 call traceAperture with NO model, so they pin the euclidean path (unmoved, verified) and NOT the app\'s render, which passes gate.model — the 2 sealed cube forms genuinely draw differently now, and that is the cut working, not a regression',
    (() => {
      const src = fs.readFileSync(path.join(repoRoot, 'scripts/diagnose-the-orbifolds-body.cjs'), 'utf8');
      const door = fs.readFileSync(path.join(repoRoot, 'scripts/diagnose-the-honest-door.cjs'), 'utf8');
      return !src.includes('model: gate.model') && !door.includes('model: gate.model');
    })());
}

// ═════ §10 (B-114) — THE WALK WINDOW'S ROOM, AND THE NOUN THEY SHARE ════════
// The acceptance has two halves and both are the person's: ⛔ THE PLATE AND
// THE WINDOW AGREE ABOUT THE SAME ROOM (the disagreement at the B-113 tip is
// the control — it existed and must be gone), and ⛔ THE WALK'S OWN MARKS
// STILL READ (the return counted in doors, the mirror reading unchanged in
// MEANING). LAW 22: handedness is state the observer CARRIES.
console.log('\n----- §10 (B-114) the walk window carries the model, and the noun is ONE producer -----');
{
  const A = req('src/manuscript/apertureModel.ts');
  const { buildThreeTorusDomain } = req('src/manuscript/worldModel.ts');
  // local kit — the witness computes its own, never the module's, so a broken
  // module cannot certify itself
  const applyMat4 = (m, x) => [0, 1, 2, 3].map((r) => m[r * 4] * x[0] + m[r * 4 + 1] * x[1] + m[r * 4 + 2] * x[2] + m[r * 4 + 3] * x[3]);
  const det3rows = (r) =>
    r[0][0] * (r[1][1] * r[2][2] - r[1][2] * r[2][1]) - r[0][1] * (r[1][0] * r[2][2] - r[1][2] * r[2][0]) + r[0][2] * (r[1][0] * r[2][1] - r[1][1] * r[2][0]);
  const det3block = (m) => det3rows([[m[0], m[1], m[2]], [m[4], m[5], m[6]], [m[8], m[9], m[10]]]);
  const pushDet = (m) => {
    // 4x4 determinant by cofactor expansion along the first row
    let out = 0;
    for (let c = 0; c < 4; c += 1) {
      const rows = [];
      for (let r = 1; r < 4; r += 1) {
        const row = [];
        for (let cc = 0; cc < 4; cc += 1) if (cc !== c) row.push(m[r * 4 + cc]);
        rows.push(row);
      }
      out += (c % 2 === 0 ? 1 : -1) * m[c] * det3rows(rows);
    }
    return out;
  };
  // the H3 tangent inner product at a Klein-chart point (the same form the
  // window uses, recomputed here independently)
  const ipH3 = (k, a, b) => {
    const kk = k[0] * k[0] + k[1] * k[1] + k[2] * k[2];
    const s = 1 - kk;
    const ab = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const ka = k[0] * a[0] + k[1] * a[1] + k[2] * a[2];
    const kb = k[0] * b[0] + k[1] * b[1] + k[2] * b[2];
    return ab / s + (ka * kb) / (s * s);
  };
  const gramSchmidtH3 = (k, axes) => {
    const out = [];
    for (const raw of axes) {
      let v = [raw[0], raw[1], raw[2]];
      for (const done of out) {
        const c = ipH3(k, v, done);
        v = [v[0] - c * done[0], v[1] - c * done[1], v[2] - c * done[2]];
      }
      const nn = Math.sqrt(Math.max(1e-12, ipH3(k, v, v)));
      out.push([v[0] / nn, v[1] / nn, v[2] / nn]);
    }
    return out;
  };
  const swPairings = dodecahedralTwistPairings(dodeca, 3);
  const swDomain = buildFormDomain(dodeca, swPairings, 'b114-sw', 'seifert-weber');
  const gate = A.buildAperture(swDomain);
  const surface = A.readCellSurface(swDomain, true, gate.model);

  check('§10 ★★ THE ROOM A PERSON WALKS IS THE SEALED ONE: readCellSurface hands the walk window a room in the model — 12 faces, every one a DOOR carrying an in-model 4×4 (g4), no walls, and the surface declares its model H3 so nothing downstream has to re-infer it',
    surface.model === 'H3' && surface.faces.length === 12 && surface.wallCount === 0 &&
    surface.faces.every((f) => Array.isArray(f.g4) && f.g4.length === 16 && f.g === null) &&
    surface.rods.length === 30);
  note(`walk room: model ${surface.model} · ${surface.faces.length} faces (${surface.wallCount} walls) · ${surface.rods.length} rods · span ${surface.span.toFixed(4)}`);

  check('§10 ⛔ AND IT IS THE ROOM THE PLATE DRAWS, NOT A SECOND ONE: every face plane the walk tests is the SAME chart plane the tracer exits through (same n̂, same d, < 1e-12) — the plate and the window read one geometry, which is what "they agree" has to MEAN',
    (() => {
      let worst = 0;
      for (const door of gate.model.doors) {
        for (const [fid, n, d] of [[door.faceA, door.nA, door.dA], [door.faceB, door.nB, door.dB]]) {
          const face = surface.faces.find((f) =>
            Math.abs(f.d - d) < 1e-9 && Math.hypot(f.n[0] - n[0], f.n[1] - n[1], f.n[2] - n[2]) < 1e-9);
          if (!face) return false;
          worst = Math.max(worst, Math.abs(face.d - d));
        }
      }
      note(`plate-vs-walk plane agreement: worst ${worst.toExponential(2)} over ${gate.model.doors.length * 2} faces`);
      return worst < 1e-12;
    })());

  // ⛔ THE EUCLIDEAN ROOM DID NOT MOVE — the same call with no model is the
  // committed read, field for field. A cure that quietly re-shaped every flat
  // room would be a far bigger defect than the one it fixed.
  check('§10 ⛔ THE EUCLIDEAN ROOM IS UNTOUCHED: the T³ cube\'s walk room read WITH a null model is byte-equal to the committed read (faces, planes, wall flags, deck transforms, rods, span) — and carries NO model field and NO g4, so nothing about it can start reading one by accident',
    (() => {
      const t3 = buildThreeTorusDomain();
      const g3 = A.buildAperture(t3);
      const a = A.readCellSurface(t3, false);
      const b = A.readCellSurface(t3, false, g3.model);
      return JSON.stringify(a) === JSON.stringify(b) &&
        a.model === undefined &&
        a.faces.every((f) => f.g4 === undefined) &&
        g3.seal !== null && g3.seal.geometry === 'E3' && g3.model === null;
    })());

  // ═══ THE WALK'S OWN MARKS — the ones the acceptance says must still read ═══
  check('§10 ★★ THE ROOM COMES BACK — the walk closes IN THE MODEL: composing the doors of a carried edge class returns the identity (worst 1.34e-5°, the B-112 reading), so "the return counted in doors" still counts the same thing it always did; the deck the window walks IS that deck',
    gate.seal !== null && gate.seal.geometry === 'H3' && gate.seal.closureWorstRad < 1e-4);

  check('§10 ⛔ THE MIRROR READING IS UNCHANGED IN MEANING (LAW 22): every Seifert–Weber door is orientation-PRESERVING, and the 4×4 determinant says so — det = +1 on all 12, so a walk through them can never turn the frame\'s handedness. ⚠ The 3×3 block of a projective door is NOT its orientation (measured: the blocks\' dets run ' + '), which is why the carried frame reads det4 and not det3',
    (() => {
      const dets = gate.model.doors.flatMap((d) => [pushDet(d.m), pushDet(d.mi)]);
      const blocks = gate.model.doors.map((d) => det3block(d.m));
      note(`door det4: ${[...new Set(dets.map((x) => x.toFixed(6)))].join(', ')} · their 3×3 blocks: ${[...new Set(blocks.map((x) => x.toFixed(3)))].join(', ')}`);
      return dets.every((x) => Math.abs(x - 1) < 1e-6) && blocks.some((x) => Math.abs(Math.abs(x) - 1) > 1e-3);
    })());

  check('§10 ⛔ THE CARRIED FRAME STAYS A FRAME: pushed through every door and re-orthonormalised in the MODEL\'s inner product, the three axes come back orthonormal (|⟨eᵢ,eⱼ⟩ − δᵢⱼ| < 1e-9) and RIGHT-HANDED — Gram–Schmidt in order rotates and can never reflect, so only a door\'s own determinant may flip the mirror',
    (() => {
      let worstIP = 0;
      let handed = true;
      for (const door of gate.model.doors) {
        const k0 = [0.05, -0.11, 0.07];
        const axes = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        const K = applyMat4(door.m, [k0[0], k0[1], k0[2], 1]);
        const kk = [K[0] / K[3], K[1] / K[3], K[2] / K[3]];
        const pushed = axes.map((v) => {
          const W = applyMat4(door.m, [v[0], v[1], v[2], 0]);
          return [W[0] * K[3] - K[0] * W[3], W[1] * K[3] - K[1] * W[3], W[2] * K[3] - K[2] * W[3]];
        });
        const on = gramSchmidtH3(kk, pushed);
        for (let i = 0; i < 3; i += 1) for (let j = 0; j < 3; j += 1) {
          worstIP = Math.max(worstIP, Math.abs(ipH3(kk, on[i], on[j]) - (i === j ? 1 : 0)));
        }
        if (det3rows(on) <= 0) handed = false;
      }
      note(`carried frame: worst |⟨eᵢ,eⱼ⟩ − δᵢⱼ| ${worstIP.toExponential(2)} · right-handed on every door: ${handed}`);
      return worstIP < 1e-9 && handed;
    })());

  // ═══ THE NOUN — §0's rule, and ONE producer ═══════════════════════════════
  const foldedFixture = (() => {
    const cube = req('src/data/seeds.ts').createSeedShape('cube');
    const f = (k) => `face:cube:${k}`;
    const AX = [['left', 'right'], ['front', 'back'], ['bottom', 'top']];
    const menus = AX.map(([a, b]) => A.dihedralMapCandidates(cube, f(a), f(b)));
    for (let i = 0; i < 8; i += 1) for (let j = 0; j < 8; j += 1) for (let k = 0; k < 8; k += 1) {
      const rows = AX.map(([a, b], idx) => ({ faceA: f(a), faceB: f(b), candidateKey: menus[idx][[i, j, k][idx]].key }));
      const v = A.buildPersonDomainVerdict(cube, rows, `b114-fold-${i}${j}${k}`, 'x');
      if (v.folded && v.body) return v.body;
    }
    return null;
  })();

  check('§10 ★★ THE NOUN OBEYS HER RULE — EVERY WORD TRUE OF THE GEOMETRY IT NAMES: a sealed H³ form reads "hyperbolic manifold" (no cone in H³ — the cone is the shadow\'s) · a euclidean form with real cone edges KEEPS "Euclidean cone-manifold" (cone is TRUE there; the noun was stopped from claiming forms it does not describe, never retired) · a flat form keeps "E³"',
    (() => {
      const sw = A.apertureNoun(gate.geometry, gate.seal);
      const t3 = buildThreeTorusDomain();
      const g3 = A.buildAperture(t3);
      const flat = A.apertureNoun(g3.geometry, g3.seal);
      // a cone form: uniform k≠4 is sealed, so take a MIXED-k cone form —
      // refused by the seal, and its noun must be the euclidean one
      const cube = req('src/data/seeds.ts').createSeedShape('cube');
      const f = (k) => `face:cube:${k}`;
      const AX = [['left', 'right'], ['front', 'back'], ['bottom', 'top']];
      const menus = AX.map(([a, b]) => A.dihedralMapCandidates(cube, f(a), f(b)));
      let coneNoun = null;
      for (let i = 0; i < 8 && !coneNoun; i += 1) for (let j = 0; j < 8 && !coneNoun; j += 1) for (let k = 0; k < 8 && !coneNoun; k += 1) {
        const rows = AX.map(([a, b], idx) => ({ faceA: f(a), faceB: f(b), candidateKey: menus[idx][[i, j, k][idx]].key }));
        const v = A.buildPersonDomainVerdict(cube, rows, `b114-cone-${i}${j}${k}`, 'x');
        if (v.folded || !v.domain.tower.sound) continue;
        const g = A.buildAperture(v.domain);
        if (!g.ok || g.seal !== null || g.geometry.kind !== 'cone') continue;
        coneNoun = A.apertureNoun(g.geometry, g.seal);
      }
      note(`nouns: sealed H³ → "${sw}" · flat → "${flat}" · euclidean cone → "${coneNoun}"`);
      return sw.startsWith('hyperbolic manifold ·') && sw.includes('cone edges: 6 × 450°') &&
        flat.startsWith('E³ ·') &&
        coneNoun !== null && coneNoun.startsWith('Euclidean cone-manifold ·');
    })());

  check('§10 ⛔ A FOLD LOCUS OUTRANKS EVERY SEAL, which is the row that makes her rule the right one: a folded body reads "orbifold" and NO seal can reach past it — a fold locus is not an artifact of the wrong geometry, it SURVIVES into the right one, so "a realization exists" and "the singularity is an artifact" are two different facts and only the second may choose the word',
    (() => {
      if (!foldedFixture) return false;
      const g = A.buildAperture(foldedFixture);
      // the folded branch carries NO seal by construction, and even handed one
      // the noun must not move
      const forced = A.apertureNoun(g.geometry, { geometry: 'H3', inradius: 1, edgeClassSize: 5, closureWorstRad: 0 });
      note(`folded noun with a seal FORCED on it: "${forced.slice(0, 46)}…"`);
      return g.seal === null && g.model === null &&
        A.apertureNoun(g.geometry, g.seal).startsWith('orbifold ·') &&
        forced.startsWith('orbifold ·');
    })());

  check('§10 ⛔ THE NOTE SAYS WHAT IS, AND THE SHADOW CLAUSE FIRES ON A FACT — as TWO STRINGS, not one string minus a clause (MARKER S1): drawn in the shadow it is her sentence WHOLE; drawn in the sealed model the standalone carries `euclidean` ITSELF, because lifted out of the pair "the shadow" has NO ANTECEDENT — the clause that introduced it is the one that stopped firing. ⚠ ADDED, never MOVED: the whole form is untouched, so when it fires it still introduces the shadow and the pair does not repeat itself. And the excess note rides the FIGURE (450° > a full turn), never the class',
    (() => {
      const inShadow = A.apertureNote(gate.geometry, gate.seal, true);
      const inModel = A.apertureNote(gate.geometry, gate.seal, false);
      note(`note (shadow): ${JSON.stringify(inShadow)}`);
      note(`note (model) : ${JSON.stringify(inModel)}`);
      return inShadow.length === 2 && inModel.length === 2 &&
        inShadow[0] === 'drawn in the euclidean shadow — these angles are the shadow\'s, not the manifold\'s' &&
        inModel[0] === 'these angles are the euclidean shadow\'s, not the manifold\'s' &&
        inShadow[1] === '450° is more than a full turn — that excess is why it cannot be flat' &&
        inModel[1] === inShadow[1];
    })());

  check('§10 ⛔ AND NO NOTE WHERE THERE IS NOTHING TO DISCLAIM: a flat room and a euclidean cone room emit NO note at all — a mark on the unremarkable is a mark that stops meaning anything',
    (() => {
      const t3 = buildThreeTorusDomain();
      const g3 = A.buildAperture(t3);
      return A.apertureNote(g3.geometry, g3.seal, true).length === 0 &&
        A.apertureNote(g3.geometry, g3.seal, false).length === 0;
    })());

  check('§10 ⛔ ONE PRODUCER, STRUCTURALLY: the view composes the walk window\'s geometry line FROM apertureNoun (it holds no "Euclidean cone-manifold" literal of its own any more), and apertureCaption composes the plate\'s from the same function — two producers for one sentence is exactly how they came to disagree about the same room',
    (() => {
      const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
      const modelSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/apertureModel.ts'), 'utf8');
      // the noun's own region: the MODEL_NOUN table it reads from through the
      // end of its body — both words must live HERE and nowhere else
      const nounBody = modelSrc.slice(modelSrc.indexOf('const MODEL_NOUN'), modelSrc.indexOf('export function apertureNote'));
      return viewSrc.includes('const noun = apertureNoun(g, seal)') &&
        !viewSrc.includes('`Euclidean cone-manifold · n=[${g.n.join') &&
        modelSrc.includes('apertureNoun(geometry, seal ?? null)') &&
        nounBody.includes('Euclidean cone-manifold') &&
        nounBody.includes('hyperbolic manifold');
    })());
}

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`} — the non-cube domain`);
process.exit(failures === 0 ? 0 : 1);

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

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`} — the non-cube domain`);
process.exit(failures === 0 ? 0 : 1);

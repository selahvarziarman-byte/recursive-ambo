#!/usr/bin/env node

// DIAGNOSTIC — Manuscript Phase 2b: the specimen reading is the certifier's,
// verbatim, per form kind — and it is SUMMONED, never ambient (anti-mock:
// transpile-hook require of the real .ts sources).
//
//   · card === certifier: every row is checked against an INDEPENDENT pass of
//     the committed certifier for the kind (readFormInvariants for surfaces +
//     skeletons; level3InvariantTower for the domain) — χ, orientability,
//     classification (verbatim string), w₁Class, H₁, counts, the S² gate.
//   · generators === the certified basis: the legend names EXACTLY the loops
//     the form already draws (keys === InkedForm's loop labels, in order) —
//     the emphasis is craft width on the SAME loops; no loop is added,
//     removed, or redrawn by the reading. Klein's legend deliberately does NOT
//     attribute free-vs-torsion to a letter (the carried certificate ranks the
//     classes, it does not name letters — asserted).
//   · the twist === cert.w1Class: non-null exactly on the certifier's
//     non-orientable forms (Klein · RP² · Möbius), reading "w₁ = 1".
//   · summoned-not-ambient (structural half): no world entry carries a
//     precomputed reading — the reading exists only by calling the read*
//     functions (the view calls them iff selected; the render-iff is audit +
//     the delivered selected/deselected screenshot pair).

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

const { readFormInvariants } = req('src/playground/formInvariants.ts');
const { level3InvariantTower } = req('src/lib/level3Invariants.ts');
const { buildManuscriptWorld } = req('src/manuscript/worldModel.ts');
const { invokePrimitive, applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const {
  readDomainSpecimen,
  readSkeletonSpecimen,
  readSurfaceSpecimen,
} = req('src/manuscript/specimenModel.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const rowOf = (reading, label) => {
  const row = reading.rows.find((r) => r.label === label);
  return row ? row.value : undefined;
};

const world = buildManuscriptWorld(8);
// CUT 0 THE GALLERY FIX: the world's dim-2 band starts EMPTY — the reference
// surfaces are SUMMONED through the PERSON'S OWN path (invoke square + the
// committed preset word → applyPlaygroundOperationTo → routeWrittenRender),
// exactly as the view does it; the readings' subjects below are those summoned
// models (parity with the retired seed is pinned in diagnose-manuscript-world).
const REFERENCE_OPS = {
  torus: 'glue-torus',
  klein: 'flip-glue-klein',
  rp2: 'flip-glue',
  sphere: 'collapse-sphere',
  cylinder: 'glue-cylinder',
  mobius: 'flip-glue-mobius',
};
let summonSeq = 9400;
const surface = (key) => {
  const host = invokePrimitive('square', (summonSeq += 1));
  const res = applyPlaygroundOperationTo(REFERENCE_OPS[key], host.shape, null, (summonSeq += 1), 8, [], null);
  if (!res.ok || res.born.render.mode !== 'immersion') {
    throw new Error(`specimen: the person-path summon of "${key}" failed (${res.ok ? res.born.render.mode : res.reason})`);
  }
  return res.born.render.model;
};

// ----- surfaces: card === an independent readFormInvariants pass -------------
{
  console.log('----- [surface · torus] card === certifier -----');
  const model = surface('torus');
  const reading = readSurfaceSpecimen(model);
  const fresh = readFormInvariants(model.immersion.shape);
  check('χ row reads the certified 0 (measured === certified)',
    fresh.chi === 0 && fresh.chiCertified === 0 && rowOf(reading, 'Euler χ') === '0 (certified)');
  check("orientable row 'yes' === !cert.nonOrientable", Boolean(fresh.cert) && !fresh.cert.nonOrientable && rowOf(reading, 'orientable') === 'yes');
  check('class row === the certifier classification, verbatim', rowOf(reading, 'class') === fresh.classification);
  check("w₁ row '[0, 0]' === cert.w1Class", rowOf(reading, 'w₁ class') === `[${fresh.cert.w1Class.join(', ')}]` && rowOf(reading, 'w₁ class') === '[0, 0]');
  check("H₁ row 'ℤ ⊕ ℤ' (genus 1)", rowOf(reading, 'H₁') === 'ℤ ⊕ ℤ' && model.h1Label === 'ℤ ⊕ ℤ');
  check("subtitle carries the gluing word abAB", reading.subtitle.includes('abAB'));
  check('legend names EXACTLY the drawn certified loops (a → longitude, b → meridian)',
    reading.legend.length === model.loops.length &&
    JSON.stringify(reading.legend.map((e) => e.key)) === JSON.stringify(model.loops.map((l) => l.label)) &&
    reading.legend[0].text === 'a — longitude' && reading.legend[1].text === 'b — meridian');
  check('twist null (orientable)', reading.twist === null);
}
{
  console.log('----- [surface · klein] the twist + no letter-attribution -----');
  const model = surface('klein');
  const reading = readSurfaceSpecimen(model);
  const fresh = readFormInvariants(model.immersion.shape);
  check("w₁ row '[0, 1]' === cert.w1Class", rowOf(reading, 'w₁ class') === '[0, 1]' && JSON.stringify(fresh.cert.w1Class) === '[0,1]');
  check("twist reads 'w₁ = 1 — non-orientable (the twist)'",
    reading.twist === 'w₁ = 1 — non-orientable (the twist)' && fresh.cert.nonOrientable === true);
  check("H₁ row 'ℤ ⊕ ℤ/2'", rowOf(reading, 'H₁') === 'ℤ ⊕ ℤ/2');
  check('legend: two entries, keys === the drawn loops',
    reading.legend.length === 2 &&
    JSON.stringify(reading.legend.map((e) => e.key)) === JSON.stringify(model.loops.map((l) => l.label)));
  check('legend does NOT attribute free/torsion to a letter (beyond the certified data)',
    reading.legend.every((e) => !/torsion|free|ℤ\/2/.test(e.text)));
}
{
  console.log('----- [surface · rp2] the ℤ/2 named (b₁=1 — THE class is certified) -----');
  const model = surface('rp2');
  const reading = readSurfaceSpecimen(model);
  check("twist reads w₁ = 1", Boolean(reading.twist) && reading.twist.includes('w₁ = 1'));
  check("legend: exactly ['a·b — the ℤ/2 generator']",
    reading.legend.length === 1 && reading.legend[0].key === 'a·b' && reading.legend[0].text === 'a·b — the ℤ/2 generator');
  check("H₁ row 'ℤ/2' · w₁ row '[1]'", rowOf(reading, 'H₁') === 'ℤ/2' && rowOf(reading, 'w₁ class') === '[1]');
}
{
  console.log('----- [surface · sphere] the null case -----');
  const model = surface('sphere');
  const reading = readSurfaceSpecimen(model);
  check("H₁ row '0' · legend EMPTY · twist null (nothing to light, honestly)",
    rowOf(reading, 'H₁') === '0' && reading.legend.length === 0 && reading.twist === null);
  check("subtitle honest: collapse target · no gluing word", reading.subtitle.includes('no gluing word'));
}
{
  console.log('----- [surface · mobius] open form: honest n-a + the certified core -----');
  const model = surface('mobius');
  const reading = readSurfaceSpecimen(model);
  const fresh = readFormInvariants(model.immersion.shape);
  check("class row === certifier verbatim ('open / n-a')", rowOf(reading, 'class') === fresh.classification && fresh.classification === 'open / n-a');
  check("H₁ 'ℤ' · twist w₁ = 1 · legend the certified core",
    rowOf(reading, 'H₁') === 'ℤ' && Boolean(reading.twist) && reading.twist.includes('w₁ = 1') &&
    reading.legend.length === 1 && reading.legend[0].text === 'core — the ℤ generator (certified)');
}

// ----- skeleton: the level-1 rung ---------------------------------------------
{
  console.log('----- [skeleton · loop] level-1 certified rows -----');
  const model = world.dim1.find((m) => m.key === 'loop');
  const reading = readSkeletonSpecimen(model);
  const fresh = readFormInvariants(model.shape);
  check('components 1 · H₀ ℤ · b₁ 1 · H₁ ℤ (=== an independent level1Betti pass)',
    Boolean(fresh.level1) && fresh.level1.components === 1 && fresh.level1.b1 === 1 &&
    rowOf(reading, 'components') === '1' && rowOf(reading, 'H₀') === 'ℤ' &&
    rowOf(reading, 'b₁ (level 1)') === '1' && rowOf(reading, 'H₁') === 'ℤ');
  check("surface rows honest n-a on a 1-complex",
    rowOf(reading, 'orientable') === 'n-a (1-complex)' && rowOf(reading, 'class') === 'n-a (1-complex)');
  check('legend empty (the ink IS the cycle set) · twist null', reading.legend.length === 0 && reading.twist === null);
}

// ----- domain: the tower ---------------------------------------------------
{
  console.log('----- [domain · T³] tower-certified rows -----');
  const model = world.dim3[0];
  const reading = readDomainSpecimen(model);
  const fresh = level3InvariantTower(model.complex);
  check("S² gate row 'sound' === the gate verdict", fresh.sound === true && rowOf(reading, 'S² gate') === 'sound');
  check("χ row '0 (consistent)' === the tower", fresh.chi === 0 && fresh.chiConsistent === true && rowOf(reading, 'Euler χ') === '0 (consistent)');
  check("orientable 'yes' · H₁ 'Z^3' === tower.homology.H1.pretty",
    fresh.orientable === true && rowOf(reading, 'orientable') === 'yes' &&
    rowOf(reading, 'H₁ (= π₁ abelianized)') === fresh.homology.H1.pretty && fresh.homology.H1.pretty === 'Z^3');
  check("CW counts row 'v 1 · e 3 · f 3 · c 1'", rowOf(reading, 'CW counts') === 'v 1 · e 3 · f 3 · c 1');
  check("face-pairs row '3 (all preserving)'", rowOf(reading, 'face-pairs') === '3 (all preserving)');
  check('twist null (orientable) · legend empty (marks are pairings, not H₁ furniture)',
    reading.twist === null && reading.legend.length === 0);
  note(`subtitle: ${reading.subtitle}`);
}

// ----- summoned, not ambient (the structural half) ---------------------------
{
  console.log('----- [summoned] no ambient reading exists in the world model -----');
  const entries = [...world.dim1, ...world.dim2, ...world.dim3];
  check('NO world entry carries a precomputed reading (the card is built only on select)',
    entries.every((m) => !('reading' in m) && !('specimen' in m) && !('card' in m)));
  check('the readings are pure on-demand functions (summoning = calling them)',
    [readSurfaceSpecimen, readSkeletonSpecimen, readDomainSpecimen].every((f) => typeof f === 'function' && f.length === 1));
}

console.log(
  failures === 0
    ? '\n--- manuscript specimen (2b: card===certifier per kind · basis-exact legend · the twist · summoned): no failures ---\n\nALL PASS'
    : `\n--- manuscript specimen: ${failures} FAILURE(S) ---`,
);
process.exitCode = failures === 0 ? 0 : 1;

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
const { readPairDesignations } = req('src/manuscript/argumentReadingModel.ts');

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
  check('χ CUT IN TWO (B-132): the number is a measure row, bare; the certifier speaks in its OWN check row',
    fresh.chi === 0 && fresh.chiCertified === 0 && rowOf(reading, 'Euler χ') === '0' && rowOf(reading, 'χ') === 'certified');
  check("orientable row 'yes' === !cert.nonOrientable", Boolean(fresh.cert) && !fresh.cert.nonOrientable && rowOf(reading, 'orientable') === 'yes');
  check('class row === the certifier classification, verbatim', rowOf(reading, 'class') === fresh.classification);
  check("w₁ row '[0, 0]' === cert.w1Class", rowOf(reading, 'w₁ class') === `[${fresh.cert.w1Class.join(', ')}]` && rowOf(reading, 'w₁ class') === '[0, 0]');
  check("H₁ row 'ℤ ⊕ ℤ' (genus 1)", rowOf(reading, 'H₁') === 'ℤ ⊕ ℤ' && model.h1Label === 'ℤ ⊕ ℤ');
  check("subtitle carries the gluing word abAB", reading.subtitle.includes('abAB'));
  check('legend names EXACTLY the drawn certified loops, and (B-133) the FRESH summon reads the ABSENCE arm — letter + gloss, byte-identical to the pre-B-133 line (no designation exists on an unnamed word; a designation never carries an address)',
    reading.legend.length === model.loops.length &&
    JSON.stringify(reading.legend.map((e) => e.key)) === JSON.stringify(model.loops.map((l) => l.label)) &&
    reading.legend[0].text === 'a — longitude' && reading.legend[1].text === 'b — meridian');
  check('twist null (orientable)', reading.twist === null);
}
{
  console.log('----- [surface · torus, christened] B-133 clause B — the legend speaks HIS edge-classes -----');
  const host = invokePrimitive('square', (summonSeq += 1));
  Object.values(host.shape.vertices).forEach((v, i) => {
    v.data.label = ['north', 'east', 'south', 'west'][i];
  });
  const res = applyPlaygroundOperationTo('glue-torus', host.shape, null, (summonSeq += 1), 8, [], null);
  if (!res.ok || res.born.render.mode !== 'immersion') {
    throw new Error('specimen: the christened torus summon failed');
  }
  const pairs = readPairDesignations(res.born);
  const reading = readSurfaceSpecimen(res.born.render.model, pairs);
  note(`pairs ${JSON.stringify(pairs)} · legend ${JSON.stringify(reading.legend.map((e) => e.text))}`);
  check('(B-133, R-1 Q3) THE LEGEND\'S SUBJECT IS HIS EDGE-CLASS, BY ITS DESIGNATION — the codomain word rides only the classification side of the dash: a = north→east·south→west — longitude · b = east→south·west→north — meridian (designations handed in from the argument reading\'s committed pairing recovery; the specimen never re-derives them, and the letter-prefixed codomain-only era is over on a named word)',
    reading.legend.length === 2 &&
    reading.legend[0].text === 'a = north→east·south→west — longitude' &&
    reading.legend[1].text === 'b = east→south·west→north — meridian');
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
  // A-4 item 1 (Arman's sanction, Δ66 — DERIVE, DON'T CARRY): orientability and
  // w₁ are DERIVABLE for every 1-complex (trivially yes · zero, one coefficient
  // per generator in the register's own notation), so 'n-a' there was
  // fabricated unavailability; the class row stays the honest n-a (a
  // 1-complex has no surface classification — not in the sanction's spine).
  check("the derived spine on a 1-complex: orientable 'yes' · w₁ class '[0]' (one zero per generator) · class the honest 'n-a (1-complex)'",
    rowOf(reading, 'orientable') === 'yes' && rowOf(reading, 'w₁ class') === '[0]' && rowOf(reading, 'class') === 'n-a (1-complex)');
  // THE CARRIED LABEL IS NO LONGER READ — a lying h1Label cannot reach the card
  const lying = readSkeletonSpecimen({ ...model, h1Label: 'LIE' });
  check("the carried h1Label is DEAD to the card: a model carrying h1Label 'LIE' still reads H₁ 'ℤ' — derived from the shape's own vertices and edges",
    rowOf(lying, 'H₁') === 'ℤ' && rowOf(lying, 'b₁ (level 1)') === '1');
  // THE FALSIFIER RIDES: a level-1 rung that disagrees with the shape is SAID, in the note register
  const disagreeing = readSkeletonSpecimen({ ...model, invariants: { ...model.invariants, level1: { components: 1, b1: 7 } } });
  check("a committed level-1 rung that disagrees with the 1-skeleton is named in the note register (b₁ 7 vs derived 1), never silently preferred",
    rowOf(disagreeing, 'b₁ (level 1)') === '1' && Array.isArray(disagreeing.notes) && disagreeing.notes.length === 1 && /b₁ 7/.test(disagreeing.notes[0]) && /derives 1 · 1/.test(disagreeing.notes[0]));
  check("…and an agreeing rung leaves the note register EMPTY (no mark on the ordinary)", Array.isArray(reading.notes) && reading.notes.length === 0);
  // THE ARC — the dim-1 null case: H₁ '0' · w₁ class '[]' (no generator, no coefficient)
  const arc = readSkeletonSpecimen(world.dim1.find((m) => m.key === 'arc'));
  check("the Arc: components 1 · b₁ 0 · H₁ '0' · orientable 'yes' · w₁ class '[]' — the spine derived on the null case",
    rowOf(arc, 'components') === '1' && rowOf(arc, 'b₁ (level 1)') === '0' && rowOf(arc, 'H₁') === '0' && rowOf(arc, 'orientable') === 'yes' && rowOf(arc, 'w₁ class') === '[]');
  // TWO COMPONENTS — the derivation counts components from the shape, not from a carried number
  const twoArcs = { ...model, shape: { ...model.shape, vertices: { p: { id: 'p', position: [0, 0, 0] }, q: { id: 'q', position: [1, 0, 0] }, r: { id: 'r', position: [0, 1, 0] }, s: { id: 's', position: [1, 1, 0] } }, edges: [{ id: 'pq', vertexIds: ['p', 'q'] }, { id: 'rs', vertexIds: ['r', 's'] }], faces: [] }, invariants: { ...model.invariants, level1: { components: 2, b1: 0 } } };
  const two = readSkeletonSpecimen(twoArcs);
  check("two disjoint segments: components '2' · H₀ 'ℤ^2' · b₁ '0' · H₁ '0' · w₁ class '[]' — components are COUNTED from the edges' vertex ids",
    rowOf(two, 'components') === '2' && rowOf(two, 'H₀') === 'ℤ^2' && rowOf(two, 'b₁ (level 1)') === '0' && rowOf(two, 'H₁') === '0' && rowOf(two, 'w₁ class') === '[]');
  // THE ACCEPTANCE'S PAIR — the Arc and a FRESH SEGMENT agree, BY CONSTRUCTION: the invoked
  // Segment is a face-less PLAIN render (writtenFormModel.invokePrimitive), whose card the
  // view routes through the same skeleton reader; the two readings' rows are identical.
  const { invokePrimitive } = req('src/manuscript/writtenFormModel.ts');
  const segment = invokePrimitive('segment', 1);
  const segRender = segment.render;
  const segReading = segRender.mode === 'plain' && segRender.shape.faces.length === 0
    ? readSkeletonSpecimen({ key: segment.id, title: segment.title, shape: segRender.shape, invariants: segRender.invariants, h1Label: segRender.h1Label })
    : null;
  check("a FRESH SEGMENT is a face-less plain render (invokePrimitive) and, read through the skeleton reader, its rows EQUAL the Arc's label for label and value for value — H₁ '0' agreeing at the seam the eye reads",
    segReading !== null && JSON.stringify(segReading.rows) === JSON.stringify(arc.rows) && rowOf(segReading, 'H₁') === '0' && rowOf(segReading, 'orientable') === 'yes' && rowOf(segReading, 'w₁ class') === '[]');
  const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
  check("…and the VIEW routes a face-less plain render through readSkeletonSpecimen before readPlainSpecimen can write 'n-a' (source-pinned: the guard `render.shape.faces.length === 0` precedes the plain call)",
    viewSrc.includes("if (render.shape.faces.length === 0) {") && viewSrc.indexOf("if (render.shape.faces.length === 0) {") < viewSrc.indexOf("const base = readPlainSpecimen(entry.form.title, personReadableProvenance(entry.form.provenance, sourceNameBySource), render.invariants, render.h1Label);"));
  check('legend empty (the ink IS the cycle set) · twist null', reading.legend.length === 0 && reading.twist === null);
}

// ----- domain: the tower ---------------------------------------------------
{
  console.log('----- [domain · T³] tower-certified rows -----');
  const model = world.dim3[0];
  const reading = readDomainSpecimen(model);
  const fresh = level3InvariantTower(model.complex);
  check("S² gate row 'sound' === the gate verdict", fresh.sound === true && rowOf(reading, 'S² gate') === 'sound');
  check("χ CUT IN TWO (B-132): the tower's number bare in the measure row; 'consistent' in its own check row", fresh.chi === 0 && fresh.chiConsistent === true && rowOf(reading, 'Euler χ') === '0' && rowOf(reading, 'χ') === 'consistent');
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

#!/usr/bin/env node

// DIAGNOSTIC — Manuscript Phase 2a: the ambient world stays faithful across the
// fuller catalogue (anti-mock: transpile-hook require of the real .ts sources).
//
//   · dim 2 — CUT 0 THE GALLERY FIX: the band starts EMPTY (worldModel seeds
//     nothing — the pin below). The six references are SUMMONED through the
//     PERSON'S OWN path (invoke square + the committed preset word →
//     applyPlaygroundOperationTo → routeWrittenRender — the view's exact
//     seam), and each summoned immersion draws EXACTLY its certified basis
//     (loops === cert.b1): torus 2 · KLEIN 2 (one free + one ℤ/2 torsion —
//     w₁Class [0,1]) · RP² 1 · sphere 0 · cylinder/Möbius 1 certified core
//     each — the same values as the retired always-on seed, PROVEN identical:
//     the parity legs pin summoned == an independent summon (byte-identical
//     JSON) and summoned == the direct buildInkedFormModel drawing, and the
//     NO-BYPASS leg pins that ManuscriptView never calls buildInkedFormModel
//     (reference == person, no nicer path).
//   · dim 1 — the cut-born skeletons are honest 1-complexes: zero faces, real
//     pass-through positions (identical to their source polygons), H₁ labels =
//     the committed level1Betti rank (free — a graph has no torsion): loop ℤ,
//     arc 0 (the dim-1 null case).
//   · dim 3 — the 3-torus domain: the committed tower certifies sound (S² gate),
//     χ=0 (consistent), orientable, H₁ = Z^3 torsion-free; the identification
//     is 3 PRESERVING pairs over 6 distinct real cube faces; the drawn marks'
//     centers are the real face centroids; counts read {v:1,e:3,f:3,c:1}. The
//     domain model carries the cube WIREFRAME only — no solid-body geometry.
//   · B-FLAG GUARD — the population is exactly the committed immersion keys +
//     the cut-born skeletons + the level-3 domain: no non-single-polygon
//     surface is populated, so no form needs an Option-B basis it doesn't get.
//   · determinism — two independent world builds agree.

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

const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');
const {
  buildManuscriptWorld,
  buildThreeTorusDomain,
  h1LabelFromLevel1,
  WORLD_SURFACES,
} = req('src/manuscript/worldModel.ts');
const { invokePrimitive, applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const { buildInkedFormModel } = req('src/manuscript/inkedFormModel.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);

const R = 8;
const world = buildManuscriptWorld(R);

// CUT 0 — the person-path summon (the view's exact seam, re-run here): each
// reference is an invoked square + the committed preset word; the model out is
// routeWrittenRender's immersion arm. The op-per-surface map is the view's own.
const REFERENCE_OPS = {
  torus: 'glue-torus',
  klein: 'flip-glue-klein',
  rp2: 'flip-glue',
  sphere: 'collapse-sphere',
  cylinder: 'glue-cylinder',
  mobius: 'flip-glue-mobius',
};
let summonSeq = 9300;
const summonReference = (key) => {
  const host = invokePrimitive('square', (summonSeq += 1));
  const res = applyPlaygroundOperationTo(REFERENCE_OPS[key], host.shape, null, (summonSeq += 1), R, [], null);
  if (!res.ok || res.born.render.mode !== 'immersion') {
    throw new Error(`world: the person-path summon of "${key}" failed (${res.ok ? res.born.render.mode : res.reason})`);
  }
  return res.born.render.model;
};

// ----- dim 2: the gallery fix + the summoned six draw their certified basis --
{
  console.log('----- [dim 2] CUT 0: the band starts EMPTY; the summoned six draw loops === the certified basis -----');
  check('★ THE GALLERY FIX: the world seeds NO dim-2 forms — the band starts EMPTY (the six enter only by the person-path summon)',
    Array.isArray(world.dim2) && world.dim2.length === 0);
  const summoned = WORLD_SURFACES.map((key) => summonReference(key));
  const expectedLoops = { torus: 2, klein: 2, rp2: 1, sphere: 0, cylinder: 1, mobius: 1 };
  check('the summon covers exactly the committed immersion keys (B-flag guard: no non-single-polygon surface)',
    summoned.length === WORLD_SURFACES.length &&
    summoned.every((m, k) => m.surface === WORLD_SURFACES[k] && m.immersion.correspondence.surface === m.surface));
  for (const model of summoned) {
    const inv = model.invariants;
    const want = expectedLoops[model.surface];
    check(`${model.surface}: draws ${want} loop(s) === certified b₁ (${inv.cert ? inv.cert.b1 : 'n-a'})`,
      Boolean(inv.cert && model.loops.length === want && inv.cert.b1 === want));
  }
  // ★ THE PARITY LEGS (reference == person, falsifiable): a SECOND independent
  // summon is byte-identical, and the summoned drawing IS the committed
  // buildInkedFormModel drawing — the render did not change, its PROVENANCE
  // did. A future "nicer" reference path breaks these two, loud.
  check('★ PARITY: two independent person-path toruses → byte-identical models (JSON)',
    JSON.stringify(summonReference('torus')) === JSON.stringify(summoned[0]));
  check('★ PARITY: summoned torus + klein === the direct buildInkedFormModel drawing (same bytes — no reference-only render exists)',
    JSON.stringify(summoned[0]) === JSON.stringify(buildInkedFormModel({ surface: 'torus', resolution: R })) &&
    JSON.stringify(summoned[1]) === JSON.stringify(buildInkedFormModel({ surface: 'klein', resolution: R })));
  // ★ NO BYPASS: the view never calls buildInkedFormModel — the summon goes
  // through applyPlaygroundOperationTo (the person's seam), asserted on source.
  const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
  check('★ NO BYPASS: ManuscriptView names buildInkedFormModel ZERO times and carries the person-path summon (applyPlaygroundOperationTo + "load the reference zoo")',
    (viewSrc.match(/buildInkedFormModel/g) ?? []).length === 0 &&
    viewSrc.includes('applyPlaygroundOperationTo') &&
    viewSrc.includes('load the reference zoo'));
  const klein = summoned.find((m) => m.surface === 'klein');
  check('KLEIN: two word loops a, b — both closed cycles (letters verbatim)',
    Boolean(klein && klein.loops.length === 2 &&
      klein.loops[0].label === 'a' && klein.loops[1].label === 'b' &&
      klein.loops.every((l) => l.vertexPath[0] === l.vertexPath[l.vertexPath.length - 1])));
  check("KLEIN: certifier — b₁=2, NON-orientable, w₁Class=[0,1] (ONE free + ONE torsion pairing)",
    Boolean(klein && klein.invariants.cert && klein.invariants.cert.b1 === 2 &&
      klein.invariants.cert.nonOrientable &&
      JSON.stringify(klein.invariants.cert.w1Class) === '[0,1]'));
  check("KLEIN: caption H₁ = 'ℤ ⊕ ℤ/2'", Boolean(klein && klein.h1Label === 'ℤ ⊕ ℤ/2'));
  const torus = summoned.find((m) => m.surface === 'torus');
  const rp2 = summoned.find((m) => m.surface === 'rp2');
  const sphere = summoned.find((m) => m.surface === 'sphere');
  check("trio unchanged: torus 'ℤ ⊕ ℤ' [0,0] · RP² 'ℤ/2' [1] · sphere '0' []",
    Boolean(torus && rp2 && sphere &&
      torus.h1Label === 'ℤ ⊕ ℤ' && JSON.stringify(torus.invariants.cert.w1Class) === '[0,0]' &&
      rp2.h1Label === 'ℤ/2' && JSON.stringify(rp2.invariants.cert.w1Class) === '[1]' &&
      sphere.h1Label === '0' && sphere.invariants.cert.w1Class.length === 0));
  check('open cores carry their certified provenance (basisEdgeIds present)',
    ['cylinder', 'mobius'].every((key) => {
      const m = summoned.find((x) => x.surface === key);
      return m && m.loops.length === 1 && m.loops[0].label === 'core' && Array.isArray(m.loops[0].basisEdgeIds);
    }));
}

// ----- dim 1: honest cut-born skeletons -------------------------------------
{
  console.log('----- [dim 1] cut-born skeletons: real positions, level-1 certified H₁ -----');
  const loop = world.dim1.find((m) => m.key === 'loop');
  const arc = world.dim1.find((m) => m.key === 'arc');
  check('population: the loop (cut 12-gon) + the arc (cut segment)', Boolean(loop && arc) && world.dim1.length === 2);
  check('loop: FACE-LESS, 12 edges over 12 vertices',
    Boolean(loop && loop.shape.faces.length === 0 && loop.shape.edges.length === 12 &&
      Object.keys(loop.shape.vertices).length === 12));
  check('loop: level-1 rung — one component, b₁=1; H₁ label ℤ (free, graph arithmetic)',
    Boolean(loop && loop.invariants.level1 && loop.invariants.level1.components === 1 &&
      loop.invariants.level1.b1 === 1 && loop.h1Label === 'ℤ'));
  const source = loadForm(nGon(12));
  check('loop: positions pass through VERBATIM from the source polygon (the cut mints nothing)',
    Boolean(loop && Object.values(loop.shape.vertices).every((v) => {
      const s = source.vertices[v.id];
      return s && s.position.every((c, i) => c === v.position[i]);
    })));
  check('arc: FACE-LESS, b₁=0 — the dim-1 null case (no generator claim)',
    Boolean(arc && arc.shape.faces.length === 0 && arc.invariants.level1 &&
      arc.invariants.level1.b1 === 0 && arc.h1Label === '0'));
  check('labels === the committed readout (independent readFormInvariants pass)',
    world.dim1.every((m) => {
      const fresh = readFormInvariants(m.shape);
      return m.h1Label === h1LabelFromLevel1(fresh) &&
        JSON.stringify(fresh.level1) === JSON.stringify(m.invariants.level1);
    }));
  note(`loop b₁=${loop && loop.invariants.level1.b1} | arc b₁=${arc && arc.invariants.level1.b1}`);
}

// ----- dim 3: the fundamental domain, certified ------------------------------
{
  console.log('----- [dim 3] the 3-torus fundamental domain: tower-certified, never a body -----');
  const domain = world.dim3[0];
  check('population: exactly the 3-torus domain', world.dim3.length === 1 && domain.key === 't3');
  const tower = domain.tower;
  check('tower: SOUND (S² gate) with χ=0 CONSISTENT', tower.sound === true && tower.chi === 0 && tower.chiConsistent === true);
  check('tower: orientable, H₁ = Z^3, torsion-free',
    tower.orientable === true && tower.homology.H1.pretty === 'Z^3' &&
    tower.homology.H1.free === 3 && tower.homology.H1.torsion.length === 0);
  check('complex counts read {v:1, e:3, f:3, c:1} (the T³ CW-structure, off the union-finds)',
    JSON.stringify(domain.complex.counts) === JSON.stringify({ v: 1, e: 3, f: 3, c: 1 }));
  check('identification: 3 PRESERVING pairs over 6 DISTINCT real cube faces',
    domain.pairs.length === 3 && domain.pairs.every((p) => p.mode === 'preserving') &&
    new Set(domain.pairs.flatMap((p) => p.faceIds)).size === 6 &&
    domain.pairs.flatMap((p) => p.faceIds).every((id) => domain.shape.faces.some((f) => f.id === id)));
  const centroidOf = (faceId) => {
    const face = domain.shape.faces.find((f) => f.id === faceId);
    const sum = face.vertexIds.reduce((acc, id) => {
      const p = domain.shape.vertices[id].position;
      return [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]];
    }, [0, 0, 0]);
    return sum.map((c) => c / face.vertexIds.length);
  };
  check('marks: pair centers === the real face centroids (re-derived)',
    domain.pairs.every((p) => p.faceIds.every((id, side) => {
      const want = centroidOf(id);
      return want.every((c, i) => Math.abs(c - p.centers[side][i]) < 1e-9);
    })));
  check('the domain draws the cube WIREFRAME (12 real edges) — no solid-body geometry in the model',
    domain.shape.edges.length === 12 && domain.shape.cells.length === 1 &&
    !('bodyGeometry' in domain));
  note(`H₁ ${tower.homology.H1.pretty} | gate sound=${tower.sound} | χ ${tower.chi}`);
}

// ----- determinism ------------------------------------------------------------
{
  console.log('----- [determinism] two independent world builds + summon sweeps agree -----');
  const again = buildManuscriptWorld(R);
  check('CUT 0: a second world build seeds dim2 EMPTY too (the fix is the builder\'s, not a call-order accident)',
    again.dim2.length === 0);
  check('summon determinism: a full second person-path sweep yields identical loop label sets',
    JSON.stringify(WORLD_SURFACES.map((key) => summonReference(key).loops.map((l) => l.label))) ===
    JSON.stringify(WORLD_SURFACES.map((key) => summonReference(key).loops.map((l) => l.label))));
  check('dim3 tower verdicts identical across builds',
    JSON.stringify([again.dim3[0].tower.sound, again.dim3[0].tower.chi, again.dim3[0].tower.homology.H1.pretty]) ===
    JSON.stringify([world.dim3[0].tower.sound, world.dim3[0].tower.chi, world.dim3[0].tower.homology.H1.pretty]));
}

console.log(
  failures === 0
    ? '\n--- manuscript world (2a + CUT 0: the dim-2 band starts EMPTY; the summoned six certified faithfully — Klein free+torsion, cores, domains): no failures ---\n\nALL PASS'
    : `\n--- manuscript world: ${failures} FAILURE(S) ---`,
);
process.exitCode = failures === 0 ? 0 : 1;

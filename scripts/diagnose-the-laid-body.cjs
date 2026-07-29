#!/usr/bin/env node

// DIAGNOSTIC — UNIFICATION: PASS-PARITY of the laid body.
//
// The laid body renders through the ONE crafted renderer (InkedForm) via the
// laidInkedModel adapter. This instrument BITES: every pass of the frozen
// stack must be FED by the adapter — drop any pass's input (an empty mesh, a
// silent chain loss, a stripped loop set, a de-wired view) and a clause here
// FAILS. A vacuous parity instrument is the seal-must-execute scar; this one
// measures the real adapter output of the real committed flows.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the
// guard; the frozen pair (InkedForm.tsx / inkedFormModel.ts) is additionally
// pinned BYTE-IDENTICAL to the engine-freeze manifest below.

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
const { thicken } = req('src/lib/thicken.ts');
const { applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const { tryLaidBodyModel } = req('src/manuscript/laidBodyModel.ts');
const { buildLaidInkedModel } = req('src/manuscript/laidInkedModel.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('UNIFICATION pass-parity: the laid body feeds EVERY pass of the one crafted renderer\n');

// ---------------------------------------------------------------------------
// the two laid subjects, through the committed doors
// ---------------------------------------------------------------------------
let seq = 700;
const ringSpec = (name) => () => ({
  name,
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
});
const laidVia = (op, name) => {
  const ring = loadForm(ringSpec(name));
  const band = thicken(ring).shape;
  const born = applyPlaygroundOperationTo(op, band, null, (seq += 1), 24, [ring]);
  if (!born.ok) return null;
  return tryLaidBodyModel(born.born.shape, [band, ring]);
};

const subjects = [
  { key: 'torus', laid: laidVia('sew-boundary-preserving', 'parity-t'), b1: 2 },
  { key: 'klein', laid: laidVia('sew-boundary-reversing', 'parity-k'), b1: 2 },
];

for (const subject of subjects) {
  console.log(`----- [${subject.key}] every pass fed -----`);
  check(`§1 ${subject.key}: the lay succeeds through the committed doors`, subject.laid !== null);
  if (!subject.laid) continue;
  const inked = buildLaidInkedModel(subject.laid);
  const shape = inked.immersion.shape;
  const vertexIds = new Set(Object.keys(shape.vertices));
  note(`${subject.key}: mesh V ${vertexIds.size} · faces ${shape.faces.length} · construction edges ${shape.edges.length} · loops ${inked.loops.length}`);
  // pass −2/0/0.5/−1 (prepass · body · hatching · hull) ride the FACES
  check(`§1 ${subject.key}: the BODY passes are fed — a dense welded mesh (≥ 200 triangles, every id resolvable)`,
    shape.faces.length >= 200 &&
      shape.faces.every((f) => f.vertexIds.length === 3 && f.vertexIds.every((id) => vertexIds.has(id))));
  // passes 1/2 (construction near + hidden) ride the EDGES — the person's cells
  const chainIds = new Set(shape.edges.map((e) => e.id.split(':').slice(0, 3).join(':')));
  check(`§1 ${subject.key}: the CONSTRUCTION passes are fed — the person's ${subject.laid.counts.e} cell curves ride as chains (≥ one chain per class, every endpoint resolvable)`,
    shape.edges.length >= 50 &&
      chainIds.size >= subject.laid.counts.e &&
      shape.edges.every((e) => vertexIds.has(e.vertexIds[0]) && vertexIds.has(e.vertexIds[1])));
  // passes 9/10 (generator hidden + near) ride the LOOPS — the certified basis
  check(`§1 ${subject.key}: the GENERATOR passes are fed — loops present, closed, resolvable, sampled (≥ 8 points each)`,
    inked.loops.length >= 1 &&
      inked.loops.every(
        (loop) =>
          loop.vertexPath.length >= 8 &&
          loop.vertexPath[0] === loop.vertexPath[loop.vertexPath.length - 1] &&
          loop.vertexPath.every((id) => vertexIds.has(id)),
      ));
  const generatorCount = new Set(inked.loops.map((l) => l.label.split('·')[0])).size;
  check(`§1 ${subject.key}: the drawn basis IS the certified basis — ${subject.b1} generators (b₁), never fewer`,
    subject.laid.inked.b1 === subject.b1 && generatorCount === subject.b1);
  check(`§1 ${subject.key}: the caption/card surfaces ride along (invariants + H₁ present)`,
    inked.invariants === subject.laid.invariants && inked.h1Label === subject.laid.h1Label);
}

// ---------------------------------------------------------------------------
// [2] the VIEW wire — the laid branch renders the ONE crafted renderer
// ---------------------------------------------------------------------------
console.log('\n----- [2] the view routes the laid body INTO InkedForm (no second re-implementation) -----');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check('§2 the laid branch renders <InkedForm model={laidInked} …> with the crafted stack',
  /laid && laidInked \? \(/.test(viewSrc) && viewSrc.includes('model={laidInked}') && viewSrc.includes('buildLaidInkedModel'));
check('§2 the cell overlay rides ON TOP (dots · crossing ghost · rims), never a second body renderer',
  viewSrc.includes('<LaidCellOverlay') && !viewSrc.includes('<LaidBody'));
check('§2 the pen compensates the group scale through the CRAFT prop (P4 at-spec, frozen craft untouched)',
  viewSrc.includes('silhouetteCtl.screenspacePx / Math.max(0.0001, scaleCtl.dim2Scale)'));

// ---------------------------------------------------------------------------
// [3] the frozen pair is BYTE-IDENTICAL to the manifest (consumed, never edited)
// ---------------------------------------------------------------------------
console.log('\n----- [3] the hard rail: InkedForm.tsx / inkedFormModel.ts byte-identical -----');
const manifest = fs.readFileSync(path.join(repoRoot, 'docs/governance/ENGINE_FREEZE_MANIFEST.txt'), 'utf8');
for (const file of ['src/manuscript/InkedForm.tsx', 'src/manuscript/inkedFormModel.ts']) {
  const row = manifest.split('\n').find((line) => line.startsWith(file));
  const pinned = row ? row.trim().split(/\s+/)[1] : null;
  const actual = crypto
    .createHash('sha256')
    .update(fs.readFileSync(path.join(repoRoot, file), 'utf8').replace(/\r/g, ''))
    .digest('hex');
  note(`${file}: manifest ${pinned ? pinned.slice(0, 12) : '(no row)'} · working ${actual.slice(0, 12)}`);
  check(`§3 ${file} matches its engine-freeze hash (the unification consumed it, never edited it)`, pinned !== null && pinned === actual);
}

console.log(
  `\n--- UNIFICATION pass-parity (mesh · construction · loops · wire · frozen): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

#!/usr/bin/env node

// DIAGNOSTIC — refineAcquiredToDisk: combine accepts the person's own
// lift-built forms, at the SAME measured type as the invoked route.
//
// THE TEETH (this witness BITES — a planted wrong mode, a broken routing, or
// a dropped carried chain flips it RED):
//   §1 the invoked pair (word torus ⊕ word möbius) combines through the
//      committed word path and classifies — MEASURED, never invented;
//   §2 the person's lift-built torus (multiform ring → thicken →
//      sew-preserving → snapshot → load) combines with the möbius through the
//      WORDLESS pair — the flow this arc unblocks;
//   §3 ★ THE TYPE LAW: both children carry THE SAME measured class (kind ·
//      cross-caps/genus · boundary) — a type mismatch anywhere in the
//      wordless rim (mode synthesis, convention, carrier) lands here RED;
//   §4 the routing is WORD-RECOVERABILITY (the committed replay probe), never
//      a provenance flag — grepped on the store's own bytes.
//
// Anti-mock: the REAL TS modules through the transpile hook.

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
require.extensions['.tsx'] = require.extensions['.ts'];

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { usePlaygroundStore } = req('src/store/playgroundStore.ts');
const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { thicken } = req('src/lib/thicken.ts');
const { applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const { serializeSnapshot } = req('src/playground/snapshot.ts');
const { classifyForm, classLabel } = req('src/manuscript/surfaceClassifier.ts');
const { recoverBornSurface } = req('src/playground/bornFormRouting.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
let seq = 800;

console.log('refineAcquiredToDisk: combine accepts lift-built forms at the invoked type\n');

const G = () => usePlaygroundStore.getState();
G().resetPlayground();

// ---------------------------------------------------------------------------
// §1 — the INVOKED pair through the committed word path
// ---------------------------------------------------------------------------
console.log('----- §1 the invoked pair: word torus ⊕ word möbius -----');
const hostT = loadForm(nGon(4), 'wt');
const bornT = applyPlaygroundOperationTo('glue-torus', hostT, null, (seq += 1), 24, [], null);
const hostM = loadForm(nGon(4), 'wm');
const bornM = applyPlaygroundOperationTo('flip-glue-mobius', hostM, null, (seq += 1), 24, [], null);
check('§1 the committed word doors birth the torus and the möbius', bornT.ok && bornM.ok);
G().addForm(hostT, { source: 'wt', origin: 'invoked' });
G().addForm(bornT.born.shape, { source: 'wt', origin: 'born' });
G().addForm(hostM, { source: 'wm', origin: 'invoked' });
G().addForm(bornM.born.shape, { source: 'wm', origin: 'born' });
check('§4 BOTH invoked forms are word-RECOVERABLE (the routing probe would say refineToDisk)',
  recoverBornSurface(bornT.born.shape, hostT) !== null && recoverBornSurface(bornM.born.shape, hostM) !== null);
G().selectForm(bornT.born.shape.id);
let invokedClass = null;
try {
  const child = G().applyCombineToSelection(bornM.born.shape.id);
  const cls = classifyForm(child, Object.values(G().forms).map((f) => f.shape));
  if (cls.ok && cls.components.length === 1) invokedClass = cls.components[0].class;
  note(`invoked child: V${Object.keys(child.vertices).length} E${child.edges.length} F${child.faces.length} · ${cls.ok ? classLabel(cls.components[0].class) : 'unclassified'}`);
} catch (err) {
  note(`invoked combine THREW: ${String(err.message).slice(0, 120)}`);
}
check('§1 the invoked pair combines and classifies (single component)', invokedClass !== null);

// ---------------------------------------------------------------------------
// §2 — the person's lift-built torus, loaded and combined (the wordless pair)
// ---------------------------------------------------------------------------
console.log('\n----- §2 the lift-built torus (fold-thicken-sew, loaded) ⊕ möbius -----');
const ring = loadForm(() => ({
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
}));
const band = thicken(ring).shape;
const sewn = applyPlaygroundOperationTo('sew-boundary-preserving', band, null, (seq += 1), 24, [ring]);
check('§2 the committed sew door births the acquired torus', sewn.ok === true);
check('§2 the acquired torus carries NO recoverable word (the wordless case is real)',
  recoverBornSurface(sewn.born.shape, band) === null);
const file = serializeSnapshot(sewn.born.shape, 'lift', [band, ring]);
const loaded = G().loadSnapshot(file, 'liftsrc');
check('§2 the loaded form carries its reconstructed chain (the store keeps the acquire-metadata)',
  (G().loadedAncestors[loaded.id] ?? []).length >= 1);
const hostM2 = loadForm(nGon(4), 'wm2');
const bornM2 = applyPlaygroundOperationTo('flip-glue-mobius', hostM2, null, (seq += 1), 24, [], null);
G().addForm(hostM2, { source: 'wm2', origin: 'invoked' });
G().addForm(bornM2.born.shape, { source: 'wm2', origin: 'born' });
G().selectForm(loaded.id);
let acquiredClass = null;
try {
  const child = G().applyCombineToSelection(bornM2.born.shape.id);
  const cls = classifyForm(child, Object.values(G().forms).map((f) => f.shape));
  if (cls.ok && cls.components.length === 1) acquiredClass = cls.components[0].class;
  note(`acquired child: V${Object.keys(child.vertices).length} E${child.edges.length} F${child.faces.length} · ${cls.ok ? classLabel(cls.components[0].class) : 'unclassified'}`);
} catch (err) {
  note(`acquired combine THREW: ${String(err.message).slice(0, 160)}`);
}
check('★★ §2 the lift-built torus COMBINES (the flow this arc unblocks) and classifies', acquiredClass !== null);

// ---------------------------------------------------------------------------
// §3 — ★ THE TYPE LAW: both routes land the SAME measured class
// ---------------------------------------------------------------------------
console.log('\n----- §3 ★ THE TYPE LAW -----');
check('★★ §3 acquired ⊕ möbius === invoked ⊕ möbius — THE SAME measured class (kind · k/g · b)',
  invokedClass !== null && acquiredClass !== null &&
    invokedClass.kind === acquiredClass.kind &&
    invokedClass.b === acquiredClass.b &&
    (invokedClass.kind === 'orientable'
      ? invokedClass.g === acquiredClass.g
      : invokedClass.k === acquiredClass.k));
if (invokedClass && acquiredClass) {
  note(`the type, both routes: "${classLabel(invokedClass)}" (χ ${invokedClass.chi})`);
}

// ---------------------------------------------------------------------------
// §4 — the routing is WORD-RECOVERABILITY on the store's own bytes
// ---------------------------------------------------------------------------
console.log('\n----- §4 routed by word-recoverability, never provenance -----');
const storeSrc = fs.readFileSync(path.join(repoRoot, 'src/store/playgroundStore.ts'), 'utf8');
check('§4 the probe is the committed replay recovery (recoverBornSurface) at the routing fork',
  /form\.faces\.length === 1 && recoverBornSurface\(form, parent\)/.test(storeSrc));
check('§4 the wordless branch is refineAcquiredToDisk with the carried lineage',
  storeSrc.includes('refineAcquiredToDisk(form, lineage.length > 0 ? lineage : null)'));
check('§4 no provenance flag routes (origin/source never decide the refine)',
  !/origin === '(loaded|born|invoked)'[^\n]*refine/i.test(storeSrc));
check('§4 the pairwise equalize rides the pair (M2)', storeSrc.includes('equalizePreparedDisks(preparedA, preparedB)'));

console.log(
  `\n--- refineAcquiredToDisk (invoked type ⇄ acquired type · routing · the unblocked flow): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

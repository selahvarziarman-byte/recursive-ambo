#!/usr/bin/env node

// DIAGNOSTIC — THE BODILESS CARD: an ENACTED form whose render refuses is
// KEPT (a bodiless ledger card), never dropped; an INPUT-refused act stays a
// passing notice. The discriminator is FREE — was the born shape assigned
// before the catch (enacted) or not (input-refused) — never a string parse.
//
// THE MEASURED SUBJECTS (the engine chose them, not the witness):
//   · DOCK — the canonical vertex-pinch identify: `flip-glue` COMPOSED on the
//     cylinder quotient (glue-cylinder → flip-glue) pinches, and the
//     committed link gate refuses the body while the word is already written.
//   · COMBINE — the p-immerse wedge (two tori pinched at a vertex, the
//     canonical assemble+merge) connect-summed with a torus: the sum ENACTS
//     and the child's classification refuses. (The mandate braced for a
//     synthetic thread-test here; the engine yields the REAL pinch — no
//     synthesis was needed, honestly better.)
//
// THE TEETH: a planted drop-on-refuse in EITHER frozen catch (returning
// without `enacted`) or a de-wired view drop site flips a clause RED.
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

const { loadForm, assemble } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { serializeSnapshot, deserializeSnapshot } = req('src/playground/snapshot.ts');
const { applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const { birthChild } = req('src/manuscript/genesisModel.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
let seq = 850;

console.log('THE BODILESS CARD: enacted persists · input-refused stays a notice\n');

// ---------------------------------------------------------------------------
// §1 DOCK — the canonical vertex-pinch identify (flip-glue on the cylinder)
// ---------------------------------------------------------------------------
console.log('----- §1 the dock path: enacted + render-refused → the bodiless card -----');
const square = loadForm(nGon(4), 'bd');
const cyl = applyPlaygroundOperationTo('glue-cylinder', square, null, (seq += 1), 8, [], null);
check('§1 the cylinder quotient births (the composed chain\'s host)', cyl.ok === true);
const pinch = applyPlaygroundOperationTo('flip-glue', cyl.born.shape, square, (seq += 1), 8, [], null);
check('★★ §1 flip-glue on the quotient ENACTS and returns the bodiless card ({ok:false, enacted})',
  pinch.ok === false && pinch.enacted !== undefined);
if (!pinch.ok && pinch.enacted) {
  const en = pinch.enacted;
  note(`word=${en.shape.genealogy.operation} · reason="${String(pinch.reason).slice(0, 110)}"`);
  check('★ §1 the genealogy word IS written: flip-glue (the identify\'s own mint)', en.shape.genealogy.operation === 'flip-glue');
  check('★ §1 the reason is the committed gate\'s own (the pinch named, never invented)',
    pinch.reason.includes('non-manifold vertex link'));
  check('★ §1 the render is the bodiless card (mode, reason carried, shape carried)',
    en.render.mode === 'bodiless' && en.render.reason === pinch.reason && en.render.shape === en.shape);
  // E5 — invariants iff computable, INDEPENDENTLY re-derived
  let computable = null;
  try {
    computable = readFormInvariants(en.shape, [cyl.born.shape, square]);
  } catch {
    computable = null;
  }
  check('★ §1 invariants ride the card IFF the committed readout computes (never fabricated)',
    (en.render.mode === 'bodiless') && ((computable !== null) === (en.render.invariants !== undefined)));
}

// ---------------------------------------------------------------------------
// §2 COMBINE — the wedge (canonical pinch) connect-summed
// ---------------------------------------------------------------------------
console.log('\n----- §2 the combine path: the pinched sum persists -----');
const copyOf = (shape, prefix) => deserializeSnapshot(serializeSnapshot(shape, prefix)).shape;
const torusRep = (prefix) => copyOf(immerseSurface({ surface: 'torus', resolution: 4 }).shape, prefix);
const wA = torusRep('dwA');
const wB = torusRep('dwB');
const wedge = assemble([wA, wB], {
  merges: [{ resultId: 'pinch:w', sources: [Object.keys(wA.vertices)[0], Object.keys(wB.vertices)[0]] }],
}).shape;
const partner = torusRep('dwC');
const birth = birthChild(wedge, partner, (seq += 1), wedge.faces[0], partner.faces[0], 8);
check('★★ §2 the pinched connect-sum ENACTS and returns the bodiless card ({ok:false, enacted})',
  birth.ok === false && birth.enacted !== undefined);
if (!birth.ok && birth.enacted) {
  note(`word=${birth.enacted.shape.genealogy.operation} · reason="${String(birth.reason).slice(0, 110)}"`);
  check('★ §2 the child\'s genealogy word is written (assemble — the sum\'s own mint)',
    birth.enacted.shape.genealogy.operation === 'assemble');
  check('★ §2 the reason names the pinch through the committed gate', birth.reason.includes('non-manifold vertex link'));
  check('★ §2 BOTH parents ride the card (the story collector\'s law)',
    Array.isArray(birth.enacted.parentShapes) && birth.enacted.parentShapes.length === 2);
}

// ---------------------------------------------------------------------------
// §3 INPUT-REFUSED — unchanged: a notice, never a card
// ---------------------------------------------------------------------------
console.log('\n----- §3 input-refused stays a passing notice (no card, no enacted) -----');
const sewRefuse = applyPlaygroundOperationTo('sew-boundary-preserving', cyl.born.shape, square, (seq += 1), 8, [], null);
check('§3 the degenerate sew on the quotient is INPUT-refused — no enacted rides it',
  sewRefuse.ok === false && sewRefuse.enacted === undefined);
const gateRefuse = birthChild(wedge, partner, (seq += 1), null, null, 8);
check('§3 a gate-refused combine (no port faces) carries NO enacted', gateRefuse.ok === false && gateRefuse.enacted === undefined);

// ---------------------------------------------------------------------------
// §4 THE WIRES — both drop sites persist; the discriminator is structural
// ---------------------------------------------------------------------------
console.log('\n----- §4 the view persists at BOTH drop sites; the discriminator is bornShape-assigned -----');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check('§4 the DOCK drop site persists the enacted card (setWritten, not a return)',
  (viewSrc.match(/if \(result\.enacted\) \{/g) ?? []).length >= 2 && viewSrc.includes("render.mode === 'bodiless'"));
check('§4 the caption/card speak the ledger (“no faithful body” + the genealogy word)',
  viewSrc.includes('no faithful body — {render.reason}') && viewSrc.includes('enacted · ${render.shape.genealogy.operation}'));
const wfmSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/writtenFormModel.ts'), 'utf8');
check('§4 the discriminator is STRUCTURAL — enacted is built in the render-catch after bornShape assignment, never parsed from the reason string',
  wfmSrc.includes('bornShape = operation.execute(context)') &&
    /catch[\s\S]{0,700}buildBodilessWrittenForm\(\s*\n?\s*bornShape/.test(wfmSrc) &&
    !/reason\.(includes|match|startsWith)/.test(wfmSrc));
const genSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/genesisModel.ts'), 'utf8');
check('§4 the combine catch threads the SAME builder on the assigned child',
  /catch[\s\S]{0,700}buildBodilessWrittenForm\(\s*\n?\s*child/.test(genSrc));

console.log(
  `\n--- THE BODILESS CARD (enacted persists · refused notices · both paths wired): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

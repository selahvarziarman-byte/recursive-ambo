#!/usr/bin/env node

// DIAGNOSTIC — P3.5, THE COMBINE INVESTIGATION (Arman's question): is the
// person's COMBINE covered by the conformal layer RIGHT NOW? Combine =
// `connectedSum` = cut + cut + glue; P2/P3 preserve the atom, but the frozen
// `connectedSum` DELEGATES its gluing — this witness RUNS real combines on
// OWNED operands and reports the finding.
//
// ★★ THE FINDING (measured, both real paths): **COMBINE RIDES FREE.**
//   · the canonical SPHERE # SPHERE (two owned tetra surfaces, operand B
//     namespaced through the COMMITTED snapshot load): every surviving face
//     keeps [π/3 ×3] verbatim through the frozen delegation, χ=2 CERTIFIED
//     ("genus 0 (closed, orientable)"), and Σ deficit = 4π = 2πχ exactly;
//   · the manuscript path (birthChild on two P1-subdivided squares) ENACTS
//     and the render refuses the child (a REAL vertex-pinch at the seam —
//     the FIX-1 bodiless outcome); the enacted shape's conformal read is
//     CONSISTENT with its own stratum (the world is never half-true).
//
// THE TEETH: the witness can TELL RIDES from DROPS — an in-witness negative
// control (a face stripped of its atom) flips the finding to DROPS and the
// seal to the un-owned refusal, EVERY run; a witness that cannot discern
// cannot pass.
//
// WITNESS-ONLY: no engine change — connectedSum (FROZEN) untouched;
// geometry/manifest byte-identical to HEAD (asserted).
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
const { connectedSum } = req('src/lib/connectedSum.ts');
const { serializeSnapshot } = req('src/playground/snapshot.ts');
const { subdivideFace } = req('src/lib/surfaceRefinement.ts');
const { birthChild } = req('src/manuscript/genesisModel.ts');
const { acquireComplex } = req('src/lib/complexIdentification.ts');
const { computeSeedCornerAngles, readVertexCurvatures, gaussBonnetTotal } = req('src/lib/conformalAtom.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const near = (a, b, eps = 1e-9) => Math.abs(a - b) < eps;
const P = Math.PI;

console.log('P3.5 — does the combine carry the atom? RUN it and read the answer\n');

const G = () => usePlaygroundStore.getState();
G().resetPlayground();
const sealOf = (shape, ancestry) => {
  const acq = acquireComplex(shape, ancestry ?? null);
  return gaussBonnetTotal(readVertexCurvatures(shape, acq ? acq.complex : undefined));
};

// ---------------------------------------------------------------------------
// §1 the operands are genuinely OWNED and individually sealed
// ---------------------------------------------------------------------------
console.log('----- §1 the operands: owned + individually sealed -----');
const A = computeSeedCornerAngles({ ...createSeedShape('tetrahedron'), cells: [] });
const B = G().loadSnapshot(serializeSnapshot(A, 'p35b'), 'p35src'); // the COMMITTED namespacing
check('§1 (E1) BOTH tetra-surface operands are OWNED ([π/3 ×3] ×4 each; B namespaced through the committed snapshot load, angles riding the frozen spread)',
  A.faces.every((f) => f.cornerAngles?.every((a) => near(a, P / 3))) &&
    B.faces.every((f) => f.cornerAngles?.every((a) => near(a, P / 3))));
check('§1 (E1) each operand SEALS on its own (closed tetra surface: Σ = 4π = 2π·2, χ=2 certified)',
  readFormInvariants(A).chi === 2 &&
    near(sealOf(A, null), 4 * P) &&
    near(sealOf(B, null), 4 * P));

// ---------------------------------------------------------------------------
// §2 ★★ THE FINDING — the canonical sphere # sphere RIDES and SEALS
// ---------------------------------------------------------------------------
console.log('\n----- §2 ★★ THE FINDING: sphere # sphere through the frozen connectedSum -----');
const sum = connectedSum(A, B, { faceA: A.faces[0], faceB: B.faces[0] }).shape;
const inv = readFormInvariants(sum, [A, B]);
note(`sum: V${Object.keys(sum.vertices).length} E${sum.edges.length} F${sum.faces.length} · χ=${inv.chi} · ${inv.classification}`);
note(`faces: ${sum.faces.map((f) => (f.cornerAngles ? `[${f.cornerAngles.map((a) => ((a * 180) / P).toFixed(0)).join(',')}]` : 'UN-OWNED')).join(' ')}`);
check('★★ §2 (E2/E3) THE ATOM RIDES the real combine: EVERY surviving face of sphere#sphere keeps [π/3 ×3] verbatim through the frozen delegation (V5 E9 F6; the two port faces gone), χ=2 CERTIFIED — "genus 0 (closed, orientable)"',
  Object.keys(sum.vertices).length === 5 &&
    sum.faces.length === 6 &&
    inv.chi === 2 &&
    inv.classification === 'genus 0 (closed, orientable)' &&
    sum.faces.every((f) => f.cornerAngles?.length === 3 && f.cornerAngles.every((a) => near(a, P / 3))));
const sumTotal = sealOf(sum, [A, B]);
note(`Σ deficit = ${(sumTotal / P).toFixed(6)}π vs 2πχ = ${2 * inv.chi}π (2 apexes deficit π + 3 seam vertices deficit 2π/3)`);
check('★★ §2 (E4) THE SEAL HOLDS on the combined form: Σ deficit = 4π = 2π·2 (quotient-correct through the acquired complex) — COMBINE RIDES FREE, confirmed',
  near(sumTotal, 2 * P * inv.chi));

// ---------------------------------------------------------------------------
// §3 the manuscript path — the OTHER honest outcome (enacted, pinch, bodiless)
// ---------------------------------------------------------------------------
console.log('\n----- §3 the manuscript path: the subdivided-squares pair ENACTS into a real pinch -----');
const mkSub = (ns) => {
  const sq = G().invokeForm(nGon(4), ns);
  const f = sq.faces[0];
  const sub = subdivideFace(sq, f, f.vertexIds[0], f.vertexIds[2]).shape;
  return { sub, disk: sub.faces.find((x) => x.id.endsWith(':disk')) };
};
const opA = mkSub('cbA');
const opB = mkSub('cbB');
check('§3 (E1) the second operand pair is owned too (P1-split [π/4, π/2, π/4] ×2 each) and individually sealed (Σ = 2π = 2π·1)',
  [opA, opB].every(({ sub }) => sub.faces.every((f) => Array.isArray(f.cornerAngles))) &&
    near(sealOf(opA.sub, null), 2 * P) &&
    near(sealOf(opB.sub, null), 2 * P));
const birth = birthChild(opA.sub, opB.sub, 900, opA.disk, opB.disk, 24);
check('§3 (E2) birthChild RUNS the real path: the sum ENACTS and the render honestly refuses the child (a REAL seam vertex-pinch → the FIX-1 bodiless outcome, not a silent land)',
  birth.ok === false &&
    birth.enacted !== undefined &&
    birth.enacted.render.mode === 'bodiless' &&
    String(birth.reason).includes('non-manifold vertex link'));
if (birth.ok === false && birth.enacted) {
  const en = birth.enacted.shape;
  const enOwned = en.faces.every((f) => Array.isArray(f.cornerAngles));
  note(`enacted child faces: ${en.faces.map((f) => (f.cornerAngles ? 'owned' : 'UN-OWNED')).join(' · ')}`);
  check('§3 (E3/E4) the enacted child\'s world is CONSISTENT: the atom rides the enacted shape too, and its conformal read REFUSES at the pinch (the junction valence — the same honest boundary as P2, never a false 2πχ)',
    enOwned &&
      (() => {
        try {
          const acq = acquireComplex(en, [opA.sub, opB.sub]);
          readVertexCurvatures(en, acq ? acq.complex : undefined);
          return false; // a pinch must not read
        } catch (e) {
          return String(e.message).includes('link valence "junction"');
        }
      })());
}

// ---------------------------------------------------------------------------
// §4 the discriminator BITES + witness-only
// ---------------------------------------------------------------------------
console.log('\n----- §4 the discriminator (RIDES vs DROPS) + witness-only -----');
// the negative control (runs every time): a DROPPED copy must flip the finding
const dropped = {
  ...sum,
  faces: sum.faces.map((f, i) => {
    if (i !== 0) return f;
    const { cornerAngles: _gone, ...rest } = f;
    return rest;
  }),
};
check('§4 THE WITNESS CAN TELL: a stripped face flips the finding to DROPS and the seal to the un-owned refusal — the discriminator bites every run',
  !dropped.faces.every((f) => Array.isArray(f.cornerAngles)) &&
    (() => {
      try {
        readVertexCurvatures(dropped);
        return false;
      } catch (e) {
        return String(e.message).includes('the atom is not owned yet');
      }
    })());
const headEq = (p) => {
  const working = fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r/g, '');
  const head = execFileSync('git', ['show', `HEAD:${p}`], { cwd: repoRoot, encoding: 'utf8' }).replace(/\r/g, '');
  return working === head;
};
check('§4 (E5) WITNESS-ONLY: connectedSum · genesisModel · geometry.ts · the manifest all BYTE-IDENTICAL to HEAD (no engine change, no union — the finding needed none)',
  ['src/lib/connectedSum.ts', 'src/manuscript/genesisModel.ts', 'src/types/geometry.ts', 'docs/governance/ENGINE_FREEZE_MANIFEST.txt'].every(headEq));

console.log(
  `\n--- P3.5 THE COMBINE INVESTIGATION — THE FINDING: COMBINE RIDES FREE (the atom carries, the seal holds, the pinch refuses honestly): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

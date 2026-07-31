#!/usr/bin/env node

// DIAGNOSTIC — P1, THE SUBDIVIDE'S FORCED ANGLE-TRANSFORM: the chord splits
// the parent corner at each endpoint (θ → α+β, α=(d−1)π/n inscribed,
// β=θ−α); every other corner RIDES byte-unchanged; and because α+β=θ the
// vertex angle-sums never move — Gauss–Bonnet holds through the reshape
// AUTOMATICALLY. The gate is honest: only a REGULAR owned parent splits;
// irregular or un-owned parents leave the children UN-OWNED (nothing
// fabricated), and the misaligned-spread hazard (a parent's n-length array
// smeared onto smaller children) is cured in BOTH branches.
//
// THE TEETH:
//   §1 ★ THE TRANSFORM + THE VALUES on three real seeds (square diagonal
//      45+45 · hexagon 30+90 and 60+60 · pentagon 36+72) — measured child
//      arrays, aligned to each child's vertexIds, middles riding;
//   §2 ★★ THE χ-INVARIANT SEAL + the in-witness PLANT: GB == 2πχ before AND
//      after the subdivide (χ certified, unmoved — a resolution moves no χ);
//      one bent child corner (+0.1 rad) breaks the identity by EXACTLY 0.1;
//   §3 THE HONEST DEFERRAL: an un-owned parent → children un-owned + GB
//      refuses; an IRREGULAR parent (a REAL second-generation child face
//      with unequal corners) → the split returns null, children un-owned;
//   §4 NO FROZEN TOUCH (geometry.ts + the manifest byte-identical to HEAD —
//      no re-seal) · OWN-ONLY (no render register reads the angles).
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
const { loadForm } = req('src/lib/multiform.ts');
const { subdivideFace } = req('src/lib/surfaceRefinement.ts');
const { splitCornerAngles, readVertexCurvatures, gaussBonnetTotal } = req('src/lib/conformalAtom.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const near = (a, b, eps = 1e-9) => Math.abs(a - b) < eps;
const deg = (arr) => `[${arr.map((a) => ((a * 180) / Math.PI).toFixed(1)).join(', ')}]°`;
const arrNear = (a, b) => a.length === b.length && a.every((x, k) => near(x, b[k]));

console.log("P1 — the subdivide's forced angle-transform: θ → α+β at the chord, the middles ride, GB holds\n");

const G = () => usePlaygroundStore.getState();
G().resetPlayground();
const P = Math.PI;

// ---------------------------------------------------------------------------
// §1 ★ the transform + the values — three real seeds
// ---------------------------------------------------------------------------
console.log('----- §1 ★ square 45+45 · hexagon 30+90 / 60+60 · pentagon 36+72 -----');
const cutAt = (shape, i, j) => {
  const face = shape.faces[0];
  return subdivideFace(shape, face, face.vertexIds[i], face.vertexIds[j]);
};
const sq = G().invokeForm(nGon(4), 'p1s');
const sqCut = cutAt(sq, 0, 2);
const sqDisk = sqCut.shape.faces.find((f) => f.id.endsWith(':disk'));
const sqRest = sqCut.shape.faces.find((f) => f.id.endsWith(':rest'));
note(`square diagonal: disk ${deg(sqDisk.cornerAngles ?? [])} · rest ${deg(sqRest.cornerAngles ?? [])}`);
check('★ §1 SQUARE diagonal: disk [π/4, π/2, π/4] and rest [π/4, π/2, π/4] — 45·90·45 both, aligned to each child\'s 3 vertexIds',
  arrNear(sqDisk.cornerAngles ?? [], [P / 4, P / 2, P / 4]) &&
    arrNear(sqRest.cornerAngles ?? [], [P / 4, P / 2, P / 4]) &&
    sqDisk.cornerAngles.length === sqDisk.vertexIds.length &&
    sqRest.cornerAngles.length === sqRest.vertexIds.length);
const hexA = G().invokeForm(nGon(6), 'p1h');
const hexCutA = cutAt(hexA, 0, 2);
const hexDiskA = hexCutA.shape.faces.find((f) => f.id.endsWith(':disk'));
const hexRestA = hexCutA.shape.faces.find((f) => f.id.endsWith(':rest'));
note(`hexagon (0,2): disk ${deg(hexDiskA.cornerAngles ?? [])} · rest ${deg(hexRestA.cornerAngles ?? [])}`);
check('★ §1 HEXAGON (0,2): disk [30°, 120°, 30°] · rest [90°, 120°, 120°, 120°, 90°] — the 30+90 split, middles riding at 120°',
  arrNear(hexDiskA.cornerAngles ?? [], [P / 6, (2 * P) / 3, P / 6]) &&
    arrNear(hexRestA.cornerAngles ?? [], [P / 2, (2 * P) / 3, (2 * P) / 3, (2 * P) / 3, P / 2]));
const hexB = G().invokeForm(nGon(6), 'p1h3');
const hexCutB = cutAt(hexB, 0, 3);
const hexDiskB = hexCutB.shape.faces.find((f) => f.id.endsWith(':disk'));
const hexRestB = hexCutB.shape.faces.find((f) => f.id.endsWith(':rest'));
note(`hexagon (0,3): disk ${deg(hexDiskB.cornerAngles ?? [])} · rest ${deg(hexRestB.cornerAngles ?? [])}`);
check('★ §1 HEXAGON (0,3): both children [60°, 120°, 120°, 60°] — the 60+60 split',
  arrNear(hexDiskB.cornerAngles ?? [], [P / 3, (2 * P) / 3, (2 * P) / 3, P / 3]) &&
    arrNear(hexRestB.cornerAngles ?? [], [P / 3, (2 * P) / 3, (2 * P) / 3, P / 3]));
const pent = G().invokeForm(nGon(5), 'p1p');
const pentCut = cutAt(pent, 0, 2);
const pentDisk = pentCut.shape.faces.find((f) => f.id.endsWith(':disk'));
const pentRest = pentCut.shape.faces.find((f) => f.id.endsWith(':rest'));
note(`pentagon (0,2): disk ${deg(pentDisk.cornerAngles ?? [])} · rest ${deg(pentRest.cornerAngles ?? [])}`);
check('★ §1 PENTAGON (0,2): disk [36°, 108°, 36°] · rest [72°, 108°, 108°, 72°] — the 36+72 split (E2\'s third seed)',
  arrNear(pentDisk.cornerAngles ?? [], [P / 5, (3 * P) / 5, P / 5]) &&
    arrNear(pentRest.cornerAngles ?? [], [(2 * P) / 5, (3 * P) / 5, (3 * P) / 5, (2 * P) / 5]));
check('★ §1 (E2) the values ARE the formulas: α=(d−1)π/n · β=θ−α · α+β=θ on every seed (asserted structurally)',
  (() => {
    const cases = [
      { n: 4, d: 2 },
      { n: 6, d: 2 },
      { n: 6, d: 3 },
      { n: 5, d: 2 },
    ];
    return cases.every(({ n, d }) => {
      const theta = ((n - 2) * P) / n;
      const split = splitCornerAngles(Array(n).fill(theta), 0, d);
      if (!split) return false;
      const alpha = ((d - 1) * P) / n;
      return near(split.disk[0], alpha) && near(split.rest[0], theta - alpha) && near(split.disk[0] + split.rest[0], theta);
    });
  })());
check('§1 (E5) the MIDDLE corners byte-ride (every non-endpoint slot equals its parent slot exactly)',
  hexRestA.cornerAngles.slice(1, -1).every((a) => a === hexA.faces[0].cornerAngles[0]) &&
    hexDiskA.cornerAngles.slice(1, -1).every((a) => a === hexA.faces[0].cornerAngles[0]));

// ---------------------------------------------------------------------------
// §2 ★★ the χ-invariant seal + the plant
// ---------------------------------------------------------------------------
console.log('\n----- §2 ★★ Gauss–Bonnet through the reshape + the bent-corner plant -----');
const chiBefore = readFormInvariants(sq).chi;
const chiAfter = readFormInvariants(sqCut.shape).chi;
const gbBefore = gaussBonnetTotal(readVertexCurvatures(sq));
const gbAfter = gaussBonnetTotal(readVertexCurvatures(sqCut.shape));
note(`square: χ ${chiBefore}→${chiAfter} · GB ${(gbBefore / P).toFixed(6)}π → ${(gbAfter / P).toFixed(6)}π (2πχ = ${2 * chiAfter}π)`);
check('★★ §2 the SEAL is χ-INVARIANT: GB == 2πχ BEFORE and AFTER the subdivide (χ 1→1 certified — a resolution moves no χ; α+β=θ keeps every vertex sum)',
  chiBefore === 1 && chiAfter === 1 &&
    near(gbBefore, 2 * P * chiBefore) &&
    near(gbAfter, 2 * P * chiAfter));
check('§2 the hexagon subdivides seal too (both chords, GB == 2πχ after)',
  near(gaussBonnetTotal(readVertexCurvatures(hexCutA.shape)), 2 * P * readFormInvariants(hexCutA.shape).chi) &&
    near(gaussBonnetTotal(readVertexCurvatures(hexCutB.shape)), 2 * P * readFormInvariants(hexCutB.shape).chi));
// THE PLANT (runs every time): bend ONE child endpoint corner by +0.1 rad —
// α+β ≠ θ now, the endpoint vertex-sum moves, and the identity must break
// by exactly the bend.
const bent = {
  ...sqCut.shape,
  faces: sqCut.shape.faces.map((f) =>
    f.id.endsWith(':disk') ? { ...f, cornerAngles: f.cornerAngles.map((a, k) => (k === 0 ? a + 0.1 : a)) } : f,
  ),
};
const gbBent = gaussBonnetTotal(readVertexCurvatures(bent));
note(`plant (disk corner +0.1 rad): GB off by ${Math.abs(gbBent - 2 * P * chiAfter).toFixed(9)} (must be 0.1)`);
check('★★ §2 THE PLANT BITES: a bent split (α+β ≠ θ) breaks Gauss–Bonnet by EXACTLY the bend (0.1 rad)',
  near(Math.abs(gbBent - 2 * P * chiAfter), 0.1, 1e-9));

// ---------------------------------------------------------------------------
// §3 the honest deferral — un-owned and irregular parents
// ---------------------------------------------------------------------------
console.log('\n----- §3 the deferral: un-owned parents and irregular (2nd-generation) parents -----');
const bare = loadForm(nGon(4), 'p1b'); // NOT store-invoked — un-owned
const bareCut = cutAt(bare, 0, 2);
check('§3 an UN-OWNED parent leaves both children UN-OWNED (no smear of a missing atom) and GB REFUSES honestly',
  bareCut.shape.faces.every((f) => f.cornerAngles === undefined) &&
    (() => {
      try {
        readVertexCurvatures(bareCut.shape);
        return false;
      } catch (e) {
        return String(e.message).includes('the atom is not owned yet');
      }
    })());
// the IRREGULAR parent — a REAL second-generation subject: hexagon (0,3)'s
// child [60°,120°,120°,60°] has unequal corners; its diagonal must defer
const child = hexCutB.shape.faces.find((f) => f.id.endsWith(':rest'));
const secondGen = subdivideFace(hexCutB.shape, child, child.vertexIds[0], child.vertexIds[2]);
const gen2Kids = secondGen.shape.faces.filter((f) => f.id.includes(':rest:'));
note(`2nd-gen children: [${gen2Kids.map((f) => `${f.id.split(':').pop()} ${f.cornerAngles ? 'OWNED' : 'un-owned'}`).join(' · ')}]`);
check('§3 an IRREGULAR parent (the real [60,120,120,60] child) DEFERS: splitCornerAngles refuses and BOTH its children are UN-OWNED — nothing fabricated',
  splitCornerAngles(child.cornerAngles, 0, 2) === null &&
    gen2Kids.length === 2 &&
    gen2Kids.every((f) => f.cornerAngles === undefined));
check('§3 the untouched sibling (the disk) KEEPS its owned atom through the 2nd-generation cut (only the cut face\'s children move)',
  (() => {
    const disk = secondGen.shape.faces.find((f) => f.id.endsWith(':disk') && !f.id.includes(':rest:'));
    return Boolean(disk) && arrNear(disk.cornerAngles ?? [], [P / 3, (2 * P) / 3, (2 * P) / 3, P / 3]);
  })());

// ---------------------------------------------------------------------------
// §4 no frozen touch · own-only
// ---------------------------------------------------------------------------
console.log('\n----- §4 no frozen touch (no re-seal) · own-only -----');
const headEq = (p) => {
  const working = fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r/g, '');
  const head = execFileSync('git', ['show', `HEAD:${p}`], { cwd: repoRoot, encoding: 'utf8' }).replace(/\r/g, '');
  return working === head;
};
check('§4 (E6) src/types/geometry.ts BYTE-IDENTICAL to HEAD (no frozen touch)', headEq('src/types/geometry.ts'));
check('§4 (E6) the ENGINE FREEZE MANIFEST BYTE-IDENTICAL to HEAD (no re-seal — both changed files NOT_FROZEN)',
  headEq('docs/governance/ENGINE_FREEZE_MANIFEST.txt'));
const atomSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/conformalAtom.ts'), 'utf8');
check('§4 (E2) the split reads NO positions (no `.position` access in the atom module — combinatorics only)',
  !/\.position/.test(atomSrc));
check('§4 (E7) OWN-ONLY: no render register reads the angles (InkedForm · InkedPlainForm · InkedSkeleton · InkedDomain · laidBodyModel · laidInkedModel)',
  [
    'src/manuscript/InkedForm.tsx',
    'src/manuscript/InkedPlainForm.tsx',
    'src/manuscript/InkedSkeleton.tsx',
    'src/manuscript/InkedDomain.tsx',
    'src/manuscript/laidBodyModel.ts',
    'src/manuscript/laidInkedModel.ts',
  ].every((p) => !fs.readFileSync(path.join(repoRoot, p), 'utf8').includes('cornerAngles')));

console.log(
  `\n--- P1 THE CONFORMAL SUBDIVIDE (θ→α+β · middles ride · GB automatic): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

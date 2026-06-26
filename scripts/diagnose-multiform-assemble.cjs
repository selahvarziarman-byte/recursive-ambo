#!/usr/bin/env node

// DIAGNOSTIC — Enabler-1: multi-form load-and-assemble + source-namespaced cell ids.
//
// Asserts the R2 SEALED values (charter §4.1-4.6, including §4.3 carried-not-minted and
// the §4.5 tooth) on the canonical two-square fixture, through the REAL committed modules:
//   multiform.loadForm / multiform.assemble            (the new module under test)
//   lineage.primalMultiset / primalMultisetKey         (the canonical lineage primitive)
//   transformationLedger.shapeLineageOf / certifyFaithfulness   (the committed certifier)
// No hand-built ledgers: the ledger is the REAL `assemble(...)` output.
//
// Seal: .handoff/ENABLER_1_MULTIFORM_ASSEMBLE_R2_SEALED_VALUES.md (committed SHA-256 hash).
// If a run disagrees with a sealed value, that mismatch is the first real result — it is
// NOT massaged away.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

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

const { loadForm, assemble } = req('src/lib/multiform.ts');
const { primalMultiset, primalMultisetKey } = req('src/lib/lineage.ts');
const { shapeLineageOf, certifyFaithfulness } = req('src/lib/transformationLedger.ts');

let failures = 0;
function check(label, condition) {
  if (condition) {
    console.log(`PASS - ${label}`);
  } else {
    console.log(`FAIL - ${label}`);
    failures += 1;
  }
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const keyOf = (shape, id) => primalMultisetKey(primalMultiset(id, shape, new Map()));
const msEntries = (shape, id) => [...primalMultiset(id, shape, new Map()).entries()].sort();
const siteIn = (cert, id) => cert.perResultSite.find((s) => s.resultSiteId === id);

// ---- the canonical R2 fixture: two square forms u1/u2, identical corners A,B,C,D ----
const squareForm = () => ({
  name: 'square',
  vertices: [
    { id: 'A', position: [0, 0, 0] },
    { id: 'B', position: [1, 0, 0] },
    { id: 'C', position: [1, 1, 0] },
    { id: 'D', position: [0, 1, 0] },
  ],
  faces: [{ vertexIds: ['A', 'B', 'C', 'D'] }],
});

const u1 = loadForm(squareForm, 'u1');
const u2 = loadForm(squareForm, 'u2');

// ONE explicit boundary-identification gluing edge A-B(u1) <-> A-B(u2):
//   u1:A & u2:A -> child A* ;  u1:B & u2:B -> child B* ;  C,D of each survive.
const identification = {
  merges: [
    { resultId: 'A*', sources: ['u1:A', 'u2:A'] },
    { resultId: 'B*', sources: ['u1:B', 'u2:B'] },
  ],
};
const { shape: asm, ledger } = assemble([u1, u2], identification);
const asmSnapshot = JSON.stringify(asm); // derive-only guard: the reads below mutate nothing

const sites = ['u1:A', 'u1:B', 'u1:C', 'u1:D', 'u2:A', 'u2:B', 'u2:C', 'u2:D'];

console.log(
  'Fixture: two squares u1/u2, corners A,B,C,D | glue u1:A≡u2:A→A*, u1:B≡u2:B→B*; C,D survive\n',
);

// ===== [1] §4.1 — namespaced keys distinct (co-location ≠ identity, at the key level) =====
console.log('----- [1] §4.1 NAMESPACED KEYS DISTINCT -----');
const kU1A = keyOf(u1, 'u1:A');
const kU2A = keyOf(u2, 'u2:A');
check('§4.1 primalMultisetKey(u1:A) === "u1:A×1"', kU1A === 'u1:A×1');
check('§4.1 primalMultisetKey(u2:A) === "u2:A×1"', kU2A === 'u2:A×1');
check('§4.1 u1:A key !== u2:A key (distinct across universes)', kU1A !== kU2A);
for (const c of ['B', 'C', 'D']) {
  check(`§4.1 u1:${c} key !== u2:${c} key`, keyOf(u1, `u1:${c}`) !== keyOf(u2, `u2:${c}`));
}
note(`u1:A->"${kU1A}"  u2:A->"${kU2A}"`);

// ===== [2] §4.2 — the assemble ledger (REAL buildLedgerFromIdentification over 8 sites) =====
console.log('\n----- [2] §4.2 ASSEMBLE LEDGER -----');
const expectedForward = {
  'u1:A': 'A*',
  'u1:B': 'B*',
  'u1:C': 'u1:C',
  'u1:D': 'u1:D',
  'u2:A': 'A*',
  'u2:B': 'B*',
  'u2:C': 'u2:C',
  'u2:D': 'u2:D',
};
check(
  '§4.2 forward total over 8 sites, NO null',
  Object.keys(ledger.forward).length === 8 && Object.values(ledger.forward).every((v) => v !== null),
);
check(
  '§4.2 forward maps each site as sealed (u1:A,u2:A->A*; u1:B,u2:B->B*; C,D survive)',
  sites.every((s) => ledger.forward[s] === expectedForward[s]),
);
check('§4.2 pullBack[A*] === [u1:A, u2:A] (both parents, u1 first)', eq(ledger.pullBack['A*'], ['u1:A', 'u2:A']));
check('§4.2 pullBack[B*] === [u1:B, u2:B] (both parents, u1 first)', eq(ledger.pullBack['B*'], ['u1:B', 'u2:B']));
check(
  '§4.2 survivors are singletons (u1:C,u2:C,u1:D,u2:D each pull back to itself)',
  eq(ledger.pullBack['u1:C'], ['u1:C']) &&
    eq(ledger.pullBack['u2:C'], ['u2:C']) &&
    eq(ledger.pullBack['u1:D'], ['u1:D']) &&
    eq(ledger.pullBack['u2:D'], ['u2:D']),
);
note(`pullBack A*=${JSON.stringify(ledger.pullBack['A*'])}  B*=${JSON.stringify(ledger.pullBack['B*'])}`);

// ===== [3] §4.4 — co-location ≠ identity (namespaced certifyFaithfulness over the asm shape) =====
console.log('\n----- [3] §4.4 CO-LOCATION ≠ IDENTITY (namespaced shapeLineageOf) -----');
const lineageOf = shapeLineageOf(asm);
const cert = certifyFaithfulness({ forward: ledger.forward, pullBack: ledger.pullBack }, lineageOf);
const aStar = siteIn(cert, 'A*');
const bStar = siteIn(cert, 'B*');
check('§4.4 A* is lineage-heterogeneous', Boolean(aStar) && aStar.status === 'lineage-heterogeneous');
check('§4.4 A* lineageConflict === ["u1:A×1","u2:A×1"] (BOTH provenances)', Boolean(aStar) && eq(aStar.lineageConflict, ['u1:A×1', 'u2:A×1']));
check('§4.4 B* is lineage-heterogeneous', Boolean(bStar) && bStar.status === 'lineage-heterogeneous');
check('§4.4 B* lineageConflict === ["u1:B×1","u2:B×1"]', Boolean(bStar) && eq(bStar.lineageConflict, ['u1:B×1', 'u2:B×1']));
for (const s of ['u1:C', 'u2:C', 'u1:D', 'u2:D']) {
  check(`§4.4 ${s} is lineage-homogeneous (singleton survivor)`, Boolean(siteIn(cert, s)) && siteIn(cert, s).status === 'lineage-homogeneous');
}
check('§4.4 heterogeneousCount === 2', cert.heterogeneousCount === 2);
check('§4.4 operationStatus === UNFAITHFUL (the honest record of an explicit cross-provenance merge)', cert.operationStatus === 'UNFAITHFUL');
note(`heterogeneousCount=${cert.heterogeneousCount}  operationStatus=${cert.operationStatus}`);

// ===== [3b] §4.3 — lineage carries all roots: CARRIED, NOT MINTED =====
console.log('\n----- [3b] §4.3 CARRIED-NOT-MINTED (REAL lineage.primalMultiset over the asm shape) -----');
const msA = primalMultiset('A*', asm, new Map());
const msB = primalMultiset('B*', asm, new Map());
check('§4.3 primalMultiset(A*) === {u1:A->1, u2:A->1} (namespaced UNION of parent roots)', eq([...msA.entries()].sort(), [['u1:A', 1], ['u2:A', 1]]));
check('§4.3 primalMultisetKey(A*) === "u1:A×1|u2:A×1"', primalMultisetKey(msA) === 'u1:A×1|u2:A×1');
check('§4.3 A* MINTS NO fresh primal (its multiset has NO "A*" key)', !msA.has('A*'));
check('§4.3 primalMultiset(B*) === {u1:B->1, u2:B->1}', eq([...msB.entries()].sort(), [['u1:B', 1], ['u2:B', 1]]));
check('§4.3 primalMultisetKey(B*) === "u1:B×1|u2:B×1"', primalMultisetKey(msB) === 'u1:B×1|u2:B×1');
check('§4.3 B* MINTS NO fresh primal (no "B*" key)', !msB.has('B*'));
note(`primalMultiset(A*)=${JSON.stringify([...msA.entries()])}  key="${primalMultisetKey(msA)}"`);

// ===== [4] §4.5 — THE TOOTH: un-namespaced baseline must read FAITHFUL (the seal bites) =====
console.log('\n----- [4] §4.5 TOOTH (un-namespaced baseline lineageOf — the seal must BITE) -----');
const stripSource = (id) => (id.includes(':') ? id.slice(id.indexOf(':') + 1) : id);
const toothLineageOf = (siteId) => {
  // the REAL lineage multiset, with the source namespace stripped off each primal id —
  // the "what if we had NOT namespaced" baseline. u1:A and u2:A both collapse to "A×1".
  const stripped = new Map();
  for (const [primal, count] of primalMultiset(siteId, asm, new Map())) {
    const plain = stripSource(primal);
    stripped.set(plain, (stripped.get(plain) ?? 0) + count);
  }
  return primalMultisetKey(stripped);
};
const tooth = certifyFaithfulness({ forward: ledger.forward, pullBack: ledger.pullBack }, toothLineageOf);
check('§4.5 tooth: A* collapses to lineage-homogeneous (un-namespaced)', Boolean(siteIn(tooth, 'A*')) && siteIn(tooth, 'A*').status === 'lineage-homogeneous');
check('§4.5 tooth: B* collapses to lineage-homogeneous', Boolean(siteIn(tooth, 'B*')) && siteIn(tooth, 'B*').status === 'lineage-homogeneous');
check('§4.5 tooth: heterogeneousCount === 0', tooth.heterogeneousCount === 0);
check('§4.5 tooth: operationStatus === FAITHFUL (the FALSE cross-universe identity)', tooth.operationStatus === 'FAITHFUL');
check(
  '§4.5 THE BITE: namespaced (UNFAITHFUL, het=2) !== tooth (FAITHFUL, het=0)',
  cert.operationStatus !== tooth.operationStatus && cert.heterogeneousCount !== tooth.heterogeneousCount,
);
note(`namespaced: het=${cert.heterogeneousCount} ${cert.operationStatus}  |  tooth: het=${tooth.heterogeneousCount} ${tooth.operationStatus}`);

// ===== [5] §4.6 — namespaced injectivity (equal keys iff identical namespaced multisets) =====
console.log('\n----- [5] §4.6 NAMESPACED INJECTIVITY -----');
const siteKeys = sites.map((s) => keyOf(asm, s));
check('§4.6 8/8 site keys distinct', new Set(siteKeys).size === 8);
check('§4.6 child key A* !== B*', primalMultisetKey(msA) !== primalMultisetKey(msB));
const all = [...sites, 'A*', 'B*'];
let injective = true;
for (let i = 0; i < all.length; i += 1) {
  for (let j = i + 1; j < all.length; j += 1) {
    const keyEqual = keyOf(asm, all[i]) === keyOf(asm, all[j]);
    const multisetEqual = eq(msEntries(asm, all[i]), msEntries(asm, all[j]));
    if (keyEqual !== multisetEqual) injective = false;
  }
}
check('§4.6 primalMultisetKey injective over the 10 namespaced multisets (equal key iff equal multiset)', injective);
note(`distinct site keys=${new Set(siteKeys).size}/8  ;  A* key="${primalMultisetKey(msA)}"  B* key="${primalMultisetKey(msB)}"`);

// ===== discipline =====
console.log('\n----- discipline -----');
// no-provenance path: with NO source, ids stay PLAIN (the §4.7 byte-identical-to-today path).
const plain = loadForm(squareForm);
check('§4.7 no-provenance: loadForm() keeps PLAIN ids (vertex "A" present; no "u1:A")', Boolean(plain.vertices['A']) && !plain.vertices['u1:A']);
check('derive-only: assembled shape JSON byte-identical before/after all reads', JSON.stringify(asm) === asmSnapshot);
check('anti-mock: nothing auto-glued by name — only the 2 explicit merges produced children (A*,B*)', Object.keys(asm.vertices).length === 10 && Boolean(asm.vertices['A*']) && Boolean(asm.vertices['B*']));
note(`assembled vertices=${Object.keys(asm.vertices).length} (8 roots + A* + B*)`);

console.log(
  `\n--- multiform load-and-assemble (§4.1-4.6 + §4.3 carried-not-minted + §4.5 tooth): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

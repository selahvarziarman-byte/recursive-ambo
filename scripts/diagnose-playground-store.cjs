#!/usr/bin/env node

// DIAGNOSTIC — G0 playground shell store: standalone multi-form container.
//
// Anti-mock: require the REAL TypeScript modules through the same transpile hook
// pattern used by the committed diagnostics.

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

const { buildPlaygroundSquareForm, usePlaygroundStore } = req('src/store/playgroundStore.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('playgroundStore: G0 standalone multi-form container (invoke → store → select/remove)\n');

usePlaygroundStore.getState().resetPlayground();

// ---------------------------------------------------------------------------
// [1] source-less invocation keeps plain ids.
// ---------------------------------------------------------------------------
console.log('----- [1] source-less invoke keeps plain ids -----');
const plain = usePlaygroundStore.getState().invokeForm(buildPlaygroundSquareForm);
const plainVertexIds = Object.keys(plain.vertices).sort();
check('§6.1 invokeForm with no source keeps vertex id "A" present', Boolean(plain.vertices.A));
check('§6.1 invokeForm with no source creates no source-prefixed vertex ids', plainVertexIds.every((id) => !id.includes(':')));
note(`plain ids=${JSON.stringify(plainVertexIds)} shapeId=${plain.id}`);

// ---------------------------------------------------------------------------
// [2] two source namespaces co-locate names without identity.
// ---------------------------------------------------------------------------
console.log('\n----- [2] sourced invokes are distinct-namespaced forms -----');
const u1 = usePlaygroundStore.getState().invokeForm(buildPlaygroundSquareForm, 'u1');
const u2 = usePlaygroundStore.getState().invokeForm(buildPlaygroundSquareForm, 'u2');
check('§6.2 u1 form has namespaced vertex "u1:A"', Boolean(u1.vertices['u1:A']));
check('§6.2 u2 form has namespaced vertex "u2:A"', Boolean(u2.vertices['u2:A']));
check('§6.2 co-located A vertices are distinct ids', Boolean(u1.vertices['u1:A']) && Boolean(u2.vertices['u2:A']) && 'u1:A' !== 'u2:A');
check('§6.2 sourced form shape ids are distinct', u1.id !== u2.id);
note(`u1:A=${u1.vertices['u1:A']?.id} u2:A=${u2.vertices['u2:A']?.id}`);

// ---------------------------------------------------------------------------
// [3] simultaneous storage, provenance, select, remove.
// ---------------------------------------------------------------------------
console.log('\n----- [3] store holds multiple provenance-carrying forms -----');
const afterInvokes = usePlaygroundStore.getState();
check('§6.3 formOrder.length >= 2', afterInvokes.formOrder.length >= 2);
check('§6.3 u1 provenance is carried', afterInvokes.forms[u1.id]?.provenance.origin === 'invoked' && afterInvokes.forms[u1.id]?.provenance.source === 'u1');
check('§6.3 u2 provenance is carried', afterInvokes.forms[u2.id]?.provenance.origin === 'invoked' && afterInvokes.forms[u2.id]?.provenance.source === 'u2');

usePlaygroundStore.getState().selectForm(u2.id);
check('§6.3 selectForm switches currentFormId to u2', usePlaygroundStore.getState().currentFormId === u2.id);

usePlaygroundStore.getState().removeForm(u1.id);
const afterRemove = usePlaygroundStore.getState();
check('§6.3 removeForm drops u1', !afterRemove.forms[u1.id] && !afterRemove.formOrder.includes(u1.id));
check('§6.3 removeForm leaves u2 in the store', Boolean(afterRemove.forms[u2.id]) && afterRemove.formOrder.includes(u2.id));
note(`remaining formOrder=${JSON.stringify(afterRemove.formOrder)}`);

// ---------------------------------------------------------------------------
// [4] derive-only: reads do not mutate stored shape JSON.
// ---------------------------------------------------------------------------
console.log('\n----- [4] derive-only reads leave stored Shape JSON byte-identical -----');
const beforeReads = Object.fromEntries(
  Object.entries(usePlaygroundStore.getState().forms).map(([id, form]) => [
    id,
    JSON.stringify(form.shape),
  ]),
);
const readState = usePlaygroundStore.getState();
const readNames = readState.formOrder.map((id) => readState.forms[id]?.shape.name).filter(Boolean);
const afterReads = Object.fromEntries(
  Object.entries(usePlaygroundStore.getState().forms).map(([id, form]) => [
    id,
    JSON.stringify(form.shape),
  ]),
);
check(
  '§6.4 every stored Shape JSON is byte-identical before/after store reads',
  Object.keys(beforeReads).every((id) => beforeReads[id] === afterReads[id]),
);
note(`read form names=${JSON.stringify(readNames)}`);

console.log(
  `\n--- playgroundStore G0 container diagnostic: ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);

#!/usr/bin/env node

// DIAGNOSTIC — THE ESCAPED-FIELD CLASS'S SEAM FILTER (STAMP C-1 item 3).
//
// Her law at three sites: *the field is the draft, the sentence is the
// cure, and both shipped.* The cure is ONE filter at the card seam
// (refusalCopy.personReadableRefusal) — the frozen lib producers stay
// byte-untouched, and every card-bound refusal passes through it.
//
// THE CLAUSES, each on the REAL lib sentences (never paraphrases):
//   R1 ★ the designer's third instance (the Segment's deficit row): the
//        module prefix and the quoted namespaced id go; the address tail
//        and the praised copy stay.
//   R2 ★ the atom-not-owned sentence (my own probe met it live): a face id
//        whose tail is positional junk drops to the bare entity word —
//        individuation where it exists, never junk dressed as an address.
//   R3   the module prefix goes even with no quoted entity.
//   R4   a sentence with no machine half rides through byte-identical
//        (the filter must not chew good copy).
//   R5   the seams: BOTH card producers route through the filter
//        (deficitRegisterModel's refusal row · the view's acquire-refusal
//        line) — the class stays cured at its seams, not per instance.

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
      fileName: filename,
    }).outputText,
    filename,
  );
};
require.extensions['.tsx'] = require.extensions['.ts'];
const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { personReadableRefusal } = req('src/manuscript/refusalCopy.ts');

let failures = 0;
const check = (label, pass, detail = '') => {
  console.log(`${pass ? 'PASS' : 'FAIL'} - ${label}${detail ? ` — ${detail}` : ''}`);
  if (!pass) failures += 1;
};

console.log('THE ESCAPED-FIELD SEAM FILTER — the sentence rides, the field stays in the log\n');

const r1 = personReadableRefusal(
  'conformalAtom: vertex "w3:v0" has no incident face corner — an isolated vertex carries no angle and no clause',
);
check(
  'R1 ★ the third instance: prefix + namespace + quotes go; the address tail and her praised copy stay',
  r1 === 'the vertex v0 has no incident face corner — an isolated vertex carries no angle and no clause',
  r1,
);

const r2 = personReadableRefusal(
  'conformalAtom: face "face:multiform:w700:4-gon:0" carries no cornerAngles — the atom is not owned yet (stamp at the invocation seam first; nothing is fabricated)',
);
check(
  'R2 ★ a junk tail drops to the bare entity word — never junk dressed as an address',
  r2 === 'the face carries no cornerAngles — the atom is not owned yet (stamp at the invocation seam first; nothing is fabricated)',
  r2,
);

const r3 = personReadableRefusal('acquireComplex: the complex did not acquire');
check('R3 the module prefix goes even with no quoted entity', r3 === 'the complex did not acquire', r3);

const good = 'the reading refused — no cell owns this atom';
check('R4 a clean sentence rides through byte-identical', personReadableRefusal(good) === good);

const deficitSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/deficitRegisterModel.ts'), 'utf8');
const viewSrc = fs.readFileSync(path.join(repoRoot, 'src/manuscript/ManuscriptView.tsx'), 'utf8');
check(
  'R5 both card seams route through the filter (the class stays cured at its seams)',
  deficitSrc.includes('personReadableRefusal(model.refusal') &&
    viewSrc.includes('personReadableRefusal(argument.refusal)'),
);

console.log(`\n${failures === 0 ? 'ALL CLAUSES PASS — the seam filter holds' : `${failures} CLAUSE(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);

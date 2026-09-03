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

const { personReadableRefusal, personReadableProvenance } = req('src/manuscript/refusalCopy.ts');

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
  'R1 ★ (A-4 item 2 recut — the QUANTIFIER law) the isolated-vertex refusal reads the CHECKED sentence: it names NO vertex (the lib throws at the first it meets; a Segment has two — an address would individuate what the fact does not); her praised copy stays',
  r1 === 'there is a vertex here with no face corner — an isolated vertex carries no angle and no clause',
  r1,
);

const r2 = personReadableRefusal(
  'conformalAtom: face "face:multiform:w700:4-gon:0" carries no cornerAngles — the atom is not owned yet (stamp at the invocation seam first; nothing is fabricated)',
);
check(
  'R2 ★ (A-4 item 2 recut — the seam carries CHECKED sentences) the not-owned refusal reads the researcher’s faithful form: OWNED kept, the reroute tail dropped (B-103 §2b), no id dressed as an address',
  r2 === "this face's corner angles are not owned yet — nothing is fabricated",
  r2,
);
// A-4 item 2 — the generic field-strip still governs any UNMAPPED sentence:
// a junk-tailed id still drops to the bare entity word (the C-1 law stands
// underneath the checked sentences, never replaced by them)
const r2b = personReadableRefusal('conformalAtom: face "face:multiform:w700:4-gon:0" refused for a reason no checked sentence covers');
check(
  'R2b the unmapped case keeps the C-1 field-strip: junk tail → bare entity word',
  r2b === 'the face refused for a reason no checked sentence covers',
  r2b,
);
const r2c = personReadableRefusal(
  'conformalAtom: pillar "edge:w9:p3" carries no owned dihedral in any cell — the atom is not owned yet (stamp at the thicken seam first; nothing is fabricated)',
);
check(
  'R2c (A-4 item 2) the pillar’s not-owned refusal reads its checked sentence — OWNED kept, tail dropped',
  r2c === "this edge's dihedral is not owned yet — nothing is fabricated",
  r2c,
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

// A-4 item 3 — THE FOURTH FIELD SITE: the loaded form's provenance line is
// minted in the FROZEN genesisModel with a raw namespaced id; the subtitle
// seam speaks a person-sentence, the designation where the file carried one.
const named = new Map([['shape:multiform:w2:6-gon', 'the hexagon universe']]);
const p1 = personReadableProvenance('loaded — universe “shape:multiform:w2:6-gon” (source-tagged, not a doorway)', named);
check('R6 ★ (A-4 item 3) the loaded provenance speaks the DESIGNATION where the S2 split carried one — the id never enters prose',
  p1 === 'loaded from the universe “the hexagon universe”', p1);
const p2 = personReadableProvenance('loaded — universe “shape:multiform:w9:4-gon” (source-tagged, not a doorway)', named);
check('R6b (A-4 item 3) an unnamed source falls to the plain sentence — still no address in prose',
  p2 === 'loaded from a universe file', p2);
const p3 = personReadableProvenance('invoked primitive (right-click on paper)', named);
check('R6c the invoked form’s own subtitle (the model the ruling named) rides through byte-identical',
  p3 === 'invoked primitive (right-click on paper)', p3);

console.log(`\n${failures === 0 ? 'ALL CLAUSES PASS — the seam filter holds' : `${failures} CLAUSE(S) FAILED`}`);
process.exit(failures === 0 ? 0 : 1);

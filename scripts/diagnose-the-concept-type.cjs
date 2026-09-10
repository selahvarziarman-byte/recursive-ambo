#!/usr/bin/env node

// DIAGNOSTIC — THE CONCEPT LAYER'S TYPE (STAMP C-6TYPE, sanctioned by Arman
// verbatim "sanctioned (a)", Δ75; the type landed alone in its frozen commit).
//
// ⛔ THE INSTRUMENT SHARES THE CLAIM'S TYPE SYSTEM. The claim is about what a
// packet and an edge can HOLD, so the census is the COMPILER — a grep cannot
// tell a field that exists from a field that type-checks, and a runtime read
// cannot tell an absent optional from a fabricated default. Every clause below
// type-checks a fixture against the committed `src/types/geometry.ts` and
// asserts what the compiler says.
//
// WHAT IT HOLDS (ADR 0031 §1.1, §5): at a CORNER a cast concept-space — roles,
// typed relations of ANY finite arity, three-valued instances, axioms, marks;
// on an EDGE the person's `J` — a partial isomorphism, symmetric by carrying
// ONE record per edge, possibly absent. Everything else is derived and never
// stored. Nothing in the engine writes either field yet: this witness is the
// type's own falsifier, not a reading.

'use strict';
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const repoRoot = path.resolve(__dirname, '..');
const geometryPath = path.join(repoRoot, 'src/types/geometry.ts').split(path.sep).join('/');
const geometryModule = geometryPath.replace(/\.ts$/, '');
const FIXTURE = path.join(repoRoot, '__concept-type-fixture__.ts').split(path.sep).join('/');

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined && !cond ? ` — ${detail}` : ''}`);
  if (!cond) failures += 1;
};

// type-check one fixture source against the committed types; return its errors
const errorsOf = (source) => {
  const host = ts.createCompilerHost({ strict: true }, true);
  const readFile = host.readFile.bind(host);
  const fileExists = host.fileExists.bind(host);
  const getSourceFile = host.getSourceFile.bind(host);
  host.readFile = (f) => (f === FIXTURE ? source : readFile(f));
  host.fileExists = (f) => (f === FIXTURE ? true : fileExists(f));
  host.getSourceFile = (f, langVersion, onError, shouldCreate) =>
    f === FIXTURE
      ? ts.createSourceFile(f, source, langVersion, true)
      : getSourceFile(f, langVersion, onError, shouldCreate);
  const program = ts.createProgram([FIXTURE], {
    strict: true,
    noEmit: true,
    target: ts.ScriptTarget.ES2020,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    module: ts.ModuleKind.ESNext,
    skipLibCheck: true,
  }, host);
  return ts
    .getPreEmitDiagnostics(program)
    .filter((d) => d.file && d.file.fileName === FIXTURE)
    .map((d) => ts.flattenDiagnosticMessageText(d.messageText, ' '));
};

const HEAD = `import type { ConceptSpace, EdgeIdentification, VertexDataPacket, Edge } from '${geometryModule}';\n`;

// a cast with a THREE-place relation, a known-false instance, an arity-1 type
// declared per role, an axiom, marks and warrant — the mold's own shape
const CAST = `
const cast: ConceptSpace = {
  roles: [
    { id: 'r0', label: 'the finger', types: { 'member-status': 'has' }, marks: { seen: 3 } },
    { id: 'r1', types: { 'member-status': 'UNKNOWN' } },
    { id: 'r2' },
  ],
  signature: [
    { type: 'sustains', arity: 2 },
    { type: 'passes-between', arity: 3 },
    { type: 'member-status', arity: 1 },
  ],
  relations: [
    { type: 'sustains', terms: ['r1', 'r0'], polarity: 'holds' },
    { type: 'passes-between', terms: ['r0', 'r1', 'r2'], polarity: 'holds' },
    { type: 'sustains', terms: ['r2', 'r0'], polarity: 'does-not-hold' },
  ],
  axioms: ['forall x y. sustains(x, y) -> not sustains(y, x)'],
  warrant: { substrates_seen: 2, second_reader: false },
};
`;

const PACKET = `
const held: VertexDataPacket = { label: 'C', notes: '', color: '#000', tags: [], custom: {}, cast };
const bare: VertexDataPacket = { label: 'C', notes: '', color: '#000', tags: [], custom: {} };
`;

const EDGE = `
const j: EdgeIdentification = {
  roles: [['r0', 's4'], ['r1', 's7']],
  types: [['sustains', 'presupposes']],
  support: { 'r0': 2 },
  fiat: ['r1'],
};
const carried: Edge = { id: 'e', vertexIds: ['a', 'b'], sourceVertexIds: ['a', 'b'], identification: j };
const beside: Edge = { id: 'e', vertexIds: ['a', 'b'], sourceVertexIds: ['a', 'b'] };
`;

const use = `
void held; void bare; void carried; void beside;
`;

console.log('THE CONCEPT LAYER\'S TYPE — what a corner may HOLD and an edge may CARRY (STAMP C-6TYPE)\n');

console.log('----- §1 the cast a corner holds, and the J an edge carries, TYPE-CHECK -----');
const whole = errorsOf(HEAD + CAST + PACKET + EDGE + use);
check('§1 ★★ THE WHOLE FIXTURE COMPILES against the committed types: a cast carrying a THREE-place relation, a known-false instance, an arity-1 type declared per role, an axiom, marks and warrant — assigned to a packet\'s `cast`; and an EdgeIdentification with role pairs, τ, support and a fiat pair — assigned to an edge\'s `identification`',
  whole.length === 0, JSON.stringify(whole.slice(0, 4)));
check('§1 ARITY IS ANY FINITE n: the signature carries the length and a 3-term tuple is lawful — "arity is two" was withdrawn (MOLD §8 G1) and the type does not re-impose it',
  errorsOf(HEAD + CAST + `void cast;`).length === 0);

console.log('\n----- §2 the ABSENCE is lawful — a corner without a cast, an edge without a J -----');
check('§2 ★ a packet with NO `cast` and an edge with NO `identification` type-check: the person has not chosen, and that is a TRUE ABSENCE, never a default and never a placeholder',
  errorsOf(HEAD + `
const bare: VertexDataPacket = { label: 'C', notes: '', color: '#000', tags: [], custom: {} };
const beside: Edge = { id: 'e', vertexIds: ['a', 'b'], sourceVertexIds: ['a', 'b'] };
void bare; void beside;
`).length === 0);
check('§2 …and a packet\'s other five fields are still REQUIRED — the cast is additive, it did not loosen the packet (a fixture missing `label` fails)',
  errorsOf(HEAD + `
const missing: VertexDataPacket = { notes: '', color: '#000', tags: [], custom: {} };
void missing;
`).length > 0);

console.log('\n----- §3 ★★ LAW 24 — the type can REFUSE: three-valued BY CONSTRUCTION, no third token -----');
const badPolarity = errorsOf(HEAD + `
const cast: ConceptSpace = {
  roles: [{ id: 'r0' }],
  signature: [{ type: 'sustains', arity: 2 }],
  relations: [{ type: 'sustains', terms: ['r0', 'r0'], polarity: 'unknown' }],
  axioms: [],
};
void cast;
`);
check('§3 ★★ A THIRD STORED VALUE FAILS TO COMPILE: `polarity: \'unknown\'` is refused — the two KNOWN values are the only ones a record may carry, and UNRECORDED is the ABSENCE of the tuple, never a token (MOLD §2.6, §8 G2). The compiler names polarity',
  badPolarity.length > 0 && badPolarity.some((m) => /polarity|holds|does-not-hold/.test(m)),
  JSON.stringify(badPolarity.slice(0, 3)));
check('§3 …and the same fixture with a KNOWN polarity compiles — so §3 failed on the value, not on the fixture',
  errorsOf(HEAD + `
const cast: ConceptSpace = {
  roles: [{ id: 'r0' }],
  signature: [{ type: 'sustains', arity: 2 }],
  relations: [{ type: 'sustains', terms: ['r0', 'r0'], polarity: 'does-not-hold' }],
  axioms: [],
};
void cast;
`).length === 0);
check('§3 an unknown FIELD on a cast is refused too — the mold\'s shape is the shape, not a bag (a `weights` field fails)',
  errorsOf(HEAD + `
const cast: ConceptSpace = { roles: [], signature: [], relations: [], axioms: [], weights: {} };
void cast;
`).length > 0);

console.log('\n----- §4 the frozen file carries it, and nothing reads it yet -----');
const geomSrc = fs.readFileSync(geometryPath, 'utf8');
check('§4 the type lives INLINE in the frozen types file — a separate module this frozen file imported would itself freeze by the closure law, so inline is the smaller union (the file\'s own imports are unchanged: it imports nothing)',
  /export interface ConceptSpace \{/.test(geomSrc) && /export interface EdgeIdentification \{/.test(geomSrc) &&
    !/^import /m.test(geomSrc));
const readers = [];
for (const dir of ['src/lib', 'src/manuscript', 'src/playground', 'src/components', 'src/store', 'src/types']) {
  const root = path.join(repoRoot, dir);
  if (!fs.existsSync(root)) continue;
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) walk(f);
      else if (/\.tsx?$/.test(e.name)) {
        const src = fs.readFileSync(f, 'utf8');
        if (/\.cast\b|\.identification\b|\bConceptSpace\b|\bEdgeIdentification\b/.test(src) && f !== geometryPath.split('/').join(path.sep)) {
          readers.push(path.relative(repoRoot, f).split(path.sep).join('/'));
        }
      }
    }
  };
  walk(root);
}
check('§4 ★ NOTHING WRITES OR READS EITHER FIELD YET: no file under the engine roots, the components or the store mentions `cast`, `identification`, `ConceptSpace` or `EdgeIdentification` — the type landed ALONE, with no surface, no loader, no producer and no consumer, exactly as the stamp ordered',
  readers.length === 0, `readers: ${JSON.stringify(readers)}`);

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-CONCEPT-TYPE: ALL PASS — the corner may hold a cast, the edge may carry a J, and the absence of either is lawful' : `DIAGNOSE-THE-CONCEPT-TYPE: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

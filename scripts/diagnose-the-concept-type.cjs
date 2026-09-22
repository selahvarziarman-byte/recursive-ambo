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
// C-6c (2026-09-19) superseded the "nothing reads either field" law for the CAST:
// the corner's cast now has exactly one loader (castLoader), one writer (the
// packet editor, `updateSelectedVertexData({ cast })`) and one reader (the
// card in Panels). The identification stays ALONE — no J is written anywhere
// (C-6c's boundary; the five promises' second).
const castReaders = [];
const identificationReaders = [];
for (const dir of ['src/lib', 'src/manuscript', 'src/playground', 'src/components', 'src/store', 'src/types']) {
  const root = path.join(repoRoot, dir);
  if (!fs.existsSync(root)) continue;
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) walk(f);
      else if (/\.tsx?$/.test(e.name) && f !== geometryPath.split('/').join(path.sep)) {
        const src = fs.readFileSync(f, 'utf8');
        const rel = path.relative(repoRoot, f).split(path.sep).join('/');
        if (/\.cast\b|\bConceptSpace\b/.test(src)) castReaders.push(rel);
        if (/\.identification\b|\bEdgeIdentification\b/.test(src)) identificationReaders.push(rel);
      }
    }
  };
  walk(root);
}
// C-6d (α) (2026-09-19): the J register's quantities are COMPUTED ON THE TYPE in
// src/lib/jRegister.ts — it reads ConceptSpace and the τ/roles of an
// EdgeIdentification as INPUTS and writes nothing. C-6d (β): the register's
// SURFACE (src/components/JRegisterPanel.tsx) reads the two corners' casts and
// the edge's identification; the store's ONE writer writes `roles` and `types`.
// C-7a (2026-09-22): THE INSIDE — the incidence presentation computed on the type
// (src/lib/castInside.ts) and its drawing on the canvas (src/components/CastInsideDiagram.tsx),
// both readers of the corner's cast; Workspace3D mounts the panel by vertex id and reads
// no cast itself.
const CAST_READERS = ['src/components/CastInsideDiagram.tsx', 'src/components/JRegisterPanel.tsx', 'src/components/Panels.tsx', 'src/components/VertexPacketEditor.tsx', 'src/lib/castInside.ts', 'src/lib/castLoader.ts', 'src/lib/jRegister.ts'];
check('§4 ★ THE CAST HAS EXACTLY ITS SEVEN (C-6c + C-6d (α) + (β) + C-7a): the loader (src/lib/castLoader.ts), the writer (the packet editor), the reader (the card in Panels), the register that computes on the type (src/lib/jRegister.ts), the register\'s surface (src/components/JRegisterPanel.tsx), the INSIDE computed on the type (src/lib/castInside.ts) and its diagram on the canvas (src/components/CastInsideDiagram.tsx) — no other file under the engine roots, the components or the store mentions `cast` or `ConceptSpace`',
  JSON.stringify([...castReaders].sort()) === JSON.stringify(CAST_READERS), `readers: ${JSON.stringify(castReaders)}`);
check('§4 ★ THE IDENTIFICATION IS WRITTEN BY EXACTLY ONE SITE AND READ BY THREE NAMED FILES (C-6d (β), RECORD NOT READING): the files mentioning the edge\'s `identification` or `EdgeIdentification` are the register (src/lib/jRegister.ts — τ and roles as INPUTS), its surface (src/components/JRegisterPanel.tsx — reads the record, derives support and fiat at every render) and the store (src/store/geometryStore.ts — the one writer, `writeEdgeIdentification`, `roles` and `types` only); exactly ONE write site in the whole tree, in the store; `support` and `fiat` written by nothing',
  JSON.stringify([...identificationReaders].sort()) === JSON.stringify(['src/components/JRegisterPanel.tsx', 'src/lib/jRegister.ts', 'src/store/geometryStore.ts']) &&
    (() => {
      const writes = [];
      for (const dir of ['src/lib', 'src/manuscript', 'src/playground', 'src/components', 'src/store']) {
        const root = path.join(repoRoot, dir);
        if (!fs.existsSync(root)) continue;
        const walk = (d) => {
          for (const e of fs.readdirSync(d, { withFileTypes: true })) {
            const f = path.join(d, e.name);
            if (e.isDirectory()) walk(f);
            // a WRITE of the edge's field: an assignment to it, or an inline J literal — not the word in another
            // vocabulary (multiform's BoundaryIdentification parameter, the manuscript's rim identification)
            else if (/\.tsx?$/.test(e.name)) {
              const src = fs.readFileSync(f, 'utf8');
              const sites = src.match(/\.identification\s*=[^=]|\bidentification\s*:\s*\{/g) ?? [];
              for (const s of sites) writes.push(`${path.relative(repoRoot, f).split(path.sep).join('/')}: ${s.trim()}`);
              // the derived fields are written by nothing — no `support:` or `fiat:` inside an identification literal anywhere
              if (/\bidentification\s*:\s*\{[^}]*\b(support|fiat)\s*:/s.test(src)) writes.push(`${path.relative(repoRoot, f)}: writes a derived field`);
            }
          }
        };
        walk(root);
      }
      return writes.length === 1 && writes[0].startsWith('src/store/geometryStore.ts:');
    })(),
  `readers: ${JSON.stringify(identificationReaders)}`);

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-CONCEPT-TYPE: ALL PASS — the corner may hold a cast, the edge may carry a J, and the absence of either is lawful' : `DIAGNOSE-THE-CONCEPT-TYPE: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);

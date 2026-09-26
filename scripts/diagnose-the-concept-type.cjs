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
// C-7b (2026-09-22): THE MIDPOINT — the pushout and the trace computed on the type
// (src/lib/midpointGlue.ts) and the unfolded surface on the canvas (src/components/
// MidpointSurface.tsx, which reads the two parents' casts and the edge's record); the
// store reads the corners' casts to CHECK an act at the act (C-7b — the refusal is the act's).
// C-5 (2026-09-23): THE FACE computed on the type — src/lib/faceReading.ts reads three corners' casts and three edges' records
// as INPUTS (the residue, the corner-local guard); its surface is the midpoint's (FaceRecord in MidpointSurface.tsx).
// C-8 (2026-09-23, Δ85 · Δ86): THE RESOLVER — src/lib/spaceOf.ts reads a SEED corner's cast (the only cast ever read as
// held; a loaded cast on a born vertex is not read) and derives every born vertex's space; the inside's panel and the store
// no longer read `data.cast` at all — they read `spaceOf` (RECORD, NOT READING: one resolver, re-derived at every read).
const CAST_READERS = ['src/components/JRegisterPanel.tsx', 'src/components/MidpointSurface.tsx', 'src/components/Panels.tsx', 'src/components/VertexPacketEditor.tsx', 'src/lib/castInside.ts', 'src/lib/castLoader.ts', 'src/lib/faceReading.ts', 'src/lib/instanceSpace.ts', 'src/lib/jRegister.ts', 'src/lib/midpointGlue.ts', 'src/lib/respects.ts', 'src/lib/spaceOf.ts'];
check('§4 ★ THE CAST HAS EXACTLY ITS TWELVE (C-6c + C-6d (α) + (β) + C-7a + C-7b + C-5 + C-8 + C-14 + MODES-1 B2 — the INSTANCE SPACE computed on the type, src/lib/instanceSpace.ts: the child of an edge from the corners’ casts, D4): the loader (src/lib/castLoader.ts), the writer (the packet editor — the offer on the seed\'s corners alone), the reader (the card in Panels), the register that computes on the type (src/lib/jRegister.ts), the register\'s surface (src/components/JRegisterPanel.tsx), the INSIDE computed on the type (src/lib/castInside.ts), the MIDPOINT computed on the type (src/lib/midpointGlue.ts) and its unfolded surface (src/components/MidpointSurface.tsx — the casts as the resolver hands them), the FACE computed on the type (src/lib/faceReading.ts — three corners\' casts as inputs to the residue and the guard), and THE RESOLVER (src/lib/spaceOf.ts — the one reader of a seed corner\'s cast as held; every born vertex\'s space derived), and the RESPECTS computed on the type (src/lib/respects.ts — C-14: the born concept\'s `⟨X⟩` relation-types on M\'s points, holds-only, and the meet-core beside); the inside\'s diagram on the canvas and the store read `spaceOf`, never `data.cast` (C-8 item 1) — no other file under the engine roots, the components or the store mentions `cast` or `ConceptSpace`',
  JSON.stringify([...castReaders].sort()) === JSON.stringify(CAST_READERS), `readers: ${JSON.stringify(castReaders)}`);
// C-7e (2026-09-22, Δ84): THE CARRY — src/lib/ambo.ts reads the parent shape's record as INPUT and copies its `roles`
// and `types` onto the re-derived edge of the same pair (mirrored when the edge is walked the other way); a second site
// that puts `identification` on an edge, NAMED here as the carrier — never a new record, never a derived field.
check('§4 ★ THE IDENTIFICATION HAS ONE WRITER AND ONE CARRIER, AND NINE NAMED READERS (C-6d (β) + C-7b + C-7e + C-5 + C-8 + C-14, RECORD NOT READING): the files mentioning the edge\'s `identification` or `EdgeIdentification` are the register (src/lib/jRegister.ts — τ and roles as INPUTS; the refusal at the act), its surface (src/components/JRegisterPanel.tsx — reads the record, derives support and fiat at every render), the midpoint\'s glue (src/lib/midpointGlue.ts — roles and τ as INPUTS to the pushout), the midpoint\'s surface (src/components/MidpointSurface.tsx — reads the source edge\'s record), the face (src/lib/faceReading.ts — three edges\' records as INPUTS to the residue, read in the walk\'s direction from each edge\'s `vertexIds`), the RESOLVER (src/lib/spaceOf.ts — the record an edge lawfully carries as INPUT to the gluing its kind fixes, a candidate read in its place, never written), the RESPECTS (src/lib/respects.ts — C-14: the unconditional record as INPUT to the meet-core, through which the resolver\'s one reader now reads; never written), the store (src/store/geometryStore.ts — the one WRITER, `writeEdgeIdentification`, `roles` and `types` only; the midpoint\'s acts route through it) and the ambo (src/lib/ambo.ts — the CARRIER: copies a parent edge\'s record onto the same pair at a dissection, `roles` and `types` from the source record and nothing else); exactly TWO sites put `identification` on an edge in the whole tree — the writer and the carrier, each named; `support` and `fiat` written by nothing',
  JSON.stringify([...identificationReaders].sort()) === JSON.stringify(['src/components/JRegisterPanel.tsx', 'src/components/MidpointSurface.tsx', 'src/lib/ambo.ts', 'src/lib/faceReading.ts', 'src/lib/jRegister.ts', 'src/lib/midpointGlue.ts', 'src/lib/respects.ts', 'src/lib/spaceOf.ts', 'src/store/geometryStore.ts']) &&
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
      const amboSrc = fs.readFileSync(path.join(repoRoot, 'src/lib/ambo.ts'), 'utf8');
      return writes.length === 2 && writes.some((w) => w.startsWith('src/store/geometryStore.ts:')) && writes.some((w) => w.startsWith('src/lib/ambo.ts:')) &&
        /identification: \{ roles: copy\(source\.identification\.roles\), types: copy\(source\.identification\.types\) \}/.test(amboSrc);
    })(),
  `readers: ${JSON.stringify(identificationReaders)}`);

// C-7c (2026-09-22, Δ80): the register's surface is UNMOUNTED but its file stays on disk by charter — so
// it still READS the type and stays in both lists above (the census is by disk, not by mount; the
// letter's "readers drop by one" premise was measured false and said). The mount is pinned apart.
check('§4 ★ THE RETIRED SURFACE IS UNMOUNTED AND STILL COUNTED (C-7c): no file under src imports JRegisterPanel (Panels.tsx no longer mounts it); the file stays on disk, so the census lists above keep it — a reader by disk, not by mount',
  (() => {
    const importers = [];
    const walk = (d) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const f = path.join(d, e.name);
        if (e.isDirectory()) walk(f);
        else if (/\.tsx?$/.test(e.name) && fs.readFileSync(f, 'utf8').includes("from './JRegisterPanel'")) importers.push(path.relative(repoRoot, f).split(path.sep).join('/'));
      }
    };
    walk(path.join(repoRoot, 'src'));
    return importers.length === 0 && fs.existsSync(path.join(repoRoot, 'src/components/JRegisterPanel.tsx'));
  })());

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-CONCEPT-TYPE: ALL PASS — the corner may hold a cast, the edge may carry a J, and the absence of either is lawful' : `DIAGNOSE-THE-CONCEPT-TYPE: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
